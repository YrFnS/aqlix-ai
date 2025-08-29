# TypeScript Foundation Setup for Iraqi AI Chat System

## Goal
Set up comprehensive TypeScript foundation for the Iraqi AI Chat System workspace that provides strict type safety, efficient compilation with Bun native TypeScript support, and proper module resolution across all applications and packages in a monorepo structure.

## Why
- **Type Safety**: Strict TypeScript configuration prevents runtime errors and provides robust type checking across the entire Iraqi AI system
- **Developer Experience**: Enables powerful IntelliSense, error reporting, and refactoring capabilities with proper path mapping
- **Build Performance**: Leverages Bun's native TypeScript execution for fast development and deployment
- **Monorepo Foundation**: Establishes the foundation for workspace packages (apps/web, apps/api, packages/ui, packages/types, etc.)
- **Scalability**: Creates extensible TypeScript configuration that supports growing workspace with new packages and applications

## What
Create a TypeScript foundation with:
- Root `tsconfig.json` with Bun-optimized configuration and strict type checking
- Base TypeScript configuration for workspace packages to extend
- Path mapping configuration for clean imports (@/ patterns and workspace packages)
- TypeScript project references for monorepo performance optimization
- Comprehensive validation scripts for type checking across the workspace
- Modern TypeScript 5.0+ features support with Bun native execution

### Success Criteria
- [ ] Root `tsconfig.json` established with strict mode and Bun optimization
- [ ] Base configurations created for apps/ and packages/ directories
- [ ] Path mapping configured for @/ internal imports and @aqlix-ai/ workspace packages
- [ ] TypeScript project references set up for efficient monorepo builds
- [ ] Validation scripts working: bun run typecheck passes across all packages
- [ ] Modern TypeScript features enabled (decorators, latest syntax, etc.)
- [ ] Example TypeScript files demonstrate working path resolution and strict types

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- url: https://bun.sh/docs/runtime/typescript
  why: Bun native TypeScript support configuration and recommended settings
  
- url: https://www.typescriptlang.org/tsconfig
  why: Complete TypeScript configuration reference for compiler options
  
- url: https://www.typescriptlang.org/docs/handbook/module-resolution.html
  why: Module resolution patterns for monorepo and path mapping
  
- url: https://www.typescriptlang.org/tsconfig/strict.html
  why: Strict mode configuration and all strict family options
  
- url: https://monorepo.tools/typescript
  why: TypeScript monorepo patterns and project references best practices
  
- file: examples/phase4-implementation-foundation/types/tsconfig.json
  why: Existing TypeScript configuration pattern in the codebase - shows extends pattern
  
- file: examples/phase4-implementation-foundation/types/package.json
  why: Shows TypeScript build scripts and dependency patterns
  
- file: examples/onlook-extracted/collaboration-engine/tsconfig.json
  why: Comprehensive TypeScript config with strict mode, path mapping, and all options
  
- file: examples/phase4-implementation-foundation/types/src/index.ts
  why: Shows .js extension imports pattern for ESM modules in TypeScript
```

### Current Codebase Tree
```bash
aqlix-ai/
├── CLAUDE.md (project rules and conventions)
├── examples/
│   └── phase4-implementation-foundation/
│       ├── types/
│       │   ├── tsconfig.json (extends ../../tsconfig.json - needs root config)
│       │   ├── tsconfig.build.json (extends ./tsconfig.json with build settings)
│       │   ├── package.json (uses bun for builds, has typecheck script)
│       │   └── src/ (TypeScript source files with .js imports)
│       └── cultural-engine/
│           ├── tsconfig.json (extends ../../tsconfig.json - needs root config)
│           └── package.json
├── initials/ (43 micro-initials for project features)
└── PRPs/ (Product Requirement Prompts)
```

### Desired Codebase Tree with Files to Add
```bash
aqlix-ai/
├── tsconfig.json (ROOT BASE CONFIG - strict Bun-optimized setup)
├── tsconfig.base.json (SHARED CONFIG - common settings for packages)
├── apps/
│   ├── tsconfig.json (apps-specific base config)
│   ├── web/
│   │   └── tsconfig.json (extends ../tsconfig.json)
│   └── api/
│       └── tsconfig.json (extends ../tsconfig.json)
└── packages/
    ├── tsconfig.json (packages-specific base config)
    ├── ui/
    │   └── tsconfig.json (extends ../tsconfig.json)
    ├── types/
    │   ├── tsconfig.json (updated to extend ../../packages/tsconfig.json)
    │   └── tsconfig.build.json (stays the same)
    └── supabase-client/
        └── tsconfig.json (extends ../tsconfig.json)
```

### Known Gotchas & Library Quirks
```typescript
// CRITICAL: Bun requires specific module settings for optimal performance
// Use "module": "Preserve" instead of "ES2022" for Bun native execution
// Use "moduleResolution": "bundler" instead of "Node" for modern bundlers

// CRITICAL: TypeScript 5.0+ in monorepos - avoid path aliases, use project references
// Path aliases don't improve performance and can cause build issues
// Use workspace packages and project references instead

