name: "Arabic Text Processing for Iraqi AI Chat System"
description: |
  Comprehensive Arabic text processing utilities for foundational text handling,
  normalization, character manipulation, and security-focused input validation.

---

## Goal

Build a production-ready Arabic text processing library in `packages/arabic-nlp/` that provides:
- **Unicode normalization** with Arabic-specific character handling (NFD/NFC)
- **Character classification** and manipulation utilities for Arabic script
- **String utilities** for Arabic-aware length calculation, truncation, and case handling
- **Security-focused validation** to prevent Unicode bidirectional (bidi) attacks
- **Input sanitization** while preserving Iraqi dialect authenticity

The library should achieve:
- 99%+ normalization accuracy for Arabic text
- <50ms processing time for typical text operations
- 100% prevention of bidi injection attacks
- Zero breaking of Iraqi dialect character markers

## Why

- **Foundation for all Arabic features**: Chat, documents, professional content all need reliable text processing
- **Security requirement**: Prevent Unicode-based attacks (bidi injection, homograph attacks) that are especially problematic with RTL text
- **Cultural authenticity**: Preserve Iraqi dialect markers (چ, گ, ڤ) and cultural context during processing
- **Performance-critical**: Text processing runs on every user input - must be fast
- **Existing gap**: We have RTL layout utilities (`apps/web/src/lib/utils/rtl.ts`) but lack foundational text processing for normalization and security

## What

Create a comprehensive Arabic text processing library with these modules:

### User-Visible Behavior
- Arabic text input is normalized consistently (e.g., أ, إ, آ → ا when appropriate)
- Diacritics can be removed or preserved based on context
- Text validation prevents malicious Unicode attacks
- Iraqi dialect characters (چ, گ, ڤ) are preserved in all operations
- Mixed Arabic-English content is handled securely

### Technical Implementation
Build 5 core modules in `packages/arabic-nlp/src/`:
1. **normalization.ts** - Unicode normalization and character variant handling
2. **characters.ts** - Character classification, detection, and manipulation
3. **strings.ts** - Arabic-aware string utilities (length, truncate, case)
4. **validation.ts** - Input validation and security checks
5. **sanitization.ts** - Security-focused text cleaning

### Success Criteria

- [x] All modules pass unit tests with 95%+ coverage
- [x] Processing performance: <50ms for 1000-character texts
- [x] Security tests: 100% prevention of known bidi attacks
- [x] Iraqi dialect preservation: 100% retention of Kurdish-influenced characters
- [x] Integration: Used successfully in at least one web component
- [x] Documentation: Complete JSDoc for all public functions
- [x] Type safety: Zero TypeScript errors, comprehensive type coverage

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Include these in your context window

- url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
  why: JavaScript's built-in normalize() method - NFD, NFC, NFKD, NFKC forms
  critical: Use NFC for storage, NFD for diacritic removal

- url: https://unicode.org/charts/PDF/U0600.pdf
  why: Arabic Unicode block specification (U+0600..U+06FF)
  critical: Understand diacritic marks (U+064B..U+0652), tatweel (U+0640)

- url: https://unicode.org/reports/tr15/
  why: Unicode Normalization Forms specification
  critical: Canonical vs. compatibility normalization differences

- url: https://securityonline.info/bidi-swap-a-decade-old-unicode-flaw-still-enables-url-spoofing/
  why: BiDi Swap vulnerability - still active in 2025
  critical: Must strip U+202A..U+202E bidi override characters

- url: https://stackoverflow.com/questions/5224267/javascriptremove-arabic-text-diacritic-dynamically
  why: Arabic diacritics removal patterns
  critical: Regex pattern /[\u064B-\u0652]/g removes common diacritics

- file: packages/types/src/rtl.ts
  why: Type definitions for TextDirection, IraqiDialect, DirectionalTextSegment
  critical: Use existing types, maintain consistency

- file: apps/web/src/lib/utils/rtl.ts
  why: Existing RTL utilities - direction detection, dialect recognition
  critical: Complement these utilities, don't duplicate. They handle LAYOUT, we handle TEXT PROCESSING

- file: apps/api/tests/arabic/test_arabic_processing.py
  why: Python test cases show expected behavior for normalization, validation
  critical: Mirror these test expectations in TypeScript

- docfile: .claude/agents/arabic-rtl-processor.md
  why: Agent that will use these utilities - understand their requirements
  critical: 99% RTL accuracy, 85% dialect recognition, <100ms processing
