"""
Unit Tests for CSRF Protection Service
Tests CSRF token generation, validation, double-submit cookie pattern, and Iraqi compliance
"""

import pytest
from datetime import datetime, timedelta
from apps.api.services.csrf_service import (
    CSRFService,
    CSRFTokenRepository,
    CSRFTokenStatus,
    CSRFTokenInfo,
    CSRFValidationResult,
)


class TestCSRFTokenGeneration:
    """Test CSRF token generation"""

    def setup_method(self):
        """Setup for each test"""
        CSRFService.initialize(
            secret_key="test-csrf-secret-key-32-characters-long",
            token_expiry_minutes=60,
        )
        CSRFTokenRepository.clear_all()

    def test_initialize_csrf_service(self):
        """Initialize CSRF service with valid secret key"""
        CSRFService.initialize(
            secret_key="valid-secret-key-at-least-32-chars",
            token_expiry_minutes=60,
        )

        assert CSRFService.CSRF_SECRET_KEY is not None
        assert CSRFService.CSRF_TOKEN_EXPIRY_MINUTES == 60

    def test_initialize_with_short_secret_key_fails(self):
        """Initialize with short secret key should fail"""
        with pytest.raises(ValueError, match="at least 32 characters"):
            CSRFService.initialize(secret_key="short-key", token_expiry_minutes=60)

    def test_generate_csrf_token(self):
        """Generate CSRF token for session"""
        session_id = "session-123"

        token_info = CSRFService.generate_csrf_token(session_id)

        assert token_info.token is not None
        assert len(token_info.token) > 0
        assert token_info.token_hash is not None
        assert token_info.session_id == session_id
        assert token_info.is_active is True

    def test_generate_token_creates_unique_tokens(self):
        """Generate multiple tokens should create unique tokens"""
        session_id = "session-123"

        token1 = CSRFService.generate_csrf_token(session_id)
        token2 = CSRFService.generate_csrf_token(session_id)

        assert token1.token != token2.token
        assert token1.token_hash != token2.token_hash

    def test_generate_token_sets_expiry(self):
        """Generate token should set correct expiry"""
        session_id = "session-123"

        token_info = CSRFService.generate_csrf_token(session_id)

        # Check expiry is approximately 60 minutes from now
        expected_expiry = datetime.utcnow() + timedelta(
            minutes=CSRFService.CSRF_TOKEN_EXPIRY_MINUTES
        )
        time_diff = abs((token_info.expires_at - expected_expiry).total_seconds())

        assert time_diff < 5  # Within 5 seconds tolerance

    def test_generate_token_without_initialization_fails(self):
        """Generate token without initialization should fail"""
        CSRFService.CSRF_SECRET_KEY = None

        with pytest.raises(RuntimeError, match="not initialized"):
            CSRFService.generate_csrf_token("session-123")


