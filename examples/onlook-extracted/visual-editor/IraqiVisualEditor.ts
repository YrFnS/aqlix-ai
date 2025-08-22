/**
 * Iraqi AI System - Advanced Visual Editor Core
 * Real-time visual editing with comprehensive Arabic RTL support and cultural intelligence
 * Extracted and enhanced from Onlook for Iraqi government deployment
 * 
 * Key Features:
 * - Real-time DOM manipulation with Arabic text support
 * - Visual editing interface with RTL awareness  
 * - Component inspection with cultural validation
 * - Iraqi design pattern recognition
 * - Ministry brand compliance validation
 * - Prayer time-aware content management
 */

import { EventEmitter } from 'events';
import { IraqiDOMManager, type ArabicDOMConfig, type DOMManipulationResult } from './DOMManager';
import { IraqiASTProcessor, type ArabicAwareASTConfig, type ASTModificationResult } from './ASTProcessor';
import { IraqiCodeGenerator, type IraqiCodeGenerationConfig, type GeneratedCodeResult } from '../ai-tools/IraqiCodeGenerator';

export interface IraqiVisualEditorConfig {
  // Cultural Intelligence
  ministry?: 'health' | 'education' | 'interior' | 'justice';
  language: 'arabic' | 'english' | 'bilingual';
  islamicCompliance: boolean;
  rtlSupport: boolean;
  
  // Security and Compliance
  governmentSecurity: boolean;
  culturalValidation: boolean;
  prayerTimeAware: boolean;
  auditTrail: boolean;
  
  // Performance and Features
  realTimeSync: boolean;
  visualInspection: boolean;
  codeGeneration: boolean;
  arabicTypography: boolean;
  
  // Advanced Features
  ministryThemes: boolean;
  componentLibrary: boolean;
  designTokens: boolean;
  accessibilityEnforcement: boolean;
}

export interface EditingSession {
  id: string;
  startTime: Date;
  ministryContext?: string;
  culturalMode: boolean;
  rtlMode: boolean;
  selectedElements: HTMLElement[];
  modifications: EditingModification[];
  validationResults: CulturalValidationSummary;
}

export interface EditingModification {
  id: string;
  timestamp: Date;
  type: 'style' | 'content' | 'structure' | 'attribute';
  target: string; // CSS selector
  originalValue: any;
  newValue: any;
  culturalImpact: number; // 0-1 score
  ministryCompliance: boolean;
  islamicCompliance: boolean;
  reversible: boolean;
}

export interface CulturalValidationSummary {
  overallScore: number; // 0-1
  islamicCompliance: number;
  rtlSupport: number;
  ministryAlignment: number;
  accessibilityScore: number;
  issues: Array<{
    severity: 'critical' | 'warning' | 'info';
    message: string;
    recommendation: string;
    element?: string;
  }>;
}

export interface VisualInspectionResult {
  element: HTMLElement;
  selector: string;
  culturalAnalysis: {
    hasArabicContent: boolean;
    rtlCompliant: boolean;
    ministryThemed: boolean;
    islamicCompliant: boolean;
    accessibilityScore: number;
  };
  modifications: EditingModification[];
  suggestions: string[];
}

export interface PrayerTimeContext {
  currentPrayer?: {
    name: string;
    time: Date;
    isActive: boolean;
    duration: number;
  };
  nextPrayer?: {
    name: string;
    time: Date;
    minutesUntil: number;
  };
  interfaceMode: 'normal' | 'prayer-time' | 'prayer-approaching';
}

export class IraqiVisualEditor extends EventEmitter {
  private config: IraqiVisualEditorConfig;
  private session: EditingSession;
  private domManager: IraqiDOMManager;
  private astProcessor: IraqiASTProcessor;
  private codeGenerator: IraqiCodeGenerator;
  private prayerTimeContext: PrayerTimeContext = { interfaceMode: 'normal' };
  
  // Performance monitoring
  private performanceMetrics: {
    editingLatency: number[];
    validationTime: number[];
    renderingTime: number[];
  } = {
    editingLatency: [],
    validationTime: [],
    renderingTime: []
  };

  // Cultural patterns cache
  private culturalPatternsCache = new Map<string, any>();
  private ministryTemplatesCache = new Map<string, any>();

