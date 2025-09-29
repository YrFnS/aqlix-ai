// Agent Workflow Orchestration - Iraqi AI Chat System
// Phase 3: Agent Integration Workflow Management

import { Task } from "@/tools/task";
import {
  agentCommunication,
  CoordinationRequest,
  AgentType,
} from "./agent-communication";
import { arabicProcessor, ArabicProcessingRequest } from "./arabic-processor";
import { paymentSecurity, PaymentSecurityRequest } from "./payment-security";

// Workflow types and interfaces
export type WorkflowType =
  | "image_generation_workflow"
  | "cultural_validation_workflow"
  | "payment_processing_workflow"
  | "ui_enhancement_workflow"
  | "comprehensive_analysis_workflow";

export type WorkflowStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export interface WorkflowStep {
  id: string;
  name: string;
  agent_type: AgentType;
  operation: string;
  dependencies: string[]; // Step IDs this step depends on
  required: boolean;
  timeout_ms: number;
  retry_count: number;
  max_retries: number;
  status: WorkflowStatus;
  result?: any;
  error?: string;
  start_time?: number;
  end_time?: number;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  type: WorkflowType;
  steps: WorkflowStep[];
  parallel_groups?: string[][]; // Groups of steps that can run in parallel
  cultural_requirements: {
    islamic_compliance: boolean;
    iraqi_context: boolean;
    professional_domain: string;
    minimum_cultural_score: number;
  };
  security_requirements?: {
    payment_validation: boolean;
    content_security: boolean;
    user_verification: boolean;
  };
  quality_gates: Array<{
    step_id: string;
    validation_criteria: any;
    failure_action: "retry" | "skip" | "abort";
  }>;
}

export interface WorkflowExecution {
  id: string;
  workflow_definition_id: string;
  status: WorkflowStatus;
  start_time: number;
  end_time?: number;
  input_context: any;
  current_step?: string;
  completed_steps: string[];
  failed_steps: string[];
  results: Record<string, any>;
  metrics: {
    total_steps: number;
    completed_steps: number;
    failed_steps: number;
    total_processing_time: number;
    cultural_validation_score?: number;
    security_validation_score?: number;
  };
  error_log: Array<{
    step_id: string;
    error: string;
    timestamp: number;
    retry_attempt: number;
  }>;
}

export interface ImageGenerationWorkflowContext {
  user_id: string;
  session_id: string;
  prompts: {
    english?: string;
    arabic?: string;
    mixed?: string;
  };
  image_parameters: {
    model: "dall-e-2" | "dall-e-3";
    size: string;
    count: number;
    style?: string;
  };
  professional_domain?: string;
  payment_context?: {
    amount: number;
    gateway: "zaincash" | "fastpay" | "nasswallet";
    user_credits: number;
  };
  cultural_requirements?: {
    islamic_compliance: boolean;
    cultural_validation_required: boolean;
    minimum_score: number;
  };
  user_preferences?: {
    language: "ar" | "en" | "mixed";
    rtl_optimization: boolean;
    professional_context: boolean;
  };
}

export class WorkflowOrchestrator {
  private workflowDefinitions: Map<string, WorkflowDefinition>;
  private activeExecutions: Map<string, WorkflowExecution>;
  private executionHistory: WorkflowExecution[];
  private maxHistorySize: number = 1000;

  constructor() {
    this.workflowDefinitions = new Map();
    this.activeExecutions = new Map();
    this.executionHistory = [];
    this.initializeDefaultWorkflows();
  }

  /**
   * Execute complete image generation workflow with cultural and payment validation
   */
  async executeImageGenerationWorkflow(
    context: ImageGenerationWorkflowContext,
  ): Promise<{
    success: boolean;
    execution_id: string;
    results?: {
      cultural_validation: any;
      arabic_processing: any;
      payment_security: any;
      image_generation: any;
      accessibility_check: any;
    };
    error?: string;
    processing_time: number;
  }> {
    const startTime = Date.now();
    const workflowId = "image_generation_workflow";

    try {
      // Get workflow definition
      const workflowDef = this.workflowDefinitions.get(workflowId);
      if (!workflowDef) {
        throw new Error(`Workflow definition not found: ${workflowId}`);
      }

      // Create workflow execution
      const execution = await this.createExecution(workflowDef, context);

      // Execute workflow steps
      const executionResult = await this.executeWorkflow(execution);

      if (executionResult.success) {
        return {
          success: true,
          execution_id: execution.id,
          results: {
            cultural_validation: executionResult.results["cultural_validation"],
            arabic_processing: executionResult.results["arabic_processing"],
            payment_security: executionResult.results["payment_security"],
            image_generation: executionResult.results["image_generation"],
            accessibility_check: executionResult.results["accessibility_check"],
          },
          processing_time: Date.now() - startTime,
        };
      } else {
        return {
          success: false,
          execution_id: execution.id,
          error: executionResult.error || "Workflow execution failed",
          processing_time: Date.now() - startTime,
        };
      }
    } catch (error) {
      console.error("Image generation workflow failed:", error);
      return {
        success: false,
        execution_id: "failed",
        error:
          error instanceof Error ? error.message : "Unknown workflow error",
        processing_time: Date.now() - startTime,
      };
    }
  }

