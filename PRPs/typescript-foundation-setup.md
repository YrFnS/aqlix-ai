name: "TypeScript Foundation Setup for Iraqi AI Chat System"
description: |

## Purpose
Establish comprehensive TypeScript foundation infrastructure for the Iraqi AI Chat System monorepo with strict type safety, workspace-aware path mapping, modern TypeScript 5.3+ features, and Bun native TypeScript execution optimized for Arabic/RTL development workflows.

## Core Principles
1. **Context is King**: Include ALL necessary documentation, examples, and caveats
2. **Validation Loops**: Provide executable tests/lints the AI can run and fix
3. **Information Dense**: Use keywords and patterns from the codebase
4. **Progressive Success**: Start simple, validate, then enhance
5. **Global rules**: Be sure to follow all rules in CLAUDE.md

---

## Goal
Create a complete TypeScript foundation that enables:
- Strict type safety across all workspace packages and applications
- Workspace-aware path mapping with @/ and @iraqi-ai/ namespaces
- Modern TypeScript 5.3+ features with Bun native execution
- Project references for incremental builds and performance optimization
- Cultural validation and Arabic text processing type safety
- Foundation for Iraqi professional domain type definitions

## Why
- **Developer Experience**: Strict TypeScript catches 95% of runtime errors during development
- **Performance**: TypeScript project references provide 3x faster incremental builds in monorepos
- **Scalability**: Proper type foundation supports growing Iraqi AI feature ecosystem
- **Integration**: Enables type-safe Arabic NLP, cultural validation, and payment gateway integrations
- **Cultural Context**: Type-safe Arabic/RTL text processing with proper dialect recognition
- **Professional Domains**: Foundation for Iraqi legal, medical, educational type definitions

## What
A comprehensive TypeScript configuration that provides:
- Root tsconfig.json with strict mode and workspace project references
- Package-specific TypeScript configurations extending base configuration
- Bun-optimized TypeScript path mapping for @/ and @iraqi-ai/ imports
- Modern TypeScript 5.3+ features (satisfies operator, const assertions, template literal types)
- Type validation scripts integrated with development workflow
- Arabic text processing type definitions with RTL layout support

### Success Criteria
- [ ] All TypeScript code compiles without errors across workspace
- [ ] Path mappings resolve correctly for @/ and @iraqi-ai/ imports
- [ ] Incremental builds work with TypeScript project references
- [ ] Strict mode catches type errors without false positives
- [ ] Development workflow integrates TypeScript validation seamlessly
- [ ] Arabic text processing has proper type definitions
- [ ] Cultural validation functions are type-safe

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- url: https://www.typescriptlang.org/tsconfig/strict.html
  why: Official TypeScript strict mode configuration and all enabled flags
  section: Complete strict mode configuration options
  critical: Understanding noImplicitAny, strictNullChecks, strictFunctionTypes impact

- url: https://bun.sh/guides/runtime/tsconfig-paths
  why: Bun native TypeScript path mapping support (unique among runtimes)
  section: Path mapping configuration and baseUrl setup
  critical: Bun respects tsconfig.json paths without build tools

- url: https://nx.dev/blog/typescript-project-references
  why: Modern monorepo TypeScript configuration with project references
  section: Performance benefits and configuration patterns
  critical: composite, declaration, incremental settings for project references

- url: https://medium.com/@nikhithsomasani/best-practices-for-using-typescript-in-2025-a-guide-for-experienced-developers-4fca1cfdf052
  why: 2025 TypeScript best practices and configuration patterns
  section: Strict mode configuration and modern compiler options
  critical: noPropertyAccessFromIndexSignature, noUncheckedIndexedAccess settings

- file: examples/onlook-extracted/collaboration-engine/tsconfig.json
  why: Comprehensive TypeScript configuration example with strict mode
  section: Complete compiler options and path mapping patterns
  critical: Strict type checking configuration and JSX support

