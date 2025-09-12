// Iraqi Rate Limiting Test Suite
// Comprehensive tests for Iraqi AI Chat System rate limiting with cultural scenarios
// Tests include payment integration, professional domains, and Arabic translation limits

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { IraqiRateLimitService } from '../lib/services/rate-limit.service';
import { IraqiBudgetTrackingService } from '../lib/services/budget-tracking.service';
import { IraqiPaymentIntegrationService } from '../lib/services/iraqi-payment-integration.service';
import { ProfessionalDomainQuotaService } from '../lib/services/professional-domain-quota.service';
import { ArabicTranslationRateLimitService } from '../lib/services/arabic-translation-rate-limit.service';
import IraqiRateLimitConfiguration from '../lib/config/iraqi-rate-limit-config';
import { RateLimitContext, RateLimitResult } from '../lib/types/rate-limit.types';

describe('Iraqi Rate Limiting System', () => {
  let rateLimitService: IraqiRateLimitService;
  let budgetService: IraqiBudgetTrackingService;
  let paymentService: IraqiPaymentIntegrationService;
  let domainService: ProfessionalDomainQuotaService;
  let translationService: ArabicTranslationRateLimitService;

  beforeEach(() => {
    // Initialize services with test configurations
    rateLimitService = new IraqiRateLimitService();
    budgetService = new IraqiBudgetTrackingService();
    paymentService = new IraqiPaymentIntegrationService();
    domainService = new ProfessionalDomainQuotaService();
    translationService = new ArabicTranslationRateLimitService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Core Rate Limiting', () => {
    test('should enforce guest user limits', async () => {
      const context: RateLimitContext = {
        userId: 'guest-user-001',
        sessionId: 'session-001',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (test)',
        subscriptionTier: 'free',
        requestType: 'chat',
        contentLanguage: 'ar'
      };

      const result = await rateLimitService.checkRateLimit(context);
      
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBeLessThanOrEqual(50); // Guest limit from config
    });

    test('should enforce premium user limits', async () => {
      const context: RateLimitContext = {
        userId: 'premium-user-001',
        sessionId: 'session-002',
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (test)',
        subscriptionTier: 'premium',
        requestType: 'chat',
        contentLanguage: 'ar'
      };

      const result = await rateLimitService.checkRateLimit(context);
      
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBeLessThanOrEqual(1000); // Premium limit
    });

    test('should deny requests when rate limit exceeded', async () => {
      const context: RateLimitContext = {
        userId: 'test-user-001',
        sessionId: 'session-003',
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (test)',
        subscriptionTier: 'free',
        requestType: 'chat',
        contentLanguage: 'ar'
      };

      // Simulate many requests to exceed limit
      for (let i = 0; i < 60; i++) {
        await rateLimitService.checkRateLimit(context);
      }

      const result = await rateLimitService.checkRateLimit(context);
      expect(result.allowed).toBe(false);
      expect(result.violationType).toBe('rate_limit');
      expect(result.arabicMessage).toContain('تم تجاوز الحد');
    });
  });

  describe('Cultural Adaptations', () => {
    test('should apply prayer time reductions', async () => {
      const context: RateLimitContext = {
        userId: 'muslim-user-001',
        sessionId: 'session-004',
        ipAddress: '192.168.1.103',
        userAgent: 'Mozilla/5.0 (test)',
        subscriptionTier: 'premium',
        requestType: 'chat',
        contentLanguage: 'ar',
        culturalProfile: {
          islamicCompliance: true,
          arabicPreference: true,
          dialectPreference: 'baghdad'
        }
      };

      // Test during simulated prayer time
      const mockDate = new Date('2024-01-15T12:30:00+03:00'); // Dhuhr time in Baghdad
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      const prayerTimeConfig = IraqiRateLimitConfiguration.getConfigForCulturalMode('prayer_aware');
      expect(prayerTimeConfig.prayerTimeReduction).toBe(0.7);

      jest.useRealTimers();
    });

    test('should apply Ramadan multipliers', async () => {
      const context: RateLimitContext = {
        userId: 'ramadan-user-001',
        sessionId: 'session-005',
        ipAddress: '192.168.1.104',
        userAgent: 'Mozilla/5.0 (test)',
        subscriptionTier: 'premium',
        requestType: 'chat',
        contentLanguage: 'ar'
      };

      const ramadanConfig = IraqiRateLimitConfiguration.getConfigForCulturalMode('ramadan_mode');
      expect(ramadanConfig.ramadanMultiplier).toBe(1.5); // 50% increase

      const multiplier = IraqiRateLimitConfiguration.getCulturalAdjustment(
        'ramadan_mode',
        false,
        true
      );
      expect(multiplier).toBe(1.5);
    });

    test('should handle government emergency mode', async () => {
      const context: RateLimitContext = {
        userId: 'gov-emergency-001',
        sessionId: 'session-006',
        ipAddress: '10.0.0.1',
        userAgent: 'Mozilla/5.0 (gov)',
        subscriptionTier: 'enterprise',
        requestType: 'admin',
        contentLanguage: 'ar',
        professionalDomain: 'government',
        organizationType: 'government'
      };

      const emergencyConfig = IraqiRateLimitConfiguration.getConfigForCulturalMode('emergency_mode');
      expect(emergencyConfig.guestLimit).toBe(500); // Emergency access
      expect(emergencyConfig.governmentLimit).toBe(50000); // Crisis response
    });
  });

  describe('Iraqi Payment Integration', () => {
    test('should process ZainCash payment for Baghdad user', async () => {
      const paymentRequest = {
        userId: 'baghdad-user-001',
        amount: 25000, // 25,000 IQD
        currency: 'IQD' as const,
        method: 'zaincash' as const,
        subscriptionTierId: 'premium',
        governorate: 'Baghdad',
        description: 'Premium subscription'
      };

      const result = await paymentService.processPayment(paymentRequest);
      
      expect(result.success).toBe(true);
      expect(result.transactionId).toMatch(/^zc_\d+_[a-z0-9]+$/);
      expect(result.paymentUrl).toContain('zaincash.iq');
      expect(result.estimatedFee).toBeGreaterThan(0);
    });

    test('should process FastPay payment with governorate validation', async () => {
      const paymentRequest = {
        userId: 'basra-user-001',
        amount: 75000, // 75,000 IQD
        currency: 'IQD' as const,
        method: 'fastpay' as const,
        subscriptionTierId: 'professional',
        governorate: 'Basra',
        description: 'Professional subscription'
      };

      const availableMethods = paymentService.getAvailablePaymentMethods('Basra');
      expect(availableMethods.some(m => m.method === 'fastpay')).toBe(true);

      const result = await paymentService.processPayment(paymentRequest);
      expect(result.success).toBe(true);
      expect(result.transactionId).toMatch(/^fp_\d+_[a-z0-9]+$/);
    });

    test('should reject payment for unsupported governorate', async () => {
      const paymentRequest = {
        userId: 'remote-user-001',
        amount: 25000,
        currency: 'IQD' as const,
        method: 'nasswallet' as const,
        subscriptionTierId: 'premium',
        governorate: 'Salah al-Din', // Not supported by NassWallet
        description: 'Premium subscription'
      };

      const result = await paymentService.processPayment(paymentRequest);
      
      expect(result.success).toBe(false);
      expect(result.errorCode).toBe('GOVERNORATE_NOT_SUPPORTED');
      expect(result.errorMessageArabic).toContain('غير متاح');
    });

    test('should apply Ramadan pricing discounts', async () => {
      const paymentRequest = {
        userId: 'ramadan-user-002',
        amount: 25000,
        currency: 'IQD' as const,
        method: 'zaincash' as const,
        subscriptionTierId: 'premium',
        governorate: 'Baghdad',
        description: 'Ramadan special'
      };

      // Mock Ramadan period
      const mockRamadanDate = new Date('2024-03-15'); // Ramadan month
      jest.useFakeTimers();
      jest.setSystemTime(mockRamadanDate);

      const pricing = paymentService.getSubscriptionPricing('premium', 'Baghdad', true);
      expect(pricing.savings).toBeGreaterThan(0);
      expect(pricing.adjustedPrice).toBeLessThan(pricing.basePrice);

      jest.useRealTimers();
    });
  });

  describe('Professional Domain Quotas', () => {
    test('should enforce legal domain quotas', async () => {
      const professionalContext = {
        userId: 'lawyer-001',
        domain: 'legal' as const,
        organizationType: 'individual' as const,
        governorate: 'Baghdad',
        certificationLevel: 'advanced' as const,
        licenseNumber: 'IRQ-BAR-2024-001',
        specialization: 'civil_law'
      };

      const quotas = await domainService.getProfessionalQuotas(professionalContext);
      
      expect(quotas.domain).toBe('legal');
      expect(quotas.baseLimit).toBe(1600); // 800 * 2.0 (advanced multiplier)
      expect(quotas.culturalConsiderations.islamicComplianceRequired).toBe(true);
      expect(quotas.specialFeatureLimits.documentAnalysis).toBeGreaterThan(0);
    });

    test('should enforce medical domain quotas', async () => {
      const medicalContext = {
        userId: 'doctor-001',
        domain: 'medical' as const,
        organizationType: 'individual' as const,
        governorate: 'Baghdad',
        certificationLevel: 'expert' as const,
        licenseNumber: 'IRQ-MED-2024-001',
        specialization: 'internal_medicine'
      };

      const quotas = await domainService.getProfessionalQuotas(medicalContext);
      
      expect(quotas.domain).toBe('medical');
      expect(quotas.baseLimit).toBe(1500); // 600 * 2.5 (expert multiplier)
      expect(quotas.culturalConsiderations.islamicComplianceRequired).toBe(true);
    });

    test('should validate professional credentials', async () => {
      const invalidContext = {
        userId: 'fake-lawyer-001',
        domain: 'legal' as const,
        organizationType: 'individual' as const,
        governorate: 'Baghdad',
        certificationLevel: 'advanced' as const
        // Missing licenseNumber
      };

      const validation = await domainService.validateCredentials(invalidContext);
      
      expect(validation.valid).toBe(false);
      expect(validation.missingRequirements).toContain('iraqi_bar_association');
    });

    test('should track professional domain usage', async () => {
      const context = {
        userId: 'lawyer-002',
        domain: 'legal' as const,
        organizationType: 'individual' as const,
        governorate: 'Baghdad',
        certificationLevel: 'intermediate' as const,
        licenseNumber: 'IRQ-BAR-2024-002'
      };

      await domainService.trackUsage(context, 'document', 500);

      const analytics = domainService.getDomainAnalytics();
      expect(analytics.domainUsage.legal).toBeGreaterThan(0);
      expect(analytics.professionalCompliance).toBeGreaterThan(90);
    });
  });

  describe('Arabic Translation Rate Limiting', () => {
    test('should enforce Baghdad dialect translation limits', async () => {
      const translationContext = {
        userId: 'translator-001',
        sessionId: 'session-007',
        ipAddress: '192.168.1.105',
        userAgent: 'Mozilla/5.0 (test)',
        sourceLanguage: 'ar' as const,
        targetLanguage: 'en' as const,
        dialectInput: 'baghdad' as const,
        translationType: 'general' as const,
        contentComplexity: 'medium' as const,
        culturalSensitivity: 'medium' as const,
        textLength: 1000,
        requiresValidation: true,
        subscriptionTier: 'premium',
        requestType: 'translation',
        contentLanguage: 'ar'
      };

      const result = await translationService.checkTranslationRateLimit(translationContext);
      
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBeGreaterThan(0);
    });

    test('should reject Kurdish dialect for basic subscription', async () => {
      const kurdishContext = {
        userId: 'kurdish-user-001',
        sessionId: 'session-008',
        ipAddress: '192.168.1.106',
        userAgent: 'Mozilla/5.0 (test)',
        sourceLanguage: 'ar' as const,
        targetLanguage: 'en' as const,
        dialectInput: 'kurdish' as const,
        translationType: 'cultural' as const,
        contentComplexity: 'complex' as const,
        culturalSensitivity: 'high' as const,
        textLength: 800,
        requiresValidation: true,
        subscriptionTier: 'free', // Kurdish requires expert level
        requestType: 'translation',
        contentLanguage: 'ar'
      };

      const result = await translationService.checkTranslationRateLimit(kurdishContext);
      
      expect(result.allowed).toBe(false);
      expect(result.culturalMessage).toContain('kurdish dialect requires expert subscription');
      expect(result.arabicMessage).toContain('تتطلب اشتراك خبير');
    });

    test('should calculate translation costs accurately', async () => {
      const costContext = {
        userId: 'cost-test-001',
        sessionId: 'session-009',
        ipAddress: '192.168.1.107',
        userAgent: 'Mozilla/5.0 (test)',
        sourceLanguage: 'ar' as const,
        targetLanguage: 'en' as const,
        dialectInput: 'baghdad' as const,
        translationType: 'legal' as const,
        contentComplexity: 'highly_complex' as const,
        culturalSensitivity: 'critical' as const,
        textLength: 2000,
        requiresValidation: true,
        subscriptionTier: 'professional',
        requestType: 'translation',
        contentLanguage: 'ar'
      };

      const cost = translationService.estimateTranslationCost(costContext);
      
      expect(cost.currency).toBe('IQD');
      expect(cost.totalCost).toBeGreaterThan(cost.characterCost);
      expect(cost.complexityCost).toBeGreaterThan(0);
      expect(cost.dialectCost).toBeGreaterThan(0);
    });

    test('should track translation usage and quality metrics', async () => {
      const trackingContext = {
        userId: 'tracking-user-001',
        sessionId: 'session-010',
        ipAddress: '192.168.1.108',
        userAgent: 'Mozilla/5.0 (test)',
        sourceLanguage: 'ar' as const,
        targetLanguage: 'en' as const,
        dialectInput: 'basra' as const,
        translationType: 'professional' as const,
        contentComplexity: 'medium' as const,
        culturalSensitivity: 'medium' as const,
        textLength: 1200,
        requiresValidation: false,
        subscriptionTier: 'premium',
        requestType: 'translation',
        contentLanguage: 'ar'
      };

      await translationService.trackTranslationUsage(trackingContext);

      const analytics = translationService.getTranslationAnalytics();
      expect(analytics.totalTranslations).toBeGreaterThan(0);
      expect(analytics.dialectDistribution).toHaveProperty('basra');
      expect(analytics.qualityMetrics.accuracy).toBeGreaterThan(90);
      expect(analytics.culturalComplianceRate).toBeGreaterThan(90);
    });
  });

  describe('Budget Tracking Integration', () => {
    test('should track budget accurately across services', async () => {
      const userId = 'budget-test-001';
      const subscriptionTier = 'premium';

      // Test chat request cost
      await budgetService.trackRequest(userId, 'chat', undefined, subscriptionTier);
      
      // Test translation request cost
      await budgetService.trackRequest(userId, 'translation', undefined, subscriptionTier);
      
      // Test professional domain cost
      await budgetService.trackRequest(userId, 'professional_query', 'legal', subscriptionTier);

      const usage = await budgetService.getCurrentUsage(userId);
      
      expect(usage.totalSpentIQD).toBeGreaterThan(0);
      expect(usage.requestBreakdown.chat).toBe(1);
      expect(usage.requestBreakdown.translation).toBe(1);
      expect(usage.requestBreakdown.professional_query).toBe(1);
    });

    test('should enforce budget limits', async () => {
      const userId = 'budget-limit-test';
      const subscriptionTier = 'free';

      // Simulate reaching budget limit
      for (let i = 0; i < 100; i++) {
        await budgetService.trackRequest(userId, 'chat', undefined, subscriptionTier);
      }

      const result = await budgetService.trackRequest(userId, 'chat', undefined, subscriptionTier);
      
      expect(result.success).toBe(false);
      expect(result.warningLevel).toBe('budget_exceeded');
    });

    test('should calculate professional domain multipliers', async () => {
      const userId = 'multiplier-test-001';
      const subscriptionTier = 'premium';

      const legalResult = await budgetService.trackRequest(userId, 'professional_query', 'legal', subscriptionTier);
      const medicalResult = await budgetService.trackRequest(userId, 'professional_query', 'medical', subscriptionTier);

      expect(legalResult.cost.professionalMultiplier).toBe(2.0);
      expect(medicalResult.cost.professionalMultiplier).toBe(2.5);
      expect(medicalResult.cost.totalCost).toBeGreaterThan(legalResult.cost.totalCost);
    });
  });

  describe('Integration Testing', () => {
    test('should handle complete user journey from registration to premium usage', async () => {
      const journeyUserId = 'journey-test-001';
      
      // Step 1: Guest user hits free limits
      const guestContext: RateLimitContext = {
        userId: journeyUserId,
        sessionId: 'journey-session-001',
        ipAddress: '192.168.1.200',
        userAgent: 'Mozilla/5.0 (journey)',
        subscriptionTier: 'free',
        requestType: 'chat',
        contentLanguage: 'ar'
      };

      for (let i = 0; i < 55; i++) {
        await rateLimitService.checkRateLimit(guestContext);
      }

      const limitResult = await rateLimitService.checkRateLimit(guestContext);
      expect(limitResult.allowed).toBe(false);
      expect(limitResult.upgradeOptions).toBeDefined();

      // Step 2: Process payment upgrade
      const paymentRequest = {
        userId: journeyUserId,
        amount: 25000,
        currency: 'IQD' as const,
        method: 'zaincash' as const,
        subscriptionTierId: 'premium',
        governorate: 'Baghdad',
        description: 'Upgrade to premium'
      };

      const payment = await paymentService.processPayment(paymentRequest);
      expect(payment.success).toBe(true);

      // Step 3: Verify premium access
      const premiumContext = { ...guestContext, subscriptionTier: 'premium' as const };
      const premiumResult = await rateLimitService.checkRateLimit(premiumContext);
      
      expect(premiumResult.allowed).toBe(true);
      expect(premiumResult.remaining).toBeGreaterThan(500);
    });

    test('should handle professional user with Arabic translation workflow', async () => {
      const professionalUserId = 'professional-workflow-001';

      // Professional user context
      const professionalContext = {
        userId: professionalUserId,
        domain: 'legal' as const,
        organizationType: 'individual' as const,
        governorate: 'Baghdad',
        certificationLevel: 'advanced' as const,
        licenseNumber: 'IRQ-BAR-2024-WORKFLOW',
        specialization: 'civil_law'
      };

      // Validate credentials
      const credValidation = await domainService.validateCredentials(professionalContext);
      expect(credValidation.valid).toBe(true);

      // Get professional quotas
      const quotas = await domainService.getProfessionalQuotas(professionalContext);
      expect(quotas.baseLimit).toBeGreaterThan(1000);

      // Test Arabic legal translation
      const translationContext = {
        ...professionalContext,
        sessionId: 'prof-session-001',
        ipAddress: '10.0.1.100',
        userAgent: 'Mozilla/5.0 (professional)',
        sourceLanguage: 'ar' as const,
        targetLanguage: 'en' as const,
        dialectInput: 'standard' as const,
        translationType: 'legal' as const,
        contentComplexity: 'complex' as const,
        culturalSensitivity: 'high' as const,
        textLength: 5000,
        requiresValidation: true,
        subscriptionTier: 'professional' as const,
        requestType: 'translation' as const,
        contentLanguage: 'ar' as const
      };

      const translationResult = await translationService.checkTranslationRateLimit(translationContext);
      expect(translationResult.allowed).toBe(true);

      // Track the usage
      await translationService.trackTranslationUsage(translationContext);
      await domainService.trackUsage(professionalContext, 'document', 2000);

      // Verify analytics updated
      const analytics = domainService.getDomainAnalytics();
      expect(analytics.domainUsage.legal).toBeGreaterThan(0);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle Redis connection failures gracefully', async () => {
      // Simulate Redis failure
      const failingContext: RateLimitContext = {
        userId: 'redis-fail-test',
        sessionId: 'fail-session',
        ipAddress: '192.168.1.500',
        userAgent: 'Mozilla/5.0 (fail)',
        subscriptionTier: 'premium',
        requestType: 'chat',
        contentLanguage: 'ar'
      };

      // Mock Redis failure
      jest.spyOn(rateLimitService as any, 'redis').mockImplementation(() => {
        throw new Error('Redis connection failed');
      });

      const result = await rateLimitService.checkRateLimit(failingContext);
      
      // Should fail gracefully
      expect(result.allowed).toBe(false);
      expect(result.violationType).toBe('rate_limit');
    });

    test('should handle invalid subscription tiers', async () => {
      const invalidContext: RateLimitContext = {
        userId: 'invalid-tier-test',
        sessionId: 'invalid-session',
        ipAddress: '192.168.1.300',
        userAgent: 'Mozilla/5.0 (invalid)',
        subscriptionTier: 'nonexistent' as any,
        requestType: 'chat',
        contentLanguage: 'ar'
      };

      const result = await rateLimitService.checkRateLimit(invalidContext);
      
      expect(result.allowed).toBe(false);
      expect(result.violationType).toBe('rate_limit');
    });

    test('should handle payment gateway timeouts', async () => {
      const timeoutRequest = {
        userId: 'timeout-test-001',
        amount: 25000,
        currency: 'IQD' as const,
        method: 'zaincash' as const,
        subscriptionTierId: 'premium',
        governorate: 'Baghdad',
        description: 'Timeout test'
      };

      // Mock network timeout
      jest.spyOn(paymentService as any, 'processZainCashPayment').mockImplementation(() => {
        return new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Network timeout')), 1000);
        });
      });

      const result = await paymentService.processPayment(timeoutRequest);
      
      expect(result.success).toBe(false);
      expect(result.errorCode).toBe('PROCESSING_ERROR');
      expect(result.errorMessageArabic).toContain('يرجى المحاولة مرة أخرى');
    });
  });

  describe('Performance Testing', () => {
    test('should maintain sub-100ms response times', async () => {
      const performanceContext: RateLimitContext = {
        userId: 'performance-test-001',
        sessionId: 'perf-session',
        ipAddress: '192.168.1.400',
        userAgent: 'Mozilla/5.0 (performance)',
        subscriptionTier: 'premium',
        requestType: 'chat',
        contentLanguage: 'ar'
      };

      const startTime = Date.now();
      
      await rateLimitService.checkRateLimit(performanceContext);
      
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(100); // Sub-100ms requirement
    });

    test('should handle concurrent requests efficiently', async () => {
      const concurrentPromises = Array.from({ length: 50 }, (_, i) => {
        const context: RateLimitContext = {
          userId: `concurrent-user-${i}`,
          sessionId: `concurrent-session-${i}`,
          ipAddress: `192.168.2.${i}`,
          userAgent: 'Mozilla/5.0 (concurrent)',
          subscriptionTier: 'premium',
          requestType: 'chat',
          contentLanguage: 'ar'
        };
        return rateLimitService.checkRateLimit(context);
      });

      const startTime = Date.now();
      const results = await Promise.all(concurrentPromises);
      const totalTime = Date.now() - startTime;

      // All requests should succeed
      results.forEach(result => {
        expect(result.allowed).toBe(true);
      });

      // Average response time should be reasonable
      const avgResponseTime = totalTime / results.length;
      expect(avgResponseTime).toBeLessThan(50);
    });
  });

  describe('Cultural Compliance Validation', () => {
    test('should maintain high cultural compliance scores', async () => {
      const translationAnalytics = translationService.getTranslationAnalytics();
      expect(translationAnalytics.culturalComplianceRate).toBeGreaterThan(90);
      
      const domainAnalytics = domainService.getDomainAnalytics();
      expect(domainAnalytics.professionalCompliance).toBeGreaterThan(90);
    });

    test('should provide appropriate Arabic messaging', async () => {
      const arabicTestContext: RateLimitContext = {
        userId: 'arabic-message-test',
        sessionId: 'arabic-session',
        ipAddress: '192.168.1.600',
        userAgent: 'Mozilla/5.0 (arabic)',
        subscriptionTier: 'free',
        requestType: 'chat',
        contentLanguage: 'ar'
      };

      // Exceed limits to trigger Arabic message
      for (let i = 0; i < 60; i++) {
        await rateLimitService.checkRateLimit(arabicTestContext);
      }

      const result = await rateLimitService.checkRateLimit(arabicTestContext);
      
      expect(result.allowed).toBe(false);
      expect(result.arabicMessage).toBeDefined();
      expect(result.arabicMessage).toMatch(/[\u0600-\u06FF]/); // Contains Arabic characters
      expect(result.culturalMessage).toBeDefined();
    });
  });
});

