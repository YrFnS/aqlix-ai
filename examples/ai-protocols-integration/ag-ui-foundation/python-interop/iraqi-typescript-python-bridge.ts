/**
 * Iraqi Enhanced TypeScript-Python Bridge
 * Companion to iraqi-python-typescript-bridge.py
 * Provides seamless interoperability between TypeScript and Python components
 */

import { z } from "zod";

// Mirror Python enums in TypeScript
export const IraqiLanguageEnum = z.enum([
  "arabic",
  "english",
  "kurdish",
  "mixed",
]);
export type IraqiLanguage = z.infer<typeof IraqiLanguageEnum>;

export const IraqiDialectEnum = z.enum([
  "iraqi",
  "standard",
  "gulf",
  "levantine",
  "maghrebi",
  "egyptian",
]);
export type IraqiDialect = z.infer<typeof IraqiDialectEnum>;

export const IraqiRoleEnum = z.enum([
  "developer",
  "system",
  "assistant",
  "user",
  "tool",
]);
export type IraqiRole = z.infer<typeof IraqiRoleEnum>;

// Cultural Context Schema (matches Python CulturalContext)
export const CulturalContextSchema = z.object({
  culturalValidation: z.boolean().default(true),
  islamicCompliance: z.boolean().default(true),
  arabicSupport: z.boolean().default(false),
  rtlLayout: z.boolean().default(false),
  dialectSupport: IraqiDialectEnum.default("iraqi"),
  professionalDomain: z
    .enum([
      "legal",
      "medical",
      "educational",
      "business",
      "government",
      "technology",
      "finance",
      "general",
    ])
    .optional(),
  culturalScore: z.number().min(0).max(100).default(85),
  islamicScore: z.number().min(0).max(100).default(90),
  __type: z.literal("CulturalContext").optional(),
});
export type CulturalContext = z.infer<typeof CulturalContextSchema>;

// Enhanced Function Call (matches Python IraqiFunctionCall)
export const IraqiFunctionCallSchema = z.object({
  name: z.string(),
  arguments: z.string(),
  culturalContext: CulturalContextSchema.optional(),
  language: IraqiLanguageEnum.default("english"),
  requiresCulturalValidation: z.boolean().default(false),
  requiresIslamicCompliance: z.boolean().default(false),
});
export type IraqiFunctionCall = z.infer<typeof IraqiFunctionCallSchema>;

// Enhanced Tool Call (matches Python IraqiToolCall)
export const IraqiToolCallSchema = z.object({
  id: z.string(),
  type: z.literal("function").default("function"),
  function: IraqiFunctionCallSchema,
  culturalContext: CulturalContextSchema.optional(),
  processingTime: z.number().optional(),
  culturalValidationResult: z.record(z.any()).optional(),
  islamicComplianceResult: z.record(z.any()).optional(),
});
export type IraqiToolCall = z.infer<typeof IraqiToolCallSchema>;

// Base Message Schema (matches Python IraqiBaseMessage)
export const IraqiBaseMessageSchema = z.object({
  id: z.string(),
  role: IraqiRoleEnum,
  content: z.string().optional(),
  contentArabic: z.string().optional(),
  name: z.string().optional(),
  culturalContext: CulturalContextSchema.optional(),
  language: IraqiLanguageEnum.default("english"),
  dialect: IraqiDialectEnum.default("iraqi"),
  rtlLayout: z.boolean().default(false),
  timestamp: z.string().datetime().optional(),
  culturalScore: z.number().min(0).max(100).optional(),
  islamicComplianceScore: z.number().min(0).max(100).optional(),
  __type: z.literal("IraqiMessage").optional(),
});

// Specific Message Types
export const IraqiDeveloperMessageSchema = IraqiBaseMessageSchema.extend({
  role: z.literal("developer"),
  content: z.string(),
  culturalGuidance: z.string().optional(),
  islamicComplianceNotes: z.string().optional(),
});
export type IraqiDeveloperMessage = z.infer<typeof IraqiDeveloperMessageSchema>;

export const IraqiSystemMessageSchema = IraqiBaseMessageSchema.extend({
  role: z.literal("system"),
  content: z.string(),
  culturalInstructions: z.string().optional(),
  islamicGuidelines: z.string().optional(),
  professionalDomainContext: z.string().optional(),
});
export type IraqiSystemMessage = z.infer<typeof IraqiSystemMessageSchema>;

export const IraqiAssistantMessageSchema = IraqiBaseMessageSchema.extend({
  role: z.literal("assistant"),
  toolCalls: z.array(IraqiToolCallSchema).optional(),
  culturalAppropriatenessCheck: z.boolean().optional(),
  islamicComplianceVerified: z.boolean().optional(),
  professionalDomainValidated: z.boolean().optional(),
  responseConfidence: z.number().min(0).max(1).optional(),
});
export type IraqiAssistantMessage = z.infer<typeof IraqiAssistantMessageSchema>;

