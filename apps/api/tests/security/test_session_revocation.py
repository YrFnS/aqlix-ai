"""
Test Session Revocation Functionality
Comprehensive tests for session revocation, validation, and cleanup
"""

import pytest
import asyncio
from datetime import datetime, timedelta, timezone
from uuid import uuid4
from unittest.mock import Mock, patch, AsyncMock

# Import modules to test
from apps.api.services.session_manager import (
    SessionManager,
    SessionStatus,
    SessionValidationResult,
)
from apps.api.database.client import SessionRepository


class TestSessionRevocation:
    """Test session revocation functionality"""

    @pytest.fixture
    def mock_session_data(self):
        """Mock session data for testing"""
        user_id = str(uuid4())
        session_id = str(uuid4())

        return {
            "id": session_id,
            "user_id": user_id,
            "session_token": "mock_token_123",
            "refresh_token": "mock_refresh_123",
            "expires_at": datetime.now(timezone.utc) + timedelta(hours=8),
            "session_status": "active",
            "cultural_context_snapshot": {"language": "ar-IQ", "region": "baghdad"},
            "device_id": "device_123",
            "device_type": "desktop",
            "platform": "web",
            "ip_address": "192.168.1.1",
            "created_at": datetime.now(timezone.utc),
            "last_activity": datetime.now(timezone.utc),
            "professional_session_mode": False,
            "revoked_at": None,
        }

    @pytest.mark.asyncio
    async def test_revoke_session_success(self, mock_session_data):
        """Test successful session revocation"""
        session_id = mock_session_data["id"]

        # Mock database methods
        with patch.object(
            SessionRepository, "get_session", new_callable=AsyncMock
        ) as mock_get:
            with patch.object(
                SessionRepository, "revoke_session", new_callable=AsyncMock
            ) as mock_revoke:
                # Setup mocks
                mock_get.return_value = mock_session_data
                mock_revoke.return_value = True

                # Call revoke_session
                result = await SessionManager.revoke_session(session_id)

                # Assertions
                assert result is True
                mock_revoke.assert_called_once_with(session_id)

    @pytest.mark.asyncio
    async def test_revoke_session_not_found(self):
        """Test revoking non-existent session"""
        session_id = str(uuid4())

        with patch.object(
            SessionRepository, "revoke_session", new_callable=AsyncMock
        ) as mock_revoke:
            # Session not found returns False
            mock_revoke.return_value = False

            result = await SessionManager.revoke_session(session_id)

            assert result is False
            mock_revoke.assert_called_once_with(session_id)

    @pytest.mark.asyncio
    async def test_revoke_all_user_sessions_success(self, mock_session_data):
        """Test revoking all user sessions"""
        user_id = mock_session_data["user_id"]

        with patch.object(
            SessionRepository, "revoke_all_user_sessions", new_callable=AsyncMock
        ) as mock_revoke_all:
            # Mock 3 sessions revoked
            mock_revoke_all.return_value = 3

            result = await SessionManager.revoke_all_user_sessions(user_id)

            # Assertions
            assert result == 3
            mock_revoke_all.assert_called_once_with(user_id)

    @pytest.mark.asyncio
    async def test_revoke_all_user_sessions_none_found(self):
        """Test revoking all sessions when user has no active sessions"""
        user_id = str(uuid4())

        with patch.object(
            SessionRepository, "revoke_all_user_sessions", new_callable=AsyncMock
        ) as mock_revoke_all:
            mock_revoke_all.return_value = 0

            result = await SessionManager.revoke_all_user_sessions(user_id)

            assert result == 0
            mock_revoke_all.assert_called_once_with(user_id)

    @pytest.mark.asyncio
    async def test_validate_revoked_token(self, mock_session_data):
        """Test that revoked tokens are rejected during validation"""
        # Mark session as revoked
        mock_session_data["session_status"] = "revoked"
        mock_session_data["revoked_at"] = datetime.now(timezone.utc)

        # Create a valid JWT token
        session_id = mock_session_data["id"]
        user_id = mock_session_data["user_id"]
        cultural_context = {"language": "ar-IQ", "region": "baghdad"}

        token = SessionManager.create_access_token(
            user_id=user_id,
            session_id=session_id,
            cultural_context=cultural_context,
        )

        with patch.object(
            SessionRepository, "get_session", new_callable=AsyncMock
        ) as mock_get:
            mock_get.return_value = mock_session_data

            # Validate token - should be rejected
            result = await SessionManager.validate_access_token(token)

            # Assertions
            assert result.is_valid is False
            assert "revoked" in result.error_message.lower()
            assert result.requires_refresh is True

    @pytest.mark.asyncio
    async def test_validate_active_token(self, mock_session_data):
        """Test that active tokens are validated successfully"""
        session_id = mock_session_data["id"]
        user_id = mock_session_data["user_id"]
        cultural_context = {"language": "ar-IQ", "region": "baghdad"}

        token = SessionManager.create_access_token(
            user_id=user_id,
            session_id=session_id,
            cultural_context=cultural_context,
        )

        with patch.object(
            SessionRepository, "get_session", new_callable=AsyncMock
        ) as mock_get:
            with patch.object(
                SessionRepository, "update_last_activity", new_callable=AsyncMock
            ) as mock_update:
                mock_get.return_value = mock_session_data
                mock_update.return_value = True

                # Validate token - should succeed
                result = await SessionManager.validate_access_token(token)

                # Assertions
                assert result.is_valid is True
                assert result.user_id == user_id
                assert result.session is not None
                assert result.session.session_status == SessionStatus.ACTIVE
                mock_update.assert_called_once_with(session_id)

    @pytest.mark.asyncio
    async def test_cleanup_revoked_sessions(self):
        """Test cleanup of old revoked sessions"""
        with patch.object(
            SessionRepository, "cleanup_revoked_sessions", new_callable=AsyncMock
        ) as mock_cleanup:
            # Mock 10 sessions deleted
            mock_cleanup.return_value = 10

            result = await SessionManager.cleanup_revoked_sessions(retention_days=30)

            # Assertions
            assert result == 10
            mock_cleanup.assert_called_once_with(30)

    @pytest.mark.asyncio
    async def test_cleanup_revoked_sessions_custom_retention(self):
        """Test cleanup with custom retention period"""
        with patch.object(
            SessionRepository, "cleanup_revoked_sessions", new_callable=AsyncMock
        ) as mock_cleanup:
            mock_cleanup.return_value = 5

            result = await SessionManager.cleanup_revoked_sessions(retention_days=7)

            assert result == 5
            mock_cleanup.assert_called_once_with(7)

    @pytest.mark.asyncio
    async def test_revoked_token_logs_security_warning(self, mock_session_data):
        """Test that accessing with revoked token logs security warning"""
        # Mark session as revoked
        mock_session_data["session_status"] = "revoked"
        mock_session_data["revoked_at"] = datetime.now(timezone.utc)

        session_id = mock_session_data["id"]
        user_id = mock_session_data["user_id"]
        cultural_context = {"language": "ar-IQ", "region": "baghdad"}

        token = SessionManager.create_access_token(
            user_id=user_id,
            session_id=session_id,
            cultural_context=cultural_context,
        )

        with patch.object(
            SessionRepository, "get_session", new_callable=AsyncMock
        ) as mock_get:
            with patch(
                "apps.api.services.security_logger.get_security_logger"
            ) as mock_logger:
                mock_get.return_value = mock_session_data
                mock_security_logger = Mock()
                mock_logger.return_value = mock_security_logger

                # Validate revoked token
                result = await SessionManager.validate_access_token(token)

                # Should log suspicious activity
                mock_security_logger.log_suspicious_activity.assert_called_once()
                call_args = mock_security_logger.log_suspicious_activity.call_args
                assert call_args[1]["user_id"] == user_id
                assert call_args[1]["activity_type"] == "revoked_token_access_attempt"


