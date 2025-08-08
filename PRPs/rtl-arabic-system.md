name: "Arabic RTL Text Processing System - Complete Implementation PRP"
description: |

## Purpose
Build a comprehensive Arabic RTL (Right-to-Left) text handling system for the Iraqi AI Chat System with complete component integration, Iraqi dialect recognition, proper typography, and cross-browser compatibility.

## Core Principles
1. **Context-Rich Implementation**: Leverage existing 44 UI components and Iraqi enhancement patterns
2. **Agent-Driven Validation**: Use arabic-rtl-processor and cultural validation agents
3. **Performance-First**: Target 99%+ RTL accuracy and 85%+ Iraqi dialect recognition
4. **Accessibility Compliance**: WCAG 2.1 AA standard with Arabic screen reader support
5. **Cultural Authenticity**: Respect Iraqi customs and Islamic UI principles

---

## Goal
Implement a complete Arabic RTL text processing system that transforms the existing 44 shadcn/ui components with Iraqi cultural enhancements, provides seamless bidirectional text handling, and delivers production-ready Arabic typography with Iraqi dialect recognition capabilities.

## Why
- **User Experience**: Enable natural Arabic text interaction for Iraqi users
- **Cultural Appropriateness**: Respect Iraqi linguistic preferences and Islamic UI principles  
- **Professional Domains**: Support Iraqi legal, medical, and educational contexts
- **Market Expansion**: Unlock full potential for Iraqi user adoption
- **Technical Excellence**: Establish world-class Arabic RTL implementation

## What
Complete Arabic RTL system including:

### Success Criteria
- [ ] All 44 UI components support RTL layouts with `dir="rtl"` and Arabic typography
- [ ] 99%+ RTL layout accuracy across Chrome, Firefox, Safari, Edge
- [ ] 85%+ Iraqi dialect recognition accuracy with cultural context extraction
- [ ] WCAG 2.1 AA compliance for Arabic screen readers and assistive technologies
- [ ] Sub-100ms Arabic text processing performance with proper font optimization
- [ ] Seamless bidirectional text handling for mixed Arabic-English content
- [ ] Production-ready deployment with comprehensive test coverage

## All Needed Context

### Documentation & References (MUST READ)
```yaml
# CRITICAL RTL Documentation
- url: https://developer.mozilla.org/en-US/docs/Web/CSS/direction
  why: CSS direction property specification for RTL implementation
  critical: Never use CSS for base direction in HTML - use dir attribute instead

- url: https://developer.mozilla.org/en-US/docs/Web/CSS/unicode-bidi  
  why: Unicode bidirectional algorithm implementation for mixed content
  critical: Essential for Arabic-English mixed text proper rendering

- url: https://www.w3.org/International/articles/inline-bidi-markup/
  why: W3C bidirectional text markup best practices
  critical: Proper HTML markup patterns for RTL text embedding

- url: https://fonts.google.com/noto/specimen/Noto+Sans+Arabic
  why: Primary Arabic typography choice with excellent RTL support
  critical: Free font with clear diacritical signs for Arabic text processing

# EXISTING CODEBASE PATTERNS
- file: examples/dyad-extracted/IRAQI_ENHANCEMENT_STRATEGY.md
  why: Complete enhancement strategy for all 44 UI components with RTL patterns
  critical: Template for systematic component enhancement approach

- file: examples/rtl-support/arabic-components.tsx  
  why: Proven RTL component implementations with Arabic typography
  critical: Working examples of ArabicText, MixedContent, ArabicInput patterns

- file: .claude/agents/arabic-rtl-processor.md
  why: Specialized agent for Arabic text processing and Iraqi dialect recognition
  critical: 99%+ RTL accuracy target and 85%+ dialect recognition benchmarks

- file: project-context/agents/knowledge-base/technical-solutions.md
  why: Proven RTL patterns, font hierarchies, and Iraqi dialect recognition patterns
  critical: Established solutions for Iraqi-tested RTL implementations

- file: examples/testing_examples/test_agent_patterns.py
  why: Testing patterns for PydanticAI agents with comprehensive validation
  critical: Test structure for Arabic processing agent validation

# PROJECT INFRASTRUCTURE CONTEXT  
- file: CLAUDE.md
  why: Agent delegation rules and cultural compliance requirements
  critical: MANDATORY use of specialized Iraqi AI agents for all cultural validation

- file: examples/dyad-extracted/components/ui/
  why: 44 production-ready shadcn/ui components requiring RTL enhancement
  critical: Base components that need systematic RTL integration

- docfile: initial/03_rtl_arabic.md
  why: Complete feature requirements and validation criteria
  critical: Comprehensive scope definition and integration requirements
```

