# Iraqi AI Multi-Workspace Management System
**Enhanced chatbot-ui extraction with Iraqi cultural compliance and professional domain support**

## Overview

This comprehensive workspace management system is extracted and enhanced from chatbot-ui, specifically designed for Iraqi AI applications. It provides multi-workspace functionality with deep cultural integration, Arabic-first design, and support for Iraqi professional domains including legal, medical, educational, business, and engineering sectors.

## Key Features

### 🏛️ Iraqi Professional Domain Support
- **Legal Workspaces**: Iraqi civil law, Islamic jurisprudence, court procedures
- **Medical Workspaces**: Islamic medical ethics, patient privacy, halal medication guidelines
- **Educational Workspaces**: Islamic education principles, Arabic language preservation
- **Business Workspaces**: Halal business practices, Islamic finance compliance
- **Engineering Workspaces**: Iraqi building codes, environmental compliance

### 🌍 Arabic-First Design
- **RTL Layout Support**: Native right-to-left text rendering
- **Iraqi Dialect Recognition**: Baghdad, Basra, Mosul, and general Arabic
- **Mixed Content Handling**: Seamless Arabic-English content switching
- **Cultural Typography**: Proper Arabic font rendering and text direction

### ☪️ Cultural Compliance
- **Islamic Compliance Scoring**: Real-time cultural appropriateness validation
- **Prayer Time Integration**: Automated prayer time reminders
- **Halal Content Filtering**: Content validation for Islamic values
- **Political Neutrality**: Sectarian and political content filtering

### 👥 Advanced Workspace Management
- **Workspace Isolation**: Complete data separation between workspaces
- **Role-Based Permissions**: Owner, admin, editor, viewer, guest roles
- **Professional Templates**: Pre-configured templates for Iraqi domains
- **Cultural Settings**: Customizable compliance levels per workspace

## File Structure

```
examples/chatbot-ui-workspace-extracted/
├── services/
│   ├── workspace-manager.ts         # Core workspace management service
│   └── file-manager.ts             # File upload with workspace isolation
├── components/
│   ├── WorkspaceSettings.tsx       # Cultural compliance settings UI
│   ├── ProfessionalWorkspaceTemplates.tsx  # Iraqi professional templates
│   └── ArabicWorkspaceOrganizer.tsx # Arabic-first workspace organization
├── utils/
│   └── workspace-routing.ts        # Iraqi locale routing (/ar/ws_123/chat)
├── hooks/
│   └── useWorkspace.ts             # React hooks for workspace management
├── types/
│   └── index.ts                    # TypeScript definitions
└── config/
    ├── professional-domains.json   # Iraqi professional domain settings
    ├── cultural-compliance.json    # Islamic compliance rules
    └── arabic-localization.json    # Arabic translations
```

## Quick Start

### 1. Installation

```bash
# Install dependencies
bun install

# Set up Redis for workspace data
docker run -d -p 6379:6379 redis:alpine

# Configure environment variables
cp .env.example .env
```

### 2. Environment Configuration

```env
# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# Iraqi Cultural Services
CULTURAL_VALIDATION_API_URL=http://localhost:8001
ARABIC_PROCESSING_API_URL=http://localhost:8002

# Professional Domain Settings
ENABLE_PROFESSIONAL_VERIFICATION=true
REQUIRE_IRAQI_COMPLIANCE=true

# File Storage
FILE_STORAGE_PATH=/app/storage/workspaces
MAX_FILE_SIZE_MB=500
ALLOWED_FILE_TYPES=pdf,doc,docx,txt,rtf,jpg,png

# Payment Gateways (for premium features)
ZAINCASH_API_KEY=your_zaincash_key
FASTPAY_MERCHANT_ID=your_fastpay_id
NASSWALLET_CLIENT_ID=your_nasswallet_id
```

### 3. Basic Usage

```typescript
import { IraqiWorkspaceManager } from './services/workspace-manager';
import { IraqiWorkspaceFileManager } from './services/file-manager';

// Initialize workspace manager
const workspaceManager = new IraqiWorkspaceManager(process.env.REDIS_URL!);

// Create a legal workspace
const legalWorkspace = await workspaceManager.createWorkspace('user_123', {
  name: 'Al-Adala Law Firm',
  nameAr: 'مكتب العدالة للمحاماة',
  type: 'legal',
  visibility: 'organization',
  culturalSettings: {
    enableIslamicCompliance: true,
    strictnessLevel: 'strict',
    prayerTimeReminders: true,
    halalContentFilter: true,
    politicalNeutralityMode: true,
    sectarianContentFilter: true,
    culturalSensitivityLevel: 'maximum'
  },
  arabicSupport: true,
  dialectPreference: 'baghdad',
  professionalLicenseNumber: 'LAW-BGD-2024-001',
  complianceRequirements: [
    'islamic-jurisprudence',
    'iraqi-civil-law',
    'professional-ethics'
  ],
  specializations: [
    'civil-law',
    'commercial-law',
    'family-law'
  ]
});

console.log('Workspace created:', legalWorkspace.id);
```

