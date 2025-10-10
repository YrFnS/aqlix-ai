# CI/CD Roadmap - Iraqi AI Chat System

**Status**: Phase 1 Complete ✅ | Phases 2-4 Planned 📋

This document tracks the 4-phase incremental CI/CD approach that grows with our feature development.

---

## 📊 Phase Overview

| Phase | Trigger | Status | Workflows | Iraqi-Specific |
|-------|---------|--------|-----------|----------------|
| **Phase 1** | NOW (Initial #10 Complete) | ✅ DONE | Basic quality gates | Cultural/Arabic checks |
| **Phase 2** | After Initial #16 (Arabic Layer) | 📋 PLANNED | Arabic/RTL/Cultural tests | Iraqi dialect validation |
| **Phase 3** | After Initial #28 (Integration Layer) | 📋 PLANNED | E2E + Payment + Security | ZainCash/FastPay testing |
| **Phase 4** | Before MVP Launch (Initial #47) | 📋 PLANNED | Staging/Production deploy | Sentry release tracking |

---

## ✅ Phase 1: Basic Quality Gates (COMPLETED)

**Implemented**: 2025-01-10 (After Initial #10 - Error Handling System)

**Trigger**: NOW - MVP Foundation complete (Initials 01-10)

### Workflows Created:

#### 1. **`.github/workflows/ci.yml`** - Main CI Pipeline
**Purpose**: Ensure code quality on every push/PR

**Jobs**:
- ✅ **quality-checks**: ESLint + TypeScript type checking (10min timeout)
- ✅ **build**: Build packages + apps, upload artifacts (15min timeout)
- ✅ **test**: Run unit tests with coverage (15min timeout)
- ✅ **ci-success**: Gate that requires all jobs to pass

**Runs On**: push to `main`/`develop`, all pull requests

**Iraqi-Specific**: None yet (foundation only)

#### 2. **`.github/workflows/pr.yml`** - PR Validation
**Purpose**: Enforce PR standards and catch cultural/Arabic changes

**Jobs**:
- ✅ **pr-title**: Validate semantic PR titles (feat/fix/docs/cultural/arabic)
- ✅ **breaking-changes**: Detect BREAKING CHANGE in commits
- ✅ **cultural-validation**: Check cultural-sensitive file changes
- ✅ **arabic-validation**: Check Arabic/RTL file changes
- ✅ **size-check**: Warn if bundle > 500KB
- ✅ **pr-validation-success**: Gate requiring all validations to pass

**Runs On**: All pull request events

**Iraqi-Specific**:
- 🎯 Cultural compliance markers detection
- 🎯 Arabic/RTL file change detection
- 🎯 Automatic cultural/arabic test execution (when tests available)

### What Phase 1 Prevents:
- ❌ TypeScript errors in production
- ❌ ESLint violations
- ❌ Broken builds
- ❌ Failed unit tests
- ❌ Undetected cultural/Arabic changes

### Limitations:
- ⚠️ Cultural tests run but don't fail CI yet (tests not implemented)
- ⚠️ Arabic tests run but don't fail CI yet (tests not implemented)
- ⚠️ No E2E testing
- ⚠️ No deployment automation

---

## 📋 Phase 2: Arabic & Cultural Testing (PLANNED)

**Trigger**: After Initial #16 - Language Switching System Complete

**Initials Completed**: 11-16 (Arabic Foundation Layer)
- ✅ Initial #11: Arabic Font System
- ✅ Initial #12: RTL Layout Foundation
- ✅ Initial #13: Arabic Text Processing
- ✅ Initial #14: Bidirectional UI Components
- ✅ Initial #15: Arabic Input Handling
- ✅ Initial #16: Language Switching

**Timeline**: ~2 weeks after Phase 1 (estimated)

### New Workflows to Create:

#### 1. **`.github/workflows/cultural-tests.yml`**
```yaml
name: Cultural Compliance Testing

on:
  push:
    branches: [main, develop]
  pull_request:

jobs:
  cultural-compliance:
    name: Cultural & Islamic Compliance
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Bun
      - Install dependencies
      - Run cultural tests (bun run test:cultural)
      - MUST PASS: 95%+ cultural appropriateness
      - MUST PASS: 90%+ Islamic compliance
      - Upload cultural compliance report

  professional-domain-validation:
    name: Iraqi Professional Domain Validation
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Bun
      - Install dependencies
      - Validate legal/medical/educational terminology
      - Check naming conventions (NAMING_CONVENTIONS.md)
      - Upload professional validation report
```

#### 2. **`.github/workflows/arabic-tests.yml`**
```yaml
name: Arabic & RTL Testing

on:
  push:
    branches: [main, develop]
  pull_request:

jobs:
  rtl-layout-tests:
    name: RTL Layout Validation
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Bun + Playwright
      - Install dependencies
      - Run Arabic tests (bun run test:arabic)
      - MUST PASS: 99%+ RTL accuracy
      - MUST PASS: 85%+ Iraqi dialect recognition
      - Take RTL screenshots
      - Upload Arabic test report

  font-rendering-tests:
    name: Arabic Font Rendering
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Bun + Playwright
      - Install dependencies
      - Test Noto Sans Arabic rendering
      - Test Amiri font rendering
      - Test mixed Arabic-English content
      - Validate font-arabic class application
      - Upload font rendering screenshots

  dialect-recognition-tests:
    name: Iraqi Dialect Processing
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Bun
      - Install dependencies
      - Test Iraqi dialect recognition
      - Test Standard Arabic fallback
      - Validate dialect-specific responses
      - Upload dialect test report
```

#### 3. **`.github/workflows/accessibility.yml`**
```yaml
name: Accessibility Testing

on:
  push:
    branches: [main, develop]
  pull_request:

jobs:
  wcag-validation:
    name: WCAG 2.1 AA Compliance
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Bun + Playwright
      - Install dependencies
      - Run accessibility tests (bun run test:accessibility)
      - MUST PASS: WCAG 2.1 AA compliance
      - Test Arabic screen readers
      - Test keyboard navigation (RTL)
      - Upload accessibility report

  touch-target-validation:
    name: Touch Target Validation
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Bun + Playwright
      - Install dependencies
      - Validate 48x48px touch targets
      - Test mobile interactions
      - Upload touch target report
```

### Iraqi-Specific Requirements:
- ✅ Cultural appropriateness: 95%+ threshold
- ✅ Islamic compliance: 90%+ threshold
- ✅ RTL accuracy: 99%+ threshold
- ✅ Iraqi dialect recognition: 85%+ threshold
- ✅ WCAG 2.1 AA compliance: 100% required
- ✅ Arabic screen reader support validated
- ✅ Professional terminology enforcement (NAMING_CONVENTIONS.md)

### What Phase 2 Adds:
- ✅ Automated cultural compliance validation
- ✅ Automated Arabic/RTL accuracy testing
- ✅ Iraqi dialect recognition validation
- ✅ Accessibility compliance (Arabic screen readers)
- ✅ Professional domain terminology enforcement

### Implementation Checklist:
- [ ] Create cultural test suite (test:cultural)
- [ ] Create Arabic test suite (test:arabic)
- [ ] Create accessibility test suite
- [ ] Configure Playwright for visual RTL testing
- [ ] Set up cultural compliance thresholds
- [ ] Create test fixtures for Iraqi dialect
- [ ] Update PR workflow to require Phase 2 tests
- [ ] Document cultural test patterns

---

## 📋 Phase 3: E2E, Payment & Security Testing (PLANNED)

**Trigger**: After Initial #28 - Iraqi Payment Gateway Integration Complete

**Initials Completed**: 17-28 (Cultural Compliance + Integration Layer)
- ✅ Initials #17-22: Cultural Compliance Layer
- ✅ Initials #23-28: Integration Layer (Payments, Images, Voice, Search, Desktop)

**Timeline**: ~4 weeks after Phase 2 (estimated)

### New Workflows to Create:

#### 1. **`.github/workflows/e2e-tests.yml`**
```yaml
name: End-to-End Testing

on:
  push:
    branches: [main, develop]
  pull_request:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM UTC

jobs:
  e2e-chat-flows:
    name: Chat User Flows
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - Checkout code
      - Setup Bun + Playwright
      - Install dependencies
      - Start test server
      - Run E2E tests (bun run test:e2e)
      - Test Arabic chat flows
      - Test English chat flows
      - Test mixed language flows
      - Upload E2E screenshots
      - Upload E2E videos

  e2e-image-flows:
    name: Image Processing Flows
    runs-on: ubuntu-latest
    timeout-minutes: 20
    steps:
      - Checkout code
      - Setup Bun + Playwright
      - Install dependencies
      - Run image E2E tests
      - Test image upload
      - Test Arabic text in images
      - Test cultural appropriateness detection
      - Upload image test results

  e2e-voice-flows:
    name: Voice/Audio Flows
    runs-on: ubuntu-latest
    timeout-minutes: 20
    steps:
      - Checkout code
      - Setup Bun + Playwright
      - Install dependencies
      - Run voice E2E tests
      - Test voice input (Arabic)
      - Test voice output (Arabic TTS)
      - Test audio transcription
      - Upload voice test results
```

#### 2. **`.github/workflows/payment-tests.yml`**
```yaml
name: Payment Integration Testing

on:
  push:
    branches: [main, develop]
  pull_request:

jobs:
  zaincash-integration:
    name: ZainCash Integration Tests
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Bun
      - Install dependencies
      - Run ZainCash tests (mock gateway)
      - Test 1000 IQD minimum
      - Test payment success flow
      - Test payment failure flow
      - Test payment timeout handling
      - Upload payment test report

  fastpay-integration:
    name: FastPay Integration Tests
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Bun
      - Install dependencies
      - Run FastPay tests (mock gateway)
      - Test 500 IQD minimum
      - Test payment success flow
      - Test payment failure flow
      - Test payment timeout handling
      - Upload payment test report

  nasswallet-integration:
    name: NassWallet Integration Tests
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Bun
      - Install dependencies
      - Run NassWallet tests (mock gateway)
      - Test 1000 IQD minimum
      - Test payment success flow
      - Test payment failure flow
      - Test payment timeout handling
      - Upload payment test report

  payment-security:
    name: Payment Security Validation
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Bun
      - Install dependencies
      - Run security tests
      - MUST PASS: 100% security compliance
      - Validate PCI DSS requirements
      - Check for hardcoded credentials
      - Test rate limiting
      - Test fraud detection
      - Upload security report
```

#### 3. **`.github/workflows/security-scan.yml`**
```yaml
name: Security Scanning

on:
  push:
    branches: [main, develop]
  pull_request:
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday

jobs:
  semgrep-scan:
    name: Semgrep Static Analysis
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Run Semgrep scan
      - Check for security vulnerabilities
      - Check for code quality issues
      - Upload Semgrep report

  dependency-audit:
    name: Dependency Security Audit
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Bun
      - Run bun audit
      - Check for known vulnerabilities
      - Generate security report
      - Create issue if critical vulnerabilities found

  secret-scan:
    name: Secret Scanning
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Scan for hardcoded secrets
      - Check .env files excluded from git
      - Validate environment variable usage
      - Upload secret scan report
```

### Iraqi-Specific Requirements:
- ✅ Payment gateway testing: ZainCash, FastPay, NassWallet
- ✅ IQD currency handling validation
- ✅ Payment security: 100% compliance required
- ✅ Cultural image detection in uploads
- ✅ Arabic voice transcription accuracy
- ✅ Iraqi dialect voice recognition

### What Phase 3 Adds:
- ✅ Full E2E user flow testing
- ✅ Payment gateway integration validation
- ✅ Security vulnerability scanning
- ✅ Image processing validation
- ✅ Voice/audio processing validation
- ✅ Multi-modal feature testing

### Implementation Checklist:
- [ ] Create E2E test suite (test:e2e)
- [ ] Set up mock payment gateways for testing
- [ ] Configure Playwright for E2E scenarios
- [ ] Migrate Semgrep MCP (update mcp.json)
- [ ] Create payment security test suite
- [ ] Set up dependency audit automation
- [ ] Create image processing test fixtures
- [ ] Create voice/audio test fixtures
- [ ] Configure Sentry for test environments
- [ ] Document payment testing patterns

---

## 📋 Phase 4: Deployment Automation (PLANNED)

**Trigger**: Before MVP Launch - All 47 MVP Initials Complete

**Initials Completed**: 01-47 (Complete MVP Feature Set)

**Timeline**: ~8 weeks after Phase 3 (estimated)

### New Workflows to Create:

#### 1. **`.github/workflows/deploy-staging.yml`**
```yaml
name: Deploy to Staging

on:
  push:
    branches: [develop]
  workflow_dispatch:

jobs:
  deploy-web-staging:
    name: Deploy Web to Vercel Staging
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - Checkout code
      - Setup Bun
      - Install dependencies
      - Build web application
      - Deploy to Vercel (staging)
      - Create Sentry release
      - Run smoke tests
      - Notify deployment status

  deploy-api-staging:
    name: Deploy API to Staging
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - Checkout code
      - Setup Python
      - Install dependencies
      - Deploy FastAPI to staging
      - Run API health checks
      - Notify deployment status

  activate-supabase-staging:
    name: Activate Supabase Staging
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - Checkout code
      - Restore Supabase project (EU-Central-1)
      - Run pending migrations
      - Validate database schema
      - Run database health checks
```

#### 2. **`.github/workflows/deploy-production.yml`**
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  pre-deployment-checks:
    name: Pre-Deployment Validation
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Verify all tests passed
      - Check Sentry error rate < 1%
      - Verify staging deployment successful
      - Create deployment checklist

  deploy-web-production:
    name: Deploy Web to Vercel Production
    runs-on: ubuntu-latest
    environment: production
    needs: pre-deployment-checks
    steps:
      - Checkout code
      - Setup Bun
      - Install dependencies
      - Build web application (production mode)
      - Deploy to Vercel (production)
      - Create Sentry release with source maps
      - Tag release in GitHub
      - Run smoke tests
      - Notify deployment status

  deploy-api-production:
    name: Deploy API to Production
    runs-on: ubuntu-latest
    environment: production
    needs: pre-deployment-checks
    steps:
      - Checkout code
      - Setup Python
      - Install dependencies
      - Deploy FastAPI to production
      - Run API health checks
      - Monitor error rates
      - Notify deployment status

  post-deployment:
    name: Post-Deployment Tasks
    runs-on: ubuntu-latest
    needs: [deploy-web-production, deploy-api-production]
    steps:
      - Create GitHub release
      - Update CHANGELOG.md
      - Notify team on deployment success
      - Monitor Sentry for 30 minutes
      - Create deployment summary
```

#### 3. **`.github/workflows/rollback.yml`**
```yaml
name: Emergency Rollback

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to rollback'
        required: true
        type: choice
        options:
          - staging
          - production
      version:
        description: 'Version to rollback to'
        required: true

jobs:
  rollback:
    name: Rollback Deployment
    runs-on: ubuntu-latest
    environment: ${{ inputs.environment }}
    steps:
      - Checkout code at version ${{ inputs.version }}
      - Verify version exists
      - Rollback web deployment
      - Rollback API deployment
      - Rollback database migrations (if needed)
      - Notify team of rollback
      - Create incident report
```

#### 4. **`.github/workflows/monitoring.yml`**
```yaml
name: Production Monitoring

on:
  schedule:
    - cron: '*/15 * * * *'  # Every 15 minutes
  workflow_dispatch:

jobs:
  health-checks:
    name: Production Health Checks
    runs-on: ubuntu-latest
    steps:
      - Check web application health
      - Check API health endpoints
      - Check Supabase database connection
      - Check payment gateway availability
      - Monitor Sentry error rate
      - Create alert if thresholds exceeded

  performance-monitoring:
    name: Performance Monitoring
    runs-on: ubuntu-latest
    steps:
      - Check Core Web Vitals
      - Monitor API response times
      - Check Arabic text processing performance
      - Monitor payment processing times
      - Alert if performance degrades
```

### Deployment Environments:

| Environment | Branch | Auto-Deploy | Approval | URL |
|-------------|--------|-------------|----------|-----|
| **Staging** | `develop` | ✅ Yes | ❌ No | staging.iraqi-ai.com |
| **Production** | `main` | ❌ Manual | ✅ Required | iraqi-ai.com |

### Iraqi-Specific Requirements:
- ✅ Supabase EU-Central-1 region (GDPR compliant)
- ✅ Iraqi timezone handling (UTC+3)
- ✅ Payment gateway production credentials (secure vault)
- ✅ Arabic CDN optimization
- ✅ Cultural compliance monitoring
- ✅ Sentry release tracking with Iraqi feature tags

### What Phase 4 Adds:
- ✅ Automatic staging deployments
- ✅ Manual production deployments with approval
- ✅ Sentry release tracking integration
- ✅ Emergency rollback capability
- ✅ Production health monitoring
- ✅ Performance monitoring
- ✅ Deployment notifications

### Implementation Checklist:
- [ ] Set up Vercel project for web app
- [ ] Configure production hosting for FastAPI
- [ ] Activate Supabase production project (EU-Central-1)
- [ ] Set up GitHub Environments (staging, production)
- [ ] Configure deployment secrets (API keys, tokens)
- [ ] Set up Sentry production project
- [ ] Configure production payment gateway credentials
- [ ] Create deployment runbooks
- [ ] Set up monitoring alerts
- [ ] Configure rollback procedures
- [ ] Test staging deployment flow
- [ ] Test production deployment flow
- [ ] Document deployment process

---

## 🎯 CI/CD Metrics & Monitoring

### Phase 1 Metrics (Current):
- ⏱️ **Build Time**: Target < 15 minutes
- ✅ **Test Success Rate**: Track pass/fail ratio
- 📊 **Code Coverage**: Track unit test coverage
- 🔍 **Lint Violations**: Track ESLint issues
- 📦 **Bundle Size**: Monitor client bundle growth

### Phase 2 Metrics (Planned):
- 🎭 **Cultural Compliance**: Track 95%+ threshold
- 🌐 **RTL Accuracy**: Track 99%+ threshold
- 🗣️ **Iraqi Dialect Recognition**: Track 85%+ threshold
- ♿ **Accessibility Score**: Track WCAG 2.1 AA compliance

### Phase 3 Metrics (Planned):
- 🎬 **E2E Test Duration**: Target < 30 minutes
- 💳 **Payment Test Success**: Track gateway reliability
- 🔒 **Security Scan Issues**: Track vulnerabilities
- 🖼️ **Image Processing Time**: Monitor performance
- 🎙️ **Voice Processing Accuracy**: Track transcription quality

### Phase 4 Metrics (Planned):
- 🚀 **Deployment Frequency**: Track releases per week
- ⏱️ **Deployment Duration**: Target < 10 minutes
- 📉 **Mean Time to Recovery (MTTR)**: Track incident response
- 🐛 **Production Error Rate**: Track < 1% target
- ⚡ **Core Web Vitals**: Monitor LCP, FID, CLS

---

## 📚 Related Documentation

- **CLAUDE.md**: Main project rules and agent configuration
- **archon.md**: Task management workflow with Archon MCP
- **NAMING_CONVENTIONS.md**: Professional terminology standards
- **INITIAL_TO_PRP_GUIDE.md**: Initial-to-PRP execution tracking
- **.github/workflows/**: All CI/CD workflow definitions

---

## 🔄 Update Schedule

This roadmap should be updated:
- ✅ After completing each phase
- ✅ When adding new workflows
- ✅ When Iraqi-specific requirements change
- ✅ After major architectural changes
- ✅ Before MVP launch planning

**Last Updated**: 2025-01-10
**Next Review**: After Initial #16 (Arabic Layer Complete)
**Status**: Phase 1 Complete ✅ | Phase 2-4 Planning 📋
