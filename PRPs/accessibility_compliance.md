name: "Accessibility Compliance System - WCAG 2.1 AA with Arabic RTL Support"
description: |
  Comprehensive accessibility compliance foundation for Iraqi AI Chat System ensuring WCAG 2.1 AA compliance, Arabic screen reader compatibility, and inclusive access for Iraqi users with disabilities.

## Goal
Build a comprehensive accessibility compliance system that ensures WCAG 2.1 AA compliance across the Iraqi AI Chat System with specialized support for Arabic screen readers, RTL keyboard navigation, and Iraqi cultural accessibility patterns. The system must provide automated testing, validation utilities, and accessibility monitoring that integrates with the existing Iraqi accessibility specialist agent and 44 UI components from dyad-extracted.

## Why
- **Legal Compliance**: European Accessibility Act (EAA) requires WCAG 2.1 AA compliance by June 28, 2025
- **Iraqi User Inclusion**: Enable full digital access for Iraqi users with disabilities using Arabic screen readers
- **Cultural Responsibility**: Align with Islamic values of community support and inclusive technology
- **Quality Foundation**: Establish systematic accessibility validation for all current and future components
- **Agent Integration**: Enhance the existing iraqi-accessibility-specialist agent with actual validation tools

## What
A production-ready accessibility compliance system that validates, monitors, and reports on WCAG 2.1 AA compliance with specialized Arabic/RTL support.

### Success Criteria
- [ ] 100% WCAG 2.1 AA compliance validation across all 44 existing UI components
- [ ] Arabic screen reader compatibility verified with NVDA, JAWS, and VoiceOver
- [ ] RTL keyboard navigation working correctly (arrow keys, tab order, focus management)
- [ ] Automated accessibility testing pipeline integrated with `bun test`
- [ ] Cultural accessibility validation (Islamic compliance, Iraqi user patterns)
- [ ] Accessibility monitoring dashboard with real-time compliance metrics
- [ ] Integration with existing iraqi-accessibility-specialist agent

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- url: https://www.w3.org/TR/WCAG21/
  why: Official WCAG 2.1 standards - complete success criteria reference
  
- url: https://webaim.org/standards/wcag/checklist
  why: Practical WCAG 2.1 AA checklist for implementation validation
  
- url: https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html
  why: Keyboard accessibility requirements and RTL navigation patterns
  
- file: .claude/agents/iraqi-accessibility-specialist.md
  why: Existing agent configuration with Arabic accessibility requirements and truthfulness protocol
  
- file: examples/ai-design-generation/core/AccessibilityValidator.ts
  why: Existing accessibility validation architecture and patterns to build upon
  
- file: examples/dyad-extracted/components/ui/button.tsx
  why: Example of existing accessibility patterns (focus-visible, aria-invalid states)
  
- file: examples/dyad-extracted/components/ui/input.tsx
  why: Input accessibility patterns and ARIA state management
  
- doc: https://css-tricks.com/comparing-jaws-nvda-and-voiceover/
  why: Screen reader testing strategies and Arabic language support details
  
- file: examples/dyad-extracted/COMPONENT_INVENTORY.md
  why: Complete list of 44 components that need accessibility compliance validation
```

### Current Codebase Structure
```bash
aqlix-ai/
├── .claude/agents/iraqi-accessibility-specialist.md    # Existing agent config
├── examples/
│   ├── ai-design-generation/core/AccessibilityValidator.ts  # Base validation system
│   ├── dyad-extracted/components/ui/                   # 44 UI components to validate
│   └── enhanced-browser-use-extracted/browser/watchdogs/accessibility_watchdog.py
├── apps/
│   ├── web/                                           # Next.js frontend
│   └── api/                                           # FastAPI backend
├── packages/
│   ├── ui/                                           # Shared UI components
│   └── arabic-nlp/                                   # Arabic processing utilities
└── project-context/                                   # Knowledge base
```

### Desired Codebase Structure
```bash
aqlix-ai/
├── packages/accessibility-compliance/
│   ├── src/
│   │   ├── validators/
│   │   │   ├── wcag-validator.ts                     # WCAG 2.1 AA compliance validation
│   │   │   ├── arabic-accessibility-validator.ts    # Arabic/RTL specific validation
│   │   │   ├── cultural-accessibility-validator.ts  # Iraqi cultural compliance
│   │   │   └── screen-reader-validator.ts           # Screen reader testing utilities
│   │   ├── testing/
│   │   │   ├── accessibility-test-suite.ts          # Automated testing framework
│   │   │   ├── keyboard-navigation-tests.ts         # RTL keyboard testing
│   │   │   └── screen-reader-simulation.ts          # Arabic screen reader simulation
│   │   ├── monitoring/
│   │   │   ├── compliance-monitor.ts                # Real-time accessibility monitoring
│   │   │   ├── accessibility-analytics.ts           # Compliance metrics and reporting
│   │   │   └── violation-reporter.ts                # Issue tracking and reporting
│   │   ├── utils/
│   │   │   ├── contrast-calculator.ts               # Color contrast validation
│   │   │   ├── rtl-keyboard-handler.ts              # RTL keyboard navigation utilities
│   │   │   └── arabic-text-analyzer.ts              # Arabic text accessibility analysis
│   │   └── index.ts                                 # Main accessibility compliance API
│   ├── tests/                                       # Comprehensive test suite
│   ├── package.json                                 # Package configuration
│   └── README.md                                    # Implementation guide
├── apps/web/
│   ├── components/accessibility/
│   │   ├── AccessibilityProvider.tsx                # React accessibility context
│   │   ├── KeyboardNavigationHandler.tsx           # RTL keyboard navigation
│   │   └── ScreenReaderSupport.tsx                 # Arabic screen reader integration
│   └── hooks/
│       └── useAccessibilityValidation.ts           # React accessibility validation hook
└── tools/accessibility/
    ├── validate-all-components.ts                   # CLI validation tool
    ├── generate-accessibility-report.ts            # Reporting utility
    └── setup-accessibility-testing.ts              # Testing environment setup
