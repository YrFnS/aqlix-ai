/**
 * Iraqi Advanced Project Management - Basic Usage Examples
 * Comprehensive examples for multi-ministry project coordination
 * Enhanced with cultural intelligence and Islamic compliance
 * 
 * This file demonstrates:
 * - Basic project creation with cultural validation
 * - Multi-ministry coordination workflows
 * - Arabic document version control with RTL support
 * - Prayer time-aware scheduling
 * - Islamic compliance validation and Shura consultation
 * - Government audit trail and security integration
 * - Performance monitoring and optimization
 */

import {
  IraqiProjectManagementEngine,
  MinistryCoordinationManager,
  ArabicVersionControlEngine,
  ProjectConfig,
  ProjectCreateRequest,
  MinistryType,
  ProjectType,
  ProjectPriority,
  SecurityClassification
} from '../src';

// ============================================================================
// BASIC SETUP AND CONFIGURATION
// ============================================================================

async function setupProjectManagementSystem() {
  console.log('🏛️ Setting up Iraqi Project Management System...');
  
  // Configure project management engine
  const projectConfig: ProjectConfig = {
    multiMinistry: true,
    islamicCompliance: true,
    culturalValidation: true,
    auditTrail: true,
    governmentProtocol: true,
    citizenFacing: false,
    
    // Cultural and religious settings
    prayerTimeAware: true,
    ramadanScheduleAware: true,
    islamicHolidayAware: true,
    culturalEventAware: true,
    workdayFlexibility: true,
    
    // Approval and governance
    approvalHierarchy: ['department', 'directorate', 'ministry', 'council-of-ministers'],
    shuraConsultation: true,
    ministerialApproval: true,
    parliamentaryOversight: false, // Internal project
    publicConsultation: false,
    
    // Version control and documentation
    arabicVersionControl: true,
    rtlDiffVisualization: true,
    bilingualDocumentation: true,
    autoTranslation: false, // Manual translation preferred
    culturalReview: true,
    
    // Security and access control
    securityClassification: 'internal',
    accessControl: true,
    encryptionRequired: false, // Not classified
    auditLogging: true,
    governmentCompliance: true,
    
    // Performance optimization
    distributedTeams: true,
    realTimeSync: true,
    offlineSupport: false,
    performanceMonitoring: true,
    resourceOptimization: true
  };
  
  // Initialize engines
  const projectEngine = new IraqiProjectManagementEngine({
    multiMinistrySupport: true,
    islamicComplianceEnabled: true,
    culturalValidationEnabled: true,
    arabicContentSupport: true,
    rtlVisualizationEnabled: true,
    
    // Performance settings
    maxConcurrentProjects: 100,
    cacheTimeout: 300000, // 5 minutes
    syncInterval: 5000, // 5 seconds
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
    transparencyReportingEnabled: false, // Internal project
    parliamentaryOversight: false,
    citizenEngagementEnabled: false,
    
    // Security settings
    securityClassificationEnabled: true,
    encryptionRequired: false,
    accessControlEnforced: true,
    securityAuditingEnabled: true,
    dataProtectionCompliance: true,
    
    // Integration settings
    externalSystemIntegration: true,
    realTimeCollaboration: true,
    workflowAutomation: true,
    notificationSystem: true,
    reportingDashboard: true
  });
  
  console.log('✅ Project Management System initialized successfully');
  return projectEngine;
}

// ============================================================================
// BASIC PROJECT CREATION
// ============================================================================

