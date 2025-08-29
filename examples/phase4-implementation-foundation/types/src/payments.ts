import { z } from 'zod';

// Iraqi Payment Gateway Types - Based on extracted payment integration patterns
export const IraqiPaymentGatewayEnum = z.enum(['ZainCash', 'FastPay', 'NassWallet', 'QiCard', 'MasterCard', 'Visa']);

export type IraqiPaymentGateway = z.infer<typeof IraqiPaymentGatewayEnum>;

// Payment Configuration Schema
export const PaymentConfigSchema = z.object({
  gateways: z.array(IraqiPaymentGatewayEnum).default(['ZainCash', 'FastPay', 'NassWallet']),
  islamicFinanceMode: z.boolean().default(true),
  culturalValidation: z.boolean().default(true),
  currency: z.enum(['IQD', 'USD', 'EUR']).default('IQD'),
  minimumAmount: z.number().min(0).default(1000), // 1000 IQD minimum
  maximumAmount: z.number().min(0).default(5000000), // 5M IQD maximum
  supportedLanguages: z.array(z.enum(['arabic', 'english', 'kurdish'])).default(['arabic', 'english'])
});

export type PaymentConfig = z.infer<typeof PaymentConfigSchema>;

// Payment Transaction Schema
export const PaymentTransactionSchema = z.object({
  id: z.string().uuid(),
  sessionId: z.string(),
  userId: z.string().optional(),
  gateway: IraqiPaymentGatewayEnum,
  amount: z.number().min(0),
  currency: z.enum(['IQD', 'USD', 'EUR']).default('IQD'),
  description: z.string().optional(),
  status: z.enum(['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded']).default('pending'),
  islamicCompliant: z.boolean().default(true),
  culturallyValidated: z.boolean().default(false),
  metadata: z.record(z.any()).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
  failureReason: z.string().optional(),
  refundedAt: z.string().datetime().optional(),
  gatewayTransactionId: z.string().optional(),
  gatewayResponse: z.record(z.any()).optional()
});

export type PaymentTransaction = z.infer<typeof PaymentTransactionSchema>;

// Islamic Finance Compliance Schema
export const IslamicFinanceComplianceSchema = z.object({
  isHalal: z.boolean(),
  ribaFree: z.boolean().default(true), // Free from interest/usury
  ghararFree: z.boolean().default(true), // Free from excessive uncertainty
  maysirFree: z.boolean().default(true), // Free from gambling
  halalCertified: z.boolean().default(false),
  shariahBoard: z.string().optional(),
  complianceNotes: z.array(z.string()).default([]),
  lastAuditDate: z.string().datetime().optional(),
  auditingAuthority: z.string().optional()
});

export type IslamicFinanceCompliance = z.infer<typeof IslamicFinanceComplianceSchema>;

// Payment Gateway Configuration
export const PaymentGatewayConfigSchema = z.object({
  ZainCash: z.object({
    enabled: z.boolean().default(true),
    minimumAmount: z.number().default(1000), // 1000 IQD
    maximumAmount: z.number().default(5000000), // 5M IQD
    currency: z.enum(['IQD']).default('IQD'),
    testMode: z.boolean().default(false),
    islamicCompliance: IslamicFinanceComplianceSchema
  }).optional(),
  FastPay: z.object({
    enabled: z.boolean().default(true),
    minimumAmount: z.number().default(500), // 500 IQD
    maximumAmount: z.number().default(2000000), // 2M IQD
    currency: z.enum(['IQD']).default('IQD'),
    testMode: z.boolean().default(false),
    islamicCompliance: IslamicFinanceComplianceSchema
  }).optional(),
  NassWallet: z.object({
    enabled: z.boolean().default(true),
    minimumAmount: z.number().default(1000), // 1000 IQD
    maximumAmount: z.number().default(3000000), // 3M IQD
    currency: z.enum(['IQD']).default('IQD'),
    testMode: z.boolean().default(false),
    islamicCompliance: IslamicFinanceComplianceSchema
  }).optional()
});

export type PaymentGatewayConfig = z.infer<typeof PaymentGatewayConfigSchema>;

// Payment Processing Result
export const PaymentProcessingResultSchema = z.object({
  transactionId: z.string(),
  success: z.boolean(),
  gateway: IraqiPaymentGatewayEnum,
  amount: z.number(),
  currency: z.enum(['IQD', 'USD', 'EUR']),
  status: z.enum(['completed', 'failed', 'pending']),
  islamicCompliance: IslamicFinanceComplianceSchema,
  culturalValidation: z.object({
    passed: z.boolean(),
    score: z.number().min(0).max(100),
    issues: z.array(z.string()).default([])
  }),
  processingTime: z.number().min(0),
  gatewayResponse: z.record(z.any()).optional(),
  errors: z.array(z.string()).default([])
});

export type PaymentProcessingResult = z.infer<typeof PaymentProcessingResultSchema>;

// Payment Security Schema
export const PaymentSecuritySchema = z.object({
  encryptionLevel: z.enum(['AES-256', 'RSA-2048', 'RSA-4096']).default('AES-256'),
  tokenization: z.boolean().default(true),
  pciCompliance: z.boolean().default(true),
  fraudDetection: z.boolean().default(true),
  multiFactorAuth: z.boolean().default(true),
  biometricAuth: z.boolean().default(false),
  ipWhitelisting: z.boolean().default(false),
  geoBlocking: z.boolean().default(false),
  auditLogging: z.boolean().default(true),
  realTimeMonitoring: z.boolean().default(true)
});

export type PaymentSecurity = z.infer<typeof PaymentSecuritySchema>;