```

### Known Gotchas & Library Quirks
```typescript
// CRITICAL: WCAG 2.1 AA requires 4.5:1 contrast ratio for normal text
// Arabic text needs special consideration for diacritics and character forms

// GOTCHA: RTL keyboard navigation reverses arrow key behavior
// Right arrow = previous item, Left arrow = next item in RTL context

// CRITICAL: Arabic screen readers require proper lang="ar" and dir="rtl" attributes
// Missing language tags break screen reader pronunciation

// GOTCHA: Bun testing with accessibility tools requires specific DOM simulation
// Use @testing-library/dom with proper ARIA testing utilities

// CRITICAL: Existing AccessibilityValidator.ts uses EventEmitter pattern
// Must integrate with this pattern for consistency

// GOTCHA: Iraqi cultural accessibility has specific requirements
// Prayer time notifications need aria-live="polite", not "assertive"

// CRITICAL: Focus management in RTL requires CSS logical properties
// Use inset-inline-start instead of left, inset-inline-end instead of right
```

## Implementation Blueprint

### Data Models and Structure

```typescript
// Core accessibility compliance data models for type safety and validation
interface AccessibilityComplianceConfig {
  wcagLevel: 'A' | 'AA' | 'AAA';
  arabicSupport: boolean;
  rtlKeyboardSupport: boolean;
  culturalCompliance: boolean;
  screenReaderTesting: boolean;
  automatedTesting: boolean;
}

interface WCAGSuccessCriterion {
  id: string; // e.g., "1.4.3"
  title: string;
  level: 'A' | 'AA' | 'AAA';
  category: 'perceivable' | 'operable' | 'understandable' | 'robust';
  validator: (element: HTMLElement) => AccessibilityTestResult;
  arabicSpecific: boolean;
  culturalRelevant: boolean;
}

interface AccessibilityTestResult {
  passed: boolean;
  wcagLevel: 'A' | 'AA' | 'AAA' | null;
  violations: AccessibilityViolation[];
  arabicCompliance: number; // 0-100 score
  culturalCompliance: number; // 0-100 score
  recommendations: string[];
}
```

### Task Implementation Order

```yaml
Task 1: "Set up accessibility compliance package foundation"
CREATE packages/accessibility-compliance/:
  - COPY structure from examples/ai-design-generation/core/AccessibilityValidator.ts
  - EXTEND existing EventEmitter pattern for consistency
  - ADD TypeScript configuration with strict accessibility types
  - INSTALL required dependencies: @testing-library/dom, axe-core, @axe-core/playwright

Task 2: "Implement WCAG 2.1 AA validation system"
CREATE src/validators/wcag-validator.ts:
  - MIRROR pattern from AccessibilityValidator.ts validation methods
  - IMPLEMENT all 86 WCAG 2.1 AA success criteria with automated testing
  - INTEGRATE color contrast calculation using existing ColorContrastChecker pattern
  - ADD keyboard accessibility validation extending existing checkKeyboardAccessibility method

Task 3: "Build Arabic/RTL accessibility validation"
CREATE src/validators/arabic-accessibility-validator.ts:
  - EXTEND existing validateArabicAccessibility method from AccessibilityValidator.ts
  - IMPLEMENT Arabic screen reader compatibility validation
  - ADD RTL keyboard navigation testing (reversed arrow keys, proper tab order)
  - VALIDATE Arabic font accessibility and text rendering

