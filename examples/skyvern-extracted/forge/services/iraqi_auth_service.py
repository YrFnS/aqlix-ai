"""
Iraqi Institution Authentication Service for Skyvern Enterprise
Enhanced security for Iraqi government portals and Islamic banking integration
"""

import asyncio
import hashlib
import hmac
import json
import logging
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, List, Optional, Tuple, Union
from uuid import uuid4

import jwt
from passlib.context import CryptContext
from pydantic import BaseModel, Field, ValidationError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..exceptions import AuthenticationError, IraqiComplianceError
from ..models import Organization, IraqiInstitution, AuthToken
from ..utils import get_current_time


logger = logging.getLogger(__name__)


class IraqiInstitutionConfig(BaseModel):
    """Configuration for Iraqi institution authentication"""

    institution_type: str = Field(...)  # government, banking, education, healthcare
    ministry_code: Optional[str] = None  # For government institutions
    license_number: Optional[str] = None  # Business license
    islamic_banking_certified: bool = Field(default=False)
    security_clearance_level: str = Field(
        default="public"
    )  # public, restricted, confidential, secret

    # Authentication requirements
    require_two_factor: bool = Field(default=True)
    require_biometric: bool = Field(default=False)
    session_timeout_minutes: int = Field(default=30)
    max_concurrent_sessions: int = Field(default=3)

    # Iraqi-specific validations
    require_iraqi_citizenship: bool = Field(default=True)
    require_security_clearance: bool = Field(default=False)
    allow_government_portal_access: bool = Field(default=False)


class IraqiAuthCredentials(BaseModel):
    """Iraqi-specific authentication credentials"""

    # Standard credentials
    username: str = Field(...)
    password: str = Field(...)

    # Iraqi-specific fields
    national_id: Optional[str] = None  # Iraqi national ID
    passport_number: Optional[str] = None
    institution_id: str = Field(...)
    department: Optional[str] = None

    # Two-factor authentication
    totp_code: Optional[str] = None
    sms_code: Optional[str] = None
    biometric_hash: Optional[str] = None

    # Session information
    client_ip: str = Field(...)
    user_agent: str = Field(...)
    location: Optional[Dict[str, Any]] = None


class IraqiAuthResult(BaseModel):
    """Result of Iraqi institution authentication"""

    success: bool
    user_id: Optional[str] = None
    institution_id: Optional[str] = None
    session_token: Optional[str] = None
    permissions: List[str] = Field(default_factory=list)

    # Iraqi-specific fields
    security_clearance: Optional[str] = None
    islamic_compliance_level: str = Field(default="standard")
    government_portal_access: bool = Field(default=False)
    ministry_access: List[str] = Field(default_factory=list)

    # Session information
    expires_at: Optional[datetime] = None
    max_sessions_reached: bool = Field(default=False)

    # Error information
    error_code: Optional[str] = None
    error_message: Optional[str] = None


