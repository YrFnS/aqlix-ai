/**
 * Iraqi Cultural Content Filter Service
 * Extracted and enhanced from anything-llm with Iraqi cultural context
 * 
 * Features:
 * - Islamic compliance filtering with configurable strictness
 * - Political neutrality detection and filtering
 * - Cultural sensitivity analysis and content moderation
 * - Arabic text cultural context validation
 * - Professional domain content appropriateness
 * - Iraqi dialect and cultural reference preservation
 */

export interface CulturalFilterConfig {
  islamicCompliance: {
    enabled: boolean;
    strictness: 'lenient' | 'moderate' | 'strict';
    preserveEducationalContent: boolean;
    allowHistoricalReferences: boolean;
  };
  politicalNeutrality: {
    enabled: boolean;
    blockSectarian: boolean;
    blockTribal: boolean;
    blockPartisan: boolean;
    allowNeutralGovernment: boolean;
  };
  culturalSensitivity: {
    enabled: boolean;
    preserveIraqiCulture: boolean;
    respectFamilyValues: boolean;
    filterInappropriate: boolean;
  };
  professionalDomains: {
    enabled: boolean;
    requireProfessionalContext: boolean;
    enhanceTerminology: boolean;
  };
  contentModeration: {
    enabled: boolean;
    filterLevel: 'basic' | 'enhanced' | 'comprehensive';
    preserveContext: boolean;
  };
}

export interface CulturalAnalysis {
  islamicCompliance: {
    score: number; // 0-100
    violations: string[];
    suggestions: string[];
    preservedElements: string[];
  };
  politicalNeutrality: {
    score: number; // 0-100
    sensitivePhrases: string[];
    neutralAlternatives: string[];
    riskLevel: 'low' | 'medium' | 'high';
  };
  culturalSensitivity: {
    score: number; // 0-100
    culturalReferences: string[];
    inappropriateContent: string[];
    culturalEnhancements: string[];
  };
  overallScore: number; // 0-100
  recommendations: string[];
  filteredContent?: string;
  preservedOriginal?: string;
}

export interface ContentModerationResult {
  allowed: boolean;
  confidence: number;
  modifications: {
    removedContent: string[];
    replacedContent: Array<{ original: string; replacement: string; reason: string }>;
    addedContext: string[];
  };
  culturalAnalysis: CulturalAnalysis;
  professionalContext?: {
    domain: string;
    appropriateness: number;
    terminology: string[];
  };
}

export class IraqiCulturalContentFilter {
  private islamicTerms = {
    positive: [
      'الله', 'محمد', 'الإسلام', 'القرآن', 'السنة', 'الحديث', 'الصلاة', 'الزكاة',
      'الحج', 'الصوم', 'رمضان', 'المسجد', 'الجامع', 'الإمام', 'الخطبة',
      'البركة', 'الرحمة', 'المغفرة', 'التوبة', 'الصبر', 'الشكر', 'العدل',
      'Allah', 'Muhammad', 'Islam', 'Quran', 'Sunnah', 'Hadith', 'Prayer', 'Salah',
      'Zakat', 'Hajj', 'Fasting', 'Ramadan', 'Mosque', 'Imam', 'Khutbah',
      'Barakah', 'Mercy', 'Forgiveness', 'Repentance', 'Patience', 'Gratitude', 'Justice'
    ],
    sensitive: [
      'خمر', 'كحول', 'قمار', 'ميسر', 'ربا', 'فائدة', 'زنا', 'فحش',
      'alcohol', 'gambling', 'interest', 'usury', 'adultery', 'indecency'
    ],
    contextDependent: [
      'جهاد', 'شهيد', 'كافر', 'مؤمن', 'دين', 'عقيدة', 'فتوى', 'حلال', 'حرام',
      'jihad', 'martyr', 'believer', 'religion', 'creed', 'fatwa', 'halal', 'haram'
    ]
  };

  private politicalTerms = {
    sectarian: [
      'سني', 'شيعي', 'طائفي', 'مذهبي', 'فرقة',
      'sunni', 'shia', 'sectarian', 'denominational', 'sect'
    ],
    tribal: [
      'عشيرة', 'قبيلة', 'عشائري', 'قبلي', 'شيخ عشيرة',
      'tribe', 'tribal', 'clan', 'sheikh'
    ],
    partisan: [
      'حزب', 'سياسي', 'انتخابات', 'مرشح', 'حكومة',
      'party', 'political', 'elections', 'candidate', 'government'
    ],
    sensitive: [
      'انقلاب', 'ثورة', 'احتلال', 'مقاومة', 'تمرد',
      'coup', 'revolution', 'occupation', 'resistance', 'rebellion'
    ]
  };