Task 4: "Implement cultural accessibility validation"
CREATE src/validators/cultural-accessibility-validator.ts:
  - INTEGRATE with iraqi-accessibility-specialist agent requirements
  - IMPLEMENT Islamic accessibility principles validation (prayer time notifications, respectful messaging)
  - ADD family-shared device accessibility patterns
  - VALIDATE elder-friendly accessibility enhancements

Task 5: "Build automated testing framework"
CREATE src/testing/accessibility-test-suite.ts:
  - INTEGRATE with existing Bun testing configuration
  - IMPLEMENT automated validation for all 44 dyad-extracted components
  - ADD screen reader simulation for Arabic content testing
  - CREATE RTL keyboard navigation test automation

Task 6: "Implement real-time monitoring system"
CREATE src/monitoring/compliance-monitor.ts:
  - EXTEND existing AccessibilityValidator analytics methods
  - ADD real-time accessibility violation detection
  - IMPLEMENT compliance metrics dashboard data collection
  - INTEGRATE with Sentry for accessibility error tracking

Task 7: "Build React accessibility integration"
CREATE apps/web/components/accessibility/AccessibilityProvider.tsx:
  - IMPLEMENT React context for accessibility state management
  - ADD automatic accessibility validation for all components
  - INTEGRATE with existing Iraqi UI components and agent system
  - PROVIDE accessibility testing hooks and utilities

Task 8: "Create CLI validation and reporting tools"
CREATE tools/accessibility/:
  - BUILD component validation CLI that tests all 44 components
  - IMPLEMENT accessibility reporting with cultural compliance metrics
  - ADD integration with existing build pipeline and quality gates
  - CREATE developer accessibility testing utilities
```

### Per Task Pseudocode

```typescript
// Task 1: Package Foundation
export class AccessibilityComplianceSystem extends EventEmitter {
  private config: AccessibilityComplianceConfig;
  private wcagCriteria: Map<string, WCAGSuccessCriterion>;
  
  constructor(config: AccessibilityComplianceConfig) {
    super();
    // PATTERN: Mirror AccessibilityValidator.ts initialization
    this.config = config;
    this.loadWCAGCriteria();
    this.setupArabicValidation();
  }
}

// Task 2: WCAG Validation
async validateWCAGCompliance(element: HTMLElement): Promise<AccessibilityTestResult> {
  // PATTERN: Use existing validation structure from AccessibilityValidator
  const violations: AccessibilityViolation[] = [];
  
  // CRITICAL: Test all 86 WCAG 2.1 AA success criteria
  for (const [id, criterion] of this.wcagCriteria) {
    if (criterion.level === 'AA' || criterion.level === 'A') {
      const result = await criterion.validator(element);
      if (!result.passed) {
        violations.push({
          criterionId: id,
          severity: criterion.level === 'AA' ? 'major' : 'minor',
          description: result.description,
          solution: result.solution
        });
      }
    }
  }
  
  return { passed: violations.length === 0, violations, ... };
}

// Task 3: Arabic/RTL Validation  
async validateArabicAccessibility(element: HTMLElement): Promise<ArabicAccessibilityResult> {
  // PATTERN: Extend existing validateArabicAccessibility method
  const checks = {
    rtlScreenReader: this.checkRTLScreenReader(element), // lang="ar", dir="rtl"
    arabicFontReadability: this.checkArabicFont(element), // Accessible Arabic fonts
    keyboardNavigation: this.checkRTLKeyboard(element), // Reversed arrow keys
    bidiTextSupport: this.checkBidiText(element) // Proper text isolation
  };
  
  // CRITICAL: Arabic screen readers require specific ARIA patterns
  return this.calculateArabicComplianceScore(checks);
}

// Task 5: Automated Testing
async testAllComponents(): Promise<ComponentAccessibilityReport[]> {
  // PATTERN: Use Bun test runner with accessibility testing
  const components = await this.loadDyadComponents(); // 44 components
  const results: ComponentAccessibilityReport[] = [];
  
  for (const component of components) {
    const testResult = await this.runAccessibilityTest(component, {
      wcagLevel: 'AA',
      arabicSupport: true,
      rtlTesting: true,
      screenReaderSimulation: true
    });
    results.push(testResult);
  }
  
  return results;
}
```

### Integration Points
```yaml
EXISTING_SYSTEMS:
  - integrate_with: examples/ai-design-generation/core/AccessibilityValidator.ts
    pattern: "Extend EventEmitter pattern and validation methods"
  
  - integrate_with: .claude/agents/iraqi-accessibility-specialist.md  
    pattern: "Use agent's validation requirements and truthfulness protocol"

