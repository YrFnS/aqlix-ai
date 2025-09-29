/**
 * Iraqi AI Chat Desktop - Core Application Types
 * Comprehensive type definitions with cultural and professional domain support
 */

// Core Language and Direction Types
export type LanguageCode =
  | "ar"
  | "ar-IQ"
  | "ar-SA"
  | "ar-EG" // Arabic variants
  | "en"
  | "en-US"
  | "en-GB" // English variants
  | "ku" // Kurdish (Iraq)
  | "fa" // Persian (for historical/cultural context)
  | "tr" // Turkish (regional influence)
  | "fr"
  | "de"
  | "es"; // International languages

export type LanguageDirection = "ltr" | "rtl";
export type TextAlignment =
  | "left"
  | "right"
  | "center"
  | "justify"
  | "start"
  | "end";
export type ThemeMode = "light" | "dark" | "system";

// Cultural and Professional Types
export type CulturalMode =
  | "standard" // Default mode
  | "prayer_aware" // Respects prayer times
  | "ramadan_mode" // Special Ramadan considerations
  | "government_mode" // Official government styling
  | "emergency_mode"; // Crisis communication

export type ProfessionalDomain =
  | "general" // General public use
  | "legal" // Legal profession
  | "medical" // Healthcare
  | "educational" // Education sector
  | "engineering" // Engineering/technical
  | "business" // Business/commerce
  | "government"; // Government/public sector

export type IraqiGovernorate =
  | "baghdad"
  | "basra"
  | "mosul"
  | "erbil"
  | "najaf"
  | "karbala"
  | "sulaymaniyah"
  | "duhok"
  | "kirkuk"
  | "anbar"
  | "diyala"
  | "babylon"
  | "wasit"
  | "maysan"
  | "dhi_qar"
  | "muthanna"
  | "qadisiyyah"
  | "saladin";

// UI and Layout Types
export type ViewMode =
  | "chat"
  | "documents"
  | "analytics"
  | "settings"
  | "profile"
  | "notifications"
  | "professional";

export type ConnectionQuality = "excellent" | "good" | "poor" | "offline";

export type NotificationPriority = "low" | "medium" | "high" | "critical";

export type NotificationType =
  | "system"
  | "chat"
  | "cultural"
  | "professional"
  | "security"
  | "update"
  | "payment";

// Chat and Communication Types
export interface ChatMessage {
  id: string;
  content: string;
  contentAr?: string;
  contentEn?: string;
  timestamp: Date;
  type: "user" | "assistant" | "system";
  direction: LanguageDirection;
  culturalContext?: CulturalContext;
  professionalContext?: ProfessionalContext;
  metadata?: MessageMetadata;
}

export interface ChatSession {
  id: string;
  title: string;
  titleAr?: string;
  titleEn?: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  culturalMode: CulturalMode;
  professionalDomain: ProfessionalDomain;
  language: LanguageCode;
  isArchived: boolean;
  tags: string[];
  metadata?: SessionMetadata;
}

export interface MessageMetadata {
  tokenCount?: number;
  processingTime?: number;
  culturalValidation?: CulturalValidationResult;
  professionalValidation?: ProfessionalValidationResult;
  translationInfo?: TranslationInfo;
}

export interface SessionMetadata {
  totalMessages: number;
  totalTokens: number;
  averageResponseTime: number;
  culturalComplianceScore: number;
  professionalAccuracyScore: number;
  lastActivity: Date;
}

// Cultural Context Types
export interface CulturalContext {
  mode: CulturalMode;
  prayerTimeAware: boolean;
  islamicCompliance: boolean;
  culturalSensitivity: CulturalSensitivityLevel;
  regionalContext?: IraqiGovernorate;
  dialectSupport?: IraqiDialect;
}

export type CulturalSensitivityLevel = "low" | "medium" | "high" | "maximum";