class IraqiInstitutionAuthService:
    """Enhanced authentication service for Iraqi institutions"""

    def __init__(self, db_session: AsyncSession, jwt_secret: str, encryption_key: str):
        self.db_session = db_session
        self.jwt_secret = jwt_secret
        self.encryption_key = encryption_key
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

        # Cache for authentication results (1 hour TTL)
        self._auth_cache: Dict[str, Tuple[IraqiAuthResult, datetime]] = {}

    async def authenticate_iraqi_institution(
        self,
        credentials: IraqiAuthCredentials,
        institution_config: IraqiInstitutionConfig,
    ) -> IraqiAuthResult:
        """Authenticate user against Iraqi institution requirements"""

        try:
            # Check cache first
            cache_key = self._generate_cache_key(credentials)
            cached_result = self._get_cached_auth(cache_key)
            if cached_result:
                return cached_result

            # Validate Iraqi-specific requirements
            await self._validate_iraqi_requirements(credentials, institution_config)

            # Authenticate user credentials
            user = await self._authenticate_user_credentials(credentials)
            if not user:
                return IraqiAuthResult(
                    success=False,
                    error_code="invalid_credentials",
                    error_message="Invalid username or password",
                )

            # Validate institution membership
            institution = await self._validate_institution_membership(
                user["user_id"], credentials.institution_id
            )
            if not institution:
                return IraqiAuthResult(
                    success=False,
                    error_code="invalid_institution",
                    error_message="User not authorized for this institution",
                )

            # Check session limits
            if await self._check_session_limits(user["user_id"], institution_config):
                return IraqiAuthResult(
                    success=False,
                    max_sessions_reached=True,
                    error_code="max_sessions",
                    error_message="Maximum concurrent sessions reached",
                )

            # Validate two-factor authentication
            if institution_config.require_two_factor:
                if not await self._validate_two_factor(credentials, user):
                    return IraqiAuthResult(
                        success=False,
                        error_code="invalid_2fa",
                        error_message="Two-factor authentication required or invalid",
                    )

            # Validate biometric authentication
            if institution_config.require_biometric:
                if not await self._validate_biometric(credentials, user):
                    return IraqiAuthResult(
                        success=False,
                        error_code="invalid_biometric",
                        error_message="Biometric authentication failed",
                    )

            # Check Iraqi citizenship if required
            if institution_config.require_iraqi_citizenship:
                if not await self._validate_iraqi_citizenship(user):
                    return IraqiAuthResult(
                        success=False,
                        error_code="citizenship_required",
                        error_message="Iraqi citizenship required",
                    )

            # Validate security clearance
            if institution_config.require_security_clearance:
                clearance_valid = await self._validate_security_clearance(
                    user, institution_config.security_clearance_level
                )
                if not clearance_valid:
                    return IraqiAuthResult(
                        success=False,
                        error_code="insufficient_clearance",
                        error_message="Insufficient security clearance",
                    )

            # Generate session token
            session_token = await self._generate_session_token(
                user, institution, institution_config
            )

            # Get user permissions
            permissions = await self._get_user_permissions(
                user["user_id"], credentials.institution_id
            )

            # Create successful auth result
            auth_result = IraqiAuthResult(
                success=True,
                user_id=user["user_id"],
                institution_id=credentials.institution_id,
                session_token=session_token,
                permissions=permissions,
                security_clearance=user.get("security_clearance"),
                islamic_compliance_level=institution.get(
                    "islamic_compliance_level", "standard"
                ),
                government_portal_access=institution_config.allow_government_portal_access,
                ministry_access=await self._get_ministry_access(user, institution),
                expires_at=datetime.now(timezone.utc)
                + timedelta(minutes=institution_config.session_timeout_minutes),
            )

            # Cache result
            self._cache_auth_result(cache_key, auth_result)

            # Log successful authentication
            await self._log_auth_event(
                "auth_success", user["user_id"], credentials, institution_config
            )

            return auth_result

        except Exception as e:
            logger.error(f"Authentication error: {e}")
            await self._log_auth_event(
                "auth_error", None, credentials, institution_config, str(e)
            )

            return IraqiAuthResult(
                success=False,
                error_code="auth_system_error",
                error_message="Authentication system error",
            )

    async def _validate_iraqi_requirements(
        self, credentials: IraqiAuthCredentials, config: IraqiInstitutionConfig
    ) -> None:
        """Validate Iraqi-specific authentication requirements"""

        # Validate national ID format if provided
        if credentials.national_id:
            if not await self._validate_iraqi_national_id(credentials.national_id):
                raise AuthenticationError("Invalid Iraqi national ID format")

        # Validate institution type permissions
        if config.institution_type == "government":
            if not config.allow_government_portal_access:
                raise AuthenticationError("Government portal access not configured")

        # Validate Islamic banking requirements
        if config.institution_type == "banking" and config.islamic_banking_certified:
            if not await self._validate_islamic_banking_compliance(credentials):
                raise IraqiComplianceError(
                    "Islamic banking compliance validation failed"
                )

    async def _authenticate_user_credentials(
        self, credentials: IraqiAuthCredentials
    ) -> Optional[Dict[str, Any]]:
        """Authenticate basic user credentials"""

        # Query user from database
        query = (
            select("*")
            .where("username = :username AND active = true")
            .params(username=credentials.username)
        )

        # This would be actual database query
        # For now, returning mock user data
        mock_user = {
            "user_id": str(uuid4()),
            "username": credentials.username,
            "password_hash": self.pwd_context.hash("mock_password"),
            "national_id": credentials.national_id,
            "security_clearance": "public",
            "iraqi_citizenship": True,
            "active": True,
        }

        # Verify password
        if self.pwd_context.verify(credentials.password, mock_user["password_hash"]):
            return mock_user

        return None

    async def _validate_institution_membership(
        self, user_id: str, institution_id: str
    ) -> Optional[Dict[str, Any]]:
        """Validate user membership in institution"""

        # Mock institution data
        mock_institution = {
            "institution_id": institution_id,
            "institution_name": "Iraqi Ministry of Interior",
            "institution_type": "government",
            "islamic_compliance_level": "high",
            "security_classification": "restricted",
        }

        return mock_institution

    async def _check_session_limits(
        self, user_id: str, config: IraqiInstitutionConfig
    ) -> bool:
        """Check if user has reached maximum concurrent sessions"""

        # Query active sessions for user
        # This would check actual session database
        active_sessions = 0  # Mock value

        return active_sessions >= config.max_concurrent_sessions

    async def _validate_two_factor(
        self, credentials: IraqiAuthCredentials, user: Dict[str, Any]
    ) -> bool:
        """Validate two-factor authentication"""

        # Validate TOTP code if provided
        if credentials.totp_code:
            return await self._validate_totp(credentials.totp_code, user)

        # Validate SMS code if provided
        if credentials.sms_code:
            return await self._validate_sms_code(credentials.sms_code, user)

        return False

    async def _validate_totp(self, totp_code: str, user: Dict[str, Any]) -> bool:
        """Validate Time-based One-Time Password"""

        # This would integrate with TOTP library like pyotp
        # Mock validation for now
        return len(totp_code) == 6 and totp_code.isdigit()

    async def _validate_sms_code(self, sms_code: str, user: Dict[str, Any]) -> bool:
        """Validate SMS verification code"""

        # This would integrate with SMS service
        # Mock validation for now
        return len(sms_code) == 6 and sms_code.isdigit()

    async def _validate_biometric(
        self, credentials: IraqiAuthCredentials, user: Dict[str, Any]
    ) -> bool:
        """Validate biometric authentication"""

        if not credentials.biometric_hash:
            return False

        # This would integrate with biometric verification service
        # Mock validation for now
        stored_biometric = user.get("biometric_hash")
        return stored_biometric and credentials.biometric_hash == stored_biometric

    async def _validate_iraqi_citizenship(self, user: Dict[str, Any]) -> bool:
        """Validate Iraqi citizenship"""

        return user.get("iraqi_citizenship", False)

    async def _validate_security_clearance(
        self, user: Dict[str, Any], required_level: str
    ) -> bool:
        """Validate security clearance level"""

        clearance_levels = {
            "public": 0,
            "restricted": 1,
            "confidential": 2,
            "secret": 3,
            "top_secret": 4,
        }

        user_level = clearance_levels.get(user.get("security_clearance", "public"), 0)
        required_level_num = clearance_levels.get(required_level, 0)

        return user_level >= required_level_num

    async def _validate_iraqi_national_id(self, national_id: str) -> bool:
        """Validate Iraqi national ID format"""

        # Iraqi national ID format validation
        # This is a simplified check - real implementation would be more complex
        if len(national_id) != 10:
            return False

        # Should be all digits
        if not national_id.isdigit():
            return False

        # Additional checksum validation would go here
        return True

    async def _validate_islamic_banking_compliance(
        self, credentials: IraqiAuthCredentials
    ) -> bool:
        """Validate Islamic banking compliance requirements"""

        # This would implement Islamic banking compliance checks
        # For now, returning True as placeholder
        return True

    async def _generate_session_token(
        self,
        user: Dict[str, Any],
        institution: Dict[str, Any],
        config: IraqiInstitutionConfig,
    ) -> str:
        """Generate JWT session token with Iraqi-specific claims"""

        now = datetime.now(timezone.utc)
        expires_at = now + timedelta(minutes=config.session_timeout_minutes)

        payload = {
            "user_id": user["user_id"],
            "username": user["username"],
            "institution_id": institution["institution_id"],
            "institution_type": config.institution_type,
            "security_clearance": user.get("security_clearance"),
            "iraqi_citizenship": user.get("iraqi_citizenship", False),
            "islamic_compliance": institution.get("islamic_compliance_level"),
            "government_access": config.allow_government_portal_access,
            "iat": int(now.timestamp()),
            "exp": int(expires_at.timestamp()),
            "jti": str(uuid4()),  # JWT ID for revocation
        }

        return jwt.encode(payload, self.jwt_secret, algorithm="HS256")

    async def _get_user_permissions(
        self, user_id: str, institution_id: str
    ) -> List[str]:
        """Get user permissions for institution"""

        # Mock permissions - real implementation would query database
        return [
            "read_documents",
            "submit_forms",
            "view_status",
            "download_certificates",
        ]

    async def _get_ministry_access(
        self, user: Dict[str, Any], institution: Dict[str, Any]
    ) -> List[str]:
        """Get ministry portal access permissions"""

        if institution.get("institution_type") != "government":
            return []

        # Mock ministry access - real implementation would check user roles
        return ["ministry_of_interior", "ministry_of_trade", "ministry_of_justice"]

    def _generate_cache_key(self, credentials: IraqiAuthCredentials) -> str:
        """Generate cache key for authentication result"""

        key_data = f"{credentials.username}:{credentials.institution_id}:{credentials.client_ip}"
        return hashlib.sha256(key_data.encode()).hexdigest()

    def _get_cached_auth(self, cache_key: str) -> Optional[IraqiAuthResult]:
        """Get cached authentication result if valid"""

        if cache_key in self._auth_cache:
            result, cached_at = self._auth_cache[cache_key]

            # Check if cache is still valid (1 hour TTL)
            if datetime.now(timezone.utc) - cached_at < timedelta(hours=1):
                return result
            else:
                # Remove expired cache entry
                del self._auth_cache[cache_key]

        return None

    def _cache_auth_result(self, cache_key: str, result: IraqiAuthResult) -> None:
        """Cache authentication result"""

        self._auth_cache[cache_key] = (result, datetime.now(timezone.utc))

    async def _log_auth_event(
        self,
        event_type: str,
        user_id: Optional[str],
        credentials: IraqiAuthCredentials,
        config: IraqiInstitutionConfig,
        error: Optional[str] = None,
    ) -> None:
        """Log authentication events for security audit"""

        log_data = {
            "event_type": event_type,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "user_id": user_id,
            "username": credentials.username,
            "institution_id": credentials.institution_id,
            "institution_type": config.institution_type,
            "client_ip": credentials.client_ip,
            "user_agent": credentials.user_agent,
            "national_id": credentials.national_id[:6] + "****"
            if credentials.national_id
            else None,
            "two_factor_used": bool(credentials.totp_code or credentials.sms_code),
            "biometric_used": bool(credentials.biometric_hash),
            "error": error,
        }

        logger.info(f"Iraqi auth event: {json.dumps(log_data)}")

    async def validate_session_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Validate JWT session token"""

        try:
            payload = jwt.decode(token, self.jwt_secret, algorithms=["HS256"])

            # Check if token is expired
            if datetime.now(timezone.utc).timestamp() > payload.get("exp", 0):
                return None

            return payload

        except jwt.InvalidTokenError:
            return None

    async def revoke_session_token(self, token: str) -> bool:
        """Revoke JWT session token"""

        try:
            payload = jwt.decode(token, self.jwt_secret, algorithms=["HS256"])
            jti = payload.get("jti")

            if jti:
                # Add JTI to revocation list (would be stored in Redis/database)
                # For now, just log the revocation
                logger.info(f"Token revoked: {jti}")
                return True

        except jwt.InvalidTokenError:
            pass

        return False

    async def cleanup_expired_sessions(self) -> None:
        """Cleanup expired authentication cache entries"""

        now = datetime.now(timezone.utc)
        expired_keys = []

        for cache_key, (result, cached_at) in self._auth_cache.items():
            if now - cached_at > timedelta(hours=1):
                expired_keys.append(cache_key)

        for key in expired_keys:
            del self._auth_cache[key]

        logger.info(f"Cleaned up {len(expired_keys)} expired auth cache entries")
