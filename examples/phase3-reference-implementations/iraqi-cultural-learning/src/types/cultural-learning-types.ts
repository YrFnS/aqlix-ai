/**
 * Iraqi Cultural Learning Algorithm Types
 * Comprehensive type definitions for advanced cultural learning and adaptation systems
 */

import { z } from "zod";
import { IraqiCulturalContext } from "@iraqi-ai/cultural-engine";
import { IraqiProfessionalDomain } from "@iraqi-ai/professional-domains";

// ========================================================================================
// CORE CULTURAL LEARNING TYPES
// ========================================================================================

/**
 * Cultural Learning Model Types
 * Different types of machine learning models for cultural adaptation
 */
export type CulturalLearningModelType =
  | "preference_learning" // تعلم التفضيلات - Learning user/cultural preferences
  | "behavior_prediction" // التنبؤ بالسلوك - Predicting culturally appropriate behavior
  | "islamic_compliance" // الامتثال الإسلامي - Islamic compliance optimization
  | "language_adaptation" // التكيف اللغوي - Language and dialect adaptation
  | "contextual_reasoning" // الاستدلال السياقي - Contextual cultural reasoning
  | "ethical_decision" // القرار الأخلاقي - Ethical decision making
  | "social_interaction" // التفاعل الاجتماعي - Social interaction patterns
  | "professional_adaptation"; // التكيف المهني - Professional context adaptation

/**
 * Learning Feedback Types
 * Types of feedback used to improve cultural learning models
 */
export type CulturalFeedbackType =
  | "explicit_positive" // إيجابي صريح - User explicitly indicates approval
  | "explicit_negative" // سلبي صريح - User explicitly indicates disapproval
  | "implicit_engagement" // مشاركة ضمنية - Inferred positive feedback from engagement
  | "implicit_avoidance" // تجنب ضمني - Inferred negative feedback from avoidance
  | "cultural_validator" // مُتحقق ثقافي - Feedback from cultural validation system
  | "expert_review" // مراجعة خبير - Feedback from domain experts
  | "peer_consensus" // إجماع الأقران - Consensus from peer review
  | "behavioral_pattern"; // نمط سلوكي - Learned from behavioral patterns

/**
 * Cultural Learning Context
 * Contextual information for cultural learning algorithms
 */
export interface CulturalLearningContext {
  // User Context (السياق المستخدم)
  user: {
    id: string; // معرف المستخدم - User identifier
    demographic: {
      // الديموغرافية - Demographic information
      age_group?: "youth" | "adult" | "elder";
      education_level?:
        | "primary"
        | "secondary"
        | "undergraduate"
        | "graduate"
        | "postgraduate";
      profession?: string;
      region?:
        | "baghdad"
        | "basra"
        | "mosul"
        | "erbil"
        | "najaf"
        | "karbala"
        | "other";
      religious_school?: "sunni" | "shia" | "other" | "prefer_not_to_say";
    };
    preferences: {
      // التفضيلات - User preferences
      language_preference: "arabic" | "english" | "mixed";
      formality_level: "formal" | "semi_formal" | "casual";
      religious_sensitivity: "high" | "medium" | "low";
      cultural_adaptation: "strict" | "moderate" | "flexible";
    };
    interaction_history: {
      // تاريخ التفاعل - Interaction history
      total_interactions: number;
      positive_feedback_rate: number; // نسبة الردود الإيجابية - Positive feedback ratio
      cultural_compliance_rate: number; // نسبة الامتثال الثقافي - Cultural compliance ratio
      preferred_topics: string[];
      avoided_topics: string[];
    };
  };

  // Cultural Context (السياق الثقافي)
  cultural: IraqiCulturalContext;

  // Professional Context (السياق المهني)
  professional?: {
    domain: IraqiProfessionalDomain;
    expertise_level: "novice" | "intermediate" | "expert";
    institution_type: "academic" | "government" | "private" | "religious";
  };

  // Temporal Context (السياق الزمني)
  temporal: {
    timestamp: Date; // وقت التفاعل - Interaction timestamp
    session_duration?: number; // مدة الجلسة - Session duration in minutes
    time_of_day: "morning" | "afternoon" | "evening" | "night";
    day_of_week: "weekday" | "weekend";
    islamic_calendar?: {
      // التقويم الإسلامي - Islamic calendar context
      month: string;
      is_holy_month: boolean; // شهر مقدس - Whether it's a holy month (Ramadan, etc.)
      is_holy_day: boolean; // يوم مقدس - Whether it's a holy day (Jumma, etc.)
    };
  };

