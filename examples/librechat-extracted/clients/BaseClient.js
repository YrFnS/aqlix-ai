/**
 * Enhanced Base Client for Iraqi AI Chat System
 * Extracted from LibreChat/api/app/clients/BaseClient.js + OpenAIClient.js
 * Enhanced with Arabic language optimization and cultural validation
 */

const { EventEmitter } = require("events");
const { logger } = require("~/config");
const {
  IraqiCulturalValidator,
} = require("../services/IraqiCulturalValidator");
const {
  ArabicLanguageProcessor,
} = require("../services/ArabicLanguageProcessor");
const {
  ProfessionalDomainManager,
} = require("../services/ProfessionalDomainManager");

class BaseClient extends EventEmitter {
  constructor(apiKey, options = {}) {
    super();
    this.apiKey = apiKey;
    this.sender = options.sender || "Assistant";
    this.contextStrategy = options.contextStrategy || "summarize";

    // Iraqi AI enhancements
    this.culturalValidator = new IraqiCulturalValidator(
      options.culturalSettings,
    );
    this.arabicProcessor = new ArabicLanguageProcessor(options.arabicSettings);
    this.professionalManager = new ProfessionalDomainManager(
      options.professionalSettings,
    );

    // Enhanced configuration with Iraqi context
    this.iraqiConfig = {
      enableCulturalValidation: options.enableCulturalValidation !== false,
      enableArabicProcessing: options.enableArabicProcessing !== false,
      professionalMode: options.professionalMode || false,
      dialectSupport: options.dialectSupport || ["iraqi"],
      islamicCompliance: options.islamicCompliance || "moderate",
      regionalContext: options.regionalContext || "baghdad",
      culturalSensitivity: options.culturalSensitivity || "neutral",
    };

    // Performance and quality tracking
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      culturalValidationPasses: 0,
      arabicProcessingRequests: 0,
      averageResponseTime: 0,
      errorRate: 0,
    };

