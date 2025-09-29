// @iraqi-ai/types - Shared TypeScript types for Iraqi AI Chat System
// Unified type definitions ensuring consistency across all Iraqi AI components

import { z } from "zod";

// Base Cultural Context Types
export interface IraqiCulturalContext {
  user_context: {
    cultural_background: "iraqi" | "arab" | "middle_eastern" | "international";
    religious_affiliation:
      | "muslim"
      | "christian"
      | "other"
      | "prefer_not_to_say";
    language_preference: "arabic" | "english" | "mixed";
    regional_dialect?:
      | "baghdadi"
      | "basri"
      | "mosuli"
      | "southern"
      | "northern";
  };
  interaction_context: {
    formality_level: "very_formal" | "formal" | "semi_formal" | "casual";
    professional_domain?: IraqiProfessionalDomain;
    communication_style: "direct" | "indirect" | "diplomatic";
    sensitivity_level: "standard" | "high" | "maximum";
  };
  temporal_context: {
    prayer_time_awareness?: boolean;
    ramadan_mode?: boolean;
    cultural_holidays?: string[];
    local_time_zone: string;
  };
}

// Professional Domain Types
export type IraqiProfessionalDomain =
  | "legal"
  | "medical"
  | "educational"
  | "engineering"
  | "business"
  | "religious"
  | "governmental"
  | "media"
  | "arts"
  | "agriculture";

// Islamic Compliance Types
export type IslamicComplianceLevel =
  | "halal" // Permissible
  | "haram" // Forbidden
  | "makruh" // Disliked
  | "mustahabb" // Recommended
  | "mubah"; // Neutral

export interface IslamicComplianceResult {
  compliance_level: IslamicComplianceLevel;
  confidence_score: number;
  reasoning: string;
  considerations: string[];
  recommendations?: string[];
  scholarly_references?: string[];
}

// Language and Dialect Types
export type ArabicDialect =
  | "iraqi"
  | "levantine"
  | "gulf"
  | "egyptian"
  | "maghrebi"
  | "standard_arabic";

export interface ArabicProcessingResult {
  detected_dialect: ArabicDialect;
  confidence_score: number;
  cultural_context_indicators: string[];
  linguistic_features: {
    formality_level: "formal" | "informal" | "mixed";
    emotional_tone: "positive" | "negative" | "neutral" | "mixed";
    discourse_markers: string[];
  };
  rtl_requirements: {
    text_direction: "rtl" | "ltr" | "mixed";
    alignment_suggestions: string[];
    font_recommendations: string[];
  };
}

// Cultural Decision Types
export interface CulturalDecisionRequest {
  content: string;
  context: IraqiCulturalContext;
  decision_type:
    | "content_approval"
    | "cultural_adaptation"
    | "professional_validation";
  urgency_level: "low" | "medium" | "high" | "critical";
}

export interface CulturalDecisionResponse {
  decision: "approved" | "rejected" | "requires_modification";
  confidence_score: number;
  cultural_appropriateness_score: number;
  islamic_compliance: IslamicComplianceResult;
  professional_compliance_score?: number;
  recommendations: string[];
  modifications_needed: string[];
  cultural_insights: string[];
  estimated_user_acceptance: number;
}