class TestCSRFTokenValidation:
    """Test CSRF token validation"""

    def setup_method(self):
        """Setup for each test"""
        CSRFService.initialize(
            secret_key="test-csrf-secret-key-32-characters-long",
            token_expiry_minutes=60,
        )
        CSRFTokenRepository.clear_all()

    def test_validate_valid_token(self):
        """Validate a valid CSRF token"""
        session_id = "session-123"
        token_info = CSRFService.generate_csrf_token(session_id)

        result = CSRFService.validate_csrf_token(
            token=token_info.token,
            session_id=session_id,
            stored_token_info=token_info,
        )

        assert result.is_valid is True
        assert result.status == CSRFTokenStatus.VALID
        assert result.error_message is None
        assert result.requires_regeneration is False

    def test_validate_missing_token(self):
        """Validate missing CSRF token"""
        session_id = "session-123"
        token_info = CSRFService.generate_csrf_token(session_id)

        result = CSRFService.validate_csrf_token(
            token=None,
            session_id=session_id,
            stored_token_info=token_info,
        )

        assert result.is_valid is False
        assert result.status == CSRFTokenStatus.MISSING
        assert "required" in result.error_message.lower()
        assert result.requires_regeneration is True

    def test_validate_token_mismatch(self):
        """Validate token that doesn't match stored token"""
        session_id = "session-123"
        token_info = CSRFService.generate_csrf_token(session_id)

        result = CSRFService.validate_csrf_token(
            token="wrong-token-value",
            session_id=session_id,
            stored_token_info=token_info,
        )

        assert result.is_valid is False
        assert result.status == CSRFTokenStatus.MISMATCH
        assert "does not match" in result.error_message.lower()
        assert result.requires_regeneration is False

    def test_validate_expired_token(self):
        """Validate expired CSRF token"""
        session_id = "session-123"
        token_info = CSRFService.generate_csrf_token(session_id)

        # Manually set expiry to past
        token_info.expires_at = datetime.utcnow() - timedelta(minutes=10)

        result = CSRFService.validate_csrf_token(
            token=token_info.token,
            session_id=session_id,
            stored_token_info=token_info,
        )

        assert result.is_valid is False
        assert result.status == CSRFTokenStatus.EXPIRED
        assert "expired" in result.error_message.lower()
        assert result.requires_regeneration is True

    def test_validate_inactive_token(self):
        """Validate inactive/revoked CSRF token"""
        session_id = "session-123"
        token_info = CSRFService.generate_csrf_token(session_id)

        # Manually set token as inactive
        token_info.is_active = False

        result = CSRFService.validate_csrf_token(
            token=token_info.token,
            session_id=session_id,
            stored_token_info=token_info,
        )

        assert result.is_valid is False
        assert result.status == CSRFTokenStatus.INVALID
        assert "revoked" in result.error_message.lower()
        assert result.requires_regeneration is True

    def test_validate_no_stored_token(self):
        """Validate when no stored token exists"""
        session_id = "session-123"

        result = CSRFService.validate_csrf_token(
            token="some-token",
            session_id=session_id,
            stored_token_info=None,
        )

        assert result.is_valid is False
        assert result.status == CSRFTokenStatus.INVALID
        assert "no csrf token found" in result.error_message.lower()
        assert result.requires_regeneration is True

    def test_validate_token_integrity_check(self):
        """Validate token integrity via HMAC"""
        session_id = "session-123"
        token_info = CSRFService.generate_csrf_token(session_id)

        # Tamper with token hash
        token_info.token_hash = "tampered-hash-value"

        result = CSRFService.validate_csrf_token(
            token=token_info.token,
            session_id=session_id,
            stored_token_info=token_info,
        )

        assert result.is_valid is False
        assert result.status == CSRFTokenStatus.INVALID
        assert "integrity check failed" in result.error_message.lower()


class TestSafeMethodExemption:
    """Test safe HTTP method exemption"""

    def test_safe_methods_exempted(self):
        """GET, HEAD, OPTIONS should be exempted"""
        assert CSRFService.is_safe_method("GET") is True
        assert CSRFService.is_safe_method("HEAD") is True
        assert CSRFService.is_safe_method("OPTIONS") is True

    def test_unsafe_methods_not_exempted(self):
        """POST, PUT, DELETE, PATCH should require CSRF"""
        assert CSRFService.is_safe_method("POST") is False
        assert CSRFService.is_safe_method("PUT") is False
        assert CSRFService.is_safe_method("DELETE") is False
        assert CSRFService.is_safe_method("PATCH") is False

    def test_safe_method_case_insensitive(self):
        """Safe method check should be case insensitive"""
        assert CSRFService.is_safe_method("get") is True
        assert CSRFService.is_safe_method("Get") is True
        assert CSRFService.is_safe_method("GET") is True


class TestCSRFTokenExtraction:
    """Test CSRF token extraction from requests"""

    def setup_method(self):
        """Setup for each test"""
        CSRFService.initialize(
            secret_key="test-csrf-secret-key-32-characters-long",
            token_expiry_minutes=60,
        )

    def test_extract_token_from_header(self):
        """Extract CSRF token from X-CSRF-Token header"""
        headers = {"X-CSRF-Token": "test-token-value"}

        token = CSRFService.extract_csrf_token_from_request(headers)

        assert token == "test-token-value"

    def test_extract_token_from_lowercase_header(self):
        """Extract CSRF token from lowercase header"""
        headers = {"x-csrf-token": "test-token-value"}

        token = CSRFService.extract_csrf_token_from_request(headers)

        assert token == "test-token-value"

    def test_extract_token_from_form_data(self):
        """Extract CSRF token from form data"""
        headers = {}
        form_data = {"csrf_token": "test-token-from-form"}

        token = CSRFService.extract_csrf_token_from_request(headers, form_data)

        assert token == "test-token-from-form"

    def test_extract_token_header_priority_over_form(self):
        """Header token should take priority over form token"""
        headers = {"X-CSRF-Token": "header-token"}
        form_data = {"csrf_token": "form-token"}

        token = CSRFService.extract_csrf_token_from_request(headers, form_data)

        assert token == "header-token"

    def test_extract_token_missing(self):
        """Extract token when not present should return None"""
        headers = {}
        form_data = {}

        token = CSRFService.extract_csrf_token_from_request(headers, form_data)

        assert token is None