async function createBasicProject(projectEngine: IraqiProjectManagementEngine) {
  console.log('📋 Creating basic government project...');
  
  const projectRequest: ProjectCreateRequest = {
    // Basic information
    title: "Digital Healthcare Transformation Initiative",
    titleArabic: "مبادرة التحول الرقمي للرعاية الصحية",
    description: "Comprehensive digital transformation of healthcare services across Iraq to improve citizen access and service quality.",
    descriptionArabic: "التحول الرقمي الشامل لخدمات الرعاية الصحية في جميع أنحاء العراق لتحسين وصول المواطنين وجودة الخدمة.",
    type: 'digital-transformation' as ProjectType,
    priority: 'important' as ProjectPriority,
    
    // Ministry and organization
    primaryMinistry: 'health' as MinistryType,
    secondaryMinistries: ['communications', 'finance'] as MinistryType[],
    projectManagerId: 'pm-health-001',
    sponsorId: 'minister-health-001',
    
    // Timeline and budget
    startDate: new Date('2025-02-01'),
    endDate: new Date('2025-12-31'),
    estimatedBudget: 50_000_000, // 50 million IQD
    
    // Configuration
    config: {
      multiMinistry: true,
      islamicCompliance: true,
      culturalValidation: true,
      auditTrail: true,
      governmentProtocol: true,
      citizenFacing: true, // Citizens will use the system
      
      prayerTimeAware: true,
      ramadanScheduleAware: true,
      islamicHolidayAware: true,
      culturalEventAware: true,
      workdayFlexibility: true,
      
      approvalHierarchy: ['department', 'directorate', 'ministry', 'council-of-ministers'],
      shuraConsultation: true,
      ministerialApproval: true,
      parliamentaryOversight: false,
      publicConsultation: true, // Public healthcare system
      
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
      realTimeSync: true,
      offlineSupport: true, // Healthcare workers may work offline
      performanceMonitoring: true,
      resourceOptimization: true
    },
    
    // Cultural and Islamic requirements
    culturalValidationRequired: true,
    islamicComplianceRequired: true,
    shuraConsultationRequired: true,
    
    // Security and access
    securityClassification: 'internal',
    restrictedAccess: true,
    
    // Initial stakeholders
    initialStakeholders: [
      'director-general-health-001',
      'it-director-health-001',
      'cultural-advisor-health-001',
      'islamic-advisor-health-001'
    ]
  };
  
  try {
    const project = await projectEngine.createProject(projectRequest);
    
    console.log('✅ Project created successfully:');
    console.log(`   Project ID: ${project.id}`);
    console.log(`   Title: ${project.title}`);
    console.log(`   Arabic Title: ${project.titleArabic}`);
    console.log(`   Primary Ministry: ${project.primaryMinistry}`);
    console.log(`   Secondary Ministries: ${project.secondaryMinistries.join(', ')}`);
    console.log(`   Status: ${project.status}`);
    console.log(`   Cultural Validation Score: ${project.culturalValidation.score}`);
    console.log(`   Islamic Compliance Score: ${project.islamicCompliance.score}`);
    
    return project;
    
  } catch (error) {
    console.error('❌ Failed to create project:', error.message);
    throw error;
  }
}

// ============================================================================
// MULTI-MINISTRY COORDINATION
// ============================================================================

