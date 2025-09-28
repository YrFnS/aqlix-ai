"""
Iraqi OAuth Provider - Enterprise OAuth2 security with Islamic compliance
Part of Gemini CLI extraction with Iraqi government authentication integration

Implements enterprise-grade OAuth2 patterns with cultural validation, government
service integration, and comprehensive security measures for Iraqi systems.
"""

from typing import Dict, List, Optional, Union, Any, Tuple, Callable
from dataclasses import dataclass, field
from enum import Enum
import asyncio
import json
import time
from datetime import datetime, timedelta
import os
import hashlib
import hmac
import base64
import secrets
import logging
from urllib.parse import urlencode, parse_qs, urlparse
import aiohttp
import jwt
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes


class IraqiOAuthScope(Enum):
    """OAuth scopes for Iraqi government services"""

    BASIC_PROFILE = "basic_profile"
    CITIZEN_SERVICES = "citizen_services"
    MINISTRY_ACCESS = "ministry_access"
    GOVERNMENT_DATA = "government_data"
    CIVIL_REGISTRY = "civil_registry"
    TAX_SERVICES = "tax_services"
    HEALTH_RECORDS = "health_records"
    EDUCATION_PORTAL = "education_portal"
    JUSTICE_SYSTEM = "justice_system"


class TokenType(Enum):
    """Token types for Iraqi OAuth system"""

    ACCESS_TOKEN = "access_token"
    REFRESH_TOKEN = "refresh_token"
    ID_TOKEN = "id_token"
    CITIZEN_TOKEN = "citizen_token"
    MINISTRY_TOKEN = "ministry_token"


class GrantType(Enum):
    """OAuth grant types supported"""

    AUTHORIZATION_CODE = "authorization_code"
    REFRESH_TOKEN = "refresh_token"
    CLIENT_CREDENTIALS = "client_credentials"
    CITIZEN_CREDENTIALS = "citizen_credentials"
    GOVERNMENT_ASSERTION = "government_assertion"


@dataclass
class IraqiOAuthConfig:
    """Comprehensive OAuth configuration for Iraqi services"""

    # Basic OAuth settings
    client_id: str
    client_secret: str
    authorization_url: str
    token_url: str
    userinfo_url: str

    # Iraqi-specific endpoints
    citizen_verification_url: str
    ministry_validation_url: str
    cultural_compliance_url: str
    islamic_validation_url: str

    # Scopes and permissions
    default_scopes: List[IraqiOAuthScope] = field(
        default_factory=lambda: [
            IraqiOAuthScope.BASIC_PROFILE,
            IraqiOAuthScope.CITIZEN_SERVICES,
        ]
    )

    # Cultural settings
    language: str = "ar"
    cultural_compliance_required: bool = True
    islamic_validation_required: bool = True
    ministry_approval_required: bool = False

    # Security settings
    use_pkce: bool = True
    require_state: bool = True
    token_encryption: bool = True
    audit_logging: bool = True
    session_timeout: int = 3600  # 1 hour

    # Government integration
    government_domain: Optional[str] = None
    ministry_code: Optional[str] = None
    security_clearance: str = "public"

    # Technical settings
    redirect_uris: List[str] = field(default_factory=list)
    response_types: List[str] = field(default_factory=lambda: ["code"])
    token_endpoint_auth_methods: List[str] = field(
        default_factory=lambda: ["client_secret_post"]
    )


@dataclass
class IraqiOAuthToken:
    """OAuth token with Iraqi cultural and security metadata"""

    access_token: str
    token_type: str = "Bearer"
    expires_in: Optional[int] = None
    refresh_token: Optional[str] = None
    scope: Optional[str] = None

    # Iraqi-specific fields
    citizen_id: Optional[str] = None
    ministry_code: Optional[str] = None
    governorate: Optional[str] = None
    security_clearance: str = "public"

    # Cultural validation
    cultural_compliance_score: float = 0.0
    islamic_compliance_verified: bool = False
    arabic_language_preference: bool = True

    # Security metadata
    issued_at: datetime = field(default_factory=datetime.now)
    expires_at: Optional[datetime] = None
    session_id: Optional[str] = None
    encryption_key_id: Optional[str] = None

    def __post_init__(self):
        if self.expires_in and not self.expires_at:
            self.expires_at = self.issued_at + timedelta(seconds=self.expires_in)

    def is_expired(self) -> bool:
        """Check if token is expired"""
        if not self.expires_at:
            return False
        return datetime.now() > self.expires_at

    def time_until_expiry(self) -> Optional[timedelta]:
        """Get time until token expires"""
        if not self.expires_at:
            return None
        return self.expires_at - datetime.now()


