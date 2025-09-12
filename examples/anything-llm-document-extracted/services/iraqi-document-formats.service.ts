/**
 * Iraqi Document Format Support Service
 * Specialized handling for Iraqi government, legal, medical, and educational document formats
 * Supports both traditional paper-based formats and modern digital formats
 */

import { readFileSync, promises as fs } from 'fs';
import { join, extname, basename } from 'path';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import * as mammoth from 'mammoth';

// Types
export interface IraqiDocumentFormat {
  type: IraqiDocumentType;
  subtype?: string;
  language: 'ar' | 'en' | 'ku' | 'mixed';
  governorate?: IraqiGovernorate;
  issuingAuthority?: string;
  officialStampRequired?: boolean;
  culturalCompliance: boolean;
}

export type IraqiDocumentType = 
  | 'legal' 
  | 'medical' 
  | 'educational' 
  | 'government' 
  | 'business' 
  | 'religious' 
  | 'personal';

export type IraqiGovernorate = 
  | 'baghdad' | 'basra' | 'mosul' | 'erbil' | 'sulaymaniyah' 
  | 'najaf' | 'karbala' | 'hillah' | 'kut' | 'amarah'
  | 'diwaniyah' | 'samawah' | 'ramadi' | 'fallujah' | 'tikrit'
  | 'kirkuk' | 'dohuk' | 'zakho' | 'other';

export interface DocumentStructure {
  header?: DocumentHeader;
  body: DocumentBody;
  footer?: DocumentFooter;
  attachments?: DocumentAttachment[];
  stamps?: OfficialStamp[];
  signatures?: DocumentSignature[];
}

export interface DocumentHeader {
  title: string;
  titleAr?: string;
  issuingAuthority: string;
  authorityAr?: string;
  documentNumber?: string;
  issueDate: Date;
  hijriDate?: string;
  officialSeal?: boolean;
}

export interface DocumentBody {
  sections: DocumentSection[];
  tables?: DocumentTable[];
  lists?: DocumentList[];
  arabicContent?: string;
  englishContent?: string;
}

export interface DocumentSection {
  title: string;
  titleAr?: string;
  content: string;
  contentAr?: string;
  subsections?: DocumentSection[];
  pageNumber?: number;
}

export interface DocumentTable {
  title?: string;
  headers: string[];
  headersAr?: string[];
  rows: string[][];
  pageNumber?: number;
}

export interface DocumentList {
  type: 'ordered' | 'unordered';
  items: DocumentListItem[];
  pageNumber?: number;
}

export interface DocumentListItem {
  text: string;
  textAr?: string;
  subitems?: DocumentListItem[];
}

export interface DocumentFooter {
  issuingOffice?: string;
  issuingOfficeAr?: string;
  contactInfo?: ContactInfo;
  disclaimer?: string;
  disclaimerAr?: string;
}

export interface ContactInfo {
  address: string;
  addressAr?: string;
  phone?: string;
  email?: string;
  website?: string;
}

export interface DocumentAttachment {
  type: 'image' | 'document' | 'certificate';
  filename: string;
  description?: string;
  descriptionAr?: string;
  required?: boolean;
}

export interface OfficialStamp {
  authority: string;
  authorityAr?: string;
  stampType: 'circular' | 'rectangular' | 'custom';
  location: { x: number; y: number; page: number };
  verified?: boolean;
}

export interface DocumentSignature {
  signerName: string;
  signerNameAr?: string;
  position: string;
  positionAr?: string;
  signatureDate: Date;
  location: { x: number; y: number; page: number };
  verified?: boolean;
}

export interface ProcessingResult {
  success: boolean;
  format: IraqiDocumentFormat;
  structure: DocumentStructure;
  extractedText: string;
  extractedTextAr?: string;
  confidence: number;
  warnings: string[];
  errors: string[];
  processingTime: number;
}

