/**
 * Configurable Quota Management System
 * Extracted from vtchat - Enhanced for Iraqi AI Chat System
 *
 * Features:
 * - Dynamic quota configuration
 * - Professional domain-specific limits
 * - Iraqi payment gateway tier management
 * - Real-time quota adjustments
 * - Cultural and Arabic processing quotas
 */

import { Redis } from "ioredis";

export interface QuotaLimits {
  requests: {
    chat: number;
    translation: number;
    cultural_validation: number;
    image_generation: number;
    document_processing: number;
    professional_query: number;
  };
  tokens: {
    input: number;
    output: number;
    total: number;
  };
  storage: {
    documents: number; // MB
    images: number; // MB
    total: number; // MB
  };
  concurrent: {
    sessions: number;
    requests: number;
  };
}

export interface IraqiQuotaConfig {
  id: string;
  name: string;
  tier: "trial" | "basic" | "premium" | "organization" | "enterprise";

  // Time-based limits
  daily: QuotaLimits;
  monthly: QuotaLimits;

  // Iraqi-specific configurations
  professionalDomains: {
    legal: Partial<QuotaLimits>;
    medical: Partial<QuotaLimits>;
    educational: Partial<QuotaLimits>;
    business: Partial<QuotaLimits>;
    engineering: Partial<QuotaLimits>;
  };

  // Payment gateway specific bonuses
  paymentGatewayBonuses: {
    zaincash: number; // Multiplier bonus
    fastpay: number;
    nasswallet: number;
  };

  // Arabic processing specific limits
  arabicProcessing: {
    dialectRecognition: number; // Requests per day
    rtlProcessing: number; // Requests per day
    culturalValidation: number; // Requests per day
    mixedLanguage: number; // Requests per day
  };

  // Feature flags
  features: {
    advancedChat: boolean;
    imageGeneration: boolean;
    documentProcessing: boolean;
    professionalAccess: boolean;
    prioritySupport: boolean;
    customIntegrations: boolean;
  };

  // Pricing in Iraqi Dinar
  pricing: {
    monthlyFee: number; // IQD
    overage: {
      perRequest: number; // IQD per request over limit
      perToken: number; // IQD per 1K tokens over limit
      perMBStorage: number; // IQD per MB storage over limit
    };
  };

  // Auto-scaling configuration
  autoScaling: {
    enabled: boolean;
    maxMultiplier: number; // Maximum auto-scale multiplier
    costMultiplier: number; // Cost multiplier for auto-scaled usage
    warningThreshold: number; // Threshold to warn before auto-scaling
  };
}

export interface UserQuotaStatus {
  userId: string;
  configId: string;
  currentUsage: {
    daily: Partial<QuotaLimits>;
    monthly: Partial<QuotaLimits>;
  };
  remainingQuota: {
    daily: Partial<QuotaLimits>;
    monthly: Partial<QuotaLimits>;
  };
  percentageUsed: {
    daily: number;
    monthly: number;
  };
  resetTimes: {
    daily: Date;
    monthly: Date;
  };
  autoScaled: boolean;
  warningsTriggered: string[];
}

export class IraqiQuotaConfigService {
  private redis: Redis;
  private configCache: Map<string, IraqiQuotaConfig> = new Map();

  constructor(redis: Redis) {
    this.redis = redis;
    this.initializeDefaultConfigs();
  }

  /**
   * Get quota configuration by ID
   */
  async getQuotaConfig(configId: string): Promise<IraqiQuotaConfig | null> {
    // Check cache first
    if (this.configCache.has(configId)) {
      return this.configCache.get(configId)!;
    }

    try {
      const config = await this.redis.get(`quota_config:${configId}`);
      if (config) {
        const parsed = JSON.parse(config) as IraqiQuotaConfig;
        this.configCache.set(configId, parsed);
        return parsed;
      }
      return null;
    } catch (error) {
      console.error("Error fetching quota config:", error);
      return null;
    }
  }

  /**
   * Create or update quota configuration
   */
  async setQuotaConfig(config: IraqiQuotaConfig): Promise<void> {
    try {
      await this.redis.set(
        `quota_config:${config.id}`,
        JSON.stringify(config),
        "EX",
        86400 * 365, // Expire after 1 year
      );

      // Update cache
      this.configCache.set(config.id, config);
    } catch (error) {
      console.error("Error setting quota config:", error);
      throw new Error("Failed to save quota configuration");
    }
  }

