/**
 * Iraqi Enhanced Desktop Operator
 * 
 * Extends NutJS desktop automation with Iraqi cultural context, Arabic input support,
 * and professional domain awareness for native GUI automation.
 * 
 * Features:
 * - Arabic keyboard input and RTL text handling
 * - Iraqi professional application automation (legal, medical, educational)
 * - Cultural validation for desktop actions
 * - Islamic compliance checking for GUI interactions
 * - Enhanced coordinate parsing for Arabic interfaces
 * - Bilingual hotkey support (Arabic/English)
 * - Professional document handling with cultural sensitivity
 * 
 * @author Extracted from UI-TARS NutJS Operator for Iraqi AI Chat System
 * @date 2025
 * @license Apache-2.0 (preserving original UI-TARS license)
 */

import { Jimp } from 'jimp';
import Big from 'big.js';
import {
  screen,
  Button,
  Key,
  Point,
  Region,
  centerOf,
  keyboard,
  mouse,
  sleep,
  straightTo,
  clipboard,
} from '@computer-use/nut-js';

import {
  IraqiOperator,
  IraqiScreenshotContext,
  ArabicGUIElement,
  ArabicTextDirection,
  IraqiDialectConfidence,
  IraqiCulturalStatus,
  ProfessionalDomain,
  ActionValidation,
} from './iraqi-gui-agent-core';

/**
 * Enhanced execute parameters with Iraqi cultural context
 */
export interface IraqiExecuteParams {
  prediction: any;
  parsedPrediction: any;
  screenWidth: number;
  screenHeight: number;
  scaleFactor: number;
  factors?: number[];
  
  // Iraqi enhancements
  culturalContext?: {
    domain: ProfessionalDomain;
    arabicElements: ArabicGUIElement[];
    complianceScore: number;
    textDirection: ArabicTextDirection;
  };
  
  // Arabic input context
  arabicInputMode?: boolean;
  dialectPreference?: 'iraqi' | 'standard' | 'mixed';
  
  // Professional context
  professionalValidation?: boolean;
  sensitiveDataHandling?: boolean;
}

/**
 * Iraqi desktop automation configuration
 */
export interface IraqiDesktopConfig {
  // Arabic support
  arabicKeyboard: {
    enabled: boolean;
    layout: 'iraqi_qwerty' | 'arabic_102' | 'standard_arabic';
    dialectSupport: boolean;
    autoSwitchLanguage: boolean;
  };
  
  // Cultural validation
  culturalValidation: {
    enabled: boolean;
    strictMode: boolean;
    professionalDomain: ProfessionalDomain;
    islamicCompliance: boolean;
  };
  
  // Performance tuning for Iraqi context
  performance: {
    mouseSpeed: number;          // Adjusted for Arabic interfaces
    keyboardDelay: number;       // Enhanced for Arabic input
    screenshotQuality: number;   // Optimized for Arabic text clarity
    actionTimeout: number;       // Extended for cultural validation
  };
  
  // Security and privacy
  security: {
    sensitiveDataProtection: boolean;
    screenshotFiltering: boolean;
    actionLogging: boolean;
  };
}

/**
 * Arabic keyboard mapping for Iraqi context
 */
const ARABIC_KEYBOARD_MAP = {
  // Iraqi-specific character mappings
  'أ': 'hamza_alif',
  'إ': 'hamza_kasra_alif', 
  'آ': 'madda_alif',
  'ة': 'taa_marboota',
  'ى': 'alif_maksura',
  'ء': 'hamza',
  
  // Iraqi dialect common characters
  'چ': 'tcheh',      // Iraqi چ
  'پ': 'peh',        // Iraqi پ  
  'ڤ': 'veh',        // Iraqi ڤ
  'گ': 'gaf',        // Iraqi گ
  
  // Professional terminology markers
  'ل': 'lam',
  'ا': 'alif',
  'م': 'meem',
  'ن': 'noon',
  'ت': 'teh',
  'ر': 'reh',
  'ع': 'ain',
  'س': 'seen',
  'ب': 'beh',
  'ف': 'feh',
  'ق': 'qaf',
  'د': 'dal',
  'ه': 'heh',
  'ج': 'jeem',
  'ك': 'kaf',
  'ي': 'yeh',
  'ط': 'tah',
  'ض': 'dad',
  'ص': 'sad',
  'ث': 'theh',
  'ذ': 'thal',
  'خ': 'khah',
  'غ': 'ghain',
  'ش': 'sheen',
  'ز': 'zain',
  'و': 'waw',
  'ظ': 'zah',
  'ح': 'hah',
} as const;

/**
 * Iraqi professional hotkey combinations
 */
const IRAQI_PROFESSIONAL_HOTKEYS = {
  // Legal profession hotkeys
  legal: {
    'save_document': ['ctrl', 'shift', 's'],
    'new_case': ['ctrl', 'shift', 'n'],
    'search_law': ['ctrl', 'shift', 'f'],
    'print_contract': ['ctrl', 'shift', 'p'],
  },
  
  // Medical profession hotkeys  
  medical: {
    'patient_record': ['ctrl', 'shift', 'r'],
    'prescription': ['ctrl', 'shift', 'x'],
    'appointment': ['ctrl', 'shift', 'a'],
    'medical_report': ['ctrl', 'shift', 'm'],
  },
  
  // Educational profession hotkeys
  educational: {
    'grade_book': ['ctrl', 'shift', 'g'],
    'lesson_plan': ['ctrl', 'shift', 'l'], 
    'student_record': ['ctrl', 'shift', 'u'],
    'academic_report': ['ctrl', 'shift', 'c'],
  },
  
  // Government/organizational hotkeys
  governmental: {
    'official_document': ['ctrl', 'shift', 'o'],
    'citizen_service': ['ctrl', 'shift', 'c'],
    'department_report': ['ctrl', 'shift', 'd'],
    'meeting_minutes': ['ctrl', 'shift', 'i'],
  },
} as const;

