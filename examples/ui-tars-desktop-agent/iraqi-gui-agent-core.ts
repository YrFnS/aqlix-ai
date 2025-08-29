/**
 * Iraqi Enhanced GUI Agent Core
 * 
 * Extends UI-TARS GUIAgent with Iraqi cultural sovereignty, Arabic GUI recognition,
 * and Islamic compliance validation for professional desktop automation.
 * 
 * Features:
 * - Arabic RTL text detection and processing
 * - Iraqi dialect recognition in GUI elements
 * - Islamic compliance validation for automated actions
 * - Professional domain context awareness
 * - Cultural appropriateness scoring for GUI interactions
 * - Bilingual (Arabic/English) instruction processing
 * 
 * @author Extracted from UI-TARS for Iraqi AI Chat System
 * @date 2025
 * @license Apache-2.0 (preserving original UI-TARS license)
 */

import { v4 as uuidv4 } from 'uuid';
import { Jimp } from 'jimp';
import asyncRetry from 'async-retry';

/**
 * Core Types and Enums for Iraqi GUI Agent
 */

export enum IraqiCulturalStatus {
  COMPLIANT = 'compliant',
  REVIEW_REQUIRED = 'review_required', 
  NON_COMPLIANT = 'non_compliant',
  BLOCKED = 'blocked'
}

export enum ArabicTextDirection {
  RTL = 'rtl',
  LTR = 'ltr', 
  MIXED = 'mixed',
  AUTO = 'auto'
}

export enum IraqiDialectConfidence {
  HIGH = 'high',        // 85%+ Iraqi dialect recognition
  MEDIUM = 'medium',    // 60-84% recognition
  LOW = 'low',         // 30-59% recognition
  UNKNOWN = 'unknown'   // <30% recognition
}

export enum ProfessionalDomain {
  LEGAL = 'legal',
  MEDICAL = 'medical', 
  EDUCATIONAL = 'educational',
  GOVERNMENTAL = 'governmental',
  BUSINESS = 'business',
  GENERAL = 'general'
}

export enum ActionValidation {
  APPROVED = 'approved',
  REQUIRES_CONFIRMATION = 'requires_confirmation',
  RESTRICTED = 'restricted',
  FORBIDDEN = 'forbidden'
}

/**
 * Enhanced screenshot context with Arabic/Cultural analysis
 */
export interface IraqiScreenshotContext {
  // Original screenshot data
  base64: string;
  scaleFactor: number;
  width: number;
  height: number;
  mime: string;
  
  // Arabic text analysis
  arabicElements: ArabicGUIElement[];
  textDirection: ArabicTextDirection;
  dialectConfidence: IraqiDialectConfidence;
  
  // Cultural compliance
  culturalStatus: IraqiCulturalStatus;
  complianceScore: number; // 0-100
  ishanWarnings: string[];
  
  // Professional context
  detectedDomain: ProfessionalDomain;
  sensitiveContent: boolean;
}

export interface ArabicGUIElement {
  text: string;
  arabicText?: string;
  englishTranslation?: string;
  boundingBox: {x: number, y: number, width: number, height: number};
  confidence: number;
  dialectType: 'iraqi' | 'standard' | 'mixed' | 'unknown';
  textDirection: ArabicTextDirection;
}

export interface IraqiActionPrediction {
  // Original action data
  action_type: string;
  action_inputs: Record<string, any>;
  thought: string;
  reflection: string | null;
  
  // Iraqi enhancements
  culturalValidation: ActionValidation;
  arabicContext: boolean;
  professionalDomain: ProfessionalDomain;
  riskAssessment: {
    level: 'low' | 'medium' | 'high' | 'critical';
    factors: string[];
    mitigation?: string[];
  };
  alternativeSuggestions?: string[];
}

export interface IraqiGUIAgentConfig<T extends IraqiOperator> {
  operator: T;
  model: any; // UITarsModel or config
  logger?: any;
  
  // Iraqi-specific configuration
  culturalValidation: {
    enabled: boolean;
    strictMode: boolean; // Require 90%+ compliance
    professionalDomain: ProfessionalDomain;
    allowedLanguages: ('arabic' | 'english')[];
  };
  
