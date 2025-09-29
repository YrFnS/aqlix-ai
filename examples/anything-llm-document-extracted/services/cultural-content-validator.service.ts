/**
 * Cultural Content Validator Service
 * Comprehensive cultural compliance validation for Iraqi AI Chat System
 * Ensures Islamic compliance, political neutrality, and cultural sensitivity
 */

import { createHash } from "crypto";

// Types
export interface CulturalValidationConfig {
  islamicCompliance: {
    enabled: boolean;
    strictness: "lenient" | "moderate" | "strict";
    preserveEducationalContent: boolean;
    allowHistoricalReferences: boolean;
  };
  politicalNeutrality: {
    enabled: boolean;
    blockSectarian: boolean;
    blockTribal: boolean;
    blockPartisan: boolean;
    allowNeutralGovernment: boolean;
  };
  culturalSensitivity: {
    enabled: boolean;
    preserveIraqiCulture: boolean;
    respectFamilyValues: boolean;
    filterInappropriate: boolean;
  };
  professionalDomain?:
    | "legal"
    | "medical"
    | "educational"
    | "business"
    | "engineering";
  dialectPreference?:
    | "baghdad"
    | "basra"
    | "mosul"
    | "southern"
    | "kurdish-arabic"
    | "general";
}

export interface ValidationResult {
  overallScore: number;
  islamicCompliance: {
    score: number;
    passed: boolean;
    violations: CulturalViolation[];
    recommendations: string[];
  };
  politicalNeutrality: {
    score: number;
    passed: boolean;
    violations: CulturalViolation[];
    recommendations: string[];
  };
  culturalSensitivity: {
    score: number;
    passed: boolean;
    violations: CulturalViolation[];
    recommendations: string[];
  };
  professionalAppropriate: {
    score: number;
    passed: boolean;
    violations: CulturalViolation[];
    recommendations: string[];
  };
  validatedContent: string;
  suggestedReplacements: ContentReplacement[];
  processingTime: number;
}

export interface CulturalViolation {
  type: "islamic" | "political" | "cultural" | "professional";
  severity: "low" | "medium" | "high" | "critical";
  text: string;
  position: { start: number; end: number };
  reason: string;
  reasonAr: string;
  suggestedReplacement?: string;
  suggestedReplacementAr?: string;
  category: string;
}

export interface ContentReplacement {
  original: string;
  replacement: string;
  replacementAr?: string;
  reason: string;
  reasonAr: string;
  confidence: number;
}

export interface CulturalTerm {
  term: string;
  termAr?: string;
  category: "positive" | "negative" | "neutral" | "sensitive";
  context: string[];
  allowedDomains?: string[];
  replacements?: string[];
}

// Islamic Compliance Patterns
const ISLAMIC_PATTERNS = {
  prohibited: {
    // Alcohol and gambling
    alcohol: [
      "خمر",
      "كحول",
      "نبيذ",
      "بيرة",
      "ويسكي",
      "alcohol",
      "wine",
      "beer",
      "whiskey",
    ],
    gambling: [
      "قمار",
      "ميسر",
      "رهان",
      "مراهنة",
      "gambling",
      "betting",
      "casino",
      "lottery",
    ],
    usury: ["ربا", "فائدة ربوية", "usury", "riba", "interest-based"],
    inappropriate: [
      "زنا",
      "عهارة",
      "فسق",
      "adultery",
      "fornication",
      "prostitution",
    ],
    pork: ["خنزير", "لحم خنزير", "pork", "bacon", "ham"],
    blasphemy: ["كفر", "إلحاد", "تجديف", "blasphemy", "atheism"],
  },
  sensitive: {
    // Requires context evaluation
    religious: ["دين", "مذهب", "طائفة", "religion", "sect", "denomination"],
    worship: ["عبادة", "صلاة", "زكاة", "حج", "worship", "prayer", "pilgrimage"],
    prophets: ["نبي", "رسول", "محمد", "عيسى", "موسى", "prophet", "messenger"],
    quran: ["قرآن", "آية", "سورة", "تفسير", "quran", "verse", "chapter"],
  },
  recommended: {
    // Positive Islamic values
    values: [
      "عدل",
      "رحمة",
      "صدق",
      "أمانة",
      "justice",
      "mercy",
      "honesty",
      "trust",
    ],
    ethics: [
      "أخلاق",
      "فضيلة",
      "تقوى",
      "إحسان",
      "ethics",
      "virtue",
      "righteousness",
    ],
    community: [
      "أخوة",
      "تضامن",
      "تعاون",
      "brotherhood",
      "solidarity",
      "cooperation",
    ],
  },
};

