/**
 * Iraqi Enhanced Browser Operator
 *
 * Extends UI-TARS Browser Operator with Iraqi cultural context, Arabic RTL support,
 * and Islamic compliance validation for web automation.
 *
 * Features:
 * - Arabic RTL web interface support
 * - Iraqi government and professional website navigation
 * - Islamic content filtering and compliance validation
 * - Enhanced Arabic text input and form handling
 * - Cultural appropriateness scoring for web interactions
 * - Iraqi professional domain awareness (legal, medical, educational)
 * - Enhanced screenshot analysis for Arabic content
 * - Bilingual (Arabic/English) web automation
 *
 * @author Extracted from UI-TARS Browser Operator for Iraqi AI Chat System
 * @date 2025
 * @license Apache-2.0 (preserving original UI-TARS license)
 */

import {
  IraqiOperator,
  IraqiScreenshotContext,
  ArabicGUIElement,
  ArabicTextDirection,
  IraqiDialectConfidence,
  IraqiCulturalStatus,
  ProfessionalDomain,
  ActionValidation,
} from "./iraqi-gui-agent-core";

/**
 * Enhanced browser automation configuration for Iraqi context
 */
export interface IraqiBrowserConfig {
  // Browser instance (LocalBrowser or RemoteBrowser)
  browser: any;
  browserType?: "chromium" | "firefox" | "webkit";
  logger?: any;

  // Arabic and RTL support
  arabicSupport: {
    enabled: boolean;
    rtlLayoutDetection: boolean;
    arabicFontOptimization: boolean;
    dialectRecognition: boolean;
    mixedContentHandling: boolean;
  };

  // Cultural validation and compliance
  culturalValidation: {
    enabled: boolean;
    strictMode: boolean;
    professionalDomain: ProfessionalDomain;
    islamicCompliance: boolean;
    contentFiltering: boolean;
  };

  // Professional domain navigation
  professionalNavigation: {
    iraqiGovernmentSites: boolean;
    professionalPortals: boolean;
    educationalInstitutions: boolean;
    medicalSystems: boolean;
    legalDatabases: boolean;
  };

  // Enhanced UI interactions
  uiEnhancements: {
    highlightClickableElements: boolean;
    showActionInfo: boolean;
    showWaterFlow: boolean;
    arabicTextHighlighting: boolean;
    culturalIndicators: boolean;
  };

  // Performance and security
  performance: {
    screenshotQuality: number;
    arabicRenderingDelay: number;
    culturalValidationTimeout: number;
    pageLoadTimeout: number;
  };

  security: {
    sensitiveDataProtection: boolean;
    screenshotFiltering: boolean;
    actionLogging: boolean;
    domainWhitelist?: string[];
  };

  // Callbacks for cultural events
  onCulturalViolation?: (violation: any) => Promise<void>;
  onArabicContentDetected?: (elements: ArabicGUIElement[]) => Promise<void>;
  onProfessionalSiteDetected?: (
    domain: ProfessionalDomain,
    url: string,
  ) => Promise<void>;
  onScreenshot?: (screenshot: any, page: any) => Promise<void>;
  onOperatorAction?: (action: any) => Promise<void>;
  onFinalAnswer?: (thought: string) => Promise<void>;
}

/**
 * Iraqi government and professional domain mappings
 */
const IRAQI_PROFESSIONAL_DOMAINS = {
  // Government and official sites
  government: [
    "gov.iq",
    "parliament.iq",
    "judiciary.iq",
    "coa.gov.iq", // Council of Administration
    "pmi.gov.iq", // Prime Minister's Office
    "mohe.gov.iq", // Ministry of Higher Education
    "moe.gov.iq", // Ministry of Education
    "moh.gov.iq", // Ministry of Health
    "mol.gov.iq", // Ministry of Justice
  ],

  // Legal profession
  legal: [
    "iraqilawyer.org",
    "iraqibar.org",
    "legaliq.org",
    "judiciary.iq",
    "courtinfo.iq",
  ],

  // Medical profession
  medical: [
    "iraqimed.org",
    "ima-iraq.org", // Iraqi Medical Association
    "healthiq.org",
    "pharmacy.iq",
    "nursing.iq",
  ],

  // Educational institutions
  educational: [
    "uobaghdad.edu.iq", // University of Baghdad
    "utq.edu.iq", // University of Technology
    "uomustansiriyah.edu.iq",
    "uokirkuk.edu.iq",
    "uobasrah.edu.iq",
    "mohe.gov.iq", // Ministry of Higher Education
  ],
} as const;

/**
 * Arabic keyboard shortcuts and input methods for web forms
 */
const ARABIC_WEB_SHORTCUTS = {
  switch_language: ["Alt", "Shift"],
  arabic_comma: "،",
  arabic_semicolon: "؛",
  arabic_question: "؟",
  arabic_numerals: "٠١٢٣٤٥٦٧٨٩",
  english_numerals: "0123456789",
} as const;

/**
 * Enhanced Browser Operator with Iraqi Cultural Integration
 */
export class IraqiBrowserOperator implements IraqiOperator {
  private browser: any;
  private currentPage: any = null;
  private logger: any;
  private config: IraqiBrowserConfig;
  private uiHelper: any;
  private deviceScaleFactor?: number;

  // Cultural analysis caches
  private culturalCache = new Map<string, IraqiCulturalStatus>();
  private arabicElementsCache = new Map<string, ArabicGUIElement[]>();
  private domainCache = new Map<string, ProfessionalDomain>();

  // UI state management
  private highlightClickableElements: boolean;
  private showActionInfo: boolean;
  private showWaterFlowEffect: boolean;
  private currentLanguage: "arabic" | "english" = "english";

  // Action space definitions for Iraqi web automation
  static MANUAL = {
    ACTION_SPACES: [
      // Enhanced navigation with Arabic URL support
      `navigate(url='', arabic_support=true|false, cultural_validation=true|false)`,
      `navigate_back(arabic_context=true|false)`,

      // Enhanced clicking with RTL awareness
      `click(start_box='[x1, y1, x2, y2]', rtl_aware=true|false, arabic_context=true|false)`,
      `double_click(start_box='[x1, y1, x2, y2]', rtl_aware=true|false)`,
      `right_click(start_box='[x1, y1, x2, y2]', rtl_aware=true|false)`,

      // Enhanced drag with RTL coordinate adjustment
      `drag(start_box='[x1, y1, x2, y2]', end_box='[x3, y3, x4, y4]', rtl_aware=true|false)`,

      // Enhanced typing with Arabic support
      `type(content='', language='arabic|english|mixed', dialect='iraqi|standard', cultural_check=true|false)`,

      // Enhanced hotkeys with Arabic keyboard layout
      `hotkey(key='', arabic_layout=true|false, professional_domain='legal|medical|educational|governmental')`,

      // Enhanced scrolling with RTL awareness
      `scroll(direction='up|down|left|right', rtl_aware=true|false, arabic_context=true|false)`,

      // Professional web form interactions
      `fill_arabic_form(fields=[], cultural_validation=true|false)`,
      `submit_professional_form(domain='legal|medical|educational', compliance_check=true|false)`,

      // Iraqi government site interactions
      `navigate_government_portal(ministry='', service='', arabic_interface=true|false)`,
      `authenticate_professional(domain='', credentials_type='', cultural_validation=true|false)`,

      // Content validation and filtering
      `validate_page_content(islamic_compliance=true|false, professional_standards=true|false)`,
      `filter_inappropriate_content(strict_mode=true|false)`,

      // Enhanced Arabic text interactions
      `select_arabic_text(start_box='[x1, y1, x2, y2]', end_box='[x3, y3, x4, y4]', rtl_aware=true|false)`,
      `copy_arabic_content(cultural_preservation=true|false)`,
      `paste_arabic_content(formatting='preserve|plain', rtl_adjustment=true|false)`,

      // Standard control actions
      `wait() # Sleep for 5s and take screenshot to check for changes`,
      `finished() # Mark task as successfully completed`,
      `call_user() # Request user assistance for complex cultural decisions`,
    ],
  };

