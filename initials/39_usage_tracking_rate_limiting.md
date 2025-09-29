# Usage Tracking & Rate Limiting System for Iraqi AI Chat System

## TECHNOLOGY/FRAMEWORK:

**Comprehensive usage tracking and intelligent rate limiting system** with subscription tier management, cultural timing adaptation, AI token consumption monitoring, Iraqi Dinar cost calculation, and real-time usage analytics with Islamic business compliance.

**Specific technologies:** Redis rate limiting, usage analytics, subscription management, token consumption tracking, cost calculation APIs, cultural timing algorithms, and TypeScript integration with Islamic finance principles.

---

## TEMPLATE PURPOSE:

**Building intelligent usage tracking and rate limiting foundation** for the Iraqi AI Chat System that provides subscription tier management, cultural timing-aware rate limiting, AI token consumption tracking, cost monitoring, and comprehensive usage analytics with Islamic business compliance.

**Developers should be able to:** Implement subscription tier management, configure cultural rate limiting, track AI token usage, calculate costs in Iraqi Dinar, monitor usage patterns, generate analytics reports, and manage Islamic-compliant billing cycles.

---

## CORE FEATURES:

**Essential usage tracking and rate limiting infrastructure:**

### Subscription Tier Management

- **Tier-Based Rate Limits:** Different rate limits for Free, Starter, Pro, Enterprise tiers
- **Feature Access Control:** Subscription-based feature availability and access management
- **Upgrade/Downgrade Management:** Seamless subscription tier transitions with usage preservation
- **Iraqi Dinar Billing:** Subscription billing in Iraqi Dinar with Islamic finance compliance
- **Family Plan Support:** Iraqi family business subscription plans and shared usage tracking
- **Professional Domain Pricing:** Specialized pricing for Iraqi legal, medical, educational domains

### Cultural Timing-Aware Rate Limiting

- **Prayer Time Adjustments:** Reduced rate limiting during Islamic prayer times
- **Ramadan Adaptations:** Special rate limiting patterns during Ramadan month
- **Iraqi Weekend Patterns:** Adjusted limits for Iraqi weekends (Friday-Saturday)
- **Cultural Event Flexibility:** Modified limits during Iraqi cultural and religious holidays
- **Business Hours Optimization:** Enhanced limits during Iraqi business hours (8 AM - 5 PM Iraq time)
- **Regional Timing Variations:** Different timing adaptations for Baghdad, Basra, Mosul, Erbil

### AI Token Consumption Tracking

- **Real-time Token Monitoring:** Live tracking of AI token consumption across all interactions
- **Model-Specific Tracking:** Separate tracking for different AI models and services
- **Cultural Validation Token Costs:** Tracking token usage for Iraqi cultural validation processes
- **Professional Domain Token Analytics:** Specialized tracking for Iraqi professional domain usage
- **Multi-Agent Token Coordination:** Tracking token usage across 21 specialized Iraqi AI agents
- **Token Usage Optimization:** Intelligent token usage optimization and cost reduction recommendations

### Cost Calculation & Billing Integration

- **Iraqi Dinar Cost Calculation:** Real-time conversion and cost calculation in IQD
- **Islamic Finance Compliance:** Billing cycles and payment terms compliant with Islamic finance principles
- **Professional Domain Pricing:** Specialized pricing models for Iraqi professional services
- **Family Business Billing:** Shared billing and cost allocation for Iraqi family businesses
- **Transparent Cost Breakdown:** Clear, detailed cost breakdowns respecting Islamic transparency principles
- **Zakat-Aware Billing:** Billing systems that consider Islamic Zakat obligations

---

## EXAMPLES TO INCLUDE:

**Comprehensive usage tracking and rate limiting examples:**

### Cultural Rate Limiting Engine

