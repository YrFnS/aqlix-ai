/**
 * Iraqi Advanced Project Management - Core Types
 * Comprehensive type system for multi-ministry project coordination
 * Enhanced for Iraqi government deployment with cultural intelligence
 * 
 * Key Features:
 * - Multi-ministry project coordination with hierarchical approval
 * - Islamic compliance tracking with automated Sharia validation
 * - Arabic-first version control with RTL diff visualization
 * - Prayer time-aware scheduling and cultural event management
 * - Government audit trails with comprehensive documentation
 * - Ministry-specific templates and approval workflows
 * - Performance optimization for distributed teams
 * - Security integration with comprehensive access control
 */

import { EventEmitter } from 'events';

// ============================================================================
// CORE PROJECT TYPES
// ============================================================================

export type ProjectType = 
  | 'infrastructure' 
  | 'digital-transformation' 
  | 'citizen-services' 
  | 'inter-ministry' 
  | 'emergency-response'
  | 'budget-planning'
  | 'policy-development'
  | 'procurement'
  | 'human-resources'
  | 'public-consultation'
  | 'audit-compliance'
  | 'research-development';

export type ProjectStatus = 
  | 'planning'
  | 'design'
  | 'approval-pending'
  | 'approved'
  | 'in-progress'
  | 'on-hold'
  | 'delayed'
  | 'at-risk'
  | 'completed'
  | 'cancelled'
  | 'archived'
  | 'under-review';

export type ProjectPriority = 
  | 'routine'
  | 'normal'
  | 'important'
  | 'urgent'
  | 'critical'
  | 'emergency';

export type MinistryType = 
  | 'health'
  | 'education'
  | 'interior'
  | 'justice'
  | 'finance'
  | 'defense'
  | 'foreign-affairs'
  | 'communications'
  | 'transportation'
  | 'agriculture'
  | 'oil'
  | 'electricity'
  | 'trade'
  | 'labor'
  | 'planning'
  | 'environment'
  | 'culture'
  | 'youth-sports'
  | 'immigration'
  | 'water-resources';

export type SecurityClassification = 
  | 'public'
  | 'internal'
  | 'confidential'
  | 'secret'
  | 'top-secret';

export type ApprovalLevel = 
  | 'department'
  | 'directorate'
  | 'ministry'
  | 'council-of-ministers'
  | 'parliament'
  | 'presidential';

// ============================================================================
// PROJECT CONFIGURATION
// ============================================================================

export interface ProjectConfig {
  // Core configuration
  multiMinistry: boolean;
  islamicCompliance: boolean;
  culturalValidation: boolean;
  auditTrail: boolean;
  governmentProtocol: boolean;
  citizenFacing: boolean;
  
  // Timeline and scheduling
  prayerTimeAware: boolean;
  ramadanScheduleAware: boolean;
  islamicHolidayAware: boolean;
  culturalEventAware: boolean;
  workdayFlexibility: boolean;
  
  // Approval and workflow
  approvalHierarchy: ApprovalLevel[];
  shuraConsultation: boolean;
  ministerialApproval: boolean;
  parliamentaryOversight: boolean;
  publicConsultation: boolean;
  
  // Version control and documentation
  arabicVersionControl: boolean;
  rtlDiffVisualization: boolean;
  bilingualDocumentation: boolean;
  autoTranslation: boolean;
  culturalReview: boolean;
  
  // Security and access
  securityClassification: SecurityClassification;
  accessControl: boolean;
  encryptionRequired: boolean;
  auditLogging: boolean;
  governmentCompliance: boolean;
  
  // Performance and optimization
  distributedTeams: boolean;
  realTimeSync: boolean;
  offlineSupport: boolean;
  performanceMonitoring: boolean;
  resourceOptimization: boolean;
}

// ============================================================================
// PROJECT DEFINITION
// ============================================================================

export interface IraqiProject {
  // Basic information
  id: string;
  title: string;
  titleArabic: string;
  description: string;
  descriptionArabic: string;
  type: ProjectType;
  status: ProjectStatus;
  priority: ProjectPriority;
  
  // Organization and ownership
  primaryMinistry: MinistryType;
  secondaryMinistries: MinistryType[];
  projectManager: ProjectParticipant;
  sponsor: ProjectSponsor;
  stakeholders: ProjectStakeholder[];
  
  // Timeline and scheduling
  timeline: ProjectTimeline;
  milestones: ProjectMilestone[];
  dependencies: ProjectDependency[];
  criticalPath: string[];
  