### 4. React Component Integration

```tsx
import WorkspaceSettings from './components/WorkspaceSettings';
import ProfessionalWorkspaceTemplates from './components/ProfessionalWorkspaceTemplates';
import ArabicWorkspaceOrganizer from './components/ArabicWorkspaceOrganizer';

function App() {
  return (
    <div className="min-h-screen" dir="rtl">
      {/* Arabic-first workspace organizer */}
      <ArabicWorkspaceOrganizer
        workspaces={workspaces}
        onWorkspaceSelect={handleWorkspaceSelect}
        onCreateWorkspace={handleCreateWorkspace}
        locale="ar"
        userRole="owner"
      />
      
      {/* Professional templates for Iraqi domains */}
      <ProfessionalWorkspaceTemplates
        onSelectTemplate={handleTemplateSelect}
        locale="ar"
        userType="organization"
      />
      
      {/* Cultural compliance settings */}
      <WorkspaceSettings
        workspaceId="ws_123"
        settings={currentSettings}
        onSave={handleSettingsSave}
        locale="ar"
        userRole="owner"
      />
    </div>
  );
}
```

## API Reference

### Workspace Management

#### Create Workspace
```typescript
await workspaceManager.createWorkspace(ownerId: string, workspaceData: {
  name: string;
  nameAr: string;
  type: ProfessionalDomain;
  visibility: WorkspaceVisibility;
  culturalSettings: IraqiCulturalSettings;
  arabicSupport: boolean;
  dialectPreference: IraqiDialect;
  // ... additional settings
});
```

#### Get Workspace
```typescript
const workspace = await workspaceManager.getWorkspace(workspaceId: string);
```

#### Update Workspace Settings
```typescript
await workspaceManager.updateWorkspace(
  workspaceId: string,
  updates: Partial<IraqiWorkspace>,
  userId: string
);
```

### File Management

#### Upload File with Cultural Validation
```typescript
const fileManager = new IraqiWorkspaceFileManager(redisUrl);

const fileMetadata = await fileManager.uploadFile({
  workspaceId: 'ws_123',
  uploaderId: 'user_123',
  originalName: 'legal-document.pdf',
  originalNameAr: 'وثيقة-قانونية.pdf',
  fileBuffer: buffer,
  mimeType: 'application/pdf',
  accessLevel: 'workspace',
  description: 'Iraqi civil law contract',
  descriptionAr: 'عقد القانون المدني العراقي'
});
```

#### Search Files with Arabic Support
```typescript
const searchResults = await fileManager.searchFiles({
  workspaceId: 'ws_123',
  userId: 'user_123',
  query: 'عقد', // Arabic search
  fileType: 'document',
  culturallyCompliant: true,
  arabicContent: true,
  limit: 50
});
```

### Routing System

#### Workspace URL Generation
```typescript
import { IraqiWorkspaceRouter } from './utils/workspace-routing';

const router = IraqiWorkspaceRouter.getInstance();

// Generate workspace URLs
const chatUrl = router.generateWorkspaceUrl('ws_123', 'ar', 'chat');
// Result: /ar/ws_123/chat

const legalUrl = router.generateProfessionalDomainUrl('ws_123', 'legal', 'cases', 'ar');
// Result: /ar/ws_123/legal/cases

// Parse route from request
const route = router.parseRoute('/ar/ws_123/documents');
// Result: { locale: 'ar', workspaceId: 'ws_123', feature: 'documents' }
```

## Professional Domain Templates

### Legal Workspace Template
```json
{
  "type": "legal",
  "features": [
    "Case management and tracking",
    "Client consultation scheduling",
    "Legal document templates (Iraqi format)",
    "Court calendar integration",
    "Fee calculation and invoicing",
    "Legal research database access"
  ],
  "culturalRequirements": [
    "Islamic jurisprudence compliance",
    "Iraqi civil law adherence",
    "Professional ethics standards",
    "Confidentiality protocols",
    "Court procedure compliance"
  ],
  "specializations": [
    {
      "id": "civil-law",
      "name": "Civil Law",
      "nameAr": "القانون المدني",
      "description": "Contracts, property rights, and civil disputes",
      "requirements": ["Iraqi Bar Association membership", "Civil law certification"]
    }
  ]
}
```

