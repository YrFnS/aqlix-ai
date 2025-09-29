/**
 * Iraqi Professional Domain Document Tagging Service
 * Extracted and enhanced from anything-llm with Iraqi cultural context
 *
 * Features:
 * - Automatic professional domain detection (legal, medical, educational, business, engineering)
 * - Iraqi-specific terminology recognition and classification
 * - Cultural context tagging with Islamic and Arab perspectives
 * - Multi-language support (Arabic, English) with dialect awareness
 * - Hierarchical tagging system with confidence scoring
 * - Professional standards compliance validation
 */

export interface DomainTag {
  domain: "legal" | "medical" | "educational" | "business" | "engineering";
  subdomain?: string;
  confidence: number; // 0-1
  evidence: string[];
  culturalContext?: {
    islamicCompliance: boolean;
    culturalRelevance: number; // 0-1
    localizedTerminology: string[];
  };
}

export interface DocumentTagging {
  primaryDomain: DomainTag;
  secondaryDomains: DomainTag[];
  culturalTags: {
    islamicContext: boolean;
    arabicContent: boolean;
    iraqiDialect?: "baghdad" | "basra" | "mosul" | "general" | "standard";
    culturalReferences: string[];
  };
  professionalLevel: "basic" | "intermediate" | "advanced" | "expert";
  contentType: "formal" | "informal" | "academic" | "legal" | "technical";
  urgencyLevel?: "low" | "medium" | "high" | "critical";
  complianceFlags: {
    iraqiStandards: boolean;
    islamicEthics: boolean;
    professionalEthics: boolean;
    dataPrivacy: boolean;
  };
  qualityMetrics: {
    terminologyAccuracy: number; // 0-1
    culturalAppropriateness: number; // 0-1
    professionalRelevance: number; // 0-1
    overallQuality: number; // 0-1
  };
}

export class IraqiDomainTagger {
  private legalTerminology = {
    arabic: {
      core: [
        "قانون",
        "تشريع",
        "نظام",
        "لائحة",
        "مرسوم",
        "قرار",
        "أمر",
        "محكمة",
        "قاض",
        "قضية",
        "دعوى",
        "استئناف",
        "نقض",
        "تمييز",
        "عقد",
        "اتفاقية",
        "التزام",
        "حق",
        "واجب",
        "مسؤولية",
        "جريمة",
        "جزاء",
        "عقوبة",
        "غرامة",
        "سجن",
        "تعويض",
      ],
      specialized: [
        "الدستور العراقي",
        "القانون المدني",
        "قانون العقوبات",
        "قانون الأحوال الشخصية",
        "قانون العمل",
        "قانون التجارة",
        "قانون الشركات",
        "قانون الأوراق المالية",
        "محكمة التمييز",
        "محكمة الاستئناف",
        "محكمة البداءة",
        "محكمة الأحوال الشخصية",
      ],
      procedural: [
        "مرافعة",
        "استجواب",
        "شاهد",
        "خبير",
        "محامي",
        "وكيل",
        "صك",
        "سند",
        "وثيقة",
        "إقرار",
        "شهادة",
        "إعلان",
      ],
    },
    english: {
      core: [
        "law",
        "legislation",
        "statute",
        "regulation",
        "decree",
        "order",
        "court",
        "judge",
        "case",
        "lawsuit",
        "appeal",
        "cassation",
        "contract",
        "agreement",
        "obligation",
        "right",
        "duty",
        "liability",
        "crime",
        "penalty",
        "punishment",
        "fine",
        "imprisonment",
        "compensation",
      ],
      specialized: [
        "iraqi constitution",
        "civil law",
        "criminal law",
        "personal status law",
        "labor law",
        "commercial law",
        "companies law",
        "securities law",
        "court of cassation",
        "court of appeal",
        "court of first instance",
      ],
    },
  };

