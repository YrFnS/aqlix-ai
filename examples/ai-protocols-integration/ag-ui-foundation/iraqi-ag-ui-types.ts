/**
 * Iraqi-Enhanced AG-UI Type Definitions
 *
 * Core message schemas and tool call types for AI-frontend interaction
 * Based on AG-UI TypeScript SDK with Iraqi cultural sovereignty and Islamic compliance
 *
 * Extracted from: reference/ag-ui/typescript-sdk/packages/core/src/types.ts
 * Enhanced with: Cultural validation, Arabic RTL support, Islamic compliance
 *
 * Cultural Requirements:
 * - Islamic compliance: 90%+ accuracy for religious content validation
 * - Arabic support: 99%+ RTL accuracy, 85%+ Iraqi dialect recognition
 * - Cultural validation: 95%+ appropriateness for Iraqi professional contexts
 * - Professional domains: Legal, medical, educational, business support
 */

import { z } from "zod";

// Core Function Call Schema with Cultural Context
export const IraqiFunctionCallSchema = z.object({
  name: z.string(),
  arguments: z.string(),
  // Cultural enhancements
  culturalContext: z
    .object({
      islamicCompliant: z.boolean().default(true),
      culturallyAppropriate: z.boolean().default(true),
      arabicSupported: z.boolean().default(false),
      professionalDomain: z
        .enum([
          "legal",
          "medical",
          "educational",
          "business",
          "technology",
          "finance",
          "general",
        ])
        .optional(),
    })
    .optional(),
});

// Enhanced Tool Call Schema with Iraqi Context
export const IraqiToolCallSchema = z.object({
  id: z.string(),
  type: z.literal("function"),
  function: IraqiFunctionCallSchema,
  // Iraqi enhancements
  culturalValidation: z
    .object({
      validated: z.boolean().default(false),
      islamicScore: z.number().min(0).max(100).optional(),
      culturalScore: z.number().min(0).max(100).optional(),
      validatedAt: z.string().optional(),
      validatedBy: z.string().optional(),
    })
    .optional(),
});

// Base Message Schema with Cultural Extensions
export const IraqiBaseMessageSchema = z.object({
  id: z.string(),
  role: z.string(),
  content: z.string().optional(),
  name: z.string().optional(),
  // Cultural metadata
  culturalMetadata: z
    .object({
      // Language detection and support
      language: z.enum(["arabic", "english", "mixed"]).default("english"),
      dialect: z.enum(["iraqi", "standard", "mixed"]).optional(),
      rtlRequired: z.boolean().default(false),

      // Cultural validation
      culturallyValidated: z.boolean().default(false),
      islamicCompliant: z.boolean().default(true),

      // Professional context
      professionalDomain: z
        .enum([
          "legal",
          "medical",
          "educational",
          "business",
          "technology",
          "finance",
          "general",
        ])
        .optional(),

      // Timestamps
      createdAt: z.string().default(() => new Date().toISOString()),
      validatedAt: z.string().optional(),
    })
    .optional(),
});

// Developer Message Schema with Iraqi Enhancements
export const IraqiDeveloperMessageSchema = IraqiBaseMessageSchema.extend({
  role: z.literal("developer"),
  content: z.string(),
  // Developer-specific cultural context
  developerContext: z
    .object({
      codeLanguage: z.string().optional(),
      frameworkUsed: z.string().optional(),
      culturalPatterns: z.array(z.string()).optional(),
      islamicComplianceRequired: z.boolean().default(false),
    })
    .optional(),
});

// System Message Schema with Cultural Guidelines
export const IraqiSystemMessageSchema = IraqiBaseMessageSchema.extend({
  role: z.literal("system"),
  content: z.string(),
  // System-level cultural configuration
  systemContext: z
    .object({
      culturalGuidelines: z.array(z.string()).optional(),
      islamicPrinciples: z.array(z.string()).optional(),
      arabicProcessingEnabled: z.boolean().default(false),
      professionalStandards: z.record(z.any()).optional(),
    })
    .optional(),
});

