/**
 * Cultural Intelligence Type Definitions
 * Supporting Iraqi cultural context, Islamic compliance, and Arabic processing
 */

// Islamic Compliance Types
export interface IslamicComplianceResult {
  isCompliant: boolean;
  score: number; // 0-1
  issues: IslamicComplianceIssue[];
  recommendations: IslamicComplianceRecommendation[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  
  // Detailed compliance breakdown
  breakdown: {
    financialCompliance: number; // Riba/interest check
    contentAppropriatenesss: number; // Halal content
    timingCompliance: number; // Prayer times, Ramadan
    professionalEthics: number; // Domain-specific Islamic ethics
    businessPractices: number; // Islamic business principles
  };
  
  // Validation context
  context: {
    validatedAt: Date;
    validatorVersion: string;
    professionalDomain: string;
    prayerTimeContext: PrayerTimeContext;
    hijriDate: string;
    isRamadan: boolean;
  };
}

export interface IslamicComplianceIssue {
  id: string;
  type: 'riba' | 'haram-content' | 'prayer-conflict' | 'ramadan-violation' | 'professional-ethics' | 'business-practice';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  arabicMessage?: string;
  nodeId?: string;
  
  // Issue details
  details: {
    violationType: string;
    islamicRuling?: string;
    professionalContext?: string;
    suggestedAlternative?: string;
  };
  
  // Resolution guidance
  resolution: {
    required: boolean;
    alternatives: string[];
    islamicGuidance?: string;
    professionalGuidance?: string;
  };
}

export interface IslamicComplianceRecommendation {
  id: string;
  type: 'enhancement' | 'alternative' | 'guidance' | 'best-practice';
  priority: 'low' | 'medium' | 'high';
  message: string;
  arabicMessage?: string;
  
  // Implementation details
  implementation: {
    effort: 'minimal' | 'moderate' | 'significant';
    impact: 'low' | 'medium' | 'high';
    timeframe: string;
    resources?: string[];
  };
  
  // Islamic context
  islamic: {
    basis: string; // Quran, Hadith, scholarly consensus
    madhab?: string; // School of Islamic jurisprudence
    contemporaryRuling?: string;
  };
}

export interface PrayerTimeContext {
  location: {
    city: string;
    country: string;
    coordinates: { lat: number; lng: number };
    timezone: string;
  };
  
  times: {
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
    
    // Special times
    tahajjud?: string;
    ishraq?: string;
    zawal?: string; // Forbidden time before Dhuhr
  };
  
  // Current status
  current: {
    nextPrayer: string;
    timeUntilNext: number; // minutes
    isRestrictedTime: boolean;
    fridayJumahTime?: string;
  };
  
  // Ramadan context
  ramadan?: {
    isRamadan: boolean;
    suhoor: string;
    iftar: string;
    tarawih: string;
    qiyam?: string;
  };
}

// Arabic Text Processing Types
export interface ArabicProcessingResult {
  originalText: string;
  processedText: string;
  
  // Text analysis
  analysis: {
    direction: 'rtl' | 'ltr' | 'mixed';
    dialect: ArabicDialect;
    confidence: number; // 0-1
    languageRatio: { arabic: number; english: number; other: number };
    complexity: 'simple' | 'moderate' | 'complex';
  };
  
  // Processing enhancements
  enhancements: {
    rtlFormatting: boolean;
    dialectNormalization: boolean;
    professionalTerminology: boolean;
    bilingualLabeling: boolean;
    culturalValidation: boolean;
  };
  
  // Quality metrics
  quality: {
    readabilityScore: number; // 0-1
    culturalAppropriatenesss: number; // 0-1
    professionalAccuracy: number; // 0-1
    rtlLayoutCompliance: number; // 0-1
  };
  
  // Issues and recommendations
  issues: ArabicProcessingIssue[];
  recommendations: ArabicProcessingRecommendation[];
}

export interface ArabicDialect {
  primary: 'baghdadi' | 'basri' | 'moslawi' | 'kurdish' | 'standard' | 'mixed' | 'unknown';
  secondary?: string[];
  confidence: number; // 0-1
  
