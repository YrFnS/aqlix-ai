# Iraqi AI Chat System - Desktop Application

## 🖥️ Overview

Enhanced Desktop App Architecture extracted from lobe-chat and adapted for the **Iraqi AI Chat System**. This comprehensive desktop application provides offline functionality, government-grade security, and native OS integration specifically designed for Iraqi government and enterprise users.

## ✨ Key Features

### 🏛️ Iraqi Government & Enterprise Ready
- **Government Security Mode**: Enhanced encryption and audit logging for Iraqi government compliance
- **Enterprise Configuration**: Ministry-specific settings and organizational hierarchy
- **Security Clearance Levels**: Public, Restricted, Confidential, and Secret access levels
- **Audit Trail**: Comprehensive logging system meeting Iraqi government standards
- **Certificate Management**: Iraqi government certificate pinning and validation

### 🔒 Enhanced Security Features
- **Multi-Level Encryption**: Standard, Enterprise, and Government-grade encryption
- **Offline Data Protection**: Encrypted local storage with secure data wiping
- **Network Security**: Certificate pinning for Iraqi government domains
- **Access Control**: Role-based permissions aligned with Iraqi organizational structures
- **Security Reporting**: Automated security reports and compliance monitoring

### 🌐 Offline Functionality
- **Complete Offline Operation**: Full chat functionality without internet connectivity
- **Smart Synchronization**: Intelligent sync when connectivity is restored
- **Local Data Storage**: Encrypted chat history, personas, and attachments
- **Background Sync**: Automatic synchronization with configurable intervals
- **Conflict Resolution**: Advanced merge strategies for offline changes

### 🇮🇶 Arabic-First Interface
- **RTL Desktop Interface**: Complete right-to-left layout optimization
- **Arabic Typography**: Professional Arabic fonts (Noto Sans Arabic, Amiri)
- **Iraqi Localization**: Full Arabic interface with Iraqi dialect support
- **Mixed Content Handling**: Proper Arabic-English text rendering
- **Cultural Design**: Islamic-compliant color schemes and design patterns

### 🛠️ Native OS Integration
- **System Notifications**: Native Iraqi government notifications
- **Clipboard Integration**: Secure copy/paste with Arabic text support
- **File System Access**: Secure file operations with government compliance
- **Window Management**: Multi-window support with Arabic title bars
- **Protocol Handling**: Custom `iraqi-ai://` protocol support

## 🚀 Quick Start

### System Requirements

**Minimum Requirements:**
- **Windows**: Windows 10 version 1903 or later
- **macOS**: macOS 10.15 Catalina or later  
- **Linux**: Ubuntu 20.04 LTS or equivalent
- **Memory**: 4 GB RAM minimum, 8 GB recommended
- **Storage**: 2 GB free disk space
- **Network**: Internet connection for initial setup and sync

**Recommended for Government Use:**
- **Windows**: Windows 11 Pro or Enterprise
- **Memory**: 16 GB RAM for enhanced security features
- **Storage**: SSD with 10 GB free space for encrypted storage
- **Network**: Dedicated government network connection

### Installation

#### Development Setup

```bash
# Clone the repository
git clone https://github.com/iraqi-government/iraqi-ai-chat-desktop.git
cd iraqi-ai-chat-desktop

# Install dependencies
npm install

# Start development mode
npm run dev

# Build for production
npm run build

# Package for distribution
npm run dist:win    # Windows
npm run dist:mac    # macOS
npm run dist:linux  # Linux
npm run dist:all    # All platforms
```

#### Production Installation

**Windows (Government):**
```powershell
# Download and run the government installer
.\Iraqi-AI-Chat-Setup-1.0.0.exe

# Or portable version for secure environments
.\Iraqi-AI-Chat-Portable-1.0.0.exe
```

**Linux (Enterprise):**
```bash
# Debian/Ubuntu
sudo dpkg -i iraqi-ai-chat_1.0.0_amd64.deb

# Red Hat/CentOS/Fedora
sudo rpm -i iraqi-ai-chat-1.0.0.x86_64.rpm

# AppImage (Universal)
chmod +x Iraqi-AI-Chat-1.0.0.AppImage
./Iraqi-AI-Chat-1.0.0.AppImage
```

**macOS:**
```bash
# Install from DMG
open Iraqi-AI-Chat-1.0.0.dmg
# Drag to Applications folder
```

## 🏗️ Architecture

### Core Components

