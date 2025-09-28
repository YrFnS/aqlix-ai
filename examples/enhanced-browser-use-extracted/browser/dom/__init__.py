"""Enhanced Browser-Use DOM Processing - Iraqi AI Integrated DOM Services.

Comprehensive DOM processing system for browser automation with Iraqi cultural
validation, Arabic RTL processing, accessibility tree integration, and advanced
cross-origin iframe support.

This module provides enhanced DOM capabilities extracted from browser-use:
- DomService: Core DOM tree analysis with accessibility integration
- Enhanced DOM Serialization: Advanced viewport-aware DOM snapshots
- Cross-Origin Iframe Support: Complex multi-target DOM analysis
- Device Pixel Ratio Handling: Precise coordinate mapping for high-DPI displays
- Arabic RTL Integration: Right-to-left layout processing and validation
- Iraqi Cultural Compliance: Cultural appropriateness validation for DOM content
"""

from .service import DomService
from .serializer import DOMTreeSerializer, SerializedDOMState
from .views import (
    CurrentPageTargets,
    DOMRect,
    EnhancedAXNode,
    EnhancedAXProperty,
    EnhancedDOMTreeNode,
    NodeType,
    TargetAllTrees,
)
from .enhanced_snapshot import (
    REQUIRED_COMPUTED_STYLES,
    build_snapshot_lookup,
    SnapshotNodeData,
    SnapshotBounds,
)
from .iraqi_dom_processor import IraqiDOMProcessor, IraqiDOMValidation

# Enhanced DOM Registry
DOM_PROCESSOR_REGISTRY = {
    "base": DomService,
    "iraqi_enhanced": IraqiDOMProcessor,
}

# DOM Processing Configurations
DEFAULT_DOM_CONFIG = {
    "cross_origin_iframes": True,
    "accessibility_tree_enabled": True,
    "arabic_rtl_processing": True,
    "cultural_validation_enabled": True,
    "device_pixel_ratio_handling": True,
    "enhanced_visibility_detection": True,
    "performance_optimization_enabled": True,
}

PRODUCTION_DOM_CONFIG = {
    **DEFAULT_DOM_CONFIG,
    "enable_comprehensive_logging": True,
    "enable_performance_metrics": True,
    "visibility_validation_strict": True,
    "coordinate_precision_high": True,
    "timeout_thresholds": {
        "cdp_requests_timeout": 10.0,
        "retry_timeout": 2.0,
        "iframe_processing_timeout": 15.0,
    },
}

# Iraqi-Specific DOM Suites
IRAQI_GOVERNMENT_DOM_CONFIG = {
    **PRODUCTION_DOM_CONFIG,
    "arabic_rtl_processing": True,
    "cultural_validation_enabled": True,
    "islamic_compliance_validation": True,
    "government_portal_optimization": True,
}

IRAQI_BANKING_DOM_CONFIG = {
    **PRODUCTION_DOM_CONFIG,
    "security_validation_strict": True,
    "payment_form_processing": True,
    "arabic_number_processing": True,
    "financial_compliance_validation": True,
}

IRAQI_EDUCATIONAL_DOM_CONFIG = {
    **PRODUCTION_DOM_CONFIG,
    "accessibility_compliance_wcag": "AA",
    "arabic_content_optimization": True,
    "educational_portal_support": True,
    "multilingual_processing": True,
}


def create_dom_service(service_type: str = "base", config: dict = None):
    """Create a DOM service instance with Iraqi AI configuration.

    Args:
        service_type: Type of DOM service to create (from DOM_PROCESSOR_REGISTRY)
        config: Optional configuration overrides

    Returns:
        Configured DOM service instance

    Raises:
        ValueError: If service_type is not found in registry
    """
    if service_type not in DOM_PROCESSOR_REGISTRY:
        raise ValueError(
            f"Unknown DOM service type: {service_type}. Available types: {list(DOM_PROCESSOR_REGISTRY.keys())}"
        )

    service_class = DOM_PROCESSOR_REGISTRY[service_type]
    service_config = {**DEFAULT_DOM_CONFIG, **(config or {})}

    return service_class(**service_config)


