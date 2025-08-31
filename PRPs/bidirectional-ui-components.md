name: "Bidirectional UI Components for Iraqi AI Chat System"
description: |
  Complete implementation of direction-aware UI components with RTL/LTR support,
  Arabic text handling, and cultural integration for seamless bidirectional interfaces.

---

## Goal
Implement a comprehensive bidirectional UI component system that provides seamless direction-aware components supporting both Arabic (RTL) and English (LTR) content with automatic direction detection, cultural validation, and adaptive layouts for the Iraqi AI Chat System.

## Why
- **User Experience**: 500+ million RTL language users require proper bidirectional interface support
- **Cultural Integration**: Essential for Iraqi users who frequently mix Arabic and English content
- **Professional Context**: Required for Iraqi legal, medical, educational, and organizational domains
- **Market Leadership**: Positions the system as the premier Arabic-first AI platform
- **Accessibility**: WCAG 2.1 AA compliance for Arabic-speaking users with disabilities

## What
A complete bidirectional UI foundation featuring:

### User-Visible Behavior
- Automatic text direction detection and layout adaptation
- Seamless switching between RTL and LTR modes
- Proper Arabic typography and text alignment
- Icon and visual element mirroring where appropriate
- Mixed Arabic-English content handling
- Cultural color schemes and Islamic-compliant design patterns

### Technical Requirements
- Direction-aware React components using CVA patterns
- HTML `dir` attribute management with React Context
- Tailwind CSS logical properties for automatic RTL support
- Integration with existing ArabicRTLBridge cultural validation
- Performance optimization with direction change handling

### Success Criteria
- [ ] All 44 components support bidirectional layouts
- [ ] 99%+ RTL layout accuracy matching existing ArabicRTLBridge standards
- [ ] 95%+ cultural appropriateness validation
- [ ] WCAG 2.1 AA accessibility compliance
- [ ] <100ms direction switching performance
- [ ] Zero layout shift during direction changes

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window

- url: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Writing_Modes
  why: Core CSS writing modes, text direction, and bidirectional text handling
  critical: Logical properties usage and unicode-bidi behavior

- url: https://leancode.co/blog/right-to-left-in-react
  why: React RTL implementation best practices and common patterns
  critical: HTML dir attribute management and React Context patterns

- url: https://mui.com/material-ui/customization/right-to-left/
  why: Material UI RTL implementation patterns and CSS-in-JS approaches
  critical: Theme and styling system integration

- url: https://flowbite.com/docs/customize/rtl/
  why: Tailwind CSS RTL support and logical properties
  critical: Modern RTL implementation with Tailwind v3.3+ logical properties

- file: examples/arabic-rtl-integration/core/ArabicRTLBridge.ts
  why: Existing cultural validation pipeline and Iraqi dialect processing
  critical: Integration patterns for cultural compliance and text processing

- file: examples/dyad-extracted/IRAQI_ENHANCEMENT_STRATEGY.md
  why: Component enhancement patterns and Iraqi cultural considerations
  critical: CVA patterns and Islamic UI principles

- file: examples/dyad-extracted/components/ui/button.tsx
  why: Existing CVA component architecture to follow
  critical: Variant patterns and props structure

- file: examples/dyad-extracted/components/ui/input.tsx
  why: Form component patterns for text input handling
  critical: Accessibility and validation patterns

- file: examples/dyad-extracted/hooks/use-mobile.tsx
  why: Hook patterns and responsive behavior
  critical: React hook structure and event handling patterns
