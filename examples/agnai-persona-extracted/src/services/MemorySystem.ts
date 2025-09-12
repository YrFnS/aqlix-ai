/**
 * Iraqi AI Persona Memory Management System
 * Advanced memory system with cultural context retention and Arabic language support
 */

import { PersonaID, IraqiPersona } from '../types/persona';

export interface MemoryEntry {
  id: string;
  personaId: PersonaID;
  userId?: string;
  type: MemoryType;
  content: any;
  culturalContext?: CulturalMemoryContext;
  professionalContext?: ProfessionalMemoryContext;
  timestamp: Date;
  expiresAt?: Date;
  importance: MemoryImportance;
  tags: string[];
  language?: 'ar' | 'en' | 'mixed';
  metadata?: Record<string, any>;
}

export type MemoryType = 
  | 'conversation'        // Conversation history
  | 'preference'         // User preferences
  | 'fact'              // Factual information
  | 'cultural_adaptation' // Cultural learning
  | 'professional_knowledge' // Domain-specific knowledge
  | 'arabic_terminology'  // Arabic terms and expressions
  | 'relationship'       // Professional relationships
  | 'context_summary'    // Compressed conversation summaries
  | 'behavioral_pattern' // Learned behavior patterns
  | 'cultural_sensitivity'; // Cultural sensitivity learnings

export type MemoryImportance = 'low' | 'medium' | 'high' | 'critical';

export interface CulturalMemoryContext {
  dialectUsed?: 'baghdadi' | 'basrawi' | 'moslawi' | 'standard_arabic';
  formalityLevel?: 'formal' | 'semi_formal' | 'casual';
  culturalReferences?: string[];
  islamicContext?: {
    prayerTimeRelevant?: boolean;
    islamicGreetingsUsed?: boolean;
    religiousTopics?: string[];
  };
  socialContext?: {
    familyMentioned?: boolean;
    honorificsUsed?: string[];
    respectLevel?: number; // 1-10
  };
}

export interface ProfessionalMemoryContext {
  domain: string;
  specialization?: string;
  terminology?: string[];
  professionalRelationships?: {
    colleagues?: string[];
    superiors?: string[];
    clients?: string[];
  };
  expertise?: {
    topics: string[];
    confidenceLevel: number; // 1-10
  };
  ethicalGuidelines?: string[];
}

export interface MemoryQuery {
  personaId?: PersonaID;
  userId?: string;
  type?: MemoryType | MemoryType[];
  importance?: MemoryImportance | MemoryImportance[];
  tags?: string[];
  language?: 'ar' | 'en' | 'mixed';
  culturalContext?: Partial<CulturalMemoryContext>;
  professionalContext?: Partial<ProfessionalMemoryContext>;
  timeRange?: {
    from?: Date;
    to?: Date;
  };
  searchText?: string;
  limit?: number;
  offset?: number;
}

export interface MemoryStats {
  totalEntries: number;
  entriesByType: Record<MemoryType, number>;
  entriesByImportance: Record<MemoryImportance, number>;
  entriesByLanguage: Record<'ar' | 'en' | 'mixed', number>;
  averageImportance: number;
  oldestEntry?: Date;
  newestEntry?: Date;
  culturalAdaptationScore: number; // 0-100
  arabicTerminologyCount: number;
  professionalKnowledgeDepth: number; // 0-100
}

export interface MemoryCompressionResult {
  originalCount: number;
  compressedCount: number;
  compressionRatio: number;
  preservedImportantMemories: number;
  culturalContextPreserved: boolean;
  professionalContextPreserved: boolean;
}

export class MemorySystem {
  private baseUrl: string;
  private apiKey: string;
  private cache: Map<string, MemoryEntry[]> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  // =================
  // Core Memory CRUD
  // =================

  /**
   * Store a new memory entry with cultural context
   */
  async storeMemory(memory: Omit<MemoryEntry, 'id' | 'timestamp'>): Promise<MemoryEntry> {
    // Auto-detect language if not specified
    if (!memory.language && typeof memory.content === 'string') {
      memory.language = this.detectLanguage(memory.content);
    }

    // Auto-set importance based on cultural/professional context
    if (!memory.importance || memory.importance === 'medium') {
      memory.importance = this.calculateImportance(memory);
    }

    const response = await fetch(`${this.baseUrl}/api/memory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'X-Cultural-Context': 'preserve',
        'X-Professional-Context': 'maintain'
      },
      body: JSON.stringify({
        ...memory,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to store memory: ${response.statusText}`);
    }

