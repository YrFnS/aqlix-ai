/**
 * Iraqi Professional Domain Validation Types
 * Comprehensive type definitions for validating professional content in Iraqi context
 */

import { z } from 'zod';
import { IraqiCulturalContext } from '@iraqi-ai/cultural-engine';

// ========================================================================================
// CORE PROFESSIONAL DOMAIN TYPES
// ========================================================================================

/**
 * Iraqi Professional Domain Categories
 * Aligned with Iraqi professional organization structure and licensing requirements
 */
export type IraqiProfessionalDomain = 
  | 'legal'           // القانون - Legal profession, courts, legislation
  | 'medical'         // الطب - Medical profession, healthcare, pharmaceuticals
  | 'educational'     // التعليم - Education, academia, research
  | 'engineering'     // الهندسة - Engineering, technical professions
  | 'business'        // الأعمال - Business, commerce, economics
  | 'religious'       // الشؤون الدينية - Religious affairs, Islamic scholarship
  | 'governmental'    // الحكومة - Government, public administration
  | 'media'          // الإعلام - Media, journalism, communications
  | 'arts'           // الفنون - Arts, culture, creative industries
  | 'agriculture';    // الزراعة - Agriculture, rural development

/**
 * Professional Validation Severity Levels
 * Indicates the level of professional scrutiny required
 */
export type ProfessionalValidationLevel =
  | 'informational'   // عام - General information, no professional implications
  | 'advisory'        // استشاري - Advisory content requiring accuracy
  | 'professional'    // مهني - Professional content requiring expertise validation
  | 'regulatory'      // تنظيمي - Content with regulatory implications
  | 'critical';       // حرج - Critical content affecting public welfare

/**
 * Iraqi Professional Ethics Framework
 * Based on Islamic professional ethics and Iraqi professional standards
 */
export interface IraqiProfessionalEthics {
  // Islamic Professional Ethics (الأخلاق المهنية الإسلامية)
  islamicCompliance: {
    halal: boolean;                    // حلال - Permissible under Islamic law
    haram: boolean;                    // حرام - Forbidden under Islamic law
    makruh: boolean;                   // مكروه - Discouraged but not forbidden
    mustahabb: boolean;                // مستحب - Recommended but not obligatory
    scholarly_consensus: boolean;      // إجماع علمي - Scholar consensus exists
    contemporary_ruling: boolean;      // فتوى معاصرة - Modern Islamic ruling available
  };

  // Iraqi Professional Standards (المعايير المهنية العراقية)
  iraqiStandards: {
    licensed_profession: boolean;      // مهنة مرخصة - Requires professional license
    regulated_content: boolean;        // محتوى منظم - Subject to regulatory oversight
    public_safety: boolean;           // السلامة العامة - Affects public safety
    cultural_sensitivity: boolean;     // الحساسية الثقافية - Requires cultural awareness
    confidentiality: boolean;         // السرية - Involves confidential information
  };

  // Professional Competency Requirements (متطلبات الكفاءة المهنية)
  competencyRequirements: {
    specialized_knowledge: boolean;    // معرفة متخصصة - Requires specialized knowledge
    practical_experience: boolean;    // خبرة عملية - Requires practical experience
    continuing_education: boolean;     // التعليم المستمر - Requires ongoing education
    peer_review: boolean;             // مراجعة الأقران - Subject to peer review
    accountability: boolean;          // المساءلة - Professional accountability required
  };
}

/**
 * Professional Domain Validation Request
 * Comprehensive request structure for domain-specific validation
 */
export interface ProfessionalDomainValidationRequest {
  // Content and Context
  content: {
    text: string;                     // النص - Text content to validate
    language: 'ar' | 'en' | 'mixed';  // اللغة - Content language
    format: 'text' | 'document' | 'legal_document' | 'medical_record' | 'academic_paper';
    metadata?: Record<string, any>;    // Additional content metadata
  };

  // Domain Specification
  domain: {
    primary: IraqiProfessionalDomain;        // المجال الأساسي - Primary domain
    secondary?: IraqiProfessionalDomain[];   // المجالات الثانوية - Related domains
    subdomain?: string;                      // المجال الفرعي - Specific subdomain
    specialization?: string;                 // التخصص - Area of specialization
  };