```

### Current Codebase Tree
```bash
aqlix-ai/
├── examples/
│   ├── arabic-rtl-integration/
│   │   ├── core/
│   │   │   ├── ArabicRTLBridge.ts          # Cultural validation integration
│   │   │   └── CulturalValidationPipeline.ts
│   │   └── workflow-ui/
│   └── dyad-extracted/
│       ├── components/ui/                   # 44 existing components
│       │   ├── button.tsx                   # CVA-based component patterns
│       │   ├── input.tsx                    # Form component patterns
│       │   ├── card.tsx                     # Layout component patterns
│       │   └── [41 other components]
│       ├── hooks/
│       │   ├── use-mobile.tsx               # Responsive hook patterns
│       │   └── use-toast.ts
│       └── IRAQI_ENHANCEMENT_STRATEGY.md    # Component enhancement guidelines
├── project-context/                        # Cultural and technical context
└── PRPs/                                   # Implementation requirements
```

### Desired Codebase Tree
```bash
# NEW FILES TO CREATE:
packages/ui/
├── hooks/
│   ├── use-direction.tsx                    # Direction context and detection
│   ├── use-text-direction.tsx              # Automatic text direction detection
│   └── use-rtl.tsx                         # RTL-specific utilities
├── contexts/
│   └── DirectionContext.tsx                # Global direction state management
├── utils/
│   ├── direction-utils.ts                  # Direction detection and utilities
│   ├── rtl-helpers.ts                      # RTL-specific helper functions
│   └── cultural-integration.ts             # Integration with ArabicRTLBridge
├── components/ui/ [ENHANCE EXISTING]
│   ├── button.tsx                          # Add direction variants
│   ├── input.tsx                           # Add RTL alignment
│   ├── card.tsx                            # Add layout direction handling
│   └── [enhance all 44 components]
└── styles/
    ├── rtl-overrides.css                   # RTL-specific style overrides
    └── cultural-themes.css                 # Iraqi cultural color schemes
```

### Known Gotchas & Library Quirks
```typescript
// CRITICAL: Tailwind CSS v3.3+ RTL Support
// Use logical properties instead of directional ones
// ❌ WRONG: ml-4, mr-2, pl-3, pr-5
// ✅ CORRECT: ms-4, me-2, ps-3, pe-5

// CRITICAL: CVA Direction Variants
// Always include direction variants in component variants
const componentVariants = cva("base-classes", {
  variants: {
    direction: {
      ltr: "ltr-specific-classes",
      rtl: "rtl-specific-classes font-arabic"
    }
  }
});

// CRITICAL: Icon Mirroring Logic
// Not all icons should be mirrored - only directional ones
const MIRROR_ICONS = ['arrow-left', 'arrow-right', 'chevron-left', 'chevron-right'];
const NO_MIRROR_ICONS = ['close', 'check', 'plus', 'minus'];

// CRITICAL: Flexbox Direction Changes
// Flexbox children reorder automatically with dir="rtl"
// Use flex-row-reverse only when you need opposite of natural RTL behavior

// CRITICAL: Absolute Positioning
// Never use left/right with absolute positioning in RTL
// ❌ WRONG: absolute left-4 right-auto
// ✅ CORRECT: absolute start-4 end-auto

// CRITICAL: Cultural Integration
// Always validate Arabic content through ArabicRTLBridge
import { ArabicRTLBridge } from '@/lib/arabic-rtl-bridge';
const bridge = new ArabicRTLBridge();
await bridge.processArabicText(content, 'ui-component');
```

## Implementation Blueprint

### Data Models and Structure
```typescript
// Core direction types and interfaces
interface DirectionContextValue {
  direction: 'ltr' | 'rtl' | 'auto';
  setDirection: (dir: 'ltr' | 'rtl' | 'auto') => void;
  isRTL: boolean;
  detectTextDirection: (text: string) => 'ltr' | 'rtl';
  culturalTheme: 'standard' | 'iraqi';
  setCulturalTheme: (theme: 'standard' | 'iraqi') => void;
}

// Component enhancement types
interface BiDirectionalProps {
  dir?: 'ltr' | 'rtl' | 'auto';
  culturalTheme?: 'standard' | 'iraqi';
  textContent?: string; // For automatic direction detection
}