```typescript
// Iraqi Cultural Rate Limiting System
interface CulturalRateLimitConfig {
  subscriptionTier: "free" | "starter" | "pro" | "enterprise";
  resourceType:
    | "api_calls"
    | "ai_tokens"
    | "file_uploads"
    | "document_generation";
  baseLimit: number;
  culturalAdjustments: {
    prayerTimeFactor: number; // 1.5x during prayer times
    ramadanFactor: number; // 2x during Ramadan
    businessHoursFactor: number; // 1.2x during business hours
    weekendFactor: number; // 0.8x during weekends
    culturalEventFactor: number; // 3x during cultural events
  };
  regionalVariations: {
    region: string;
    adjustmentFactor: number;
  }[];
}

class IraqiCulturalRateLimiter {
  constructor() {
    this.redisClient = new Redis(process.env.REDIS_URL);
    this.culturalTimingService = new CulturalTimingService();
    this.islamicCalendarService = new IslamicCalendarService();
    this.subscriptionManager = new SubscriptionManager();
  }

  async checkRateLimit(request: RateLimitRequest): Promise<RateLimitResult> {
    const { userId, resourceType, userRegion, currentTime } = request;

    // Get user subscription and base limits
    const subscription =
      await this.subscriptionManager.getUserSubscription(userId);
    const baseConfig = await this.getRateLimitConfig(
      subscription.tier,
      resourceType,
    );

    // Calculate cultural adjustments
    const culturalContext = await this.culturalTimingService.getCurrentContext({
      region: userRegion,
      currentTime,
      islamicCalendar: true,
    });

    const adjustedLimit = await this.calculateCulturallyAdjustedLimit({
      baseLimit: baseConfig.baseLimit,
      culturalContext,
      regionalVariations: baseConfig.regionalVariations,
      subscriptionTier: subscription.tier,
    });

    // Check current usage
    const currentUsage = await this.getCurrentUsage({
      userId,
      resourceType,
      timeWindow: baseConfig.windowDuration,
    });

    const allowed = currentUsage < adjustedLimit.finalLimit;

    if (allowed) {
      // Increment usage counter
      await this.incrementUsage({
        userId,
        resourceType,
        increment: 1,
        culturalContext: culturalContext.summary,
      });
    }

    return {
      allowed,
      limit: adjustedLimit.finalLimit,
      currentUsage,
      resetTime: adjustedLimit.resetTime,
      culturalAdjustments: adjustedLimit.appliedAdjustments,
      nextIncreasePeriod: culturalContext.nextEnhancementPeriod,
      culturalMessage: allowed
        ? null
        : await this.getCulturalRateLimitMessage(culturalContext),
    };
  }

  async calculateCulturallyAdjustedLimit(
    params: CulturalAdjustmentParams,
  ): Promise<AdjustedLimit> {
    const { baseLimit, culturalContext, regionalVariations, subscriptionTier } =
      params;
    let adjustedLimit = baseLimit;
    const appliedAdjustments = [];

    // Prayer time adjustment
    if (culturalContext.isPrayerTime || culturalContext.nearPrayerTime) {
      const prayerAdjustment = this.getPrayerTimeAdjustment(subscriptionTier);
      adjustedLimit *= prayerAdjustment;
      appliedAdjustments.push({
        type: "prayer_time",
        factor: prayerAdjustment,
        reason: "Increased flexibility during prayer times",
      });
    }

    // Ramadan adjustment
    if (culturalContext.isRamadan) {
      const ramadanAdjustment = this.getRamadanAdjustment(subscriptionTier);
      adjustedLimit *= ramadanAdjustment;
      appliedAdjustments.push({
        type: "ramadan",
        factor: ramadanAdjustment,
        reason: "Enhanced limits during Ramadan month",
      });
    }

    // Business hours adjustment
    if (culturalContext.isBusinessHours) {
      const businessHoursAdjustment =
        this.getBusinessHoursAdjustment(subscriptionTier);
      adjustedLimit *= businessHoursAdjustment;
      appliedAdjustments.push({
        type: "business_hours",
        factor: businessHoursAdjustment,
        reason: "Enhanced limits during Iraqi business hours",
      });
    }

    // Regional variation adjustment
    const regionalAdjustment = regionalVariations.find(
      (r) => r.region === culturalContext.region,
    );
    if (regionalAdjustment) {
      adjustedLimit *= regionalAdjustment.adjustmentFactor;
      appliedAdjustments.push({
        type: "regional",
        factor: regionalAdjustment.adjustmentFactor,
        reason: `Regional adjustment for ${culturalContext.region}`,
      });
    }

    // Cultural event adjustment
    if (culturalContext.isCulturalEvent) {
      const eventAdjustment = this.getCulturalEventAdjustment(
        culturalContext.culturalEvent,
        subscriptionTier,
      );
      adjustedLimit *= eventAdjustment;
      appliedAdjustments.push({
        type: "cultural_event",
        factor: eventAdjustment,
        reason: `Enhanced limits for ${culturalContext.culturalEvent.name}`,
      });
    }

    return {
      finalLimit: Math.floor(adjustedLimit),
      baseLimit,
      appliedAdjustments,
      resetTime: await this.calculateResetTime(culturalContext),
      culturallyOptimized: appliedAdjustments.length > 0,
    };
  }
}
```

