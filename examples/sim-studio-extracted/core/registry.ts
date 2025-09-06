/**
 * Enhanced Blocks Registry with Iraqi Cultural Intelligence
 * Extracted from Sim Studio AI and enhanced for the Iraqi AI Chat System
 */

import type { BlockConfig } from './types'

// ============================================================================
// CORE WORKFLOW BLOCKS (Extracted from Sim Studio)
// ============================================================================

// Import original blocks (these would be the extracted block implementations)
// For now, we'll define the registry structure and key Iraqi-enhanced blocks

// ============================================================================
// IRAQI-ENHANCED BLOCKS
// ============================================================================

// Cultural Validation Block
const CulturalValidatorBlock: BlockConfig = {
  type: 'cultural_validator',
  name: 'Cultural Validator',
  nameArabic: 'مدقق الامتثال الثقافي',
  description: 'Validates content for Iraqi cultural appropriateness and Islamic compliance',
  descriptionArabic: 'يقوم بالتحقق من مناسبة المحتوى للثقافة العراقية والامتثال الإسلامي',
  category: 'cultural-validators',
  bgColor: '#10B981', // Green for validation
  icon: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  subBlocks: [
    {
      id: 'content',
      title: 'Content to Validate',
      titleArabic: 'المحتوى المراد التحقق منه',
      type: 'long-input',
      required: true,
      placeholder: 'Enter content for cultural validation',
      placeholderArabic: 'أدخل المحتوى للتحقق الثقافي',
      arabicRtlSupport: true
    },
    {
      id: 'compliance_level',
      title: 'Compliance Level',
      titleArabic: 'مستوى الامتثال',
      type: 'dropdown',
      required: true,
      options: [
        { id: 'basic', label: 'Basic (90%)', labelArabic: 'أساسي (90%)' },
        { id: 'standard', label: 'Standard (95%)', labelArabic: 'معياري (95%)' },
        { id: 'strict', label: 'Strict (99%)', labelArabic: 'صارم (99%)' }
      ]
    },
    {
      id: 'professional_domain',
      title: 'Professional Domain',
      titleArabic: 'المجال المهني',
      type: 'dropdown',
      options: [
        { id: 'general', label: 'General', labelArabic: 'عام' },
        { id: 'legal', label: 'Legal', labelArabic: 'قانوني' },
        { id: 'medical', label: 'Medical', labelArabic: 'طبي' },
        { id: 'educational', label: 'Educational', labelArabic: 'تعليمي' },
        { id: 'organizational', label: 'Organizational', labelArabic: 'مؤسسي' }
      ]
    }
  ],
  tools: {
    access: ['iraqi-cultural-validator']
  },
  inputs: {
    content: { type: 'string', description: 'Content to validate', culturalValidation: true },
    compliance_level: { type: 'string', description: 'Required compliance level' },
    professional_domain: { type: 'string', description: 'Professional domain context' }
  },
  outputs: {
    validation_result: {
      type: 'json',
      description: 'Cultural validation results with score and recommendations',
      descriptionArabic: 'نتائج التحقق الثقافي مع النتيجة والتوصيات'
    },
    passed: { type: 'boolean', description: 'Whether validation passed' },
    score: { type: 'number', description: 'Compliance score (0-100)' },
    issues: { type: 'array', description: 'List of identified cultural issues' }
  },
  culturalCompliance: {
    islamicCompliance: { enabled: true, level: 'standard', validators: [] },
    languageSupport: { arabic: true, iraqiDialect: true, rtlLayout: true, mixedContent: true },
    professionalDomains: { legal: true, medical: true, educational: true, organizational: true },
    paymentIntegration: { zainCash: false, fastPay: false, nassWallet: false, securityLevel: 'standard' }
  },
  islamicCompliant: true,
  arabicSupport: true
}

