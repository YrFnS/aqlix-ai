/**
 * Iraqi Advanced Cultural Learning System
 * Entry point for ML-powered cultural adaptation and Islamic compliance optimization
 * 
 * This system provides advanced cultural learning capabilities including:
 * - Preference Learning: Adaptive user and cultural preference optimization
 * - Behavior Prediction: Culturally appropriate behavior prediction models
 * - Islamic Compliance: ML-driven Islamic compliance optimization
 * - Language Adaptation: Intelligent Arabic/English/mixed language adaptation
 * - Contextual Reasoning: Context-aware cultural decision making
 * - Ethical Decision: Islamic ethical decision support systems
 * - Social Interaction: Iraqi social interaction pattern learning
 * - Professional Adaptation: Iraqi professional domain adaptation
 * 
 * Performance Targets:
 * - Learning Speed: <500ms for feedback integration, <30s for model updates
 * - Prediction Accuracy: 90%+ cultural appropriateness, 95%+ Islamic compliance
 * - Adaptation Quality: 85%+ content improvement, 95%+ meaning preservation
 * - System Performance: <200ms inference time, >95% uptime
 * - Cultural Intelligence: 92%+ Iraqi cultural context understanding
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
  CulturalLearningModelType,
  CulturalFeedbackType,
  CulturalLearningContext,
  CulturalFeatureVector,
  CulturalLearningFeedback,
  CulturalModelPerformance,
  CulturalLearningConfig,
  IslamicComplianceLearning,
  ProfessionalAdaptationLearning
} from './types/cultural-learning-types.js';

// Validation Schemas
export {
  CulturalLearningContextSchema,
  CulturalLearningFeedbackSchema,
  CulturalLearningException
} from './types/cultural-learning-types.js';

// Core Learning Engine
export {
  IraqiCulturalLearningEngine
} from './algorithms/iraqi-cultural-learning-engine.js';

// ========================================================================================
// CONVENIENCE EXPORTS
// ========================================================================================

/**
 * Default Iraqi Cultural Learning Configuration
 * Optimized for Iraqi cultural patterns and Islamic principles
 */
export const DEFAULT_CULTURAL_LEARNING_CONFIG: import('./types/cultural-learning-types.js').CulturalLearningConfig = {
  // Algorithm Configuration
  algorithms: {
    primary_algorithm: 'neural_network',        // Primary ML algorithm
    ensemble_methods: ['random_forest', 'svm'], // Ensemble methods for robust learning
    online_learning: true,                      // Enable incremental learning
    transfer_learning: true                     // Enable knowledge transfer between domains
  },

  // Training Configuration
  training: {
    batch_size: 32,                            // Training batch size
    learning_rate: 0.001,                      // Learning rate for gradient descent
    max_epochs: 100,                           // Maximum training epochs
    early_stopping_patience: 10,              // Early stopping patience
    validation_split: 0.2,                    // Validation data split (20%)
    cross_validation_folds: 5                 // 5-fold cross-validation
  },

  // Cultural Learning Specific Configuration
  cultural_config: {
    islamic_weight: 0.4,                       // 40% weight for Islamic compliance
    cultural_weight: 0.3,                      // 30% weight for Iraqi cultural appropriateness
    regional_adaptation: true,                 // Enable Iraqi regional adaptation
    professional_specialization: true,         // Enable professional domain specialization
    temporal_adaptation: true,                 // Enable temporal/seasonal adaptation
    privacy_preservation: true                 // Enable privacy-preserving learning
  },

  // Performance Optimization
  performance: {
    max_inference_time: 200,                   // Maximum inference time (200ms)
    cache_predictions: true,                   // Cache frequent predictions
    parallel_processing: true,                 // Enable parallel processing
    model_compression: true,                   // Enable model compression
    quantization: false                        // Disable quantization initially
  },

  // Quality and Safety
  safety: {
    bias_detection: true,                      // Enable bias detection and mitigation
    fairness_constraints: true,               // Apply fairness constraints
    explainability: true,                      // Enable model explainability
    safety_filters: true,                      // Apply safety filters
    content_filtering: true                    // Enable harmful content filtering
  },

  // Monitoring and Evaluation
  monitoring: {
    performance_tracking: true,                // Track model performance continuously
    drift_detection: true,                     // Detect concept and data drift
    feedback_integration: true,                // Integrate user feedback continuously
    continuous_evaluation: true,               // Continuous model evaluation
    alert_thresholds: {
      accuracy_threshold: 0.85,               // Alert if accuracy drops below 85%
      error_rate_threshold: 0.1,             // Alert if error rate exceeds 10%
      drift_threshold: 0.3                    // Alert if drift score exceeds 30%
    }
  }
};

