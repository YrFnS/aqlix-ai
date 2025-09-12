/**
 * Arabic-First Workspace Organization Service
 * Comprehensive Arabic workspace naming, organization, and cultural management system
 * 
 * Features:
 * - Arabic-first workspace naming with automatic RTL support
 * - Iraqi dialect recognition and transliteration
 * - Professional Arabic terminology for all domains
 * - Cultural workspace hierarchies and organization patterns
 * - Mixed Arabic-English content handling
 * - Government and religious naming conventions
 * - Automatic workspace categorization based on Arabic content
 */

import {
  ProfessionalDomain,
  IraqiGovernorate,
  getDomainConfig,
} from '../config/professional-domains.js';
import {
  IraqiWorkspace,
  IraqiDialect,
  WorkspaceVisibility,
  CulturalComplianceScore,
} from '../types/workspace.types.js';

export type ArabicNameCategory = 
  | 'professional' 
  | 'religious' 
  | 'government' 
  | 'educational' 
  | 'commercial' 
  | 'cultural' 
  | 'community';

export type ArabicNamingConvention = 
  | 'formal' 
  | 'traditional' 
  | 'modern' 
  | 'religious' 
  | 'government' 
  | 'academic' 
  | 'commercial';

export interface ArabicWorkspaceName {
  primary: string;           // Primary Arabic name
  secondary?: string;        // Secondary Arabic name (alternate)
  english: string;           // English translation/transliteration
  transliteration: string;   // Latin script transliteration
  category: ArabicNameCategory;
  convention: ArabicNamingConvention;
  dialect: IraqiDialect;
  governorate?: IraqiGovernorate;
  culturalContext: {
    religiousSignificance: boolean;
    historicalReference: boolean;
    professionalTerm: boolean;
    governmentOfficial: boolean;
  };
  rtlFormatted: string;      // RTL-formatted display version
  slug: string;              // URL-safe slug
  semanticTags: string[];    // Semantic meaning tags
}

export interface WorkspaceOrganizationHierarchy {
  level: number;
  nameAr: string;
  nameEn: string;
  type: 'ministry' | 'directorate' | 'department' | 'division' | 'unit' | 'team';
  parentId?: string;
  children: string[];
  governorate?: IraqiGovernorate;
  domain: ProfessionalDomain;
  culturalRank: number; // 1-10 cultural importance
}

export interface ArabicContentAnalysis {
  language: 'ar' | 'en' | 'mixed' | 'ku';
  script: 'arabic' | 'latin' | 'mixed';
  dialect: IraqiDialect;
  formalityLevel: 'very_formal' | 'formal' | 'standard' | 'informal' | 'colloquial';
  culturalReferences: string[];
  professionalTerms: string[];
  religiousContent: boolean;
  governmentTerms: boolean;
  readingDirection: 'rtl' | 'ltr' | 'mixed';
  confidence: number; // 0-1 analysis confidence
}

export interface WorkspaceCategorization {
  primaryCategory: ArabicNameCategory;
  secondaryCategories: ArabicNameCategory[];
  culturalClassification: 'religious' | 'secular' | 'mixed' | 'government';
  professionalLevel: 'entry' | 'professional' | 'expert' | 'authority';
  publicVisibility: 'public' | 'restricted' | 'private' | 'classified';
  culturalSensitivity: 'low' | 'medium' | 'high' | 'maximum';
  complianceRequirements: string[];
}

/**
 * Professional Arabic terminology dictionaries for different domains
 */
