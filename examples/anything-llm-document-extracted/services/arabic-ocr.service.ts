/**
 * Arabic OCR and Text Extraction Service
 * Enhanced Arabic text extraction with Iraqi dialect recognition and cultural compliance
 * Integrates with multiple OCR providers and Arabic NLP processing
 */

import { createHash } from "crypto";
import { promises as fs } from "fs";
import { join } from "path";

// Types
export interface ArabicOCRConfig {
  provider: "tesseract" | "google-vision" | "azure-cognitive" | "aws-textract";
  enableDialectRecognition: boolean;
  culturalFiltering: boolean;
  preserveFormatting: boolean;
  quality: "fast" | "balanced" | "accurate";
  timeout: number;
}

export interface IraqiDialectPattern {
  dialect:
    | "baghdad"
    | "basra"
    | "mosul"
    | "southern"
    | "kurdish-arabic"
    | "general";
  confidence: number;
  indicators: string[];
  region?: string;
}

export interface ArabicTextAnalysis {
  originalText: string;
  cleanedText: string;
  dialectAnalysis: IraqiDialectPattern[];
  textDirection: "rtl" | "ltr" | "mixed";
  hasArabicNumbers: boolean;
  hasLatinNumbers: boolean;
  wordCount: number;
  arabicWordCount: number;
  englishWordCount: number;
  diacriticDensity: number;
  culturalTerms: string[];
  professionalTerms: ProfessionalTermAnalysis[];
  readabilityScore: number;
}

export interface ProfessionalTermAnalysis {
  domain: "legal" | "medical" | "educational" | "business" | "engineering";
  terms: string[];
  confidence: number;
  arabicTerms: string[];
  englishTerms: string[];
}

export interface OCRResult {
  text: string;
  confidence: number;
  language: string;
  detectedLanguages: string[];
  boundingBoxes: BoundingBox[];
  arabicAnalysis?: ArabicTextAnalysis;
  processingTime: number;
  provider: string;
  errors: string[];
}

export interface BoundingBox {
  text: string;
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
  language?: string;
}

export interface CulturalComplianceResult {
  score: number;
  islamicCompliance: boolean;
  politicalNeutrality: boolean;
  culturalSensitivity: boolean;
  flags: string[];
  recommendations: string[];
}

// Iraqi Dialect Recognition Patterns
const IRAQI_DIALECT_PATTERNS = {
  baghdad: {
    indicators: [
      "شلونك",
      "وين",
      "شكو",
      "ماكو",
      "هسه",
      "شوكت",
      "اني",
      "انت",
      "هو",
    ],
    commonWords: ["ازلم", "زلمه", "جدام", "وراي", "قدام", "كتلك", "كتلي"],
    uniquePhrases: ["شنو الحال", "كيف الصحه", "الله يعطيك العافيه"],
  },
  basra: {
    indicators: ["شلونكم", "وينكم", "هنا", "هناك", "كذا", "جذي", "حلو", "زين"],
    commonWords: ["ربعي", "صاحبي", "اخوي", "ختي", "امي", "ابوي"],
    uniquePhrases: ["كيف الحال والاطفال", "ان شاء الله تمام"],
  },
  mosul: {
    indicators: [
      "شلونكو",
      "وينكو",
      "هنه",
      "هونه",
      "كده",
      "جكذا",
      "منيح",
      "كويس",
    ],
    commonWords: ["عمي", "خالي", "عمتي", "خالتي", "جدي", "جدتي"],
    uniquePhrases: ["كيفك وكيف الاهل", "الله يعافيك"],
  },
  southern: {
    indicators: [
      "شلوناكم",
      "وينكم",
      "هيا",
      "هيجه",
      "كدا",
      "جيجه",
      "حسن",
      "طيب",
    ],
    commonWords: ["اهلي", "ناسي", "ربعي", "صحابي", "اقاربي"],
    uniquePhrases: ["شلونك وشلون الاهل", "بارك الله فيك"],
  },
  kurdishArabic: {
    indicators: ["چونی", "لەکوێ", "ئەمە", "ئەوە", "باش", "خێر", "من", "تو"],
    commonWords: ["برام", "خوشكم", "بابم", "دايكم", "كاكم", "پوركم"],
    uniquePhrases: ["چونيت و چون خێزانەكەت", "خودا لەگەڵت بێت"],
  },
};

