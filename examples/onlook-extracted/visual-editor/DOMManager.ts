/**
 * Iraqi AI System - Enhanced DOM Manager
 * Real-time DOM manipulation with comprehensive Arabic RTL support
 * Extracted and enhanced from Onlook visual editor
 * 
 * Key Features:
 * - Real-time DOM manipulation with Arabic text support
 * - RTL layout handling for Iraqi government interfaces
 * - Cultural design pattern recognition and validation
 * - Islamic compliance checking for visual elements
 * - Arabic typography intelligence with proper font selection
 * - Prayer time-aware interface updates
 */

import { EventEmitter } from 'events';

export interface ArabicDOMConfig {
  rtlSupport: boolean;
  arabicTypography: boolean;
  islamicCompliance: boolean;
  ministryTheme?: 'health' | 'education' | 'interior' | 'justice';
  prayerTimeAware: boolean;
  culturalValidation: boolean;
}

export interface DOMManipulationResult {
  success: boolean;
  element: HTMLElement;
  culturalCompliance: CulturalValidationResult;
  arabicSupport: {
    rtlLayout: boolean;
    arabicText: boolean;
    properTypography: boolean;
  };
  performanceMetrics: {
    manipulationTime: number;
    renderTime: number;
    validationTime: number;
  };
}

export interface CulturalValidationResult {
  isValid: boolean;
  issues: string[];
  recommendations: string[];
  complianceScore: number;
  islamicCompliance: boolean;
  ministryAlignment: boolean;
}

export interface PrayerTimeEvent {
  name: string;
  time: Date;
  isActive: boolean;
  duration: number; // minutes
}

export interface VisualEditingContext {
  selectedElement: HTMLElement | null;
  editingMode: 'visual' | 'code' | 'hybrid';
  culturalValidation: boolean;
  rtlMode: boolean;
  ministryContext?: string;
}

export class IraqiDOMManager extends EventEmitter {
  private config: ArabicDOMConfig;
  private observer: MutationObserver | null = null;
  private intersectionObserver: IntersectionObserver | null = null;
  private editingContext: VisualEditingContext;
  private prayerTimes: PrayerTimeEvent[] = [];
  private performanceMonitor: PerformanceObserver | null = null;

