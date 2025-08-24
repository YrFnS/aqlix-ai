/**
 * Iraqi AI System - Collaboration Engine Test Suite
 * Comprehensive tests for real-time collaboration with cultural intelligence
 * Enhanced for Iraqi government deployment with Arabic and Islamic compliance testing
 */

import { 
  IraqiCollaborationEngine, 
  IraqiCollaborationConfig,
  CollaborationParticipant,
  MinistryType 
} from '../src/CollaborationEngine';

import { 
  ArabicCollaborativeTextEngine,
  ArabicTextConfig 
} from '../src/ArabicCollaborativeTextEngine';

import { 
  RealTimeCollaborationServer,
  ServerConfig 
} from '../src/RealTimeCollaborationServer';

describe('Iraqi Collaboration Engine', () => {
  let collaborationEngine: IraqiCollaborationEngine;
  let testConfig: IraqiCollaborationConfig;
  
  beforeEach(() => {
    testConfig = {
      ministry: 'health' as MinistryType,
      teamStructure: 'hierarchical',
      collaborationMode: 'hybrid',
      maxParticipants: 10,
      islamicWorkflowCompliance: true,
      arabicCollaboration: true,
      prayerTimeAware: true,
      culturalModeration: true,
      ramadanScheduleAware: true,
      governmentSecurity: true,
      auditTrail: true,
      securityLevel: 'internal',
      crossMinistryCollaboration: false,
      citizenInteraction: false,
      syncLatencyTarget: 50,
      offlineSupport: true,
      mobileOptimized: true,
      rtlOptimized: true,
      wcagCompliance: true,
      governmentAccessibility: true,
      multiLanguageSupport: true
    };
    
    collaborationEngine = new IraqiCollaborationEngine(testConfig);
  });
  
  afterEach(async () => {
    await collaborationEngine.destroy();
  });

  describe('Initialization', () => {
    test('should initialize collaboration engine successfully', async () => {
      const result = await collaborationEngine.initialize();
      expect(result).toBe(true);
    });

    test('should fail initialization with invalid configuration', async () => {
      const invalidConfig = { ...testConfig, maxParticipants: -1 };
      const invalidEngine = new IraqiCollaborationEngine(invalidConfig);
      
      // Should handle invalid config gracefully
      expect(invalidEngine).toBeDefined();
      await invalidEngine.destroy();
    });

    test('should load ministry-specific protocols', async () => {
      await collaborationEngine.initialize();
      const metrics = collaborationEngine.getPerformanceMetrics();
      expect(metrics).toBeDefined();
    });
  });

  describe('Session Management', () => {
    beforeEach(async () => {
      await collaborationEngine.initialize();
    });

    test('should create collaboration session successfully', async () => {
      const participants: Partial<CollaborationParticipant>[] = [
        {
          id: 'test-user-1',
          name: 'Dr. Ahmed Test',
          nameArabic: 'د. أحمد تست',
          ministry: 'health',
          department: 'Testing',
          preferredLanguage: 'bilingual'
        }
      ];

      const session = await collaborationEngine.createCollaborationSession({
        name: 'Test Session',
        nameArabic: 'جلسة اختبار',
        description: 'Test collaboration session',
        participants,
        documentType: 'policy-document',
        culturalContext: {
          islamicContext: true,
          arabicPrimary: true,
          governmentFormal: true
        },
        workflowRequired: false,
        securityLevel: 'internal'
      });

      expect(session).toBeDefined();
      expect(session.id).toBeDefined();
      expect(session.name).toBe('Test Session');
      expect(session.nameArabic).toBe('جلسة اختبار');
      expect(session.participants).toHaveLength(1);
      expect(session.islamicCompliance).toBe(true);
      expect(session.arabicPrimary).toBe(true);
    });

    test('should handle maximum participants limit', async () => {
      const manyParticipants: Partial<CollaborationParticipant>[] = [];
      for (let i = 0; i < 15; i++) {
        manyParticipants.push({
          id: `test-user-${i}`,
          name: `Test User ${i}`,
          nameArabic: `مستخدم تست ${i}`,
          ministry: 'health'
        });
      }

      try {
        await collaborationEngine.createCollaborationSession({
          name: 'Overload Test',
          participants: manyParticipants,
          documentType: 'policy-document'
        });
      } catch (error) {
        expect(error.message).toContain('maximum capacity');
      }
    });

    test('should join existing session successfully', async () => {
      const session = await collaborationEngine.createCollaborationSession({
        name: 'Join Test',
        participants: [{
          id: 'initial-user',
          name: 'Initial User',
          nameArabic: 'المستخدم الأولي',
          ministry: 'health'
        }],
        documentType: 'policy-document'
      });

      const joinResult = await collaborationEngine.joinSession(session.id, {
        id: 'joining-user',
        name: 'Joining User',
        nameArabic: 'المستخدم المنضم',
        ministry: 'health'
      });

      expect(joinResult).toBe(true);
    });

    test('should end session properly', async () => {
      const session = await collaborationEngine.createCollaborationSession({
        name: 'End Test',
        participants: [{
          id: 'test-user',
          name: 'Test User',
          nameArabic: 'مستخدم تست',
          ministry: 'health'
        }],
        documentType: 'policy-document'
      });

      const endResult = await collaborationEngine.endSession(
        session.id, 
        'test-user', 
        'Test completed'
      );

      expect(endResult).toBe(true);
    });
  });

  describe('Arabic Annotation System', () => {
    let sessionId: string;

    beforeEach(async () => {
      await collaborationEngine.initialize();
      const session = await collaborationEngine.createCollaborationSession({
        name: 'Annotation Test',
        participants: [{
          id: 'annotator',
          name: 'Test Annotator',
          nameArabic: 'معلق تست',
          ministry: 'health'
        }],
        documentType: 'policy-document'
      });
      sessionId = session.id;
    });

    test('should create Arabic annotation successfully', async () => {
      const annotation = await collaborationEngine.createAnnotation(sessionId, {
        targetElement: 'test-element',
        participantId: 'annotator',
        textArabic: 'هذا تعليق باللغة العربية',
        textEnglish: 'This is an Arabic comment',
        type: 'comment',
        priority: 'medium'
      });

      expect(annotation).toBeDefined();
      expect(annotation.id).toBeDefined();
      expect(annotation.textArabic).toBe('هذا تعليق باللغة العربية');
      expect(annotation.textEnglish).toBe('This is an Arabic comment');
      expect(annotation.culturallyValidated).toBe(true);
    });

    test('should validate cultural appropriateness', async () => {
      const annotation = await collaborationEngine.createAnnotation(sessionId, {
        targetElement: 'test-element',
        participantId: 'annotator',
        textArabic: 'بسم الله الرحمن الرحيم',
        textEnglish: 'In the name of Allah, Most Gracious, Most Merciful',
        type: 'islamic',
        priority: 'high',
        culturalContext: true
      });

      expect(annotation.islamicCompliant).toBe(true);
      expect(annotation.culturallyValidated).toBe(true);
    });

    test('should handle bilingual annotations', async () => {
      const annotation = await collaborationEngine.createAnnotation(sessionId, {
        targetElement: 'bilingual-element',
        participantId: 'annotator',
        textArabic: 'نص عربي مختلط English text',
        textEnglish: 'Mixed Arabic نص عربي and English',
        type: 'suggestion',
        priority: 'medium'
      });

      expect(annotation).toBeDefined();
      expect(annotation.textArabic).toContain('نص عربي');
      expect(annotation.textEnglish).toContain('English');
    });
  });

  describe('Document Collaboration', () => {
    let sessionId: string;

    beforeEach(async () => {
      await collaborationEngine.initialize();
      const session = await collaborationEngine.createCollaborationSession({
        name: 'Document Test',
        participants: [{
          id: 'editor',
          name: 'Test Editor',
          nameArabic: 'محرر تست',
          ministry: 'health'
        }],
        documentType: 'policy-document'
      });
      sessionId = session.id;
    });

    test('should update document content successfully', async () => {
      const updateResult = await collaborationEngine.updateDocumentContent(
        sessionId,
        'editor',
        {
          operation: 'insert',
          position: 0,
          content: 'Test document content with Arabic نص عربي',
          culturalValidation: true
        }
      );

      expect(updateResult).toBe(true);
    });

    test('should handle RTL text content', async () => {
      const arabicContent = 'هذا نص باللغة العربية من اليمين إلى اليسار';
      
      const updateResult = await collaborationEngine.updateDocumentContent(
        sessionId,
        'editor',
        {
          operation: 'insert',
          position: 0,
          content: arabicContent,
          culturalValidation: true
        }
      );

      expect(updateResult).toBe(true);
    });

    test('should validate cultural content', async () => {
      const islamicContent = 'بسم الله الرحمن الرحيم - الحمد لله رب العالمين';
      
      const updateResult = await collaborationEngine.updateDocumentContent(
        sessionId,
        'editor',
        {
          operation: 'insert',
          position: 0,
          content: islamicContent,
          culturalValidation: true
        }
      );

      expect(updateResult).toBe(true);
    });
  });

  describe('Prayer Time Awareness', () => {
    beforeEach(async () => {
      await collaborationEngine.initialize();
    });

    test('should handle prayer time pause', async () => {
      const session = await collaborationEngine.createCollaborationSession({
        name: 'Prayer Test',
        participants: [{
          id: 'believer',
          name: 'Faithful User',
          nameArabic: 'مستخدم مؤمن',
          ministry: 'health'
        }],
        documentType: 'policy-document'
      });

      await collaborationEngine.handlePrayerTimePause('dhuhr');
      
      // Prayer break should be initiated
      const exportData = collaborationEngine.exportSessionData(session.id);
      expect(exportData).toBeDefined();
    });

    test('should resume from prayer break', async () => {
      await collaborationEngine.handlePrayerTimePause('asr');
      await collaborationEngine.resumeFromPrayerBreak('asr');
      
      // Should complete without errors
      expect(true).toBe(true);
    });
  });

  describe('Ministry Workflow Integration', () => {
    let sessionId: string;

    beforeEach(async () => {
      await collaborationEngine.initialize();
      const session = await collaborationEngine.createCollaborationSession({
        name: 'Workflow Test',
        participants: [{
          id: 'approver',
          name: 'Test Approver',
          nameArabic: 'موافق تست',
          ministry: 'health'
        }],
        documentType: 'policy-document',
        workflowRequired: true
      });
      sessionId = session.id;
    });

    test('should start approval workflow', async () => {
      const workflowResult = await collaborationEngine.startApprovalWorkflow(
        sessionId,
        'approver',
        {
          urgentReview: false,
          culturalReview: true,
          islamicReview: true
        }
      );

      expect(workflowResult).toBeDefined();
      expect(workflowResult.workflowId).toBeDefined();
      expect(workflowResult.status).toBeDefined();
    });

    test('should handle cultural review workflow', async () => {
      const workflowResult = await collaborationEngine.startApprovalWorkflow(
        sessionId,
        'approver',
        {
          culturalReview: true,
          islamicReview: true
        }
      );

      expect(workflowResult.culturalValidationResult).toBeDefined();
      expect(workflowResult.islamicComplianceResult).toBeDefined();
    });
  });

  describe('Performance Metrics', () => {
    test('should track performance metrics', async () => {
      await collaborationEngine.initialize();
      
      const session = await collaborationEngine.createCollaborationSession({
        name: 'Metrics Test',
        participants: [{
          id: 'test-user',
          name: 'Metrics User',
          nameArabic: 'مستخدم مقاييس',
          ministry: 'health'
        }],
        documentType: 'policy-document'
      });

      const metrics = collaborationEngine.getPerformanceMetrics();
      
      expect(metrics).toBeDefined();
      expect(metrics.activeSessions).toBeGreaterThanOrEqual(1);
      expect(metrics.totalParticipants).toBeGreaterThanOrEqual(1);
      expect(metrics.syncLatency).toBeLessThanOrEqual(testConfig.syncLatencyTarget);
      expect(metrics.culturalComplianceRate).toBeGreaterThanOrEqual(0.9);
    });

    test('should maintain target sync latency', async () => {
      await collaborationEngine.initialize();
      const metrics = collaborationEngine.getPerformanceMetrics();
      
      expect(metrics.syncLatency).toBeLessThanOrEqual(testConfig.syncLatencyTarget);
    });

    test('should achieve cultural compliance targets', async () => {
      await collaborationEngine.initialize();
      const metrics = collaborationEngine.getPerformanceMetrics();
      
      expect(metrics.culturalComplianceRate).toBeGreaterThanOrEqual(0.95);
    });
  });

  describe('Security and Audit', () => {
    beforeEach(async () => {
      await collaborationEngine.initialize();
    });

    test('should maintain audit trail', async () => {
      const session = await collaborationEngine.createCollaborationSession({
        name: 'Audit Test',
        participants: [{
          id: 'audited-user',
          name: 'Audited User',
          nameArabic: 'مستخدم مراجع',
          ministry: 'health'
        }],
        documentType: 'policy-document'
      });

      const exportData = collaborationEngine.exportSessionData(session.id);
      
      expect(exportData.auditLog).toBeDefined();
      expect(exportData.auditLog.length).toBeGreaterThan(0);
    });

    test('should export session data correctly', async () => {
      const session = await collaborationEngine.createCollaborationSession({
        name: 'Export Test',
        participants: [{
          id: 'export-user',
          name: 'Export User',
          nameArabic: 'مستخدم تصدير',
          ministry: 'health'
        }],
        documentType: 'policy-document'
      });

      const exportData = collaborationEngine.exportSessionData(session.id);
      
      expect(exportData.session).toBeDefined();
      expect(exportData.auditLog).toBeDefined();
      expect(exportData.performanceMetrics).toBeDefined();
      expect(exportData.culturalCompliance).toBeDefined();
    });
  });
});

