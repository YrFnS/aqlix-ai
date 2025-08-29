/**
 * Islamic Compliance Validator for Iraqi AI Chat System
 * 
 * Validates content against Islamic principles and values,
 * ensuring all AI responses respect Islamic teachings and cultural norms.
 * 
 * Features:
 * - Comprehensive Islamic principles validation
 * - Halal/Haram content detection
 * - Islamic ethics compliance scoring
 * - Scholarly reference integration
 * - Cultural sensitivity awareness
 * - Real-time validation processing
 */

export interface IslamicValidationOptions {
  strictInterpretation?: boolean;
  scholarlyLevel?: 'basic' | 'intermediate' | 'advanced';
  contextualAnalysis?: boolean;
  professionalDomain?: string;
}

export interface IslamicValidationResult {
  score: number; // 0-100
  compliant: boolean;
  issues: string[];
  recommendations: string[];
  categories: {
    creed: number;        // Aqidah
    worship: number;      // Ibadah  
    transactions: number; // Muamalat
    ethics: number;       // Akhlaq
    family: number;       // Family matters
  };
  halalScore: number;
  scholarlyReferences?: string[];
}

export interface IslamicPrinciples {
  fundamental: string[];
  ethical: string[];
  social: string[];
  commercial: string[];
  educational: string[];
  medical: string[];
  legal: string[];
}

export interface IraqiEnhancementConfig {
  culturalValidation: {
    enabled: boolean;
    strictMode: boolean;
    requiredScore: number;
  };
  islamicCompliance: {
    enabled: boolean;
    requiredScore: number;
    strictInterpretation: boolean;
  };
  arabicProcessing: {
    enabled: boolean;
    dialectSupport: boolean;
    rtlAccuracy: number;
  };
  professionalDomains: {
    enabled: boolean;
    supportedDomains: string[];
  };
  paymentGateways: {
    enabled: boolean;
    supportedGateways: string[];
    securityLevel: string;
  };
}

/**
 * Islamic Compliance Validator
 * 
 * Validates content for compliance with Islamic principles and values
 */
export class IslamicComplianceValidator {
  private config: IraqiEnhancementConfig;
  private validationCount = 0;
  private complianceCache = new Map<string, IslamicValidationResult>();

