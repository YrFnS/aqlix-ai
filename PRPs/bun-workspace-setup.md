name: "Bun Workspace Setup for Iraqi AI Chat System"
description: |

## Purpose
Establish foundational Bun workspace infrastructure for the Iraqi AI Chat System monorepo with apps/ and packages/ organization, optimized dependency management, and cross-platform development workflow.

## Core Principles
1. **Context is King**: Include ALL necessary documentation, examples, and caveats
2. **Validation Loops**: Provide executable tests/lints the AI can run and fix
3. **Information Dense**: Use keywords and patterns from the codebase
4. **Progressive Success**: Start simple, validate, then enhance
5. **Global rules**: Be sure to follow all rules in CLAUDE.md

---

## Goal
Create a complete Bun workspace setup for the Iraqi AI Chat System that enables:
- Monorepo development with apps/ (Next.js web, FastAPI api) and packages/ (shared libraries)
- Efficient dependency management with workspace linking
- Development workflow with concurrent development and build optimization
- Foundation for 30x faster development compared to npm-based workflows

## Why
- **Performance**: Leverage Bun's 30x speed advantage over npm for Iraqi development environments
- **Scalability**: Workspace structure that can grow with additional packages and applications
- **Developer Experience**: Streamlined development workflow with hot reloading and workspace coordination
- **Foundation**: Essential infrastructure that all subsequent features depend on
- **Cultural Context**: Optimized for Arabic/RTL development with proper TypeScript path mapping

## What
A complete Bun workspace configuration that provides:
- Root workspace configuration with apps/ and packages/ organization
- Shared package linking with @iraqi-ai/ namespace
- Development scripts for concurrent development and testing
- Build optimization with dependency graph management
- TypeScript integration with workspace-aware path mapping

### Success Criteria
- [ ] Bun workspace installs and resolves dependencies correctly
- [ ] All packages build successfully with proper TypeScript support
- [ ] Development servers run concurrently without port conflicts
- [ ] Internal package references work with workspace:* syntax
- [ ] Build performance shows significant improvement over npm
- [ ] Workspace structure supports future Arabic/RTL package additions

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- url: https://bun.com/guides/install/workspaces
  why: Official Bun workspace configuration patterns and best practices

- url: https://dev.to/is_bik/how-create-bun-workspaces-and-build-it-with-docker-51c4
  why: Practical examples of workspace structure with apps/ and packages/
  section: Project structure and package.json configurations
  critical: workspace:* dependency syntax and TypeScript integration

- url: https://jsdev.space/complete-monorepo-guide/
  why: Comprehensive monorepo best practices and common gotchas
  section: Dependency management and troubleshooting
  critical: Port conflicts, dependency hoisting issues, build order dependencies

- file: examples/phase3-reference-implementations/types/package.json
  why: Pattern for shared packages with @iraqi-ai/ namespace and proper exports

- file: examples/phase3-reference-implementations/iraqi-cultural-engine/package.json
  why: Pattern for workspace dependencies using workspace:* syntax

- file: examples/iraqi-ai-desktop-enhanced/package.json
  why: Bun script patterns and development workflow examples

- docfile: CLAUDE.md
  why: Global rules, naming conventions, and Iraqi AI system requirements
