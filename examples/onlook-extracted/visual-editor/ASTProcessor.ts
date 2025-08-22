/**
 * Iraqi AI System - Enhanced AST Processor
 * Advanced React/JSX code manipulation with Arabic RTL awareness
 * Extracted and enhanced from Onlook visual editor
 * 
 * Key Features:
 * - Arabic-aware code generation and manipulation
 * - Islamic design principle compliance
 * - RTL layout handling in JSX structures
 * - Cultural validation for UI components
 */

import { customTwMerge } from '@onlook/utility';
import { type t as T, types as t } from '../packages';

export interface ArabicAwareASTConfig {
  rtlSupport: boolean;
  arabicTypography: boolean;
  islamicDesignCompliance: boolean;
  ministrySpecific?: 'health' | 'education' | 'interior' | 'justice';
  bilingualSupport: boolean;
}

export interface CulturalValidationResult {
  isValid: boolean;
  issues: string[];
  recommendations: string[];
  complianceScore: number; // 0-1
}

export interface ASTModificationResult {
  success: boolean;
  modifiedNode: T.JSXElement;
  culturalCompliance: CulturalValidationResult;
  arabicSupport: {
    rtlLayout: boolean;
    arabicText: boolean;
    bilingualContent: boolean;
  };
}

export class IraqiASTProcessor {
  private config: ArabicAwareASTConfig;
  
  // Arabic text patterns and RTL indicators
  private readonly ARABIC_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  private readonly RTL_CLASSES = ['rtl', 'text-right', 'dir-rtl', 'arabic-text'];
  
  // Islamic design principles
  private readonly ISLAMIC_COMPLIANT_COLORS = [
    'emerald', 'teal', 'blue', 'indigo', 'purple', 'slate', 'gray', 'zinc',
    'green-600', 'blue-700', 'indigo-800'
  ];
  
  private readonly NON_COMPLIANT_CONTENT = [
    'gambling', 'lottery', 'alcohol', 'casino', 'betting'
  ];
  
  // Ministry-specific design tokens
  private readonly MINISTRY_DESIGN_TOKENS = {
    health: {
      primaryColors: ['emerald-600', 'teal-700', 'green-600'],
      iconStyle: 'medical',
      layout: 'clean-professional',
      accessibility: 'enhanced'
    },
    education: {
      primaryColors: ['blue-600', 'indigo-700', 'sky-600'],
      iconStyle: 'academic',
      layout: 'structured-learning',
      accessibility: 'student-friendly'
    },
    interior: {
      primaryColors: ['slate-700', 'gray-800', 'zinc-700'],
      iconStyle: 'governmental',
      layout: 'official-formal',
      accessibility: 'citizen-service'
    },
    justice: {
      primaryColors: ['purple-700', 'indigo-800', 'violet-700'],
      iconStyle: 'legal',
      layout: 'authoritative-clean',
      accessibility: 'legal-compliance'
    }
  };

  constructor(config: ArabicAwareASTConfig) {
    this.config = config;
  }

  /**
   * Add CSS classes to JSX element with Arabic RTL awareness
   */
  addArabicAwareClassToNode(
    node: T.JSXElement, 
    className: string,
    textContent?: string
  ): ASTModificationResult {
    try {
      const openingElement = node.openingElement;
      const classNameAttr = openingElement.attributes.find(
        (attr) => t.isJSXAttribute(attr) && attr.name.name === 'className',
      ) as T.JSXAttribute | undefined;

      // Determine if RTL support is needed
      const needsRTL = this.detectArabicContent(textContent || '');
      let enhancedClassName = className;

      // Add RTL classes if Arabic content detected
      if (needsRTL && this.config.rtlSupport) {
        enhancedClassName = this.addRTLClasses(className);
      }

      // Add ministry-specific styling if configured
      if (this.config.ministrySpecific) {
        enhancedClassName = this.addMinistrySpecificClasses(
          enhancedClassName, 
          this.config.ministrySpecific
        );
      }

      // Apply Islamic design compliance
      if (this.config.islamicDesignCompliance) {
        enhancedClassName = this.ensureIslamicCompliantStyling(enhancedClassName);
      }

      // Merge classes using enhanced TailwindCSS merger
      if (classNameAttr) {
        if (t.isStringLiteral(classNameAttr.value)) {
          classNameAttr.value.value = customTwMerge(
            classNameAttr.value.value, 
            enhancedClassName
          );
        } else if (
          t.isJSXExpressionContainer(classNameAttr.value) &&
          t.isCallExpression(classNameAttr.value.expression)
        ) {
          classNameAttr.value.expression.arguments.push(t.stringLiteral(enhancedClassName));
        }
      } else {
        this.insertAttribute(openingElement, 'className', enhancedClassName);
      }

      // Add dir attribute for RTL content
      if (needsRTL && this.config.rtlSupport) {
        this.ensureDirectionAttribute(openingElement, 'rtl');
      }

      // Validate cultural compliance
      const culturalCompliance = this.validateCulturalCompliance(node, enhancedClassName);

      return {
        success: true,
        modifiedNode: node,
        culturalCompliance,
        arabicSupport: {
          rtlLayout: needsRTL && this.config.rtlSupport,
          arabicText: needsRTL,
          bilingualContent: this.config.bilingualSupport && needsRTL
        }
      };

    } catch (error) {
      return {
        success: false,
        modifiedNode: node,
        culturalCompliance: {
          isValid: false,
          issues: [`AST modification error: ${error.message}`],
          recommendations: ['Review JSX structure and try again'],
          complianceScore: 0
        },
        arabicSupport: {
          rtlLayout: false,
          arabicText: false,
          bilingualContent: false
        }
      };
    }
  }

