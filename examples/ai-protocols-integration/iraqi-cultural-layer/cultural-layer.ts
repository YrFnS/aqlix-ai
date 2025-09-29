/**
 * Iraqi Cultural Validation Layer
 *
 * Provides comprehensive cultural validation for the Iraqi AI Chat System
 * ensuring content respects Iraqi values, customs, and social norms.
 *
 * Features:
 * - Islamic principles compliance validation
 * - Iraqi cultural appropriateness scoring
 * - Professional domain context awareness
 * - Real-time content filtering
 * - Cultural recommendation system
 */

export interface CulturalValidationOptions {
  strictMode?: boolean;
  professionalDomain?: string;
  userContext?: {
    age?: number;
    profession?: string;
    education?: string;
  };
}

export interface CulturalValidationResult {
  score: number; // 0-100
  approved: boolean;
  issues: string[];
  recommendations: string[];
  categories: {
    religious: number;
    social: number;
    professional: number;
    linguistic: number;
  };
}

export interface IraqiEnhancementConfig {
  culturalValidation: {
    enabled: boolean;
    strictMode: boolean;
    requiredScore: number;
  };
  islamicCompliance: {
    enabled: boolean;
    requiredScore: number;
    strictInterpretation: boolean;
  };
  arabicProcessing: {
    enabled: boolean;
    dialectSupport: boolean;
    rtlAccuracy: number;
  };
  professionalDomains: {
    enabled: boolean;
    supportedDomains: string[];
  };
  paymentGateways: {
    enabled: boolean;
    supportedGateways: string[];
    securityLevel: string;
  };
}

/**
 * Iraqi Cultural Validation Layer
 *
 * Validates content against Iraqi cultural norms and Islamic principles
 */
export class IraqiCulturalLayer {
  private config: IraqiEnhancementConfig;
  private validationCount = 0;
  private cultureCache = new Map<string, CulturalValidationResult>();

  // Iraqi cultural keywords and concepts
  private readonly culturalConcepts = {
    positive: [
      // Family and social values
      "عائلة",
      "أسرة",
      "احترام",
      "ضيافة",
      "كرم",
      "تعاون",
      "مساعدة",
      "family",
      "respect",
      "hospitality",
      "cooperation",
      "assistance",

      // Islamic values
      "إسلام",
      "قرآن",
      "صلاة",
      "صيام",
      "حج",
      "زكاة",
      "إيمان",
      "تقوى",
      "islam",
      "quran",
      "prayer",
      "fasting",
      "hajj",
      "zakat",
      "faith",

      // Iraqi heritage
      "تراث",
      "ثقافة",
      "تاريخ",
      "حضارة",
      "بغداد",
      "العراق",
      "رافدين",
      "heritage",
      "culture",
      "history",
      "civilization",
      "baghdad",
      "iraq",

      // Professional values
      "علم",
      "تعليم",
      "طب",
      "قانون",
      "هندسة",
      "تجارة",
      "صناعة",
      "education",
      "medicine",
      "law",
      "engineering",
      "commerce",
      "industry",
    ],

    sensitive: [
      // Political and sectarian terms (handle carefully)
      "طائفة",
      "مذهب",
      "سياسة",
      "حزب",
      "انتخابات",
      "حكومة",
      "sectarian",
      "political",
      "party",
      "elections",
      "government",

      // Social issues requiring careful handling
      "زواج",
      "طلاق",
      "ميراث",
      "شرف",
      "عادات",
      "تقاليد",
      "marriage",
      "divorce",
      "inheritance",
      "honor",
      "customs",
      "traditions",
    ],

    inappropriate: [
      // Content that violates Islamic principles
      "خمر",
      "كحول",
      "قمار",
      "ربا",
      "زنا",
      "لواط",
      "alcohol",
      "gambling",
      "usury",
      "adultery",
      "inappropriate relations",

      // Disrespectful content
      "إهانة",
      "سب",
      "شتم",
      "تجديف",
      "كفر",
      "insult",
      "profanity",
      "blasphemy",
      "disrespect",
    ],
  };

  constructor(config: IraqiEnhancementConfig) {
    this.config = config;
    console.info("Iraqi Cultural Layer initialized with strict validation");
  }

  /**
   * Validate content for Iraqi cultural appropriateness
   */
  async validateContent(
    content: string,
    options: CulturalValidationOptions = {},
  ): Promise<CulturalValidationResult> {
    this.validationCount++;

    // Check cache first
    const cacheKey = `${content.substring(0, 100)}-${JSON.stringify(options)}`;
    if (this.cultureCache.has(cacheKey)) {
      return this.cultureCache.get(cacheKey)!;
    }

    const result = await this.performValidation(content, options);

    // Cache results for performance
    this.cultureCache.set(cacheKey, result);

    return result;
  }

