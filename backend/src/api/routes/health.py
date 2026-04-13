"""Health check endpoints — required in every service.

Liveness  GET /api/v1/health        Used by Docker/Kubernetes to detect crashed pods.
Readiness GET /api/v1/health/ready  Used by load balancers to gate traffic.

Both must remain dependency-free and respond in < 100 ms.
If your service has downstream dependencies (DB, cache, etc.) add them to the
readiness check only — never to liveness.
"""

import os
import time
from typing import Any

import structlog
from fastapi import APIRouter
from pydantic import BaseModel

logger = structlog.get_logger()

router = APIRouter()

_START_TIME = time.time()
_VERSION    = os.getenv("APP_VERSION", "0.1.0")


class HealthResponse(BaseModel):
    status: str
    version: str
    uptime_seconds: float


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Liveness probe",
    description="Returns 200 while the process is alive. No external calls.",
)
async def health() -> HealthResponse:
    uptime = round(time.time() - _START_TIME, 2)
    logger.debug("health check", uptime_seconds=uptime)
    return HealthResponse(status="ok", version=_VERSION, uptime_seconds=uptime)


@router.get(
    "/health/ready",
    response_model=dict,
    summary="Readiness probe",
    description="Returns 200 when the service is ready to handle traffic.",
)
async def ready() -> dict[str, Any]:
    # Add downstream dependency checks here:
    #   - DB ping: await db.execute("SELECT 1")
    #   - Cache ping: await redis.ping()
    # Raise HTTPException(status_code=503, detail="db unavailable") if not ready.
    return {"status": "ready", "version": _VERSION}
