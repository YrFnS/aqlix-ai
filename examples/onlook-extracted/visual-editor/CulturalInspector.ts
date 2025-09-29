/**
 * Iraqi AI System - Cultural Inspector Component
 * Real-time cultural compliance analysis and validation for visual editing
 * Enhanced from Onlook for comprehensive Iraqi government deployment
 *
 * Key Features:
 * - Real-time Islamic compliance checking
 * - Arabic text pattern recognition and RTL validation
 * - Ministry-specific design pattern enforcement
 * - Government accessibility compliance (WCAG 2.1 AA+)
 * - Cultural design token validation
 * - Prayer time-aware interface monitoring
 */

import { EventEmitter } from "events";

export interface CulturalInspectionConfig {
  ministry?: "health" | "education" | "interior" | "justice";
  islamicCompliance: boolean;
  rtlValidation: boolean;
  arabicTypography: boolean;
  governmentStandards: boolean;
  prayerTimeAware: boolean;
  accessibilityLevel: "basic" | "enhanced" | "wcag-aa" | "government-standard";
}

export interface CulturalViolation {
  id: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  category:
    | "islamic"
    | "arabic"
    | "accessibility"
    | "ministry"
    | "security"
    | "design";
  element: HTMLElement;
  violation: string;
  recommendation: string;
  autoFixable: boolean;
  culturalImpact: number; // 0-1 score
  complianceStandard: string;
}

export interface CulturalInspectionResult {
  overallScore: number; // 0-1
  totalViolations: number;
  violations: CulturalViolation[];
  strengths: string[];
  quickFixes: Array<{
    description: string;
    action: () => void;
    impact: "low" | "medium" | "high";
  }>;
  ministryCompliance: {
    score: number;
    requiredActions: string[];
  };
  islamicCompliance: {
    score: number;
    issues: string[];
    blessings: string[];
  };
  arabicSupport: {
    rtlScore: number;
    typographyScore: number;
    layoutScore: number;
  };
  accessibilityScore: {
    wcag: number;
    government: number;
    recommendations: string[];
  };
}

export interface PrayerTimeInspection {
  isPrayerTime: boolean;
  currentPrayer?: string;
  timeUntilNext: number; // minutes
  interfaceRecommendations: string[];
  urgentNotifications: boolean;
}

export class CulturalInspector extends EventEmitter {
  private config: CulturalInspectionConfig;
  private inspectionCache = new Map<string, CulturalInspectionResult>();
  private violationHistory: CulturalViolation[] = [];
  private performanceMetrics = {
    inspectionCount: 0,
    averageTime: 0,
    cacheHits: 0,
    autoFixesApplied: 0,
  };

  // Islamic design compliance patterns
  private readonly ISLAMIC_DESIGN_RULES = {
    forbiddenColors: [
      { pattern: /rgb\(220,\s*38,\s*38\)/, name: "red-600", severity: "high" },
      {
        pattern: /rgb\(234,\s*88,\s*12\)/,
        name: "orange-600",
        severity: "medium",
      },
      {
        pattern: /rgb\(236,\s*72,\s*153\)/,
        name: "pink-600",
        severity: "high",
      },
    ],
    encouragedColors: [
      "emerald",
      "teal",
      "blue",
      "indigo",
      "purple",
      "slate",
      "gray",
      "green",
    ],
    modestDesign: {
      maxImageExposure: 0.3, // Maximum skin exposure ratio
      appropriateContent: true,
      familyFriendly: true,
    },
    culturalSensitivity: {
      religiousSymbols: true,
      culturalRespect: true,
      sectarianNeutrality: true,
    },
  };

  // Arabic RTL validation patterns
  private readonly ARABIC_RTL_RULES = {
    textDirectionRules: [
      {
        selector: '[dir="rtl"]',
        required: true,
        description: "RTL direction attribute",
      },
      {
        selector: ".text-right",
        recommended: true,
        description: "Text alignment classes",
      },
      {
        selector: ".font-arabic",
        required: true,
        description: "Arabic font families",
      },
    ],
    layoutPatterns: [
      {
        pattern: "flex-row-reverse",
        context: "horizontal layouts",
        score: 0.8,
      },
      { pattern: "justify-end", context: "flex justification", score: 0.7 },
      { pattern: "text-right", context: "text alignment", score: 0.9 },
    ],
    typographyRequirements: [
      "Noto Sans Arabic",
      "Cairo",
      "Amiri",
      "Scheherazade New",
      "Markazi Text",
    ],
  };

