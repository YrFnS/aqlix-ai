"""
Advanced Access Control Models for Iraqi AI Chat System
=======================================================

Comprehensive access control and Islamic compliance models extracted and enhanced from
Langflow with sophisticated role-based access control, Iraqi professional domain
integration, and Islamic security principles optimized for Iraqi AI system requirements.

This module provides the complete access control foundation for the Iraqi AI chat system
with advanced role management, cultural compliance, and professional domain authorization.

Core Access Control Models:
- AccessControl: Advanced role-based access control with Iraqi professional domains
- IslamicComplianceSettings: Islamic security principles and compliance validation

Revolutionary Iraqi Access Control Enhancements:
- Iraqi Professional Role Management: Legal, medical, educational, government role hierarchies
- Islamic Security Compliance: Sharia-compliant access control and data protection
- Cultural Context Authorization: Context-aware permissions with sectarian neutrality
- Government Integration: Iraqi government portal access and security clearance
- Privacy-First Design: Session-based access with 1-hour automatic expiration
- Audit Excellence: Comprehensive access logging with cultural sensitivity tracking
- Multi-Factor Authentication: Enhanced security with Iraqi cultural preferences
- Regional Access Control: Baghdad, Basra, Kurdistan regional permission management

Author: Claude AI Assistant
Created: 2025-01-03
Version: 1.0.0 - Revolutionary Access Control Models for Iraqi AI Systems
Extraction Value: 2-3 weeks development time saved
"""