async function setupMinistryCoordination(project: any) {
  console.log('🤝 Setting up multi-ministry coordination...');
  
  const coordinationManager = new MinistryCoordinationManager({
    // Core coordination settings
    enableInterMinistryWorkflows: true,
    hierarchicalApprovalRequired: true,
    ministerialOversightEnabled: true,
    parliamentaryReportingEnabled: false,
    
    // Cultural and Islamic settings
    shuraConsultationMandatory: true,
    culturalValidationRequired: true,
    islamicComplianceEnforced: true,
    tribalLiaisonRequired: false, // Not needed for healthcare IT
    
    // Performance settings
    coordinationTimeoutHours: 72, // 3 days for response
    maxConcurrentCoordinations: 50,
    realTimeUpdatesEnabled: true,
    performanceMonitoringEnabled: true,
    
    // Security settings
    securityClearanceVerification: true,
    crossMinistryAccessControl: true,
    auditTrailMandatory: true,
    classifiedDocumentHandling: false,
    
    // Communication settings
    bilingualCommunication: true,
    arabicPrimaryLanguage: true,
    formalProtocolRequired: true,
    diplomaticLanguageRequired: false // Internal government communication
  });
  
  // Initiate coordination between ministries
  const coordination = await coordinationManager.initiateInterMinistryCoordination(
    project,
    {
      coordinationType: 'project-approval',
      participatingMinistries: ['health', 'communications', 'finance'],
      coordinatorId: project.projectManager.id,
      urgencyLevel: 'important',
      culturalSensitivityRequired: true,
      islamicConsultationRequired: true,
      securityClearanceLevel: 'internal' as SecurityClassification,
      expectedDuration: 30, // 30 days
      budgetImplications: true,
      publicVisibility: false,
      parliamentaryOversight: false,
      description: 'Multi-ministry coordination for digital healthcare transformation project approval and resource allocation',
      descriptionArabic: 'التنسيق متعدد الوزارات لموافقة مشروع التحول الرقمي للرعاية الصحية وتخصيص الموارد',
      objectives: [
        'Obtain formal ministry approvals for digital healthcare transformation',
        'Coordinate budget allocations across ministries',
        'Establish technical infrastructure requirements',
        'Define inter-ministry collaboration protocols'
      ],
      objectivesArabic: [
        'الحصول على الموافقات الرسمية من الوزارات للتحول الرقمي للرعاية الصحية',
        'تنسيق تخصيص الميزانية عبر الوزارات',
        'تحديد متطلبات البنية التحتية التقنية',
        'تحديد بروتوكولات التعاون بين الوزارات'
      ],
      successCriteria: [
        'All three ministries provide formal approval',
        'Budget allocations confirmed and documented',
        'Technical specifications agreed upon',
        'Implementation timeline approved by all parties'
      ],
      successCriteriaArabic: [
        'جميع الوزارات الثلاث تقدم الموافقة الرسمية',
        'تخصيص الميزانية مؤكد وموثق',
        'المواصفات التقنية متفق عليها',
        'الجدول الزمني للتنفيذ موافق عليه من جميع الأطراف'
      ]
    }
  );
  
  console.log('✅ Inter-ministry coordination initiated:');
  console.log(`   Coordination ID: ${coordination.id}`);
  console.log(`   Primary Ministry: ${coordination.primaryMinistry}`);
  console.log(`   Participating Ministries: ${coordination.participatingMinistries.join(', ')}`);
  console.log(`   Status: ${coordination.status}`);
  console.log(`   Expected Duration: ${coordination.coordinationTimeline} days`);
  
  return { coordinationManager, coordination };
}

// ============================================================================
// ARABIC VERSION CONTROL
// ============================================================================