// CRITICAL: Import extensions in TypeScript for ESM
// Use .js extensions in imports even in .ts files when targeting ESM
import { something } from './module.js'; // Correct for ESM output
import { something } from './module'; // Incorrect, may cause resolution issues

// CRITICAL: Strict mode configuration
// Enable all strict family options for Iraqi AI system type safety requirements
// These prevent cultural validation and Arabic processing runtime errors

// GOTCHA: Bun workspace integration
// Bun workspaces require proper package.json setup in each directory
// TypeScript project references must align with workspace structure
```

## Implementation Blueprint

### Core TypeScript Foundation Structure
```bash
# ROOT CONFIG HIERARCHY:
tsconfig.json              # Base Bun-optimized config
├── tsconfig.base.json     # Shared settings for packages
├── apps/tsconfig.json     # App-specific base
└── packages/tsconfig.json # Package-specific base

# PACKAGE CONFIGS (extend appropriate base):
apps/web/tsconfig.json     # Next.js app config
apps/api/tsconfig.json     # FastAPI Python integration
packages/ui/tsconfig.json  # UI components
packages/types/tsconfig.json # Type definitions
```

### List of Tasks to Complete the PRP
```yaml
Task 1: Create Root TypeScript Configuration
CREATE tsconfig.json:
  - USE Bun-recommended configuration as base
  - ENABLE strict mode with all type safety options
  - SET path mapping for workspace packages
  - CONFIGURE for ESM module system

Task 2: Create Shared Base Configuration
CREATE tsconfig.base.json:
  - DEFINE common compiler options for packages
  - SET shared path mappings (@/ patterns)
  - CONFIGURE build and output settings
  - ENABLE project reference support

Task 3: Create Directory-Specific Configurations
CREATE apps/tsconfig.json:
  - EXTEND root tsconfig.json
  - ADD app-specific paths and settings
  - CONFIGURE for Next.js and frontend needs

CREATE packages/tsconfig.json:
  - EXTEND tsconfig.base.json
  - ADD package-specific build settings
  - CONFIGURE for library compilation

Task 4: Update Existing Package Configurations
MODIFY examples/phase4-implementation-foundation/types/tsconfig.json:
  - CHANGE extends path to "../../packages/tsconfig.json"
  - PRESERVE existing outDir and rootDir settings
  - ENSURE compatibility with existing build scripts

MODIFY examples/phase4-implementation-foundation/cultural-engine/tsconfig.json:
  - CHANGE extends path to "../../packages/tsconfig.json"
  - PRESERVE existing settings
  - ENSURE build compatibility

Task 5: Create Workspace Package Configs
CREATE packages/ui/tsconfig.json:
  - EXTEND ../tsconfig.json
  - CONFIGURE for React component compilation
  - ENABLE JSX processing

CREATE packages/supabase-client/tsconfig.json:
  - EXTEND ../tsconfig.json
  - CONFIGURE for database client compilation
  - ENABLE strict null checks for database operations

Task 6: Add Validation Scripts
MODIFY package.json (root):
  - ADD "typecheck": "bun run --bun tsc --noEmit"
  - ADD "typecheck:packages": script for package validation
  - ADD "typecheck:apps": script for app validation

CREATE scripts/typecheck-all.ts:
  - IMPLEMENT workspace-wide type checking
  - VALIDATE all packages and apps
  - REPORT type errors with clear messages

Task 7: Create Type Validation Examples
CREATE examples/typescript-validation/strict-types.ts:
  - DEMONSTRATE strict mode features
  - SHOW path mapping usage
  - VALIDATE cultural/Arabic type safety patterns

CREATE examples/typescript-validation/workspace-imports.ts:
  - SHOW @aqlix-ai/ package imports
  - DEMONSTRATE proper module resolution
  - VALIDATE cross-package type checking
```

### Implementation Pseudocode

#### Task 1: Root tsconfig.json
```json
{
  "compilerOptions": {
    // Bun-optimized settings
    "target": "ESNext",
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    "module": "Preserve",  // Bun recommendation
    "moduleResolution": "bundler", // Modern bundler support
    
    // Strict type checking (Iraqi AI safety requirements)
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    
    // Path mapping for workspace
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@aqlix-ai/types": ["./packages/types/src"],
      "@aqlix-ai/ui": ["./packages/ui/src"],
      "@aqlix-ai/supabase-client": ["./packages/supabase-client/src"]
    },
    
    // Build settings
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    
    // Modern features
    "allowImportingTsExtensions": false, // For proper .js imports in ESM
    "jsx": "react-jsx",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  
  // Project references for monorepo
  "references": [
    { "path": "./packages/types" },
    { "path": "./packages/ui" },
    { "path": "./packages/supabase-client" },
    { "path": "./apps/web" },
    { "path": "./apps/api" }
  ]
}
```

#### Task 6: Validation Scripts Integration
```typescript
// scripts/typecheck-all.ts
import { $ } from "bun";

const packages = [
  "packages/types",
  "packages/ui", 
  "packages/supabase-client",
  "apps/web",
  "apps/api"
];

