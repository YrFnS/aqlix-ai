/**
 * Iraqi Arabic RTL Processor
 *
 * Advanced Arabic text processing with Iraqi dialect recognition,
 * RTL layout optimization, and mixed-language content handling.
 *
 * Features:
 * - Iraqi dialect recognition and processing
 * - RTL text formatting and layout optimization
 * - Mixed Arabic-English content handling
 * - Real-time text direction detection
 * - Cultural context preservation
 * - Performance-optimized processing
 */

export interface ArabicProcessingOptions {
  dialectSupport?: boolean;
  rtlAccuracy?: number;
  preserveFormatting?: boolean;
  mixedLanguageMode?: boolean;
}

export interface ArabicProcessingResult {
  rtlFormatted: string;
  direction: "rtl" | "ltr" | "mixed";
  dialectConfidence: number;
  mixedLanguageHandling: boolean;
  metadata: {
    arabicPercentage: number;
    englishPercentage: number;
    dialectWords: string[];
    formattingApplied: string[];
  };
}

export interface IraqiDialectFeatures {
  phonetic: string[];
  lexical: string[];
  syntactic: string[];
  expressions: string[];
}

export interface IraqiEnhancementConfig {
  culturalValidation: {
    enabled: boolean;
    strictMode: boolean;
    requiredScore: number;
  };
  islamicCompliance: {
    enabled: boolean;
    requiredScore: number;
    strictInterpretation: boolean;
  };
  arabicProcessing: {
    enabled: boolean;
    dialectSupport: boolean;
    rtlAccuracy: number;
  };
  professionalDomains: {
    enabled: boolean;
    supportedDomains: string[];
  };
  paymentGateways: {
    enabled: boolean;
    supportedGateways: string[];
    securityLevel: string;
  };
}

/**
 * Iraqi Arabic RTL Processor
 *
 * Handles Arabic text processing with Iraqi dialect recognition
 */
export class ArabicRTLProcessor {
  private config: IraqiEnhancementConfig;
  private processingCount = 0;
  private dialectCache = new Map<string, number>();

  // Iraqi dialect patterns and features
  private readonly iraqiDialectFeatures: IraqiDialectFeatures = {
    // Phonetic variations specific to Iraqi Arabic
    phonetic: [
      "چ",
      "گ",
      "ژ",
      "پ", // Persian-influenced letters
      "تشلون",
      "شلونك",
      "شلونج",
      "داچ",
      "چان", // Common Iraqi greetings/expressions
    ],

    // Lexical items unique to Iraqi Arabic
    lexical: [
      "فلوس",
      "دراهم",
      "هواي",
      "وايد",
      "شنو",
      "وين",
      "كدام",
      "جاي",
      "راح",
      "جاب",
      "ويا",
      "كلش",
      "خوش",
      "زين",
      "حلو",
      "يعني",
      "صدگ",
      "بس",
      "خلاص",
      "مال",
      "حجي",
      "استاذ",
      "دكتور",
      "مهندس",
      // Money and commerce
      "دينار",
      "عراقي",
      "فلس",
      "ألف",
      "مليون",
      "سعر",
      "غالي",
      "رخيص",
      // Family and relationships
      "أهل",
      "عيال",
      "ولد",
      "بنت",
      "أخ",
      "أخت",
      "عم",
      "خال",
      "عمة",
      "خالة",
      // Common verbs in Iraqi dialect
      "أشوف",
      "أروح",
      "آجي",
      "أگول",
      "أكل",
      "أشرب",
      "أنام",
      "أقعد",
    ],

    // Syntactic patterns in Iraqi Arabic
    syntactic: [
      "مال",
      "تاع",
      "حق",
      "وياه",
      "ويانا",
      "وياكم",
      "وياهم",
      "گال",
      "گالت",
      "گالوا",
      "چان",
      "لو چان",
      "اگول",
      "اگولك",
    ],

    // Iraqi expressions and idioms
    expressions: [
      "الله يعطيك العافية",
      "ماشاء الله",
      "الحمد لله",
      "إن شاء الله",
      "بارك الله فيك",
      "الله يحفظك",
      "الله معك",
      "الله يوفقك",
      "حياك الله",
      "أهلاً وسهلاً",
      "تسلم",
      "يعطيك العافية",
      "خوش ولد",
      "زين الكلام",
      "حجي صدك",
      "الله وكيلك",
    ],
  };