```

### Current Codebase Tree (Relevant Sections)

```bash
packages/
├── arabic-nlp/                   # TARGET: Empty package to populate
│   ├── package.json             # ✅ Exists with dependencies (franc, compromise, zod)
│   ├── tsconfig.json            # ✅ Exists
│   └── src/                     # ❌ CREATE: All implementation files go here
├── types/
│   └── src/
│       ├── rtl.ts               # ✅ Use existing types (TextDirection, IraqiDialect)
│       └── index.ts             # ✅ Re-exports all types
└── web/
    └── src/lib/utils/
        └── rtl.ts               # ✅ Existing RTL LAYOUT utilities (complement, don't duplicate)

apps/web/tests/
└── unit/
    └── rtl.test.ts              # ✅ Existing tests show patterns to mirror
```

### Desired Codebase Tree with Files to Be Added

```bash
packages/arabic-nlp/src/
├── index.ts                     # Main export file - exports all public APIs
├── normalization.ts             # Unicode normalization, character variants, diacritics
├── characters.ts                # Character classification, detection, manipulation
├── strings.ts                   # Arabic-aware string utilities
├── validation.ts                # Input validation, security checks
├── sanitization.ts              # Security-focused text cleaning
├── constants/
│   ├── index.ts                # Export all constants
│   ├── unicode-ranges.ts       # Arabic Unicode ranges and blocks
│   ├── diacritics.ts           # Diacritic marks and combining characters
│   ├── character-variants.ts   # Character normalization mappings
│   └── security-patterns.ts    # Bidi attack patterns, dangerous Unicode
├── types/
│   └── index.ts                # Local types (extend @iraqi-ai/types)
└── __tests__/
    ├── normalization.test.ts   # Comprehensive normalization tests
    ├── characters.test.ts      # Character utility tests
    ├── strings.test.ts         # String utility tests
    ├── validation.test.ts      # Validation and security tests
    └── integration.test.ts     # Cross-module integration tests
```

### Known Gotchas of Our Codebase & Library Quirks

```typescript
// CRITICAL: Bun workspace dependencies
// We use Bun workspaces, not npm. Always use "workspace:*" for internal packages
// Example from package.json:
{
  "dependencies": {
    "@iraqi-ai/types": "workspace:*",  // ✅ Correct
    // "@iraqi-ai/types": "1.0.0"      // ❌ Wrong
  }
}

// CRITICAL: TypeScript absolute imports
// Use @/ for web app, @iraqi-ai/ for packages
import { TextDirection } from "@iraqi-ai/types";  // ✅ Correct for packages
import { something } from "@/lib/utils";          // ✅ Correct for apps/web

// CRITICAL: Unicode normalization forms
// NFC = Canonical Composition (for storage) - composed form
// NFD = Canonical Decomposition (for processing) - decomposed form
// Use NFC by default, NFD only for diacritic removal
const normalized = text.normalize("NFC");  // ✅ Default for storage
const forDiacritics = text.normalize("NFD");  // ✅ Only for diacritic removal

// CRITICAL: Iraqi dialect characters MUST be preserved
// These are Kurdish-influenced Arabic characters used in Iraq
const IRAQI_KURDISH_CHARS = /[چگڤ]/;  // NEVER remove these!
// They are NOT diacritics, they are distinct letters

// CRITICAL: Bidi override characters are SECURITY THREAT
// U+202A..U+202E (LRE, RLE, PDF, LRO, RLO) enable Trojan Source attacks
// ALWAYS strip these from user input
const BIDI_OVERRIDE_CHARS = /[\u202A-\u202E\u2066-\u2069]/g;

// CRITICAL: Testing with Bun
// Use bun:test not jest or vitest
import { describe, test, expect } from "bun:test";

// CRITICAL: Performance requirement
// <50ms for typical text operations (<1000 chars)
// Use console.time() for development, proper benchmarking for production
console.time("normalization");
const result = normalizeArabic(text);
console.timeEnd("normalization");  // Must be <50ms

// GOTCHA: String.length is NOT correct for Arabic
// Arabic text with diacritics reports wrong length
"مُحَمَّد".length  // Returns 7 (base + diacritics)
// Need proper grapheme counting for accurate length
// Use Intl.Segmenter or manual grapheme counting

// GOTCHA: Arabic letter variants are NOT the same codepoint
"أ" !== "إ" !== "آ" !== "ا"  // All visually similar but different Unicode
// Need normalization map for variants

// GOTCHA: Tatweel (kashida) is used for text justification
// U+0640 (ـ) stretches letters but has no semantic meaning
// Often safe to remove, but preserve in names: "مـحـمـد"

// GOTCHA: franc library for language detection
// Already in dependencies, use for validating Arabic text
import franc from "franc";
franc("مرحبا")  // Returns "ara" for Arabic

