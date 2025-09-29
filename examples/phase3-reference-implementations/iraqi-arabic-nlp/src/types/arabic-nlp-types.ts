/**
 * Iraqi Arabic NLP Pipeline Types
 *
 * Type definitions for Arabic language processing with Iraqi dialect recognition
 * and cultural context understanding
 */

import { IraqiCulturalContext } from "@iraqi-ai/types";

// Core NLP Processing Types
export interface ArabicNLPRequest {
  text: string;
  language: "ar" | "ar-IQ" | "mixed" | "auto-detect";
  processingMode:
    | "full"
    | "dialect-only"
    | "cultural-context"
    | "semantic-analysis"
    | "response-generation";
  culturalContext?: IraqiCulturalContext;
  userPreferences?: {
    outputLanguage: "ar" | "ar-IQ" | "en" | "mixed";
    formalityLevel: "formal" | "informal" | "traditional" | "modern";
    dialectPreference: "iraqi" | "msa" | "mixed" | "user-adaptive";
  };
}

export interface ArabicNLPResponse {
  success: boolean;
  processingTime: number;
  languageDetection: LanguageDetectionResult;
  dialectAnalysis: IraqiDialectAnalysis;
  culturalContext: CulturalContextExtraction;
  semanticAnalysis: SemanticAnalysisResult;
  responseGeneration?: ResponseGenerationResult;
  confidence: number; // 0-100
  warnings: ProcessingWarning[];
  error?: string;
}

// Language Detection
export interface LanguageDetectionResult {
  primaryLanguage: "ar" | "en" | "mixed" | "unknown";
  confidence: number; // 0-100
  detectedDialect?: IraqiDialectType;
  mixedLanguageSegments?: MixedLanguageSegment[];
  textDirection: "rtl" | "ltr" | "mixed";
  scriptType: "arabic" | "latin" | "mixed" | "other";
}

export interface MixedLanguageSegment {
  text: string;
  language: "ar" | "en" | "other";
  startIndex: number;
  endIndex: number;
  confidence: number;
  transliteration?: string;
}

export type IraqiDialectType =
  | "baghdadi" // Baghdad dialect
  | "basrawi" // Basra dialect
  | "moslawi" // Mosul dialect
  | "kurdish-iraqi" // Kurdish-influenced Iraqi
  | "southern-iraqi" // Southern Iraqi dialects
  | "northern-iraqi" // Northern Iraqi dialects
  | "bedouin-iraqi" // Bedouin-influenced Iraqi
  | "mesopotamian" // General Mesopotamian
  | "mixed-iraqi" // Mixed Iraqi dialects
  | "msa-iraqi"; // MSA with Iraqi influence

// Iraqi Dialect Analysis
export interface IraqiDialectAnalysis {
  overallDialectScore: number; // 0-100, >85 considered Iraqi
  detectedDialect: IraqiDialectType;
  dialectConfidence: number; // 0-100
  dialectFeatures: DialectFeature[];
  regionalVariations: RegionalVariation[];
  dialectPatterns: DialectPattern[];
  culturalMarkers: CulturalMarker[];
  modernInfluences: ModernInfluence[];
}

export interface DialectFeature {
  featureType:
    | "phonetic"
    | "lexical"
    | "grammatical"
    | "syntactic"
    | "cultural-expression";
  feature: string;
  iraqiVariant: string;
  msaEquivalent?: string;
  confidence: number; // 0-100
  frequency: "very-common" | "common" | "occasional" | "rare";
  regionalSpecificity: IraqiDialectType[];
}

export interface RegionalVariation {
  region: IraqiDialectType;
  specificFeatures: string[];
  confidence: number; // 0-100
  culturalContext: string;
  historicalInfluence: string[];
}

export interface DialectPattern {
  pattern: string;
  patternType:
    | "pronunciation"
    | "vocabulary"
    | "grammar"
    | "idiom"
    | "cultural-reference";
  iraqiExample: string;
  standardArabicEquivalent?: string;
  culturalSignificance: string;
  usageContext:
    | "formal"
    | "informal"
    | "traditional"
    | "modern"
    | "religious"
    | "social";
}