// Integration with cultural validation
interface CulturalValidationResult {
  isCompliant: boolean;
  direction: 'ltr' | 'rtl' | 'auto';
  culturalScore: number;
  recommendations: string[];
}
```

### Task Implementation Order

```yaml
Task 1: Create Core Direction Infrastructure
CREATE packages/ui/contexts/DirectionContext.tsx:
  - IMPLEMENT React.createContext with DirectionContextValue
  - PROVIDE DirectionProvider with localStorage persistence
  - HANDLE automatic direction detection from browser locale
  - INTEGRATE with document.documentElement.dir attribute

CREATE packages/ui/hooks/use-direction.tsx:
  - CONSUME DirectionContext with proper error handling
  - RETURN direction state and utilities
  - PROVIDE setDirection with validation
  - HANDLE SSR compatibility

CREATE packages/ui/utils/direction-utils.ts:
  - IMPLEMENT detectTextDirection using Unicode ranges
  - CREATE isRTLLanguage helper for language codes
  - ADD toggleDirection utility function
  - INTEGRATE with ArabicRTLBridge for cultural validation

Task 2: Enhance Core Components (Templates)
MODIFY packages/ui/components/ui/button.tsx:
  - ADD direction variant to buttonVariants CVA
  - INCLUDE RTL icon positioning logic
  - PRESERVE existing variant structure
  - ADD BiDirectionalProps to component interface

MODIFY packages/ui/components/ui/input.tsx:
  - ADD RTL text alignment classes
  - IMPLEMENT direction-aware placeholder alignment
  - ADD cultural theme support for Arabic typography
  - INTEGRATE automatic text direction detection

MODIFY packages/ui/components/ui/card.tsx:
  - ADD direction-aware padding and margins
  - IMPLEMENT RTL-aware content flow
  - ADD cultural theme variants
  - PRESERVE existing layout patterns

Task 3: Create Direction Detection Hook
CREATE packages/ui/hooks/use-text-direction.tsx:
  - IMPLEMENT real-time text direction detection
  - USE Arabic Unicode range detection (U+0600-U+06FF)
  - HANDLE mixed content scenarios
  - INTEGRATE with cultural validation pipeline

CREATE packages/ui/hooks/use-rtl.tsx:
  - PROVIDE RTL-specific utilities and helpers
  - INCLUDE icon mirroring logic
  - ADD CSS class generation for RTL
  - HANDLE direction-dependent positioning

Task 4: Enhance Form Components
MODIFY all form components in packages/ui/components/ui/:
  - calendar.tsx: RTL month/year navigation
  - checkbox.tsx: RTL label positioning
  - form.tsx: RTL error message alignment
  - radio-group.tsx: RTL option alignment  
  - select.tsx: RTL dropdown positioning
  - slider.tsx: RTL value progression
  - switch.tsx: RTL toggle direction
  - textarea.tsx: RTL text alignment and scrolling

Task 5: Enhance Layout Components  
MODIFY layout components:
  - aspect-ratio.tsx: Direction-agnostic ratios
  - carousel.tsx: RTL navigation and slide progression
  - resizable.tsx: RTL handle positioning
  - scroll-area.tsx: RTL scrollbar positioning
  - separator.tsx: Direction-aware spacing
  - sheet.tsx: RTL slide-in directions
  - sidebar.tsx: RTL positioning and icons

Task 6: Enhance Navigation Components
MODIFY navigation components:
  - breadcrumb.tsx: RTL separator mirroring
  - menubar.tsx: RTL menu positioning
  - navigation-menu.tsx: RTL dropdown positioning
  - pagination.tsx: RTL number progression and arrows
  - tabs.tsx: RTL tab ordering and indicators

Task 7: Enhance Interactive Components
MODIFY interactive components:
  - accordion.tsx: RTL chevron mirroring
  - alert-dialog.tsx: RTL button positioning
  - command.tsx: RTL search results alignment
  - context-menu.tsx: RTL positioning logic
  - dropdown-menu.tsx: RTL submenu positioning
  - hover-card.tsx: RTL positioning relative to trigger
  - popover.tsx: RTL positioning and arrow direction
  - tooltip.tsx: RTL positioning and arrow direction