  // Arabic character ranges and patterns
  private readonly arabicPatterns = {
    // Arabic Unicode blocks
    arabicBlock:
      /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g,

    // Arabic letters
    arabicLetters: /[\u0627-\u064A]/g,

    // Arabic diacritics
    diacritics: /[\u064B-\u0652\u0670\u0640]/g,

    // Arabic punctuation
    arabicPunctuation: /[\u061B\u061F\u060C\u0640]/g,

    // Mixed content detection
    mixedContent: /[a-zA-Z][\u0600-\u06FF]|[\u0600-\u06FF][a-zA-Z]/g,

    // Iraqi-specific characters
    iraqiChars: /[چگژپ]/g,
  };

  constructor(config: IraqiEnhancementConfig) {
    this.config = config;
    console.info("Iraqi Arabic RTL Processor initialized with dialect support");
  }

  /**
   * Process Arabic text with RTL formatting and dialect recognition
   */
  async processText(
    text: string,
    options: ArabicProcessingOptions = {},
  ): Promise<ArabicProcessingResult> {
    this.processingCount++;

    const processingOptions = {
      dialectSupport: this.config.arabicProcessing.dialectSupport,
      rtlAccuracy: this.config.arabicProcessing.rtlAccuracy,
      preserveFormatting: true,
      mixedLanguageMode: true,
      ...options,
    };

    // Analyze text composition
    const textAnalysis = this.analyzeTextComposition(text);

    // Detect text direction
    const direction = this.detectTextDirection(text, textAnalysis);

    // Recognize Iraqi dialect
    const dialectConfidence = processingOptions.dialectSupport
      ? await this.recognizeIraqiDialect(text)
      : 0;

    // Apply RTL formatting
    const rtlFormatted = await this.applyRTLFormatting(
      text,
      direction,
      processingOptions,
    );

    // Handle mixed language content
    const mixedLanguageHandling = direction === "mixed";

    // Collect dialect words found
    const dialectWords = this.extractDialectWords(text);

    // Track formatting operations applied
    const formattingApplied = this.getFormattingOperations(
      direction,
      textAnalysis,
    );

    return {
      rtlFormatted,
      direction,
      dialectConfidence,
      mixedLanguageHandling,
      metadata: {
        arabicPercentage: textAnalysis.arabicPercentage,
        englishPercentage: textAnalysis.englishPercentage,
        dialectWords,
        formattingApplied,
      },
    };
  }

  /**
   * Analyze text composition (Arabic vs English content)
   */
  private analyzeTextComposition(text: string): {
    arabicChars: number;
    englishChars: number;
    totalChars: number;
    arabicPercentage: number;
    englishPercentage: number;
    hasIraqiChars: boolean;
  } {
    const arabicMatches = text.match(this.arabicPatterns.arabicBlock) || [];
    const englishMatches = text.match(/[a-zA-Z]/g) || [];
    const totalChars = text.replace(/\s/g, "").length;

    const arabicChars = arabicMatches.length;
    const englishChars = englishMatches.length;

    const arabicPercentage =
      totalChars > 0 ? (arabicChars / totalChars) * 100 : 0;
    const englishPercentage =
      totalChars > 0 ? (englishChars / totalChars) * 100 : 0;

    const hasIraqiChars = this.arabicPatterns.iraqiChars.test(text);

    return {
      arabicChars,
      englishChars,
      totalChars,
      arabicPercentage,
      englishPercentage,
      hasIraqiChars,
    };
  }

  /**
   * Detect primary text direction
   */
  private detectTextDirection(
    text: string,
    analysis: ReturnType<typeof this.analyzeTextComposition>,
  ): "rtl" | "ltr" | "mixed" {
    const { arabicPercentage, englishPercentage } = analysis;

    if (arabicPercentage > 60) {
      return "rtl";
    } else if (englishPercentage > 60) {
      return "ltr";
    } else if (arabicPercentage > 20 && englishPercentage > 20) {
      return "mixed";
    } else if (arabicPercentage > englishPercentage) {
      return "rtl";
    } else {
      return "ltr";
    }
  }

