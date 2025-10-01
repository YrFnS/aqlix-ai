name: "TypeScript Foundation Setup for Iraqi AI Chat System"
description: |
  Comprehensive TypeScript configuration with Bun native support, strict type checking,
  TypeScript project references, and monorepo-aware path mapping for consistent type
  safety across all applications and packages.

---

## Goal

Set up a robust TypeScript foundation for the Iraqi AI Chat System monorepo that provides:
- Strict type safety across all workspaces
- Efficient incremental compilation via TypeScript project references
- Bun-optimized configuration for native TypeScript execution
- Clean path mapping for workspace packages (@/ and @iraqi-ai/* patterns)
- Comprehensive type validation across the entire codebase

## Why

- **Type Safety**: Catch errors at compile time, reducing runtime bugs
- **Developer Experience**: Excellent IDE autocomplete and error reporting
- **Build Performance**: Incremental compilation only rebuilds affected packages
- **Code Quality**: Enforce consistent coding standards across the monorepo
- **Scalability**: Proper foundation for adding new packages and features
- **Bun Integration**: Leverage Bun's native TypeScript support for zero-config runtime

## What

**User-visible behavior:**
- Developers get instant type checking feedback in their IDE
- Build processes fail fast with clear type errors
- Consistent import patterns across all packages
- Fast compilation and type checking

**Technical requirements:**
- Root tsconfig.base.json with strict settings
- Package-specific tsconfig.json files that extend the base
- TypeScript project references linking package dependencies
- Bun-optimized compiler options
- Path mapping for workspace packages
- Type validation scripts integrated into package.json scripts

### Success Criteria

- [ ] All packages have proper tsconfig.json configuration
- [ ] TypeScript strict mode enabled with zero errors
- [ ] Path mappings work correctly (e.g., @/types, @iraqi-ai/types)
- [ ] `bun run typecheck` runs successfully across all packages
- [ ] IDE provides accurate autocomplete and error reporting
- [ ] Incremental compilation works (only affected packages rebuild)
- [ ] No type errors in any package

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Include these in your context window
- url: https://bun.sh/docs/runtime/typescript
  why: Bun's native TypeScript support and recommended compiler options
  critical: Use "moduleResolution": "bundler" for Bun compatibility

- url: https://www.typescriptlang.org/tsconfig/
  why: Complete reference for all tsconfig.json options
  section: strict, composite, references, paths
  critical: Understanding project references and composite mode

- url: https://www.typescriptlang.org/docs/handbook/project-references.html
  why: TypeScript project references for monorepo structure
  critical: Enables incremental builds and proper dependency tracking

- url: https://bun.com/docs/install/workspaces
  why: Bun workspace configuration and workspace:* dependency syntax
  critical: Understanding how Bun resolves workspace packages

- url: https://nx.dev/blog/managing-ts-packages-in-monorepos
  why: Best practices for TypeScript in monorepos
  critical: Project references vs path aliases, composite configuration

- file: apps/web/tsconfig.json
  why: Existing Next.js TypeScript configuration with path mappings
  pattern: Shows current path mapping setup and Next.js plugin configuration

- file: packages/types/tsconfig.json
  why: Existing types package configuration
  pattern: Simple declaration-only package setup

- file: examples/phase4-implementation-foundation/types/tsconfig.json
  why: Example showing extends pattern from root tsconfig
  pattern: Shows how packages extend from root configuration

- file: examples/phase4-implementation-foundation/types/src/index.ts
  why: Example types structure with proper exports
  pattern: Shows clean type organization with separate domain files

- file: package.json
  why: Root package.json with workspace configuration
  note: TypeScript 5.3.3 already installed, workspaces defined
```

### Current Codebase Tree (relevant parts)

```bash
aqlix-ai/
├── package.json                # Root workspace config, TypeScript 5.3.3 installed
├── apps/
│   ├── web/
│   │   ├── tsconfig.json      # EXISTS - Next.js config with path mappings
│   │   └── src/
│   ├── mobile/                 # React Native (may not need TypeScript yet)
│   └── api/                    # Python FastAPI (no TypeScript needed)
├── packages/
│   ├── types/
│   │   ├── package.json       # @iraqi-ai/types
│   │   ├── tsconfig.json      # EXISTS - Basic config
│   │   └── src/
│   ├── ui/
│   │   ├── package.json       # @iraqi-ai/ui, has typecheck script
│   │   └── src/               # NO tsconfig.json yet
│   ├── api-client/
│   │   ├── package.json       # @iraqi-ai/api-client, has typecheck script
│   │   └── src/               # NO tsconfig.json yet
│   ├── arabic-nlp/
│   │   ├── package.json       # @iraqi-ai/arabic-nlp
│   │   └── src/               # NO tsconfig.json yet
│   └── features/
│       ├── package.json       # @iraqi-ai/features
│       └── src/               # NO tsconfig.json yet
├── examples/
│   └── phase4-implementation-foundation/
│       ├── tsconfig.json      # Example root config (reference)
│       ├── types/
│       │   └── tsconfig.json  # Example extends pattern
│       └── cultural-engine/
│           └── tsconfig.json  # Example extends pattern
└── test/                       # Test directory

# NO ROOT tsconfig.json or tsconfig.base.json yet - NEEDS TO BE CREATED
```

### Desired Codebase Tree with Files to be Added

```bash
aqlix-ai/
├── tsconfig.base.json         # NEW - Root base configuration (strict, Bun-optimized)
├── tsconfig.json              # NEW - Root workspace config with project references
├── apps/
│   └── web/
│       └── tsconfig.json      # UPDATE - Extend from base, keep Next.js config
├── packages/
│   ├── types/
│   │   └── tsconfig.json      # UPDATE - Extend from base, enable composite
│   ├── ui/
│   │   └── tsconfig.json      # NEW - Extend from base, reference types
│   ├── api-client/
│   │   └── tsconfig.json      # NEW - Extend from base, reference types
│   ├── arabic-nlp/
│   │   └── tsconfig.json      # NEW - Extend from base, reference types
│   └── features/
│       └── tsconfig.json      # NEW - Extend from base, reference types/ui
└── (examples remain unchanged - for reference only)
```

### Known Gotchas & Library Quirks

```typescript
// CRITICAL: Bun-specific TypeScript configuration
// Bun uses native TypeScript execution and requires specific settings:
// - "moduleResolution": "bundler" (NOT "node" or "nodenext")
// - "module": "ESNext" or "Preserve" (for maximum compatibility)
// - "target": "ESNext" or "ES2020" minimum
// - "noEmit": true (Bun handles compilation at runtime)
// - "allowImportingTsExtensions": true is optional but can help with .ts imports

// GOTCHA: TypeScript Project References
// - Requires "composite": true in referenced packages
// - "composite" automatically enables "declaration" and "incremental"
// - Must use "references" array to link dependencies
// - Build with `tsc --build` for incremental compilation
// - References create build order, not just type checking

// GOTCHA: Path Mapping vs Project References
// - Path aliases (@/) are for IMPORTS, not type checking performance
// - Project references are for BUILD OPTIMIZATION and dependency tracking
// - Use BOTH: aliases for clean code, references for fast builds

// GOTCHA: Workspace Dependencies
// - Use "workspace:*" in package.json dependencies
// - TypeScript needs proper "references" in tsconfig for type checking
// - Path mappings need to match workspace structure

// GOTCHA: Strict Mode
// - "strict": true enables all strict checks
// - May find existing type errors that were hidden
// - Fix errors incrementally, don't disable strict mode

// GOTCHA: Next.js Integration
// - Keep Next.js plugin in apps/web/tsconfig.json
// - "jsx": "preserve" required for Next.js
// - Don't enable "composite" for Next.js app (only for libraries)

// GOTCHA: Module Resolution
// - "bundler" is Bun-specific, combines best of "node16" and "nodenext"
// - Works with both CommonJS and ESM
// - Supports package.json "exports" field

// Version Note: We're using TypeScript 5.3.3
// This version includes:
// - Improved module resolution
// - Better type checking performance
// - Enhanced project references support
```

## Implementation Blueprint

### Data Models and Structure

TypeScript configuration is declarative JSON, so we structure it hierarchically:

```typescript
// Root tsconfig.base.json structure:
{
  "compilerOptions": {
    // Bun-optimized settings
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",

    // Strict type checking
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,

    // Build settings
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  }
}

// Package tsconfig.json structure (extends base):
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,  // Enable project references
    "outDir": "dist",
    "rootDir": "src"
  },
  "references": [
    { "path": "../types" }  // Link to dependencies
  ],
  "include": ["src/**/*"],
  "exclude": ["dist", "node_modules"]
}
```

### List of Tasks to Complete the PRP

```yaml
Task 1: Create Root Base Configuration
  - CREATE tsconfig.base.json at project root
  - Configure Bun-optimized compiler options
  - Enable strict mode with all strict checks
  - Set up base paths and module resolution
  - Add common compiler options shared by all packages