// Agent Communication Types
export interface IraqiAgentMessage {
  id: string;
  sender_agent_id: string;
  recipient_agent_id?: string;
  message_type:
    | "request"
    | "response"
    | "notification"
    | "cultural_validation"
    | "arabic_processing";
  content: string;
  cultural_context: IraqiCulturalContext;
  priority: "low" | "medium" | "high" | "critical";
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface IraqiAgentCapabilities {
  cultural_validation: boolean;
  arabic_processing: boolean;
  professional_domain_expertise: IraqiProfessionalDomain[];
  islamic_compliance_validation: boolean;
  dialect_recognition: ArabicDialect[];
  performance_targets: {
    response_time_ms: number;
    accuracy_percentage: number;
    cultural_compliance_percentage: number;
  };
}

// Performance and Metrics Types
export interface IraqiSystemMetrics {
  cultural_validation_metrics: {
    average_response_time_ms: number;
    accuracy_rate: number;
    islamic_compliance_rate: number;
    user_satisfaction_score: number;
  };
  arabic_processing_metrics: {
    dialect_recognition_accuracy: number;
    rtl_rendering_success_rate: number;
    mixed_language_handling_score: number;
  };
  professional_domain_metrics: {
    [K in IraqiProfessionalDomain]: {
      validation_accuracy: number;
      domain_expertise_score: number;
      user_trust_score: number;
    };
  };
  system_performance: {
    total_requests_processed: number;
    average_processing_time_ms: number;
    error_rate: number;
    uptime_percentage: number;
  };
}

// Payment Integration Types (Iraqi Specific)
export type IraqiPaymentProvider = "zain_cash" | "fast_pay" | "nass_wallet";

export interface IraqiPaymentConfiguration {
  provider: IraqiPaymentProvider;
  minimum_amount: number; // In Iraqi Dinar
  maximum_amount: number;
  cultural_considerations: {
    islamic_finance_compliance: boolean;
    supported_transaction_types: string[];
    restricted_categories: string[];
  };
  technical_configuration: {
    api_endpoint: string;
    timeout_ms: number;
    retry_attempts: number;
    security_requirements: string[];
  };
}

// Validation Schemas using Zod
export const IraqiCulturalContextSchema = z.object({
  user_context: z.object({
    cultural_background: z.enum([
      "iraqi",
      "arab",
      "middle_eastern",
      "international",
    ]),
    religious_affiliation: z.enum([
      "muslim",
      "christian",
      "other",
      "prefer_not_to_say",
    ]),
    language_preference: z.enum(["arabic", "english", "mixed"]),
    regional_dialect: z
      .enum(["baghdadi", "basri", "mosuli", "southern", "northern"])
      .optional(),
  }),
  interaction_context: z.object({
    formality_level: z.enum(["very_formal", "formal", "semi_formal", "casual"]),
    professional_domain: z
      .enum([
        "legal",
        "medical",
        "educational",
        "engineering",
        "business",
        "religious",
        "governmental",
        "media",
        "arts",
        "agriculture",
      ])
      .optional(),
    communication_style: z.enum(["direct", "indirect", "diplomatic"]),
    sensitivity_level: z.enum(["standard", "high", "maximum"]),
  }),
  temporal_context: z.object({
    prayer_time_awareness: z.boolean().optional(),
    ramadan_mode: z.boolean().optional(),
    cultural_holidays: z.array(z.string()).optional(),
    local_time_zone: z.string(),
  }),
});

export const CulturalDecisionRequestSchema = z.object({
  content: z.string().min(1),
  context: IraqiCulturalContextSchema,
  decision_type: z.enum([
    "content_approval",
    "cultural_adaptation",
    "professional_validation",
  ]),
  urgency_level: z.enum(["low", "medium", "high", "critical"]),
});

// Error Types
export class IraqiAIError extends Error {
  constructor(
    message: string,
    public code: string,
    public cultural_context?: IraqiCulturalContext,
    public details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "IraqiAIError";
  }
}

export class CulturalComplianceError extends IraqiAIError {
  constructor(
    message: string,
    public compliance_violations: string[],
    cultural_context?: IraqiCulturalContext,
  ) {
    super(message, "CULTURAL_COMPLIANCE_ERROR", cultural_context, {
      compliance_violations,
    });
    this.name = "CulturalComplianceError";
  }
}

export class ArabicProcessingError extends IraqiAIError {
  constructor(
    message: string,
    public processing_stage: string,
    cultural_context?: IraqiCulturalContext,
  ) {
    super(message, "ARABIC_PROCESSING_ERROR", cultural_context, {
      processing_stage,
    });
    this.name = "ArabicProcessingError";
  }
}

// Export all types and schemas
export * from "./types/agent-types";
export * from "./types/cultural-types";
export * from "./types/arabic-types";
export * from "./types/professional-types";

// Re-export zod for consistent validation across packages
export { z } from "zod";
