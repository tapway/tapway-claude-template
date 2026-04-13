# Project: [PROJECT_NAME]

> Replace all `[PLACEHOLDERS]` before committing. This file is Claude's working memory — keep it accurate and current.

---

## 🧠 Project Overview

**Goal:** [One-sentence description of what this project does]
**Status:** [Active / In development / Maintenance]
**Repo:** [GitHub URL]

---

## 🏗️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **State:** React Query (`@tanstack/react-query`)
- **Testing:** Jest + React Testing Library + Playwright (E2E)

### Backend
- **Language:** Python 3.11+
- **Framework:** FastAPI
- **Server:** **Granian** (team standard — NOT uvicorn/gunicorn)
- **ORM:** SQLAlchemy 2 + Alembic (migrations)
- **Logging:** **structlog** JSON (team standard — NOT Python `logging` directly)
- **Testing:** pytest + pytest-asyncio
- **Linting:** ruff + mypy

### Infrastructure
- **Database:** PostgreSQL 16
- **Auth:** JWT (python-jose + bcrypt)
- **Hosting:** [Vercel (frontend) / Railway / Fly.io (backend)]
- **CI/CD:** GitHub Actions
- **Containers:** Multi-target Docker (cpu / cuda124 / cuda118 / rocm / jetson)

---

## 📁 Project Structure

```
.
├── CLAUDE.md                   ← Claude's memory (you are here)
├── .claude/                    ← Claude Code config
│   ├── settings.json           ← Hooks, permissions, env
│   └── commands/               ← Slash commands (/review, /deploy, etc.)
├── skills/                     ← Auto-activated AI skills (superpowers)
├── agents/                     ← Subagent definitions
│
├── frontend/                   ← Next.js 14 app
│   └── src/
│       ├── app/                ← App Router pages & layouts
│       ├── components/         ← Reusable UI components
│       ├── services/           ← API client (src/services/api.ts)
│       └── utils/              ← Shared helpers & types
│
├── backend/                    ← Python FastAPI app
│   ├── src/
│   │   ├── main.py             ← Entry point — starts Granian
│   │   ├── api/
│   │   │   ├── app.py          ← FastAPI factory (create_app())
│   │   │   └── routes/         ← Route handlers
│   │   ├── core/
│   │   │   └── engine.py       ← Core business logic (replace with yours)
│   │   ├── models/             ← SQLAlchemy models
│   │   ├── services/           ← Business logic layer
│   │   └── utils/
│   │       ├── logging.py      ← structlog setup (call setup_logging() once)
│   │       ├── device.py       ← GPU detection helper
│   │       └── security.py     ← JWT + bcrypt helpers
│   ├── tests/
│   ├── configs/
│   │   └── default.yaml        ← App config (override via env vars)
│   ├── docker/                 ← Multi-target Dockerfiles
│   │   ├── Dockerfile.cpu
│   │   ├── Dockerfile.cuda124
│   │   ├── Dockerfile.cuda118
│   │   ├── Dockerfile.rocm
│   │   └── Dockerfile.jetson
│   └── scripts/
│       └── build.sh            ← One-command Docker build for any target
│
├── docs/                       ← Architecture, API reference, onboarding
└── .github/workflows/          ← CI/CD pipelines
```

---

## 🔧 Conventions

### ⚠️ Team Standards — Non-Negotiable

| Concern | Tool | Notes |
|---|---|---|
| Package manager | `uv` | Never use `pip install` directly |
| ASGI server | `Granian` | Never use uvicorn or gunicorn |
| JSON logging | `structlog` | Call `setup_logging()` once in `main.py`; use `logger = structlog.get_logger()` everywhere |
| Linter / formatter | `ruff` | PEP 8; run `make lint` + `make format` |
| Type checker | `mypy` | Strict mode; all public functions typed |
| Tests | `pytest` | TDD — write the test first |

### Logging Rules (structlog)
```python
# ✅ GOOD — context as keyword arguments
logger.info("user created", user_id=uid, email=email)
logger.error("payment failed", order_id=oid, exc_info=True)

# ❌ BAD — never interpolate strings
logger.info(f"user created: {uid}")
```

### Git Workflow
- **Branch strategy:** `main` (prod) → `develop` → `feat/xxx`, `fix/xxx`, `chore/xxx`
- **Never commit directly to `main`**
- **Commit format:** `feat: add user auth`, `fix: null pointer in payment`
- Run `make lint && make test` before every PR

### API Design
- All routes versioned under `/api/v1/`
- Every service must expose `/api/v1/health` (liveness) and `/api/v1/health/ready` (readiness)
- Pydantic models for all inputs/outputs — no untyped dicts in route handlers
- Error responses always `{"detail": "message"}` format

### Security Rules
- No secrets in code or logs
- Validate all user inputs (Zod on frontend, Pydantic on backend)
- Parameterized queries only — never f-strings in SQL
- Auth required on all non-public endpoints

---

## 🔄 Development Commands

```bash
# Backend
cd backend
make install-dev     # Install all deps (CPU + dev tools)
make dev             # Start API with reload (http://localhost:8080)
make test            # Run all tests
make lint            # ruff + mypy
make format          # ruff format

# GPU variants
make install-cuda124 # NVIDIA CUDA 12.4
make install-rocm    # AMD ROCm

# Docker builds
make build TARGET=cpu      # Build CPU image
make build TARGET=cuda124  # Build CUDA 12.4 image
make docker-up             # Start full stack (CPU)
make docker-up-cuda        # Start full stack (NVIDIA GPU)

# Database
make migrate         # Apply Alembic migrations
make migrate-create  # Create new migration

# Frontend
cd frontend
npm run dev          # Start (http://localhost:3000)
npm run test         # Run tests
npm run lint         # ESLint + TypeScript check
```

---

## 🤖 Superpowers Skills Active

| Skill | Trigger |
|---|---|
| `brainstorming` | Exploring approaches before coding |
| `writing-plans` | Multi-step feature work |
| `tdd` | Any new feature or bug fix |
| `subagent-driven-development` | Large implementation plans |
| `systematic-debugging` | Bug investigation |
| `code-review` | Before merging PRs |
| `verification` | Before marking tasks complete |
| `git-worktrees` | Parallel feature development |
| `security-audit` | Auth, payments, user data |
| `refactor` | Code quality improvements |

---

## 📌 Context Boundaries

| Usage | Action |
|---|---|
| 0–60% | Work normally |
| 50–70% | Monitor usage |
| 70–80% | Run compact |
| 80%+ | **Clear mandatory** |

---

## 🏷️ Key People & Contacts

| Role | Name | Contact |
|---|---|---|
| Tech Lead | [Name] | [Slack/email] |
| Product | [Name] | [Slack/email] |
| DevOps | [Name] | [Slack/email] |

---

## 📝 Open Items / Known Issues

- [ ] [Known issue or TODO]

---

*Last updated: [DATE] by [WHO]*
