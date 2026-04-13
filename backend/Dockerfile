# ─── Build stage ───────────────────────────────────────────────────────────
FROM python:3.12-slim AS builder

WORKDIR /app

# Install uv for fast dependency resolution
RUN pip install uv --no-cache-dir

# Copy dependency files first (layer caching)
COPY pyproject.toml ./

# Install production dependencies only
RUN uv sync --no-dev --frozen

# ─── Runtime stage ─────────────────────────────────────────────────────────
FROM python:3.12-slim AS runtime

WORKDIR /app

# Security: run as non-root user
RUN addgroup --system app && adduser --system --group app
USER app

# Copy installed packages from builder
COPY --from=builder /app/.venv /app/.venv

# Copy application source
COPY --chown=app:app src/ ./src/

# Activate virtual environment
ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONPATH="/app"

EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD python -c "import httpx; httpx.get('http://localhost:8000/api/v1/health').raise_for_status()"

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