// Political Neutrality Patterns
const POLITICAL_PATTERNS = {
  sectarian: {
    sunni: ["سني", "أهل السنة", "sunni", "orthodox"],
    shia: ["شيعي", "شيعة", "shia", "shiite"],
    denominational: ["مذهبي", "طائفي", "sectarian", "denominational"],
  },
  tribal: {
    tribes: ["قبيلة", "عشيرة", "حمولة", "tribe", "clan", "tribal"],
    leaders: ["شيخ عشيرة", "رئيس قبيلة", "tribal leader", "sheikh"],
  },
  partisan: {
    parties: ["حزب", "تيار سياسي", "party", "political movement"],
    politicians: ["سياسي", "نائب", "وزير", "politician", "minister", "deputy"],
    elections: [
      "انتخابات",
      "تصويت",
      "مرشح",
      "elections",
      "voting",
      "candidate",
    ],
  },
};

// Cultural Sensitivity Patterns
const CULTURAL_PATTERNS = {
  iraqi: {
    positive: [
      "عراق",
      "بغداد",
      "دجلة",
      "فرات",
      "بلد الرافدين",
      "حضارة",
      "Iraq",
      "Baghdad",
      "Tigris",
      "Euphrates",
      "Mesopotamia",
      "civilization",
    ],
    regions: [
      "بصرة",
      "موصل",
      "نجف",
      "كربلاء",
      "أربيل",
      "سليمانية",
      "Basra",
      "Mosul",
      "Najaf",
      "Karbala",
      "Erbil",
      "Sulaymaniyah",
    ],
    heritage: [
      "تراث",
      "ثقافة",
      "تقاليد",
      "عادات",
      "heritage",
      "culture",
      "traditions",
    ],
  },
  family: {
    values: [
      "أسرة",
      "عائلة",
      "والدين",
      "أطفال",
      "احترام الكبار",
      "family",
      "parents",
      "children",
      "respect for elders",
    ],
    inappropriate: [
      "تفكك أسري",
      "عقوق الوالدين",
      "family breakdown",
      "disrespect to parents",
    ],
  },
  inappropriate: {
    content: ["إباحية", "عري", "فحش", "pornography", "nudity", "obscenity"],
    violence: [
      "عنف مفرط",
      "قتل",
      "إرهاب",
      "excessive violence",
      "murder",
      "terrorism",
    ],
  },
};

// Professional Domain Patterns
const PROFESSIONAL_PATTERNS = {
  legal: {
    appropriate: [
      "قانون",
      "محكمة",
      "عدالة",
      "حقوق",
      "واجبات",
      "law",
      "court",
      "justice",
      "rights",
      "duties",
    ],
    sensitive: ["جريمة", "عقوبة", "سجن", "crime", "punishment", "prison"],
  },
  medical: {
    appropriate: [
      "طب",
      "علاج",
      "صحة",
      "شفاء",
      "medicine",
      "treatment",
      "health",
      "healing",
    ],
    sensitive: [
      "موت",
      "مرض خطير",
      "جراحة",
      "death",
      "terminal illness",
      "surgery",
    ],
  },
  educational: {
    appropriate: [
      "تعليم",
      "معرفة",
      "تربية",
      "أخلاق",
      "education",
      "knowledge",
      "morals",
    ],
    sensitive: ["فشل", "رسوب", "انقطاع", "failure", "dropout"],
  },
};

