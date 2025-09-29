/**
 * Iraqi AI Enhanced Block Types
 * Extracted and enhanced from Sim Studio with Iraqi cultural intelligence
 */

import type { JSX, SVGProps } from "react";

export type BlockIcon = (props: SVGProps<SVGSVGElement>) => JSX.Element;
export type ParamType =
  | "string"
  | "number"
  | "boolean"
  | "json"
  | "arabic-text"
  | "professional-domain";
export type PrimitiveValueType =
  | "string"
  | "number"
  | "boolean"
  | "json"
  | "array"
  | "any"
  | "arabic-text";

export type BlockCategory =
  | "blocks"
  | "tools"
  | "triggers"
  | "iraqi-cultural"
  | "professional-domains";

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
  | "arabic-prompt"
  | "cultural-validation"
  | "professional-template";

export type SubBlockType =
  | "short-input"
  | "long-input"
  | "dropdown"
  | "combobox"
  | "slider"
  | "table"
  | "code"
  | "switch"
  | "tool-input"
  | "checkbox-list"
  | "condition-input"
  | "eval-input"
  | "time-input"
  | "oauth-input"
  | "webhook-config"
  | "trigger-config"
  | "schedule-config"
  | "file-selector"
  | "project-selector"
  | "channel-selector"
  | "folder-selector"
  | "knowledge-base-selector"
  | "knowledge-tag-filters"
  | "document-selector"
  | "document-tag-entry"
  | "input-format"
  | "response-format"
  | "file-upload"
  // Iraqi AI Enhanced Types
  | "arabic-text-input"
  | "cultural-validation"
  | "professional-domain-selector"
  | "payment-gateway-selector"
  | "rtl-layout-config"
  | "islamic-compliance-check";

export type SubBlockLayout = "full" | "half";

export type BlockOutput =
  | PrimitiveValueType
  | { [key: string]: PrimitiveValueType | Record<string, any> };

export type OutputFieldDefinition =
  | PrimitiveValueType
  | { type: PrimitiveValueType; description?: string };

export interface ParamConfig {
  type: ParamType;
  description?: string;
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
  // Iraqi AI Enhancements
  culturalValidation?: boolean;
  arabicSupport?: boolean;
  professionalDomain?: "legal" | "medical" | "educational" | "organizational";
}

export interface CulturalValidationConfig {
  enabled: boolean;
  islamicCompliance: boolean;
  politicalNeutrality: boolean;
  professionalContext?: "legal" | "medical" | "educational" | "organizational";
  dialectSupport?: "iraqi" | "standard" | "both";
}

export interface SubBlockConfig {
  id: string;
  title?: string;
  type: SubBlockType;
  layout?: SubBlockLayout;
  mode?: "basic" | "advanced" | "both";
  required?: boolean;
  options?:
    | {
        label: string;
        id: string;
        icon?: React.ComponentType<{ className?: string }>;
      }[]
    | (() => {
        label: string;
        id: string;
        icon?: React.ComponentType<{ className?: string }>;
      }[]);
  min?: number;
  max?: number;
  columns?: string[];
  placeholder?: string;
  password?: boolean;
  connectionDroppable?: boolean;
  hidden?: boolean;
  description?: string;
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
  // Code editor properties
  language?: "javascript" | "json" | "arabic";
  generationType?: GenerationType;
  // OAuth properties
  provider?: string;
  serviceId?: string;
  requiredScopes?: string[];
  // File selector properties
  mimeType?: string;
  acceptedTypes?: string;
  multiple?: boolean;
  maxSize?: number;
  // Slider properties
  step?: number;
  integer?: boolean;
  // Text input properties
  rows?: number;
  multiSelect?: boolean;
  // AI assistance configuration
  wandConfig?: {
    enabled: boolean;
    prompt: string;
    generationType?: GenerationType;
    placeholder?: string;
    maintainHistory?: boolean;
  };
  // Trigger configuration
  availableTriggers?: string[];
  triggerProvider?: string;
  // Dependencies
  dependsOn?: string[];
  // Iraqi AI Enhancements
  culturalValidation?: CulturalValidationConfig;
  rtlSupport?: boolean;
  arabicKeyboard?: boolean;
  professionalContext?: "legal" | "medical" | "educational" | "organizational";
}

export interface IraqiEnhancements {
  culturalValidation: CulturalValidationConfig;
  paymentGateways?: {
    enabled: boolean;
    supportedGateways: ("zaincash" | "fastpay" | "nasswallet")[];
    testMode: boolean;
  };
  professionalDomains?: {
    enabled: boolean;
    supportedDomains: (
      | "legal"
      | "medical"
      | "educational"
      | "organizational"
    )[];
  };
  arabicProcessing?: {
    enabled: boolean;
    dialectSupport: boolean;
    rtlLayout: boolean;
    mixedContent: boolean;
  };
}

export interface BlockConfig<T = any> {
  type: string;
  name: string;
  description: string;
  category: BlockCategory;
  longDescription?: string;
  docsLink?: string;
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
      url?: string;
      rtl?: boolean;
    };
  };
  hideFromToolbar?: boolean;
  triggers?: {
    enabled: boolean;
    available: string[];
  };
  // Iraqi AI Enhancements
  iraqiEnhancements?: IraqiEnhancements;
}

export interface OutputConfig {
  type: BlockOutput;
}

// Iraqi Cultural Validation Types
export interface CulturalValidationResult {
  isValid: boolean;
  confidence: number;
  violations: string[];
  suggestions: string[];
  islamicCompliance: number;
  politicalNeutrality: number;
}

// Professional Domain Types
export interface ProfessionalDomainConfig {
  domain: "legal" | "medical" | "educational" | "organizational";
  terminology: Record<string, string>;
  validationRules: string[];
  complianceRequirements: string[];
}

// Arabic Processing Types
export interface ArabicProcessingConfig {
  direction: "rtl" | "ltr" | "auto";
  dialect: "iraqi" | "standard" | "mixed";
  keyboard: "arabic" | "english" | "both";
  formatting: {
    numbers: "arabic" | "english" | "auto";
    dates: "hijri" | "gregorian" | "both";
    currency: "iqd" | "usd" | "both";
  };
}
