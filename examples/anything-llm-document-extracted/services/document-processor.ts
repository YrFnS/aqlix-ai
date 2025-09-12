/**
 * Iraqi AI Enterprise Document Processing Service
 * Enhanced anything-llm extraction with Arabic text processing and cultural compliance
 * Supports PDF, Word, Excel, PowerPoint, and other Iraqi professional document formats
 */

import crypto from 'crypto';
import path from 'path';
import { z } from 'zod';

// ====================== Types & Interfaces ======================

export type DocumentFormat = 'pdf' | 'docx' | 'doc' | 'xlsx' | 'xls' | 'pptx' | 'ppt' | 'txt' | 'rtf' | 'html' | 'xml';
export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'error' | 'culturally_flagged';
export type ProfessionalDomain = 'legal' | 'medical' | 'educational' | 'business' | 'engineering';
export type ContentType = 'text' | 'table' | 'image' | 'chart' | 'form' | 'signature' | 'header' | 'footer';

export interface DocumentMetadata {
  id: string;
  workspaceId: string;
  uploaderId: string;
  originalName: string;
  originalNameAr?: string;
  format: DocumentFormat;
  size: number; // bytes
  hash: string;
  
  // Content analysis
  pageCount?: number;
  wordCount?: number;
  characterCount?: number;
  arabicCharacterCount?: number;
  arabicTextPercentage?: number;
  
  // Processing information
  status: ProcessingStatus;
  processingStartedAt?: Date;
  processingCompletedAt?: Date;
  processingTimeMs?: number;
  errorMessage?: string;
  
  // Cultural compliance
  culturalComplianceScore: number;
  islamicCompliance: boolean;
  politicallyNeutral: boolean;
  culturalFlags: string[];
  
  // Professional domain
  detectedDomain?: ProfessionalDomain;
  domainConfidence?: number;
  professionalTerms: string[];
  
  // Language analysis
  primaryLanguage: 'ar' | 'en' | 'mixed';
  detectedDialect?: 'iraqi' | 'gulf' | 'levantine' | 'maghrebi' | 'standard';
  languageConfidence: number;
  
  // Extracted metadata
  title?: string;
  titleAr?: string;
  author?: string;
  subject?: string;
  keywords: string[];
  keywordsAr: string[];
  createdAt: Date;
  modifiedAt?: Date;
  
  // Content structure
  hasImages: boolean;
  hasCharts: boolean;
  hasTables: boolean;
  hasForms: boolean;
  hasSignatures: boolean;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  chunkIndex: number;
  content: string;
  contentAr?: string; // Arabic version if translation is available
  
  // Positioning
  pageNumber?: number;
  startOffset: number;
  endOffset: number;
  
  // Content classification
  contentType: ContentType;
  importance: 'low' | 'medium' | 'high' | 'critical';
  
  // Embedding information
  embedding?: number[];
  embeddingModel: string;
  embeddingDimensions: number;
  
  // Cultural and professional context
  culturallyRelevant: boolean;
  professionalContext?: ProfessionalDomain;
  containsArabicText: boolean;
  arabicTextRatio: number;
  
  // Metadata
  wordCount: number;
  characterCount: number;
  createdAt: Date;
}

export interface ProcessingOptions {
  enableOCR: boolean;
  ocrLanguages: string[]; // ['ara', 'eng'] for Arabic and English
  enableCulturalValidation: boolean;
  culturalStrictnessLevel: 'basic' | 'standard' | 'strict';
  enableProfessionalDomainDetection: boolean;
  generateArabicSummary: boolean;
  extractImages: boolean;
  extractTables: boolean;
  preserveFormatting: boolean;
  chunkSize: number;
  chunkOverlap: number;
  embeddingModel: string;
  translateToArabic: boolean;
  detectIraqiDialect: boolean;
}

export interface ProcessingResult {
  metadata: DocumentMetadata;
  chunks: DocumentChunk[];
  extractedImages?: Array<{
    id: string;
    base64Data: string;
    mimeType: string;
    description?: string;
    descriptionAr?: string;
    pageNumber?: number;
  }>;
  extractedTables?: Array<{
    id: string;
    headers: string[];
    headersAr?: string[];
    rows: string[][];
    pageNumber?: number;
    tableType: 'data' | 'financial' | 'legal' | 'medical';
  }>;
  summary?: string;
  summaryAr?: string;
  keyInsights: string[];
  keyInsightsAr: string[];
  professionalRecommendations?: string[];
}

