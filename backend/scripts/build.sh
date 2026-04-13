#!/usr/bin/env bash
# scripts/build.sh — build a Docker image for a specific GPU target
#
# Usage:
#   ./scripts/build.sh cpu
#   ./scripts/build.sh cuda124
#   ./scripts/build.sh cuda118
#   ./scripts/build.sh rocm
#   ./scripts/build.sh jetson          # cross-compiles aarch64 via buildx
#
# Optional env vars:
#   REGISTRY   — e.g. "ghcr.io/myorg/my-app"  (default: "my-app")
#   TAG        — image tag                      (default: target name)

set -euo pipefail

TARGET="${1:-cpu}"
REGISTRY="${REGISTRY:-my-app}"
TAG="${TAG:-$TARGET}"
IMAGE="${REGISTRY}:${TAG}"

echo "Building target=${TARGET}  image=${IMAGE}"

case "$TARGET" in
  cpu|cuda124|cuda118|rocm)
    docker build \
      --file "docker/Dockerfile.${TARGET}" \
      --tag  "${IMAGE}" \
      .
    ;;
  jetson)
    docker buildx build \
      --platform linux/arm64 \
      --file   docker/Dockerfile.jetson \
      --tag    "${IMAGE}" \
      --load \
      .
    ;;
  *)
    echo "Unknown target '${TARGET}'. Choose: cpu | cuda124 | cuda118 | rocm | jetson" >&2
    exit 1
    ;;
esac

echo "Done: ${IMAGE}"
