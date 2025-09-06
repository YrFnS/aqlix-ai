/**
 * Iraqi AI Enhanced Starter Block
 * Cultural intelligence integrated workflow starter
 */

import { StartIcon } from '../../icons/workflow-icons'
import type { BlockConfig } from '../types'

export const StarterBlock: BlockConfig = {
  type: 'starter',
  name: 'مُبدِئ العمليات / Workflow Starter',
  description: 'Start workflow with cultural context',
  longDescription: 'Initiate your workflow with Iraqi cultural intelligence and professional domain support.',
  category: 'blocks',
  bgColor: '#2FB3FF',
  icon: StartIcon,
  subBlocks: [
    // Main trigger selector with Arabic support
    {
      id: 'startWorkflow',
      title: 'نوع البدء / Start Type',
      type: 'dropdown',
      layout: 'full',
      options: [
        { label: 'تشغيل يدوي / Manual Run', id: 'manual' },
        { label: 'دردشة / Chat', id: 'chat' },
        { label: 'مجال مهني / Professional Domain', id: 'professional' },
        { label: 'تكامل الدفع / Payment Integration', id: 'payment' },
      ],
      value: () => 'manual',
      rtlSupport: true,
    },
    
    // Professional Domain Selection
    {
      id: 'professionalDomain',
      title: 'المجال المهني / Professional Domain',
      type: 'professional-domain-selector',
      layout: 'full',
      condition: { field: 'startWorkflow', value: 'professional' },
      options: [
        { label: 'قانوني / Legal', id: 'legal' },
        { label: 'طبي / Medical', id: 'medical' },
        { label: 'تعليمي / Educational', id: 'educational' },
        { label: 'تنظيمي / Organizational', id: 'organizational' },
      ],
      description: 'Select the professional context for cultural validation',
      rtlSupport: true,
    },

    // Cultural Validation Settings
    {
      id: 'culturalValidation',
      title: 'التحقق الثقافي / Cultural Validation',
      type: 'cultural-validation',
      layout: 'full',
      mode: 'advanced',
      description: 'Configure Islamic compliance and cultural appropriateness',
      culturalValidation: {
        enabled: true,
        islamicCompliance: true,
        politicalNeutrality: true,
        dialectSupport: 'iraqi',
      },
    },

    // Arabic Language Configuration
    {
      id: 'arabicConfig',
      title: 'إعدادات اللغة العربية / Arabic Configuration',
      type: 'rtl-layout-config',
      layout: 'full',
      mode: 'advanced',
      description: 'Configure Arabic text processing and RTL layout',
      rtlSupport: true,
      arabicKeyboard: true,
    },

    // Structured Input format with Arabic support
    {
      id: 'inputFormat',
      title: 'تنسيق المدخلات / Input Format',
      type: 'input-format',
      layout: 'full',
      description: 'Define input schema with Arabic and cultural context support',
      mode: 'advanced',
      condition: { 
        field: 'startWorkflow', 
        value: ['manual', 'professional'] 
      },
      rtlSupport: true,
    },

    // Payment Gateway Selection (for payment workflows)
    {
      id: 'paymentGateway',
      title: 'بوابة الدفع / Payment Gateway',
      type: 'payment-gateway-selector',
      layout: 'full',
      condition: { field: 'startWorkflow', value: 'payment' },
      options: [
        { label: 'زين كاش / ZainCash', id: 'zaincash' },
        { label: 'فاست باي / FastPay', id: 'fastpay' },
        { label: 'ناس والت / NassWallet', id: 'nasswallet' },
      ],
      description: 'Select Iraqi payment gateway for transaction processing',
      rtlSupport: true,
    },
  ],
  
  tools: {
    access: ['cultural_validator', 'arabic_processor', 'professional_domain_validator'],
  },
  
  inputs: {
    input: { 
      type: 'json', 
      description: 'Workflow input data with cultural context',
      culturalValidation: true,
      arabicSupport: true,
    },
    professionalDomain: {
      type: 'string',
      description: 'Professional domain context',
    },
    culturalSettings: {
      type: 'json',
      description: 'Cultural validation and compliance settings',
    },
    arabicConfiguration: {
      type: 'json',
      description: 'Arabic language processing configuration',
    },
  },
  
  outputs: {
    culturalValidation: {
      type: 'json',
      description: 'Cultural validation results and compliance metrics',
    },
    professionalContext: {
      type: 'string',
      description: 'Validated professional domain context',
    },
    arabicProcessingConfig: {
      type: 'json',
      description: 'Arabic text processing configuration',
    },
  },

  // Iraqi AI Enhancements
  iraqiEnhancements: {
    culturalValidation: {
      enabled: true,
      islamicCompliance: true,
      politicalNeutrality: true,
      professionalContext: 'organizational',
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
    paymentGateways: {
      enabled: true,
      supportedGateways: ['zaincash', 'fastpay', 'nasswallet'],
      testMode: true,
    },
  },
}