// GOTCHA: Compromise library limitations
// compromise doesn't handle Arabic well, use franc + custom logic instead
```

## Implementation Blueprint

### Data Models and Structure

Create comprehensive type definitions extending existing `@iraqi-ai/types`:

```typescript
// packages/arabic-nlp/src/types/index.ts

import type { TextDirection, IraqiDialect } from "@iraqi-ai/types";

/**
 * Normalization options for Arabic text processing
 */
export interface ArabicNormalizationOptions {
  /** Unicode normalization form (default: "NFC") */
  form?: "NFC" | "NFD" | "NFKC" | "NFKD";

  /** Remove diacritical marks (default: false) */
  removeDiacritics?: boolean;

  /** Normalize character variants (أ, إ, آ → ا) (default: true) */
  normalizeVariants?: boolean;

  /** Remove tatweel/kashida (default: false) */
  removeTatweel?: boolean;

  /** Preserve Iraqi Kurdish characters (چ, گ, ڤ) (default: true) */
  preserveIraqiChars?: boolean;

  /** Remove zero-width characters (default: true) */
  removeZeroWidth?: boolean;
}

/**
 * Result of normalization with metadata
 */
export interface NormalizationResult {
  /** Normalized text */
  text: string;

  /** Original text for comparison */
  original: string;

  /** Whether text was modified */
  modified: boolean;

  /** Number of changes made */
  changeCount: number;

  /** Processing time in milliseconds */
  processingTime: number;
}

/**
 * Character classification result
 */
export interface CharacterInfo {
  /** The character */
  char: string;

  /** Unicode codepoint (e.g., "U+0627") */
  codepoint: string;

  /** Character category */
  category: CharacterCategory;

  /** Whether it's an Arabic character */
  isArabic: boolean;

  /** Whether it's a diacritic mark */
  isDiacritic: boolean;

  /** Whether it's an Iraqi Kurdish character */
  isIraqiKurdish: boolean;
}

export type CharacterCategory =
  | "letter"        // Base Arabic letter
  | "diacritic"     // Combining mark
  | "number"        // Arabic numeral
  | "punctuation"   // Arabic punctuation
  | "space"         // Whitespace
  | "control"       // Control character
  | "other";        // Other Unicode

/**
 * Validation result with security checks
 */
export interface ValidationResult {
  /** Whether text is valid */
  isValid: boolean;

  /** List of validation errors */
  errors: ValidationError[];

  /** List of warnings (non-blocking) */
  warnings: ValidationWarning[];

  /** Security threats detected */
  threats: SecurityThreat[];

  /** Confidence score (0-1) */
  confidence: number;
}

export interface ValidationError {
  code: string;
  message: string;
  position?: number;
  severity: "error" | "warning";
}

export interface ValidationWarning {
  code: string;
  message: string;
  position?: number;
}

export interface SecurityThreat {
  type: "bidi-override" | "zero-width" | "homograph" | "rtl-override";
  description: string;
  position: number;
  severity: "high" | "medium" | "low";
  detected: string;  // The actual malicious character(s)
}

/**
 * String measurement result for Arabic text
 */
export interface StringMeasurement {
  /** Number of Unicode codepoints */
  codepoints: number;

  /** Number of grapheme clusters (visual characters) */
  graphemes: number;

  /** Number of base letters (excluding diacritics) */
  baseLetters: number;

  /** Number of words (whitespace-delimited) */
  words: number;

  /** Byte size in UTF-8 encoding */
  byteSize: number;
}
```

### Task List: Implementation Order

```yaml
Task 1: Setup package structure and exports
  CREATE packages/arabic-nlp/src/index.ts:
    - Main export file with barrel exports
    - Export all public APIs from modules
    - Re-export relevant types from @iraqi-ai/types

  CREATE packages/arabic-nlp/src/types/index.ts:
    - Define all interfaces listed above
    - Import and extend @iraqi-ai/types where appropriate
    - Export all types

