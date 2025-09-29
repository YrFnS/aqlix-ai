import { EventEmitter } from "events";
import { Logger } from "../../utils/logger";
import type {
  CulturalConfig,
  PatternMatch,
  PatternType,
  MinistryType,
  ASTNode,
  DOMElementInfo,
  SourceLocation,
} from "../../types";

/**
 * PatternDetector - Advanced Iraqi government pattern detection and validation
 *
 * Detects and validates specific patterns including:
 * - Government form patterns
 * - Ministry header components
 * - Prayer time notices
 * - Arabic content blocks
 * - Citizen portal patterns
 * - Official document layouts
 * - Cultural component structures
 */
export class PatternDetector extends EventEmitter {
  private logger: Logger;
  private governmentPatterns: Map<PatternType, any>;
  private ministryPatterns: Map<MinistryType, any>;
  private culturalKeywords: Map<string, number>;
  private islamicPatterns: Map<string, any>;

  constructor(private config: CulturalConfig) {
    super();
    this.logger = new Logger("PatternDetector", config as any);
    this.initializePatterns();
  }

  /**
   * Detect patterns in AST and DOM
   */
  async detectPatterns(
    ast: ASTNode | null,
    dom: DOMElementInfo | null,
    targetPatterns: string[],
  ): Promise<PatternMatch[]> {
    this.logger.info("Starting pattern detection", {
      targetPatterns,
      hasAST: !!ast,
      hasDOM: !!dom,
    });

    const startTime = performance.now();
    const patterns: PatternMatch[] = [];

    // Detect patterns in DOM
    if (dom) {
      const domPatterns = await this.detectDOMPatterns(dom, targetPatterns);
      patterns.push(...domPatterns);
    }

    // Detect patterns in AST
    if (ast) {
      const astPatterns = await this.detectASTPatterns(ast, targetPatterns);
      patterns.push(...astPatterns);
    }

    // Post-process and validate patterns
    const validatedPatterns = this.validatePatterns(patterns);

    const duration = performance.now() - startTime;
    this.logger.info("Pattern detection completed", {
      detected: validatedPatterns.length,
      duration: Math.round(duration),
    });

    this.emit("patterns-detected", {
      patterns: validatedPatterns,
      duration,
      targetPatterns,
    });

    return validatedPatterns;
  }

  /**
   * Validate government compliance for patterns
   */
  async validateGovernmentCompliance(component: any): Promise<{
    compliance: number;
    patterns: PatternMatch[];
    violations: any[];
    recommendations: string[];
  }> {
    const patterns = await this.detectPatterns(
      component.ast,
      component.dom,
      Array.from(this.governmentPatterns.keys()),
    );

    let compliance = 100;
    const violations: any[] = [];
    const recommendations: string[] = [];

    // Evaluate pattern compliance
    for (const pattern of patterns) {
      if (pattern.compliance < 80) {
        compliance = Math.min(compliance, pattern.compliance);
        violations.push({
          type: "pattern-non-compliance",
          pattern: pattern.name,
          compliance: pattern.compliance,
          suggestions: pattern.suggestions,
        });
        recommendations.push(...pattern.suggestions);
      }
    }

    return {
      compliance,
      patterns,
      violations,
      recommendations: [...new Set(recommendations)],
    };
  }

  // Private detection methods

  private async detectDOMPatterns(
    dom: DOMElementInfo,
    targetPatterns: string[],
  ): Promise<PatternMatch[]> {
    this.logger.debug("Detecting DOM patterns");

    const patterns: PatternMatch[] = [];

    // Government form pattern
    if (this.shouldDetect("government-form", targetPatterns)) {
      const govFormPattern = this.detectGovernmentForm(dom);
      if (govFormPattern) {
        patterns.push(govFormPattern);
      }
    }

    // Ministry header pattern
    if (this.shouldDetect("ministry-header", targetPatterns)) {
      const headerPattern = this.detectMinistryHeader(dom);
      if (headerPattern) {
        patterns.push(headerPattern);
      }
    }

    // Prayer time notice pattern
    if (this.shouldDetect("prayer-notice", targetPatterns)) {
      const prayerPattern = this.detectPrayerTimeNotice(dom);
      if (prayerPattern) {
        patterns.push(prayerPattern);
      }
    }

    // Arabic content block pattern
    if (this.shouldDetect("arabic-content-block", targetPatterns)) {
      const arabicPatterns = this.detectArabicContentBlocks(dom);
      patterns.push(...arabicPatterns);
    }

    // Citizen portal pattern
    if (this.shouldDetect("citizen-portal", targetPatterns)) {
      const citizenPattern = this.detectCitizenPortal(dom);
      if (citizenPattern) {
        patterns.push(citizenPattern);
      }
    }

    // Official document pattern
    if (this.shouldDetect("official-document", targetPatterns)) {
      const documentPattern = this.detectOfficialDocument(dom);
      if (documentPattern) {
        patterns.push(documentPattern);
      }
    }

    // Cultural component pattern
    if (this.shouldDetect("cultural-component", targetPatterns)) {
      const culturalPatterns = this.detectCulturalComponents(dom);
      patterns.push(...culturalPatterns);
    }

    return patterns;
  }

