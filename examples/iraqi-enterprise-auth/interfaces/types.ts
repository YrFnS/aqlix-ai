/**
 * Iraqi Enterprise Authentication System - Core Types
 * TypeScript interfaces for government-grade authentication
 */

// User and Identity Management
export interface IraqiUser {
  id: string;
  employeeId?: string;
  nationalId: string; // Iraqi National ID
  name: {
    ar: string; // Arabic name
    en: string; // English name
  };
  email: string;
  phone: string; // Iraqi phone format (+964...)
  ministry: IraqiMinistry;
  department: string;
  position: string;
  securityClearance: SecurityClearance;
  culturalProfile: CulturalProfile;
  biometricProfiles?: BiometricProfile[];
  smartCardId?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  status: 'active' | 'suspended' | 'terminated' | 'pending';
}

export interface CulturalProfile {
  primaryLanguage: 'ar' | 'en' | 'ku'; // Arabic, English, Kurdish
  preferredScript: 'arabic' | 'latin';
  prayerTimeNotifications: boolean;
  ramadanSchedule: boolean;
  islamicCalendarPreference: boolean;
  culturalSensitivityLevel: 'standard' | 'strict' | 'moderate';
  rtlDisplayPreference: boolean;
}// Iraqi Government Ministry System
export type IraqiMinistry = 
  | 'health'
  | 'education' 
  | 'interior'
  | 'justice'
  | 'finance'
  | 'defense'
  | 'foreign_affairs'
  | 'oil'
  | 'electricity'
  | 'transportation'
  | 'agriculture'
  | 'labor'
  | 'planning'
  | 'culture'
  | 'youth_sports'
  | 'higher_education'
  | 'migration'
  | 'trade'
  | 'industry'
  | 'communications'
  | 'general'; // General government services

export type SecurityClearance = 'basic' | 'elevated' | 'high' | 'top_secret';

export interface MinistryConfiguration {
  ministry: IraqiMinistry;
  displayName: {
    ar: string;
    en: string;
  };
  domainController: string;
  ldapBaseDN: string;
  ssoEndpoint: string;
  securityRequirements: {
    minimumClearance: SecurityClearance;
    biometricRequired: boolean;
    mfaRequired: boolean;
    smartCardRequired: boolean;
    ipWhitelistEnabled: boolean;
  };
  culturalRequirements: {
    islamicCompliance: boolean;
    prayerTimeRespect: boolean;
    ramadanConsideration: boolean;
    familyConsentRequired: boolean; // For certain data access
  };
  dataClassification: {
    defaultLevel: 'public' | 'internal' | 'confidential' | 'secret';
    encryptionStandard: 'AES-128' | 'AES-256' | 'AES-256-GCM' | 'ChaCha20-Poly1305';
    auditLevel: 'basic' | 'detailed' | 'comprehensive';
  };
}