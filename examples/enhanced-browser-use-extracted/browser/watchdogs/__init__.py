"""Enhanced Browser-Use Watchdogs - Iraqi AI Integrated Monitoring System.

Comprehensive watchdog system for monitoring browser automation with Iraqi cultural
validation, Arabic RTL processing, security compliance, and performance optimization.

This module provides 11 specialized watchdogs extracted and enhanced from browser-use:
- BaseWatchdog: Enhanced foundation with Iraqi AI integration
- IraqiSecurityWatchdog: Iraqi portal security and cultural threat detection
- IraqiCulturalWatchdog: Cultural appropriateness and Islamic compliance
- IraqiPerformanceWatchdog: Performance optimization for Iraqi networks
- ArabicContentWatchdog: Arabic text processing and RTL validation
- IraqiCrashWatchdog: System stability with Iraqi context awareness
- IraqiPortalWatchdog: Government/educational/banking portal monitoring
- IslamicComplianceWatchdog: Islamic content validation and prayer awareness
- IraqiPaymentWatchdog: Iraqi payment gateway monitoring and security
- IraqiAccessibilityWatchdog: WCAG compliance with Arabic accessibility
- IraqiNetworkWatchdog: Iraqi ISP and network condition monitoring
- IraqiDomWatchdog: DOM structure and Arabic rendering validation
"""

from ..watchdog_base import BaseWatchdog
from .security_watchdog import IraqiSecurityWatchdog
from .cultural_watchdog import IraqiCulturalWatchdog
from .performance_watchdog import IraqiPerformanceWatchdog
from .arabic_content_watchdog import ArabicContentWatchdog
from .crash_watchdog import IraqiCrashWatchdog
from .portal_watchdog import IraqiPortalWatchdog
from .islamic_compliance_watchdog import IslamicComplianceWatchdog, IslamicComplianceLevel
from .payment_watchdog import IraqiPaymentWatchdog, PaymentGateway, TransactionStatus
from .accessibility_watchdog import IraqiAccessibilityWatchdog, AccessibilityLevel
from .network_watchdog import IraqiNetworkWatchdog, NetworkQuality, IraqiISP
from .dom_watchdog import IraqiDomWatchdog, DomViolationType

# Watchdog Registry
WATCHDOG_REGISTRY = {
    'base': BaseWatchdog,
    'security': IraqiSecurityWatchdog,
    'cultural': IraqiCulturalWatchdog,
    'performance': IraqiPerformanceWatchdog,
    'arabic_content': ArabicContentWatchdog,
    'crash': IraqiCrashWatchdog,
    'portal': IraqiPortalWatchdog,
    'islamic_compliance': IslamicComplianceWatchdog,
    'payment': IraqiPaymentWatchdog,
    'accessibility': IraqiAccessibilityWatchdog,
    'network': IraqiNetworkWatchdog,
    'dom': IraqiDomWatchdog
}

# Watchdog Configurations
DEFAULT_WATCHDOG_CONFIG = {
    'cultural_validation_enabled': True,
    'arabic_rtl_support_enabled': True,
    'islamic_compliance_enabled': True,
    'iraqi_portal_monitoring_enabled': True,
    'performance_monitoring_enabled': True,
    'security_monitoring_enabled': True,
    'accessibility_monitoring_enabled': True,
    'network_monitoring_enabled': True,
    'dom_monitoring_enabled': True
}

PRODUCTION_WATCHDOG_CONFIG = {
    **DEFAULT_WATCHDOG_CONFIG,
    'enable_comprehensive_logging': True,
    'enable_performance_alerts': True,
    'enable_security_alerts': True,
    'alert_thresholds': {
        'cultural_violation_severity': 'medium',
        'security_violation_severity': 'high',
        'performance_degradation_threshold': 0.3,
        'accessibility_compliance_threshold': 0.8
    }
}

# Iraqi-Specific Watchdog Suites
IRAQI_GOVERNMENT_SUITE = [
    'security', 'cultural', 'portal', 'islamic_compliance',
    'accessibility', 'arabic_content', 'dom'
]

IRAQI_BANKING_SUITE = [
    'security', 'payment', 'islamic_compliance', 'network',
    'accessibility', 'performance', 'dom'
]

IRAQI_EDUCATIONAL_SUITE = [
    'cultural', 'accessibility', 'arabic_content', 'portal',
    'islamic_compliance', 'performance', 'dom'
]

IRAQI_COMPREHENSIVE_SUITE = list(WATCHDOG_REGISTRY.keys())

