/**
 * Enhanced Workflow Block Utilities
 * With Iraqi Cultural Intelligence Integration
 */

import type { 
  BlockOutput, 
  OutputFieldDefinition, 
  CulturalComplianceConfig,
  WorkflowContext,
  ExecutionResult
} from './types'

// ============================================================================
// OUTPUT TYPE RESOLUTION
// ============================================================================

export function resolveOutputType(
  outputs: Record<string, OutputFieldDefinition>
): Record<string, BlockOutput> {
  const resolvedOutputs: Record<string, BlockOutput> = {}

  for (const [key, outputType] of Object.entries(outputs)) {
    // Handle enhanced format with cultural validation
    if (typeof outputType === 'object' && outputType !== null && 'type' in outputType) {
      resolvedOutputs[key] = outputType.type as BlockOutput
    } else {
      // Handle legacy format
      resolvedOutputs[key] = outputType as BlockOutput
    }
  }

  return resolvedOutputs
}

// ============================================================================
// CULTURAL VALIDATION UTILITIES
// ============================================================================

export function validateCulturalCompliance(
  content: any,
  config: CulturalComplianceConfig
): { passed: boolean; score: number; issues: string[] } {
  const issues: string[] = []
  let score = 100

  // Islamic compliance validation
  if (config.islamicCompliance.enabled) {
    const islamicResult = validateIslamicCompliance(content, config.islamicCompliance.level)
    if (!islamicResult.passed) {
      issues.push(...islamicResult.issues)
      score -= islamicResult.penalty
    }
  }

  // Language support validation
  if (config.languageSupport.arabic) {
    const languageResult = validateArabicSupport(content, config.languageSupport)
    if (!languageResult.passed) {
      issues.push(...languageResult.issues)
      score -= languageResult.penalty
    }
  }

  return {
    passed: score >= 90, // Minimum 90% for cultural compliance
    score: Math.max(0, score),
    issues
  }
}

function validateIslamicCompliance(
  content: any, 
  level: 'basic' | 'standard' | 'strict'
): { passed: boolean; issues: string[]; penalty: number } {
  const issues: string[] = []
  let penalty = 0

  // Basic validation rules
  const prohibitedTerms = ['gambling', 'interest', 'alcohol', 'pork']
  const contentStr = JSON.stringify(content).toLowerCase()
  
  for (const term of prohibitedTerms) {
    if (contentStr.includes(term)) {
      issues.push(`Contains prohibited term: ${term}`)
      penalty += level === 'strict' ? 30 : level === 'standard' ? 20 : 10
    }
  }

  // Additional validation based on compliance level
  if (level === 'standard' || level === 'strict') {
    // More comprehensive validation would go here
    // This is a simplified implementation for demonstration
  }

  return {
    passed: issues.length === 0,
    issues,
    penalty
  }
}

function validateArabicSupport(
  content: any,
  languageConfig: CulturalComplianceConfig['languageSupport']
): { passed: boolean; issues: string[]; penalty: number } {
  const issues: string[] = []
  let penalty = 0

  const contentStr = JSON.stringify(content)
  const hasArabicText = /[\u0600-\u06FF]/.test(contentStr)

  if (hasArabicText) {
    if (!languageConfig.rtlLayout) {
      issues.push('Arabic text detected but RTL layout not enabled')
      penalty += 20
    }

    if (languageConfig.iraqiDialect) {
      // Validate Iraqi dialect support
      const iraqiDialectResult = validateIraqiDialect(contentStr)
      if (!iraqiDialectResult.passed) {
        issues.push(...iraqiDialectResult.issues)
        penalty += iraqiDialectResult.penalty
      }
    }
  }

  return { passed: issues.length === 0, issues, penalty }
}

function validateIraqiDialect(content: string): { 
  passed: boolean; 
  issues: string[]; 
  penalty: number 
} {
  // Simplified Iraqi dialect validation
  // In practice, this would use more sophisticated NLP
  const issues: string[] = []
  
  // Common Iraqi dialect patterns
  const iraqiPatterns = [
    /شلونك/, // "How are you" in Iraqi
    /شكو ماكو/, // "What's up" in Iraqi
    /يا زين/ // Iraqi expression
  ]
  
  const hasIraqiPatterns = iraqiPatterns.some(pattern => pattern.test(content))
  
  if (!hasIraqiPatterns && /[\u0600-\u06FF]/.test(content)) {
    // Arabic text present but no Iraqi dialect patterns detected
    // This might be acceptable, so low penalty
    return { passed: true, issues: [], penalty: 0 }
  }

  return { passed: true, issues, penalty: 0 }
}

// ============================================================================
// ARABIC TEXT PROCESSING UTILITIES
// ============================================================================

