/**
 * Iraqi AG-UI Event System
 *
 * Enhanced AG-UI event system with Iraqi cultural sovereignty,
 * Arabic language support, and Islamic compliance integration.
 *
 * Features:
 * - Real-time event streaming with cultural validation
 * - Arabic text event processing
 * - Islamic compliance event monitoring
 * - Cultural interaction event handling
 * - Iraqi professional domain events
 * - Payment gateway event integration
 */

import { z } from "zod";

// Base AG-UI Event Types (Enhanced for Iraqi Context)
export enum IraqiEventType {
  // Core Text Message Events
  TEXT_MESSAGE_START = "TEXT_MESSAGE_START",
  TEXT_MESSAGE_CONTENT = "TEXT_MESSAGE_CONTENT",
  TEXT_MESSAGE_END = "TEXT_MESSAGE_END",
  TEXT_MESSAGE_CHUNK = "TEXT_MESSAGE_CHUNK",

  // Thinking Events
  THINKING_TEXT_MESSAGE_START = "THINKING_TEXT_MESSAGE_START",
  THINKING_TEXT_MESSAGE_CONTENT = "THINKING_TEXT_MESSAGE_CONTENT",
  THINKING_TEXT_MESSAGE_END = "THINKING_TEXT_MESSAGE_END",
  THINKING_START = "THINKING_START",
  THINKING_END = "THINKING_END",

  // Tool Call Events
  TOOL_CALL_START = "TOOL_CALL_START",
  TOOL_CALL_ARGS = "TOOL_CALL_ARGS",
  TOOL_CALL_END = "TOOL_CALL_END",
  TOOL_CALL_CHUNK = "TOOL_CALL_CHUNK",
  TOOL_CALL_RESULT = "TOOL_CALL_RESULT",

  // State Management Events
  STATE_SNAPSHOT = "STATE_SNAPSHOT",
  STATE_DELTA = "STATE_DELTA",
  MESSAGES_SNAPSHOT = "MESSAGES_SNAPSHOT",

  // Run Lifecycle Events
  RUN_STARTED = "RUN_STARTED",
  RUN_FINISHED = "RUN_FINISHED",
  RUN_ERROR = "RUN_ERROR",
  STEP_STARTED = "STEP_STARTED",
  STEP_FINISHED = "STEP_FINISHED",

  // Generic Events
  RAW = "RAW",
  CUSTOM = "CUSTOM",

  // Iraqi Cultural Events
  CULTURAL_VALIDATION_START = "CULTURAL_VALIDATION_START",
  CULTURAL_VALIDATION_RESULT = "CULTURAL_VALIDATION_RESULT",
  CULTURAL_VALIDATION_END = "CULTURAL_VALIDATION_END",
  ISLAMIC_COMPLIANCE_CHECK = "ISLAMIC_COMPLIANCE_CHECK",
  ISLAMIC_COMPLIANCE_RESULT = "ISLAMIC_COMPLIANCE_RESULT",
  ARABIC_TEXT_PROCESSING_START = "ARABIC_TEXT_PROCESSING_START",
  ARABIC_TEXT_PROCESSING_RESULT = "ARABIC_TEXT_PROCESSING_RESULT",
  ARABIC_TEXT_PROCESSING_END = "ARABIC_TEXT_PROCESSING_END",

  // Professional Domain Events
  PROFESSIONAL_DOMAIN_REQUEST = "PROFESSIONAL_DOMAIN_REQUEST",
  PROFESSIONAL_DOMAIN_RESPONSE = "PROFESSIONAL_DOMAIN_RESPONSE",
  LEGAL_CONSULTATION_START = "LEGAL_CONSULTATION_START",
  LEGAL_CONSULTATION_END = "LEGAL_CONSULTATION_END",
  MEDICAL_CONSULTATION_START = "MEDICAL_CONSULTATION_START",
  MEDICAL_CONSULTATION_END = "MEDICAL_CONSULTATION_END",

  // Payment Gateway Events
  PAYMENT_PROCESSING_START = "PAYMENT_PROCESSING_START",
  PAYMENT_PROCESSING_RESULT = "PAYMENT_PROCESSING_RESULT",
  PAYMENT_PROCESSING_END = "PAYMENT_PROCESSING_END",
  PAYMENT_GATEWAY_SELECTION = "PAYMENT_GATEWAY_SELECTION",
  PAYMENT_VALIDATION_RESULT = "PAYMENT_VALIDATION_RESULT",

