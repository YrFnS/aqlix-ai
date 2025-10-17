# PRP: Testing Framework for Iraqi AI Chat System

**Status**: Ready for Implementation
**Priority**: High (Initial #17 - Foundation Layer)
**Complexity**: Intermediate
**Estimated Implementation Time**: 8-12 hours

---

## Goal

Establish a comprehensive, production-ready testing framework foundation for the Iraqi AI Chat System that provides unit testing, integration testing, end-to-end testing, and specialized testing for cultural compliance and Arabic language features, ensuring reliable application quality assurance with 95%+ cultural compliance, 99%+ RTL accuracy, and 85%+ Iraqi dialect recognition.

---

## Why

### Business Value
- **Quality Assurance**: Comprehensive testing prevents regressions and ensures feature reliability
- **Cultural Compliance**: Specialized tests validate Iraqi cultural appropriateness and Islamic compliance
- **Developer Confidence**: Robust test suite enables fearless refactoring and rapid feature development
- **CI/CD Foundation**: Automated testing enables Phase 2 CI/CD implementation (cultural/Arabic validation)

### User Impact
- **Reliability**: Users experience fewer bugs and consistent functionality
- **Cultural Accuracy**: Ensures AI responses respect Iraqi cultural values and Islamic principles
- **Arabic Quality**: Guarantees proper RTL rendering and Iraqi dialect processing
- **Professional Trust**: Iraqi professionals rely on accurate, culturally-appropriate AI assistance

### Integration with Existing Features
- **Completes Initial #17**: Testing framework foundation for all future features
- **Enables Phase 2 CI/CD**: Cultural and Arabic automated testing in `.github/workflows/`
- **Supports PRPs 18-56**: All future features will use this testing infrastructure
- **Foundation Layer**: Critical dependency for Arabic Layer (Initials #11-16)

### Problems This Solves
- **No Test Infrastructure**: Currently no comprehensive testing framework exists
- **Cultural Validation Gap**: No automated cultural appropriateness validation
- **Arabic Testing Gap**: No automated RTL accuracy or dialect recognition testing
- **Manual Testing Burden**: Developers must manually verify all functionality
- **CI/CD Blocker**: Phase 2 CI/CD requires automated cultural/Arabic tests

---

## What

### User-Visible Behavior
- **Developer Experience**: Developers can run `bun test` and receive instant feedback
- **CI/CD Integration**: GitHub Actions automatically runs tests on every push/PR
- **Test Reports**: Comprehensive HTML coverage reports and test result artifacts
- **Cultural Validation**: Automated Islamic compliance and Iraqi appropriateness testing
- **Arabic Validation**: Automated RTL layout and dialect recognition testing

### Technical Requirements

#### 1. Unit Testing Infrastructure
- **Bun Test Runner**: Fast, built-in, Jest-compatible test runner with happy-dom
- **Test Organization**: `*.test.{ts,tsx,py}` pattern across packages and apps
- **Coverage Reporting**: 80% minimum coverage with HTML/XML reports
- **Mock Utilities**: Comprehensive mocking for external dependencies
- **Async Support**: Full async/await testing with proper cleanup

#### 2. Integration Testing Infrastructure
- **API Testing**: FastAPI endpoint testing with TestClient and httpx
- **Database Testing**: Isolated test database with transaction rollback
- **Service Integration**: Testing inter-service communication patterns
- **Iraqi Payment Gateway Mocking**: Mock ZainCash, FastPay, NassWallet APIs
- **External API Mocking**: Anthropic Claude, Supabase, web search APIs

#### 3. E2E Testing Infrastructure
- **Playwright Configuration**: Multi-browser testing (Chromium, Firefox, WebKit, Mobile)
- **Arabic RTL Testing**: Specialized tests for RTL layout rendering
- **User Flow Testing**: Complete Iraqi user journey validation
- **Visual Regression**: Screenshot comparison for UI consistency
- **Accessibility Testing**: WCAG 2.1 AA compliance validation

#### 4. Cultural Testing Infrastructure
- **Islamic Compliance Validator**: Automated Islamic principles validation
- **Cultural Appropriateness Tester**: Iraqi cultural norms verification
- **Professional Domain Tester**: Legal/medical/educational terminology validation
- **Political Neutrality Checker**: Sectarian/political sensitivity detection
- **Cultural Test Fixtures**: Iraqi-specific test data and scenarios

#### 5. Arabic Testing Infrastructure
- **RTL Accuracy Tester**: Layout direction and text alignment validation
- **Iraqi Dialect Recognition**: Baghdad/Basra/Mosul dialect detection
- **Mixed Content Handling**: Arabic-English content segmentation testing
- **Arabic Font Rendering**: Noto Sans Arabic/Amiri font validation
- **Text Processing**: Arabic normalization, shaping, and BiDi testing

---

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Include these in your context window

- url: https://bun.sh/docs/cli/test
  why: Official Bun test runner documentation and API reference
  critical: Modern testing patterns with lifecycle hooks and watch mode

- url: https://playwright.dev/docs/best-practices
  why: Playwright E2E testing best practices and patterns
  critical: RTL testing considerations and Arabic character handling

- url: https://fastapi.tiangolo.com/tutorial/testing/
  why: FastAPI testing patterns with TestClient and dependency_overrides
  critical: Async route testing with httpx.AsyncClient

- url: https://docs.pytest.org/en/stable/best-practices.html
  why: Pytest best practices for Python backend testing
  critical: Test isolation, fixtures, and parametrization patterns

- file: packages/ui/test-setup.ts
  why: Existing happy-dom setup for Bun + React Testing Library
  critical: DOM environment configuration pattern to replicate

- file: apps/web/playwright.config.ts
  why: Current Playwright configuration with RTL-aware settings
  critical: Multi-browser, mobile viewport, and Arabic testing setup

- file: apps/api/pytest.ini
  why: Current pytest configuration with markers and coverage
  critical: Test discovery patterns, markers, and coverage thresholds

- file: examples/testing_examples/test_agent_patterns.py
  why: Comprehensive PydanticAI testing patterns with TestModel
  critical: Agent testing, tool validation, and async testing patterns

- file: examples/feature-engineering-extracted/cultural_testing_framework.py
  why: Advanced cultural testing framework implementation
  critical: Islamic compliance validation and professional domain testing

- file: apps/web/tests/unit/rtl.test.ts
  why: Existing RTL utilities testing patterns
  critical: Arabic text detection, dialect recognition, and direction handling

- file: apps/api/tests/cultural/test_cultural_validation.py
  why: Cultural validation testing patterns
  critical: Islamic compliance, political neutrality, and domain appropriateness

- file: apps/web/tests/e2e/arabic-rtl.spec.ts
  why: E2E Arabic RTL testing patterns
  critical: Browser-based RTL rendering, keyboard navigation, responsive design

- doc: docs/CICD_ROADMAP.md
  section: Phase 2 - Arabic & Cultural Testing
  critical: Required thresholds (95% cultural, 99% RTL, 85% dialect)

- docfile: CLAUDE.md
  why: Project rules, agent workflow, and Iraqi-specific standards
  critical: Mandatory agent delegation, cultural validation requirements
```

### Current Codebase Structure

```bash
# Simplified tree showing testing infrastructure locations

aqlix-ai/
├── apps/
│   ├── web/                          # Next.js frontend
│   │   ├── tests/
│   │   │   ├── unit/                 # Unit tests (*.test.ts)
│   │   │   └── e2e/                  # E2E tests (*.spec.ts)
│   │   ├── playwright.config.ts      # Playwright configuration
│   │   └── bunfig.toml               # Bun test preload config
│   │
│   └── api/                          # FastAPI backend
│       ├── tests/
│       │   ├── cultural/             # Cultural validation tests
│       │   └── arabic/               # Arabic processing tests
│       ├── pytest.ini                # Pytest configuration
│       └── requirements.txt          # Python dependencies (pytest, pytest-cov)
│
├── packages/
│   ├── ui/
│   │   ├── src/__tests__/            # UI component tests
│   │   ├── test-setup.ts             # Happy-dom + globals setup
│   │   └── bunfig.toml               # Bun test preload
│   │
│   ├── arabic-nlp/
│   │   └── src/__tests__/            # Arabic processing tests
│   │
│   └── types/
│       └── src/index.test.ts         # Type validation tests
│
├── test/                             # Workspace-level tests
│   ├── workspace-validation.test.ts  # Build validation
│   └── dev-workflow-validation.test.ts
│
├── examples/
│   ├── testing_examples/             # PydanticAI testing patterns
│   └── feature-engineering-extracted/
│       └── cultural_testing_framework.py  # Cultural validation patterns
│
├── .github/workflows/
│   ├── ci.yml                        # CI pipeline (Phase 1 complete)
│   └── pr.yml                        # PR validation (Phase 1 complete)
│
└── package.json                      # Root testing scripts
    ├── test: "bun test packages/ test/"
    ├── test:unit: Unit tests
    ├── test:integration: Integration tests
    ├── test:e2e: Playwright E2E tests
    ├── test:cultural: Cultural validation
    ├── test:arabic: Arabic processing
    └── test:accessibility: WCAG compliance
```

### Desired Codebase Structure (After Implementation)

```bash
# NEW FILES AND RESPONSIBILITIES

aqlix-ai/
├── packages/
│   ├── testing-utils/                # NEW: Shared testing utilities
│   │   ├── src/
│   │   │   ├── index.ts              # Export all utilities
│   │   │   ├── mocks/                # Shared mock utilities
│   │   │   │   ├── iraqi-agent.mock.ts
│   │   │   │   ├── payment-gateway.mock.ts
│   │   │   │   ├── supabase.mock.ts
│   │   │   │   └── anthropic.mock.ts
│   │   │   ├── fixtures/             # Test data fixtures
│   │   │   │   ├── iraqi-users.fixture.ts
│   │   │   │   ├── arabic-text.fixture.ts
│   │   │   │   ├── cultural-scenarios.fixture.ts
│   │   │   │   └── professional-domains.fixture.ts
│   │   │   ├── matchers/             # Custom test matchers
│   │   │   │   ├── toBeArabicText.ts
│   │   │   │   ├── toBeRTLAligned.ts
│   │   │   │   ├── toBeCulturallyAppropriate.ts
│   │   │   │   └── toBeIslamicallyCompliant.ts
│   │   │   └── helpers/              # Test helper functions
│   │   │       ├── setup-test-db.ts
│   │   │       ├── generate-test-token.ts
│   │   │       ├── wait-for-arabic.ts
│   │   │       └── assert-cultural-compliance.ts
│   │   ├── package.json              # "@iraqi-ai/testing-utils"
│   │   ├── bunfig.toml               # Bun test config
│   │   └── tsconfig.json             # TypeScript config
│   │
│   ├── cultural-validators/          # NEW: Cultural validation utilities
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── islamic-compliance.ts      # Islamic validation
│   │   │   ├── political-neutrality.ts    # Political sensitivity
│   │   │   ├── professional-domains.ts    # Domain-specific validation
│   │   │   └── cultural-appropriateness.ts
│   │   ├── __tests__/                # Validator tests
│   │   │   ├── islamic-compliance.test.ts
│   │   │   ├── political-neutrality.test.ts
│   │   │   └── professional-domains.test.ts
│   │   ├── package.json              # "@iraqi-ai/cultural-validators"
│   │   └── tsconfig.json
│   │
│   └── arabic-test-utils/            # NEW: Arabic testing utilities
│       ├── src/
│       │   ├── index.ts
│       │   ├── rtl-assertions.ts          # RTL layout assertions
│       │   ├── dialect-recognition.ts     # Dialect testing
│       │   ├── text-processing.ts         # Arabic text processing
│       │   └── font-rendering.ts          # Font validation
│       ├── __tests__/                # Arabic utils tests
│       │   ├── rtl-assertions.test.ts
│       │   └── dialect-recognition.test.ts
│       ├── package.json              # "@iraqi-ai/arabic-test-utils"
│       └── tsconfig.json
│
├── apps/
│   ├── web/
│   │   ├── tests/
│   │   │   ├── setup/                # NEW: Test setup files
│   │   │   │   ├── global-setup.ts   # Global Playwright setup
│   │   │   │   ├── test-env.ts       # Test environment config
│   │   │   │   └── custom-matchers.ts
│   │   │   ├── unit/                 # ENHANCED: More unit tests
│   │   │   │   ├── components/       # Component tests
│   │   │   │   ├── hooks/            # Hook tests
│   │   │   │   ├── utils/            # Utility tests
│   │   │   │   └── cultural/         # NEW: Cultural unit tests
│   │   │   ├── integration/          # NEW: Integration tests
│   │   │   │   ├── api-routes.test.ts
│   │   │   │   ├── auth-flow.test.ts
│   │   │   │   └── payment-integration.test.ts
│   │   │   └── e2e/                  # ENHANCED: More E2E tests
│   │   │       ├── user-journeys/    # NEW: Complete user flows
│   │   │       ├── accessibility/    # NEW: A11y tests
│   │   │       └── visual/           # NEW: Visual regression
│   │   └── bunfig.toml               # ENHANCED: Test preload with matchers
│   │
│   └── api/
│       ├── tests/
│       │   ├── conftest.py           # NEW: Pytest fixtures and config
│       │   ├── unit/                 # NEW: Unit tests
│       │   │   ├── test_agents.py
│       │   │   ├── test_services.py
│       │   │   └── test_models.py
│       │   ├── integration/          # NEW: Integration tests
│       │   │   ├── test_api_endpoints.py
│       │   │   ├── test_database.py
│       │   │   └── test_agent_integration.py
│       │   ├── cultural/             # ENHANCED: More cultural tests
│       │   │   ├── test_islamic_compliance.py
│       │   │   ├── test_political_neutrality.py
│       │   │   └── test_professional_domains.py
│       │   └── arabic/               # ENHANCED: More Arabic tests
│       │       ├── test_rtl_processing.py
│       │       ├── test_dialect_recognition.py
│       │       └── test_text_normalization.py
│       └── pytest.ini                # ENHANCED: More markers and plugins
│
├── test/                             # ENHANCED: Root-level integration tests
│   ├── workspace-integration.test.ts # NEW: Cross-workspace integration
│   └── ci-validation.test.ts         # NEW: CI/CD validation tests
│
└── .github/
    └── workflows/
        ├── cultural-tests.yml        # Phase 2: Cultural validation
        └── arabic-tests.yml          # Phase 2: Arabic validation
```

### Known Gotchas & Library Quirks

```typescript
// CRITICAL: Bun test runner specifics

// ❌ WRONG - Don't use jest.mock()
jest.mock('./my-module');

// ✅ CORRECT - Use Bun's native mocking
import { mock } from "bun:test";
const myMock = mock(() => "mocked value");

// ❌ WRONG - Don't use describe.only in CI
describe.only("My tests", () => { /* ... */ });

// ✅ CORRECT - Bun detects GitHub Actions and fails on .only
// Just use describe() normally

// CRITICAL: Happy-dom globals setup
// Must set globals in test-setup.ts for DOM testing
globalThis.window = window as unknown as Window & typeof globalThis;
globalThis.document = document;
// See packages/ui/test-setup.ts for complete pattern

// CRITICAL: Playwright Arabic character handling
// Arabic text rendering broken in Playwright 1.24+
// Use Playwright 1.40+ with proper font configuration
await page.setViewportSize({ width: 1280, height: 720 });
await page.evaluate(() => {
  document.documentElement.lang = "ar";
});

// CRITICAL: RTL testing requires explicit direction
const element = page.locator("[data-testid='arabic-text']");
const direction = await element.evaluate(el =>
  window.getComputedStyle(el).direction
);
expect(direction).toBe("rtl");

// CRITICAL: Pytest async testing with FastAPI
// Must use pytest-asyncio and httpx.AsyncClient
@pytest.mark.asyncio
async def test_async_endpoint(async_client: httpx.AsyncClient):
    response = await async_client.get("/api/v1/chat")
    assert response.status_code == 200

// CRITICAL: FastAPI dependency overrides for testing
app.dependency_overrides[get_current_user] = lambda: test_user
# Remember to clear after tests:
app.dependency_overrides.clear()

// CRITICAL: Bun test coverage requires --coverage flag
// Run: bun test --coverage
// Generates coverage/ directory with HTML reports

// CRITICAL: Cultural validation thresholds (Phase 2)
// - Cultural appropriateness: 95%+ required
// - Islamic compliance: 90%+ required
// - RTL accuracy: 99%+ required
// - Iraqi dialect recognition: 85%+ required
// See docs/CICD_ROADMAP.md for details

// CRITICAL: Test isolation with database
// Use transaction rollback pattern for each test
// See apps/api/tests/conftest.py for fixture pattern

// GOTCHA: Bun test watch mode doesn't support --coverage
// Use separate commands:
// Development: bun test --watch
// CI: bun test --coverage

// GOTCHA: Playwright screenshots on Windows paths
// Use forward slashes in screenshot paths
screenshot: "screenshots/test-name.png" // ✅
screenshot: "screenshots\\test-name.png" // ❌ Windows issues
```

---

## Implementation Blueprint

### Data Models and Structure

```typescript
// packages/testing-utils/src/types.ts
// Core testing types and interfaces

export interface TestFixture<T = any> {
  id: string;
  name: string;
  description: string;
  data: T;
  metadata?: Record<string, any>;
}

export interface CulturalTestCase {
  id: string;
  category: "islamic" | "political" | "professional" | "general";
  content: string;
  expectedCompliance: number; // 0.0 - 1.0
  culturalContext: {
    domain?: "legal" | "medical" | "educational" | "engineering" | "organizational";
    dialect?: "baghdad" | "basra" | "mosul" | "kurdish" | "standard";
    audience?: "professional" | "general" | "educational";
  };
}

export interface ArabicTestCase {
  id: string;
  type: "rtl" | "dialect" | "mixed" | "font";
  content: string;
  expectedDirection: "rtl" | "ltr" | "auto";
  expectedDialect?: "baghdad" | "basra" | "mosul" | "kurdish" | "standard";
  expectedRTLAccuracy: number; // 0.0 - 1.0
}

export interface MockConfig {
  service: "anthropic" | "supabase" | "zaincash" | "fastpay" | "nasswallet";
  responses: Record<string, any>;
  latency?: number; // ms
  failureRate?: number; // 0.0 - 1.0
}

// Custom matcher types
declare module "bun:test" {
  interface Matchers<T> {
    toBeArabicText(): T;
    toBeRTLAligned(): T;
    toBeCulturallyAppropriate(threshold?: number): T;
    toBeIslamicallyCompliant(threshold?: number): T;
    toMatchIraqiDialect(dialect: string): T;
  }
}
```

```python
# apps/api/tests/types.py
# Python testing types

from typing import TypedDict, Literal, Optional
from enum import Enum

class CulturalDomain(str, Enum):
    LEGAL = "legal"
    MEDICAL = "medical"
    EDUCATIONAL = "educational"
    ENGINEERING = "engineering"
    ORGANIZATIONAL = "organizational"

class IraqiDialect(str, Enum):
    BAGHDAD = "baghdad"
    BASRA = "basra"
    MOSUL = "mosul"
    KURDISH = "kurdish"
    STANDARD = "standard"

class CulturalTestCase(TypedDict):
    id: str
    category: Literal["islamic", "political", "professional", "general"]
    content: str
    expected_compliance: float  # 0.0 - 1.0
    domain: Optional[CulturalDomain]
    dialect: Optional[IraqiDialect]

class ValidationResult(TypedDict):
    is_valid: bool
    score: float
    violations: list[str]
    recommendations: list[str]
```

### List of Tasks to Complete (In Order)

```yaml
# PHASE 1: Foundation Setup (2-3 hours)

Task 1: Create @iraqi-ai/testing-utils package
  CREATE packages/testing-utils/
  - Setup package.json with dependencies
  - Create tsconfig.json
  - Create bunfig.toml with test preload
  - Create src/index.ts with exports

Task 2: Implement core mock utilities
  CREATE packages/testing-utils/src/mocks/
  - iraqi-agent.mock.ts: Mock PydanticAI agents
  - payment-gateway.mock.ts: Mock ZainCash/FastPay/NassWallet
  - supabase.mock.ts: Mock Supabase client
  - anthropic.mock.ts: Mock Claude API

Task 3: Create test fixtures
  CREATE packages/testing-utils/src/fixtures/
  - iraqi-users.fixture.ts: Iraqi user profiles
  - arabic-text.fixture.ts: Arabic text samples
  - cultural-scenarios.fixture.ts: Cultural test cases
  - professional-domains.fixture.ts: Domain-specific data

# PHASE 2: Custom Matchers & Helpers (2-3 hours)

Task 4: Implement custom test matchers
  CREATE packages/testing-utils/src/matchers/
  - toBeArabicText.ts: Arabic character validation
  - toBeRTLAligned.ts: RTL layout validation
  - toBeCulturallyAppropriate.ts: Cultural compliance
  - toBeIslamicallyCompliant.ts: Islamic principles

Task 5: Create test helper functions
  CREATE packages/testing-utils/src/helpers/
  - setup-test-db.ts: Database testing utilities
  - generate-test-token.ts: Auth token generation
  - wait-for-arabic.ts: Arabic rendering wait utilities
  - assert-cultural-compliance.ts: Cultural assertions

# PHASE 3: Cultural & Arabic Utilities (2-3 hours)

Task 6: Create @iraqi-ai/cultural-validators package
  CREATE packages/cultural-validators/
  - islamic-compliance.ts: Islamic validation logic
  - political-neutrality.ts: Political sensitivity checker
  - professional-domains.ts: Domain-specific validation
  - cultural-appropriateness.ts: General cultural validation
  - Add comprehensive tests for each validator

Task 7: Create @iraqi-ai/arabic-test-utils package
  CREATE packages/arabic-test-utils/
  - rtl-assertions.ts: RTL layout assertions
  - dialect-recognition.ts: Dialect detection utilities
  - text-processing.ts: Arabic text processing helpers
  - font-rendering.ts: Font validation utilities
  - Add comprehensive tests for each utility

# PHASE 4: Frontend Testing Infrastructure (2 hours)

Task 8: Setup web app test infrastructure
  CREATE apps/web/tests/setup/
  - global-setup.ts: Playwright global setup
  - test-env.ts: Test environment configuration
  - custom-matchers.ts: Import custom matchers

  ENHANCE apps/web/bunfig.toml:
  - Add preload for custom matchers
  - Configure test paths

Task 9: Create web app unit test suites
  CREATE apps/web/tests/unit/
  - components/: Component test examples
  - hooks/: Hook test examples
  - utils/: Utility test examples
  - cultural/: Cultural validation unit tests

Task 10: Create web app integration tests
  CREATE apps/web/tests/integration/
  - api-routes.test.ts: Next.js API route testing
  - auth-flow.test.ts: Authentication flow testing
  - payment-integration.test.ts: Payment gateway integration

Task 11: Enhance E2E test suite
  CREATE apps/web/tests/e2e/
  - user-journeys/: Complete user flow tests
  - accessibility/: WCAG compliance tests
  - visual/: Visual regression tests

# PHASE 5: Backend Testing Infrastructure (1.5-2 hours)

Task 12: Setup FastAPI test infrastructure
  CREATE apps/api/tests/conftest.py:
  - pytest fixtures for database, client, auth
  - Async client fixture with httpx
  - Transaction rollback fixtures
  - Mock service fixtures

Task 13: Create backend unit tests
  CREATE apps/api/tests/unit/
  - test_agents.py: PydanticAI agent testing
  - test_services.py: Service layer testing
  - test_models.py: Pydantic model validation

Task 14: Create backend integration tests
  CREATE apps/api/tests/integration/
  - test_api_endpoints.py: API endpoint testing
  - test_database.py: Database operations
  - test_agent_integration.py: Agent integration

Task 15: Enhance cultural & Arabic tests
  ENHANCE apps/api/tests/cultural/:
  - test_islamic_compliance.py
  - test_political_neutrality.py
  - test_professional_domains.py

  ENHANCE apps/api/tests/arabic/:
  - test_rtl_processing.py
  - test_dialect_recognition.py
  - test_text_normalization.py

# PHASE 6: CI/CD Integration & Documentation (1 hour)

Task 16: Update root package.json scripts
  MODIFY package.json:
  - Enhance test scripts with coverage
  - Add watch mode scripts
  - Add filtered test scripts (unit, integration, e2e)

Task 17: Create Phase 2 CI/CD workflow templates
  CREATE .github/workflows/:
  - cultural-tests.yml: Cultural validation workflow (Phase 2)
  - arabic-tests.yml: Arabic validation workflow (Phase 2)
  - Note: These are templates for Phase 2, not activated yet

Task 18: Update documentation
  UPDATE docs/:
  - Create docs/TESTING_GUIDE.md with comprehensive testing guide
  - Update CICD_ROADMAP.md with testing framework completion
  - Update CLAUDE.md if needed

# PHASE 7: Validation & Testing (1 hour)

Task 19: Run comprehensive test suite
  - Run all unit tests: bun test packages/ test/
  - Run all E2E tests: bun run test:e2e
  - Run cultural tests: bun run test:cultural
  - Run Arabic tests: bun run test:arabic
  - Generate coverage report: bun test --coverage

Task 20: Verify CI/CD integration
  - Commit changes
  - Push to develop branch
  - Verify .github/workflows/ci.yml passes
  - Verify .github/workflows/pr.yml passes
  - Check test artifacts and coverage reports
```

### Per-Task Pseudocode

```typescript
// Task 1: Create @iraqi-ai/testing-utils package
// File: packages/testing-utils/package.json

{
  "name": "@iraqi-ai/testing-utils",
  "version": "1.0.0",
  "type": "module",
  "exports": {
    ".": "./src/index.ts",
    "./mocks": "./src/mocks/index.ts",
    "./fixtures": "./src/fixtures/index.ts",
    "./matchers": "./src/matchers/index.ts",
    "./helpers": "./src/helpers/index.ts"
  },
  "dependencies": {
    "bun": "^1.0.0",
    "@types/bun": "^1.3.0",
    "happy-dom": "^12.0.0"
  },
  "scripts": {
    "test": "bun test",
    "test:watch": "bun test --watch",
    "test:coverage": "bun test --coverage"
  }
}

// File: packages/testing-utils/src/index.ts
export * from "./mocks";
export * from "./fixtures";
export * from "./matchers";
export * from "./helpers";
export * from "./types";

// ============================================

// Task 2: Implement core mock utilities
// File: packages/testing-utils/src/mocks/iraqi-agent.mock.ts

import { mock } from "bun:test";
import type { Agent } from "pydantic_ai";

export interface MockAgentConfig {
  responses?: Record<string, any>;
  tools?: string[];
  culturalCompliance?: number;
}

export function createMockIraqiAgent(config: MockAgentConfig = {}) {
  const { responses = {}, tools = [], culturalCompliance = 0.95 } = config;

  return {
    run: mock(async (prompt: string) => ({
      data: responses[prompt] || "مرحباً، كيف يمكنني مساعدتك؟",
      culturalScore: culturalCompliance,
      islamicCompliance: culturalCompliance >= 0.9,
    })),
    run_sync: mock((prompt: string) => ({
      data: responses[prompt] || "مرحباً، كيف يمكنني مساعدتك؟",
      culturalScore: culturalCompliance,
      islamicCompliance: culturalCompliance >= 0.9,
    })),
    tools: tools,
  };
}

// File: packages/testing-utils/src/mocks/payment-gateway.mock.ts

export interface MockPaymentConfig {
  gateway: "zaincash" | "fastpay" | "nasswallet";
  successRate?: number;
  latency?: number;
}

export function createMockPaymentGateway(config: MockPaymentConfig) {
  const { gateway, successRate = 1.0, latency = 0 } = config;

  return {
    initiate: mock(async (amount: number, currency: string) => {
      await wait(latency);
      if (Math.random() > successRate) {
        throw new Error("Payment gateway error");
      }
      return {
        transactionId: `${gateway}_${Date.now()}`,
        status: "pending",
        amount,
        currency,
      };
    }),
    verify: mock(async (transactionId: string) => {
      await wait(latency);
      return {
        transactionId,
        status: "completed",
        verified: true,
      };
    }),
  };
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================

// Task 3: Create test fixtures
// File: packages/testing-utils/src/fixtures/iraqi-users.fixture.ts

export interface IraqiUserFixture {
  id: string;
  name: string;
  nameArabic: string;
  dialect: "baghdad" | "basra" | "mosul" | "kurdish";
  domain: "legal" | "medical" | "educational" | "engineering" | "organizational";
  preferences: {
    language: "ar-IQ" | "en-US";
    culturalCompliance: "strict" | "standard" | "relaxed";
  };
}

export const iraqiUserFixtures: IraqiUserFixture[] = [
  {
    id: "user_legal_baghdad",
    name: "Ahmed Al-Baghdadi",
    nameArabic: "أحمد البغدادي",
    dialect: "baghdad",
    domain: "legal",
    preferences: {
      language: "ar-IQ",
      culturalCompliance: "strict",
    },
  },
  {
    id: "user_medical_basra",
    name: "Dr. Fatima Al-Basri",
    nameArabic: "د. فاطمة البصري",
    dialect: "basra",
    domain: "medical",
    preferences: {
      language: "ar-IQ",
      culturalCompliance: "standard",
    },
  },
  // Add more fixtures...
];

// File: packages/testing-utils/src/fixtures/arabic-text.fixture.ts

export interface ArabicTextFixture {
  id: string;
  content: string;
  dialect: string;
  type: "formal" | "informal" | "professional" | "casual";
  expectedDirection: "rtl";
  culturallyAppropriate: boolean;
}

export const arabicTextFixtures: ArabicTextFixture[] = [
  {
    id: "greeting_baghdad",
    content: "شلونك اليوم؟ شكو ماكو جديد؟",
    dialect: "baghdad",
    type: "informal",
    expectedDirection: "rtl",
    culturallyAppropriate: true,
  },
  {
    id: "formal_legal",
    content: "وفقاً للقانون العراقي رقم ٢١ لسنة ٢٠٠٨",
    dialect: "standard",
    type: "professional",
    expectedDirection: "rtl",
    culturallyAppropriate: true,
  },
  // Add more fixtures...
];

// File: packages/testing-utils/src/fixtures/cultural-scenarios.fixture.ts

export const culturalScenarios: CulturalTestCase[] = [
  {
    id: "islamic_greeting",
    category: "islamic",
    content: "السلام عليكم ورحمة الله وبركاته",
    expectedCompliance: 1.0,
    culturalContext: {
      audience: "general",
    },
  },
  {
    id: "political_neutral",
    category: "political",
    content: "نحن نخدم جميع العراقيين بغض النظر عن انتمائهم",
    expectedCompliance: 0.95,
    culturalContext: {
      audience: "general",
    },
  },
  {
    id: "legal_professional",
    category: "professional",
    content: "يسعدنا خدمتكم في مجال القانون العراقي",
    expectedCompliance: 0.95,
    culturalContext: {
      domain: "legal",
      audience: "professional",
    },
  },
  // Add more scenarios...
];

// ============================================

// Task 4: Implement custom test matchers
// File: packages/testing-utils/src/matchers/toBeArabicText.ts

import { expect } from "bun:test";

export function toBeArabicText(received: string) {
  // Check for Arabic Unicode range \u0600-\u06ff
  const arabicRegex = /[\u0600-\u06ff]/;
  const hasArabic = arabicRegex.test(received);

  return {
    pass: hasArabic,
    message: () =>
      hasArabic
        ? `Expected "${received}" not to contain Arabic text`
        : `Expected "${received}" to contain Arabic text`,
  };
}

// Register matcher
expect.extend({ toBeArabicText });

// File: packages/testing-utils/src/matchers/toBeRTLAligned.ts

export function toBeRTLAligned(received: HTMLElement | string) {
  // If string, need DOM context
  if (typeof received === "string") {
    return {
      pass: false,
      message: () => "toBeRTLAligned requires an HTMLElement, not a string",
    };
  }

  // Check computed direction
  const direction = window.getComputedStyle(received).direction;
  const textAlign = window.getComputedStyle(received).textAlign;

  const isRTL = direction === "rtl";
  const isRightAligned = textAlign === "right" || textAlign === "start";

  const pass = isRTL && isRightAligned;

  return {
    pass,
    message: () =>
      pass
        ? `Expected element not to be RTL aligned (direction: ${direction}, textAlign: ${textAlign})`
        : `Expected element to be RTL aligned (direction: ${direction}, textAlign: ${textAlign})`,
  };
}

expect.extend({ toBeRTLAligned });

// File: packages/testing-utils/src/matchers/toBeCulturallyAppropriate.ts

import { validateCulturalContent } from "@iraqi-ai/cultural-validators";

export async function toBeCulturallyAppropriate(
  received: string,
  threshold: number = 0.95
) {
  const validation = await validateCulturalContent(received);
  const pass = validation.score >= threshold;

  return {
    pass,
    message: () =>
      pass
        ? `Expected content not to be culturally appropriate (score: ${validation.score})`
        : `Expected content to be culturally appropriate with score >= ${threshold}, but got ${validation.score}. Violations: ${validation.violations.join(", ")}`,
  };
}

expect.extend({ toBeCulturallyAppropriate });

// ============================================

// Task 5: Create test helper functions
// File: packages/testing-utils/src/helpers/setup-test-db.ts

import { createClient } from "@supabase/supabase-js";

export async function setupTestDatabase() {
  // Create isolated test database connection
  const testClient = createClient(
    process.env.SUPABASE_TEST_URL!,
    process.env.SUPABASE_TEST_ANON_KEY!
  );

  // Begin transaction
  const { data, error } = await testClient.rpc("begin_test_transaction");

  if (error) throw error;

  return {
    client: testClient,
    rollback: async () => {
      await testClient.rpc("rollback_test_transaction");
    },
    commit: async () => {
      await testClient.rpc("commit_test_transaction");
    },
  };
}

// File: packages/testing-utils/src/helpers/wait-for-arabic.ts

export async function waitForArabicRendering(
  element: HTMLElement,
  timeout: number = 5000
): Promise<boolean> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const direction = window.getComputedStyle(element).direction;
    const textAlign = window.getComputedStyle(element).textAlign;

    if (direction === "rtl" && (textAlign === "right" || textAlign === "start")) {
      return true;
    }

    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  return false;
}

// File: packages/testing-utils/src/helpers/assert-cultural-compliance.ts

import { validateCulturalContent } from "@iraqi-ai/cultural-validators";

export async function assertCulturalCompliance(
  content: string,
  options: {
    minScore?: number;
    islamicCompliance?: boolean;
    politicalNeutrality?: boolean;
    professionalDomain?: string;
  } = {}
) {
  const {
    minScore = 0.95,
    islamicCompliance = true,
    politicalNeutrality = true,
    professionalDomain,
  } = options;

  const validation = await validateCulturalContent(content, {
    domain: professionalDomain,
  });

  // Check overall score
  if (validation.score < minScore) {
    throw new Error(
      `Cultural compliance score ${validation.score} below threshold ${minScore}. Violations: ${validation.violations.join(", ")}`
    );
  }

  // Check Islamic compliance
  if (islamicCompliance && !validation.islamicCompliant) {
    throw new Error(
      `Content fails Islamic compliance check: ${validation.islamicViolations.join(", ")}`
    );
  }

  // Check political neutrality
  if (politicalNeutrality && !validation.politicallyNeutral) {
    throw new Error(
      `Content fails political neutrality check: ${validation.politicalViolations.join(", ")}`
    );
  }

  return validation;
}

// ============================================

// Task 12: Setup FastAPI test infrastructure
// File: apps/api/tests/conftest.py

import pytest
import asyncio
from httpx import AsyncClient
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from main import app
from database import Base, get_db

# Test database URL
TEST_DATABASE_URL = "sqlite:///./test.db"

# Create test engine
engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database session for each test."""
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def override_get_db(db_session):
    """Override the get_db dependency for testing."""
    def _get_test_db():
        try:
            yield db_session
        finally:
            pass
    app.dependency_overrides[get_db] = _get_test_db
    yield
    app.dependency_overrides.clear()

@pytest.fixture(scope="function")
def client(override_get_db):
    """Create a test client."""
    return TestClient(app)

@pytest.fixture(scope="function")
async def async_client(override_get_db):
    """Create an async test client."""
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

@pytest.fixture(scope="session")
def event_loop():
    """Create an event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture
def mock_iraqi_agent():
    """Mock PydanticAI Iraqi agent."""
    from unittest.mock import Mock, AsyncMock

    agent = Mock()
    agent.run = AsyncMock(return_value={
        "data": "مرحباً، كيف يمكنني مساعدتك؟",
        "cultural_score": 0.95,
        "islamic_compliant": True,
    })
    return agent

@pytest.fixture
def mock_cultural_validator():
    """Mock cultural validation service."""
    from unittest.mock import Mock

    validator = Mock()
    validator.validate = Mock(return_value={
        "score": 0.95,
        "islamic_compliant": True,
        "politically_neutral": True,
        "violations": [],
    })
    return validator
```

---

## Validation Loop

### Level 1: Syntax & Style

```bash
# FRONTEND: Run ESLint and TypeScript checks
cd apps/web
bun run lint       # ESLint validation
bun run typecheck  # TypeScript type checking

# BACKEND: Run Python linters
cd apps/api
ruff check --fix   # Python linting with auto-fix
mypy .             # Type checking

# Expected: No errors. If errors exist, READ the error message carefully and fix.
```

### Level 2: Unit Tests

```bash
# FRONTEND: Run all unit tests
bun test packages/ test/                  # All package and root tests
bun test apps/web/tests/unit/            # Web app unit tests
bun test --coverage                       # With coverage report

# BACKEND: Run all Python unit tests
cd apps/api
pytest tests/unit/ -v                     # Unit tests with verbose output
pytest tests/unit/ --cov=. --cov-report=html  # With coverage

# CULTURAL & ARABIC: Run specialized tests
bun run test:cultural                     # Cultural validation tests
bun run test:arabic                       # Arabic processing tests

# Expected: All tests pass with 80%+ coverage
# If failing: Read test output, understand root cause, fix code, re-run
```

### Level 3: Integration Tests

```bash
# FRONTEND: Run integration tests
bun test apps/web/tests/integration/ -v

# BACKEND: Run API integration tests
cd apps/api
pytest tests/integration/ -v

# Expected: All integration tests pass
# If failing: Check logs, verify dependencies, fix integrations
```

### Level 4: E2E Tests

```bash
# Start development server
bun run dev

# In separate terminal: Run Playwright E2E tests
cd apps/web
bun run test:e2e

# Run specific browser
bun run test:e2e --project=chromium

# Run with UI mode for debugging
bun run test:e2e --ui

# Expected: All E2E tests pass, screenshots/videos captured on failure
# If failing: Check test-results/ and playwright-report/ for details
```

---

## Final Validation Checklist

- [ ] **All unit tests pass**: `bun test packages/ test/ apps/`
- [ ] **All integration tests pass**: `bun test apps/*/tests/integration/`
- [ ] **All E2E tests pass**: `bun run test:e2e`
- [ ] **Cultural tests pass**: `bun run test:cultural` (95%+ compliance)
- [ ] **Arabic tests pass**: `bun run test:arabic` (99%+ RTL accuracy)
- [ ] **No linting errors**: `bun run lint`
- [ ] **No type errors**: `bun run typecheck`
- [ ] **Coverage meets threshold**: 80%+ overall, view `coverage/index.html`
- [ ] **CI passes**: Push to GitHub, verify `.github/workflows/ci.yml` passes
- [ ] **PR validation passes**: Create PR, verify `.github/workflows/pr.yml` passes
- [ ] **Documentation complete**: `docs/TESTING_GUIDE.md` created
- [ ] **Custom matchers work**: Test `expect().toBeArabicText()` etc.
- [ ] **Mock utilities work**: Test payment gateway mocks, agent mocks
- [ ] **Fixtures accessible**: Import and use test fixtures in tests
- [ ] **Phase 2 templates ready**: `.github/workflows/cultural-tests.yml` and `arabic-tests.yml` created (not active)

---

## Anti-Patterns to Avoid

### Testing Anti-Patterns

- ❌ **Don't use `describe.only()` or `test.only()` in committed code** - CI will fail
- ❌ **Don't test implementation details** - Test user-facing behavior
- ❌ **Don't create interdependent tests** - Each test should be fully isolated
- ❌ **Don't hardcode test data** - Use fixtures and factories
- ❌ **Don't skip failing tests** - Fix them or remove them
- ❌ **Don't mock everything** - Balance mocks with integration tests

### Cultural Testing Anti-Patterns

- ❌ **Don't assume cultural compliance** - Always validate with automated tests
- ❌ **Don't use generic Lorem Ipsum** - Use culturally-appropriate Arabic text
- ❌ **Don't ignore political sensitivity** - Test for sectarian/tribal neutrality
- ❌ **Don't bypass Islamic compliance checks** - 90%+ threshold is mandatory

### Arabic Testing Anti-Patterns

- ❌ **Don't assume LTR rendering** - Always test RTL explicitly
- ❌ **Don't ignore mixed content** - Test Arabic-English segmentation
- ❌ **Don't use Google Translate** - Use authentic Iraqi dialect
- ❌ **Don't forget mobile RTL** - Test on mobile viewports

### Mocking Anti-Patterns

- ❌ **Don't use Jest mocks in Bun** - Use `bun:test` mocking API
- ❌ **Don't over-mock integration tests** - Use real services when reasonable
- ❌ **Don't forget to clear dependency overrides** - Clear after each test
- ❌ **Don't mock what you don't own** - Mock external APIs, not internal code

---

## Success Metrics

### Phase 1 Success Criteria (Immediate)

- ✅ **80%+ Test Coverage**: All packages and apps have 80%+ code coverage
- ✅ **All Tests Pass**: 100% pass rate across unit, integration, E2E tests
- ✅ **CI/CD Integration**: Tests run automatically on every push/PR
- ✅ **Developer Experience**: `bun test` completes in < 30 seconds for unit tests
- ✅ **Cultural Infrastructure**: Cultural validation framework in place
- ✅ **Arabic Infrastructure**: Arabic testing utilities available

### Phase 2 Success Criteria (After Initial #16)

- ✅ **Cultural Compliance**: 95%+ automated cultural appropriateness validation
- ✅ **Islamic Compliance**: 90%+ automated Islamic principles validation
- ✅ **RTL Accuracy**: 99%+ RTL layout accuracy in automated tests
- ✅ **Dialect Recognition**: 85%+ Iraqi dialect recognition accuracy
- ✅ **CI/CD Phase 2**: Cultural and Arabic workflows active in GitHub Actions

### Long-Term Success Metrics

- ✅ **Test Velocity**: Developers can write tests faster than code
- ✅ **Regression Prevention**: Zero cultural/Arabic regressions reach production
- ✅ **Confidence**: Developers refactor fearlessly with comprehensive test coverage
- ✅ **Quality**: Production error rate < 1% (monitored via Sentry)

---

## PRP Confidence Score

**Score: 9/10**

### Confidence Rationale

**Strengths (+9 points)**:
- ✅ Comprehensive research with real codebase patterns
- ✅ Clear existing infrastructure (Bun, Playwright, pytest already configured)
- ✅ Well-defined validation loops with executable commands
- ✅ Detailed task breakdown with specific file paths
- ✅ Iraqi-specific requirements clearly documented
- ✅ Phase 2 CI/CD integration path defined
- ✅ Custom matchers and utilities provide developer-friendly API
- ✅ Cultural and Arabic testing infrastructure addresses unique requirements
- ✅ Real examples from codebase provide concrete patterns to follow

**Minor Risks (-1 point)**:
- ⚠️ Cultural validation thresholds (95%, 90%, 99%, 85%) may require iteration
- ⚠️ Playwright Arabic rendering issues in 1.24+ require Playwright 1.40+ (documented)
- ⚠️ Custom matchers require proper TypeScript declaration merging (documented)

**Mitigation**:
- Cultural thresholds can be adjusted iteratively based on real validation results
- Playwright version pinned to 1.40+ in documentation
- Custom matcher declarations provided in implementation blueprint

**Overall Assessment**: This PRP provides comprehensive context for one-pass implementation. The foundation is solid (existing infrastructure), patterns are clear (real codebase examples), and Iraqi-specific requirements are well-documented. The only uncertainty is around exact cultural threshold values, which can be tuned during implementation.

---

## Notes for AI Agent

### Implementation Strategy

1. **Start Simple**: Begin with core utilities and fixtures before custom matchers
2. **Test as You Go**: Write tests for your testing utilities (meta-testing!)
3. **Follow Patterns**: Use existing test files as templates for new tests
4. **Validate Early**: Run tests after each task completion, don't wait until end
5. **Document Thresholds**: If cultural/Arabic thresholds need adjustment, document why

### Iraqi-Specific Considerations

- **Cultural First**: Prioritize cultural validation infrastructure before general testing
- **Dialect Accuracy**: Use authentic Iraqi dialect examples from `apps/web/tests/unit/rtl.test.ts`
- **Islamic Compliance**: Follow patterns from `examples/feature-engineering-extracted/cultural_testing_framework.py`
- **RTL Testing**: Reference Playwright RTL patterns from `apps/web/tests/e2e/arabic-rtl.spec.ts`
- **Professional Domains**: Use terminology from `NAMING_CONVENTIONS.md` for domain-specific tests

### Common Pitfalls

- **Bun vs Jest**: Remember Bun uses `bun:test` not `jest`, mocking API is different
- **Happy-dom Setup**: Must configure globals properly in test-setup.ts
- **Playwright Arabic**: Use Playwright 1.40+ for proper Arabic rendering
- **FastAPI Async**: Use `pytest-asyncio` and `httpx.AsyncClient` for async routes
- **Cultural Thresholds**: Start with documented thresholds, adjust based on results

### Self-Validation Questions

1. Can I run `bun test` and see all tests pass?
2. Does `bun test --coverage` generate a coverage report with 80%+?
3. Can I use `expect().toBeArabicText()` in my tests?
4. Do cultural tests validate Islamic compliance automatically?
5. Do Arabic tests check RTL accuracy and dialect recognition?
6. Does CI pass when I push to GitHub?
7. Are Phase 2 workflow templates ready but not active?

If any answer is "no", revisit the relevant task and fix before proceeding.

---

**END OF PRP**