class TestDoubleSubmitCookie:
    """Test double-submit cookie pattern"""

    def setup_method(self):
        """Setup for each test"""
        CSRFService.initialize(
            secret_key="test-csrf-secret-key-32-characters-long",
            token_expiry_minutes=60,
        )

    def test_create_double_submit_cookie(self):
        """Create double-submit cookie value"""
        token = "test-token-value"

        cookie_value = CSRFService.create_double_submit_cookie_value(token)

        assert cookie_value is not None
        assert len(cookie_value) > 0
        assert cookie_value != token  # Should be hash, not token itself

    def test_verify_double_submit_cookie_valid(self):
        """Verify valid double-submit cookie"""
        token = "test-token-value"
        cookie_value = CSRFService.create_double_submit_cookie_value(token)

        is_valid = CSRFService.verify_double_submit_cookie(token, cookie_value)

        assert is_valid is True

    def test_verify_double_submit_cookie_invalid(self):
        """Verify invalid double-submit cookie"""
        token = "test-token-value"
        wrong_cookie = "wrong-cookie-value"

        is_valid = CSRFService.verify_double_submit_cookie(token, wrong_cookie)

        assert is_valid is False

    def test_cookie_value_deterministic(self):
        """Same token should produce same cookie value"""
        token = "test-token-value"

        cookie1 = CSRFService.create_double_submit_cookie_value(token)
        cookie2 = CSRFService.create_double_submit_cookie_value(token)

        assert cookie1 == cookie2


class TestCSRFTokenRepository:
    """Test CSRF token repository (storage)"""

    def setup_method(self):
        """Setup for each test"""
        CSRFService.initialize(
            secret_key="test-csrf-secret-key-32-characters-long",
            token_expiry_minutes=60,
        )
        CSRFTokenRepository.clear_all()

    def test_store_and_retrieve_token(self):
        """Store and retrieve CSRF token"""
        session_id = "session-123"
        token_info = CSRFService.generate_csrf_token(session_id)

        CSRFTokenRepository.store_token(session_id, token_info)
        retrieved = CSRFTokenRepository.get_token(session_id)

        assert retrieved is not None
        assert retrieved.token == token_info.token
        assert retrieved.session_id == session_id

    def test_get_nonexistent_token(self):
        """Get token that doesn't exist"""
        retrieved = CSRFTokenRepository.get_token("nonexistent-session")

        assert retrieved is None

    def test_delete_token(self):
        """Delete CSRF token"""
        session_id = "session-123"
        token_info = CSRFService.generate_csrf_token(session_id)

        CSRFTokenRepository.store_token(session_id, token_info)
        deleted = CSRFTokenRepository.delete_token(session_id)

        assert deleted is True
        assert CSRFTokenRepository.get_token(session_id) is None

    def test_delete_nonexistent_token(self):
        """Delete nonexistent token should return False"""
        deleted = CSRFTokenRepository.delete_token("nonexistent-session")

        assert deleted is False

    def test_cleanup_expired_tokens(self):
        """Cleanup expired CSRF tokens"""
        # Create expired token
        session1 = "session-1"
        token1 = CSRFService.generate_csrf_token(session1)
        token1.expires_at = datetime.utcnow() - timedelta(minutes=10)
        CSRFTokenRepository.store_token(session1, token1)

        # Create valid token
        session2 = "session-2"
        token2 = CSRFService.generate_csrf_token(session2)
        CSRFTokenRepository.store_token(session2, token2)

        # Cleanup
        cleaned_count = CSRFTokenRepository.cleanup_expired_tokens()

        assert cleaned_count == 1
        assert CSRFTokenRepository.get_token(session1) is None
        assert CSRFTokenRepository.get_token(session2) is not None