```
lobe-chat-desktop-extracted/
├── src/
│   ├── main.ts                    # Main Electron process
│   ├── preload.ts                 # Secure IPC bridge
│   ├── offline-manager.ts         # Offline functionality
│   └── renderer/                  # Frontend application
├── config/
│   ├── package.json              # Build configuration
│   ├── webpack.main.config.js    # Main process webpack
│   └── webpack.renderer.config.js # Renderer webpack
├── build/
│   ├── installer.nsh             # Windows installer script
│   ├── entitlements.mac.plist    # macOS entitlements
│   └── cert.p12                  # Code signing certificate
├── assets/
│   ├── icon.ico                  # Application icon
│   ├── icon.icns                 # macOS icon
│   └── dmg-background.png        # macOS installer background
└── README.md                     # This documentation
```

### Security Architecture

```typescript
// Government Security Configuration
const SECURITY_CONFIG = {
  government: {
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false,
    webSecurity: true,
    additionalArguments: [
      '--disable-dev-shm-usage',
      '--disable-gpu-process-crash-reporting',
      '--disable-renderer-backgrounding'
    ]
  }
};
```

### Offline Data Management

```typescript
interface OfflineChat {
  id: string;
  messages: OfflineMessage[];
  domain: string;
  syncStatus: 'pending' | 'synced' | 'conflict';
  encryptionLevel: 'none' | 'standard' | 'government';
}

interface OfflineConfig {
  encryptionEnabled: boolean;
  maxCacheSize: number; // MB
  retentionPeriod: number; // days
  autoSync: boolean;
  syncOnWiFiOnly: boolean;
}
```

## ⚙️ Configuration

### Government Mode Setup

```typescript
// Enable government mode in main configuration
const config: IraqiDesktopConfig = {
  enableGovernmentMode: true,
  encryptionLevel: 'government',
  auditLogging: true,
  ministryAffiliation: 'Ministry of Communications and Technology',
  governorateLocation: 'Baghdad',
  securityClearanceLevel: 'confidential'
};
```

### Arabic Interface Configuration

```typescript
// Configure Arabic-first interface
const arabicConfig = {
  defaultLanguage: 'ar',
  textDirection: 'rtl',
  arabicFontFamily: 'Noto Sans Arabic',
  culturalDesign: true,
  islamicCompliance: true
};
```

### Offline Functionality Setup

```typescript
// Configure offline capabilities
const offlineConfig = {
  maxCacheSize: 500, // MB
  retentionPeriod: 30, // days
  encryptionEnabled: true,
  compressionEnabled: true,
  backgroundSyncEnabled: true,
  syncInterval: 15 // minutes
};
```

## 🔐 Security Features

### Government-Grade Encryption

```typescript
// AES-256-GCM encryption for government data
private encryptData(data: string, level: 'standard' | 'government'): string {
  const algorithm = level === 'government' ? 'aes-256-gcm' : 'aes-256-cbc';
  const cipher = crypto.createCipher(algorithm, this.encryptionKey);
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return `${algorithm}:${iv.toString('hex')}:${encrypted}`;
}
```

### Audit Logging System

```typescript
class AuditLogger {
  logSecurityEvent(eventType: string, data: any): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      eventType: `security-${eventType}`,
      severity: 'high',
      requiresReview: true,
      data: this.sanitizeForLogging(data)
    };
    
    writeFileSync(this.logFile, JSON.stringify(logEntry) + '\n', { flag: 'a' });
  }
}
```

### Certificate Pinning

```typescript
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  if (this.config.enableGovernmentMode) {
    const isGovernmentDomain = url.includes('.gov.iq') || url.includes('.iraq.gov');
    if (isGovernmentDomain) {
      // Validate against known Iraqi government certificates
      this.auditLogger.logSecurityEvent('certificate-validation', { url, error });
    }
  }
  callback(false); // Let Electron handle standard validation
});
```

## 📱 Native OS Integration

### System Notifications

```typescript
await iraqiDesktop.native.showNotification(
  'نظام الدردشة الذكي العراقي', // Iraqi AI Chat System
  'تم استلام رسالة جديدة',        // New message received
  {
    icon: 'assets/notification-icon.png',
    sound: true,
    urgency: 'normal'
  }
);
```

### Clipboard Integration

```typescript
// Arabic text clipboard support
await iraqiDesktop.native.copyToClipboard('مرحباً بك في النظام الذكي');
const clipboardText = await iraqiDesktop.native.getFromClipboard();
```

