"""
Core Authentication Service
Comprehensive authentication service integrating all Iraqi-specific auth components
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel
import os
import logging
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

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
        # Initialize Supabase client
        self.supabase_url = os.getenv("SUPABASE_URL")
        self.supabase_service_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

        # Create Supabase client with service role key for admin operations
        # Service role key bypasses RLS and allows server-side operations
        if self.supabase_url and self.supabase_service_key:
            self.supabase: Client = create_client(
                self.supabase_url, self.supabase_service_key
            )
        else:
            self.supabase = None
            # Log warning if Supabase is not configured
            logging.warning(
                "Supabase client not initialized: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing"
            )

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
            # NOTE: Supabase Auth handles password hashing internally, pass plaintext
            # Sign up user with email and password
            if not self.supabase:
                raise ValueError(
                    "Supabase client not initialized. Please configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
                )

            try:
                auth_response = self.supabase.auth.sign_up(
                    {
                        "email": registration.email,
                        "password": registration.password,  # Supabase handles hashing
                        "options": {
                            "email_redirect_to": None,  # Disable email confirmation redirect for API use
                            "data": {
                                # Store basic metadata in auth.users metadata field
                                "full_name": registration.full_name,
                                "region": registration.region.value
                                if registration.region
                                else None,
                            },
                        },
                    }
                )

                # Check if sign up was successful
                if not auth_response.user:
                    # Handle specific Supabase errors
                    error_message = "Failed to create user in Supabase Auth"
                    if hasattr(auth_response, "error") and auth_response.error:
                        error_message = auth_response.error.message

                    validation_errors.append(f"Supabase Auth error: {error_message}")
                    return RegistrationResult(
                        success=False,
                        email=registration.email,
                        verification_status="rejected",
                        next_steps=["Please correct errors and try again"],
                        validation_errors=validation_errors,
                        error_message=error_message,
                    )

                # Extract user ID from auth response
                user_id = auth_response.user.id

            except Exception as auth_error:
                # Handle Supabase Auth errors (duplicate email, etc.)
                error_message = str(auth_error)
                self.logger.error(f"Supabase Auth sign_up error: {error_message}")

                validation_errors.append(f"Authentication error: {error_message}")
                return RegistrationResult(
                    success=False,
                    email=registration.email,
                    verification_status="rejected",
                    next_steps=["Please check your email and try again"],
                    validation_errors=validation_errors,
                    error_message="Failed to create user account",
                )

            # Step 4: Create Iraqi user authentication record
            # Insert user profile into iraqi_user_authentication table
            try:
                user_profile_data = {
                    "id": user_id,  # References auth.users(id)
                    "full_name": registration.full_name,
                    "email": registration.email,
                    "phone_number": registration.phone_number
                    if hasattr(registration, "phone_number")
                    else None,
                    # Iraqi context
                    "region": registration.region.value
                    if registration.region
                    else "baghdad",
                    "iraqi_id": registration.iraqi_id,
                    "iraqi_id_verified": False,  # Will be verified later
                    # Professional domain (optional)
                    "professional_domain": registration.professional_domain.value
                    if registration.professional_domain
                    else None,
                    "professional_license": registration.professional_license,
                    "professional_license_verified": False,  # Will be verified later
                    "institutional_affiliation": registration.institutional_affiliation
                    if hasattr(registration, "institutional_affiliation")
                    else None,
                    # Cultural preferences
                    "islamic_compliance_level": registration.cultural_preferences.islamic_compliance_level.value,
                    "language_preference": registration.cultural_preferences.language_preference,
                    "family_privacy_level": getattr(
                        registration.cultural_preferences,
                        "family_privacy_level",
                        "family",
                    ),
                    # Authentication settings
                    "mfa_enabled": False,  # Will be enabled by user later
                    "mfa_methods": ["email"],
                    "respect_prayer_times": True,
                    # Account status
                    "account_status": "active",
                    "verification_status": "pending",  # Email verification pending
                }

                # Insert user profile
                profile_response = (
                    self.supabase.table("iraqi_user_authentication")
                    .insert(user_profile_data)
                    .execute()
                )

                if not profile_response.data:
                    raise ValueError("Failed to insert user profile into database")

            except Exception as db_error:
                # Handle database insertion errors
                error_message = str(db_error)
                self.logger.error(
                    f"Database insert error for user {user_id}: {error_message}"
                )

                # Clean up: Delete the auth user if profile creation fails
                try:
                    self.supabase.auth.admin.delete_user(user_id)
                    self.logger.info(
                        f"Cleaned up auth user {user_id} after profile creation failure"
                    )
                except Exception as cleanup_error:
                    self.logger.error(
                        f"Failed to clean up auth user {user_id}: {cleanup_error}"
                    )

                return RegistrationResult(
                    success=False,
                    email=registration.email,
                    verification_status="rejected",
                    next_steps=["Please try again or contact support"],
                    error_message="Failed to create user profile",
                )

            # Step 5: Create cultural context record
            # Get cultural metadata for JWT and database storage
            cultural_context_metadata = CulturalContextManager.get_cultural_jwt_metadata(
                region=registration.region,
                islamic_compliance_level=registration.cultural_preferences.islamic_compliance_level,
                language_preference=registration.cultural_preferences.language_preference,
                professional_domain=(
                    registration.professional_domain.value
                    if registration.professional_domain
                    else None
                ),
                family_privacy_level=getattr(
                    registration.cultural_preferences, "family_privacy_level", "family"
                ),
                professional_etiquette_level=getattr(
                    registration.cultural_preferences,
                    "professional_etiquette_level",
                    "standard",
                ),
            )

            # Insert into authentication_cultural_context table
            try:
                cultural_context_data = {
                    "user_id": user_id,  # Foreign key to auth.users
                    # Regional context
                    "region": registration.region.value
                    if registration.region
                    else "baghdad",
                    "cultural_formality_level": "standard",  # Default
                    "professional_etiquette_level": (
                        registration.cultural_preferences.professional_etiquette_level.value
                        if (
                            hasattr(
                                registration.cultural_preferences,
                                "professional_etiquette_level",
                            )
                            and registration.cultural_preferences.professional_etiquette_level
                            is not None
                        )
                        else "standard"
                    ),
                    # Islamic preferences
                    "islamic_compliance_level": registration.cultural_preferences.islamic_compliance_level.value,
                    "prayer_time_consideration": True,
                    "islamic_greeting_preferences": cultural_context_metadata.get(
                        "islamic_greeting_preferences", {}
                    ),
                    # Language and communication
                    "primary_language": registration.cultural_preferences.language_preference,
                    "secondary_language": "en-US"
                    if registration.cultural_preferences.language_preference == "ar-IQ"
                    else "ar-IQ",
                    "dialect_preference": registration.region.value
                    if registration.region
                    else "baghdad",
                    "communication_style": "respectful",
                    # Family and privacy
                    "family_privacy_level": (
                        registration.cultural_preferences.family_privacy_level.value
                        if (
                            hasattr(
                                registration.cultural_preferences,
                                "family_privacy_level",
                            )
                            and registration.cultural_preferences.family_privacy_level
                            is not None
                        )
                        else "family"
                    ),
                    "professional_visibility": True,
                    "cultural_sensitivity_level": "high",
                    # Authentication behavior
                    "greeting_customization": cultural_context_metadata.get(
                        "greeting_customization", {}
                    ),
                    "cultural_mfa_preferences": {},
                    "timing_preferences": {"respect_prayer_times": True},
                }

                # Insert cultural context
                cultural_response = (
                    self.supabase.table("authentication_cultural_context")
                    .insert(cultural_context_data)
                    .execute()
                )

                if not cultural_response.data:
                    raise ValueError("Failed to insert cultural context into database")

            except Exception as cultural_error:
                # Handle cultural context insertion errors
                error_message = str(cultural_error)
                self.logger.error(
                    f"Cultural context insert error for user {user_id}: {error_message}"
                )

                # Clean up: Delete user profile and auth user
                try:
                    self.supabase.table("iraqi_user_authentication").delete().eq(
                        "id", user_id
                    ).execute()
                    self.supabase.auth.admin.delete_user(user_id)
                    self.logger.info(
                        f"Cleaned up user {user_id} after cultural context creation failure"
                    )
                except Exception as cleanup_error:
                    self.logger.error(
                        f"Failed to clean up user {user_id}: {cleanup_error}"
                    )

                return RegistrationResult(
                    success=False,
                    email=registration.email,
                    verification_status="rejected",
                    next_steps=["Please try again or contact support"],
                    error_message="Failed to create cultural context",
                )

            # Step 6: Create professional domain authentication if applicable
            if registration.professional_domain and license_result:
                try:
                    professional_data = {
                        "user_id": user_id,  # Foreign key to auth.users
                        # Professional details
                        "professional_domain": registration.professional_domain.value,
                        "license_number": registration.professional_license,
                        "license_type": license_result.license_type
                        if hasattr(license_result, "license_type")
                        else None,
                        "issuing_authority": license_result.issuing_authority.value
                        if hasattr(license_result, "issuing_authority")
                        else None,
                        "license_region": registration.region.value
                        if registration.region
                        else "baghdad",
                        # Verification details
                        "verification_status": "pending",  # Requires manual verification
                        "verification_method": None,  # Will be set during verification
                        "verification_date": None,
                        "verification_expiry": None,
                        # Institutional context
                        "institutional_affiliation": registration.institutional_affiliation
                        if hasattr(registration, "institutional_affiliation")
                        else None,
                        "institutional_role": None,
                        "institutional_verification_status": "pending",
                        # Professional authentication preferences
                        "professional_interface_mode": "standard",
                        "professional_greeting_style": "formal",
                        "confidentiality_level": "high",
                        # Compliance and ethics
                        "ethics_compliance_verified": False,
                        "continuing_education_verified": False,
                        "professional_standards_acknowledged": False,
                    }

                    # Insert professional domain authentication
                    professional_response = (
                        self.supabase.table("professional_domain_authentication")
                        .insert(professional_data)
                        .execute()
                    )

                    if not professional_response.data:
                        # Log warning but don't fail registration - professional verification is optional
                        self.logger.warning(
                            f"Failed to insert professional domain data for user {user_id}"
                        )

                except Exception as professional_error:
                    # Log error but don't fail registration - professional verification is optional
                    error_message = str(professional_error)
                    self.logger.error(
                        f"Professional domain insert error for user {user_id}: {error_message}"
                    )
                    # Continue with registration even if professional domain insert fails

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
                professional_etiquette_level=getattr(
                    registration.cultural_preferences,
                    "professional_etiquette_level",
                    "standard",
                ),
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
            # Step 1: First check if Supabase client is initialized
            if not self.supabase:
                raise ValueError("Supabase client not initialized")

            # Step 2: Fetch user profile to check account status BEFORE authentication
            try:
                user_profile_response = (
                    self.supabase.table("iraqi_user_authentication")
                    .select("id, account_status, login_attempts, locked_until")
                    .eq("email", login_request.email)
                    .single()
                    .execute()
                )
                user_profile = (
                    user_profile_response.data if user_profile_response.data else None
                )
            except Exception as profile_error:
                # User not found in database - return generic error for security
                self.security_logger.log_failed_login(
                    email=login_request.email,
                    ip_address=ip_address,
                    user_agent=user_agent,
                    reason="user_not_found",
                    attempts_remaining=0,
                )
                return LoginResult(
                    success=False,
                    error_message="Invalid email or password",
                )

            # Step 3: Check account lockout status
            if user_profile:
                lockout_status = AccountLockoutManager.check_lockout_status(
                    failed_attempts=user_profile.get("login_attempts", 0),
                    locked_until=user_profile.get("locked_until"),
                    last_failed_attempt=None,
                )

                if lockout_status.is_locked:
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

                # Check account status
                account_status = user_profile.get("account_status", "active")
                if account_status == "suspended":
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

            # Step 4: Authenticate with Supabase Auth
            try:
                auth_response = self.supabase.auth.sign_in_with_password(
                    {
                        "email": login_request.email,
                        "password": login_request.password,
                    }
                )

                # Check if authentication was successful
                if not auth_response.user or not auth_response.session:
                    # Authentication failed - record failed attempt
                    if user_profile:
                        (
                            new_failed_attempts,
                            new_locked_until,
                            should_notify,
                        ) = AccountLockoutManager.record_failed_attempt(
                            current_failed_attempts=user_profile.get(
                                "login_attempts", 0
                            ),
                            locked_until=user_profile.get("locked_until"),
                        )

                        # Update failed login attempts in database
                        try:
                            self.supabase.table("iraqi_user_authentication").update(
                                {
                                    "login_attempts": new_failed_attempts,
                                    "locked_until": new_locked_until.isoformat()
                                    if new_locked_until
                                    else None,
                                }
                            ).eq("email", login_request.email).execute()
                        except Exception as update_error:
                            self.logger.error(
                                f"Failed to update login attempts: {update_error}"
                            )

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

                    return LoginResult(
                        success=False,
                        error_message="Invalid email or password",
                    )

                # Authentication successful - get user_id and reset failed attempts
                user_id = auth_response.user.id

                # Reset failed login attempts on successful authentication
                try:
                    self.supabase.table("iraqi_user_authentication").update(
                        {
                            "login_attempts": 0,
                            "locked_until": None,
                            "last_login": datetime.now().isoformat(),
                        }
                    ).eq("id", user_id).execute()
                except Exception as update_error:
                    self.logger.error(
                        f"Failed to reset login attempts for user {user_id}: {update_error}"
                    )

            except Exception as auth_error:
                # Supabase Auth error (invalid credentials, etc.)
                error_message = str(auth_error)
                self.logger.error(f"Supabase Auth sign_in error: {error_message}")

                # Record failed attempt if user exists
                if user_profile:
                    (
                        new_failed_attempts,
                        new_locked_until,
                        should_notify,
                    ) = AccountLockoutManager.record_failed_attempt(
                        current_failed_attempts=user_profile.get("login_attempts", 0),
                        locked_until=user_profile.get("locked_until"),
                    )

                    try:
                        self.supabase.table("iraqi_user_authentication").update(
                            {
                                "login_attempts": new_failed_attempts,
                                "locked_until": new_locked_until.isoformat()
                                if new_locked_until
                                else None,
                            }
                        ).eq("email", login_request.email).execute()
                    except Exception as update_error:
                        self.logger.error(
                            f"Failed to update login attempts: {update_error}"
                        )

                self.security_logger.log_failed_login(
                    email=login_request.email,
                    ip_address=ip_address,
                    user_agent=user_agent,
                    reason="authentication_error",
                )

                return LoginResult(
                    success=False,
                    error_message="Invalid email or password",
                )

            # Step 4: Fetch Iraqi user authentication profile from database
            try:
                user_profile_response = (
                    self.supabase.table("iraqi_user_authentication")
                    .select(
                        "id, full_name, email, phone_number, "
                        "region, iraqi_id, iraqi_id_verified, "
                        "professional_domain, professional_license, professional_license_verified, "
                        "institutional_affiliation, "
                        "islamic_compliance_level, language_preference, family_privacy_level, "
                        "mfa_enabled, mfa_methods, respect_prayer_times, "
                        "account_status, verification_status"
                    )
                    .eq("id", user_id)
                    .single()
                    .execute()
                )

                if not user_profile_response.data:
                    raise ValueError(f"User profile not found for user_id: {user_id}")

                # Convert database row to dictionary
                user_profile = user_profile_response.data

            except Exception as profile_fetch_error:
                error_message = str(profile_fetch_error)
                self.logger.error(
                    f"Failed to fetch user profile for user {user_id}: {error_message}"
                )

                # If profile is missing, this is a critical error
                return LoginResult(
                    success=False,
                    error_message="Failed to retrieve user profile. Please contact support.",
                )

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

            # Step 6: Fetch cultural context from database
            try:
                cultural_context_response = (
                    self.supabase.table("authentication_cultural_context")
                    .select(
                        "user_id, region, cultural_formality_level, professional_etiquette_level, "
                        "islamic_compliance_level, prayer_time_consideration, islamic_greeting_preferences, "
                        "primary_language, secondary_language, dialect_preference, communication_style, "
                        "family_privacy_level, professional_visibility, cultural_sensitivity_level, "
                        "greeting_customization, cultural_mfa_preferences, timing_preferences"
                    )
                    .eq("user_id", user_id)
                    .single()
                    .execute()
                )

                # Extract cultural context data if available
                cultural_context_data = (
                    cultural_context_response.data
                    if cultural_context_response.data
                    else None
                )

            except Exception as cultural_fetch_error:
                error_message = str(cultural_fetch_error)
                self.logger.warning(
                    f"Cultural context not found for user {user_id}: {error_message}"
                )

                # Graceful fallback: Generate cultural context from user profile if database record is missing
                cultural_context_data = None

            # Build cultural context metadata (from database or fallback to user profile)
            if cultural_context_data:
                # Use database cultural context
                cultural_context = CulturalContextManager.get_cultural_jwt_metadata(
                    region=IraqiRegion(cultural_context_data["region"]),
                    islamic_compliance_level=IslamicComplianceLevel(
                        cultural_context_data["islamic_compliance_level"]
                    ),
                    language_preference=cultural_context_data["primary_language"],
                    professional_domain=user_profile.get("professional_domain"),
                    professional_etiquette_level=cultural_context_data[
                        "professional_etiquette_level"
                    ],
                )
            else:
                # Fallback: Generate cultural context from user profile
                self.logger.info(f"Using fallback cultural context for user {user_id}")
                cultural_context = CulturalContextManager.get_cultural_jwt_metadata(
                    region=IraqiRegion(user_profile["region"]),
                    islamic_compliance_level=IslamicComplianceLevel(
                        user_profile["islamic_compliance_level"]
                    ),
                    language_preference=user_profile["language_preference"],
                    professional_domain=user_profile.get("professional_domain"),
                    professional_etiquette_level="standard",  # Default fallback
                )

            # Step 7: Generate cultural greeting using cultural context data
            # Use cultural context data if available, otherwise fallback to user profile
            if cultural_context_data:
                cultural_greeting = CulturalContextManager.generate_cultural_greeting(
                    full_name=user_profile["full_name"],
                    region=IraqiRegion(cultural_context_data["region"]),
                    islamic_compliance_level=IslamicComplianceLevel(
                        cultural_context_data["islamic_compliance_level"]
                    ),
                    language_preference=cultural_context_data["primary_language"],
                    professional_domain=user_profile.get("professional_domain"),
                    professional_etiquette_level=cultural_context_data[
                        "professional_etiquette_level"
                    ],
                )
            else:
                # Fallback to user profile data
                cultural_greeting = CulturalContextManager.generate_cultural_greeting(
                    full_name=user_profile["full_name"],
                    region=IraqiRegion(user_profile["region"]),
                    islamic_compliance_level=IslamicComplianceLevel(
                        user_profile["islamic_compliance_level"]
                    ),
                    language_preference=user_profile["language_preference"],
                    professional_domain=user_profile.get("professional_domain"),
                    professional_etiquette_level="standard",  # Default fallback
                )

            # Step 8: Create device fingerprint
            device_fingerprint = DeviceFingerprintManager.create_device_fingerprint(
                user_agent=user_agent or "unknown",
                ip_address=ip_address,
            )

            # Detect suspicious activity using device fingerprint
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

            # Step 8b: Calculate comprehensive suspicious activity score
            # Uses IP-based geographic anomaly detection, unusual login time detection,
            # new device detection, and recent failed attempts analysis
            from apps.api.services.suspicious_activity_detector import (
                SuspiciousActivityDetector,
            )

            suspicious_score_result = (
                SuspiciousActivityDetector.calculate_suspicious_score(
                    user_id=user_id,
                    ip_address=ip_address,
                    device_id=device_fingerprint.device_id,
                    user_agent=user_agent,
                    supabase_client=self.supabase,
                )
            )

            # Log suspicious activity detection results
            self.logger.info(
                f"Suspicious activity score for user {user_id}: {suspicious_score_result.score:.2f} "
                f"(risk: {suspicious_score_result.risk_level})"
            )

            # Log detailed reasons if score is elevated
            if suspicious_score_result.score > 0.25:
                self.security_logger.log_suspicious_activity(
                    user_id=user_id,
                    email=login_request.email,
                    ip_address=ip_address,
                    activity_type="elevated_risk_login",
                    details={
                        "score": suspicious_score_result.score,
                        "risk_level": suspicious_score_result.risk_level,
                        "reasons": suspicious_score_result.reasons,
                        "geographic_anomaly": suspicious_score_result.geographic_anomaly_detected,
                        "unusual_time": suspicious_score_result.unusual_time_detected,
                        "new_device": suspicious_score_result.device_change_detected,
                    },
                    severity=SecurityEventSeverity.HIGH
                    if suspicious_score_result.risk_level == "critical"
                    else SecurityEventSeverity.MEDIUM,
                )

            # Step 9: Check if MFA is required based on suspicious activity score
            # MFA is triggered if:
            # 1. User has MFA enabled (every login)
            # 2. New device is detected
            # 3. Suspicious activity score >= 0.50 (high or critical risk)
            is_suspicious = (
                len(device_fingerprint.suspicious_indicators) > 0
                or suspicious_score_result.score
                >= SuspiciousActivityDetector.MFA_TRIGGER_THRESHOLD
            )

            requires_mfa, mfa_reason = MFAManager.should_require_mfa(
                user_id=user_id,
                device_id=device_fingerprint.device_id,
                mfa_frequency=MFAFrequency.EVERY_LOGIN
                if user_profile.get("mfa_enabled")
                else MFAFrequency.NEW_DEVICE,
                is_suspicious_activity=is_suspicious,
            )

            if requires_mfa:
                # Setup MFA with Aladhan prayer time integration
                mfa_methods = user_profile.get("mfa_methods", ["email"])
                primary_method = MFAMethod(mfa_methods[0] if mfa_methods else "email")

                # Get user's region for prayer times (default to Baghdad)
                user_region = user_profile.get("region", "baghdad")

                mfa_setup = await MFAManager.setup_mfa(
                    user_id=user_id,
                    method=primary_method,
                    destination=login_request.email,
                    respect_prayer_times=respect_prayer_times,
                    cultural_timing_flexibility=cultural_timing_flexibility,
                    city=user_region,
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

            # Step 10b: Store session in database with suspicious activity score
            # Insert session into iraqi_authentication_sessions table
            try:
                session_data = {
                    "id": session_result.session_id,
                    "user_id": user_id,
                    "session_token": session_result.tokens.access_token,
                    "refresh_token": session_result.tokens.refresh_token,
                    "expires_at": session_result.expires_at.isoformat(),
                    "device_id": device_fingerprint.device_id,
                    "device_type": login_request.device_type,
                    "platform": login_request.platform,
                    "ip_address": ip_address,
                    "user_agent": user_agent,
                    "cultural_context_snapshot": cultural_context,
                    "language_used": cultural_context.get(
                        "language_preference", "ar-IQ"
                    ),
                    "regional_context": cultural_context.get("region", "baghdad"),
                    "professional_session_mode": user_profile.get("professional_domain")
                    is not None,
                    "login_method": "password",
                    "mfa_completed": False,  # Will be updated to True after MFA if required
                    "suspicious_activity_score": round(
                        suspicious_score_result.score, 2
                    ),
                    "session_status": "active",
                }

                # Insert session into database
                self.supabase.table("iraqi_authentication_sessions").insert(
                    session_data
                ).execute()

                self.logger.info(
                    f"Session {session_result.session_id} stored in database with "
                    f"suspicious_activity_score: {suspicious_score_result.score:.2f}"
                )

            except Exception as session_insert_error:
                error_message = str(session_insert_error)
                self.logger.warning(
                    f"Failed to insert session into database: {error_message}"
                )
                # Non-critical error - session exists in memory, continue with login

            # Step 11: Query professional verification status if user has professional domain
            professional_license_verified = user_profile.get(
                "professional_license_verified", False
            )

            if user_profile.get("professional_domain"):
                try:
                    professional_response = (
                        self.supabase.table("professional_domain_authentication")
                        .select(
                            "verification_status, license_number, professional_domain"
                        )
                        .eq("user_id", user_id)
                        .single()
                        .execute()
                    )

                    if professional_response.data:
                        professional_data = professional_response.data
                        # Check if professional license is verified
                        professional_license_verified = (
                            professional_data.get("verification_status") == "verified"
                        )
                except Exception as prof_error:
                    self.logger.warning(
                        f"Professional verification check failed for user {user_id}: {prof_error}"
                    )
                    # Keep the value from user profile as fallback

            # Step 12: Build verification status from database with prompts
            iraqi_id_verified = user_profile.get("iraqi_id_verified", False)

            # Generate verification prompts for unverified items
            verification_prompts = []

            if not iraqi_id_verified:
                verification_prompts.append(
                    "Please verify your Iraqi National ID to access full features. "
                    "Go to Profile > Verification to complete this step."
                )

            if (
                user_profile.get("professional_domain")
                and not professional_license_verified
            ):
                professional_domain = user_profile.get(
                    "professional_domain", "professional"
                )
                verification_prompts.append(
                    f"Please verify your {professional_domain} license to access professional features. "
                    "Go to Profile > Professional Verification to complete this step."
                )

            verification_status = VerificationStatus(
                email_verified=True,  # User logged in successfully
                iraqi_id_verified=iraqi_id_verified,
                professional_license_verified=professional_license_verified,
                overall_status=user_profile.get("verification_status", "pending"),
                verification_prompts=verification_prompts,
            )

            # Step 13: Update last_login timestamp in database
            try:
                self.supabase.table("iraqi_user_authentication").update(
                    {
                        "last_login": datetime.now().isoformat(),
                    }
                ).eq("id", user_id).execute()
            except Exception as update_error:
                self.logger.warning(
                    f"Failed to update last_login for user {user_id}: {update_error}"
                )
                # Non-critical error, continue with login

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
            # Step 1: Fetch MFA configuration from database
            if not self.supabase:
                raise ValueError("Supabase client not initialized")

            try:
                # Query cultural_mfa_configuration table for user's MFA settings
                mfa_config_response = (
                    self.supabase.table("cultural_mfa_configuration")
                    .select(
                        "id, user_id, enabled_methods, primary_method, backup_methods, "
                        "respect_prayer_times, cultural_timing_flexibility, "
                        "sms_phone_number, sms_language_preference, "
                        "backup_email, email_language_preference, email_cultural_formality, "
                        "mfa_frequency, remember_device_duration"
                    )
                    .eq("user_id", user_id)
                    .single()
                    .execute()
                )

                mfa_config = (
                    mfa_config_response.data if mfa_config_response.data else None
                )

            except Exception as mfa_config_error:
                error_message = str(mfa_config_error)
                self.logger.warning(
                    f"MFA config not found for user {user_id}: {error_message}"
                )

                # Graceful fallback: Use default MFA configuration
                mfa_config = {
                    "primary_method": "email",
                    "enabled_methods": ["email"],
                    "respect_prayer_times": True,
                    "cultural_timing_flexibility": 15,
                }

            # Step 2: For now, we're using verification_id as the stored hash
            # In a real implementation, this would be stored in a separate mfa_verifications table
            # with the verification_id as the key and the hashed code as the value
            stored_hash = (
                verification_id  # Placeholder - should fetch from verification table
            )
            attempts_used = 0  # Should also fetch from verification table

            # Step 3: Verify MFA code with cultural timing flexibility
            # Note: Prayer time flexibility is respected through the mfa_config settings
            # The cultural_timing_flexibility field (default 15 minutes) allows users to
            # complete MFA verification even during prayer times with extended timeout
            # This is implemented in the MFA delivery service (SMS/Email timing)
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

            # Step 4: Log successful MFA verification with actual method
            mfa_method = (
                mfa_config.get("primary_method", "email") if mfa_config else "email"
            )
            self.security_logger.log_mfa_verified(
                user_id=user_id,
                email=email,
                mfa_method=mfa_method,
                ip_address=ip_address,
            )

            # Step 5: Fetch user profile and cultural context for session creation
            try:
                user_profile_response = (
                    self.supabase.table("iraqi_user_authentication")
                    .select(
                        "id, full_name, email, region, islamic_compliance_level, language_preference"
                    )
                    .eq("id", user_id)
                    .single()
                    .execute()
                )
                user_profile = (
                    user_profile_response.data if user_profile_response.data else None
                )
            except Exception as profile_error:
                self.logger.warning(
                    f"User profile not found for user {user_id}: {profile_error}"
                )
                user_profile = None

            # Fetch cultural context
            try:
                cultural_context_response = (
                    self.supabase.table("authentication_cultural_context")
                    .select(
                        "user_id, region, islamic_compliance_level, primary_language, cultural_sensitivity_level"
                    )
                    .eq("user_id", user_id)
                    .single()
                    .execute()
                )
                cultural_context_data = (
                    cultural_context_response.data
                    if cultural_context_response.data
                    else None
                )
            except Exception as cultural_error:
                self.logger.warning(
                    f"Cultural context not found for user {user_id}: {cultural_error}"
                )
                cultural_context_data = None

            # Build cultural context for session
            if cultural_context_data:
                cultural_context = {
                    "region": cultural_context_data.get("region"),
                    "islamic_compliance_level": cultural_context_data.get(
                        "islamic_compliance_level"
                    ),
                    "language_preference": cultural_context_data.get(
                        "primary_language"
                    ),
                    "cultural_sensitivity_level": cultural_context_data.get(
                        "cultural_sensitivity_level"
                    ),
                }
            elif user_profile:
                # Fallback to user profile
                cultural_context = {
                    "region": user_profile.get("region"),
                    "islamic_compliance_level": user_profile.get(
                        "islamic_compliance_level"
                    ),
                    "language_preference": user_profile.get("language_preference"),
                }
            else:
                # Default cultural context
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

    def get_user_profile(
        self,
        user_id: str,
    ) -> dict:
        """
        Fetch complete user profile with cultural context and verification status

        Args:
            user_id: User ID from authenticated session

        Returns:
            Complete user profile dictionary with all related data
        """
        try:
            # Step 1: Fetch user authentication profile
            if not self.supabase:
                raise ValueError("Supabase client not initialized")

            try:
                user_profile_response = (
                    self.supabase.table("iraqi_user_authentication")
                    .select(
                        "id, full_name, email, phone_number, "
                        "region, iraqi_id, iraqi_id_verified, "
                        "professional_domain, professional_license, professional_license_verified, "
                        "institutional_affiliation, "
                        "islamic_compliance_level, language_preference, family_privacy_level, "
                        "mfa_enabled, mfa_methods, respect_prayer_times, "
                        "account_status, verification_status, "
                        "created_at, last_login"
                    )
                    .eq("id", user_id)
                    .single()
                    .execute()
                )

                if not user_profile_response.data:
                    raise ValueError(f"User profile not found for user_id: {user_id}")

                user_profile = user_profile_response.data

            except Exception as profile_error:
                error_message = str(profile_error)
                self.logger.error(
                    f"Failed to fetch user profile for user {user_id}: {error_message}"
                )
                raise ValueError("Failed to retrieve user profile")

            # Step 2: Fetch cultural context
            cultural_context = None
            try:
                cultural_context_response = (
                    self.supabase.table("authentication_cultural_context")
                    .select(
                        "user_id, region, cultural_formality_level, professional_etiquette_level, "
                        "islamic_compliance_level, prayer_time_consideration, islamic_greeting_preferences, "
                        "primary_language, secondary_language, dialect_preference, communication_style, "
                        "family_privacy_level, professional_visibility, cultural_sensitivity_level, "
                        "greeting_customization, cultural_mfa_preferences, timing_preferences"
                    )
                    .eq("user_id", user_id)
                    .single()
                    .execute()
                )

                cultural_context = (
                    cultural_context_response.data
                    if cultural_context_response.data
                    else None
                )

            except Exception as cultural_error:
                self.logger.warning(
                    f"Cultural context not found for user {user_id}: {cultural_error}"
                )
                # Continue without cultural context

            # Step 3: Fetch professional domain authentication if applicable
            professional_auth = None
            if user_profile.get("professional_domain"):
                try:
                    professional_response = (
                        self.supabase.table("professional_domain_authentication")
                        .select(
                            "user_id, professional_domain, license_number, license_type, "
                            "issuing_authority, license_region, "
                            "verification_status, verification_method, verification_date, verification_expiry, "
                            "institutional_affiliation, institutional_role, institutional_verification_status, "
                            "professional_interface_mode, professional_greeting_style, confidentiality_level, "
                            "ethics_compliance_verified, continuing_education_verified, professional_standards_acknowledged"
                        )
                        .eq("user_id", user_id)
                        .single()
                        .execute()
                    )

                    professional_auth = (
                        professional_response.data
                        if professional_response.data
                        else None
                    )

                except Exception as prof_error:
                    self.logger.warning(
                        f"Professional authentication not found for user {user_id}: {prof_error}"
                    )
                    # Continue without professional auth

            # Step 4: Build verification status
            professional_license_verified = user_profile.get(
                "professional_license_verified", False
            )
            if professional_auth:
                professional_license_verified = (
                    professional_auth.get("verification_status") == "verified"
                )

            verification_status = {
                "email_verified": True,  # User has authenticated session
                "iraqi_id_verified": user_profile.get("iraqi_id_verified", False),
                "professional_license_verified": professional_license_verified,
                "overall_status": user_profile.get("verification_status", "pending"),
            }

            # Step 5: Build complete profile response
            complete_profile = {
                "user_profile": user_profile,
                "cultural_context": cultural_context,
                "professional_authentication": professional_auth,
                "verification_status": verification_status,
            }

            return complete_profile

        except Exception as e:
            self.logger.exception(
                f"Error fetching user profile for user {user_id}: {str(e)}"
            )
            raise