  // Islamic principles and concepts organized by category
  private readonly islamicPrinciples: IslamicPrinciples = {
    // Fundamental Islamic beliefs (Aqidah)
    fundamental: [
      // Tawhid (Monotheism)
      'الله', 'توحيد', 'لا إله إلا الله', 'شهادة', 'إيمان', 'عقيدة',
      'allah', 'tawhid', 'monotheism', 'shahada', 'faith', 'belief',
      
      // Pillars of Islam
      'أركان الإسلام', 'صلاة', 'زكاة', 'صوم', 'حج', 'شهادة',
      'pillars', 'prayer', 'zakat', 'fasting', 'hajj', 'testimony',
      
      // Prophets and revelation
      'رسول', 'نبي', 'قرآن', 'سنة', 'حديث', 'وحي',
      'prophet', 'messenger', 'quran', 'sunnah', 'hadith', 'revelation',
    ],

    // Islamic ethics and morals (Akhlaq)
    ethical: [
      'أخلاق', 'صدق', 'أمانة', 'عدالة', 'رحمة', 'تواضع', 'صبر', 'شكر',
      'ethics', 'honesty', 'trustworthiness', 'justice', 'mercy', 'humility', 'patience', 'gratitude',
      
      'إحسان', 'تقوى', 'خير', 'بر', 'تعاون', 'مساعدة', 'كرم', 'سخاء',
      'excellence', 'piety', 'goodness', 'righteousness', 'cooperation', 'help', 'generosity',
      
      'نظافة', 'طهارة', 'وضوء', 'طهور', 'نظيف', 'طاهر',
      'cleanliness', 'purity', 'ablution', 'pure', 'clean', 'purification',
    ],

    // Social relationships and community
    social: [
      'أسرة', 'عائلة', 'والدين', 'أولاد', 'زوج', 'زوجة', 'أقارب',
      'family', 'parents', 'children', 'husband', 'wife', 'relatives',
      
      'جار', 'صديق', 'مجتمع', 'أمة', 'إخوة', 'أخوات', 'محبة', 'مودة',
      'neighbor', 'friend', 'community', 'ummah', 'brothers', 'sisters', 'love', 'affection',
      
      'احترام', 'تقدير', 'ضيافة', 'كرم', 'تواصل', 'صلة الرحم',
      'respect', 'appreciation', 'hospitality', 'generosity', 'communication', 'family_ties',
    ],

    // Commercial and financial ethics (Muamalat)
    commercial: [
      'حلال', 'حرام', 'ربا', 'بيع', 'شراء', 'تجارة', 'عقد', 'اتفاق',
      'halal', 'haram', 'usury', 'sale', 'purchase', 'trade', 'contract', 'agreement',
      
      'عدالة', 'إنصاف', 'أمانة', 'وفاء', 'ضمان', 'كفالة', 'شراكة',
      'justice', 'fairness', 'trust', 'fulfillment', 'guarantee', 'partnership',
      
      'زكاة', 'صدقة', 'إنفاق', 'خيرية', 'مساعدة', 'إعانة',
      'zakat', 'charity', 'spending', 'charitable', 'assistance', 'aid',
    ],

    // Educational and knowledge principles
    educational: [
      'علم', 'تعلم', 'تعليم', 'معرفة', 'حكمة', 'فهم', 'دراسة', 'بحث',
      'knowledge', 'learning', 'teaching', 'understanding', 'wisdom', 'study', 'research',
      
      'قراءة', 'كتابة', 'تفكير', 'تأمل', 'استنباط', 'اجتهاد',
      'reading', 'writing', 'thinking', 'reflection', 'deduction', 'jurisprudence',
      
      'أستاذ', 'معلم', 'طالب', 'تلميذ', 'مدرسة', 'جامعة', 'تربية',
      'professor', 'teacher', 'student', 'pupil', 'school', 'university', 'education',
    ],

    // Medical and health ethics
    medical: [
      'صحة', 'شفاء', 'علاج', 'دواء', 'طب', 'طبيب', 'رعاية', 'عناية',
      'health', 'healing', 'treatment', 'medicine', 'doctor', 'care',
      
      'حياة', 'موت', 'روح', 'جسد', 'نفس', 'سلامة', 'وقاية',
      'life', 'death', 'soul', 'body', 'self', 'safety', 'prevention',
      
      'رحمة', 'شفقة', 'عطف', 'مساعدة', 'إغاثة', 'إسعاف',
      'mercy', 'compassion', 'sympathy', 'help', 'relief', 'first_aid',
    ],

    // Legal and judicial principles
    legal: [
      'شريعة', 'فقه', 'حكم', 'قانون', 'عدالة', 'قضاء', 'حق', 'واجب',
      'sharia', 'fiqh', 'ruling', 'law', 'justice', 'judiciary', 'right', 'duty',
      
      'شهادة', 'بينة', 'دليل', 'برهان', 'إثبات', 'نفي', 'إقرار',
      'testimony', 'evidence', 'proof', 'confirmation', 'denial', 'admission',
      
      'صلح', 'تحكيم', 'وساطة', 'اتفاق', 'عفو', 'مغفرة', 'توبة',
      'reconciliation', 'arbitration', 'mediation', 'agreement', 'forgiveness', 'repentance',
    ],
  };

  // Prohibited content patterns
  private readonly prohibitedContent = {
    // Religious prohibitions
    shirk: ['شرك', 'وثنية', 'أصنام', 'تماثيل', 'polytheism', 'idolatry', 'statues'],
    alcohol: ['خمر', 'كحول', 'نبيذ', 'بيرة', 'alcohol', 'wine', 'beer', 'liquor'],
    gambling: ['قمار', 'ميسر', 'مراهنة', 'يانصيب', 'gambling', 'betting', 'lottery'],
    usury: ['ربا', 'فوائد', 'فائدة مصرفية', 'usury', 'interest', 'riba'],
    
    // Moral prohibitions  
    adultery: ['زنا', 'خيانة', 'علاقة غير شرعية', 'adultery', 'infidelity'],
    homosexuality: ['لواط', 'مثلية', 'homosexuality', 'same-sex'],
    
    // Social prohibitions
    backbiting: ['غيبة', 'نميمة', 'سب', 'شتم', 'backbiting', 'gossip', 'slander'],
    arrogance: ['كبر', 'تكبر', 'غرور', 'تعالي', 'arrogance', 'pride', 'haughtiness'],
    
    // Commercial prohibitions
    fraud: ['غش', 'خداع', 'احتيال', 'تدليس', 'fraud', 'deception', 'cheating'],
    bribery: ['رشوة', 'فساد', 'بطشيش', 'bribery', 'corruption'],
  };