  // Agent Coordination Events
  AGENT_COORDINATION_START = "AGENT_COORDINATION_START",
  AGENT_COORDINATION_ROUTING = "AGENT_COORDINATION_ROUTING",
  AGENT_COORDINATION_RESULT = "AGENT_COORDINATION_RESULT",
  AGENT_COORDINATION_END = "AGENT_COORDINATION_END",
  MULTI_AGENT_WORKFLOW_START = "MULTI_AGENT_WORKFLOW_START",
  MULTI_AGENT_WORKFLOW_END = "MULTI_AGENT_WORKFLOW_END",

  // RTL Processing Events
  RTL_LAYOUT_ADJUSTMENT = "RTL_LAYOUT_ADJUSTMENT",
  ARABIC_FONT_RENDERING = "ARABIC_FONT_RENDERING",
  MIXED_CONTENT_PROCESSING = "MIXED_CONTENT_PROCESSING",
  DIALECT_RECOGNITION_RESULT = "DIALECT_RECOGNITION_RESULT",
}

// Base Iraqi Event Schema
const BaseIraqiEventSchema = z.object({
  type: z.nativeEnum(IraqiEventType),
  timestamp: z.number().optional(),
  rawEvent: z.any().optional(),
  culturalContext: z
    .object({
      culturalScore: z.number().optional(),
      islamicCompliance: z.boolean().optional(),
      arabicProcessing: z.boolean().optional(),
      professionalDomain: z.string().optional(),
    })
    .optional(),
  metadata: z.record(z.any()).optional(),
});

// Enhanced Text Message Events with Iraqi Context
export const IraqiTextMessageStartEventSchema = BaseIraqiEventSchema.extend({
  type: z.literal(IraqiEventType.TEXT_MESSAGE_START),
  messageId: z.string(),
  role: z.literal("assistant"),
  culturalValidation: z.boolean().optional(),
  arabicContent: z.boolean().optional(),
  direction: z.enum(["ltr", "rtl", "auto"]).optional(),
});

export const IraqiTextMessageContentEventSchema = BaseIraqiEventSchema.extend({
  type: z.literal(IraqiEventType.TEXT_MESSAGE_CONTENT),
  messageId: z.string(),
  delta: z
    .string()
    .refine((s) => s.length > 0, "Delta must not be an empty string"),
  isArabic: z.boolean().optional(),
  dialectFeatures: z.array(z.string()).optional(),
  culturallyValidated: z.boolean().optional(),
});

export const IraqiTextMessageEndEventSchema = BaseIraqiEventSchema.extend({
  type: z.literal(IraqiEventType.TEXT_MESSAGE_END),
  messageId: z.string(),
  finalCulturalScore: z.number().optional(),
  islamicCompliant: z.boolean().optional(),
});

// Cultural Validation Events
export const CulturalValidationStartEventSchema = BaseIraqiEventSchema.extend({
  type: z.literal(IraqiEventType.CULTURAL_VALIDATION_START),
  validationId: z.string(),
  content: z.string(),
  strictMode: z.boolean().optional(),
  professionalDomain: z.string().optional(),
});

export const CulturalValidationResultEventSchema = BaseIraqiEventSchema.extend({
  type: z.literal(IraqiEventType.CULTURAL_VALIDATION_RESULT),
  validationId: z.string(),
  score: z.number(),
  approved: z.boolean(),
  issues: z.array(z.string()),
  recommendations: z.array(z.string()),
  categories: z.object({
    religious: z.number(),
    social: z.number(),
    professional: z.number(),
    linguistic: z.number(),
  }),
});

export const CulturalValidationEndEventSchema = BaseIraqiEventSchema.extend({
  type: z.literal(IraqiEventType.CULTURAL_VALIDATION_END),
  validationId: z.string(),
  finalScore: z.number(),
  processingTime: z.number(),
});

// Islamic Compliance Events
export const IslamicComplianceCheckEventSchema = BaseIraqiEventSchema.extend({
  type: z.literal(IraqiEventType.ISLAMIC_COMPLIANCE_CHECK),
  checkId: z.string(),
  content: z.string(),
  domain: z.string().optional(),
  strictInterpretation: z.boolean().optional(),
});