Task 2: Create Root Workspace Configuration
  - CREATE tsconfig.json at project root
  - Extend from tsconfig.base.json
  - Add project references to all packages
  - Configure workspace-level includes/excludes
  - Set up for `tsc --build` command

Task 3: Update packages/types/tsconfig.json
  - MODIFY packages/types/tsconfig.json
  - Extend from root tsconfig.base.json
  - Enable composite mode for project references
  - Configure declaration generation
  - Keep existing build setup (declaration only)

Task 4: Create packages/ui/tsconfig.json
  - CREATE packages/ui/tsconfig.json
  - Extend from root tsconfig.base.json
  - Add reference to packages/types
  - Configure for React components
  - Enable composite mode
  - Set up proper includes (src/**/*.{ts,tsx})

Task 5: Create packages/api-client/tsconfig.json
  - CREATE packages/api-client/tsconfig.json
  - Extend from root tsconfig.base.json
  - Add reference to packages/types
  - Configure for Node/Bun runtime
  - Enable composite mode

Task 6: Create packages/arabic-nlp/tsconfig.json
  - CREATE packages/arabic-nlp/tsconfig.json
  - Extend from root tsconfig.base.json
  - Add reference to packages/types
  - Enable composite mode

Task 7: Create packages/features/tsconfig.json
  - CREATE packages/features/tsconfig.json
  - Extend from root tsconfig.base.json
  - Add references to types, ui, api-client packages
  - Enable composite mode

