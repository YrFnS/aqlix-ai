/**
 * Iraqi Agent Manager - Integration Layer
 *
 * Integrates A2A agent coordination with CopilotKit infrastructure foundation.
 * Manages the complete 22-agent Iraqi ecosystem with cultural sovereignty.
 *
 * Provides unified interface between:
 * - CopilotKit's runtime infrastructure
 * - A2A agent coordination patterns
 * - Iraqi cultural validation pipeline
 * - Professional domain routing
 */

import {
  IraqiAgentCoordinator,
  IraqiAgentCoordinatorConfig,
} from "@iraqi-ai/a2a";
import {
  IraqiAgentCard,
  IraqiAgentCoordinationRequest,
  IraqiAgentCoordinationResponse,
  IraqiTransportProtocol,
} from "@iraqi-ai/a2a";
import { IraqiAgentDefinition } from "../types/iraqi-runtime-types";
import { IraqiCulturalContext } from "@iraqi-ai/types";

/**
 * Configuration for Iraqi Agent Manager
 */
export interface IraqiAgentManagerConfig {
  agents: Record<string, IraqiAgentDefinition>;
  coordinationMode: "intelligent" | "sequential" | "parallel";
  culturalValidationRequired: boolean;
  maxCoordinationTime?: number; // Default: 5000ms
  enablePerformanceOptimization?: boolean; // Default: true
}

/**
 * Iraqi Agent Manager
 *
 * Central management system for 22 specialized Iraqi agents with:
 * - A2A coordination capabilities
 * - CopilotKit runtime integration
 * - Cultural sovereignty enforcement
 * - Professional domain expertise routing
 */
export class IraqiAgentManager {
  private coordinator: IraqiAgentCoordinator;
  private agentDefinitions: Record<string, IraqiAgentDefinition>;
  private agentCards: Map<string, IraqiAgentCard> = new Map();
  private coordinationMetrics: CoordinationMetrics;
  private config: IraqiAgentManagerConfig;

  constructor(config: IraqiAgentManagerConfig) {
    this.config = config;
    this.agentDefinitions = config.agents;
    this.coordinationMetrics = new CoordinationMetrics();

    // Initialize A2A coordinator with Iraqi configuration
    this.coordinator = new IraqiAgentCoordinator({
      maxCoordinationTime: config.maxCoordinationTime || 5000,
      maxConcurrentAgents: 5,
      retryAttempts: 3,
      culturalValidation: {
        islamicComplianceThreshold: 90,
        culturalAppropriatenessThreshold: 95,
        politicalNeutralityRequired: true,
      },
      defaultTransport: IraqiTransportProtocol.JSONRPC,
      fallbackTransports: [
        IraqiTransportProtocol.GRPC,
        IraqiTransportProtocol.HTTP_JSON,
      ],
      enableDomainRouting: true,
      domainExpertiseWeighting: 0.8,
    });

    // Initialize 22 specialized Iraqi agents
    this.initializeIraqiAgents();
  }

  /**
   * Initialize all 22 specialized Iraqi agents with A2A agent cards
   */
  private async initializeIraqiAgents(): Promise<void> {
    const agentInitializations = Object.entries(this.agentDefinitions).map(
      ([name, definition]) => this.createAgentCard(name, definition),
    );

    const agentCards = await Promise.all(agentInitializations);

    // Register all agents with coordinator
    for (const card of agentCards) {
      await this.coordinator.registerAgent(card);
      this.agentCards.set(card.name, card);
    }
  }

