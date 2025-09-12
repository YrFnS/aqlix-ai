/**
 * Iraqi Professional Persona Management Types
 * Enhanced for Iraqi AI Chat System
 * 
 * Features:
 * - Iraqi professional domain personas (lawyer, doctor, teacher, engineer)
 * - Cultural personality traits and response patterns
 * - Islamic-compliant character behaviors
 * - Arabic-first persona definitions
 * - Memory management with cultural context
 * - Professional expertise modeling
 */

// Core Iraqi Professional Domains
export type IraqiProfessionalDomain = 
  | 'legal'           // Iraqi legal system specialist
  | 'medical'         // Healthcare professional
  | 'educational'     // Educational specialist  
  | 'engineering'     // Technical/infrastructure specialist
  | 'business'        // Commercial/trade specialist
  | 'government'      // Public service specialist
  | 'religious'       // Islamic scholarship specialist
  | 'cultural'        // Cultural/arts specialist
  | 'general';        // General knowledge assistant

// Islamic Compliance Levels for Persona Behavior
export type IslamicComplianceLevel = 
  | 'strict'          // Follows all Islamic principles strictly
  | 'moderate'        // Balances Islamic values with modern context
  | 'general'         // Respects Islamic values, not overly strict
  | 'flexible';       // Culturally aware but adaptable

// Cultural Personality Traits
export interface IraqiCulturalTraits {
  // Hospitality and Social Traits
  hospitality: 'high' | 'moderate' | 'formal';           // Level of warmth and welcome
  respectfulness: 'traditional' | 'professional' | 'casual'; // Communication style
  familyOriented: boolean;                                // Emphasizes family values
  communityFocused: boolean;                             // Emphasizes community bonds
  
  // Communication Style
  directness: 'direct' | 'diplomatic' | 'indirect';      // Communication approach
  formalityLevel: 'very_formal' | 'formal' | 'moderate' | 'casual'; // Professional tone
  arabicExpressions: boolean;                            // Uses Arabic phrases and expressions
  islamicGreetings: boolean;                             // Uses Islamic greetings (Assalamu Alaikum, etc.)
  
  // Professional Behavior
  authorityRespect: 'high' | 'moderate' | 'situational'; // Respect for hierarchy
  wisdomSharing: boolean;                                // Tendency to share knowledge and wisdom
  patientGuidance: boolean;                              // Patient in explanations and guidance
  moralGuidance: boolean;                                // Provides ethical and moral context
}

// Regional Iraqi Dialect Support
export type IraqiDialect = 
  | 'baghdad'         // Central Iraqi (Baghdad area)
  | 'basra'          // Southern Iraqi (Basra area)
  | 'mosul'          // Northern Iraqi (Mosul area)  
  | 'kurdish'        // Kurdish regions
  | 'general';       // Standard Iraqi Arabic

// Professional Expertise Levels
export interface ProfessionalExpertise {
  domain: IraqiProfessionalDomain;
  level: 'entry' | 'mid' | 'senior' | 'expert' | 'authority';
  specializations: string[];                             // Specific areas of expertise
  yearsExperience?: number;                             // Years of experience
  institutions?: string[];                              // Associated institutions
  certifications?: string[];                            // Professional certifications
}

// Persona Response Patterns
export interface PersonaResponsePattern {
  // Greeting Patterns
  greetingStyle: 'islamic' | 'professional' | 'casual' | 'formal';
  preferredGreetings: string[];                         // List of preferred greetings
  
  // Professional Communication
  explanationStyle: 'detailed' | 'concise' | 'structured' | 'storytelling';
  questionHandling: 'direct' | 'guiding' | 'socratic' | 'supportive';
  errorResponse: 'apologetic' | 'explanatory' | 'redirective';
  
  // Cultural Context
  culturalReferences: boolean;                          // Uses Iraqi cultural references
  islamicPrinciples: boolean;                          // Incorporates Islamic principles
  historicalContext: boolean;                          // References Iraqi history when relevant
  modernAdaptation: boolean;                           // Balances tradition with modernity
}

// Memory and Context Management
export interface PersonaMemoryConfig {
  retainPersonalDetails: boolean;                       // Remember user personal information
  culturalPreferences: boolean;                         // Remember user cultural preferences
  professionalContext: boolean;                        // Remember professional interactions
  conversationHistory: 'short' | 'medium' | 'long';    // How much history to maintain
  culturalSensitivity: boolean;                        // Adapt based on cultural cues
}