  constructor(config: IraqiBrowserConfig) {
    this.config = {
      // Default configuration for Iraqi professional web automation
      arabicSupport: {
        enabled: true,
        rtlLayoutDetection: true,
        arabicFontOptimization: true,
        dialectRecognition: true,
        mixedContentHandling: true,
        ...config.arabicSupport,
      },
      culturalValidation: {
        enabled: true,
        strictMode: false,
        professionalDomain: ProfessionalDomain.GENERAL,
        islamicCompliance: true,
        contentFiltering: true,
        ...config.culturalValidation,
      },
      professionalNavigation: {
        iraqiGovernmentSites: true,
        professionalPortals: true,
        educationalInstitutions: true,
        medicalSystems: true,
        legalDatabases: true,
        ...config.professionalNavigation,
      },
      uiEnhancements: {
        highlightClickableElements: true,
        showActionInfo: true,
        showWaterFlow: true,
        arabicTextHighlighting: true,
        culturalIndicators: true,
        ...config.uiEnhancements,
      },
      performance: {
        screenshotQuality: 85,
        arabicRenderingDelay: 500,
        culturalValidationTimeout: 3000,
        pageLoadTimeout: 10000,
        ...config.performance,
      },
      security: {
        sensitiveDataProtection: true,
        screenshotFiltering: true,
        actionLogging: true,
        ...config.security,
      },
      ...config,
    };

    this.browser = config.browser;
    this.logger = config.logger || console;

    // UI enhancement settings
    this.highlightClickableElements =
      this.config.uiEnhancements.highlightClickableElements;
    this.showActionInfo = this.config.uiEnhancements.showActionInfo;
    this.showWaterFlowEffect = this.config.uiEnhancements.showWaterFlow;

    // Initialize UI helper (would be actual implementation in production)
    this.uiHelper = {
      highlightClickableElements: async () => {},
      showWaterFlow: () => {},
      showActionInfo: async (action: any) => {},
      showClickIndicator: async (x: number, y: number) => {},
      showDragIndicator: async (
        x1: number,
        y1: number,
        x2: number,
        y2: number,
      ) => {},
      cleanupTemporaryVisuals: async () => {},
      removeClickableHighlights: async () => {},
      cleanup: async () => {},
    };

    this.logger.info(
      "[IraqiBrowserOperator] Initialized with cultural enhancements",
    );
    this.logger.info(
      `[IraqiBrowserOperator] Professional domain: ${this.config.culturalValidation.professionalDomain}`,
    );
    this.logger.info(
      `[IraqiBrowserOperator] Arabic support: ${this.config.arabicSupport.enabled}`,
    );
  }

  /**
   * Enhanced screenshot with Arabic text analysis and cultural validation
   */
  async screenshot(): Promise<{ base64: string; scaleFactor: number }> {
    this.logger.info(
      "[IraqiBrowserOperator] Taking enhanced screenshot with Arabic analysis",
    );

    // Show water flow effect if enabled
    if (this.showWaterFlowEffect) {
      this.uiHelper.showWaterFlow();
    }

    const page = await this.getActivePage();

    try {
      // Get device scale factor
      const deviceScaleFactor = await this.getDeviceScaleFactor();
      this.logger.info(
        `[IraqiBrowserOperator] Device scale factor: ${deviceScaleFactor}`,
      );

      // Highlight clickable elements if enabled
      if (this.highlightClickableElements) {
        this.logger.info(
          "[IraqiBrowserOperator] Highlighting clickable elements for Arabic interface",
        );
        await this.uiHelper.highlightClickableElements();

        // Enhanced delay for Arabic text rendering
        await this.delay(this.config.performance.arabicRenderingDelay);
      }

      // Additional highlighting for Arabic text elements
      if (
        this.config.uiEnhancements.arabicTextHighlighting &&
        this.config.arabicSupport.enabled
      ) {
        await this.highlightArabicTextElements(page);
      }

      // Take screenshot with enhanced quality for Arabic text
      this.logger.info(
        "[IraqiBrowserOperator] Capturing screenshot with Arabic optimization",
      );
      const startTime = Date.now();

      await this.uiHelper.cleanupTemporaryVisuals();
      const buffer = await page.screenshot({
        captureBeyondViewport: false,
        encoding: "base64",
        type: "png", // PNG for better Arabic text quality
        quality: this.config.performance.screenshotQuality,
        fullPage: false,
      });

      const duration = Date.now() - startTime;
      this.logger.info(
        `[IraqiBrowserOperator] Screenshot captured in ${duration}ms`,
      );

      const output = {
        base64: buffer.toString(),
        scaleFactor: deviceScaleFactor || 1,
      };

      // Callback for screenshot processing
      try {
        await this.config.onScreenshot?.(output, page);
      } catch (error) {
        this.logger.error(
          "[IraqiBrowserOperator] Error in onScreenshot callback:",
          error,
        );
      }

      return output;
    } catch (error) {
      // Cleanup on error
      if (this.highlightClickableElements) {
        await this.uiHelper.removeClickableHighlights();
      }
      this.logger.error("[IraqiBrowserOperator] Screenshot failed:", error);
      throw error;
    }
  }