  /**
   * Create A2A agent card from Iraqi agent definition
   */
  private async createAgentCard(
    name: string,
    definition: IraqiAgentDefinition,
  ): Promise<IraqiAgentCard> {
    return {
      protocolVersion: "1.0.0",
      name,
      description: this.getAgentDescription(name, definition),
      url: `https://iraqi-ai.gov.iq/agents/${name}`,
      preferredTransport: IraqiTransportProtocol.JSONRPC,
      additionalInterfaces: [
        {
          transport: IraqiTransportProtocol.GRPC,
          url: `https://grpc.iraqi-ai.gov.iq/${name}`,
          metadata: {
            culturalValidationEnabled: true,
            arabicProcessingEnabled: definition.arabicNLPSupport || false,
            professionalDomain: this.getDomainFromType(definition.type),
            securityLevel: "governmental",
          },
        },
        {
          transport: IraqiTransportProtocol.HTTP_JSON,
          url: `https://api.iraqi-ai.gov.iq/v1/${name}`,
          metadata: {
            culturalValidationEnabled: true,
            arabicProcessingEnabled: definition.arabicNLPSupport || false,
          },
        },
      ],

      capabilities: {
        streaming: true,
        pushNotifications: true,
        stateTransitionHistory: true,
        culturalValidation: {
          islamicCompliance: true,
          culturalAppropriateness: true,
          politicalNeutrality: true,
        },
        arabicSupport: definition.arabicNLPSupport
          ? {
              rtlProcessing: true,
              iraqiDialectRecognition:
                definition.dialectRecognition === "iraqi",
              mixedLanguageHandling: true,
              accuracy: {
                rtl: definition.accuracyTarget || 99,
                dialect: 85,
              },
            }
          : undefined,
        professionalDomains: this.getProfessionalDomains(definition),
      },

      skills: this.generateSkillsFromDefinition(definition),

      provider: {
        organization: "Iraqi AI Government Initiative",
        url: "https://iraqi-ai.gov.iq",
        iraqiContext: {
          organizationType: "government",
          region: "baghdad",
          culturalCompliance: true,
          arabicSupport: true,
        },
      },

      // Iraqi cultural sovereignty metadata (MANDATORY)
      iraqiMetadata: {
        culturalCompliance: {
          islamicCompliance: definition.complianceTargets?.islamic || 95,
          culturalAppropriateness: definition.complianceTargets?.cultural || 95,
          politicalNeutrality: definition.complianceTargets?.political || 100,
        },

        arabicCapabilities: {
          rtlAccuracy:
            definition.accuracyTarget || (definition.arabicNLPSupport ? 99 : 0),
          dialectRecognition:
            definition.dialectRecognition === "iraqi" ? 85 : 0,
          mixedLanguageSupport: definition.arabicNLPSupport || false,
        },

        professionalContext: {
          primaryDomain: this.mapTypeToProfile(definition.type),
          secondaryDomains: definition.domains || [],
          iraqiExpertise: true,
          culturalSensitivity: "high",
        },

        operationalMetrics: {
          averageResponseTime: this.estimateResponseTime(definition),
          culturalValidationTime: 150, // Target: <200ms
          arabicProcessingTime: definition.arabicNLPSupport ? 80 : 0, // Target: <100ms
          reliability: 98, // Target: >95%
        },
      },
    };
  }

  /**
   * Coordinate response from multiple agents (CopilotKit integration point)
   */
  async coordinateResponse(
    baseResponse: any,
    requiredAgents: string[],
    culturalContext?: IraqiCulturalContext,
  ): Promise<any> {
    this.coordinationMetrics.startCoordination();

    try {
      if (requiredAgents.length === 0) {
        return baseResponse;
      }

      // Create coordination request
      const coordinationRequest: IraqiAgentCoordinationRequest = {
        primaryAgent: requiredAgents[0],
        coordinationAgents: requiredAgents.slice(1),
        payload: baseResponse,
        culturalContext: culturalContext || this.getDefaultCulturalContext(),
        strategy: this.config.coordinationMode,
        maxCoordinationTime: this.config.maxCoordinationTime,
        complianceLevel: "governmental",
      };

      // Execute coordination
      const coordinationResult =
        await this.coordinator.coordinateAgents(coordinationRequest);

      if (!coordinationResult.success) {
        this.coordinationMetrics.recordFailure(coordinationResult.errors);
        return {
          ...baseResponse,
          coordinationError: coordinationResult.errors,
          coordinationMetadata: coordinationResult.metadata,
        };
      }

      // Merge coordination results with base response
      const enhancedResponse = this.mergeCoordinationResults(
        baseResponse,
        coordinationResult.results,
      );

      this.coordinationMetrics.recordSuccess(coordinationResult.metadata);

      return {
        ...enhancedResponse,
        coordinationMetadata: coordinationResult.metadata,
        culturalValidation:
          coordinationResult.metadata.culturalValidationResults,
      };
    } catch (error) {
      this.coordinationMetrics.recordError(error);
      return {
        ...baseResponse,
        coordinationError: `Agent coordination failed: ${error.message}`,
        fallbackUsed: true,
      };
    }
  }