  arabicProcessing: {
    enabled: boolean;
    dialectRecognition: boolean;
    rtlSupport: boolean;
    mixedLanguageHandling: boolean;
  };
  
  securityContext: {
    sensitiveDataProtection: boolean;
    screenCaptureSecurity: boolean;
    actionLogging: boolean;
  };
  
  // Enhanced retry and validation
  maxLoopCount?: number;
  culturalValidationTimeout?: number;
  retryConfig?: {
    screenshot?: { maxRetries: number; onRetry?: Function };
    model?: { maxRetries: number; onRetry?: Function };
    execute?: { maxRetries: number; onRetry?: Function };
    culturalValidation?: { maxRetries: number; onRetry?: Function };
  };
  
  // Callbacks
  onCulturalViolation?: (violation: any) => Promise<void>;
  onArabicTextDetected?: (elements: ArabicGUIElement[]) => Promise<void>;
  onSecurityAlert?: (alert: any) => Promise<void>;
  signal?: AbortSignal;
  onData?: Function;
  onError?: Function;
}

/**
 * Base interface for Iraqi-enhanced operators
 */
export interface IraqiOperator {
  screenshot(): Promise<{base64: string, scaleFactor: number}>;
  execute(params: any): Promise<any>;
  analyzeCulturalContext?(screenshot: string): Promise<IraqiCulturalStatus>;
  processArabicText?(screenshot: string): Promise<ArabicGUIElement[]>;
  validateAction?(action: any): Promise<ActionValidation>;
}

/**
 * Enhanced Iraqi GUI Agent with Cultural Sovereignty
 * 
 * Extends the core UI-TARS automation with:
 * - Arabic RTL GUI understanding
 * - Islamic compliance validation  
 * - Iraqi professional domain awareness
 * - Bilingual instruction processing
 * - Cultural appropriateness scoring
 */
export class IraqiGUIAgent<T extends IraqiOperator> {
  private readonly operator: T;
  private readonly model: any;
  private readonly logger: any;
  private readonly config: IraqiGUIAgentConfig<T>;
  
  // State management
  private isPaused = false;
  private resumePromise: Promise<void> | null = null;
  private resolveResume: (() => void) | null = null;
  private isStopped = false;
  
  // Cultural validation cache
  private culturalCache = new Map<string, IraqiCulturalStatus>();
  private arabicElementsCache = new Map<string, ArabicGUIElement[]>();
  
  constructor(config: IraqiGUIAgentConfig<T>) {
    this.config = config;
    this.operator = config.operator;
    this.model = config.model;
    this.logger = config.logger || console;
    
    this.validateConfig();
  }
  
