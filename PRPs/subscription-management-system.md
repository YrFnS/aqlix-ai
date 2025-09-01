name: "Iraqi AI Subscription Management System - Comprehensive Implementation PRP"
description: |
  Complete subscription management system with Islamic compliance, Iraqi payment integration,
  and multi-tier feature access control. Context-rich PRP designed for one-pass implementation.

---

## Goal
Build a comprehensive subscription management system for the Iraqi AI Chat System that provides multiple subscription tiers (Free, Starter, Pro, Enterprise) with Islamic compliance, Iraqi payment gateway integration, feature-based access control, billing cycle management, and subscription analytics.

## Why  
- **Revenue Generation**: Enable sustainable monetization through subscription tiers
- **Cultural Compliance**: Respect Islamic business principles and Iraqi payment preferences
- **Feature Access Control**: Manage AI features based on subscription level and usage limits
- **Business Intelligence**: Track subscription metrics, churn, and revenue optimization
- **User Experience**: Seamless subscription management with Iraqi cultural appropriateness
- **Market Expansion**: Support both Iraqi and international users with localized billing

## What
A complete subscription billing platform with:
- Multi-tier subscription plans with Islamic compliance validation
- Iraqi payment gateway integration (ZainCash, FastPay, NassWallet)  
- Feature flag management for tier-based access control
- Subscription lifecycle management (trials, upgrades, downgrades, cancellations)
- Billing automation with proration and multiple cycle support
- Analytics dashboard with MRR tracking and churn analysis
- Admin interface for subscription and billing management
- Cultural compliance throughout all billing processes

### Success Criteria
- [ ] Four subscription tiers (Free, Starter, Pro, Enterprise) fully functional
- [ ] Islamic compliance validation with 95%+ accuracy for all billing operations
- [ ] Iraqi payment gateway integration with 99%+ success rates
- [ ] Feature access control system with LaunchDarkly integration
- [ ] Subscription analytics with ChartMogul-style MRR/churn tracking
- [ ] Trial management with conversion optimization
- [ ] Admin dashboard with complete subscription management capabilities
- [ ] WCAG 2.1 AA accessibility compliance for all subscription interfaces

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window

# Stripe 2025 Subscription API (PRIMARY)
- url: https://docs.stripe.com/billing/subscriptions/overview
  why: Core subscription architecture and lifecycle management patterns
  
- url: https://docs.stripe.com/api/subscriptions  
  why: API reference for subscription creation, modification, cancellation
  critical: Must use API version 2025-06-30.basil or later

- url: https://docs.stripe.com/billing/subscriptions/build-subscriptions
  why: Step-by-step integration guide with webhook handling

# ChartMogul Analytics Integration  
- url: https://chartmogul.com/subscription-analytics/
  why: MRR tracking, churn analysis patterns, and cohort analytics
  
- url: https://help.chartmogul.com/hc/en-us/articles/204898491-Chart-Gross-MRR-Churn-Rate
  why: Churn calculation methodologies and industry benchmarks

# LaunchDarkly Feature Flag Management
- url: https://docs.launchdarkly.com/home/account/plans
  why: Subscription tier-based feature access control patterns
  
- url: https://aws.amazon.com/blogs/apn/simple-and-flexible-saas-entitlement-management-with-launchdarkly/
  why: SaaS entitlement management with subscription context

# Islamic Banking Compliance (CRITICAL for Iraqi market)
- url: https://sdk.finance/is-islamic-banking-truly-shariah-compliant-debunking-myths-and-clarifying-key-concepts/
  why: 2025 Shariah compliance requirements and billing practices
  critical: No interest-based calculations, transparent pricing, profit-sharing models

# Existing Codebase Patterns (CRITICAL)
- file: examples/phase4-implementation-foundation/types/src/payments.ts
  why: Existing payment schemas, Islamic compliance patterns, and Zod validation
  critical: Follow PaymentConfigSchema and IslamicFinanceComplianceSchema patterns

- file: examples/kortix-suna-extracted/frontend/billing/subscription-management-modal.tsx  
  why: Subscription UI patterns, modal structure, error handling
  critical: Follow existing modal patterns and state management

- file: examples/kortix-suna-extracted/frontend/billing/payment-required-dialog.tsx
  why: Payment upgrade flow patterns and user experience
  
- file: examples/kortix-suna-extracted/frontend/billing/subscription-status-management.tsx
  why: Subscription status display and management patterns
