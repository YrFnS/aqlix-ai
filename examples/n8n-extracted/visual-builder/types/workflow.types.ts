/**
 * Workflow Type Definitions for Iraqi AI Visual Builder
 * Enhanced with cultural intelligence and professional domain support
 */

export interface IraqiWorkflowNode {
  id: string;
  name: string;
  type: string;
  position: { x: number; y: number };
  parameters: Record<string, any>;

  // Cultural enhancements
  culturalSettings?: {
    islamicCompliant: boolean;
    arabicLabel?: string;
    dialectSupport?: "baghdadi" | "basri" | "moslawi" | "standard";
    professionalDomain?:
      | "health"
      | "education"
      | "interior"
      | "justice"
      | "general";
    prayerTimeAware?: boolean;
    halalValidated?: boolean;
  };

  // Visual properties
  visual?: {
    color?: string;
    icon?: string;
    rtlAlignment?: "right" | "left" | "center";
    arabicFont?: boolean;
    size?: "small" | "medium" | "large";
  };

  // Security and compliance
  security?: {
    securityLevel: "public" | "internal" | "confidential" | "secret";
    ministryAccess?: string[];
    islamicAuditRequired?: boolean;
  };
}

export interface IraqiWorkflowConnection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  sourcePort?: string;
  targetPort?: string;

  // Cultural properties
  cultural?: {
    arabicLabel?: string;
    conditionalOnPrayerTime?: boolean;
    islamicValidationRequired?: boolean;
  };

  // Visual styling for RTL
  visual?: {
    rtlCurve?: boolean;
    arabicAnnotation?: string;
    culturalColor?: string;
  };
}

export interface IraqiWorkflow {
  id: string;
  name: string;
  arabicName?: string;
  description?: string;
  arabicDescription?: string;

  // Core workflow structure
  nodes: IraqiWorkflowNode[];
  connections: IraqiWorkflowConnection[];

  // Cultural metadata
  cultural: {
    islamicCompliant: boolean;
    complianceScore: number; // 0-1
    arabicSupported: boolean;
    dialectPreference: "baghdadi" | "basri" | "moslawi" | "standard" | "mixed";
    professionalDomain:
      | "health"
      | "education"
      | "interior"
      | "justice"
      | "general";
    ministryApproved?: string[];
    prayerTimeRespect: boolean;
    ramadanAware: boolean;
  };

  // Visual layout properties
  layout: {
    direction: "ltr" | "rtl" | "mixed";
    primaryLanguage: "arabic" | "english" | "bilingual";
    canvasSize: { width: number; height: number };
    gridAlignment: "western" | "arabic" | "adaptive";
    zoomLevel: number;
  };

  // Professional domain settings
  domain?: {
    type: "health" | "education" | "interior" | "justice" | "general";
    ministry?: string;
    department?: string;
    securityClassification: "public" | "internal" | "confidential" | "secret";
    regulatoryCompliance: string[];
    islamicJurisprudenceRequired?: boolean;
  };

  // Scheduling and timing
  scheduling?: {
    prayerTimeExclusions: boolean;
    fridayRestrictions: boolean;
    ramadanScheduling: boolean;
    hijriCalendarSupport: boolean;
    timeZone: string; // Default: 'Asia/Baghdad'
  };

  // Metadata
  metadata: {
    version: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    culturalValidatedBy?: string;
    islamicValidatedAt?: Date;
    tags: string[];
    arabicTags?: string[];
  };
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  arabicName?: string;
  description: string;
  arabicDescription?: string;

  // Template categorization
  category: "government" | "healthcare" | "education" | "finance" | "general";
  subcategory?: string;
  ministry?: "health" | "education" | "interior" | "justice" | "finance";

  // Template content
  workflow: Omit<IraqiWorkflow, "id" | "metadata">;

  // Cultural properties
  cultural: {
    islamicCompliant: boolean;
    arabicOptimized: boolean;
    dialectSupport: string[];
    culturalValidationRequired: boolean;
  };

  // Usage metadata
  usage: {
    popularity: number;
    ministryAdoption: string[];
    successRate: number;
    averageExecutionTime: number;
  };

  // Template metadata
  metadata: {
    version: string;
    createdAt: Date;
    updatedAt: Date;
    author: string;
    islamicValidator?: string;
    approvedMinistries: string[];
    tags: string[];
    arabicTags?: string[];
  };
}

export interface NodeLibraryCategory {
  id: string;
  name: string;
  arabicName?: string;
  description?: string;
  arabicDescription?: string;
  icon: string;

  // Cultural categorization
  cultural: {
    professionalDomain?:
      | "health"
      | "education"
      | "interior"
      | "justice"
      | "general";
    islamicCompliant: boolean;
    ministrySpecific?: string[];
    arabicOptimized: boolean;
  };

  // Node definitions
  nodes: NodeDefinition[];

  // Display properties
  display: {
    order: number;
    color: string;
    rtlSupported: boolean;
    arabicFont: boolean;
  };
}

export interface NodeDefinition {
  type: string;
  name: string;
  arabicName?: string;
  description: string;
  arabicDescription?: string;
  icon: string;

  // Cultural properties
  cultural: {
    islamicCompliant: boolean;
    halalCertified?: boolean;
    professionalDomain?: string[];
    ministryRestricted?: string[];
    prayerTimeConflict?: boolean;
  };

  // Technical properties
  category: string;
  inputs: NodePort[];
  outputs: NodePort[];
  parameters: NodeParameter[];

  // Visual properties
  visual: {
    color: string;
    rtlSupported: boolean;
    arabicLabelSupported: boolean;
    size: "small" | "medium" | "large";
  };