class IraqiOAuthProvider:
    """
    Enterprise OAuth Provider for Iraqi Government Services

    Provides secure OAuth2 authentication with cultural validation,
    Islamic compliance checking, and comprehensive audit logging.
    """

    def __init__(self, config: IraqiOAuthConfig):
        self.config = config
        self.logger = logging.getLogger(__name__)

        # Security components
        self.token_storage = IraqiTokenStorage(
            encryption_enabled=config.token_encryption,
            audit_logging=config.audit_logging,
        )

        self.cultural_validator = IraqiCulturalValidator(
            language=config.language,
            compliance_required=config.cultural_compliance_required,
        )

        self.islamic_validator = IraqiIslamicValidator(
            validation_required=config.islamic_validation_required
        )

        # Government integration
        self.government_validator = IraqiGovernmentValidator(
            ministry_code=config.ministry_code,
            security_clearance=config.security_clearance,
        )

        # Audit logger
        if config.audit_logging:
            self.audit_logger = IraqiOAuthAuditLogger(
                ministry=config.ministry_code,
                government_domain=config.government_domain,
            )

        # PKCE support
        self.pkce_verifiers = {}  # code_verifier storage

        # Active sessions
        self.active_sessions = {}

    async def start_authorization_flow(
        self,
        redirect_uri: str,
        scopes: Optional[List[IraqiOAuthScope]] = None,
        state: Optional[str] = None,
        citizen_id: Optional[str] = None,
    ) -> Tuple[str, Dict[str, Any]]:
        """
        Start OAuth authorization flow with Iraqi enhancements

        Args:
            redirect_uri: OAuth redirect URI
            scopes: Requested scopes
            state: OAuth state parameter
            citizen_id: Iraqi citizen ID for validation

        Returns:
            Tuple of (authorization_url, flow_metadata)
        """
        try:
            # Validate redirect URI
            if redirect_uri not in self.config.redirect_uris:
                raise ValueError(f"Invalid redirect URI: {redirect_uri}")

            # Use default scopes if none provided
            if not scopes:
                scopes = self.config.default_scopes

            # Generate state if not provided
            if not state and self.config.require_state:
                state = secrets.token_urlsafe(32)

            # Generate PKCE parameters if enabled
            pkce_params = {}
            if self.config.use_pkce:
                code_verifier = secrets.token_urlsafe(128)
                code_challenge = (
                    base64.urlsafe_b64encode(
                        hashlib.sha256(code_verifier.encode()).digest()
                    )
                    .decode()
                    .rstrip("=")
                )

                pkce_params = {
                    "code_challenge": code_challenge,
                    "code_challenge_method": "S256",
                }

                # Store verifier for later use
                self.pkce_verifiers[state] = code_verifier

            # Prepare authorization parameters
            auth_params = {
                "response_type": "code",
                "client_id": self.config.client_id,
                "redirect_uri": redirect_uri,
                "scope": " ".join([scope.value for scope in scopes]),
                "state": state,
                **pkce_params,
            }

            # Add Iraqi-specific parameters
            if citizen_id:
                auth_params["citizen_id"] = citizen_id

            if self.config.ministry_code:
                auth_params["ministry"] = self.config.ministry_code

            if self.config.language:
                auth_params["lang"] = self.config.language

            # Add cultural compliance requirements
            if self.config.cultural_compliance_required:
                auth_params["cultural_validation"] = "required"

            if self.config.islamic_validation_required:
                auth_params["islamic_compliance"] = "required"

            # Build authorization URL
            authorization_url = (
                f"{self.config.authorization_url}?{urlencode(auth_params)}"
            )

            # Create flow metadata
            flow_metadata = {
                "state": state,
                "redirect_uri": redirect_uri,
                "scopes": [scope.value for scope in scopes],
                "citizen_id": citizen_id,
                "ministry_code": self.config.ministry_code,
                "pkce_enabled": self.config.use_pkce,
                "started_at": datetime.now().isoformat(),
                "session_id": self._generate_session_id(),
            }

            # Store session
            self.active_sessions[state] = flow_metadata

            # Log authorization start
            if self.config.audit_logging:
                await self.audit_logger.log_authorization_start(
                    state=state,
                    client_id=self.config.client_id,
                    scopes=scopes,
                    citizen_id=citizen_id,
                )

            self.logger.info(f"Started OAuth authorization flow for state: {state}")
            return authorization_url, flow_metadata

        except Exception as e:
            self.logger.error(f"Authorization flow start error: {str(e)}")
            raise

    async def exchange_code_for_tokens(
        self, authorization_code: str, redirect_uri: str, state: Optional[str] = None
    ) -> IraqiOAuthToken:
        """
        Exchange authorization code for tokens with Iraqi validation

        Args:
            authorization_code: OAuth authorization code
            redirect_uri: OAuth redirect URI
            state: OAuth state parameter

        Returns:
            Iraqi OAuth token with metadata
        """
        try:
            # Validate state and session
            if state and state not in self.active_sessions:
                raise ValueError("Invalid or expired OAuth state")

            session_metadata = self.active_sessions.get(state, {})

            # Prepare token request
            token_params = {
                "grant_type": GrantType.AUTHORIZATION_CODE.value,
                "code": authorization_code,
                "redirect_uri": redirect_uri,
                "client_id": self.config.client_id,
                "client_secret": self.config.client_secret,
            }

            # Add PKCE verifier if used
            if self.config.use_pkce and state in self.pkce_verifiers:
                token_params["code_verifier"] = self.pkce_verifiers[state]

            # Exchange code for tokens
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    self.config.token_url,
                    data=token_params,
                    headers={"Content-Type": "application/x-www-form-urlencoded"},
                ) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        raise ValueError(f"Token exchange failed: {error_text}")

                    token_data = await response.json()

            # Create Iraqi OAuth token
            oauth_token = IraqiOAuthToken(
                access_token=token_data["access_token"],
                token_type=token_data.get("token_type", "Bearer"),
                expires_in=token_data.get("expires_in"),
                refresh_token=token_data.get("refresh_token"),
                scope=token_data.get("scope"),
                citizen_id=session_metadata.get("citizen_id"),
                ministry_code=session_metadata.get("ministry_code"),
                security_clearance=self.config.security_clearance,
                session_id=session_metadata.get("session_id"),
            )

            # Perform Iraqi-specific validations
            await self._validate_token_culturally(oauth_token)
            await self._validate_token_islamically(oauth_token)
            await self._validate_token_governmentally(oauth_token)

            # Store token securely
            await self.token_storage.store_token(oauth_token)

            # Clean up PKCE verifier
            if self.config.use_pkce and state in self.pkce_verifiers:
                del self.pkce_verifiers[state]

            # Clean up session
            if state in self.active_sessions:
                del self.active_sessions[state]

            # Log token exchange
            if self.config.audit_logging:
                await self.audit_logger.log_token_exchange(
                    state=state,
                    token_type=oauth_token.token_type,
                    scopes=oauth_token.scope,
                    citizen_id=oauth_token.citizen_id,
                )

            self.logger.info(
                f"Successfully exchanged code for tokens: {oauth_token.session_id}"
            )
            return oauth_token

        except Exception as e:
            self.logger.error(f"Token exchange error: {str(e)}")
            raise

    async def refresh_token(self, refresh_token: str) -> IraqiOAuthToken:
        """
        Refresh access token with Iraqi validation

        Args:
            refresh_token: OAuth refresh token

        Returns:
            New Iraqi OAuth token
        """
        try:
            # Prepare refresh request
            refresh_params = {
                "grant_type": GrantType.REFRESH_TOKEN.value,
                "refresh_token": refresh_token,
                "client_id": self.config.client_id,
                "client_secret": self.config.client_secret,
            }

            # Exchange refresh token for new access token
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    self.config.token_url,
                    data=refresh_params,
                    headers={"Content-Type": "application/x-www-form-urlencoded"},
                ) as response:
                    if response.status != 200:
                        error_text = await response.text()
                        raise ValueError(f"Token refresh failed: {error_text}")

                    token_data = await response.json()

            # Create new token
            new_token = IraqiOAuthToken(
                access_token=token_data["access_token"],
                token_type=token_data.get("token_type", "Bearer"),
                expires_in=token_data.get("expires_in"),
                refresh_token=token_data.get("refresh_token", refresh_token),
                scope=token_data.get("scope"),
                security_clearance=self.config.security_clearance,
                session_id=self._generate_session_id(),
            )

            # Perform validations
            await self._validate_token_culturally(new_token)
            await self._validate_token_islamically(new_token)

            # Store new token
            await self.token_storage.store_token(new_token)

            # Log token refresh
            if self.config.audit_logging:
                await self.audit_logger.log_token_refresh(
                    old_token=refresh_token[:8] + "...",
                    new_token=new_token.access_token[:8] + "...",
                    session_id=new_token.session_id,
                )

            self.logger.info(f"Successfully refreshed token: {new_token.session_id}")
            return new_token

        except Exception as e:
            self.logger.error(f"Token refresh error: {str(e)}")
            raise

    async def validate_token(self, access_token: str) -> Tuple[bool, Dict[str, Any]]:
        """
        Validate access token with Iraqi requirements

        Args:
            access_token: OAuth access token

        Returns:
            Tuple of (is_valid, token_info)
        """
        try:
            # Retrieve token from storage
            token = await self.token_storage.get_token(access_token)
            if not token:
                return False, {"error": "Token not found"}

            # Check expiration
            if token.is_expired():
                return False, {"error": "Token expired"}

            # Validate with authorization server
            async with aiohttp.ClientSession() as session:
                headers = {"Authorization": f"Bearer {access_token}"}
                async with session.get(
                    self.config.userinfo_url, headers=headers
                ) as response:
                    if response.status != 200:
                        return False, {"error": "Token validation failed"}

                    userinfo = await response.json()

            # Perform Iraqi-specific validations
            cultural_valid = await self._validate_token_culturally(token)
            islamic_valid = await self._validate_token_islamically(token)
            government_valid = await self._validate_token_governmentally(token)

            token_info = {
                "valid": True,
                "token": token,
                "userinfo": userinfo,
                "cultural_compliance": cultural_valid,
                "islamic_compliance": islamic_valid,
                "government_approval": government_valid,
                "time_until_expiry": token.time_until_expiry().total_seconds()
                if token.time_until_expiry()
                else None,
            }

            return True, token_info

        except Exception as e:
            self.logger.error(f"Token validation error: {str(e)}")
            return False, {"error": str(e)}

    async def revoke_token(
        self, token: str, token_type: TokenType = TokenType.ACCESS_TOKEN
    ) -> bool:
        """
        Revoke OAuth token with audit logging

        Args:
            token: Token to revoke
            token_type: Type of token being revoked

        Returns:
            Success status
        """
        try:
            # Prepare revocation request
            revoke_params = {
                "token": token,
                "token_type_hint": token_type.value,
                "client_id": self.config.client_id,
                "client_secret": self.config.client_secret,
            }

            # Send revocation request
            revoke_url = self.config.token_url.replace("/token", "/revoke")
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    revoke_url,
                    data=revoke_params,
                    headers={"Content-Type": "application/x-www-form-urlencoded"},
                ) as response:
                    success = response.status == 200

            # Remove from local storage
            await self.token_storage.remove_token(token)

            # Log revocation
            if self.config.audit_logging:
                await self.audit_logger.log_token_revocation(
                    token=token[:8] + "...",
                    token_type=token_type.value,
                    success=success,
                )

            self.logger.info(
                f"Token revocation {'successful' if success else 'failed'}"
            )
            return success

        except Exception as e:
            self.logger.error(f"Token revocation error: {str(e)}")
            return False

    def _generate_session_id(self) -> str:
        """Generate secure session identifier"""
        timestamp = str(int(time.time()))
        random_data = secrets.token_hex(16)
        ministry = self.config.ministry_code or "general"
        session_data = f"{timestamp}:{ministry}:{random_data}"
        return hashlib.sha256(session_data.encode()).hexdigest()[:16]

    async def _validate_token_culturally(self, token: IraqiOAuthToken) -> bool:
        """Validate token for cultural appropriateness"""
        if not self.config.cultural_compliance_required:
            return True

        validation_result = await self.cultural_validator.validate_token(token)
        token.cultural_compliance_score = validation_result.score
        return validation_result.is_compliant

    async def _validate_token_islamically(self, token: IraqiOAuthToken) -> bool:
        """Validate token for Islamic compliance"""
        if not self.config.islamic_validation_required:
            return True

        validation_result = await self.islamic_validator.validate_token(token)
        token.islamic_compliance_verified = validation_result.is_compliant
        return validation_result.is_compliant

    async def _validate_token_governmentally(self, token: IraqiOAuthToken) -> bool:
        """Validate token for government requirements"""
        validation_result = await self.government_validator.validate_token(token)
        return validation_result.is_approved


