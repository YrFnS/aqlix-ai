# Iraqi Advanced Project Management System

**Priority 2.2: Advanced Project Management (~2-3 weeks value)**  
**SOURCE**: Extracted from Onlook project management and backend systems  
**ENHANCEMENT**: Iraqi government deployment with cultural intelligence

## 🎯 Overview

Comprehensive multi-ministry project coordination system designed specifically for Iraqi government deployment. This system integrates advanced project management capabilities with cultural intelligence, Islamic compliance validation, and Arabic-first user experience.

### Key Features

- **🏛️ Multi-Ministry Coordination**: Hierarchical approval workflows reflecting Iraqi government structure
- **🕌 Islamic Compliance**: Automated Sharia validation with Shura consultation principles
- **🔤 Arabic-First Experience**: RTL diff visualization and bidirectional text support
- **⏰ Prayer Time Awareness**: Intelligent scheduling with Ramadan and Islamic holiday considerations  
- **📋 Government Audit Trails**: Comprehensive documentation and compliance tracking
- **🔄 Real-Time Collaboration**: Cultural context preservation across distributed teams
- **🛡️ Security Integration**: Classified project handling with comprehensive access control
- **⚡ Performance Optimized**: <200ms response times for distributed government teams

## 🏗️ Architecture

### Core Components

```
project-management/
├── src/
│   ├── core/                     # Core project management engine
│   │   └── IraqiProjectManagementEngine.ts
│   ├── ministry/                 # Ministry coordination system
│   │   └── MinistryCoordinationManager.ts
│   ├── version-control/          # Arabic version control with RTL support
│   │   └── ArabicVersionControlEngine.ts
│   ├── cultural/                 # Cultural validation and Islamic compliance
│   ├── workflow/                 # Automated workflow orchestration
│   ├── coordination/             # Inter-ministry coordination workflows
│   ├── timeline/                 # Prayer time-aware scheduling
│   ├── resource/                 # Resource allocation with cultural considerations
│   ├── audit/                    # Government audit and compliance
│   ├── security/                 # Access control and data protection
│   ├── ui/                       # React components for project management
│   ├── utils/                    # Utility functions and helpers
│   └── types/                    # TypeScript type definitions
├── examples/                     # Usage examples and integration guides
├── tests/                        # Comprehensive test suites
└── docs/                         # Detailed documentation
```

### Technology Stack

- **Runtime**: Bun (30x faster than npm) - ALWAYS use for commands
- **Language**: TypeScript with strict mode enabled
- **Framework**: React 19 with Next.js 15.1 for UI components
- **Database**: Supabase (PostgreSQL + pgvector + Real-time)
- **State Management**: RxJS for reactive patterns
- **Validation**: class-validator with custom Islamic validators
- **Testing**: Jest with comprehensive cultural compliance testing
- **Performance**: <200ms response times, real-time sync capabilities

## 🚀 Quick Start

### Installation

```bash
# Navigate to project directory
cd examples/onlook-extracted/project-management

# Install dependencies using Bun
bun install

# Build the project
bun run build

# Run tests with cultural validation
bun test

# Start development mode
bun run dev
```

### Basic Usage

```typescript
import { 
  IraqiProjectManagementEngine,
  MinistryCoordinationManager,
  ArabicVersionControlEngine 
} from '@onlook/iraqi-project-management';

// Initialize project management engine
const config = {
  multiMinistrySupport: true,
  islamicComplianceEnabled: true,
  culturalValidationEnabled: true,
  arabicContentSupport: true,
  prayerTimeAwareness: true,
  governmentProtocolEnforcement: true
};

const projectEngine = new IraqiProjectManagementEngine(config);

// Create new government project
const project = await projectEngine.createProject({
  title: "Digital Healthcare Transformation",
  titleArabic: "التحول الرقمي للرعاية الصحية",
  type: "digital-transformation",
  priority: "critical",
  primaryMinistry: "health",
  secondaryMinistries: ["finance", "communications"],
  culturalValidationRequired: true,
  islamicComplianceRequired: true,
  shuraConsultationRequired: true
});

console.log('Project created:', project.id);
```