async function setupArabicVersionControl() {
  console.log('📝 Setting up Arabic version control system...');
  
  const versionControl = new ArabicVersionControlEngine({
    // Core RTL and Arabic support
    rtlDiffVisualization: true,
    bidirectionalTextSupport: true,
    arabicFontOptimization: true,
    mixedContentHandling: true,
    unicodeNormalization: true,
    
    // Cultural and Islamic features
    culturalContextTracking: true,
    islamicContentValidation: true,
    culturalAnnotationSupport: true,
    hijriCalendarIntegration: true,
    islamicTerminologyDatabase: true,
    
    // Performance and caching
    diffCachingEnabled: true,
    arabicTextIndexing: true,
    semanticSearchEnabled: true,
    performanceOptimization: true,
    maxDiffSize: 100000, // 100K characters
    
    // Government and compliance
    auditTrailMandatory: true,
    classifiedContentHandling: false,
    governmentProtocolEnforcement: true,
    documentIntegrityVerification: true,
    digitalSignatureSupport: false,
    
    // Collaboration and merging
    collaborativeMerging: true,
    conflictResolutionGuidance: true,
    culturalMergeValidation: true,
    multiUserRealTimeEditing: true,
    branchingWithCulturalContext: true
  });
  
  // Create initial project charter document
  const document = await versionControl.createDocument({
    title: "Digital Healthcare Transformation Project Charter",
    titleArabic: "ميثاق مشروع التحول الرقمي للرعاية الصحية",
    content: `
# Digital Healthcare Transformation Project Charter

## Project Overview
This project aims to transform Iraq's healthcare system through comprehensive digital solutions.

## Objectives
1. Implement electronic health records (EHR) system
2. Develop citizen healthcare portal
3. Integrate telemedicine capabilities
4. Establish healthcare analytics platform

## Success Criteria
- 90% of public hospitals using EHR within 12 months
- 1 million citizens registered on healthcare portal
- 24/7 telemedicine service availability
- Real-time healthcare analytics dashboard

## Budget Allocation
Total Budget: 50,000,000 IQD
- Technology Infrastructure: 30,000,000 IQD (60%)
- Software Development: 15,000,000 IQD (30%)
- Training and Support: 5,000,000 IQD (10%)

## Timeline
Phase 1: System Design and Setup (3 months)
Phase 2: Core Development (6 months)
Phase 3: Testing and Deployment (3 months)
    `,
    contentArabic: `
# ميثاق مشروع التحول الرقمي للرعاية الصحية

## نظرة عامة على المشروع
يهدف هذا المشروع إلى تحويل نظام الرعاية الصحية في العراق من خلال حلول رقمية شاملة.

## الأهداف
1. تنفيذ نظام السجلات الصحية الإلكترونية
2. تطوير بوابة الرعاية الصحية للمواطنين
3. دمج إمكانيات الطب عن بُعد
4. إنشاء منصة تحليلات الرعاية الصحية

## معايير النجاح
- 90% من المستشفيات العامة تستخدم السجلات الإلكترونية خلال 12 شهرًا
- مليون مواطن مسجل في بوابة الرعاية الصحية
- توفر خدمة الطب عن بُعد 24/7
- لوحة تحليلات الرعاية الصحية في الوقت الفعلي

## تخصيص الميزانية
إجمالي الميزانية: 50,000,000 دينار عراقي
- البنية التحتية التقنية: 30,000,000 دينار عراقي (60%)
- تطوير البرمجيات: 15,000,000 دينار عراقي (30%)
- التدريب والدعم: 5,000,000 دينار عراقي (10%)

## الجدول الزمني
المرحلة الأولى: تصميم النظام والإعداد (3 أشهر)
المرحلة الثانية: التطوير الأساسي (6 أشهر)
المرحلة الثالثة: الاختبار والنشر (3 أشهر)
    `,
    primaryLanguage: 'mixed',
    contentType: 'project-charter',
    culturalValidationRequired: true,
    islamicComplianceRequired: true,
    securityClassification: 'internal' as SecurityClassification,
    authorId: 'pm-health-001'
  });
  
  console.log('✅ Project charter document created:');
  console.log(`   Document ID: ${document.id}`);
  console.log(`   Title: ${document.title}`);
  console.log(`   Arabic Title: ${document.titleArabic}`);
  console.log(`   Version: ${document.version}`);
  console.log(`   Primary Language: ${document.primaryLanguage}`);
  console.log(`   Cultural Validation Score: ${document.culturalValidation.score}`);
  console.log(`   Islamic Compliance Score: ${document.islamicCompliance.score}`);
  
  return { versionControl, document };
}

// ============================================================================
// PRAYER TIME-AWARE SCHEDULING
// ============================================================================