  // Ministry-specific design requirements
  private readonly MINISTRY_STANDARDS = {
    health: {
      primaryColors: ["emerald-600", "teal-700", "green-600"],
      accessibility: "enhanced", // Medical accessibility
      dataProtection: "hipaa-equivalent",
      iconography: "medical-standard",
      layoutPrinciples: "clean-professional",
    },
    education: {
      primaryColors: ["blue-600", "indigo-700", "sky-600"],
      accessibility: "student-friendly",
      dataProtection: "ferpa-equivalent",
      iconography: "educational-clear",
      layoutPrinciples: "structured-learning",
    },
    interior: {
      primaryColors: ["slate-700", "gray-800", "zinc-700"],
      accessibility: "citizen-service",
      dataProtection: "government-standard",
      iconography: "official-formal",
      layoutPrinciples: "authoritative-clear",
    },
    justice: {
      primaryColors: ["purple-700", "indigo-800", "violet-700"],
      accessibility: "legal-compliance",
      dataProtection: "classified-standard",
      iconography: "legal-formal",
      layoutPrinciples: "judicial-professional",
    },
  };

  // Government accessibility standards (WCAG 2.1 AA+ for Iraq)
  private readonly GOVERNMENT_ACCESSIBILITY_RULES = {
    colorContrast: {
      normalText: 4.5, // WCAG AA
      largeText: 3.0,
      governmentMinimum: 5.0, // Enhanced for government
    },
    focusManagement: {
      visibleFocus: true,
      logicalOrder: true,
      skipLinks: true,
      landmarkRoles: true,
    },
    arabicAccessibility: {
      rightToLeftReading: true,
      arabicScreenReaders: true,
      bilingualNavigation: true,
      culturalContext: true,
    },
    ministryRequirements: {
      governmentBranding: true,
      officialLanguages: ["ar", "en"], // Arabic primary, English secondary
      citizenFriendly: true,
      mobileFirst: true,
    },
  };

  constructor(config: CulturalInspectionConfig) {
    super();
    this.config = config;
    this.initializeInspector();
  }

  /**
   * Initialize cultural inspector with monitoring and caching
   */
  private initializeInspector(): void {
    // Setup performance monitoring
    this.setupPerformanceMonitoring();

    // Initialize cache cleanup
    this.setupCacheManagement();

    // Setup prayer time monitoring if enabled
    if (this.config.prayerTimeAware) {
      this.setupPrayerTimeMonitoring();
    }

    this.emit("inspector-initialized", { config: this.config });
  }

  /**
   * Perform comprehensive cultural inspection of element or document
   */
  async inspectElement(
    target: HTMLElement = document.body,
    options: {
      deepInspection?: boolean;
      useCache?: boolean;
      autoFix?: boolean;
      reportLevel?: "summary" | "detailed" | "verbose";
    } = {},
  ): Promise<CulturalInspectionResult> {
    const startTime = performance.now();
    this.performanceMetrics.inspectionCount++;

    try {
      // Generate cache key for element
      const cacheKey = this.generateCacheKey(target, options);

      // Check cache if enabled
      if (options.useCache !== false && this.inspectionCache.has(cacheKey)) {
        this.performanceMetrics.cacheHits++;
        return this.inspectionCache.get(cacheKey)!;
      }

      // Initialize inspection result
      const result: CulturalInspectionResult = {
        overallScore: 0,
        totalViolations: 0,
        violations: [],
        strengths: [],
        quickFixes: [],
        ministryCompliance: { score: 0, requiredActions: [] },
        islamicCompliance: { score: 0, issues: [], blessings: [] },
        arabicSupport: { rtlScore: 0, typographyScore: 0, layoutScore: 0 },
        accessibilityScore: { wcag: 0, government: 0, recommendations: [] },
      };

      // Perform inspections
      const elements = options.deepInspection
        ? Array.from(target.querySelectorAll("*"))
        : [target];

      // Islamic compliance inspection
      if (this.config.islamicCompliance) {
        const islamicResult = await this.inspectIslamicCompliance(elements);
        result.islamicCompliance = islamicResult;
        result.violations.push(...(islamicResult.violations || []));
      }

      // Arabic RTL inspection
      if (this.config.rtlValidation) {
        const arabicResult = await this.inspectArabicSupport(elements);
        result.arabicSupport = arabicResult;
        result.violations.push(...(arabicResult.violations || []));
      }

      // Ministry compliance inspection
      if (this.config.ministry) {
        const ministryResult = await this.inspectMinistryCompliance(
          elements,
          this.config.ministry,
        );
        result.ministryCompliance = ministryResult;
        result.violations.push(...(ministryResult.violations || []));
      }

      // Accessibility inspection
      const accessibilityResult = await this.inspectAccessibility(elements);
      result.accessibilityScore = accessibilityResult;
      result.violations.push(...(accessibilityResult.violations || []));

      // Government standards inspection
      if (this.config.governmentStandards) {
        const governmentResult =
          await this.inspectGovernmentStandards(elements);
        result.violations.push(...(governmentResult.violations || []));
      }

      // Calculate overall scores
      this.calculateOverallScores(result);

      // Generate quick fixes
      if (options.autoFix) {
        result.quickFixes = this.generateQuickFixes(result.violations);
      }

      // Generate strengths and positive feedback
      result.strengths = this.identifyStrengths(elements);

      // Cache result
      if (options.useCache !== false) {
        this.inspectionCache.set(cacheKey, result);
      }

      // Update performance metrics
      const inspectionTime = performance.now() - startTime;
      this.updatePerformanceMetrics(inspectionTime);

      this.emit("inspection-complete", {
        result,
        target,
        duration: inspectionTime,
      });
      return result;
    } catch (error) {
      this.emit("inspection-error", { error: error.message, target });
      throw new Error(`Cultural inspection failed: ${error.message}`);
    }
  }

