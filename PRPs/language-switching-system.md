name: "Language Switching System PRP - Iraqi AI Chat System"
description: |

## Purpose
Comprehensive PRP for implementing dynamic Arabic-English language switching with RTL/LTR direction toggle, cultural integration, and smooth transitions optimized for one-pass implementation success.

## Core Principles
1. **Cultural Integration**: Leverage existing ArabicRTLBridge for cultural validation and text processing
2. **React Best Practices**: Use Context API with performance optimization for global language state
3. **Existing Patterns**: Follow established codebase patterns from use-toast.ts and UI components
4. **Smooth Transitions**: CSS transitions and animations for seamless language switching
5. **Iraqi Compliance**: 95%+ cultural appropriateness, 99%+ RTL accuracy per CLAUDE.md standards

---

## Goal
Implement a dynamic language switching system that provides seamless Arabic-English language transitions with automatic RTL/LTR direction switching, preference persistence, and full integration with the existing Iraqi AI cultural validation infrastructure.

## Why
- **Enhanced User Experience**: Bilingual Iraqi professionals need seamless language switching without interface disruption
- **Cultural Compliance**: Integration with existing ArabicRTLBridge ensures 95%+ Islamic compliance and cultural appropriateness
- **Professional Accessibility**: Supports Iraqi legal, medical, educational, and organizational domains with proper language handling
- **Performance Optimization**: <200ms language switching aligned with existing cultural validation standards

## What
A React Context-based language management system featuring:
- Global language state management with Arabic-English switching
- Automatic RTL/LTR direction toggling with smooth CSS transitions
- Language preference persistence with localStorage integration
- UI toggle component following existing component patterns
- Integration with ArabicRTLBridge for cultural validation
- Browser language detection with fallback handling

### Success Criteria
- [ ] Language switching completes in <200ms (matching cultural validation standards)
- [ ] 99%+ RTL layout accuracy with proper Arabic text handling
- [ ] 95%+ cultural compliance through ArabicRTLBridge integration  
- [ ] Language preferences persist across browser sessions
- [ ] Smooth transitions without layout jank or content reflow
- [ ] All existing cultural tests pass with language switching enabled

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- url: https://react.dev/learn/passing-data-deeply-with-context
  why: React Context best practices for global state management, avoiding prop drilling
  section: "Context for theme switching and performance considerations"
  
- url: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/language
  why: Browser language detection patterns and RFC 5646 language codes
  critical: "Safari iOS <10.2 uses lowercase country codes - need normalization"

- url: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage  
  why: Preference persistence patterns with proper error handling
  critical: "Wrap localStorage operations in try/catch blocks for blocked storage scenarios"

- url: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions
  why: Smooth interface animations and performance considerations for RTL/LTR switching
  
- file: examples/arabic-rtl-integration/core/ArabicRTLBridge.ts
  why: Existing Arabic text processing, cultural validation, and dialect recognition patterns
  critical: "Cultural compliance validation must pass 95% score before UI updates"
  
- file: examples/dyad-extracted/hooks/use-toast.ts  
  why: Global state management pattern with reducer, memory state, and event listeners
  pattern: "Global state with listeners array and memory state persistence"
  
- file: examples/dyad-extracted/components/ui/context-menu.tsx
  why: Existing UI component patterns using Radix UI and proper TypeScript patterns
  pattern: "React.forwardRef with proper className handling and Radix UI integration"

- docfile: CLAUDE.md
  why: Project standards for cultural compliance, Arabic processing, and validation requirements
  critical: "95%+ cultural appropriateness, 99%+ RTL accuracy, <200ms processing required"
```

### Current Codebase Architecture Overview
```bash
examples/
├── arabic-rtl-integration/
│   ├── core/ArabicRTLBridge.ts        # Sophisticated Arabic processing & cultural validation
│   └── real-time/ArabicContentSync.ts # Real-time Arabic content synchronization
├── dyad-extracted/
│   ├── hooks/use-toast.ts             # Global state management pattern
│   └── components/ui/                 # Established UI component patterns
└── CLAUDE.md                          # Cultural compliance & validation standards
```

### Desired Codebase Structure with New Files
```bash
src/
├── contexts/
│   ├── LanguageContext.tsx            # React Context for language state management
│   └── LanguageProvider.tsx           # Provider component with state management
├── hooks/
│   ├── useLanguage.tsx                # Hook for consuming language context
│   └── useDirection.tsx               # Hook for RTL/LTR direction management
├── components/
│   ├── LanguageToggle.tsx             # UI component for language switching
│   └── DirectionWrapper.tsx           # Wrapper for handling direction transitions
├── utils/
│   ├── languageDetection.ts           # Browser language detection utilities
│   ├── languageStorage.ts             # localStorage integration with error handling
│   └── languageValidation.ts          # Integration with ArabicRTLBridge validation
└── types/
    └── language.ts                    # TypeScript interfaces for language system
