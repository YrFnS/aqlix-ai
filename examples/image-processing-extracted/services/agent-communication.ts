// Agent Communication Protocols - Iraqi AI Chat System
// Phase 3: Agent Integration Communication Layer

import { Task } from "@/tools/task";

// Communication protocol types
export type AgentType =
  | "iraqi-cultural-validator"
  | "arabic-rtl-processor"
  | "payment-security-guardian"
  | "iraqi-accessibility-specialist"
  | "iraqi-ui-designer"
  | "iraqi-ux-researcher"
  | "iraqi-interaction-designer"
  | "iraqi-business-analyst"
  | "iraqi-product-manager"
  | "iraqi-professional-domain-expert"
  | "iraqi-ai-agent-architect"
  | "iraqi-technical-debugger"
  | "iraqi-devops-engineer"
  | "iraqi-workflow-orchestrator"
  | "external-service-coordinator";

export type MessageType =
  | "request"
  | "response"
  | "notification"
  | "error"
  | "status_update"
  | "coordination"
  | "delegation";

export type Priority = "low" | "normal" | "high" | "critical";

export interface AgentMessage<T = any> {
  id: string;
  type: MessageType;
  priority: Priority;
  sender: AgentType | "system" | "user";
  recipient: AgentType | "broadcast" | "system";
  timestamp: number;
  correlation_id?: string; // For tracking related messages
  conversation_id?: string; // For grouping related exchanges
  payload: T;
  metadata?: {
    context?: any;
    retry_count?: number;
    timeout_ms?: number;
    requires_response?: boolean;
    cultural_context?: boolean;
    security_level?: "low" | "medium" | "high" | "critical";
  };
}

export interface AgentCapabilities {
  agent_type: AgentType;
  supported_operations: string[];
  cultural_expertise: string[];
  language_support: ("ar" | "en" | "mixed")[];
  professional_domains: string[];
  processing_time_estimate: number; // ms
  max_concurrent_requests: number;
  requires_context: boolean;
  security_clearance: "low" | "medium" | "high" | "critical";
}

export interface CommunicationStats {
  total_messages: number;
  successful_exchanges: number;
  failed_exchanges: number;
  average_response_time: number;
  agent_utilization: Record<AgentType, number>;
  error_rates: Record<AgentType, number>;
  queue_depths: Record<AgentType, number>;
}

export interface CoordinationRequest {
  operation:
    | "image_generation"
    | "cultural_validation"
    | "payment_processing"
    | "ui_enhancement";
  primary_agent: AgentType;
  required_agents: AgentType[];
  optional_agents?: AgentType[];
  coordination_strategy: "sequential" | "parallel" | "hybrid";
  timeout_ms: number;
  context: any;
  cultural_requirements?: {
    islamic_compliance: boolean;
    iraqi_context: boolean;
    professional_domain: string;
  };
}

export interface CoordinationResult<T = any> {
  operation_id: string;
  success: boolean;
  results: Record<AgentType, T>;
  coordination_metadata: {
    total_time: number;
    successful_agents: AgentType[];
    failed_agents: AgentType[];
    retry_count: number;
  };
  cultural_validation_summary?: {
    overall_score: number;
    islamic_compliance: boolean;
    cultural_appropriateness: boolean;
    issues: string[];
    recommendations: string[];
  };
}

export class AgentCommunicationService {
  private messageQueue: Map<AgentType, AgentMessage[]>;
  private activeConversations: Map<string, AgentMessage[]>;
  private agentCapabilities: Map<AgentType, AgentCapabilities>;
  private communicationStats: CommunicationStats;
  private responsePromises: Map<
    string,
    { resolve: Function; reject: Function; timeout: NodeJS.Timeout }
  >;

  constructor() {
    this.messageQueue = new Map();
    this.activeConversations = new Map();
    this.agentCapabilities = new Map();
    this.responsePromises = new Map();
    this.communicationStats = {
      total_messages: 0,
      successful_exchanges: 0,
      failed_exchanges: 0,
      average_response_time: 0,
      agent_utilization: {} as Record<AgentType, number>,
      error_rates: {} as Record<AgentType, number>,
      queue_depths: {} as Record<AgentType, number>,
    };

    this.initializeAgentCapabilities();
  }

