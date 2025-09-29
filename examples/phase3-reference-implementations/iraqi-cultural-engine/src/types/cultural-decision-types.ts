/**
 * Iraqi Cultural Decision Engine Types
 *
 * Type definitions for Iraqi cultural decision-making framework
 * Based on Islamic principles, Iraqi cultural values, and professional ethics
 */

import { IraqiCulturalContext, ProfessionalDomain } from "@iraqi-ai/types";

// Core Cultural Decision Types
export interface CulturalDecisionRequest {
  content: any;
  context: IraqiCulturalContext;
  domain?: ProfessionalDomain;
  decisionType:
    | "content-validation"
    | "action-approval"
    | "response-generation"
    | "professional-guidance";
  urgencyLevel: "low" | "medium" | "high" | "critical";
  requesterInfo?: {
    role: string;
    organization?: string;
    securityClearance?: "public" | "internal" | "confidential" | "restricted";
  };
}

export interface CulturalDecisionResponse {
  approved: boolean;
  confidence: number; // 0-100
  culturalCompliance: IslamicComplianceResult;
  culturalAppropriateness: CulturalAppropriatenessResult;
  professionalEthics?: ProfessionalEthicsResult;
  recommendations?: string[];
  modifications?: ContentModification[];
  reasoning: DecisionReasoning;
  processingTime: number;
  reviewRequired: boolean;
}

// Islamic Compliance Framework
export interface IslamicComplianceResult {
  overallCompliance: number; // 0-100, must be >90 for approval
  quranCompliance: QuranComplianceAssessment;
  hadithCompliance: HadithComplianceAssessment;
  scholarlyConsensus: ScholarlyConsensusAssessment;
  contemporaryRulings: ContemporaryRulingAssessment;
  complianceIssues: IslamicComplianceIssue[];
}

export interface QuranComplianceAssessment {
  score: number; // 0-100
  relevantVerses: QuranReference[];
  conflicts: QuranConflict[];
  interpretationNotes: string[];
}

export interface QuranReference {
  surah: string;
  verse: string;
  arabicText: string;
  translation: string;
  relevance:
    | "directly-applicable"
    | "general-guidance"
    | "contextual"
    | "interpretive";
  scholarlyInterpretation?: string;
}

export interface QuranConflict {
  conflictType:
    | "direct-contradiction"
    | "interpretive-difference"
    | "contextual-variance";
  description: string;
  severity: "minor" | "moderate" | "major" | "critical";
  resolution?: string;
}

export interface HadithComplianceAssessment {
  score: number; // 0-100
  relevantHadith: HadithReference[];
  conflicts: HadithConflict[];
  authenticityNotes: string[];
}

export interface HadithReference {
  collection:
    | "Sahih al-Bukhari"
    | "Sahih Muslim"
    | "Sunan Abu Dawood"
    | "Jami at-Tirmidhi"
    | "Sunan an-Nasai"
    | "Sunan Ibn Majah"
    | "Other";
  hadithNumber: string;
  arabicText: string;
  translation: string;
  authenticity: "Sahih" | "Hasan" | "Daif" | "Disputed";
  relevance:
    | "directly-applicable"
    | "general-guidance"
    | "contextual"
    | "analogical";
  scholarlyNotes?: string;
}

export interface HadithConflict {
  conflictType:
    | "contradictory-guidance"
    | "authenticity-dispute"
    | "contextual-difference";
  description: string;
  severity: "minor" | "moderate" | "major" | "critical";
  scholarlyResolution?: string;
}

export interface ScholarlyConsensusAssessment {
  score: number; // 0-100
  consensusLevel:
    | "unanimous"
    | "majority"
    | "significant-minority"
    | "disputed"
    | "no-consensus";
  iraqiScholarOpinions: IraqiScholarOpinion[];
  internationalConsensus: InternationalConsensus;
  contemporaryRelevance: number; // 0-100
}

