/**
 * Iraqi Persona Management Service
 * Enhanced for Iraqi AI Chat System
 * 
 * Features:
 * - Cultural personality traits implementation
 * - Islamic-compliant character behaviors
 * - Professional expertise validation
 * - Memory management with cultural context
 * - Response pattern optimization
 * - Performance analytics tracking
 */

import { 
  IraqiPersona, 
  PersonaTemplate, 
  IraqiCulturalTraits, 
  PersonaResponsePattern,
  IraqiProfessionalDomain,
  IslamicComplianceLevel,
  PersonaAnalytics,
  IRAQI_PERSONA_TEMPLATES
} from '../types/persona';

// Cultural Compliance Validation Service
export class CulturalComplianceService {
  /**
   * Validates persona response against Islamic principles
   */
  static validateIslamicCompliance(
    response: string, 
    complianceLevel: IslamicComplianceLevel
  ): { isCompliant: boolean; score: number; issues: string[] } {
    const issues: string[] = [];
    let score = 100;

    // Check for prohibited content based on compliance level
    const prohibitedPatterns = {
      strict: [
        /\b(alcohol|wine|beer|gambling|casino|lottery)\b/gi,
        /\b(interest|riba|usury)\b/gi,
        /\b(dating|boyfriend|girlfriend)\b/gi
      ],
      moderate: [
        /\b(gambling|casino)\b/gi,
        /\b(usury|riba)\b/gi
      ],
      general: [
        /\b(casino)\b/gi
      ],
      flexible: []
    };

    const patterns = prohibitedPatterns[complianceLevel] || [];
    
    patterns.forEach(pattern => {
      if (pattern.test(response)) {
        issues.push(`Contains content not aligned with Islamic principles (${complianceLevel} level)`);
        score -= 20;
      }
    });

    // Check for positive Islamic values
    const positivePatterns = [
      /\b(halal|blessed|inshallah|mashallah|alhamdulillah)\b/gi,
      /\b(peace|harmony|compassion|justice)\b/gi,
      /\b(family|community|respect|wisdom)\b/gi
    ];

    let positiveScore = 0;
    positivePatterns.forEach(pattern => {
      if (pattern.test(response)) {
        positiveScore += 5;
      }
    });

    score = Math.min(100, Math.max(0, score + positiveScore));

    return {
      isCompliant: score >= 70,
      score,
      issues
    };
  }

  /**
   * Validates cultural sensitivity
   */
  static validateCulturalSensitivity(
    response: string, 
    traits: IraqiCulturalTraits
  ): { isSensitive: boolean; score: number; suggestions: string[] } {
    const suggestions: string[] = [];
    let score = 100;

    // Check respect level
    if (traits.respectfulness === 'traditional') {
      if (!/\b(sir|madam|respected|honored|esteemed)\b/gi.test(response)) {
        suggestions.push('Consider adding respectful address terms');
        score -= 10;
      }
    }

    // Check hospitality level
    if (traits.hospitality === 'high') {
      if (!/\b(welcome|pleased|honored|happy)\b/gi.test(response)) {
        suggestions.push('Consider adding warm, welcoming language');
        score -= 10;
      }
    }

    // Check Islamic greetings usage
    if (traits.islamicGreetings) {
      if (!/\b(assalamu alaikum|barakallahu feek|may allah|inshallah)\b/gi.test(response)) {
        suggestions.push('Consider incorporating Islamic greetings or expressions');
        score -= 5;
      }
    }

    return {
      isSensitive: score >= 80,
      score,
      suggestions
    };
  }
}

// Professional Expertise Validation Service
export class ProfessionalExpertiseService {
  private static DOMAIN_KNOWLEDGE = {
    legal: [
      'iraqi civil code', 'commercial law', 'court procedures', 'legal documentation',
      'contract law', 'property law', 'family law', 'criminal law', 'administrative law'
    ],
    medical: [
      'iraqi medical association', 'ministry of health', 'medical ethics', 'patient care',
      'public health', 'clinical practice', 'medical diagnosis', 'treatment protocols'
    ],
    educational: [
      'iraqi curriculum', 'educational methods', 'student assessment', 'learning psychology',
      'educational technology', 'teaching strategies', 'educational administration'
    ],
    engineering: [
      'iraqi building code', 'engineering standards', 'infrastructure development',
      'project management', 'technical specifications', 'construction management'
    ],
    business: [
      'iraqi commercial law', 'business regulations', 'investment guidelines',
      'trade practices', 'economic development', 'market analysis', 'financial planning'
    ],
    government: [
      'public administration', 'government procedures', 'public policy', 'administrative law',
      'civil service', 'public services', 'governmental regulations'
    ],
    religious: [
      'islamic jurisprudence', 'quranic studies', 'hadith literature', 'islamic ethics',
      'religious counseling', 'islamic history', 'comparative religion'
    ],
    cultural: [
      'iraqi culture', 'cultural heritage', 'traditional arts', 'folklore',
      'cultural events', 'cultural preservation', 'artistic expression'
    ],
    general: [
      'general knowledge', 'common questions', 'basic assistance', 'information retrieval'
    ]
  };

