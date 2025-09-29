/**
 * Iraqi AI Enhanced Slack Integration Block
 * Slack integration with Arabic message support and cultural validation
 */

import { SlackIcon } from "../../icons/workflow-icons";
import type { BlockConfig } from "../types";

interface IraqiSlackResponse {
  success: boolean;
  messageId?: string;
  timestamp?: string;
  channel?: string;
  culturalValidation?: {
    isValid: boolean;
    confidence: number;
    violations: string[];
  };
  arabicProcessing?: {
    originalText: string;
    processedText: string;
    rtlFormatted: boolean;
    dialectDetected: string;
  };
  error?: string;
}

export const SlackBlock: BlockConfig<IraqiSlackResponse> = {
  type: "slack",
  name: "سلاك / Slack Integration",
  description: "Send culturally validated messages to Slack",
  longDescription:
    "Enhanced Slack integration with Arabic message support, cultural validation, and professional domain compliance for Iraqi teams",
  docsLink: "https://docs.iraqi-ai.com/blocks/slack",
  category: "tools",
  bgColor: "#611f69",
  icon: SlackIcon,

  subBlocks: [
    {
      id: "operation",
      title: "العملية / Operation",
      type: "dropdown",
      layout: "full",
      options: [
        { label: "إرسال رسالة / Send Message", id: "send" },
        { label: "إنشاء canvas / Create Canvas", id: "canvas" },
        { label: "قراءة الرسائل / Read Messages", id: "read" },
        { label: "إرسال رسالة عربية / Send Arabic Message", id: "send-arabic" },
      ],
      value: () => "send",
      rtlSupport: true,
    },

    {
      id: "authMethod",
      title: "طريقة المصادقة / Authentication",
      type: "dropdown",
      layout: "full",
      options: [
        { label: "Iraqi AI Bot / بوت الذكاء العراقي", id: "iraqi-oauth" },
        { label: "Sim Bot / بوت سيم", id: "oauth" },
        { label: "Custom Bot / بوت مخصص", id: "bot_token" },
      ],
      value: () => "iraqi-oauth",
      required: true,
      rtlSupport: true,
    },

    {
      id: "workspace",
      title: "مساحة العمل / Workspace",
      type: "dropdown",
      condition: {
        field: "authMethod",
        value: ["iraqi-oauth", "oauth"],
      },
      options: [], // Will be populated dynamically
      required: true,
      rtlSupport: true,
    },

    {
      id: "channel",
      title: "القناة / Channel",
      type: "channel-selector",
      layout: "full",
      required: true,
      placeholder: "#general أو @username",
      description: "Slack channel or user to send message to",
      rtlSupport: true,
    },

    {
      id: "professionalContext",
      title: "السياق المهني / Professional Context",
      type: "professional-domain-selector",
      layout: "half",
      options: [
        { label: "قانوني / Legal", id: "legal" },
        { label: "طبي / Medical", id: "medical" },
        { label: "تعليمي / Educational", id: "educational" },
        { label: "تنظيمي / Organizational", id: "organizational" },
        { label: "عام / General", id: "general" },
      ],
      description: "Professional domain for message validation",
      rtlSupport: true,
    },

    {
      id: "messageType",
      title: "نوع الرسالة / Message Type",
      type: "dropdown",
      layout: "half",
      options: [
        { label: "نص عادي / Plain Text", id: "text" },
        { label: "نص غني / Rich Text", id: "rich" },
        { label: "عربي مع إنجليزي / Arabic with English", id: "mixed" },
        { label: "تنبيه مهني / Professional Alert", id: "professional" },
      ],
      value: () => "text",
      rtlSupport: true,
    },

    {
      id: "message",
      title: "الرسالة / Message",
      type: "arabic-text-input",
      layout: "full",
      required: true,
      rows: 6,
      placeholder: "اكتب رسالتك هنا...\nType your message here...",
      description: "Message content with Arabic and English support",
      rtlSupport: true,
      arabicKeyboard: true,
      culturalValidation: true,
    },

    {
      id: "culturalValidation",
      title: "التحقق الثقافي / Cultural Validation",
      type: "cultural-validation",
      mode: "advanced",
      description:
        "Validate message content for Iraqi cultural appropriateness",
      culturalValidation: {
        enabled: true,
        islamicCompliance: true,
        politicalNeutrality: true,
        dialectSupport: "iraqi",
      },
    },

    {
      id: "arabicFormatting",
      title: "تنسيق النص العربي / Arabic Formatting",
      type: "checkbox-list",
      condition: {
        field: "messageType",
        value: ["mixed", "rich"],
      },
      options: [
        { label: "تطبيق تنسيق RTL / Apply RTL formatting", id: "rtl-format" },
        {
          label: "تصحيح النصوص العربية / Correct Arabic text",
          id: "arabic-correction",
        },
        { label: "تحويل اللهجة / Convert dialect", id: "dialect-conversion" },
        {
          label: "إضافة رموز تعبيرية عربية / Add Arabic emojis",
          id: "arabic-emojis",
        },
      ],
      rtlSupport: true,
    },

    {
      id: "mentionUsers",
      title: "الإشارة للمستخدمين / Mention Users",
      type: "short-input",
      placeholder: "@user1, @user2",
      description: "Users to mention in the message",
      rtlSupport: true,
    },

    {
      id: "threadReply",
      title: "الرد على موضوع / Thread Reply",
      type: "switch",
      description: "Reply to an existing thread",
      mode: "advanced",
    },

    {
      id: "threadTimestamp",
      title: "معرف الموضوع / Thread Timestamp",
      type: "short-input",
      condition: {
        field: "threadReply",
        value: true,
      },
      placeholder: "1234567890.123456",
      description: "Timestamp of the parent message",
      mode: "advanced",
    },

    {
      id: "priority",
      title: "الأولوية / Priority",
      type: "dropdown",
      mode: "advanced",
      options: [
        { label: "عادية / Normal", id: "normal" },
        { label: "مهمة / Important", id: "important" },
        { label: "عاجلة / Urgent", id: "urgent" },
        { label: "طارئة / Emergency", id: "emergency" },
      ],
      value: () => "normal",
      rtlSupport: true,
    },

    {
      id: "scheduleSend",
      title: "جدولة الإرسال / Schedule Send",
      type: "switch",
      mode: "advanced",
      description: "Schedule message for later delivery",
    },

    {
      id: "scheduleTime",
      title: "وقت الجدولة / Schedule Time",
      type: "time-input",
      condition: {
        field: "scheduleSend",
        value: true,
      },
      mode: "advanced",
      description: "When to send the scheduled message",
    },

    {
      id: "attachments",
      title: "المرفقات / Attachments",
      type: "file-upload",
      mode: "advanced",
      multiple: true,
      acceptedTypes: "image/*,application/pdf,.doc,.docx",
      description: "Files to attach to the message",
    },
  ],

  tools: {
    access: [
      "slack_api",
      "cultural_validator",
      "arabic_processor",
      "professional_domain_validator",
      "schedule_manager",
    ],
  },

  inputs: {
    operation: {
      type: "string",
      description: "Slack operation to perform",
    },
    authMethod: {
      type: "string",
      description: "Authentication method",
    },
    workspace: {
      type: "string",
      description: "Slack workspace ID",
    },
    channel: {
      type: "string",
      description: "Target channel or user",
    },
    professionalContext: {
      type: "string",
      description: "Professional domain context",
      professionalDomain: "general",
    },
    messageType: {
      type: "string",
      description: "Type of message to send",
    },
    message: {
      type: "arabic-text",
      description: "Message content with Arabic support",
      culturalValidation: true,
      arabicSupport: true,
    },
    culturalSettings: {
      type: "json",
      description: "Cultural validation configuration",
    },
    arabicFormatting: {
      type: "json",
      description: "Arabic text formatting options",
    },
    mentionUsers: {
      type: "string",
      description: "Users to mention in the message",
    },
    threadReply: {
      type: "boolean",
      description: "Whether this is a thread reply",
    },
    threadTimestamp: {
      type: "string",
      description: "Parent message timestamp for threading",
    },
    priority: {
      type: "string",
      description: "Message priority level",
    },
    scheduleSend: {
      type: "boolean",
      description: "Whether to schedule the message",
    },
    scheduleTime: {
      type: "string",
      description: "Scheduled send time",
    },
    attachments: {
      type: "json",
      description: "File attachments",
    },
  },

  outputs: {
    success: {
      type: "boolean",
      description: "Whether the message was sent successfully",
    },
    messageId: {
      type: "string",
      description: "Slack message ID",
    },
    timestamp: {
      type: "string",
      description: "Message timestamp",
    },
    channel: {
      type: "string",
      description: "Channel where message was sent",
    },
    culturalValidation: {
      type: "json",
      description: "Cultural validation results",
    },
    arabicProcessing: {
      type: "json",
      description: "Arabic text processing results",
    },
    messageUrl: {
      type: "string",
      description: "Direct link to the sent message",
    },
    reactions: {
      type: "json",
      description: "Message reactions (if reading messages)",
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
  },
};