export interface IraqiScholarOpinion {
  scholarName: string;
  institution: string;
  position: string;
  opinion:
    | "strongly-supports"
    | "supports"
    | "neutral"
    | "opposes"
    | "strongly-opposes";
  reasoning: string;
  date: Date;
  authority: number; // 0-100, based on scholar's recognition and expertise
}

export interface InternationalConsensus {
  sunniConsensus: "unanimous" | "majority" | "divided" | "minority" | "opposed";
  majorInstitutions: InstitutionOpinion[];
  regionalVariations: RegionalVariation[];
}

export interface InstitutionOpinion {
  institution: string;
  country: string;
  position:
    | "strongly-supports"
    | "supports"
    | "neutral"
    | "opposes"
    | "strongly-opposes";
  authority: number; // 0-100
}

export interface RegionalVariation {
  region: string;
  commonPosition: string;
  culturalFactors: string[];
  relevanceToIraq: number; // 0-100
}

export interface ContemporaryRulingAssessment {
  score: number; // 0-100
  modernFatawa: ModernFatwa[];
  islamicCouncilRulings: IslamicCouncilRuling[];
  technologicalConsiderations: TechnologicalConsideration[];
}

export interface ModernFatwa {
  fatwaId: string;
  issuingAuthority: string;
  country: string;
  date: Date;
  question: string;
  ruling: string;
  reasoning: string;
  applicability:
    | "directly-applicable"
    | "analogous"
    | "contextual"
    | "general-principle";
  authorityLevel: number; // 0-100
}

export interface IslamicCouncilRuling {
  council: string;
  rulingNumber: string;
  date: Date;
  topic: string;
  decision: string;
  reasoning: string[];
  dissenting?: string;
  implementationGuidance: string[];
}

export interface TechnologicalConsideration {
  technology: string;
  islamicPerspective: string;
  benefits: string[];
  concerns: string[];
  conditions: string[];
  overallAssessment:
    | "permissible"
    | "recommended"
    | "neutral"
    | "discouraged"
    | "prohibited";
}

export interface IslamicComplianceIssue {
  issueType:
    | "theological-concern"
    | "practical-implementation"
    | "cultural-sensitivity"
    | "ethical-consideration";
  severity: "minor" | "moderate" | "major" | "critical";
  description: string;
  islamicBasis: string[];
  suggestedResolution: string;
  requiresScholarReview: boolean;
}

// Cultural Appropriateness Framework
export interface CulturalAppropriatenessResult {
  overallAppropriateness: number; // 0-100, must be >95 for approval
  iraqiCulturalValues: IraqiCulturalValuesAssessment;
  socialNorms: SocialNormsAssessment;
  languageAppropriateness: LanguageAppropriatenessAssessment;
  contextualSensitivity: ContextualSensitivityAssessment;
  appropriatenessIssues: CulturalAppropriatenessIssue[];
}

export interface IraqiCulturalValuesAssessment {
  score: number; // 0-100
  familyValues: FamilyValuesScore;
  hospitalityNorms: HospitalityNormsScore;
  respectAndHonor: RespectAndHonorScore;
  communityOrientation: CommunityOrientationScore;
  traditionalWisdom: TraditionalWisdomScore;
}

export interface FamilyValuesScore {
  score: number; // 0-100
  familyRespect: number;
  elderlyRespect: number;
  childrenConsideration: number;
  marriageAndFamily: number;
  genderSensitivity: number;
}

export interface HospitalityNormsScore {
  score: number; // 0-100
  guestRespect: number;
  generosity: number;
  warmthAndWelcome: number;
  socialGraceMOST: number;
}

export interface RespectAndHonorScore {
  score: number; // 0-100
  personalHonor: number;
  familyHonor: number;
  professionalRespect: number;
  socialStanding: number;
}

export interface CommunityOrientationScore {
  score: number; // 0-100
  collectiveGood: number;
  socialHarmony: number;
  communitySupport: number;
  socialResponsibility: number;
}

