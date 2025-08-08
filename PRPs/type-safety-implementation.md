name: "Type Safety Implementation PRP - Iraqi AI Chat System"
description: |

## Purpose
Comprehensive PRP for implementing type safety across the Iraqi AI Chat System with TypeScript strict mode, Arabic text handling, Iraqi professional domain types, and cross-platform compatibility for web and mobile applications.

## Core Principles
1. **Zero TypeScript Errors**: Strict mode with comprehensive type coverage
2. **Cultural Context Types**: Iraqi professional domains with Islamic compliance
3. **Arabic Text Safety**: RTL-aware types with dialect recognition
4. **Cross-Platform Consistency**: Shared types between Next.js and React Native
5. **Runtime Validation**: Zod schemas matching Pydantic backend models
6. **Performance Optimization**: Type validation without sacrificing speed

---

## Goal
Build a comprehensive type safety system for the Iraqi AI Chat System that ensures:
- 100% TypeScript strict mode compliance across monorepo
- Type-safe Arabic text handling with RTL and dialect support
- Cultural validation types for Iraqi professional domains
- Cross-platform type compatibility (Next.js web + React Native mobile)
- Runtime validation alignment between Zod (frontend) and Pydantic (backend)
- Supabase database type generation with Arabic column support

## Why
- **Quality Assurance**: Prevent runtime errors through compile-time type checking
- **Cultural Compliance**: Ensure Iraqi cultural appropriateness through type safety
- **Developer Experience**: Enhanced IDE support and refactoring confidence
- **Cross-Platform Consistency**: Single source of truth for types across platforms
- **Integration Safety**: Type-safe communication between frontend, backend, and database
- **Arabic Text Handling**: Proper validation and processing of Arabic content with RTL support

## What
### User-Visible Benefits
- Faster development with better IDE autocomplete and error detection
- More reliable Arabic text processing with proper RTL handling
- Consistent cultural validation across all application layers
- Seamless cross-platform experience with shared business logic types

### Technical Requirements
- TypeScript strict mode configuration across monorepo
- Zod schema validation for all user inputs and API boundaries
- Pydantic model integration with TypeScript type generation
- Supabase type generation with Arabic text column support
- Cross-platform type sharing between Next.js and React Native
- Cultural validation types extending existing Iraqi domain patterns

### Success Criteria
- [ ] Zero TypeScript compilation errors across all packages
- [ ] 100% type coverage for Arabic text handling and RTL components  
- [ ] Cultural validation types with ≥95% accuracy against existing Python patterns
- [ ] Cross-platform type imports working in both Next.js and React Native
- [ ] Zod schemas matching Pydantic models with automated synchronization
- [ ] Supabase database operations fully typed with Arabic column support
- [ ] Performance benchmarks showing <10ms overhead for type validation

## All Needed Context

### Documentation & References (MUST READ)
```yaml
# TypeScript Strict Mode & Monorepo Configuration
- url: https://www.totaltypescript.com/tsconfig-cheat-sheet
  why: Latest TypeScript strict mode configuration best practices
  critical: noUncheckedIndexedAccess and project references setup

- url: https://earthly.dev/blog/setup-typescript-monorepo/
  why: 2024 monorepo configuration patterns with workspaces
  critical: TypeScript project references for large-scale projects

- url: https://colinhacks.com/essays/live-types-typescript-monorepo
  why: Live types approach for monorepo development experience
  critical: Performance considerations for type checking

# Zod Schema Validation
- url: https://zod.dev/
  why: Official Zod documentation for schema validation patterns
  critical: String validation methods and Unicode handling

- url: https://blog.logrocket.com/schema-validation-typescript-zod/
  why: Complete guide to Zod validation with TypeScript integration
  critical: Custom refinements for complex validation logic

- url: https://github.com/aiji42/zod-i18n
  why: Internationalization support for Arabic error messages
  critical: Arabic translation patterns for validation errors

# Pydantic TypeScript Integration  
- url: https://github.com/phillipdupuis/pydantic-to-typescript
  why: Direct Pydantic to TypeScript model conversion
  critical: CLI tool for automated type generation

- url: https://docs.pydantic.dev/fastui/
  why: Official Pydantic TypeScript interface matching
  critical: Guaranteed schema synchronization approach

- url: https://fastapi.tiangolo.com/advanced/generate-clients/
  why: OpenAPI-based TypeScript client generation from FastAPI
  critical: Automated API client with type safety

# Supabase TypeScript Types
- url: https://supabase.com/docs/guides/api/rest/generating-types
  why: Official Supabase TypeScript type generation guide
  critical: Database schema to TypeScript type conversion

- url: https://supabase.com/docs/reference/javascript/typescript-support
  why: TypeScript support for Supabase JavaScript client
  critical: Client configuration with generated types

# Arabic Text & RTL Handling
- url: https://rtlstyling.com/posts/rtl-styling/
  why: Comprehensive RTL styling and text direction handling
  critical: Bidirectional text processing considerations

- url: https://www.w3.org/International/questions/qa-html-dir
  why: W3C standards for RTL text markup and direction
  critical: Proper HTML structure for Arabic content

# Cross-Platform Type Sharing
- url: https://medium.com/@cecylia.borek/setting-up-a-monorepo-using-npm-workspaces-and-typescript-project-references-307841e0ba4a
  why: TypeScript project references for monorepo package sharing
  critical: Shared package configuration for React Native and Next.js

# Existing Codebase Patterns
- file: examples/autogen-extracted/core/iraqi_enhancements/cultural_validator.py
  why: Existing cultural validation logic with enums and dataclasses
  critical: CulturalCompliance, ProfessionalDomain types and validation patterns

- file: examples/rtl-support/arabic-components.tsx  
  why: Existing Arabic RTL component type patterns
  critical: ArabicTextProps, MixedContentProps interface patterns

- file: examples/dyad-extracted/components/ui/button.tsx
  why: Advanced TypeScript component patterns with variants
  critical: VariantProps pattern and className composition
```

