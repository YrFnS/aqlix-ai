/**
 * @iraqi-ai/cultural-validators
 * Cultural validation utilities for Iraqi AI Chat System
 * Provides Islamic compliance, political neutrality, and professional domain validation
 */

// Main export: Combined cultural appropriateness validation
export {
  validateCulturalContent,
  isCulturallyAppropriate,
  validateBatchContent,
  type CulturalAppropriatenessResult,
  type ValidationOptions,
} from "./cultural-appropriateness";

// Islamic compliance validation
export {
  validateIslamicCompliance,
  hasIslamicGreeting,
  hasProhibitedReferences,
  type IslamicComplianceResult,
} from "./islamic-compliance";

// Political neutrality validation
export {
  validatePoliticalNeutrality,
  hasSectarianReferences,
  hasPoliticalReferences,
  hasTribalReferences,
  type PoliticalNeutralityResult,
} from "./political-neutrality";

// Professional domain validation
export {
  validateProfessionalDomain,
  detectProfessionalDomain,
  type ProfessionalDomain,
  type ProfessionalDomainResult,
} from "./professional-domains";