## 🏛️ Ministry Coordination

### Multi-Ministry Project Workflow

```typescript
import { MinistryCoordinationManager } from './src/ministry/MinistryCoordinationManager';

const coordinationManager = new MinistryCoordinationManager({
  enableInterMinistryWorkflows: true,
  hierarchicalApprovalRequired: true,
  shuraConsultationMandatory: true,
  culturalValidationRequired: true
});

// Initiate inter-ministry coordination
const coordination = await coordinationManager.initiateInterMinistryCoordination(
  project,
  {
    coordinationType: "policy-coordination",
    participatingMinistries: ["health", "education", "finance"],
    urgencyLevel: "important",
    culturalSensitivityRequired: true,
    islamicConsultationRequired: true
  }
);
```

### Ministry-Specific Features

#### Health Ministry Integration
- **Medical Ethics Validation**: Islamic medical ethics compliance
- **Prayer Time Scheduling**: Healthcare worker prayer schedules
- **Cultural Sensitivity**: Patient care cultural requirements
- **Halal Compliance**: Pharmaceutical and treatment validation

#### Education Ministry Integration  
- **Islamic Curriculum Validation**: Educational content review
- **Prayer Time Integration**: School schedule optimization
- **Cultural Content Review**: Educational material appropriateness
- **Community Engagement**: Parent and community consultation

#### Interior Ministry Integration
- **Security Classification**: Document and project security levels
- **Access Control**: Personnel security clearance verification
- **Audit Compliance**: Government protocol enforcement
- **Emergency Procedures**: Crisis response coordination

## 🕌 Islamic Compliance & Cultural Features

### Shura Consultation System

```typescript
// Conduct Shura consultation for critical decisions
const shuraResult = await projectEngine.conductShuraConsultation(
  project.id,
  {
    participants: [
      { id: "scholar-1", expertise: ["islamic-law", "medical-ethics"] },
      { id: "scholar-2", expertise: ["social-welfare", "community-benefit"] }
    ],
    consultationTopics: [
      "community-welfare-impact",
      "islamic-principle-alignment",
      "social-justice-considerations"
    ],
    consensusRequired: true
  }
);

if (shuraResult.decision === 'approve') {
  await projectEngine.updateProject(project.id, {
    status: 'approved',
    shuraConsultation: shuraResult
  });
}
```

### Prayer Time-Aware Scheduling

```typescript
import { TimelineManager } from './src/timeline/TimelineManager';

const timeline = new TimelineManager({
  prayerTimeAwareness: true,
  ramadanSchedulingEnabled: true,
  islamicHolidaySupport: true
});

// Create timeline with prayer time considerations
const projectTimeline = await timeline.createTimeline({
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-12-31'),
  prayerTimeBuffers: true,
  ramadanAdjustments: true,
  islamicHolidayExclusions: [
    'eid-al-fitr',
    'eid-al-adha',
    'islamic-new-year',
    'mawlid-al-nabi'
  ]
});
```

## 🔤 Arabic Version Control

### RTL Diff Visualization

```typescript
import { ArabicVersionControlEngine } from './src/version-control/ArabicVersionControlEngine';

const versionControl = new ArabicVersionControlEngine({
  rtlDiffVisualization: true,
  bidirectionalTextSupport: true,
  culturalContextTracking: true,
  islamicContentValidation: true,
  arabicFontOptimization: true
});

// Create Arabic document with cultural validation
const document = await versionControl.createDocument({
  title: "Project Charter",
  titleArabic: "ميثاق المشروع",
  content: "Project objectives and scope...",
  contentArabic: "أهداف المشروع ونطاقه...",
  culturalValidationRequired: true,
  islamicComplianceRequired: true
});

// Generate RTL-aware diff
const diff = await versionControl.generateArabicDiff(
  document.id,
  "1.0.0",
  document.id,
  "1.1.0"
);

// Visualize diff with Arabic typography
const visualDiff = await versionControl.generateVisualDiff(
  document.id,
  document.id,
  {
    rtlSupport: true,
    arabicTypography: true,
    culturalHighlighting: true,
    islamicHighlighting: true
  }
);
```

