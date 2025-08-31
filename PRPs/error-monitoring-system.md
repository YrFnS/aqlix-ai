name: "Iraqi AI Chat System Error Monitoring - Comprehensive Implementation"
description: |
  Production-ready Sentry error monitoring system with Arabic RTL support, 
  cultural compliance validation, payment gateway error tracking, and 
  Iraqi regulatory compliance for reliable application operations.

## Goal
Implement a comprehensive error monitoring infrastructure using Sentry that provides real-time error tracking, performance monitoring, culturally-appropriate error handling, and specialized monitoring for Iraqi AI Chat System features including Arabic text processing, payment gateway integration, and cultural validation workflows.

## Why
- **Reliability**: Ensure 99.9% uptime for Iraqi professionals relying on AI chat system
- **Cultural Compliance**: Monitor errors in Arabic processing and cultural validation with Islamic principles
- **Security**: Track payment gateway errors (ZainCash/FastPay/NassWallet) with 100% security compliance
- **Professional Context**: Monitor Iraqi legal/medical/educational domain integration errors
- **Performance**: Maintain <200ms cultural validation and <300ms technical analysis response times
- **Regulatory**: Ensure Iraqi data protection and privacy compliance in error collection

## What
A production-grade error monitoring system that captures application errors, performance metrics, and user experience data while respecting Iraqi cultural requirements and Islamic principles for data handling.

### Success Criteria
- [ ] Real-time error capture with cultural context preservation
- [ ] Performance monitoring with Arabic text processing metrics
- [ ] Payment gateway error tracking with 100% security compliance
- [ ] Cultural validation error alerts with 95%+ accuracy
- [ ] Iraqi regulatory compliance in data collection and storage
- [ ] Team-based alert routing with Iraqi timezone support
- [ ] Custom dashboards for Arabic RTL processing and cultural features

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- url: https://docs.sentry.io/platforms/javascript/guides/nextjs/
  why: Next.js 15 integration patterns and React 19 support
  
- url: https://docs.sentry.io/platforms/javascript/guides/node/
  why: FastAPI backend integration with Bun runtime
  
- url: https://docs.sentry.io/product/performance/
  why: Performance monitoring setup for Arabic processing metrics
  
- url: https://docs.sentry.io/product/alerts/best-practices/
  why: Alert configuration without notification overload
  
- url: https://docs.sentry.io/platforms/javascript/enriching-events/context/
  why: Custom context for cultural and Arabic processing data
  
- file: examples/enhanced-browser-use-extracted/setup.py
  why: Existing SENTRY_DSN configuration pattern
  
- file: examples/unified-integration-orchestrator/config.py  
  why: enable_sentry_monitoring flag and Iraqi configuration
  
- file: examples/phase3-reference-implementations/iraqi-deployment/package.json
  why: Winston logging integration and monitoring scripts
  
- docfile: CLAUDE.md
  why: Iraqi cultural requirements, security standards, agent integration rules

```

### Current Codebase Tree
```bash
aqlix-ai/
├── examples/
│   ├── phase3-reference-implementations/
│   │   └── iraqi-deployment/
│   │       ├── package.json (Winston logging)
│   │       └── src/
│   ├── enhanced-browser-use-extracted/
│   │   └── setup.py (SENTRY_DSN config)
│   └── unified-integration-orchestrator/
│       └── config.py (enable_sentry_monitoring)
├── .claude/
│   └── agents/ (21 specialized Iraqi agents)
├── project-context/ (knowledge base)
├── PRPs/
└── CLAUDE.md (Iraqi system requirements)
```

### Desired Codebase Tree with Files to be Added
```bash
apps/
├── web/ (Next.js 15 frontend)
│   ├── src/
│   │   ├── lib/
│   │   │   ├── sentry-client.ts (Browser Sentry setup)
│   │   │   ├── error-context.ts (Cultural context enrichment)
│   │   │   └── performance-monitoring.ts (Arabic RTL metrics)
│   │   └── middleware.ts (Sentry middleware integration)
│   ├── sentry.client.config.ts (Client-side configuration)
│   ├── sentry.server.config.ts (Server-side configuration)
│   └── sentry.edge.config.ts (Edge runtime configuration)
├── api/ (FastAPI backend)
│   ├── src/
│   │   ├── monitoring/
│   │   │   ├── __init__.py
│   │   │   ├── sentry_config.py (FastAPI Sentry setup)
│   │   │   ├── cultural_context.py (Iraqi cultural error context)
│   │   │   ├── payment_monitoring.py (Gateway error tracking)
│   │   │   └── performance_metrics.py (API performance tracking)
│   │   └── main.py (Sentry integration in FastAPI app)
└── packages/
    └── monitoring/
        ├── package.json
        ├── src/
        │   ├── index.ts (Shared monitoring utilities)
        │   ├── types.ts (Error monitoring types)
        │   ├── cultural-validator.ts (Cultural error validation)
        │   └── arabic-processor.ts (RTL processing error tracking)
        └── tests/