```

### Current Codebase tree
```bash
aqlix-ai/
├── .claude/                    # Agent configurations
├── docs/                      # Documentation
├── examples/                  # 79 Iraqi-enhanced reference implementations
├── initials/                  # 56 system templates
├── project-context/           # Persistent knowledge base
├── PRPs/                     # Product Requirement Prompts
├── CLAUDE.md                 # Global rules and requirements
├── README.md                 # Project documentation
└── [NO apps/, packages/, or workspace configuration yet]
```

### Desired Codebase tree with files to be added
```bash
aqlix-ai/
├── apps/
│   ├── web/                   # Next.js 15+ web application
│   │   └── package.json       # Web app configuration
│   ├── api/                   # Python FastAPI backend
│   │   └── package.json       # API build/dev tooling
│   └── mobile/                # React Native app (future)
│       └── package.json       # Mobile app configuration
├── packages/
│   ├── ui/                    # Shared UI components
│   │   └── package.json       # @iraqi-ai/ui package
│   ├── types/                 # TypeScript types
│   │   └── package.json       # @iraqi-ai/types package
│   ├── features/              # Business logic (chat/, documents/, payments/)
│   │   └── package.json       # @iraqi-ai/features package
│   ├── api-client/            # API client logic
│   │   └── package.json       # @iraqi-ai/api-client package
│   └── arabic-nlp/            # Arabic processing logic
│       └── package.json       # @iraqi-ai/arabic-nlp package
├── bun.json                   # Bun workspace configuration (REPLACES package.json workspace config)
├── package.json               # Root workspace configuration
└── .gitignore                 # Updated for Bun artifacts
```

### Known Gotchas of Bun Workspaces & Library Quirks
```javascript
// CRITICAL: Bun uses bun.json for workspace config, not just package.json
// Different from npm/yarn - bun.json takes precedence over package.json workspaces

// GOTCHA: Dependency hoisting can cause version conflicts
// Solution: Use workspace:* for internal deps, pin external versions in root

// GOTCHA: Port conflicts in development mode
// Solution: Allocate ports systematically (3000 web, 8000 api, 3001 mobile)

// GOTCHA: TypeScript resolution across workspaces requires proper path mapping
// Solution: Configure paths in root tsconfig.json with workspace references

// GOTCHA: Hot reloading coordination between workspace packages
// Solution: Use bun --watch with proper file watching patterns

// CRITICAL: Bun doesn't do type checking by default
// Solution: Run TypeScript separately for validation

// GOTCHA: Build order dependencies for interdependent packages
// Solution: Use proper dependency graph in workspace configuration

// PERFORMANCE: Bun.lockb binary format (not human-readable like package-lock.json)
// Pattern: Commit bun.lockb for reproducible builds
```

## Implementation Blueprint

### Data models and structure
```typescript
// Package configuration structure for consistency
interface IraqiAIPackageConfig {
  name: string;           // @iraqi-ai/package-name format
  version: string;        // Semantic versioning
  type: "module";         // ESM modules for modern JavaScript
  main: string;           // Entry point (dist/index.js)
  types: string;          // TypeScript definitions (dist/index.d.ts)
  exports: object;        // Modern module exports
  scripts: {              // Standardized build/dev scripts
    build: string;
    dev: string;
    test: string;
    lint: string;
    typecheck: string;
  };
  dependencies?: Record<string, string>;     // External dependencies
  devDependencies?: Record<string, string>;  // Development dependencies
  keywords: string[];     // Iraqi AI, cultural AI, etc.
  author: string;         // "Iraqi AI Development Team"
  license: string;        // Licensing model
}
```

### List of tasks to be completed to fulfill the PRP in order

```yaml
Task 1: Create Root Workspace Configuration
CREATE package.json:
  - PATTERN: Private root package with workspaces definition
  - SET workspaces: ["apps/*", "packages/*"]
  - MARK as private: true to prevent accidental publishing
  - ADD basic scripts for workspace management

CREATE bun.json:
  - CONFIGURE workspace settings and build optimization
  - SET module resolution and caching options
  - ENABLE TypeScript support and performance optimizations

Task 2: Setup Directory Structure
CREATE apps/ directory:
  - MKDIR apps/web, apps/api, apps/mobile
  - PREPARE for Next.js, FastAPI, React Native applications

CREATE packages/ directory:
  - MKDIR packages/ui, packages/types, packages/features
  - MKDIR packages/api-client, packages/arabic-nlp
  - ESTABLISH foundation for shared Iraqi AI packages

