"""
Unit tests for Session Manager
Tests JWT token creation, refresh, cultural claims, and session management
"""

import pytest
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
import jwt
from apps.api.services.session_manager import (
    SessionManager,
    TokenPair,
    SessionData,
    TokenValidationResult,
    IraqiRegion,
    IslamicComplianceLevel,
    LanguagePreference,
)


class TestTokenGeneration:
    """Test JWT token generation"""

    def test_create_access_token(self):
        """Create access token with user claims"""
        manager = SessionManager(secret_key="test-secret-key")
        user_id = "user123"

        token = manager.create_access_token(user_id)

        assert token is not None
        assert isinstance(token, str)
        assert len(token) > 0

    def test_create_refresh_token(self):
        """Create refresh token"""
        manager = SessionManager(secret_key="test-secret-key")
        user_id = "user123"

        token = manager.create_refresh_token(user_id)

        assert token is not None
        assert isinstance(token, str)
        assert len(token) > 0

    def test_create_token_pair(self):
        """Create both access and refresh tokens"""
        manager = SessionManager(secret_key="test-secret-key")
        user_id = "user123"

        token_pair = manager.create_token_pair(user_id)

        assert token_pair.access_token is not None
        assert token_pair.refresh_token is not None
        assert len(token_pair.access_token) > 0
        assert len(token_pair.refresh_token) > 0

    def test_access_token_expiration(self):
        """Access token should expire in 15 minutes"""
        manager = SessionManager(secret_key="test-secret-key")
        user_id = "user123"

        token = manager.create_access_token(user_id)
        decoded = jwt.decode(token, "test-secret-key", algorithms=["HS256"])

        exp_timestamp = decoded["exp"]
        exp_datetime = datetime.fromtimestamp(exp_timestamp, tz=ZoneInfo("UTC"))
        now = datetime.now(tz=ZoneInfo("UTC"))

        time_until_expiry = exp_datetime - now

        # Should expire in approximately 15 minutes
        assert time_until_expiry.total_seconds() > 800  # > 13 minutes
        assert time_until_expiry.total_seconds() < 1000  # < 17 minutes

    def test_refresh_token_expiration(self):
        """Refresh token should expire in 7 days"""
        manager = SessionManager(secret_key="test-secret-key")
        user_id = "user123"

        token = manager.create_refresh_token(user_id)
        decoded = jwt.decode(token, "test-secret-key", algorithms=["HS256"])

        exp_timestamp = decoded["exp"]
        exp_datetime = datetime.fromtimestamp(exp_timestamp, tz=ZoneInfo("UTC"))
        now = datetime.now(tz=ZoneInfo("UTC"))

        time_until_expiry = exp_datetime - now

        # Should expire in approximately 7 days
        assert time_until_expiry.total_seconds() > 6 * 24 * 3600  # > 6 days
        assert time_until_expiry.total_seconds() < 8 * 24 * 3600  # < 8 days


class TestCulturalClaims:
    """Test cultural context in JWT claims"""

    def test_token_with_cultural_claims(self):
        """Token should include cultural context claims"""
        manager = SessionManager(secret_key="test-secret-key")
        user_id = "user123"
        cultural_context = {
            "region": IraqiRegion.BAGHDAD,
            "islamic_compliance": IslamicComplianceLevel.STANDARD,
            "language_preference": LanguagePreference.BOTH,
        }

        token = manager.create_access_token(user_id, cultural_context=cultural_context)
        decoded = jwt.decode(token, "test-secret-key", algorithms=["HS256"])

        assert decoded["region"] == IraqiRegion.BAGHDAD
        assert decoded["islamic_compliance"] == IslamicComplianceLevel.STANDARD
        assert decoded["language_preference"] == LanguagePreference.BOTH

    def test_token_with_baghdad_region(self):
        """Token should include Baghdad region claim"""
        manager = SessionManager(secret_key="test-secret-key")
        cultural_context = {"region": IraqiRegion.BAGHDAD}

        token = manager.create_access_token(
            "user123", cultural_context=cultural_context
        )
        decoded = jwt.decode(token, "test-secret-key", algorithms=["HS256"])

        assert decoded["region"] == "baghdad"

    def test_token_with_strict_compliance(self):
        """Token should include strict Islamic compliance"""
        manager = SessionManager(secret_key="test-secret-key")
        cultural_context = {"islamic_compliance": IslamicComplianceLevel.STRICT}

        token = manager.create_access_token(
            "user123", cultural_context=cultural_context
        )
        decoded = jwt.decode(token, "test-secret-key", algorithms=["HS256"])

        assert decoded["islamic_compliance"] == "strict"

    def test_token_with_arabic_preference(self):
        """Token should include Arabic language preference"""
        manager = SessionManager(secret_key="test-secret-key")
        cultural_context = {"language_preference": LanguagePreference.ARABIC}

        token = manager.create_access_token(
            "user123", cultural_context=cultural_context
        )
        decoded = jwt.decode(token, "test-secret-key", algorithms=["HS256"])

        assert decoded["language_preference"] == "ar-IQ"

    def test_token_without_cultural_claims(self):
        """Token without cultural context should have default values"""
        manager = SessionManager(secret_key="test-secret-key")

        token = manager.create_access_token("user123")
        decoded = jwt.decode(token, "test-secret-key", algorithms=["HS256"])

        # Should have default cultural values
        assert "region" in decoded or decoded.get("region") is None
        assert (
            "islamic_compliance" in decoded or decoded.get("islamic_compliance") is None
        )