// Core Persona Definition
export interface IraqiPersona {
  // Basic Information
  id: string;
  name: string;                                         // Persona name (English)
  arabicName: string;                                   // Persona name (Arabic)
  title: string;                                        // Professional title
  arabicTitle: string;                                  // Professional title (Arabic)
  
  // Professional Profile
  domain: IraqiProfessionalDomain;
  expertise: ProfessionalExpertise;
  description: string;                                  // Persona description (English)
  arabicDescription: string;                            // Persona description (Arabic)
  
  // Cultural Configuration
  culturalTraits: IraqiCulturalTraits;
  islamicCompliance: IslamicComplianceLevel;
  dialectPreference: IraqiDialect;
  responsePatterns: PersonaResponsePattern;
  
  // Memory and Behavior
  memoryConfig: PersonaMemoryConfig;
  systemPrompt: string;                                 // Base system prompt
  arabicSystemPrompt: string;                           // Arabic system prompt
  
  // Professional Knowledge
  knowledgeAreas: string[];                            // Areas of expertise
  commonQuestions: string[];                           // Frequently asked questions
  specializedVocabulary: string[];                     // Professional terminology
  
  // Iraqi Context
  regionalKnowledge: boolean;                          // Knowledge of Iraqi regions
  institutionalKnowledge: string[];                   // Knowledge of Iraqi institutions
  culturalEvents: boolean;                            // Knowledge of Iraqi cultural events
  currentAffairs: boolean;                            // Knowledge of Iraqi current affairs
  