  /**
   * Enhanced execute with cultural validation and Arabic support
   */
  async execute(params: any): Promise<any> {
    this.logger.info(
      "[IraqiBrowserOperator] Starting execute with cultural validation",
    );

    const { parsedPrediction, screenWidth, screenHeight, culturalContext } =
      params;
    const { action_type, action_inputs } = parsedPrediction;

    // Log cultural context if available
    if (culturalContext) {
      this.logger.info(
        `[IraqiBrowserOperator] Cultural context - Domain: ${culturalContext.domain}, Compliance: ${culturalContext.complianceScore}%, Arabic elements: ${culturalContext.arabicElements?.length || 0}`,
      );
    }

    // Show action info with cultural awareness
    if (this.showActionInfo) {
      await this.uiHelper.showActionInfo(parsedPrediction);
    }

    // Trigger callback for action monitoring
    await this.config.onOperatorAction?.(parsedPrediction);

    // Pre-action cultural validation
    if (this.config.culturalValidation.enabled) {
      const validation = await this.validateActionCulturally(
        action_type,
        action_inputs,
        culturalContext,
      );
      if (validation === ActionValidation.FORBIDDEN) {
        this.logger.warn(
          `[IraqiBrowserOperator] Action ${action_type} blocked by cultural validation`,
        );
        return { status: "blocked", reason: "Cultural compliance violation" };
      }
    }

    // Parse coordinates with RTL awareness
    const deviceScaleFactor = await this.getDeviceScaleFactor();
    const coordinates = this.parseCoordinatesWithRTLSupport(
      action_inputs?.start_box || "",
      screenWidth,
      screenHeight,
      deviceScaleFactor,
      culturalContext?.textDirection === ArabicTextDirection.RTL,
    );

    this.logger.info(
      `[IraqiBrowserOperator] Parsed coordinates: (${coordinates.x}, ${coordinates.y})`,
    );
    this.logger.info(`[IraqiBrowserOperator] Executing action: ${action_type}`);

    try {
      const page = await this.getActivePage();

      // Execute action with cultural enhancements
      await this.executeActionWithCulturalContext(
        action_type,
        action_inputs,
        coordinates,
        { screenWidth, screenHeight, deviceScaleFactor },
        culturalContext,
      );

      // Log successful action
      if (this.config.security.actionLogging) {
        this.logSecurityEvent(
          action_type,
          action_inputs,
          "success",
          culturalContext,
        );
      }

      this.logger.info(
        `[IraqiBrowserOperator] Action ${action_type} completed successfully`,
      );

      return {
        startX: coordinates.x,
        startY: coordinates.y,
        action_inputs,
      };
    } catch (error) {
      this.logger.error(
        `[IraqiBrowserOperator] Failed to execute ${action_type}:`,
        error,
      );

      // Log failed action
      if (this.config.security.actionLogging) {
        this.logSecurityEvent(
          action_type,
          action_inputs,
          "failed",
          culturalContext,
        );
      }

      await this.cleanup();
      throw error;
    }
  }

  /**
   * Analyze cultural context of screenshot (implements IraqiOperator interface)
   */
  async analyzeCulturalContext(
    screenshot: string,
  ): Promise<IraqiCulturalStatus> {
    // Check cache first
    const cacheKey = this.generateContentHash(screenshot);
    const cached = this.culturalCache.get(cacheKey);
    if (cached) return cached;

    try {
      let status = IraqiCulturalStatus.COMPLIANT;

      // Analyze current page URL and content
      const page = await this.getActivePage();
      const url = page.url();
      const domain = this.extractDomain(url);

      // Check for professional domain compliance
      const professionalDomain = this.detectProfessionalDomain(url);
      if (professionalDomain !== ProfessionalDomain.GENERAL) {
        await this.config.onProfessionalSiteDetected?.(professionalDomain, url);
      }

      // Basic content filtering
      if (this.config.culturalValidation.contentFiltering) {
        const hasInappropriateContent =
          await this.detectInappropriateContent(page);
        if (hasInappropriateContent) {
          status = this.config.culturalValidation.strictMode
            ? IraqiCulturalStatus.BLOCKED
            : IraqiCulturalStatus.REVIEW_REQUIRED;
        }
      }

      // Islamic compliance check
      if (this.config.culturalValidation.islamicCompliance) {
        const islamicCompliant = await this.checkIslamicCompliance(page);
        if (!islamicCompliant) {
          status = this.config.culturalValidation.strictMode
            ? IraqiCulturalStatus.BLOCKED
            : IraqiCulturalStatus.REVIEW_REQUIRED;
        }
      }

      // Cache result
      this.culturalCache.set(cacheKey, status);

      this.logger.info(
        `[IraqiBrowserOperator] Cultural analysis result: ${status} for domain: ${domain}`,
      );
      return status;
    } catch (error) {
      this.logger.error(
        "[IraqiBrowserOperator] Cultural analysis failed:",
        error,
      );
      return IraqiCulturalStatus.REVIEW_REQUIRED;
    }
  }