export interface CulturalMarker {
  marker: string;
  culturalCategory:
    | "family"
    | "hospitality"
    | "respect"
    | "religion"
    | "tradition"
    | "social"
    | "historical";
  culturalMeaning: string;
  appropriatenessLevel: number; // 0-100
  contextualUsage: string[];
  modernRelevance:
    | "highly-relevant"
    | "relevant"
    | "somewhat-relevant"
    | "traditional-only";
}

export interface ModernInfluence {
  influence: string;
  influenceType:
    | "technology"
    | "globalization"
    | "education"
    | "media"
    | "social-change";
  impact: "high" | "medium" | "low";
  generationalDifference: boolean;
  adaptationLevel:
    | "fully-integrated"
    | "partially-integrated"
    | "emerging"
    | "resisted";
}

// Cultural Context Extraction
export interface CulturalContextExtraction {
  overallCulturalRelevance: number; // 0-100
  islamicReferences: IslamicReference[];
  iraqiCulturalReferences: IraqiCulturalReference[];
  socialContextIndicators: SocialContextIndicator[];
  professionalContext?: ProfessionalContextIndicator;
  emotionalTone: EmotionalToneAnalysis;
  culturalSensitivity: CulturalSensitivityAssessment;
}

export interface IslamicReference {
  reference: string;
  referenceType:
    | "quran"
    | "hadith"
    | "islamic-greeting"
    | "religious-expression"
    | "islamic-value"
    | "prayer-related";
  arabicText: string;
  transliteration: string;
  meaning: string;
  contextualAppropriateNess: number; // 0-100
  religousSignificance: "high" | "medium" | "low";
  usageGuidelines: string[];
}

export interface IraqiCulturalReference {
  reference: string;
  referenceType:
    | "historical"
    | "geographical"
    | "traditional"
    | "family-related"
    | "social-custom"
    | "food-culture"
    | "folklore";
  culturalMeaning: string;
  regionalAssociation: IraqiDialectType[];
  generationalRelevance:
    | "all-generations"
    | "older-generations"
    | "younger-generations"
    | "middle-aged";
  appropriatenessScore: number; // 0-100
  contextualNotes: string[];
}

export interface SocialContextIndicator {
  indicator: string;
  contextType:
    | "family"
    | "professional"
    | "social"
    | "formal"
    | "informal"
    | "ceremonial"
    | "educational";
  socialImplication: string;
  appropriateness: number; // 0-100
  responseGuidelines: string[];
}

export interface ProfessionalContextIndicator {
  domain:
    | "legal"
    | "medical"
    | "educational"
    | "business"
    | "technical"
    | "government"
    | "religious";
  professionalLevel: "entry" | "mid-level" | "senior" | "expert" | "leadership";
  terminologyUsed: ProfessionalTerm[];
  formalityRequirement: "very-formal" | "formal" | "semi-formal" | "informal";
  culturalConsiderations: string[];
}

export interface ProfessionalTerm {
  term: string;
  arabicTerm: string;
  definition: string;
  usageContext: string;
  accuracy: number; // 0-100
  alternatives: string[];
}

export interface EmotionalToneAnalysis {
  primaryTone: "positive" | "neutral" | "negative" | "mixed";
  emotionalIntensity: number; // 0-100
  specificEmotions: DetectedEmotion[];
  culturalEmotionalContext: string;
  appropriateResponseTone:
    | "formal"
    | "warm"
    | "supportive"
    | "respectful"
    | "enthusiastic";
}

export interface DetectedEmotion {
  emotion:
    | "joy"
    | "sadness"
    | "anger"
    | "fear"
    | "surprise"
    | "disgust"
    | "respect"
    | "gratitude"
    | "concern";
  intensity: number; // 0-100
  culturalExpression: string;
  responseGuidance: string;
}

export interface CulturalSensitivityAssessment {
  sensitivityLevel: "high" | "medium" | "low" | "neutral";
  sensitivityAreas: SensitivityArea[];
  responseRequirements: ResponseRequirement[];
  cautionFlags: CautionFlag[];
}

export interface SensitivityArea {
  area:
    | "religious"
    | "political"
    | "family"
    | "gender"
    | "tribal"
    | "sectarian"
    | "historical"
    | "social-class";
  sensitivityScore: number; // 0-100
  specificConcerns: string[];
  handlingGuidelines: string[];
}

export interface ResponseRequirement {
  requirement: string;
  priority: "critical" | "high" | "medium" | "low";
  consequence: string;
  implementation: string;
}

