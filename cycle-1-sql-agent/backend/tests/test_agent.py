import pytest
import pytest_asyncio
from app.services.database import db_service
from app.agents.sql_agent import SQLSelfCorrectingAgent
from app.utils.sql_validator import sql_validator

@pytest.fixture(autouse=True)
def init_test_db():
    db_service.init_db()

def test_database_schema_introspection():
    schema = db_service.get_database_schema()
    assert "students" in schema
    assert "courses" in schema
    assert "enrollments" in schema
    assert "departments" in schema
    assert "professors" in schema
    assert schema["students"]["row_count"] > 0
    assert len(schema["students"]["columns"]) >= 7

def test_sql_execution_success():
    res = db_service.execute_sql("SELECT COUNT(*) AS total FROM students;")
    assert res["success"] is True
    assert res["row_count"] == 1
    assert res["rows"][0]["total"] >= 12

def test_sql_execution_error_capture():
    res = db_service.execute_sql("SELECT invalid_column_xyz FROM non_existent_table;")
    assert res["success"] is False
    assert res["error"] is not None
    assert "SQLite" in res["error"] or "Error" in res["error"]

def test_sql_safety_validator():
    safe_check = sql_validator.validate_safety("SELECT * FROM students WHERE gpa > 3.5;")
    assert safe_check["is_safe"] is True
    assert safe_check["risk_level"] == "LOW"

    unsafe_check = sql_validator.validate_safety("DROP TABLE students;")
    assert unsafe_check["is_safe"] is False
    assert unsafe_check["risk_level"] == "HIGH"

@pytest.mark.asyncio
async def test_agent_single_iteration_success():
    agent = SQLSelfCorrectingAgent(max_iterations=5)
    result = await agent.run(user_question="Show all students who scored above 80 marks")
    assert result["is_success"] is True
    assert result["total_iterations"] >= 1
    assert len(result["iterations_trace"]) >= 1
    assert result["final_result"]["success"] is True
    assert result["final_result"]["row_count"] > 0

@pytest.mark.asyncio
async def test_agent_self_correction_recovery():
    """Tests that when an intentional error occurs in step 1, the agent catches it and self-corrects in step 2."""
    agent = SQLSelfCorrectingAgent(max_iterations=5)
    result = await agent.run(
        user_question="Show all students who scored above 80 marks",
        simulate_initial_error=True
    )
    assert result["is_success"] is True
    assert result["total_iterations"] == 2
    
    # Step 1 was a failure caught in OBSERVE
    step_1 = result["iterations_trace"][0]
    assert step_1["status"] in ["RETRYING", "FAILED"]
    assert step_1["observe"]["status"] == "FAIL"

    # Step 2 was a successful self-correction
    step_2 = result["iterations_trace"][1]
    assert step_2["status"] == "SUCCESS"
    assert step_2["observe"]["status"] == "PASS"
    assert step_2["act"]["execution_success"] is True
