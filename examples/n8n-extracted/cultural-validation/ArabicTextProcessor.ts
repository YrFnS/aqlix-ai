/**
 * Arabic Text Processor for Iraqi AI Workflow System
 * Advanced Arabic text processing with RTL support and Iraqi dialect recognition
 * 
 * Key Features:
 * - Right-to-left text processing and layout management
 * - Iraqi dialect recognition and normalization
 * - Mixed Arabic-English content handling
 * - Cultural text validation and filtering
 * - Professional terminology support
 */

import type { IArabicProcessingConfig } from '../workflow-engine/types';

export interface ArabicTextResult {
  originalText: string;
  processedText: string;
  direction: 'rtl' | 'ltr' | 'mixed';
  dialect: 'baghdadi' | 'basri' | 'moslawi' | 'standard' | 'mixed' | 'unknown';
  confidence: number; // 0-1
  culturallyAppropriate: boolean;
  issues: string[];
  recommendations: string[];
}

export interface ArabicValidationResult {
  isValid: boolean;
  score: number; // 0-1
  textProcessingAccuracy: number;
  rtlLayoutCompliance: number;
  dialectRecognition: number;
  issues: string[];
  recommendations: string[];
}

export class ArabicTextProcessor {
  private config: IArabicProcessingConfig;
  
  // Iraqi dialect patterns and vocabulary
  private readonly DIALECT_PATTERNS = {
    baghdadi: {
      keywords: ['شلونك', 'شكو ماكو', 'يبه', 'يمه', 'وين', 'شدسوين', 'هسه'],
      pronunciation: ['ج' /* instead of ق */, 'چ' /* ch sound */],
      grammar: ['ما عندي' /* instead of ليس عندي */]
    },
    basri: {
      keywords: ['شلونچ', 'چيف', 'هاي', 'گاع', 'ويش', 'چان'],
      pronunciation: ['چ', 'گ'],
      grammar: ['ما اعرف' /* instead of لا أعرف */]
    },
    moslawi: {
      keywords: ['شلونك', 'ايش', 'هسه', 'ويا', 'چان', 'گال'],
      pronunciation: ['ق' /* preserved */, 'چ'],
      grammar: ['ما گد' /* instead of لم يقل */]
    },
    standard: {
      keywords: ['كيف حالك', 'ماذا', 'الآن', 'مع', 'كان', 'قال'],
      pronunciation: ['ق', 'ج'],
      grammar: ['لا أعرف', 'ليس عندي', 'لم يقل']
    }
  };
  
  // Professional terminology mapping
  private readonly PROFESSIONAL_TERMS = {
    health: {
      arabic: ['طبيب', 'مستشفى', 'علاج', 'دواء', 'مريض', 'صحة', 'عملية', 'فحص'],
      english: ['doctor', 'hospital', 'treatment', 'medicine', 'patient', 'health', 'surgery', 'examination'],
      bilingual: {
        'طبيب': 'doctor',
        'مستشفى': 'hospital',
        'علاج': 'treatment',
        'دواء': 'medicine'
      }
    },
    education: {
      arabic: ['مدرس', 'طالب', 'مدرسة', 'جامعة', 'درس', 'امتحان', 'كتاب', 'تعليم'],
      english: ['teacher', 'student', 'school', 'university', 'lesson', 'exam', 'book', 'education'],
      bilingual: {
        'مدرس': 'teacher',
        'طالب': 'student',
        'مدرسة': 'school',
        'جامعة': 'university'
      }
    },
    interior: {
      arabic: ['مواطن', 'هوية', 'جواز', 'إقامة', 'وثيقة', 'خدمة', 'حكومة', 'وزارة'],
      english: ['citizen', 'identity', 'passport', 'residence', 'document', 'service', 'government', 'ministry'],
      bilingual: {
        'مواطن': 'citizen',
        'هوية': 'identity',
        'جواز': 'passport',
        'إقامة': 'residence'
      }
    },
    justice: {
      arabic: ['قاضي', 'محكمة', 'قانون', 'عدالة', 'قضية', 'حكم', 'محامي', 'شاهد'],
      english: ['judge', 'court', 'law', 'justice', 'case', 'judgment', 'lawyer', 'witness'],
      bilingual: {
        'قاضي': 'judge',
        'محكمة': 'court',
        'قانون': 'law',
        'عدالة': 'justice'
      }
    }
  };
  