export const ARABIC_PROFESSIONAL_TERMINOLOGY = {
  legal: {
    // Legal terms in Iraqi Arabic
    law: 'قانون',
    lawyer: 'محامي',
    court: 'محكمة',
    judge: 'قاضي',
    case: 'قضية',
    contract: 'عقد',
    legislation: 'تشريع',
    justice: 'عدالة',
    prosecution: 'ادعاء عام',
    defense: 'دفاع',
    verdict: 'حكم',
    appeal: 'استئناف',
    evidence: 'دليل',
    testimony: 'شهادة',
    jurisdiction: 'اختصاص قضائي',
    legal_office: 'مكتب قانوني',
    law_firm: 'مكتب المحاماة',
    legal_consultant: 'مستشار قانوني',
    notary: 'كاتب عدل',
    legal_advisor: 'مستشار قانوني',
  },
  medical: {
    // Medical terms in Iraqi Arabic
    doctor: 'طبيب',
    hospital: 'مستشفى',
    clinic: 'عيادة',
    patient: 'مريض',
    medicine: 'دواء',
    treatment: 'علاج',
    diagnosis: 'تشخيص',
    surgery: 'جراحة',
    nurse: 'ممرض',
    pharmacy: 'صيدلية',
    health: 'صحة',
    medical_center: 'مركز طبي',
    emergency: 'طوارئ',
    specialist: 'أخصائي',
    consultation: 'استشارة طبية',
    prescription: 'وصفة طبية',
    medical_record: 'سجل طبي',
    health_insurance: 'تأمين صحي',
    medical_examination: 'فحص طبي',
    medical_report: 'تقرير طبي',
  },
  educational: {
    // Educational terms in Iraqi Arabic
    school: 'مدرسة',
    university: 'جامعة',
    college: 'كلية',
    teacher: 'مدرس',
    professor: 'أستاذ',
    student: 'طالب',
    education: 'تعليم',
    curriculum: 'منهج',
    degree: 'شهادة',
    diploma: 'دبلوم',
    examination: 'امتحان',
    classroom: 'صف دراسي',
    library: 'مكتبة',
    research: 'بحث',
    academic: 'أكاديمي',
    educational_institution: 'مؤسسة تعليمية',
    training_center: 'مركز تدريب',
    educational_program: 'برنامج تعليمي',
    academic_year: 'سنة دراسية',
    educational_ministry: 'وزارة التربية',
  },
  business: {
    // Business terms in Iraqi Arabic
    company: 'شركة',
    business: 'أعمال',
    trade: 'تجارة',
    commerce: 'تجارة',
    market: 'سوق',
    investment: 'استثمار',
    profit: 'ربح',
    loss: 'خسارة',
    contract: 'عقد',
    agreement: 'اتفاقية',
    partnership: 'شراكة',
    corporation: 'مؤسسة',
    enterprise: 'مشروع',
    industry: 'صناعة',
    manufacturing: 'تصنيع',
    export: 'تصدير',
    import: 'استيراد',
    wholesale: 'جملة',
    retail: 'مفرد',
    commercial_center: 'مركز تجاري',
  },
  government: {
    // Government terms in Iraqi Arabic
    ministry: 'وزارة',
    minister: 'وزير',
    government: 'حكومة',
    parliament: 'برلمان',
    council: 'مجلس',
    municipality: 'بلدية',
    governorate: 'محافظة',
    governor: 'محافظ',
    mayor: 'رئيس بلدية',
    administration: 'إدارة',
    department: 'قسم',
    directorate: 'مديرية',
    office: 'مكتب',
    authority: 'سلطة',
    commission: 'هيئة',
    agency: 'وكالة',
    bureau: 'مكتب',
    secretariat: 'أمانة',
    cabinet: 'مجلس الوزراء',
    public_service: 'خدمة عامة',
  },
  religious: {
    // Religious terms in Iraqi Arabic
    mosque: 'مسجد',
    imam: 'إمام',
    scholar: 'عالم',
    cleric: 'رجل دين',
    prayer: 'صلاة',
    quran: 'قرآن',
    hadith: 'حديث',
    islamic_studies: 'دراسات إسلامية',
    religious_education: 'تعليم ديني',
    fatwa: 'فتوى',
    jurisprudence: 'فقه',
    theology: 'علم الكلام',
    islamic_center: 'مركز إسلامي',
    religious_council: 'مجلس ديني',
    islamic_foundation: 'مؤسسة إسلامية',
    religious_authority: 'مرجعية دينية',
    islamic_school: 'مدرسة إسلامية',
    religious_institute: 'معهد ديني',
    islamic_university: 'جامعة إسلامية',
    waqf: 'وقف',
  },
};

/**
 * Iraqi governorate names in Arabic with cultural context
 */
export const IRAQI_GOVERNORATES_ARABIC = {
  baghdad: {
    name: 'بغداد',
    culturalTitle: 'دار السلام', // House of Peace
    historicalName: 'مدينة السلام', // City of Peace
    nickname: 'أم الدنيا', // Mother of the World
    type: 'capital',
  },
  basra: {
    name: 'البصرة',
    culturalTitle: 'فيحاء العراق', // The Spacious of Iraq
    historicalName: 'البصرة الفيحاء', // The Spacious Basra
    nickname: 'مدينة النخيل', // City of Palm Trees
    type: 'major_city',
  },
  nineveh: {
    name: 'نينوى',
    culturalTitle: 'أم الربيعين', // Mother of Two Springs
    historicalName: 'نينوى التاريخية', // Historical Nineveh
    nickname: 'الحدباء', // The Hunchbacked
    type: 'historical',
  },
  arbil: {
    name: 'أربيل',
    culturalTitle: 'هولير', // Kurdish name
    historicalName: 'أربيل الحضارة', // Erbil of Civilization
    nickname: 'قلعة كردستان', // Fortress of Kurdistan
    type: 'regional_capital',
  },
  najaf: {
    name: 'النجف',
    culturalTitle: 'النجف الأشرف', // The Noble Najaf
    historicalName: 'وادي السلام', // Valley of Peace
    nickname: 'مدينة الإمام علي', // City of Imam Ali
    type: 'religious_center',
  },
  karbala: {
    name: 'كربلاء',
    culturalTitle: 'كربلاء المقدسة', // Holy Karbala
    historicalName: 'أرض الطف', // Land of Taff
    nickname: 'مدينة الإمام الحسين', // City of Imam Hussein
    type: 'religious_center',
  },
  // ... other governorates
};