### Current Codebase Tree (Key RTL-Related Files)
```bash
aqlix-ai/
├── .claude/agents/
│   ├── arabic-rtl-processor.md              # Arabic text processing specialist
│   ├── iraqi-cultural-validator.md          # Cultural appropriateness validation
│   ├── iraqi-accessibility-specialist.md    # Arabic accessibility compliance
│   └── iraqi-ui-designer.md                 # RTL-aware UI design patterns
├── examples/
│   ├── dyad-extracted/
│   │   ├── IRAQI_ENHANCEMENT_STRATEGY.md    # 44 component enhancement plan
│   │   ├── components/ui/                   # shadcn/ui components (44 files)
│   │   │   ├── button.tsx                  # Base component pattern
│   │   │   ├── input.tsx                   # Form component pattern
│   │   │   ├── card.tsx                    # Layout component pattern
│   │   │   └── [... 41 more components]    
│   │   └── lib/utils.ts                     # Utility functions for enhancement
│   └── rtl-support/
│       └── arabic-components.tsx            # Working RTL examples
├── project-context/agents/knowledge-base/
│   └── technical-solutions.md               # Proven RTL implementation patterns
└── examples/testing_examples/
    └── test_agent_patterns.py              # Agent testing patterns
```

### Desired Codebase Tree (Files to be Added)
```bash
# New RTL Infrastructure Files
src/
├── hooks/
│   ├── use-direction.ts                     # RTL/LTR direction detection hook
│   ├── use-iraqi-locale.ts                 # Iraqi locale and dialect context
│   └── use-arabic-font.ts                  # Arabic font loading optimization
├── lib/
│   ├── rtl-utils.ts                         # RTL layout utility functions
│   ├── arabic-typography.ts                # Typography configuration and optimization
│   ├── iraqi-dialect.ts                    # Iraqi dialect recognition patterns
│   └── cultural-tokens.ts                  # Iraqi cultural design tokens
├── components/
│   ├── arabic/
│   │   ├── ArabicText.tsx                  # Enhanced Arabic text component
│   │   ├── MixedContent.tsx                # Bidirectional content handler
│   │   ├── ArabicInput.tsx                 # Arabic input with validation
│   │   └── LanguageToggle.tsx              # Arabic/English toggle
│   └── ui/ (enhanced from dyad-extracted/)
│       ├── button.tsx                      # RTL-enhanced button component
│       ├── input.tsx                       # RTL-enhanced input component
│       ├── card.tsx                        # RTL-enhanced layout component
│       └── [... 41 more enhanced components]
├── styles/
│   ├── arabic-fonts.css                    # Arabic font definitions and loading
│   ├── rtl-layout.css                      # RTL layout utilities
│   └── cultural-colors.css                 # Iraqi cultural color scheme
└── tests/
    ├── rtl-layout.test.tsx                 # RTL layout testing suite
    ├── arabic-typography.test.tsx          # Typography validation tests
    ├── iraqi-dialect.test.ts               # Dialect recognition tests
    └── accessibility-arabic.test.tsx       # Arabic accessibility compliance
```