async function setupPrayerAwareScheduling(project: any) {
  console.log('🕌 Setting up prayer time-aware scheduling...');
  
  // Configure timeline with Islamic considerations
  const timelineConfig = {
    prayerTimeAware: true,
    ramadanScheduleAware: true,
    islamicHolidayAware: true,
    culturalEventAware: true,
    
    // Prayer time settings
    prayerTimeBuffer: 30, // 30 minutes buffer around prayer times
    fridayJummaBreak: 120, // 2 hours for Friday prayers
    ramadanWorkingHours: {
      start: '09:00',
      end: '14:00' // Shorter working hours during Ramadan
    },
    
    // Islamic holidays to exclude from work schedule
    islamicHolidays: [
      'eid-al-fitr',
      'eid-al-adha', 
      'islamic-new-year',
      'mawlid-al-nabi',
      'night-of-power', // Laylat al-Qadr
      'day-of-arafah'
    ],
    
    // Cultural events and considerations
    culturalEvents: [
      'ashura', // Day of mourning
      'arbaeen-pilgrimage',
      'national-day',
      'independence-day'
    ]
  };
  
  // Create project timeline with cultural considerations
  const timeline = {
    startDate: project.timeline.startDate,
    endDate: project.timeline.endDate,
    duration: Math.ceil((project.timeline.endDate - project.timeline.startDate) / (1000 * 60 * 60 * 24)),
    
    // Prayer time adjustments
    prayerTimeBuffers: [
      { prayer: 'fajr', buffer: 15 },
      { prayer: 'dhuhr', buffer: 30 },
      { prayer: 'asr', buffer: 20 },
      { prayer: 'maghrib', buffer: 25 },
      { prayer: 'isha', buffer: 15 }
    ],
    
    // Ramadan schedule adjustments (approximate dates)
    ramadanAdjustments: [
      {
        startDate: new Date('2025-03-01'), // Approximate Ramadan start
        endDate: new Date('2025-03-30'), // Approximate Ramadan end
        workingHours: { start: '09:00', end: '14:00' },
        breakDuration: 60, // 1 hour break for Iftar preparation
        reducedProductivity: 0.8 // 80% productivity during Ramadan
      }
    ],
    
    // Islamic holiday exclusions
    islamicHolidayExclusions: [
      { name: 'Eid Al-Fitr', nameArabic: 'عيد الفطر', duration: 3, approximate: new Date('2025-03-31') },
      { name: 'Eid Al-Adha', nameArabic: 'عيد الأضحى', duration: 4, approximate: new Date('2025-06-07') },
      { name: 'Islamic New Year', nameArabic: 'رأس السنة الهجرية', duration: 1, approximate: new Date('2025-07-07') },
      { name: 'Mawlid Al-Nabi', nameArabic: 'المولد النبوي', duration: 1, approximate: new Date('2025-08-16') }
    ],
    
    // Cultural event considerations
    culturalEventConsiderations: [
      { name: 'Ashura', nameArabic: 'عاشوراء', duration: 1, impact: 'reduced-activity', approximate: new Date('2025-08-05') },
      { name: 'Arbaeen', nameArabic: 'الأربعين', duration: 1, impact: 'pilgrimage-travel', approximate: new Date('2025-09-14') }
    ],
    
    // Government holiday exclusions
    governmentHolidayExclusions: [
      { name: 'Iraqi Independence Day', nameArabic: 'يوم الاستقلال العراقي', date: new Date('2025-10-03') },
      { name: 'Iraqi National Day', nameArabic: 'اليوم الوطني العراقي', date: new Date('2025-07-14') }
    ]
  };
  
  console.log('✅ Prayer time-aware timeline configured:');
  console.log(`   Project Duration: ${timeline.duration} days`);
  console.log(`   Prayer Time Buffers: ${timeline.prayerTimeBuffers.length} prayer times`);
  console.log(`   Ramadan Adjustments: ${timeline.ramadanAdjustments.length} periods`);
  console.log(`   Islamic Holidays: ${timeline.islamicHolidayExclusions.length} holidays`);
  console.log(`   Cultural Events: ${timeline.culturalEventConsiderations.length} events`);
  
  return timeline;
}

// ============================================================================
// ISLAMIC COMPLIANCE VALIDATION
// ============================================================================