export function processArabicText(
  text: string,
  options: {
    rtlSupport: boolean
    dialectRecognition: boolean
    mixedContent: boolean
  }
): {
  processedText: string
  metadata: {
    hasArabic: boolean
    hasIraqiDialect: boolean
    isMixed: boolean
    direction: 'ltr' | 'rtl' | 'mixed'
  }
} {
  const hasArabic = /[\u0600-\u06FF]/.test(text)
  const hasEnglish = /[A-Za-z]/.test(text)
  const isMixed = hasArabic && hasEnglish

  let direction: 'ltr' | 'rtl' | 'mixed' = 'ltr'
  if (hasArabic && !hasEnglish) {
    direction = 'rtl'
  } else if (isMixed) {
    direction = 'mixed'
  }

  // Iraqi dialect detection
  const iraqiPatterns = [
    /شلونك/, /شكو ماكو/, /يا زين/, /عاش/, /زين/
  ]
  const hasIraqiDialect = iraqiPatterns.some(pattern => pattern.test(text))

  let processedText = text

  // Apply RTL processing if needed
  if (options.rtlSupport && hasArabic) {
    processedText = applyRTLFormatting(text)
  }

  // Handle mixed content
  if (options.mixedContent && isMixed) {
    processedText = processMixedContent(processedText)
  }

  return {
    processedText,
    metadata: {
      hasArabic,
      hasIraqiDialect,
      isMixed,
      direction
    }
  }
}

function applyRTLFormatting(text: string): string {
  // Add RTL formatting markers
  // This is a simplified implementation
  return `‏${text}‏` // Add RTL override markers
}

function processMixedContent(text: string): string {
  // Process mixed Arabic-English content
  // This would handle bidirectional text properly
  // Simplified implementation for now
  return text
}

// ============================================================================
// WORKFLOW EXECUTION UTILITIES
// ============================================================================

export function createWorkflowContext(
  culturalSettings: CulturalComplianceConfig,
  language: 'en' | 'ar' | 'mixed' = 'en'
): WorkflowContext {
  return {
    nodes: [],
    edges: [],
    culturalSettings,
    language,
    rtlMode: language === 'ar' || culturalSettings.languageSupport.rtlLayout
  }
}

export function executeWithCulturalValidation(
  executor: () => Promise<any>,
  context: { 
    culturalSettings: CulturalComplianceConfig
    language: 'en' | 'ar' | 'mixed'
  }
): Promise<ExecutionResult> {
  return new Promise(async (resolve) => {
    const startTime = Date.now()
    
    try {
      // Execute the main function
      const output = await executor()
      const executionTime = Date.now() - startTime
      
      // Perform cultural validation
      const culturalValidationStart = Date.now()
      const culturalValidation = validateCulturalCompliance(output, context.culturalSettings)
      const culturalValidationTime = Date.now() - culturalValidationStart
      
      // Process Arabic content if needed
      const arabicProcessingStart = Date.now()
      let arabicProcessing = undefined
      
      if (context.language === 'ar' || context.language === 'mixed') {
        const outputStr = typeof output === 'string' ? output : JSON.stringify(output)
        const arabicResult = processArabicText(outputStr, {
          rtlSupport: context.culturalSettings.languageSupport.rtlLayout,
          dialectRecognition: context.culturalSettings.languageSupport.iraqiDialect,
          mixedContent: context.culturalSettings.languageSupport.mixedContent
        })
        
        arabicProcessing = {
          rtlHandled: arabicResult.metadata.direction !== 'ltr',
          dialectRecognized: arabicResult.metadata.hasIraqiDialect,
          mixedContentProcessed: arabicResult.metadata.isMixed
        }
      }
      
      const arabicProcessingTime = Date.now() - arabicProcessingStart
      
      resolve({
        success: true,
        output,
        culturalValidation,
        arabicProcessing,
        metadata: {
          executionTime,
          culturalValidationTime,
          arabicProcessingTime
        }
      })
      
    } catch (error) {
      resolve({
        success: false,
        error: error instanceof Error ? error.message : String(error),
        culturalValidation: {
          passed: false,
          score: 0,
          issues: ['Execution failed before cultural validation']
        },
        metadata: {
          executionTime: Date.now() - startTime,
          culturalValidationTime: 0,
          arabicProcessingTime: 0
        }
      })
    }
  })
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function isRTLLanguage(language: string): boolean {
  const rtlLanguages = ['ar', 'he', 'fa', 'ur']
  return rtlLanguages.includes(language)
}

export function detectLanguage(text: string): 'en' | 'ar' | 'mixed' {
  const hasArabic = /[\u0600-\u06FF]/.test(text)
  const hasEnglish = /[A-Za-z]/.test(text)
  
  if (hasArabic && hasEnglish) return 'mixed'
  if (hasArabic) return 'ar'
  return 'en'
}

export function createDefaultCulturalConfig(): CulturalComplianceConfig {
  return {
    islamicCompliance: {
      enabled: true,
      level: 'standard',
      validators: ['content-filter', 'context-validator']
    },
    languageSupport: {
      arabic: true,
      iraqiDialect: true,
      rtlLayout: true,
      mixedContent: true
    },
    professionalDomains: {
      legal: true,
      medical: true,
      educational: true,
      organizational: true
    },
    paymentIntegration: {
      zainCash: true,
      fastPay: true,
      nassWallet: true,
      securityLevel: 'enhanced'
    }
  }
}