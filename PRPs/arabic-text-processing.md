# Arabic Text Processing for Iraqi AI Chat System

name: "Arabic Text Processing PRP v1.0 - Foundational Utilities"
description: |
## Purpose
Implement foundational Arabic text processing utilities that provide consistent Arabic text handling, normalization, and basic processing functionality throughout the Iraqi AI Chat System.

## Core Principles
1. **Cultural Accuracy**: All processing must respect Iraqi dialect variations and Islamic values
2. **Performance First**: Sub-100ms processing for real-time applications
3. **Type Safety**: Complete TypeScript integration with zero `any` types
4. **Modular Design**: Reusable utilities that integrate with existing Iraqi-enhanced components

---

## Goal
Create a comprehensive Arabic text processing utility library that handles text normalization, direction detection, character manipulation, and mixed Arabic-English content processing for the Iraqi AI Chat System.

## Why
- **Business Value**: Enables consistent Arabic text handling across all system components
- **User Impact**: Provides proper Arabic display and processing for Iraqi users
- **Integration**: Foundation for form handling, UI components, and cultural validation
- **Problems Solved**: Standardizes Arabic text processing, eliminates inconsistent implementations

## What
A TypeScript library providing:
- Arabic text normalization using Unicode standards
- Bidirectional text direction detection and processing
- Iraqi dialect character handling and classification
- Mixed Arabic-English content processing
- Input validation and sanitization utilities
- Performance-optimized caching for repeated operations

### Success Criteria
- [ ] Process Arabic text with <100ms latency for strings up to 1000 characters
- [ ] Achieve 95%+ accuracy in Iraqi dialect character detection
- [ ] Handle mixed Arabic-English content with proper directionality
- [ ] Pass all cultural validation tests with 100% Islamic compliance
- [ ] Support Unicode normalization forms NFC, NFD, NFKC, NFKD
- [ ] Maintain type safety with comprehensive TypeScript definitions

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
  why: JavaScript Unicode normalization methods and forms
  
- url: https://www.w3.org/International/articles/inline-bidi-markup/uba-basics
  why: Unicode Bidirectional Algorithm basics for RTL text processing
  
- file: examples/phase3-reference-implementations/iraqi-arabic-nlp/src/pipeline/iraqi-arabic-nlp-pipeline.ts
  why: Existing Arabic processing patterns, Iraqi dialect detection, cultural validation
  
- file: examples/phase3-reference-implementations/iraqi-arabic-nlp/src/types/arabic-nlp-types.ts
  why: Comprehensive type definitions for Arabic processing interfaces
  
- file: examples/rtl-support/arabic-components.tsx
  why: RTL component patterns, Arabic font handling, direction attributes
  
- url: https://unicode.org/reports/tr9/
  why: Unicode Bidirectional Algorithm specification
  
- url: https://www.w3.org/International/questions/qa-bidi-unicode-controls.en
  why: Unicode control characters for bidirectional text handling
```

### Current Codebase Overview
```bash
# Key existing components for Arabic processing
examples/
├── phase3-reference-implementations/
│   ├── iraqi-arabic-nlp/
│   │   ├── src/
│   │   │   ├── pipeline/iraqi-arabic-nlp-pipeline.ts  # Advanced NLP pipeline
│   │   │   └── types/arabic-nlp-types.ts              # Comprehensive types
│   │   └── package.json                               # Bun scripts, dependencies
│   └── types/
│       └── src/arabic.ts                              # Basic Arabic types
├── rtl-support/
│   └── arabic-components.tsx                          # RTL React components
└── phase4-implementation-foundation/
    └── types/src/arabic.ts                            # Foundation types