  // Validation Parameters
  validation: {
    level: ProfessionalValidationLevel;      // مستوى التحقق - Validation rigor level
    include_ethics: boolean;                 // تضمين الأخلاق - Include ethics validation
    check_regulations: boolean;              // فحص اللوائح - Check regulatory compliance
    verify_accuracy: boolean;                // التحقق من الدقة - Verify factual accuracy
    cultural_context: boolean;               // السياق الثقافي - Include cultural context
  };

  // Context Information
  context: {
    cultural: IraqiCulturalContext;          // السياق الثقافي - Cultural context
    professional?: {                        // السياق المهني - Professional context
      practitioner_level?: 'student' | 'novice' | 'experienced' | 'expert';
      institution_type?: 'academic' | 'government' | 'private' | 'non_profit';
      target_audience?: 'general' | 'professional' | 'academic' | 'regulatory';
      jurisdiction?: 'federal' | 'regional' | 'local';
    };
    temporal?: {                            // السياق الزمني - Temporal context
      urgency?: 'low' | 'medium' | 'high' | 'critical';
      timeline?: string;                    // Timeline for implementation/action
      historical_context?: boolean;        // Requires historical perspective
    };
  };

  // Quality Thresholds
  thresholds: {
    accuracy_threshold: number;              // 0-100, minimum accuracy required
    ethics_compliance: number;               // 0-100, minimum ethics compliance
    cultural_appropriateness: number;        // 0-100, minimum cultural appropriateness
    professional_standard: number;          // 0-100, minimum professional standard
  };
}

/**
 * Professional Domain Validation Result
 * Comprehensive validation results with actionable insights
 */
export interface ProfessionalDomainValidationResult {
  // Overall Assessment
  overall: {
    validation_status: 'pass' | 'conditional' | 'fail';  // نتيجة التحقق - Overall result
    confidence_score: number;                           // 0-100, confidence in assessment
    professional_grade: 'excellent' | 'good' | 'acceptable' | 'needs_improvement' | 'unacceptable';
    timestamp: Date;                                    // وقت التحقق - Validation timestamp
  };

  // Domain-Specific Assessment
  domain_assessment: {
    primary_domain_fit: number;              // 0-100, how well content fits primary domain
    cross_domain_issues: string[];          // قضايا متعددة المجالات - Cross-domain concerns
    specialization_accuracy: number;        // 0-100, accuracy within specialization
    terminology_correctness: number;        // 0-100, correctness of professional terminology
    content_completeness: number;           // 0-100, completeness for intended purpose
  };

  // Professional Ethics Assessment
  ethics_assessment: IraqiProfessionalEthics & {
    ethics_score: number;                    // 0-100, overall ethics score
    islamic_compliance_score: number;       // 0-100, Islamic compliance score
    professional_standards_score: number;   // 0-100, Iraqi professional standards score
    ethical_concerns: Array<{               // مخاوف أخلاقية - Specific ethical concerns
      concern: string;
      severity: 'minor' | 'moderate' | 'major' | 'critical';
      recommendation: string;
    }>;
  };

  // Regulatory Compliance
  regulatory_compliance: {
    compliance_status: 'compliant' | 'needs_review' | 'non_compliant';
    applicable_regulations: string[];       // اللوائح المطبقة - Applicable Iraqi regulations
    compliance_gaps: Array<{                // فجوات الامتثال - Compliance gaps
      regulation: string;
      gap_description: string;
      severity: 'minor' | 'moderate' | 'major' | 'critical';
      remediation: string;
    }>;
    regulatory_score: number;               // 0-100, overall regulatory compliance
  };

  // Accuracy and Factual Assessment
  accuracy_assessment: {
    factual_accuracy: number;               // 0-100, factual correctness
    source_reliability: number;             // 0-100, reliability of referenced sources
    currency_relevance: number;             // 0-100, how current/relevant the information is
    evidence_quality: number;               // 0-100, quality of supporting evidence
    fact_check_results: Array<{             // نتائج التحقق من الحقائق - Fact-check results
      claim: string;
      verification_status: 'verified' | 'unverified' | 'disputed' | 'false';
      source: string;
      confidence: number;
    }>;
  };

