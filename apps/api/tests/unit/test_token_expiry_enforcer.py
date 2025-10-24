"""
Unit tests for token expiry enforcement
Tests JWT token validation, expiry enforcement, and session timeout
"""

import sys
import os
from datetime import datetime, timedelta, timezone
import time

# Add parent directory to path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

# Import directly from the module file
import importlib.util

spec = importlib.util.spec_from_file_location(
    "token_expiry_enforcer",
    os.path.join(os.path.dirname(__file__), "../../services/token_expiry_enforcer.py"),
)
token_expiry_enforcer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(token_expiry_enforcer)

TokenExpiryEnforcer = token_expiry_enforcer.TokenExpiryEnforcer
TokenType = token_expiry_enforcer.TokenType
TokenStatus = token_expiry_enforcer.TokenStatus


class TestTokenGeneration:
    """Test token generation"""

    def test_generate_access_token(self):
        """Test that access tokens are generated correctly"""
        user_id = "test-user-123"
        session_id = "test-session-456"

        token = TokenExpiryEnforcer.generate_token(
            user_id=user_id,
            session_id=session_id,
            token_type=TokenType.ACCESS,
        )

        assert isinstance(token, str)
        assert len(token) > 0

    def test_generate_refresh_token(self):
        """Test that refresh tokens are generated correctly"""
        user_id = "test-user-123"
        session_id = "test-session-456"

        token = TokenExpiryEnforcer.generate_token(
            user_id=user_id,
            session_id=session_id,
            token_type=TokenType.REFRESH,
        )

        assert isinstance(token, str)
        assert len(token) > 0

    def test_token_contains_user_id(self):
        """Test that generated tokens contain user ID"""
        user_id = "test-user-123"
        session_id = "test-session-456"

        token = TokenExpiryEnforcer.generate_token(
            user_id=user_id,
            session_id=session_id,
            token_type=TokenType.ACCESS,
        )

        validation = TokenExpiryEnforcer.validate_token(token, TokenType.ACCESS)

        assert validation.is_valid is True
        assert validation.user_id == user_id
        assert validation.session_id == session_id

    def test_token_with_cultural_context(self):
        """Test token generation with cultural context"""
        user_id = "test-user-123"
        session_id = "test-session-456"
        cultural_context = {
            "region": "baghdad",
            "language": "ar-IQ",
            "islamic_compliance_level": "standard",
        }

        token = TokenExpiryEnforcer.generate_token(
            user_id=user_id,
            session_id=session_id,
            token_type=TokenType.ACCESS,
            cultural_context=cultural_context,
        )

        assert isinstance(token, str)
        # Token should be valid
        validation = TokenExpiryEnforcer.validate_token(token, TokenType.ACCESS)
        assert validation.is_valid is True


class TestTokenValidation:
    """Test token validation"""

    def test_validate_valid_access_token(self):
        """Test validation of valid access token"""
        user_id = "test-user-123"
        session_id = "test-session-456"

        token = TokenExpiryEnforcer.generate_token(
            user_id=user_id,
            session_id=session_id,
            token_type=TokenType.ACCESS,
        )

        validation = TokenExpiryEnforcer.validate_token(token, TokenType.ACCESS)

        assert validation.is_valid is True
        assert validation.status == TokenStatus.VALID
        assert validation.user_id == user_id
        assert validation.session_id == session_id
        assert validation.expires_at is not None
        assert validation.issued_at is not None
        assert validation.time_until_expiry is not None
        assert validation.time_until_expiry > 0

    def test_validate_valid_refresh_token(self):
        """Test validation of valid refresh token"""
        user_id = "test-user-123"
        session_id = "test-session-456"

        token = TokenExpiryEnforcer.generate_token(
            user_id=user_id,
            session_id=session_id,
            token_type=TokenType.REFRESH,
        )

        validation = TokenExpiryEnforcer.validate_token(token, TokenType.REFRESH)

        assert validation.is_valid is True
        assert validation.status == TokenStatus.VALID
        assert validation.time_until_expiry > 900  # Refresh token lasts longer

    def test_validate_invalid_token_format(self):
        """Test validation of invalid token format"""
        invalid_token = "invalid.token.format"

        validation = TokenExpiryEnforcer.validate_token(invalid_token, TokenType.ACCESS)

        assert validation.is_valid is False
        assert validation.status == TokenStatus.INVALID
        assert validation.error_message is not None

    def test_validate_expired_token(self):
        """Test validation of expired token"""
        # Create a token with negative lifetime (already expired)
        original_lifetime = TokenExpiryEnforcer.ACCESS_TOKEN_LIFETIME
        TokenExpiryEnforcer.ACCESS_TOKEN_LIFETIME = -10  # Expired 10 seconds ago

        try:
            token = TokenExpiryEnforcer.generate_token(
                user_id="test-user",
                session_id="test-session",
                token_type=TokenType.ACCESS,
            )

            validation = TokenExpiryEnforcer.validate_token(token, TokenType.ACCESS)

            assert validation.is_valid is False
            assert validation.status == TokenStatus.EXPIRED
        finally:
            TokenExpiryEnforcer.ACCESS_TOKEN_LIFETIME = original_lifetime

    def test_validate_token_without_user_id(self):
        """Test validation of token missing user ID (manually crafted invalid token)"""
        # This would require manually crafting a token without sub claim
        # For now, just test that a malformed token is caught
        invalid_token = (
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnZhbGlkIjoidHJ1ZSJ9.invalid"
        )

        validation = TokenExpiryEnforcer.validate_token(invalid_token, TokenType.ACCESS)

        assert validation.is_valid is False
        assert validation.status == TokenStatus.INVALID


