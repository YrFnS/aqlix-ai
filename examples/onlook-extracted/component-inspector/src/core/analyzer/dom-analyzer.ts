import { Logger } from "../../utils/logger";
import type {
  ComponentInspectorConfig,
  DOMElementInfo,
  AccessibilityViolation,
  RTLMetrics,
  PatternMatch,
} from "../../types";

/**
 * DOMAnalyzer - Advanced DOM analysis with Iraqi cultural intelligence
 *
 * Provides comprehensive DOM analysis including:
 * - RTL layout validation
 * - Arabic content accessibility
 * - Government form pattern recognition
 * - Islamic compliance checking
 * - Performance optimization for Arabic text
 */
export class DOMAnalyzer {
  private logger: Logger;

  constructor(private config: ComponentInspectorConfig) {
    this.logger = new Logger("DOMAnalyzer", config);
  }

  /**
   * Analyze DOM structure for cultural compliance
   */
  async analyzeCulturalCompliance(dom: DOMElementInfo): Promise<{
    score: number;
    rtlCompliance: number;
    arabicSupport: number;
    violations: any[];
    recommendations: string[];
  }> {
    this.logger.info("Analyzing DOM cultural compliance");

    let score = 100;
    let rtlCompliance = 100;
    let arabicSupport = 100;
    const violations: any[] = [];
    const recommendations: string[] = [];

    // Analyze root element and traverse children
    const analysis = this.analyzeElement(dom, true);

    // Check RTL support
    if (!this.hasRTLSupport(dom)) {
      rtlCompliance = 60;
      score = Math.min(score, 70);
      violations.push({
        type: "missing-rtl-support",
        severity: "medium",
        description: "Component lacks proper RTL text direction support",
        element: dom.tagName,
        recommendation: 'Add dir="rtl" attribute or CSS direction property',
      });
      recommendations.push("Implement RTL text direction support");
    }

    // Check Arabic font support
    if (!this.hasArabicFontSupport(dom)) {
      arabicSupport = 50;
      score = Math.min(score, 60);
      violations.push({
        type: "missing-arabic-fonts",
        severity: "high",
        description: "Component may not render Arabic text properly",
        element: dom.tagName,
        recommendation: "Add Arabic font family to CSS",
      });
      recommendations.push("Configure Arabic-compatible fonts");
    }

    // Check for cultural metadata
    if (!this.hasCulturalMetadata(dom)) {
      score = Math.min(score, 80);
      violations.push({
        type: "missing-cultural-metadata",
        severity: "low",
        description: "Component lacks cultural context metadata",
        element: dom.tagName,
        recommendation: "Add lang and dir attributes",
      });
      recommendations.push("Add cultural context metadata");
    }

    // Recursive analysis for children
    for (const child of dom.children) {
      const childAnalysis = await this.analyzeCulturalCompliance(child);
      score = Math.min(score, childAnalysis.score);
      violations.push(...childAnalysis.violations);
      recommendations.push(...childAnalysis.recommendations);
    }

    this.logger.info("Cultural compliance analysis completed", {
      score,
      violations: violations.length,
      recommendations: recommendations.length,
    });

    return {
      score,
      rtlCompliance,
      arabicSupport,
      violations: this.deduplicateViolations(violations),
      recommendations: this.deduplicateRecommendations(recommendations),
    };
  }

  /**
   * Analyze accessibility compliance with Iraqi government standards
   */
  async analyzeAccessibility(dom: DOMElementInfo): Promise<{
    score: number;
    wcagCompliance: number;
    rtlAccessibility: number;
    violations: AccessibilityViolation[];
    governmentCompliance: number;
  }> {
    this.logger.info("Analyzing DOM accessibility");

    const violations: AccessibilityViolation[] = [];
    let wcagScore = 100;
    let rtlScore = 100;
    let governmentScore = 100;

    // Check WCAG compliance
    const wcagViolations = this.checkWCAGCompliance(dom);
    violations.push(...wcagViolations);
    wcagScore = Math.max(0, 100 - wcagViolations.length * 10);

    // Check RTL accessibility
    const rtlViolations = this.checkRTLAccessibility(dom);
    violations.push(...rtlViolations);
    rtlScore = Math.max(0, 100 - rtlViolations.length * 15);

    // Check government accessibility standards
    const govViolations = this.checkGovernmentAccessibility(dom);
    violations.push(...govViolations);
    governmentScore = Math.max(0, 100 - govViolations.length * 12);

    const overallScore = Math.min(wcagScore, rtlScore, governmentScore);

    this.logger.info("Accessibility analysis completed", {
      score: overallScore,
      violations: violations.length,
    });

    return {
      score: overallScore,
      wcagCompliance: wcagScore,
      rtlAccessibility: rtlScore,
      violations,
      governmentCompliance: governmentScore,
    };
  }