  // Dialect characteristics
  characteristics: {
    phonetic: string[]; // Distinctive sounds
    lexical: string[]; // Unique vocabulary
    grammatical: string[]; // Grammar patterns
    cultural: string[]; // Cultural expressions
  };
  
  // Professional adaptation
  professional: {
    domainTerminology: string[];
    formalRegistr: 'colloquial' | 'formal' | 'professional' | 'academic';
    audienceAppropriate: boolean;
  };
}

export interface ArabicProcessingIssue {
  id: string;
  type: 'rtl-layout' | 'dialect-inconsistency' | 'mixed-language' | 'cultural-inappropriate' | 'professional-terminology';
  severity: 'low' | 'medium' | 'high';
  message: string;
  arabicMessage?: string;
  
  // Location in text
  location: {
    start: number;
    end: number;
    context: string;
  };
  
  // Resolution guidance
  resolution: {
    required: boolean;
    suggestions: string[];
    arabicSuggestions?: string[];
    automaticFix?: boolean;
  };
}

export interface ArabicProcessingRecommendation {
  id: string;
  type: 'enhancement' | 'optimization' | 'cultural-adaptation' | 'professional-improvement';
  priority: 'low' | 'medium' | 'high';
  message: string;
  arabicMessage?: string;
  
  // Implementation details
  implementation: {
    effort: 'minimal' | 'moderate' | 'significant';
    impact: 'low' | 'medium' | 'high';
    tools?: string[];
    resources?: string[];
  };
}

// Professional Domain Types
export interface ProfessionalDomainContext {
  domain: 'health' | 'education' | 'interior' | 'justice' | 'finance' | 'general';
  ministry?: string;
  department?: string;
  subdivision?: string;
  
  // Domain-specific requirements
  requirements: {
    securityLevel: 'public' | 'internal' | 'confidential' | 'secret' | 'top-secret';
    complianceStandards: string[];
    islamicJurisprudence: boolean;
    arabicMandatory: boolean;
    bilingualRequired: boolean;
  };
  
  // Professional terminology
  terminology: {
    arabic: string[];
    english: string[];
    bilingual: Record<string, string>;
    abbreviations: Record<string, string>;
    culturalTerms: Record<string, string>;
  };
  
  // Cultural considerations
  cultural: {
    genderConsiderations: boolean;
    familyPrivacy: boolean;
    religiousAccommodations: boolean;
    tribalSensitivities: boolean;
    sectarianNeutrality: boolean;
  };
  
  // Operational context
  operational: {
    businessHours: { start: string; end: string };
    weekendDays: string[];
    holidays: string[];
    ramadanAdjustments: boolean;
    prayerTimeAccommodations: boolean;
  };
}

export interface ProfessionalDomainValidation {
  isValid: boolean;
  score: number; // 0-1
  domain: string;
  
  // Validation breakdown
  breakdown: {
    terminologyAccuracy: number;
    culturalSensitivity: number;
    complianceAdherence: number;
    operationalCompatibility: number;
    islamicConsistency: number;
  };
  
  // Domain-specific issues
  issues: ProfessionalDomainIssue[];
  recommendations: ProfessionalDomainRecommendation[];
  
  // Validation context
  context: {
    validatedAt: Date;
    validatorVersion: string;
    domainExpert?: string;
    culturalValidator?: string;
    islamicValidator?: string;
  };
}

export interface ProfessionalDomainIssue {
  id: string;
  type: 'terminology' | 'cultural-sensitivity' | 'compliance' | 'operational' | 'islamic-ethics';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  arabicMessage?: string;
  
  // Issue context
  context: {
    domain: string;
    regulation?: string;
    bestPractice?: string;
    culturalNorm?: string;
    islamicPrinciple?: string;
  };
  
