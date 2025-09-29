/**
 * RTL Component Generator for Iraqi AI Design Generation
 *
 * Generates React components with Arabic RTL support and Iraqi cultural patterns
 */

import { EventEmitter } from "events";
import {
  ICulturalPrompt,
  ICulturalDesignRequirements,
} from "./CulturalPromptSystem";
import { IFunctionalRequirements } from "./IraqiDesignEngine";

// RTL Component generation interfaces
export interface IRTLGenerationRequest {
  prompt: ICulturalPrompt;
  template: IMinistryTemplate;
  requirements: IFunctionalRequirements;
  culturalRequirements: ICulturalDesignRequirements;
}

export interface IRTLGenerationResult {
  code: string;
  styles: string;
  metadata: IComponentMetadata;
  rtlCompliance: IRTLComplianceReport;
  performance: IGenerationPerformance;
}

export interface IMinistryTemplate {
  id: string;
  ministryName: string;
  componentType: string;
  baseStructure: string;
  culturalPatterns: string[];
  brandingElements: IBrandingElements;
  rtlOptimizations: string[];
}

export interface IBrandingElements {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoPlacement: string;
  typography: ITypographySettings;
  iconSet: string;
}

export interface ITypographySettings {
  arabicFont: string;
  englishFont: string;
  headingSize: string;
  bodySize: string;
  lineHeight: number;
  letterSpacing: string;
}

export interface IComponentMetadata {
  componentName: string;
  description: string;
  props: IComponentProp[];
  accessibility: IAccessibilityFeatures;
  culturalFeatures: ICulturalFeatures;
  technicalSpecs: ITechnicalSpecs;
}

export interface IComponentProp {
  name: string;
  type: string;
  required: boolean;
  description: string;
  arabicLabel?: string;
}

export interface IAccessibilityFeatures {
  ariaSupport: boolean;
  screenReaderOptimized: boolean;
  keyboardNavigation: boolean;
  highContrast: boolean;
  rtlScreenReader: boolean;
}

export interface ICulturalFeatures {
  islamicCompliant: boolean;
  iraqiDialectSupport: boolean;
  ministryBranding: boolean;
  bilingualContent: boolean;
  culturalColorScheme: boolean;
}

export interface ITechnicalSpecs {
  framework: string;
  styling: string;
  bundleSize: number;
  performance: number;
  browser: string[];
  mobile: boolean;
}

export interface IRTLComplianceReport {
  layoutScore: number; // 0-100
  typographyScore: number; // 0-100
  interactionScore: number; // 0-100
  contentHandling: number; // 0-100
  overallRTLScore: number; // 0-100
  issues: IRTLIssue[];
  recommendations: string[];
}

export interface IRTLIssue {
  severity: "critical" | "major" | "minor";
  category: "layout" | "typography" | "interaction" | "content";
  description: string;
  solution: string;
  arabicSpecific: boolean;
}

export interface IGenerationPerformance {
  generationTime: number; // milliseconds
  templatingTime: number; // milliseconds
  validationTime: number; // milliseconds
  cacheUtilization: number; // percentage
  complexity: number; // 1-10 scale
}

export interface IRTLGeneratorOptions {
  performanceOptimization: boolean;
  accessibilityEnhanced: boolean;
  cacheTemplates: boolean;
  enableLearning: boolean;
  debugMode: boolean;
}

/**
 * RTL Component Generator
 *
 * Generates culturally-appropriate React components with Arabic RTL support
 */
export class RTLComponentGenerator extends EventEmitter {
  private readonly options: IRTLGeneratorOptions;
  private readonly componentTemplates: Map<string, string> = new Map();
  private readonly styleTemplates: Map<string, string> = new Map();
  private readonly generationCache: Map<string, IRTLGenerationResult> =
    new Map();
  private readonly arabicTypographyRules: Map<string, string> = new Map();
  private readonly rtlLayoutPatterns: Map<string, string> = new Map();