  private medicalTerminology = {
    arabic: {
      core: [
        "طب",
        "طبيب",
        "مريض",
        "مرض",
        "علاج",
        "دواء",
        "شفاء",
        "مستشفى",
        "عيادة",
        "قسم",
        "جراحة",
        "عملية",
        "فحص",
        "تشخيص",
        "أعراض",
        "علامات",
        "تحليل",
        "أشعة",
        "صورة",
      ],
      specialized: [
        "طب الباطنة",
        "جراحة العظام",
        "طب الأطفال",
        "طب النساء والتوليد",
        "طب القلب",
        "طب الأعصاب",
        "الطب النفسي",
        "طب الجلدية",
        "مستشفى بغداد",
        "المدينة الطبية",
        "مستشفى الكندي",
        "مستشفى اليرموك",
      ],
      islamic: [
        "طب نبوي",
        "علاج بالقرآن",
        "طب إسلامي",
        "أخلاق طبية إسلامية",
        "حلال طبي",
        "حرام طبي",
        "فتوى طبية",
      ],
    },
    english: {
      core: [
        "medicine",
        "doctor",
        "patient",
        "disease",
        "treatment",
        "medication",
        "cure",
        "hospital",
        "clinic",
        "department",
        "surgery",
        "operation",
        "examination",
        "diagnosis",
        "symptoms",
        "signs",
        "analysis",
        "radiology",
        "imaging",
      ],
      specialized: [
        "internal medicine",
        "orthopedics",
        "pediatrics",
        "gynecology",
        "cardiology",
        "neurology",
        "psychiatry",
        "dermatology",
      ],
    },
  };

  private educationalTerminology = {
    arabic: {
      core: [
        "تعليم",
        "تعلم",
        "مدرسة",
        "جامعة",
        "كلية",
        "قسم",
        "تخصص",
        "طالب",
        "طالبة",
        "معلم",
        "مدرس",
        "أستاذ",
        "باحث",
        "منهج",
        "مقرر",
        "درس",
        "محاضرة",
        "حصة",
        "فصل",
        "امتحان",
        "اختبار",
        "واجب",
        "بحث",
        "مشروع",
        "تقرير",
      ],
      specialized: [
        "وزارة التعليم العالي",
        "جامعة بغداد",
        "الجامعة المستنصرية",
        "جامعة البصرة",
        "المناهج العراقية",
        "التعليم الابتدائي",
        "التعليم الثانوي",
        "التعليم الجامعي",
      ],
      islamic: [
        "تربية إسلامية",
        "تعليم ديني",
        "مدرسة إسلامية",
        "منهج إسلامي",
        "أخلاق إسلامية",
        "قيم إسلامية",
      ],
    },
    english: {
      core: [
        "education",
        "learning",
        "school",
        "university",
        "college",
        "department",
        "student",
        "teacher",
        "professor",
        "researcher",
        "curriculum",
        "course",
        "lesson",
        "lecture",
        "class",
        "exam",
        "test",
        "assignment",
        "research",
        "project",
        "report",
      ],
      specialized: [
        "iraqi education system",
        "ministry of higher education",
        "university of baghdad",
        "al-mustansiriya university",
      ],
    },
  };

  private businessTerminology = {
    arabic: {
      core: [
        "عمل",
        "تجارة",
        "شركة",
        "مؤسسة",
        "مشروع",
        "استثمار",
        "ربح",
        "خسارة",
        "إيراد",
        "مصروف",
        "ميزانية",
        "حساب",
        "موظف",
        "مدير",
        "رئيس",
        "مسؤول",
        "عامل",
        "خبير",
      ],
      specialized: [
        "غرفة تجارة بغداد",
        "البورصة العراقية",
        "المصرف المركزي العراقي",
        "وزارة التجارة",
        "هيئة الاستثمار",
        "القطاع الخاص",
        "القطاع العام",
      ],
      islamic: [
        "تجارة حلال",
        "استثمار إسلامي",
        "مصرفية إسلامية",
        "تمويل إسلامي",
        "ربا محرم",
        "مضاربة",
        "مشاركة",
        "إجارة",
      ],
    },
    english: {
      core: [
        "business",
        "trade",
        "company",
        "enterprise",
        "project",
        "investment",
        "profit",
        "loss",
        "revenue",
        "expense",
        "budget",
        "account",
        "employee",
        "manager",
        "director",
        "executive",
        "worker",
        "expert",
      ],
      specialized: [
        "baghdad chamber of commerce",
        "iraq stock exchange",
        "central bank of iraq",
        "ministry of trade",
        "investment board",
      ],
    },
  };

