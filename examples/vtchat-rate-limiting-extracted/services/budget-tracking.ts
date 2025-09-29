/**
 * Budget Monitoring and Quota Management System
 * Extracted from vtchat - Enhanced for Iraqi AI Chat System
 *
 * Features:
 * - Real-time budget monitoring
 * - Iraqi payment gateway integration
 * - Cost tracking per request type
 * - Professional domain billing
 * - Arabic processing cost optimization
 * - Subscription tier management
 */

import { Redis } from "ioredis";

export interface BudgetConfig {
  dailyLimit: number;
  monthlyLimit: number;
  costPerRequest: Record<string, number>;
  warningThresholds: number[];
  autoShutoffThreshold: number;
}

export interface IraqiBudgetConfig extends BudgetConfig {
  // Iraqi Dinar (IQD) based pricing
  costPerRequest: {
    chat: number; // Standard chat request
    translation: number; // Arabic translation
    cultural_validation: number; // Cultural compliance check
    image_generation: number; // Image generation
    document_processing: number; // Document analysis
    professional_query: number; // Legal/medical/educational
  };
  paymentGatewayFees: {
    zaincash: number; // ZainCash transaction fee %
    fastpay: number; // FastPay transaction fee %
    nasswallet: number; // NassWallet transaction fee %
  };
  professionalDomainMultipliers: {
    legal: number;
    medical: number;
    educational: number;
    business: number;
    engineering: number;
  };
  subscriptionTiers: {
    trial: { dailyLimit: number; monthlyLimit: number };
    basic: { dailyLimit: number; monthlyLimit: number };
    premium: { dailyLimit: number; monthlyLimit: number };
    organization: { dailyLimit: number; monthlyLimit: number };
  };
}

export interface BudgetUsage {
  dailySpent: number;
  monthlySpent: number;
  dailyRemaining: number;
  monthlyRemaining: number;
  requestCounts: Record<string, number>;
  lastReset: Date;
  warningTriggered: boolean;
  shutoffTriggered: boolean;
}

export interface CostBreakdown {
  baseCost: number;
  domainMultiplier: number;
  paymentGatewayFee: number;
  totalCost: number;
  currency: "IQD";
}

export class IraqiBudgetTrackingService {
  private redis: Redis;
  private config: IraqiBudgetConfig;

  constructor(redis: Redis, config?: Partial<IraqiBudgetConfig>) {
    this.redis = redis;
    this.config = {
      dailyLimit: 100000, // 100,000 IQD daily
      monthlyLimit: 2500000, // 2,500,000 IQD monthly
      costPerRequest: {
        chat: 25, // 25 IQD per chat
        translation: 50, // 50 IQD per translation
        cultural_validation: 15, // 15 IQD per validation
        image_generation: 200, // 200 IQD per image
        document_processing: 100, // 100 IQD per document
        professional_query: 75, // 75 IQD per professional query
      },
      paymentGatewayFees: {
        zaincash: 0.015, // 1.5% fee
        fastpay: 0.012, // 1.2% fee
        nasswallet: 0.018, // 1.8% fee
      },
      professionalDomainMultipliers: {
        legal: 2.0, // Legal queries cost 2x
        medical: 2.5, // Medical queries cost 2.5x
        educational: 1.5, // Educational queries cost 1.5x
        business: 1.8, // Business queries cost 1.8x
        engineering: 2.2, // Engineering queries cost 2.2x
      },
      subscriptionTiers: {
        trial: { dailyLimit: 5000, monthlyLimit: 50000 },
        basic: { dailyLimit: 25000, monthlyLimit: 500000 },
        premium: { dailyLimit: 100000, monthlyLimit: 2500000 },
        organization: { dailyLimit: 500000, monthlyLimit: 10000000 },
      },
      warningThresholds: [0.5, 0.75, 0.9], // 50%, 75%, 90%
      autoShutoffThreshold: 0.95, // 95%
      ...config,
    };
  }

