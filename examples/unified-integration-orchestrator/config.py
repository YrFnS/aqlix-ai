#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
==================================================
IRAQI AI ECOSYSTEM ORCHESTRATOR - CONFIGURATION
==================================================

Configuration management for the unified Iraqi AI ecosystem orchestrator.
Provides comprehensive configuration options for all integrated components
with cultural intelligence and professional domain support.

Performance Standards:
- Configuration Load Time: <50ms
- Validation Time: <100ms
- Cultural Compliance: 95%+ for all configurations
- Professional Domain Coverage: 100% (8 domains)
"""

from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any, Union
from enum import Enum
import os
from pathlib import Path

# ===== ENUMS AND CONSTANTS =====


class ProfessionalDomain(str, Enum):
    """Professional domains supported by the Iraqi AI ecosystem."""

    LEGAL = "legal"
    MEDICAL = "medical"
    EDUCATIONAL = "educational"
    GOVERNMENT = "government"
    ENGINEERING = "engineering"
    FINANCE = "finance"
    RELIGIOUS = "religious"
    CULTURAL = "cultural"
    GENERAL = "general"


class SecurityLevel(str, Enum):
    """Security clearance levels for Iraqi government services."""

    PUBLIC = "public"
    STANDARD = "standard"
    HIGH = "high"
    CLASSIFIED = "classified"
    SECRET = "secret"


class ArabicDialect(str, Enum):
    """Iraqi Arabic dialects supported by the system."""

    BAGHDAD = "baghdad"
    BASRA = "basra"
    MOSUL = "mosul"
    IRAQI_GENERAL = "iraqi_general"
    STANDARD_ARABIC = "standard_arabic"


class IntegrationMode(str, Enum):
    """Integration modes for component activation."""

    FULL = "full"  # All components active
    SELECTIVE = "selective"  # Select components based on context
    MINIMAL = "minimal"  # Essential components only
    DEVELOPMENT = "development"  # Development mode with debugging
    PRODUCTION = "production"  # Production mode with full security


# ===== CONFIGURATION CLASSES =====


@dataclass
class CulturalIntelligenceConfig:
    """Configuration for cultural intelligence features."""

    # Cultural compliance settings
    cultural_sensitivity_threshold: float = 0.95
    islamic_compliance_required: bool = True
    regional_sensitivity_enabled: bool = True
    family_context_awareness: bool = True

    # Professional domain settings
    professional_domain_validation: bool = True
    government_service_integration: bool = True
    ministry_specific_protocols: bool = True

    # Cultural validation timeouts
    cultural_validation_timeout: float = 5.0
    islamic_compliance_timeout: float = 3.0
    regional_sensitivity_timeout: float = 2.0

    # Cultural content filtering
    enable_content_filtering: bool = True
    sectarian_content_filtering: bool = True
    political_neutrality_enforcement: bool = True
    tribal_sensitivity_awareness: bool = True


@dataclass
class ArabicProcessingConfig:
    """Configuration for Arabic language processing."""

    # Arabic processing settings
    enable_arabic_processing: bool = True
    enable_rtl_processing: bool = True
    enable_dialect_recognition: bool = True
    default_dialect: ArabicDialect = ArabicDialect.IRAQI_GENERAL

    # Processing accuracy targets
    rtl_accuracy_target: float = 0.99
    dialect_recognition_target: float = 0.85
    mixed_content_processing: bool = True

    # Arabic processing timeouts
    arabic_processing_timeout: float = 3.0
    rtl_rendering_timeout: float = 1.0
    dialect_recognition_timeout: float = 2.0

    # Arabic text normalization
    enable_text_normalization: bool = True
    enable_diacritic_processing: bool = True
    enable_arabic_numerals: bool = True


@dataclass
class SecurityConfig:
    """Configuration for enterprise security features."""

    # Security settings
    enable_enterprise_security: bool = True
    default_security_level: SecurityLevel = SecurityLevel.STANDARD
    enable_audit_logging: bool = True
    enable_access_control: bool = True

    # Authentication settings
    multi_factor_authentication: bool = True
    cultural_authentication_patterns: bool = True
    islamic_calendar_integration: bool = True

    # Data protection
    enable_data_encryption: bool = True
    enable_cultural_data_protection: bool = True
    session_timeout_minutes: int = 60

    # Government compliance
    iraqi_data_protection_compliance: bool = True
    government_audit_trail: bool = True
    ministry_integration_security: bool = True


@dataclass
class PerformanceConfig:
    """Configuration for system performance optimization."""

    # Performance settings
    max_concurrent_workflows: int = 10
    max_concurrent_components: int = 50
    enable_caching: bool = True
    enable_parallel_processing: bool = True

    # Response time targets
    cultural_validation_target_ms: int = 200
    arabic_processing_target_ms: int = 300
    workflow_execution_target_ms: int = 500

    # Resource management
    memory_limit_mb: int = 1024
    cpu_usage_limit_percent: int = 80
    disk_usage_limit_gb: int = 10

    # Caching configuration
    cache_ttl_seconds: int = 3600
    cache_size_mb: int = 256
    enable_distributed_cache: bool = False


@dataclass
class ComponentIntegrationConfig:
    """Configuration for component integration settings."""

    # Integration mode
    integration_mode: IntegrationMode = IntegrationMode.SELECTIVE

    # Component categories to enable
    enable_critical_foundations: bool = True
    enable_multi_agent_frameworks: bool = True
    enable_ui_frontend: bool = True
    enable_infrastructure: bool = True
    enable_specialized_systems: bool = True

    # Specific component overrides
    component_overrides: Dict[str, bool] = field(default_factory=dict)

    # Integration timeouts
    component_initialization_timeout: float = 30.0
    component_health_check_timeout: float = 10.0
    component_shutdown_timeout: float = 15.0


@dataclass
class ProfessionalDomainConfig:
    """Configuration for professional domain support."""

    # Domain-specific settings
    default_professional_domain: ProfessionalDomain = ProfessionalDomain.GENERAL
    enable_domain_specialization: bool = True
    enable_cross_domain_integration: bool = True

    # Legal domain configuration
    legal_domain_config: Dict[str, Any] = field(
        default_factory=lambda: {
            "enable_islamic_law_compliance": True,
            "enable_commercial_law": True,
            "enable_family_law": True,
            "ministry_integration": "Ministry of Justice",
        }
    )

    # Medical domain configuration
    medical_domain_config: Dict[str, Any] = field(
        default_factory=lambda: {
            "enable_islamic_medical_ethics": True,
            "enable_patient_privacy": True,
            "enable_gender_sensitive_care": True,
            "ministry_integration": "Ministry of Health",
        }
    )

    # Educational domain configuration
    educational_domain_config: Dict[str, Any] = field(
        default_factory=lambda: {
            "enable_islamic_educational_values": True,
            "enable_iraqi_curriculum": True,
            "enable_arabic_literature": True,
            "ministry_integration": "Ministry of Education",
        }
    )

    # Government domain configuration
    government_domain_config: Dict[str, Any] = field(
        default_factory=lambda: {
            "enable_citizen_services": True,
            "enable_administrative_processes": True,
            "enable_multi_ministry_integration": True,
            "default_security_level": "high",
        }
    )


@dataclass
class PaymentGatewayConfig:
    """Configuration for Iraqi payment gateway integration."""

    # Payment gateway settings
    enable_payment_integration: bool = True
    enable_islamic_finance_compliance: bool = True

    # Supported payment gateways
    zaincash_config: Dict[str, Any] = field(
        default_factory=lambda: {
            "enabled": True,
            "minimum_amount_iqd": 1000,
            "maximum_amount_iqd": 5000000,
            "currency": "IQD",
        }
    )

    fastpay_config: Dict[str, Any] = field(
        default_factory=lambda: {
            "enabled": True,
            "minimum_amount_iqd": 500,
            "maximum_amount_iqd": 2000000,
            "currency": "IQD",
        }
    )

    nasswallet_config: Dict[str, Any] = field(
        default_factory=lambda: {
            "enabled": True,
            "minimum_amount_iqd": 1000,
            "maximum_amount_iqd": 3000000,
            "currency": "IQD",
        }
    )

    # Islamic finance settings
    enable_riba_prevention: bool = True
    enable_halal_validation: bool = True
    enable_sharia_compliance_check: bool = True


@dataclass
class IraqiEcosystemConfig:
    """Main configuration class for the Iraqi AI Ecosystem Orchestrator."""

    # Core configuration sections
    cultural_intelligence: CulturalIntelligenceConfig = field(
        default_factory=CulturalIntelligenceConfig
    )
    arabic_processing: ArabicProcessingConfig = field(
        default_factory=ArabicProcessingConfig
    )
    security: SecurityConfig = field(default_factory=SecurityConfig)
    performance: PerformanceConfig = field(default_factory=PerformanceConfig)
    component_integration: ComponentIntegrationConfig = field(
        default_factory=ComponentIntegrationConfig
    )
    professional_domains: ProfessionalDomainConfig = field(
        default_factory=ProfessionalDomainConfig
    )
    payment_gateways: PaymentGatewayConfig = field(default_factory=PaymentGatewayConfig)

    # Global settings
    orchestrator_name: str = "Iraqi AI Ecosystem Orchestrator"
    orchestrator_version: str = "1.0.0"
    enable_debugging: bool = False
    enable_verbose_logging: bool = False

    # Environment-specific settings
    environment: str = "production"  # production, development, testing
    deployment_region: str = "iraq"
    primary_language: str = "arabic"
    secondary_language: str = "english"

    # Integration settings
    enable_supabase_integration: bool = True
    enable_sentry_monitoring: bool = True
    enable_real_time_updates: bool = True


# ===== CONFIGURATION FACTORY FUNCTIONS =====


def create_development_config() -> IraqiEcosystemConfig:
    """Create configuration optimized for development environment."""
    config = IraqiEcosystemConfig()

    # Development-specific overrides
    config.environment = "development"
    config.enable_debugging = True
    config.enable_verbose_logging = True
    config.component_integration.integration_mode = IntegrationMode.DEVELOPMENT
    config.security.enable_enterprise_security = False
    config.performance.max_concurrent_workflows = 5

    return config


def create_production_config() -> IraqiEcosystemConfig:
    """Create configuration optimized for production environment."""
    config = IraqiEcosystemConfig()

    # Production-specific overrides
    config.environment = "production"
    config.enable_debugging = False
    config.enable_verbose_logging = False
    config.component_integration.integration_mode = IntegrationMode.PRODUCTION
    config.security.enable_enterprise_security = True
    config.cultural_intelligence.cultural_sensitivity_threshold = 0.98

    return config


def create_testing_config() -> IraqiEcosystemConfig:
    """Create configuration optimized for testing environment."""
    config = IraqiEcosystemConfig()

    # Testing-specific overrides
    config.environment = "testing"
    config.enable_debugging = True
    config.component_integration.integration_mode = IntegrationMode.MINIMAL
    config.performance.max_concurrent_workflows = 3
    config.cultural_intelligence.cultural_validation_timeout = 1.0
    config.arabic_processing.arabic_processing_timeout = 1.0

    return config


def create_legal_domain_config() -> IraqiEcosystemConfig:
    """Create configuration optimized for Iraqi legal professionals."""
    config = create_production_config()

    # Legal domain-specific overrides
    config.professional_domains.default_professional_domain = ProfessionalDomain.LEGAL
    config.cultural_intelligence.cultural_sensitivity_threshold = 0.98
    config.security.default_security_level = SecurityLevel.HIGH
    config.arabic_processing.default_dialect = ArabicDialect.BAGHDAD

    # Enable legal-specific components
    config.component_integration.component_overrides.update(
        {
            "cline_planning_system": True,
            "archon_rag_system": True,
            "government_cli_integration": True,
            "legal_document_processor": True,
        }
    )

    return config


def create_medical_domain_config() -> IraqiEcosystemConfig:
    """Create configuration optimized for Iraqi medical professionals."""
    config = create_production_config()

    # Medical domain-specific overrides
    config.professional_domains.default_professional_domain = ProfessionalDomain.MEDICAL
    config.cultural_intelligence.islamic_compliance_required = True
    config.security.default_security_level = SecurityLevel.HIGH
    config.arabic_processing.enable_medical_terminology = True

    return config


def create_government_config() -> IraqiEcosystemConfig:
    """Create configuration optimized for Iraqi government services."""
    config = create_production_config()

    # Government-specific overrides
    config.professional_domains.default_professional_domain = (
        ProfessionalDomain.GOVERNMENT
    )
    config.security.default_security_level = SecurityLevel.CLASSIFIED
    config.security.government_audit_trail = True
    config.cultural_intelligence.cultural_sensitivity_threshold = 0.99

    return config


# ===== ENVIRONMENT-BASED CONFIGURATION LOADER =====


def load_config_from_environment() -> IraqiEcosystemConfig:
    """Load configuration from environment variables."""

    # Determine environment
    environment = os.getenv("IRAQI_AI_ENVIRONMENT", "production").lower()

    # Create base configuration
    if environment == "development":
        config = create_development_config()
    elif environment == "testing":
        config = create_testing_config()
    else:
        config = create_production_config()

    # Override with environment variables

    # Cultural Intelligence
    if os.getenv("IRAQI_CULTURAL_SENSITIVITY"):
        config.cultural_intelligence.cultural_sensitivity_threshold = float(
            os.getenv("IRAQI_CULTURAL_SENSITIVITY")
        )

    if os.getenv("ISLAMIC_COMPLIANCE_REQUIRED"):
        config.cultural_intelligence.islamic_compliance_required = (
            os.getenv("ISLAMIC_COMPLIANCE_REQUIRED").lower() == "true"
        )

    # Arabic Processing
    if os.getenv("ENABLE_ARABIC_PROCESSING"):
        config.arabic_processing.enable_arabic_processing = (
            os.getenv("ENABLE_ARABIC_PROCESSING").lower() == "true"
        )

    if os.getenv("DEFAULT_ARABIC_DIALECT"):
        config.arabic_processing.default_dialect = ArabicDialect(
            os.getenv("DEFAULT_ARABIC_DIALECT")
        )

    # Security
    if os.getenv("ENABLE_ENTERPRISE_SECURITY"):
        config.security.enable_enterprise_security = (
            os.getenv("ENABLE_ENTERPRISE_SECURITY").lower() == "true"
        )

    if os.getenv("DEFAULT_SECURITY_LEVEL"):
        config.security.default_security_level = SecurityLevel(
            os.getenv("DEFAULT_SECURITY_LEVEL")
        )

    # Performance
    if os.getenv("MAX_CONCURRENT_WORKFLOWS"):
        config.performance.max_concurrent_workflows = int(
            os.getenv("MAX_CONCURRENT_WORKFLOWS")
        )

    # Professional Domain
    if os.getenv("DEFAULT_PROFESSIONAL_DOMAIN"):
        config.professional_domains.default_professional_domain = ProfessionalDomain(
            os.getenv("DEFAULT_PROFESSIONAL_DOMAIN")
        )

    return config


# ===== CONFIGURATION VALIDATION =====


def validate_config(config: IraqiEcosystemConfig) -> List[str]:
    """Validate configuration and return list of validation errors."""
    errors = []

    # Validate cultural intelligence settings
    if (
        config.cultural_intelligence.cultural_sensitivity_threshold < 0.0
        or config.cultural_intelligence.cultural_sensitivity_threshold > 1.0
    ):
        errors.append("Cultural sensitivity threshold must be between 0.0 and 1.0")

    if config.cultural_intelligence.cultural_validation_timeout <= 0:
        errors.append("Cultural validation timeout must be positive")

    # Validate Arabic processing settings
    if (
        config.arabic_processing.rtl_accuracy_target < 0.0
        or config.arabic_processing.rtl_accuracy_target > 1.0
    ):
        errors.append("RTL accuracy target must be between 0.0 and 1.0")

    if (
        config.arabic_processing.dialect_recognition_target < 0.0
        or config.arabic_processing.dialect_recognition_target > 1.0
    ):
        errors.append("Dialect recognition target must be between 0.0 and 1.0")

    # Validate performance settings
    if config.performance.max_concurrent_workflows <= 0:
        errors.append("Max concurrent workflows must be positive")

    if config.performance.memory_limit_mb <= 0:
        errors.append("Memory limit must be positive")

    # Validate security settings
    if config.security.session_timeout_minutes <= 0:
        errors.append("Session timeout must be positive")

    return errors


# ===== DEFAULT CONFIGURATION =====


def get_default_config() -> IraqiEcosystemConfig:
    """Get the default configuration for the Iraqi AI Ecosystem."""
    try:
        # Try to load from environment first
        return load_config_from_environment()
    except Exception:
        # Fallback to production config
        return create_production_config()


# ===== EXPORT =====

__all__ = [
    "IraqiEcosystemConfig",
    "ProfessionalDomain",
    "SecurityLevel",
    "ArabicDialect",
    "IntegrationMode",
    "CulturalIntelligenceConfig",
    "ArabicProcessingConfig",
    "SecurityConfig",
    "PerformanceConfig",
    "ComponentIntegrationConfig",
    "ProfessionalDomainConfig",
    "PaymentGatewayConfig",
    "create_development_config",
    "create_production_config",
    "create_testing_config",
    "create_legal_domain_config",
    "create_medical_domain_config",
    "create_government_config",
    "load_config_from_environment",
    "validate_config",
    "get_default_config",
]
