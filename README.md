# 🤖 Full-Stack Agentic AI Portfolio

## Agentic AI Skill-Building Assignment — Cyclic Submission Track

A complete **Full-Stack Agentic AI Portfolio** containing six projects that progressively demonstrate modern AI agent technologies, including:

* Agent Loops
* Model Context Protocol (MCP)
* Multi-Agent Orchestration
* Agent-to-Agent (A2A) Communication
* Agent Harness and Observability
* Human-in-the-Loop AI

This repository is designed as an academic project portfolio containing **working backend systems and interactive frontend dashboards**.

---

# 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Assignment Cycles](#-assignment-cycles)
3. [Technology Stack](#-technology-stack)
4. [Project Architecture](#-project-architecture)
5. [Repository Structure](#-repository-structure)
6. [Cycle 1 — Agent Loop](#-cycle-1--agent-loop)
7. [Cycle 2 — MCP Server](#-cycle-2--mcp-server)
8. [Cycle 3 — Multi-Agent Orchestration](#-cycle-3--multi-agent-orchestration)
9. [Cycle 4 — A2A Protocol + MCP](#-cycle-4--a2a-protocol--mcp)
10. [Cycle 5 — Agent Harness](#-cycle-5--agent-harness)
11. [Cycle 6 — Human in the Loop](#-cycle-6--human-in-the-loop)
12. [Installation](#-installation)
13. [Running the Projects](#-running-the-projects)
14. [Frontend](#-frontend)
15. [API Documentation](#-api-documentation)
16. [Testing](#-testing)
17. [Logging](#-logging)
18. [Security](#-security)
19. [Architecture Diagrams](#-architecture-diagrams)
20. [GitHub Commit Strategy](#-github-commit-strategy)
21. [Demo Guide](#-demo-guide)
22. [Viva Preparation](#-viva-preparation)

---

# 🎯 Project Overview

The purpose of this repository is to build practical Agentic AI applications through six development cycles.

Each cycle focuses on a different concept and builds progressively toward a complete Agentic AI portfolio.

The first four cycles are the core compulsory track:

| Cycle | Topic                     | Project                             |
| ----- | ------------------------- | ----------------------------------- |
| 1     | Agent Loop                | Self-Correcting SQL Agent           |
| 2     | MCP Server                | Campus Library MCP Server           |
| 3     | Multi-Agent Orchestration | AI Support Ticket Escalation System |
| 4     | A2A Protocol + MCP        | AI IT Helpdesk Federation           |

The final two cycles extend the portfolio with additional infrastructure and safety features:

| Cycle | Topic             | Project                       |
| ----- | ----------------- | ----------------------------- |
| 5     | Agent Harness     | Agent Observability Dashboard |
| 6     | Human in the Loop | AI SQL Approval Center        |

The assignment defines Cycles 1–4 as compulsory and Cycles 5–6 as optional extensions.

---

# 🚀 Assignment Cycles

## Cycle 1 — Agent Loop

### Project: AI Self-Correcting SQL Agent

The system receives a natural-language database request and uses an AI agent to generate and execute SQL.

The agent follows the loop:

```text
PERCEIVE
   ↓
PLAN
   ↓
ACT
   ↓
OBSERVE
   ↓
SUCCESS?
 ↙       ↘
YES       NO
↓          ↓
STOP     REPEAT
```

### Features

* Explicit Perceive → Plan → Act → Observe stages
* Real LLM-based planning
* SQL generation
* Database schema inspection
* SQL execution
* Self-correction after failures
* Maximum iteration limit
* Explicit success condition
* Iteration logging
* Tool failure recovery
* Interactive React dashboard

The assignment specifically requires explicit stages, a real LLM in planning, at least two callable tools, termination rules, iteration logging, and recovery from tool failure.

---

# 📚 Cycle 2 — MCP Server

## Project: Campus Library MCP Server

This project implements a **Model Context Protocol (MCP) Server** for managing a campus library.

### MCP Tools

* `search_book`
* `check_availability`
* `reserve_book`

### MCP Resource

* Library Catalog

### Features

* Official MCP SDK
* Three MCP tools
* JSON schema validation
* Catalog resource
* Stdio transport
* MCP Inspector testing
* MCP client integration
* Audit logging
* Interactive frontend dashboard

The assignment requires a minimum of three tools, one resource, stdio transport, MCP Inspector verification, real client integration, and audit logging.

---

# 🧠 Cycle 3 — Multi-Agent Orchestration

## Project: AI Support Ticket Escalation System

This project uses multiple AI agents working together to process customer support tickets.

### Agents

#### 🔵 Triage Agent

Classifies incoming tickets and determines severity.

#### 🟢 Knowledge Base Agent

Searches for possible solutions.

#### 🟡 Sentiment Agent

Analyzes customer sentiment and frustration.

#### 🔴 Escalation Agent

Routes unresolved or high-priority tickets for escalation.

#### 🟣 Supervisor Agent

Controls workflow and routes tasks between agents.

### Workflow

```text
                 ┌─────────────────┐
                 │   SUPERVISOR    │
                 └────────┬────────┘
                          ↓
                 ┌─────────────────┐
                 │  TRIAGE AGENT   │
                 └────────┬────────┘
                          ↓
              ┌───────────┴───────────┐
              ↓                       ↓
     KNOWLEDGE BASE AGENT      SENTIMENT AGENT
              │                       │
              └───────────┬───────────┘
                          ↓
                 ┌─────────────────┐
                 │ ESCALATION AGENT│
                 └─────────────────┘
```

### Features

* Multiple specialized agents
* LangGraph orchestration
* Supervisor routing
* Shared state
* Conditional branching
* Runtime routing decisions
* Agent validation
* Retry mechanism
* Fallback handling
* Execution tracing
* Multi-Agent Control Center frontend

The assignment requires at least three distinct agents, an explicit orchestrator, shared state/memory, conditional routing, and failure handling.

---

# 🌐 Cycle 4 — A2A Protocol + MCP

## Project: AI IT Helpdesk Federation

This project demonstrates communication between independent AI agents using the **Agent-to-Agent (A2A) Protocol**.

### Agent A

## Support Agent

Responsibilities:

* Receive IT support requests
* Attempt initial resolution
* Delegate unresolved issues

### Agent B

## Infrastructure Agent

Responsibilities:

* Receive delegated tasks
* Analyze infrastructure information
* Query MCP tools
* Identify root causes
* Return results

### Architecture

```text
USER
 │
 ▼
SUPPORT AGENT
 │
 │ A2A TASK HANDOFF
 ▼
INFRASTRUCTURE AGENT
 │
 │ MCP TOOL CALL
 ▼
MCP SERVER
 │
 ▼
ROOT CAUSE RESULT
 │
 ▼
SUPPORT AGENT
 │
 ▼
USER
```

### Features

* Two independent agents
* Agent Cards
* Agent discovery
* JSON-RPC communication
* A2A task delegation
* Cross-agent communication
* Task status updates
* MCP integration
* Full execution trace
* Separate processes and ports
* A2A Agent Network Dashboard

The assignment requires two independent agents, valid Agent Cards, official A2A SDK usage, JSON-RPC task communication, MCP pairing, cross-agent handoff, full traces, and separate processes/ports.

---

# 🔧 Cycle 5 — Agent Harness

## Project: AI Agent Observability Dashboard

This project adds an infrastructure layer around an existing AI agent.

The original agent reasoning logic is preserved while additional management capabilities are added.

### Features

#### 💾 Checkpointing

The agent can save its progress and resume after a restart.

#### 📊 Observability

The system records:

* Tool calls
* LLM calls
* Timestamp
* Latency
* Token estimates
* Cost estimates
* Success/failure status

#### 🛡️ Guardrails

The system enforces:

* Maximum steps
* Timeout
* Token budget
* Cost budget

#### 🔒 Sandbox

Potentially dangerous code or shell tools are executed in a restricted environment.

#### 🎮 Agent Controls

Operators can:

* Start
* Pause
* Resume
* Abort

The assignment specifies persistence, structured observability, guardrails, sandboxing where tools execute code, and manual pause/resume/abort controls.

---

# 👨‍💻 Cycle 6 — Human in the Loop

## Project: AI SQL Approval Center

This project extends the SQL Agent from Cycle 1 by adding human approval for high-risk actions.

### Workflow

```text
USER REQUEST
      ↓
AI SQL AGENT
      ↓
RISK ANALYSIS
      ↓
HIGH RISK?
   ↙         ↘
 YES          NO
  ↓            ↓
HUMAN        EXECUTE
REVIEW
  ↓
┌─────────────────────┐
│ APPROVE             │
│ REJECT              │
│ EDIT SQL            │
└─────────────────────┘
  ↓
EXECUTE OR CANCEL
```

### Features

* AI-generated SQL
* Risk scoring
* Confidence scoring
* Mandatory approval for destructive operations
* SQL editing before execution
* Approve/reject controls
* Human decision logging
* Rationale recording
* Decision history dashboard

The assignment requires an approval gate, the ability for humans to approve/reject/edit actions, decision logging, and confidence/risk thresholds for triggering review.

---

# 🛠 Technology Stack

## Backend

| Technology | Purpose                      |
| ---------- | ---------------------------- |
| Python     | Backend development          |
| FastAPI    | REST APIs                    |
| Uvicorn    | ASGI server                  |
| Pydantic   | Data validation              |
| SQLite     | Local database               |
| Ollama     | Local LLM support            |
| MCP SDK    | MCP Server                   |
| A2A SDK    | Agent-to-Agent communication |
| LangGraph  | Multi-agent orchestration    |

## Frontend

| Technology   | Purpose               |
| ------------ | --------------------- |
| React        | User interface        |
| Vite         | Frontend development  |
| Tailwind CSS | Styling               |
| Axios        | Backend communication |
| React Router | Navigation            |
| Lucide React | Icons                 |

---

# 📁 Repository Structure

```text
Agentic-AI-Portfolio/
│
├── cycle-1-agent-loop/
│   ├── backend/
│   ├── frontend/
│   └── README.md
│
├── cycle-2-mcp-server/
│   ├── backend/
│   ├── frontend/
│   └── README.md
│
├── cycle-3-multi-agent/
│   ├── backend/
│   ├── frontend/
│   └── README.md
│
├── cycle-4-a2a-mcp/
│   ├── support-agent/
│   ├── infrastructure-agent/
│   ├── frontend/
│   └── README.md
│
├── cycle-5-agent-harness/
│   ├── backend/
│   ├── frontend/
│   └── README.md
│
├── cycle-6-human-in-loop/
│   ├── backend/
│   ├── frontend/
│   └── README.md
│
├── docs/
│   ├── architecture/
│   ├── diagrams/
│   └── screenshots/
│
├── .gitignore
└── README.md
```

---

# 💻 Installation

## Prerequisites

Install:

* Python 3.11 or later
* Node.js 20 or later
* npm
* Visual Studio Code
* Git
* Ollama (optional for local LLM usage)

Check installation:

```powershell
python --version
node --version
npm --version
git --version
```

---

# 🐍 Backend Setup

Navigate to a cycle backend:

```powershell
cd cycle-1-agent-loop\backend
```

Create a virtual environment:

```powershell
python -m venv .venv
```

Activate it:

```powershell
.\.venv\Scripts\Activate
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

Start the backend:

```powershell
uvicorn app.main:app --reload
```

The backend will normally be available at:

```text
http://localhost:8000
```

---

# ⚛️ Frontend Setup

Open a new terminal.

Navigate to the frontend:

```powershell
cd cycle-1-agent-loop\frontend
```

Install dependencies:

```powershell
npm install
```

Start the frontend:

```powershell
npm run dev
```

Open the URL displayed by Vite in your browser.

---

# 🔗 Frontend and Backend Integration

The React frontend communicates with the FastAPI backend through REST APIs.

Example architecture:

```text
REACT FRONTEND
      │
      │ HTTP / REST API
      ▼
FASTAPI BACKEND
      │
      ├──────────► AI AGENT
      │
      ├──────────► DATABASE
      │
      ├──────────► MCP SERVER
      │
      └──────────► A2A AGENTS
```

Axios is used to manage API communication.

---

# 📡 API Documentation

FastAPI automatically provides API documentation.

After starting a backend, open:

```text
http://localhost:8000/docs
```

Alternative documentation:

```text
http://localhost:8000/redoc
```

Common API endpoints may include:

```text
GET  /health
GET  /api/status
POST /api/run
GET  /api/logs
GET  /api/history
```

Additional endpoints depend on the cycle.

---

# 🧪 Testing

Each project should be tested using:

* Manual UI testing
* FastAPI Swagger documentation
* API testing
* Error testing
* Agent failure testing
* Logging verification

## Example Test Cases

### Normal Request

```text
Input:
Show all students with marks above 80
```

Expected:

```text
The agent generates SQL, executes it, and returns matching results.
```

### Invalid Request

The system should:

1. Detect the failure.
2. Log the error.
3. Attempt recovery where applicable.
4. Return a meaningful error message.

---

# 📊 Logging

Each cycle maintains logs for debugging and auditing.

Example structure:

```text
logs/
├── agent_trace.json
├── api.log
├── mcp_audit.log
├── a2a_trace.json
└── human_decisions.json
```

Logs can include:

* Timestamp
* Agent name
* Action
* Tool call
* Input
* Output
* Status
* Error details
* Execution time

---

# 🔐 Security

Important security practices:

* Never commit API keys.
* Use `.env` files.
* Add `.env` to `.gitignore`.
* Validate API input.
* Sanitize database operations.
* Restrict destructive operations.
* Require human approval for high-risk actions.
* Do not expose secrets through the frontend.

Example:

```text
.env
```

```env
LLM_PROVIDER=ollama
OLLAMA_MODEL=llama3.2
DATABASE_URL=sqlite:///./data/app.db
```

Example `.env.example`:

```env
LLM_PROVIDER=
OLLAMA_MODEL=
DATABASE_URL=
```

---

# 🏗 Architecture Diagrams

Every cycle includes:

* System architecture
* Agent workflow
* Backend architecture
* Frontend architecture
* Data flow

Architecture diagrams can be created using:

* Draw.io
* Mermaid
* Excalidraw

The assignment requires an architecture diagram as part of each cycle's submission package.

---

# 📦 GitHub Commit Strategy

Use incremental commits.

Recommended commit history:

```text
Initial project setup
Configure backend environment
Add database models
Implement core agent logic
Add AI/LLM integration
Implement tools
Add error handling
Add logging
Create REST APIs
Create React frontend
Connect frontend with backend
Add testing
Update documentation
Add architecture diagrams
Final project validation
```

Avoid a single large commit containing the entire project.

The assignment specifically expects a clean, incremental commit history.

---

# 🎥 Demo Video Guide

For each cycle, create a 3–5 minute live demonstration.

## Recommended Structure

### 1. Introduction — 30 seconds

Explain:

* Project name
* Problem statement
* Technology used

### 2. Architecture — 30 seconds

Explain the main components.

### 3. Live Demo — 2 minutes

Demonstrate:

* Starting backend
* Starting frontend
* Using the system
* AI agent workflow

### 4. Error Handling — 30 seconds

Demonstrate:

* Failure
* Recovery
* Logging

### 5. Conclusion — 30 seconds

Explain the final result.

The submission requirements call for a working demo video showing the system running, rather than a slide walkthrough.

---

# 🎓 Viva Preparation

Important concepts to understand:

## What is an AI Agent?

An AI agent is a system that can perceive information, reason or plan, take actions using tools, and observe results to achieve a goal.

## What is an Agent Loop?

A repeated process where an agent:

```text
Perceives → Plans → Acts → Observes
```

## What is MCP?

Model Context Protocol is a standardized way for AI applications to connect with external tools and resources.

## What is Multi-Agent Orchestration?

Multiple specialized AI agents collaborate under an orchestrator or supervisor.

## What is A2A?

Agent-to-Agent communication enables independent agents to discover each other and delegate tasks.

## What is Human-in-the-Loop?

A system where humans review, approve, reject, or modify important AI decisions.

---

# 📅 Cycle Timeline

| Cycle   | Topic                     | Status     |
| ------- | ------------------------- | ---------- |
| Cycle 1 | Agent Loop                | Compulsory |
| Cycle 2 | MCP Server                | Compulsory |
| Cycle 3 | Multi-Agent Orchestration | Compulsory |
| Cycle 4 | A2A Protocol + MCP        | Compulsory |
| Cycle 5 | Agent Harness             | Optional   |
| Cycle 6 | Human in the Loop         | Optional   |

The assignment calendar defines the six-cycle progression and dates for each cycle.

---

# ✅ Final Submission Checklist

For every cycle:

* [ ] Working backend
* [ ] Working frontend
* [ ] Frontend connected to backend
* [ ] AI agent functionality
* [ ] Required protocol/framework implemented
* [ ] Error handling
* [ ] Logging
* [ ] README.md
* [ ] `.env.example`
* [ ] `.gitignore`
* [ ] Architecture diagram
* [ ] Sample input/output
* [ ] GitHub repository
* [ ] Incremental commits
* [ ] 3–5 minute demo video
* [ ] Viva preparation

---

# 👨‍💻 Author

**Priyan Selvaraj**

Computer Science Engineering Student

---

# 📄 License

This project is created for **educational and academic purposes**.

---

## ⭐ Portfolio Goal

This repository demonstrates the complete journey from a **single AI agent** to a **full Agentic AI ecosystem** featuring:

```text
SINGLE AGENT
     ↓
MCP TOOLS
     ↓
MULTI-AGENT SYSTEM
     ↓
A2A COMMUNICATION
     ↓
AGENT HARNESS
     ↓
HUMAN-IN-THE-LOOP
```

**A complete Full-Stack Agentic AI Portfolio 🚀🤖**