```

### Known Gotchas & Integration Points
```typescript
// CRITICAL: Language context performance optimization
// React Context updates re-render ALL consuming components
// Use useMemo and useCallback for optimization like existing patterns

// GOTCHA: localStorage blocked by user settings
// Must wrap ALL localStorage operations in try/catch blocks
try {
  localStorage.setItem('language', 'ar');
} catch (error) {
  console.warn('Language preference storage blocked', error);
}

// CRITICAL: ArabicRTLBridge integration
// Cultural validation MUST pass 95% score before UI updates
const culturalCompliance = await arabicBridge.validateCulturalCompliance(text);
if (culturalCompliance.score < 95) {
  // Handle cultural validation failure
}

// GOTCHA: Safari iOS <10.2 language code normalization
// navigator.language returns lowercase country codes
const normalizeLanguageCode = (lang: string) => 
  lang.replace(/-([a-z]{2})$/, (_, country) => `-${country.toUpperCase()}`);

// CRITICAL: CSS transitions for RTL/LTR switching
// Simply changing dir attribute isn't sufficient - need logical properties
// Use CSS custom properties for smooth transitions
```

## Implementation Blueprint

### Data Models and Type Structure
```typescript
// Core language system types following existing patterns
interface LanguageState {
  currentLanguage: 'en' | 'ar';
  direction: 'ltr' | 'rtl';
  isLoading: boolean;
  culturalCompliance: ICulturalCompliance; // From ArabicRTLBridge
}

interface LanguageAction {
  type: 'SET_LANGUAGE' | 'SET_DIRECTION' | 'SET_LOADING' | 'SET_COMPLIANCE';
  payload: any;
}

interface LanguageContextValue {
  state: LanguageState;
  switchLanguage: (language: 'en' | 'ar') => Promise<void>;
  toggleLanguage: () => Promise<void>;
  isRTL: boolean;
}
```

### List of Tasks (Implementation Order)

```yaml
Task 1 - Core Language Types & Context Structure:
CREATE src/types/language.ts:
  - DEFINE LanguageState, LanguageAction, and LanguageContextValue interfaces
  - INTEGRATE with ArabicRTLBridge ICulturalCompliance interface
  - FOLLOW existing type patterns from use-toast.ts

CREATE src/contexts/LanguageContext.tsx:
  - MIRROR pattern from React Context best practices documentation
  - CREATE context with createContext() and proper TypeScript typing
  - INCLUDE cultural validation state from ArabicRTLBridge

Task 2 - Language State Management:
CREATE src/contexts/LanguageProvider.tsx:
  - MIRROR global state pattern from examples/dyad-extracted/hooks/use-toast.ts
  - IMPLEMENT useReducer for language state management
  - ADD listeners array and memory state persistence pattern
  - INTEGRATE with ArabicRTLBridge for cultural validation

Task 3 - Language Detection & Storage:
CREATE src/utils/languageDetection.ts:
  - USE navigator.language for browser language detection
  - IMPLEMENT language code normalization for Safari iOS compatibility
  - ADD fallback logic for unsupported languages

CREATE src/utils/languageStorage.ts:  
  - WRAP localStorage operations in try/catch blocks
  - IMPLEMENT preference persistence with error handling
  - FOLLOW patterns from localStorage MDN documentation

Task 4 - Direction Management:
CREATE src/hooks/useDirection.tsx:
  - IMPLEMENT RTL/LTR direction logic based on language
  - UPDATE document.documentElement.dir attribute
  - INTEGRATE CSS custom properties for smooth transitions

CREATE src/utils/languageValidation.ts:
  - INTEGRATE with examples/arabic-rtl-integration/core/ArabicRTLBridge.ts
  - VALIDATE cultural compliance before language switches
  - ENSURE 95%+ cultural appropriateness score requirement

Task 5 - Language Toggle Component:
CREATE src/components/LanguageToggle.tsx:
  - MIRROR UI component patterns from examples/dyad-extracted/components/ui/
  - USE React.forwardRef with proper className handling
  - IMPLEMENT smooth transition animations with CSS
  - ADD loading states and error handling

Task 6 - Language Context Hook:
CREATE src/hooks/useLanguage.tsx:
  - IMPLEMENT useContext hook for consuming language state
  - ADD performance optimization with useMemo/useCallback
  - INCLUDE error handling and fallback states

Task 7 - Direction Wrapper & CSS Integration:
CREATE src/components/DirectionWrapper.tsx:
  - HANDLE direction transitions with CSS custom properties
  - IMPLEMENT smooth layout transitions without reflow
  - INTEGRATE with existing component patterns

ADD CSS custom properties for direction transitions:
  - USE CSS logical properties (margin-inline-start instead of margin-left)
  - IMPLEMENT transition timing matching <200ms requirement
  - ENSURE accessibility compliance with reduced motion preferences

Task 8 - Integration & Testing:
MODIFY root App component:
  - WRAP with LanguageProvider following React Context patterns
  - INITIALIZE language detection on app startup
  - INTEGRATE with existing cultural validation pipeline