// Professional Domain Terms
const PROFESSIONAL_ARABIC_TERMS = {
  legal: [
    "محكمة",
    "قاضي",
    "محامي",
    "دعوى",
    "حكم",
    "استئناف",
    "نقض",
    "تمييز",
    "قانون",
    "مادة قانونية",
    "تشريع",
    "فقرة",
    "دستور",
    "لائحة",
    "عقد",
    "اتفاقية",
    "التزام",
    "حق",
    "واجب",
    "مسؤولية",
    "شهادة",
    "شاهد",
    "دليل",
    "اثبات",
    "بينة",
    "قرينة",
  ],
  medical: [
    "مريض",
    "طبيب",
    "ممرض",
    "مستشفى",
    "عيادة",
    "علاج",
    "دواء",
    "جراحة",
    "تشخيص",
    "فحص",
    "تحليل",
    "اشعة",
    "سونار",
    "منظار",
    "حالة طبية",
    "مرض",
    "عارض",
    "عرض",
    "الم",
    "وجع",
    "وصفة طبية",
    "جرعة",
    "مضاد حيوي",
    "مسكن",
    "مطهر",
  ],
  educational: [
    "طالب",
    "استاذ",
    "مدرس",
    "جامعة",
    "كلية",
    "مدرسة",
    "فصل",
    "درس",
    "منهج",
    "مقرر",
    "كتاب",
    "امتحان",
    "اختبار",
    "واجب",
    "درجة",
    "تقدير",
    "شهادة",
    "دبلوم",
    "بكالوريوس",
    "ماجستير",
    "دكتوراه",
    "بحث",
    "رسالة",
    "اطروحة",
    "مشروع",
  ],
  business: [
    "شركة",
    "مؤسسة",
    "تاجر",
    "عميل",
    "زبون",
    "عقد تجاري",
    "صفقة",
    "بيع",
    "شراء",
    "استثمار",
    "ربح",
    "خسارة",
    "ميزانية",
    "محاسبة",
    "مالية",
    "ضريبة",
    "فاتورة",
    "ايصال",
    "سند",
    "بنك",
    "قرض",
    "فائدة",
    "حساب",
    "تحويل",
    "دفع",
  ],
  engineering: [
    "مهندس",
    "تصميم",
    "بناء",
    "انشاء",
    "مشروع",
    "خطة",
    "مخطط",
    "حاسوب",
    "برمجة",
    "نظام",
    "شبكة",
    "قاعدة بيانات",
    "كهرباء",
    "ميكانيكا",
    "مدني",
    "معمار",
    "صناعي",
    "جسر",
    "طريق",
    "مبنى",
    "مصنع",
    "آلة",
    "معدات",
  ],
};

// Cultural and Religious Terms
const CULTURAL_TERMS = [
  "الله",
  "الرحمن",
  "الرحيم",
  "اسلام",
  "مسلم",
  "قرآن",
  "سنة",
  "حديث",
  "صلاة",
  "زكاة",
  "حج",
  "صيام",
  "رمضان",
  "عيد",
  "مسجد",
  "امام",
  "عراق",
  "بغداد",
  "بصرة",
  "موصل",
  "نجف",
  "كربلاء",
  "اربيل",
  "سليمانية",
  "عربي",
  "كردي",
  "تركماني",
  "آشوري",
  "عراقي",
  "بلد الرافدين",
];

export class ArabicOCRService {
  private config: ArabicOCRConfig;
  private cache: Map<string, OCRResult> = new Map();

  constructor(config: Partial<ArabicOCRConfig> = {}) {
    this.config = {
      provider: "tesseract",
      enableDialectRecognition: true,
      culturalFiltering: true,
      preserveFormatting: true,
      quality: "balanced",
      timeout: 30000,
      ...config,
    };
  }