### Known Gotchas & Library Quirks
```typescript
// CRITICAL: Tailwind CSS v4 RTL Configuration
// Tailwind CSS v4 requires explicit RTL utility configuration
// Use logical properties (start/end) instead of left/right for RTL compatibility
// Example: ml-4 becomes ms-4, mr-4 becomes me-4

// CRITICAL: Next.js 15 + React 19 SSR RTL Handling
// Server-side rendering can cause hydration mismatches with RTL detection
// Always use suppressHydrationWarning for direction-dependent components
// Use useEffect for client-side direction detection

// CRITICAL: Arabic Font Loading Performance
// Noto Sans Arabic is 400KB+ and can impact page load performance
// Use font-display: swap and preload critical Arabic font subsets
// Implement font loading optimization with Bun's asset optimization

// CRITICAL: Unicode Bidirectional Algorithm Limitations
// Browser implementations vary for complex Arabic-English mixed content
// Use explicit directional markup (dir="rtl", dir="ltr") instead of relying on automatic detection
// Test thoroughly with embedded numbers, punctuation, and Latin text

// CRITICAL: Agent Integration Requirements
// MANDATORY: Use Task tool to delegate ALL Arabic processing to arabic-rtl-processor agent
// MANDATORY: Use iraqi-cultural-validator for cultural appropriateness validation
// Never process Arabic text directly - always delegate to specialized agents

// CRITICAL: Iraqi Dialect Recognition Accuracy  
// 85%+ accuracy target requires extensive training data and cultural context
// Common Iraqi patterns: شلونك، شكو ماكو، زين، ماكو مشكلة
// Regional variations (Baghdad, Basra, Mosul) require different processing approaches
```

## Implementation Blueprint

### Data Models and Structure

Create comprehensive RTL system models ensuring type safety and cultural consistency:

```typescript
// RTL Configuration Types
interface RTLConfig {
  direction: 'rtl' | 'ltr' | 'auto';
  language: 'ar' | 'en' | 'mixed';
  dialect?: 'iraqi' | 'standard' | 'gulf' | 'levantine';
  cultural_context: 'iraqi' | 'standard';
  font_preference: 'noto' | 'amiri' | 'cairo' | 'traditional';
}

// Iraqi Dialect Recognition Result
interface IraqiDialectResult {
  text: string;
  dialect_detected: boolean;
  confidence_score: number; // 0-1, target 0.85+
  iraqi_patterns: string[];
  cultural_context: 'formal' | 'informal' | 'professional';
  professional_domain?: 'legal' | 'medical' | 'educational' | 'general';
}

// Arabic Typography Configuration
interface ArabicTypographyConfig {
  primary_font: string;
  fallback_fonts: string[];
  font_size: string;
  line_height: number;
  letter_spacing: string;
  text_align: 'right' | 'left' | 'start';
  writing_mode: 'horizontal-tb' | 'vertical-rl';
}

// RTL Component Enhancement Props
interface RTLComponentProps {
  dir?: 'rtl' | 'ltr' | 'auto';
  cultural?: 'standard' | 'iraqi';
  language?: 'ar' | 'en' | 'mixed';
  typography?: 'arabic' | 'english' | 'mixed';
  accessibility_enhanced?: boolean;
}
```

### Task Implementation Order

