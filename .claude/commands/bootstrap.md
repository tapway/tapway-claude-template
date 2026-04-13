# /bootstrap — New Developer Setup

Bootstrap a new developer's environment from scratch.

## Steps

1. **Prerequisites check:**
   - Node.js ≥ 20 LTS
   - Python ≥ 3.12
   - Docker + Docker Compose
   - `uv` (Python package manager)

2. **Clone & install:**
   ```bash
   git clone [REPO_URL]
   cd [PROJECT_NAME]
   cp .env.example .env  # Fill in required values
   ```

3. **Frontend setup:**
   ```bash
   cd frontend
   npm install
   ```

4. **Backend setup:**
   ```bash
   cd backend
   uv sync              # Install Python deps
   make migrate         # Run DB migrations
   make seed            # Seed dev data (optional)
   ```

5. **Start everything:**
   ```bash
   docker compose up -d  # Start DB, Redis, etc.
   cd frontend && npm run dev &
   cd backend && make dev &
   ```

6. **Verify:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000/docs
   - Run `/test-all` to confirm setup

## Troubleshooting

Common issues and fixes are in `docs/onboarding.md`.
