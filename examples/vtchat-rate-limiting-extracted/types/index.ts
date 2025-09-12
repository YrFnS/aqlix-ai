/**
 * TypeScript Types and Interfaces for Iraqi AI Rate Limiting System
 * Enhanced vtchat extraction with Iraqi-specific features
 */

// ====================== Core Rate Limiting Types ======================

export type RateLimitInterval = 'minute' | 'hour' | 'day' | 'month';

export type SubscriptionTier = 'trial' | 'basic' | 'premium' | 'organization';

export type ProfessionalDomain = 'legal' | 'medical' | 'educational' | 'business' | 'engineering';

export type IraqiPaymentGateway = 'zaincash' | 'fastpay' | 'nasswallet';

export type OperationType = 'chat' | 'translation' | 'cultural_validation' | 'document_processing' | 'image_generation';

export type RateLimitStatus = 'allowed' | 'rate_limited' | 'quota_exceeded' | 'budget_exceeded';

// ====================== Rate Limiting Configuration ======================

export interface RateLimitConfig {
  requests: number;
  interval: RateLimitInterval;
  windowMs: number;
  skipFailedRequests?: boolean;
  skipSuccessfulRequests?: boolean;
  keyGenerator?: (identifier: string) => string;
}

export interface IraqiRateLimitConfig {
  guestLimit: RateLimitConfig;
  registeredLimit: RateLimitConfig;
  premiumLimit: RateLimitConfig;
  organizationLimit: RateLimitConfig;
  professionalDomainMultipliers: Record<ProfessionalDomain, number>;
  arabicTranslationLimits: RateLimitConfig;
  culturalValidationLimits: RateLimitConfig;
}

// ====================== User and Context Types ======================

export interface IraqiUser {
  id: string;
  email: string;
  subscriptionTier: SubscriptionTier;
  professionalDomain?: ProfessionalDomain;
  preferredLanguage: 'ar' | 'en' | 'ar-iq';
  isVerifiedProfessional: boolean;
  organizationId?: string;
  culturalComplianceLevel: 'basic' | 'standard' | 'strict';
  createdAt: Date;
  lastActiveAt: Date;
}