```yaml
Task 1: RTL Infrastructure Foundation
MODIFY examples/dyad-extracted/lib/utils.ts:
  - ADD RTL utility functions for direction detection and typography
  - ADD cultural design token integration functions
  - PRESERVE existing utility patterns

CREATE src/hooks/use-direction.ts:
  - IMPLEMENT direction detection with SSR safety
  - ADD client-side hydration handling
  - INCLUDE performance optimization for repeated calls

CREATE src/lib/rtl-utils.ts:
  - IMPLEMENT Unicode bidirectional text processing utilities
  - ADD mixed content handling functions
  - INCLUDE browser compatibility helpers

Task 2: Arabic Typography System
CREATE src/lib/arabic-typography.ts:
  - IMPLEMENT Noto Sans Arabic font configuration
  - ADD font loading optimization with font-display: swap
  - INCLUDE fallback font hierarchy management

CREATE src/styles/arabic-fonts.css:
  - DEFINE @font-face declarations for Arabic fonts
  - ADD font preloading configuration
  - INCLUDE responsive font sizing for mobile devices

Task 3: Iraqi Dialect Recognition Integration
CREATE src/lib/iraqi-dialect.ts:
  - IMPLEMENT Iraqi dialect pattern recognition
  - ADD cultural context extraction functions
  - INTEGRATE with arabic-rtl-processor agent via Task tool

Task 4: Core RTL Components Enhancement
MODIFY examples/dyad-extracted/components/ui/button.tsx:
  - ADD RTL direction support with cultural variants
  - IMPLEMENT Arabic typography integration
  - ADD accessibility enhancements for screen readers

MODIFY examples/dyad-extracted/components/ui/input.tsx:
  - ADD RTL input field handling with proper text alignment
  - IMPLEMENT Arabic keyboard input method support  
  - ADD validation for Arabic text input

MODIFY examples/dyad-extracted/components/ui/card.tsx:
  - ADD RTL layout with proper spacing and alignment
  - IMPLEMENT flexible direction handling for mixed content
  - ADD cultural design token integration

Task 5: Systematic Component Enhancement (Remaining 41 Components)
ENHANCE examples/dyad-extracted/components/ui/*.tsx:
  - APPLY RTL enhancement pattern to all remaining components
  - IMPLEMENT consistent Arabic typography integration
  - ADD accessibility compliance for each component type

Task 6: Advanced Arabic Components
CREATE src/components/arabic/ArabicText.tsx:
  - IMPLEMENT optimized Arabic text rendering component
  - ADD Iraqi dialect recognition integration
  - INCLUDE performance optimization for large text blocks

CREATE src/components/arabic/MixedContent.tsx:
  - IMPLEMENT bidirectional content handling with Unicode compliance
  - ADD automatic direction detection with manual override
  - INCLUDE proper text embedding for complex layouts

CREATE src/components/arabic/ArabicInput.tsx:
  - IMPLEMENT Arabic input component with validation
  - ADD Iraqi dialect pattern validation
  - INCLUDE cultural appropriateness checking

Task 7: Comprehensive Testing Suite
CREATE tests/rtl-layout.test.tsx:
  - IMPLEMENT cross-browser RTL layout validation
  - ADD responsive design testing for Arabic content
  - INCLUDE performance testing for RTL rendering

CREATE tests/iraqi-dialect.test.ts:
  - IMPLEMENT dialect recognition accuracy testing
  - ADD cultural context validation
  - INCLUDE professional domain detection testing

CREATE tests/accessibility-arabic.test.tsx:
  - IMPLEMENT WCAG 2.1 AA compliance testing
  - ADD screen reader compatibility validation
  - INCLUDE keyboard navigation testing for RTL interfaces

Task 8: Integration and Optimization
INTEGRATE arabic-rtl-processor agent:
  - IMPLEMENT Task tool delegation for all Arabic text processing
  - ADD performance monitoring and optimization
  - INCLUDE error handling and fallback mechanisms

OPTIMIZE font loading and typography:
  - IMPLEMENT critical font subset loading
  - ADD progressive font enhancement
  - INCLUDE mobile performance optimization
```

### Per Task Pseudocode