// Assistant Message Schema with AI Cultural Intelligence
export const IraqiAssistantMessageSchema = IraqiBaseMessageSchema.extend({
  role: z.literal("assistant"),
  content: z.string().optional(),
  toolCalls: z.array(IraqiToolCallSchema).optional(),
  // AI-specific cultural intelligence
  aiContext: z
    .object({
      culturalConfidence: z.number().min(0).max(100).optional(),
      islamicKnowledgeLevel: z
        .enum(["basic", "intermediate", "advanced"])
        .optional(),
      arabicCapabilities: z
        .object({
          canProcessArabic: z.boolean().default(false),
          dialectSupport: z.array(z.string()).optional(),
          rtlHandling: z.boolean().default(false),
        })
        .optional(),
      professionalExpertise: z.array(z.string()).optional(),
    })
    .optional(),
});

// User Message Schema with Cultural Preferences
export const IraqiUserMessageSchema = IraqiBaseMessageSchema.extend({
  role: z.literal("user"),
  content: z.string(),
  // User cultural preferences
  userPreferences: z
    .object({
      preferredLanguage: z
        .enum(["arabic", "english", "mixed"])
        .default("english"),
      dialectPreference: z.enum(["iraqi", "standard"]).optional(),
      islamicComplianceLevel: z
        .enum(["strict", "moderate", "flexible"])
        .default("moderate"),
      professionalContext: z
        .enum([
          "legal",
          "medical",
          "educational",
          "business",
          "technology",
          "finance",
          "personal",
          "general",
        ])
        .optional(),
      culturalSensitivity: z.enum(["high", "medium", "low"]).default("high"),
    })
    .optional(),
});

// Tool Message Schema with Enhanced Error Handling
export const IraqiToolMessageSchema = z.object({
  id: z.string(),
  content: z.string(),
  role: z.literal("tool"),
  toolCallId: z.string(),
  error: z.string().optional(),
  // Enhanced tool response context
  toolContext: z
    .object({
      executionTime: z.number().optional(),
      culturalValidation: z
        .object({
          validated: z.boolean().default(false),
          islamicCompliant: z.boolean().optional(),
          culturallyAppropriate: z.boolean().optional(),
          validationErrors: z.array(z.string()).optional(),
        })
        .optional(),
      arabicProcessing: z
        .object({
          rtlHandled: z.boolean().default(false),
          dialectRecognized: z.string().optional(),
          translationApplied: z.boolean().default(false),
        })
        .optional(),
      performanceMetrics: z
        .object({
          responseTime: z.number().optional(),
          tokensUsed: z.number().optional(),
          culturalValidationTime: z.number().optional(),
        })
        .optional(),
    })
    .optional(),
});

// Discriminated Union for All Iraqi Message Types
export const IraqiMessageSchema = z.discriminatedUnion("role", [
  IraqiDeveloperMessageSchema,
  IraqiSystemMessageSchema,
  IraqiAssistantMessageSchema,
  IraqiUserMessageSchema,
  IraqiToolMessageSchema,
]);

// Role Schema with Cultural Context
export const IraqiRoleSchema = z.union([
  z.literal("developer"),
  z.literal("system"),
  z.literal("assistant"),
  z.literal("user"),
  z.literal("tool"),
]);

// Context Schema with Cultural Intelligence
export const IraqiContextSchema = z.object({
  description: z.string(),
  value: z.string(),
  // Cultural context enhancements
  culturalRelevance: z
    .object({
      islamicRelevance: z
        .enum(["high", "medium", "low", "none"])
        .default("none"),
      culturalImportance: z
        .enum(["critical", "important", "moderate", "low"])
        .default("low"),
      arabicContentPresent: z.boolean().default(false),
      professionalDomain: z
        .enum([
          "legal",
          "medical",
          "educational",
          "business",
          "technology",
          "finance",
          "religious",
          "general",
        ])
        .optional(),
    })
    .optional(),
});

// Enhanced Tool Schema with Cultural Capabilities
export const IraqiToolSchema = z.object({
  name: z.string(),
  description: z.string(),
  parameters: z.any(), // JSON Schema for the tool parameters
  // Cultural tool capabilities
  culturalCapabilities: z
    .object({
      supportedLanguages: z.array(z.string()).default(["english"]),
      arabicCapable: z.boolean().default(false),
      islamicKnowledgeBase: z.boolean().default(false),
      culturalValidation: z.boolean().default(false),
      professionalDomains: z.array(z.string()).optional(),
      rtlSupport: z.boolean().default(false),
    })
    .optional(),
  // Performance and reliability metrics
  toolMetrics: z
    .object({
      averageResponseTime: z.number().optional(),
      reliabilityScore: z.number().min(0).max(100).optional(),
      culturalAccuracy: z.number().min(0).max(100).optional(),
      islamicComplianceRate: z.number().min(0).max(100).optional(),
    })
    .optional(),
});

