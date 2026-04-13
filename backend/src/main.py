"""Application entry point — starts the Granian ASGI server.

Granian is the team-standard ASGI server (replaces uvicorn/gunicorn).
All configuration is read from environment variables so containers need
no code changes between environments.

Usage:
    make run
    uv run python src/main.py

Environment variables:
    HOST      Bind address        (default: 0.0.0.0)
    PORT      Bind port           (default: 8080)
    WORKERS   Number of workers   (default: 1)
    LOG_LEVEL                     (default: INFO)
"""

import os

import structlog
from granian import Granian
from granian.constants import Interfaces

from src.utils.logging import setup_logging

logger = structlog.get_logger()


def main() -> None:
    setup_logging(os.getenv("LOG_LEVEL", "INFO"))

    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8080"))
    workers = int(os.getenv("WORKERS", "1"))

    logger.info("starting granian", host=host, port=port, workers=workers)

    Granian(
        target="src.api.app:app",
        address=host,
        port=port,
        interface=Interfaces.ASGI,
        workers=workers,
    ).serve()


if __name__ == "__main__":
    main()