  // Resources and budget
  budget: ProjectBudget;
  resources: ProjectResource[];
  teamMembers: ProjectTeamMember[];
  
  // Governance and approval
  approvalChain: ProjectApprovalChain;
  governanceStructure: GovernanceStructure;
  complianceRequirements: ComplianceRequirement[];
  
  // Documentation and version control
  documents: ProjectDocument[];
  versionHistory: VersionHistoryEntry[];
  arabicContent: ArabicContentManagement;
  
  // Cultural and Islamic compliance
  culturalValidation: CulturalValidationResult;
  islamicCompliance: IslamicComplianceResult;
  shuraConsultation?: ShuraConsultationResult;
  
  // Security and access
  security: ProjectSecurity;
  accessControl: AccessControlMatrix;
  auditTrail: AuditTrailEntry[];
  
  // Performance and metrics
  performanceMetrics: ProjectPerformanceMetrics;
  riskAssessment: RiskAssessment;
  qualityMetrics: QualityMetrics;
  
  // Configuration
  config: ProjectConfig;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastAccessedAt: Date;
}

// ============================================================================
// PROJECT PARTICIPANTS
// ============================================================================

export interface ProjectParticipant {
  id: string;
  name: string;
  nameArabic: string;
  title: string;
  titleArabic: string;
  email: string;
  phone: string;
  
  // Organizational context
  ministry: MinistryType;
  department: string;
  departmentArabic: string;
  division?: string;
  divisionArabic?: string;
  hierarchyLevel: number; // 1-10, 1 = highest
  
  // Authority and permissions
  approvalAuthority: ApprovalAuthority;
  delegationRights: DelegationRights;
  securityClearance: SecurityClassification;
  projectRole: ProjectRole;
  
  // Cultural and religious context
  culturalAuthority: CulturalAuthority;
  islamicKnowledge: number; // 0-1
  arabicProficiency: number; // 0-1
  
  // Availability and scheduling
  workSchedule: WorkSchedule;
  prayerSchedule: PrayerSchedule;
  vacationSchedule: Date[];
  culturalEventSchedule: CulturalEvent[];
  
  // Performance and metrics
  performanceHistory: ParticipantPerformance[];
  averageResponseTime: number; // hours
  qualityScore: number; // 0-1
  culturalSensitivityScore: number; // 0-1
  
  // Preferences and settings
  languagePreference: 'arabic' | 'english' | 'both';
  notificationPreferences: NotificationPreferences;
  workingPreferences: WorkingPreferences;
}

export interface ProjectSponsor extends ProjectParticipant {
  sponsorLevel: 'ministry' | 'council' | 'parliament' | 'presidential';
  budgetAuthority: number; // IQD
  strategicInfluence: number; // 0-1
  politicalWeight: number; // 0-1
  decisionAuthority: DecisionAuthority;
}

export interface ProjectStakeholder {
  id: string;
  name: string;
  nameArabic: string;
  organization: string;
  organizationArabic: string;
  type: 'internal' | 'external' | 'citizen' | 'vendor' | 'partner';
  influence: number; // 0-1
  interest: number; // 0-1
  engagement: 'supportive' | 'neutral' | 'resistant' | 'unknown';
  communicationFrequency: 'daily' | 'weekly' | 'monthly' | 'as-needed';
  culturalConsiderations: CulturalConsideration[];
}

export interface ProjectTeamMember extends ProjectParticipant {
  specializations: string[];
  specializationsArabic: string[];
  availability: number; // 0-1, percentage allocation
  costRate: number; // IQD per hour
  skills: Skill[];
  certifications: Certification[];
  teamRole: TeamRole;
}

// ============================================================================
// PROJECT TIMELINE
// ============================================================================

export interface ProjectTimeline {
  startDate: Date;
  endDate: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  duration: number; // days
  actualDuration?: number; // days
  
  // Cultural and religious considerations
  prayerTimeBuffers: TimeBuffer[];
  ramadanAdjustments: RamadanAdjustment[];
  islamicHolidayExclusions: IslamicHoliday[];
  culturalEventConsiderations: CulturalEvent[];
  fridayScheduleAdjustments: FridayAdjustment[];
  
  // Government and administrative
  governmentHolidayExclusions: GovernmentHoliday[];
  parliamentarySessionConsiderations: ParliamentarySession[];
  budgetCycleAlignments: BudgetCycle[];
  auditPeriodConsiderations: AuditPeriod[];
  