  // Interaction Context (سياق التفاعل)
  interaction: {
    channel: "chat" | "document" | "voice" | "api";
    device_type: "mobile" | "tablet" | "desktop" | "server";
    network_quality: "high" | "medium" | "low";
    privacy_level: "public" | "private" | "confidential";
  };
}

/**
 * Cultural Learning Feature Vector
 * Numerical representation of cultural learning features for ML models
 */
export interface CulturalFeatureVector {
  // User Features (معالم المستخدم)
  user_features: {
    demographic_vector: number[]; // Encoded demographic information
    preference_vector: number[]; // Encoded user preferences
    history_vector: number[]; // Encoded interaction history
    engagement_score: number; // مقياس المشاركة - 0-1 engagement level
  };

  // Cultural Features (المعالم الثقافية)
  cultural_features: {
    islamic_context_vector: number[]; // Islamic cultural context encoding
    iraqi_context_vector: number[]; // Iraqi cultural context encoding
    regional_vector: number[]; // Regional cultural variations
    religious_sensitivity: number; // حساسية دينية - 0-1 religious sensitivity
  };

  // Content Features (معالم المحتوى)
  content_features: {
    semantic_vector: number[]; // Semantic representation of content
    linguistic_vector: number[]; // Linguistic features (Arabic, English, mixed)
    topic_vector: number[]; // Topic classification features
    complexity_score: number; // مستوى التعقيد - 0-1 content complexity
  };

  // Contextual Features (المعالم السياقية)
  contextual_features: {
    temporal_vector: number[]; // Time-based contextual features
    professional_vector: number[]; // Professional domain features
    interaction_vector: number[]; // Interaction mode features
    privacy_score: number; // مستوى الخصوصية - 0-1 privacy level
  };
}

/**
 * Cultural Learning Feedback
 * Structured feedback for improving cultural learning models
 */
export interface CulturalLearningFeedback {
  // Feedback Identification
  feedback_id: string; // معرف الملاحظة - Unique feedback identifier
  timestamp: Date; // وقت الملاحظة - Feedback timestamp
  source: CulturalFeedbackType; // مصدر الملاحظة - Source of feedback

  // Content and Context
  interaction_id: string; // معرف التفاعل - Related interaction ID
  content_snippet: string; // مقتطف المحتوى - Content that received feedback
  cultural_context: CulturalLearningContext; // السياق الثقافي - Cultural context

  // Feedback Details
  feedback: {
    overall_rating: number; // تقييم شامل - Overall rating (0-100)
    dimensions: {
      // أبعاد التقييم - Specific feedback dimensions
      cultural_appropriateness: number; // الملاءمة الثقافية - 0-100
      islamic_compliance: number; // الامتثال الإسلامي - 0-100
      language_quality: number; // جودة اللغة - 0-100
      professional_relevance: number; // الصلة المهنية - 0-100
      helpfulness: number; // الفائدة - 0-100
      accuracy: number; // الدقة - 0-100
    };
    specific_issues: Array<{
      // قضايا محددة - Specific issues identified
      category:
        | "cultural"
        | "religious"
        | "linguistic"
        | "professional"
        | "factual";
      severity: "minor" | "moderate" | "major" | "critical";
      description: string;
      suggestion?: string; // اقتراح للتحسين - Improvement suggestion
    }>;
    positive_aspects: string[]; // الجوانب الإيجابية - What worked well
  };

  // Learning Signals
  learning_signals: {
    confidence: number; // الثقة - Confidence in feedback (0-1)
    weight: number; // الوزن - Weight for learning algorithm (0-1)
    priority: "low" | "medium" | "high" | "critical";
    should_retrain: boolean; // إعادة التدريب - Whether to trigger model retraining
  };

  // Validation
  validation: {
    is_validated: boolean; // مُتحقق - Whether feedback is validated
    validator_id?: string; // معرف المتحقق - Validator identifier
    validation_confidence?: number; // ثقة التحقق - Validation confidence
    cross_validated?: boolean; // متحقق متقاطع - Cross-validated by multiple sources
  };
}

/**
 * Cultural Learning Model Performance
 * Performance metrics for cultural learning models
 */
export interface CulturalModelPerformance {
  // Model Identification
  model_id: string; // معرف النموذج - Model identifier
  model_type: CulturalLearningModelType; // نوع النموذج - Type of learning model
  version: string; // إصدار النموذج - Model version
  last_updated: Date; // آخر تحديث - Last update timestamp