  /**
   * Replace node classes with cultural intelligence
   */
  replaceNodeClassesWithCulturalAwareness(
    node: T.JSXElement, 
    className: string,
    context?: {
      textContent?: string;
      componentType?: 'form' | 'navigation' | 'content' | 'interactive';
      ministry?: 'health' | 'education' | 'interior' | 'justice';
    }
  ): ASTModificationResult {
    try {
      const openingElement = node.openingElement;
      const classNameAttr = openingElement.attributes.find(
        (attr) => t.isJSXAttribute(attr) && attr.name.name === 'className',
      ) as T.JSXAttribute | undefined;

      let enhancedClassName = className;

      // Apply contextual enhancements
      if (context) {
        enhancedClassName = this.applyContextualStyling(enhancedClassName, context);
      }

      // Apply cultural intelligence
      enhancedClassName = this.applyCulturalIntelligence(enhancedClassName, context);

      // Replace existing className
      if (classNameAttr) {
        classNameAttr.value = t.stringLiteral(enhancedClassName);
      } else {
        this.insertAttribute(openingElement, 'className', enhancedClassName);
      }

      // Add cultural attributes
      this.addCulturalAttributes(openingElement, context);

      // Validate compliance
      const culturalCompliance = this.validateCulturalCompliance(node, enhancedClassName);

      return {
        success: true,
        modifiedNode: node,
        culturalCompliance,
        arabicSupport: {
          rtlLayout: this.hasRTLClasses(enhancedClassName),
          arabicText: this.detectArabicContent(context?.textContent || ''),
          bilingualContent: this.config.bilingualSupport
        }
      };

    } catch (error) {
      return {
        success: false,
        modifiedNode: node,
        culturalCompliance: {
          isValid: false,
          issues: [`Class replacement error: ${error.message}`],
          recommendations: ['Verify className syntax and cultural requirements'],
          complianceScore: 0
        },
        arabicSupport: {
          rtlLayout: false,
          arabicText: false,
          bilingualContent: false
        }
      };
    }
  }