// Arabic RTL Processor Block
const ArabicProcessorBlock: BlockConfig = {
  type: 'arabic_processor',
  name: 'Arabic RTL Processor',
  nameArabic: 'معالج النصوص العربية',
  description: 'Processes Arabic text with RTL support and Iraqi dialect recognition',
  descriptionArabic: 'يعالج النصوص العربية مع دعم الكتابة من اليمين لليسار والتعرف على اللهجة العراقية',
  category: 'iraqi-tools',
  bgColor: '#3B82F6', // Blue for text processing
  icon: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
    </svg>
  ),
  subBlocks: [
    {
      id: 'arabic_text',
      title: 'Arabic Text',
      titleArabic: 'النص العربي',
      type: 'arabic-text-input',
      required: true,
      placeholder: 'Enter Arabic text',
      placeholderArabic: 'أدخل النص العربي',
      arabicRtlSupport: true
    },
    {
      id: 'processing_options',
      title: 'Processing Options',
      titleArabic: 'خيارات المعالجة',
      type: 'checkbox-list',
      options: [
        { id: 'rtl_support', label: 'RTL Layout Support', labelArabic: 'دعم الكتابة من اليمين لليسار' },
        { id: 'dialect_recognition', label: 'Iraqi Dialect Recognition', labelArabic: 'التعرف على اللهجة العراقية' },
        { id: 'mixed_content', label: 'Mixed Arabic-English Support', labelArabic: 'دعم المحتوى المختلط عربي-إنجليزي' }
      ]
    }
  ],
  tools: {
    access: ['arabic-rtl-processor']
  },
  inputs: {
    arabic_text: { type: 'string', description: 'Arabic text to process', arabicSupport: true },
    processing_options: { type: 'json', description: 'Processing configuration options' }
  },
  outputs: {
    processed_text: {
      type: 'string',
      description: 'Processed Arabic text with RTL formatting',
      descriptionArabic: 'النص العربي المعالج مع تنسيق الكتابة من اليمين لليسار'
    },
    metadata: {
      type: 'json',
      description: 'Processing metadata including dialect detection and direction analysis'
    }
  },
  culturalCompliance: {
    islamicCompliance: { enabled: true, level: 'basic', validators: [] },
    languageSupport: { arabic: true, iraqiDialect: true, rtlLayout: true, mixedContent: true },
    professionalDomains: { legal: false, medical: false, educational: false, organizational: false },
    paymentIntegration: { zainCash: false, fastPay: false, nassWallet: false, securityLevel: 'standard' }
  },
  islamicCompliant: true,
  arabicSupport: true
}

// Iraqi Payment Gateway Block
const IraqiPaymentBlock: BlockConfig = {
  type: 'iraqi_payment',
  name: 'Iraqi Payment Gateway',
  nameArabic: 'بوابة الدفع العراقية',
  description: 'Integrates with Iraqi payment gateways (ZainCash, FastPay, NassWallet)',
  descriptionArabic: 'يتكامل مع بوابات الدفع العراقية (زين كاش، فاست باي، ناس والت)',
  category: 'iraqi-tools',
  bgColor: '#10B981', // Green for payments
  icon: ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  subBlocks: [
    {
      id: 'gateway',
      title: 'Payment Gateway',
      titleArabic: 'بوابة الدفع',
      type: 'payment-gateway-selector',
      required: true,
      options: [
        { id: 'zaincash', label: 'ZainCash (1000 IQD)', labelArabic: 'زين كاش (1000 دينار)' },
        { id: 'fastpay', label: 'FastPay (500 IQD)', labelArabic: 'فاست باي (500 دينار)' },
        { id: 'nasswallet', label: 'NassWallet (1000 IQD)', labelArabic: 'ناس والت (1000 دينار)' }
      ]
    },
    {
      id: 'amount',
      title: 'Amount (IQD)',
      titleArabic: 'المبلغ (دينار عراقي)',
      type: 'short-input',
      required: true,
      placeholder: 'Enter amount in Iraqi Dinars',
      placeholderArabic: 'أدخل المبلغ بالدينار العراقي'
    },
    {
      id: 'security_level',
      title: 'Security Level',
      titleArabic: 'مستوى الأمان',
      type: 'dropdown',
      required: true,
      options: [
        { id: 'standard', label: 'Standard Security', labelArabic: 'أمان معياري' },
        { id: 'enhanced', label: 'Enhanced Security', labelArabic: 'أمان معزز' }
      ]
    }
  ],
  tools: {
    access: ['payment-security-guardian', 'iraqi-payment-tester']
  },
  inputs: {
    gateway: { type: 'string', description: 'Selected payment gateway' },
    amount: { type: 'number', description: 'Payment amount in Iraqi Dinars' },
    security_level: { type: 'string', description: 'Security level for transaction' }
  },
  outputs: {
    transaction_result: {
      type: 'json',
      description: 'Payment transaction result with security validation',
      descriptionArabic: 'نتيجة معاملة الدفع مع التحقق الأمني'
    },
    transaction_id: { type: 'string', description: 'Unique transaction identifier' },
    status: { type: 'string', description: 'Transaction status (success/failed/pending)' },
    security_score: { type: 'number', description: 'Security compliance score' }
  },
  culturalCompliance: {
    islamicCompliance: { enabled: true, level: 'standard', validators: ['financial-compliance'] },
    languageSupport: { arabic: true, iraqiDialect: false, rtlLayout: true, mixedContent: false },
    professionalDomains: { legal: true, medical: false, educational: false, organizational: true },
    paymentIntegration: { zainCash: true, fastPay: true, nassWallet: true, securityLevel: 'enhanced' }
  },
  islamicCompliant: true,
  arabicSupport: true
}

// ============================================================================
// ENHANCED REGISTRY
// ============================================================================

