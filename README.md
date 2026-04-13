# tapway-claude-template

> The Tapway team template for every new project — Claude Code ready, superpowers included.

This repo is the starting point for all new Tapway services. It combines the team's Python/FastAPI standards (Granian, structlog, multi-GPU Docker) with a full Claude Code setup (CLAUDE.md, skills, agents, slash commands, hooks) so that every repo gets an AI-powered dev workflow out of the box.

---

## Using This Template for a New Project

### Step 1 — Create a new repo from this template

On GitHub, click **"Use this template" → "Create a new repository"**.

Or via CLI:
```bash
gh repo create tapway/my-new-service \
  --template tapway/tapway-claude-template \
  --private --clone
cd my-new-service
```

### Step 2 — Personalise the placeholders

Search for `[PROJECT_NAME]` across the repo and replace with your service name:
```bash
# macOS / Linux
grep -rl '\[PROJECT_NAME\]' . --exclude-dir='.git' | xargs sed -i 's/\[PROJECT_NAME\]/my-service/g'

# Or just find them:
grep -r '\[PROJECT_NAME\]' . --exclude-dir='.git'
```

Key files to update:
| File | What to fill in |
|---|---|
| `CLAUDE.md` | Project goal, repo URL, tech choices, team contacts |
| `README.md` | Project description, repo URL |
| `backend/pyproject.toml` | `name` field |
| `.env.example` | Any service-specific env vars |
| `docker-compose.yml` | Service name, DB name |

### Step 3 — Configure your environment

```bash
cp .env.example .env
# Edit .env — fill in DATABASE_URL, SECRET_KEY, etc.
```

### Step 4 — Install Claude Code (if you haven't already)

```bash
npm install -g @anthropic-ai/claude-code
```

Claude Code is the CLI that powers the AI dev workflow in this repo. It reads `CLAUDE.md`, activates skills automatically, and gives you slash commands inside your terminal.

### Step 5 — Open the project in Claude Code

```bash
cd my-new-service
claude
```

That's it. Claude will read `CLAUDE.md` and `skills/` automatically and be fully context-aware of your project's conventions from the first message.

---

## Working with Claude Code Day-to-Day

### Slash Commands

Type these directly in the Claude Code prompt:

| Command | When to use |
|---|---|
| `/new-feature` | Starting any new feature — brainstorms, plans, then builds with TDD |
| `/review` | Before opening a PR — runs a full code review |
| `/test-all` | After making changes — runs all tests and reports failures |
| `/deploy` | Before shipping — walks through the pre-deployment checklist |
| `/bootstrap` | Onboarding a new dev — step-by-step environment setup |

### Skills (Auto-Activated)

Skills live in `skills/` and are activated automatically by Claude when the situation calls for it. You don't need to invoke them manually — Claude does it. But you can also invoke them explicitly:

> "Use the TDD skill to implement the payment service"
> "Run the security audit skill on the auth routes"

| Skill | What it does |
|---|---|
| `brainstorming` | Explores 3+ approaches before writing any code |
| `writing-plans` | Breaks work into 2–5 min tasks with exact file paths and commands |
| `tdd` | Enforces Red → Green → Refactor — no production code without a failing test first |
| `subagent-driven-development` | Dispatches fresh sub-agents per task for large plans |
| `systematic-debugging` | Structured bug investigation: reproduce → isolate → hypothesise → fix |
| `code-review` | Critical / Warning / Suggestion review with file:line references |
| `verification` | Runs tests + type checks + lint before marking anything complete |
| `git-worktrees` | Parallel feature development in isolated worktrees |
| `security-audit` | OWASP Top 10 checklist tailored to FastAPI + Next.js |
| `refactor` | Safe, test-backed refactoring in small committed steps |

### Agents (Specialist Sub-Agents)

Agents in `agents/` are specialist workers you can spin up for specific tasks:

```
# Examples — say these in the Claude Code prompt:
"Use the code-reviewer agent to review my PR diff"
"Run the security-auditor agent on src/api/routes/auth.py"
"Ask the test-writer agent to write tests for UserService"
"Get the devops-sre agent to debug why the CI pipeline is failing"
```

| Agent | Best for |
|---|---|
| `code-reviewer` | Thorough PR reviews with security + performance checks |
| `test-writer` | Writing pytest / Jest tests for existing code |
| `security-auditor` | Deep security review of auth, payments, user data |
| `devops-sre` | Pipeline failures, Docker issues, deployment debugging |

