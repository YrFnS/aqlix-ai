# @iraqi-ai/arabic-test-utils

Arabic and RTL testing utilities for the Iraqi AI Chat System. Provides comprehensive utilities for testing RTL layouts, Iraqi dialect recognition, Arabic text processing, and font rendering.

## Features

- **RTL Assertions**: Validate right-to-left layout rendering and alignment
- **Dialect Recognition**: Detect and validate Iraqi Arabic dialects (Baghdad, Basra, Mosul, Kurdish)
- **Text Processing**: Arabic text normalization, validation, and processing utilities
- **Font Rendering**: Validate Arabic font loading and rendering quality

## Installation

```bash
bun add @iraqi-ai/arabic-test-utils
```

## Usage

### RTL Assertions

```typescript
import {
  assertRTLLayout,
  assertTextDirection,
  assertRTLAlignment,
} from "@iraqi-ai/arabic-test-utils/rtl-assertions";

// Assert element has RTL layout
await assertRTLLayout(element);

// Assert text direction is RTL
assertTextDirection(element, "rtl");

// Assert element is right-aligned
assertRTLAlignment(element, "right");
```

### Dialect Recognition

```typescript
import {
  detectDialect,
  validateDialect,
  getDialectPatterns,
} from "@iraqi-ai/arabic-test-utils/dialect-recognition";

// Detect Iraqi dialect from text
const dialect = detectDialect("شلونك اليوم؟");
console.log(dialect); // "baghdad"

// Validate dialect with threshold
const isValid = validateDialect("شخبارك؟", "basra", 0.85);
console.log(isValid); // true

// Get dialect-specific patterns
const patterns = getDialectPatterns("mosul");
```

### Text Processing

```typescript
import {
  normalizeArabicText,
  validateArabicText,
  extractArabicWords,
} from "@iraqi-ai/arabic-test-utils/text-processing";

// Normalize Arabic text (remove diacritics, normalize forms)
const normalized = normalizeArabicText("مَرْحَباً");
console.log(normalized); // "مرحبا"

// Validate Arabic text structure
const isValid = validateArabicText("السلام عليكم");
console.log(isValid); // true

// Extract Arabic words from mixed content
const words = extractArabicWords("Hello مرحبا World");
console.log(words); // ["مرحبا"]
```

### Font Rendering

```typescript
import {
  assertFontLoaded,
  validateFontRendering,
  getFontMetrics,
} from "@iraqi-ai/arabic-test-utils/font-rendering";

// Assert Arabic font is loaded
await assertFontLoaded("Noto Sans Arabic");

// Validate font renders Arabic correctly
await validateFontRendering(element, {
  minCharacterWidth: 10,
  maxCharacterWidth: 50,
  expectedFont: "Noto Sans Arabic",
});

// Get font metrics for validation
const metrics = await getFontMetrics(element);
console.log(metrics); // { fontFamily: "...", fontSize: "...", lineHeight: "..." }
```

## Testing Thresholds

- **RTL Accuracy**: 99%+ layout correctness required
- **Dialect Recognition**: 85%+ confidence threshold
- **Font Rendering**: 95%+ visual accuracy
- **Text Processing**: 100% Unicode correctness

## License

MIT