  // Training Metrics
  training_metrics: {
    training_samples: number; // عينات التدريب - Number of training samples
    validation_samples: number; // عينات التحقق - Number of validation samples
    training_accuracy: number; // دقة التدريب - Training accuracy (0-1)
    validation_accuracy: number; // دقة التحقق - Validation accuracy (0-1)
    cross_validation_score: number; // نتيجة التحقق المتقاطع - Cross-validation score
    training_duration: number; // مدة التدريب - Training time in milliseconds
  };

  // Cultural Performance Metrics
  cultural_metrics: {
    islamic_compliance_accuracy: number; // دقة الامتثال الإسلامي - Islamic compliance accuracy
    cultural_appropriateness_score: number; // نتيجة الملاءمة الثقافية - Cultural appropriateness
    regional_adaptation_score: number; // نتيجة التكيف الإقليمي - Regional adaptation score
    professional_relevance_score: number; // نتيجة الصلة المهنية - Professional relevance
    language_adaptation_score: number; // نتيجة التكيف اللغوي - Language adaptation
  };

  // Real-time Performance
  runtime_metrics: {
    average_inference_time: number; // متوسط وقت الاستنتاج - Average inference time (ms)
    throughput: number; // الإنتاجية - Requests per second
    memory_usage: number; // استخدام الذاكرة - Memory usage in MB
    error_rate: number; // معدل الخطأ - Error rate (0-1)
    user_satisfaction: number; // رضا المستخدم - User satisfaction score (0-1)
  };

  // Drift and Stability
  stability_metrics: {
    concept_drift_score: number; // نتيجة انحراف المفهوم - Concept drift detection score
    data_drift_score: number; // نتيجة انحراف البيانات - Data drift score
    model_stability: number; // استقرار النموذج - Model stability over time
    adaptation_rate: number; // معدل التكيف - How quickly model adapts to changes
  };

  // Feature Importance
  feature_importance: {
    cultural_features_weight: number; // وزن المعالم الثقافية - Cultural features importance
    user_features_weight: number; // وزن معالم المستخدم - User features importance
    content_features_weight: number; // وزن معالم المحتوى - Content features importance
    contextual_features_weight: number; // وزن المعالم السياقية - Contextual features importance
    top_features: Array<{
      // المعالم الأهم - Most important features
      feature_name: string;
      importance_score: number;
      category: "cultural" | "user" | "content" | "contextual";
    }>;
  };
}

/**
 * Cultural Learning Algorithm Configuration
 * Configuration for different cultural learning algorithms
 */
export interface CulturalLearningConfig {
  // Algorithm Selection
  algorithms: {
    primary_algorithm:
      | "neural_network"
      | "decision_tree"
      | "random_forest"
      | "svm"
      | "naive_bayes"
      | "ensemble";
    ensemble_methods?: string[]; // Methods for ensemble learning
    online_learning: boolean; // تعلم متصل - Enable online/incremental learning
    transfer_learning: boolean; // التعلم بالنقل - Enable transfer learning
  };

  // Training Configuration
  training: {
    batch_size: number; // حجم الدفعة - Training batch size
    learning_rate: number; // معدل التعلم - Learning rate
    max_epochs: number; // الحقب القصوى - Maximum training epochs
    early_stopping_patience: number; // صبر التوقف المبكر - Early stopping patience
    validation_split: number; // تقسيم التحقق - Validation data split ratio
    cross_validation_folds: number; // طيات التحقق المتقاطع - Cross-validation folds
  };

  // Cultural Learning Specific
  cultural_config: {
    islamic_weight: number; // وزن الامتثال الإسلامي - Islamic compliance weight (0-1)
    cultural_weight: number; // وزن الملاءمة الثقافية - Cultural appropriateness weight (0-1)
    regional_adaptation: boolean; // التكيف الإقليمي - Enable regional adaptation
    professional_specialization: boolean; // التخصص المهني - Enable professional specialization
    temporal_adaptation: boolean; // التكيف الزمني - Enable temporal adaptation
    privacy_preservation: boolean; // حفظ الخصوصية - Enable privacy-preserving learning
  };

  // Performance Optimization
  performance: {
    max_inference_time: number; // الحد الأقصى لوقت الاستنتاج - Max inference time (ms)
    cache_predictions: boolean; // تخزين التوقعات مؤقتًا - Cache model predictions
    parallel_processing: boolean; // المعالجة المتوازية - Enable parallel processing
    model_compression: boolean; // ضغط النموذج - Enable model compression
    quantization: boolean; // التكميم - Enable model quantization
  };

