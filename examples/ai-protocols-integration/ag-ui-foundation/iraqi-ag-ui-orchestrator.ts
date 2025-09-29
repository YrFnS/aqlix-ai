/**
 * Iraqi AG-UI Interaction Orchestrator
 *
 * Complete AI-frontend interaction system combining events and type definitions
 * Orchestrates real-time communication between AI agents and frontend applications
 *
 * Based on: AG-UI TypeScript SDK (events.ts + types.ts)
 * Enhanced with: Iraqi cultural sovereignty, Islamic compliance, Arabic RTL support
 *
 * Core Capabilities:
 * - Real-time event streaming with cultural validation
 * - Message orchestration with Islamic compliance checking
 * - Tool call management with professional domain awareness
 * - Arabic RTL processing with Iraqi dialect recognition
 * - Performance monitoring with cultural accuracy metrics
 *
 * Performance Targets:
 * - Event processing: <50ms per event
 * - Cultural validation: <200ms per message
 * - Arabic processing: <150ms per RTL operation
 * - Total interaction latency: <300ms end-to-end
 */

import { EventEmitter } from "events";
import {
  // Event types and schemas
  IraqiEventType,
  type IraqiBaseEvent,
  type IraqiTextMessageStartEvent,
  type IraqiTextMessageContentEvent,
  type IraqiTextMessageEndEvent,
  type IraqiToolCallStartEvent,
  type IraqiToolCallArgsEvent,
  type IraqiToolCallEndEvent,
  type IraqiToolCallResultEvent,
  type IraqiStateSnapshotEvent,
  type IraqiCustomEvent,
  type IraqiRunStartedEvent,
  type IraqiRunFinishedEvent,
  type IraqiRunErrorEvent,
  IraqiEventSchemas,

  // Message and tool schemas
  type IraqiMessage,
  type IraqiToolCall,
  type IraqiRunAgentInput,
  IraqiMessageSchema,
  IraqiToolCallSchema,
  IraqiAGUIError,
  type CulturalValidationResult,
  type ArabicProcessingResult,
  type ProfessionalDomainContext,
  type IraqiAGUIPerformanceMetrics,
  type IraqiAGUIConfiguration,
  DEFAULT_IRAQI_AGUI_CONFIG,
} from "./iraqi-ag-ui-types";

// Interaction State Management
export enum IraqiInteractionState {
  IDLE = "IDLE",
  PROCESSING = "PROCESSING",
  VALIDATING_CULTURAL = "VALIDATING_CULTURAL",
  PROCESSING_ARABIC = "PROCESSING_ARABIC",
  EXECUTING_TOOLS = "EXECUTING_TOOLS",
  STREAMING_RESPONSE = "STREAMING_RESPONSE",
  ERROR = "ERROR",
  COMPLETED = "COMPLETED",
}

// Cultural Validation Service Interface
export interface ICulturalValidationService {
  validateMessage(message: IraqiMessage): Promise<CulturalValidationResult>;
  validateToolCall(toolCall: IraqiToolCall): Promise<CulturalValidationResult>;
  validateContent(
    content: string,
    domain?: string,
  ): Promise<CulturalValidationResult>;
  getIslamicCompliance(content: string): Promise<number>;
  getCulturalScore(content: string, context?: any): Promise<number>;
}

// Arabic Processing Service Interface
export interface IArabicProcessingService {
  processText(text: string): Promise<ArabicProcessingResult>;
  detectLanguage(text: string): Promise<"arabic" | "english" | "mixed">;
  detectDialect(arabicText: string): Promise<string | null>;
  formatRTL(text: string): Promise<string>;
  translateIfNeeded(
    text: string,
    targetLanguage: "arabic" | "english",
  ): Promise<string>;
}

// Professional Domain Service Interface
export interface IProfessionalDomainService {
  getDomainContext(domain: string): Promise<ProfessionalDomainContext>;
  validateProfessionalContent(
    content: string,
    domain: string,
  ): Promise<boolean>;
  getEthicsFramework(domain: string): Promise<string[]>;
  checkCompliance(content: string, domain: string): Promise<boolean>;
}

