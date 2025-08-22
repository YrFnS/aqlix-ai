# Iraqi Enterprise Authentication - Usage Examples

## Quick Start

```typescript
import { 
  IraqiEnterpriseAuth,
  BiometricAuthenticator,
  IslamicComplianceManager,
  MinistrySSO
} from 'iraqi-enterprise-auth';

// Initialize the authentication system
const auth = new IraqiEnterpriseAuth({
  ministry: 'health',
  culturalCompliance: true,
  biometricEnabled: true,
  auditRetentionYears: 7,
  encryptionStandard: 'AES-256-GCM',
  sessionTimeoutHours: 8,
  mfaRequired: true,
  rtlSupport: true
});

// Authenticate a user
const result = await auth.authenticate({
  method: 'password',
  primaryCredential: {
    type: 'employee_id',
    identifier: 'EMP001',
    secret: 'securePassword123'
  },
  deviceInfo: {
    deviceId: 'DESKTOP-001',
    type: 'government_terminal',
    os: 'Windows 11',
    ipAddress: '192.168.1.100',
    isGovernmentDevice: true,
    securityLevel: 'hardened'
  },
  culturalContext: {
    preferredLanguage: 'ar',
    islamicDate: '1445-06-15',
    isRamadan: false,
    culturalSensitivityMode: true
  }
});

if (result.success) {
  console.log('✅ Authentication successful');
  console.log('Session ID:', result.sessionId);
  console.log('Cultural Compliance:', result.culturalCompliance.culturalScore + '%');
} else {
  console.log('❌ Authentication failed:', result.errors);
}
```## Biometric Authentication

```typescript
import { BiometricAuthenticator } from 'iraqi-enterprise-auth';

const biometric = new BiometricAuthenticator({
  fingerprintEnabled: true,
  facialEnabled: true,
  irisEnabled: true,
  voiceEnabled: false,
  palmPrintEnabled: false,
  
  fingerprintThreshold: 85,
  facialThreshold: 90,
  irisThreshold: 95,
  
  minimumQuality: 75,
  livenessRequired: true,
  antiSpoofingRequired: true,
  
  culturalConsiderations: {
    hijabFriendlyFacial: true,
    gloveFriendlyFingerprint: true,
    glassesOptimization: true
  },
  
  encryptionEnabled: true,
  auditEnabled: true
});

// Validate biometric credential
const biometricResult = await biometric.validateBiometric(user, {
  type: 'facial',
  data: 'base64-encoded-facial-data',
  quality: 88,
  deviceId: 'BIOMETRIC-CAM-001',
  capturedAt: new Date()
});

console.log('Biometric validation:', biometricResult.valid);
console.log('Confidence:', biometricResult.confidence + '%');
```

## Ministry SSO Integration

```typescript
import { MinistrySSO } from 'iraqi-enterprise-auth';

const sso = new MinistrySSO();

// Authenticate with Health Ministry LDAP
const ssoResult = await sso.authenticateWithMinistry('health', {
  method: 'sso',
  primaryCredential: {
    type: 'username_password',
    identifier: 'ahmed.ali',
    secret: 'password123'
  },
  deviceInfo: deviceInfo
});

if (ssoResult.success) {
  console.log('✅ Ministry SSO successful');
  console.log('User:', ssoResult.user?.name.ar);
  console.log('Ministry validated:', ssoResult.ministryValidated);
}
```