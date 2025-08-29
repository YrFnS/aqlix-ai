name: "RTL Layout Foundation for Iraqi AI Chat System"
description: |

## Goal
Establish a comprehensive RTL layout foundation system that provides proper right-to-left text flow, interface direction, and layout patterns for Arabic content in the Iraqi AI Chat System. The system must support CSS logical properties, Tailwind RTL utilities, bidirectional text handling, and automatic direction detection with 99%+ RTL accuracy.

## Why
- **Cultural Compliance**: Essential for proper Arabic text display and reading patterns for Iraqi users
- **Professional Integration**: Required foundation for Iraqi professional domains (health, education, interior, justice)
- **Technical Foundation**: Core infrastructure needed before implementing specific Arabic content features
- **User Experience**: Proper RTL layout ensures natural Arabic reading flow and interface interaction patterns
- **System Architecture**: Foundation component that all other Arabic-aware features depend on

## What
A complete RTL layout foundation that automatically handles:
- HTML dir attribute configuration and CSS direction setup
- CSS logical properties for direction-agnostic layouts (margin-inline-start, padding-inline-end)
- Tailwind CSS RTL utility configuration and usage (ms-3, pe-5, text-start)
- Bidirectional text handling for mixed Arabic-English content
- Component adaptation patterns for RTL-aware UI elements
- Dynamic direction switching and layout adaptation
- Direction detection and automatic application

### Success Criteria
- [ ] RTL direction renders correctly across all modern browsers (Chrome, Firefox, Safari, Edge)
- [ ] Interface layout mirrors properly with all UI components RTL-adapted
- [ ] Arabic text flows correctly from right to left with proper alignment
- [ ] Mixed Arabic-English text displays without layout conflicts or spillover
- [ ] All UI components automatically adapt to RTL without breaking
- [ ] Direction switching works dynamically without page reload
- [ ] CSS logical properties provide consistent direction-agnostic styling
- [ ] Tailwind RTL utilities work correctly with existing component system

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- url: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values
  why: Complete CSS logical properties reference for direction-agnostic layouts
  critical: Use margin-inline-start/end instead of margin-left/right for RTL support

- url: https://www.w3.org/International/articles/inline-bidi-markup/
  why: Official W3C bidirectional text handling guide for mixed Arabic-English content
  critical: Use dir attributes and Unicode control characters (LRM/RLM) for complex text

- url: https://flowbite.com/docs/customize/rtl/
  why: Modern Tailwind RTL implementation patterns and logical property utilities
  critical: Use ms-3/me-3 instead of ml-3/mr-3, ps-5/pe-5 instead of pl-5/pr-5

- url: https://rtlstyling.com/posts/rtl-styling/
  why: RTL styling best practices and common pitfalls to avoid
  critical: Provide fallbacks for older browsers, test with real Arabic content

- file: examples/arabic-rtl-integration/core/ArabicRTLBridge.ts
  why: Existing Arabic text processing and direction detection patterns
  critical: 99.8% RTL accuracy with Iraqi dialect support and cultural validation

- file: examples/rtl-support/arabic-components.tsx
  why: Existing RTL-aware React component patterns and styling examples
  critical: font-arabic class, dir="rtl" attribute, proper Arabic font families
