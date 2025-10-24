"""
Integration tests for session management with database storage
Tests session creation, validation, revocation, and database persistence
"""

import sys
import os
import pytest
from datetime import datetime, timedelta
from uuid import uuid4

# Add parent directory to path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

# Import directly from the module files
import importlib.util

# Load session_manager module
session_manager_spec = importlib.util.spec_from_file_location(
    "session_manager",
    os.path.join(os.path.dirname(__file__), "../../services/session_manager.py"),
)
session_manager = importlib.util.module_from_spec(session_manager_spec)
session_manager_spec.loader.exec_module(session_manager)

SessionManager = session_manager.SessionManager
SessionStatus = session_manager.SessionStatus
TokenPair = session_manager.TokenPair


# Mock database repository for testing
class MockSessionRepository:
    """Mock repository for testing without actual database"""

    _sessions = {}
    _revoked_sessions = set()

    @classmethod
    def reset(cls):
        """Reset mock data"""
        cls._sessions = {}
        cls._revoked_sessions = set()

    @classmethod
    async def create_session(cls, session_id, user_id, **kwargs):
        """Mock create session"""
        cls._sessions[session_id] = {
            "id": session_id,
            "user_id": user_id,
            "session_status": "active",
            "created_at": datetime.utcnow(),
            "last_activity": datetime.utcnow(),
            **kwargs,
        }
        return cls._sessions[session_id]

    @classmethod
    async def get_session(cls, session_id):
        """Mock get session"""
        return cls._sessions.get(session_id)

    @classmethod
    async def update_last_activity(cls, session_id):
        """Mock update activity"""
        if session_id in cls._sessions:
            cls._sessions[session_id]["last_activity"] = datetime.utcnow()
            return True
        return False

    @classmethod
    async def revoke_session(cls, session_id):
        """Mock revoke session"""
        if session_id in cls._sessions:
            cls._sessions[session_id]["session_status"] = "revoked"
            cls._revoked_sessions.add(session_id)
            return True
        return False

    @classmethod
    async def revoke_all_user_sessions(cls, user_id):
        """Mock revoke all user sessions"""
        count = 0
        for session_id, session in cls._sessions.items():
            if session["user_id"] == user_id and session["session_status"] == "active":
                session["session_status"] = "revoked"
                cls._revoked_sessions.add(session_id)
                count += 1
        return count

    @classmethod
    async def get_active_sessions(cls, user_id):
        """Mock get active sessions"""
        now = datetime.utcnow()
        active = []
        for session_id, session in cls._sessions.items():
            if (
                session["user_id"] == user_id
                and session["session_status"] == "active"
                and session.get("expires_at", now + timedelta(hours=1)) > now
            ):
                active.append(session)
        return active

    @classmethod
    async def cleanup_expired_sessions(cls):
        """Mock cleanup expired sessions"""
        count = 0
        now = datetime.utcnow()
        for session_id, session in cls._sessions.items():
            if (
                session["session_status"] == "active"
                and session.get("expires_at", now + timedelta(hours=1)) < now
            ):
                session["session_status"] = "expired"
                count += 1
        return count


# Patch the SessionRepository in session_manager module
# Note: In real tests, you would use proper mocking libraries like pytest-mock
import sys

sys.modules["database"] = type(sys)("database")
sys.modules["database"].SessionRepository = MockSessionRepository


@pytest.fixture(autouse=True)
def reset_mock_db():
    """Reset mock database before each test"""
    MockSessionRepository.reset()