```typescript
// Task 1: RTL Infrastructure Foundation
// src/hooks/use-direction.ts
export function useDirection(dir?: 'rtl' | 'ltr' | 'auto') {
  // PATTERN: SSR-safe direction detection (see examples/dyad-extracted patterns)
  const [direction, setDirection] = useState<'rtl' | 'ltr'>('ltr');
  
  useEffect(() => {
    // CRITICAL: Client-side only direction detection to prevent hydration mismatch
    if (dir === 'auto') {
      // PATTERN: Detect language from text content or user preference
      const detectedDirection = detectTextDirection();
      setDirection(detectedDirection);
    } else {
      setDirection(dir || 'ltr');
    }
  }, [dir]);
  
  return direction;
}

// Task 3: Iraqi Dialect Recognition Integration
// src/lib/iraqi-dialect.ts
export async function recognizeIraqiDialect(text: string): Promise<IraqiDialectResult> {
  // CRITICAL: MANDATORY delegation to arabic-rtl-processor agent
  // PATTERN: Use Task tool for agent coordination (see CLAUDE.md rules)
  const result = await delegateToAgent('arabic-rtl-processor', {
    text,
    task: 'dialect_recognition',
    target_accuracy: 0.85 // 85%+ accuracy requirement
  });
  
  // PATTERN: Cultural validation integration (see project-context/technical-solutions.md)
  const culturalContext = await validateCulturalContext(result);
  
  return {
    text,
    dialect_detected: result.confidence > 0.85,
    confidence_score: result.confidence,
    iraqi_patterns: result.detected_patterns,
    cultural_context: culturalContext.formality_level,
    professional_domain: culturalContext.domain
  };
}

// Task 4: Core Component Enhancement Pattern
// Enhanced Button Component
export const Button = forwardRef<HTMLButtonElement, ButtonProps & RTLComponentProps>(
  ({ cultural = "iraqi", dir, language, ...props }, ref) => {
    const direction = useDirection(dir);
    const locale = useIraqiLocale();
    
    return (
      <button
        ref={ref}
        dir={direction}
        className={cn(
          buttonVariants({
            variant: props.variant,
            size: props.size,
            cultural // Apply Iraqi cultural styling
          }),
          direction === 'rtl' && "font-arabic text-right",
          props.className
        )}
        {...props}
      />
    );
  }
);

// Task 6: Advanced Arabic Components
// src/components/arabic/ArabicText.tsx
export function ArabicText({ children, dialect, cultural_validation }: ArabicTextProps) {
  const [validatedText, setValidatedText] = useState(children);
  const [culturalContext, setCulturalContext] = useState(null);
  
  useEffect(() => {
    // MANDATORY: Use Task tool for arabic-rtl-processor agent
    async function processArabicText() {
      const result = await delegateToAgent('arabic-rtl-processor', {
        text: children,
        task: 'rtl_processing_with_dialect',
        cultural_validation: true
      });
      
      setValidatedText(result.processed_text);
      setCulturalContext(result.cultural_context);
    }
    
    if (children && typeof children === 'string') {
      processArabicText();
    }
  }, [children]);
  
  return (
    <div
      dir="rtl"
      className="font-arabic text-right leading-relaxed"
      style={{
        fontFamily: "'Noto Sans Arabic', 'Amiri', 'Cairo', sans-serif",
        lineHeight: 1.8 // Optimized for Arabic text readability
      }}
    >
      {validatedText}
    </div>
  );
}
```

### Integration Points

```yaml
MCP SERVER INTEGRATION:
  - @21st-dev/magic: "Generate RTL-enhanced UI components with Iraqi cultural patterns"
  - sequential: "Complex Arabic text analysis and multi-step dialect recognition"
  - context7: "Arabic typography documentation and RTL best practices"
  
AGENT COORDINATION:
  - arabic-rtl-processor: "ALL Arabic text processing and dialect recognition"
  - iraqi-cultural-validator: "Cultural appropriateness validation for all content"
  - iraqi-accessibility-specialist: "WCAG compliance validation for Arabic interfaces"
  - iraqi-ui-designer: "RTL-aware design pattern recommendations"

FONT LOADING:
  - preload: "Noto Sans Arabic critical subset for above-fold Arabic text"
  - swap: "Progressive font enhancement with fallback display"
  - optimization: "Bun asset optimization for 400KB+ Arabic font files"

CSS INTEGRATION:
  - tailwind.config.js: "Add RTL utilities and Iraqi cultural design tokens"
  - dir attribute: "HTML-level direction specification, not CSS-only"
  - logical properties: "Use start/end instead of left/right for RTL compatibility"

TESTING INFRASTRUCTURE:
  - playwright: "Cross-browser Arabic text rendering validation"
  - jest: "Unit testing for RTL utilities and dialect recognition"
  - storybook: "Component visualization with RTL and Arabic content examples"
```

## Validation Loop

### Level 1: Syntax & Style  
```bash
# Run these FIRST - fix any errors before proceeding
bun run lint                    # ESLint validation with RTL-specific rules
bun run typecheck              # TypeScript validation for RTL type definitions
bun test:rtl --coverage        # RTL-specific unit test coverage (target: 90%+)

# Expected: No errors. If RTL type errors, READ the error and fix type definitions.
# Expected: 90%+ test coverage for RTL utilities and Arabic components.
```

### Level 2: Component Integration Tests
```bash
# Test RTL component enhancements
bun test:components --rtl              # All 44 components with RTL support
bun test:arabic --dialect=iraqi       # Arabic component dialect recognition
bun test:accessibility --wcag-aa      # WCAG 2.1 AA compliance validation

# Expected: All 44 components render correctly in RTL mode
# Expected: 85%+ Iraqi dialect recognition accuracy
# Expected: 100% WCAG 2.1 AA compliance for Arabic screen readers
```

