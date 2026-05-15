"""Unit tests for device utilities."""

import sys
from unittest.mock import MagicMock, patch

import pytest

from src.utils.device import get_best_device, get_device_info


def test_get_device_info_no_torch() -> None:
    """Falls back to cpu info when torch is not installed."""
    with patch.dict(sys.modules, {"torch": None}):
        info = get_device_info()
    assert info["backend"] == "cpu"
    assert info["devices"] == []


def test_get_device_info_cuda() -> None:
    """Reports cuda backend when torch.cuda.is_available() is True."""
    mock_torch = MagicMock()
    mock_torch.cuda.is_available.return_value = True
    mock_torch.version.cuda = "12.4"
    mock_torch.cuda.device_count.return_value = 1
    mock_torch.cuda.get_device_name.return_value = "NVIDIA RTX 4090"
    props = MagicMock()
    props.total_memory = 24 * 10**9
    mock_torch.cuda.get_device_properties.return_value = props

    with patch.dict(sys.modules, {"torch": mock_torch}):
        info = get_device_info()

    assert info["backend"] == "cuda"
    assert info["cuda_version"] == "12.4"
    assert len(info["devices"]) == 1
    assert info["devices"][0]["name"] == "NVIDIA RTX 4090"


def test_get_best_device_cpu_fallback() -> None:
    with patch.dict(sys.modules, {"torch": None}):
        assert get_best_device() == "cpu"
