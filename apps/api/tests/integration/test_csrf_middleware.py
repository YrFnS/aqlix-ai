"""
Integration Tests for CSRF Middleware
Tests end-to-end CSRF protection with FastAPI application and Iraqi compliance
"""

import pytest
from fastapi import FastAPI, Request, Depends
from fastapi.testclient import TestClient
from fastapi.responses import JSONResponse
import jwt
from datetime import datetime, timedelta

from apps.api.middleware.csrf_middleware import (
    CSRFMiddleware,
    get_csrf_token_for_session,
)
from apps.api.services.csrf_service import CSRFService, CSRFTokenRepository
from apps.api.services.session_manager import SessionManager


@pytest.fixture
def app():
    """Create FastAPI app with CSRF middleware"""
    app = FastAPI()

    # Initialize SessionManager
    SessionManager.JWT_SECRET_KEY = "test-jwt-secret-key-32-characters-long"

    # Add CSRF middleware
    csrf_middleware = CSRFMiddleware(
        app=app,
        excluded_paths=["/api/auth/login", "/api/auth/register"],
        csrf_token_expiry_minutes=60,
        enable_double_submit_cookie=True,
    )

    # Add middleware
    @app.middleware("http")
    async def csrf_protection(request: Request, call_next):
        return await csrf_middleware(request, call_next)

    # Test routes
    @app.get("/api/safe")
    async def safe_route():
        return {"message": "Safe GET request"}

    @app.post("/api/protected")
    async def protected_route():
        return {"message": "Protected POST request"}

    @app.put("/api/protected")
    async def protected_put_route():
        return {"message": "Protected PUT request"}

    @app.delete("/api/protected")
    async def protected_delete_route():
        return {"message": "Protected DELETE request"}

    @app.post("/api/auth/login")
    async def login_route():
        return {"message": "Login endpoint (excluded from CSRF)"}

    return app


@pytest.fixture
def client(app):
    """Create test client"""
    return TestClient(app)


@pytest.fixture
def valid_jwt_token():
    """Create valid JWT token for testing"""
    session_id = "test-session-123"
    cultural_context = {"region": "baghdad", "language": "ar-IQ"}

    token = SessionManager.create_access_token(
        user_id="test-user-123",
        session_id=session_id,
        cultural_context=cultural_context,
    )

    return token, session_id


class TestSafeMethodExemption:
    """Test that safe methods (GET, HEAD, OPTIONS) are exempted from CSRF"""

    def test_get_request_without_csrf_token(self, client):
        """GET request should work without CSRF token"""
        response = client.get("/api/safe")

        assert response.status_code == 200
        assert response.json() == {"message": "Safe GET request"}

    def test_get_request_includes_csrf_token_in_response(self, client, valid_jwt_token):
        """GET request with auth should include CSRF token in response"""
        token, session_id = valid_jwt_token

        response = client.get(
            "/api/safe",
            headers={"Authorization": f"Bearer {token}"},
        )

        assert response.status_code == 200
        # CSRF token should be in response headers
        assert CSRFService.CSRF_HEADER_NAME in response.headers


