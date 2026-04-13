# Developer Onboarding

Welcome to [PROJECT_NAME]! This guide gets you from zero to a running local dev environment.

## Prerequisites

Install these before starting:

- **Node.js** ≥ 20 LTS — [nodejs.org](https://nodejs.org)
- **Python** ≥ 3.12 — [python.org](https://python.org)
- **uv** (Python package manager) — `curl -LsSf https://astral.sh/uv/install.sh | sh`
- **Docker Desktop** — [docker.com](https://docker.com)
- **Claude Code** (optional but recommended) — `npm i -g @anthropic-ai/claude-code`

## Step-by-Step Setup

### 1. Clone and configure

```bash
git clone [REPO_URL]
cd [PROJECT_NAME]
cp .env.example .env
```

Open `.env` and fill in any required values (ask your tech lead for secrets).

### 2. Start the database

```bash
docker compose up -d postgres
```

### 3. Set up the backend

```bash
cd backend
uv sync --all-extras         # Install Python dependencies
make migrate                  # Apply DB migrations
make seed                     # Load sample data (optional)
make dev                      # Start API at http://localhost:8000
```

Verify: open http://localhost:8000/docs — you should see the FastAPI Swagger UI.

### 4. Set up the frontend

```bash
cd frontend
npm install
npm run dev                   # Start at http://localhost:3000
```

Verify: open http://localhost:3000 — you should see the app.

## Using Claude Code

```bash
# Open the project in Claude Code
claude

# Useful commands once inside:
/bootstrap      # Re-run this guide as a checklist
/test-all       # Run all tests
/new-feature    # Start building a new feature
/review         # Review your current changes
```

## Common Problems

| Problem | Solution |
|---|---|
| `DATABASE_URL` error | Check your `.env` and that Docker postgres is running |
| Port 8000 already in use | `lsof -i :8000` and kill the process |
| `uv sync` fails | Ensure Python 3.12+ is installed: `python --version` |
| `npm install` fails | Ensure Node 20+ is installed: `node --version` |
| Migrations fail | Check DATABASE_URL and run `make migrate` again |

## Getting Help

- Read `CLAUDE.md` — it has all project conventions
- Check `docs/architecture.md` for system design
- Ask in #[PROJECT]-dev Slack channel