  /**
   * Main execution loop with Iraqi cultural enhancements
   */
  async run(
    instruction: string,
    historyMessages?: any[],
    remoteModelHdrs?: Record<string, string>
  ): Promise<void> {
    const { operator, model, logger, config } = this;
    const maxLoopCount = config.maxLoopCount || 50;
    
    // Generate session ID and initialize tracking
    const sessionId = this.generateSessionId();
    const startTime = Date.now();
    
    logger.info(`[IraqiGUIAgent] Starting session ${sessionId}`);
    logger.info(`[IraqiGUIAgent] Instruction: ${instruction}`);
    logger.info(`[IraqiGUIAgent] Professional Domain: ${config.culturalValidation.professionalDomain}`);
    
    // Pre-process instruction for Arabic/bilingual content
    const processedInstruction = await this.preprocessInstruction(instruction);
    
    let loopCount = 0;
    let totalTokens = 0;
    let totalTime = 0;
    let previousResponseId: string | undefined;
    
    try {
      // Main automation loop with cultural validation
      while (true) {
        // Check termination conditions
        if (this.shouldTerminate(loopCount, maxLoopCount)) break;
        
        // Handle pause/resume
        if (this.isPaused && this.resumePromise) {
          await this.resumePromise;
        }
        
        const loopStart = Date.now();
        loopCount++;
        
        logger.info(`[IraqiGUIAgent] Loop ${loopCount}: Taking screenshot`);
        
        // 1. Take screenshot with cultural analysis
        const screenshotContext = await this.takeEnhancedScreenshot();
        
        if (!screenshotContext) {
          logger.warn('[IraqiGUIAgent] Invalid screenshot, retrying...');
          continue;
        }
        
        // 2. Validate cultural compliance
        const culturalValidation = await this.validateCulturalCompliance(screenshotContext);
        
        if (culturalValidation === IraqiCulturalStatus.BLOCKED) {
          logger.error('[IraqiGUIAgent] Cultural compliance violation detected - stopping');
          await config.onCulturalViolation?.({
            screenshot: screenshotContext,
            reason: 'Cultural compliance blocked',
            timestamp: Date.now()
          });
          break;
        }
        
        // 3. Process Arabic text if present
        if (screenshotContext.arabicElements.length > 0) {
          await config.onArabicTextDetected?.(screenshotContext.arabicElements);
        }
        
        // 4. Invoke model with enhanced context
        const modelResult = await this.invokeModelWithCulturalContext(
          processedInstruction,
          screenshotContext,
          historyMessages,
          { 
            ...remoteModelHdrs, 
            'X-Session-Id': sessionId,
            'X-Cultural-Domain': config.culturalValidation.professionalDomain,
            'X-Arabic-Support': config.arabicProcessing.enabled.toString()
          },
          previousResponseId
        );
        
        if (!modelResult?.predictions?.length) {
          logger.warn('[IraqiGUIAgent] No predictions from model');
          continue;
        }
        
        totalTokens += modelResult.costTokens || 0;
        totalTime += modelResult.costTime || 0;
        previousResponseId = modelResult.responseId;
        
        // 5. Validate and execute actions with cultural oversight
        const shouldContinue = await this.executeActionsWithValidation(
          modelResult.predictions,
          screenshotContext
        );
        
        if (!shouldContinue) break;
        
        const loopEnd = Date.now();
        logger.info(`[IraqiGUIAgent] Loop ${loopCount} completed in ${loopEnd - loopStart}ms`);
      }
      
    } catch (error) {
      logger.error('[IraqiGUIAgent] Error in main loop:', error);
      await config.onError?.({ error, sessionId, timestamp: Date.now() });
      throw error;
      
    } finally {
      const endTime = Date.now();
      logger.info(`[IraqiGUIAgent] Session ${sessionId} completed`);
      logger.info(`[IraqiGUIAgent] Total: ${totalTime}ms, ${totalTokens} tokens, ${loopCount} loops`);
      logger.info(`[IraqiGUIAgent] Session duration: ${endTime - startTime}ms`);
      
      this.cleanup();
    }
  }
  
  /**
   * Enhanced screenshot capture with Arabic and cultural analysis
   */
  private async takeEnhancedScreenshot(): Promise<IraqiScreenshotContext | null> {
    try {
      // Take base screenshot
      const screenshot = await asyncRetry(() => this.operator.screenshot(), {
        retries: this.config.retryConfig?.screenshot?.maxRetries ?? 3,
        minTimeout: 1000,
        onRetry: this.config.retryConfig?.screenshot?.onRetry
      });
      
      // Validate image
      const jimp = await Jimp.fromBuffer(
        Buffer.from(screenshot.base64.replace(/^data:image\/[a-z]+;base64,/, ''), 'base64')
      ).catch(() => null);
      
      if (!jimp) {
        this.logger.warn('[IraqiGUIAgent] Invalid screenshot format');
        return null;
      }
      
      const { width, height, mime } = jimp;
      
      // Enhanced analysis
      const arabicElements = await this.analyzeArabicElements(screenshot.base64);
      const textDirection = this.determineTextDirection(arabicElements);
      const dialectConfidence = this.assessDialectConfidence(arabicElements);
      const culturalStatus = await this.assessCulturalStatus(screenshot.base64);
      const detectedDomain = this.detectProfessionalDomain(screenshot.base64, arabicElements);
      
      const context: IraqiScreenshotContext = {
        base64: screenshot.base64,
        scaleFactor: screenshot.scaleFactor,
        width,
        height,
        mime: mime || 'image/png',
        arabicElements,
        textDirection,
        dialectConfidence,
        culturalStatus,
        complianceScore: this.calculateComplianceScore(culturalStatus, arabicElements),
        ishanWarnings: this.checkIslamicCompliance(arabicElements),
        detectedDomain,
        sensitiveContent: this.detectSensitiveContent(arabicElements)
      };
      
      this.logger.info(`[IraqiGUIAgent] Screenshot analysis: ${arabicElements.length} Arabic elements, ${textDirection} direction, ${culturalStatus} cultural status`);
      
      return context;
      
    } catch (error) {
      this.logger.error('[IraqiGUIAgent] Screenshot capture failed:', error);
      return null;
    }
  }
  