export class ArabicWorkspaceOrganizerService {
  private professionalTerminology = ARABIC_PROFESSIONAL_TERMINOLOGY;
  private governorateNames = IRAQI_GOVERNORATES_ARABIC;

  /**
   * Generate culturally appropriate Arabic workspace name
   */
  public generateArabicWorkspaceName(
    baseName: string,
    domain: ProfessionalDomain,
    convention: ArabicNamingConvention = 'professional',
    governorate?: IraqiGovernorate,
    dialect: IraqiDialect = 'general'
  ): ArabicWorkspaceName {
    // Analyze the base name
    const analysis = this.analyzeArabicContent(baseName);
    
    // Generate primary Arabic name based on domain and convention
    const primaryName = this.constructProfessionalArabicName(baseName, domain, convention, governorate);
    
    // Create English translation
    const englishName = this.translateToEnglish(primaryName, domain);
    
    // Generate transliteration
    const transliteration = this.transliterateArabic(primaryName);
    
    // Format for RTL display
    const rtlFormatted = this.formatForRTL(primaryName);
    
    // Generate URL-safe slug
    const slug = this.generateArabicSlug(primaryName, englishName);
    
    // Extract semantic tags
    const semanticTags = this.extractSemanticTags(primaryName, domain, analysis);
    
    return {
      primary: primaryName,
      english: englishName,
      transliteration,
      category: this.categorizeWorkspaceName(primaryName, domain),
      convention,
      dialect,
      governorate,
      culturalContext: {
        religiousSignificance: this.hasReligiousSignificance(primaryName),
        historicalReference: this.hasHistoricalReference(primaryName),
        professionalTerm: this.containsProfessionalTerms(primaryName, domain),
        governmentOfficial: this.isGovernmentOfficial(primaryName),
      },
      rtlFormatted,
      slug,
      semanticTags,
    };
  }

  /**
   * Construct professional Arabic name based on domain and convention
   */
  private constructProfessionalArabicName(
    baseName: string,
    domain: ProfessionalDomain,
    convention: ArabicNamingConvention,
    governorate?: IraqiGovernorate
  ): string {
    const domainTerms = this.professionalTerminology[domain];
    const analysis = this.analyzeArabicContent(baseName);
    
    // If already Arabic, enhance with professional terms
    if (analysis.language === 'ar') {
      return this.enhanceArabicName(baseName, domain, convention, governorate);
    }
    
    // Convert English to Arabic with professional context
    let arabicName = this.convertToArabic(baseName, domain);
    
    // Apply naming convention
    switch (convention) {
      case 'formal':
        arabicName = this.applyFormalConvention(arabicName, domain, governorate);
        break;
      case 'traditional':
        arabicName = this.applyTraditionalConvention(arabicName, domain);
        break;
      case 'religious':
        arabicName = this.applyReligiousConvention(arabicName, domain);
        break;
      case 'government':
        arabicName = this.applyGovernmentConvention(arabicName, domain, governorate);
        break;
      case 'academic':
        arabicName = this.applyAcademicConvention(arabicName, domain);
        break;
      case 'commercial':
        arabicName = this.applyCommercialConvention(arabicName, domain);
        break;
      default:
        arabicName = this.applyModernConvention(arabicName, domain);
    }
    
    return arabicName;
  }

  /**
   * Apply formal naming convention
   */
  private applyFormalConvention(
    name: string,
    domain: ProfessionalDomain,
    governorate?: IraqiGovernorate
  ): string {
    const domainTerms = this.professionalTerminology[domain];
    
    switch (domain) {
      case 'legal':
        return `${domainTerms.legal_office} ${name}`;
      case 'medical':
        return `${domainTerms.medical_center} ${name}`;
      case 'educational':
        return `${domainTerms.educational_institution} ${name}`;
      case 'business':
        return `${domainTerms.company} ${name}`;
      case 'government':
        if (governorate) {
          const govName = this.governorateNames[governorate]?.name || governorate;
          return `${domainTerms.directorate} ${name} - ${govName}`;
        }
        return `${domainTerms.directorate} ${name}`;
      case 'religious':
        return `${domainTerms.islamic_center} ${name}`;
      default:
        return `مؤسسة ${name}`;
    }
  }