```

### Current Codebase Structure
```bash
aqlix-ai/
├── examples/
│   ├── phase4-implementation-foundation/
│   │   └── types/src/
│   │       └── payments.ts                    # Payment schemas and Islamic compliance
│   └── kortix-suna-extracted/
│       └── frontend/billing/
│           ├── subscription-management-modal.tsx  # Subscription UI patterns
│           ├── payment-required-dialog.tsx        # Payment upgrade flows  
│           └── subscription-status-management.tsx # Status management
├── project-context/                          # Iraqi AI agent architecture (22 agents)
├── PRPs/                                     # PRP documentation
└── CLAUDE.md                                # Iraqi cultural compliance rules
```

### Desired Codebase Structure with New Files
```bash
# Backend API (FastAPI + Supabase)
apps/api/
├── src/
│   ├── services/
│   │   ├── subscription_service.py          # Core subscription CRUD operations
│   │   ├── billing_service.py               # Billing cycle and proration logic  
│   │   ├── islamic_compliance_service.py    # Islamic billing validation
│   │   ├── feature_flag_service.py          # LaunchDarkly integration
│   │   └── analytics_service.py             # ChartMogul integration
│   ├── models/
│   │   ├── subscription_models.py           # Pydantic subscription models
│   │   └── billing_models.py                # Billing and invoice models
│   ├── api/
│   │   ├── subscription_routes.py           # Subscription API endpoints
│   │   └── billing_routes.py                # Billing API endpoints
│   └── database/
│       └── subscription_schema.sql          # Database tables and indexes

# Frontend (Next.js + React)  
apps/web/
├── src/
│   ├── components/
│   │   ├── subscription/
│   │   │   ├── PlanSelector.tsx             # Subscription plan selection
│   │   │   ├── BillingDashboard.tsx         # User billing dashboard
│   │   │   ├── SubscriptionStatus.tsx       # Current subscription display
│   │   │   └── TrialBanner.tsx              # Trial status and conversion
│   │   └── admin/
│   │       └── AdminSubscriptionManager.tsx # Admin subscription management
│   ├── hooks/
│   │   ├── useSubscription.ts               # Subscription state management
│   │   └── useBilling.ts                    # Billing data hooks  
│   └── services/
│       └── subscriptionApi.ts               # API integration layer
```

### Known Gotchas & Library Quirks
```typescript
// CRITICAL: Islamic Compliance Requirements
// Must follow profit-sharing model, not interest-based billing
// Example: Subscription pricing uses markup model instead of interest
const islamicBilling = {
  // ✅ CORRECT: Profit-sharing markup
  monthlyPrice: basePrice * (1 + profitMargin), 
  // ❌ WRONG: Interest-based calculation
  monthlyPrice: basePrice * (1 + interestRate * months)
}

// CRITICAL: Stripe API 2025 Requirements  
// Must use API version 2025-06-30.basil for enhanced subscription features
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-06-30.basil', // REQUIRED for 2025 features
});

// CRITICAL: Iraqi Payment Gateway Limits (from payments.ts)
const GATEWAY_LIMITS = {
  ZainCash: { min: 1000, max: 5000000, currency: 'IQD' },     // 1K-5M IQD
  FastPay: { min: 500, max: 2000000, currency: 'IQD' },       // 500-2M IQD  
  NassWallet: { min: 1000, max: 3000000, currency: 'IQD' }    // 1K-3M IQD
};

// CRITICAL: ChartMogul MRR Movements
// Must track 6 movement types: New, Expansion, Contraction, Churn, Reactivation, Neutral
// MRR calculations require precise webhook handling from payment gateways

// CRITICAL: LaunchDarkly Context for Feature Flags
// Subscription tier must be included in LaunchDarkly context for proper feature access
const ldContext = {
  kind: 'user',
  key: userId,
  subscriptionTier: user.subscription.plan_name, // Required for tier-based features
  culturalContext: 'iraqi',                      // Required for cultural features
};
```

## Implementation Blueprint

### Data Models and Structure

Core subscription data models following existing payment patterns:

```typescript
// Extend existing IslamicFinanceComplianceSchema from payments.ts
export const SubscriptionPlanSchema = z.object({
  id: z.string().uuid(),
  name: z.enum(['free', 'starter', 'pro', 'enterprise']),
  display_name: z.record(z.string()), // Arabic + English names
  description: z.record(z.string()),
  pricing: z.object({
    monthly: z.number().min(0),
    quarterly: z.number().min(0), 
    annual: z.number().min(0),
    currency: z.enum(['IQD', 'USD', 'EUR']).default('IQD'),
    iqd_equivalent: z.number().optional() // For non-IQD pricing
  }),
  features: z.record(z.boolean()), // Feature access matrix
  limits: z.object({
    monthly_queries: z.number(),
    concurrent_sessions: z.number(),
    file_uploads: z.number(),
    api_calls: z.number()
  }),
  trial_days: z.number().default(0),
  islamic_compliance: IslamicFinanceComplianceSchema, // From payments.ts
  is_active: z.boolean().default(true)
});