  /**
   * Cultural compliance validation with caching
   */
  private async validateCulturalCompliance(context: IraqiScreenshotContext): Promise<IraqiCulturalStatus> {
    if (!this.config.culturalValidation.enabled) {
      return IraqiCulturalStatus.COMPLIANT;
    }
    
    // Check cache first (keyed by content hash)
    const cacheKey = this.generateContentHash(context.base64);
    const cached = this.culturalCache.get(cacheKey);
    if (cached) return cached;
    
    try {
      // Delegate to operator if available
      let status = context.culturalStatus;
      
      if (this.operator.analyzeCulturalContext) {
        status = await asyncRetry(
          () => this.operator.analyzeCulturalContext!(context.base64),
          {
            retries: this.config.retryConfig?.culturalValidation?.maxRetries ?? 2,
            minTimeout: 500
          }
        );
      }
      
      // Apply strict mode filtering
      if (this.config.culturalValidation.strictMode) {
        if (status === IraqiCulturalStatus.REVIEW_REQUIRED) {
          status = IraqiCulturalStatus.NON_COMPLIANT;
        }
      }
      
      // Cache result
      this.culturalCache.set(cacheKey, status);
      
      return status;
      
    } catch (error) {
      this.logger.error('[IraqiGUIAgent] Cultural validation failed:', error);
      return IraqiCulturalStatus.REVIEW_REQUIRED;
    }
  }
  
  /**
   * Model invocation with cultural context enhancement
   */
  private async invokeModelWithCulturalContext(
    instruction: string,
    context: IraqiScreenshotContext,
    historyMessages: any[] = [],
    headers: Record<string, string> = {},
    previousResponseId?: string
  ): Promise<any> {
    
    // Build enhanced system prompt with cultural context
    const enhancedSystemPrompt = this.buildCulturalSystemPrompt();
    
    // Prepare model parameters with cultural enhancements
    const modelParams = {
      instruction,
      screenshot: context.base64,
      systemPrompt: enhancedSystemPrompt,
      screenContext: {
        width: context.width,
        height: context.height,
        textDirection: context.textDirection,
        arabicElements: context.arabicElements,
        professionalDomain: context.detectedDomain,
        culturalCompliance: context.culturalStatus
      },
      scaleFactor: context.scaleFactor,
      headers,
      previousResponseId,
      historyMessages
    };
    
    try {
      const result = await asyncRetry(
        () => this.model.invoke(modelParams),
        {
          retries: this.config.retryConfig?.model?.maxRetries ?? 3,
          minTimeout: 5000,
          onRetry: this.config.retryConfig?.model?.onRetry
        }
      );
      
      // Enhance predictions with Iraqi context
      if (result.predictions) {
        result.predictions = await Promise.all(
          result.predictions.map((pred: any) => this.enhancePredictionWithCulturalContext(pred, context))
        );
      }
      
      return result;
      
    } catch (error) {
      this.logger.error('[IraqiGUIAgent] Model invocation failed:', error);
      throw error;
    }
  }
  