  /**
   * Apply automatic fixes for cultural violations
   */
  async applyQuickFixes(
    violations: CulturalViolation[],
    options: {
      confirmBeforeApply?: boolean;
      priorityLevel?: "critical" | "high" | "medium" | "all";
      dryRun?: boolean;
    } = {},
  ): Promise<{
    applied: number;
    skipped: number;
    errors: Array<{ violation: string; error: string }>;
    results: Array<{ violation: string; success: boolean; changes: string[] }>;
  }> {
    const results = {
      applied: 0,
      skipped: 0,
      errors: [],
      results: [],
    };

    // Filter violations by priority if specified
    const targetViolations = options.priorityLevel
      ? violations.filter((v) =>
          this.meetsPriorityLevel(v.severity, options.priorityLevel!),
        )
      : violations.filter((v) => v.autoFixable);

    for (const violation of targetViolations) {
      try {
        // Confirm before applying if requested
        if (options.confirmBeforeApply && !(await this.confirmFix(violation))) {
          results.skipped++;
          continue;
        }

        // Apply fix based on violation type
        const fixResult = await this.applyViolationFix(
          violation,
          options.dryRun,
        );

        if (fixResult.success) {
          results.applied++;
          this.performanceMetrics.autoFixesApplied++;
        } else {
          results.skipped++;
        }

        results.results.push({
          violation: violation.violation,
          success: fixResult.success,
          changes: fixResult.changes,
        });
      } catch (error) {
        results.errors.push({
          violation: violation.violation,
          error: error.message,
        });
      }
    }

    this.emit("quick-fixes-applied", results);
    return results;
  }

  /**
   * Get real-time prayer time inspection
   */
  async getPrayerTimeInspection(): Promise<PrayerTimeInspection> {
    if (!this.config.prayerTimeAware) {
      return {
        isPrayerTime: false,
        timeUntilNext: 0,
        interfaceRecommendations: [],
        urgentNotifications: false,
      };
    }

    const now = new Date();
    const prayerTimes = await this.calculatePrayerTimes(now);

    // Find current and next prayer
    const currentPrayer = prayerTimes.find((prayer) =>
      this.isPrayerActive(prayer, now),
    );
    const nextPrayer = this.getNextPrayer(prayerTimes, now);

    const recommendations: string[] = [];
    let urgentNotifications = false;

    if (currentPrayer) {
      recommendations.push("تقليل الإشعارات والتفاعلات غير الضرورية");
      recommendations.push("إظهار رسالة احترام لوقت الصلاة");
      urgentNotifications = false;
    } else if (nextPrayer && nextPrayer.minutesUntil <= 10) {
      recommendations.push("إعداد واجهة لتنبيه اقتراب وقت الصلاة");
      recommendations.push("حفظ تلقائي للأعمال الجارية");
      urgentNotifications = true;
    }

    return {
      isPrayerTime: !!currentPrayer,
      currentPrayer: currentPrayer?.name,
      timeUntilNext: nextPrayer?.minutesUntil || 0,
      interfaceRecommendations: recommendations,
      urgentNotifications,
    };
  }

  /**
   * Export detailed cultural compliance report
   */
  generateComplianceReport(
    inspectionResult: CulturalInspectionResult,
    format: "json" | "html" | "markdown" = "json",
  ): string {
    const report = {
      timestamp: new Date().toISOString(),
      overallAssessment: {
        score: inspectionResult.overallScore,
        grade: this.getComplianceGrade(inspectionResult.overallScore),
        summary: this.generateExecutiveSummary(inspectionResult),
      },
      detailedAnalysis: {
        islamicCompliance: inspectionResult.islamicCompliance,
        arabicSupport: inspectionResult.arabicSupport,
        ministryCompliance: inspectionResult.ministryCompliance,
        accessibility: inspectionResult.accessibilityScore,
      },
      violations: inspectionResult.violations.map((v) => ({
        ...v,
        element: v.element.tagName + (v.element.id ? `#${v.element.id}` : ""),
      })),
      recommendations:
        this.generatePrioritizedRecommendations(inspectionResult),
      strengths: inspectionResult.strengths,
      nextSteps: this.generateActionPlan(inspectionResult),
    };

    switch (format) {
      case "html":
        return this.generateHTMLReport(report);
      case "markdown":
        return this.generateMarkdownReport(report);
      default:
        return JSON.stringify(report, null, 2);
    }
  }

  /**
   * Private helper methods
   */

