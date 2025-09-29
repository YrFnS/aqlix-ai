name: "Bun Workspace Setup for Iraqi AI Chat System"
description: |

## Purpose
Establish foundational Bun workspace structure for the Iraqi AI Chat System monorepo with apps/ and packages/ organization, optimized dependency management, and cross-platform workspace configuration.

## Core Principles
1. **Performance First**: Leverage Bun's 30x faster installs and superior build performance
2. **Clean Architecture**: Clear separation between applications and shared packages
3. **Developer Experience**: Streamlined scripts and development workflow
4. **Scalability**: Structure that supports future growth and additional packages
5. **Iraqi AI Integration**: Foundation prepared for Arabic/RTL and cultural features

---

## Goal
Create a production-ready Bun workspace structure that establishes the monorepo foundation for the Iraqi AI Chat System, with proper dependency management, development scripts, and workspace coordination.

## Why
- **Performance**: 30x faster dependency installation compared to npm/yarn
- **Development Efficiency**: Unified workspace management for multi-package development
- **Code Reusability**: Shared packages across web, mobile, and API applications
- **Consistency**: Centralized dependency management and consistent tooling
- **Future Growth**: Foundation that scales with additional packages and applications

## What
Implement Bun workspace configuration with:
- Root workspace configuration (bun.json + package.json)
- Monorepo structure with apps/ and packages/ organization
- Cross-package dependency management using workspace:* protocol
- Development scripts for concurrent development and testing
- Build optimization with workspace-aware caching
- Git configuration optimized for Bun workspace artifacts

### Success Criteria
- [ ] Bun workspace installs all dependencies successfully with bun install
- [ ] All packages build without errors using workspace scripts
- [ ] Internal package references work correctly (workspace:* protocol)
- [ ] Development servers run concurrently without port conflicts
- [ ] Build caching and optimization demonstrably faster than npm equivalent
- [ ] TypeScript path mapping resolves across workspace packages
- [ ] Linting and testing work across all workspace packages

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- url: https://bun.sh/docs/install/workspaces
  why: Official Bun workspace configuration patterns and glob syntax

- url: https://bun.sh/docs/cli/install
  why: Dependency management commands, filtering, and lockfile handling

- url: https://bun.sh/docs/bundler
  why: Build system configuration for workspace-aware builds and caching

- file: app-plan.md
  why: Target monorepo structure with apps/ and packages/ organization
  critical: Shows specific directory layout and package requirements

- file: examples/phase3-reference-implementations/types/package.json
  why: Example of Bun-based package.json with proper scripts and exports
  critical: Shows workspace:* dependency pattern and Bun build configuration

- file: examples/phase3-reference-implementations/iraqi-cultural-engine/package.json
  why: Example of internal package dependencies and workspace structure
  critical: Demonstrates workspace:* protocol for internal packages

- file: examples/lobe-chat-desktop-enhanced/package.json
  why: Complex package.json example showing script organization (WARNING: npm-based, needs conversion)
  critical: Shows comprehensive script setup that needs Bun optimization
```

### Current Codebase tree (project root structure)
```bash
/
├── .claude/                 # AI agent configurations
├── .git/                   # Git repository
├── docs/                   # Documentation
├── examples/               # 79 reference implementations
├── initials/               # 56 system templates
├── project-context/        # Persistent knowledge base
├── PRPs/                   # Product Requirement Prompts
├── reference/              # Reference materials
├── CLAUDE.md              # System rules and configuration
├── app-plan.md           # Development plan and architecture
├── archon.md             # Task management workflow rules
└── README.md             # Project overview

# MISSING: No apps/, packages/, bun.json, or workspace structure
```

### Desired Codebase tree with files to be added and responsibility of file
```bash
/
├── apps/                   # Applications directory
│   ├── web/               # Next.js 15+ web application
│   │   └── package.json   # Web app dependencies and scripts
│   ├── api/               # FastAPI Python backend
│   │   └── package.json   # API app dependencies (Node.js tooling)
│   └── mobile/            # React Native app (future)
│       └── package.json   # Mobile app dependencies
├── packages/              # Shared packages directory
│   ├── ui/                # Shared UI components
│   │   └── package.json   # UI package with React components
│   ├── types/             # TypeScript type definitions
│   │   └── package.json   # Type definitions package
│   ├── features/          # Shared business logic
│   │   └── package.json   # Feature modules (chat/, documents/, payments/)
│   ├── api-client/        # API client logic
│   │   └── package.json   # API client with Iraqi-specific endpoints
│   └── arabic-nlp/        # Arabic processing logic
│       └── package.json   # NLP package for Iraqi dialect
├── bun.json              # Bun workspace configuration
├── package.json          # Root workspace manifest with workspaces definition
├── bun.lockb             # Bun lockfile (generated)
├── .gitignore            # Updated to include Bun artifacts
└── [existing files]      # All current files remain unchanged
```

### Known Gotchas of our codebase & Library Quirks
```typescript
// CRITICAL: Current project has NO existing workspace setup
// WARNING: Examples use npm/yarn - must convert to Bun patterns
// GOTCHA: Some packages use different build tools (electron-webpack, webpack)

