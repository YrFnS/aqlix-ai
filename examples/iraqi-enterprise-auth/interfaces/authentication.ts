/**
 * Iraqi Enterprise Authentication - Authentication Interfaces
 * Government-grade authentication with Iraqi-specific features
 */

import { IraqiUser, IraqiMinistry, SecurityClearance } from './types';

// Authentication Methods
export interface AuthenticationCredentials {
  method: AuthenticationMethod;
  primaryCredential: PrimaryCredential;
  secondaryCredentials?: SecondaryCredential[];
  biometricData?: BiometricCredential;
  deviceInfo: DeviceInfo;
  culturalContext?: CulturalContext;
}

export type AuthenticationMethod = 
  | 'password'
  | 'smart_card'
  | 'biometric'
  | 'sso'
  | 'mobile_token'
  | 'government_certificate';

export interface PrimaryCredential {
  type: 'username_password' | 'employee_id' | 'national_id' | 'smart_card' | 'certificate';
  identifier: string; // Username, employee ID, or national ID
  secret?: string; // Password or PIN
  certificateData?: string; // For certificate-based auth
}

export interface SecondaryCredential {
  type: 'sms_otp' | 'email_otp' | 'totp' | 'push_notification' | 'voice_call';
  value: string;
  provider?: 'zain' | 'asiacell' | 'korek' | 'ministry_email';
  expiresAt: Date;
}// Biometric Authentication
export interface BiometricCredential {
  type: 'fingerprint' | 'facial' | 'iris' | 'voice' | 'palm_print';
  data: string; // Base64 encoded biometric template
  quality: number; // 0-100 quality score
  deviceId: string;
  capturedAt: Date;
}

export interface BiometricProfile {
  userId: string;
  type: BiometricCredential['type'];
  templates: BiometricTemplate[];
  isActive: boolean;
  enrolledAt: Date;
  lastUsed?: Date;
  deviceRestrictions?: string[]; // Specific devices for enrollment
}

export interface BiometricTemplate {
  id: string;
  template: string; // Encrypted biometric template
  quality: number;
  createdAt: Date;
  deviceId: string;
}// Device and Context Information
export interface DeviceInfo {
  deviceId: string;
  type: 'desktop' | 'mobile' | 'tablet' | 'kiosk' | 'government_terminal';
  os: string;
  browser?: string;
  ipAddress: string;
  location?: GeographicLocation;
  isGovernmentDevice: boolean;
  securityLevel: 'standard' | 'hardened' | 'classified';
}

export interface GeographicLocation {
  country: string; // Should be 'IQ' for Iraq
  governorate: string; // Iraqi governorate
  city: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface CulturalContext {
  currentPrayerWindow?: PrayerWindow;
  isRamadan: boolean;
  isFriday: boolean;
  islamicDate: string; // Hijri calendar date
  preferredLanguage: 'ar' | 'en' | 'ku';
  culturalSensitivityMode: boolean;
}