  // Flexibility and buffer
  contingencyBuffer: number; // days
  weatherConsiderations: WeatherSeason[];
  emergencyProcedures: EmergencyProcedure[];
  
  // Tracking and reporting
  progressReporting: ProgressReportingSchedule;
  reviewPoints: ReviewPoint[];
  approvalGates: ApprovalGate[];
  qualityCheckpoints: QualityCheckpoint[];
}

export interface ProjectMilestone {
  id: string;
  title: string;
  titleArabic: string;
  description: string;
  descriptionArabic: string;
  type: 'deliverable' | 'approval' | 'review' | 'decision' | 'launch';
  
  // Timeline
  plannedDate: Date;
  actualDate?: Date;
  deadline: Date;
  criticalPath: boolean;
  
  // Dependencies and prerequisites
  dependencies: string[]; // milestone IDs
  prerequisites: MilestonePrerequisite[];
  deliverables: Deliverable[];
  
  // Approval and validation
  approvalRequired: boolean;
  approvers: string[]; // participant IDs
  culturalValidationRequired: boolean;
  islamicComplianceRequired: boolean;
  
  // Status and progress
  status: 'planned' | 'in-progress' | 'completed' | 'delayed' | 'at-risk';
  progress: number; // 0-1
  issues: MilestoneIssue[];
  risks: MilestoneRisk[];
  
  // Cultural considerations
  culturalSignificance: 'low' | 'medium' | 'high' | 'critical';
  islamicConsiderations: IslamicConsideration[];
  ceremonyRequired: boolean;
  publicAnnouncement: boolean;
  
  // Metrics and quality
  qualityMetrics: QualityMetric[];
  acceptanceCriteria: AcceptanceCriterion[];
  testingRequirements: TestingRequirement[];
}

export interface ProjectDependency {
  id: string;
  type: 'finish-to-start' | 'start-to-start' | 'finish-to-finish' | 'start-to-finish';
  predecessor: string; // milestone or task ID
  successor: string; // milestone or task ID
  lag: number; // days
  
  // Dependency management
  critical: boolean;
  external: boolean;
  ministry?: MinistryType; // if external
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  
  // Cultural and operational
  culturalSensitive: boolean;
  prayerTimeDependent: boolean;
  ramadanAffected: boolean;
  governmentProcessDependent: boolean;
  
  // Monitoring and control
  status: 'active' | 'resolved' | 'blocked' | 'at-risk';
  owner: string; // participant ID
  escalationPath: string[]; // participant IDs
  alternativeOptions: AlternativeOption[];
}

// ============================================================================
// PROJECT BUDGET AND RESOURCES
// ============================================================================

export interface ProjectBudget {
  totalBudget: number; // IQD
  approvedBudget: number; // IQD
  spentBudget: number; // IQD
  remainingBudget: number; // IQD
  
  // Budget breakdown
  categories: BudgetCategory[];
  ministryAllocations: MinistryAllocation[];
  yearlyBreakdown: YearlyBudget[];
  quarterlyBreakdown: QuarterlyBudget[];
  
  // Approval and authorization
  approvalLevel: ApprovalLevel;
  approvedBy: string; // participant ID
  budgetCode: string;
  accountingCode: string;
  
  // Tracking and control
  budgetVariance: number; // percentage
  costPerformanceIndex: number; // earned value
  budgetAlerts: BudgetAlert[];
  expenditureHistory: ExpenditureEntry[];
  
  // Government compliance
  procurementRules: ProcurementRule[];
  auditRequirements: AuditRequirement[];
  transparencyLevel: 'internal' | 'ministry' | 'government' | 'public';
  anticorruptionCompliance: boolean;
  
  // Cultural considerations
  zakatConsiderations: ZakatConsideration[];
  charitableAllocations: CharitableAllocation[];
  communityBenefits: CommunityBenefit[];
}

export interface ProjectResource {
  id: string;
  type: 'human' | 'material' | 'equipment' | 'facility' | 'technology' | 'service';
  name: string;
  nameArabic: string;
  description: string;
  descriptionArabic: string;
  
  // Availability and allocation
  totalAvailability: number;
  allocatedAmount: number;
  utilizationRate: number; // 0-1
  
  // Cost and budget
  costPerUnit: number; // IQD
  totalCost: number; // IQD
  budgetCategory: string;
  
  // Sourcing and procurement
  source: 'internal' | 'external' | 'procurement' | 'donated';
  supplier?: ResourceSupplier;
  procurementStatus: 'planned' | 'tendering' | 'contracted' | 'delivered';
  