def create_watchdog(watchdog_type: str, config: dict = None):
    """Create a watchdog instance with Iraqi AI configuration.
    
    Args:
        watchdog_type: Type of watchdog to create (from WATCHDOG_REGISTRY)
        config: Optional configuration overrides
        
    Returns:
        Configured watchdog instance
        
    Raises:
        ValueError: If watchdog_type is not found in registry
    """
    if watchdog_type not in WATCHDOG_REGISTRY:
        raise ValueError(f"Unknown watchdog type: {watchdog_type}. Available types: {list(WATCHDOG_REGISTRY.keys())}")
    
    watchdog_class = WATCHDOG_REGISTRY[watchdog_type]
    watchdog_config = {**DEFAULT_WATCHDOG_CONFIG, **(config or {})}
    
    return watchdog_class(**watchdog_config)

def create_watchdog_suite(suite_name: str, config: dict = None):
    """Create a complete suite of watchdogs for specific Iraqi use cases.
    
    Args:
        suite_name: Name of the predefined suite
        config: Optional configuration overrides
        
    Returns:
        Dictionary of configured watchdog instances
        
    Raises:
        ValueError: If suite_name is not recognized
    """
    suite_mappings = {
        'government': IRAQI_GOVERNMENT_SUITE,
        'banking': IRAQI_BANKING_SUITE,
        'educational': IRAQI_EDUCATIONAL_SUITE,
        'comprehensive': IRAQI_COMPREHENSIVE_SUITE
    }
    
    if suite_name not in suite_mappings:
        raise ValueError(f"Unknown suite: {suite_name}. Available suites: {list(suite_mappings.keys())}")
    
    watchdog_types = suite_mappings[suite_name]
    suite_config = {**PRODUCTION_WATCHDOG_CONFIG, **(config or {})}
    
    watchdogs = {}
    for watchdog_type in watchdog_types:
        watchdogs[watchdog_type] = create_watchdog(watchdog_type, suite_config)
    
    return watchdogs

def get_watchdog_info():
    """Get information about available watchdogs and their capabilities."""
    return {
        'total_watchdogs': len(WATCHDOG_REGISTRY),
        'watchdog_types': list(WATCHDOG_REGISTRY.keys()),
        'predefined_suites': {
            'government': {
                'watchdogs': IRAQI_GOVERNMENT_SUITE,
                'description': 'Optimized for Iraqi government portals with cultural and security focus'
            },
            'banking': {
                'watchdogs': IRAQI_BANKING_SUITE,
                'description': 'Specialized for Iraqi banking and payment systems'
            },
            'educational': {
                'watchdogs': IRAQI_EDUCATIONAL_SUITE,
                'description': 'Tailored for Iraqi educational institutions'
            },
            'comprehensive': {
                'watchdogs': IRAQI_COMPREHENSIVE_SUITE,
                'description': 'Complete monitoring suite for all Iraqi applications'
            }
        },
        'key_features': [
            'Arabic RTL layout monitoring',
            'Islamic compliance validation',
            'Iraqi payment gateway support',
            'Cultural appropriateness checking',
            'Government portal optimization',
            'Network condition awareness',
            'Accessibility compliance (WCAG 2.1 AA)',
            'Security threat detection',
            'Performance optimization',
            'DOM structure validation',
            'Multi-agent coordination'
        ]
    }

# Export all watchdog classes and utilities
__all__ = [
    # Base and Core Watchdogs
    'BaseWatchdog',
    'IraqiSecurityWatchdog',
    'IraqiCulturalWatchdog',
    'IraqiPerformanceWatchdog',
    'ArabicContentWatchdog',
    'IraqiCrashWatchdog',
    
    # Specialized Domain Watchdogs
    'IraqiPortalWatchdog',
    'IslamicComplianceWatchdog',
    'IraqiPaymentWatchdog',
    'IraqiAccessibilityWatchdog',
    'IraqiNetworkWatchdog',
    'IraqiDomWatchdog',
    
    # Enums and Types
    'IslamicComplianceLevel',
    'PaymentGateway',
    'TransactionStatus',
    'AccessibilityLevel',
    'NetworkQuality',
    'IraqiISP',
    'DomViolationType',
    
    # Registry and Configuration
    'WATCHDOG_REGISTRY',
    'DEFAULT_WATCHDOG_CONFIG',
    'PRODUCTION_WATCHDOG_CONFIG',
    'IRAQI_GOVERNMENT_SUITE',
    'IRAQI_BANKING_SUITE',
    'IRAQI_EDUCATIONAL_SUITE',
    'IRAQI_COMPREHENSIVE_SUITE',
    
    # Utility Functions
    'create_watchdog',
    'create_watchdog_suite',
    'get_watchdog_info'
]

# Version and metadata
__version__ = "1.0.0"
__author__ = "Iraqi AI Development Team"
__description__ = "Enhanced browser-use watchdog system with Iraqi AI integration"
__license__ = "MIT"