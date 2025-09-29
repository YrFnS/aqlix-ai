/**
 * Iraqi AI Chat Desktop - Offline Arabic Processing Service
 * Comprehensive Arabic text processing with Iraqi dialect support
 */

import { BrowserWindow } from "electron";
import Store from "electron-store";
import * as fs from "fs/promises";
import * as path from "path";

// Arabic processing utilities
import { ArabicReshaper } from "arabic-reshaper";
import { BidiJS } from "bidi-js";

// Types
interface ArabicProcessingConfig {
  enableDialectRecognition: boolean;
  supportedDialects: IraqiDialect[];
  enableBidiProcessing: boolean;
  enableReshaping: boolean;
  enableDiacriticProcessing: boolean;
  enableNumeralConversion: boolean;
  cacheSize: number;
  offlineModels: boolean;
}

interface ProcessingResult {
  originalText: string;
  processedText: string;
  direction: "rtl" | "ltr";
  dialect?: IraqiDialect;
  confidence: number;
  metadata: ProcessingMetadata;
}

interface ProcessingMetadata {
  hasArabicScript: boolean;
  hasDiacritics: boolean;
  hasNumerals: boolean;
  wordCount: number;
  characterCount: number;
  processingTime: number;
  errors?: string[];
}

interface IraqiDialectPattern {
  dialect: IraqiDialect;
  patterns: RegExp[];
  commonWords: string[];
  phonetic: string[];
  confidence: number;
}

type IraqiDialect =
  | "baghdadi" // Baghdad dialect
  | "basrawi" // Basra dialect
  | "moslawi" // Mosul dialect
  | "southern" // Southern Iraq
  | "kurdish_arab" // Kurdish-influenced Arabic
  | "standard"; // Standard Arabic

export class OfflineArabicProcessor {
  private config: ArabicProcessingConfig;
  private store: Store;
  private processingCache: Map<string, ProcessingResult>;
  private dialectPatterns: Map<IraqiDialect, IraqiDialectPattern>;
  private arabicReshaper: any;
  private bidiProcessor: any;

  // Arabic Unicode ranges
  private readonly ARABIC_MAIN = /[\u0600-\u06FF]/g;
  private readonly ARABIC_SUPPLEMENT = /[\u0750-\u077F]/g;
  private readonly ARABIC_EXTENDED_A = /[\u08A0-\u08FF]/g;
  private readonly ARABIC_PRESENTATION_A = /[\uFB50-\uFDCF]/g;
  private readonly ARABIC_PRESENTATION_B = /[\uFE70-\uFEFF]/g;
  private readonly DIACRITICS = /[\u064B-\u0652\u0670\u0640]/g;
  private readonly ARABIC_NUMERALS = /[\u0660-\u0669]/g;

  constructor(mainWindow: BrowserWindow) {
    this.store = new Store({
      name: "offline-arabic-processor",
      defaults: {
        config: this.getDefaultConfig(),
        dialectCache: {},
        processingStats: {
          totalProcessed: 0,
          averageTime: 0,
          dialectAccuracy: 0.85,
        },
      },
    });

    this.config = this.store.get("config") as ArabicProcessingConfig;
    this.processingCache = new Map();
    this.dialectPatterns = new Map();

    this.initialize();
  }

  private getDefaultConfig(): ArabicProcessingConfig {
    return {
      enableDialectRecognition: true,
      supportedDialects: [
        "baghdadi",
        "basrawi",
        "moslawi",
        "southern",
        "kurdish_arab",
        "standard",
      ],
      enableBidiProcessing: true,
      enableReshaping: true,
      enableDiacriticProcessing: true,
      enableNumeralConversion: true,
      cacheSize: 1000,
      offlineModels: true,
    };
  }

  private async initialize(): Promise<void> {
    try {
      // Initialize Arabic reshaper
      this.arabicReshaper = new ArabicReshaper({
        ligature_re: true,
        support_zwj: true,
        delete_harakat: false,
        delete_tatweel: false,
        support_persian: false,
        shift_harakat_position: true,
      });

      // Initialize BiDi processor
      this.bidiProcessor = new BidiJS();

      // Load dialect patterns
      await this.loadDialectPatterns();

      console.log("OfflineArabicProcessor initialized successfully");
    } catch (error) {
      console.error("Failed to initialize OfflineArabicProcessor:", error);
      throw error;
    }
  }