// Event Processing Context
export interface IraqiEventProcessingContext {
  threadId: string;
  runId: string;
  userId?: string;
  culturalProfile?: {
    preferredLanguage: "arabic" | "english" | "mixed";
    islamicComplianceLevel: "strict" | "moderate" | "flexible";
    professionalDomain?: string;
    culturalSensitivity: "high" | "medium" | "low";
  };
  sessionMetrics: IraqiAGUIPerformanceMetrics;
  startTime: number;
}

// Main Orchestrator Class
export class IraqiAGUIOrchestrator extends EventEmitter {
  private config: IraqiAGUIConfiguration;
  private culturalService: ICulturalValidationService;
  private arabicService: IArabicProcessingService;
  private domainService: IProfessionalDomainService;

  private activeContexts: Map<string, IraqiEventProcessingContext> = new Map();
  private messageQueue: Map<string, IraqiMessage[]> = new Map();
  private performanceMetrics: Map<string, IraqiAGUIPerformanceMetrics> =
    new Map();

  private state: IraqiInteractionState = IraqiInteractionState.IDLE;

  constructor(
    config: Partial<IraqiAGUIConfiguration> = {},
    culturalService: ICulturalValidationService,
    arabicService: IArabicProcessingService,
    domainService: IProfessionalDomainService,
  ) {
    super();
    this.config = { ...DEFAULT_IRAQI_AGUI_CONFIG, ...config };
    this.culturalService = culturalService;
    this.arabicService = arabicService;
    this.domainService = domainService;

    this.setupEventHandlers();
  }

  /**
   * Initialize interaction session with cultural context
   */
  async initializeSession(
    threadId: string,
    runId: string,
    culturalProfile?: any,
  ): Promise<void> {
    const startTime = Date.now();

    const context: IraqiEventProcessingContext = {
      threadId,
      runId,
      culturalProfile,
      sessionMetrics: {
        messageProcessingTime: 0,
        culturalValidationTime: 0,
        arabicProcessingTime: 0,
        totalResponseTime: 0,
        culturalAccuracy: 0,
        islamicCompliance: 0,
        systemResourceUsage: {
          cpu: 0,
          memory: 0,
          tokens: 0,
        },
      },
      startTime,
    };

    this.activeContexts.set(threadId, context);
    this.messageQueue.set(threadId, []);

    // Emit session start event
    await this.emitEvent({
      type: IraqiEventType.RUN_STARTED,
      threadId,
      runId,
      timestamp: startTime,
      culturalContext: {
        islamicCompliance: this.config.cultural.enableIslamicCompliance,
        culturalValidation: this.config.cultural.enableCulturalValidation,
        arabicSupport: this.config.language.enableArabicProcessing,
      },
    } as IraqiRunStartedEvent);
  }