  /**
   * Analyze performance implications of DOM structure
   */
  async analyzePerformance(dom: DOMElementInfo): Promise<{
    score: number;
    rtlMetrics: RTLMetrics;
    arabicFontMetrics: any;
    optimizations: any[];
  }> {
    this.logger.info("Analyzing DOM performance");

    let performanceScore = 100;
    const optimizations: any[] = [];

    // Calculate DOM complexity
    const complexity = this.calculateComplexity(dom);
    if (complexity > 100) {
      performanceScore -= Math.min(30, (complexity - 100) * 0.3);
      optimizations.push({
        type: "reduce-dom-complexity",
        description: "High DOM complexity may impact performance",
        impact: Math.min(30, (complexity - 100) * 0.3),
      });
    }

    // Analyze RTL performance impact
    const rtlMetrics = this.calculateRTLMetrics(dom);
    if (rtlMetrics.performanceImpact > 20) {
      performanceScore -= rtlMetrics.performanceImpact;
      optimizations.push({
        type: "optimize-rtl-rendering",
        description: "RTL text rendering causing performance impact",
        impact: rtlMetrics.performanceImpact,
      });
    }

    // Analyze Arabic font metrics
    const arabicFontMetrics = this.calculateArabicFontMetrics(dom);
    if (arabicFontMetrics.loadTime > 1000) {
      performanceScore -= 15;
      optimizations.push({
        type: "optimize-arabic-fonts",
        description: "Arabic font loading time is high",
        impact: 15,
      });
    }

    this.logger.info("Performance analysis completed", {
      score: performanceScore,
      optimizations: optimizations.length,
    });

    return {
      score: Math.max(0, performanceScore),
      rtlMetrics,
      arabicFontMetrics,
      optimizations,
    };
  }

  /**
   * Detect Iraqi government patterns in DOM structure
   */
  async detectGovernmentPatterns(dom: DOMElementInfo): Promise<PatternMatch[]> {
    this.logger.info("Detecting government patterns in DOM");

    const patterns: PatternMatch[] = [];

    // Check for government form patterns
    if (this.isGovernmentForm(dom)) {
      patterns.push({
        id: `gov-form-${Date.now()}`,
        name: "Government Service Form",
        type: "government-form",
        confidence: 85,
        compliance: this.calculateFormCompliance(dom),
        location: { file: "dom", line: 0, column: 0 },
        suggestions: this.getFormSuggestions(dom),
        culturalRelevance: 95,
      });
    }

    // Check for ministry header patterns
    if (this.isMinistryHeader(dom)) {
      patterns.push({
        id: `ministry-header-${Date.now()}`,
        name: "Ministry Header Component",
        type: "ministry-header",
        confidence: 90,
        compliance: this.calculateHeaderCompliance(dom),
        location: { file: "dom", line: 0, column: 0 },
        suggestions: this.getHeaderSuggestions(dom),
        culturalRelevance: 100,
      });
    }

    // Check for prayer time notice patterns
    if (this.isPrayerTimeNotice(dom)) {
      patterns.push({
        id: `prayer-notice-${Date.now()}`,
        name: "Prayer Time Notice",
        type: "prayer-notice",
        confidence: 95,
        compliance: 100,
        location: { file: "dom", line: 0, column: 0 },
        suggestions: ["Ensure prayer times are accurate for Iraqi time zones"],
        culturalRelevance: 100,
      });
    }

    // Recursively check children
    for (const child of dom.children) {
      const childPatterns = await this.detectGovernmentPatterns(child);
      patterns.push(...childPatterns);
    }

    this.logger.info("Government pattern detection completed", {
      patterns: patterns.length,
    });

    return patterns;
  }

  // Private helper methods

  private analyzeElement(element: DOMElementInfo, isRoot: boolean = false) {
    const hasArabicContent = this.hasArabicContent(element);
    const hasRTLAttributes = this.hasRTLAttributes(element);
    const hasAccessibilityAttributes = this.hasAccessibilityAttributes(element);

    return {
      hasArabicContent,
      hasRTLAttributes,
      hasAccessibilityAttributes,
    };
  }

