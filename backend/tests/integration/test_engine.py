"""Integration test — Engine loads a real config and runs without error."""

import pytest

from src.core.engine import Engine


def test_engine_with_missing_config(tmp_path) -> None:
    engine = Engine(config_path=str(tmp_path / "nonexistent.yaml"))
    assert engine.config == {}


def test_engine_with_real_config() -> None:
    engine = Engine(config_path="configs/default.yaml")
    assert "app" in engine.config
    engine.run()  # should not raise