  /**
   * Process Arabic text in screenshot (implements IraqiOperator interface)
   */
  async processArabicText(screenshot: string): Promise<ArabicGUIElement[]> {
    if (!this.config.arabicSupport.enabled) {
      return [];
    }

    // Check cache first
    const cacheKey = this.generateContentHash(screenshot);
    const cached = this.arabicElementsCache.get(cacheKey);
    if (cached) return cached;

    try {
      const page = await this.getActivePage();
      const elements: ArabicGUIElement[] = [];

      // Extract Arabic text from page DOM
      const arabicTextElements = await page.evaluate(() => {
        const allElements = document.querySelectorAll("*");
        const arabicElements = [];

        // Arabic text detection regex
        const arabicRegex =
          /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

        for (const element of allElements) {
          const textContent = element.textContent?.trim();
          if (textContent && arabicRegex.test(textContent)) {
            const rect = element.getBoundingClientRect();
            arabicElements.push({
              text: textContent,
              boundingBox: {
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height,
              },
              tagName: element.tagName,
              className: element.className,
              id: element.id,
            });
          }
        }

        return arabicElements;
      });

      // Process extracted elements
      for (const domElement of arabicTextElements) {
        const dialectType = this.detectDialectType(domElement.text);
        const textDirection = this.determineTextDirection(domElement.text);

        elements.push({
          text: domElement.text,
          arabicText: domElement.text,
          englishTranslation: await this.translateToEnglish(domElement.text),
          boundingBox: domElement.boundingBox,
          confidence: this.calculateArabicConfidence(domElement.text),
          dialectType,
          textDirection,
        });
      }

      // Cache result
      this.arabicElementsCache.set(cacheKey, elements);

      this.logger.info(
        `[IraqiBrowserOperator] Detected ${elements.length} Arabic elements on page`,
      );
      return elements;
    } catch (error) {
      this.logger.error(
        "[IraqiBrowserOperator] Arabic text processing failed:",
        error,
      );
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

    // Check for navigation to restricted domains
    if (action_type === "navigate" && action_inputs?.url) {
      const domain = this.extractDomain(action_inputs.url);

      // Check domain whitelist if configured
      if (
        this.config.security.domainWhitelist &&
        this.config.security.domainWhitelist.length > 0
      ) {
        const isWhitelisted = this.config.security.domainWhitelist.some(
          (whitelistedDomain) => domain.includes(whitelistedDomain),
        );
        if (!isWhitelisted) {
          return ActionValidation.REQUIRES_CONFIRMATION;
        }
      }

      // Check for potentially inappropriate domains
      if (this.isPotentiallyInappropriateDomain(domain)) {
        return this.config.culturalValidation.strictMode
          ? ActionValidation.FORBIDDEN
          : ActionValidation.REQUIRES_CONFIRMATION;
      }
    }

    // Check for sensitive content in type actions
    if (action_type === "type" && action_inputs?.content) {
      const content = action_inputs.content;
      if (this.containsInappropriateContent(content)) {
        return this.config.culturalValidation.strictMode
          ? ActionValidation.FORBIDDEN
          : ActionValidation.REQUIRES_CONFIRMATION;
      }
    }

    // Check for professional context requirements
    const professionalDomain =
      this.config.culturalValidation.professionalDomain;
    if (professionalDomain !== ProfessionalDomain.GENERAL) {
      if (
        this.requiresProfessionalValidation(action_type, professionalDomain)
      ) {
        return ActionValidation.REQUIRES_CONFIRMATION;
      }
    }

    return ActionValidation.APPROVED;
  }

  // Action execution methods with cultural enhancements

  private async executeActionWithCulturalContext(
    actionType: string,
    actionInputs: any,
    coordinates: { x: number | null; y: number | null },
    screenContext: {
      screenWidth: number;
      screenHeight: number;
      deviceScaleFactor: number;
    },
    culturalContext?: any,
  ): Promise<void> {
    switch (actionType) {
      case "navigate":
        await this.handleNavigateWithCulturalValidation(
          actionInputs,
          culturalContext,
        );
        break;

      case "navigate_back":
        await this.handleNavigateBack(actionInputs);
        break;

      case "click":
      case "left_click":
      case "left_single":
        await this.handleClickWithRTLSupport(
          coordinates.x,
          coordinates.y,
          culturalContext,
        );
        break;

      case "double_click":
      case "left_double":
        await this.handleDoubleClickWithRTLSupport(
          coordinates.x,
          coordinates.y,
          culturalContext,
        );
        break;

      case "right_click":
        await this.handleRightClickWithRTLSupport(
          coordinates.x,
          coordinates.y,
          culturalContext,
        );
        break;

      case "drag":
        await this.handleDragWithRTLSupport(
          actionInputs,
          screenContext,
          culturalContext,
        );
        break;

      case "type":
        await this.handleTypeWithArabicSupport(actionInputs, culturalContext);
        break;

      case "hotkey":
        await this.handleHotkeyWithArabicLayout(actionInputs, culturalContext);
        break;

      case "scroll":
        await this.handleScrollWithRTLSupport(actionInputs, culturalContext);
        break;

      case "fill_arabic_form":
        await this.handleFillArabicForm(actionInputs, culturalContext);
        break;

      case "submit_professional_form":
        await this.handleSubmitProfessionalForm(actionInputs, culturalContext);
        break;

      case "navigate_government_portal":
        await this.handleNavigateGovernmentPortal(actionInputs);
        break;

      case "validate_page_content":
        await this.handleValidatePageContent(actionInputs);
        break;

      case "wait":
        await this.delay(5000);
        break;

      case "finished":
        if (this.config.onFinalAnswer) {
          await this.config.onFinalAnswer(
            actionInputs?.thought || "Task completed",
          );
        }
        await this.uiHelper.cleanup();
        break;

      case "call_user":
      case "user_stop":
        await this.uiHelper.cleanup();
        break;

      default:
        this.logger.warn(
          `[IraqiBrowserOperator] Unsupported action: ${actionType}`,
        );
        break;
    }
  }

  private async handleNavigateWithCulturalValidation(
    actionInputs: any,
    culturalContext?: any,
  ): Promise<void> {
    const page = await this.getActivePage();
    let url = actionInputs.url || actionInputs.content;
    const arabicSupport = actionInputs.arabic_support !== false;
    const culturalValidation = actionInputs.cultural_validation !== false;

    // URL preprocessing
    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }

    this.logger.info(
      `[IraqiBrowserOperator] Navigating with cultural validation: ${url}`,
    );

    // Cultural validation before navigation
    if (culturalValidation && this.config.culturalValidation.enabled) {
      const domain = this.extractDomain(url);
      if (this.isPotentiallyInappropriateDomain(domain)) {
        this.logger.warn(
          `[IraqiBrowserOperator] Navigation blocked to potentially inappropriate domain: ${domain}`,
        );
        return;
      }
    }

    // Enhanced navigation with Arabic support
    try {
      await page.goto(url, {
        waitUntil: "networkidle2",
        timeout: this.config.performance.pageLoadTimeout,
      });

      // Additional setup for Arabic content
      if (arabicSupport && this.config.arabicSupport.enabled) {
        await this.setupArabicPageContext(page);
      }

      // Detect and cache professional domain
      const professionalDomain = this.detectProfessionalDomain(url);
      this.domainCache.set(url, professionalDomain);

      this.logger.info(
        `[IraqiBrowserOperator] Navigation completed to: ${url}`,
      );
    } catch (error) {
      this.logger.error(`[IraqiBrowserOperator] Navigation failed: ${error}`);
      throw error;
    }
  }

  private async handleTypeWithArabicSupport(
    actionInputs: any,
    culturalContext?: any,
  ): Promise<void> {
    const page = await this.getActivePage();
    const content = actionInputs?.content?.trim();
    const language = actionInputs?.language || "english";
    const dialect = actionInputs?.dialect || "standard";
    const culturalCheck = actionInputs?.cultural_check !== false;

    if (!content) {
      this.logger.warn("[IraqiBrowserOperator] No content to type");
      return;
    }

    this.logger.info(
      `[IraqiBrowserOperator] Typing with Arabic support - Language: ${language}, Dialect: ${dialect}`,
    );

    // Cultural validation for content
    if (culturalCheck && this.config.culturalValidation.enabled) {
      if (this.containsInappropriateContent(content)) {
        this.logger.warn(
          "[IraqiBrowserOperator] Content blocked by cultural validation",
        );
        return;
      }
    }

    // Switch to appropriate keyboard layout
    if (language === "arabic" && this.config.arabicSupport.enabled) {
      await this.switchToArabicLayout(page);
    }

    try {
      const processedContent = content.replace(/\\n$/, "").replace(/\n$/, "");

      // Enhanced typing for Arabic content
      if (language === "arabic" || this.containsArabicText(content)) {
        await this.typeArabicContent(page, processedContent, dialect);
      } else {
        // Standard typing with enhanced delay for mixed content
        await page.keyboard.type(processedContent, {
          delay: 30 + Math.random() * 20,
        });
      }

      // Handle submission
      if (content.endsWith("\n") || content.endsWith("\\n")) {
        await this.delay(100);
        this.logger.info("[IraqiBrowserOperator] Pressing Enter after content");
        await page.keyboard.press("Enter");
        await this.waitForPossibleNavigation(page);
      }

      this.logger.info(
        `[IraqiBrowserOperator] Successfully typed ${content.length} characters`,
      );
    } catch (error) {
      this.logger.error("[IraqiBrowserOperator] Typing failed:", error);
      throw error;
    }
  }