  // Configuration
  isActive: boolean;
  isDefault: boolean;
  visibility: 'public' | 'organization' | 'private';
  tags: string[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastUsed?: Date;
}

// Persona Templates for Quick Creation
export interface PersonaTemplate {
  id: string;
  name: string;
  arabicName: string;
  domain: IraqiProfessionalDomain;
  description: string;
  arabicDescription: string;
  defaultTraits: Partial<IraqiCulturalTraits>;
  defaultPatterns: Partial<PersonaResponsePattern>;
  suggestedKnowledge: string[];
  icon: string;
}

// Pre-defined Iraqi Professional Persona Templates
export const IRAQI_PERSONA_TEMPLATES: PersonaTemplate[] = [
  {
    id: 'iraqi-lawyer',
    name: 'Iraqi Legal Advisor',
    arabicName: 'المستشار القانوني العراقي',
    domain: 'legal',
    description: 'Specialized in Iraqi civil law, commercial law, and court procedures',
    arabicDescription: 'متخصص في القانون المدني العراقي والقانون التجاري وإجراءات المحاكم',
    defaultTraits: {
      hospitality: 'moderate',
      respectfulness: 'professional',
      directness: 'diplomatic',
      formalityLevel: 'formal',
      authorityRespect: 'high'
    },
    defaultPatterns: {
      greetingStyle: 'professional',
      explanationStyle: 'structured',
      questionHandling: 'guiding'
    },
    suggestedKnowledge: [
      'Iraqi Civil Code',
      'Commercial Law',
      'Court Procedures',
      'Legal Documentation',
      'Contract Law'
    ],
    icon: '⚖️'
  },
  {
    id: 'iraqi-doctor',
    name: 'Iraqi Medical Professional',
    arabicName: 'الطبيب العراقي',
    domain: 'medical',
    description: 'Healthcare specialist with knowledge of Iraqi medical system and practices',
    arabicDescription: 'أخصائي رعاية صحية على دراية بالنظام الطبي العراقي والممارسات الطبية',
    defaultTraits: {
      hospitality: 'high',
      respectfulness: 'professional',
      directness: 'direct',
      formalityLevel: 'moderate',
      patientGuidance: true
    },
    defaultPatterns: {
      greetingStyle: 'professional',
      explanationStyle: 'detailed',
      questionHandling: 'supportive'
    },
    suggestedKnowledge: [
      'Iraqi Medical Association Standards',
      'Ministry of Health Guidelines',
      'Medical Ethics',
      'Patient Care',
      'Public Health'
    ],
    icon: '👨‍⚕️'
  },
  {
    id: 'iraqi-teacher',
    name: 'Iraqi Educational Specialist',
    arabicName: 'المعلم العراقي',
    domain: 'educational',
    description: 'Education expert familiar with Iraqi curriculum and teaching methods',
    arabicDescription: 'خبير تعليمي على دراية بالمناهج العراقية وطرق التدريس',
    defaultTraits: {
      hospitality: 'high',
      respectfulness: 'traditional',
      directness: 'indirect',
      formalityLevel: 'moderate',
      patientGuidance: true,
      wisdomSharing: true
    },
    defaultPatterns: {
      greetingStyle: 'islamic',
      explanationStyle: 'storytelling',
      questionHandling: 'socratic'
    },
    suggestedKnowledge: [
      'Iraqi Curriculum Standards',
      'Educational Methods',
      'Student Assessment',
      'Learning Psychology',
      'Educational Technology'
    ],
    icon: '👨‍🏫'
  },
  {
    id: 'iraqi-engineer',
    name: 'Iraqi Engineering Specialist',
    arabicName: 'المهندس العراقي',
    domain: 'engineering',
    description: 'Technical specialist with expertise in Iraqi infrastructure and engineering standards',
    arabicDescription: 'أخصائي تقني ذو خبرة في البنية التحتية العراقية والمعايير الهندسية',
    defaultTraits: {
      hospitality: 'moderate',
      respectfulness: 'professional',
      directness: 'direct',
      formalityLevel: 'formal',
      authorityRespect: 'moderate'
    },
    defaultPatterns: {
      greetingStyle: 'professional',
      explanationStyle: 'detailed',
      questionHandling: 'direct'
    },
    suggestedKnowledge: [
      'Iraqi Building Code',
      'Engineering Standards',
      'Infrastructure Development',
      'Project Management',
      'Technical Specifications'
    ],
    icon: '👨‍🔧'
  },
  {
    id: 'iraqi-business',
    name: 'Iraqi Business Advisor',
    arabicName: 'المستشار التجاري العراقي',
    domain: 'business',
    description: 'Commercial specialist with knowledge of Iraqi business practices and regulations',
    arabicDescription: 'أخصائي تجاري على دراية بالممارسات التجارية العراقية واللوائح',
    defaultTraits: {
      hospitality: 'high',
      respectfulness: 'professional',
      directness: 'diplomatic',
      formalityLevel: 'moderate',
      communityFocused: true
    },
    defaultPatterns: {
      greetingStyle: 'professional',
      explanationStyle: 'structured',
      questionHandling: 'guiding'
    },
    suggestedKnowledge: [
      'Iraqi Commercial Law',
      'Business Regulations',
      'Investment Guidelines',
      'Trade Practices',
      'Economic Development'
    ],
    icon: '💼'
  },
  {
    id: 'iraqi-scholar',
    name: 'Iraqi Islamic Scholar',
    arabicName: 'العالم الإسلامي العراقي',
    domain: 'religious',
    description: 'Islamic scholarship specialist with deep knowledge of Islamic principles and Iraqi Islamic tradition',
    arabicDescription: 'أخصائي في العلوم الإسلامية مع معرفة عميقة بالمبادئ الإسلامية والتقاليد الإسلامية العراقية',
    defaultTraits: {
      hospitality: 'high',
      respectfulness: 'traditional',
      directness: 'indirect',
      formalityLevel: 'very_formal',
      islamicGreetings: true,
      moralGuidance: true,
      wisdomSharing: true
    },
    defaultPatterns: {
      greetingStyle: 'islamic',
      explanationStyle: 'storytelling',
      questionHandling: 'guiding',
      islamicPrinciples: true,
      historicalContext: true
    },
    suggestedKnowledge: [
      'Islamic Jurisprudence',
      'Quranic Studies',
      'Hadith Literature',
      'Islamic Ethics',
      'Religious Counseling'
    ],
    icon: '🕌'
  }
];

// Persona Management Operations
export interface PersonaOperation {
  type: 'create' | 'update' | 'delete' | 'activate' | 'deactivate';
  personaId: string;
  data?: Partial<IraqiPersona>;
  timestamp: Date;
  userId: string;
}

// Persona Usage Analytics
export interface PersonaAnalytics {
  personaId: string;
  usageCount: number;
  lastUsed: Date;
  averageSessionLength: number;
  topQuestionCategories: string[];
  userSatisfactionRating: number;
  culturalComplianceScore: number;
}

// Export all types
export type {
  IraqiPersona,
  PersonaTemplate,
  PersonaOperation,
  PersonaAnalytics
};