  private async detectASTPatterns(
    ast: ASTNode,
    targetPatterns: string[],
  ): Promise<PatternMatch[]> {
    this.logger.debug("Detecting AST patterns");

    const patterns: PatternMatch[] = [];

    // Cultural imports pattern
    const culturalImports = this.detectCulturalImports(ast);
    patterns.push(...culturalImports);

    // Islamic functionality pattern
    const islamicPatterns = this.detectIslamicFunctionality(ast);
    patterns.push(...islamicPatterns);

    // Government API patterns
    const govAPIPatterns = this.detectGovernmentAPIPatterns(ast);
    patterns.push(...govAPIPatterns);

    return patterns;
  }

  // DOM pattern detection methods

  private detectGovernmentForm(dom: DOMElementInfo): PatternMatch | null {
    const formElements = this.findElementsByTagName(dom, "form");

    for (const form of formElements) {
      const score = this.scoreGovernmentForm(form);

      if (score.isGovernmentForm) {
        return {
          id: `gov-form-${Date.now()}`,
          name: "Government Service Form",
          type: "government-form",
          confidence: score.confidence,
          compliance: score.compliance,
          location: this.getDOMLocation(form),
          suggestions: score.suggestions,
          culturalRelevance: score.culturalRelevance,
        };
      }
    }

    return null;
  }

  private detectMinistryHeader(dom: DOMElementInfo): PatternMatch | null {
    const headerElements = this.findElementsByTagName(dom, "header");
    headerElements.push(
      ...this.findElementsByClassName(dom, [
        "header",
        "page-header",
        "site-header",
      ]),
    );

    for (const header of headerElements) {
      const score = this.scoreMinistryHeader(header);

      if (score.isMinistryHeader) {
        return {
          id: `ministry-header-${Date.now()}`,
          name: "Ministry Header Component",
          type: "ministry-header",
          confidence: score.confidence,
          compliance: score.compliance,
          location: this.getDOMLocation(header),
          suggestions: score.suggestions,
          culturalRelevance: score.culturalRelevance,
        };
      }
    }

    return null;
  }

  private detectPrayerTimeNotice(dom: DOMElementInfo): PatternMatch | null {
    // Look for prayer-related classes, IDs, and content
    const prayerElements = this.findElementsByClassName(dom, [
      "prayer",
      "salah",
      "pray",
      "islamic",
      "time",
    ]);
    prayerElements.push(
      ...this.findElementsByAttribute(dom, "id", [
        "prayer",
        "salah",
        "islamic-time",
      ]),
    );

    for (const element of prayerElements) {
      const score = this.scorePrayerTimeNotice(element);

      if (score.isPrayerNotice) {
        return {
          id: `prayer-notice-${Date.now()}`,
          name: "Prayer Time Notice",
          type: "prayer-notice",
          confidence: score.confidence,
          compliance: 100, // Prayer time notices are always culturally compliant
          location: this.getDOMLocation(element),
          suggestions: [
            "Ensure prayer times are accurate for Iraqi time zones",
          ],
          culturalRelevance: 100,
        };
      }
    }

    return null;
  }

