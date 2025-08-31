name: "Iraqi AI Chat System - Comprehensive Testing Framework"
description: |

## Purpose
Establish a comprehensive testing infrastructure for the Iraqi AI Chat System that provides unit testing, integration testing, end-to-end testing, and specialized testing for cultural and Arabic features with production-ready quality assurance.

## Core Principles
1. **Cultural Compliance First**: 95%+ cultural appropriateness, 90%+ Islamic compliance required
2. **Arabic Excellence**: 99%+ RTL accuracy, 85%+ Iraqi dialect recognition required
3. **User-Centric Testing**: Focus on user behavior, not implementation details
4. **Performance Standards**: <200ms cultural validation, <100ms Arabic processing
5. **Iraqi Workflow Integration**: Prayer time awareness, ministry protocols, security compliance

---

## Goal
Build a comprehensive testing framework that ensures reliability, cultural compliance, and performance standards for the Iraqi AI Chat System while supporting rapid development cycles and maintaining quality gates for production deployments.

## Why
- **Quality Assurance**: Comprehensive testing coverage prevents bugs and ensures system reliability for government use
- **Cultural Integrity**: Specialized testing ensures 95%+ cultural appropriateness and Islamic compliance for Iraqi users
- **Performance Confidence**: Performance testing validates <200ms cultural validation and <100ms Arabic processing targets
- **Development Velocity**: Automated testing enables rapid iteration while maintaining quality standards
- **Compliance Assurance**: Testing framework validates Iraqi regulatory compliance and security requirements

## What
A multi-layer testing infrastructure supporting unit tests, integration tests, E2E tests, cultural validation tests, Arabic RTL tests, performance tests, and security compliance tests with automated CI/CD integration.

### Success Criteria
- [ ] Unit testing framework configured with Vitest and Bun integration
- [ ] React Testing Library setup for accessible component testing
- [ ] Playwright E2E testing configured for cross-browser validation
- [ ] Cultural validation testing achieving 95%+ appropriateness scores
- [ ] Arabic RTL testing achieving 99%+ accuracy rates
- [ ] Performance testing validating <200ms cultural, <100ms Arabic targets
- [ ] Security testing for Iraqi regulatory compliance
- [ ] CI/CD integration with automated quality gates
- [ ] Test utilities for prayer time and ministry workflow scenarios
- [ ] Comprehensive documentation and examples

## All Needed Context

### Documentation & References (MUST READ - Include in context window)
```yaml
# Modern Testing Frameworks
- url: https://vitest.dev/
  why: Next-generation testing framework, 2-5x faster than Jest, zero config with Bun
  critical: Vite-native testing with ES modules support
  
- url: https://vitest.dev/config/
  why: Vitest configuration patterns and setup options
  critical: TypeScript integration and test environment setup

# React Component Testing
- url: https://testing-library.com/docs/react-testing-library/intro/
  why: User-behavior focused testing, accessibility-first approach
  critical: Query patterns that encourage accessible testing practices
  
- url: https://testing-library.com/docs/queries/about/
  why: Query methods that simulate real user interactions
  critical: Avoid testing implementation details

# End-to-End Testing
- url: https://playwright.dev/
  why: Cross-browser E2E testing with auto-waiting and visual testing
  critical: Arabic RTL layout testing and cultural workflow validation
  
- url: https://playwright.dev/docs/test-configuration
  why: Playwright configuration for multi-browser testing
  critical: Parallel testing and retry strategies

# Existing Patterns in Codebase
- file: examples/onlook-extracted/collaboration-engine/tests/collaboration-engine.test.ts
  why: Comprehensive Iraqi cultural testing patterns, Arabic text validation, prayer time testing
  critical: Cultural compliance scoring (95%+), Islamic workflow testing, ministry integration patterns
  
- file: examples/iraqi-enterprise-auth/tests/AuthenticationTests.ts
  why: Security testing patterns, biometric testing, ministry SSO integration
  critical: Government-grade security testing, cultural profile testing

- file: examples/testing_examples/test_agent_patterns.py
  why: PydanticAI testing patterns with TestModel and FunctionModel
  critical: Agent testing with dependency injection and tool validation

- file: examples/testing_examples/pytest.ini
  why: Python testing configuration patterns
  critical: Async test configuration and marker setup

# Iraqi-Specific Testing Requirements
- docfile: CLAUDE.md
  why: Cultural compliance requirements, Arabic processing standards, performance targets
  critical: 95%+ cultural compliance, 99%+ RTL accuracy, prayer time awareness testing
```