Task 2: Create Unicode constants
  CREATE packages/arabic-nlp/src/constants/unicode-ranges.ts:
    - ARABIC_BLOCK: U+0600..U+06FF
    - ARABIC_SUPPLEMENT: U+0750..U+077F
    - ARABIC_EXTENDED_A: U+08A0..U+08FF
    - ARABIC_PRESENTATION_FORMS_A: U+FB50..U+FDFF
    - ARABIC_PRESENTATION_FORMS_B: U+FE70..U+FEFF
    - Export as typed constants

  CREATE packages/arabic-nlp/src/constants/diacritics.ts:
    - ARABIC_DIACRITICS: Array of diacritic marks U+064B..U+0652
    - TATWEEL: U+0640
    - ZERO_WIDTH_CHARS: U+200B, U+200C, U+200D, U+FEFF
    - Export as typed constants

  CREATE packages/arabic-nlp/src/constants/character-variants.ts:
    - ALEF_VARIANTS: Map<string, string> for أ, إ, آ → ا
    - YEH_VARIANTS: Map<string, string> for ي, ى → ي
    - HAH_VARIANTS: Map<string, string> for ه, ة → ه
    - Export normalization mappings

  CREATE packages/arabic-nlp/src/constants/security-patterns.ts:
    - BIDI_OVERRIDE_CHARS: U+202A..U+202E, U+2066..U+2069
    - RTL_OVERRIDE_CHAR: U+202E
    - LTR_OVERRIDE_CHAR: U+202D
    - DANGEROUS_UNICODE: Combined set of security threats
    - Export as RegExp patterns

  CREATE packages/arabic-nlp/src/constants/index.ts:
    - Barrel export all constants

Task 3: Implement normalization module
  CREATE packages/arabic-nlp/src/normalization.ts:
    - normalizeArabic(text, options?): NormalizationResult
      * Apply Unicode normalization (default NFC)
      * Remove diacritics if requested using NFD + regex
      * Normalize character variants using mapping
      * Remove tatweel if requested
      * Preserve Iraqi Kurdish characters (چ, گ, ڤ)
      * Track changes and performance

    - removeDiacritics(text): string
      * Use NFD normalization + regex /[\u064B-\u0652]/g
      * Preserve base letters and Iraqi characters
      * Return to NFC form after removal

    - normalizeCharacterVariants(text): string
      * Apply ALEF_VARIANTS mapping
      * Apply YEH_VARIANTS mapping
      * Apply HAH_VARIANTS mapping
      * Preserve semantic meaning

    - removeTatweel(text): string
      * Remove U+0640 (ـ) stretching character
      * Preserve in proper names if in middle of word
      * Handle edge cases

Task 4: Implement character utilities
  CREATE packages/arabic-nlp/src/characters.ts:
    - isArabicCharacter(char): boolean
      * Check against Unicode ranges
      * Return true for Arabic block characters

    - getCharacterInfo(char): CharacterInfo
      * Get Unicode codepoint
      * Classify character category
      * Check if Arabic, diacritic, Iraqi Kurdish
      * Return comprehensive metadata

    - isIraqiKurdishChar(char): boolean
      * Check for چ (U+0686), گ (U+06AF), ڤ (U+06A4)
      * These are distinct letters, not variants

    - isDiacritic(char): boolean
      * Check if character is combining mark
      * Use Unicode category or explicit list

    - classifyCharacter(char): CharacterCategory
      * Determine character type
      * Return typed category enum

Task 5: Implement string utilities
  CREATE packages/arabic-nlp/src/strings.ts:
    - measureString(text): StringMeasurement
      * Count codepoints: text.length
      * Count graphemes: Use Intl.Segmenter or manual
      * Count base letters: Exclude diacritics
      * Count words: Split by whitespace
      * Calculate byte size: new Blob([text]).size

    - truncateArabic(text, maxGraphemes, ellipsis?): string
      * Use grapheme counting (not codepoints)
      * Preserve complete words when possible
      * Add ellipsis (default: "...")
      * Don't break in middle of diacritic sequence

    - reverseArabic(text): string
      * Reverse grapheme clusters, not codepoints
      * Preserve diacritic attachment to base letters
      * Handle mixed content appropriately

    - compareArabicStrings(a, b, options?): number
      * Normalize both strings first
      * Use localeCompare with 'ar' locale
      * Return -1, 0, or 1

Task 6: Implement validation module
  CREATE packages/arabic-nlp/src/validation.ts:
    - validateArabicText(text): ValidationResult
      * Check for empty/whitespace-only text
      * Detect bidi override characters
      * Detect suspicious Unicode patterns
      * Validate mixed content is safe
      * Return comprehensive result with threats

    - detectBidiThreats(text): SecurityThreat[]
      * Scan for U+202A..U+202E, U+2066..U+2069
      * Report position and severity
      * Classify threat type

    - detectZeroWidthThreats(text): SecurityThreat[]
      * Scan for U+200B, U+200C, U+200D, U+FEFF
      * Multiple consecutive = likely attack
      * Report with position

    - detectHomographThreats(text): SecurityThreat[]
      * Check for suspicious character combinations
      * Mixed scripts that look identical
      * Cyrillic/Greek that look like Latin

    - isValidArabicInput(text, options?): boolean
      * Quick validation for forms
      * Check length constraints
      * Check character whitelist
      * Return boolean for fast checks