  // Quality and specifications
  specifications: ResourceSpecification[];
  qualityRequirements: QualityRequirement[];
  certificationRequired: boolean;
  islamicCompliant: boolean;
  
  // Scheduling and dependencies
  availabilitySchedule: AvailabilityPeriod[];
  dependencies: ResourceDependency[];
  alternativeOptions: AlternativeResource[];
  
  // Cultural and religious considerations
  halalCompliant: boolean;
  culturallyAppropriate: boolean;
  localPreference: boolean;
  communityBenefit: boolean;
}

// ============================================================================
// GOVERNANCE AND APPROVAL
// ============================================================================

export interface ProjectApprovalChain {
  levels: ApprovalLevel[];
  stages: ApprovalStage[];
  parallelApprovals: ParallelApproval[];
  conditionalApprovals: ConditionalApproval[];
  
  // Islamic and cultural elements
  shuraConsultation?: ShuraConsultationStage;
  religiousAdvisoryReview?: ReligiousAdvisoryStage;
  culturalSensitivityReview?: CulturalSensitivityStage;
  communityConsultation?: CommunityConsultationStage;
  
  // Government elements
  ministerialReview: MinisterialReviewStage;
  departmentCoordination: DepartmentCoordinationStage[];
  interMinistryApproval?: InterMinistryApprovalStage[];
  parliamentaryReview?: ParliamentaryReviewStage;
  
  // Public and transparency
  publicConsultation?: PublicConsultationStage;
  mediaDisclosure?: MediaDisclosureStage;
  citizenFeedback?: CitizenFeedbackStage;
  transparencyReporting?: TransparencyReportingStage;
  
  // Emergency and bypass
  emergencyBypass: EmergencyBypass[];
  escalationPaths: EscalationPath[];
  delegationChains: DelegationChain[];
}

export interface GovernanceStructure {
  steeringCommittee: CommitteeStructure;
  projectBoard: BoardStructure;
  workingGroups: WorkingGroup[];
  advisoryBodies: AdvisoryBody[];
  
  // Islamic governance
  shuraCouncil?: ShuraCouncilStructure;
  islamicAdvisoryBoard?: IslamicAdvisoryBoard;
  religiousScholars?: ReligiousScholar[];
  
  // Government governance
  ministerialOversight: MinisterialOversight;
  parliamentaryCommittee?: ParliamentaryCommittee;
  auditCommittee: AuditCommittee;
  ethicsCommittee?: EthicsCommittee;
  
  // Cultural governance
  culturalAdvisors: CulturalAdvisor[];
  communityRepresentatives: CommunityRepresentative[];
  elderConsultation?: ElderConsultation;
  tribalLiaisons?: TribalLiaison[];
  
  // Decision-making protocols
  decisionMatrix: DecisionMatrix;
  votingProcedures: VotingProcedure[];
  consensusRequirements: ConsensusRequirement[];
  conflictResolution: ConflictResolutionProcedure[];
}

export interface ComplianceRequirement {
  id: string;
  type: 'legal' | 'regulatory' | 'cultural' | 'islamic' | 'security' | 'financial';
  title: string;
  titleArabic: string;
  description: string;
  descriptionArabic: string;
  
  // Requirements details
  mandatory: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string; // law, regulation, standard
  sourceArabic: string;
  
  // Validation and monitoring
  validationMethod: string;
  validationFrequency: 'once' | 'periodic' | 'continuous';
  evidenceRequired: EvidenceRequirement[];
  monitoringProcedure: string;
  
  // Status and compliance
  status: 'pending' | 'in-progress' | 'compliant' | 'non-compliant' | 'waived';
  complianceScore: number; // 0-1
  lastAssessment: Date;
  nextAssessment: Date;
  
  // Remediation and actions
  nonComplianceRisks: ComplianceRisk[];
  remediationActions: RemediationAction[];
  responsibleParty: string; // participant ID
  escalationPath: string[];
}

// ============================================================================
// DOCUMENTATION AND VERSION CONTROL
// ============================================================================

export interface ProjectDocument {
  id: string;
  title: string;
  titleArabic: string;
  type: DocumentType;
  category: DocumentCategory;
  version: string;
  
  // Content and language
  content: string;
  contentArabic: string;
  language: 'arabic' | 'english' | 'both';
  rtlFormatted: boolean;
  
