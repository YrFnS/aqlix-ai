/**
 * Iraqi AI Chat System - CopilotKit Foundation
 *
 * Enhanced CopilotKit integration with Iraqi cultural sovereignty,
 * Islamic compliance, and Arabic language support.
 *
 * This module provides a complete foundation for integrating CopilotKit
 * runtime capabilities with Iraqi cultural enhancements.
 */

// Core Iraqi CopilotKit Runtime
export { IraqiCopilotRuntime } from "./runtime/iraqi-copilot-runtime";
export type {
  IraqiEnhancementConfig,
  IraqiCopilotRuntimeOptions,
  CulturalValidationOptions,
  CulturalValidationResult,
  ArabicProcessingOptions,
  ArabicProcessingResult,
  PaymentGatewayIntegration,
  ProfessionalDomainSupport,
  IslamicComplianceValidation,
  AgentCoordinationConfig,
} from "./runtime/iraqi-copilot-runtime";

// Iraqi Cultural Layer
export { IraqiCulturalLayer } from "../iraqi-cultural-layer/cultural-layer";
export type {
  CulturalValidationOptions as CulturalLayerOptions,
  CulturalValidationResult as CulturalLayerResult,
  IraqiEnhancementConfig as CulturalConfig,
} from "../iraqi-cultural-layer/cultural-layer";

// Arabic RTL Processing
export { ArabicRTLProcessor } from "../iraqi-cultural-layer/arabic-processor";
export type {
  ArabicProcessingOptions as RTLOptions,
  ArabicProcessingResult as RTLResult,
  IraqiDialectFeatures,
  RTLLayoutOptions,
  MixedContentHandling,
} from "../iraqi-cultural-layer/arabic-processor";

// Islamic Compliance Validation
export { IslamicComplianceValidator } from "../iraqi-cultural-layer/islamic-validator";
export type {
  IslamicValidationOptions,
  IslamicValidationResult,
  IslamicPrinciples,
  ComplianceCategories,
  IslamicEthics,
} from "../iraqi-cultural-layer/islamic-validator";

// Payment Gateway Integration
export { IraqiPaymentGateway } from "../iraqi-cultural-layer/payment-gateway";
export type {
  PaymentGatewayConfig,
  PaymentRequest,
  PaymentResponse,
  PaymentValidationResult,
} from "../iraqi-cultural-layer/payment-gateway";

// Professional Domains Support
export { IraqiProfessionalDomains } from "../iraqi-cultural-layer/professional-domains";
export type {
  ProfessionalDomainConfig,
  DomainExpertiseRequest,
  DomainExpertiseResponse,
  IraqiLegalStandards,
  IraqiMedicalStandards,
  IraqiEducationalStandards,
  IraqiOrganizationalStandards,
} from "../iraqi-cultural-layer/professional-domains";

// Agent Coordination System
export { IraqiAgentCoordinator } from "../iraqi-cultural-layer/agent-coordinator";
export type {
  AgentCapability,
  AgentRequest,
  AgentResponse,
  WorkflowPattern,
} from "../iraqi-cultural-layer/agent-coordinator";

/**
 * Default configuration for Iraqi AI Chat System
 */
export const DEFAULT_IRAQI_CONFIG: IraqiEnhancementConfig = {
  culturalValidation: {
    enabled: true,
    strictMode: false,
    requiredScore: 85,
  },
  islamicCompliance: {
    enabled: true,
    requiredScore: 90,
    strictInterpretation: false,
  },
  arabicProcessing: {
    enabled: true,
    dialectSupport: true,
    rtlAccuracy: 0.99,
  },
  professionalDomains: {
    enabled: true,
    supportedDomains: ["legal", "medical", "educational", "organizational"],
  },
  paymentGateways: {
    enabled: true,
    supportedGateways: ["zainCash", "fastPay", "nassWallet"],
    securityLevel: "high",
  },
};

/**
 * Create Iraqi CopilotKit Runtime with default configuration
 */
export function createIraqiCopilotRuntime(
  customConfig?: Partial<IraqiEnhancementConfig>,
) {
  const config = { ...DEFAULT_IRAQI_CONFIG, ...customConfig };
  return new IraqiCopilotRuntime({ iraqiConfig: config });
}