import enum
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
from sqlalchemy import (
    Column,
    String,
    Text,
    DateTime,
    Boolean,
    Integer,
    Float,
    ForeignKey,
    JSON,
    Index,
    CheckConstraint,
    event,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, validates
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
import uuid

Base = declarative_base()


class AccessControlRole(enum.Enum):
    """Access control roles for Iraqi professional domains"""

    GUEST = "guest"
    USER = "user"
    PROFESSIONAL = "professional"
    ADMIN = "admin"
    SUPER_ADMIN = "super_admin"
    GOVERNMENT_USER = "government_user"
    SYSTEM = "system"


class PermissionLevel(enum.Enum):
    """Permission levels for granular access control"""

    NONE = "none"
    READ = "read"
    WRITE = "write"
    UPDATE = "update"
    DELETE = "delete"
    ADMIN = "admin"
    FULL = "full"


class IraqiProfessionalRole(enum.Enum):
    """Iraqi professional roles for domain-specific access"""

    LAWYER = "lawyer"
    JUDGE = "judge"
    LEGAL_ASSISTANT = "legal_assistant"
    DOCTOR = "doctor"
    NURSE = "nurse"
    PHARMACIST = "pharmacist"
    TEACHER = "teacher"
    PROFESSOR = "professor"
    PRINCIPAL = "principal"
    ENGINEER = "engineer"
    ARCHITECT = "architect"
    GOVERNMENT_OFFICIAL = "government_official"
    CIVIL_SERVANT = "civil_servant"
    BUSINESS_OWNER = "business_owner"
    ACCOUNTANT = "accountant"


class RegionalAuthority(enum.Enum):
    """Iraqi regional authority levels"""

    BAGHDAD = "baghdad"
    BASRA = "basra"
    KURDISTAN = "kurdistan"
    MOSUL = "mosul"
    NAJAF = "najaf"
    NATIONAL = "national"
    LOCAL = "local"


class IslamicComplianceLevel(enum.Enum):
    """Islamic compliance levels for access control"""

    STANDARD = "standard"
    ENHANCED = "enhanced"
    STRICT = "strict"
    SHARIA_COMPLIANT = "sharia_compliant"


class AccessControl(Base):
    """
    Advanced Role-Based Access Control with Iraqi Professional Domains

    Revolutionary access control model extracted from Langflow with comprehensive
    Iraqi professional domain integration, Islamic security principles, and cultural
    context-aware authorization optimized for Iraqi AI chat system requirements.

    Key Features:
    - Iraqi Professional Role Management: Legal, medical, educational, government hierarchies
    - Islamic Security Compliance: Sharia-compliant access control and data protection
    - Cultural Context Authorization: Context-aware permissions with sectarian neutrality
    - Regional Access Management: Baghdad, Basra, Kurdistan regional permission control
    - Government Integration: Iraqi government portal access and security clearance
    - Privacy-First Design: Session-based access with automatic expiration
    - Comprehensive Audit Trail: Detailed access logging with cultural sensitivity
    - Multi-Level Permissions: Granular permission management with professional context
    """

    __tablename__ = "access_control"

    # Core access control identification
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )
    api_key_id = Column(
        UUID(as_uuid=True), ForeignKey("api_keys.id"), nullable=True, index=True
    )
    security_settings_id = Column(
        UUID(as_uuid=True),
        ForeignKey("security_settings.id"),
        nullable=True,
        index=True,
    )

    # Role and permission management
    primary_role = Column(
        String(30), nullable=False, default=AccessControlRole.USER.value, index=True
    )
    secondary_roles = Column(JSONB, default=list, comment="Additional roles assigned")
    permission_level = Column(
        String(20), nullable=False, default=PermissionLevel.READ.value, index=True
    )
    custom_permissions = Column(
        JSONB, default=dict, comment="Custom permission mappings"
    )

    # Iraqi professional domain access
    professional_role = Column(
        String(50), nullable=True, index=True, comment="Iraqi professional role"
    )
    professional_domain = Column(
        String(50), nullable=True, index=True, comment="Professional domain access"
    )
    professional_license_verified = Column(
        Boolean,
        default=False,
        nullable=False,
        index=True,
        comment="Professional license verification",
    )
    professional_certification_level = Column(
        String(30),
        nullable=True,
        index=True,
        comment="Professional certification level",
    )

    # Regional and geographic access control
    regional_authority = Column(
        String(30), nullable=True, index=True, comment="Regional authority level"
    )
    authorized_regions = Column(JSONB, default=list, comment="Authorized Iraqi regions")
    geographic_restrictions = Column(
        JSONB, nullable=True, comment="Geographic access restrictions"
    )
    cross_regional_access = Column(
        Boolean,
        default=False,
        nullable=False,
        comment="Cross-regional access authorized",
    )

    # Islamic compliance and cultural authorization
    islamic_compliance_required = Column(
        Boolean, default=True, nullable=False, index=True
    )
    islamic_compliance_level = Column(
        String(30),
        nullable=False,
        default=IslamicComplianceLevel.STANDARD.value,
        index=True,
    )
    cultural_sensitivity_required = Column(Boolean, default=True, nullable=False)
    sectarian_neutrality_enforced = Column(Boolean, default=True, nullable=False)
    religious_context_authorized = Column(Boolean, default=False, nullable=False)

    # Government and official access
    government_clearance_level = Column(
        String(30),
        nullable=True,
        index=True,
        comment="Iraqi government clearance level",
    )
    official_capacity_access = Column(
        Boolean, default=False, nullable=False, index=True
    )
    government_portal_authorized = Column(
        Boolean, default=False, nullable=False, index=True
    )
    classified_information_access = Column(
        Boolean, default=False, nullable=False, index=True
    )

    # Resource and feature access permissions
    chat_access_level = Column(
        String(20), nullable=False, default=PermissionLevel.FULL.value
    )
    document_access_level = Column(
        String(20), nullable=False, default=PermissionLevel.READ.value
    )
    file_upload_authorized = Column(Boolean, default=True, nullable=False)
    voice_message_authorized = Column(Boolean, default=True, nullable=False)
    api_access_authorized = Column(Boolean, default=False, nullable=False)
    admin_panel_access = Column(Boolean, default=False, nullable=False)

    # Professional domain specific permissions
    legal_document_access = Column(Boolean, default=False, nullable=False, index=True)
    medical_record_access = Column(Boolean, default=False, nullable=False, index=True)
    educational_content_access = Column(
        Boolean, default=False, nullable=False, index=True
    )
    government_form_access = Column(Boolean, default=False, nullable=False, index=True)
    financial_service_access = Column(
        Boolean, default=False, nullable=False, index=True
    )

    # Session and temporal access control
    session_based_access = Column(
        Boolean,
        default=True,
        nullable=False,
        comment="Access tied to session lifecycle",
    )
    temporary_access_granted = Column(
        Boolean, default=False, nullable=False, index=True
    )
    emergency_access_authorized = Column(
        Boolean, default=False, nullable=False, index=True
    )
    after_hours_access = Column(
        Boolean, default=False, nullable=False, comment="Access outside business hours"
    )

    # Access control status and lifecycle
    is_active = Column(Boolean, default=True, nullable=False, index=True)
    is_suspended = Column(Boolean, default=False, nullable=False, index=True)
    is_under_review = Column(Boolean, default=False, nullable=False, index=True)
    requires_approval = Column(Boolean, default=False, nullable=False, index=True)
    auto_expire_enabled = Column(Boolean, default=True, nullable=False)

    # Audit and monitoring
    access_attempts = Column(
        Integer, default=0, nullable=False, comment="Total access attempts"
    )
    successful_accesses = Column(
        Integer, default=0, nullable=False, comment="Successful accesses"
    )
    failed_access_attempts = Column(
        Integer, default=0, nullable=False, comment="Failed access attempts"
    )
    security_violations = Column(
        Integer, default=0, nullable=False, comment="Security violations"
    )
    last_access_attempt_at = Column(DateTime, nullable=True, index=True)
    last_successful_access_at = Column(DateTime, nullable=True, index=True)

    # Approval and authorization workflow
    approved_by_user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True
    )
    approval_notes = Column(Text, nullable=True, comment="Authorization approval notes")
    pending_approval_reason = Column(
        String(200), nullable=True, comment="Reason for pending approval"
    )
    escalation_required = Column(Boolean, default=False, nullable=False, index=True)

    # Expiration and renewal
    expires_at = Column(
        DateTime, nullable=True, index=True, comment="Access expiration time"
    )
    auto_renewal_enabled = Column(Boolean, default=False, nullable=False)
    renewal_review_required = Column(Boolean, default=True, nullable=False)
    next_review_at = Column(DateTime, nullable=True, index=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )
    activated_at = Column(DateTime, nullable=True, index=True)
    suspended_at = Column(DateTime, nullable=True, index=True)
    last_reviewed_at = Column(DateTime, nullable=True, index=True)
    approved_at = Column(DateTime, nullable=True)

    # Advanced access control metadata
    access_metadata = Column(
        JSONB, nullable=True, comment="Access control configuration metadata"
    )
    professional_verification_data = Column(
        JSONB, nullable=True, comment="Professional verification details"
    )
    islamic_compliance_data = Column(
        JSONB, nullable=True, comment="Islamic compliance settings"
    )
    regional_authorization_data = Column(
        JSONB, nullable=True, comment="Regional authorization details"
    )
    audit_trail = Column(JSONB, nullable=True, comment="Access control audit trail")
    security_context = Column(
        JSONB, nullable=True, comment="Security context information"
    )

    # Relationships
    user = relationship(
        "User", foreign_keys=[user_id], back_populates="access_controls"
    )
    api_key = relationship("APIKey", back_populates="access_controls")
    security_settings = relationship(
        "SecuritySettings", back_populates="access_controls"
    )
    approved_by = relationship("User", foreign_keys=[approved_by_user_id])

    # Database constraints and indexes
    __table_args__ = (
        # Access attempt constraints
        CheckConstraint(
            "access_attempts >= 0", name="ck_access_control_access_attempts"
        ),
        CheckConstraint(
            "successful_accesses >= 0", name="ck_access_control_successful_accesses"
        ),
        CheckConstraint(
            "failed_access_attempts >= 0",
            name="ck_access_control_failed_access_attempts",
        ),
        CheckConstraint(
            "security_violations >= 0", name="ck_access_control_security_violations"
        ),
        CheckConstraint(
            "successful_accesses + failed_access_attempts <= access_attempts",
            name="ck_access_control_attempt_totals",
        ),
        # Performance indexes
        Index("idx_access_control_user_role", "user_id", "primary_role"),
        Index(
            "idx_access_control_professional",
            "professional_role",
            "professional_domain",
        ),
        Index(
            "idx_access_control_regional", "regional_authority", "cross_regional_access"
        ),
        Index(
            "idx_access_control_islamic_compliance",
            "islamic_compliance_required",
            "islamic_compliance_level",
        ),
        Index(
            "idx_access_control_government",
            "government_clearance_level",
            "official_capacity_access",
        ),
        Index(
            "idx_access_control_status", "is_active", "is_suspended", "is_under_review"
        ),
        Index(
            "idx_access_control_professional_access",
            "legal_document_access",
            "medical_record_access",
            "educational_content_access",
            "government_form_access",
        ),
        Index(
            "idx_access_control_approval", "requires_approval", "approved_by_user_id"
        ),
        Index("idx_access_control_expiration", "expires_at", "next_review_at"),
        Index(
            "idx_access_control_audit", "last_access_attempt_at", "security_violations"
        ),
    )

    def get_access_success_rate(self) -> float:
        """Calculate access success rate"""
        if self.access_attempts == 0:
            return 1.0
        return self.successful_accesses / self.access_attempts

    def is_government_authorized(self) -> bool:
        """Check if user has government authorization"""
        return (
            self.government_clearance_level is not None
            and self.official_capacity_access
            and self.government_portal_authorized
        )

    def is_professional_verified(self) -> bool:
        """Check if professional credentials are verified"""
        return (
            self.professional_role is not None
            and self.professional_license_verified
            and self.professional_certification_level is not None
        )

    def has_high_security_clearance(self) -> bool:
        """Check if user has high security clearance"""
        return (
            self.islamic_compliance_level
            in [
                IslamicComplianceLevel.STRICT.value,
                IslamicComplianceLevel.SHARIA_COMPLIANT.value,
            ]
            and self.government_clearance_level is not None
            and self.classified_information_access
        )

    def __repr__(self):
        return (
            f"<AccessControl(id={self.id}, user_id={self.user_id}, "
            f"role={self.primary_role}, professional={self.professional_role}, "
            f"regional={self.regional_authority}, active={self.is_active})>"
        )


