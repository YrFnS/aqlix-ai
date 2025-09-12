/**
 * Type definitions for Iraqi Enhanced Enterprise Document Processing
 * Extracted and enhanced from anything-llm with Iraqi cultural context
 */

// Document Processing Types
export interface DocumentProcessingOptions {
  fileType: 'pdf' | 'docx' | 'pptx' | 'xlsx' | 'txt' | 'md' | 'html';
  extractImages: boolean;
  extractTables: boolean;
  extractMetadata: boolean;
  arabicTextExtraction: boolean;
  culturalValidation: boolean;
  professionalDomain?: 'legal' | 'medical' | 'educational' | 'business' | 'engineering';
  outputFormat: 'text' | 'markdown' | 'structured';
}

export interface ProcessedDocument {
  id: string;
  originalFileName: string;
  fileType: string;
  fileSize: number;
  processedAt: string;
  processingTime: number;
  
  content: {
    text: string;
    textAr?: string;
    images?: ProcessedImage[];
    tables?: ProcessedTable[];
    metadata?: DocumentMetadata;
  };
  
  culturalAnalysis: {
    islamicCompliance: number; // 0-100
    politicalNeutrality: number;
    culturalSensitivity: number;
    overallScore: number;
    arabicContent: {
      hasArabicText: boolean;
      arabicRatio: number;
      dialect: string;
      rtlProcessed: boolean;
    };
  };
  
  professionalContext?: {
    domain: string;
    confidence: number;
    terminology: string[];
    complianceFlags: {
      iraqiStandards: boolean;
      islamicEthics: boolean;
      professionalEthics: boolean;
      dataPrivacy: boolean;
    };
  };
  
  processingStats: {
    pagesProcessed: number;
    charactersExtracted: number;
    imagesExtracted: number;
    tablesExtracted: number;
    errorCount: number;
    warnings: string[];
  };
}

export interface ProcessedImage {
  id: string;
  fileName: string;
  format: string;
  width: number;
  height: number;
  size: number;
  extractedText?: string;
  culturalAnalysis?: {
    containsText: boolean;
    containsArabicText: boolean;
    culturallyAppropriate: boolean;
  };
}

export interface ProcessedTable {
  id: string;
  headers: string[];
  rows: string[][];
  caption?: string;
  culturalContext?: {
    hasArabicHeaders: boolean;
    rtlFormatted: boolean;
    professionalTerminology: string[];
  };
}

export interface DocumentMetadata {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string[];
  createdDate?: string;
  modifiedDate?: string;
  language?: string;
  pageCount?: number;
  wordCount?: number;
  characterCount?: number;
  
  // Iraqi-specific metadata
  culturalMetadata?: {
    islamicContent: boolean;
    arabicLanguage: boolean;
    iraqiContext: boolean;
    professionalDomain?: string;
    culturalReferences: string[];
  };
}

// Vector Database Types
export interface IraqiDocumentEmbedding {
  id: string;
  content: string;
  contentAr?: string;
  embedding: number[];
  metadata: EmbeddingMetadata;
}

export interface EmbeddingMetadata {
  source: string;
  fileType: string;
  processedAt: string;
  userId: string;
  workspaceId: string;
  
  professionalDomain?: 'legal' | 'medical' | 'educational' | 'business' | 'engineering';
  culturalCompliance: {
    islamicCompliance: number;
    politicalNeutrality: number;
    culturalSensitivity: number;
    overallScore: number;
  };
  arabicContent: {
    hasArabicText: boolean;
    arabicRatio: number;
    dialect: 'baghdad' | 'basra' | 'mosul' | 'general' | 'standard';
    rtlProcessed: boolean;
  };
  
  legalMetadata?: {
    caseType: string;
    courtLevel: string;
    lawCategory: string;
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  };
  medicalMetadata?: {
    specialty: string;
    patientPrivacyLevel: string;
    treatmentType: string;
    islamicEthicsCompliant: boolean;
  };
  educationalMetadata?: {
    subject: string;
    educationLevel: string;
    curriculumAlignment: string;
    islamicEducationCompliant: boolean;
  };
  businessMetadata?: {
    businessType: string;
    halalCompliant: boolean;
    financialInstruments: string[];
    riskLevel: string;
  };
  engineeringMetadata?: {
    discipline: string;
    safetyStandards: string[];
    environmentalCompliance: boolean;
    iraqiBuildingCodes: boolean;
  };
}

export interface VectorSearchQuery {
  query: string;
  queryAr?: string;
  workspaceId?: string;
  professionalDomain?: string;
  culturalFilters?: {
    minIslamicCompliance?: number;
    minPoliticalNeutrality?: number;
    requireArabicContent?: boolean;
    dialectPreference?: string;
  };
  limit?: number;
  threshold?: number;
}

export interface VectorSearchResult {
  id: string;
  content: string;
  contentAr?: string;
  score: number;
  culturalScore?: number;
  metadata: EmbeddingMetadata;
}

// Chunking Types
export interface ChunkingOptions {
  chunkSize: number;
  chunkOverlap: number;
  preserveStructure: boolean;
  arabicAware: boolean;
  culturalContext?: {
    professionalDomain?: 'legal' | 'medical' | 'educational' | 'business' | 'engineering';
    dialectPreference?: 'baghdad' | 'basra' | 'mosul' | 'general' | 'standard';
    islamicTextHandling?: boolean;
    preserveCultural?: boolean;
  };
  semanticChunking?: boolean;
  embeddings?: {
    generate: (text: string) => Promise<number[]>;
    threshold: number;
  };
}

