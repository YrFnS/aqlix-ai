/**
 * Iraqi Professional Domain Validation System
 * Entry point for the comprehensive Iraqi professional domain validation package
 * 
 * This system provides specialized validation for Iraqi professional contexts including:
 * - Legal: Iraqi legal system, jurisprudence, and legal practice with Islamic compliance
 * - Medical: Iraqi healthcare system, medical practice with Islamic medical ethics
 * - Educational: Iraqi education system, academic standards with Islamic educational values
 * - Engineering: Iraqi engineering standards and technical professions
 * - Business: Iraqi commercial practices with Islamic business ethics
 * - Religious: Islamic scholarship and religious affairs
 * - Governmental: Iraqi public administration and governmental processes
 * - Media: Iraqi media standards and journalism ethics
 * - Arts: Iraqi cultural arts with Islamic artistic principles
 * - Agriculture: Iraqi agricultural practices and rural development
 * 
 * Performance Targets:
 * - Validation Time: <500ms for standard requests, <2000ms for critical validation
 * - Accuracy: 95%+ for regulatory content, 90%+ for professional content
 * - Islamic Compliance: 95%+ for all validated content
 * - Cultural Appropriateness: 90%+ for Iraqi context
 * - Professional Standards: Domain-specific thresholds (85-98%)
 * 
 * @author Iraqi AI Development Team
 * @version 1.0.0
 * @license MIT
 */

// ========================================================================================
// CORE EXPORTS
// ========================================================================================

// Types and Interfaces
export type {
  IraqiProfessionalDomain,
  ProfessionalValidationLevel,
  IraqiProfessionalEthics,
  ProfessionalDomainValidationRequest,
  ProfessionalDomainValidationResult,
  ProfessionalDomainRegistry,
  ProfessionalDomainValidationError,
  ProfessionalDomainValidatorConfig,
  ProfessionalDomainValidationRequestType
} from './types/professional-domain-types.js';

// Validation Schemas
export {
  ProfessionalDomainValidationRequestSchema,
  ProfessionalDomainValidationException
} from './types/professional-domain-types.js';

// Core Validator
export {
  IraqiProfessionalDomainValidator
} from './validators/iraqi-professional-domain-validator.js';

// ========================================================================================
// CONVENIENCE EXPORTS
// ========================================================================================

/**
 * Default Iraqi Professional Domain Validator Configuration
 * Optimized for Iraqi professional standards and Islamic compliance
 */
export const DEFAULT_VALIDATOR_CONFIG: import('./types/professional-domain-types.js').ProfessionalDomainValidatorConfig = {
  // Validation Thresholds
  default_thresholds: {
    accuracy: 90,           // 90% accuracy for professional content
    ethics: 95,            // 95% Islamic ethics compliance required
    cultural: 90,          // 90% Iraqi cultural appropriateness required
    professional: 85       // 85% professional standard compliance required
  },
  
  // Performance Settings
  performance: {
    timeout_ms: 30000,                    // 30-second timeout for complex validations
    cache_results: true,                  // Cache validation results for performance
    parallel_validation: true,            // Enable parallel validation of aspects
    max_concurrent_validations: 5        // Maximum 5 concurrent validation requests
  },
  
  // Integration Settings
  integrations: {
    cultural_engine_endpoint: undefined,  // Will use injected cultural engine
    arabic_nlp_endpoint: undefined,       // Will use injected Arabic NLP pipeline
    regulatory_database_endpoint: undefined, // Future: Iraqi regulatory database integration
    expert_consultation_enabled: false   // Expert consultation for critical validations (future)
  },
  
  // Logging and Monitoring
  monitoring: {
    log_level: 'info',                   // Standard logging level
    metrics_collection: true,            // Collect performance metrics
    audit_trail: true,                   // Maintain validation audit trail
    anonymize_content: true              // Anonymize content in logs for privacy
  }
};

/**
 * Iraqi Professional Domain Constants
 * Standard values used throughout the validation system
 */
export const IRAQI_PROFESSIONAL_DOMAINS = {
  LEGAL: 'legal' as const,
  MEDICAL: 'medical' as const,
  EDUCATIONAL: 'educational' as const,
  ENGINEERING: 'engineering' as const,
  BUSINESS: 'business' as const,
  RELIGIOUS: 'religious' as const,
  GOVERNMENTAL: 'governmental' as const,
  MEDIA: 'media' as const,
  ARTS: 'arts' as const,
  AGRICULTURE: 'agriculture' as const
} as const;

/**
 * Professional Validation Levels
 * Standard validation levels for different content types
 */