  /**
   * Validates response against professional domain expertise
   */
  static validateProfessionalResponse(
    response: string,
    domain: IraqiProfessionalDomain,
    expertise: string[]
  ): { isAccurate: boolean; confidence: number; domainAlignment: number } {
    const domainTerms = this.DOMAIN_KNOWLEDGE[domain] || [];
    const responseWords = response.toLowerCase().split(/\s+/);
    
    let domainMatches = 0;
    let expertiseMatches = 0;
    
    // Check domain-specific terminology usage
    domainTerms.forEach(term => {
      if (response.toLowerCase().includes(term)) {
        domainMatches++;
      }
    });
    
    // Check expertise-specific terminology
    expertise.forEach(expertiseArea => {
      if (response.toLowerCase().includes(expertiseArea.toLowerCase())) {
        expertiseMatches++;
      }
    });
    
    const domainAlignment = Math.min(100, (domainMatches / Math.max(1, domainTerms.length)) * 100);
    const expertiseAlignment = Math.min(100, (expertiseMatches / Math.max(1, expertise.length)) * 100);
    const confidence = (domainAlignment + expertiseAlignment) / 2;
    
    return {
      isAccurate: confidence >= 60,
      confidence,
      domainAlignment
    };
  }
}

// Response Pattern Service
export class ResponsePatternService {
  /**
   * Applies cultural response patterns to text
   */
  static applyResponsePattern(
    baseResponse: string,
    patterns: PersonaResponsePattern,
    traits: IraqiCulturalTraits
  ): string {
    let enhancedResponse = baseResponse;

    // Apply greeting style
    if (patterns.greetingStyle === 'islamic') {
      if (!enhancedResponse.includes('assalamu alaikum')) {
        enhancedResponse = 'Assalamu alaikum wa rahmatullahi wa barakatuh. ' + enhancedResponse;
      }
    } else if (patterns.greetingStyle === 'professional') {
      if (!enhancedResponse.match(/^(hello|good|greetings)/i)) {
        enhancedResponse = 'Good day and welcome. ' + enhancedResponse;
      }
    }

    // Apply cultural references
    if (patterns.culturalReferences && traits.communityFocused) {
      enhancedResponse = this.addCulturalContext(enhancedResponse);
    }

    // Apply Islamic principles integration
    if (patterns.islamicPrinciples) {
      enhancedResponse = this.integrateIslamicPrinciples(enhancedResponse, traits.islamicGreetings);
    }

    // Apply explanation style
    if (patterns.explanationStyle === 'storytelling' && traits.wisdomSharing) {
      enhancedResponse = this.addWisdomContext(enhancedResponse);
    }

    return enhancedResponse;
  }

  private static addCulturalContext(response: string): string {
    const culturalPhrases = [
      'as we say in Iraq',
      'according to our Iraqi traditions',
      'in our beloved Iraq',
      'following our cultural values'
    ];
    
    const randomPhrase = culturalPhrases[Math.floor(Math.random() * culturalPhrases.length)];
    return response.replace(/\. ([A-Z])/g, `, ${randomPhrase}. $1`);
  }

  private static integrateIslamicPrinciples(response: string, useGreetings: boolean): string {
    let enhanced = response;
    
    if (useGreetings) {
      enhanced = enhanced.replace(/god willing/gi, 'inshallah');
      enhanced = enhanced.replace(/thank god/gi, 'alhamdulillah');
      enhanced = enhanced.replace(/god bless/gi, 'barakallahu feek');
    }

    // Add moral context where appropriate
    if (enhanced.includes('decision') || enhanced.includes('choice')) {
      enhanced += ' May Allah guide us to make the right decisions.';
    }

    return enhanced;
  }

  private static addWisdomContext(response: string): string {
    const wisdomPhrases = [
      'As our elders taught us',
      'From our experience in Iraq',
      'Drawing from traditional wisdom',
      'As they say in Arabic'
    ];
    
    const randomPhrase = wisdomPhrases[Math.floor(Math.random() * wisdomPhrases.length)];
    return `${randomPhrase}, ${response.charAt(0).toLowerCase() + response.slice(1)}`;
  }
}

// Memory Management Service with Cultural Context
export class PersonaMemoryService {
  private memoryStore: Map<string, Map<string, any>> = new Map();