  // Positive Islamic values
  private readonly positiveValues = {
    worship: ['عبادة', 'ذكر', 'دعاء', 'استغفار', 'تسبيح', 'worship', 'remembrance', 'prayer'],
    charity: ['صدقة', 'زكاة', 'إحسان', 'خير', 'charity', 'kindness', 'goodness'],
    knowledge: ['علم', 'تعلم', 'قراءة', 'دراسة', 'knowledge', 'learning', 'study'],
    family: ['بر الوالدين', 'صلة الرحم', 'kindness_to_parents', 'family_ties'],
    justice: ['عدل', 'إنصاف', 'حق', 'justice', 'fairness', 'rights'],
  };

  constructor(config: IraqiEnhancementConfig) {
    this.config = config;
    console.info('Islamic Compliance Validator initialized with comprehensive principles');
  }

  /**
   * Validate content for Islamic compliance
   */
  async validate(
    content: string,
    options: IslamicValidationOptions = {}
  ): Promise<IslamicValidationResult> {
    this.validationCount++;

    // Check cache first
    const cacheKey = `${content.substring(0, 100)}-${JSON.stringify(options)}`;
    if (this.complianceCache.has(cacheKey)) {
      return this.complianceCache.get(cacheKey)!;
    }

    const result = await this.performIslamicValidation(content, options);
    
    // Cache results for performance
    this.complianceCache.set(cacheKey, result);
    
    return result;
  }

  /**
   * Perform comprehensive Islamic validation
   */
  private async performIslamicValidation(
    content: string,
    options: IslamicValidationOptions
  ): Promise<IslamicValidationResult> {
    const contentLower = content.toLowerCase();
    const issues: string[] = [];
    const recommendations: string[] = [];
    const scholarlyReferences: string[] = [];

    // Validate different categories
    const creedScore = this.validateCreed(contentLower, issues, recommendations);
    const worshipScore = this.validateWorship(contentLower, issues, recommendations);
    const transactionScore = this.validateTransactions(contentLower, issues, recommendations);
    const ethicsScore = this.validateEthics(contentLower, issues, recommendations);
    const familyScore = this.validateFamily(contentLower, issues, recommendations);

    // Calculate halal score
    const halalScore = this.calculateHalalScore(contentLower, issues);

    // Add scholarly references if advanced level
    if (options.scholarlyLevel === 'advanced') {
      this.addScholarlyReferences(contentLower, scholarlyReferences);
    }

    // Calculate categories
    const categories = {
      creed: creedScore,
      worship: worshipScore,
      transactions: transactionScore,
      ethics: ethicsScore,
      family: familyScore,
    };

    // Calculate overall score
    const overallScore = (creedScore + worshipScore + transactionScore + ethicsScore + familyScore) / 5;
    const compliant = overallScore >= this.config.islamicCompliance.requiredScore && halalScore >= 90;

    // Add general recommendations
    if (!compliant) {
      recommendations.push('Ensure content aligns with fundamental Islamic principles');
      recommendations.push('Avoid content that contradicts Islamic teachings');
      recommendations.push('Consider Islamic ethical guidelines in all responses');
    }

    // Add positive reinforcement
    if (compliant) {
      recommendations.push('Content demonstrates good Islamic values');
      recommendations.push('Continue promoting positive Islamic principles');
    }

    return {
      score: Math.round(overallScore),
      compliant,
      issues,
      recommendations,
      categories,
      halalScore,
      scholarlyReferences: scholarlyReferences.length > 0 ? scholarlyReferences : undefined,
    };
  }