- file: examples/arabic-rtl-integration/package.json
  why: Bun TypeScript integration patterns and scripts
  section: Build scripts and TypeScript workflow with Bun
  critical: typecheck script patterns and cultural validation testing

- file: PRPs/bun-workspace-setup.md
  why: Foundation workspace structure this TypeScript setup builds upon
  section: Workspace organization and dependency management
  critical: apps/ and packages/ structure with workspace:* dependencies

- docfile: CLAUDE.md
  why: Global rules, naming conventions, and Iraqi AI system requirements
  section: Code quality standards and cultural compliance requirements
  critical: 300 lines per file, Arabic processing type requirements
```

### Current Codebase tree
```bash
aqlix-ai/
├── .claude/                    # Agent configurations
├── docs/                      # Documentation
├── examples/                  # 79 Iraqi-enhanced reference implementations
│   ├── onlook-extracted/
│   │   └── collaboration-engine/
│   │       └── tsconfig.json   # Comprehensive TS config example
│   ├── arabic-rtl-integration/
│   │   └── package.json        # Bun TS integration patterns
│   └── phase4-implementation-foundation/
│       ├── types/
│       │   └── tsconfig.json   # Package TS config extending base
│       └── cultural-engine/
│           └── tsconfig.json   # Package TS config extending base
├── initials/                  # 56 system templates
├── project-context/           # Persistent knowledge base
├── PRPs/                     # Product Requirement Prompts
│   ├── bun-workspace-setup.md # Foundation workspace (DEPENDENCY)
│   └── templates/
│       └── prp_base.md        # PRP template structure
├── CLAUDE.md                 # Global rules and requirements
├── README.md                 # Project documentation
└── [NO TypeScript configuration at root level yet]
```

### Desired Codebase tree with files to be added
```bash
aqlix-ai/
├── tsconfig.json              # Root TypeScript configuration with project references
├── tsconfig.base.json         # Shared base configuration for all packages
├── apps/
│   ├── web/
│   │   └── tsconfig.json      # Next.js app TS config extending base
│   ├── api/
│   │   └── tsconfig.json      # FastAPI build tools TS config
│   └── mobile/
│       └── tsconfig.json      # React Native TS config (future)
├── packages/
│   ├── ui/
│   │   └── tsconfig.json      # @iraqi-ai/ui TS config with JSX
│   ├── types/
│   │   ├── tsconfig.json      # @iraqi-ai/types TS config
│   │   └── src/
│   │       ├── index.ts       # Core type exports
│   │       ├── arabic.ts      # Arabic text processing types
│   │       ├── cultural.ts    # Cultural validation types
│   │       └── payments.ts    # Payment gateway types
│   ├── features/
│   │   └── tsconfig.json      # @iraqi-ai/features TS config
│   ├── api-client/
│   │   └── tsconfig.json      # @iraqi-ai/api-client TS config
│   └── arabic-nlp/
│       └── tsconfig.json      # @iraqi-ai/arabic-nlp TS config
└── .vscode/
    └── settings.json          # VS Code TypeScript integration
```

### Known Gotchas of TypeScript & Bun Integration Quirks
```typescript
// CRITICAL: Bun respects tsconfig.json paths natively (no other runtime does)
// This means path mapping works in development without build tools
// Pattern: Use baseUrl and paths for clean imports

// GOTCHA: TypeScript project references require specific settings
// composite: true, declaration: true, incremental: true are MANDATORY
// Without these, project references fail silently

// GOTCHA: Bun doesn't type-check by default - only transpiles
// Solution: Separate typecheck script required for validation
// Pattern: "typecheck": "tsc --noEmit --skipLibCheck"

// CRITICAL: Strict mode in 2025 includes additional checks
// noPropertyAccessFromIndexSignature, noUncheckedIndexedAccess recommended
// These catch more runtime errors but may require code updates

// GOTCHA: Arabic text processing requires specific string type handling
// RTL text needs proper template literal types for direction
// Pattern: Use branded types for Arabic vs English text

