/**
 * Islamic Compliance Composable
 * Validates workflow operations for Islamic principles and values
 */

import { ref, computed } from 'vue'
import type { 
  IslamicComplianceResult,
  IslamicComplianceIssue,
  IslamicComplianceRecommendation,
  IslamicComplianceConfig,
  PrayerTimeContext 
} from '../types/cultural.types'
import type { 
  IraqiWorkflow, 
  IraqiWorkflowNode, 
  IraqiWorkflowConnection 
} from '../types/workflow.types'

interface PrayerTimeConflict {
  type: 'prayer-time' | 'friday-prayer' | 'ramadan-iftar'
  severity: 'low' | 'medium' | 'high' | 'critical'
  prayer?: string
  conflictTime: string
  recommendation: string
  arabicRecommendation?: string
}

interface BusinessValidationRule {
  id: string
  name: string
  arabicName?: string
  description: string
  validator: (data: any) => boolean
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: 'financial' | 'content' | 'business-practice' | 'professional-ethics'
}

export function useIslamicCompliance() {
  // Configuration
  const config = ref<IslamicComplianceConfig>({
    strictMode: false,
    professionalDomain: 'general',
    allowedBusinessHours: {
      excludeFriday: true,
      excludeRamadan: true,
      respectPrayerTimes: true
    },
    contentFilters: {
      financialInterest: true,
      inappropriateContent: true,
      prayerTimeRespect: true
    },
    auditLevel: 'standard'
  })

  // Prayer times and Islamic calendar
  const prayerTimes = ref<PrayerTimeContext | null>(null)
  const hijriDate = ref('')
  const isRamadan = ref(false)
  const validationCache = new Map<string, IslamicComplianceResult>()

  // Forbidden content patterns
  const FORBIDDEN_KEYWORDS = [
    // Financial (Riba/Interest)
    'interest', 'compound_interest', 'usury', 'riba', 'ربا', 'فائدة',
    'gambling', 'lottery', 'betting', 'speculation', 'قمار', 'مراهنة',
    
    // Content appropriateness
    'alcohol', 'wine', 'beer', 'liquor', 'خمر', 'كحول',
    'pork', 'ham', 'bacon', 'خنزير', 'لحم خنزير',
    'adult_content', 'inappropriate_imagery', 'محتوى إباحي',
    
    // Business practices
    'monopoly_abuse', 'price_manipulation', 'fraud', 'deception',
    'احتكار', 'تلاعب بالأسعار', 'احتيال', 'خداع'
  ]

  // Islamic business principles
  const ISLAMIC_BUSINESS_RULES: BusinessValidationRule[] = [
    {
      id: 'no-riba',
      name: 'No Interest (Riba)',
      arabicName: 'عدم وجود ربا',
      description: 'All financial operations must be free from interest (riba)',
      validator: (data) => {
        const content = JSON.stringify(data).toLowerCase()
        return !FORBIDDEN_KEYWORDS.slice(0, 4).some(keyword => content.includes(keyword))
      },
      severity: 'critical',
      category: 'financial'
    },
    {
      id: 'no-gambling',
      name: 'No Gambling',
      arabicName: 'عدم القمار',
      description: 'Operations must not involve gambling or games of chance',
      validator: (data) => {
        const content = JSON.stringify(data).toLowerCase()
        return !['gambling', 'lottery', 'betting', 'قمار', 'مراهنة'].some(keyword => content.includes(keyword))
      },
      severity: 'critical',
      category: 'business-practice'
    },
    {
      id: 'halal-content',
      name: 'Halal Content Only',
      arabicName: 'محتوى حلال فقط',
      description: 'Content must be appropriate according to Islamic guidelines',
      validator: (data) => {
        const content = JSON.stringify(data).toLowerCase()
        return !FORBIDDEN_KEYWORDS.slice(8, 12).some(keyword => content.includes(keyword))
      },
      severity: 'high',
      category: 'content'
    },
    {
      id: 'honest-dealing',
      name: 'Honest Business Dealing',
      arabicName: 'التعامل التجاري الصادق',
      description: 'All business operations must be transparent and honest',
      validator: (data) => {
        const content = JSON.stringify(data).toLowerCase()
        return !['fraud', 'deception', 'احتيال', 'خداع'].some(keyword => content.includes(keyword))
      },
      severity: 'high',
      category: 'business-practice'
    },
    {
      id: 'fair-pricing',
      name: 'Fair Pricing',
      arabicName: 'تسعير عادل',
      description: 'Pricing must be fair and not exploitative',
      validator: (data) => {
        const content = JSON.stringify(data).toLowerCase()
        return !['price_manipulation', 'monopoly_abuse', 'تلاعب بالأسعار', 'احتكار'].some(keyword => content.includes(keyword))
      },
      severity: 'medium',
      category: 'business-practice'
    }
  ]

  // Professional domain specific rules
  const PROFESSIONAL_DOMAIN_RULES = {
    health: [
      {
        id: 'patient-privacy',
        name: 'Patient Privacy',
        arabicName: 'خصوصية المريض',
        description: 'Medical information must be kept confidential',
        validator: (data: any) => {
          // Check for proper privacy handling
          return true // Implement based on specific requirements
        },
        severity: 'critical' as const,
        category: 'professional-ethics' as const
      },
      {
        id: 'islamic-medical-ethics',
        name: 'Islamic Medical Ethics',
        arabicName: 'أخلاقيات الطب الإسلامي',
        description: 'Medical procedures must align with Islamic medical ethics',
        validator: (data: any) => {
          const content = JSON.stringify(data).toLowerCase()
          return !['unlawful_procedures', 'non_emergency_friday'].some(term => content.includes(term))
        },
        severity: 'high' as const,
        category: 'professional-ethics' as const
      }
    ],
    education: [
      {
        id: 'islamic-values-integration',
        name: 'Islamic Values Integration',
        arabicName: 'دمج القيم الإسلامية',
        description: 'Educational content should integrate Islamic values',
        validator: (data: any) => {
          // Check for Islamic values in educational content
          return true
        },
        severity: 'medium' as const,
        category: 'professional-ethics' as const
      }
    ],
    justice: [
      {
        id: 'islamic-jurisprudence',
        name: 'Islamic Jurisprudence Compliance',
        arabicName: 'الامتثال للفقه الإسلامي',
        description: 'Legal operations must be consistent with Islamic jurisprudence',
        validator: (data: any) => {
          const content = JSON.stringify(data).toLowerCase()
          return !['islamic_law_contradiction', 'unfair_judgment'].some(term => content.includes(term))
        },
        severity: 'critical' as const,
        category: 'professional-ethics' as const
      }
    ]
  }

  // Prayer time utilities
  const initializePrayerTimes = (location: { lat: number; lng: number }, timezone: string = 'Asia/Baghdad') => {
    // In a real implementation, this would call a prayer times API
    const now = new Date()
    const fakeTimesForBaghdad = {
      location: {
        city: 'Baghdad',
        country: 'Iraq',
        coordinates: location,
        timezone
      },
      times: {
        fajr: '05:30',
        sunrise: '06:45',
        dhuhr: '12:30',
        asr: '15:45',
        maghrib: '18:15',
        isha: '19:30'
      },
      current: {
        nextPrayer: 'dhuhr',
        timeUntilNext: 120, // minutes
        isRestrictedTime: false,
        fridayJumahTime: '12:00'
      },
      ramadan: {
        isRamadan: isRamadan.value,
        suhoor: '04:30',
        iftar: '18:15',
        tarawih: '20:00'
      }
    }

    prayerTimes.value = fakeTimesForBaghdad
    return fakeTimesForBaghdad
  }

  const updateIslamicCalendar = () => {
    // Simplified Hijri calendar calculation
    const now = new Date()
    hijriDate.value = '1446/03/15' // Example date
    
    // Simple Ramadan detection (this would be more sophisticated in production)
    const month = now.getMonth()
    isRamadan.value = month === 3 // Example: April could be Ramadan
  }

  const getCurrentPrayerStatus = (): { 
    isRestrictedTime: boolean; 
    currentPrayer?: string; 
    minutesUntilNext: number 
  } => {
    if (!prayerTimes.value) {
      return { isRestrictedTime: false, minutesUntilNext: 0 }
    }

    const now = new Date()
    const currentTime = now.toTimeString().substring(0, 5)
    
    // Check if current time is within prayer time restrictions
    const prayers = Object.entries(prayerTimes.value.times)
    let isRestrictedTime = false
    let currentPrayer: string | undefined
    let minutesUntilNext = 0

    for (const [prayer, time] of prayers) {
      const prayerTime = new Date(`1970-01-01T${time}:00`)
      const currentTimeObj = new Date(`1970-01-01T${currentTime}:00`)
      const timeDiff = Math.abs(currentTimeObj.getTime() - prayerTime.getTime()) / (1000 * 60)

      if (timeDiff <= 15) { // 15 minutes before/after prayer
        isRestrictedTime = true
        currentPrayer = prayer
        break
      }
    }

    return { isRestrictedTime, currentPrayer, minutesUntilNext }
  }

  // Validation functions
  const validateWorkflowCompliance = async (workflow: IraqiWorkflow): Promise<IslamicComplianceResult> => {
    const cacheKey = `workflow_${workflow.id}_${JSON.stringify(config.value)}`
    
    if (validationCache.has(cacheKey)) {
      return validationCache.get(cacheKey)!
    }

    const issues: IslamicComplianceIssue[] = []
    const recommendations: IslamicComplianceRecommendation[] = []
    let overallScore = 1.0

    // Validate timing constraints
    const timingValidation = validateWorkflowTiming(workflow)
    if (!timingValidation.isValid) {
      issues.push(...timingValidation.issues)
      recommendations.push(...timingValidation.recommendations)
      overallScore -= 0.2
    }

    // Validate content compliance
    const contentValidation = await validateWorkflowContent(workflow)
    if (!contentValidation.isValid) {
      issues.push(...contentValidation.issues)
      recommendations.push(...contentValidation.recommendations)
      overallScore -= 0.4
    }

    // Validate business practices
    const businessValidation = validateBusinessPractices(workflow)
    if (!businessValidation.isValid) {
      issues.push(...businessValidation.issues)
      recommendations.push(...businessValidation.recommendations)
      overallScore -= 0.3
    }

    // Professional domain validation
    const domainValidation = validateProfessionalDomain(workflow)
    if (!domainValidation.isValid) {
      issues.push(...domainValidation.issues)
      recommendations.push(...domainValidation.recommendations)
      overallScore -= 0.1
    }

    const finalScore = Math.max(0, overallScore)
    const isCompliant = finalScore >= (config.value.strictMode ? 0.95 : 0.85)

    const result: IslamicComplianceResult = {
      isCompliant,
      score: finalScore,
      issues,
      recommendations,
      severity: calculateSeverity(finalScore, issues),
      breakdown: {
        financialCompliance: businessValidation.financialScore || 1.0,
        contentAppropriatenesss: contentValidation.contentScore || 1.0,
        timingCompliance: timingValidation.timingScore || 1.0,
        professionalEthics: domainValidation.ethicsScore || 1.0,
        businessPractices: businessValidation.practicesScore || 1.0
      },
      context: {
        validatedAt: new Date(),
        validatorVersion: '1.0.0',
        professionalDomain: config.value.professionalDomain,
        prayerTimeContext: prayerTimes.value!,
        hijriDate: hijriDate.value,
        isRamadan: isRamadan.value
      }
    }

    validationCache.set(cacheKey, result)
    return result
  }

  const validateNodeCompliance = async (node: IraqiWorkflowNode): Promise<IslamicComplianceResult> => {
    const issues: IslamicComplianceIssue[] = []
    const recommendations: IslamicComplianceRecommendation[] = []
    let score = 1.0

    // Check node type compliance
    const nodeContent = JSON.stringify(node).toLowerCase()
    
    for (const rule of ISLAMIC_BUSINESS_RULES) {
      if (!rule.validator(node)) {
        const issue: IslamicComplianceIssue = {
          id: `node_${node.id}_${rule.id}`,
          type: rule.category as any,
          severity: rule.severity,
          message: `Node violates rule: ${rule.name}`,
          arabicMessage: rule.arabicName ? `العقدة تنتهك القاعدة: ${rule.arabicName}` : undefined,
          nodeId: node.id,
          details: {
            violationType: rule.id,
            islamicRuling: rule.description,
            professionalContext: config.value.professionalDomain,
            suggestedAlternative: getAlternativeForRule(rule.id)
          },
          resolution: {
            required: rule.severity === 'critical',
            alternatives: getAlternativesForRule(rule.id),
            islamicGuidance: getIslamicGuidanceForRule(rule.id),
            professionalGuidance: getProfessionalGuidanceForRule(rule.id)
          }
        }
        issues.push(issue)

        const severityImpact = {
          'critical': 0.5,
          'high': 0.3,
          'medium': 0.2,
          'low': 0.1
        }
        score -= severityImpact[rule.severity]
      }
    }

    // Check professional domain specific rules
    const domainRules = PROFESSIONAL_DOMAIN_RULES[config.value.professionalDomain as keyof typeof PROFESSIONAL_DOMAIN_RULES]
    if (domainRules) {
      for (const rule of domainRules) {
        if (!rule.validator(node)) {
          issues.push({
            id: `node_${node.id}_domain_${rule.id}`,
            type: 'professional-ethics',
            severity: rule.severity,
            message: `Node violates professional domain rule: ${rule.name}`,
            arabicMessage: rule.arabicName ? `العقدة تنتهك قاعدة المجال المهني: ${rule.arabicName}` : undefined,
            nodeId: node.id,
            details: {
              violationType: rule.id,
              professionalContext: config.value.professionalDomain,
              islamicRuling: rule.description
            },
            resolution: {
              required: rule.severity === 'critical',
              alternatives: [],
              professionalGuidance: rule.description
            }
          })
          score -= 0.2
        }
      }
    }

    const finalScore = Math.max(0, score)

    return {
      isCompliant: finalScore >= (config.value.strictMode ? 0.9 : 0.8),
      score: finalScore,
      issues,
      recommendations,
      severity: calculateSeverity(finalScore, issues),
      breakdown: {
        financialCompliance: 1.0,
        contentAppropriatenesss: 1.0,
        timingCompliance: 1.0,
        professionalEthics: 1.0,
        businessPractices: finalScore
      },
      context: {
        validatedAt: new Date(),
        validatorVersion: '1.0.0',
        professionalDomain: config.value.professionalDomain,
        prayerTimeContext: prayerTimes.value!,
        hijriDate: hijriDate.value,
        isRamadan: isRamadan.value
      }
    }
  }

  // Timing validation
  const validateWorkflowTiming = (workflow: IraqiWorkflow) => {
    const issues: IslamicComplianceIssue[] = []
    const recommendations: IslamicComplianceRecommendation[] = []
    let timingScore = 1.0

    if (!config.value.allowedBusinessHours.respectPrayerTimes) {
      return { isValid: true, issues, recommendations, timingScore }
    }

    const prayerStatus = getCurrentPrayerStatus()

    if (prayerStatus.isRestrictedTime) {
      issues.push({
        id: 'prayer-time-conflict',
        type: 'prayer-conflict',
        severity: 'medium',
        message: `Workflow execution during ${prayerStatus.currentPrayer} prayer time`,
        arabicMessage: `تنفيذ سير العمل خلال وقت صلاة ${prayerStatus.currentPrayer}`,
        details: {
          violationType: 'prayer-time-scheduling',
          islamicRuling: 'Prayer times should be respected in workflow scheduling'
        },
        resolution: {
          required: false,
          alternatives: ['Schedule execution outside prayer times', 'Add prayer time delays'],
          islamicGuidance: 'It is recommended to pause work activities during prayer times'
        }
      })
      timingScore -= 0.3
    }

    // Check Friday prayer restrictions
    const now = new Date()
    if (now.getDay() === 5 && config.value.allowedBusinessHours.excludeFriday) {
      const fridayPrayerTime = prayerTimes.value?.current.fridayJumahTime
      if (fridayPrayerTime) {
        issues.push({
          id: 'friday-prayer-conflict',
          type: 'prayer-conflict',
          severity: 'high',
          message: 'Workflow scheduled during Friday prayer time',
          arabicMessage: 'سير العمل مجدول خلال وقت صلاة الجمعة',
          details: {
            violationType: 'friday-prayer-scheduling',
            islamicRuling: 'Friday prayer is obligatory and should not be interrupted'
          },
          resolution: {
            required: true,
            alternatives: ['Reschedule before/after Friday prayer', 'Implement automatic delays'],
            islamicGuidance: 'Friday prayer attendance is obligatory for Muslim men'
          }
        })
        timingScore -= 0.5
      }
    }

    // Check Ramadan considerations
    if (isRamadan.value && config.value.allowedBusinessHours.excludeRamadan) {
      const iftarTime = prayerTimes.value?.ramadan?.iftar
      if (iftarTime) {
        recommendations.push({
          id: 'ramadan-consideration',
          type: 'guidance',
          priority: 'medium',
          message: 'Consider Ramadan timing adjustments for workflow execution',
          arabicMessage: 'فكر في تعديلات توقيت رمضان لتنفيذ سير العمل',
          implementation: {
            effort: 'minimal',
            impact: 'medium',
            timeframe: 'immediate',
            resources: ['Ramadan calendar integration', 'Automatic scheduling adjustments']
          },
          islamic: {
            basis: 'Sunnah - showing consideration for fasting Muslims',
            contemporaryRuling: 'Recommended to adjust work schedules during Ramadan'
          }
        })
      }
    }

    return {
      isValid: timingScore >= 0.7,
      issues,
      recommendations,
      timingScore
    }
  }

  // Content validation
  const validateWorkflowContent = async (workflow: IraqiWorkflow) => {
    const issues: IslamicComplianceIssue[] = []
    const recommendations: IslamicComplianceRecommendation[] = []
    let contentScore = 1.0

    const workflowContent = JSON.stringify(workflow).toLowerCase()

    // Check for forbidden content
    for (const keyword of FORBIDDEN_KEYWORDS) {
      if (workflowContent.includes(keyword)) {
        const severity = keyword.includes('ربا') || keyword.includes('riba') || keyword.includes('interest') ? 'critical' : 'high'
        
        issues.push({
          id: `forbidden-content-${keyword}`,
          type: keyword.includes('riba') || keyword.includes('interest') ? 'riba' : 'haram-content',
          severity: severity as any,
          message: `Workflow contains forbidden content: ${keyword}`,
          arabicMessage: `سير العمل يحتوي على محتوى محرم: ${keyword}`,
          details: {
            violationType: 'content-violation',
            islamicRuling: getIslamicRulingForKeyword(keyword),
            suggestedAlternative: getHalalAlternative(keyword)
          },
          resolution: {
            required: severity === 'critical',
            alternatives: [getHalalAlternative(keyword)],
            islamicGuidance: getIslamicRulingForKeyword(keyword)
          }
        })

        contentScore -= severity === 'critical' ? 0.5 : 0.3
      }
    }

    return {
      isValid: contentScore >= 0.7,
      issues,
      recommendations,
      contentScore
    }
  }

  // Business practices validation
  const validateBusinessPractices = (workflow: IraqiWorkflow) => {
    const issues: IslamicComplianceIssue[] = []
    const recommendations: IslamicComplianceRecommendation[] = []
    let practicesScore = 1.0
    let financialScore = 1.0

    for (const rule of ISLAMIC_BUSINESS_RULES) {
      if (!rule.validator(workflow)) {
        issues.push({
          id: `business-rule-${rule.id}`,
          type: rule.category as any,
          severity: rule.severity,
          message: `Workflow violates Islamic business rule: ${rule.name}`,
          arabicMessage: rule.arabicName ? `سير العمل يخالف قاعدة الأعمال الإسلامية: ${rule.arabicName}` : undefined,
          details: {
            violationType: rule.id,
            islamicRuling: rule.description
          },
          resolution: {
            required: rule.severity === 'critical',
            alternatives: getAlternativesForRule(rule.id),
            islamicGuidance: getIslamicGuidanceForRule(rule.id)
          }
        })

        if (rule.category === 'financial') {
          financialScore -= 0.5
        }
        practicesScore -= rule.severity === 'critical' ? 0.4 : 0.2
      }
    }

    return {
      isValid: practicesScore >= 0.8,
      issues,
      recommendations,
      practicesScore,
      financialScore
    }
  }

  // Professional domain validation
  const validateProfessionalDomain = (workflow: IraqiWorkflow) => {
    const issues: IslamicComplianceIssue[] = []
    const recommendations: IslamicComplianceRecommendation[] = []
    let ethicsScore = 1.0

    const domainRules = PROFESSIONAL_DOMAIN_RULES[config.value.professionalDomain as keyof typeof PROFESSIONAL_DOMAIN_RULES]
    if (!domainRules) {
      return { isValid: true, issues, recommendations, ethicsScore }
    }

    for (const rule of domainRules) {
      if (!rule.validator(workflow)) {
        issues.push({
          id: `domain-rule-${rule.id}`,
          type: 'professional-ethics',
          severity: rule.severity,
          message: `Workflow violates professional domain rule: ${rule.name}`,
          arabicMessage: rule.arabicName ? `سير العمل يخالف قاعدة المجال المهني: ${rule.arabicName}` : undefined,
          details: {
            violationType: rule.id,
            professionalContext: config.value.professionalDomain,
            islamicRuling: rule.description
          },
          resolution: {
            required: rule.severity === 'critical',
            alternatives: [],
            professionalGuidance: rule.description
          }
        })
        ethicsScore -= 0.3
      }
    }

    return {
      isValid: ethicsScore >= 0.7,
      issues,
      recommendations,
      ethicsScore
    }
  }

  // Prayer time conflict checking
  const checkPrayerTimeConflicts = async (
    workflow: IraqiWorkflow, 
    prayerContext: PrayerTimeContext
  ): Promise<PrayerTimeConflict[]> => {
    const conflicts: PrayerTimeConflict[] = []

    if (!config.value.allowedBusinessHours.respectPrayerTimes) {
      return conflicts
    }

    const now = new Date()
    const currentTime = now.toTimeString().substring(0, 5)

    // Check each prayer time
    Object.entries(prayerContext.times).forEach(([prayer, time]) => {
      const prayerTime = new Date(`1970-01-01T${time}:00`)
      const currentTimeObj = new Date(`1970-01-01T${currentTime}:00`)
      const timeDiff = Math.abs(currentTimeObj.getTime() - prayerTime.getTime()) / (1000 * 60)

      if (timeDiff <= 15) { // Within 15 minutes of prayer time
        conflicts.push({
          type: 'prayer-time',
          severity: 'medium',
          prayer,
          conflictTime: time,
          recommendation: `Delay workflow execution until after ${prayer} prayer`,
          arabicRecommendation: `تأخير تنفيذ سير العمل حتى بعد صلاة ${prayer}`
        })
      }
    })

    // Check Friday prayer specifically
    if (now.getDay() === 5 && prayerContext.current.fridayJumahTime) {
      const fridayTime = new Date(`1970-01-01T${prayerContext.current.fridayJumahTime}:00`)
      const currentTimeObj = new Date(`1970-01-01T${currentTime}:00`)
      const timeDiff = Math.abs(currentTimeObj.getTime() - fridayTime.getTime()) / (1000 * 60)

      if (timeDiff <= 60) { // Within 1 hour of Friday prayer
        conflicts.push({
          type: 'friday-prayer',
          severity: 'high',
          prayer: 'jumah',
          conflictTime: prayerContext.current.fridayJumahTime,
          recommendation: 'Avoid workflow execution 1 hour before/after Friday prayer',
          arabicRecommendation: 'تجنب تنفيذ سير العمل قبل/بعد صلاة الجمعة بساعة'
        })
      }
    }

    // Check Ramadan Iftar
    if (prayerContext.ramadan?.isRamadan && prayerContext.ramadan.iftar) {
      const iftarTime = new Date(`1970-01-01T${prayerContext.ramadan.iftar}:00`)
      const currentTimeObj = new Date(`1970-01-01T${currentTime}:00`)
      const timeDiff = Math.abs(currentTimeObj.getTime() - iftarTime.getTime()) / (1000 * 60)

      if (timeDiff <= 30) { // Within 30 minutes of Iftar
        conflicts.push({
          type: 'ramadan-iftar',
          severity: 'medium',
          conflictTime: prayerContext.ramadan.iftar,
          recommendation: 'Consider delaying execution to respect Iftar time',
          arabicRecommendation: 'فكر في تأخير التنفيذ احتراماً لوقت الإفطار'
        })
      }
    }

    return conflicts
  }

  // Helper functions
  const calculateSeverity = (score: number, issues: IslamicComplianceIssue[]): 'low' | 'medium' | 'high' | 'critical' => {
    if (score <= 0.3 || issues.some(issue => issue.severity === 'critical')) {
      return 'critical'
    }
    if (score <= 0.6 || issues.some(issue => issue.severity === 'high')) {
      return 'high'
    }
    if (score <= 0.8 || issues.some(issue => issue.severity === 'medium')) {
      return 'medium'
    }
    return 'low'
  }

  const getIslamicRulingForKeyword = (keyword: string): string => {
    const rulings: Record<string, string> = {
      'riba': 'Interest (riba) is explicitly forbidden in the Quran',
      'ربا': 'الربا محرم صراحة في القرآن الكريم',
      'gambling': 'Gambling is forbidden as it involves chance and can lead to addiction',
      'قمار': 'القمار محرم لأنه ينطوي على المصادفة ويمكن أن يؤدي إلى الإدمان',
      'alcohol': 'Alcohol is forbidden in Islam',
      'خمر': 'الخمر محرم في الإسلام'
    }
    return rulings[keyword] || 'This content may not be appropriate according to Islamic guidelines'
  }

  const getHalalAlternative = (keyword: string): string => {
    const alternatives: Record<string, string> = {
      'interest': 'profit-sharing (mudarabah) or cost-plus (murabaha)',
      'riba': 'mudarabah or murabaha financing',
      'gambling': 'skill-based competitions with predetermined outcomes',
      'alcohol': 'halal beverages and food products'
    }
    return alternatives[keyword] || 'halal alternative'
  }

  const getAlternativesForRule = (ruleId: string): string[] => {
    const alternatives: Record<string, string[]> = {
      'no-riba': ['Mudarabah partnership', 'Murabaha cost-plus sale', 'Ijara leasing'],
      'no-gambling': ['Skill-based competitions', 'Fixed-outcome rewards', 'Educational contests'],
      'halal-content': ['Halal-certified products', 'Islamic-compliant content', 'Family-appropriate material'],
      'honest-dealing': ['Transparent pricing', 'Clear contract terms', 'Full disclosure policies'],
      'fair-pricing': ['Market-based pricing', 'Value-based pricing', 'Transparent cost structure']
    }
    return alternatives[ruleId] || []
  }

  const getIslamicGuidanceForRule = (ruleId: string): string => {
    const guidance: Record<string, string> = {
      'no-riba': 'Allah has permitted trade and forbidden riba (Quran 2:275)',
      'no-gambling': 'Avoid gambling as it is the work of Satan (Quran 5:90)',
      'halal-content': 'Enjoin what is right and forbid what is wrong (Quran 3:104)',
      'honest-dealing': 'Give full measure and weight in justice (Quran 6:152)',
      'fair-pricing': 'Be just in your dealings (Quran 4:58)'
    }
    return guidance[ruleId] || 'Follow Islamic principles in all dealings'
  }

  const getProfessionalGuidanceForRule = (ruleId: string): string => {
    const guidance: Record<string, string> = {
      'no-riba': 'Use Islamic banking products and avoid interest-based transactions',
      'no-gambling': 'Implement skill-based reward systems with clear criteria',
      'halal-content': 'Ensure all content meets Islamic standards for appropriateness',
      'honest-dealing': 'Maintain transparency and honesty in all business communications',
      'fair-pricing': 'Use ethical pricing strategies that provide fair value to customers'
    }
    return guidance[ruleId] || 'Follow professional ethics aligned with Islamic principles'
  }

  const getAlternativeForRule = (ruleId: string): string => {
    return getAlternativesForRule(ruleId)[0] || 'Islamic-compliant alternative'
  }

  // Public API
  const validateIslamicCompliance = validateWorkflowCompliance
  const validateNode = validateNodeCompliance

  const clearValidationCache = () => {
    validationCache.clear()
  }

  const updateConfiguration = (newConfig: Partial<IslamicComplianceConfig>) => {
    config.value = { ...config.value, ...newConfig }
    clearValidationCache()
  }

  return {
    // State
    config,
    prayerTimes,
    hijriDate,
    isRamadan,

    // Main validation functions
    validateIslamicCompliance,
    validateNode,
    checkPrayerTimeConflicts,

    // Prayer time functions
    initializePrayerTimes,
    updateIslamicCalendar,
    getCurrentPrayerStatus,

    // Configuration
    updateConfiguration,
    clearValidationCache,

    // Computed
    isConfigured: computed(() => config.value.auditLevel !== 'basic'),
    strictModeEnabled: computed(() => config.value.strictMode),
    validationCacheSize: computed(() => validationCache.size)
  }
}