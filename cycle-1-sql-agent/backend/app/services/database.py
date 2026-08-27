import sqlite3
import os
from typing import Dict, Any, List, Tuple
from app.config import settings
from app.models.database_models import CREATE_TABLES_SQL, SEED_DATA_SQL
from app.services.logger_service import agent_logger

class DatabaseService:
    def __init__(self, db_path: str = None):
        self.db_path = db_path or settings.DATABASE_PATH
        self.init_db()

    def get_connection(self) -> sqlite3.Connection:
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def init_db(self):
        """Initializes database schema and populates seed rows if empty."""
        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                cursor.executescript(CREATE_TABLES_SQL)
                cursor.executescript(SEED_DATA_SQL)
                conn.commit()
                agent_logger.info(f"Database initialized and verified at {self.db_path}")
        except Exception as e:
            agent_logger.error(f"Failed to initialize database: {e}")
            raise e

    def get_database_schema(self) -> Dict[str, Any]:
        """
        Tool: Inspects database tables, columns, data types, primary/foreign keys, and sample rows.
        """
        schema_info = {}
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';")
            tables = [row[0] for row in cursor.fetchall()]

            for table in tables:
                # Column info
                cursor.execute(f"PRAGMA table_info('{table}');")
                columns = [
                    {
                        "cid": col[0],
                        "name": col[1],
                        "type": col[2],
                        "notnull": bool(col[3]),
                        "dflt_value": col[4],
                        "pk": bool(col[5])
                    }
                    for col in cursor.fetchall()
                ]

                # Foreign keys
                cursor.execute(f"PRAGMA foreign_key_list('{table}');")
                foreign_keys = [
                    {
                        "id": fk[0],
                        "from": fk[3],
                        "to_table": fk[2],
                        "to_column": fk[4]
                    }
                    for fk in cursor.fetchall()
                ]

                # Sample rows (2 samples)
                cursor.execute(f"SELECT * FROM '{table}' LIMIT 2;")
                sample_rows = [dict(row) for row in cursor.fetchall()]

                # Row count
                cursor.execute(f"SELECT COUNT(*) FROM '{table}';")
                row_count = cursor.fetchone()[0]

                schema_info[table] = {
                    "columns": columns,
                    "foreign_keys": foreign_keys,
                    "row_count": row_count,
                    "sample_rows": sample_rows
                }

        return schema_info

    def get_schema_summary_text(self) -> str:
        """Returns clean text representation of schema for prompt injection."""
        schema = self.get_database_schema()
        lines = []
        for table_name, details in schema.items():
            cols = ", ".join([f"{c['name']} ({c['type']}{' PK' if c['pk'] else ''})" for c in details["columns"]])
            fks = ""
            if details["foreign_keys"]:
                fk_strs = [f"{fk['from']} -> {fk['to_table']}.{fk['to_column']}" for fk in details["foreign_keys"]]
                fks = f" | Foreign Keys: {', '.join(fk_strs)}"
            lines.append(f"Table '{table_name}' ({details['row_count']} rows): {cols}{fks}")
        return "\n".join(lines)

    def execute_sql(self, sql_query: str) -> Dict[str, Any]:
        """
        Tool: Safely executes a SQL query and returns column names, rows, and execution metrics.
        Catches and returns SQLite operational/syntax errors for agent self-correction.
        """
        clean_sql = sql_query.strip().rstrip(";")
        if not clean_sql:
            return {"success": False, "error": "Empty SQL query provided", "rows": [], "columns": [], "row_count": 0}

        try:
            with self.get_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(clean_sql)
                
                if cursor.description:
                    columns = [desc[0] for desc in cursor.description]
                    raw_rows = cursor.fetchall()
                    rows = [dict(row) for row in raw_rows]
                    return {
                        "success": True,
                        "columns": columns,
                        "rows": rows,
                        "row_count": len(rows),
                        "error": None
                    }
                else:
                    conn.commit()
                    return {
                        "success": True,
                        "columns": ["affected_rows"],
                        "rows": [{"affected_rows": cursor.rowcount}],
                        "row_count": cursor.rowcount,
                        "error": None
                    }
        except sqlite3.OperationalError as e:
            return {"success": False, "error": f"SQLite Operational Error: {str(e)}", "rows": [], "columns": [], "row_count": 0}
        except sqlite3.DatabaseError as e:
            return {"success": False, "error": f"SQLite Database Error: {str(e)}", "rows": [], "columns": [], "row_count": 0}
        except Exception as e:
            return {"success": False, "error": f"Execution Error: {str(e)}", "rows": [], "columns": [], "row_count": 0}

db_service = DatabaseService()
