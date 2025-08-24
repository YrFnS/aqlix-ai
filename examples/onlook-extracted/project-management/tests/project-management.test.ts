/**
 * Iraqi Advanced Project Management - Comprehensive Test Suite
 * Tests for multi-ministry coordination with cultural intelligence
 * 
 * This test suite validates:
 * - Project creation with cultural validation (95%+ compliance required)
 * - Islamic compliance validation (90%+ compliance required) 
 * - Arabic RTL text processing (99%+ accuracy required)
 * - Multi-ministry coordination workflows
 * - Prayer time-aware scheduling
 * - Government audit trail compliance
 * - Performance benchmarks (<200ms response times)
 * - Security and access control
 */

import { describe, test, expect, beforeAll, afterAll, beforeEach } from 'bun:test';
import {
  IraqiProjectManagementEngine,
  MinistryCoordinationManager,
  ArabicVersionControlEngine,
  ProjectCreateRequest,
  MinistryType,
  ProjectType,
  ProjectPriority,
  SecurityClassification
} from '../src';

// ============================================================================
// TEST SETUP AND CONFIGURATION
// ============================================================================

describe('Iraqi Advanced Project Management System', () => {
  let projectEngine: IraqiProjectManagementEngine;
  let coordinationManager: MinistryCoordinationManager;
  let versionControl: ArabicVersionControlEngine;
  let testProject: any;

  beforeAll(async () => {
    // Initialize test engines with comprehensive configuration
    projectEngine = new IraqiProjectManagementEngine({
      multiMinistrySupport: true,
      islamicComplianceEnabled: true,
      culturalValidationEnabled: true,
      arabicContentSupport: true,
      rtlVisualizationEnabled: true,
      
      // Performance settings for testing
      maxConcurrentProjects: 50,
      cacheTimeout: 60000, // 1 minute for tests
      syncInterval: 1000, // 1 second for tests
      performanceMonitoringEnabled: true,
      distributedTeamOptimization: true,
      
      // Cultural settings
      prayerTimeAwareness: true,
      ramadanSchedulingEnabled: true,
      islamicHolidaySupport: true,
      culturalEventTracking: true,
      shuraConsultationEnabled: true,
      
      // Government settings
      governmentProtocolEnforcement: true,
      auditTrailMandatory: true,
      transparencyReportingEnabled: false,
      parliamentaryOversight: false,
      citizenEngagementEnabled: false,
      
      // Security settings
      securityClassificationEnabled: true,
      encryptionRequired: false,
      accessControlEnforced: true,
      securityAuditingEnabled: true,
      dataProtectionCompliance: true,
      
      // Integration settings
      externalSystemIntegration: false, // Disabled for testing
      realTimeCollaboration: false, // Disabled for testing
      workflowAutomation: true,
      notificationSystem: false, // Disabled for testing
      reportingDashboard: true
    });

    coordinationManager = new MinistryCoordinationManager({
      enableInterMinistryWorkflows: true,
      hierarchicalApprovalRequired: true,
      ministerialOversightEnabled: true,
      parliamentaryReportingEnabled: false,
      
      shuraConsultationMandatory: true,
      culturalValidationRequired: true,
      islamicComplianceEnforced: true,
      tribalLiaisonRequired: false,
      
      coordinationTimeoutHours: 24, // Shorter for tests
      maxConcurrentCoordinations: 10,
      realTimeUpdatesEnabled: false,
      performanceMonitoringEnabled: true,
      
      securityClearanceVerification: true,
      crossMinistryAccessControl: true,
      auditTrailMandatory: true,
      classifiedDocumentHandling: false,
      
      bilingualCommunication: true,
      arabicPrimaryLanguage: true,
      formalProtocolRequired: true,
      diplomaticLanguageRequired: false
    });

    versionControl = new ArabicVersionControlEngine({
      rtlDiffVisualization: true,
      bidirectionalTextSupport: true,
      arabicFontOptimization: true,
      mixedContentHandling: true,
      unicodeNormalization: true,
      
      culturalContextTracking: true,
      islamicContentValidation: true,
      culturalAnnotationSupport: true,
      hijriCalendarIntegration: true,
      islamicTerminologyDatabase: true,
      
      diffCachingEnabled: true,
      arabicTextIndexing: true,
      semanticSearchEnabled: true,
      performanceOptimization: true,
      maxDiffSize: 50000, // 50K characters for tests
      
      auditTrailMandatory: true,
      classifiedContentHandling: false,
      governmentProtocolEnforcement: true,
      documentIntegrityVerification: true,
      digitalSignatureSupport: false,
      
      collaborativeMerging: true,
      conflictResolutionGuidance: true,
      culturalMergeValidation: true,
      multiUserRealTimeEditing: false,
      branchingWithCulturalContext: true
    });

    console.log('🧪 Test engines initialized successfully');
  });

  afterAll(async () => {
    // Cleanup test resources
    if (projectEngine) {
      await projectEngine.shutdown();
    }
    if (coordinationManager) {
      await coordinationManager.shutdown();
    }
    if (versionControl) {
      await versionControl.shutdown();
    }
    console.log('🧹 Test cleanup completed');
  });

  // ============================================================================
  // PROJECT CREATION TESTS
  // ============================================================================

  describe('Project Creation with Cultural Validation', () => {
    test('should create project with comprehensive cultural validation', async () => {
      const startTime = performance.now();
      
      const projectRequest: ProjectCreateRequest = {
        title: "Test Digital Healthcare Project",
        titleArabic: "مشروع الرعاية الصحية الرقمية التجريبي",
        description: "Test project for digital healthcare transformation with Islamic compliance and cultural validation.",
        descriptionArabic: "مشروع تجريبي للتحول الرقمي في الرعاية الصحية مع الامتثال الإسلامي والتحقق الثقافي.",
        type: 'digital-transformation' as ProjectType,
        priority: 'important' as ProjectPriority,
        
        primaryMinistry: 'health' as MinistryType,
        secondaryMinistries: ['communications', 'finance'] as MinistryType[],
        projectManagerId: 'test-pm-001',
        sponsorId: 'test-sponsor-001',
        
        startDate: new Date('2025-02-01'),
        endDate: new Date('2025-11-30'),
        estimatedBudget: 25_000_000, // 25 million IQD
        
        config: {
          multiMinistry: true,
          islamicCompliance: true,
          culturalValidation: true,
          auditTrail: true,
          governmentProtocol: true,
          citizenFacing: true,
          
          prayerTimeAware: true,
          ramadanScheduleAware: true,
          islamicHolidayAware: true,
          culturalEventAware: true,
          workdayFlexibility: true,
          
          approvalHierarchy: ['department', 'directorate', 'ministry'],
          shuraConsultation: true,
          ministerialApproval: true,
          parliamentaryOversight: false,
          publicConsultation: false,
          
          arabicVersionControl: true,
          rtlDiffVisualization: true,
          bilingualDocumentation: true,
          autoTranslation: false,
          culturalReview: true,
          
          securityClassification: 'internal' as SecurityClassification,
          accessControl: true,
          encryptionRequired: false,
          auditLogging: true,
          governmentCompliance: true,
          
          distributedTeams: true,
          realTimeSync: false,
          offlineSupport: false,
          performanceMonitoring: true,
          resourceOptimization: true
        },
        
        culturalValidationRequired: true,
        islamicComplianceRequired: true,
        shuraConsultationRequired: true,
        
        securityClassification: 'internal',
        restrictedAccess: false
      };

      const project = await projectEngine.createProject(projectRequest);
      const processingTime = performance.now() - startTime;

      // Performance requirement: <150ms for project creation
      expect(processingTime).toBeLessThan(150);

      // Basic project validation
      expect(project).toBeDefined();
      expect(project.id).toBeTruthy();
      expect(project.title).toBe(projectRequest.title);
      expect(project.titleArabic).toBe(projectRequest.titleArabic);
      expect(project.primaryMinistry).toBe('health');
      expect(project.secondaryMinistries).toContain('communications');
      expect(project.secondaryMinistries).toContain('finance');
      expect(project.status).toBe('planning');

      // Cultural validation requirements: 95%+ compliance
      expect(project.culturalValidation).toBeDefined();
      expect(project.culturalValidation.valid).toBe(true);
      expect(project.culturalValidation.score).toBeGreaterThanOrEqual(0.95);
      expect(project.culturalValidation.languageAppropriate).toBe(true);
      expect(project.culturalValidation.culturalSensitivity).toBe(true);
      expect(project.culturalValidation.religiousRespect).toBe(true);
      expect(project.culturalValidation.socialNorms).toBe(true);

      // Islamic compliance requirements: 90%+ compliance
      expect(project.islamicCompliance).toBeDefined();
      expect(project.islamicCompliance.compliant).toBe(true);
      expect(project.islamicCompliance.score).toBeGreaterThanOrEqual(0.90);
      expect(project.islamicCompliance.contentHalal).toBe(true);
      expect(project.islamicCompliance.respectfulLanguage).toBe(true);
      expect(project.islamicCompliance.prayerTimeRespect).toBe(true);
      expect(project.islamicCompliance.ramadanSensitive).toBe(true);

      // Performance metrics validation
      expect(project.performanceMetrics).toBeDefined();
      expect(project.performanceMetrics.overallHealth).toBeGreaterThan(0);

      // Audit trail validation
      expect(project.auditTrail).toBeDefined();
      expect(project.auditTrail.length).toBeGreaterThan(0);
      expect(project.auditTrail[0].action).toBe('workflow-created');
      expect(project.auditTrail[0].culturallyAppropriate).toBe(true);
      expect(project.auditTrail[0].islamicCompliant).toBe(true);

      testProject = project;
      console.log(`✅ Project created in ${processingTime.toFixed(2)}ms with ${project.culturalValidation.score * 100}% cultural compliance`);
    }, 10000);

    test('should reject project with cultural validation failures', async () => {
      const culturallyInappropriateRequest: ProjectCreateRequest = {
        title: "Inappropriate Test Project",
        titleArabic: "مشروع غير مناسب ثقافياً", 
        description: "Content that might violate cultural norms and Islamic principles...",
        descriptionArabic: "محتوى قد ينتهك الأعراف الثقافية والمبادئ الإسلامية...",
        type: 'policy-development' as ProjectType,
        priority: 'routine' as ProjectPriority,
        
        primaryMinistry: 'culture' as MinistryType,
        secondaryMinistries: [],
        projectManagerId: 'test-pm-002',
        sponsorId: 'test-sponsor-002',
        
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-06-30'),
        estimatedBudget: 1_000_000,
        
        config: {
          multiMinistry: false,
          islamicCompliance: true,
          culturalValidation: true,
          auditTrail: true,
          governmentProtocol: true,
          citizenFacing: false,
          
          prayerTimeAware: false, // This should trigger Islamic compliance issue
          ramadanScheduleAware: false, // This should trigger Islamic compliance issue
          islamicHolidayAware: false, // This should trigger Islamic compliance issue
          culturalEventAware: false,
          workdayFlexibility: false,
          
          approvalHierarchy: ['department'],
          shuraConsultation: false, // Should be true for policy development
          ministerialApproval: false,
          parliamentaryOversight: false,
          publicConsultation: false,
          
          arabicVersionControl: false,
          rtlDiffVisualization: false,
          bilingualDocumentation: false,
          autoTranslation: false,
          culturalReview: false,
          
          securityClassification: 'public' as SecurityClassification,
          accessControl: false,
          encryptionRequired: false,
          auditLogging: false,
          governmentCompliance: false, // Should trigger compliance issue
          
          distributedTeams: false,
          realTimeSync: false,
          offlineSupport: false,
          performanceMonitoring: false,
          resourceOptimization: false
        },
        
        culturalValidationRequired: true,
        islamicComplianceRequired: true,
        shuraConsultationRequired: false, // Should be true
        
        securityClassification: 'public',
        restrictedAccess: false
      };

      await expect(projectEngine.createProject(culturallyInappropriateRequest))
        .rejects.toThrow(/Cultural validation failed|Islamic compliance check failed/);
    });
  });

  // ============================================================================
  // MINISTRY COORDINATION TESTS
  // ============================================================================

  describe('Multi-Ministry Coordination', () => {
    test('should initiate inter-ministry coordination successfully', async () => {
      if (!testProject) {
        throw new Error('Test project not available');
      }

      const startTime = performance.now();
      
      const coordination = await coordinationManager.initiateInterMinistryCoordination(
        testProject,
        {
          coordinationType: 'project-approval',
          participatingMinistries: ['health', 'communications', 'finance'],
          coordinatorId: testProject.projectManager.id,
          urgencyLevel: 'important',
          culturalSensitivityRequired: true,
          islamicConsultationRequired: true,
          securityClearanceLevel: 'internal' as SecurityClassification,
          expectedDuration: 14, // 2 weeks
          budgetImplications: true,
          publicVisibility: false,
          parliamentaryOversight: false,
          description: 'Test coordination for digital healthcare project approval',
          descriptionArabic: 'تنسيق تجريبي لموافقة مشروع الرعاية الصحية الرقمية',
          objectives: [
            'Obtain ministry approvals',
            'Coordinate budget allocations',
            'Establish technical requirements'
          ],
          objectivesArabic: [
            'الحصول على موافقات الوزارات',
            'تنسيق تخصيص الميزانية',
            'تحديد المتطلبات التقنية'
          ],
          successCriteria: [
            'All three ministries approve',
            'Budget confirmed',
            'Timeline agreed'
          ],
          successCriteriaArabic: [
            'جميع الوزارات الثلاث توافق',
            'الميزانية مؤكدة',
            'الجدول الزمني متفق عليه'
          ]
        }
      );

      const processingTime = performance.now() - startTime;

      // Performance requirement: <200ms for ministry coordination
      expect(processingTime).toBeLessThan(200);

      // Coordination validation
      expect(coordination).toBeDefined();
      expect(coordination.id).toBeTruthy();
      expect(coordination.primaryMinistry).toBe('health');
      expect(coordination.participatingMinistries).toHaveLength(3);
      expect(coordination.participatingMinistries).toContain('health');
      expect(coordination.participatingMinistries).toContain('communications');
      expect(coordination.participatingMinistries).toContain('finance');
      expect(coordination.status).toBe('initiated');

      // Cultural and Islamic validation
      expect(coordination.culturalSensitivities).toBeDefined();
      expect(coordination.islamicConsiderations).toBeDefined();
      expect(coordination.governmentProtocolAdherence).toBe(true);

      // Approval chain validation
      expect(coordination.approvalChain).toBeDefined();
      expect(coordination.approvalChain.stages).toBeDefined();
      expect(coordination.approvalChain.stages.length).toBeGreaterThan(0);

      // Performance metrics
      expect(coordination.performanceMetrics).toBeDefined();
      expect(coordination.efficiencyScore).toBeGreaterThanOrEqual(0);

      console.log(`✅ Inter-ministry coordination initiated in ${processingTime.toFixed(2)}ms`);
    }, 10000);

    test('should process ministry approval successfully', async () => {
      const activeCoordinations = await coordinationManager.getActiveCoordinations('health');
      expect(activeCoordinations.length).toBeGreaterThan(0);

      const coordination = activeCoordinations[0];
      const startTime = performance.now();

      const approvalResult = await coordinationManager.processMinistryApproval(
        coordination.id,
        'health',
        {
          action: 'approve',
          approverId: 'minister-health-001',
          approverName: 'Dr. Salim Al-Jubouri',
          approverNameArabic: 'د. سليم الجبوري',
          decision: 'approve',
          comments: 'Project aligns with ministry healthcare digitization strategy',
          commentsArabic: 'المشروع يتماشى مع استراتيجية رقمنة الرعاية الصحية للوزارة',
          conditions: [],
          conditionsArabic: [],
          culturalValidation: true,
          islamicCompliance: true,
          budgetApproval: true,
          timelineApproval: true,
          resourceCommitment: true
        }
      );

      const processingTime = performance.now() - startTime;

      // Performance requirement: <100ms for approval processing
      expect(processingTime).toBeLessThan(100);

      // Approval result validation
      expect(approvalResult).toBeDefined();
      expect(approvalResult.success).toBe(true);
      expect(approvalResult.approvalLevel).toBe('ministry');
      expect(approvalResult.culturallyValid).toBe(true);
      expect(approvalResult.islamicallyCompliant).toBe(true);

      console.log(`✅ Ministry approval processed in ${processingTime.toFixed(2)}ms`);
    }, 5000);
  });

  // ============================================================================
  // ARABIC VERSION CONTROL TESTS
  // ============================================================================

  describe('Arabic Version Control with RTL Support', () => {
    let testDocument: any;

    test('should create Arabic document with bidirectional text support', async () => {
      const startTime = performance.now();

      const document = await versionControl.createDocument({
        title: "Test Project Charter",
        titleArabic: "ميثاق المشروع التجريبي",
        content: `
# Test Project Charter

This is a test document with mixed content: 
- Budget: 25,000,000 دينار عراقي
- Duration: 10 months
- Team size: 15 employees موظف

## Objectives
1. Implement digital systems تطبيق الأنظمة الرقمية
2. Train healthcare staff تدريب موظفي الرعاية الصحية
3. Ensure Islamic compliance ضمان الامتثال الإسلامي
        `,
        contentArabic: `
# ميثاق المشروع التجريبي

هذه وثيقة تجريبية بمحتوى مختلط:
- الميزانية: 25,000,000 دينار عراقي IQD
- المدة: 10 أشهر months
- حجم الفريق: 15 موظف employees

## الأهداف
1. تطبيق الأنظمة الرقمية Implement digital systems
2. تدريب موظفي الرعاية الصحية Train healthcare staff  
3. ضمان الامتثال الإسلامي Ensure Islamic compliance
        `,
        primaryLanguage: 'mixed',
        contentType: 'project-charter',
        culturalValidationRequired: true,
        islamicComplianceRequired: true,
        securityClassification: 'internal' as SecurityClassification,
        authorId: 'test-author-001'
      });

      const processingTime = performance.now() - startTime;

      // Performance requirement: <100ms for document creation
      expect(processingTime).toBeLessThan(100);

      // Document validation
      expect(document).toBeDefined();
      expect(document.id).toBeTruthy();
      expect(document.title).toBe("Test Project Charter");
      expect(document.titleArabic).toBe("ميثاق المشروع التجريبي");
      expect(document.primaryLanguage).toBe('mixed');
      expect(document.textDirection).toBe('auto');
      expect(document.bidiContent).toBe(true);
      expect(document.version).toBe('1.0.0');

      // Cultural and Islamic validation: 95%+ and 90%+ required
      expect(document.culturalValidation.valid).toBe(true);
      expect(document.culturalValidation.score).toBeGreaterThanOrEqual(0.95);
      expect(document.islamicCompliance.compliant).toBe(true);
      expect(document.islamicCompliance.score).toBeGreaterThanOrEqual(0.90);

      // RTL and bidirectional text validation
      expect(document.arabicFont).toBeDefined();
      expect(document.textRendering).toBeDefined();
      expect(document.layoutDirection).toBeDefined();

      // Indexing and search validation
      expect(document.indexingData).toBeDefined();
      expect(document.searchableContent).toBeDefined();
      expect(document.keywords).toBeDefined();
      expect(document.keywordsArabic).toBeDefined();

      testDocument = document;
      console.log(`✅ Arabic document created in ${processingTime.toFixed(2)}ms with ${document.culturalValidation.score * 100}% cultural compliance`);
    }, 5000);

    test('should generate RTL-aware diff with 99%+ accuracy', async () => {
      if (!testDocument) {
        throw new Error('Test document not available');
      }

      // Update document to create a version for diff
      const updatedDocument = await versionControl.updateDocument(
        testDocument.id,
        {
          versionType: 'minor',
          contentChanges: {
            content: testDocument.content + "\n\n## Additional Section\nNew content added for testing diff generation.",
            contentArabic: testDocument.contentArabic + "\n\n## قسم إضافي\nمحتوى جديد مضاف لاختبار توليد الفروق."
          },
          changeReason: "Added additional section for diff testing",
          changeReasonArabic: "أضيف قسم إضافي لاختبار الفروق",
          updatedBy: 'test-updater-001'
        }
      );

      const startTime = performance.now();

      const diff = await versionControl.generateArabicDiff(
        testDocument.id,
        '1.0.0',
        testDocument.id,
        '1.1.0'
      );

      const processingTime = performance.now() - startTime;

      // Performance requirement: <100ms for diff generation
      expect(processingTime).toBeLessThan(100);

      // RTL diff validation with 99%+ accuracy requirement
      expect(diff).toBeDefined();
      expect(diff.id).toBeTruthy();
      expect(diff.sourceVersion).toBe('1.0.0');
      expect(diff.targetVersion).toBe('1.1.0');
      expect(diff.rtlAwareDiff).toBe(true);

      // Diff content validation
      expect(diff.changes).toBeDefined();
      expect(diff.additions).toBeDefined();
      expect(diff.deletions).toBeDefined();
      expect(diff.modifications).toBeDefined();

      // RTL and bidirectional changes
      expect(diff.bidirectionalChanges).toBeDefined();
      expect(diff.textDirectionChanges).toBeDefined();

      // Cultural and semantic changes
      expect(diff.culturalChanges).toBeDefined();
      expect(diff.islamicContentChanges).toBeDefined();
      expect(diff.semanticChanges).toBeDefined();

      // Visual representation
      expect(diff.visualDiff).toBeDefined();
      expect(diff.rtlVisualization).toBeDefined();

      // Statistics and quality metrics
      expect(diff.diffStatistics).toBeDefined();
      expect(diff.complexityScore).toBeGreaterThanOrEqual(0);
      expect(diff.culturalImpactScore).toBeGreaterThanOrEqual(0);
      expect(diff.islamicImpactScore).toBeGreaterThanOrEqual(0);

      // Validation results - 99%+ accuracy required for Arabic RTL
      expect(diff.diffValidation).toBeDefined();
      expect(diff.diffValidation.accuracy).toBeGreaterThanOrEqual(0.99);

      console.log(`✅ RTL-aware diff generated in ${processingTime.toFixed(2)}ms with ${diff.diffValidation.accuracy * 100}% accuracy`);
    }, 5000);

    test('should handle Arabic search with semantic understanding', async () => {
      if (!testDocument) {
        throw new Error('Test document not available');
      }

      const startTime = performance.now();

      const searchResults = await versionControl.searchDocuments({
        query: 'الرعاية الصحية', // Healthcare in Arabic
        language: 'arabic',
        semanticSearch: true,
        culturalContext: true,
        islamicContext: true,
        fuzzyMatching: true,
        rtlSupport: true
      });

      const processingTime = performance.now() - startTime;

      // Performance requirement: <50ms for Arabic search
      expect(processingTime).toBeLessThan(50);

      // Search results validation
      expect(searchResults).toBeDefined();
      expect(Array.isArray(searchResults)).toBe(true);
      expect(searchResults.length).toBeGreaterThan(0);

      // First result should contain our test document
      const firstResult = searchResults[0];
      expect(firstResult.document).toBeDefined();
      expect(firstResult.document.id).toBe(testDocument.id);
      expect(firstResult.culturalContext).toBeDefined();
      expect(firstResult.islamicContext).toBeDefined();
      expect(firstResult.relevanceScore).toBeGreaterThan(0);

      console.log(`✅ Arabic search completed in ${processingTime.toFixed(2)}ms with ${searchResults.length} results`);
    }, 3000);
  });

  // ============================================================================
  // ISLAMIC COMPLIANCE TESTS
  // ============================================================================

  describe('Islamic Compliance and Shura Consultation', () => {
    test('should validate Islamic compliance with 90%+ accuracy', async () => {
      if (!testProject) {
        throw new Error('Test project not available');
      }

      const startTime = performance.now();

      const islamicCompliance = await projectEngine.validateProjectIslamically(testProject.id);

      const processingTime = performance.now() - startTime;

      // Performance requirement: <100ms for Islamic validation
      expect(processingTime).toBeLessThan(100);

      // Islamic compliance validation with 90%+ requirement
      expect(islamicCompliance).toBeDefined();
      expect(islamicCompliance.compliant).toBe(true);
      expect(islamicCompliance.score).toBeGreaterThanOrEqual(0.90);

      // Core compliance areas
      expect(islamicCompliance.contentHalal).toBe(true);
      expect(islamicCompliance.respectfulLanguage).toBe(true);
      expect(islamicCompliance.appropriateTiming).toBe(true);
      expect(islamicCompliance.familyFriendly).toBe(true);

      // Religious observance
      expect(islamicCompliance.prayerTimeRespect).toBe(true);
      expect(islamicCompliance.ramadanSensitive).toBe(true);
      expect(islamicCompliance.islamicHolidayAware).toBe(true);
      expect(islamicCompliance.religiousTerminology).toBe(true);

      // Islamic principles
      expect(islamicCompliance.shariaCompliant).toBe(true);
      expect(islamicCompliance.islamicEthics).toBe(true);
      expect(islamicCompliance.socialJustice).toBe(true);
      expect(islamicCompliance.communityWelfare).toBe(true);

      // Validation metadata
      expect(islamicCompliance.validator).toBeTruthy();
      expect(islamicCompliance.validatedAt).toBeInstanceOf(Date);
      expect(islamicCompliance.validationMethod).toBeTruthy();

      console.log(`✅ Islamic compliance validated in ${processingTime.toFixed(2)}ms with ${islamicCompliance.score * 100}% score`);
    }, 5000);

    test('should conduct Shura consultation successfully', async () => {
      if (!testProject) {
        throw new Error('Test project not available');
      }

      const startTime = performance.now();

      const shuraConsultation = await projectEngine.conductShuraConsultation(
        testProject.id,
        {
          consultationType: 'project-approval',
          participants: [
            {
              id: 'test-scholar-001',
              name: 'Dr. Ahmad Al-Baghdadi',
              nameArabic: 'د. أحمد البغدادي',
              expertise: ['islamic-ethics', 'medical-ethics', 'community-welfare'],
              institutionalAffiliation: 'Test Islamic Council',
              scholarlyRank: 'senior-scholar'
            }
          ],
          consultationTopics: [
            'Healthcare digitization from Islamic perspective',
            'Patient privacy and Islamic principles',
            'Community welfare and accessibility'
          ],
          consultationTopicsArabic: [
            'رقمنة الرعاية الصحية من المنظور الإسلامي',
            'خصوصية المرضى والمبادئ الإسلامية',
            'رفاهية المجتمع وإمكانية الوصول'
          ],
          decisionRequired: 'project-approval',
          consensusRequired: false, // Single participant for testing
          timeframe: 1, // 1 day for testing
          culturalContext: {
            projectType: 'public-health',
            citizenImpact: 'high',
            communityBenefit: 'significant',
            islamicRelevance: 'moderate'
          }
        }
      );

      const processingTime = performance.now() - startTime;

      // Performance requirement: <200ms for Shura consultation setup
      expect(processingTime).toBeLessThan(200);

      // Shura consultation validation
      expect(shuraConsultation).toBeDefined();
      expect(shuraConsultation.conducted).toBe(true);
      expect(shuraConsultation.participants).toHaveLength(1);
      expect(shuraConsultation.decision).toMatch(/approve|reject|modify|defer/);

      // Process details
      expect(shuraConsultation.consultationDate).toBeInstanceOf(Date);
      expect(shuraConsultation.duration).toBeGreaterThan(0);
      expect(shuraConsultation.decisionReasoning).toBeTruthy();
      expect(shuraConsultation.decisionReasoningArabic).toBeTruthy();

      // Islamic principles and guidance
      expect(shuraConsultation.islamicPrinciples).toBeDefined();
      expect(Array.isArray(shuraConsultation.islamicPrinciples)).toBe(true);
      expect(shuraConsultation.scholarlyReferences).toBeDefined();
      expect(shuraConsultation.communityWelfare).toBeDefined();

      // Documentation and record
      expect(shuraConsultation.minutes).toBeTruthy();
      expect(shuraConsultation.minutesArabic).toBeTruthy();
      expect(shuraConsultation.officialRecord).toBe(true);

      console.log(`✅ Shura consultation completed in ${processingTime.toFixed(2)}ms with decision: ${shuraConsultation.decision}`);
    }, 10000);
  });

  // ============================================================================
  // PERFORMANCE BENCHMARK TESTS
  // ============================================================================

  describe('Performance Benchmarks', () => {
    test('should meet response time requirements', async () => {
      const benchmarks = {
        projectCreation: 150, // ms
        documentDiff: 100,    // ms
        arabicSearch: 50,     // ms
        ministryCoordination: 200, // ms
        islamicValidation: 100     // ms
      };

      // Test project creation performance
      const projectStartTime = performance.now();
      const quickProject = await projectEngine.createProject({
        title: "Performance Test Project",
        titleArabic: "مشروع اختبار الأداء",
        description: "Quick test project for performance benchmarking",
        descriptionArabic: "مشروع سريع لاختبار معايير الأداء",
        type: 'infrastructure' as ProjectType,
        priority: 'routine' as ProjectPriority,
        primaryMinistry: 'communications' as MinistryType,
        secondaryMinistries: [],
        projectManagerId: 'perf-test-pm-001',
        sponsorId: 'perf-test-sponsor-001',
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        estimatedBudget: 5_000_000,
        config: {
          multiMinistry: false,
          islamicCompliance: true,
          culturalValidation: true,
          auditTrail: true,
          governmentProtocol: true,
          citizenFacing: false,
          prayerTimeAware: true,
          ramadanScheduleAware: true,
          islamicHolidayAware: true,
          culturalEventAware: true,
          workdayFlexibility: true,
          approvalHierarchy: ['department'],
          shuraConsultation: false,
          ministerialApproval: true,
          parliamentaryOversight: false,
          publicConsultation: false,
          arabicVersionControl: true,
          rtlDiffVisualization: true,
          bilingualDocumentation: true,
          autoTranslation: false,
          culturalReview: true,
          securityClassification: 'public' as SecurityClassification,
          accessControl: false,
          encryptionRequired: false,
          auditLogging: true,
          governmentCompliance: true,
          distributedTeams: false,
          realTimeSync: false,
          offlineSupport: false,
          performanceMonitoring: true,
          resourceOptimization: true
        },
        culturalValidationRequired: true,
        islamicComplianceRequired: true,
        shuraConsultationRequired: false,
        securityClassification: 'public',
        restrictedAccess: false
      });
      const projectCreationTime = performance.now() - projectStartTime;

      expect(projectCreationTime).toBeLessThan(benchmarks.projectCreation);
      console.log(`✅ Project creation: ${projectCreationTime.toFixed(2)}ms (target: <${benchmarks.projectCreation}ms)`);

      // Test system performance monitoring
      const performanceStartTime = performance.now();
      const systemPerformance = await projectEngine.getSystemPerformance();
      const performanceTime = performance.now() - performanceStartTime;

      expect(performanceTime).toBeLessThan(50); // System performance should be very fast
      expect(systemPerformance).toBeDefined();
      expect(systemPerformance.systemStatus).toBeTruthy();
      
      console.log(`✅ System performance check: ${performanceTime.toFixed(2)}ms`);
    }, 15000);

    test('should handle concurrent operations efficiently', async () => {
      const concurrentOperations = 10;
      const startTime = performance.now();

      // Create multiple projects concurrently
      const projectPromises = Array.from({ length: concurrentOperations }, (_, i) =>
        projectEngine.createProject({
          title: `Concurrent Test Project ${i + 1}`,
          titleArabic: `مشروع اختبار متزامن ${i + 1}`,
          description: `Concurrent test project ${i + 1} for performance testing`,
          descriptionArabic: `مشروع اختبار متزامن ${i + 1} لاختبار الأداء`,
          type: 'procurement' as ProjectType,
          priority: 'routine' as ProjectPriority,
          primaryMinistry: 'finance' as MinistryType,
          secondaryMinistries: [],
          projectManagerId: `concurrent-pm-${i + 1}`,
          sponsorId: `concurrent-sponsor-${i + 1}`,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          estimatedBudget: 1_000_000,
          config: {
            multiMinistry: false,
            islamicCompliance: true,
            culturalValidation: true,
            auditTrail: true,
            governmentProtocol: true,
            citizenFacing: false,
            prayerTimeAware: true,
            ramadanScheduleAware: true,
            islamicHolidayAware: true,
            culturalEventAware: true,
            workdayFlexibility: true,
            approvalHierarchy: ['department'],
            shuraConsultation: false,
            ministerialApproval: false,
            parliamentaryOversight: false,
            publicConsultation: false,
            arabicVersionControl: false,
            rtlDiffVisualization: false,
            bilingualDocumentation: true,
            autoTranslation: false,
            culturalReview: false,
            securityClassification: 'public' as SecurityClassification,
            accessControl: false,
            encryptionRequired: false,
            auditLogging: true,
            governmentCompliance: true,
            distributedTeams: false,
            realTimeSync: false,
            offlineSupport: false,
            performanceMonitoring: false,
            resourceOptimization: true
          },
          culturalValidationRequired: false, // Disabled for performance
          islamicComplianceRequired: false, // Disabled for performance
          shuraConsultationRequired: false,
          securityClassification: 'public',
          restrictedAccess: false
        })
      );

      const projects = await Promise.all(projectPromises);
      const totalTime = performance.now() - startTime;
      const averageTime = totalTime / concurrentOperations;

      expect(projects).toHaveLength(concurrentOperations);
      expect(averageTime).toBeLessThan(200); // Average should still be under 200ms
      
      projects.forEach((project, i) => {
        expect(project).toBeDefined();
        expect(project.id).toBeTruthy();
        expect(project.title).toBe(`Concurrent Test Project ${i + 1}`);
      });

      console.log(`✅ Concurrent operations: ${concurrentOperations} projects created in ${totalTime.toFixed(2)}ms (avg: ${averageTime.toFixed(2)}ms per project)`);
    }, 20000);
  });

  // ============================================================================
  // SYSTEM INTEGRATION TESTS
  // ============================================================================

  describe('System Integration and Compliance', () => {
    test('should maintain cultural compliance across all operations', async () => {
      if (!testProject) {
        throw new Error('Test project not available');
      }

      // Get current cultural compliance metrics
      const systemPerformance = await projectEngine.getSystemPerformance();
      
      expect(systemPerformance).toBeDefined();
      expect(systemPerformance.culturalMetrics).toBeDefined();
      expect(systemPerformance.culturalMetrics.complianceScore).toBeGreaterThanOrEqual(0.95);
      expect(systemPerformance.culturalMetrics.islamicComplianceRate).toBeGreaterThanOrEqual(0.90);

      console.log(`✅ System-wide cultural compliance: ${systemPerformance.culturalMetrics.complianceScore * 100}%`);
      console.log(`✅ System-wide Islamic compliance: ${systemPerformance.culturalMetrics.islamicComplianceRate * 100}%`);
    });

    test('should maintain audit trail integrity', async () => {
      if (!testProject) {
        throw new Error('Test project not available');
      }

      // Validate audit trail completeness and integrity
      expect(testProject.auditTrail).toBeDefined();
      expect(Array.isArray(testProject.auditTrail)).toBe(true);
      expect(testProject.auditTrail.length).toBeGreaterThan(0);

      // Check each audit entry
      testProject.auditTrail.forEach((entry: any) => {
        expect(entry.timestamp).toBeInstanceOf(Date);
        expect(entry.workflowId).toBe(testProject.id);
        expect(entry.action).toBeTruthy();
        expect(entry.userId).toBeTruthy();
        expect(entry.culturallyAppropriate).toBe(true);
        expect(entry.islamicCompliant).toBe(true);
        expect(entry.governmentProtocolFollowed).toBe(true);
      });

      console.log(`✅ Audit trail integrity verified: ${testProject.auditTrail.length} entries`);
    });

    test('should handle system optimization gracefully', async () => {
      const optimizationResult = await projectEngine.optimizePerformance();

      expect(optimizationResult).toBeDefined();
      expect(optimizationResult.success).toBe(true);
      expect(optimizationResult.optimizationTime).toBeGreaterThan(0);
      expect(optimizationResult.improvementsApplied).toBeDefined();
      expect(Array.isArray(optimizationResult.improvementsApplied)).toBe(true);
      expect(optimizationResult.performanceGain).toBeGreaterThan(0);

      console.log(`✅ System optimization: ${optimizationResult.performanceGain * 100}% improvement in ${optimizationResult.optimizationTime}ms`);
    });
  });
});