  // RTL characters and text direction patterns
  private readonly RTL_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  private readonly LTR_REGEX = /[A-Za-z0-9]/;
  private readonly MIXED_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF].*[A-Za-z0-9]|[A-Za-z0-9].*[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  
  // Cultural appropriateness filters
  private readonly INAPPROPRIATE_CONTENT = [
    'كلمات غير مناسبة', 'محتوى مخالف', 'ألفاظ نابية'
    // Add specific inappropriate words/phrases in Arabic
  ];

  constructor(config: IArabicProcessingConfig) {
    this.config = config;
  }

  /**
   * Process Arabic text with RTL support and dialect recognition
   */
  async processText(text: string, domain?: string): Promise<ArabicTextResult> {
    try {
      const direction = this.detectTextDirection(text);
      const dialect = this.detectDialect(text);
      const processedText = await this.processTextContent(text, direction, domain);
      const culturalValidation = await this.validateCulturalContent(text);
      
      return {
        originalText: text,
        processedText: processedText.text,
        direction,
        dialect: dialect.dialect,
        confidence: dialect.confidence,
        culturallyAppropriate: culturalValidation.isAppropriate,
        issues: [...processedText.issues, ...culturalValidation.issues],
        recommendations: [...processedText.recommendations, ...culturalValidation.recommendations]
      };
      
    } catch (error) {
      return {
        originalText: text,
        processedText: text,
        direction: 'ltr',
        dialect: 'unknown',
        confidence: 0,
        culturallyAppropriate: false,
        issues: [`Text processing error: ${error.message}`],
        recommendations: ['Review text for processing compatibility']
      };
    }
  }

  /**
   * Detect text direction (RTL, LTR, or mixed)
   */
  private detectTextDirection(text: string): 'rtl' | 'ltr' | 'mixed' {
    const hasRTL = this.RTL_REGEX.test(text);
    const hasLTR = this.LTR_REGEX.test(text);
    
    if (hasRTL && hasLTR) return 'mixed';
    if (hasRTL) return 'rtl';
    return 'ltr';
  }

  /**
   * Detect Iraqi dialect with confidence scoring
   */
  private detectDialect(text: string): { dialect: string; confidence: number } {
    const dialectScores: { [key: string]: number } = {
      baghdadi: 0,
      basri: 0,
      moslawi: 0,
      standard: 0
    };
    
    // Score based on keyword presence
    for (const [dialectName, patterns] of Object.entries(this.DIALECT_PATTERNS)) {
      for (const keyword of patterns.keywords) {
        if (text.includes(keyword)) {
          dialectScores[dialectName] += 0.3;
        }
      }
      
      // Score based on pronunciation patterns
      for (const pronunciation of patterns.pronunciation) {
        if (text.includes(pronunciation)) {
          dialectScores[dialectName] += 0.2;
        }
      }
      
      // Score based on grammar patterns
      for (const grammar of patterns.grammar) {
        if (text.includes(grammar)) {
          dialectScores[dialectName] += 0.1;
        }
      }
    }
    
    // Find highest scoring dialect
    const topDialect = Object.entries(dialectScores)
      .reduce((a, b) => a[1] > b[1] ? a : b);
    
    const confidence = topDialect[1];
    
    if (confidence < 0.3) {
      return { dialect: 'unknown', confidence: 0 };
    }
    
    if (confidence < 0.6) {
      return { dialect: 'mixed', confidence };
    }
    
    return { dialect: topDialect[0], confidence };
  }

  /**
   * Process text content with domain-specific enhancements
   */
  private async processTextContent(
    text: string, 
    direction: string, 
    domain?: string
  ): Promise<{ text: string; issues: string[]; recommendations: string[] }> {
    const issues: string[] = [];
    const recommendations: string[] = [];
    let processedText = text;
    
    // Apply RTL processing if enabled
    if (this.config.enableRTL && direction === 'rtl') {
      processedText = this.applyRTLFormatting(processedText);
    }
    
    // Handle mixed language content
    if (this.config.mixedLanguageSupport && direction === 'mixed') {
      const mixedResult = this.processMixedLanguageText(processedText);
      processedText = mixedResult.text;
      issues.push(...mixedResult.issues);
      recommendations.push(...mixedResult.recommendations);
    }
    
    // Apply professional terminology if domain specified
    if (domain && this.PROFESSIONAL_TERMS[domain]) {
      const termResult = this.applyProfessionalTerminology(processedText, domain);
      processedText = termResult.text;
      recommendations.push(...termResult.recommendations);
    }
    
    // Normalize dialect if recognition is enabled
    if (this.config.dialectRecognition) {
      const dialectResult = this.normalizeDialect(processedText);
      processedText = dialectResult.text;
      recommendations.push(...dialectResult.recommendations);
    }
    
    return { text: processedText, issues, recommendations };
  }

  /**
   * Apply RTL formatting and layout
   */
  private applyRTLFormatting(text: string): string {
    // Add RTL formatting markers and proper text flow
    // This would integrate with CSS/HTML for proper RTL layout
    return `<div dir="rtl" class="arabic-text">${text}</div>`;
  }

  /**
   * Process mixed Arabic-English content
   */
  private processMixedLanguageText(text: string): { 
    text: string; 
    issues: string[]; 
    recommendations: string[] 
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    // Split text into segments and apply appropriate direction
    const segments = this.segmentMixedText(text);
    let processedText = '';
    
    for (const segment of segments) {
      if (this.RTL_REGEX.test(segment.text)) {
        processedText += `<span dir="rtl">${segment.text}</span>`;
      } else {
        processedText += `<span dir="ltr">${segment.text}</span>`;
      }
    }
    
    if (segments.length > 5) {
      issues.push('Excessive language switching detected');
      recommendations.push('Consider reducing language switching for better readability');
    }
    
    return { text: processedText, issues, recommendations };
  }

  /**
   * Segment mixed language text
   */
  private segmentMixedText(text: string): { text: string; direction: 'rtl' | 'ltr' }[] {
    const segments: { text: string; direction: 'rtl' | 'ltr' }[] = [];
    let currentSegment = '';
    let currentDirection: 'rtl' | 'ltr' = 'ltr';
    
    for (const char of text) {
      const isRTL = this.RTL_REGEX.test(char);
      const newDirection = isRTL ? 'rtl' : 'ltr';
      
      if (newDirection !== currentDirection && currentSegment) {
        segments.push({ text: currentSegment, direction: currentDirection });
        currentSegment = '';
      }
      
      currentSegment += char;
      currentDirection = newDirection;
    }
    
    if (currentSegment) {
      segments.push({ text: currentSegment, direction: currentDirection });
    }
    
    return segments;
  }

  /**
   * Apply professional terminology based on domain
   */
  private applyProfessionalTerminology(text: string, domain: string): {
    text: string;
    recommendations: string[];
  } {
    const recommendations: string[] = [];
    let processedText = text;
    
    const terms = this.PROFESSIONAL_TERMS[domain];
    if (!terms) {
      return { text: processedText, recommendations };
    }
    
    // Add bilingual terminology support
    for (const [arabic, english] of Object.entries(terms.bilingual)) {
      if (text.includes(arabic) && !text.includes(english)) {
        recommendations.push(`Consider adding English translation for "${arabic}" (${english})`);
      }
      
      if (text.includes(english) && !text.includes(arabic)) {
        recommendations.push(`Consider adding Arabic translation for "${english}" (${arabic})`);
      }
    }
    
    return { text: processedText, recommendations };
  }

  /**
   * Normalize dialect to standard Arabic
   */
  private normalizeDialect(text: string): {
    text: string;
    recommendations: string[];
  } {
    const recommendations: string[] = [];
    let normalizedText = text;
    
    // Convert dialect patterns to standard Arabic
    for (const [dialectName, patterns] of Object.entries(this.DIALECT_PATTERNS)) {
      if (dialectName === 'standard') continue;
      
      for (let i = 0; i < patterns.grammar.length; i++) {
        const dialectGrammar = patterns.grammar[i];
        const standardGrammar = this.DIALECT_PATTERNS.standard.grammar[i];
        
        if (normalizedText.includes(dialectGrammar)) {
          normalizedText = normalizedText.replace(dialectGrammar, standardGrammar);
          recommendations.push(`Normalized ${dialectName} grammar: "${dialectGrammar}" → "${standardGrammar}"`);
        }
      }
    }
    
    return { text: normalizedText, recommendations };
  }

  /**
   * Validate cultural content appropriateness
   */
  private async validateCulturalContent(text: string): Promise<{
    isAppropriate: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    // Check for inappropriate content
    for (const inappropriate of this.INAPPROPRIATE_CONTENT) {
      if (text.includes(inappropriate)) {
        issues.push(`Contains inappropriate content: ${inappropriate}`);
        recommendations.push('Remove or replace inappropriate content');
      }
    }
    
    // Additional cultural validation logic would go here
    // This could include integration with Islamic content validation
    
    return {
      isAppropriate: issues.length === 0,
      issues,
      recommendations
    };
  }

  /**
   * Validate text processing accuracy and compliance
   */
  async validateTextProcessing(data: any): Promise<number> {
    try {
      let score = 1.0;
      const dataStr = typeof data === 'string' ? data : JSON.stringify(data);
      
      // Check RTL layout compliance
      if (this.RTL_REGEX.test(dataStr)) {
        const hasRTLFormatting = dataStr.includes('dir="rtl"') || dataStr.includes('class="arabic-text"');
        if (!hasRTLFormatting) {
          score -= 0.3; // RTL text without proper formatting
        }
      }
      
      // Check mixed language handling
      if (this.MIXED_REGEX.test(dataStr)) {
        const hasMixedFormatting = dataStr.includes('<span dir=');
        if (!hasMixedFormatting) {
          score -= 0.2; // Mixed text without proper segmentation
        }
      }
      
      // Check dialect recognition
      const dialectResult = this.detectDialect(dataStr);
      if (dialectResult.confidence > 0.5) {
        score += 0.1; // Bonus for successful dialect recognition
      }
      
      return Math.max(0, Math.min(1, score));
      
    } catch (error) {
      return 0; // Failed validation
    }
  }

  /**
   * Generate comprehensive validation report
   */
  async generateValidationReport(text: string): Promise<ArabicValidationResult> {
    const result = await this.processText(text);
    const processingScore = await this.validateTextProcessing(text);
    
    const rtlCompliance = this.calculateRTLCompliance(text, result.processedText);
    const dialectAccuracy = result.confidence;
    
    const overallScore = (processingScore + rtlCompliance + dialectAccuracy) / 3;
    
    return {
      isValid: overallScore >= 0.8,
      score: overallScore,
      textProcessingAccuracy: processingScore,
      rtlLayoutCompliance: rtlCompliance,
      dialectRecognition: dialectAccuracy,
      issues: result.issues,
      recommendations: result.recommendations
    };
  }

  /**
   * Calculate RTL layout compliance score
   */
  private calculateRTLCompliance(originalText: string, processedText: string): number {
    if (!this.RTL_REGEX.test(originalText)) {
      return 1.0; // No RTL content, full compliance
    }
    
    let score = 0.0;
    
    // Check for RTL direction attribute
    if (processedText.includes('dir="rtl"')) {
      score += 0.5;
    }
    
    // Check for Arabic text class
    if (processedText.includes('class="arabic-text"')) {
      score += 0.3;
    }
    
    // Check for proper mixed content handling
    if (this.MIXED_REGEX.test(originalText) && processedText.includes('<span dir=')) {
      score += 0.2;
    }
    
    return Math.min(1.0, score);
  }

  /**
   * Get processor configuration and status
   */
  getProcessorStatus(): {
    config: IArabicProcessingConfig;
    dialectPatterns: number;
    professionalTerms: number;
    culturalFilters: number;
  } {
    return {
      config: this.config,
      dialectPatterns: Object.keys(this.DIALECT_PATTERNS).length,
      professionalTerms: Object.keys(this.PROFESSIONAL_TERMS).length,
      culturalFilters: this.INAPPROPRIATE_CONTENT.length
    };
  }

  /**
   * Update processor configuration
   */
  updateConfig(newConfig: Partial<IArabicProcessingConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}