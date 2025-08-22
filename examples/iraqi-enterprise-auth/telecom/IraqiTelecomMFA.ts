/**
 * Iraqi Enterprise Authentication - Telecom MFA Integration
 * Multi-Factor Authentication via Iraqi telecom providers
 * 
 * Supported providers:
 * - Zain Iraq (زين العراق)
 * - Asiacell (آسياسيل)
 * - Korek Telecom (كوريك تيليكوم)
 * 
 * Features:
 * - SMS OTP with Arabic support
 * - Voice call verification with Arabic IVR
 * - USSD-based authentication
 * - Integration with ZainCash for financial transactions
 * - Government priority routing
 * - Encrypted communication channels
 */

import { EventEmitter } from 'events';
import type { SecondaryCredential } from '../interfaces/authentication';
import type { IraqiUser } from '../interfaces/types';

export type IraqiTelecomProvider = 'zain' | 'asiacell' | 'korek';

export interface TelecomConfiguration {
  provider: IraqiTelecomProvider;
  apiEndpoint: string;
  apiKey: string;
  secretKey: string;
  serviceId: string; // Government service identifier
  
  // SMS Configuration
  smsSettings: {
    enabled: boolean;
    arabic: boolean;
    templateId: string;
    expiryMinutes: number;
    maxAttempts: number;
  };
  
  // Voice Call Configuration
  voiceSettings: {
    enabled: boolean;
    arabicIVR: boolean;
    englishIVR: boolean;
    maxDuration: number; // seconds
    retryAttempts: number;
  };
  
  // USSD Configuration (for basic phones)
  ussdSettings: {
    enabled: boolean;
    shortCode: string;
    sessionTimeout: number;
  };
  
  // Government settings
  priorityRouting: boolean;
  encryptionRequired: boolean;
  auditRequired: boolean;
  governmentRates: boolean; // Special government pricing
}