```

### Known Gotchas of Our Codebase & Library Quirks
```typescript
// CRITICAL: Iraqi AI system uses Bun runtime, not Node.js
// Sentry must be configured for Bun compatibility

// CRITICAL: Cultural data MUST NOT contain sensitive Islamic content in error reports
// Use beforeSend hook to filter religious and cultural sensitive information

// CRITICAL: Arabic text processing errors need special handling
// RTL text direction issues can break error stack traces display

// CRITICAL: Payment gateway errors (ZainCash/FastPay/NassWallet) contain sensitive data
// Must scrub financial information while preserving error context

// GOTCHA: Next.js 15 with React 19 requires specific Sentry configuration
// Use @sentry/nextjs ^8.0.0+ for compatibility

// GOTCHA: FastAPI + PydanticAI integration needs custom error boundaries
// Async context propagation required for proper error tracking

// GOTCHA: Iraqi timezone (Asia/Baghdad) must be configured for proper alert timing
// Sentry timestamps need UTC+3 conversion for local team notifications
```

## Implementation Blueprint

### Data Models and Structure
```typescript
// Core error monitoring types for Iraqi AI Chat System
interface IraqiErrorContext {
  // Cultural context (filtered for sensitivity)
  culturalValidationScore?: number;
  islaicComplianceLevel?: 'compliant' | 'review_needed' | 'non_compliant';
  arabicProcessingStage?: 'rtl_conversion' | 'dialect_processing' | 'mixed_content';
  
  // Professional domain context
  professionalDomain?: 'legal' | 'medical' | 'educational' | 'organizational';
  
  // Payment context (scrubbed)
  paymentGateway?: 'zaincash' | 'fastpay' | 'nasswallet';
  transactionType?: 'payment' | 'refund' | 'validation';
  
  // Performance context
  responseTimeMs?: number;
  culturalValidationTimeMs?: number;
  arabicProcessingTimeMs?: number;
}

interface IraqiPerformanceMetrics {
  // Arabic processing performance
  rtlRenderingTime: number;
  dialectRecognitionAccuracy: number;
  mixedContentProcessingTime: number;
  
  // Cultural validation performance
  culturalValidationLatency: number;
  islamicComplianceCheckTime: number;
  
  // Payment gateway performance
  paymentGatewayResponseTime: number;
  gatewayFailureRate: number;
}
```

### List of Tasks to be Completed in Order

```yaml
Task 1 - Setup Sentry Infrastructure:
  CREATE packages/monitoring/package.json:
    - ADD Sentry dependencies (@sentry/nextjs, @sentry/node, @sentry/bun)
    - ADD Iraqi timezone and cultural processing dependencies
    - SET Bun scripts for monitoring tests

Task 2 - Backend Sentry Configuration:
  CREATE apps/api/src/monitoring/sentry_config.py:
    - CONFIGURE Sentry for FastAPI + Bun runtime
    - IMPLEMENT beforeSend hook for cultural data filtering
    - ADD custom error boundaries for PydanticAI integration
    
  MODIFY apps/api/src/main.py:
    - INTEGRATE Sentry initialization early in FastAPI startup
    - ADD middleware for request tracing and error capture

Task 3 - Frontend Sentry Configuration:
  CREATE apps/web/sentry.client.config.ts:
    - CONFIGURE browser Sentry for Next.js 15 + React 19
    - ADD Arabic RTL error context enrichment
    - IMPLEMENT cultural validation error tracking
    
  CREATE apps/web/sentry.server.config.ts:
    - CONFIGURE server-side Sentry for SSR errors
    - ADD performance monitoring for Arabic processing
    
  CREATE apps/web/sentry.edge.config.ts:
    - CONFIGURE edge runtime Sentry for middleware

