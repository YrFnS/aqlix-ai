"""
Session Manager Service
Manages user sessions with JWT tokens and cultural context integration
"""

from datetime import datetime, timedelta
from typing import Optional, Dict, List
from enum import Enum
from pydantic import BaseModel
from uuid import uuid4
import jwt
import os
import json

# Import database repository
from ..database import SessionRepository


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
    """

    # JWT settings (in production, load from environment)
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
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

            # Store session in database
            try:
                await SessionRepository.create_session(
                    session_id=session_id,
                    user_id=user_id,
                    session_token=access_token,
                    refresh_token=refresh_token,
                    expires_at=expires_at,
                    cultural_context_snapshot=cultural_context,
                    device_id=device_id,
                    device_type=device_type,
                    platform=platform,
                    professional_session_mode=professional_context is not None,
                    login_method="email_password",
                    mfa_completed=False,  # Will be updated after MFA if required
                )
            except Exception as db_error:
                # Log database error but don't fail session creation
                # In production, you might want to fail hard here
                print(f"Warning: Failed to store session in database: {str(db_error)}")

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
    def validate_access_token(cls, token: str) -> SessionValidationResult:
        """
        Validate JWT access token

        Args:
            token: JWT access token

        Returns:
            SessionValidationResult with validation status
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

            # Verify session exists in database and is not revoked
            try:
                db_session = await SessionRepository.get_session(session_id)

                if not db_session:
                    return SessionValidationResult(
                        is_valid=False,
                        error_message="Session not found in database",
                    )

                if db_session["session_status"] != "active":
                    return SessionValidationResult(
                        is_valid=False,
                        error_message=f"Session is {db_session['session_status']}",
                    )

                # Update last_activity timestamp
                await SessionRepository.update_last_activity(session_id)

            except Exception as db_error:
                # Log database error but allow validation to proceed
                # In production, you might want to fail hard here
                print(
                    f"Warning: Database lookup failed during token validation: {str(db_error)}"
                )

            # Check if token is close to expiry (within 1 hour)
            exp = payload.get("exp")
            if exp:
                exp_datetime = datetime.utcfromtimestamp(exp)
                time_until_expiry = exp_datetime - datetime.utcnow()
                requires_refresh = time_until_expiry < timedelta(hours=1)
            else:
                requires_refresh = False

            return SessionValidationResult(
                is_valid=True,
                user_id=user_id,
                cultural_context=cultural_context,
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

            # Update session last_activity in database
            try:
                await SessionRepository.update_last_activity(session_id)
            except Exception as db_error:
                print(f"Warning: Failed to update session activity: {str(db_error)}")

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
            True if successful
        """
        try:
            return await SessionRepository.revoke_session(session_id)
        except Exception as e:
            print(f"Error revoking session: {str(e)}")
            return False

    @staticmethod
    async def revoke_all_user_sessions(user_id: str) -> int:
        """
        Revoke all sessions for a user (logout from all devices)

        Args:
            user_id: User ID

        Returns:
            Number of sessions revoked
        """
        try:
            return await SessionRepository.revoke_all_user_sessions(user_id)
        except Exception as e:
            print(f"Error revoking all user sessions: {str(e)}")
            return 0

    @staticmethod
    async def get_active_sessions(user_id: str) -> List[SessionInfo]:
        """
        Get all active sessions for a user

        Args:
            user_id: User ID

        Returns:
            List of active SessionInfo objects
        """
        try:
            db_sessions = await SessionRepository.get_active_sessions(user_id)

            # Convert database rows to SessionInfo objects
            sessions = []
            for db_session in db_sessions:
                sessions.append(
                    SessionInfo(
                        session_id=str(db_session["id"]),
                        user_id=str(db_session["user_id"]),
                        device_id=db_session.get("device_id"),
                        device_type=db_session.get("device_type"),
                        platform=db_session.get("platform"),
                        created_at=db_session["created_at"],
                        expires_at=db_session["expires_at"],
                        last_activity=db_session["last_activity"],
                        cultural_context_snapshot=json.loads(
                            db_session["cultural_context_snapshot"]
                        )
                        if isinstance(db_session["cultural_context_snapshot"], str)
                        else db_session["cultural_context_snapshot"],
                        professional_session_mode=db_session.get(
                            "professional_session_mode", False
                        ),
                        session_status=SessionStatus(
                            db_session.get("session_status", "active")
                        ),
                    )
                )

            return sessions

        except Exception as e:
            print(f"Error getting active sessions: {str(e)}")
            return []

    @staticmethod
    async def cleanup_expired_sessions() -> int:
        """
        Cleanup expired sessions (background task)

        Returns:
            Number of sessions cleaned up
        """
        try:
            return await SessionRepository.cleanup_expired_sessions()
        except Exception as e:
            print(f"Error cleaning up expired sessions: {str(e)}")
            return 0