// Iraqi Document Templates and Patterns
const IRAQI_LEGAL_PATTERNS = {
  courtDocuments: {
    patterns: [
      'محكمة', 'المحكمة', 'قرار محكمة', 'حكم محكمة',
      'محكمة التمييز', 'محكمة الاستئناف', 'محكمة البداءة',
      'Court of Cassation', 'Court of Appeal', 'Court of First Instance'
    ],
    requiredFields: ['documentNumber', 'issueDate', 'judgeSignature']
  },
  contracts: {
    patterns: [
      'عقد', 'اتفاقية', 'تعاقد', 'التزام',
      'الطرف الأول', 'الطرف الثاني', 'بنود العقد',
      'Contract', 'Agreement', 'First Party', 'Second Party'
    ],
    requiredFields: ['parties', 'terms', 'signatures', 'witnessSignatures']
  },
  certificates: {
    patterns: [
      'شهادة', 'إجازة', 'ترخيص', 'إذن',
      'وزارة العدل', 'نقابة المحامين', 'المجلس القضائي',
      'Certificate', 'License', 'Ministry of Justice', 'Bar Association'
    ],
    requiredFields: ['holderName', 'issuingAuthority', 'validityPeriod']
  }
};

const IRAQI_MEDICAL_PATTERNS = {
  prescriptions: {
    patterns: [
      'وصفة طبية', 'روشتة', 'علاج', 'دواء',
      'طبيب', 'دكتور', 'مستشفى', 'عيادة',
      'Prescription', 'Medicine', 'Doctor', 'Hospital'
    ],
    requiredFields: ['doctorName', 'patientName', 'medications', 'dosage']
  },
  medicalReports: {
    patterns: [
      'تقرير طبي', 'فحص طبي', 'تشخيص', 'نتائج التحليل',
      'مختبر', 'أشعة', 'سونار', 'تحليل دم',
      'Medical Report', 'Laboratory', 'X-Ray', 'Blood Test'
    ],
    requiredFields: ['patientInfo', 'testResults', 'doctorSignature']
  },
  healthCertificates: {
    patterns: [
      'شهادة صحية', 'لياقة طبية', 'خلو من الأمراض',
      'وزارة الصحة', 'المديرية العامة للصحة',
      'Health Certificate', 'Medical Fitness', 'Ministry of Health'
    ],
    requiredFields: ['holderName', 'healthStatus', 'validityPeriod']
  }
};

const IRAQI_EDUCATIONAL_PATTERNS = {
  diplomas: {
    patterns: [
      'شهادة', 'دبلوم', 'إجازة', 'بكالوريوس', 'ماجستير', 'دكتوراه',
      'جامعة', 'كلية', 'معهد', 'وزارة التعليم العالي',
      'Diploma', 'Bachelor', 'Master', 'PhD', 'University', 'College'
    ],
    requiredFields: ['graduateName', 'degree', 'university', 'graduationDate']
  },
  transcripts: {
    patterns: [
      'كشف درجات', 'سجل أكاديمي', 'نتائج', 'معدل',
      'فصل دراسي', 'سنة دراسية', 'مقرر', 'مادة',
      'Transcript', 'Academic Record', 'GPA', 'Semester', 'Course'
    ],
    requiredFields: ['studentName', 'courses', 'grades', 'gpa']
  },
  studentIds: {
    patterns: [
      'هوية طالب', 'بطاقة جامعية', 'رقم قيد',
      'طالب', 'دراسات عليا', 'دراسات أولية',
      'Student ID', 'University Card', 'Student Number'
    ],
    requiredFields: ['studentName', 'studentNumber', 'university', 'validityPeriod']
  }
};

const IRAQI_GOVERNMENT_PATTERNS = {
  officialLetters: {
    patterns: [
      'ديوان', 'وزارة', 'مديرية', 'رئاسة الوزراء',
      'مجلس النواب', 'مجلس القضاء الأعلى', 'هيئة النزاهة',
      'Ministry', 'Directorate', 'Prime Minister Office', 'Parliament'
    ],
    requiredFields: ['issuingAuthority', 'recipientInfo', 'officialSignature']
  },
  identityDocuments: {
    patterns: [
      'هوية أحوال مدنية', 'جواز سفر', 'إقامة',
      'الأحوال المدنية', 'الجنسية والوثائق', 'جوازات السفر',
      'Civil ID', 'Passport', 'Residency', 'Civil Status'
    ],
    requiredFields: ['personalInfo', 'documentNumber', 'issuingAuthority']
  },
  permits: {
    patterns: [
      'إجازة', 'ترخيص', 'إذن', 'تصريح',
      'رخصة قيادة', 'رخصة عمل', 'تأشيرة',
      'License', 'Permit', 'Visa', 'Work Permit', 'Driving License'
    ],
    requiredFields: ['holderInfo', 'permitType', 'validityPeriod']
  }
};

export class IraqiDocumentFormatsService {
  private supportedFormats = ['.pdf', '.docx', '.doc', '.txt', '.rtf', '.jpg', '.png', '.tiff'];
  
