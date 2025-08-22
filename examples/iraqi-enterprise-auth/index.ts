/**
 * Iraqi Enterprise Authentication System - Main Export
 * Government-grade authentication with Iraqi cultural intelligence
 * 
 * Built on n8n's enterprise security foundation with comprehensive Iraqi enhancements:
 * - Ministry-level RBAC with cross-ministry approval workflows
 * - Biometric authentication (fingerprint, facial, iris)
 * - SSO integration with Iraqi government domains
 * - Islamic compliance (prayer time awareness, cultural validation)
 * - Arabic RTL support throughout authentication interfaces
 * - 7-year audit retention for government compliance
 * - Integration with Iraqi telecom providers (Zain, Asiacell, Korek)
 * - Security clearance validation system
 * - Government-grade encryption and threat detection
 */

// Core authentication engine
export { IraqiEnterpriseAuth } from './core/IraqiEnterpriseAuth';
export type { 
  IraqiEnterpriseAuthConfig, 
  AuthenticationResult 
} from './core/IraqiEnterpriseAuth';

// Biometric authentication
export { BiometricAuthenticator } from './biometric/BiometricAuthenticator';
export type { 
  BiometricValidationResult, 
  BiometricEnrollmentResult,
  BiometricConfiguration 
} from './biometric/BiometricAuthenticator';

// Ministry SSO integration
export { MinistrySSO } from './sso/MinistrySSO';
export type { 
  SSOConfiguration, 
  SSOAuthenticationResult 
} from './sso/MinistrySSO';

// Islamic compliance and cultural features
export { IslamicComplianceManager } from './cultural/IslamicComplianceManager';
export type { 
  PrayerTimeConfiguration, 
  IslamicComplianceConfiguration 
} from './cultural/IslamicComplianceManager';

// Arabic RTL support
export { ArabicRTLManager } from './rtl/ArabicRTLManager';
export type { 
  ArabicTextAnalysis, 
  RTLInterfaceElements 
} from './rtl/ArabicRTLManager';// Ministry RBAC system
export { MinistryRBAC } from './ministry/MinistryRBAC';
export type { 
  MinistryRole, 
  MinistryPermission 
} from './ministry/MinistryRBAC';

// Government audit logging
export { GovernmentAuditLogger } from './audit/GovernmentAuditLogger';
export type { 
  AuditLogEntry, 
  AuditEventType,
  AuditConfiguration 
} from './audit/GovernmentAuditLogger';

// Iraqi telecom MFA
export { IraqiTelecomMFA } from './telecom/IraqiTelecomMFA';
export type { 
  TelecomConfiguration, 
  IraqiTelecomProvider 
} from './telecom/IraqiTelecomMFA';

// Security clearance validation
export { SecurityClearanceValidator } from './security/SecurityClearanceValidator';
export type { 
  SecurityClearanceRecord 
} from './security/SecurityClearanceValidator';

// Threat detection engine
export { ThreatDetectionEngine } from './security/ThreatDetectionEngine';
export type { 
  ThreatDetectionResult, 
  DetectedThreat 
} from './security/ThreatDetectionEngine';

// Core interfaces and types
export type * from './interfaces/types';
export type * from './interfaces/authentication';
export type * from './interfaces/session';
export type * from './interfaces/cultural';

// Testing utilities
export { TestDataFactory } from './tests/AuthenticationTests';