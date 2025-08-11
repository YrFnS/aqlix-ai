# Usage Tracking & Rate Limiting System for Iraqi AI Chat System

## TECHNOLOGY/FRAMEWORK:

**Advanced usage tracking and rate limiting system** with real-time usage monitoring, subscription-tier-based rate limits, token consumption tracking, and intelligent throttling for AI API calls and system resources.

**Specific technologies:** Redis rate limiting, usage analytics, token tracking, API throttling, subscription-based quotas, and real-time usage dashboards.

---

## TEMPLATE PURPOSE:

**Setting up comprehensive usage tracking and rate limiting infrastructure** for the Iraqi AI Chat System that monitors user activity, enforces subscription-based limits, tracks token consumption, and provides intelligent rate limiting across all system resources.

**Developers should be able to:** Implement rate limiting, track usage across subscription tiers, monitor token consumption, set up intelligent throttling, create usage analytics, and manage quota enforcement.

---

## CORE FEATURES:

**Essential usage tracking and rate limiting infrastructure:**

- **Subscription-Based Rate Limits:** Different rate limits per subscription tier (Free/Starter/Pro/Enterprise)
- **Token Consumption Tracking:** Real-time AI token usage monitoring and billing integration
- **Multi-Resource Rate Limiting:** API calls, file uploads, document generation, and AI interactions
- **Intelligent Throttling:** Smart rate limiting with burst allowances and usage patterns
- **Usage Analytics:** Comprehensive usage dashboards and consumption reports
- **Real-Time Monitoring:** Live usage tracking with alerts and notifications
- **Quota Management:** Flexible quota systems with overrides and temporary increases
- **Cultural Adaptation:** Usage patterns adapted for Iraqi business hours and cultural practices

---

## EXAMPLES TO INCLUDE:

**Working usage tracking and rate limiting examples:**

- **Rate Limit Middleware:** Express.js middleware for API rate limiting with Redis backend
- **Token Tracking:** AI token consumption tracking with billing integration
- **Usage Dashboard:** React components for real-time usage monitoring and analytics
- **Quota Management:** Admin interfaces for managing user quotas and rate limits
- **Alert System:** Usage threshold alerts and notification system
- **Analytics Reports:** Usage trend analysis and consumption forecasting
- **Subscription Integration:** Rate limit enforcement based on subscription tiers
- **Cultural Timing:** Iraqi business hours consideration in rate limiting algorithms

---

## DOCUMENTATION TO RESEARCH:

**Usage tracking and rate limiting documentation:**

**Rate Limiting Technologies:**
- **Redis Rate Limiting:** Redis-based rate limiting with sliding window algorithms
- **nginx Rate Limiting:** Server-level rate limiting and request throttling
- **Upstash Rate Limit:** Serverless rate limiting with global edge deployment

**Usage Analytics:**
- **Mixpanel:** Event tracking and usage analytics for SaaS applications
- **Amplitude:** Product analytics with usage tracking and user behavior analysis
- **PostHog:** Open-source product analytics with usage tracking capabilities

**Token and Resource Management:**
- **LiteLLM:** Token usage tracking and cost management for multiple AI providers
- **OpenAI Usage API:** Token consumption monitoring and billing integration
- **Anthropic API:** Claude token usage tracking and rate limiting

---

## IRAQI CULTURAL REQUIREMENTS:

**Cultural considerations for usage tracking:**

- **Business Hours Adaptation:** Rate limiting adjusted for Iraqi working hours (8 AM - 5 PM Iraq time)
- **Prayer Time Considerations:** Reduced rate limiting during prayer times to accommodate religious observance
- **Ramadan Scheduling:** Adjusted usage patterns during Ramadan with modified rate limits
- **Weekend Patterns:** Different rate limits for Iraqi weekends (Friday-Saturday)
- **Cultural Privacy:** Usage tracking respects Iraqi privacy expectations and cultural norms
- **Family Business Support:** Shared usage quotas for family business accounts

**Islamic Compliance:**
- **Transparent Usage Reporting:** Clear usage reporting without hidden tracking or billing
- **Ethical Rate Limiting:** Fair rate limiting that doesn't penalize legitimate usage
- **Privacy Protection:** Usage data collection compliant with Islamic privacy principles

---

## ACCESSIBILITY REQUIREMENTS:

**WCAG 2.1 AA compliance for usage interfaces:**

- **Screen Reader Support:** Arabic screen reader compatibility for usage dashboards
- **Keyboard Navigation:** Full usage monitoring interfaces accessible via keyboard
- **High Contrast:** Usage charts and graphs with sufficient color contrast
- **RTL Layout:** Right-to-left layout for Arabic usage reporting interfaces
- **Alternative Formats:** Usage data available in multiple accessible formats
- **Focus Management:** Clear focus indicators for usage control interfaces

---

## PERFORMANCE REQUIREMENTS:

**Usage tracking system performance standards:**

- **Real-Time Updates:** <100ms latency for usage tracking updates
- **Rate Limit Response:** <50ms rate limit decision time
- **Dashboard Loading:** <2s load time for usage dashboards
- **Analytics Processing:** <5s query time for usage analytics
- **Scalability:** Support for 100,000+ rate limit checks per second
- **Data Retention:** 12 months usage history with optimized storage

---

## SECURITY REQUIREMENTS:

**Usage tracking and rate limiting security:**

- **Data Protection:** Encrypted storage of all usage and tracking data
- **Access Control:** Role-based access to usage analytics and rate limit management
- **Rate Limit Bypass Prevention:** Security measures to prevent rate limit circumvention
- **Usage Data Privacy:** Secure handling of user usage patterns and consumption data
- **Audit Logging:** Complete audit trails for rate limit changes and usage anomalies
- **Anti-Abuse Detection:** Intelligent detection of usage abuse and suspicious patterns

