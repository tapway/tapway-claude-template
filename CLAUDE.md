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

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 20 LTS
- **Python** ≥ 3.12
- **uv** — `curl -LsSf https://astral.sh/uv/install.sh | sh`
- **Docker Desktop**
- **Claude Code** (recommended) — `npm i -g @anthropic-ai/claude-code`

### First-Time Setup

```bash
# 1. Clone and configure
git clone [REPO_URL]
cd [PROJECT_NAME]
cp .env.example .env          # Fill in secrets (ask tech lead)

# 2. Start database
docker compose up -d postgres

# 3. Backend
cd backend
uv sync --all-extras
make migrate
make dev                      # http://localhost:8000

# 4. Frontend (new terminal)
cd frontend
npm install
npm run dev                   # http://localhost:3000
```

Verify: open http://localhost:8000/docs (Swagger UI) and http://localhost:3000 (app).

### Common Issues

| Problem | Solution |
|---|---|
| `DATABASE_URL` error | Check `.env` and that postgres is running |
| Port 8000 in use | Kill the process on that port |
| `uv sync` fails | Ensure Python 3.12+: `python --version` |
| `npm install` fails | Ensure Node 20+: `node --version` |

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

## 🏛️ Architecture

```
Next.js 14 (Vercel)  ──HTTP──▶  FastAPI (Granian)  ──SQL──▶  PostgreSQL 16
     Port 3000                       Port 8000                   Port 5432
```

### Key Design Decisions
- **API:** RESTful, versioned under `/api/v1/`, JSON in/out, Pydantic for all schemas
- **Auth:** JWT access tokens (15min) + refresh tokens (7 days), httpOnly cookies
- **DB:** SQLAlchemy 2 async + Alembic migrations, UUID primary keys, `created_at`/`updated_at` on every model
- **Frontend state:** React Query for all server state — never raw `fetch` in components
- **Validation:** Zod (frontend), Pydantic (backend) — double-validate at the boundary

### New Feature Workflow
1. Write DB migration → 2. Pydantic schemas → 3. Service layer → 4. FastAPI route → 5. TypeScript types → 6. React Query hook → 7. UI component → 8. Tests at each layer

### ADRs
Significant technical decisions go in `docs/adr/`. See existing entries for format.

---

## UI Design Rules

> **Golden Rule:** Every frontend page uses the admin dashboard shell. Never create standalone layouts unless explicitly asked.

### Theme Reference

`frontend/src/app/globals.css` is the single source of truth for all colors, fonts, shadows, and radii. All tokens are CSS variables in HSL format for shadcn/ui compatibility.

| Token | Usage |
|---|---|
| `bg-primary` / `text-primary-foreground` | Lime green `#8DC63F` — CTAs, active states, primary buttons |
| `bg-secondary` / `text-secondary-foreground` | Navy `#1E2D5A` — secondary elements |
| `text-foreground` | Navy `#1E2D5A` (light) / Grey `#777777` (dark) — body text |
| `text-muted-foreground` | `#777777` — captions, labels, metadata |
| `bg-card` | White `#FFFFFF` (light) / Dark navy (dark) — card backgrounds |
| `border-border` | `#E8E8E8` — borders, dividers |
| `shadow-card` | `2px 4px 8px rgba(0,0,0,0.12)` — ALL cards and shapes |
| `rounded-lg` | `0.3rem` — standard corner radius |
| Font | Poppins — all text, all weights |

### Layout Architecture

- **Admin shell:** `frontend/src/components/layouts/admin-layout.tsx` — 290px sidebar (left) + sticky header (top, 64px) + `<main>` content area
- **Auth shell:** `frontend/src/components/layouts/auth/AuthLayout.tsx` — split panel: navy decorative left + white form right
- **Sidebar:** Route groups defined in `sidebar-data.ts`. Auto-expands current section. Collapses to overlay on mobile (< 1024px)
- **Header:** Theme toggle (sun/moon), notification bell with count badge, user avatar with dropdown

### Component Library

All interactive elements come from shadcn/ui in `frontend/src/components/ui/`. **Always use these — never write raw HTML inputs, buttons, tables, or dialogs.**

| Component | Import |
|---|---|
| Button | `@/components/ui/button` |
| Card | `@/components/ui/card` |
| Input | `@/components/ui/input` |
| Table | `@/components/ui/table` |
| Badge | `@/components/ui/badge` |
| Dialog | `@/components/ui/dialog` |
| Select | `@/components/ui/select` |
| Checkbox | `@/components/ui/checkbox` |
| Tabs | `@/components/ui/tabs` |
| DropdownMenu | `@/components/ui/dropdown-menu` |
| Skeleton | `@/components/ui/skeleton` |
| Separator | `@/components/ui/separator` |

### Page Templates

Reference existing pages as starting points:
- Tables → `frontend/src/app/(dashboard)/tables/page.tsx`
- Forms → `frontend/src/app/(dashboard)/forms/page.tsx`
- Charts → `frontend/src/app/(dashboard)/charts/page.tsx`
- UI Elements → `frontend/src/app/(dashboard)/ui-elements/page.tsx`
- Settings → `frontend/src/app/(dashboard)/settings/page.tsx`
- Auth → `frontend/src/app/(auth)/sign-in/page.tsx`

### Color Rules

- **Background is always white** (`bg-background`) — no dark backgrounds in light mode
- **Lime green is the single dominant accent** — use for CTAs and the most important element per page
- **Navy is for hierarchy** — headings, key labels
- **Shadows on ALL cards and shapes** — never flat. Use `shadow-card` on every Card
- **Rounded corners on everything** — use `rounded-lg` (0.3rem) for cards, `rounded-md` for buttons and inputs
- Never use cyan or warm-neutral backgrounds

### Typography

- **Poppins** for everything — headings, body, labels, pills, stats
- Heading sizes: 24-32px (H1), 16-20px (H2)
- Body text: 13px, `text-muted-foreground` for secondary text
- Captions: 10px, `text-muted-foreground`
- KPI numbers: large (2xl-4xl), bold, `text-foreground`

### Dark Mode

Always supported via `.dark` class (from `next-themes`). Dark bg = `#0F1E3D`, text = `#777777`. All shadcn/ui components auto-adapt via CSS variables. Use the `ThemeToggle` component from the header.

### Tapway Brand

The full brand guide is at `docs/brand-guidelines.md`. Key points for UI:
- Logo: `frontend/public/tapway-logo.png` — use the `Logo` component from `@/components/logo`
- "an ITMAX subsidiary" descriptor in light grey below or beside logo where context requires
- Never recolour the logo or make custom variants
- Never use the ITMAX logo — only the Tapway logo

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