export interface DocumentChunk {
  id: string;
  content: string;
  contentAr?: string;
  startPosition: number;
  endPosition: number;
  chunkIndex: number;
  metadata: ChunkMetadata;
}

export interface ChunkMetadata {
  documentId: string;
  totalChunks: number;
  originalLength: number;
  
  arabicContent: {
    hasArabicText: boolean;
    arabicRatio: number;
    dialect: string;
    rtlHandled: boolean;
  };
  
  culturalContext: {
    professionalDomain?: string;
    islamicContent: boolean;
    culturalReferences: string[];
    preservedStructure: string[];
  };
  
  quality: {
    coherenceScore: number;
    completenessScore: number;
    culturalIntegrityScore: number;
  };
  
  relationships: {
    previousChunkId?: string;
    nextChunkId?: string;
    semanticSimilarity?: number;
    contextualDependency?: boolean;
  };
}

// Cultural Filtering Types
export interface CulturalFilterConfig {
  islamicCompliance: {
    enabled: boolean;
    strictness: 'lenient' | 'moderate' | 'strict';
    preserveEducationalContent: boolean;
    allowHistoricalReferences: boolean;
  };
  politicalNeutrality: {
    enabled: boolean;
    blockSectarian: boolean;
    blockTribal: boolean;
    blockPartisan: boolean;
    allowNeutralGovernment: boolean;
  };
  culturalSensitivity: {
    enabled: boolean;
    preserveIraqiCulture: boolean;
    respectFamilyValues: boolean;
    filterInappropriate: boolean;
  };
  professionalDomains: {
    enabled: boolean;
    requireProfessionalContext: boolean;
    enhanceTerminology: boolean;
  };
  contentModeration: {
    enabled: boolean;
    filterLevel: 'basic' | 'enhanced' | 'comprehensive';
    preserveContext: boolean;
  };
}

export interface CulturalAnalysis {
  islamicCompliance: {
    score: number;
    violations: string[];
    suggestions: string[];
    preservedElements: string[];
  };
  politicalNeutrality: {
    score: number;
    sensitivePhrases: string[];
    neutralAlternatives: string[];
    riskLevel: 'low' | 'medium' | 'high';
  };
  culturalSensitivity: {
    score: number;
    culturalReferences: string[];
    inappropriateContent: string[];
    culturalEnhancements: string[];
  };
  overallScore: number;
  recommendations: string[];
  filteredContent?: string;
  preservedOriginal?: string;
}

export interface ContentModerationResult {
  allowed: boolean;
  confidence: number;
  modifications: {
    removedContent: string[];
    replacedContent: Array<{
      original: string;
      replacement: string;
      reason: string;
    }>;
    addedContext: string[];
  };
  culturalAnalysis: CulturalAnalysis;
  professionalContext?: {
    domain: string;
    appropriateness: number;
    terminology: string[];
  };
}

// Domain Tagging Types
export interface DomainTag {
  domain: 'legal' | 'medical' | 'educational' | 'business' | 'engineering';
  subdomain?: string;
  confidence: number;
  evidence: string[];
  culturalContext?: {
    islamicCompliance: boolean;
    culturalRelevance: number;
    localizedTerminology: string[];
  };
}

export interface DocumentTagging {
  primaryDomain: DomainTag;
  secondaryDomains: DomainTag[];
  culturalTags: {
    islamicContext: boolean;
    arabicContent: boolean;
    iraqiDialect?: 'baghdad' | 'basra' | 'mosul' | 'general' | 'standard';
    culturalReferences: string[];
  };
  professionalLevel: 'basic' | 'intermediate' | 'advanced' | 'expert';
  contentType: 'formal' | 'informal' | 'academic' | 'legal' | 'technical';
  urgencyLevel?: 'low' | 'medium' | 'high' | 'critical';
  complianceFlags: {
    iraqiStandards: boolean;
    islamicEthics: boolean;
    professionalEthics: boolean;
    dataPrivacy: boolean;
  };
  qualityMetrics: {
    terminologyAccuracy: number;
    culturalAppropriateness: number;
    professionalRelevance: number;
    overallQuality: number;
  };
}

// Service Configuration Types
export interface DocumentProcessorConfig {
  processing: {
    maxFileSize: number; // bytes
    allowedFileTypes: string[];
    timeoutMs: number;
    concurrent: boolean;
    arabicProcessing: boolean;
  };
  cultural: {
    enableFiltering: boolean;
    filterConfig: CulturalFilterConfig;
    requireCompliance: boolean;
    minimumScore: number;
  };
  chunking: {
    defaultChunkSize: number;
    defaultOverlap: number;
    enableSemantic: boolean;
    arabicAware: boolean;
  };
  vectorDatabase: {
    provider: 'pinecone' | 'weaviate' | 'chroma' | 'qdrant';
    config: Record<string, any>;
    embeddingModel: string;
    dimensions: number;
  };
  domainTagging: {
    enabled: boolean;
    confidenceThreshold: number;
    requireProfessionalDomain: boolean;
  };
}

// Error Types
export interface ProcessingError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
  documentId?: string;
  stage: 'processing' | 'chunking' | 'embedding' | 'filtering' | 'tagging';
}

// Stats Types
export interface ProcessingStats {
  totalDocuments: number;
  byFileType: Record<string, number>;
  byProfessionalDomain: Record<string, number>;
  culturalCompliance: {
    averageScore: number;
    passRate: number;
    topViolations: string[];
  };
  arabicContent: {
    documentsWithArabic: number;
    averageArabicRatio: number;
    dialectDistribution: Record<string, number>;
  };
  processingPerformance: {
    averageProcessingTime: number;
    successRate: number;
    errorRate: number;
    throughputPerHour: number;
  };
}