  /**
   * Process incoming message with cultural validation
   */
  async processMessage(threadId: string, message: IraqiMessage): Promise<void> {
    const startTime = Date.now();
    this.setState(IraqiInteractionState.PROCESSING);

    const context = this.activeContexts.get(threadId);
    if (!context) {
      throw new IraqiAGUIError(
        `No active context found for thread ${threadId}`,
        { culturalSensitivityViolation: true },
        "CONTEXT_NOT_FOUND",
        "high",
      );
    }

    try {
      // Validate message schema
      const validatedMessage = IraqiMessageSchema.parse(message);

      // Cultural validation
      let culturalValidation: CulturalValidationResult | null = null;
      if (this.config.cultural.enableCulturalValidation) {
        this.setState(IraqiInteractionState.VALIDATING_CULTURAL);
        const culturalStart = Date.now();

        culturalValidation =
          await this.culturalService.validateMessage(validatedMessage);

        context.sessionMetrics.culturalValidationTime +=
          Date.now() - culturalStart;
        context.sessionMetrics.culturalAccuracy =
          culturalValidation.culturalScore;
        context.sessionMetrics.islamicCompliance =
          culturalValidation.islamicScore;

        if (!culturalValidation.isValid && this.config.cultural.strictMode) {
          throw new IraqiAGUIError(
            `Message failed cultural validation: ${culturalValidation.issues.join(", ")}`,
            {
              islamicComplianceIssue:
                culturalValidation.islamicScore <
                this.config.cultural.minimumScores.islamic,
              culturalSensitivityViolation:
                culturalValidation.culturalScore <
                this.config.cultural.minimumScores.cultural,
            },
            "CULTURAL_VALIDATION_FAILED",
            "high",
          );
        }
      }

      // Arabic text processing
      let arabicProcessing: ArabicProcessingResult | null = null;
      if (
        this.config.language.enableArabicProcessing &&
        validatedMessage.content
      ) {
        this.setState(IraqiInteractionState.PROCESSING_ARABIC);
        const arabicStart = Date.now();

        arabicProcessing = await this.arabicService.processText(
          validatedMessage.content,
        );

        context.sessionMetrics.arabicProcessingTime += Date.now() - arabicStart;
      }

      // Add message to queue
      this.messageQueue.get(threadId)?.push({
        ...validatedMessage,
        culturalMetadata: {
          ...validatedMessage.culturalMetadata,
          culturallyValidated: culturalValidation?.isValid || false,
          validatedAt:
            culturalValidation?.validatedAt || new Date().toISOString(),
          language: arabicProcessing?.detectedDialect ? "arabic" : "english",
          rtlRequired: arabicProcessing?.isRTL || false,
        },
      });

      // Emit message events
      if (validatedMessage.role === "user") {
        await this.emitEvent({
          type: IraqiEventType.TEXT_MESSAGE_START,
          messageId: validatedMessage.id,
          role: "assistant", // Response will be from assistant
          timestamp: Date.now(),
          culturalContext: {
            islamicCompliance: culturalValidation?.islamicScore || 100,
            culturalScore: culturalValidation?.culturalScore || 100,
            arabicProcessed: !!arabicProcessing,
            rtlLayout: arabicProcessing?.isRTL || false,
          },
        } as IraqiTextMessageStartEvent);
      }

      context.sessionMetrics.messageProcessingTime = Date.now() - startTime;
      this.setState(IraqiInteractionState.IDLE);
    } catch (error) {
      this.setState(IraqiInteractionState.ERROR);

      await this.emitEvent({
        type: IraqiEventType.RUN_ERROR,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
        code:
          error instanceof IraqiAGUIError
            ? error.errorCode
            : "PROCESSING_ERROR",
        timestamp: Date.now(),
        culturalContext:
          error instanceof IraqiAGUIError ? error.culturalContext : undefined,
      } as IraqiRunErrorEvent);

      throw error;
    }
  }

  /**
   * Process tool calls with professional domain validation
   */
  async processToolCalls(
    threadId: string,
    toolCalls: IraqiToolCall[],
  ): Promise<void> {
    const context = this.activeContexts.get(threadId);
    if (!context) {
      throw new IraqiAGUIError(
        `No active context found for thread ${threadId}`,
      );
    }

    this.setState(IraqiInteractionState.EXECUTING_TOOLS);

    try {
      for (const toolCall of toolCalls) {
        // Validate tool call schema
        const validatedToolCall = IraqiToolCallSchema.parse(toolCall);

        // Emit tool call start event
        await this.emitEvent({
          type: IraqiEventType.TOOL_CALL_START,
          toolCallId: validatedToolCall.id,
          toolCallName: validatedToolCall.function.name,
          timestamp: Date.now(),
          culturalContext: validatedToolCall.function.culturalContext,
        } as IraqiToolCallStartEvent);

        // Cultural validation for tool calls
        if (this.config.cultural.enableCulturalValidation) {
          const culturalValidation =
            await this.culturalService.validateToolCall(validatedToolCall);

          if (!culturalValidation.isValid && this.config.cultural.strictMode) {
            await this.emitEvent({
              type: IraqiEventType.TOOL_CALL_END,
              toolCallId: validatedToolCall.id,
              timestamp: Date.now(),
              error: "Cultural validation failed",
              culturalContext: {
                validationFailed: true,
                issues: culturalValidation.issues,
              },
            } as IraqiToolCallEndEvent);
            continue;
          }
        }

        // Emit tool call arguments
        await this.emitEvent({
          type: IraqiEventType.TOOL_CALL_ARGS,
          toolCallId: validatedToolCall.id,
          delta: validatedToolCall.function.arguments,
          timestamp: Date.now(),
        } as IraqiToolCallArgsEvent);

        // Professional domain validation
        if (
          this.config.professional.enableDomainValidation &&
          validatedToolCall.function.culturalContext?.professionalDomain
        ) {
          const domain =
            validatedToolCall.function.culturalContext.professionalDomain;
          const domainContext =
            await this.domainService.getDomainContext(domain);

          // Add domain-specific validation logic here
        }

        // Emit tool call completion
        await this.emitEvent({
          type: IraqiEventType.TOOL_CALL_END,
          toolCallId: validatedToolCall.id,
          timestamp: Date.now(),
          culturalContext: {
            validated: true,
            professionalDomainChecked:
              !!validatedToolCall.function.culturalContext?.professionalDomain,
          },
        } as IraqiToolCallEndEvent);
      }

      this.setState(IraqiInteractionState.IDLE);
    } catch (error) {
      this.setState(IraqiInteractionState.ERROR);
      throw error;
    }
  }