class TestTokenRevocation:
    """Test token revocation checking"""

    def test_validate_revoked_token(self):
        """Test that revoked tokens are detected"""
        user_id = "test-user-123"
        session_id = "test-session-456"

        # Generate token
        token = TokenExpiryEnforcer.generate_token(
            user_id=user_id,
            session_id=session_id,
            token_type=TokenType.ACCESS,
        )

        # First validation should pass
        validation = TokenExpiryEnforcer.validate_token(
            token, TokenType.ACCESS, revoked_tokens=set()
        )
        assert validation.is_valid is True

        # Extract JWT ID from first validation (would come from decoding)
        # For testing, we'll create a revoked set with the expected JWT ID format
        import jwt

        payload = jwt.decode(
            token,
            TokenExpiryEnforcer.JWT_SECRET_KEY,
            algorithms=[TokenExpiryEnforcer.JWT_ALGORITHM],
            options={"verify_signature": True, "verify_exp": False},
        )
        token_id = payload.get("jti")

        # Second validation with revoked set should fail
        revoked_tokens = {token_id}
        validation = TokenExpiryEnforcer.validate_token(
            token, TokenType.ACCESS, revoked_tokens=revoked_tokens
        )

        assert validation.is_valid is False
        assert validation.status == TokenStatus.REVOKED

    def test_validate_non_revoked_token(self):
        """Test that non-revoked tokens pass validation"""
        user_id = "test-user-123"
        session_id = "test-session-456"

        token = TokenExpiryEnforcer.generate_token(
            user_id=user_id,
            session_id=session_id,
            token_type=TokenType.ACCESS,
        )

        # Validate with empty revoked set
        validation = TokenExpiryEnforcer.validate_token(
            token, TokenType.ACCESS, revoked_tokens=set()
        )

        assert validation.is_valid is True
        assert validation.status == TokenStatus.VALID


class TestTokenExpiry:
    """Test token expiry logic"""

    def test_access_token_expiry_time(self):
        """Test that access tokens have correct expiry time (15 minutes)"""
        user_id = "test-user-123"
        session_id = "test-session-456"

        token = TokenExpiryEnforcer.generate_token(
            user_id=user_id,
            session_id=session_id,
            token_type=TokenType.ACCESS,
        )

        validation = TokenExpiryEnforcer.validate_token(token, TokenType.ACCESS)

        # Access token should expire in ~15 minutes (900 seconds)
        assert validation.time_until_expiry is not None
        assert 890 <= validation.time_until_expiry <= 910  # Allow 10 second margin

    def test_refresh_token_expiry_time(self):
        """Test that refresh tokens have correct expiry time (7 days)"""
        user_id = "test-user-123"
        session_id = "test-session-456"

        token = TokenExpiryEnforcer.generate_token(
            user_id=user_id,
            session_id=session_id,
            token_type=TokenType.REFRESH,
        )

        validation = TokenExpiryEnforcer.validate_token(token, TokenType.REFRESH)

        # Refresh token should expire in ~7 days (604800 seconds)
        assert validation.time_until_expiry is not None
        assert (
            604700 <= validation.time_until_expiry <= 604900
        )  # Allow 100 second margin

    def test_should_refresh_access_token(self):
        """Test that access tokens recommend refresh when close to expiry"""
        # Create token with very short lifetime
        original_lifetime = TokenExpiryEnforcer.ACCESS_TOKEN_LIFETIME
        TokenExpiryEnforcer.ACCESS_TOKEN_LIFETIME = 400  # 6 minutes 40 seconds

        try:
            token = TokenExpiryEnforcer.generate_token(
                user_id="test-user",
                session_id="test-session",
                token_type=TokenType.ACCESS,
            )

            validation = TokenExpiryEnforcer.validate_token(token, TokenType.ACCESS)

            # Token expires in ~400 seconds, which is > 300 seconds (refresh threshold)
            # So should_refresh should be False initially
            assert validation.should_refresh is False

            # Wait or create a token that's close to expiry
            # For a token with 400 seconds lifetime and 300 second refresh threshold
            # We need to wait until time_until_expiry <= 300

            # Alternative: Create token with 250 second lifetime (< 300 refresh threshold)
            TokenExpiryEnforcer.ACCESS_TOKEN_LIFETIME = 250

            token2 = TokenExpiryEnforcer.generate_token(
                user_id="test-user",
                session_id="test-session",
                token_type=TokenType.ACCESS,
            )

            validation2 = TokenExpiryEnforcer.validate_token(token2, TokenType.ACCESS)

            # Token expires in ~250 seconds, which is < 300 seconds (refresh threshold)
            assert validation2.should_refresh is True

        finally:
            TokenExpiryEnforcer.ACCESS_TOKEN_LIFETIME = original_lifetime


