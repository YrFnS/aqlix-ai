"""
Iraqi AI Chat System - Core Agent Package
Foundation PydanticAI agent system with Iraqi cultural intelligence integration
"""

# Core exports
from .settings import (
    IraqiAgentSettings,
    IraqiCulturalMode,
    IslamicComplianceLevel,
    ArabicProcessingMode,
    settings,
)

from .providers import (
    IraqiModelProvider,
    ModelProvider,
    IraqiModelConfig,
    ModelPerformanceMetrics,
    get_model_provider,
    get_llm_model,
)

from .agent import (
    IraqiBaseAgent,
    IraqiCulturalContext,
    IraqiValidationResult,
    IraqiCulturalValidator,
    DefaultIraqiValidator,
    create_iraqi_agent,
)

from .tools import (
    IraqiToolCategory,
    IraqiToolContext,
    IraqiToolResult,
    IraqiToolValidator,
    IRAQI_TOOLS,
    get_tool_by_name,
    get_available_tools,
    get_tools_by_category,
)

from .dependencies import (
    IraqiAgentDependencies,
    IraqiCulturalService,
    ArabicProcessingService,
    PaymentGatewayService,
    ProfessionalDomainService,
    SecurityService,
    CacheService,
    DatabaseService,
    MonitoringService,
    create_iraqi_dependencies,
)

from .models import (
    # Enums
    PaymentGateway,
    ProfessionalDomain,
    ResponseStatus,
    # Core Models
    IraqiCulturalContext as ModelIraqiCulturalContext,
    CulturalValidationResult,
    IraqiAgentInput,
    IraqiAgentOutput,
    # Payment Models
    PaymentRequest,
    PaymentValidationResult,
    # Professional Models
    ProfessionalQuery,
    ProfessionalGuidanceResponse,
    # Performance Models
    AgentPerformanceMetrics,
    # Utilities
    MODEL_REGISTRY,
    get_model_by_name,
    get_available_models,
)

# Package metadata
__version__ = "1.0.0"
__description__ = "Iraqi AI Chat System - Core Agent Foundation"
__author__ = "Iraqi AI Development Team"

# Quick access constants
DEFAULT_CULTURAL_THRESHOLD = 0.95
DEFAULT_ISLAMIC_COMPLIANCE = 1.0
DEFAULT_ARABIC_ACCURACY = 0.99

# Supported payment gateways
IRAQI_PAYMENT_GATEWAYS = ["zaincash", "fastpay", "nasswallet"]

# Supported professional domains
IRAQI_PROFESSIONAL_DOMAINS = [
    "legal",
    "medical",
    "educational",
    "organizational",
    "business",
    "technical",
    "cultural",
]

# Package-level configuration
PACKAGE_CONFIG = {
    "version": __version__,
    "cultural_intelligence": True,
    "arabic_support": True,
    "islamic_compliance": True,
    "payment_gateways": IRAQI_PAYMENT_GATEWAYS,
    "professional_domains": IRAQI_PROFESSIONAL_DOMAINS,
    "default_thresholds": {
        "cultural_appropriateness": DEFAULT_CULTURAL_THRESHOLD,
        "islamic_compliance": DEFAULT_ISLAMIC_COMPLIANCE,
        "arabic_accuracy": DEFAULT_ARABIC_ACCURACY,
    },
}


# Convenience functions
def get_package_info():
    """Get package information"""
    return PACKAGE_CONFIG


def is_cultural_intelligence_enabled():
    """Check if cultural intelligence is enabled"""
    return PACKAGE_CONFIG["cultural_intelligence"]


def get_supported_domains():
    """Get supported professional domains"""
    return PACKAGE_CONFIG["professional_domains"].copy()


def get_supported_gateways():
    """Get supported payment gateways"""
    return PACKAGE_CONFIG["payment_gateways"].copy()


# Export lists for controlled imports
__all__ = [
    # Settings
    "IraqiAgentSettings",
    "IraqiCulturalMode",
    "IslamicComplianceLevel",
    "ArabicProcessingMode",
    "settings",
    # Providers
    "IraqiModelProvider",
    "ModelProvider",
    "IraqiModelConfig",
    "ModelPerformanceMetrics",
    "get_model_provider",
    "get_llm_model",
    # Core Agent
    "IraqiBaseAgent",
    "IraqiCulturalContext",
    "IraqiValidationResult",
    "IraqiCulturalValidator",
    "DefaultIraqiValidator",
    "create_iraqi_agent",
    # Tools
    "IraqiToolCategory",
    "IraqiToolContext",
    "IraqiToolResult",
    "IraqiToolValidator",
    "IRAQI_TOOLS",
    "get_tool_by_name",
    "get_available_tools",
    "get_tools_by_category",
    # Dependencies
    "IraqiAgentDependencies",
    "IraqiCulturalService",
    "ArabicProcessingService",
    "PaymentGatewayService",
    "ProfessionalDomainService",
    "SecurityService",
    "CacheService",
    "DatabaseService",
    "MonitoringService",
    "create_iraqi_dependencies",
    # Models
    "PaymentGateway",
    "ProfessionalDomain",
    "ResponseStatus",
    "ModelIraqiCulturalContext",
    "CulturalValidationResult",
    "IraqiAgentInput",
    "IraqiAgentOutput",
    "PaymentRequest",
    "PaymentValidationResult",
    "ProfessionalQuery",
    "ProfessionalGuidanceResponse",
    "AgentPerformanceMetrics",
    "MODEL_REGISTRY",
    "get_model_by_name",
    "get_available_models",
    # Constants
    "DEFAULT_CULTURAL_THRESHOLD",
    "DEFAULT_ISLAMIC_COMPLIANCE",
    "DEFAULT_ARABIC_ACCURACY",
    "IRAQI_PAYMENT_GATEWAYS",
    "IRAQI_PROFESSIONAL_DOMAINS",
    # Utilities
    "get_package_info",
    "is_cultural_intelligence_enabled",
    "get_supported_domains",
    "get_supported_gateways",
]
