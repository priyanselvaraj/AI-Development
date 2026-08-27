import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    APP_NAME: str = "AI Self-Correcting SQL Agent"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    HOST: str = "127.0.0.1"
    PORT: int = 8000
    MAX_ITERATIONS: int = 5
    
    # LLM Settings
    LLM_PROVIDER: str = "auto"
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o-mini"
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama-3.1-70b-versatile"
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3"
    
    # File Paths
    DATABASE_PATH: str = str(BASE_DIR / "data" / "university.db")
    LOG_FILE_PATH: str = str(BASE_DIR / "logs" / "agent.log")

settings = Settings()

# Ensure directories exist
os.makedirs(os.path.dirname(settings.DATABASE_PATH), exist_ok=True)
os.makedirs(os.path.dirname(settings.LOG_FILE_PATH), exist_ok=True)
