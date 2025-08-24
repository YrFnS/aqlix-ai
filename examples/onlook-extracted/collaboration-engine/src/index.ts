/**
 * Iraqi AI System - Real-Time Collaboration Engine
 * Main entry point for collaboration system with cultural intelligence
 * 
 * @version 1.0.0
 * @author Iraqi AI Development Team
 * @license MIT
 */

// Core collaboration engine
export {
  IraqiCollaborationEngine,
  type IraqiCollaborationConfig,
  type CollaborationSession,
  type CollaborationParticipant,
  type CollaborationResult,
  type CollaborativeDocument,
  type CulturalContext
} from './CollaborationEngine';

// Arabic annotation system
export {
  ArabicAnnotationSystem,
  type AnnotationConfig,
  type AnnotationInput,
  type AnnotationResult,
  type AnnotationContent,
  type CulturalValidationResult,
  type IslamicValidationResult,
  type ArabicValidationResult
} from './ArabicAnnotationSystem';

// Ministry workflow manager
export {
  MinistryWorkflowManager,
  type WorkflowConfig,
  type WorkflowInput,
  type WorkflowResult,
  type WorkflowState,
  type ApprovalChain,
  type WorkflowParticipant
} from './MinistryWorkflowManager';

// Team synchronization
export {
  TeamSynchronization,
  type SyncConfig,
  type SyncResult,
  type TeamMember,
  type TeamState,
  type PrayerSchedule,
  type CulturalPreferences
} from './TeamSynchronization';

// Cultural conflict resolution
export {
  CulturalConflictResolution,
  type ConflictConfig,
  type ConflictInput,
  type ConflictResolution,
  type ConflictMediator,
  type MediationSession,
  type IslamicConsiderations
} from './ConflictResolution';

// Collaboration security
export {
  CollaborationSecurity,
  type SecurityConfig,
  type SecurityResult,
  type CollaborationUser,
  type SecuritySession,
  type AuthenticationMethod
} from './CollaborationSecurity';

// Common types
export type MinistryType = 'health' | 'education' | 'interior' | 'justice';
export type SecurityLevel = 'public' | 'internal' | 'confidential' | 'secret' | 'top-secret';
export type CulturalSensitivity = 'low' | 'medium' | 'high' | 'critical';

// Utility functions for cultural intelligence
export const CulturalUtils = {
  /**
   * Check if current time is prayer time
   */
  isPrayerTime(): boolean {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    // Simplified prayer time check (would use proper Islamic calendar in production)
    const prayerTimes = [
      { name: 'fajr', hour: 5, minute: 30 },
      { name: 'dhuhr', hour: 12, minute: 30 },
      { name: 'asr', hour: 15, minute: 30 },
      { name: 'maghrib', hour: 18, minute: 0 },
      { name: 'isha', hour: 19, minute: 30 }
    ];
    
    return prayerTimes.some(prayer => {
      const prayerStart = prayer.hour * 60 + prayer.minute;
      const currentTime = hour * 60 + minute;
      return Math.abs(currentTime - prayerStart) <= 20; // 20 minute window
    });
  },

  /**
   * Get appropriate Arabic greeting based on time of day
   */
  getArabicGreeting(): string {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return 'صباح الخير'; // Good morning
    } else if (hour >= 12 && hour < 17) {
      return 'مساء الخير'; // Good afternoon
    } else if (hour >= 17 && hour < 21) {
      return 'مساء الخير'; // Good evening
    } else {
      return 'السلام عليكم'; // Peace be upon you (universal Islamic greeting)
    }
  },

  /**
   * Validate Arabic text for RTL compliance
   */
  validateRTLText(text: string): { valid: boolean; issues: string[] } {
    const issues: string[] = [];
    
    // Check for Arabic characters
    const hasArabic = /[\u0600-\u06FF]/.test(text);
    if (!hasArabic) {
      return { valid: true, issues: [] };
    }
    
    // Check for proper RTL markers
    const hasRTLMarkers = /[\u200F\u202E]/.test(text);
    if (!hasRTLMarkers) {
      issues.push('Missing RTL direction markers');
    }
    
    // Check for mixed direction issues
    const hasLTRAndRTL = /[a-zA-Z]/.test(text) && hasArabic;
    if (hasLTRAndRTL && !text.includes('\u200F')) {
      issues.push('Mixed LTR/RTL text without proper direction control');
    }
    
    return {
      valid: issues.length === 0,
      issues
    };
  },

  /**
   * Check if content is culturally appropriate for Iraqi context
   */
  validateCulturalContent(content: string): { 
    appropriate: boolean; 
    islamicCompliant: boolean; 
    issues: string[] 
  } {
    const issues: string[] = [];
    const lowerContent = content.toLowerCase();
    
    // Check for inappropriate content (simplified)
    const inappropriateTerms = ['alcohol', 'gambling', 'inappropriate'];
    const hasInappropriate = inappropriateTerms.some(term => lowerContent.includes(term));
    if (hasInappropriate) {
      issues.push('Contains culturally inappropriate content');
    }
    
    // Check for respectful language
    const hasRespectfulTerms = /please|thank you|شكرا|من فضلك/.test(lowerContent);
    if (!hasRespectfulTerms && content.length > 50) {
      issues.push('Consider adding more respectful language');
    }
    
    return {
      appropriate: !hasInappropriate,
      islamicCompliant: !hasInappropriate,
      issues
    };
  },

  /**
   * Format Arabic date and time
   */
  formatArabicDateTime(date: Date): string {
    const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    
    let formatted = date.toLocaleString('ar-IQ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    // Convert to Arabic-Indic digits
    for (let i = 0; i < 10; i++) {
      formatted = formatted.replace(new RegExp(englishDigits[i], 'g'), arabicDigits[i]);
    }
    
    return formatted;
  },

  /**
   * Get ministry-specific color scheme
   */
  getMinistryColors(ministry: MinistryType): { primary: string; secondary: string; accent: string } {
    const colorSchemes = {
      health: {
        primary: '#059669', // Emerald for medical
        secondary: '#0d9488', // Teal for healthcare
        accent: '#10b981' // Green for wellness
      },
      education: {
        primary: '#2563eb', // Blue for learning
        secondary: '#1d4ed8', // Darker blue
        accent: '#3b82f6' // Lighter blue
      },
      interior: {
        primary: '#374151', // Slate for official
        secondary: '#4b5563', // Gray
        accent: '#6b7280' // Light gray
      },
      justice: {
        primary: '#7c3aed', // Purple for authority
        secondary: '#6366f1', // Indigo
        accent: '#8b5cf6' // Violet
      }
    };
    
    return colorSchemes[ministry];
  },

  /**
   * Check if current time is within Iraqi government working hours
   */
  isWorkingHours(): boolean {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    
    // Sunday = 0, Monday = 1, ..., Saturday = 6
    // Iraqi government working days: Sunday to Thursday
    const isWorkingDay = day >= 0 && day <= 4;
    const isWorkingTime = hour >= 8 && hour <= 15; // 8 AM to 3 PM
    
    return isWorkingDay && isWorkingTime;
  }
};