### Medical Workspace Template
```json
{
  "type": "medical",
  "features": [
    "Patient record management",
    "Appointment scheduling",
    "Prescription management",
    "Medical imaging integration",
    "Telemedicine support",
    "Insurance claim processing"
  ],
  "culturalRequirements": [
    "Islamic medical ethics compliance",
    "Patient privacy protection",
    "Halal medication guidelines",
    "Gender-sensitive care protocols",
    "Religious accommodation procedures"
  ]
}
```

## Cultural Compliance

### Islamic Compliance Settings
```typescript
interface IraqiCulturalSettings {
  enableIslamicCompliance: boolean;      // Enable Islamic content filters
  strictnessLevel: 'basic' | 'standard' | 'strict';  // Compliance strictness
  prayerTimeReminders: boolean;          // Prayer time notifications
  halalContentFilter: boolean;           // Halal content validation
  politicalNeutralityMode: boolean;      // Political content filtering
  sectarianContentFilter: boolean;       // Sectarian content filtering
  culturalSensitivityLevel: 'low' | 'medium' | 'high' | 'maximum';
}
```

### Compliance Scoring
- **90-100%**: Maximum Islamic compliance, suitable for religious organizations
- **80-89%**: High compliance, suitable for professional domains
- **70-79%**: Standard compliance, suitable for business use
- **Below 70%**: Requires review and improvement

### Content Validation Rules
1. **Islamic Values**: Content must align with Islamic principles
2. **Political Neutrality**: No sectarian or politically divisive content
3. **Professional Ethics**: Content appropriate for professional domains
4. **Cultural Sensitivity**: Respectful of Iraqi customs and traditions
5. **Language Appropriateness**: Proper Arabic language use

## Routing Patterns

### Supported URL Patterns
```
/ar/ws_123                    # Workspace root (Arabic)
/ar/ws_123/chat              # Chat feature
/ar/ws_123/documents         # Document management
/ar/ws_123/settings          # Workspace settings
/ar/ws_123/legal/cases       # Professional domain feature
/ar/ws_123/compliance/validate  # Cultural validation
```

### Locale Support
- `ar` - Arabic (default)
- `ar-IQ` - Iraqi Arabic
- `en` - English
- `en-US` - US English

### Professional Domain Routes
Each professional domain has specialized routes:
- **Legal**: `/legal/consultations`, `/legal/cases`, `/legal/court-calendar`
- **Medical**: `/medical/patients`, `/medical/appointments`, `/medical/telemedicine`
- **Educational**: `/education/courses`, `/education/students`, `/education/curriculum`
- **Business**: `/business/projects`, `/business/clients`, `/business/invoicing`
- **Engineering**: `/engineering/blueprints`, `/engineering/calculations`, `/engineering/safety`

## Performance Optimization

### Caching Strategy
- **Redis Cache**: Workspace metadata cached for 1 hour
- **Cultural Compliance**: Results cached for 30 minutes
- **File Metadata**: Cached for 2 hours with invalidation on updates
- **Arabic Processing**: RTL processing results cached for 24 hours

### Performance Targets
- **Workspace Creation**: <2 seconds
- **Cultural Validation**: <200ms
- **Arabic Processing**: <100ms for RTL conversion
- **File Upload**: <30 seconds for 100MB files
- **Search**: <500ms for 1000+ workspaces

## Security Features

### Data Isolation
- **Workspace Separation**: Complete isolation between workspaces
- **Professional Domain Security**: Enhanced security for legal/medical
- **File Access Control**: Role-based file access permissions
- **Cultural Content Filtering**: Automatic inappropriate content blocking

### Authentication & Authorization
- **Multi-Factor Authentication**: Support for Iraqi ID verification
- **Professional Verification**: License verification for legal/medical
- **Role-Based Access**: Granular permissions per workspace
- **Audit Logging**: Complete audit trail for compliance

## Testing

### Run Tests
```bash
# Unit tests
bun test

# Cultural compliance tests
bun test:cultural

# Arabic processing tests
bun test:arabic

# Integration tests
bun test:integration

# Performance tests
bun test:performance
```

### Test Coverage Requirements
- **Workspace Management**: 95%+ coverage
- **Cultural Compliance**: 100% coverage
- **Arabic Processing**: 95%+ coverage
- **File Management**: 90%+ coverage
- **Professional Domains**: 90%+ coverage

## Deployment

