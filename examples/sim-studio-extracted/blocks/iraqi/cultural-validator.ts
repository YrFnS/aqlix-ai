/**
 * Iraqi Cultural Validator Block
 * Ensures content meets Iraqi cultural standards and Islamic compliance
 */

import { CulturalValidatorIcon } from '../../icons/cultural-icons'
import type { BlockConfig, CulturalValidationResult } from '../types'

export const CulturalValidatorBlock: BlockConfig = {
  type: 'cultural-validator',
  name: 'مُدقق الثقافة العراقية / Cultural Validator',
  description: 'Validate content for Iraqi cultural appropriateness',
  longDescription: 'Comprehensive cultural validation ensuring Islamic compliance, political neutrality, and professional appropriateness for Iraqi context',
  category: 'iraqi-cultural',
  bgColor: '#228B22',
  icon: CulturalValidatorIcon,

  subBlocks: [
    {
      id: 'contentToValidate',
      title: 'المحتوى للتحقق / Content to Validate',
      type: 'arabic-text-input',
      required: true,
      rows: 10,
      placeholder: 'أدخل المحتوى للتحقق من مطابقته للثقافة العراقية...',
      description: 'Enter text content for cultural validation',
      rtlSupport: true,
      arabicKeyboard: true,
    },

    {
      id: 'validationLevel',
      title: 'مستوى التحقق / Validation Level',
      type: 'dropdown',
      options: [
        { label: 'أساسي / Basic', id: 'basic' },
        { label: 'متوسط / Standard', id: 'standard' },
        { label: 'شامل / Comprehensive', id: 'comprehensive' },
        { label: 'مهني / Professional', id: 'professional' },
      ],
      value: () => 'standard',
      rtlSupport: true,
    },

    {
      id: 'professionalContext',
      title: 'السياق المهني / Professional Context',
      type: 'professional-domain-selector',
      options: [
        { label: 'قانوني / Legal', id: 'legal' },
        { label: 'طبي / Medical', id: 'medical' },
        { label: 'تعليمي / Educational', id: 'educational' },
        { label: 'تنظيمي / Organizational', id: 'organizational' },
        { label: 'عام / General', id: 'general' },
      ],
      description: 'Professional domain for specialized validation rules',
      rtlSupport: true,
    },

    {
      id: 'islamicCompliance',
      title: 'التحقق الإسلامي / Islamic Compliance',
      type: 'islamic-compliance-check',
      layout: 'full',
      description: 'Verify content aligns with Islamic values and principles',
      mode: 'advanced',
    },

    {
      id: 'politicalNeutrality',
      title: 'الحياد السياسي / Political Neutrality',
      type: 'switch',
      value: () => 'true',
      description: 'Ensure content avoids sensitive political topics',
    },

    {
      id: 'dialectSupport',
      title: 'دعم اللهجة / Dialect Support',
      type: 'dropdown',
      options: [
        { label: 'لهجة عراقية / Iraqi Dialect', id: 'iraqi' },
        { label: 'عربية فصحى / Standard Arabic', id: 'standard' },
        { label: 'مختلط / Mixed', id: 'mixed' },
      ],
      value: () => 'iraqi',
      rtlSupport: true,
    },

    {
      id: 'customRules',
      title: 'قواعد مخصصة / Custom Rules',
      type: 'long-input',
      mode: 'advanced',
      rows: 5,
      placeholder: 'أضف قواعد تحقق مخصصة...',
      description: 'Additional validation rules specific to your organization',
      rtlSupport: true,
    },

    {
      id: 'confidenceThreshold',
      title: 'عتبة الثقة / Confidence Threshold',
      type: 'slider',
      min: 0.5,
      max: 1.0,
      step: 0.05,
      value: () => '0.85',
      mode: 'advanced',
      description: 'Minimum confidence level for validation approval',
    },
  ],

  tools: {
    access: [
      'iraqi_cultural_validator',
      'islamic_compliance_checker',
      'political_neutrality_analyzer',
      'iraqi_dialect_processor',
    ],
  },

  inputs: {
    contentToValidate: {
      type: 'arabic-text',
      description: 'Text content for cultural validation',
      culturalValidation: true,
      arabicSupport: true,
    },
    validationLevel: {
      type: 'string',
      description: 'Level of validation thoroughness',
    },
    professionalContext: {
      type: 'string',
      description: 'Professional domain context',
      professionalDomain: 'general',
    },
    islamicCompliance: {
      type: 'boolean',
      description: 'Enable Islamic compliance checking',
    },
    politicalNeutrality: {
      type: 'boolean',
      description: 'Enable political neutrality checking',
    },
    dialectSupport: {
      type: 'string',
      description: 'Arabic dialect handling preference',
    },
    customRules: {
      type: 'string',
      description: 'Custom validation rules',
    },
    confidenceThreshold: {
      type: 'number',
      description: 'Minimum confidence for validation approval',
    },
  },

  outputs: {
    isValid: {
      type: 'boolean',
      description: 'Overall validation result',
    },
    confidence: {
      type: 'number',
      description: 'Confidence score (0.0-1.0)',
    },
    islamicCompliance: {
      type: 'number',
      description: 'Islamic compliance score (0.0-1.0)',
    },
    politicalNeutrality: {
      type: 'number',
      description: 'Political neutrality score (0.0-1.0)',
    },
    professionalAppropriate: {
      type: 'number',
      description: 'Professional appropriateness score (0.0-1.0)',
    },
    violations: {
      type: 'array',
      description: 'List of cultural violations found',
    },
    suggestions: {
      type: 'array',
      description: 'Suggestions for improving cultural appropriateness',
    },
    detailedReport: {
      type: 'json',
      description: 'Comprehensive validation report',
    },
    processedContent: {
      type: 'arabic-text',
      description: 'Culturally processed and corrected content',
    },
  },

  // Iraqi AI Enhancements
  iraqiEnhancements: {
    culturalValidation: {
      enabled: true,
      islamicCompliance: true,
      politicalNeutrality: true,
      professionalContext: 'general',
      dialectSupport: 'both',
    },
    professionalDomains: {
      enabled: true,
      supportedDomains: ['legal', 'medical', 'educational', 'organizational'],
    },
    arabicProcessing: {
      enabled: true,
      dialectSupport: true,
      rtlLayout: true,
      mixedContent: true,
    },
  },
}