    const storedMemory = await response.json();
    this.invalidateCache(memory.personaId);
    
    return storedMemory;
  }

  /**
   * Retrieve memories with advanced filtering
   */
  async getMemories(query: MemoryQuery): Promise<{
    memories: MemoryEntry[];
    total: number;
    stats: MemoryStats;
  }> {
    const cacheKey = this.buildCacheKey(query);
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      return {
        memories: cached,
        total: cached.length,
        stats: await this.calculateStats(query.personaId)
      };
    }

    const queryParams = new URLSearchParams();
    
    if (query.personaId) queryParams.set('personaId', query.personaId);
    if (query.userId) queryParams.set('userId', query.userId);
    if (query.type) {
      const types = Array.isArray(query.type) ? query.type : [query.type];
      queryParams.set('types', types.join(','));
    }
    if (query.importance) {
      const importance = Array.isArray(query.importance) ? query.importance : [query.importance];
      queryParams.set('importance', importance.join(','));
    }
    if (query.tags?.length) queryParams.set('tags', query.tags.join(','));
    if (query.language) queryParams.set('language', query.language);
    if (query.searchText) queryParams.set('search', query.searchText);
    if (query.limit) queryParams.set('limit', query.limit.toString());
    if (query.offset) queryParams.set('offset', query.offset.toString());
    
    if (query.timeRange) {
      if (query.timeRange.from) queryParams.set('from', query.timeRange.from.toISOString());
      if (query.timeRange.to) queryParams.set('to', query.timeRange.to.toISOString());
    }

    const response = await fetch(`${this.baseUrl}/api/memory?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Accept-Language': 'ar,en'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to retrieve memories: ${response.statusText}`);
    }

    const result = await response.json();
    
    // Cache results
    this.cache.set(cacheKey, result.memories);
    setTimeout(() => this.cache.delete(cacheKey), this.cacheTimeout);
    
    return result;
  }

  /**
   * Update existing memory entry
   */
  async updateMemory(id: string, updates: Partial<MemoryEntry>): Promise<MemoryEntry> {
    const response = await fetch(`${this.baseUrl}/api/memory/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        ...updates,
        updatedAt: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to update memory: ${response.statusText}`);
    }

    const updatedMemory = await response.json();
    this.invalidateCache(updatedMemory.personaId);
    
    return updatedMemory;
  }

  /**
   * Delete memory entry with cultural impact assessment
   */
  async deleteMemory(id: string): Promise<{
    success: boolean;
    culturalImpact: {
      culturalContextLost: boolean;
      professionalKnowledgeLost: boolean;
      arabicTerminologyLost: string[];
      relationshipDataLost: boolean;
    };
  }> {
    const response = await fetch(`${this.baseUrl}/api/memory/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'X-Impact-Assessment': 'required'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to delete memory: ${response.statusText}`);
    }

    const result = await response.json();
    this.cache.clear(); // Clear all cache after deletion
    
    return result;
  }

  // =======================
  // Cultural Context Management
  // =======================

  /**
   * Store cultural adaptation learning
   */
  async storeCulturalAdaptation(
    personaId: PersonaID,
    userId: string,
    adaptation: {
      trigger: string;
      userResponse: 'positive' | 'negative' | 'neutral';
      culturalElement: string;
      adaptationMade: string;
      effectiveness: number; // 1-10
    }
  ): Promise<MemoryEntry> {
    return this.storeMemory({
      personaId,
      userId,
      type: 'cultural_adaptation',
      content: adaptation,
      culturalContext: {
        culturalReferences: [adaptation.culturalElement]
      },
      importance: adaptation.effectiveness > 7 ? 'high' : 'medium',
      tags: ['cultural_learning', 'adaptation', adaptation.culturalElement]
    });
  }

  /**
   * Get cultural adaptation patterns
   */
  async getCulturalAdaptations(personaId: PersonaID, userId?: string): Promise<{
    adaptations: MemoryEntry[];
    patterns: {
      mostEffectiveAdaptations: string[];
      culturalElementsLearned: string[];
      userSatisfactionTrend: number[]; // Last 10 interactions
      recommendedImprovements: string[];
    };
  }> {
    const memories = await this.getMemories({
      personaId,
      userId,
      type: 'cultural_adaptation',
      importance: ['medium', 'high', 'critical']
    });

    const adaptations = memories.memories;
    
    // Analyze patterns
    const effectivenessScores = adaptations.map(a => a.content.effectiveness);
    const culturalElements = [...new Set(adaptations.map(a => a.content.culturalElement))];
    const mostEffective = adaptations
      .filter(a => a.content.effectiveness >= 8)
      .map(a => a.content.adaptationMade);

    const patterns = {
      mostEffectiveAdaptations: mostEffective,
      culturalElementsLearned: culturalElements,
      userSatisfactionTrend: effectivenessScores.slice(-10),
      recommendedImprovements: this.generateCulturalRecommendations(adaptations)
    };

    return { adaptations, patterns };
  }

  // =============================
  // Professional Knowledge Management
  // =============================

  /**
   * Store professional domain knowledge
   */
  async storeProfessionalKnowledge(
    personaId: PersonaID,
    knowledge: {
      domain: string;
      topic: string;
      content: any;
      source?: string;
      confidence: number; // 1-10
      terminology?: string[];
    }
  ): Promise<MemoryEntry> {
    return this.storeMemory({
      personaId,
      type: 'professional_knowledge',
      content: knowledge,
      professionalContext: {
        domain: knowledge.domain,
        terminology: knowledge.terminology,
        expertise: {
          topics: [knowledge.topic],
          confidenceLevel: knowledge.confidence
        }
      },
      importance: knowledge.confidence > 7 ? 'high' : 'medium',
      tags: ['professional', knowledge.domain, knowledge.topic]
    });
  }

  /**
   * Get professional knowledge for domain
   */
  async getProfessionalKnowledge(
    personaId: PersonaID,
    domain: string,
    topic?: string
  ): Promise<{
    knowledge: MemoryEntry[];
    expertise: {
      totalTopics: number;
      averageConfidence: number;
      strongestAreas: string[];
      improvementAreas: string[];
      terminologyMastered: string[];
    };
  }> {
    const memories = await this.getMemories({
      personaId,
      type: 'professional_knowledge',
      professionalContext: { domain }
    });

    let knowledge = memories.memories;
    
    if (topic) {
      knowledge = knowledge.filter(m => 
        m.content.topic.toLowerCase().includes(topic.toLowerCase())
      );
    }

    // Analyze expertise
    const confidenceScores = knowledge.map(k => k.content.confidence);
    const topics = [...new Set(knowledge.map(k => k.content.topic))];
    const terminology = [...new Set(knowledge.flatMap(k => k.content.terminology || []))];
    
    const avgConfidence = confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length || 0;
    const strongAreas = knowledge
      .filter(k => k.content.confidence >= 8)
      .map(k => k.content.topic);
    const weakAreas = knowledge
      .filter(k => k.content.confidence <= 5)
      .map(k => k.content.topic);

    const expertise = {
      totalTopics: topics.length,
      averageConfidence: avgConfidence,
      strongestAreas: [...new Set(strongAreas)],
      improvementAreas: [...new Set(weakAreas)],
      terminologyMastered: terminology
    };

    return { knowledge, expertise };
  }

  // =======================
  // Arabic Language Management
  // =======================

  /**
   * Store Arabic terminology and expressions
   */
  async storeArabicTerminology(
    personaId: PersonaID,
    userId: string,
    terminology: {
      arabicTerm: string;
      englishTranslation: string;
      context: string;
      dialect?: 'baghdadi' | 'basrawi' | 'moslawi' | 'standard_arabic';
      professionalDomain?: string;
      usage: 'formal' | 'informal' | 'professional' | 'cultural';
      frequency: number; // How often it's used
    }
  ): Promise<MemoryEntry> {
    return this.storeMemory({
      personaId,
      userId,
      type: 'arabic_terminology',
      content: terminology,
      culturalContext: {
        dialectUsed: terminology.dialect,
        formalityLevel: terminology.usage === 'formal' ? 'formal' : 
                       terminology.usage === 'professional' ? 'semi_formal' : 'casual'
      },
      professionalContext: terminology.professionalDomain ? {
        domain: terminology.professionalDomain,
        terminology: [terminology.arabicTerm]
      } : undefined,
      importance: terminology.frequency > 3 ? 'high' : 'medium',
      tags: ['arabic', 'terminology', terminology.usage, terminology.dialect || 'standard'],
      language: 'mixed'
    });
  }

  /**
   * Get Arabic terminology for context
   */
  async getArabicTerminology(
    personaId: PersonaID,
    context?: {
      dialect?: string;
      domain?: string;
      usage?: string;
      searchTerm?: string;
    }
  ): Promise<{
    terminology: MemoryEntry[];
    stats: {
      totalTerms: number;
      dialectDistribution: Record<string, number>;
      usageDistribution: Record<string, number>;
      domainDistribution: Record<string, number>;
      mostFrequentTerms: string[];
    };
  }> {
    const query: MemoryQuery = {
      personaId,
      type: 'arabic_terminology'
    };

    if (context?.searchTerm) {
      query.searchText = context.searchTerm;
    }

    const memories = await this.getMemories(query);
    let terminology = memories.memories;

    // Apply additional filters
    if (context?.dialect) {
      terminology = terminology.filter(t => 
        t.culturalContext?.dialectUsed === context.dialect
      );
    }

    if (context?.domain) {
      terminology = terminology.filter(t => 
        t.professionalContext?.domain === context.domain
      );
    }

    if (context?.usage) {
      terminology = terminology.filter(t => 
        t.content.usage === context.usage
      );
    }

    // Calculate stats
    const dialects = terminology.map(t => t.culturalContext?.dialectUsed || 'standard');
    const usages = terminology.map(t => t.content.usage);
    const domains = terminology.map(t => t.professionalContext?.domain || 'general');
    const frequencies = terminology.map(t => ({ term: t.content.arabicTerm, freq: t.content.frequency }));
    
    const stats = {
      totalTerms: terminology.length,
      dialectDistribution: this.countOccurrences(dialects),
      usageDistribution: this.countOccurrences(usages),
      domainDistribution: this.countOccurrences(domains),
      mostFrequentTerms: frequencies
        .sort((a, b) => b.freq - a.freq)
        .slice(0, 10)
        .map(f => f.term)
    };

    return { terminology, stats };
  }

  // ===================
  // Memory Optimization
  // ===================

  /**
   * Compress old memories while preserving important cultural context
   */
  async compressMemories(
    personaId: PersonaID,
    options: {
      olderThanDays?: number;
      preserveImportance?: MemoryImportance[];
      preserveCulturalContext?: boolean;
      preserveProfessionalContext?: boolean;
      compressionRatio?: number; // 0-1, target compression
    } = {}
  ): Promise<MemoryCompressionResult> {
    const {
      olderThanDays = 30,
      preserveImportance = ['high', 'critical'],
      preserveCulturalContext = true,
      preserveProfessionalContext = true,
      compressionRatio = 0.7
    } = options;

    const response = await fetch(`${this.baseUrl}/api/memory/${personaId}/compress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'X-Cultural-Preservation': preserveCulturalContext ? 'required' : 'optional',
        'X-Professional-Preservation': preserveProfessionalContext ? 'required' : 'optional'
      },
      body: JSON.stringify({
        olderThanDays,
        preserveImportance,
        targetCompressionRatio: compressionRatio
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to compress memories: ${response.statusText}`);
    }

    const result = await response.json();
    this.invalidateCache(personaId);
    
    return result;
  }

  /**
   * Generate intelligent summaries of conversation history
   */
  async generateContextSummary(
    personaId: PersonaID,
    userId: string,
    timeRange: { from: Date; to: Date }
  ): Promise<{
    summary: string;
    summaryArabic?: string;
    keyTopics: string[];
    culturalInsights: string[];
    professionalInsights: string[];
    importantTerminology: string[];
    relationshipDevelopment: string;
  }> {
    const response = await fetch(`${this.baseUrl}/api/memory/${personaId}/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'Accept-Language': 'ar,en'
      },
      body: JSON.stringify({
        userId,
        timeRange: {
          from: timeRange.from.toISOString(),
          to: timeRange.to.toISOString()
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to generate summary: ${response.statusText}`);
    }

    return await response.json();
  }

  // ===============
  // Utility Methods
  // ===============

  private detectLanguage(text: string): 'ar' | 'en' | 'mixed' {
    const arabicCharRegex = /[\u0600-\u06FF]/;
    const englishCharRegex = /[A-Za-z]/;
    
    const hasArabic = arabicCharRegex.test(text);
    const hasEnglish = englishCharRegex.test(text);
    
    if (hasArabic && hasEnglish) return 'mixed';
    if (hasArabic) return 'ar';
    if (hasEnglish) return 'en';
    return 'en'; // default
  }

  private calculateImportance(memory: Partial<MemoryEntry>): MemoryImportance {
    let score = 0;
    
    // Base scores by type
    const typeScores: Record<MemoryType, number> = {
      'critical': 10,
      'cultural_adaptation': 8,
      'professional_knowledge': 7,
      'arabic_terminology': 6,
      'relationship': 6,
      'preference': 5,
      'fact': 4,
      'conversation': 3,
      'behavioral_pattern': 5,
      'cultural_sensitivity': 7,
      'context_summary': 4
    };
    
    if (memory.type && typeScores[memory.type]) {
      score += typeScores[memory.type];
    }
    
    // Cultural context adds importance
    if (memory.culturalContext) {
      score += 2;
      if (memory.culturalContext.islamicContext) score += 1;
    }
    
    // Professional context adds importance
    if (memory.professionalContext) {
      score += 2;
    }
    
    // Arabic language adds importance
    if (memory.language === 'ar' || memory.language === 'mixed') {
      score += 1;
    }
    
    if (score >= 8) return 'critical';
    if (score >= 6) return 'high';
    if (score >= 4) return 'medium';
    return 'low';
  }

  private async calculateStats(personaId?: PersonaID): Promise<MemoryStats> {
    const endpoint = personaId 
      ? `/api/memory/${personaId}/stats`
      : '/api/memory/stats';
      
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to calculate stats: ${response.statusText}`);
    }

    return await response.json();
  }

  private generateCulturalRecommendations(adaptations: MemoryEntry[]): string[] {
    const recommendations: string[] = [];
    
    // Analyze adaptation patterns
    const lowEffectiveness = adaptations.filter(a => a.content.effectiveness < 6);
    const highEffectiveness = adaptations.filter(a => a.content.effectiveness >= 8);
    
    if (lowEffectiveness.length > 0) {
      recommendations.push('Consider adjusting cultural adaptation strategies for better user satisfaction');
    }
    
    if (highEffectiveness.length > 0) {
      const successfulElements = highEffectiveness.map(a => a.content.culturalElement);
      recommendations.push(`Continue using successful cultural elements: ${successfulElements.join(', ')}`);
    }
    
    return recommendations;
  }

  private countOccurrences<T>(items: T[]): Record<string, number> {
    return items.reduce((acc, item) => {
      const key = String(item);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private buildCacheKey(query: MemoryQuery): string {
    return JSON.stringify(query);
  }

  private invalidateCache(personaId: PersonaID): void {
    // Remove all cache entries related to this persona
    for (const [key] of this.cache.entries()) {
      if (key.includes(personaId)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Export memory data for backup
   */
  async exportMemories(personaId: PersonaID): Promise<{
    memories: MemoryEntry[];
    stats: MemoryStats;
    exportedAt: Date;
    culturalContext: any;
    professionalContext: any;
  }> {
    const response = await fetch(`${this.baseUrl}/api/memory/${personaId}/export`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to export memories: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Import memory data from backup
   */
  async importMemories(
    personaId: PersonaID,
    exportData: any,
    options: {
      mergeStrategy: 'replace' | 'merge' | 'append';
      preserveTimestamps: boolean;
      validateCulturalContext: boolean;
    } = {
      mergeStrategy: 'merge',
      preserveTimestamps: true,
      validateCulturalContext: true
    }
  ): Promise<{
    imported: number;
    skipped: number;
    errors: string[];
    culturalContextPreserved: boolean;
  }> {
    const response = await fetch(`${this.baseUrl}/api/memory/${personaId}/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'X-Cultural-Validation': options.validateCulturalContext ? 'required' : 'skip'
      },
      body: JSON.stringify({
        exportData,
        options
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to import memories: ${response.statusText}`);
    }

    const result = await response.json();
    this.invalidateCache(personaId);
    
    return result;
  }
}

// Export singleton instance helper
let memorySystemInstance: MemorySystem | null = null;

export const getMemorySystem = (baseUrl?: string, apiKey?: string): MemorySystem => {
  if (!memorySystemInstance && baseUrl && apiKey) {
    memorySystemInstance = new MemorySystem(baseUrl, apiKey);
  }
  
  if (!memorySystemInstance) {
    throw new Error('MemorySystem not initialized. Call getMemorySystem with baseUrl and apiKey first.');
  }
  
  return memorySystemInstance;
};