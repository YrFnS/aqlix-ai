/**
 * Cultural Prompt System for Iraqi AI Design Generation
 *
 * Intelligent prompt generation with Islamic compliance and Iraqi cultural awareness
 */

import { EventEmitter } from "events";
import {
  IDesignRequest,
  ICulturalDesignRequirements,
  ICulturalValidationResult,
} from "./IraqiDesignEngine";

// Cultural prompt interfaces
export interface ICulturalPrompt {
  id: string;
  basePrompt: string;
  culturalEnhancements: string[];
  islamicGuidelines: string[];
  arabicRTLInstructions: string[];
  ministrySpecificRequirements: string[];
  accessibilityInstructions: string[];
  performanceConsiderations: string[];
  validationCriteria: IValidationCriteria;
}

export interface IValidationCriteria {
  islamicCompliance: IIslamicComplianceCriteria;
  culturalAppropriateness: ICulturalAppropriatenessCriteria;
  arabicRTLCompliance: IArabicRTLCriteria;
  professionalStandards: IProfessionalStandardsCriteria;
}

export interface IIslamicComplianceCriteria {
  modestImagery: boolean;
  appropriateColors: boolean;
  respectfulLanguage: boolean;
  culturalSensitivity: boolean;
  noProhibitedContent: boolean;
  familyValueAlignment: boolean;
}

export interface ICulturalAppropriatenessCriteria {
  iraqiCulturalNorms: boolean;
  arabicLanguageSupport: boolean;
  professionalFormality: boolean;
  governmentStandards: boolean;
  socialAppropriatenessScore: number;
}

export interface IArabicRTLCriteria {
  rtlLayoutSupport: boolean;
  arabicTypography: boolean;
  mixedContentHandling: boolean;
  dialectRecognition: boolean;
  bidirectionalTextSupport: boolean;
}

export interface IProfessionalStandardsCriteria {
  ministryBrandingCompliance: boolean;
  accessibilityStandards: boolean;
  securityRequirements: boolean;
  usabilityStandards: boolean;
  performanceRequirements: boolean;
}

export interface ICulturalPromptOptions {
  validationLevel: "basic" | "comprehensive" | "strict";
  enableLearning: boolean;
  cachePrompts: boolean;
  customCulturalRules?: ICulturalRule[];
}

export interface ICulturalRule {
  id: string;
  category: "islamic" | "cultural" | "professional" | "linguistic";
  rule: string;
  severity: "error" | "warning" | "info";
  ministry?: string;
}

export interface IValidationResult {
  result: ICulturalValidationResult;
  processingTime: number;
  rulesApplied: string[];
  recommendations: string[];
}

/**
 * Cultural Prompt System
 *
 * Generates culturally-intelligent design prompts and validates results
 */
export class CulturalPromptSystem extends EventEmitter {
  private readonly options: ICulturalPromptOptions;
  private readonly promptCache: Map<string, ICulturalPrompt> = new Map();
  private readonly culturalRules: Map<string, ICulturalRule> = new Map();
  private readonly islamicDesignPrinciples: string[];
  private readonly iraqiCulturalPatterns: string[];
  private readonly ministryBrandingGuidelines: Map<string, string[]>;

  constructor(options: Partial<ICulturalPromptOptions> = {}) {
    super();

    this.options = {
      validationLevel: options.validationLevel ?? "comprehensive",
      enableLearning: options.enableLearning ?? true,
      cachePrompts: options.cachePrompts ?? true,
      customCulturalRules: options.customCulturalRules ?? [],
    };

    // Initialize cultural knowledge base
    this.islamicDesignPrinciples = this.loadIslamicDesignPrinciples();
    this.iraqiCulturalPatterns = this.loadIraqiCulturalPatterns();
    this.ministryBrandingGuidelines = this.loadMinistryBrandingGuidelines();

    // Load cultural rules
    this.loadCulturalRules();
    this.loadCustomRules(this.options.customCulturalRules || []);
  }