  private async loadDialectPatterns(): Promise<void> {
    // Baghdad dialect patterns
    this.dialectPatterns.set("baghdadi", {
      dialect: "baghdadi",
      patterns: [
        /شلون(ك)?/g, // "How are you?"
        /شگد/g, // "How much?"
        /ماكو/g, // "There isn't"
        /كلش/g, // "Very"
        /هسا/g, // "Now"
        /ويا/g, // "With"
        /شوية/g, // "A little"
        /زين/g, // "Good"
        /خوش/g, // "Good/Nice"
        /لتروح/g, // "Where are you going?"
      ],
      commonWords: [
        "شلونك",
        "ماكو",
        "كلش",
        "هسا",
        "ويا",
        "شوية",
        "زين",
        "خوش",
        "شگد",
        "لتروح",
        "عدكم",
        "اكلكم",
        "هاي",
        "هايا",
        "يالله",
      ],
      phonetic: ["shlonak", "maku", "kulish", "hassa", "wiya"],
      confidence: 0.9,
    });

    // Basra dialect patterns
    this.dialectPatterns.set("basrawi", {
      dialect: "basrawi",
      patterns: [
        /شلونگ/g, // "How are you?" (Basra version)
        /گدام/g, // "How much?"
        /مومو/g, // "Nothing"
        /حلو/g, // "Nice/Good"
        /يمعود/g, // "Maybe"
        /چان/g, // "Was"
        /چنت/g, // "I was"
        /قالولك/g, // "They told you"
        /شگولة/g, // "What's the matter?"
        /راح/g, // "Will/Going"
      ],
      commonWords: [
        "شلونگ",
        "گدام",
        "مومو",
        "حلو",
        "يمعود",
        "چان",
        "چنت",
        "قالولك",
        "شگولة",
        "راح",
        "هوای",
        "گاله",
        "چشسوي",
      ],
      phonetic: ["shlong", "gadam", "momo", "helw", "yamaoud"],
      confidence: 0.85,
    });

    // Mosul dialect patterns
    this.dialectPatterns.set("moslawi", {
      dialect: "moslawi",
      patterns: [
        /دايش/g, // "How?"
        /بەس/g, // "But"
        /ئيوا/g, // "Yes"
        /لابد/g, // "Must"
        /قايل/g, // "Saying"
        /هوسا/g, // "Now"
        /شنهو/g, // "What is it?"
        /كيفاش/g, // "How?"
        /منگول/g, // "We say"
        /اوعلي/g, // "On me"
      ],
      commonWords: [
        "دايش",
        "بەس",
        "ئيوا",
        "لابد",
        "قايل",
        "هوسا",
        "شنهو",
        "كيفاش",
        "منگول",
        "اوعلي",
        "هايگ",
        "چيكا",
      ],
      phonetic: ["dayish", "bas", "ewa", "labed", "qayel"],
      confidence: 0.82,
    });

    // Southern Iraq dialect patterns
    this.dialectPatterns.set("southern", {
      dialect: "southern",
      patterns: [
        /شلون/g, // "How?"
        /ماكو/g, // "There isn't"
        /مخاف/g, // "Don't be afraid"
        /گالولي/g, // "They told me"
        /شنت/g, // "I was"
        /راح/g, // "Will go"
        /يايب/g, // "Bringing"
        /شگولت/g, // "I said"
        /هايچي/g, // "This"
        /گاعد/g, // "Sitting"
      ],
      commonWords: [
        "شلون",
        "ماكو",
        "مخاف",
        "گالولي",
        "شنت",
        "راح",
        "يايب",
        "شگولت",
        "هايچي",
        "گاعد",
        "ويا",
        "علي",
      ],
      phonetic: ["shlon", "maku", "makhaf", "galuli", "shint"],
      confidence: 0.88,
    });

    // Kurdish-influenced Arabic patterns
    this.dialectPatterns.set("kurdish_arab", {
      dialect: "kurdish_arab",
      patterns: [
        /چي/g, // "What?"
        /بەڵێ/g, // "Yes" (Kurdish)
        /کردوە/g, // "Did" (Kurdish)
        /دەگەڕێ/g, // "Returns" (Kurdish)
        /هەر/g, // "Always"
        /ئێوە/g, // "You" (Kurdish plural)
        /چۆن/g, // "How?" (Kurdish)
        /کێ/g, // "Who?" (Kurdish)
        /کوێ/g, // "Where?" (Kurdish)
        /کەی/g, // "When?" (Kurdish)
      ],
      commonWords: [
        "چي",
        "بەڵێ",
        "کردوە",
        "دەگەڕێ",
        "هەر",
        "ئێوە",
        "چۆن",
        "کێ",
        "کوێ",
        "کەی",
        "ناکرێ",
        "دەبێ",
      ],
      phonetic: ["chi", "bale", "kirduwa", "dagerrê", "har"],
      confidence: 0.75,
    });

    // Standard Arabic patterns
    this.dialectPatterns.set("standard", {
      dialect: "standard",
      patterns: [
        /كيف\s+حالك/g, // "How are you?"
        /ما\s+اسمك/g, // "What's your name?"
        /أين\s+أنت/g, // "Where are you?"
        /متى\s+ستأتي/g, // "When will you come?"
        /لماذا/g, // "Why?"
        /كم\s+عمرك/g, // "How old are you?"
        /هل\s+تتكلم/g, // "Do you speak?"
        /أريد\s+أن/g, // "I want to"
        /يمكنني\s+أن/g, // "I can"
        /شكرا\s+لك/g, // "Thank you"
      ],
      commonWords: [
        "كيف",
        "حالك",
        "اسمك",
        "أين",
        "متى",
        "لماذا",
        "عمرك",
        "تتكلم",
        "أريد",
        "يمكنني",
        "شكرا",
        "من",
        "فضلك",
        "نعم",
        "لا",
      ],
      phonetic: ["kayf", "halak", "ismak", "ayn", "mata"],
      confidence: 0.95,
    });
  }