  /**
   * Execute comprehensive cultural validation workflow
   */
  async executeCulturalValidationWorkflow(content: {
    text?: string;
    image_prompt?: string;
    professional_domain?: string;
    user_context?: any;
  }): Promise<{
    success: boolean;
    cultural_score: number;
    islamic_compliance: boolean;
    professional_appropriateness: boolean;
    issues: string[];
    recommendations: string[];
    agent_results: Record<string, any>;
  }> {
    const workflowId = "cultural_validation_workflow";

    try {
      const workflowDef = this.workflowDefinitions.get(workflowId);
      if (!workflowDef) {
        throw new Error(`Workflow definition not found: ${workflowId}`);
      }

      const execution = await this.createExecution(workflowDef, content);
      const result = await this.executeWorkflow(execution);

      if (result.success) {
        // Aggregate cultural validation results
        const culturalResult = result.results["cultural_validation"] || {};
        const arabicResult = result.results["arabic_processing"] || {};
        const professionalResult =
          result.results["professional_validation"] || {};

        return {
          success: true,
          cultural_score: culturalResult.cultural_score || 0.9,
          islamic_compliance: culturalResult.islamic_compliant !== false,
          professional_appropriateness:
            professionalResult.appropriate !== false,
          issues: [
            ...(culturalResult.issues || []),
            ...(arabicResult.issues || []),
            ...(professionalResult.issues || []),
          ],
          recommendations: [
            ...(culturalResult.recommendations || []),
            ...(arabicResult.suggestions || []),
            ...(professionalResult.recommendations || []),
          ],
          agent_results: result.results,
        };
      } else {
        return {
          success: false,
          cultural_score: 0.0,
          islamic_compliance: false,
          professional_appropriateness: false,
          issues: ["Cultural validation workflow failed"],
          recommendations: ["Manual review required"],
          agent_results: {},
        };
      }
    } catch (error) {
      console.error("Cultural validation workflow failed:", error);
      return {
        success: false,
        cultural_score: 0.0,
        islamic_compliance: false,
        professional_appropriateness: false,
        issues: [
          `Workflow error: ${error instanceof Error ? error.message : "Unknown error"}`,
        ],
        recommendations: ["System review required"],
        agent_results: {},
      };
    }
  }

  /**
   * Execute payment processing workflow with security validation
   */
  async executePaymentWorkflow(
    paymentRequest: PaymentSecurityRequest,
  ): Promise<{
    success: boolean;
    payment_approved: boolean;
    security_result: any;
    cultural_validation: any;
    processing_time: number;
    transaction_id?: string;
  }> {
    const startTime = Date.now();
    const workflowId = "payment_processing_workflow";

    try {
      const workflowDef = this.workflowDefinitions.get(workflowId);
      if (!workflowDef) {
        throw new Error(`Workflow definition not found: ${workflowId}`);
      }

      const execution = await this.createExecution(workflowDef, paymentRequest);
      const result = await this.executeWorkflow(execution);

      return {
        success: result.success,
        payment_approved: result.results["payment_security"]?.secure || false,
        security_result: result.results["payment_security"],
        cultural_validation: result.results["cultural_validation"],
        processing_time: Date.now() - startTime,
        transaction_id: result.success ? `tx_${Date.now()}` : undefined,
      };
    } catch (error) {
      console.error("Payment workflow failed:", error);
      return {
        success: false,
        payment_approved: false,
        security_result: null,
        cultural_validation: null,
        processing_time: Date.now() - startTime,
      };
    }
  }

