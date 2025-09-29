/**
 * Enhanced Workflow Execution Engine
 * With Iraqi Cultural Intelligence Integration
 */

import type {
  WorkflowContext,
  WorkflowNode,
  WorkflowEdge,
  ExecutionResult,
  ExecutionContext,
  BlockConfig,
  CulturalComplianceConfig,
} from "./types";

import {
  validateCulturalCompliance,
  processArabicText,
  executeWithCulturalValidation,
  createDefaultCulturalConfig,
} from "./utils";

import { getBlock } from "./registry";

// ============================================================================
// WORKFLOW EXECUTION ENGINE
// ============================================================================

export class WorkflowExecutor {
  private context: WorkflowContext;
  private executionQueue: Map<string, Promise<ExecutionResult>>;
  private results: Map<string, ExecutionResult>;

  constructor(context: WorkflowContext) {
    this.context = context;
    this.executionQueue = new Map();
    this.results = new Map();
  }

  /**
   * Execute the entire workflow with cultural validation
   */
  async executeWorkflow(startNodeId?: string): Promise<{
    success: boolean;
    results: Map<string, ExecutionResult>;
    culturalValidation: {
      overallScore: number;
      passedNodes: string[];
      failedNodes: string[];
      issues: string[];
    };
  }> {
    try {
      // Find starting nodes
      const startingNodes = startNodeId
        ? [this.context.nodes.find((n) => n.id === startNodeId)!]
        : this.getStartingNodes();

      if (startingNodes.length === 0) {
        throw new Error("No starting nodes found in workflow");
      }

      // Execute nodes in topological order
      const executionOrder = this.getExecutionOrder();
      const culturalResults = {
        overallScore: 0,
        passedNodes: [] as string[],
        failedNodes: [] as string[],
        issues: [] as string[],
      };

      let totalScore = 0;
      let validationCount = 0;

      for (const nodeId of executionOrder) {
        const result = await this.executeNode(nodeId);
        this.results.set(nodeId, result);

        // Aggregate cultural validation results
        if (result.culturalValidation) {
          totalScore += result.culturalValidation.score;
          validationCount++;

          if (result.culturalValidation.passed) {
            culturalResults.passedNodes.push(nodeId);
          } else {
            culturalResults.failedNodes.push(nodeId);
            culturalResults.issues.push(...result.culturalValidation.issues);
          }
        }
      }

      culturalResults.overallScore =
        validationCount > 0 ? totalScore / validationCount : 100;

      return {
        success: culturalResults.failedNodes.length === 0,
        results: this.results,
        culturalValidation: culturalResults,
      };
    } catch (error) {
      throw new Error(
        `Workflow execution failed: ${error instanceof Error ? error.message : error}`,
      );
    }
  }

  /**
   * Execute a single node with cultural validation
   */
  async executeNode(nodeId: string): Promise<ExecutionResult> {
    const node = this.context.nodes.find((n) => n.id === nodeId);
    if (!node) {
      throw new Error(`Node ${nodeId} not found`);
    }

    const blockConfig = getBlock(node.type);
    if (!blockConfig) {
      throw new Error(`Block type ${node.type} not found in registry`);
    }

    // Create execution context
    const executionContext: ExecutionContext = {
      workflowId: "workflow-id", // This would come from the workflow context
      nodeId: node.id,
      userId: "user-id", // This would come from the session context
      culturalSettings: this.context.culturalSettings,
      language: this.context.language,
      metadata: {},
    };

    // Execute with cultural validation
    return executeWithCulturalValidation(
      () => this.executeBlockLogic(node, blockConfig, executionContext),
      {
        culturalSettings: this.context.culturalSettings,
        language: this.context.language,
      },
    );
  }

  /**
   * Execute the core block logic
   */
  private async executeBlockLogic(
    node: WorkflowNode,
    blockConfig: BlockConfig,
    context: ExecutionContext,
  ): Promise<any> {
    // Get input values from connected nodes
    const inputs = await this.resolveNodeInputs(node);

    // Process inputs based on block configuration
    const processedInputs = await this.processInputs(
      inputs,
      blockConfig,
      context,
    );

    // Execute the block's specific logic
    switch (node.type) {
      case "cultural_validator":
        return this.executeCulturalValidator(processedInputs, context);

      case "arabic_processor":
        return this.executeArabicProcessor(processedInputs, context);

      case "iraqi_payment":
        return this.executeIraqiPayment(processedInputs, context);

      case "starter":
        return this.executeStarter(processedInputs, context);

      case "response":
        return this.executeResponse(processedInputs, context);

      default:
        // For blocks not yet implemented, return a placeholder
        return this.executeGenericBlock(
          node,
          processedInputs,
          blockConfig,
          context,
        );
    }
  }

