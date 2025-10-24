"""
Core Authentication Service
Comprehensive authentication service integrating all Iraqi-specific auth components
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel
import os

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
from .mfa_enforcement import MFAEnforcementManager, MFAEnforcementResult
from .session_manager import SessionManager, TokenPair
from .password_utils import PasswordUtils, PasswordStrengthResult
from .account_lockout import AccountLockoutManager, LockoutStatus
from .device_fingerprinting import DeviceFingerprintManager, DeviceFingerprintResult
from .ip_activity_monitor import (
    IPActivityMonitor,
    SuspiciousActivity,
    LoginAttempt,
    IPGeolocation,
    ThreatLevel,
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
    """

    def __init__(self):
        """Initialize authentication service"""
        # In production, inject Supabase client
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_key = os.getenv("SUPABASE_SERVICE_KEY")

    async def register_user(
        self, registration: IraqiUserRegistration
    ) -> RegistrationResult:
        """
        Register new Iraqi user with cultural context

        Args:
            registration: IraqiUserRegistration data

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
            # ARCHITECTURE NOTE: This implementation uses HYBRID authentication:
            # - Supabase Auth for user management and email verification
            # - Local password hashing for backup/custom auth scenarios
            # - This provides flexibility but requires careful management
            # PRODUCTION DECISION: Choose ONE approach:
            #   Option A: Supabase-only (remove local password hashing)
            #   Option B: Local-only (remove Supabase Auth calls, implement full auth)
            # auth_user = await self.supabase.auth.sign_up({
            #     "email": registration.email,
            #     "password": registration.password,  # Pass plaintext to Supabase
            # })
            user_id = "placeholder-user-id"  # Placeholder

            # Step 4: Hash password for local backup storage (hybrid approach)
            # If using Supabase-only auth, remove this line
            hashed_password = PasswordUtils.hash_password(registration.password)

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

            return RegistrationResult(
                success=True,
                user_id=user_id,
                email=registration.email,
                verification_status=verification_status,
                next_steps=next_steps,
                cultural_greeting=cultural_greeting,
            )

        except Exception as e:
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
        respect_prayer_times: bool = True,
        cultural_timing_flexibility: int = 15,
    ) -> LoginResult:
        """
        Authenticate user and create session

        Args:
            login_request: LoginRequest with credentials
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
                "password_hash": "$2b$12$LQv3c4yavXvGA5lX3dFPLOmT0hZOhPYHpTqjKTUqKqKemBVLhG6IS",  # Valid 60-char test hash
                "failed_login_attempts": 0,
                "locked_until": None,
                "last_failed_attempt": None,
            }
            user_id = user_record["id"]

            # Step 1.5: Check account lockout status BEFORE password verification
            lockout_status = AccountLockoutManager.check_lockout_status(
                failed_attempts=user_record.get("failed_login_attempts", 0),
                locked_until=user_record.get("locked_until"),
                last_failed_attempt=user_record.get("last_failed_attempt"),
            )

            # If account is locked, return immediately
            if lockout_status.is_locked:
                return LoginResult(
                    success=False,
                    error_message=lockout_status.lockout_reason,
                )

            # Step 2: Verify password against stored hash
            # Always verify password to prevent timing attacks
            # PasswordUtils.verify_password handles invalid hash formats gracefully
            password_hash = user_record.get("password_hash", "")
            is_valid_password = False

            if len(password_hash) == 60:  # Valid bcrypt hash length
                is_valid_password = PasswordUtils.verify_password(
                    login_request.password, password_hash
                )
            else:
                # Use a dummy verification to keep timing consistent
                # This prevents timing attacks by ensuring all paths take similar time
                dummy_hash = (
                    "$2b$12$LQv3c4yavXvGA5lX3dFPLOmT0hZOhPYHpTqjKTUqKqKemBVLhG6IS"
                )
                PasswordUtils.verify_password(login_request.password, dummy_hash)
                is_valid_password = False

            if not is_valid_password:
                # Record failed login attempt
                (
                    new_failed_attempts,
                    new_locked_until,
                    should_send_notification,
                ) = AccountLockoutManager.record_failed_attempt(
                    current_failed_attempts=user_record.get("failed_login_attempts", 0),
                    locked_until=user_record.get("locked_until"),
                )

                # TODO: Update database with new failed_login_attempts and locked_until
                # await self.supabase.from_("iraqi_user_authentication").update({
                #     "failed_login_attempts": new_failed_attempts,
                #     "locked_until": new_locked_until.isoformat() if new_locked_until else None,
                #     "last_failed_attempt": datetime.now().isoformat(),
                # }).eq("id", user_id).execute()

                # Send email notification if account was just locked
                if should_send_notification:
                    # TODO: Send lockout notification email
                    # email_content = AccountLockoutManager.generate_lockout_email_content(
                    #     full_name=user_profile.get("full_name", "User"),
                    #     email=login_request.email,
                    #     locked_until=new_locked_until,
                    #     ip_address=device_info.get("ip_address"),
                    # )
                    # await self.send_email(email_content)
                    pass

                # Check if user should be warned about approaching lockout
                should_warn, warning_message = AccountLockoutManager.should_warn_user(
                    new_failed_attempts
                )

                # Build error message
                error_message = "Invalid email or password"
                if new_locked_until:
                    # Account just got locked
                    time_remaining = new_locked_until - datetime.now()
                    minutes = int(time_remaining.total_seconds() / 60)
                    error_message = (
                        f"Account locked due to {new_failed_attempts} failed login attempts. "
                        f"Try again in {minutes} minutes."
                    )
                elif should_warn:
                    # Warn user about approaching lockout
                    error_message = f"Invalid email or password. {warning_message}"

                return LoginResult(
                    success=False,
                    error_message=error_message,
                )

            # Reset failed login attempts on successful password verification
            new_failed_attempts, new_locked_until = (
                AccountLockoutManager.reset_failed_attempts()
            )

            # TODO: Update database to reset failed attempts counter
            # await self.supabase.from_("iraqi_user_authentication").update({
            #     "failed_login_attempts": 0,
            #     "locked_until": None,
            #     "last_failed_attempt": None,
            # }).eq("id", user_id).execute()

            # Step 3: Fetch Iraqi user authentication profile
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

            # Step 4: Check account status
            if user_profile["account_status"] == "suspended":
                return LoginResult(
                    success=False,
                    error_message="Account is suspended. Please contact support.",
                )

            if user_profile["account_status"] == "locked":
                return LoginResult(
                    success=False,
                    error_message="Account is locked due to multiple failed login attempts. Please reset your password.",
                )

            # Step 5: Fetch cultural context
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

            # Step 6: Generate cultural greeting
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

            # Step 6.5: Generate device fingerprint
            # Create device fingerprint from request headers
            fingerprint_result = DeviceFingerprintManager.create_device_fingerprint(
                user_agent=login_request.user_agent or "Unknown",
                ip_address=login_request.ip_address,
                accept_language=login_request.accept_language,
                accept_encoding=login_request.accept_encoding,
                known_device_ids=None,  # TODO: Fetch known device IDs from database
            )

            # Use generated device_id if not provided in request
            device_id = login_request.device_id or fingerprint_result.device_id

            # Use parsed device info if not provided in request
            device_type = (
                login_request.device_type or fingerprint_result.device_info.device_type
            )
            platform = login_request.platform or fingerprint_result.device_info.platform

            # Check if MFA should be triggered based on device fingerprint
            should_trigger_device_mfa, device_mfa_reason = (
                DeviceFingerprintManager.should_trigger_mfa(
                    fingerprint_result=fingerprint_result,
                    mfa_on_new_device=True,  # TODO: Get from user preferences
                )
            )

            # Log device fingerprint result (in production, store in database)
            # TODO: Store device fingerprint in iraqi_user_devices table:
            # - device_id (fingerprint_result.device_id)
            # - user_id
            # - device_type, platform, browser, os
            # - fingerprint_strength
            # - is_trusted (based on previous successful logins)
            # - last_seen timestamp
            # - suspicious_indicators (if any)

            # Step 6.6: Analyze IP address for suspicious activity
            # TODO: Fetch recent login attempts from database for this IP
            # For now, use empty list (will be populated when database integration is complete)
            recent_attempts: list[LoginAttempt] = []

            # In production, fetch from database:
            # recent_attempts = await self.get_recent_attempts_for_ip(
            #     ip_address=login_request.ip_address,
            #     time_window_hours=24
            # )

            # Optional: Get geolocation data for IP (requires external service)
            # current_location = await self.get_ip_geolocation(login_request.ip_address)
            current_location = None  # Placeholder

            # Analyze IP activity for suspicious patterns
            ip_activity = IPActivityMonitor.analyze_ip_activity(
                ip_address=login_request.ip_address,
                recent_attempts=recent_attempts,
                current_location=current_location,
                user_id=user_id,
            )

            # Get additional security measures based on IP analysis
            security_measures = IPActivityMonitor.should_trigger_additional_security(
                ip_activity
            )

            # Log IP activity analysis (in production, store in database)
            # TODO: Store IP activity analysis in security_events table:
            # - ip_address
            # - user_id
            # - threat_level
            # - confidence_score
            # - detected_patterns
            # - recommended_action
            # - timestamp

            # Block IP if critical threat detected
            if security_measures["block_ip"]:
                # TODO: Add IP to blacklist in database
                # TODO: Notify security team if critical threat
                return LoginResult(
                    success=False,
                    error_message="Access denied due to suspicious activity. Please contact support.",
                )

            # Step 7: Check if MFA should be enforced
            # Consider both device fingerprint and IP activity suspicious indicators
            is_suspicious_activity = (
                len(fingerprint_result.suspicious_indicators) > 0
                or ip_activity.threat_level in [ThreatLevel.HIGH, ThreatLevel.CRITICAL]
                or security_measures["require_mfa"]
            )

            mfa_enforcement = MFAEnforcementManager.should_enforce_mfa(
                mfa_enabled=user_profile.get("mfa_enabled", False),
                mfa_frequency=MFAFrequency.EVERY_LOGIN
                if user_profile.get("mfa_enabled")
                else MFAFrequency.NEW_DEVICE,
                device_id=device_id,  # Use generated device_id from fingerprint
                trust_token=None,  # TODO: Get trust token from request headers
                is_suspicious_activity=is_suspicious_activity,  # Use device fingerprint detection
                last_login=None,  # TODO: Get from user profile
                operation_type="login",
            )

            # Override MFA enforcement if device fingerprint indicates suspicious activity
            if should_trigger_device_mfa and not mfa_enforcement.should_enforce:
                mfa_enforcement.should_enforce = True
                mfa_enforcement.enforcement_reason = device_mfa_reason

            # If MFA should be enforced, setup MFA challenge
            if mfa_enforcement.should_enforce:
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

                # TODO: Send MFA enforcement email notification if configured
                # mfa_email = MFAEnforcementManager.generate_mfa_enforcement_email(
                #     full_name=user_profile["full_name"],
                #     email=login_request.email,
                #     enforcement_reason=mfa_enforcement.enforcement_reason,
                #     operation_type="login",
                # )
                # await self.email_service.send(mfa_email)

                return LoginResult(
                    success=True,
                    user_id=user_id,
                    cultural_greeting=cultural_greeting,
                    requires_mfa=True,
                    mfa_setup_id=mfa_setup.verification_id,
                )

            # Step 8: Create session with cultural context and device fingerprint
            session_result = SessionManager.create_session(
                user_id=user_id,
                cultural_context=cultural_context,
                device_id=device_id,  # Use device_id from fingerprint
                device_type=device_type,  # Use parsed device_type from fingerprint
                platform=platform,  # Use parsed platform from fingerprint
            )

            if not session_result.success:
                return LoginResult(
                    success=False,
                    error_message=f"Session creation failed: {session_result.error_message}",
                )

            # Step 9: Build verification status
            verification_status = VerificationStatus(
                email_verified=True,  # User logged in successfully
                iraqi_id_verified=False,  # TODO: Check from user profile
                professional_license_verified=False,  # TODO: Check from user profile
                overall_status=user_profile["verification_status"],
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
            return LoginResult(
                success=False,
                error_message=f"Login failed: {str(e)}",
            )

    async def verify_mfa_and_create_session(
        self,
        verification_id: str,
        code: str,
        user_id: str,
        device_id: Optional[str] = None,
        remember_device: bool = False,
    ) -> LoginResult:
        """
        Verify MFA code and create authenticated session

        Args:
            verification_id: MFA verification ID
            code: User-provided verification code
            user_id: User ID
            device_id: Device ID
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
                return LoginResult(
                    success=False,
                    error_message=f"MFA verification failed: {mfa_result.error_message}",
                )

            # TODO: Fetch user profile and cultural context
            cultural_context = {}

            # Create session
            session_result = SessionManager.create_session(
                user_id=user_id,
                cultural_context=cultural_context,
                device_id=device_id,
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
            return LoginResult(
                success=False,
                error_message=f"MFA verification failed: {str(e)}",
            )

    async def logout_user(self, session_id: str) -> bool:
        """
        Logout user by revoking session

        Args:
            session_id: Session ID to revoke

        Returns:
            True if successful
        """
        return await SessionManager.revoke_session(session_id)

    async def logout_all_devices(self, user_id: str) -> int:
        """
        Logout user from all devices

        Args:
            user_id: User ID

        Returns:
            Number of sessions revoked
        """
        return await SessionManager.revoke_all_user_sessions(user_id)
