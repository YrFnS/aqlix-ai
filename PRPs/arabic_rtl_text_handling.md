# Arabic RTL Text Handling System - Iraqi AI Chat

## Goal
Build a comprehensive Arabic Right-to-Left (RTL) text handling system for the Iraqi AI Chat System that supports proper Arabic typography, Iraqi dialect recognition, bidirectional text rendering, and culturally appropriate text presentation across web and mobile platforms.

## Why
- **User Experience**: Enable Iraqi professionals (lawyers, teachers, doctors, engineers) to interact naturally in Arabic with proper text rendering
- **Cultural Appropriateness**: Respect Iraqi customs and Islamic values through proper text presentation and dialect recognition
- **Cross-Platform Consistency**: Ensure identical Arabic text experience across web and future mobile applications
- **Accessibility Compliance**: Meet WCAG 2.1 AA standards for Arabic content and assistive technologies
- **Performance Optimization**: Deliver fast Arabic font loading and text processing for real-time chat interactions

## What
A complete Arabic RTL text handling system with:
- Advanced typography system with Next.js 15 font optimization (Noto Sans Arabic, Amiri)
- RTL layout components using CSS logical properties
- Iraqi dialect recognition and processing capabilities
- Bidirectional text handling for mixed Arabic-English content
- Secure Arabic input validation and sanitization
- Cross-browser Arabic text rendering consistency
- Accessibility features for Arabic screen readers
- Cultural appropriateness validation for Iraqi context

### Success Criteria
- [ ] Arabic text renders identically across Chrome, Firefox, Safari, Edge browsers
- [ ] Iraqi dialect recognition achieves >85% accuracy on test samples
- [ ] RTL layout responds properly on all screen sizes (320px - 1920px)
- [ ] Arabic fonts load in <2 seconds on 3G connections
- [ ] WCAG 2.1 AA compliance verified for all Arabic content
- [ ] Screen reader compatibility tested with NVDA/JAWS
- [ ] Cultural appropriateness validation passes for Iraqi professional content
- [ ] Zero TypeScript errors and >90% test coverage for Arabic-specific code
- [ ] Bundle size increase <200KB for Arabic features
- [ ] Text processing latency <100ms for input validation

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- url: https://nextjs.org/docs/app/getting-started/fonts
  why: Next.js 15 font optimization with automatic self-hosting and performance improvements
  
- url: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_writing_modes
  why: CSS writing modes for proper RTL implementation with logical properties
  
- url: https://developer.mozilla.org/en-US/docs/Web/CSS/direction
  why: CSS direction property and bidirectional text algorithm understanding

- url: https://fonts.google.com/noto/specimen/Noto+Sans+Arabic
  why: Arabic font specifications, character support, and performance considerations

- url: https://rtlstyling.com/posts/rtl-styling/
  why: Modern RTL styling best practices avoiding simple mirroring approach

- url: https://www.boldare.com/blog/designing-for-arabic-market-designers-perspective/
  why: Cultural considerations and design patterns for Arabic interfaces

- url: https://accessibility-test.org/blog/support/rtl-right-to-left-website-accessibility-considerations/
  why: RTL accessibility requirements and WCAG compliance for Arabic content

- file: /mnt/c/Users/Itokoro/aqlix-ai/examples/rtl-support/arabic-components.tsx
  why: Existing Arabic component patterns to extend and improve

- file: /mnt/c/Users/Itokoro/aqlix-ai/examples/chat/basic-chat-interface.tsx
  why: Chat interface with basic Arabic support - pattern to enhance

- file: /mnt/c/Users/Itokoro/aqlix-ai/examples/monorepo/README.md
  why: Monorepo structure for organizing Arabic features across packages

- docfile: /mnt/c/Users/Itokoro/aqlix-ai/CLAUDE.md
  why: Iraqi AI constants, cultural framework, and development standards