export interface CautionFlag {
  flag: string;
  reason: string;
  severity: "critical" | "major" | "moderate" | "minor";
  recommendedAction: string;
}

// Semantic Analysis
export interface SemanticAnalysisResult {
  overallSemanticScore: number; // 0-100
  intentDetection: IntentDetectionResult;
  entityExtraction: EntityExtractionResult;
  conceptualAnalysis: ConceptualAnalysisResult;
  culturalSemantics: CulturalSemanticsResult;
  disambiguationResults: DisambiguationResult[];
}

export interface IntentDetectionResult {
  primaryIntent: Intent;
  secondaryIntents: Intent[];
  intentConfidence: number; // 0-100
  culturallyInfluencedIntents: CulturallyInfluencedIntent[];
}

export interface Intent {
  intent: string;
  category:
    | "question"
    | "request"
    | "complaint"
    | "compliment"
    | "instruction"
    | "information"
    | "social"
    | "professional";
  confidence: number; // 0-100
  culturalContext: string;
  expectedResponseType:
    | "informational"
    | "actionable"
    | "supportive"
    | "formal"
    | "social";
}

export interface CulturallyInfluencedIntent {
  baseIntent: string;
  culturalModification: string;
  culturalReason: string;
  modifiedResponse: string;
}

export interface EntityExtractionResult {
  entities: ExtractedEntity[];
  culturalEntities: CulturalEntity[];
  professionalEntities: ProfessionalEntity[];
  temporalEntities: TemporalEntity[];
  locationEntities: LocationEntity[];
}

export interface ExtractedEntity {
  entity: string;
  entityType:
    | "person"
    | "place"
    | "organization"
    | "date"
    | "number"
    | "concept"
    | "object";
  confidence: number; // 0-100
  context: string;
  arabicForm?: string;
  transliteration?: string;
  culturalSignificance?: string;
}

export interface CulturalEntity {
  entity: string;
  culturalCategory:
    | "islamic-concept"
    | "iraqi-tradition"
    | "historical-reference"
    | "cultural-practice"
    | "social-concept";
  arabicTerm: string;
  culturalMeaning: string;
  appropriatenessGuidelines: string[];
  modernRelevance: number; // 0-100
}

export interface ProfessionalEntity {
  entity: string;
  professionalDomain: string;
  arabicTerm: string;
  technicalAccuracy: number; // 0-100
  contextualUsage: string;
  alternativeTerms: string[];
}

export interface TemporalEntity {
  entity: string;
  temporalType:
    | "date"
    | "time"
    | "duration"
    | "frequency"
    | "islamic-calendar"
    | "cultural-time";
  gregorianEquivalent?: string;
  islamicCalendarEquivalent?: string;
  culturalContext?: string;
}

export interface LocationEntity {
  entity: string;
  locationType:
    | "city"
    | "country"
    | "region"
    | "landmark"
    | "cultural-site"
    | "religious-site";
  arabicName: string;
  geographicalContext: string;
  culturalSignificance?: string;
  currentRelevance: number; // 0-100
}

export interface ConceptualAnalysisResult {
  mainConcepts: Concept[];
  conceptRelationships: ConceptRelationship[];
  abstractionLevel:
    | "concrete"
    | "semi-abstract"
    | "abstract"
    | "highly-abstract";
  culturalConceptAlignment: number; // 0-100
}

export interface Concept {
  concept: string;
  conceptType:
    | "tangible"
    | "abstract"
    | "cultural"
    | "religious"
    | "social"
    | "professional";
  arabicTerm: string;
  definition: string;
  culturalLoadedness: number; // 0-100
  associatedConcepts: string[];
}

export interface ConceptRelationship {
  concept1: string;
  concept2: string;
  relationshipType:
    | "similar"
    | "opposite"
    | "causal"
    | "hierarchical"
    | "cultural-association"
    | "religious-connection";
  strength: number; // 0-100
  culturalBasis: string;
}

export interface CulturalSemanticsResult {
  culturallyLoadedTerms: CulturallyLoadedTerm[];
  implicitCulturalMeanings: ImplicitCulturalMeaning[];
  culturalAssumptions: CulturalAssumption[];
  crossCulturalConsiderations: CrossCulturalConsideration[];
}

export interface CulturallyLoadedTerm {
  term: string;
  arabicTerm: string;
  culturalLoading: number; // 0-100
  culturalMeaning: string;
  neutralAlternatives: string[];
  usageGuidelines: string[];
}