  // Status and lifecycle
  status: DocumentStatus;
  confidentialityLevel: SecurityClassification;
  approvalRequired: boolean;
  approvedBy?: string; // participant ID
  approvedAt?: Date;
  
  // Cultural and Islamic validation
  culturallyValidated: boolean;
  islamicCompliant: boolean;
  culturalReviewer?: string;
  islamicReviewer?: string;
  
  // Authoring and ownership
  author: string; // participant ID
  contributors: string[]; // participant IDs
  reviewer?: string; // participant ID
  approver?: string; // participant ID
  
  // Version control
  parentVersion?: string;
  childVersions: string[];
  changeHistory: DocumentChange[];
  mergeBranches: DocumentBranch[];
  
  // Access and distribution
  accessControl: DocumentAccessControl;
  distributionList: string[]; // participant IDs
  publiclyAvailable: boolean;
  citizenAccessible: boolean;
  
  // Relationships and references
  relatedDocuments: string[]; // document IDs
  dependencies: string[]; // document IDs
  templates: string[]; // template IDs
  translations: DocumentTranslation[];
  
  // Metadata
  tags: string[];
  tagsArabic: string[];
  keywords: string[];
  keywordsArabic: string[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastReviewedAt?: Date;
  expiresAt?: Date;
}

export interface VersionHistoryEntry {
  id: string;
  version: string;
  type: 'major' | 'minor' | 'patch' | 'hotfix';
  
  // Change information
  changeType: 'create' | 'update' | 'merge' | 'branch' | 'tag';
  changeSummary: string;
  changeSummaryArabic: string;
  changesDetails: ChangeDetail[];
  
  // Author and timing
  author: string; // participant ID
  authorName: string;
  authorNameArabic: string;
  committedAt: Date;
  
  // Review and approval
  reviewedBy?: string; // participant ID
  reviewedAt?: Date;
  approvedBy?: string; // participant ID
  approvedAt?: Date;
  
  // Cultural and compliance
  culturalImpact: boolean;
  islamicImpact: boolean;
  complianceImpact: boolean;
  securityImpact: boolean;
  
  // Technical metadata
  diffStats: DiffStatistics;
  fileChanges: FileChange[];
  conflictResolutions: ConflictResolution[];
  
  // Rollback and recovery
  rollbackSupported: boolean;
  backupCreated: boolean;
  recoveryPoint: boolean;
  
  // Tags and labels
  tags: string[];
  labels: string[];
  milestone?: string;
  release?: string;
}

export interface ArabicContentManagement {
  // RTL and bidirectional text
  rtlSupport: boolean;
  bidiTextHandling: boolean;
  mixedContentSupport: boolean;
  
  // Arabic typography and rendering
  arabicFonts: ArabicFont[];
  textDirection: 'rtl' | 'ltr' | 'auto';
  lineBreaking: 'word' | 'anywhere' | 'keep-all';
  textAlignment: 'start' | 'end' | 'center' | 'justify';
  
  // Translation and localization
  autoTranslation: boolean;
  translationQuality: number; // 0-1
  translationProvider: string;
  humanReviewRequired: boolean;
  
  // Cultural adaptation
  culturalAdaptation: boolean;
  idiomaticExpressions: boolean;
  formalityLevel: 'casual' | 'formal' | 'official' | 'ceremonial';
  regionalDialect?: string;
  
  // Islamic and religious content
  islamicTerminology: boolean;
  religiousReferences: boolean;
  quranicQuotations: QuranQuotation[];
  hadithReferences: HadithReference[];
  
  // Content validation
  linguisticValidation: boolean;
  culturalValidation: boolean;
  islamicValidation: boolean;
  technicalValidation: boolean;
  
  // Performance optimization
  cacheArabicContent: boolean;
  compressArabicText: boolean;
  optimizeRendering: boolean;
  fontPreloading: boolean;
}

// ============================================================================
// CULTURAL AND ISLAMIC COMPLIANCE
// ============================================================================

export interface CulturalValidationResult {
  valid: boolean;
  score: number; // 0-1
  
  // Core validation areas
  languageAppropriate: boolean;
  culturalSensitivity: boolean;
  religiousRespect: boolean;
  socialNorms: boolean;
  
  // Government and official
  officialProtocol: boolean;
  diplomaticLanguage: boolean;
  citizenAppropriate: boolean;
  professionalStandards: boolean;
  
  // Regional and local
  iraqiContext: boolean;
  regionalSensitivity: boolean;
  tribalConsiderations: boolean;
  localCustoms: boolean;
  
