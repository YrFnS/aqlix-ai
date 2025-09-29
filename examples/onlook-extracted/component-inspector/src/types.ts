import type { Node as BabelNode } from "@babel/types";

/**
 * Core Component Analysis Types
 * Enhanced for Iraqi government integration
 */

export interface ComponentInspectorConfig {
  cultural: CulturalConfig;
  performance: PerformanceConfig;
  accessibility: AccessibilityConfig;
  security: SecurityConfig;
  caching: CachingConfig;
}

export interface CulturalConfig {
  validation: {
    islamicCompliance: boolean;
    governmentStandards: boolean;
    ministrySpecific?: MinistryType;
  };
  language: {
    primary: "ar-IQ" | "ar" | "en-US";
    fallback: string;
    rtlOptimization: boolean;
  };
  patterns: {
    detectGovernmentPatterns: boolean;
    enforceIslamicDesign: boolean;
    validateCulturalContent: boolean;
  };
}

export interface PerformanceConfig {
  targets: {
    renderTime: number; // milliseconds
    bundleSize: string;
    accessibility: number; // percentage
  };
  arabic: {
    fontOptimization: boolean;
    rtlProfiling: boolean;
    mixedContentAnalysis: boolean;
  };
  profiling: {
    enableRealTime: boolean;
    sampleRate: number;
    metricsCollection: MetricType[];
  };
}

export interface AccessibilityConfig {
  standards: {
    wcag: "AA" | "AAA";
    iraqiGovernment: boolean;
    rtlCompliance: boolean;
  };
  testing: {
    automated: boolean;
    screenReaderTesting: boolean;
    keyboardNavigation: boolean;
  };
}

export interface SecurityConfig {
  dataProtection: boolean;
  governmentCompliance: boolean;
  privacyValidation: boolean;
}

export interface CachingConfig {
  enabled: boolean;
  ttl: number;
  strategies: ("memory" | "disk" | "distributed")[];
}

// Analysis Results Types

export interface ComponentAnalysis {
  id: string;
  timestamp: Date;
  component: ComponentInfo;
  cultural: CulturalCompliance;
  performance: PerformanceMetrics;
  accessibility: AccessibilityReport;
  security: SecurityReport;
  patterns: PatternMatch[];
  recommendations: Recommendation[];
}

export interface ComponentInfo {
  name: string;
  path: string;
  type: ComponentType;
  framework: "react" | "vue" | "angular" | "svelte";
  size: {
    loc: number; // lines of code
    bundleSize: number;
    memoryFootprint: number;
  };
  dependencies: Dependency[];
  exports: ComponentExport[];
}

export interface CulturalCompliance {
  score: number; // 0-100
  islamicCompliance: IslamicComplianceReport;
  governmentStandards: GovernmentStandardsReport;
  languageSupport: LanguageSupportReport;
  contentValidation: ContentValidationReport;
}

export interface IslamicComplianceReport {
  score: number;
  violations: IslamicViolation[];
  recommendations: string[];
  prayerTimeSupport: boolean;
  halaalContent: boolean;
  respectfulImagery: boolean;
}

export interface GovernmentStandardsReport {
  score: number;
  ministryCompliance: MinistryCompliance;
  officialBranding: boolean;
  dataProtection: boolean;
  accessibility: boolean;
}

export interface LanguageSupportReport {
  arabicSupport: number; // 0-100
  rtlCompliance: number; // 0-100
  fontOptimization: number; // 0-100
  textDirection: "ltr" | "rtl" | "auto";
  mixedContentHandling: boolean;
}

export interface ContentValidationReport {
  score: number;
  culturalSensitivity: number;
  appropriateImagery: boolean;
  respectfulLanguage: boolean;
  governmentTone: boolean;
}

export interface PerformanceMetrics {
  renderTime: number;
  bundleSize: number;
  memoryUsage: number;
  rtlMetrics: RTLMetrics;
  arabicFontMetrics: ArabicFontMetrics;
  vitals: WebVitals;
}

export interface RTLMetrics {
  renderTime: number;
  layoutShifts: number;
  textDirection: "ltr" | "rtl" | "auto";
  bidiCompliance: boolean;
  performanceImpact: number; // percentage
}

export interface ArabicFontMetrics {
  loadTime: number;
  renderQuality: number;
  supportedScripts: string[];
  fallbackChain: string[];
  optimizationScore: number;
}

export interface WebVitals {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
}

export interface AccessibilityReport {
  score: number; // 0-100
  wcagCompliance: WCAGCompliance;
  rtlAccessibility: RTLAccessibilityReport;
  governmentStandards: GovernmentAccessibilityReport;
  violations: AccessibilityViolation[];
  recommendations: AccessibilityRecommendation[];
}

export interface WCAGCompliance {
  level: "A" | "AA" | "AAA";
  score: number;
  violations: WCAGViolation[];
  passedRules: number;
  totalRules: number;
}

export interface RTLAccessibilityReport {
  score: number;
  keyboardNavigation: boolean;
  screenReaderSupport: boolean;
  textDirection: boolean;
  focusManagement: boolean;
}

export interface GovernmentAccessibilityReport {
  score: number;
  iraqiStandards: boolean;
  digitalGovernance: boolean;
  citizenAccess: boolean;
  multilingualSupport: boolean;
}