  private hasRTLSupport(dom: DOMElementInfo): boolean {
    return (
      dom.attributes.dir === "rtl" ||
      dom.styles.direction === "rtl" ||
      this.hasRTLClasses(dom)
    );
  }

  private hasRTLClasses(dom: DOMElementInfo): boolean {
    const className = dom.attributes.class || "";
    return (
      className.includes("rtl") ||
      className.includes("dir-rtl") ||
      className.includes("text-right")
    );
  }

  private hasArabicFontSupport(dom: DOMElementInfo): boolean {
    const fontFamily = dom.styles.fontFamily || "";
    const arabicFonts = [
      "Noto Sans Arabic",
      "Cairo",
      "Amiri",
      "Tahoma",
      "Arial Unicode MS",
    ];
    return (
      arabicFonts.some((font) => fontFamily.includes(font)) ||
      this.hasArabicFontClasses(dom)
    );
  }

  private hasArabicFontClasses(dom: DOMElementInfo): boolean {
    const className = dom.attributes.class || "";
    return (
      className.includes("font-arabic") || className.includes("arabic-font")
    );
  }

  private hasCulturalMetadata(dom: DOMElementInfo): boolean {
    return (
      dom.attributes.lang &&
      (dom.attributes.lang.includes("ar") || dom.attributes.lang.includes("en"))
    );
  }

  private hasArabicContent(element: DOMElementInfo): boolean {
    // Check if element contains Arabic text
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;

    // Check attributes for Arabic text
    for (const [key, value] of Object.entries(element.attributes)) {
      if (typeof value === "string" && arabicRegex.test(value)) {
        return true;
      }
    }

    // Check children recursively
    return element.children.some((child) => this.hasArabicContent(child));
  }

  private hasRTLAttributes(element: DOMElementInfo): boolean {
    return (
      element.attributes.dir === "rtl" || element.styles.direction === "rtl"
    );
  }

  private hasAccessibilityAttributes(element: DOMElementInfo): boolean {
    const a11yAttrs = [
      "role",
      "aria-label",
      "aria-describedby",
      "alt",
      "title",
    ];
    return a11yAttrs.some((attr) => element.attributes[attr]);
  }

  private checkWCAGCompliance(dom: DOMElementInfo): AccessibilityViolation[] {
    const violations: AccessibilityViolation[] = [];

    // Check for missing alt text on images
    if (dom.tagName === "img" && !dom.attributes.alt) {
      violations.push({
        rule: "WCAG 1.1.1",
        impact: "serious",
        description: "Image missing alternative text",
        element: dom.tagName,
        recommendation: "Add descriptive alt attribute",
      });
    }

    // Check for missing form labels
    if (
      ["input", "textarea", "select"].includes(dom.tagName) &&
      !dom.attributes["aria-label"] &&
      !dom.attributes["aria-labelledby"]
    ) {
      violations.push({
        rule: "WCAG 3.3.2",
        impact: "serious",
        description: "Form control missing accessible label",
        element: dom.tagName,
        recommendation: "Add aria-label or associate with label element",
      });
    }

    // Check for adequate color contrast (basic check)
    if (dom.styles.color && dom.styles.backgroundColor) {
      const contrast = this.calculateColorContrast(
        dom.styles.color,
        dom.styles.backgroundColor,
      );
      if (contrast < 4.5) {
        violations.push({
          rule: "WCAG 1.4.3",
          impact: "serious",
          description: "Insufficient color contrast ratio",
          element: dom.tagName,
          recommendation: "Increase color contrast to at least 4.5:1",
        });
      }
    }

    // Recursively check children
    for (const child of dom.children) {
      violations.push(...this.checkWCAGCompliance(child));
    }

    return violations;
  }

  private checkRTLAccessibility(dom: DOMElementInfo): AccessibilityViolation[] {
    const violations: AccessibilityViolation[] = [];

    // Check if Arabic content has proper text direction
    if (this.hasArabicContent(dom) && !this.hasRTLSupport(dom)) {
      violations.push({
        rule: "RTL-1",
        impact: "moderate",
        description: "Arabic content without RTL text direction",
        element: dom.tagName,
        recommendation: 'Add dir="rtl" attribute for Arabic content',
      });
    }

    // Check for navigation order in RTL context
    if (dom.attributes.tabindex && this.hasRTLSupport(dom)) {
      const tabIndex = parseInt(dom.attributes.tabindex);
      if (tabIndex > 0) {
        violations.push({
          rule: "RTL-2",
          impact: "moderate",
          description: "Positive tabindex may interfere with RTL navigation",
          element: dom.tagName,
          recommendation: 'Use tabindex="0" or rely on natural tab order',
        });
      }
    }

    // Recursively check children
    for (const child of dom.children) {
      violations.push(...this.checkRTLAccessibility(child));
    }

    return violations;
  }