  /**
   * Store culturally relevant information about user
   */
  storeCulturalPreference(
    personaId: string,
    userId: string,
    preference: {
      type: 'greeting' | 'formality' | 'language' | 'cultural_reference';
      value: any;
      context: string;
    }
  ): void {
    const personaMemory = this.memoryStore.get(personaId) || new Map();
    const userMemory = personaMemory.get(userId) || {};
    
    if (!userMemory.culturalPreferences) {
      userMemory.culturalPreferences = [];
    }
    
    userMemory.culturalPreferences.push({
      ...preference,
      timestamp: new Date(),
      confidence: 0.8
    });
    
    personaMemory.set(userId, userMemory);
    this.memoryStore.set(personaId, personaMemory);
  }

  /**
   * Retrieve user cultural preferences for persona adaptation
   */
  getCulturalPreferences(personaId: string, userId: string): any[] {
    const personaMemory = this.memoryStore.get(personaId);
    if (!personaMemory) return [];
    
    const userMemory = personaMemory.get(userId);
    return userMemory?.culturalPreferences || [];
  }

  /**
   * Store professional interaction context
   */
  storeProfessionalContext(
    personaId: string,
    userId: string,
    context: {
      domain: IraqiProfessionalDomain;
      topic: string;
      complexity: 'basic' | 'intermediate' | 'advanced';
      userExpertiseLevel: 'novice' | 'intermediate' | 'expert';
    }
  ): void {
    const personaMemory = this.memoryStore.get(personaId) || new Map();
    const userMemory = personaMemory.get(userId) || {};
    
    if (!userMemory.professionalHistory) {
      userMemory.professionalHistory = [];
    }
    
    userMemory.professionalHistory.push({
      ...context,
      timestamp: new Date(),
      sessionId: this.generateSessionId()
    });
    
    personaMemory.set(userId, userMemory);
    this.memoryStore.set(personaId, personaMemory);
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// Main Persona Management Service
export class IraqiPersonaService {
  private personas: Map<string, IraqiPersona> = new Map();
  private analytics: Map<string, PersonaAnalytics> = new Map();
  private memoryService = new PersonaMemoryService();

  /**
   * Create new Iraqi persona from template
   */
  createPersonaFromTemplate(
    templateId: string,
    customizations?: Partial<IraqiPersona>
  ): IraqiPersona {
    const template = IRAQI_PERSONA_TEMPLATES.find(t => t.id === templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const persona: IraqiPersona = {
      id: this.generatePersonaId(),
      name: template.name,
      arabicName: template.arabicName,
      title: `Professional ${template.domain} Specialist`,
      arabicTitle: `أخصائي ${template.arabicName}`,
      domain: template.domain,
      expertise: {
        domain: template.domain,
        level: 'mid',
        specializations: template.suggestedKnowledge,
        yearsExperience: 5
      },
      description: template.description,
      arabicDescription: template.arabicDescription,
      culturalTraits: {
        hospitality: 'moderate',
        respectfulness: 'professional',
        familyOriented: true,
        communityFocused: true,
        directness: 'diplomatic',
        formalityLevel: 'formal',
        arabicExpressions: true,
        islamicGreetings: false,
        authorityRespect: 'moderate',
        wisdomSharing: true,
        patientGuidance: true,
        moralGuidance: false,
        ...template.defaultTraits
      },
      islamicCompliance: 'moderate',
      dialectPreference: 'general',
      responsePatterns: {
        greetingStyle: 'professional',
        preferredGreetings: ['Welcome', 'Good day', 'How may I help you?'],
        explanationStyle: 'structured',
        questionHandling: 'guiding',
        errorResponse: 'explanatory',
        culturalReferences: true,
        islamicPrinciples: false,
        historicalContext: false,
        modernAdaptation: true,
        ...template.defaultPatterns
      },
      memoryConfig: {
        retainPersonalDetails: true,
        culturalPreferences: true,
        professionalContext: true,
        conversationHistory: 'medium',
        culturalSensitivity: true
      },
      systemPrompt: this.generateSystemPrompt(template),
      arabicSystemPrompt: this.generateArabicSystemPrompt(template),
      knowledgeAreas: template.suggestedKnowledge,
      commonQuestions: [],
      specializedVocabulary: [],
      regionalKnowledge: true,
      institutionalKnowledge: [],
      culturalEvents: true,
      currentAffairs: false,
      isActive: true,
      isDefault: false,
      visibility: 'public',
      tags: [template.domain, 'iraqi', 'professional'],
      createdAt: new Date(),
      updatedAt: new Date(),
      ...customizations
    };

    this.personas.set(persona.id, persona);
    this.initializeAnalytics(persona.id);
    
    return persona;
  }

  /**
   * Generate contextual response using persona
   */
  generateResponse(
    personaId: string,
    userMessage: string,
    userId: string,
    context?: any
  ): {
    response: string;
    culturalScore: number;
    professionalScore: number;
    compliance: any;
  } {
    const persona = this.personas.get(personaId);
    if (!persona) {
      throw new Error(`Persona ${personaId} not found`);
    }

    // Get user preferences for personalization
    const culturalPreferences = this.memoryService.getCulturalPreferences(personaId, userId);
    
    // Generate base response (this would integrate with actual AI model)
    let baseResponse = this.generateBaseResponse(userMessage, persona, context);
    
    // Apply persona patterns and cultural traits
    const enhancedResponse = ResponsePatternService.applyResponsePattern(
      baseResponse,
      persona.responsePatterns,
      persona.culturalTraits
    );

    // Validate cultural compliance
    const compliance = CulturalComplianceService.validateIslamicCompliance(
      enhancedResponse,
      persona.islamicCompliance
    );

    const culturalSensitivity = CulturalComplianceService.validateCulturalSensitivity(
      enhancedResponse,
      persona.culturalTraits
    );

    // Validate professional accuracy
    const professionalValidation = ProfessionalExpertiseService.validateProfessionalResponse(
      enhancedResponse,
      persona.domain,
      persona.expertise.specializations
    );

    // Update analytics
    this.updateAnalytics(personaId, compliance.score, professionalValidation.confidence);

    return {
      response: enhancedResponse,
      culturalScore: culturalSensitivity.score,
      professionalScore: professionalValidation.confidence,
      compliance: {
        islamic: compliance,
        cultural: culturalSensitivity,
        professional: professionalValidation
      }
    };
  }

  private generatePersonaId(): string {
    return 'persona_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private generateSystemPrompt(template: PersonaTemplate): string {
    return `You are ${template.name}, a professional ${template.domain} specialist in Iraq. 
    ${template.description}
    
    You should:
    - Provide expert guidance in ${template.domain}
    - Respect Iraqi cultural values and traditions
    - Maintain professional standards
    - Be helpful and patient with users
    - Use appropriate formality level
    
    Your expertise includes: ${template.suggestedKnowledge.join(', ')}`;
  }

  private generateArabicSystemPrompt(template: PersonaTemplate): string {
    return `أنت ${template.arabicName}، أخصائي محترف في ${template.domain} في العراق.
    ${template.arabicDescription}
    
    يجب عليك:
    - تقديم إرشادات الخبراء في ${template.domain}
    - احترام القيم والتقاليد الثقافية العراقية
    - الحفاظ على المعايير المهنية
    - كن مفيدًا وصبورًا مع المستخدمين
    - استخدم مستوى الرسمية المناسب`;
  }

  private generateBaseResponse(message: string, persona: IraqiPersona, context?: any): string {
    // This would integrate with actual AI model
    // For now, return a placeholder that incorporates persona characteristics
    return `Based on my expertise in ${persona.domain}, I understand your question about "${message}". Let me provide you with comprehensive guidance on this matter.`;
  }

  private initializeAnalytics(personaId: string): void {
    this.analytics.set(personaId, {
      personaId,
      usageCount: 0,
      lastUsed: new Date(),
      averageSessionLength: 0,
      topQuestionCategories: [],
      userSatisfactionRating: 0,
      culturalComplianceScore: 100
    });
  }

  private updateAnalytics(
    personaId: string,
    culturalScore: number,
    professionalScore: number
  ): void {
    const analytics = this.analytics.get(personaId);
    if (analytics) {
      analytics.usageCount++;
      analytics.lastUsed = new Date();
      analytics.culturalComplianceScore = (analytics.culturalComplianceScore + culturalScore) / 2;
      this.analytics.set(personaId, analytics);
    }
  }

  /**
   * Get all available personas
   */
  getAllPersonas(): IraqiPersona[] {
    return Array.from(this.personas.values());
  }

  /**
   * Get persona analytics
   */
  getPersonaAnalytics(personaId: string): PersonaAnalytics | undefined {
    return this.analytics.get(personaId);
  }

  /**
   * Update persona configuration
   */
  updatePersona(personaId: string, updates: Partial<IraqiPersona>): IraqiPersona {
    const persona = this.personas.get(personaId);
    if (!persona) {
      throw new Error(`Persona ${personaId} not found`);
    }

    const updatedPersona = {
      ...persona,
      ...updates,
      updatedAt: new Date()
    };

    this.personas.set(personaId, updatedPersona);
    return updatedPersona;
  }

  /**
   * Get personas by professional domain
   */
  getPersonasByDomain(domain: IraqiProfessionalDomain): IraqiPersona[] {
    return Array.from(this.personas.values()).filter(p => p.domain === domain);
  }
}

// Export singleton instance
export const personaService = new IraqiPersonaService();

// Export all service classes
export {
  CulturalComplianceService,
  ProfessionalExpertiseService,
  ResponsePatternService,
  PersonaMemoryService,
  IraqiPersonaService
};