  // ============================================================================
  // BLOCK EXECUTION IMPLEMENTATIONS
  // ============================================================================

  private async executeCulturalValidator(
    inputs: Record<string, any>,
    context: ExecutionContext,
  ): Promise<any> {
    const { content, compliance_level, professional_domain } = inputs;

    const culturalConfig: CulturalComplianceConfig = {
      islamicCompliance: {
        enabled: true,
        level: compliance_level || "standard",
        validators: ["content-filter", "context-validator"],
      },
      languageSupport: {
        arabic: true,
        iraqiDialect: true,
        rtlLayout: true,
        mixedContent: true,
      },
      professionalDomains: {
        legal: professional_domain === "legal",
        medical: professional_domain === "medical",
        educational: professional_domain === "educational",
        organizational: professional_domain === "organizational",
      },
      paymentIntegration: {
        zainCash: false,
        fastPay: false,
        nassWallet: false,
        securityLevel: "standard",
      },
    };

    const validation = validateCulturalCompliance(content, culturalConfig);

    return {
      validation_result: validation,
      passed: validation.passed,
      score: validation.score,
      issues: validation.issues,
    };
  }

  private async executeArabicProcessor(
    inputs: Record<string, any>,
    context: ExecutionContext,
  ): Promise<any> {
    const { arabic_text, processing_options } = inputs;

    const result = processArabicText(arabic_text, {
      rtlSupport: processing_options?.rtl_support || true,
      dialectRecognition: processing_options?.dialect_recognition || true,
      mixedContent: processing_options?.mixed_content || true,
    });

    return {
      processed_text: result.processedText,
      metadata: result.metadata,
    };
  }

  private async executeIraqiPayment(
    inputs: Record<string, any>,
    context: ExecutionContext,
  ): Promise<any> {
    const { gateway, amount, security_level } = inputs;

    // This would integrate with actual Iraqi payment gateways
    // For now, return a mock response
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Simulate payment processing
    const success = Math.random() > 0.1; // 90% success rate
    const securityScore = security_level === "enhanced" ? 95 : 85;

    return {
      transaction_result: {
        success,
        gateway,
        amount,
        currency: "IQD",
        timestamp: new Date().toISOString(),
      },
      transaction_id: transactionId,
      status: success ? "success" : "failed",
      security_score: securityScore,
    };
  }

  private async executeStarter(
    inputs: Record<string, any>,
    context: ExecutionContext,
  ): Promise<any> {
    // Starter block simply passes through or initializes workflow
    return {
      output: inputs || {},
      timestamp: new Date().toISOString(),
      workflow_id: context.workflowId,
    };
  }

  private async executeResponse(
    inputs: Record<string, any>,
    context: ExecutionContext,
  ): Promise<any> {
    const { message } = inputs;

    // Process message for Arabic support if needed
    if (context.language === "ar" || context.language === "mixed") {
      const processed = processArabicText(message, {
        rtlSupport: true,
        dialectRecognition: true,
        mixedContent: true,
      });

      return {
        response: processed.processedText,
        metadata: processed.metadata,
        language: context.language,
      };
    }

    return { response: message, language: context.language };
  }