### Current Codebase Tree (Key Testing-Related Structure)
```bash
aqlix-ai/
├── examples/
│   ├── onlook-extracted/collaboration-engine/tests/        # Cultural testing patterns
│   ├── iraqi-enterprise-auth/tests/                       # Security testing patterns  
│   ├── testing_examples/                                  # Python agent testing
│   └── phase3-reference-implementations/                  # Bun testing patterns
├── CLAUDE.md                                             # Testing requirements
└── PRPs/templates/prp_base.md                           # PRP template structure
```

### Desired Codebase Tree with Testing Framework
```bash
aqlix-ai/
├── testing/
│   ├── config/
│   │   ├── vitest.config.ts              # Primary test configuration
│   │   ├── playwright.config.ts          # E2E test configuration
│   │   └── test-setup.ts                 # Global test setup and matchers
│   ├── utils/
│   │   ├── cultural-test-utils.ts        # Cultural validation helpers
│   │   ├── arabic-test-utils.ts          # RTL and dialect testing utilities
│   │   ├── mock-factories.ts             # Iraqi-specific test data
│   │   ├── performance-helpers.ts        # Performance testing utilities
│   │   └── security-test-utils.ts        # Security testing helpers
│   ├── fixtures/
│   │   ├── arabic-samples.ts             # Arabic text samples (Iraqi dialect)
│   │   ├── cultural-scenarios.ts         # Cultural test scenarios
│   │   ├── ministry-workflows.ts         # Ministry workflow test data
│   │   └── prayer-time-data.ts           # Prayer time test scenarios
│   └── examples/
│       ├── unit/                         # Unit test examples
│       ├── integration/                  # Integration test examples
│       └── e2e/                         # E2E test examples
├── apps/
│   ├── web/
│   │   ├── __tests__/                    # React component tests
│   │   ├── e2e/                         # Playwright E2E tests
│   │   └── vitest.config.ts             # Web-specific config
│   └── api/
│       ├── tests/                       # API integration tests
│       └── vitest.config.ts             # API-specific config
└── package.json                        # Updated with testing scripts
```

### Known Gotchas & Library Quirks
```typescript
// CRITICAL: Bun is the primary runtime (30x faster than npm)
// All commands MUST use bun instead of npm/yarn
"scripts": {
  "test": "bun test",                    // Uses Bun's native test runner
  "test:vitest": "vitest",              // Vitest for advanced features  
  "test:cultural": "bun test --grep Cultural",
  "test:arabic": "bun test --grep Arabic"
}

// CRITICAL: Cultural compliance requirements
// All cultural tests MUST achieve 95%+ appropriateness score
expect(culturalValidation.score).toBeGreaterThanOrEqual(0.95);

// CRITICAL: Arabic RTL testing requirements  
// RTL accuracy MUST be 99%+ for layout validation
expect(rtlAccuracy.percentage).toBeGreaterThanOrEqual(0.99);

// CRITICAL: Performance targets are mandatory
// Cultural validation: <200ms, Arabic processing: <100ms
expect(culturalValidationTime).toBeLessThan(200);
expect(arabicProcessingTime).toBeLessThan(100);

// GOTCHA: Prayer time testing requires real-time awareness
// Tests must account for Islamic prayer schedules
const prayerTimes = await getPrayerTimes('Baghdad', new Date());
expect(systemBehavior.respectsPrayerTime).toBe(true);

// GOTCHA: Ministry workflow testing requires hierarchical validation
// Authority levels and approval chains must be tested
expect(workflowValidation.authorityChainValid).toBe(true);
```

## Implementation Blueprint

### Data Models and Structure

Create testing infrastructure with type-safe utilities and cultural validation:
```typescript
// Core testing types for Iraqi context
interface CulturalTestResult {
  score: number;                    // Must be >= 0.95
  islamicCompliance: number;        // Must be >= 0.90
  flaggedTerms: string[];
  recommendations: string[];
  prayerTimeRespect: boolean;
}

interface ArabicTestResult {
  rtlAccuracy: number;              // Must be >= 0.99
  dialectRecognition: number;       // Target >= 0.85
  mixedContentHandling: boolean;
  bidiProcessingCorrect: boolean;
}

interface PerformanceTestResult {
  culturalValidationMs: number;     // Must be < 200ms
  arabicProcessingMs: number;       // Must be < 100ms
  testExecutionMs: number;
}
```

### List of Tasks to Complete PRP Implementation (In Order)

