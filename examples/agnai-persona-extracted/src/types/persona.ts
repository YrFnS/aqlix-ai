/**
 * Iraqi AI Persona Management Types
 * Extracted from agnai with comprehensive Iraqi cultural adaptations
 */

export interface IraqiPersona {
  id: string;
  name: string;
  nameArabic?: string;
  avatar?: string;
  description: string;
  descriptionArabic?: string;

  // Iraqi Professional Domain
  professionalDomain: IraqiProfessionalDomain;
  governorate: IraqiGovernorate;

  // Cultural & Islamic Compliance
  culturalProfile: IraqiCulturalProfile;
  islamicCompliance: IslamicComplianceSettings;

  // Personality & Behavior
  personality: PersonalityTraits;
  communicationStyle: CommunicationStyle;
  responsePatterns: ResponsePatterns;

  // Memory & Context
  memorySettings: MemorySettings;
  contextRetention: ContextRetentionSettings;

  // System Settings
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  version: string;
  tags: string[];
}

export type IraqiProfessionalDomain =
  | 'legal' // Lawyers, judges, legal assistants
  | 'medical' // Doctors, nurses, medical staff
  | 'educational' // Teachers, professors, administrators
  | 'engineering' // Engineers, architects, technicians
  | 'business' // Business professionals, managers
  | 'government' // Civil servants, officials
  | 'religious' // Islamic scholars, imams
  | 'cultural' // Artists, writers, cultural experts
  | 'technology' // IT professionals, developers
  | 'general'; // General professional assistant

export type IraqiGovernorate =
  | 'baghdad'
  | 'basra'
  | 'mosul'
  | 'erbil'
  | 'najaf'
  | 'karbala'
  | 'hillah'
  | 'ramadi'
  | 'kirkuk'
  | 'dohuk'
  | 'samarra'
  | 'kut'
  | 'amarah'
  | 'nasiriyah'
  | 'diwaniyah';

export interface IraqiCulturalProfile {
  // Language Preferences
  primaryLanguage: 'arabic' | 'english' | 'bilingual';
  dialectPreference: 'baghdadi' | 'basrawi' | 'moslawi' | 'standard_arabic';
  formalityLevel: 'formal' | 'semi_formal' | 'casual';

  // Cultural Sensitivity
  culturalSensitivity: number; // 0-100, target 95%+
  regionalAdaptation: boolean;
  traditionalValues: boolean;

  // Professional Context
  professionalTerminology: boolean;
  domainSpecificLanguage: boolean;
  governmentCompliance: boolean;
}

export interface IslamicComplianceSettings {
  // Core Islamic Principles
  islamicValuesCompliance: number; // 0-100, target 96%+
  halalContentOnly: boolean;
  respectForIslamicPrinciples: boolean;

  // Prayer & Religious Observance
  prayerTimeAwareness: boolean;
  islamicCalendarIntegration: boolean;
  ramadanConsiderations: boolean;

  // Content Guidelines
  prohibitedContentFiltering: boolean;
  islamicEthicsGuidelines: boolean;
  familyValuesAlignment: boolean;

  // Professional Islamic Context
  islamicProfessionalEthics: boolean;
  shariahCompliantAdvice: boolean;
  islamicBusinessPrinciples: boolean;
}

export interface PersonalityTraits {
  // Big Five Personality Model (adapted for Iraqi culture)
  openness: number; // 0-100
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;

  // Iraqi Cultural Traits
  hospitalityLevel: number; // Traditional Iraqi hospitality
  respectForElders: number; // Cultural hierarchy respect
  familyOrientation: number; // Family-centric values
  communityFocus: number; // Community vs. individual focus

  // Professional Traits
  expertise: number; // Domain knowledge level
  helpfulness: number; // Assistance orientation
  professionalism: number; // Professional behavior
  patience: number; // User interaction patience
}

export interface CommunicationStyle {
  // Language Style
  verbosity: 'concise' | 'detailed' | 'adaptive';
  explanationDepth: 'basic' | 'intermediate' | 'expert';
  exampleUsage: boolean;

  // Iraqi Communication Patterns
  indirectCommunication: boolean; // Indirect vs. direct communication
  respectfulAddress: boolean; // Formal titles and respect
  contextualGreeting: boolean; // Appropriate greetings

  // Professional Communication
  professionalTone: boolean;
  technicalAccuracy: boolean;
  disclaimerUsage: boolean; // Professional disclaimers

  // Cultural Adaptation
  arabicPhraseIntegration: boolean; // Arabic phrases in English
  islamicGreetings: boolean; // Islamic greetings when appropriate
  culturalReferences: boolean; // Iraqi cultural context
}

export interface ResponsePatterns {
  // Response Structure
  introductionStyle: 'formal' | 'warm' | 'direct' | 'cultural';
  conclusionStyle: 'summary' | 'action_items' | 'blessing' | 'offer_help';