### Current Codebase Tree (Key Areas)
```bash
aqlix-ai/
├── examples/                               # Reference implementations
│   ├── dyad-extracted/components/ui/       # 44 TypeScript UI components  
│   ├── rtl-support/arabic-components.tsx   # Arabic RTL component patterns
│   └── autogen-extracted/core/iraqi_enhancements/  # Cultural validation logic
├── initial/05_type_safety.md              # Feature requirements
└── PRPs/templates/                         # PRP templates and patterns
```

### Desired Codebase Tree (Post-Implementation)
```bash
aqlix-ai/
├── tsconfig.json                           # Root strict mode configuration
├── packages/
│   ├── types/                             # Shared TypeScript types
│   │   ├── cultural/                      # Iraqi cultural domain types
│   │   ├── arabic/                        # Arabic text and RTL types  
│   │   ├── professional/                  # Professional domain interfaces
│   │   └── database/                      # Generated Supabase types
│   ├── validation/                        # Zod schemas
│   │   ├── cultural-schemas.ts            # Cultural validation schemas
│   │   ├── arabic-text-schemas.ts         # Arabic text validation
│   │   └── professional-schemas.ts        # Professional domain validation
│   └── ui/                                # Typed UI components
├── apps/
│   ├── web/                              # Next.js with strict TypeScript
│   └── mobile/                           # React Native with shared types
└── backend/
    └── models/                           # Pydantic models for type generation
```

### Known Gotchas & Library Quirks
```typescript
// CRITICAL: Arabic text Unicode normalization
// Zod schemas must normalize Arabic text before validation
const arabicTextSchema = z.string()
  .transform(text => text.normalize('NFKC'))
  .refine(text => /[\u0600-\u06FF]/.test(text), 'Must contain Arabic characters');

// CRITICAL: TypeScript path resolution in monorepo
// Use project references, not just path mapping for performance
// paths configuration gets overridden by local tsconfig files

// CRITICAL: Cross-platform type sharing
// React Native requires metro resolver configuration for monorepo packages
// Next.js requires transpilePackages configuration for shared packages

// CRITICAL: Pydantic v2 vs Zod alignment
// Pydantic uses snake_case, TypeScript conventionally uses camelCase
// Need transformation layer or consistent naming convention

// CRITICAL: Supabase type generation edge cases
// Generated types may not include custom Arabic text validation
// Enum synchronization between database and TypeScript requires manual alignment

// CRITICAL: RTL text direction type safety
// CSS direction and HTML dir attributes must be type-safe
// BiDi text requires special handling for mixed Arabic-English content
```

## Implementation Blueprint

### Data Models and Structure

Create comprehensive type system ensuring cultural appropriateness and Arabic text safety:

```typescript
// Core cultural types extending existing patterns
enum CulturalCompliance {
  COMPLIANT = "compliant",
  QUESTIONABLE = "questionable", 
  NON_COMPLIANT = "non_compliant",
  REQUIRES_REVIEW = "requires_review"
}

enum ProfessionalDomain {
  LEGAL = "legal",
  MEDICAL = "medical", 
  EDUCATIONAL = "educational",
  GOVERNMENT = "government",
  BUSINESS = "business",
  ENGINEERING = "engineering",
  RELIGIOUS = "religious",
  GENERAL = "general"
}

// Arabic text types with RTL support
interface ArabicTextProps {
  content: string;
  direction: 'rtl' | 'ltr' | 'auto';
  dialect: 'iraqi' | 'standard' | 'mixed';
  validation: CulturalCompliance;
}

// Professional validation result types
interface CulturalValidationResult {
  complianceLevel: CulturalCompliance;
  domain: ProfessionalDomain;
  issues: string[];
  recommendations: string[];
  confidenceScore: number;
  requiresHumanReview: boolean;
}
```