export interface RequestContext {
  userId?: string;
  sessionId: string;
  operationType: OperationType;
  professionalDomain?: ProfessionalDomain;
  requiresCulturalValidation: boolean;
  isArabicContent: boolean;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

// ====================== Rate Limit Response Types ======================

export interface RateLimitResult {
  allowed: boolean;
  status: RateLimitStatus;
  limit: number;
  remaining: number;
  resetTime: Date;
  retryAfter?: number;
  errorMessage?: string;
  culturalComplianceRequired?: boolean;
}

export interface RateLimitMetrics {
  totalRequests: number;
  successfulRequests: number;
  rateLimitedRequests: number;
  quotaExceededRequests: number;
  budgetExceededRequests: number;
  averageResponseTime: number;
  culturalViolations: number;
  arabicProcessingTime: number;
}

// ====================== Budget and Pricing Types ======================

export interface IraqiPricing {
  chatRequest: number; // Cost in IQD
  translationRequest: number;
  culturalValidationRequest: number;
  documentProcessingRequest: number;
  imageGenerationRequest: number;
  professionalDomainMultipliers: Record<ProfessionalDomain, number>;
  paymentGatewayFees: Record<IraqiPaymentGateway, number>;
}

export interface BudgetAllocation {
  totalBudget: number; // In IQD
  spentAmount: number;
  remainingBudget: number;
  monthlyAllocation: number;
  dailyAllocation: number;
  professionalDomainAllocation?: number;
  culturalValidationAllocation: number;
  arabicTranslationAllocation: number;
}

export interface BudgetUsage {
  operationType: OperationType;
  cost: number; // In IQD
  timestamp: Date;
  userId: string;
  professionalDomain?: ProfessionalDomain;
  culturallyValidated: boolean;
  paymentGateway?: IraqiPaymentGateway;
}

// ====================== Payment Gateway Types ======================

export interface PaymentGatewayConfig {
  gateway: IraqiPaymentGateway;
  merchantId: string;
  apiKey: string;
  secretKey: string;
  webhookUrl: string;
  currency: 'IQD';
  minAmount: number;
  maxAmount: number;
  isActive: boolean;
}

export interface PaymentRequest {
  amount: number; // In IQD
  currency: 'IQD';
  description: string;
  customerEmail: string;
  customerId: string;
  subscriptionTier: SubscriptionTier;
  professionalDomain?: ProfessionalDomain;
  culturalComplianceRequired: boolean;
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  paymentUrl?: string;
  errorMessage?: string;
  estimatedProcessingTime: number; // In seconds
  gateway: IraqiPaymentGateway;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
}

// ====================== Quota Management Types ======================

export interface QuotaConfig {
  subscriptionTier: SubscriptionTier;
  monthlyRequests: number;
  dailyRequests: number;
  hourlyRequests: number;
  concurrentRequests: number;
  professionalDomainBonus?: number;
  arabicTranslationQuota: number;
  culturalValidationQuota: number;
  documentProcessingQuota: number;
  imageGenerationQuota: number;
}

export interface QuotaUsage {
  period: 'hour' | 'day' | 'month';
  used: number;
  limit: number;
  remaining: number;
  resetTime: Date;
  overageAllowed: boolean;
  overageCost?: number; // In IQD
}

export interface QuotaAllowance {
  allowed: boolean;
  quotaUsage: QuotaUsage;
  operationType: OperationType;
  estimatedCost?: number; // In IQD
  requiresUpgrade?: boolean;
  recommendedTier?: SubscriptionTier;
}

// ====================== Cultural and Arabic Processing Types ======================

export interface CulturalValidationRequest {
  content: string;
  language: 'ar' | 'en' | 'ar-iq';
  professionalDomain?: ProfessionalDomain;
  strictnessLevel: 'basic' | 'standard' | 'strict';
  checkIslamicCompliance: boolean;
  checkPoliticalNeutrality: boolean;
}

export interface CulturalValidationResult {
  isValid: boolean;
  complianceScore: number; // 0-100
  violations: string[];
  suggestions: string[];
  islamicComplianceScore: number;
  politicalNeutralityScore: number;
  processingTimeMs: number;
}

export interface ArabicProcessingRequest {
  text: string;
  dialect: 'iraqi' | 'standard' | 'gulf' | 'levantine';
  operation: 'rtl_format' | 'dialect_detect' | 'translation' | 'grammar_check';
  preserveFormatting: boolean;
}

export interface ArabicProcessingResult {
  processedText: string;
  detectedDialect: string;
  rtlAccuracy: number; // Percentage
  processingTimeMs: number;
  errors: string[];
  suggestions: string[];
}

// ====================== Professional Domain Types ======================

export interface ProfessionalContext {
  domain: ProfessionalDomain;
  organizationId?: string;
  licenseNumber?: string;
  verificationStatus: 'unverified' | 'pending' | 'verified';
  specializations: string[];
  complianceRequirements: string[];
  culturalSensitivityLevel: 'standard' | 'high' | 'critical';
}

export interface ProfessionalRateLimit {
  domain: ProfessionalDomain;
  baseLimit: number;
  domainMultiplier: number;
  effectiveLimit: number;
  specializationBonus: number;
  complianceOverhead: number;
  culturalValidationRequired: boolean;
}

// ====================== Hook Types for React Integration ======================

export interface UseRateLimitOptions {
  userId?: string;
  operationType: OperationType;
  autoRefresh?: boolean;
  refreshInterval?: number; // In milliseconds
  professionalDomain?: ProfessionalDomain;
  enableBudgetTracking?: boolean;
}

export interface UseRateLimitReturn {
  canMakeRequest: boolean;
  rateLimitStatus: RateLimitResult | null;
  budgetStatus: BudgetAllocation | null;
  quotaStatus: QuotaUsage | null;
  isLoading: boolean;
  error: string | null;
  checkRateLimit: () => Promise<RateLimitResult>;
  refreshStatus: () => void;
  estimateCost: (operationType: OperationType) => number;
}

// ====================== API Response Types ======================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    requestId: string;
    timestamp: Date;
    processingTimeMs: number;
    culturallyValidated: boolean;
    arabicProcessed: boolean;
  };
}

