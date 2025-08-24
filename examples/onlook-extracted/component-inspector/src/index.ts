/**
 * Component Inspector & Analyzer - Iraqi Enhanced
 * 
 * Advanced component analysis system with comprehensive Iraqi government integration.
 * Extracted and enhanced from Onlook's proven component parsing and analysis architecture.
 * 
 * @author Aqlix AI - Iraqi Integration Team
 * @version 1.0.0
 * @license MIT
 */

// Core Components
export { ComponentInspector } from './core/inspector';
export { ComponentParser } from './core/parser/parser';
export { ASTAnalyzer } from './core/analyzer/ast-analyzer';
export { DOMAnalyzer } from './core/analyzer/dom-analyzer';

// Cultural Integration
export { CulturalValidator } from './cultural/validator/cultural-validator';
export { PatternDetector } from './cultural/patterns/pattern-detector';

// Performance Analysis
export { PerformanceProfiler } from './performance/profiler';

// Accessibility Testing
export { AccessibilityTester } from './accessibility/wcag-validator/wcag-validator';

// Utility Classes
export { ConfigManager } from './utils/config-manager';
export { CacheManager } from './utils/cache-manager';
export { Logger } from './utils/logger';

// Type Definitions
export type {
  // Core Configuration Types
  ComponentInspectorConfig,
  CulturalConfig,
  PerformanceConfig,
  AccessibilityConfig,
  SecurityConfig,
  CachingConfig,
  
  // Analysis Result Types
  ComponentAnalysis,
  ComponentInfo,
  CulturalCompliance,
  PerformanceMetrics,
  AccessibilityReport,
  SecurityReport,
  PatternMatch,
  Recommendation,
  
  // Cultural Types
  IslamicComplianceReport,
  GovernmentStandardsReport,
  LanguageSupportReport,
  ContentValidationReport,
  MinistryCompliance,
  IslamicViolation,
  MinistryType,
  
  // Performance Types
  RTLMetrics,
  ArabicFontMetrics,
  WebVitals,
  
  // Accessibility Types
  WCAGCompliance,
  RTLAccessibilityReport,
  GovernmentAccessibilityReport,
  AccessibilityViolation,
  WCAGViolation,
  AccessibilityRecommendation,
  
  // Pattern Types
  PatternType,
  
  // Security Types
  SecurityVulnerability,
  DataProtectionReport,
  PrivacyComplianceReport,
  GovernmentSecurityReport,
  
  // AST and DOM Types
  ASTNode,
  DOMElementInfo,
  CulturalContext,
  ComputedStyles,
  CulturalMetadata,
  AccessibilityInfo,
  
  // Utility Types
  ComponentType,
  MetricType,
  RecommendationType,
  Dependency,
  ComponentExport,
  SourceLocation,
  ImpactAssessment,
  
  // Cache Types
  CacheEntry,
  CacheStats,
  
  // Event Types
  InspectorEvent,
  EventPayload
} from './types';

/**
 * Default configuration for Iraqi government systems
 */
export const IRAQI_GOVERNMENT_CONFIG: Partial<ComponentInspectorConfig> = {
  cultural: {
    validation: {
      islamicCompliance: true,
      governmentStandards: true
    },
    language: {
      primary: 'ar-IQ',
      fallback: 'en-US',
      rtlOptimization: true
    },
    patterns: {
      detectGovernmentPatterns: true,
      enforceIslamicDesign: true,
      validateCulturalContent: true
    }
  },
  performance: {
    targets: {
      renderTime: 16,
      bundleSize: '100kb',
      accessibility: 95
    },
    arabic: {
      fontOptimization: true,
      rtlProfiling: true,
      mixedContentAnalysis: true
    }
  },
  accessibility: {
    standards: {
      wcag: 'AA',
      iraqiGovernment: true,
      rtlCompliance: true
    },
    testing: {
      automated: true,
      screenReaderTesting: true,
      keyboardNavigation: true
    }
  },
  security: {
    dataProtection: true,
    governmentCompliance: true,
    privacyValidation: true
  },
  caching: {
    enabled: true,
    ttl: 3600,
    strategies: ['memory', 'disk']
  }
};

/**
 * Ministry-specific configuration presets
 */