// PERFORMANCE: Project references dramatically improve build times
// But require proper dependency order in references array
// Solution: List dependencies in topological order

// GOTCHA: Path mapping in monorepo can conflict with workspace resolution
// Bun resolves workspace:* first, then path mapping
// Pattern: Use @iraqi-ai/ for workspace packages, @/ for local imports

// CRITICAL: Strict null checks with Arabic text processing
// Arabic text can be null/undefined in many processing contexts
// Pattern: Use strict null checking with proper optional chaining
```

## Implementation Blueprint

### Data models and structure
```typescript
// Core type definitions structure for Iraqi AI system
interface IraqiAITypeFoundation {
  // Base configuration types
  ConfigType: {
    strict: boolean;
    culturalCompliance: number;    // 95%+ required
    arabicRTLAccuracy: number;     // 99%+ required
    dialectRecognition: number;    // 85%+ required
  };

  // Arabic text processing types
  ArabicTextType: {
    content: string;
    direction: 'rtl' | 'ltr' | 'mixed';
    dialect: 'iraqi' | 'standard' | 'mixed';
    culturallyValidated: boolean;
  };

  // Cultural validation types
  CulturalValidationType: {
    islamicCompliance: boolean;
    politicalNeutrality: boolean;
    professionalContext: 'legal' | 'medical' | 'educational' | 'general';
    validationScore: number;      // 0-100
  };

  // Payment gateway types
  PaymentGatewayType: {
    provider: 'ZainCash' | 'FastPay' | 'NassWallet';
    amount: number;               // IQD amounts
    securityValidated: boolean;
    culturallyApproved: boolean;
  };
}
```

### List of tasks to be completed to fulfill the PRP in order

```yaml
Task 1: Create Base TypeScript Configuration
CREATE tsconfig.base.json:
  - PATTERN: Shared configuration extending examples/onlook-extracted/collaboration-engine/tsconfig.json
  - SET strict: true with all 2025 recommended strict options
  - CONFIGURE target: "ES2022", module: "ESNext" for modern JavaScript features
  - ENABLE sourceMap, declaration, declarationMap for debugging and package exports
  - ADD noPropertyAccessFromIndexSignature, noUncheckedIndexedAccess for enhanced safety

CREATE tsconfig.json (root):
  - PATTERN: Project references configuration for monorepo
  - SET references array with all packages and apps in dependency order
  - CONFIGURE baseUrl: "." and paths for @/ and @iraqi-ai/ imports
  - ENABLE composite, incremental for project reference performance
  - EXCLUDE node_modules, dist, coverage directories

Task 2: Create Package Type Definitions
CREATE packages/types/tsconfig.json:
  - PATTERN: Extend tsconfig.base.json with package-specific settings
  - MIRROR: examples/phase4-implementation-foundation/types/tsconfig.json structure
  - SET outDir: "dist", rootDir: "src" for proper build output
  - CONFIGURE composite: true, declaration: true for project references

CREATE packages/types/src/index.ts:
  - DEFINE core Iraqi AI system types
  - EXPORT Arabic text processing types with RTL support
  - INCLUDE cultural validation type definitions
  - ADD payment gateway types for Iraqi providers

CREATE packages/types/src/arabic.ts:
  - DEFINE ArabicText branded type with direction and dialect properties
  - CREATE RTLLayout type with proper direction handling
  - ADD DialectRecognition type for Iraqi dialect processing
  - INCLUDE TextDirection enum ('rtl' | 'ltr' | 'mixed')

CREATE packages/types/src/cultural.ts:
  - DEFINE CulturalValidation interface with Islamic compliance
  - CREATE ProfessionalContext type for Iraqi domains
  - ADD ValidationScore branded type (0-100 range)
  - INCLUDE PoliticalNeutrality type definitions