  private iraqiCulturalTerms = {
    positive: [
      'ضيافة', 'كرم', 'شهامة', 'مروءة', 'أخلاق', 'تقاليد', 'عادات',
      'hospitality', 'generosity', 'chivalry', 'nobility', 'morals', 'traditions', 'customs'
    ],
    familyValues: [
      'أسرة', 'عائلة', 'أب', 'أم', 'ولد', 'بنت', 'جد', 'جدة', 'أخ', 'أخت',
      'family', 'father', 'mother', 'son', 'daughter', 'grandfather', 'grandmother', 'brother', 'sister'
    ],
    professional: [
      'عمل', 'مهنة', 'وظيفة', 'خبرة', 'مهارة', 'تعليم', 'تدريب',
      'work', 'profession', 'job', 'experience', 'skill', 'education', 'training'
    ]
  };

  private inappropriateContent = [
    'explicit sexual content',
    'violence against civilians',
    'hate speech',
    'discrimination',
    'extremist content',
    'محتوى جنسي صريح',
    'عنف ضد المدنيين',
    'خطاب كراهية',
    'تمييز',
    'محتوى متطرف'
  ];

  constructor(private config: CulturalFilterConfig) {}

  /**
   * Filter content based on Iraqi cultural standards
   */
  async filterContent(content: string, context?: {
    professionalDomain?: 'legal' | 'medical' | 'educational' | 'business' | 'engineering';
    userRole?: 'student' | 'professional' | 'educator' | 'general';
    contentType?: 'document' | 'chat' | 'query' | 'response';
  }): Promise<ContentModerationResult> {
    try {
      // Perform cultural analysis
      const culturalAnalysis = await this.analyzeCulturalContent(content, context);
      
      // Determine if content is allowed
      const allowed = this.determineContentAllowance(culturalAnalysis);
      
      // Apply content modifications if needed
      const modifications = await this.applyContentModifications(content, culturalAnalysis, context);
      
      // Calculate professional context if applicable
      const professionalContext = context?.professionalDomain ? 
        await this.analyzeProfessionalContext(content, context.professionalDomain) : undefined;

      return {
        allowed,
        confidence: this.calculateConfidence(culturalAnalysis),
        modifications,
        culturalAnalysis,
        professionalContext,
      };
    } catch (error) {
      console.error('Error filtering content:', error);
      throw new Error('Failed to filter content');
    }
  }

  /**
   * Analyze cultural aspects of content
   */
  private async analyzeCulturalContent(
    content: string,
    context?: any
  ): Promise<CulturalAnalysis> {
    const islamicAnalysis = this.analyzeIslamicCompliance(content);
    const politicalAnalysis = this.analyzePoliticalNeutrality(content);
    const culturalSensitivityAnalysis = this.analyzeCulturalSensitivity(content);
    
    const overallScore = Math.round(
      (islamicAnalysis.score * 0.4) +
      (politicalAnalysis.score * 0.3) +
      (culturalSensitivityAnalysis.score * 0.3)
    );

    const recommendations = [
      ...islamicAnalysis.suggestions,
      ...politicalAnalysis.neutralAlternatives,
      ...culturalSensitivityAnalysis.culturalEnhancements
    ];

    return {
      islamicCompliance: islamicAnalysis,
      politicalNeutrality: politicalAnalysis,
      culturalSensitivity: culturalSensitivityAnalysis,
      overallScore,
      recommendations: recommendations.slice(0, 10), // Limit recommendations
    };
  }