  private checkGovernmentAccessibility(
    dom: DOMElementInfo,
  ): AccessibilityViolation[] {
    const violations: AccessibilityViolation[] = [];

    // Check for government form accessibility requirements
    if (this.isFormElement(dom)) {
      if (!dom.attributes.required && this.isRequiredField(dom)) {
        violations.push({
          rule: "GOV-1",
          impact: "serious",
          description: "Required government form field not marked as required",
          element: dom.tagName,
          recommendation: 'Add required attribute and aria-required="true"',
        });
      }

      if (!this.hasErrorHandling(dom)) {
        violations.push({
          rule: "GOV-2",
          impact: "moderate",
          description:
            "Form field lacks error handling for government compliance",
          element: dom.tagName,
          recommendation: "Implement accessible error messages",
        });
      }
    }

    // Check for bilingual support in government contexts
    if (this.isGovernmentContext(dom) && !this.hasBilingualSupport(dom)) {
      violations.push({
        rule: "GOV-3",
        impact: "moderate",
        description: "Government component lacks bilingual accessibility",
        element: dom.tagName,
        recommendation: "Provide Arabic and English language support",
      });
    }

    // Recursively check children
    for (const child of dom.children) {
      violations.push(...this.checkGovernmentAccessibility(child));
    }

    return violations;
  }

  private calculateComplexity(dom: DOMElementInfo): number {
    let complexity = 1;

    // Add complexity for each child
    complexity += dom.children.length;

    // Add complexity for attributes
    complexity += Object.keys(dom.attributes).length * 0.5;

    // Add complexity for styles
    complexity += Object.keys(dom.styles).length * 0.3;

    // Recursively calculate for children
    for (const child of dom.children) {
      complexity += this.calculateComplexity(child);
    }

    return complexity;
  }

  private calculateRTLMetrics(dom: DOMElementInfo): RTLMetrics {
    let performanceImpact = 0;
    let layoutShifts = 0;
    let bidiCompliance = true;

    // Check if RTL attributes cause performance issues
    if (this.hasRTLSupport(dom) && this.hasComplexLayout(dom)) {
      performanceImpact += 15;
    }

    // Check for potential layout shifts with RTL
    if (this.hasRTLSupport(dom) && this.hasDynamicContent(dom)) {
      layoutShifts = 0.1;
      performanceImpact += 10;
    }

    // Check BIDI compliance
    if (this.hasArabicContent(dom) && !this.hasRTLSupport(dom)) {
      bidiCompliance = false;
      performanceImpact += 20;
    }

    return {
      renderTime: this.estimateRTLRenderTime(dom),
      layoutShifts,
      textDirection: this.getTextDirection(dom),
      bidiCompliance,
      performanceImpact,
    };
  }

  private calculateArabicFontMetrics(dom: DOMElementInfo): any {
    const hasArabicFonts = this.hasArabicFontSupport(dom);
    const arabicContentAmount = this.calculateArabicContentAmount(dom);

    return {
      loadTime: hasArabicFonts ? 800 : 1200, // Estimated load time
      renderQuality: hasArabicFonts ? 95 : 60,
      supportedScripts: hasArabicFonts ? ["arab", "latn"] : ["latn"],
      fallbackChain: this.extractFontFallbacks(dom),
      optimizationScore: hasArabicFonts ? 90 : 40,
    };
  }

  private isGovernmentForm(dom: DOMElementInfo): boolean {
    if (dom.tagName !== "form" && dom.tagName !== "Form") return false;

    const className = dom.attributes.class || "";
    const id = dom.attributes.id || "";

    return (
      className.includes("government") ||
      className.includes("ministry") ||
      id.includes("gov") ||
      this.hasGovernmentFormFields(dom)
    );
  }

  private isMinistryHeader(dom: DOMElementInfo): boolean {
    if (dom.tagName !== "header" && dom.tagName !== "Header") return false;

    const className = dom.attributes.class || "";
    return (
      className.includes("ministry") ||
      className.includes("government") ||
      this.hasMinistryLogo(dom)
    );
  }