### List of Tasks (Implementation Order)

```yaml
Task 1 - TypeScript Strict Mode Setup:
  CREATE tsconfig.json:
    - ENABLE strict: true, noUncheckedIndexedAccess: true, noImplicitOverride: true
    - CONFIGURE project references for monorepo packages
    - SETUP path mapping for @iraqi-ai/* packages
    - MIRROR patterns from: existing dyad-extracted component patterns

  CREATE packages/tsconfig.base.json:
    - DEFINE shared TypeScript configuration
    - CONFIGURE cross-platform compatibility settings
    - PRESERVE existing Arabic component type patterns

Task 2 - Core Iraqi Cultural Types:
  CREATE packages/types/cultural/index.ts:
    - MIGRATE CulturalCompliance enum from Python patterns
    - MIRROR ProfessionalDomain structure from cultural_validator.py
    - PRESERVE existing validation logic patterns
    - ADD TypeScript-specific enhancements

  CREATE packages/types/arabic/index.ts:
    - EXTRACT patterns from: examples/rtl-support/arabic-components.tsx
    - ENHANCE ArabicTextProps with cultural validation
    - ADD dialect recognition type support
    - IMPLEMENT BiDi text type safety

Task 3 - Zod Schema Implementation:
  CREATE packages/validation/cultural-schemas.ts:
    - MIRROR validation logic from: cultural_validator.py
    - IMPLEMENT Zod schemas matching Python validators
    - ADD Arabic text Unicode normalization
    - PRESERVE cultural sensitivity patterns

  CREATE packages/validation/arabic-text-schemas.ts:
    - IMPLEMENT RTL text validation schemas
    - ADD Iraqi dialect recognition validation
    - CREATE mixed Arabic-English content schemas
    - ENSURE performance optimization for real-time validation

Task 4 - Supabase Type Generation:
  CONFIGURE supabase gen types:
    - RUN: npx supabase gen types typescript --project-id "$PROJECT_REF" > packages/types/database/index.ts
    - VALIDATE Arabic column type handling
    - INTEGRATE cultural validation types
    - TEST cross-platform compatibility

Task 5 - Pydantic Model Integration:
  CREATE backend/models/cultural_models.py:
    - MIRROR TypeScript types in Pydantic models
    - ENSURE snake_case to camelCase transformation
    - IMPLEMENT validation alignment with Zod schemas
    - ADD automated type generation pipeline

  CONFIGURE pydantic-to-typescript:
    - INSTALL: pip install pydantic-to-typescript
    - RUN: pydantic2ts --module backend.models --output packages/types/api/
    - VALIDATE type synchronization accuracy

Task 6 - Cross-Platform Type Setup:
  CONFIGURE apps/web/next.config.js:
    - ADD transpilePackages: ['@iraqi-ai/types', '@iraqi-ai/validation']
    - CONFIGURE TypeScript path resolution
    - ENSURE Arabic font loading type safety

  CONFIGURE apps/mobile/metro.config.js:
    - ADD monorepo package resolution
    - CONFIGURE TypeScript integration
    - VALIDATE React Native compatibility

Task 7 - Component Type Integration:
  MODIFY existing UI components:
    - UPDATE components to use new cultural validation types
    - ENHANCE Arabic components with strict typing
    - INTEGRATE professional domain type checking
    - PRESERVE existing functionality patterns

Task 8 - Comprehensive Testing:
  CREATE tests/types/cultural-validation.test.ts:
    - TEST all cultural compliance scenarios
    - VALIDATE Arabic text processing accuracy
    - ENSURE cross-platform type compatibility
    - BENCHMARK validation performance
```

### Per Task Pseudocode