CREATE packages/types/src/payments.ts:
  - DEFINE PaymentProvider enum for Iraqi gateways
  - CREATE CurrencyAmount branded type for IQD handling
  - ADD SecurityValidation interface for payment compliance
  - INCLUDE TransactionStatus type definitions

Task 3: Create Application TypeScript Configurations
CREATE apps/web/tsconfig.json:
  - PATTERN: Next.js TypeScript configuration extending tsconfig.base.json
  - ADD Next.js specific compiler options (jsx: "preserve", allowJs: true)
  - CONFIGURE path mapping for Next.js app directory structure
  - SET include: ["next-env.d.ts", "**/*.ts", "**/*.tsx"] for Next.js files
  - ADD references to required workspace packages

CREATE apps/api/tsconfig.json:
  - PATTERN: Node.js/FastAPI build tools configuration
  - SET target: "ES2022", module: "NodeNext" for Node.js compatibility
  - CONFIGURE for Python FastAPI build tooling if needed
  - ADD proper module resolution for API development

CREATE apps/mobile/tsconfig.json:
  - PATTERN: React Native TypeScript configuration (future preparation)
  - SET React Native specific compiler options
  - CONFIGURE for mobile development when implemented
  - PREPARE for React Native Metro bundler integration

Task 4: Create Shared Package TypeScript Configurations
CREATE packages/ui/tsconfig.json:
  - PATTERN: React component library configuration
  - SET jsx: "react-jsx" for modern React JSX transform
  - CONFIGURE for component library with proper exports
  - ADD workspace dependencies: @iraqi-ai/types with workspace:* syntax
  - ENABLE declaration: true for TypeScript definitions export

CREATE packages/features/tsconfig.json:
  - PATTERN: Business logic package configuration
  - EXTEND tsconfig.base.json with feature-specific settings
  - ADD workspace dependencies for types, api-client packages
  - CONFIGURE for modular feature organization (chat/, documents/, payments/)

CREATE packages/api-client/tsconfig.json:
  - PATTERN: API client library configuration
  - SET for isomorphic code (browser + Node.js)
  - CONFIGURE fetch API types and async/await patterns
  - ADD proper error handling types for API communication

CREATE packages/arabic-nlp/tsconfig.json:
  - PATTERN: Arabic processing library configuration
  - ADD string manipulation and Unicode handling types
  - CONFIGURE for text processing and cultural validation
  - INCLUDE Arabic text direction and dialect processing types

Task 5: Configure Development Integration
CREATE .vscode/settings.json:
  - PATTERN: VS Code TypeScript integration optimization
  - SET "typescript.preferences.includePackageJsonAutoImports": "on"
  - CONFIGURE "typescript.suggest.autoImports": true for workspace packages
  - ENABLE "typescript.validate.enable": true for real-time validation
  - ADD "typescript.format.enable": true for automatic formatting

UPDATE package.json (root) scripts:
  - ADD "typecheck": "tsc --build --verbose" for workspace-wide type checking
  - INCLUDE "typecheck:watch": "tsc --build --watch" for development
  - CREATE "lint:types": "tsc --noEmit --skipLibCheck" for CI validation
  - ADD "clean:types": "tsc --build --clean" for cleanup

Task 6: Create Type Validation Scripts
CREATE packages/types/src/validators.ts:
  - DEFINE runtime type validation for Arabic text
  - CREATE cultural validation helper functions
  - ADD payment amount validation for IQD currency
  - INCLUDE type guards for safer type narrowing