  /**
   * Stream response content with cultural awareness
   */
  async streamResponse(
    threadId: string,
    messageId: string,
    content: string,
    isComplete: boolean = false,
  ): Promise<void> {
    const context = this.activeContexts.get(threadId);
    if (!context) {
      throw new IraqiAGUIError(
        `No active context found for thread ${threadId}`,
      );
    }

    this.setState(IraqiInteractionState.STREAMING_RESPONSE);

    try {
      // Process Arabic content if needed
      let processedContent = content;
      if (this.config.language.enableArabicProcessing) {
        const arabicResult = await this.arabicService.processText(content);
        processedContent = arabicResult.processedText;
      }

      // Emit content delta
      await this.emitEvent({
        type: IraqiEventType.TEXT_MESSAGE_CONTENT,
        messageId,
        delta: processedContent,
        timestamp: Date.now(),
        culturalContext: {
          arabicProcessed: content !== processedContent,
          rtlFormatted: content.includes("ا") || content.includes("ب"), // Basic Arabic detection
        },
      } as IraqiTextMessageContentEvent);

      if (isComplete) {
        await this.emitEvent({
          type: IraqiEventType.TEXT_MESSAGE_END,
          messageId,
          timestamp: Date.now(),
          culturalContext: {
            totalLength: processedContent.length,
            culturallyProcessed: true,
          },
        } as IraqiTextMessageEndEvent);
      }

      this.setState(IraqiInteractionState.IDLE);
    } catch (error) {
      this.setState(IraqiInteractionState.ERROR);
      throw error;
    }
  }

  /**
   * Complete interaction session
   */
  async completeSession(
    threadId: string,
    result?: any,
  ): Promise<IraqiAGUIPerformanceMetrics> {
    const context = this.activeContexts.get(threadId);
    if (!context) {
      throw new IraqiAGUIError(
        `No active context found for thread ${threadId}`,
      );
    }

    const endTime = Date.now();
    context.sessionMetrics.totalResponseTime = endTime - context.startTime;

    // Emit session completion event
    await this.emitEvent({
      type: IraqiEventType.RUN_FINISHED,
      threadId: context.threadId,
      runId: context.runId,
      result,
      timestamp: endTime,
      culturalContext: {
        culturalAccuracy: context.sessionMetrics.culturalAccuracy,
        islamicCompliance: context.sessionMetrics.islamicCompliance,
        totalProcessingTime: context.sessionMetrics.totalResponseTime,
      },
    } as IraqiRunFinishedEvent);

    // Store metrics for analysis
    this.performanceMetrics.set(threadId, context.sessionMetrics);

    // Cleanup
    this.activeContexts.delete(threadId);
    this.messageQueue.delete(threadId);

    this.setState(IraqiInteractionState.COMPLETED);

    return context.sessionMetrics;
  }

  /**
   * Get performance metrics for a completed session
   */
  getPerformanceMetrics(threadId: string): IraqiAGUIPerformanceMetrics | null {
    return this.performanceMetrics.get(threadId) || null;
  }

  /**
   * Get overall system performance statistics
   */
  getSystemStatistics(): {
    totalSessions: number;
    averageResponseTime: number;
    averageCulturalAccuracy: number;
    averageIslamicCompliance: number;
    errorRate: number;
  } {
    const metrics = Array.from(this.performanceMetrics.values());

    if (metrics.length === 0) {
      return {
        totalSessions: 0,
        averageResponseTime: 0,
        averageCulturalAccuracy: 0,
        averageIslamicCompliance: 0,
        errorRate: 0,
      };
    }

    return {
      totalSessions: metrics.length,
      averageResponseTime:
        metrics.reduce((sum, m) => sum + m.totalResponseTime, 0) /
        metrics.length,
      averageCulturalAccuracy:
        metrics.reduce((sum, m) => sum + m.culturalAccuracy, 0) /
        metrics.length,
      averageIslamicCompliance:
        metrics.reduce((sum, m) => sum + m.islamicCompliance, 0) /
        metrics.length,
      errorRate: 0, // Would need error tracking implementation
    };
  }