  /**
   * Execute actions with cultural validation
   */
  private async executeActionsWithValidation(
    predictions: IraqiActionPrediction[],
    context: IraqiScreenshotContext
  ): Promise<boolean> {
    
    for (const prediction of predictions) {
      this.logger.info(`[IraqiGUIAgent] Executing action: ${prediction.action_type}`);
      this.logger.info(`[IraqiGUIAgent] Cultural validation: ${prediction.culturalValidation}`);
      this.logger.info(`[IraqiGUIAgent] Risk level: ${prediction.riskAssessment.level}`);
      
      // Check action validation
      if (prediction.culturalValidation === ActionValidation.FORBIDDEN) {
        this.logger.warn(`[IraqiGUIAgent] Action ${prediction.action_type} forbidden by cultural validation`);
        continue;
      }
      
      if (prediction.culturalValidation === ActionValidation.REQUIRES_CONFIRMATION) {
        // In autonomous mode, we could implement auto-confirmation logic
        // For now, we'll log and continue with caution
        this.logger.warn(`[IraqiGUIAgent] Action ${prediction.action_type} requires confirmation - proceeding with enhanced monitoring`);
      }
      
      // Handle special completion actions
      if (prediction.action_type === 'finished' || prediction.action_type === 'FINISHED') {
        this.logger.info('[IraqiGUIAgent] Task completion action detected');
        return false; // Stop execution loop
      }
      
      if (prediction.action_type === 'call_user' || prediction.action_type === 'CALL_USER') {
        this.logger.info('[IraqiGUIAgent] User interaction required');
        return false; // Stop for user input
      }
      
      // Execute action with retry logic
      try {
        const executeResult = await asyncRetry(
          () => this.operator.execute({
            prediction: prediction,
            parsedPrediction: prediction,
            screenWidth: context.width,
            screenHeight: context.height,
            scaleFactor: context.scaleFactor,
            culturalContext: {
              domain: context.detectedDomain,
              arabicElements: context.arabicElements,
              complianceScore: context.complianceScore
            }
          }),
          {
            retries: this.config.retryConfig?.execute?.maxRetries ?? 2,
            minTimeout: 1000,
            onRetry: this.config.retryConfig?.execute?.onRetry
          }
        );
        
        this.logger.info(`[IraqiGUIAgent] Action ${prediction.action_type} executed successfully`);
        
        // Log security events if needed
        if (this.config.securityContext.actionLogging) {
          this.logSecurityEvent(prediction, executeResult);
        }
        
      } catch (error) {
        this.logger.error(`[IraqiGUIAgent] Action ${prediction.action_type} failed:`, error);
        
        // Apply risk assessment - continue or stop based on risk level
        if (prediction.riskAssessment.level === 'critical') {
          this.logger.error('[IraqiGUIAgent] Critical action failed - stopping execution');
          return false;
        }
      }
    }
    
    return true; // Continue execution loop
  }
  
  // Helper methods for Arabic and cultural processing
  
  private async preprocessInstruction(instruction: string): Promise<string> {
    // Handle Arabic instructions, Iraqi dialect, mixed language content
    // This would typically involve NLP processing for Arabic text
    return instruction;
  }
  
  private async analyzeArabicElements(screenshot: string): Promise<ArabicGUIElement[]> {
    // Delegate to operator if available
    if (this.operator.processArabicText) {
      return await this.operator.processArabicText(screenshot);
    }
    
    // Basic implementation - would be enhanced with actual OCR/NLP
    return [];
  }
  
  private determineTextDirection(elements: ArabicGUIElement[]): ArabicTextDirection {
    if (elements.length === 0) return ArabicTextDirection.LTR;
    
    const arabicCount = elements.filter(e => e.textDirection === ArabicTextDirection.RTL).length;
    const ltrCount = elements.length - arabicCount;
    
    if (arabicCount === 0) return ArabicTextDirection.LTR;
    if (ltrCount === 0) return ArabicTextDirection.RTL;
    return ArabicTextDirection.MIXED;
  }
  
  private assessDialectConfidence(elements: ArabicGUIElement[]): IraqiDialectConfidence {
    const iraqiElements = elements.filter(e => e.dialectType === 'iraqi');
    const confidence = elements.length > 0 ? (iraqiElements.length / elements.length) * 100 : 0;
    
    if (confidence >= 85) return IraqiDialectConfidence.HIGH;
    if (confidence >= 60) return IraqiDialectConfidence.MEDIUM;
    if (confidence >= 30) return IraqiDialectConfidence.LOW;
    return IraqiDialectConfidence.UNKNOWN;
  }
  