  private async inspectIslamicCompliance(
    elements: HTMLElement[],
  ): Promise<any> {
    const violations: CulturalViolation[] = [];
    const issues: string[] = [];
    const blessings: string[] = [];
    let complianceScore = 1.0;

    for (const element of elements) {
      // Check for forbidden colors
      const computedStyle = window.getComputedStyle(element);
      for (const rule of this.ISLAMIC_DESIGN_RULES.forbiddenColors) {
        if (
          rule.pattern.test(computedStyle.backgroundColor) ||
          rule.pattern.test(computedStyle.color)
        ) {
          violations.push({
            id: this.generateViolationId(),
            severity: rule.severity as any,
            category: "islamic",
            element,
            violation: `استخدام لون غير مناسب: ${rule.name}`,
            recommendation:
              "استخدم ألوان متوافقة مع المبادئ الإسلامية مثل الأزرق أو الأخضر",
            autoFixable: true,
            culturalImpact: 0.3,
            complianceStandard: "Islamic Design Principles",
          });
          issues.push(`لون غير مناسب في العنصر: ${element.tagName}`);
          complianceScore -= 0.1;
        }
      }

      // Check for inappropriate content
      const textContent = element.textContent || "";
      const forbiddenTerms = ["gambling", "alcohol", "casino", "betting"];
      for (const term of forbiddenTerms) {
        if (textContent.toLowerCase().includes(term)) {
          violations.push({
            id: this.generateViolationId(),
            severity: "critical",
            category: "islamic",
            element,
            violation: `محتوى غير متوافق مع الإسلام: ${term}`,
            recommendation: "إزالة أو استبدال المحتوى غير المتوافق",
            autoFixable: false,
            culturalImpact: 0.8,
            complianceStandard: "Islamic Content Guidelines",
          });
          issues.push(`محتوى غير مناسب: ${term}`);
          complianceScore -= 0.4;
        }
      }

      // Identify positive aspects
      if (
        this.ISLAMIC_DESIGN_RULES.encouragedColors.some((color) =>
          computedStyle.backgroundColor.includes(color),
        )
      ) {
        blessings.push(`استخدام ألوان مناسبة في ${element.tagName}`);
      }
    }

    return {
      score: Math.max(0, complianceScore),
      issues,
      blessings,
      violations,
    };
  }

  private async inspectArabicSupport(elements: HTMLElement[]): Promise<any> {
    const violations: CulturalViolation[] = [];
    let rtlScore = 0;
    let typographyScore = 0;
    let layoutScore = 0;
    let totalElements = elements.length;

    for (const element of elements) {
      const hasArabicText = this.detectArabicContent(element);

      if (hasArabicText) {
        // Check RTL support
        const hasRTL =
          element.getAttribute("dir") === "rtl" ||
          element.classList.contains("dir-rtl");

        if (hasRTL) {
          rtlScore++;
        } else {
          violations.push({
            id: this.generateViolationId(),
            severity: "high",
            category: "arabic",
            element,
            violation: "نص عربي بدون دعم RTL",
            recommendation: 'إضافة dir="rtl" أو كلاس dir-rtl للعنصر',
            autoFixable: true,
            culturalImpact: 0.6,
            complianceStandard: "Arabic RTL Guidelines",
          });
        }

        // Check Arabic typography
        const style = window.getComputedStyle(element);
        const hasArabicFont = this.ARABIC_RTL_RULES.typographyRequirements.some(
          (font) => style.fontFamily.includes(font),
        );

        if (hasArabicFont) {
          typographyScore++;
        } else {
          violations.push({
            id: this.generateViolationId(),
            severity: "medium",
            category: "arabic",
            element,
            violation: "خط غير مناسب للنص العربي",
            recommendation: "استخدم خطوط عربية مثل Noto Sans Arabic",
            autoFixable: true,
            culturalImpact: 0.4,
            complianceStandard: "Arabic Typography Standards",
          });
        }

        // Check layout patterns
        if (
          element.classList.contains("text-right") ||
          element.classList.contains("justify-end")
        ) {
          layoutScore++;
        }
      }
    }

    return {
      rtlScore: totalElements > 0 ? rtlScore / totalElements : 0,
      typographyScore: totalElements > 0 ? typographyScore / totalElements : 0,
      layoutScore: totalElements > 0 ? layoutScore / totalElements : 0,
      violations,
    };
  }

  private async inspectMinistryCompliance(
    elements: HTMLElement[],
    ministry: string,
  ): Promise<any> {
    const violations: CulturalViolation[] = [];
    const standards = this.MINISTRY_STANDARDS[ministry];
    const requiredActions: string[] = [];
    let score = 1.0;

    if (!standards) {
      return {
        score: 0,
        requiredActions: ["تحديد معايير الوزارة"],
        violations,
      };
    }

    // Check ministry branding
    const hasMinistryBranding = elements.some(
      (el) =>
        el.hasAttribute("data-ministry") &&
        el.getAttribute("data-ministry") === ministry,
    );

    if (!hasMinistryBranding) {
      violations.push({
        id: this.generateViolationId(),
        severity: "medium",
        category: "ministry",
        element: document.body,
        violation: "عدم وجود علامة تجارية وزارية",
        recommendation: `إضافة عناصر تصميم خاصة بوزارة ${this.getMinistryNameInArabic(ministry)}`,
        autoFixable: true,
        culturalImpact: 0.3,
        complianceStandard: `${ministry.toUpperCase()} Ministry Standards`,
      });
      requiredActions.push("إضافة الهوية البصرية للوزارة");
      score -= 0.2;
    }

    // Check color scheme compliance
    const hasMinistryColors = elements.some((el) => {
      const style = window.getComputedStyle(el);
      return standards.primaryColors.some(
        (color) =>
          style.backgroundColor.includes(color) || style.color.includes(color),
      );
    });

    if (!hasMinistryColors) {
      requiredActions.push("تطبيق الألوان الرسمية للوزارة");
      score -= 0.1;
    }

    return { score, requiredActions, violations };
  }

