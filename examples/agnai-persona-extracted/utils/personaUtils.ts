/**
 * Iraqi Persona Utility Functions
 * Enhanced for Iraqi AI Chat System
 * 
 * Features:
 * - Cultural validation and scoring utilities
 * - Professional domain helpers
 * - Arabic text processing utilities
 * - Performance optimization functions
 * - Export/import utilities for persona data
 * - Integration helpers for external systems
 */

import {
  IraqiPersona,
  PersonaTemplate,
  IraqiCulturalTraits,
  PersonaResponsePattern,
  IraqiProfessionalDomain,
  IslamicComplianceLevel,
  PersonaAnalytics,
  IraqiDialect
} from '../types/persona';

// ===== CULTURAL VALIDATION UTILITIES =====

/**
 * Validates persona name for Iraqi cultural appropriateness
 */
export const validatePersonaName = (name: string, arabicName: string): {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
} => {
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Check English name format
  if (name.length < 3) {
    issues.push('English name too short');
    suggestions.push('Use at least 3 characters for the English name');
  }

  if (name.length > 50) {
    issues.push('English name too long');
    suggestions.push('Keep English name under 50 characters');
  }

  // Check Arabic name format
  if (arabicName.length < 2) {
    issues.push('Arabic name too short');
    suggestions.push('Use at least 2 Arabic characters');
  }

  // Check for inappropriate content
  const inappropriatePatterns = [
    /\b(casino|gambling|alcohol|wine|beer)\b/gi,
    /\b(dating|romance|adult)\b/gi
  ];

  inappropriatePatterns.forEach(pattern => {
    if (pattern.test(name) || pattern.test(arabicName)) {
      issues.push('Name contains inappropriate content for Islamic context');
      suggestions.push('Choose names that align with Islamic values');
    }
  });

  // Check for professional appropriateness
  if (!/^[a-zA-Z\s\-\.]+$/.test(name)) {
    issues.push('English name contains invalid characters');
    suggestions.push('Use only letters, spaces, hyphens, and periods');
  }

  if (!/^[\u0600-\u06FF\s\-\.]+$/.test(arabicName)) {
    issues.push('Arabic name contains invalid characters');
    suggestions.push('Use only Arabic letters, spaces, hyphens, and periods');
  }

  return {
    isValid: issues.length === 0,
    issues,
    suggestions
  };
};

/**
 * Calculates cultural compliance score based on persona configuration
 */
