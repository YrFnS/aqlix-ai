"""
Pydantic models for Iraqi user authentication
Defines data structures for user registration, authentication, and cultural context
Integrated with comprehensive input validation services
"""

import logging
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, validator
from enum import Enum

# Configure security logger
security_logger = logging.getLogger("security.xss_sanitization")


class ProfessionalDomain(str, Enum):
    """Iraqi professional domain types"""

    LEGAL = "legal"
    MEDICAL = "medical"
    EDUCATIONAL = "educational"
    ENGINEERING = "engineering"
    ORGANIZATIONAL = "organizational"


class IslamicComplianceLevel(str, Enum):
    """Islamic compliance level preferences"""

    BASIC = "basic"
    STANDARD = "standard"
    STRICT = "strict"


class IraqiRegion(str, Enum):
    """Iraqi regions (19 governorates)"""

    # Major cities
    BAGHDAD = "baghdad"
    BASRA = "basra"
    MOSUL = "mosul"  # Nineveh governorate
    ERBIL = "erbil"

    # Other governorates
    KIRKUK = "kirkuk"
    DIYALA = "diyala"
    ANBAR = "anbar"
    NAJAF = "najaf"
    KARBALA = "karbala"
    WASIT = "wasit"
    SALADIN = "saladin"
    QADISIYYAH = "qadisiyyah"
    BABIL = "babil"
    DHI_QAR = "dhi_qar"
    MAYSAN = "maysan"
    MUTHANNA = "muthanna"
    DOHUK = "dohuk"
    SULAYMANIYAH = "sulaymaniyah"
    HALABJA = "halabja"

    OTHER = "other"


class CulturalPreferences(BaseModel):
    """Cultural preferences for Iraqi users"""

    islamic_compliance_level: IslamicComplianceLevel = Field(
        default=IslamicComplianceLevel.STANDARD,
        description="Level of Islamic compliance",
    )
    language_preference: str = Field(
        default="ar-IQ", description="Preferred language (ar-IQ, en-US, both)"
    )
    regional_cultural_variation: Optional[str] = Field(
        default=None, description="Regional cultural variation"
    )
    professional_etiquette_level: str = Field(
        default="standard",
        description="Professional etiquette level (standard, formal, traditional)",
    )
    family_privacy_level: str = Field(
        default="family", description="Family privacy level (public, family, private)"
    )
    respect_prayer_times: bool = Field(
        default=True, description="Respect prayer times for notifications and MFA"
    )