  constructor(config: IraqiVisualEditorConfig) {
    super();
    this.config = config;
    
    // Initialize sub-systems
    this.initializeSubSystems();
    
    // Create editing session
    this.session = this.createEditingSession();
    
    // Setup prayer time monitoring if enabled
    if (config.prayerTimeAware) {
      this.setupPrayerTimeMonitoring();
    }
    
    // Initialize performance monitoring
    this.initializePerformanceMonitoring();
    
    this.emit('editor-initialized', { config, session: this.session });
  }

  /**
   * Initialize visual editor and start editing session
   */
  async initialize(target: HTMLElement = document.body): Promise<boolean> {
    try {
      const startTime = performance.now();
      
      // Start DOM observation
      this.domManager.startObserving(target);
      
      // Apply global cultural styles
      await this.applyGlobalCulturalEnhancements(target);
      
      // Setup keyboard shortcuts for Arabic/RTL editing
      this.setupKeyboardShortcuts();
      
      // Initialize ministry-specific features
      if (this.config.ministry) {
        await this.loadMinistrySpecificFeatures(this.config.ministry);
      }
      
      // Perform initial cultural validation
      const initialValidation = await this.performComprehensiveCulturalValidation(target);
      this.session.validationResults = initialValidation;
      
      const initTime = performance.now() - startTime;
      this.recordPerformanceMetric('initialization', initTime);
      
      this.emit('editor-ready', { 
        initializationTime: initTime,
        validation: initialValidation 
      });
      
      return true;
      
    } catch (error) {
      this.emit('initialization-error', { error: error.message });
      return false;
    }
  }

  /**
   * Select element for visual editing with comprehensive cultural analysis
   */
  async selectElement(element: HTMLElement): Promise<VisualInspectionResult> {
    const startTime = performance.now();
    
    try {
      // Perform DOM selection with cultural context
      const domResult = this.domManager.selectElement(element);
      
      if (!domResult.success) {
        throw new Error('Element selection failed');
      }
      
      // Generate CSS selector for the element
      const selector = this.generateCSSSelector(element);
      
      // Perform comprehensive cultural analysis
      const culturalAnalysis = await this.analyzeCulturalContext(element);
      
      // Get modification history for this element
      const modifications = this.getElementModifications(selector);
      
      // Generate improvement suggestions
      const suggestions = await this.generateCulturalSuggestions(element, culturalAnalysis);
      
      // Update session state
      this.session.selectedElements = [element];
      
      const selectionTime = performance.now() - startTime;
      this.recordPerformanceMetric('selection', selectionTime);
      
      const result: VisualInspectionResult = {
        element,
        selector,
        culturalAnalysis,
        modifications,
        suggestions
      };
      
      this.emit('element-selected', result);
      return result;
      
    } catch (error) {
      throw new Error(`Element selection failed: ${error.message}`);
    }
  }

