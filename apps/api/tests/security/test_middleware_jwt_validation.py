"""
Security tests for middleware JWT validation

Tests that middleware functions use proper JWT validation
instead of direct jwt.decode() calls.

SECURITY REQUIREMENT: All middleware must use SessionManager.validate_access_token()
for consistent token validation and proper error handling.
"""

import pytest
from datetime import datetime, timedelta
from fastapi import Request
from unittest.mock import Mock, AsyncMock
import jwt

from apps.api.middleware.auth_middleware import extract_cultural_context
from apps.api.middleware.csrf_middleware import CSRFMiddleware
from apps.api.services.session_manager import SessionManager


@pytest.fixture
def mock_request():
    """Create a mock FastAPI request"""
    request = Mock(spec=Request)
    request.headers = {}
    return request


@pytest.fixture
def valid_token():
    """Create a valid JWT token with cultural context"""
    payload = {
        "sub": "test-user-123",
        "session_id": "test-session-456",
        "cultural_context": {
            "region": "baghdad",
            "language_preference": "ar-IQ",
            "islamic_compliance": "strict",
        },
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(hours=1),
    }
    return SessionManager.create_access_token(
        "test-user-123", cultural_context=payload["cultural_context"]
    )


@pytest.fixture
def expired_token():
    """Create an expired JWT token"""
    payload = {
        "sub": "test-user-123",
        "session_id": "test-session-456",
        "cultural_context": {"region": "baghdad"},
        "iat": datetime.utcnow() - timedelta(hours=2),
        "exp": datetime.utcnow() - timedelta(hours=1),  # Expired 1 hour ago
    }
    return jwt.encode(
        payload, SessionManager.JWT_SECRET_KEY, algorithm=SessionManager.JWT_ALGORITHM
    )


@pytest.fixture
def tampered_token(valid_token):
    """Create a tampered JWT token (modified after signing)"""
    # Split token and modify payload
    parts = valid_token.split(".")
    if len(parts) == 3:
        # Tamper with the payload (just add a character)
        parts[1] = parts[1] + "X"
        return ".".join(parts)
    return valid_token


class TestExtractCulturalContext:
    """Test extract_cultural_context uses proper JWT validation"""

    @pytest.mark.asyncio
    async def test_valid_token_extracts_cultural_context(
        self, mock_request, valid_token
    ):
        """Test that valid tokens properly extract cultural context"""
        mock_request.headers = {"Authorization": f"Bearer {valid_token}"}

        result = await extract_cultural_context(mock_request)

        assert isinstance(result, dict)
        assert "region" in result
        assert result["region"] == "baghdad"

    @pytest.mark.asyncio
    async def test_expired_token_returns_empty_context(
        self, mock_request, expired_token
    ):
        """Test that expired tokens are rejected (SECURITY REQUIREMENT)"""
        mock_request.headers = {"Authorization": f"Bearer {expired_token}"}

        result = await extract_cultural_context(mock_request)

        # Should return empty dict for expired token (validation failed)
        assert result == {}

    @pytest.mark.asyncio
    async def test_tampered_token_returns_empty_context(
        self, mock_request, tampered_token
    ):
        """Test that tampered tokens are rejected (SECURITY REQUIREMENT)"""
        mock_request.headers = {"Authorization": f"Bearer {tampered_token}"}

        result = await extract_cultural_context(mock_request)

        # Should return empty dict for tampered token (validation failed)
        assert result == {}

    @pytest.mark.asyncio
    async def test_no_authorization_header_returns_empty_context(self, mock_request):
        """Test that missing auth header returns empty context"""
        result = await extract_cultural_context(mock_request)

        assert result == {}

    @pytest.mark.asyncio
    async def test_invalid_authorization_format_returns_empty_context(
        self, mock_request
    ):
        """Test that malformed auth header returns empty context"""
        mock_request.headers = {"Authorization": "InvalidFormat token123"}

        result = await extract_cultural_context(mock_request)

        assert result == {}

    @pytest.mark.asyncio
    async def test_token_without_cultural_context_returns_empty_dict(
        self, mock_request
    ):
        """Test token without cultural_context claim returns empty dict"""
        # Create token without cultural_context
        payload = {
            "sub": "test-user-123",
            "session_id": "test-session-456",
            "iat": datetime.utcnow(),
            "exp": datetime.utcnow() + timedelta(hours=1),
        }
        token = jwt.encode(
            payload,
            SessionManager.JWT_SECRET_KEY,
            algorithm=SessionManager.JWT_ALGORITHM,
        )
        mock_request.headers = {"Authorization": f"Bearer {token}"}

        result = await extract_cultural_context(mock_request)

        assert result == {}


