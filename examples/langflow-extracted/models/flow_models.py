"""
Flow Management Database Models for Iraqi AI Chat System
======================================================

Comprehensive flow management models extracted and enhanced from Langflow with
sophisticated Iraqi cultural integration, professional domain awareness, and
Islamic compliance validation.

These models provide the foundation for creating, executing, and managing AI workflows
specifically designed for Iraqi professional contexts with cultural authenticity.

Key Features:
- Workflow Creation: Professional Iraqi templates and cultural validation
- Flow Execution: Real-time monitoring with Islamic compliance checking
- Version Control: Template versioning with cultural evolution tracking
- Iraqi Context: Professional domain integration and cultural preservation
- Performance Tracking: Execution metrics with cultural appropriateness scoring
- Template Management: Iraqi professional workflow templates and patterns

Author: Claude AI Assistant
Created: 2025-01-03
Version: 1.0.0 - Revolutionary Flow Models for Iraqi AI Systems
"""

import uuid
from datetime import datetime, timedelta
from enum import Enum
from typing import Dict, List, Optional, Any, Union
from sqlalchemy import (
    Column, String, Integer, DateTime, Boolean, Text, JSON, 
    ForeignKey, Float, Index, UniqueConstraint
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, Session
from sqlalchemy.dialects.postgresql import UUID, ARRAY
import json

Base = declarative_base()


class FlowStatus(Enum):
    """Status of flow execution."""
    DRAFT = "draft"
    ACTIVE = "active"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    PAUSED = "paused"
    CANCELLED = "cancelled"
    CULTURALLY_REVIEWING = "culturally_reviewing"
    ISLAMIC_COMPLIANCE_PENDING = "islamic_compliance_pending"


class ProfessionalDomainType(Enum):
    """Iraqi professional domain types."""
    LEGAL = "legal"
    MEDICAL = "medical"
    EDUCATIONAL = "educational"
    ENGINEERING = "engineering"
    ORGANIZATIONAL = "organizational"
    GOVERNMENT = "government"
    BUSINESS = "business"
    GENERAL = "general"


class FlowComplexityLevel(Enum):
    """Complexity levels for Iraqi professional workflows."""
    SIMPLE = "simple"
    MODERATE = "moderate"
    COMPLEX = "complex"
    ENTERPRISE = "enterprise"
    GOVERNMENT_LEVEL = "government_level"


class CulturalValidationStatus(Enum):
    """Cultural validation status for flows."""
    PENDING = "pending"
    APPROVED = "approved"
    REQUIRES_REVIEW = "requires_review"
    REJECTED = "rejected"
    ISLAMIC_COMPLIANT = "islamic_compliant"
    CULTURALLY_SENSITIVE = "culturally_sensitive"


class Flow(Base):
    """
    Core flow model representing AI workflows with Iraqi cultural integration.
    
    Enhanced from Langflow with comprehensive Iraqi professional domain support,
    Islamic compliance validation, and cultural context preservation.
    """
    __tablename__ = "flows"
    
    # Primary identification
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False, index=True)
    name_arabic = Column(Text, nullable=True, comment="Arabic name for RTL display")
    description = Column(Text, nullable=True)
    description_arabic = Column(Text, nullable=True, comment="Arabic description")
    
    # Flow management
    status = Column(String(50), nullable=False, default=FlowStatus.DRAFT.value, index=True)
    version = Column(String(50), nullable=False, default="1.0.0")
    is_template = Column(Boolean, default=False, index=True)
    is_public = Column(Boolean, default=False)
    
    # Iraqi cultural integration
    professional_domain = Column(String(50), nullable=True, index=True, 
                                comment="Iraqi professional domain context")
    cultural_validation_status = Column(String(50), nullable=False, 
                                      default=CulturalValidationStatus.PENDING.value, index=True)
    islamic_compliance_score = Column(Float, nullable=True, 
                                    comment="Islamic compliance score (0.0-1.0)")
    cultural_appropriateness_score = Column(Float, nullable=True,
                                          comment="Iraqi cultural appropriateness (0.0-1.0)")
    sectarian_neutrality_validated = Column(Boolean, default=False,
                                          comment="Sectarian neutrality validation status")
    
    # Flow configuration
    data = Column(JSON, nullable=True, comment="Flow configuration and nodes")
    ui_data = Column(JSON, nullable=True, comment="UI layout and positioning data")
    complexity_level = Column(String(50), nullable=True, index=True)
    estimated_execution_time_seconds = Column(Integer, nullable=True)
    
    # Metadata and tracking
    tags = Column(ARRAY(String), nullable=True, index=True)
    tags_arabic = Column(ARRAY(String), nullable=True, comment="Arabic tags for search")
    category = Column(String(100), nullable=True, index=True)
    
    # Ownership and permissions
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    organization_id = Column(UUID(as_uuid=True), nullable=True, index=True)
    shared_with_users = Column(ARRAY(UUID), nullable=True, 
                              comment="User IDs with access to this flow")
    
    # Performance and analytics
    execution_count = Column(Integer, default=0, comment="Total number of executions")
    success_count = Column(Integer, default=0, comment="Successful executions")
    failure_count = Column(Integer, default=0, comment="Failed executions")
    average_execution_time_ms = Column(Float, nullable=True)
    last_execution_at = Column(DateTime, nullable=True)
    
    # Cultural performance metrics
    cultural_validation_count = Column(Integer, default=0)
    islamic_compliance_failures = Column(Integer, default=0)
    professional_accuracy_score = Column(Float, nullable=True)
    arabic_processing_accuracy = Column(Float, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    deleted_at = Column(DateTime, nullable=True, index=True)
    
    # Relationships
    executions = relationship("FlowExecution", back_populates="flow", cascade="all, delete-orphan")
    versions = relationship("FlowVersion", back_populates="flow", cascade="all, delete-orphan")
    cultural_contexts = relationship("IraqiFlowContext", back_populates="flow", 
                                   cascade="all, delete-orphan")
    
    # Indexes for performance
    __table_args__ = (
        Index('ix_flows_status_domain', 'status', 'professional_domain'),
        Index('ix_flows_cultural_validation', 'cultural_validation_status', 'islamic_compliance_score'),
        Index('ix_flows_user_created', 'user_id', 'created_at'),
        Index('ix_flows_public_template', 'is_public', 'is_template'),
        Index('ix_flows_arabic_search', 'name_arabic', 'description_arabic'),
    )
    
    def to_dict(self, include_sensitive: bool = False) -> Dict[str, Any]:
        """Convert flow to dictionary representation."""
        result = {
            "id": str(self.id),
            "name": self.name,
            "name_arabic": self.name_arabic,
            "description": self.description,
            "description_arabic": self.description_arabic,
            "status": self.status,
            "version": self.version,
            "is_template": self.is_template,
            "is_public": self.is_public,
            "professional_domain": self.professional_domain,
            "cultural_validation_status": self.cultural_validation_status,
            "islamic_compliance_score": self.islamic_compliance_score,
            "cultural_appropriateness_score": self.cultural_appropriateness_score,
            "sectarian_neutrality_validated": self.sectarian_neutrality_validated,
            "complexity_level": self.complexity_level,
            "estimated_execution_time_seconds": self.estimated_execution_time_seconds,
            "tags": self.tags,
            "tags_arabic": self.tags_arabic,
            "category": self.category,
            "execution_count": self.execution_count,
            "success_count": self.success_count,
            "failure_count": self.failure_count,
            "average_execution_time_ms": self.average_execution_time_ms,
            "last_execution_at": self.last_execution_at.isoformat() if self.last_execution_at else None,
            "cultural_validation_count": self.cultural_validation_count,
            "islamic_compliance_failures": self.islamic_compliance_failures,
            "professional_accuracy_score": self.professional_accuracy_score,
            "arabic_processing_accuracy": self.arabic_processing_accuracy,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }
        
        if include_sensitive:
            result.update({
                "data": self.data,
                "ui_data": self.ui_data,
                "user_id": str(self.user_id),
                "organization_id": str(self.organization_id) if self.organization_id else None,
                "shared_with_users": [str(uid) for uid in self.shared_with_users] if self.shared_with_users else []
            })
        
        return result
    
    def calculate_success_rate(self) -> float:
        """Calculate flow execution success rate."""
        if self.execution_count == 0:
            return 0.0
        return self.success_count / self.execution_count
    
    def is_culturally_compliant(self) -> bool:
        """Check if flow meets Iraqi cultural compliance standards."""
        return (
            self.cultural_validation_status == CulturalValidationStatus.APPROVED.value and
            self.islamic_compliance_score is not None and
            self.islamic_compliance_score >= 0.85 and
            self.cultural_appropriateness_score is not None and
            self.cultural_appropriateness_score >= 0.90 and
            self.sectarian_neutrality_validated
        )
    
    def get_professional_domain_enum(self) -> Optional[ProfessionalDomainType]:
        """Get professional domain as enum."""
        if self.professional_domain:
            try:
                return ProfessionalDomainType(self.professional_domain)
            except ValueError:
                return ProfessionalDomainType.GENERAL
        return None


class FlowExecution(Base):
    """
    Flow execution tracking with Iraqi cultural monitoring.
    
    Enhanced from Langflow with comprehensive execution monitoring, cultural
    validation tracking, and Islamic compliance verification during runtime.
    """
    __tablename__ = "flow_executions"
    
    # Primary identification
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    flow_id = Column(UUID(as_uuid=True), ForeignKey("flows.id"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    session_id = Column(String(255), nullable=True, index=True)
    
    # Execution tracking
    status = Column(String(50), nullable=False, default=FlowStatus.RUNNING.value, index=True)
    started_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    completed_at = Column(DateTime, nullable=True)
    duration_ms = Column(Integer, nullable=True)
    
    # Input and output data
    inputs = Column(JSON, nullable=True, comment="Execution input parameters")
    outputs = Column(JSON, nullable=True, comment="Execution results")
    error_message = Column(Text, nullable=True)
    error_details = Column(JSON, nullable=True)
    
    # Cultural validation during execution
    cultural_validation_passed = Column(Boolean, default=True)
    islamic_compliance_validated = Column(Boolean, default=True)
    cultural_violations = Column(JSON, nullable=True, 
                               comment="Cultural violations detected during execution")
    professional_context_accuracy = Column(Float, nullable=True)
    arabic_processing_quality = Column(Float, nullable=True)
    
    # Performance metrics
    tokens_used = Column(Integer, nullable=True, comment="AI tokens consumed")
    cost_usd = Column(Float, nullable=True, comment="Execution cost in USD")
    cost_iqd = Column(Float, nullable=True, comment="Execution cost in Iraqi Dinar")
    memory_usage_mb = Column(Float, nullable=True)
    cpu_usage_percent = Column(Float, nullable=True)
    
    # Execution environment
    execution_environment = Column(String(100), nullable=True)
    langflow_version = Column(String(50), nullable=True)
    model_versions = Column(JSON, nullable=True, comment="AI model versions used")
    
    # Privacy and data handling
    contains_sensitive_data = Column(Boolean, default=False)
    data_retention_until = Column(DateTime, nullable=True, 
                                comment="Automatic data expiration (1-hour default)")
    anonymized = Column(Boolean, default=False)
    
    # Relationships
    flow = relationship("Flow", back_populates="executions")
    
    # Indexes for performance
    __table_args__ = (
        Index('ix_executions_flow_status', 'flow_id', 'status'),
        Index('ix_executions_user_started', 'user_id', 'started_at'),
        Index('ix_executions_cultural_validation', 'cultural_validation_passed', 'islamic_compliance_validated'),
        Index('ix_executions_session', 'session_id', 'started_at'),
    )
    
    def __init__(self, **kwargs):
        """Initialize execution with 1-hour data retention by default."""
        super().__init__(**kwargs)
        if not self.data_retention_until:
            self.data_retention_until = datetime.utcnow() + timedelta(hours=1)
    
    def to_dict(self, include_sensitive: bool = False) -> Dict[str, Any]:
        """Convert execution to dictionary representation."""
        result = {
            "id": str(self.id),
            "flow_id": str(self.flow_id),
            "user_id": str(self.user_id),
            "session_id": self.session_id,
            "status": self.status,
            "started_at": self.started_at.isoformat(),
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "duration_ms": self.duration_ms,
            "cultural_validation_passed": self.cultural_validation_passed,
            "islamic_compliance_validated": self.islamic_compliance_validated,
            "professional_context_accuracy": self.professional_context_accuracy,
            "arabic_processing_quality": self.arabic_processing_quality,
            "tokens_used": self.tokens_used,
            "cost_usd": self.cost_usd,
            "cost_iqd": self.cost_iqd,
            "memory_usage_mb": self.memory_usage_mb,
            "cpu_usage_percent": self.cpu_usage_percent,
            "execution_environment": self.execution_environment,
            "langflow_version": self.langflow_version,
            "contains_sensitive_data": self.contains_sensitive_data,
            "data_retention_until": self.data_retention_until.isoformat() if self.data_retention_until else None,
            "anonymized": self.anonymized
        }
        
        if include_sensitive and not self.is_expired():
            result.update({
                "inputs": self.inputs,
                "outputs": self.outputs,
                "error_message": self.error_message,
                "error_details": self.error_details,
                "cultural_violations": self.cultural_violations,
                "model_versions": self.model_versions
            })
        
        return result
    
    def is_expired(self) -> bool:
        """Check if execution data has expired (1-hour retention)."""
        if not self.data_retention_until:
            return False
        return datetime.utcnow() > self.data_retention_until
    
    def calculate_duration(self) -> Optional[int]:
        """Calculate execution duration in milliseconds."""
        if self.completed_at and self.started_at:
            duration = (self.completed_at - self.started_at).total_seconds() * 1000
            return int(duration)
        return None
    
    def is_culturally_valid(self) -> bool:
        """Check if execution passed all cultural validations."""
        return (
            self.cultural_validation_passed and
            self.islamic_compliance_validated and
            (not self.cultural_violations or len(self.cultural_violations) == 0)
        )


class FlowVersion(Base):
    """
    Flow versioning with cultural evolution tracking.
    
    Enhanced version control system that tracks not only technical changes
    but also cultural adaptations and Islamic compliance improvements.
    """
    __tablename__ = "flow_versions"
    
    # Primary identification
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    flow_id = Column(UUID(as_uuid=True), ForeignKey("flows.id"), nullable=False, index=True)
    version_number = Column(String(50), nullable=False)
    
    # Version data
    data = Column(JSON, nullable=False, comment="Flow configuration snapshot")
    ui_data = Column(JSON, nullable=True, comment="UI layout snapshot")
    changelog = Column(Text, nullable=True)
    changelog_arabic = Column(Text, nullable=True)
    
    # Cultural versioning
    cultural_improvements = Column(JSON, nullable=True,
                                 comment="Cultural enhancements in this version")
    islamic_compliance_changes = Column(JSON, nullable=True,
                                      comment="Islamic compliance improvements")
    professional_domain_updates = Column(JSON, nullable=True,
                                       comment="Professional domain enhancements")
    arabic_processing_improvements = Column(JSON, nullable=True,
                                          comment="Arabic language processing updates")
    
    # Version metadata
    is_stable = Column(Boolean, default=False)
    is_production_ready = Column(Boolean, default=False)
    is_culturally_approved = Column(Boolean, default=False)
    breaking_changes = Column(Boolean, default=False)
    
    # Performance comparison
    performance_delta = Column(JSON, nullable=True,
                             comment="Performance changes from previous version")
    cultural_score_delta = Column(Float, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Relationships
    flow = relationship("Flow", back_populates="versions")
    
    # Constraints
    __table_args__ = (
        UniqueConstraint('flow_id', 'version_number', name='uq_flow_version'),
        Index('ix_versions_flow_created', 'flow_id', 'created_at'),
        Index('ix_versions_stable_approved', 'is_stable', 'is_culturally_approved'),
    )
    
    def to_dict(self, include_data: bool = False) -> Dict[str, Any]:
        """Convert version to dictionary representation."""
        result = {
            "id": str(self.id),
            "flow_id": str(self.flow_id),
            "version_number": self.version_number,
            "changelog": self.changelog,
            "changelog_arabic": self.changelog_arabic,
            "is_stable": self.is_stable,
            "is_production_ready": self.is_production_ready,
            "is_culturally_approved": self.is_culturally_approved,
            "breaking_changes": self.breaking_changes,
            "cultural_score_delta": self.cultural_score_delta,
            "created_at": self.created_at.isoformat(),
            "created_by": str(self.created_by)
        }
        
        if include_data:
            result.update({
                "data": self.data,
                "ui_data": self.ui_data,
                "cultural_improvements": self.cultural_improvements,
                "islamic_compliance_changes": self.islamic_compliance_changes,
                "professional_domain_updates": self.professional_domain_updates,
                "arabic_processing_improvements": self.arabic_processing_improvements,
                "performance_delta": self.performance_delta
            })
        
        return result


class FlowTemplate(Base):
    """
    Iraqi professional flow templates for rapid deployment.
    
    Pre-built workflow templates specifically designed for Iraqi professional
    contexts with built-in cultural validation and Islamic compliance.
    """
    __tablename__ = "flow_templates"
    
    # Primary identification
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False, index=True)
    name_arabic = Column(Text, nullable=False)
    description = Column(Text, nullable=False)
    description_arabic = Column(Text, nullable=False)
    
    # Template configuration
    template_data = Column(JSON, nullable=False, comment="Template flow configuration")
    ui_template_data = Column(JSON, nullable=True, comment="UI template layout")
    
    # Iraqi professional specialization
    professional_domain = Column(String(50), nullable=False, index=True)
    use_cases = Column(ARRAY(String), nullable=False, comment="Iraqi professional use cases")
    use_cases_arabic = Column(ARRAY(String), nullable=False)
    target_organizations = Column(ARRAY(String), nullable=True, 
                                comment="Types of Iraqi organizations")
    
    # Template metadata
    complexity_level = Column(String(50), nullable=False, index=True)
    estimated_setup_time_minutes = Column(Integer, nullable=True)
    required_integrations = Column(ARRAY(String), nullable=True)
    supported_languages = Column(ARRAY(String), nullable=False, default=["en", "ar"])
    
    # Cultural validation
    cultural_validation_level = Column(String(50), nullable=False, 
                                     default=CulturalValidationStatus.APPROVED.value)
    islamic_compliance_verified = Column(Boolean, default=False)
    sectarian_neutral = Column(Boolean, default=True)
    professional_ethics_validated = Column(Boolean, default=False)
    
    # Usage statistics
    deployment_count = Column(Integer, default=0)
    success_rate = Column(Float, nullable=True)
    average_user_rating = Column(Float, nullable=True)
    
    # Template management
    is_featured = Column(Boolean, default=False)
    is_official = Column(Boolean, default=False)
    version = Column(String(50), nullable=False, default="1.0.0")
    
    # Publishing
    published_at = Column(DateTime, nullable=True, index=True)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Indexes
    __table_args__ = (
        Index('ix_templates_domain_complexity', 'professional_domain', 'complexity_level'),
        Index('ix_templates_featured_published', 'is_featured', 'published_at'),
        Index('ix_templates_cultural_validation', 'cultural_validation_level', 'islamic_compliance_verified'),
    )
    
    def to_dict(self, include_template_data: bool = False) -> Dict[str, Any]:
        """Convert template to dictionary representation."""
        result = {
            "id": str(self.id),
            "name": self.name,
            "name_arabic": self.name_arabic,
            "description": self.description,
            "description_arabic": self.description_arabic,
            "professional_domain": self.professional_domain,
            "use_cases": self.use_cases,
            "use_cases_arabic": self.use_cases_arabic,
            "target_organizations": self.target_organizations,
            "complexity_level": self.complexity_level,
            "estimated_setup_time_minutes": self.estimated_setup_time_minutes,
            "required_integrations": self.required_integrations,
            "supported_languages": self.supported_languages,
            "cultural_validation_level": self.cultural_validation_level,
            "islamic_compliance_verified": self.islamic_compliance_verified,
            "sectarian_neutral": self.sectarian_neutral,
            "professional_ethics_validated": self.professional_ethics_validated,
            "deployment_count": self.deployment_count,
            "success_rate": self.success_rate,
            "average_user_rating": self.average_user_rating,
            "is_featured": self.is_featured,
            "is_official": self.is_official,
            "version": self.version,
            "published_at": self.published_at.isoformat() if self.published_at else None,
            "created_by": str(self.created_by),
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }
        
        if include_template_data:
            result.update({
                "template_data": self.template_data,
                "ui_template_data": self.ui_template_data
            })
        
        return result


class IraqiFlowContext(Base):
    """
    Iraqi-specific cultural context for flows.
    
    Maintains cultural context, professional requirements, and Islamic compliance
    settings for flows operating within Iraqi cultural frameworks.
    """
    __tablename__ = "iraqi_flow_contexts"
    
    # Primary identification
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    flow_id = Column(UUID(as_uuid=True), ForeignKey("flows.id"), nullable=False, index=True)
    
    # Cultural context
    regional_context = Column(String(100), nullable=True, index=True, 
                            comment="Baghdad, Basra, Kurdistan, etc.")
    dialect_preference = Column(String(50), nullable=True, 
                              comment="Iraqi dialect preference")
    cultural_sensitivity_level = Column(String(50), nullable=False, default="high")
    
    # Islamic context
    islamic_calendar_awareness = Column(Boolean, default=True)
    prayer_time_consideration = Column(Boolean, default=True)
    halal_content_enforcement = Column(Boolean, default=True)
    islamic_holidays_recognition = Column(Boolean, default=True)
    
    # Professional context
    professional_ethics_framework = Column(String(100), nullable=True)
    regulatory_compliance_requirements = Column(JSON, nullable=True)
    professional_terminology_preference = Column(String(50), nullable=True, 
                                                comment="formal, colloquial, mixed")
    
    # Language preferences
    primary_language = Column(String(10), nullable=False, default="ar")
    secondary_language = Column(String(10), nullable=True, default="en")
    rtl_layout_preference = Column(Boolean, default=True)
    arabic_font_preference = Column(String(100), nullable=True)
    
    # Business context
    business_hours_timezone = Column(String(50), nullable=False, default="Asia/Baghdad")
    weekend_days = Column(ARRAY(String), nullable=False, default=["friday", "saturday"])
    official_holidays = Column(JSON, nullable=True)
    
    # Privacy and data handling
    data_localization_required = Column(Boolean, default=True)
    cross_border_data_restrictions = Column(JSON, nullable=True)
    privacy_level = Column(String(50), nullable=False, default="high")
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    flow = relationship("Flow", back_populates="cultural_contexts")
    
    # Constraints
    __table_args__ = (
        UniqueConstraint('flow_id', name='uq_flow_cultural_context'),
        Index('ix_context_regional_dialect', 'regional_context', 'dialect_preference'),
        Index('ix_context_islamic_settings', 'islamic_calendar_awareness', 'prayer_time_consideration'),
    )
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert context to dictionary representation."""
        return {
            "id": str(self.id),
            "flow_id": str(self.flow_id),
            "regional_context": self.regional_context,
            "dialect_preference": self.dialect_preference,
            "cultural_sensitivity_level": self.cultural_sensitivity_level,
            "islamic_calendar_awareness": self.islamic_calendar_awareness,
            "prayer_time_consideration": self.prayer_time_consideration,
            "halal_content_enforcement": self.halal_content_enforcement,
            "islamic_holidays_recognition": self.islamic_holidays_recognition,
            "professional_ethics_framework": self.professional_ethics_framework,
            "regulatory_compliance_requirements": self.regulatory_compliance_requirements,
            "professional_terminology_preference": self.professional_terminology_preference,
            "primary_language": self.primary_language,
            "secondary_language": self.secondary_language,
            "rtl_layout_preference": self.rtl_layout_preference,
            "arabic_font_preference": self.arabic_font_preference,
            "business_hours_timezone": self.business_hours_timezone,
            "weekend_days": self.weekend_days,
            "official_holidays": self.official_holidays,
            "data_localization_required": self.data_localization_required,
            "cross_border_data_restrictions": self.cross_border_data_restrictions,
            "privacy_level": self.privacy_level,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat()
        }
    
    def is_business_hours(self, check_time: datetime = None) -> bool:
        """Check if current time is within Iraqi business hours."""
        if not check_time:
            check_time = datetime.utcnow()
        
        # Basic business hours check (9 AM - 5 PM Baghdad time)
        # TODO: Implement proper timezone conversion
        hour = check_time.hour
        return 9 <= hour <= 17
    
    def is_weekend(self, check_date: datetime = None) -> bool:
        """Check if current date is weekend in Iraqi context."""
        if not check_date:
            check_date = datetime.utcnow()
        
        weekday_names = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
        current_weekday = weekday_names[check_date.weekday()]
        
        return current_weekday in self.weekend_days


# Export all flow models
__all__ = [
    "Flow",
    "FlowExecution", 
    "FlowVersion",
    "FlowTemplate",
    "IraqiFlowContext",
    "FlowStatus",
    "ProfessionalDomainType",
    "FlowComplexityLevel",
    "CulturalValidationStatus"
]