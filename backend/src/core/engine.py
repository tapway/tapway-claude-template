"""Core engine — replace this with your actual application logic."""

from pathlib import Path

import structlog
import yaml

logger = structlog.get_logger()


class Engine:
    def __init__(self, config_path: str) -> None:
        self.config = self._load_config(config_path)
        logger.debug("engine initialised", config=self.config)

    def _load_config(self, path: str) -> dict:
        cfg_path = Path(path)
        if not cfg_path.exists():
            logger.warning("config file not found, using empty config", path=path)
            return {}
        with cfg_path.open() as f:
            return yaml.safe_load(f) or {}

    def run(self) -> None:
        """Override this method with your application logic."""
        logger.info("engine running — replace this with real logic")
