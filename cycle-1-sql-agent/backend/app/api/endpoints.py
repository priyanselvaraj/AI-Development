from fastapi import APIRouter, HTTPException, Query
from typing import List, Dict, Any, Optional
from app.api.schemas import (
    QueryRunRequest,
    QueryRunResponse,
    StatsResponse,
    LogItem
)
from app.agents.sql_agent import SQLSelfCorrectingAgent
from app.services.database import db_service
from app.services.logger_service import get_logs, agent_logger
from app.config import settings

router = APIRouter(prefix="/api", tags=["SQL Agent & Database"])

# In-memory execution history storage
QUERY_HISTORY: List[Dict[str, Any]] = []

@router.post("/query/run", response_model=QueryRunResponse)
async def run_sql_agent(req: QueryRunRequest):
    """
    Submits a natural language database question and executes the autonomous
    Perceive -> Plan -> Act -> Observe self-correcting agent loop.
    """
    if not req.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    agent = SQLSelfCorrectingAgent(max_iterations=req.max_iterations)
    result = await agent.run(
        user_question=req.question.strip(),
        simulate_initial_error=req.simulate_initial_error
    )
    
    # Store in history
    QUERY_HISTORY.append(result)
    return result

@router.get("/query/history")
def get_query_history(limit: int = 20):
    """Returns recent agent query execution history."""
    return list(reversed(QUERY_HISTORY[-limit:]))

@router.get("/query/{query_id}")
def get_query_by_id(query_id: str):
    """Retrieves full details and iteration trace for a specific query run."""
    for item in QUERY_HISTORY:
        if item["query_id"] == query_id:
            return item
    raise HTTPException(status_code=404, detail="Query run not found")

@router.get("/database/schema")
def get_schema():
    """Returns the complete introspection schema of the SQLite database."""
    return db_service.get_database_schema()

@router.get("/database/tables")
def get_tables():
    """Lists table names and row counts."""
    schema = db_service.get_database_schema()
    return [
        {
            "name": table,
            "row_count": details["row_count"],
            "column_count": len(details["columns"]),
            "columns": [c["name"] for c in details["columns"]]
        }
        for table, details in schema.items()
    ]

@router.get("/logs", response_model=List[LogItem])
def get_agent_logs(
    limit: int = Query(100, ge=1, le=500),
    level: Optional[str] = Query(None, description="Log level filter: ALL, INFO, WARN, ERROR, DEBUG")
):
    """Returns real-time structured application logs from the agent runtime."""
    return get_logs(limit=limit, level=level)

@router.get("/stats", response_model=StatsResponse)
def get_dashboard_stats():
    """Returns aggregated stats for the modern AI dashboard."""
    total = len(QUERY_HISTORY)
    successful = sum(1 for q in QUERY_HISTORY if q.get("is_success"))
    failed = total - successful
    avg_iterations = (
        sum(q.get("total_iterations", 1) for q in QUERY_HISTORY) / total
        if total > 0 else 0.0
    )

    schema = db_service.get_database_schema()
    total_records = sum(details["row_count"] for details in schema.values())

    return StatsResponse(
        total_queries=total,
        successful_queries=successful,
        failed_queries=failed,
        average_iterations=round(avg_iterations, 2),
        active_llm_provider=settings.LLM_PROVIDER,
        total_tables=len(schema),
        total_records=total_records
    )

@router.post("/database/reset")
def reset_database():
    """Resets the university database to its original seed data state."""
    db_service.init_db()
    agent_logger.info("Database reset to original seed state by user request")
    return {"status": "success", "message": "Database reset and seeded successfully"}