  /**
   * Analyze Islamic compliance of content
   */
  private analyzeIslamicCompliance(content: string): CulturalAnalysis['islamicCompliance'] {
    let score = 100;
    const violations: string[] = [];
    const suggestions: string[] = [];
    const preservedElements: string[] = [];

    if (!this.config.islamicCompliance.enabled) {
      return { score: 100, violations, suggestions, preservedElements };
    }

    const lowerContent = content.toLowerCase();

    // Check for Islamic positive elements
    this.islamicTerms.positive.forEach(term => {
      if (lowerContent.includes(term.toLowerCase())) {
        preservedElements.push(term);
      }
    });

    // Check for sensitive content based on strictness
    this.islamicTerms.sensitive.forEach(term => {
      if (lowerContent.includes(term.toLowerCase())) {
        const severity = this.config.islamicCompliance.strictness === 'strict' ? 20 :
                        this.config.islamicCompliance.strictness === 'moderate' ? 10 : 5;
        
        score -= severity;
        violations.push(`Contains sensitive term: ${term}`);
        
        if (this.config.islamicCompliance.strictness === 'strict') {
          suggestions.push(`Consider removing or providing Islamic context for: ${term}`);
        } else {
          suggestions.push(`Consider adding Islamic perspective or context for: ${term}`);
        }
      }
    });

    // Context-dependent terms analysis
    this.islamicTerms.contextDependent.forEach(term => {
      if (lowerContent.includes(term.toLowerCase())) {
        const hasProperContext = this.hasIslamicContext(content, term);
        if (!hasProperContext && this.config.islamicCompliance.strictness !== 'lenient') {
          score -= 5;
          suggestions.push(`Provide proper Islamic context for: ${term}`);
        } else if (hasProperContext) {
          preservedElements.push(term);
        }
      }
    });

    // Educational content preservation
    if (this.config.islamicCompliance.preserveEducationalContent) {
      const isEducational = this.isEducationalContent(content);
      if (isEducational) {
        score = Math.max(score, 70); // Minimum score for educational content
        suggestions.push('Educational content detected - maintaining with Islamic perspective');
      }
    }

    return {
      score: Math.max(score, 0),
      violations,
      suggestions,
      preservedElements
    };
  }

  /**
   * Analyze political neutrality of content
   */
  private analyzePoliticalNeutrality(content: string): CulturalAnalysis['politicalNeutrality'] {
    let score = 100;
    const sensitivePhrases: string[] = [];
    const neutralAlternatives: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';

    if (!this.config.politicalNeutrality.enabled) {
      return { score: 100, sensitivePhrases, neutralAlternatives, riskLevel: 'low' };
    }

    const lowerContent = content.toLowerCase();

    // Check sectarian content
    if (this.config.politicalNeutrality.blockSectarian) {
      this.politicalTerms.sectarian.forEach(term => {
        if (lowerContent.includes(term.toLowerCase())) {
          score -= 15;
          sensitivePhrases.push(term);
          neutralAlternatives.push(`Iraqi citizen/community instead of ${term}`);
          riskLevel = 'medium';
        }
      });
    }

    // Check tribal content
    if (this.config.politicalNeutrality.blockTribal) {
      this.politicalTerms.tribal.forEach(term => {
        if (lowerContent.includes(term.toLowerCase())) {
          score -= 10;
          sensitivePhrases.push(term);
          neutralAlternatives.push(`Community leader instead of ${term}`);
          riskLevel = Math.max(riskLevel === 'high' ? 'high' : 'medium', riskLevel as any) as 'low' | 'medium' | 'high';
        }
      });
    }

    // Check partisan content
    if (this.config.politicalNeutrality.blockPartisan) {
      this.politicalTerms.partisan.forEach(term => {
        if (lowerContent.includes(term.toLowerCase()) && !this.isNeutralGovernmentContext(content, term)) {
          score -= 12;
          sensitivePhrases.push(term);
          neutralAlternatives.push(`Public administration instead of ${term}`);
          riskLevel = 'medium';
        }
      });
    }

    // Check highly sensitive content
    this.politicalTerms.sensitive.forEach(term => {
      if (lowerContent.includes(term.toLowerCase())) {
        score -= 25;
        sensitivePhrases.push(term);
        neutralAlternatives.push(`Historical context or neutral reference for ${term}`);
        riskLevel = 'high';
      }
    });

    return {
      score: Math.max(score, 0),
      sensitivePhrases,
      neutralAlternatives,
      riskLevel
    };
  }