  private async executeGenericBlock(
    node: WorkflowNode,
    inputs: Record<string, any>,
    blockConfig: BlockConfig,
    context: ExecutionContext,
  ): Promise<any> {
    // Generic execution for blocks not yet specifically implemented
    // This would be expanded as more blocks are extracted from Sim Studio
    return {
      output: inputs,
      block_type: node.type,
      executed_at: new Date().toISOString(),
      cultural_context: node.culturalContext || null,
    };
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private async resolveNodeInputs(
    node: WorkflowNode,
  ): Promise<Record<string, any>> {
    const inputs: Record<string, any> = { ...node.data };

    // Find incoming edges and resolve connected values
    const incomingEdges = this.context.edges.filter(
      (edge) => edge.target === node.id,
    );

    for (const edge of incomingEdges) {
      const sourceResult = this.results.get(edge.source);
      if (sourceResult && sourceResult.success && sourceResult.output) {
        // Map source output to target input based on edge configuration
        const sourceKey = edge.data?.sourceKey || "output";
        const targetKey = edge.data?.targetKey || "input";

        inputs[targetKey] =
          sourceResult.output[sourceKey] || sourceResult.output;
      }
    }

    return inputs;
  }

  private async processInputs(
    inputs: Record<string, any>,
    blockConfig: BlockConfig,
    context: ExecutionContext,
  ): Promise<Record<string, any>> {
    const processed: Record<string, any> = {};

    for (const [key, value] of Object.entries(inputs)) {
      const inputConfig = blockConfig.inputs[key];

      if (inputConfig) {
        // Apply cultural validation if required
        if (inputConfig.culturalValidation && typeof value === "string") {
          const validation = validateCulturalCompliance(
            value,
            context.culturalSettings,
          );
          if (!validation.passed) {
            throw new Error(
              `Cultural validation failed for input ${key}: ${validation.issues.join(", ")}`,
            );
          }
        }

        // Process Arabic text if supported
        if (inputConfig.arabicSupport && typeof value === "string") {
          const arabicResult = processArabicText(value, {
            rtlSupport: context.culturalSettings.languageSupport.rtlLayout,
            dialectRecognition:
              context.culturalSettings.languageSupport.iraqiDialect,
            mixedContent: context.culturalSettings.languageSupport.mixedContent,
          });
          processed[key] = arabicResult.processedText;
        } else {
          processed[key] = value;
        }
      } else {
        processed[key] = value;
      }
    }

    return processed;
  }

  private getStartingNodes(): WorkflowNode[] {
    // Find nodes with no incoming edges
    const nodeIds = new Set(this.context.nodes.map((n) => n.id));
    const targetIds = new Set(this.context.edges.map((e) => e.target));

    const startingNodeIds = Array.from(nodeIds).filter(
      (id) => !targetIds.has(id),
    );
    return this.context.nodes.filter((node) =>
      startingNodeIds.includes(node.id),
    );
  }

  private getExecutionOrder(): string[] {
    // Topological sort to determine execution order
    const visited = new Set<string>();
    const visiting = new Set<string>();
    const order: string[] = [];

    const visit = (nodeId: string) => {
      if (visiting.has(nodeId)) {
        throw new Error(
          `Circular dependency detected involving node ${nodeId}`,
        );
      }

      if (!visited.has(nodeId)) {
        visiting.add(nodeId);

        // Visit dependencies first
        const incomingEdges = this.context.edges.filter(
          (edge) => edge.target === nodeId,
        );
        for (const edge of incomingEdges) {
          visit(edge.source);
        }

        visiting.delete(nodeId);
        visited.add(nodeId);
        order.push(nodeId);
      }
    };

    // Start with all nodes that have no incoming edges
    const startingNodes = this.getStartingNodes();
    for (const node of startingNodes) {
      visit(node.id);
    }

    // Visit any remaining nodes (shouldn't happen in a well-formed workflow)
    for (const node of this.context.nodes) {
      if (!visited.has(node.id)) {
        visit(node.id);
      }
    }

    return order;
  }
}

// ============================================================================
// EXECUTION UTILITIES
// ============================================================================

export function createWorkflowExecutor(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  culturalSettings?: CulturalComplianceConfig,
  language: "en" | "ar" | "mixed" = "en",
): WorkflowExecutor {
  const context: WorkflowContext = {
    nodes,
    edges,
    culturalSettings: culturalSettings || createDefaultCulturalConfig(),
    language,
    rtlMode: language === "ar",
  };

  return new WorkflowExecutor(context);
}

export async function executeSimpleWorkflow(
  blockType: string,
  inputs: Record<string, any>,
  culturalSettings?: CulturalComplianceConfig,
): Promise<ExecutionResult> {
  const node: WorkflowNode = {
    id: "single-node",
    type: blockType,
    position: { x: 0, y: 0 },
    data: inputs,
  };

  const executor = createWorkflowExecutor([node], [], culturalSettings);
  return executor.executeNode("single-node");
}