  private isPrayerTimeNotice(dom: DOMElementInfo): boolean {
    const className = dom.attributes.class || "";
    const id = dom.attributes.id || "";

    return (
      className.includes("prayer") ||
      className.includes("salah") ||
      id.includes("prayer") ||
      this.hasPrayerContent(dom)
    );
  }

  private calculateFormCompliance(dom: DOMElementInfo): number {
    let compliance = 100;

    if (!this.hasArabicLabels(dom)) compliance -= 20;
    if (!this.hasRTLSupport(dom)) compliance -= 25;
    if (!this.hasAccessibilityAttributes(dom)) compliance -= 15;
    if (!this.hasErrorHandling(dom)) compliance -= 10;

    return Math.max(compliance, 0);
  }

  private calculateHeaderCompliance(dom: DOMElementInfo): number {
    let compliance = 100;

    if (!this.hasMinistryLogo(dom)) compliance -= 30;
    if (!this.hasBilingualContent(dom)) compliance -= 20;
    if (!this.hasNavigationStructure(dom)) compliance -= 25;

    return Math.max(compliance, 0);
  }

  // Additional helper methods

  private getFormSuggestions(dom: DOMElementInfo): string[] {
    const suggestions = [];

    if (!this.hasArabicLabels(dom)) {
      suggestions.push("Add Arabic translations for form labels");
    }
    if (!this.hasRTLSupport(dom)) {
      suggestions.push("Implement RTL layout support");
    }
    if (!this.hasErrorHandling(dom)) {
      suggestions.push("Add accessible error handling");
    }

    return suggestions;
  }

  private getHeaderSuggestions(dom: DOMElementInfo): string[] {
    const suggestions = [];

    if (!this.hasMinistryLogo(dom)) {
      suggestions.push("Include official ministry logo and branding");
    }
    if (!this.hasBilingualContent(dom)) {
      suggestions.push("Provide Arabic and English content");
    }

    return suggestions;
  }

  // Utility methods for pattern detection

  private hasGovernmentFormFields(dom: DOMElementInfo): boolean {
    const govFieldNames = [
      "nationalId",
      "passportNo",
      "residencyCard",
      "birthCertificate",
    ];
    return this.findElementsByAttribute(dom, "name", govFieldNames).length > 0;
  }

  private hasMinistryLogo(dom: DOMElementInfo): boolean {
    return (
      this.findElementsByAttribute(dom, "alt", [
        "logo",
        "ministry",
        "government",
      ]).length > 0 ||
      this.findElementsByClassName(dom, ["logo", "ministry-logo", "gov-logo"])
        .length > 0
    );
  }

  private hasPrayerContent(dom: DOMElementInfo): boolean {
    const prayerTerms = ["صلاة", "موعد", "أذان", "prayer", "salah"];
    return this.hasTextContent(dom, prayerTerms);
  }

  private hasArabicLabels(dom: DOMElementInfo): boolean {
    const labels = this.findElementsByTagName(dom, "label");
    return labels.some((label) => this.hasArabicContent(label));
  }

  private hasBilingualContent(dom: DOMElementInfo): boolean {
    return this.hasArabicContent(dom) && this.hasEnglishContent(dom);
  }

  private hasEnglishContent(dom: DOMElementInfo): boolean {
    const latinRegex = /[a-zA-Z]/;
    return this.hasTextMatching(dom, latinRegex);
  }

  private hasNavigationStructure(dom: DOMElementInfo): boolean {
    return (
      this.findElementsByTagName(dom, "nav").length > 0 ||
      this.findElementsByClassName(dom, ["nav", "navigation", "menu"]).length >
        0
    );
  }

  private hasErrorHandling(dom: DOMElementInfo): boolean {
    return (
      this.findElementsByAttribute(dom, "aria-invalid", ["true"]).length > 0 ||
      this.findElementsByClassName(dom, ["error", "invalid", "validation"])
        .length > 0
    );
  }

  // DOM traversal utilities

  private findElementsByTagName(
    dom: DOMElementInfo,
    tagName: string,
  ): DOMElementInfo[] {
    const results: DOMElementInfo[] = [];

    if (dom.tagName.toLowerCase() === tagName.toLowerCase()) {
      results.push(dom);
    }

    for (const child of dom.children) {
      results.push(...this.findElementsByTagName(child, tagName));
    }

    return results;
  }