```

### Current Codebase Structure
```bash
aqlix-ai/
├── examples/
│   ├── arabic-rtl-integration/         # Existing Arabic processing
│   │   ├── core/ArabicRTLBridge.ts     # Direction detection & cultural validation
│   │   └── real-time/ArabicContentSync.ts
│   ├── rtl-support/                    # Basic RTL components
│   │   └── arabic-components.tsx       # RTL React components
│   └── phase3-reference-implementations/
├── PRPs/                               # Product requirement prompts
├── .claude/agents/                     # Specialized Iraqi agents
└── project-context/                   # Cultural context & patterns
```

### Desired Codebase Structure (Files to Add)
```bash
# Core RTL Foundation
src/
├── styles/
│   ├── rtl-foundation.css              # Core RTL CSS with logical properties
│   ├── arabic-fonts.css                # Arabic font configurations
│   └── rtl-tailwind.css                # Tailwind RTL utility extensions
├── utils/
│   ├── rtl-direction-detector.ts       # Automatic direction detection
│   ├── bidirectional-text-handler.ts  # Mixed content processing
│   └── rtl-layout-adapter.ts           # Component RTL adaptation
├── components/
│   ├── rtl/
│   │   ├── RTLProvider.tsx             # RTL context provider
│   │   ├── DirectionToggle.tsx         # Language/direction switcher
│   │   └── RTLContainer.tsx            # RTL-aware container
│   └── ui/
│       ├── rtl-button.tsx              # RTL-adapted button
│       ├── rtl-input.tsx               # RTL-adapted input
│       └── rtl-layout.tsx              # RTL-adapted layout components
├── hooks/
│   ├── useRTLDirection.ts              # RTL direction hook
│   ├── useBidirectionalText.ts         # Bidirectional text hook
│   └── useRTLLayoutAdapter.ts          # RTL layout adaptation hook
└── types/
    └── rtl-layout-types.ts             # RTL layout TypeScript definitions

# Configuration Extensions
tailwind.config.js                      # RTL utilities configuration
next.config.js                          # Next.js RTL support
```

### Known Gotchas & Library Quirks
```typescript
// CRITICAL: Tailwind RTL requires v3.3.0+ for logical properties
// Use ms-3 (margin-start) instead of ml-3, pe-5 (padding-end) instead of pr-5

// CRITICAL: CSS logical properties need fallbacks for older browsers
.rtl-element {
  margin-left: 1rem; /* Fallback */
  margin-inline-start: 1rem; /* Logical property */
}

// CRITICAL: Bidirectional text spillover issues
// Wrap opposite-direction text in spans with dir attribute
<p dir="rtl">النص العربي <span dir="ltr">English text</span> المزيد من العربي</p>

// CRITICAL: Direction detection accuracy
// Arabic Unicode ranges: \u0600-\u06FF, \u0750-\u077F, \u08A0-\u08FF
// Iraqi dialect patterns require cultural validation (see ArabicRTLBridge.ts)

// CRITICAL: Font loading for Arabic
// Must include font-display: swap and proper Arabic font fallbacks
// 'Noto Sans Arabic', 'Amiri', 'Cairo', sans-serif

// CRITICAL: Next.js dir attribute handling
// Must set dir on <html> element, not just components
// Use next/head or _document.tsx for proper implementation
```

## Implementation Blueprint

### Data Models and Structure
```typescript
// Core RTL layout types and interfaces
interface RTLLayoutConfig {
  direction: 'rtl' | 'ltr' | 'auto';
  primaryLanguage: 'arabic' | 'english';
  enableBidirectional: boolean;
  autoDetection: boolean;
  culturalValidation: boolean;
}

interface BidirectionalTextNode {
  content: string;
  detectedDirection: 'rtl' | 'ltr' | 'mixed';
  culturalCompliance: boolean;
  processingConfidence: number;
}

interface RTLComponentConfig {
  adaptedComponents: string[];
  logicalProperties: boolean;
  tailwindRTL: boolean;
  customCSS: Record<string, string>;
}
```

### Implementation Tasks (In Order)

```yaml
Task 1 - CSS Foundation Setup:
CREATE src/styles/rtl-foundation.css:
  - IMPLEMENT CSS logical properties (margin-inline-start/end, padding-inline-start/end)
  - ADD direction-agnostic layout utilities
  - INCLUDE browser fallbacks for older browsers
  - SET proper Arabic font-family declarations with fallbacks

CREATE src/styles/arabic-fonts.css:
  - CONFIGURE proper Arabic font loading with font-display: swap
  - SET font-family stack: 'Noto Sans Arabic', 'Amiri', 'Cairo', sans-serif
  - INCLUDE Arabic font weight and style variations