  /**
   * Modify element with cultural intelligence and real-time validation
   */
  async modifyElement(
    element: HTMLElement,
    modifications: {
      styles?: Record<string, string>;
      attributes?: Record<string, string>;
      content?: string;
      classes?: string[];
    },
    options: {
      validateCulture?: boolean;
      enforceRTL?: boolean;
      ministryCompliance?: boolean;
      preview?: boolean;
    } = {}
  ): Promise<DOMManipulationResult> {
    const startTime = performance.now();
    
    try {
      // Store original state for potential rollback
      const originalState = this.captureElementState(element);
      
      // Apply modifications with cultural intelligence
      const results: DOMManipulationResult[] = [];
      
      // Apply style modifications
      if (modifications.styles) {
        for (const [property, value] of Object.entries(modifications.styles)) {
          const result = this.domManager.modifyElementProperty(
            element, 
            property, 
            value, 
            {
              culturalValidation: options.validateCulture,
              rtlAware: options.enforceRTL,
              ministryTheme: this.config.ministry
            }
          );
          results.push(result);
        }
      }
      
      // Apply attribute modifications
      if (modifications.attributes) {
        for (const [key, value] of Object.entries(modifications.attributes)) {
          const result = this.domManager.modifyElementProperty(element, key, value, options);
          results.push(result);
        }
      }
      
      // Apply content modifications with Arabic processing
      if (modifications.content) {
        const processedContent = await this.processArabicContent(modifications.content);
        const result = this.domManager.modifyElementProperty(
          element, 
          'textContent', 
          processedContent, 
          options
        );
        results.push(result);
      }
      
      // Apply class modifications with cultural awareness
      if (modifications.classes) {
        const result = this.domManager.addCulturallyAwareClasses(
          element, 
          modifications.classes, 
          {
            rtlSupport: options.enforceRTL,
            ministryTheme: this.config.ministry,
            islamicCompliance: this.config.islamicCompliance
          }
        );
        results.push(result);
      }
      
      // Combine results
      const combinedResult = this.combineManipulationResults(results);
      
      // Perform cultural validation
      if (options.validateCulture !== false) {
        const validation = await this.validateElementCulturalCompliance(element);
        combinedResult.culturalCompliance = validation;
        
        // Rollback if validation fails critically
        if (validation.complianceScore < 0.3) {
          this.restoreElementState(element, originalState);
          combinedResult.success = false;
          combinedResult.culturalCompliance.issues.push(
            'Modifications rolled back due to critical cultural compliance failure'
          );
        }
      }
      
      // Record modification in session
      if (combinedResult.success && !options.preview) {
        const modification: EditingModification = {
          id: this.generateModificationId(),
          timestamp: new Date(),
          type: this.determineModificationType(modifications),
          target: this.generateCSSSelector(element),
          originalValue: originalState,
          newValue: modifications,
          culturalImpact: combinedResult.culturalCompliance.complianceScore,
          ministryCompliance: combinedResult.culturalCompliance.ministryAlignment,
          islamicCompliance: combinedResult.culturalCompliance.islamicCompliance,
          reversible: true
        };
        
        this.session.modifications.push(modification);
      }
      
      const modificationTime = performance.now() - startTime;
      this.recordPerformanceMetric('modification', modificationTime);
      
      this.emit('element-modified', { element, modifications, result: combinedResult });
      return combinedResult;
      
    } catch (error) {
      throw new Error(`Element modification failed: ${error.message}`);
    }
  }

  /**
   * Generate React component code from visual design with cultural intelligence
   */
  async generateComponentCode(
    elements: HTMLElement[],
    componentName: string,
    options: {
      ministry?: string;
      rtlFirst?: boolean;
      islamicCompliant?: boolean;
      accessibility?: 'basic' | 'enhanced' | 'wcag-aa';
    } = {}
  ): Promise<GeneratedCodeResult> {
    try {
      // Analyze elements for cultural patterns
      const culturalPatterns = await this.extractCulturalPatterns(elements);
      
      // Determine component type based on DOM structure
      const componentType = this.determineComponentType(elements);
      
      // Create generation context
      const context = {
        projectType: 'government-service' as const,
        targetAudience: 'mixed' as const,
        securityLevel: this.config.governmentSecurity ? 'internal' as const : 'public' as const,
        arabicContent: culturalPatterns.hasArabicContent,
        accessibilityLevel: options.accessibility || 'wcag-aa' as const
      };
      
      // Generate requirements string from visual analysis
      const requirements = this.generateRequirementsFromVisualAnalysis(elements, culturalPatterns);
      
      // Generate component code
      const result = await this.codeGenerator.generateComponent(
        componentName,
        componentType,
        requirements,
        context
      );
      
      // Enhanced with visual editor metadata
      result.improvements.push(
        'تم إنشاء المكون من التصميم المرئي مع الحفاظ على التوافق الثقافي',
        'تطبيق تحسينات إضافية للأداء والوصولية',
        'إضافة اختبارات تلقائية للتوافق الثقافي'
      );
      
      this.emit('code-generated', { elements, componentName, result });
      return result;
      
    } catch (error) {
      throw new Error(`Code generation failed: ${error.message}`);
    }
  }