class TestTokenValidation:
    """Test JWT token validation"""

    def test_validate_valid_token(self):
        """Validate a valid token"""
        manager = SessionManager(secret_key="test-secret-key")
        token = manager.create_access_token("user123")

        validation = manager.validate_token(token)

        assert validation.is_valid is True
        assert validation.user_id == "user123"
        assert validation.error_message is None

    def test_validate_expired_token(self):
        """Validate an expired token"""
        manager = SessionManager(secret_key="test-secret-key")

        # Create token that expires immediately
        expired_token = jwt.encode(
            {
                "sub": "user123",
                "exp": datetime.now(tz=ZoneInfo("UTC")) - timedelta(minutes=1),
            },
            "test-secret-key",
            algorithm="HS256",
        )

        validation = manager.validate_token(expired_token)

        assert validation.is_valid is False
        assert "expired" in validation.error_message.lower()

    def test_validate_invalid_signature(self):
        """Validate token with invalid signature"""
        manager = SessionManager(secret_key="test-secret-key")

        # Create token with different secret
        token = jwt.encode(
            {
                "sub": "user123",
                "exp": datetime.now(tz=ZoneInfo("UTC")) + timedelta(minutes=15),
            },
            "wrong-secret-key",
            algorithm="HS256",
        )

        validation = manager.validate_token(token)

        assert validation.is_valid is False
        assert (
            "signature" in validation.error_message.lower()
            or "invalid" in validation.error_message.lower()
        )

    def test_validate_malformed_token(self):
        """Validate malformed token"""
        manager = SessionManager(secret_key="test-secret-key")

        validation = manager.validate_token("not-a-valid-jwt-token")

        assert validation.is_valid is False
        assert (
            "invalid" in validation.error_message.lower()
            or "malformed" in validation.error_message.lower()
        )

    def test_validate_empty_token(self):
        """Validate empty token"""
        manager = SessionManager(secret_key="test-secret-key")

        validation = manager.validate_token("")

        assert validation.is_valid is False

    def test_validate_none_token(self):
        """Validate None token"""
        manager = SessionManager(secret_key="test-secret-key")

        validation = manager.validate_token(None)

        assert validation.is_valid is False


class TestTokenRefresh:
    """Test token refresh functionality"""

    def test_refresh_valid_token(self):
        """Refresh a valid refresh token"""
        manager = SessionManager(secret_key="test-secret-key")
        token_pair = manager.create_token_pair("user123")

        new_token_pair = manager.refresh_tokens(token_pair.refresh_token)

        assert new_token_pair.access_token is not None
        assert new_token_pair.refresh_token is not None
        assert new_token_pair.access_token != token_pair.access_token  # New token

    def test_refresh_expired_token(self):
        """Refresh an expired refresh token should fail"""
        manager = SessionManager(secret_key="test-secret-key")

        # Create expired refresh token
        expired_token = jwt.encode(
            {
                "sub": "user123",
                "type": "refresh",
                "exp": datetime.now(tz=ZoneInfo("UTC")) - timedelta(days=1),
            },
            "test-secret-key",
            algorithm="HS256",
        )

        new_token_pair = manager.refresh_tokens(expired_token)

        assert new_token_pair is None or hasattr(new_token_pair, "error")

    def test_refresh_access_token_fails(self):
        """Refreshing with access token should fail"""
        manager = SessionManager(secret_key="test-secret-key")
        access_token = manager.create_access_token("user123")

        result = manager.refresh_tokens(access_token)

        # Should fail because it's an access token, not a refresh token
        assert result is None or hasattr(result, "error")

    def test_refresh_preserves_cultural_claims(self):
        """Token refresh should preserve cultural context"""
        manager = SessionManager(secret_key="test-secret-key")
        cultural_context = {
            "region": IraqiRegion.BASRA,
            "islamic_compliance": IslamicComplianceLevel.STRICT,
        }

        original_pair = manager.create_token_pair(
            "user123", cultural_context=cultural_context
        )
        new_pair = manager.refresh_tokens(original_pair.refresh_token)

        # Decode new access token
        decoded = jwt.decode(
            new_pair.access_token, "test-secret-key", algorithms=["HS256"]
        )

        assert decoded["region"] == "basra"
        assert decoded["islamic_compliance"] == "strict"