  private detectArabicContentBlocks(dom: DOMElementInfo): PatternMatch[] {
    const patterns: PatternMatch[] = [];
    const arabicElements = this.findElementsWithArabicContent(dom);

    for (const element of arabicElements) {
      const score = this.scoreArabicContentBlock(element);

      if (score.confidence > 70) {
        patterns.push({
          id: `arabic-block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: "Arabic Content Block",
          type: "arabic-content-block",
          confidence: score.confidence,
          compliance: score.compliance,
          location: this.getDOMLocation(element),
          suggestions: score.suggestions,
          culturalRelevance: score.culturalRelevance,
        });
      }
    }

    return patterns;
  }

  private detectCitizenPortal(dom: DOMElementInfo): PatternMatch | null {
    // Look for citizen service indicators
    const citizenElements = this.findElementsByClassName(dom, [
      "citizen",
      "service",
      "portal",
      "gov-service",
      "e-government",
    ]);
    citizenElements.push(
      ...this.findElementsByAttribute(dom, "data-service", ["citizen"]),
    );

    if (citizenElements.length > 0) {
      const score = this.scoreCitizenPortal(dom);

      if (score.isCitizenPortal) {
        return {
          id: `citizen-portal-${Date.now()}`,
          name: "Citizen Service Portal",
          type: "citizen-portal",
          confidence: score.confidence,
          compliance: score.compliance,
          location: this.getDOMLocation(citizenElements[0]),
          suggestions: score.suggestions,
          culturalRelevance: score.culturalRelevance,
        };
      }
    }

    return null;
  }

  private detectOfficialDocument(dom: DOMElementInfo): PatternMatch | null {
    // Look for official document indicators
    const docElements = this.findElementsByClassName(dom, [
      "document",
      "certificate",
      "official",
      "stamp",
      "seal",
    ]);
    docElements.push(...this.findElementsByTagName(dom, "article"));

    for (const element of docElements) {
      const score = this.scoreOfficialDocument(element);

      if (score.isOfficialDocument) {
        return {
          id: `official-doc-${Date.now()}`,
          name: "Official Document Layout",
          type: "official-document",
          confidence: score.confidence,
          compliance: score.compliance,
          location: this.getDOMLocation(element),
          suggestions: score.suggestions,
          culturalRelevance: score.culturalRelevance,
        };
      }
    }

    return null;
  }

  private detectCulturalComponents(dom: DOMElementInfo): PatternMatch[] {
    const patterns: PatternMatch[] = [];

    // Detect Islamic calendar components
    const islamicCalendar = this.detectIslamicCalendar(dom);
    if (islamicCalendar) patterns.push(islamicCalendar);

    // Detect Arabic typography components
    const arabicTypography = this.detectArabicTypography(dom);
    patterns.push(...arabicTypography);

    // Detect RTL navigation components
    const rtlNavigation = this.detectRTLNavigation(dom);
    if (rtlNavigation) patterns.push(rtlNavigation);

    return patterns;
  }

  // AST pattern detection methods

  private detectCulturalImports(ast: ASTNode): PatternMatch[] {
    const patterns: PatternMatch[] = [];

    // This would use AST traversal to find cultural library imports
    // For now, providing a simplified implementation

    const culturalLibraries = [
      "react-i18next",
      "next-intl",
      "moment-hijri",
      "islamic-calendar",
      "prayer-times",
      "arabic-names",
      "rtl-css",
    ];

    // In real implementation, would traverse AST for ImportDeclaration nodes
    for (const library of culturalLibraries) {
      patterns.push({
        id: `cultural-import-${library}`,
        name: `Cultural Library Import: ${library}`,
        type: "cultural-component",
        confidence: 90,
        compliance: 95,
        location: { file: "ast", line: 0, column: 0 },
        suggestions: ["Ensure proper configuration for Iraqi context"],
        culturalRelevance: 90,
      });
    }

    return patterns;
  }

  private detectIslamicFunctionality(ast: ASTNode): PatternMatch[] {
    const patterns: PatternMatch[] = [];

    // Look for Islamic-related function calls and components
    const islamicFunctions = [
      "getPrayerTimes",
      "getHijriDate",
      "getQiblaDirection",
      "calculateZakat",
      "getRamadanDates",
    ];

    // In real implementation, would traverse AST for CallExpression nodes
    for (const func of islamicFunctions) {
      patterns.push({
        id: `islamic-func-${func}`,
        name: `Islamic Functionality: ${func}`,
        type: "cultural-component",
        confidence: 95,
        compliance: 100,
        location: { file: "ast", line: 0, column: 0 },
        suggestions: ["Ensure accurate Islamic calculations for Iraqi context"],
        culturalRelevance: 100,
      });
    }

    return patterns;
  }

  private detectGovernmentAPIPatterns(ast: ASTNode): PatternMatch[] {
    const patterns: PatternMatch[] = [];

    // Look for government API endpoints and services
    const govEndpoints = [
      "/api/citizen/id-verification",
      "/api/government/services",
      "/api/ministry/documents",
      "/api/authentication/gov-login",
    ];

    // In real implementation, would traverse AST for string literals
    for (const endpoint of govEndpoints) {
      patterns.push({
        id: `gov-api-${endpoint.replace(/\W/g, "-")}`,
        name: `Government API Integration: ${endpoint}`,
        type: "government-form",
        confidence: 85,
        compliance: 90,
        location: { file: "ast", line: 0, column: 0 },
        suggestions: ["Ensure proper authentication and data protection"],
        culturalRelevance: 85,
      });
    }

    return patterns;
  }

  // Scoring methods for pattern detection

  private scoreGovernmentForm(form: DOMElementInfo): {
    isGovernmentForm: boolean;
    confidence: number;
    compliance: number;
    suggestions: string[];
    culturalRelevance: number;
  } {
    let score = 0;
    let compliance = 100;
    const suggestions: string[] = [];

    // Check for government-related classes/IDs
    const className = form.attributes.class || "";
    const id = form.attributes.id || "";
    const govTerms = [
      "government",
      "ministry",
      "official",
      "citizen",
      "service",
    ];

    if (
      govTerms.some((term) => className.includes(term) || id.includes(term))
    ) {
      score += 30;
    }

    // Check for national ID field
    const fields = this.findFormFields(form);
    const hasNationalId = fields.some(
      (field) =>
        (field.attributes.name || "").includes("nationalId") ||
        (field.attributes.id || "").includes("national-id"),
    );
    if (hasNationalId) {
      score += 25;
    }

    // Check for Arabic labels
    const hasArabicLabels = this.hasArabicLabels(form);
    if (hasArabicLabels) {
      score += 20;
    } else {
      compliance -= 20;
      suggestions.push("Add Arabic translations for form labels");
    }

    // Check for RTL support
    if (!this.hasRTLSupport(form)) {
      compliance -= 25;
      suggestions.push("Implement RTL layout support");
    }

    // Check for accessibility
    if (!this.hasAccessibilityAttributes(form)) {
      compliance -= 15;
      suggestions.push("Add accessibility attributes (aria-labels, etc.)");
    }

    const confidence = Math.min(score, 100);
    const culturalRelevance = hasArabicLabels ? 90 : 60;

    return {
      isGovernmentForm: confidence > 50,
      confidence,
      compliance: Math.max(compliance, 0),
      suggestions,
      culturalRelevance,
    };
  }

  private scoreMinistryHeader(header: DOMElementInfo): {
    isMinistryHeader: boolean;
    confidence: number;
    compliance: number;
    suggestions: string[];
    culturalRelevance: number;
  } {
    let score = 0;
    let compliance = 100;
    const suggestions: string[] = [];

    // Check for ministry branding
    const hasLogo = this.hasMinistryLogo(header);
    if (hasLogo) {
      score += 30;
    } else {
      compliance -= 30;
      suggestions.push("Include official ministry logo and branding");
    }

    // Check for bilingual content
    const hasBilingual = this.hasBilingualContent(header);
    if (hasBilingual) {
      score += 25;
    } else {
      compliance -= 20;
      suggestions.push("Provide Arabic and English content");
    }

    // Check for navigation structure
    const hasNav = this.hasNavigationStructure(header);
    if (hasNav) {
      score += 20;
    } else {
      compliance -= 25;
      suggestions.push("Include proper navigation structure");
    }

    // Check for government colors
    if (this.hasOfficialColors(header)) {
      score += 15;
    }

    const confidence = Math.min(score, 100);
    const culturalRelevance = hasBilingual ? 100 : 70;

    return {
      isMinistryHeader: confidence > 60,
      confidence,
      compliance: Math.max(compliance, 0),
      suggestions,
      culturalRelevance,
    };
  }

  private scorePrayerTimeNotice(element: DOMElementInfo): {
    isPrayerNotice: boolean;
    confidence: number;
  } {
    let score = 0;

    // Check for prayer-related classes
    const className = element.attributes.class || "";
    const prayerClasses = ["prayer", "salah", "islamic", "time"];
    if (prayerClasses.some((cls) => className.includes(cls))) {
      score += 40;
    }

    // Check for Islamic time terms in content
    const islamicTimeTerms = ["صلاة", "موعد", "أذان", "prayer", "salah"];
    if (this.hasTextContent(element, islamicTimeTerms)) {
      score += 30;
    }

    // Check for time display elements
    const timeElements = this.findElementsByTagName(element, "time");
    if (timeElements.length > 0) {
      score += 20;
    }

    // Check for location context (Baghdad, Iraq)
    const locationTerms = ["بغداد", "العراق", "Baghdad", "Iraq"];
    if (this.hasTextContent(element, locationTerms)) {
      score += 10;
    }

    return {
      isPrayerNotice: score > 50,
      confidence: Math.min(score, 100),
    };
  }

  private scoreArabicContentBlock(element: DOMElementInfo): {
    confidence: number;
    compliance: number;
    suggestions: string[];
    culturalRelevance: number;
  } {
    let confidence = 60; // Base score for having Arabic content
    let compliance = 100;
    const suggestions: string[] = [];

    // Check for proper RTL support
    if (!this.hasRTLSupport(element)) {
      compliance -= 30;
      suggestions.push("Add RTL text direction support");
    }

    // Check for Arabic fonts
    if (!this.hasArabicFonts(element)) {
      compliance -= 25;
      confidence -= 10;
      suggestions.push("Configure Arabic-compatible fonts");
    }

    // Check for language attributes
    if (!this.hasArabicLanguageAttribute(element)) {
      compliance -= 15;
      suggestions.push('Add lang="ar" attribute to Arabic content');
    }

    // Bonus for government content
    if (this.hasGovernmentContent(element)) {
      confidence += 20;
    }

    // Bonus for Islamic content
    if (this.hasIslamicContent(element)) {
      confidence += 10;
    }

    return {
      confidence: Math.min(confidence, 100),
      compliance: Math.max(compliance, 0),
      suggestions,
      culturalRelevance: 95,
    };
  }

  private scoreCitizenPortal(dom: DOMElementInfo): {
    isCitizenPortal: boolean;
    confidence: number;
    compliance: number;
    suggestions: string[];
    culturalRelevance: number;
  } {
    let score = 0;
    let compliance = 100;
    const suggestions: string[] = [];

    // Check for citizen service indicators
    const citizenServices = this.findCitizenServiceElements(dom);
    if (citizenServices.length > 0) {
      score += 30;
    }

    // Check for login/authentication
    const hasAuth = this.hasAuthenticationElements(dom);
    if (hasAuth) {
      score += 20;
    }

    // Check for service categories
    const hasServiceCategories = this.hasServiceCategories(dom);
    if (hasServiceCategories) {
      score += 25;
    }

    // Check for multilingual support
    if (!this.hasBilingualContent(dom)) {
      compliance -= 25;
      suggestions.push("Provide Arabic and English language support");
    }

    // Check for accessibility
    if (!this.hasAccessibilityAttributes(dom)) {
      compliance -= 20;
      suggestions.push("Improve accessibility for citizen access");
    }

    const confidence = Math.min(score, 100);

    return {
      isCitizenPortal: confidence > 50,
      confidence,
      compliance: Math.max(compliance, 0),
      suggestions,
      culturalRelevance: 85,
    };
  }

  private scoreOfficialDocument(element: DOMElementInfo): {
    isOfficialDocument: boolean;
    confidence: number;
    compliance: number;
    suggestions: string[];
    culturalRelevance: number;
  } {
    let score = 0;
    let compliance = 100;
    const suggestions: string[] = [];

    // Check for official document indicators
    const className = element.attributes.class || "";
    const docTerms = ["document", "certificate", "official", "stamp"];
    if (docTerms.some((term) => className.includes(term))) {
      score += 25;
    }

    // Check for header with official information
    const hasOfficialHeader = this.hasOfficialHeader(element);
    if (hasOfficialHeader) {
      score += 30;
    }

    // Check for bilingual content
    if (!this.hasBilingualContent(element)) {
      compliance -= 30;
      suggestions.push("Provide bilingual official document content");
    }

    // Check for proper formatting
    if (!this.hasProperDocumentFormatting(element)) {
      compliance -= 20;
      suggestions.push("Improve document formatting and structure");
    }

    const confidence = Math.min(score, 100);

    return {
      isOfficialDocument: confidence > 40,
      confidence,
      compliance: Math.max(compliance, 0),
      suggestions,
      culturalRelevance: 80,
    };
  }

  // Specialized cultural component detectors

  private detectIslamicCalendar(dom: DOMElementInfo): PatternMatch | null {
    const calendarElements = this.findElementsByClassName(dom, [
      "calendar",
      "hijri",
      "islamic-date",
      "lunar",
    ]);

    if (calendarElements.length > 0) {
      return {
        id: `islamic-calendar-${Date.now()}`,
        name: "Islamic Calendar Component",
        type: "cultural-component",
        confidence: 90,
        compliance: 100,
        location: this.getDOMLocation(calendarElements[0]),
        suggestions: ["Ensure accurate Hijri date calculations"],
        culturalRelevance: 100,
      };
    }

    return null;
  }

  private detectArabicTypography(dom: DOMElementInfo): PatternMatch[] {
    const patterns: PatternMatch[] = [];
    const typographyElements = this.findElementsWithArabicTypography(dom);

    for (const element of typographyElements) {
      patterns.push({
        id: `arabic-typography-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: "Arabic Typography Component",
        type: "cultural-component",
        confidence: 80,
        compliance: this.hasProperArabicTypography(element) ? 100 : 70,
        location: this.getDOMLocation(element),
        suggestions: this.hasProperArabicTypography(element)
          ? ["Continue maintaining proper Arabic typography"]
          : ["Improve Arabic font selection and spacing"],
        culturalRelevance: 95,
      });
    }

    return patterns;
  }

  private detectRTLNavigation(dom: DOMElementInfo): PatternMatch | null {
    const navElements = this.findElementsByTagName(dom, "nav");
    navElements.push(
      ...this.findElementsByClassName(dom, ["navigation", "menu"]),
    );

    for (const nav of navElements) {
      if (this.hasRTLSupport(nav)) {
        return {
          id: `rtl-navigation-${Date.now()}`,
          name: "RTL Navigation Component",
          type: "cultural-component",
          confidence: 85,
          compliance: this.hasProperRTLNavigation(nav) ? 100 : 80,
          location: this.getDOMLocation(nav),
          suggestions: this.hasProperRTLNavigation(nav)
            ? ["Excellent RTL navigation implementation"]
            : ["Improve RTL navigation accessibility"],
          culturalRelevance: 90,
        };
      }
    }

    return null;
  }

  // Utility methods

  private initializePatterns(): void {
    // Initialize government patterns
    this.governmentPatterns = new Map([
      [
        "government-form",
        {
          indicators: ["form", "government", "ministry", "citizen", "service"],
          requiredFields: ["nationalId", "name", "address"],
          culturalRequirements: ["arabic-labels", "rtl-support"],
        },
      ],
      [
        "ministry-header",
        {
          indicators: ["header", "ministry", "government"],
          requiredElements: ["logo", "navigation", "language-switcher"],
          culturalRequirements: ["bilingual-content", "official-colors"],
        },
      ],
      [
        "prayer-notice",
        {
          indicators: ["prayer", "salah", "islamic", "time"],
          requiredContent: ["prayer-times", "location"],
          culturalRequirements: ["arabic-content", "islamic-calendar"],
        },
      ],
    ]);

    // Initialize ministry-specific patterns
    this.ministryPatterns = new Map([
      [
        "interior",
        {
          colors: ["#374151", "#1f2937"], // Slate colors for official use
          services: ["national-id", "passport", "residency"],
          security: ["authentication", "encryption", "audit"],
        },
      ],
      [
        "health",
        {
          colors: ["#059669", "#0d9488"], // Emerald/Teal for medical
          services: ["medical-record", "vaccination", "health-insurance"],
          accessibility: ["enhanced", "medical-grade"],
        },
      ],
      [
        "education",
        {
          colors: ["#2563eb", "#1d4ed8"], // Blue for education
          services: ["student-record", "certificate", "enrollment"],
          features: ["student-portal", "parent-access"],
        },
      ],
    ]);

    // Initialize cultural keywords
    this.culturalKeywords = new Map([
      ["وزارة", 100], // Ministry
      ["حكومة", 95], // Government
      ["مواطن", 90], // Citizen
      ["خدمات", 85], // Services
      ["هوية", 80], // Identity
      ["صلاة", 100], // Prayer
      ["إسلام", 95], // Islam
      ["عربي", 90], // Arabic
    ]);

    // Initialize Islamic patterns
    this.islamicPatterns = new Map([
      [
        "prayer-times",
        {
          functions: ["getPrayerTimes", "calculateSalah"],
          content: ["صلاة", "prayer", "salah"],
          locations: ["Baghdad", "Iraq", "بغداد"],
        },
      ],
      [
        "islamic-calendar",
        {
          functions: ["getHijriDate", "islamicCalendar"],
          content: ["هجري", "hijri", "lunar"],
          features: ["date-conversion", "religious-events"],
        },
      ],
    ]);
  }

  private validatePatterns(patterns: PatternMatch[]): PatternMatch[] {
    return patterns.filter((pattern) => {
      // Filter out patterns with very low confidence
      if (pattern.confidence < 60) {
        this.logger.debug("Pattern filtered out due to low confidence", {
          pattern: pattern.name,
          confidence: pattern.confidence,
        });
        return false;
      }

      // Validate cultural relevance
      if (pattern.culturalRelevance < 50) {
        this.logger.debug(
          "Pattern filtered out due to low cultural relevance",
          {
            pattern: pattern.name,
            culturalRelevance: pattern.culturalRelevance,
          },
        );
        return false;
      }

      return true;
    });
  }

  private shouldDetect(pattern: string, targetPatterns: string[]): boolean {
    return targetPatterns.length === 0 || targetPatterns.includes(pattern);
  }

  private getDOMLocation(element: DOMElementInfo): SourceLocation {
    return {
      file: "dom",
      line: 0, // Would need actual line info from parsing
      column: 0,
      length: 0,
    };
  }

  // DOM utility methods (simplified implementations)

  private findElementsByTagName(
    dom: DOMElementInfo,
    tagNames: string,
  ): DOMElementInfo[] {
    const tags = tagNames.split(",").map((t) => t.trim().toLowerCase());
    const results: DOMElementInfo[] = [];

    const search = (element: DOMElementInfo) => {
      if (tags.includes(element.tagName.toLowerCase())) {
        results.push(element);
      }
      element.children.forEach((child) => search(child));
    };

    search(dom);
    return results;
  }

  private findElementsByClassName(
    dom: DOMElementInfo,
    classNames: string[],
  ): DOMElementInfo[] {
    const results: DOMElementInfo[] = [];

    const search = (element: DOMElementInfo) => {
      const className = element.attributes.class || "";
      if (classNames.some((cls) => className.includes(cls))) {
        results.push(element);
      }
      element.children.forEach((child) => search(child));
    };

    search(dom);
    return results;
  }

  private findElementsByAttribute(
    dom: DOMElementInfo,
    attribute: string,
    values: string[],
  ): DOMElementInfo[] {
    const results: DOMElementInfo[] = [];

    const search = (element: DOMElementInfo) => {
      const attrValue = element.attributes[attribute] || "";
      if (values.some((val) => attrValue.includes(val))) {
        results.push(element);
      }
      element.children.forEach((child) => search(child));
    };

    search(dom);
    return results;
  }

  private findElementsWithArabicContent(dom: DOMElementInfo): DOMElementInfo[] {
    const results: DOMElementInfo[] = [];
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;

    const search = (element: DOMElementInfo) => {
      const text = Object.values(element.attributes).join(" ");
      if (arabicRegex.test(text)) {
        results.push(element);
      }
      element.children.forEach((child) => search(child));
    };

    search(dom);
    return results;
  }

  // Pattern scoring helper methods (simplified)

  private findFormFields(form: DOMElementInfo): DOMElementInfo[] {
    return this.findElementsByTagName(form, "input,textarea,select");
  }

  private hasArabicLabels(element: DOMElementInfo): boolean {
    const labels = this.findElementsByTagName(element, "label");
    return labels.some((label) => this.hasArabicText(label));
  }

  private hasArabicText(element: DOMElementInfo): boolean {
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;
    const text = Object.values(element.attributes).join(" ");
    return arabicRegex.test(text);
  }

  private hasRTLSupport(element: DOMElementInfo): boolean {
    return (
      element.attributes.dir === "rtl" || element.styles.direction === "rtl"
    );
  }

  private hasAccessibilityAttributes(element: DOMElementInfo): boolean {
    const a11yAttrs = ["role", "aria-label", "aria-describedby", "alt"];
    return a11yAttrs.some((attr) => element.attributes[attr]);
  }

  private hasMinistryLogo(element: DOMElementInfo): boolean {
    const images = this.findElementsByTagName(element, "img");
    return images.some(
      (img) =>
        (img.attributes.alt || "").toLowerCase().includes("ministry") ||
        (img.attributes.src || "").toLowerCase().includes("logo"),
    );
  }

  private hasBilingualContent(element: DOMElementInfo): boolean {
    return this.hasArabicText(element) && this.hasEnglishText(element);
  }

  private hasEnglishText(element: DOMElementInfo): boolean {
    const latinRegex = /[a-zA-Z]/;
    const text = Object.values(element.attributes).join(" ");
    return latinRegex.test(text);
  }

  private hasNavigationStructure(element: DOMElementInfo): boolean {
    return this.findElementsByTagName(element, "nav,ul,ol").length > 0;
  }

  private hasOfficialColors(element: DOMElementInfo): boolean {
    const colors =
      `${element.styles.backgroundColor} ${element.styles.color}`.toLowerCase();
    const officialColors = ["black", "white", "red", "green", "#000", "#fff"];
    return officialColors.some((color) => colors.includes(color));
  }

  private hasTextContent(element: DOMElementInfo, terms: string[]): boolean {
    const text = Object.values(element.attributes).join(" ").toLowerCase();
    return terms.some((term) => text.includes(term.toLowerCase()));
  }

  private hasArabicFonts(element: DOMElementInfo): boolean {
    const fontFamily = element.styles.fontFamily || "";
    const arabicFonts = ["Noto Sans Arabic", "Cairo", "Amiri", "Tahoma"];
    return arabicFonts.some((font) => fontFamily.includes(font));
  }

  private hasArabicLanguageAttribute(element: DOMElementInfo): boolean {
    const lang = element.attributes.lang || "";
    return lang.includes("ar");
  }

  private hasGovernmentContent(element: DOMElementInfo): boolean {
    const govTerms = ["وزارة", "حكومة", "government", "ministry"];
    return this.hasTextContent(element, govTerms);
  }

  private hasIslamicContent(element: DOMElementInfo): boolean {
    const islamicTerms = ["إسلام", "صلاة", "islam", "islamic"];
    return this.hasTextContent(element, islamicTerms);
  }

  private findCitizenServiceElements(dom: DOMElementInfo): DOMElementInfo[] {
    return this.findElementsByClassName(dom, ["service", "citizen", "portal"]);
  }

  private hasAuthenticationElements(dom: DOMElementInfo): boolean {
    const authElements = this.findElementsByTagName(
      dom,
      'input[type="password"],form',
    );
    const loginForms = this.findElementsByClassName(dom, [
      "login",
      "auth",
      "signin",
    ]);
    return authElements.length > 0 || loginForms.length > 0;
  }

  private hasServiceCategories(dom: DOMElementInfo): boolean {
    return (
      this.findElementsByClassName(dom, [
        "category",
        "service-type",
        "department",
      ]).length > 0
    );
  }

  private hasOfficialHeader(element: DOMElementInfo): boolean {
    const headers = this.findElementsByTagName(element, "h1,h2,header");
    return headers.some((header) => this.hasGovernmentContent(header));
  }

  private hasProperDocumentFormatting(element: DOMElementInfo): boolean {
    return (
      this.findElementsByClassName(element, ["header", "body", "footer"])
        .length >= 2
    );
  }

  private findElementsWithArabicTypography(
    dom: DOMElementInfo,
  ): DOMElementInfo[] {
    const results: DOMElementInfo[] = [];

    const search = (element: DOMElementInfo) => {
      if (this.hasArabicText(element) && this.hasTypographyStyles(element)) {
        results.push(element);
      }
      element.children.forEach((child) => search(child));
    };

    search(dom);
    return results;
  }

  private hasTypographyStyles(element: DOMElementInfo): boolean {
    const typographyProps = [
      "font-family",
      "font-size",
      "line-height",
      "letter-spacing",
    ];
    return typographyProps.some((prop) => element.styles[prop]);
  }

  private hasProperArabicTypography(element: DOMElementInfo): boolean {
    return this.hasArabicFonts(element) && this.hasRTLSupport(element);
  }

  private hasProperRTLNavigation(nav: DOMElementInfo): boolean {
    return this.hasRTLSupport(nav) && this.hasAccessibilityAttributes(nav);
  }
}
