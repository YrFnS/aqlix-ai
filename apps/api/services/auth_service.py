"""
Core Authentication Service
Comprehensive authentication service integrating all Iraqi-specific auth components
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel
import os
import logging

# Import our specialized services
from .iraqi_id_validator import (
    IraqiIDValidator,
    IraqiRegion,
    VerificationLevel,
)
from .professional_license_validator import (
    ProfessionalLicenseValidator,
    ProfessionalDomain,
    IssuingAuthority,
)
from .cultural_context_manager import (
    CulturalContextManager,
    IslamicComplianceLevel,
    CulturalGreeting,
)
from .mfa_manager import MFAManager, MFAMethod, MFAFrequency
from .session_manager import SessionManager, TokenPair
from .password_utils import PasswordUtils, PasswordStrengthResult
from .account_lockout import AccountLockoutManager
from .device_fingerprinting import DeviceFingerprintManager
from .security_logger import (
    get_security_logger,
    SecurityEventSeverity,
)

# Import models
from ..models.iraqi_user import (
    IraqiUserRegistration,
    LoginRequest,
    AuthenticationResult,
    CulturalContext,
    ProfessionalContext,
    VerificationStatus,
)


class RegistrationResult(BaseModel):
    """Extended registration result"""

    success: bool
    user_id: Optional[str] = None
    email: str
    verification_status: str
    next_steps: list[str]
    cultural_greeting: Optional[CulturalGreeting] = None
    error_message: Optional[str] = None
    validation_errors: list[str] = []


class LoginResult(BaseModel):
    """Extended login result"""

    success: bool
    user_id: Optional[str] = None
    tokens: Optional[TokenPair] = None
    cultural_greeting: Optional[CulturalGreeting] = None
    requires_mfa: bool = False
    mfa_setup_id: Optional[str] = None
    verification_status: Optional[VerificationStatus] = None
    error_message: Optional[str] = None


class AuthService:
    """
    Core Authentication Service

    Orchestrates all authentication operations including:
    - User registration with Iraqi ID and professional license validation
    - Login with cultural greeting generation
    - MFA setup and verification
    - Session management with cultural context
    - Password reset and email verification
    - Account status management
    - Comprehensive security audit logging
    """

    def __init__(self):
        """Initialize authentication service"""
        # In production, inject Supabase client
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_SERVICE_KEY")

        # Initialize security logger
        self.security_logger = get_security_logger()

        # Initialize standard logger for server-side diagnostics
        self.logger = logging.getLogger(__name__)

    async def register_user(
        self,
        registration: IraqiUserRegistration,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
    ) -> RegistrationResult:
        """
        Register new Iraqi user with cultural context

        Args:
            registration: IraqiUserRegistration data
            ip_address: Client IP address for security logging
            user_agent: User agent for security logging

        Returns:
            RegistrationResult with registration status
        """
        validation_errors = []

        try:
            # Step 0: Validate password strength
            password_strength = PasswordUtils.validate_password_strength(
                registration.password
            )

            if not password_strength.is_valid:
                validation_errors.extend(
                    [
                        f"Password strength insufficient: {req}"
                        for req in password_strength.missing_requirements
                    ]
                )

            # Step 1: Validate Iraqi ID if provided
            iraqi_id_result = None
            if registration.iraqi_id:
                iraqi_id_result = IraqiIDValidator.validate(
                    iraqi_id=registration.iraqi_id,
                    expected_region=registration.region,
                    verification_level=VerificationLevel.STANDARD,
                )

                if not iraqi_id_result.is_valid:
                    validation_errors.append(
                        f"Iraqi ID validation failed: {iraqi_id_result.error_message}"
                    )

            # Step 2: Validate professional license if provided
            license_result = None
            if registration.professional_domain and registration.professional_license:
                license_result = ProfessionalLicenseValidator.validate(
                    license_number=registration.professional_license,
                    domain=registration.professional_domain,
                )

                if not license_result.is_valid:
                    validation_errors.append(
                        f"Professional license validation failed: {license_result.error_message}"
                    )

            # If validation errors exist, return early
            if validation_errors:
                return RegistrationResult(
                    success=False,
                    email=registration.email,
                    verification_status="rejected",
                    next_steps=["Please correct validation errors and try again"],
                    validation_errors=validation_errors,
                )

            # Step 3: Create user in Supabase Auth
            # TODO: Implement Supabase Auth sign up
            # NOTE: Supabase Auth handles password hashing internally, pass plaintext
            # auth_user = await self.supabase.auth.sign_up({
            #     "email": registration.email,
            #     "password": registration.password,  # Supabase handles hashing
            # })
            user_id = "placeholder-user-id"  # Placeholder

            # Step 4: Password handling based on auth mode
            # IMPORTANT: When using Supabase Auth, do NOT hash locally
            # Supabase handles password hashing internally - double hashing breaks auth
            # Local password storage is ONLY for custom auth path (not implemented yet)
            # TODO: Remove local password hashing once Supabase Auth is fully integrated
            # For now, setting hashed_password to None to prevent double-hashing
            hashed_password = None  # Will be populated by Supabase Auth internally

            # Step 5: Create Iraqi user authentication record
            # TODO: Insert into iraqi_user_authentication table
            # await self.supabase.from_("iraqi_user_authentication").insert({
            #     "id": user_id,
            #     "full_name": registration.full_name,
            #     "email": registration.email,
            #     "password_hash": hashed_password,  # Optional: local password storage
            #     "region": registration.region.value,
            #     "iraqi_id": registration.iraqi_id,
            #     "iraqi_id_verified": False,
            #     "professional_domain": registration.professional_domain.value if registration.professional_domain else None,
            #     "professional_license": registration.professional_license,
            #     "islamic_compliance_level": registration.cultural_preferences.islamic_compliance_level.value,
            #     "language_preference": registration.cultural_preferences.language_preference,
            #     ...
            # })

            # Step 6: Create cultural context record
            cultural_context_metadata = CulturalContextManager.get_cultural_jwt_metadata(
                region=registration.region,
                islamic_compliance_level=registration.cultural_preferences.islamic_compliance_level,
                language_preference=registration.cultural_preferences.language_preference,
                professional_domain=(
                    registration.professional_domain.value
                    if registration.professional_domain
                    else None
                ),
                family_privacy_level=registration.cultural_preferences.family_privacy_level,
                professional_etiquette_level=registration.cultural_preferences.professional_etiquette_level,
            )

            # TODO: Insert into authentication_cultural_context table

            # Step 7: Create professional domain authentication if applicable
            if registration.professional_domain and license_result:
                # TODO: Insert into professional_domain_authentication table
                pass

            # Step 8: Generate cultural greeting
            cultural_greeting = CulturalContextManager.generate_cultural_greeting(
                full_name=registration.full_name,
                region=registration.region,
                islamic_compliance_level=registration.cultural_preferences.islamic_compliance_level,
                language_preference=registration.cultural_preferences.language_preference,
                professional_domain=(
                    registration.professional_domain.value
                    if registration.professional_domain
                    else None
                ),
                professional_etiquette_level=registration.cultural_preferences.professional_etiquette_level,
            )

            # Step 9: Determine verification status and next steps
            verification_status = "pending"
            next_steps = ["Please verify your email address"]

            if registration.iraqi_id:
                next_steps.append("Iraqi ID verification pending")
                if iraqi_id_result and iraqi_id_result.is_valid:
                    verification_status = "email_verified"

            if registration.professional_license and license_result:
                if license_result.requires_manual_verification:
                    next_steps.append(
                        "Professional license verification pending (manual review required)"
                    )
                    next_steps.extend(
                        [
                            f"Submit {doc.document_type}: {doc.description}"
                            for doc in license_result.required_documentation
                            if doc.is_required
                        ]
                    )

            # Step 10: Log registration event
            self.security_logger.log_register(
                user_id=user_id,
                email=registration.email,
                ip_address=ip_address,
                user_agent=user_agent,
                region=registration.region.value if registration.region else None,
                professional_domain=(
                    registration.professional_domain.value
                    if registration.professional_domain
                    else None
                ),
            )

            return RegistrationResult(
                success=True,
                user_id=user_id,
                email=registration.email,
                verification_status=verification_status,
                next_steps=next_steps,
                cultural_greeting=cultural_greeting,
            )

        except Exception as e:
            # Log error (without sensitive data)
            self.security_logger.log_suspicious_activity(
                email=registration.email,
                ip_address=ip_address,
                activity_type="registration_error",
                details={"error_type": type(e).__name__},
                severity=SecurityEventSeverity.MEDIUM,
            )

            return RegistrationResult(
                success=False,
                email=registration.email,
                verification_status="error",
                next_steps=["Please contact support"],
                error_message=f"Registration failed: {str(e)}",
            )

    async def login_user(
        self,
        login_request: LoginRequest,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        respect_prayer_times: bool = True,
        cultural_timing_flexibility: int = 15,
    ) -> LoginResult:
        """
        Authenticate user and create session

        Args:
            login_request: LoginRequest with credentials
            ip_address: Client IP address for security logging
            user_agent: User agent for security logging
            respect_prayer_times: Whether to respect prayer times for MFA
            cultural_timing_flexibility: Minutes of flexibility

        Returns:
            LoginResult with authentication status
        """
        try:
            # Step 1: Fetch user from database by email
            # TODO: Query iraqi_user_authentication table by email
            # user_record = await self.supabase.from_("iraqi_user_authentication").select("*").eq("email", login_request.email).single()
            # Placeholder data for now
            user_record = {
                "id": "placeholder-user-id",
                "password_hash": "$2b$12$placeholder_hash",  # This will be replaced with actual hash from DB
                "failed_login_attempts": 0,
                "locked_until": None,
                "last_failed_attempt": None,
            }
            user_id = user_record["id"]

            # Step 2: Check account lockout status
            lockout_status = AccountLockoutManager.check_lockout_status(
                failed_attempts=user_record.get("failed_login_attempts", 0),
                locked_until=user_record.get("locked_until"),
                last_failed_attempt=user_record.get("last_failed_attempt"),
            )

            if lockout_status.is_locked:
                # Log failed login attempt (account locked)
                self.security_logger.log_failed_login(
                    email=login_request.email,
                    ip_address=ip_address,
                    user_agent=user_agent,
                    reason="account_locked",
                    attempts_remaining=0,
                )

                return LoginResult(
                    success=False,
                    error_message=lockout_status.lockout_reason,
                )

            # Step 3: Verify password against stored hash
            # Validate password hash format (bcrypt hashes are 60 characters)
            if (
                not user_record.get("password_hash")
                or len(user_record["password_hash"]) != 60
            ):
                # This is a system/data integrity error, not a user authentication failure
                # Do NOT count this against user lockout attempts
                self.security_logger.log_suspicious_activity(
                    user_id=user_id,
                    email=login_request.email,
                    ip_address=ip_address,
                    activity_type="system_invalid_password_hash",
                    details={"error": "Invalid or missing password hash in database"},
                    severity=SecurityEventSeverity.HIGH,
                )

                return LoginResult(
                    success=False,
                    error_message="Invalid email or password",  # Generic message for security
                )

            # Verify password
            is_valid_password = PasswordUtils.verify_password(
                login_request.password, user_record["password_hash"]
            )

            if not is_valid_password:
                # Record failed attempt
                (
                    new_failed_attempts,
                    new_locked_until,
                    should_notify,
                ) = AccountLockoutManager.record_failed_attempt(
                    current_failed_attempts=user_record.get("failed_login_attempts", 0),
                    locked_until=user_record.get("locked_until"),
                )

                # TODO: Update failed login attempts in database
                # await self.supabase.from_("iraqi_user_authentication").update({
                #     "failed_login_attempts": new_failed_attempts,
                #     "locked_until": new_locked_until,
                #     "last_failed_attempt": datetime.now()
                # }).eq("id", user_id)

                # Log failed login attempt
                attempts_remaining = AccountLockoutManager.check_lockout_status(
                    failed_attempts=new_failed_attempts,
                    locked_until=new_locked_until,
                ).remaining_attempts

                self.security_logger.log_failed_login(
                    email=login_request.email,
                    ip_address=ip_address,
                    user_agent=user_agent,
                    reason="invalid_password",
                    attempts_remaining=attempts_remaining,
                )

                # Log account lockout if locked
                if new_locked_until:
                    self.security_logger.log_account_locked(
                        user_id=user_id,
                        email=login_request.email,
                        ip_address=ip_address,
                        reason="failed_login_attempts",
                        locked_until=new_locked_until,
                    )

                return LoginResult(
                    success=False,
                    error_message="Invalid email or password",
                )

            # Password valid - reset failed attempts
            # TODO: Reset failed login attempts on successful password verification
            # await self.supabase.from_("iraqi_user_authentication").update({
            #     "failed_login_attempts": 0,
            #     "locked_until": None,
            #     "last_failed_attempt": None
            # }).eq("id", user_id)

            # Step 4: Fetch Iraqi user authentication profile
            # TODO: Query iraqi_user_authentication table
            user_profile = {
                "full_name": "Test User",
                "region": "baghdad",
                "islamic_compliance_level": "standard",
                "language_preference": "ar-IQ",
                "professional_domain": None,
                "professional_etiquette_level": "standard",
                "mfa_enabled": False,
                "mfa_methods": ["email"],
                "account_status": "active",
                "verification_status": "email_verified",
            }

            # Step 5: Check account status
            if user_profile["account_status"] == "suspended":
                self.security_logger.log_failed_login(
                    email=login_request.email,
                    ip_address=ip_address,
                    user_agent=user_agent,
                    reason="account_suspended",
                )

                return LoginResult(
                    success=False,
                    error_message="Account is suspended. Please contact support.",
                )

            if user_profile["account_status"] == "locked":
                self.security_logger.log_failed_login(
                    email=login_request.email,
                    ip_address=ip_address,
                    user_agent=user_agent,
                    reason="account_locked",
                )

                return LoginResult(
                    success=False,
                    error_message="Account is locked due to multiple failed login attempts. Please reset your password.",
                )

            # Step 6: Fetch cultural context
            # TODO: Query authentication_cultural_context table
            cultural_context = CulturalContextManager.get_cultural_jwt_metadata(
                region=IraqiRegion(user_profile["region"]),
                islamic_compliance_level=IslamicComplianceLevel(
                    user_profile["islamic_compliance_level"]
                ),
                language_preference=user_profile["language_preference"],
                professional_domain=user_profile.get("professional_domain"),
                professional_etiquette_level=user_profile[
                    "professional_etiquette_level"
                ],
            )

            # Step 7: Generate cultural greeting
            cultural_greeting = CulturalContextManager.generate_cultural_greeting(
                full_name=user_profile["full_name"],
                region=IraqiRegion(user_profile["region"]),
                islamic_compliance_level=IslamicComplianceLevel(
                    user_profile["islamic_compliance_level"]
                ),
                language_preference=user_profile["language_preference"],
                professional_domain=user_profile.get("professional_domain"),
                professional_etiquette_level=user_profile[
                    "professional_etiquette_level"
                ],
            )

            # Step 8: Create device fingerprint
            device_fingerprint = DeviceFingerprintManager.create_device_fingerprint(
                user_agent=user_agent or "unknown",
                ip_address=ip_address,
            )

            # Detect suspicious activity
            if device_fingerprint.suspicious_indicators:
                self.security_logger.log_suspicious_activity(
                    user_id=user_id,
                    email=login_request.email,
                    ip_address=ip_address,
                    activity_type="suspicious_device",
                    details={
                        "indicators": device_fingerprint.suspicious_indicators,
                        "fingerprint_strength": device_fingerprint.fingerprint_strength,
                    },
                    severity=SecurityEventSeverity.HIGH,
                )

            # Step 9: Check if MFA is required
            is_suspicious = len(device_fingerprint.suspicious_indicators) > 0
            requires_mfa, mfa_reason = MFAManager.should_require_mfa(
                user_id=user_id,
                device_id=device_fingerprint.device_id,
                mfa_frequency=MFAFrequency.EVERY_LOGIN
                if user_profile.get("mfa_enabled")
                else MFAFrequency.NEW_DEVICE,
                is_suspicious_activity=is_suspicious,
            )

            if requires_mfa:
                # Setup MFA
                mfa_methods = user_profile.get("mfa_methods", ["email"])
                primary_method = MFAMethod(mfa_methods[0] if mfa_methods else "email")

                mfa_setup = MFAManager.setup_mfa(
                    user_id=user_id,
                    method=primary_method,
                    destination=login_request.email,
                    respect_prayer_times=respect_prayer_times,
                    cultural_timing_flexibility=cultural_timing_flexibility,
                )

                if not mfa_setup.success:
                    return LoginResult(
                        success=False,
                        error_message=f"MFA setup failed: {mfa_setup.error_message}",
                    )

                # Log MFA setup
                self.security_logger.log_mfa_setup(
                    user_id=user_id,
                    email=login_request.email,
                    mfa_method=primary_method.value,
                    ip_address=ip_address,
                )

                return LoginResult(
                    success=True,
                    user_id=user_id,
                    cultural_greeting=cultural_greeting,
                    requires_mfa=True,
                    mfa_setup_id=mfa_setup.verification_id,
                )

            # Step 10: Create session with cultural context
            session_result = SessionManager.create_session(
                user_id=user_id,
                cultural_context=cultural_context,
                device_id=device_fingerprint.device_id,
                device_type=login_request.device_type,
                platform=login_request.platform,
            )

            if not session_result.success:
                return LoginResult(
                    success=False,
                    error_message=f"Session creation failed: {session_result.error_message}",
                )

            # Step 11: Build verification status
            verification_status = VerificationStatus(
                email_verified=True,  # User logged in successfully
                iraqi_id_verified=False,  # TODO: Check from user profile
                professional_license_verified=False,  # TODO: Check from user profile
                overall_status=user_profile["verification_status"],
            )

            # Step 12: Log successful login
            self.security_logger.log_login(
                user_id=user_id,
                email=login_request.email,
                ip_address=ip_address,
                user_agent=user_agent,
                device_id=device_fingerprint.device_id,
                session_id=session_result.session_id,
                mfa_used=False,
            )

            # Step 13: Log session creation
            self.security_logger.log_session_created(
                user_id=user_id,
                session_id=session_result.session_id,
                device_id=device_fingerprint.device_id,
                ip_address=ip_address,
                expires_at=session_result.expires_at,
            )

            return LoginResult(
                success=True,
                user_id=user_id,
                tokens=session_result.tokens,
                cultural_greeting=cultural_greeting,
                requires_mfa=False,
                verification_status=verification_status,
            )

        except Exception as e:
            # Log full exception details server-side for diagnostics
            self.logger.exception(
                "Login error for email %s: %s", login_request.email, str(e)
            )

            # Log error to security logger
            self.security_logger.log_suspicious_activity(
                email=login_request.email,
                ip_address=ip_address,
                activity_type="login_error",
                details={"error_type": type(e).__name__},
                severity=SecurityEventSeverity.MEDIUM,
            )

            # Return generic error message to client (no internal details)
            return LoginResult(
                success=False,
                error_message="Login failed",
            )

    async def verify_mfa_and_create_session(
        self,
        verification_id: str,
        code: str,
        user_id: str,
        email: str,
        device_id: Optional[str] = None,
        ip_address: Optional[str] = None,
        remember_device: bool = False,
    ) -> LoginResult:
        """
        Verify MFA code and create authenticated session

        Args:
            verification_id: MFA verification ID
            code: User-provided verification code
            user_id: User ID
            email: User email for logging
            device_id: Device ID
            ip_address: IP address for logging
            remember_device: Whether to trust this device

        Returns:
            LoginResult with session tokens
        """
        try:
            # TODO: Fetch stored MFA hash from database
            stored_hash = "placeholder-hash"
            attempts_used = 0

            # Verify MFA code
            mfa_result = MFAManager.verify_mfa_code(
                verification_id=verification_id,
                code=code,
                stored_hash=stored_hash,
                attempts_used=attempts_used,
            )

            if not mfa_result.success:
                # Log MFA failure
                self.security_logger.log_suspicious_activity(
                    user_id=user_id,
                    email=email,
                    ip_address=ip_address,
                    activity_type="mfa_verification_failed",
                    details={
                        "verification_id": verification_id,
                        "attempts_used": attempts_used + 1,
                    },
                    severity=SecurityEventSeverity.MEDIUM,
                )

                return LoginResult(
                    success=False,
                    error_message=f"MFA verification failed: {mfa_result.error_message}",
                )

            # Log successful MFA verification
            self.security_logger.log_mfa_verified(
                user_id=user_id,
                email=email,
                mfa_method="email",  # TODO: Get from MFA setup
                ip_address=ip_address,
            )

            # TODO: Fetch user profile and cultural context
            cultural_context = {}

            # Create session
            session_result = SessionManager.create_session(
                user_id=user_id,
                cultural_context=cultural_context,
                device_id=device_id,
            )

            # Log session creation
            self.security_logger.log_session_created(
                user_id=user_id,
                session_id=session_result.session_id,
                device_id=device_id,
                ip_address=ip_address,
                expires_at=session_result.expires_at,
            )

            # Log successful login with MFA
            self.security_logger.log_login(
                user_id=user_id,
                email=email,
                ip_address=ip_address,
                device_id=device_id,
                session_id=session_result.session_id,
                mfa_used=True,
            )

            # Trust device if requested
            if remember_device and device_id:
                MFAManager.trust_device(user_id=user_id, device_id=device_id)

            return LoginResult(
                success=True,
                user_id=user_id,
                tokens=session_result.tokens,
                requires_mfa=False,
            )

        except Exception as e:
            # Log full exception details server-side for diagnostics
            self.logger.exception(
                "MFA verification error for user %s: %s", user_id, str(e)
            )

            # Log error to security logger
            self.security_logger.log_suspicious_activity(
                user_id=user_id,
                email=email,
                ip_address=ip_address,
                activity_type="mfa_verification_error",
                details={"error_type": type(e).__name__},
                severity=SecurityEventSeverity.MEDIUM,
            )

            # Return generic error message to client (no internal details)
            return LoginResult(
                success=False,
                error_message="MFA verification failed",
            )

    async def logout_user(
        self,
        session_id: str,
        user_id: str,
        email: str,
        ip_address: Optional[str] = None,
    ) -> bool:
        """
        Logout user by revoking session

        Args:
            session_id: Session ID to revoke
            user_id: User ID for logging
            email: User email for logging
            ip_address: IP address for logging

        Returns:
            True if successful
        """
        success = SessionManager.revoke_session(session_id)

        if success:
            # Log session revocation
            self.security_logger.log_session_revoked(
                user_id=user_id,
                session_id=session_id,
                reason="user_logout",
                ip_address=ip_address,
            )

            # Log logout
            self.security_logger.log_logout(
                user_id=user_id,
                email=email,
                session_id=session_id,
                ip_address=ip_address,
            )

        return success

    async def logout_all_devices(
        self,
        user_id: str,
        email: str,
        ip_address: Optional[str] = None,
    ) -> int:
        """
        Logout user from all devices

        Args:
            user_id: User ID
            email: User email for logging
            ip_address: IP address for logging

        Returns:
            Number of sessions revoked
        """
        sessions_revoked = SessionManager.revoke_all_user_sessions(user_id)

        if sessions_revoked > 0:
            # Log all sessions revoked
            self.security_logger.log_suspicious_activity(
                user_id=user_id,
                email=email,
                ip_address=ip_address,
                activity_type="all_sessions_revoked",
                details={"sessions_count": sessions_revoked},
                severity=SecurityEventSeverity.MEDIUM,
            )

        return sessions_revoked
