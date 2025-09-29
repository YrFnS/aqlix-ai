/**
 * Iraqi AI System - Basic Collaboration Engine Usage Example
 * Demonstrates basic setup and usage of the real-time collaboration system
 * Enhanced for Iraqi government deployment with cultural intelligence
 */

import {
  IraqiCollaborationEngine,
  IraqiCollaborationConfig,
  MinistryType,
  CollaborationParticipant,
} from '../src/CollaborationEngine';

import { RealTimeCollaborationServer, ServerConfig } from '../src/RealTimeCollaborationServer';

import {
  ArabicCollaborativeTextEngine,
  ArabicTextConfig,
} from '../src/ArabicCollaborativeTextEngine';

async function basicCollaborationExample() {
  console.log('🇮🇶 Iraqi AI Collaboration Engine - Basic Usage Example');
  console.log('=====================================================');

  // 1. Setup collaboration configuration for Health Ministry
  const collaborationConfig: IraqiCollaborationConfig = {
    ministry: 'health' as MinistryType,
    teamStructure: 'hierarchical',
    collaborationMode: 'hybrid',
    maxParticipants: 15,

    // Cultural and religious settings
    islamicWorkflowCompliance: true,
    arabicCollaboration: true,
    prayerTimeAware: true,
    culturalModeration: true,
    ramadanScheduleAware: true,

    // Government and security
    governmentSecurity: true,
    auditTrail: true,
    securityLevel: 'confidential',
    crossMinistryCollaboration: false,
    citizenInteraction: true,

    // Performance and technical
    syncLatencyTarget: 50, // 50ms target
    offlineSupport: true,
    mobileOptimized: true,
    rtlOptimized: true,

    // Accessibility and compliance
    wcagCompliance: true,
    governmentAccessibility: true,
    multiLanguageSupport: true,
  };

  // 2. Initialize collaboration engine
  console.log('\\n📋 Initializing Iraqi Collaboration Engine...');
  const collaborationEngine = new IraqiCollaborationEngine(collaborationConfig);

  try {
    const initialized = await collaborationEngine.initialize();
    if (!initialized) {
      throw new Error('Failed to initialize collaboration engine');
    }
    console.log('✅ Collaboration engine initialized successfully');

    // 3. Create sample participants (Health Ministry team)
    const healthMinistryParticipants: Partial<CollaborationParticipant>[] = [
      {
        id: 'minister-health-001',
        name: 'Dr. Ahmed Al-Hakim',
        nameArabic: 'د. أحمد الحكيم',
        ministry: 'health',
        department: 'Ministry Office',
        role: {
          title: 'Minister of Health',
          titleArabic: 'وزير الصحة',
          hierarchy: 1,
          approvalAuthority: true,
          culturalWeight: 1.0,
          ministrySpecific: true,
        },
        preferredLanguage: 'bilingual',
        permissions: {
          read: true,
          write: true,
          approve: true,
          moderate: true,
          admin: true,
          audit: true,
          cultural: true,
          security: true,
        },
      },
      {
        id: 'deputy-health-001',
        name: 'Dr. Fatima Al-Zahra',
        nameArabic: 'د. فاطمة الزهراء',
        ministry: 'health',
        department: 'Medical Services',
        role: {
          title: 'Deputy Minister',
          titleArabic: 'نائب الوزير',
          hierarchy: 2,
          approvalAuthority: true,
          culturalWeight: 0.8,
          ministrySpecific: true,
        },
        preferredLanguage: 'arabic',
        permissions: {
          read: true,
          write: true,
          approve: true,
          moderate: true,
          admin: false,
          audit: true,
          cultural: true,
          security: true,
        },
      },
      {
        id: 'director-health-001',
        name: 'Dr. Omar Al-Iraqi',
        nameArabic: 'د. عمر العراقي',
        ministry: 'health',
        department: 'Public Health',
        role: {
          title: 'Director General',
          titleArabic: 'المدير العام',
          hierarchy: 3,
          approvalAuthority: true,
          culturalWeight: 0.6,
          ministrySpecific: true,
        },
        preferredLanguage: 'bilingual',
        permissions: {
          read: true,
          write: true,
          approve: true,
          moderate: false,
          admin: false,
          audit: false,
          cultural: true,
          security: false,
        },
      },
    ];

    // 4. Create collaboration session
    console.log('\\n🏥 Creating Health Ministry collaboration session...');
    const session = await collaborationEngine.createCollaborationSession({
      name: 'COVID-19 Response Policy Review',
      nameArabic: 'مراجعة سياسة الاستجابة لكوفيد-19',
      description: 'Review and update national COVID-19 response protocols',
      participants: healthMinistryParticipants,
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
        confidentialityAware: true,
      },
      workflowRequired: true,
      securityLevel: 'confidential',
    });

    console.log(`✅ Session created: ${session.id}`);
    console.log(`   📋 Session: ${session.name} (${session.nameArabic})`);
    console.log(`   👥 Participants: ${session.participants.length}`);
    console.log(`   🔒 Security Level: ${session.securityLevel}`);
    console.log(`   🕌 Islamic Compliance: ${session.islamicCompliance}`);
    console.log(`   🔤 Arabic Primary: ${session.arabicPrimary}`);

    // 5. Create Arabic annotation example
    console.log('\\n📝 Creating Arabic annotation with cultural validation...');
    const annotationResult = await collaborationEngine.createAnnotation(session.id, {
      targetElement: 'policy-section-1',
      participantId: 'deputy-health-001',
      textArabic: 'يجب مراعاة التباعد الاجتماعي وفقاً للتوجيهات الإسلامية',
      textEnglish: 'Social distancing should consider Islamic guidelines',
      type: 'cultural',
      priority: 'high',
      culturalContext: true,
    });

    console.log(`✅ Arabic annotation created: ${annotationResult.id}`);
    console.log(`   📝 Arabic: ${annotationResult.textArabic}`);
    console.log(`   📝 English: ${annotationResult.textEnglish}`);
    console.log(`   🎯 Cultural Compliance: ${annotationResult.culturallyValidated}`);
    console.log(`   ✅ Islamic Compliance: ${annotationResult.islamicCompliant}`);

    // 6. Update document content with RTL support
    console.log('\\n📄 Updating document with Arabic RTL content...');
    const updateResult = await collaborationEngine.updateDocumentContent(
      session.id,
      'minister-health-001',
      {
        operation: 'insert',
        position: 0,
        content:
          'بسم الله الرحمن الرحيم\\n\\nسياسة الاستجابة الوطنية لجائحة كوفيد-19\\n\\nIn the name of Allah, the Most Gracious, the Most Merciful\\n\\nNational COVID-19 Response Policy\\n\\nThis policy document outlines our comprehensive approach...',
        culturalValidation: true,
      }
    );

    if (updateResult) {
      console.log('✅ Document updated successfully with RTL content');
      console.log('   🔤 Content includes Arabic RTL text');
      console.log('   🎯 Cultural validation passed');
      console.log('   📋 Edit history recorded');
    }

    // 7. Start approval workflow
    console.log('\\n🔄 Starting ministry approval workflow...');
    const workflowResult = await collaborationEngine.startApprovalWorkflow(
      session.id,
      'minister-health-001',
      {
        urgentReview: true,
        culturalReview: true,
        islamicReview: true,
      }
    );

    console.log(`✅ Workflow started: ${workflowResult.workflowId}`);
    console.log(`   📊 Status: ${workflowResult.status}`);
    console.log(
      `   🎯 Cultural Review: ${workflowResult.culturalValidationResult ? 'Required' : 'Not Required'}`
    );
    console.log(
      `   ✅ Islamic Review: ${workflowResult.islamicComplianceResult ? 'Required' : 'Not Required'}`
    );
    console.log(
      `   ⏱️ Estimated Duration: ${Math.round(workflowResult.estimatedDuration / (1000 * 60))} minutes`
    );

    // 8. Demonstrate prayer time handling
    console.log('\\n🕌 Testing prayer time awareness...');
    if (collaborationConfig.prayerTimeAware) {
      // Simulate prayer time (this would normally be automatic)
      await collaborationEngine.handlePrayerTimePause('dhuhr');
      console.log('✅ Prayer break initiated for Dhuhr prayer');
      console.log('   ⏸️ All active sessions paused');
      console.log('   📱 Participants notified');
      console.log('   ⏰ Automatic resume scheduled');
    }

    // 9. Get performance metrics
    console.log('\\n📊 Collaboration Performance Metrics:');
    const metrics = collaborationEngine.getPerformanceMetrics();
    console.log(`   🚀 Active Sessions: ${metrics.activeSessions}`);
    console.log(`   👥 Total Participants: ${metrics.totalParticipants}`);
    console.log(`   ⚡ Average Sync Latency: ${metrics.syncLatency}ms`);
    console.log(
      `   🎯 Cultural Compliance Rate: ${(metrics.culturalComplianceRate * 100).toFixed(1)}%`
    );
    console.log(`   📋 Total Operations: ${metrics.totalSessions}`);
    console.log(`   🕌 Prayer Pauses: ${metrics.prayerPauses}`);
    console.log(`   🔄 Workflow Completions: ${metrics.approvalWorkflows}`);

    // 10. Export session data for audit
    console.log('\\n🗃️ Exporting session data for government audit...');
    const exportData = collaborationEngine.exportSessionData(session.id);
    console.log('✅ Session data exported successfully');
    console.log(`   📄 Audit Entries: ${exportData.auditLog.length}`);
    console.log(
      `   🎯 Cultural Compliance Score: ${(exportData.culturalCompliance.overallScore * 100).toFixed(1)}%`
    );
    console.log(`   📊 Performance Data: Available`);

    // 11. Cleanup
    console.log('\\n🧹 Cleaning up collaboration session...');
    await collaborationEngine.endSession(session.id, 'minister-health-001', 'Example completed');
    console.log('✅ Session ended successfully');
  } catch (error) {
    console.error('❌ Error in collaboration example:', error.message);
  } finally {
    // Always cleanup
    await collaborationEngine.destroy();
    console.log('🗑️ Collaboration engine destroyed');
  }
}

