// Iraqi AI Chat System - Core Types
// Based on Phase 3 protocol extraction: CopilotKit + AG-UI + A2A + Iraqi Cultural Intelligence

// Cultural Intelligence Types
export * from './cultural.js';
export type {
  IraqiCulturalContext,
  CulturalValidationResult,
  IslamicComplianceResult,
  PoliticalNeutralityResult,
  UnifiedCulturalProcessingResult,
  CulturalEnhancementConfig
} from './cultural.js';

// Arabic Language Processing Types
export * from './arabic.js';
export type {
  ArabicText,
  RTLConfig,
  ArabicProcessingResult,
  IraqiDialect,
  MixedContent,
  ArabicTypography
} from './arabic.js';

// Agent Coordination Types  
export * from './agents.js';
export type {
  AgentCapabilities,
  IraqiAgentCard,
  AgentMessage,
  AgentCoordination,
  IraqiAgentType,
  AgentPerformanceMetrics
} from './agents.js';

// Payment Integration Types
export * from './payments.js';
export type {
  IraqiPaymentGateway,
  PaymentConfig,
  PaymentTransaction,
  IslamicFinanceCompliance,
  PaymentGatewayConfig,
  PaymentProcessingResult,
  PaymentSecurity
} from './payments.js';

// Professional Domain Types
export * from './professional.js';
export type {
  ProfessionalDomain,
  IraqiProfessionalStandards,
  IraqiLegalDomain,
  IraqiMedicalDomain,
  IraqiEducationalDomain,
  IraqiGovernmentDomain,
  ProfessionalExpertise,
  ProfessionalConsultationRequest,
  ProfessionalConsultationResponse
} from './professional.js';

// Common utility types
export interface SystemConfig {
  environment: 'development' | 'staging' | 'production';
  features: {
    culturalValidation: boolean;
    islamicCompliance: boolean;
    arabicProcessing: boolean;
    agentCoordination: boolean;
    paymentProcessing: boolean;
    professionalDomains: boolean;
  };
  performance: {
    culturalValidationTimeout: number;
    arabicProcessingTimeout: number;
    agentCoordinationTimeout: number;
    paymentProcessingTimeout: number;
  };
  security: {
    encryptionEnabled: boolean;
    auditingEnabled: boolean;
    culturalAuditingEnabled: boolean;
  };
}

export interface IraqiAISystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  components: {
    culturalEngine: 'healthy' | 'degraded' | 'unhealthy';
    arabicProcessor: 'healthy' | 'degraded' | 'unhealthy';
    agentCoordinator: 'healthy' | 'degraded' | 'unhealthy';
    paymentGateways: 'healthy' | 'degraded' | 'unhealthy';
    professionalDomains: 'healthy' | 'degraded' | 'unhealthy';
  };
  metrics: {
    totalRequests: number;
    successfulRequests: number;
    averageResponseTime: number;
    culturalComplianceRate: number;
    islamicComplianceRate: number;
    systemUptime: number;
  };
  lastChecked: string;
}