### AI Token Consumption Tracking

```typescript
// AI Token Usage Tracking System
class AITokenUsageTracker {
  constructor() {
    this.costCalculator = new IraqiDinarCostCalculator();
    this.islamicBillingManager = new IslamicBillingManager();
    this.professionalDomainPricing = new ProfessionalDomainPricing();
    this.multiAgentTokenCoordinator = new MultiAgentTokenCoordinator();
  }

  async trackTokenUsage(usage: TokenUsageEvent): Promise<TokenTrackingResult> {
    const {
      userId,
      agentType,
      modelUsed,
      tokensConsumed,
      operationType,
      culturalValidationRequired,
      professionalDomain,
      conversationId,
    } = usage;

    // Calculate base cost
    const baseCost = await this.costCalculator.calculateTokenCost({
      modelUsed,
      tokensConsumed,
      operationType,
    });

    // Apply professional domain pricing
    let adjustedCost = baseCost;
    if (professionalDomain) {
      const professionalAdjustment =
        await this.professionalDomainPricing.getAdjustment({
          domain: professionalDomain,
          operationType,
          userRegion: await this.getUserRegion(userId),
        });
      adjustedCost = baseCost * professionalAdjustment.factor;
    }

    // Apply cultural validation cost if required
    if (culturalValidationRequired) {
      const culturalValidationCost =
        await this.costCalculator.calculateCulturalValidationCost({
          tokensConsumed,
          agentType,
          validationComplexity:
            usage.culturalValidationComplexity || "standard",
        });
      adjustedCost += culturalValidationCost;
    }

    // Convert to Iraqi Dinar
    const costInIQD = await this.costCalculator.convertToIQD(adjustedCost);

    // Track usage in database
    const trackingRecord = await this.recordTokenUsage({
      userId,
      conversationId,
      agentType,
      modelUsed,
      tokensConsumed,
      baseCostUSD: baseCost,
      adjustedCostUSD: adjustedCost,
      costIQD: costInIQD,
      operationType,
      professionalDomain,
      culturalValidationRequired,
      timestamp: new Date(),
    });

    // Update user subscription usage
    await this.updateSubscriptionUsage({
      userId,
      tokensUsed: tokensConsumed,
      costAccumulated: costInIQD,
      resourceType: operationType,
    });

    // Check if approaching limits
    const limitCheck = await this.checkTokenLimits({
      userId,
      currentUsage: trackingRecord.cumulativeUsage,
      costAccumulated: trackingRecord.cumulativeCost,
    });

    return {
      success: true,
      trackingId: trackingRecord.id,
      tokensConsumed,
      costUSD: adjustedCost,
      costIQD: costInIQD,
      cumulativeTokens: trackingRecord.cumulativeUsage,
      cumulativeCostIQD: trackingRecord.cumulativeCost,
      limitStatus: limitCheck,
      culturalValidationCost: culturalValidationRequired
        ? await this.costCalculator.calculateCulturalValidationCost({
            tokensConsumed,
            agentType,
            validationComplexity:
              usage.culturalValidationComplexity || "standard",
          })
        : 0,
      professionalDomainDiscount: professionalDomain
        ? await this.professionalDomainPricing.getDiscount(professionalDomain)
        : null,
    };
  }

  async generateUsageAnalytics(
    userId: string,
    period: "daily" | "weekly" | "monthly",
    includeProjections: boolean = true,
  ): Promise<UsageAnalytics> {
    const usage = await this.getUsageData(userId, period);

    // Calculate usage patterns
    const patterns = await this.analyzeUsagePatterns({
      usage,
      period,
      includeCulturalPatterns: true,
      includeProfessionalPatterns: true,
    });

    // Generate cost breakdown
    const costBreakdown = await this.generateCostBreakdown({
      usage,
      includeAgentSpecificCosts: true,
      includeCulturalValidationCosts: true,
      includeProfessionalDomainCosts: true,
    });

    // Calculate Islamic finance compliance metrics
    const islamicComplianceMetrics =
      await this.islamicBillingManager.calculateComplianceMetrics({
        usage,
        costBreakdown,
        billingPeriod: period,
      });

    // Generate optimization recommendations
    const optimizationRecommendations =
      await this.generateOptimizationRecommendations({
        usage,
        patterns,
        costBreakdown,
        userSubscription:
          await this.subscriptionManager.getUserSubscription(userId),
      });

    // Future usage projections
    let projections = null;
    if (includeProjections) {
      projections = await this.generateUsageProjections({
        historicalUsage: usage,
        patterns,
        culturalEvents: await this.getCulturalEventCalendar(),
        professionalSeasonality: await this.getProfessionalSeasonality(
          usage.professionalDomain,
        ),
      });
    }

    return {
      period,
      totalTokensUsed: usage.totalTokens,
      totalCostUSD: usage.totalCostUSD,
      totalCostIQD: usage.totalCostIQD,
      agentUsageBreakdown: usage.agentBreakdown,
      culturalValidationUsage: usage.culturalValidationTokens,
      professionalDomainUsage: usage.professionalDomainTokens,
      usagePatterns: patterns,
      costBreakdown,
      islamicComplianceMetrics,
      optimizationRecommendations,
      projections,
      culturalTimingImpact: patterns.culturalTimingImpact,
      professionalUsageInsights: patterns.professionalInsights,
    };
  }
}
```