/**
 * Enhanced NutJS Desktop Operator with Iraqi Cultural Integration
 */
export class IraqiDesktopOperator implements IraqiOperator {
  private config: IraqiDesktopConfig;
  private logger: any;
  private currentLanguage: 'arabic' | 'english' = 'english';
  private culturalCache = new Map<string, IraqiCulturalStatus>();
  private arabicElementsCache = new Map<string, ArabicGUIElement[]>();
  
  // Action space definitions for Iraqi context
  static MANUAL = {
    ACTION_SPACES: [
      // Enhanced click actions with Arabic support
      `click(start_box='[x1, y1, x2, y2]', arabic_context=true|false)`,
      `left_double(start_box='[x1, y1, x2, y2]', arabic_context=true|false)`,
      `right_single(start_box='[x1, y1, x2, y2]', arabic_context=true|false)`,
      
      // Enhanced drag for Arabic interfaces (RTL awareness)
      `drag(start_box='[x1, y1, x2, y2]', end_box='[x3, y3, x4, y4]', rtl_aware=true|false)`,
      
      // Enhanced hotkeys with Iraqi professional context
      `hotkey(key='', professional_domain='legal|medical|educational|governmental')`,
      
      // Enhanced typing with Arabic support and cultural validation
      `type(content='', language='arabic|english|mixed', dialect='iraqi|standard', cultural_check=true|false)`,
      
      // Arabic-aware scrolling (RTL interface support)
      `scroll(start_box='[x1, y1, x2, y2]', direction='up|down|right|left', rtl_aware=true|false)`,
      
      // Professional document actions
      `save_professional_document(format='pdf|doc|txt', cultural_validation=true|false)`,
      `print_with_arabic_support(orientation='portrait|landscape', rtl_layout=true|false)`,
      
      // Cultural validation actions
      `validate_cultural_compliance(strict_mode=true|false)`,
      `switch_arabic_keyboard(layout='iraqi_qwerty|arabic_102|standard_arabic')`,
      
      // Standard control actions
      `wait() # Sleep for 5s and take screenshot to check for changes`,
      `finished() # Mark task as successfully completed`,
      `call_user() # Request user assistance for complex cultural decisions`,
    ],
  };

  constructor(config: IraqiDesktopConfig, logger?: any) {
    this.config = {
      // Default configuration for Iraqi professional context
      arabicKeyboard: {
        enabled: true,
        layout: 'iraqi_qwerty',
        dialectSupport: true,
        autoSwitchLanguage: true,
        ...config.arabicKeyboard,
      },
      culturalValidation: {
        enabled: true,
        strictMode: false,
        professionalDomain: ProfessionalDomain.GENERAL,
        islamicCompliance: true,
        ...config.culturalValidation,
      },
      performance: {
        mouseSpeed: 2400,        // Slower for Arabic precision
        keyboardDelay: 100,      // Enhanced for Arabic input
        screenshotQuality: 90,   // Higher for Arabic text clarity
        actionTimeout: 8000,     // Extended for cultural validation
        ...config.performance,
      },
      security: {
        sensitiveDataProtection: true,
        screenshotFiltering: true,
        actionLogging: true,
        ...config.security,
      },
    };
    
    this.logger = logger || console;
    
    // Configure NutJS for Iraqi context
    this.configureNutJS();
    
    this.logger.info('[IraqiDesktopOperator] Initialized with cultural enhancements');
    this.logger.info(`[IraqiDesktopOperator] Professional domain: ${this.config.culturalValidation.professionalDomain}`);
    this.logger.info(`[IraqiDesktopOperator] Arabic support: ${this.config.arabicKeyboard.enabled}`);
  }

  /**
   * Enhanced screenshot with Arabic text detection and cultural analysis
   */
  async screenshot(): Promise<{ base64: string; scaleFactor: number }> {
    try {
      this.logger.info('[IraqiDesktopOperator] Taking enhanced screenshot with cultural analysis');
      
      // Capture base screenshot using NutJS
      const grabImage = await screen.grab();
      const screenWithScale = await grabImage.toRGB();
      const scaleFactor = screenWithScale.pixelDensity.scaleX;
      
      this.logger.info(
        `[IraqiDesktopOperator] Screen scale factors - scaleX: ${screenWithScale.pixelDensity.scaleX}, scaleY: ${screenWithScale.pixelDensity.scaleY}`
      );

      // Create Jimp image for processing
      const screenImage = await Jimp.fromBitmap({
        width: screenWithScale.width,
        height: screenWithScale.height,
        data: Buffer.from(screenWithScale.data),
      });

      // Calculate physical dimensions
      const width = screenWithScale.width / screenWithScale.pixelDensity.scaleX;
      const height = screenWithScale.height / screenWithScale.pixelDensity.scaleY;

      // Resize to physical dimensions with high quality for Arabic text
      const physicalScreenImage = await screenImage
        .resize({
          w: width,
          h: height,
        })
        .quality(this.config.performance.screenshotQuality)
        .getBuffer('image/png'); // PNG for Arabic text clarity

      const base64 = physicalScreenImage.toString('base64');
      
      this.logger.info(
        `[IraqiDesktopOperator] Screenshot captured: ${width}x${height}, scaleFactor: ${scaleFactor}, quality: ${this.config.performance.screenshotQuality}%`
      );

      return {
        base64,
        scaleFactor,
      };
      
    } catch (error) {
      this.logger.error('[IraqiDesktopOperator] Screenshot capture failed:', error);
      throw error;
    }
  }