  private engineeringTerminology = {
    arabic: {
      core: [
        "هندسة",
        "مهندس",
        "تصميم",
        "إنشاء",
        "بناء",
        "تشييد",
        "مواد",
        "خرسانة",
        "حديد",
        "صلب",
        "معدن",
        "بلاستيك",
        "قياس",
        "حساب",
        "تحليل",
        "اختبار",
        "فحص",
        "مراقبة",
      ],
      specialized: [
        "هندسة مدنية",
        "هندسة معمارية",
        "هندسة كهربائية",
        "هندسة ميكانيكية",
        "هندسة كيميائية",
        "هندسة بترول",
        "هندسة نفط",
        "هندسة الحاسوب",
        "نقابة المهندسين العراقيين",
        "جامعة التكنولوجيا",
      ],
      standards: [
        "المواصفات العراقية",
        "كود البناء العراقي",
        "معايير السلامة",
        "معايير البيئة",
        "معايير الجودة",
      ],
    },
    english: {
      core: [
        "engineering",
        "engineer",
        "design",
        "construction",
        "building",
        "materials",
        "concrete",
        "steel",
        "metal",
        "plastic",
        "measurement",
        "calculation",
        "analysis",
        "testing",
        "inspection",
      ],
      specialized: [
        "civil engineering",
        "architecture",
        "electrical engineering",
        "mechanical engineering",
        "chemical engineering",
        "petroleum engineering",
        "computer engineering",
        "iraqi engineers syndicate",
        "university of technology",
      ],
    },
  };

  private culturalMarkers = {
    islamic: [
      "الله",
      "محمد",
      "الإسلام",
      "القرآن",
      "السنة",
      "الحديث",
      "الصلاة",
      "إن شاء الله",
      "بسم الله",
      "الحمد لله",
      "سبحان الله",
      "Allah",
      "Muhammad",
      "Islam",
      "Quran",
      "Sunnah",
      "Hadith",
      "Prayer",
      "Insha Allah",
      "Bismillah",
      "Alhamdulillah",
      "Subhan Allah",
    ],
    iraqi: [
      "العراق",
      "العراقي",
      "بغداد",
      "البصرة",
      "الموصل",
      "النجف",
      "كربلاء",
      "Iraq",
      "Iraqi",
      "Baghdad",
      "Basra",
      "Mosul",
      "Najaf",
      "Karbala",
    ],
    cultural: [
      "تقاليد",
      "عادات",
      "تراث",
      "ثقافة",
      "حضارة",
      "تاريخ",
      "traditions",
      "customs",
      "heritage",
      "culture",
      "civilization",
      "history",
    ],
  };

  /**
   * Tag document with professional domain and cultural context
   */
  async tagDocument(
    content: string,
    metadata?: {
      fileName?: string;
      fileType?: string;
      source?: string;
      author?: string;
    },
  ): Promise<DocumentTagging> {
    try {
      // Detect primary and secondary domains
      const domainScores = await this.calculateDomainScores(content);
      const primaryDomain = this.selectPrimaryDomain(domainScores);
      const secondaryDomains = this.selectSecondaryDomains(
        domainScores,
        primaryDomain,
      );

      // Analyze cultural context
      const culturalTags = this.analyzeCulturalContext(content);

      // Determine professional level
      const professionalLevel = this.determineProfessionalLevel(
        content,
        primaryDomain,
      );

      // Classify content type
      const contentType = this.classifyContentType(content, metadata);

      // Detect urgency level if applicable
      const urgencyLevel = this.detectUrgencyLevel(content, primaryDomain);

      // Check compliance flags
      const complianceFlags = await this.checkCompliance(
        content,
        primaryDomain,
      );

      // Calculate quality metrics
      const qualityMetrics = this.calculateQualityMetrics(
        content,
        primaryDomain,
        culturalTags,
      );

      return {
        primaryDomain,
        secondaryDomains,
        culturalTags,
        professionalLevel,
        contentType,
        urgencyLevel,
        complianceFlags,
        qualityMetrics,
      };
    } catch (error) {
      console.error("Error tagging document:", error);
      throw new Error("Failed to tag document");
    }
  }