### Islamic Finance-Compliant Billing System

```typescript
// Islamic Finance Compliant Billing Manager
class IslamicBillingManager {
  constructor() {
    this.zakatCalculator = new ZakatCalculator();
    this.islamicCalendar = new IslamicCalendarService();
    this.transparencyManager = new BillingTransparencyManager();
    this.riba_avoidance = new RibaAvoidanceManager();
  }

  async generateIslamicCompliantBill(
    userId: string,
    billingPeriod: BillingPeriod,
    usage: UsageData,
  ): Promise<IslamicCompliantBill> {
    // Ensure transparent pricing without hidden fees
    const transparentCosts =
      await this.transparencyManager.calculateTransparentCosts({
        baseUsage: usage.baseUsage,
        culturalValidationCosts: usage.culturalValidationCosts,
        professionalDomainCosts: usage.professionalDomainCosts,
        noHiddenFees: true,
        clarityRequired: true,
      });

    // Avoid any Riba (interest-based) charges
    const ribaFreeCosts = await this.riba_avoidance.ensureRibaFreeCalculation({
      costs: transparentCosts,
      subscriptionType: await this.getSubscriptionType(userId),
      paymentTerms: "immediate", // No interest-based payment terms
      lateFeeStructure: "service_based", // Service-based, not interest-based late fees
    });

    // Calculate Islamic calendar-aligned billing
    const islamicBillingDates =
      await this.islamicCalendar.calculateBillingDates({
        billingPeriod,
        avoidFridayBilling: true, // Respect Jumu'ah day
        considerRamadanSchedule: true,
        alignWithIslamicMonths: true,
      });

    // Generate Zakat-aware billing information
    const zakatInformation =
      await this.zakatCalculator.calculateZakatInformation({
        totalBilling: ribaFreeCosts.totalAmount,
        userBusinessType: await this.getUserBusinessType(userId),
        providedAsInformation: true, // Zakat calculation provided as information, not requirement
      });

    // Create detailed, transparent billing breakdown
    const billingBreakdown = await this.createDetailedBreakdown({
      tokenUsageCosts: ribaFreeCosts.tokenCosts,
      culturalValidationCosts: ribaFreeCosts.culturalCosts,
      professionalDomainCosts: ribaFreeCosts.professionalCosts,
      subscriptionFees: ribaFreeCosts.subscriptionFees,
      transparencyLevel: "full",
      islamicPrinciplesCompliance: true,
    });

    return {
      billId: generateBillId(),
      userId,
      billingPeriod,

      // Transparent cost structure
      costBreakdown: billingBreakdown,
      totalAmountUSD: ribaFreeCosts.totalAmount,
      totalAmountIQD: await this.convertToIQD(ribaFreeCosts.totalAmount),

      // Islamic compliance features
      ribaFreeConfirmation: true,
      transparencyCompliance: true,
      hiddenFeesConfirmation: "no_hidden_fees",

      // Islamic calendar integration
      billingDate: islamicBillingDates.billingDate,
      dueDate: islamicBillingDates.dueDate,
      islamicMonthReference: islamicBillingDates.islamicMonth,

      // Zakat information (informational only)
      zakatInformation: {
        applicableAmount: zakatInformation.applicableAmount,
        zakatRate: zakatInformation.rate,
        estimatedZakatIQD: zakatInformation.estimatedZakat,
        informationalOnly: true,
        zakatCalculationBasis: zakatInformation.basis,
      },

      // Payment terms
      paymentTerms: {
        immediatePayment: true,
        noInterestCharges: true,
        noCompoundingFees: true,
        lateFeeStructure: "service_based",
        islamicCompliant: true,
      },

      // Professional domain considerations
      professionalDomainBilling: usage.professionalDomain
        ? {
            domain: usage.professionalDomain,
            specializedServices: billingBreakdown.professionalServices,
            professionalDiscount: billingBreakdown.professionalDiscount,
            institutionalBilling: await this.checkInstitutionalBilling(userId),
          }
        : null,

      createdAt: new Date(),
      islamicComplianceVerified: true,
    };
  }

  async processIslamicCompliantPayment(
    billId: string,
    paymentMethod: IslamicPaymentMethod,
    paymentAmount: number,
  ): Promise<IslamicPaymentResult> {
    // Verify payment method is Islamic-compliant
    const paymentMethodValidation =
      await this.validateIslamicPaymentMethod(paymentMethod);

    if (!paymentMethodValidation.isCompliant) {
      return {
        success: false,
        error: "Payment method not Islamic-compliant",
        islamicIssues: paymentMethodValidation.issues,
        suggestedAlternatives: paymentMethodValidation.alternatives,
      };
    }

    // Process payment with Iraqi gateways (ZainCash, FastPay, NassWallet)
    const paymentResult = await this.processPaymentWithIraqiGateways({
      billId,
      amount: paymentAmount,
      paymentMethod,
      islamicCompliance: true,
      transparentProcessing: true,
    });

    if (paymentResult.success) {
      // Update billing status
      await this.updateBillStatus({
        billId,
        status: "paid",
        paymentDate: new Date(),
        paymentMethod: paymentMethod.type,
        islamicCompliant: true,
      });

      // Generate Islamic-compliant receipt
      const receipt = await this.generateIslamicCompliantReceipt({
        billId,
        paymentResult,
        includeZakatInformation: true,
        transparencyLevel: "full",
      });

      return {
        success: true,
        paymentId: paymentResult.paymentId,
        receipt,
        islamicComplianceConfirmed: true,
        zakatInformationProvided: true,
      };
    }

    return {
      success: false,
      error: paymentResult.error,
      islamicComplianceIssues: paymentResult.islamicIssues,
    };
  }
}
```