class TestSessionRepositoryRevocation:
    """Test SessionRepository revocation methods"""

    @pytest.fixture
    def mock_db_execute(self):
        """Mock database execute method"""
        with patch.object(
            SessionRepository, "DatabaseClient.execute", new_callable=AsyncMock
        ) as mock:
            yield mock

    @pytest.mark.asyncio
    async def test_repository_revoke_session_updates_status(self):
        """Test that revoke_session updates status and timestamp in database"""
        session_id = str(uuid4())

        with patch("apps.api.database.client.DatabaseClient.execute") as mock_execute:
            with patch("apps.api.database.client.SessionRepository.get_session"):
                # Mock successful update
                mock_execute.return_value = "UPDATE 1"

                result = await SessionRepository.revoke_session(session_id)

                # Should return True
                assert result is True

                # Verify SQL executed with correct parameters
                mock_execute.assert_called_once()
                call_args = mock_execute.call_args[0]
                assert "UPDATE iraqi_authentication_sessions" in call_args[0]
                assert "SET session_status = 'revoked'" in call_args[0]
                assert "revoked_at = $1" in call_args[0]

    @pytest.mark.asyncio
    async def test_repository_revoke_all_user_sessions_count(self):
        """Test that revoke_all_user_sessions returns correct count"""
        user_id = str(uuid4())

        with patch("apps.api.database.client.DatabaseClient.execute") as mock_execute:
            # Mock 3 sessions updated
            mock_execute.return_value = "UPDATE 3"

            result = await SessionRepository.revoke_all_user_sessions(user_id)

            # Should return 3
            assert result == 3

            # Verify SQL parameters
            mock_execute.assert_called_once()
            call_args = mock_execute.call_args[0]
            assert "WHERE user_id = $2" in call_args[0]
            assert call_args[2] == user_id

    @pytest.mark.asyncio
    async def test_repository_cleanup_revoked_sessions_deletes_old(self):
        """Test that cleanup deletes only old revoked sessions"""
        with patch("apps.api.database.client.DatabaseClient.execute") as mock_execute:
            # Mock 5 sessions deleted
            mock_execute.return_value = "DELETE 5"

            result = await SessionRepository.cleanup_revoked_sessions(retention_days=30)

            # Should return 5
            assert result == 5

            # Verify SQL logic
            mock_execute.assert_called_once()
            call_args = mock_execute.call_args[0]
            assert "DELETE FROM iraqi_authentication_sessions" in call_args[0]
            assert "WHERE session_status = 'revoked'" in call_args[0]
            assert "AND revoked_at IS NOT NULL" in call_args[0]
            assert "AND revoked_at < $1" in call_args[0]