// Bun-specific requirements:
// 1. Use "type": "module" for ESM support in package.json
// 2. Bun build command syntax differs from webpack/rollup
// 3. workspace:* protocol must be used for internal dependencies
// 4. Bun.lockb is binary format (different from package-lock.json/yarn.lock)
// 5. Some native modules may need special handling in Bun

// Iraqi AI system specifics:
// 1. Arabic text processing packages need proper UTF-8 handling
// 2. RTL packages must work with workspace builds
// 3. Cultural validation tools need consistent TypeScript paths
// 4. Payment gateway packages require secure environment variable handling
```

## Implementation Blueprint

### Data models and structure
Create the core workspace configuration files that define package organization and dependency relationships.

```json
// Root package.json - Workspace manifest
{
  "name": "iraqi-ai-chat-system",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "bun run --filter ./apps/web dev",
    "build": "bun run --filter \"packages/*\" build && bun run --filter \"apps/*\" build",
    "test": "bun test --recursive",
    "lint": "bun run --filter \"*\" lint",
    "typecheck": "bun run --filter \"*\" typecheck"
  }
}

// bun.json - Workspace configuration
{
  "name": "iraqi-ai-chat-system",
  "workspaces": ["apps/*", "packages/*"],
  "install": {
    "cache": {
      "dir": ".bun/cache"
    },
    "lockfile": {
      "path": "bun.lockb"
    }
  }
}
```

### List of tasks to be completed to fulfill the PRP in the order they should be completed

```yaml
Task 1: Create Root Workspace Configuration
CREATE package.json (root):
  - PATTERN: Follow Bun workspace manifest structure
  - INCLUDE: Workspaces glob patterns ["apps/*", "packages/*"]
  - ADD: Workspace-level scripts for dev, build, test, lint
  - SET: "private": true to prevent accidental publishing

CREATE bun.json:
  - PATTERN: Official Bun workspace configuration
  - CONFIGURE: Workspace paths and caching options
  - OPTIMIZE: Install settings for performance

UPDATE .gitignore:
  - ADD: bun.lockb (binary lockfile)
  - ADD: .bun/ (cache directory)
  - ADD: node_modules/ (if not already present)
  - PRESERVE: Existing ignored patterns

Task 2: Initialize Apps Directory Structure
CREATE apps/ directory structure:
  - MKDIR: apps/web/ (Next.js application)
  - MKDIR: apps/api/ (FastAPI backend - Node.js tooling)
  - MKDIR: apps/mobile/ (React Native - future)

CREATE apps/web/package.json:
  - MIRROR: Next.js 15 + React 19 configuration from app-plan.md
  - CONVERT: npm scripts to Bun equivalents
  - SET: Proper TypeScript and build configuration
  - ADD: Dependencies for Iraqi AI features (RTL, Arabic fonts)

CREATE apps/api/package.json:
  - FOCUS: Node.js tooling for FastAPI development
  - INCLUDE: TypeScript compilation and development tools
  - ADD: Python bridge tools and API development dependencies

Task 3: Initialize Packages Directory Structure
CREATE packages/ directory structure:
  - MKDIR: packages/ui/ (shared UI components)
  - MKDIR: packages/types/ (TypeScript definitions)
  - MKDIR: packages/features/ (business logic)
  - MKDIR: packages/api-client/ (API client)
  - MKDIR: packages/arabic-nlp/ (Arabic processing)

CREATE packages/types/package.json:
  - MIRROR: examples/phase3-reference-implementations/types/package.json
  - OPTIMIZE: Bun build configuration
  - INCLUDE: Zod schemas and shared type definitions

CREATE packages/ui/package.json:
  - FOCUS: Reusable React components with Iraqi design patterns
  - INCLUDE: Tailwind CSS, Arabic font support, RTL components
  - ADD: Storybook for component development

