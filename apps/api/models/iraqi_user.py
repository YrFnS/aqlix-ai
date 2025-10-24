"""
Pydantic models for Iraqi user authentication
Defines data structures for user registration, authentication, and cultural context
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, validator
from enum import Enum


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
    """Iraqi regions"""

    BAGHDAD = "baghdad"
    BASRA = "basra"
    MOSUL = "mosul"
    ERBIL = "erbil"
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
    """Iraqi user registration request"""

    # Basic information
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(
        ...,
        min_length=8,
        description="Password (min 8 chars, must include uppercase, lowercase, number)",
    )
    full_name: str = Field(..., min_length=2, max_length=200, description="Full name")

    # Iraqi context
    region: IraqiRegion = Field(default=IraqiRegion.BAGHDAD, description="Iraqi region")
    iraqi_id: Optional[str] = Field(
        default=None, description="Optional Iraqi national ID (12 digits)"
    )

    # Professional context
    professional_domain: Optional[ProfessionalDomain] = Field(
        default=None, description="Professional domain (legal, medical, etc.)"
    )
    professional_license: Optional[str] = Field(
        default=None, description="Professional license number"
    )
    institutional_affiliation: Optional[str] = Field(
        default=None, description="Institutional affiliation"
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
        """Validate password strength"""
        import re

        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")

        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")

        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter")

        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one number")

        return v

    @validator("iraqi_id")
    def validate_iraqi_id(cls, v, values):
        """Validate Iraqi ID format if provided"""
        if v is None:
            return v

        import re

        # Iraqi ID format: 12 digits with regional prefix
        regional_prefixes = {
            IraqiRegion.BAGHDAD: "10",
            IraqiRegion.BASRA: "06",
            IraqiRegion.MOSUL: "02",
            IraqiRegion.ERBIL: "05",
        }

        region = values.get("region", IraqiRegion.OTHER)

        if region != IraqiRegion.OTHER:
            expected_prefix = regional_prefixes.get(region)
            if expected_prefix:
                pattern = f"^{expected_prefix}\\d{{10}}$"
                if not re.match(pattern, v):
                    raise ValueError(
                        f"Iraqi ID must start with {expected_prefix} for {region.value} region "
                        f"and be 12 digits total"
                    )
        else:
            # Generic validation for 'other' region
            if not re.match(r"^\d{12}$", v):
                raise ValueError("Iraqi ID must be 12 digits")

        return v


class LoginRequest(BaseModel):
    """User login request"""

    email: EmailStr
    password: str
    device_id: Optional[str] = None
    device_type: Optional[str] = None
    platform: Optional[str] = None


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
    """MFA setup request"""

    method: str = Field(..., description="MFA method (sms, email, cultural_questions)")
    phone_number: Optional[str] = Field(
        default=None, description="Phone number for SMS MFA"
    )
    backup_email: Optional[str] = Field(
        default=None, description="Backup email for MFA"
    )
    respect_prayer_times: bool = Field(
        default=True, description="Respect prayer times for MFA prompts"
    )
    cultural_timing_flexibility: int = Field(
        default=15, description="Cultural timing flexibility in minutes"
    )


class MFAVerificationRequest(BaseModel):
    """MFA verification request"""

    verification_id: str
    code: str
    user_id: str = Field(..., description="User ID for MFA verification")
    device_id: Optional[str] = None
    remember_device: bool = Field(
        default=False, description="Remember this device for future logins"
    )


class PasswordResetRequest(BaseModel):
    """Password reset request"""

    email: EmailStr


class PasswordResetConfirmation(BaseModel):
    """Password reset confirmation"""

    token: str
    new_password: str

    @validator("new_password")
    def validate_password_strength(cls, v):
        """Validate password strength"""
        import re

        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")

        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")

        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter")

        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one number")

        return v


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
