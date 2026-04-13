"""Integration tests for health check endpoints."""

from fastapi.testclient import TestClient

from src.api.app import app

client = TestClient(app)


def test_health_returns_ok() -> None:
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert "version" in body
    assert body["uptime_seconds"] >= 0


def test_health_ready_returns_ready() -> None:
    response = client.get("/api/v1/health/ready")
    assert response.status_code == 200
    assert response.json()["status"] == "ready"