  /**
   * Create new workflow execution
   */
  async createExecution(
    definition: WorkflowDefinition,
    context: any,
  ): Promise<WorkflowExecution> {
    const execution: WorkflowExecution = {
      id: this.generateExecutionId(),
      workflow_definition_id: definition.id,
      status: "pending",
      start_time: Date.now(),
      input_context: context,
      completed_steps: [],
      failed_steps: [],
      results: {},
      metrics: {
        total_steps: definition.steps.length,
        completed_steps: 0,
        failed_steps: 0,
        total_processing_time: 0,
      },
      error_log: [],
    };

    this.activeExecutions.set(execution.id, execution);
    return execution;
  }

  /**
   * Execute workflow steps with dependency management and parallel processing
   */
  async executeWorkflow(execution: WorkflowExecution): Promise<{
    success: boolean;
    results: Record<string, any>;
    error?: string;
  }> {
    const definition = this.workflowDefinitions.get(
      execution.workflow_definition_id,
    );
    if (!definition) {
      throw new Error(
        `Workflow definition not found: ${execution.workflow_definition_id}`,
      );
    }

    execution.status = "running";

    try {
      // Build dependency graph
      const dependencyGraph = this.buildDependencyGraph(definition.steps);

      // Execute steps according to dependencies
      while (execution.completed_steps.length < definition.steps.length) {
        const readySteps = this.getReadySteps(definition.steps, execution);

        if (readySteps.length === 0) {
          // Check if we're blocked by failed required steps
          const requiredFailures = execution.failed_steps.filter(
            (stepId) => definition.steps.find((s) => s.id === stepId)?.required,
          );

          if (requiredFailures.length > 0) {
            execution.status = "failed";
            return {
              success: false,
              results: execution.results,
              error: `Required steps failed: ${requiredFailures.join(", ")}`,
            };
          }

          break; // No more steps to execute
        }

        // Execute ready steps (potentially in parallel)
        await this.executeSteps(readySteps, execution, definition);
      }

      // Check overall success
      const requiredSteps = definition.steps.filter((s) => s.required);
      const failedRequiredSteps = execution.failed_steps.filter((stepId) =>
        requiredSteps.some((s) => s.id === stepId),
      );

      if (failedRequiredSteps.length > 0) {
        execution.status = "failed";
        return {
          success: false,
          results: execution.results,
          error: `Required steps failed: ${failedRequiredSteps.join(", ")}`,
        };
      }

      // Calculate metrics
      execution.metrics.completed_steps = execution.completed_steps.length;
      execution.metrics.failed_steps = execution.failed_steps.length;
      execution.metrics.total_processing_time =
        Date.now() - execution.start_time;

      execution.status = "completed";
      execution.end_time = Date.now();

      // Move to history
      this.moveToHistory(execution);

      return {
        success: true,
        results: execution.results,
      };
    } catch (error) {
      execution.status = "failed";
      execution.end_time = Date.now();

      console.error("Workflow execution failed:", error);
      return {
        success: false,
        results: execution.results,
        error:
          error instanceof Error ? error.message : "Unknown execution error",
      };
    }
  }

  /**
   * Get workflow execution status
   */
  getExecutionStatus(executionId: string): WorkflowExecution | null {
    return (
      this.activeExecutions.get(executionId) ||
      this.executionHistory.find((e) => e.id === executionId) ||
      null
    );
  }

  /**
   * Get orchestration metrics and performance data
   */
  getOrchestrationMetrics(): {
    total_executions: number;
    active_executions: number;
    success_rate: number;
    average_execution_time: number;
    workflow_performance: Record<
      WorkflowType,
      {
        count: number;
        success_rate: number;
        average_time: number;
      }
    >;
    agent_utilization: Record<AgentType, number>;
  } {
    const allExecutions = [
      ...this.activeExecutions.values(),
      ...this.executionHistory,
    ];
    const completedExecutions = allExecutions.filter(
      (e) => e.status === "completed" || e.status === "failed",
    );
    const successfulExecutions = completedExecutions.filter(
      (e) => e.status === "completed",
    );

    const workflowPerformance: Record<
      WorkflowType,
      { count: number; success_rate: number; average_time: number }
    > = {} as any;
    const agentUtilization: Record<AgentType, number> = {} as any;

    // Calculate workflow-specific metrics
    completedExecutions.forEach((execution) => {
      const definition = this.workflowDefinitions.get(
        execution.workflow_definition_id,
      );
      if (definition) {
        if (!workflowPerformance[definition.type]) {
          workflowPerformance[definition.type] = {
            count: 0,
            success_rate: 0,
            average_time: 0,
          };
        }

        const perf = workflowPerformance[definition.type];
        perf.count++;
        if (execution.status === "completed") perf.success_rate++;
        perf.average_time += execution.metrics.total_processing_time;
      }

      // Count agent usage
      definition?.steps.forEach((step) => {
        agentUtilization[step.agent_type] =
          (agentUtilization[step.agent_type] || 0) + 1;
      });
    });

    // Calculate averages
    Object.values(workflowPerformance).forEach((perf) => {
      if (perf.count > 0) {
        perf.success_rate = perf.success_rate / perf.count;
        perf.average_time = perf.average_time / perf.count;
      }
    });

    return {
      total_executions: allExecutions.length,
      active_executions: this.activeExecutions.size,
      success_rate:
        completedExecutions.length > 0
          ? successfulExecutions.length / completedExecutions.length
          : 0,
      average_execution_time:
        completedExecutions.length > 0
          ? completedExecutions.reduce(
              (sum, e) => sum + e.metrics.total_processing_time,
              0,
            ) / completedExecutions.length
          : 0,
      workflow_performance: workflowPerformance,
      agent_utilization: agentUtilization,
    };
  }

