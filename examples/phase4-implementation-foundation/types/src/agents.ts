import { z } from "zod";
import { IraqiCulturalContextSchema } from "./cultural.js";

// Agent Types Based on Extracted A2A and AG-UI Protocols
export const AgentCapabilitiesSchema = z.object({
  cultural_validation: z.boolean().default(false),
  arabic_processing: z.boolean().default(false),
  islamic_compliance: z.boolean().default(false),
  professional_domain: z.boolean().default(false),
  payment_processing: z.boolean().default(false),
  security_analysis: z.boolean().default(false),
  ui_generation: z.boolean().default(false),
  accessibility_testing: z.boolean().default(false),
});

export type AgentCapabilities = z.infer<typeof AgentCapabilitiesSchema>;

// Iraqi Agent Card Schema - Enhanced A2A Protocol
export const IraqiAgentCardSchema = z.object({
  protocolVersion: z.string().default("1.0.0"),
  name: z.string(),
  displayName: z.string(),
  description: z.string(),
  url: z.string().url(),
  capabilities: AgentCapabilitiesSchema,
  culturalContext: IraqiCulturalContextSchema.optional(),
  professionalDomains: z
    .array(
      z.enum([
        "legal",
        "medical",
        "educational",
        "business",
        "government",
        "technology",
        "finance",
        "general",
      ]),
    )
    .default([]),
  supportedLanguages: z
    .array(z.enum(["arabic", "english", "kurdish"]))
    .default(["arabic", "english"]),
  dialects: z
    .array(z.enum(["iraqi", "standard", "gulf", "levantine"]))
    .default(["iraqi"]),
  skills: z.array(z.string()).default([]),
  defaultInputModes: z.array(z.string()).default(["text"]),
  defaultOutputModes: z.array(z.string()).default(["text"]),
  version: z.string().default("1.0.0"),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type IraqiAgentCard = z.infer<typeof IraqiAgentCardSchema>;

// Agent Message Schema - Based on AG-UI Event System
export const AgentMessageSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  agentId: z.string(),
  type: z.enum([
    "text",
    "cultural_validation",
    "arabic_processing",
    "islamic_compliance",
    "professional_analysis",
    "payment_processing",
    "security_scan",
    "ui_generation",
  ]),
  content: z.string(),
  metadata: z.record(z.any()).optional(),
  culturalContext: IraqiCulturalContextSchema.optional(),
  timestamp: z.string().datetime(),
  processingTime: z.number().min(0).optional(),
  success: z.boolean().default(true),
  errors: z.array(z.string()).default([]),
});

export type AgentMessage = z.infer<typeof AgentMessageSchema>;

// Agent Coordination Schema
export const AgentCoordinationSchema = z.object({
  enabled: z.boolean().default(true),
  maxConcurrentAgents: z.number().min(1).max(20).default(10),
  agentTimeout: z.number().min(0).default(15000),
  loadBalancing: z.boolean().default(true),
  healthCheckInterval: z.number().min(0).default(30000),
  failoverEnabled: z.boolean().default(true),
  culturalValidationRequired: z.boolean().default(true),
});

export type AgentCoordination = z.infer<typeof AgentCoordinationSchema>;

// Specialized Iraqi Agents Enum
export const IraqiAgentTypesEnum = z.enum([
  // Cultural & Language
  "iraqi-cultural-validator",
  "iraqi-cultural-tester",
  "arabic-rtl-processor",
  "iraqi-arabic-tester",

  // Professional Domains
  "iraqi-professional-domain-expert",
  "iraqi-business-analyst",
  "iraqi-product-manager",

  // Technical Implementation
  "iraqi-ai-agent-architect",
  "iraqi-technical-debugger",
  "iraqi-devops-engineer",

  // UI/UX Design
  "iraqi-ui-designer",
  "iraqi-ux-researcher",
  "iraqi-interaction-designer",
  "iraqi-accessibility-specialist",

  // Payment & Security
  "payment-security-guardian",
  "iraqi-payment-tester",
  "iraqi-security-specialist",
  "external-service-coordinator",

  // System Management
  "iraqi-workflow-orchestrator",
  "iraqi-context-manager",
  "iraqi-prp-execution-orchestrator",
  "app-documentation-tracker",
]);

export type IraqiAgentType = z.infer<typeof IraqiAgentTypesEnum>;

// Agent Performance Metrics
export const AgentPerformanceMetricsSchema = z.object({
  agentId: z.string(),
  agentType: IraqiAgentTypesEnum,
  totalRequests: z.number().min(0).default(0),
  successfulRequests: z.number().min(0).default(0),
  failedRequests: z.number().min(0).default(0),
  averageResponseTime: z.number().min(0).default(0),
  culturalComplianceRate: z.number().min(0).max(100).default(0),
  islamicComplianceRate: z.number().min(0).max(100).default(0),
  lastActive: z.string().datetime().optional(),
  uptime: z.number().min(0).default(0),
});

export type AgentPerformanceMetrics = z.infer<
  typeof AgentPerformanceMetricsSchema
>;