  /**
   * Analyze cultural sensitivity of content
   */
  private analyzeCulturalSensitivity(content: string): CulturalAnalysis['culturalSensitivity'] {
    let score = 100;
    const culturalReferences: string[] = [];
    const inappropriateContent: string[] = [];
    const culturalEnhancements: string[] = [];

    if (!this.config.culturalSensitivity.enabled) {
      return { score: 100, culturalReferences, inappropriateContent, culturalEnhancements };
    }

    const lowerContent = content.toLowerCase();

    // Identify positive cultural references
    this.iraqiCulturalTerms.positive.forEach(term => {
      if (lowerContent.includes(term.toLowerCase())) {
        culturalReferences.push(term);
        score += 2; // Bonus for cultural positivity
      }
    });

    // Check family values preservation
    if (this.config.culturalSensitivity.respectFamilyValues) {
      const familyReferences = this.iraqiCulturalTerms.familyValues.filter(term =>
        lowerContent.includes(term.toLowerCase())
      );
      culturalReferences.push(...familyReferences);
      
      if (familyReferences.length > 0) {
        culturalEnhancements.push('Content respects Iraqi family values');
      }
    }

    // Check for inappropriate content
    if (this.config.culturalSensitivity.filterInappropriate) {
      this.inappropriateContent.forEach(term => {
        if (lowerContent.includes(term.toLowerCase())) {
          score -= 20;
          inappropriateContent.push(term);
          culturalEnhancements.push(`Remove or provide appropriate context for: ${term}`);
        }
      });
    }

    // Preserve Iraqi culture elements
    if (this.config.culturalSensitivity.preserveIraqiCulture) {
      const hasIraqiCulture = this.hasIraqiCulturalElements(content);
      if (hasIraqiCulture) {
        culturalEnhancements.push('Content preserves Iraqi cultural elements');
      } else {
        culturalEnhancements.push('Consider adding Iraqi cultural context');
      }
    }

    return {
      score: Math.min(Math.max(score, 0), 100),
      culturalReferences,
      inappropriateContent,
      culturalEnhancements
    };
  }

  /**
   * Determine if content should be allowed
   */
  private determineContentAllowance(analysis: CulturalAnalysis): boolean {
    const minScore = this.config.contentModeration.filterLevel === 'comprehensive' ? 80 :
                    this.config.contentModeration.filterLevel === 'enhanced' ? 70 : 60;

    // Must pass all critical checks
    const passesIslamic = !this.config.islamicCompliance.enabled || 
                         analysis.islamicCompliance.score >= (this.config.islamicCompliance.strictness === 'strict' ? 85 : 70);
    
    const passesPolitical = !this.config.politicalNeutrality.enabled || 
                           analysis.politicalNeutrality.riskLevel !== 'high';
    
    const passesCultural = !this.config.culturalSensitivity.enabled || 
                          analysis.culturalSensitivity.inappropriateContent.length === 0;

    return analysis.overallScore >= minScore && passesIslamic && passesPolitical && passesCultural;
  }

  /**
   * Apply content modifications
   */
  private async applyContentModifications(
    content: string,
    analysis: CulturalAnalysis,
    context?: any
  ): Promise<ContentModerationResult['modifications']> {
    const modifications: ContentModerationResult['modifications'] = {
      removedContent: [],
      replacedContent: [],
      addedContext: []
    };

    if (!this.config.contentModeration.enabled) {
      return modifications;
    }

    let modifiedContent = content;

    // Apply Islamic compliance modifications
    if (this.config.islamicCompliance.enabled) {
      for (const violation of analysis.islamicCompliance.violations) {
        const term = violation.split(': ')[1];
        if (term) {
          if (this.config.islamicCompliance.strictness === 'strict') {
            modifications.removedContent.push(term);
            modifiedContent = modifiedContent.replace(new RegExp(term, 'gi'), '[content filtered for Islamic compliance]');
          } else {
            const islamicContext = this.getIslamicContext(term);
            modifications.addedContext.push(`Islamic perspective: ${islamicContext}`);
          }
        }
      }
    }

    // Apply political neutrality modifications
    if (this.config.politicalNeutrality.enabled) {
      analysis.politicalNeutrality.sensitivePhrases.forEach((phrase, index) => {
        const alternative = analysis.politicalNeutrality.neutralAlternatives[index];
        if (alternative) {
          modifications.replacedContent.push({
            original: phrase,
            replacement: alternative.split(' instead of ')[0],
            reason: 'Political neutrality'
          });
          modifiedContent = modifiedContent.replace(
            new RegExp(phrase, 'gi'),
            alternative.split(' instead of ')[0]
          );
        }
      });
    }

    // Apply cultural sensitivity modifications
    if (this.config.culturalSensitivity.enabled) {
      analysis.culturalSensitivity.inappropriateContent.forEach(term => {
        modifications.removedContent.push(term);
        modifiedContent = modifiedContent.replace(
          new RegExp(term, 'gi'),
          '[content filtered for cultural sensitivity]'
        );
      });
    }

    // Preserve original if configured
    if (this.config.contentModeration.preserveContext) {
      analysis.preservedOriginal = content;
    }

    analysis.filteredContent = modifiedContent !== content ? modifiedContent : undefined;

    return modifications;
  }

  /**
   * Analyze professional context appropriateness
   */
  private async analyzeProfessionalContext(
    content: string,
    domain: 'legal' | 'medical' | 'educational' | 'business' | 'engineering'
  ): Promise<ContentModerationResult['professionalContext']> {
    const terminology = this.extractProfessionalTerminology(content, domain);
    const appropriateness = this.calculateProfessionalAppropriateness(content, domain);

    return {
      domain,
      appropriateness,
      terminology
    };
  }

