import re
from typing import Dict, Any, List

# Prohibited destructive keywords for standard query executions
DESTRUCTIVE_KEYWORDS = ["DROP", "TRUNCATE", "ALTER", "GRANT", "REVOKE"]

class SQLValidator:
    @staticmethod
    def sanitize(sql: str) -> str:
        """Removes markdown code blocks, backticks, and extra whitespace."""
        cleaned = re.sub(r"^```(?:sql)?", "", sql.strip(), flags=re.IGNORECASE | re.MULTILINE)
        cleaned = re.sub(r"```$", "", cleaned.strip(), flags=re.MULTILINE)
        return cleaned.strip()

    @staticmethod
    def validate_safety(sql: str) -> Dict[str, Any]:
        """Checks if the query contains risky destructive operations."""
        upper_sql = sql.upper()
        for kw in DESTRUCTIVE_KEYWORDS:
            if re.search(rf"\b{kw}\b", upper_sql):
                return {
                    "is_safe": False,
                    "risk_level": "HIGH",
                    "reason": f"Query contains high-risk destructive keyword: '{kw}'"
                }
        
        is_write = bool(re.search(r"\b(INSERT|UPDATE|DELETE)\b", upper_sql))
        return {
            "is_safe": True,
            "risk_level": "MEDIUM" if is_write else "LOW",
            "is_read_only": not is_write,
            "reason": "Query is safe for execution"
        }

    @staticmethod
    def extract_table_names(sql: str) -> List[str]:
        """Extracts referenced table names from simple SQL queries."""
        matches = re.findall(r"\bFROM\s+([a-zA-Z0-9_]+)|\bJOIN\s+([a-zA-Z0-9_]+)", sql, flags=re.IGNORECASE)
        tables = []
        for m in matches:
            tables.extend([tbl for tbl in m if tbl])
        return list(set(tables))

sql_validator = SQLValidator()