export const VALIDATION_LEVELS = {
  INFORMATIONAL: 'informational' as const,  // General information, no professional implications
  ADVISORY: 'advisory' as const,            // Advisory content requiring accuracy
  PROFESSIONAL: 'professional' as const,    // Professional content requiring expertise validation
  REGULATORY: 'regulatory' as const,        // Content with regulatory implications
  CRITICAL: 'critical' as const            // Critical content affecting public welfare
} as const;

/**
 * Islamic Compliance Categories
 * Categories for Islamic professional ethics assessment
 */
export const ISLAMIC_COMPLIANCE = {
  HALAL: 'halal' as const,                 // حلال - Permissible under Islamic law
  HARAM: 'haram' as const,                 // حرام - Forbidden under Islamic law
  MAKRUH: 'makruh' as const,               // مكروه - Discouraged but not forbidden
  MUSTAHABB: 'mustahabb' as const,         // مستحب - Recommended but not obligatory
  MUBAH: 'mubah' as const                  // مباح - Neutral/permissible
} as const;

// ========================================================================================
// UTILITY FUNCTIONS
// ========================================================================================

/**
 * Create Iraqi Professional Domain Validator instance with default configuration
 * @param culturalEngine Iraqi Cultural Decision Engine instance
 * @param arabicNLP Iraqi Arabic NLP Pipeline instance
 * @param customConfig Optional custom configuration (merged with defaults)
 * @returns Configured IraqiProfessionalDomainValidator instance
 */
export function createIraqiProfessionalValidator(
  culturalEngine: import('@iraqi-ai/cultural-engine').IraqiCulturalDecisionEngine,
  arabicNLP: import('@iraqi-ai/arabic-nlp').IraqiArabicNLPPipeline,
  customConfig?: Partial<import('./types/professional-domain-types.js').ProfessionalDomainValidatorConfig>
): import('./validators/iraqi-professional-domain-validator.js').IraqiProfessionalDomainValidator {
  const config = {
    ...DEFAULT_VALIDATOR_CONFIG,
    ...customConfig,
    // Merge nested objects properly
    default_thresholds: {
      ...DEFAULT_VALIDATOR_CONFIG.default_thresholds,
      ...customConfig?.default_thresholds
    },
    performance: {
      ...DEFAULT_VALIDATOR_CONFIG.performance,
      ...customConfig?.performance
    },
    integrations: {
      ...DEFAULT_VALIDATOR_CONFIG.integrations,
      ...customConfig?.integrations
    },
    monitoring: {
      ...DEFAULT_VALIDATOR_CONFIG.monitoring,
      ...customConfig?.monitoring
    }
  };

  return new import('./validators/iraqi-professional-domain-validator.js').IraqiProfessionalDomainValidator(
    culturalEngine,
    arabicNLP,
    config
  );
}

/**
 * Validate if a domain is supported by the Iraqi Professional Domain system
 * @param domain Domain to validate
 * @returns True if domain is supported, false otherwise
 */
export function isValidIraqiProfessionalDomain(
  domain: string
): domain is import('./types/professional-domain-types.js').IraqiProfessionalDomain {
  return Object.values(IRAQI_PROFESSIONAL_DOMAINS).includes(domain as any);
}

/**
 * Get Arabic name for Iraqi professional domain
 * @param domain Iraqi professional domain
 * @returns Arabic name of the domain
 */
export function getArabicDomainName(domain: import('./types/professional-domain-types.js').IraqiProfessionalDomain): string {
  const arabicNames: Record<import('./types/professional-domain-types.js').IraqiProfessionalDomain, string> = {
    legal: 'القانون',
    medical: 'الطب',
    educational: 'التعليم',
    engineering: 'الهندسة',
    business: 'الأعمال',
    religious: 'الشؤون الدينية',
    governmental: 'الحكومة',
    media: 'الإعلام',
    arts: 'الفنون',
    agriculture: 'الزراعة'
  };
  
  return arabicNames[domain];
}

/**
 * Get recommended validation level for content type and professional domain
 * @param contentType Type of content being validated
 * @param domain Professional domain
 * @param isPublicFacing Whether content is public-facing
 * @returns Recommended validation level
 */
