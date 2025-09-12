/**
 * Production-Grade Rate Limiting System
 * Extracted from vtchat - Enhanced for Iraqi AI Chat System
 * 
 * Features:
 * - Redis-based distributed rate limiting
 * - Sliding window algorithm
 * - User-tier based limits (guest, registered, premium, organization)
 * - Iraqi payment gateway integration
 * - Professional domain quotas
 * - Arabic-specific rate limiting for translation requests
 */

import { Redis } from 'ioredis';

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (identifier: string) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  onLimitReached?: (key: string, totalHits: number) => void;
}

export interface IraqiRateLimitConfig extends RateLimitConfig {
  guestLimit: number;        // For anonymous users
  registeredLimit: number;   // For registered users  
  premiumLimit: number;      // For premium Iraqi users
  organizationLimit: number; // For Iraqi organizations
  arabicTranslationLimit: number; // For Arabic translation requests
  culturalValidationLimit: number; // For cultural compliance checks
  professionalDomainMultiplier: number; // Multiplier for legal/medical/educational
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: Date;
  retryAfter?: number;
}

export interface UserTier {
  type: 'guest' | 'registered' | 'premium' | 'organization';
  isProfessional: boolean;
  domain?: 'legal' | 'medical' | 'educational' | 'business' | 'engineering';
  paymentGateway?: 'zaincash' | 'fastpay' | 'nasswallet';
  subscriptionStatus: 'active' | 'expired' | 'trial' | 'none';
}

export class IraqiRateLimitService {
  private redis: Redis;
  private defaultConfig: IraqiRateLimitConfig;

  constructor(redis: Redis) {
    this.redis = redis;
    this.defaultConfig = {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 60,
      guestLimit: 20,
      registeredLimit: 100,
      premiumLimit: 500,
      organizationLimit: 1000,
      arabicTranslationLimit: 200,
      culturalValidationLimit: 300,
      professionalDomainMultiplier: 2.0,
      keyGenerator: (identifier: string) => `rate_limit:${identifier}`,
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
    };
  }

  /**
   * Check rate limit for Iraqi user with tier-based limits
   */
  async checkRateLimit(
    identifier: string,
    userTier: UserTier,
    requestType: 'chat' | 'translation' | 'cultural_validation' | 'api' = 'chat',
    config?: Partial<IraqiRateLimitConfig>
  ): Promise<RateLimitResult> {
    const finalConfig = { ...this.defaultConfig, ...config };
    const limit = this.calculateUserLimit(userTier, requestType, finalConfig);
    const key = finalConfig.keyGenerator!(identifier);
    const window = finalConfig.windowMs;

    try {
      // Sliding window rate limiting with Redis
      const now = Date.now();
      const pipeline = this.redis.pipeline();
      
      // Remove expired entries
      pipeline.zremrangebyscore(key, '-inf', now - window);
      
      // Count current requests in window
      pipeline.zcard(key);
      
      // Add current request
      pipeline.zadd(key, now, `${now}-${Math.random()}`);
      
      // Set expiry
      pipeline.expire(key, Math.ceil(window / 1000));

      const results = await pipeline.exec();
      
      if (!results) {
        throw new Error('Redis pipeline execution failed');
      }

      const currentCount = results[1][1] as number;
      
      if (currentCount >= limit) {
        // Remove the request we just added since we're over limit
        await this.redis.zrem(key, `${now}-${Math.random()}`);
        
        if (finalConfig.onLimitReached) {
          finalConfig.onLimitReached(key, currentCount);
        }

        const resetTime = new Date(now + window);
        const retryAfter = Math.ceil(window / 1000);

        return {
          success: false,
          limit,
          remaining: 0,
          resetTime,
          retryAfter,
        };
      }

      const remaining = Math.max(0, limit - currentCount - 1);
      const resetTime = new Date(now + window);

      return {
        success: true,
        limit,
        remaining,
        resetTime,
      };

    } catch (error) {
      console.error('Rate limiting error:', error);
      // Fail open - allow request if Redis is down
      return {
        success: true,
        limit,
        remaining: limit - 1,
        resetTime: new Date(Date.now() + window),
      };
    }
  }

  /**
   * Calculate user-specific rate limit based on tier and Iraqi context
   */
  private calculateUserLimit(
    userTier: UserTier,
    requestType: string,
    config: IraqiRateLimitConfig
  ): number {
    let baseLimit: number;

    // Base limit by user tier
    switch (userTier.type) {
      case 'guest':
        baseLimit = config.guestLimit;
        break;
      case 'registered':
        baseLimit = config.registeredLimit;
        break;
      case 'premium':
        baseLimit = config.premiumLimit;
        break;
      case 'organization':
        baseLimit = config.organizationLimit;
        break;
      default:
        baseLimit = config.guestLimit;
    }

    // Request type specific limits
    switch (requestType) {
      case 'translation':
        baseLimit = Math.min(baseLimit, config.arabicTranslationLimit);
        break;
      case 'cultural_validation':
        baseLimit = Math.min(baseLimit, config.culturalValidationLimit);
        break;
    }

    // Professional domain multiplier for Iraqi organizations
    if (userTier.isProfessional && userTier.domain) {
      baseLimit = Math.floor(baseLimit * config.professionalDomainMultiplier);
    }

    // Active subscription bonus
    if (userTier.subscriptionStatus === 'active' && userTier.paymentGateway) {
      // Bonus for active Iraqi payment gateway subscribers
      const paymentBonusMultiplier = {
        zaincash: 1.5,
        fastpay: 1.3,
        nasswallet: 1.4,
      }[userTier.paymentGateway] || 1.0;
      
      baseLimit = Math.floor(baseLimit * paymentBonusMultiplier);
    }

    return baseLimit;
  }