  /**
   * Get user's quota status
   */
  async getUserQuotaStatus(userId: string): Promise<UserQuotaStatus | null> {
    try {
      const userConfigId = await this.redis.get(`user_quota:${userId}`);
      if (!userConfigId) {
        return null;
      }

      const config = await this.getQuotaConfig(userConfigId);
      if (!config) {
        return null;
      }

      const currentUsage = await this.getCurrentUsage(userId);
      const remainingQuota = this.calculateRemainingQuota(config, currentUsage);
      const percentageUsed = this.calculatePercentageUsed(config, currentUsage);

      return {
        userId,
        configId: userConfigId,
        currentUsage,
        remainingQuota,
        percentageUsed,
        resetTimes: {
          daily: this.getNextResetTime("daily"),
          monthly: this.getNextResetTime("monthly"),
        },
        autoScaled: await this.isAutoScaled(userId),
        warningsTriggered: await this.getTriggeredWarnings(userId),
      };
    } catch (error) {
      console.error("Error fetching user quota status:", error);
      return null;
    }
  }

  /**
   * Assign quota configuration to user
   */
  async assignQuotaToUser(
    userId: string,
    configId: string,
    paymentGateway?: "zaincash" | "fastpay" | "nasswallet",
    professionalDomain?:
      | "legal"
      | "medical"
      | "educational"
      | "business"
      | "engineering",
  ): Promise<void> {
    try {
      const userQuotaData = {
        configId,
        assignedAt: new Date().toISOString(),
        paymentGateway: paymentGateway || null,
        professionalDomain: professionalDomain || null,
      };

      await this.redis.set(
        `user_quota:${userId}`,
        configId,
        "EX",
        86400 * 365, // Expire after 1 year
      );

      await this.redis.set(
        `user_quota_details:${userId}`,
        JSON.stringify(userQuotaData),
        "EX",
        86400 * 365,
      );
    } catch (error) {
      console.error("Error assigning quota to user:", error);
      throw new Error("Failed to assign quota configuration");
    }
  }

  /**
   * Check if user can make a specific request type
   */
  async checkQuotaAllowance(
    userId: string,
    requestType: keyof QuotaLimits["requests"],
    tokensRequired: number = 0,
    storageRequired: number = 0,
  ): Promise<{
    allowed: boolean;
    reason?: string;
    remainingRequests: number;
    remainingTokens: number;
    remainingStorage: number;
    autoScaleAvailable: boolean;
  }> {
    const status = await this.getUserQuotaStatus(userId);
    if (!status) {
      return {
        allowed: false,
        reason: "No quota configuration found",
        remainingRequests: 0,
        remainingTokens: 0,
        remainingStorage: 0,
        autoScaleAvailable: false,
      };
    }

    const config = await this.getQuotaConfig(status.configId);
    if (!config) {
      return {
        allowed: false,
        reason: "Invalid quota configuration",
        remainingRequests: 0,
        remainingTokens: 0,
        remainingStorage: 0,
        autoScaleAvailable: false,
      };
    }

    const dailyRemaining =
      status.remainingQuota.daily.requests?.[requestType] || 0;
    const monthlyRemaining =
      status.remainingQuota.monthly.requests?.[requestType] || 0;
    const remainingTokens = Math.min(
      status.remainingQuota.daily.tokens?.total || 0,
      status.remainingQuota.monthly.tokens?.total || 0,
    );
    const remainingStorage = Math.min(
      status.remainingQuota.daily.storage?.total || 0,
      status.remainingQuota.monthly.storage?.total || 0,
    );

    // Check limits
    const requestsOk = Math.min(dailyRemaining, monthlyRemaining) > 0;
    const tokensOk = remainingTokens >= tokensRequired;
    const storageOk = remainingStorage >= storageRequired;

    const allowed = requestsOk && tokensOk && storageOk;

    // Check auto-scaling availability
    const autoScaleAvailable =
      config.autoScaling.enabled &&
      !status.autoScaled &&
      status.percentageUsed.daily < config.autoScaling.warningThreshold;

    let reason: string | undefined;
    if (!allowed) {
      if (!requestsOk) reason = "Request quota exceeded";
      else if (!tokensOk) reason = "Token quota exceeded";
      else if (!storageOk) reason = "Storage quota exceeded";
    }

    return {
      allowed,
      reason,
      remainingRequests: Math.min(dailyRemaining, monthlyRemaining),
      remainingTokens,
      remainingStorage,
      autoScaleAvailable,
    };
  }