```

### Current Codebase Tree
```bash
/
├── apps/
│   ├── web/                    # Next.js 15+ web application
│   └── api/                    # Python FastAPI backend with PydanticAI
├── packages/                   # Shared between web & mobile
│   ├── ui/                     # Shared UI components (EXTEND for Arabic)
│   ├── types/                  # TypeScript types (ADD Arabic types)
│   ├── features/              # Shared business logic (ADD Arabic processing)
│   ├── api-client/            # API client logic (ADD Arabic content support)
│   └── arabic-nlp/            # Arabic processing logic (CREATE)
├── examples/
│   ├── rtl-support/
│   │   └── arabic-components.tsx    # Existing Arabic components (ENHANCE)
│   └── chat/
│       └── basic-chat-interface.tsx # Chat with basic Arabic (ENHANCE)
```

### Desired Codebase Tree with New Files
```bash
/
├── packages/
│   ├── ui/
│   │   ├── typography/              # Enhanced Arabic typography system
│   │   │   ├── ArabicText.tsx      # Enhanced from examples/rtl-support
│   │   │   ├── ArabicHeading.tsx   # New heading components
│   │   │   └── FontLoader.tsx      # Next.js 15 font optimization
│   │   ├── rtl-layout/             # RTL layout components
│   │   │   ├── RTLContainer.tsx    # Direction-aware container
│   │   │   ├── RTLFlex.tsx         # RTL-aware flexbox
│   │   │   └── RTLGrid.tsx         # RTL-aware grid system
│   │   └── forms/
│   │       ├── ArabicInput.tsx     # Enhanced Arabic input with validation
│   │       └── BidirectionalInput.tsx # Mixed Arabic-English input
│   ├── arabic-nlp/                 # Arabic text processing utilities
│   │   ├── iraqi-dialect/          # Iraqi dialect recognition
│   │   │   ├── detector.ts         # Dialect detection algorithms
│   │   │   ├── normalizer.ts       # Text normalization for Iraqi Arabic
│   │   │   └── validator.ts        # Cultural appropriateness validation
│   │   ├── bidirectional/          # Bidirectional text handling
│   │   │   ├── parser.ts           # Parse mixed Arabic-English content
│   │   │   └── formatter.ts        # Format mixed content properly
│   │   └── security/               # Arabic text security
│   │       ├── sanitizer.ts        # Arabic text sanitization
│   │       └── validator.ts        # Input validation for Arabic text
│   └── types/
│       ├── arabic.ts               # Arabic text and language types
│       └── rtl.ts                  # RTL layout and direction types
├── apps/web/
│   ├── styles/
│   │   ├── arabic-fonts.css        # Arabic font definitions and loading
│   │   └── rtl-utilities.css       # RTL utility classes
│   └── hooks/
│       ├── useArabicText.ts        # Arabic text processing hook
│       ├── useRTLDirection.ts      # RTL direction management
│       └── useIraqiDialect.ts      # Iraqi dialect processing hook
```

### Known Gotchas & Library Quirks
```typescript
// CRITICAL: Next.js 15 Arabic font loading patterns
// Font subsets MUST include 'arabic' for proper character support
import { Noto_Sans_Arabic, Amiri } from 'next/font/google'

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'], // CRITICAL: Must include arabic subset
  display: 'swap',     // Prevent invisible text during font load
  weight: ['400', '500', '700'],
  preload: true,       // Preload for performance
})

// GOTCHA: Arabic text needs 4pt larger font size for equivalent readability
// GOTCHA: Direction inheritance can break layouts - be explicit with dir attribute
// GOTCHA: Not all icons should be flipped in RTL (play button keeps orientation)
// GOTCHA: Numbers stay LTR even in RTL text flow
// GOTCHA: CSS properties like 'left', 'right' don't flip - use logical properties

// CRITICAL: Use CSS logical properties instead of directional ones
// Good: margin-inline-start, padding-inline-end
// Bad: margin-left, padding-right

// CRITICAL: Iraqi dialect detection limitations
// Limited training data for Iraqi Arabic variations
// Regional differences within Iraq (Baghdad vs Basra vs Kurdistan)
// Formal vs informal Iraqi Arabic recognition challenges