// ====================== Validation Schemas ======================

const ProcessingOptionsSchema = z.object({
  enableOCR: z.boolean().default(true),
  ocrLanguages: z.array(z.string()).default(['ara', 'eng']),
  enableCulturalValidation: z.boolean().default(true),
  culturalStrictnessLevel: z.enum(['basic', 'standard', 'strict']).default('standard'),
  enableProfessionalDomainDetection: z.boolean().default(true),
  generateArabicSummary: z.boolean().default(true),
  extractImages: z.boolean().default(true),
  extractTables: z.boolean().default(true),
  preserveFormatting: z.boolean().default(true),
  chunkSize: z.number().min(100).max(2000).default(500),
  chunkOverlap: z.number().min(0).max(500).default(50),
  embeddingModel: z.string().default('text-embedding-ada-002'),
  translateToArabic: z.boolean().default(false),
  detectIraqiDialect: z.boolean().default(true)
});

// ====================== Document Processor Service ======================

export class IraqiDocumentProcessor {
  private readonly SUPPORTED_FORMATS: DocumentFormat[] = [
    'pdf', 'docx', 'doc', 'xlsx', 'xls', 'pptx', 'ppt', 'txt', 'rtf', 'html', 'xml'
  ];

  private readonly IRAQI_PROFESSIONAL_KEYWORDS = {
    legal: {
      ar: ['قانون', 'محكمة', 'قاض', 'محام', 'دعوى', 'عقد', 'اتفاقية', 'شهادة', 'وكالة', 'وصية'],
      en: ['law', 'court', 'judge', 'lawyer', 'lawsuit', 'contract', 'agreement', 'testimony', 'power of attorney', 'will']
    },
    medical: {
      ar: ['طبيب', 'مريض', 'علاج', 'دواء', 'تشخيص', 'فحص', 'عيادة', 'مستشفى', 'جراحة', 'صحة'],
      en: ['doctor', 'patient', 'treatment', 'medicine', 'diagnosis', 'examination', 'clinic', 'hospital', 'surgery', 'health']
    },
    educational: {
      ar: ['تعليم', 'مدرسة', 'جامعة', 'طالب', 'معلم', 'درس', 'امتحان', 'شهادة', 'منهج', 'تربية'],
      en: ['education', 'school', 'university', 'student', 'teacher', 'lesson', 'exam', 'certificate', 'curriculum', 'pedagogy']
    },
    business: {
      ar: ['شركة', 'تجارة', 'مال', 'استثمار', 'مشروع', 'عمل', 'موظف', 'راتب', 'ربح', 'خسارة'],
      en: ['company', 'trade', 'money', 'investment', 'project', 'business', 'employee', 'salary', 'profit', 'loss']
    },
    engineering: {
      ar: ['هندسة', 'مهندس', 'تصميم', 'بناء', 'مشروع', 'مخطط', 'حساب', 'مواصفات', 'جودة', 'سلامة'],
      en: ['engineering', 'engineer', 'design', 'construction', 'project', 'blueprint', 'calculation', 'specifications', 'quality', 'safety']
    }
  };

  constructor() {}

  // ====================== Main Processing Methods ======================

