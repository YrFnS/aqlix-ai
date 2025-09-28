"""
User Management Database Models for Iraqi AI Chat System
======================================================

Comprehensive user management models extracted and enhanced from Langflow with
sophisticated Iraqi cultural integration, professional domain specialization,
and Islamic compliance for authentic Iraqi user experiences.

These models provide the foundation for user authentication, profile management,
and cultural preferences specifically designed for Iraqi professional contexts.

Key Features:
- Iraqi Professional Integration: Lawyer, doctor, teacher, engineer, student, business, government
- Islamic Compliance: Prayer times, Islamic calendar, halal content preferences
- Arabic Language Support: RTL layout, Arabic names, dialect preferences
- Cultural Preferences: Regional context, sectarian neutrality, privacy settings
- Session Management: 1-hour privacy-first session expiration
- Payment Integration: Iraqi payment gateways and credit management

Author: Claude AI Assistant
Created: 2025-01-03
Version: 1.0.0 - Revolutionary User Models for Iraqi AI Systems
"""

import uuid
from datetime import datetime, timedelta
from enum import Enum
from typing import Dict, List, Optional, Any, Union
from sqlalchemy import (
    Column,
    String,
    Integer,
    DateTime,
    Boolean,
    Text,
    JSON,
    ForeignKey,
    Float,
    Index,
    UniqueConstraint,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, ARRAY
import hashlib
import secrets

Base = declarative_base()


class UserStatus(Enum):
    """User account status."""

    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
    PENDING_VERIFICATION = "pending_verification"
    CULTURALLY_REVIEWING = "culturally_reviewing"
    BANNED = "banned"


class ProfessionalDomainType(Enum):
    """Iraqi professional domain types."""

    LEGAL = "legal"  # قانوني - Lawyers, judges, legal professionals
    MEDICAL = "medical"  # طبي - Doctors, nurses, medical professionals
    EDUCATIONAL = "educational"  # تعليمي - Teachers, professors, educators
    ENGINEERING = "engineering"  # هندسي - Engineers, technical professionals
    GOVERNMENT = "government"  # حكومي - Government employees, civil servants
    BUSINESS = "business"  # تجاري - Business professionals, entrepreneurs
    STUDENT = "student"  # طالب - Students, researchers
    GENERAL = "general"  # عام - General users


class SubscriptionTier(Enum):
    """Iraqi payment-adapted subscription tiers."""

    FREE = "free"  # مجاني - 50 messages/month
    STARTER = "starter"  # مبتدئ - 500 messages/month, 5000 IQD
    STANDARD = "standard"  # قياسي - 2000 messages/month, 15000 IQD
    PROFESSIONAL = "professional"  # مهني - 8000 messages/month, 45000 IQD
    BUSINESS = "business"  # تجاري - Unlimited messages, 100000 IQD
    ENTERPRISE = "enterprise"  # مؤسسي - Custom pricing, advanced features


class RegionalContext(Enum):
    """Iraqi regional contexts."""

    BAGHDAD = "baghdad"  # بغداد
    BASRA = "basra"  # البصرة
    KURDISTAN = "kurdistan"  # كردستان
    NAJAF = "najaf"  # النجف
    KARBALA = "karbala"  # كربلاء
    MOSUL = "mosul"  # الموصل
    ANBAR = "anbar"  # الأنبار
    OTHER = "other"  # أخرى


class DialectPreference(Enum):
    """Iraqi Arabic dialect preferences."""

    IRAQI_BAGHDADI = "iraqi_baghdadi"  # بغدادي
    IRAQI_BASRAWI = "iraqi_basrawi"  # بصراوي
    IRAQI_KURDISH = "iraqi_kurdish"  # كردي عراقي
    FORMAL_ARABIC = "formal_arabic"  # فصحى
    MIXED = "mixed"  # مختلط


class IslamicComplianceLevel(Enum):
    """Islamic compliance preference levels."""

    STRICT = "strict"  # صارم - Maximum Islamic compliance
    STANDARD = "standard"  # قياسي - Standard Islamic guidelines
    MODERATE = "moderate"  # معتدل - Moderate Islamic consideration
    MINIMAL = "minimal"  # أدنى - Minimal Islamic filtering


class User(Base):
    """
    Core user model with Iraqi cultural and professional integration.

    Enhanced from Langflow with comprehensive Iraqi professional domain support,
    Islamic compliance preferences, and Arabic language capabilities.
    """

    __tablename__ = "users"

    # Primary identification
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String(255), nullable=False, unique=True, index=True)
    email = Column(String(255), nullable=False, unique=True, index=True)

    # Iraqi phone number support
    phone_number = Column(
        String(20), nullable=True, index=True, comment="+964 Iraqi phone format"
    )
    phone_verified = Column(Boolean, default=False)
    phone_verification_code = Column(String(10), nullable=True)
    phone_verification_expires_at = Column(DateTime, nullable=True)

    # Authentication
    password_hash = Column(String(255), nullable=False)
    salt = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, index=True)
    status = Column(
        String(50),
        nullable=False,
        default=UserStatus.PENDING_VERIFICATION.value,
        index=True,
    )

    # Profile information
    first_name = Column(String(255), nullable=True)
    last_name = Column(String(255), nullable=True)
    first_name_arabic = Column(Text, nullable=True, comment="Arabic first name")
    last_name_arabic = Column(Text, nullable=True, comment="Arabic last name")
    full_name_arabic = Column(Text, nullable=True, comment="Complete Arabic name")

    # Professional context
    professional_domain = Column(String(50), nullable=True, index=True)
    job_title = Column(String(255), nullable=True)
    job_title_arabic = Column(Text, nullable=True)
    organization_name = Column(String(255), nullable=True)
    organization_name_arabic = Column(Text, nullable=True)

    # Iraqi regional and cultural context
    regional_context = Column(String(50), nullable=True, index=True)
    dialect_preference = Column(String(50), nullable=True, index=True)
    islamic_compliance_level = Column(
        String(50),
        nullable=False,
        default=IslamicComplianceLevel.STANDARD.value,
        index=True,
    )
    cultural_sensitivity_level = Column(String(50), nullable=False, default="high")

    # Subscription and billing
    subscription_tier = Column(
        String(50), nullable=False, default=SubscriptionTier.FREE.value, index=True
    )
    credit_balance = Column(Float, default=0.0, comment="Available credits")
    monthly_usage_limit = Column(
        Integer, nullable=True, comment="Monthly message limit"
    )
    current_month_usage = Column(
        Integer, default=0, comment="Current month messages used"
    )
    usage_reset_date = Column(DateTime, nullable=True, comment="Next usage reset date")

    # Privacy and data preferences
    data_retention_preference = Column(
        String(50), nullable=False, default="session_only"
    )
    session_expiry_hours = Column(Integer, nullable=False, default=1)
    analytics_opt_in = Column(Boolean, default=False)
    marketing_opt_in = Column(Boolean, default=False)

    # Security settings
    two_factor_enabled = Column(Boolean, default=False)
    two_factor_secret = Column(String(255), nullable=True)
    failed_login_attempts = Column(Integer, default=0)
    account_locked_until = Column(DateTime, nullable=True)
    password_last_changed = Column(DateTime, nullable=True)

    # Activity tracking
    last_login_at = Column(DateTime, nullable=True, index=True)
    last_login_ip = Column(String(45), nullable=True)
    login_count = Column(Integer, default=0)
    total_messages_sent = Column(Integer, default=0)
    total_documents_processed = Column(Integer, default=0)
    total_voice_messages = Column(Integer, default=0)

    # Cultural engagement metrics
    cultural_appropriateness_score = Column(
        Float, nullable=True, comment="User's cultural content score"
    )
    islamic_compliance_adherence = Column(
        Float, nullable=True, comment="User's Islamic compliance rate"
    )
    professional_engagement_level = Column(String(50), nullable=True)

    # Verification and validation
    email_verified = Column(Boolean, default=False)
    email_verification_token = Column(String(255), nullable=True)
    cultural_profile_completed = Column(Boolean, default=False)
    professional_verification_status = Column(String(50), nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )
    last_active_at = Column(DateTime, nullable=True, index=True)
    deleted_at = Column(DateTime, nullable=True, index=True)

    # Relationships
    profile = relationship(
        "UserProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )
    professional_profile = relationship(
        "IraqiProfessionalProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )
    sessions = relationship(
        "UserSession", back_populates="user", cascade="all, delete-orphan"
    )
    preferences = relationship(
        "UserPreferences",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )
    cultural_settings = relationship(
        "CulturalSettings",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )

    # Indexes for performance
    __table_args__ = (
        Index(
            "ix_users_professional_regional", "professional_domain", "regional_context"
        ),
        Index("ix_users_subscription_status", "subscription_tier", "status"),
        Index(
            "ix_users_cultural_compliance",
            "islamic_compliance_level",
            "cultural_sensitivity_level",
        ),
        Index("ix_users_phone_verified", "phone_number", "phone_verified"),
        Index("ix_users_active_login", "is_active", "last_login_at"),
    )

    def __init__(self, **kwargs):
        """Initialize user with secure defaults."""
        super().__init__(**kwargs)
        if not self.salt:
            self.salt = secrets.token_hex(16)
        self.set_usage_reset_date()

    def set_password(self, password: str) -> None:
        """Set user password with secure hashing."""
        self.salt = secrets.token_hex(16)
        self.password_hash = self._hash_password(password, self.salt)
        self.password_last_changed = datetime.utcnow()

    def check_password(self, password: str) -> bool:
        """Verify password against stored hash."""
        return self.password_hash == self._hash_password(password, self.salt)

    def _hash_password(self, password: str, salt: str) -> str:
        """Hash password with salt using SHA-256."""
        return hashlib.sha256((password + salt).encode()).hexdigest()

    def set_usage_reset_date(self) -> None:
        """Set next monthly usage reset date."""
        now = datetime.utcnow()
        # Reset on first day of next month
        if now.month == 12:
            self.usage_reset_date = datetime(now.year + 1, 1, 1)
        else:
            self.usage_reset_date = datetime(now.year, now.month + 1, 1)

    def reset_monthly_usage(self) -> None:
        """Reset monthly usage if reset date has passed."""
        if self.usage_reset_date and datetime.utcnow() >= self.usage_reset_date:
            self.current_month_usage = 0
            self.set_usage_reset_date()

    def can_send_message(self) -> bool:
        """Check if user can send more messages this month."""
        self.reset_monthly_usage()

        # Unlimited for business and enterprise
        if self.subscription_tier in [
            SubscriptionTier.BUSINESS.value,
            SubscriptionTier.ENTERPRISE.value,
        ]:
            return True

        # Check monthly limits
        if self.monthly_usage_limit is None:
            return True

        return self.current_month_usage < self.monthly_usage_limit

    def increment_usage(self, message_count: int = 1) -> None:
        """Increment monthly message usage."""
        self.current_month_usage += message_count
        self.total_messages_sent += message_count
        self.last_active_at = datetime.utcnow()

    def get_display_name(self, prefer_arabic: bool = False) -> str:
        """Get user display name with Arabic preference."""
        if prefer_arabic and self.full_name_arabic:
            return self.full_name_arabic
        elif prefer_arabic and self.first_name_arabic and self.last_name_arabic:
            return f"{self.first_name_arabic} {self.last_name_arabic}"
        elif self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        else:
            return self.username

    def get_professional_domain_enum(self) -> Optional[ProfessionalDomainType]:
        """Get professional domain as enum."""
        if self.professional_domain:
            try:
                return ProfessionalDomainType(self.professional_domain)
            except ValueError:
                return ProfessionalDomainType.GENERAL
        return None

    def is_iraqi_phone(self) -> bool:
        """Check if phone number is Iraqi format (+964)."""
        return self.phone_number and self.phone_number.startswith("+964")

    def to_dict(self, include_sensitive: bool = False) -> Dict[str, Any]:
        """Convert user to dictionary representation."""
        result = {
            "id": str(self.id),
            "username": self.username,
            "email": self.email if include_sensitive else None,
            "phone_number": self.phone_number if include_sensitive else None,
            "phone_verified": self.phone_verified,
            "is_active": self.is_active,
            "status": self.status,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "first_name_arabic": self.first_name_arabic,
            "last_name_arabic": self.last_name_arabic,
            "full_name_arabic": self.full_name_arabic,
            "professional_domain": self.professional_domain,
            "job_title": self.job_title,
            "job_title_arabic": self.job_title_arabic,
            "organization_name": self.organization_name,
            "organization_name_arabic": self.organization_name_arabic,
            "regional_context": self.regional_context,
            "dialect_preference": self.dialect_preference,
            "islamic_compliance_level": self.islamic_compliance_level,
            "cultural_sensitivity_level": self.cultural_sensitivity_level,
            "subscription_tier": self.subscription_tier,
            "credit_balance": self.credit_balance if include_sensitive else None,
            "monthly_usage_limit": self.monthly_usage_limit,
            "current_month_usage": self.current_month_usage
            if include_sensitive
            else None,
            "data_retention_preference": self.data_retention_preference,
            "session_expiry_hours": self.session_expiry_hours,
            "two_factor_enabled": self.two_factor_enabled,
            "last_login_at": self.last_login_at.isoformat()
            if self.last_login_at
            else None,
            "login_count": self.login_count,
            "total_messages_sent": self.total_messages_sent,
            "total_documents_processed": self.total_documents_processed,
            "total_voice_messages": self.total_voice_messages,
            "cultural_appropriateness_score": self.cultural_appropriateness_score,
            "islamic_compliance_adherence": self.islamic_compliance_adherence,
            "professional_engagement_level": self.professional_engagement_level,
            "email_verified": self.email_verified,
            "cultural_profile_completed": self.cultural_profile_completed,
            "professional_verification_status": self.professional_verification_status,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "last_active_at": self.last_active_at.isoformat()
            if self.last_active_at
            else None,
        }

        return result


class UserProfile(Base):
    """
    Extended user profile with Iraqi cultural information.

    Comprehensive profile information including cultural preferences,
    professional details, and personalization settings.
    """

    __tablename__ = "user_profiles"

    # Primary identification
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
        unique=True,
        index=True,
    )

    # Personal information
    bio = Column(Text, nullable=True)
    bio_arabic = Column(Text, nullable=True)
    avatar_url = Column(String(500), nullable=True)
    birth_date = Column(DateTime, nullable=True)
    gender = Column(String(20), nullable=True)  # male, female, prefer_not_to_say

    # Location information
    country = Column(String(100), nullable=True, default="Iraq")
    city = Column(String(100), nullable=True)
    city_arabic = Column(Text, nullable=True)
    address = Column(Text, nullable=True)
    address_arabic = Column(Text, nullable=True)
    postal_code = Column(String(20), nullable=True)

    # Professional information
    education_level = Column(String(100), nullable=True)
    university = Column(String(255), nullable=True)
    university_arabic = Column(Text, nullable=True)
    graduation_year = Column(Integer, nullable=True)
    professional_license_number = Column(String(100), nullable=True)
    years_of_experience = Column(Integer, nullable=True)

    # Social and networking
    linkedin_url = Column(String(500), nullable=True)
    website_url = Column(String(500), nullable=True)
    social_media_links = Column(JSON, nullable=True)

    # Interests and preferences
    interests = Column(ARRAY(String), nullable=True)
    interests_arabic = Column(ARRAY(String), nullable=True)
    languages_spoken = Column(ARRAY(String), nullable=True, default=["ar", "en"])
    preferred_communication_style = Column(
        String(50), nullable=True
    )  # formal, casual, mixed

    # Privacy settings
    profile_visibility = Column(
        String(50), nullable=False, default="private"
    )  # public, private, professional
    show_online_status = Column(Boolean, default=False)
    allow_contact_from_others = Column(Boolean, default=False)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    # Relationships
    user = relationship("User", back_populates="profile")

    # Indexes
    __table_args__ = (
        Index("ix_profiles_country_city", "country", "city"),
        Index("ix_profiles_professional", "education_level", "years_of_experience"),
        Index("ix_profiles_visibility", "profile_visibility"),
    )

    def to_dict(self, include_sensitive: bool = False) -> Dict[str, Any]:
        """Convert profile to dictionary representation."""
        result = {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "bio": self.bio,
            "bio_arabic": self.bio_arabic,
            "avatar_url": self.avatar_url,
            "birth_date": self.birth_date.isoformat() if self.birth_date else None,
            "gender": self.gender,
            "country": self.country,
            "city": self.city,
            "city_arabic": self.city_arabic,
            "education_level": self.education_level,
            "university": self.university,
            "university_arabic": self.university_arabic,
            "graduation_year": self.graduation_year,
            "years_of_experience": self.years_of_experience,
            "interests": self.interests,
            "interests_arabic": self.interests_arabic,
            "languages_spoken": self.languages_spoken,
            "preferred_communication_style": self.preferred_communication_style,
            "profile_visibility": self.profile_visibility,
            "show_online_status": self.show_online_status,
            "allow_contact_from_others": self.allow_contact_from_others,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }

        if include_sensitive:
            result.update(
                {
                    "address": self.address,
                    "address_arabic": self.address_arabic,
                    "postal_code": self.postal_code,
                    "professional_license_number": self.professional_license_number,
                    "linkedin_url": self.linkedin_url,
                    "website_url": self.website_url,
                    "social_media_links": self.social_media_links,
                }
            )

        return result


class IraqiProfessionalProfile(Base):
    """
    Iraqi-specific professional profile for domain expertise.

    Specialized professional information for Iraqi professional contexts
    including certifications, specializations, and regulatory compliance.
    """

    __tablename__ = "iraqi_professional_profiles"

    # Primary identification
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
        unique=True,
        index=True,
    )

    # Professional certification
    iraqi_professional_license = Column(String(100), nullable=True, index=True)
    license_issuing_authority = Column(String(255), nullable=True)
    license_issuing_authority_arabic = Column(Text, nullable=True)
    license_expiry_date = Column(DateTime, nullable=True)
    license_verification_status = Column(
        String(50), nullable=True
    )  # verified, pending, expired

    # Professional specializations
    primary_specialization = Column(String(255), nullable=True)
    primary_specialization_arabic = Column(Text, nullable=True)
    secondary_specializations = Column(ARRAY(String), nullable=True)
    secondary_specializations_arabic = Column(ARRAY(String), nullable=True)

    # Iraqi professional context
    practicing_governorate = Column(String(100), nullable=True, index=True)
    practicing_city = Column(String(100), nullable=True)
    practicing_city_arabic = Column(Text, nullable=True)
    professional_syndicate_member = Column(Boolean, default=False)
    syndicate_membership_number = Column(String(100), nullable=True)

    # Expertise areas
    expertise_areas = Column(ARRAY(String), nullable=True)
    expertise_areas_arabic = Column(ARRAY(String), nullable=True)
    years_practicing_iraq = Column(Integer, nullable=True)
    international_experience = Column(Boolean, default=False)

    # Professional standing
    disciplinary_actions = Column(
        JSON, nullable=True
    )  # Any professional disciplinary history
    professional_awards = Column(JSON, nullable=True)
    professional_awards_arabic = Column(JSON, nullable=True)
    peer_ratings = Column(Float, nullable=True)  # Professional peer rating

    # Continuing education
    continuing_education_credits = Column(Integer, nullable=True)
    last_professional_development = Column(DateTime, nullable=True)
    professional_development_areas = Column(ARRAY(String), nullable=True)

    # Professional services offered
    consultation_services = Column(Boolean, default=False)
    consultation_rate_iqd = Column(Float, nullable=True)  # Rate per hour in IQD
    available_for_emergency = Column(Boolean, default=False)
    emergency_contact_hours = Column(JSON, nullable=True)

    # Verification and validation
    document_verification_status = Column(String(50), nullable=True)
    verification_documents_uploaded = Column(Boolean, default=False)
    background_check_completed = Column(Boolean, default=False)
    professional_references = Column(JSON, nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )
    verified_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User", back_populates="professional_profile")

    # Indexes
    __table_args__ = (
        Index(
            "ix_prof_profile_license_status",
            "iraqi_professional_license",
            "license_verification_status",
        ),
        Index("ix_prof_profile_location", "practicing_governorate", "practicing_city"),
        Index("ix_prof_profile_specialization", "primary_specialization"),
        Index(
            "ix_prof_profile_syndicate",
            "professional_syndicate_member",
            "syndicate_membership_number",
        ),
    )

    def to_dict(self, include_sensitive: bool = False) -> Dict[str, Any]:
        """Convert professional profile to dictionary representation."""
        result = {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "iraqi_professional_license": self.iraqi_professional_license
            if include_sensitive
            else None,
            "license_issuing_authority": self.license_issuing_authority,
            "license_issuing_authority_arabic": self.license_issuing_authority_arabic,
            "license_expiry_date": self.license_expiry_date.isoformat()
            if self.license_expiry_date
            else None,
            "license_verification_status": self.license_verification_status,
            "primary_specialization": self.primary_specialization,
            "primary_specialization_arabic": self.primary_specialization_arabic,
            "secondary_specializations": self.secondary_specializations,
            "secondary_specializations_arabic": self.secondary_specializations_arabic,
            "practicing_governorate": self.practicing_governorate,
            "practicing_city": self.practicing_city,
            "practicing_city_arabic": self.practicing_city_arabic,
            "professional_syndicate_member": self.professional_syndicate_member,
            "expertise_areas": self.expertise_areas,
            "expertise_areas_arabic": self.expertise_areas_arabic,
            "years_practicing_iraq": self.years_practicing_iraq,
            "international_experience": self.international_experience,
            "professional_awards": self.professional_awards,
            "professional_awards_arabic": self.professional_awards_arabic,
            "peer_ratings": self.peer_ratings,
            "continuing_education_credits": self.continuing_education_credits,
            "last_professional_development": self.last_professional_development.isoformat()
            if self.last_professional_development
            else None,
            "professional_development_areas": self.professional_development_areas,
            "consultation_services": self.consultation_services,
            "available_for_emergency": self.available_for_emergency,
            "document_verification_status": self.document_verification_status,
            "verification_documents_uploaded": self.verification_documents_uploaded,
            "background_check_completed": self.background_check_completed,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "verified_at": self.verified_at.isoformat() if self.verified_at else None,
        }

        if include_sensitive:
            result.update(
                {
                    "syndicate_membership_number": self.syndicate_membership_number,
                    "disciplinary_actions": self.disciplinary_actions,
                    "consultation_rate_iqd": self.consultation_rate_iqd,
                    "emergency_contact_hours": self.emergency_contact_hours,
                    "professional_references": self.professional_references,
                }
            )

        return result