export type IraqiDialect =
  | "baghdadi" // Baghdad dialect
  | "basrawi" // Basra dialect
  | "moslawi" // Mosul dialect
  | "southern" // Southern Iraq
  | "kurdish_arab" // Kurdish-influenced Arabic
  | "standard"; // Standard Arabic

export interface CulturalValidationResult {
  isCompliant: boolean;
  complianceScore: number; // 0-100
  issues: CulturalIssue[];
  recommendations: string[];
  islamicCompliance: boolean;
  politicalNeutrality: boolean;
}

export interface CulturalIssue {
  type: "religious" | "political" | "social" | "linguistic";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  descriptionAr: string;
  suggestion: string;
  suggestionAr: string;
}

// Professional Context Types
export interface ProfessionalContext {
  domain: ProfessionalDomain;
  certification?: ProfessionalCertification;
  expertise: ExpertiseLevel;
  regulatoryCompliance?: RegulatoryCompliance;
  ethicalGuidelines?: EthicalGuidelines;
}

export type ExpertiseLevel =
  | "student"
  | "junior"
  | "intermediate"
  | "senior"
  | "expert";

export interface ProfessionalCertification {
  type: string;
  issuer: string;
  issuerAr: string;
  validUntil?: Date;
  verificationCode?: string;
}

export interface RegulatoryCompliance {
  domain: ProfessionalDomain;
  requirements: string[];
  certifications: ProfessionalCertification[];
  lastAudit?: Date;
  complianceScore: number; // 0-100
}

export interface EthicalGuidelines {
  domain: ProfessionalDomain;
  principles: string[];
  principlesAr: string[];
  restrictions: string[];
  restrictionsAr: string[];
}

export interface ProfessionalValidationResult {
  isValid: boolean;
  accuracyScore: number; // 0-100
  ethicalCompliance: boolean;
  regulatoryCompliance: boolean;
  expertiseAlignment: boolean;
  issues: ProfessionalIssue[];
  recommendations: string[];
}

export interface ProfessionalIssue {
  type: "accuracy" | "ethics" | "regulation" | "expertise";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  descriptionAr: string;
  reference?: string;
  suggestion: string;
  suggestionAr: string;
}

// Translation and Language Types
export interface TranslationInfo {
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  translationType: TranslationType;
  qualityScore: number; // 0-100
  dialectHandling?: DialectHandling;
  culturalAdaptation?: CulturalAdaptation;
}

export type TranslationType =
  | "direct"
  | "cultural"
  | "professional"
  | "technical"
  | "literary";

export interface DialectHandling {
  sourceDialect?: IraqiDialect;
  targetDialect?: IraqiDialect;
  preserveOriginal: boolean;
  adaptationLevel: "none" | "light" | "moderate" | "heavy";
}

export interface CulturalAdaptation {
  level: "none" | "minimal" | "moderate" | "extensive";
  adaptations: string[];
  preservedElements: string[];
  culturalNotes?: string;
}

// Application State Types
export interface AppState {
  app: AppSliceState;
  chat: ChatSliceState;
  professional: ProfessionalSliceState;
  cultural: CulturalSliceState;
  settings: SettingsSliceState;
  notifications: NotificationsSliceState;
  offline: OfflineSliceState;
}

export interface AppSliceState {
  language: LanguageCode;
  theme: ThemeMode;
  direction: LanguageDirection;
  culturalMode: CulturalMode;
  currentView: ViewMode;
  isLoading: boolean;
  sidebarCollapsed: boolean;
  settingsPanelOpen: boolean;
  isInitialized: boolean;
  lastActivity: Date;
  version: string;
}

export interface ChatSliceState {
  currentSession?: ChatSession;
  recentChats: ChatSession[];
  archivedChats: ChatSession[];
  searchQuery: string;
  isTyping: boolean;
  connectionStatus: ConnectionQuality;
  messageQueue: ChatMessage[];
  rateLimitInfo?: RateLimitInfo;
}