CREATE comprehensive test suite:
  - TEST language switching performance (<200ms requirement)
  - VALIDATE cultural compliance integration (95%+ score)
  - TEST localStorage persistence and error handling
  - VERIFY smooth transitions and accessibility
```

### Integration Points & Critical Patterns

```yaml
LANGUAGE STATE MANAGEMENT:
  pattern: "Mirror examples/dyad-extracted/hooks/use-toast.ts global state approach"
  implementation: "useReducer with listeners array and memory state persistence"
  performance: "Use useMemo/useCallback for optimization to prevent unnecessary re-renders"

CULTURAL VALIDATION:
  integration: "examples/arabic-rtl-integration/core/ArabicRTLBridge.ts"  
  requirement: "Cultural compliance score must be ≥95% before language switch"
  pattern: "await arabicBridge.validateCulturalCompliance(text) before UI updates"

UI COMPONENT PATTERNS:
  follow: "examples/dyad-extracted/components/ui/ patterns"
  implementation: "React.forwardRef with className handling and Radix UI integration"
  styling: "Use existing CSS custom properties and transition patterns"

STORAGE & DETECTION:
  localStorage: "Wrap ALL operations in try/catch blocks for blocked storage scenarios"
  detection: "Use navigator.language with normalization for Safari iOS compatibility"
  fallback: "Default to 'en' if detection fails or language unsupported"
```

## Validation Loop

### Level 1: Syntax & Style
```bash
# Run these FIRST - fix any errors before proceeding
bun run lint                          # Auto-fix code style issues
bun run typecheck                     # TypeScript validation
bun run build                         # Verify build succeeds

# Expected: No errors. If errors occur, READ the error message and fix systematically.
```

### Level 2: Unit Tests
```typescript
// CREATE test files following existing test patterns
// Test language switching logic, cultural validation integration, storage handling

// Key test scenarios:
test('language switching completes within 200ms', async () => {
  const start = Date.now();
  await switchLanguage('ar');
  const duration = Date.now() - start;
  expect(duration).toBeLessThan(200);
});

test('cultural compliance validation integration', async () => {
  const result = await switchLanguage('ar');
  expect(result.culturalCompliance.score).toBeGreaterThanOrEqual(95);
});

test('localStorage persistence with error handling', () => {
  // Test both successful storage and blocked storage scenarios
  const mockError = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('Storage blocked');
  });
  
  expect(() => setLanguagePreference('ar')).not.toThrow();
  mockError.mockRestore();
});

test('RTL/LTR direction switching accuracy', () => {
  switchLanguage('ar');
  expect(document.documentElement.dir).toBe('rtl');
  expect(document.documentElement.getAttribute('data-direction')).toBe('rtl');
});
```

```bash
# Run and iterate until passing:
bun test src/contexts/LanguageProvider.test.tsx -v
bun test src/hooks/useLanguage.test.tsx -v  
bun test src/utils/languageStorage.test.tsx -v

# If failing: Read error, understand root cause, fix code, re-run
```

### Level 3: Cultural Compliance & Performance Testing
```bash
# Run existing cultural validation tests
bun run test:cultural                 # Must maintain 95%+ cultural compliance
bun run test:arabic                   # Must maintain 99%+ RTL accuracy

# Performance validation
bun run dev                           # Start development server
# Test language switching performance in browser DevTools
# Measure: Language switch should complete in <200ms
# Verify: No layout reflow or content jumping during transitions
```

## Final Validation Checklist
- [ ] All tests pass: `bun test`
- [ ] No linting errors: `bun run lint`
- [ ] No type errors: `bun run typecheck`
- [ ] Cultural compliance: `bun run test:cultural` (95%+ score)
- [ ] Arabic RTL accuracy: `bun run test:arabic` (99%+ accuracy)
- [ ] Language switching performance: <200ms measured in DevTools
- [ ] localStorage persistence works across browser sessions
- [ ] Smooth transitions without layout jank or reflow
- [ ] Integration with ArabicRTLBridge maintains cultural validation
- [ ] UI component follows existing patterns and accessibility standards

---

## Anti-Patterns to Avoid
- ❌ Don't create new state management patterns when Context + useReducer works
- ❌ Don't skip cultural validation integration - it's mandatory per CLAUDE.md
- ❌ Don't ignore localStorage error handling - users can block storage
- ❌ Don't use sync operations for language switching - keep it async
- ❌ Don't change CSS left/right properties - use logical properties
- ❌ Don't bypass performance requirements - <200ms is mandatory
- ❌ Don't create UI components without following existing patterns

---

## Confidence Score: 9/10

**Justification**: This PRP provides comprehensive context through existing codebase patterns, external documentation, and specific implementation guidance. The integration with ArabicRTLBridge ensures cultural compliance, and the validation approach matches project standards. One-pass implementation success is highly likely given the detailed context and pattern references.

**Potential Risk**: Complex integration between language switching and existing Arabic processing pipeline may require iterative refinement during testing phases.