  // Private helper methods
  private initializeDefaultWorkflows(): void {
    // Image Generation Workflow
    this.workflowDefinitions.set("image_generation_workflow", {
      id: "image_generation_workflow",
      name: "Image Generation Workflow",
      description: "Complete workflow for culturally-aware image generation",
      type: "image_generation_workflow",
      steps: [
        {
          id: "cultural_validation",
          name: "Cultural Content Validation",
          agent_type: "iraqi-cultural-validator",
          operation: "validate_content",
          dependencies: [],
          required: true,
          timeout_ms: 5000,
          retry_count: 0,
          max_retries: 2,
          status: "pending",
        },
        {
          id: "arabic_processing",
          name: "Arabic Text Processing",
          agent_type: "arabic-rtl-processor",
          operation: "process_arabic_text",
          dependencies: ["cultural_validation"],
          required: true,
          timeout_ms: 3000,
          retry_count: 0,
          max_retries: 1,
          status: "pending",
        },
        {
          id: "payment_security",
          name: "Payment Security Validation",
          agent_type: "payment-security-guardian",
          operation: "validate_payment",
          dependencies: [],
          required: true,
          timeout_ms: 10000,
          retry_count: 0,
          max_retries: 2,
          status: "pending",
        },
        {
          id: "image_generation",
          name: "Image Generation",
          agent_type: "external-service-coordinator",
          operation: "generate_image",
          dependencies: [
            "cultural_validation",
            "arabic_processing",
            "payment_security",
          ],
          required: true,
          timeout_ms: 60000,
          retry_count: 0,
          max_retries: 3,
          status: "pending",
        },
        {
          id: "accessibility_check",
          name: "Accessibility Validation",
          agent_type: "iraqi-accessibility-specialist",
          operation: "validate_accessibility",
          dependencies: ["image_generation"],
          required: false,
          timeout_ms: 5000,
          retry_count: 0,
          max_retries: 1,
          status: "pending",
        },
      ],
      cultural_requirements: {
        islamic_compliance: true,
        iraqi_context: true,
        professional_domain: "general",
        minimum_cultural_score: 0.85,
      },
      security_requirements: {
        payment_validation: true,
        content_security: true,
        user_verification: true,
      },
      quality_gates: [
        {
          step_id: "cultural_validation",
          validation_criteria: {
            minimum_score: 0.85,
            islamic_compliance: true,
          },
          failure_action: "abort",
        },
      ],
    });

    // Add other default workflows...
    this.workflowDefinitions.set("cultural_validation_workflow", {
      id: "cultural_validation_workflow",
      name: "Cultural Validation Workflow",
      description: "Comprehensive cultural and religious compliance validation",
      type: "cultural_validation_workflow",
      steps: [
        {
          id: "cultural_validation",
          name: "Primary Cultural Validation",
          agent_type: "iraqi-cultural-validator",
          operation: "validate_content",
          dependencies: [],
          required: true,
          timeout_ms: 5000,
          retry_count: 0,
          max_retries: 2,
          status: "pending",
        },
        {
          id: "arabic_processing",
          name: "Arabic Language Analysis",
          agent_type: "arabic-rtl-processor",
          operation: "analyze_text",
          dependencies: [],
          required: false,
          timeout_ms: 3000,
          retry_count: 0,
          max_retries: 1,
          status: "pending",
        },
        {
          id: "professional_validation",
          name: "Professional Domain Validation",
          agent_type: "iraqi-professional-domain-expert",
          operation: "validate_professional_content",
          dependencies: ["cultural_validation"],
          required: true,
          timeout_ms: 7000,
          retry_count: 0,
          max_retries: 2,
          status: "pending",
        },
      ],
      cultural_requirements: {
        islamic_compliance: true,
        iraqi_context: true,
        professional_domain: "general",
        minimum_cultural_score: 0.9,
      },
      quality_gates: [],
    });
  }