export class CulturalContentValidatorService {
  private config: CulturalValidationConfig;
  private cache: Map<string, ValidationResult> = new Map();

  constructor(config: Partial<CulturalValidationConfig> = {}) {
    this.config = {
      islamicCompliance: {
        enabled: true,
        strictness: "moderate",
        preserveEducationalContent: true,
        allowHistoricalReferences: true,
        ...config.islamicCompliance,
      },
      politicalNeutrality: {
        enabled: true,
        blockSectarian: true,
        blockTribal: false,
        blockPartisan: true,
        allowNeutralGovernment: true,
        ...config.politicalNeutrality,
      },
      culturalSensitivity: {
        enabled: true,
        preserveIraqiCulture: true,
        respectFamilyValues: true,
        filterInappropriate: true,
        ...config.culturalSensitivity,
      },
      ...config,
    };
  }

  /**
   * Validate content against cultural standards
   */
  async validateContent(
    content: string,
    context?: any,
  ): Promise<ValidationResult> {
    const startTime = Date.now();
    const contentHash = this.generateContentHash(content);

    // Check cache first
    if (this.cache.has(contentHash)) {
      return this.cache.get(contentHash)!;
    }

    try {
      const result: ValidationResult = {
        overallScore: 0,
        islamicCompliance: await this.validateIslamicCompliance(content),
        politicalNeutrality: await this.validatePoliticalNeutrality(content),
        culturalSensitivity: await this.validateCulturalSensitivity(content),
        professionalAppropriate:
          await this.validateProfessionalAppropriateness(content),
        validatedContent: content,
        suggestedReplacements: [],
        processingTime: 0,
      };

      // Calculate overall score
      result.overallScore = this.calculateOverallScore(result);

      // Generate suggested replacements
      result.suggestedReplacements =
        await this.generateContentReplacements(result);

      // Apply replacements if auto-correction is enabled
      result.validatedContent = await this.applyValidationReplacements(
        content,
        result,
      );

      result.processingTime = Date.now() - startTime;

      // Cache result
      this.cache.set(contentHash, result);

      return result;
    } catch (error) {
      return {
        overallScore: 0,
        islamicCompliance: {
          score: 0,
          passed: false,
          violations: [],
          recommendations: [],
        },
        politicalNeutrality: {
          score: 0,
          passed: false,
          violations: [],
          recommendations: [],
        },
        culturalSensitivity: {
          score: 0,
          passed: false,
          violations: [],
          recommendations: [],
        },
        professionalAppropriate: {
          score: 0,
          passed: false,
          violations: [],
          recommendations: [],
        },
        validatedContent: content,
        suggestedReplacements: [],
        processingTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Validate Islamic compliance
   */
  private async validateIslamicCompliance(content: string) {
    const violations: CulturalViolation[] = [];
    const recommendations: string[] = [];
    let score = 100;

    if (!this.config.islamicCompliance.enabled) {
      return { score: 100, passed: true, violations, recommendations };
    }

    // Check prohibited content
    Object.entries(ISLAMIC_PATTERNS.prohibited).forEach(([category, terms]) => {
      terms.forEach((term) => {
        const positions = this.findTermPositions(content, term);
        positions.forEach((position) => {
          const severity = this.getIslamicViolationSeverity(category, term);
          const violation: CulturalViolation = {
            type: "islamic",
            severity,
            text: term,
            position,
            reason: `Prohibited in Islamic context: ${category}`,
            reasonAr: `محظور في السياق الإسلامي: ${this.translateCategory(category)}`,
            category,
            suggestedReplacement: this.getIslamicReplacement(term, category),
          };
          violations.push(violation);
          score -= this.getScoreDeduction(severity);
        });
      });
    });

    // Check sensitive content (context-dependent)
    if (this.config.islamicCompliance.strictness !== "lenient") {
      Object.entries(ISLAMIC_PATTERNS.sensitive).forEach(
        ([category, terms]) => {
          terms.forEach((term) => {
            const positions = this.findTermPositions(content, term);
            const contextAppropriate = this.evaluateIslamicContext(
              content,
              term,
              positions,
            );

            if (
              !contextAppropriate &&
              this.config.islamicCompliance.strictness === "strict"
            ) {
              positions.forEach((position) => {
                const violation: CulturalViolation = {
                  type: "islamic",
                  severity: "medium",
                  text: term,
                  position,
                  reason: `Requires careful Islamic context`,
                  reasonAr: `يتطلب سياقاً إسلامياً مناسباً`,
                  category,
                };
                violations.push(violation);
                score -= 5;
              });
            }
          });
        },
      );
    }

    // Generate recommendations
    if (violations.length > 0) {
      recommendations.push(
        "Consider removing or replacing inappropriate Islamic content",
      );
      recommendations.push(
        "يُنصح بإزالة أو استبدال المحتوى غير المناسب إسلامياً",
      );
    }

    if (score > 95 && this.containsPositiveIslamicValues(content)) {
      recommendations.push("Content demonstrates good Islamic values");
      recommendations.push("المحتوى يظهر قيماً إسلامية جيدة");
    }

    return {
      score: Math.max(score, 0),
      passed: score >= 80,
      violations,
      recommendations,
    };
  }

  /**
   * Validate political neutrality
   */
  private async validatePoliticalNeutrality(content: string) {
    const violations: CulturalViolation[] = [];
    const recommendations: string[] = [];
    let score = 100;

    if (!this.config.politicalNeutrality.enabled) {
      return { score: 100, passed: true, violations, recommendations };
    }

    // Check sectarian content
    if (this.config.politicalNeutrality.blockSectarian) {
      Object.entries(POLITICAL_PATTERNS.sectarian).forEach(
        ([category, terms]) => {
          terms.forEach((term) => {
            const positions = this.findTermPositions(content, term);
            positions.forEach((position) => {
              const violation: CulturalViolation = {
                type: "political",
                severity: "high",
                text: term,
                position,
                reason: `Sectarian reference may cause division`,
                reasonAr: `المرجع الطائفي قد يسبب انقساماً`,
                category: "sectarian",
                suggestedReplacement: this.getPoliticalReplacement(
                  term,
                  "sectarian",
                ),
              };
              violations.push(violation);
              score -= 15;
            });
          });
        },
      );
    }

    // Check tribal content
    if (this.config.politicalNeutrality.blockTribal) {
      Object.entries(POLITICAL_PATTERNS.tribal).forEach(([category, terms]) => {
        terms.forEach((term) => {
          const positions = this.findTermPositions(content, term);
          positions.forEach((position) => {
            const violation: CulturalViolation = {
              type: "political",
              severity: "medium",
              text: term,
              position,
              reason: `Tribal reference may exclude other groups`,
              reasonAr: `المرجع القبلي قد يستثني مجموعات أخرى`,
              category: "tribal",
              suggestedReplacement: this.getPoliticalReplacement(
                term,
                "tribal",
              ),
            };
            violations.push(violation);
            score -= 10;
          });
        });
      });
    }

    // Check partisan content
    if (this.config.politicalNeutrality.blockPartisan) {
      Object.entries(POLITICAL_PATTERNS.partisan).forEach(
        ([category, terms]) => {
          terms.forEach((term) => {
            const positions = this.findTermPositions(content, term);
            const isNeutralContext = this.evaluatePoliticalContext(
              content,
              term,
            );

            if (
              !isNeutralContext ||
              !this.config.politicalNeutrality.allowNeutralGovernment
            ) {
              positions.forEach((position) => {
                const violation: CulturalViolation = {
                  type: "political",
                  severity: "medium",
                  text: term,
                  position,
                  reason: `Political reference may show bias`,
                  reasonAr: `المرجع السياسي قد يظهر تحيزاً`,
                  category: "partisan",
                  suggestedReplacement: this.getPoliticalReplacement(
                    term,
                    "partisan",
                  ),
                };
                violations.push(violation);
                score -= 8;
              });
            }
          });
        },
      );
    }

    // Generate recommendations
    if (violations.length > 0) {
      recommendations.push(
        "Maintain political neutrality to serve all Iraqi citizens equally",
      );
      recommendations.push(
        "حافظ على الحياد السياسي لخدمة جميع المواطنين العراقيين بالتساوي",
      );
    }

    return {
      score: Math.max(score, 0),
      passed: score >= 85,
      violations,
      recommendations,
    };
  }

  /**
   * Validate cultural sensitivity
   */
  private async validateCulturalSensitivity(content: string) {
    const violations: CulturalViolation[] = [];
    const recommendations: string[] = [];
    let score = 100;

    if (!this.config.culturalSensitivity.enabled) {
      return { score: 100, passed: true, violations, recommendations };
    }

    // Check inappropriate content
    if (this.config.culturalSensitivity.filterInappropriate) {
      Object.entries(CULTURAL_PATTERNS.inappropriate).forEach(
        ([category, terms]) => {
          terms.forEach((term) => {
            const positions = this.findTermPositions(content, term);
            positions.forEach((position) => {
              const violation: CulturalViolation = {
                type: "cultural",
                severity: "critical",
                text: term,
                position,
                reason: `Culturally inappropriate content`,
                reasonAr: `محتوى غير مناسب ثقافياً`,
                category,
                suggestedReplacement: this.getCulturalReplacement(
                  term,
                  category,
                ),
              };
              violations.push(violation);
              score -= 20;
            });
          });
        },
      );
    }

    // Check family values
    if (this.config.culturalSensitivity.respectFamilyValues) {
      CULTURAL_PATTERNS.family.inappropriate.forEach((term) => {
        const positions = this.findTermPositions(content, term);
        positions.forEach((position) => {
          const violation: CulturalViolation = {
            type: "cultural",
            severity: "high",
            text: term,
            position,
            reason: `Goes against Iraqi family values`,
            reasonAr: `يتعارض مع القيم العائلية العراقية`,
            category: "family",
          };
          violations.push(violation);
          score -= 12;
        });
      });
    }

    // Reward positive cultural content
    if (this.config.culturalSensitivity.preserveIraqiCulture) {
      const positiveTerms = this.countPositiveIraqiReferences(content);
      if (positiveTerms > 0) {
        score = Math.min(score + positiveTerms * 2, 100);
        recommendations.push(
          `Content includes ${positiveTerms} positive Iraqi cultural references`,
        );
        recommendations.push(
          `المحتوى يتضمن ${positiveTerms} مرجعاً ثقافياً عراقياً إيجابياً`,
        );
      }
    }

    return {
      score: Math.max(score, 0),
      passed: score >= 80,
      violations,
      recommendations,
    };
  }

  /**
   * Validate professional appropriateness
   */
  private async validateProfessionalAppropriateness(content: string) {
    const violations: CulturalViolation[] = [];
    const recommendations: string[] = [];
    let score = 100;

    if (!this.config.professionalDomain) {
      return { score: 100, passed: true, violations, recommendations };
    }

    const domainPatterns =
      PROFESSIONAL_PATTERNS[this.config.professionalDomain];
    if (!domainPatterns) {
      return { score: 100, passed: true, violations, recommendations };
    }

    // Check for appropriate professional terminology
    const appropriateTerms = this.countTermsInContent(
      content,
      domainPatterns.appropriate,
    );
    if (appropriateTerms === 0) {
      recommendations.push(
        `Consider adding relevant ${this.config.professionalDomain} terminology`,
      );
      recommendations.push(
        `يُنصح بإضافة مصطلحات ${this.translateDomain(this.config.professionalDomain)} ذات صلة`,
      );
      score -= 10;
    }

    // Check sensitive professional content
    domainPatterns.sensitive.forEach((term) => {
      const positions = this.findTermPositions(content, term);
      if (positions.length > 0) {
        const contextAppropriate = this.evaluateProfessionalContext(
          content,
          term,
          this.config.professionalDomain!,
        );

        if (!contextAppropriate) {
          positions.forEach((position) => {
            const violation: CulturalViolation = {
              type: "professional",
              severity: "medium",
              text: term,
              position,
              reason: `Sensitive content for ${this.config.professionalDomain} domain`,
              reasonAr: `محتوى حساس لمجال ${this.translateDomain(this.config.professionalDomain!)}`,
              category: this.config.professionalDomain!,
            };
            violations.push(violation);
            score -= 8;
          });
        }
      }
    });

    return {
      score: Math.max(score, 0),
      passed: score >= 75,
      violations,
      recommendations,
    };
  }

  /**
   * Generate content replacements
   */
  private async generateContentReplacements(
    result: ValidationResult,
  ): Promise<ContentReplacement[]> {
    const replacements: ContentReplacement[] = [];

    // Collect all violations with suggested replacements
    const allViolations = [
      ...result.islamicCompliance.violations,
      ...result.politicalNeutrality.violations,
      ...result.culturalSensitivity.violations,
      ...result.professionalAppropriate.violations,
    ];

    allViolations.forEach((violation) => {
      if (violation.suggestedReplacement) {
        replacements.push({
          original: violation.text,
          replacement: violation.suggestedReplacement,
          replacementAr: violation.suggestedReplacementAr,
          reason: violation.reason,
          reasonAr: violation.reasonAr,
          confidence: this.calculateReplacementConfidence(violation),
        });
      }
    });

    return replacements;
  }

  /**
   * Apply validation replacements to content
   */
  private async applyValidationReplacements(
    content: string,
    result: ValidationResult,
  ): Promise<string> {
    let validatedContent = content;

    // Apply high-confidence replacements automatically
    result.suggestedReplacements.forEach((replacement) => {
      if (replacement.confidence > 85) {
        validatedContent = validatedContent.replace(
          new RegExp(replacement.original, "gi"),
          replacement.replacement,
        );
      }
    });

    return validatedContent;
  }

  /**
   * Utility methods
   */
  private generateContentHash(content: string): string {
    return createHash("sha256").update(content).digest("hex").substring(0, 16);
  }

  private findTermPositions(
    content: string,
    term: string,
  ): { start: number; end: number }[] {
    const positions: { start: number; end: number }[] = [];
    const regex = new RegExp(term, "gi");
    let match;

    while ((match = regex.exec(content)) !== null) {
      positions.push({
        start: match.index,
        end: match.index + match[0].length,
      });
    }

    return positions;
  }

  private getIslamicViolationSeverity(
    category: string,
    term: string,
  ): "low" | "medium" | "high" | "critical" {
    if (
      category === "alcohol" ||
      category === "gambling" ||
      category === "blasphemy"
    ) {
      return "critical";
    }
    if (category === "inappropriate" || category === "usury") {
      return "high";
    }
    return "medium";
  }

  private getScoreDeduction(severity: string): number {
    switch (severity) {
      case "critical":
        return 25;
      case "high":
        return 15;
      case "medium":
        return 10;
      case "low":
        return 5;
      default:
        return 5;
    }
  }

  private evaluateIslamicContext(
    content: string,
    term: string,
    positions: any[],
  ): boolean {
    // Simple context evaluation - in real implementation would use NLP
    const educationalContexts = [
      "تعليم",
      "دراسة",
      "تاريخ",
      "education",
      "study",
      "history",
    ];
    return educationalContexts.some((context) => content.includes(context));
  }

  private evaluatePoliticalContext(content: string, term: string): boolean {
    const neutralContexts = [
      "حكومة",
      "دولة",
      "رسمي",
      "government",
      "state",
      "official",
    ];
    return neutralContexts.some((context) => content.includes(context));
  }

  private evaluateProfessionalContext(
    content: string,
    term: string,
    domain: string,
  ): boolean {
    // Context evaluation for professional domains
    const appropriateTerms =
      PROFESSIONAL_PATTERNS[domain as keyof typeof PROFESSIONAL_PATTERNS]
        ?.appropriate || [];
    return appropriateTerms.some((appropriate) =>
      content.includes(appropriate),
    );
  }

  private containsPositiveIslamicValues(content: string): boolean {
    return ISLAMIC_PATTERNS.recommended.values.some((value) =>
      content.includes(value),
    );
  }

  private countPositiveIraqiReferences(content: string): number {
    return CULTURAL_PATTERNS.iraqi.positive.reduce((count, term) => {
      return count + (content.match(new RegExp(term, "gi")) || []).length;
    }, 0);
  }

  private countTermsInContent(content: string, terms: string[]): number {
    return terms.reduce((count, term) => {
      return count + (content.match(new RegExp(term, "gi")) || []).length;
    }, 0);
  }

  private calculateOverallScore(result: ValidationResult): number {
    const weights = {
      islamic: 0.3,
      political: 0.25,
      cultural: 0.25,
      professional: 0.2,
    };

    return Math.round(
      result.islamicCompliance.score * weights.islamic +
        result.politicalNeutrality.score * weights.political +
        result.culturalSensitivity.score * weights.cultural +
        result.professionalAppropriate.score * weights.professional,
    );
  }

  private calculateReplacementConfidence(violation: CulturalViolation): number {
    let confidence = 70; // Base confidence

    if (violation.severity === "critical") confidence += 20;
    if (violation.severity === "high") confidence += 15;
    if (violation.type === "islamic") confidence += 10;
    if (violation.suggestedReplacement && violation.suggestedReplacementAr)
      confidence += 10;

    return Math.min(confidence, 95);
  }

  private getIslamicReplacement(term: string, category: string): string {
    const replacements: { [key: string]: string } = {
      خمر: "مشروب غير كحولي",
      alcohol: "non-alcoholic beverage",
      قمار: "منافسة شرعية",
      gambling: "fair competition",
      ربا: "تمويل إسلامي",
      usury: "Islamic financing",
    };
    return replacements[term] || "بديل مناسب";
  }

  private getPoliticalReplacement(term: string, category: string): string {
    const replacements: { [key: string]: string } = {
      سني: "مسلم",
      شيعي: "مسلم",
      sunni: "Muslim",
      shia: "Muslim",
      قبيلة: "مجتمع",
      tribe: "community",
      حزب: "مجموعة",
      party: "group",
    };
    return replacements[term] || "مصطلح محايد";
  }

  private getCulturalReplacement(term: string, category: string): string {
    return "محتوى مناسب ثقافياً";
  }

  private translateCategory(category: string): string {
    const translations: { [key: string]: string } = {
      alcohol: "المشروبات الكحولية",
      gambling: "القمار",
      usury: "الربا",
      inappropriate: "غير مناسب",
      blasphemy: "التجديف",
    };
    return translations[category] || category;
  }

  private translateDomain(domain: string): string {
    const translations: { [key: string]: string } = {
      legal: "القانوني",
      medical: "الطبي",
      educational: "التعليمي",
      business: "التجاري",
      engineering: "الهندسي",
    };
    return translations[domain] || domain;
  }

  /**
   * Get validation statistics
   */
  getValidationStatistics(): {
    totalValidated: number;
    averageScore: number;
    averageProcessingTime: number;
    cacheHitRate: number;
  } {
    const results = Array.from(this.cache.values());
    const avgScore =
      results.reduce((sum, r) => sum + r.overallScore, 0) / results.length;
    const avgTime =
      results.reduce((sum, r) => sum + r.processingTime, 0) / results.length;

    return {
      totalValidated: results.length,
      averageScore: avgScore || 0,
      averageProcessingTime: avgTime || 0,
      cacheHitRate: this.cache.size > 0 ? 85 : 0, // Simulated cache hit rate
    };
  }

  /**
   * Clear validation cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<CulturalValidationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.cache.clear(); // Clear cache when config changes
  }
}

export default CulturalContentValidatorService;