  /**
   * Enhanced execute with cultural validation and Arabic support
   */
  async execute(params: IraqiExecuteParams): Promise<any> {
    const { parsedPrediction, screenWidth, screenHeight, scaleFactor, culturalContext } = params;
    const { action_type, action_inputs } = parsedPrediction;

    this.logger.info(`[IraqiDesktopOperator] Executing action: ${action_type}`);
    if (culturalContext) {
      this.logger.info(`[IraqiDesktopOperator] Cultural context - Domain: ${culturalContext.domain}, Compliance: ${culturalContext.complianceScore}%, Arabic elements: ${culturalContext.arabicElements.length}`);
    }

    // Pre-action cultural validation
    if (this.config.culturalValidation.enabled) {
      const validation = await this.validateActionCulturally(action_type, action_inputs, culturalContext);
      if (validation === ActionValidation.FORBIDDEN) {
        this.logger.warn(`[IraqiDesktopOperator] Action ${action_type} blocked by cultural validation`);
        return { status: 'blocked', reason: 'Cultural compliance violation' };
      }
    }

    // Parse coordinates with Arabic/RTL awareness
    const startBoxStr = action_inputs?.start_box || '';
    const coordinates = this.parseBoxToScreenCoords({
      boxStr: startBoxStr,
      screenWidth,
      screenHeight,
      rtlAware: culturalContext?.textDirection === ArabicTextDirection.RTL,
    });

    const { x: startX, y: startY } = coordinates;
    this.logger.info(`[IraqiDesktopOperator] Position: (${startX}, ${startY})`);

    // Configure mouse speed for cultural context
    mouse.config.mouseSpeed = this.config.performance.mouseSpeed;
    keyboard.config.autoDelayMs = this.config.performance.keyboardDelay;

    try {
      await this.executeActionWithCulturalContext(
        action_type,
        action_inputs,
        { startX, startY },
        { screenWidth, screenHeight, scaleFactor },
        culturalContext
      );
      
      // Log successful action for security audit
      if (this.config.security.actionLogging) {
        this.logSecurityEvent(action_type, action_inputs, 'success', culturalContext);
      }
      
    } catch (error) {
      this.logger.error(`[IraqiDesktopOperator] Action ${action_type} failed:`, error);
      
      // Log failed action for security audit
      if (this.config.security.actionLogging) {
        this.logSecurityEvent(action_type, action_inputs, 'failed', culturalContext);
      }
      
      throw error;
    }

    return { status: 'success' };
  }

  /**
   * Analyze cultural context of screenshot (implements IraqiOperator interface)
   */
  async analyzeCulturalContext(screenshot: string): Promise<IraqiCulturalStatus> {
    // Check cache first
    const cacheKey = this.generateContentHash(screenshot);
    const cached = this.culturalCache.get(cacheKey);
    if (cached) return cached;

    try {
      // Basic cultural analysis - would be enhanced with actual CV/NLP in production
      let status = IraqiCulturalStatus.COMPLIANT;
      
      // Check for potentially sensitive content indicators
      if (this.config.security.sensitiveDataProtection) {
        const hasSensitiveIndicators = await this.detectSensitiveContent(screenshot);
        if (hasSensitiveIndicators) {
          status = IraqiCulturalStatus.REVIEW_REQUIRED;
        }
      }
      
      // Islamic compliance check
      if (this.config.culturalValidation.islamicCompliance) {
        const islamicCompliant = await this.checkIslamicCompliance(screenshot);
        if (!islamicCompliant) {
          status = this.config.culturalValidation.strictMode 
            ? IraqiCulturalStatus.BLOCKED 
            : IraqiCulturalStatus.REVIEW_REQUIRED;
        }
      }
      
      // Cache result
      this.culturalCache.set(cacheKey, status);
      
      this.logger.info(`[IraqiDesktopOperator] Cultural analysis result: ${status}`);
      return status;
      
    } catch (error) {
      this.logger.error('[IraqiDesktopOperator] Cultural analysis failed:', error);
      return IraqiCulturalStatus.REVIEW_REQUIRED;
    }
  }

  /**
   * Process Arabic text in screenshot (implements IraqiOperator interface)
   */
  async processArabicText(screenshot: string): Promise<ArabicGUIElement[]> {
    if (!this.config.arabicKeyboard.enabled) {
      return [];
    }

    // Check cache first
    const cacheKey = this.generateContentHash(screenshot);
    const cached = this.arabicElementsCache.get(cacheKey);
    if (cached) return cached;

    try {
      // Basic Arabic text detection - would be enhanced with actual OCR in production
      const elements: ArabicGUIElement[] = [];
      
      // Simulated Arabic text detection based on professional domain
      if (this.config.culturalValidation.professionalDomain !== ProfessionalDomain.GENERAL) {
        // Add mock Arabic elements based on professional context
        elements.push({
          text: this.getMockArabicTextForDomain(this.config.culturalValidation.professionalDomain),
          arabicText: 'النص العربي',
          englishTranslation: 'Arabic text',
          boundingBox: { x: 100, y: 100, width: 200, height: 30 },
          confidence: 0.85,
          dialectType: this.config.arabicKeyboard.dialectSupport ? 'iraqi' : 'standard',
          textDirection: ArabicTextDirection.RTL,
        });
      }
      
      // Cache result
      this.arabicElementsCache.set(cacheKey, elements);
      
      this.logger.info(`[IraqiDesktopOperator] Detected ${elements.length} Arabic elements`);
      return elements;
      
    } catch (error) {
      this.logger.error('[IraqiDesktopOperator] Arabic text processing failed:', error);
      return [];
    }
  }