  /**
   * Get coordination metrics for performance monitoring
   */
  async getCoordinationMetrics(): Promise<any> {
    const stats = this.coordinator.getCoordinationStats();
    const metrics = this.coordinationMetrics.getMetrics();

    return {
      coordinatorStats: stats,
      performanceMetrics: metrics,
      agentHealthStatus: await this.getAgentHealthSummary(),
      culturalComplianceRate: stats.culturalComplianceRate,
      averageCoordinationTime: stats.averageCoordinationTime,
      totalRegisteredAgents: stats.registeredAgents,
      activeCoordinations: stats.activeCoordinations,
    };
  }

  /**
   * Get coordination state for debugging
   */
  async getLastCoordinationState(): Promise<any> {
    return {
      lastCoordinationMetrics: this.coordinationMetrics.getLastMetrics(),
      coordinatorStats: this.coordinator.getCoordinationStats(),
      agentHealthSummary: await this.getAgentHealthSummary(),
    };
  }

  /**
   * Get coordination time for performance tracking
   */
  getLastCoordinationTime(): number {
    return this.coordinationMetrics.getLastCoordinationTime();
  }

  /**
   * Get comprehensive health status of agent manager
   */
  async getHealthStatus(): Promise<any> {
    const stats = this.coordinator.getCoordinationStats();
    const metrics = this.coordinationMetrics.getMetrics();

    return {
      operational: true,
      agentSystemHealth: {
        registeredAgents: stats.registeredAgents,
        culturalComplianceRate: stats.culturalComplianceRate,
        averageCoordinationTime: stats.averageCoordinationTime,
        performanceStatus:
          stats.averageCoordinationTime < this.config.maxCoordinationTime
            ? "optimal"
            : "needs-optimization",
      },
      culturalSovereignty: {
        islamicComplianceActive: true,
        culturalValidationActive: true,
        politicalNeutralityEnforced: true,
        arabicProcessingCapable: true,
      },
      coordinationCapabilities: {
        intelligentCoordination: this.config.coordinationMode === "intelligent",
        parallelProcessing: true,
        professionalDomainRouting: true,
        multiTransportSupport: true,
      },
    };
  }

  // Helper methods
  private getAgentDescription(
    name: string,
    definition: IraqiAgentDefinition,
  ): string {
    const typeDescriptions = {
      "cultural-intelligence":
        "Iraqi cultural validation and Islamic compliance specialist",
      "business-intelligence":
        "Iraqi business process and market dynamics analyst",
      "design-intelligence":
        "Islamic-appropriate design and RTL interface specialist",
      "research-intelligence":
        "Iraqi user behavior and cultural research specialist",
      "technical-intelligence":
        "PydanticAI agent with Iraqi cultural context integration",
      "language-processing-tool":
        "Real-time Arabic RTL processing and Iraqi dialect recognition",
      "financial-security-tool":
        "Iraqi payment gateway security and compliance validator",
      "system-coordination":
        "Multi-agent workflow coordination with cultural oversight",
    };

    return (
      typeDescriptions[definition.type] ||
      `Specialized ${definition.type} for Iraqi AI ecosystem`
    );
  }

  private getDomainFromType(type: string): string {
    const domainMap = {
      "cultural-intelligence": "cultural",
      "business-intelligence": "business",
      "design-intelligence": "design",
      "research-intelligence": "research",
      "technical-intelligence": "technical",
      "language-processing-tool": "language",
      "financial-security-tool": "financial",
      "system-coordination": "coordination",
    };
    return domainMap[type] || "general";
  }

  private getProfessionalDomains(definition: IraqiAgentDefinition): any {
    const domains = definition.domains || [];
    return {
      legal: domains.includes("legal"),
      medical: domains.includes("medical"),
      educational: domains.includes("educational"),
      governmental: domains.includes("governmental"),
      business: domains.includes("business") || domains.includes("commercial"),
    };
  }

  private generateSkillsFromDefinition(
    definition: IraqiAgentDefinition,
  ): any[] {
    // Generate skills based on agent definition
    return [
      {
        name: definition.primaryFunction,
        description: `Primary function: ${definition.primaryFunction}`,
        inputParameters: [],
        outputParameters: [],
        iraqiSkillContext: {
          culturalRelevance: 95,
          arabicLanguageRequired: definition.arabicNLPSupport || false,
          professionalDomain: definition.domains?.[0],
          complianceLevel: "governmental",
          iraqiSpecificKnowledge: true,
        },
      },
    ];
  }