// Enhanced Run Agent Input Schema
export const IraqiRunAgentInputSchema = z.object({
  threadId: z.string(),
  runId: z.string(),
  state: z.any(),
  messages: z.array(IraqiMessageSchema),
  tools: z.array(IraqiToolSchema),
  context: z.array(IraqiContextSchema),
  forwardedProps: z.any(),
  // Iraqi-specific agent configuration
  iraqiAgentConfig: z
    .object({
      // Cultural configuration
      culturalSettings: z.object({
        strictIslamicCompliance: z.boolean().default(false),
        culturalValidationLevel: z
          .enum(["strict", "moderate", "flexible"])
          .default("moderate"),
        arabicProcessingEnabled: z.boolean().default(false),
        dialectSupport: z.array(z.string()).default([]),
        rtlLayoutSupport: z.boolean().default(false),
      }),

      // Professional domain configuration
      professionalSettings: z.object({
        primaryDomain: z
          .enum([
            "legal",
            "medical",
            "educational",
            "business",
            "technology",
            "finance",
            "religious",
            "general",
          ])
          .default("general"),
        expertiseLevel: z
          .enum(["basic", "intermediate", "advanced", "expert"])
          .default("intermediate"),
        domainSpecificValidation: z.boolean().default(false),
        professionalEthicsEnforcement: z.boolean().default(true),
      }),

      // Performance and quality settings
      qualitySettings: z.object({
        responseTimeTarget: z.number().default(300), // milliseconds
        culturalValidationTimeout: z.number().default(200), // milliseconds
        minimumCulturalScore: z.number().min(0).max(100).default(85),
        minimumIslamicScore: z.number().min(0).max(100).default(90),
        qualityGateEnabled: z.boolean().default(true),
      }),

      // Agent behavior configuration
      behaviorSettings: z.object({
        proactiveCulturalGuidance: z.boolean().default(true),
        automaticArabicDetection: z.boolean().default(true),
        contextAwareness: z.boolean().default(true),
        crossCulturalBridge: z.boolean().default(false),
        educationalSupport: z.boolean().default(false),
      }),
    })
    .optional(),
});

// State Schema (flexible for various state types)
export const IraqiStateSchema = z.any();

// Type Exports (inferred from schemas)
export type IraqiToolCall = z.infer<typeof IraqiToolCallSchema>;
export type IraqiFunctionCall = z.infer<typeof IraqiFunctionCallSchema>;
export type IraqiDeveloperMessage = z.infer<typeof IraqiDeveloperMessageSchema>;
export type IraqiSystemMessage = z.infer<typeof IraqiSystemMessageSchema>;
export type IraqiAssistantMessage = z.infer<typeof IraqiAssistantMessageSchema>;
export type IraqiUserMessage = z.infer<typeof IraqiUserMessageSchema>;
export type IraqiToolMessage = z.infer<typeof IraqiToolMessageSchema>;
export type IraqiMessage = z.infer<typeof IraqiMessageSchema>;
export type IraqiContext = z.infer<typeof IraqiContextSchema>;
export type IraqiTool = z.infer<typeof IraqiToolSchema>;
export type IraqiRunAgentInput = z.infer<typeof IraqiRunAgentInputSchema>;
export type IraqiState = z.infer<typeof IraqiStateSchema>;
export type IraqiRole = z.infer<typeof IraqiRoleSchema>;

// Enhanced AG-UI Error Class with Cultural Context
export class IraqiAGUIError extends Error {
  public readonly culturalContext?: {
    islamicComplianceIssue?: boolean;
    culturalSensitivityViolation?: boolean;
    arabicProcessingError?: boolean;
    professionalEthicsViolation?: boolean;
  };

  public readonly errorCode?: string;
  public readonly severity?: "low" | "medium" | "high" | "critical";