### Level 3: Cross-Browser Validation
```bash
# Start development server with RTL test content
bun run dev --rtl-test-mode

# Automated cross-browser testing
bun test:browsers --arabic            # Chrome, Firefox, Safari, Edge RTL validation
bun test:mobile --arabic              # iOS Safari, Android Chrome RTL testing

# Manual validation checklist:
# ✅ Arabic text displays right-to-left in all browsers
# ✅ Mixed Arabic-English content renders with proper bidirectionality  
# ✅ Font loading completes within 3 seconds on 3G connections
# ✅ RTL layout remains stable during font swap transitions
```

### Level 4: Agent Integration Validation
```bash
# Test agent coordination and cultural validation
bun test:agents --arabic-rtl           # arabic-rtl-processor agent integration
bun test:cultural --iraqi              # iraqi-cultural-validator coordination
bun test:performance --arabic <100ms   # Sub-100ms Arabic text processing

# Expected: Successful Task tool delegation to agents
# Expected: 95%+ cultural appropriateness validation pass rate
# Expected: Arabic text processing completes in <100ms average
```

### Level 5: Production Deployment Validation
```bash
# Deploy to staging with Arabic content
bun run build && bun run preview

# Production validation tests
curl -H "Accept-Language: ar-IQ" http://localhost:3000/test-arabic
# Expected: Proper RTL layout and Iraqi dialect content

# Performance monitoring
bun run lighthouse --arabic           # Core Web Vitals with Arabic content
# Expected: LCP <2.5s, FID <100ms, CLS <0.1 with Arabic fonts loaded

# Sentry monitoring validation
# Expected: No Arabic text processing errors in Sentry dashboard
# Expected: Font loading performance within acceptable thresholds
```

## Final Validation Checklist

- [ ] All 44 UI components enhanced with RTL support: `bun test:components --rtl --coverage`
- [ ] Arabic typography optimized and fonts load efficiently: `bun test:fonts --performance`  
- [ ] Iraqi dialect recognition achieves 85%+ accuracy: `bun test:dialect --accuracy-threshold=85`
- [ ] WCAG 2.1 AA compliance for Arabic screen readers: `bun test:accessibility --wcag-aa`
- [ ] Cross-browser compatibility validated: `bun test:browsers --arabic --all`
- [ ] Mobile RTL rendering tested on iOS/Android: `bun test:mobile --rtl`
- [ ] Agent integration working with proper Task delegation: `bun test:agents --integration`
- [ ] Performance targets met (<100ms Arabic processing): `bun test:performance --arabic`
- [ ] Cultural validation passing (95%+ appropriateness): `bun test:cultural --iraqi --threshold=95`
- [ ] Production deployment successful with monitoring: Check Sentry dashboard

---

## Anti-Patterns to Avoid

- ❌ Don't use CSS-only direction styling - always use HTML dir attribute
- ❌ Don't process Arabic text directly - always delegate to arabic-rtl-processor agent  
- ❌ Don't assume automatic direction detection works reliably - test thoroughly
- ❌ Don't load full Arabic fonts without optimization - use subset loading
- ❌ Don't skip cultural validation - use iraqi-cultural-validator for all content
- ❌ Don't ignore mobile RTL rendering - test on actual devices
- ❌ Don't forget accessibility testing - validate with Arabic screen readers
- ❌ Don't hardcode RTL behavior - use flexible direction detection
- ❌ Don't skip agent integration tests - validate Task tool delegation
- ❌ Don't deploy without performance monitoring - track Arabic font loading metrics

---

## Success Confidence Score: 9/10

**High Confidence Factors:**
- Comprehensive existing infrastructure with 44 components ready for enhancement
- Proven RTL patterns already established in codebase
- Specialized agent system for Arabic processing and cultural validation
- Clear performance targets and validation criteria
- Extensive research-backed approach with external documentation

**Risk Mitigation:**
- Well-defined agent integration patterns reduce cultural validation risks
- Existing component base provides stable foundation for RTL enhancement
- Comprehensive testing strategy covers cross-browser and accessibility concerns
- Performance monitoring integrated from day one with Sentry tracking

This PRP provides complete context and step-by-step implementation path for successful one-pass Arabic RTL system development with Iraqi cultural authenticity.