  private buildDependencyGraph(steps: WorkflowStep[]): Map<string, string[]> {
    const graph = new Map<string, string[]>();
    steps.forEach((step) => {
      graph.set(step.id, step.dependencies);
    });
    return graph;
  }

  private getReadySteps(
    steps: WorkflowStep[],
    execution: WorkflowExecution,
  ): WorkflowStep[] {
    return steps.filter((step) => {
      if (
        execution.completed_steps.includes(step.id) ||
        execution.failed_steps.includes(step.id)
      ) {
        return false;
      }

      // Check if all dependencies are completed
      return step.dependencies.every((depId) =>
        execution.completed_steps.includes(depId),
      );
    });
  }

  private async executeSteps(
    steps: WorkflowStep[],
    execution: WorkflowExecution,
    definition: WorkflowDefinition,
  ): Promise<void> {
    // Execute steps in parallel if they don't conflict
    const promises = steps.map((step) =>
      this.executeStep(step, execution, definition),
    );
    await Promise.allSettled(promises);
  }

  private async executeStep(
    step: WorkflowStep,
    execution: WorkflowExecution,
    definition: WorkflowDefinition,
  ): Promise<void> {
    step.start_time = Date.now();
    step.status = "running";

    try {
      // Use agent communication service to execute step
      const result = await agentCommunication.delegateToAgent(
        step.agent_type,
        step.operation,
        this.buildStepPrompt(step, execution, definition),
        execution.input_context,
        {
          priority: step.required ? "high" : "normal",
          timeout_ms: step.timeout_ms,
          requires_cultural_validation:
            definition.cultural_requirements.islamic_compliance,
        },
      );

      if (result.success) {
        step.result = result.result;
        step.status = "completed";
        step.end_time = Date.now();
        execution.results[step.id] = result.result;
        execution.completed_steps.push(step.id);
      } else {
        throw new Error(result.error || "Step execution failed");
      }
    } catch (error) {
      step.error =
        error instanceof Error ? error.message : "Unknown step error";
      step.status = "failed";
      step.end_time = Date.now();
      step.retry_count++;

      execution.error_log.push({
        step_id: step.id,
        error: step.error,
        timestamp: Date.now(),
        retry_attempt: step.retry_count,
      });

      // Retry if allowed
      if (step.retry_count < step.max_retries) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * step.retry_count),
        ); // Exponential backoff
        return this.executeStep(step, execution, definition);
      } else {
        execution.failed_steps.push(step.id);
      }
    }
  }

  private buildStepPrompt(
    step: WorkflowStep,
    execution: WorkflowExecution,
    definition: WorkflowDefinition,
  ): string {
    return `Workflow Step Execution:

STEP: ${step.name}
OPERATION: ${step.operation}
WORKFLOW: ${definition.name}

CULTURAL_REQUIREMENTS:
- Islamic Compliance: ${definition.cultural_requirements.islamic_compliance}
- Iraqi Context: ${definition.cultural_requirements.iraqi_context}
- Professional Domain: ${definition.cultural_requirements.professional_domain}
- Minimum Cultural Score: ${definition.cultural_requirements.minimum_cultural_score}

EXECUTION_CONTEXT:
${JSON.stringify(execution.input_context, null, 2)}

PREVIOUS_RESULTS:
${JSON.stringify(execution.results, null, 2)}

Please execute this step according to workflow requirements and cultural standards.`;
  }

  private generateExecutionId(): string {
    return `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private moveToHistory(execution: WorkflowExecution): void {
    this.activeExecutions.delete(execution.id);
    this.executionHistory.push(execution);

    // Maintain history size
    if (this.executionHistory.length > this.maxHistorySize) {
      this.executionHistory.splice(0, 100); // Remove oldest 100 entries
    }
  }
}

// Singleton instance for application use
export const workflowOrchestrator = new WorkflowOrchestrator();

// Export types for components
export type {
  WorkflowType,
  WorkflowStatus,
  WorkflowStep,
  WorkflowDefinition,
  WorkflowExecution,
  ImageGenerationWorkflowContext,
};