export interface TraditionalWisdomScore {
  score: number; // 0-100
  ancestralWisdom: number;
  culturalContinuity: number;
  traditionalPractices: number;
  culturalPreservation: number;
}

export interface SocialNormsAssessment {
  score: number; // 0-100
  communicationStyle: CommunicationStyleAssessment;
  socialHierarchy: SocialHierarchyAssessment;
  conflictResolution: ConflictResolutionAssessment;
  publicBehavior: PublicBehaviorAssessment;
}

export interface CommunicationStyleAssessment {
  score: number; // 0-100
  politeness: number;
  indirectness: number;
  respectfulTone: number;
  contextualSensitivity: number;
}

export interface SocialHierarchyAssessment {
  score: number; // 0-100
  ageRespect: number;
  authorityRespect: number;
  educationRespect: number;
  socialPositionAwareness: number;
}

export interface ConflictResolutionAssessment {
  score: number; // 0-100
  diplomacy: number;
  mediation: number;
  facePreservation: number;
  harmonySeeking: number;
}

export interface PublicBehaviorAssessment {
  score: number; // 0-100
  publicDecorum: number;
  modesty: number;
  propriety: number;
  socialAppropriateNess: number;
}

export interface LanguageAppropriatenessAssessment {
  score: number; // 0-100
  arabicRespect: number;
  dialectSensitivity: number;
  formalityLevel: number;
  religiousLanguageUse: number;
  culturalExpressions: number;
}

export interface ContextualSensitivityAssessment {
  score: number; // 0-100
  religiousContext: number;
  politicalSensitivity: number;
  historicalAwareness: number;
  currentEvents: number;
  regionalVariations: number;
}

export interface CulturalAppropriatenessIssue {
  issueType:
    | "language-inappropriate"
    | "culturally-insensitive"
    | "socially-inappropriate"
    | "contextually-wrong";
  severity: "minor" | "moderate" | "major" | "critical";
  description: string;
  culturalBasis: string[];
  suggestedCorrection: string;
  requiresCulturalExpertReview: boolean;
}

// Professional Ethics Framework
export interface ProfessionalEthicsResult {
  overallEthicsScore: number; // 0-100, must be >95 for professional domain approval
  domainSpecificEthics: DomainSpecificEthicsAssessment;
  iraqiProfessionalStandards: IraqiProfessionalStandardsAssessment;
  islamicProfessionalEthics: IslamicProfessionalEthicsAssessment;
  ethicsIssues: ProfessionalEthicsIssue[];
}

export interface DomainSpecificEthicsAssessment {
  domain: ProfessionalDomain;
  score: number; // 0-100
  specificCriteria: DomainCriteria[];
  professionalGuidelines: ProfessionalGuideline[];
  bestPractices: BestPractice[];
}

export interface DomainCriteria {
  criteriaName: string;
  score: number; // 0-100
  description: string;
  importance: "critical" | "high" | "medium" | "low";
}

export interface ProfessionalGuideline {
  guideline: string;
  compliance: "full" | "partial" | "non-compliant";
  authority: string;
  importance: number; // 0-100
}

export interface BestPractice {
  practice: string;
  implementation:
    | "excellent"
    | "good"
    | "adequate"
    | "poor"
    | "not-implemented";
  recommendation: string;
}

export interface IraqiProfessionalStandardsAssessment {
  score: number; // 0-100
  regulatoryCompliance: RegulatoryComplianceAssessment;
  professionalConduct: ProfessionalConductAssessment;
  qualityStandards: QualityStandardsAssessment;
}

export interface RegulatoryComplianceAssessment {
  score: number; // 0-100
  applicableRegulations: ApplicableRegulation[];
  complianceStatus:
    | "fully-compliant"
    | "mostly-compliant"
    | "partially-compliant"
    | "non-compliant";
  requiredActions: string[];
}