/**
 * Utility functions for Iraqi AI integration
 */
export const IraqiAIUtils = {
  /**
   * Validate Arabic text for RTL processing
   */
  isArabicText: (text: string): boolean => {
    const arabicRegex =
      /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    return arabicRegex.test(text);
  },

  /**
   * Check if text contains Iraqi dialect features
   */
  containsIraqiDialect: (text: string): boolean => {
    const iraqiFeatures = [
      "چ",
      "گ",
      "ژ",
      "پ",
      "تشلون",
      "شلونك",
      "فلوس",
      "هواي",
    ];
    return iraqiFeatures.some((feature) => text.includes(feature));
  },

  /**
   * Format Iraqi phone number
   */
  formatIraqiPhone: (phone: string): string => {
    // Convert to standard Iraqi format: +964XXXXXXXXX
    if (phone.startsWith("07")) {
      return `+964${phone.substring(1)}`;
    }
    if (phone.startsWith("0964")) {
      return `+${phone.substring(1)}`;
    }
    if (phone.startsWith("964") && !phone.startsWith("+964")) {
      return `+${phone}`;
    }
    return phone;
  },

  /**
   * Validate Iraqi Dinar amount
   */
  validateIQDAmount: (amount: number): { valid: boolean; message?: string } => {
    if (amount <= 0) {
      return { valid: false, message: "Amount must be positive" };
    }
    if (amount < 250) {
      return { valid: false, message: "Minimum amount is 250 IQD" };
    }
    if (amount > 10000000) {
      return { valid: false, message: "Maximum amount is 10,000,000 IQD" };
    }
    return { valid: true };
  },

  /**
   * Get Iraqi business hours (Sunday to Thursday, 8 AM to 5 PM Baghdad time)
   */
  getIraqiBusinessHours: (): {
    isBusinessHours: boolean;
    nextBusinessTime?: Date;
  } => {
    const now = new Date();
    const baghdadTime = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Baghdad" }),
    );
    const day = baghdadTime.getDay(); // 0 = Sunday, 6 = Saturday
    const hour = baghdadTime.getHours();

    // Iraqi business days: Sunday (0) to Thursday (4)
    const isBusinessDay = day >= 0 && day <= 4;
    const isBusinessHour = hour >= 8 && hour < 17;

    return {
      isBusinessHours: isBusinessDay && isBusinessHour,
    };
  },

  /**
   * Convert Gregorian date to Islamic calendar (Hijri)
   */
  toHijriDate: (date: Date): string => {
    // Simplified conversion (use proper Islamic calendar library in production)
    const gregorianYear = date.getFullYear();
    const approximateHijriYear = Math.floor((gregorianYear - 622) * 1.030684);
    return `${approximateHijriYear} هـ`;
  },
};

/**
 * Iraqi AI Chat System constants
 */
export const IRAQI_AI_CONSTANTS = {
  CURRENCY: "IQD",
  COUNTRY_CODE: "+964",
  TIMEZONE: "Asia/Baghdad",
  LANGUAGE_CODES: ["ar-IQ", "en-US"],
  PAYMENT_GATEWAYS: {
    ZAINCASH: {
      NAME: "ZainCash",
      MIN_AMOUNT: 1000,
      MAX_AMOUNT: 1000000,
      CURRENCY: "IQD",
    },
    FASTPAY: {
      NAME: "FastPay",
      MIN_AMOUNT: 500,
      MAX_AMOUNT: 500000,
      CURRENCY: "IQD",
    },
    NASSWALLET: {
      NAME: "NassWallet",
      MIN_AMOUNT: 1000,
      MAX_AMOUNT: 2000000,
      CURRENCY: "IQD",
    },
  },
  CULTURAL_THRESHOLDS: {
    MIN_CULTURAL_SCORE: 85,
    MIN_ISLAMIC_SCORE: 90,
    MIN_RTL_ACCURACY: 0.99,
    MIN_DIALECT_RECOGNITION: 0.85,
  },
} as const;

// Re-export essential types from the base CopilotKit (if needed)
export type {} from // Add CopilotKit base types here if they need to be exposed
"./runtime/iraqi-copilot-runtime";