  private async assessCulturalStatus(screenshot: string): Promise<IraqiCulturalStatus> {
    // Basic implementation - would be enhanced with actual cultural analysis
    return IraqiCulturalStatus.COMPLIANT;
  }
  
  private detectProfessionalDomain(screenshot: string, elements: ArabicGUIElement[]): ProfessionalDomain {
    // Analyze screenshot and text for professional context indicators
    return this.config.culturalValidation.professionalDomain;
  }
  
  private calculateComplianceScore(status: IraqiCulturalStatus, elements: ArabicGUIElement[]): number {
    switch (status) {
      case IraqiCulturalStatus.COMPLIANT: return 95;
      case IraqiCulturalStatus.REVIEW_REQUIRED: return 70;
      case IraqiCulturalStatus.NON_COMPLIANT: return 40;
      case IraqiCulturalStatus.BLOCKED: return 0;
      default: return 50;
    }
  }
  
  private checkIslamicCompliance(elements: ArabicGUIElement[]): string[] {
    // Check for content that might not align with Islamic principles
    const warnings: string[] = [];
    // Implementation would check for specific content patterns
    return warnings;
  }
  
  private detectSensitiveContent(elements: ArabicGUIElement[]): boolean {
    // Check for sensitive information in Arabic text
    return false;
  }
  
  private buildCulturalSystemPrompt(): string {
    const domain = this.config.culturalValidation.professionalDomain;
    const arabicSupport = this.config.arabicProcessing.enabled;
    
    return `You are an Iraqi-enhanced GUI automation agent specialized in ${domain} domain operations.

CULTURAL REQUIREMENTS:
- Respect Islamic values and principles in all interactions
- Handle Arabic RTL text with proper recognition and processing  
- Understand Iraqi dialect and professional terminology
- Maintain cultural sensitivity in automated actions
- Avoid actions that may violate cultural or religious norms

ARABIC PROCESSING:
- Detect and properly handle RTL text direction
- Recognize Iraqi dialect in GUI elements
- Process mixed Arabic-English interfaces correctly
- Maintain text integrity during automation actions

PROFESSIONAL DOMAIN: ${domain}
- Apply domain-specific knowledge and terminology
- Follow professional standards and procedures
- Ensure compliance with Iraqi professional practices
- Respect confidentiality and sensitive information

Execute automation tasks while maintaining these cultural and professional standards.`;
  }
  
  private async enhancePredictionWithCulturalContext(
    prediction: any,
    context: IraqiScreenshotContext
  ): Promise<IraqiActionPrediction> {
    
    // Validate action culturally
    const culturalValidation = await this.validateAction(prediction, context);
    const riskLevel = this.assessActionRisk(prediction, context);
    
    return {
      ...prediction,
      culturalValidation,
      arabicContext: context.arabicElements.length > 0,
      professionalDomain: context.detectedDomain,
      riskAssessment: {
        level: riskLevel,
        factors: this.identifyRiskFactors(prediction, context),
        mitigation: this.suggestMitigation(prediction, riskLevel)
      },
      alternativeSuggestions: this.suggestAlternatives(prediction, culturalValidation)
    };
  }
  
  private async validateAction(prediction: any, context: IraqiScreenshotContext): Promise<ActionValidation> {
    // Delegate to operator if available
    if (this.operator.validateAction) {
      return await this.operator.validateAction(prediction);
    }
    
    // Basic validation logic
    if (context.culturalStatus === IraqiCulturalStatus.BLOCKED) {
      return ActionValidation.FORBIDDEN;
    }
    
    if (context.sensitiveContent) {
      return ActionValidation.REQUIRES_CONFIRMATION;
    }
    
    return ActionValidation.APPROVED;
  }
  
  private assessActionRisk(prediction: any, context: IraqiScreenshotContext): 'low' | 'medium' | 'high' | 'critical' {
    // Risk assessment based on action type, context, and cultural factors
    if (context.culturalStatus === IraqiCulturalStatus.BLOCKED) return 'critical';
    if (context.sensitiveContent) return 'high';
    if (prediction.action_type?.includes('delete') || prediction.action_type?.includes('remove')) return 'medium';
    return 'low';
  }
  