export const registry: Record<string, BlockConfig> = {
  // Iraqi Cultural Intelligence Blocks
  cultural_validator: CulturalValidatorBlock,
  arabic_processor: ArabicProcessorBlock,
  iraqi_payment: IraqiPaymentBlock,
  
  // Original Sim Studio blocks would be imported here
  // These are placeholders for the actual extracted blocks
  // In the full implementation, all blocks from the original registry would be here
  
  // Core workflow blocks (examples - full extraction would include all)
  starter: {
    type: 'starter',
    name: 'Starter',
    nameArabic: 'البداية',
    description: 'Starting point for workflows',
    descriptionArabic: 'نقطة البداية لسير العمل',
    category: 'blocks',
    bgColor: '#6366F1',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z"/>
      </svg>
    ),
    subBlocks: [],
    tools: { access: [] },
    inputs: {},
    outputs: { output: 'any' },
    culturalCompliance: {
      islamicCompliance: { enabled: false, level: 'basic', validators: [] },
      languageSupport: { arabic: true, iraqiDialect: false, rtlLayout: false, mixedContent: false },
      professionalDomains: { legal: false, medical: false, educational: false, organizational: false },
      paymentIntegration: { zainCash: false, fastPay: false, nassWallet: false, securityLevel: 'standard' }
    }
  },
  
  response: {
    type: 'response',
    name: 'Response',
    nameArabic: 'الاستجابة',
    description: 'Final response output',
    descriptionArabic: 'إخراج الاستجابة النهائية',
    category: 'blocks',
    bgColor: '#10B981',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M9 5l7 7-7 7" />
      </svg>
    ),
    subBlocks: [
      {
        id: 'message',
        title: 'Response Message',
        titleArabic: 'رسالة الاستجابة',
        type: 'long-input',
        required: true,
        arabicRtlSupport: true
      }
    ],
    tools: { access: [] },
    inputs: {
      message: { type: 'string', description: 'Response message', arabicSupport: true }
    },
    outputs: { response: 'string' },
    arabicSupport: true
  }
}

// ============================================================================
// REGISTRY UTILITIES
// ============================================================================

export const getBlock = (type: string): BlockConfig | undefined => registry[type]

export const getBlocksByCategory = (category: string): BlockConfig[] =>
  Object.values(registry).filter((block) => block.category === category)

export const getIraqiBlocks = (): BlockConfig[] =>
  Object.values(registry).filter((block) => 
    block.category === 'iraqi-tools' || 
    block.category === 'cultural-validators' ||
    block.arabicSupport ||
    block.islamicCompliant
  )

export const getCulturallyCompliantBlocks = (): BlockConfig[] =>
  Object.values(registry).filter((block) => block.islamicCompliant)

export const getArabicSupportedBlocks = (): BlockConfig[] =>
  Object.values(registry).filter((block) => block.arabicSupport)

export const getAllBlockTypes = (): string[] => Object.keys(registry)

export const isValidBlockType = (type: string): boolean => type in registry

export const getAllBlocks = (): BlockConfig[] => Object.values(registry)

export const searchBlocks = (
  query: string, 
  options?: {
    category?: string
    arabicSupport?: boolean
    islamicCompliant?: boolean
    language?: 'en' | 'ar'
  }
): BlockConfig[] => {
  const lowerQuery = query.toLowerCase()
  
  return Object.values(registry).filter((block) => {
    // Text search
    const searchableText = options?.language === 'ar' 
      ? `${block.nameArabic || ''} ${block.descriptionArabic || ''}`.toLowerCase()
      : `${block.name} ${block.description}`.toLowerCase()
    
    const matchesQuery = searchableText.includes(lowerQuery)
    
    // Filter by options
    const matchesCategory = !options?.category || block.category === options.category
    const matchesArabic = !options?.arabicSupport || block.arabicSupport
    const matchesIslamic = !options?.islamicCompliant || block.islamicCompliant
    
    return matchesQuery && matchesCategory && matchesArabic && matchesIslamic
  })
}

// ============================================================================
// CULTURAL BLOCK UTILITIES
// ============================================================================

export const getBlocksForProfessionalDomain = (domain: string): BlockConfig[] =>
  Object.values(registry).filter((block) => 
    block.professionalDomain === domain ||
    block.culturalCompliance?.professionalDomains?.[domain as keyof typeof block.culturalCompliance.professionalDomains]
  )

export const getPaymentIntegratedBlocks = (): BlockConfig[] =>
  Object.values(registry).filter((block) => 
    block.culturalCompliance?.paymentIntegration?.zainCash ||
    block.culturalCompliance?.paymentIntegration?.fastPay ||
    block.culturalCompliance?.paymentIntegration?.nassWallet
  )

export const validateBlockCulturalCompliance = (
  blockType: string,
  requiredLevel: 'basic' | 'standard' | 'strict' = 'standard'
): boolean => {
  const block = getBlock(blockType)
  if (!block) return false
  
  const compliance = block.culturalCompliance
  if (!compliance) return false
  
  // Check Islamic compliance level
  if (compliance.islamicCompliance.enabled) {
    const levels = { basic: 1, standard: 2, strict: 3 }
    const blockLevel = levels[compliance.islamicCompliance.level]
    const requiredLevelNum = levels[requiredLevel]
    
    return blockLevel >= requiredLevelNum
  }
  
  return true
}