  constructor() {
    // Initialize PDF.js worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/legacy/build/pdf.worker.js';
  }

  /**
   * Process Iraqi document based on format and extract structured data
   */
  async processDocument(filePath: string): Promise<ProcessingResult> {
    const startTime = Date.now();
    const ext = extname(filePath).toLowerCase();
    
    try {
      let result: ProcessingResult;
      
      switch (ext) {
        case '.pdf':
          result = await this.processPdfDocument(filePath);
          break;
        case '.docx':
        case '.doc':
          result = await this.processWordDocument(filePath);
          break;
        case '.txt':
        case '.rtf':
          result = await this.processTextDocument(filePath);
          break;
        case '.jpg':
        case '.png':
        case '.tiff':
          result = await this.processImageDocument(filePath);
          break;
        default:
          throw new Error(`Unsupported file format: ${ext}`);
      }
      
      result.processingTime = Date.now() - startTime;
      return result;
    } catch (error) {
      return {
        success: false,
        format: { type: 'personal', language: 'ar', culturalCompliance: false },
        structure: { body: { sections: [] } },
        extractedText: '',
        confidence: 0,
        warnings: [],
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        processingTime: Date.now() - startTime
      };
    }
  }

  /**
   * Process PDF document with Arabic support
   */
  private async processPdfDocument(filePath: string): Promise<ProcessingResult> {
    const data = await fs.readFile(filePath);
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    
    let fullText = '';
    const sections: DocumentSection[] = [];
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += pageText + '\n';
      
      sections.push({
        title: `صفحة ${pageNum}`,
        content: pageText,
        pageNumber: pageNum
      });
    }
    
    const format = this.identifyDocumentFormat(fullText, basename(filePath));
    const structure = this.parseDocumentStructure(fullText, format);
    