class TestExpiryEnforcement:
    """Test expiry enforcement logic"""

    def test_should_enforce_expiry_for_expired_token(self):
        """Test that expiry is enforced for expired tokens"""
        # Create expired token
        original_lifetime = TokenExpiryEnforcer.ACCESS_TOKEN_LIFETIME
        TokenExpiryEnforcer.ACCESS_TOKEN_LIFETIME = -10  # Expired

        try:
            token = TokenExpiryEnforcer.generate_token(
                user_id="test-user",
                session_id="test-session",
                token_type=TokenType.ACCESS,
            )

            validation = TokenExpiryEnforcer.validate_token(token, TokenType.ACCESS)

            should_enforce = TokenExpiryEnforcer.should_enforce_expiry(validation)

            assert should_enforce is True
        finally:
            TokenExpiryEnforcer.ACCESS_TOKEN_LIFETIME = original_lifetime

    def test_should_not_enforce_expiry_for_valid_token(self):
        """Test that expiry is not enforced for valid tokens"""
        token = TokenExpiryEnforcer.generate_token(
            user_id="test-user",
            session_id="test-session",
            token_type=TokenType.ACCESS,
        )

        validation = TokenExpiryEnforcer.validate_token(token, TokenType.ACCESS)

        should_enforce = TokenExpiryEnforcer.should_enforce_expiry(validation)

        assert should_enforce is False

    def test_get_expiry_error_message_for_expired_access_token(self):
        """Test error message for expired access token"""
        # Create mock validation result
        TokenValidationResult = token_expiry_enforcer.TokenValidationResult

        validation = TokenValidationResult(
            is_valid=False,
            status=TokenStatus.EXPIRED,
        )

        error_message = TokenExpiryEnforcer.get_expiry_error_message(
            validation, TokenType.ACCESS
        )

        assert "session has expired" in error_message.lower()
        assert "log in again" in error_message.lower()

    def test_get_expiry_error_message_for_expired_refresh_token(self):
        """Test error message for expired refresh token"""
        TokenValidationResult = token_expiry_enforcer.TokenValidationResult

        validation = TokenValidationResult(
            is_valid=False,
            status=TokenStatus.EXPIRED,
        )

        error_message = TokenExpiryEnforcer.get_expiry_error_message(
            validation, TokenType.REFRESH
        )

        assert "refresh token has expired" in error_message.lower()

    def test_get_expiry_error_message_for_revoked_token(self):
        """Test error message for revoked token"""
        TokenValidationResult = token_expiry_enforcer.TokenValidationResult

        validation = TokenValidationResult(
            is_valid=False,
            status=TokenStatus.REVOKED,
        )

        error_message = TokenExpiryEnforcer.get_expiry_error_message(validation)

        assert "revoked" in error_message.lower()


class TestSessionTimeout:
    """Test session timeout logic"""

    def test_check_session_timeout_not_timed_out(self):
        """Test that active session is not timed out"""
        last_activity = datetime.now(timezone.utc) - timedelta(minutes=10)

        timeout_result = TokenExpiryEnforcer.check_session_timeout(
            last_activity=last_activity,
            timeout_minutes=30,
        )

        assert timeout_result["is_timed_out"] is False
        assert timeout_result["minutes_since_activity"] == 10

    def test_check_session_timeout_timed_out(self):
        """Test that inactive session is timed out"""
        last_activity = datetime.now(timezone.utc) - timedelta(minutes=45)

        timeout_result = TokenExpiryEnforcer.check_session_timeout(
            last_activity=last_activity,
            timeout_minutes=30,
        )

        assert timeout_result["is_timed_out"] is True
        assert timeout_result["minutes_since_activity"] == 45
        assert timeout_result["timeout_message"] is not None

    def test_check_session_timeout_exact_threshold(self):
        """Test session timeout at exact threshold"""
        last_activity = datetime.now(timezone.utc) - timedelta(minutes=30)

        timeout_result = TokenExpiryEnforcer.check_session_timeout(
            last_activity=last_activity,
            timeout_minutes=30,
        )

        # At exactly 30 minutes, should be timed out
        assert timeout_result["is_timed_out"] is True