  // Iraqi-Specific Patterns
  hospitalityExpressions: boolean; // "Ahlan wa sahlan" type expressions
  blessingIntegration: boolean; // Appropriate Islamic blessings
  respectfulClosing: boolean; // Cultural closing patterns

  // Professional Patterns
  expertiseDisclaimer: boolean; // Professional disclaimers
  referralSuggestions: boolean; // Suggest specialists when needed
  followUpOffers: boolean; // Offer continued assistance

  // Error Handling
  apologeticTone: boolean; // Cultural apology patterns
  alternativeSuggestions: boolean; // Provide alternatives
  escalationProtocol: boolean; // When to escalate issues
}

export interface MemorySettings {
  // Memory Capacity
  shortTermMemory: number; // Messages to remember in session
  longTermMemory: number; // Conversation history to retain
  contextualMemory: number; // Cultural/professional context retention

  // Memory Types
  personalPreferences: boolean; // Remember user preferences
  professionalContext: boolean; // Remember professional domain
  culturalAdaptation: boolean; // Remember cultural preferences
  conversationHistory: boolean; // Maintain conversation thread

  // Iraqi-Specific Memory
  arabicTerminology: boolean; // Remember Arabic terms used
  professionalRelationships: boolean; // Professional context memory
  culturalSensitivities: boolean; // Remember cultural preferences

  // Privacy & Retention
  dataRetentionDays: number; // How long to retain data
  sensitiveDataHandling: 'encrypt' | 'delete' | 'anonymize';
  complianceLogging: boolean; // Log for compliance purposes
}

export interface ContextRetentionSettings {
  // Context Scope
  sessionScope: boolean; // Within current session
  userScope: boolean; // Across user sessions
  domainScope: boolean; // Professional domain context
  culturalScope: boolean; // Cultural context retention

  // Retention Strategy
  importantTopics: string[]; // Topics to always remember
  forgettablePatterns: string[]; // Patterns to not retain
  contextPriority: 'recent' | 'important' | 'cultural' | 'professional';

  // Performance Settings
  compressionEnabled: boolean; // Compress old context
  intelligentSummarization: boolean; // Summarize old conversations
  contextOptimization: boolean; // Optimize context for performance
}

// Persona Management Types
export interface PersonaCreationRequest {
  basicInfo: Pick<IraqiPersona, 'name' | 'nameArabic' | 'description' | 'descriptionArabic'>;
  professionalDomain: IraqiProfessionalDomain;
  governorate: IraqiGovernorate;
  culturalProfile: Partial<IraqiCulturalProfile>;
  islamicCompliance: Partial<IslamicComplianceSettings>;
  personality: Partial<PersonalityTraits>;
  communicationStyle: Partial<CommunicationStyle>;
  responsePatterns: Partial<ResponsePatterns>;
  memorySettings: Partial<MemorySettings>;
  tags?: string[];
}

export interface PersonaUpdateRequest extends Partial<PersonaCreationRequest> {
  id: string;
  version: string;
}

export interface PersonaFilter {
  professionalDomain?: IraqiProfessionalDomain[];
  governorate?: IraqiGovernorate[];
  culturalCompliance?: number; // Minimum compliance score
  islamicCompliance?: number; // Minimum Islamic compliance
  isActive?: boolean;
  tags?: string[];
  searchTerm?: string;
}

export interface PersonaMetrics {
  totalPersonas: number;
  activePersonas: number;
  domainDistribution: Record<IraqiProfessionalDomain, number>;
  governorateDistribution: Record<IraqiGovernorate, number>;
  averageCulturalCompliance: number;
  averageIslamicCompliance: number;
  performanceMetrics: {
    responseAccuracy: number;
    userSatisfaction: number;
    culturalAppropriateness: number;
    professionalEffectiveness: number;
  };
}

// Validation & Compliance Types
export interface PersonaValidationResult {
  isValid: boolean;
  culturalComplianceScore: number;
  islamicComplianceScore: number;
  professionalAccuracy: number;
  issues: ValidationIssue[];
  suggestions: string[];
}

export interface ValidationIssue {
  type: 'cultural' | 'islamic' | 'professional' | 'linguistic' | 'technical';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  messageArabic?: string;
  field: string;
  suggestedFix?: string;
}

// Pre-built Iraqi Professional Personas
export interface IraqiProfessionalPersonaTemplate {
  domain: IraqiProfessionalDomain;
  template: Omit<IraqiPersona, 'id' | 'createdAt' | 'updatedAt'>;
  variations: {
    experience: 'junior' | 'senior' | 'expert';
    specialization: string[];
    culturalAdaptation: 'traditional' | 'modern' | 'balanced';
  };
}

// Export utility types
export type PersonaID = string;
export type PersonaVersion = string;
export type CulturalScore = number; // 0-100
export type IslamicScore = number; // 0-100