  /**
   * Validate action against cultural standards (implements IraqiOperator interface)
   */
  async validateAction(action: any): Promise<ActionValidation> {
    if (!this.config.culturalValidation.enabled) {
      return ActionValidation.APPROVED;
    }

    const { action_type, action_inputs } = action;

    // Check for potentially sensitive actions
    if (this.isSensitiveAction(action_type)) {
      return ActionValidation.REQUIRES_CONFIRMATION;
    }

    // Check for Islamic compliance
    if (this.config.culturalValidation.islamicCompliance) {
      const content = action_inputs?.content || '';
      if (this.containsNonCompliantContent(content)) {
        return this.config.culturalValidation.strictMode 
          ? ActionValidation.FORBIDDEN 
          : ActionValidation.REQUIRES_CONFIRMATION;
      }
    }

    return ActionValidation.APPROVED;
  }

  /**
   * Execute action with enhanced cultural context awareness
   */
  private async executeActionWithCulturalContext(
    actionType: string,
    actionInputs: any,
    coordinates: { startX: number | null; startY: number | null },
    screenContext: { screenWidth: number; screenHeight: number; scaleFactor: number },
    culturalContext?: any
  ): Promise<void> {
    
    const { startX, startY } = coordinates;

    switch (actionType) {
      case 'wait':
        this.logger.info('[IraqiDesktopOperator] Waiting with cultural monitoring');
        await sleep(5000);
        break;

      case 'mouse_move':
      case 'hover':
        this.logger.info('[IraqiDesktopOperator] Mouse move with RTL awareness');
        await this.moveStraightTo(startX, startY);
        break;

      case 'click':
      case 'left_click':
      case 'left_single':
        this.logger.info('[IraqiDesktopOperator] Left click with Arabic context');
        await this.clickWithCulturalContext(startX, startY, Button.LEFT, culturalContext);
        break;

      case 'left_double':
      case 'double_click':
        this.logger.info(`[IraqiDesktopOperator] Double click with cultural validation`);
        await this.moveStraightTo(startX, startY);
        await sleep(100);
        await mouse.doubleClick(Button.LEFT);
        break;

      case 'right_click':
      case 'right_single':
        this.logger.info('[IraqiDesktopOperator] Right click with cultural context');
        await this.clickWithCulturalContext(startX, startY, Button.RIGHT, culturalContext);
        break;

      case 'middle_click':
        this.logger.info('[IraqiDesktopOperator] Middle click');
        await this.moveStraightTo(startX, startY);
        await mouse.click(Button.MIDDLE);
        break;

      case 'drag':
      case 'left_click_drag':
      case 'select':
        await this.executeDragWithRTLSupport(actionInputs, screenContext, culturalContext);
        break;

      case 'type':
        await this.executeTypeWithArabicSupport(actionInputs, culturalContext);
        break;

      case 'hotkey':
        await this.executeHotkeyWithProfessionalContext(actionInputs, culturalContext);
        break;

      case 'scroll':
        await this.executeScrollWithRTLSupport(actionInputs, coordinates, culturalContext);
        break;

      // Enhanced actions for Iraqi professional context
      case 'save_professional_document':
        await this.saveProfessionalDocument(actionInputs, culturalContext);
        break;

      case 'print_with_arabic_support':
        await this.printWithArabicSupport(actionInputs, culturalContext);
        break;

      case 'validate_cultural_compliance':
        await this.validateCulturalCompliance(actionInputs);
        break;

      case 'switch_arabic_keyboard':
        await this.switchArabicKeyboard(actionInputs);
        break;

      // Control actions
      case 'error_env':
      case 'call_user':
      case 'finished':
      case 'user_stop':
        this.logger.info(`[IraqiDesktopOperator] Control action: ${actionType}`);
        return;

      default:
        this.logger.warn(`[IraqiDesktopOperator] Unsupported action: ${actionType}`);
        break;
    }
  }

  /**
   * Enhanced typing with Arabic support and cultural validation
   */
  private async executeTypeWithArabicSupport(
    actionInputs: any,
    culturalContext?: any
  ): Promise<void> {
    const content = actionInputs?.content?.trim();
    const language = actionInputs?.language || 'english';
    const dialect = actionInputs?.dialect || 'standard';
    const culturalCheck = actionInputs?.cultural_check !== false;

    this.logger.info(`[IraqiDesktopOperator] Typing with Arabic support - Language: ${language}, Dialect: ${dialect}`);

    if (!content) {
      this.logger.warn('[IraqiDesktopOperator] No content to type');
      return;
    }

    // Cultural validation for typed content
    if (culturalCheck && this.config.culturalValidation.enabled) {
      const isCompliant = await this.validateTextCulturally(content, language, dialect);
      if (!isCompliant) {
        this.logger.warn('[IraqiDesktopOperator] Text content failed cultural validation');
        return;
      }
    }

    // Switch keyboard layout if needed
    if (language === 'arabic' && this.config.arabicKeyboard.enabled) {
      await this.switchToArabicKeyboard();
    } else if (language === 'english' && this.currentLanguage === 'arabic') {
      await this.switchToEnglishKeyboard();
    }

    try {
      // Process content for submission
      const processedContent = content.replace(/\\n$/, '').replace(/\n$/, '');
      
      keyboard.config.autoDelayMs = this.config.performance.keyboardDelay;

      // Enhanced typing for Arabic text
      if (language === 'arabic' || this.containsArabicText(content)) {
        await this.typeArabicText(processedContent, dialect);
      } else {
        // Standard typing for English text
        if (process.platform === 'win32') {
          // Use clipboard for better Arabic support on Windows
          const originalClipboard = await clipboard.getContent();
          await clipboard.setContent(processedContent);
          await keyboard.pressKey(Key.LeftControl, Key.V);
          await sleep(50);
          await keyboard.releaseKey(Key.LeftControl, Key.V);
          await sleep(50);
          await clipboard.setContent(originalClipboard);
        } else {
          await keyboard.type(processedContent);
        }
      }

      // Handle submission if content ends with newline
      if (content.endsWith('\n') || content.endsWith('\\n')) {
        await keyboard.pressKey(Key.Enter);
        await keyboard.releaseKey(Key.Enter);
      }

      keyboard.config.autoDelayMs = 500; // Reset to default

      this.logger.info(`[IraqiDesktopOperator] Successfully typed ${content.length} characters`);

    } catch (error) {
      this.logger.error('[IraqiDesktopOperator] Typing failed:', error);
      throw error;
    }
  }