Task 2 - Tailwind RTL Configuration:
MODIFY tailwind.config.js:
  - ENABLE logical property utilities (ms-, me-, ps-, pe-, text-start/end)
  - CONFIGURE RTL-specific utilities and variants
  - ADD custom RTL spacing and positioning classes
  - SET up Arabic typography utilities

CREATE src/styles/rtl-tailwind.css:
  - EXTEND Tailwind with custom RTL utilities
  - ADD Arabic-specific spacing and alignment classes
  - IMPLEMENT bidirectional text utility classes

Task 3 - Direction Detection System:
CREATE src/utils/rtl-direction-detector.ts:
  - IMPLEMENT Arabic text detection using Unicode ranges [\u0600-\u06FF]
  - ADD mixed content analysis (Arabic vs English character counts)
  - INCLUDE confidence scoring for direction detection
  - INTEGRATE with existing ArabicRTLBridge.ts patterns

CREATE src/utils/bidirectional-text-handler.ts:
  - IMPLEMENT mixed Arabic-English text processing
  - ADD Unicode directional markers (LRM/RLM) handling
  - HANDLE text spillover prevention with proper wrapping
  - INCLUDE cultural validation integration

Task 4 - React RTL Provider System:
CREATE src/components/rtl/RTLProvider.tsx:
  - IMPLEMENT React context for RTL state management
  - ADD direction switching functionality
  - INCLUDE layout adaptation triggers
  - PROVIDE hooks for RTL-aware components

CREATE src/hooks/useRTLDirection.ts:
  - IMPLEMENT RTL direction state hook
  - ADD automatic direction detection integration
  - INCLUDE direction change event handling
  - PROVIDE layout reflow triggers

Task 5 - RTL-Adapted UI Components:
CREATE src/components/ui/rtl-button.tsx:
  - ADAPT existing button component for RTL
  - USE logical properties for spacing and positioning
  - IMPLEMENT proper text alignment for Arabic
  - INCLUDE icon positioning adaptation

CREATE src/components/ui/rtl-input.tsx:
  - ADAPT form inputs for RTL text entry
  - SET proper Arabic text alignment and cursor behavior
  - IMPLEMENT placeholder text RTL handling
  - ADD bidirectional text input support

CREATE src/components/ui/rtl-layout.tsx:
  - IMPLEMENT RTL-aware layout containers
  - USE flexbox with logical property equivalents
  - ADD automatic layout mirroring
  - INCLUDE responsive RTL behavior

Task 6 - Next.js Integration:
MODIFY next.config.js:
  - ADD RTL support configuration
  - ENABLE i18n with Arabic locale
  - SET proper HTML lang and dir attribute handling

MODIFY pages/_document.tsx:
  - IMPLEMENT dynamic dir attribute on <html> element
  - ADD proper Arabic language meta tags
  - INCLUDE RTL CSS loading optimization

Task 7 - Testing & Validation Setup:
CREATE tests/rtl-layout.test.tsx:
  - ADD comprehensive RTL rendering tests
  - INCLUDE bidirectional text display validation
  - TEST component adaptation across different directions
  - VALIDATE Arabic font loading and display
```

### Integration Points
```yaml
STYLING:
  - integration: "Import RTL CSS in global styles and component libraries"
  - pattern: "@import 'src/styles/rtl-foundation.css';"
  
COMPONENTS:
  - integration: "Wrap app with RTLProvider for context"
  - pattern: "<RTLProvider><App /></RTLProvider>"
  
TAILWIND:
  - integration: "Use logical property utilities in all components"
  - pattern: "className='ms-4 pe-3 text-start' instead of 'ml-4 pr-3 text-left'"
  
CULTURAL_VALIDATION:
  - integration: "Connect with existing ArabicRTLBridge for validation"
  - pattern: "await arabicBridge.processArabicText(text, 'ui-component')"