// Test configuration and setup helpers
export const setupTestEnvironment = () => {
  process.env.NODE_ENV = 'test';
  process.env.REDIS_URL = 'redis://localhost:6379/15'; // Test DB
  
  // Mock payment gateway credentials for testing
  process.env.ZAINCASH_API_KEY = 'test_zaincash_key';
  process.env.FASTPAY_API_KEY = 'test_fastpay_key';
  process.env.NASSWALLET_API_KEY = 'test_nasswallet_key';
};

export const teardownTestEnvironment = async () => {
  // Cleanup test data
  // In a real implementation, this would clear Redis test database
};

// Test data generators
export const generateIraqiUser = (overrides: Partial<RateLimitContext> = {}): RateLimitContext => {
  const governorates = ['Baghdad', 'Basra', 'Nineveh', 'Najaf', 'Karbala'];
  const domains = ['legal', 'medical', 'educational', 'government', 'business'];
  
  return {
    userId: `user-${Math.random().toString(36).substr(2, 9)}`,
    sessionId: `session-${Math.random().toString(36).substr(2, 9)}`,
    ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    userAgent: 'Mozilla/5.0 (test-generated)',
    governorate: governorates[Math.floor(Math.random() * governorates.length)],
    professionalDomain: domains[Math.floor(Math.random() * domains.length)] as any,
    subscriptionTier: 'premium',
    requestType: 'chat',
    contentLanguage: 'ar',
    culturalProfile: {
      islamicCompliance: true,
      arabicPreference: true,
      dialectPreference: 'baghdad'
    },
    ...overrides
  };
};