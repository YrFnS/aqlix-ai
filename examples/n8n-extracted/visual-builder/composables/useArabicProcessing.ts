/**
 * Arabic Processing Composable
 * Handles Arabic text processing, RTL layout, and dialect recognition for Iraqi workflows
 */

import { ref, computed } from "vue";
import type {
  ArabicProcessingResult,
  ArabicDialect,
  ArabicProcessingConfig,
} from "../types/cultural.types";

interface ArabicTextSegment {
  text: string;
  direction: "rtl" | "ltr";
  type: "arabic" | "english" | "number" | "punctuation";
  startIndex: number;
  endIndex: number;
}

interface DialectPattern {
  pattern: RegExp;
  dialect: string;
  confidence: number;
  examples: string[];
}

export function useArabicProcessing() {
  // Configuration
  const config = ref<ArabicProcessingConfig>({
    enableRTL: true,
    dialectRecognition: true,
    mixedLanguageSupport: true,
    arabicFontOptimization: true,
    bidiTextSupport: true,
    professionalTerminology: true,
  });

  // Processing state
  const isProcessing = ref(false);
  const lastProcessedText = ref("");
  const processingCache = new Map<string, ArabicProcessingResult>();

  // Arabic character detection patterns
  const ARABIC_RANGE =
    /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  const ARABIC_LETTERS = /[\u0627-\u064A\u0671-\u06D3]/;
  const ARABIC_DIACRITICS = /[\u064B-\u065F\u0670\u06D6-\u06ED]/;
  const ARABIC_NUMERALS = /[\u06F0-\u06F9]/;
  const LATIN_RANGE = /[A-Za-z]/;
  const LATIN_NUMERALS = /[0-9]/;

  // Iraqi dialect patterns
  const DIALECT_PATTERNS: Record<string, DialectPattern[]> = {
    baghdadi: [
      {
        pattern: /شلونك|شكو\s*ماكو|يبه|يمه|هسه|شدسوين/g,
        dialect: "baghdadi",
        confidence: 0.8,
        examples: ["شلونك", "شكو ماكو", "يبه", "يمه"],
      },
      {
        pattern: /ج(?=\w)/g, // ج instead of ق
        dialect: "baghdadi",
        confidence: 0.3,
        examples: ["يجول", "جال"],
      },
      {
        pattern: /چ/g, // چ sound
        dialect: "baghdadi",
        confidence: 0.5,
        examples: ["چان", "چيف"],
      },
    ],
    basri: [
      {
        pattern: /شلونچ|چيف|هاي|گاع|ويش|چان/g,
        dialect: "basri",
        confidence: 0.8,
        examples: ["شلونچ", "چيف", "هاي", "گاع"],
      },
      {
        pattern: /گ/g, // گ sound
        dialect: "basri",
        confidence: 0.6,
        examples: ["گال", "گد"],
      },
    ],
    moslawi: [
      {
        pattern: /ايش|ويا|گال|ما\s*گد/g,
        dialect: "moslawi",
        confidence: 0.8,
        examples: ["ايش", "ويا", "گال"],
      },
      {
        pattern: /ق(?=\w)/g, // Preserved ق
        dialect: "moslawi",
        confidence: 0.2,
        examples: ["قال", "قلت"],
      },
    ],
    standard: [
      {
        pattern: /كيف\s*حالك|ماذا|الآن|قال|لا\s*أعرف/g,
        dialect: "standard",
        confidence: 0.9,
        examples: ["كيف حالك", "ماذا", "الآن"],
      },
    ],
  };

  // Professional terminology dictionaries
  const PROFESSIONAL_TERMS = {
    health: {
      arabic: [
        "طبيب",
        "مستشفى",
        "علاج",
        "دواء",
        "مريض",
        "صحة",
        "عملية",
        "فحص",
        "تشخيص",
        "وصفة",
      ],
      english: [
        "doctor",
        "hospital",
        "treatment",
        "medicine",
        "patient",
        "health",
        "surgery",
        "examination",
        "diagnosis",
        "prescription",
      ],
      bilingual: new Map([
        ["طبيب", "doctor"],
        ["مستشفى", "hospital"],
        ["علاج", "treatment"],
        ["دواء", "medicine"],
        ["مريض", "patient"],
        ["صحة", "health"],
      ]),
    },
    education: [
      {
        arabic: [
          "مدرس",
          "طالب",
          "مدرسة",
          "جامعة",
          "درس",
          "امتحان",
          "كتاب",
          "تعليم",
          "منهج",
          "شهادة",
        ],
        english: [
          "teacher",
          "student",
          "school",
          "university",
          "lesson",
          "exam",
          "book",
          "education",
          "curriculum",
          "certificate",
        ],
        bilingual: new Map([
          ["مدرس", "teacher"],
          ["طالب", "student"],
          ["مدرسة", "school"],
          ["جامعة", "university"],
          ["درس", "lesson"],
          ["امتحان", "exam"],
        ]),
      },
    ],
    government: {
      arabic: [
        "وزارة",
        "حكومة",
        "مواطن",
        "هوية",
        "جواز",
        "وثيقة",
        "خدمة",
        "إجراء",
        "طلب",
        "موافقة",
      ],
      english: [
        "ministry",
        "government",
        "citizen",
        "identity",
        "passport",
        "document",
        "service",
        "procedure",
        "application",
        "approval",
      ],
      bilingual: new Map([
        ["وزارة", "ministry"],
        ["حكومة", "government"],
        ["مواطن", "citizen"],
        ["هوية", "identity"],
        ["جواز", "passport"],
      ]),
    },
  };

  // Text direction detection
  const detectTextDirection = (text: string): "rtl" | "ltr" | "mixed" => {
    const arabicChars = (text.match(ARABIC_RANGE) || []).length;
    const latinChars = (text.match(LATIN_RANGE) || []).length;
    const totalChars = arabicChars + latinChars;

    if (totalChars === 0) return "ltr";

    const arabicRatio = arabicChars / totalChars;
    const latinRatio = latinChars / totalChars;

    if (arabicRatio > 0.7) return "rtl";
    if (latinRatio > 0.7) return "ltr";
    return "mixed";
  };

  // Language detection and ratio calculation
  const analyzeLanguageComposition = (text: string) => {
    const arabicChars = (text.match(ARABIC_RANGE) || []).length;
    const latinChars = (text.match(LATIN_RANGE) || []).length;
    const numeralChars = (text.match(/[0-9\u06F0-\u06F9]/) || []).length;
    const totalChars = text.length;

    return {
      arabic: totalChars > 0 ? arabicChars / totalChars : 0,
      english: totalChars > 0 ? latinChars / totalChars : 0,
      numerals: totalChars > 0 ? numeralChars / totalChars : 0,
      other:
        totalChars > 0
          ? (totalChars - arabicChars - latinChars - numeralChars) / totalChars
          : 0,
    };
  };

  // Dialect detection using pattern matching
  const detectDialect = (text: string): ArabicDialect => {
    const dialectScores: Record<string, number> = {
      baghdadi: 0,
      basri: 0,
      moslawi: 0,
      standard: 0,
    };

    let totalMatches = 0;
    const characteristics: Record<string, string[]> = {
      phonetic: [],
      lexical: [],
      grammatical: [],
      cultural: [],
    };

    // Analyze each dialect pattern
    Object.entries(DIALECT_PATTERNS).forEach(([dialectName, patterns]) => {
      patterns.forEach((pattern) => {
        const matches = text.match(pattern.pattern);
        if (matches) {
          const matchCount = matches.length;
          dialectScores[dialectName] += matchCount * pattern.confidence;
          totalMatches += matchCount;

          // Collect characteristics
          characteristics.lexical.push(
            ...pattern.examples.filter((ex) => text.includes(ex)),
          );
        }
      });
    });

    // Find the highest scoring dialect
    const sortedDialects = Object.entries(dialectScores)
      .sort(([, a], [, b]) => b - a)
      .filter(([, score]) => score > 0);

    if (sortedDialects.length === 0 || totalMatches === 0) {
      return {
        primary: "unknown",
        secondary: [],
        confidence: 0,
        characteristics,
        professional: {
          domainTerminology: [],
          formalRegister: "colloquial",
          audienceAppropriate: true,
        },
      };
    }

    const [primaryDialect, primaryScore] = sortedDialects[0];
    const confidence = Math.min(1, primaryScore / Math.max(1, totalMatches));

    // Detect secondary dialects
    const secondary = sortedDialects
      .slice(1, 3)
      .filter(([, score]) => score > primaryScore * 0.3)
      .map(([dialect]) => dialect);

    // Determine formal register
    const hasStandardFeatures = dialectScores.standard > 0;
    const hasFormalTerms = PROFESSIONAL_TERMS.government.arabic.some((term) =>
      text.includes(term),
    );

    let formalRegister: "colloquial" | "formal" | "professional" | "academic" =
      "colloquial";
    if (hasFormalTerms) formalRegister = "professional";
    else if (hasStandardFeatures) formalRegister = "formal";

    return {
      primary: primaryDialect as any,
      secondary,
      confidence,
      characteristics,
      professional: {
        domainTerminology: [],
        formalRegister,
        audienceAppropriate: confidence > 0.5,
      },
    };
  };

  // Text segmentation for mixed language content
  const segmentMixedText = (text: string): ArabicTextSegment[] => {
    const segments: ArabicTextSegment[] = [];
    let currentSegment = "";
    let currentType: "arabic" | "english" | "number" | "punctuation" =
      "english";
    let startIndex = 0;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      let charType: typeof currentType;

      if (ARABIC_RANGE.test(char)) {
        charType = "arabic";
      } else if (LATIN_RANGE.test(char)) {
        charType = "english";
      } else if (/[0-9\u06F0-\u06F9]/.test(char)) {
        charType = "number";
      } else {
        charType = "punctuation";
      }

      if (charType !== currentType && currentSegment) {
        // Save current segment
        segments.push({
          text: currentSegment,
          direction: currentType === "arabic" ? "rtl" : "ltr",
          type: currentType,
          startIndex,
          endIndex: i - 1,
        });

        // Start new segment
        currentSegment = char;
        currentType = charType;
        startIndex = i;
      } else {
        currentSegment += char;
      }
    }

    // Add final segment
    if (currentSegment) {
      segments.push({
        text: currentSegment,
        direction: currentType === "arabic" ? "rtl" : "ltr",
        type: currentType,
        startIndex,
        endIndex: text.length - 1,
      });
    }

    return segments;
  };

  // RTL text formatting
  const formatRTLText = (
    text: string,
    segments?: ArabicTextSegment[],
  ): string => {
    if (!config.value.enableRTL) return text;

    const textSegments = segments || segmentMixedText(text);

    if (textSegments.length === 1 && textSegments[0].type === "arabic") {
      // Pure Arabic text
      return `<div dir="rtl" class="arabic-text">${text}</div>`;
    }

    if (textSegments.some((seg) => seg.type === "arabic")) {
      // Mixed content - wrap each segment appropriately
      let formattedText = "";

      textSegments.forEach((segment) => {
        if (segment.type === "arabic") {
          formattedText += `<span dir="rtl" class="arabic-segment">${segment.text}</span>`;
        } else if (segment.type === "english") {
          formattedText += `<span dir="ltr" class="english-segment">${segment.text}</span>`;
        } else {
          formattedText += `<span class="neutral-segment">${segment.text}</span>`;
        }
      });

      return `<div class="mixed-content">${formattedText}</div>`;
    }

    return text;
  };

  // Professional terminology enhancement
  const enhanceProfessionalTerminology = (
    text: string,
    domain?: string,
  ): { text: string; enhancements: string[] } => {
    if (!domain || !config.value.professionalTerminology) {
      return { text, enhancements: [] };
    }

    const enhancements: string[] = [];
    let enhancedText = text;

    const terms = PROFESSIONAL_TERMS[domain as keyof typeof PROFESSIONAL_TERMS];
    if (!terms) return { text, enhancements: [] };

    // Add bilingual terminology
    if (terms.bilingual) {
      terms.bilingual.forEach((english, arabic) => {
        if (text.includes(arabic) && !text.includes(english)) {
          enhancements.push(
            `Add English term "${english}" for Arabic "${arabic}"`,
          );
        }
        if (text.includes(english) && !text.includes(arabic)) {
          enhancements.push(
            `Add Arabic term "${arabic}" for English "${english}"`,
          );
        }
      });
    }

    return { text: enhancedText, enhancements };
  };

  // Text quality assessment
  const assessTextQuality = (
    text: string,
    dialect: ArabicDialect,
    segments: ArabicTextSegment[],
  ) => {
    let readabilityScore = 1.0;
    let culturalAppropriatenesss = 1.0;
    let professionalAccuracy = 1.0;
    let rtlLayoutCompliance = 1.0;

    // Readability assessment
    const wordCount = text.split(/\s+/).length;
    if (wordCount < 3) readabilityScore *= 0.8; // Too short
    if (wordCount > 100) readabilityScore *= 0.9; // Might be too long

    // Dialect consistency
    if (dialect.confidence < 0.5) {
      readabilityScore *= 0.8;
      culturalAppropriatenesss *= 0.9;
    }

    // Mixed content handling
    const hasArabic = segments.some((seg) => seg.type === "arabic");
    const hasEnglish = segments.some((seg) => seg.type === "english");

    if (hasArabic && hasEnglish) {
      // Mixed content - check for proper handling
      if (segments.length > 10) {
        readabilityScore *= 0.8; // Too much switching
      }
    }

    // RTL compliance
    if (hasArabic && !config.value.enableRTL) {
      rtlLayoutCompliance = 0.5;
    }

    return {
      readabilityScore,
      culturalAppropriatenesss,
      professionalAccuracy,
      rtlLayoutCompliance,
    };
  };

  // Main processing function
  const processArabicText = async (
    text: string,
    domain?: string,
  ): Promise<ArabicProcessingResult> => {
    if (!text.trim()) {
      return {
        originalText: text,
        processedText: text,
        analysis: {
          direction: "ltr",
          dialect: {
            primary: "unknown",
            secondary: [],
            confidence: 0,
            characteristics: {
              phonetic: [],
              lexical: [],
              grammatical: [],
              cultural: [],
            },
            professional: {
              domainTerminology: [],
              formalRegister: "colloquial",
              audienceAppropriate: true,
            },
          },
          confidence: 0,
          languageRatio: { arabic: 0, english: 0, other: 0 },
          complexity: "simple",
        },
        enhancements: {
          rtlFormatting: false,
          dialectNormalization: false,
          professionalTerminology: false,
          bilingualLabeling: false,
          culturalValidation: false,
        },
        quality: {
          readabilityScore: 0,
          culturalAppropriatenesss: 1,
          professionalAccuracy: 1,
          rtlLayoutCompliance: 1,
        },
        issues: [],
        recommendations: [],
      };
    }

    // Check cache first
    const cacheKey = `${text}_${domain || "general"}`;
    if (processingCache.has(cacheKey)) {
      return processingCache.get(cacheKey)!;
    }

    isProcessing.value = true;

    try {
      // Analyze text composition
      const direction = detectTextDirection(text);
      const languageRatio = analyzeLanguageComposition(text);
      const segments = segmentMixedText(text);
      const dialect = detectDialect(text);

      // Process text formatting
      let processedText = text;
      const enhancements = {
        rtlFormatting: false,
        dialectNormalization: false,
        professionalTerminology: false,
        bilingualLabeling: false,
        culturalValidation: false,
      };

      // Apply RTL formatting if needed
      if (direction === "rtl" || direction === "mixed") {
        processedText = formatRTLText(text, segments);
        enhancements.rtlFormatting = true;
      }

      // Enhance professional terminology
      const terminologyResult = enhanceProfessionalTerminology(
        processedText,
        domain,
      );
      if (terminologyResult.enhancements.length > 0) {
        processedText = terminologyResult.text;
        enhancements.professionalTerminology = true;
      }

      // Quality assessment
      const quality = assessTextQuality(text, dialect, segments);

      // Generate issues and recommendations
      const issues: any[] = [];
      const recommendations: any[] = [];

      if (direction === "mixed" && segments.length > 8) {
        issues.push({
          id: "excessive-language-switching",
          type: "mixed-language",
          severity: "medium",
          message: "Excessive language switching detected",
          arabicMessage: "تم اكتشاف تبديل مفرط بين اللغات",
          location: {
            start: 0,
            end: text.length,
            context: text.substring(0, 50),
          },
          resolution: {
            required: false,
            suggestions: [
              "Reduce language switching",
              "Group similar language content",
            ],
            arabicSuggestions: [
              "قلل التبديل بين اللغات",
              "اجمع المحتوى باللغة المشابهة",
            ],
            automaticFix: false,
          },
        });
      }

      if (dialect.confidence < 0.5 && languageRatio.arabic > 0.3) {
        issues.push({
          id: "low-dialect-confidence",
          type: "dialect-inconsistency",
          severity: "low",
          message: "Dialect detection confidence is low",
          arabicMessage: "مستوى الثقة في اكتشاف اللهجة منخفض",
          location: { start: 0, end: text.length, context: text },
          resolution: {
            required: false,
            suggestions: [
              "Use more consistent dialect patterns",
              "Consider standard Arabic",
            ],
            arabicSuggestions: [
              "استخدم أنماط لهجة أكثر اتساقاً",
              "فكر في العربية الفصحى",
            ],
            automaticFix: false,
          },
        });
      }

      // Add recommendations for improvements
      if (terminologyResult.enhancements.length > 0) {
        recommendations.push({
          id: "terminology-enhancement",
          type: "professional-improvement",
          priority: "medium",
          message:
            "Professional terminology can be enhanced with bilingual labels",
          arabicMessage:
            "يمكن تحسين المصطلحات المهنية بإضافة التسميات ثنائية اللغة",
          implementation: {
            effort: "minimal",
            impact: "medium",
            tools: ["bilingual-dictionary", "terminology-validator"],
            resources: terminologyResult.enhancements,
          },
        });
      }

      if (quality.rtlLayoutCompliance < 0.8) {
        recommendations.push({
          id: "rtl-improvement",
          type: "enhancement",
          priority: "high",
          message: "RTL layout compliance can be improved",
          arabicMessage: "يمكن تحسين الامتثال لتخطيط النص من اليمين إلى اليسار",
          implementation: {
            effort: "moderate",
            impact: "high",
            tools: ["rtl-formatter", "bidi-validator"],
            resources: ["CSS dir attributes", "Unicode bidi controls"],
          },
        });
      }

      // Determine complexity
      let complexity: "simple" | "moderate" | "complex" = "simple";
      if (segments.length > 5 || dialect.secondary?.length > 0)
        complexity = "moderate";
      if (segments.length > 10 || issues.length > 2) complexity = "complex";

      const result: ArabicProcessingResult = {
        originalText: text,
        processedText,
        analysis: {
          direction,
          dialect,
          confidence: dialect.confidence,
          languageRatio,
          complexity,
        },
        enhancements,
        quality,
        issues,
        recommendations,
      };

      // Cache the result
      processingCache.set(cacheKey, result);
      lastProcessedText.value = text;

      return result;
    } finally {
      isProcessing.value = false;
    }
  };

  // Validate RTL layout compliance
  const validateRTLLayout = (
    html: string,
  ): { score: number; issues: string[] } => {
    const issues: string[] = [];
    let score = 1.0;

    // Check for dir attributes on Arabic content
    const arabicContent = html.match(/<[^>]*>.*?[\u0600-\u06FF].*?<\/[^>]*>/g);
    if (arabicContent) {
      const withDirAttribute = html.match(
        /<[^>]*dir\s*=\s*["']rtl["'][^>]*>.*?[\u0600-\u06FF].*?<\/[^>]*>/g,
      );
      if (!withDirAttribute || withDirAttribute.length < arabicContent.length) {
        issues.push("Arabic content missing RTL direction attributes");
        score -= 0.3;
      }
    }

    // Check for proper CSS classes
    if (html.includes("arabic") && !html.includes("class=")) {
      issues.push("Arabic content missing appropriate CSS classes");
      score -= 0.2;
    }

    // Check mixed content handling
    const mixedContent = html.match(
      /<span[^>]*dir\s*=\s*["'](ltr|rtl)["'][^>]*>/g,
    );
    if (mixedContent && mixedContent.length > 10) {
      issues.push("Excessive text direction changes may affect readability");
      score -= 0.1;
    }

    return { score: Math.max(0, score), issues };
  };

  // Clear processing cache
  const clearCache = () => {
    processingCache.clear();
  };

  // Update configuration
  const updateConfig = (newConfig: Partial<ArabicProcessingConfig>) => {
    config.value = { ...config.value, ...newConfig };
    clearCache(); // Clear cache when config changes
  };

  return {
    // State
    config,
    isProcessing,
    lastProcessedText,

    // Main functions
    processArabicText,
    detectDialect,
    detectTextDirection,
    analyzeLanguageComposition,
    segmentMixedText,
    formatRTLText,
    enhanceProfessionalTerminology,
    validateRTLLayout,

    // Utility functions
    clearCache,
    updateConfig,

    // Computed
    isConfigured: computed(
      () => config.value.enableRTL || config.value.dialectRecognition,
    ),
    processingCacheSize: computed(() => processingCache.size),
  };
}