  /**
   * Apply traditional naming convention
   */
  private applyTraditionalConvention(name: string, domain: ProfessionalDomain): string {
    const domainTerms = this.professionalTerminology[domain];
    
    switch (domain) {
      case 'legal':
        return `دار العدالة ${name}`;
      case 'medical':
        return `دار الشفاء ${name}`;
      case 'educational':
        return `دار العلم ${name}`;
      case 'business':
        return `دار التجارة ${name}`;
      case 'religious':
        return `دار الإسلام ${name}`;
      default:
        return `دار ${name}`;
    }
  }

  /**
   * Apply religious naming convention
   */
  private applyReligiousConvention(name: string, domain: ProfessionalDomain): string {
    const prefix = 'بسم الله - ';
    const domainTerms = this.professionalTerminology[domain];
    
    switch (domain) {
      case 'legal':
        return `${prefix}${domainTerms.legal_office} ${name} الإسلامي`;
      case 'medical':
        return `${prefix}${domainTerms.medical_center} ${name} الإسلامي`;
      case 'educational':
        return `${prefix}${domainTerms.islamic_school} ${name}`;
      case 'religious':
        return `${prefix}${domainTerms.islamic_center} ${name}`;
      default:
        return `${prefix}مؤسسة ${name} الإسلامية`;
    }
  }

  /**
   * Apply government naming convention
   */
  private applyGovernmentConvention(
    name: string,
    domain: ProfessionalDomain,
    governorate?: IraqiGovernorate
  ): string {
    const domainTerms = this.professionalTerminology[domain];
    const republicPrefix = 'جمهورية العراق - ';
    
    let governmentTitle = '';
    if (governorate) {
      const govData = this.governorateNames[governorate];
      governmentTitle = govData ? `${domainTerms.directorate} ${govData.name} - ` : '';
    }
    
    switch (domain) {
      case 'legal':
        return `${republicPrefix}${governmentTitle}${domainTerms.legal_office} ${name}`;
      case 'medical':
        return `${republicPrefix}${governmentTitle}${domainTerms.medical_center} ${name}`;
      case 'educational':
        return `${republicPrefix}${governmentTitle}${domainTerms.educational_institution} ${name}`;
      case 'government':
        return `${republicPrefix}${governmentTitle}${domainTerms.directorate} ${name}`;
      default:
        return `${republicPrefix}${governmentTitle}مؤسسة ${name}`;
    }
  }

  /**
   * Apply academic naming convention
   */
  private applyAcademicConvention(name: string, domain: ProfessionalDomain): string {
    const domainTerms = this.professionalTerminology[domain];
    
    switch (domain) {
      case 'educational':
        return `${domainTerms.university} ${name} للدراسات العليا`;
      case 'legal':
        return `${domainTerms.legal_office} ${name} الأكاديمي`;
      case 'medical':
        return `${domainTerms.medical_center} ${name} الأكاديمي`;
      case 'religious':
        return `${domainTerms.islamic_university} ${name}`;
      default:
        return `معهد ${name} الأكاديمي`;
    }
  }

  /**
   * Apply commercial naming convention
   */
  private applyCommercialConvention(name: string, domain: ProfessionalDomain): string {
    const domainTerms = this.professionalTerminology[domain];
    
    switch (domain) {
      case 'business':
        return `${domainTerms.company} ${name} التجارية`;
      case 'medical':
        return `${domainTerms.clinic} ${name} الخاصة`;
      case 'educational':
        return `${domainTerms.training_center} ${name} التجاري`;
      default:
        return `مؤسسة ${name} التجارية`;
    }
  }

  /**
   * Apply modern naming convention
   */
  private applyModernConvention(name: string, domain: ProfessionalDomain): string {
    const domainTerms = this.professionalTerminology[domain];
    
    switch (domain) {
      case 'legal':
        return `مجموعة ${name} القانونية`;
      case 'medical':
        return `مجموعة ${name} الطبية`;
      case 'educational':
        return `مجموعة ${name} التعليمية`;
      case 'business':
        return `مجموعة ${name} التجارية`;
      case 'government':
        return `مجموعة ${name} الحكومية`;
      case 'religious':
        return `مجموعة ${name} الإسلامية`;
      default:
        return `مجموعة ${name}`;
    }
  }

  /**
   * Enhance existing Arabic name with professional context
   */
  private enhanceArabicName(
    arabicName: string,
    domain: ProfessionalDomain,
    convention: ArabicNamingConvention,
    governorate?: IraqiGovernorate
  ): string {
    // Check if name already has professional context
    if (this.containsProfessionalTerms(arabicName, domain)) {
      return arabicName;
    }
    
    // Add appropriate professional prefix/suffix
    return this.addProfessionalContext(arabicName, domain, convention, governorate);
  }