  /**
   * Apply professional domain bonus to quota
   */
  async applyProfessionalDomainBonus(
    userId: string,
    domain: "legal" | "medical" | "educational" | "business" | "engineering",
  ): Promise<void> {
    try {
      const details = await this.redis.get(`user_quota_details:${userId}`);
      if (details) {
        const parsed = JSON.parse(details);
        parsed.professionalDomain = domain;
        parsed.domainBonusApplied = new Date().toISOString();

        await this.redis.set(
          `user_quota_details:${userId}`,
          JSON.stringify(parsed),
          "EX",
          86400 * 365,
        );
      }
    } catch (error) {
      console.error("Error applying professional domain bonus:", error);
      throw new Error("Failed to apply professional domain bonus");
    }
  }

  /**
   * Enable auto-scaling for user
   */
  async enableAutoScaling(userId: string): Promise<void> {
    try {
      await this.redis.set(
        `autoscale:${userId}`,
        new Date().toISOString(),
        "EX",
        86400, // Auto-scaling enabled for 24 hours
      );
    } catch (error) {
      console.error("Error enabling auto-scaling:", error);
      throw new Error("Failed to enable auto-scaling");
    }
  }

  /**
   * Get all available quota configurations
   */
  async getAllQuotaConfigs(): Promise<IraqiQuotaConfig[]> {
    try {
      const keys = await this.redis.keys("quota_config:*");
      if (keys.length === 0) {
        return [];
      }

      const configs = await this.redis.mget(...keys);
      return configs
        .filter((config) => config !== null)
        .map((config) => JSON.parse(config!) as IraqiQuotaConfig);
    } catch (error) {
      console.error("Error fetching all quota configs:", error);
      return [];
    }
  }

  private async getCurrentUsage(userId: string): Promise<{
    daily: Partial<QuotaLimits>;
    monthly: Partial<QuotaLimits>;
  }> {
    const today = new Date().toISOString().split("T")[0];
    const month = new Date().toISOString().slice(0, 7);

    const dailyUsageKey = `usage:daily:${userId}:${today}`;
    const monthlyUsageKey = `usage:monthly:${userId}:${month}`;

    try {
      const [dailyUsage, monthlyUsage] = await Promise.all([
        this.redis.hgetall(dailyUsageKey),
        this.redis.hgetall(monthlyUsageKey),
      ]);

      return {
        daily: this.parseUsageData(dailyUsage),
        monthly: this.parseUsageData(monthlyUsage),
      };
    } catch (error) {
      console.error("Error fetching current usage:", error);
      return { daily: {}, monthly: {} };
    }
  }

  private parseUsageData(usage: Record<string, string>): Partial<QuotaLimits> {
    const parsed: Partial<QuotaLimits> = {};

    // Parse requests
    if (usage.chat || usage.translation || usage.cultural_validation) {
      parsed.requests = {
        chat: parseInt(usage.chat || "0", 10),
        translation: parseInt(usage.translation || "0", 10),
        cultural_validation: parseInt(usage.cultural_validation || "0", 10),
        image_generation: parseInt(usage.image_generation || "0", 10),
        document_processing: parseInt(usage.document_processing || "0", 10),
        professional_query: parseInt(usage.professional_query || "0", 10),
      };
    }

    // Parse tokens
    if (usage.tokens_input || usage.tokens_output) {
      parsed.tokens = {
        input: parseInt(usage.tokens_input || "0", 10),
        output: parseInt(usage.tokens_output || "0", 10),
        total: parseInt(usage.tokens_total || "0", 10),
      };
    }

    // Parse storage
    if (usage.storage_documents || usage.storage_images) {
      parsed.storage = {
        documents: parseInt(usage.storage_documents || "0", 10),
        images: parseInt(usage.storage_images || "0", 10),
        total: parseInt(usage.storage_total || "0", 10),
      };
    }

    return parsed;
  }