class TestSessionCreationWithDatabase:
    """Test session creation with database storage"""

    @pytest.mark.asyncio
    async def test_create_session_stores_in_database(self):
        """Test that create_session stores session in database"""
        user_id = str(uuid4())
        cultural_context = {
            "region": "baghdad",
            "language_preference": "ar-IQ",
            "islamic_compliance_level": "standard",
        }

        # Create session
        result = await SessionManager.create_session(
            user_id=user_id,
            cultural_context=cultural_context,
            device_id="test-device-123",
            device_type="desktop",
            platform="web",
        )

        assert result.success is True
        assert result.session is not None
        assert result.tokens is not None

        # Verify session was stored in mock database
        session_id = result.session.session_id
        db_session = await MockSessionRepository.get_session(session_id)

        assert db_session is not None
        assert db_session["user_id"] == user_id
        assert db_session["session_status"] == "active"

    @pytest.mark.asyncio
    async def test_create_session_with_cultural_context(self):
        """Test session creation preserves cultural context"""
        user_id = str(uuid4())
        cultural_context = {
            "region": "erbil",
            "language_preference": "ar-IQ",
            "islamic_compliance_level": "strict",
            "professional_domain": "medical",
        }

        result = await SessionManager.create_session(
            user_id=user_id, cultural_context=cultural_context
        )

        assert result.success is True
        session = result.session

        # Verify cultural context is preserved
        assert session.cultural_context_snapshot == cultural_context
        assert session.professional_session_mode is False

    @pytest.mark.asyncio
    async def test_create_session_with_professional_context(self):
        """Test session creation with professional context"""
        user_id = str(uuid4())
        cultural_context = {"region": "baghdad"}
        professional_context = {"domain": "legal", "license_verified": True}

        result = await SessionManager.create_session(
            user_id=user_id,
            cultural_context=cultural_context,
            professional_context=professional_context,
        )

        assert result.success is True
        assert result.session.professional_session_mode is True


class TestSessionValidationWithDatabase:
    """Test session validation with database lookup"""

    @pytest.mark.asyncio
    async def test_validate_active_session(self):
        """Test validation of active session"""
        user_id = str(uuid4())
        cultural_context = {"region": "baghdad"}

        # Create session
        create_result = await SessionManager.create_session(
            user_id=user_id, cultural_context=cultural_context
        )

        access_token = create_result.tokens.access_token

        # Validate token
        validation_result = await SessionManager.validate_access_token(access_token)

        assert validation_result.is_valid is True
        assert validation_result.user_id == user_id
        assert validation_result.cultural_context == cultural_context

    @pytest.mark.asyncio
    async def test_validate_revoked_session(self):
        """Test validation rejects revoked session"""
        user_id = str(uuid4())
        cultural_context = {"region": "baghdad"}

        # Create session
        create_result = await SessionManager.create_session(
            user_id=user_id, cultural_context=cultural_context
        )

        session_id = create_result.session.session_id
        access_token = create_result.tokens.access_token

        # Revoke session
        await SessionManager.revoke_session(session_id)

        # Attempt validation
        validation_result = await SessionManager.validate_access_token(access_token)

        assert validation_result.is_valid is False
        assert "revoked" in validation_result.error_message.lower()


class TestSessionRevocationWithDatabase:
    """Test session revocation mechanisms"""

    @pytest.mark.asyncio
    async def test_revoke_single_session(self):
        """Test revoking single session"""
        user_id = str(uuid4())

        # Create session
        create_result = await SessionManager.create_session(
            user_id=user_id, cultural_context={"region": "baghdad"}
        )

        session_id = create_result.session.session_id

        # Revoke session
        result = await SessionManager.revoke_session(session_id)

        assert result is True

        # Verify session is revoked in database
        db_session = await MockSessionRepository.get_session(session_id)
        assert db_session["session_status"] == "revoked"

    @pytest.mark.asyncio
    async def test_revoke_all_user_sessions(self):
        """Test revoking all sessions for a user"""
        user_id = str(uuid4())

        # Create multiple sessions
        for i in range(3):
            await SessionManager.create_session(
                user_id=user_id,
                cultural_context={"region": "baghdad"},
                device_id=f"device-{i}",
            )

        # Revoke all sessions
        count = await SessionManager.revoke_all_user_sessions(user_id)

        assert count == 3

        # Verify all sessions are revoked
        active_sessions = await SessionManager.get_active_sessions(user_id)
        assert len(active_sessions) == 0