  // Security
  security: {
    minSecurityLevel: "public" | "internal" | "confidential" | "secret";
    auditRequired: boolean;
    islamicValidationRequired: boolean;
  };
}

export interface NodePort {
  name: string;
  arabicName?: string;
  type: "main" | "webhook" | "ai" | "cultural";
  dataType: string;
  required: boolean;

  // Cultural properties
  cultural?: {
    arabicSupported: boolean;
    rtlDataFlow: boolean;
    islamicValidationRequired: boolean;
  };
}

export interface NodeParameter {
  name: string;
  arabicName?: string;
  displayName: string;
  arabicDisplayName?: string;
  type:
    | "string"
    | "number"
    | "boolean"
    | "select"
    | "multiselect"
    | "json"
    | "arabic-text";
  default?: any;
  required: boolean;

  // Cultural properties
  cultural?: {
    arabicInputSupported: boolean;
    dialectValidation?: boolean;
    islamicContentFilter?: boolean;
    professionalTerminology?: string[];
  };

  // Input properties
  options?: Array<{
    name: string;
    arabicName?: string;
    value: any;
    islamicCompliant?: boolean;
  }>;

  // Validation
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    islamicCompliance?: boolean;
    culturalValidation?: boolean;
  };
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status:
    | "queued"
    | "running"
    | "success"
    | "error"
    | "cancelled"
    | "cultural-validation-failed";

  // Execution data
  startedAt?: Date;
  finishedAt?: Date;
  duration?: number;

  // Cultural validation
  cultural: {
    islamicComplianceChecked: boolean;
    complianceScore?: number;
    culturalIssues: string[];
    prayerTimeConflicts: boolean;
    ramadanCompliant: boolean;
  };

  // Execution results
  data?: {
    resultData: any;
    executionData: any;
    culturalValidationData?: {
      arabicProcessingResults: any;
      islamicComplianceResults: any;
      professionalDomainValidation: any;
    };
  };

  // Error handling
  error?: {
    message: string;
    arabicMessage?: string;
    type: "technical" | "cultural" | "security" | "islamic-compliance";
    node?: string;
    culturalContext?: any;
  };
}

export interface CanvasViewport {
  x: number;
  y: number;
  zoom: number;

  // RTL-specific properties
  rtl?: {
    textDirection: "rtl" | "ltr";
    layoutDirection: "rtl" | "ltr";
    arabicFontEnabled: boolean;
    bidiSupport: boolean;
  };

  // Cultural display settings
  cultural?: {
    showArabicLabels: boolean;
    showIslamicCompliance: boolean;
    showPrayerTimeIndicators: boolean;
    culturalTheme: "default" | "ministry" | "islamic";
  };
}

export interface WorkflowValidationResult {
  isValid: boolean;
  errors: WorkflowValidationError[];
  warnings: WorkflowValidationWarning[];

  // Cultural validation
  cultural: {
    islamicComplianceScore: number;
    arabicProcessingScore: number;
    professionalDomainScore: number;
    overallCulturalScore: number;
  };

  // Recommendations
  recommendations: Array<{
    type: "technical" | "cultural" | "islamic" | "professional";
    message: string;
    arabicMessage?: string;
    severity: "low" | "medium" | "high" | "critical";
    nodeId?: string;
  }>;
}

export interface WorkflowValidationError {
  id: string;
  type: "connection" | "parameter" | "cultural" | "islamic" | "security";
  message: string;
  arabicMessage?: string;
  nodeId?: string;
  severity: "error" | "critical";

  // Cultural context
  cultural?: {
    islamicViolation?: boolean;
    culturalInappropriate?: boolean;
    professionalDomainConflict?: boolean;
  };
}

export interface WorkflowValidationWarning {
  id: string;
  type: "performance" | "cultural" | "islamic" | "best-practice";
  message: string;
  arabicMessage?: string;
  nodeId?: string;

  // Cultural context
  cultural?: {
    culturalRecommendation?: string;
    islamicGuideline?: string;
    professionalBestPractice?: string;
  };
}

// Cultural and Islamic compliance types
export interface IslamicComplianceConfig {
  strictMode: boolean;
  professionalDomain:
    | "health"
    | "education"
    | "interior"
    | "justice"
    | "general";
  allowedBusinessHours: {
    excludeFriday: boolean;
    excludeRamadan: boolean;
    respectPrayerTimes: boolean;
  };
  contentFilters: {
    financialInterest: boolean;
    inappropriateContent: boolean;
    prayerTimeRespect: boolean;
  };
  auditLevel: "basic" | "standard" | "strict" | "ministry";
}

export interface ArabicProcessingConfig {
  enableRTL: boolean;
  dialectRecognition: boolean;
  mixedLanguageSupport: boolean;
  arabicFontOptimization: boolean;
  bidiTextSupport: boolean;
  professionalTerminology: boolean;
}

// Event types for real-time collaboration
export type WorkflowEvent =
  | { type: "node-added"; node: IraqiWorkflowNode }
  | {
      type: "node-updated";
      nodeId: string;
      changes: Partial<IraqiWorkflowNode>;
    }
  | { type: "node-deleted"; nodeId: string }
  | { type: "connection-added"; connection: IraqiWorkflowConnection }
  | { type: "connection-deleted"; connectionId: string }
  | { type: "cultural-validation"; result: WorkflowValidationResult }
  | { type: "islamic-compliance-check"; result: any }
  | { type: "arabic-processing-update"; result: any };

// Export utility types
export type WorkflowEventHandler = (event: WorkflowEvent) => void;
export type CulturalValidationHandler = (
  result: WorkflowValidationResult,
) => void;
export type IslamicComplianceHandler = (result: any) => void;
