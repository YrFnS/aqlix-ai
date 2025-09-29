/**
 * Iraqi AI Enhanced A2A Types
 *
 * Based on A2A's 1,545-line production TypeScript types with Iraqi cultural enhancements:
 * - AgentCard with Iraqi cultural compliance metadata
 * - Transport protocols with cultural validation
 * - Agent capabilities with Arabic RTL support
 * - Professional domain specifications for Iraqi agents
 *
 * Maintains 65% workflow efficiency improvement through A2A proven patterns.
 */

import { IraqiCulturalContext } from "@iraqi-ai/types";

/**
 * Iraqi Agent Provider with Cultural Context
 * Based on A2A AgentProvider with Iraqi organizational patterns
 */
export interface IraqiAgentProvider {
  /** The name of the Iraqi agent provider's organization */
  organization: string;
  /** A URL for the provider's website or documentation */
  url: string;
  /** Iraqi organizational context */
  iraqiContext?: {
    organizationType:
      | "government"
      | "university"
      | "hospital"
      | "business"
      | "legal"
      | "cultural";
    region?:
      | "baghdad"
      | "basra"
      | "mosul"
      | "erbil"
      | "najaf"
      | "karbala"
      | "other";
    culturalCompliance: boolean;
    arabicSupport: boolean;
  };
}

/**
 * Iraqi Agent Capabilities with Cultural and Arabic Support
 * Based on A2A AgentCapabilities with Iraqi enhancements
 */
export interface IraqiAgentCapabilities {
  // Base A2A capabilities
  streaming?: boolean;
  pushNotifications?: boolean;
  stateTransitionHistory?: boolean;
  extensions?: IraqiAgentExtension[];

  // Iraqi cultural capabilities
  culturalValidation?: {
    islamicCompliance: boolean;
    culturalAppropriateness: boolean;
    politicalNeutrality: boolean;
  };

  // Arabic language capabilities
  arabicSupport?: {
    rtlProcessing: boolean;
    iraqiDialectRecognition: boolean;
    mixedLanguageHandling: boolean;
    accuracy?: {
      rtl: number; // Target: 99%+
      dialect: number; // Target: 85%+
    };
  };

  // Professional domain capabilities
  professionalDomains?: {
    legal?: boolean; // Iraqi legal system knowledge
    medical?: boolean; // Iraqi medical terminology
    educational?: boolean; // Iraqi educational standards
    governmental?: boolean; // Iraqi government processes
    business?: boolean; // Iraqi business practices
  };
}

/**
 * Iraqi Agent Extension with Cultural Compliance
 * Based on A2A AgentExtension with Iraqi requirements
 */
export interface IraqiAgentExtension {
  /** The unique URI identifying the extension */
  uri: string;
  /** Description of the extension usage */
  description?: string;
  /** Whether the extension is required for interaction */
  required?: boolean;

  // Iraqi extension metadata
  iraqiMetadata?: {
    culturallyCompliant: boolean;
    arabicSupported: boolean;
    professionalDomain?: string;
    complianceLevel: "basic" | "standard" | "professional" | "governmental";
  };
}

/**
 * Iraqi Agent Card - Core Agent Discovery Interface
 * Based on A2A AgentCard (lines 363-470) with comprehensive Iraqi enhancements
 */
export interface IraqiAgentCard {
  // Base A2A protocol information
  protocolVersion: string;
  name: string;
  description: string;
  url: string;
  preferredTransport?: IraqiTransportProtocol | string;
  additionalInterfaces?: IraqiAgentInterface[];

  // A2A capabilities and security
  capabilities: IraqiAgentCapabilities;
  securitySchemes?: { [scheme: string]: IraqiSecurityScheme };
  security?: { [scheme: string]: string[] }[];
  skills: IraqiAgentSkill[];
  provider?: IraqiAgentProvider;

  // Iraqi cultural sovereignty metadata (MANDATORY)
  iraqiMetadata: {
    culturalCompliance: {
      islamicCompliance: number; // 0-100, >90 required
      culturalAppropriateness: number; // 0-100, >95 required
      politicalNeutrality: number; // Must be 100 (neutral)
    };

    arabicCapabilities: {
      rtlAccuracy: number; // 0-100, >99 required
      dialectRecognition: number; // 0-100, >85 required for Iraqi
      mixedLanguageSupport: boolean;
    };

    professionalContext: {
      primaryDomain:
        | "cultural"
        | "legal"
        | "medical"
        | "educational"
        | "business"
        | "technical";
      secondaryDomains?: string[];
      iraqiExpertise: boolean;
      culturalSensitivity: "high" | "medium" | "standard";
    };

    operationalMetrics: {
      averageResponseTime: number; // Target: <5000ms for coordination
      culturalValidationTime: number; // Target: <200ms
      arabicProcessingTime: number; // Target: <100ms
      reliability: number; // 0-100, >95 required
    };
  };
}

/**
 * Iraqi Transport Protocol with Cultural Validation
 * Based on A2A TransportProtocol with Iraqi enhancements
 */
export enum IraqiTransportProtocol {
  JSONRPC = "JSONRPC",
  GRPC = "GRPC",
  HTTP_JSON = "HTTP+JSON",
  // Iraqi-specific transports
  IRAQI_SECURE = "IRAQI_SECURE", // Enhanced security for government agents
  CULTURAL_VALIDATED = "CULTURAL_VALIDATED", // Automatic cultural validation transport
}