# Current build system uses Bun with TypeScript
```

### Desired Codebase Structure
```bash
packages/
├── arabic-text-processing/
│   ├── src/
│   │   ├── index.ts                     # Main exports
│   │   ├── types.ts                     # Core type definitions
│   │   ├── normalizers/
│   │   │   ├── index.ts                 # Normalizer exports
│   │   │   ├── unicode-normalizer.ts    # Unicode normalization
│   │   │   ├── iraqi-normalizer.ts      # Iraqi-specific normalization
│   │   │   └── mixed-content-normalizer.ts # Arabic-English processing
│   │   ├── detectors/
│   │   │   ├── index.ts                 # Detection exports
│   │   │   ├── direction-detector.ts    # RTL/LTR detection
│   │   │   ├── language-detector.ts     # Arabic/English detection
│   │   │   └── dialect-detector.ts      # Iraqi dialect detection
│   │   ├── processors/
│   │   │   ├── index.ts                 # Processor exports
│   │   │   ├── character-processor.ts   # Character classification
│   │   │   ├── bidi-processor.ts        # Bidirectional text processing
│   │   │   └── validation-processor.ts  # Input validation/sanitization
│   │   ├── utils/
│   │   │   ├── index.ts                 # Utility exports
│   │   │   ├── constants.ts             # Arabic ranges, patterns
│   │   │   ├── cache.ts                 # Performance caching
│   │   │   └── performance.ts           # Performance measurement
│   │   └── __tests__/
│   │       ├── normalizers.test.ts      # Normalization tests
│   │       ├── detectors.test.ts        # Detection tests
│   │       ├── processors.test.ts       # Processing tests
│   │       ├── integration.test.ts      # Integration tests
│   │       └── performance.test.ts      # Performance benchmarks
│   ├── package.json                     # Bun configuration
│   ├── tsconfig.json                    # TypeScript configuration
│   └── README.md                        # Usage documentation
```

### Known Gotchas & Library Quirks
```typescript
// CRITICAL: JavaScript normalization quirks for Arabic text
// Problem: Arabic visually similar characters are NOT canonically equivalent
// Example: أ (U+0623) vs ا (U+0627) - look similar but different Unicode
// Solution: Custom normalization mapping for Arabic-specific cases

// CRITICAL: Bidi algorithm edge cases
// Problem: Mixed punctuation in RTL text can break directional runs
// Example: "Arabic text, English text" - comma placement affects display
// Solution: Use Unicode directional control characters (RLE, PDF, etc.)

// PERFORMANCE: Repeated normalization can be expensive
// Problem: normalizing same text multiple times in real-time chat
// Solution: LRU cache with string hash keys, expire after 5 minutes

// CULTURAL: Iraqi dialect detection requires specific patterns
// Pattern: Use existing dialect indicators from iraqi-arabic-nlp-pipeline.ts
// Example: 'شلونك', 'شكو ماكو', 'مال' are strong Iraqi dialect indicators

// SECURITY: Unicode security vulnerabilities
// Problem: Homograph attacks using similar Arabic characters
// Solution: Validate against known safe character ranges only

// INTEGRATION: Must work with existing Iraqi cultural validators
// Pattern: Export interfaces that match IraqiCulturalContext from @iraqi-ai/types
```

## Implementation Blueprint

### Data Models and Structure

Core interfaces that ensure type safety and integration with existing Iraqi AI system:

```typescript
// Core processing interfaces matching existing patterns
export interface ArabicTextInput {
  text: string;
  language?: 'ar' | 'ar-IQ' | 'mixed' | 'auto-detect';
  preserveFormatting?: boolean;
  culturalValidation?: boolean;
}

export interface ArabicProcessingResult {
  originalText: string;
  processedText: string;
  confidence: number; // 0-100
  detectedLanguage: 'ar' | 'en' | 'mixed' | 'unknown';
  textDirection: 'rtl' | 'ltr' | 'mixed';
  processingTime: number; // milliseconds
  warnings: ProcessingWarning[];
}

export interface IraqiDialectFeature {
  feature: string;
  iraqiVariant: string;
  msaEquivalent?: string;
  confidence: number;
  regionType: 'baghdadi' | 'basrawi' | 'moslawi' | 'mixed-iraqi';
}
```

### Task Implementation Order

```yaml
Task 1: "Core Types and Constants"
CREATE packages/arabic-text-processing/src/types.ts:
  - MIRROR interfaces from: examples/phase3-reference-implementations/iraqi-arabic-nlp/src/types/arabic-nlp-types.ts
  - SIMPLIFY for basic text processing (not full NLP)
  - PRESERVE cultural validation patterns