export const calculateCulturalComplianceScore = (persona: IraqiPersona): number => {
  let score = 100;
  const traits = persona.culturalTraits;
  const patterns = persona.responsePatterns;

  // Islamic compliance level scoring
  const complianceScores = {
    strict: 100,
    moderate: 85,
    general: 70,
    flexible: 55
  };
  
  const baseComplianceScore = complianceScores[persona.islamicCompliance];
  score = (score + baseComplianceScore) / 2;

  // Cultural traits scoring
  if (traits.hospitalit === 'high' && traits.respectfulness === 'traditional') {
    score += 5;
  }
  
  if (traits.familyOriented && traits.communityFocused) {
    score += 5;
  }

  if (traits.islamicGreetings && patterns.islamicPrinciples) {
    score += 10;
  }

  if (traits.moralGuidance && traits.wisdomSharing) {
    score += 5;
  }

  // Penalty for inappropriate configurations
  if (persona.islamicCompliance === 'strict' && !patterns.islamicPrinciples) {
    score -= 15;
  }

  if (traits.islamicGreetings && patterns.greetingStyle !== 'islamic') {
    score -= 10;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
};

// ===== PROFESSIONAL DOMAIN UTILITIES =====

/**
 * Get domain-specific knowledge requirements
 */
export const getDomainRequirements = (domain: IraqiProfessionalDomain): {
  requiredKnowledge: string[];
  recommendedTraits: Partial<IraqiCulturalTraits>;
  complianceLevel: IslamicComplianceLevel;
  formalityLevel: 'very_formal' | 'formal' | 'moderate' | 'casual';
} => {
  const domainMap = {
    legal: {
      requiredKnowledge: [
        'Iraqi Civil Code',
        'Commercial Law',
        'Court Procedures',
        'Legal Documentation',
        'Constitutional Law'
      ],
      recommendedTraits: {
        respectfulness: 'professional' as const,
        formalityLevel: 'very_formal' as const,
        directness: 'diplomatic' as const,
        authorityRespect: 'high' as const
      },
      complianceLevel: 'moderate' as IslamicComplianceLevel,
      formalityLevel: 'very_formal' as const
    },
    medical: {
      requiredKnowledge: [
        'Iraqi Medical Association Standards',
        'Ministry of Health Guidelines',
        'Medical Ethics',
        'Patient Care Protocols',
        'Public Health Guidelines'
      ],
      recommendedTraits: {
        respectfulness: 'professional' as const,
        patientGuidance: true,
        moralGuidance: true,
        wisdomSharing: true
      },
      complianceLevel: 'moderate' as IslamicComplianceLevel,
      formalityLevel: 'formal' as const
    },
    educational: {
      requiredKnowledge: [
        'Iraqi Curriculum Standards',
        'Educational Psychology',
        'Teaching Methods',
        'Student Assessment',
        'Educational Administration'
      ],
      recommendedTraits: {
        respectfulness: 'traditional' as const,
        patientGuidance: true,
        wisdomSharing: true,
        familyOriented: true
      },
      complianceLevel: 'moderate' as IslamicComplianceLevel,
      formalityLevel: 'moderate' as const
    },
    religious: {
      requiredKnowledge: [
        'Islamic Jurisprudence',
        'Quranic Studies',
        'Hadith Literature',
        'Islamic Ethics',
        'Religious Counseling'
      ],
      recommendedTraits: {
        respectfulness: 'traditional' as const,
        islamicGreetings: true,
        moralGuidance: true,
        wisdomSharing: true,
        formalityLevel: 'very_formal' as const
      },
      complianceLevel: 'strict' as IslamicComplianceLevel,
      formalityLevel: 'very_formal' as const
    },
    engineering: {
      requiredKnowledge: [
        'Iraqi Building Codes',
        'Engineering Standards',
        'Project Management',
        'Technical Specifications',
        'Infrastructure Development'
      ],
      recommendedTraits: {
        respectfulness: 'professional' as const,
        directness: 'direct' as const,
        authorityRespect: 'moderate' as const
      },
      complianceLevel: 'general' as IslamicComplianceLevel,
      formalityLevel: 'formal' as const
    },
    business: {
      requiredKnowledge: [
        'Iraqi Commercial Law',
        'Business Regulations',
        'Trade Practices',
        'Investment Guidelines',
        'Economic Development'
      ],
      recommendedTraits: {
        respectfulness: 'professional' as const,
        communityFocused: true,
        directness: 'diplomatic' as const
      },
      complianceLevel: 'moderate' as IslamicComplianceLevel,
      formalityLevel: 'moderate' as const
    },
    government: {
      requiredKnowledge: [
        'Public Administration',
        'Government Procedures',
        'Administrative Law',
        'Public Policy',
        'Civil Service Regulations'
      ],
      recommendedTraits: {
        respectfulness: 'professional' as const,
        formalityLevel: 'very_formal' as const,
        authorityRespect: 'high' as const
      },
      complianceLevel: 'moderate' as IslamicComplianceLevel,
      formalityLevel: 'very_formal' as const
    },
    cultural: {
      requiredKnowledge: [
        'Iraqi Cultural Heritage',
        'Traditional Arts',
        'Cultural Events',
        'Folklore and Literature',
        'Cultural Preservation'
      ],
      recommendedTraits: {
        respectfulness: 'traditional' as const,
        communityFocused: true,
        wisdomSharing: true,
        familyOriented: true
      },
      complianceLevel: 'moderate' as IslamicComplianceLevel,
      formalityLevel: 'moderate' as const
    },
    general: {
      requiredKnowledge: [
        'General Knowledge',
        'Iraqi Current Affairs',
        'Basic Iraqi History',
        'Common Cultural Practices',
        'General Assistance'
      ],
      recommendedTraits: {
        respectfulness: 'professional' as const,
        hospitality: 'moderate' as const,
        patientGuidance: true
      },
      complianceLevel: 'general' as IslamicComplianceLevel,
      formalityLevel: 'moderate' as const
    }
  };

  return domainMap[domain];
};

/**
 * Get professional title suggestions based on domain
 */
export const getProfessionalTitles = (domain: IraqiProfessionalDomain): {
  english: string[];
  arabic: string[];
} => {
  const titleMap = {
    legal: {
      english: [
        'Legal Advisor',
        'Senior Legal Consultant',
        'Legal Counsel',
        'Iraqi Law Specialist',
        'Legal Expert'
      ],
      arabic: [
        'المستشار القانوني',
        'مستشار قانوني أول',
        'المحامي الاستشاري',
        'أخصائي القانون العراقي',
        'الخبير القانوني'
      ]
    },
    medical: {
      english: [
        'Medical Professional',
        'Healthcare Specialist',
        'Clinical Advisor',
        'Medical Consultant',
        'Health Expert'
      ],
      arabic: [
        'الطبيب المحترف',
        'أخصائي الرعاية الصحية',
        'المستشار الطبي',
        'الطبيب الاستشاري',
        'خبير الصحة'
      ]
    },
    educational: {
      english: [
        'Educational Specialist',
        'Academic Advisor',
        'Learning Consultant',
        'Education Expert',
        'Curriculum Specialist'
      ],
      arabic: [
        'أخصائي التعليم',
        'المستشار الأكاديمي',
        'مستشار التعلم',
        'خبير التعليم',
        'أخصائي المناهج'
      ]
    },
    religious: {
      english: [
        'Islamic Scholar',
        'Religious Advisor',
        'Islamic Studies Expert',
        'Religious Counselor',
        'Islamic Guidance Specialist'
      ],
      arabic: [
        'العالم الإسلامي',
        'المستشار الديني',
        'خبير الدراسات الإسلامية',
        'المرشد الديني',
        'أخصائي التوجيه الإسلامي'
      ]
    },
    engineering: {
      english: [
        'Engineering Specialist',
        'Technical Consultant',
        'Engineering Expert',
        'Project Engineer',
        'Infrastructure Specialist'
      ],
      arabic: [
        'أخصائي الهندسة',
        'المستشار التقني',
        'الخبير الهندسي',
        'مهندس المشاريع',
        'أخصائي البنية التحتية'
      ]
    },
    business: {
      english: [
        'Business Advisor',
        'Commercial Consultant',
        'Business Development Expert',
        'Trade Specialist',
        'Economic Advisor'
      ],
      arabic: [
        'المستشار التجاري',
        'الاستشاري التجاري',
        'خبير تطوير الأعمال',
        'أخصائي التجارة',
        'المستشار الاقتصادي'
      ]
    },
    government: {
      english: [
        'Public Service Advisor',
        'Government Affairs Specialist',
        'Administrative Consultant',
        'Public Policy Expert',
        'Government Relations Advisor'
      ],
      arabic: [
        'مستشار الخدمة العامة',
        'أخصائي الشؤون الحكومية',
        'المستشار الإداري',
        'خبير السياسة العامة',
        'مستشار العلاقات الحكومية'
      ]
    },
    cultural: {
      english: [
        'Cultural Specialist',
        'Heritage Consultant',
        'Cultural Affairs Advisor',
        'Arts and Culture Expert',
        'Cultural Preservation Specialist'
      ],
      arabic: [
        'أخصائي الثقافة',
        'مستشار التراث',
        'مستشار الشؤون الثقافية',
        'خبير الفنون والثقافة',
        'أخصائي المحافظة على التراث'
      ]
    },
    general: {
      english: [
        'General Assistant',
        'Information Specialist',
        'General Consultant',
        'Support Specialist',
        'General Advisor'
      ],
      arabic: [
        'المساعد العام',
        'أخصائي المعلومات',
        'المستشار العام',
        'أخصائي الدعم',
        'المستشار العام'
      ]
    }
  };

  return titleMap[domain];
};

// ===== ARABIC TEXT PROCESSING UTILITIES =====

/**
 * Validates Arabic text for proper RTL formatting
 */
export const validateArabicText = (text: string): {
  isValid: boolean;
  issues: string[];
  correctedText?: string;
} => {
  const issues: string[] = [];
  let correctedText = text;

  // Check for Arabic characters
  const arabicPattern = /[\u0600-\u06FF]/;
  if (!arabicPattern.test(text)) {
    issues.push('Text does not contain Arabic characters');
  }

  // Check for mixed LTR/RTL issues
  const hasEnglish = /[a-zA-Z]/.test(text);
  const hasArabic = arabicPattern.test(text);
  
  if (hasEnglish && hasArabic) {
    // Mixed content - ensure proper formatting
    correctedText = text.replace(/([a-zA-Z]+)/g, '\u202D$1\u202C'); // Wrap English in LTR override
  }

  // Remove unnecessary whitespace
  correctedText = correctedText.replace(/\s+/g, ' ').trim();

  // Check for proper punctuation
  if (text.includes('؟') && text.includes('?')) {
    issues.push('Mixed Arabic and English punctuation');
    correctedText = correctedText.replace(/\?/g, '؟');
  }

  return {
    isValid: issues.length === 0,
    issues,
    correctedText: issues.length > 0 ? correctedText : undefined
  };
};

/**
 * Formats mixed Arabic-English text for proper display
 */
export const formatMixedText = (text: string): string => {
  // Wrap English words in LTR marks for proper RTL display
  return text.replace(/([a-zA-Z0-9][a-zA-Z0-9\s\-\.]*[a-zA-Z0-9])/g, '\u202D$1\u202C');
};

/**
 * Detects Iraqi dialect in Arabic text
 */
export const detectIraqiDialect = (text: string): {
  isIraqiDialect: boolean;
  confidence: number;
  region?: 'baghdad' | 'basra' | 'mosul' | 'general';
  dialectWords: string[];
} => {
  const dialectPatterns = {
    baghdad: ['شلونك', 'وين', 'شنو', 'هسه', 'كلش'],
    basra: ['شلونكم', 'ويش', 'شنهو', 'هسع', 'واجد'],
    mosul: ['كيفك', 'وين', 'شو', 'هلا', 'كتير'],
    general: ['شلون', 'وين', 'شنو', 'هسا', 'كثير']
  };

  let maxMatches = 0;
  let detectedRegion: 'baghdad' | 'basra' | 'mosul' | 'general' = 'general';
  let dialectWords: string[] = [];

  Object.entries(dialectPatterns).forEach(([region, words]) => {
    const matches = words.filter(word => text.includes(word));
    if (matches.length > maxMatches) {
      maxMatches = matches.length;
      detectedRegion = region as any;
      dialectWords = matches;
    }
  });

  const confidence = maxMatches > 0 ? Math.min(100, (maxMatches / 5) * 100) : 0;

  return {
    isIraqiDialect: maxMatches > 0,
    confidence,
    region: maxMatches > 0 ? detectedRegion : undefined,
    dialectWords
  };
};

// ===== PERFORMANCE UTILITIES =====

/**
 * Calculates persona performance score based on analytics
 */
export const calculatePerformanceScore = (analytics: PersonaAnalytics): {
  overall: number;
  breakdown: {
    usage: number;
    satisfaction: number;
    compliance: number;
    engagement: number;
  };
} => {
  const breakdown = {
    usage: Math.min(100, (analytics.usageCount / 100) * 100),
    satisfaction: analytics.userSatisfactionRating * 20,
    compliance: analytics.culturalComplianceScore,
    engagement: Math.min(100, (analytics.averageSessionLength / 600) * 100) // 10 minutes = 100%
  };

  const weights = {
    usage: 0.25,
    satisfaction: 0.35,
    compliance: 0.25,
    engagement: 0.15
  };

  const overall = Math.round(
    breakdown.usage * weights.usage +
    breakdown.satisfaction * weights.satisfaction +
    breakdown.compliance * weights.compliance +
    breakdown.engagement * weights.engagement
  );

  return {
    overall,
    breakdown
  };
};

/**
 * Optimizes persona configuration for better performance
 */
export const optimizePersonaConfig = (persona: IraqiPersona): {
  optimizedPersona: IraqiPersona;
  optimizations: string[];
} => {
  const optimizations: string[] = [];
  const optimized = { ...persona };

  // Optimize memory configuration based on domain
  if (persona.domain === 'medical' || persona.domain === 'legal') {
    if (optimized.memoryConfig.conversationHistory !== 'long') {
      optimized.memoryConfig.conversationHistory = 'long';
      optimizations.push('Extended memory for professional domain');
    }
  }

  // Optimize cultural traits for compliance
  if (persona.islamicCompliance === 'strict' && !persona.responsePatterns.islamicPrinciples) {
    optimized.responsePatterns.islamicPrinciples = true;
    optimizations.push('Enabled Islamic principles for strict compliance');
  }

  // Optimize greeting style consistency
  if (persona.culturalTraits.islamicGreetings && persona.responsePatterns.greetingStyle !== 'islamic') {
    optimized.responsePatterns.greetingStyle = 'islamic';
    optimizations.push('Aligned greeting style with Islamic greetings preference');
  }

  // Optimize formality level for domain
  const domainRequirements = getDomainRequirements(persona.domain);
  if (optimized.culturalTraits.formalityLevel !== domainRequirements.formalityLevel) {
    optimized.culturalTraits.formalityLevel = domainRequirements.formalityLevel;
    optimizations.push(`Adjusted formality level for ${persona.domain} domain`);
  }

  return {
    optimizedPersona: optimized,
    optimizations
  };
};

// ===== EXPORT/IMPORT UTILITIES =====

/**
 * Exports persona data to JSON format
 */
export const exportPersonaData = (personas: IraqiPersona[]): string => {
  const exportData = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    personas: personas.map(persona => ({
      ...persona,
      // Remove internal IDs and timestamps for clean export
      id: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      lastUsed: undefined
    }))
  };

  return JSON.stringify(exportData, null, 2);
};