  /**
   * Calculate domain scores for content
   */
  private async calculateDomainScores(
    content: string,
  ): Promise<Record<string, number>> {
    const lowerContent = content.toLowerCase();
    const scores: Record<string, number> = {
      legal: 0,
      medical: 0,
      educational: 0,
      business: 0,
      engineering: 0,
    };

    // Legal domain scoring
    scores.legal += this.scoreTerminologyMatch(
      lowerContent,
      this.legalTerminology,
    );

    // Medical domain scoring
    scores.medical += this.scoreTerminologyMatch(
      lowerContent,
      this.medicalTerminology,
    );

    // Educational domain scoring
    scores.educational += this.scoreTerminologyMatch(
      lowerContent,
      this.educationalTerminology,
    );

    // Business domain scoring
    scores.business += this.scoreTerminologyMatch(
      lowerContent,
      this.businessTerminology,
    );

    // Engineering domain scoring
    scores.engineering += this.scoreTerminologyMatch(
      lowerContent,
      this.engineeringTerminology,
    );

    // Normalize scores
    const maxScore = Math.max(...Object.values(scores));
    if (maxScore > 0) {
      Object.keys(scores).forEach((domain) => {
        scores[domain] = scores[domain] / maxScore;
      });
    }

    return scores;
  }

  /**
   * Score terminology matches for a domain
   */
  private scoreTerminologyMatch(content: string, terminology: any): number {
    let score = 0;

    // Core terminology (weight: 1)
    terminology.arabic.core.forEach((term: string) => {
      if (content.includes(term.toLowerCase())) {
        score += 1;
      }
    });

    terminology.english.core.forEach((term: string) => {
      if (content.includes(term.toLowerCase())) {
        score += 1;
      }
    });

    // Specialized terminology (weight: 2)
    terminology.arabic.specialized?.forEach((term: string) => {
      if (content.includes(term.toLowerCase())) {
        score += 2;
      }
    });

    terminology.english.specialized?.forEach((term: string) => {
      if (content.includes(term.toLowerCase())) {
        score += 2;
      }
    });

    // Islamic/cultural terminology (weight: 1.5)
    terminology.arabic.islamic?.forEach((term: string) => {
      if (content.includes(term.toLowerCase())) {
        score += 1.5;
      }
    });

    // Standards terminology (weight: 1.5)
    terminology.arabic.standards?.forEach((term: string) => {
      if (content.includes(term.toLowerCase())) {
        score += 1.5;
      }
    });

    return score;
  }

  /**
   * Select primary domain based on scores
   */
  private selectPrimaryDomain(scores: Record<string, number>): DomainTag {
    const sortedDomains = Object.entries(scores).sort(([, a], [, b]) => b - a);

    const [domain, confidence] = sortedDomains[0];
    const evidence = this.extractEvidence(domain as any);

    return {
      domain: domain as any,
      confidence: Math.min(confidence, 1),
      evidence,
      culturalContext: {
        islamicCompliance: true, // Will be refined in compliance check
        culturalRelevance: 0.8, // Base relevance
        localizedTerminology: [],
      },
    };
  }