// SECURITY: Arabic text injection patterns
// RTL override characters can be used for spoofing
// Unicode normalization required for security
// Input validation must preserve Iraqi dialect authenticity
```

## Implementation Blueprint

### Data Models and Structure
```typescript
// Core Arabic text types
interface ArabicTextConfig {
  text: string;
  language: 'arabic' | 'english' | 'mixed';
  dialect?: 'iraqi' | 'msa' | 'gulf' | 'levantine';
  direction: 'rtl' | 'ltr' | 'auto';
  culturalContext?: 'professional' | 'casual' | 'formal';
}

interface RTLLayoutConfig {
  direction: 'rtl' | 'ltr';
  textAlignment: 'start' | 'end' | 'center';
  iconFlip: boolean;
  numberDirection: 'inherit' | 'ltr';
}

interface IraqiDialectConfig {
  confidence: number; // 0-1 confidence score
  region?: 'baghdad' | 'basra' | 'kurdistan' | 'general';
  formality: 'formal' | 'informal' | 'professional';
  culturallyAppropriate: boolean;
}
```

### Task List in Implementation Order

```yaml
Task 1 - Enhanced Typography System:
  ENHANCE examples/rtl-support/arabic-components.tsx:
    - EXTEND ArabicText component with Next.js 15 font optimization
    - ADD proper fallback fonts and loading strategies
    - IMPLEMENT responsive Arabic typography (4pt larger sizing)
    - ADD font-display swap for performance

  CREATE packages/ui/typography/FontLoader.tsx:
    - IMPLEMENT Next.js 15 font optimization patterns
    - ADD conditional font loading based on language
    - CREATE font preloading strategies
    - IMPLEMENT performance monitoring for font loading

Task 2 - RTL Layout System:
  CREATE packages/ui/rtl-layout/ components:
    - IMPLEMENT CSS logical properties (start/end vs left/right)
    - CREATE direction-aware container components
    - ADD responsive RTL grid and flexbox systems
    - IMPLEMENT icon flipping logic with exceptions

  ENHANCE existing components:
    - MODIFY chat interface for proper RTL message alignment
    - UPDATE button components with RTL-aware styling
    - ADD RTL support to navigation components

Task 3 - Iraqi Dialect Processing:
  CREATE packages/arabic-nlp/iraqi-dialect/:
    - IMPLEMENT basic Iraqi dialect detection using keyword patterns
    - CREATE text normalization preserving Iraqi authenticity
    - ADD cultural appropriateness validation for Iraqi context
    - IMPLEMENT confidence scoring for dialect recognition

  CREATE validation utilities:
    - ADD Iraqi professional terminology recognition
    - IMPLEMENT cultural sensitivity filters
    - CREATE regional variation handling (Baghdad, Basra, etc.)

Task 4 - Bidirectional Text Handling:
  ENHANCE MixedContent component from examples:
    - ADD smart direction detection for mixed Arabic-English content
    - IMPLEMENT proper punctuation handling in bidirectional text
    - CREATE input methods supporting seamless language switching
    - ADD Unicode bidirectional algorithm compliance

  CREATE packages/arabic-nlp/bidirectional/:
    - IMPLEMENT mixed content parsing and formatting
    - ADD automatic direction detection algorithms
    - CREATE proper text segmentation for mixed content

Task 5 - Input Validation and Security:
  CREATE packages/arabic-nlp/security/:
    - IMPLEMENT Arabic text sanitization preventing injection attacks
    - ADD RTL character spoofing prevention
    - CREATE encoding validation for Arabic UTF-8 text
    - IMPLEMENT input validation preserving Iraqi dialect

  ENHANCE existing input components:
    - ADD Arabic-specific validation to forms
    - IMPLEMENT secure input methods for Arabic keyboards
    - CREATE Content Security Policy rules for Arabic fonts