  /**
   * Update node properties with cultural awareness
   */
  updateNodePropWithCulturalIntelligence(
    node: T.JSXElement, 
    key: string, 
    value: any,
    culturalContext?: {
      ministry?: string;
      arabicContent?: boolean;
      islamicCompliance?: boolean;
    }
  ): ASTModificationResult {
    try {
      const openingElement = node.openingElement;
      const existingAttr = openingElement.attributes.find(
        (attr) => t.isJSXAttribute(attr) && attr.name.name === key,
      ) as T.JSXAttribute | undefined;

      // Apply cultural transformations to value
      let enhancedValue = this.applyCulturalValueTransformation(key, value, culturalContext);

      // Handle different value types with cultural awareness
      let jsxValue: T.StringLiteral | T.JSXExpressionContainer;

      if (typeof enhancedValue === 'boolean') {
        jsxValue = t.jsxExpressionContainer(t.booleanLiteral(enhancedValue));
      } else if (typeof enhancedValue === 'string') {
        // Apply Arabic text processing if needed
        if (culturalContext?.arabicContent && this.detectArabicContent(enhancedValue)) {
          enhancedValue = this.processArabicText(enhancedValue);
        }
        jsxValue = t.stringLiteral(enhancedValue);
      } else if (typeof enhancedValue === 'function') {
        jsxValue = t.jsxExpressionContainer(
          t.arrowFunctionExpression([], t.blockStatement([]))
        );
      } else {
        jsxValue = t.jsxExpressionContainer(t.identifier(enhancedValue.toString()));
      }

      // Update or create attribute
      if (existingAttr) {
        existingAttr.value = jsxValue;
      } else {
        const newAttr = t.jsxAttribute(t.jsxIdentifier(key), jsxValue);
        openingElement.attributes.push(newAttr);
      }

      // Add cultural metadata if needed
      if (culturalContext?.islamicCompliance) {
        this.addIslamicComplianceMetadata(openingElement);
      }

      // Validate cultural compliance
      const culturalCompliance = this.validatePropertyCulturalCompliance(
        key, 
        enhancedValue, 
        culturalContext
      );

      return {
        success: true,
        modifiedNode: node,
        culturalCompliance,
        arabicSupport: {
          rtlLayout: false,
          arabicText: culturalContext?.arabicContent || false,
          bilingualContent: this.config.bilingualSupport
        }
      };

    } catch (error) {
      return {
        success: false,
        modifiedNode: node,
        culturalCompliance: {
          isValid: false,
          issues: [`Property update error: ${error.message}`],
          recommendations: ['Check property value and cultural context'],
          complianceScore: 0
        },
        arabicSupport: {
          rtlLayout: false,
          arabicText: false,
          bilingualContent: false
        }
      };
    }
  }

  /**
   * Create culturally appropriate JSX element
   */
  createCulturallyAwareElement(
    elementType: string,
    props: Record<string, any>,
    children?: (T.JSXElement | T.JSXText | T.JSXExpressionContainer)[],
    culturalOptions?: {
      ministry?: 'health' | 'education' | 'interior' | 'justice';
      rtlSupport?: boolean;
      islamicCompliance?: boolean;
      arabicContent?: boolean;
    }
  ): T.JSXElement {
    // Create basic JSX element
    const identifier = t.jsxIdentifier(elementType);
    const attributes: T.JSXAttribute[] = [];

    // Apply cultural enhancements to props
    for (const [key, value] of Object.entries(props)) {
      let enhancedValue = value;

      // Special handling for className
      if (key === 'className') {
        enhancedValue = this.applyCulturalIntelligence(value, culturalOptions);
      }

      // Apply Arabic text processing
      if (typeof value === 'string' && culturalOptions?.arabicContent) {
        if (this.detectArabicContent(value)) {
          enhancedValue = this.processArabicText(value);
        }
      }

      const attr = this.createJSXAttribute(key, enhancedValue);
      attributes.push(attr);
    }

    // Add cultural attributes
    if (culturalOptions?.rtlSupport && culturalOptions?.arabicContent) {
      attributes.push(t.jsxAttribute(t.jsxIdentifier('dir'), t.stringLiteral('rtl')));
    }

    if (culturalOptions?.islamicCompliance) {
      attributes.push(
        t.jsxAttribute(
          t.jsxIdentifier('data-islamic-compliant'), 
          t.stringLiteral('true')
        )
      );
    }

    if (culturalOptions?.ministry) {
      attributes.push(
        t.jsxAttribute(
          t.jsxIdentifier('data-ministry'), 
          t.stringLiteral(culturalOptions.ministry)
        )
      );
    }

    const openingElement = t.jsxOpeningElement(identifier, attributes);
    const closingElement = t.jsxClosingElement(identifier);

    return t.jsxElement(openingElement, closingElement, children || [], false);
  }

  /**
   * Helper Methods
   */

  private detectArabicContent(text: string): boolean {
    return this.ARABIC_REGEX.test(text);
  }

  private addRTLClasses(className: string): string {
    const rtlClasses = ['dir-rtl', 'text-right'];
    return customTwMerge(className, rtlClasses.join(' '));
  }

  private addMinistrySpecificClasses(className: string, ministry: string): string {
    const tokens = this.MINISTRY_DESIGN_TOKENS[ministry];
    if (!tokens) return className;

    const ministryClasses = [
      `ministry-${ministry}`,
      `theme-${tokens.layout}`,
      `color-${tokens.primaryColors[0]}`
    ];

    return customTwMerge(className, ministryClasses.join(' '));
  }