CREATE packages/features/package.json:
  - ORGANIZE: Business logic modules (chat/, documents/, payments/)
  - DEPENDENCIES: workspace:* for internal packages
  - INCLUDE: Shared utilities and Iraqi-specific features

CREATE packages/api-client/package.json:
  - PURPOSE: API communication layer
  - INCLUDE: HTTP client, error handling, Iraqi endpoints
  - DEPENDENCIES: types package via workspace:*

CREATE packages/arabic-nlp/package.json:
  - SPECIALIZATION: Iraqi dialect processing and RTL text handling
  - INCLUDE: Arabic text processing libraries
  - OPTIMIZE: Performance for real-time text processing

Task 4: Configure Cross-Package Dependencies
UPDATE all package.json files:
  - REPLACE: External references with workspace:* protocol
  - EXAMPLE: "@iraqi-ai/types": "workspace:*"
  - ENSURE: Proper dependency resolution across packages
  - VALIDATE: No circular dependencies between packages

Task 5: Setup Development Scripts
CREATE workspace development scripts:
  - CONCURRENT: Run multiple apps simultaneously
  - PORT ALLOCATION: web:3000, api:8000, storybook:6006
  - HOT RELOAD: Enable cross-package change detection
  - LOGGING: Clear separation of package logs

Task 6: Configure Build Pipeline
SETUP workspace builds:
  - DEPENDENCY ORDER: packages first, then apps
  - CACHING: Enable Bun build cache for faster rebuilds
  - OPTIMIZATION: Bundle analysis and size monitoring
  - OUTPUT: Proper dist/ structure for each package

Task 7: Implement Testing Framework
CONFIGURE workspace testing:
  - UNIT TESTS: Individual package testing with Bun test
  - INTEGRATION: Cross-package integration tests
  - COVERAGE: Workspace-wide coverage reporting
  - E2E: Placeholder for application-level testing
```

### Per task pseudocode as needed added to each task

```typescript
// Task 1: Root Configuration Pseudocode
// Root package.json structure
{
  "name": "iraqi-ai-chat-system",
  "version": "1.0.0",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    // PATTERN: Use bun run with --filter for workspace targeting
    "dev": "bun run --filter ./apps/web dev",
    "dev:all": "concurrently \"bun run --filter ./apps/web dev\" \"bun run --filter ./apps/api dev\"",
    "build": "bun run --filter \"packages/*\" build && bun run --filter \"apps/*\" build",
    "test": "bun test --recursive",
    "lint": "bun run --filter \"*\" lint",
    "typecheck": "bun run --filter \"*\" typecheck",
    "clean": "bun run --filter \"*\" clean"
  },
  "devDependencies": {
    // WORKSPACE-LEVEL: Development tools shared across packages
    "typescript": "^5.3.3",
    "concurrently": "^8.2.2", // For running multiple dev servers
    "@types/bun": "latest"
  }
}

// Task 3: Package Configuration Example
// packages/types/package.json structure
{
  "name": "@iraqi-ai/types",
  "version": "1.0.0",
  "type": "module", // CRITICAL: ESM support for Bun
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    // PATTERN: Bun build commands for optimal performance
    "build": "bun run build:types && bun run build:js",
    "build:types": "tsc --declaration --emitDeclarationOnly --outDir dist",
    "build:js": "bun build src/index.ts --outdir dist --format esm --target bun",
    "dev": "bun --watch src/index.ts",
    "test": "bun test",
    "lint": "eslint src/**/*.ts",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "zod": "^3.22.4" // SCHEMA validation for Iraqi-specific types
  }
}

// Task 4: Workspace Dependency Example
// packages/ui/package.json showing workspace dependencies
{
  "dependencies": {
    "@iraqi-ai/types": "workspace:*", // PATTERN: Internal package reference
    "react": "^18.2.0",
    "tailwindcss": "^3.4.1" // For Iraqi design system
  }
}

// Task 5: Development Script Pseudocode
// Concurrent development with proper port allocation
const devScript = {
  "dev:all": "concurrently \"bun --cwd apps/web dev --port 3000\" \"bun --cwd apps/api dev --port 8000\" \"bun --cwd packages/ui storybook dev --port 6006\"",
  // CRITICAL: Each service gets dedicated port to avoid conflicts
  // PATTERN: Use --cwd to specify working directory for each package
}
```

### Integration Points
```yaml
TYPESCRIPT:
  - configuration: "Workspace-wide tsconfig.json with path mapping"
  - paths: "Map @/* to packages/* for easy imports"
  - pattern: "Each package extends root tsconfig"

