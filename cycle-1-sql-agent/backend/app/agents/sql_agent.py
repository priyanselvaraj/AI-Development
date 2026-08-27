import time
import uuid
from typing import Dict, Any, List, Optional
from datetime import datetime
from app.config import settings
from app.services.database import db_service
from app.services.llm_service import llm_service
from app.services.logger_service import agent_logger
from app.utils.sql_validator import sql_validator
from app.agents.prompts import SQL_AGENT_SYSTEM_PROMPT, SELF_CORRECTION_PROMPT_TEMPLATE

class AgentIterationStep:
    def __init__(self, iteration: int):
        self.iteration = iteration
        self.timestamp = datetime.utcnow().isoformat()
        self.perceive: Dict[str, Any] = {}
        self.plan: Dict[str, Any] = {}
        self.act: Dict[str, Any] = {}
        self.observe: Dict[str, Any] = {}
        self.duration_ms: float = 0.0
        self.status: str = "RUNNING"  # SUCCESS, FAILED, RETRYING

    def to_dict(self) -> Dict[str, Any]:
        return {
            "iteration": self.iteration,
            "timestamp": self.timestamp,
            "duration_ms": round(self.duration_ms, 2),
            "status": self.status,
            "perceive": self.perceive,
            "plan": self.plan,
            "act": self.act,
            "observe": self.observe
        }