CREATE packages/arabic-text-processing/src/utils/constants.ts:
  - DEFINE Arabic Unicode ranges (U+0600-U+06FF, U+0750-U+077F, etc.)
  - DEFINE Iraqi dialect indicators from existing pipeline
  - PRESERVE cultural markers from iraqi-arabic-nlp-pipeline.ts

Task 2: "Unicode Text Normalizer"
CREATE packages/arabic-text-processing/src/normalizers/unicode-normalizer.ts:
  - IMPLEMENT JavaScript String.prototype.normalize() wrapper
  - SUPPORT all normalization forms: NFC, NFD, NFKC, NFKD
  - HANDLE Arabic-specific visual similarity cases (أ/ا, ي/ى, ه/ة)
  - PATTERN: Return ArabicProcessingResult interface consistently

Task 3: "Direction and Language Detection"
CREATE packages/arabic-text-processing/src/detectors/direction-detector.ts:
  - MIRROR pattern from: ArabicLanguageDetector in iraqi-arabic-nlp-pipeline.ts
  - SIMPLIFY for basic direction detection only
  - IMPLEMENT first-strong character detection algorithm
  - HANDLE mixed content with proper segmentation

CREATE packages/arabic-text-processing/src/detectors/language-detector.ts:
  - DETECT Arabic vs Latin script ratios
  - IDENTIFY mixed language boundaries
  - PRESERVE confidence scoring patterns

Task 4: "Iraqi Dialect Processing"
CREATE packages/arabic-text-processing/src/detectors/dialect-detector.ts:
  - EXTRACT dialect detection logic from IraqiDialectAnalyzer
  - FOCUS on basic Iraqi vs MSA classification
  - PRESERVE dialect indicators and regional patterns
  - MAINTAIN cultural appropriateness scoring

Task 5: "Bidirectional Text Processing"
CREATE packages/arabic-text-processing/src/processors/bidi-processor.ts:
  - IMPLEMENT Unicode Bidirectional Algorithm basics
  - HANDLE mixed RTL/LTR segmentation
  - PROCESS directional control character insertion
  - PATTERN: Follow BidiRuns structure from existing codebase

Task 6: "Character and Input Processing"
CREATE packages/arabic-text-processing/src/processors/character-processor.ts:
  - CLASSIFY Arabic characters (letter, diacritic, punctuation)
  - HANDLE Iraqi-specific characters (پ, چ, گ, ڤ, ژ)
  - IMPLEMENT character normalization utilities

CREATE packages/arabic-text-processing/src/processors/validation-processor.ts:
  - SANITIZE Arabic text input for security
  - VALIDATE against safe Unicode ranges
  - PRESERVE cultural validation patterns from existing system

Task 7: "Performance and Caching"
CREATE packages/arabic-text-processing/src/utils/cache.ts:
  - IMPLEMENT LRU cache for repeated text processing
  - PATTERN: Use Map with expiration for normalization results
  - TARGET: <5ms cache hits, <100ms cache misses

CREATE packages/arabic-text-processing/src/utils/performance.ts:
  - TRACK processing time metrics
  - MONITOR cache hit rates
  - PATTERN: Match performance metric interfaces from existing pipeline

Task 8: "Main API Integration"
CREATE packages/arabic-text-processing/src/index.ts:
  - EXPORT all processing functions with consistent interface
  - PROVIDE simple facade API for common operations
  - ENSURE compatibility with @iraqi-ai/types

Task 9: "Comprehensive Test Suite"
CREATE test files following existing patterns:
  - MIRROR test structure from: examples/onlook-extracted/collaboration-engine/tests/
  - INCLUDE performance benchmarks (<100ms requirement)
  - VALIDATE cultural compliance with Iraqi content
  - TEST edge cases: empty strings, pure punctuation, mixed scripts
