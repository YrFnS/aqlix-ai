"""Integration tests for health endpoints."""

import pytest


@pytest.mark.integration
@pytest.mark.api
@pytest.mark.asyncio
async def test_health_endpoint(client):
    """Test health check endpoint."""
    response = await client.get("/health")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "services" in data
    assert "features" in data


@pytest.mark.integration
@pytest.mark.asyncio
async def test_root_endpoint(client):
    """Test root endpoint."""
    response = await client.get("/")

    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert data["message"] == "Iraqi AI Chat System API"