```

## Validation Loop

### Level 1: Syntax & Style
```bash
# Run these FIRST - fix any errors before proceeding
bun run lint                    # ESLint validation
bun run typecheck              # TypeScript type checking
bun run build                  # Ensure build succeeds with RTL changes

# Expected: No errors. If TypeScript errors about RTL types, check imports.
```

### Level 2: RTL Component Tests
```typescript
// CREATE tests/rtl-layout.test.tsx with these test cases:
describe('RTL Layout Foundation', () => {
  test('detects Arabic text direction correctly', () => {
    const arabicText = 'مرحبا بكم في النظام';
    const direction = detectTextDirection(arabicText);
    expect(direction).toBe('rtl');
  });

  test('handles mixed Arabic-English content', () => {
    const mixedText = 'Welcome مرحبا to the system النظام';
    const processed = processBidirectionalText(mixedText);
    expect(processed.direction).toBe('mixed');
    expect(processed.confidence).toBeGreaterThan(0.8);
  });

  test('RTL components render with proper direction', () => {
    render(<RTLProvider direction="rtl"><ArabicButton>اضغط هنا</ArabicButton></RTLProvider>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('dir', 'rtl');
    expect(button).toHaveStyle('text-align: right');
  });

  test('layout adapts when direction changes', () => {
    const { rerender } = render(
      <RTLProvider direction="ltr"><RTLContainer>Content</RTLContainer></RTLProvider>
    );
    rerender(
      <RTLProvider direction="rtl"><RTLContainer>Content</RTLContainer></RTLProvider>
    );
    // Verify layout mirroring occurred
  });
});
```

```bash
# Run and iterate until passing:
bun test tests/rtl-layout.test.tsx
# If failing: Check RTL CSS application, direction detection logic, component adaptation
```

### Level 3: Browser RTL Integration Test
```bash
# Start development server
bun run dev

# Manual testing checklist:
# 1. Navigate to test page with Arabic content
curl -X GET http://localhost:3000/rtl-test

# 2. Verify Arabic text displays right-to-left
# 3. Test direction toggle functionality
# 4. Validate mixed Arabic-English content
# 5. Check component layout mirroring
# 6. Test across different browsers (Chrome, Firefox, Safari)

# Expected: Arabic text flows RTL, components mirror layout, no text spillover
```

### Level 4: Iraqi Agent Cultural Validation
```bash
# Use Iraqi cultural validator agent to ensure compliance
# This validates Arabic text handling and cultural appropriateness
# Requires 95%+ cultural appropriateness score for Arabic content
```

## Final Validation Checklist
- [ ] All RTL tests pass: `bun test tests/rtl-layout.test.tsx`
- [ ] No linting errors: `bun run lint`
- [ ] No type errors: `bun run typecheck`
- [ ] Build succeeds: `bun run build`
- [ ] Arabic text displays correctly in all browsers
- [ ] Mixed content handles bidirectional text properly
- [ ] Layout components mirror correctly in RTL mode
- [ ] Direction switching works without page reload
- [ ] Font loading works with Arabic fonts
- [ ] Cultural validation passes with 95%+ score
- [ ] Performance: RTL detection <100ms, layout adaptation <200ms

---

## Anti-Patterns to Avoid
- ❌ Don't use physical properties (margin-left/right) without logical fallbacks
- ❌ Don't assume all Arabic text needs same treatment - Iraqi dialects vary
- ❌ Don't ignore bidirectional text spillover in mixed content
- ❌ Don't hardcode RTL styles - use dynamic direction detection
- ❌ Don't skip cultural validation - Iraqi users expect proper Arabic handling
- ❌ Don't forget browser fallbacks for CSS logical properties
- ❌ Don't copy-paste Arabic text for testing - use proper Iraqi examples
- ❌ Don't ignore font loading performance for Arabic fonts