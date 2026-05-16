# /bootstrap — New Developer Setup

Set up a new developer environment for this project. Because projects use
different tech stacks, the steps are generated dynamically.

## Instructions

1. **Detect the tech stack** by reading:
   - `CLAUDE.md` — the `## 🏗️ Tech Stack` section
   - Root-level config files: `package.json`, `pyproject.toml`, `Cargo.toml`,
     `go.mod`, `composer.json`, etc.
   - `docker-compose.yml` for service dependencies (DB, Redis, queues, etc.)
   - Any `Makefile` or `Justfile` for available dev commands
   - `.env.example` or `.env.sample` for required environment variables

2. **Generate step-by-step instructions** covering:

   - **Prerequisites** — language runtimes, system packages, Docker, cloud CLIs.
     Check actual versions needed against what's installed.
   - **Clone & configure** — repo URL, env file setup, secrets.
   - **Install dependencies** — use the project's actual package manager
     (detected in step 1). Examples: `uv sync`, `npm ci`, `go mod download`,
     `bundle install`, `cargo build`.
   - **Database setup** — if the project has a database: migrations, seeding.
     Use the actual migration tool (Alembic, Prisma, Diesel, etc.).
   - **Start services** — Docker Compose for infrastructure, dev servers for
     the app(s). Use the actual commands from the Makefile or config.
   - **Verify** — hit health endpoints, run `/test-all`.

3. **Troubleshooting** — if any step fails, check:
   - Missing system packages (suggest install command for the user's OS)
   - Port conflicts
   - Environment variable gaps

## Output

Present as a clean numbered checklist. Check off steps as they're completed.
End with:
> "Setup complete. Run `/test-all` to confirm everything works."