/**
 * Cultural Learning Model Types
 * Standard model types for different cultural learning tasks
 */
export const CULTURAL_LEARNING_MODELS = {
  PREFERENCE_LEARNING: 'preference_learning' as const,      // تعلم التفضيلات
  BEHAVIOR_PREDICTION: 'behavior_prediction' as const,      // التنبؤ بالسلوك
  ISLAMIC_COMPLIANCE: 'islamic_compliance' as const,        // الامتثال الإسلامي
  LANGUAGE_ADAPTATION: 'language_adaptation' as const,      // التكيف اللغوي
  CONTEXTUAL_REASONING: 'contextual_reasoning' as const,    // الاستدلال السياقي
  ETHICAL_DECISION: 'ethical_decision' as const,            // القرار الأخلاقي
  SOCIAL_INTERACTION: 'social_interaction' as const,        // التفاعل الاجتماعي
  PROFESSIONAL_ADAPTATION: 'professional_adaptation' as const // التكيف المهني
} as const;

/**
 * Cultural Feedback Types
 * Standard feedback types for cultural learning
 */
export const CULTURAL_FEEDBACK_TYPES = {
  EXPLICIT_POSITIVE: 'explicit_positive' as const,          // إيجابي صريح
  EXPLICIT_NEGATIVE: 'explicit_negative' as const,          // سلبي صريح
  IMPLICIT_ENGAGEMENT: 'implicit_engagement' as const,      // مشاركة ضمنية
  IMPLICIT_AVOIDANCE: 'implicit_avoidance' as const,        // تجنب ضمني
  CULTURAL_VALIDATOR: 'cultural_validator' as const,        // مُتحقق ثقافي
  EXPERT_REVIEW: 'expert_review' as const,                  // مراجعة خبير
  PEER_CONSENSUS: 'peer_consensus' as const,                // إجماع الأقران
  BEHAVIORAL_PATTERN: 'behavioral_pattern' as const        // نمط سلوكي
} as const;

/**
 * Islamic Compliance Categories
 * Categories for Islamic compliance assessment and learning
 */
export const ISLAMIC_COMPLIANCE_CATEGORIES = {
  HALAL: 'halal' as const,                                 // حلال - Permissible
  HARAM: 'haram' as const,                                 // حرام - Forbidden
  MAKRUH: 'makruh' as const,                               // مكروه - Discouraged
  MUSTAHABB: 'mustahabb' as const,                         // مستحب - Recommended
  MUBAH: 'mubah' as const                                  // مباح - Neutral/Permissible
} as const;

// ========================================================================================
// UTILITY FUNCTIONS
// ========================================================================================

/**
 * Create Iraqi Cultural Learning Engine with default configuration
 * @param culturalEngine Iraqi Cultural Decision Engine instance
 * @param arabicNLP Iraqi Arabic NLP Pipeline instance
 * @param professionalValidator Iraqi Professional Domain Validator instance
 * @param customConfig Optional custom configuration (merged with defaults)
 * @returns Configured IraqiCulturalLearningEngine instance
 */