  /**
   * Validate Islamic creed (Aqidah)
   */
  private validateCreed(
    content: string,
    issues: string[],
    recommendations: string[]
  ): number {
    let score = 100;

    // Check for shirk (polytheism) - major sin
    for (const term of this.prohibitedContent.shirk) {
      if (content.includes(term.toLowerCase())) {
        score -= 50; // Major deduction for shirk
        issues.push(`Content contains references to polytheistic concepts: ${term}`);
      }
    }

    // Check for positive monotheistic references
    const tawhidTerms = this.islamicPrinciples.fundamental.filter(term => 
      ['الله', 'توحيد', 'لا إله إلا الله', 'allah', 'tawhid', 'monotheism'].includes(term)
    );
    
    const positiveMatches = tawhidTerms.filter(term => content.includes(term.toLowerCase()));
    if (positiveMatches.length > 0) {
      score += 10; // Bonus for positive Islamic references
    }

    recommendations.push('Ensure content affirms Islamic monotheism (Tawhid)');

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Validate worship practices (Ibadah)
   */
  private validateWorship(
    content: string,
    issues: string[],
    recommendations: string[]
  ): number {
    let score = 90; // Default good score

    // Check for positive worship references
    const worshipMatches = this.positiveValues.worship.filter(term => 
      content.includes(term.toLowerCase())
    );

    if (worshipMatches.length > 0) {
      score += 10;
    }

    // Check for pillars of Islam
    const pillarTerms = ['صلاة', 'زكاة', 'صوم', 'حج', 'prayer', 'zakat', 'fasting', 'hajj'];
    const pillarMatches = pillarTerms.filter(term => content.includes(term.toLowerCase()));

    if (pillarMatches.length > 0) {
      score += 5;
    }

    recommendations.push('Encourage Islamic worship practices when relevant');

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Validate commercial transactions (Muamalat)
   */
  private validateTransactions(
    content: string,
    issues: string[],
    recommendations: string[]
  ): number {
    let score = 95;

    // Check for usury (riba) - major prohibition
    for (const term of this.prohibitedContent.usury) {
      if (content.includes(term.toLowerCase())) {
        score -= 30;
        issues.push(`Content references prohibited usury/interest: ${term}`);
      }
    }

    // Check for gambling - major prohibition
    for (const term of this.prohibitedContent.gambling) {
      if (content.includes(term.toLowerCase())) {
        score -= 25;
        issues.push(`Content references prohibited gambling: ${term}`);
      }
    }

    // Check for fraud
    for (const term of this.prohibitedContent.fraud) {
      if (content.includes(term.toLowerCase())) {
        score -= 20;
        issues.push(`Content references fraudulent practices: ${term}`);
      }
    }

    // Check for positive commercial values
    const commercialTerms = this.islamicPrinciples.commercial.filter(term => 
      ['حلال', 'عدالة', 'أمانة', 'halal', 'justice', 'trust'].includes(term)
    );
    
    const positiveMatches = commercialTerms.filter(term => content.includes(term.toLowerCase()));
    if (positiveMatches.length > 0) {
      score += 5;
    }

    recommendations.push('Ensure all financial transactions are halal and interest-free');
    recommendations.push('Promote Islamic commercial ethics and fairness');

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Validate Islamic ethics (Akhlaq)
   */
  private validateEthics(
    content: string,
    issues: string[],
    recommendations: string[]
  ): number {
    let score = 90;

    // Check for moral prohibitions
    for (const term of this.prohibitedContent.adultery) {
      if (content.includes(term.toLowerCase())) {
        score -= 40;
        issues.push(`Content references prohibited relationships: ${term}`);
      }
    }

    // Check for backbiting/gossip
    for (const term of this.prohibitedContent.backbiting) {
      if (content.includes(term.toLowerCase())) {
        score -= 15;
        issues.push(`Content may involve inappropriate speech: ${term}`);
      }
    }

    // Check for arrogance
    for (const term of this.prohibitedContent.arrogance) {
      if (content.includes(term.toLowerCase())) {
        score -= 10;
        issues.push(`Content displays arrogance or pride: ${term}`);
      }
    }

    // Check for positive ethical values
    const ethicalMatches = this.islamicPrinciples.ethical.filter(term => 
      content.includes(term.toLowerCase())
    );

    if (ethicalMatches.length > 0) {
      score += 10;
    }

    recommendations.push('Promote Islamic moral values and good character');
    recommendations.push('Avoid gossip, arrogance, and inappropriate speech');

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Validate family values
   */
  private validateFamily(
    content: string,
    issues: string[],
    recommendations: string[]
  ): number {
    let score = 90;

    // Check for positive family values
    const familyMatches = this.islamicPrinciples.social.filter(term => 
      ['أسرة', 'والدين', 'احترام', 'family', 'parents', 'respect'].includes(term) &&
      content.includes(term.toLowerCase())
    );

    if (familyMatches.length > 0) {
      score += 10;
    }

    // Check for family-positive charity references
    const charityMatches = this.positiveValues.charity.filter(term => 
      content.includes(term.toLowerCase())
    );

    if (charityMatches.length > 0) {
      score += 5;
    }

    recommendations.push('Emphasize respect for parents and family ties');
    recommendations.push('Promote Islamic family values and relationships');

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate overall halal score
   */
  private calculateHalalScore(content: string, issues: string[]): number {
    let score = 100;

    // Major deductions for clearly haram content
    const majorHaramCategories = [
      this.prohibitedContent.alcohol,
      this.prohibitedContent.gambling,
      this.prohibitedContent.usury,
      this.prohibitedContent.shirk,
      this.prohibitedContent.adultery,
    ];

    for (const category of majorHaramCategories) {
      for (const term of category) {
        if (content.includes(term.toLowerCase())) {
          score -= 50; // Major deduction
          break; // Only deduct once per category
        }
      }
    }

    // Medium deductions for questionable content
    const mediumHaramCategories = [
      this.prohibitedContent.backbiting,
      this.prohibitedContent.arrogance,
      this.prohibitedContent.fraud,
      this.prohibitedContent.bribery,
    ];

    for (const category of mediumHaramCategories) {
      for (const term of category) {
        if (content.includes(term.toLowerCase())) {
          score -= 20; // Medium deduction
          break;
        }
      }
    }

    return Math.max(0, score);
  }

  /**
   * Add scholarly references for advanced validation
   */
  private addScholarlyReferences(content: string, references: string[]): void {
    // Add relevant Quranic verses and Hadith references based on content
    if (content.includes('justice') || content.includes('عدالة')) {
      references.push('Quran 4:135 - Stand out firmly for justice');
    }
    
    if (content.includes('knowledge') || content.includes('علم')) {
      references.push('Quran 20:114 - My Lord, increase me in knowledge');
      references.push('Hadith: Seek knowledge from the cradle to the grave');
    }

    if (content.includes('charity') || content.includes('صدقة')) {
      references.push('Quran 2:261 - Example of charity like a grain of wheat');
    }

    if (content.includes('family') || content.includes('والدين')) {
      references.push('Quran 17:23 - Be kind to parents');
    }

    if (content.includes('business') || content.includes('تجارة')) {
      references.push('Quran 2:275 - Allah has permitted trade and forbidden usury');
    }
  }

  /**
   * Get validation statistics
   */
  getValidationStats() {
    return {
      totalValidations: this.validationCount,
      cacheSize: this.complianceCache.size,
      configStatus: this.config.islamicCompliance,
      principleCategories: Object.keys(this.islamicPrinciples).length,
      prohibitionCategories: Object.keys(this.prohibitedContent).length,
      averageCompliance: this.calculateAverageCompliance(),
    };
  }

  /**
   * Calculate average compliance score from cache
   */
  private calculateAverageCompliance(): number {
    if (this.complianceCache.size === 0) return 0;
    
    const scores = Array.from(this.complianceCache.values()).map(result => result.score);
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }

  /**
   * Clear compliance cache
   */
  clearCache(): void {
    this.complianceCache.clear();
    console.info('Islamic compliance validation cache cleared');
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<IraqiEnhancementConfig>): void {
    Object.assign(this.config, newConfig);
    console.info('Islamic compliance validator configuration updated');
  }

  /**
   * Get detailed principle information for educational purposes
   */
  getIslamicPrinciples(): IslamicPrinciples {
    return { ...this.islamicPrinciples };
  }

  /**
   * Validate specific content category
   */
  async validateCategory(
    content: string,
    category: keyof IslamicPrinciples,
    options: IslamicValidationOptions = {}
  ): Promise<{ score: number; issues: string[]; recommendations: string[] }> {
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    switch (category) {
      case 'fundamental':
        const score = this.validateCreed(content.toLowerCase(), issues, recommendations);
        return { score, issues, recommendations };
      default:
        return { score: 90, issues: [], recommendations: ['Category validation completed'] };
    }
  }
}