  /**
   * Calculate confidence score for the analysis
   */
  private calculateConfidence(analysis: CulturalAnalysis): number {
    // Base confidence on the number of detected elements and analysis depth
    let confidence = 0.7; // Base confidence

    // Increase confidence based on detected elements
    if (analysis.islamicCompliance.preservedElements.length > 0) confidence += 0.1;
    if (analysis.politicalNeutrality.sensitivePhrases.length > 0) confidence += 0.1;
    if (analysis.culturalSensitivity.culturalReferences.length > 0) confidence += 0.1;

    return Math.min(confidence, 1.0);
  }

  // Helper methods
  private hasIslamicContext(content: string, term: string): boolean {
    const contextWords = ['according to islam', 'islamic perspective', 'في الإسلام', 'من منظور إسلامي'];
    return contextWords.some(context => content.toLowerCase().includes(context));
  }

  private isEducationalContent(content: string): boolean {
    const educationalMarkers = [
      'study', 'learn', 'education', 'research', 'analysis',
      'دراسة', 'تعلم', 'تعليم', 'بحث', 'تحليل'
    ];
    return educationalMarkers.some(marker => content.toLowerCase().includes(marker));
  }

  private isNeutralGovernmentContext(content: string, term: string): boolean {
    if (!this.config.politicalNeutrality.allowNeutralGovernment) return false;
    
    const neutralContexts = [
      'public service', 'administration', 'civil service',
      'خدمة عامة', 'إدارة', 'خدمة مدنية'
    ];
    return neutralContexts.some(context => content.toLowerCase().includes(context));
  }

  private hasIraqiCulturalElements(content: string): boolean {
    return this.iraqiCulturalTerms.positive.some(term =>
      content.toLowerCase().includes(term.toLowerCase())
    );
  }

  private getIslamicContext(term: string): string {
    const contexts: Record<string, string> = {
      'alcohol': 'Islam prohibits alcohol consumption for health and spiritual reasons',
      'gambling': 'Islam discourages gambling as it can lead to addiction and social harm',
      'خمر': 'الإسلام يحرم الخمر للمحافظة على الصحة والروحانية',
      'قمار': 'الإسلام ينهى عن القمار لما قد يؤدي إليه من أضرار اجتماعية'
    };
    
    return contexts[term.toLowerCase()] || 'Please consider Islamic guidelines regarding this topic';
  }

  private extractProfessionalTerminology(content: string, domain: string): string[] {
    const terminologyMaps: Record<string, string[]> = {
      legal: ['law', 'regulation', 'statute', 'case', 'court', 'قانون', 'نظام', 'قضية', 'محكمة'],
      medical: ['patient', 'diagnosis', 'treatment', 'medicine', 'مريض', 'تشخيص', 'علاج', 'دواء'],
      educational: ['student', 'curriculum', 'lesson', 'طالب', 'منهج', 'درس'],
      business: ['contract', 'agreement', 'profit', 'عقد', 'اتفاقية', 'ربح'],
      engineering: ['design', 'specification', 'standard', 'تصميم', 'مواصفة', 'معيار']
    };

    const terms = terminologyMaps[domain] || [];
    return terms.filter(term => content.toLowerCase().includes(term.toLowerCase()));
  }

  private calculateProfessionalAppropriateness(content: string, domain: string): number {
    const terminologyCount = this.extractProfessionalTerminology(content, domain).length;
    const hasInappropriate = this.inappropriateContent.some(term =>
      content.toLowerCase().includes(term.toLowerCase())
    );
    
    let score = 70; // Base professional score
    
    score += terminologyCount * 5; // Bonus for professional terminology
    if (hasInappropriate) score -= 30; // Penalty for inappropriate content
    
    return Math.min(Math.max(score, 0), 100);
  }

  /**
   * Get filter statistics
   */
  getFilterStats(): {
    config: CulturalFilterConfig;
    supportedDomains: string[];
    filterCapabilities: string[];
  } {
    return {
      config: this.config,
      supportedDomains: ['legal', 'medical', 'educational', 'business', 'engineering'],
      filterCapabilities: [
        'Islamic compliance filtering',
        'Political neutrality enforcement',
        'Cultural sensitivity analysis',
        'Professional domain validation',
        'Arabic text cultural context',
        'Iraqi dialect preservation'
      ]
    };
  }
}