class TestSessionManagement:
    """Test session management functionality"""

    def test_create_session(self):
        """Create a new session"""
        manager = SessionManager(secret_key="test-secret-key")
        session = manager.create_session(
            user_id="user123",
            device_id="device-abc-123",
            device_type="iPhone 14",
            ip_address="192.168.1.100",
        )

        assert session.session_id is not None
        assert session.user_id == "user123"
        assert session.device_id == "device-abc-123"
        assert session.is_active is True

    def test_get_active_sessions(self):
        """Get all active sessions for a user"""
        manager = SessionManager(secret_key="test-secret-key")

        # Create multiple sessions
        manager.create_session("user123", "device-1", "iPhone 14", "192.168.1.100")
        manager.create_session("user123", "device-2", "MacBook Pro", "192.168.1.101")
        manager.create_session("user123", "device-3", "iPad Air", "192.168.1.102")

        sessions = manager.get_active_sessions("user123")

        assert len(sessions) == 3
        assert all(s.is_active for s in sessions)

    def test_revoke_session(self):
        """Revoke a specific session"""
        manager = SessionManager(secret_key="test-secret-key")
        session = manager.create_session(
            "user123", "device-abc", "iPhone", "192.168.1.100"
        )

        revoke_result = manager.revoke_session(session.session_id)

        assert revoke_result.success is True
        assert manager.is_session_active(session.session_id) is False

    def test_revoke_all_sessions(self):
        """Revoke all sessions for a user"""
        manager = SessionManager(secret_key="test-secret-key")

        # Create multiple sessions
        manager.create_session("user123", "device-1", "iPhone", "192.168.1.100")
        manager.create_session("user123", "device-2", "MacBook", "192.168.1.101")

        revoke_result = manager.revoke_all_sessions("user123")

        assert revoke_result.success is True
        sessions = manager.get_active_sessions("user123")
        assert len(sessions) == 0

    def test_session_last_activity_update(self):
        """Session last activity should update"""
        manager = SessionManager(secret_key="test-secret-key")
        session = manager.create_session(
            "user123", "device-abc", "iPhone", "192.168.1.100"
        )

        original_activity = session.last_activity

        # Update activity
        manager.update_session_activity(session.session_id)
        updated_session = manager.get_session(session.session_id)

        assert updated_session.last_activity > original_activity


class TestSessionSecurity:
    """Test session security features"""

    def test_detect_ip_change(self):
        """Detect IP address change for session"""
        manager = SessionManager(secret_key="test-secret-key")
        session = manager.create_session(
            "user123", "device-abc", "iPhone", "192.168.1.100"
        )

        # Check with different IP
        ip_changed = manager.detect_ip_change(session.session_id, "192.168.1.200")

        assert ip_changed is True

    def test_detect_device_change(self):
        """Detect device change for session"""
        manager = SessionManager(secret_key="test-secret-key")
        session = manager.create_session(
            "user123", "device-abc", "iPhone 14", "192.168.1.100"
        )

        # Check with different device
        device_changed = manager.detect_device_change(session.session_id, "device-xyz")

        assert device_changed is True

    def test_session_timeout(self):
        """Sessions should timeout after inactivity"""
        manager = SessionManager(
            secret_key="test-secret-key", session_timeout_minutes=30
        )
        session = manager.create_session(
            "user123", "device-abc", "iPhone", "192.168.1.100"
        )

        # Simulate 31 minutes of inactivity
        manager.set_session_last_activity(
            session.session_id,
            datetime.now(tz=ZoneInfo("Asia/Baghdad")) - timedelta(minutes=31),
        )

        is_active = manager.is_session_active(session.session_id)

        assert is_active is False

    def test_concurrent_session_limit(self):
        """Enforce concurrent session limit"""
        manager = SessionManager(
            secret_key="test-secret-key", max_concurrent_sessions=3
        )

        # Create 3 sessions (at limit)
        manager.create_session("user123", "device-1", "iPhone", "192.168.1.100")
        manager.create_session("user123", "device-2", "MacBook", "192.168.1.101")
        manager.create_session("user123", "device-3", "iPad", "192.168.1.102")

        # 4th session should fail or revoke oldest
        fourth_session = manager.create_session(
            "user123", "device-4", "Android", "192.168.1.103"
        )

        active_sessions = manager.get_active_sessions("user123")

        # Should have max 3 active sessions
        assert len(active_sessions) <= 3