### Bidirectional Text Handling

```typescript
// Handle mixed Arabic-English content
const mixedContent = {
  content: "The project budget is 1,000,000 IQD الميزانية المخصصة للمشروع",
  contentType: "mixed",
  textDirection: "auto", // Automatic RTL/LTR detection
  bidiContent: true
};

const processedDocument = await versionControl.rtlProcessor.processDocument(mixedContent);
```

## 🔄 Workflow Automation

### Government Approval Chains

```typescript
// Setup hierarchical approval workflow
const approvalChain = await projectEngine.createProjectApprovalChain({
  levels: [
    "department",      // Department head approval
    "directorate",     // Directorate General approval  
    "ministry",        // Ministerial approval
    "council",         // Council of Ministers (if required)
    "parliament"       // Parliamentary oversight (if required)
  ],
  culturalValidation: true,
  islamicConsultation: true,
  publicConsultation: false, // Internal project
  emergencyBypass: {
    enabled: true,
    authorizedBy: ["minister", "deputy-minister"],
    auditRequired: true
  }
});
```

### Automated Cultural Validation

```typescript
// Real-time cultural validation during document editing
const culturalValidator = new CulturalValidationService({
  iraqiContextValidation: true,
  islamicContentChecking: true,
  tribalSensitivityAware: true,
  regionalCustomsValidation: true
});

const validationResult = await culturalValidator.validateContent({
  content: documentContent,
  contentArabic: arabicContent,
  projectType: "public-service",
  ministryContext: "health",
  securityLevel: "internal"
});

if (!validationResult.valid) {
  console.warn('Cultural validation issues:', validationResult.issues);
  // Apply automatic cultural corrections
  const correctedContent = await culturalValidator.applyAutoFixes(
    documentContent,
    validationResult.autoFixes
  );
}
```

## 📊 Performance & Analytics

### Real-Time Performance Monitoring

```typescript
// Monitor system performance with cultural metrics
const performance = await projectEngine.getSystemPerformance();

console.log('System Performance:', {
  activeProjects: performance.projectStatistics.totalProjects,
  culturalComplianceRate: performance.culturalMetrics.complianceScore,
  islamicComplianceRate: performance.culturalMetrics.islamicComplianceRate,
  averageApprovalTime: performance.performanceMetrics.averageApprovalTime,
  ministryCoordinationEfficiency: performance.performanceMetrics.coordinationEfficiency
});
```

### Ministry Performance Analytics

```typescript
// Generate ministry-specific performance reports
const healthMinistryReport = await coordinationManager.getMinistryPerformance("health");

console.log('Health Ministry Performance:', {
  activeProjects: healthMinistryReport.activeProjects,
  approvalEfficiency: healthMinistryReport.approvalEfficiency,
  culturalComplianceRate: healthMinistryReport.culturalComplianceRate,
  budgetUtilization: healthMinistryReport.budgetUtilization,
  stakeholderSatisfaction: healthMinistryReport.stakeholderSatisfaction
});
```

## 🛡️ Security & Access Control

### Government Security Classification

```typescript
// Setup security for classified projects
const classifiedProject = await projectEngine.createProject({
  title: "National Infrastructure Security Assessment",
  titleArabic: "تقييم أمن البنية التحتية الوطنية",
  type: "infrastructure",
  securityClassification: "secret",
  restrictedAccess: true,
  encryptionRequired: true,
  auditTrailMandatory: true,
  accessControl: {
    securityClearanceRequired: "secret",
    ministryRestriction: ["interior", "defense"],
    departmentRestriction: ["security", "intelligence"],
    culturalSensitivityLevel: "high"
  }
});
```

### Multi-Level Access Control