Task 8: Cultural Integration and Testing
CREATE packages/ui/utils/cultural-integration.ts:
  - INTEGRATE with existing ArabicRTLBridge
  - ADD cultural validation for UI components
  - IMPLEMENT Iraqi theme variants
  - HANDLE mixed Arabic-English content

CREATE cultural testing utilities:
  - RTL layout validation
  - Arabic text rendering tests
  - Cultural appropriateness checks
  - Accessibility compliance verification
```

### Per-Task Pseudocode

```typescript
// Task 1: Direction Context Implementation
const DirectionProvider = ({ children }: { children: React.ReactNode }) => {
  // PATTERN: Use localStorage for persistence (see use-mobile.tsx pattern)
  const [direction, setDirection] = useState<'ltr' | 'rtl' | 'auto'>('auto');
  
  // CRITICAL: Update document.documentElement.dir when direction changes
  useEffect(() => {
    document.documentElement.dir = direction === 'auto' 
      ? detectBrowserDirection() 
      : direction;
  }, [direction]);

  // PATTERN: Provide utilities along with state
  const contextValue = {
    direction,
    setDirection,
    isRTL: direction === 'rtl' || (direction === 'auto' && isRTLBrowser()),
    detectTextDirection: (text: string) => detectArabicContent(text) ? 'rtl' : 'ltr'
  };

  return (
    <DirectionContext.Provider value={contextValue}>
      {children}
    </DirectionContext.Provider>
  );
};

// Task 2: Button Enhancement
const buttonVariants = cva(
  // PATTERN: Keep existing base classes, add RTL support
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all",
  {
    variants: {
      // PRESERVE: All existing variants
      variant: { /* existing variants */ },
      size: { /* existing sizes */ },
      // ADD: Direction-aware variants
      direction: {
        ltr: "text-left [&_svg]:order-first",
        rtl: "text-right font-arabic [&_svg]:order-last",
        auto: "direction-auto"
      }
    }
  }
);

// Task 3: Text Direction Detection
const useTextDirection = (text?: string) => {
  // PATTERN: Use existing ArabicRTLBridge integration
  const bridge = useMemo(() => new ArabicRTLBridge(), []);
  
  const detectDirection = useCallback(async (content: string) => {
    if (!content) return 'ltr';
    
    // INTEGRATION: Use existing cultural validation
    const result = await bridge.processArabicText(content, 'ui-component');
    return result.direction;
  }, [bridge]);

  // CRITICAL: Arabic Unicode range detection (U+0600-U+06FF, U+0750-U+077F)
  const hasArabicChars = (text: string) => /[\u0600-\u06FF\u0750-\u077F]/.test(text);
  
  return { detectDirection, hasArabicChars };
};
```

### Integration Points
```yaml
CULTURAL_VALIDATION:
  - integrate: examples/arabic-rtl-integration/core/ArabicRTLBridge.ts
  - method: "processArabicText(content, 'ui-component')"
  - validation: "95%+ cultural compliance required"

COMPONENT_SYSTEM:
  - base: examples/dyad-extracted/components/ui/
  - pattern: "CVA-based variants with direction support" 
  - preserve: "All existing variants and functionality"

STYLING_SYSTEM:
  - framework: "Tailwind CSS v3.3+ with logical properties"
  - approach: "ms-*/me-*/ps-*/pe-* instead of ml-*/mr-*/pl-*/pr-*"
  - theme: "Iraqi cultural colors and Arabic typography"

ACCESSIBILITY:
  - standard: "WCAG 2.1 AA compliance"
  - testing: "Screen reader compatibility with Arabic text"
  - navigation: "Keyboard navigation in RTL layouts"
```

## Validation Loop

### Level 1: Syntax & Style  
```bash
# Run these FIRST - fix any errors before proceeding
npm run lint            # ESLint with RTL-specific rules
npm run type-check      # TypeScript validation
npm run format         # Prettier with RTL formatting