Task 8: Update apps/web/tsconfig.json
  - MODIFY apps/web/tsconfig.json
  - Extend from root tsconfig.base.json
  - Keep Next.js plugin configuration
  - Keep existing path mappings but update to use references
  - Add project references to all packages
  - Keep "jsx": "preserve" for Next.js
  - DON'T enable composite (apps don't need it)

Task 9: Validate TypeScript Configuration
  - RUN bun run typecheck to validate all packages
  - CHECK that path mappings resolve correctly
  - VERIFY IDE autocomplete works across packages
  - TEST import statements with @iraqi-ai/* aliases
  - CONFIRM no type errors in any package

Task 10: Update Documentation
  - UPDATE CLAUDE.md if needed with TypeScript configuration notes
  - DOCUMENT the tsconfig hierarchy and project references
  - ADD troubleshooting guide for common TypeScript issues
```

### Task 1: Create Root Base Configuration

```json
// CREATE tsconfig.base.json at project root
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "display": "Iraqi AI Chat System - Base TypeScript Configuration",
  "compilerOptions": {
    // Bun-Optimized Module Settings
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",

    // Strict Type Checking
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,

    // Module System
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "resolveJsonModule": true,
    "isolatedModules": true,

    // Build Configuration
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noEmit": true,
    "incremental": true,

    // Quality
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,

    // Path Mappings (base for all packages)
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@iraqi-ai/types": ["./packages/types/src"],
      "@iraqi-ai/ui": ["./packages/ui/src"],
      "@iraqi-ai/features": ["./packages/features/src"],
      "@iraqi-ai/api-client": ["./packages/api-client/src"],
      "@iraqi-ai/arabic-nlp": ["./packages/arabic-nlp/src"]
    }
  }
}
```

### Task 2: Create Root Workspace Configuration

```json
// CREATE tsconfig.json at project root
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./tsconfig.base.json",
  "files": [],
  "references": [
    { "path": "./packages/types" },
    { "path": "./packages/ui" },
    { "path": "./packages/api-client" },
    { "path": "./packages/arabic-nlp" },
    { "path": "./packages/features" },
    { "path": "./apps/web" }
  ],
  "compilerOptions": {
    "composite": false
  }
}
```

### Task 3: Update packages/types/tsconfig.json

```typescript
// MODIFY packages/types/tsconfig.json
// FIND existing content
// REPLACE with:

{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "outDir": "dist",
    "rootDir": "src",
    "noEmit": false,
    "emitDeclarationOnly": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["dist", "node_modules", "**/*.test.ts", "**/*.spec.ts"]
}
```

### Task 4: Create packages/ui/tsconfig.json

```json
// CREATE packages/ui/tsconfig.json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "jsx": "react-jsx",
    "outDir": "dist",
    "rootDir": "src",
    "noEmit": false
  },
  "references": [
    { "path": "../types" }
  ],
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": [
    "dist",
    "node_modules",
    "**/*.test.ts",
    "**/*.test.tsx",
    "**/*.spec.ts",
    "**/*.spec.tsx",
    "**/*.stories.tsx",
    "storybook-static"
  ]
}
```

### Task 5: Create packages/api-client/tsconfig.json

```json
// CREATE packages/api-client/tsconfig.json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "outDir": "dist",
    "rootDir": "src",
    "noEmit": false
  },
  "references": [
    { "path": "../types" }
  ],
  "include": ["src/**/*.ts"],
  "exclude": [
    "dist",
    "node_modules",
    "**/*.test.ts",
    "**/*.spec.ts"
  ]
}
```

### Task 6: Create packages/arabic-nlp/tsconfig.json

```json
// CREATE packages/arabic-nlp/tsconfig.json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "outDir": "dist",
    "rootDir": "src",
    "noEmit": false
  },
  "references": [
    { "path": "../types" }
  ],
  "include": ["src/**/*.ts"],
  "exclude": [
    "dist",
    "node_modules",
    "**/*.test.ts",
    "**/*.spec.ts"
  ]
}
```

### Task 7: Create packages/features/tsconfig.json

```json
// CREATE packages/features/tsconfig.json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "jsx": "react-jsx",
    "outDir": "dist",
    "rootDir": "src",
    "noEmit": false
  },
  "references": [
    { "path": "../types" },
    { "path": "../ui" },
    { "path": "../api-client" }
  ],
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": [
    "dist",
    "node_modules",
    "**/*.test.ts",
    "**/*.test.tsx",
    "**/*.spec.ts",
    "**/*.spec.tsx"
  ]
}
```

### Task 8: Update apps/web/tsconfig.json

```typescript
// MODIFY apps/web/tsconfig.json
// FIND existing content
// REPLACE with:

{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    // Override for Next.js
    "jsx": "preserve",
    "noEmit": true,

    // Next.js specific
    "plugins": [
      {
        "name": "next"
      }
    ],

    // Path mappings (override base with Next.js patterns)
    "paths": {
      "@/*": ["./src/*"],
      "@iraqi-ai/types": ["../../packages/types/src"],
      "@iraqi-ai/ui": ["../../packages/ui/src"],
      "@iraqi-ai/features": ["../../packages/features/src"],
      "@iraqi-ai/api-client": ["../../packages/api-client/src"],
      "@iraqi-ai/arabic-nlp": ["../../packages/arabic-nlp/src"]
    }
  },
  "references": [
    { "path": "../../packages/types" },
    { "path": "../../packages/ui" },
    { "path": "../../packages/features" },
    { "path": "../../packages/api-client" },
    { "path": "../../packages/arabic-nlp" }
  ],
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    ".next",
    "out",
    "dist",
    "build"
  ]
}
```

### Task 9: Validate TypeScript Configuration

```bash
# Pseudocode for validation steps

# Step 1: Type check all packages
cd /project/root
bun run typecheck
# EXPECTED: No type errors
# IF ERRORS: Read error messages, fix type issues in source files

# Step 2: Test path mappings in IDE
# Open packages/ui/src/index.ts
# Try importing: import { SomeType } from '@iraqi-ai/types'
# EXPECTED: Autocomplete works, no red squiggles
# IF FAILS: Check tsconfig paths and IDE TypeScript version

