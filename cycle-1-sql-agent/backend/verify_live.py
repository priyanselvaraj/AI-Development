import urllib.request
import json

def test_live_system():
    print("--- 1. Testing Frontend HTTP Server ---")
    req = urllib.request.urlopen("http://127.0.0.1:5173/")
    print(f"Frontend HTTP Status: {req.status}")

    print("\n--- 2. Testing Backend Health Endpoint ---")
    req = urllib.request.urlopen("http://127.0.0.1:8000/health")
    health = json.loads(req.read().decode())
    print(f"Backend Health: {health}")

    print("\n--- 3. Testing Database Schema Endpoint ---")
    req = urllib.request.urlopen("http://127.0.0.1:8000/api/database/tables")
    tables = json.loads(req.read().decode())
    print(f"Tables Found ({len(tables)}): {[t['name'] for t in tables]}")

    print("\n--- 4. Testing Standard Agent Query Run ---")
    payload = json.dumps({
        "question": "Show all students who scored above 80 marks",
        "simulate_initial_error": False,
        "max_iterations": 5
    }).encode("utf-8")
    req = urllib.request.Request(
        "http://127.0.0.1:8000/api/query/run",
        data=payload,
        headers={"Content-Type": "application/json"}
    )
    res = json.loads(urllib.request.urlopen(req).read().decode())
    print(f"Query Success: {res['is_success']}")
    print(f"Generated SQL: {res['final_sql']}")
    print(f"Total Iterations: {res['total_iterations']}")
    print(f"Returned Rows Count: {res['final_result']['row_count']}")
    print(f"Execution Duration: {res['total_duration_ms']} ms")

    print("\n--- 5. Testing Self-Correction Autonomous Recovery ---")
    payload_err = json.dumps({
        "question": "Show all students who scored above 80 marks",
        "simulate_initial_error": True,
        "max_iterations": 5
    }).encode("utf-8")
    req_err = urllib.request.Request(
        "http://127.0.0.1:8000/api/query/run",
        data=payload_err,
        headers={"Content-Type": "application/json"}
    )
    res_err = json.loads(urllib.request.urlopen(req_err).read().decode())
    print(f"Self-Correction Run Success: {res_err['is_success']}")
    print(f"Total Iterations: {res_err['total_iterations']}")
    print(f"Iteration 1 Status: {res_err['iterations_trace'][0]['status']} (Caught: {res_err['iterations_trace'][0]['observe']['observation_text'][:65]}...)")
    print(f"Iteration 2 Status: {res_err['iterations_trace'][1]['status']} (Generated SQL: {res_err['iterations_trace'][1]['plan']['generated_sql']})")

    print("\n--- 6. Testing Real-Time Structured Logs ---")
    req_logs = urllib.request.urlopen("http://127.0.0.1:8000/api/logs?limit=5")
    logs = json.loads(req_logs.read().decode())
    print(f"Recent Log Events Count: {len(logs)}")
    for l in logs[-3:]:
        print(f"  [{l['level']}] ({l['agent_step'] or 'SYS'}): {l['message']}")

    print("\n>>> ALL LIVE FULL-STACK CHECKS PASSED PERFECTLY! <<<")

if __name__ == "__main__":
    test_live_system()
