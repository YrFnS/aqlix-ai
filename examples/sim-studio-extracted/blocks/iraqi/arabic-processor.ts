/**
 * Arabic Text Processor Block
 * Enhanced Arabic text processing with Iraqi dialect support
 */

import { ArabicProcessorIcon } from '../../icons/cultural-icons'
import type { BlockConfig } from '../types'

export const ArabicTextProcessorBlock: BlockConfig = {
  type: 'arabic-processor',
  name: 'معالج النصوص العربية / Arabic Text Processor',
  description: 'Process Arabic text with Iraqi dialect support',
  longDescription: 'Comprehensive Arabic text processing including RTL layout, Iraqi dialect recognition, and mixed Arabic-English content handling',
  category: 'iraqi-cultural',
  bgColor: '#8B4513',
  icon: ArabicProcessorIcon,

  subBlocks: [
    {
      id: 'inputText',
      title: 'النص المدخل / Input Text',
      type: 'arabic-text-input',
      required: true,
      rows: 8,
      placeholder: 'أدخل النص العربي للمعالجة...',
      description: 'Arabic text to process with dialect and RTL support',
      rtlSupport: true,
      arabicKeyboard: true,
    },

    {
      id: 'processingMode',
      title: 'وضع المعالجة / Processing Mode',
      type: 'dropdown',
      options: [
        { label: 'تحسين النص / Text Enhancement', id: 'enhancement' },
        { label: 'تصحيح الأخطاء / Error Correction', id: 'correction' },
        { label: 'تحويل اللهجة / Dialect Conversion', id: 'dialect' },
        { label: 'تنسيق RTL / RTL Formatting', id: 'rtl' },
        { label: 'محتوى مختلط / Mixed Content', id: 'mixed' },
      ],
      value: () => 'enhancement',
      rtlSupport: true,
    },

    {
      id: 'dialectSettings',
      title: 'إعدادات اللهجة / Dialect Settings',
      type: 'dropdown',
      options: [
        { label: 'لهجة عراقية / Iraqi Dialect', id: 'iraqi' },
        { label: 'عربية فصحى / Modern Standard Arabic', id: 'msa' },
        { label: 'تحويل إلى فصحى / Convert to MSA', id: 'convert-msa' },
        { label: 'تحويل إلى عراقية / Convert to Iraqi', id: 'convert-iraqi' },
        { label: 'اكتشاف تلقائي / Auto Detect', id: 'auto' },
      ],
      value: () => 'iraqi',
      condition: {
        field: 'processingMode',
        value: ['dialect', 'enhancement', 'correction'],
      },
      rtlSupport: true,
    },

    {
      id: 'rtlConfiguration',
      title: 'إعدادات RTL / RTL Configuration',
      type: 'rtl-layout-config',
      mode: 'advanced',
      condition: {
        field: 'processingMode',
        value: ['rtl', 'mixed'],
      },
      description: 'Configure right-to-left layout and text direction',
    },

    {
      id: 'mixedContentHandling',
      title: 'معالجة المحتوى المختلط / Mixed Content Handling',
      type: 'checkbox-list',
      options: [
        { label: 'نص عربي وإنجليزي / Arabic-English Text', id: 'arabic-english' },
        { label: 'أرقام مختلطة / Mixed Numbers', id: 'mixed-numbers' },
        { label: 'تواريخ / Dates', id: 'dates' },
        { label: 'عملات / Currencies', id: 'currencies' },
        { label: 'روابط / Links', id: 'links' },
      ],
      condition: {
        field: 'processingMode',
        value: 'mixed',
      },
      rtlSupport: true,
    },

    {
      id: 'formattingOptions',
      title: 'خيارات التنسيق / Formatting Options',
      type: 'checkbox-list',
      options: [
        { label: 'إضافة علامات الترقيم / Add Punctuation', id: 'punctuation' },
        { label: 'تشكيل النص / Add Diacritics', id: 'diacritics' },
        { label: 'تصحيح المسافات / Fix Spacing', id: 'spacing' },
        { label: 'تحسين الخط / Font Optimization', id: 'font' },
        { label: 'ضبط الاتجاه / Direction Adjustment', id: 'direction' },
      ],
      mode: 'advanced',
      rtlSupport: true,
    },

    {
      id: 'qualityThreshold',
      title: 'عتبة الجودة / Quality Threshold',
      type: 'slider',
      min: 0.7,
      max: 1.0,
      step: 0.05,
      value: () => '0.9',
      mode: 'advanced',
      description: 'Minimum quality score for processed text',
    },

    {
      id: 'preserveOriginal',
      title: 'حفظ النص الأصلي / Preserve Original',
      type: 'switch',
      value: () => 'true',
      description: 'Keep original text alongside processed version',
    },
  ],

  tools: {
    access: [
      'arabic_text_processor',
      'iraqi_dialect_analyzer',
      'rtl_layout_formatter',
      'mixed_content_parser',
      'arabic_grammar_checker',
    ],
  },

  inputs: {
    inputText: {
      type: 'arabic-text',
      description: 'Arabic text input for processing',
      arabicSupport: true,
    },
    processingMode: {
      type: 'string',
      description: 'Text processing mode',
    },
    dialectSettings: {
      type: 'string',
      description: 'Arabic dialect handling configuration',
    },
    rtlConfiguration: {
      type: 'json',
      description: 'RTL layout configuration',
    },
    mixedContentHandling: {
      type: 'json',
      description: 'Mixed content processing options',
    },
    formattingOptions: {
      type: 'json',
      description: 'Text formatting preferences',
    },
    qualityThreshold: {
      type: 'number',
      description: 'Quality threshold for processing',
    },
    preserveOriginal: {
      type: 'boolean',
      description: 'Whether to preserve original text',
    },
  },

  outputs: {
    processedText: {
      type: 'arabic-text',
      description: 'Processed Arabic text with enhancements',
    },
    originalText: {
      type: 'arabic-text',
      description: 'Original input text (if preserved)',
    },
    detectedDialect: {
      type: 'string',
      description: 'Detected Arabic dialect',
    },
    qualityScore: {
      type: 'number',
      description: 'Processing quality score (0.0-1.0)',
    },
    rtlFormatting: {
      type: 'json',
      description: 'RTL layout formatting information',
    },
    processingMetrics: {
      type: 'json',
      description: 'Detailed processing metrics and statistics',
    },
    suggestions: {
      type: 'array',
      description: 'Suggestions for further text improvement',
    },
    mixedContentAnalysis: {
      type: 'json',
      description: 'Analysis of mixed Arabic-English content',
    },
  },

  // Iraqi AI Enhancements
  iraqiEnhancements: {
    arabicProcessing: {
      enabled: true,
      dialectSupport: true,
      rtlLayout: true,
      mixedContent: true,
    },
    culturalValidation: {
      enabled: true,
      islamicCompliance: false,
      politicalNeutrality: false,
      dialectSupport: 'iraqi',
    },
  },
}