export const UserSubscriptionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  plan_id: z.string().uuid(),
  status: z.enum(['trial', 'active', 'cancelled', 'expired', 'past_due']),
  billing_cycle: z.enum(['monthly', 'quarterly', 'annual']),
  current_period_start: z.string().datetime(),
  current_period_end: z.string().datetime(),
  trial_start: z.string().datetime().optional(),
  trial_end: z.string().datetime().optional(),
  cancelled_at: z.string().datetime().optional(),
  payment_gateway: IraqiPaymentGatewayEnum, // From payments.ts
  gateway_subscription_id: z.string().optional(),
  islamic_compliance_validated: z.boolean().default(false),
  cultural_validation_score: z.number().min(0).max(100).optional()
});
```

### Task Implementation Sequence

```yaml
Task 1: Database Schema and Migration
MODIFY apps/api/database/migrations/:
  - CREATE subscription_plans table (using provided schema from feature file)
  - CREATE user_subscriptions table
  - CREATE billing_history table  
  - CREATE subscription_changes table
  - ADD indexes for performance optimization

Task 2: Core Subscription Models  
CREATE apps/api/src/models/subscription_models.py:
  - MIRROR pattern from: examples/phase4-implementation-foundation/types/src/payments.ts
  - EXTEND IslamicFinanceComplianceSchema for subscription validation
  - CREATE SubscriptionPlan, UserSubscription, BillingHistory Pydantic models
  - ADD subscription status validation and business rules

Task 3: Islamic Compliance Service
CREATE apps/api/src/services/islamic_compliance_service.py:
  - EXTEND existing IslamicFinanceComplianceSchema patterns
  - IMPLEMENT profit-sharing calculation model (not interest-based)
  - ADD cultural validation using iraqi-cultural-validator agent
  - VALIDATE pricing transparency and Shariah compliance

Task 4: Core Subscription Service
CREATE apps/api/src/services/subscription_service.py:
  - IMPLEMENT subscription CRUD operations with Islamic validation
  - ADD subscription lifecycle management (create, upgrade, downgrade, cancel)
  - INTEGRATE with existing payment gateway patterns from payments.ts
  - HANDLE trial management and conversion logic

Task 5: Billing Service with Proration
CREATE apps/api/src/services/billing_service.py:
  - IMPLEMENT billing cycle management (monthly, quarterly, annual)
  - ADD proration calculations for subscription changes
  - INTEGRATE with Iraqi payment gateways using existing patterns
  - HANDLE invoice generation and payment processing

Task 6: Feature Flag Integration
CREATE apps/api/src/services/feature_flag_service.py:
  - INTEGRATE LaunchDarkly SDK with subscription context
  - IMPLEMENT tier-based feature access control
  - ADD subscription limit enforcement
  - HANDLE feature flag evaluation with Iraqi cultural context

Task 7: Analytics Service
CREATE apps/api/src/services/analytics_service.py:
  - IMPLEMENT ChartMogul-style MRR tracking
  - ADD churn analysis and cohort reporting  
  - TRACK subscription conversion metrics
  - INTEGRATE with existing monitoring patterns

Task 8: Subscription API Endpoints
CREATE apps/api/src/api/subscription_routes.py:
  - MIRROR pattern from existing API route structure
  - IMPLEMENT RESTful subscription management endpoints
  - ADD proper error handling and validation
  - INTEGRATE Islamic compliance validation for all operations

Task 9: Frontend Plan Selection Component
CREATE apps/web/src/components/subscription/PlanSelector.tsx:
  - MIRROR pattern from: examples/kortix-suna-extracted/frontend/billing/
  - IMPLEMENT tier comparison with Islamic-compliant pricing display
  - ADD RTL support for Arabic content
  - INTEGRATE with existing modal patterns