async function demonstrateIslamicCompliance(project: any, projectEngine: IraqiProjectManagementEngine) {
  console.log('🕌 Demonstrating Islamic compliance validation...');
  
  // Validate project Islamic compliance
  const islamicCompliance = await projectEngine.validateProjectIslamically(project.id);
  
  console.log('Islamic Compliance Results:');
  console.log(`   Overall Compliance: ${islamicCompliance.compliant ? '✅ Compliant' : '❌ Non-Compliant'}`);
  console.log(`   Compliance Score: ${islamicCompliance.score * 100}%`);
  console.log(`   Content Halal: ${islamicCompliance.contentHalal ? '✅' : '❌'}`);
  console.log(`   Respectful Language: ${islamicCompliance.respectfulLanguage ? '✅' : '❌'}`);
  console.log(`   Appropriate Timing: ${islamicCompliance.appropriateTiming ? '✅' : '❌'}`);
  console.log(`   Family Friendly: ${islamicCompliance.familyFriendly ? '✅' : '❌'}`);
  console.log(`   Prayer Time Respect: ${islamicCompliance.prayerTimeRespect ? '✅' : '❌'}`);
  console.log(`   Ramadan Sensitive: ${islamicCompliance.ramadanSensitive ? '✅' : '❌'}`);
  
  // Conduct Shura consultation for important decision
  const shuraConsultation = await projectEngine.conductShuraConsultation(
    project.id,
    {
      consultationType: 'project-approval',
      participants: [
        {
          id: 'scholar-001',
          name: 'Dr. Ahmad Al-Baghdadi',
          nameArabic: 'د. أحمد البغدادي',
          expertise: ['islamic-ethics', 'medical-ethics', 'community-welfare'],
          institutionalAffiliation: 'Iraqi Council of Islamic Scholars',
          scholarlyRank: 'senior-scholar'
        },
        {
          id: 'scholar-002', 
          name: 'Sheikh Mohammed Al-Najafi',
          nameArabic: 'الشيخ محمد النجفي',
          expertise: ['social-welfare', 'public-policy', 'islamic-governance'],
          institutionalAffiliation: 'Najaf Religious Seminary',
          scholarlyRank: 'jurisprudence-expert'
        }
      ],
      consultationTopics: [
        'Healthcare digitization from Islamic perspective',
        'Patient privacy and Islamic principles',
        'Community welfare and accessibility',
        'Resource allocation and social justice',
        'Technology usage within Islamic framework'
      ],
      consultationTopicsArabic: [
        'رقمنة الرعاية الصحية من المنظور الإسلامي',
        'خصوصية المرضى والمبادئ الإسلامية',
        'رفاهية المجتمع وإمكانية الوصول',
        'تخصيص الموارد والعدالة الاجتماعية',
        'استخدام التكنولوجيا ضمن الإطار الإسلامي'
      ],
      decisionRequired: 'project-approval',
      consensusRequired: true,
      timeframe: 7, // 7 days for consultation
      culturalContext: {
        projectType: 'public-health',
        citizenImpact: 'high',
        communityBenefit: 'significant',
        islamicRelevance: 'moderate'
      }
    }
  );
  
  console.log('✅ Shura Consultation Results:');
  console.log(`   Consultation Conducted: ${shuraConsultation.conducted ? '✅ Yes' : '❌ No'}`);
  console.log(`   Decision: ${shuraConsultation.decision}`);
  console.log(`   Consensus Reached: ${shuraConsultation.consensusReached ? '✅ Yes' : '❌ No'}`);
  console.log(`   Participants: ${shuraConsultation.participants.length} scholars`);
  console.log(`   Duration: ${shuraConsultation.duration} minutes`);
  console.log(`   Decision Reasoning: ${shuraConsultation.decisionReasoning}`);
  console.log(`   Arabic Reasoning: ${shuraConsultation.decisionReasoningArabic}`);
  
  return { islamicCompliance, shuraConsultation };
}

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