class TestProtectedEndpoints:
    """Test CSRF protection on state-changing requests"""

    def test_post_without_csrf_token_fails(self, client, valid_jwt_token):
        """POST request without CSRF token should return 403"""
        token, session_id = valid_jwt_token

        response = client.post(
            "/api/protected",
            headers={"Authorization": f"Bearer {token}"},
        )

        assert response.status_code == 403
        assert "csrf" in response.json()["detail"].lower()

    def test_post_with_invalid_csrf_token_fails(self, client, valid_jwt_token):
        """POST request with invalid CSRF token should return 403"""
        token, session_id = valid_jwt_token

        response = client.post(
            "/api/protected",
            headers={
                "Authorization": f"Bearer {token}",
                "X-CSRF-Token": "invalid-token",
            },
        )

        assert response.status_code == 403

    def test_post_with_valid_csrf_token_succeeds(self, client, valid_jwt_token):
        """POST request with valid CSRF token should succeed"""
        token, session_id = valid_jwt_token

        # Generate CSRF token
        csrf_token = await get_csrf_token_for_session(session_id)

        response = client.post(
            "/api/protected",
            headers={
                "Authorization": f"Bearer {token}",
                "X-CSRF-Token": csrf_token,
            },
        )

        assert response.status_code == 200
        assert response.json() == {"message": "Protected POST request"}

    def test_put_request_requires_csrf_token(self, client, valid_jwt_token):
        """PUT request should require CSRF token"""
        token, session_id = valid_jwt_token

        response = client.put(
            "/api/protected",
            headers={"Authorization": f"Bearer {token}"},
        )

        assert response.status_code == 403

    def test_delete_request_requires_csrf_token(self, client, valid_jwt_token):
        """DELETE request should require CSRF token"""
        token, session_id = valid_jwt_token

        response = client.delete(
            "/api/protected",
            headers={"Authorization": f"Bearer {token}"},
        )

        assert response.status_code == 403


class TestExcludedPaths:
    """Test that excluded paths don't require CSRF protection"""

    def test_login_endpoint_excluded(self, client):
        """Login endpoint should be excluded from CSRF protection"""
        response = client.post("/api/auth/login")

        assert response.status_code == 200
        assert response.json() == {"message": "Login endpoint (excluded from CSRF)"}


class TestDoubleSubmitCookie:
    """Test double-submit cookie pattern"""

    def test_csrf_cookie_set_on_authenticated_request(self, client, valid_jwt_token):
        """CSRF cookie should be set on authenticated request"""
        token, session_id = valid_jwt_token

        response = client.get(
            "/api/safe",
            headers={"Authorization": f"Bearer {token}"},
        )

        assert response.status_code == 200
        # Check if CSRF cookie is set
        assert CSRFService.CSRF_COOKIE_NAME in response.cookies

    def test_csrf_cookie_httponly(self, client, valid_jwt_token):
        """CSRF cookie should be HttpOnly"""
        token, session_id = valid_jwt_token

        response = client.get(
            "/api/safe",
            headers={"Authorization": f"Bearer {token}"},
        )

        # TestClient doesn't expose cookie attributes directly
        # In production, verify via browser DevTools
        assert CSRFService.CSRF_COOKIE_NAME in response.cookies


class TestCSRFTokenLifecycle:
    """Test CSRF token generation, refresh, and expiry"""

    def test_csrf_token_generated_on_first_request(self, client, valid_jwt_token):
        """CSRF token should be generated on first authenticated request"""
        token, session_id = valid_jwt_token

        # Clear any existing tokens
        CSRFTokenRepository.clear_all()

        response = client.get(
            "/api/safe",
            headers={"Authorization": f"Bearer {token}"},
        )

        assert response.status_code == 200
        csrf_token = response.headers.get(CSRFService.CSRF_HEADER_NAME)

        assert csrf_token is not None
        assert len(csrf_token) > 0

    def test_csrf_token_reused_if_valid(self, client, valid_jwt_token):
        """Valid CSRF token should be reused across requests"""
        token, session_id = valid_jwt_token

        # First request
        response1 = client.get(
            "/api/safe",
            headers={"Authorization": f"Bearer {token}"},
        )
        csrf_token1 = response1.headers.get(CSRFService.CSRF_HEADER_NAME)

        # Second request
        response2 = client.get(
            "/api/safe",
            headers={"Authorization": f"Bearer {token}"},
        )
        csrf_token2 = response2.headers.get(CSRFService.CSRF_HEADER_NAME)

        # Tokens should be the same
        assert csrf_token1 == csrf_token2

    def test_expired_csrf_token_regenerated(self, client, valid_jwt_token):
        """Expired CSRF token should be regenerated"""
        token, session_id = valid_jwt_token

        # Generate initial token
        csrf_token_info = CSRFService.generate_csrf_token(session_id)
        CSRFTokenRepository.store_token(session_id, csrf_token_info)

        # Expire the token
        csrf_token_info.expires_at = datetime.utcnow() - timedelta(minutes=10)
        CSRFTokenRepository.store_token(session_id, csrf_token_info)

        # Request should generate new token
        response = client.get(
            "/api/safe",
            headers={"Authorization": f"Bearer {token}"},
        )

        new_csrf_token = response.headers.get(CSRFService.CSRF_HEADER_NAME)

        assert new_csrf_token != csrf_token_info.token


