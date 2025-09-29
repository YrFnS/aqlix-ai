/**
 * Enhanced Sim Studio Visual Workflow Builder Types
 * With Iraqi Cultural Intelligence Integration
 *
 * Extracted from Sim Studio AI with cultural compliance enhancements
 * for the Iraqi AI Chat System
 */

import type { JSX, SVGProps } from "react";

// ============================================================================
// CORE WORKFLOW TYPES
// ============================================================================

export type BlockIcon = (props: SVGProps<SVGSVGElement>) => JSX.Element;
export type ParamType = "string" | "number" | "boolean" | "json";
export type PrimitiveValueType =
  | "string"
  | "number"
  | "boolean"
  | "json"
  | "array"
  | "any";

export type BlockCategory =
  | "blocks"
  | "tools"
  | "triggers"
  | "iraqi-tools"
  | "cultural-validators";

// Enhanced generation types with Iraqi language support
export type GenerationType =
  | "javascript-function-body"
  | "typescript-function-body"
  | "json-schema"
  | "json-object"
  | "system-prompt"
  | "custom-tool-schema"
  | "sql-query"
  | "postgrest"
  | "mongodb-filter"
  | "mongodb-pipeline"
  | "mongodb-sort"
  | "mongodb-documents"
  | "mongodb-update"
  | "arabic-rtl-template"
  | "iraqi-cultural-prompt"
  | "islamic-compliance-schema";

// Enhanced sub-block types with Iraqi-specific inputs
export type SubBlockType =
  | "short-input" // Single line input
  | "long-input" // Multi-line input
  | "dropdown" // Select menu
  | "combobox" // Searchable dropdown with text input
  | "slider" // Range input
  | "table" // Grid layout
  | "code" // Code editor
  | "switch" // Toggle button
  | "tool-input" // Tool configuration
  | "checkbox-list" // Multiple selection
  | "condition-input" // Conditional logic
  | "eval-input" // Evaluation input
  | "time-input" // Time input
  | "oauth-input" // OAuth credential selector
  | "webhook-config" // Webhook configuration
  | "trigger-config" // Trigger configuration
  | "schedule-config" // Schedule status and information
  | "file-selector" // File selector for Google Drive, etc.
  | "project-selector" // Project selector for Jira, Discord, etc.
  | "channel-selector" // Channel selector for Slack, Discord, etc.
  | "folder-selector" // Folder selector for Gmail, etc.
  | "knowledge-base-selector" // Knowledge base selector
  | "knowledge-tag-filters" // Multiple tag filters for knowledge bases
  | "document-selector" // Document selector for knowledge bases
  | "document-tag-entry" // Document tag entry for creating documents
  | "input-format" // Input structure format
  | "response-format" // Response structure format
  | "file-upload" // File uploader
  // Iraqi-specific sub-block types
  | "arabic-text-input" // Arabic text input with RTL support
  | "dialect-selector" // Iraqi dialect selection
  | "cultural-validator" // Cultural appropriateness validator
  | "islamic-compliance" // Islamic compliance checker
  | "payment-gateway-selector" // Iraqi payment gateway selector
  | "professional-domain-selector" // Iraqi professional domain selector
  | "language-switcher"; // Arabic/English language switcher

export type SubBlockLayout = "full" | "half";

// ============================================================================
// ENHANCED INTERFACES WITH CULTURAL INTEGRATION
// ============================================================================

export interface CulturalComplianceConfig {
  islamicCompliance: {
    enabled: boolean;
    level: "basic" | "standard" | "strict"; // 90%, 95%, 99% compliance
    validators: string[];
  };
  languageSupport: {
    arabic: boolean;
    iraqiDialect: boolean;
    rtlLayout: boolean;
    mixedContent: boolean;
  };
  professionalDomains: {
    legal: boolean;
    medical: boolean;
    educational: boolean;
    organizational: boolean;
  };
  paymentIntegration: {
    zainCash: boolean;
    fastPay: boolean;
    nassWallet: boolean;
    securityLevel: "standard" | "enhanced";
  };
}

export interface ParamConfig {
  type: ParamType;
  description?: string;
  culturalValidation?: boolean;
  arabicSupport?: boolean;
  schema?: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
    additionalProperties?: boolean;
    items?: {
      type: string;
      properties?: Record<string, any>;
      required?: string[];
      additionalProperties?: boolean;
    };
  };
}

