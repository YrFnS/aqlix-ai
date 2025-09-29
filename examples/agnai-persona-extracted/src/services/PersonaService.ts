/**
 * Iraqi AI Persona Management Service
 * Comprehensive persona management with cultural compliance and Islamic values
 */

import {
  IraqiPersona,
  PersonaCreationRequest,
  PersonaUpdateRequest,
  PersonaFilter,
  PersonaMetrics,
  PersonaValidationResult,
  ValidationIssue,
  IraqiProfessionalPersonaTemplate,
  IraqiProfessionalDomain,
  IraqiGovernorate,
  PersonaID,
  CulturalScore,
  IslamicScore,
} from '../types/persona';

export class PersonaService {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  // ========================
  // Core Persona Management
  // ========================

  /**
   * Create new Iraqi persona with cultural validation
   */
  async createPersona(request: PersonaCreationRequest): Promise<IraqiPersona> {
    // Pre-creation validation
    const validationResult = await this.validatePersona(request);
    if (!validationResult.isValid) {
      throw new Error(
        `Persona validation failed: ${validationResult.issues.map(i => i.message).join(', ')}`
      );
    }

    const response = await fetch(`${this.baseUrl}/api/personas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
        'X-Cultural-Validation': 'required',
        'X-Islamic-Compliance': 'enforced',
      },
      body: JSON.stringify({
        ...request,
        culturalValidation: validationResult,
        createdAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to create persona: ${error.message || response.statusText}`);
    }

    const persona: IraqiPersona = await response.json();

    // Post-creation cultural compliance check
    await this.performCulturalComplianceCheck(persona.id);