  constructor(options: Partial<IRTLGeneratorOptions> = {}) {
    super();

    this.options = {
      performanceOptimization: options.performanceOptimization ?? true,
      accessibilityEnhanced: options.accessibilityEnhanced ?? true,
      cacheTemplates: options.cacheTemplates ?? true,
      enableLearning: options.enableLearning ?? true,
      debugMode: options.debugMode ?? false,
    };

    // Initialize component generation system
    this.loadComponentTemplates();
    this.loadStyleTemplates();
    this.loadArabicTypographyRules();
    this.loadRTLLayoutPatterns();
  }

  /**
   * Generate RTL-aware React component
   */
  async generateComponent(
    request: IRTLGenerationRequest,
  ): Promise<IRTLGenerationResult> {
    const startTime = Date.now();
    const generationId = `rtl_gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      // Check cache first
      const cacheKey = this.generateCacheKey(request);
      if (this.options.cacheTemplates && this.generationCache.has(cacheKey)) {
        const cachedResult = this.generationCache.get(cacheKey)!;
        this.emit("componentGenerated", {
          generationId,
          cached: true,
          result: cachedResult,
        });
        return cachedResult;
      }

      // Generate component structure
      const componentStructure = await this.generateComponentStructure(request);
      const templatingTime = Date.now() - startTime;

      // Generate component code
      const componentCode = await this.generateComponentCode(
        componentStructure,
        request.prompt,
        request.culturalRequirements,
      );

      // Generate RTL-optimized styles
      const styleCode = await this.generateRTLStyles(
        componentStructure,
        request.template.brandingElements,
        request.culturalRequirements,
      );

      // Generate component metadata
      const metadata = await this.generateComponentMetadata(
        componentCode,
        request.requirements,
        request.culturalRequirements,
      );

      // Validate RTL compliance
      const validationStart = Date.now();
      const rtlCompliance = await this.validateRTLCompliance(
        componentCode,
        styleCode,
        request.culturalRequirements,
      );
      const validationTime = Date.now() - validationStart;

      // Calculate performance metrics
      const totalTime = Date.now() - startTime;
      const performance: IGenerationPerformance = {
        generationTime: totalTime,
        templatingTime,
        validationTime,
        cacheUtilization: this.generationCache.size > 0 ? 75 : 0,
        complexity: this.calculateComplexity(componentCode),
      };

      const result: IRTLGenerationResult = {
        code: componentCode,
        styles: styleCode,
        metadata,
        rtlCompliance,
        performance,
      };

      // Cache successful generations
      if (this.options.cacheTemplates && rtlCompliance.overallRTLScore >= 85) {
        this.generationCache.set(cacheKey, result);
      }

      this.emit("componentGenerated", {
        generationId,
        cached: false,
        result,
        performance,
      });

      return result;
    } catch (error) {
      this.emit("generationError", {
        generationId,
        error: error instanceof Error ? error.message : "Unknown error",
        request: {
          componentType: request.template.componentType,
          ministry: request.template.ministryName,
        },
      });
      throw error;
    }
  }

  /**
   * Generate component with specific Arabic content
   */
  async generateArabicComponent(
    componentType: string,
    arabicContent: string,
    englishContent?: string,
  ): Promise<string> {
    const arabicTemplate =
      this.componentTemplates.get(`arabic_${componentType}`) ||
      this.componentTemplates.get(componentType) ||
      this.getDefaultTemplate();

    // Process Arabic content for RTL
    const processedArabic = this.processArabicContent(arabicContent);
    const processedEnglish = englishContent
      ? this.processEnglishContent(englishContent)
      : "";

    // Generate bilingual component
    return this.generateBilingualComponent(
      arabicTemplate,
      processedArabic,
      processedEnglish,
    );
  }

  /**
   * Validate component RTL compliance
   */
  async validateRTLCompliance(
    componentCode: string,
    styleCode: string,
    requirements: ICulturalDesignRequirements,
  ): Promise<IRTLComplianceReport> {
    const issues: IRTLIssue[] = [];
    const recommendations: string[] = [];

    // Layout validation
    const layoutScore = this.validateRTLLayout(
      componentCode,
      styleCode,
      issues,
    );

    // Typography validation
    const typographyScore = this.validateArabicTypography(
      componentCode,
      styleCode,
      issues,
    );

    // Interaction validation
    const interactionScore = this.validateRTLInteractions(
      componentCode,
      issues,
    );

    // Content handling validation
    const contentHandling = this.validateContentHandling(
      componentCode,
      requirements,
      issues,
    );

    // Calculate overall score
    const overallRTLScore = Math.round(
      layoutScore * 0.3 +
        typographyScore * 0.3 +
        interactionScore * 0.2 +
        contentHandling * 0.2,
    );

    // Generate recommendations
    if (overallRTLScore < 90) {
      recommendations.push("Consider additional RTL optimizations");
    }

    if (layoutScore < 85) {
      recommendations.push("Improve RTL layout structure");
    }

    if (typographyScore < 85) {
      recommendations.push("Enhance Arabic typography settings");
    }

    return {
      layoutScore,
      typographyScore,
      interactionScore,
      contentHandling,
      overallRTLScore,
      issues,
      recommendations,
    };
  }

  /**
   * Get generation analytics
   */
  getAnalytics(): IRTLGeneratorAnalytics {
    return {
      totalGenerations: this.generationCache.size,
      averageRTLScore: this.calculateAverageRTLScore(),
      cacheHitRate: this.calculateCacheHitRate(),
      averageGenerationTime: this.calculateAverageGenerationTime(),
      templatesLoaded: this.componentTemplates.size,
    };
  }

  /**
   * Clear generation cache
   */
  clearCache(): void {
    this.generationCache.clear();
    this.emit("cacheCleared");
  }

  /**
   * Private helper methods
   */

  private async generateComponentStructure(
    request: IRTLGenerationRequest,
  ): Promise<IComponentStructure> {
    const baseStructure = request.template.baseStructure;
    const culturalPatterns = request.template.culturalPatterns;
    const rtlOptimizations = request.template.rtlOptimizations;

    return {
      base: baseStructure,
      cultural: culturalPatterns,
      rtl: rtlOptimizations,
      accessibility: this.getAccessibilityStructure(request.requirements),
      ministry: this.getMinistryStructure(request.template),
    };
  }

  private async generateComponentCode(
    structure: IComponentStructure,
    prompt: ICulturalPrompt,
    requirements: ICulturalDesignRequirements,
  ): Promise<string> {
    // Start with base template
    let code = structure.base;

    // Apply cultural enhancements
    code = this.applyCulturalPatterns(code, structure.cultural);

    // Apply RTL optimizations
    code = this.applyRTLOptimizations(code, structure.rtl);

    // Apply accessibility features
    if (requirements.accessibilityLevel !== "basic") {
      code = this.applyAccessibilityFeatures(code, structure.accessibility);
    }

    // Apply ministry branding
    if (requirements.ministryBranding) {
      code = this.applyMinistryBranding(code, structure.ministry);
    }

    // Apply Arabic support
    if (requirements.arabicRTLSupport) {
      code = this.applyArabicSupport(code);
    }

    // Apply bilingual support
    if (requirements.bilingualSupport) {
      code = this.applyBilingualSupport(code);
    }

    return this.formatCode(code);
  }

  private async generateRTLStyles(
    structure: IComponentStructure,
    branding: IBrandingElements,
    requirements: ICulturalDesignRequirements,
  ): Promise<string> {
    let styles = "";

    // Base RTL styles
    styles += this.generateBaseRTLStyles();

    // Typography styles
    styles += this.generateArabicTypographyStyles(branding.typography);

    // Color scheme styles
    styles += this.generateColorSchemeStyles(branding);

    // Layout styles
    if (requirements.arabicRTLSupport) {
      styles += this.generateRTLLayoutStyles();
    }

    // Accessibility styles
    styles += this.generateAccessibilityStyles();

    return styles;
  }

  private async generateComponentMetadata(
    code: string,
    requirements: IFunctionalRequirements,
    culturalRequirements: ICulturalDesignRequirements,
  ): Promise<IComponentMetadata> {
    return {
      componentName: this.extractComponentName(code),
      description: this.generateComponentDescription(
        code,
        culturalRequirements,
      ),
      props: this.extractComponentProps(code),
      accessibility: this.analyzeAccessibilityFeatures(code),
      culturalFeatures: this.analyzeCulturalFeatures(
        code,
        culturalRequirements,
      ),
      technicalSpecs: this.analyzeTechnicalSpecs(code, requirements),
    };
  }

  private validateRTLLayout(
    code: string,
    styles: string,
    issues: IRTLIssue[],
  ): number {
    let score = 100;

    // Check for RTL direction
    if (!code.includes('dir="rtl"') && !styles.includes("direction: rtl")) {
      issues.push({
        severity: "critical",
        category: "layout",
        description: "Missing RTL direction attribute",
        solution: 'Add dir="rtl" to container element',
        arabicSpecific: true,
      });
      score -= 30;
    }

    // Check for proper text alignment
    if (!styles.includes("text-align: right") && !code.includes("text-right")) {
      issues.push({
        severity: "major",
        category: "layout",
        description: "Missing right text alignment for RTL",
        solution: "Add text-right class or text-align: right style",
        arabicSpecific: true,
      });
      score -= 20;
    }

    // Check for RTL-aware margins and padding
    if (styles.includes("margin-left") || styles.includes("padding-left")) {
      issues.push({
        severity: "minor",
        category: "layout",
        description: "Use margin-inline-start instead of margin-left for RTL",
        solution: "Replace directional properties with logical properties",
        arabicSpecific: true,
      });
      score -= 10;
    }

    return Math.max(0, score);
  }

  private validateArabicTypography(
    code: string,
    styles: string,
    issues: IRTLIssue[],
  ): number {
    let score = 100;

    // Check for Arabic font support
    if (
      !styles.includes("Arabic") &&
      !styles.includes("Amiri") &&
      !styles.includes("Noto Sans Arabic")
    ) {
      issues.push({
        severity: "major",
        category: "typography",
        description: "No Arabic font specified",
        solution: "Add Arabic font family to CSS",
        arabicSpecific: true,
      });
      score -= 25;
    }

    // Check for proper line height for Arabic
    if (
      !styles.includes("line-height: 1.6") &&
      !styles.includes("leading-relaxed")
    ) {
      issues.push({
        severity: "minor",
        category: "typography",
        description: "Line height may be too tight for Arabic text",
        solution: "Increase line-height to 1.6 or use leading-relaxed",
        arabicSpecific: true,
      });
      score -= 15;
    }

    return Math.max(0, score);
  }

  private validateRTLInteractions(code: string, issues: IRTLIssue[]): number {
    let score = 100;

    // Check for RTL keyboard navigation
    if (
      code.includes("onKeyDown") &&
      !code.includes("ArrowLeft") &&
      !code.includes("ArrowRight")
    ) {
      issues.push({
        severity: "minor",
        category: "interaction",
        description: "Keyboard navigation may not be RTL-aware",
        solution: "Reverse arrow key handling for RTL layout",
        arabicSpecific: true,
      });
      score -= 15;
    }

    return Math.max(0, score);
  }

  private validateContentHandling(
    code: string,
    requirements: ICulturalDesignRequirements,
    issues: IRTLIssue[],
  ): number {
    let score = 100;

    if (requirements.bilingualSupport) {
      // Check for bilingual content structure
      if (!code.includes('lang="ar"') && !code.includes('lang="en"')) {
        issues.push({
          severity: "major",
          category: "content",
          description: "Missing language attributes for bilingual content",
          solution: "Add lang attributes to Arabic and English content",
          arabicSpecific: true,
        });
        score -= 20;
      }
    }

    return Math.max(0, score);
  }

  private processArabicContent(content: string): string {
    // Add Arabic text processing logic
    return content.trim();
  }

  private processEnglishContent(content: string): string {
    // Add English text processing logic
    return content.trim();
  }

  private generateBilingualComponent(
    template: string,
    arabicContent: string,
    englishContent: string,
  ): string {
    return template
      .replace("{{ARABIC_CONTENT}}", arabicContent)
      .replace("{{ENGLISH_CONTENT}}", englishContent);
  }

  private applyCulturalPatterns(code: string, patterns: string[]): string {
    let processedCode = code;

    patterns.forEach((pattern) => {
      // Apply cultural pattern transformations
      processedCode = processedCode.replace(/{{CULTURAL_PATTERN}}/g, pattern);
    });

    return processedCode;
  }

  private applyRTLOptimizations(code: string, optimizations: string[]): string {
    let processedCode = code;

    optimizations.forEach((optimization) => {
      // Apply RTL optimizations
      processedCode = processedCode.replace(
        /{{RTL_OPTIMIZATION}}/g,
        optimization,
      );
    });

    return processedCode;
  }

  private applyAccessibilityFeatures(
    code: string,
    accessibility: string[],
  ): string {
    let processedCode = code;

    // Add ARIA labels and accessibility attributes
    if (!processedCode.includes("aria-label")) {
      processedCode = processedCode.replace(
        /<button/g,
        '<button aria-label="Button"',
      );
    }

    return processedCode;
  }

  private applyMinistryBranding(code: string, ministry: any): string {
    return code.replace(/{{MINISTRY_BRANDING}}/g, ministry.branding || "");
  }

  private applyArabicSupport(code: string): string {
    // Add Arabic language support
    return code.replace(/<div/g, '<div dir="rtl" lang="ar"');
  }

  private applyBilingualSupport(code: string): string {
    // Add bilingual content support
    return code.replace(/{{BILINGUAL_SUPPORT}}/g, 'data-bilingual="true"');
  }

  private formatCode(code: string): string {
    // Basic code formatting
    return code.replace(/\s+/g, " ").replace(/>\s*</g, ">\n<").trim();
  }

  private generateBaseRTLStyles(): string {
    return `
/* RTL Base Styles */
.rtl {
  direction: rtl;
  text-align: right;
}

.rtl .ltr {
  direction: ltr;
  text-align: left;
}
`;
  }

  private generateArabicTypographyStyles(
    typography: ITypographySettings,
  ): string {
    return `
/* Arabic Typography */
.font-arabic {
  font-family: "${typography.arabicFont}", "Amiri", "Noto Sans Arabic", sans-serif;
  line-height: ${typography.lineHeight};
  letter-spacing: ${typography.letterSpacing};
}

.heading-arabic {
  font-size: ${typography.headingSize};
}

.body-arabic {
  font-size: ${typography.bodySize};
}
`;
  }

  private generateColorSchemeStyles(branding: IBrandingElements): string {
    return `
/* Ministry Color Scheme */
.primary-color { color: ${branding.primaryColor}; }
.secondary-color { color: ${branding.secondaryColor}; }
.accent-color { color: ${branding.accentColor}; }

.bg-primary { background-color: ${branding.primaryColor}; }
.bg-secondary { background-color: ${branding.secondaryColor}; }
.bg-accent { background-color: ${branding.accentColor}; }
`;
  }

  private generateRTLLayoutStyles(): string {
    return `
/* RTL Layout Utilities */
.rtl .ml-auto { margin-left: 0; margin-right: auto; }
.rtl .mr-auto { margin-right: 0; margin-left: auto; }
.rtl .text-left { text-align: right; }
.rtl .text-right { text-align: left; }
.rtl .float-left { float: right; }
.rtl .float-right { float: left; }
`;
  }

  private generateAccessibilityStyles(): string {
    return `
/* Accessibility Enhancements */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.focus\\:ring-2:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}
`;
  }

  private extractComponentName(code: string): string {
    const match = code.match(/(?:function|const)\s+(\w+)/);
    return match ? match[1] : "UnnamedComponent";
  }

  private generateComponentDescription(
    code: string,
    requirements: ICulturalDesignRequirements,
  ): string {
    return `Iraqi culturally-aware component with ${requirements.arabicRTLSupport ? "Arabic RTL" : "LTR"} support`;
  }

  private extractComponentProps(code: string): IComponentProp[] {
    // Extract props from component code
    const props: IComponentProp[] = [];

    const propsMatch = code.match(/\{\s*([^}]+)\s*\}/);
    if (propsMatch) {
      const propNames = propsMatch[1].split(",").map((p) => p.trim());
      propNames.forEach((prop) => {
        props.push({
          name: prop,
          type: "any",
          required: false,
          description: `${prop} property`,
        });
      });
    }

    return props;
  }

  private analyzeAccessibilityFeatures(code: string): IAccessibilityFeatures {
    return {
      ariaSupport: code.includes("aria-"),
      screenReaderOptimized: code.includes("sr-only"),
      keyboardNavigation: code.includes("onKeyDown"),
      highContrast: code.includes("contrast"),
      rtlScreenReader: code.includes('dir="rtl"'),
    };
  }

  private analyzeCulturalFeatures(
    code: string,
    requirements: ICulturalDesignRequirements,
  ): ICulturalFeatures {
    return {
      islamicCompliant: requirements.islamicCompliance,
      iraqiDialectSupport: requirements.iraqiDialectSupport,
      ministryBranding: requirements.ministryBranding,
      bilingualContent: requirements.bilingualSupport,
      culturalColorScheme: code.includes("primary-color"),
    };
  }

  private analyzeTechnicalSpecs(
    code: string,
    requirements: IFunctionalRequirements,
  ): ITechnicalSpecs {
    return {
      framework: "React",
      styling: "Tailwind CSS",
      bundleSize: Math.round((code.length * 0.7) / 1024), // Rough estimate
      performance:
        requirements.performanceTarget === "high-performance" ? 9 : 7,
      browser: ["Chrome", "Firefox", "Safari", "Edge"],
      mobile: requirements.responsiveness,
    };
  }

  private calculateComplexity(code: string): number {
    const lines = code.split("\n").length;
    const conditionals = (code.match(/if|switch|for|while/g) || []).length;
    const jsx = (code.match(/<[^>]+>/g) || []).length;

    return Math.min(10, Math.round((lines + conditionals * 2 + jsx) / 50));
  }

  private calculateAverageRTLScore(): number {
    const results = Array.from(this.generationCache.values());
    if (results.length === 0) return 0;

    const totalScore = results.reduce(
      (sum, result) => sum + result.rtlCompliance.overallRTLScore,
      0,
    );
    return Math.round(totalScore / results.length);
  }

  private calculateCacheHitRate(): number {
    // This would be tracked with actual usage metrics
    return 0; // Placeholder
  }

  private calculateAverageGenerationTime(): number {
    const results = Array.from(this.generationCache.values());
    if (results.length === 0) return 0;

    const totalTime = results.reduce(
      (sum, result) => sum + result.performance.generationTime,
      0,
    );
    return Math.round(totalTime / results.length);
  }

  private generateCacheKey(request: IRTLGenerationRequest): string {
    const keyData = {
      componentType: request.template.componentType,
      ministry: request.template.ministryName,
      cultural: request.culturalRequirements,
      functional: request.requirements,
    };

    return btoa(JSON.stringify(keyData)).replace(/[+/=]/g, "");
  }

  private getAccessibilityStructure(
    requirements: IFunctionalRequirements,
  ): string[] {
    return [
      "aria-label support",
      "keyboard navigation",
      "screen reader optimization",
      "focus management",
    ];
  }

  private getMinistryStructure(template: IMinistryTemplate): any {
    return {
      branding: template.brandingElements,
      patterns: template.culturalPatterns,
    };
  }

  private getDefaultTemplate(): string {
    return `
import React from 'react';

const {{COMPONENT_NAME}} = (props) => {
  return (
    <div className="{{CLASSES}}" dir="rtl">
      {{CONTENT}}
    </div>
  );
};

export default {{COMPONENT_NAME}};
`;
  }

  private loadComponentTemplates(): void {
    // Load component templates for different types
    this.componentTemplates.set("form", this.getFormTemplate());
    this.componentTemplates.set("card", this.getCardTemplate());
    this.componentTemplates.set("button", this.getButtonTemplate());
    this.componentTemplates.set("navigation", this.getNavigationTemplate());
  }

  private loadStyleTemplates(): void {
    // Load style templates
    this.styleTemplates.set("rtl-base", this.generateBaseRTLStyles());
    this.styleTemplates.set(
      "arabic-typography",
      "/* Arabic typography styles */",
    );
  }

  private loadArabicTypographyRules(): void {
    this.arabicTypographyRules.set(
      "font-family",
      'Amiri, "Noto Sans Arabic", sans-serif',
    );
    this.arabicTypographyRules.set("line-height", "1.6");
    this.arabicTypographyRules.set("text-align", "right");
  }

  private loadRTLLayoutPatterns(): void {
    this.rtlLayoutPatterns.set("container", 'dir="rtl" className="text-right"');
    this.rtlLayoutPatterns.set("flex", 'className="flex flex-row-reverse"');
    this.rtlLayoutPatterns.set("grid", 'className="grid gap-4 text-right"');
  }

  private getFormTemplate(): string {
    return `
import React, { useState } from 'react';

const {{COMPONENT_NAME}} = ({ onSubmit, ...props }) => {
  const [formData, setFormData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="{{CLASSES}}" dir="rtl">
      {{FORM_FIELDS}}
      <button type="submit" className="{{SUBMIT_CLASSES}}">
        {{SUBMIT_TEXT}}
      </button>
    </form>
  );
};

export default {{COMPONENT_NAME}};
`;
  }

  private getCardTemplate(): string {
    return `
import React from 'react';

const {{COMPONENT_NAME}} = ({ title, children, ...props }) => {
  return (
    <div className="{{CLASSES}}" dir="rtl">
      {title && (
        <h3 className="{{TITLE_CLASSES}}">
          {title}
        </h3>
      )}
      <div className="{{CONTENT_CLASSES}}">
        {children}
      </div>
    </div>
  );
};

export default {{COMPONENT_NAME}};
`;
  }

  private getButtonTemplate(): string {
    return `
import React from 'react';

const {{COMPONENT_NAME}} = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  onClick,
  ...props 
}) => {
  const baseClasses = "{{BASE_CLASSES}}";
  const variantClasses = {
    primary: "{{PRIMARY_CLASSES}}",
    secondary: "{{SECONDARY_CLASSES}}"
  };
  
  return (
    <button
      className={\`\${baseClasses} \${variantClasses[variant]}\`}
      disabled={disabled}
      onClick={onClick}
      dir="rtl"
      {...props}
    >
      {children}
    </button>
  );
};

export default {{COMPONENT_NAME}};
`;
  }

  private getNavigationTemplate(): string {
    return `
import React from 'react';

const {{COMPONENT_NAME}} = ({ items, currentPath, ...props }) => {
  return (
    <nav className="{{CLASSES}}" dir="rtl">
      <ul className="{{LIST_CLASSES}}">
        {items.map((item, index) => (
          <li key={index} className="{{ITEM_CLASSES}}">
            <a 
              href={item.href}
              className={\`{{LINK_CLASSES}} \${currentPath === item.href ? '{{ACTIVE_CLASSES}}' : ''}\`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default {{COMPONENT_NAME}};
`;
  }
}

// Supporting interfaces
export interface IComponentStructure {
  base: string;
  cultural: string[];
  rtl: string[];
  accessibility: string[];
  ministry: any;
}

export interface IRTLGeneratorAnalytics {
  totalGenerations: number;
  averageRTLScore: number;
  cacheHitRate: number;
  averageGenerationTime: number;
  templatesLoaded: number;
}

// Default export
export default RTLComponentGenerator;
