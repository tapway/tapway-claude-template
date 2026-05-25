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
│   ├── commands/               ← Slash commands (/review, /deploy, etc.)
│   └── skills/                 ← AI skills with frontmatter (Skill-tool invokable)
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
│   │   ├── conftest.py          ← Shared fixtures (db_session, test client)
│   │   ├── unit/                ← Mock-isolated unit tests
│   │   └── integration/         ← Tests with real configs/subsystems
│   ├── configs/
│   │   └── default.yaml         ← App config (override via env vars)
│   ├── docker/                  ← Multi-target Dockerfiles + GPU compose overlays
│   │   ├── Dockerfile.cpu       ← x86_64 + ARM, uv binary, Granian, HEALTHCHECK
│   │   ├── Dockerfile.cuda124   ← NVIDIA CUDA 12.4 (RTX 3xxx/4xxx, A100, H100)
│   │   ├── Dockerfile.cuda118   ← NVIDIA CUDA 11.8 (RTX 20xx, T4, V100)
│   │   ├── Dockerfile.rocm      ← AMD ROCm 6 (RX 6xxx/7xxx, Instinct MI)
│   │   ├── Dockerfile.jetson    ← Jetson Orin/Xavier (aarch64)
│   │   ├── compose.cuda.yml     ← GPU overlay (CUDA)
│   │   └── compose.rocm.yml     ← GPU overlay (ROCm)
│   └── scripts/
│       ├── build.sh             ← One-command Docker build for any target
│       └── apt-packages.txt     ← System packages devs/DevOps must install
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

Always pass context as keyword arguments — never interpolate strings:

```python
# ✅ GOOD — context as keyword arguments
logger.info("user created", user_id=uid, email=email)
logger.error("payment failed", order_id=oid, exc_info=True)

# ❌ BAD — never interpolate strings
logger.info(f"user created: {uid}")
```

Request-scoped context (e.g. in FastAPI middleware) — bind fields once, they appear on every subsequent log call:

```python
import structlog
structlog.contextvars.bind_contextvars(request_id=req_id, user_id=uid)
# ... handle request ...
structlog.contextvars.clear_contextvars()
```

### Config Pattern
- App defaults in `backend/configs/default.yaml`
- Per-environment overrides via `local.yaml` or env vars
- Engine loads config at startup: `Engine(config_path="configs/default.yaml")`

### Docker Build Pattern
- Multi-target: `cpu`, `cuda124`, `cuda118`, `rocm`, `jetson`
- Build: `./scripts/build.sh <target>` or `make build TARGET=<target>`
- GPU compose overlays: `docker compose -f docker-compose.yml -f docker/compose.cuda.yml up`
- All images include HEALTHCHECK polling `GET /api/v1/health`

### Git Workflow
- **Branch strategy:** `main` (prod) → `feat/xxx`, `fix/xxx`, `chore/xxx`
- **Never commit directly to `main`** — the pre-bash safety hook blocks it. Create a feature branch for every change:
  ```bash
  git checkout -b feat/<feature-name>   # new feature
  git checkout -b fix/<bug-name>        # bug fix
  git checkout -b chore/<task-name>     # cleanup, deps, config
  ```
- **Commit format:** conventional commits — `feat: add user auth`, `fix: null pointer in payment`, `chore: update dependencies`
- Run `make lint && make test` before every PR

### Environment Safety
- **Prod operations are guarded by the pre-bash safety hook.** Any command containing `DATABASE_URL.*prod`, `docker compose.*production`, or `--production` is blocked
- **To run prod operations:** set `ALLOW_PROD=1` before the command:
  ```bash
  ALLOW_PROD=1 docker compose -f docker-compose.production.yml up
  ```
- This is intentionally inconvenient — you should rarely need it during development
- `.env` files must never contain production credentials; use `.env.local` (gitignored) for local overrides

### Release Workflow
Every conventional commit appends a line to `CHANGELOG.unreleased.md` automatically via the post-commit hook. To cut a release:
```
/release patch    # 0.1.0 → 0.1.1 (bug fixes)
/release minor    # 0.1.0 → 0.2.0 (new features)
/release major    # 0.1.0 → 1.0.0 (breaking changes)
```
This bumps the version in `VERSION`, collates unreleased notes into `CHANGELOG.md`, creates a git tag, and resets the unreleased log.

### Upgrading Plugins/Skills
Skills, agents, and hooks come from installed plugins — not local files. To upgrade:
```
/upgrade-skills
```
This updates all marketplace catalogs and plugins to their latest versions. Restart Claude Code after updating.

Manual equivalent:
```bash
claude plugin marketplace update
claude plugin update tapway-superpowers@tapway
```

### Adding Superpowers to an Existing Repo
If you have an existing repo that wasn't initialized from this template:
```bash
# 1. Register the Tapway marketplace
claude plugin marketplace add https://github.com/tapway/tapway-superpowers

# 2. Install the superpowers plugin
claude plugin install tapway-superpowers@tapway

# 3. (Optional) Install companion plugins
claude plugin install andrej-karpathy-skills@karpathy-skills
claude plugin install claude-code-setup@claude-plugins-official
```
Skills and hooks activate immediately. For permissions and env settings, copy the relevant sections from this template's `.claude/settings.json`.

### API Design
- All routes versioned under `/api/v1/`
- Every service must expose `/api/v1/health` (liveness) and `/api/v1/health/ready` (readiness)
- Health endpoints use Pydantic `BaseModel` responses — always typed
- Readiness checks downstream deps (DB, cache); liveness stays dependency-free
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
| `repo-docs` | Generating the standardized `docs/` folder (architecture, schema, deployment) at end of project |
| `pre-review-cleanup` | Removing template artifacts before code review |

**Triggering a skill:** these activate automatically when a relevant phrase appears in conversation, and can also be invoked explicitly via the Skill tool by name. All skills are provided by the `tapway-superpowers` plugin — they are not stored locally in `.claude/skills/`. Run `/upgrade-skills` to pull the latest versions.

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
| Tech Lead | [Chee How] | [cheehow@gotapway.com] |
| Product | [Jason Cham] | [jason.cham@itmax.com.my] |

---

## 📝 Open Items / Known Issues

- [ ] [Known issue or TODO]

---

*Last updated: [DATE] by [WHO]*