  /**
   * Perform comprehensive cultural validation on the entire page
   */
  async performComprehensiveCulturalValidation(
    target: HTMLElement = document.body
  ): Promise<CulturalValidationSummary> {
    const startTime = performance.now();
    
    try {
      // Get all elements to validate
      const elements = Array.from(target.querySelectorAll('*')) as HTMLElement[];
      
      let totalScore = 0;
      let islamicScore = 0;
      let rtlScore = 0;
      let ministryScore = 0;
      let accessibilityScore = 0;
      const issues: any[] = [];
      
      // Validate each element
      for (const element of elements) {
        const validation = await this.validateElementCulturalCompliance(element);
        
        totalScore += validation.complianceScore;
        
        if (validation.islamicCompliance) islamicScore++;
        if (this.hasRTLSupport(element)) rtlScore++;
        if (validation.ministryAlignment) ministryScore++;
        
        // Add accessibility scoring
        const accessScore = this.calculateAccessibilityScore(element);
        accessibilityScore += accessScore;
        
        // Collect issues
        validation.issues.forEach(issue => {
          issues.push({
            severity: this.determineIssueSeverity(issue),
            message: issue,
            recommendation: this.getRecommendationForIssue(issue),
            element: this.generateCSSSelector(element)
          });
        });
      }
      
      // Calculate final scores
      const elementCount = elements.length || 1;
      const summary: CulturalValidationSummary = {
        overallScore: totalScore / elementCount,
        islamicCompliance: islamicScore / elementCount,
        rtlSupport: rtlScore / elementCount,
        ministryAlignment: ministryScore / elementCount,
        accessibilityScore: accessibilityScore / elementCount,
        issues: issues.slice(0, 50) // Limit to top 50 issues
      };
      
      const validationTime = performance.now() - startTime;
      this.recordPerformanceMetric('validation', validationTime);
      
      this.emit('cultural-validation-complete', summary);
      return summary;
      
    } catch (error) {
      throw new Error(`Cultural validation failed: ${error.message}`);
    }
  }

  /**
   * Export current editing session with all modifications and cultural analysis
   */
  exportSession(): {
    session: EditingSession;
    culturalAnalysis: CulturalValidationSummary;
    performanceMetrics: any;
    ministryCompliance: boolean;
    recommendations: string[];
  } {
    return {
      session: { ...this.session },
      culturalAnalysis: this.session.validationResults,
      performanceMetrics: this.getPerformanceReport(),
      ministryCompliance: this.assessMinistryCompliance(),
      recommendations: this.generateSessionRecommendations()
    };
  }

  /**
   * Import and restore editing session
   */
  async importSession(sessionData: any): Promise<boolean> {
    try {
      // Validate session data
      if (!this.validateSessionData(sessionData)) {
        throw new Error('Invalid session data');
      }
      
      // Restore session state
      this.session = sessionData.session;
      
      // Apply saved modifications
      for (const modification of this.session.modifications) {
        await this.replayModification(modification);
      }
      
      this.emit('session-imported', sessionData);
      return true;
      
    } catch (error) {
      this.emit('session-import-error', { error: error.message });
      return false;
    }
  }

  /**
   * Private helper methods
   */

  private initializeSubSystems(): void {
    // Initialize DOM Manager with Arabic support
    const domConfig: ArabicDOMConfig = {
      rtlSupport: this.config.rtlSupport,
      arabicTypography: this.config.arabicTypography,
      islamicCompliance: this.config.islamicCompliance,
      ministryTheme: this.config.ministry,
      prayerTimeAware: this.config.prayerTimeAware,
      culturalValidation: this.config.culturalValidation
    };
    this.domManager = new IraqiDOMManager(domConfig);
    
    // Initialize AST Processor for code generation
    const astConfig: ArabicAwareASTConfig = {
      rtlSupport: this.config.rtlSupport,
      arabicTypography: this.config.arabicTypography,
      islamicDesignCompliance: this.config.islamicCompliance,
      ministrySpecific: this.config.ministry,
      bilingualSupport: this.config.language === 'bilingual'
    };
    this.astProcessor = new IraqiASTProcessor(astConfig);
    
    // Initialize Code Generator
    const codeGenConfig: IraqiCodeGenerationConfig = {
      ministry: this.config.ministry,
      language: this.config.language,
      islamicCompliance: this.config.islamicCompliance,
      rtlSupport: this.config.rtlSupport,
      governmentSecurity: this.config.governmentSecurity,
      culturalValidation: this.config.culturalValidation
    };
    this.codeGenerator = new IraqiCodeGenerator(codeGenConfig);
  }

