/**
 * Iraqi AI Enhanced Block Registry
 * Enhanced visual workflow builder with Iraqi cultural intelligence
 */

import type { BlockConfig } from './types'

// Core workflow blocks (extracted from Sim Studio)
import { StarterBlock } from './core/starter'
import { WorkflowBlock } from './core/workflow'
import { ConditionBlock } from './core/condition'
import { ResponseBlock } from './core/response'

// Iraqi AI enhanced blocks
import { ArabicTextProcessorBlock } from './iraqi/arabic-processor'
import { CulturalValidatorBlock } from './iraqi/cultural-validator'
import { PaymentGatewayBlock } from './iraqi/payment-gateway'
import { ProfessionalDomainBlock } from './iraqi/professional-domain'
import { IslamicComplianceBlock } from './iraqi/islamic-compliance'

// Professional domain specific blocks
import { LegalDocumentBlock } from './professional/legal-document'
import { MedicalRecordBlock } from './professional/medical-record'
import { EducationalContentBlock } from './professional/educational-content'
import { OrganizationalWorkflowBlock } from './professional/organizational-workflow'

// Integration blocks (selected from Sim Studio)
import { ApiBlock } from './integrations/api'
import { SlackBlock } from './integrations/slack'
import { EmailBlock } from './integrations/email'
import { DatabaseBlock } from './integrations/database'

// Registry of all available blocks
export const iraqiBlockRegistry: Record<string, BlockConfig> = {
  // Core workflow blocks
  starter: StarterBlock,
  workflow: WorkflowBlock,
  condition: ConditionBlock,
  response: ResponseBlock,

  // Iraqi AI enhanced blocks
  'arabic-processor': ArabicTextProcessorBlock,
  'cultural-validator': CulturalValidatorBlock,
  'payment-gateway': PaymentGatewayBlock,
  'professional-domain': ProfessionalDomainBlock,
  'islamic-compliance': IslamicComplianceBlock,

  // Professional domain blocks
  'legal-document': LegalDocumentBlock,
  'medical-record': MedicalRecordBlock,
  'educational-content': EducationalContentBlock,
  'organizational-workflow': OrganizationalWorkflowBlock,

  // Integration blocks
  api: ApiBlock,
  slack: SlackBlock,
  email: EmailBlock,
  database: DatabaseBlock,
}

// Helper functions for block management
export const getBlock = (type: string): BlockConfig | undefined => {
  return iraqiBlockRegistry[type]
}

export const getBlocksByCategory = (
  category: 'blocks' | 'tools' | 'triggers' | 'iraqi-cultural' | 'professional-domains'
): BlockConfig[] => {
  return Object.values(iraqiBlockRegistry).filter((block) => block.category === category)
}

export const getIraqiEnhancedBlocks = (): BlockConfig[] => {
  return Object.values(iraqiBlockRegistry).filter(
    (block) => block.category === 'iraqi-cultural' || block.iraqiEnhancements
  )
}

export const getProfessionalDomainBlocks = (): BlockConfig[] => {
  return Object.values(iraqiBlockRegistry).filter((block) => block.category === 'professional-domains')
}

export const getAllBlockTypes = (): string[] => Object.keys(iraqiBlockRegistry)

export const isValidBlockType = (type: string): type is string => type in iraqiBlockRegistry

export const getAllBlocks = (): BlockConfig[] => Object.values(iraqiBlockRegistry)

// Cultural validation functions
export const getCulturallyAppropriateBlocnxks = (
  professionalContext?: 'legal' | 'medical' | 'educational' | 'organizational'
): BlockConfig[] => {
  return Object.values(iraqiBlockRegistry).filter((block) => {
    if (!block.iraqiEnhancements?.culturalValidation.enabled) return true
    
    if (professionalContext && block.iraqiEnhancements?.professionalDomains) {
      return block.iraqiEnhancements.professionalDomains.supportedDomains.includes(professionalContext)
    }
    
    return true
  })
}

export const getBlocksWithArabicSupport = (): BlockConfig[] => {
  return Object.values(iraqiBlockRegistry).filter(
    (block) => block.iraqiEnhancements?.arabicProcessing?.enabled
  )
}

export const getBlocksWithPaymentSupport = (): BlockConfig[] => {
  return Object.values(iraqiBlockRegistry).filter(
    (block) => block.iraqiEnhancements?.paymentGateways?.enabled
  )
}