  /**
   * Select secondary domains
   */
  private selectSecondaryDomains(
    scores: Record<string, number>,
    primaryDomain: DomainTag,
  ): DomainTag[] {
    return Object.entries(scores)
      .filter(
        ([domain, score]) => domain !== primaryDomain.domain && score > 0.3,
      )
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([domain, confidence]) => ({
        domain: domain as any,
        confidence: Math.min(confidence, 1),
        evidence: this.extractEvidence(domain as any),
        culturalContext: {
          islamicCompliance: true,
          culturalRelevance: 0.6,
          localizedTerminology: [],
        },
      }));
  }

  /**
   * Analyze cultural context of content
   */
  private analyzeCulturalContext(
    content: string,
  ): DocumentTagging["culturalTags"] {
    const lowerContent = content.toLowerCase();

    // Detect Islamic context
    const islamicContext = this.culturalMarkers.islamic.some((marker) =>
      lowerContent.includes(marker.toLowerCase()),
    );

    // Detect Arabic content
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
    const arabicContent = arabicRegex.test(content);

    // Detect Iraqi dialect
    let iraqiDialect:
      | "baghdad"
      | "basra"
      | "mosul"
      | "general"
      | "standard"
      | undefined;
    const dialectMarkers = {
      baghdad: ["شلونك", "وين", "شكو ماكو"],
      basra: ["شكد", "چان"],
      mosul: ["شونك", "وينن"],
      general: ["شلون", "شكو"],
    };

    for (const [dialect, markers] of Object.entries(dialectMarkers)) {
      if (markers.some((marker) => lowerContent.includes(marker))) {
        iraqiDialect = dialect as any;
        break;
      }
    }

    // Extract cultural references
    const culturalReferences = [
      ...this.culturalMarkers.islamic,
      ...this.culturalMarkers.iraqi,
      ...this.culturalMarkers.cultural,
    ].filter((ref) => lowerContent.includes(ref.toLowerCase()));

    return {
      islamicContext,
      arabicContent,
      iraqiDialect,
      culturalReferences,
    };
  }

  /**
   * Determine professional level of content
   */
  private determineProfessionalLevel(
    content: string,
    primaryDomain: DomainTag,
  ): "basic" | "intermediate" | "advanced" | "expert" {
    const complexity = this.analyzeComplexity(content);
    const terminology = this.countProfessionalTerminology(
      content,
      primaryDomain.domain,
    );

    if (complexity > 0.8 && terminology > 20) return "expert";
    if (complexity > 0.6 && terminology > 15) return "advanced";
    if (complexity > 0.4 && terminology > 10) return "intermediate";
    return "basic";
  }

  /**
   * Classify content type
   */
  private classifyContentType(
    content: string,
    metadata?: any,
  ): "formal" | "informal" | "academic" | "legal" | "technical" {
    const lowerContent = content.toLowerCase();

    // Legal document indicators
    if (
      lowerContent.includes("whereas") ||
      lowerContent.includes("بموجب") ||
      lowerContent.includes("article") ||
      lowerContent.includes("مادة")
    ) {
      return "legal";
    }

    // Academic indicators
    if (
      lowerContent.includes("abstract") ||
      lowerContent.includes("conclusion") ||
      lowerContent.includes("ملخص") ||
      lowerContent.includes("خاتمة")
    ) {
      return "academic";
    }

    // Technical indicators
    if (
      lowerContent.includes("specification") ||
      lowerContent.includes("procedure") ||
      lowerContent.includes("مواصفة") ||
      lowerContent.includes("إجراء")
    ) {
      return "technical";
    }

    // Formal vs informal
    const formalIndicators = [
      "sir",
      "madam",
      "respectfully",
      "المحترم",
      "حضرة",
    ];
    const informalIndicators = ["hey", "hi", "مرحبا", "أهلا"];

    if (
      formalIndicators.some((indicator) => lowerContent.includes(indicator))
    ) {
      return "formal";
    }

    if (
      informalIndicators.some((indicator) => lowerContent.includes(indicator))
    ) {
      return "informal";
    }

    return "formal"; // Default
  }

  /**
   * Detect urgency level
   */
  private detectUrgencyLevel(
    content: string,
    primaryDomain: DomainTag,
  ): "low" | "medium" | "high" | "critical" | undefined {
    const lowerContent = content.toLowerCase();

    const urgencyMarkers = {
      critical: [
        "emergency",
        "critical",
        "urgent",
        "immediate",
        "طارئ",
        "عاجل",
        "فوري",
      ],
      high: ["important", "priority", "asap", "مهم", "أولوية", "بأسرع وقت"],
      medium: ["soon", "timely", "قريباً", "في الوقت المناسب"],
      low: ["when possible", "at convenience", "عند الإمكان", "حسب الظروف"],
    };

    for (const [level, markers] of Object.entries(urgencyMarkers)) {
      if (markers.some((marker) => lowerContent.includes(marker))) {
        return level as any;
      }
    }

    return undefined;
  }

  /**
   * Check compliance flags
   */
  private async checkCompliance(
    content: string,
    primaryDomain: DomainTag,
  ): Promise<DocumentTagging["complianceFlags"]> {
    // This would integrate with cultural content filter
    return {
      iraqiStandards: true, // Placeholder - would check against Iraqi standards
      islamicEthics: !this.containsIslamicViolations(content),
      professionalEthics: this.checksProfessionalEthics(
        content,
        primaryDomain.domain,
      ),
      dataPrivacy: this.checksDataPrivacy(content),
    };
  }

  /**
   * Calculate quality metrics
   */
  private calculateQualityMetrics(
    content: string,
    primaryDomain: DomainTag,
    culturalTags: DocumentTagging["culturalTags"],
  ): DocumentTagging["qualityMetrics"] {
    const terminologyAccuracy = this.calculateTerminologyAccuracy(
      content,
      primaryDomain.domain,
    );
    const culturalAppropriateness = this.calculateCulturalAppropriateness(
      content,
      culturalTags,
    );
    const professionalRelevance = primaryDomain.confidence;

    const overallQuality =
      (terminologyAccuracy + culturalAppropriateness + professionalRelevance) /
      3;

    return {
      terminologyAccuracy,
      culturalAppropriateness,
      professionalRelevance,
      overallQuality,
    };
  }

  // Helper methods
  private extractEvidence(domain: string): string[] {
    // Placeholder - would extract actual evidence from content
    return [
      `Professional terminology related to ${domain}`,
      `Domain-specific patterns detected`,
    ];
  }

  private analyzeComplexity(content: string): number {
    const sentences = content.split(/[.!?؟۔।]/).filter((s) => s.trim());
    const words = content.split(/\s+/);
    const avgWordsPerSentence = words.length / sentences.length;

    // Simple complexity heuristic
    if (avgWordsPerSentence > 25) return 0.9;
    if (avgWordsPerSentence > 20) return 0.7;
    if (avgWordsPerSentence > 15) return 0.5;
    return 0.3;
  }

  private countProfessionalTerminology(
    content: string,
    domain: string,
  ): number {
    const lowerContent = content.toLowerCase();
    let count = 0;

    const terminology = this.getTerminologyForDomain(domain);
    if (terminology) {
      terminology.arabic.core.forEach((term) => {
        if (lowerContent.includes(term.toLowerCase())) count++;
      });
      terminology.english.core.forEach((term) => {
        if (lowerContent.includes(term.toLowerCase())) count++;
      });
    }

    return count;
  }

  private containsIslamicViolations(content: string): boolean {
    const violations = ["alcohol", "gambling", "خمر", "قمار"];
    return violations.some((violation) =>
      content.toLowerCase().includes(violation),
    );
  }

  private checksProfessionalEthics(content: string, domain: string): boolean {
    // Placeholder - would check professional ethics based on domain
    return true;
  }

  private checksDataPrivacy(content: string): boolean {
    const sensitivePatterns = [
      /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/, // Credit card
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN pattern
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
    ];

    return !sensitivePatterns.some((pattern) => pattern.test(content));
  }

  private calculateTerminologyAccuracy(
    content: string,
    domain: string,
  ): number {
    // Placeholder - would calculate terminology accuracy
    return 0.8;
  }

  private calculateCulturalAppropriateness(
    content: string,
    culturalTags: any,
  ): number {
    let score = 0.7; // Base score

    if (culturalTags.islamicContext) score += 0.1;
    if (culturalTags.culturalReferences.length > 0) score += 0.1;
    if (culturalTags.arabicContent) score += 0.1;

    return Math.min(score, 1.0);
  }

  private getTerminologyForDomain(domain: string): any {
    switch (domain) {
      case "legal":
        return this.legalTerminology;
      case "medical":
        return this.medicalTerminology;
      case "educational":
        return this.educationalTerminology;
      case "business":
        return this.businessTerminology;
      case "engineering":
        return this.engineeringTerminology;
      default:
        return null;
    }
  }

  /**
   * Get tagging statistics
   */
  getTaggingStats(): {
    supportedDomains: string[];
    culturalMarkers: number;
    terminologyCount: Record<string, number>;
  } {
    return {
      supportedDomains: [
        "legal",
        "medical",
        "educational",
        "business",
        "engineering",
      ],
      culturalMarkers:
        this.culturalMarkers.islamic.length +
        this.culturalMarkers.iraqi.length +
        this.culturalMarkers.cultural.length,
      terminologyCount: {
        legal:
          this.legalTerminology.arabic.core.length +
          this.legalTerminology.english.core.length,
        medical:
          this.medicalTerminology.arabic.core.length +
          this.medicalTerminology.english.core.length,
        educational:
          this.educationalTerminology.arabic.core.length +
          this.educationalTerminology.english.core.length,
        business:
          this.businessTerminology.arabic.core.length +
          this.businessTerminology.english.core.length,
        engineering:
          this.engineeringTerminology.arabic.core.length +
          this.engineeringTerminology.english.core.length,
      },
    };
  }
}