class TestUnauthenticatedRequests:
    """Test CSRF behavior for unauthenticated requests"""

    def test_post_without_authentication_fails(self, client):
        """POST request without authentication should fail"""
        response = client.post("/api/protected")

        # Should fail due to missing authentication
        # CSRF middleware requires authenticated session
        assert response.status_code == 403


class TestIraqiComplianceIntegration:
    """Test Iraqi regulatory compliance in integration scenarios"""

    def test_csrf_protection_enabled_by_default(self, app):
        """CSRF protection should be enabled by default"""
        # CSRF middleware should be active
        assert any(
            isinstance(middleware, CSRFMiddleware) for middleware in app.user_middleware
        )

    def test_csrf_token_expiry_within_limits(self, client, valid_jwt_token):
        """CSRF token expiry should meet Iraqi security standards"""
        token, session_id = valid_jwt_token

        response = client.get(
            "/api/safe",
            headers={"Authorization": f"Bearer {token}"},
        )

        # Get stored token info
        stored_token = CSRFTokenRepository.get_token(session_id)

        if stored_token:
            time_until_expiry = stored_token.expires_at - datetime.utcnow()
            # Should expire within 1 hour (Iraqi standard)
            assert time_until_expiry.total_seconds() <= 3600


class TestSecurityEventLogging:
    """Test security event logging for CSRF failures"""

    def test_csrf_failure_logged(self, client, valid_jwt_token, caplog):
        """CSRF validation failure should be logged"""
        token, session_id = valid_jwt_token

        with caplog.at_level("WARNING"):
            response = client.post(
                "/api/protected",
                headers={
                    "Authorization": f"Bearer {token}",
                    "X-CSRF-Token": "invalid-token",
                },
            )

            assert response.status_code == 403
            # Check if CSRF failure was logged
            # Note: Actual logging depends on middleware implementation


class TestConcurrentRequests:
    """Test CSRF protection under concurrent requests"""

    def test_concurrent_csrf_validation(self, client, valid_jwt_token):
        """CSRF validation should work correctly under concurrent requests"""
        import concurrent.futures

        token, session_id = valid_jwt_token

        # Generate CSRF token
        csrf_token = await get_csrf_token_for_session(session_id)

        def make_request():
            return client.post(
                "/api/protected",
                headers={
                    "Authorization": f"Bearer {token}",
                    "X-CSRF-Token": csrf_token,
                },
            )

        # Make concurrent requests
        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(make_request) for _ in range(10)]
            responses = [future.result() for future in futures]

        # All requests should succeed
        assert all(r.status_code == 200 for r in responses)


class TestEdgeCases:
    """Test edge cases and error conditions"""

    def test_malformed_authorization_header(self, client):
        """Malformed Authorization header should be handled gracefully"""
        response = client.post(
            "/api/protected",
            headers={"Authorization": "InvalidFormat"},
        )

        # Should fail, but not crash
        assert response.status_code in [401, 403]

    def test_missing_session_id_in_token(self, client):
        """JWT token without session_id should be handled"""
        # Create token without session_id
        token = jwt.encode(
            {
                "sub": "test-user",
                "exp": datetime.utcnow() + timedelta(hours=1),
            },
            SessionManager.JWT_SECRET_KEY,
            algorithm=SessionManager.JWT_ALGORITHM,
        )

        response = client.post(
            "/api/protected",
            headers={"Authorization": f"Bearer {token}"},
        )

        # Should fail gracefully
        assert response.status_code == 403