TESTING:
  - integrate_with: Bun test runner
    pattern: "bun test packages/accessibility-compliance/tests/"
  
  - integrate_with: existing UI components
    pattern: "Validate all 44 dyad-extracted components automatically"

BUILD_PIPELINE:
  - add_to: package.json scripts
    pattern: "accessibility:test": "bun run test:accessibility"
  
  - integrate_with: CI/CD pipeline
    pattern: "Fail builds on accessibility violations"

MONITORING:
  - integrate_with: Sentry error tracking
    pattern: "Report accessibility violations as errors with cultural context"
  
  - integrate_with: Next.js application
    pattern: "Real-time accessibility monitoring in development and production"
```

## Validation Loop

### Level 1: Syntax & Style
```bash
# Run these FIRST - fix any errors before proceeding
bun run lint packages/accessibility-compliance/src/  # Auto-fix what's possible
bun run typecheck packages/accessibility-compliance/ # TypeScript validation

# Expected: No errors. If errors, READ the error and fix.
```

### Level 2: Unit Tests
```typescript
// CREATE tests for each validator with existing patterns
describe('WCAGValidator', () => {
  test('validates color contrast compliance', async () => {
    const validator = new WCAGValidator({ wcagLevel: 'AA' });
    const result = await validator.validateContrast('#000000', '#ffffff');
    expect(result.ratio).toBeGreaterThan(4.5); // WCAG AA requirement
    expect(result.passed).toBe(true);
  });
  
  test('detects accessibility violations', async () => {
    const element = document.createElement('button');
    // Missing aria-label
    const result = await validator.validateElement(element);
    expect(result.violations).toHaveLength(1);
    expect(result.violations[0].criterionId).toBe('4.1.2');
  });
  
  test('validates Arabic RTL keyboard navigation', async () => {
    const arabicValidator = new ArabicAccessibilityValidator();
    const result = await arabicValidator.validateRTLKeyboard(rtlElement);
    expect(result.rtlKeyboardSupport).toBe(true);
  });
});
```

```bash
# Run and iterate until passing:
bun test packages/accessibility-compliance/tests/ --verbose
# If failing: Read error, understand root cause, fix code, re-run
```

### Level 3: Integration Test
```bash
# Test all 44 components for accessibility compliance
bun run accessibility:validate-all

# Expected output: 
# ✅ 44/44 components WCAG 2.1 AA compliant
# ✅ 44/44 components Arabic screen reader compatible  
# ✅ 44/44 components RTL keyboard accessible
# 📊 Overall accessibility score: 98% (cultural compliance: 96%)

# Test with real screen reader simulation
bun test packages/accessibility-compliance/tests/screen-reader.test.ts
```

## Final Validation Checklist
- [ ] All 44 dyad-extracted components pass WCAG 2.1 AA validation
- [ ] Arabic screen reader compatibility verified (NVDA, JAWS, VoiceOver)
- [ ] RTL keyboard navigation working correctly (reversed arrow keys, proper tab order)
- [ ] Cultural accessibility validated (Islamic compliance, Iraqi patterns)
- [ ] Automated testing suite passes: `bun test packages/accessibility-compliance/`
- [ ] No linting errors: `bun run lint packages/accessibility-compliance/`
- [ ] No type errors: `bun run typecheck packages/accessibility-compliance/`
- [ ] CLI validation tool working: `bun run accessibility:validate-all`
- [ ] Real-time monitoring integrated with existing system
- [ ] Agent integration successful (iraqi-accessibility-specialist enhanced)
- [ ] Documentation complete with Arabic accessibility examples

## Anti-Patterns to Avoid
- ❌ Don't fake accessibility compliance - use actual testing with assistive technologies
- ❌ Don't ignore Arabic-specific accessibility requirements (lang="ar", dir="rtl")
- ❌ Don't skip cultural accessibility validation - Islamic principles matter
- ❌ Don't break existing AccessibilityValidator.ts patterns - extend them
- ❌ Don't hardcode accessibility thresholds - make them configurable
- ❌ Don't test accessibility in isolation - test with real Iraqi user scenarios
- ❌ Don't ignore RTL keyboard navigation - it's critical for Arabic users
- ❌ Don't assume WCAG compliance equals cultural accessibility - validate both

---

**PRP Confidence Level: 9/10**

High confidence due to:
✅ Comprehensive existing accessibility foundation (AccessibilityValidator.ts)
✅ Well-configured Iraqi accessibility specialist agent
✅ 44 UI components already have accessibility patterns 
✅ Clear WCAG 2.1 AA requirements and Arabic accessibility research
✅ Executable validation approach with automated testing
✅ Integration with existing Bun/TypeScript infrastructure

Minor risk: Arabic screen reader testing requires careful validation with actual assistive technology, but comprehensive research provides clear implementation path.