Task 6 - Accessibility Implementation:
  ENHANCE all Arabic components with accessibility:
    - ADD proper ARIA labels for Arabic content
    - IMPLEMENT screen reader compatibility testing
    - CREATE high contrast themes for Arabic typography
    - ADD keyboard navigation for RTL layouts

  CREATE accessibility testing utilities:
    - IMPLEMENT automated WCAG 2.1 AA compliance checking
    - ADD Arabic-specific accessibility validation
    - CREATE screen reader testing patterns
```

### Per Task Pseudocode

```typescript
// Task 1 - Typography System Pseudocode
// packages/ui/typography/FontLoader.tsx
import { Noto_Sans_Arabic, Amiri } from 'next/font/google'

const arabicFonts = {
  noto: Noto_Sans_Arabic({
    subsets: ['arabic'],
    display: 'swap',
    preload: true,
    fallback: ['Arial', 'sans-serif']
  }),
  amiri: Amiri({
    subsets: ['arabic'],
    display: 'swap',
    weight: ['400', '700']
  })
}

// PATTERN: Conditional font loading based on detected language
export function useArabicFonts(language: string, content: string) {
  // CRITICAL: Detect if content contains Arabic characters
  const hasArabic = /[\u0600-\u06FF]/.test(content)
  // PERFORMANCE: Only load Arabic fonts when needed
  return hasArabic ? arabicFonts.noto : defaultFont
}

// Task 3 - Iraqi Dialect Detection Pseudocode
// packages/arabic-nlp/iraqi-dialect/detector.ts
export function detectIraqiDialect(text: string): IraqiDialectConfig {
  // PATTERN: Keyword-based detection with confidence scoring
  const iraqiKeywords = ['شلونك', 'شكو ماكو', 'أستاذ', 'دكتور'] // Iraqi greetings/titles
  const confidence = calculateConfidence(text, iraqiKeywords)
  
  // GOTCHA: Regional variations within Iraq
  const region = detectRegion(text) // Baghdad vs Basra patterns
  
  // CRITICAL: Cultural appropriateness validation
  const culturallyAppropriate = validateCulturalContent(text)
  
  return { confidence, region, culturallyAppropriate }
}

// Task 4 - Bidirectional Text Pseudocode
// packages/arabic-nlp/bidirectional/parser.ts
export function parseMixedContent(text: string) {
  // PATTERN: Segment text by language and direction
  const segments = segmentByLanguage(text)
  
  return segments.map(segment => ({
    text: segment.content,
    direction: detectTextDirection(segment.content),
    language: detectLanguage(segment.content)
  }))
}

// Task 5 - Security Pseudocode
// packages/arabic-nlp/security/sanitizer.ts
export function sanitizeArabicText(text: string): string {
  // CRITICAL: Remove RTL override characters that could be used for spoofing
  const cleaned = text.replace(/[\u202D\u202E]/g, '')
  
  // SECURITY: Normalize Unicode while preserving Iraqi dialect
  const normalized = normalizeArabicText(cleaned, { preserveDialect: true })
  
  // VALIDATION: Check for injection patterns
  if (containsSuspiciousPatterns(normalized)) {
    throw new Error('Potentially malicious Arabic text detected')
  }
  
  return normalized
}
```

### Integration Points
```yaml
TYPOGRAPHY:
  - apps/web: Global CSS with Arabic font definitions
  - packages/ui: Enhanced components with Arabic typography
  - next.config.js: Font optimization configuration

RTL_LAYOUT:
  - apps/web: RTL utility classes and layout components
  - packages/ui: Direction-aware component system
  - CSS-in-JS: Dynamic direction switching support

IRAQI_DIALECT:
  - apps/api: PydanticAI agents with Iraqi dialect processing
  - packages/features: Shared dialect processing utilities
  - packages/api-client: Arabic content API support

ACCESSIBILITY:
  - Global: ARIA labels and semantic markup for Arabic content
  - Testing: Automated accessibility validation pipeline
  - Documentation: Arabic accessibility guidelines