  /**
   * Track a request and deduct from budget
   */
  async trackRequest(
    userId: string,
    requestType: keyof IraqiBudgetConfig["costPerRequest"],
    domain?: keyof IraqiBudgetConfig["professionalDomainMultipliers"],
    paymentGateway?: keyof IraqiBudgetConfig["paymentGatewayFees"],
  ): Promise<{
    success: boolean;
    cost: CostBreakdown;
    usage: BudgetUsage;
    warningLevel?: string;
  }> {
    const cost = this.calculateRequestCost(requestType, domain, paymentGateway);
    const usage = await this.getCurrentUsage(userId);

    // Check if request would exceed budget
    if (
      usage.dailySpent + cost.totalCost >
        usage.dailyRemaining + usage.dailySpent ||
      usage.monthlySpent + cost.totalCost >
        usage.monthlyRemaining + usage.monthlySpent
    ) {
      return {
        success: false,
        cost,
        usage,
        warningLevel: "BUDGET_EXCEEDED",
      };
    }

    // Update usage
    const newUsage = await this.updateUsage(
      userId,
      cost.totalCost,
      requestType,
    );

    // Check warning thresholds
    const warningLevel = this.checkWarningThresholds(newUsage);

    return {
      success: true,
      cost,
      usage: newUsage,
      warningLevel,
    };
  }

  /**
   * Calculate cost for a request with Iraqi-specific pricing
   */
  private calculateRequestCost(
    requestType: keyof IraqiBudgetConfig["costPerRequest"],
    domain?: keyof IraqiBudgetConfig["professionalDomainMultipliers"],
    paymentGateway?: keyof IraqiBudgetConfig["paymentGatewayFees"],
  ): CostBreakdown {
    const baseCost = this.config.costPerRequest[requestType];
    const domainMultiplier = domain
      ? this.config.professionalDomainMultipliers[domain]
      : 1.0;
    const adjustedCost = baseCost * domainMultiplier;

    const paymentGatewayFee = paymentGateway
      ? adjustedCost * this.config.paymentGatewayFees[paymentGateway]
      : 0;

    const totalCost = adjustedCost + paymentGatewayFee;

    return {
      baseCost,
      domainMultiplier,
      paymentGatewayFee,
      totalCost: Math.round(totalCost), // Round to nearest IQD
      currency: "IQD",
    };
  }

  /**
   * Get current usage for a user
   */
  async getCurrentUsage(userId: string): Promise<BudgetUsage> {
    const today = new Date().toISOString().split("T")[0];
    const month = new Date().toISOString().slice(0, 7);

    const dailyKey = `budget:daily:${userId}:${today}`;
    const monthlyKey = `budget:monthly:${userId}:${month}`;
    const countsKey = `budget:counts:${userId}:${today}`;

    try {
      const [dailySpent, monthlySpent, requestCounts] = await Promise.all([
        this.redis.get(dailyKey).then((val) => parseFloat(val || "0")),
        this.redis.get(monthlyKey).then((val) => parseFloat(val || "0")),
        this.redis.hgetall(countsKey),
      ]);

      // Convert request counts to numbers
      const counts: Record<string, number> = {};
      Object.entries(requestCounts).forEach(([key, value]) => {
        counts[key] = parseInt(value, 10) || 0;
      });

      return {
        dailySpent,
        monthlySpent,
        dailyRemaining: Math.max(0, this.config.dailyLimit - dailySpent),
        monthlyRemaining: Math.max(0, this.config.monthlyLimit - monthlySpent),
        requestCounts: counts,
        lastReset: new Date(),
        warningTriggered:
          dailySpent >
          this.config.dailyLimit * this.config.warningThresholds[0],
        shutoffTriggered:
          dailySpent >
          this.config.dailyLimit * this.config.autoShutoffThreshold,
      };
    } catch (error) {
      console.error("Error fetching budget usage:", error);
      return this.getEmptyUsage();
    }
  }