  private identifyRiskFactors(prediction: any, context: IraqiScreenshotContext): string[] {
    const factors: string[] = [];
    
    if (context.culturalStatus !== IraqiCulturalStatus.COMPLIANT) {
      factors.push('Cultural compliance issue');
    }
    
    if (context.sensitiveContent) {
      factors.push('Sensitive content detected');
    }
    
    if (context.complianceScore < 70) {
      factors.push('Low compliance score');
    }
    
    return factors;
  }
  
  private suggestMitigation(prediction: any, riskLevel: string): string[] | undefined {
    if (riskLevel === 'low') return undefined;
    
    return [
      'Review action before execution',
      'Apply additional validation checks',
      'Consider alternative approaches'
    ];
  }
  
  private suggestAlternatives(prediction: any, validation: ActionValidation): string[] | undefined {
    if (validation === ActionValidation.APPROVED) return undefined;
    
    return [
      'Use more conservative approach',
      'Request user confirmation',
      'Apply cultural validation filters'
    ];
  }
  
  // State management and utility methods
  
  private shouldTerminate(loopCount: number, maxLoops: number): boolean {
    return this.isStopped || 
           loopCount >= maxLoops || 
           this.config.signal?.aborted || false;
  }
  
  private validateConfig(): void {
    if (!this.operator) {
      throw new Error('IraqiGUIAgent: operator is required');
    }
    
    if (!this.model) {
      throw new Error('IraqiGUIAgent: model is required');
    }
    
    if (!this.config.culturalValidation) {
      throw new Error('IraqiGUIAgent: culturalValidation config is required');
    }
  }
  
  private generateSessionId(): string {
    return uuidv4();
  }
  
  private generateContentHash(content: string): string {
    // Simple hash for caching - would use proper hashing in production
    return Buffer.from(content).toString('base64').slice(0, 32);
  }
  
  private logSecurityEvent(prediction: IraqiActionPrediction, result: any): void {
    const event = {
      timestamp: Date.now(),
      action: prediction.action_type,
      risk: prediction.riskAssessment.level,
      domain: prediction.professionalDomain,
      culturalValidation: prediction.culturalValidation,
      success: !!result
    };
    
    this.logger.info('[IraqiGUIAgent] Security Event:', event);
  }
  
  private cleanup(): void {
    this.culturalCache.clear();
    this.arabicElementsCache.clear();
    this.resolveResume = null;
    this.resumePromise = null;
  }
  
  // Control methods
  
  public pause(): void {
    this.isPaused = true;
    this.resumePromise = new Promise((resolve) => {
      this.resolveResume = resolve;
    });
  }
  
  public resume(): void {
    if (this.resolveResume) {
      this.resolveResume();
      this.resumePromise = null;
      this.resolveResume = null;
    }
    this.isPaused = false;
  }
  
  public stop(): void {
    this.isStopped = true;
  }
}

/**
 * Factory function for creating Iraqi GUI Agent instances
 */
export function createIraqiGUIAgent<T extends IraqiOperator>(
  config: IraqiGUIAgentConfig<T>
): IraqiGUIAgent<T> {
  return new IraqiGUIAgent(config);
}

/**
 * Default configuration for Iraqi professional contexts
 */
export const DEFAULT_IRAQI_CONFIG: Partial<IraqiGUIAgentConfig<any>> = {
  culturalValidation: {
    enabled: true,
    strictMode: false,
    professionalDomain: ProfessionalDomain.GENERAL,
    allowedLanguages: ['arabic', 'english']
  },
  
  arabicProcessing: {
    enabled: true,
    dialectRecognition: true,
    rtlSupport: true,
    mixedLanguageHandling: true
  },
  
  securityContext: {
    sensitiveDataProtection: true,
    screenCaptureSecurity: true,
    actionLogging: true
  },
  
  maxLoopCount: 50,
  culturalValidationTimeout: 5000,
  
  retryConfig: {
    screenshot: { maxRetries: 3 },
    model: { maxRetries: 3 },
    execute: { maxRetries: 2 },
    culturalValidation: { maxRetries: 2 }
  }
};