/**
 * Iraqi AI Cultural Validation Engine
 * Based on Phase 3 protocol extraction: Islamic compliance and cultural appropriateness
 * Performance Target: <200ms validation time
 */

import {
  IraqiCulturalContext,
  CulturalValidationResult,
  CulturalEnhancementConfig,
} from "@aqlix-ai/types";

export interface CulturalValidator {
  validate(
    input: string,
    context: IraqiCulturalContext,
  ): Promise<CulturalValidationResult>;
  getValidationRules(): string[];
}

export class IraqiCulturalValidator implements CulturalValidator {
  private config: CulturalEnhancementConfig;
  private validationCache: Map<string, CulturalValidationResult> = new Map();

  constructor(config: CulturalEnhancementConfig) {
    this.config = config;
  }

  async validate(
    input: string,
    context: IraqiCulturalContext,
  ): Promise<CulturalValidationResult> {
    const startTime = performance.now();

    try {
      // Check cache first if enabled
      if (this.config.culturalValidation.cacheEnabled) {
        const cacheKey = this.generateCacheKey(input, context);
        const cached = this.validationCache.get(cacheKey);
        if (cached) {
          return cached;
        }
      }

      const issues: string[] = [];
      const recommendations: string[] = [];
      let score = 100; // Start with perfect score

      // Cultural appropriateness checks
      score = await this.validateCulturalContent(
        input,
        context,
        issues,
        recommendations,
        score,
      );
      score = await this.validateLanguageUse(
        input,
        context,
        issues,
        recommendations,
        score,
      );
      score = await this.validateSocialNorms(
        input,
        context,
        issues,
        recommendations,
        score,
      );
      score = await this.validateFamilyValues(
        input,
        context,
        issues,
        recommendations,
        score,
      );
      score = await this.validateRespectfulness(
        input,
        context,
        issues,
        recommendations,
        score,
      );

      const processingTime = performance.now() - startTime;
      const passed = score >= this.config.culturalValidation.minimumScore;

      const result: CulturalValidationResult = {
        score,
        passed,
        issues,
        recommendations,
        processingTime,
        validation_timestamp: new Date().toISOString(),
      };

      // Cache the result if enabled
      if (this.config.culturalValidation.cacheEnabled) {
        const cacheKey = this.generateCacheKey(input, context);
        this.validationCache.set(cacheKey, result);

        // Clear cache after TTL
        setTimeout(() => {
          this.validationCache.delete(cacheKey);
        }, this.config.culturalValidation.cacheTtl * 1000);
      }

      return result;
    } catch (error) {
      const processingTime = performance.now() - startTime;
      return {
        score: 0,
        passed: false,
        issues: [
          `Validation error: ${error instanceof Error ? error.message : "Unknown error"}`,
        ],
        recommendations: ["Please review input and try again"],
        processingTime,
        validation_timestamp: new Date().toISOString(),
      };
    }
  }

  private async validateCulturalContent(
    input: string,
    context: IraqiCulturalContext,
    issues: string[],
    recommendations: string[],
    currentScore: number,
  ): Promise<number> {
    let score = currentScore;

    // Check for culturally inappropriate content
    const inappropriatePatterns = [
      /alcohol/gi,
      /gambling/gi,
      /\b(pork|bacon|ham)\b/gi,
      /\b(dating|boyfriend|girlfriend)\b/gi, // Traditional family values
    ];

    for (const pattern of inappropriatePatterns) {
      if (pattern.test(input)) {
        score -= 20;
        issues.push(
          `Content contains culturally inappropriate references: ${pattern.source}`,
        );
        recommendations.push(
          "Consider using culturally appropriate alternatives",
        );
      }
    }

    // Check for positive cultural elements
    const positivePatterns = [
      /\b(family|أسرة|عائلة)\b/gi,
      /\b(respect|احترام)\b/gi,
      /\b(tradition|تقليد|تراث)\b/gi,
      /\b(community|مجتمع)\b/gi,
    ];

    let positiveCount = 0;
    for (const pattern of positivePatterns) {
      if (pattern.test(input)) {
        positiveCount++;
      }
    }

    // Bonus for cultural sensitivity
    if (positiveCount > 0) {
      score += Math.min(positiveCount * 5, 15);
    }

    return Math.max(0, Math.min(100, score));
  }

