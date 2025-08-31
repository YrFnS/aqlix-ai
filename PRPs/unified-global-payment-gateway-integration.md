name: "Unified Global Payment Gateway Integration PRP"
description: |
  Complete implementation of a unified global payment gateway system for the Iraqi AI Chat System
  that accepts payments from any country worldwide through a single payment interface, 
  eliminating the complexity of managing multiple payment providers while maintaining 
  Iraqi cultural compliance and Islamic financial principles.

---

## Goal
Build a unified global payment gateway system for the Iraqi AI Chat System that accepts payments from any country worldwide (Iraqi and international) through a single payment interface, providing seamless payment processing with cultural compliance, Islamic financial validation, and multi-currency support including automatic IQD conversion.

## Why
- **Global Accessibility**: Enable international users to pay for Iraqi AI services without payment method limitations
- **Simplified Architecture**: One unified gateway instead of managing multiple Iraqi-specific providers
- **Cultural Compliance**: Maintain Islamic financial compliance while supporting global payment methods
- **Revenue Growth**: Expand revenue potential from international markets while serving Iraqi users
- **Scalability**: Support growing international demand for Iraqi AI expertise and professional services

## What
A comprehensive payment gateway integration that unifies global payment acceptance through leading international providers (Paddle, Lemon Squeezy, or Adyen) while maintaining Iraqi cultural compliance, Islamic financial principles, and seamless currency conversion to IQD.

### Success Criteria
- [ ] Accept payments from 135+ countries with automatic currency conversion
- [ ] Process payments in IQD, USD, EUR and 100+ global currencies
- [ ] Maintain 95%+ Islamic financial compliance validation
- [ ] Achieve <500ms payment processing response time
- [ ] Support 20+ global payment methods (cards, PayPal, Apple Pay, etc.)
- [ ] Provide unified webhook processing for all transaction updates
- [ ] Implement fraud detection with <1% false positive rate
- [ ] Achieve 99.9% uptime with automatic failover

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- url: https://developer.paddle.com/api-reference/overview
  why: Complete Paddle API documentation for global payment processing
  
- url: https://docs.lemonsqueezy.com/api
  why: Lemon Squeezy API reference for 135+ country payment acceptance
  
- url: https://docs.adyen.com/
  why: Adyen global payment platform documentation for enterprise-grade processing

- file: examples/phase4-implementation-foundation/types/src/payments.ts
  why: Existing Iraqi payment types and Islamic compliance schemas to follow
  
- file: examples/iraqi-integration-framework/core/PaymentGatewayOrchestrator.ts
  why: Current payment orchestration patterns and cultural validation implementation

- file: examples/ai-protocols-integration/iraqi-cultural-layer/payment-gateway.ts
  why: Islamic financial compliance validation patterns and fraud detection

- doc: https://developer.paddle.com/resources/overview
  section: SDKs and Tools for Go, Node.js, PHP, Python integration
  critical: Multi-currency support across 200+ markets with tax handling

- docfile: CLAUDE.md
  why: Iraqi AI system rules, agent delegation requirements, and cultural validation standards