Task 3: Create Shared Package Configurations
CREATE packages/types/package.json:
  - PATTERN: @iraqi-ai/types with TypeScript definitions
  - MIRROR: examples/phase3-reference-implementations/types/package.json
  - SET proper exports and build configuration

CREATE packages/ui/package.json:
  - PATTERN: @iraqi-ai/ui with React components and RTL support
  - CONFIGURE for Arabic/RTL development workflow
  - SETUP build pipeline for component library

CREATE packages/features/package.json:
  - PATTERN: @iraqi-ai/features with business logic organization
  - ORGANIZE by features (chat/, documents/, payments/, images/)
  - SETUP workspace dependencies with workspace:* syntax

CREATE packages/api-client/package.json:
  - PATTERN: @iraqi-ai/api-client for API communication
  - CONFIGURE TypeScript client generation
  - SETUP development and build workflows

CREATE packages/arabic-nlp/package.json:
  - PATTERN: @iraqi-ai/arabic-nlp for Iraqi dialect processing
  - CONFIGURE Arabic text processing and RTL support
  - PREPARE for cultural and linguistic validation

Task 4: Create Application Configurations
CREATE apps/web/package.json:
  - PATTERN: Next.js 15+ application with Iraqi AI dependencies
  - ADD workspace dependencies: @iraqi-ai/ui, @iraqi-ai/types, etc.
  - CONFIGURE development and build scripts with proper ports

CREATE apps/api/package.json:
  - PATTERN: Build tooling for Python FastAPI backend
  - CONFIGURE Python environment and dependency management
  - SETUP development scripts for FastAPI coordination

CREATE apps/mobile/package.json:
  - PATTERN: React Native application (future implementation)
  - PREPARE configuration for mobile Iraqi AI features
  - CONFIGURE workspace integration and build pipeline

Task 5: Configure Development Workflow
UPDATE package.json (root):
  - ADD workspace management scripts (dev, build, test, lint)
  - CONFIGURE concurrent development with proper port allocation
  - SETUP workspace-wide commands for development workflow

CREATE .gitignore updates:
  - ADD Bun-specific artifacts (bun.lockb, .bun/)
  - INCLUDE workspace build artifacts and cache directories
  - PRESERVE existing patterns while adding workspace exclusions

Task 6: Setup TypeScript Integration
CREATE tsconfig.json (root):
  - CONFIGURE workspace references and path mapping
  - SET up TypeScript project references for performance
  - ENABLE incremental builds and workspace coordination

UPDATE packages with TypeScript configurations:
  - CREATE individual tsconfig.json files for each package
  - CONFIGURE proper module resolution and path mapping
  - SETUP TypeScript project references for dependency graph

Task 7: Initialize and Validate Workspace
RUN bun install:
  - VERIFY workspace dependency resolution
  - CHECK internal package linking with workspace:* syntax
  - VALIDATE dependency hoisting and version consistency

TEST development workflow:
  - RUN concurrent development servers
  - VERIFY hot reloading and package coordination
  - TEST build pipeline and dependency optimization

VALIDATE TypeScript integration:
  - RUN type checking across all workspace packages
  - VERIFY path mapping and module resolution
  - TEST incremental builds and workspace references
```

### Per task pseudocode

```javascript
// Task 1: Root Workspace Configuration
// package.json structure
{
  "name": "iraqi-ai-chat-system",
  "private": true,  // CRITICAL: Prevents accidental publishing
  "workspaces": ["apps/*", "packages/*"],  // PATTERN: Standard workspace organization
  "type": "module",  // Modern ESM modules
  "scripts": {
    // PATTERN: Workspace-wide commands from successful monorepos
    "dev": "bun run --filter=./apps/* dev",  // Concurrent development
    "build": "bun run --filter=./packages/* build && bun run --filter=./apps/* build",
    "test": "bun test --recursive",  // Workspace-wide testing
    "lint": "bun run --filter=* lint",  // All packages linting
    "typecheck": "tsc --build --verbose"  // TypeScript project references
  },
  // GOTCHA: No dependencies in root - managed in workspaces
}