  constructor(
    message: string,
    culturalContext?: {
      islamicComplianceIssue?: boolean;
      culturalSensitivityViolation?: boolean;
      arabicProcessingError?: boolean;
      professionalEthicsViolation?: boolean;
    },
    errorCode?: string,
    severity: "low" | "medium" | "high" | "critical" = "medium",
  ) {
    super(message);
    this.name = "IraqiAGUIError";
    this.culturalContext = culturalContext;
    this.errorCode = errorCode;
    this.severity = severity;
  }
}

// Cultural Validation Utilities
export interface CulturalValidationResult {
  isValid: boolean;
  islamicScore: number;
  culturalScore: number;
  issues: string[];
  recommendations: string[];
  validatedAt: string;
}

export interface ArabicProcessingResult {
  originalText: string;
  processedText: string;
  isRTL: boolean;
  detectedDialect?: string;
  translationApplied: boolean;
  confidence: number;
}

export interface ProfessionalDomainContext {
  domain:
    | "legal"
    | "medical"
    | "educational"
    | "business"
    | "technology"
    | "finance"
    | "religious"
    | "general";
  expertiseRequired: "basic" | "intermediate" | "advanced" | "expert";
  ethicsFramework: string[];
  complianceRequirements: string[];
  culturalConsiderations: string[];
}

// Performance Monitoring Interfaces
export interface IraqiAGUIPerformanceMetrics {
  messageProcessingTime: number;
  culturalValidationTime: number;
  arabicProcessingTime: number;
  totalResponseTime: number;
  culturalAccuracy: number;
  islamicCompliance: number;
  userSatisfactionScore?: number;
  systemResourceUsage: {
    cpu: number;
    memory: number;
    tokens: number;
  };
}

// Configuration Interfaces
export interface IraqiAGUIConfiguration {
  cultural: {
    enableIslamicCompliance: boolean;
    enableCulturalValidation: boolean;
    strictMode: boolean;
    minimumScores: {
      cultural: number;
      islamic: number;
    };
  };
  language: {
    enableArabicProcessing: boolean;
    supportedDialects: string[];
    rtlSupport: boolean;
    autoLanguageDetection: boolean;
  };
  professional: {
    enableDomainValidation: boolean;
    supportedDomains: string[];
    ethicsEnforcement: boolean;
    complianceChecking: boolean;
  };
  performance: {
    timeoutSettings: {
      culturalValidation: number;
      arabicProcessing: number;
      totalResponse: number;
    };
    caching: {
      enableCulturalCache: boolean;
      enableArabicCache: boolean;
      cacheExpiration: number;
    };
  };
}

// Default configuration
export const DEFAULT_IRAQI_AGUI_CONFIG: IraqiAGUIConfiguration = {
  cultural: {
    enableIslamicCompliance: true,
    enableCulturalValidation: true,
    strictMode: false,
    minimumScores: {
      cultural: 85,
      islamic: 90,
    },
  },
  language: {
    enableArabicProcessing: true,
    supportedDialects: ["iraqi", "standard"],
    rtlSupport: true,
    autoLanguageDetection: true,
  },
  professional: {
    enableDomainValidation: true,
    supportedDomains: [
      "legal",
      "medical",
      "educational",
      "business",
      "technology",
      "finance",
    ],
    ethicsEnforcement: true,
    complianceChecking: true,
  },
  performance: {
    timeoutSettings: {
      culturalValidation: 200,
      arabicProcessing: 150,
      totalResponse: 500,
    },
    caching: {
      enableCulturalCache: true,
      enableArabicCache: true,
      cacheExpiration: 3600000, // 1 hour
    },
  },
};

// Export all schemas for external use
export {
  IraqiFunctionCallSchema,
  IraqiToolCallSchema,
  IraqiBaseMessageSchema,
  IraqiDeveloperMessageSchema,
  IraqiSystemMessageSchema,
  IraqiAssistantMessageSchema,
  IraqiUserMessageSchema,
  IraqiToolMessageSchema,
  IraqiMessageSchema,
  IraqiRoleSchema,
  IraqiContextSchema,
  IraqiToolSchema,
  IraqiRunAgentInputSchema,
  IraqiStateSchema,
};
