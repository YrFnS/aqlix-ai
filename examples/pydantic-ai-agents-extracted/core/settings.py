"""
Iraqi AI Chat System - PydanticAI Agent Settings
Foundation settings configuration with cultural intelligence integration
"""
from typing import List, Optional, Dict, Any
from pydantic import BaseSettings, Field, validator
import os
from enum import Enum


class IraqiCulturalMode(str, Enum):
    """Cultural validation modes for Iraqi AI system"""
    STRICT = "strict"          # 95%+ cultural appropriateness required
    MODERATE = "moderate"      # 85%+ cultural appropriateness required  
    ADAPTIVE = "adaptive"      # Context-aware cultural validation


class IslamicComplianceLevel(str, Enum):
    """Islamic compliance validation levels"""
    FULL = "full"             # 100% Islamic compliance validation
    STANDARD = "standard"     # 90%+ Islamic compliance validation
    BASIC = "basic"          # Essential Islamic principles only


class ArabicProcessingMode(str, Enum):
    """Arabic text processing configuration"""
    IRAQI_DIALECT = "iraqi_dialect"      # Iraqi Arabic dialect processing
    STANDARD_ARABIC = "standard_arabic"  # Modern Standard Arabic
    MIXED = "mixed"                      # Iraqi dialect + Standard Arabic