  /**
   * Enhanced hotkey execution with Iraqi professional context
   */
  private async executeHotkeyWithProfessionalContext(
    actionInputs: any,
    culturalContext?: any
  ): Promise<void> {
    const keyStr = actionInputs?.key || actionInputs?.hotkey;
    const professionalDomain = actionInputs?.professional_domain || culturalContext?.domain || this.config.culturalValidation.professionalDomain;

    this.logger.info(`[IraqiDesktopOperator] Executing hotkey: ${keyStr} for domain: ${professionalDomain}`);

    if (!keyStr) {
      this.logger.error('[IraqiDesktopOperator] No hotkey specified');
      return;
    }

    // Check for professional domain-specific hotkeys
    const professionalHotkeys = IRAQI_PROFESSIONAL_HOTKEYS[professionalDomain as keyof typeof IRAQI_PROFESSIONAL_HOTKEYS];
    if (professionalHotkeys && professionalHotkeys[keyStr as keyof typeof professionalHotkeys]) {
      const keys = professionalHotkeys[keyStr as keyof typeof professionalHotkeys];
      this.logger.info(`[IraqiDesktopOperator] Using professional hotkey combination: ${keys.join('+')}`);
      const mappedKeys = this.mapHotkeysToNutJS(keys);
      if (mappedKeys.length > 0) {
        await keyboard.pressKey(...mappedKeys);
        await keyboard.releaseKey(...mappedKeys);
        return;
      }
    }

    // Standard hotkey processing with Arabic keyboard support
    const keys = this.getHotkeys(keyStr);
    if (keys.length > 0) {
      await keyboard.pressKey(...keys);
      await keyboard.releaseKey(...keys);
    }
  }

  /**
   * Enhanced drag operation with RTL interface support
   */
  private async executeDragWithRTLSupport(
    actionInputs: any,
    screenContext: { screenWidth: number; screenHeight: number; scaleFactor: number },
    culturalContext?: any
  ): Promise<void> {
    const { screenWidth, screenHeight } = screenContext;
    const rtlAware = actionInputs?.rtl_aware !== false && culturalContext?.textDirection === ArabicTextDirection.RTL;

    if (!actionInputs?.start_box || !actionInputs?.end_box) {
      this.logger.error('[IraqiDesktopOperator] Drag operation missing start_box or end_box');
      return;
    }

    const startCoords = this.parseBoxToScreenCoords({
      boxStr: actionInputs.start_box,
      screenWidth,
      screenHeight,
      rtlAware,
    });

    const endCoords = this.parseBoxToScreenCoords({
      boxStr: actionInputs.end_box,
      screenWidth,
      screenHeight,
      rtlAware,
    });

    const { x: startX, y: startY } = startCoords;
    const { x: endX, y: endY } = endCoords;

    if (startX !== null && startY !== null && endX !== null && endY !== null) {
      this.logger.info(
        `[IraqiDesktopOperator] Drag with RTL support - Start: (${startX}, ${startY}), End: (${endX}, ${endY}), RTL: ${rtlAware}`
      );

      await this.moveStraightTo(startX, startY);
      await sleep(100);
      await mouse.drag(straightTo(new Point(endX, endY)));
    }
  }

  /**
   * Enhanced scroll operation with RTL interface support
   */
  private async executeScrollWithRTLSupport(
    actionInputs: any,
    coordinates: { startX: number | null; startY: number | null },
    culturalContext?: any
  ): Promise<void> {
    const { direction } = actionInputs;
    const { startX, startY } = coordinates;
    const rtlAware = actionInputs?.rtl_aware !== false && culturalContext?.textDirection === ArabicTextDirection.RTL;

    this.logger.info(`[IraqiDesktopOperator] Scrolling with RTL awareness: ${direction}, RTL: ${rtlAware}`);

    // Move to position if specified
    if (startX !== null && startY !== null) {
      await this.moveStraightTo(startX, startY);
    }

    // Adjust scroll direction for RTL interfaces
    let adjustedDirection = direction?.toLowerCase();
    if (rtlAware && (direction === 'right' || direction === 'left')) {
      adjustedDirection = direction === 'right' ? 'left' : 'right';
      this.logger.info(`[IraqiDesktopOperator] Adjusted scroll direction for RTL: ${direction} -> ${adjustedDirection}`);
    }

    switch (adjustedDirection) {
      case 'up':
        await mouse.scrollUp(5 * 100);
        break;
      case 'down':
        await mouse.scrollDown(5 * 100);
        break;
      case 'left':
        // Horizontal scrolling - implementation depends on application
        this.logger.info('[IraqiDesktopOperator] Horizontal scroll left - using arrow keys');
        await keyboard.pressKey(Key.Left, Key.Left, Key.Left);
        await keyboard.releaseKey(Key.Left, Key.Left, Key.Left);
        break;
      case 'right':
        // Horizontal scrolling - implementation depends on application
        this.logger.info('[IraqiDesktopOperator] Horizontal scroll right - using arrow keys');
        await keyboard.pressKey(Key.Right, Key.Right, Key.Right);
        await keyboard.releaseKey(Key.Right, Key.Right, Key.Right);
        break;
      default:
        this.logger.warn(`[IraqiDesktopOperator] Unsupported scroll direction: ${direction}`);
    }
  }

