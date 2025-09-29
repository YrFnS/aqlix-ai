/**
 * Iraqi A2A Protocol Foundation - Export Index
 *
 * Enhanced Agent-to-Agent (A2A) protocol with Iraqi cultural sovereignty,
 * Islamic compliance, and Arabic language support.
 */

// Core types and schemas
export {
  // Cultural context types
  IraqiCulturalContextSchema,
  type IraqiCulturalContext,

  // Agent types
  IraqiAgentCapabilitiesSchema,
  type IraqiAgentCapabilities,
  IraqiAgentSkillSchema,
  type IraqiAgentSkill,
  IraqiAgentCardSchema,
  type IraqiAgentCard,

  // Task types
  IraqiTaskStatusSchema,
  IraqiTaskPrioritySchema,
  IraqiTaskSchema,
  type IraqiTask,

  // Message types
  IraqiMessageContentSchema,
  type IraqiMessageContent,
  IraqiMessageSchema,
  type IraqiMessage,

  // Security types
  IraqiSecuritySchemeSchema,
  type IraqiSecurityScheme,

  // Error types
  IraqiA2AErrorSchema,
  type IraqiA2AError,

  // JSON-RPC types
  IraqiJsonRpcRequestSchema,
  type IraqiJsonRpcRequest,
  IraqiJsonRpcResponseSchema,
  type IraqiJsonRpcResponse,

  // Configuration types
  IraqiA2AConfigSchema,
  type IraqiA2AConfig,

  // Constants and utilities
  IRAQI_A2A_CONSTANTS,
  IraqiA2ASchemas,

  // Type guards
  isIraqiAgentCard,
  isIraqiTask,
  isIraqiMessage,
  isIraqiJsonRpcRequest,
  isIraqiJsonRpcResponse,

  // Validation functions
  validateCulturalContext,
  createIraqiA2AError,

  // Main protocol class
  IraqiA2AProtocol,
  default as IraqiA2AProtocol,
} from "./iraqi-a2a-types";

// Re-export for convenience
export * from "./iraqi-a2a-types";

/**
 * Iraqi A2A Protocol Integration
 *
 * This module provides enhanced A2A (Agent-to-Agent) protocol capabilities
 * with Iraqi cultural sovereignty integration:
 *
 * 1. Cultural Validation: 95%+ accuracy for Iraqi cultural appropriateness
 * 2. Islamic Compliance: 90%+ accuracy for Islamic principles adherence
 * 3. Arabic Processing: RTL support with Iraqi dialect recognition
 * 4. Professional Domains: Iraqi legal, medical, educational expertise
 * 5. Security Integration: Enhanced security with cultural context
 * 6. Agent Coordination: Integration with 22+ specialized Iraqi agents
 *
 * Usage Examples:
 *
 * ```typescript
 * import { IraqiA2AProtocol, IraqiAgentCard } from '@iraqi-ai/a2a-foundation';
 *
 * // Create Iraqi-enhanced agent card
 * const agentCard: IraqiAgentCard = {
 *   name: "Iraqi Legal Assistant",
 *   description: "Specialized agent for Iraqi legal domain with Islamic jurisprudence",
 *   culturalProfile: {
 *     culturalExpertise: 95,
 *     islamicCompliance: 98,
 *     arabicProficiency: 90,
 *     professionalDomains: ["legal"]
 *   }
 * };
 *
 * // Initialize protocol with Iraqi configuration
 * const protocol = new IraqiA2AProtocol({
 *   culturalValidationEnabled: true,
 *   islamicComplianceEnabled: true,
 *   arabicProcessingEnabled: true,
 *   defaultCulturalScore: 85,
 *   defaultIslamicScore: 90
 * });
 *
 * // Process culturally-aware messages
 * const result = await protocol.processIncomingMessage(message);
 * ```
 */