Task 7: Implement sanitization module
  CREATE packages/arabic-nlp/src/sanitization.ts:
    - sanitizeArabicInput(text, options?): string
      * Remove ALL bidi override characters
      * Remove dangerous zero-width characters
      * Normalize Unicode to NFC
      * Preserve Iraqi dialect markers
      * Return safe text for storage/display

    - stripBidiOverrides(text): string
      * Remove U+202A..U+202E, U+2066..U+2069
      * Use regex replacement
      * Return clean text

    - stripDangerousUnicode(text): string
      * Remove zero-width joiners (except legitimate use)
      * Remove control characters
      * Keep Iraqi Kurdish characters
      * Return sanitized text

    - escapeForDisplay(text): string
      * HTML-escape special characters
      * Preserve Arabic characters
      * Make safe for innerHTML

Task 8: Write comprehensive tests
  CREATE packages/arabic-nlp/src/__tests__/normalization.test.ts:
    - Test Unicode normalization (NFC, NFD)
    - Test diacritic removal
    - Test character variant normalization
    - Test tatweel removal
    - Test Iraqi character preservation
    - Test performance (<50ms for 1000 chars)

  CREATE packages/arabic-nlp/src/__tests__/characters.test.ts:
    - Test Arabic character detection
    - Test character classification
    - Test Iraqi Kurdish character detection
    - Test diacritic detection
    - Test character info retrieval

  CREATE packages/arabic-nlp/src/__tests__/strings.test.ts:
    - Test string measurement (graphemes vs codepoints)
    - Test Arabic truncation
    - Test string reversal with diacritics
    - Test string comparison with normalization

  CREATE packages/arabic-nlp/src/__tests__/validation.test.ts:
    - Test bidi attack detection
    - Test zero-width attack detection
    - Test homograph attack detection
    - Test validation error messages
    - Test threat severity classification

  CREATE packages/arabic-nlp/src/__tests__/integration.test.ts:
    - Test full workflow: sanitize → normalize → validate
    - Test mixed content processing
    - Test Iraqi dialect text end-to-end
    - Test performance with large texts

Task 9: Update package exports and build
  UPDATE packages/arabic-nlp/src/index.ts:
    - Export all modules
    - Export all types
    - Add JSDoc documentation
    - Verify no circular dependencies

  RUN bun run build:
    - Build TypeScript to dist/
    - Generate type declarations
    - Verify build succeeds

  RUN bun test:
    - Run all tests
    - Verify 95%+ coverage
    - Verify <50ms performance

Task 10: Create integration example
  CREATE apps/web/src/components/examples/ArabicTextProcessingDemo.tsx:
    - Simple component showing normalization
    - Show diacritic removal
    - Show validation with security threats
    - Interactive demo for testing
    - Import from @iraqi-ai/arabic-nlp
```

### Per-Task Pseudocode

```typescript
// Task 3: normalizeArabic implementation pattern
export function normalizeArabic(
  text: string,
  options: ArabicNormalizationOptions = {}
): NormalizationResult {
  const startTime = performance.now();
  const original = text;
  let result = text;
  let changeCount = 0;

  // STEP 1: Unicode normalization (default NFC)
  const form = options.form || "NFC";
  const normalized = result.normalize(form);
  if (normalized !== result) {
    changeCount++;
    result = normalized;
  }

  // STEP 2: Remove diacritics if requested
  if (options.removeDiacritics) {
    // Use NFD to decompose, remove combining marks, re-compose to NFC
    const nfd = result.normalize("NFD");
    const noDiacritics = nfd.replace(/[\u064B-\u0652]/g, "");
    const recomposed = noDiacritics.normalize("NFC");
    if (recomposed !== result) {
      changeCount++;
      result = recomposed;
    }
  }

  // STEP 3: Normalize character variants
  if (options.normalizeVariants !== false) {
    let variantNormalized = result;
    // Apply ALEF variants: أ, إ, آ → ا
    for (const [variant, base] of ALEF_VARIANTS) {
      variantNormalized = variantNormalized.replace(new RegExp(variant, "g"), base);
    }
    // Apply YEH variants: ى → ي
    for (const [variant, base] of YEH_VARIANTS) {
      variantNormalized = variantNormalized.replace(new RegExp(variant, "g"), base);
    }
    if (variantNormalized !== result) {
      changeCount++;
      result = variantNormalized;
    }
  }

  // STEP 4: Remove tatweel (kashida) if requested
  if (options.removeTatweel) {
    const noTatweel = result.replace(/\u0640/g, "");
    if (noTatweel !== result) {
      changeCount++;
      result = noTatweel;
    }
  }

  // STEP 5: Remove zero-width characters if requested (default true)
  if (options.removeZeroWidth !== false) {
    const noZeroWidth = result.replace(/[\u200B\u200C\u200D\uFEFF]/g, "");
    if (noZeroWidth !== result) {
      changeCount++;
      result = noZeroWidth;
    }
  }

  // CRITICAL: Verify Iraqi Kurdish characters preserved
  // This is a sanity check - should never be removed
  if (options.preserveIraqiChars !== false) {
    // Check that count of چگڤ matches original
    const originalKurdish = (original.match(/[چگڤ]/g) || []).length;
    const resultKurdish = (result.match(/[چگڤ]/g) || []).length;
    if (originalKurdish !== resultKurdish) {
      throw new Error(`Iraqi Kurdish character lost during normalization. Original: ${originalKurdish}, Result: ${resultKurdish}`);
    }
  }

  const processingTime = performance.now() - startTime;

  return {
    text: result,
    original,
    modified: result !== original,
    changeCount,
    processingTime,
  };
}