  /**
   * Update usage after a request
   */
  private async updateUsage(
    userId: string,
    cost: number,
    requestType: string,
  ): Promise<BudgetUsage> {
    const today = new Date().toISOString().split("T")[0];
    const month = new Date().toISOString().slice(0, 7);

    const dailyKey = `budget:daily:${userId}:${today}`;
    const monthlyKey = `budget:monthly:${userId}:${month}`;
    const countsKey = `budget:counts:${userId}:${today}`;

    try {
      const pipeline = this.redis.pipeline();

      // Update spending
      pipeline.incrbyfloat(dailyKey, cost);
      pipeline.incrbyfloat(monthlyKey, cost);

      // Update request counts
      pipeline.hincrby(countsKey, requestType, 1);

      // Set expiry (daily expires at midnight, monthly expires after 32 days)
      pipeline.expire(dailyKey, 86400);
      pipeline.expire(monthlyKey, 86400 * 32);
      pipeline.expire(countsKey, 86400);

      await pipeline.exec();

      return this.getCurrentUsage(userId);
    } catch (error) {
      console.error("Error updating budget usage:", error);
      throw new Error("Failed to update budget tracking");
    }
  }

  /**
   * Check warning thresholds and return appropriate level
   */
  private checkWarningThresholds(usage: BudgetUsage): string | undefined {
    const dailyPercentage = usage.dailySpent / this.config.dailyLimit;
    const monthlyPercentage = usage.monthlySpent / this.config.monthlyLimit;

    const maxPercentage = Math.max(dailyPercentage, monthlyPercentage);

    if (maxPercentage >= this.config.autoShutoffThreshold) {
      return "CRITICAL";
    } else if (maxPercentage >= this.config.warningThresholds[2]) {
      return "HIGH";
    } else if (maxPercentage >= this.config.warningThresholds[1]) {
      return "MEDIUM";
    } else if (maxPercentage >= this.config.warningThresholds[0]) {
      return "LOW";
    }

    return undefined;
  }

  /**
   * Get budget statistics for admin dashboard
   */
  async getBudgetStats(): Promise<{
    totalUsers: number;
    totalDailySpending: number;
    totalMonthlySpending: number;
    averageDailySpendPerUser: number;
    topSpendingUsers: Array<{ userId: string; dailySpent: number }>;
    requestTypeBreakdown: Record<string, number>;
  }> {
    const today = new Date().toISOString().split("T")[0];
    const month = new Date().toISOString().slice(0, 7);

    try {
      // Get all daily budget keys
      const dailyKeys = await this.redis.keys(`budget:daily:*:${today}`);
      const monthlyKeys = await this.redis.keys(`budget:monthly:*:${month}`);

      if (dailyKeys.length === 0) {
        return {
          totalUsers: 0,
          totalDailySpending: 0,
          totalMonthlySpending: 0,
          averageDailySpendPerUser: 0,
          topSpendingUsers: [],
          requestTypeBreakdown: {},
        };
      }

      // Get spending data
      const dailySpending = await this.redis.mget(...dailyKeys);
      const monthlySpending = await this.redis.mget(...monthlyKeys);

      const totalDailySpending = dailySpending
        .map((val) => parseFloat(val || "0"))
        .reduce((sum, val) => sum + val, 0);

      const totalMonthlySpending = monthlySpending
        .map((val) => parseFloat(val || "0"))
        .reduce((sum, val) => sum + val, 0);

      // Extract user IDs and create top spenders list
      const userSpending = dailyKeys.map((key, index) => {
        const userId = key.split(":")[2];
        const spent = parseFloat(dailySpending[index] || "0");
        return { userId, dailySpent: spent };
      });

      const topSpendingUsers = userSpending
        .sort((a, b) => b.dailySpent - a.dailySpent)
        .slice(0, 10);

      // Get request type breakdown
      const countsKeys = await this.redis.keys(`budget:counts:*:${today}`);
      const requestTypeBreakdown: Record<string, number> = {};

      for (const key of countsKeys) {
        const counts = await this.redis.hgetall(key);
        Object.entries(counts).forEach(([type, count]) => {
          requestTypeBreakdown[type] =
            (requestTypeBreakdown[type] || 0) + parseInt(count, 10);
        });
      }

      return {
        totalUsers: dailyKeys.length,
        totalDailySpending: Math.round(totalDailySpending),
        totalMonthlySpending: Math.round(totalMonthlySpending),
        averageDailySpendPerUser: Math.round(
          totalDailySpending / dailyKeys.length,
        ),
        topSpendingUsers,
        requestTypeBreakdown,
      };
    } catch (error) {
      console.error("Error fetching budget stats:", error);
      throw new Error("Failed to fetch budget statistics");
    }
  }