  /**
   * Convert English name to Arabic with domain context
   */
  private convertToArabic(englishName: string, domain: ProfessionalDomain): string {
    // This would typically use a translation service or dictionary
    // For now, we'll use a simplified approach with common terms
    
    const commonTranslations = {
      // Legal terms
      'law': 'قانون',
      'legal': 'قانوني',
      'attorney': 'محامي',
      'firm': 'مكتب',
      'associates': 'وشركاه',
      'partners': 'شركاء',
      'justice': 'عدالة',
      'advocate': 'محامي',
      
      // Medical terms
      'medical': 'طبي',
      'health': 'صحة',
      'clinic': 'عيادة',
      'hospital': 'مستشفى',
      'care': 'رعاية',
      'center': 'مركز',
      'specialist': 'أخصائي',
      'doctor': 'طبيب',
      
      // Educational terms
      'school': 'مدرسة',
      'university': 'جامعة',
      'institute': 'معهد',
      'college': 'كلية',
      'academy': 'أكاديمية',
      'education': 'تعليم',
      'learning': 'تعلم',
      'training': 'تدريب',
      
      // Business terms
      'company': 'شركة',
      'business': 'أعمال',
      'corporation': 'مؤسسة',
      'enterprise': 'مشروع',
      'group': 'مجموعة',
      'international': 'دولية',
      'solutions': 'حلول',
      'services': 'خدمات',
      
      // Common terms
      'center': 'مركز',
      'office': 'مكتب',
      'department': 'قسم',
      'organization': 'منظمة',
      'foundation': 'مؤسسة',
      'association': 'جمعية',
      'council': 'مجلس',
      'committee': 'لجنة',
    };
    
    let arabicName = englishName.toLowerCase();
    
    // Replace common terms
    for (const [english, arabic] of Object.entries(commonTranslations)) {
      arabicName = arabicName.replace(new RegExp(english, 'gi'), arabic);
    }
    
    // If no translation found, use transliteration
    if (arabicName === englishName.toLowerCase()) {
      arabicName = this.transliterateToArabic(englishName);
    }
    
    return arabicName;
  }

  /**
   * Transliterate English to Arabic script
   */
  private transliterateToArabic(englishText: string): string {
    const transliterationMap: Record<string, string> = {
      'a': 'ا', 'b': 'ب', 'c': 'ك', 'd': 'د', 'e': 'ي', 'f': 'ف',
      'g': 'ج', 'h': 'ه', 'i': 'ي', 'j': 'ج', 'k': 'ك', 'l': 'ل',
      'm': 'م', 'n': 'ن', 'o': 'و', 'p': 'ب', 'q': 'ق', 'r': 'ر',
      's': 'س', 't': 'ت', 'u': 'و', 'v': 'ف', 'w': 'و', 'x': 'كس',
      'y': 'ي', 'z': 'ز'
    };
    
    return englishText.toLowerCase()
      .split('')
      .map(char => transliterationMap[char] || char)
      .join('');
  }

  /**
   * Analyze Arabic content for language, dialect, and cultural context
   */
  public analyzeArabicContent(content: string): ArabicContentAnalysis {
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;
    const englishRegex = /[a-zA-Z]/;
    
    const hasArabic = arabicRegex.test(content);
    const hasEnglish = englishRegex.test(content);
    
    let language: ArabicContentAnalysis['language'];
    if (hasArabic && hasEnglish) {
      language = 'mixed';
    } else if (hasArabic) {
      language = 'ar';
    } else {
      language = 'en';
    }
    
    // Detect Iraqi dialect patterns
    const dialect = this.detectIraqiDialect(content);
    
    // Analyze formality level
    const formalityLevel = this.analyzeFormalityLevel(content);
    
    // Extract cultural references
    const culturalReferences = this.extractCulturalReferences(content);
    
    // Extract professional terms
    const professionalTerms = this.extractProfessionalTerms(content);
    
    // Check for religious content
    const religiousContent = this.detectReligiousContent(content);
    
    // Check for government terms
    const governmentTerms = this.detectGovernmentTerms(content);
    
    return {
      language,
      script: hasArabic ? (hasEnglish ? 'mixed' : 'arabic') : 'latin',
      dialect,
      formalityLevel,
      culturalReferences,
      professionalTerms,
      religiousContent,
      governmentTerms,
      readingDirection: hasArabic ? (hasEnglish ? 'mixed' : 'rtl') : 'ltr',
      confidence: 0.85, // Simplified confidence score
    };
  }