    this.startTime = Date.now();
    logger.info(
      `Iraqi Enhanced BaseClient initialized with cultural validation: ${this.iraqiConfig.enableCulturalValidation}`,
    );
  }

  /**
   * Enhanced sendMessage with Iraqi cultural and linguistic processing
   */
  async sendMessage(message, options = {}) {
    const startTime = Date.now();
    this.metrics.totalRequests++;

    try {
      // Pre-process message with Iraqi enhancements
      const processedMessage = await this.preprocessMessage(message, options);

      // Send to underlying provider
      const response = await this._sendMessage(processedMessage, options);

      // Post-process response with Iraqi enhancements
      const enhancedResponse = await this.postprocessResponse(
        response,
        processedMessage,
        options,
      );

      // Update metrics
      this.metrics.successfulRequests++;
      this.updateResponseTime(Date.now() - startTime);

      logger.info(
        `Iraqi Enhanced message processed successfully in ${Date.now() - startTime}ms`,
      );
      return enhancedResponse;
    } catch (error) {
      this.metrics.errorRate =
        (this.metrics.totalRequests - this.metrics.successfulRequests) /
        this.metrics.totalRequests;
      logger.error("Iraqi Enhanced BaseClient error:", error);
      throw error;
    }
  }

  /**
   * Pre-process message with Iraqi cultural and linguistic enhancements
   */
  async preprocessMessage(message, options = {}) {
    const processed = {
      ...message,
      iraqiContext: {
        originalLanguage: this.detectLanguage(message.text),
        culturalContext: options.culturalContext || {},
        professionalContext: options.professionalContext || {},
        processingFlags: {
          requiresCulturalValidation: this.iraqiConfig.enableCulturalValidation,
          requiresArabicProcessing: this.containsArabic(message.text),
          isProfessionalQuery: this.isProfessionalQuery(message.text, options),
        },
      },
    };

    // Cultural validation for user messages
    if (processed.iraqiContext.processingFlags.requiresCulturalValidation) {
      const culturalValidation = await this.culturalValidator.validateMessage(
        message.text,
        {
          islamicCompliance: this.iraqiConfig.islamicCompliance,
          culturalSensitivity: this.iraqiConfig.culturalSensitivity,
          professionalDomain: options.professionalContext?.domain,
        },
      );

      processed.iraqiContext.culturalValidation = culturalValidation;
      this.metrics.culturalValidationPasses += culturalValidation.isValid
        ? 1
        : 0;

      if (
        !culturalValidation.isValid &&
        culturalValidation.severity === "high"
      ) {
        throw new Error(
          `رسالة غير متوافقة ثقافياً: ${culturalValidation.reason}`,
        ); // Culturally incompatible message
      }
    }

    // Arabic language processing
    if (processed.iraqiContext.processingFlags.requiresArabicProcessing) {
      const arabicProcessing = await this.arabicProcessor.processText(
        message.text,
        {
          dialect: this.iraqiConfig.dialectSupport[0],
          enableRtl: true,
          preserveOriginal: true,
          transliterationMode: options.transliterationMode || "contextual",
        },
      );

      processed.iraqiContext.arabicProcessing = arabicProcessing;
      this.metrics.arabicProcessingRequests++;
    }

    // Professional context enhancement
    if (processed.iraqiContext.processingFlags.isProfessionalQuery) {
      const professionalContext = await this.professionalManager.enhanceContext(
        message.text,
        {
          domain: options.professionalContext?.domain,
          specialist: options.professionalContext?.specialist,
          confidentialityLevel:
            options.professionalContext?.confidentialityLevel,
        },
      );

      processed.iraqiContext.professionalContext = professionalContext;
    }

    return processed;
  }

  /**
   * Post-process response with Iraqi cultural and linguistic enhancements
   */
  async postprocessResponse(response, originalMessage, options = {}) {
    const enhanced = {
      ...response,
      iraqiEnhancements: {
        culturallyValidated: false,
        arabicOptimized: false,
        professionallyReviewed: false,
        qualityScore: 0.8,
      },
    };

    // Cultural validation for assistant responses
    if (this.iraqiConfig.enableCulturalValidation) {
      const culturalValidation = await this.culturalValidator.validateResponse(
        response.text,
        {
          originalMessage: originalMessage.text,
          culturalContext: originalMessage.iraqiContext?.culturalContext,
          islamicCompliance: this.iraqiConfig.islamicCompliance,
        },
      );

      enhanced.iraqiEnhancements.culturallyValidated =
        culturalValidation.isValid;
      enhanced.iraqiEnhancements.culturalValidation = culturalValidation;

      if (
        !culturalValidation.isValid &&
        culturalValidation.severity === "high"
      ) {
        // Generate culturally appropriate alternative
        enhanced.text =
          await this.culturalValidator.generateCulturallyAppropriateResponse(
            response.text,
            culturalValidation,
          );
        enhanced.iraqiEnhancements.culturallyValidated = true;
      }
    }

    // Arabic language optimization for responses
    if (this.shouldOptimizeForArabic(originalMessage, options)) {
      const arabicOptimization = await this.arabicProcessor.optimizeResponse(
        response.text,
        {
          targetLanguage: originalMessage.iraqiContext?.originalLanguage,
          dialect: this.iraqiConfig.dialectSupport[0],
          enableRtl: true,
          culturalContext: originalMessage.iraqiContext?.culturalContext,
        },
      );

      enhanced.text = arabicOptimization.optimizedText;
      enhanced.iraqiEnhancements.arabicOptimized = true;
      enhanced.iraqiEnhancements.arabicOptimization = arabicOptimization;
    }

    // Professional domain review
    if (originalMessage.iraqiContext?.processingFlags?.isProfessionalQuery) {
      const professionalReview = await this.professionalManager.reviewResponse(
        response.text,
        {
          originalQuery: originalMessage.text,
          domain: originalMessage.iraqiContext?.professionalContext?.domain,
          accuracyLevel: options.professionalAccuracyLevel || "standard",
        },
      );

      enhanced.iraqiEnhancements.professionallyReviewed = true;
      enhanced.iraqiEnhancements.professionalReview = professionalReview;

      if (professionalReview.requiresDisclaimer) {
        enhanced.text += `\n\n${professionalReview.disclaimer}`;
      }
    }

    // Calculate overall quality score
    enhanced.iraqiEnhancements.qualityScore = this.calculateQualityScore(
      enhanced.iraqiEnhancements,
    );

    return enhanced;
  }

  /**
   * Detect language of input text
   */
  detectLanguage(text) {
    const arabicRegex = /[\u0600-\u06FF]/;
    const englishRegex = /[a-zA-Z]/;

    const hasArabic = arabicRegex.test(text);
    const hasEnglish = englishRegex.test(text);

    if (hasArabic && hasEnglish) return "mixed";
    if (hasArabic) return "arabic";
    if (hasEnglish) return "english";
    return "unknown";
  }

  /**
   * Check if text contains Arabic characters
   */
  containsArabic(text) {
    return /[\u0600-\u06FF]/.test(text);
  }

  /**
   * Determine if query is professional domain related
   */
  isProfessionalQuery(text, options) {
    const professionalKeywords = {
      legal: [
        "قانون",
        "محامي",
        "دعوى",
        "محكمة",
        "law",
        "lawyer",
        "case",
        "court",
      ],
      medical: [
        "طبيب",
        "مرض",
        "علاج",
        "دواء",
        "doctor",
        "disease",
        "treatment",
        "medicine",
      ],
      educational: [
        "تعليم",
        "مدرسة",
        "جامعة",
        "درس",
        "education",
        "school",
        "university",
        "lesson",
      ],
      government: [
        "حكومة",
        "وزارة",
        "دائرة",
        "رسمي",
        "government",
        "ministry",
        "department",
        "official",
      ],
    };

    if (options.professionalContext?.domain) return true;

    const lowerText = text.toLowerCase();
    return Object.values(professionalKeywords)
      .flat()
      .some((keyword) => lowerText.includes(keyword.toLowerCase()));
  }

  /**
   * Determine if response should be optimized for Arabic
   */
  shouldOptimizeForArabic(originalMessage, options) {
    if (!this.iraqiConfig.enableArabicProcessing) return false;
    if (options.forceArabicOptimization) return true;

    const originalLanguage = originalMessage.iraqiContext?.originalLanguage;
    return originalLanguage === "arabic" || originalLanguage === "mixed";
  }

  /**
   * Calculate overall quality score based on Iraqi enhancements
   */
  calculateQualityScore(enhancements) {
    let score = 0.5; // Base score

    if (enhancements.culturallyValidated) score += 0.25;
    if (enhancements.arabicOptimized) score += 0.15;
    if (enhancements.professionallyReviewed) score += 0.1;

    // Bonus for high cultural compliance
    if (enhancements.culturalValidation?.score > 0.9) score += 0.05;

    return Math.min(score, 1.0);
  }

  /**
   * Update average response time metric
   */
  updateResponseTime(responseTime) {
    const totalTime =
      this.metrics.averageResponseTime * (this.metrics.successfulRequests - 1);
    this.metrics.averageResponseTime =
      (totalTime + responseTime) / this.metrics.successfulRequests;
  }

  /**
   * Get client performance metrics with Iraqi context
   */
  getMetrics() {
    return {
      ...this.metrics,
      uptime: Date.now() - this.startTime,
      culturalValidationRate:
        this.metrics.culturalValidationPasses / this.metrics.totalRequests,
      arabicProcessingRate:
        this.metrics.arabicProcessingRequests / this.metrics.totalRequests,
      successRate: this.metrics.successfulRequests / this.metrics.totalRequests,
      iraqiEnhancementsEnabled: {
        culturalValidation: this.iraqiConfig.enableCulturalValidation,
        arabicProcessing: this.iraqiConfig.enableArabicProcessing,
        professionalMode: this.iraqiConfig.professionalMode,
      },
    };
  }

  /**
   * Update Iraqi configuration
   */
  updateIraqiConfig(newConfig) {
    this.iraqiConfig = { ...this.iraqiConfig, ...newConfig };
    logger.info("Iraqi configuration updated:", newConfig);
  }

  /**
   * Abstract method to be implemented by specific provider clients
   */
  async _sendMessage(message, options) {
    throw new Error(
      "_sendMessage must be implemented by provider-specific client",
    );
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    this.removeAllListeners();
    if (this.culturalValidator?.cleanup) this.culturalValidator.cleanup();
    if (this.arabicProcessor?.cleanup) this.arabicProcessor.cleanup();
    if (this.professionalManager?.cleanup) this.professionalManager.cleanup();
  }
}