export function getRecommendedValidationLevel(
  contentType: 'general' | 'advisory' | 'instructional' | 'regulatory' | 'emergency',
  domain: import('./types/professional-domain-types.js').IraqiProfessionalDomain,
  isPublicFacing: boolean = false
): import('./types/professional-domain-types.js').ProfessionalValidationLevel {
  // High-risk domains always require stricter validation
  const highRiskDomains: import('./types/professional-domain-types.js').IraqiProfessionalDomain[] = ['medical', 'legal'];
  
  // Emergency content always requires critical validation
  if (contentType === 'emergency') {
    return VALIDATION_LEVELS.CRITICAL;
  }
  
  // Regulatory content requires regulatory validation
  if (contentType === 'regulatory') {
    return VALIDATION_LEVELS.REGULATORY;
  }
  
  // High-risk domains with instructional content
  if (highRiskDomains.includes(domain) && contentType === 'instructional') {
    return VALIDATION_LEVELS.PROFESSIONAL;
  }
  
  // Public-facing content in high-risk domains
  if (highRiskDomains.includes(domain) && isPublicFacing) {
    return VALIDATION_LEVELS.PROFESSIONAL;
  }
  
  // Advisory content
  if (contentType === 'advisory') {
    return VALIDATION_LEVELS.ADVISORY;
  }
  
  // Default to informational for general content
  return VALIDATION_LEVELS.INFORMATIONAL;
}

/**
 * Create standard validation thresholds based on domain and validation level
 * @param domain Professional domain
 * @param level Validation level
 * @returns Recommended validation thresholds
 */
export function createStandardThresholds(
  domain: import('./types/professional-domain-types.js').IraqiProfessionalDomain,
  level: import('./types/professional-domain-types.js').ProfessionalValidationLevel
): import('./types/professional-domain-types.js').ProfessionalDomainValidationRequest['thresholds'] {
  // Base thresholds by validation level
  const baseThresholds = {
    informational: { accuracy: 70, ethics: 85, cultural: 80, professional: 70 },
    advisory: { accuracy: 80, ethics: 90, cultural: 85, professional: 80 },
    professional: { accuracy: 90, ethics: 95, cultural: 90, professional: 85 },
    regulatory: { accuracy: 95, ethics: 98, cultural: 95, professional: 90 },
    critical: { accuracy: 98, ethics: 100, cultural: 98, professional: 95 }
  };
  
  // Domain-specific adjustments
  const domainAdjustments: Partial<Record<import('./types/professional-domain-types.js').IraqiProfessionalDomain, Partial<typeof baseThresholds.informational>>> = {
    medical: { accuracy: 5, professional: 5 },      // Higher accuracy and professional standards for medical
    legal: { ethics: 3, professional: 5 },          // Higher ethics and professional standards for legal
    religious: { ethics: 5, cultural: 5 },          // Higher ethics and cultural standards for religious
    educational: { cultural: 3 }                    // Higher cultural standards for educational
  };
  
  const base = baseThresholds[level];
  const adjustments = domainAdjustments[domain] || {};
  
  return {
    accuracy_threshold: Math.min(100, base.accuracy + (adjustments.accuracy || 0)),
    ethics_compliance: Math.min(100, base.ethics + (adjustments.ethics || 0)),
    cultural_appropriateness: Math.min(100, base.cultural + (adjustments.cultural || 0)),
    professional_standard: Math.min(100, base.professional + (adjustments.professional || 0))
  };
}

// ========================================================================================
// VERSION INFO
// ========================================================================================

/**
 * Iraqi Professional Domain Validation System version information
 */
export const VERSION_INFO = {
  version: '1.0.0',
  build_date: '2025-01-28',
  api_version: 'v1',
  compatibility: {
    iraqi_cultural_engine: '^1.0.0',
    iraqi_arabic_nlp: '^1.0.0',
    node: '>=18.0.0',
    bun: '>=1.0.0'
  },
  features: {
    islamic_compliance: true,
    iraqi_cultural_validation: true,
    professional_ethics: true,
    regulatory_compliance: true,
    multi_domain_support: true,
    arabic_language_support: true,
    parallel_validation: true,
    caching_support: true
  }
} as const;

/**
 * Get current version of the Iraqi Professional Domain Validation System
 * @returns Version string
 */
export function getVersion(): string {
  return VERSION_INFO.version;
}

/**
 * Check if a feature is supported in the current version
 * @param feature Feature to check
 * @returns True if feature is supported, false otherwise
 */
export function isFeatureSupported(feature: keyof typeof VERSION_INFO.features): boolean {
  return VERSION_INFO.features[feature];
}

// ========================================================================================
// DEFAULT EXPORT
// ========================================================================================

/**
 * Default export: Iraqi Professional Domain Validator class
 * Use this for direct instantiation or use the convenience factory function
 */
export { IraqiProfessionalDomainValidator as default } from './validators/iraqi-professional-domain-validator.js';