export const IslamicComplianceResultEventSchema = BaseIraqiEventSchema.extend({
  type: z.literal(IraqiEventType.ISLAMIC_COMPLIANCE_RESULT),
  checkId: z.string(),
  compliant: z.boolean(),
  score: z.number(),
  violations: z.array(z.string()),
  recommendations: z.array(z.string()),
  principles: z.object({
    fundamental: z.number(),
    ethical: z.number(),
    commercial: z.number(),
    social: z.number(),
  }),
});

// Arabic Text Processing Events
export const ArabicTextProcessingStartEventSchema = BaseIraqiEventSchema.extend(
  {
    type: z.literal(IraqiEventType.ARABIC_TEXT_PROCESSING_START),
    processingId: z.string(),
    text: z.string(),
    processingType: z.enum([
      "rtl_layout",
      "dialect_detection",
      "mixed_content",
      "font_rendering",
    ]),
  },
);

export const ArabicTextProcessingResultEventSchema =
  BaseIraqiEventSchema.extend({
    type: z.literal(IraqiEventType.ARABIC_TEXT_PROCESSING_RESULT),
    processingId: z.string(),
    processedText: z.string().optional(),
    direction: z.enum(["ltr", "rtl", "auto"]),
    dialectFeatures: z.array(z.string()).optional(),
    mixedContent: z
      .object({
        hasArabic: z.boolean(),
        hasEnglish: z.boolean(),
        segments: z.array(
          z.object({
            text: z.string(),
            direction: z.enum(["ltr", "rtl"]),
            language: z.enum(["ar", "en"]),
          }),
        ),
      })
      .optional(),
    confidence: z.number(),
  });

export const ArabicTextProcessingEndEventSchema = BaseIraqiEventSchema.extend({
  type: z.literal(IraqiEventType.ARABIC_TEXT_PROCESSING_END),
  processingId: z.string(),
  success: z.boolean(),
  processingTime: z.number(),
});

// Professional Domain Events
export const ProfessionalDomainRequestEventSchema = BaseIraqiEventSchema.extend(
  {
    type: z.literal(IraqiEventType.PROFESSIONAL_DOMAIN_REQUEST),
    requestId: z.string(),
    domain: z.enum(["legal", "medical", "educational", "organizational"]),
    query: z.string(),
    islamicConsiderations: z.boolean().optional(),
    urgencyLevel: z.enum(["low", "medium", "high", "critical"]).optional(),
  },
);

export const ProfessionalDomainResponseEventSchema =
  BaseIraqiEventSchema.extend({
    type: z.literal(IraqiEventType.PROFESSIONAL_DOMAIN_RESPONSE),
    requestId: z.string(),
    domain: z.string(),
    response: z.string(),
    confidence: z.number(),
    islamicCompliant: z.boolean(),
    sources: z.array(z.string()),
    recommendations: z.array(z.string()),
  });

// Payment Gateway Events
export const PaymentProcessingStartEventSchema = BaseIraqiEventSchema.extend({
  type: z.literal(IraqiEventType.PAYMENT_PROCESSING_START),
  transactionId: z.string(),
  amount: z.number(),
  currency: z.literal("IQD"),
  gateway: z.enum(["zainCash", "fastPay", "nassWallet"]).optional(),
  islamicCompliant: z.boolean().optional(),
});

export const PaymentProcessingResultEventSchema = BaseIraqiEventSchema.extend({
  type: z.literal(IraqiEventType.PAYMENT_PROCESSING_RESULT),
  transactionId: z.string(),
  success: z.boolean(),
  gateway: z.string(),
  paymentUrl: z.string().optional(),
  status: z.enum(["pending", "completed", "failed", "cancelled"]),
  islamicCompliant: z.boolean(),
});

export const PaymentValidationResultEventSchema = BaseIraqiEventSchema.extend({
  type: z.literal(IraqiEventType.PAYMENT_VALIDATION_RESULT),
  transactionId: z.string(),
  isValid: z.boolean(),
  islamicCompliant: z.boolean(),
  securityScore: z.number(),
  issues: z.array(z.string()),
  recommendations: z.array(z.string()),
});