export function createIraqiCulturalLearningEngine(
  culturalEngine: import('@iraqi-ai/cultural-engine').IraqiCulturalDecisionEngine,
  arabicNLP: import('@iraqi-ai/arabic-nlp').IraqiArabicNLPPipeline,
  professionalValidator: import('@iraqi-ai/professional-domains').IraqiProfessionalDomainValidator,
  customConfig?: Partial<import('./types/cultural-learning-types.js').CulturalLearningConfig>
): import('./algorithms/iraqi-cultural-learning-engine.js').IraqiCulturalLearningEngine {
  const config = {
    ...DEFAULT_CULTURAL_LEARNING_CONFIG,
    ...customConfig,
    // Merge nested objects properly
    algorithms: {
      ...DEFAULT_CULTURAL_LEARNING_CONFIG.algorithms,
      ...customConfig?.algorithms
    },
    training: {
      ...DEFAULT_CULTURAL_LEARNING_CONFIG.training,
      ...customConfig?.training
    },
    cultural_config: {
      ...DEFAULT_CULTURAL_LEARNING_CONFIG.cultural_config,
      ...customConfig?.cultural_config
    },
    performance: {
      ...DEFAULT_CULTURAL_LEARNING_CONFIG.performance,
      ...customConfig?.performance
    },
    safety: {
      ...DEFAULT_CULTURAL_LEARNING_CONFIG.safety,
      ...customConfig?.safety
    },
    monitoring: {
      ...DEFAULT_CULTURAL_LEARNING_CONFIG.monitoring,
      ...customConfig?.monitoring,
      alert_thresholds: {
        ...DEFAULT_CULTURAL_LEARNING_CONFIG.monitoring.alert_thresholds,
        ...customConfig?.monitoring?.alert_thresholds
      }
    }
  };

  return new import('./algorithms/iraqi-cultural-learning-engine.js').IraqiCulturalLearningEngine(
    culturalEngine,
    arabicNLP,
    professionalValidator,
    config
  );
}

/**
 * Create standard cultural learning context for Iraqi users
 * @param userId User identifier
 * @param basicInfo Basic user information
 * @param culturalContext Iraqi cultural context
 * @returns Standard cultural learning context
 */
export function createStandardCulturalContext(
  userId: string,
  basicInfo: {
    age_group?: 'youth' | 'adult' | 'elder';
    education_level?: 'primary' | 'secondary' | 'undergraduate' | 'graduate' | 'postgraduate';
    profession?: string;
    region?: 'baghdad' | 'basra' | 'mosul' | 'erbil' | 'najaf' | 'karbala' | 'other';
    language_preference?: 'arabic' | 'english' | 'mixed';
    religious_sensitivity?: 'high' | 'medium' | 'low';
  },
  culturalContext: import('@iraqi-ai/cultural-engine').IraqiCulturalContext
): import('./types/cultural-learning-types.js').CulturalLearningContext {
  const now = new Date();
  const hour = now.getHours();
  
  let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  if (hour >= 6 && hour < 12) timeOfDay = 'morning';
  else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
  else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
  else timeOfDay = 'night';

  const dayOfWeek = now.getDay() === 0 || now.getDay() === 6 ? 'weekend' : 'weekday';

  return {
    user: {
      id: userId,
      demographic: {
        age_group: basicInfo.age_group,
        education_level: basicInfo.education_level,
        profession: basicInfo.profession,
        region: basicInfo.region,
        religious_school: 'prefer_not_to_say' // Default privacy-preserving value
      },
      preferences: {
        language_preference: basicInfo.language_preference || 'arabic',
        formality_level: 'formal', // Default to formal for Iraqi context
        religious_sensitivity: basicInfo.religious_sensitivity || 'high',
        cultural_adaptation: 'strict' // Default to strict for Iraqi cultural compliance
      },
      interaction_history: {
        total_interactions: 0,
        positive_feedback_rate: 0.5, // Neutral starting point
        cultural_compliance_rate: 0.5, // Neutral starting point
        preferred_topics: [],
        avoided_topics: []
      }
    },
    cultural: culturalContext,
    temporal: {
      timestamp: now,
      time_of_day: timeOfDay,
      day_of_week: dayOfWeek,
      islamic_calendar: {
        month: '', // Would be populated with Islamic calendar data
        is_holy_month: false,
        is_holy_day: dayOfWeek === 'weekday' && now.getDay() === 5 // Friday
      }
    },
    interaction: {
      channel: 'chat',
      device_type: 'desktop', // Default assumption
      network_quality: 'high', // Default assumption
      privacy_level: 'private' // Default to private for Iraqi context
    }
  };
}