  // Quality and Safety
  safety: {
    bias_detection: boolean; // كشف التحيز - Enable bias detection
    fairness_constraints: boolean; // قيود العدالة - Apply fairness constraints
    explainability: boolean; // القابلية للتفسير - Enable model explainability
    safety_filters: boolean; // مرشحات الأمان - Apply safety filters
    content_filtering: boolean; // ترشيح المحتوى - Enable content filtering
  };

  // Monitoring and Evaluation
  monitoring: {
    performance_tracking: boolean; // تتبع الأداء - Track model performance
    drift_detection: boolean; // كشف الانحراف - Detect concept/data drift
    feedback_integration: boolean; // تكامل الملاحظات - Integrate user feedback
    continuous_evaluation: boolean; // التقييم المستمر - Continuous model evaluation
    alert_thresholds: {
      // حدود التنبيه - Performance alert thresholds
      accuracy_threshold: number;
      error_rate_threshold: number;
      drift_threshold: number;
    };
  };
}

// ========================================================================================
// SPECIALIZED LEARNING TYPES
// ========================================================================================

/**
 * Islamic Compliance Learning
 * Specialized learning for Islamic compliance optimization
 */
export interface IslamicComplianceLearning {
  // Compliance Categories
  compliance_categories: {
    worship: {
      // العبادة - Worship practices
      prayer_times: boolean;
      fasting: boolean;
      pilgrimage: boolean;
    };
    social: {
      // الاجتماعية - Social interactions
      family_relations: boolean;
      community_engagement: boolean;
      conflict_resolution: boolean;
    };
    economic: {
      // الاقتصادية - Economic activities
      halal_finance: boolean;
      business_ethics: boolean;
      charity_obligations: boolean;
    };
    legal: {
      // القانونية - Legal matters
      sharia_compliance: boolean;
      civil_law_harmony: boolean;
      dispute_resolution: boolean;
    };
  };

  // Learning Sources
  sources: {
    quran_references: string[]; // مراجع القرآن - Quranic references
    hadith_references: string[]; // مراجع الحديث - Hadith references
    scholarly_consensus: string[]; // الإجماع العلمي - Scholarly consensus sources
    contemporary_fatwas: string[]; // الفتاوى المعاصرة - Contemporary Islamic rulings
  };

  // Adaptation Strategies
  strategies: {
    context_aware: boolean; // مراعي للسياق - Context-aware adaptation
    madhab_specific: boolean; // خاص بالمذهب - Specific to Islamic school of thought
    contemporary_issues: boolean; // القضايا المعاصرة - Handle contemporary issues
    cultural_integration: boolean; // التكامل الثقافي - Integrate with Iraqi culture
  };
}

/**
 * Professional Adaptation Learning
 * Learning for professional domain adaptation
 */
export interface ProfessionalAdaptationLearning {
  // Domain Specialization
  domains: Record<
    IraqiProfessionalDomain,
    {
      terminology_learning: boolean; // تعلم المصطلحات - Learn domain terminology
      context_adaptation: boolean; // تكيف السياق - Adapt to domain context
      ethics_compliance: boolean; // امتثال الأخلاق - Professional ethics compliance
      regulatory_awareness: boolean; // الوعي التنظيمي - Regulatory compliance awareness
    }
  >;

  // Learning Strategies
  strategies: {
    expert_feedback_integration: boolean; // تكامل ملاحظات الخبراء - Expert feedback integration
    peer_learning: boolean; // التعلم من الأقران - Peer learning
    case_based_learning: boolean; // التعلم القائم على الحالات - Case-based learning
    simulation_based: boolean; // قائم على المحاكاة - Simulation-based learning
  };
}

// ========================================================================================
// VALIDATION SCHEMAS
// ========================================================================================

/**
 * Cultural Learning Context Schema
 */