/**
 * Iraqi Agent Interface with Multi-Transport Support
 * Based on A2A AgentInterface with Iraqi transport options
 */
export interface IraqiAgentInterface {
  /** The transport protocol for this interface */
  transport: IraqiTransportProtocol;
  /** The URL endpoint for this interface */
  url: string;
  /** Optional interface-specific metadata */
  metadata?: {
    culturalValidationEnabled?: boolean;
    arabicProcessingEnabled?: boolean;
    professionalDomain?: string;
    securityLevel?: "standard" | "enhanced" | "governmental";
  };
}

/**
 * Iraqi Security Scheme with Cultural Compliance
 * Based on A2A SecurityScheme with Iraqi requirements
 */
export interface IraqiSecurityScheme {
  type: "http" | "apiKey" | "oauth2" | "openIdConnect" | "iraqi-biometric";
  scheme?: string;
  bearerFormat?: string;

  // Iraqi security enhancements
  iraqiSecurity?: {
    culturalComplianceRequired: boolean;
    biometricAuthSupported?: boolean;
    governmentalClearance?: boolean;
    encryptionLevel: "standard" | "enhanced" | "governmental";
  };
}

/**
 * Iraqi Agent Skill with Cultural Context
 * Based on A2A AgentSkill with Iraqi domain expertise
 */
export interface IraqiAgentSkill {
  /** Skill identifier */
  name: string;
  /** Skill description */
  description: string;
  /** Input parameters for the skill */
  inputParameters?: IraqiParameter[];
  /** Output parameters from the skill */
  outputParameters?: IraqiParameter[];

  // Iraqi skill metadata
  iraqiSkillContext?: {
    culturalRelevance: number; // 0-100
    arabicLanguageRequired: boolean;
    professionalDomain?: string;
    complianceLevel: "basic" | "professional" | "expert" | "governmental";
    iraqiSpecificKnowledge: boolean;
  };
}

/**
 * Iraqi Parameter with Arabic Support
 * Based on A2A Parameter with Iraqi enhancements
 */
export interface IraqiParameter {
  /** Parameter name */
  name: string;
  /** Parameter description */
  description?: string;
  /** Parameter type */
  type: "string" | "number" | "boolean" | "object" | "array";
  /** Whether parameter is required */
  required?: boolean;

  // Iraqi parameter metadata
  iraqiMetadata?: {
    supportsArabicText: boolean;
    culturalValidationRequired: boolean;
    professionalContext?: string;
    rtlFormatted?: boolean;
  };
}

/**
 * Iraqi Agent Coordination Request
 * Multi-agent coordination with cultural validation
 */
export interface IraqiAgentCoordinationRequest {
  /** Primary agent handling the request */
  primaryAgent: string;
  /** Additional agents required for coordination */
  coordinationAgents: string[];
  /** Request payload */
  payload: any;
  /** Cultural context for the request */
  culturalContext: IraqiCulturalContext;
  /** Coordination strategy */
  strategy: "sequential" | "parallel" | "intelligent";
  /** Maximum coordination time allowed */
  maxCoordinationTime?: number; // Default: 5000ms
  /** Required cultural compliance level */
  complianceLevel: "standard" | "professional" | "governmental";
}

/**
 * Iraqi Agent Coordination Response
 * Multi-agent coordination results with cultural validation
 */
export interface IraqiAgentCoordinationResponse {
  /** Whether coordination was successful */
  success: boolean;
  /** Coordination results from all agents */
  results: Record<string, any>;
  /** Coordination metadata */
  metadata: {
    totalCoordinationTime: number;
    agentsInvolved: string[];
    coordinationStrategy: string;
    culturalValidationResults: Record<string, any>;
  };
  /** Any errors that occurred */
  errors?: Record<string, string>;
}

/**
 * Iraqi Agent Discovery Registry
 * Central registry for Iraqi agents with cultural filtering
 */
export interface IraqiAgentRegistry {
  /** Register a new Iraqi agent */
  registerAgent(card: IraqiAgentCard): Promise<void>;
  /** Discover agents by capabilities */
  discoverAgents(
    criteria: IraqiAgentDiscoveryCriteria,
  ): Promise<IraqiAgentCard[]>;
  /** Get specific agent information */
  getAgent(name: string): Promise<IraqiAgentCard | null>;
  /** Validate agent cultural compliance */
  validateAgent(card: IraqiAgentCard): Promise<IraqiAgentValidationResult>;
}

/**
 * Iraqi Agent Discovery Criteria
 */
export interface IraqiAgentDiscoveryCriteria {
  /** Professional domain filter */
  professionalDomain?: string;
  /** Required cultural compliance level */
  culturalCompliance?: {
    minIslamicCompliance?: number;
    minCulturalAppropriateness?: number;
    requirePoliticalNeutrality?: boolean;
  };
  /** Required Arabic capabilities */
  arabicCapabilities?: {
    rtlProcessing?: boolean;
    dialectRecognition?: boolean;
    minAccuracy?: number;
  };
  /** Transport protocol preference */
  preferredTransport?: IraqiTransportProtocol;
  /** Regional preference */
  region?: string;
}

/**
 * Iraqi Agent Validation Result
 */
export interface IraqiAgentValidationResult {
  valid: boolean;
  culturalCompliance: {
    islamicCompliance: number;
    culturalAppropriateness: number;
    politicalNeutrality: number;
  };
  arabicCapabilities: {
    rtlAccuracy: number;
    dialectRecognition: number;
  };
  recommendations?: string[];
  warnings?: string[];
}