class IraqiUserRegistration(BaseModel):
    """Iraqi user registration request with comprehensive input validation"""

    # Basic information
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(
        ...,
        min_length=8,
        max_length=72,  # Bcrypt limit
        description="Password (min 8 chars, must include uppercase, lowercase, number, special char)",
    )
    full_name: str = Field(
        ...,
        min_length=2,
        max_length=200,
        description="Full name (Arabic + English supported)",
    )

    # Iraqi context
    region: IraqiRegion = Field(default=IraqiRegion.BAGHDAD, description="Iraqi region")
    iraqi_id: Optional[str] = Field(
        default=None,
        description="Optional Iraqi national ID (15 digits: XXX-XXXX-XXXXXXX-X)",
    )

    # Professional context
    professional_domain: Optional[ProfessionalDomain] = Field(
        default=None, description="Professional domain (legal, medical, etc.)"
    )
    professional_license: Optional[str] = Field(
        default=None, description="Professional license number"
    )
    institutional_affiliation: Optional[str] = Field(
        default=None, max_length=500, description="Institutional affiliation"
    )

    # Cultural preferences
    cultural_preferences: CulturalPreferences = Field(
        default_factory=CulturalPreferences, description="Cultural preferences"
    )

    # Privacy preferences
    professional_visibility: bool = Field(
        default=True, description="Professional visibility"
    )

    @validator("password")
    def validate_password_strength(cls, v):
        """
        Validate password strength using comprehensive validation

        Integrated with PasswordUtils for consistent validation
        """
        from apps.api.services.password_utils import PasswordUtils

        result = PasswordUtils.validate_password_strength(v)

        if not result.is_valid:
            error_msg = "; ".join(result.missing_requirements)
            raise ValueError(f"Password validation failed: {error_msg}")

        return v

    @validator("full_name")
    def validate_full_name(cls, v):
        """
        Validate full name with Arabic + English support

        Uses InputValidator for comprehensive name validation
        """
        if not v or not v.strip():
            raise ValueError("Full name cannot be empty")

        from apps.api.services.input_validator import InputValidator

        result = InputValidator.validate_name(v.strip())

        if not result.is_valid:
            raise ValueError(result.error_message)

        # Check for XSS patterns
        has_xss, xss_warnings = InputValidator.detect_xss_patterns(v)
        if has_xss:
            raise ValueError("Full name contains potentially dangerous characters")

        return result.sanitized_value

    @validator("iraqi_id")
    def validate_iraqi_id_format(cls, v, values):
        """
        Validate Iraqi ID format (15 digits)

        Updated from 12 digits to 15 digits per Task 115 requirements
        Uses InputValidator for comprehensive validation
        """
        if v is None:
            return v

        from apps.api.services.input_validator import InputValidator

        result = InputValidator.validate_iraqi_id(v.strip(), allow_formatted=True)

        if not result.is_valid:
            raise ValueError(result.error_message)

        # Regional prefix validation (optional, can be enhanced)
        region = values.get("region")
        if region and result.validation_details.get("regional_prefix"):
            # Note: Regional prefix mapping for 15-digit format may differ
            # This is a placeholder for future enhancement
            pass

        return result.sanitized_value

    @validator("professional_license")
    def validate_professional_license_format(cls, v, values):
        """
        Validate professional license format

        Uses ProfessionalLicenseValidator for domain-specific validation
        """
        if v is None:
            return v

        domain = values.get("professional_domain")
        if not domain:
            raise ValueError("Professional domain required when license provided")

        from apps.api.services.professional_license_validator import (
            ProfessionalLicenseValidator,
        )

        result = ProfessionalLicenseValidator.validate(
            license_number=v.strip(), domain=domain
        )

        if not result.is_valid:
            raise ValueError(result.error_message)

        return v.strip()

    @validator("institutional_affiliation")
    def validate_institutional_affiliation(cls, v):
        """
        Validate institutional affiliation (sanitize for XSS)

        Logs security events when XSS sanitization modifies content
        """
        if v is None:
            return v

        from apps.api.services.xss_sanitizer import XSSSanitizer, SanitizationLevel

        # Strip HTML for institutional affiliation
        result = XSSSanitizer.sanitize(v.strip(), level=SanitizationLevel.STRICT)

        if result.was_modified:
            # Log security warning if content was modified
            try:
                # Redact potentially sensitive content - only log first/last 10 chars
                original_preview = (
                    v[:10] + "..." + v[-10:] if len(v) > 20 else "[REDACTED]"
                )
                sanitized_preview = (
                    result.sanitized_value[:10] + "..." + result.sanitized_value[-10:]
                    if len(result.sanitized_value) > 20
                    else result.sanitized_value
                )

                security_logger.warning(
                    "XSS sanitization modified institutional_affiliation",
                    extra={
                        "field": "institutional_affiliation",
                        "original_preview": original_preview,
                        "sanitized_preview": sanitized_preview,
                        "removed_elements": result.removed_elements,
                        "security_warnings": result.security_warnings,
                        "sanitization_level": result.sanitization_level.value,
                        "context": "user_registration",
                    },
                )
            except Exception as log_error:
                # Ensure logging errors don't break validation
                security_logger.error(
                    f"Failed to log XSS sanitization event: {log_error}"
                )

        return result.sanitized_value


class LoginRequest(BaseModel):
    """User login request with input validation"""

    email: EmailStr
    password: str
    device_id: Optional[str] = Field(default=None, max_length=200)
    device_type: Optional[str] = Field(default=None, max_length=100)
    platform: Optional[str] = Field(default=None, max_length=100)

    @validator("device_id", "device_type", "platform")
    def validate_device_fields(cls, v):
        """Validate device fields for XSS"""
        if v is None:
            return v

        from apps.api.services.xss_sanitizer import XSSSanitizer, SanitizationLevel

        result = XSSSanitizer.sanitize(v.strip(), level=SanitizationLevel.STRICT)
        return result.sanitized_value


class CulturalContext(BaseModel):
    """Cultural context for authentication"""

    id: str
    region: IraqiRegion
    islamic_compliance_level: IslamicComplianceLevel
    language_preference: str
    cultural_formality_level: str
    professional_etiquette_level: str
    prayer_time_consideration: bool
    family_privacy_level: str
    professional_visibility: bool
    greeting_customization: dict = Field(default_factory=dict)
    timing_preferences: dict = Field(default_factory=dict)


