"""
Test Cultural Compliance API Endpoints

Tests all FastAPI endpoints for cultural compliance validation.
"""

import pytest
from fastapi.testclient import TestClient
from apps.api.main import app


class TestValidationEndpoint:
    """Test POST /api/v1/cultural-compliance/validate endpoint."""

    @pytest.fixture
    def client(self):
        """Create test client."""
        return TestClient(app)

    def test_validate_valid_content(self, client):
        """Test validation of appropriate content."""
        response = client.post(
            "/api/v1/cultural-compliance/validate",
            json={
                "content": "مرحبا بكم في النظام العراقي",
                "context": "general",
                "cultural_mode": "strict",
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert data["validation_passed"] is True
        assert data["cultural_appropriateness_score"] >= 0.95
        assert data["islamic_compliance"] is True

    def test_validate_islamic_violation(self, client):
        """Test detection of Islamic violations."""
        response = client.post(
            "/api/v1/cultural-compliance/validate",
            json={
                "content": "دعونا نناقش شرب الكحول والخمر",
                "context": "general",
                "cultural_mode": "strict",
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert data["validation_passed"] is False
        assert data["islamic_compliance"] is False

    def test_validate_missing_required_field(self, client):
        """Test validation with missing required field."""
        response = client.post(
            "/api/v1/cultural-compliance/validate",
            json={"context": "general"},  # Missing content
        )

        assert response.status_code == 422  # Validation error

    def test_validate_empty_content(self, client):
        """Test validation of empty content."""
        response = client.post(
            "/api/v1/cultural-compliance/validate",
            json={
                "content": "",
                "context": "general",
                "cultural_mode": "strict",
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert data["validation_passed"] is True

    def test_validate_mixed_language(self, client):
        """Test validation of mixed language content."""
        response = client.post(
            "/api/v1/cultural-compliance/validate",
            json={
                "content": "Hello مرحبا بكم في our system",
                "context": "general",
                "cultural_mode": "strict",
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert data["cultural_appropriateness_score"] > 0.80
        assert data["islamic_compliance"] is True

    def test_validate_response_structure(self, client):
        """Test validation response has correct structure."""
        response = client.post(
            "/api/v1/cultural-compliance/validate",
            json={
                "content": "مرحبا بكم",
                "context": "general",
                "cultural_mode": "strict",
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert "validation_passed" in data
        assert "cultural_appropriateness_score" in data
        assert "islamic_compliance" in data
        assert "political_sensitivity_detected" in data
        assert "improvement_suggestions" in data
        assert "timestamp" in data


class TestRulesEndpoint:
    """Test GET /api/v1/cultural-compliance/rules endpoint."""

    @pytest.fixture
    def client(self):
        """Create test client."""
        return TestClient(app)

    def test_get_compliance_rules(self, client):
        """Test getting compliance rules."""
        response = client.get("/api/v1/cultural-compliance/rules")

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0

    def test_rules_have_required_fields(self, client):
        """Test rules have required fields."""
        response = client.get("/api/v1/cultural-compliance/rules")

        data = response.json()
        for rule in data:
            assert "rule_id" in rule
            assert "category" in rule
            assert "description" in rule
            assert "severity" in rule
            assert "examples" in rule

    def test_rules_categories(self, client):
        """Test rules cover expected categories."""
        response = client.get("/api/v1/cultural-compliance/rules")

        data = response.json()
        categories = {rule["category"] for rule in data}

        # Should have Islamic, cultural, political, professional
        assert "islamic" in categories
        assert "cultural" in categories
        assert "political" in categories
        assert "professional" in categories


class TestPreferencesEndpoint:
    """Test user preferences endpoints."""

    @pytest.fixture
    def client(self):
        """Create test client."""
        return TestClient(app)

    def test_get_default_preferences(self, client):
        """Test getting default preferences for new user."""
        response = client.get("/api/v1/cultural-compliance/preferences/user123")

        assert response.status_code == 200
        data = response.json()
        assert data["user_id"] == "user123"
        assert data["cultural_mode"] == "strict"
        assert data["islamic_compliance_required"] is True

    def test_update_user_preferences(self, client):
        """Test updating user preferences."""
        preferences = {
            "user_id": "user456",
            "cultural_mode": "moderate",
            "validate_political_neutrality": False,
            "check_family_values": True,
            "check_professional_respect": True,
            "language_preference": "arabic",
            "arabic_dialect": "iraqi",
            "professional_domain": "legal",
        }

        response = client.put(
            "/api/v1/cultural-compliance/preferences/user456",
            json=preferences,
        )

        assert response.status_code == 200
        data = response.json()
        assert data["user_id"] == "user456"
        assert data["cultural_mode"] == "moderate"

    def test_get_updated_preferences(self, client):
        """Test getting previously updated preferences."""
        # First update
        preferences = {
            "user_id": "user789",
            "cultural_mode": "flexible",
            "validate_political_neutrality": False,
            "check_family_values": True,
            "check_professional_respect": False,
            "language_preference": "english",
            "arabic_dialect": "msa",
        }

        client.put(
            "/api/v1/cultural-compliance/preferences/user789",
            json=preferences,
        )

        # Then get
        response = client.get("/api/v1/cultural-compliance/preferences/user789")
        assert response.status_code == 200
        data = response.json()
        assert data["cultural_mode"] == "flexible"
        assert data["language_preference"] == "english"


class TestHistoryEndpoint:
    """Test validation history endpoint."""

    @pytest.fixture
    def client(self):
        """Create test client."""
        return TestClient(app)

    def test_get_empty_history(self, client):
        """Test getting history for user with no validations."""
        response = client.get("/api/v1/cultural-compliance/history/newuser")

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 0

    def test_history_pagination(self, client):
        """Test history pagination parameters."""
        response = client.get(
            "/api/v1/cultural-compliance/history/user999?limit=10&offset=0"
        )

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)

    def test_invalid_user_id_format(self, client):
        """Test with various user ID formats."""
        # Test with special characters
        response = client.get("/api/v1/cultural-compliance/history/user@example.com")
        assert response.status_code == 200

        # Test with numeric ID
        response = client.get("/api/v1/cultural-compliance/history/123456")
        assert response.status_code == 200


class TestHealthCheckEndpoint:
    """Test health check endpoint."""

    @pytest.fixture
    def client(self):
        """Create test client."""
        return TestClient(app)

    def test_health_check(self, client):
        """Test health check endpoint."""
        response = client.get("/api/v1/cultural-compliance/health")

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["service"] == "cultural-compliance"
        assert "version" in data
        assert "features" in data
        assert isinstance(data["features"], list)

    def test_health_check_features(self, client):
        """Test health check includes expected features."""
        response = client.get("/api/v1/cultural-compliance/health")

        data = response.json()
        expected_features = [
            "content validation",
            "arabic processing",
            "compliance rules",
            "user preferences",
            "validation history",
            "websocket validation",
            "rate limiting",
        ]

        for feature in expected_features:
            assert feature in data["features"]


class TestErrorHandling:
    """Test error handling in API endpoints."""

    @pytest.fixture
    def client(self):
        """Create test client."""
        return TestClient(app)

    def test_invalid_json(self, client):
        """Test handling of invalid JSON."""
        response = client.post(
            "/api/v1/cultural-compliance/validate",
            data="invalid json",
            headers={"content-type": "application/json"},
        )

        assert response.status_code != 200

    def test_missing_endpoint(self, client):
        """Test 404 for missing endpoint."""
        response = client.get("/api/v1/cultural-compliance/nonexistent")

        assert response.status_code == 404

    def test_method_not_allowed(self, client):
        """Test 405 for incorrect HTTP method."""
        response = client.get("/api/v1/cultural-compliance/validate")

        # GET not allowed on POST endpoint
        assert response.status_code in [404, 405]


class TestRateLimiting:
    """Test rate limiting functionality."""

    @pytest.fixture
    def client(self):
        """Create test client."""
        return TestClient(app)

    def test_rate_limit_header(self, client):
        """Test rate limiting is in place."""
        # Note: Rate limiting is per client IP, test client may have special handling
        response = client.post(
            "/api/v1/cultural-compliance/validate",
            json={
                "content": "مرحبا",
                "context": "general",
                "cultural_mode": "strict",
            },
        )

        assert response.status_code == 200
        # Should not hit rate limit with single request


class TestContentTypes:
    """Test handling of different content types."""

    @pytest.fixture
    def client(self):
        """Create test client."""
        return TestClient(app)

    def test_large_content(self, client):
        """Test handling of large content."""
        large_content = "مرحبا بكم " * 1000

        response = client.post(
            "/api/v1/cultural-compliance/validate",
            json={
                "content": large_content,
                "context": "general",
                "cultural_mode": "strict",
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert "cultural_appropriateness_score" in data

    def test_special_characters(self, client):
        """Test handling of special characters."""
        content = "مرحبا 🎉 Hello! مرحبا @2024 #test"

        response = client.post(
            "/api/v1/cultural-compliance/validate",
            json={
                "content": content,
                "context": "general",
                "cultural_mode": "strict",
            },
        )

        assert response.status_code == 200

    def test_whitespace_handling(self, client):
        """Test handling of whitespace."""
        content = "   مرحبا   بكم   في   النظام   "

        response = client.post(
            "/api/v1/cultural-compliance/validate",
            json={
                "content": content,
                "context": "general",
                "cultural_mode": "strict",
            },
        )

        assert response.status_code == 200