// Configuration helpers
export const ConfigHelpers = {
  /**
   * Create default collaboration configuration for ministry
   */
  createMinistryConfig(ministry: MinistryType): IraqiCollaborationConfig {
    const baseConfig: IraqiCollaborationConfig = {
      ministry,
      teamStructure: 'hierarchical',
      collaborationMode: 'hybrid',
      maxParticipants: 20,
      islamicWorkflowCompliance: true,
      arabicCollaboration: true,
      prayerTimeAware: true,
      culturalModeration: true,
      ramadanScheduleAware: true,
      governmentSecurity: true,
      auditTrail: true,
      securityLevel: 'internal',
      crossMinistryCollaboration: false,
      citizenInteraction: false,
      syncLatencyTarget: 50,
      offlineSupport: true,
      mobileOptimized: true,
      rtlOptimized: true,
      wcagCompliance: true,
      governmentAccessibility: true,
      multiLanguageSupport: true
    };
    
    // Ministry-specific adjustments
    switch (ministry) {
      case 'health':
        return {
          ...baseConfig,
          securityLevel: 'confidential',
          citizenInteraction: true,
          maxParticipants: 15
        };
      case 'education':
        return {
          ...baseConfig,
          citizenInteraction: true,
          crossMinistryCollaboration: true,
          maxParticipants: 25
        };
      case 'interior':
        return {
          ...baseConfig,
          securityLevel: 'secret',
          citizenInteraction: true,
          crossMinistryCollaboration: true,
          maxParticipants: 10
        };
      case 'justice':
        return {
          ...baseConfig,
          securityLevel: 'confidential',
          crossMinistryCollaboration: true,
          maxParticipants: 12
        };
      default:
        return baseConfig;
    }
  },

  /**
   * Create security configuration for government deployment
   */
  createSecurityConfig(ministry: MinistryType, securityLevel: SecurityLevel): SecurityConfig {
    return {
      securityLevel,
      governmentGrade: true,
      auditTrail: true,
      encryptionRequired: securityLevel !== 'public',
      ministry,
      culturalFilter: true,
      roleBasedAccess: true,
      hierarchicalAccess: true,
      sessionTimeouts: true,
      multiFactorAuth: securityLevel === 'secret' || securityLevel === 'top-secret',
      biometricAuth: securityLevel === 'top-secret',
      islamicContentFilter: true,
      culturalComplianceCheck: true,
      religiousTermValidation: true,
      arabicContentSecurity: true,
      governmentCompliance: true,
      ministerialOversight: securityLevel !== 'public',
      interdepartmentalAccess: true,
      citizenDataProtection: true,
      realTimeMonitoring: true,
      threatDetection: true,
      anomalyDetection: true,
      intrusionPrevention: securityLevel === 'secret' || securityLevel === 'top-secret',
      validationLatencyTarget: 100,
      encryptionStrength: securityLevel === 'top-secret' ? 'military' : 
                          securityLevel === 'secret' ? 'enhanced' : 'standard',
      cachingEnabled: true,
      optimizedValidation: true
    };
  }
};

// Version information
export const VERSION = '1.0.0';
export const BUILD_DATE = new Date().toISOString();
export const SUPPORTED_MINISTRIES: MinistryType[] = ['health', 'education', 'interior', 'justice'];

// Default export for convenience
export default {
  IraqiCollaborationEngine,
  ArabicAnnotationSystem,
  MinistryWorkflowManager,
  TeamSynchronization,
  CulturalConflictResolution,
  CollaborationSecurity,
  CulturalUtils,
  ConfigHelpers,
  VERSION,
  BUILD_DATE,
  SUPPORTED_MINISTRIES
};