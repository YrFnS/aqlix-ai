/**
 * Iraqi Arabic-Aware Document Chunking Service
 * Extracted and enhanced from anything-llm with Iraqi cultural context
 *
 * Features:
 * - Arabic-aware text chunking with proper RTL handling
 * - Iraqi dialect preservation across chunks
 * - Professional domain context preservation
 * - Islamic text structure awareness
 * - Mixed Arabic-English content handling
 * - Semantic chunking with cultural context
 */

export interface ChunkingOptions {
  chunkSize: number;
  chunkOverlap: number;
  preserveStructure: boolean;
  arabicAware: boolean;
  culturalContext?: {
    professionalDomain?:
      | "legal"
      | "medical"
      | "educational"
      | "business"
      | "engineering";
    dialectPreference?: "baghdad" | "basra" | "mosul" | "general" | "standard";
    islamicTextHandling?: boolean;
    preserveCultural?: boolean;
  };
  semanticChunking?: boolean;
  embeddings?: {
    generate: (text: string) => Promise<number[]>;
    threshold: number; // Similarity threshold for semantic boundaries
  };
}

export interface DocumentChunk {
  id: string;
  content: string;
  contentAr?: string;
  startPosition: number;
  endPosition: number;
  chunkIndex: number;
  metadata: {
    // Core metadata
    documentId: string;
    totalChunks: number;
    originalLength: number;

    // Arabic-specific metadata
    arabicContent: {
      hasArabicText: boolean;
      arabicRatio: number; // 0-1
      dialect: string;
      rtlHandled: boolean;
    };

    // Cultural metadata
    culturalContext: {
      professionalDomain?: string;
      islamicContent: boolean;
      culturalReferences: string[];
      preservedStructure: string[];
    };

    // Chunk quality metrics
    quality: {
      coherenceScore: number; // 0-1
      completenessScore: number; // 0-1
      culturalIntegrityScore: number; // 0-1
    };

    // Relationship metadata
    relationships: {
      previousChunkId?: string;
      nextChunkId?: string;
      semanticSimilarity?: number;
      contextualDependency?: boolean;
    };
  };
}

export class IraqiDocumentChunker {
  private arabicTextRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
  private islamicTerms = [
    "الله",
    "محمد",
    "الإسلام",
    "القرآن",
    "السنة",
    "الحديث",
    "الصلاة",
    "الزكاة",
    "الحج",
    "الصوم",
    "رمضان",
    "المسجد",
    "الجامع",
    "الإمام",
    "الخطبة",
    "Allah",
    "Muhammad",
    "Islam",
    "Quran",
    "Sunnah",
    "Hadith",
    "Prayer",
    "Zakat",
    "Hajj",
    "Fasting",
    "Ramadan",
    "Mosque",
    "Imam",
    "Khutbah",
  ];

  private iraqiDialectMarkers = {
    baghdad: ["شلونك", "وين", "شكو ماكو", "زين", "ماشي الحال"],
    basra: ["شكد", "وين", "چان", "هوائي"],
    mosul: ["شونك", "وينن", "هاي"],
    general: ["شلون", "شكو", "ماكو", "زين", "ماشي"],
  };

  /**
   * Chunk document with Arabic and cultural awareness
   */
  async chunkDocument(
    content: string,
    documentId: string,
    options: ChunkingOptions,
  ): Promise<DocumentChunk[]> {
    try {
      // Detect Arabic content and dialect
      const arabicAnalysis = this.analyzeArabicContent(content);

      // Choose appropriate chunking strategy
      const strategy = this.selectChunkingStrategy(
        content,
        options,
        arabicAnalysis,
      );

      let chunks: DocumentChunk[];

      switch (strategy) {
        case "semantic":
          chunks = await this.semanticChunking(
            content,
            documentId,
            options,
            arabicAnalysis,
          );
          break;
        case "arabic-structure":
          chunks = this.arabicStructureChunking(
            content,
            documentId,
            options,
            arabicAnalysis,
          );
          break;
        case "mixed-content":
          chunks = this.mixedContentChunking(
            content,
            documentId,
            options,
            arabicAnalysis,
          );
          break;
        case "professional-domain":
          chunks = this.professionalDomainChunking(
            content,
            documentId,
            options,
            arabicAnalysis,
          );
          break;
        default:
          chunks = this.standardChunking(
            content,
            documentId,
            options,
            arabicAnalysis,
          );
      }

      // Post-process chunks for quality and cultural integrity
      chunks = await this.postProcessChunks(chunks, options);

      // Establish relationships between chunks
      chunks = this.establishChunkRelationships(chunks);

      return chunks;
    } catch (error) {
      console.error("Error chunking document:", error);
      throw new Error("Failed to chunk document");
    }
  }