  // Enhanced professional document operations

  private async saveProfessionalDocument(actionInputs: any, culturalContext?: any): Promise<void> {
    const format = actionInputs?.format || 'pdf';
    const culturalValidation = actionInputs?.cultural_validation !== false;

    this.logger.info(`[IraqiDesktopOperator] Saving professional document - Format: ${format}, Cultural validation: ${culturalValidation}`);

    // Perform cultural validation if enabled
    if (culturalValidation && this.config.culturalValidation.enabled) {
      // Placeholder for document content validation
      this.logger.info('[IraqiDesktopOperator] Performing cultural validation on document');
    }

    // Execute save operation based on format
    switch (format) {
      case 'pdf':
        await keyboard.pressKey(Key.LeftControl, Key.LeftShift, Key.E); // Export as PDF
        await keyboard.releaseKey(Key.LeftControl, Key.LeftShift, Key.E);
        break;
      case 'doc':
      case 'docx':
        await keyboard.pressKey(Key.LeftControl, Key.S); // Save document
        await keyboard.releaseKey(Key.LeftControl, Key.S);
        break;
      case 'txt':
        await keyboard.pressKey(Key.LeftControl, Key.LeftShift, Key.T); // Save as text
        await keyboard.releaseKey(Key.LeftControl, Key.LeftShift, Key.T);
        break;
      default:
        await keyboard.pressKey(Key.LeftControl, Key.S); // Default save
        await keyboard.releaseKey(Key.LeftControl, Key.S);
    }

    await sleep(1000); // Wait for save dialog
  }

  private async printWithArabicSupport(actionInputs: any, culturalContext?: any): Promise<void> {
    const orientation = actionInputs?.orientation || 'portrait';
    const rtlLayout = actionInputs?.rtl_layout !== false && culturalContext?.textDirection === ArabicTextDirection.RTL;

    this.logger.info(`[IraqiDesktopOperator] Printing with Arabic support - Orientation: ${orientation}, RTL: ${rtlLayout}`);

    // Open print dialog
    await keyboard.pressKey(Key.LeftControl, Key.P);
    await keyboard.releaseKey(Key.LeftControl, Key.P);
    await sleep(1000); // Wait for print dialog

    // Configure for Arabic text if needed
    if (rtlLayout) {
      // Navigate to orientation settings (implementation depends on print dialog)
      await keyboard.pressKey(Key.Tab, Key.Tab, Key.Tab); // Navigate to settings
      await keyboard.releaseKey(Key.Tab, Key.Tab, Key.Tab);
      
      if (orientation === 'landscape') {
        await keyboard.pressKey(Key.L); // Select landscape
        await keyboard.releaseKey(Key.L);
      }
    }

    this.logger.info('[IraqiDesktopOperator] Print configuration completed');
  }

  private async validateCulturalCompliance(actionInputs: any): Promise<void> {
    const strictMode = actionInputs?.strict_mode !== false;

    this.logger.info(`[IraqiDesktopOperator] Validating cultural compliance - Strict mode: ${strictMode}`);

    // Perform enhanced cultural validation
    // This would integrate with actual cultural validation services in production
    await sleep(500); // Simulate validation time

    this.logger.info('[IraqiDesktopOperator] Cultural compliance validation completed');
  }

  private async switchArabicKeyboard(actionInputs: any): Promise<void> {
    const layout = actionInputs?.layout || this.config.arabicKeyboard.layout;

    this.logger.info(`[IraqiDesktopOperator] Switching Arabic keyboard layout to: ${layout}`);

    // Switch keyboard layout using Windows/macOS shortcuts
    if (process.platform === 'win32') {
      await keyboard.pressKey(Key.LeftWin, Key.Space);
      await keyboard.releaseKey(Key.LeftWin, Key.Space);
    } else if (process.platform === 'darwin') {
      await keyboard.pressKey(Key.LeftCmd, Key.Space);
      await keyboard.releaseKey(Key.LeftCmd, Key.Space);
    }

    await sleep(500);
    this.currentLanguage = 'arabic';
    this.logger.info(`[IraqiDesktopOperator] Switched to Arabic keyboard layout: ${layout}`);
  }

  // Helper methods for Arabic and cultural processing

  private async clickWithCulturalContext(
    x: number | null,
    y: number | null,
    button: Button,
    culturalContext?: any
  ): Promise<void> {
    await this.moveStraightTo(x, y);
    await sleep(100);

    // Add slight delay for Arabic interfaces to ensure proper rendering
    if (culturalContext?.arabicElements?.length > 0) {
      await sleep(50);
    }

    await mouse.click(button);
  }

  private async moveStraightTo(startX: number | null, startY: number | null): Promise<void> {
    if (startX === null || startY === null) {
      return;
    }
    await mouse.move(straightTo(new Point(startX, startY)));
  }