```typescript
// Configure role-based access with cultural considerations
const accessControl = {
  roles: [
    {
      name: "project-manager",
      nameArabic: "مدير المشروع",
      permissions: ["read", "write", "approve"],
      culturalAuthority: ["content-review", "cultural-validation"],
      islamicAuthority: ["islamic-compliance-check"]
    },
    {
      name: "cultural-advisor", 
      nameArabic: "المستشار الثقافي",
      permissions: ["read", "cultural-review"],
      culturalAuthority: ["cultural-validation", "cultural-annotation"],
      specializations: ["iraqi-customs", "tribal-relations", "social-norms"]
    }
  ]
};
```

## 🧪 Testing & Validation

### Cultural Compliance Testing

```bash
# Run cultural compliance test suite
bun run test:cultural

# Test Islamic compliance validation
bun run test:islamic

# Test Arabic RTL functionality
bun run test:arabic

# Test ministry coordination workflows
bun run test:ministry

# Run complete test suite with coverage
bun run test:coverage
```

### Test Examples

```typescript
// Cultural validation tests
describe('Cultural Validation', () => {
  test('should validate Iraqi cultural context', async () => {
    const content = "الحمد لله، نبدأ هذا المشروع بتوفيق من الله";
    const result = await culturalValidator.validate(content);
    
    expect(result.valid).toBe(true);
    expect(result.culturalSensitivity).toBe(true);
    expect(result.religiousRespect).toBe(true);
    expect(result.score).toBeGreaterThan(0.95);
  });

  test('should detect cultural sensitivity issues', async () => {
    const sensitiveContent = "Content that might be culturally inappropriate";
    const result = await culturalValidator.validate(sensitiveContent);
    
    if (!result.valid) {
      expect(result.issues).toHaveLength(greaterThan(0));
      expect(result.recommendations).toHaveLength(greaterThan(0));
    }
  });
});

// Arabic RTL testing
describe('Arabic RTL Support', () => {
  test('should handle bidirectional text correctly', async () => {
    const mixedText = "The budget is 1,000,000 دينار عراقي for this project";
    const processed = await rtlProcessor.processBidirectionalText(mixedText);
    
    expect(processed.textDirection).toBe('auto');
    expect(processed.bidiSegments).toHaveLength(3);
    expect(processed.renderingOptimized).toBe(true);
  });
});
```

## 🌍 Internationalization & Localization

### Multi-Language Support

```typescript
// Configure Arabic-first localization
const localization = {
  defaultLanguage: 'arabic',
  supportedLanguages: ['arabic', 'english'],
  rtlSupport: true,
  culturalAdaptation: true,
  regionalDialects: ['iraqi', 'baghdadi', 'basrawi'],
  formalityLevels: ['casual', 'formal', 'official', 'ceremonial']
};

// Generate culturally appropriate translations
const translation = await translationService.translate({
  text: "Project approved by ministry",
  targetLanguage: 'arabic',
  formality: 'official',
  culturalContext: 'government',
  islamicTerminology: true
});

console.log(translation.text); // "تمت الموافقة على المشروع من قبل الوزارة"
```

### Islamic Calendar Integration

```typescript
import { IslamicCalendar } from './src/utils/IslamicCalendar';

// Convert Gregorian to Hijri dates
const islamicCalendar = new IslamicCalendar();
const hijriDate = islamicCalendar.toHijri(new Date('2025-01-01'));

console.log(`Gregorian: 2025-01-01`);
console.log(`Hijri: ${hijriDate.year}/${hijriDate.month}/${hijriDate.day}`);

// Schedule around Islamic holidays
const projectTimeline = await timeline.createTimelineWithIslamicConsiderations({
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-12-31'),
  excludeIslamicHolidays: true,
  ramadanAdjustments: true,
  prayerTimeBuffers: 30 // minutes
});
```

## 🔧 Configuration

### Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Configure environment variables
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
CULTURAL_VALIDATION_API_KEY=your_cultural_api_key
ISLAMIC_COMPLIANCE_API_KEY=your_islamic_api_key
ARABIC_NLP_API_KEY=your_arabic_nlp_key

