# =============================================================================
# Developer shortcuts — run with `make <target>`
# =============================================================================
.DEFAULT_GOAL := help
PYTHON        := uv run python
TARGET        ?= cpu   # override: make build TARGET=cuda124

.PHONY: help install install-dev install-cuda124 install-cuda118 install-rocm \
        run dev test test-unit test-integration lint lint-fix format format-check \
        migrate migrate-create migrate-down seed clean build \
        docker-up docker-up-cuda docker-up-rocm docker-down

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
	  | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-22s\033[0m %s\n", $$1, $$2}'

# ── environment ───────────────────────────────────────────────────────────────
install: ## Install core deps (CPU), no dev tools
	uv sync --extra cpu --no-dev

install-dev: ## Install all deps including dev tools
	uv sync --extra cpu --extra dev

install-cuda124: ## Install deps with CUDA 12.4 wheels
	uv sync --extra cuda124 --extra dev

install-cuda118: ## Install deps with CUDA 11.8 wheels
	uv sync --extra cuda118 --extra dev

install-rocm: ## Install deps with ROCm wheels
	uv sync --extra rocm --extra dev

# ── run ───────────────────────────────────────────────────────────────────────
run: ## Start the API server via Granian (reads HOST/PORT/WORKERS from env)
	$(PYTHON) src/main.py

dev: ## Start with auto-reload for local development
	HOST=0.0.0.0 PORT=8080 uv run granian --reload --interface asgi src.api.app:app

# ── code quality ──────────────────────────────────────────────────────────────
lint: ## Check code style and correctness (ruff + mypy)
	uv run ruff check src tests
	uv run mypy src/

lint-fix: ## Auto-fix lint issues where possible
	uv run ruff check --fix src tests

format: ## Format code (ruff formatter — PEP 8 compliant)
	uv run ruff format src tests

format-check: ## Check formatting without applying changes (CI)
	uv run ruff format --check src tests

# ── tests ─────────────────────────────────────────────────────────────────────
test: ## Run all tests with coverage
	uv run pytest

test-unit: ## Run unit tests only
	uv run pytest tests/unit/ -v

test-integration: ## Run integration tests only
	uv run pytest tests/integration/ -v

# ── database ──────────────────────────────────────────────────────────────────
migrate: ## Apply all pending Alembic migrations
	uv run alembic upgrade head

migrate-create: ## Create a new migration (prompts for name)
	@read -p "Migration name: " name; uv run alembic revision --autogenerate -m "$$name"

migrate-down: ## Roll back one migration
	uv run alembic downgrade -1

seed: ## Load development seed data
	$(PYTHON) scripts/seed.py

# ── docker ────────────────────────────────────────────────────────────────────
build: ## Build Docker image  (TARGET=cpu|cuda124|cuda118|rocm|jetson)
	./scripts/build.sh $(TARGET)

docker-up: ## Start local stack (CPU)
	docker compose up --build

docker-up-cuda: ## Start stack with NVIDIA GPU
	docker compose -f docker-compose.yml -f docker/compose.cuda.yml up --build

docker-up-rocm: ## Start stack with AMD GPU
	docker compose -f docker-compose.yml -f docker/compose.rocm.yml up --build

docker-down: ## Stop and remove containers
	docker compose down

# ── housekeeping ──────────────────────────────────────────────────────────────
clean: ## Remove build artefacts and caches
	rm -rf .venv dist __pycache__ .mypy_cache .ruff_cache .pytest_cache htmlcov .coverage coverage.xml
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
