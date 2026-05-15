# ─── Build stage ───────────────────────────────────────────────────────────
FROM python:3.12-slim AS builder

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    UV_SYSTEM_PYTHON=1

# Install uv (from official image — no pip needed)
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Copy dependency files first (layer caching)
COPY pyproject.toml ./

# Install production dependencies only
RUN uv sync --extra cpu --no-dev --frozen

# ─── Runtime stage ─────────────────────────────────────────────────────────
FROM python:3.12-slim AS runtime

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/app/.venv/bin:$PATH" \
    PYTHONPATH="/app"

# Security: run as non-root user
RUN addgroup --system app && adduser --system --group app

# Copy installed packages and app source
COPY --from=builder /app/.venv /app/.venv
COPY --chown=app:app src/ ./src/
COPY --chown=app:app configs/ ./configs/

USER app

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:8080/api/v1/health || exit 1

# Uses Granian via the project.scripts entry point (see pyproject.toml)
CMD ["uv", "run", "python", "src/main.py"]