# Step 3: Test incremental build
tsc --build
# EXPECTED: Builds successfully, generates .tsbuildinfo files
# IF FAILS: Check composite settings and references

# Step 4: Test cross-package type checking
# Edit a type in packages/types/src/cultural.ts
# EXPECTED: packages/ui sees the change immediately
# IF FAILS: Check project references are correct

# Step 5: Manual import tests
# In apps/web, try importing from each package
# import { IraqiCulturalContext } from '@iraqi-ai/types'
# import { Button } from '@iraqi-ai/ui'
# import { ChatClient } from '@iraqi-ai/api-client'
# EXPECTED: All imports resolve with full type information
```

### Integration Points

```yaml
PACKAGE_JSON_SCRIPTS:
  - verify: All packages have "typecheck": "tsc --noEmit" script
  - add_if_missing: "typecheck": "tsc --noEmit"
  - root_script: "typecheck": "bun run --filter \"*\" typecheck"

BUILD_SYSTEM:
  - incremental_build: "tsc --build" at root compiles all packages
  - clean_build: "tsc --build --clean" removes all build artifacts
  - watch_mode: "tsc --build --watch" for development

IDE_INTEGRATION:
  - vscode: Should automatically pick up tsconfig.json files
  - typescript_version: Ensure using workspace TypeScript (5.3.3)
  - reload_command: "TypeScript: Restart TS Server" if needed

CI_INTEGRATION:
  - add_to_ci: "bun run typecheck" as a validation step
  - fail_fast: Type errors should fail the build
  - cache: .tsbuildinfo files can be cached for faster CI