  private calculateRemainingQuota(
    config: IraqiQuotaConfig,
    usage: { daily: Partial<QuotaLimits>; monthly: Partial<QuotaLimits> },
  ): { daily: Partial<QuotaLimits>; monthly: Partial<QuotaLimits> } {
    return {
      daily: this.subtractUsage(config.daily, usage.daily),
      monthly: this.subtractUsage(config.monthly, usage.monthly),
    };
  }

  private subtractUsage(
    limit: QuotaLimits,
    usage: Partial<QuotaLimits>,
  ): Partial<QuotaLimits> {
    const result: Partial<QuotaLimits> = {};

    if (limit.requests && usage.requests) {
      result.requests = {
        chat: Math.max(0, limit.requests.chat - (usage.requests.chat || 0)),
        translation: Math.max(
          0,
          limit.requests.translation - (usage.requests.translation || 0),
        ),
        cultural_validation: Math.max(
          0,
          limit.requests.cultural_validation -
            (usage.requests.cultural_validation || 0),
        ),
        image_generation: Math.max(
          0,
          limit.requests.image_generation -
            (usage.requests.image_generation || 0),
        ),
        document_processing: Math.max(
          0,
          limit.requests.document_processing -
            (usage.requests.document_processing || 0),
        ),
        professional_query: Math.max(
          0,
          limit.requests.professional_query -
            (usage.requests.professional_query || 0),
        ),
      };
    }

    if (limit.tokens && usage.tokens) {
      result.tokens = {
        input: Math.max(0, limit.tokens.input - (usage.tokens.input || 0)),
        output: Math.max(0, limit.tokens.output - (usage.tokens.output || 0)),
        total: Math.max(0, limit.tokens.total - (usage.tokens.total || 0)),
      };
    }

    if (limit.storage && usage.storage) {
      result.storage = {
        documents: Math.max(
          0,
          limit.storage.documents - (usage.storage.documents || 0),
        ),
        images: Math.max(0, limit.storage.images - (usage.storage.images || 0)),
        total: Math.max(0, limit.storage.total - (usage.storage.total || 0)),
      };
    }

    return result;
  }

  private calculatePercentageUsed(
    config: IraqiQuotaConfig,
    usage: { daily: Partial<QuotaLimits>; monthly: Partial<QuotaLimits> },
  ): { daily: number; monthly: number } {
    const dailyTotal = this.getTotalRequests(config.daily);
    const monthlyTotal = this.getTotalRequests(config.monthly);
    const dailyUsed = this.getTotalRequests(usage.daily);
    const monthlyUsed = this.getTotalRequests(usage.monthly);

    return {
      daily: dailyTotal > 0 ? (dailyUsed / dailyTotal) * 100 : 0,
      monthly: monthlyTotal > 0 ? (monthlyUsed / monthlyTotal) * 100 : 0,
    };
  }

  private getTotalRequests(limits: Partial<QuotaLimits>): number {
    if (!limits.requests) return 0;
    return Object.values(limits.requests).reduce(
      (sum, val) => sum + (val || 0),
      0,
    );
  }

  private getNextResetTime(period: "daily" | "monthly"): Date {
    const now = new Date();

    if (period === "daily") {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      return tomorrow;
    } else {
      const nextMonth = new Date(now);
      nextMonth.setMonth(nextMonth.getMonth() + 1, 1);
      nextMonth.setHours(0, 0, 0, 0);
      return nextMonth;
    }
  }

  private async isAutoScaled(userId: string): Promise<boolean> {
    try {
      const result = await this.redis.get(`autoscale:${userId}`);
      return result !== null;
    } catch (error) {
      return false;
    }
  }

  private async getTriggeredWarnings(userId: string): Promise<string[]> {
    try {
      const warnings = await this.redis.smembers(`warnings:${userId}`);
      return warnings;
    } catch (error) {
      return [];
    }
  }

  private initializeDefaultConfigs(): void {
    // Default configurations will be loaded asynchronously
    setTimeout(() => this.loadDefaultConfigs(), 1000);
  }

  private async loadDefaultConfigs(): Promise<void> {
    const defaultConfigs = this.getDefaultConfigs();

    for (const config of defaultConfigs) {
      try {
        const exists = await this.redis.exists(`quota_config:${config.id}`);
        if (!exists) {
          await this.setQuotaConfig(config);
        }
      } catch (error) {
        console.error(`Error loading default config ${config.id}:`, error);
      }
    }
  }