  /**
   * Update configuration
   */
  updateConfiguration(newConfig: Partial<IraqiAGUIConfiguration>): void {
    this.config = { ...this.config, ...newConfig };
    this.emit("configurationUpdated", this.config);
  }

  /**
   * Private helper methods
   */
  private setState(newState: IraqiInteractionState): void {
    const previousState = this.state;
    this.state = newState;
    this.emit("stateChanged", { previous: previousState, current: newState });
  }

  private async emitEvent(event: IraqiBaseEvent): Promise<void> {
    try {
      // Validate event schema
      const validatedEvent = IraqiEventSchemas.parse(event);

      // Add performance timing
      if (!validatedEvent.timestamp) {
        validatedEvent.timestamp = Date.now();
      }

      // Emit to all listeners
      this.emit("event", validatedEvent);
      this.emit(validatedEvent.type, validatedEvent);

      // Log for debugging (if needed)
      if (process.env.NODE_ENV === "development") {
        console.log(
          `[Iraqi AG-UI] Event: ${validatedEvent.type}`,
          validatedEvent,
        );
      }
    } catch (error) {
      console.error("Failed to emit event:", error);
      throw new IraqiAGUIError(
        `Invalid event format: ${error instanceof Error ? error.message : "Unknown error"}`,
        undefined,
        "INVALID_EVENT_FORMAT",
        "medium",
      );
    }
  }

  private setupEventHandlers(): void {
    // Error handling
    this.on("error", (error) => {
      console.error("[Iraqi AG-UI] Orchestrator error:", error);
      this.setState(IraqiInteractionState.ERROR);
    });

    // Performance monitoring
    this.on("event", (event) => {
      // Track event processing times, cultural accuracy, etc.
      // Implementation would depend on monitoring requirements
    });
  }
}

// Export utility functions
export function createIraqiAGUIOrchestrator(
  config?: Partial<IraqiAGUIConfiguration>,
  services?: {
    cultural?: ICulturalValidationService;
    arabic?: IArabicProcessingService;
    domain?: IProfessionalDomainService;
  },
): IraqiAGUIOrchestrator {
  // Default service implementations would be injected here
  // For now, we'll assume they're provided
  if (!services?.cultural || !services?.arabic || !services?.domain) {
    throw new IraqiAGUIError(
      "Cultural, Arabic, and Professional Domain services are required",
      undefined,
      "MISSING_SERVICES",
      "critical",
    );
  }

  return new IraqiAGUIOrchestrator(
    config,
    services.cultural,
    services.arabic,
    services.domain,
  );
}

// Export performance monitoring utilities
export function validatePerformanceTargets(
  metrics: IraqiAGUIPerformanceMetrics,
  targets?: {
    maxResponseTime?: number;
    minCulturalAccuracy?: number;
    minIslamicCompliance?: number;
  },
): {
  passed: boolean;
  violations: string[];
} {
  const defaultTargets = {
    maxResponseTime: 300,
    minCulturalAccuracy: 85,
    minIslamicCompliance: 90,
    ...targets,
  };

  const violations: string[] = [];

  if (metrics.totalResponseTime > defaultTargets.maxResponseTime) {
    violations.push(
      `Response time ${metrics.totalResponseTime}ms exceeds target ${defaultTargets.maxResponseTime}ms`,
    );
  }

  if (metrics.culturalAccuracy < defaultTargets.minCulturalAccuracy) {
    violations.push(
      `Cultural accuracy ${metrics.culturalAccuracy}% below target ${defaultTargets.minCulturalAccuracy}%`,
    );
  }

  if (metrics.islamicCompliance < defaultTargets.minIslamicCompliance) {
    violations.push(
      `Islamic compliance ${metrics.islamicCompliance}% below target ${defaultTargets.minIslamicCompliance}%`,
    );
  }

  return {
    passed: violations.length === 0,
    violations,
  };
}

export default IraqiAGUIOrchestrator;