  /**
   * Detect Iraqi dialect from Arabic text
   */
  private detectIraqiDialect(content: string): IraqiDialect {
    const dialectPatterns = {
      baghdad: ['شلونك', 'چاي', 'زين', 'وياك', 'تعال'],
      basra: ['شلون', 'انزين', 'هسه', 'جذي', 'بعدين'],
      mosul: ['كيفك', 'هاي', 'شو', 'إيش', 'بده'],
      kurdish: ['چی', 'هەر', 'دەیان', 'بزانم', 'کورد'],
    };
    
    for (const [dialect, patterns] of Object.entries(dialectPatterns)) {
      for (const pattern of patterns) {
        if (content.includes(pattern)) {
          return dialect as IraqiDialect;
        }
      }
    }
    
    return 'general';
  }

  /**
   * Analyze formality level of Arabic text
   */
  private analyzeFormalityLevel(content: string): ArabicContentAnalysis['formalityLevel'] {
    const formalIndicators = ['سعادة', 'معالي', 'الموقر', 'المحترم', 'تحية طيبة'];
    const informalIndicators = ['أهلا', 'مرحبا', 'يا أخي', 'والله', 'بس'];
    
    const formalCount = formalIndicators.filter(indicator => content.includes(indicator)).length;
    const informalCount = informalIndicators.filter(indicator => content.includes(indicator)).length;
    
    if (formalCount > informalCount * 2) return 'very_formal';
    if (formalCount > informalCount) return 'formal';
    if (informalCount > formalCount) return 'informal';
    if (informalCount > formalCount * 2) return 'colloquial';
    
    return 'standard';
  }

  /**
   * Extract cultural references from text
   */
  private extractCulturalReferences(content: string): string[] {
    const culturalTerms = [
      'رمضان', 'عيد', 'صلاة', 'جمعة', 'حج', 'زكاة', 'إفطار',
      'بغداد', 'العراق', 'دجلة', 'فرات', 'بابل', 'آشور',
      'الحشد', 'البرلمان', 'الوزارة', 'المحافظة', 'النجف', 'كربلاء'
    ];
    
    return culturalTerms.filter(term => content.includes(term));
  }

  /**
   * Extract professional terms from text
   */
  private extractProfessionalTerms(content: string): string[] {
    const allProfessionalTerms = Object.values(this.professionalTerminology)
      .flatMap(domain => Object.values(domain));
    
    return allProfessionalTerms.filter(term => content.includes(term));
  }

  /**
   * Detect religious content in text
   */
  private detectReligiousContent(content: string): boolean {
    const religiousTerms = [
      'الله', 'إسلام', 'مسلم', 'قرآن', 'حديث', 'رسول', 'نبي',
      'صلاة', 'زكاة', 'حج', 'صوم', 'إيمان', 'تقوى', 'هدى'
    ];
    
    return religiousTerms.some(term => content.includes(term));
  }

  /**
   * Detect government terms in text
   */
  private detectGovernmentTerms(content: string): boolean {
    const govTerms = Object.values(this.professionalTerminology.government);
    return govTerms.some(term => content.includes(term));
  }

  /**
   * Categorize workspace name based on content analysis
   */
  private categorizeWorkspaceName(name: string, domain: ProfessionalDomain): ArabicNameCategory {
    const analysis = this.analyzeArabicContent(name);
    
    if (analysis.religiousContent) return 'religious';
    if (analysis.governmentTerms) return 'government';
    if (domain === 'educational') return 'educational';
    if (domain === 'business') return 'commercial';
    if (analysis.professionalTerms.length > 0) return 'professional';
    
    return 'professional'; // Default category
  }

  /**
   * Check if name has religious significance
   */
  private hasReligiousSignificance(name: string): boolean {
    return this.detectReligiousContent(name);
  }

  /**
   * Check if name has historical reference
   */
  private hasHistoricalReference(name: string): boolean {
    const historicalTerms = [
      'بابل', 'آشور', 'بغداد', 'العباسية', 'الأموية', 'السومرية',
      'حضارة', 'تاريخ', 'تراث', 'عريق', 'أصيل'
    ];
    
    return historicalTerms.some(term => name.includes(term));
  }

  /**
   * Check if name contains professional terms
   */
  private containsProfessionalTerms(name: string, domain: ProfessionalDomain): boolean {
    const domainTerms = Object.values(this.professionalTerminology[domain]);
    return domainTerms.some(term => name.includes(term));
  }

  /**
   * Check if name is government official
   */
  private isGovernmentOfficial(name: string): boolean {
    return this.detectGovernmentTerms(name);
  }

