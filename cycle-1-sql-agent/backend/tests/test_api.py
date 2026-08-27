import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_health_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.get("/health")
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "healthy"
        assert data["database"] == "connected"

@pytest.mark.asyncio
async def test_stats_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.get("/api/stats")
        assert res.status_code == 200
        data = res.json()
        assert "total_queries" in data
        assert "total_tables" in data
        assert data["total_tables"] >= 5

@pytest.mark.asyncio
async def test_database_schema_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.get("/api/database/schema")
        assert res.status_code == 200
        data = res.json()
        assert "students" in data
        assert "departments" in data

@pytest.mark.asyncio
async def test_run_query_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        payload = {
            "question": "Find the top students by GPA",
            "simulate_initial_error": False,
            "max_iterations": 5
        }
        res = await client.post("/api/query/run", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert data["is_success"] is True
        assert len(data["iterations_trace"]) >= 1

@pytest.mark.asyncio
async def test_logs_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.get("/api/logs?limit=10")
        assert res.status_code == 200
        data = res.json()
        assert isinstance(data, list)