// Task 6: validateArabicText implementation pattern
export function validateArabicText(text: string): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const threats: SecurityThreat[] = [];

  // Check 1: Empty or whitespace-only
  if (!text.trim()) {
    errors.push({
      code: "EMPTY_TEXT",
      message: "Text is empty or contains only whitespace",
      severity: "error",
    });
  }

  // Check 2: Detect bidi override attacks
  const bidiThreats = detectBidiThreats(text);
  threats.push(...bidiThreats);
  if (bidiThreats.length > 0) {
    errors.push({
      code: "BIDI_OVERRIDE_DETECTED",
      message: `Found ${bidiThreats.length} bidi override character(s) - possible Trojan Source attack`,
      severity: "error",
    });
  }

  // Check 3: Detect zero-width abuse
  const zeroWidthThreats = detectZeroWidthThreats(text);
  threats.push(...zeroWidthThreats);
  if (zeroWidthThreats.length > 0) {
    warnings.push({
      code: "ZERO_WIDTH_ABUSE",
      message: `Found ${zeroWidthThreats.length} suspicious zero-width character(s)`,
    });
  }

  // Check 4: Detect homograph attempts
  const homographThreats = detectHomographThreats(text);
  threats.push(...homographThreats);

  // Calculate confidence (0-1)
  const confidence = errors.length === 0 && threats.length === 0 ? 1.0 :
                     errors.length > 0 ? 0.0 :
                     1.0 - (threats.length * 0.1);

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    threats,
    confidence: Math.max(0, Math.min(1, confidence)),
  };
}

// Task 7: sanitizeArabicInput implementation pattern
export function sanitizeArabicInput(
  text: string,
  options: { aggressive?: boolean } = {}
): string {
  let result = text;

  // SECURITY STEP 1: Strip ALL bidi override characters (CRITICAL)
  // U+202A..U+202E: LRE, RLE, PDF, LRO, RLO
  // U+2066..U+2069: LRI, RLI, FSI, PDI
  result = result.replace(/[\u202A-\u202E\u2066-\u2069]/g, "");

  // SECURITY STEP 2: Strip dangerous zero-width characters
  // Keep U+200C (ZWNJ) and U+200D (ZWJ) as they're used legitimately in Arabic
  // But remove U+200B (ZWSP) and U+FEFF (BOM) as they're rarely legitimate
  result = result.replace(/[\u200B\uFEFF]/g, "");

  // STEP 3: Normalize to NFC (canonical composition)
  result = result.normalize("NFC");

  // STEP 4: If aggressive mode, also normalize character variants
  if (options.aggressive) {
    result = normalizeCharacterVariants(result);
  }

  // VERIFICATION: Ensure Iraqi Kurdish characters preserved
  const originalKurdish = (text.match(/[چگڤ]/g) || []).length;
  const resultKurdish = (result.match(/[چگڤ]/g) || []).length;
  if (originalKurdish !== resultKurdish) {
    // This should NEVER happen - it's a bug if it does
    console.error("CRITICAL: Iraqi Kurdish characters lost during sanitization");
  }

  return result;
}
```

### Integration Points

```yaml
PACKAGE DEPENDENCIES:
  ADD to packages/arabic-nlp/package.json:
    - "@iraqi-ai/types": "workspace:*"  # Use existing RTL types
    - "zod": "^3.22.4"                  # Already in dependencies
    - "franc": "^6.1.0"                 # Already in dependencies (language detection)