export interface ImplicitCulturalMeaning {
  implicitMeaning: string;
  culturalBasis: string;
  confidence: number; // 0-100
  responseImplications: string[];
}

export interface CulturalAssumption {
  assumption: string;
  assumptionType:
    | "value-based"
    | "behavioral"
    | "social"
    | "religious"
    | "traditional";
  validityInContext: number; // 0-100
  alternativePerspectives: string[];
}

export interface CrossCulturalConsideration {
  consideration: string;
  culturalClash: boolean;
  severity: "high" | "medium" | "low";
  recommendedApproach: string;
}

export interface DisambiguationResult {
  ambiguousTerm: string;
  possibleMeanings: PossibleMeaning[];
  selectedMeaning: PossibleMeaning;
  disambiguationConfidence: number; // 0-100
  contextualClues: string[];
}

export interface PossibleMeaning {
  meaning: string;
  arabicTerm: string;
  context: string;
  probability: number; // 0-100
  culturalRelevance: number; // 0-100
}

// Response Generation
export interface ResponseGenerationResult {
  success: boolean;
  generatedResponse: GeneratedResponse;
  alternativeResponses: AlternativeResponse[];
  culturalValidation: ResponseCulturalValidation;
  qualityMetrics: ResponseQualityMetrics;
}

export interface GeneratedResponse {
  text: string;
  language: "ar" | "ar-IQ" | "en" | "mixed";
  dialect: IraqiDialectType;
  formalityLevel: "formal" | "informal" | "traditional" | "modern";
  culturalAppropriateness: number; // 0-100
  islamicCompliance: number; // 0-100
  responseType:
    | "informational"
    | "supportive"
    | "instructional"
    | "social"
    | "professional";
}

export interface AlternativeResponse {
  text: string;
  variant:
    | "more-formal"
    | "less-formal"
    | "dialect-adapted"
    | "culturally-enhanced"
    | "simplified";
  appropriatenessScore: number; // 0-100
  usageContext: string;
}

export interface ResponseCulturalValidation {
  overallValidation: number; // 0-100
  islamicComplianceCheck: number; // 0-100
  culturalSensitivityCheck: number; // 0-100
  professionalAppropriatenessCheck?: number; // 0-100
  validationIssues: ValidationIssue[];
  improvementSuggestions: string[];
}

export interface ValidationIssue {
  issue: string;
  severity: "critical" | "major" | "moderate" | "minor";
  category:
    | "islamic-compliance"
    | "cultural-sensitivity"
    | "professional-appropriateness"
    | "language-accuracy";
  suggestion: string;
}

export interface ResponseQualityMetrics {
  linguisticAccuracy: number; // 0-100
  culturalRelevance: number; // 0-100
  professionalSuitability: number; // 0-100
  userSatisfactionPrediction: number; // 0-100
  overallQuality: number; // 0-100
}

// Processing Warnings and Errors
export interface ProcessingWarning {
  warningType:
    | "low-confidence"
    | "cultural-ambiguity"
    | "dialect-uncertainty"
    | "context-insufficient"
    | "semantic-complexity";
  message: string;
  severity: "info" | "warning" | "error";
  suggestion: string;
  affectedComponents: string[];
}

// Configuration Types
export interface ArabicNLPConfig {
  dialectDetectionThreshold: number; // 0-100, default 85
  culturalContextThreshold: number; // 0-100, default 70
  semanticAnalysisDepth: "basic" | "standard" | "comprehensive"; // default 'standard'
  responseGenerationEnabled: boolean; // default true
  cachingEnabled: boolean; // default true
  performanceMode: "speed" | "balanced" | "accuracy"; // default 'balanced'
  culturalValidationEnabled: boolean; // default true
  logLevel: "debug" | "info" | "warn" | "error"; // default 'info'
}

export interface ArabicNLPMetrics {
  totalProcessingRequests: number;
  successfulProcessing: number;
  failedProcessing: number;
  averageProcessingTime: number; // ms
  dialectRecognitionAccuracy: number; // percentage
  culturalContextAccuracy: number; // percentage
  semanticAnalysisAccuracy: number; // percentage
  responseGenerationSuccess: number; // percentage
  userSatisfactionScore: number; // 0-100
  culturalValidationPassRate: number; // percentage
}
