"""Structlog configuration — pure JSON logging for all services.

Team usage
----------
1. Call ``setup_logging()`` once at startup in ``main.py`` before anything else.
2. In every module, get a logger at module level (not per-function):

       import structlog
       logger = structlog.get_logger()

3. Always pass context as keyword arguments, never interpolate strings:

       # Good
       logger.info("user created", user_id=uid, email=email)

       # Bad — do not do this
       logger.info(f"user created: {uid}")

Log levels
----------
Use the level that matches the situation:

    logger.debug("cache miss", key=cache_key, ttl=300)
    logger.info("request completed", method="GET", path="/health", status=200, duration_ms=12)
    logger.warning("retry attempt", attempt=2, max_retries=3, service="payments")
    logger.error("payment failed", order_id=order_id, reason=str(exc), exc_info=True)
    logger.critical("database unreachable", host=db_host, port=db_port)

Request-scoped context (e.g. in FastAPI middleware)
-----------------------------------------------------
Bind fields once and they appear on every subsequent log call in that request:

    import structlog
    structlog.contextvars.bind_contextvars(request_id=req_id, user_id=uid)
    # ... handle request ...
    structlog.contextvars.clear_contextvars()

Sample JSON output
------------------
    {"timestamp": "2026-04-10T09:00:00.123456Z", "level": "info",
     "logger": "src.api.routes.health", "event": "request completed",
     "method": "GET", "path": "/health", "status": 200, "duration_ms": 5}
"""

import logging
import sys

import structlog


def setup_logging(level: str = "INFO") -> None:
    """Configure structlog for pure JSON output.

    Must be called once at application startup, before any log calls.

    Args:
        level: Minimum log level — DEBUG | INFO | WARNING | ERROR | CRITICAL
    """
    log_level = getattr(logging, level.upper(), logging.INFO)

    structlog.configure(
        processors=[
            # Merge request-scoped fields bound via structlog.contextvars
            structlog.contextvars.merge_contextvars,
            # Attach log level string ("info", "error", …)
            structlog.stdlib.add_log_level,
            # Attach the logger name (module dotted path)
            structlog.stdlib.add_logger_name,
            # ISO-8601 UTC timestamp
            structlog.processors.TimeStamper(fmt="iso", utc=True),
            # Render exception tracebacks when exc_info=True is passed
            structlog.processors.ExceptionRenderer(),
            # Render the final event dict as compact JSON — one line per event
            structlog.processors.JSONRenderer(),
        ],
        wrapper_class=structlog.make_filtering_bound_logger(log_level),
        context_class=dict,
        logger_factory=structlog.PrintLoggerFactory(sys.stdout),
        cache_logger_on_first_use=True,
    )