  // Cultural and Linguistic Assessment
  cultural_linguistic: {
    cultural_appropriateness: number;       // 0-100, cultural appropriateness
    language_professionalism: number;      // 0-100, professional language quality
    terminology_consistency: number;       // 0-100, consistent use of professional terms
    arabic_quality: number;                // 0-100, quality of Arabic (if applicable)
    cultural_sensitivity_issues: string[]; // قضايا الحساسية الثقافية - Cultural sensitivity concerns
  };

  // Recommendations and Improvements
  recommendations: {
    required_changes: Array<{               // التغييرات المطلوبة - Mandatory changes
      category: 'ethics' | 'accuracy' | 'compliance' | 'cultural' | 'professional';
      description: string;
      priority: 'high' | 'medium' | 'low';
      implementation_guidance: string;
    }>;
    suggested_improvements: Array<{         // التحسينات المقترحة - Suggested enhancements
      category: string;
      description: string;
      benefit: string;
      difficulty: 'easy' | 'moderate' | 'difficult';
    }>;
    professional_resources: Array<{         // الموارد المهنية - Professional resources
      type: 'regulation' | 'guideline' | 'best_practice' | 'reference' | 'expert';
      title: string;
      source: string;
      relevance_score: number;
    }>;
  };

  // Quality Metrics
  quality_metrics: {
    professional_quality_score: number;     // 0-100, overall professional quality
    islamic_alignment_score: number;        // 0-100, alignment with Islamic values
    iraqi_standards_score: number;          // 0-100, alignment with Iraqi standards
    public_safety_score: number;            // 0-100, public safety considerations
    educational_value: number;              // 0-100, educational/informational value
  };

  // Validation Metadata
  validation_metadata: {
    validator_version: string;              // إصدار المتحقق - Validator version
    domain_expert_consulted: boolean;      // استشارة خبير المجال - Domain expert involved
    validation_duration: number;           // مدة التحقق - Validation time in ms
    confidence_intervals: Record<string, [number, number]>; // Confidence intervals for scores
    limitations: string[];                  // قيود التحقق - Validation limitations
  };
}

/**
 * Professional Domain Registry Entry
 * Registry information for each professional domain
 */
export interface ProfessionalDomainRegistry {
  domain: IraqiProfessionalDomain;
  metadata: {
    arabic_name: string;                    // الاسم العربي - Arabic name
    english_name: string;                   // English name
    description: string;                    // وصف المجال - Domain description
    regulatory_body: string;                // الهيئة التنظيمية - Regulatory authority
    license_requirement: boolean;           // متطلب الترخيص - License required
    islamic_considerations: string[];       // الاعتبارات الإسلامية - Islamic considerations
  };
  
  validation_rules: {
    accuracy_threshold: number;             // Minimum accuracy threshold
    ethics_weight: number;                 // Weight of ethics in validation (0-1)
    cultural_sensitivity: number;          // Cultural sensitivity requirement (0-1)
    regulatory_strictness: number;         // Regulatory compliance strictness (0-1)
    specialized_knowledge_required: boolean; // Requires domain expertise
  };
  
  terminology: {
    arabic_terms: Record<string, string>;   // المصطلحات العربية - Arabic professional terms
    english_terms: Record<string, string>;  // English professional terms
    prohibited_terms: string[];            // المصطلحات المحظورة - Terms to avoid
    sensitive_topics: string[];            // المواضيع الحساسة - Sensitive topics
  };

  resources: {
    regulatory_references: string[];       // المراجع التنظيمية - Regulatory references
    professional_guidelines: string[];     // الإرشادات المهنية - Professional guidelines
    islamic_rulings: string[];             // الأحكام الإسلامية - Relevant Islamic rulings
    expert_contacts: string[];             // جهات الاتصال بالخبراء - Expert contact information
  };
}

// ========================================================================================
// VALIDATION SCHEMAS
// ========================================================================================

/**
 * Zod schema for Professional Domain Validation Request
 */