  private async validateLanguageUse(
    input: string,
    context: IraqiCulturalContext,
    issues: string[],
    recommendations: string[],
    currentScore: number,
  ): Promise<number> {
    let score = currentScore;

    // Check for inappropriate language
    const inappropriateLanguage = [
      /\b(damn|hell|shit|fuck)\b/gi,
      /\b(stupid|idiot|moron)\b/gi,
    ];

    for (const pattern of inappropriateLanguage) {
      if (pattern.test(input)) {
        score -= 15;
        issues.push("Content contains inappropriate language");
        recommendations.push("Use respectful and professional language");
      }
    }

    // Check for Arabic language support if required
    if (context.arabicSupport) {
      const hasArabicText = /[\u0600-\u06FF]/.test(input);
      if (!hasArabicText && input.length > 50) {
        score -= 10;
        issues.push(
          "Arabic language support requested but no Arabic content detected",
        );
        recommendations.push("Consider adding Arabic translations or content");
      }
    }

    return Math.max(0, Math.min(100, score));
  }

  private async validateSocialNorms(
    input: string,
    context: IraqiCulturalContext,
    issues: string[],
    recommendations: string[],
    currentScore: number,
  ): Promise<number> {
    let score = currentScore;

    // Check for violations of social norms
    const socialNormViolations = [
      /\b(individual|personal freedom)\b/gi, // Emphasis on collective over individual
    ];

    for (const pattern of socialNormViolations) {
      if (pattern.test(input)) {
        score -= 10;
        recommendations.push(
          "Consider emphasizing community and collective values",
        );
      }
    }

    // Check for positive social elements
    const positiveSocialElements = [
      /\b(cooperation|تعاون)\b/gi,
      /\b(solidarity|تضامن)\b/gi,
      /\b(hospitality|ضيافة)\b/gi,
    ];

    for (const pattern of positiveSocialElements) {
      if (pattern.test(input)) {
        score += 5;
      }
    }

    return Math.max(0, Math.min(100, score));
  }

  private async validateFamilyValues(
    input: string,
    context: IraqiCulturalContext,
    issues: string[],
    recommendations: string[],
    currentScore: number,
  ): Promise<number> {
    let score = currentScore;

    // Check for family-positive content
    const familyPositivePatterns = [
      /\b(parents|والدين)\b/gi,
      /\b(children|أطفال|أولاد)\b/gi,
      /\b(marriage|زواج)\b/gi,
      /\b(elder|كبار السن)\b/gi,
    ];

    let familyPositiveCount = 0;
    for (const pattern of familyPositivePatterns) {
      if (pattern.test(input)) {
        familyPositiveCount++;
      }
    }

    if (familyPositiveCount > 0) {
      score += Math.min(familyPositiveCount * 3, 10);
    }

    return Math.max(0, Math.min(100, score));
  }

  private async validateRespectfulness(
    input: string,
    context: IraqiCulturalContext,
    issues: string[],
    recommendations: string[],
    currentScore: number,
  ): Promise<number> {
    let score = currentScore;

    // Check for respectful forms of address
    const respectfulPatterns = [
      /\b(sir|madam|استاذ|دكتور)\b/gi,
      /\b(please|من فضلك)\b/gi,
      /\b(thank you|شكرا)\b/gi,
    ];

    let respectCount = 0;
    for (const pattern of respectfulPatterns) {
      if (pattern.test(input)) {
        respectCount++;
      }
    }

    if (respectCount > 0) {
      score += Math.min(respectCount * 2, 8);
    }

    // Check for disrespectful content
    const disrespectfulPatterns = [
      /\b(shut up|اصمت)\b/gi,
      /\b(whatever|مالي خلق)\b/gi,
    ];

    for (const pattern of disrespectfulPatterns) {
      if (pattern.test(input)) {
        score -= 15;
        issues.push("Content contains disrespectful language");
        recommendations.push("Use more respectful and courteous language");
      }
    }

    return Math.max(0, Math.min(100, score));
  }

  private generateCacheKey(
    input: string,
    context: IraqiCulturalContext,
  ): string {
    const contextString = JSON.stringify({
      culturalValidation: context.culturalValidation,
      dialectSupport: context.dialectSupport,
      professionalDomain: context.professionalDomain,
    });
    return `cultural_${Buffer.from(input + contextString)
      .toString("base64")
      .slice(0, 32)}`;
  }

  getValidationRules(): string[] {
    return [
      "Content must respect Iraqi cultural values and traditions",
      "Language must be appropriate and respectful",
      "Content should emphasize family and community values",
      "Avoid culturally inappropriate references (alcohol, gambling, etc.)",
      "Use respectful forms of address and courtesy",
      "Support Arabic language when requested",
      "Maintain cultural sensitivity in all interactions",
    ];
  }

  // Performance monitoring
  getCacheStats() {
    return {
      cacheSize: this.validationCache.size,
      cacheEnabled: this.config.culturalValidation.cacheEnabled,
      cacheTtl: this.config.culturalValidation.cacheTtl,
    };
  }

  clearCache() {
    this.validationCache.clear();
  }
}
