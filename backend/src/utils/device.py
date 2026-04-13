"""GPU / device detection utilities."""

import platform
from typing import Any

import structlog

logger = structlog.get_logger()


def get_device_info() -> dict[str, Any]:
    """Return a dict describing the available compute device."""
    info: dict[str, Any] = {
        "platform": platform.system(),
        "architecture": platform.machine(),
        "backend": "cpu",
        "devices": [],
    }

    # NVIDIA CUDA
    try:
        import torch  # type: ignore[import]

        if torch.cuda.is_available():
            info["backend"] = "cuda"
            info["cuda_version"] = torch.version.cuda
            info["devices"] = [
                {
                    "index": i,
                    "name": torch.cuda.get_device_name(i),
                    "memory_gb": round(
                        torch.cuda.get_device_properties(i).total_memory / 1e9, 2
                    ),
                }
                for i in range(torch.cuda.device_count())
            ]
            return info

        # AMD ROCm (also exposed via torch.cuda on ROCm builds)
        if hasattr(torch.version, "hip") and torch.version.hip:
            info["backend"] = "rocm"
            info["rocm_version"] = torch.version.hip
            return info

    except ImportError:
        logger.debug("pytorch not installed, skipping gpu detection")

    return info


def get_best_device() -> str:
    """Return the best available torch device string ('cuda', 'cpu', etc.)."""
    try:
        import torch  # type: ignore[import]

        if torch.cuda.is_available():
            return "cuda"
    except ImportError:
        pass
    return "cpu"