export const ProfessionalDomainValidationRequestSchema = z.object({
  content: z.object({
    text: z.string().min(1, "Content text is required"),
    language: z.enum(['ar', 'en', 'mixed']),
    format: z.enum(['text', 'document', 'legal_document', 'medical_record', 'academic_paper']),
    metadata: z.record(z.any()).optional()
  }),
  
  domain: z.object({
    primary: z.enum(['legal', 'medical', 'educational', 'engineering', 'business', 'religious', 'governmental', 'media', 'arts', 'agriculture']),
    secondary: z.array(z.enum(['legal', 'medical', 'educational', 'engineering', 'business', 'religious', 'governmental', 'media', 'arts', 'agriculture'])).optional(),
    subdomain: z.string().optional(),
    specialization: z.string().optional()
  }),
  
  validation: z.object({
    level: z.enum(['informational', 'advisory', 'professional', 'regulatory', 'critical']),
    include_ethics: z.boolean(),
    check_regulations: z.boolean(),
    verify_accuracy: z.boolean(),
    cultural_context: z.boolean()
  }),
  
  context: z.object({
    cultural: z.any(), // IraqiCulturalContext
    professional: z.object({
      practitioner_level: z.enum(['student', 'novice', 'experienced', 'expert']).optional(),
      institution_type: z.enum(['academic', 'government', 'private', 'non_profit']).optional(),
      target_audience: z.enum(['general', 'professional', 'academic', 'regulatory']).optional(),
      jurisdiction: z.enum(['federal', 'regional', 'local']).optional()
    }).optional(),
    temporal: z.object({
      urgency: z.enum(['low', 'medium', 'high', 'critical']).optional(),
      timeline: z.string().optional(),
      historical_context: z.boolean().optional()
    }).optional()
  }),
  
  thresholds: z.object({
    accuracy_threshold: z.number().min(0).max(100),
    ethics_compliance: z.number().min(0).max(100),
    cultural_appropriateness: z.number().min(0).max(100),
    professional_standard: z.number().min(0).max(100)
  })
});

/**
 * Type inference from Zod schema
 */
export type ProfessionalDomainValidationRequestType = z.infer<typeof ProfessionalDomainValidationRequestSchema>;

// ========================================================================================
// ERROR TYPES
// ========================================================================================

/**
 * Professional Domain Validation Errors
 */
export interface ProfessionalDomainValidationError {
  code: string;
  message: string;
  details?: Record<string, any>;
  severity: 'warning' | 'error' | 'critical';
  domain?: IraqiProfessionalDomain;
  recommendations?: string[];
}

/**
 * Professional Domain Validation Exception
 */
export class ProfessionalDomainValidationException extends Error {
  constructor(
    public readonly validationError: ProfessionalDomainValidationError,
    message?: string
  ) {
    super(message || validationError.message);
    this.name = 'ProfessionalDomainValidationException';
  }
}

// ========================================================================================
// UTILITY TYPES
// ========================================================================================

/**
 * Professional Domain Validator Configuration
 */
export interface ProfessionalDomainValidatorConfig {
  // Validation Settings
  default_thresholds: {
    accuracy: number;           // Default accuracy threshold (0-100)
    ethics: number;            // Default ethics compliance threshold (0-100)
    cultural: number;          // Default cultural appropriateness threshold (0-100)
    professional: number;      // Default professional standard threshold (0-100)
  };
  
  // Performance Settings
  performance: {
    timeout_ms: number;         // Maximum validation time in milliseconds
    cache_results: boolean;     // Cache validation results
    parallel_validation: boolean; // Enable parallel validation of multiple aspects
    max_concurrent_validations: number; // Maximum concurrent validation requests
  };
  
  // Integration Settings
  integrations: {
    cultural_engine_endpoint?: string;    // Cultural engine API endpoint
    arabic_nlp_endpoint?: string;         // Arabic NLP service endpoint
    regulatory_database_endpoint?: string; // Regulatory database endpoint
    expert_consultation_enabled: boolean; // Enable expert consultation
  };
  
  // Logging and Monitoring
  monitoring: {
    log_level: 'debug' | 'info' | 'warn' | 'error';
    metrics_collection: boolean;         // Collect performance metrics
    audit_trail: boolean;               // Maintain audit trail
    anonymize_content: boolean;         // Anonymize content in logs
  };
}

/**
 * Export all types for external use
 */
export type {
  IraqiProfessionalDomain,
  ProfessionalValidationLevel,
  IraqiProfessionalEthics,
  ProfessionalDomainValidationRequest,
  ProfessionalDomainValidationResult,
  ProfessionalDomainRegistry,
  ProfessionalDomainValidationError,
  ProfessionalDomainValidatorConfig
};