class IraqiAgentSettings(BaseSettings):
    """
    Comprehensive settings for Iraqi AI Agent system with cultural intelligence
    """
    
    # Core Agent Configuration
    agent_name: str = Field("iraqi-ai-agent", description="Agent identifier")
    agent_version: str = Field("1.0.0", description="Agent version")
    debug_mode: bool = Field(False, description="Enable debug logging")
    
    # Model Provider Configuration
    primary_model: str = Field("openai:gpt-4", description="Primary LLM model")
    fallback_model: str = Field("openai:gpt-3.5-turbo", description="Fallback LLM model") 
    local_model: Optional[str] = Field(None, description="Local Iraqi model if available")
    
    # API Keys and Authentication
    openai_api_key: Optional[str] = Field(None, env="OPENAI_API_KEY")
    anthropic_api_key: Optional[str] = Field(None, env="ANTHROPIC_API_KEY")
    groq_api_key: Optional[str] = Field(None, env="GROQ_API_KEY")
    
    # Iraqi Cultural Intelligence Configuration
    cultural_mode: IraqiCulturalMode = Field(
        IraqiCulturalMode.STRICT,
        description="Cultural validation strictness level"
    )
    islamic_compliance_level: IslamicComplianceLevel = Field(
        IslamicComplianceLevel.FULL,
        description="Islamic compliance validation level"
    )
    arabic_processing_mode: ArabicProcessingMode = Field(
        ArabicProcessingMode.MIXED,
        description="Arabic text processing configuration"
    )
    
    # Cultural Validation Thresholds
    min_cultural_appropriateness: float = Field(
        0.95, 
        ge=0.0, 
        le=1.0,
        description="Minimum cultural appropriateness score (0.0-1.0)"
    )
    min_islamic_compliance: float = Field(
        1.0,
        ge=0.0, 
        le=1.0,
        description="Minimum Islamic compliance score (0.0-1.0)"
    )
    min_arabic_accuracy: float = Field(
        0.99,
        ge=0.0,
        le=1.0, 
        description="Minimum Arabic RTL processing accuracy (0.0-1.0)"
    )
    
    # Performance Configuration
    max_response_time: int = Field(200, description="Max cultural validation time (ms)")
    arabic_processing_timeout: int = Field(300, description="Arabic processing timeout (ms)")
    max_retries: int = Field(3, description="Maximum retry attempts for validation")
    
    # Professional Domain Configuration
    enabled_domains: List[str] = Field(
        default_factory=lambda: [
            "legal", "medical", "educational", "organizational", 
            "business", "technical", "cultural"
        ],
        description="Enabled Iraqi professional domains"
    )
    
    # Payment Gateway Configuration (Iraqi-specific)
    payment_gateways: Dict[str, Dict[str, Any]] = Field(
        default_factory=lambda: {
            "zaincash": {
                "enabled": True,
                "min_amount": 1000,
                "currency": "IQD",
                "cultural_validation": True
            },
            "fastpay": {
                "enabled": True, 
                "min_amount": 500,
                "currency": "IQD",
                "cultural_validation": True
            },
            "nasswallet": {
                "enabled": True,
                "min_amount": 1000, 
                "currency": "IQD",
                "cultural_validation": True
            }
        },
        description="Iraqi payment gateway configurations"
    )
    
    # Security Configuration
    enable_input_validation: bool = Field(True, description="Enable comprehensive input validation")
    enable_output_filtering: bool = Field(True, description="Enable cultural output filtering")
    security_scan_level: str = Field("high", description="Security scanning level")
    
    # Monitoring and Logging
    enable_cultural_metrics: bool = Field(True, description="Enable cultural compliance metrics")
    enable_performance_monitoring: bool = Field(True, description="Enable performance monitoring")
    log_level: str = Field("INFO", description="Logging level")
    
    # Database Configuration (Supabase)
    supabase_url: Optional[str] = Field(None, env="SUPABASE_URL") 
    supabase_anon_key: Optional[str] = Field(None, env="SUPABASE_ANON_KEY")
    supabase_service_role_key: Optional[str] = Field(None, env="SUPABASE_SERVICE_ROLE_KEY")
    
    # Redis Configuration for Caching
    redis_url: Optional[str] = Field("redis://localhost:6379/0", env="REDIS_URL")
    cache_ttl: int = Field(3600, description="Cache TTL in seconds")
    
    class Config:
        """Pydantic configuration"""
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        validate_assignment = True
        extra = "forbid"  # Prevent additional fields
        
    @validator("min_cultural_appropriateness")
    def validate_cultural_threshold(cls, v, values):
        """Ensure cultural appropriateness meets minimum Iraqi standards"""
        cultural_mode = values.get("cultural_mode")
        if cultural_mode == IraqiCulturalMode.STRICT and v < 0.95:
            raise ValueError("Strict cultural mode requires ≥95% appropriateness")
        elif cultural_mode == IraqiCulturalMode.MODERATE and v < 0.85:
            raise ValueError("Moderate cultural mode requires ≥85% appropriateness")
        return v
    
    @validator("min_islamic_compliance")
    def validate_islamic_compliance(cls, v, values):
        """Ensure Islamic compliance meets required standards"""
        compliance_level = values.get("islamic_compliance_level")
        if compliance_level == IslamicComplianceLevel.FULL and v < 1.0:
            raise ValueError("Full Islamic compliance requires 100% validation")
        elif compliance_level == IslamicComplianceLevel.STANDARD and v < 0.9:
            raise ValueError("Standard Islamic compliance requires ≥90% validation")
        return v
    
    @validator("enabled_domains")
    def validate_domains(cls, v):
        """Validate enabled professional domains"""
        valid_domains = {
            "legal", "medical", "educational", "organizational",
            "business", "technical", "cultural", "governmental"
        }
        invalid_domains = set(v) - valid_domains
        if invalid_domains:
            raise ValueError(f"Invalid domains: {invalid_domains}")
        return v
    
    def get_cultural_config(self) -> Dict[str, Any]:
        """Get cultural intelligence configuration"""
        return {
            "mode": self.cultural_mode,
            "islamic_compliance": self.islamic_compliance_level,
            "arabic_processing": self.arabic_processing_mode,
            "thresholds": {
                "cultural_appropriateness": self.min_cultural_appropriateness,
                "islamic_compliance": self.min_islamic_compliance,
                "arabic_accuracy": self.min_arabic_accuracy
            },
            "performance": {
                "max_response_time": self.max_response_time,
                "arabic_timeout": self.arabic_processing_timeout,
                "max_retries": self.max_retries
            }
        }
    
    def get_security_config(self) -> Dict[str, Any]:
        """Get security configuration"""
        return {
            "input_validation": self.enable_input_validation,
            "output_filtering": self.enable_output_filtering,
            "scan_level": self.security_scan_level,
            "cultural_validation": True  # Always enabled for Iraqi system
        }
    
    def is_production(self) -> bool:
        """Check if running in production mode"""
        return not self.debug_mode and self.security_scan_level == "high"


# Global settings instance
settings = IraqiAgentSettings()