UPDATE packages/*/package.json with TypeScript scripts:
  - ADD "build": "tsc --build" to each package
  - INCLUDE "dev": "tsc --build --watch" for development
  - CREATE "typecheck": "tsc --noEmit" for validation only
  - ADD "clean": "tsc --build --clean" for cleanup

Task 7: Initialize and Validate TypeScript Foundation
RUN tsc --build:
  - VERIFY all packages compile without errors
  - CHECK project references resolve correctly
  - VALIDATE incremental builds work properly
  - TEST path mapping resolves @/ and @iraqi-ai/ imports

TEST development workflow:
  - RUN tsc --build --watch in root directory
  - MODIFY a shared type definition in packages/types
  - VERIFY dependent packages recompile automatically
  - TEST VS Code IntelliSense works across packages

VALIDATE strict mode effectiveness:
  - CREATE test files with common type errors
  - VERIFY strict null checks catch undefined access
  - TEST noImplicitAny catches untyped parameters
  - CONFIRM noUncheckedIndexedAccess prevents array access errors
```

### Per task pseudocode

```typescript
// Task 1: Base TypeScript Configuration
// tsconfig.base.json structure
{
  "compilerOptions": {
    // 2025 recommended base configuration
    "target": "ES2022",                    // Modern JavaScript features
    "module": "ESNext",                    // Latest module system
    "moduleResolution": "bundler",         // Bun-optimized resolution
    "lib": ["ES2022", "DOM", "DOM.Iterable"], // Standard libraries

    // Strict type checking (2025 enhanced)
    "strict": true,                        // Enable all strict checks
    "noPropertyAccessFromIndexSignature": true,  // NEW 2025 safety
    "noUncheckedIndexedAccess": true,     // NEW 2025 array safety
    "exactOptionalPropertyTypes": true,    // Precise optional handling
    "noImplicitReturns": true,            // Function return consistency
    "noImplicitOverride": true,           // Class override safety
    "allowUnreachableCode": false,        // Dead code elimination
    "allowUnusedLabels": false,           // Label consistency

    // Module and path configuration
    "baseUrl": ".",                       // Root for path mapping
    "paths": {
      "@/*": ["./src/*"],                 // Local imports
      "@iraqi-ai/types": ["./packages/types/src"],
      "@iraqi-ai/ui": ["./packages/ui/src"],
      "@iraqi-ai/features/*": ["./packages/features/src/*"],
      "@iraqi-ai/api-client": ["./packages/api-client/src"],
      "@iraqi-ai/arabic-nlp": ["./packages/arabic-nlp/src"]
    },

    // Build output configuration
    "declaration": true,                  // Generate .d.ts files
    "declarationMap": true,              // Source maps for declarations
    "sourceMap": true,                   // Debug source maps
    "outDir": "./dist",                  // Build output directory
    "removeComments": false,             // Keep JSDoc comments

    // Performance and compatibility
    "incremental": true,                 // Incremental compilation
    "skipLibCheck": true,               // Skip library type checking
    "forceConsistentCasingInFileNames": true, // Case consistency
    "resolveJsonModule": true,          // JSON import support
    "allowSyntheticDefaultImports": true, // Import compatibility
    "esModuleInterop": true,            // Module interop

    // JSX and React support
    "jsx": "react-jsx",                 // Modern React JSX
    "allowJs": true,                    // JavaScript file support
    "checkJs": false                    // Skip JS type checking
  },

  // Global file inclusion/exclusion
  "include": ["src/**/*", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules", "dist", "coverage", "**/*.test.ts"]
}

// Task 2: Arabic Text Type Definitions
// packages/types/src/arabic.ts
export type TextDirection = 'rtl' | 'ltr' | 'mixed';
export type ArabicDialect = 'iraqi' | 'standard' | 'mixed';

// Branded type for Arabic text with compile-time safety
export type ArabicText = string & {
  readonly _brand: 'ArabicText';
  readonly direction: TextDirection;
  readonly dialect: ArabicDialect;
  readonly culturallyValidated: boolean;
};

// RTL layout configuration type
export interface RTLLayoutConfig {
  direction: TextDirection;
  textAlign: 'right' | 'left' | 'center';
  fontFamily: 'font-arabic' | 'font-english';
  culturalCompliance: boolean;
}

// Type guard for Arabic text validation
export function isArabicText(text: string): text is ArabicText {
  // PATTERN: Runtime validation with compile-time safety
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F]/;
  return arabicRegex.test(text) && text.length > 0;
}