class ProfessionalContext(BaseModel):
    """Professional context for authenticated users"""

    domain: ProfessionalDomain
    license_verified: bool
    institutional_affiliation: Optional[str]
    professional_interface_mode: str
    confidentiality_level: str


class CulturalGreeting(BaseModel):
    """Culturally appropriate greeting"""

    primary_greeting: str
    regional_variation: Optional[str]
    professional_suffix: Optional[str]
    time_based_adjustment: str
    cultural_respect_level: str


class VerificationStatus(BaseModel):
    """User verification status"""

    email_verified: bool
    iraqi_id_verified: bool
    professional_license_verified: bool
    overall_status: str  # pending, email_verified, fully_verified
    verification_prompts: List[
        str
    ] = []  # Messages to show user about pending verifications


class AuthenticationResult(BaseModel):
    """Authentication result response"""

    success: bool
    user: Optional[dict] = None
    session_token: Optional[str] = None
    refresh_token: Optional[str] = None
    cultural_context: Optional[CulturalContext] = None
    professional_context: Optional[ProfessionalContext] = None
    cultural_greeting: Optional[CulturalGreeting] = None
    verification_status: Optional[VerificationStatus] = None
    next_steps: Optional[List[str]] = None
    error: Optional[str] = None
    error_code: Optional[int] = None
    validation_errors: Optional[List[str]] = None


class MFASetupRequest(BaseModel):
    """MFA setup request with input validation"""

    method: str = Field(..., description="MFA method (sms, email, cultural_questions)")
    phone_number: Optional[str] = Field(
        default=None, description="Phone number for SMS MFA"
    )
    backup_email: Optional[EmailStr] = Field(
        default=None, description="Backup email for MFA"
    )
    respect_prayer_times: bool = Field(
        default=True, description="Respect prayer times for MFA prompts"
    )
    cultural_timing_flexibility: int = Field(
        default=15, ge=0, le=60, description="Cultural timing flexibility in minutes"
    )

    @validator("phone_number")
    def validate_phone_number(cls, v):
        """Validate Iraqi phone number format"""
        if v is None:
            return v

        from apps.api.services.input_validator import InputValidator

        result = InputValidator.validate_phone(v.strip())

        if not result.is_valid:
            raise ValueError(result.error_message)

        return result.sanitized_value


class MFAVerificationRequest(BaseModel):
    """MFA verification request"""

    verification_id: str
    code: str = Field(..., min_length=4, max_length=10)
    device_id: Optional[str] = Field(default=None, max_length=200)
    remember_device: bool = Field(
        default=False, description="Remember this device for future logins"
    )

    @validator("code")
    def validate_code(cls, v):
        """Validate MFA code (digits only)"""
        if not v.isdigit():
            raise ValueError("MFA code must contain only digits")
        return v

    @validator("verification_id", "device_id")
    def sanitize_ids(cls, v):
        """Sanitize ID fields"""
        if v is None:
            return v

        from apps.api.services.xss_sanitizer import XSSSanitizer, SanitizationLevel

        result = XSSSanitizer.sanitize(v.strip(), level=SanitizationLevel.STRICT)
        return result.sanitized_value


class PasswordResetRequest(BaseModel):
    """Password reset request"""

    email: EmailStr


class PasswordResetConfirmation(BaseModel):
    """Password reset confirmation"""

    token: str = Field(..., max_length=500)
    new_password: str = Field(..., min_length=8, max_length=72)

    @validator("new_password")
    def validate_password_strength(cls, v):
        """Validate password strength"""
        from apps.api.services.password_utils import PasswordUtils

        result = PasswordUtils.validate_password_strength(v)

        if not result.is_valid:
            error_msg = "; ".join(result.missing_requirements)
            raise ValueError(f"Password validation failed: {error_msg}")

        return v

    @validator("token")
    def sanitize_token(cls, v):
        """Sanitize token"""
        from apps.api.services.xss_sanitizer import XSSSanitizer, SanitizationLevel

        result = XSSSanitizer.sanitize(v.strip(), level=SanitizationLevel.STRICT)
        return result.sanitized_value


class SessionInfo(BaseModel):
    """Session information"""

    session_id: str
    user_id: str
    device_id: Optional[str]
    device_type: Optional[str]
    platform: Optional[str]
    created_at: datetime
    expires_at: datetime
    last_activity: datetime
    cultural_context_snapshot: dict
    professional_session_mode: bool