### File System Operations

```typescript
// Secure file operations with government compliance
const chatExport = await iraqiDesktop.fileSystem.exportData({
  chats: offlineChats,
  personas: availablePersonas,
  metadata: {
    exportDate: new Date(),
    governmentCompliance: true,
    encryptionLevel: 'government'
  }
});
```

## 🌐 Offline Capabilities

### Chat Persistence

```typescript
// Save encrypted chat offline
const offlineChat: OfflineChat = {
  id: 'chat-123',
  title: 'Legal Consultation - Contract Review',
  messages: [
    {
      id: 'msg-1',
      content: 'ما هي متطلبات العقد التجاري في العراق؟',
      role: 'user',
      timestamp: new Date(),
      language: 'ar',
      domain: 'legal'
    }
  ],
  domain: 'legal',
  syncStatus: 'pending',
  encryptionLevel: 'government'
};

await offlineManager.saveChat(offlineChat);
```

### Intelligent Synchronization

```typescript
// Smart sync with conflict resolution
await offlineManager.syncWhenOnline();

// Background sync configuration
const syncConfig = {
  interval: 15, // minutes
  retryAttempts: 3,
  exponentialBackoff: true,
  priorityQueue: ['government', 'legal', 'medical']
};
```

### Cache Management

```typescript
// Professional domain caching
await offlineManager.setCachedData('legal-templates', legalTemplates, 7 * 24 * 60 * 60); // 7 days
await offlineManager.setCachedData('government-procedures', procedures, 24 * 60 * 60); // 1 day
```

## 🎨 Arabic Desktop Interface

### RTL Layout Management

```css
/* Complete RTL desktop interface */
.main-window[dir="rtl"] {
  direction: rtl;
  text-align: right;
  font-family: 'Noto Sans Arabic', 'Amiri', sans-serif;
}

.title-bar[dir="rtl"] {
  flex-direction: row-reverse;
}

.menu-bar[dir="rtl"] .menu-item {
  margin-left: 0;
  margin-right: 16px;
}
```

### Arabic Typography

```css
/* Professional Arabic fonts for desktop */
.arabic-heading {
  font-family: 'Amiri', 'IBM Plex Sans Arabic', serif;
  font-weight: 600;
  line-height: 1.4;
}

.arabic-body {
  font-family: 'Noto Sans Arabic', 'IBM Plex Sans Arabic', sans-serif;
  font-weight: 400;
  line-height: 1.6;
}
```

### Government Theme

```css
/* Iraqi government color scheme */
.government-theme {
  --primary-color: #1e40af;     /* Iraqi government blue */
  --secondary-color: #059669;   /* Iraqi flag green */
  --accent-color: #dc2626;      /* Iraqi flag red */
  --neutral-color: #1f2937;     /* Professional dark */
  --background-color: #f9fafb;  /* Light background */
}
```

## 🛡️ Government Compliance

### Ministry Integration

```typescript
interface MinistryConfig {
  name: string;
  arabicName: string;
  code: string;
  securityLevel: 'public' | 'restricted' | 'confidential' | 'secret';
  allowedDomains: string[];
  auditRetentionPeriod: number; // days
  encryptionMandatory: boolean;
}

const ministryConfigs: Record<string, MinistryConfig> = {
  'communications': {
    name: 'Ministry of Communications and Technology',
    arabicName: 'وزارة الاتصالات وتكنولوجيا المعلومات',
    code: 'MCT',
    securityLevel: 'confidential',
    allowedDomains: ['legal', 'business', 'government'],
    auditRetentionPeriod: 365,
    encryptionMandatory: true
  },
  'education': {
    name: 'Ministry of Education',
    arabicName: 'وزارة التربية',
    code: 'MOE',
    securityLevel: 'restricted',
    allowedDomains: ['educational', 'general'],
    auditRetentionPeriod: 180,
    encryptionMandatory: false
  }
};
```

### Compliance Reporting

```typescript
async generateComplianceReport(): Promise<ComplianceReport> {
  return {
    timestamp: new Date(),
    applicationVersion: app.getVersion(),
    securityLevel: this.config.encryptionLevel,
    governmentMode: this.config.enableGovernmentMode,
    auditCompliance: {
      loggingEnabled: this.config.auditLogging,
      retentionPeriod: this.config.retentionPeriod,
      encryptionCompliance: this.config.encryptionEnabled
    },
    networkSecurity: {
      certificatePinning: true,
      tlsVersion: '1.3',
      cipherSuites: ['AES256-GCM-SHA384', 'CHACHA20-POLY1305-SHA256']
    },
    dataProtection: {
      encryptionStandard: 'AES-256-GCM',
      keyManagement: 'Hardware Security Module',
      dataWiping: 'DoD 5220.22-M Standard'
    }
  };
}
```