class IraqiTokenStorage:
    """Secure token storage with encryption and audit logging"""

    def __init__(self, encryption_enabled: bool = True, audit_logging: bool = True):
        self.encryption_enabled = encryption_enabled
        self.audit_logging = audit_logging
        self.tokens = {}  # In production, use secure database

        if encryption_enabled:
            self.encryption_key = os.urandom(32)  # AES-256 key

    async def store_token(self, token: IraqiOAuthToken):
        """Store token securely"""
        token_data = {
            "access_token": token.access_token,
            "token_type": token.token_type,
            "expires_at": token.expires_at.isoformat() if token.expires_at else None,
            "refresh_token": token.refresh_token,
            "scope": token.scope,
            "citizen_id": token.citizen_id,
            "ministry_code": token.ministry_code,
            "session_id": token.session_id,
            "stored_at": datetime.now().isoformat(),
        }

        if self.encryption_enabled:
            token_data = self._encrypt_data(json.dumps(token_data))

        self.tokens[token.access_token] = token_data

    async def get_token(self, access_token: str) -> Optional[IraqiOAuthToken]:
        """Retrieve token securely"""
        token_data = self.tokens.get(access_token)
        if not token_data:
            return None

        if self.encryption_enabled:
            token_data = json.loads(self._decrypt_data(token_data))

        # Reconstruct token object
        expires_at = None
        if token_data.get("expires_at"):
            expires_at = datetime.fromisoformat(token_data["expires_at"])

        return IraqiOAuthToken(
            access_token=token_data["access_token"],
            token_type=token_data["token_type"],
            refresh_token=token_data.get("refresh_token"),
            scope=token_data.get("scope"),
            citizen_id=token_data.get("citizen_id"),
            ministry_code=token_data.get("ministry_code"),
            session_id=token_data.get("session_id"),
            expires_at=expires_at,
        )

    async def remove_token(self, access_token: str):
        """Remove token from storage"""
        if access_token in self.tokens:
            del self.tokens[access_token]

    def _encrypt_data(self, data: str) -> bytes:
        """Encrypt data using AES-256"""
        iv = os.urandom(16)
        cipher = Cipher(algorithms.AES(self.encryption_key), modes.CBC(iv))
        encryptor = cipher.encryptor()

        # Pad data to block size
        pad_length = 16 - (len(data) % 16)
        padded_data = data + (chr(pad_length) * pad_length)

        encrypted = encryptor.update(padded_data.encode()) + encryptor.finalize()
        return iv + encrypted

    def _decrypt_data(self, encrypted_data: bytes) -> str:
        """Decrypt data using AES-256"""
        iv = encrypted_data[:16]
        encrypted = encrypted_data[16:]

        cipher = Cipher(algorithms.AES(self.encryption_key), modes.CBC(iv))
        decryptor = cipher.decryptor()

        decrypted = decryptor.update(encrypted) + decryptor.finalize()

        # Remove padding
        pad_length = decrypted[-1]
        return decrypted[:-pad_length].decode()