Task 4 - Cultural Context Enhancement:
  CREATE packages/monitoring/src/cultural-validator.ts:
    - IMPLEMENT Islamic content filtering for error reports
    - ADD cultural appropriateness scoring for errors
    - PRESERVE error context while protecting sensitive data
    
  CREATE apps/api/src/monitoring/cultural_context.py:
    - MIRROR cultural validation pattern from cultural-validator.ts
    - ADD Iraqi professional domain error classification

Task 5 - Payment Gateway Monitoring:
  CREATE apps/api/src/monitoring/payment_monitoring.py:
    - IMPLEMENT secure error tracking for ZainCash/FastPay/NassWallet
    - ADD transaction failure categorization
    - SCRUB sensitive financial data while preserving error patterns
    
Task 6 - Performance Monitoring Setup:
  CREATE packages/monitoring/src/arabic-processor.ts:
    - TRACK RTL processing performance metrics
    - MONITOR dialect recognition accuracy
    - MEASURE mixed Arabic-English content processing time
    
  CREATE apps/api/src/monitoring/performance_metrics.py:
    - IMPLEMENT cultural validation performance tracking
    - ADD payment gateway response time monitoring

Task 7 - Alert Configuration:
  CONFIGURE Sentry alerts:
    - SET critical error alerts for cultural validation failures
    - ADD payment gateway failure alerts with security filtering
    - CONFIGURE performance degradation alerts for Arabic processing
    - SETUP team routing for Iraqi timezone (UTC+3)

Task 8 - Dashboard Creation:
  CREATE custom Sentry dashboards:
    - ARABIC Processing Performance Dashboard
    - CULTURAL Compliance Monitoring Dashboard  
    - PAYMENT Gateway Health Dashboard
    - IRAQI Professional Domains Error Tracking
```

### Per Task Pseudocode

```python
# Task 2 - Backend Sentry Configuration
# apps/api/src/monitoring/sentry_config.py

import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.sqlalchemy import SqlAlchemyIntegration

def configure_sentry():
    def before_send(event, hint):
        # CRITICAL: Filter Islamic and cultural sensitive content
        if 'extra' in event and 'cultural_context' in event['extra']:
            # Remove sensitive religious content
            cultural_data = event['extra']['cultural_context']
            if 'islamic_content' in cultural_data:
                del cultural_data['islamic_content']
            
            # Preserve cultural validation scores and compliance levels
            safe_cultural_data = {
                'validation_score': cultural_data.get('validation_score'),
                'compliance_level': cultural_data.get('compliance_level'),
                'processing_stage': cultural_data.get('processing_stage')
            }
            event['extra']['cultural_context'] = safe_cultural_data
        
        # CRITICAL: Scrub payment gateway sensitive data
        if 'extra' in event and 'payment_context' in event['extra']:
            payment_data = event['extra']['payment_context']
            # Keep error patterns, remove sensitive details
            safe_payment_data = {
                'gateway': payment_data.get('gateway'),
                'error_type': payment_data.get('error_type'),
                'status_code': payment_data.get('status_code')
            }
            event['extra']['payment_context'] = safe_payment_data
            
        return event
    
    sentry_sdk.init(
        dsn=os.getenv("SENTRY_DSN"),
        environment=os.getenv("ENVIRONMENT", "production"),
        integrations=[
            FastApiIntegration(auto_enabling_integrations=False),
            SqlAlchemyIntegration(),
        ],
        traces_sample_rate=0.1,  # 10% for performance monitoring
        profiles_sample_rate=0.1,  # 10% for profiling
        before_send=before_send,
        release=os.getenv("RELEASE_VERSION"),
        server_name=f"iraqi-ai-api-{os.getenv('DEPLOYMENT_REGION', 'iraq')}"
    )

