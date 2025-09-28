"""Enhanced Browser-Use Components with Iraqi AI Integration.

Comprehensive browser automation system combining browser-use infrastructure
with Iraqi cultural validation, Arabic RTL processing, and enterprise-grade
monitoring capabilities.

This module provides enhanced browser automation capabilities:
- Multi-LLM Provider System: 10+ LLM providers with unified interface
- Advanced Watchdog System: 11 specialized monitoring services
- Enhanced DOM Processing: Accessibility tree integration with Iraqi AI
- Browser Session Management: Production-ready with Iraqi enhancements
- MCP Server Integration: Claude Desktop compatibility
"""

# Browser Components
try:
    from .session import BrowserSession
except ImportError:
    BrowserSession = None

from .iraqi_session import (
    IraqiEnhancedBrowserSession,
    IraqiPortalType,
    IraqiDomainValidator,
    IraqiPortalConfig,
    create_iraqi_browser_session,
)

# DOM Processing System
from .dom import (
    DomService,
    IraqiDOMProcessor,
    DOMTreeSerializer,
    EnhancedDOMTreeNode,
    SerializedDOMState,
    create_dom_service,
    create_dom_suite,
    get_dom_capabilities,
)

# Watchdog Monitoring System
from .watchdogs import (
    BaseWatchdog,
    IraqiSecurityWatchdog,
    IraqiCulturalWatchdog,
    IraqiPerformanceWatchdog,
    ArabicContentWatchdog,
    IraqiCrashWatchdog,
    IraqiPortalWatchdog,
    IslamicComplianceWatchdog,
    IraqiPaymentWatchdog,
    IraqiAccessibilityWatchdog,
    IraqiNetworkWatchdog,
    IraqiDomWatchdog,
    create_watchdog,
    create_watchdog_suite,
    get_watchdog_info,
)

# Enhanced Browser Registry
BROWSER_COMPONENT_REGISTRY = {
    # Core Components
    "session": BrowserSession,
    "iraqi_session": IraqiEnhancedBrowserSession,
    # DOM Processing
    "dom_service": DomService,
    "iraqi_dom_processor": IraqiDOMProcessor,
    "dom_serializer": DOMTreeSerializer,
    # Monitoring
    "base_watchdog": BaseWatchdog,
    "security_watchdog": IraqiSecurityWatchdog,
    "cultural_watchdog": IraqiCulturalWatchdog,
    "performance_watchdog": IraqiPerformanceWatchdog,
}

# Browser Configuration Presets
DEFAULT_BROWSER_CONFIG = {
    "dom_processing_enabled": True,
    "watchdog_monitoring_enabled": True,
    "arabic_rtl_support_enabled": True,
    "cultural_validation_enabled": True,
    "accessibility_tree_enabled": True,
    "cross_origin_iframes_enabled": True,
    "performance_optimization_enabled": True,
}

PRODUCTION_BROWSER_CONFIG = {
    **DEFAULT_BROWSER_CONFIG,
    "enable_comprehensive_logging": True,
    "enable_performance_metrics": True,
    "enable_error_recovery": True,
    "watchdog_suite": "comprehensive",
    "dom_processing_suite": "comprehensive",
    "timeout_configuration": {
        "page_load_timeout": 30.0,
        "element_interaction_timeout": 10.0,
        "dom_processing_timeout": 15.0,
        "watchdog_check_interval": 5.0,
    },
}

# Iraqi-Specific Browser Configurations
IRAQI_GOVERNMENT_BROWSER_CONFIG = {
    **PRODUCTION_BROWSER_CONFIG,
    "cultural_validation_level": "government",
    "islamic_compliance_strict": True,
    "arabic_rtl_optimization": True,
    "government_portal_features": True,
    "watchdog_suite": "government",
    "dom_processing_suite": "government",
}

IRAQI_BANKING_BROWSER_CONFIG = {
    **PRODUCTION_BROWSER_CONFIG,
    "security_validation_strict": True,
    "payment_gateway_support": True,
    "financial_compliance_enabled": True,
    "islamic_banking_compliance": True,
    "watchdog_suite": "banking",
    "dom_processing_suite": "banking",
}

IRAQI_EDUCATIONAL_BROWSER_CONFIG = {
    **PRODUCTION_BROWSER_CONFIG,
    "accessibility_compliance_level": "WCAG_AA",
    "arabic_content_optimization": True,
    "multilingual_support_enabled": True,
    "educational_portal_features": True,
    "watchdog_suite": "educational",
    "dom_processing_suite": "educational",
}


def create_enhanced_browser_session(session_type: str = "base", config: dict = None):
    """Create an enhanced browser session with Iraqi AI configuration.

    Args:
        session_type: Type of browser session ('base', 'iraqi_enhanced')
        config: Optional configuration overrides

    Returns:
        Configured browser session instance

    Raises:
        ValueError: If session_type is not found in registry
    """
    session_mappings = {
        "base": BrowserSession,
        "iraqi_enhanced": IraqiEnhancedBrowserSession,
    }

    if session_type not in session_mappings:
        raise ValueError(
            f"Unknown session type: {session_type}. Available types: {list(session_mappings.keys())}"
        )

    session_class = session_mappings[session_type]
    if session_class is None:
        raise ImportError(f"Session class {session_type} is not available")

    session_config = {**DEFAULT_BROWSER_CONFIG, **(config or {})}

    return session_class(**session_config)


