"""FastAPI application factory.

Every service in the team must expose at minimum:
  GET /health        — liveness probe  (is the process alive?)
  GET /health/ready  — readiness probe (can it serve traffic?)

Add your feature routers below the health router.
"""

import os
from contextlib import asynccontextmanager
from typing import AsyncGenerator

import structlog
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from src.api.routes import health

logger = structlog.get_logger()

APP_VERSION = os.getenv("APP_VERSION", "0.1.0")
APP_NAME    = os.getenv("APP_NAME", "[PROJECT_NAME]")
APP_ENV     = os.getenv("APP_ENV", "development")

limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    logger.info("application started", name=APP_NAME, version=APP_VERSION, env=APP_ENV)
    yield
    logger.info("application stopping", name=APP_NAME)


def create_app() -> FastAPI:
    """Instantiate and configure the FastAPI application."""
    app = FastAPI(
        title=APP_NAME,
        version=APP_VERSION,
        docs_url="/docs" if APP_ENV != "production" else None,
        redoc_url="/redoc" if APP_ENV != "production" else None,
        lifespan=lifespan,
    )

    # ── Rate limiting ─────────────────────────────────────────────────────────
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    # ── CORS ─────────────────────────────────────────────────────────────────
    allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Routers ───────────────────────────────────────────────────────────────
    # Health check — always first, required in every service
    app.include_router(health.router, prefix="/api/v1", tags=["health"])

    # Add your feature routers here:
    # from src.api.routes import auth
    # app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])

    return app


# Module-level instance used by Granian and tests
app = create_app()
