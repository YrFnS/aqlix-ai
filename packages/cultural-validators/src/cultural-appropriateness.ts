/**
 * General cultural appropriateness validation for Iraqi AI Chat System
 * Combines Islamic compliance, political neutrality, and Iraqi cultural values
 */

import {
  validateIslamicCompliance,
  type IslamicComplianceResult,
} from "./islamic-compliance";
import {
  validatePoliticalNeutrality,
  type PoliticalNeutralityResult,
} from "./political-neutrality";
import {
  validateProfessionalDomain,
  type ProfessionalDomainResult,
  type ProfessionalDomain,
} from "./professional-domains";

/**
 * Cultural appropriateness validation result
 */
export interface CulturalAppropriatenessResult {
  appropriate: boolean;
  score: number; // 0.0 - 1.0
  violations: string[];
  recommendations: string[];
  islamicCompliant: boolean;
  politicallyNeutral: boolean;
  islamicViolations?: string[];
  politicalViolations?: string[];
  islamicScore: number;
  politicalScore: number;
  professionalScore?: number;
}

/**
 * Validation options
 */
export interface ValidationOptions {
  domain?: ProfessionalDomain;
  requireIslamicCompliance?: boolean;
  requirePoliticalNeutrality?: boolean;
  minScore?: number;
}

/**
 * Validates content for Iraqi cultural appropriateness
 * This is the main validation function that combines all validators
 *
 * @example
 * ```typescript
 * const result = await validateCulturalContent("السلام عليكم، نخدم جميع العراقيين");
 * console.log(result.score); // 0.95+
 * console.log(result.appropriate); // true
 * ```
 */
export async function validateCulturalContent(
  content: string,
  options: ValidationOptions = {},
): Promise<CulturalAppropriatenessResult> {
  const {
    domain,
    requireIslamicCompliance = true,
    requirePoliticalNeutrality = true,
    minScore = 0.95,
  } = options;

  const violations: string[] = [];
  const recommendations: string[] = [];

  // Run Islamic compliance validation
  const islamicResult = await validateIslamicCompliance(content);

  // Run political neutrality validation
  const politicalResult = await validatePoliticalNeutrality(content);

  // Run professional domain validation if domain specified
  let professionalResult: ProfessionalDomainResult | undefined;
  if (domain) {
    professionalResult = await validateProfessionalDomain(content, domain);
  }

  // Collect violations
  if (islamicResult.violations.length > 0) {
    violations.push(...islamicResult.violations);
  }
  if (politicalResult.violations.length > 0) {
    violations.push(...politicalResult.violations);
  }
  if (professionalResult && professionalResult.violations.length > 0) {
    violations.push(...professionalResult.violations);
  }

  // Collect recommendations
  if (islamicResult.recommendations.length > 0) {
    recommendations.push(...islamicResult.recommendations);
  }
  if (politicalResult.recommendations.length > 0) {
    recommendations.push(...politicalResult.recommendations);
  }
  if (professionalResult && professionalResult.recommendations.length > 0) {
    recommendations.push(...professionalResult.recommendations);
  }

  // Calculate overall score
  let totalScore = 0;
  let weights = 0;

  // Islamic compliance (40% weight)
  totalScore += islamicResult.score * 0.4;
  weights += 0.4;

  // Political neutrality (40% weight)
  totalScore += politicalResult.score * 0.4;
  weights += 0.4;

  // Professional domain (20% weight if applicable)
  if (professionalResult) {
    totalScore += professionalResult.score * 0.2;
    weights += 0.2;
  }

  const score = totalScore / weights;

  // Determine appropriateness
  const islamicCompliant = !requireIslamicCompliance || islamicResult.compliant;
  const politicallyNeutral =
    !requirePoliticalNeutrality || politicalResult.neutral;

  const appropriate =
    islamicCompliant && politicallyNeutral && score >= minScore;

  return {
    appropriate,
    score,
    violations,
    recommendations,
    islamicCompliant: islamicResult.compliant,
    politicallyNeutral: politicalResult.neutral,
    islamicViolations: islamicResult.violations,
    politicalViolations: politicalResult.violations,
    islamicScore: islamicResult.score,
    politicalScore: politicalResult.score,
    professionalScore: professionalResult?.score,
  };
}

/**
 * Quick check if content is culturally appropriate (simplified)
 */
export async function isCulturallyAppropriate(
  content: string,
  threshold: number = 0.95,
): Promise<boolean> {
  const result = await validateCulturalContent(content);
  return result.score >= threshold && result.appropriate;
}

/**
 * Batch validation for multiple content items
 */
export async function validateBatchContent(
  contentItems: string[],
  options: ValidationOptions = {},
): Promise<CulturalAppropriatenessResult[]> {
  return Promise.all(
    contentItems.map((content) => validateCulturalContent(content, options)),
  );
}

/**
 * Validates cultural appropriateness (alias for validateCulturalContent)
 */
export async function validateCulturalAppropriateness(
  content: string,
  options: ValidationOptions = {},
): Promise<CulturalAppropriatenessResult> {
  return validateCulturalContent(content, options);
}

/**
 * Checks alignment with Iraqi customs
 */
export function checkIraqiCustoms(content: string): {
  aligned: boolean;
  customs: string[];
  issues: string[];
} {
  const customs: string[] = [];
  const issues: string[] = [];

  // Check for hospitality references
  const hospitalityTerms = [/ضيافة/, /كرم/, /hospitality/i, /generosity/i];
  if (hospitalityTerms.some((term) => term.test(content))) {
    customs.push("hospitality");
  }

  // Check for respect for elders
  const respectTerms = [/احترام الكبار/, /respect.*elders/i, /elderly/i];
  if (respectTerms.some((term) => term.test(content))) {
    customs.push("respect_for_elders");
  }

  // Check for family values
  const familyTerms = [/قيم الأسرة/, /family values/i, /family/i];
  if (familyTerms.some((term) => term.test(content))) {
    customs.push("family_values");
  }

  return {
    aligned: customs.length > 0 && issues.length === 0,
    customs,
    issues,
  };
}

/**
 * Validates social etiquette
 */
export function validateSocialEtiquette(content: string): {
  isAppropriate: boolean;
  violations: string[];
} {
  const violations: string[] = [];

  // Check for inappropriate directness
  const tooDirectPatterns = [/shut up/i, /اسكت/, /stupid/i];
  if (tooDirectPatterns.some((pattern) => pattern.test(content))) {
    violations.push("Content uses inappropriate directness");
  }

  return {
    isAppropriate: violations.length === 0,
    violations,
  };
}

/**
 * Checks gender sensitivity
 */
export function checkGenderSensitivity(content: string): {
  isSensitive: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Check for gender-biased language
  const biasedPatterns = [
    /only men/i,
    /only women/i,
    /الرجال فقط/,
    /النساء فقط/,
  ];
  if (biasedPatterns.some((pattern) => pattern.test(content))) {
    issues.push("Content contains gender-biased language");
  }

  return {
    isSensitive: issues.length === 0,
    issues,
  };
}