  /**
   * Extract text from image with Arabic support
   */
  async extractTextFromImage(imagePath: string): Promise<OCRResult> {
    const startTime = Date.now();
    const imageHash = await this.generateImageHash(imagePath);

    // Check cache first
    if (this.cache.has(imageHash)) {
      return this.cache.get(imageHash)!;
    }

    try {
      let result: OCRResult;

      switch (this.config.provider) {
        case "tesseract":
          result = await this.extractWithTesseract(imagePath);
          break;
        case "google-vision":
          result = await this.extractWithGoogleVision(imagePath);
          break;
        case "azure-cognitive":
          result = await this.extractWithAzure(imagePath);
          break;
        case "aws-textract":
          result = await this.extractWithAWS(imagePath);
          break;
        default:
          throw new Error(`Unsupported OCR provider: ${this.config.provider}`);
      }

      result.processingTime = Date.now() - startTime;

      // Perform Arabic text analysis
      if (this.containsArabic(result.text)) {
        result.arabicAnalysis = await this.analyzeArabicText(result.text);
      }

      // Cache result
      this.cache.set(imageHash, result);

      return result;
    } catch (error) {
      return {
        text: "",
        confidence: 0,
        language: "unknown",
        detectedLanguages: [],
        boundingBoxes: [],
        processingTime: Date.now() - startTime,
        provider: this.config.provider,
        errors: [error instanceof Error ? error.message : "Unknown error"],
      };
    }
  }