def create_browser_suite(suite_name: str, config: dict = None):
    """Create a complete browser automation suite for Iraqi use cases.

    Args:
        suite_name: Name of the predefined suite
        config: Optional configuration overrides

    Returns:
        Dictionary of configured browser components

    Raises:
        ValueError: If suite_name is not recognized
    """
    suite_mappings = {
        "government": IRAQI_GOVERNMENT_BROWSER_CONFIG,
        "banking": IRAQI_BANKING_BROWSER_CONFIG,
        "educational": IRAQI_EDUCATIONAL_BROWSER_CONFIG,
        "comprehensive": PRODUCTION_BROWSER_CONFIG,
    }

    if suite_name not in suite_mappings:
        raise ValueError(
            f"Unknown suite: {suite_name}. Available suites: {list(suite_mappings.keys())}"
        )

    suite_config = {**suite_mappings[suite_name], **(config or {})}

    # Create browser session
    browser_session = create_enhanced_browser_session("iraqi_enhanced", suite_config)

    # Create DOM processing suite
    dom_suite = create_dom_suite(suite_name, suite_config)

    # Create watchdog suite
    watchdog_suite = create_watchdog_suite(suite_name, suite_config)

    return {
        "browser_session": browser_session,
        "dom_processing": dom_suite,
        "watchdog_monitoring": watchdog_suite,
        "configuration": suite_config,
    }


def get_enhanced_browser_capabilities() -> dict:
    """Get comprehensive information about enhanced browser capabilities."""
    return {
        "total_components": len(BROWSER_COMPONENT_REGISTRY),
        "component_types": list(BROWSER_COMPONENT_REGISTRY.keys()),
        "predefined_suites": {
            "government": {
                "description": "Optimized for Iraqi government portals with cultural and security focus",
                "features": [
                    "Government portal optimization",
                    "Strict cultural validation",
                    "Arabic RTL processing",
                    "Islamic compliance checking",
                    "Enhanced security monitoring",
                ],
            },
            "banking": {
                "description": "Specialized for Iraqi banking and payment systems",
                "features": [
                    "Payment gateway integration",
                    "Financial compliance validation",
                    "Islamic banking compliance",
                    "Enhanced security protocols",
                    "Transaction monitoring",
                ],
            },
            "educational": {
                "description": "Tailored for Iraqi educational institutions",
                "features": [
                    "WCAG AA accessibility compliance",
                    "Arabic content optimization",
                    "Multilingual support",
                    "Educational portal features",
                    "Student-friendly interfaces",
                ],
            },
            "comprehensive": {
                "description": "Complete automation suite for all Iraqi applications",
                "features": [
                    "Full feature set enabled",
                    "Maximum compatibility",
                    "Enterprise-grade monitoring",
                    "Advanced performance optimization",
                    "Comprehensive cultural validation",
                ],
            },
        },
        "core_capabilities": [
            "Multi-LLM Provider System (10+ providers)",
            "Advanced Watchdog System (11 specialized monitors)",
            "Enhanced DOM Processing with accessibility tree",
            "Arabic RTL layout processing and optimization",
            "Islamic compliance validation",
            "Iraqi cultural appropriateness checking",
            "Government portal automation",
            "Payment gateway integration",
            "Cross-origin iframe processing",
            "Device pixel ratio handling",
            "Performance optimization for Iraqi networks",
            "Accessibility compliance (WCAG 2.1 AA)",
            "MCP server integration for Claude Desktop",
        ],
        "extracted_components": {
            "multi_llm_system": {
                "providers": 10,
                "lazy_loading": True,
                "fallback_strategies": True,
                "iraqi_ai_integration": True,
            },
            "watchdog_system": {
                "total_watchdogs": 11,
                "specialized_monitoring": True,
                "enterprise_reliability": True,
                "cultural_monitoring": True,
            },
            "dom_processing": {
                "accessibility_tree_integration": True,
                "cross_origin_iframe_support": True,
                "device_pixel_ratio_handling": True,
                "arabic_rtl_processing": True,
                "cultural_validation": True,
            },
        },
    }


__all__ = [
    # Core Sessions
    "IraqiEnhancedBrowserSession",
    "IraqiPortalType",
    "IraqiDomainValidator",
    "IraqiPortalConfig",
    "create_iraqi_browser_session",
    # DOM Processing
    "DomService",
    "IraqiDOMProcessor",
    "DOMTreeSerializer",
    "EnhancedDOMTreeNode",
    "SerializedDOMState",
    # Watchdog System
    "BaseWatchdog",
    "IraqiSecurityWatchdog",
    "IraqiCulturalWatchdog",
    "IraqiPerformanceWatchdog",
    "ArabicContentWatchdog",
    "IraqiCrashWatchdog",
    "IraqiPortalWatchdog",
    "IslamicComplianceWatchdog",
    "IraqiPaymentWatchdog",
    "IraqiAccessibilityWatchdog",
    "IraqiNetworkWatchdog",
    "IraqiDomWatchdog",
    # Registry and Configuration
    "BROWSER_COMPONENT_REGISTRY",
    "DEFAULT_BROWSER_CONFIG",
    "PRODUCTION_BROWSER_CONFIG",
    "IRAQI_GOVERNMENT_BROWSER_CONFIG",
    "IRAQI_BANKING_BROWSER_CONFIG",
    "IRAQI_EDUCATIONAL_BROWSER_CONFIG",
    # Utility Functions
    "create_enhanced_browser_session",
    "create_browser_suite",
    "get_enhanced_browser_capabilities",
    "create_dom_service",
    "create_dom_suite",
    "get_dom_capabilities",
    "create_watchdog",
    "create_watchdog_suite",
    "get_watchdog_info",
]

# Version and metadata
__version__ = "1.0.0"
__author__ = "Iraqi AI Development Team"
__description__ = "Enhanced browser-use automation system with Iraqi AI integration"
__license__ = "MIT"
