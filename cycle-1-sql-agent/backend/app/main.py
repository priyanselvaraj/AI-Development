from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.endpoints import router as api_router
from app.services.database import db_service
from app.services.logger_service import agent_logger

@asynccontextmanager
async def lifespan(app: FastAPI):
    agent_logger.info(f"Starting {settings.APP_NAME} v{settings.VERSION}")
    db_service.init_db()
    agent_logger.info("Ready to accept SQL agent queries.")
    yield
    agent_logger.info("Shutting down SQL agent backend.")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="Autonomous Self-Correcting SQL Agent demonstrating the Perceive-Plan-Act-Observe loop.",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Enable CORS for React frontend (Vite default is 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint for system monitoring."""
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "version": settings.VERSION,
        "database": "connected"
    }

# Mount REST API
app.include_router(api_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