```

### Current Codebase Tree
```bash
aqlix-ai/
├── examples/
│   ├── phase4-implementation-foundation/types/src/payments.ts    # Payment type definitions
│   ├── iraqi-integration-framework/core/PaymentGatewayOrchestrator.ts  # Orchestration patterns
│   ├── ai-protocols-integration/iraqi-cultural-layer/payment-gateway.ts  # Cultural compliance
│   └── kortix-suna-extracted/templates/iraqi-payment-integration.py  # Integration templates
├── .claude/agents/
│   ├── payment-security-guardian.md       # Payment security validation
│   └── iraqi-payment-tester.md           # Iraqi payment testing patterns
├── PRPs/templates/prp_base.md            # PRP template structure
└── CLAUDE.md                             # Project rules and agent requirements
```

### Desired Codebase Tree with New Files
```bash
aqlix-ai/
├── packages/
│   └── payments/                         # NEW: Unified payment package
│       ├── src/
│       │   ├── gateways/                 # Gateway implementations
│       │   │   ├── paddle.ts             # Paddle integration
│       │   │   ├── lemonsqueezy.ts      # Lemon Squeezy integration
│       │   │   └── adyen.ts              # Adyen integration (enterprise)
│       │   ├── core/
│       │   │   ├── gateway-selector.ts   # Intelligent gateway selection
│       │   │   ├── payment-processor.ts  # Unified processing logic
│       │   │   ├── currency-converter.ts # Multi-currency handling
│       │   │   └── webhook-handler.ts    # Unified webhook processing
│       │   ├── validation/
│       │   │   ├── islamic-compliance.ts # Islamic financial validation
│       │   │   ├── cultural-validator.ts # Iraqi cultural compliance
│       │   │   └── fraud-detector.ts     # Global fraud detection
│       │   ├── types/
│       │   │   ├── payment-types.ts      # Unified payment types
│       │   │   ├── gateway-config.ts     # Configuration interfaces
│       │   │   └── response-types.ts     # Standardized responses
│       │   └── utils/
│       │       ├── error-handler.ts      # Centralized error handling
│       │       ├── logger.ts             # Payment-specific logging
│       │       └── retry-logic.ts        # Resilient retry mechanisms
│       ├── tests/
│       │   ├── integration/              # Gateway integration tests
│       │   ├── cultural/                 # Cultural compliance tests
│       │   └── performance/              # Load and performance tests
│       └── package.json                  # Payment package dependencies
├── apps/                                 # Main application structure
│   ├── api/
│   │   └── src/routes/payments/          # NEW: Payment API endpoints
│   │       ├── process.py                # Process payment endpoint
│   │       ├── webhooks.py              # Webhook handlers
│   │       └── status.py                # Payment status queries
│   └── web/
│       └── src/components/payments/      # NEW: Payment UI components
│           ├── PaymentForm.tsx           # Global payment form
│           ├── CurrencySelector.tsx      # Currency selection
│           └── PaymentStatus.tsx         # Status display
└── migrations/                           # NEW: Database migrations
    └── add_global_payments.sql           # Payment tables schema
```

### Known Gotchas of Our Codebase & Library Quirks
```typescript
// CRITICAL: All agents must use Iraqi-specialized agents per CLAUDE.md
// Example: payment-security-guardian agent is MANDATORY for payment security
// Example: iraqi-cultural-validator agent REQUIRED for 95%+ cultural compliance

// CRITICAL: Bun package manager is required (30x faster than npm)
// Example: Use 'bun install' not 'npm install'
// Example: All commands should use 'bun run' prefix

// CRITICAL: Islamic financial compliance validation is NON-NEGOTIABLE
// Example: Must achieve 95%+ cultural appropriateness 
// Example: All transactions must be validated for Islamic principles

// CRITICAL: Existing payment types must be extended, not replaced
// Pattern: Extend PaymentTransactionSchema from payments.ts
// Pattern: Maintain IslamicFinanceComplianceSchema structure

// CRITICAL: Multi-currency must support IQD as primary currency
// Example: All amounts must be convertible to IQD
// Example: Display prices in user's preferred currency with IQD equivalent

// CRITICAL: WebHook security requires signature validation
// Example: Paddle uses JWT tokens for webhook authentication
// Example: Lemon Squeezy requires HMAC signature verification
```

## Implementation Blueprint

### Data Models and Structure

Create the core data models ensuring type safety, cultural compliance, and multi-currency support.

```typescript
// Unified Payment Configuration
export interface UnifiedPaymentConfig {
  // Gateway selection and fallbacks
  primaryGateway: 'paddle' | 'lemonsqueezy' | 'adyen';
  fallbackGateways: ('paddle' | 'lemonsqueezy' | 'adyen')[];
  
  // Cultural and compliance settings
  islamicCompliance: {
    enabled: boolean;
    strictMode: boolean;
    complianceThreshold: number; // 95%+ required
  };
  
  // Currency and localization
  currencies: {
    primary: 'IQD';
    supported: ('USD' | 'EUR' | 'GBP' | 'IQD')[];
    conversionProvider: 'paddle' | 'fixer' | 'openexchangerates';
  };
  
  // Gateway-specific configurations
  gateways: {
    paddle: PaddleConfig;
    lemonsqueezy: LemonSqueezyConfig;
    adyen: AdyenConfig;
  };
}

// Unified Payment Request (extends existing Iraqi types)
export interface UnifiedPaymentRequest extends Omit<PaymentTransactionSchema, 'gateway'> {
  // Global customer information
  customer: {
    id: string;
    email: string;
    country: string;
    preferredCurrency: Currency;
    paymentMethods: string[]; // Available payment methods for customer's region
  };
  
