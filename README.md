# [PROJECT_NAME]

> [One-sentence project description]

## Quick Start

```bash
# 1. Clone and configure
git clone [REPO_URL]
cd [PROJECT_NAME]
cp .env.example .env       # Fill in required values

# 2. Start infrastructure
docker compose up -d postgres

# 3. Backend
cd backend
pip install uv && uv sync --extra cpu --extra dev
make migrate
make dev                   # http://localhost:8080/docs

# 4. Frontend (new terminal)
cd frontend
npm install
npm run dev                # http://localhost:3000
```

Or run everything with Docker:
```bash
docker compose up          # CPU
make docker-up-cuda        # NVIDIA GPU
make docker-up-rocm        # AMD GPU
```

## Project Structure

| Path | Purpose |
|---|---|
| `CLAUDE.md` | Claude AI context — conventions, stack, open items |
| `.claude/` | Claude Code config — hooks, slash commands, permissions |
| `skills/` | AI skills (brainstorming, TDD, code review, security audit…) |
| `agents/` | Specialized subagents (reviewer, tester, security, devops) |
| `frontend/` | Next.js 14 + TypeScript + Tailwind |
| `backend/` | Python 3.11 · FastAPI · Granian · structlog · SQLAlchemy |
| `backend/docker/` | Multi-target Dockerfiles (cpu / cuda124 / cuda118 / rocm / jetson) |
| `docs/` | Architecture, API reference, onboarding |
| `.github/` | CI/CD pipelines + PR template |

## Team Standards

| Concern | Tool |
|---|---|
| Package manager | `uv` |
| ASGI server | Granian (not uvicorn) |
| JSON logging | structlog |
| Linting / formatting | ruff (PEP 8) |
| Type checking | mypy (strict) |
| Tests | pytest (TDD) |

## Claude Code Commands

| Command | Description |
|---|---|
| `/new-feature` | Start a new feature with full superpowers workflow |
| `/review` | Code review current changes |
| `/test-all` | Run all tests and report |
| `/deploy` | Pre-deployment checklist |
| `/bootstrap` | New developer setup guide |

## Docker Targets

```bash
make build TARGET=cpu       # Generic CPU (x86 & ARM)
make build TARGET=cuda124   # NVIDIA CUDA 12.4
make build TARGET=cuda118   # NVIDIA CUDA 11.8
make build TARGET=rocm      # AMD ROCm
make build TARGET=jetson    # Jetson Orin/Xavier (aarch64)
```

## Contributing

1. Read `CLAUDE.md` for all conventions
2. Use `/new-feature` to start any new work
3. Open a PR — all CI checks must pass

## License

[MIT / Your License]