export interface SubBlockConfig {
  id: string;
  title?: string;
  titleArabic?: string; // Arabic title for RTL support
  type: SubBlockType;
  layout?: SubBlockLayout;
  mode?: "basic" | "advanced" | "both";
  required?: boolean;
  culturallyRequired?: boolean; // Required for cultural compliance
  options?:
    | {
        label: string;
        labelArabic?: string;
        id: string;
        icon?: React.ComponentType<{ className?: string }>;
        culturallyAppropriate?: boolean;
      }[]
    | (() => {
        label: string;
        labelArabic?: string;
        id: string;
        icon?: React.ComponentType<{ className?: string }>;
        culturallyAppropriate?: boolean;
      }[]);
  min?: number;
  max?: number;
  columns?: string[];
  placeholder?: string;
  placeholderArabic?: string;
  password?: boolean;
  connectionDroppable?: boolean;
  hidden?: boolean;
  description?: string;
  descriptionArabic?: string;
  value?: (params: Record<string, any>) => string;
  condition?:
    | {
        field: string;
        value: string | number | boolean | Array<string | number | boolean>;
        not?: boolean;
        and?: {
          field: string;
          value:
            | string
            | number
            | boolean
            | Array<string | number | boolean>
            | undefined;
          not?: boolean;
        };
      }
    | (() => {
        field: string;
        value: string | number | boolean | Array<string | number | boolean>;
        not?: boolean;
        and?: {
          field: string;
          value:
            | string
            | number
            | boolean
            | Array<string | number | boolean>
            | undefined;
          not?: boolean;
        };
      });
  // Code editor specific properties
  language?: "javascript" | "json" | "arabic" | "mixed";
  generationType?: GenerationType;
  // OAuth specific properties
  provider?: string;
  serviceId?: string;
  requiredScopes?: string[];
  // File operations
  mimeType?: string;
  acceptedTypes?: string;
  multiple?: boolean;
  maxSize?: number;
  // UI properties
  step?: number;
  integer?: boolean;
  rows?: number;
  multiSelect?: boolean;
  // AI assistance configuration
  wandConfig?: {
    enabled: boolean;
    prompt: string;
    promptArabic?: string;
    generationType?: GenerationType;
    placeholder?: string;
    placeholderArabic?: string;
    maintainHistory?: boolean;
    culturalContext?: boolean;
  };
  // Trigger configuration
  availableTriggers?: string[];
  triggerProvider?: string;
  dependsOn?: string[];
  // Iraqi-specific configuration
  culturalCompliance?: CulturalComplianceConfig;
  arabicRtlSupport?: boolean;
  iraqiDialectSupport?: boolean;
}

export type BlockOutput =
  | PrimitiveValueType
  | { [key: string]: PrimitiveValueType | Record<string, any> };

export type OutputFieldDefinition =
  | PrimitiveValueType
  | {
      type: PrimitiveValueType;
      description?: string;
      descriptionArabic?: string;
      culturallyValidated?: boolean;
    };

export interface BlockConfig<T = any> {
  type: string;
  name: string;
  nameArabic?: string;
  description: string;
  descriptionArabic?: string;
  category: BlockCategory;
  longDescription?: string;
  longDescriptionArabic?: string;
  docsLink?: string;
  docsLinkArabic?: string;
  bgColor: string;
  icon: BlockIcon;
  subBlocks: SubBlockConfig[];
  tools: {
    access: string[];
    config?: {
      tool: (params: Record<string, any>) => string;
      params?: (params: Record<string, any>) => Record<string, any>;
    };
  };
  inputs: Record<string, ParamConfig>;
  outputs: Record<string, OutputFieldDefinition> & {
    visualization?: {
      type: "image" | "chart" | "arabic-text";
      url: string;
    };
  };
  hideFromToolbar?: boolean;
  triggers?: {
    enabled: boolean;
    available: string[];
  };
  // Iraqi-specific properties
  culturalCompliance?: CulturalComplianceConfig;
  professionalDomain?:
    | "legal"
    | "medical"
    | "educational"
    | "organizational"
    | "general";
  islamicCompliant?: boolean;
  arabicSupport?: boolean;
}

export interface OutputConfig {
  type: BlockOutput;
  culturallyValidated?: boolean;
  arabicProcessed?: boolean;
}

// ============================================================================
// WORKFLOW EXECUTION TYPES
// ============================================================================

export interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: Record<string, any>;
  culturalContext?: {
    language: "en" | "ar" | "mixed";
    dialect: "iraqi" | "standard" | "mixed";
    professionalDomain?: string;
    islamicCompliance: boolean;
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  type?: "default" | "conditional" | "cultural-validation";
  data?: Record<string, any>;
}

export interface WorkflowContext {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  culturalSettings: CulturalComplianceConfig;
  language: "en" | "ar" | "mixed";
  rtlMode: boolean;
}

// ============================================================================
// EXECUTION ENGINE TYPES
// ============================================================================

export interface ExecutionResult {
  success: boolean;
  output?: any;
  error?: string;
  culturalValidation?: {
    passed: boolean;
    score: number;
    issues: string[];
  };
  arabicProcessing?: {
    rtlHandled: boolean;
    dialectRecognized: boolean;
    mixedContentProcessed: boolean;
  };
  metadata?: {
    executionTime: number;
    culturalValidationTime: number;
    arabicProcessingTime: number;
  };
}

export interface ExecutionContext {
  workflowId: string;
  nodeId: string;
  userId: string;
  culturalSettings: CulturalComplianceConfig;
  language: "en" | "ar" | "mixed";
  metadata: Record<string, any>;
}

// ============================================================================
// EXPORT CORE TYPES
// ============================================================================

export type {
  BlockIcon,
  ParamType,
  PrimitiveValueType,
  BlockCategory,
  GenerationType,
  SubBlockType,
  SubBlockLayout,
};