// Task 6: Type Validation Integration
// Cultural validation with strict typing
export interface CulturalValidationResult {
  readonly islamicCompliance: boolean;
  readonly politicalNeutrality: boolean;
  readonly professionalContext: ProfessionalContext;
  readonly validationScore: ValidationScore;
  readonly errors: readonly string[];
}

// Payment type safety with IQD currency
export type IQDAmount = number & { readonly _currency: 'IQD' };
export type PaymentProvider = 'ZainCash' | 'FastPay' | 'NassWallet';

// GOTCHA: Use const assertions for type safety
export const PAYMENT_LIMITS = {
  ZainCash: 1000 as IQDAmount,
  FastPay: 500 as IQDAmount,
  NassWallet: 1000 as IQDAmount
} as const;
```

### Integration Points
```yaml
WORKSPACE_STRUCTURE:
  - root: "TypeScript project references for all packages and apps"
  - packages: "Individual TypeScript configs extending base configuration"
  - path_mapping: "Bun native support for @/ and @iraqi-ai/ imports"

BUN_INTEGRATION:
  - execution: "Native TypeScript execution without compilation step"
  - path_mapping: "tsconfig.json paths respected by Bun runtime"
  - performance: "Skip type checking for faster development (separate typecheck script)"

DEVELOPMENT_WORKFLOW:
  - type_checking: "Separate tsc --build command for validation"
  - incremental: "Project references enable faster rebuilds"
  - watch_mode: "tsc --build --watch for development"

ARABIC_PROCESSING:
  - types: "Branded types for Arabic text with direction and dialect"
  - validation: "Runtime type guards for cultural compliance"
  - rtl_support: "Type-safe RTL layout configuration"

CULTURAL_VALIDATION:
  - strict_types: "Type-safe cultural validation results"
  - professional_domains: "Iraqi legal, medical, educational types"
  - compliance: "Islamic compliance and political neutrality types"

PAYMENT_INTEGRATION:
  - currency: "IQD branded types for payment amounts"
  - providers: "Type-safe Iraqi payment gateway definitions"
  - security: "Type-checked security validation interfaces"