export interface ProfessionalSliceState {
  currentDomain: ProfessionalDomain;
  availableDomains: ProfessionalDomain[];
  certifications: ProfessionalCertification[];
  compliance: Record<ProfessionalDomain, RegulatoryCompliance>;
  expertise: Record<ProfessionalDomain, ExpertiseLevel>;
  quotas: Record<ProfessionalDomain, QuotaInfo>;
}

export interface CulturalSliceState {
  activeMode: CulturalMode;
  prayerTimes?: PrayerTimes;
  culturalCalendar?: CulturalEvent[];
  complianceSettings: CulturalComplianceSettings;
  validationHistory: CulturalValidationResult[];
  regionalSettings?: RegionalSettings;
}

export interface SettingsSliceState {
  appearance: AppearanceSettings;
  privacy: PrivacySettings;
  professional: ProfessionalSettings;
  cultural: CulturalSettings;
  accessibility: AccessibilitySettings;
  advanced: AdvancedSettings;
}

export interface NotificationsSliceState {
  notifications: Notification[];
  unreadCount: number;
  settings: NotificationSettings;
  culturalFiltering: boolean;
  professionalFiltering: boolean;
}

export interface OfflineSliceState {
  isOnline: boolean;
  lastOnline: Date;
  pendingSync: SyncItem[];
  offlineCapabilities: OfflineCapability[];
  syncInProgress: boolean;
  connectionQuality: ConnectionQuality;
}

// Configuration and Settings Types
export interface LayoutConfig {
  direction: LanguageDirection;
  theme: ThemeMode;
  culturalMode: CulturalMode;
  sidebar: SidebarConfig;
  header: HeaderConfig;
  content: ContentConfig;
}

export interface SidebarConfig {
  collapsed: boolean;
  width: number;
  collapsedWidth: number;
  position: "left" | "right";
  showDomainIndicator: boolean;
  showCulturalMode: boolean;
}

export interface HeaderConfig {
  height: number;
  showLogo: boolean;
  showLanguageToggle: boolean;
  showThemeToggle: boolean;
  showProfessionalMode: boolean;
}

export interface ContentConfig {
  maxWidth: number;
  padding: number;
  showCulturalBanner: boolean;
  adaptiveLayout: boolean;
}

export interface AppearanceSettings {
  theme: ThemeMode;
  accentColor: string;
  fontSize: "small" | "medium" | "large" | "extra-large";
  fontFamily: string;
  arabicFont: string;
  englishFont: string;
  animationsEnabled: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
}

export interface PrivacySettings {
  dataCollection: boolean;
  analytics: boolean;
  crashReporting: boolean;
  personalizedContent: boolean;
  locationAccess: boolean;
  cameraAccess: boolean;
  microphoneAccess: boolean;
  notificationTracking: boolean;
}

export interface ProfessionalSettings {
  defaultDomain: ProfessionalDomain;
  autoDetectDomain: boolean;
  showCertifications: boolean;
  complianceLevel: "basic" | "standard" | "strict";
  ethicalFiltering: boolean;
  regulatoryAlerts: boolean;
}

export interface CulturalSettings {
  defaultMode: CulturalMode;
  autoDetectCulture: boolean;
  islamicCompliance: boolean;
  prayerTimeAlerts: boolean;
  ramadanMode: boolean;
  culturalSensitivity: CulturalSensitivityLevel;
  dialectPreference: IraqiDialect;
  regionalContext: IraqiGovernorate;
}

export interface AccessibilitySettings {
  screenReader: boolean;
  highContrast: boolean;
  largeText: boolean;
  keyboardNavigation: boolean;
  reducedMotion: boolean;
  voiceCommands: boolean;
  rtlSupport: boolean;
  colorBlindnessSupport: "none" | "protanopia" | "deuteranopia" | "tritanopia";
}

export interface AdvancedSettings {
  debugMode: boolean;
  experimentalFeatures: boolean;
  telemetry: boolean;
  autoUpdates: boolean;
  offlineMode: boolean;
  syncInterval: number; // minutes
  cacheSize: number; // MB
  logLevel: "error" | "warn" | "info" | "debug";
}