export interface ApplicableRegulation {
  regulation: string;
  authority: string;
  requirement: string;
  compliance: boolean;
  notes?: string;
}

export interface ProfessionalConductAssessment {
  score: number; // 0-100
  ethicalStandards: number;
  professionalIntegrity: number;
  competence: number;
  accountability: number;
}

export interface QualityStandardsAssessment {
  score: number; // 0-100
  qualityAssurance: number;
  continuousImprovement: number;
  customerSatisfaction: number;
  outcomeEffectiveness: number;
}

export interface IslamicProfessionalEthicsAssessment {
  score: number; // 0-100
  amanaprinciple: number; // Trustworthiness
  ihsanPrinciple: number; // Excellence
  adalPrinciple: number; // Justice
  maslahaprinciple: number; // Public interest
}

export interface ProfessionalEthicsIssue {
  issueType:
    | "regulatory-violation"
    | "professional-misconduct"
    | "quality-concern"
    | "islamic-ethics-violation";
  severity: "minor" | "moderate" | "major" | "critical";
  description: string;
  professionalBasis: string[];
  regulatoryImplications: string[];
  suggestedResolution: string;
  requiresProfessionalReview: boolean;
}

// Decision Reasoning Framework
export interface DecisionReasoning {
  primaryFactors: ReasoningFactor[];
  islamicJustification: IslamicJustification;
  culturalJustification: CulturalJustification;
  professionalJustification?: ProfessionalJustification;
  riskAssessment: RiskAssessment;
  alternativeOptions: AlternativeOption[];
}

export interface ReasoningFactor {
  factor: string;
  weight: number; // 0-100
  impact: "positive" | "negative" | "neutral";
  confidence: number; // 0-100
  evidence: string[];
}

export interface IslamicJustification {
  primaryPrinciples: string[];
  quranSupport: QuranReference[];
  hadithSupport: HadithReference[];
  scholarlySupport: string[];
  contemporaryRelevance: string;
}

export interface CulturalJustification {
  culturalValues: string[];
  socialNorms: string[];
  historicalPrecedent: string[];
  contemporaryContext: string;
}

export interface ProfessionalJustification {
  professionalStandards: string[];
  bestPractices: string[];
  regulatoryRequirements: string[];
  qualityConsiderations: string[];
}

export interface RiskAssessment {
  overallRiskLevel: "very-low" | "low" | "medium" | "high" | "very-high";
  culturalRisks: Risk[];
  islamicRisks: Risk[];
  professionalRisks: Risk[];
  mitigationStrategies: MitigationStrategy[];
}

export interface Risk {
  riskType: string;
  probability: "very-low" | "low" | "medium" | "high" | "very-high";
  impact: "minor" | "moderate" | "major" | "severe" | "critical";
  description: string;
  timeframe: "immediate" | "short-term" | "medium-term" | "long-term";
}

export interface MitigationStrategy {
  strategy: string;
  effectiveness: "low" | "medium" | "high" | "very-high";
  implementation: "immediate" | "short-term" | "medium-term" | "long-term";
  cost: "low" | "medium" | "high" | "very-high";
}

export interface AlternativeOption {
  option: string;
  culturalCompliance: number; // 0-100
  islamicCompliance: number; // 0-100
  professionalCompliance: number; // 0-100
  feasibility: "high" | "medium" | "low" | "very-low";
  recommendation:
    | "strongly-recommended"
    | "recommended"
    | "neutral"
    | "not-recommended"
    | "strongly-discouraged";
}

// Content Modification Framework
export interface ContentModification {
  modificationType:
    | "language-adjustment"
    | "cultural-adaptation"
    | "islamic-compliance"
    | "professional-enhancement";
  originalContent: string;
  modifiedContent: string;
  justification: string;
  confidence: number; // 0-100
  reviewRequired: boolean;
}

