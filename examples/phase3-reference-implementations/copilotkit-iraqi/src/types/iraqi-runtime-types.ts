/**
 * Iraqi AI Enhanced CopilotKit Runtime Types
 * 
 * Extended type definitions for Iraqi cultural sovereignty layer
 * Based on CopilotKit's 203-line frontend action types with Iraqi enhancements
 */

import { 
  Action, 
  Parameter, 
  CopilotRequestContext,
  CopilotServiceAdapter 
} from '@copilotkit/shared';

/**
 * Iraqi Runtime Configuration
 */
export interface IraqiRuntimeConfig {
  // Base CopilotKit configuration
  actions?: Action[];
  agents?: Record<string, any>;
  serviceAdapter?: CopilotServiceAdapter;
  mcpServers?: string[];

  // Iraqi cultural enhancement configuration
  culturalValidation?: {
    islamicCompliance?: number; // Default: 90% minimum
    culturalAppropriateness?: number; // Default: 95% minimum
    politicalNeutrality?: boolean; // Default: true (mandatory)
  };

  // Arabic processing configuration
  arabicProcessing?: {
    rtlAccuracy?: number; // Default: 99% minimum
    iraqiDialectRecognition?: number; // Default: 85% minimum
    mixedLanguageSupport?: boolean; // Default: true
  };

  // Agent coordination configuration
  agentCoordination?: {
    mode?: 'intelligent' | 'sequential' | 'parallel';
    culturalValidationRequired?: boolean; // Default: true
    maxCoordinationTime?: number; // Default: 5000ms
  };

  // Professional domain configuration
  professionalDomains?: {
    legal?: boolean; // Iraqi legal system integration
    medical?: boolean; // Iraqi medical terminology
    educational?: boolean; // Iraqi educational workflows
    governmental?: boolean; // Iraqi governmental processes
  };
}

/**
 * Iraqi-Enhanced CopilotKit Request
 */
export interface IraqiCopilotRuntimeRequest extends CopilotRequestContext {
  // Base request properties
  content: any;
  context?: any;

  // Iraqi-specific request properties
  requiresCulturalValidation?: boolean; // Default: true
  requiresArabicProcessing?: boolean; // Auto-detected
  requiresAgentCoordination?: boolean; // Based on complexity
  requiredAgents?: string[]; // Specific Iraqi agents needed
  professionalDomain?: 'legal' | 'medical' | 'educational' | 'governmental' | 'commercial';
  culturalContext?: IraqiCulturalContext;
}

/**
 * Iraqi-Enhanced CopilotKit Response
 */
export interface IraqiCopilotRuntimeResponse {
  success: boolean;
  response?: any;
  error?: string;

  // Iraqi validation results
  culturalValidation?: CulturalValidationResult;
  arabicProcessing?: ArabicProcessingResult;
  agentCoordination?: AgentCoordinationResult;
  performanceMetrics?: IraqiPerformanceMetrics;

  // Error context for debugging
  iraqiErrorContext?: {
    culturalLayer?: any;
    arabicProcessor?: any;
    agentManager?: any;
  };

  // Cultural recommendations for improvement
  culturalRecommendations?: string[];
  complianceScores?: {
    islamic?: number;
    cultural?: number;
    political?: number;
  };
}

/**
 * Iraqi Cultural Context
 */
export interface IraqiCulturalContext {
  userRegion?: 'baghdad' | 'basra' | 'mosul' | 'erbil' | 'najaf' | 'karbala' | 'other';
  professionalRole?: 'lawyer' | 'doctor' | 'teacher' | 'engineer' | 'government' | 'business' | 'student';
  languagePreference?: 'arabic' | 'english' | 'mixed';
  culturalSensitivity?: 'high' | 'medium' | 'standard';
  islamicComplianceRequired?: boolean;
  politicalNeutralityRequired?: boolean;
}

/**
 * Cultural Validation Result
 */
export interface CulturalValidationResult {
  approved: boolean;
  scores: {
    islamic: number; // 0-100, >90 required
    cultural: number; // 0-100, >95 required
    political: number; // 0-100, 100 required (neutral)
  };
  recommendations?: string[];
  context?: any;
  processingTime?: number; // Target: <200ms
}

/**
 * Arabic Processing Result
 */
export interface ArabicProcessingResult {
  rtlAccuracy: number; // 0-100, >99 required
  dialectRecognition: {
    confidence: number; // 0-100, >85 required for Iraqi
    dialect: 'iraqi' | 'levantine' | 'gulf' | 'egyptian' | 'maghrebi' | 'standard';
  };
  processedContent: any;
  mixedLanguageHandling: boolean;
  processingTime?: number; // Target: <100ms
}

/**
 * Agent Coordination Result
 */
export interface AgentCoordinationResult {
  coordinatedAgents: string[];
  coordinationMode: 'intelligent' | 'sequential' | 'parallel';
  culturalConsistency: boolean;
  totalCoordinationTime: number; // Target: <5000ms
  agentResponses: Record<string, any>;
}

/**
 * Iraqi Performance Metrics
 */
export interface IraqiPerformanceMetrics {
  culturalValidationTime: number; // Target: <200ms
  arabicProcessingTime: number; // Target: <100ms
  agentCoordinationTime: number; // Target: <5000ms
  totalEnhancementOverhead: number; // Target: <300ms
  complianceScores: {
    islamic: number;
    cultural: number;
    arabic: number;
  };
}

/**
 * Iraqi Agent Definition
 */
export interface IraqiAgentDefinition {
  type: 'cultural-intelligence' | 'business-intelligence' | 'design-intelligence' | 
        'research-intelligence' | 'technical-intelligence' | 'language-processing-tool' |
        'financial-security-tool' | 'system-coordination';
  contextManaged: boolean; // true for 13 context-managed agents
  primaryFunction: string;
  culturalConstraints?: boolean;
  rtlSupport?: boolean;
  arabicNLPSupport?: boolean;
  dialectRecognition?: 'iraqi' | 'general';
  accuracyTarget?: number;
  complianceTargets?: {
    islamic?: number;
    cultural?: number;
    political?: number;
  };
  domains?: string[];
  gateways?: string[];
  culturalInsights?: boolean;
}

/**
 * Iraqi Action Definition (extends base CopilotKit Action)
 */
export interface IraqiAction<T extends Parameter[] = []> extends Action<T> {
  // Iraqi-specific action properties
  culturalValidationRequired?: boolean; // Default: true
  arabicSupport?: boolean; // Auto-detected based on content
  professionalDomain?: string; // For domain-specific actions
  islamicCompliance?: boolean; // Default: true
  rtlLayoutSupport?: boolean; // For UI-generating actions
  iraqiAgentCoordination?: string[]; // Required Iraqi agents
}

/**
 * Iraqi Payment Gateway Types
 */
export interface IraqiPaymentGatewayConfig {
  gateways: ('zaincash' | 'fastpay' | 'nasswallet')[];
  securityCompliance: number; // Must be 100%
  culturalPaymentPatterns: boolean; // Iraqi-specific payment behaviors
}

/**
 * Iraqi Agent Health Status
 */
export interface IraqiAgentHealthStatus {
  operational: boolean;
  culturalCompliance: boolean;
  arabicProcessingCapability: boolean;
  lastValidationTime?: Date;
  performanceMetrics?: {
    averageResponseTime: number;
    culturalAccuracy: number;
    arabicAccuracy: number;
  };
}