  /**
   * Analyze Arabic content in document
   */
  private analyzeArabicContent(content: string): {
    hasArabicText: boolean;
    arabicRatio: number;
    dialect: string;
    rtlSections: { start: number; end: number; text: string }[];
    islamicContent: boolean;
    culturalReferences: string[];
  } {
    const arabicMatches =
      content.match(new RegExp(this.arabicTextRegex, "g")) || [];
    const totalChars = content.length;
    const arabicChars = arabicMatches.length;

    // Detect dialect
    let detectedDialect = "general";
    let maxMatches = 0;

    for (const [dialect, markers] of Object.entries(this.iraqiDialectMarkers)) {
      const matches = markers.filter((marker) =>
        content.includes(marker),
      ).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        detectedDialect = dialect;
      }
    }

    // Find RTL sections
    const rtlSections: { start: number; end: number; text: string }[] = [];
    const arabicTextRegex = new RegExp(
      `[${this.arabicTextRegex.source}][^${this.arabicTextRegex.source}]*[${this.arabicTextRegex.source}]|[${this.arabicTextRegex.source}]+`,
      "g",
    );
    let match;

    while ((match = arabicTextRegex.exec(content)) !== null) {
      rtlSections.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
      });
    }

    // Detect Islamic content
    const islamicContent = this.islamicTerms.some((term) =>
      content.toLowerCase().includes(term.toLowerCase()),
    );

    // Extract cultural references
    const culturalReferences: string[] = [];
    this.islamicTerms.forEach((term) => {
      if (content.toLowerCase().includes(term.toLowerCase())) {
        culturalReferences.push(term);
      }
    });

    return {
      hasArabicText: arabicChars > 0,
      arabicRatio: totalChars > 0 ? arabicChars / totalChars : 0,
      dialect: detectedDialect,
      rtlSections,
      islamicContent,
      culturalReferences,
    };
  }

  /**
   * Select appropriate chunking strategy
   */
  private selectChunkingStrategy(
    content: string,
    options: ChunkingOptions,
    arabicAnalysis: any,
  ):
    | "semantic"
    | "arabic-structure"
    | "mixed-content"
    | "professional-domain"
    | "standard" {
    if (options.semanticChunking && options.embeddings) {
      return "semantic";
    }

    if (arabicAnalysis.arabicRatio > 0.5) {
      return "arabic-structure";
    }

    if (arabicAnalysis.hasArabicText && arabicAnalysis.arabicRatio > 0.1) {
      return "mixed-content";
    }

    if (options.culturalContext?.professionalDomain) {
      return "professional-domain";
    }

    return "standard";
  }

  /**
   * Semantic chunking with Arabic awareness
   */
  private async semanticChunking(
    content: string,
    documentId: string,
    options: ChunkingOptions,
    arabicAnalysis: any,
  ): Promise<DocumentChunk[]> {
    const chunks: DocumentChunk[] = [];
    const sentences = this.splitIntoSentences(
      content,
      arabicAnalysis.hasArabicText,
    );
    let currentChunk = "";
    let currentChunkStart = 0;
    let chunkIndex = 0;

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];
      const potentialChunk =
        currentChunk + (currentChunk ? " " : "") + sentence;

      if (potentialChunk.length > options.chunkSize && currentChunk) {
        // Check semantic boundary
        if (options.embeddings && i < sentences.length - 1) {
          const currentEmbedding =
            await options.embeddings.generate(currentChunk);
          const nextSentenceEmbedding =
            await options.embeddings.generate(sentence);
          const similarity = this.calculateCosineSimilarity(
            currentEmbedding,
            nextSentenceEmbedding,
          );

          if (similarity < options.embeddings.threshold) {
            // Semantic boundary found, create chunk
            const chunk = await this.createChunk(
              currentChunk,
              documentId,
              currentChunkStart,
              currentChunkStart + currentChunk.length,
              chunkIndex++,
              options,
              arabicAnalysis,
            );
            chunks.push(chunk);

            currentChunk = sentence;
            currentChunkStart = content.indexOf(
              sentence,
              currentChunkStart + currentChunk.length,
            );
            continue;
          }
        }

        // No semantic boundary, use size-based chunking
        const chunk = await this.createChunk(
          currentChunk,
          documentId,
          currentChunkStart,
          currentChunkStart + currentChunk.length,
          chunkIndex++,
          options,
          arabicAnalysis,
        );
        chunks.push(chunk);

        currentChunk = sentence;
        currentChunkStart = content.indexOf(
          sentence,
          currentChunkStart + currentChunk.length,
        );
      } else {
        currentChunk = potentialChunk;
      }
    }

    // Add remaining chunk
    if (currentChunk) {
      const chunk = await this.createChunk(
        currentChunk,
        documentId,
        currentChunkStart,
        currentChunkStart + currentChunk.length,
        chunkIndex,
        options,
        arabicAnalysis,
      );
      chunks.push(chunk);
    }

    return chunks;
  }

  /**
   * Arabic structure-aware chunking
   */
  private arabicStructureChunking(
    content: string,
    documentId: string,
    options: ChunkingOptions,
    arabicAnalysis: any,
  ): Promise<DocumentChunk[]> {
    const chunks: DocumentChunk[] = [];

    // Split by Arabic paragraph markers and punctuation
    const arabicBreakPoints = [
      "۔", // Arabic full stop
      "؟", // Arabic question mark
      "؍", // Arabic paragraph separator
      "\n\n", // Double newline
      "।", // Devanagari full stop (sometimes used)
    ];

    let currentPosition = 0;
    let chunkIndex = 0;

    const segments = this.splitByMultipleDelimiters(content, arabicBreakPoints);
    let currentChunk = "";
    let chunkStart = 0;

    for (const segment of segments) {
      const potentialChunk =
        currentChunk + (currentChunk ? " " : "") + segment.trim();

      if (potentialChunk.length > options.chunkSize && currentChunk) {
        // Create chunk preserving Arabic structure
        const chunk = this.createChunkSync(
          currentChunk.trim(),
          documentId,
          chunkStart,
          chunkStart + currentChunk.length,
          chunkIndex++,
          options,
          arabicAnalysis,
        );
        chunks.push(chunk);

        currentChunk = segment.trim();
        chunkStart = content.indexOf(segment, chunkStart + currentChunk.length);
      } else {
        if (!currentChunk) {
          chunkStart = content.indexOf(segment);
        }
        currentChunk = potentialChunk;
      }
    }

    // Add remaining chunk
    if (currentChunk.trim()) {
      const chunk = this.createChunkSync(
        currentChunk.trim(),
        documentId,
        chunkStart,
        chunkStart + currentChunk.length,
        chunkIndex,
        options,
        arabicAnalysis,
      );
      chunks.push(chunk);
    }

    return Promise.resolve(chunks);
  }

  /**
   * Mixed Arabic-English content chunking
   */
  private mixedContentChunking(
    content: string,
    documentId: string,
    options: ChunkingOptions,
    arabicAnalysis: any,
  ): Promise<DocumentChunk[]> {
    const chunks: DocumentChunk[] = [];
    let chunkIndex = 0;
    let currentPosition = 0;

    // Identify language switches
    const segments = this.identifyLanguageSegments(content);
    let currentChunk = "";
    let chunkStart = 0;

    for (const segment of segments) {
      const potentialChunk =
        currentChunk + (currentChunk ? " " : "") + segment.text;

      if (potentialChunk.length > options.chunkSize && currentChunk) {
        // Ensure we don't break mid-sentence in either language
        if (
          this.isGoodBreakPoint(currentChunk, segment.text, segment.language)
        ) {
          const chunk = this.createChunkSync(
            currentChunk.trim(),
            documentId,
            chunkStart,
            chunkStart + currentChunk.length,
            chunkIndex++,
            options,
            arabicAnalysis,
          );
          chunks.push(chunk);

          currentChunk = segment.text;
          chunkStart = segment.start;
        } else {
          currentChunk = potentialChunk;
        }
      } else {
        if (!currentChunk) {
          chunkStart = segment.start;
        }
        currentChunk = potentialChunk;
      }
    }

    // Add remaining chunk
    if (currentChunk.trim()) {
      const chunk = this.createChunkSync(
        currentChunk.trim(),
        documentId,
        chunkStart,
        chunkStart + currentChunk.length,
        chunkIndex,
        options,
        arabicAnalysis,
      );
      chunks.push(chunk);
    }

    return Promise.resolve(chunks);
  }

  /**
   * Professional domain-aware chunking
   */
  private professionalDomainChunking(
    content: string,
    documentId: string,
    options: ChunkingOptions,
    arabicAnalysis: any,
  ): Promise<DocumentChunk[]> {
    const chunks: DocumentChunk[] = [];
    const domain = options.culturalContext?.professionalDomain;

    let breakPoints: string[] = [];

    switch (domain) {
      case "legal":
        breakPoints = [
          "المادة",
          "الفقرة",
          "البند",
          "Article",
          "Section",
          "Clause",
          "القانون",
          "التشريع",
          "Law",
          "Regulation",
        ];
        break;
      case "medical":
        breakPoints = [
          "التشخيص",
          "العلاج",
          "الدواء",
          "Diagnosis",
          "Treatment",
          "Medicine",
          "المريض",
          "Patient",
          "الأعراض",
          "Symptoms",
        ];
        break;
      case "educational":
        breakPoints = [
          "الدرس",
          "الوحدة",
          "الفصل",
          "Lesson",
          "Unit",
          "Chapter",
          "التمرين",
          "Exercise",
          "الواجب",
          "Assignment",
        ];
        break;
      case "business":
        breakPoints = [
          "الاتفاقية",
          "العقد",
          "البند",
          "Agreement",
          "Contract",
          "Term",
          "الميزانية",
          "Budget",
          "التقرير",
          "Report",
        ];
        break;
      case "engineering":
        breakPoints = [
          "المواصفات",
          "التصميم",
          "المتطلبات",
          "Specifications",
          "Design",
          "Requirements",
          "الحسابات",
          "Calculations",
          "المعايير",
          "Standards",
        ];
        break;
      default:
        breakPoints = [".", "؟", "!", "\n\n"];
    }

    return this.chunkByBreakPoints(
      content,
      documentId,
      breakPoints,
      options,
      arabicAnalysis,
    );
  }

  /**
   * Standard chunking with basic Arabic awareness
   */
  private standardChunking(
    content: string,
    documentId: string,
    options: ChunkingOptions,
    arabicAnalysis: any,
  ): Promise<DocumentChunk[]> {
    const chunks: DocumentChunk[] = [];
    let chunkIndex = 0;
    let start = 0;

    while (start < content.length) {
      let end = Math.min(start + options.chunkSize, content.length);

      // Avoid breaking words or Arabic text
      if (end < content.length) {
        // Move back to find a good break point
        while (end > start && !this.isGoodBreakCharacter(content[end])) {
          end--;
        }

        if (end === start) {
          // Force break if no good break point found
          end = start + options.chunkSize;
        }
      }

      const chunkContent = content.slice(start, end).trim();

      if (chunkContent) {
        const chunk = this.createChunkSync(
          chunkContent,
          documentId,
          start,
          end,
          chunkIndex++,
          options,
          arabicAnalysis,
        );
        chunks.push(chunk);
      }

      // Apply overlap
      start = end - options.chunkOverlap;
      if (start < 0) start = end;
    }

    return Promise.resolve(chunks);
  }

  /**
   * Create a document chunk with metadata
   */
  private async createChunk(
    content: string,
    documentId: string,
    startPosition: number,
    endPosition: number,
    chunkIndex: number,
    options: ChunkingOptions,
    arabicAnalysis: any,
  ): Promise<DocumentChunk> {
    const chunkArabicAnalysis = this.analyzeArabicContent(content);

    return {
      id: `${documentId}_chunk_${chunkIndex}`,
      content,
      contentAr: chunkArabicAnalysis.hasArabicText ? content : undefined,
      startPosition,
      endPosition,
      chunkIndex,
      metadata: {
        documentId,
        totalChunks: 0, // Will be updated later
        originalLength: content.length,

        arabicContent: {
          hasArabicText: chunkArabicAnalysis.hasArabicText,
          arabicRatio: chunkArabicAnalysis.arabicRatio,
          dialect: chunkArabicAnalysis.dialect,
          rtlHandled: true,
        },

        culturalContext: {
          professionalDomain: options.culturalContext?.professionalDomain,
          islamicContent: chunkArabicAnalysis.islamicContent,
          culturalReferences: chunkArabicAnalysis.culturalReferences,
          preservedStructure: [],
        },

        quality: {
          coherenceScore: await this.calculateCoherenceScore(content),
          completenessScore: this.calculateCompletenessScore(content, options),
          culturalIntegrityScore: this.calculateCulturalIntegrityScore(
            content,
            chunkArabicAnalysis,
          ),
        },

        relationships: {
          previousChunkId:
            chunkIndex > 0
              ? `${documentId}_chunk_${chunkIndex - 1}`
              : undefined,
          nextChunkId: undefined, // Will be set later
          semanticSimilarity: undefined,
          contextualDependency: this.hasContextualDependency(content),
        },
      },
    };
  }

  private createChunkSync(
    content: string,
    documentId: string,
    startPosition: number,
    endPosition: number,
    chunkIndex: number,
    options: ChunkingOptions,
    arabicAnalysis: any,
  ): DocumentChunk {
    const chunkArabicAnalysis = this.analyzeArabicContent(content);

    return {
      id: `${documentId}_chunk_${chunkIndex}`,
      content,
      contentAr: chunkArabicAnalysis.hasArabicText ? content : undefined,
      startPosition,
      endPosition,
      chunkIndex,
      metadata: {
        documentId,
        totalChunks: 0,
        originalLength: content.length,

        arabicContent: {
          hasArabicText: chunkArabicAnalysis.hasArabicText,
          arabicRatio: chunkArabicAnalysis.arabicRatio,
          dialect: chunkArabicAnalysis.dialect,
          rtlHandled: true,
        },

        culturalContext: {
          professionalDomain: options.culturalContext?.professionalDomain,
          islamicContent: chunkArabicAnalysis.islamicContent,
          culturalReferences: chunkArabicAnalysis.culturalReferences,
          preservedStructure: [],
        },

        quality: {
          coherenceScore: 0.8, // Default synchronous score
          completenessScore: this.calculateCompletenessScore(content, options),
          culturalIntegrityScore: this.calculateCulturalIntegrityScore(
            content,
            chunkArabicAnalysis,
          ),
        },

        relationships: {
          previousChunkId:
            chunkIndex > 0
              ? `${documentId}_chunk_${chunkIndex - 1}`
              : undefined,
          nextChunkId: undefined,
          semanticSimilarity: undefined,
          contextualDependency: this.hasContextualDependency(content),
        },
      },
    };
  }

  // Helper methods
  private splitIntoSentences(content: string, hasArabic: boolean): string[] {
    if (hasArabic) {
      return content.split(/[.!?؟۔।]\s+/).filter((s) => s.trim());
    }
    return content.split(/[.!?]\s+/).filter((s) => s.trim());
  }

  private splitByMultipleDelimiters(
    content: string,
    delimiters: string[],
  ): string[] {
    let result = [content];

    for (const delimiter of delimiters) {
      result = result.flatMap((segment) => segment.split(delimiter));
    }

    return result.filter((segment) => segment.trim());
  }

  private identifyLanguageSegments(content: string): Array<{
    text: string;
    language: "arabic" | "english" | "mixed";
    start: number;
    end: number;
  }> {
    const segments: Array<{
      text: string;
      language: "arabic" | "english" | "mixed";
      start: number;
      end: number;
    }> = [];

    const words = content.split(/\s+/);
    let currentSegment = "";
    let currentLanguage: "arabic" | "english" | "mixed" = "english";
    let segmentStart = 0;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const isArabic = this.arabicTextRegex.test(word);
      const wordLanguage = isArabic ? "arabic" : "english";

      if (currentLanguage !== wordLanguage && currentSegment) {
        segments.push({
          text: currentSegment.trim(),
          language: currentLanguage,
          start: segmentStart,
          end: segmentStart + currentSegment.length,
        });

        currentSegment = word;
        currentLanguage = wordLanguage;
        segmentStart = content.indexOf(
          word,
          segmentStart + currentSegment.length,
        );
      } else {
        currentSegment += (currentSegment ? " " : "") + word;
        if (!currentSegment || currentSegment === word) {
          segmentStart = content.indexOf(word, segmentStart);
          currentLanguage = wordLanguage;
        }
      }
    }

    if (currentSegment.trim()) {
      segments.push({
        text: currentSegment.trim(),
        language: currentLanguage,
        start: segmentStart,
        end: segmentStart + currentSegment.length,
      });
    }

    return segments;
  }

  private isGoodBreakPoint(
    currentChunk: string,
    nextSegment: string,
    language: string,
  ): boolean {
    if (language === "arabic") {
      return /[.!?؟۔।]\s*$/.test(currentChunk.trim());
    }
    return /[.!?]\s*$/.test(currentChunk.trim());
  }

  private isGoodBreakCharacter(char: string): boolean {
    return /[\s.!?؟۔।,،]/.test(char);
  }

  private async chunkByBreakPoints(
    content: string,
    documentId: string,
    breakPoints: string[],
    options: ChunkingOptions,
    arabicAnalysis: any,
  ): Promise<DocumentChunk[]> {
    const chunks: DocumentChunk[] = [];
    let chunkIndex = 0;

    // Find all break points
    const breaks: { index: number; text: string }[] = [];

    for (const breakPoint of breakPoints) {
      let index = 0;
      while ((index = content.indexOf(breakPoint, index)) !== -1) {
        breaks.push({ index, text: breakPoint });
        index += breakPoint.length;
      }
    }

    breaks.sort((a, b) => a.index - b.index);

    let start = 0;
    let currentChunk = "";

    for (const breakInfo of breaks) {
      const segmentEnd = breakInfo.index + breakInfo.text.length;
      const segment = content.slice(start, segmentEnd);
      const potentialChunk = currentChunk + segment;

      if (potentialChunk.length > options.chunkSize && currentChunk) {
        const chunk = this.createChunkSync(
          currentChunk.trim(),
          documentId,
          content.indexOf(currentChunk.trim()),
          content.indexOf(currentChunk.trim()) + currentChunk.trim().length,
          chunkIndex++,
          options,
          arabicAnalysis,
        );
        chunks.push(chunk);

        currentChunk = segment;
        start = segmentEnd;
      } else {
        currentChunk = potentialChunk;
        start = segmentEnd;
      }
    }

    // Add remaining content
    if (start < content.length) {
      currentChunk += content.slice(start);
    }

    if (currentChunk.trim()) {
      const chunk = this.createChunkSync(
        currentChunk.trim(),
        documentId,
        content.indexOf(currentChunk.trim()),
        content.indexOf(currentChunk.trim()) + currentChunk.trim().length,
        chunkIndex,
        options,
        arabicAnalysis,
      );
      chunks.push(chunk);
    }

    return chunks;
  }

  private calculateCosineSimilarity(vec1: number[], vec2: number[]): number {
    if (vec1.length !== vec2.length) return 0;

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      norm1 += vec1[i] * vec1[i];
      norm2 += vec2[i] * vec2[i];
    }

    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  private async calculateCoherenceScore(content: string): Promise<number> {
    // Simplified coherence calculation
    const sentences = content.split(/[.!?؟۔।]/).filter((s) => s.trim());
    if (sentences.length < 2) return 1.0;

    // Basic coherence heuristics
    let score = 0.8; // Base score

    // Check for transition words and coherence markers
    const transitionWords = [
      "however",
      "therefore",
      "moreover",
      "furthermore",
      "consequently",
      "لكن",
      "لذلك",
      "بالإضافة",
      "علاوة على ذلك",
      "نتيجة لذلك",
    ];

    const hasTransitions = transitionWords.some((word) =>
      content.toLowerCase().includes(word.toLowerCase()),
    );

    if (hasTransitions) score += 0.1;

    return Math.min(score, 1.0);
  }

  private calculateCompletenessScore(
    content: string,
    options: ChunkingOptions,
  ): number {
    const targetSize = options.chunkSize;
    const actualSize = content.length;

    if (actualSize >= targetSize * 0.8) return 1.0;
    if (actualSize >= targetSize * 0.6) return 0.8;
    if (actualSize >= targetSize * 0.4) return 0.6;
    return 0.4;
  }

  private calculateCulturalIntegrityScore(
    content: string,
    arabicAnalysis: any,
  ): number {
    let score = 0.5; // Base score

    // Arabic text preservation
    if (arabicAnalysis.hasArabicText) {
      score += 0.2;

      // Dialect preservation
      if (arabicAnalysis.dialect !== "general") {
        score += 0.1;
      }
    }

    // Islamic content preservation
    if (arabicAnalysis.islamicContent) {
      score += 0.2;
    }

    return Math.min(score, 1.0);
  }

  private hasContextualDependency(content: string): boolean {
    const dependencyMarkers = [
      "as mentioned above",
      "as stated previously",
      "referring to",
      "كما ذكر أعلاه",
      "كما ذكر سابقاً",
      "بالإشارة إلى",
      "this",
      "these",
      "that",
      "those",
      "هذا",
      "هذه",
      "ذلك",
      "تلك",
    ];

    return dependencyMarkers.some((marker) =>
      content.toLowerCase().includes(marker.toLowerCase()),
    );
  }

  private async postProcessChunks(
    chunks: DocumentChunk[],
    options: ChunkingOptions,
  ): Promise<DocumentChunk[]> {
    // Update total chunks count
    chunks.forEach((chunk) => {
      chunk.metadata.totalChunks = chunks.length;
    });

    // Validate and improve chunk quality
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      // Ensure minimum quality thresholds
      if (chunk.metadata.quality.coherenceScore < 0.5) {
        // Try to improve chunk by extending boundaries
        if (i < chunks.length - 1) {
          const nextChunk = chunks[i + 1];
          const combinedContent =
            chunk.content + " " + nextChunk.content.substring(0, 50);
          if (combinedContent.length <= options.chunkSize * 1.2) {
            chunk.content = combinedContent;
            chunk.metadata.quality.coherenceScore = Math.min(
              chunk.metadata.quality.coherenceScore + 0.2,
              1.0,
            );
          }
        }
      }
    }

    return chunks;
  }

  private establishChunkRelationships(
    chunks: DocumentChunk[],
  ): DocumentChunk[] {
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      // Set next chunk ID
      if (i < chunks.length - 1) {
        chunk.metadata.relationships.nextChunkId = chunks[i + 1].id;
      }

      // Calculate semantic similarity with adjacent chunks
      if (i < chunks.length - 1) {
        // Simplified similarity calculation
        const commonWords = this.getCommonWords(
          chunk.content,
          chunks[i + 1].content,
        );
        chunk.metadata.relationships.semanticSimilarity =
          commonWords.length / 10;
      }
    }

    return chunks;
  }

  private getCommonWords(text1: string, text2: string): string[] {
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));
    return Array.from(words1).filter((word) => words2.has(word));
  }
}
