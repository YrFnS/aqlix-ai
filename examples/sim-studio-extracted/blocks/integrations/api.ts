/**
 * Iraqi AI Enhanced API Block
 * API integration with cultural validation and Arabic content processing
 */

import { ApiIcon } from "../../icons/workflow-icons";
import type { BlockConfig } from "../types";

interface IraqiApiResponse {
  status: number;
  data: any;
  headers: Record<string, string>;
  culturalValidation?: {
    isValid: boolean;
    confidence: number;
    violations: string[];
  };
  arabicProcessing?: {
    detectedContent: boolean;
    processedContent?: string;
    rtlFormatted: boolean;
  };
  securityValidation?: {
    isSecure: boolean;
    threats: string[];
    recommendations: string[];
  };
}

export const ApiBlock: BlockConfig<IraqiApiResponse> = {
  type: "api",
  name: "واجهة برمجة التطبيقات / API Integration",
  description: "Connect to any API with cultural validation",
  longDescription:
    "Enhanced API integration with Iraqi cultural intelligence, Arabic content processing, and security validation for professional domains",
  docsLink: "https://docs.iraqi-ai.com/blocks/api",
  category: "blocks",
  bgColor: "#2F55FF",
  icon: ApiIcon,

  subBlocks: [
    {
      id: "url",
      title: "رابط API / API URL",
      type: "short-input",
      layout: "full",
      placeholder: "https://api.example.com/endpoint",
      required: true,
      description: "API endpoint URL with HTTPS required for Iraqi compliance",
      rtlSupport: true,
    },

    {
      id: "method",
      title: "طريقة الطلب / HTTP Method",
      type: "dropdown",
      layout: "half",
      required: true,
      options: [
        { label: "GET - جلب / Retrieve", id: "GET" },
        { label: "POST - إرسال / Submit", id: "POST" },
        { label: "PUT - تحديث / Update", id: "PUT" },
        { label: "DELETE - حذف / Delete", id: "DELETE" },
        { label: "PATCH - تعديل / Modify", id: "PATCH" },
      ],
      rtlSupport: true,
    },

    {
      id: "professionalDomain",
      title: "المجال المهني / Professional Domain",
      type: "professional-domain-selector",
      layout: "half",
      options: [
        { label: "قانوني / Legal", id: "legal" },
        { label: "طبي / Medical", id: "medical" },
        { label: "تعليمي / Educational", id: "educational" },
        { label: "تنظيمي / Organizational", id: "organizational" },
        { label: "عام / General", id: "general" },
      ],
      description: "Professional context for cultural validation",
      rtlSupport: true,
    },

    {
      id: "culturalValidation",
      title: "التحقق الثقافي / Cultural Validation",
      type: "cultural-validation",
      mode: "advanced",
      description:
        "Validate API request/response for Iraqi cultural appropriateness",
      culturalValidation: {
        enabled: true,
        islamicCompliance: true,
        politicalNeutrality: true,
        dialectSupport: "iraqi",
      },
    },

    {
      id: "headers",
      title: "رؤوس الطلب / Request Headers",
      type: "table",
      layout: "full",
      columns: ["Key / المفتاح", "Value / القيمة"],
      description: "Custom headers including Arabic content-type support",
      rtlSupport: true,
    },

    {
      id: "params",
      title: "معاملات الاستعلام / Query Parameters",
      type: "table",
      layout: "full",
      columns: ["Parameter / المعامل", "Value / القيمة"],
      description: "URL query parameters with Arabic encoding support",
      rtlSupport: true,
    },

    {
      id: "body",
      title: "محتوى الطلب / Request Body",
      type: "code",
      layout: "full",
      language: "json",
      condition: {
        field: "method",
        value: ["POST", "PUT", "PATCH"],
      },
      description: "JSON request body with Arabic text support",
      placeholder: '{\n  "message": "مرحبا بك",\n  "name": "اسم المستخدم"\n}',
    },

    {
      id: "arabicProcessing",
      title: "معالجة النصوص العربية / Arabic Processing",
      type: "checkbox-list",
      mode: "advanced",
      options: [
        {
          label: "معالجة النصوص الواردة / Process incoming Arabic text",
          id: "process-incoming",
        },
        { label: "تنسيق RTL / Apply RTL formatting", id: "rtl-formatting" },
        { label: "تحليل اللهجة / Analyze dialect", id: "dialect-analysis" },
        { label: "تصحيح النصوص / Text correction", id: "text-correction" },
      ],
      rtlSupport: true,
    },

    {
      id: "securitySettings",
      title: "الإعدادات الأمنية / Security Settings",
      type: "checkbox-list",
      mode: "advanced",
      options: [
        {
          label: "فحص الروابط المشبوهة / Scan for suspicious URLs",
          id: "url-scanning",
        },
        {
          label: "التحقق من الشهادات / Certificate validation",
          id: "cert-validation",
        },
        { label: "فلترة المحتوى / Content filtering", id: "content-filtering" },
        { label: "سجل الطلبات / Request logging", id: "request-logging" },
      ],
      rtlSupport: true,
    },

    {
      id: "timeout",
      title: "مهلة الانتظار / Request Timeout",
      type: "slider",
      min: 5,
      max: 300,
      step: 5,
      value: () => "30",
      mode: "advanced",
      description: "Request timeout in seconds (5-300)",
    },

    {
      id: "retrySettings",
      title: "إعدادات إعادة المحاولة / Retry Settings",
      type: "checkbox-list",
      mode: "advanced",
      options: [
        {
          label: "إعادة المحاولة التلقائية / Auto retry on failure",
          id: "auto-retry",
        },
        {
          label: "تأخير تدريجي / Exponential backoff",
          id: "exponential-backoff",
        },
        {
          label: "إعادة المحاولة للأخطاء المؤقتة / Retry on temporary errors",
          id: "retry-temp-errors",
        },
      ],
      rtlSupport: true,
    },
  ],

  tools: {
    access: [
      "http_client",
      "cultural_validator",
      "arabic_processor",
      "security_scanner",
      "professional_domain_validator",
    ],
  },

  inputs: {
    url: {
      type: "string",
      description: "API endpoint URL (HTTPS required)",
    },
    method: {
      type: "string",
      description: "HTTP method for the request",
    },
    professionalDomain: {
      type: "string",
      description: "Professional domain context",
      professionalDomain: "general",
    },
    headers: {
      type: "json",
      description: "Custom request headers with Arabic support",
    },
    params: {
      type: "json",
      description: "Query parameters with Arabic encoding",
    },
    body: {
      type: "json",
      description: "Request body with Arabic text support",
      arabicSupport: true,
    },
    culturalSettings: {
      type: "json",
      description: "Cultural validation configuration",
    },
    arabicProcessing: {
      type: "json",
      description: "Arabic text processing options",
    },
    securitySettings: {
      type: "json",
      description: "Security validation settings",
    },
    timeout: {
      type: "number",
      description: "Request timeout in seconds",
    },
    retrySettings: {
      type: "json",
      description: "Retry configuration options",
    },
  },

  outputs: {
    status: {
      type: "number",
      description: "HTTP status code",
    },
    data: {
      type: "json",
      description: "Response data with Arabic text processing",
    },
    headers: {
      type: "json",
      description: "Response headers",
    },
    culturalValidation: {
      type: "json",
      description: "Cultural validation results for request/response",
    },
    arabicProcessing: {
      type: "json",
      description: "Arabic text processing results",
    },
    securityValidation: {
      type: "json",
      description: "Security scan results and recommendations",
    },
    executionTime: {
      type: "number",
      description: "Request execution time in milliseconds",
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
      professionalContext: "general",
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
  },
};