// Cultural Learning Framework
export interface CulturalFeedback {
  feedbackId: string;
  decisionId: string;
  userFeedback: UserFeedback;
  expertFeedback?: ExpertFeedback;
  outcomeValidation: OutcomeValidation;
  timestamp: Date;
}

export interface UserFeedback {
  userId: string;
  userRole: string;
  culturalRating: number; // 1-10
  islamicRating: number; // 1-10
  professionalRating?: number; // 1-10
  comments: string;
  specificIssues: string[];
  improvementSuggestions: string[];
}

export interface ExpertFeedback {
  expertId: string;
  expertiseArea:
    | "islamic-scholarship"
    | "cultural-anthropology"
    | "professional-domain"
    | "arabic-linguistics";
  institution: string;
  evaluation: ExpertEvaluation;
  recommendations: string[];
  authorityLevel: number; // 0-100
}

export interface ExpertEvaluation {
  accuracy: number; // 0-100
  appropriateness: number; // 0-100
  compliance: number; // 0-100
  improvement: number; // 0-100
  overallAssessment:
    | "excellent"
    | "good"
    | "satisfactory"
    | "needs-improvement"
    | "unsatisfactory";
}

export interface OutcomeValidation {
  actualOutcome: string;
  predictedOutcome: string;
  accuracyScore: number; // 0-100
  userSatisfaction: number; // 0-100
  culturalAcceptance: number; // 0-100
  longTermImpact: "positive" | "neutral" | "negative";
}

// Cultural Learning Result Types
export interface LearningUpdate {
  updateType:
    | "model-improvement"
    | "rule-refinement"
    | "new-pattern"
    | "exception-handling";
  affectedComponents: string[];
  improvementMetrics: ImprovementMetrics;
  validationRequired: boolean;
}

export interface ImprovementMetrics {
  accuracyImprovement: number; // percentage improvement
  speedImprovement: number; // percentage improvement
  userSatisfactionImprovement: number; // percentage improvement
  expertApprovalImprovement: number; // percentage improvement
  confidenceLevel: number; // 0-100
}

export interface ModelUpdateResult {
  success: boolean;
  updatedModels: string[];
  performanceMetrics: PerformanceMetrics;
  rollbackPlan: RollbackPlan;
  monitoringPlan: MonitoringPlan;
}

export interface PerformanceMetrics {
  responseTime: number; // ms
  accuracy: number; // 0-100
  throughput: number; // requests per second
  errorRate: number; // percentage
  userSatisfaction: number; // 0-100
}

export interface RollbackPlan {
  triggerConditions: string[];
  rollbackSteps: string[];
  estimatedRollbackTime: number; // minutes
  dataBackupStatus: boolean;
}

export interface MonitoringPlan {
  metricsToMonitor: string[];
  alertThresholds: AlertThreshold[];
  monitoringDuration: number; // hours
  reportingSchedule: "hourly" | "daily" | "weekly";
}

export interface AlertThreshold {
  metric: string;
  warningThreshold: number;
  criticalThreshold: number;
  action: string;
}

// System Configuration Types
export interface CulturalEngineConfig {
  islamicComplianceThreshold: number; // 0-100, default 90
  culturalAppropriatenessThreshold: number; // 0-100, default 95
  professionalEthicsThreshold: number; // 0-100, default 95
  responseTimeTarget: number; // ms, default 500
  enableLearning: boolean; // default true
  expertReviewRequired: boolean; // default true for critical decisions
  cacheEnabled: boolean; // default true
  logLevel: "debug" | "info" | "warn" | "error"; // default 'info'
}

export interface CulturalEngineMetrics {
  totalDecisions: number;
  approvedDecisions: number;
  rejectedDecisions: number;
  averageResponseTime: number; // ms
  culturalComplianceRate: number; // percentage
  islamicComplianceRate: number; // percentage
  professionalComplianceRate: number; // percentage
  userSatisfactionScore: number; // 0-100
  expertApprovalRate: number; // percentage
  learningImprovementRate: number; // percentage
}