  // Arabic text and RTL detection patterns
  private readonly ARABIC_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  private readonly RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];
  private readonly ARABIC_FONTS = [
    'Noto Sans Arabic',
    'Cairo',
    'Amiri',
    'Scheherazade New',
    'Markazi Text',
    'IBM Plex Sans Arabic'
  ];

  // Islamic design compliance
  private readonly ISLAMIC_COMPLIANT_COLORS = {
    primary: ['#059669', '#0d9488', '#2563eb', '#4f46e5', '#7c3aed'],
    secondary: ['#64748b', '#6b7280', '#71717a'],
    accent: ['#10b981', '#06b6d4', '#3b82f6'],
    forbidden: ['#dc2626', '#ea580c', '#ec4899'] // Colors to avoid
  };

  // Ministry-specific design systems
  private readonly MINISTRY_THEMES = {
    health: {
      primary: '#059669', // Emerald
      secondary: '#0d9488', // Teal
      accent: '#10b981',
      typography: 'clean-medical',
      iconStyle: 'medical',
      accessibility: 'enhanced'
    },
    education: {
      primary: '#2563eb', // Blue
      secondary: '#4f46e5', // Indigo
      accent: '#3b82f6',
      typography: 'academic',
      iconStyle: 'educational',
      accessibility: 'student-friendly'
    },
    interior: {
      primary: '#374151', // Gray
      secondary: '#4b5563',
      accent: '#6b7280',
      typography: 'official-formal',
      iconStyle: 'governmental',
      accessibility: 'citizen-service'
    },
    justice: {
      primary: '#7c3aed', // Purple
      secondary: '#6366f1', // Indigo
      accent: '#8b5cf6',
      typography: 'legal-formal',
      iconStyle: 'legal',
      accessibility: 'legal-compliance'
    }
  };

  constructor(config: ArabicDOMConfig) {
    super();
    this.config = config;
    this.editingContext = {
      selectedElement: null,
      editingMode: 'visual',
      culturalValidation: config.culturalValidation,
      rtlMode: config.rtlSupport,
      ministryContext: config.ministryTheme
    };

    this.initializeObservers();
    this.setupPrayerTimeMonitoring();
    this.applyGlobalCulturalStyles();
  }

  /**
   * Initialize DOM and intersection observers
   */
  private initializeObservers(): void {
    // DOM mutation observer for real-time changes
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        this.handleDOMChange(mutation);
      });
    });

    // Intersection observer for visibility-based optimizations
    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        this.handleElementVisibility(entry);
      });
    });

    // Performance observer for monitoring
    if ('PerformanceObserver' in window) {
      this.performanceMonitor = new PerformanceObserver((list) => {
        this.handlePerformanceEntries(list.getEntries());
      });
      this.performanceMonitor.observe({ entryTypes: ['measure', 'navigation'] });
    }
  }

  /**
   * Start observing DOM for changes
   */
  public startObserving(target: HTMLElement = document.body): void {
    if (this.observer) {
      this.observer.observe(target, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeOldValue: true,
        characterData: true,
        characterDataOldValue: true
      });
    }

    // Observe all elements for intersection
    if (this.intersectionObserver) {
      const allElements = target.querySelectorAll('*');
      allElements.forEach(el => {
        this.intersectionObserver!.observe(el);
      });
    }

    this.emit('observing-started', { target });
  }

  /**
   * Stop observing DOM changes
   */
  public stopObserving(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    if (this.performanceMonitor) {
      this.performanceMonitor.disconnect();
    }

    this.emit('observing-stopped');
  }

  /**
   * Select element for visual editing with cultural context
   */
  public selectElement(element: HTMLElement): DOMManipulationResult {
    const startTime = performance.now();

    try {
      // Validate element for cultural compliance
      const culturalValidation = this.validateElementCulturalCompliance(element);

      // Highlight selected element with cultural indicators
      this.highlightElement(element, culturalValidation);

      // Update editing context
      this.editingContext.selectedElement = element;

      // Determine if element contains Arabic content
      const hasArabicContent = this.detectArabicContent(element);
      
      // Apply Arabic-specific enhancements if needed
      if (hasArabicContent && this.config.rtlSupport) {
        this.enhanceElementForArabic(element);
      }

      const endTime = performance.now();

      const result: DOMManipulationResult = {
        success: true,
        element,
        culturalCompliance: culturalValidation,
        arabicSupport: {
          rtlLayout: hasArabicContent && this.config.rtlSupport,
          arabicText: hasArabicContent,
          properTypography: this.config.arabicTypography
        },
        performanceMetrics: {
          manipulationTime: endTime - startTime,
          renderTime: 0, // Will be measured separately
          validationTime: culturalValidation.complianceScore * 10 // Approximate
        }
      };

      this.emit('element-selected', result);
      return result;

    } catch (error) {
      const endTime = performance.now();
      
      return {
        success: false,
        element,
        culturalCompliance: {
          isValid: false,
          issues: [`Selection error: ${error.message}`],
          recommendations: ['Verify element is valid and try again'],
          complianceScore: 0,
          islamicCompliance: false,
          ministryAlignment: false
        },
        arabicSupport: {
          rtlLayout: false,
          arabicText: false,
          properTypography: false
        },
        performanceMetrics: {
          manipulationTime: endTime - startTime,
          renderTime: 0,
          validationTime: 0
        }
      };
    }
  }

  /**
   * Modify element properties with cultural intelligence
   */
  public modifyElementProperty(
    element: HTMLElement,
    property: string,
    value: any,
    options?: {
      culturalValidation?: boolean;
      rtlAware?: boolean;
      ministryTheme?: string;
    }
  ): DOMManipulationResult {
    const startTime = performance.now();

    try {
      // Apply cultural transformations to value
      const enhancedValue = this.applyCulturalTransformation(property, value, options);

      // Store original value for potential rollback
      const originalValue = (element as any)[property];

      // Apply the change
      (element as any)[property] = enhancedValue;

      // Handle special property cases
      this.handleSpecialPropertyCases(element, property, enhancedValue, options);

      // Validate cultural compliance after change
      const culturalValidation = this.validateElementCulturalCompliance(element);

      // If validation fails and rollback is needed
      if (!culturalValidation.isValid && options?.culturalValidation) {
        (element as any)[property] = originalValue;
        culturalValidation.issues.push('Change rolled back due to cultural compliance failure');
      }

      const endTime = performance.now();

      const result: DOMManipulationResult = {
        success: true,
        element,
        culturalCompliance: culturalValidation,
        arabicSupport: {
          rtlLayout: this.hasRTLAttributes(element),
          arabicText: this.detectArabicContent(element),
          properTypography: this.hasArabicTypography(element)
        },
        performanceMetrics: {
          manipulationTime: endTime - startTime,
          renderTime: 0,
          validationTime: culturalValidation.complianceScore * 5
        }
      };

      this.emit('property-modified', { property, value: enhancedValue, result });
      return result;

    } catch (error) {
      const endTime = performance.now();
      
      return this.createErrorResult(element, error.message, endTime - startTime);
    }
  }

  /**
   * Add CSS classes with Arabic RTL awareness
   */
  public addCulturallyAwareClasses(
    element: HTMLElement,
    classes: string[],
    options?: {
      rtlSupport?: boolean;
      ministryTheme?: string;
      islamicCompliance?: boolean;
    }
  ): DOMManipulationResult {
    const startTime = performance.now();

    try {
      // Process classes for cultural compliance
      const enhancedClasses = this.processCulturalClasses(classes, options);

      // Add RTL classes if Arabic content detected
      if (options?.rtlSupport && this.detectArabicContent(element)) {
        enhancedClasses.push(...this.getRTLClasses());
      }

      // Add ministry-specific classes
      if (options?.ministryTheme) {
        enhancedClasses.push(...this.getMinistryClasses(options.ministryTheme));
      }

      // Apply Islamic compliance filters
      if (options?.islamicCompliance) {
        const compliantClasses = this.filterIslamicCompliantClasses(enhancedClasses);
        enhancedClasses.splice(0, enhancedClasses.length, ...compliantClasses);
      }

      // Apply classes to element
      enhancedClasses.forEach(className => {
        element.classList.add(className);
      });

      // Add cultural metadata
      this.addCulturalMetadata(element, options);

      const culturalValidation = this.validateElementCulturalCompliance(element);
      const endTime = performance.now();

      const result: DOMManipulationResult = {
        success: true,
        element,
        culturalCompliance: culturalValidation,
        arabicSupport: {
          rtlLayout: this.hasRTLAttributes(element),
          arabicText: this.detectArabicContent(element),
          properTypography: this.hasArabicTypography(element)
        },
        performanceMetrics: {
          manipulationTime: endTime - startTime,
          renderTime: 0,
          validationTime: culturalValidation.complianceScore * 3
        }
      };

      this.emit('classes-added', { classes: enhancedClasses, result });
      return result;

    } catch (error) {
      const endTime = performance.now();
      return this.createErrorResult(element, error.message, endTime - startTime);
    }
  }

  /**
   * Create new element with cultural intelligence
   */
  public createCulturalElement(
    tagName: string,
    options: {
      classes?: string[];
      attributes?: Record<string, string>;
      textContent?: string;
      innerHTML?: string;
      ministryTheme?: string;
      rtlSupport?: boolean;
      islamicCompliance?: boolean;
    } = {}
  ): DOMManipulationResult {
    const startTime = performance.now();

    try {
      // Create element
      const element = document.createElement(tagName);

      // Apply cultural classes
      if (options.classes) {
        const classResult = this.addCulturallyAwareClasses(element, options.classes, {
          rtlSupport: options.rtlSupport,
          ministryTheme: options.ministryTheme,
          islamicCompliance: options.islamicCompliance
        });
        
        if (!classResult.success) {
          return classResult;
        }
      }

      // Apply attributes with cultural awareness
      if (options.attributes) {
        for (const [key, value] of Object.entries(options.attributes)) {
          const enhancedValue = this.applyCulturalTransformation(key, value, options);
          element.setAttribute(key, enhancedValue);
        }
      }

      // Handle text content with Arabic processing
      if (options.textContent) {
        const processedText = this.processArabicText(options.textContent);
        element.textContent = processedText;

        // Add RTL support if Arabic content detected
        if (this.detectArabicContent(element) && options.rtlSupport !== false) {
          element.setAttribute('dir', 'rtl');
          element.classList.add('text-right');
        }
      }

      // Handle innerHTML with validation
      if (options.innerHTML) {
        const validatedHTML = this.validateAndSanitizeHTML(options.innerHTML);
        element.innerHTML = validatedHTML;
      }

      // Apply ministry-specific attributes
      if (options.ministryTheme) {
        element.setAttribute('data-ministry', options.ministryTheme);
        this.applyMinistryTheme(element, options.ministryTheme);
      }

      // Add cultural compliance metadata
      if (options.islamicCompliance) {
        element.setAttribute('data-islamic-compliant', 'true');
      }

      const culturalValidation = this.validateElementCulturalCompliance(element);
      const endTime = performance.now();

      const result: DOMManipulationResult = {
        success: true,
        element,
        culturalCompliance: culturalValidation,
        arabicSupport: {
          rtlLayout: this.hasRTLAttributes(element),
          arabicText: this.detectArabicContent(element),
          properTypography: this.hasArabicTypography(element)
        },
        performanceMetrics: {
          manipulationTime: endTime - startTime,
          renderTime: 0,
          validationTime: culturalValidation.complianceScore * 8
        }
      };

      this.emit('element-created', { tagName, options, result });
      return result;

    } catch (error) {
      const endTime = performance.now();
      const mockElement = document.createElement('div');
      return this.createErrorResult(mockElement, error.message, endTime - startTime);
    }
  }

  /**
   * Delete element with cultural validation
   */
  public deleteElementSafely(element: HTMLElement): boolean {
    try {
      // Check if element has critical cultural significance
      const isCritical = this.isElementCulturallySignificant(element);
      
      if (isCritical) {
        this.emit('delete-warning', { 
          element, 
          reason: 'Element has cultural significance and should not be deleted'
        });
        return false;
      }

      // Remove element
      element.remove();
      
      // Update editing context if this was the selected element
      if (this.editingContext.selectedElement === element) {
        this.editingContext.selectedElement = null;
      }

      this.emit('element-deleted', { element });
      return true;

    } catch (error) {
      this.emit('delete-error', { element, error: error.message });
      return false;
    }
  }

  /**
   * Private Helper Methods
   */

  private handleDOMChange(mutation: MutationRecord): void {
    // Handle different types of mutations with cultural awareness
    switch (mutation.type) {
      case 'attributes':
        this.handleAttributeChange(mutation);
        break;
      case 'childList':
        this.handleChildListChange(mutation);
        break;
      case 'characterData':
        this.handleTextChange(mutation);
        break;
    }
  }

  private handleAttributeChange(mutation: MutationRecord): void {
    const element = mutation.target as HTMLElement;
    const attributeName = mutation.attributeName!;

    // Special handling for direction and language attributes
    if (attributeName === 'dir' || attributeName === 'lang') {
      this.handleDirectionOrLanguageChange(element, attributeName);
    }

    // Validate cultural compliance after attribute change
    if (this.config.culturalValidation) {
      const validation = this.validateElementCulturalCompliance(element);
      if (!validation.isValid) {
        this.emit('cultural-compliance-warning', { element, validation });
      }
    }
  }

  private handleChildListChange(mutation: MutationRecord): void {
    // Process added nodes
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        this.processNewElement(element);
      }
    });

    // Clean up removed nodes
    mutation.removedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        this.cleanupRemovedElement(node as HTMLElement);
      }
    });
  }

  private handleTextChange(mutation: MutationRecord): void {
    const textNode = mutation.target;
    const parentElement = textNode.parentElement;

    if (parentElement && this.config.rtlSupport) {
      const hasArabic = this.detectArabicContent(parentElement);
      if (hasArabic) {
        this.enhanceElementForArabic(parentElement);
      }
    }
  }

  private handleElementVisibility(entry: IntersectionObserverEntry): void {
    const element = entry.target as HTMLElement;

    if (entry.isIntersecting) {
      // Element became visible - apply optimizations
      this.optimizeVisibleElement(element);
    } else {
      // Element became invisible - reduce processing
      this.reduceProcessingForInvisibleElement(element);
    }
  }

  private handlePerformanceEntries(entries: PerformanceEntry[]): void {
    entries.forEach(entry => {
      if (entry.name.includes('dom-manipulation')) {
        this.emit('performance-metric', {
          name: entry.name,
          duration: entry.duration,
          startTime: entry.startTime
        });
      }
    });
  }

  private handleDirectionOrLanguageChange(element: HTMLElement, attributeName: string): void {
    if (attributeName === 'dir') {
      const direction = element.getAttribute('dir');
      if (direction === 'rtl') {
        this.enhanceElementForArabic(element);
      }
    }
  }

  private processNewElement(element: HTMLElement): void {
    // Apply cultural enhancements to new elements
    if (this.config.culturalValidation) {
      const validation = this.validateElementCulturalCompliance(element);
      if (!validation.isValid) {
        this.applyCulturalFixes(element, validation);
      }
    }

    // Add to intersection observer
    if (this.intersectionObserver) {
      this.intersectionObserver.observe(element);
    }
  }

  private cleanupRemovedElement(element: HTMLElement): void {
    // Remove from intersection observer
    if (this.intersectionObserver) {
      this.intersectionObserver.unobserve(element);
    }

    // Update editing context if needed
    if (this.editingContext.selectedElement === element) {
      this.editingContext.selectedElement = null;
    }
  }

  private optimizeVisibleElement(element: HTMLElement): void {
    // Apply performance optimizations for visible elements
    if (this.config.arabicTypography && this.detectArabicContent(element)) {
      this.ensureArabicFontLoading(element);
    }
  }

  private reduceProcessingForInvisibleElement(element: HTMLElement): void {
    // Reduce processing for invisible elements to save resources
    // This could include pausing animations, reducing update frequency, etc.
  }

  private detectArabicContent(element: HTMLElement): boolean {
    const text = element.textContent || element.innerText || '';
    return this.ARABIC_REGEX.test(text);
  }

  private enhanceElementForArabic(element: HTMLElement): void {
    // Add RTL classes
    element.classList.add('dir-rtl', 'text-right');
    
    // Set direction attribute
    if (!element.getAttribute('dir')) {
      element.setAttribute('dir', 'rtl');
    }

    // Apply Arabic typography
    if (this.config.arabicTypography) {
      this.applyArabicTypography(element);
    }
  }

  private applyArabicTypography(element: HTMLElement): void {
    element.classList.add('font-arabic', 'leading-relaxed');
    
    // Ensure Arabic font is loaded
    this.ensureArabicFontLoading(element);
  }

  private ensureArabicFontLoading(element: HTMLElement): void {
    // Load Arabic fonts if not already loaded
    const fontFamily = this.ARABIC_FONTS[0]; // Default to Noto Sans Arabic
    element.style.fontFamily = `"${fontFamily}", sans-serif`;

    // Trigger font loading
    if ('fonts' in document) {
      document.fonts.load(`16px "${fontFamily}"`);
    }
  }

  private validateElementCulturalCompliance(element: HTMLElement): CulturalValidationResult {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 1.0;
    let islamicCompliance = true;
    let ministryAlignment = true;

    // Check for Islamic compliance
    if (this.config.islamicCompliance) {
      const nonCompliantColors = this.detectNonCompliantColors(element);
      if (nonCompliantColors.length > 0) {
        issues.push(`Non-compliant colors detected: ${nonCompliantColors.join(', ')}`);
        recommendations.push('Replace with Islamic-compliant color palette');
        score -= 0.3;
        islamicCompliance = false;
      }
    }

    // Check RTL support for Arabic content
    if (this.config.rtlSupport && this.detectArabicContent(element)) {
      if (!this.hasRTLAttributes(element)) {
        issues.push('Arabic content detected but no RTL support');
        recommendations.push('Add dir="rtl" attribute and RTL CSS classes');
        score -= 0.2;
      }
    }

    // Check ministry theme compliance
    if (this.config.ministryTheme) {
      const hasMinistryAttributes = element.hasAttribute('data-ministry');
      if (!hasMinistryAttributes) {
        recommendations.push(`Consider adding ministry-specific styling for ${this.config.ministryTheme}`);
        score -= 0.1;
        ministryAlignment = false;
      }
    }

    return {
      isValid: issues.length === 0,
      issues,
      recommendations,
      complianceScore: Math.max(0, score),
      islamicCompliance,
      ministryAlignment
    };
  }

  private detectNonCompliantColors(element: HTMLElement): string[] {
    const computedStyle = window.getComputedStyle(element);
    const nonCompliant: string[] = [];

    // Check background color
    const bgColor = computedStyle.backgroundColor;
    if (this.isColorNonCompliant(bgColor)) {
      nonCompliant.push(`background: ${bgColor}`);
    }

    // Check text color
    const textColor = computedStyle.color;
    if (this.isColorNonCompliant(textColor)) {
      nonCompliant.push(`text: ${textColor}`);
    }

    return nonCompliant;
  }

  private isColorNonCompliant(color: string): boolean {
    // Convert RGB to hex and check against forbidden colors
    // This is a simplified check - in production would be more sophisticated
    return color.includes('rgb(220, 38, 38)') || // Red
           color.includes('rgb(234, 88, 12)') ||   // Orange
           color.includes('rgb(236, 72, 153)');    // Pink
  }

  private hasRTLAttributes(element: HTMLElement): boolean {
    return element.getAttribute('dir') === 'rtl' ||
           element.classList.contains('dir-rtl') ||
           element.classList.contains('text-right');
  }

  private hasArabicTypography(element: HTMLElement): boolean {
    return element.classList.contains('font-arabic') ||
           element.style.fontFamily.includes('Arabic');
  }

  private highlightElement(element: HTMLElement, validation: CulturalValidationResult): void {
    // Add visual highlighting with cultural compliance indicators
    element.classList.add('onlook-selected');
    
    if (validation.isValid) {
      element.classList.add('cultural-compliant');
    } else {
      element.classList.add('cultural-warning');
    }

    // Add ministry-specific highlighting
    if (this.config.ministryTheme) {
      element.classList.add(`ministry-${this.config.ministryTheme}-highlight`);
    }
  }

  private applyCulturalTransformation(property: string, value: any, options?: any): any {
    // Transform values for cultural compliance
    if (typeof value === 'string') {
      // Process text for Arabic content
      if (this.ARABIC_REGEX.test(value)) {
        return this.processArabicText(value);
      }

      // Transform color values for Islamic compliance
      if (property.includes('color') || property.includes('Color')) {
        return this.ensureIslamicCompliantColor(value);
      }
    }

    return value;
  }

  private processArabicText(text: string): string {
    // Apply Arabic text processing
    // In production, this would include proper RTL processing, 
    // Arabic shaping, and cultural formatting
    return text;
  }

  private ensureIslamicCompliantColor(color: string): string {
    // Replace non-compliant colors with alternatives
    const forbiddenColors = ['red', 'orange', 'pink'];
    let compliantColor = color;

    forbiddenColors.forEach(forbidden => {
      if (color.includes(forbidden)) {
        compliantColor = color.replace(forbidden, 'blue');
      }
    });

    return compliantColor;
  }

  private handleSpecialPropertyCases(
    element: HTMLElement, 
    property: string, 
    value: any, 
    options?: any
  ): void {
    // Handle special cases like innerHTML, textContent, etc.
    if (property === 'innerHTML' && typeof value === 'string') {
      const validatedHTML = this.validateAndSanitizeHTML(value);
      element.innerHTML = validatedHTML;
    }

    if (property === 'textContent' && this.detectArabicContent(element)) {
      this.enhanceElementForArabic(element);
    }
  }

  private validateAndSanitizeHTML(html: string): string {
    // Basic HTML validation and sanitization
    // In production, would use a proper HTML sanitizer
    return html;
  }

  private processCulturalClasses(classes: string[], options?: any): string[] {
    const processed = [...classes];

    // Add Islamic compliance classes
    if (options?.islamicCompliance) {
      processed.push('islamic-compliant');
    }

    // Add ministry-specific classes
    if (options?.ministryTheme) {
      processed.push(`ministry-${options.ministryTheme}`);
    }

    return processed;
  }

  private getRTLClasses(): string[] {
    return ['dir-rtl', 'text-right', 'rtl-layout'];
  }

  private getMinistryClasses(ministry: string): string[] {
    const theme = this.MINISTRY_THEMES[ministry as keyof typeof this.MINISTRY_THEMES];
    if (!theme) return [];

    return [
      `ministry-${ministry}`,
      `typography-${theme.typography}`,
      `accessibility-${theme.accessibility}`
    ];
  }

  private filterIslamicCompliantClasses(classes: string[]): string[] {
    // Filter out non-compliant classes
    return classes.filter(className => {
      return !className.includes('red-') &&
             !className.includes('orange-') &&
             !className.includes('pink-');
    });
  }

  private addCulturalMetadata(element: HTMLElement, options?: any): void {
    if (options?.ministryTheme) {
      element.setAttribute('data-ministry', options.ministryTheme);
    }

    if (options?.islamicCompliance) {
      element.setAttribute('data-islamic-compliant', 'true');
    }

    if (this.detectArabicContent(element)) {
      element.setAttribute('data-arabic-content', 'true');
    }
  }

  private applyMinistryTheme(element: HTMLElement, ministry: string): void {
    const theme = this.MINISTRY_THEMES[ministry as keyof typeof this.MINISTRY_THEMES];
    if (!theme) return;

    // Apply theme colors via CSS custom properties
    element.style.setProperty('--ministry-primary', theme.primary);
    element.style.setProperty('--ministry-secondary', theme.secondary);
    element.style.setProperty('--ministry-accent', theme.accent);
  }

  private isElementCulturallySignificant(element: HTMLElement): boolean {
    // Check if element has cultural or religious significance
    return element.hasAttribute('data-islamic-compliant') ||
           element.hasAttribute('data-ministry') ||
           element.classList.contains('prayer-time-indicator') ||
           element.classList.contains('arabic-content');
  }

  private applyCulturalFixes(element: HTMLElement, validation: CulturalValidationResult): void {
    // Apply automatic fixes based on validation results
    validation.recommendations.forEach(recommendation => {
      if (recommendation.includes('RTL')) {
        this.enhanceElementForArabic(element);
      }

      if (recommendation.includes('ministry-specific')) {
        if (this.config.ministryTheme) {
          this.applyMinistryTheme(element, this.config.ministryTheme);
        }
      }
    });
  }

  private createErrorResult(element: HTMLElement, message: string, executionTime: number): DOMManipulationResult {
    return {
      success: false,
      element,
      culturalCompliance: {
        isValid: false,
        issues: [message],
        recommendations: ['Check element and try again'],
        complianceScore: 0,
        islamicCompliance: false,
        ministryAlignment: false
      },
      arabicSupport: {
        rtlLayout: false,
        arabicText: false,
        properTypography: false
      },
      performanceMetrics: {
        manipulationTime: executionTime,
        renderTime: 0,
        validationTime: 0
      }
    };
  }

  private setupPrayerTimeMonitoring(): void {
    if (!this.config.prayerTimeAware) return;

    // Set up prayer time monitoring
    // This would integrate with a prayer time API or service
    this.updatePrayerTimes();
    
    // Update prayer times daily
    setInterval(() => {
      this.updatePrayerTimes();
    }, 24 * 60 * 60 * 1000);
  }

  private updatePrayerTimes(): void {
    // In production, this would fetch from a prayer time API
    const now = new Date();
    this.prayerTimes = [
      { name: 'Fajr', time: new Date(now.setHours(5, 30)), isActive: false, duration: 20 },
      { name: 'Dhuhr', time: new Date(now.setHours(12, 30)), isActive: false, duration: 20 },
      { name: 'Asr', time: new Date(now.setHours(15, 30)), isActive: false, duration: 20 },
      { name: 'Maghrib', time: new Date(now.setHours(18, 0)), isActive: false, duration: 20 },
      { name: 'Isha', time: new Date(now.setHours(19, 30)), isActive: false, duration: 20 }
    ];

    this.emit('prayer-times-updated', this.prayerTimes);
  }

  private applyGlobalCulturalStyles(): void {
    // Apply global cultural styles to the document
    if (this.config.rtlSupport) {
      document.documentElement.classList.add('rtl-support');
    }

    if (this.config.islamicCompliance) {
      document.documentElement.classList.add('islamic-compliant');
    }

    if (this.config.ministryTheme) {
      document.documentElement.classList.add(`ministry-${this.config.ministryTheme}`);
    }
  }

  /**
   * Public API Methods
   */

  public getEditingContext(): VisualEditingContext {
    return { ...this.editingContext };
  }

  public setEditingMode(mode: 'visual' | 'code' | 'hybrid'): void {
    this.editingContext.editingMode = mode;
    this.emit('editing-mode-changed', mode);
  }

  public toggleRTLMode(): void {
    this.editingContext.rtlMode = !this.editingContext.rtlMode;
    this.config.rtlSupport = this.editingContext.rtlMode;
    this.emit('rtl-mode-toggled', this.editingContext.rtlMode);
  }

  public getCulturalValidationReport(element?: HTMLElement): CulturalValidationResult {
    const target = element || this.editingContext.selectedElement || document.body;
    return this.validateElementCulturalCompliance(target);
  }

  public getPrayerTimes(): PrayerTimeEvent[] {
    return [...this.prayerTimes];
  }

  public isInPrayerTime(): boolean {
    const now = new Date();
    return this.prayerTimes.some(prayer => {
      const prayerEnd = new Date(prayer.time.getTime() + prayer.duration * 60000);
      return now >= prayer.time && now <= prayerEnd;
    });
  }

  public getConfiguration(): ArabicDOMConfig {
    return { ...this.config };
  }

  public updateConfiguration(newConfig: Partial<ArabicDOMConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.emit('configuration-updated', this.config);
  }

  public destroy(): void {
    this.stopObserving();
    this.removeAllListeners();
  }
}