  /**
   * Perform comprehensive cultural validation
   */
  private async performValidation(
    content: string,
    options: CulturalValidationOptions,
  ): Promise<CulturalValidationResult> {
    const contentLower = content.toLowerCase();
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Religious validation
    const religiousScore = this.validateReligiousContent(
      contentLower,
      issues,
      recommendations,
    );

    // Social validation
    const socialScore = this.validateSocialContent(
      contentLower,
      issues,
      recommendations,
      options,
    );

    // Professional validation
    const professionalScore = this.validateProfessionalContent(
      contentLower,
      issues,
      recommendations,
      options.professionalDomain,
    );

    // Linguistic validation
    const linguisticScore = this.validateLinguisticContent(
      contentLower,
      issues,
      recommendations,
    );

    // Calculate overall score
    const categories = {
      religious: religiousScore,
      social: socialScore,
      professional: professionalScore,
      linguistic: linguisticScore,
    };

    const overallScore =
      (religiousScore + socialScore + professionalScore + linguisticScore) / 4;
    const approved =
      overallScore >= this.config.culturalValidation.requiredScore;

    if (!approved) {
      recommendations.push(
        "Consider revising content to better align with Iraqi cultural values",
      );
      recommendations.push(
        "Ensure Islamic principles are respected throughout",
      );
      recommendations.push("Use culturally appropriate language and examples");
    }

    return {
      score: Math.round(overallScore),
      approved,
      issues,
      recommendations,
      categories,
    };
  }