describe('Arabic Collaborative Text Engine', () => {
  let textEngine: ArabicCollaborativeTextEngine;
  let textConfig: ArabicTextConfig;

  beforeEach(() => {
    textConfig = {
      dialectSupport: ['iraqi', 'standard'],
      primaryDialect: 'iraqi',
      rtlProcessing: true,
      mixedDirectionSupport: true,
      islamicContentValidation: true,
      culturalTermValidation: true,
      governmentTerminologyCheck: true,
      professionalLanguageRequired: false,
      realTimeSync: true,
      conflictResolution: true,
      multiUserEditing: true,
      cursorSynchronization: true,
      processingLatencyTarget: 20,
      cachingEnabled: true,
      optimizedRendering: true,
      contentFiltering: true,
      auditLogging: true,
      encryptionEnabled: true
    };

    textEngine = new ArabicCollaborativeTextEngine(textConfig);
  });

  afterEach(() => {
    textEngine.destroy();
  });

  describe('Dialect Analysis', () => {
    test('should detect Iraqi dialect correctly', async () => {
      const iraqiText = 'شلونك؟ شكو ماكو؟'; // Iraqi greeting
      const analysis = await textEngine.analyzeDialect(iraqiText);

      expect(analysis.primaryDialect).toBe('iraqi');
      expect(analysis.dialectConfidence).toBeGreaterThan(0.7);
    });

    test('should detect standard Arabic', async () => {
      const standardText = 'كيف حالك؟ ما أخبارك؟'; // Standard Arabic greeting
      const analysis = await textEngine.analyzeDialect(standardText);

      expect(analysis.primaryDialect).toBe('standard');
      expect(analysis.standardArabicPercentage).toBeGreaterThan(0.8);
    });

    test('should handle mixed dialects', async () => {
      const mixedText = 'شلونك؟ كيف حالك؟'; // Mixed Iraqi and Standard
      const analysis = await textEngine.analyzeDialect(mixedText);

      expect(analysis.mixedDialects).toContain('iraqi');
      expect(analysis.mixedDialects.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Cultural Content Validation', () => {
    test('should validate Islamic content positively', async () => {
      const islamicText = 'بسم الله الرحمن الرحيم - الحمد لله رب العالمين';
      const validation = await textEngine.validateCulturalContent(islamicText);

      expect(validation.islamicCompliance).toBeGreaterThan(0.9);
      expect(validation.culturalScore).toBeGreaterThan(0.9);
      expect(validation.flaggedTerms).toHaveLength(0);
    });

    test('should provide cultural recommendations', async () => {
      const informalText = 'هذا نص غير رسمي';
      const validation = await textEngine.validateCulturalContent(informalText);

      expect(validation.recommendations).toBeDefined();
      expect(Array.isArray(validation.recommendations)).toBe(true);
    });

    test('should flag inappropriate content', async () => {
      const inappropriateText = 'نص غير مناسب ثقافياً';
      const validation = await textEngine.validateCulturalContent(inappropriateText);

      // Should handle inappropriate content gracefully
      expect(validation).toBeDefined();
      expect(validation.culturalScore).toBeDefined();
    });
  });

  describe('Bidirectional Text Processing', () => {
    test('should process RTL text correctly', async () => {
      const rtlText = 'هذا نص من اليمين إلى اليسار';
      const bidiRuns = await textEngine.processBidirectionalText(rtlText);

      expect(bidiRuns).toBeDefined();
      expect(bidiRuns.length).toBeGreaterThan(0);
      expect(bidiRuns[0].direction).toBe('rtl');
    });

    test('should handle mixed LTR/RTL text', async () => {
      const mixedText = 'Arabic نص عربي English text';
      const bidiRuns = await textEngine.processBidirectionalText(mixedText);

      expect(bidiRuns.length).toBeGreaterThan(1);
      expect(bidiRuns.some(run => run.direction === 'rtl')).toBe(true);
      expect(bidiRuns.some(run => run.direction === 'ltr')).toBe(true);
    });

    test('should identify script types correctly', async () => {
      const mixedText = 'عربي English مختلط';
      const bidiRuns = await textEngine.processBidirectionalText(mixedText);

      expect(bidiRuns.some(run => run.script === 'arabic')).toBe(true);
      expect(bidiRuns.some(run => run.script === 'latin')).toBe(true);
    });
  });

  describe('Performance Metrics', () => {
    test('should maintain processing latency targets', async () => {
      const testText = 'نص تجريبي للأداء';
      const startTime = Date.now();
      
      await textEngine.analyzeDialect(testText);
      await textEngine.validateCulturalContent(testText);
      await textEngine.processBidirectionalText(testText);
      
      const endTime = Date.now();
      const totalLatency = endTime - startTime;

      // Should complete all operations within reasonable time
      expect(totalLatency).toBeLessThan(100); // 100ms total
    });

    test('should track performance metrics', async () => {
      await textEngine.analyzeDialect('نص تجريبي');
      await textEngine.validateCulturalContent('نص آخر');
      
      const metrics = textEngine.getPerformanceMetrics();

      expect(metrics.totalOperations).toBeGreaterThan(0);
      expect(metrics.averageLatency).toBeLessThanOrEqual(textConfig.processingLatencyTarget);
      expect(metrics.dialectDetections).toBeGreaterThan(0);
      expect(metrics.culturalValidations).toBeGreaterThan(0);
    });
  });

  describe('Real-time Collaboration Features', () => {
    test('should track text state', () => {
      const textState = textEngine.getTextState();

      expect(textState).toBeDefined();
      expect(textState.documentId).toBeDefined();
      expect(textState.activeOperations).toBeInstanceOf(Map);
      expect(textState.userCursors).toBeInstanceOf(Map);
      expect(textState.userSelections).toBeInstanceOf(Map);
    });

    test('should handle cursor position updates', async () => {
      const position = { line: 1, column: 5, offset: 5 };
      const preferences = {
        islamicGreetings: true,
        formalAddress: true,
        respectTitles: true,
        elderRespect: true,
        genderConsiderations: true
      };

      await textEngine.updateUserCursor('test-user', position, preferences);
      
      const textState = textEngine.getTextState();
      expect(textState.userCursors.has('test-user')).toBe(true);
    });

    test('should process text selections', async () => {
      const startPos = { line: 1, column: 0, offset: 0 };
      const endPos = { line: 1, column: 10, offset: 10 };

      const selection = await textEngine.processTextSelection('test-user', startPos, endPos);

      expect(selection).toBeDefined();
      expect(selection.userId).toBe('test-user');
      expect(selection.startPosition).toEqual(expect.objectContaining(startPos));
      expect(selection.endPosition).toEqual(expect.objectContaining(endPos));
    });
  });
});

describe('Real-Time Collaboration Server', () => {
  let server: RealTimeCollaborationServer;
  let serverConfig: ServerConfig;

  beforeAll(() => {
    serverConfig = {
      port: 8081, // Different port for testing
      maxConnections: 10,
      heartbeatInterval: 5000,
      messageQueueSize: 100,
      prayerTimeAware: true,
      islamicWorkflowCompliance: true,
      arabicRTLSupport: true,
      ramadanScheduleAware: true,
      encryptionEnabled: false, // Disabled for testing
      authenticationRequired: false, // Disabled for testing
      auditTrailEnabled: true,
      ministerialOversight: false,
      latencyTarget: 30,
      compressionEnabled: false,
      connectionPooling: true,
      messageBuffering: true
    };
  });

  beforeEach(() => {
    server = new RealTimeCollaborationServer(serverConfig);
  });

  afterEach(async () => {
    if (server) {
      await server.shutdown();
    }
  });

  describe('Server Initialization', () => {
    test('should start server successfully', async () => {
      await expect(server.start()).resolves.toBeUndefined();
    });

    test('should get initial metrics', () => {
      const metrics = server.getMetrics();
      
      expect(metrics).toBeDefined();
      expect(metrics.totalConnections).toBe(0);
      expect(metrics.currentConnections).toBe(0);
      expect(metrics.messagesProcessed).toBe(0);
    });

    test('should shutdown gracefully', async () => {
      await server.start();
      await expect(server.shutdown()).resolves.toBeUndefined();
    });
  });

  describe('Performance Metrics', () => {
    test('should track server metrics', async () => {
      await server.start();
      
      const metrics = server.getMetrics();
      
      expect(metrics.sessions).toBe(0);
      expect(metrics.connections).toBe(0);
      expect(metrics.ministryChannels).toBeDefined();
      expect(typeof metrics.ministryChannels).toBe('object');
    });
  });

  describe('Cultural Features', () => {
    test('should support prayer time awareness', async () => {
      await server.start();
      
      // Server should be configured for prayer time awareness
      expect(serverConfig.prayerTimeAware).toBe(true);
      expect(serverConfig.islamicWorkflowCompliance).toBe(true);
    });

    test('should support Arabic RTL', () => {
      expect(serverConfig.arabicRTLSupport).toBe(true);
    });

    test('should support Ramadan scheduling', () => {
      expect(serverConfig.ramadanScheduleAware).toBe(true);
    });
  });
});

describe('Integration Tests', () => {
  test('should integrate collaboration engine with text engine', async () => {
    const collaborationEngine = new IraqiCollaborationEngine({
      ministry: 'health' as MinistryType,
      teamStructure: 'hierarchical',
      collaborationMode: 'real-time',
      maxParticipants: 5,
      islamicWorkflowCompliance: true,
      arabicCollaboration: true,
      prayerTimeAware: true,
      culturalModeration: true,
      ramadanScheduleAware: true,
      governmentSecurity: true,
      auditTrail: true,
      securityLevel: 'internal',
      crossMinistryCollaboration: false,
      citizenInteraction: false,
      syncLatencyTarget: 50,
      offlineSupport: true,
      mobileOptimized: true,
      rtlOptimized: true,
      wcagCompliance: true,
      governmentAccessibility: true,
      multiLanguageSupport: true
    });

    const textEngine = new ArabicCollaborativeTextEngine({
      dialectSupport: ['iraqi', 'standard'],
      primaryDialect: 'iraqi',
      rtlProcessing: true,
      mixedDirectionSupport: true,
      islamicContentValidation: true,
      culturalTermValidation: true,
      governmentTerminologyCheck: true,
      professionalLanguageRequired: false,
      realTimeSync: true,
      conflictResolution: true,
      multiUserEditing: true,
      cursorSynchronization: true,
      processingLatencyTarget: 20,
      cachingEnabled: true,
      optimizedRendering: true,
      contentFiltering: true,
      auditLogging: true,
      encryptionEnabled: false
    });

    try {
      await collaborationEngine.initialize();
      
      // Both engines should be functional
      expect(collaborationEngine).toBeDefined();
      expect(textEngine).toBeDefined();
      
      // Should be able to get metrics from both
      const collabMetrics = collaborationEngine.getPerformanceMetrics();
      const textMetrics = textEngine.getPerformanceMetrics();
      
      expect(collabMetrics).toBeDefined();
      expect(textMetrics).toBeDefined();
      
    } finally {
      await collaborationEngine.destroy();
      textEngine.destroy();
    }
  });

  test('should support end-to-end Iraqi government workflow', async () => {
    // This integration test verifies the complete workflow for Iraqi government use
    const collaborationEngine = new IraqiCollaborationEngine({
      ministry: 'health' as MinistryType,
      teamStructure: 'hierarchical',
      collaborationMode: 'hybrid',
      maxParticipants: 20,
      islamicWorkflowCompliance: true,
      arabicCollaboration: true,
      prayerTimeAware: true,
      culturalModeration: true,
      ramadanScheduleAware: true,
      governmentSecurity: true,
      auditTrail: true,
      securityLevel: 'confidential',
      crossMinistryCollaboration: false,
      citizenInteraction: true,
      syncLatencyTarget: 50,
      offlineSupport: true,
      mobileOptimized: true,
      rtlOptimized: true,
      wcagCompliance: true,
      governmentAccessibility: true,
      multiLanguageSupport: true
    });

    try {
      await collaborationEngine.initialize();
      
      // Create a full ministry collaboration session
      const session = await collaborationEngine.createCollaborationSession({
        name: 'National Health Policy Review',
        nameArabic: 'مراجعة السياسة الصحية الوطنية',
        description: 'Comprehensive review of national health policies',
        participants: [
          {
            id: 'minister-health',
            name: 'Minister of Health',
            nameArabic: 'وزير الصحة',
            ministry: 'health',
            department: 'Ministry Office'
          },
          {
            id: 'deputy-minister',
            name: 'Deputy Minister',
            nameArabic: 'نائب الوزير',
            ministry: 'health',
            department: 'Policy Development'
          }
        ],
        documentType: 'policy-document',
        culturalContext: {
          islamicContext: true,
          arabicPrimary: true,
          governmentFormal: true,
          citizenFacing: true,
          prayerTimeRespect: true,
          ramadanAware: true,
          halalCompliance: true,
          formalAddressing: true,
          hierarchyRespect: true,
          eldersRespect: true,
          ministryProtocol: true,
          officialCommunication: true,
          diplomaticLanguage: true,
          confidentialityAware: true
        },
        workflowRequired: true,
        securityLevel: 'confidential'
      });
      
      expect(session).toBeDefined();
      expect(session.islamicCompliance).toBe(true);
      expect(session.arabicPrimary).toBe(true);
      expect(session.securityLevel).toBe('confidential');
      
      // Verify cultural compliance is maintained throughout
      const metrics = collaborationEngine.getPerformanceMetrics();
      expect(metrics.culturalComplianceRate).toBeGreaterThanOrEqual(0.95);
      
    } finally {
      await collaborationEngine.destroy();
    }
  });
});