  private async handleClickWithRTLSupport(
    x: number | null,
    y: number | null,
    culturalContext?: any,
  ): Promise<void> {
    if (x === null || y === null) {
      throw new Error("Invalid click coordinates");
    }

    const page = await this.getActivePage();
    this.logger.info(
      `[IraqiBrowserOperator] Clicking with RTL support at (${x}, ${y})`,
    );

    try {
      await this.uiHelper.showClickIndicator(x, y);
      await this.delay(300);

      await page.mouse.move(x, y);
      await this.delay(100);

      // Enhanced delay for Arabic interfaces
      if (culturalContext?.arabicElements?.length > 0) {
        await this.delay(this.config.performance.arabicRenderingDelay);
      }

      await page.mouse.click(x, y);
      await this.delay(800);

      this.logger.info(
        "[IraqiBrowserOperator] Click completed with RTL support",
      );
    } catch (error) {
      this.logger.error(
        "[IraqiBrowserOperator] Click operation failed:",
        error,
      );
      throw error;
    }
  }

  private async handleDoubleClickWithRTLSupport(
    x: number | null,
    y: number | null,
    culturalContext?: any,
  ): Promise<void> {
    if (x === null || y === null) {
      throw new Error("Invalid double click coordinates");
    }

    const page = await this.getActivePage();
    this.logger.info(
      `[IraqiBrowserOperator] Double clicking with RTL support at (${x}, ${y})`,
    );

    try {
      await this.uiHelper.showClickIndicator(x, y);
      await this.delay(300);

      await page.mouse.move(x, y);
      await this.delay(100);
      await page.mouse.click(x, y, { clickCount: 2 });

      // Enhanced delay for Arabic content processing
      const delayTime =
        culturalContext?.arabicElements?.length > 0 ? 1000 : 800;
      await this.delay(delayTime);

      this.logger.info("[IraqiBrowserOperator] Double click completed");
    } catch (error) {
      this.logger.error(
        "[IraqiBrowserOperator] Double click operation failed:",
        error,
      );
      throw error;
    }
  }

  private async handleRightClickWithRTLSupport(
    x: number | null,
    y: number | null,
    culturalContext?: any,
  ): Promise<void> {
    if (x === null || y === null) {
      throw new Error("Invalid right click coordinates");
    }

    const page = await this.getActivePage();
    this.logger.info(
      `[IraqiBrowserOperator] Right clicking with RTL support at (${x}, ${y})`,
    );

    try {
      await this.uiHelper.showClickIndicator(x, y);
      await this.delay(300);

      await page.mouse.move(x, y);
      await this.delay(100);
      await page.mouse.click(x, y, { button: "right" });
      await this.delay(800);

      this.logger.info("[IraqiBrowserOperator] Right click completed");
    } catch (error) {
      this.logger.error(
        "[IraqiBrowserOperator] Right click operation failed:",
        error,
      );
      throw error;
    }
  }

  private async handleScrollWithRTLSupport(
    actionInputs: any,
    culturalContext?: any,
  ): Promise<void> {
    const page = await this.getActivePage();
    const direction = actionInputs?.direction?.toLowerCase();
    const rtlAware =
      actionInputs?.rtl_aware !== false &&
      culturalContext?.textDirection === ArabicTextDirection.RTL;
    const scrollAmount = 500;

    this.logger.info(
      `[IraqiBrowserOperator] Scrolling with RTL support: ${direction}, RTL aware: ${rtlAware}`,
    );

    // Adjust scroll direction for RTL interfaces
    let adjustedDirection = direction;
    if (rtlAware && (direction === "left" || direction === "right")) {
      adjustedDirection = direction === "left" ? "right" : "left";
      this.logger.info(
        `[IraqiBrowserOperator] Adjusted scroll direction for RTL: ${direction} -> ${adjustedDirection}`,
      );
    }

    try {
      switch (adjustedDirection) {
        case "up":
          await page.mouse.wheel({ deltaY: -scrollAmount });
          break;
        case "down":
          await page.mouse.wheel({ deltaY: scrollAmount });
          break;
        case "left":
          await page.mouse.wheel({ deltaX: -scrollAmount });
          break;
        case "right":
          await page.mouse.wheel({ deltaX: scrollAmount });
          break;
        default:
          this.logger.warn(
            `[IraqiBrowserOperator] Unsupported scroll direction: ${direction}`,
          );
          return;
      }

      // Enhanced delay for Arabic content reflow
      const delayTime =
        culturalContext?.arabicElements?.length > 0
          ? this.config.performance.arabicRenderingDelay
          : 300;
      await this.delay(delayTime);

      this.logger.info("[IraqiBrowserOperator] Scroll completed");
    } catch (error) {
      this.logger.error(
        "[IraqiBrowserOperator] Scroll operation failed:",
        error,
      );
      throw error;
    }
  }

  // Enhanced Arabic and cultural helper methods

  private async setupArabicPageContext(page: any): Promise<void> {
    try {
      // Inject CSS for better Arabic text rendering
      await page.addStyleTag({
        content: `
          * {
            font-family: 'Noto Sans Arabic', 'Arial Unicode MS', Arial, sans-serif !important;
            direction: auto;
          }
          
          [dir="rtl"], .rtl {
            direction: rtl !important;
            text-align: right !important;
          }
          
          .arabic-text {
            direction: rtl;
            text-align: right;
            font-feature-settings: "liga" 1, "calt" 1, "ss01" 1;
          }
          
          input[lang="ar"], textarea[lang="ar"], .arabic-input {
            direction: rtl;
            text-align: right;
          }
        `,
      });

      this.logger.info(
        "[IraqiBrowserOperator] Arabic page context setup completed",
      );
    } catch (error) {
      this.logger.error(
        "[IraqiBrowserOperator] Arabic page setup failed:",
        error,
      );
    }
  }

  private async highlightArabicTextElements(page: any): Promise<void> {
    try {
      await page.evaluate(() => {
        // Find and highlight Arabic text elements
        const arabicRegex =
          /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
        const allElements = document.querySelectorAll("*");

        allElements.forEach((element: any) => {
          const textContent = element.textContent?.trim();
          if (textContent && arabicRegex.test(textContent)) {
            element.style.outline = "2px solid #4CAF50";
            element.style.outlineOffset = "2px";
            element.setAttribute("data-arabic-highlighted", "true");
          }
        });
      });

      this.logger.info(
        "[IraqiBrowserOperator] Arabic text elements highlighted",
      );
    } catch (error) {
      this.logger.error(
        "[IraqiBrowserOperator] Arabic highlighting failed:",
        error,
      );
    }
  }

  private async switchToArabicLayout(page: any): Promise<void> {
    if (this.currentLanguage === "arabic") return;

    try {
      // Use standard keyboard switching shortcuts
      await page.keyboard.down("Alt");
      await page.keyboard.press("Shift");
      await page.keyboard.up("Alt");

      await this.delay(200);
      this.currentLanguage = "arabic";

      this.logger.info(
        "[IraqiBrowserOperator] Switched to Arabic keyboard layout",
      );
    } catch (error) {
      this.logger.error(
        "[IraqiBrowserOperator] Arabic layout switch failed:",
        error,
      );
    }
  }