  /**
   * Validate religious content against Islamic principles
   */
  private validateReligiousContent(
    content: string,
    issues: string[],
    recommendations: string[],
  ): number {
    let score = 100;

    // Check for inappropriate religious content
    for (const term of this.culturalConcepts.inappropriate) {
      if (content.includes(term.toLowerCase())) {
        score -= 25;
        issues.push(
          `Content contains inappropriate religious reference: ${term}`,
        );
      }
    }

    // Check for positive Islamic values
    const positiveMatches = this.culturalConcepts.positive.filter(
      (term) =>
        content.includes(term.toLowerCase()) &&
        [
          "إسلام",
          "قرآن",
          "صلاة",
          "إيمان",
          "islam",
          "quran",
          "prayer",
          "faith",
        ].includes(term),
    );

    if (positiveMatches.length > 0) {
      score += 5; // Bonus for positive Islamic content
    }

    // Ensure score bounds
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Validate social content for cultural appropriateness
   */
  private validateSocialContent(
    content: string,
    issues: string[],
    recommendations: string[],
    options: CulturalValidationOptions,
  ): number {
    let score = 85; // Default good score for neutral content

    // Check for positive social values
    const familyValues = [
      "عائلة",
      "احترام",
      "ضيافة",
      "كرم",
      "family",
      "respect",
      "hospitality",
    ];
    const familyMatches = familyValues.filter((term) =>
      content.includes(term.toLowerCase()),
    );

    if (familyMatches.length > 0) {
      score += 10;
    }

    // Check for sensitive topics that need careful handling
    const sensitiveMatches = this.culturalConcepts.sensitive.filter((term) =>
      content.includes(term.toLowerCase()),
    );

    if (sensitiveMatches.length > 0) {
      score -= 10;
      issues.push(
        `Content contains sensitive topics requiring careful handling: ${sensitiveMatches.join(", ")}`,
      );
      recommendations.push(
        "Handle sensitive social topics with extra care and cultural awareness",
      );
    }

    // Professional context adjustments
    if (options.professionalDomain) {
      if (["medical", "legal"].includes(options.professionalDomain)) {
        score += 5; // Professional context is generally positive
      }
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Validate professional content for domain appropriateness
   */
  private validateProfessionalContent(
    content: string,
    issues: string[],
    recommendations: string[],
    domain?: string,
  ): number {
    let score = 90; // Default good score for professional content

    if (!domain) {
      return score;
    }

    // Domain-specific validation
    switch (domain) {
      case "legal":
        return this.validateLegalContent(content, issues, recommendations);
      case "medical":
        return this.validateMedicalContent(content, issues, recommendations);
      case "educational":
        return this.validateEducationalContent(
          content,
          issues,
          recommendations,
        );
      default:
        return score;
    }
  }

  /**
   * Validate legal content for Iraqi legal system
   */
  private validateLegalContent(
    content: string,
    issues: string[],
    recommendations: string[],
  ): number {
    let score = 90;

    // Check for Iraqi legal terminology
    const legalTerms = [
      "قانون",
      "محكمة",
      "قاضي",
      "عدالة",
      "law",
      "court",
      "judge",
      "justice",
    ];
    const legalMatches = legalTerms.filter((term) =>
      content.includes(term.toLowerCase()),
    );

    if (legalMatches.length > 0) {
      score += 5;
    }

    // Ensure Islamic jurisprudence compatibility
    const islamicLegalTerms = [
      "شريعة",
      "فقه",
      "حلال",
      "حرام",
      "sharia",
      "fiqh",
      "halal",
      "haram",
    ];
    const islamicMatches = islamicLegalTerms.filter((term) =>
      content.includes(term.toLowerCase()),
    );

    if (islamicMatches.length > 0) {
      score += 5;
      recommendations.push("Excellent integration of Islamic legal principles");
    } else {
      recommendations.push(
        "Consider referencing Islamic jurisprudence where applicable",
      );
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Validate medical content for Iraqi healthcare system
   */
  private validateMedicalContent(
    content: string,
    issues: string[],
    recommendations: string[],
  ): number {
    let score = 90;

    // Check for medical terminology
    const medicalTerms = [
      "طب",
      "صحة",
      "علاج",
      "مرض",
      "طبيب",
      "medicine",
      "health",
      "treatment",
    ];
    const medicalMatches = medicalTerms.filter((term) =>
      content.includes(term.toLowerCase()),
    );

    if (medicalMatches.length > 0) {
      score += 5;
    }

    // Ensure Islamic medical ethics
    const islamicMedicalEthics = [
      "رحمة",
      "شفاء",
      "عناية",
      "mercy",
      "healing",
      "care",
    ];
    const ethicsMatches = islamicMedicalEthics.filter((term) =>
      content.includes(term.toLowerCase()),
    );

    if (ethicsMatches.length > 0) {
      score += 5;
    }

    recommendations.push(
      "Ensure medical advice aligns with Islamic medical ethics",
    );

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Validate educational content
   */
  private validateEducationalContent(
    content: string,
    issues: string[],
    recommendations: string[],
  ): number {
    let score = 90;

    // Check for educational values
    const educationalTerms = [
      "علم",
      "تعليم",
      "تعلم",
      "معرفة",
      "education",
      "learning",
      "knowledge",
    ];
    const educationalMatches = educationalTerms.filter((term) =>
      content.includes(term.toLowerCase()),
    );

    if (educationalMatches.length > 0) {
      score += 10;
    }

    recommendations.push(
      "Promote continuous learning and knowledge acquisition",
    );
    recommendations.push(
      "Integrate Islamic educational values where appropriate",
    );

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Validate linguistic appropriateness
   */
  private validateLinguisticContent(
    content: string,
    issues: string[],
    recommendations: string[],
  ): number {
    let score = 90;

    // Check for inappropriate language
    const inappropriateLanguage = this.culturalConcepts.inappropriate;
    const inappropriateMatches = inappropriateLanguage.filter((term) =>
      content.includes(term.toLowerCase()),
    );

    if (inappropriateMatches.length > 0) {
      score -= 30;
      issues.push(
        `Content contains inappropriate language: ${inappropriateMatches.join(", ")}`,
      );
      recommendations.push("Use respectful and appropriate language");
    }

    // Check for respectful language
    const respectfulTerms = [
      "من فضلك",
      "شكرا",
      "عفوا",
      "please",
      "thank you",
      "excuse me",
    ];
    const respectfulMatches = respectfulTerms.filter((term) =>
      content.includes(term.toLowerCase()),
    );

    if (respectfulMatches.length > 0) {
      score += 5;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Get validation statistics
   */
  getValidationStats() {
    return {
      totalValidations: this.validationCount,
      cacheSize: this.cultureCache.size,
      averageScore: this.calculateAverageScore(),
      configStatus: this.config.culturalValidation,
    };
  }

  /**
   * Calculate average validation score from cache
   */
  private calculateAverageScore(): number {
    if (this.cultureCache.size === 0) return 0;

    const scores = Array.from(this.cultureCache.values()).map(
      (result) => result.score,
    );
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }

  /**
   * Clear validation cache
   */
  clearCache(): void {
    this.cultureCache.clear();
    console.info("Iraqi cultural validation cache cleared");
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<IraqiEnhancementConfig>): void {
    Object.assign(this.config, newConfig);
    console.info("Iraqi cultural layer configuration updated");
  }
}