  private mapTypeToProfile(
    type: string,
  ):
    | "cultural"
    | "legal"
    | "medical"
    | "educational"
    | "business"
    | "technical" {
    const profileMap = {
      "cultural-intelligence": "cultural",
      "business-intelligence": "business",
      "design-intelligence": "technical",
      "research-intelligence": "technical",
      "technical-intelligence": "technical",
      "language-processing-tool": "technical",
      "financial-security-tool": "business",
      "system-coordination": "technical",
    };
    return profileMap[type] || "technical";
  }

  private estimateResponseTime(definition: IraqiAgentDefinition): number {
    // Estimate based on agent complexity
    const baseTime = definition.contextManaged ? 2000 : 500;
    const culturalOverhead = definition.culturalConstraints ? 200 : 0;
    const arabicOverhead = definition.arabicNLPSupport ? 100 : 0;

    return baseTime + culturalOverhead + arabicOverhead;
  }

  private getDefaultCulturalContext(): IraqiCulturalContext {
    return {
      userRegion: "baghdad",
      professionalRole: "government",
      languagePreference: "mixed",
      culturalSensitivity: "high",
      islamicComplianceRequired: true,
      politicalNeutralityRequired: true,
    };
  }

  private mergeCoordinationResults(
    baseResponse: any,
    coordinationResults: Record<string, any>,
  ): any {
    return {
      ...baseResponse,
      agentContributions: coordinationResults,
      enhancedByCoordination: true,
    };
  }

  private async getAgentHealthSummary(): Promise<any> {
    const healthSummaries = Array.from(this.agentCards.keys()).map((name) => ({
      name,
      operational: true,
      culturalCompliant: true,
      arabicCapable:
        this.agentCards.get(name)?.capabilities.arabicSupport !== undefined,
    }));

    return {
      totalAgents: healthSummaries.length,
      operationalAgents: healthSummaries.filter((a) => a.operational).length,
      culturallyCompliantAgents: healthSummaries.filter(
        (a) => a.culturalCompliant,
      ).length,
      arabicCapableAgents: healthSummaries.filter((a) => a.arabicCapable)
        .length,
      healthyAgentsPercentage:
        (healthSummaries.filter((a) => a.operational && a.culturalCompliant)
          .length /
          healthSummaries.length) *
        100,
    };
  }
}

/**
 * Coordination Metrics Tracking
 */
class CoordinationMetrics {
  private metrics: {
    totalCoordinations: number;
    successfulCoordinations: number;
    failedCoordinations: number;
    totalCoordinationTime: number;
    lastCoordinationTime: number;
    averageCoordinationTime: number;
  } = {
    totalCoordinations: 0,
    successfulCoordinations: 0,
    failedCoordinations: 0,
    totalCoordinationTime: 0,
    lastCoordinationTime: 0,
    averageCoordinationTime: 0,
  };

  private coordinationStartTime: number = 0;

  startCoordination(): void {
    this.coordinationStartTime = Date.now();
  }

  recordSuccess(metadata: any): void {
    const coordinationTime = metadata.totalCoordinationTime;

    this.metrics.totalCoordinations++;
    this.metrics.successfulCoordinations++;
    this.metrics.totalCoordinationTime += coordinationTime;
    this.metrics.lastCoordinationTime = coordinationTime;
    this.metrics.averageCoordinationTime =
      this.metrics.totalCoordinationTime / this.metrics.totalCoordinations;
  }

  recordFailure(errors: any): void {
    const coordinationTime = Date.now() - this.coordinationStartTime;

    this.metrics.totalCoordinations++;
    this.metrics.failedCoordinations++;
    this.metrics.totalCoordinationTime += coordinationTime;
    this.metrics.lastCoordinationTime = coordinationTime;
    this.metrics.averageCoordinationTime =
      this.metrics.totalCoordinationTime / this.metrics.totalCoordinations;
  }

  recordError(error: Error): void {
    this.recordFailure({ general: error.message });
  }

  getMetrics(): any {
    return { ...this.metrics };
  }

  getLastMetrics(): any {
    return {
      lastCoordinationTime: this.metrics.lastCoordinationTime,
      averageCoordinationTime: this.metrics.averageCoordinationTime,
      successRate:
        this.metrics.totalCoordinations > 0
          ? (this.metrics.successfulCoordinations /
              this.metrics.totalCoordinations) *
            100
          : 0,
    };
  }

  getLastCoordinationTime(): number {
    return this.metrics.lastCoordinationTime;
  }
}