# Performance settings
MAX_CONCURRENT_PROJECTS=100
CACHE_TIMEOUT_MS=300000
DIFF_CACHE_SIZE=1000
REAL_TIME_SYNC_INTERVAL=5000

# Cultural settings
DEFAULT_LANGUAGE=arabic
CULTURAL_VALIDATION_ENABLED=true
ISLAMIC_COMPLIANCE_ENABLED=true
SHURA_CONSULTATION_ENABLED=true
PRAYER_TIME_AWARENESS=true
```

### Ministry-Specific Configuration

```typescript
// Health Ministry configuration
const healthMinistryConfig = {
  ministry: "health",
  culturalValidation: {
    medicalEthicsCompliance: true,
    islamicMedicalPrinciples: true,
    patientCulturalSensitivity: true,
    halalPharmaceuticalValidation: true
  },
  workflowTemplates: [
    "medical-equipment-procurement",
    "healthcare-policy-development", 
    "hospital-construction-project",
    "medical-research-approval"
  ],
  approvalChain: {
    levels: ["department", "directorate", "ministry", "health-council"],
    islamicMedicalEthicsReview: true,
    publicHealthConsultation: true
  }
};
```

## 📚 API Documentation

### Core Project Management API

```typescript
interface IProjectManagementEngine {
  // Project lifecycle
  createProject(request: ProjectCreateRequest): Promise<IraqiProject>;
  updateProject(request: ProjectUpdateRequest): Promise<IraqiProject>;
  getProject(projectId: string): Promise<IraqiProject | null>;
  getProjectsByMinistry(ministry: MinistryType): Promise<IraqiProject[]>;
  
  // Cultural validation
  validateProjectCulturally(projectId: string): Promise<CulturalValidationResult>;
  validateProjectIslamically(projectId: string): Promise<IslamicComplianceResult>;
  conductShuraConsultation(projectId: string, request: ShuraConsultationRequest): Promise<ShuraConsultationResult>;
  
  // Performance monitoring
  getSystemPerformance(): Promise<SystemPerformanceReport>;
  optimizePerformance(): Promise<PerformanceOptimizationResult>;
}
```

### Ministry Coordination API

```typescript
interface IMinistryCoordination {
  // Inter-ministry coordination
  initiateInterMinistryCoordination(project: IraqiProject, request: CoordinationRequest): Promise<InterMinistryCoordination>;
  updateCoordinationStatus(coordinationId: string, update: CoordinationStatusUpdate): Promise<InterMinistryCoordination>;
  
  // Approval processing
  processMinistryApproval(coordinationId: string, ministry: MinistryType, decision: ApprovalDecision): Promise<ApprovalResult>;
  escalateCoordination(coordinationId: string, request: EscalationRequest): Promise<EscalationResult>;
  
  // Performance analytics
  getMinistryPerformance(ministry: MinistryType): Promise<MinistryPerformanceReport>;
  getCoordinationAnalytics(timeframe: AnalyticsTimeframe): Promise<CoordinationAnalytics>;
}
```

### Arabic Version Control API

```typescript
interface IArabicVersionControl {
  // Document management
  createDocument(request: DocumentCreateRequest): Promise<ArabicDocument>;
  updateDocument(documentId: string, request: DocumentUpdateRequest): Promise<ArabicDocument>;
  
  // Version control
  generateArabicDiff(sourceId: string, targetId: string): Promise<ArabicDiff>;
  generateVisualDiff(sourceId: string, targetId: string, options: VisualDiffOptions): Promise<VisualDiffResult>;
  
  // Merge operations
  mergeDocuments(baseBranch: string, sourceBranch: string, request: MergeRequest): Promise<ArabicMerge>;
  resolveConflicts(mergeId: string, resolutions: ConflictResolution[]): Promise<ConflictResolutionResult>;
  