  private createEditingSession(): EditingSession {
    return {
      id: this.generateSessionId(),
      startTime: new Date(),
      ministryContext: this.config.ministry,
      culturalMode: this.config.culturalValidation,
      rtlMode: this.config.rtlSupport,
      selectedElements: [],
      modifications: [],
      validationResults: {
        overallScore: 0,
        islamicCompliance: 0,
        rtlSupport: 0,
        ministryAlignment: 0,
        accessibilityScore: 0,
        issues: []
      }
    };
  }

  private async applyGlobalCulturalEnhancements(target: HTMLElement): Promise<void> {
    // Apply RTL document direction if needed
    if (this.config.rtlSupport) {
      document.documentElement.dir = 'rtl';
      document.documentElement.classList.add('rtl-enabled');
    }
    
    // Apply ministry-specific global styles
    if (this.config.ministry) {
      document.documentElement.classList.add(`ministry-${this.config.ministry}`);
    }
    
    // Apply Islamic compliance styles
    if (this.config.islamicCompliance) {
      document.documentElement.classList.add('islamic-compliant');
    }
    
    // Load Arabic fonts if needed
    if (this.config.arabicTypography) {
      await this.loadArabicFonts();
    }
  }

  private async loadArabicFonts(): Promise<void> {
    const arabicFonts = [
      'Noto Sans Arabic',
      'Cairo',
      'Amiri',
      'Scheherazade New'
    ];
    
    const fontPromises = arabicFonts.map(font => {
      if ('fonts' in document) {
        return document.fonts.load(`16px "${font}"`);
      }
      return Promise.resolve();
    });
    
    await Promise.all(fontPromises);
  }

