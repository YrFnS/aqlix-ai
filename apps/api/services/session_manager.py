"""
Session Manager Service
Manages user sessions with JWT tokens and cultural context integration
"""

from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, List
from enum import Enum
from pydantic import BaseModel
from uuid import uuid4
import jwt
import os


class SessionStatus(str, Enum):
    """Session status"""

    ACTIVE = "active"
    EXPIRED = "expired"
    REVOKED = "revoked"


class SessionInfo(BaseModel):
    """Session information"""

    session_id: str
    user_id: str
    device_id: Optional[str] = None
    device_type: Optional[str] = None
    platform: Optional[str] = None
    created_at: datetime
    expires_at: datetime
    last_activity: datetime
    cultural_context_snapshot: dict
    professional_session_mode: bool = False
    session_status: SessionStatus = SessionStatus.ACTIVE


class TokenPair(BaseModel):
    """JWT token pair (access + refresh)"""

    access_token: str
    refresh_token: str
    expires_at: datetime
    token_type: str = "Bearer"


class SessionCreationResult(BaseModel):
    """Result of session creation"""

    success: bool
    session: Optional[SessionInfo] = None
    tokens: Optional[TokenPair] = None
    error_message: Optional[str] = None


class SessionValidationResult(BaseModel):
    """Result of session validation"""

    is_valid: bool
    session: Optional[SessionInfo] = None
    user_id: Optional[str] = None
    cultural_context: Optional[dict] = None
    payload: Optional[dict] = None  # Full JWT payload (to avoid double decoding)
    error_message: Optional[str] = None
    requires_refresh: bool = False