// Agent Coordination Events
export const AgentCoordinationStartEventSchema = BaseIraqiEventSchema.extend({
  type: z.literal(IraqiEventType.AGENT_COORDINATION_START),
  coordinationId: z.string(),
  requestType: z.string(),
  priority: z.enum(["low", "medium", "high", "critical"]),
  culturalValidation: z.boolean(),
  requiresMultiAgent: z.boolean().optional(),
});

export const AgentCoordinationRoutingEventSchema = BaseIraqiEventSchema.extend({
  type: z.literal(IraqiEventType.AGENT_COORDINATION_ROUTING),
  coordinationId: z.string(),
  selectedAgent: z.string(),
  agentCapabilities: z.object({
    culturalExpertise: z.number(),
    islamicCompliance: z.number(),
    arabicProficiency: z.number(),
  }),
  routingReason: z.string(),
});

export const AgentCoordinationResultEventSchema = BaseIraqiEventSchema.extend({
  type: z.literal(IraqiEventType.AGENT_COORDINATION_RESULT),
  coordinationId: z.string(),
  agentId: z.string(),
  success: z.boolean(),
  culturalScore: z.number(),
  islamicScore: z.number(),
  confidence: z.number(),
  responseTime: z.number(),
});

// Multi-Agent Workflow Events
export const MultiAgentWorkflowStartEventSchema = BaseIraqiEventSchema.extend({
  type: z.literal(IraqiEventType.MULTI_AGENT_WORKFLOW_START),
  workflowId: z.string(),
  pattern: z.string(),
  agentSequence: z.array(z.string()),
  culturalCheckpoints: z.array(z.number()),
});

export const MultiAgentWorkflowEndEventSchema = BaseIraqiEventSchema.extend({
  type: z.literal(IraqiEventType.MULTI_AGENT_WORKFLOW_END),
  workflowId: z.string(),
  success: z.boolean(),
  totalAgents: z.number(),
  executionTime: z.number(),
  overallCulturalScore: z.number(),
});

// RTL Processing Events
export const RTLLayoutAdjustmentEventSchema = BaseIraqiEventSchema.extend({
  type: z.literal(IraqiEventType.RTL_LAYOUT_ADJUSTMENT),
  elementId: z.string(),
  originalDirection: z.enum(["ltr", "rtl", "auto"]),
  adjustedDirection: z.enum(["ltr", "rtl", "auto"]),
  cssAdjustments: z.record(z.string()),
});

export const ArabicFontRenderingEventSchema = BaseIraqiEventSchema.extend({
  type: z.literal(IraqiEventType.ARABIC_FONT_RENDERING),
  elementId: z.string(),
  fontFamily: z.string(),
  textContent: z.string(),
  renderingOptions: z.object({
    shaping: z.boolean(),
    ligatures: z.boolean(),
    diacritics: z.boolean(),
  }),
});

export const MixedContentProcessingEventSchema = BaseIraqiEventSchema.extend({
  type: z.literal(IraqiEventType.MIXED_CONTENT_PROCESSING),
  contentId: z.string(),
  segments: z.array(
    z.object({
      text: z.string(),
      direction: z.enum(["ltr", "rtl"]),
      language: z.enum(["ar", "en"]),
      startIndex: z.number(),
      endIndex: z.number(),
    }),
  ),
  overallDirection: z.enum(["ltr", "rtl", "auto"]),
});

export const DialectRecognitionResultEventSchema = BaseIraqiEventSchema.extend({
  type: z.literal(IraqiEventType.DIALECT_RECOGNITION_RESULT),
  analysisId: z.string(),
  text: z.string(),
  dialect: z.string(),
  confidence: z.number(),
  features: z.object({
    phonetic: z.array(z.string()),
    lexical: z.array(z.string()),
    syntactic: z.array(z.string()),
    expressions: z.array(z.string()),
  }),
  isIraqiDialect: z.boolean(),
});