export const IraqiUserMessageSchema = IraqiBaseMessageSchema.extend({
  role: z.literal("user"),
  content: z.string(),
  detectedLanguage: IraqiLanguageEnum.optional(),
  detectedDialect: IraqiDialectEnum.optional(),
  culturalSensitivityRequired: z.boolean().default(false),
  professionalDomainQuery: z.string().optional(),
});
export type IraqiUserMessage = z.infer<typeof IraqiUserMessageSchema>;

export const IraqiToolMessageSchema = z.object({
  id: z.string(),
  role: z.literal("tool"),
  content: z.string(),
  contentArabic: z.string().optional(),
  toolCallId: z.string(),
  error: z.string().optional(),
  culturalValidationPassed: z.boolean().optional(),
  islamicCompliancePassed: z.boolean().optional(),
  processingTime: z.number().optional(),
  culturalEnhancementApplied: z.boolean().optional(),
  __type: z.literal("IraqiToolResult").optional(),
});
export type IraqiToolMessage = z.infer<typeof IraqiToolMessageSchema>;

// Union Message Type
export const IraqiMessageSchema = z.discriminatedUnion("role", [
  IraqiDeveloperMessageSchema,
  IraqiSystemMessageSchema,
  IraqiAssistantMessageSchema,
  IraqiUserMessageSchema,
  IraqiToolMessageSchema,
]);
export type IraqiMessage = z.infer<typeof IraqiMessageSchema>;

// Enhanced Context (matches Python IraqiContext)
export const IraqiContextSchema = z.object({
  description: z.string(),
  descriptionArabic: z.string().optional(),
  value: z.string(),
  valueArabic: z.string().optional(),
  culturalContext: CulturalContextSchema.optional(),
  professionalDomain: z.string().optional(),
  language: IraqiLanguageEnum.default("english"),
  rtlLayout: z.boolean().default(false),
});
export type IraqiContext = z.infer<typeof IraqiContextSchema>;

// Enhanced Tool (matches Python IraqiTool)
export const IraqiToolSchema = z.object({
  name: z.string(),
  nameArabic: z.string().optional(),
  description: z.string(),
  descriptionArabic: z.string().optional(),
  parameters: z.any(), // JSON Schema
  culturalValidationRequired: z.boolean().default(false),
  islamicComplianceRequired: z.boolean().default(false),
  professionalDomainSpecific: z.string().optional(),
  supportedLanguages: z.array(IraqiLanguageEnum).default(["english"]),
  rtlSupport: z.boolean().default(false),
});
export type IraqiTool = z.infer<typeof IraqiToolSchema>;

// Agent Capabilities (matches Python IraqiAgentCapabilities)
export const IraqiAgentCapabilitiesSchema = z.object({
  culturalValidation: z.boolean().default(false),
  arabicProcessing: z.boolean().default(false),
  islamicCompliance: z.boolean().default(false),
  professionalDomainExpertise: z.array(z.string()).optional(),
  rtlLayoutSupport: z.boolean().default(false),
  dialectRecognition: z.boolean().default(false),
  crossLanguageSupport: z.boolean().default(false),
  paymentGatewayIntegration: z.boolean().default(false),
  securityCompliance: z.boolean().default(false),
});
export type IraqiAgentCapabilities = z.infer<
  typeof IraqiAgentCapabilitiesSchema
>;

// Agent Input (matches Python IraqiRunAgentInput)
export const IraqiRunAgentInputSchema = z.object({
  threadId: z.string(),
  runId: z.string(),
  state: z.any(),
  messages: z.array(IraqiMessageSchema),
  tools: z.array(IraqiToolSchema),
  context: z.array(IraqiContextSchema),
  forwardedProps: z.any(),

  // Iraqi enhancements
  culturalContext: CulturalContextSchema.optional(),
  agentCapabilities: IraqiAgentCapabilitiesSchema.optional(),
  preferredLanguage: IraqiLanguageEnum.default("english"),
  preferredDialect: IraqiDialectEnum.default("iraqi"),
  rtlLayoutEnabled: z.boolean().default(false),
  professionalDomainActive: z.string().optional(),
  culturalValidationStrictMode: z.boolean().default(false),
  islamicComplianceStrictMode: z.boolean().default(true),
  performanceMonitoringEnabled: z.boolean().default(true),
});
export type IraqiRunAgentInput = z.infer<typeof IraqiRunAgentInputSchema>;