  /**
   * Generate culturally-aware design prompt
   */
  async generatePrompt(request: IDesignRequest): Promise<ICulturalPrompt> {
    const promptId = `prompt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Check cache first
    const cacheKey = this.generatePromptCacheKey(request);
    if (this.options.cachePrompts && this.promptCache.has(cacheKey)) {
      const cachedPrompt = this.promptCache.get(cacheKey)!;
      this.emit("promptGenerated", {
        promptId,
        cached: true,
        prompt: cachedPrompt,
      });
      return cachedPrompt;
    }

    try {
      // Generate base prompt
      const basePrompt = this.generateBasePrompt(request);

      // Add cultural enhancements
      const culturalEnhancements = this.generateCulturalEnhancements(request);

      // Add Islamic guidelines
      const islamicGuidelines = this.generateIslamicGuidelines(request);

      // Add Arabic RTL instructions
      const arabicRTLInstructions = this.generateArabicRTLInstructions(request);

      // Add ministry-specific requirements
      const ministrySpecificRequirements =
        this.generateMinistryRequirements(request);

      // Add accessibility instructions
      const accessibilityInstructions =
        this.generateAccessibilityInstructions(request);

      // Add performance considerations
      const performanceConsiderations =
        this.generatePerformanceConsiderations(request);

      // Generate validation criteria
      const validationCriteria = this.generateValidationCriteria(request);

      const prompt: ICulturalPrompt = {
        id: promptId,
        basePrompt,
        culturalEnhancements,
        islamicGuidelines,
        arabicRTLInstructions,
        ministrySpecificRequirements,
        accessibilityInstructions,
        performanceConsiderations,
        validationCriteria,
      };

      // Cache successful prompts
      if (this.options.cachePrompts) {
        this.promptCache.set(cacheKey, prompt);
      }

      this.emit("promptGenerated", { promptId, cached: false, prompt });

      return prompt;
    } catch (error) {
      this.emit("promptError", {
        promptId,
        error: error instanceof Error ? error.message : "Unknown error",
        request,
      });
      throw error;
    }
  }

  /**
   * Validate generated design for cultural compliance
   */
  async validateDesign(
    componentCode: string,
    requirements: ICulturalDesignRequirements,
  ): Promise<IValidationResult> {
    const startTime = Date.now();
    const appliedRules: string[] = [];
    const recommendations: string[] = [];

    try {
      // Islamic compliance validation
      const islamicCompliance = await this.validateIslamicCompliance(
        componentCode,
        requirements,
        appliedRules,
      );

      // Arabic RTL accuracy validation
      const arabicRTLAccuracy = await this.validateArabicRTLAccuracy(
        componentCode,
        requirements,
        appliedRules,
      );

      // Iraqi cultural appropriateness validation
      const culturalScore = await this.validateCulturalAppropriateness(
        componentCode,
        requirements,
        appliedRules,
      );

      // Professional standards validation
      const professionalScore = await this.validateProfessionalStandards(
        componentCode,
        requirements,
        appliedRules,
      );

      // Calculate overall cultural score
      const overallScore = this.calculateOverallCulturalScore(
        islamicCompliance.score,
        arabicRTLAccuracy.score,
        culturalScore,
        professionalScore,
      );

      // Generate recommendations
      recommendations.push(...islamicCompliance.recommendations);
      recommendations.push(...arabicRTLAccuracy.recommendations);

      if (overallScore < 90) {
        recommendations.push("Consider additional cultural review");
      }

      const result: ICulturalValidationResult = {
        islamicCompliance,
        arabicRTLAccuracy,
        iraqiCulturalAppropriatenessScore: culturalScore,
        professionalStandardsCompliance: professionalScore,
        overallCulturalScore: overallScore,
      };

      const processingTime = Date.now() - startTime;

      this.emit("validationComplete", {
        result,
        processingTime,
        appliedRules,
        recommendations,
      });

      return {
        result,
        processingTime,
        rulesApplied: appliedRules,
        recommendations,
      };
    } catch (error) {
      this.emit("validationError", {
        error: error instanceof Error ? error.message : "Unknown error",
        componentCode: componentCode.substring(0, 100) + "...",
      });
      throw error;
    }
  }

  /**
   * Get cultural rules for specific ministry
   */
  getCulturalRules(ministry?: string): ICulturalRule[] {
    const allRules = Array.from(this.culturalRules.values());

    if (!ministry) {
      return allRules;
    }

    return allRules.filter(
      (rule) => !rule.ministry || rule.ministry === ministry,
    );
  }

  /**
   * Add custom cultural rule
   */
  addCulturalRule(rule: ICulturalRule): void {
    this.culturalRules.set(rule.id, rule);
    this.emit("ruleAdded", rule);
  }

  /**
   * Get prompt generation analytics
   */
  getAnalytics(): ICulturalPromptAnalytics {
    return {
      totalPrompts: this.promptCache.size,
      cacheHitRate: this.calculateCacheHitRate(),
      culturalRulesCount: this.culturalRules.size,
      averageValidationTime: this.calculateAverageValidationTime(),
      complianceRate: this.calculateComplianceRate(),
    };
  }

  /**
   * Clear prompt cache
   */
  clearCache(): void {
    this.promptCache.clear();
    this.emit("cacheCleared");
  }

  /**
   * Private helper methods
   */

  private generateBasePrompt(request: IDesignRequest): string {
    return `Generate a ${request.componentType} component for Iraqi ${request.targetMinistry} ministry applications. 
    
The component should be:
- Culturally appropriate for Iraqi professional context
- Fully accessible with WCAG 2.1 AA compliance
- Optimized for Arabic RTL layout and typography
- Built with React, TypeScript, and Tailwind CSS
- Professional and government-appropriate in design
- Responsive and mobile-friendly`;
  }

  private generateCulturalEnhancements(request: IDesignRequest): string[] {
    const enhancements = [
      "Apply Iraqi cultural design patterns and visual hierarchy",
      "Use colors that resonate with Iraqi cultural preferences",
      "Implement formal, professional tone appropriate for government applications",
      "Consider Iraqi social norms in interaction design",
    ];

    if (request.culturalRequirements.culturalSensitivity === "high") {
      enhancements.push(
        "Apply heightened cultural sensitivity measures",
        "Review content for cultural appropriateness",
        "Use conservative design approach",
      );
    }

    return enhancements;
  }

  private generateIslamicGuidelines(request: IDesignRequest): string[] {
    const guidelines = [...this.islamicDesignPrinciples];

    if (request.culturalRequirements.islamicCompliance) {
      guidelines.push(
        "Ensure all imagery and icons are Islamic-appropriate",
        "Use modest and respectful design elements",
        "Avoid potentially sensitive content or imagery",
        "Align with Islamic values and principles",
      );
    }

    return guidelines;
  }

  private generateArabicRTLInstructions(request: IDesignRequest): string[] {
    const instructions = [
      "Implement RTL (right-to-left) layout support",
      "Use Arabic-compatible fonts and typography",
      "Handle mixed Arabic-English content properly",
      "Ensure proper text direction for forms and inputs",
    ];

    if (request.culturalRequirements.iraqiDialectSupport) {
      instructions.push(
        "Support Iraqi Arabic dialect recognition",
        "Handle regional language variations",
        "Implement dialect-specific formatting",
      );
    }

    return instructions;
  }

  private generateMinistryRequirements(request: IDesignRequest): string[] {
    const ministryGuidelines =
      this.ministryBrandingGuidelines.get(request.targetMinistry) || [];

    return [
      `Apply ${request.targetMinistry} ministry branding standards`,
      "Use official ministry colors and typography",
      "Include required ministry logos and branding elements",
      "Follow ministry-specific layout conventions",
      ...ministryGuidelines,
    ];
  }

  private generateAccessibilityInstructions(request: IDesignRequest): string[] {
    return [
      "Implement WCAG 2.1 AA accessibility standards",
      "Support Arabic screen readers (NVDA, JAWS)",
      "Ensure proper RTL keyboard navigation",
      "Use semantic HTML with proper ARIA labels",
      "Provide high contrast mode support",
      "Include proper focus management for RTL layout",
    ];
  }

  private generatePerformanceConsiderations(request: IDesignRequest): string[] {
    const considerations = [
      "Optimize for fast loading with Arabic fonts",
      "Minimize bundle size for government networks",
      "Implement proper code splitting",
      "Use efficient RTL CSS patterns",
    ];

    if (
      request.functionalRequirements.performanceTarget === "high-performance"
    ) {
      considerations.push(
        "Implement advanced performance optimizations",
        "Use minimal re-renders and efficient state management",
        "Optimize for low-end devices common in Iraq",
      );
    }

    return considerations;
  }

  private generateValidationCriteria(
    request: IDesignRequest,
  ): IValidationCriteria {
    return {
      islamicCompliance: {
        modestImagery: request.culturalRequirements.islamicCompliance,
        appropriateColors: true,
        respectfulLanguage: true,
        culturalSensitivity:
          request.culturalRequirements.culturalSensitivity === "high",
        noProhibitedContent: request.culturalRequirements.islamicCompliance,
        familyValueAlignment: true,
      },
      culturalAppropriateness: {
        iraqiCulturalNorms: true,
        arabicLanguageSupport: request.culturalRequirements.arabicRTLSupport,
        professionalFormality:
          request.culturalRequirements.professionalContext === "government",
        governmentStandards: request.culturalRequirements.ministryBranding,
        socialAppropriatenessScore: 95,
      },
      arabicRTLCompliance: {
        rtlLayoutSupport: request.culturalRequirements.arabicRTLSupport,
        arabicTypography: request.culturalRequirements.arabicRTLSupport,
        mixedContentHandling: request.culturalRequirements.bilingualSupport,
        dialectRecognition: request.culturalRequirements.iraqiDialectSupport,
        bidirectionalTextSupport: request.culturalRequirements.bilingualSupport,
      },
      professionalStandards: {
        ministryBrandingCompliance:
          request.culturalRequirements.ministryBranding,
        accessibilityStandards:
          request.functionalRequirements.accessibilityLevel !== "basic",
        securityRequirements: true,
        usabilityStandards: true,
        performanceRequirements:
          request.functionalRequirements.performanceTarget !== "standard",
      },
    };
  }

  private async validateIslamicCompliance(
    code: string,
    requirements: ICulturalDesignRequirements,
    appliedRules: string[],
  ): Promise<{ score: number; issues: string[]; recommendations: string[] }> {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    // Check for potentially inappropriate content
    const prohibitedPatterns = [
      /alcohol/i,
      /wine/i,
      /beer/i,
      /gambling/i,
      /casino/i,
      /lottery/i,
      /dating/i,
      /romance/i,
    ];

    for (const pattern of prohibitedPatterns) {
      if (pattern.test(code)) {
        issues.push(
          `Potentially inappropriate content detected: ${pattern.source}`,
        );
        score -= 20;
        appliedRules.push("Islamic Content Compliance");
      }
    }

    // Check for modest imagery requirements
    if (requirements.islamicCompliance && code.includes("<img")) {
      recommendations.push("Ensure all images are modest and appropriate");
      appliedRules.push("Islamic Imagery Standards");
    }

    // Check for family-friendly language
    if (
      code.toLowerCase().includes("sexy") ||
      code.toLowerCase().includes("hot")
    ) {
      issues.push("Language may not be family-appropriate");
      score -= 15;
      appliedRules.push("Islamic Language Standards");
    }

    return { score: Math.max(0, score), issues, recommendations };
  }

  private async validateArabicRTLAccuracy(
    code: string,
    requirements: ICulturalDesignRequirements,
    appliedRules: string[],
  ): Promise<{
    score: number;
    layoutIssues: string[];
    typographyIssues: string[];
    recommendations: string[];
  }> {
    const layoutIssues: string[] = [];
    const typographyIssues: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    if (requirements.arabicRTLSupport) {
      // Check for RTL support
      if (!code.includes('dir="rtl"') && !code.includes("direction: rtl")) {
        layoutIssues.push("Missing RTL direction support");
        score -= 25;
      }

      // Check for Arabic font support
      if (!code.includes("font-arabic") && !code.includes("Arabic")) {
        typographyIssues.push("No Arabic font specification found");
        score -= 15;
      }

      // Check for proper RTL layout classes
      if (!code.includes("text-right") && !code.includes("justify-end")) {
        layoutIssues.push("Missing RTL alignment classes");
        score -= 10;
      }

      appliedRules.push("Arabic RTL Layout Standards");
    }

    if (requirements.bilingualSupport) {
      recommendations.push(
        "Implement bidirectional text support for mixed content",
      );
      appliedRules.push("Bilingual Content Support");
    }

    return {
      score: Math.max(0, score),
      layoutIssues,
      typographyIssues,
      recommendations,
    };
  }

  private async validateCulturalAppropriateness(
    code: string,
    requirements: ICulturalDesignRequirements,
    appliedRules: string[],
  ): Promise<number> {
    let score = 100;

    // Check for professional formality
    if (requirements.professionalContext === "government") {
      if (
        code.toLowerCase().includes("fun") ||
        code.toLowerCase().includes("cool")
      ) {
        score -= 10; // Too casual for government context
      }
      appliedRules.push("Government Formality Standards");
    }

    // Check for cultural color usage
    if (
      code.includes("green") ||
      code.includes("blue") ||
      code.includes("gold")
    ) {
      score += 5; // Bonus for culturally appropriate colors
      appliedRules.push("Iraqi Cultural Color Standards");
    }

    return Math.max(0, score);
  }

  private async validateProfessionalStandards(
    code: string,
    requirements: ICulturalDesignRequirements,
    appliedRules: string[],
  ): Promise<number> {
    let score = 100;

    // Check for accessibility attributes
    if (!code.includes("aria-label") && !code.includes("alt=")) {
      score -= 15;
    }

    // Check for semantic HTML
    if (
      !code.includes("<main>") &&
      !code.includes("<section>") &&
      !code.includes("<header>")
    ) {
      score -= 10;
    }

    appliedRules.push("Professional Accessibility Standards");

    return Math.max(0, score);
  }

  private calculateOverallCulturalScore(
    islamic: number,
    rtl: number,
    cultural: number,
    professional: number,
  ): number {
    // Weighted average with Islamic compliance having highest weight
    return Math.round(
      islamic * 0.4 + rtl * 0.3 + cultural * 0.2 + professional * 0.1,
    );
  }

  private loadIslamicDesignPrinciples(): string[] {
    return [
      "Use modest and respectful design elements",
      "Avoid inappropriate imagery or content",
      "Maintain family-friendly approach",
      "Respect Islamic values in all design decisions",
      "Use colors that align with Islamic aesthetics",
      "Ensure content is culturally sensitive",
    ];
  }

  private loadIraqiCulturalPatterns(): string[] {
    return [
      "Formal and respectful tone for government applications",
      "Traditional color schemes: green, blue, gold",
      "Conservative approach to imagery and content",
      "Professional hierarchy and clear information structure",
      "Support for Arabic calligraphy and traditional patterns",
      "Respect for Iraqi social and cultural norms",
    ];
  }

  private loadMinistryBrandingGuidelines(): Map<string, string[]> {
    const guidelines = new Map();

    guidelines.set("health", [
      "Use healthcare-specific icons and terminology",
      "Implement medical data privacy standards",
      "Support patient confidentiality requirements",
    ]);

    guidelines.set("education", [
      "Use educational color schemes and icons",
      "Support student and faculty user roles",
      "Implement academic calendar considerations",
    ]);

    guidelines.set("interior", [
      "Use security-focused design elements",
      "Implement citizen service standards",
      "Support document processing workflows",
    ]);

    guidelines.set("justice", [
      "Use legal system color schemes",
      "Implement court proceeding standards",
      "Support case management workflows",
    ]);

    return guidelines;
  }

  private loadCulturalRules(): void {
    const defaultRules: ICulturalRule[] = [
      {
        id: "islamic-content-1",
        category: "islamic",
        rule: "No alcohol, gambling, or dating-related content",
        severity: "error",
      },
      {
        id: "islamic-imagery-1",
        category: "islamic",
        rule: "All imagery must be modest and appropriate",
        severity: "warning",
      },
      {
        id: "arabic-rtl-1",
        category: "linguistic",
        rule: "All Arabic content must support RTL layout",
        severity: "error",
      },
      {
        id: "cultural-formality-1",
        category: "cultural",
        rule: "Government applications must maintain formal tone",
        severity: "warning",
      },
      {
        id: "professional-accessibility-1",
        category: "professional",
        rule: "All components must meet WCAG 2.1 AA standards",
        severity: "error",
      },
    ];

    defaultRules.forEach((rule) => {
      this.culturalRules.set(rule.id, rule);
    });
  }

  private loadCustomRules(customRules: ICulturalRule[]): void {
    customRules.forEach((rule) => {
      this.culturalRules.set(rule.id, rule);
    });
  }

  private generatePromptCacheKey(request: IDesignRequest): string {
    const keyData = {
      componentType: request.componentType,
      ministry: request.targetMinistry,
      cultural: request.culturalRequirements,
    };

    return btoa(JSON.stringify(keyData)).replace(/[+/=]/g, "");
  }

  private calculateCacheHitRate(): number {
    // This would be tracked with actual usage metrics
    return 0; // Placeholder
  }

  private calculateAverageValidationTime(): number {
    // This would be tracked with actual validation metrics
    return 0; // Placeholder
  }

  private calculateComplianceRate(): number {
    // This would be tracked with actual validation results
    return 95; // Placeholder
  }
}

// Supporting interfaces
export interface ICulturalPromptAnalytics {
  totalPrompts: number;
  cacheHitRate: number;
  culturalRulesCount: number;
  averageValidationTime: number;
  complianceRate: number;
}

// Default export
export default CulturalPromptSystem;