export const MINISTRY_CONFIGS = {
  interior: {
    ...IRAQI_GOVERNMENT_CONFIG,
    cultural: {
      ...IRAQI_GOVERNMENT_CONFIG.cultural,
      validation: {
        ...IRAQI_GOVERNMENT_CONFIG.cultural!.validation,
        ministrySpecific: 'interior' as const
      }
    },
    security: {
      dataProtection: true,
      governmentCompliance: true,
      privacyValidation: true
    },
    accessibility: {
      ...IRAQI_GOVERNMENT_CONFIG.accessibility,
      standards: {
        ...IRAQI_GOVERNMENT_CONFIG.accessibility!.standards,
        wcag: 'AAA' as const // Higher standard for Interior Ministry
      }
    }
  },
  health: {
    ...IRAQI_GOVERNMENT_CONFIG,
    cultural: {
      ...IRAQI_GOVERNMENT_CONFIG.cultural,
      validation: {
        ...IRAQI_GOVERNMENT_CONFIG.cultural!.validation,
        ministrySpecific: 'health' as const
      }
    },
    performance: {
      ...IRAQI_GOVERNMENT_CONFIG.performance,
      targets: {
        ...IRAQI_GOVERNMENT_CONFIG.performance!.targets,
        renderTime: 12, // Faster for medical emergencies
        accessibility: 98 // Medical-grade accessibility
      }
    },
    accessibility: {
      ...IRAQI_GOVERNMENT_CONFIG.accessibility,
      standards: {
        ...IRAQI_GOVERNMENT_CONFIG.accessibility!.standards,
        wcag: 'AAA' as const // Medical-grade accessibility
      }
    }
  },
  education: {
    ...IRAQI_GOVERNMENT_CONFIG,
    cultural: {
      ...IRAQI_GOVERNMENT_CONFIG.cultural,
      validation: {
        ...IRAQI_GOVERNMENT_CONFIG.cultural!.validation,
        ministrySpecific: 'education' as const
      }
    }
  },
  justice: {
    ...IRAQI_GOVERNMENT_CONFIG,
    cultural: {
      ...IRAQI_GOVERNMENT_CONFIG.cultural,
      validation: {
        ...IRAQI_GOVERNMENT_CONFIG.cultural!.validation,
        ministrySpecific: 'justice' as const
      }
    },
    security: {
      dataProtection: true,
      governmentCompliance: true,
      privacyValidation: true
    },
    accessibility: {
      ...IRAQI_GOVERNMENT_CONFIG.accessibility,
      standards: {
        ...IRAQI_GOVERNMENT_CONFIG.accessibility!.standards,
        wcag: 'AAA' as const // Legal documents require highest accessibility
      }
    }
  }
};

/**
 * Quick setup function for Iraqi government components
 */
export function createIraqiComponentInspector(options: {
  ministry?: MinistryType;
  customConfig?: Partial<ComponentInspectorConfig>;
} = {}): ComponentInspector {
  const { ministry, customConfig } = options;
  
  let config = IRAQI_GOVERNMENT_CONFIG;
  
  // Apply ministry-specific config if specified
  if (ministry && MINISTRY_CONFIGS[ministry]) {
    config = MINISTRY_CONFIGS[ministry];
  }
  
  // Apply custom configuration overrides
  if (customConfig) {
    config = {
      ...config,
      ...customConfig,
      cultural: {
        ...config.cultural,
        ...customConfig.cultural
      },
      performance: {
        ...config.performance,
        ...customConfig.performance
      },
      accessibility: {
        ...config.accessibility,
        ...customConfig.accessibility
      },
      security: {
        ...config.security,
        ...customConfig.security
      },
      caching: {
        ...config.caching,
        ...customConfig.caching
      }
    };
  }
  
  return new ComponentInspector(config);
}

/**
 * Version information
 */
export const VERSION = '1.0.0';
export const BUILD_DATE = new Date().toISOString();
export const AUTHOR = 'Aqlix AI - Iraqi Integration Team';

/**
 * Package description
 */
export const DESCRIPTION = 'Advanced component analysis engine with Iraqi cultural integration and government-grade capabilities. Built upon Onlook\'s proven architecture with comprehensive Arabic RTL support, Islamic compliance validation, and ministry-specific requirements.';