LINTING:
  - configuration: "Root .eslintrc with workspace overrides"
  - pattern: "Shared rules with package-specific customizations"
  - integration: "Pre-commit hooks with lint-staged"

BUILD SYSTEM:
  - strategy: "Packages build first, then applications"
  - caching: "Bun build cache for incremental builds"
  - optimization: "Bundle analysis and dependency tracking"

DEVELOPMENT:
  - hot-reload: "Cross-package change detection and rebuild"
  - ports: "Predefined port allocation (web:3000, api:8000, storybook:6006)"
  - logging: "Colored output separation by package"
```

## Validation Loop

### Level 1: Syntax & Configuration
```bash
# Verify Bun workspace setup
bun install                           # Should install all dependencies
bun pm ls                            # List all packages in workspace

# Verify workspace structure
bun run --filter "*" --dry-run build # Check all build scripts exist
bun run --filter "*" --dry-run test  # Check all test scripts exist

# Expected: No errors, all packages detected, scripts validated
```

### Level 2: Package Validation
```bash
# Test internal package dependencies
cd packages/types && bun run build   # Build types package
cd packages/ui && bun run build      # Should find @iraqi-ai/types

# Test workspace dependency resolution
bun pm ls --depth=0                  # Should show workspace:* dependencies resolved

# Validate TypeScript path mapping
cd apps/web && bun run typecheck     # Should resolve @/* imports correctly

# Expected: All builds successful, dependencies resolved, no TypeScript errors
```

### Level 3: Development Workflow
```bash
# Test concurrent development
bun run dev:all                      # Start all development servers

# In separate terminal, verify ports
curl http://localhost:3000           # Web app should respond
curl http://localhost:8000/health    # API health check (when implemented)
curl http://localhost:6006           # Storybook should respond

# Test hot reload
echo "export const test = 'changed';" >> packages/types/src/index.ts
# Web app should rebuild and reflect changes

# Expected: All services start, ports accessible, hot reload works
```

### Level 4: Build Performance Test
```bash
# Measure build performance
time bun run build                   # Full workspace build
time bun run build                   # Second run (should use cache)

# Compare with npm equivalent (if available)
time npm run build                   # Should be significantly slower

# Expected: Bun builds significantly faster, caching improves second build
```

## Final validation Checklist
- [ ] All workspace packages install: `bun install` completes successfully
- [ ] No dependency conflicts: `bun pm ls` shows clean resolution
- [ ] All packages build: `bun run build` completes without errors
- [ ] TypeScript resolution works: `bun run typecheck` passes across workspace
- [ ] Development servers start: `bun run dev:all` launches without port conflicts
- [ ] Internal dependencies resolve: workspace:* protocol works correctly
- [ ] Build performance optimized: Demonstrably faster than npm equivalent
- [ ] Git integration clean: Proper .gitignore, bun.lockb committed
- [ ] Script organization logical: Clear separation of workspace vs package scripts

---

## Anti-Patterns to Avoid
- ❌ Don't mix npm/yarn commands with Bun workspace setup
- ❌ Don't hardcode package versions that should use workspace:*
- ❌ Don't skip bun.lockb in version control - it's essential for reproducible builds
- ❌ Don't use relative imports across packages - use proper workspace names
- ❌ Don't duplicate dependencies across packages without justification
- ❌ Don't ignore TypeScript path mapping - essential for development experience
- ❌ Don't create circular dependencies between packages
- ❌ Don't skip workspace-level scripts for common tasks

---

## Quality Score Assessment

**Confidence Level: 9/10**

**Strengths:**
- Comprehensive context from official Bun documentation
- Clear understanding of target monorepo structure from app-plan.md
- Real examples from existing package.json files in codebase
- Step-by-step implementation with validation at each level
- Specific Iraqi AI considerations integrated throughout
- Performance benchmarks and measurement criteria included

**Areas of Excellence:**
- Complete workspace setup from scratch (matches beginner-friendly requirement)
- Executable validation commands for AI agent self-verification
- Detailed gotchas and library-specific considerations documented
- Clear migration path from current structure to Bun workspace
- Scalable foundation for future packages and applications

**Minor Limitations:**
- Some package configurations may need fine-tuning based on specific Iraqi AI requirements
- Python backend tooling integration may require additional iteration
- Arabic text processing packages may have unique Bun compatibility considerations

**Expected Success Rate: 95%** - This PRP provides sufficient context and validation loops for successful one-pass implementation with the Iraqi AI Chat System's specific requirements.