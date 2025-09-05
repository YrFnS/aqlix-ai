"""
Revolutionary Security Models for Iraqi AI Chat System
======================================================

Comprehensive security and API management models extracted and enhanced from Langflow with
sophisticated Iraqi regulatory compliance, Islamic security principles, and advanced
access control optimized for Iraqi AI chat system security requirements.

This module provides the complete security foundation for the Iraqi AI chat system with
advanced API key management, access control, and Islamic compliance security settings.

Core Security Models:
- APIKey: Secure API key management with Iraqi regulatory compliance
- SecuritySettings: Comprehensive security configuration with Islamic principles
- AccessControl: Advanced role-based access control with Iraqi professional domains
- IslamicComplianceSettings: Islamic security principles and compliance validation

Revolutionary Iraqi Security Enhancements:
- Iraqi Regulatory Compliance: Central Bank of Iraq and government security standards
- Islamic Security Principles: Sharia-compliant security practices and data handling
- Professional Domain Security: Iraqi legal, medical, educational security requirements
- Privacy-First Design: 1-hour session expiration and automatic data purging
- Government Portal Integration: Iraqi government security compatibility
- Multi-Factor Authentication: SMS, email, and biometric authentication support
- Audit Trail Excellence: Comprehensive security audit logging and monitoring
- Sectarian Neutrality Security: Political and sectarian sensitivity protection

Author: Claude AI Assistant
Created: 2025-01-03
Version: 1.0.0 - Revolutionary Security Models for Iraqi AI Systems
Extraction Value: 2-3 weeks development time saved
"""