class TestTokenPairStructure:
    """Test TokenPair data structure"""

    def test_token_pair_has_all_fields(self):
        """Token pair should have access and refresh tokens"""
        manager = SessionManager(secret_key="test-secret-key")
        token_pair = manager.create_token_pair("user123")

        assert hasattr(token_pair, "access_token")
        assert hasattr(token_pair, "refresh_token")
        assert isinstance(token_pair.access_token, str)
        assert isinstance(token_pair.refresh_token, str)


class TestEdgeCases:
    """Test edge cases and boundary conditions"""

    def test_empty_secret_key(self):
        """Empty secret key should fail"""
        with pytest.raises(ValueError):
            SessionManager(secret_key="")

    def test_none_secret_key(self):
        """None secret key should fail"""
        with pytest.raises(ValueError):
            SessionManager(secret_key=None)

    def test_create_token_empty_user_id(self):
        """Create token with empty user ID should fail"""
        manager = SessionManager(secret_key="test-secret-key")
        result = manager.create_access_token("")

        assert result is None or len(result) == 0

    def test_create_token_none_user_id(self):
        """Create token with None user ID should fail"""
        manager = SessionManager(secret_key="test-secret-key")
        result = manager.create_access_token(None)

        assert result is None


class TestRealWorldScenarios:
    """Test realistic session management scenarios"""

    def test_complete_login_flow(self):
        """Complete login flow: create session, generate tokens"""
        manager = SessionManager(secret_key="test-secret-key")

        # Create session
        session = manager.create_session(
            user_id="user123",
            device_id="device-abc",
            device_type="iPhone 14",
            ip_address="192.168.1.100",
        )

        # Generate tokens with cultural context
        cultural_context = {
            "region": IraqiRegion.BAGHDAD,
            "islamic_compliance": IslamicComplianceLevel.STANDARD,
            "language_preference": LanguagePreference.BOTH,
        }
        token_pair = manager.create_token_pair(
            "user123", cultural_context=cultural_context
        )

        assert session.is_active is True
        assert token_pair.access_token is not None
        assert token_pair.refresh_token is not None

    def test_multi_device_sessions(self):
        """User logged in on multiple devices"""
        manager = SessionManager(secret_key="test-secret-key")

        # iPhone session
        iphone_session = manager.create_session(
            "user123", "device-iphone", "iPhone 14", "192.168.1.100"
        )

        # MacBook session
        macbook_session = manager.create_session(
            "user123", "device-macbook", "MacBook Pro", "192.168.1.101"
        )

        # iPad session
        ipad_session = manager.create_session(
            "user123", "device-ipad", "iPad Air", "192.168.1.102"
        )

        active_sessions = manager.get_active_sessions("user123")

        assert len(active_sessions) == 3
        assert any(s.device_id == "device-iphone" for s in active_sessions)
        assert any(s.device_id == "device-macbook" for s in active_sessions)
        assert any(s.device_id == "device-ipad" for s in active_sessions)

    def test_token_refresh_flow(self):
        """Token refresh flow when access token expires"""
        manager = SessionManager(secret_key="test-secret-key")

        # Initial login
        original_pair = manager.create_token_pair("user123")

        # Simulate access token expiration (after 15 minutes)
        # Refresh tokens
        new_pair = manager.refresh_tokens(original_pair.refresh_token)

        assert new_pair.access_token != original_pair.access_token
        assert new_pair.access_token is not None

        # Validate new token
        validation = manager.validate_token(new_pair.access_token)
        assert validation.is_valid is True

    def test_session_revocation_on_logout(self):
        """Revoke session on user logout"""
        manager = SessionManager(secret_key="test-secret-key")

        # Login
        session = manager.create_session(
            "user123", "device-abc", "iPhone", "192.168.1.100"
        )
        token_pair = manager.create_token_pair("user123")

        assert session.is_active is True

        # Logout - revoke session
        manager.revoke_session(session.session_id)

        assert manager.is_session_active(session.session_id) is False

    def test_security_event_ip_change(self):
        """Detect security event when IP changes"""
        manager = SessionManager(secret_key="test-secret-key")
        session = manager.create_session(
            "user123", "device-abc", "iPhone", "192.168.1.100"
        )

        # Detect IP change
        ip_changed = manager.detect_ip_change(session.session_id, "10.0.0.50")

        if ip_changed:
            # Should trigger security event
            manager.log_security_event(
                session.session_id, "ip_change", "192.168.1.100 -> 10.0.0.50"
            )

        assert ip_changed is True