class SessionManager:
    """
    Session Manager Service

    Manages user sessions with JWT tokens including:
    - JWT token generation with cultural claims
    - Session creation with device fingerprinting
    - Cultural context snapshot in sessions
    - Multi-device session management
    - Session expiration and refresh logic
    - Session revocation for security
    """

    # JWT settings (must be configured via environment)
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    if not JWT_SECRET_KEY:
        raise RuntimeError(
            "JWT_SECRET_KEY environment variable is required. "
            "Set it to a secure random value (minimum 32 characters). "
            "Example: openssl rand -hex 32"
        )

    JWT_ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRY_HOURS = 8  # 8 hours for cultural/professional sessions
    REFRESH_TOKEN_EXPIRY_DAYS = 30  # 30 days

    @staticmethod
    def generate_session_id() -> str:
        """
        Generate unique session ID

        Returns:
            Unique session ID
        """
        return str(uuid4())

    @classmethod
    def create_access_token(
        cls,
        user_id: str,
        session_id: str,
        cultural_context: Dict,
        professional_context: Optional[Dict] = None,
        expires_delta: Optional[timedelta] = None,
    ) -> str:
        """
        Create JWT access token with cultural claims

        Args:
            user_id: User ID
            session_id: Session ID
            cultural_context: Cultural context metadata
            professional_context: Professional context metadata
            expires_delta: Custom expiration delta

        Returns:
            JWT access token
        """
        if expires_delta is None:
            expires_delta = timedelta(hours=cls.ACCESS_TOKEN_EXPIRY_HOURS)

        expire = datetime.utcnow() + expires_delta

        # Build JWT claims
        claims = {
            "sub": user_id,  # Subject (user ID)
            "session_id": session_id,
            "exp": expire,  # Expiration
            "iat": datetime.utcnow(),  # Issued at
            "type": "access",
            # Cultural context claims
            "cultural_context": cultural_context,
        }

        # Add professional context if provided
        if professional_context:
            claims["professional_context"] = professional_context

        # Encode JWT
        token = jwt.encode(claims, cls.JWT_SECRET_KEY, algorithm=cls.JWT_ALGORITHM)

        return token

    @classmethod
    def create_refresh_token(
        cls,
        user_id: str,
        session_id: str,
        expires_delta: Optional[timedelta] = None,
    ) -> str:
        """
        Create JWT refresh token

        Args:
            user_id: User ID
            session_id: Session ID
            expires_delta: Custom expiration delta

        Returns:
            JWT refresh token
        """
        if expires_delta is None:
            expires_delta = timedelta(days=cls.REFRESH_TOKEN_EXPIRY_DAYS)

        expire = datetime.utcnow() + expires_delta

        claims = {
            "sub": user_id,
            "session_id": session_id,
            "exp": expire,
            "iat": datetime.utcnow(),
            "type": "refresh",
        }

        token = jwt.encode(claims, cls.JWT_SECRET_KEY, algorithm=cls.JWT_ALGORITHM)

        return token

    @classmethod
    def create_session(
        cls,
        user_id: str,
        cultural_context: Dict,
        device_id: Optional[str] = None,
        device_type: Optional[str] = None,
        platform: Optional[str] = None,
        professional_context: Optional[Dict] = None,
        session_timeout_minutes: int = 480,  # 8 hours default
    ) -> SessionCreationResult:
        """
        Create new user session with tokens

        Args:
            user_id: User ID
            cultural_context: Cultural context metadata
            device_id: Device ID
            device_type: Device type (mobile, desktop, tablet)
            platform: Platform (ios, android, web)
            professional_context: Professional context metadata
            session_timeout_minutes: Session timeout in minutes

        Returns:
            SessionCreationResult with session and tokens
        """
        try:
            # Generate session ID
            session_id = cls.generate_session_id()

            # Create timestamps
            now = datetime.utcnow()
            expires_at = now + timedelta(minutes=session_timeout_minutes)

            # Create session info
            session = SessionInfo(
                session_id=session_id,
                user_id=user_id,
                device_id=device_id,
                device_type=device_type,
                platform=platform,
                created_at=now,
                expires_at=expires_at,
                last_activity=now,
                cultural_context_snapshot=cultural_context,
                professional_session_mode=professional_context is not None,
                session_status=SessionStatus.ACTIVE,
            )

            # Create tokens
            access_token = cls.create_access_token(
                user_id=user_id,
                session_id=session_id,
                cultural_context=cultural_context,
                professional_context=professional_context,
                expires_delta=timedelta(minutes=session_timeout_minutes),
            )

            refresh_token = cls.create_refresh_token(
                user_id=user_id,
                session_id=session_id,
            )

            tokens = TokenPair(
                access_token=access_token,
                refresh_token=refresh_token,
                expires_at=expires_at,
            )

            # TODO: In production, store session in database (iraqi_authentication_sessions table)

            return SessionCreationResult(
                success=True,
                session=session,
                tokens=tokens,
            )

        except Exception as e:
            return SessionCreationResult(
                success=False,
                error_message=f"Failed to create session: {str(e)}",
            )

    @classmethod
    async def validate_access_token(cls, token: str) -> SessionValidationResult:
        """
        Validate JWT access token and check revocation status

        Args:
            token: JWT access token

        Returns:
            SessionValidationResult with validation status

        Security Notes:
            - Validates JWT signature and expiration
            - Checks if session is revoked in database
            - Rejects revoked tokens with security warning
            - Updates last_activity for active sessions
        """
        try:
            # Decode JWT
            payload = jwt.decode(
                token, cls.JWT_SECRET_KEY, algorithms=[cls.JWT_ALGORITHM]
            )

            # Verify token type
            if payload.get("type") != "access":
                return SessionValidationResult(
                    is_valid=False,
                    error_message="Invalid token type",
                )

            # Extract claims
            user_id = payload.get("sub")
            session_id = payload.get("session_id")
            cultural_context = payload.get("cultural_context", {})

            # Production validation: verify session exists in database and is not revoked
            from apps.api.database.client import SessionRepository

            # Verify session exists in database with exception handling
            try:
                session_row = await SessionRepository.get_session(session_id)
            except Exception as e:
                import logging

                logger = logging.getLogger(__name__)
                logger.error(f"Database error during session validation: {str(e)}")
                return SessionValidationResult(
                    is_valid=False,
                    error_message=f"Database error during session validation: {str(e)}",
                    requires_refresh=True,
                )

            if not session_row:
                return SessionValidationResult(
                    is_valid=False,
                    error_message="Session not found in database",
                    requires_refresh=True,
                )

            # Check if session is revoked or expired
            session_status = session_row.get("session_status")
            if session_status == "revoked":
                # Log security warning for revoked token access attempt
                import logging

                logger = logging.getLogger(__name__)
                logger.warning(
                    f"Access attempt with revoked token - session_id: {session_id}, user_id: {user_id}"
                )

                from apps.api.services.security_logger import get_security_logger

                security_logger = get_security_logger()
                security_logger.log_suspicious_activity(
                    user_id=user_id,
                    activity_type="revoked_token_access_attempt",
                    details={
                        "session_id": session_id,
                        "revoked_at": session_row.get("revoked_at").isoformat()
                        if session_row.get("revoked_at")
                        else None,
                        "attempted_at": datetime.now(timezone.utc).isoformat(),
                    },
                )

                return SessionValidationResult(
                    is_valid=False,
                    error_message="Session has been revoked",
                    requires_refresh=True,
                )
            if session_status == "expired":
                return SessionValidationResult(
                    is_valid=False,
                    error_message="Session has expired",
                    requires_refresh=True,
                )

            # Check if session is expired according to database
            expires_at = session_row.get("expires_at")
            if expires_at and expires_at < datetime.now(timezone.utc):
                return SessionValidationResult(
                    is_valid=False,
                    error_message="Session has expired",
                    requires_refresh=True,
                )

            # Update last_activity timestamp with exception handling
            try:
                await SessionRepository.update_last_activity(session_id)
            except Exception as e:
                import logging

                logger = logging.getLogger(__name__)
                logger.error(f"Database error updating last activity: {str(e)}")
                # Don't fail validation for update errors, but log them
                return SessionValidationResult(
                    is_valid=False,
                    error_message=f"Database error during session validation: {str(e)}",
                    requires_refresh=True,
                )

            # Check if token is close to expiry (within 1 hour)
            exp = payload.get("exp")
            if exp:
                exp_datetime = datetime.fromtimestamp(exp, tz=timezone.utc)
                time_until_expiry = exp_datetime - datetime.now(timezone.utc)
                requires_refresh = time_until_expiry < timedelta(hours=1)
            else:
                requires_refresh = False

            # Construct SessionInfo from database row
            session_info = SessionInfo(
                session_id=session_row.get("id"),
                user_id=session_row.get("user_id"),
                device_id=session_row.get("device_id"),
                device_type=session_row.get("device_type"),
                platform=session_row.get("platform"),
                created_at=session_row.get("created_at"),
                expires_at=session_row.get("expires_at"),
                last_activity=session_row.get("last_activity"),
                cultural_context_snapshot=session_row.get(
                    "cultural_context_snapshot", {}
                ),
                professional_session_mode=session_row.get(
                    "professional_session_mode", False
                ),
                session_status=SessionStatus(
                    session_row.get("session_status", "active")
                ),
            )

            return SessionValidationResult(
                is_valid=True,
                session=session_info,
                user_id=user_id,
                cultural_context=cultural_context,
                payload=payload,  # Include decoded payload to avoid double decoding
                requires_refresh=requires_refresh,
            )

        except jwt.ExpiredSignatureError:
            return SessionValidationResult(
                is_valid=False,
                error_message="Token has expired",
                requires_refresh=True,
            )
        except jwt.InvalidTokenError as e:
            return SessionValidationResult(
                is_valid=False,
                error_message=f"Invalid token: {str(e)}",
            )
        except Exception as e:
            return SessionValidationResult(
                is_valid=False,
                error_message=f"Token validation failed: {str(e)}",
            )

    @classmethod
    def refresh_session(
        cls,
        refresh_token: str,
        cultural_context: Dict,
        professional_context: Optional[Dict] = None,
    ) -> SessionCreationResult:
        """
        Refresh session using refresh token

        Args:
            refresh_token: JWT refresh token
            cultural_context: Updated cultural context
            professional_context: Updated professional context

        Returns:
            SessionCreationResult with new tokens
        """
        try:
            # Decode refresh token
            payload = jwt.decode(
                refresh_token, cls.JWT_SECRET_KEY, algorithms=[cls.JWT_ALGORITHM]
            )

            # Verify token type
            if payload.get("type") != "refresh":
                return SessionCreationResult(
                    success=False,
                    error_message="Invalid refresh token type",
                )

            user_id = payload.get("sub")
            session_id = payload.get("session_id")

            # TODO: In production, verify session exists and is not revoked

            # Create new access token
            access_token = cls.create_access_token(
                user_id=user_id,
                session_id=session_id,
                cultural_context=cultural_context,
                professional_context=professional_context,
            )

            expires_at = datetime.utcnow() + timedelta(
                hours=cls.ACCESS_TOKEN_EXPIRY_HOURS
            )

            tokens = TokenPair(
                access_token=access_token,
                refresh_token=refresh_token,  # Keep same refresh token
                expires_at=expires_at,
            )

            # TODO: In production, update session last_activity

            return SessionCreationResult(
                success=True,
                tokens=tokens,
            )

        except jwt.ExpiredSignatureError:
            return SessionCreationResult(
                success=False,
                error_message="Refresh token has expired. Please login again.",
            )
        except jwt.InvalidTokenError as e:
            return SessionCreationResult(
                success=False,
                error_message=f"Invalid refresh token: {str(e)}",
            )
        except Exception as e:
            return SessionCreationResult(
                success=False,
                error_message=f"Token refresh failed: {str(e)}",
            )

    @staticmethod
    async def revoke_session(session_id: str) -> bool:
        """
        Revoke a session (logout)

        Args:
            session_id: Session ID to revoke

        Returns:
            True if revoked successfully, False if session not found

        Security Notes:
            - Immediately invalidates session by setting status to 'revoked'
            - Records revocation timestamp for audit trail
            - Logs security event for monitoring
            - Future token validation attempts will be rejected
        """
        from apps.api.database.client import SessionRepository

        # Revoke session in database with security logging
        return await SessionRepository.revoke_session(session_id)

    @staticmethod
    async def revoke_all_user_sessions(user_id: str) -> int:
        """
        Revoke all sessions for a user (logout from all devices)

        Args:
            user_id: User ID

        Returns:
            Number of sessions revoked

        Security Notes:
            - Used for compromised account scenarios
            - Revokes ALL active sessions across all devices
            - Records revocation timestamps for audit
            - Logs high-severity security event
            - Triggers notification to user
        """
        from apps.api.database.client import SessionRepository

        # Revoke all active sessions for user in database
        return await SessionRepository.revoke_all_user_sessions(user_id)

    @staticmethod
    async def get_active_sessions(user_id: str) -> List[SessionInfo]:
        """
        Get all active sessions for a user

        Args:
            user_id: User ID

        Returns:
            List of active SessionInfo objects
        """
        from apps.api.database.client import SessionRepository

        # In production, query database for active sessions
        session_rows = await SessionRepository.get_active_sessions(user_id)

        # Convert database rows to SessionInfo objects
        sessions = []
        for row in session_rows:
            session = SessionInfo(
                session_id=row.get("id"),
                user_id=row.get("user_id"),
                device_id=row.get("device_id"),
                device_type=row.get("device_type"),
                platform=row.get("platform"),
                created_at=row.get("created_at"),
                expires_at=row.get("expires_at"),
                last_activity=row.get("last_activity"),
                cultural_context_snapshot=row.get("cultural_context_snapshot", {}),
                professional_session_mode=row.get("professional_session_mode", False),
                session_status=SessionStatus(row.get("session_status", "active")),
            )
            sessions.append(session)

        return sessions

    @staticmethod
    async def cleanup_expired_sessions() -> int:
        """
        Cleanup expired sessions (background task)

        Returns:
            Number of sessions cleaned up
        """
        from apps.api.database.client import SessionRepository

        # Mark expired sessions as expired
        return await SessionRepository.cleanup_expired_sessions()

    @staticmethod
    async def cleanup_revoked_sessions(retention_days: int = 30) -> int:
        """
        Delete revoked sessions older than retention period

        Args:
            retention_days: Number of days to retain revoked sessions (default: 30)

        Returns:
            Number of sessions deleted

        Security Notes:
            - Complies with Iraqi data retention laws (30 days default)
            - Maintains audit trail for recent revocations
            - Deletes only sessions revoked longer than retention period
            - Should be run as scheduled background task

        Iraqi Compliance:
            - 30-day retention period aligns with Iraqi data protection standards
            - Maintains security audit trail while respecting data minimization
            - Supports forensic investigation of recent security incidents

        Usage:
            # Run daily as scheduled task
            deleted_count = await SessionManager.cleanup_revoked_sessions()
        """
        from apps.api.database.client import SessionRepository

        # Delete old revoked sessions from database
        return await SessionRepository.cleanup_revoked_sessions(retention_days)
