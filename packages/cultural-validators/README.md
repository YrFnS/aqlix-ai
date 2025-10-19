# @iraqi-ai/cultural-validators

Cultural validation utilities for the Iraqi AI Chat System. Provides comprehensive validation for Islamic compliance, political neutrality, and Iraqi professional domain appropriateness.

## Features

- **Islamic Compliance**: Validates content against Islamic principles and values
- **Political Neutrality**: Ensures content avoids sectarian, political, and tribal references
- **Professional Domains**: Validates content for Iraqi professional contexts (legal, medical, educational, engineering, organizational)
- **Combined Validation**: Main `validateCulturalContent` function combines all validators

## Installation

```bash
bun add @iraqi-ai/cultural-validators
```

## Usage

### Quick Start

```typescript
import { validateCulturalContent } from "@iraqi-ai/cultural-validators";

// Validate content
const result = await validateCulturalContent(
  "السلام عليكم، نحن نخدم جميع العراقيين",
);

console.log(result.score); // 0.95+ (excellent)
console.log(result.appropriate); // true
console.log(result.islamicCompliant); // true
console.log(result.politicallyNeutral); // true
```

### Islamic Compliance

```typescript
import { validateIslamicCompliance } from "@iraqi-ai/cultural-validators";

const result = await validateIslamicCompliance("السلام عليكم ورحمة الله");

console.log(result.compliant); // true
console.log(result.score); // 1.0 (perfect)
console.log(result.details.hasIslamicGreeting); // true
```

### Political Neutrality

```typescript
import { validatePoliticalNeutrality } from "@iraqi-ai/cultural-validators";

const result = await validatePoliticalNeutrality(
  "نخدم جميع العراقيين بغض النظر عن انتمائهم",
);

console.log(result.neutral); // true
console.log(result.score); // 0.95
```

### Professional Domain Validation

```typescript
import { validateProfessionalDomain } from "@iraqi-ai/cultural-validators";

const result = await validateProfessionalDomain(
  "استشارة قانونية وفقاً للقانون العراقي",
  "legal",
);

console.log(result.appropriate); // true
console.log(result.score); // 0.95
```

### Batch Validation

```typescript
import { validateBatchContent } from "@iraqi-ai/cultural-validators";

const items = ["السلام عليكم", "مرحباً بكم", "نخدم جميع العراقيين"];

const results = await validateBatchContent(items);
results.forEach((result, i) => {
  console.log(`Item ${i + 1}: Score ${result.score}`);
});
```

## Validation Thresholds

- **Cultural Compliance**: 95%+ required (configurable)
- **Islamic Compliance**: 90%+ required (configurable)
- **Political Neutrality**: Must avoid sectarian/political/tribal references
- **Professional Domain**: 85%+ domain-specific terminology

## License

MIT