/**
 * Imports persona data from JSON format
 */
export const importPersonaData = (jsonData: string): {
  personas: Partial<IraqiPersona>[];
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];
  let personas: Partial<IraqiPersona>[] = [];

  try {
    const data = JSON.parse(jsonData);

    if (!data.personas || !Array.isArray(data.personas)) {
      errors.push('Invalid format: personas array not found');
      return { personas: [], errors, warnings };
    }

    personas = data.personas.map((persona: any, index: number) => {
      const validationResult = validatePersonaForImport(persona, index);
      errors.push(...validationResult.errors);
      warnings.push(...validationResult.warnings);
      
      return validationResult.persona;
    });

  } catch (error) {
    errors.push(`JSON parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return { personas, errors, warnings };
};

/**
 * Validates imported persona data
 */
const validatePersonaForImport = (data: any, index: number): {
  persona: Partial<IraqiPersona>;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!data.name) {
    errors.push(`Persona ${index}: Missing name`);
  }

  if (!data.domain) {
    errors.push(`Persona ${index}: Missing domain`);
  }

  if (!data.culturalTraits) {
    warnings.push(`Persona ${index}: Missing cultural traits, using defaults`);
  }

  if (!data.responsePatterns) {
    warnings.push(`Persona ${index}: Missing response patterns, using defaults`);
  }

  return {
    persona: data,
    errors,
    warnings
  };
};

// ===== INTEGRATION UTILITIES =====

/**
 * Converts persona to API-compatible format
 */
export const toApiFormat = (persona: IraqiPersona): Record<string, any> => {
  return {
    id: persona.id,
    name: persona.name,
    arabic_name: persona.arabicName,
    domain: persona.domain,
    islamic_compliance: persona.islamicCompliance,
    cultural_traits: persona.culturalTraits,
    response_patterns: persona.responsePatterns,
    knowledge_areas: persona.knowledgeAreas,
    is_active: persona.isActive,
    created_at: persona.createdAt,
    updated_at: persona.updatedAt
  };
};

/**
 * Creates persona from API data
 */
export const fromApiFormat = (apiData: Record<string, any>): Partial<IraqiPersona> => {
  return {
    id: apiData.id,
    name: apiData.name,
    arabicName: apiData.arabic_name,
    domain: apiData.domain,
    islamicCompliance: apiData.islamic_compliance,
    culturalTraits: apiData.cultural_traits,
    responsePatterns: apiData.response_patterns,
    knowledgeAreas: apiData.knowledge_areas,
    isActive: apiData.is_active,
    createdAt: apiData.created_at ? new Date(apiData.created_at) : undefined,
    updatedAt: apiData.updated_at ? new Date(apiData.updated_at) : undefined
  };
};

// Export all utilities
export {
  validatePersonaName,
  calculateCulturalComplianceScore,
  getDomainRequirements,
  getProfessionalTitles,
  validateArabicText,
  formatMixedText,
  detectIraqiDialect,
  calculatePerformanceScore,
  optimizePersonaConfig,
  exportPersonaData,
  importPersonaData,
  toApiFormat,
  fromApiFormat
};