---

## DATABASE SCHEMA:

**Core usage tracking and rate limiting tables:**

```sql
-- Rate Limit Configurations
CREATE TABLE rate_limit_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_plan_id UUID REFERENCES subscription_plans(id),
    resource_type VARCHAR(50) NOT NULL, -- api_calls, tokens, file_uploads, etc.
    limit_value INTEGER NOT NULL,
    limit_window INTEGER NOT NULL, -- seconds
    burst_allowance INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Usage Tracking
CREATE TABLE user_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    resource_type VARCHAR(50) NOT NULL,
    usage_count INTEGER DEFAULT 0,
    usage_window_start TIMESTAMP WITH TIME ZONE,
    usage_window_end TIMESTAMP WITH TIME ZONE,
    subscription_id UUID REFERENCES user_subscriptions(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Token Consumption Tracking
CREATE TABLE token_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    session_id UUID,
    model_provider VARCHAR(50) NOT NULL, -- openai, anthropic, etc.
    model_name VARCHAR(100) NOT NULL,
    input_tokens INTEGER DEFAULT 0,
    output_tokens INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    estimated_cost DECIMAL(10,6),
    cost_currency VARCHAR(3) DEFAULT 'USD',
    cost_iqd DECIMAL(10,4), -- Iraqi Dinar cost
    request_type VARCHAR(50), -- chat, completion, embedding, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Usage Analytics Aggregated Data
CREATE TABLE usage_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    subscription_id UUID REFERENCES user_subscriptions(id),
    date_period DATE NOT NULL,
    period_type VARCHAR(20) NOT NULL, -- daily, weekly, monthly
    total_api_calls INTEGER DEFAULT 0,
    total_tokens_consumed INTEGER DEFAULT 0,
    total_cost DECIMAL(10,4) DEFAULT 0,
    cost_currency VARCHAR(3) DEFAULT 'USD',
    cost_iqd DECIMAL(12,4), -- Iraqi Dinar cost
    resource_usage JSONB DEFAULT '{}', -- Detailed resource breakdown
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Rate Limit Violations
CREATE TABLE rate_limit_violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    resource_type VARCHAR(50) NOT NULL,
    violation_type VARCHAR(50) NOT NULL, -- exceeded_limit, burst_exceeded, quota_exceeded
    limit_value INTEGER,
    actual_usage INTEGER,
    violation_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_agent TEXT,
    ip_address INET,
    subscription_id UUID REFERENCES user_subscriptions(id),
    action_taken VARCHAR(100), -- blocked, throttled, warned
    metadata JSONB DEFAULT '{}'
);

-- Usage Quotas and Overrides
CREATE TABLE usage_quotas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    resource_type VARCHAR(50) NOT NULL,
    quota_limit INTEGER NOT NULL,
    quota_period VARCHAR(20) NOT NULL, -- daily, weekly, monthly
    quota_used INTEGER DEFAULT 0,
    quota_reset_date TIMESTAMP WITH TIME ZONE,
    override_reason VARCHAR(255),
    created_by UUID REFERENCES auth.users(id), -- Admin who set override
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Usage Alerts Configuration
CREATE TABLE usage_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    resource_type VARCHAR(50) NOT NULL,
    threshold_percentage INTEGER NOT NULL, -- Alert at X% of limit
    alert_type VARCHAR(20) NOT NULL, -- email, in_app, sms
    is_enabled BOOLEAN DEFAULT true,
    last_triggered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## RATE LIMITING STRATEGIES:

**Intelligent rate limiting algorithms:**

- **Sliding Window:** Precise rate limiting with smooth distribution
- **Token Bucket:** Burst allowances with steady-state limits
- **Fixed Window:** Simple rate limiting with periodic resets
- **Distributed Rate Limiting:** Consistent limits across multiple servers
- **Subscription-Aware:** Different limits based on subscription tiers
- **Cultural Adaptation:** Modified limits during Iraqi business hours and religious observances

**Rate Limit Tiers:**

```typescript
interface RateLimitTier {
  free: {
    api_calls: 100,      // per hour
    ai_tokens: 10000,    // per day
    file_uploads: 5,     // per day
    documents: 10        // per month
  },
  starter: {
    api_calls: 1000,     // per hour
    ai_tokens: 100000,   // per day
    file_uploads: 50,    // per day
    documents: 100       // per month
  },
  pro: {
    api_calls: 10000,    // per hour
    ai_tokens: 1000000,  // per day
    file_uploads: 500,   // per day
    documents: 1000      // per month
  },
  enterprise: {
    api_calls: 100000,   // per hour
    ai_tokens: 10000000, // per day
    file_uploads: 5000,  // per day
    documents: 10000     // per month
  }
}
```

---

## TESTING REQUIREMENTS:

**Comprehensive usage tracking and rate limiting testing:**

- **Load Testing:** Rate limiting performance under high concurrent usage
- **Accuracy Testing:** Usage tracking precision and billing accuracy validation
- **Edge Case Testing:** Rate limit boundary conditions and burst scenarios
- **Cultural Testing:** Iraqi business hours and religious observance adaptations
- **Security Testing:** Rate limit bypass prevention and abuse detection
- **Analytics Testing:** Usage dashboard accuracy and real-time data validation
- **Integration Testing:** Subscription tier rate limit enforcement
- **Performance Testing:** Sub-100ms rate limiting decision performance