# Expected: No errors. If errors exist, read and fix before proceeding.
```

### Level 2: Unit Tests
```typescript
// CREATE tests/bidirectional-ui.test.tsx
import { render, screen } from '@testing-library/react';
import { DirectionProvider } from '@/contexts/DirectionContext';

describe('Bidirectional UI Components', () => {
  test('Button renders correctly in RTL mode', () => {
    render(
      <DirectionProvider>
        <Button dir="rtl">اضغط هنا</Button>
      </DirectionProvider>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('dir', 'rtl');
    expect(button).toHaveClass('font-arabic', 'text-right');
  });

  test('Input handles mixed Arabic-English content', () => {
    const { container } = render(
      <Input textContent="Hello مرحبا" />
    );
    
    const input = container.querySelector('input');
    expect(input).toHaveAttribute('dir', 'auto');
  });

  test('Cultural validation integration works', async () => {
    const result = await validateCulturalCompliance('مرحبا بك');
    expect(result.isCompliant).toBe(true);
    expect(result.culturalScore).toBeGreaterThan(90);
  });
});
```

```bash
# Run and iterate until passing:
npm test -- --testPathPattern=bidirectional-ui
# If failing: Read error, understand root cause, fix code, re-run
```

### Level 3: Integration & Visual Tests
```typescript
// CREATE tests/rtl-visual.test.tsx using Playwright
import { test, expect } from '@playwright/test';

test.describe('RTL Visual Tests', () => {
  test('All components render correctly in RTL', async ({ page }) => {
    await page.goto('/component-library?dir=rtl');
    
    // Test each component category
    await page.click('[data-testid="forms"]');
    await expect(page.locator('input')).toHaveCSS('text-align', 'right');
    await expect(page.locator('button svg')).toHaveCSS('order', '2');
    
    // Screenshot comparison for visual regression
    await expect(page).toHaveScreenshot('rtl-forms.png');
  });

  test('Arabic text renders with proper typography', async ({ page }) => {
    await page.goto('/test-arabic-text');
    
    const arabicText = page.locator('[data-testid="arabic-content"]');
    await expect(arabicText).toHaveCSS('font-family', /arabic/);
    await expect(arabicText).toHaveCSS('direction', 'rtl');
  });
});
```

```bash
# Run visual tests:
npx playwright test tests/rtl-visual.test.tsx
# Expected: All RTL layouts render correctly, Arabic typography displays properly
```

## Final Validation Checklist
- [ ] All 44 components support RTL/LTR: `npm test -- --testPathPattern=components`
- [ ] Cultural validation passes: `npm run test:cultural`
- [ ] Accessibility compliant: `npm run test:a11y`
- [ ] Visual regression tests pass: `npx playwright test`
- [ ] Performance benchmarks met: `npm run test:performance` 
- [ ] Arabic text renders correctly in all browsers
- [ ] Direction switching works without layout shift
- [ ] Integration with ArabicRTLBridge functions properly
- [ ] All existing functionality preserved

---

## Anti-Patterns to Avoid
- ❌ Don't use CSS left/right properties - use logical properties (start/end)
- ❌ Don't mirror all icons - only directional ones (arrows, chevrons)
- ❌ Don't break existing component APIs - add direction support additively
- ❌ Don't skip cultural validation - integrate with ArabicRTLBridge
- ❌ Don't ignore accessibility - maintain WCAG compliance
- ❌ Don't hardcode text direction - use automatic detection
- ❌ Don't forget SSR compatibility - handle client-only features properly

---

## PRP Confidence Score: 9/10

This PRP provides comprehensive context, detailed implementation guidance, existing code patterns to follow, and executable validation steps. The extensive research into existing codebase patterns and external best practices, combined with specific technical implementation details, should enable successful one-pass implementation.

**Confidence factors:**
- ✅ Complete analysis of existing codebase patterns
- ✅ Integration with established cultural validation system  
- ✅ Detailed task-by-task implementation guide
- ✅ Comprehensive external research and best practices
- ✅ Executable validation and testing strategy
- ✅ Clear integration points with existing architecture