```typescript
// Task 1 - TypeScript Configuration
// PATTERN: Use project references for monorepo performance
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "composite": true,
    "baseUrl": ".",
    "paths": {
      "@iraqi-ai/*": ["packages/*/src"]
    }
  },
  "references": [
    { "path": "./packages/types" },
    { "path": "./packages/validation" }
  ]
}

// Task 3 - Zod Schema Implementation  
// PATTERN: Mirror existing Python validation logic
const culturalContentSchema = z.object({
  content: z.string()
    .transform(text => text.normalize('NFKC'))
    .refine(validateIraqiCulturalContent),
  domain: z.nativeEnum(ProfessionalDomain),
  compliance: z.nativeEnum(CulturalCompliance)
})
.refine(data => validateCulturalCompliance(data), {
  message: "Content does not meet Iraqi cultural standards"
});

// Task 5 - Pydantic Integration
// CRITICAL: Maintain type synchronization
class CulturalValidationModel(BaseModel):
    compliance_level: CulturalComplianceEnum
    domain: ProfessionalDomainEnum
    confidence_score: float = Field(ge=0.0, le=1.0)
    
    class Config:
        # Ensure camelCase for TypeScript compatibility
        alias_generator = to_camel_case
```

### Integration Points
```yaml
DATABASE:
  - migration: "Add cultural_compliance_level column with Arabic text support"
  - types: "Generate Supabase types with Arabic column validation"
  
CONFIG:
  - add to: packages/types/config/index.ts
  - pattern: "Cultural validation settings with TypeScript strict typing"
  
API:
  - validation: "Zod schemas aligned with Pydantic models"
  - endpoints: "Type-safe API client with cultural validation"
```

## Validation Loop

### Level 1: TypeScript Compilation & Linting
```bash
# Run strict TypeScript compilation across monorepo
npx tsc --noEmit --strict --project tsconfig.json

# Validate all packages compile successfully  
npx tsc --build --verbose

# Expected: Zero TypeScript errors, proper path resolution
```

### Level 2: Zod Schema Validation Testing
```typescript
// CREATE tests/validation/cultural-schemas.test.ts
describe('Cultural Validation Schemas', () => {
  test('validates Iraqi Arabic text', () => {
    const validArabicText = 'مرحباً، شلونك اليوم؟';
    const result = arabicTextSchema.parse(validArabicText);
    expect(result).toBe(validArabicText);
  });

  test('rejects culturally inappropriate content', () => {
    const inappropriateContent = 'content with prohibited terms';
    expect(() => culturalContentSchema.parse({
      content: inappropriateContent,
      domain: ProfessionalDomain.GENERAL,
      compliance: CulturalCompliance.COMPLIANT
    })).toThrow();
  });

  test('validates professional domain types', () => {
    const legalContent = {
      content: 'شريعة إسلامية متوافقة',
      domain: ProfessionalDomain.LEGAL,
      compliance: CulturalCompliance.COMPLIANT
    };
    const result = culturalContentSchema.parse(legalContent);
    expect(result.domain).toBe(ProfessionalDomain.LEGAL);
  });
});
```

```bash
# Run validation tests
npm test tests/validation/

# Expected: All cultural validation tests pass
```

### Level 3: Cross-Platform Integration Test
```bash
# Test Next.js compilation with shared types
cd apps/web && npm run build

# Test React Native Metro bundler with shared types
cd apps/mobile && npm run android

# Test Supabase type generation
npx supabase gen types typescript --check

# Expected: All platforms compile successfully with shared types
```

### Level 4: Cultural Compliance & Performance Test
```bash
# Run cultural validation accuracy tests
npm run test:cultural

# Run Arabic text processing benchmarks
npm run test:arabic-performance

# Validate type checking performance
npm run benchmark:types

# Expected: ≥95% cultural accuracy, <10ms validation overhead
```

## Final Validation Checklist
- [ ] Zero TypeScript compilation errors: `npx tsc --noEmit --strict`
- [ ] All cultural validation tests pass: `npm run test:cultural`
- [ ] Arabic text processing accuracy ≥95%: `npm run test:arabic`
- [ ] Cross-platform compatibility verified: Next.js + React Native builds
- [ ] Zod-Pydantic schema alignment validated
- [ ] Supabase type generation includes Arabic columns
- [ ] Performance benchmarks meet requirements (<10ms validation)
- [ ] Cultural compliance types match existing Python patterns
- [ ] Professional domain types cover all Iraqi expertise areas

---

## Anti-Patterns to Avoid
- ❌ Don't use `any` types - maintain strict typing throughout
- ❌ Don't skip Unicode normalization for Arabic text validation
- ❌ Don't ignore cultural validation in favor of technical validation only
- ❌ Don't create separate type systems for web/mobile - use shared packages
- ❌ Don't hardcode cultural validation rules - use extensible enum patterns
- ❌ Don't sacrifice performance for comprehensive typing - benchmark regularly
- ❌ Don't break existing cultural validation accuracy when adding TypeScript types

---

**PRP Quality Score: 8/10**

This comprehensive PRP provides extensive context, clear validation loops, and addresses all requirements for implementing type safety in the Iraqi AI Chat System. The implementation follows established patterns from the existing codebase while introducing modern TypeScript best practices for 2024.