class IraqiCulturalValidator:
    """Cultural validation for OAuth tokens"""

    def __init__(self, language: str, compliance_required: bool):
        self.language = language
        self.compliance_required = compliance_required

    async def validate_token(self, token: IraqiOAuthToken):
        """Validate token for cultural appropriateness"""

        class ValidationResult:
            def __init__(self, is_compliant: bool, score: float, reason: str = ""):
                self.is_compliant = is_compliant
                self.score = score
                self.reason = reason

        # Mock validation - would integrate with actual cultural validator
        base_score = 0.8

        # Boost for Arabic language preference
        if token.arabic_language_preference:
            base_score += 0.1

        # Boost for government ministry
        if token.ministry_code:
            base_score += 0.1

        return ValidationResult(
            is_compliant=base_score >= 0.7,
            score=min(1.0, base_score),
            reason="Cultural validation completed",
        )


class IraqiIslamicValidator:
    """Islamic compliance validation for OAuth tokens"""

    def __init__(self, validation_required: bool):
        self.validation_required = validation_required

    async def validate_token(self, token: IraqiOAuthToken):
        """Validate token for Islamic compliance"""

        class ValidationResult:
            def __init__(self, is_compliant: bool, reason: str = ""):
                self.is_compliant = is_compliant
                self.reason = reason

        # Mock validation - would integrate with Islamic compliance system
        return ValidationResult(is_compliant=True, reason="Islamic compliance verified")