  async processDocument(
    documentBuffer: Buffer,
    fileName: string,
    options: Partial<ProcessingOptions>,
    workspaceId: string,
    uploaderId: string
  ): Promise<ProcessingResult> {
    const validatedOptions = ProcessingOptionsSchema.parse(options);
    const startTime = Date.now();

    // Generate document ID and hash
    const documentId = `doc_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
    const documentHash = crypto.createHash('sha256').update(documentBuffer).digest('hex');

    // Detect document format
    const format = this.detectDocumentFormat(fileName, documentBuffer);
    if (!this.SUPPORTED_FORMATS.includes(format)) {
      throw new Error(`Unsupported document format: ${format}`);
    }

    // Initialize metadata
    const metadata: DocumentMetadata = {
      id: documentId,
      workspaceId,
      uploaderId,
      originalName: fileName,
      format,
      size: documentBuffer.length,
      hash: documentHash,
      status: 'processing',
      processingStartedAt: new Date(),
      culturalComplianceScore: 0,
      islamicCompliance: false,
      politicallyNeutral: false,
      culturalFlags: [],
      professionalTerms: [],
      primaryLanguage: 'mixed',
      languageConfidence: 0,
      keywords: [],
      keywordsAr: [],
      createdAt: new Date(),
      hasImages: false,
      hasCharts: false,
      hasTables: false,
      hasForms: false,
      hasSignatures: false
    };

    try {
      // Step 1: Extract raw content based on format
      const rawContent = await this.extractContentByFormat(documentBuffer, format, validatedOptions);
      
      // Step 2: Analyze document structure and metadata
      await this.analyzeDocumentStructure(metadata, rawContent);
      
      // Step 3: Perform language detection and analysis
      await this.performLanguageAnalysis(metadata, rawContent.text);
      
      // Step 4: Professional domain detection
      if (validatedOptions.enableProfessionalDomainDetection) {
        await this.detectProfessionalDomain(metadata, rawContent.text);
      }
      
      // Step 5: Cultural compliance validation
      if (validatedOptions.enableCulturalValidation) {
        await this.performCulturalValidation(metadata, rawContent.text, validatedOptions.culturalStrictnessLevel);
      }
      
      // Step 6: Generate document chunks with embeddings
      const chunks = await this.generateDocumentChunks(
        documentId,
        rawContent.text,
        validatedOptions,
        metadata
      );
      
      // Step 7: Extract additional content (images, tables, etc.)
      const extractedImages = validatedOptions.extractImages ? rawContent.images : [];
      const extractedTables = validatedOptions.extractTables ? rawContent.tables : [];
      
      // Step 8: Generate summary and insights
      const summary = await this.generateDocumentSummary(rawContent.text, metadata);
      const summaryAr = validatedOptions.generateArabicSummary 
        ? await this.generateArabicSummary(rawContent.text, metadata)
        : undefined;
      
      const keyInsights = await this.extractKeyInsights(rawContent.text, metadata);
      const keyInsightsAr = validatedOptions.generateArabicSummary 
        ? await this.extractKeyInsightsArabic(rawContent.text, metadata)
        : [];
      
      // Step 9: Generate professional recommendations
      const professionalRecommendations = metadata.detectedDomain
        ? await this.generateProfessionalRecommendations(rawContent.text, metadata.detectedDomain)
        : undefined;
      
      // Finalize metadata
      const processingTime = Date.now() - startTime;
      metadata.status = metadata.culturalComplianceScore < 70 ? 'culturally_flagged' : 'completed';
      metadata.processingCompletedAt = new Date();
      metadata.processingTimeMs = processingTime;
      metadata.wordCount = this.countWords(rawContent.text);
      metadata.characterCount = rawContent.text.length;
      metadata.arabicCharacterCount = this.countArabicCharacters(rawContent.text);
      metadata.arabicTextPercentage = (metadata.arabicCharacterCount / metadata.characterCount) * 100;

      return {
        metadata,
        chunks,
        extractedImages,
        extractedTables,
        summary,
        summaryAr,
        keyInsights,
        keyInsightsAr,
        professionalRecommendations
      };

    } catch (error) {
      metadata.status = 'error';
      metadata.errorMessage = error instanceof Error ? error.message : 'Unknown error';
      metadata.processingCompletedAt = new Date();
      metadata.processingTimeMs = Date.now() - startTime;
      
      throw error;
    }
  }

  // ====================== Format-Specific Extraction ======================

  private detectDocumentFormat(fileName: string, buffer: Buffer): DocumentFormat {
    const extension = path.extname(fileName).toLowerCase().slice(1);
    
    // First check by file extension
    if (this.SUPPORTED_FORMATS.includes(extension as DocumentFormat)) {
      return extension as DocumentFormat;
    }

    // Fall back to magic number detection
    const magicBytes = buffer.subarray(0, 8);
    
    // PDF signature
    if (magicBytes.toString('ascii', 0, 4) === '%PDF') {
      return 'pdf';
    }
    
    // ZIP-based formats (docx, xlsx, pptx)
    if (magicBytes[0] === 0x50 && magicBytes[1] === 0x4B) {
      // These formats are ZIP-based, need content inspection
      return 'docx'; // Default assumption, could be improved
    }
    
    // Old MS Office formats
    if (magicBytes[0] === 0xD0 && magicBytes[1] === 0xCF) {
      return 'doc'; // Could be doc, xls, or ppt
    }
    
    // Default to text if nothing matches
    return 'txt';
  }

  private async extractContentByFormat(
    buffer: Buffer,
    format: DocumentFormat,
    options: ProcessingOptions
  ): Promise<{
    text: string;
    images?: Array<{ id: string; base64Data: string; mimeType: string; pageNumber?: number }>;
    tables?: Array<{ id: string; headers: string[]; rows: string[][]; pageNumber?: number; tableType: any }>;
    metadata?: Record<string, any>;
  }> {
    switch (format) {
      case 'pdf':
        return await this.extractFromPDF(buffer, options);
      case 'docx':
        return await this.extractFromDocx(buffer, options);
      case 'doc':
        return await this.extractFromDoc(buffer, options);
      case 'xlsx':
      case 'xls':
        return await this.extractFromExcel(buffer, options);
      case 'pptx':
      case 'ppt':
        return await this.extractFromPowerPoint(buffer, options);
      case 'txt':
      case 'rtf':
        return await this.extractFromText(buffer, options);
      case 'html':
      case 'xml':
        return await this.extractFromMarkup(buffer, options);
      default:
        throw new Error(`Extraction not implemented for format: ${format}`);
    }
  }

  private async extractFromPDF(buffer: Buffer, options: ProcessingOptions): Promise<any> {
    // Simulate PDF extraction - in real implementation, use pdf-parse or similar
    const text = `Extracted PDF content with Arabic support
    هذا نص مستخرج من ملف PDF يحتوي على نص عربي
    This document contains mixed Arabic and English content for testing purposes.
    المحتوى يتضمن نصوص قانونية وطبية وتعليمية متنوعة لاختبار النظام.`;

    return {
      text,
      images: options.extractImages ? [
        {
          id: 'img_1',
          base64Data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
          mimeType: 'image/png',
          pageNumber: 1
        }
      ] : [],
      tables: options.extractTables ? [
        {
          id: 'table_1',
          headers: ['Name', 'الاسم', 'Position', 'المنصب'],
          rows: [
            ['Ahmad Ali', 'أحمد علي', 'Manager', 'مدير'],
            ['Sara Hassan', 'سارة حسن', 'Engineer', 'مهندسة']
          ],
          pageNumber: 2,
          tableType: 'data'
        }
      ] : []
    };
  }

  private async extractFromDocx(buffer: Buffer, options: ProcessingOptions): Promise<any> {
    // Simulate DOCX extraction - in real implementation, use mammoth.js or similar
    const text = `Extracted Word document content
    هذا مستند Word يحتوي على نص عربي ومحتوى مهني
    Professional content for Iraqi business documentation.`;

    return { text, images: [], tables: [] };
  }

  private async extractFromDoc(buffer: Buffer, options: ProcessingOptions): Promise<any> {
    // Simulate DOC extraction - in real implementation, use antiword or similar
    const text = `Legacy Word document content extracted
    محتوى مستند Word قديم مع دعم النص العربي`;

    return { text, images: [], tables: [] };
  }

  private async extractFromExcel(buffer: Buffer, options: ProcessingOptions): Promise<any> {
    // Simulate Excel extraction - in real implementation, use xlsx or similar
    const text = `Excel spreadsheet data:
    Financial data for Iraqi business analysis
    بيانات مالية لتحليل الأعمال العراقية
    Sheet 1: Revenue Data, Sheet 2: Expense Analysis`;

    return {
      text,
      tables: [
        {
          id: 'excel_table_1',
          headers: ['Month', 'الشهر', 'Revenue', 'الإيرادات', 'Expenses', 'المصروفات'],
          rows: [
            ['January', 'يناير', '100000', '١٠٠٠٠٠', '80000', '٨٠٠٠٠'],
            ['February', 'فبراير', '120000', '١٢٠٠٠٠', '90000', '٩٠٠٠٠']
          ],
          tableType: 'financial'
        }
      ]
    };
  }

  private async extractFromPowerPoint(buffer: Buffer, options: ProcessingOptions): Promise<any> {
    // Simulate PowerPoint extraction
    const text = `PowerPoint presentation content
    عرض تقديمي يحتوي على معلومات مهنية
    Slide 1: Introduction to Iraqi Business Practices
    Slide 2: Cultural Considerations in Professional Settings`;

    return { text, images: [], tables: [] };
  }

  private async extractFromText(buffer: Buffer, options: ProcessingOptions): Promise<any> {
    const text = buffer.toString('utf-8');
    return { text, images: [], tables: [] };
  }

  private async extractFromMarkup(buffer: Buffer, options: ProcessingOptions): Promise<any> {
    // Simulate HTML/XML extraction - strip tags and extract text
    let text = buffer.toString('utf-8');
    text = text.replace(/<[^>]*>/g, ''); // Simple tag removal
    return { text, images: [], tables: [] };
  }

  // ====================== Analysis Methods ======================

  private async analyzeDocumentStructure(metadata: DocumentMetadata, rawContent: any): Promise<void> {
    metadata.hasImages = (rawContent.images?.length || 0) > 0;
    metadata.hasTables = (rawContent.tables?.length || 0) > 0;
    metadata.hasCharts = false; // Would be detected during image analysis
    metadata.hasForms = this.detectFormElements(rawContent.text);
    metadata.hasSignatures = this.detectSignatures(rawContent.text);
  }

  private async performLanguageAnalysis(metadata: DocumentMetadata, text: string): Promise<void> {
    const arabicCharCount = this.countArabicCharacters(text);
    const totalChars = text.length;
    const arabicRatio = arabicCharCount / totalChars;

    if (arabicRatio > 0.7) {
      metadata.primaryLanguage = 'ar';
    } else if (arabicRatio < 0.3) {
      metadata.primaryLanguage = 'en';
    } else {
      metadata.primaryLanguage = 'mixed';
    }

    metadata.languageConfidence = Math.abs(arabicRatio - 0.5) * 2; // 0-1 scale

    // Detect Iraqi dialect
    if (arabicCharCount > 0) {
      metadata.detectedDialect = await this.detectIraqiDialect(text);
    }

    // Extract keywords in both languages
    metadata.keywords = this.extractKeywords(text, 'en');
    metadata.keywordsAr = this.extractKeywords(text, 'ar');
  }

  private async detectProfessionalDomain(metadata: DocumentMetadata, text: string): Promise<void> {
    const domainScores: Record<ProfessionalDomain, number> = {
      legal: 0,
      medical: 0,
      educational: 0,
      business: 0,
      engineering: 0
    };

    // Score each domain based on keyword presence
    for (const [domain, keywords] of Object.entries(this.IRAQI_PROFESSIONAL_KEYWORDS)) {
      const arKeywords = keywords.ar;
      const enKeywords = keywords.en;
      
      for (const keyword of arKeywords) {
        if (text.includes(keyword)) {
          domainScores[domain as ProfessionalDomain] += 2; // Arabic keywords get higher weight
        }
      }
      
      for (const keyword of enKeywords) {
        if (text.toLowerCase().includes(keyword.toLowerCase())) {
          domainScores[domain as ProfessionalDomain] += 1;
        }
      }
    }

    // Find the domain with the highest score
    const maxScore = Math.max(...Object.values(domainScores));
    if (maxScore > 3) { // Threshold for detection
      const detectedDomain = Object.entries(domainScores)
        .find(([_, score]) => score === maxScore)?.[0] as ProfessionalDomain;
      
      metadata.detectedDomain = detectedDomain;
      metadata.domainConfidence = maxScore / (maxScore + 5); // Normalize to 0-1
      
      // Extract professional terms for this domain
      metadata.professionalTerms = this.extractProfessionalTerms(text, detectedDomain);
    }
  }

  private async performCulturalValidation(
    metadata: DocumentMetadata,
    text: string,
    strictnessLevel: 'basic' | 'standard' | 'strict'
  ): Promise<void> {
    // Simulate cultural compliance validation
    // In real implementation, this would call the iraqi-cultural-validator agent
    
    let complianceScore = 85; // Base score
    const flags: string[] = [];

    // Check for inappropriate content based on strictness level
    const inappropriatePatterns = {
      basic: ['explicit-content', 'hate-speech'],
      standard: ['explicit-content', 'hate-speech', 'political-bias'],
      strict: ['explicit-content', 'hate-speech', 'political-bias', 'sectarian-content', 'non-halal-references']
    };

    const patternsToCheck = inappropriatePatterns[strictnessLevel];
    
    // Simulate pattern checking
    for (const pattern of patternsToCheck) {
      if (Math.random() < 0.1) { // 10% chance of flagging for simulation
        flags.push(pattern);
        complianceScore -= 15;
      }
    }

    // Bonus for Arabic content in Iraqi context
    const arabicRatio = this.countArabicCharacters(text) / text.length;
    if (arabicRatio > 0.3) {
      complianceScore += 5;
    }

    // Bonus for professional terminology
    if (metadata.detectedDomain) {
      complianceScore += 10;
    }

    metadata.culturalComplianceScore = Math.max(0, Math.min(100, complianceScore));
    metadata.islamicCompliance = metadata.culturalComplianceScore >= 80;
    metadata.politicallyNeutral = !flags.includes('political-bias');
    metadata.culturalFlags = flags;
  }

  private async generateDocumentChunks(
    documentId: string,
    text: string,
    options: ProcessingOptions,
    metadata: DocumentMetadata
  ): Promise<DocumentChunk[]> {
    const chunks: DocumentChunk[] = [];
    const sentences = this.splitIntoSentences(text);
    
    let currentChunk = '';
    let chunkIndex = 0;
    let startOffset = 0;

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];
      
      // Check if adding this sentence would exceed chunk size
      if (currentChunk.length + sentence.length > options.chunkSize && currentChunk.length > 0) {
        // Create chunk from current content
        const chunk = await this.createDocumentChunk(
          documentId,
          chunkIndex,
          currentChunk,
          startOffset,
          startOffset + currentChunk.length,
          options,
          metadata
        );
        chunks.push(chunk);
        
        // Start new chunk with overlap
        const overlapStart = Math.max(0, currentChunk.length - options.chunkOverlap);
        currentChunk = currentChunk.substring(overlapStart) + sentence;
        startOffset = startOffset + overlapStart;
        chunkIndex++;
      } else {
        currentChunk += sentence;
      }
    }

    // Add final chunk if it has content
    if (currentChunk.trim().length > 0) {
      const chunk = await this.createDocumentChunk(
        documentId,
        chunkIndex,
        currentChunk,
        startOffset,
        startOffset + currentChunk.length,
        options,
        metadata
      );
      chunks.push(chunk);
    }

    return chunks;
  }

  private async createDocumentChunk(
    documentId: string,
    chunkIndex: number,
    content: string,
    startOffset: number,
    endOffset: number,
    options: ProcessingOptions,
    metadata: DocumentMetadata
  ): Promise<DocumentChunk> {
    const arabicCharCount = this.countArabicCharacters(content);
    const arabicTextRatio = arabicCharCount / content.length;
    
    // Generate embedding (simulated)
    const embedding = await this.generateEmbedding(content, options.embeddingModel);
    
    return {
      id: `${documentId}_chunk_${chunkIndex}`,
      documentId,
      chunkIndex,
      content,
      startOffset,
      endOffset,
      contentType: this.classifyContentType(content),
      importance: this.assessContentImportance(content, metadata),
      embedding,
      embeddingModel: options.embeddingModel,
      embeddingDimensions: embedding.length,
      culturallyRelevant: this.assessCulturalRelevance(content),
      professionalContext: metadata.detectedDomain,
      containsArabicText: arabicCharCount > 0,
      arabicTextRatio,
      wordCount: this.countWords(content),
      characterCount: content.length,
      createdAt: new Date()
    };
  }

  // ====================== Utility Methods ======================

  private countArabicCharacters(text: string): number {
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g;
    return (text.match(arabicRegex) || []).length;
  }

  private countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  private detectFormElements(text: string): boolean {
    const formKeywords = ['form', 'استمارة', 'application', 'طلب', 'field', 'حقل'];
    return formKeywords.some(keyword => text.toLowerCase().includes(keyword.toLowerCase()));
  }

  private detectSignatures(text: string): boolean {
    const signatureKeywords = ['signature', 'توقيع', 'signed', 'موقع', 'authorized', 'مخول'];
    return signatureKeywords.some(keyword => text.toLowerCase().includes(keyword.toLowerCase()));
  }

  private async detectIraqiDialect(text: string): Promise<'iraqi' | 'gulf' | 'levantine' | 'maghrebi' | 'standard'> {
    // Simulate dialect detection - in real implementation, use NLP models
    const iraqiIndicators = ['شلونك', 'وين', 'جان', 'كلش', 'هسه'];
    
    for (const indicator of iraqiIndicators) {
      if (text.includes(indicator)) {
        return 'iraqi';
      }
    }
    
    return 'standard';
  }

  private extractKeywords(text: string, language: 'ar' | 'en'): string[] {
    // Simple keyword extraction - in real implementation, use NLP libraries
    const words = text.toLowerCase().split(/\s+/);
    const stopWords = language === 'ar' 
      ? ['في', 'من', 'إلى', 'على', 'عن', 'مع', 'هذا', 'هذه', 'ذلك', 'تلك']
      : ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with'];
    
    const keywords = words
      .filter(word => word.length > 3)
      .filter(word => !stopWords.includes(word))
      .slice(0, 10); // Top 10 keywords

    return keywords;
  }

  private extractProfessionalTerms(text: string, domain: ProfessionalDomain): string[] {
    const domainKeywords = this.IRAQI_PROFESSIONAL_KEYWORDS[domain];
    const terms: string[] = [];
    
    [...domainKeywords.ar, ...domainKeywords.en].forEach(keyword => {
      if (text.toLowerCase().includes(keyword.toLowerCase())) {
        terms.push(keyword);
      }
    });
    
    return terms;
  }

  private splitIntoSentences(text: string): string[] {
    // Handle both Arabic and English sentence endings
    return text.split(/[.!?؟۔]+/).map(s => s.trim()).filter(s => s.length > 0);
  }

  private classifyContentType(content: string): ContentType {
    if (content.includes('|') || content.includes('\t')) return 'table';
    if (content.match(/^\s*[-•*]\s/m)) return 'text'; // List items
    if (content.length < 100) return 'header';
    return 'text';
  }

  private assessContentImportance(content: string, metadata: DocumentMetadata): 'low' | 'medium' | 'high' | 'critical' {
    const importantKeywords = ['important', 'critical', 'مهم', 'حرج', 'أساسي', 'ضروري'];
    const hasImportantKeywords = importantKeywords.some(keyword => 
      content.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (hasImportantKeywords) return 'critical';
    if (metadata.detectedDomain && content.length > 200) return 'high';
    if (content.length > 100) return 'medium';
    return 'low';
  }

  private assessCulturalRelevance(content: string): boolean {
    const culturalKeywords = ['iraq', 'iraqi', 'baghdad', 'العراق', 'عراقي', 'بغداد', 'islamic', 'إسلامي'];
    return culturalKeywords.some(keyword => 
      content.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  private async generateEmbedding(text: string, model: string): Promise<number[]> {
    // Simulate embedding generation - in real implementation, call OpenAI or similar
    const dimensions = model.includes('ada-002') ? 1536 : 768;
    return Array.from({ length: dimensions }, () => Math.random() * 2 - 1);
  }

  private async generateDocumentSummary(text: string, metadata: DocumentMetadata): Promise<string> {
    // Simulate summary generation
    const domain = metadata.detectedDomain || 'general';
    return `This ${domain} document contains ${metadata.wordCount} words with ${metadata.arabicTextPercentage?.toFixed(1)}% Arabic content. ` +
           `The document demonstrates ${metadata.culturalComplianceScore}% cultural compliance and appears to be ` +
           `${metadata.politicallyNeutral ? 'politically neutral' : 'politically biased'}.`;
  }

  private async generateArabicSummary(text: string, metadata: DocumentMetadata): Promise<string> {
    // Simulate Arabic summary generation
    const domain = metadata.detectedDomain || 'عام';
    const domainArabic = {
      legal: 'قانوني',
      medical: 'طبي',
      educational: 'تعليمي',
      business: 'تجاري',
      engineering: 'هندسي'
    }[domain] || 'عام';
    
    return `هذا المستند ${domainArabic} يحتوي على ${metadata.wordCount} كلمة مع ${metadata.arabicTextPercentage?.toFixed(1)}% محتوى عربي. ` +
           `المستند يظهر ${metadata.culturalComplianceScore}% امتثال ثقافي ويبدو أنه ` +
           `${metadata.politicallyNeutral ? 'محايد سياسياً' : 'متحيز سياسياً'}.`;
  }

  private async extractKeyInsights(text: string, metadata: DocumentMetadata): Promise<string[]> {
    // Simulate key insights extraction
    const insights = [
      `Document type: ${metadata.detectedDomain || 'General'}`,
      `Primary language: ${metadata.primaryLanguage}`,
      `Cultural compliance: ${metadata.culturalComplianceScore}%`
    ];
    
    if (metadata.professionalTerms.length > 0) {
      insights.push(`Professional terms detected: ${metadata.professionalTerms.slice(0, 3).join(', ')}`);
    }
    
    if (metadata.hasImages) {
      insights.push('Contains visual content');
    }
    
    if (metadata.hasTables) {
      insights.push('Contains structured data tables');
    }
    
    return insights;
  }

  private async extractKeyInsightsArabic(text: string, metadata: DocumentMetadata): Promise<string[]> {
    // Simulate Arabic key insights extraction
    const insights = [
      `نوع المستند: ${metadata.detectedDomain || 'عام'}`,
      `اللغة الأساسية: ${metadata.primaryLanguage === 'ar' ? 'عربية' : metadata.primaryLanguage === 'en' ? 'إنجليزية' : 'مختلطة'}`,
      `الامتثال الثقافي: ${metadata.culturalComplianceScore}%`
    ];
    
    if (metadata.professionalTerms.length > 0) {
      insights.push(`مصطلحات مهنية مكتشفة: ${metadata.professionalTerms.slice(0, 3).join('، ')}`);
    }
    
    if (metadata.hasImages) {
      insights.push('يحتوي على محتوى بصري');
    }
    
    if (metadata.hasTables) {
      insights.push('يحتوي على جداول بيانات منظمة');
    }
    
    return insights;
  }

  private async generateProfessionalRecommendations(text: string, domain: ProfessionalDomain): Promise<string[]> {
    const recommendations: Record<ProfessionalDomain, string[]> = {
      legal: [
        'Ensure all legal references comply with Iraqi civil law',
        'Verify Islamic jurisprudence alignment for family law matters',
        'Review document formatting against Iraqi court standards'
      ],
      medical: [
        'Confirm medication recommendations are halal-certified',
        'Ensure patient privacy protection meets Iraqi healthcare standards',
        'Verify medical terminology accuracy in Arabic translation'
      ],
      educational: [
        'Align content with Iraqi educational curriculum standards',
        'Ensure cultural sensitivity in educational materials',
        'Verify Arabic language instruction meets ministry requirements'
      ],
      business: [
        'Ensure business practices align with Islamic finance principles',
        'Review commercial terms for halal compliance',
        'Verify tax and regulatory compliance with Iraqi commercial law'
      ],
      engineering: [
        'Confirm compliance with Iraqi building codes and safety standards',
        'Review environmental impact considerations',
        'Verify technical specifications meet local construction requirements'
      ]
    };
    
    return recommendations[domain] || [];
  }

  // ====================== Public Utility Methods ======================

  getSupportedFormats(): DocumentFormat[] {
    return [...this.SUPPORTED_FORMATS];
  }

  async validateDocument(buffer: Buffer, fileName: string): Promise<{
    isValid: boolean;
    format?: DocumentFormat;
    errors: string[];
  }> {
    const errors: string[] = [];
    
    // Check file size (max 100MB for simulation)
    if (buffer.length > 100 * 1024 * 1024) {
      errors.push('File size exceeds maximum limit of 100MB');
    }
    
    // Check format
    try {
      const format = this.detectDocumentFormat(fileName, buffer);
      if (!this.SUPPORTED_FORMATS.includes(format)) {
        errors.push(`Unsupported format: ${format}`);
      }
      
      return {
        isValid: errors.length === 0,
        format: errors.length === 0 ? format : undefined,
        errors
      };
    } catch (error) {
      errors.push('Failed to detect document format');
      return {
        isValid: false,
        errors
      };
    }
  }

  async estimateProcessingTime(buffer: Buffer, fileName: string, options: Partial<ProcessingOptions>): Promise<number> {
    const format = this.detectDocumentFormat(fileName, buffer);
    const size = buffer.length;
    
    // Base time by format (in seconds)
    const baseTime: Record<DocumentFormat, number> = {
      pdf: 10,
      docx: 5,
      doc: 7,
      xlsx: 8,
      xls: 10,
      pptx: 6,
      ppt: 8,
      txt: 1,
      rtf: 2,
      html: 2,
      xml: 3
    };
    
    let estimatedTime = baseTime[format] || 5;
    
    // Adjust for file size (add 1 second per MB)
    estimatedTime += Math.ceil(size / (1024 * 1024));
    
    // Adjust for processing options
    const validatedOptions = ProcessingOptionsSchema.parse(options);
    if (validatedOptions.enableOCR) estimatedTime *= 2;
    if (validatedOptions.enableCulturalValidation) estimatedTime *= 1.3;
    if (validatedOptions.generateArabicSummary) estimatedTime *= 1.2;
    
    return Math.ceil(estimatedTime);
  }
}