async function demonstratePerformanceMonitoring(projectEngine: IraqiProjectManagementEngine) {
  console.log('📊 Demonstrating performance monitoring...');
  
  // Get system performance metrics
  const systemPerformance = await projectEngine.getSystemPerformance();
  
  console.log('System Performance Metrics:');
  console.log(`   System Status: ${systemPerformance.systemStatus}`);
  console.log(`   Active Projects: ${systemPerformance.projectStatistics.totalProjects}`);
  console.log(`   Cultural Compliance Rate: ${systemPerformance.culturalMetrics.complianceScore * 100}%`);
  console.log(`   Islamic Compliance Rate: ${systemPerformance.culturalMetrics.islamicComplianceRate * 100}%`);
  console.log(`   System Health: ${systemPerformance.systemHealth.status}`);
  console.log(`   CPU Usage: ${systemPerformance.systemHealth.cpuUsage}%`);
  console.log(`   Memory Usage: ${systemPerformance.systemHealth.memoryUsage}%`);
  console.log(`   Active Connections: ${systemPerformance.systemHealth.activeConnections}`);
  
  // Optimize system performance
  const optimizationResult = await projectEngine.optimizePerformance();
  
  console.log('✅ Performance Optimization Results:');
  console.log(`   Success: ${optimizationResult.success ? '✅ Yes' : '❌ No'}`);
  console.log(`   Optimization Time: ${optimizationResult.optimizationTime}ms`);
  console.log(`   Performance Gain: ${optimizationResult.performanceGain * 100}%`);
  console.log(`   Improvements Applied: ${optimizationResult.improvementsApplied.join(', ')}`);
  
  return { systemPerformance, optimizationResult };
}

// ============================================================================
// MAIN DEMO EXECUTION
// ============================================================================

async function runCompleteDemo() {
  console.log('🚀 Starting Iraqi Advanced Project Management Demo...\n');
  
  try {
    // 1. Setup project management system
    const projectEngine = await setupProjectManagementSystem();
    console.log('\n' + '='.repeat(60) + '\n');
    
    // 2. Create basic project
    const project = await createBasicProject(projectEngine);
    console.log('\n' + '='.repeat(60) + '\n');
    
    // 3. Setup ministry coordination
    const { coordinationManager, coordination } = await setupMinistryCoordination(project);
    console.log('\n' + '='.repeat(60) + '\n');
    
    // 4. Setup Arabic version control
    const { versionControl, document } = await setupArabicVersionControl();
    console.log('\n' + '='.repeat(60) + '\n');
    
    // 5. Configure prayer time-aware scheduling
    const timeline = await setupPrayerAwareScheduling(project);
    console.log('\n' + '='.repeat(60) + '\n');
    
    // 6. Demonstrate Islamic compliance validation
    const { islamicCompliance, shuraConsultation } = await demonstrateIslamicCompliance(project, projectEngine);
    console.log('\n' + '='.repeat(60) + '\n');
    
    // 7. Show performance monitoring
    const { systemPerformance, optimizationResult } = await demonstratePerformanceMonitoring(projectEngine);
    console.log('\n' + '='.repeat(60) + '\n');
    
    console.log('🎉 Demo completed successfully!');
    console.log('\nDemo Summary:');
    console.log(`   ✅ Project Created: ${project.title}`);
    console.log(`   ✅ Multi-Ministry Coordination: ${coordination.participatingMinistries.length} ministries`);
    console.log(`   ✅ Arabic Document: ${document.title} (v${document.version})`);
    console.log(`   ✅ Prayer-Aware Timeline: ${timeline.duration} days with ${timeline.islamicHolidayExclusions.length} Islamic holidays`);
    console.log(`   ✅ Islamic Compliance: ${islamicCompliance.score * 100}% score`);
    console.log(`   ✅ Shura Consultation: ${shuraConsultation.decision} decision`);
    console.log(`   ✅ Performance Optimization: ${optimizationResult.performanceGain * 100}% improvement`);
    
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
    console.error(error.stack);
  }
}

// Export for use in other modules
export {
  setupProjectManagementSystem,
  createBasicProject,
  setupMinistryCoordination,
  setupArabicVersionControl,
  setupPrayerAwareScheduling,
  demonstrateIslamicCompliance,
  demonstratePerformanceMonitoring,
  runCompleteDemo
};

// Run demo if this file is executed directly
if (require.main === module) {
  runCompleteDemo().then(() => {
    console.log('\n🏁 Demo execution completed');
    process.exit(0);
  }).catch((error) => {
    console.error('\n💥 Demo execution failed:', error.message);
    process.exit(1);
  });
}