```

### Per Task Pseudocode

```typescript
// Task 2: Unicode Normalizer Implementation
export class UnicodeNormalizer {
  private cache = new Map<string, ArabicProcessingResult>();
  
  async normalizeText(input: ArabicTextInput): Promise<ArabicProcessingResult> {
    const startTime = Date.now();
    
    // PATTERN: Check cache first (see existing performance patterns)
    const cacheKey = this.generateCacheKey(input);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }
    
    // CRITICAL: Handle Arabic visual similarity normalization
    let normalized = input.text.normalize('NFC'); // Default form
    
    // IRAQI-SPECIFIC: Custom Arabic character mappings
    normalized = this.normalizeArabicSimilarities(normalized);
    
    // PATTERN: Return standardized result interface
    const result: ArabicProcessingResult = {
      originalText: input.text,
      processedText: normalized,
      confidence: this.calculateConfidence(input.text, normalized),
      detectedLanguage: 'ar', // Will be refined in Task 3
      textDirection: 'rtl',   // Will be refined in Task 3
      processingTime: Date.now() - startTime,
      warnings: []
    };
    
    // PERFORMANCE: Cache successful results
    this.cache.set(cacheKey, result);
    return result;
  }
  
  private normalizeArabicSimilarities(text: string): string {
    // PATTERN: Follow existing dialect feature mappings
    return text
      .replace(/[أإآ]/g, 'ا')  // Normalize alef variants
      .replace(/[ى]/g, 'ي')    // Normalize yaa variants  
      .replace(/[ة]/g, 'ه');   // Normalize taa variants (context-dependent)
  }
}

// Task 3: Direction Detection Implementation
export class DirectionDetector {
  async detectDirection(text: string): Promise<DirectionResult> {
    // PATTERN: Mirror ArabicLanguageDetector logic but simplified
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F]/;
    const latinPattern = /[A-Za-z]/;
    
    const arabicMatches = text.match(arabicPattern);
    const latinMatches = text.match(latinPattern);
    
    // ALGORITHM: First-strong character detection
    const firstStrongChar = this.findFirstStrongCharacter(text);
    
    if (arabicMatches && latinMatches) {
      return this.processMixedContent(text, arabicMatches, latinMatches);
    }
    
    // PATTERN: Return consistent interface with confidence scores
    return {
      primaryDirection: arabicMatches ? 'rtl' : 'ltr',
      confidence: this.calculateDirectionConfidence(text),
      mixedContent: false
    };
  }
}
```

### Integration Points
```yaml
TYPES:
  - import: "@iraqi-ai/types"
  - pattern: "Extend IraqiCulturalContext interface for cultural validation"
  
COMPONENTS:
  - integrate: "examples/rtl-support/arabic-components.tsx" 
  - pattern: "Use ArabicText and MixedContent components with new processors"
  
CULTURAL_VALIDATION:
  - hook: "iraqi-cultural-validator agent"
  - pattern: "Export culturally validated processing results"
  
PERFORMANCE:
  - monitor: "Sentry performance metrics integration"
  - target: "<100ms processing, >95% cache hit rate for repeated content"
```

## Validation Loop

### Level 1: Syntax & Style
```bash
# Run these FIRST - fix any errors before proceeding
bun run typecheck                    # TypeScript validation
bun run lint                        # ESLint validation
bun run build                       # Build verification

# Expected: No errors. If errors, READ the error and fix.
```

### Level 2: Unit Tests (Following existing patterns)
```typescript
// CREATE __tests__/normalizers.test.ts following pattern from:
// examples/onlook-extracted/collaboration-engine/tests/collaboration-engine.test.ts