class UserSession(Base):
    """
    User session management with 1-hour privacy-first expiration.

    Session tracking with automatic expiration and cultural context preservation
    designed for Iraqi privacy requirements and cultural preferences.
    """

    __tablename__ = "user_sessions"

    # Primary identification
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )
    session_token = Column(String(255), nullable=False, unique=True, index=True)

    # Session management
    is_active = Column(Boolean, default=True, index=True)
    expires_at = Column(DateTime, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    last_accessed_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Session context
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(Text, nullable=True)
    device_type = Column(String(50), nullable=True)  # mobile, desktop, tablet
    browser = Column(String(100), nullable=True)
    operating_system = Column(String(100), nullable=True)

    # Cultural session context
    session_language = Column(String(10), nullable=False, default="ar")
    rtl_mode_enabled = Column(Boolean, default=True)
    cultural_context = Column(
        JSON, nullable=True, comment="Session cultural preferences"
    )

    # Privacy and security
    anonymized = Column(Boolean, default=False)
    data_encrypted = Column(Boolean, default=True)
    secure_session = Column(Boolean, default=True)  # HTTPS only

    # Activity tracking
    page_views = Column(Integer, default=0)
    messages_sent = Column(Integer, default=0)
    documents_accessed = Column(Integer, default=0)
    voice_messages_sent = Column(Integer, default=0)

    # Relationships
    user = relationship("User", back_populates="sessions")

    # Indexes
    __table_args__ = (
        Index("ix_sessions_user_active", "user_id", "is_active"),
        Index("ix_sessions_expires", "expires_at"),
        Index("ix_sessions_token", "session_token"),
        Index("ix_sessions_last_accessed", "last_accessed_at"),
    )

    def __init__(self, **kwargs):
        """Initialize session with 1-hour default expiration."""
        super().__init__(**kwargs)
        if not self.expires_at:
            self.expires_at = datetime.utcnow() + timedelta(hours=1)
        if not self.session_token:
            self.session_token = secrets.token_urlsafe(32)

    def is_expired(self) -> bool:
        """Check if session has expired."""
        return datetime.utcnow() > self.expires_at

    def extend_session(self, hours: int = 1) -> None:
        """Extend session expiration time."""
        self.expires_at = datetime.utcnow() + timedelta(hours=hours)
        self.last_accessed_at = datetime.utcnow()

    def invalidate_session(self) -> None:
        """Invalidate the session."""
        self.is_active = False
        self.expires_at = datetime.utcnow()

    def update_activity(self, activity_type: str) -> None:
        """Update session activity counters."""
        self.last_accessed_at = datetime.utcnow()

        if activity_type == "message":
            self.messages_sent += 1
        elif activity_type == "document":
            self.documents_accessed += 1
        elif activity_type == "voice":
            self.voice_messages_sent += 1
        elif activity_type == "page_view":
            self.page_views += 1

    def to_dict(self, include_sensitive: bool = False) -> Dict[str, Any]:
        """Convert session to dictionary representation."""
        result = {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "is_active": self.is_active,
            "expires_at": self.expires_at.isoformat(),
            "created_at": self.created_at.isoformat(),
            "last_accessed_at": self.last_accessed_at.isoformat(),
            "device_type": self.device_type,
            "browser": self.browser,
            "operating_system": self.operating_system,
            "session_language": self.session_language,
            "rtl_mode_enabled": self.rtl_mode_enabled,
            "anonymized": self.anonymized,
            "data_encrypted": self.data_encrypted,
            "secure_session": self.secure_session,
            "page_views": self.page_views,
            "messages_sent": self.messages_sent,
            "documents_accessed": self.documents_accessed,
            "voice_messages_sent": self.voice_messages_sent,
        }

        if include_sensitive:
            result.update(
                {
                    "session_token": self.session_token,
                    "ip_address": self.ip_address,
                    "user_agent": self.user_agent,
                    "cultural_context": self.cultural_context,
                }
            )

        return result


class UserPreferences(Base):
    """
    User preferences and customization settings.

    Comprehensive preference management for Iraqi cultural, professional,
    and personal customization options.
    """

    __tablename__ = "user_preferences"

    # Primary identification
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
        unique=True,
        index=True,
    )

    # Language and localization
    preferred_language = Column(String(10), nullable=False, default="ar")
    fallback_language = Column(String(10), nullable=False, default="en")
    rtl_layout_enabled = Column(Boolean, default=True)
    arabic_font_family = Column(String(100), nullable=True, default="Noto Sans Arabic")
    font_size = Column(String(20), nullable=False, default="medium")

    # UI preferences
    theme = Column(String(20), nullable=False, default="light")  # light, dark, auto
    color_scheme = Column(String(50), nullable=True, default="blue")
    compact_layout = Column(Boolean, default=False)
    show_arabic_calendar = Column(Boolean, default=True)
    show_islamic_events = Column(Boolean, default=True)

    # Chat preferences
    message_preview_length = Column(Integer, default=100)
    auto_scroll_enabled = Column(Boolean, default=True)
    typing_indicators_enabled = Column(Boolean, default=True)
    read_receipts_enabled = Column(Boolean, default=False)
    message_grouping_enabled = Column(Boolean, default=True)

    # Voice preferences
    voice_messages_enabled = Column(Boolean, default=True)
    voice_auto_play = Column(Boolean, default=False)
    voice_playback_speed = Column(Float, default=1.0)  # 0.5x to 2.0x
    voice_quality_preference = Column(String(20), default="high")  # low, medium, high

    # Notification preferences
    email_notifications_enabled = Column(Boolean, default=True)
    sms_notifications_enabled = Column(Boolean, default=False)
    push_notifications_enabled = Column(Boolean, default=True)
    notification_sound_enabled = Column(Boolean, default=True)
    quiet_hours_start = Column(String(5), nullable=True, default="22:00")
    quiet_hours_end = Column(String(5), nullable=True, default="07:00")

    # Professional preferences
    professional_mode_enabled = Column(Boolean, default=False)
    show_professional_badge = Column(Boolean, default=True)
    professional_signature = Column(Text, nullable=True)
    professional_signature_arabic = Column(Text, nullable=True)

    # Privacy preferences
    activity_status_visible = Column(Boolean, default=False)
    profile_searchable = Column(Boolean, default=False)
    anonymous_usage_analytics = Column(Boolean, default=True)
    data_export_format = Column(String(20), default="json")  # json, pdf, csv

    # Accessibility preferences
    high_contrast_enabled = Column(Boolean, default=False)
    large_text_enabled = Column(Boolean, default=False)
    screen_reader_optimized = Column(Boolean, default=False)
    keyboard_navigation_enhanced = Column(Boolean, default=False)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    # Relationships
    user = relationship("User", back_populates="preferences")

    def to_dict(self) -> Dict[str, Any]:
        """Convert preferences to dictionary representation."""
        return {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "preferred_language": self.preferred_language,
            "fallback_language": self.fallback_language,
            "rtl_layout_enabled": self.rtl_layout_enabled,
            "arabic_font_family": self.arabic_font_family,
            "font_size": self.font_size,
            "theme": self.theme,
            "color_scheme": self.color_scheme,
            "compact_layout": self.compact_layout,
            "show_arabic_calendar": self.show_arabic_calendar,
            "show_islamic_events": self.show_islamic_events,
            "message_preview_length": self.message_preview_length,
            "auto_scroll_enabled": self.auto_scroll_enabled,
            "typing_indicators_enabled": self.typing_indicators_enabled,
            "read_receipts_enabled": self.read_receipts_enabled,
            "message_grouping_enabled": self.message_grouping_enabled,
            "voice_messages_enabled": self.voice_messages_enabled,
            "voice_auto_play": self.voice_auto_play,
            "voice_playback_speed": self.voice_playback_speed,
            "voice_quality_preference": self.voice_quality_preference,
            "email_notifications_enabled": self.email_notifications_enabled,
            "sms_notifications_enabled": self.sms_notifications_enabled,
            "push_notifications_enabled": self.push_notifications_enabled,
            "notification_sound_enabled": self.notification_sound_enabled,
            "quiet_hours_start": self.quiet_hours_start,
            "quiet_hours_end": self.quiet_hours_end,
            "professional_mode_enabled": self.professional_mode_enabled,
            "show_professional_badge": self.show_professional_badge,
            "professional_signature": self.professional_signature,
            "professional_signature_arabic": self.professional_signature_arabic,
            "activity_status_visible": self.activity_status_visible,
            "profile_searchable": self.profile_searchable,
            "anonymous_usage_analytics": self.anonymous_usage_analytics,
            "data_export_format": self.data_export_format,
            "high_contrast_enabled": self.high_contrast_enabled,
            "large_text_enabled": self.large_text_enabled,
            "screen_reader_optimized": self.screen_reader_optimized,
            "keyboard_navigation_enhanced": self.keyboard_navigation_enhanced,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }


class CulturalSettings(Base):
    """
    Iraqi-specific cultural settings and preferences.

    Specialized cultural configuration for Islamic compliance, Iraqi regional
    preferences, and professional cultural context management.
    """

    __tablename__ = "cultural_settings"

    # Primary identification
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
        unique=True,
        index=True,
    )

    # Islamic preferences
    islamic_compliance_level = Column(
        String(50),
        nullable=False,
        default=IslamicComplianceLevel.STANDARD.value,
        index=True,
    )
    prayer_time_notifications = Column(Boolean, default=True)
    islamic_calendar_enabled = Column(Boolean, default=True)
    halal_content_filter = Column(Boolean, default=True)
    islamic_greeting_preferred = Column(Boolean, default=True)

    # Regional cultural preferences
    regional_context = Column(String(50), nullable=True, index=True)
    dialect_preference = Column(String(50), nullable=True, index=True)
    cultural_formality_level = Column(
        String(50), nullable=False, default="formal"
    )  # formal, casual, mixed
    respect_cultural_hierarchy = Column(Boolean, default=True)

    # Professional cultural settings
    professional_etiquette_level = Column(String(50), nullable=False, default="high")
    use_professional_titles = Column(Boolean, default=True)
    cultural_context_awareness = Column(Boolean, default=True)
    cross_cultural_sensitivity = Column(Boolean, default=True)

    # Content filtering
    sectarian_content_filter = Column(Boolean, default=True)
    political_content_filter = Column(Boolean, default=True)
    inappropriate_content_threshold = Column(
        String(50), nullable=False, default="strict"
    )
    cultural_appropriateness_threshold = Column(Float, default=0.9)

    # Language and communication
    arabic_script_preference = Column(
        String(50), nullable=False, default="standard"
    )  # standard, simplified
    transliteration_enabled = Column(Boolean, default=False)
    mixed_language_support = Column(Boolean, default=True)
    cultural_context_hints = Column(Boolean, default=True)

    # Privacy and cultural data
    cultural_data_sharing = Column(Boolean, default=False)
    cultural_analytics_opt_in = Column(Boolean, default=False)
    cultural_improvement_feedback = Column(Boolean, default=True)

    # Business and professional cultural context
    iraqi_business_hours_respect = Column(Boolean, default=True)
    weekend_cultural_consideration = Column(Boolean, default=True)  # Friday/Saturday
    ramadan_mode_enabled = Column(Boolean, default=True)
    cultural_holidays_recognition = Column(Boolean, default=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    # Relationships
    user = relationship("User", back_populates="cultural_settings")

    # Indexes
    __table_args__ = (
        Index("ix_cultural_islamic_level", "islamic_compliance_level"),
        Index("ix_cultural_regional", "regional_context", "dialect_preference"),
        Index(
            "ix_cultural_content_filtering",
            "halal_content_filter",
            "sectarian_content_filter",
        ),
    )

    def to_dict(self) -> Dict[str, Any]:
        """Convert cultural settings to dictionary representation."""
        return {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "islamic_compliance_level": self.islamic_compliance_level,
            "prayer_time_notifications": self.prayer_time_notifications,
            "islamic_calendar_enabled": self.islamic_calendar_enabled,
            "halal_content_filter": self.halal_content_filter,
            "islamic_greeting_preferred": self.islamic_greeting_preferred,
            "regional_context": self.regional_context,
            "dialect_preference": self.dialect_preference,
            "cultural_formality_level": self.cultural_formality_level,
            "respect_cultural_hierarchy": self.respect_cultural_hierarchy,
            "professional_etiquette_level": self.professional_etiquette_level,
            "use_professional_titles": self.use_professional_titles,
            "cultural_context_awareness": self.cultural_context_awareness,
            "cross_cultural_sensitivity": self.cross_cultural_sensitivity,
            "sectarian_content_filter": self.sectarian_content_filter,
            "political_content_filter": self.political_content_filter,
            "inappropriate_content_threshold": self.inappropriate_content_threshold,
            "cultural_appropriateness_threshold": self.cultural_appropriateness_threshold,
            "arabic_script_preference": self.arabic_script_preference,
            "transliteration_enabled": self.transliteration_enabled,
            "mixed_language_support": self.mixed_language_support,
            "cultural_context_hints": self.cultural_context_hints,
            "cultural_data_sharing": self.cultural_data_sharing,
            "cultural_analytics_opt_in": self.cultural_analytics_opt_in,
            "cultural_improvement_feedback": self.cultural_improvement_feedback,
            "iraqi_business_hours_respect": self.iraqi_business_hours_respect,
            "weekend_cultural_consideration": self.weekend_cultural_consideration,
            "ramadan_mode_enabled": self.ramadan_mode_enabled,
            "cultural_holidays_recognition": self.cultural_holidays_recognition,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }

    def get_islamic_compliance_enum(self) -> IslamicComplianceLevel:
        """Get Islamic compliance level as enum."""
        try:
            return IslamicComplianceLevel(self.islamic_compliance_level)
        except ValueError:
            return IslamicComplianceLevel.STANDARD

    def is_appropriate_content_time(self) -> bool:
        """Check if current time is appropriate for content based on cultural settings."""
        # Implement prayer time checking, Ramadan considerations, etc.
        # This is a placeholder implementation
        return True


# Export all user models
__all__ = [
    "User",
    "UserProfile",
    "IraqiProfessionalProfile",
    "UserSession",
    "UserPreferences",
    "CulturalSettings",
    "UserStatus",
    "ProfessionalDomainType",
    "SubscriptionTier",
    "RegionalContext",
    "DialectPreference",
    "IslamicComplianceLevel",
]