  // Resolution guidance
  resolution: {
    required: boolean;
    alternatives: string[];
    resources: string[];
    expertConsultation?: boolean;
  };
}

export interface ProfessionalDomainRecommendation {
  id: string;
  type: 'best-practice' | 'optimization' | 'cultural-enhancement' | 'compliance-improvement';
  priority: 'low' | 'medium' | 'high';
  message: string;
  arabicMessage?: string;
  
  // Professional context
  professional: {
    domain: string;
    expertise: string;
    implementation: string;
    benefits: string[];
  };
  
  // Cultural context
  cultural: {
    sensitivity: string;
    appropriateness: string;
    islamicCompatibility: string;
  };
}

// Cultural Theme and Display Types
export interface CulturalTheme {
  id: string;
  name: string;
  arabicName?: string;
  description: string;
  arabicDescription?: string;
  
  // Visual properties
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
    islamic?: string; // Green tones for Islamic elements
    ministry?: string; // Government colors
  };
  
  // Typography
  typography: {
    arabicFont: string;
    englishFont: string;
    sizes: {
      small: string;
      medium: string;
      large: string;
      xlarge: string;
    };
    weights: {
      light: number;
      normal: number;
      bold: number;
    };
  };
  
  // Layout properties
  layout: {
    rtlSupport: boolean;
    spacing: 'compact' | 'normal' | 'spacious';
    borderRadius: string;
    shadows: boolean;
    animations: boolean;
  };
  
  // Cultural elements
  cultural: {
    islamicMotifs: boolean;
    arabicCalligraphy: boolean;
    governmentBranding: boolean;
    ministryColors?: Record<string, string>;
  };
}

export interface CulturalDisplaySettings {
  theme: string;
  language: 'arabic' | 'english' | 'bilingual';
  direction: 'rtl' | 'ltr' | 'auto';
  
  // Content display
  content: {
    showArabicLabels: boolean;
    showEnglishLabels: boolean;
    showIslamicCompliance: boolean;
    showPrayerTimeIndicators: boolean;
    showCulturalValidation: boolean;
  };
  
  // Professional display
  professional: {
    showMinistryBranding: boolean;
    showSecurityClassification: boolean;
    showComplianceStatus: boolean;
    showDomainSpecificIcons: boolean;
  };
  
  // Accessibility
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    screenReaderOptimized: boolean;
    colorBlindFriendly: boolean;
  };
  
  // Cultural preferences
  cultural: {
    islamicCalendar: boolean;
    hijriDates: boolean;
    prayerTimeDisplay: boolean;
    ramadanMode: boolean;
    culturalHolidays: boolean;
  };
}

// Validation and Compliance Aggregation Types
export interface CulturalValidationResult {
  overall: {
    isValid: boolean;
    score: number; // 0-1
    confidence: number; // 0-1
  };
  
  // Component validations
  islamic: IslamicComplianceResult;
  arabic: ArabicProcessingResult;
  professional: ProfessionalDomainValidation;
  
  // Aggregated metrics
  metrics: {
    culturalAccuracy: number;
    islamicCompliance: number;
    arabicProcessingQuality: number;
    professionalAppropriatenesss: number;
    overallReadiness: number;
  };
  
  // Summary
  summary: {
    criticalIssues: number;
    highPriorityRecommendations: number;
    estimatedFixTime: string;
    readinessLevel: 'not-ready' | 'needs-work' | 'mostly-ready' | 'production-ready';
  };
  
  // Validation metadata
  metadata: {
    validatedAt: Date;
    validatorVersion: string;
    culturalContext: string;
    professionalDomain: string;
    islamicValidator?: string;
    arabicProcessor?: string;
    domainExpert?: string;
  };
}

// Export utility types
export type CulturalValidationHandler = (result: CulturalValidationResult) => void;
export type IslamicComplianceHandler = (result: IslamicComplianceResult) => void;
export type ArabicProcessingHandler = (result: ArabicProcessingResult) => void;
export type ProfessionalDomainHandler = (result: ProfessionalDomainValidation) => void;