  /**
   * Get current usage statistics for a user
   */
  async getUserUsage(identifier: string): Promise<{
    currentUsage: number;
    resetTime: Date;
    percentUsed: number;
  }> {
    const key = this.defaultConfig.keyGenerator!(identifier);
    const window = this.defaultConfig.windowMs;
    const now = Date.now();

    try {
      // Clean expired and count current
      await this.redis.zremrangebyscore(key, '-inf', now - window);
      const currentUsage = await this.redis.zcard(key);
      const resetTime = new Date(now + window);
      
      // Calculate percentage (assuming premium tier for estimation)
      const estimatedLimit = this.defaultConfig.premiumLimit;
      const percentUsed = Math.min(100, (currentUsage / estimatedLimit) * 100);

      return {
        currentUsage,
        resetTime,
        percentUsed,
      };
    } catch (error) {
      console.error('Error fetching user usage:', error);
      return {
        currentUsage: 0,
        resetTime: new Date(),
        percentUsed: 0,
      };
    }
  }

  /**
   * Reset rate limit for a user (admin function)
   */
  async resetUserLimit(identifier: string): Promise<void> {
    const key = this.defaultConfig.keyGenerator!(identifier);
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error('Error resetting user limit:', error);
      throw new Error('Failed to reset user rate limit');
    }
  }

  /**
   * Get system-wide rate limiting statistics
   */
  async getSystemStats(): Promise<{
    activeUsers: number;
    totalRequests: number;
    averageUsage: number;
  }> {
    try {
      const pattern = 'rate_limit:*';
      const keys = await this.redis.keys(pattern);
      
      if (keys.length === 0) {
        return { activeUsers: 0, totalRequests: 0, averageUsage: 0 };
      }

      const pipeline = this.redis.pipeline();
      keys.forEach(key => pipeline.zcard(key));
      
      const results = await pipeline.exec();
      const requestCounts = results?.map(result => result[1] as number) || [];
      
      const totalRequests = requestCounts.reduce((sum, count) => sum + count, 0);
      const averageUsage = requestCounts.length > 0 ? totalRequests / requestCounts.length : 0;

      return {
        activeUsers: keys.length,
        totalRequests,
        averageUsage: Math.round(averageUsage * 100) / 100,
      };
    } catch (error) {
      console.error('Error fetching system stats:', error);
      return { activeUsers: 0, totalRequests: 0, averageUsage: 0 };
    }
  }

  /**
   * Iraqi-specific rate limiting for professional domains
   */
  async checkProfessionalDomainLimit(
    identifier: string,
    domain: 'legal' | 'medical' | 'educational' | 'business' | 'engineering',
    userTier: UserTier
  ): Promise<RateLimitResult> {
    const professionalConfig: Partial<IraqiRateLimitConfig> = {
      windowMs: 60 * 60 * 1000, // 1 hour window for professional use
      keyGenerator: (id: string) => `rate_limit:professional:${domain}:${id}`,
      professionalDomainMultiplier: 3.0, // Higher limits for professional use
    };

    return this.checkRateLimit(identifier, userTier, 'api', professionalConfig);
  }

  /**
   * Arabic translation specific rate limiting
   */
  async checkArabicTranslationLimit(
    identifier: string,
    userTier: UserTier,
    textLength: number
  ): Promise<RateLimitResult> {
    // Adjust limit based on text length
    const lengthMultiplier = Math.min(1.0, 1000 / Math.max(textLength, 100));
    
    const translationConfig: Partial<IraqiRateLimitConfig> = {
      arabicTranslationLimit: Math.floor(this.defaultConfig.arabicTranslationLimit * lengthMultiplier),
      keyGenerator: (id: string) => `rate_limit:translation:${id}`,
      windowMs: 5 * 60 * 1000, // 5 minute window for translations
    };

    return this.checkRateLimit(identifier, userTier, 'translation', translationConfig);
  }
}

// Export default configuration for Iraqi AI Chat System
export const IRAQI_RATE_LIMIT_CONFIG: IraqiRateLimitConfig = {
  windowMs: 60 * 1000,
  maxRequests: 60,
  guestLimit: 10,                    // Conservative for guests
  registeredLimit: 100,              // Standard for registered users
  premiumLimit: 500,                 // Premium Iraqi subscribers
  organizationLimit: 2000,           // Iraqi organizations/enterprises
  arabicTranslationLimit: 50,        // Arabic processing is resource-intensive
  culturalValidationLimit: 100,      // Cultural validation requests
  professionalDomainMultiplier: 2.5, // Boost for Iraqi professionals
  keyGenerator: (identifier: string) => `iraqi_ai:rate_limit:${identifier}`,
  skipSuccessfulRequests: false,
  skipFailedRequests: true, // Don't penalize failed requests
};