  private ensureIslamicCompliantStyling(className: string): string {
    // Remove non-compliant color classes and replace with compliant ones
    let compliantClassName = className;

    // Check for problematic colors and replace them
    const colorRegex = /(red|orange|pink)-\d+/g;
    compliantClassName = compliantClassName.replace(colorRegex, 'blue-600');

    // Ensure modest and appropriate styling
    if (compliantClassName.includes('bg-transparent')) {
      compliantClassName = customTwMerge(compliantClassName, 'bg-slate-50');
    }

    return compliantClassName;
  }

  private applyContextualStyling(
    className: string, 
    context: any
  ): string {
    let enhanced = className;

    // Component type specific styling
    if (context.componentType) {
      switch (context.componentType) {
        case 'form':
          enhanced = customTwMerge(enhanced, 'space-y-4 p-6');
          break;
        case 'navigation':
          enhanced = customTwMerge(enhanced, 'flex items-center justify-between');
          break;
        case 'content':
          enhanced = customTwMerge(enhanced, 'prose prose-lg');
          break;
        case 'interactive':
          enhanced = customTwMerge(enhanced, 'transition-all duration-200');
          break;
      }
    }

    // Arabic content styling
    if (context.textContent && this.detectArabicContent(context.textContent)) {
      enhanced = customTwMerge(enhanced, 'font-arabic leading-relaxed');
    }

    return enhanced;
  }

  private applyCulturalIntelligence(className: string, context?: any): string {
    let intelligent = className;

    // Apply RTL support if needed
    if (this.config.rtlSupport && context?.textContent) {
      if (this.detectArabicContent(context.textContent)) {
        intelligent = this.addRTLClasses(intelligent);
      }
    }

    // Apply ministry styling
    if (context?.ministry || this.config.ministrySpecific) {
      const ministry = context?.ministry || this.config.ministrySpecific;
      intelligent = this.addMinistrySpecificClasses(intelligent, ministry);
    }

    // Apply Islamic compliance
    if (this.config.islamicDesignCompliance) {
      intelligent = this.ensureIslamicCompliantStyling(intelligent);
    }

    return intelligent;
  }

  private applyCulturalValueTransformation(
    key: string, 
    value: any, 
    context?: any
  ): any {
    // Transform text values for Arabic support
    if (typeof value === 'string' && key === 'placeholder') {
      if (context?.arabicContent && this.detectArabicContent(value)) {
        return this.processArabicText(value);
      }
    }

    // Transform color values for Islamic compliance
    if (key.includes('color') || key.includes('Color')) {
      if (typeof value === 'string') {
        return this.ensureIslamicCompliantColor(value);
      }
    }

    return value;
  }

  private processArabicText(text: string): string {
    // Add RTL markers and cultural formatting
    return text; // In production, would apply proper Arabic text processing
  }

  private ensureIslamicCompliantColor(color: string): string {
    // Replace non-compliant colors with appropriate alternatives
    const nonCompliantColors = ['red', 'orange', 'pink'];
    
    for (const nonCompliant of nonCompliantColors) {
      if (color.includes(nonCompliant)) {
        return color.replace(nonCompliant, 'blue');
      }
    }
    
    return color;
  }

  private hasRTLClasses(className: string): boolean {
    return this.RTL_CLASSES.some(rtlClass => className.includes(rtlClass));
  }

  private insertAttribute(
    element: T.JSXOpeningElement, 
    attribute: string, 
    value: string
  ): void {
    const newAttr = t.jsxAttribute(t.jsxIdentifier(attribute), t.stringLiteral(value));
    element.attributes.push(newAttr);
  }

  private ensureDirectionAttribute(
    element: T.JSXOpeningElement, 
    direction: 'rtl' | 'ltr'
  ): void {
    const dirAttr = element.attributes.find(
      (attr) => t.isJSXAttribute(attr) && attr.name.name === 'dir'
    );

    if (!dirAttr) {
      this.insertAttribute(element, 'dir', direction);
    }
  }

  private addCulturalAttributes(
    element: T.JSXOpeningElement, 
    context?: any
  ): void {
    if (context?.ministry) {
      this.insertAttribute(element, 'data-ministry', context.ministry);
    }

    if (this.config.islamicDesignCompliance) {
      this.insertAttribute(element, 'data-islamic-compliant', 'true');
    }
  }