  private findElementsByClassName(
    dom: DOMElementInfo,
    classNames: string[],
  ): DOMElementInfo[] {
    const results: DOMElementInfo[] = [];
    const className = dom.attributes.class || "";

    if (classNames.some((cls) => className.includes(cls))) {
      results.push(dom);
    }

    for (const child of dom.children) {
      results.push(...this.findElementsByClassName(child, classNames));
    }

    return results;
  }

  private findElementsByAttribute(
    dom: DOMElementInfo,
    attribute: string,
    values: string[],
  ): DOMElementInfo[] {
    const results: DOMElementInfo[] = [];
    const attrValue = dom.attributes[attribute] || "";

    if (values.some((val) => attrValue.includes(val))) {
      results.push(dom);
    }

    for (const child of dom.children) {
      results.push(...this.findElementsByAttribute(child, attribute, values));
    }

    return results;
  }

  private hasTextContent(dom: DOMElementInfo, terms: string[]): boolean {
    // This would need to be implemented based on actual text content
    // For now, checking attributes and class names
    const searchText = JSON.stringify(dom.attributes).toLowerCase();
    return terms.some((term) => searchText.includes(term.toLowerCase()));
  }

  private hasTextMatching(dom: DOMElementInfo, regex: RegExp): boolean {
    const searchText = JSON.stringify(dom.attributes);
    return (
      regex.test(searchText) ||
      dom.children.some((child) => this.hasTextMatching(child, regex))
    );
  }

  private isFormElement(dom: DOMElementInfo): boolean {
    return ["input", "textarea", "select", "button"].includes(
      dom.tagName.toLowerCase(),
    );
  }

  private isRequiredField(dom: DOMElementInfo): boolean {
    const name = dom.attributes.name || "";
    const id = dom.attributes.id || "";
    const requiredFields = ["email", "name", "nationalId", "phone"];

    return requiredFields.some(
      (field) => name.includes(field) || id.includes(field),
    );
  }

  private isGovernmentContext(dom: DOMElementInfo): boolean {
    const className = dom.attributes.class || "";
    const id = dom.attributes.id || "";

    return (
      className.includes("government") ||
      className.includes("ministry") ||
      id.includes("gov")
    );
  }

  private hasBilingualSupport(dom: DOMElementInfo): boolean {
    return (
      dom.attributes.lang &&
      (dom.attributes.lang.includes("ar") || dom.attributes.lang.includes("en"))
    );
  }

  private hasComplexLayout(dom: DOMElementInfo): boolean {
    return dom.children.length > 10 || Object.keys(dom.styles).length > 15;
  }

  private hasDynamicContent(dom: DOMElementInfo): boolean {
    const className = dom.attributes.class || "";
    return (
      className.includes("dynamic") ||
      className.includes("loading") ||
      className.includes("async")
    );
  }

  private getTextDirection(dom: DOMElementInfo): "ltr" | "rtl" | "auto" {
    if (dom.attributes.dir) {
      return dom.attributes.dir as "ltr" | "rtl" | "auto";
    }
    if (dom.styles.direction) {
      return dom.styles.direction as "ltr" | "rtl" | "auto";
    }
    return this.hasArabicContent(dom) ? "rtl" : "ltr";
  }

  private estimateRTLRenderTime(dom: DOMElementInfo): number {
    const baseTime = 10; // Base render time in ms
    const arabicBonus = this.hasArabicContent(dom) ? 5 : 0;
    const complexityBonus = this.calculateComplexity(dom) * 0.1;

    return baseTime + arabicBonus + complexityBonus;
  }

  private calculateArabicContentAmount(dom: DOMElementInfo): number {
    // Estimate based on presence of Arabic attributes and children
    let amount = 0;

    if (this.hasArabicContent(dom)) {
      amount += 10;
    }

    for (const child of dom.children) {
      amount += this.calculateArabicContentAmount(child);
    }

    return amount;
  }

  private extractFontFallbacks(dom: DOMElementInfo): string[] {
    const fontFamily = dom.styles.fontFamily || "";
    return fontFamily
      .split(",")
      .map((font) => font.trim().replace(/["']/g, ""));
  }

  private calculateColorContrast(
    color: string,
    backgroundColor: string,
  ): number {
    // Simplified color contrast calculation
    // In a real implementation, this would parse CSS colors properly
    return 4.8; // Placeholder - assume good contrast for now
  }

  private deduplicateViolations(violations: any[]): any[] {
    const seen = new Set();
    return violations.filter((violation) => {
      const key = `${violation.type}-${violation.element}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private deduplicateRecommendations(recommendations: string[]): string[] {
    return [...new Set(recommendations)];
  }
}