class TestGetActiveSessionsWithDatabase:
    """Test retrieving active sessions"""

    @pytest.mark.asyncio
    async def test_get_active_sessions(self):
        """Test retrieving active sessions for a user"""
        user_id = str(uuid4())

        # Create multiple sessions
        device_ids = ["desktop-1", "mobile-1", "tablet-1"]
        for device_id in device_ids:
            await SessionManager.create_session(
                user_id=user_id,
                cultural_context={"region": "baghdad"},
                device_id=device_id,
            )

        # Get active sessions
        sessions = await SessionManager.get_active_sessions(user_id)

        assert len(sessions) == 3
        assert all(isinstance(s.session_id, str) for s in sessions)
        assert all(s.user_id == user_id for s in sessions)
        assert all(s.session_status == SessionStatus.ACTIVE for s in sessions)

    @pytest.mark.asyncio
    async def test_get_active_sessions_excludes_revoked(self):
        """Test that revoked sessions are excluded from active list"""
        user_id = str(uuid4())

        # Create 3 sessions
        results = []
        for i in range(3):
            result = await SessionManager.create_session(
                user_id=user_id,
                cultural_context={"region": "baghdad"},
                device_id=f"device-{i}",
            )
            results.append(result)

        # Revoke one session
        await SessionManager.revoke_session(results[1].session.session_id)

        # Get active sessions
        sessions = await SessionManager.get_active_sessions(user_id)

        assert len(sessions) == 2  # Only 2 active sessions


class TestCleanupExpiredSessions:
    """Test cleanup of expired sessions"""

    @pytest.mark.asyncio
    async def test_cleanup_expired_sessions(self):
        """Test cleanup marks expired sessions"""
        user_id = str(uuid4())

        # Create session that will expire
        result = await SessionManager.create_session(
            user_id=user_id,
            cultural_context={"region": "baghdad"},
            session_timeout_minutes=1,  # 1 minute timeout
        )

        session_id = result.session.session_id

        # Manually expire the session in mock DB
        MockSessionRepository._sessions[session_id]["expires_at"] = (
            datetime.utcnow() - timedelta(minutes=5)
        )

        # Run cleanup
        count = await SessionManager.cleanup_expired_sessions()

        assert count == 1

        # Verify session is marked as expired
        db_session = await MockSessionRepository.get_session(session_id)
        assert db_session["session_status"] == "expired"


class TestSessionTokenIntegration:
    """Test JWT token and database integration"""

    @pytest.mark.asyncio
    async def test_session_token_contains_session_id(self):
        """Test that JWT tokens contain session_id for database lookup"""
        user_id = str(uuid4())

        result = await SessionManager.create_session(
            user_id=user_id, cultural_context={"region": "baghdad"}
        )

        # Decode token to verify session_id is present
        import jwt

        payload = jwt.decode(
            result.tokens.access_token,
            SessionManager.JWT_SECRET_KEY,
            algorithms=[SessionManager.JWT_ALGORITHM],
        )

        assert "session_id" in payload
        assert payload["session_id"] == result.session.session_id

    @pytest.mark.asyncio
    async def test_refresh_token_updates_activity(self):
        """Test that token refresh updates last_activity"""
        user_id = str(uuid4())
        cultural_context = {"region": "baghdad"}

        # Create session
        create_result = await SessionManager.create_session(
            user_id=user_id, cultural_context=cultural_context
        )

        session_id = create_result.session.session_id
        refresh_token = create_result.tokens.refresh_token

        # Get initial activity time
        initial_session = await MockSessionRepository.get_session(session_id)
        initial_activity = initial_session["last_activity"]

        # Wait a bit (in real tests you'd use freezegun or similar)
        import time

        time.sleep(0.1)

        # Refresh session
        refresh_result = await SessionManager.refresh_session(
            refresh_token=refresh_token,
            cultural_context=cultural_context,
        )

        assert refresh_result.success is True

        # Verify activity was updated
        updated_session = await MockSessionRepository.get_session(session_id)
        assert updated_session["last_activity"] > initial_activity