# Task 3 - Frontend Sentry Configuration
# apps/web/sentry.client.config.ts

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  environment: process.env.NODE_ENV,
  
  integrations: [
    Sentry.browserTracingIntegration({
      // Track Arabic RTL performance specifically
      beforeStartSpan(context) {
        if (context.name.includes('arabic') || context.name.includes('rtl')) {
          context.attributes = {
            ...context.attributes,
            'arabic.processing': true,
            'rtl.enabled': true
          };
        }
        return context;
      }
    }),
    
    Sentry.replayIntegration({
      // 10% of sessions, 100% of sessions with errors
      maskAllText: false, // Allow Arabic text in replays (after cultural filtering)
      blockAllMedia: true, // Protect user privacy
    }),
    
    Sentry.feedbackIntegration({
      // Arabic RTL support for feedback widget
      colorScheme: "system",
      buttonLabel: "تقرير مشكلة", // Arabic: "Report Issue"
      formTitle: "تقرير خطأ", // Arabic: "Report Error"
    }),
  ],
  
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  beforeSend(event, hint) {
    // PATTERN: Cultural sensitivity filtering for frontend errors
    if (event.extra?.culturalContext) {
      const cultural = event.extra.culturalContext;
      
      // Remove sensitive Islamic content from error reports
      if (cultural.islamicContent) {
        delete cultural.islamicContent;
      }
      
      // Preserve cultural validation metrics
      event.extra.culturalContext = {
        validationScore: cultural.validationScore,
        complianceLevel: cultural.complianceLevel,
        arabicProcessingStage: cultural.arabicProcessingStage
      };
    }
    
    // Add Iraqi timezone context
    event.contexts = {
      ...event.contexts,
      timezone: {
        name: "Asia/Baghdad",
        offset: "+03:00"
      }
    };
    
    return event;
  },
  
  initialScope: {
    tags: {
      component: "iraqi-ai-frontend",
      language: "arabic-english",
      region: "iraq"
    }
  }
});
```

### Integration Points
```yaml
ENVIRONMENT_VARIABLES:
  - add to: .env.local (frontend) and .env (backend)
  - pattern: |
      SENTRY_DSN=https://your-dsn@sentry.io/project-id
      SENTRY_ENVIRONMENT=production
      SENTRY_RELEASE_VERSION=v1.0.0
      IRAQI_TIMEZONE=Asia/Baghdad

MIDDLEWARE:
  - add to: apps/web/src/middleware.ts
  - pattern: "Sentry error boundary for Next.js routing"
  
FASTAPI_INTEGRATION:
  - add to: apps/api/src/main.py
  - pattern: "app.add_middleware(SentryAsgiMiddleware)"

CULTURAL_AGENT_INTEGRATION:
  - trigger: iraqi-security-specialist for security compliance
  - trigger: iraqi-cultural-validator for content filtering
  - trigger: payment-security-guardian for payment error scrubbing
```

## Validation Loop

### Level 1: Syntax & Style
```bash
# Backend validation
cd apps/api
ruff check src/monitoring/ --fix
mypy src/monitoring/

# Frontend validation  
cd apps/web
bun run typecheck
bun run lint

# Package validation
cd packages/monitoring
bun run typecheck
bun run lint

# Expected: No errors. Fix any TypeScript/Python issues before proceeding
```

### Level 2: Unit Tests
```typescript
// packages/monitoring/tests/cultural-validator.test.ts
import { culturalValidator } from '../src/cultural-validator';

describe('Cultural Validation', () => {
  test('filters Islamic sensitive content from errors', () => {
    const errorWithIslamic = {
      message: 'Validation failed',
      extra: {
        culturalContext: {
          islamicContent: 'sensitive religious data',
          validationScore: 95,
          complianceLevel: 'compliant'
        }
      }
    };
    
    const filtered = culturalValidator.filterSensitiveContent(errorWithIslamic);
    expect(filtered.extra.culturalContext.islamicContent).toBeUndefined();
    expect(filtered.extra.culturalContext.validationScore).toBe(95);
  });
  
  test('preserves cultural validation metrics', () => {
    const culturalError = {
      extra: {
        culturalContext: {
          validationScore: 85,
          complianceLevel: 'review_needed',
          arabicProcessingStage: 'rtl_conversion'
        }
      }
    };
    
    const result = culturalValidator.enrichErrorContext(culturalError);
    expect(result.extra.culturalContext.validationScore).toBe(85);
    expect(result.extra.culturalContext.arabicProcessingStage).toBe('rtl_conversion');
  });
});