def create_dom_suite(suite_name: str, config: dict = None):
    """Create a DOM service suite for specific Iraqi use cases.

    Args:
        suite_name: Name of the predefined suite
        config: Optional configuration overrides

    Returns:
        Dictionary of configured DOM service instances

    Raises:
        ValueError: If suite_name is not recognized
    """
    suite_mappings = {
        "government": IRAQI_GOVERNMENT_DOM_CONFIG,
        "banking": IRAQI_BANKING_DOM_CONFIG,
        "educational": IRAQI_EDUCATIONAL_DOM_CONFIG,
        "comprehensive": PRODUCTION_DOM_CONFIG,
    }

    if suite_name not in suite_mappings:
        raise ValueError(
            f"Unknown suite: {suite_name}. Available suites: {list(suite_mappings.keys())}"
        )

    suite_config = {**suite_mappings[suite_name], **(config or {})}

    return {
        "base": create_dom_service("base", suite_config),
        "iraqi_enhanced": create_dom_service("iraqi_enhanced", suite_config),
    }


def get_dom_capabilities():
    """Get information about available DOM processing capabilities."""
    return {
        "total_processors": len(DOM_PROCESSOR_REGISTRY),
        "processor_types": list(DOM_PROCESSOR_REGISTRY.keys()),
        "predefined_suites": {
            "government": {
                "config": IRAQI_GOVERNMENT_DOM_CONFIG,
                "description": "Optimized for Iraqi government portals with Arabic RTL and cultural validation",
            },
            "banking": {
                "config": IRAQI_BANKING_DOM_CONFIG,
                "description": "Specialized for Iraqi banking systems with security and payment validation",
            },
            "educational": {
                "config": IRAQI_EDUCATIONAL_DOM_CONFIG,
                "description": "Tailored for Iraqi educational institutions with accessibility compliance",
            },
            "comprehensive": {
                "config": PRODUCTION_DOM_CONFIG,
                "description": "Complete DOM processing suite for all Iraqi applications",
            },
        },
        "key_features": [
            "Accessibility tree integration with AXNode support",
            "Cross-origin iframe processing across security boundaries",
            "Device pixel ratio handling for high-DPI displays",
            "Advanced visibility detection with frame-aware calculations",
            "Arabic RTL layout processing and validation",
            "Iraqi cultural compliance checking",
            "Enhanced DOM serialization with computed styles",
            "Performance optimization with intelligent caching",
            "Government portal navigation support",
            "Multi-target coordination and session management",
        ],
    }


# Export all DOM classes and utilities
__all__ = [
    # Core Services
    "DomService",
    "DOMTreeSerializer",
    "IraqiDOMProcessor",
    # Data Models
    "SerializedDOMState",
    "CurrentPageTargets",
    "DOMRect",
    "EnhancedAXNode",
    "EnhancedAXProperty",
    "EnhancedDOMTreeNode",
    "NodeType",
    "TargetAllTrees",
    "SnapshotNodeData",
    "SnapshotBounds",
    "IraqiDOMValidation",
    # Enhanced Snapshot
    "REQUIRED_COMPUTED_STYLES",
    "build_snapshot_lookup",
    # Registry and Configuration
    "DOM_PROCESSOR_REGISTRY",
    "DEFAULT_DOM_CONFIG",
    "PRODUCTION_DOM_CONFIG",
    "IRAQI_GOVERNMENT_DOM_CONFIG",
    "IRAQI_BANKING_DOM_CONFIG",
    "IRAQI_EDUCATIONAL_DOM_CONFIG",
    # Utility Functions
    "create_dom_service",
    "create_dom_suite",
    "get_dom_capabilities",
]

# Version and metadata
__version__ = "1.0.0"
__author__ = "Iraqi AI Development Team"
__description__ = "Enhanced browser-use DOM processing system with Iraqi AI integration"
__license__ = "MIT"