describe('Arabic Text Processing', () => {
  describe('Unicode Normalization', () => {
    test('should normalize Arabic text with NFC', async () => {
      const normalizer = new UnicodeNormalizer();
      const result = await normalizer.normalizeText({
        text: 'أهلاً وسهلاً',
        language: 'ar'
      });
      
      expect(result.processedText).toBeDefined();
      expect(result.confidence).toBeGreaterThan(90);
      expect(result.processingTime).toBeLessThan(100);
    });
    
    test('should handle Iraqi dialect markers', async () => {
      const result = await normalizer.normalizeText({
        text: 'شلونك؟ شكو ماكو؟',
        language: 'ar-IQ'
      });
      
      expect(result.detectedLanguage).toBe('ar');
      expect(result.warnings).toHaveLength(0);
    });
  });

  describe('Direction Detection', () => {
    test('should detect RTL for Arabic text', async () => {
      const detector = new DirectionDetector();
      const result = await detector.detectDirection('مرحبا بكم');
      
      expect(result.primaryDirection).toBe('rtl');
      expect(result.confidence).toBeGreaterThan(95);
    });
    
    test('should handle mixed Arabic-English content', async () => {
      const result = await detector.detectDirection('Arabic نص English');
      
      expect(result.mixedContent).toBe(true);
      expect(result.segments).toBeDefined();
    });
  });

  describe('Performance Requirements', () => {
    test('should process text under 100ms', async () => {
      const startTime = Date.now();
      await processor.processText('نص عربي طويل '.repeat(100));
      const processingTime = Date.now() - startTime;
      
      expect(processingTime).toBeLessThan(100);
    });
  });
});
```

```bash
# Run and iterate until passing:
bun test                             # Run all tests
bun test --grep 'Arabic'            # Arabic-specific tests
bun test --grep 'Performance'       # Performance tests

# If failing: Read error, understand root cause, fix code, re-run
```

### Level 3: Cultural Validation Test
```bash
# Test with Iraqi cultural content using existing agents
# PATTERN: Follow cultural validation from collaboration-engine tests

test('should maintain cultural appropriateness', async () => {
  const islamicText = 'بسم الله الرحمن الرحيم';
  const result = await processor.processText(islamicText);
  
  // CRITICAL: Must respect Islamic content
  expect(result.culturallyValidated).toBe(true);
  expect(result.islamicCompliance).toBeGreaterThan(95);
});
```

### Level 4: Integration Test
```bash
# Test integration with existing Iraqi components
bun run dev                         # Start development server
bun test integration               # Run integration tests

# Expected: All existing Arabic components work with new processors
# If error: Check compatibility with @iraqi-ai/types interfaces
```

## Final Validation Checklist
- [ ] All tests pass: `bun test`
- [ ] No linting errors: `bun run lint`
- [ ] No type errors: `bun run typecheck`
- [ ] Performance targets met: <100ms processing
- [ ] Cultural validation: 100% Islamic compliance
- [ ] Iraqi dialect detection: >85% accuracy
- [ ] Integration successful with existing components
- [ ] Documentation includes Arabic text examples

## Confidence Score: 9/10

**High confidence due to:**
- ✅ Comprehensive existing codebase patterns to follow
- ✅ Clear performance targets and validation criteria
- ✅ Detailed implementation blueprint with specific file references
- ✅ Proven test patterns from existing collaboration engine
- ✅ Strong TypeScript and cultural validation context

**Risk mitigation:**
- Edge cases in bidirectional text handling addressed with Unicode control chars
- Performance caching strategy defined to meet <100ms targets
- Cultural validation hooks integrated from existing Iraqi AI agents
- Comprehensive test coverage including cultural and performance validation

---

## Anti-Patterns to Avoid
- ❌ Don't ignore Arabic-specific Unicode normalization edge cases
- ❌ Don't skip cultural validation for Islamic text content
- ❌ Don't hardcode dialect patterns - use existing mappings from pipeline
- ❌ Don't bypass performance caching for repeated operations
- ❌ Don't break existing @iraqi-ai/types interface compatibility
- ❌ Don't use English-only test cases - include Iraqi Arabic examples
- ❌ Don't implement bidi algorithm from scratch - use Unicode standards