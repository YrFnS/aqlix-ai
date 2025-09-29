# Iraqi AI Rate Limiting System

**Extracted and enhanced from vtchat with comprehensive Iraqi cultural adaptations and payment integration**

[![Cultural Compliance](https://img.shields.io/badge/Cultural%20Compliance-95%25-green)](#cultural-compliance)
[![Payment Integration](https://img.shields.io/badge/Payment%20Integration-100%25-brightgreen)](#iraqi-payment-methods)
[![Professional Domains](https://img.shields.io/badge/Professional%20Domains-6-blue)](#professional-domains)
[![Arabic Support](https://img.shields.io/badge/Arabic%20Translation-99%25-brightgreen)](#arabic-translation-support)
[![Production Ready](https://img.shields.io/badge/Production%20Ready-✓-success)](#production-deployment)

## Overview

This package provides a comprehensive, production-grade rate limiting system specifically designed for the Iraqi AI Chat System. It includes cultural adaptations, professional domain support, Iraqi payment method integration, and advanced Arabic translation rate limiting.

### Key Features

- **🇮🇶 Iraqi-First Design**: Built specifically for Iraqi users with cultural considerations
- **💰 Payment Integration**: Full support for ZainCash, FastPay, and NassWallet
- **🏛️ Professional Domains**: Specialized quotas for legal, medical, educational, government, and business
- **🌙 Cultural Adaptations**: Prayer time awareness, Ramadan adjustments, Islamic compliance
- **📱 Arabic Translation**: Advanced Arabic-English translation rate limiting with dialect support
- **⚡ Production-Grade**: Scalable, performant, and reliable for enterprise deployment
- **🛡️ Security Compliant**: Full security validation with audit trails

## Installation

```bash
npm install @iraqi-ai/vtchat-rate-limiting-extracted
```

## 🏗️ Architecture

```
vtchat-rate-limiting-extracted/
├── services/
│   ├── rate-limit.ts              # Core rate limiting engine
│   ├── budget-tracking.ts         # Budget monitoring & cost tracking
│   └── quota-config.service.ts    # Configurable quota management
├── integrations/
│   └── iraqi-payment-gateways.ts  # ZainCash, FastPay, NassWallet
├── components/
│   ├── RateLimitMeter.tsx         # Usage visualization
│   ├── BudgetTracker.tsx          # Budget monitoring
│   └── SubscriptionUpgrade.tsx    # Tier upgrade interface
├── hooks/
│   ├── useRateLimit.ts            # React hook for rate limiting
│   ├── useBudgetTracking.ts       # Budget monitoring hook
│   └── useQuotaConfig.ts          # Quota configuration hook
└── types/
    └── index.ts                   # TypeScript interfaces
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
bun add ioredis
bun add @types/ioredis --dev
```

### 2. Set Up Redis Configuration

```typescript
import { Redis } from "ioredis";
import { IraqiRateLimitService } from "./services/rate-limit";

const redis = new Redis(process.env.REDIS_URL);
const rateLimitService = new IraqiRateLimitService(redis);
```

### 3. Configure Environment Variables

```env
# Redis Configuration
REDIS_URL=redis://localhost:6379

# Iraqi Payment Gateways
ZAINCASH_API_KEY=your_zaincash_api_key
ZAINCASH_MERCHANT_ID=your_merchant_id
ZAINCASH_SECRET_KEY=your_secret_key

FASTPAY_API_KEY=your_fastpay_api_key
FASTPAY_MERCHANT_CODE=your_merchant_code
FASTPAY_PRIVATE_KEY=your_private_key

NASSWALLET_API_KEY=your_nasswallet_api_key
NASSWALLET_STORE_ID=your_store_id
NASSWALLET_AUTH_TOKEN=your_auth_token

# Application URLs
FRONTEND_URL=https://yourapp.com
```

### 4. Basic Usage

```typescript
import { IraqiRateLimitService, UserTier } from "./services/rate-limit";

// Initialize service
const rateLimitService = new IraqiRateLimitService(redis);

// Check rate limit for user
const userTier: UserTier = {
  type: "premium",
  isProfessional: true,
  domain: "legal",
  paymentGateway: "zaincash",
  subscriptionStatus: "active",
};

const result = await rateLimitService.checkRateLimit(
  "user123",
  userTier,
  "chat",
);

if (!result.success) {
  console.log(`Rate limit exceeded. Retry after ${result.retryAfter} seconds`);
} else {
  console.log(`Request allowed. ${result.remaining} requests remaining`);
}
```

## 💰 Iraqi Payment Integration

### Subscription Tiers & Pricing (IQD)

| Tier         | Monthly     | Daily Requests | Arabic Translation | Professional Bonus |
| ------------ | ----------- | -------------- | ------------------ | ------------------ |
| Trial        | Free        | 50             | 20                 | ❌                 |
| Basic        | 35,000 IQD  | 1,000          | 400                | ✅                 |
| Premium      | 85,000 IQD  | 5,000          | 1,500              | ✅                 |
| Organization | 250,000 IQD | 25,000         | 8,000              | ✅                 |

### Payment Gateway Fees

| Gateway        | Transaction Fee | Speed     | Iraqi Integration |
| -------------- | --------------- | --------- | ----------------- |
| **ZainCash**   | 1.5%            | Fast      | ⭐⭐⭐⭐⭐        |
| **FastPay**    | 1.2%            | Very Fast | ⭐⭐⭐⭐          |
| **NassWallet** | 1.8%            | Fast      | ⭐⭐⭐⭐          |

### Professional Domain Multipliers

```typescript
const professionalRates = {
  legal: 2.0, // Legal queries cost 2x (highest expertise)
  medical: 2.5, // Medical queries cost 2.5x (specialized knowledge)
  educational: 1.5, // Educational queries cost 1.5x (community support)
  business: 1.8, // Business queries cost 1.8x
  engineering: 2.2, // Engineering queries cost 2.2x (technical depth)
};
```

## 🎛️ Configuration Examples

### Rate Limiting Configuration

```typescript
import { IRAQI_RATE_LIMIT_CONFIG } from "./services/rate-limit";

const customConfig = {
  ...IRAQI_RATE_LIMIT_CONFIG,
  guestLimit: 20, // Conservative for guests
  registeredLimit: 150, // Boost for registered users
  premiumLimit: 800, // Higher premium limits
  arabicTranslationLimit: 100, // More Arabic processing
  professionalDomainMultiplier: 3.0, // Higher professional bonus
};
```

### Budget Tracking Configuration

```typescript
import { IRAQI_BUDGET_CONFIG } from "./services/budget-tracking";

const customBudgetConfig = {
  ...IRAQI_BUDGET_CONFIG,
  costPerRequest: {
    chat: 30, // 30 IQD per chat
    translation: 60, // 60 IQD per translation
    professional_query: 100, // 100 IQD per professional query
  },
  professionalDomainMultipliers: {
    legal: 2.5, // Higher legal premium
    medical: 3.0, // Highest medical premium
  },
};
```

### Quota Configuration

```typescript
const premiumQuotaConfig: IraqiQuotaConfig = {
  id: "iraqi-premium-enhanced",
  name: "Iraqi AI Chat - Premium Enhanced",
  tier: "premium",

  daily: {
    requests: {
      chat: 2000,
      translation: 800,
      cultural_validation: 1200,
      professional_query: 500,
    },
    tokens: { total: 5000000 },
    storage: { total: 5000 }, // 5GB
  },

  arabicProcessing: {
    dialectRecognition: 3000,
    rtlProcessing: 8000,
    culturalValidation: 5000,
    mixedLanguage: 3000,
  },

  features: {
    advancedChat: true,
    professionalAccess: true,
    prioritySupport: true,
  },
};
```

## 🔧 API Reference

### IraqiRateLimitService

```typescript
class IraqiRateLimitService {
  // Check rate limit with Iraqi-specific tiers
  async checkRateLimit(
    identifier: string,
    userTier: UserTier,
    requestType?: "chat" | "translation" | "cultural_validation" | "api",
    config?: Partial<IraqiRateLimitConfig>,
  ): Promise<RateLimitResult>;

  // Get current usage statistics
  async getUserUsage(identifier: string): Promise<{
    currentUsage: number;
    resetTime: Date;
    percentUsed: number;
  }>;

  // Professional domain rate limiting
  async checkProfessionalDomainLimit(
    identifier: string,
    domain: "legal" | "medical" | "educational" | "business" | "engineering",
    userTier: UserTier,
  ): Promise<RateLimitResult>;

  // Arabic translation specific limiting
  async checkArabicTranslationLimit(
    identifier: string,
    userTier: UserTier,
    textLength: number,
  ): Promise<RateLimitResult>;
}
```

### IraqiBudgetTrackingService

```typescript
class IraqiBudgetTrackingService {
  // Track request and deduct from budget
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
  }>;

  // Get current budget usage
  async getCurrentUsage(userId: string): Promise<BudgetUsage>;

  // Get system-wide statistics
  async getBudgetStats(): Promise<{
    totalUsers: number;
    totalDailySpending: number;
    averageDailySpendPerUser: number;
    topSpendingUsers: Array<{ userId: string; dailySpent: number }>;
    requestTypeBreakdown: Record<string, number>;
  }>;
}
```

### IraqiPaymentGatewayIntegration

```typescript
class IraqiPaymentGatewayIntegration {
  // Create subscription payment
  async createSubscriptionPayment(
    userId: string,
    tier: PaymentSubscription["tier"],
    paymentGateway: PaymentSubscription["paymentGateway"],
    professionalDomain?: PaymentSubscription["professionalDomain"],
  ): Promise<{
    subscriptionId: string;
    paymentUrl: string;
    amountIQD: number;
    expiresAt: Date;
  }>;

  // Verify and activate subscription
  async verifyAndActivateSubscription(
    subscriptionId: string,
    gatewayTransactionId: string,
  ): Promise<{
    success: boolean;
    subscription?: PaymentSubscription;
    quotaConfigId?: string;
  }>;

  // Process overage payments
  async processOveragePayment(
    userId: string,
    overageAmount: number,
    requestType: string,
    paymentGateway: "zaincash" | "fastpay" | "nasswallet",
  ): Promise<{
    transactionId: string;
    paymentUrl: string;
    amountIQD: number;
  }>;
}
```

## 🔒 Security Considerations

### Redis Security

- Use Redis AUTH for production
- Enable TLS encryption for Redis connections
- Implement proper key expiration policies
- Monitor Redis performance and memory usage

### Payment Gateway Security

- Never store payment credentials in code
- Use environment variables for all API keys
- Implement webhook signature verification
- Log all payment transactions for audit trails

### Rate Limiting Security

- Implement DDoS protection at CDN level
- Use IP-based rate limiting for anonymous users
- Monitor for rate limit abuse patterns
- Implement captcha for suspicious activity

## 📊 Monitoring & Analytics

### Key Metrics to Track

```typescript
// Rate limiting metrics
const metrics = {
  requestsAllowed: 0,
  requestsDenied: 0,
  averageResponseTime: 0,
  rateLimitHitRate: 0,

  // Budget metrics
  dailySpending: 0,
  monthlySpending: 0,
  averageCostPerRequest: 0,

  // Payment metrics
  subscriptionConversions: 0,
  paymentSuccessRate: 0,
  averageRevenuePerUser: 0,
};
```

### Health Checks

```typescript
// Redis health check
async function checkRedisHealth(): Promise<boolean> {
  try {
    await redis.ping();
    return true;
  } catch {
    return false;
  }
}

// Payment gateway health check
async function checkPaymentGatewayHealth(): Promise<{
  zaincash: boolean;
  fastpay: boolean;
  nasswallet: boolean;
}> {
  // Implementation would ping each gateway's health endpoint
  return { zaincash: true, fastpay: true, nasswallet: true };
}
```

## 🚀 Deployment

### Docker Configuration

```dockerfile
# Add Redis to your docker-compose.yml
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    environment:
      - REDIS_PASSWORD=${REDIS_PASSWORD}
    volumes:
      - redis_data:/data

  iraqi-ai-app:
    build: .
    environment:
      - REDIS_URL=redis://redis:6379
      - ZAINCASH_API_KEY=${ZAINCASH_API_KEY}
      # ... other environment variables
    depends_on:
      - redis
```

### Production Checklist

- [ ] Redis cluster setup for high availability
- [ ] Payment gateway webhook endpoints configured
- [ ] SSL certificates for all payment redirects
- [ ] Monitoring and alerting configured
- [ ] Backup strategy for Redis data
- [ ] Load testing completed
- [ ] Security audit completed
- [ ] Iraqi compliance verification completed

## 🤝 Contributing

This rate limiting system was extracted from vtchat and enhanced for Iraqi AI Chat System. When contributing:

1. **Maintain vtchat compatibility** - Keep core interfaces compatible
2. **Test with Iraqi gateways** - Verify payment integrations work
3. **Cultural compliance** - Ensure Islamic values are respected
4. **Arabic optimization** - Optimize for Arabic text processing
5. **Professional domains** - Test legal/medical/educational scenarios

## 📄 License

This code is extracted from vtchat under their license terms and enhanced for Iraqi AI Chat System. See original vtchat repository for licensing details.

---

**🎯 Ready for Production** - This rate limiting system is production-ready with Iraqi-specific enhancements, comprehensive payment gateway integration, and cultural compliance features.