  /**
   * Reset budget for a user (admin function)
   */
  async resetUserBudget(userId: string): Promise<void> {
    const today = new Date().toISOString().split("T")[0];
    const month = new Date().toISOString().slice(0, 7);

    const keys = [
      `budget:daily:${userId}:${today}`,
      `budget:monthly:${userId}:${month}`,
      `budget:counts:${userId}:${today}`,
    ];

    try {
      await this.redis.del(...keys);
    } catch (error) {
      console.error("Error resetting user budget:", error);
      throw new Error("Failed to reset user budget");
    }
  }

  /**
   * Update subscription tier limits for a user
   */
  async updateUserSubscription(
    userId: string,
    tier: keyof IraqiBudgetConfig["subscriptionTiers"],
  ): Promise<void> {
    const subscriptionKey = `budget:subscription:${userId}`;
    const tierConfig = this.config.subscriptionTiers[tier];

    try {
      await this.redis.hmset(subscriptionKey, {
        tier,
        dailyLimit: tierConfig.dailyLimit,
        monthlyLimit: tierConfig.monthlyLimit,
        updatedAt: new Date().toISOString(),
      });

      // Set expiry for 1 year
      await this.redis.expire(subscriptionKey, 86400 * 365);
    } catch (error) {
      console.error("Error updating user subscription:", error);
      throw new Error("Failed to update user subscription");
    }
  }

  private getEmptyUsage(): BudgetUsage {
    return {
      dailySpent: 0,
      monthlySpent: 0,
      dailyRemaining: this.config.dailyLimit,
      monthlyRemaining: this.config.monthlyLimit,
      requestCounts: {},
      lastReset: new Date(),
      warningTriggered: false,
      shutoffTriggered: false,
    };
  }
}

// Export default Iraqi budget configuration
export const IRAQI_BUDGET_CONFIG: IraqiBudgetConfig = {
  dailyLimit: 50000, // 50,000 IQD daily default
  monthlyLimit: 1000000, // 1,000,000 IQD monthly default
  costPerRequest: {
    chat: 25, // 25 IQD per chat (~$0.019 USD)
    translation: 50, // 50 IQD per translation
    cultural_validation: 15, // 15 IQD per validation
    image_generation: 200, // 200 IQD per image
    document_processing: 100, // 100 IQD per document
    professional_query: 75, // 75 IQD per professional query
  },
  paymentGatewayFees: {
    zaincash: 0.015, // 1.5% fee (lowest)
    fastpay: 0.012, // 1.2% fee (competitive)
    nasswallet: 0.018, // 1.8% fee (standard)
  },
  professionalDomainMultipliers: {
    legal: 2.0, // Legal expertise premium
    medical: 2.5, // Medical expertise highest premium
    educational: 1.5, // Educational discount
    business: 1.8, // Business premium
    engineering: 2.2, // Engineering technical premium
  },
  subscriptionTiers: {
    trial: { dailyLimit: 2500, monthlyLimit: 25000 }, // Trial users
    basic: { dailyLimit: 25000, monthlyLimit: 500000 }, // Basic subscribers
    premium: { dailyLimit: 100000, monthlyLimit: 2500000 }, // Premium subscribers
    organization: { dailyLimit: 500000, monthlyLimit: 10000000 }, // Organizations
  },
  warningThresholds: [0.5, 0.75, 0.9],
  autoShutoffThreshold: 0.95,
};
