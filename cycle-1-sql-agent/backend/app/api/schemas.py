from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class QueryRunRequest(BaseModel):
    question: str = Field(..., json_schema_extra={"example": "Show all students who scored above 80 marks"})
    simulate_initial_error: bool = Field(False, description="Intentionally inject error in step 1 to demo self-correction")
    max_iterations: Optional[int] = Field(5, ge=1, le=10)

class ActOutput(BaseModel):
    tool_called: str
    tool_args: Dict[str, Any]
    execution_success: bool
    row_count: int
    raw_result: Dict[str, Any]

class ObserveOutput(BaseModel):
    status: str
    observation_text: str
    columns: List[str]
    rows: List[Dict[str, Any]]
    row_count: int
    error: Optional[str] = None

class IterationStepResponse(BaseModel):
    iteration: int
    timestamp: str
    duration_ms: float
    status: str
    perceive: Dict[str, Any]
    plan: Dict[str, Any]
    act: Dict[str, Any]
    observe: Dict[str, Any]

class QueryRunResponse(BaseModel):
    query_id: str
    question: str
    is_success: bool
    total_iterations: int
    max_iterations: int
    final_sql: str
    final_result: Dict[str, Any]
    total_duration_ms: float
    timestamp: str
    iterations_trace: List[IterationStepResponse]

class StatsResponse(BaseModel):
    total_queries: int
    successful_queries: int
    failed_queries: int
    average_iterations: float
    active_llm_provider: str
    total_tables: int
    total_records: int

class LogItem(BaseModel):
    timestamp: str
    level: str
    logger: str
    message: str
    agent_step: Optional[str] = None
    iteration: Optional[int] = None