  private parseBoxToScreenCoords(params: {
    boxStr: string;
    screenWidth: number;
    screenHeight: number;
    rtlAware?: boolean;
  }): { x: number | null; y: number | null } {
    const { boxStr, screenWidth, screenHeight, rtlAware = false } = params;

    if (!boxStr) {
      return { x: null, y: null };
    }

    try {
      const coords = boxStr.match(/\[(\d+),\s*(\d+),\s*(\d+),\s*(\d+)\]/);
      if (!coords) {
        return { x: null, y: null };
      }

      const [, x1Str, y1Str, x2Str, y2Str] = coords;
      let x1 = parseInt(x1Str, 10);
      const y1 = parseInt(y1Str, 10);
      let x2 = parseInt(x2Str, 10);
      const y2 = parseInt(y2Str, 10);

      // RTL adjustment for Arabic interfaces
      if (rtlAware) {
        const adjustedX1 = screenWidth - x2;
        const adjustedX2 = screenWidth - x1;
        x1 = adjustedX1;
        x2 = adjustedX2;
        this.logger.info(`[IraqiDesktopOperator] RTL coordinate adjustment applied`);
      }

      const centerX = Math.floor((x1 + x2) / 2);
      const centerY = Math.floor((y1 + y2) / 2);

      return { x: centerX, y: centerY };
    } catch (error) {
      this.logger.error('[IraqiDesktopOperator] Coordinate parsing failed:', error);
      return { x: null, y: null };
    }
  }

  private getHotkeys(keyStr: string | undefined): Key[] {
    if (!keyStr) {
      this.logger.error('[IraqiDesktopOperator] No hotkey specified');
      return [];
    }

    const platformCommandKey = process.platform === 'darwin' ? Key.LeftCmd : Key.LeftWin;
    const platformCtrlKey = process.platform === 'darwin' ? Key.LeftCmd : Key.LeftControl;

    const keyMap = {
      return: Key.Enter,
      ctrl: platformCtrlKey,
      shift: Key.LeftShift,
      alt: Key.LeftAlt,
      'page down': Key.PageDown,
      'page up': Key.PageUp,
      meta: platformCommandKey,
      win: platformCommandKey,
      command: platformCommandKey,
      cmd: platformCommandKey,
      ',': Key.Comma,
      arrowup: Key.Up,
      arrowdown: Key.Down,
      arrowleft: Key.Left,
      arrowright: Key.Right,
      // Arabic-specific keys
      space: Key.Space,
      backspace: Key.Backspace,
      delete: Key.Delete,
      tab: Key.Tab,
      escape: Key.Escape,
    } as const;

    const lowercaseKeyMap = Object.fromEntries(
      Object.entries(Key).map(([k, v]) => [k.toLowerCase(), v])
    ) as {
      [K in keyof typeof Key as Lowercase<K>]: (typeof Key)[K];
    };

    const keys = keyStr
      .split(/[\s+]/)
      .map((k) => k.toLowerCase())
      .map((k) => keyMap[k as keyof typeof keyMap] ?? lowercaseKeyMap[k as Lowercase<keyof typeof Key>])
      .filter(Boolean);

    this.logger.info(`[IraqiDesktopOperator] Parsed hotkeys: ${keys.join(', ')}`);
    return keys;
  }

  private mapHotkeysToNutJS(hotkeys: string[]): Key[] {
    return hotkeys.map(key => {
      switch (key.toLowerCase()) {
        case 'ctrl': return process.platform === 'darwin' ? Key.LeftCmd : Key.LeftControl;
        case 'shift': return Key.LeftShift;
        case 'alt': return Key.LeftAlt;
        case 'cmd':
        case 'command':
        case 'meta': return process.platform === 'darwin' ? Key.LeftCmd : Key.LeftWin;
        default: return (Key as any)[key.charAt(0).toUpperCase() + key.slice(1)] || Key.Space;
      }
    }).filter(Boolean);
  }

  private async typeArabicText(content: string, dialect: string): Promise<void> {
    this.logger.info(`[IraqiDesktopOperator] Typing Arabic text with dialect: ${dialect}`);

    // Enhanced Arabic typing with dialect support
    if (process.platform === 'win32') {
      // Use clipboard for reliable Arabic text input
      const originalClipboard = await clipboard.getContent();
      await clipboard.setContent(content);
      await keyboard.pressKey(Key.LeftControl, Key.V);
      await sleep(100); // Longer delay for Arabic rendering
      await keyboard.releaseKey(Key.LeftControl, Key.V);
      await sleep(50);
      await clipboard.setContent(originalClipboard);
    } else {
      // Direct typing for other platforms
      await keyboard.type(content);
    }
  }

  private async switchToArabicKeyboard(): Promise<void> {
    if (this.currentLanguage === 'arabic') return;

    this.logger.info('[IraqiDesktopOperator] Switching to Arabic keyboard');
    
    if (process.platform === 'win32') {
      await keyboard.pressKey(Key.LeftAlt, Key.LeftShift);
      await keyboard.releaseKey(Key.LeftAlt, Key.LeftShift);
    } else if (process.platform === 'darwin') {
      await keyboard.pressKey(Key.LeftCmd, Key.Space);
      await keyboard.releaseKey(Key.LeftCmd, Key.Space);
    }

    await sleep(200);
    this.currentLanguage = 'arabic';
  }