class TestCSRFMiddlewareExtractSessionId:
    """Test CSRFMiddleware._extract_session_id uses proper JWT validation"""

    @pytest.fixture
    def csrf_middleware(self):
        """Create CSRF middleware instance"""
        mock_app = AsyncMock()
        return CSRFMiddleware(mock_app)

    @pytest.mark.asyncio
    async def test_valid_token_extracts_session_id(
        self, csrf_middleware, mock_request, valid_token
    ):
        """Test that valid tokens properly extract session ID"""
        mock_request.headers = {"Authorization": f"Bearer {valid_token}"}

        result = await csrf_middleware._extract_session_id(mock_request)

        assert result is not None
        assert isinstance(result, str)

    @pytest.mark.asyncio
    async def test_expired_token_returns_none(
        self, csrf_middleware, mock_request, expired_token
    ):
        """Test that expired tokens are rejected (SECURITY REQUIREMENT)"""
        mock_request.headers = {"Authorization": f"Bearer {expired_token}"}

        result = await csrf_middleware._extract_session_id(mock_request)

        # Should return None for expired token (validation failed)
        assert result is None

    @pytest.mark.asyncio
    async def test_tampered_token_returns_none(
        self, csrf_middleware, mock_request, tampered_token
    ):
        """Test that tampered tokens are rejected (SECURITY REQUIREMENT)"""
        mock_request.headers = {"Authorization": f"Bearer {tampered_token}"}

        result = await csrf_middleware._extract_session_id(mock_request)

        # Should return None for tampered token (validation failed)
        assert result is None

    @pytest.mark.asyncio
    async def test_no_authorization_header_returns_none(
        self, csrf_middleware, mock_request
    ):
        """Test that missing auth header returns None"""
        result = await csrf_middleware._extract_session_id(mock_request)

        assert result is None

    @pytest.mark.asyncio
    async def test_invalid_authorization_format_returns_none(
        self, csrf_middleware, mock_request
    ):
        """Test that malformed auth header returns None"""
        mock_request.headers = {"Authorization": "InvalidFormat token123"}

        result = await csrf_middleware._extract_session_id(mock_request)

        assert result is None

    @pytest.mark.asyncio
    async def test_token_without_session_id_returns_none(
        self, csrf_middleware, mock_request
    ):
        """Test token without session_id claim returns None"""
        # Create token without session_id
        payload = {
            "sub": "test-user-123",
            "cultural_context": {"region": "baghdad"},
            "iat": datetime.utcnow(),
            "exp": datetime.utcnow() + timedelta(hours=1),
        }
        token = jwt.encode(
            payload,
            SessionManager.JWT_SECRET_KEY,
            algorithm=SessionManager.JWT_ALGORITHM,
        )
        mock_request.headers = {"Authorization": f"Bearer {token}"}

        result = await csrf_middleware._extract_session_id(mock_request)

        assert result is None


class TestSecurityRequirementCompliance:
    """Verify middleware functions use SessionManager.validate_access_token()"""

    def test_extract_cultural_context_uses_session_manager(self):
        """Verify extract_cultural_context uses SessionManager validation"""
        import inspect

        source = inspect.getsource(extract_cultural_context)

        # Should use SessionManager.validate_access_token
        assert "SessionManager.validate_access_token" in source, (
            "extract_cultural_context must use SessionManager.validate_access_token() for security"
        )

        # Should NOT use direct jwt.decode
        assert "jwt.decode(" not in source, (
            "extract_cultural_context must NOT use direct jwt.decode() - security vulnerability"
        )

    def test_csrf_middleware_extract_session_id_uses_session_manager(self):
        """Verify CSRFMiddleware._extract_session_id uses SessionManager validation"""
        import inspect

        source = inspect.getsource(CSRFMiddleware._extract_session_id)

        # Should use SessionManager.validate_access_token
        assert "SessionManager.validate_access_token" in source, (
            "CSRFMiddleware._extract_session_id must use SessionManager.validate_access_token() for security"
        )

        # Should NOT use direct jwt.decode
        assert "jwt.decode(" not in source, (
            "CSRFMiddleware._extract_session_id must NOT use direct jwt.decode() - security vulnerability"
        )
