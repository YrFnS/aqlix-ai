/**
 * Iraqi Enterprise Authentication - Arabic RTL Manager
 * Right-to-Left language support for Arabic authentication interfaces
 * 
 * Features:
 * - Automatic Arabic text detection and RTL application
 * - Mixed Arabic-English content handling
 * - Cultural-aware form layouts
 * - Arabic numeral support
 * - Government terminology localization
 * - Cultural design patterns for Iraqi users
 */

import type { LanguageConfiguration, RTLConfiguration } from '../interfaces/cultural';

export interface ArabicTextAnalysis {
  hasArabic: boolean;
  hasEnglish: boolean;
  arabicPercentage: number;
  textDirection: 'ltr' | 'rtl' | 'mixed';
  suggestedLayout: 'rtl' | 'ltr' | 'contextual';
  needsSpecialHandling: boolean;
}

export interface RTLInterfaceElements {
  forms: RTLFormConfiguration;
  navigation: RTLNavigationConfiguration;
  notifications: RTLNotificationConfiguration;
  modals: RTLModalConfiguration;
  tables: RTLTableConfiguration;
}

export interface RTLFormConfiguration {
  labelPosition: 'right' | 'left' | 'top';
  inputAlignment: 'right' | 'left' | 'contextual';
  buttonFlow: 'rtl' | 'ltr';
  validationMessagePosition: 'right' | 'left' | 'below';
  placeholderDirection: 'rtl' | 'ltr' | 'auto';
  helpTextPosition: 'right' | 'left' | 'below';
}

export interface GovernmentTerminology {
  ministry: { ar: string; en: string; };
  department: { ar: string; en: string; };
  employee: { ar: string; en: string; };
  authentication: { ar: string; en: string; };
  permission: { ar: string; en: string; };
  security: { ar: string; en: string; };
  clearance: { ar: string; en: string; };
}export class ArabicRTLManager {
  private langConfig: LanguageConfiguration;
  private rtlConfig: RTLConfiguration;
  private terminology: GovernmentTerminology;
  
  constructor(
    langConfig: LanguageConfiguration,
    rtlConfig: RTLConfiguration
  ) {
    this.langConfig = langConfig;
    this.rtlConfig = rtlConfig;
    this.initializeTerminology();
  }

  /**
   * Analyze text content for Arabic and determine RTL requirements
   */
  analyzeText(text: string): ArabicTextAnalysis {
    const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/g;
    const englishRegex = /[a-zA-Z]/g;
    
    const arabicMatches = text.match(arabicRegex) || [];
    const englishMatches = text.match(englishRegex) || [];
    const totalChars = text.replace(/\s/g, '').length;
    
    const hasArabic = arabicMatches.length > 0;
    const hasEnglish = englishMatches.length > 0;
    const arabicPercentage = totalChars > 0 ? (arabicMatches.length / totalChars) * 100 : 0;
    
    let textDirection: 'ltr' | 'rtl' | 'mixed';
    let suggestedLayout: 'rtl' | 'ltr' | 'contextual';
    
    if (arabicPercentage > 60) {
      textDirection = 'rtl';
      suggestedLayout = 'rtl';
    } else if (arabicPercentage < 20) {
      textDirection = 'ltr';
      suggestedLayout = 'ltr';
    } else {
      textDirection = 'mixed';
      suggestedLayout = 'contextual';
    }
    
    return {
      hasArabic,
      hasEnglish,
      arabicPercentage,
      textDirection,
      suggestedLayout,
      needsSpecialHandling: hasArabic && hasEnglish
    };
  }