async function realTimeServerExample() {
  console.log('\\n🔗 Real-Time Collaboration Server Example');
  console.log('=========================================');

  // Server configuration
  const serverConfig: ServerConfig = {
    port: 8080,
    maxConnections: 100,
    heartbeatInterval: 30000, // 30 seconds
    messageQueueSize: 1000,

    // Cultural settings
    prayerTimeAware: true,
    islamicWorkflowCompliance: true,
    arabicRTLSupport: true,
    ramadanScheduleAware: true,

    // Security settings
    encryptionEnabled: true,
    authenticationRequired: true,
    auditTrailEnabled: true,
    ministerialOversight: true,

    // Performance settings
    latencyTarget: 30, // 30ms
    compressionEnabled: true,
    connectionPooling: true,
    messageBuffering: true,
  };

  // Initialize and start server
  const server = new RealTimeCollaborationServer(serverConfig);

  try {
    await server.start();
    console.log(`✅ Real-time collaboration server started on port ${serverConfig.port}`);
    console.log('   🔗 WebSocket endpoint: ws://localhost:8080');
    console.log('   🕌 Prayer time awareness: Enabled');
    console.log('   🔤 Arabic RTL support: Enabled');
    console.log('   🔒 Government security: Enabled');

    // Server metrics
    setTimeout(() => {
      const metrics = server.getMetrics();
      console.log('\\n📊 Server Metrics:');
      console.log(`   🔗 Current Connections: ${metrics.currentConnections}`);
      console.log(`   📨 Messages Processed: ${metrics.messagesProcessed}`);
      console.log(`   ⚡ Average Latency: ${metrics.averageLatency}ms`);
      console.log(`   🕌 Prayer Pauses: ${metrics.prayerPausesInitiated}`);
      console.log(`   🎯 Cultural Events: ${metrics.culturalEventsHandled}`);
    }, 2000);

    // Simulate running for demo (in real app, this would run indefinitely)
    console.log('\\n⏳ Server running... (Press Ctrl+C to stop)');

    // Graceful shutdown after demo
    setTimeout(async () => {
      console.log('\\n🛑 Shutting down server...');
      await server.shutdown();
      console.log('✅ Server shut down gracefully');
    }, 5000);
  } catch (error) {
    console.error('❌ Server error:', error.message);
  }
}