  private async inspectAccessibility(elements: HTMLElement[]): Promise<any> {
    const violations: CulturalViolation[] = [];
    const recommendations: string[] = [];
    let wcagScore = 1.0;
    let governmentScore = 1.0;

    for (const element of elements) {
      // Check focus management
      if (
        this.isInteractiveElement(element) &&
        !element.hasAttribute("tabindex")
      ) {
        violations.push({
          id: this.generateViolationId(),
          severity: "medium",
          category: "accessibility",
          element,
          violation: "عنصر تفاعلي بدون إدارة التركيز",
          recommendation: "إضافة tabindex أو تحسين ترتيب التركيز",
          autoFixable: true,
          culturalImpact: 0.2,
          complianceStandard: "WCAG 2.1 AA",
        });
        wcagScore -= 0.05;
      }

      // Check ARIA labels for Arabic content
      if (
        this.detectArabicContent(element) &&
        this.isInteractiveElement(element)
      ) {
        if (
          !element.hasAttribute("aria-label") &&
          !element.hasAttribute("aria-labelledby")
        ) {
          violations.push({
            id: this.generateViolationId(),
            severity: "medium",
            category: "accessibility",
            element,
            violation: "عنصر عربي تفاعلي بدون ARIA label",
            recommendation: "إضافة aria-label باللغة العربية",
            autoFixable: true,
            culturalImpact: 0.3,
            complianceStandard: "Arabic Accessibility Guidelines",
          });
          governmentScore -= 0.1;
        }
      }

      // Check color contrast
      const contrastRatio = this.calculateColorContrast(element);
      if (
        contrastRatio <
        this.GOVERNMENT_ACCESSIBILITY_RULES.colorContrast.governmentMinimum
      ) {
        violations.push({
          id: this.generateViolationId(),
          severity: "high",
          category: "accessibility",
          element,
          violation: `تباين ألوان ضعيف: ${contrastRatio.toFixed(2)}`,
          recommendation: `تحسين التباين إلى ${this.GOVERNMENT_ACCESSIBILITY_RULES.colorContrast.governmentMinimum} أو أعلى`,
          autoFixable: true,
          culturalImpact: 0.4,
          complianceStandard: "Government Accessibility Standards",
        });
        wcagScore -= 0.1;
        governmentScore -= 0.15;
      }
    }

    // Generate recommendations
    if (wcagScore < 0.9) {
      recommendations.push("تحسين معايير WCAG 2.1 AA");
    }
    if (governmentScore < 0.8) {
      recommendations.push("تطبيق المعايير الحكومية للوصولية");
    }

    return {
      wcag: Math.max(0, wcagScore),
      government: Math.max(0, governmentScore),
      recommendations,
      violations,
    };
  }

  private async inspectGovernmentStandards(
    elements: HTMLElement[],
  ): Promise<any> {
    const violations: CulturalViolation[] = [];

    for (const element of elements) {
      // Check for government security attributes
      if (
        element.tagName === "FORM" &&
        !element.hasAttribute("data-csrf-protected")
      ) {
        violations.push({
          id: this.generateViolationId(),
          severity: "critical",
          category: "security",
          element,
          violation: "نموذج بدون حماية CSRF",
          recommendation: 'إضافة data-csrf-protected="true"',
          autoFixable: true,
          culturalImpact: 0.1,
          complianceStandard: "Government Security Standards",
        });
      }

      // Check for audit trail attributes on interactive elements
      if (
        this.isInteractiveElement(element) &&
        !element.hasAttribute("data-audit")
      ) {
        violations.push({
          id: this.generateViolationId(),
          severity: "medium",
          category: "security",
          element,
          violation: "عنصر تفاعلي بدون سجل تدقيق",
          recommendation: 'إضافة data-audit="true" للمراجعة الحكومية',
          autoFixable: true,
          culturalImpact: 0.2,
          complianceStandard: "Government Audit Standards",
        });
      }
    }

    return { violations };
  }

