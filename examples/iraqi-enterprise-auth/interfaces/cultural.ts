/**
 * Iraqi Enterprise Authentication - Cultural and Islamic Compliance
 * Cultural awareness and Islamic compliance for government systems
 */

// Prayer Time Management
export interface PrayerWindow {
  name: "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";
  nameAr: string; // Arabic name
  startTime: Date;
  endTime: Date;
  isCurrentWindow: boolean;
  restrictionLevel: "none" | "notification" | "approval_required" | "blocked";
}

export interface PrayerTimeCalculator {
  location: GeographicLocation;
  calculationMethod:
    | "university_of_islamic_sciences"
    | "iraq_sunni_endowment"
    | "customs";
  adjustments: {
    fajr: number; // minutes adjustment
    dhuhr: number;
    asr: number;
    maghrib: number;
    isha: number;
  };
}

export interface IslamicCalendar {
  hijriDate: string; // Format: YYYY-MM-DD
  isRamadan: boolean;
  isHajjSeason: boolean;
  isEidPeriod: boolean;
  specialObservance?: string; // Special Islamic observances
}

// Cultural Compliance
export interface CulturalComplianceResult {
  isCompliant: boolean;
  violations: CulturalViolation[];
  recommendations: string[];
  culturalScore: number; // 0-100
  islamicComplianceScore: number; // 0-100
}
export interface CulturalViolation {
  type: "content" | "timing" | "access" | "display" | "language";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  descriptionAr: string;
  recommendation: string;
  context: string;
}

// RTL and Language Support
export interface LanguageConfiguration {
  primaryLanguage: "ar" | "en" | "ku";
  fallbackLanguage: "ar" | "en";
  rtlSupport: boolean;
  arabicNumerals: boolean;
  dateFormat: "gregorian" | "hijri" | "both";
  timeFormat: "12h" | "24h";
  culturalNaming: boolean; // Use cultural naming conventions
}

export interface RTLConfiguration {
  enabled: boolean;
  autoDetection: boolean;
  mixedContentHandling: "separate" | "inline" | "contextual";
  numeralsDirection: "ltr" | "rtl" | "contextual";
  layoutMirroring: boolean;
}

// Geographic Location (imported reference)
interface GeographicLocation {
  country: string;
  governorate: string;
  city: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}
