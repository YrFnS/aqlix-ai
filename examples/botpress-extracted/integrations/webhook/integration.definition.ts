/**
 * Enhanced Webhook Security Integration for Iraqi AI Chat System
 * Extracted from Botpress/integrations/webhook/integration.definition.ts
 * Enhanced with Iraqi payment gateway security and cultural validation
 */

import { IntegrationDefinition } from '@botpress/client';
import { z } from 'zod';

// Iraqi payment gateway configurations
const IraqiPaymentGateways = {
  ZAINCASH: 'zaincash',
  FASTPAY: 'fastpay',
  NASSWALLET: 'nasswallet'
} as const;

// Enhanced security validation schemas
const iraqiPhoneSchema = z.string().regex(
  /^(\+964|0)(77|78|79|75|73)\d{8}$/,
  'رقم الهاتف العراقي غير صحيح' // Invalid Iraqi phone number
);

const iraqiPaymentAmountSchema = z.object({
  amount: z.number().min(500).max(1000000), // 500 IQD to 1M IQD
  currency: z.literal('IQD'),
  gateway: z.enum([IraqiPaymentGateways.ZAINCASH, IraqiPaymentGateways.FASTPAY, IraqiPaymentGateways.NASSWALLET])
});

const culturalContentSchema = z.object({
  content: z.string(),
  language: z.enum(['arabic', 'english', 'mixed']),
  culturalCompliance: z.boolean().default(true),
  islamicCompliance: z.enum(['strict', 'moderate', 'flexible']).default('moderate'),
  professionalDomain: z.enum(['general', 'legal', 'medical', 'educational', 'government']).default('general')
});

