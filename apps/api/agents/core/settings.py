"""
Iraqi AI Chat System - PydanticAI Agent Settings
Foundation settings configuration with cultural intelligence integration
"""

from typing import List, Optional, Literal
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class IraqiAgentSettings(BaseSettings):
    """
    Comprehensive settings for Iraqi AI Agent system with cultural intelligence.

    This configuration class manages all Iraqi-specific settings including:
    - Cultural validation modes and thresholds
    - Islamic compliance requirements
    - Arabic processing configuration
    - Professional domain support
    - Performance targets
    - Security configuration
    """

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", case_sensitive=False, extra="ignore"
    )

    # Core Agent Configuration
    agent_name: str = Field(default="iraqi-ai-agent", description="Agent identifier")
    agent_version: str = Field(default="1.0.0", description="Agent version")
    debug_mode: bool = Field(default=False, description="Enable debug logging")

    # Model Provider Configuration
    openai_api_key: str = Field(..., validation_alias="OPENAI_API_KEY")
    anthropic_api_key: Optional[str] = Field(
        default=None, validation_alias="ANTHROPIC_API_KEY"
    )
    google_api_key: Optional[str] = Field(
        default=None, validation_alias="GOOGLE_API_KEY"
    )
    groq_api_key: Optional[str] = Field(default=None, validation_alias="GROQ_API_KEY")

    # Primary model configuration (default: gpt-4o-mini for cost optimization)
    default_model: str = Field(default="openai:gpt-4o-mini")
    fallback_model: str = Field(default="openai:gpt-3.5-turbo")

    # Iraqi Cultural Intelligence Configuration
    cultural_mode: Literal["strict", "moderate", "flexible"] = Field(
        default="strict", description="Cultural validation strictness level"
    )
    islamic_compliance_required: bool = Field(
        default=True,
        description="Require 100% Islamic compliance in all agent responses",
    )
    arabic_dialect_support: bool = Field(
        default=True,
        description="Enable Iraqi Arabic dialect recognition and processing",
    )
    rtl_processing_enabled: bool = Field(
        default=True, description="Enable RTL text direction processing for Arabic"
    )

    # Cultural Validation Thresholds
    cultural_appropriateness_threshold: float = Field(
        default=0.95,
        ge=0.0,
        le=1.0,
        description="Minimum cultural appropriateness score (0.0-1.0)",
    )
    islamic_compliance_threshold: float = Field(
        default=1.00,
        ge=0.0,
        le=1.0,
        description="Minimum Islamic compliance score (0.0-1.0)",
    )
    dialect_recognition_threshold: float = Field(
        default=0.85,
        ge=0.0,
        le=1.0,
        description="Minimum Iraqi dialect recognition accuracy (0.0-1.0)",
    )
    rtl_accuracy_threshold: float = Field(
        default=0.99,
        ge=0.0,
        le=1.0,
        description="Minimum Arabic RTL processing accuracy (0.0-1.0)",
    )

    # Performance Configuration
    # FIX #5: Timeout Hierarchy - workflow_timeout_ms must be > agent_timeout_ms
    validation_timeout_ms: int = Field(
        default=200, description="Maximum cultural validation time (ms)"
    )
    agent_timeout_ms: int = Field(
        default=5000, description="Maximum single agent execution time (ms)"
    )
    workflow_timeout_ms: int = Field(
        default=6000,
        description="Maximum multi-agent workflow time (ms) - must be > agent_timeout_ms",
    )
    max_retries: int = Field(
        default=3, description="Maximum retry attempts for agent operations"
    )

    # Professional Domain Configuration
    professional_domains: List[str] = Field(
        default_factory=lambda: [
            "legal",
            "medical",
            "educational",
            "engineering",
            "organizational",
            "business",
            "technical",
        ],
        description="Enabled Iraqi professional domains",
    )

    # Security Configuration
    input_validation_enabled: bool = Field(
        default=True, description="Enable comprehensive input validation"
    )
    output_sanitization_enabled: bool = Field(
        default=True, description="Enable cultural output sanitization"
    )
    sensitive_data_filtering: bool = Field(
        default=True, description="Enable sensitive data filtering"
    )
    security_scan_level: Literal["low", "medium", "high"] = Field(
        default="high", description="Security scanning level"
    )

    # Monitoring and Observability
    enable_performance_tracking: bool = Field(
        default=True, description="Enable performance metrics tracking"
    )
    enable_cultural_metrics: bool = Field(
        default=True, description="Enable cultural compliance metrics tracking"
    )
    log_level: Literal["DEBUG", "INFO", "WARNING", "ERROR"] = Field(
        default="INFO", description="Logging level"
    )

    # Database Configuration (Supabase)
    supabase_url: str = Field(..., validation_alias="SUPABASE_URL")
    supabase_key: str = Field(..., validation_alias="SUPABASE_ANON_KEY")
    supabase_service_role_key: Optional[str] = Field(
        default=None, validation_alias="SUPABASE_SERVICE_ROLE_KEY"
    )

    # Monitoring (Sentry)
    sentry_dsn: Optional[str] = Field(default=None, validation_alias="SENTRY_DSN")

    # Redis Configuration for Caching
    # FIX #9: Redis URL Default - Remove default, require explicit REDIS_URL
    redis_url: Optional[str] = Field(
        default=None,
        validation_alias="REDIS_URL",
        description="Redis connection URL - required for production, no default to prevent localhost assumptions",
    )
    cache_ttl: int = Field(default=3600, description="Cache TTL in seconds")

    # Payment Gateway Configuration (Iraqi-specific)
    zaincash_enabled: bool = Field(default=True)
    zaincash_min_amount: int = Field(default=1000, description="Minimum amount in IQD")

    fastpay_enabled: bool = Field(default=True)
    fastpay_min_amount: int = Field(default=500, description="Minimum amount in IQD")

    nasswallet_enabled: bool = Field(default=True)
    nasswallet_min_amount: int = Field(
        default=1000, description="Minimum amount in IQD"
    )

    def is_production(self) -> bool:
        """Check if running in production mode."""
        return not self.debug_mode and self.security_scan_level == "high"

    def get_cultural_config(self) -> dict:
        """Get cultural intelligence configuration."""
        return {
            "mode": self.cultural_mode,
            "islamic_compliance_required": self.islamic_compliance_required,
            "arabic_dialect_support": self.arabic_dialect_support,
            "rtl_processing_enabled": self.rtl_processing_enabled,
            "thresholds": {
                "cultural_appropriateness": self.cultural_appropriateness_threshold,
                "islamic_compliance": self.islamic_compliance_threshold,
                "dialect_recognition": self.dialect_recognition_threshold,
                "rtl_accuracy": self.rtl_accuracy_threshold,
            },
            "performance": {
                "validation_timeout_ms": self.validation_timeout_ms,
                "agent_timeout_ms": self.agent_timeout_ms,
                "workflow_timeout_ms": self.workflow_timeout_ms,
                "max_retries": self.max_retries,
            },
        }

    def get_security_config(self) -> dict:
        """Get security configuration."""
        return {
            "input_validation": self.input_validation_enabled,
            "output_sanitization": self.output_sanitization_enabled,
            "sensitive_data_filtering": self.sensitive_data_filtering,
            "scan_level": self.security_scan_level,
            "cultural_validation": True,  # Always enabled for Iraqi system
        }

    def get_payment_config(self) -> dict:
        """Get payment gateway configuration."""
        return {
            "zaincash": {
                "enabled": self.zaincash_enabled,
                "min_amount": self.zaincash_min_amount,
                "currency": "IQD",
            },
            "fastpay": {
                "enabled": self.fastpay_enabled,
                "min_amount": self.fastpay_min_amount,
                "currency": "IQD",
            },
            "nasswallet": {
                "enabled": self.nasswallet_enabled,
                "min_amount": self.nasswallet_min_amount,
                "currency": "IQD",
            },
        }


# Global settings instance
settings = IraqiAgentSettings()