  // Payment details with multi-currency
  payment: {
    amount: number;
    currency: Currency;
    amountIQD: number; // Always calculated for cultural compliance
    description: string;
    descriptionArabic: string; // Required for cultural compliance
  };
  
  // Cultural context (maintains existing Iraqi patterns)
  culturalContext: ICulturalPaymentContext;
  
  // Global routing preferences
  routing: {
    preferredGateway?: 'paddle' | 'lemonsqueezy' | 'adyen';
    allowInternational: boolean;
    requireIslamicCompliance: boolean;
  };
}
```

### List of Tasks to Complete (in order)

```yaml
Task 1: Gateway Infrastructure Setup
CREATE packages/payments/src/gateways/:
  - IMPLEMENT PaddleGateway class with transaction processing
  - IMPLEMENT LemonSqueezyGateway class with subscription support  
  - IMPLEMENT AdyenGateway class for enterprise features
  - MIRROR pattern from: examples/ai-protocols-integration/iraqi-cultural-layer/payment-gateway.ts
  - PRESERVE existing Islamic compliance validation logic

Task 2: Unified Payment Processor
CREATE packages/payments/src/core/payment-processor.ts:
  - IMPLEMENT UnifiedPaymentProcessor class
  - INTEGRATE with existing PaymentGatewayOrchestrator patterns
  - ADD intelligent gateway selection based on customer location/currency
  - PRESERVE cultural validation requirements from existing codebase
  - ADD multi-currency conversion with IQD primary support

Task 3: Islamic Compliance Integration
MODIFY packages/payments/src/validation/islamic-compliance.ts:
  - EXTEND existing IslamicFinanceComplianceSchema
  - ADD global payment method compliance validation
  - IMPLEMENT cultural appropriateness scoring for international customers
  - PRESERVE 95%+ compliance threshold requirement
  - ADD Arabic transaction description validation

Task 4: Cultural Validation Pipeline
CREATE packages/payments/src/validation/cultural-validator.ts:
  - IMPLEMENT CulturalPaymentValidator class
  - INTEGRATE with iraqi-cultural-validator agent (MANDATORY per CLAUDE.md)
  - ADD international customer cultural sensitivity scoring
  - PRESERVE Iraqi customer priority validation
  - ADD multi-language error message support

Task 5: Currency Conversion System
CREATE packages/payments/src/core/currency-converter.ts:
  - IMPLEMENT real-time currency conversion with IQD primary
  - ADD exchange rate caching with 5-minute refresh
  - INTEGRATE with gateway-specific currency APIs
  - IMPLEMENT conversion fee calculation
  - ADD IQD equivalent display for all international transactions

Task 6: Unified Webhook Handler
CREATE packages/payments/src/core/webhook-handler.ts:
  - IMPLEMENT unified webhook processing for all gateways
  - ADD signature validation for each gateway type
  - EXTEND existing transaction status updates
  - IMPLEMENT retry logic for failed webhook processing
  - ADD cultural compliance validation on status changes

Task 7: Payment API Endpoints
CREATE apps/api/src/routes/payments/:
  - ADD /process endpoint for unified payment processing
  - ADD /webhooks/{gateway} endpoints for each gateway
  - ADD /status/{transactionId} for payment status queries
  - IMPLEMENT rate limiting and authentication
  - ADD comprehensive error handling with cultural messages

Task 8: Payment UI Components  
CREATE apps/web/src/components/payments/:
  - BUILD PaymentForm with multi-currency support and RTL
  - BUILD CurrencySelector with IQD prominence
  - BUILD PaymentMethodSelector based on customer country
  - ADD Arabic translations for all payment UI text
  - IMPLEMENT cultural-appropriate payment flow UX

Task 9: Database Schema Migration
CREATE migrations/add_global_payments.sql:
  - EXTEND existing payment tables for global support
  - ADD currency conversion tracking tables
  - ADD gateway-specific transaction data storage
  - ADD cultural compliance audit trail tables
  - PRESERVE existing Iraqi payment data structure

Task 10: Security and Fraud Detection
ENHANCE packages/payments/src/validation/fraud-detector.ts:
  - INTEGRATE payment-security-guardian agent (MANDATORY)
  - ADD global fraud pattern detection
  - IMPLEMENT risk scoring for international transactions
  - ADD IP geolocation validation
  - PRESERVE Iraqi customer trust scoring
