"""
Token Expiry Enforcement
Handles JWT access token and refresh token expiry validation and enforcement
"""

from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from pydantic import BaseModel
from enum import Enum
import jwt
import os


class TokenType(str, Enum):
    """Token type classification"""

    ACCESS = "access"  # Short-lived access token (15 minutes)
    REFRESH = "refresh"  # Long-lived refresh token (7 days)


class TokenStatus(str, Enum):
    """Token validation status"""

    VALID = "valid"  # Token is valid and not expired
    EXPIRED = "expired"  # Token has expired
    INVALID = "invalid"  # Token signature/format is invalid
    REVOKED = "revoked"  # Token has been revoked
    NOT_YET_VALID = "not_yet_valid"  # Token not valid yet (nbf claim)


class TokenValidationResult(BaseModel):
    """Token validation result"""

    is_valid: bool
    status: TokenStatus
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    expires_at: Optional[datetime] = None
    issued_at: Optional[datetime] = None
    time_until_expiry: Optional[int] = None  # Seconds until expiry
    error_message: Optional[str] = None
    should_refresh: bool = False  # True if token should be refreshed


class TokenExpiryEnforcer:
    """
    Token Expiry Enforcement

    Validates and enforces expiry rules for JWT access and refresh tokens:
    - Access tokens: 15-minute lifetime
    - Refresh tokens: 7-day lifetime
    - Token signature validation
    - Expiry time enforcement
    - Revocation checking (requires database lookup)
    - Token refresh recommendations
    """

    # Token expiry configuration (in seconds)
    ACCESS_TOKEN_LIFETIME = 900  # 15 minutes
    REFRESH_TOKEN_LIFETIME = 604800  # 7 days (7 * 24 * 60 * 60)

    # Token refresh threshold (when to recommend refresh)
    REFRESH_THRESHOLD = 300  # 5 minutes before expiry

    # JWT configuration
    JWT_SECRET_KEY = os.getenv(
        "JWT_SECRET_KEY", "development-secret-key-change-in-production"
    )
    JWT_ALGORITHM = "HS256"
    JWT_ISSUER = "iraqi-ai-chat-system"

    @staticmethod
    def validate_token(
        token: str,
        token_type: TokenType = TokenType.ACCESS,
        check_revocation: bool = True,
        revoked_tokens: Optional[set[str]] = None,
    ) -> TokenValidationResult:
        """
        Validate JWT token for expiry and signature

        Args:
            token: JWT token string
            token_type: Type of token (access or refresh)
            check_revocation: Whether to check if token is revoked
            revoked_tokens: Set of revoked token IDs (from database)

        Returns:
            TokenValidationResult with validation status
        """
        try:
            # Decode and verify token
            payload = jwt.decode(
                token,
                TokenExpiryEnforcer.JWT_SECRET_KEY,
                algorithms=[TokenExpiryEnforcer.JWT_ALGORITHM],
                issuer=TokenExpiryEnforcer.JWT_ISSUER,
                options={
                    "verify_signature": True,
                    "verify_exp": True,  # Automatically checks expiry
                    "verify_iat": True,  # Verify issued at
                    "verify_nbf": True,  # Verify not before
                },
            )

            # Extract token claims
            user_id = payload.get("sub")
            session_id = payload.get("session_id")
            token_id = payload.get("jti")  # JWT ID for revocation checking
            exp = payload.get("exp")
            iat = payload.get("iat")

            if not user_id:
                return TokenValidationResult(
                    is_valid=False,
                    status=TokenStatus.INVALID,
                    error_message="Token missing user ID (sub claim)",
                )

            # Convert timestamps to datetime
            expires_at = datetime.fromtimestamp(exp, tz=timezone.utc) if exp else None
            issued_at = datetime.fromtimestamp(iat, tz=timezone.utc) if iat else None

            # Calculate time until expiry
            now = datetime.now(timezone.utc)
            time_until_expiry = None
            should_refresh = False

            if expires_at:
                time_until_expiry = int((expires_at - now).total_seconds())

                # Recommend refresh if close to expiry (only for access tokens)
                if (
                    token_type == TokenType.ACCESS
                    and time_until_expiry <= TokenExpiryEnforcer.REFRESH_THRESHOLD
                    and time_until_expiry > 0
                ):
                    should_refresh = True

            # Check if token is revoked (requires database lookup)
            if check_revocation and revoked_tokens and token_id in revoked_tokens:
                return TokenValidationResult(
                    is_valid=False,
                    status=TokenStatus.REVOKED,
                    user_id=user_id,
                    session_id=session_id,
                    expires_at=expires_at,
                    issued_at=issued_at,
                    time_until_expiry=time_until_expiry,
                    error_message="Token has been revoked",
                )

            return TokenValidationResult(
                is_valid=True,
                status=TokenStatus.VALID,
                user_id=user_id,
                session_id=session_id,
                expires_at=expires_at,
                issued_at=issued_at,
                time_until_expiry=time_until_expiry,
                should_refresh=should_refresh,
            )

        except jwt.ExpiredSignatureError:
            # Token has expired
            return TokenValidationResult(
                is_valid=False,
                status=TokenStatus.EXPIRED,
                error_message="Token has expired",
            )

        except jwt.ImmatureSignatureError:
            # Token not valid yet (nbf claim)
            return TokenValidationResult(
                is_valid=False,
                status=TokenStatus.NOT_YET_VALID,
                error_message="Token not yet valid",
            )

        except jwt.InvalidTokenError as e:
            # Invalid token signature or format
            return TokenValidationResult(
                is_valid=False,
                status=TokenStatus.INVALID,
                error_message=f"Invalid token: {str(e)}",
            )

        except Exception as e:
            # Unexpected error
            return TokenValidationResult(
                is_valid=False,
                status=TokenStatus.INVALID,
                error_message=f"Token validation failed: {str(e)}",
            )

    @staticmethod
    def generate_token(
        user_id: str,
        session_id: str,
        token_type: TokenType = TokenType.ACCESS,
        cultural_context: Optional[Dict] = None,
    ) -> str:
        """
        Generate JWT token with expiry

        Args:
            user_id: User ID (sub claim)
            session_id: Session ID
            token_type: Type of token to generate
            cultural_context: Optional cultural context metadata

        Returns:
            JWT token string
        """
        now = datetime.now(timezone.utc)

        # Set expiry based on token type
        if token_type == TokenType.ACCESS:
            expires_at = now + timedelta(
                seconds=TokenExpiryEnforcer.ACCESS_TOKEN_LIFETIME
            )
        else:  # REFRESH
            expires_at = now + timedelta(
                seconds=TokenExpiryEnforcer.REFRESH_TOKEN_LIFETIME
            )

        # Build JWT payload
        payload = {
            "sub": user_id,  # Subject (user ID)
            "session_id": session_id,
            "type": token_type.value,
            "iat": int(now.timestamp()),  # Issued at
            "exp": int(expires_at.timestamp()),  # Expiry time
            "nbf": int(now.timestamp()),  # Not before
            "iss": TokenExpiryEnforcer.JWT_ISSUER,  # Issuer
            "jti": f"{session_id}-{token_type.value}-{int(now.timestamp())}",  # JWT ID for revocation
        }

        # Add cultural context if provided
        if cultural_context:
            payload["cultural_context"] = cultural_context

        # Generate and return token
        token = jwt.encode(
            payload,
            TokenExpiryEnforcer.JWT_SECRET_KEY,
            algorithm=TokenExpiryEnforcer.JWT_ALGORITHM,
        )

        return token

    @staticmethod
    def should_enforce_expiry(
        token_validation: TokenValidationResult,
        grace_period_seconds: int = 0,
    ) -> bool:
        """
        Determine if token expiry should be enforced

        Args:
            token_validation: Token validation result
            grace_period_seconds: Grace period after expiry (default: 0)

        Returns:
            True if expiry should be enforced (token invalid/expired)
        """
        # Always enforce if token is invalid or revoked
        if token_validation.status in [TokenStatus.INVALID, TokenStatus.REVOKED]:
            return True

        # Enforce if token is expired
        if token_validation.status == TokenStatus.EXPIRED:
            return True

        # Check grace period if token is valid but close to expiry
        if token_validation.time_until_expiry is not None:
            if token_validation.time_until_expiry < -grace_period_seconds:
                return True

        return False

    @staticmethod
    def get_expiry_error_message(
        token_validation: TokenValidationResult,
        token_type: TokenType = TokenType.ACCESS,
    ) -> str:
        """
        Get user-friendly error message for token expiry

        Args:
            token_validation: Token validation result
            token_type: Type of token

        Returns:
            User-friendly error message
        """
        if token_validation.status == TokenStatus.EXPIRED:
            if token_type == TokenType.ACCESS:
                return "Your session has expired. Please log in again or refresh your token."
            else:  # REFRESH
                return "Your refresh token has expired. Please log in again."

        if token_validation.status == TokenStatus.REVOKED:
            return "Your session has been revoked. Please log in again."

        if token_validation.status == TokenStatus.INVALID:
            return "Invalid authentication token. Please log in again."

        if token_validation.status == TokenStatus.NOT_YET_VALID:
            return "Authentication token not yet valid. Please try again in a moment."

        return "Authentication failed. Please log in again."

    @staticmethod
    def check_session_timeout(
        last_activity: datetime,
        timeout_minutes: int = 30,
    ) -> Dict[str, Any]:
        """
        Check if session has timed out due to inactivity

        Args:
            last_activity: Last activity timestamp
            timeout_minutes: Inactivity timeout in minutes

        Returns:
            Dict with timeout status and details
        """
        now = datetime.now(timezone.utc)

        # Ensure last_activity is timezone-aware
        if last_activity.tzinfo is None:
            last_activity = last_activity.replace(tzinfo=timezone.utc)

        time_since_activity = (now - last_activity).total_seconds()
        timeout_seconds = timeout_minutes * 60

        # Include boundary: session at exact timeout threshold is considered timed out
        is_timed_out = time_since_activity >= timeout_seconds

        return {
            "is_timed_out": is_timed_out,
            "time_since_activity": int(time_since_activity),
            "timeout_threshold": timeout_seconds,
            "minutes_since_activity": int(time_since_activity / 60),
            "timeout_message": (
                f"Session timed out after {timeout_minutes} minutes of inactivity"
                if is_timed_out
                else None
            ),
        }

    @staticmethod
    def validate_token_pair(
        access_token: str,
        refresh_token: str,
        revoked_tokens: Optional[set[str]] = None,
    ) -> Dict[str, TokenValidationResult]:
        """
        Validate both access and refresh tokens

        Args:
            access_token: Access token string
            refresh_token: Refresh token string
            revoked_tokens: Set of revoked token IDs

        Returns:
            Dict with validation results for both tokens
        """
        access_validation = TokenExpiryEnforcer.validate_token(
            access_token,
            token_type=TokenType.ACCESS,
            revoked_tokens=revoked_tokens,
        )

        refresh_validation = TokenExpiryEnforcer.validate_token(
            refresh_token,
            token_type=TokenType.REFRESH,
            revoked_tokens=revoked_tokens,
        )

        return {
            "access": access_validation,
            "refresh": refresh_validation,
        }