// Enhanced Event Schemas Union
export const IraqiEventSchemas = z.discriminatedUnion("type", [
  // Core AG-UI Events
  IraqiTextMessageStartEventSchema,
  IraqiTextMessageContentEventSchema,
  IraqiTextMessageEndEventSchema,

  // Iraqi Cultural Events
  CulturalValidationStartEventSchema,
  CulturalValidationResultEventSchema,
  CulturalValidationEndEventSchema,
  IslamicComplianceCheckEventSchema,
  IslamicComplianceResultEventSchema,

  // Arabic Processing Events
  ArabicTextProcessingStartEventSchema,
  ArabicTextProcessingResultEventSchema,
  ArabicTextProcessingEndEventSchema,
  RTLLayoutAdjustmentEventSchema,
  ArabicFontRenderingEventSchema,
  MixedContentProcessingEventSchema,
  DialectRecognitionResultEventSchema,

  // Professional Domain Events
  ProfessionalDomainRequestEventSchema,
  ProfessionalDomainResponseEventSchema,

  // Payment Events
  PaymentProcessingStartEventSchema,
  PaymentProcessingResultEventSchema,
  PaymentValidationResultEventSchema,

  // Agent Coordination Events
  AgentCoordinationStartEventSchema,
  AgentCoordinationRoutingEventSchema,
  AgentCoordinationResultEventSchema,
  MultiAgentWorkflowStartEventSchema,
  MultiAgentWorkflowEndEventSchema,
]);

// Type Exports
export type BaseIraqiEvent = z.infer<typeof BaseIraqiEventSchema>;
export type IraqiTextMessageStartEvent = z.infer<
  typeof IraqiTextMessageStartEventSchema
>;
export type IraqiTextMessageContentEvent = z.infer<
  typeof IraqiTextMessageContentEventSchema
>;
export type IraqiTextMessageEndEvent = z.infer<
  typeof IraqiTextMessageEndEventSchema
>;
export type CulturalValidationStartEvent = z.infer<
  typeof CulturalValidationStartEventSchema
>;
export type CulturalValidationResultEvent = z.infer<
  typeof CulturalValidationResultEventSchema
>;
export type CulturalValidationEndEvent = z.infer<
  typeof CulturalValidationEndEventSchema
>;
export type IslamicComplianceCheckEvent = z.infer<
  typeof IslamicComplianceCheckEventSchema
>;
export type IslamicComplianceResultEvent = z.infer<
  typeof IslamicComplianceResultEventSchema
>;
export type ArabicTextProcessingStartEvent = z.infer<
  typeof ArabicTextProcessingStartEventSchema
>;
export type ArabicTextProcessingResultEvent = z.infer<
  typeof ArabicTextProcessingResultEventSchema
>;
export type ArabicTextProcessingEndEvent = z.infer<
  typeof ArabicTextProcessingEndEventSchema
>;
export type ProfessionalDomainRequestEvent = z.infer<
  typeof ProfessionalDomainRequestEventSchema
>;
export type ProfessionalDomainResponseEvent = z.infer<
  typeof ProfessionalDomainResponseEventSchema
>;
export type PaymentProcessingStartEvent = z.infer<
  typeof PaymentProcessingStartEventSchema
>;
export type PaymentProcessingResultEvent = z.infer<
  typeof PaymentProcessingResultEventSchema
>;
export type PaymentValidationResultEvent = z.infer<
  typeof PaymentValidationResultEventSchema
>;
export type AgentCoordinationStartEvent = z.infer<
  typeof AgentCoordinationStartEventSchema
>;
export type AgentCoordinationRoutingEvent = z.infer<
  typeof AgentCoordinationRoutingEventSchema
>;
export type AgentCoordinationResultEvent = z.infer<
  typeof AgentCoordinationResultEventSchema
>;
export type MultiAgentWorkflowStartEvent = z.infer<
  typeof MultiAgentWorkflowStartEventSchema
>;
export type MultiAgentWorkflowEndEvent = z.infer<
  typeof MultiAgentWorkflowEndEventSchema
>;
export type RTLLayoutAdjustmentEvent = z.infer<
  typeof RTLLayoutAdjustmentEventSchema
>;
export type ArabicFontRenderingEvent = z.infer<
  typeof ArabicFontRenderingEventSchema
>;
export type MixedContentProcessingEvent = z.infer<
  typeof MixedContentProcessingEventSchema
>;
export type DialectRecognitionResultEvent = z.infer<
  typeof DialectRecognitionResultEventSchema
>;

// Union type for all Iraqi events
export type IraqiEvent = z.infer<typeof IraqiEventSchemas>;

