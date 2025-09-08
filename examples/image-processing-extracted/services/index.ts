// Iraqi AI Chat System - Agent Integration Services
// Phase 3: Complete Agent Integration Layer

// Core agent coordination
export { IraqiAgentCoordinator, iraqiAgentCoordinator } from '../agents/IraqiAgentCoordinator';
export type {
  AgentResponse,
  CulturalValidationResult,
  ArabicProcessingResult,
  PaymentSecurityResult,
  AccessibilityResult,
  AgentCoordinationConfig
} from '../agents/IraqiAgentCoordinator';

// Arabic processing integration
export { ArabicProcessorService, arabicProcessor } from './arabic-processor';
export type {
  ArabicProcessingRequest,
  ArabicProcessingResult,
  BilingualProcessingResult
} from './arabic-processor';

// Payment security integration
export { PaymentSecurityService, paymentSecurity } from './payment-security';
export type {
  PaymentSecurityRequest,
  PaymentSecurityResult,
  PaymentTransactionLog,
  IraqiPaymentGateway
} from './payment-security';

// Agent communication protocols
export { AgentCommunicationService, agentCommunication } from './agent-communication';
export type {
  AgentMessage,
  AgentCapabilities,
  CommunicationStats,
  CoordinationRequest,
  CoordinationResult,
  AgentType,
  MessageType,
  Priority
} from './agent-communication';

// Workflow orchestration
export { WorkflowOrchestrator, workflowOrchestrator } from './workflow-orchestrator';
export type {
  WorkflowType,
  WorkflowStatus,
  WorkflowStep,
  WorkflowDefinition,
  WorkflowExecution,
  ImageGenerationWorkflowContext
} from './workflow-orchestrator';

// Comprehensive service integration
export interface IraqiAIServices {
  agentCoordinator: IraqiAgentCoordinator;
  arabicProcessor: ArabicProcessorService;
  paymentSecurity: PaymentSecurityService;
  agentCommunication: AgentCommunicationService;
  workflowOrchestrator: WorkflowOrchestrator;
}

// Main service registry
export const iraqiAIServices: IraqiAIServices = {
  agentCoordinator: iraqiAgentCoordinator,
  arabicProcessor: arabicProcessor,
  paymentSecurity: paymentSecurity,
  agentCommunication: agentCommunication,
  workflowOrchestrator: workflowOrchestrator
};

// Service health check
export async function performSystemHealthCheck(): Promise<{
  overall_healthy: boolean;
  service_status: Record<keyof IraqiAIServices, boolean>;
  performance_metrics: {
    cultural_validation_accuracy: number;
    arabic_processing_accuracy: number;
    payment_security_score: number;
    agent_communication_health: number;
    workflow_success_rate: number;
  };
  recommendations: string[];
}> {
  const results = {
    overall_healthy: true,
    service_status: {} as Record<keyof IraqiAIServices, boolean>,
    performance_metrics: {
      cultural_validation_accuracy: 0,
      arabic_processing_accuracy: 0,
      payment_security_score: 0,
      agent_communication_health: 0,
      workflow_success_rate: 0
    },
    recommendations: [] as string[]
  };

  try {
    // Check agent coordinator
    const coordinatorStatus = iraqiAgentCoordinator.getOrchestrationStatus();
    results.service_status.agentCoordinator = coordinatorStatus.success_rate >= 0.90;
    results.performance_metrics.cultural_validation_accuracy = coordinatorStatus.success_rate;

    // Check Arabic processor
    const arabicStats = arabicProcessor.getProcessingStats();
    results.service_status.arabicProcessor = arabicStats.success_rate >= 0.95;
    results.performance_metrics.arabic_processing_accuracy = arabicStats.dialect_detection_accuracy;

    // Check payment security
    const paymentMetrics = paymentSecurity.getSecurityMetrics();
    results.service_status.paymentSecurity = paymentMetrics.success_rate >= 0.95;
    results.performance_metrics.payment_security_score = paymentMetrics.success_rate;

    // Check agent communication
    const commHealth = await agentCommunication.performHealthCheck();
    results.service_status.agentCommunication = commHealth.system_healthy;
    results.performance_metrics.agent_communication_health = commHealth.communication_metrics.success_rate;

    // Check workflow orchestrator
    const workflowMetrics = workflowOrchestrator.getOrchestrationMetrics();
    results.service_status.workflowOrchestrator = workflowMetrics.success_rate >= 0.90;
    results.performance_metrics.workflow_success_rate = workflowMetrics.success_rate;

    // Determine overall health
    results.overall_healthy = Object.values(results.service_status).every(status => status);

    // Generate recommendations
    if (!results.service_status.agentCoordinator) {
      results.recommendations.push('Agent coordinator performance below threshold - review cultural validation processes');
    }
    if (!results.service_status.arabicProcessor) {
      results.recommendations.push('Arabic processing accuracy needs improvement - update dialect recognition models');
    }
    if (!results.service_status.paymentSecurity) {
      results.recommendations.push('Payment security issues detected - review fraud detection algorithms');
    }
    if (!results.service_status.agentCommunication) {
      results.recommendations.push('Agent communication system unstable - check network and service availability');
    }
    if (!results.service_status.workflowOrchestrator) {
      results.recommendations.push('Workflow execution issues - optimize orchestration and retry mechanisms');
    }

    if (results.overall_healthy) {
      results.recommendations.push('All systems operating within normal parameters');
    }

    return results;

  } catch (error) {
    console.error('System health check failed:', error);
    return {
      overall_healthy: false,
      service_status: {
        agentCoordinator: false,
        arabicProcessor: false,
        paymentSecurity: false,
        agentCommunication: false,
        workflowOrchestrator: false
      },
      performance_metrics: {
        cultural_validation_accuracy: 0,
        arabic_processing_accuracy: 0,
        payment_security_score: 0,
        agent_communication_health: 0,
        workflow_success_rate: 0
      },
      recommendations: ['Critical system error - immediate technical review required']
    };
  }
}

// Initialize all services
export async function initializeIraqiAIServices(): Promise<{
  success: boolean;
  initialized_services: string[];
  failed_services: string[];
  error?: string;
}> {
  const initialized = [];
  const failed = [];

  try {
    // Services are already initialized via singletons
    initialized.push('agentCoordinator', 'arabicProcessor', 'paymentSecurity', 'agentCommunication', 'workflowOrchestrator');

    return {
      success: true,
      initialized_services: initialized,
      failed_services: failed
    };

  } catch (error) {
    return {
      success: false,
      initialized_services: initialized,
      failed_services: failed,
      error: error instanceof Error ? error.message : 'Unknown initialization error'
    };
  }
}