  // Issues and recommendations
  issues: CulturalIssue[];
  warnings: CulturalWarning[];
  recommendations: CulturalRecommendation[];
  autoFixes: CulturalAutoFix[];
  manualReview: CulturalManualReview[];
  
  // Validation metadata
  validator: string; // participant ID
  validatedAt: Date;
  validationMethod: string;
  confidence: number; // 0-1
  
  // Cultural context
  culturalContext: CulturalContext[];
  historicalContext: HistoricalContext[];
  socialContext: SocialContext[];
  politicalSensitivity: PoliticalSensitivity;
}

export interface IslamicComplianceResult {
  compliant: boolean;
  score: number; // 0-1
  
  // Core compliance areas
  contentHalal: boolean;
  respectfulLanguage: boolean;
  appropriateTiming: boolean;
  familyFriendly: boolean;
  
  // Religious observance
  prayerTimeRespect: boolean;
  ramadanSensitive: boolean;
  islamicHolidayAware: boolean;
  religiousTerminology: boolean;
  
  // Islamic principles
  shariaCompliant: boolean;
  islamicEthics: boolean;
  socialJustice: boolean;
  communityWelfare: boolean;
  
  // Issues and guidance
  violations: IslamicViolation[];
  concerns: IslamicConcern[];
  blessings: IslamicBlessing[];
  scholarlyGuidance: ScholarlyGuidance[];
  communityBenefit: CommunityBenefit[];
  
  // Validation metadata
  validator: string; // Islamic scholar ID
  validatedAt: Date;
  validationMethod: string;
  scholarship: 'hanafi' | 'hanbali' | 'maliki' | 'shafi' | 'jafari';
  
  // Religious context
  islamicContext: IslamicContext[];
  religiousSignificance: ReligiousSignificance[];
  spiritualImpact: SpiritualImpact[];
  communityReaction: CommunityReaction;
}

export interface ShuraConsultationResult {
  conducted: boolean;
  participants: ShuraParticipant[];
  
  // Consultation process
  consultationDate: Date;
  duration: number; // minutes
  location: string;
  locationArabic: string;
  methodology: 'consensus' | 'majority' | 'weighted' | 'advisory';
  
  // Decision process
  consensusReached: boolean;
  majorityDecision: boolean;
  unanimousDecision: boolean;
  dissenting: ShuraParticipant[];
  
  // Outcomes and decisions
  decision: 'approve' | 'reject' | 'modify' | 'defer' | 'escalate';
  decisionReasoning: string;
  decisionReasoningArabic: string;
  modifications: ShuraModification[];
  conditions: ShuraCondition[];
  
  // Islamic principles and guidance
  islamicPrinciples: IslamicPrinciple[];
  scholarlyReferences: ScholarlyReference[];
  quranicGuidance: QuranicGuidance[];
  hadithGuidance: HadithGuidance[];
  
  // Community and welfare
  communityWelfare: CommunityWelfareAssessment;
  publicInterest: PublicInterestAssessment;
  islamicBenefits: IslamicBenefit[];
  
  // Implementation and monitoring
  followUpRequired: boolean;
  implementationGuidance: string;
  implementationGuidanceArabic: string;
  monitoringRequired: boolean;
  reviewSchedule: ReviewSchedule[];
  
  // Documentation and record
  minutes: string;
  minutesArabic: string;
  officialRecord: boolean;
  publicDisclosure: boolean;
  archivalRequired: boolean;
}

// ============================================================================
// SECURITY AND ACCESS CONTROL
// ============================================================================

export interface ProjectSecurity {
  classification: SecurityClassification;
  accessRestriction: boolean;
  encryptionRequired: boolean;
  dataProtection: boolean;
  
  // Government security
  nationalSecurityRelevance: boolean;
  defenseSensitive: boolean;
  economicSecurity: boolean;
  publicSafety: boolean;
  
  // Access control
  authenticationRequired: boolean;
  authorizationLevels: AuthorizationLevel[];
  multiFactorAuth: boolean;
  securityClearanceRequired: SecurityClassification;
  
  // Data protection
  personalDataProtection: boolean;
  citizenDataProtection: boolean;
  governmentDataProtection: boolean;
  internationalDataTransfer: boolean;
  
  // Monitoring and audit
  accessLogging: boolean;
  activityMonitoring: boolean;
  securityAuditing: boolean;
  incidentReporting: boolean;
  