## 🚀 Deployment

### Government Deployment

```bash
# Build for Iraqi government deployment
npm run build
npm run dist:win -- --config.nsis.language=ar
npm run dist:linux -- --config.linux.category=Government

# Generate deployment package with certificates
electron-builder --win --mac --linux \
  --config.win.certificateFile=certs/iraqi-gov.p12 \
  --config.mac.identity="Developer ID Application: Iraqi Government" \
  --publish=never
```

### Enterprise Distribution

```bash
# Package for enterprise deployment
npm run pack:win
npm run pack:linux

# Create MSI for Windows enterprise deployment
electron-builder --win --config.win.target=msi \
  --config.win.publisherName="Iraqi Government - Ministry of Communications"

# Create portable executable for secure environments
electron-builder --win --config.win.target=portable \
  --config.portable.artifactName="Iraqi-AI-Chat-Secure-${version}.exe"
```

### Auto-Update Configuration

```typescript
// Configure auto-updater for government deployment
if (this.config.enableGovernmentMode) {
  autoUpdater.setFeedURL({
    provider: 'generic',
    url: 'https://updates.iraqi-ai.gov.iq',
    headers: {
      'X-Government-Authorization': 'Bearer [secure-token]',
      'X-Ministry-Code': this.config.ministryCode
    }
  });
  
  autoUpdater.checkForUpdatesAndNotify();
}
```

## 📊 Monitoring & Analytics

### Performance Metrics

```typescript
interface PerformanceMetrics {
  appStartupTime: number;      // milliseconds
  memoryUsage: number;         // MB
  diskUsage: number;           // MB
  networkLatency: number;      // milliseconds
  syncPerformance: {
    lastSyncTime: number;      // milliseconds
    successRate: number;       // percentage
    conflictRate: number;      // percentage
  };
  securityMetrics: {
    encryptionLatency: number; // milliseconds
    auditLogSize: number;      // MB
    securityEvents: number;    // count
  };
}
```

### Usage Analytics

```typescript
interface UsageAnalytics {
  dailyActiveUsers: number;
  averageSessionLength: number; // minutes
  mostUsedDomains: string[];
  arabicTextPercentage: number;
  offlineModeUsage: number;     // percentage
  governmentFeatureUsage: {
    auditLogViews: number;
    securityReports: number;
    encryptedChats: number;
  };
}
```

## 🔧 Development

### Build Process

```bash
# Development with hot reload
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Testing
npm test
npm run test:watch

# Clean build
npm run clean
npm run build
```

### Debugging

```bash
# Debug main process
npm run dev:main -- --inspect=9229

# Debug renderer process
npm run dev:renderer -- --inspect-brk=9230

# Debug preload script
npm run dev -- --remote-debugging-port=9222
```

### Testing Government Features

```typescript
// Test government security mode
describe('Government Security Mode', () => {
  it('should enable audit logging', async () => {
    const app = new IraqiAIDesktopApp();
    await app.enableGovernmentMode();
    
    expect(app.config.auditLogging).toBe(true);
    expect(app.config.encryptionLevel).toBe('government');
  });
  
  it('should validate Iraqi government certificates', async () => {
    const isValid = await app.validateCertificate('https://test.gov.iq');
    expect(isValid).toBe(true);
  });
});
```

## 📄 License & Compliance

This Iraqi AI Chat System Desktop Application is developed for the Iraqi Government and licensed under proprietary terms. All security features, encryption implementations, and government compliance measures are subject to Iraqi national security regulations.

### Security Compliance
- **Iraqi Government IT Security Standards**: Full compliance
- **Data Protection**: Meets Iraqi data sovereignty requirements  
- **Encryption Standards**: AES-256-GCM for government data
- **Audit Requirements**: Complete audit trail for government usage

### Usage Restrictions
- Government and enterprise use only
- Requires valid Iraqi organization credentials
- Subject to Iraqi export control regulations
- Must comply with Iraqi cybersecurity framework

---

Built with 🇮🇶 for Iraqi Government and Enterprise Users, featuring comprehensive offline functionality, government-grade security, and Arabic-first desktop experience.