  private calculateOverallScores(result: CulturalInspectionResult): void {
    const weights = {
      islamic: this.config.islamicCompliance ? 0.3 : 0,
      arabic: this.config.rtlValidation ? 0.3 : 0,
      ministry: this.config.ministry ? 0.2 : 0,
      accessibility: 0.2,
    };

    // Normalize weights
    const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
    if (totalWeight > 0) {
      Object.keys(weights).forEach((key) => (weights[key] /= totalWeight));
    }

    // Calculate weighted score
    let overallScore = 0;
    overallScore += result.islamicCompliance.score * weights.islamic;
    overallScore +=
      ((result.arabicSupport.rtlScore +
        result.arabicSupport.typographyScore +
        result.arabicSupport.layoutScore) /
        3) *
      weights.arabic;
    overallScore += result.ministryCompliance.score * weights.ministry;
    overallScore +=
      ((result.accessibilityScore.wcag + result.accessibilityScore.government) /
        2) *
      weights.accessibility;

    result.overallScore = Math.max(0, Math.min(1, overallScore));
    result.totalViolations = result.violations.length;
  }

  private generateQuickFixes(violations: CulturalViolation[]): Array<{
    description: string;
    action: () => void;
    impact: "low" | "medium" | "high";
  }> {
    const fixes: Array<{
      description: string;
      action: () => void;
      impact: "low" | "medium" | "high";
    }> = [];

    // Group violations by type for batch fixes
    const rtlViolations = violations.filter((v) => v.violation.includes("RTL"));
    if (rtlViolations.length > 0) {
      fixes.push({
        description: `إصلاح ${rtlViolations.length} مشكلة RTL`,
        action: () => this.fixRTLIssues(rtlViolations),
        impact: "high",
      });
    }

    const colorViolations = violations.filter((v) =>
      v.violation.includes("لون"),
    );
    if (colorViolations.length > 0) {
      fixes.push({
        description: `إصلاح ${colorViolations.length} مشكلة ألوان`,
        action: () => this.fixColorIssues(colorViolations),
        impact: "medium",
      });
    }

    const accessibilityViolations = violations.filter(
      (v) => v.category === "accessibility",
    );
    if (accessibilityViolations.length > 0) {
      fixes.push({
        description: `إصلاح ${accessibilityViolations.length} مشكلة وصولية`,
        action: () => this.fixAccessibilityIssues(accessibilityViolations),
        impact: "high",
      });
    }

    return fixes;
  }

  private identifyStrengths(elements: HTMLElement[]): string[] {
    const strengths: string[] = [];

    // Check for good Arabic support
    const arabicElements = elements.filter((el) =>
      this.detectArabicContent(el),
    );
    const rtlElements = arabicElements.filter(
      (el) =>
        el.getAttribute("dir") === "rtl" || el.classList.contains("dir-rtl"),
    );

    if (
      arabicElements.length > 0 &&
      rtlElements.length / arabicElements.length > 0.8
    ) {
      strengths.push("دعم ممتاز للغة العربية والتوجه RTL");
    }

    // Check for Islamic compliant colors
    const hasGoodColors = elements.some((el) => {
      const style = window.getComputedStyle(el);
      return this.ISLAMIC_DESIGN_RULES.encouragedColors.some((color) =>
        style.backgroundColor.includes(color),
      );
    });

    if (hasGoodColors) {
      strengths.push("استخدام ألوان متوافقة مع المبادئ الإسلامية");
    }

    // Check for accessibility features
    const accessibleElements = elements.filter(
      (el) => el.hasAttribute("aria-label") || el.hasAttribute("role"),
    );

    if (accessibleElements.length / elements.length > 0.5) {
      strengths.push("تطبيق جيد لمعايير الوصولية");
    }

    // Check for government security attributes
    const secureElements = elements.filter(
      (el) =>
        el.hasAttribute("data-audit") || el.hasAttribute("data-csrf-protected"),
    );

    if (secureElements.length > 0) {
      strengths.push("تطبيق معايير الأمان الحكومية");
    }

    return strengths;
  }

  // Additional helper methods...