```

## Validation Loop

### Level 1: Syntax & Configuration Validation

```bash
# Run these FIRST - verify all config files are valid JSON
bun x json-schema-validate tsconfig.base.json
bun x json-schema-validate tsconfig.json
bun x json-schema-validate packages/*/tsconfig.json
bun x json-schema-validate apps/web/tsconfig.json

# Expected: All configs are valid JSON with no syntax errors
# If errors: Fix JSON syntax issues (trailing commas, quotes, etc.)
```

### Level 2: Type Checking Validation

```bash
# Type check each package individually first
cd packages/types && bun run typecheck
cd packages/ui && bun run typecheck
cd packages/api-client && bun run typecheck
cd packages/arabic-nlp && bun run typecheck
cd packages/features && bun run typecheck
cd apps/web && bun run typecheck

# Expected: Each package type checks without errors
# If errors: Read and fix type errors before proceeding

# Then run workspace-wide type checking
cd /project/root
bun run typecheck

# Expected: All packages pass type checking
# If errors: Fix remaining type errors
```

### Level 3: Build Validation

```bash
# Test TypeScript project references build
tsc --build

# Expected:
# - All packages compile successfully
# - .tsbuildinfo files created in each package
# - dist/ folders populated with .d.ts files
# If errors: Check composite settings and references

# Test incremental build (should be fast)
# Make a small change to packages/types/src/index.ts
# Run tsc --build again
# Expected: Only types package rebuilds, others use cache

# Clean and rebuild
tsc --build --clean
tsc --build

# Expected: Full rebuild succeeds
```

### Level 4: Integration Test

```bash
# Test imports in actual code
cd apps/web

# Create a test file to verify imports
cat > src/test-types.ts << 'EOF'
// Test cross-package imports
import type { IraqiCulturalContext } from '@iraqi-ai/types'
import type { ButtonProps } from '@iraqi-ai/ui'
import type { ChatClient } from '@iraqi-ai/api-client'

const test: IraqiCulturalContext = {
  dialect: 'baghdadi',
  culturalContext: 'professional'
}

console.log('Types work!', test)
EOF

# Type check the test file
bunx tsc --noEmit src/test-types.ts

# Expected: No type errors, imports resolve correctly
# If errors: Check path mappings and references

# Clean up test file
rm src/test-types.ts
```

### Level 5: IDE Validation

```bash
# Manual IDE checks (document for developer)
# 1. Open VSCode/IDE
# 2. Open a file in packages/ui/src/
# 3. Try importing from '@iraqi-ai/types'
# 4. Verify autocomplete shows all exported types
# 5. Verify Go to Definition (F12) works across packages
# 6. Verify Find All References works across packages
# 7. Check no red error squiggles with valid imports

# If IDE issues:
# - Restart TypeScript server: Cmd+Shift+P -> "TypeScript: Restart TS Server"
# - Check .vscode/settings.json has "typescript.tsdk": "node_modules/typescript/lib"
# - Verify IDE is using workspace TypeScript version
```

## Final Validation Checklist

- [ ] All tsconfig files created with correct extends and references
- [ ] Root typecheck passes: `bun run typecheck`
- [ ] Incremental build works: `tsc --build`
- [ ] Path mappings resolve: `@iraqi-ai/*` imports work
- [ ] IDE autocomplete works across packages
- [ ] Go to Definition (F12) works across packages
- [ ] No type errors in any package
- [ ] Strict mode enabled with all strict checks
- [ ] Composite mode enabled for all packages
- [ ] Project references link package dependencies
- [ ] Documentation updated with TypeScript configuration notes

---

## Anti-Patterns to Avoid

- ❌ Don't disable strict mode to fix errors - fix the errors instead
- ❌ Don't use `any` type to bypass type checking - use proper types
- ❌ Don't skip composite mode for packages - needed for project references
- ❌ Don't forget to add references for package dependencies
- ❌ Don't mix "module": "commonjs" with ESM - use "ESNext" or "Preserve"
- ❌ Don't use "node" or "node16" moduleResolution - use "bundler" for Bun
- ❌ Don't enable composite for apps (Next.js) - only for libraries
- ❌ Don't hardcode paths - use relative paths and project references
- ❌ Don't skip skipLibCheck - it improves type checking performance
- ❌ Don't ignore .tsbuildinfo files - they enable incremental compilation

---

## TypeScript Foundation Gotchas

### Common Issues and Solutions

**Issue 1: "Cannot find module '@iraqi-ai/types'"**
- Solution: Check tsconfig paths match package structure
- Verify project references are set up correctly
- Restart IDE TypeScript server

**Issue 2: "Slow type checking"**
- Solution: Ensure composite: true for all packages
- Use tsc --build instead of tsc for monorepo
- Check that .tsbuildinfo files are being generated

**Issue 3: "Types not updating across packages"**
- Solution: Run tsc --build to rebuild all packages
- Check that project references are correct
- Verify declaration files are being generated

**Issue 4: "Strict mode errors everywhere"**
- Solution: Fix errors incrementally, one package at a time
- Use // @ts-expect-error for legitimate edge cases
- Don't disable strict mode globally

**Issue 5: "Next.js app not finding types"**
- Solution: Keep jsx: "preserve" for Next.js
- Don't enable composite for Next.js app
- Ensure paths in apps/web/tsconfig.json are relative

---

## PRP Quality Self-Assessment

**Confidence Score: 9/10**

**Strengths:**
- ✅ Comprehensive context with all necessary documentation links
- ✅ Clear task breakdown with specific file paths and content
- ✅ Includes Bun-specific optimizations (moduleResolution: bundler)
- ✅ Uses TypeScript project references for optimal build performance
- ✅ Complete validation loops from syntax to integration testing
- ✅ Includes common gotchas and solutions
- ✅ Clear success criteria and anti-patterns
- ✅ Follows existing patterns from phase4 examples
- ✅ Detailed pseudocode for validation steps

**Potential Challenges:**
- ⚠️ May need minor adjustments if packages have existing type errors
- ⚠️ IDE configuration might need manual restart after changes
- ⚠️ First-time tsc --build might be slow (subsequent builds will be fast)

**One-Pass Success Probability: 90%**
- All necessary context included
- Validation gates are executable and comprehensive
- Clear error recovery paths documented
- Follows proven patterns from existing examples
- Bun-specific gotchas documented

**Implementation Time Estimate:**
- Configuration: 30 minutes (creating/updating tsconfig files)
- Validation: 15 minutes (running type checks and builds)
- Troubleshooting: 15 minutes (fixing any initial type errors)
- Total: ~60 minutes for complete implementation