  // Threats and risks
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  securityThreats: SecurityThreat[];
  mitigationMeasures: SecurityMitigation[];
  contingencyPlans: SecurityContingency[];
  
  // Compliance and standards
  governmentStandards: GovernmentSecurityStandard[];
  internationalStandards: InternationalSecurityStandard[];
  industryStandards: IndustrySecurityStandard[];
  complianceStatus: SecurityComplianceStatus;
}

export interface AccessControlMatrix {
  roles: AccessRole[];
  permissions: AccessPermission[];
  restrictions: AccessRestriction[];
  
  // Hierarchical access
  ministryAccess: MinistryAccessLevel[];
  departmentAccess: DepartmentAccessLevel[];
  projectAccess: ProjectAccessLevel[];
  documentAccess: DocumentAccessLevel[];
  
  // Temporal access
  timeBasedAccess: TimeBasedAccess[];
  sessionLimits: SessionLimit[];
  accessWindows: AccessWindow[];
  
  // Location and device
  locationBasedAccess: LocationBasedAccess[];
  deviceRestrictions: DeviceRestriction[];
  networkRestrictions: NetworkRestriction[];
  
  // Cultural and religious
  culturalAccessConsiderations: CulturalAccessConsideration[];
  islamicAccessRestrictions: IslamicAccessRestriction[];
  prayerTimeExceptions: PrayerTimeException[];
  
  // Monitoring and compliance
  accessMonitoring: AccessMonitoring;
  complianceTracking: AccessComplianceTracking;
  violationHandling: AccessViolationHandling;
  auditTrail: AccessAuditEntry[];
}

export interface AuditTrailEntry {
  id: string;
  timestamp: Date;
  projectId: string;
  
  // Action details
  action: AuditAction;
  actionDescription: string;
  actionDescriptionArabic: string;
  actionType: 'create' | 'read' | 'update' | 'delete' | 'approve' | 'reject' | 'escalate';
  
  // Actor information
  actorId: string;
  actorName: string;
  actorNameArabic: string;
  actorRole: string;
  actorMinistry: MinistryType;
  
  // Target information
  targetEntity: string;
  targetEntityType: 'project' | 'document' | 'milestone' | 'resource' | 'budget';
  targetEntityId: string;
  
  // Context and metadata
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  location?: string;
  deviceInfo?: string;
  
  // Cultural and compliance
  culturallyAppropriate: boolean;
  islamicCompliant: boolean;
  governmentProtocolFollowed: boolean;
  securityCompliant: boolean;
  
  // Impact and significance
  impactLevel: 'low' | 'medium' | 'high' | 'critical';
  businessImpact?: string;
  securityImpact?: string;
  complianceImpact?: string;
  
  // Evidence and documentation
  evidenceFiles: string[];
  supportingDocuments: string[];
  screenshots?: string[];
  digitalSignature?: string;
  
  // Verification and validation
  verified: boolean;
  verifiedBy?: string;
  verificationMethod?: string;
  hashValue?: string;
  tamperProof: boolean;
}

// ============================================================================
// PERFORMANCE AND METRICS
// ============================================================================

export interface ProjectPerformanceMetrics {
  // Overall performance
  overallHealth: number; // 0-1
  performanceIndex: number; // 0-1
  efficiencyRating: number; // 0-1
  
  // Schedule performance
  schedulePerformanceIndex: number; // earned value
  scheduleVariance: number; // days
  onTimeDeliveryRate: number; // 0-1
  milestoneCompletionRate: number; // 0-1
  
  // Budget performance
  costPerformanceIndex: number; // earned value
  budgetUtilization: number; // 0-1
  costVariance: number; // IQD
  budgetEfficiency: number; // 0-1
  
  // Quality performance
  qualityIndex: number; // 0-1
  defectRate: number; // defects per deliverable
  reworkRate: number; // 0-1
  satisfactionScore: number; // 0-1
  
  // Team performance
  teamProductivity: number; // output per person-day
  teamMotivation: number; // 0-1
  teamCollaboration: number; // 0-1
  skillUtilization: number; // 0-1
  
  // Cultural performance
  culturalComplianceRate: number; // 0-1
  islamicComplianceRate: number; // 0-1
  culturalSensitivityScore: number; // 0-1
  communityAcceptance: number; // 0-1
  
  // Government performance
  governmentProtocolCompliance: number; // 0-1
  approvalEfficiency: number; // 0-1
  transparencyScore: number; // 0-1
  citizenSatisfaction: number; // 0-1
  