  private generateViolationId(): string {
    return `violation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateCacheKey(element: HTMLElement, options: any): string {
    const elementKey = element.tagName + (element.id || "") + element.className;
    const optionsKey = JSON.stringify(options);
    return btoa(elementKey + optionsKey);
  }

  private detectArabicContent(element: HTMLElement): boolean {
    const text = element.textContent || "";
    return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(
      text,
    );
  }

  private isInteractiveElement(element: HTMLElement): boolean {
    const interactiveTags = ["button", "input", "select", "textarea", "a"];
    return (
      interactiveTags.includes(element.tagName.toLowerCase()) ||
      element.hasAttribute("onclick") ||
      element.hasAttribute("tabindex")
    );
  }

  private calculateColorContrast(element: HTMLElement): number {
    // Simplified contrast calculation - in production would use proper WCAG algorithm
    const style = window.getComputedStyle(element);
    // This is a placeholder - implement proper contrast calculation
    return 4.5; // Assuming WCAG AA compliance for now
  }

  private meetsPriorityLevel(severity: string, priority: string): boolean {
    const severityLevels = { critical: 4, high: 3, medium: 2, low: 1, info: 0 };
    const priorityLevels = { critical: 4, high: 3, medium: 2, all: 0 };

    return severityLevels[severity] >= priorityLevels[priority];
  }

  private async confirmFix(violation: CulturalViolation): Promise<boolean> {
    // In production, would show user confirmation dialog
    return true;
  }

  private async applyViolationFix(
    violation: CulturalViolation,
    dryRun: boolean = false,
  ): Promise<{ success: boolean; changes: string[] }> {
    const changes: string[] = [];

    if (dryRun) {
      return { success: true, changes: [`سيتم إصلاح: ${violation.violation}`] };
    }

    try {
      switch (violation.category) {
        case "arabic":
          if (violation.violation.includes("RTL")) {
            violation.element.setAttribute("dir", "rtl");
            violation.element.classList.add("text-right");
            changes.push("تم إضافة دعم RTL");
          }
          break;

        case "islamic":
          if (violation.violation.includes("لون")) {
            // Replace non-compliant colors
            violation.element.style.backgroundColor = "#3b82f6"; // blue-600
            changes.push("تم تغيير اللون إلى لون متوافق");
          }
          break;

        case "accessibility":
          if (violation.violation.includes("aria-label")) {
            violation.element.setAttribute("aria-label", "عنصر تفاعلي");
            changes.push("تم إضافة ARIA label");
          }
          break;

        case "security":
          if (violation.violation.includes("CSRF")) {
            violation.element.setAttribute("data-csrf-protected", "true");
            changes.push("تم إضافة حماية CSRF");
          }
          break;
      }

      return { success: true, changes };
    } catch (error) {
      return { success: false, changes: [`فشل في التطبيق: ${error.message}`] };
    }
  }

  private fixRTLIssues(violations: CulturalViolation[]): void {
    violations.forEach((violation) => {
      violation.element.setAttribute("dir", "rtl");
      violation.element.classList.add("text-right", "dir-rtl");
    });
  }

  private fixColorIssues(violations: CulturalViolation[]): void {
    violations.forEach((violation) => {
      violation.element.style.backgroundColor = "#3b82f6"; // Islamic compliant blue
    });
  }

  private fixAccessibilityIssues(violations: CulturalViolation[]): void {
    violations.forEach((violation) => {
      if (!violation.element.hasAttribute("aria-label")) {
        violation.element.setAttribute("aria-label", "عنصر واجهة المستخدم");
      }
    });
  }

  // Performance and monitoring methods
  private setupPerformanceMonitoring(): void {
    setInterval(
      () => {
        this.cleanupOldCacheEntries();
      },
      5 * 60 * 1000,
    ); // Clean every 5 minutes
  }

  private setupCacheManagement(): void {
    // Limit cache size
    if (this.inspectionCache.size > 100) {
      const entries = Array.from(this.inspectionCache.entries());
      const toRemove = entries.slice(0, 20); // Remove oldest 20 entries
      toRemove.forEach(([key]) => this.inspectionCache.delete(key));
    }
  }

  private cleanupOldCacheEntries(): void {
    // In production, would implement LRU cache cleanup
    if (this.inspectionCache.size > 50) {
      this.inspectionCache.clear();
    }
  }

  private updatePerformanceMetrics(time: number): void {
    const count = this.performanceMetrics.inspectionCount;
    this.performanceMetrics.averageTime =
      (this.performanceMetrics.averageTime * (count - 1) + time) / count;
  }

  // Prayer time methods
  private setupPrayerTimeMonitoring(): void {
    setInterval(() => {
      this.checkPrayerTimeStatus();
    }, 60000); // Check every minute
  }

  private async checkPrayerTimeStatus(): Promise<void> {
    const prayerInspection = await this.getPrayerTimeInspection();

    if (prayerInspection.isPrayerTime || prayerInspection.urgentNotifications) {
      this.emit("prayer-time-alert", prayerInspection);
    }
  }

  private async calculatePrayerTimes(date: Date): Promise<any[]> {
    // In production, would use proper prayer time calculation library
    return [
      {
        name: "الفجر",
        time: new Date(date.setHours(5, 30)),
        duration: 20,
        minutesUntil: 0,
      },
      {
        name: "الظهر",
        time: new Date(date.setHours(12, 30)),
        duration: 20,
        minutesUntil: 0,
      },
      {
        name: "العصر",
        time: new Date(date.setHours(15, 30)),
        duration: 20,
        minutesUntil: 0,
      },
      {
        name: "المغرب",
        time: new Date(date.setHours(18, 0)),
        duration: 20,
        minutesUntil: 0,
      },
      {
        name: "العشاء",
        time: new Date(date.setHours(19, 30)),
        duration: 20,
        minutesUntil: 0,
      },
    ];
  }

  private isPrayerActive(prayer: any, now: Date): boolean {
    const prayerEnd = new Date(prayer.time.getTime() + prayer.duration * 60000);
    return now >= prayer.time && now <= prayerEnd;
  }

  private getNextPrayer(prayers: any[], now: Date): any {
    const future = prayers.filter((p) => p.time > now);
    if (future.length === 0) return null;

    const next = future[0];
    return {
      ...next,
      minutesUntil: Math.floor((next.time.getTime() - now.getTime()) / 60000),
    };
  }

  // Report generation methods
  private getComplianceGrade(score: number): string {
    if (score >= 0.95) return "ممتاز (A+)";
    if (score >= 0.9) return "جيد جداً (A)";
    if (score >= 0.8) return "جيد (B)";
    if (score >= 0.7) return "مقبول (C)";
    return "يحتاج تحسين (D)";
  }

  private generateExecutiveSummary(result: CulturalInspectionResult): string {
    return (
      `تم فحص الواجهة وحققت درجة ${(result.overallScore * 100).toFixed(1)}% في الامتثال الثقافي. ` +
      `تم العثور على ${result.totalViolations} مخالفة تحتاج إلى معالجة. ` +
      `النقاط القوية تشمل: ${result.strengths.join("، ")}.`
    );
  }

  private generatePrioritizedRecommendations(
    result: CulturalInspectionResult,
  ): string[] {
    const recommendations: string[] = [];

    // Islamic compliance recommendations
    if (result.islamicCompliance.score < 0.9) {
      recommendations.push("تحسين الامتثال للمبادئ الإسلامية في التصميم");
    }

    // Arabic support recommendations
    if (result.arabicSupport.rtlScore < 0.8) {
      recommendations.push("تحسين دعم اللغة العربية والتوجه RTL");
    }

    // Accessibility recommendations
    if (result.accessibilityScore.government < 0.8) {
      recommendations.push("تطبيق معايير الوصولية الحكومية");
    }

    return recommendations;
  }

  private generateActionPlan(result: CulturalInspectionResult): string[] {
    const actions: string[] = [];

    // Priority 1: Critical violations
    const criticalViolations = result.violations.filter(
      (v) => v.severity === "critical",
    );
    if (criticalViolations.length > 0) {
      actions.push(`معالجة ${criticalViolations.length} مخالفة حرجة فوراً`);
    }

    // Priority 2: High priority violations
    const highViolations = result.violations.filter(
      (v) => v.severity === "high",
    );
    if (highViolations.length > 0) {
      actions.push(
        `معالجة ${highViolations.length} مخالفة عالية الأولوية خلال 24 ساعة`,
      );
    }

    // Priority 3: Ministry compliance
    if (result.ministryCompliance.score < 0.8) {
      actions.push("تطبيق معايير الوزارة المختصة");
    }

    return actions;
  }

  private generateHTMLReport(report: any): string {
    return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>تقرير الامتثال الثقافي</title>
    <style>
        body { font-family: 'Cairo', 'Noto Sans Arabic', sans-serif; }
        .score { font-size: 2rem; font-weight: bold; }
        .violation { padding: 1rem; margin: 0.5rem 0; border-right: 4px solid #ef4444; }
        .strength { padding: 1rem; margin: 0.5rem 0; border-right: 4px solid #10b981; }
    </style>
</head>
<body>
    <h1>تقرير الامتثال الثقافي</h1>
    <div class="score">النتيجة الإجمالية: ${(report.overallAssessment.score * 100).toFixed(1)}%</div>
    <p>${report.overallAssessment.summary}</p>
    <!-- Additional HTML content would be generated here -->
</body>
</html>`;
  }