export const CulturalLearningContextSchema = z.object({
  user: z.object({
    id: z.string(),
    demographic: z.object({
      age_group: z.enum(["youth", "adult", "elder"]).optional(),
      education_level: z
        .enum([
          "primary",
          "secondary",
          "undergraduate",
          "graduate",
          "postgraduate",
        ])
        .optional(),
      profession: z.string().optional(),
      region: z
        .enum([
          "baghdad",
          "basra",
          "mosul",
          "erbil",
          "najaf",
          "karbala",
          "other",
        ])
        .optional(),
      religious_school: z
        .enum(["sunni", "shia", "other", "prefer_not_to_say"])
        .optional(),
    }),
    preferences: z.object({
      language_preference: z.enum(["arabic", "english", "mixed"]),
      formality_level: z.enum(["formal", "semi_formal", "casual"]),
      religious_sensitivity: z.enum(["high", "medium", "low"]),
      cultural_adaptation: z.enum(["strict", "moderate", "flexible"]),
    }),
    interaction_history: z.object({
      total_interactions: z.number().min(0),
      positive_feedback_rate: z.number().min(0).max(1),
      cultural_compliance_rate: z.number().min(0).max(1),
      preferred_topics: z.array(z.string()),
      avoided_topics: z.array(z.string()),
    }),
  }),
  cultural: z.any(), // IraqiCulturalContext
  professional: z
    .object({
      domain: z.string(),
      expertise_level: z.enum(["novice", "intermediate", "expert"]),
      institution_type: z.enum([
        "academic",
        "government",
        "private",
        "religious",
      ]),
    })
    .optional(),
  temporal: z.object({
    timestamp: z.date(),
    session_duration: z.number().optional(),
    time_of_day: z.enum(["morning", "afternoon", "evening", "night"]),
    day_of_week: z.enum(["weekday", "weekend"]),
    islamic_calendar: z
      .object({
        month: z.string(),
        is_holy_month: z.boolean(),
        is_holy_day: z.boolean(),
      })
      .optional(),
  }),
  interaction: z.object({
    channel: z.enum(["chat", "document", "voice", "api"]),
    device_type: z.enum(["mobile", "tablet", "desktop", "server"]),
    network_quality: z.enum(["high", "medium", "low"]),
    privacy_level: z.enum(["public", "private", "confidential"]),
  }),
});

/**
 * Cultural Learning Feedback Schema
 */
export const CulturalLearningFeedbackSchema = z.object({
  feedback_id: z.string(),
  timestamp: z.date(),
  source: z.enum([
    "explicit_positive",
    "explicit_negative",
    "implicit_engagement",
    "implicit_avoidance",
    "cultural_validator",
    "expert_review",
    "peer_consensus",
    "behavioral_pattern",
  ]),
  interaction_id: z.string(),
  content_snippet: z.string(),
  cultural_context: CulturalLearningContextSchema,
  feedback: z.object({
    overall_rating: z.number().min(0).max(100),
    dimensions: z.object({
      cultural_appropriateness: z.number().min(0).max(100),
      islamic_compliance: z.number().min(0).max(100),
      language_quality: z.number().min(0).max(100),
      professional_relevance: z.number().min(0).max(100),
      helpfulness: z.number().min(0).max(100),
      accuracy: z.number().min(0).max(100),
    }),
    specific_issues: z.array(
      z.object({
        category: z.enum([
          "cultural",
          "religious",
          "linguistic",
          "professional",
          "factual",
        ]),
        severity: z.enum(["minor", "moderate", "major", "critical"]),
        description: z.string(),
        suggestion: z.string().optional(),
      }),
    ),
    positive_aspects: z.array(z.string()),
  }),
  learning_signals: z.object({
    confidence: z.number().min(0).max(1),
    weight: z.number().min(0).max(1),
    priority: z.enum(["low", "medium", "high", "critical"]),
    should_retrain: z.boolean(),
  }),
  validation: z.object({
    is_validated: z.boolean(),
    validator_id: z.string().optional(),
    validation_confidence: z.number().min(0).max(1).optional(),
    cross_validated: z.boolean().optional(),
  }),
});

// ========================================================================================
// ERROR TYPES
// ========================================================================================

/**
 * Cultural Learning Error
 */
export interface CulturalLearningError {
  code: string;
  message: string;
  category: "data" | "model" | "inference" | "validation" | "configuration";
  severity: "low" | "medium" | "high" | "critical";
  details?: Record<string, any>;
  timestamp: Date;
}

/**
 * Cultural Learning Exception
 */
export class CulturalLearningException extends Error {
  constructor(
    public readonly learningError: CulturalLearningError,
    message?: string,
  ) {
    super(message || learningError.message);
    this.name = "CulturalLearningException";
  }
}

// ========================================================================================
// EXPORT TYPES
// ========================================================================================

export type {
  CulturalLearningModelType,
  CulturalFeedbackType,
  CulturalLearningContext,
  CulturalFeatureVector,
  CulturalLearningFeedback,
  CulturalModelPerformance,
  CulturalLearningConfig,
  IslamicComplianceLearning,
  ProfessionalAdaptationLearning,
};