// Agent Response (matches Python IraqiAgentResponse)
export const IraqiAgentResponseSchema = z.object({
  response: z.string(),
  responseArabic: z.string().optional(),
  culturalValidationResult: z.record(z.any()).optional(),
  islamicComplianceResult: z.record(z.any()).optional(),
  professionalDomainValidation: z.record(z.any()).optional(),
  processingMetrics: z.record(z.number()).optional(),
  languageUsed: IraqiLanguageEnum.default("english"),
  dialectUsed: IraqiDialectEnum.default("iraqi"),
  rtlFormatted: z.boolean().default(false),
  confidenceScore: z.number().min(0).max(1).default(0.85),
  culturalAppropriatenessScore: z.number().min(0).max(100).default(85),
  islamicComplianceScore: z.number().min(0).max(100).default(90),
  recommendations: z.array(z.string()).optional(),
  warnings: z.array(z.string()).optional(),
});
export type IraqiAgentResponse = z.infer<typeof IraqiAgentResponseSchema>;

/**
 * TypeScript-Python Bridge Class
 * Handles serialization/deserialization between TypeScript and Python
 */
export class IraqiTypescriptPythonBridge {
  /**
   * Convert TypeScript message to Python-compatible format
   */
  static convertMessageToPythonFormat(
    message: IraqiMessage,
  ): Record<string, any> {
    const result = {
      ...message,
      __type: "IraqiMessage",
      __culturalContext: message.culturalContext || null,
    };

    // Convert camelCase to snake_case for Python compatibility
    return this.convertCamelToSnake(result);
  }

  /**
   * Convert Python message response to TypeScript format
   */
  static convertPythonMessageToTypescript(
    pythonData: Record<string, any>,
  ): IraqiMessage {
    // Convert snake_case to camelCase
    const tsData = this.convertSnakeToCamel(pythonData);

    // Validate and parse using Zod schema
    return IraqiMessageSchema.parse(tsData);
  }

  /**
   * Create cultural context for Python interop
   */
  static createCulturalContextForPython(
    culturalValidation: boolean = true,
    islamicCompliance: boolean = true,
    arabicSupport: boolean = false,
    professionalDomain?: string,
  ): Record<string, any> {
    const context: CulturalContext = {
      culturalValidation,
      islamicCompliance,
      arabicSupport,
      rtlLayout: arabicSupport,
      dialectSupport: "iraqi",
      professionalDomain: professionalDomain as any,
      culturalScore: 85,
      islamicScore: 90,
      __type: "CulturalContext",
    };

    return this.convertCamelToSnake(context);
  }

  /**
   * Validate incoming Python data format
   */
  static validatePythonDataFormat(data: Record<string, any>): boolean {
    try {
      // Convert to TypeScript format and validate
      const tsData = this.convertSnakeToCamel(data);

      if (data.__type === "IraqiMessage") {
        IraqiMessageSchema.parse(tsData);
        return true;
      }

      if (data.__type === "CulturalContext") {
        CulturalContextSchema.parse(tsData);
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }

  /**
   * Convert camelCase to snake_case for Python compatibility
   */
  private static convertCamelToSnake(obj: any): any {
    if (obj === null || obj === undefined || typeof obj !== "object") {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.convertCamelToSnake(item));
    }

    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const snakeKey = key.replace(
        /[A-Z]/g,
        (letter) => `_${letter.toLowerCase()}`,
      );
      result[snakeKey] = this.convertCamelToSnake(value);
    }

    return result;
  }

  /**
   * Convert snake_case to camelCase for TypeScript compatibility
   */
  private static convertSnakeToCamel(obj: any): any {
    if (obj === null || obj === undefined || typeof obj !== "object") {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.convertSnakeToCamel(item));
    }

    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
        letter.toUpperCase(),
      );
      result[camelKey] = this.convertSnakeToCamel(value);
    }

    return result;
  }

  /**
   * Create Agent Input for Python processing
   */
  static createAgentInputForPython(
    threadId: string,
    runId: string,
    messages: IraqiMessage[],
    tools: IraqiTool[],
    context: IraqiContext[],
    culturalContext?: CulturalContext,
  ): Record<string, any> {
    const input: IraqiRunAgentInput = {
      threadId,
      runId,
      state: {},
      messages,
      tools,
      context,
      forwardedProps: {},
      culturalContext,
      preferredLanguage: culturalContext?.arabicSupport ? "arabic" : "english",
      preferredDialect: "iraqi",
      rtlLayoutEnabled: culturalContext?.rtlLayout || false,
      culturalValidationStrictMode:
        culturalContext?.culturalValidation || false,
      islamicComplianceStrictMode: culturalContext?.islamicCompliance || true,
      performanceMonitoringEnabled: true,
    };

    return this.convertCamelToSnake(input);
  }

  /**
   * Process Python Agent Response
   */
  static processPythonAgentResponse(
    pythonResponse: Record<string, any>,
  ): IraqiAgentResponse {
    const tsResponse = this.convertSnakeToCamel(pythonResponse);
    return IraqiAgentResponseSchema.parse(tsResponse);
  }
}