---

## DATABASE SCHEMA:

**Usage tracking and rate limiting database tables:**

```sql
-- Subscription Management with Iraqi Context
CREATE TABLE iraqi_subscription_management (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),

    -- Subscription details
    subscription_tier VARCHAR(20) NOT NULL, -- free, starter, pro, enterprise
    subscription_status VARCHAR(20) DEFAULT 'active',
    subscription_type VARCHAR(50) DEFAULT 'individual', -- individual, family, professional, institutional

    -- Billing information
    billing_currency VARCHAR(3) DEFAULT 'IQD',
    monthly_cost_iqd DECIMAL(10,2),
    annual_cost_iqd DECIMAL(12,2),
    next_billing_date DATE,
    billing_cycle VARCHAR(20) DEFAULT 'monthly',

    -- Iraqi context
    region VARCHAR(50) DEFAULT 'baghdad',
    professional_domain VARCHAR(50),
    institutional_affiliation VARCHAR(200),
    family_plan_members INTEGER DEFAULT 1,

    -- Islamic billing preferences
    islamic_billing_calendar BOOLEAN DEFAULT true,
    avoid_friday_billing BOOLEAN DEFAULT true,
    zakat_information_requested BOOLEAN DEFAULT false,
    riba_free_confirmation BOOLEAN DEFAULT true,

    -- Usage limits by tier
    monthly_api_calls_limit INTEGER,
    monthly_tokens_limit INTEGER,
    monthly_file_uploads_limit INTEGER,
    monthly_document_generation_limit INTEGER,

    -- Cultural adaptations
    prayer_time_enhanced_limits BOOLEAN DEFAULT true,
    ramadan_enhanced_limits BOOLEAN DEFAULT true,
    cultural_event_enhanced_limits BOOLEAN DEFAULT true,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Rate Limiting with Cultural Context
CREATE TABLE cultural_rate_limiting (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),

    -- Rate limiting configuration
    resource_type VARCHAR(50) NOT NULL, -- api_calls, tokens, file_uploads, document_generation
    base_limit INTEGER NOT NULL,
    window_duration_seconds INTEGER NOT NULL,
    current_usage INTEGER DEFAULT 0,
    last_reset TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Cultural adjustments
    prayer_time_factor DECIMAL(3,2) DEFAULT 1.5,
    ramadan_factor DECIMAL(3,2) DEFAULT 2.0,
    business_hours_factor DECIMAL(3,2) DEFAULT 1.2,
    weekend_factor DECIMAL(3,2) DEFAULT 0.8,
    cultural_event_factor DECIMAL(3,2) DEFAULT 3.0,

    -- Regional variations
    region VARCHAR(50) DEFAULT 'baghdad',
    regional_adjustment_factor DECIMAL(3,2) DEFAULT 1.0,

    -- Current cultural context
    current_cultural_adjustments JSONB DEFAULT '[]',
    active_cultural_factors JSONB DEFAULT '{}',
    next_adjustment_time TIMESTAMP WITH TIME ZONE,

    -- Performance tracking
    average_usage_per_window DECIMAL(8,2),
    peak_usage_time TIME,
    cultural_usage_patterns JSONB DEFAULT '{}',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- AI Token Usage Tracking
CREATE TABLE ai_token_usage_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    conversation_id UUID,

    -- Token usage details
    agent_type VARCHAR(50) NOT NULL,
    model_used VARCHAR(100) NOT NULL,
    tokens_consumed INTEGER NOT NULL,
    operation_type VARCHAR(50) NOT NULL, -- chat, cultural_validation, professional_query, document_generation

    -- Cost calculation
    base_cost_usd DECIMAL(10,6) NOT NULL,
    adjusted_cost_usd DECIMAL(10,6) NOT NULL,
    cost_iqd DECIMAL(12,4) NOT NULL,
    exchange_rate_used DECIMAL(8,4),

    -- Cultural and professional context
    cultural_validation_required BOOLEAN DEFAULT false,
    cultural_validation_complexity VARCHAR(20), -- simple, standard, complex
    cultural_validation_cost_usd DECIMAL(8,6) DEFAULT 0,
    professional_domain VARCHAR(50),
    professional_domain_discount DECIMAL(3,2),

    -- Performance metrics
    response_time_ms INTEGER,
    cultural_validation_time_ms INTEGER,
    agent_processing_time_ms INTEGER,

    -- Usage classification
    usage_category VARCHAR(50), -- business, educational, personal, professional
    peak_usage_period BOOLEAN DEFAULT false,
    cultural_timing_context JSONB DEFAULT '{}',

    -- Cumulative tracking
    daily_cumulative_tokens INTEGER,
    monthly_cumulative_tokens INTEGER,
    daily_cumulative_cost_iqd DECIMAL(12,4),
    monthly_cumulative_cost_iqd DECIMAL(12,4),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Islamic Finance Compliant Billing
CREATE TABLE islamic_compliant_billing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),

    -- Billing period
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    islamic_month VARCHAR(50),
    islamic_year INTEGER,

    -- Transparent cost breakdown
    base_subscription_cost_iqd DECIMAL(12,4) NOT NULL,
    token_usage_cost_iqd DECIMAL(12,4) DEFAULT 0,
    cultural_validation_cost_iqd DECIMAL(12,4) DEFAULT 0,
    professional_services_cost_iqd DECIMAL(12,4) DEFAULT 0,
    total_amount_iqd DECIMAL(12,4) NOT NULL,

    -- Islamic compliance confirmations
    riba_free_confirmed BOOLEAN DEFAULT true,
    hidden_fees_confirmed BOOLEAN DEFAULT false, -- No hidden fees
    transparent_pricing_confirmed BOOLEAN DEFAULT true,
    islamic_calendar_aligned BOOLEAN DEFAULT true,

    -- Zakat information (informational only)
    zakat_applicable_amount_iqd DECIMAL(12,4),
    zakat_rate DECIMAL(3,4), -- e.g., 0.025 for 2.5%
    estimated_zakat_iqd DECIMAL(12,4),
    zakat_information_provided BOOLEAN DEFAULT true,

    -- Payment terms
    payment_due_date DATE NOT NULL,
    payment_terms VARCHAR(20) DEFAULT 'immediate',
    late_fee_structure VARCHAR(50) DEFAULT 'service_based',
    no_interest_charges_confirmed BOOLEAN DEFAULT true,

    -- Bill status
    bill_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, overdue, cancelled
    payment_date TIMESTAMP WITH TIME ZONE,
    payment_method VARCHAR(50),
    payment_reference VARCHAR(200),

    -- Professional domain billing
    professional_domain VARCHAR(50),
    professional_discount_applied DECIMAL(3,2),
    institutional_billing BOOLEAN DEFAULT false,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Usage Analytics and Reporting
CREATE TABLE usage_analytics_reporting (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),

    -- Analytics period
    analytics_period VARCHAR(20) NOT NULL, -- daily, weekly, monthly, yearly
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,

    -- Usage totals
    total_api_calls INTEGER DEFAULT 0,
    total_tokens_consumed INTEGER DEFAULT 0,
    total_cost_usd DECIMAL(12,6) DEFAULT 0,
    total_cost_iqd DECIMAL(14,4) DEFAULT 0,

    -- Agent usage breakdown
    agent_usage_breakdown JSONB DEFAULT '{}',
    most_used_agent VARCHAR(50),
    cultural_validation_percentage DECIMAL(3,2),

    -- Cultural usage patterns
    prayer_time_usage_percentage DECIMAL(3,2),
    ramadan_usage_increase_percentage DECIMAL(3,2),
    cultural_event_usage_spikes JSONB DEFAULT '[]',
    regional_usage_patterns JSONB DEFAULT '{}',

    -- Professional domain analytics
    professional_domain VARCHAR(50),
    professional_usage_percentage DECIMAL(3,2),
    professional_cost_savings_iqd DECIMAL(12,4),

    -- Performance insights
    average_response_time_ms DECIMAL(8,2),
    peak_usage_hours JSONB DEFAULT '[]',
    usage_efficiency_score DECIMAL(3,2),

    -- Cost optimization recommendations
    cost_optimization_opportunities JSONB DEFAULT '[]',
    subscription_tier_recommendations JSONB DEFAULT '{}',
    usage_pattern_insights JSONB DEFAULT '{}',

    -- Islamic finance metrics
    islamic_compliance_percentage DECIMAL(3,2) DEFAULT 100,
    zakat_applicable_costs_iqd DECIMAL(12,4),
    transparent_billing_score DECIMAL(3,2) DEFAULT 100,

    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Cultural Timing Events for Rate Limiting
CREATE TABLE cultural_timing_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Event identification
    event_type VARCHAR(50) NOT NULL, -- prayer_time, ramadan, cultural_holiday, business_hours
    event_name VARCHAR(200) NOT NULL,
    event_description TEXT,

    -- Timing details
    event_start TIMESTAMP WITH TIME ZONE NOT NULL,
    event_end TIMESTAMP WITH TIME ZONE NOT NULL,
    recurring_pattern VARCHAR(50), -- daily, weekly, monthly, yearly, special

    -- Regional applicability
    applicable_regions VARCHAR[] DEFAULT ARRAY['all'],
    region_specific_adjustments JSONB DEFAULT '{}',

    -- Rate limiting impact
    rate_limit_adjustment_factor DECIMAL(3,2) NOT NULL,
    applicable_resource_types VARCHAR[] DEFAULT ARRAY['all'],
    priority_level INTEGER DEFAULT 5, -- 1-10, higher = more important

    -- Cultural context
    islamic_significance BOOLEAN DEFAULT false,
    professional_impact JSONB DEFAULT '{}',
    cultural_importance_level INTEGER DEFAULT 5,

    -- System integration
    auto_apply BOOLEAN DEFAULT true,
    requires_manual_activation BOOLEAN DEFAULT false,
    notification_required BOOLEAN DEFAULT false,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## VALIDATION REQUIREMENTS:

**Usage tracking and rate limiting validation:**

### Rate Limiting Testing

- **Cultural Timing Validation:** Test prayer time, Ramadan, and cultural event rate limit adjustments
- **Subscription Tier Testing:** Test rate limiting across Free, Starter, Pro, Enterprise tiers
- **Regional Variation Testing:** Test rate limiting for Baghdad, Basra, Mosul, Erbil regions
- **Load Testing:** Test rate limiting performance under high concurrent usage
- **Cultural Edge Cases:** Test rate limiting during overlapping cultural events

### Token Usage Tracking Testing

- **Real-time Tracking:** Test real-time token consumption tracking accuracy
- **Multi-Agent Coordination:** Test token tracking across 21 specialized Iraqi AI agents
- **Cost Calculation:** Test accurate cost calculation in USD and Iraqi Dinar
- **Professional Domain Pricing:** Test specialized pricing for Iraqi professional domains
- **Cultural Validation Costs:** Test token cost tracking for cultural validation processes

### Islamic Finance Compliance Testing

- **Riba-Free Validation:** Test billing system for complete absence of interest-based charges
- **Transparency Testing:** Test billing transparency and hidden fee elimination
- **Zakat Information Testing:** Test accurate Zakat information calculation and provision
- **Islamic Calendar Integration:** Test billing alignment with Islamic calendar and timing
- **Payment Method Validation:** Test Islamic-compliant payment processing with Iraqi gateways

---

## INTEGRATION FOCUS:

**Usage tracking and rate limiting integration points:**

### Core System Integration

- **Authentication Integration:** Usage tracking integration with Iraqi authentication system
- **Subscription Management Integration:** Rate limiting integration with subscription tier management
- **Cultural System Integration:** Deep integration with Iraqi cultural timing and Islamic compliance
- **Payment Gateway Integration:** Islamic-compliant billing integration with ZainCash, FastPay, NassWallet

### Agent Ecosystem Integration

- **Multi-Agent Token Coordination:** Token tracking across 21 specialized Iraqi AI agents
- **Agent Performance Integration:** Usage tracking integration with agent performance monitoring
- **Cultural Validation Integration:** Token cost tracking for Iraqi cultural validation processes
- **Professional Domain Integration:** Usage tracking for Iraqi professional domain services

### Analytics and Monitoring Integration

- **Real-time Analytics:** Usage analytics integration with real-time monitoring systems
- **Cost Optimization Integration:** Usage pattern analysis for cost optimization recommendations
- **Cultural Usage Insights:** Integration with cultural timing analytics and pattern recognition
- **Professional Usage Analytics:** Integration with Iraqi professional domain usage insights

---

## ADDITIONAL NOTES:

**Iraqi AI usage tracking and rate limiting considerations:**

### Implementation Priorities

- **Cultural sensitivity first** - All rate limiting must respect Iraqi cultural values and Islamic timing
- **Islamic finance compliance** - Complete adherence to Sharia-compliant billing and payment principles
- **Professional domain optimization** - Specialized usage tracking for Iraqi professional contexts
- **Transparent cost management** - Clear, honest cost tracking respecting Islamic transparency principles

### Performance and Scalability

- **<10ms rate limiting decisions** for immediate user feedback
- **<50ms usage tracking updates** for real-time usage monitoring
- **<100ms cost calculations** for responsive billing and analytics
- **Scalable architecture** supporting 100,000+ concurrent usage tracking processes

### Cultural and Professional Focus

- **Prayer time consideration** - Enhanced rate limits during Islamic prayer times
- **Ramadan adaptations** - Special usage patterns and limits during Ramadan month
- **Professional domain expertise** - Specialized usage tracking for Iraqi legal, medical, educational contexts
- **Family business support** - Shared usage tracking and billing for Iraqi family business structures

---

## TEMPLATE COMPLEXITY LEVEL:

- [ ] **Beginner-friendly** - Simple getting started patterns
- [ ] **Intermediate** - Production-ready patterns with common features
- [x] **Advanced** - Comprehensive patterns including complex scenarios
- [ ] **Enterprise** - Full enterprise patterns with monitoring, scaling, security

**Advanced complexity selected** because usage tracking and rate limiting requires sophisticated cultural timing algorithms, Islamic finance compliance, multi-agent token coordination, professional domain pricing, and advanced analytics with Iraqi cultural sensitivity.

---

**This focused micro-initial provides comprehensive usage tracking and rate limiting foundation with cultural timing adaptation, Islamic finance compliance, and Iraqi professional domain optimization for the Iraqi AI Chat System.**