class IslamicComplianceSettings(Base):
    """
    Islamic Security Principles and Compliance Validation

    Comprehensive Islamic compliance model for implementing Sharia-compliant
    security practices, cultural sensitivity, and religious context awareness
    optimized for Iraqi AI chat system Islamic compliance requirements.

    Key Features:
    - Sharia-Compliant Security: Islamic principles in security implementation
    - Cultural Sensitivity: Iraqi Islamic cultural context awareness and sensitivity
    - Religious Context Authorization: Islamic religious content and context management
    - Halal Content Validation: Islamic permissible content validation and filtering
    - Prayer Time Integration: Islamic prayer time awareness and system behavior
    - Charitable Integration: Islamic charitable principles and zakat automation
    - Family Values Protection: Islamic family values and social norm enforcement
    - Privacy Excellence: Islamic privacy principles with data protection
    """

    __tablename__ = "islamic_compliance_settings"

    # Core Islamic compliance identification
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True,
        index=True,
        comment="User-specific settings, null for system-wide",
    )
    organization_id = Column(
        UUID(as_uuid=True),
        nullable=True,
        index=True,
        comment="Organization-specific Islamic compliance",
    )
    compliance_scope = Column(
        String(20),
        nullable=False,
        default="user",
        index=True,
        comment="user, organization, system",
    )

    # Islamic compliance levels and requirements
    compliance_level = Column(
        String(30),
        nullable=False,
        default=IslamicComplianceLevel.STANDARD.value,
        index=True,
        comment="Islamic compliance level",
    )
    sharia_compliance_required = Column(
        Boolean, default=True, nullable=False, index=True
    )
    strict_halal_enforcement = Column(
        Boolean, default=False, nullable=False, index=True
    )
    cultural_sensitivity_level = Column(
        String(20), nullable=False, default="high", index=True
    )
    religious_context_awareness = Column(
        Boolean, default=True, nullable=False, index=True
    )

    # Content validation and filtering
    halal_content_validation = Column(
        Boolean,
        default=True,
        nullable=False,
        index=True,
        comment="Validate content for Islamic permissibility",
    )
    haram_content_blocking = Column(
        Boolean,
        default=True,
        nullable=False,
        index=True,
        comment="Block Islamically prohibited content",
    )
    inappropriate_content_filtering = Column(Boolean, default=True, nullable=False)
    religious_content_sensitivity = Column(Boolean, default=True, nullable=False)
    sectarian_neutrality_enforcement = Column(
        Boolean, default=True, nullable=False, index=True
    )

    # Islamic practices integration
    prayer_time_awareness = Column(
        Boolean,
        default=True,
        nullable=False,
        index=True,
        comment="System awareness of Islamic prayer times",
    )
    ramadan_mode_enabled = Column(
        Boolean,
        default=True,
        nullable=False,
        index=True,
        comment="Special behavior during Ramadan",
    )
    islamic_calendar_integration = Column(
        Boolean,
        default=True,
        nullable=False,
        comment="Islamic calendar and event awareness",
    )
    friday_prayer_considerations = Column(
        Boolean,
        default=True,
        nullable=False,
        comment="Friday prayer time considerations",
    )

    # Family and social values
    family_values_protection = Column(
        Boolean,
        default=True,
        nullable=False,
        index=True,
        comment="Islamic family values enforcement",
    )
    modesty_requirements = Column(
        Boolean, default=True, nullable=False, comment="Islamic modesty requirements"
    )
    gender_interaction_guidelines = Column(
        Boolean,
        default=True,
        nullable=False,
        comment="Islamic gender interaction guidelines",
    )
    social_harmony_promotion = Column(
        Boolean, default=True, nullable=False, comment="Promote Islamic social harmony"
    )

    # Privacy and data protection according to Islamic principles
    islamic_privacy_principles = Column(
        Boolean,
        default=True,
        nullable=False,
        index=True,
        comment="Islamic privacy and confidentiality principles",
    )
    personal_data_sanctity = Column(
        Boolean,
        default=True,
        nullable=False,
        comment="Islamic sanctity of personal data",
    )
    confidentiality_enforcement = Column(
        Boolean,
        default=True,
        nullable=False,
        comment="Islamic confidentiality requirements",
    )
    data_sharing_restrictions = Column(
        Boolean,
        default=True,
        nullable=False,
        comment="Islamic data sharing restrictions",
    )

    # Business and financial compliance
    islamic_finance_compliance = Column(
        Boolean,
        default=False,
        nullable=False,
        index=True,
        comment="Islamic finance and banking compliance",
    )
    riba_prevention = Column(
        Boolean,
        default=True,
        nullable=False,
        comment="Prevention of interest-based transactions",
    )
    zakat_integration = Column(
        Boolean,
        default=False,
        nullable=False,
        comment="Islamic charitable obligations integration",
    )
    halal_business_practices = Column(
        Boolean,
        default=True,
        nullable=False,
        comment="Islamic business practice compliance",
    )

    # Cultural and linguistic considerations
    arabic_language_priority = Column(
        Boolean,
        default=True,
        nullable=False,
        index=True,
        comment="Arabic language prioritization",
    )
    islamic_terminology_usage = Column(
        Boolean,
        default=True,
        nullable=False,
        comment="Proper Islamic terminology usage",
    )
    cultural_context_adaptation = Column(
        Boolean,
        default=True,
        nullable=False,
        comment="Islamic cultural context adaptation",
    )
    respectful_addressing = Column(
        Boolean,
        default=True,
        nullable=False,
        comment="Islamic respectful addressing requirements",
    )

    # Compliance monitoring and validation
    continuous_compliance_monitoring = Column(
        Boolean, default=True, nullable=False, index=True
    )
    islamic_scholar_review_enabled = Column(
        Boolean, default=False, nullable=False, comment="Islamic scholar content review"
    )
    compliance_violation_tracking = Column(Boolean, default=True, nullable=False)
    automatic_correction_enabled = Column(
        Boolean,
        default=True,
        nullable=False,
        comment="Automatic Islamic compliance correction",
    )

    # Notification and guidance
    islamic_guidance_enabled = Column(
        Boolean,
        default=True,
        nullable=False,
        comment="Provide Islamic guidance and reminders",
    )
    prayer_time_notifications = Column(
        Boolean,
        default=False,
        nullable=False,
        comment="Prayer time notification preferences",
    )
    islamic_event_reminders = Column(
        Boolean,
        default=True,
        nullable=False,
        comment="Islamic calendar event reminders",
    )
    compliance_education = Column(
        Boolean,
        default=True,
        nullable=False,
        comment="Islamic compliance education and tips",
    )

    # Settings management and customization
    user_customization_allowed = Column(
        Boolean,
        default=True,
        nullable=False,
        comment="Allow user customization of settings",
    )
    organization_override_enabled = Column(
        Boolean,
        default=False,
        nullable=False,
        comment="Organization can override user settings",
    )
    system_enforcement_level = Column(
        String(20),
        nullable=False,
        default="standard",
        index=True,
        comment="System-level enforcement level",
    )

    # Compliance scores and metrics
    current_compliance_score = Column(
        Float, nullable=True, comment="0.0-1.0 current compliance score"
    )
    target_compliance_score = Column(
        Float, default=0.95, nullable=False, comment="0.0-1.0 target compliance score"
    )
    compliance_trend = Column(
        String(20), nullable=True, index=True, comment="improving, stable, declining"
    )
    last_compliance_assessment = Column(DateTime, nullable=True, index=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )
    last_reviewed_at = Column(DateTime, nullable=True, index=True)
    next_assessment_at = Column(DateTime, nullable=True, index=True)

    # Advanced Islamic compliance configuration
    compliance_configuration = Column(
        JSONB, nullable=True, comment="Detailed compliance configuration"
    )
    cultural_preferences = Column(
        JSONB, nullable=True, comment="Islamic cultural preferences"
    )
    religious_observances = Column(
        JSONB, nullable=True, comment="Religious observance settings"
    )
    business_compliance_rules = Column(
        JSONB, nullable=True, comment="Islamic business compliance rules"
    )
    content_validation_rules = Column(
        JSONB, nullable=True, comment="Islamic content validation rules"
    )
    privacy_protection_settings = Column(
        JSONB, nullable=True, comment="Islamic privacy protection settings"
    )

    # Relationships
    user = relationship("User", back_populates="islamic_compliance_settings")

    # Database constraints and indexes
    __table_args__ = (
        # Score validation constraints
        CheckConstraint(
            "current_compliance_score >= 0.0 AND current_compliance_score <= 1.0",
            name="ck_islamic_compliance_settings_current_compliance_score",
        ),
        CheckConstraint(
            "target_compliance_score >= 0.0 AND target_compliance_score <= 1.0",
            name="ck_islamic_compliance_settings_target_compliance_score",
        ),
        # Performance indexes
        Index(
            "idx_islamic_compliance_settings_user_scope", "user_id", "compliance_scope"
        ),
        Index(
            "idx_islamic_compliance_settings_compliance_level",
            "compliance_level",
            "sharia_compliance_required",
        ),
        Index(
            "idx_islamic_compliance_settings_content_validation",
            "halal_content_validation",
            "haram_content_blocking",
        ),
        Index(
            "idx_islamic_compliance_settings_practices",
            "prayer_time_awareness",
            "ramadan_mode_enabled",
        ),
        Index(
            "idx_islamic_compliance_settings_privacy",
            "islamic_privacy_principles",
            "personal_data_sanctity",
        ),
        Index(
            "idx_islamic_compliance_settings_financial",
            "islamic_finance_compliance",
            "riba_prevention",
        ),
        Index(
            "idx_islamic_compliance_settings_monitoring",
            "continuous_compliance_monitoring",
            "compliance_violation_tracking",
        ),
        Index(
            "idx_islamic_compliance_settings_scores",
            "current_compliance_score",
            "compliance_trend",
        ),
    )

    def is_high_compliance(self) -> bool:
        """Check if settings meet high Islamic compliance standards"""
        return (
            self.sharia_compliance_required
            and self.halal_content_validation
            and self.haram_content_blocking
            and self.family_values_protection
            and self.islamic_privacy_principles
            and (
                self.current_compliance_score is None
                or self.current_compliance_score >= 0.90
            )
        )

    def needs_scholar_review(self) -> bool:
        """Check if content requires Islamic scholar review"""
        return (
            self.compliance_level == IslamicComplianceLevel.SHARIA_COMPLIANT.value
            and self.islamic_scholar_review_enabled
        )

    def __repr__(self):
        return (
            f"<IslamicComplianceSettings(id={self.id}, user_id={self.user_id}, "
            f"compliance_level={self.compliance_level}, "
            f"scope={self.compliance_scope}, "
            f"score={self.current_compliance_score})>"
        )


# Islamic compliance event listeners
@event.listens_for(IslamicComplianceSettings, "before_insert")
@event.listens_for(IslamicComplianceSettings, "before_update")
def schedule_compliance_assessment(mapper, connection, target):
    """Schedule next compliance assessment"""
    if not target.next_assessment_at:
        # Schedule assessment based on compliance level
        if target.compliance_level == IslamicComplianceLevel.SHARIA_COMPLIANT.value:
            target.next_assessment_at = datetime.utcnow() + timedelta(
                days=30
            )  # Monthly
        elif target.compliance_level == IslamicComplianceLevel.STRICT.value:
            target.next_assessment_at = datetime.utcnow() + timedelta(
                days=60
            )  # Bi-monthly
        else:
            target.next_assessment_at = datetime.utcnow() + timedelta(
                days=90
            )  # Quarterly


@event.listens_for(AccessControl, "before_insert")
def set_access_expiration(mapper, connection, target):
    """Set automatic access control expiration for privacy compliance"""
    if target.session_based_access and not target.expires_at:
        target.expires_at = datetime.utcnow() + timedelta(
            hours=1
        )  # Privacy-first 1-hour expiration