  private async switchToEnglishKeyboard(): Promise<void> {
    if (this.currentLanguage === 'english') return;

    this.logger.info('[IraqiDesktopOperator] Switching to English keyboard');
    
    if (process.platform === 'win32') {
      await keyboard.pressKey(Key.LeftAlt, Key.LeftShift);
      await keyboard.releaseKey(Key.LeftAlt, Key.LeftShift);
    } else if (process.platform === 'darwin') {
      await keyboard.pressKey(Key.LeftCmd, Key.Space);
      await keyboard.releaseKey(Key.LeftCmd, Key.Space);
    }

    await sleep(200);
    this.currentLanguage = 'english';
  }

  private containsArabicText(text: string): boolean {
    // Simple Arabic text detection
    return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
  }

  private async validateActionCulturally(
    actionType: string,
    actionInputs: any,
    culturalContext?: any
  ): Promise<ActionValidation> {
    // Basic cultural validation logic
    if (this.isSensitiveAction(actionType)) {
      return ActionValidation.REQUIRES_CONFIRMATION;
    }

    if (actionInputs?.content && this.containsNonCompliantContent(actionInputs.content)) {
      return this.config.culturalValidation.strictMode
        ? ActionValidation.FORBIDDEN
        : ActionValidation.REQUIRES_CONFIRMATION;
    }

    return ActionValidation.APPROVED;
  }

  private async validateTextCulturally(text: string, language: string, dialect: string): Promise<boolean> {
    // Enhanced text validation for cultural compliance
    if (this.containsNonCompliantContent(text)) {
      return false;
    }

    // Add dialect-specific validation
    if (language === 'arabic' && dialect === 'iraqi') {
      // Validate Iraqi dialect appropriateness
      return true; // Placeholder - would implement actual validation
    }

    return true;
  }

  private isSensitiveAction(actionType: string): boolean {
    const sensitiveActions = ['delete', 'remove', 'format', 'reset', 'clear'];
    return sensitiveActions.some(action => actionType.toLowerCase().includes(action));
  }

  private containsNonCompliantContent(content: string): boolean {
    // Basic content filtering - would be enhanced with actual NLP analysis
    // This is a placeholder implementation
    return false;
  }

  private async detectSensitiveContent(screenshot: string): Promise<boolean> {
    // Placeholder for sensitive content detection in screenshots
    return false;
  }

  private async checkIslamicCompliance(screenshot: string): Promise<boolean> {
    // Placeholder for Islamic compliance checking
    return true;
  }

  private getMockArabicTextForDomain(domain: ProfessionalDomain): string {
    const domainTexts = {
      [ProfessionalDomain.LEGAL]: 'المستندات القانونية',
      [ProfessionalDomain.MEDICAL]: 'السجلات الطبية',
      [ProfessionalDomain.EDUCATIONAL]: 'المواد التعليمية',
      [ProfessionalDomain.GOVERNMENTAL]: 'الوثائق الرسمية',
      [ProfessionalDomain.BUSINESS]: 'الأعمال التجارية',
      [ProfessionalDomain.GENERAL]: 'النص العربي',
    };

    return domainTexts[domain] || domainTexts[ProfessionalDomain.GENERAL];
  }

  private generateContentHash(content: string): string {
    // Simple hash for caching - would use proper hashing in production
    return Buffer.from(content.slice(0, 1000)).toString('base64').slice(0, 32);
  }

  private logSecurityEvent(
    actionType: string,
    actionInputs: any,
    status: 'success' | 'failed',
    culturalContext?: any
  ): void {
    const event = {
      timestamp: Date.now(),
      action: actionType,
      inputs: actionInputs,
      status,
      culturalContext: culturalContext ? {
        domain: culturalContext.domain,
        complianceScore: culturalContext.complianceScore,
        arabicElements: culturalContext.arabicElements?.length || 0,
      } : null,
    };

    this.logger.info('[IraqiDesktopOperator] Security Event:', event);
  }

  private configureNutJS(): void {
    // Configure NutJS with Iraqi-optimized settings
    mouse.config.mouseSpeed = this.config.performance.mouseSpeed;
    keyboard.config.autoDelayMs = this.config.performance.keyboardDelay;

    // Configure for high-DPI Arabic text clarity
    screen.config.highlightDurationMs = 500;
    screen.config.highlightOpacity = 0.7;

    this.logger.info('[IraqiDesktopOperator] NutJS configured for Iraqi context');
  }
}

/**
 * Factory function for creating Iraqi Desktop Operator instances
 */
export function createIraqiDesktopOperator(
  config: Partial<IraqiDesktopConfig> = {},
  logger?: any
): IraqiDesktopOperator {
  const defaultConfig: IraqiDesktopConfig = {
    arabicKeyboard: {
      enabled: true,
      layout: 'iraqi_qwerty',
      dialectSupport: true,
      autoSwitchLanguage: true,
    },
    culturalValidation: {
      enabled: true,
      strictMode: false,
      professionalDomain: ProfessionalDomain.GENERAL,
      islamicCompliance: true,
    },
    performance: {
      mouseSpeed: 2400,
      keyboardDelay: 100,
      screenshotQuality: 90,
      actionTimeout: 8000,
    },
    security: {
      sensitiveDataProtection: true,
      screenshotFiltering: true,
      actionLogging: true,
    },
  };

  const mergedConfig: IraqiDesktopConfig = {
    arabicKeyboard: { ...defaultConfig.arabicKeyboard, ...config.arabicKeyboard },
    culturalValidation: { ...defaultConfig.culturalValidation, ...config.culturalValidation },
    performance: { ...defaultConfig.performance, ...config.performance },
    security: { ...defaultConfig.security, ...config.security },
  };

  return new IraqiDesktopOperator(mergedConfig, logger);
}