/**
 * Iraqi Event Bus for handling real-time events with cultural context
 */
export class IraqiEventBus {
  private listeners: Map<IraqiEventType, Set<(event: IraqiEvent) => void>> =
    new Map();
  private eventHistory: IraqiEvent[] = [];
  private maxHistorySize = 1000;

  /**
   * Subscribe to specific event types
   */
  on(eventType: IraqiEventType, listener: (event: IraqiEvent) => void): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(listener);
  }

  /**
   * Unsubscribe from event types
   */
  off(eventType: IraqiEventType, listener: (event: IraqiEvent) => void): void {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.delete(listener);
    }
  }

  /**
   * Emit events with cultural context validation
   */
  emit(event: IraqiEvent): void {
    // Add timestamp if not present
    if (!event.timestamp) {
      event.timestamp = Date.now();
    }

    // Store in history
    this.eventHistory.push(event);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }

    // Notify listeners
    const listeners = this.listeners.get(event.type);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(event);
        } catch (error) {
          console.error(`Error in event listener for ${event.type}:`, error);
        }
      });
    }
  }

  /**
   * Get event history filtered by type
   */
  getEventHistory(eventType?: IraqiEventType): IraqiEvent[] {
    if (eventType) {
      return this.eventHistory.filter((event) => event.type === eventType);
    }
    return [...this.eventHistory];
  }

  /**
   * Clear event history
   */
  clearHistory(): void {
    this.eventHistory = [];
  }

  /**
   * Get active listeners count
   */
  getListenerCount(eventType?: IraqiEventType): number {
    if (eventType) {
      return this.listeners.get(eventType)?.size || 0;
    }
    return Array.from(this.listeners.values()).reduce(
      (total, listeners) => total + listeners.size,
      0,
    );
  }
}

/**
 * Global Iraqi Event Bus instance
 */
export const iraqiEventBus = new IraqiEventBus();

/**
 * Utility functions for Iraqi events
 */
export const IraqiEventUtils = {
  /**
   * Create cultural validation event
   */
  createCulturalValidationEvent: (
    validationId: string,
    content: string,
    options?: { strictMode?: boolean; professionalDomain?: string },
  ): CulturalValidationStartEvent => ({
    type: IraqiEventType.CULTURAL_VALIDATION_START,
    validationId,
    content,
    strictMode: options?.strictMode,
    professionalDomain: options?.professionalDomain,
    timestamp: Date.now(),
  }),

  /**
   * Create Arabic text processing event
   */
  createArabicProcessingEvent: (
    processingId: string,
    text: string,
    processingType:
      | "rtl_layout"
      | "dialect_detection"
      | "mixed_content"
      | "font_rendering",
  ): ArabicTextProcessingStartEvent => ({
    type: IraqiEventType.ARABIC_TEXT_PROCESSING_START,
    processingId,
    text,
    processingType,
    timestamp: Date.now(),
  }),

  /**
   * Create payment processing event
   */
  createPaymentEvent: (
    transactionId: string,
    amount: number,
    options?: {
      gateway?: "zainCash" | "fastPay" | "nassWallet";
      islamicCompliant?: boolean;
    },
  ): PaymentProcessingStartEvent => ({
    type: IraqiEventType.PAYMENT_PROCESSING_START,
    transactionId,
    amount,
    currency: "IQD",
    gateway: options?.gateway,
    islamicCompliant: options?.islamicCompliant,
    timestamp: Date.now(),
  }),

  /**
   * Validate event cultural context
   */
  validateCulturalContext: (event: IraqiEvent): boolean => {
    return (
      event.culturalContext !== undefined &&
      event.culturalContext.culturalScore !== undefined &&
      event.culturalContext.culturalScore >= 85
    );
  },

  /**
   * Check if event requires Islamic compliance
   */
  requiresIslamicCompliance: (event: IraqiEvent): boolean => {
    const islamicEvents = [
      IraqiEventType.ISLAMIC_COMPLIANCE_CHECK,
      IraqiEventType.ISLAMIC_COMPLIANCE_RESULT,
      IraqiEventType.PAYMENT_PROCESSING_START,
      IraqiEventType.PROFESSIONAL_DOMAIN_REQUEST,
    ];
    return islamicEvents.includes(event.type);
  },
};