### Hooks (Automatic)

These run silently in the background — you don't need to do anything:

| Hook | Trigger | What it does |
|---|---|---|
| `pre-bash-safety` | Before any shell command | Blocks force pushes, hard resets on main |
| `post-write-lint` | After every file write/edit | Auto-runs `ruff` (Python) or `eslint` (TS) |
| `pre-commit-secrets` | Before every commit | Scans for API keys, passwords, tokens |
| `session-start` | When Claude Code opens | Loads git status + open TODOs from CLAUDE.md |

---

## Typical Feature Workflow

Here's what building a new feature looks like with this setup:

```
1. Open Claude Code:          claude

2. Start the feature:         /new-feature
   Claude will:
   → Ask clarifying questions
   → Brainstorm approaches (brainstorming skill)
   → Write a plan to docs/plans/[feature].md (writing-plans skill)
   → Implement task by task with TDD (tdd skill)
   → Self-review before finishing (code-review + verification skills)

3. Review before PR:          /review
   Claude will check for security issues, type safety, test coverage

4. Run full test suite:       /test-all
   Must pass before opening PR

5. Open PR:                   use .github/pull_request_template.md
```

---

## Quick Start (Local Dev)

```bash
# 1. Start infrastructure
docker compose up -d postgres

# 2. Backend
cd backend
uv sync --extra cpu --extra dev
make migrate
make dev                   # → http://localhost:8080/docs

# 3. Frontend (new terminal)
cd frontend
npm install
npm run dev                # → http://localhost:3000
```

GPU variants:
```bash
make install-cuda124       # NVIDIA CUDA 12.4
make install-rocm          # AMD ROCm
make docker-up-cuda        # Full stack with NVIDIA GPU
```

---

## Project Structure

```
.
├── CLAUDE.md                   ← Claude's memory: conventions, stack, contacts
├── .claude/
│   ├── settings.json           ← Hooks, permissions, env config
│   └── commands/               ← Slash commands (/review, /deploy, etc.)
├── skills/                     ← Auto-activated AI skills
├── agents/                     ← Specialist subagents
├── frontend/                   ← Next.js 14 · TypeScript · Tailwind
├── backend/
│   ├── src/
│   │   ├── main.py             ← Entry point (Granian)
│   │   ├── api/app.py          ← FastAPI factory
│   │   ├── api/routes/         ← Route handlers
│   │   ├── core/engine.py      ← Business logic scaffold
│   │   ├── models/             ← SQLAlchemy models
│   │   └── utils/
│   │       ├── logging.py      ← structlog setup
│   │       └── device.py       ← GPU detection
│   ├── docker/                 ← Dockerfile.cpu/cuda124/cuda118/rocm/jetson
│   └── scripts/build.sh        ← One-command Docker builds
├── docs/                       ← Architecture, API reference, onboarding
└── .github/workflows/          ← CI (lint, test, type-check, Docker build, Trivy)
```

## Team Standards

| Concern | Tool | Rule |
|---|---|---|
| Package manager | `uv` | Never use `pip install` directly |
| ASGI server | Granian | Never use uvicorn or gunicorn |
| JSON logging | structlog | Always pass context as kwargs, never f-strings |
| Linting | ruff | Run `make lint` before every commit |
| Type checking | mypy strict | All public functions must be typed |
| Tests | pytest + TDD | Write the test first — always |
| Commits | Conventional Commits | `feat:` `fix:` `chore:` `refactor:` |

## Docker Targets

```bash
make build TARGET=cpu       # Generic CPU (x86 & ARM)
make build TARGET=cuda124   # NVIDIA CUDA 12.4 (RTX 3xxx/4xxx, A100, H100)
make build TARGET=cuda118   # NVIDIA CUDA 11.8 (RTX 20xx, T4, V100)
make build TARGET=rocm      # AMD ROCm (RX 6xxx/7xxx, Instinct MI)
make build TARGET=jetson    # Jetson Orin/Xavier (aarch64, cross-compiled)
```

## Contributing

1. Read `CLAUDE.md` — it has everything Claude and humans need to know
2. Use `/new-feature` to start any new work
3. All CI checks must pass before merging
4. See `docs/onboarding.md` for a full new-developer walkthrough