```yaml
Task 1 - Core Testing Infrastructure Setup:
CREATE testing/config/vitest.config.ts:
  - CONFIGURE Vitest with TypeScript and JSX support
  - SETUP test environment with jsdom for React components
  - ENABLE global test APIs (describe, it, expect)
  - CONFIGURE coverage reporting with v8 provider
  - SET timeout and retry configurations

CREATE testing/config/test-setup.ts:
  - IMPORT React Testing Library custom matchers
  - CONFIGURE global test utilities
  - SETUP mock implementations for external services
  - INITIALIZE cultural validation test environment

Task 2 - React Component Testing Setup:
CREATE testing/config/rtl-setup.ts:
  - CONFIGURE React Testing Library with custom render
  - SETUP Arabic RTL testing environment
  - CREATE wrapper components for cultural context
  - CONFIGURE accessibility testing with jest-axe

MODIFY package.json:
  - ADD vitest and React Testing Library dependencies
  - UPDATE test scripts with Bun integration
  - ADD cultural and Arabic specific test commands
  - CONFIGURE coverage thresholds (80% minimum)

Task 3 - Playwright E2E Testing Setup:
CREATE testing/config/playwright.config.ts:
  - CONFIGURE multi-browser testing (Chrome, Firefox, Safari)
  - SETUP Arabic RTL viewport configurations
  - ENABLE visual regression testing
  - CONFIGURE performance testing thresholds

CREATE testing/fixtures/e2e-test-data.ts:
  - DEFINE Arabic text samples for UI testing
  - CREATE ministry workflow test scenarios
  - SETUP prayer time test data
  - PREPARE cultural validation test cases

Task 4 - Iraqi-Specific Testing Utilities:
CREATE testing/utils/cultural-test-utils.ts:
  - IMPLEMENT cultural appropriateness validation
  - CREATE Islamic compliance scoring utilities
  - BUILD prayer time testing helpers
  - DEVELOP ministry workflow validators

CREATE testing/utils/arabic-test-utils.ts:
  - IMPLEMENT RTL layout validation utilities
  - CREATE dialect recognition testing helpers
  - BUILD mixed content testing utilities
  - DEVELOP bidirectional text validators

Task 5 - Performance Testing Framework:
CREATE testing/utils/performance-helpers.ts:
  - IMPLEMENT latency measurement utilities
  - CREATE cultural validation timing tests
  - BUILD Arabic processing benchmarks
  - SETUP performance regression detection

MODIFY testing/config/vitest.config.ts:
  - ADD performance testing environment
  - CONFIGURE benchmark testing support
  - SETUP performance reporters
  - ENABLE memory usage tracking

Task 6 - Security Testing Integration:
CREATE testing/utils/security-test-utils.ts:
  - IMPLEMENT Iraqi regulatory compliance checks
  - CREATE data privacy validation utilities
  - BUILD access control testing helpers
  - DEVELOP audit trail validators

CREATE testing/fixtures/security-scenarios.ts:
  - DEFINE security test scenarios
  - CREATE threat simulation data
  - SETUP compliance validation tests
  - PREPARE penetration testing patterns

Task 7 - CI/CD Integration:
CREATE .github/workflows/testing.yml:
  - CONFIGURE automated test execution
  - SETUP multi-environment testing
  - ENABLE performance regression detection
  - CONFIGURE quality gate enforcement

CREATE testing/scripts/quality-gates.ts:
  - IMPLEMENT coverage threshold validation
  - CREATE cultural compliance gate checking
  - BUILD performance benchmark validation
  - SETUP automated reporting

Task 8 - Documentation and Examples:
CREATE testing/README.md:
  - DOCUMENT testing framework architecture
  - PROVIDE cultural testing guidelines
  - EXPLAIN Arabic testing requirements
  - INCLUDE performance testing guidance

CREATE testing/examples/:
  - BUILD unit test examples for each pattern
  - CREATE integration test templates
  - DEVELOP E2E test scenarios
  - PROVIDE cultural testing examples
```

### Per Task Pseudocode

```typescript
// Task 1 - Vitest Configuration
// vitest.config.ts setup pattern
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,              // Enable global test APIs
    environment: 'jsdom',       // React component testing
    setupFiles: ['./test-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80
      }
    },
    // CRITICAL: Iraqi-specific test filtering
    testNamePattern: {
      cultural: /Cultural/,
      arabic: /Arabic|RTL/,
      performance: /Performance|Latency/
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '../src'),
      '@testing': resolve(__dirname, './utils')
    }
  }
});

// Task 4 - Cultural Testing Utilities Pattern
async function validateCulturalContent(
  content: string,
  context: CulturalContext
): Promise<CulturalTestResult> {
  // PATTERN: Always validate Islamic compliance first
  const islamicCheck = await validateIslamicCompliance(content);
  
  // CRITICAL: Use existing cultural validation patterns
  const culturalScore = await calculateCulturalScore(content, context);
  
  // GOTCHA: Prayer time awareness must be checked
  const prayerTimeRespect = checkPrayerTimeRespect(context.timestamp);
  
  return {
    score: culturalScore,
    islamicCompliance: islamicCheck.score,
    prayerTimeRespect,
    flaggedTerms: islamicCheck.flaggedTerms,
    recommendations: generateImprovements(culturalScore)
  };
}
```