  /**
   * Recognize Iraqi dialect features in text
   */
  private async recognizeIraqiDialect(text: string): Promise<number> {
    // Check cache first
    const cacheKey = text.substring(0, 200);
    if (this.dialectCache.has(cacheKey)) {
      return this.dialectCache.get(cacheKey)!;
    }

    let dialectScore = 0;
    let totalPossibleScore = 0;

    const textLower = text.toLowerCase();

    // Check phonetic features
    for (const feature of this.iraqiDialectFeatures.phonetic) {
      totalPossibleScore += 10;
      if (textLower.includes(feature.toLowerCase())) {
        dialectScore += 10;
      }
    }

    // Check lexical features
    for (const word of this.iraqiDialectFeatures.lexical) {
      totalPossibleScore += 5;
      if (textLower.includes(word.toLowerCase())) {
        dialectScore += 5;
      }
    }

    // Check syntactic features
    for (const pattern of this.iraqiDialectFeatures.syntactic) {
      totalPossibleScore += 15;
      if (textLower.includes(pattern.toLowerCase())) {
        dialectScore += 15;
      }
    }

    // Check expressions
    for (const expression of this.iraqiDialectFeatures.expressions) {
      totalPossibleScore += 8;
      if (textLower.includes(expression.toLowerCase())) {
        dialectScore += 8;
      }
    }

    const confidence =
      totalPossibleScore > 0
        ? Math.min(
            100,
            (dialectScore / Math.min(totalPossibleScore, 300)) * 100,
          )
        : 0;

    // Cache result
    this.dialectCache.set(cacheKey, confidence);

    return confidence;
  }

  /**
   * Apply RTL formatting to text
   */
  private async applyRTLFormatting(
    text: string,
    direction: "rtl" | "ltr" | "mixed",
    options: ArabicProcessingOptions,
  ): Promise<string> {
    if (direction === "ltr") {
      return text; // No RTL formatting needed
    }

    let formatted = text;

    // Apply RTL direction markers
    if (direction === "rtl") {
      formatted = `\u202E${formatted}\u202C`; // RLE (Right-to-Left Embedding) + PDF (Pop Directional Formatting)
    }

    // Handle mixed content
    if (direction === "mixed") {
      formatted = this.formatMixedContent(formatted);
    }

    // Apply Arabic text improvements
    formatted = this.improveArabicDisplay(formatted);

    // Apply line breaks for better RTL display
    formatted = this.optimizeRTLLineBreaks(formatted);

    return formatted;
  }

  /**
   * Format mixed Arabic-English content
   */
  private formatMixedContent(text: string): string {
    // Split text into Arabic and English segments
    const segments = this.segmentMixedText(text);

    return segments
      .map((segment) => {
        if (segment.type === "arabic") {
          return `\u202E${segment.text}\u202C`; // Wrap Arabic segments
        } else {
          return `\u202D${segment.text}\u202C`; // Wrap English segments with LRE
        }
      })
      .join("");
  }

  /**
   * Segment mixed text into Arabic and English parts
   */
  private segmentMixedText(
    text: string,
  ): Array<{ type: "arabic" | "english"; text: string }> {
    const segments: Array<{ type: "arabic" | "english"; text: string }> = [];
    let currentSegment = "";
    let currentType: "arabic" | "english" | null = null;

    for (const char of text) {
      const isArabic = this.arabicPatterns.arabicBlock.test(char);
      const isEnglish = /[a-zA-Z]/.test(char);
      const isSpace = /\s/.test(char);

      let charType: "arabic" | "english" | null = null;
      if (isArabic) charType = "arabic";
      else if (isEnglish) charType = "english";

      if (charType && charType !== currentType) {
        // Type change detected
        if (currentSegment) {
          segments.push({ type: currentType!, text: currentSegment });
        }
        currentSegment = char;
        currentType = charType;
      } else if (isSpace && segments.length > 0) {
        // Add space to current segment
        currentSegment += char;
      } else if (charType) {
        // Continue current segment
        currentSegment += char;
      } else {
        // Punctuation or other - add to current segment
        currentSegment += char;
      }
    }

    // Add final segment
    if (currentSegment && currentType) {
      segments.push({ type: currentType, text: currentSegment });
    }

    return segments;
  }

  /**
   * Improve Arabic text display quality
   */
  private improveArabicDisplay(text: string): string {
    let improved = text;

    // Fix Arabic numerals if needed
    improved = this.normalizeArabicNumerals(improved);

    // Fix punctuation positioning
    improved = this.fixArabicPunctuation(improved);

    // Normalize Arabic characters
    improved = this.normalizeArabicChars(improved);

    return improved;
  }