// Utility Types
export interface RateLimitInfo {
  remaining: number;
  total: number;
  resetTime: Date;
  tier: SubscriptionTier;
  culturalAdjustments?: CulturalRateLimitAdjustment;
}

export interface CulturalRateLimitAdjustment {
  mode: CulturalMode;
  multiplier: number;
  reason: string;
  validUntil?: Date;
}

export interface QuotaInfo {
  used: number;
  limit: number;
  period: "daily" | "weekly" | "monthly";
  resetDate: Date;
}

export interface PrayerTimes {
  date: Date;
  fajr: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
  sunrise: Date;
  location: IraqiGovernorate;
}

export interface CulturalEvent {
  id: string;
  name: string;
  nameAr: string;
  date: Date;
  type: "religious" | "national" | "cultural";
  description?: string;
  descriptionAr?: string;
  impact?: CulturalImpact;
}

export interface CulturalImpact {
  adjustments: string[];
  restrictions?: string[];
  recommendations?: string[];
  duration?: number; // days
}

export interface CulturalComplianceSettings {
  level: CulturalSensitivityLevel;
  islamicCompliance: boolean;
  politicalNeutrality: boolean;
  socialSensitivity: boolean;
  linguisticAdaptation: boolean;
  autoCorrection: boolean;
}

export interface RegionalSettings {
  governorate: IraqiGovernorate;
  timezone: string;
  currency: string;
  dateFormat: string;
  timeFormat: "12h" | "24h";
  weekStart: "saturday" | "sunday" | "monday";
}

export interface Notification {
  id: string;
  title: string;
  titleAr?: string;
  message: string;
  messageAr?: string;
  type: NotificationType;
  priority: NotificationPriority;
  timestamp: Date;
  read: boolean;
  action?: NotificationAction;
  culturalContext?: CulturalContext;
  professionalContext?: ProfessionalContext;
}

export interface NotificationAction {
  type: string;
  label: string;
  labelAr?: string;
  handler: string;
  params?: Record<string, any>;
}

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
  desktop: boolean;
  cultural: boolean;
  professional: boolean;
  priority: NotificationPriority[];
  quietHours?: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

export interface SyncItem {
  id: string;
  type: "chat" | "settings" | "profile" | "document";
  action: "create" | "update" | "delete";
  data: any;
  timestamp: Date;
  retryCount: number;
}

export interface OfflineCapability {
  feature: string;
  available: boolean;
  limitations?: string[];
  syncRequired: boolean;
}

export type SubscriptionTier =
  | "guest" // No subscription
  | "basic" // Basic tier
  | "premium" // Premium individual
  | "professional" // Professional domain
  | "organization" // Organization/enterprise
  | "government"; // Government/public sector

// Event and Error Types
export interface AppEvent {
  type: string;
  payload?: any;
  timestamp: Date;
  source: "user" | "system" | "cultural" | "professional";
  culturalContext?: CulturalContext;
  professionalContext?: ProfessionalContext;
}

export interface AppError {
  code: string;
  message: string;
  messageAr?: string;
  type: "system" | "user" | "cultural" | "professional" | "network";
  severity: "low" | "medium" | "high" | "critical";
  timestamp: Date;
  context?: any;
  suggestion?: string;
  suggestionAr?: string;
}

// Component Props Types (commonly used)
export interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  isRTL?: boolean;
  culturalMode?: CulturalMode;
  professionalDomain?: ProfessionalDomain;
  dir?: LanguageDirection;
}

export interface InteractiveComponentProps extends BaseComponentProps {
  onClick?: () => void;
  onDoubleClick?: () => void;
  onContextMenu?: () => void;
  disabled?: boolean;
  loading?: boolean;
  tooltip?: string;
  tooltipAr?: string;
}

// Export all types
export default AppState;