for (const pkg of packages) {
  console.log(`🔍 Type checking ${pkg}...`);
  
  try {
    await $`cd ${pkg} && bun run typecheck`.quiet();
    console.log(`✅ ${pkg} - Types OK`);
  } catch (error) {
    console.error(`❌ ${pkg} - Type errors found`);
    console.error(error.stderr.toString());
  }
}
```

### Integration Points
```yaml
PACKAGE_MANAGER:
  - integration: "Bun workspaces in package.json"
  - config: "workspaces array with apps/* and packages/*"
  - validation: "bun install resolves workspace dependencies"

BUILD_SYSTEM:
  - integration: "TypeScript project references"
  - config: "composite: true in package tsconfigs"
  - validation: "bun run build uses tsc --build"

DEVELOPMENT:
  - integration: "VS Code TypeScript IntelliSense"
  - config: "TypeScript workspace recommendations"
  - validation: "Auto-completion and error reporting works"

LINTING:
  - integration: "ESLint TypeScript parser"
  - config: "@typescript-eslint configuration"
  - validation: "Linting respects TypeScript paths"
```

## Validation Loop

### Level 1: Configuration & Syntax
```bash
# Validate TypeScript configurations
bun run --bun tsc --noEmit --project ./tsconfig.json
bun run --bun tsc --noEmit --project ./packages/types/tsconfig.json
bun run --bun tsc --noEmit --project ./apps/web/tsconfig.json

# Expected: No configuration errors, all extends paths resolve
```

### Level 2: Workspace Integration
```bash
# Test path mapping and module resolution
cd packages/types
bun run typecheck  # Should pass with no errors

cd ../ui
bun run typecheck  # Should resolve @aqlix-ai/types imports

# Test workspace-wide validation
cd ../../
bun run typecheck:all  # Custom script validates all packages
```

### Level 3: Build System Validation
```bash
# Test TypeScript project references
bun run --bun tsc --build  # Should build all referenced projects

# Test individual package builds
cd packages/types
bun run build  # Should generate .d.ts files and JS output

# Verify generated types are usable
cd ../ui
bun run typecheck  # Should see generated types from other packages
```

### Level 4: Integration Testing
```typescript
// Create test file to validate setup
// examples/typescript-validation/integration-test.ts
import type { SystemConfig } from '@aqlix-ai/types';
import { Button } from '@aqlix-ai/ui';
import { supabase } from '@aqlix-ai/supabase-client';

// Test strict type checking
const config: SystemConfig = {
  environment: 'development',
  features: {
    culturalValidation: true,
    islamicCompliance: true,
    arabicProcessing: true,
    agentCoordination: true,
    paymentProcessing: true,
    professionalDomains: true
  },
  performance: {
    culturalValidationTimeout: 200,
    arabicProcessingTimeout: 100,
    agentCoordinationTimeout: 300,
    paymentProcessingTimeout: 5000
  },
  security: {
    encryptionEnabled: true,
    auditingEnabled: true,
    culturalAuditingEnabled: true
  }
};

// Test component imports
const TestComponent = () => <Button>Iraqi AI Test</Button>;

// Test path mapping
import { validateArabicText } from '@/utils/arabic-validator';
```

```bash
# Run integration test
bun run --bun tsc --noEmit examples/typescript-validation/integration-test.ts
# Expected: No type errors, all imports resolve correctly
```

## Final Validation Checklist
- [ ] Root `tsconfig.json` created with Bun optimization and strict mode
- [ ] All package configurations extend appropriate base configs
- [ ] Path mappings resolve correctly: `@/` and `@aqlix-ai/*` imports work
- [ ] TypeScript project references build successfully: `bun run --bun tsc --build`
- [ ] Workspace type checking passes: `bun run typecheck:all`
- [ ] Individual packages type check: each `bun run typecheck` passes
- [ ] Modern TypeScript features enabled (decorators, strict options)
- [ ] Integration test demonstrates working imports and type safety
- [ ] VS Code IntelliSense and error reporting functional
- [ ] Build outputs generate proper declaration files

---

## Anti-Patterns to Avoid
- ❌ Don't use path aliases as primary module resolution - use workspace packages instead
- ❌ Don't disable strict mode for "easier development" - type safety is critical for Iraqi AI system
- ❌ Don't use CommonJS modules - stick to ESM for modern Bun support
- ❌ Don't skip project references - they're essential for monorepo performance
- ❌ Don't hardcode module paths - use configured path mappings
- ❌ Don't ignore TypeScript errors - fix them immediately for system reliability
- ❌ Don't use `any` types - leverage strict typing for cultural validation safety

## Key Implementation Notes
- **Bun Native Execution**: This foundation enables running TypeScript directly with Bun without separate compilation
- **Iraqi AI Context**: Strict typing supports cultural validation, Arabic processing, and payment gateway type safety
- **Scalability**: Configuration supports adding new workspace packages without breaking existing setups  
- **Performance**: Project references enable incremental compilation and faster builds
- **Developer Experience**: Comprehensive path mapping and IntelliSense support for productive development