```

## Validation Loop

### Level 1: Syntax & Style
```bash
# Run these FIRST - fix any errors before proceeding
npm run typecheck                    # TypeScript compilation check
npm run lint                        # ESLint validation
npm run lint:css                    # CSS/SCSS linting

# Expected: No errors. If errors, READ the error message and fix.
```

### Level 2: Arabic Functionality Tests
```bash
# Test Arabic component rendering
npm run test -- --testMatch="**/arabic*.test.{ts,tsx}" --verbose

# Test Iraqi dialect processing
npm run test -- --testMatch="**/iraqi-dialect*.test.ts" --verbose

# Test RTL layout components
npm run test -- --testMatch="**/rtl*.test.{ts,tsx}" --verbose

# Expected: All tests pass with >90% coverage
```

### Level 3: Cross-Browser and Accessibility Testing
```bash
# Start development server
npm run dev

# Test Arabic text rendering across browsers
npm run test:e2e -- --grep="Arabic text rendering"

# Test accessibility compliance
npm run test:a11y -- --focus="arabic-content"

# Test performance with Arabic fonts
npm run test:performance -- --arabic-fonts

# Expected: Consistent rendering, WCAG compliance, <2s font loading
```

### Level 4: Cultural and Linguistic Validation
```bash
# Test Iraqi dialect recognition accuracy
npm run test:dialect -- --samples="test-data/iraqi-samples.json"

# Test cultural appropriateness validation
npm run test:cultural -- --context="iraqi-professional"

# Test bidirectional text handling
npm run test:bidi -- --mixed-content

# Expected: >85% dialect accuracy, cultural validation passes
```

## Final Validation Checklist
- [ ] All tests pass: `npm run test`
- [ ] No linting errors: `npm run lint`
- [ ] No type errors: `npm run typecheck`
- [ ] Arabic fonts load in <2 seconds on 3G: Browser DevTools Network tab
- [ ] RTL layout works on mobile: Test on iOS Safari and Android Chrome
- [ ] Screen reader compatibility: Test with NVDA or JAWS
- [ ] Cultural appropriateness validated: Iraqi professional content review
- [ ] Iraqi dialect recognition >85% accurate: Automated test results
- [ ] Cross-browser consistency: Visual regression tests pass
- [ ] Performance budgets met: Bundle analyzer shows <200KB increase
- [ ] Accessibility compliance: axe-core reports zero violations
- [ ] Security validation: No injection vulnerabilities in Arabic input

---

## Anti-Patterns to Avoid
- ❌ Don't use simple mirroring approach - it breaks user experience
- ❌ Don't ignore font loading performance - Arabic fonts are large
- ❌ Don't skip cultural validation - Iraqi context is critical
- ❌ Don't use directional CSS properties (left/right) - use logical properties
- ❌ Don't flip all icons in RTL - play buttons maintain orientation
- ❌ Don't ignore accessibility - Arabic screen reader support is essential
- ❌ Don't hardcode Arabic text - use proper internationalization
- ❌ Don't skip security validation - Arabic text injection is real risk
- ❌ Don't assume all Arabic is the same - Iraqi dialect has unique patterns
- ❌ Don't ignore bidirectional text complexity - mixed content needs special handling

---

## PRP Confidence Score: 9/10

**High confidence for one-pass implementation because:**
- ✅ Builds upon existing proven patterns in examples/rtl-support/
- ✅ Comprehensive external research with specific implementation URLs
- ✅ Addresses Iraqi-specific cultural and linguistic requirements
- ✅ Provides executable validation steps with clear success criteria
- ✅ Covers all technical aspects: fonts, layout, processing, security, accessibility
- ✅ Includes performance benchmarks and WCAG compliance validation
- ✅ Leverages Next.js 15 font optimization and modern CSS logical properties
- ✅ Addresses security concerns specific to Arabic text processing
- ✅ Provides detailed pseudocode for complex implementations
- ✅ Includes comprehensive gotchas and anti-patterns to prevent common failures

**Minor uncertainty (1 point deduction):**
- Iraqi dialect processing accuracy depends on available training data and may require iterative refinement