    return persona;
  }

  /**
   * Update existing persona with cultural re-validation
   */
  async updatePersona(request: PersonaUpdateRequest): Promise<IraqiPersona> {
    // Validate updates
    const validationResult = await this.validatePersona(request as PersonaCreationRequest);
    if (!validationResult.isValid && validationResult.issues.some(i => i.severity === 'critical')) {
      throw new Error('Critical validation issues prevent persona update');
    }

    const response = await fetch(`${this.baseUrl}/api/personas/${request.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
        'X-Cultural-Revalidation': 'required',
        'X-Version': request.version,
      },
      body: JSON.stringify({
        ...request,
        updatedAt: new Date().toISOString(),
        validationResult,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to update persona: ${error.message || response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Get persona by ID with cultural context
   */
  async getPersona(id: PersonaID, includeCulturalMetrics = false): Promise<IraqiPersona | null> {
    const response = await fetch(
      `${this.baseUrl}/api/personas/${id}?includeCulturalMetrics=${includeCulturalMetrics}`,
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Accept-Language': 'ar,en',
        },
      }
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch persona: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * List personas with advanced filtering
   */
  async listPersonas(
    filter: PersonaFilter = {},
    page = 1,
    limit = 20
  ): Promise<{
    personas: IraqiPersona[];
    total: number;
    page: number;
    totalPages: number;
    metrics: PersonaMetrics;
  }> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...this.buildFilterQuery(filter),
    });

    const response = await fetch(`${this.baseUrl}/api/personas?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Accept-Language': 'ar,en',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to list personas: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Delete persona with cultural impact assessment
   */
  async deletePersona(id: PersonaID): Promise<{
    success: boolean;
    culturalImpactAssessment: {
      affectedUsers: number;
      professionalDomainImpact: string;
      recommendedReplacement?: PersonaID;
    };
  }> {
    // Pre-deletion impact assessment
    const impactAssessment = await this.assessDeletionImpact(id);

    const response = await fetch(`${this.baseUrl}/api/personas/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'X-Impact-Assessment': JSON.stringify(impactAssessment),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete persona: ${response.statusText}`);
    }

    return await response.json();
  }

  // ===============================
  // Cultural Validation & Compliance
  // ===============================

  /**
   * Validate persona for cultural and Islamic compliance
   */
  async validatePersona(
    persona: Partial<PersonaCreationRequest>
  ): Promise<PersonaValidationResult> {
    const response = await fetch(`${this.baseUrl}/api/personas/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
        'X-Validation-Level': 'comprehensive',
      },
      body: JSON.stringify(persona),
    });

    if (!response.ok) {
      throw new Error(`Validation failed: ${response.statusText}`);
    }

    const result: PersonaValidationResult = await response.json();

    // Ensure minimum compliance scores
    if (result.culturalComplianceScore < 95) {
      result.issues.push({
        type: 'cultural',
        severity: 'high',
        message: 'Cultural compliance score below required 95% threshold',
        messageArabic: 'درجة الامتثال الثقافي أقل من الحد المطلوب 95%',
        field: 'culturalProfile',
        suggestedFix:
          'Review cultural profile settings and ensure Iraqi cultural values are properly configured',
      });
    }

    if (result.islamicComplianceScore < 96) {
      result.issues.push({
        type: 'islamic',
        severity: 'critical',
        message: 'Islamic compliance score below required 96% threshold',
        messageArabic: 'درجة الامتثال الإسلامي أقل من الحد المطلوب 96%',
        field: 'islamicCompliance',
        suggestedFix:
          'Ensure all Islamic compliance settings are properly configured and halal content filtering is enabled',
      });
    }

    return result;
  }

  /**
   * Perform ongoing cultural compliance monitoring
   */
  async performCulturalComplianceCheck(personaId: PersonaID): Promise<{
    score: CulturalScore;
    islamicScore: IslamicScore;
    issues: ValidationIssue[];
    lastChecked: Date;
  }> {
    const response = await fetch(`${this.baseUrl}/api/personas/${personaId}/compliance-check`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'X-Check-Type': 'ongoing-monitoring',
      },
    });

    if (!response.ok) {
      throw new Error(`Compliance check failed: ${response.statusText}`);
    }

    return await response.json();
  }

  // =========================
  // Iraqi Professional Templates
  // =========================

  /**
   * Get pre-built Iraqi professional persona templates
   */
  async getProfessionalTemplates(
    domain?: IraqiProfessionalDomain
  ): Promise<IraqiProfessionalPersonaTemplate[]> {
    const queryParams = domain ? `?domain=${domain}` : '';

    const response = await fetch(`${this.baseUrl}/api/personas/templates${queryParams}`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Accept-Language': 'ar,en',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch templates: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Create persona from Iraqi professional template
   */
  async createFromTemplate(
    templateId: string,
    customizations: Partial<PersonaCreationRequest> = {},
    governorate: IraqiGovernorate = 'baghdad'
  ): Promise<IraqiPersona> {
    const response = await fetch(`${this.baseUrl}/api/personas/from-template`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
        'X-Template-Source': 'iraqi-professional',
      },
      body: JSON.stringify({
        templateId,
        governorate,
        customizations,
        culturalValidationRequired: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create from template: ${response.statusText}`);
    }

    const persona = await response.json();

    // Ensure template-created persona meets compliance
    const compliance = await this.performCulturalComplianceCheck(persona.id);
    if (compliance.score < 95 || compliance.islamicScore < 96) {
      throw new Error('Template-created persona failed compliance requirements');
    }

    return persona;
  }

  // ===============
  // Memory Management
  // ===============

  /**
   * Update persona memory settings
   */
  async updateMemorySettings(
    personaId: PersonaID,
    settings: Partial<IraqiPersona['memorySettings']>
  ): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/personas/${personaId}/memory`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error(`Failed to update memory settings: ${response.statusText}`);
    }
  }

  /**
   * Get persona conversation context
   */
  async getPersonaContext(
    personaId: PersonaID,
    userId?: string
  ): Promise<{
    shortTermMemory: any[];
    longTermMemory: any[];
    culturalContext: any;
    professionalContext: any;
    lastInteraction: Date;
  }> {
    const queryParams = userId ? `?userId=${userId}` : '';

    const response = await fetch(
      `${this.baseUrl}/api/personas/${personaId}/context${queryParams}`,
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch persona context: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Clear persona memory (with cultural data retention compliance)
   */
  async clearPersonaMemory(
    personaId: PersonaID,
    memoryType: 'short_term' | 'long_term' | 'cultural' | 'all' = 'short_term'
  ): Promise<{
    cleared: boolean;
    retainedForCompliance: any[];
    culturalDataImpact: string;
  }> {
    const response = await fetch(`${this.baseUrl}/api/personas/${personaId}/memory/clear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ memoryType }),
    });

    if (!response.ok) {
      throw new Error(`Failed to clear persona memory: ${response.statusText}`);
    }

    return await response.json();
  }

  // =============
  // Analytics & Metrics
  // =============

  /**
   * Get comprehensive persona metrics
   */
  async getPersonaMetrics(personaId?: PersonaID): Promise<PersonaMetrics> {
    const endpoint = personaId ? `/api/personas/${personaId}/metrics` : '/api/personas/metrics';

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch metrics: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Get cultural compliance trends
   */
  async getCulturalComplianceTrends(days = 30): Promise<{
    dailyScores: { date: string; culturalScore: number; islamicScore: number }[];
    averageCompliance: number;
    trendDirection: 'improving' | 'declining' | 'stable';
    recommendations: string[];
  }> {
    const response = await fetch(`${this.baseUrl}/api/personas/compliance-trends?days=${days}`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch compliance trends: ${response.statusText}`);
    }

    return await response.json();
  }

  // =================
  // Utility Methods
  // =================

  private buildFilterQuery(filter: PersonaFilter): Record<string, string> {
    const query: Record<string, string> = {};

    if (filter.professionalDomain?.length) {
      query.domains = filter.professionalDomain.join(',');
    }

    if (filter.governorate?.length) {
      query.governorates = filter.governorate.join(',');
    }

    if (filter.culturalCompliance !== undefined) {
      query.minCulturalCompliance = filter.culturalCompliance.toString();
    }

    if (filter.islamicCompliance !== undefined) {
      query.minIslamicCompliance = filter.islamicCompliance.toString();
    }

    if (filter.isActive !== undefined) {
      query.isActive = filter.isActive.toString();
    }

    if (filter.tags?.length) {
      query.tags = filter.tags.join(',');
    }

    if (filter.searchTerm) {
      query.search = filter.searchTerm;
    }

    return query;
  }

  private async assessDeletionImpact(personaId: PersonaID): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/personas/${personaId}/deletion-impact`, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to assess deletion impact: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Export persona for backup or migration
   */
  async exportPersona(
    personaId: PersonaID,
    includeMemory = false
  ): Promise<{
    persona: IraqiPersona;
    memory?: any;
    exportedAt: Date;
    version: string;
  }> {
    const response = await fetch(
      `${this.baseUrl}/api/personas/${personaId}/export?includeMemory=${includeMemory}`,
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to export persona: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Import persona from backup
   */
  async importPersona(exportData: any): Promise<IraqiPersona> {
    // Validate import data for cultural compliance
    const validationResult = await this.validatePersona(exportData.persona);
    if (!validationResult.isValid) {
      throw new Error('Imported persona failed cultural validation');
    }

    const response = await fetch(`${this.baseUrl}/api/personas/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
        'X-Import-Validation': JSON.stringify(validationResult),
      },
      body: JSON.stringify(exportData),
    });

    if (!response.ok) {
      throw new Error(`Failed to import persona: ${response.statusText}`);
    }

    return await response.json();
  }
}

// Export singleton instance helper
let personaServiceInstance: PersonaService | null = null;

export const getPersonaService = (baseUrl?: string, apiKey?: string): PersonaService => {
  if (!personaServiceInstance && baseUrl && apiKey) {
    personaServiceInstance = new PersonaService(baseUrl, apiKey);
  }

  if (!personaServiceInstance) {
    throw new Error(
      'PersonaService not initialized. Call getPersonaService with baseUrl and apiKey first.'
    );
  }

  return personaServiceInstance;
};