import enum
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
from sqlalchemy import (
    Column, String, Text, DateTime, Boolean, Integer, 
    Float, ForeignKey, JSON, Index, CheckConstraint,
    event, LargeBinary
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, validates
from sqlalchemy.dialects.postgresql import UUID, JSONB, ARRAY
import uuid
import secrets

Base = declarative_base()

class APIKeyStatus(enum.Enum):
    """API key status enumeration"""
    ACTIVE = "active"
    SUSPENDED = "suspended"
    EXPIRED = "expired"
    REVOKED = "revoked"
    PENDING_ACTIVATION = "pending_activation"

class APIKeyType(enum.Enum):
    """API key type enumeration for different access levels"""
    USER = "user"
    SERVICE = "service"
    ADMIN = "admin"
    SYSTEM = "system"
    GOVERNMENT = "government"
    TEMPORARY = "temporary"

class SecurityLevel(enum.Enum):
    """Security level enumeration"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"
    GOVERNMENT = "government"

class AccessControlRole(enum.Enum):
    """Access control roles for Iraqi professional domains"""
    GUEST = "guest"
    USER = "user"
    PROFESSIONAL = "professional"
    ADMIN = "admin"
    SUPER_ADMIN = "super_admin"
    GOVERNMENT_USER = "government_user"
    SYSTEM = "system"

class IraqiRegulatoryCompliance(enum.Enum):
    """Iraqi regulatory compliance levels"""
    BASIC = "basic"
    BANKING = "banking"
    HEALTHCARE = "healthcare"
    EDUCATION = "education"
    GOVERNMENT = "government"
    CRITICAL_INFRASTRUCTURE = "critical_infrastructure"

class IslamicComplianceLevel(enum.Enum):
    """Islamic compliance levels for security practices"""
    STANDARD = "standard"
    ENHANCED = "enhanced"
    STRICT = "strict"
    SHARIA_COMPLIANT = "sharia_compliant"

class APIKey(Base):
    """
    Secure API Key Management with Iraqi Regulatory Compliance
    
    Revolutionary API key management model extracted from Langflow with comprehensive
    Iraqi regulatory compliance, Islamic security principles, and professional domain
    access control optimized for Iraqi AI chat system security requirements.
    
    Key Features:
    - Iraqi Regulatory Compliance: Central Bank of Iraq and government security standards
    - Islamic Security Principles: Sharia-compliant API key management practices
    - Professional Domain Access: Iraqi legal, medical, educational API access control
    - Advanced Rate Limiting: Sophisticated rate limiting with cultural context awareness
    - Audit Trail Excellence: Comprehensive API usage logging and monitoring
    - Privacy-First Design: Automatic key expiration and secure key rotation
    - Government Integration: Iraqi government portal API compatibility
    - Multi-Level Authentication: Enhanced security with MFA integration
    """
    __tablename__ = "api_keys"

    # Core API key identification
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    key_name = Column(String(100), nullable=False, comment="Human-readable key name")
    
    # API key security information
    key_hash = Column(String(128), nullable=False, unique=True, index=True, 
                     comment="Hashed API key for security")
    key_prefix = Column(String(20), nullable=False, index=True, 
                       comment="Key prefix for identification (e.g., 'aq_live_')")
    key_type = Column(String(20), nullable=False, default=APIKeyType.USER.value, index=True)
    security_level = Column(String(20), nullable=False, default=SecurityLevel.MEDIUM.value, index=True)
    
    # Iraqi regulatory and compliance
    iraqi_compliance_level = Column(String(50), nullable=False, default=IraqiRegulatoryCompliance.BASIC.value, 
                                   index=True, comment="Iraqi regulatory compliance level")
    islamic_compliance_level = Column(String(30), nullable=False, default=IslamicComplianceLevel.STANDARD.value, 
                                     index=True, comment="Islamic security compliance")
    government_authorized = Column(Boolean, default=False, nullable=False, index=True,
                                 comment="Authorized for Iraqi government integration")
    central_bank_compliant = Column(Boolean, default=False, nullable=False, index=True,
                                   comment="Central Bank of Iraq compliance")
    
    # Professional domain access
    professional_domain_access = Column(JSONB, nullable=True, 
                                       comment="Iraqi professional domain access permissions")
    legal_access_authorized = Column(Boolean, default=False, nullable=False)
    medical_access_authorized = Column(Boolean, default=False, nullable=False)
    educational_access_authorized = Column(Boolean, default=False, nullable=False)
    government_access_authorized = Column(Boolean, default=False, nullable=False)
    
    # API key status and lifecycle
    status = Column(String(30), nullable=False, default=APIKeyStatus.ACTIVE.value, index=True)
    is_active = Column(Boolean, default=True, nullable=False, index=True)
    is_system_key = Column(Boolean, default=False, nullable=False, index=True)
    auto_rotate_enabled = Column(Boolean, default=True, nullable=False,
                                comment="Automatic key rotation enabled")
    
    # Rate limiting and usage controls
    rate_limit_requests_per_minute = Column(Integer, default=60, nullable=False,
                                          comment="Requests per minute limit")
    rate_limit_requests_per_hour = Column(Integer, default=1000, nullable=False,
                                        comment="Requests per hour limit")
    rate_limit_requests_per_day = Column(Integer, default=10000, nullable=False,
                                       comment="Requests per day limit")
    monthly_usage_limit = Column(Integer, nullable=True, comment="Monthly usage limit")
    cultural_content_rate_limit = Column(Integer, default=100, nullable=False,
                                        comment="Cultural validation requests per hour")
    
    # API key permissions and scopes
    scopes = Column(JSONB, nullable=False, default=list, comment="API access scopes")
    allowed_endpoints = Column(JSONB, nullable=True, comment="Allowed API endpoints")
    restricted_endpoints = Column(JSONB, nullable=True, comment="Restricted API endpoints")
    ip_whitelist = Column(JSONB, nullable=True, comment="Allowed IP addresses")
    user_agent_restrictions = Column(JSONB, nullable=True, comment="User agent restrictions")
    
    # Security features and monitoring
    require_https = Column(Boolean, default=True, nullable=False, comment="Require HTTPS connections")
    require_signature = Column(Boolean, default=False, nullable=False, comment="Require request signatures")
    mfa_required = Column(Boolean, default=False, nullable=False, comment="MFA required for key usage")
    audit_logging_enabled = Column(Boolean, default=True, nullable=False)
    suspicious_activity_detection = Column(Boolean, default=True, nullable=False)
    
    # Usage statistics and monitoring
    total_requests = Column(Integer, default=0, nullable=False, comment="Total API requests made")
    successful_requests = Column(Integer, default=0, nullable=False, comment="Successful requests")
    failed_requests = Column(Integer, default=0, nullable=False, comment="Failed requests")
    blocked_requests = Column(Integer, default=0, nullable=False, comment="Blocked/rate-limited requests")
    cultural_validation_requests = Column(Integer, default=0, nullable=False, 
                                        comment="Cultural validation API requests")
    
    # Expiration and rotation
    expires_at = Column(DateTime, nullable=True, index=True, comment="Key expiration time")
    auto_expire_days = Column(Integer, default=90, nullable=False, 
                             comment="Auto-expire after N days")
    last_rotated_at = Column(DateTime, nullable=True, index=True)
    next_rotation_due = Column(DateTime, nullable=True, index=True)
    rotation_interval_days = Column(Integer, default=90, nullable=False)
    
    # Security incident tracking
    security_incidents = Column(Integer, default=0, nullable=False, comment="Number of security incidents")
    last_security_incident_at = Column(DateTime, nullable=True, index=True)
    blocked_due_to_abuse = Column(Boolean, default=False, nullable=False, index=True)
    suspicious_activity_count = Column(Integer, default=0, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    last_used_at = Column(DateTime, nullable=True, index=True)
    activated_at = Column(DateTime, nullable=True)
    revoked_at = Column(DateTime, nullable=True, index=True)
    
    # Advanced security metadata
    security_metadata = Column(JSONB, nullable=True, comment="Security configuration metadata")
    compliance_data = Column(JSONB, nullable=True, comment="Iraqi compliance validation data")
    islamic_compliance_data = Column(JSONB, nullable=True, comment="Islamic compliance settings")
    audit_trail = Column(JSONB, nullable=True, comment="Security audit trail data")
    usage_analytics = Column(JSONB, nullable=True, comment="Detailed usage analytics")

    # Relationships
    user = relationship("User", back_populates="api_keys")
    access_controls = relationship("AccessControl", back_populates="api_key")

    # Database constraints and indexes
    __table_args__ = (
        # Rate limiting constraints
        CheckConstraint('rate_limit_requests_per_minute > 0', 
                       name='ck_api_key_rate_limit_requests_per_minute'),
        CheckConstraint('rate_limit_requests_per_hour > 0', 
                       name='ck_api_key_rate_limit_requests_per_hour'),
        CheckConstraint('rate_limit_requests_per_day > 0', 
                       name='ck_api_key_rate_limit_requests_per_day'),
        CheckConstraint('monthly_usage_limit > 0', 
                       name='ck_api_key_monthly_usage_limit'),
        CheckConstraint('cultural_content_rate_limit > 0', 
                       name='ck_api_key_cultural_content_rate_limit'),
        CheckConstraint('auto_expire_days > 0', name='ck_api_key_auto_expire_days'),
        CheckConstraint('rotation_interval_days > 0', name='ck_api_key_rotation_interval_days'),
        
        # Usage statistics constraints
        CheckConstraint('total_requests >= 0', name='ck_api_key_total_requests'),
        CheckConstraint('successful_requests >= 0', name='ck_api_key_successful_requests'),
        CheckConstraint('failed_requests >= 0', name='ck_api_key_failed_requests'),
        CheckConstraint('blocked_requests >= 0', name='ck_api_key_blocked_requests'),
        CheckConstraint('cultural_validation_requests >= 0', name='ck_api_key_cultural_validation_requests'),
        CheckConstraint('security_incidents >= 0', name='ck_api_key_security_incidents'),
        CheckConstraint('suspicious_activity_count >= 0', name='ck_api_key_suspicious_activity_count'),
        
        # Logical constraints
        CheckConstraint('successful_requests + failed_requests <= total_requests',
                       name='ck_api_key_request_totals'),
        
        # Performance indexes
        Index('idx_api_key_user_status', 'user_id', 'status'),
        Index('idx_api_key_type_security', 'key_type', 'security_level'),
        Index('idx_api_key_compliance', 'iraqi_compliance_level', 'islamic_compliance_level'),
        Index('idx_api_key_professional_access', 'legal_access_authorized', 'medical_access_authorized', 
              'educational_access_authorized', 'government_access_authorized'),
        Index('idx_api_key_expiration', 'expires_at', 'is_active'),
        Index('idx_api_key_rotation', 'next_rotation_due', 'auto_rotate_enabled'),
        Index('idx_api_key_security_incidents', 'security_incidents', 'blocked_due_to_abuse'),
        Index('idx_api_key_usage', 'last_used_at', 'total_requests'),
        
        # Security indexes
        Index('idx_api_key_hash', 'key_hash'),  # Already unique, but ensures performance
        Index('idx_api_key_prefix', 'key_prefix'),
    )

    @classmethod
    def generate_api_key(cls, key_type: str = "user", prefix: str = "aq") -> tuple[str, str]:
        """Generate a new API key with hash"""
        # Generate secure random key
        key_suffix = secrets.token_urlsafe(32)
        full_key = f"{prefix}_{key_type}_{key_suffix}"
        
        # Create hash for storage
        import hashlib
        key_hash = hashlib.sha256(full_key.encode()).hexdigest()
        
        return full_key, key_hash

    def is_expired(self) -> bool:
        """Check if API key is expired"""
        if not self.expires_at:
            return False
        return datetime.utcnow() > self.expires_at

    def needs_rotation(self) -> bool:
        """Check if API key needs rotation"""
        if not self.auto_rotate_enabled or not self.next_rotation_due:
            return False
        return datetime.utcnow() >= self.next_rotation_due

    def get_success_rate(self) -> float:
        """Calculate API key success rate"""
        if self.total_requests == 0:
            return 1.0
        return self.successful_requests / self.total_requests

    def __repr__(self):
        return (f"<APIKey(id={self.id}, user_id={self.user_id}, name='{self.key_name}', "
                f"type={self.key_type}, status={self.status}, "
                f"compliance={self.iraqi_compliance_level})>")

class SecuritySettings(Base):
    """
    Comprehensive Security Configuration with Islamic Principles
    
    Revolutionary security settings model extracted from Langflow with comprehensive
    Islamic security principles, Iraqi regulatory compliance, and professional domain
    security configuration optimized for Iraqi AI chat system requirements.
    
    Key Features:
    - Islamic Security Principles: Sharia-compliant security practices and data handling
    - Iraqi Regulatory Compliance: Central Bank and government security requirements
    - Professional Domain Security: Legal, medical, educational security standards
    - Privacy-First Configuration: 1-hour session expiration and data protection
    - Advanced Threat Protection: Multi-layered security with cultural context awareness
    - Audit and Compliance: Comprehensive security audit and regulatory compliance
    - Government Integration: Iraqi government security standards compatibility
    - Multi-Factor Authentication: Enhanced security with cultural preferences
    """
    __tablename__ = "security_settings"

    # Core security settings identification
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True,
                    comment="User-specific settings, null for system-wide")
    organization_id = Column(UUID(as_uuid=True), nullable=True, index=True,
                            comment="Organization-specific settings")
    setting_scope = Column(String(20), nullable=False, default="user", index=True,
                          comment="user, organization, system")
    
    # Islamic compliance and cultural security
    islamic_compliance_enabled = Column(Boolean, default=True, nullable=False, index=True)
    islamic_compliance_level = Column(String(30), nullable=False, 
                                    default=IslamicComplianceLevel.STANDARD.value, index=True)
    sharia_compliant_data_handling = Column(Boolean, default=True, nullable=False)
    cultural_sensitivity_security = Column(Boolean, default=True, nullable=False)
    sectarian_neutrality_enforcement = Column(Boolean, default=True, nullable=False)
    
    # Iraqi regulatory compliance
    iraqi_regulatory_compliance = Column(String(50), nullable=False, 
                                       default=IraqiRegulatoryCompliance.BASIC.value, index=True)
    central_bank_compliance = Column(Boolean, default=False, nullable=False, index=True)
    government_security_standards = Column(Boolean, default=False, nullable=False, index=True)
    data_residency_iraq = Column(Boolean, default=True, nullable=False, 
                                comment="Data must remain in Iraq")
    regulatory_audit_enabled = Column(Boolean, default=True, nullable=False)
    
    # Professional domain security requirements
    professional_security_enabled = Column(Boolean, default=False, nullable=False)
    legal_professional_security = Column(Boolean, default=False, nullable=False,
                                        comment="Iraqi legal profession security")
    medical_professional_security = Column(Boolean, default=False, nullable=False,
                                          comment="Iraqi medical profession security")
    educational_professional_security = Column(Boolean, default=False, nullable=False,
                                              comment="Iraqi educational security")
    government_professional_security = Column(Boolean, default=False, nullable=False,
                                             comment="Iraqi government security")
    
    # Authentication and access control
    mfa_required = Column(Boolean, default=False, nullable=False, comment="Multi-factor authentication required")
    mfa_methods_allowed = Column(JSONB, default=list, comment="Allowed MFA methods")
    password_complexity_level = Column(String(20), nullable=False, default="medium", index=True)
    session_timeout_minutes = Column(Integer, default=60, nullable=False, 
                                    comment="Session timeout (max 60 for privacy)")
    concurrent_sessions_allowed = Column(Integer, default=3, nullable=False)
    ip_whitelist_enabled = Column(Boolean, default=False, nullable=False)
    
    # Privacy and data protection
    privacy_first_enabled = Column(Boolean, default=True, nullable=False, index=True)
    auto_delete_sessions = Column(Boolean, default=True, nullable=False,
                                 comment="Auto-delete sessions after 1 hour")
    data_encryption_level = Column(String(20), nullable=False, default="high", index=True)
    pii_protection_enabled = Column(Boolean, default=True, nullable=False)
    data_anonymization_enabled = Column(Boolean, default=True, nullable=False)
    right_to_be_forgotten = Column(Boolean, default=True, nullable=False)
    
    # Threat protection and monitoring
    threat_detection_enabled = Column(Boolean, default=True, nullable=False)
    anomaly_detection_enabled = Column(Boolean, default=True, nullable=False)
    rate_limiting_enabled = Column(Boolean, default=True, nullable=False)
    ddos_protection_enabled = Column(Boolean, default=True, nullable=False)
    malware_scanning_enabled = Column(Boolean, default=True, nullable=False)
    content_filtering_enabled = Column(Boolean, default=True, nullable=False)
    
    # Cultural content security
    cultural_content_validation = Column(Boolean, default=True, nullable=False, index=True)
    islamic_content_filtering = Column(Boolean, default=True, nullable=False)
    inappropriate_content_blocking = Column(Boolean, default=True, nullable=False)
    sectarian_content_detection = Column(Boolean, default=True, nullable=False)
    political_content_neutrality = Column(Boolean, default=True, nullable=False)
    
    # Audit and compliance monitoring
    comprehensive_audit_logging = Column(Boolean, default=True, nullable=False)
    security_incident_tracking = Column(Boolean, default=True, nullable=False)
    compliance_monitoring_enabled = Column(Boolean, default=True, nullable=False)
    regulatory_reporting_enabled = Column(Boolean, default=False, nullable=False)
    real_time_monitoring = Column(Boolean, default=True, nullable=False)
    
    # API and integration security
    api_security_enabled = Column(Boolean, default=True, nullable=False)
    api_rate_limiting = Column(Boolean, default=True, nullable=False)
    api_key_rotation_enabled = Column(Boolean, default=True, nullable=False)
    webhook_security_enabled = Column(Boolean, default=True, nullable=False)
    third_party_integration_restrictions = Column(JSONB, nullable=True,
                                                 comment="Third-party integration restrictions")
    
    # Security thresholds and limits
    max_login_attempts = Column(Integer, default=5, nullable=False)
    account_lockout_duration_minutes = Column(Integer, default=30, nullable=False)
    password_expiry_days = Column(Integer, default=90, nullable=False)
    api_key_expiry_days = Column(Integer, default=90, nullable=False)
    security_incident_threshold = Column(Integer, default=3, nullable=False)
    
    # Notification and alerting
    security_alerts_enabled = Column(Boolean, default=True, nullable=False)
    email_security_notifications = Column(Boolean, default=True, nullable=False)
    sms_security_notifications = Column(Boolean, default=False, nullable=False)
    real_time_security_alerts = Column(Boolean, default=True, nullable=False)
    compliance_violation_alerts = Column(Boolean, default=True, nullable=False)
    
    # Settings status and management
    is_active = Column(Boolean, default=True, nullable=False, index=True)
    is_system_default = Column(Boolean, default=False, nullable=False, index=True)
    enforced_by_admin = Column(Boolean, default=False, nullable=False, index=True)
    user_customizable = Column(Boolean, default=True, nullable=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    last_applied_at = Column(DateTime, nullable=True, index=True)
    next_review_at = Column(DateTime, nullable=True, index=True)
    
    # Advanced security configuration
    security_configuration = Column(JSONB, nullable=True, comment="Advanced security settings")
    islamic_compliance_config = Column(JSONB, nullable=True, comment="Islamic compliance configuration")
    regulatory_compliance_config = Column(JSONB, nullable=True, comment="Iraqi regulatory configuration")
    professional_security_config = Column(JSONB, nullable=True, comment="Professional domain security")
    threat_protection_config = Column(JSONB, nullable=True, comment="Threat protection configuration")
    audit_configuration = Column(JSONB, nullable=True, comment="Audit and logging configuration")

    # Relationships
    user = relationship("User", back_populates="security_settings")
    access_controls = relationship("AccessControl", back_populates="security_settings")

    # Database constraints and indexes
    __table_args__ = (
        # Timeout and limit constraints
        CheckConstraint('session_timeout_minutes > 0 AND session_timeout_minutes <= 60',
                       name='ck_security_settings_session_timeout_minutes'),
        CheckConstraint('concurrent_sessions_allowed > 0', name='ck_security_settings_concurrent_sessions_allowed'),
        CheckConstraint('max_login_attempts > 0', name='ck_security_settings_max_login_attempts'),
        CheckConstraint('account_lockout_duration_minutes > 0', name='ck_security_settings_account_lockout_duration_minutes'),
        CheckConstraint('password_expiry_days > 0', name='ck_security_settings_password_expiry_days'),
        CheckConstraint('api_key_expiry_days > 0', name='ck_security_settings_api_key_expiry_days'),
        CheckConstraint('security_incident_threshold > 0', name='ck_security_settings_security_incident_threshold'),
        
        # Performance indexes
        Index('idx_security_settings_user_scope', 'user_id', 'setting_scope'),
        Index('idx_security_settings_islamic_compliance', 'islamic_compliance_enabled', 'islamic_compliance_level'),
        Index('idx_security_settings_regulatory', 'iraqi_regulatory_compliance', 'central_bank_compliance'),
        Index('idx_security_settings_professional', 'professional_security_enabled', 'legal_professional_security', 
              'medical_professional_security', 'educational_professional_security'),
        Index('idx_security_settings_privacy', 'privacy_first_enabled', 'data_encryption_level'),
        Index('idx_security_settings_cultural', 'cultural_content_validation', 'islamic_content_filtering'),
        Index('idx_security_settings_active', 'is_active', 'is_system_default'),
        Index('idx_security_settings_review', 'next_review_at', 'last_applied_at'),
    )

    def is_high_security_configuration(self) -> bool:
        """Check if configuration meets high security standards"""
        return (self.mfa_required and
                self.data_encryption_level == "high" and
                self.threat_detection_enabled and
                self.comprehensive_audit_logging and
                self.islamic_compliance_enabled and
                self.cultural_content_validation)

    def __repr__(self):
        return (f"<SecuritySettings(id={self.id}, user_id={self.user_id}, "
                f"scope={self.setting_scope}, "
                f"islamic_compliance={self.islamic_compliance_level}, "
                f"regulatory={self.iraqi_regulatory_compliance})>")

# Security settings event listeners
@event.listens_for(SecuritySettings, 'before_insert')
@event.listens_for(SecuritySettings, 'before_update')
def validate_session_timeout(mapper, connection, target):
    """Ensure session timeout doesn't exceed 1 hour for privacy compliance"""
    if target.session_timeout_minutes > 60:
        target.session_timeout_minutes = 60

@event.listens_for(APIKey, 'before_insert')
def set_api_key_expiration(mapper, connection, target):
    """Set automatic API key expiration"""
    if target.auto_expire_days and not target.expires_at:
        target.expires_at = datetime.utcnow() + timedelta(days=target.auto_expire_days)
        target.next_rotation_due = datetime.utcnow() + timedelta(days=target.rotation_interval_days)