class SQLSelfCorrectingAgent:
    def __init__(self, max_iterations: int = None):
        self.max_iterations = max_iterations or settings.MAX_ITERATIONS

    async def run(self, user_question: str, simulate_initial_error: bool = False) -> Dict[str, Any]:
        """
        Executes the Autonomous Perceive -> Plan -> Act -> Observe loop.
        If simulate_initial_error is True (used in demo & testing), the agent will intentionally
        make a minor typo on iteration 1 to demonstrate live self-correction recovery in iteration 2.
        """
        query_id = str(uuid.uuid4())
        start_time = time.time()
        agent_logger.info(f"[{query_id}] Starting SQL Agent Loop for: '{user_question}'")

        schema_summary = db_service.get_schema_summary_text()
        full_schema = db_service.get_database_schema()

        iterations_trace: List[Dict[str, Any]] = []
        is_success = False
        final_sql = ""
        final_result: Dict[str, Any] = {}
        previous_observation = ""
        previous_sql = ""

        for iteration in range(1, self.max_iterations + 1):
            step_start = time.time()
            step = AgentIterationStep(iteration=iteration)
            agent_logger.info(f"[{query_id}] --- Starting Iteration {iteration}/{self.max_iterations} ---", extra={"iteration": iteration})

            # ==========================================
            # 1. PERCEIVE
            # ==========================================
            step.perceive = {
                "user_intent": user_question,
                "schema_context": schema_summary,
                "available_tables": list(full_schema.keys()),
                "is_correction": iteration > 1,
                "previous_error_context": previous_observation if iteration > 1 else None
            }
            agent_logger.info(f"[{query_id}] PERCEIVE: Analyzed request and schema. Tables: {list(full_schema.keys())}", extra={"agent_step": "PERCEIVE", "iteration": iteration})

            # ==========================================
            # 2. PLAN
            # ==========================================
            if iteration == 1:
                user_prompt = f"USER QUESTION: {user_question}\n\nDATABASE SCHEMA:\n{schema_summary}\n\nGenerate optimal SQLite query."
            else:
                user_prompt = SELF_CORRECTION_PROMPT_TEMPLATE.format(
                    question=user_question,
                    schema=schema_summary,
                    iteration_number=iteration - 1,
                    previous_sql=previous_sql,
                    status="FAILED",
                    observation=previous_observation
                )

            llm_response = await llm_service.generate_plan_and_sql(
                system_prompt=SQL_AGENT_SYSTEM_PROMPT,
                user_prompt=user_prompt
            )

            generated_sql = sql_validator.sanitize(llm_response.get("generated_sql", ""))

            # Optional simulated error injection for academic viva / demo mode
            if simulate_initial_error and iteration == 1:
                # Deliberately create an invalid column name to trigger self-correction
                generated_sql = generated_sql.replace("student_id", "non_existent_student_code").replace("marks", "student_scores_invalid")
                agent_logger.warning(f"[{query_id}] Injected intentional test error into SQL for self-correction demo: {generated_sql}")

            safety_check = sql_validator.validate_safety(generated_sql)

            step.plan = {
                "analysis": llm_response.get("perceive_analysis", ""),
                "strategy": llm_response.get("plan_strategy", ""),
                "generated_sql": generated_sql,
                "expected_outcome": llm_response.get("expected_outcome", ""),
                "safety_check": safety_check
            }
            agent_logger.info(f"[{query_id}] PLAN: Synthesized SQL: {generated_sql}", extra={"agent_step": "PLAN", "iteration": iteration})

            # ==========================================
            # 3. ACT
            # ==========================================
            tool_name = "execute_sql"
            tool_args = {"sql_query": generated_sql}
            
            if not safety_check["is_safe"]:
                exec_result = {
                    "success": False,
                    "error": f"Safety Guardrail Triggered: {safety_check['reason']}",
                    "rows": [],
                    "columns": [],
                    "row_count": 0
                }
            else:
                exec_result = db_service.execute_sql(generated_sql)

            step.act = {
                "tool_called": tool_name,
                "tool_args": tool_args,
                "execution_success": exec_result["success"],
                "row_count": exec_result["row_count"],
                "raw_result": exec_result
            }
            agent_logger.info(f"[{query_id}] ACT: Executed {tool_name}. Success: {exec_result['success']}, Rows: {exec_result['row_count']}", extra={"agent_step": "ACT", "iteration": iteration})

            # ==========================================
            # 4. OBSERVE
            # ==========================================
            if exec_result["success"]:
                # Check semantic success conditions
                if exec_result["row_count"] > 0 or ("COUNT" in generated_sql.upper()):
                    observation = f"SUCCESS: Query executed cleanly and returned {exec_result['row_count']} row(s). Columns: {', '.join(exec_result['columns'])}."
                    step.status = "SUCCESS"
                    is_success = True
                else:
                    observation = f"WARNING: Query executed without error but returned 0 rows. Verify filter criteria."
                    step.status = "SUCCESS" # Valid empty result
                    is_success = True
                
                step.observe = {
                    "status": "PASS",
                    "observation_text": observation,
                    "columns": exec_result["columns"],
                    "rows": exec_result["rows"],
                    "row_count": exec_result["row_count"],
                    "error": None
                }
                final_sql = generated_sql
                final_result = exec_result
                step.duration_ms = (time.time() - step_start) * 1000
                iterations_trace.append(step.to_dict())
                agent_logger.info(f"[{query_id}] OBSERVE: {observation}", extra={"agent_step": "OBSERVE", "iteration": iteration})
                break
            else:
                # Tool error -> feed into next iteration for self-correction
                error_msg = exec_result.get("error", "Unknown execution error")
                observation = f"ERROR in iteration {iteration}: {error_msg}. Initiating self-correction."
                step.status = "RETRYING" if iteration < self.max_iterations else "FAILED"
                step.observe = {
                    "status": "FAIL",
                    "observation_text": observation,
                    "columns": [],
                    "rows": [],
                    "row_count": 0,
                    "error": error_msg
                }
                previous_observation = error_msg
                previous_sql = generated_sql
                step.duration_ms = (time.time() - step_start) * 1000
                iterations_trace.append(step.to_dict())
                agent_logger.warning(f"[{query_id}] OBSERVE: {observation}", extra={"agent_step": "OBSERVE", "iteration": iteration})

        total_duration = (time.time() - start_time) * 1000

        return {
            "query_id": query_id,
            "question": user_question,
            "is_success": is_success,
            "total_iterations": len(iterations_trace),
            "max_iterations": self.max_iterations,
            "final_sql": final_sql,
            "final_result": final_result,
            "total_duration_ms": round(total_duration, 2),
            "timestamp": datetime.utcnow().isoformat(),
            "iterations_trace": iterations_trace
        }

sql_agent = SQLSelfCorrectingAgent()