export default {
  name: 'iraqi-enhanced-webhook',
  version: '2.0.0',
  title: 'Iraqi Enhanced Webhook Integration',
  description: 'Enhanced webhook integration with Iraqi payment security and cultural validation',
  icon: 'https://cdn-icons-png.flaticon.com/512/3281/3281289.png',
  readme: 'docs/readme.md',
  
  configuration: {
    schema: z.object({
      // Basic webhook configuration
      url: z.string().url('يجب أن يكون الرابط صحيحاً'), // URL must be valid
      secret: z.string().min(32, 'المفتاح السري يجب أن يكون 32 حرف على الأقل'), // Secret key must be at least 32 characters
      
      // Iraqi payment gateway settings
      paymentGateways: z.object({
        zaincash: z.object({
          enabled: z.boolean().default(false),
          merchantId: z.string().optional(),
          secretKey: z.string().optional(),
          sandbox: z.boolean().default(true),
          webhookUrl: z.string().url().optional(),
          allowedAmounts: z.array(z.number()).default([1000, 5000, 10000, 25000, 50000]) // IQD
        }),
        fastpay: z.object({
          enabled: z.boolean().default(false),
          apiKey: z.string().optional(),
          storeId: z.string().optional(),
          environment: z.enum(['sandbox', 'production']).default('sandbox'),
          webhookUrl: z.string().url().optional(),
          allowedAmounts: z.array(z.number()).default([500, 2500, 7500, 15000, 30000]) // IQD
        }),
        nasswallet: z.object({
          enabled: z.boolean().default(false),
          merchantCode: z.string().optional(),
          apiSecret: z.string().optional(),
          testMode: z.boolean().default(true),
          webhookUrl: z.string().url().optional(),
          allowedAmounts: z.array(z.number()).default([1000, 6000, 12000, 25000, 50000]) // IQD
        })
      }),
      
      // Cultural validation settings
      culturalValidation: z.object({
        enabled: z.boolean().default(true),
        islamicCompliance: z.enum(['strict', 'moderate', 'flexible']).default('moderate'),
        sectarianSensitivity: z.enum(['neutral', 'aware', 'sensitive']).default('neutral'),
        professionalDomains: z.array(z.string()).default(['general']),
        arabicProcessing: z.boolean().default(true),
        dialectSupport: z.array(z.string()).default(['iraqi'])
      }),
      
      // Security enhancements
      securitySettings: z.object({
        enableIpWhitelist: z.boolean().default(false),
        allowedIps: z.array(z.string()).default([]),
        enableRateLimit: z.boolean().default(true),
        rateLimit: z.number().default(100), // requests per hour
        enablePaymentValidation: z.boolean().default(true),
        enableCulturalFiltering: z.boolean().default(true),
        signatureValidation: z.enum(['sha256', 'sha512', 'hmac-sha256']).default('sha256')
      }),
      
      // Iraqi regional settings
      regionalSettings: z.object({
        timezone: z.string().default('Asia/Baghdad'),
        locale: z.string().default('ar-IQ'),
        currency: z.string().default('IQD'),
        businessHours: z.object({
          enabled: z.boolean().default(false),
          start: z.string().default('08:00'),
          end: z.string().default('17:00'),
          days: z.array(z.number()).default([0, 1, 2, 3, 4]) // Sunday to Thursday
        })
      })
    })
  },

  channels: {
    webhook: {
      messages: {
        // Enhanced message types for Iraqi context
        payment: {
          schema: z.object({
            transactionId: z.string(),
            gateway: z.enum([IraqiPaymentGateways.ZAINCASH, IraqiPaymentGateways.FASTPAY, IraqiPaymentGateways.NASSWALLET]),
            amount: iraqiPaymentAmountSchema,
            customerPhone: iraqiPhoneSchema,
            status: z.enum(['pending', 'completed', 'failed', 'refunded']),
            timestamp: z.string().datetime(),
            metadata: z.record(z.any()).optional(),
            culturalValidation: z.object({
              validated: z.boolean(),
              score: z.number().min(0).max(1),
              issues: z.array(z.string()).optional()
            }).optional()
          })
        },
        
        cultural_content: {
          schema: culturalContentSchema.extend({
            userId: z.string(),
            sessionId: z.string().optional(),
            timestamp: z.string().datetime(),
            validation: z.object({
              islamicCompliance: z.boolean(),
              culturalAppropriateness: z.number().min(0).max(1),
              professionalAccuracy: z.number().min(0).max(1),
              issues: z.array(z.string()).optional(),
              recommendations: z.array(z.string()).optional()
            }).optional()
          })
        },
        
        professional_query: {
          schema: z.object({
            query: z.string(),
            domain: z.enum(['legal', 'medical', 'educational', 'government', 'finance']),
            specialist: z.string().optional(),
            confidentialityLevel: z.enum(['public', 'professional', 'confidential']).default('professional'),
            language: z.enum(['arabic', 'english', 'mixed']),
            userId: z.string(),
            timestamp: z.string().datetime(),
            context: z.record(z.any()).optional()
          })
        },
        
        text: {
          schema: z.object({
            text: z.string(),
            language: z.enum(['arabic', 'english', 'mixed']).optional(),
            culturalContext: z.record(z.any()).optional(),
            timestamp: z.string().datetime()
          })
        }
      }
    }
  },

  actions: {
    // Enhanced webhook sending with Iraqi security
    sendWebhook: {
      title: 'إرسال ويب هوك محسن', // Send Enhanced Webhook
      description: 'Send webhook with Iraqi payment security and cultural validation',
      
      input: {
        schema: z.object({
          url: z.string().url('يجب أن يكون الرابط صحيحاً'), // URL must be valid
          method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']).default('POST'),
          headers: z.record(z.string()).default({}),
          body: z.record(z.any()),
          
          // Iraqi enhancements
          paymentValidation: z.object({
            enabled: z.boolean().default(false),
            gateway: z.enum([IraqiPaymentGateways.ZAINCASH, IraqiPaymentGateways.FASTPAY, IraqiPaymentGateways.NASSWALLET]).optional(),
            expectedAmount: z.number().optional(),
            customerPhone: z.string().optional()
          }).optional(),
          
          culturalValidation: z.object({
            enabled: z.boolean().default(false),
            requireIslamicCompliance: z.boolean().default(false),
            professionalDomain: z.string().optional(),
            language: z.enum(['arabic', 'english', 'mixed']).optional()
          }).optional(),
          
          securityOptions: z.object({
            signatureHeader: z.string().default('X-Iraqi-Signature'),
            timestampHeader: z.string().default('X-Iraqi-Timestamp'),
            enableRetries: z.boolean().default(true),
            retryAttempts: z.number().default(3),
            timeout: z.number().default(10000) // 10 seconds
          }).optional()
        })
      },
      
      output: {
        schema: z.object({
          success: z.boolean(),
          statusCode: z.number(),
          responseBody: z.string(),
          responseHeaders: z.record(z.string()),
          
          // Iraqi validation results
          validationResults: z.object({
            paymentValidation: z.object({
              valid: z.boolean(),
              gateway: z.string().optional(),
              amount: z.number().optional(),
              issues: z.array(z.string()).optional()
            }).optional(),
            
            culturalValidation: z.object({
              valid: z.boolean(),
              islamicCompliance: z.boolean(),
              culturalScore: z.number().min(0).max(1),
              issues: z.array(z.string()).optional()
            }).optional()
          }).optional(),
          
          processingTime: z.number(),
          retryAttempts: z.number().default(0),
          timestamp: z.string().datetime()
        })
      }
    },

    // Validate Iraqi payment webhook
    validatePaymentWebhook: {
      title: 'التحقق من ويب هوك الدفع', // Validate Payment Webhook
      description: 'Validate Iraqi payment gateway webhook signatures and content',
      
      input: {
        schema: z.object({
          gateway: z.enum([IraqiPaymentGateways.ZAINCASH, IraqiPaymentGateways.FASTPAY, IraqiPaymentGateways.NASSWALLET]),
          payload: z.record(z.any()),
          signature: z.string(),
          timestamp: z.string(),
          secretKey: z.string()
        })
      },
      
      output: {
        schema: z.object({
          valid: z.boolean(),
          gateway: z.string(),
          transactionId: z.string().optional(),
          amount: z.number().optional(),
          status: z.string().optional(),
          customerPhone: z.string().optional(),
          validationErrors: z.array(z.string()).optional(),
          securityCheck: z.object({
            signatureValid: z.boolean(),
            timestampValid: z.boolean(),
            ipWhitelisted: z.boolean().optional()
          })
        })
      }
    },

    // Validate cultural content
    validateCulturalContent: {
      title: 'التحقق الثقافي', // Cultural Validation
      description: 'Validate content for Iraqi cultural and Islamic compliance',
      
      input: {
        schema: culturalContentSchema.extend({
          strictValidation: z.boolean().default(false),
          professionalReview: z.boolean().default(false)
        })
      },
      
      output: {
        schema: z.object({
          valid: z.boolean(),
          islamicCompliance: z.boolean(),
          culturalAppropriateness: z.number().min(0).max(1),
          professionalAccuracy: z.number().min(0).max(1),
          language: z.string(),
          dialect: z.string().optional(),
          issues: z.array(z.object({
            type: z.enum(['cultural', 'religious', 'professional', 'linguistic']),
            severity: z.enum(['low', 'medium', 'high', 'critical']),
            message: z.string(),
            arabicMessage: z.string().optional(),
            suggestion: z.string().optional()
          })),
          recommendations: z.array(z.string()),
          metadata: z.object({
            processingTime: z.number(),
            validatedAt: z.string().datetime(),
            validator: z.string(),
            version: z.string()
          })
        })
      }
    }
  },

  events: {
    // Payment webhook events
    paymentReceived: {
      schema: z.object({
        transactionId: z.string(),
        gateway: z.string(),
        amount: z.number(),
        currency: z.string(),
        customerPhone: z.string(),
        status: z.enum(['completed', 'pending', 'failed']),
        timestamp: z.string().datetime(),
        validationPassed: z.boolean()
      })
    },
    
    paymentFailed: {
      schema: z.object({
        transactionId: z.string().optional(),
        gateway: z.string(),
        reason: z.string(),
        customerPhone: z.string().optional(),
        timestamp: z.string().datetime(),
        errorCode: z.string().optional()
      })
    },

    // Cultural validation events
    culturalValidationComplete: {
      schema: z.object({
        contentId: z.string(),
        userId: z.string(),
        valid: z.boolean(),
        score: z.number().min(0).max(1),
        issues: z.array(z.string()),
        timestamp: z.string().datetime()
      })
    },

    culturalViolation: {
      schema: z.object({
        contentId: z.string(),
        userId: z.string(),
        violation: z.string(),
        severity: z.enum(['low', 'medium', 'high', 'critical']),
        arabicMessage: z.string(),
        timestamp: z.string().datetime(),
        actionRequired: z.boolean()
      })
    }
  },

  states: {
    // Webhook configuration state
    webhookConfig: {
      type: 'user',
      schema: z.object({
        url: z.string(),
        secret: z.string(),
        enabled: z.boolean(),
        lastSuccess: z.string().datetime().optional(),
        lastFailure: z.string().datetime().optional(),
        totalRequests: z.number().default(0),
        successfulRequests: z.number().default(0)
      })
    },

    // Iraqi payment gateway state
    paymentGatewayConfig: {
      type: 'user',
      schema: z.object({
        activeGateways: z.array(z.string()),
        dailyVolume: z.record(z.number()).default({}),
        monthlyVolume: z.record(z.number()).default({}),
        lastTransaction: z.string().datetime().optional(),
        fraud detection: z.object({
          enabled: z.boolean().default(true),
          suspiciousPatterns: z.array(z.string()).default([]),
          blockedPhones: z.array(z.string()).default([])
        })
      })
    },

    // Cultural validation state
    culturalValidationConfig: {
      type: 'user',
      schema: z.object({
        enabled: z.boolean().default(true),
        islamicCompliance: z.enum(['strict', 'moderate', 'flexible']).default('moderate'),
        validationCount: z.number().default(0),
        violationCount: z.number().default(0),
        lastValidation: z.string().datetime().optional(),
        professionalDomains: z.array(z.string()).default(['general'])
      })
    }
  }
} as const satisfies IntegrationDefinition;

/**
 * Iraqi AI Chat System Webhook Security Enhancements Applied:
 * 
 * 1. Payment Gateway Integration - ZainCash, FastPay, NassWallet webhook security
 * 2. Iraqi Phone Validation - Proper Iraqi mobile number format validation
 * 3. Cultural Content Validation - Islamic compliance and Iraqi cultural appropriateness
 * 4. Professional Domain Support - Legal, medical, educational webhook handling
 * 5. Enhanced Security Validation - SHA256/512 signatures, IP whitelisting, rate limiting
 * 6. Bilingual Error Messages - Arabic error messages and descriptions
 * 7. Regional Settings - Baghdad timezone, Arabic locale, IQD currency
 * 8. Business Hours Integration - Iraqi working day schedule (Sunday-Thursday)
 * 9. Fraud Detection - Suspicious pattern detection and phone blocking
 * 10. Cultural Event System - Violation tracking and compliance monitoring
 * 11. Professional Confidentiality - Different confidentiality levels for domains
 * 12. Payment Amount Validation - Iraqi Dinar amount ranges per gateway
 */