// apps/api/tests/test_payment_monitoring.py
import pytest
from src.monitoring.payment_monitoring import PaymentMonitor

def test_scrubs_sensitive_payment_data():
    """Payment errors should remove sensitive data but preserve error context"""
    payment_error = {
        'gateway': 'zaincash',
        'transaction_id': 'sensitive-12345',
        'account_number': 'secret-account',
        'error_code': '4001',
        'error_type': 'insufficient_funds'
    }
    
    monitor = PaymentMonitor()
    scrubbed = monitor.scrub_payment_error(payment_error)
    
    assert 'transaction_id' not in scrubbed
    assert 'account_number' not in scrubbed
    assert scrubbed['gateway'] == 'zaincash'
    assert scrubbed['error_code'] == '4001'
    assert scrubbed['error_type'] == 'insufficient_funds'
```

```bash
# Run tests and iterate until passing
cd packages/monitoring
bun test

cd apps/api  
python -m pytest tests/test_payment_monitoring.py -v

cd apps/web
bun test sentry
```

### Level 3: Integration Test
```bash
# Start the backend with Sentry enabled
cd apps/api
SENTRY_DSN=test_dsn python -m uvicorn src.main:app --reload

# Start the frontend with Sentry enabled  
cd apps/web
NEXT_PUBLIC_SENTRY_DSN=test_dsn bun dev

# Test error capture
curl -X POST http://localhost:8000/test-error \
  -H "Content-Type: application/json" \
  -d '{"trigger_cultural_error": true}'

# Test Arabic processing error
curl -X POST http://localhost:3000/api/test-arabic-error \
  -H "Content-Type: application/json" \
  -d '{"arabic_text": "نص عربي للاختبار"}'

# Expected: Errors appear in Sentry dashboard with cultural context filtered
# Check Sentry dashboard for proper error categorization and alert triggering
```

### Level 4: Cultural Compliance Validation
```bash
# Trigger Iraqi cultural validation agent
cd .claude/agents
# Run cultural validation tests for error monitoring
bun run test:cultural

# Trigger security validation for payment monitoring
bun run test:security-payment

# Expected: 95%+ cultural appropriateness, 100% payment security compliance
```

## Final Validation Checklist
- [ ] All tests pass: `bun test` (frontend), `pytest tests/` (backend)
- [ ] No linting errors: `ruff check` (backend), `bun run lint` (frontend)
- [ ] No type errors: `mypy src/` (backend), `bun run typecheck` (frontend)
- [ ] Sentry captures test errors in dashboard
- [ ] Cultural context is properly filtered and enriched
- [ ] Payment errors are scrubbed but contextually useful
- [ ] Arabic RTL performance metrics are collected
- [ ] Alert routing works for Iraqi timezone (UTC+3)
- [ ] Custom dashboards display Iraqi-specific metrics
- [ ] Integration with iraqi-security-specialist agent successful
- [ ] Cultural validation agent integration successful
- [ ] Payment security validation passes 100% compliance

---

## Anti-Patterns to Avoid
- ❌ Don't log sensitive Islamic or cultural content in error reports
- ❌ Don't expose payment gateway credentials or transaction details
- ❌ Don't ignore Arabic RTL text processing performance degradation
- ❌ Don't create alerts that trigger outside Iraqi business hours without escalation
- ❌ Don't bypass cultural validation for "performance reasons"
- ❌ Don't use synchronous error reporting in async FastAPI endpoints
- ❌ Don't hardcode Sentry DSN - always use environment variables
- ❌ Don't skip beforeSend hooks - they're critical for data protection

## Iraqi-Specific Monitoring Focus Areas
- **Cultural Compliance**: Monitor 95%+ cultural appropriateness and 90%+ Islamic compliance
- **Arabic Processing**: Track 99%+ RTL accuracy and 85%+ dialect recognition
- **Payment Security**: Ensure 100% security compliance across ZainCash/FastPay/NassWallet
- **Professional Domains**: Monitor Iraqi legal/medical/educational integration errors
- **Performance Standards**: <200ms cultural validation, <300ms technical analysis
- **Privacy Protection**: Auto-expire sensitive data within 1 hour, never log API keys or personal information