  /**
   * Process Arabic text with comprehensive analysis
   */
  public async processText(text: string): Promise<ProcessingResult> {
    const startTime = Date.now();

    try {
      // Check cache first
      const cacheKey = this.generateCacheKey(text);
      if (this.processingCache.has(cacheKey)) {
        return this.processingCache.get(cacheKey)!;
      }

      // Basic text analysis
      const metadata = this.analyzeText(text);

      // Detect dialect
      const dialectResult = this.config.enableDialectRecognition
        ? await this.detectDialect(text)
        : { dialect: "standard" as IraqiDialect, confidence: 0.5 };

      // Process text based on configuration
      let processedText = text;

      // BiDi processing
      if (this.config.enableBidiProcessing && metadata.hasArabicScript) {
        processedText = this.processBidi(processedText);
      }

      // Arabic reshaping
      if (this.config.enableReshaping && metadata.hasArabicScript) {
        processedText = this.reshapeArabic(processedText);
      }

      // Diacritic processing
      if (this.config.enableDiacriticProcessing && metadata.hasDiacritics) {
        // Keep diacritics for better readability unless specifically requested to remove
        processedText = this.processDiacritics(processedText);
      }

      // Numeral conversion
      if (this.config.enableNumeralConversion && metadata.hasNumerals) {
        processedText = this.convertNumerals(processedText);
      }

      // Determine text direction
      const direction = this.getTextDirection(processedText);

      const result: ProcessingResult = {
        originalText: text,
        processedText,
        direction,
        dialect: dialectResult.dialect,
        confidence: dialectResult.confidence,
        metadata: {
          ...metadata,
          processingTime: Date.now() - startTime,
        },
      };

      // Cache result
      this.cacheResult(cacheKey, result);

      // Update statistics
      this.updateProcessingStats(result);

      return result;
    } catch (error) {
      console.error("Arabic processing error:", error);

      return {
        originalText: text,
        processedText: text,
        direction: "ltr",
        confidence: 0,
        metadata: {
          hasArabicScript: false,
          hasDiacritics: false,
          hasNumerals: false,
          wordCount: 0,
          characterCount: text.length,
          processingTime: Date.now() - startTime,
          errors: [(error as Error).message],
        },
      };
    }
  }

  /**
   * Detect Iraqi dialect from text
   */
  private async detectDialect(
    text: string,
  ): Promise<{ dialect: IraqiDialect; confidence: number }> {
    const dialectScores: Map<IraqiDialect, number> = new Map();

    for (const [dialectName, pattern] of this.dialectPatterns) {
      let score = 0;

      // Check regex patterns
      for (const regex of pattern.patterns) {
        const matches = text.match(regex);
        if (matches) {
          score += matches.length * 2;
        }
      }

      // Check common words
      for (const word of pattern.commonWords) {
        if (text.includes(word)) {
          score += 1;
        }
      }

      dialectScores.set(dialectName, score * pattern.confidence);
    }

    // Find highest scoring dialect
    let bestDialect: IraqiDialect = "standard";
    let bestScore = 0;

    for (const [dialect, score] of dialectScores) {
      if (score > bestScore) {
        bestScore = score;
        bestDialect = dialect;
      }
    }

    // Calculate confidence (0-1)
    const totalWords = text.split(/\s+/).length;
    const confidence = Math.min(bestScore / (totalWords * 0.5), 1);

    return {
      dialect: bestDialect,
      confidence: Math.max(confidence, 0.1), // Minimum 10% confidence
    };
  }

  /**
   * Analyze text properties
   */
  private analyzeText(text: string): ProcessingMetadata {
    const hasArabicScript = this.hasArabicScript(text);
    const hasDiacritics = this.DIACRITICS.test(text);
    const hasNumerals = this.ARABIC_NUMERALS.test(text);
    const wordCount = text
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
    const characterCount = text.length;

    return {
      hasArabicScript,
      hasDiacritics,
      hasNumerals,
      wordCount,
      characterCount,
      processingTime: 0, // Will be set later
    };
  }