export interface SecurityReport {
  score: number;
  dataProtection: DataProtectionReport;
  privacyCompliance: PrivacyComplianceReport;
  governmentSecurity: GovernmentSecurityReport;
  vulnerabilities: SecurityVulnerability[];
}

export interface PatternMatch {
  id: string;
  name: string;
  type: PatternType;
  confidence: number; // 0-100
  compliance: number; // 0-100
  location: SourceLocation;
  suggestions: string[];
  culturalRelevance: number;
}

export interface Recommendation {
  id: string;
  type: RecommendationType;
  priority: "low" | "medium" | "high" | "critical";
  category: "performance" | "accessibility" | "cultural" | "security";
  title: string;
  description: string;
  implementation: string;
  impact: ImpactAssessment;
}

// Supporting Types

export type ComponentType =
  | "functional"
  | "class"
  | "hook"
  | "provider"
  | "hoc"
  | "page"
  | "layout"
  | "widget";

export type MinistryType =
  | "interior"
  | "education"
  | "health"
  | "finance"
  | "defense"
  | "justice"
  | "foreign"
  | "transport"
  | "communication";

export type PatternType =
  | "government-form"
  | "ministry-header"
  | "prayer-notice"
  | "arabic-content-block"
  | "citizen-portal"
  | "official-document"
  | "cultural-component";

export type MetricType =
  | "render-time"
  | "bundle-size"
  | "memory-usage"
  | "accessibility"
  | "cultural-compliance"
  | "rtl-performance";

export type RecommendationType =
  | "optimization"
  | "compliance"
  | "accessibility"
  | "security"
  | "cultural"
  | "performance";

export interface Dependency {
  name: string;
  version: string;
  type: "runtime" | "dev" | "peer";
  culturalRelevance?: boolean;
  securityRisk?: "low" | "medium" | "high";
}

export interface ComponentExport {
  name: string;
  type: "default" | "named";
  signature?: string;
}

export interface MinistryCompliance {
  ministry: MinistryType;
  score: number;
  requirements: string[];
  compliance: boolean;
}

export interface IslamicViolation {
  type: string;
  severity: "low" | "medium" | "high";
  description: string;
  location?: SourceLocation;
  recommendation: string;
}

export interface AccessibilityViolation {
  rule: string;
  impact: "minor" | "moderate" | "serious" | "critical";
  description: string;
  element?: string;
  recommendation: string;
}

export interface WCAGViolation {
  rule: string;
  level: "A" | "AA" | "AAA";
  principle: string;
  guideline: string;
  description: string;
  element?: string;
  recommendation: string;
}

export interface AccessibilityRecommendation {
  type: string;
  priority: "low" | "medium" | "high";
  description: string;
  implementation: string;
  testing: string;
}

export interface DataProtectionReport {
  score: number;
  piiHandling: boolean;
  encryption: boolean;
  accessControls: boolean;
  auditLogging: boolean;
}

export interface PrivacyComplianceReport {
  score: number;
  consentManagement: boolean;
  dataMinimization: boolean;
  rightToDelete: boolean;
  transparencyMeasures: boolean;
}

export interface GovernmentSecurityReport {
  score: number;
  classification: "public" | "internal" | "confidential" | "secret";
  complianceFramework: string[];
  securityControls: string[];
}

export interface SecurityVulnerability {
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  cve?: string;
  mitigation: string;
}

export interface SourceLocation {
  file: string;
  line: number;
  column: number;
  length?: number;
}

export interface ImpactAssessment {
  performance: number; // percentage improvement
  accessibility: number;
  cultural: number;
  security: number;
  effort: "low" | "medium" | "high";
  timeline: string;
}

// AST and DOM Analysis Types

export interface ASTNode extends BabelNode {
  culturalContext?: CulturalContext;
  performanceImpact?: number;
  accessibilityRole?: string;
}

export interface CulturalContext {
  language: string;
  direction: "ltr" | "rtl";
  islamicCompliance: boolean;
  governmentRelevance: boolean;
}

export interface DOMElementInfo {
  tagName: string;
  attributes: Record<string, string>;
  styles: ComputedStyles;
  children: DOMElementInfo[];
  culturalMetadata: CulturalMetadata;
  accessibilityInfo: AccessibilityInfo;
}

export interface ComputedStyles {
  direction: "ltr" | "rtl";
  fontFamily: string;
  fontSize: string;
  color: string;
  backgroundColor: string;
  [key: string]: string;
}

export interface CulturalMetadata {
  language: string;
  script: string;
  textDirection: "ltr" | "rtl";
  culturalTags: string[];
}

export interface AccessibilityInfo {
  role: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  tabIndex: number;
  focusable: boolean;
}

// Cache Types

export interface CacheEntry<T> {
  key: string;
  value: T;
  timestamp: Date;
  ttl: number;
  metadata?: Record<string, any>;
}

export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  maxSize: number;
  hitRate: number;
}

// Event Types

export type InspectorEvent =
  | "analysis-started"
  | "analysis-completed"
  | "performance-issue"
  | "cultural-violation"
  | "accessibility-issue"
  | "pattern-detected"
  | "error";

export interface EventPayload {
  type: InspectorEvent;
  timestamp: Date;
  componentId?: string;
  data: any;
}