### Production Configuration
```yaml
# docker-compose.yml
version: '3.8'
services:
  workspace-manager:
    image: iraqi-ai/workspace-manager:latest
    environment:
      - REDIS_URL=redis://redis:6379
      - CULTURAL_VALIDATION_ENABLED=true
      - ARABIC_PROCESSING_ENABLED=true
    depends_on:
      - redis
      - cultural-validator
      - arabic-processor

  redis:
    image: redis:alpine
    volumes:
      - redis_data:/data

  cultural-validator:
    image: iraqi-ai/cultural-validator:latest
    environment:
      - ISLAMIC_COMPLIANCE_LEVEL=strict
      - POLITICAL_NEUTRALITY=enabled

  arabic-processor:
    image: iraqi-ai/arabic-processor:latest
    environment:
      - DIALECT_SUPPORT=baghdad,basra,mosul,general
      - RTL_PROCESSING=enabled
```

### Health Checks
```bash
# Check workspace manager health
curl http://localhost:8000/health/workspace

# Check cultural compliance service
curl http://localhost:8001/health/cultural

# Check Arabic processing service  
curl http://localhost:8002/health/arabic

# Full system health check
bun run health-check
```

## Migration from chatbot-ui

### Migration Steps
1. **Export Existing Workspaces**: Use the migration script to export
2. **Cultural Assessment**: Review existing content for compliance
3. **Arabic Conversion**: Convert workspace names to Arabic
4. **Professional Classification**: Classify workspaces by domain
5. **Import to Iraqi System**: Import with cultural validation

### Migration Script
```bash
# Run migration from existing chatbot-ui installation
bun run migrate:from-chatbot-ui \
  --source-db="postgresql://user:pass@host/chatbot_ui" \
  --target-redis="redis://localhost:6379" \
  --cultural-validation=true \
  --arabic-conversion=true
```

## Contributing

### Development Setup
```bash
# Clone repository
git clone https://github.com/your-org/iraqi-ai-workspace-system.git
cd iraqi-ai-workspace-system

# Install dependencies
bun install

# Start development servers
bun run dev:workspace-manager  # Port 8000
bun run dev:cultural-validator # Port 8001
bun run dev:arabic-processor   # Port 8002

# Run Redis
docker run -d -p 6379:6379 redis:alpine
```

### Code Standards
- **TypeScript**: Strict mode enabled
- **Arabic Comments**: Use Arabic comments for cultural-specific code
- **RTL Testing**: Test all UI components in RTL mode
- **Cultural Validation**: All content must pass cultural compliance
- **Professional Ethics**: Follow Iraqi professional standards

### Submitting Changes
1. **Cultural Review**: All changes reviewed for cultural appropriateness
2. **Arabic Testing**: Test Arabic text rendering and RTL layout
3. **Professional Validation**: Verify professional domain accuracy
4. **Performance Testing**: Ensure no performance regression
5. **Documentation**: Update Arabic and English documentation

## Support & Resources

### Iraqi Professional Resources
- **Iraqi Bar Association**: Professional legal verification
- **Iraqi Medical Association**: Medical license validation
- **Ministry of Education**: Educational compliance standards
- **Chamber of Commerce**: Business registration verification

### Cultural Compliance Resources
- **Islamic Jurisprudence Council**: Religious compliance guidance
- **Iraqi Cultural Ministry**: Cultural appropriateness standards
- **Arabic Language Academy**: Proper Arabic language usage

### Technical Support
- **GitHub Issues**: https://github.com/your-org/iraqi-ai-workspace-system/issues
- **Cultural Compliance**: cultural-support@iraqi-ai.com
- **Arabic Processing**: arabic-support@iraqi-ai.com
- **Professional Domains**: professional-support@iraqi-ai.com

## Roadmap

### Q1 2025 - Foundation ✅
- ✅ Multi-workspace management
- ✅ Cultural compliance integration
- ✅ Arabic-first design
- ✅ Professional domain support
- ✅ File management with isolation

### Q2 2025 - Enhancement
- 🔄 Desktop application support
- ⏳ Advanced Arabic NLP processing
- ⏳ Professional domain AI agents
- ⏳ Enterprise SSO integration
- ⏳ Advanced compliance reporting

### Q3 2025 - Advanced Features
- ⏳ Voice processing (Arabic)
- ⏳ Mobile application
- ⏳ Government integration APIs
- ⏳ Advanced analytics dashboard
- ⏳ Multi-tenant SaaS deployment

---

**Built with ❤️ for Iraqi professionals and organizations**

*This system is designed to serve the Iraqi professional community with respect for cultural values, Islamic principles, and local business practices.*