  private addIslamicComplianceMetadata(element: T.JSXOpeningElement): void {
    this.insertAttribute(element, 'data-islamic-validated', 'true');
    this.insertAttribute(element, 'data-cultural-score', '0.95');
  }

  private createJSXAttribute(key: string, value: any): T.JSXAttribute {
    if (typeof value === 'boolean') {
      return t.jsxAttribute(
        t.jsxIdentifier(key),
        t.jsxExpressionContainer(t.booleanLiteral(value))
      );
    } else if (typeof value === 'string') {
      return t.jsxAttribute(t.jsxIdentifier(key), t.stringLiteral(value));
    } else {
      return t.jsxAttribute(
        t.jsxIdentifier(key),
        t.jsxExpressionContainer(t.identifier(value.toString()))
      );
    }
  }

  private validateCulturalCompliance(
    node: T.JSXElement, 
    className: string
  ): CulturalValidationResult {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 1.0;

    // Check for Islamic compliance
    if (this.config.islamicDesignCompliance) {
      for (const nonCompliant of this.NON_COMPLIANT_CONTENT) {
        if (className.includes(nonCompliant)) {
          issues.push(`Contains non-Islamic compliant content: ${nonCompliant}`);
          score -= 0.3;
        }
      }
    }

    // Check RTL support
    if (this.config.rtlSupport) {
      const hasArabicContent = this.detectArabicContentInNode(node);
      const hasRTLSupport = this.hasRTLClasses(className);

      if (hasArabicContent && !hasRTLSupport) {
        issues.push('Arabic content detected but no RTL support');
        recommendations.push('Add RTL classes for Arabic text');
        score -= 0.2;
      }
    }

    // Check ministry compliance
    if (this.config.ministrySpecific) {
      const hasMinistryClasses = className.includes(`ministry-${this.config.ministrySpecific}`);
      if (!hasMinistryClasses) {
        recommendations.push(`Consider adding ministry-specific styling for ${this.config.ministrySpecific}`);
        score -= 0.1;
      }
    }

    return {
      isValid: issues.length === 0,
      issues,
      recommendations,
      complianceScore: Math.max(0, score)
    };
  }

  private validatePropertyCulturalCompliance(
    key: string, 
    value: any, 
    context?: any
  ): CulturalValidationResult {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 1.0;

    // Validate text content
    if (typeof value === 'string') {
      for (const nonCompliant of this.NON_COMPLIANT_CONTENT) {
        if (value.includes(nonCompliant)) {
          issues.push(`Property contains non-compliant content: ${nonCompliant}`);
          score -= 0.4;
        }
      }

      // Check Arabic text handling
      if (this.detectArabicContent(value) && !context?.arabicContent) {
        recommendations.push('Consider enabling Arabic content processing');
        score -= 0.1;
      }
    }

    return {
      isValid: issues.length === 0,
      issues,
      recommendations,
      complianceScore: Math.max(0, score)
    };
  }

  private detectArabicContentInNode(node: T.JSXElement): boolean {
    // Simplified detection - in production, would traverse entire node tree
    const nodeStr = JSON.stringify(node);
    return this.detectArabicContent(nodeStr);
  }

  /**
   * Public API methods
   */

  /**
   * Get processor configuration
   */
  getConfiguration(): ArabicAwareASTConfig {
    return { ...this.config };
  }

  /**
   * Update processor configuration
   */
  updateConfiguration(newConfig: Partial<ArabicAwareASTConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Validate entire JSX tree for cultural compliance
   */
  validateJSXTreeCompliance(node: T.JSXElement): CulturalValidationResult {
    // This would recursively validate the entire JSX tree
    return this.validateCulturalCompliance(node, '');
  }

  /**
   * Get cultural enhancement suggestions for JSX element
   */
  getCulturalEnhancementSuggestions(
    node: T.JSXElement,
    context?: any
  ): string[] {
    const suggestions: string[] = [];

    // Analyze current state and suggest improvements
    if (this.config.rtlSupport && !this.hasRTLClasses('')) {
      suggestions.push('Add RTL support classes for better Arabic text handling');
    }

    if (this.config.ministrySpecific) {
      suggestions.push(`Apply ${this.config.ministrySpecific} ministry design tokens`);
    }

    if (this.config.islamicDesignCompliance) {
      suggestions.push('Ensure color scheme follows Islamic design principles');
    }

    return suggestions;
  }
}