  private async typeArabicContent(
    page: any,
    content: string,
    dialect: string,
  ): Promise<void> {
    try {
      // Enhanced typing for Arabic content with dialect support
      const chars = [...content]; // Proper Unicode character handling

      for (const char of chars) {
        if (this.isArabicCharacter(char)) {
          // Slower typing for Arabic characters to ensure proper rendering
          await page.keyboard.type(char, { delay: 50 + Math.random() * 30 });
        } else {
          // Standard speed for non-Arabic characters
          await page.keyboard.type(char, { delay: 20 + Math.random() * 20 });
        }
      }

      this.logger.info(
        `[IraqiBrowserOperator] Arabic content typed: ${content.length} characters`,
      );
    } catch (error) {
      this.logger.error("[IraqiBrowserOperator] Arabic typing failed:", error);
      throw error;
    }
  }

  private async handleDragWithRTLSupport(
    actionInputs: any,
    screenContext: any,
    culturalContext?: any,
  ): Promise<void> {
    const { screenWidth, screenHeight, deviceScaleFactor } = screenContext;
    const rtlAware =
      actionInputs?.rtl_aware !== false &&
      culturalContext?.textDirection === ArabicTextDirection.RTL;

    const startBoxStr = actionInputs?.start_box || "";
    const endBoxStr = actionInputs?.end_box || "";

    if (!startBoxStr || !endBoxStr) {
      throw new Error("Missing start_box or end_box for drag operation");
    }

    const startCoords = this.parseCoordinatesWithRTLSupport(
      startBoxStr,
      screenWidth,
      screenHeight,
      deviceScaleFactor,
      rtlAware,
    );
    const endCoords = this.parseCoordinatesWithRTLSupport(
      endBoxStr,
      screenWidth,
      screenHeight,
      deviceScaleFactor,
      rtlAware,
    );

    if (
      startCoords.x === null ||
      startCoords.y === null ||
      endCoords.x === null ||
      endCoords.y === null
    ) {
      throw new Error("Invalid coordinates for drag operation");
    }

    const page = await this.getActivePage();

    this.logger.info(
      `[IraqiBrowserOperator] Dragging with RTL support from (${startCoords.x}, ${startCoords.y}) to (${endCoords.x}, ${endCoords.y}), RTL: ${rtlAware}`,
    );

    try {
      await this.uiHelper.showDragIndicator(
        startCoords.x,
        startCoords.y,
        endCoords.x,
        endCoords.y,
      );
      await this.delay(300);

      await page.mouse.move(startCoords.x, startCoords.y);
      await this.delay(100);
      await page.mouse.down();

      // Smooth drag with steps
      const steps = 10;
      for (let i = 1; i <= steps; i++) {
        const stepX =
          startCoords.x + ((endCoords.x - startCoords.x) * i) / steps;
        const stepY =
          startCoords.y + ((endCoords.y - startCoords.y) * i) / steps;
        await page.mouse.move(stepX, stepY);
        await this.delay(30);
      }

      await this.delay(100);
      await page.mouse.up();
      await this.delay(800);

      this.logger.info(
        "[IraqiBrowserOperator] Drag completed with RTL support",
      );
    } catch (error) {
      this.logger.error("[IraqiBrowserOperator] Drag operation failed:", error);
      throw error;
    }
  }

  // Professional web form and content handling

  private async handleFillArabicForm(
    actionInputs: any,
    culturalContext?: any,
  ): Promise<void> {
    const fields = actionInputs?.fields || [];
    const culturalValidation = actionInputs?.cultural_validation !== false;

    this.logger.info(
      `[IraqiBrowserOperator] Filling Arabic form with ${fields.length} fields`,
    );

    if (culturalValidation && this.config.culturalValidation.enabled) {
      // Validate form content before filling
      for (const field of fields) {
        if (field.value && this.containsInappropriateContent(field.value)) {
          this.logger.warn(
            `[IraqiBrowserOperator] Skipping field with inappropriate content: ${field.name}`,
          );
          continue;
        }
      }
    }

    const page = await this.getActivePage();

    try {
      for (const field of fields) {
        await this.fillFormField(page, field, culturalContext);
        await this.delay(200); // Brief pause between fields
      }

      this.logger.info("[IraqiBrowserOperator] Arabic form filling completed");
    } catch (error) {
      this.logger.error("[IraqiBrowserOperator] Form filling failed:", error);
      throw error;
    }
  }

  private async handleSubmitProfessionalForm(
    actionInputs: any,
    culturalContext?: any,
  ): Promise<void> {
    const domain =
      actionInputs?.domain || this.config.culturalValidation.professionalDomain;
    const complianceCheck = actionInputs?.compliance_check !== false;

    this.logger.info(
      `[IraqiBrowserOperator] Submitting professional form for domain: ${domain}`,
    );

    if (complianceCheck && this.config.culturalValidation.enabled) {
      // Additional validation for professional submissions
      const isCompliant = await this.validateProfessionalFormSubmission(domain);
      if (!isCompliant) {
        this.logger.warn(
          "[IraqiBrowserOperator] Form submission blocked by compliance check",
        );
        return;
      }
    }

    const page = await this.getActivePage();

    try {
      // Look for submit buttons with Arabic or English text
      const submitButton = await page.$(
        'button[type="submit"], input[type="submit"], .submit-btn, .إرسال',
      );

      if (submitButton) {
        await submitButton.click();
        await this.waitForPossibleNavigation(page);
        this.logger.info(
          "[IraqiBrowserOperator] Professional form submitted successfully",
        );
      } else {
        // Try pressing Enter as fallback
        await page.keyboard.press("Enter");
        await this.waitForPossibleNavigation(page);
        this.logger.info(
          "[IraqiBrowserOperator] Form submitted using Enter key",
        );
      }
    } catch (error) {
      this.logger.error(
        "[IraqiBrowserOperator] Form submission failed:",
        error,
      );
      throw error;
    }
  }

  private async handleNavigateGovernmentPortal(
    actionInputs: any,
  ): Promise<void> {
    const ministry = actionInputs?.ministry || "";
    const service = actionInputs?.service || "";
    const arabicInterface = actionInputs?.arabic_interface !== false;

    this.logger.info(
      `[IraqiBrowserOperator] Navigating government portal - Ministry: ${ministry}, Service: ${service}`,
    );

    // Map ministry to URL (this would be expanded with actual government URLs)
    const governmentUrls = {
      education: "https://mohe.gov.iq",
      health: "https://moh.gov.iq",
      justice: "https://mol.gov.iq",
      interior: "https://moi.gov.iq",
    };

    const url =
      governmentUrls[ministry as keyof typeof governmentUrls] ||
      `https://${ministry}.gov.iq`;

    try {
      await this.handleNavigateWithCulturalValidation({
        url,
        arabic_support: arabicInterface,
        cultural_validation: true,
      });

      this.logger.info(
        `[IraqiBrowserOperator] Government portal navigation completed: ${url}`,
      );
    } catch (error) {
      this.logger.error(
        "[IraqiBrowserOperator] Government portal navigation failed:",
        error,
      );
      throw error;
    }
  }

  // Utility and helper methods