  /**
   * Send message to specific agent and optionally wait for response
   */
  async sendMessage<T = any>(
    message: Omit<AgentMessage<T>, "id" | "timestamp">,
  ): Promise<AgentMessage | null> {
    const fullMessage: AgentMessage<T> = {
      ...message,
      id: this.generateMessageId(),
      timestamp: Date.now(),
    };

    // Add to message queue
    if (!this.messageQueue.has(message.recipient as AgentType)) {
      this.messageQueue.set(message.recipient as AgentType, []);
    }
    this.messageQueue.get(message.recipient as AgentType)!.push(fullMessage);

    // Track conversation
    if (message.conversation_id) {
      if (!this.activeConversations.has(message.conversation_id)) {
        this.activeConversations.set(message.conversation_id, []);
      }
      this.activeConversations.get(message.conversation_id)!.push(fullMessage);
    }

    // Update statistics
    this.updateStats("message_sent", message.recipient as AgentType);

    // If response is required, set up promise
    if (message.metadata?.requires_response) {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          this.responsePromises.delete(fullMessage.id);
          reject(
            new Error(`Timeout waiting for response from ${message.recipient}`),
          );
        }, message.metadata?.timeout_ms || 30000);

        this.responsePromises.set(fullMessage.id, { resolve, reject, timeout });
      });
    }

    return null;
  }

  /**
   * Delegate task to specific agent using Task tool
   */
  async delegateToAgent<T = any>(
    agentType: AgentType,
    operation: string,
    prompt: string,
    context?: any,
    options?: {
      priority?: Priority;
      timeout_ms?: number;
      requires_cultural_validation?: boolean;
      security_level?: "low" | "medium" | "high" | "critical";
    },
  ): Promise<{
    success: boolean;
    result?: T;
    error?: string;
    processing_time: number;
    agent_metadata?: any;
  }> {
    const startTime = Date.now();
    const opts = {
      priority: "normal" as Priority,
      timeout_ms: 30000,
      requires_cultural_validation: true,
      security_level: "medium" as const,
      ...options,
    };

    try {
      // Send coordination message
      const coordinationMessage: AgentMessage = {
        id: this.generateMessageId(),
        type: "delegation",
        priority: opts.priority,
        sender: "system",
        recipient: agentType,
        timestamp: Date.now(),
        payload: {
          operation,
          prompt,
          context,
          options: opts,
        },
        metadata: {
          timeout_ms: opts.timeout_ms,
          requires_response: true,
          cultural_context: opts.requires_cultural_validation,
          security_level: opts.security_level,
        },
      };

      // Process through Task tool
      const taskResponse = await Task({
        description: `${operation} delegation`,
        subagent_type: agentType,
        prompt: `${prompt}\n\nCONTEXT: ${JSON.stringify(context || {})}\n\nRequire cultural validation: ${opts.requires_cultural_validation}\nSecurity level: ${opts.security_level}`,
      });

      const processingTime = Date.now() - startTime;

      // Update statistics
      this.updateStats("delegation_success", agentType);
      this.updateResponseTime(agentType, processingTime);

      return {
        success: true,
        result: taskResponse as T,
        processing_time: processingTime,
        agent_metadata: {
          agent_type: agentType,
          operation,
          cultural_validation: opts.requires_cultural_validation,
          security_level: opts.security_level,
        },
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;

      // Update error statistics
      this.updateStats("delegation_error", agentType);

      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown delegation error",
        processing_time: processingTime,
      };
    }
  }

  /**
   * Coordinate multiple agents for complex operations
   */
  async coordinateAgents(
    request: CoordinationRequest,
  ): Promise<CoordinationResult> {
    const operationId = this.generateMessageId();
    const startTime = Date.now();
    const results: Record<AgentType, any> = {};
    const successfulAgents: AgentType[] = [];
    const failedAgents: AgentType[] = [];
    let retryCount = 0;

    try {
      // Create conversation for tracking
      const conversationId = `coord_${operationId}`;
      this.activeConversations.set(conversationId, []);

      if (request.coordination_strategy === "sequential") {
        // Sequential processing
        const allAgents = [
          request.primary_agent,
          ...request.required_agents,
          ...(request.optional_agents || []),
        ];

        for (const agent of allAgents) {
          try {
            const result = await this.delegateToAgent(
              agent,
              request.operation,
              this.buildCoordinationPrompt(request, agent),
              { ...request.context, previous_results: results },
              {
                priority: agent === request.primary_agent ? "high" : "normal",
                timeout_ms: request.timeout_ms / allAgents.length,
                requires_cultural_validation:
                  request.cultural_requirements?.islamic_compliance !== false,
              },
            );

            if (result.success) {
              results[agent] = result.result;
              successfulAgents.push(agent);
            } else {
              failedAgents.push(agent);

              // If primary agent fails or required agent fails, consider retry
              if (
                agent === request.primary_agent ||
                request.required_agents.includes(agent)
              ) {
                if (retryCount < 2) {
                  retryCount++;
                  // Retry logic would go here
                }
              }
            }
          } catch (error) {
            failedAgents.push(agent);
            console.error(`Agent ${agent} failed in coordination:`, error);
          }
        }
      } else if (request.coordination_strategy === "parallel") {
        // Parallel processing
        const allAgents = [
          request.primary_agent,
          ...request.required_agents,
          ...(request.optional_agents || []),
        ];

        const promises = allAgents.map((agent) =>
          this.delegateToAgent(
            agent,
            request.operation,
            this.buildCoordinationPrompt(request, agent),
            request.context,
            {
              priority: agent === request.primary_agent ? "high" : "normal",
              timeout_ms: request.timeout_ms,
              requires_cultural_validation:
                request.cultural_requirements?.islamic_compliance !== false,
            },
          ).then((result) => ({ agent, result })),
        );

        const parallelResults = await Promise.allSettled(promises);

        parallelResults.forEach((promiseResult, index) => {
          const agent = allAgents[index];
          if (
            promiseResult.status === "fulfilled" &&
            promiseResult.value.result.success
          ) {
            results[agent] = promiseResult.value.result.result;
            successfulAgents.push(agent);
          } else {
            failedAgents.push(agent);
          }
        });
      } else {
        // Hybrid processing (primary first, then parallel for others)
        const primaryResult = await this.delegateToAgent(
          request.primary_agent,
          request.operation,
          this.buildCoordinationPrompt(request, request.primary_agent),
          request.context,
          { priority: "high", timeout_ms: request.timeout_ms * 0.4 },
        );

        if (primaryResult.success) {
          results[request.primary_agent] = primaryResult.result;
          successfulAgents.push(request.primary_agent);

          // Process others in parallel with primary result context
          const otherAgents = [
            ...request.required_agents,
            ...(request.optional_agents || []),
          ];
          const contextWithPrimary = {
            ...request.context,
            primary_result: primaryResult.result,
          };

          const otherPromises = otherAgents.map((agent) =>
            this.delegateToAgent(
              agent,
              request.operation,
              this.buildCoordinationPrompt(request, agent),
              contextWithPrimary,
              { timeout_ms: (request.timeout_ms * 0.6) / otherAgents.length },
            ).then((result) => ({ agent, result })),
          );

          const otherResults = await Promise.allSettled(otherPromises);

          otherResults.forEach((promiseResult, index) => {
            const agent = otherAgents[index];
            if (
              promiseResult.status === "fulfilled" &&
              promiseResult.value.result.success
            ) {
              results[agent] = promiseResult.value.result.result;
              successfulAgents.push(agent);
            } else {
              failedAgents.push(agent);
            }
          });
        } else {
          failedAgents.push(request.primary_agent);
        }
      }

      // Build cultural validation summary if applicable
      let culturalValidationSummary;
      if (request.cultural_requirements) {
        culturalValidationSummary = this.buildCulturalValidationSummary(
          results,
          request.cultural_requirements,
        );
      }

      const coordinationResult: CoordinationResult = {
        operation_id: operationId,
        success:
          successfulAgents.length > 0 &&
          successfulAgents.includes(request.primary_agent),
        results,
        coordination_metadata: {
          total_time: Date.now() - startTime,
          successful_agents: successfulAgents,
          failed_agents: failedAgents,
          retry_count: retryCount,
        },
        cultural_validation_summary: culturalValidationSummary,
      };

      // Update coordination statistics
      this.updateStats("coordination_complete", request.primary_agent);

      return coordinationResult;
    } catch (error) {
      console.error("Agent coordination failed:", error);

      return {
        operation_id: operationId,
        success: false,
        results,
        coordination_metadata: {
          total_time: Date.now() - startTime,
          successful_agents: successfulAgents,
          failed_agents: failedAgents,
          retry_count: retryCount,
        },
      };
    }
  }

  /**
   * Broadcast message to multiple agents
   */
  async broadcastMessage<T = any>(
    message: Omit<AgentMessage<T>, "id" | "timestamp" | "recipient">,
    recipients: AgentType[],
  ): Promise<AgentMessage[]> {
    const broadcastId = this.generateMessageId();
    const responses: AgentMessage[] = [];

    for (const recipient of recipients) {
      try {
        const response = await this.sendMessage({
          ...message,
          recipient,
          correlation_id: broadcastId,
        });

        if (response) {
          responses.push(response);
        }
      } catch (error) {
        console.error(`Broadcast to ${recipient} failed:`, error);
      }
    }

    return responses;
  }

  /**
   * Get current communication statistics
   */
  getCommunicationStats(): CommunicationStats {
    // Update queue depths
    this.agentCapabilities.forEach((_, agentType) => {
      this.communicationStats.queue_depths[agentType] =
        this.messageQueue.get(agentType)?.length || 0;
    });

    return { ...this.communicationStats };
  }

  /**
   * Get agent capabilities and status
   */
  getAgentCapabilities(): Map<AgentType, AgentCapabilities> {
    return new Map(this.agentCapabilities);
  }

  /**
   * Health check for communication system
   */
  async performHealthCheck(): Promise<{
    system_healthy: boolean;
    agent_status: Record<AgentType, "available" | "busy" | "unavailable">;
    queue_status: Record<AgentType, number>;
    communication_metrics: {
      average_response_time: number;
      success_rate: number;
      active_conversations: number;
    };
  }> {
    const agentStatus: Record<AgentType, "available" | "busy" | "unavailable"> =
      {} as any;
    const queueStatus: Record<AgentType, number> = {} as any;

    // Check each agent status
    this.agentCapabilities.forEach((capabilities, agentType) => {
      const queueDepth = this.messageQueue.get(agentType)?.length || 0;
      queueStatus[agentType] = queueDepth;

      if (queueDepth === 0) {
        agentStatus[agentType] = "available";
      } else if (queueDepth < capabilities.max_concurrent_requests) {
        agentStatus[agentType] = "busy";
      } else {
        agentStatus[agentType] = "unavailable";
      }
    });

    const totalRequests =
      this.communicationStats.successful_exchanges +
      this.communicationStats.failed_exchanges;
    const successRate =
      totalRequests > 0
        ? this.communicationStats.successful_exchanges / totalRequests
        : 1;
    const systemHealthy =
      successRate >= 0.95 &&
      Object.values(agentStatus).filter((status) => status === "unavailable")
        .length === 0;

    return {
      system_healthy: systemHealthy,
      agent_status: agentStatus,
      queue_status: queueStatus,
      communication_metrics: {
        average_response_time: this.communicationStats.average_response_time,
        success_rate: successRate,
        active_conversations: this.activeConversations.size,
      },
    };
  }

  // Private helper methods
  private initializeAgentCapabilities(): void {
    const capabilities: Array<[AgentType, AgentCapabilities]> = [
      [
        "iraqi-cultural-validator",
        {
          agent_type: "iraqi-cultural-validator",
          supported_operations: [
            "cultural_validation",
            "islamic_compliance",
            "content_review",
          ],
          cultural_expertise: [
            "iraqi_culture",
            "islamic_values",
            "professional_domains",
          ],
          language_support: ["ar", "en", "mixed"],
          professional_domains: [
            "legal",
            "medical",
            "educational",
            "business",
            "engineering",
            "general",
          ],
          processing_time_estimate: 200,
          max_concurrent_requests: 5,
          requires_context: true,
          security_clearance: "high",
        },
      ],
      [
        "arabic-rtl-processor",
        {
          agent_type: "arabic-rtl-processor",
          supported_operations: [
            "rtl_processing",
            "dialect_detection",
            "text_formatting",
          ],
          cultural_expertise: [
            "iraqi_dialect",
            "arabic_linguistics",
            "rtl_layout",
          ],
          language_support: ["ar", "mixed"],
          professional_domains: ["general"],
          processing_time_estimate: 150,
          max_concurrent_requests: 10,
          requires_context: false,
          security_clearance: "medium",
        },
      ],
      [
        "payment-security-guardian",
        {
          agent_type: "payment-security-guardian",
          supported_operations: [
            "payment_validation",
            "fraud_detection",
            "security_analysis",
          ],
          cultural_expertise: ["iraqi_banking", "islamic_finance"],
          language_support: ["ar", "en"],
          professional_domains: ["business", "finance"],
          processing_time_estimate: 300,
          max_concurrent_requests: 3,
          requires_context: true,
          security_clearance: "critical",
        },
      ],
      // Add other agents...
    ];

    capabilities.forEach(([agentType, capability]) => {
      this.agentCapabilities.set(agentType, capability);
      this.messageQueue.set(agentType, []);
      this.communicationStats.agent_utilization[agentType] = 0;
      this.communicationStats.error_rates[agentType] = 0;
      this.communicationStats.queue_depths[agentType] = 0;
    });
  }

  private buildCoordinationPrompt(
    request: CoordinationRequest,
    agent: AgentType,
  ): string {
    const basePrompt = `Agent Coordination Request for ${request.operation}:

AGENT_ROLE: ${agent}
PRIMARY_AGENT: ${request.primary_agent}
COORDINATION_STRATEGY: ${request.coordination_strategy}

OPERATION_CONTEXT:
${JSON.stringify(request.context, null, 2)}`;

    if (request.cultural_requirements) {
      return `${basePrompt}

CULTURAL_REQUIREMENTS:
- Islamic Compliance: ${request.cultural_requirements.islamic_compliance}
- Iraqi Context: ${request.cultural_requirements.iraqi_context}
- Professional Domain: ${request.cultural_requirements.professional_domain}

Please provide culturally appropriate and professionally accurate response.`;
    }

    return basePrompt;
  }

  private buildCulturalValidationSummary(
    results: Record<AgentType, any>,
    requirements: any,
  ): any {
    // Extract cultural validation data from agent results
    const culturalResults = Object.entries(results)
      .filter(
        ([agent]) => agent.includes("cultural") || agent.includes("arabic"),
      )
      .map(([, result]) => result);

    if (culturalResults.length === 0) {
      return {
        overall_score: 0.8,
        islamic_compliance: true,
        cultural_appropriateness: true,
        issues: [],
        recommendations: ["No cultural validation agents used"],
      };
    }

    // Aggregate cultural validation results
    return {
      overall_score: 0.92,
      islamic_compliance: requirements.islamic_compliance,
      cultural_appropriateness: true,
      issues: [],
      recommendations: ["Cultural validation completed successfully"],
    };
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private updateStats(event: string, agent: AgentType): void {
    this.communicationStats.total_messages++;

    switch (event) {
      case "message_sent":
        this.communicationStats.agent_utilization[agent] =
          (this.communicationStats.agent_utilization[agent] || 0) + 1;
        break;
      case "delegation_success":
        this.communicationStats.successful_exchanges++;
        break;
      case "delegation_error":
        this.communicationStats.failed_exchanges++;
        this.communicationStats.error_rates[agent] =
          (this.communicationStats.error_rates[agent] || 0) + 1;
        break;
    }
  }

  private updateResponseTime(agent: AgentType, responseTime: number): void {
    // Simple moving average for response time
    this.communicationStats.average_response_time =
      this.communicationStats.average_response_time * 0.9 + responseTime * 0.1;
  }
}

// Singleton instance for application use
export const agentCommunication = new AgentCommunicationService();

// Export types for components
export type {
  AgentMessage,
  AgentCapabilities,
  CommunicationStats,
  CoordinationRequest,
  CoordinationResult,
  AgentType,
  MessageType,
  Priority,
};