### Integration Points
```yaml
PACKAGE.JSON:
  - scripts: Add comprehensive test commands
  - dependencies: Add Vitest, RTL, Playwright, cultural testing utilities
  - devDependencies: Add test-specific tooling
  
CI/CD PIPELINE:
  - github-actions: Add automated testing workflow
  - quality-gates: Enforce 95% cultural compliance, 99% RTL accuracy
  - performance: Validate <200ms cultural, <100ms Arabic processing
  
CONFIG FILES:
  - tsconfig: Update to include testing directories
  - eslint: Add testing-specific rules
  - prettier: Configure test file formatting
  
DOCUMENTATION:
  - README: Update with testing guidelines
  - CONTRIBUTING: Add testing requirements for PRs
  - API-DOCS: Include test examples for each feature
```

## Validation Loop

### Level 1: Syntax & Style
```bash
# Run these FIRST - fix any errors before proceeding
bun run lint                    # ESLint validation with cultural rules
bun run typecheck              # TypeScript type checking
bun run format                 # Prettier code formatting

# Expected: No errors. If errors, READ the error and fix.
```

### Level 2: Unit Tests (Iraqi-Enhanced Patterns)
```typescript
// CREATE comprehensive unit tests following existing patterns
describe('Cultural Validation Component', () => {
  it('should achieve 95%+ cultural appropriateness', async () => {
    const result = await validateCulturalContent(arabicText);
    expect(result.score).toBeGreaterThanOrEqual(0.95);
    expect(result.islamicCompliance).toBeGreaterThanOrEqual(0.90);
  });

  it('should handle Arabic RTL with 99%+ accuracy', async () => {
    const rtlResult = await processArabicLayout(arabicContent);
    expect(rtlResult.accuracy).toBeGreaterThanOrEqual(0.99);
    expect(rtlResult.direction).toBe('rtl');
  });

  it('should respect prayer time protocols', async () => {
    const prayerTime = await getCurrentPrayerTime('Baghdad');
    const systemResponse = await processUserRequest(duringPrayer);
    expect(systemResponse.respectsPrayerTime).toBe(true);
  });
});
```

```bash
# Run and iterate until passing:
bun test                       # Run all unit tests
bun run test:cultural         # Cultural compliance tests (95%+ required)  
bun run test:arabic           # Arabic RTL tests (99%+ accuracy required)
bun run test:coverage         # Coverage report (80% minimum)

# If failing: Read error, understand root cause, fix code, re-run
```

### Level 3: Integration Tests
```bash
# Test API integration and service communication
bun run test:integration      # Service integration tests
bun run test:security         # Security compliance validation
bun run test:performance      # Performance benchmark validation

# Expected: All services integrate correctly with cultural compliance
```

### Level 4: E2E Tests  
```bash
# Start the full application stack
bun run dev                   # Development server

# Run Playwright E2E tests
bun run test:e2e             # Cross-browser E2E testing
bun run test:accessibility   # WCAG compliance validation
bun run test:visual          # Visual regression testing

# Expected: All user workflows work correctly in Arabic RTL layout
```

## Final Validation Checklist
- [ ] All tests pass: `bun test` and `bun run test:vitest`
- [ ] Cultural compliance: `bun run test:cultural` (95%+ scores)
- [ ] Arabic accuracy: `bun run test:arabic` (99%+ RTL accuracy)  
- [ ] Performance targets: Cultural <200ms, Arabic <100ms
- [ ] Security compliance: Iraqi regulatory requirements met
- [ ] E2E tests pass: All user workflows functional
- [ ] Coverage thresholds: 80%+ code coverage achieved
- [ ] Accessibility: WCAG 2.1 AA compliance validated
- [ ] Documentation: Testing guides and examples complete
- [ ] CI/CD integration: Quality gates enforced automatically

---

## Anti-Patterns to Avoid
- ❌ Don't ignore cultural validation scores - 95%+ is mandatory
- ❌ Don't skip Arabic RTL testing - 99%+ accuracy required
- ❌ Don't mock cultural validation to make tests pass
- ❌ Don't test implementation details instead of user behavior  
- ❌ Don't hardcode Arabic text - use fixture files
- ❌ Don't skip prayer time awareness in workflow tests
- ❌ Don't ignore performance targets - they're quality requirements
- ❌ Don't create tests without accessibility considerations
- ❌ Don't bypass security testing for Iraqi regulatory compliance

---

**PRP Confidence Score: 9/10**

This PRP provides comprehensive context with existing codebase patterns, modern testing framework integration, Iraqi-specific requirements, executable validation loops, and clear implementation guidance. The high confidence score reflects thorough research, detailed implementation blueprint, and alignment with existing project standards while introducing necessary testing infrastructure improvements.