WEB APP INTEGRATION:
  UPDATE apps/web/package.json:
    - "@iraqi-ai/arabic-nlp": "workspace:*"  # Add new package

  USAGE in components:
    import { normalizeArabic, validateArabicText, sanitizeArabicInput } from "@iraqi-ai/arabic-nlp";

    // In form input handler
    const handleArabicInput = (rawText: string) => {
      // Security-first: sanitize immediately
      const clean = sanitizeArabicInput(rawText);

      // Validate for threats
      const validation = validateArabicText(clean);
      if (!validation.isValid) {
        showError(validation.errors[0].message);
        return;
      }

      // Normalize for storage
      const { text: normalized } = normalizeArabic(clean, {
        removeDiacritics: false,  // Preserve meaning
        normalizeVariants: true,  // Standardize characters
      });

      // Store normalized text
      saveToDatabase(normalized);
    };

AGENT INTEGRATION:
  arabic-rtl-processor.md will use these utilities:
    - Import from @iraqi-ai/arabic-nlp
    - Use for text preprocessing before layout processing
    - Validate all user input for security
    - Normalize text before dialect detection

TYPE SYSTEM INTEGRATION:
  packages/types/src/index.ts:
    - Re-export types from @iraqi-ai/arabic-nlp
    - Maintain single source of truth for Arabic types
```

## Validation Loop

### Level 1: Syntax & Style

```bash
# Run from packages/arabic-nlp directory
cd packages/arabic-nlp

# TypeScript type checking - MUST pass with zero errors
bun run typecheck
# Expected: No errors

# Lint checking - MUST pass
bun run lint
# Expected: No errors or warnings

# Build verification - MUST succeed
bun run build
# Expected: dist/ directory created with index.js and index.d.ts
```

### Level 2: Unit Tests

```bash
# Run all tests - MUST pass 100%
bun test

# Expected output:
# ✓ normalization.test.ts (25 tests)
# ✓ characters.test.ts (15 tests)
# ✓ strings.test.ts (12 tests)
# ✓ validation.test.ts (20 tests)
# ✓ integration.test.ts (10 tests)
# Total: 82 tests passed

# Run specific test suites
bun test --testNamePattern='normalization'
bun test --testNamePattern='security'

# Check test coverage - MUST be >95%
# (Coverage reporting may need additional setup)
```

### Level 3: Integration Tests

```typescript
// packages/arabic-nlp/src/__tests__/integration.test.ts

import { describe, test, expect } from "bun:test";
import {
  normalizeArabic,
  validateArabicText,
  sanitizeArabicInput,
  measureString,
} from "../index";

describe("Arabic Text Processing Integration", () => {
  test("Full workflow: sanitize → validate → normalize", () => {
    // Malicious input with bidi override
    const malicious = "مرحبا\u202Emalicious\u202Cبكم";

    // STEP 1: Sanitize
    const sanitized = sanitizeArabicInput(malicious);
    expect(sanitized).not.toContain("\u202E");  // Bidi override removed
    expect(sanitized).not.toContain("\u202C");  // Pop removed

    // STEP 2: Validate
    const validation = validateArabicText(sanitized);
    expect(validation.isValid).toBe(true);
    expect(validation.threats.length).toBe(0);

    // STEP 3: Normalize
    const { text, modified } = normalizeArabic(sanitized, {
      normalizeVariants: true,
      removeDiacritics: false,
    });
    expect(text).toBe("مرحباmaliciousبكم");
    expect(modified).toBe(true);
  });

  test("Iraqi dialect text preserves Kurdish characters", () => {
    const iraqiText = "چاي گرم بڤا";  // Hot tea please (Kurdish-influenced)

    const sanitized = sanitizeArabicInput(iraqiText);
    expect(sanitized).toContain("چ");
    expect(sanitized).toContain("گ");
    expect(sanitized).toContain("ڤ");

    const { text } = normalizeArabic(sanitized);
    expect(text).toContain("چ");
    expect(text).toContain("گ");
    expect(text).toContain("ڤ");
  });

  test("Performance: <50ms for 1000-character text", () => {
    const longText = "مرحبا بكم في نظام الذكاء الاصطناعي العراقي ".repeat(30);
    expect(longText.length).toBeGreaterThan(1000);

    const start = performance.now();
    const { text } = normalizeArabic(longText);
    const elapsed = performance.now() - start;

    expect(elapsed).toBeLessThan(50);
    expect(text.length).toBeGreaterThan(0);
  });

  test("Mixed Arabic-English content handling", () => {
    const mixed = "Name: أحمد محمد, Email: ahmed@example.com, Phone: +964 123 456";

    const sanitized = sanitizeArabicInput(mixed);
    const validation = validateArabicText(sanitized);
    expect(validation.isValid).toBe(true);

    const measurement = measureString(sanitized);
    expect(measurement.graphemes).toBeLessThan(measurement.codepoints);
  });
});
```

### Level 4: Real-World Usage Test

```bash
# Start web app
cd apps/web
bun run dev