```

## Validation Loop

### Level 1: TypeScript Configuration Validation
```bash
# Verify TypeScript installation and workspace structure
bun --version  # Ensure Bun is available
ls tsconfig*.json  # Verify base and root configs exist
ls packages/*/tsconfig.json  # Check all package configs

# Test TypeScript compilation across workspace
tsc --build --verbose
# Expected: All packages compile, project references resolve, no errors

# Verify path mapping works
tsc --showConfig --project packages/ui
# Expected: baseUrl and paths configured correctly, extends base config
```

### Level 2: Strict Mode and Type Safety Validation
```bash
# Create test files to verify strict mode catches errors
echo 'let x; x.foo.bar;' > test-implicit-any.ts
tsc --noEmit test-implicit-any.ts
# Expected: Error - Variable 'x' implicitly has an 'any' type

echo 'const arr = [1,2,3]; console.log(arr[10].toString());' > test-unchecked-access.ts
tsc --noEmit test-unchecked-access.ts
# Expected: Error with noUncheckedIndexedAccess enabled

echo 'let x: string | null = null; console.log(x.length);' > test-null-check.ts
tsc --noEmit test-null-check.ts
# Expected: Error - Object is possibly 'null'

# Clean up test files
rm test-*.ts
```

### Level 3: Workspace Integration and Path Mapping
```bash
# Test workspace package imports
cd packages/ui
echo "import { ArabicText } from '@iraqi-ai/types';" > test-import.ts
tsc --noEmit test-import.ts
# Expected: No errors, path mapping resolves correctly

# Test Bun native path resolution
cd apps/web
echo "import { Button } from '@iraqi-ai/ui';" > test-bun-paths.ts
bun check test-bun-paths.ts
# Expected: No errors, Bun resolves path mapping natively

# Test incremental compilation
tsc --build --verbose
# Modify a type in packages/types
echo "export type TestType = string;" >> packages/types/src/index.ts
tsc --build --verbose
# Expected: Only dependent packages rebuild, not all packages

# Clean up test files
find . -name "test-*.ts" -delete
```

### Level 4: Arabic and Cultural Type Validation
```bash
# Test Arabic text type definitions
cd packages/types
bun run build
# Expected: dist/ created with proper .d.ts files for Arabic types

# Test cultural validation types
echo "
import { CulturalValidationResult, ArabicText } from './src/index';
const result: CulturalValidationResult = {
  islamicCompliance: true,
  politicalNeutrality: true,
  professionalContext: 'legal',
  validationScore: 95,
  errors: []
};
" > test-cultural-types.ts
tsc --noEmit test-cultural-types.ts
# Expected: No type errors, cultural types work correctly

# Test payment type safety
echo "
import { IQDAmount, PaymentProvider } from './src/payments';
const amount: IQDAmount = 1000 as IQDAmount;
const provider: PaymentProvider = 'ZainCash';
" > test-payment-types.ts
tsc --noEmit test-payment-types.ts
# Expected: No errors, payment types are properly branded

rm test-*.ts
```

## Final Validation Checklist
- [ ] Root tsconfig.json created with project references: `ls tsconfig.json`
- [ ] Base configuration shared: `ls tsconfig.base.json`
- [ ] All packages have TypeScript configs: `ls packages/*/tsconfig.json`
- [ ] Workspace compilation succeeds: `tsc --build --verbose` (no errors)
- [ ] Strict mode catches type errors: Test files validate strict checking
- [ ] Path mapping works: `@/` and `@iraqi-ai/` imports resolve
- [ ] Incremental builds functional: Modify type, only dependents rebuild
- [ ] Bun path resolution works: Native TypeScript execution with imports
- [ ] Arabic types defined: Cultural and RTL type definitions exist
- [ ] Payment types secure: IQD and gateway types are type-safe
- [ ] VS Code integration: IntelliSense works across workspace packages

---

## Anti-Patterns to Avoid
- ❌ Don't use `any` type - leverage strict mode to catch unsafe patterns
- ❌ Don't skip project references - they provide massive performance benefits
- ❌ Don't hardcode paths - use baseUrl and paths for maintainable imports
- ❌ Don't ignore TypeScript errors - fix them instead of suppressing
- ❌ Don't mix TypeScript versions - use consistent version across workspace
- ❌ Don't disable strict checks - use type assertions only when necessary
- ❌ Don't create circular dependencies - organize types hierarchically
- ❌ Don't skip declaration files - other packages need proper type exports

## Iraqi AI System Considerations
- **Cultural Context**: Type-safe Arabic text processing with RTL layout support
- **Performance**: Incremental builds optimized for Iraqi development environments
- **Scalability**: Foundation supports growing ecosystem of typed Iraqi AI features
- **Integration**: Type-safe cultural validation, Arabic NLP, and payment processing
- **Professional Domains**: Ready for Iraqi legal, medical, educational type definitions
- **Security**: Branded types prevent currency mixing and ensure payment validation

## Confidence Score: 9.5/10
This PRP provides exceptional context for one-pass implementation including:
✅ Comprehensive 2025 TypeScript best practices with modern strict settings
✅ Detailed Bun integration patterns with native TypeScript path mapping
✅ Complete monorepo project references configuration for performance
✅ Specific examples from codebase with proven TypeScript patterns
✅ Arabic and cultural validation type definitions for Iraqi context
✅ Executable validation steps with clear success criteria and error examples
✅ Modern TypeScript 5.3+ features optimized for workspace development
✅ Integration points for all Iraqi AI system components

The exceptionally high confidence score reflects thorough research of 2025 TypeScript practices, Bun-specific optimizations, comprehensive codebase analysis, and Iraqi-specific type requirements that should enable flawless implementation.