    return {
      success: true,
      format,
      structure,
      extractedText: fullText,
      extractedTextAr: this.extractArabicText(fullText),
      confidence: this.calculateConfidence(format, fullText),
      warnings: this.generateWarnings(format, structure),
      errors: [],
      processingTime: 0
    };
  }

  /**
   * Process Word document
   */
  private async processWordDocument(filePath: string): Promise<ProcessingResult> {
    const buffer = await fs.readFile(filePath);
    const result = await mammoth.extractRawText({ buffer });
    const fullText = result.value;
    
    const format = this.identifyDocumentFormat(fullText, basename(filePath));
    const structure = this.parseDocumentStructure(fullText, format);
    
    return {
      success: true,
      format,
      structure,
      extractedText: fullText,
      extractedTextAr: this.extractArabicText(fullText),
      confidence: this.calculateConfidence(format, fullText),
      warnings: this.generateWarnings(format, structure),
      errors: result.messages.map(msg => msg.message),
      processingTime: 0
    };
  }

  /**
   * Process text document
   */
  private async processTextDocument(filePath: string): Promise<ProcessingResult> {
    const fullText = await fs.readFile(filePath, 'utf-8');
    
    const format = this.identifyDocumentFormat(fullText, basename(filePath));
    const structure = this.parseDocumentStructure(fullText, format);
    
    return {
      success: true,
      format,
      structure,
      extractedText: fullText,
      extractedTextAr: this.extractArabicText(fullText),
      confidence: this.calculateConfidence(format, fullText),
      warnings: this.generateWarnings(format, structure),
      errors: [],
      processingTime: 0
    };
  }

  /**
   * Process image document (requires OCR)
   */
  private async processImageDocument(filePath: string): Promise<ProcessingResult> {
    // This would integrate with ArabicOCRService
    // For now, return placeholder
    return {
      success: false,
      format: { type: 'personal', language: 'ar', culturalCompliance: false },
      structure: { body: { sections: [] } },
      extractedText: '',
      confidence: 0,
      warnings: ['Image processing requires OCR service integration'],
      errors: [],
      processingTime: 0
    };
  }

  /**
   * Identify document format based on content and filename
   */
  private identifyDocumentFormat(text: string, filename: string): IraqiDocumentFormat {
    // Legal document detection
    if (this.matchesPatterns(text, IRAQI_LEGAL_PATTERNS.courtDocuments.patterns)) {
      return {
        type: 'legal',
        subtype: 'court_document',
        language: this.detectLanguage(text),
        governorate: this.detectGovernorate(text),
        issuingAuthority: this.extractIssuingAuthority(text),
        officialStampRequired: true,
        culturalCompliance: this.checkCulturalCompliance(text)
      };
    }
    
    if (this.matchesPatterns(text, IRAQI_LEGAL_PATTERNS.contracts.patterns)) {
      return {
        type: 'legal',
        subtype: 'contract',
        language: this.detectLanguage(text),
        culturalCompliance: this.checkCulturalCompliance(text)
      };
    }
    
    // Medical document detection
    if (this.matchesPatterns(text, IRAQI_MEDICAL_PATTERNS.prescriptions.patterns)) {
      return {
        type: 'medical',
        subtype: 'prescription',
        language: this.detectLanguage(text),
        culturalCompliance: this.checkCulturalCompliance(text)
      };
    }
    
    if (this.matchesPatterns(text, IRAQI_MEDICAL_PATTERNS.medicalReports.patterns)) {
      return {
        type: 'medical',
        subtype: 'medical_report',
        language: this.detectLanguage(text),
        culturalCompliance: this.checkCulturalCompliance(text)
      };
    }
    
    // Educational document detection
    if (this.matchesPatterns(text, IRAQI_EDUCATIONAL_PATTERNS.diplomas.patterns)) {
      return {
        type: 'educational',
        subtype: 'diploma',
        language: this.detectLanguage(text),
        culturalCompliance: this.checkCulturalCompliance(text)
      };
    }
    
    // Government document detection
    if (this.matchesPatterns(text, IRAQI_GOVERNMENT_PATTERNS.officialLetters.patterns)) {
      return {
        type: 'government',
        subtype: 'official_letter',
        language: this.detectLanguage(text),
        governorate: this.detectGovernorate(text),
        issuingAuthority: this.extractIssuingAuthority(text),
        officialStampRequired: true,
        culturalCompliance: this.checkCulturalCompliance(text)
      };
    }
    
    // Default to personal document
    return {
      type: 'personal',
      language: this.detectLanguage(text),
      culturalCompliance: this.checkCulturalCompliance(text)
    };
  }

  /**
   * Parse document structure based on format
   */
  private parseDocumentStructure(text: string, format: IraqiDocumentFormat): DocumentStructure {
    const lines = text.split('\n').filter(line => line.trim());
    
    const structure: DocumentStructure = {
      body: { sections: [] }
    };
    
    // Extract header if present
    if (lines.length > 0) {
      structure.header = this.parseDocumentHeader(lines.slice(0, 5), format);
    }
    
    // Parse main content
    structure.body.sections = this.parseSections(lines, format);
    
    // Extract tables if present
    structure.body.tables = this.parseTables(text);
    
    // Extract lists if present
    structure.body.lists = this.parseLists(lines);
    
    // Extract footer if present
    if (lines.length > 10) {
      structure.footer = this.parseDocumentFooter(lines.slice(-5), format);
    }
    
    return structure;
  }

  /**
   * Parse document header
   */
  private parseDocumentHeader(headerLines: string[], format: IraqiDocumentFormat): DocumentHeader | undefined {
    const headerText = headerLines.join(' ');
    
    // Extract title
    const title = headerLines[0] || 'مستند غير محدد العنوان';
    
    // Extract issuing authority
    const authorityPatterns = [
      'وزارة', 'ديوان', 'مديرية', 'هيئة', 'مجلس',
      'Ministry', 'Directorate', 'Office', 'Department'
    ];
    
    const issuingAuthority = this.extractMatchingPattern(headerText, authorityPatterns) || 'غير محدد';
    
    // Extract dates
    const datePattern = /\d{1,2}\/\d{1,2}\/\d{4}/;
    const dateMatch = headerText.match(datePattern);
    const issueDate = dateMatch ? new Date(dateMatch[0]) : new Date();
    
    return {
      title,
      issuingAuthority,
      issueDate,
      officialSeal: this.containsOfficialSeal(headerText)
    };
  }

  /**
   * Parse document sections
   */
  private parseSections(lines: string[], format: IraqiDocumentFormat): DocumentSection[] {
    const sections: DocumentSection[] = [];
    let currentSection: DocumentSection | null = null;
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Detect section headers (lines that are likely titles)
      if (this.isSectionHeader(trimmedLine, index, lines)) {
        // Save previous section
        if (currentSection) {
          sections.push(currentSection);
        }
        
        // Start new section
        currentSection = {
          title: trimmedLine,
          content: '',
          subsections: []
        };
      } else if (currentSection && trimmedLine) {
        // Add content to current section
        currentSection.content += (currentSection.content ? ' ' : '') + trimmedLine;
      }
    });
    
    // Add the last section
    if (currentSection) {
      sections.push(currentSection);
    }
    
    return sections;
  }

  /**
   * Parse tables from document
   */
  private parseTables(text: string): DocumentTable[] {
    const tables: DocumentTable[] = [];
    
    // Simple table detection - look for lines with multiple tabs or consistent spacing
    const lines = text.split('\n');
    let currentTable: string[] = [];
    
    lines.forEach(line => {
      if (line.includes('\t') || this.hasConsistentSpacing(line)) {
        currentTable.push(line);
      } else if (currentTable.length > 0) {
        // Process completed table
        const table = this.parseTableData(currentTable);
        if (table) {
          tables.push(table);
        }
        currentTable = [];
      }
    });
    
    return tables;
  }

  /**
   * Parse lists from document
   */
  private parseLists(lines: string[]): DocumentList[] {
    const lists: DocumentList[] = [];
    let currentList: DocumentListItem[] = [];
    let listType: 'ordered' | 'unordered' = 'unordered';
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      if (this.isListItem(trimmedLine)) {
        const item = this.parseListItem(trimmedLine);
        currentList.push(item);
        
        // Determine list type
        if (/^\d+\./.test(trimmedLine)) {
          listType = 'ordered';
        }
      } else if (currentList.length > 0) {
        // End of list
        lists.push({
          type: listType,
          items: currentList
        });
        currentList = [];
      }
    });
    
    return lists;
  }

  /**
   * Parse document footer
   */
  private parseDocumentFooter(footerLines: string[], format: IraqiDocumentFormat): DocumentFooter | undefined {
    const footerText = footerLines.join(' ');
    
    const contactPatterns = [
      'هاتف', 'تلفون', 'بريد إلكتروني', 'عنوان',
      'Phone', 'Email', 'Address', 'Contact'
    ];
    
    if (this.matchesPatterns(footerText, contactPatterns)) {
      return {
        issuingOffice: this.extractIssuingAuthority(footerText),
        contactInfo: this.parseContactInfo(footerText),
        disclaimer: this.extractDisclaimer(footerText)
      };
    }
    
    return undefined;
  }

  /**
   * Utility methods
   */
  private matchesPatterns(text: string, patterns: string[]): boolean {
    return patterns.some(pattern => text.includes(pattern));
  }

  private detectLanguage(text: string): 'ar' | 'en' | 'ku' | 'mixed' {
    const arabicChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
    const latinChars = (text.match(/[A-Za-z]/g) || []).length;
    const kurdishChars = (text.match(/[ێەڕڵڤگپچژ]/g) || []).length;
    
    if (kurdishChars > 0) return 'ku';
    if (arabicChars > latinChars) return 'ar';
    if (latinChars > arabicChars) return 'en';
    return 'mixed';
  }

  private detectGovernorate(text: string): IraqiGovernorate | undefined {
    const governoratePatterns = {
      'baghdad': ['بغداد', 'Baghdad'],
      'basra': ['البصرة', 'Basra'],
      'mosul': ['الموصل', 'Mosul', 'نينوى', 'Nineveh'],
      'erbil': ['أربيل', 'Erbil'],
      'sulaymaniyah': ['السليمانية', 'Sulaymaniyah'],
      'najaf': ['النجف', 'Najaf'],
      'karbala': ['كربلاء', 'Karbala']
    };
    
    for (const [governorate, patterns] of Object.entries(governoratePatterns)) {
      if (this.matchesPatterns(text, patterns)) {
        return governorate as IraqiGovernorate;
      }
    }
    
    return undefined;
  }

  private extractIssuingAuthority(text: string): string {
    const authorityPatterns = [
      /وزارة\s+[\u0600-\u06FF\s]+/,
      /ديوان\s+[\u0600-\u06FF\s]+/,
      /مديرية\s+[\u0600-\u06FF\s]+/,
      /Ministry\s+of\s+[\w\s]+/,
      /Department\s+of\s+[\w\s]+/
    ];
    
    for (const pattern of authorityPatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[0].trim();
      }
    }
    
    return 'غير محدد';
  }

  private checkCulturalCompliance(text: string): boolean {
    const inappropriateTerms = ['خمر', 'ميسر', 'ربا'];
    const politicalTerms = ['حزب', 'سياسة حزبية'];
    
    return !inappropriateTerms.some(term => text.includes(term)) &&
           !politicalTerms.some(term => text.includes(term));
  }

  private extractArabicText(text: string): string {
    return text.replace(/[^\u0600-\u06FF\s]/g, '').trim();
  }

  private calculateConfidence(format: IraqiDocumentFormat, text: string): number {
    let confidence = 50; // Base confidence
    
    // Increase confidence based on format-specific patterns
    if (format.type === 'legal') {
      const legalTerms = ['محكمة', 'عقد', 'قانون', 'حكم'];
      const foundTerms = legalTerms.filter(term => text.includes(term));
      confidence += (foundTerms.length / legalTerms.length) * 30;
    }
    
    // Increase confidence for proper Arabic text
    if (format.language === 'ar' && /[\u0600-\u06FF]/.test(text)) {
      confidence += 20;
    }
    
    return Math.min(confidence, 100);
  }

  private generateWarnings(format: IraqiDocumentFormat, structure: DocumentStructure): string[] {
    const warnings: string[] = [];
    
    if (format.officialStampRequired && !structure.stamps?.length) {
      warnings.push('هذا المستند يتطلب ختم رسمي');
    }
    
    if (!format.culturalCompliance) {
      warnings.push('قد يحتوي المستند على محتوى غير متوافق ثقافياً');
    }
    
    if (!structure.header?.issuingAuthority) {
      warnings.push('الجهة المصدرة غير محددة');
    }
    
    return warnings;
  }

  // Helper methods for parsing
  private isSectionHeader(line: string, index: number, allLines: string[]): boolean {
    return line.length < 100 && 
           line.trim().endsWith(':') || 
           /^\d+\.\s/.test(line) ||
           line === line.toUpperCase();
  }

  private hasConsistentSpacing(line: string): boolean {
    const spaces = line.split(/\s{2,}/).length;
    return spaces > 2;
  }

  private parseTableData(tableLines: string[]): DocumentTable | null {
    if (tableLines.length < 2) return null;
    
    const headers = tableLines[0].split(/\t|\s{2,}/).filter(h => h.trim());
    const rows = tableLines.slice(1).map(line => 
      line.split(/\t|\s{2,}/).filter(cell => cell.trim())
    );
    
    return {
      headers,
      rows
    };
  }

  private isListItem(line: string): boolean {
    return /^[-•*]\s/.test(line) || /^\d+\.\s/.test(line);
  }

  private parseListItem(line: string): DocumentListItem {
    const text = line.replace(/^[-•*]\s/, '').replace(/^\d+\.\s/, '').trim();
    return { text };
  }

  private extractMatchingPattern(text: string, patterns: string[]): string | null {
    for (const pattern of patterns) {
      if (text.includes(pattern)) {
        const index = text.indexOf(pattern);
        const endIndex = text.indexOf(' ', index + pattern.length + 10);
        return text.substring(index, endIndex > -1 ? endIndex : index + 50).trim();
      }
    }
    return null;
  }

  private containsOfficialSeal(text: string): boolean {
    const sealPatterns = ['ختم', 'طابع', 'seal', 'stamp'];
    return this.matchesPatterns(text, sealPatterns);
  }

  private parseContactInfo(text: string): ContactInfo {
    const phonePattern = /(\+964|0)?\s*\d{3}\s*\d{3}\s*\d{4}/;
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    
    const phoneMatch = text.match(phonePattern);
    const emailMatch = text.match(emailPattern);
    
    return {
      address: 'عنوان غير محدد',
      phone: phoneMatch ? phoneMatch[0] : undefined,
      email: emailMatch ? emailMatch[0] : undefined
    };
  }

  private extractDisclaimer(text: string): string {
    const disclaimerPatterns = [
      'تنويه', 'ملاحظة', 'إخلاء مسؤولية',
      'Note', 'Disclaimer', 'Notice'
    ];
    
    for (const pattern of disclaimerPatterns) {
      const index = text.indexOf(pattern);
      if (index > -1) {
        return text.substring(index, index + 200).trim();
      }
    }
    
    return '';
  }

  /**
   * Get supported formats
   */
  getSupportedFormats(): string[] {
    return [...this.supportedFormats];
  }

  /**
   * Validate document format support
   */
  isFormatSupported(filePath: string): boolean {
    const ext = extname(filePath).toLowerCase();
    return this.supportedFormats.includes(ext);
  }
}

export default IraqiDocumentFormatsService;