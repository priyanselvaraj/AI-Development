import logging
import json
import os
from datetime import datetime
from collections import deque
from typing import List, Dict, Any
from app.config import settings

# Ring buffer for fast in-memory retrieval for the UI
LOG_BUFFER = deque(maxlen=200)

class JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        log_data = {
            "timestamp": datetime.fromtimestamp(record.created).strftime("%Y-%m-%d %H:%M:%S.%f")[:-3],
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "line": record.lineno
        }
        if hasattr(record, "agent_step"):
            log_data["agent_step"] = record.agent_step
        if hasattr(record, "iteration"):
            log_data["iteration"] = record.iteration
        return json.dumps(log_data)

class InMemoryLogHandler(logging.Handler):
    def emit(self, record: logging.LogRecord):
        try:
            log_entry = {
                "timestamp": datetime.fromtimestamp(record.created).strftime("%Y-%m-%d %H:%M:%S"),
                "level": record.levelname,
                "logger": record.name,
                "message": record.getMessage(),
                "agent_step": getattr(record, "agent_step", None),
                "iteration": getattr(record, "iteration", None)
            }
            LOG_BUFFER.append(log_entry)
        except Exception:
            self.handleError(record)

def setup_logger() -> logging.Logger:
    logger = logging.getLogger("sql_agent")
    logger.setLevel(logging.DEBUG if settings.DEBUG else logging.INFO)
    logger.handlers.clear()

    # Console Handler (Human-readable)
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.DEBUG if settings.DEBUG else logging.INFO)
    console_format = logging.Formatter(
        "[%(asctime)s] [%(levelname)s] [%(name)s]: %(message)s",
        datefmt="%H:%M:%S"
    )
    console_handler.setFormatter(console_format)
    logger.addHandler(console_handler)

    # File Handler (JSON formatted)
    try:
        os.makedirs(os.path.dirname(settings.LOG_FILE_PATH), exist_ok=True)
        file_handler = logging.FileHandler(settings.LOG_FILE_PATH, encoding="utf-8")
        file_handler.setLevel(logging.DEBUG)
        file_handler.setFormatter(JsonFormatter())
        logger.addHandler(file_handler)
    except Exception as e:
        print(f"Warning: could not initialize file logger at {settings.LOG_FILE_PATH}: {e}")

    # In-memory Handler for FastAPI UI
    memory_handler = InMemoryLogHandler()
    memory_handler.setLevel(logging.DEBUG)
    logger.addHandler(memory_handler)

    return logger

agent_logger = setup_logger()

def get_logs(limit: int = 100, level: str = None) -> List[Dict[str, Any]]:
    logs = list(LOG_BUFFER)
    if level and level.upper() != "ALL":
        logs = [log for log in logs if log.get("level") == level.upper()]
    return logs[-limit:]