  private parseCoordinatesWithRTLSupport(
    boxStr: string,
    screenWidth: number,
    screenHeight: number,
    deviceScaleFactor: number,
    rtlAware: boolean,
  ): { x: number | null; y: number | null } {
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

      // RTL coordinate adjustment
      if (rtlAware) {
        const adjustedX1 = screenWidth - x2;
        const adjustedX2 = screenWidth - x1;
        x1 = adjustedX1;
        x2 = adjustedX2;
        this.logger.info(
          "[IraqiBrowserOperator] RTL coordinate adjustment applied",
        );
      }

      // Calculate center and adjust for scale factor
      const centerX = Math.floor((x1 + x2) / 2) / deviceScaleFactor;
      const centerY = Math.floor((y1 + y2) / 2) / deviceScaleFactor;

      return { x: centerX, y: centerY };
    } catch (error) {
      this.logger.error(
        "[IraqiBrowserOperator] Coordinate parsing failed:",
        error,
      );
      return { x: null, y: null };
    }
  }

  private detectProfessionalDomain(url: string): ProfessionalDomain {
    const domain = this.extractDomain(url);

    // Check against Iraqi professional domain mappings
    for (const [category, domains] of Object.entries(
      IRAQI_PROFESSIONAL_DOMAINS,
    )) {
      if (
        domains.some((professionalDomain) =>
          domain.includes(professionalDomain),
        )
      ) {
        switch (category) {
          case "government":
            return ProfessionalDomain.GOVERNMENTAL;
          case "legal":
            return ProfessionalDomain.LEGAL;
          case "medical":
            return ProfessionalDomain.MEDICAL;
          case "educational":
            return ProfessionalDomain.EDUCATIONAL;
        }
      }
    }

    return ProfessionalDomain.GENERAL;
  }

  private extractDomain(url: string): string {
    try {
      return new URL(url).hostname.toLowerCase();
    } catch {
      return url.toLowerCase();
    }
  }

  private containsArabicText(text: string): boolean {
    return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(
      text,
    );
  }

  private isArabicCharacter(char: string): boolean {
    return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(
      char,
    );
  }

  private detectDialectType(
    text: string,
  ): "iraqi" | "standard" | "mixed" | "unknown" {
    // Iraqi dialect markers
    const iraqiMarkers = ["چ", "پ", "ڤ", "گ", "شلونك", "آني", "انت"];
    const hasIraqiMarkers = iraqiMarkers.some((marker) =>
      text.includes(marker),
    );

    if (hasIraqiMarkers) return "iraqi";
    if (this.containsArabicText(text)) return "standard";
    return "unknown";
  }

  private determineTextDirection(text: string): ArabicTextDirection {
    const hasArabic = this.containsArabicText(text);
    const hasEnglish = /[a-zA-Z]/.test(text);

    if (hasArabic && hasEnglish) return ArabicTextDirection.MIXED;
    if (hasArabic) return ArabicTextDirection.RTL;
    return ArabicTextDirection.LTR;
  }

  private calculateArabicConfidence(text: string): number {
    const arabicChars =
      text.match(
        /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g,
      ) || [];
    return text.length > 0 ? arabicChars.length / text.length : 0;
  }

  private async translateToEnglish(arabicText: string): Promise<string> {
    // Placeholder for translation service integration
    return `[Translation of: ${arabicText.substring(0, 50)}...]`;
  }

  private containsInappropriateContent(content: string): boolean {
    // Basic content filtering - would be enhanced with actual filtering in production
    return false; // Placeholder
  }

  private isPotentiallyInappropriateDomain(domain: string): boolean {
    // Basic domain filtering - would be enhanced with actual filtering in production
    return false; // Placeholder
  }

  private requiresProfessionalValidation(
    actionType: string,
    domain: ProfessionalDomain,
  ): boolean {
    const sensitiveActions = [
      "submit_professional_form",
      "navigate_government_portal",
      "type",
    ];
    return (
      sensitiveActions.includes(actionType) &&
      domain !== ProfessionalDomain.GENERAL
    );
  }

  private async validateActionCulturally(
    actionType: string,
    actionInputs: any,
    culturalContext?: any,
  ): Promise<ActionValidation> {
    // Delegate to interface method
    return await this.validateAction({
      action_type: actionType,
      action_inputs: actionInputs,
    });
  }

  private async detectInappropriateContent(page: any): Promise<boolean> {
    // Placeholder for content detection
    return false;
  }

  private async checkIslamicCompliance(page: any): Promise<boolean> {
    // Placeholder for Islamic compliance checking
    return true;
  }

  private async validateProfessionalFormSubmission(
    domain: string,
  ): Promise<boolean> {
    // Placeholder for professional form validation
    return true;
  }

  private async fillFormField(
    page: any,
    field: any,
    culturalContext?: any,
  ): Promise<void> {
    // Enhanced form field filling with Arabic support
    try {
      const selector = field.selector || `[name="${field.name}"]`;
      const element = await page.$(selector);

      if (element) {
        await element.click();
        await element.clear();

        if (this.containsArabicText(field.value)) {
          await this.typeArabicContent(page, field.value, "standard");
        } else {
          await element.type(field.value, { delay: 50 });
        }
      }
    } catch (error) {
      this.logger.error(
        `[IraqiBrowserOperator] Failed to fill field ${field.name}:`,
        error,
      );
    }
  }

  private generateContentHash(content: string): string {
    // Simple hash for caching - would use proper hashing in production
    return Buffer.from(content.slice(0, 1000)).toString("base64").slice(0, 32);
  }

  private logSecurityEvent(
    actionType: string,
    actionInputs: any,
    status: string,
    culturalContext?: any,
  ): void {
    const event = {
      timestamp: Date.now(),
      action: actionType,
      inputs: actionInputs,
      status,
      culturalContext: culturalContext
        ? {
            domain: culturalContext.domain,
            complianceScore: culturalContext.complianceScore,
            arabicElements: culturalContext.arabicElements?.length || 0,
          }
        : null,
    };

    this.logger.info("[IraqiBrowserOperator] Security Event:", event);
  }

  private async getActivePage(): Promise<any> {
    const page = await this.browser.getActivePage();
    if (!page) {
      throw new Error("No active page found");
    }
    if (this.currentPage !== page) {
      this.currentPage = page;
    }
    return page;
  }

  private async getDeviceScaleFactor(): Promise<number> {
    if (this.deviceScaleFactor) {
      return this.deviceScaleFactor;
    }

    try {
      const page = await this.getActivePage();
      const scaleFactor = page.viewport()?.deviceScaleFactor;

      if (scaleFactor) {
        this.deviceScaleFactor = scaleFactor;
        return scaleFactor;
      }

      const devicePixelRatio = await page.evaluate(
        () => window.devicePixelRatio,
      );
      if (devicePixelRatio) {
        this.deviceScaleFactor = devicePixelRatio;
        return devicePixelRatio;
      }

      return 1; // Default fallback
    } catch (error) {
      this.logger.error(
        "[IraqiBrowserOperator] Failed to get device scale factor:",
        error,
      );
      return 1;
    }
  }

  private async waitForPossibleNavigation(page: any): Promise<void> {
    try {
      const navigationPromise = new Promise<void>((resolve) => {
        const onStarted = () => {
          this.logger.info("[IraqiBrowserOperator] Navigation started");
          resolve();
          page.off("framenavigated", onStarted);
        };
        page.on("framenavigated", onStarted);

        setTimeout(() => {
          page.off("framenavigated", onStarted);
          resolve();
        }, 5000);
      });

      await navigationPromise;
      this.logger.info(
        "[IraqiBrowserOperator] Navigation completed or timed out",
      );
    } catch (error) {
      this.logger.error(
        "[IraqiBrowserOperator] Navigation wait failed:",
        error,
      );
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async handleNavigateBack(actionInputs: any): Promise<void> {
    const page = await this.getActivePage();
    const arabicContext = actionInputs?.arabic_context !== false;

    this.logger.info(
      `[IraqiBrowserOperator] Navigating back with Arabic context: ${arabicContext}`,
    );

    try {
      await page.goBack();

      // Enhanced delay for Arabic page reloading
      if (arabicContext) {
        await this.delay(this.config.performance.arabicRenderingDelay);
      }

      this.logger.info("[IraqiBrowserOperator] Navigate back completed");
    } catch (error) {
      this.logger.error("[IraqiBrowserOperator] Navigate back failed:", error);
      throw error;
    }
  }

  private async handleHotkeyWithArabicLayout(
    actionInputs: any,
    culturalContext?: any,
  ): Promise<void> {
    const page = await this.getActivePage();
    const keyStr = actionInputs?.key || actionInputs?.hotkey;
    const arabicLayout =
      actionInputs?.arabic_layout !== false &&
      this.config.arabicSupport.enabled;
    const professionalDomain =
      actionInputs?.professional_domain ||
      this.config.culturalValidation.professionalDomain;

    if (!keyStr) {
      this.logger.warn("[IraqiBrowserOperator] No hotkey specified");
      throw new Error("No hotkey specified");
    }

    this.logger.info(
      `[IraqiBrowserOperator] Executing hotkey with Arabic layout: ${keyStr}, Arabic: ${arabicLayout}, Domain: ${professionalDomain}`,
    );

    try {
      // Switch to appropriate keyboard layout if needed
      if (arabicLayout && this.currentLanguage !== "arabic") {
        await this.switchToArabicLayout(page);
      }

      const keys = keyStr.split(/[\s+]/);

      // Execute hotkey combination
      for (const key of keys) {
        await page.keyboard.down(key);
      }

      await this.delay(100);

      for (const key of keys.reverse()) {
        await page.keyboard.up(key);
      }

      // Wait for potential navigation
      const navigationKeys = ["Enter", "F5"];
      if (keys.some((key) => navigationKeys.includes(key))) {
        await this.waitForPossibleNavigation(page);
      } else {
        await this.delay(500);
      }

      this.logger.info("[IraqiBrowserOperator] Hotkey execution completed");
    } catch (error) {
      this.logger.error(
        "[IraqiBrowserOperator] Hotkey execution failed:",
        error,
      );
      throw error;
    }
  }

  private async handleValidatePageContent(actionInputs: any): Promise<void> {
    const islamicCompliance = actionInputs?.islamic_compliance !== false;
    const professionalStandards =
      actionInputs?.professional_standards !== false;

    this.logger.info(
      `[IraqiBrowserOperator] Validating page content - Islamic: ${islamicCompliance}, Professional: ${professionalStandards}`,
    );

    const page = await this.getActivePage();

    try {
      let validationResults = {
        islamicCompliant: true,
        professionallyAppropriate: true,
        issues: [] as string[],
      };

      if (islamicCompliance) {
        const isCompliant = await this.checkIslamicCompliance(page);
        if (!isCompliant) {
          validationResults.islamicCompliant = false;
          validationResults.issues.push(
            "Content may not comply with Islamic principles",
          );
        }
      }

      if (professionalStandards) {
        const isProfessional = await this.validateProfessionalStandards(page);
        if (!isProfessional) {
          validationResults.professionallyAppropriate = false;
          validationResults.issues.push(
            "Content may not meet professional standards",
          );
        }
      }

      this.logger.info(
        "[IraqiBrowserOperator] Content validation completed:",
        validationResults,
      );
    } catch (error) {
      this.logger.error(
        "[IraqiBrowserOperator] Content validation failed:",
        error,
      );
      throw error;
    }
  }

  private async validateProfessionalStandards(page: any): Promise<boolean> {
    // Placeholder for professional standards validation
    return true;
  }

  public async cleanup(): Promise<void> {
    this.logger.info("[IraqiBrowserOperator] Starting cleanup...");

    try {
      await this.uiHelper.cleanup();

      if (this.currentPage) {
        await this.currentPage.close();
        this.currentPage = null;
        this.logger.info("[IraqiBrowserOperator] Page closed successfully");
      }

      // Clear caches
      this.culturalCache.clear();
      this.arabicElementsCache.clear();
      this.domainCache.clear();

      this.logger.info("[IraqiBrowserOperator] Cleanup completed");
    } catch (error) {
      this.logger.error("[IraqiBrowserOperator] Cleanup failed:", error);
    }
  }
}

/**
 * Factory function for creating Iraqi Browser Operator instances
 */
export function createIraqiBrowserOperator(
  browser: any,
  config: Partial<IraqiBrowserConfig> = {},
  logger?: any,
): IraqiBrowserOperator {
  const defaultConfig: IraqiBrowserConfig = {
    browser,
    arabicSupport: {
      enabled: true,
      rtlLayoutDetection: true,
      arabicFontOptimization: true,
      dialectRecognition: true,
      mixedContentHandling: true,
    },
    culturalValidation: {
      enabled: true,
      strictMode: false,
      professionalDomain: ProfessionalDomain.GENERAL,
      islamicCompliance: true,
      contentFiltering: true,
    },
    professionalNavigation: {
      iraqiGovernmentSites: true,
      professionalPortals: true,
      educationalInstitutions: true,
      medicalSystems: true,
      legalDatabases: true,
    },
    uiEnhancements: {
      highlightClickableElements: true,
      showActionInfo: true,
      showWaterFlow: true,
      arabicTextHighlighting: true,
      culturalIndicators: true,
    },
    performance: {
      screenshotQuality: 85,
      arabicRenderingDelay: 500,
      culturalValidationTimeout: 3000,
      pageLoadTimeout: 10000,
    },
    security: {
      sensitiveDataProtection: true,
      screenshotFiltering: true,
      actionLogging: true,
    },
    logger: logger || console,
  };

  const mergedConfig: IraqiBrowserConfig = {
    ...defaultConfig,
    ...config,
    arabicSupport: { ...defaultConfig.arabicSupport, ...config.arabicSupport },
    culturalValidation: {
      ...defaultConfig.culturalValidation,
      ...config.culturalValidation,
    },
    professionalNavigation: {
      ...defaultConfig.professionalNavigation,
      ...config.professionalNavigation,
    },
    uiEnhancements: {
      ...defaultConfig.uiEnhancements,
      ...config.uiEnhancements,
    },
    performance: { ...defaultConfig.performance, ...config.performance },
    security: { ...defaultConfig.security, ...config.security },
  };

  return new IraqiBrowserOperator(mergedConfig);
}