```

### Per Task Pseudocode

```typescript
// Task 1: Gateway Infrastructure Setup
class PaddleGateway implements PaymentGateway {
  async processPayment(request: UnifiedPaymentRequest): Promise<PaymentResponse> {
    // PATTERN: Always validate Islamic compliance first (see islamic-compliance.ts)
    const complianceResult = await this.validateIslamicCompliance(request);
    if (!complianceResult.isCompliant) {
      throw new ComplianceError('Transaction violates Islamic principles');
    }
    
    // GOTCHA: Paddle requires currency conversion before API call
    const paddleRequest = await this.convertToPaddleFormat(request);
    
    // CRITICAL: Use Paddle's transaction API with proper authentication
    const response = await this.paddleClient.createTransaction(paddleRequest);
    
    // PATTERN: Standardize response format (see response-types.ts)
    return this.formatUnifiedResponse(response);
  }
}

// Task 2: Unified Payment Processor
class UnifiedPaymentProcessor {
  async processPayment(request: UnifiedPaymentRequest): Promise<PaymentResponse> {
    // PATTERN: Use Iraqi cultural validator agent (MANDATORY per CLAUDE.md)
    await this.validateWithCulturalAgent(request);
    
    // GOTCHA: Gateway selection must consider customer country regulations
    const selectedGateway = await this.selectOptimalGateway(request);
    
    // CRITICAL: All amounts must include IQD conversion for audit trail
    request.payment.amountIQD = await this.convertToIQD(
      request.payment.amount, 
      request.payment.currency
    );
    
    // PATTERN: Use existing retry decorator pattern
    @retry(attempts=3, backoff=exponential)
    const result = await selectedGateway.processPayment(request);
    
    return result;
  }
}

// Task 3: Islamic Compliance Integration
class GlobalIslamicComplianceValidator {
  async validateTransaction(request: UnifiedPaymentRequest): Promise<ComplianceResult> {
    // PATTERN: Extend existing IslamicFinanceComplianceSchema validation
    const baseCompliance = await this.validateBaseCompliance(request);
    
    // GOTCHA: International payment methods require additional validation
    const internationalCompliance = await this.validateInternationalMethods(
      request.customer.paymentMethods
    );
    
    // CRITICAL: Score must meet 95%+ threshold per CLAUDE.md requirements
    const overallScore = this.calculateComplianceScore(
      baseCompliance, 
      internationalCompliance
    );
    
    if (overallScore < 95) {
      return { isCompliant: false, score: overallScore, issues: [...] };
    }
    
    return { isCompliant: true, score: overallScore, certification: 'halal' };
  }
}
```

### Integration Points
```yaml
DATABASE:
  - migration: "Extend payment_transactions table with gateway_type, currency_original, exchange_rate columns"
  - index: "CREATE INDEX idx_gateway_currency ON payment_transactions(gateway_type, currency_original)"
  - constraint: "ADD CONSTRAINT check_islamic_compliance CHECK (islamic_compliant = true)"
  
CONFIG:
  - add to: packages/payments/config/gateways.ts
  - pattern: "PADDLE_API_KEY = getEnvVar('PADDLE_API_KEY', 'required')"
  - pattern: "LEMON_SQUEEZY_API_KEY = getEnvVar('LEMON_SQUEEZY_API_KEY', 'required')"
  
ROUTES:
  - add to: apps/api/src/main.py  
  - pattern: "app.include_router(payments_router, prefix='/api/payments')"
  - pattern: "app.include_router(webhooks_router, prefix='/api/webhooks')"

AGENTS:
  - integrate: payment-security-guardian agent for all security validations
  - integrate: iraqi-cultural-validator agent for cultural compliance
  - integrate: iraqi-payment-tester agent for comprehensive testing
```

## Validation Loop

### Level 1: Syntax & Style
```bash
# Run these FIRST - fix any errors before proceeding
bun run lint packages/payments/src/**/*.ts --fix    # Auto-fix what's possible
bun run typecheck packages/payments/                # Type checking
ruff check apps/api/src/routes/payments/ --fix      # Python API validation