class IraqiGovernmentValidator:
    """Government approval validation for OAuth tokens"""

    def __init__(self, ministry_code: Optional[str], security_clearance: str):
        self.ministry_code = ministry_code
        self.security_clearance = security_clearance

    async def validate_token(self, token: IraqiOAuthToken):
        """Validate token for government requirements"""

        class ValidationResult:
            def __init__(self, is_approved: bool, reason: str = ""):
                self.is_approved = is_approved
                self.reason = reason

        # Mock validation - would integrate with government systems
        return ValidationResult(
            is_approved=True, reason="Government validation successful"
        )


class IraqiOAuthAuditLogger:
    """Audit logging for OAuth operations"""

    def __init__(self, ministry: Optional[str], government_domain: Optional[str]):
        self.ministry = ministry
        self.government_domain = government_domain
        self.logger = logging.getLogger(f"oauth_audit.{ministry or 'general'}")

    async def log_authorization_start(
        self,
        state: str,
        client_id: str,
        scopes: List[IraqiOAuthScope],
        citizen_id: Optional[str],
    ):
        """Log authorization flow start"""
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "event": "authorization_start",
            "state": state,
            "client_id": client_id,
            "scopes": [scope.value for scope in scopes],
            "citizen_id": citizen_id,
            "ministry": self.ministry,
        }
        self.logger.info(json.dumps(log_entry, ensure_ascii=False))

    async def log_token_exchange(
        self,
        state: str,
        token_type: str,
        scopes: Optional[str],
        citizen_id: Optional[str],
    ):
        """Log token exchange"""
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "event": "token_exchange",
            "state": state,
            "token_type": token_type,
            "scopes": scopes,
            "citizen_id": citizen_id,
            "ministry": self.ministry,
        }
        self.logger.info(json.dumps(log_entry, ensure_ascii=False))

    async def log_token_refresh(self, old_token: str, new_token: str, session_id: str):
        """Log token refresh"""
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "event": "token_refresh",
            "old_token_prefix": old_token,
            "new_token_prefix": new_token,
            "session_id": session_id,
            "ministry": self.ministry,
        }
        self.logger.info(json.dumps(log_entry, ensure_ascii=False))

    async def log_token_revocation(self, token: str, token_type: str, success: bool):
        """Log token revocation"""
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "event": "token_revocation",
            "token_prefix": token,
            "token_type": token_type,
            "success": success,
            "ministry": self.ministry,
        }
        self.logger.info(json.dumps(log_entry, ensure_ascii=False))