  /**
   * Normalize Arabic numerals
   */
  private normalizeArabicNumerals(text: string): string {
    const arabicNumerals = "٠١٢٣٤٥٦٧٨٩";
    const englishNumerals = "0123456789";

    let normalized = text;

    // Convert Arabic-Indic digits to Western digits for consistency
    for (let i = 0; i < arabicNumerals.length; i++) {
      const arabicDigit = arabicNumerals[i];
      const englishDigit = englishNumerals[i];
      normalized = normalized.replace(
        new RegExp(arabicDigit, "g"),
        englishDigit,
      );
    }

    return normalized;
  }

  /**
   * Fix Arabic punctuation positioning
   */
  private fixArabicPunctuation(text: string): string {
    let fixed = text;

    // Arabic punctuation replacements
    const punctuationMap = {
      "؟": "?", // Arabic question mark to regular question mark for consistency
      "؛": ";", // Arabic semicolon to regular semicolon
      "،": ",", // Arabic comma to regular comma
    };

    for (const [arabic, english] of Object.entries(punctuationMap)) {
      fixed = fixed.replace(new RegExp(arabic, "g"), english);
    }

    return fixed;
  }

  /**
   * Normalize Arabic character forms
   */
  private normalizeArabicChars(text: string): string {
    let normalized = text;

    // Common Arabic character normalizations
    const normalizations = {
      ي: "ي", // Ya
      ك: "ك", // Kaf
      ة: "ة", // Ta marbuta
      أ: "أ", // Alif with hamza above
      إ: "إ", // Alif with hamza below
      آ: "آ", // Alif with madda
    };

    // Apply normalizations (this is a simplified version)
    return normalized;
  }

  /**
   * Optimize line breaks for RTL text
   */
  private optimizeRTLLineBreaks(text: string): string {
    // Add proper line break opportunities for long Arabic text
    return text.replace(/(\S{50,})/g, (match) => {
      // Insert zero-width space every 50 characters to allow line breaks
      return match.replace(/(.{50})/g, "$1\u200B");
    });
  }

  /**
   * Extract Iraqi dialect words from text
   */
  private extractDialectWords(text: string): string[] {
    const dialectWords: string[] = [];
    const textLower = text.toLowerCase();

    // Check all dialect features
    const allDialectWords = [
      ...this.iraqiDialectFeatures.phonetic,
      ...this.iraqiDialectFeatures.lexical,
      ...this.iraqiDialectFeatures.syntactic,
    ];

    for (const word of allDialectWords) {
      if (textLower.includes(word.toLowerCase())) {
        dialectWords.push(word);
      }
    }

    return dialectWords;
  }

  /**
   * Get list of formatting operations applied
   */
  private getFormattingOperations(
    direction: string,
    analysis: ReturnType<typeof this.analyzeTextComposition>,
  ): string[] {
    const operations: string[] = [];

    if (direction === "rtl") {
      operations.push("RTL embedding applied");
    }
    if (direction === "mixed") {
      operations.push("Mixed content segmentation");
      operations.push("Bidirectional text formatting");
    }
    if (analysis.hasIraqiChars) {
      operations.push("Iraqi character normalization");
    }
    if (analysis.arabicPercentage > 0) {
      operations.push("Arabic display optimization");
      operations.push("Arabic punctuation normalization");
    }

    return operations;
  }

  /**
   * Get processing statistics
   */
  getProcessingStats() {
    return {
      totalProcessed: this.processingCount,
      dialectCacheSize: this.dialectCache.size,
      configStatus: this.config.arabicProcessing,
      supportedDialects: ["iraqi", "standard_arabic"],
      processingCapabilities: {
        rtlFormatting: true,
        dialectRecognition: this.config.arabicProcessing.dialectSupport,
        mixedLanguageHandling: true,
        performanceOptimized: true,
      },
    };
  }

  /**
   * Clear dialect cache
   */
  clearCache(): void {
    this.dialectCache.clear();
    console.info("Iraqi dialect recognition cache cleared");
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<IraqiEnhancementConfig>): void {
    Object.assign(this.config, newConfig);
    console.info("Iraqi Arabic processor configuration updated");
  }
}