  private getDefaultConfigs(): IraqiQuotaConfig[] {
    return [
      // Trial tier configuration
      {
        id: "iraqi-trial",
        name: "Iraqi AI Chat - Trial",
        tier: "trial",
        daily: {
          requests: {
            chat: 50,
            translation: 20,
            cultural_validation: 30,
            image_generation: 5,
            document_processing: 10,
            professional_query: 15,
          },
          tokens: { input: 50000, output: 25000, total: 75000 },
          storage: { documents: 50, images: 25, total: 75 },
          concurrent: { sessions: 2, requests: 5 },
        },
        monthly: {
          requests: {
            chat: 1000,
            translation: 400,
            cultural_validation: 600,
            image_generation: 100,
            document_processing: 200,
            professional_query: 300,
          },
          tokens: { input: 1000000, output: 500000, total: 1500000 },
          storage: { documents: 1000, images: 500, total: 1500 },
          concurrent: { sessions: 5, requests: 10 },
        },
        professionalDomains: {
          legal: { requests: { professional_query: 25 } },
          medical: { requests: { professional_query: 20 } },
          educational: { requests: { professional_query: 30 } },
          business: { requests: { professional_query: 25 } },
          engineering: { requests: { professional_query: 20 } },
        },
        paymentGatewayBonuses: {
          zaincash: 1.2,
          fastpay: 1.15,
          nasswallet: 1.1,
        },
        arabicProcessing: {
          dialectRecognition: 100,
          rtlProcessing: 200,
          culturalValidation: 150,
          mixedLanguage: 100,
        },
        features: {
          advancedChat: false,
          imageGeneration: true,
          documentProcessing: true,
          professionalAccess: false,
          prioritySupport: false,
          customIntegrations: false,
        },
        pricing: {
          monthlyFee: 0, // Free trial
          overage: {
            perRequest: 100, // 100 IQD per overage request
            perToken: 0.1, // 0.1 IQD per 1K tokens
            perMBStorage: 50, // 50 IQD per MB
          },
        },
        autoScaling: {
          enabled: false,
          maxMultiplier: 1.5,
          costMultiplier: 2.0,
          warningThreshold: 0.8,
        },
      },

      // Premium tier configuration
      {
        id: "iraqi-premium",
        name: "Iraqi AI Chat - Premium",
        tier: "premium",
        daily: {
          requests: {
            chat: 1000,
            translation: 500,
            cultural_validation: 800,
            image_generation: 100,
            document_processing: 200,
            professional_query: 300,
          },
          tokens: { input: 2000000, output: 1000000, total: 3000000 },
          storage: { documents: 2000, images: 1000, total: 3000 },
          concurrent: { sessions: 10, requests: 25 },
        },
        monthly: {
          requests: {
            chat: 25000,
            translation: 12000,
            cultural_validation: 20000,
            image_generation: 2500,
            document_processing: 5000,
            professional_query: 8000,
          },
          tokens: { input: 50000000, output: 25000000, total: 75000000 },
          storage: { documents: 50000, images: 25000, total: 75000 },
          concurrent: { sessions: 25, requests: 50 },
        },
        professionalDomains: {
          legal: { requests: { professional_query: 500 } },
          medical: { requests: { professional_query: 400 } },
          educational: { requests: { professional_query: 600 } },
          business: { requests: { professional_query: 500 } },
          engineering: { requests: { professional_query: 400 } },
        },
        paymentGatewayBonuses: {
          zaincash: 1.3,
          fastpay: 1.25,
          nasswallet: 1.2,
        },
        arabicProcessing: {
          dialectRecognition: 2000,
          rtlProcessing: 5000,
          culturalValidation: 3000,
          mixedLanguage: 2000,
        },
        features: {
          advancedChat: true,
          imageGeneration: true,
          documentProcessing: true,
          professionalAccess: true,
          prioritySupport: true,
          customIntegrations: false,
        },
        pricing: {
          monthlyFee: 75000, // 75,000 IQD (~$57 USD)
          overage: {
            perRequest: 50, // 50 IQD per overage request
            perToken: 0.05, // 0.05 IQD per 1K tokens
            perMBStorage: 25, // 25 IQD per MB
          },
        },
        autoScaling: {
          enabled: true,
          maxMultiplier: 2.0,
          costMultiplier: 1.5,
          warningThreshold: 0.85,
        },
      },
    ];
  }
}