export interface RateLimitApiResponse extends ApiResponse<RateLimitResult> {
  headers: {
    'X-RateLimit-Limit': string;
    'X-RateLimit-Remaining': string;
    'X-RateLimit-Reset': string;
    'X-RateLimit-Retry-After'?: string;
  };
}

// ====================== Error Types ======================

export interface RateLimitError extends Error {
  code: 'RATE_LIMIT_EXCEEDED' | 'QUOTA_EXCEEDED' | 'BUDGET_EXCEEDED' | 'CULTURAL_VIOLATION' | 'ARABIC_PROCESSING_ERROR';
  statusCode: number;
  retryAfter?: number;
  remainingQuota?: number;
  culturalViolations?: string[];
  arabicProcessingErrors?: string[];
}

export interface PaymentGatewayError extends Error {
  code: 'PAYMENT_FAILED' | 'GATEWAY_TIMEOUT' | 'INSUFFICIENT_FUNDS' | 'INVALID_CREDENTIALS';
  gateway: IraqiPaymentGateway;
  transactionId?: string;
  statusCode: number;
}

// ====================== Configuration and Environment Types ======================

export interface IraqiRateLimitEnvironment {
  redisUrl: string;
  redisPassword?: string;
  redisDb: number;
  zaincashApiKey: string;
  zaincashSecretKey: string;
  fastpayMerchantId: string;
  fastpayApiKey: string;
  nasswalletClientId: string;
  nasswalletClientSecret: string;
  culturalValidationApiUrl: string;
  arabicProcessingApiUrl: string;
  defaultCurrency: 'IQD';
  enableDebugMode: boolean;
  enableCulturalLogging: boolean;
}

// ====================== Database Schema Types ======================

export interface RateLimitRecord {
  id: string;
  userId?: string;
  sessionId: string;
  operationType: OperationType;
  requestCount: number;
  lastRequestTime: Date;
  resetTime: Date;
  professionalDomain?: ProfessionalDomain;
  culturallyValidated: boolean;
  arabicProcessed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BudgetRecord {
  id: string;
  userId: string;
  subscriptionTier: SubscriptionTier;
  totalBudget: number; // In IQD
  spentAmount: number;
  lastUpdated: Date;
  billingCycle: 'monthly' | 'annual';
  professionalDomain?: ProfessionalDomain;
  culturalValidationSpend: number;
  arabicTranslationSpend: number;
  paymentGateway: IraqiPaymentGateway;
  createdAt: Date;
}

// ====================== Utility Types ======================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type IraqiRateLimitConfigPartial = DeepPartial<IraqiRateLimitConfig>;

export type RequireField<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalField<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// ====================== Export All Types ======================

export default {
  // Core types
  RateLimitInterval,
  SubscriptionTier,
  ProfessionalDomain,
  IraqiPaymentGateway,
  OperationType,
  RateLimitStatus,
  
  // Configuration types
  RateLimitConfig,
  IraqiRateLimitConfig,
  
  // User and context types
  IraqiUser,
  RequestContext,
  
  // Response types
  RateLimitResult,
  RateLimitMetrics,
  
  // Budget types
  IraqiPricing,
  BudgetAllocation,
  BudgetUsage,
  
  // Payment types
  PaymentGatewayConfig,
  PaymentRequest,
  PaymentResponse,
  
  // Quota types
  QuotaConfig,
  QuotaUsage,
  QuotaAllowance,
  
  // Cultural and Arabic types
  CulturalValidationRequest,
  CulturalValidationResult,
  ArabicProcessingRequest,
  ArabicProcessingResult,
  
  // Professional domain types
  ProfessionalContext,
  ProfessionalRateLimit,
  
  // Hook types
  UseRateLimitOptions,
  UseRateLimitReturn,
  
  // API types
  ApiResponse,
  RateLimitApiResponse,
  
  // Error types
  RateLimitError,
  PaymentGatewayError,
  
  // Environment types
  IraqiRateLimitEnvironment,
  
  // Database types
  RateLimitRecord,
  BudgetRecord,
  
  // Utility types
  DeepPartial,
  IraqiRateLimitConfigPartial,
  RequireField,
  OptionalField,
};