/**
 * Create feedback from user interaction
 * @param interactionId Interaction identifier
 * @param content Content that received feedback
 * @param context Cultural context
 * @param userRating User's overall rating (0-100)
 * @param specificFeedback Specific feedback dimensions
 * @returns Structured cultural learning feedback
 */
export function createUserFeedback(
  interactionId: string,
  content: string,
  context: import('./types/cultural-learning-types.js').CulturalLearningContext,
  userRating: number,
  specificFeedback: {
    cultural_appropriateness?: number;
    islamic_compliance?: number;
    language_quality?: number;
    professional_relevance?: number;
    helpfulness?: number;
    accuracy?: number;
  } = {}
): import('./types/cultural-learning-types.js').CulturalLearningFeedback {
  const feedbackType = userRating >= 70 ? 'explicit_positive' : userRating <= 40 ? 'explicit_negative' : 'implicit_engagement';
  
  // Determine feedback weight based on user's interaction history
  const weight = Math.min(1.0, 0.5 + (context.user.interaction_history.total_interactions / 100));
  
  // Determine priority based on rating and cultural compliance
  let priority: 'low' | 'medium' | 'high' | 'critical' = 'medium';
  if (userRating <= 30 || (specificFeedback.islamic_compliance && specificFeedback.islamic_compliance <= 40)) {
    priority = 'critical';
  } else if (userRating <= 50 || (specificFeedback.cultural_appropriateness && specificFeedback.cultural_appropriateness <= 60)) {
    priority = 'high';
  } else if (userRating >= 90) {
    priority = 'low';
  }

  return {
    feedback_id: `feedback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date(),
    source: feedbackType as any,
    interaction_id: interactionId,
    content_snippet: content.length > 200 ? content.substring(0, 200) + '...' : content,
    cultural_context: context,
    feedback: {
      overall_rating: userRating,
      dimensions: {
        cultural_appropriateness: specificFeedback.cultural_appropriateness || userRating,
        islamic_compliance: specificFeedback.islamic_compliance || Math.min(100, userRating + 10), // Slight boost for Islamic compliance
        language_quality: specificFeedback.language_quality || userRating,
        professional_relevance: specificFeedback.professional_relevance || (context.professional ? userRating : 80),
        helpfulness: specificFeedback.helpfulness || userRating,
        accuracy: specificFeedback.accuracy || userRating
      },
      specific_issues: [], // Would be populated based on analysis
      positive_aspects: [] // Would be populated based on analysis
    },
    learning_signals: {
      confidence: Math.min(1.0, Math.abs(userRating - 50) / 50), // Higher confidence for extreme ratings
      weight: weight,
      priority: priority,
      should_retrain: priority === 'critical' || (context.user.interaction_history.total_interactions % 100 === 0)
    },
    validation: {
      is_validated: false,
      cross_validated: false
    }
  };
}

/**
 * Validate if a model type is supported
 * @param modelType Model type to validate
 * @returns True if supported, false otherwise
 */
export function isValidCulturalLearningModel(
  modelType: string
): modelType is import('./types/cultural-learning-types.js').CulturalLearningModelType {
  return Object.values(CULTURAL_LEARNING_MODELS).includes(modelType as any);
}

/**
 * Get Arabic name for cultural learning model type
 * @param modelType Cultural learning model type
 * @returns Arabic name of the model type
 */
export function getArabicModelName(modelType: import('./types/cultural-learning-types.js').CulturalLearningModelType): string {
  const arabicNames: Record<import('./types/cultural-learning-types.js').CulturalLearningModelType, string> = {
    preference_learning: 'تعلم التفضيلات',
    behavior_prediction: 'التنبؤ بالسلوك',
    islamic_compliance: 'الامتثال الإسلامي',
    language_adaptation: 'التكيف اللغوي',
    contextual_reasoning: 'الاستدلال السياقي',
    ethical_decision: 'القرار الأخلاقي',
    social_interaction: 'التفاعل الاجتماعي',
    professional_adaptation: 'التكيف المهني'
  };
  
  return arabicNames[modelType];
}

/**
 * Calculate Islamic compliance score from learning feedback
 * @param feedback Array of cultural learning feedback
 * @returns Islamic compliance metrics
 */
export function calculateIslamicComplianceMetrics(
  feedback: import('./types/cultural-learning-types.js').CulturalLearningFeedback[]
): {
  overall_compliance: number;        // 0-100 overall Islamic compliance
  compliance_trend: 'improving' | 'stable' | 'declining';
  critical_issues: number;          // Number of critical Islamic compliance issues
  halal_percentage: number;         // Percentage of content deemed halal
  areas_for_improvement: string[];  // Areas needing Islamic compliance improvement
} {
  if (feedback.length === 0) {
    return {
      overall_compliance: 50, // Neutral starting point
      compliance_trend: 'stable',
      critical_issues: 0,
      halal_percentage: 50,
      areas_for_improvement: []
    };
  }

  // Calculate overall compliance
  const complianceScores = feedback.map(f => f.feedback.dimensions.islamic_compliance);
  const overallCompliance = complianceScores.reduce((sum, score) => sum + score, 0) / complianceScores.length;

  // Calculate trend (compare first half vs second half)
  const midpoint = Math.floor(feedback.length / 2);
  const firstHalf = complianceScores.slice(0, midpoint);
  const secondHalf = complianceScores.slice(midpoint);
  
  const firstAvg = firstHalf.reduce((sum, score) => sum + score, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, score) => sum + score, 0) / secondHalf.length;
  
  let trend: 'improving' | 'stable' | 'declining';
  if (secondAvg > firstAvg + 5) trend = 'improving';
  else if (secondAvg < firstAvg - 5) trend = 'declining';
  else trend = 'stable';

  // Count critical issues
  const criticalIssues = feedback.reduce((count, f) => {
    return count + f.feedback.specific_issues.filter(issue => 
      issue.category === 'religious' && issue.severity === 'critical'
    ).length;
  }, 0);

  // Calculate halal percentage (scores >= 80 considered halal)
  const halalCount = complianceScores.filter(score => score >= 80).length;
  const halalPercentage = (halalCount / complianceScores.length) * 100;

  // Identify areas for improvement
  const areasForImprovement: string[] = [];
  if (overallCompliance < 90) areasForImprovement.push('Overall Islamic compliance needs improvement');
  if (halalPercentage < 85) areasForImprovement.push('Increase halal content percentage');
  if (criticalIssues > 0) areasForImprovement.push('Address critical Islamic compliance violations');
  if (trend === 'declining') areasForImprovement.push('Reverse declining Islamic compliance trend');

  return {
    overall_compliance: Math.round(overallCompliance),
    compliance_trend: trend,
    critical_issues: criticalIssues,
    halal_percentage: Math.round(halalPercentage),
    areas_for_improvement: areasForImprovement
  };
}

// ========================================================================================
// VERSION INFO
// ========================================================================================

/**
 * Iraqi Cultural Learning System version information
 */
export const VERSION_INFO = {
  version: '1.0.0',
  build_date: '2025-01-28',
  api_version: 'v1',
  compatibility: {
    iraqi_cultural_engine: '^1.0.0',
    iraqi_arabic_nlp: '^1.0.0',
    iraqi_professional_domains: '^1.0.0',
    node: '>=18.0.0',
    bun: '>=1.0.0'
  },
  features: {
    preference_learning: true,
    behavior_prediction: true,
    islamic_compliance_optimization: true,
    language_adaptation: true,
    contextual_reasoning: true,
    ethical_decision_support: true,
    social_interaction_learning: true,
    professional_adaptation: true,
    online_learning: true,
    transfer_learning: true,
    bias_detection: true,
    privacy_preservation: true
  }
} as const;

/**
 * Get current version of the Iraqi Cultural Learning System
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
 * Default export: Iraqi Cultural Learning Engine class
 * Use this for direct instantiation or use the convenience factory function
 */
export { IraqiCulturalLearningEngine as default } from './algorithms/iraqi-cultural-learning-engine.js';