  /**
   * Translate Arabic to English
   */
  private translateToEnglish(arabicName: string, domain: ProfessionalDomain): string {
    // This would typically use a translation service
    // For now, we'll use reverse lookup from our terminology
    
    const reverseTerminology: Record<string, string> = {};
    for (const [english, arabic] of Object.entries(this.professionalTerminology[domain])) {
      reverseTerminology[arabic] = english;
    }
    
    let englishName = arabicName;
    for (const [arabic, english] of Object.entries(reverseTerminology)) {
      englishName = englishName.replace(arabic, english);
    }
    
    // If no translation found, use transliteration
    if (englishName === arabicName) {
      englishName = this.transliterateArabic(arabicName);
    }
    
    // Clean up and capitalize
    return englishName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Transliterate Arabic to Latin script
   */
  private transliterateArabic(arabicText: string): string {
    const transliterationMap: Record<string, string> = {
      'ا': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'h',
      'خ': 'kh', 'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z', 'س': 's',
      'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a',
      'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm',
      'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y', 'ة': 'h', 'ى': 'a'
    };
    
    return arabicText
      .split('')
      .map(char => transliterationMap[char] || char)
      .join('')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Format text for RTL display
   */
  private formatForRTL(arabicText: string): string {
    // Add RTL formatting marks and ensure proper display
    return `\u202B${arabicText}\u202C`;
  }

  /**
   * Generate URL-safe slug from Arabic name
   */
  private generateArabicSlug(arabicName: string, englishName: string): string {
    // Use English transliteration for URL safety
    return englishName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }

  /**
   * Extract semantic tags from name and domain
   */
  private extractSemanticTags(
    name: string,
    domain: ProfessionalDomain,
    analysis: ArabicContentAnalysis
  ): string[] {
    const tags: string[] = [domain];
    
    // Add language tags
    tags.push(analysis.language);
    tags.push(analysis.dialect);
    
    // Add cultural tags
    if (analysis.religiousContent) tags.push('religious');
    if (analysis.governmentTerms) tags.push('government');
    
    // Add formality tag
    tags.push(analysis.formalityLevel);
    
    // Add professional terms as tags
    tags.push(...analysis.professionalTerms.slice(0, 5)); // Limit to 5 terms
    
    return [...new Set(tags)]; // Remove duplicates
  }

  /**
   * Add professional context to existing name
   */
  private addProfessionalContext(
    name: string,
    domain: ProfessionalDomain,
    convention: ArabicNamingConvention,
    governorate?: IraqiGovernorate
  ): string {
    const domainTerms = this.professionalTerminology[domain];
    
    // Add appropriate context based on domain and convention
    switch (convention) {
      case 'formal':
        return `${domainTerms.office || 'مكتب'} ${name}`;
      case 'government':
        return governorate 
          ? `${domainTerms.directorate || 'مديرية'} ${name} - ${this.governorateNames[governorate]?.name}`
          : `${domainTerms.directorate || 'مديرية'} ${name}`;
      case 'religious':
        return `${domainTerms.islamic_center || 'مركز إسلامي'} ${name}`;
      default:
        return `مؤسسة ${name}`;
    }
  }

  /**
   * Organize workspaces in Arabic-first hierarchy
   */
  public organizeWorkspaceHierarchy(
    workspaces: IraqiWorkspace[],
    organizationType: 'domain' | 'governorate' | 'cultural' | 'alphabetical' = 'domain'
  ): Record<string, IraqiWorkspace[]> {
    switch (organizationType) {
      case 'domain':
        return this.organizeByDomain(workspaces);
      case 'governorate':
        return this.organizeByGovernorate(workspaces);
      case 'cultural':
        return this.organizeByCulturalCategory(workspaces);
      case 'alphabetical':
        return this.organizeAlphabetically(workspaces);
      default:
        return this.organizeByDomain(workspaces);
    }
  }

  /**
   * Organize workspaces by professional domain
   */
  private organizeByDomain(workspaces: IraqiWorkspace[]): Record<string, IraqiWorkspace[]> {
    const organized: Record<string, IraqiWorkspace[]> = {};
    
    for (const workspace of workspaces) {
      const domain = workspace.type;
      const domainConfig = getDomainConfig(domain);
      const arabicDomainName = domainConfig.nameAr;
      
      if (!organized[arabicDomainName]) {
        organized[arabicDomainName] = [];
      }
      
      organized[arabicDomainName].push(workspace);
    }
    
    // Sort workspaces within each domain by Arabic name
    for (const domain of Object.keys(organized)) {
      organized[domain].sort((a, b) => a.nameAr.localeCompare(b.nameAr, 'ar'));
    }
    
    return organized;
  }

  /**
   * Organize workspaces by Iraqi governorate
   */
  private organizeByGovernorate(workspaces: IraqiWorkspace[]): Record<string, IraqiWorkspace[]> {
    const organized: Record<string, IraqiWorkspace[]> = {};
    
    for (const workspace of workspaces) {
      const governorate = workspace.governorate || 'غير محدد';
      const arabicGovName = this.governorateNames[governorate]?.name || governorate;
      
      if (!organized[arabicGovName]) {
        organized[arabicGovName] = [];
      }
      
      organized[arabicGovName].push(workspace);
    }
    
    // Sort workspaces within each governorate by Arabic name
    for (const gov of Object.keys(organized)) {
      organized[gov].sort((a, b) => a.nameAr.localeCompare(b.nameAr, 'ar'));
    }
    
    return organized;
  }

  /**
   * Organize workspaces by cultural category
   */
  private organizeByCulturalCategory(workspaces: IraqiWorkspace[]): Record<string, IraqiWorkspace[]> {
    const categories = {
      'ديني': 'religious',
      'حكومي': 'government',
      'تعليمي': 'educational',
      'طبي': 'medical',
      'قانوني': 'legal',
      'تجاري': 'business',
      'مجتمعي': 'community',
    };
    
    const organized: Record<string, IraqiWorkspace[]> = {};
    
    for (const workspace of workspaces) {
      const analysis = this.analyzeArabicContent(workspace.nameAr);
      let category = 'عام'; // General
      
      // Determine cultural category
      if (analysis.religiousContent) {
        category = 'ديني';
      } else if (analysis.governmentTerms) {
        category = 'حكومي';
      } else {
        // Map domain to Arabic category
        for (const [arabicCat, englishCat] of Object.entries(categories)) {
          if (workspace.type === englishCat) {
            category = arabicCat;
            break;
          }
        }
      }
      
      if (!organized[category]) {
        organized[category] = [];
      }
      
      organized[category].push(workspace);
    }
    
    // Sort workspaces within each category by Arabic name
    for (const category of Object.keys(organized)) {
      organized[category].sort((a, b) => a.nameAr.localeCompare(b.nameAr, 'ar'));
    }
    
    return organized;
  }

  /**
   * Organize workspaces alphabetically in Arabic
   */
  private organizeAlphabetically(workspaces: IraqiWorkspace[]): Record<string, IraqiWorkspace[]> {
    // Arabic alphabet groupings
    const arabicGroups = {
      'أ-ت': ['ا', 'ب', 'ت', 'ث'],
      'ج-ذ': ['ج', 'ح', 'خ', 'د', 'ذ'],
      'ر-ص': ['ر', 'ز', 'س', 'ش', 'ص'],
      'ض-ق': ['ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق'],
      'ك-ي': ['ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي'],
    };
    
    const organized: Record<string, IraqiWorkspace[]> = {};
    
    for (const workspace of workspaces) {
      const firstChar = workspace.nameAr.charAt(0);
      let group = 'أخرى'; // Other
      
      for (const [groupName, letters] of Object.entries(arabicGroups)) {
        if (letters.includes(firstChar)) {
          group = groupName;
          break;
        }
      }
      
      if (!organized[group]) {
        organized[group] = [];
      }
      
      organized[group].push(workspace);
    }
    
    // Sort workspaces within each group by Arabic name
    for (const group of Object.keys(organized)) {
      organized[group].sort((a, b) => a.nameAr.localeCompare(b.nameAr, 'ar'));
    }
    
    return organized;
  }

  /**
   * Generate workspace suggestions based on Arabic input
   */
  public generateWorkspaceSuggestions(
    input: string,
    domain: ProfessionalDomain,
    count = 5
  ): ArabicWorkspaceName[] {
    const suggestions: ArabicWorkspaceName[] = [];
    const analysis = this.analyzeArabicContent(input);
    
    // Generate variations with different conventions
    const conventions: ArabicNamingConvention[] = ['modern', 'formal', 'traditional'];
    
    for (const convention of conventions) {
      if (suggestions.length >= count) break;
      
      const suggestion = this.generateArabicWorkspaceName(input, domain, convention);
      suggestions.push(suggestion);
    }
    
    // Add governorate-specific suggestions if applicable
    const majorGovernorates: IraqiGovernorate[] = ['baghdad', 'basra', 'nineveh', 'arbil'];
    
    for (const governorate of majorGovernorates) {
      if (suggestions.length >= count) break;
      
      const suggestion = this.generateArabicWorkspaceName(input, domain, 'formal', governorate);
      suggestions.push(suggestion);
    }
    
    return suggestions.slice(0, count);
  }
}

// Export the service instance
export const arabicWorkspaceOrganizerService = new ArabicWorkspaceOrganizerService();