Task 10: Billing Dashboard Component  
CREATE apps/web/src/components/subscription/BillingDashboard.tsx:
  - EXTEND pattern from: subscription-management-modal.tsx
  - ADD billing history, invoice downloads, payment method management
  - IMPLEMENT subscription upgrade/downgrade flows
  - ADD Islamic compliance indicators

Task 11: Admin Subscription Management
CREATE apps/web/src/components/admin/AdminSubscriptionManager.tsx:
  - IMPLEMENT comprehensive subscription administration
  - ADD user subscription search and modification
  - INTEGRATE analytics dashboard with MRR/churn metrics  
  - ADD subscription fraud detection and monitoring

Task 12: API Integration and Webhooks
MODIFY apps/api/src/services/:
  - ADD Stripe webhook handling for subscription events
  - IMPLEMENT Iraqi payment gateway webhook processing
  - ADD ChartMogul event streaming for analytics
  - HANDLE subscription status synchronization

Task 13: Trial Management System
CREATE apps/web/src/components/subscription/TrialBanner.tsx:
  - IMPLEMENT trial status display and conversion prompts
  - ADD trial extension handling with cultural sensitivity
  - INTEGRATE conversion optimization features
  - HANDLE trial expiration gracefully

Task 14: Subscription State Management
CREATE apps/web/src/hooks/useSubscription.ts:
  - IMPLEMENT React Query integration for subscription data
  - ADD real-time subscription status updates
  - HANDLE subscription change optimistic updates
  - INTEGRATE with feature flag context for UI rendering

Task 15: Integration Testing and Validation
CREATE comprehensive test suite:
  - ADD subscription lifecycle integration tests
  - IMPLEMENT Islamic compliance validation tests
  - TEST Iraqi payment gateway integration
  - VALIDATE analytics accuracy and ChartMogul integration
```

### Integration Points
```yaml
DATABASE:
  - migration: "Create subscription_plans, user_subscriptions, billing_history tables"
  - indexes: "Add performance indexes for subscription queries and analytics"
  
PAYMENT_GATEWAYS:
  - extend: examples/phase4-implementation-foundation/types/src/payments.ts
  - integrate: ZainCash, FastPay, NassWallet recurring payment support
  - validate: Islamic compliance for all billing operations

FEATURE_FLAGS:  
  - service: LaunchDarkly integration with subscription tier context
  - middleware: Subscription-based access control for AI features
  - validation: Feature usage limit enforcement

ANALYTICS:
  - integration: ChartMogul-style MRR and churn tracking
  - webhooks: Real-time subscription event streaming  
  - dashboard: Admin analytics with Iraqi market insights

CULTURAL_COMPLIANCE:
  - agent: iraqi-cultural-validator for all subscription content
  - validation: 95%+ cultural appropriateness requirement
  - islamic: Shariah compliance validation for all billing operations
```

## Validation Loop

### Level 1: Schema and Type Validation
```bash
# Run these FIRST - fix any errors before proceeding
bun run typecheck                           # TypeScript validation
bun run lint                               # ESLint and code style  
python -m pytest tests/test_schemas.py    # Pydantic schema validation

# Expected: No errors. If errors, READ the error message and fix.
```

### Level 2: Islamic Compliance Validation
```bash
# CRITICAL: Use iraqi-cultural-validator agent for all subscription content
bun run test:cultural                      # Cultural appropriateness tests
python -m pytest tests/test_islamic_compliance.py  # Islamic billing validation

# Expected: 95%+ cultural compliance score
# If failing: Use iraqi-cultural-validator agent to identify and fix issues
```

### Level 3: Subscription Service Tests
```python
# CREATE tests/test_subscription_service.py with these critical test cases:
def test_subscription_creation_islamic_compliant():
    """Subscription creation validates Islamic compliance"""
    plan = create_subscription_plan(pricing_model="profit_sharing")
    assert plan.islamic_compliance.is_halal == True
    assert plan.islamic_compliance.riba_free == True

def test_iraqi_payment_gateway_integration():
    """Iraqi payment gateways handle subscription billing correctly"""
    subscription = create_subscription(gateway="ZainCash", amount=50000)  # 50K IQD
    assert subscription.status == "active"
    assert subscription.islamic_compliance_validated == True

def test_feature_flag_tier_access():
    """Feature access is correctly controlled by subscription tier"""  
    user_pro = create_user_with_subscription("pro")
    assert feature_flag_service.can_access_feature(user_pro, "advanced_ai") == True
    
    user_free = create_user_with_subscription("free")
    assert feature_flag_service.can_access_feature(user_free, "advanced_ai") == False

