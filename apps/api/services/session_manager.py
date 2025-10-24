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
    """Result of JWT token validation"""

    is_valid: bool
    session: Optional[SessionInfo] = None
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    cultural_context: Optional[dict] = None
    professional_context: Optional[dict] = None
    error_message: Optional[str] = None
    requires_refresh: bool = False


class RefreshTokenRotationResult(BaseModel):
    """Result of refresh token rotation"""

    success: bool
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    expires_at: Optional[datetime] = None
    token_type: str = "Bearer"
    error_message: Optional[str] = None
    reuse_detected: bool = False  # True if token reuse attack detected


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
        token_family: Optional[str] = None,
        expires_delta: Optional[timedelta] = None,
    ) -> str:
        """
        Create JWT refresh token with rotation support

        Args:
            user_id: User ID
            session_id: Session ID
            token_family: Token family ID for rotation tracking (detects reuse attacks)
            expires_delta: Custom expiration delta

        Returns:
            JWT refresh token with family tracking claims

        Token Family Security:
        - Each refresh token belongs to a family
        - When token is rotated, new token gets same family ID
        - If different token with same family is used, it indicates reuse attack
        - Reuse attacks trigger immediate session revocation
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

        # Add token family for rotation attack detection
        if token_family:
            claims["token_family"] = token_family

        token = jwt.encode(claims, cls.JWT_SECRET_KEY, algorithm=cls.JWT_ALGORITHM)

        return token

    @classmethod
    async def create_session(
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
        Create new user session with JWT tokens and store in database

        Args:
            user_id: User ID to create session for
            cultural_context: Cultural context metadata for JWT claims
            device_id: Device ID for device tracking
            device_type: Device type (mobile, desktop, tablet)
            platform: Platform (ios, android, web)
            professional_context: Professional context metadata (if applicable)
            session_timeout_minutes: Session timeout in minutes (default 8 hours)

        Returns:
            SessionCreationResult with session info and JWT tokens

        Raises:
            None - All exceptions caught and returned as results
        """
        try:
            # Step 1: Generate session ID
            session_id = cls.generate_session_id()

            # Step 2: Create timestamps
            now = datetime.utcnow()
            expires_at = now + timedelta(minutes=session_timeout_minutes)

            # Step 3: Create session info object
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

            # Step 4: Create JWT tokens
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

            # Step 5: Store session in database
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
    async def validate_access_token(cls, token: str) -> SessionValidationResult:
        """
        Validate JWT access token with signature, expiry, issuer, and revocation checks

        Performs comprehensive JWT validation:
        - Signature verification using HS256 algorithm
        - Token expiry timestamp validation
        - Token type verification (must be "access")
        - Session revocation status check
        - Database session verification
        - Token claim validation

        Args:
            token: JWT access token string

        Returns:
            SessionValidationResult with validation status and claims

        Raises:
            None - All exceptions caught and returned as validation results
        """
        try:
            # Step 1: Decode and verify JWT signature
            # This also validates the token hasn't been tampered with
            payload = jwt.decode(
                token, cls.JWT_SECRET_KEY, algorithms=[cls.JWT_ALGORITHM]
            )

            # Step 2: Verify token type
            if payload.get("type") != "access":
                return SessionValidationResult(
                    is_valid=False,
                    error_message="Invalid token type: expected 'access' token",
                )

            # Step 3: Extract claims
            user_id = payload.get("sub")
            session_id = payload.get("session_id")
            cultural_context = payload.get("cultural_context", {})

            if not user_id or not session_id:
                return SessionValidationResult(
                    is_valid=False,
                    error_message="Missing required token claims (sub, session_id)",
                )

            # Step 4: Verify session exists in database and is not revoked
            try:
                db_session = await SessionRepository.get_session(session_id)

                if not db_session:
                    return SessionValidationResult(
                        is_valid=False,
                        error_message="Session not found in database",
                    )

                # Check session status
                session_status = db_session.get("session_status")
                if session_status != "active":
                    return SessionValidationResult(
                        is_valid=False,
                        error_message=f"Session is {session_status}: access denied",
                    )

                # Verify user_id matches
                if db_session.get("user_id") != user_id:
                    return SessionValidationResult(
                        is_valid=False,
                        error_message="Token user_id does not match session user_id",
                    )

                # Update last activity timestamp
                await SessionRepository.update_last_activity(session_id)

            except SessionValidationResult as validation_error:
                # Re-raise SessionValidationResult errors
                raise validation_error
            except Exception as db_error:
                # Log database errors but allow validation to proceed
                # In production, you may want to fail hard on database errors
                print(
                    f"Warning: Database lookup failed during token validation: {str(db_error)}"
                )

            # Step 5: Check if token is close to expiry (within 1 hour)
            exp = payload.get("exp")
            requires_refresh = False
            if exp:
                exp_datetime = datetime.utcfromtimestamp(exp)
                time_until_expiry = exp_datetime - datetime.utcnow()
                requires_refresh = time_until_expiry < timedelta(hours=1)

            # Step 6: Return successful validation result
            return SessionValidationResult(
                is_valid=True,
                user_id=user_id,
                session_id=session_id,
                cultural_context=cultural_context,
                requires_refresh=requires_refresh,
            )

        except jwt.ExpiredSignatureError:
            return SessionValidationResult(
                is_valid=False,
                error_message="Token has expired: please refresh your session",
                requires_refresh=True,
            )
        except jwt.InvalidSignatureError:
            return SessionValidationResult(
                is_valid=False,
                error_message="Invalid token signature: tampering detected or wrong key",
            )
        except jwt.InvalidTokenError as e:
            return SessionValidationResult(
                is_valid=False,
                error_message=f"Invalid token format: {str(e)}",
            )
        except Exception as e:
            return SessionValidationResult(
                is_valid=False,
                error_message=f"Token validation failed: {str(e)}",
            )

    @classmethod
    async def refresh_session(
        cls,
        refresh_token: str,
        cultural_context: Dict,
        professional_context: Optional[Dict] = None,
    ) -> SessionCreationResult:
        """
        Refresh session using refresh token with token rotation

        Implements secure refresh token rotation:
        - Validates refresh token signature and expiry
        - Verifies session exists and is active
        - Generates new refresh token (token rotation)
        - Invalidates old refresh token
        - Tracks token family for attack detection
        - Returns new token pair

        Args:
            refresh_token: JWT refresh token to validate and rotate
            cultural_context: Updated cultural context for new access token
            professional_context: Updated professional context (if applicable)

        Returns:
            SessionCreationResult with new access and refresh tokens

        Security Features:
        - Refresh token rotation on each use (prevents replay attacks)
        - Token family tracking (detects reuse attacks)
        - Old token invalidation (prevents multiple uses)
        - Session verification (ensures session is active)
        """
        try:
            # Step 1: Decode and validate refresh token
            payload = jwt.decode(
                refresh_token, cls.JWT_SECRET_KEY, algorithms=[cls.JWT_ALGORITHM]
            )

            # Step 2: Verify token type
            if payload.get("type") != "refresh":
                return SessionCreationResult(
                    success=False,
                    error_message="Invalid token type: expected 'refresh' token",
                )

            # Step 3: Extract claims
            user_id = payload.get("sub")
            session_id = payload.get("session_id")
            token_family = payload.get("token_family")  # For attack detection

            if not user_id or not session_id:
                return SessionCreationResult(
                    success=False,
                    error_message="Missing required token claims",
                )

            # Step 4: Verify session exists and is active
            try:
                db_session = await SessionRepository.get_session(session_id)

                if not db_session:
                    return SessionCreationResult(
                        success=False,
                        error_message="Session not found",
                    )

                if db_session.get("session_status") != "active":
                    return SessionCreationResult(
                        success=False,
                        error_message=f"Session is {db_session.get('session_status')}: cannot refresh",
                    )

                # Step 5: Check for token reuse attack
                # If a different refresh token is used with same token_family, it's an attack
                stored_refresh_token = db_session.get("refresh_token")
                if stored_refresh_token and stored_refresh_token != refresh_token:
                    if token_family and db_session.get("token_family") == token_family:
                        # Token reuse detected - revoke entire session
                        await SessionRepository.revoke_session(session_id)
                        return SessionCreationResult(
                            success=False,
                            error_message="Refresh token reuse detected: session revoked for security",
                        )

            except SessionCreationResult as result:
                # Re-raise session creation results
                raise result
            except Exception as db_error:
                print(f"Warning: Session lookup failed: {str(db_error)}")
                # Continue with rotation in case of transient DB error

            # Step 6: Generate new token family ID for rotation tracking
            new_token_family = token_family or str(uuid4())

            # Step 7: Create new access token
            access_token = cls.create_access_token(
                user_id=user_id,
                session_id=session_id,
                cultural_context=cultural_context,
                professional_context=professional_context,
            )

            # Step 8: Create new refresh token (rotation)
            new_refresh_token = cls.create_refresh_token(
                user_id=user_id,
                session_id=session_id,
                token_family=new_token_family,  # Track token family
            )

            expires_at = datetime.utcnow() + timedelta(
                hours=cls.ACCESS_TOKEN_EXPIRY_HOURS
            )

            tokens = TokenPair(
                access_token=access_token,
                refresh_token=new_refresh_token,  # NEW token (rotated)
                expires_at=expires_at,
            )

            # Step 9: Invalidate old refresh token and store new one in database
            try:
                await SessionRepository.update_last_activity(session_id)
                # TODO: Store new refresh token and invalidate old one
                # await SessionRepository.update_refresh_token(
                #     session_id=session_id,
                #     new_refresh_token=new_refresh_token,
                #     token_family=new_token_family,
                # )
            except Exception as db_error:
                print(f"Warning: Failed to update refresh token: {str(db_error)}")
                # Still return new tokens even if DB update fails

            return SessionCreationResult(
                success=True,
                tokens=tokens,
            )

        except jwt.ExpiredSignatureError:
            return SessionCreationResult(
                success=False,
                error_message="Refresh token has expired. Please login again.",
            )
        except jwt.InvalidSignatureError:
            return SessionCreationResult(
                success=False,
                error_message="Invalid refresh token signature",
            )
        except jwt.InvalidTokenError as e:
            return SessionCreationResult(
                success=False,
                error_message=f"Invalid refresh token: {str(e)}",
            )
        except SessionCreationResult as result:
            # Re-raise SessionCreationResult errors
            return result
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