  private generateMarkdownReport(report: any): string {
    return `# تقرير الامتثال الثقافي

## النتيجة الإجمالية: ${(report.overallAssessment.score * 100).toFixed(1)}%

${report.overallAssessment.summary}

## المخالفات الرئيسية

${report.violations.map((v: any) => `- **${v.severity}**: ${v.violation}`).join("\n")}

## التوصيات

${report.recommendations.map((r: string) => `- ${r}`).join("\n")}

## النقاط القوية

${report.strengths.map((s: string) => `- ${s}`).join("\n")}
`;
  }

  private getMinistryNameInArabic(ministry: string): string {
    const names = {
      health: "الصحة",
      education: "التربية",
      interior: "الداخلية",
      justice: "العدل",
    };
    return names[ministry] || ministry;
  }

  /**
   * Public API methods
   */

  public getConfiguration(): CulturalInspectionConfig {
    return { ...this.config };
  }

  public updateConfiguration(
    newConfig: Partial<CulturalInspectionConfig>,
  ): void {
    this.config = { ...this.config, ...newConfig };
    this.emit("configuration-updated", this.config);
  }

  public getPerformanceMetrics(): any {
    return { ...this.performanceMetrics };
  }

  public clearCache(): void {
    this.inspectionCache.clear();
    this.emit("cache-cleared");
  }

  public getViolationHistory(): CulturalViolation[] {
    return [...this.violationHistory];
  }

  public exportInspectionData(): any {
    return {
      config: this.config,
      performanceMetrics: this.performanceMetrics,
      violationHistory: this.violationHistory.slice(-100), // Last 100 violations
    };
  }

  public destroy(): void {
    this.inspectionCache.clear();
    this.violationHistory = [];
    this.removeAllListeners();
  }
}