  /**
   * Extract text using Tesseract with Arabic language support
   */
  private async extractWithTesseract(imagePath: string): Promise<OCRResult> {
    // Mock implementation - in real app would use node-tesseract or similar
    const imageData = await fs.readFile(imagePath);

    // Simulate OCR processing
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      text: "مثال على النص العربي المستخرج من الصورة",
      confidence: 85.5,
      language: "ar",
      detectedLanguages: ["ar", "en"],
      boundingBoxes: [
        {
          text: "مثال على النص العربي",
          confidence: 87.2,
          x: 100,
          y: 50,
          width: 300,
          height: 40,
          language: "ar",
        },
      ],
      processingTime: 0,
      provider: "tesseract",
      errors: [],
    };
  }

  /**
   * Extract text using Google Vision API
   */
  private async extractWithGoogleVision(imagePath: string): Promise<OCRResult> {
    // Mock implementation - in real app would use @google-cloud/vision
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      text: "النص المستخرج باستخدام Google Vision API",
      confidence: 92.3,
      language: "ar",
      detectedLanguages: ["ar"],
      boundingBoxes: [],
      processingTime: 0,
      provider: "google-vision",
      errors: [],
    };
  }

  /**
   * Extract text using Azure Cognitive Services
   */
  private async extractWithAzure(imagePath: string): Promise<OCRResult> {
    // Mock implementation - in real app would use @azure/cognitiveservices-computervision
    await new Promise((resolve) => setTimeout(resolve, 1200));

    return {
      text: "النص المستخرج باستخدام Azure Cognitive Services",
      confidence: 89.7,
      language: "ar",
      detectedLanguages: ["ar", "en"],
      boundingBoxes: [],
      processingTime: 0,
      provider: "azure-cognitive",
      errors: [],
    };
  }

  /**
   * Extract text using AWS Textract
   */
  private async extractWithAWS(imagePath: string): Promise<OCRResult> {
    // Mock implementation - in real app would use aws-sdk
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return {
      text: "النص المستخرج باستخدام AWS Textract",
      confidence: 91.1,
      language: "ar",
      detectedLanguages: ["ar"],
      boundingBoxes: [],
      processingTime: 0,
      provider: "aws-textract",
      errors: [],
    };
  }

  /**
   * Analyze Arabic text for dialect recognition and cultural compliance
   */
  async analyzeArabicText(text: string): Promise<ArabicTextAnalysis> {
    const cleanedText = this.cleanArabicText(text);
    const dialectAnalysis = this.recognizeIraqiDialect(text);
    const professionalTerms = this.analyzeProfessionalTerms(text);
    const culturalTerms = this.extractCulturalTerms(text);

    return {
      originalText: text,
      cleanedText,
      dialectAnalysis,
      textDirection: this.detectTextDirection(text),
      hasArabicNumbers: /[\u0660-\u0669]/.test(text),
      hasLatinNumbers: /[0-9]/.test(text),
      wordCount: text.split(/\s+/).length,
      arabicWordCount: this.countArabicWords(text),
      englishWordCount: this.countEnglishWords(text),
      diacriticDensity: this.calculateDiacriticDensity(text),
      culturalTerms,
      professionalTerms,
      readabilityScore: this.calculateReadabilityScore(text),
    };
  }

  /**
   * Recognize Iraqi dialect patterns in text
   */
  private recognizeIraqiDialect(text: string): IraqiDialectPattern[] {
    const results: IraqiDialectPattern[] = [];

    Object.entries(IRAQI_DIALECT_PATTERNS).forEach(([dialect, patterns]) => {
      const foundIndicators = patterns.indicators.filter((indicator) =>
        text.includes(indicator),
      );

      const foundWords = patterns.commonWords.filter((word) =>
        text.includes(word),
      );

      const foundPhrases = patterns.uniquePhrases.filter((phrase) =>
        text.includes(phrase),
      );

      const totalMatches =
        foundIndicators.length + foundWords.length + foundPhrases.length * 2;
      const confidence = Math.min(
        (totalMatches /
          (patterns.indicators.length +
            patterns.commonWords.length +
            patterns.uniquePhrases.length)) *
          100,
        100,
      );

      if (confidence > 10) {
        results.push({
          dialect: dialect as any,
          confidence,
          indicators: [...foundIndicators, ...foundWords, ...foundPhrases],
          region: this.getRegionForDialect(dialect as any),
        });
      }
    });

    return results.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Analyze professional domain terms in text
   */
  private analyzeProfessionalTerms(text: string): ProfessionalTermAnalysis[] {
    const results: ProfessionalTermAnalysis[] = [];

    Object.entries(PROFESSIONAL_ARABIC_TERMS).forEach(([domain, terms]) => {
      const foundTerms = terms.filter((term) => text.includes(term));
      const confidence = (foundTerms.length / terms.length) * 100;

      if (foundTerms.length > 0) {
        results.push({
          domain: domain as any,
          terms: foundTerms,
          confidence,
          arabicTerms: foundTerms,
          englishTerms: [], // Would be populated by translation service
        });
      }
    });

    return results.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Extract cultural and religious terms
   */
  private extractCulturalTerms(text: string): string[] {
    return CULTURAL_TERMS.filter((term) => text.includes(term));
  }

  /**
   * Validate cultural compliance of extracted text
   */
  async validateCulturalCompliance(
    text: string,
  ): Promise<CulturalComplianceResult> {
    const islamicTerms = ["الله", "اسلام", "مسلم", "قرآن", "صلاة"];
    const politicalTerms = ["سياسة", "حزب", "انتخابات", "حكومة"];
    const inappropriateTerms = ["خمر", "ميسر", "ربا"]; // Basic examples

    const islamicCount = islamicTerms.filter((term) =>
      text.includes(term),
    ).length;
    const politicalCount = politicalTerms.filter((term) =>
      text.includes(term),
    ).length;
    const inappropriateCount = inappropriateTerms.filter((term) =>
      text.includes(term),
    ).length;

    const islamicCompliance = inappropriateCount === 0 && islamicCount > 0;
    const politicalNeutrality = politicalCount === 0;
    const culturalSensitivity = this.extractCulturalTerms(text).length > 0;

    const score = Math.max(
      0,
      100 - inappropriateCount * 30 - politicalCount * 10 + islamicCount * 5,
    );

    const flags: string[] = [];
    const recommendations: string[] = [];

    if (inappropriateCount > 0) {
      flags.push("inappropriate_content");
      recommendations.push("Remove or replace inappropriate Islamic content");
    }

    if (politicalCount > 0) {
      flags.push("political_content");
      recommendations.push("Maintain political neutrality");
    }

    return {
      score,
      islamicCompliance,
      politicalNeutrality,
      culturalSensitivity,
      flags,
      recommendations,
    };
  }

  /**
   * Utility methods
   */
  private async generateImageHash(imagePath: string): Promise<string> {
    const imageData = await fs.readFile(imagePath);
    return createHash("sha256").update(imageData).digest("hex");
  }

  private containsArabic(text: string): boolean {
    return /[\u0600-\u06FF]/.test(text);
  }

  private cleanArabicText(text: string): string {
    // Remove diacritics and normalize text
    return text
      .replace(/[\u064B-\u065F]/g, "") // Remove diacritics
      .replace(/[\u0640]/g, "") // Remove tatweel (kashida)
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim();
  }

  private detectTextDirection(text: string): "rtl" | "ltr" | "mixed" {
    const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
    const latinChars = (text.match(/[A-Za-z]/g) || []).length;

    if (arabicChars > 0 && latinChars > 0) return "mixed";
    if (arabicChars > 0) return "rtl";
    return "ltr";
  }

  private countArabicWords(text: string): number {
    const arabicWords = text.match(/[\u0600-\u06FF]+/g);
    return arabicWords ? arabicWords.length : 0;
  }

  private countEnglishWords(text: string): number {
    const englishWords = text.match(/[A-Za-z]+/g);
    return englishWords ? englishWords.length : 0;
  }

  private calculateDiacriticDensity(text: string): number {
    const diacritics = (text.match(/[\u064B-\u065F]/g) || []).length;
    const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
    return arabicChars > 0 ? (diacritics / arabicChars) * 100 : 0;
  }

  private calculateReadabilityScore(text: string): number {
    // Simple readability calculation based on word length and sentence structure
    const words = text.split(/\s+/);
    const avgWordLength =
      words.reduce((sum, word) => sum + word.length, 0) / words.length;
    const sentences = text.split(/[.!؟]/).length;
    const avgWordsPerSentence = words.length / sentences;

    // Higher scores for shorter words and sentences (easier to read)
    return Math.max(0, 100 - avgWordLength * 5 - avgWordsPerSentence * 2);
  }

  private getRegionForDialect(dialect: string): string {
    const regionMap: { [key: string]: string } = {
      baghdad: "محافظة بغداد",
      basra: "محافظة البصرة",
      mosul: "محافظة نينوى",
      southern: "المحافظات الجنوبية",
      "kurdish-arabic": "إقليم كردستان",
    };
    return regionMap[dialect] || "عراق عام";
  }

  /**
   * Batch process multiple images
   */
  async batchExtractText(imagePaths: string[]): Promise<OCRResult[]> {
    const results: OCRResult[] = [];

    for (const imagePath of imagePaths) {
      try {
        const result = await this.extractTextFromImage(imagePath);
        results.push(result);
      } catch (error) {
        results.push({
          text: "",
          confidence: 0,
          language: "unknown",
          detectedLanguages: [],
          boundingBoxes: [],
          processingTime: 0,
          provider: this.config.provider,
          errors: [error instanceof Error ? error.message : "Unknown error"],
        });
      }
    }

    return results;
  }

  /**
   * Get service statistics
   */
  getStatistics(): {
    cacheSize: number;
    totalProcessed: number;
    avgProcessingTime: number;
    successRate: number;
  } {
    const results = Array.from(this.cache.values());
    const successful = results.filter((r) => r.errors.length === 0);
    const avgTime =
      results.reduce((sum, r) => sum + r.processingTime, 0) / results.length;

    return {
      cacheSize: this.cache.size,
      totalProcessed: results.length,
      avgProcessingTime: avgTime || 0,
      successRate:
        results.length > 0 ? (successful.length / results.length) * 100 : 0,
    };
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

export default ArabicOCRService;