class TestCSRFMetaTags:
    """Test CSRF meta tag generation for HTML templates"""

    def test_generate_meta_tags(self):
        """Generate CSRF meta tags"""
        csrf_token = "test-token-value"

        meta_tags = CSRFService.generate_csrf_meta_tags(csrf_token)

        assert "csrf-token" in meta_tags
        assert meta_tags["csrf-token"] == csrf_token
        assert "csrf-header" in meta_tags
        assert meta_tags["csrf-header"] == CSRFService.CSRF_HEADER_NAME


class TestShouldCheckCSRF:
    """Test logic for determining if CSRF check should be performed"""

    def test_safe_methods_skip_check(self):
        """Safe methods should skip CSRF check"""
        assert CSRFService.should_check_csrf("GET", "/api/data", []) is False
        assert CSRFService.should_check_csrf("HEAD", "/api/data", []) is False
        assert CSRFService.should_check_csrf("OPTIONS", "/api/data", []) is False

    def test_unsafe_methods_require_check(self):
        """Unsafe methods should require CSRF check"""
        assert CSRFService.should_check_csrf("POST", "/api/data", []) is True
        assert CSRFService.should_check_csrf("PUT", "/api/data", []) is True
        assert CSRFService.should_check_csrf("DELETE", "/api/data", []) is True
        assert CSRFService.should_check_csrf("PATCH", "/api/data", []) is True

    def test_excluded_paths_skip_check(self):
        """Excluded paths should skip CSRF check"""
        excluded = ["/api/auth/login", "/api/auth/register"]

        assert (
            CSRFService.should_check_csrf("POST", "/api/auth/login", excluded) is False
        )
        assert (
            CSRFService.should_check_csrf("POST", "/api/auth/register", excluded)
            is False
        )

    def test_non_excluded_paths_require_check(self):
        """Non-excluded paths should require CSRF check"""
        excluded = ["/api/auth/login"]

        assert CSRFService.should_check_csrf("POST", "/api/data", excluded) is True


class TestIraqiCompliance:
    """Test Iraqi regulatory compliance requirements"""

    def setup_method(self):
        """Setup for each test"""
        CSRFService.initialize(
            secret_key="iraqi-compliant-secret-key-32-chars",
            token_expiry_minutes=60,
        )
        CSRFTokenRepository.clear_all()

    def test_token_generation_security_compliance(self):
        """Token generation meets security standards"""
        session_id = "iraqi-session-123"
        token_info = CSRFService.generate_csrf_token(session_id)

        # Token should be cryptographically secure
        assert len(token_info.token) >= 32
        assert token_info.token_hash is not None
        assert len(token_info.token_hash) == 64  # SHA256 hex

    def test_token_expiry_compliance(self):
        """Token expiry meets Iraqi security standards"""
        session_id = "iraqi-session-123"
        token_info = CSRFService.generate_csrf_token(session_id)

        # Token should expire within reasonable time
        time_until_expiry = token_info.expires_at - datetime.utcnow()
        assert time_until_expiry.total_seconds() <= 3600  # <= 1 hour

    def test_thread_safe_token_generation(self):
        """Token generation is thread-safe"""
        import concurrent.futures

        session_id = "iraqi-session-concurrent"
        tokens = []

        def generate_token():
            return CSRFService.generate_csrf_token(session_id)

        # Generate tokens concurrently
        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(generate_token) for _ in range(10)]
            tokens = [future.result() for future in futures]

        # All tokens should be unique
        token_values = [t.token for t in tokens]
        assert len(token_values) == len(set(token_values))


class TestEdgeCases:
    """Test edge cases and boundary conditions"""

    def setup_method(self):
        """Setup for each test"""
        CSRFService.initialize(
            secret_key="test-csrf-secret-key-32-characters-long",
            token_expiry_minutes=60,
        )
        CSRFTokenRepository.clear_all()

    def test_empty_session_id(self):
        """Empty session ID should still generate token"""
        token_info = CSRFService.generate_csrf_token("")

        assert token_info is not None
        assert token_info.session_id == ""

    def test_very_long_session_id(self):
        """Very long session ID should work"""
        long_session = "x" * 1000
        token_info = CSRFService.generate_csrf_token(long_session)

        assert token_info is not None
        assert token_info.session_id == long_session

    def test_special_characters_in_session_id(self):
        """Special characters in session ID should work"""
        session_id = "session-!@#$%^&*()_+{}|:\"<>?[]\\;',./`~"
        token_info = CSRFService.generate_csrf_token(session_id)

        assert token_info is not None