/**
 * Enhanced OpenAI Client with Iraqi optimizations
 */
class EnhancedOpenAIClient extends BaseClient {
  constructor(apiKey, options = {}) {
    super(apiKey, options);
    this.baseURL = options.baseURL || "https://api.openai.com/v1";
    this.model = options.model || "gpt-4";

    // Iraqi-specific model preferences
    this.iraqiModelPreferences = {
      arabicOptimized: ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"],
      culturallyAware: ["gpt-4", "gpt-4-turbo"],
      professionalGrade: ["gpt-4", "gpt-4-turbo"],
    };
  }

  async _sendMessage(message, options = {}) {
    // Select optimal model based on Iraqi context
    const selectedModel = this.selectOptimalModel(message, options);

    const payload = {
      model: selectedModel,
      messages: this.formatMessagesForOpenAI(message, options),
      temperature: options.temperature || 0.7,
      max_tokens: options.max_tokens || 1000,
      stream: options.stream || false,
    };

    // Add Iraqi context to system messages
    if (message.iraqiContext) {
      payload.messages = this.enhanceSystemMessages(
        payload.messages,
        message.iraqiContext,
      );
    }

    try {
      const response = await this.makeOpenAIRequest(payload);
      return this.formatOpenAIResponse(response);
    } catch (error) {
      logger.error("OpenAI API error with Iraqi context:", error);
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }

  /**
   * Select optimal model based on Iraqi context and requirements
   */
  selectOptimalModel(message, options) {
    const context = message.iraqiContext;

    // For Arabic content, prefer Arabic-optimized models
    if (context?.processingFlags?.requiresArabicProcessing) {
      return this.iraqiModelPreferences.arabicOptimized[0];
    }

    // For professional queries, use professional-grade models
    if (context?.processingFlags?.isProfessionalQuery) {
      return this.iraqiModelPreferences.professionalGrade[0];
    }

    // For high cultural sensitivity, use culturally aware models
    if (this.iraqiConfig.culturalSensitivity === "high") {
      return this.iraqiModelPreferences.culturallyAware[0];
    }

    return this.model;
  }

  /**
   * Enhance system messages with Iraqi cultural context
   */
  enhanceSystemMessages(messages, iraqiContext) {
    const systemEnhancements = [];

    if (this.iraqiConfig.enableCulturalValidation) {
      systemEnhancements.push(
        "You are an AI assistant for Iraqi users. Ensure all responses respect Islamic values and Iraqi cultural norms.",
      );
    }

    if (iraqiContext.processingFlags?.requiresArabicProcessing) {
      systemEnhancements.push(
        "The user communicates in Arabic. Respond appropriately in Arabic with proper RTL formatting when needed.",
      );
    }

    if (iraqiContext.professionalContext?.domain) {
      systemEnhancements.push(
        `This is a professional consultation in the ${iraqiContext.professionalContext.domain} domain. Provide accurate, professional advice with appropriate disclaimers.`,
      );
    }

    if (systemEnhancements.length > 0) {
      const enhancedSystemMessage = {
        role: "system",
        content: systemEnhancements.join(" "),
      };

      return [enhancedSystemMessage, ...messages];
    }

    return messages;
  }

  /**
   * Format messages for OpenAI API
   */
  formatMessagesForOpenAI(message, options) {
    // This would format the message structure for OpenAI API
    // Implementation depends on your message structure
    return [
      {
        role: message.isCreatedByUser ? "user" : "assistant",
        content: message.text,
      },
    ];
  }

  /**
   * Make request to OpenAI API
   */
  async makeOpenAIRequest(payload) {
    // Implementation for actual OpenAI API call
    // This is a placeholder - implement with your HTTP client
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Format OpenAI response
   */
  formatOpenAIResponse(response) {
    return {
      text: response.choices[0]?.message?.content || "",
      model: response.model,
      usage: response.usage,
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = {
  BaseClient,
  EnhancedOpenAIClient,
};

/**
 * Iraqi AI Chat System Client Enhancements Applied:
 *
 * 1. Cultural Validation Integration - Islamic compliance and Iraqi cultural appropriateness
 * 2. Arabic Language Processing - RTL text handling, dialect support, transliteration
 * 3. Professional Domain Management - Legal, medical, educational context awareness
 * 4. Intelligent Model Selection - Arabic-optimized and culturally-aware model preferences
 * 5. Enhanced Pre/Post Processing - Cultural and linguistic message enhancement
 * 6. Quality Metrics Tracking - Cultural validation rates, Arabic processing metrics
 * 7. Language Detection - Automatic Arabic, English, and mixed language identification
 * 8. Professional Query Recognition - Domain-specific professional consultation handling
 * 9. System Message Enhancement - Cultural context injection for AI model guidance
 * 10. Performance Monitoring - Response time, success rate, and enhancement metrics
 * 11. Configurable Cultural Settings - Islamic compliance levels, regional context
 * 12. Resource Cleanup Management - Proper cleanup of Iraqi enhancement services
 */