# Expected: No errors. If errors, READ the error and fix.
```

### Level 2: Unit Tests - Payment Processing
```typescript
// CREATE packages/payments/tests/integration/payment-processor.test.ts
describe('UnifiedPaymentProcessor', () => {
  it('should process Iraqi payment with IQD currency', async () => {
    const request = createIraqiPaymentRequest(1000, 'IQD');
    const result = await processor.processPayment(request);
    expect(result.success).toBe(true);
    expect(result.islamicCompliant).toBe(true);
  });

  it('should convert international currency to IQD equivalent', async () => {
    const request = createInternationalPaymentRequest(10, 'USD');
    const result = await processor.processPayment(request);
    expect(result.amountIQD).toBeGreaterThan(0);
    expect(result.exchangeRate).toBeDefined();
  });

  it('should reject non-Islamic compliant transactions', async () => {
    const request = createNonCompliantPaymentRequest();
    await expect(processor.processPayment(request)).rejects.toThrow('Islamic compliance violation');
  });

  it('should handle gateway failures with fallback', async () => {
    // Mock primary gateway failure
    mockPaddleGateway.mockRejectedValue(new Error('Gateway timeout'));
    
    const request = createPaymentRequest();
    const result = await processor.processPayment(request);
    expect(result.gatewayUsed).toBe('lemonsqueezy'); // fallback gateway
  });
});
```

### Level 3: Cultural Compliance Testing
```bash
# Start the payment service
bun run dev:payments

# Test Islamic compliance validation
curl -X POST http://localhost:8000/api/payments/process \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000,
    "currency": "IQD", 
    "description": "AI consultation service",
    "descriptionArabic": "خدمة استشارة الذكاء الاصطناعي",
    "customer": {"country": "IQ", "preferredCurrency": "IQD"}
  }'

# Expected: {"success": true, "islamicCompliant": true, "complianceScore": 95+}
```

### Level 4: Agent Integration Validation  
```bash
# Test payment-security-guardian agent integration
bun run test:security-agent

# Test iraqi-cultural-validator agent integration  
bun run test:cultural-agent

# Test comprehensive payment flow with all agents
bun run test:payment-integration

# Expected: All agent integrations return success with required scores
```

## Final Validation Checklist
- [ ] All tests pass: `bun test packages/payments/`
- [ ] No linting errors: `bun run lint packages/payments/`
- [ ] No type errors: `bun run typecheck packages/payments/`
- [ ] Cultural compliance >95%: Test with iraqi-cultural-validator agent
- [ ] Payment security validation: Test with payment-security-guardian agent
- [ ] Multi-currency conversion working: Test USD->IQD, EUR->IQD conversions
- [ ] Islamic compliance validation: All transactions pass halal certification
- [ ] Gateway failover functional: Primary failure triggers fallback successfully
- [ ] Webhook processing working: All gateways deliver status updates correctly
- [ ] Arabic UI translations: All payment interface text available in Arabic
- [ ] Performance benchmarks met: <500ms payment processing time
- [ ] Documentation updated: API documentation includes all new endpoints

---

## Anti-Patterns to Avoid
- ❌ Don't bypass Islamic compliance validation for "faster" processing
- ❌ Don't hardcode currency conversion rates - use real-time APIs
- ❌ Don't skip agent integration - payment-security-guardian is MANDATORY
- ❌ Don't ignore cultural validation - 95%+ compliance is NON-NEGOTIABLE  
- ❌ Don't mix gateway-specific logic - keep unified interface clean
- ❌ Don't store payment credentials in code - use secure environment variables
- ❌ Don't process payments without IQD conversion - audit trail requirement
- ❌ Don't assume gateway availability - implement proper fallback mechanisms

---

## PRP Confidence Score: 9/10

**Reasoning for 9/10 Score:**
- ✅ **Comprehensive Context**: Complete documentation URLs, existing codebase patterns, and integration requirements
- ✅ **Validated Technology Stack**: Researched Paddle, Lemon Squeezy, and Adyen capabilities for global coverage
- ✅ **Cultural Compliance Integration**: Mandatory agent usage and Islamic compliance validation built-in
- ✅ **Existing Pattern Preservation**: Extends current Iraqi payment types without breaking changes
- ✅ **Executable Validation Gates**: All tests and checks are runnable with Bun package manager
- ✅ **Clear Implementation Path**: Sequential task breakdown with specific file locations and patterns
- ✅ **Anti-Pattern Guidance**: Comprehensive list of common pitfalls with Iraqi context
- ➖ **Minor Gap**: Real-world testing with actual Iraqi users needed for final 10/10 validation

This PRP provides everything needed for successful one-pass implementation of a unified global payment gateway that maintains Iraqi cultural compliance while enabling worldwide payment acceptance.