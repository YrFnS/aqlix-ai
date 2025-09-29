/**
 * Iraqi AI Enhanced Workflow Block
 * Enhanced workflow execution with cultural intelligence
 */

import { WorkflowIcon } from "../../icons/workflow-icons";
import type { BlockConfig } from "../types";

// Helper function to get available workflows with cultural context
const getAvailableWorkflows = (): Array<{ label: string; id: string }> => {
  try {
    // This would integrate with the Iraqi workflow registry
    const availableWorkflows = [
      { label: "سير عمل قانوني / Legal Workflow", id: "legal-workflow" },
      { label: "سير عمل طبي / Medical Workflow", id: "medical-workflow" },
      {
        label: "سير عمل تعليمي / Educational Workflow",
        id: "educational-workflow",
      },
      {
        label: "سير عمل تنظيمي / Organizational Workflow",
        id: "organizational-workflow",
      },
      { label: "معالجة الدفع / Payment Processing", id: "payment-workflow" },
      {
        label: "معالجة النصوص العربية / Arabic Text Processing",
        id: "arabic-processing-workflow",
      },
    ].sort((a, b) => a.label.localeCompare(b.label));

    return availableWorkflows;
  } catch (error) {
    console.error("Error getting available workflows:", error);
    return [];
  }
};

export const WorkflowBlock: BlockConfig = {
  type: "workflow",
  name: "تنفيذ سير العمل / Workflow Executor",
  description: "Execute another workflow with cultural context",
  longDescription:
    "Execute child workflows with Iraqi cultural intelligence and professional domain validation",
  category: "blocks",
  bgColor: "#705335",
  icon: WorkflowIcon,

  subBlocks: [
    {
      id: "workflowId",
      title: "اختيار سير العمل / Select Workflow",
      type: "dropdown",
      options: getAvailableWorkflows,
      required: true,
      rtlSupport: true,
      description: "Choose a culturally validated workflow to execute",
    },

    {
      id: "professionalContext",
      title: "السياق المهني / Professional Context",
      type: "professional-domain-selector",
      options: [
        { label: "قانوني / Legal", id: "legal" },
        { label: "طبي / Medical", id: "medical" },
        { label: "تعليمي / Educational", id: "educational" },
        { label: "تنظيمي / Organizational", id: "organizational" },
      ],
      description: "Professional domain for cultural validation",
      rtlSupport: true,
    },

    {
      id: "culturalValidation",
      title: "التحقق الثقافي / Cultural Validation",
      type: "cultural-validation",
      mode: "advanced",
      description: "Validate workflow execution against Iraqi cultural norms",
      culturalValidation: {
        enabled: true,
        islamicCompliance: true,
        politicalNeutrality: true,
        dialectSupport: "iraqi",
      },
    },

    {
      id: "input",
      title: "متغير الإدخال / Input Variable",
      type: "arabic-text-input",
      placeholder: "Select a variable to pass to the child workflow",
      description:
        "This variable will be available as start.input in the child workflow with Arabic support",
      required: false,
      rtlSupport: true,
      arabicKeyboard: true,
    },

    {
      id: "arabicProcessing",
      title: "معالجة النصوص العربية / Arabic Processing",
      type: "rtl-layout-config",
      mode: "advanced",
      description: "Configure Arabic text processing for child workflow",
      condition: {
        field: "workflowId",
        value: "arabic-processing-workflow",
      },
      rtlSupport: true,
    },

    {
      id: "paymentConfig",
      title: "إعدادات الدفع / Payment Configuration",
      type: "payment-gateway-selector",
      condition: {
        field: "workflowId",
        value: "payment-workflow",
      },
      options: [
        { label: "زين كاش / ZainCash", id: "zaincash" },
        { label: "فاست باي / FastPay", id: "fastpay" },
        { label: "ناس والت / NassWallet", id: "nasswallet" },
      ],
      description: "Configure payment gateway for financial workflows",
      rtlSupport: true,
    },
  ],

  tools: {
    access: [
      "workflow_executor",
      "cultural_validator",
      "arabic_processor",
      "payment_gateway_connector",
      "professional_domain_validator",
    ],
  },

  inputs: {
    workflowId: {
      type: "string",
      description: "ID of the culturally validated workflow to execute",
    },
    professionalContext: {
      type: "string",
      description: "Professional domain context for validation",
      professionalDomain: "organizational",
    },
    input: {
      type: "arabic-text",
      description: "Variable reference with Arabic support",
      culturalValidation: true,
      arabicSupport: true,
    },
    culturalSettings: {
      type: "json",
      description: "Cultural validation configuration",
    },
    arabicConfiguration: {
      type: "json",
      description: "Arabic text processing settings",
    },
    paymentConfiguration: {
      type: "json",
      description: "Iraqi payment gateway configuration",
    },
  },

  outputs: {
    success: {
      type: "boolean",
      description: "Execution success status with cultural validation",
    },
    childWorkflowName: {
      type: "string",
      description: "Child workflow name in Arabic and English",
    },
    result: {
      type: "json",
      description: "Workflow execution result with cultural context",
    },
    culturalValidation: {
      type: "json",
      description: "Cultural validation results and compliance metrics",
    },
    arabicProcessingResult: {
      type: "json",
      description: "Arabic text processing results",
    },
    paymentResult: {
      type: "json",
      description: "Payment processing results (if applicable)",
    },
    error: {
      type: "string",
      description: "Error message in Arabic and English",
    },
  },

  // Iraqi AI Enhancements
  iraqiEnhancements: {
    culturalValidation: {
      enabled: true,
      islamicCompliance: true,
      politicalNeutrality: true,
      professionalContext: "organizational",
      dialectSupport: "both",
    },
    professionalDomains: {
      enabled: true,
      supportedDomains: ["legal", "medical", "educational", "organizational"],
    },
    arabicProcessing: {
      enabled: true,
      dialectSupport: true,
      rtlLayout: true,
      mixedContent: true,
    },
    paymentGateways: {
      enabled: true,
      supportedGateways: ["zaincash", "fastpay", "nasswallet"],
      testMode: true,
    },
  },
};