// bun.json optimizations
{
  "install": {
    "peer": true,  // PERFORMANCE: Enable peer dependency optimization
    "cache": true  // PERFORMANCE: Enable dependency caching
  },
  "module": {
    "resolution": "node"  // COMPATIBILITY: Standard Node.js resolution
  }
}

// Task 3: Shared Package Pattern
// packages/types/package.json
{
  "name": "@iraqi-ai/types",  // PATTERN: Namespace organization
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",  // MODERN: ESM exports
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "bun run build:types && bun run build:js",
    "build:types": "tsc --declaration --emitDeclarationOnly --outDir dist",
    "build:js": "bun build src/index.ts --outdir dist --format esm --target bun",
    // PATTERN: Standard development workflow
    "dev": "bun --watch src/index.ts",
    "test": "bun test",
    "lint": "eslint src/**/*.ts",
    "typecheck": "tsc --noEmit"
  },
  // GOTCHA: No workspace dependencies yet - added in later packages
}

// Task 4: Application Configuration Pattern
// apps/web/package.json
{
  "name": "iraqi-ai-web",
  "version": "1.0.0",
  "private": true,  // CRITICAL: App packages should be private
  "type": "module",
  "scripts": {
    "dev": "next dev -p 3000",  // GOTCHA: Explicit port to avoid conflicts
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    // PATTERN: Workspace dependencies for shared packages
    "@iraqi-ai/ui": "workspace:*",
    "@iraqi-ai/types": "workspace:*",
    "@iraqi-ai/features": "workspace:*",
    "@iraqi-ai/api-client": "workspace:*",
    // External dependencies
    "next": "^15.0.0",
    "react": "^19.0.0"
  }
}

// Task 6: TypeScript Integration
// tsconfig.json (root)
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",  // BUN: Use bundler resolution
    "strict": true,
    "baseUrl": ".",
    "paths": {
      // PATTERN: Workspace path mapping for development
      "@iraqi-ai/ui": ["./packages/ui/src"],
      "@iraqi-ai/types": ["./packages/types/src"],
      "@iraqi-ai/features/*": ["./packages/features/src/*"],
      "@/*": ["./apps/web/src/*"]
    }
  },
  "references": [
    // PERFORMANCE: TypeScript project references for incremental builds
    { "path": "./packages/types" },
    { "path": "./packages/ui" },
    { "path": "./packages/features" },
    { "path": "./apps/web" }
  ]
}
```

### Integration Points
```yaml
WORKSPACE_STRUCTURE:
  - apps/: "Applications (Next.js web, FastAPI api, React Native mobile)"
  - packages/: "Shared libraries with @iraqi-ai/ namespace"
  - pattern: "Clear separation between apps and reusable packages"

DEPENDENCY_MANAGEMENT:
  - internal: "workspace:* syntax for all @iraqi-ai/ packages"
  - external: "Pin versions in individual package.json files"
  - hoisting: "Automatic dependency hoisting to workspace root"

DEVELOPMENT_WORKFLOW:
  - ports: "3000 (web), 8000 (api), 3001 (mobile) to avoid conflicts"
  - scripts: "Workspace-wide dev, build, test, lint commands"
  - watching: "Bun --watch for hot reloading across packages"

TYPESCRIPT_INTEGRATION:
  - references: "Project references for incremental builds"
  - paths: "Workspace path mapping for cross-package imports"
  - validation: "Separate typecheck command (Bun doesn't type check)"

BUILD_PIPELINE:
  - packages: "Build shared packages first (dependency order)"
  - apps: "Build applications after packages are ready"
  - caching: "Leverage Bun's caching for faster rebuilds"
```

## Validation Loop

### Level 1: Workspace Structure & Dependencies
```bash
# Verify workspace structure exists
ls -la apps/ packages/
# Expected: apps/web, apps/api, packages/ui, packages/types, etc.