class TestSecurityLogging:
    """Test security logging for revocation events"""

    @pytest.mark.asyncio
    async def test_revoke_session_logs_event(self):
        """Test that session revocation logs security event"""
        session_id = str(uuid4())
        user_id = str(uuid4())

        mock_session_data = {
            "id": session_id,
            "user_id": user_id,
            "ip_address": "192.168.1.1",
            "session_status": "active",
        }

        with patch("apps.api.database.client.DatabaseClient.execute") as mock_execute:
            with patch(
                "apps.api.database.client.SessionRepository.get_session"
            ) as mock_get:
                with patch(
                    "apps.api.services.security_logger.get_security_logger"
                ) as mock_logger:
                    mock_execute.return_value = "UPDATE 1"
                    mock_get.return_value = mock_session_data
                    mock_security_logger = Mock()
                    mock_logger.return_value = mock_security_logger

                    # Revoke session
                    await SessionRepository.revoke_session(session_id)

                    # Verify security event logged
                    mock_security_logger.log_session_revoked.assert_called_once_with(
                        user_id=user_id,
                        session_id=session_id,
                        reason="manual_revocation",
                        ip_address="192.168.1.1",
                    )

    @pytest.mark.asyncio
    async def test_revoke_all_sessions_logs_bulk_event(self):
        """Test that bulk revocation logs high-severity event"""
        user_id = str(uuid4())

        with patch("apps.api.database.client.DatabaseClient.execute") as mock_execute:
            with patch(
                "apps.api.services.security_logger.get_security_logger"
            ) as mock_logger:
                mock_execute.return_value = "UPDATE 3"
                mock_security_logger = Mock()
                mock_logger.return_value = mock_security_logger

                # Revoke all sessions
                await SessionRepository.revoke_all_user_sessions(user_id)

                # Verify security event logged
                mock_security_logger.log_event.assert_called_once()
                call_args = mock_security_logger.log_event.call_args[0][0]
                assert call_args.event_type.value == "all_sessions_revoked"
                assert call_args.severity.value == "high"
                assert call_args.user_id == user_id


@pytest.mark.integration
class TestIntegrationSessionRevocation:
    """Integration tests requiring actual database"""

    @pytest.mark.asyncio
    async def test_full_revocation_flow(self):
        """Test complete revocation flow: create -> revoke -> validate"""
        # This test would require actual database connection
        # Skip if database not available
        pytest.skip("Integration test - requires database connection")

    @pytest.mark.asyncio
    async def test_cleanup_with_database(self):
        """Test cleanup with actual database"""
        # This test would require actual database connection
        pytest.skip("Integration test - requires database connection")


if __name__ == "__main__":
    # Run tests with pytest
    pytest.main([__file__, "-v", "-s"])