def test_billing_cycle_proration():
    """Subscription upgrades calculate proration correctly"""
    subscription = upgrade_subscription("starter", "pro", days_remaining=15)
    assert subscription.proration_amount > 0
    assert subscription.islamic_compliance_validated == True
```

```bash
# Run and iterate until passing:
python -m pytest tests/test_subscription_service.py -v
bun run test tests/subscription.test.ts
# If failing: Read error, understand root cause, fix code, re-run
```

### Level 4: Iraqi Payment Integration Tests
```bash  
# Test Iraqi payment gateway integration
python -m pytest tests/test_iraqi_payments.py -v

# Test subscription webhook processing
curl -X POST http://localhost:8000/webhooks/zaincash \
  -H "Content-Type: application/json" \
  -d '{"subscription_id": "test", "status": "paid", "amount": 25000}'

# Expected: Subscription status updated correctly, Islamic compliance maintained
```

### Level 5: End-to-End Subscription Flow
```bash
# Start the application
bun run dev

# Test complete subscription flow
curl -X POST http://localhost:8000/api/subscriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -d '{"plan_id": "pro-monthly", "payment_gateway": "ZainCash"}'

# Test subscription upgrade
curl -X PUT http://localhost:8000/api/subscriptions/upgrade \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -d '{"to_plan": "enterprise-annual"}'

# Expected: Subscription created/upgraded, billing calculated, Islamic compliance validated
```

### Level 6: Analytics and Admin Dashboard
```bash
# Test analytics data accuracy
curl -X GET http://localhost:8000/api/admin/analytics/mrr
curl -X GET http://localhost:8000/api/admin/analytics/churn-rate

# Test admin subscription management
curl -X GET http://localhost:8000/api/admin/subscriptions?status=active
curl -X POST http://localhost:8000/api/admin/subscriptions/cancel \
  -d '{"subscription_id": "test-id", "reason": "admin_action"}'

# Expected: Accurate MRR/churn metrics, admin operations successful
```

## Final Validation Checklist
- [ ] All tests pass: `bun test && python -m pytest tests/ -v`
- [ ] No type/lint errors: `bun run typecheck && bun run lint`  
- [ ] Islamic compliance: 95%+ score from iraqi-cultural-validator agent
- [ ] Iraqi payment gateways: All three gateways (ZainCash, FastPay, NassWallet) working
- [ ] Feature flag integration: Tier-based access control functional
- [ ] Subscription lifecycle: Create, upgrade, downgrade, cancel all working
- [ ] Analytics integration: MRR tracking and churn analysis operational  
- [ ] Admin dashboard: Complete subscription management interface
- [ ] Accessibility: WCAG 2.1 AA compliance verified with iraqi-accessibility-specialist
- [ ] Cultural validation: All UI content approved by iraqi-cultural-validator

---

## Anti-Patterns to Avoid
- ❌ Don't implement interest-based billing - use profit-sharing Islamic model
- ❌ Don't skip Islamic compliance validation for any billing operation
- ❌ Don't hardcode payment gateway limits - use configuration from payments.ts
- ❌ Don't ignore ChartMogul MRR movement types - track all 6 categories
- ❌ Don't bypass LaunchDarkly context for feature flags - include subscription tier
- ❌ Don't create new modal patterns - follow existing subscription-management-modal.tsx
- ❌ Don't skip cultural validation - use iraqi-cultural-validator for all content
- ❌ Don't implement without RTL support - Arabic interface support required

---

## Confidence Score: 9/10

**Justification for High Confidence:**
- ✅ **Complete Context**: All necessary documentation URLs, existing patterns, and gotchas included
- ✅ **Existing Patterns**: Direct references to established payment schemas and subscription UI components  
- ✅ **External Integration**: Comprehensive coverage of Stripe 2025, ChartMogul, LaunchDarkly patterns
- ✅ **Cultural Compliance**: Islamic banking requirements and Iraqi cultural validation integrated
- ✅ **Validation Loops**: 6-level validation process ensures comprehensive testing
- ✅ **Implementation Sequence**: 15-task logical progression with clear dependencies
- ✅ **Technical Gotchas**: Critical API versions, payment limits, and compliance requirements documented

**One-Pass Implementation Probability: 95%+**

This PRP provides everything needed for successful implementation without additional research. The AI agent has complete context, established patterns to follow, comprehensive validation loops, and clear success criteria for building a production-ready subscription management system with full Iraqi cultural compliance.