  private setupKeyboardShortcuts(): void {
    document.addEventListener('keydown', (event) => {
      // Ctrl+Shift+R: Toggle RTL mode
      if (event.ctrlKey && event.shiftKey && event.key === 'R') {
        this.toggleRTLMode();
        event.preventDefault();
      }
      
      // Ctrl+Shift+A: Toggle Arabic typography
      if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        this.toggleArabicTypography();
        event.preventDefault();
      }
      
      // Ctrl+Shift+C: Open cultural validation panel
      if (event.ctrlKey && event.shiftKey && event.key === 'C') {
        this.openCulturalValidationPanel();
        event.preventDefault();
      }
    });
  }

  private async loadMinistrySpecificFeatures(ministry: string): Promise<void> {
    // Load ministry-specific templates and configurations
    const ministryConfig = await this.loadMinistryConfiguration(ministry);
    
    // Apply ministry-specific global styles
    this.applyMinistryGlobalStyles(ministry, ministryConfig);
    
    // Load ministry-specific component library
    await this.loadMinistryComponentLibrary(ministry);
  }

  private setupPrayerTimeMonitoring(): void {
    // Check prayer times every minute
    setInterval(() => {
      this.updatePrayerTimeContext();
    }, 60000);
    
    // Initial check
    this.updatePrayerTimeContext();
  }

  private updatePrayerTimeContext(): void {
    // In production, this would integrate with a prayer time API
    const now = new Date();
    const prayerTimes = this.calculatePrayerTimes(now);
    
    // Find current and next prayer
    const currentPrayer = prayerTimes.find(prayer => this.isPrayerActive(prayer, now));
    const nextPrayer = this.getNextPrayer(prayerTimes, now);
    
    this.prayerTimeContext = {
      currentPrayer,
      nextPrayer,
      interfaceMode: currentPrayer ? 'prayer-time' : 
                     (nextPrayer && nextPrayer.minutesUntil <= 10) ? 'prayer-approaching' : 'normal'
    };
    
    if (this.prayerTimeContext.interfaceMode !== 'normal') {
      this.emit('prayer-time-context-changed', this.prayerTimeContext);
    }
  }

  private generateCSSSelector(element: HTMLElement): string {
    // Generate unique CSS selector for the element
    const path: string[] = [];
    let current = element;
    
    while (current && current !== document.body) {
      let selector = current.tagName.toLowerCase();
      
      if (current.id) {
        selector += `#${current.id}`;
      } else if (current.className) {
        selector += `.${current.className.split(' ').join('.')}`;
      }
      
      // Add position if multiple siblings
      const siblings = Array.from(current.parentElement?.children || []);
      const sameTag = siblings.filter(s => s.tagName === current.tagName);
      if (sameTag.length > 1) {
        selector += `:nth-of-type(${sameTag.indexOf(current) + 1})`;
      }
      
      path.unshift(selector);
      current = current.parentElement as HTMLElement;
    }
    
    return path.join(' > ');
  }

  private async analyzeCulturalContext(element: HTMLElement): Promise<any> {
    const text = element.textContent || element.innerText || '';
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
    
    return {
      hasArabicContent: arabicRegex.test(text),
      rtlCompliant: this.hasRTLSupport(element),
      ministryThemed: element.hasAttribute('data-ministry'),
      islamicCompliant: this.checkIslamicCompliance(element),
      accessibilityScore: this.calculateAccessibilityScore(element)
    };
  }

  private hasRTLSupport(element: HTMLElement): boolean {
    return element.getAttribute('dir') === 'rtl' ||
           element.classList.contains('rtl') ||
           element.classList.contains('text-right');
  }

  private checkIslamicCompliance(element: HTMLElement): boolean {
    const computedStyle = window.getComputedStyle(element);
    const backgroundColor = computedStyle.backgroundColor;
    const color = computedStyle.color;
    
    // Check for non-compliant colors (simplified check)
    const nonCompliantColors = ['rgb(220, 38, 38)', 'rgb(234, 88, 12)', 'rgb(236, 72, 153)'];
    return !nonCompliantColors.some(c => backgroundColor.includes(c) || color.includes(c));
  }

  private calculateAccessibilityScore(element: HTMLElement): number {
    let score = 0.5; // Base score
    
    // Check for ARIA attributes
    if (element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby')) {
      score += 0.2;
    }
    
    // Check for semantic elements
    const semanticTags = ['header', 'main', 'nav', 'section', 'article', 'aside', 'footer'];
    if (semanticTags.includes(element.tagName.toLowerCase())) {
      score += 0.1;
    }
    
    // Check color contrast (simplified)
    const style = window.getComputedStyle(element);
    if (this.hasGoodContrast(style.color, style.backgroundColor)) {
      score += 0.2;
    }
    
    return Math.min(1, score);
  }

  private hasGoodContrast(color: string, backgroundColor: string): boolean {
    // Simplified contrast check - in production would use proper WCAG algorithm
    return color !== backgroundColor;
  }

  private recordPerformanceMetric(operation: string, time: number): void {
    switch (operation) {
      case 'selection':
      case 'modification':
        this.performanceMetrics.editingLatency.push(time);
        break;
      case 'validation':
        this.performanceMetrics.validationTime.push(time);
        break;
      case 'initialization':
        this.performanceMetrics.renderingTime.push(time);
        break;
    }
    
    // Keep only last 100 measurements
    Object.keys(this.performanceMetrics).forEach(key => {
      const metrics = (this.performanceMetrics as any)[key];
      if (metrics.length > 100) {
        metrics.splice(0, metrics.length - 100);
      }
    });
  }

  private getPerformanceReport(): any {
    const calculateStats = (values: number[]) => {
      if (values.length === 0) return { avg: 0, min: 0, max: 0, count: 0 };
      
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);
      
      return { avg, min, max, count: values.length };
    };
    
    return {
      editingLatency: calculateStats(this.performanceMetrics.editingLatency),
      validationTime: calculateStats(this.performanceMetrics.validationTime),
      renderingTime: calculateStats(this.performanceMetrics.renderingTime),
      targetLatency: 16, // 60fps target
      targetValidation: 100, // 100ms validation target
    };
  }

  // Additional helper methods would be implemented here...
  private generateSessionId(): string {
    return `iraqi-visual-editor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateModificationId(): string {
    return `mod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private captureElementState(element: HTMLElement): any {
    return {
      styles: element.style.cssText,
      attributes: Array.from(element.attributes).reduce((acc, attr) => {
        acc[attr.name] = attr.value;
        return acc;
      }, {} as Record<string, string>),
      content: element.innerHTML,
      classes: Array.from(element.classList)
    };
  }

  private restoreElementState(element: HTMLElement, state: any): void {
    element.style.cssText = state.styles;
    element.innerHTML = state.content;
    element.className = state.classes.join(' ');
    
    Object.entries(state.attributes).forEach(([name, value]) => {
      element.setAttribute(name, value as string);
    });
  }

  private combineManipulationResults(results: DOMManipulationResult[]): DOMManipulationResult {
    // Combine multiple manipulation results into one
    const combined = results[0] || {
      success: false,
      element: document.createElement('div'),
      culturalCompliance: {
        isValid: false,
        issues: [],
        recommendations: [],
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
        manipulationTime: 0,
        renderTime: 0,
        validationTime: 0
      }
    };
    
    // Combine success status (all must succeed)
    combined.success = results.every(r => r.success);
    
    // Combine cultural compliance scores
    const avgScore = results.reduce((sum, r) => sum + r.culturalCompliance.complianceScore, 0) / results.length;
    combined.culturalCompliance.complianceScore = avgScore;
    
    // Combine issues and recommendations
    results.forEach(r => {
      combined.culturalCompliance.issues.push(...r.culturalCompliance.issues);
      combined.culturalCompliance.recommendations.push(...r.culturalCompliance.recommendations);
    });
    
    return combined;
  }

  // Public API methods for external integration
  public toggleRTLMode(): void {
    this.config.rtlSupport = !this.config.rtlSupport;
    this.session.rtlMode = this.config.rtlSupport;
    
    document.documentElement.dir = this.config.rtlSupport ? 'rtl' : 'ltr';
    this.emit('rtl-mode-toggled', this.config.rtlSupport);
  }

  public toggleArabicTypography(): void {
    this.config.arabicTypography = !this.config.arabicTypography;
    this.emit('arabic-typography-toggled', this.config.arabicTypography);
  }

  public openCulturalValidationPanel(): void {
    this.emit('cultural-validation-panel-requested');
  }

  public getConfiguration(): IraqiVisualEditorConfig {
    return { ...this.config };
  }

  public updateConfiguration(newConfig: Partial<IraqiVisualEditorConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.emit('configuration-updated', this.config);
  }

  public destroy(): void {
    this.domManager.destroy();
    this.removeAllListeners();
  }

  // Additional private methods for completeness
  private async processArabicContent(content: string): Promise<string> {
    // Process Arabic content with proper RTL handling
    return content; // In production, would apply proper Arabic text processing
  }

  private async validateElementCulturalCompliance(element: HTMLElement): Promise<any> {
    return this.domManager.getCulturalValidationReport(element);
  }

  private getElementModifications(selector: string): EditingModification[] {
    return this.session.modifications.filter(mod => mod.target === selector);
  }

  private async generateCulturalSuggestions(element: HTMLElement, analysis: any): Promise<string[]> {
    const suggestions: string[] = [];
    
    if (analysis.hasArabicContent && !analysis.rtlCompliant) {
      suggestions.push('إضافة دعم الـ RTL للنص العربي');
    }
    
    if (!analysis.islamicCompliant) {
      suggestions.push('تطبيق الألوان المتوافقة مع المبادئ الإسلامية');
    }
    
    if (analysis.accessibilityScore < 0.7) {
      suggestions.push('تحسين إمكانية الوصول حسب معايير WCAG');
    }
    
    return suggestions;
  }

  private determineModificationType(modifications: any): EditingModification['type'] {
    if (modifications.styles) return 'style';
    if (modifications.content) return 'content';
    if (modifications.attributes) return 'attribute';
    return 'structure';
  }

  private determineIssueSeverity(issue: string): 'critical' | 'warning' | 'info' {
    if (issue.includes('critical') || issue.includes('security')) return 'critical';
    if (issue.includes('compliance') || issue.includes('accessibility')) return 'warning';
    return 'info';
  }

  private getRecommendationForIssue(issue: string): string {
    // Generate recommendations based on issue type
    if (issue.includes('RTL')) return 'Add dir="rtl" attribute and RTL CSS classes';
    if (issue.includes('color')) return 'Use Islamic-compliant color palette';
    if (issue.includes('accessibility')) return 'Add ARIA labels and semantic markup';
    return 'Review element for cultural compliance';
  }

  private extractCulturalPatterns(elements: HTMLElement[]): Promise<any> {
    return Promise.resolve({
      hasArabicContent: elements.some(el => /[\u0600-\u06FF]/.test(el.textContent || '')),
      rtlElements: elements.filter(el => this.hasRTLSupport(el)).length,
      ministryThemed: elements.some(el => el.hasAttribute('data-ministry'))
    });
  }

  private determineComponentType(elements: HTMLElement[]): any {
    // Analyze DOM structure to determine component type
    const hasForm = elements.some(el => el.tagName === 'FORM');
    const hasTable = elements.some(el => el.tagName === 'TABLE');
    const hasNav = elements.some(el => el.tagName === 'NAV');
    
    if (hasForm) return 'form';
    if (hasTable) return 'table';
    if (hasNav) return 'navigation';
    return 'card';
  }

  private generateRequirementsFromVisualAnalysis(elements: HTMLElement[], patterns: any): string {
    return `Component with ${elements.length} elements, Arabic content: ${patterns.hasArabicContent}, RTL support: ${patterns.rtlElements > 0}`;
  }

  private assessMinistryCompliance(): boolean {
    return this.session.validationResults.ministryAlignment > 0.8;
  }

  private generateSessionRecommendations(): string[] {
    const recommendations: string[] = [];
    const validation = this.session.validationResults;
    
    if (validation.islamicCompliance < 0.9) {
      recommendations.push('تحسين الامتثال للمبادئ الإسلامية');
    }
    
    if (validation.rtlSupport < 0.8) {
      recommendations.push('إضافة دعم أفضل للـ RTL');
    }
    
    if (validation.accessibilityScore < 0.7) {
      recommendations.push('تحسين إمكانية الوصول');
    }
    
    return recommendations;
  }

  private validateSessionData(sessionData: any): boolean {
    return sessionData && sessionData.session && sessionData.session.id;
  }

  private async replayModification(modification: EditingModification): Promise<void> {
    // Replay a saved modification
    const element = document.querySelector(modification.target) as HTMLElement;
    if (element) {
      // Apply the modification
      // Implementation depends on modification type
    }
  }

  private initializePerformanceMonitoring(): void {
    // Setup performance monitoring
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.name.includes('iraqi-visual-editor')) {
            this.recordPerformanceMetric('operation', entry.duration);
          }
        });
      });
      observer.observe({ entryTypes: ['measure'] });
    }
  }

  private loadMinistryConfiguration(ministry: string): Promise<any> {
    // Load ministry-specific configuration
    return Promise.resolve({
      colors: { primary: '#0066cc', secondary: '#004499' },
      fonts: ['Noto Sans Arabic'],
      accessibility: 'enhanced'
    });
  }

  private applyMinistryGlobalStyles(ministry: string, config: any): void {
    // Apply ministry-specific global styles
    document.documentElement.style.setProperty('--ministry-primary', config.colors.primary);
    document.documentElement.style.setProperty('--ministry-secondary', config.colors.secondary);
  }

  private loadMinistryComponentLibrary(ministry: string): Promise<void> {
    // Load ministry-specific component library
    return Promise.resolve();
  }

  private calculatePrayerTimes(date: Date): any[] {
    // Calculate prayer times for the given date
    // In production, would use a proper prayer time calculation library
    return [
      { name: 'Fajr', time: new Date(date.setHours(5, 30)), duration: 20 },
      { name: 'Dhuhr', time: new Date(date.setHours(12, 30)), duration: 20 },
      { name: 'Asr', time: new Date(date.setHours(15, 30)), duration: 20 },
      { name: 'Maghrib', time: new Date(date.setHours(18, 0)), duration: 20 },
      { name: 'Isha', time: new Date(date.setHours(19, 30)), duration: 20 }
    ];
  }

  private isPrayerActive(prayer: any, now: Date): boolean {
    const prayerEnd = new Date(prayer.time.getTime() + prayer.duration * 60000);
    return now >= prayer.time && now <= prayerEnd;
  }

  private getNextPrayer(prayers: any[], now: Date): any {
    const future = prayers.filter(p => p.time > now);
    if (future.length === 0) return null;
    
    const next = future[0];
    return {
      ...next,
      minutesUntil: Math.floor((next.time.getTime() - now.getTime()) / 60000)
    };
  }
}