class TestTokenPairValidation:
    """Test validation of access + refresh token pairs"""

    def test_validate_token_pair_both_valid(self):
        """Test validation when both tokens are valid"""
        user_id = "test-user-123"
        session_id = "test-session-456"

        access_token = TokenExpiryEnforcer.generate_token(
            user_id=user_id,
            session_id=session_id,
            token_type=TokenType.ACCESS,
        )

        refresh_token = TokenExpiryEnforcer.generate_token(
            user_id=user_id,
            session_id=session_id,
            token_type=TokenType.REFRESH,
        )

        validation = TokenExpiryEnforcer.validate_token_pair(
            access_token=access_token,
            refresh_token=refresh_token,
        )

        assert validation["access"].is_valid is True
        assert validation["refresh"].is_valid is True

    def test_validate_token_pair_access_expired(self):
        """Test validation when access token is expired"""
        user_id = "test-user-123"
        session_id = "test-session-456"

        # Create expired access token
        original_lifetime = TokenExpiryEnforcer.ACCESS_TOKEN_LIFETIME
        TokenExpiryEnforcer.ACCESS_TOKEN_LIFETIME = -10

        try:
            access_token = TokenExpiryEnforcer.generate_token(
                user_id=user_id,
                session_id=session_id,
                token_type=TokenType.ACCESS,
            )
        finally:
            TokenExpiryEnforcer.ACCESS_TOKEN_LIFETIME = original_lifetime

        # Create valid refresh token
        refresh_token = TokenExpiryEnforcer.generate_token(
            user_id=user_id,
            session_id=session_id,
            token_type=TokenType.REFRESH,
        )

        validation = TokenExpiryEnforcer.validate_token_pair(
            access_token=access_token,
            refresh_token=refresh_token,
        )

        assert validation["access"].is_valid is False
        assert validation["access"].status == TokenStatus.EXPIRED
        assert validation["refresh"].is_valid is True


class TestTokenExpiryIntegration:
    """Integration tests for token expiry enforcement"""

    def test_complete_token_lifecycle(self):
        """Test complete token lifecycle: generation, validation, expiry"""
        user_id = "test-user-123"
        session_id = "test-session-456"

        # Step 1: Generate tokens
        access_token = TokenExpiryEnforcer.generate_token(
            user_id=user_id,
            session_id=session_id,
            token_type=TokenType.ACCESS,
        )

        refresh_token = TokenExpiryEnforcer.generate_token(
            user_id=user_id,
            session_id=session_id,
            token_type=TokenType.REFRESH,
        )

        # Step 2: Validate tokens (should be valid)
        access_validation = TokenExpiryEnforcer.validate_token(
            access_token, TokenType.ACCESS
        )
        assert access_validation.is_valid is True

        refresh_validation = TokenExpiryEnforcer.validate_token(
            refresh_token, TokenType.REFRESH
        )
        assert refresh_validation.is_valid is True

        # Step 3: Check expiry enforcement (should not enforce for valid tokens)
        should_enforce = TokenExpiryEnforcer.should_enforce_expiry(access_validation)
        assert should_enforce is False

        # Step 4: Simulate revocation
        import jwt

        access_payload = jwt.decode(
            access_token,
            TokenExpiryEnforcer.JWT_SECRET_KEY,
            algorithms=[TokenExpiryEnforcer.JWT_ALGORITHM],
            options={"verify_signature": True, "verify_exp": False},
        )
        token_id = access_payload.get("jti")
        revoked_tokens = {token_id}

        # Step 5: Validate revoked token (should fail)
        revoked_validation = TokenExpiryEnforcer.validate_token(
            access_token, TokenType.ACCESS, revoked_tokens=revoked_tokens
        )
        assert revoked_validation.is_valid is False
        assert revoked_validation.status == TokenStatus.REVOKED

        # Step 6: Check expiry enforcement for revoked token (should enforce)
        should_enforce = TokenExpiryEnforcer.should_enforce_expiry(revoked_validation)
        assert should_enforce is True