  /**
   * Check if text contains Arabic script
   */
  private hasArabicScript(text: string): boolean {
    return (
      this.ARABIC_MAIN.test(text) ||
      this.ARABIC_SUPPLEMENT.test(text) ||
      this.ARABIC_EXTENDED_A.test(text) ||
      this.ARABIC_PRESENTATION_A.test(text) ||
      this.ARABIC_PRESENTATION_B.test(text)
    );
  }

  /**
   * Process bidirectional text
   */
  private processBidi(text: string): string {
    try {
      return this.bidiProcessor.process(text, {
        dir: "auto",
        type: "paragraph",
      });
    } catch (error) {
      console.warn("BiDi processing failed:", error);
      return text;
    }
  }

  /**
   * Reshape Arabic text for proper rendering
   */
  private reshapeArabic(text: string): string {
    try {
      return this.arabicReshaper.reshape(text);
    } catch (error) {
      console.warn("Arabic reshaping failed:", error);
      return text;
    }
  }

  /**
   * Process diacritics (currently preserves them)
   */
  private processDiacritics(text: string): string {
    // For now, preserve diacritics as they help with pronunciation
    // Could add options to remove or normalize them in the future
    return text;
  }

  /**
   * Convert Arabic numerals to Western numerals
   */
  private convertNumerals(text: string): string {
    return text.replace(/[\u0660-\u0669]/g, (match) => {
      return String.fromCharCode(match.charCodeAt(0) - 0x0660 + 0x0030);
    });
  }

  /**
   * Determine text direction
   */
  private getTextDirection(text: string): "rtl" | "ltr" {
    const arabicChars = (
      text.match(
        /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDCF\uFDF0-\uFDFF\uFE70-\uFEFF]/g,
      ) || []
    ).length;
    const totalChars = text.replace(/\s/g, "").length;

    // If more than 30% of characters are Arabic, consider it RTL
    return totalChars > 0 && arabicChars / totalChars > 0.3 ? "rtl" : "ltr";
  }

  /**
   * Generate cache key for text
   */
  private generateCacheKey(text: string): string {
    // Simple hash function for cache keys
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  /**
   * Cache processing result
   */
  private cacheResult(key: string, result: ProcessingResult): void {
    if (this.processingCache.size >= this.config.cacheSize) {
      // Remove oldest entry
      const firstKey = this.processingCache.keys().next().value;
      this.processingCache.delete(firstKey);
    }

    this.processingCache.set(key, result);
  }

  /**
   * Update processing statistics
   */
  private updateProcessingStats(result: ProcessingResult): void {
    const stats = this.store.get("processingStats") as any;

    stats.totalProcessed++;
    stats.averageTime =
      (stats.averageTime * (stats.totalProcessed - 1) +
        result.metadata.processingTime) /
      stats.totalProcessed;

    if (result.dialect && result.confidence > 0.8) {
      stats.dialectAccuracy = Math.min(
        (stats.dialectAccuracy + result.confidence) / 2,
        1,
      );
    }

    this.store.set("processingStats", stats);
  }

  /**
   * Get processing statistics
   */
  public getProcessingStats(): any {
    return this.store.get("processingStats");
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<ArabicProcessingConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.store.set("config", this.config);
  }

  /**
   * Get current configuration
   */
  public getConfig(): ArabicProcessingConfig {
    return { ...this.config };
  }

  /**
   * Clear processing cache
   */
  public clearCache(): void {
    this.processingCache.clear();
  }

  /**
   * Get cache statistics
   */
  public getCacheStats(): { size: number; maxSize: number; hitRate: number } {
    // This is a simplified implementation - would need actual hit tracking
    return {
      size: this.processingCache.size,
      maxSize: this.config.cacheSize,
      hitRate: 0.75, // Placeholder
    };
  }

  /**
   * Process batch of texts
   */
  public async processBatch(texts: string[]): Promise<ProcessingResult[]> {
    const results: ProcessingResult[] = [];

    for (const text of texts) {
      try {
        const result = await this.processText(text);
        results.push(result);
      } catch (error) {
        console.error(
          `Failed to process text: ${text.substring(0, 50)}...`,
          error,
        );
        results.push({
          originalText: text,
          processedText: text,
          direction: "ltr",
          confidence: 0,
          metadata: {
            hasArabicScript: false,
            hasDiacritics: false,
            hasNumerals: false,
            wordCount: 0,
            characterCount: text.length,
            processingTime: 0,
            errors: [(error as Error).message],
          },
        });
      }
    }

    return results;
  }
}