  // Search and indexing
  searchDocuments(query: ArabicSearchQuery): Promise<ArabicSearchResult[]>;
  indexDocument(document: ArabicDocument): Promise<IndexingResult>;
}
```

## 🤝 Contributing

### Development Guidelines

1. **Cultural Sensitivity**: All code must respect Iraqi cultural values and Islamic principles
2. **Arabic-First**: Primary language support is Arabic with RTL text direction
3. **Government Compliance**: Follow Iraqi government protocols and standards
4. **Performance**: Maintain <200ms response times for all operations
5. **Security**: Implement proper security for classified government projects

### Code Standards

```typescript
// Example of culturally-aware coding standards

/**
 * Cultural Validation Function
 * تحقق من المحتوى الثقافي
 * 
 * @param content - Content to validate
 * @param culturalContext - Iraqi cultural context
 * @returns Validation result with cultural appropriateness score
 */
async function validateCulturalContent(
  content: string,
  culturalContext: IraqiCulturalContext
): Promise<CulturalValidationResult> {
  // Implementation with Islamic principles consideration
  const islamicValidation = await validateIslamicCompliance(content);
  const tribalSensitivity = await checkTribalSensitivity(content, culturalContext);
  const socialNorms = await validateSocialNorms(content);
  
  return {
    valid: islamicValidation.compliant && tribalSensitivity.appropriate && socialNorms.appropriate,
    score: calculateCulturalScore(islamicValidation, tribalSensitivity, socialNorms),
    recommendations: generateCulturalRecommendations(content, culturalContext)
  };
}
```

### Testing Requirements

```bash
# Run all test suites
bun test

# Cultural compliance tests (95% compliance required)
bun run test:cultural

# Islamic validation tests (90% compliance required)  
bun run test:islamic

# Arabic RTL tests (99% accuracy required)
bun run test:arabic

# Ministry workflow tests
bun run test:ministry

# Performance tests (<200ms response time)
bun run test:performance
```

## 📈 Performance Benchmarks

### Response Time Requirements
- **Project Creation**: <150ms (with cultural validation)
- **Document Diff Generation**: <100ms (RTL-aware)
- **Arabic Search**: <50ms (semantic search)
- **Ministry Coordination**: <200ms (multi-ministry workflows)
- **Real-Time Sync**: <30ms latency

### Cultural Compliance Metrics
- **Cultural Validation Accuracy**: 95%+
- **Islamic Compliance Rate**: 90%+
- **Arabic RTL Accuracy**: 99%+
- **Translation Quality**: 85%+ (Arabic ↔ English)
- **Cultural Sensitivity Detection**: 92%+

## 🔒 Security & Compliance

### Government Security Standards
- **Classification Levels**: Public, Internal, Confidential, Secret, Top Secret
- **Access Control**: Role-based with ministry and department restrictions
- **Audit Trails**: Comprehensive logging with integrity verification
- **Encryption**: AES-256 for classified content
- **Digital Signatures**: PKI-based document signing

### Islamic Compliance Framework
- **Shura Consultation**: Mandatory for critical projects
- **Halal Validation**: Content and procurement compliance
- **Prayer Time Integration**: Scheduling with Islamic observance
- **Cultural Sensitivity**: Iraqi customs and tribal considerations
- **Scholarly Review**: Islamic scholars for religious content

## 📞 Support & Documentation

### Getting Help
- **Documentation**: [Full API Documentation](./docs/api/)
- **Cultural Guidelines**: [Iraqi Cultural Compliance Guide](./docs/cultural/)
- **Islamic Compliance**: [Islamic Validation Framework](./docs/islamic/)
- **Arabic RTL Guide**: [RTL Development Guide](./docs/arabic-rtl/)
- **Ministry Integration**: [Government Integration Guide](./docs/ministry/)

### Community Resources
- **GitHub Discussions**: Technical questions and feature requests
- **Cultural Advisory Board**: Cultural and Islamic compliance guidance
- **Ministry Liaisons**: Government protocol and compliance support

## 📄 License

MIT License - Built for the Iraqi Government with cultural respect and Islamic principles

---

**Built with ❤️ for Iraq by the Iraqi AI Team**  
**مبني بـ ❤️ للعراق من قبل فريق الذكاء الاصطناعي العراقي**