# Test in browser:
# 1. Open http://localhost:3000/examples/arabic-processing
# 2. Type Arabic text with diacritics: "مُحَمَّد"
# 3. Verify normalization removes diacritics: "محمد"
# 4. Type Iraqi dialect: "شلونك اليوم؟"
# 5. Verify Kurdish characters preserved: "چاي گرم"
# 6. Attempt bidi attack (paste from test): "test\u202Emalicious"
# 7. Verify threat detected and blocked

# Expected: All security checks pass, processing <50ms visible in dev tools
```

## Final Validation Checklist

- [ ] All tests pass: `bun test` in packages/arabic-nlp
- [ ] No type errors: `bun run typecheck` passes
- [ ] No lint errors: `bun run lint` passes
- [ ] Build succeeds: `dist/` contains index.js and index.d.ts
- [ ] Performance verified: <50ms for 1000-char texts
- [ ] Security validated: 100% bidi attack prevention
- [ ] Iraqi characters preserved: 100% retention of چگڤ
- [ ] Integration works: Can import from @iraqi-ai/arabic-nlp in web app
- [ ] Documentation complete: All public functions have JSDoc
- [ ] Example component works: ArabicTextProcessingDemo.tsx renders

## Anti-Patterns to Avoid

- ❌ Don't remove Iraqi Kurdish characters (چ, گ, ڤ) during normalization
- ❌ Don't use String.length for Arabic text measurement (use grapheme counting)
- ❌ Don't trust user input - ALWAYS sanitize before processing
- ❌ Don't use jest/vitest - this is a Bun project, use bun:test
- ❌ Don't duplicate RTL layout utilities from apps/web/src/lib/utils/rtl.ts
- ❌ Don't use "arabic" library - we build our own with Iraqi support
- ❌ Don't normalize to NFD for storage (use NFC)
- ❌ Don't skip bidi override detection - it's a critical security requirement
- ❌ Don't remove all zero-width characters (some are legitimate in Arabic)
- ❌ Don't process text without performance measurement during development

---

## Research References Summary

**Unicode & Normalization:**
- MDN String.normalize(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
- Unicode Arabic Block: https://unicode.org/charts/PDF/U0600.pdf
- Unicode TR15 (Normalization): https://unicode.org/reports/tr15/

**Security:**
- BiDi Swap Attack (2025): https://securityonline.info/bidi-swap-a-decade-old-unicode-flaw-still-enables-url-spoofing/
- Trojan Source Bug: https://krebsonsecurity.com/2021/11/trojan-source-bug-threatens-the-security-of-all-code/

**Arabic Processing:**
- Arabic Diacritics Removal: https://stackoverflow.com/questions/5224267/javascriptremove-arabic-text-diacritic-dynamically
- Arabic Character Normalization: https://medium.com/@kashmiry/datatables-arabic-search-normalization-575949b0453c

**Existing Code:**
- packages/types/src/rtl.ts - Type definitions
- apps/web/src/lib/utils/rtl.ts - Layout utilities
- apps/api/tests/arabic/test_arabic_processing.py - Expected behavior

---

## PRP Confidence Score: 9/10

**Confidence Justification:**

**Strengths (+9):**
- ✅ Clear separation from existing RTL utilities (no duplication)
- ✅ Comprehensive security considerations (bidi attacks, zero-width abuse)
- ✅ Detailed implementation pseudocode for critical functions
- ✅ Performance requirements specified (<50ms for 1000 chars)
- ✅ Iraqi cultural preservation explicitly called out (Kurdish characters)
- ✅ Complete test strategy with integration tests
- ✅ Real-world usage examples in implementation patterns
- ✅ Security-first approach (sanitize → validate → normalize)
- ✅ All necessary Unicode ranges and constants defined

**Minor Risks (-1):**
- Intl.Segmenter API for grapheme counting may need polyfill for older browsers
- franc library behavior with Iraqi dialect may need fine-tuning
- Performance optimization may require iteration for very large texts

**Mitigation:**
- Provide fallback grapheme counting without Intl.Segmenter
- Test franc extensively with Iraqi dialect samples
- Include performance benchmarks in test suite

This PRP provides comprehensive context for one-pass implementation with high confidence. The AI agent has:
- Clear understanding of security requirements
- Specific implementation patterns with pseudocode
- Complete type definitions and constants
- Integration with existing codebase
- Validation strategy at every level