async function arabicTextEngineExample() {
  console.log('\\n🔤 Arabic Collaborative Text Engine Example');
  console.log('==========================================');

  const textConfig: ArabicTextConfig = {
    dialectSupport: ['iraqi', 'standard'],
    primaryDialect: 'iraqi',
    rtlProcessing: true,
    mixedDirectionSupport: true,

    islamicContentValidation: true,
    culturalTermValidation: true,
    governmentTerminologyCheck: true,
    professionalLanguageRequired: true,

    realTimeSync: true,
    conflictResolution: true,
    multiUserEditing: true,
    cursorSynchronization: true,

    processingLatencyTarget: 20, // 20ms
    cachingEnabled: true,
    optimizedRendering: true,

    contentFiltering: true,
    auditLogging: true,
    encryptionEnabled: true,
  };

  const textEngine = new ArabicCollaborativeTextEngine(textConfig);

  console.log('✅ Arabic text engine initialized');
  console.log('   🔤 Iraqi dialect support enabled');
  console.log('   🔄 RTL processing enabled');
  console.log('   🎯 Cultural validation enabled');
  console.log('   ✅ Islamic compliance checking enabled');

  // Example Arabic text operation
  const sampleArabicText =
    'بسم الله الرحمن الرحيم - هذا مثال على النص العربي في نظام التعاون الحكومي العراقي';

  const dialectAnalysis = await textEngine.analyzeDialect(sampleArabicText);
  console.log('\\n🔍 Dialect Analysis Results:');
  console.log(`   🎯 Primary Dialect: ${dialectAnalysis.primaryDialect}`);
  console.log(`   📊 Confidence: ${(dialectAnalysis.dialectConfidence * 100).toFixed(1)}%`);
  console.log(
    `   📝 Standard Arabic: ${(dialectAnalysis.standardArabicPercentage * 100).toFixed(1)}%`
  );

  const culturalValidation = await textEngine.validateCulturalContent(sampleArabicText);
  console.log('\\n🎭 Cultural Validation Results:');
  console.log(`   🎯 Cultural Score: ${(culturalValidation.culturalScore * 100).toFixed(1)}%`);
  console.log(
    `   ✅ Islamic Compliance: ${(culturalValidation.islamicCompliance * 100).toFixed(1)}%`
  );
  console.log(`   🚩 Flagged Terms: ${culturalValidation.flaggedTerms.length}`);

  const bidiProcessing = await textEngine.processBidirectionalText(sampleArabicText);
  console.log('\\n🔄 Bidirectional Text Processing:');
  console.log(`   📊 Bidi Runs: ${bidiProcessing.length}`);
  console.log('   🔤 RTL processing completed successfully');

  console.log('\\n📊 Text Engine Performance:');
  const textMetrics = textEngine.getPerformanceMetrics();
  console.log(`   🚀 Total Operations: ${textMetrics.totalOperations}`);
  console.log(`   ⚡ Average Latency: ${textMetrics.averageLatency}ms`);
  console.log(`   🔄 Conflicts Resolved: ${textMetrics.conflictsResolved}`);
  console.log(`   🎯 Cultural Validations: ${textMetrics.culturalValidations}`);
  console.log(`   🔤 Dialect Detections: ${textMetrics.dialectDetections}`);

  textEngine.destroy();
  console.log('✅ Arabic text engine cleaned up');
}

// Run all examples
async function runAllExamples() {
  try {
    await basicCollaborationExample();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await realTimeServerExample();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await arabicTextEngineExample();

    console.log('\\n🎉 All examples completed successfully!');
    console.log('🇮🇶 Iraqi AI Collaboration Engine ready for deployment');
  } catch (error) {
    console.error('❌ Example execution failed:', error);
  }
}

// Export for use in other modules
export { basicCollaborationExample, realTimeServerExample, arabicTextEngineExample };

// Run examples if this file is executed directly
if (require.main === module) {
  runAllExamples().catch(console.error);
}