  // Risk and issues
  riskMitigationEffectiveness: number; // 0-1
  issueResolutionTime: number; // average hours
  escalationRate: number; // escalations per month
  
  // Communication and collaboration
  communicationEffectiveness: number; // 0-1
  stakeholderEngagement: number; // 0-1
  knowledgeSharingRate: number; // 0-1
  
  // Innovation and improvement
  innovationIndex: number; // 0-1
  processImprovementRate: number; // improvements per month
  lessonLearningRate: number; // 0-1
  
  // Historical trends
  performanceTrends: PerformanceTrend[];
  benchmarkComparisons: BenchmarkComparison[];
  forecastProjections: ForecastProjection[];
}

export interface RiskAssessment {
  overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number; // 0-1
  
  // Risk categories
  scheduleRisks: ProjectRisk[];
  budgetRisks: ProjectRisk[];
  qualityRisks: ProjectRisk[];
  resourceRisks: ProjectRisk[];
  technicalRisks: ProjectRisk[];
  
  // External risks
  politicalRisks: ProjectRisk[];
  economicRisks: ProjectRisk[];
  socialRisks: ProjectRisk[];
  environmentalRisks: ProjectRisk[];
  legalRisks: ProjectRisk[];
  
  // Cultural and religious risks
  culturalRisks: ProjectRisk[];
  islamicRisks: ProjectRisk[];
  communityRisks: ProjectRisk[];
  interfaithRisks: ProjectRisk[];
  
  // Government and regulatory risks
  regulatoryRisks: ProjectRisk[];
  complianceRisks: ProjectRisk[];
  approvalRisks: ProjectRisk[];
  auditRisks: ProjectRisk[];
  
  // Security risks
  securityRisks: ProjectRisk[];
  dataRisks: ProjectRisk[];
  accessRisks: ProjectRisk[];
  cyberRisks: ProjectRisk[];
  
  // Mitigation and response
  mitigationStrategies: RiskMitigation[];
  contingencyPlans: ContingencyPlan[];
  riskMonitoring: RiskMonitoring[];
  escalationProcedures: RiskEscalation[];
  
  // Risk management
  riskOwners: RiskOwner[];
  riskReviewSchedule: RiskReview[];
  riskReporting: RiskReporting[];
  riskGovernance: RiskGovernance;
}

export interface QualityMetrics {
  overallQuality: number; // 0-1
  qualityGates: QualityGate[];
  
  // Deliverable quality
  deliverableQuality: number; // 0-1
  defectDensity: number; // defects per deliverable
  errorRate: number; // 0-1
  reworkPercentage: number; // 0-1
  
  // Process quality
  processMaturity: number; // 0-1
  processCompliance: number; // 0-1
  standardsAdherence: number; // 0-1
  bestPracticesFollowing: number; // 0-1
  
  // Cultural quality
  culturalAccuracy: number; // 0-1
  islamicCompliance: number; // 0-1
  languageQuality: number; // 0-1
  localizedContent: number; // 0-1
  
  // Government quality
  governmentStandards: number; // 0-1
  regulatoryCompliance: number; // 0-1
  officialProtocol: number; // 0-1
  transparencyLevel: number; // 0-1
  
  // User satisfaction
  userSatisfaction: number; // 0-1
  stakeholderSatisfaction: number; // 0-1
  citizenSatisfaction: number; // 0-1
  teamSatisfaction: number; // 0-1
  
  // Quality improvement
  qualityTrends: QualityTrend[];
  improvementActions: QualityImprovement[];
  lessonsLearned: QualityLesson[];
  qualityMetricsHistory: QualityMetricsHistory[];
}

// ============================================================================
// SUPPORTING INTERFACES (Continued in separate files for maintainability)
// ============================================================================

// Additional interfaces would be defined in separate files:
// - time-management.ts (TimeBuffer, RamadanAdjustment, etc.)
// - resource-management.ts (ResourceSupplier, ResourceSpecification, etc.)
// - governance.ts (CommitteeStructure, BoardStructure, etc.)
// - cultural.ts (CulturalContext, IslamicContext, etc.)
// - security.ts (SecurityThreat, SecurityMitigation, etc.)
// - performance.ts (PerformanceTrend, BenchmarkComparison, etc.)

// Export all main types
export * from './time-management';
export * from './resource-management';
export * from './governance';
export * from './cultural';
export * from './security';
export * from './performance';
export * from './workflow';
export * from './version-control';
export * from './ministry';
export * from './coordination';