# Install dependencies and verify workspace linking
bun install
# Expected: No errors, bun.lockb created, workspace packages linked

# Verify workspace dependency resolution
bun pm ls --depth=1
# Expected: @iraqi-ai packages linked, no dependency conflicts
```

### Level 2: Package Configurations
```bash
# Verify each package builds successfully
cd packages/types && bun run build
cd packages/ui && bun run build
cd packages/features && bun run build
# Expected: dist/ directories created with proper exports

# Run type checking across workspace
bun run typecheck
# Expected: No TypeScript errors, project references working

# Test workspace scripts work
bun run lint
bun test
# Expected: All packages linted and tested successfully
```

### Level 3: Development Workflow
```bash
# Start development servers concurrently
bun run dev
# Expected: Multiple services running on different ports
# - Web app on :3000
# - API dev tools on :8000 (if applicable)
# - No port conflicts

# Test hot reloading by modifying a shared package
echo "export const test = 'modified';" >> packages/types/src/test.ts
# Expected: Web app hot reloads with changes from shared package

# Test workspace dependency resolution
cd apps/web
bun add @iraqi-ai/arabic-nlp
# Expected: Workspace package added correctly, not external package
```

### Level 4: Performance Validation
```bash
# Measure installation speed
time bun install --force
# Expected: Significantly faster than npm install (target: <10s vs >30s)

# Test incremental builds
bun run build
# Modify a package
echo "// comment" >> packages/ui/src/index.ts
time bun run build
# Expected: Only affected packages rebuild (incremental compilation)

# Verify caching works
rm -rf node_modules/.cache
bun run build
time bun run build  # Second run
# Expected: Second build much faster due to caching
```

## Final Validation Checklist
- [ ] Workspace structure created: `ls apps/ packages/`
- [ ] All dependencies install: `bun install` (no errors)
- [ ] Internal packages link: `bun pm ls` (workspace:* resolved)
- [ ] All packages build: `bun run build` (dist/ created)
- [ ] TypeScript validation: `bun run typecheck` (no errors)
- [ ] Development workflow: `bun run dev` (concurrent servers)
- [ ] Hot reloading works: Modify shared package, see changes
- [ ] Performance improvement: Installation <10s (vs >30s npm)
- [ ] Linting passes: `bun run lint` (all packages)
- [ ] Tests pass: `bun test` (workspace-wide)

---

## Anti-Patterns to Avoid
- ❌ Don't use npm or yarn commands - use Bun exclusively
- ❌ Don't create dependencies in root package.json - use workspaces
- ❌ Don't hardcode localhost URLs - use relative paths or env vars
- ❌ Don't ignore bun.lockb - commit it for reproducible builds
- ❌ Don't use different port numbers without documenting them
- ❌ Don't skip TypeScript project references - they improve performance
- ❌ Don't mix package managers - Bun only for consistency
- ❌ Don't create apps/ packages without proper package.json configs

## Iraqi AI System Considerations
- **Cultural Context**: Workspace prepared for Arabic/RTL packages and features
- **Performance**: Optimized for Iraqi development environments with slower internet
- **Scalability**: Structure supports growing ecosystem of Iraqi AI features
- **Integration**: Foundation for cultural validation, Arabic NLP, and payment systems
- **Professional Domains**: Ready for Iraqi legal, medical, educational packages

## Confidence Score: 9/10
This PRP provides comprehensive context for one-pass implementation including:
✅ Detailed official documentation and real-world examples
✅ Specific patterns from existing codebase examples
✅ Complete gotchas and troubleshooting from production usage
✅ Executable validation steps with clear success criteria
✅ Anti-patterns to avoid common workspace pitfalls
✅ Iraqi AI system specific considerations and requirements

The high confidence score reflects the thorough research, practical examples from the codebase, and comprehensive validation approach that should enable successful implementation without iteration.