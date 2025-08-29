name: "Bun Workspace Setup PRP - Foundation Infrastructure"
description: |
  Comprehensive PRP for setting up Bun workspace monorepo structure for the Iraqi AI Chat System with proper dependency management, development workflow, and Iraqi-specific considerations.

---

## Goal
Set up a complete Bun workspace monorepo structure for the Iraqi AI Chat System that organizes applications (web frontend, API backend) and shared packages efficiently with proper dependency management, development scripts, and build configuration. The workspace should follow Iraqi AI project conventions and be optimized for the Iraqi development environment.

## Why
- **Monorepo Benefits**: Enable code sharing between frontend and backend with shared utilities, types, and Iraqi-specific packages (Arabic processing, cultural validation, payment gateways)
- **Performance**: Leverage Bun's 30x speed advantage over npm for Iraqi development environments as specified in CLAUDE.md
- **Development Efficiency**: Concurrent development of multiple packages with hot reloading and proper dependency resolution
- **Iraqi AI Ecosystem**: Foundation for shared cultural intelligence, Arabic RTL processing, and professional domain packages
- **Scalability**: Structure that can grow with additional Iraqi government ministry packages and features

## What
Create a foundational Bun workspace with:
- Root workspace configuration with apps/ and packages/ organization
- Basic shared package for common utilities and Iraqi-specific features
- Sample application structure demonstrating workspace functionality
- Development and build scripts for concurrent workflow
- TypeScript configuration with proper workspace path mapping
- Iraqi AI project naming conventions (@aqlix-ai/ namespace)

### Success Criteria
- [ ] `bun install` completes without errors from root directory
- [ ] Workspace dependencies resolve correctly using "workspace:*" protocol
- [ ] Development servers can run concurrently on different ports
- [ ] TypeScript compilation works across all workspace packages
- [ ] Build system can build packages in correct dependency order
- [ ] Cross-package imports work seamlessly
- [ ] Follows established Iraqi AI project conventions and patterns

## All Needed Context

### Documentation & References
```yaml
# CRITICAL READING - Bun workspace concepts and gotchas
- url: https://bun.sh/docs/install/workspaces
  why: Official Bun workspace configuration and syntax
  note: May have access issues, but search results provide comprehensive info

- url: https://jsdev.space/mastering-monorepos/
  why: Comprehensive monorepo setup guide including Bun workspaces
  
- url: https://dev.to/is_bik/how-create-bun-workspaces-and-build-it-with-docker-51c4
  why: Practical Bun workspace setup with apps/packages structure

# EXISTING PATTERNS - Follow these conventions
- file: examples/ai-design-generation/package.json
  why: Shows @aqlix-ai/ namespace convention and Bun script patterns
  critical: Use "bun build --target=node" pattern and comprehensive testing setup

- file: examples/iraqi-enterprise-auth/package.json  
  why: Iraqi-specific TypeScript configuration and cultural testing patterns
  
- file: CLAUDE.md
  why: Project requirements, Bun mandate, and Iraqi AI system standards
  critical: "Runtime: Bun (30x faster than npm) - ALWAYS use for commands"

# GOTCHAS AND ISSUES - Critical for implementation success
- issue: "Bun Issue #7547 - Auto-hoisting packages in workspace"
  critical: "bun add ALWAYS hoists packages even from workspace directories"
  solution: "Always run bun add from root, manage dependencies carefully"

- issue: "Bun Issue #9825 - Using Workspace Libraries"
  critical: "Workspace protocol syntax and resolution issues"
  solution: "Use workspace:* syntax for internal dependencies"
```

### Current Codebase Tree
```bash
C:\Users\Itokoro\Documents\projects\aqlix-ai\
├── CLAUDE.md                    # Project rules and requirements
├── PRPs/                        # Product Requirement Prompts
├── docs/                        # Project documentation  
├── examples/                    # 44 extracted component examples
│   ├── ai-design-generation/    # Shows @aqlix-ai/ namespace pattern
│   ├── iraqi-enterprise-auth/   # Iraqi-specific configs
│   └── dyad-extracted/          # 44 UI components for reference
├── initials/                    # 42 micro-initial features
└── project-context/             # Agent knowledge base

# MISSING: No workspace structure, no root package.json, no apps/ or packages/
```

### Desired Codebase Tree with Workspace Structure
```bash
C:\Users\Itokoro\Documents\projects\aqlix-ai\
├── package.json                 # ROOT: Workspace configuration
├── bun.lockb                    # Bun lock file (auto-generated)
├── tsconfig.json               # ROOT: TypeScript workspace config
├── apps/                       # APPLICATIONS
│   ├── web/                    # Frontend Next.js app
│   │   ├── package.json        # @aqlix-ai/web
│   │   ├── tsconfig.json       # Extends root config
│   │   └── src/
│   └── api/                    # Backend FastAPI + PydanticAI
│       ├── package.json        # @aqlix-ai/api  
│       ├── tsconfig.json       # Extends root config
│       └── src/
├── packages/                   # SHARED PACKAGES
│   ├── shared/                 # Common utilities
│   │   ├── package.json        # @aqlix-ai/shared
│   │   ├── tsconfig.json       # Package-specific config
│   │   └── src/
│   ├── ui/                     # Shared UI components
│   │   ├── package.json        # @aqlix-ai/ui
│   │   └── src/
│   └── arabic-nlp/             # Iraqi Arabic processing
│       ├── package.json        # @aqlix-ai/arabic-nlp
│       └── src/
├── CLAUDE.md                   # Existing project rules
├── docs/                       # Existing documentation
└── examples/                   # Existing examples for reference
```

### Known Gotchas of Bun Workspace & Iraqi AI Codebase
```javascript
// CRITICAL: Bun auto-hoists ALL dependencies to root package.json
// Issue #7547: Running "bun add lodash" from apps/web/ adds to ROOT package.json
// SOLUTION: Always run bun add from root directory, specify workspace target

// CRITICAL: Dependency hoisting conflicts
// Multiple packages with different versions cause resolution issues
// SOLUTION: Use consistent versions across workspace, leverage hoisting strategically  

// CRITICAL: Workspace protocol syntax
// Use "workspace:*" for internal dependencies to prevent npm registry lookup
// Example: "dependencies": { "@aqlix-ai/shared": "workspace:*" }

// CRITICAL: TypeScript path mapping in workspace
// Each package needs proper tsconfig.json with workspace-aware paths
// Root tsconfig.json should define paths for all packages

// IRAQI AI SPECIFIC: Arabic font loading optimization
// Shared packages should handle Arabic fonts for consistent rendering
// Cultural validation should be centralized in shared package

// PERFORMANCE: Bun builds 30x faster - leverage in all scripts
// Use "bun build --target=node" pattern from examples consistently
// Cache builds at workspace level for maximum performance
```

## Implementation Blueprint

### Data Models and Structure
```typescript
// Root workspace configuration structure
interface WorkspaceConfig {
  name: string;                    // "aqlix-ai-monorepo"
  private: boolean;                // true (prevent accidental publish)
  workspaces: string[];           // ["apps/*", "packages/*"]
  devDependencies: {              // Shared development tools
    typescript: string;
    "@types/node": string;
    // Iraqi-specific linting and cultural validation tools
  };
}

// Individual package structure  
interface PackageConfig {
  name: string;                   // "@aqlix-ai/package-name" 
  version: string;                // "1.0.0"
  dependencies: {
    [key: string]: string;        // External dependencies
  };
  devDependencies: {
    [key: string]: string;        // Package-specific dev tools
  };
  scripts: {
    build: string;                // "bun build --target=node"
    dev: string;                  // Package-specific dev command
    test: string;                 // Iraqi cultural + standard tests
  };
}
```

### Task List - Implementation Order (Dependencies First)
```yaml
Task 1 - CREATE Root Workspace Configuration:
  CREATE package.json:
    - PATTERN: Follow private: true, workspaces array structure
    - NAMESPACE: Use "aqlix-ai-monorepo" as name
    - WORKSPACES: ["apps/*", "packages/*"] 
    - SCRIPTS: Workspace-level dev, build, test commands
    - PRESERVE: No dependencies in root (individual packages manage their own)

Task 2 - CREATE Directory Structure:  
  CREATE apps/ directory:
    - PURPOSE: Applications (web frontend, api backend)
  CREATE packages/ directory:
    - PURPOSE: Shared libraries, utilities, Iraqi-specific packages

Task 3 - CREATE Shared Package Foundation:
  CREATE packages/shared/:
    - PATTERN: Mirror @aqlix-ai/ai-design-generation structure  
    - PACKAGE NAME: "@aqlix-ai/shared"
    - EXPORTS: Common utilities, types, Iraqi cultural functions
    - DEPENDENCIES: Minimal - only core utilities needed across apps

Task 4 - CREATE Sample Web Application:
  CREATE apps/web/:
    - PATTERN: Next.js application structure
    - PACKAGE NAME: "@aqlix-ai/web"  
    - DEPENDENCY: "@aqlix-ai/shared": "workspace:*"
    - SCRIPTS: Bun-based dev and build commands

Task 5 - CREATE Sample API Application:  
  CREATE apps/api/:
    - PATTERN: FastAPI + PydanticAI structure preparation
    - PACKAGE NAME: "@aqlix-ai/api"
    - DEPENDENCY: "@aqlix-ai/shared": "workspace:*" 
    - SCRIPTS: Bun-compatible where applicable

Task 6 - CONFIGURE TypeScript Workspace:
  CREATE root tsconfig.json:
    - PATHS: Define workspace path mapping for all packages
    - REFERENCES: Configure project references for build optimization
    - PATTERN: Support Iraqi Arabic text processing across packages
  MODIFY each package tsconfig.json:
    - EXTENDS: Root configuration
    - PATHS: Package-specific overrides

Task 7 - SETUP Development Scripts:  
  MODIFY root package.json scripts:
    - ADD concurrent development command
    - ADD workspace-wide testing command
    - ADD build-all command respecting dependencies
    - PATTERN: Use Bun for all commands (30x performance boost)

Task 8 - VALIDATE Complete Setup:
  TEST dependency resolution:
    - RUN "bun install" from root
    - VERIFY all packages resolve correctly
  TEST development workflow:
    - RUN concurrent dev servers
    - VERIFY hot reloading works
  TEST build pipeline:
    - BUILD all packages in dependency order
    - VERIFY TypeScript compilation across workspace
```

### Task 1 Pseudocode - Root Package.json
```json
{
  "name": "aqlix-ai-monorepo",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    // CRITICAL: Use Bun for all commands per CLAUDE.md
    "dev": "bun run --parallel dev:*",
    "dev:web": "bun --cwd apps/web run dev", 
    "dev:api": "bun --cwd apps/api run dev",
    "build": "bun run build:packages && bun run build:apps",
    "build:packages": "bun --cwd packages/shared run build",
    "build:apps": "bun run --parallel build:web build:api",
    "build:web": "bun --cwd apps/web run build",
    "build:api": "bun --cwd apps/api run build", 
    "test": "bun run --recursive test",
    "lint": "bun run --recursive lint",
    "typecheck": "bun run --recursive typecheck",
    // Iraqi-specific validation commands
    "test:cultural": "bun run --recursive test:cultural",
    "install:all": "bun install"
  },
  "devDependencies": {
    // SHARED development tools across workspace
    "typescript": "^5.3.2",
    "@types/node": "^20.10.0", 
    "bun-types": "latest",
    // Iraqi project requirements
    "eslint": "^8.54.0",
    "@typescript-eslint/eslint-plugin": "^6.13.1",
    "@typescript-eslint/parser": "^6.13.1"
  },
  "engines": {
    "node": ">=18.0.0",
    "bun": ">=1.0.0"
  }
}
```

### Task 3 Pseudocode - Shared Package Setup
```json
// packages/shared/package.json
{
  "name": "@aqlix-ai/shared",
  "version": "1.0.0",
  "description": "Shared utilities and Iraqi cultural intelligence for Iraqi AI Chat System",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    // PATTERN: Follow ai-design-generation Bun script pattern
    "build": "bun build --target=node --outdir=dist src/index.ts",
    "dev": "bun --watch src/index.ts",
    "test": "bun test",
    "test:cultural": "bun test --grep=\"Cultural\"",
    "lint": "eslint src/**/*.ts",
    "typecheck": "tsc --noEmit"
  },
  "keywords": [
    "iraqi-ai", 
    "shared-utilities",
    "cultural-intelligence",
    "arabic-processing"
  ],
  "dependencies": {
    // MINIMAL: Only core utilities needed across apps
    "zod": "^3.22.4",
    "events": "^3.3.0"
  }
}
```

### Integration Points
```yaml
WORKSPACE DEPENDENCIES:
  - protocol: "workspace:*" for all internal package references
  - hoisting: Leverage Bun's automatic hoisting for shared dependencies
  - versions: Maintain consistent versions across workspace

TYPESCRIPT INTEGRATION:
  - paths: Configure workspace-wide path mapping in root tsconfig.json
  - references: Use project references for optimized builds
  - imports: Enable absolute imports with @/ prefix for each package

DEVELOPMENT WORKFLOW:
  - ports: Allocate different ports for concurrent development
  - web: localhost:3000 (Next.js default)  
  - api: localhost:8000 (FastAPI default)
  - hot-reload: Configure for cross-package dependency updates

BUILD PIPELINE:
  - order: Build packages before applications (dependency graph)
  - caching: Leverage Bun's build caching at workspace level
  - outputs: Consistent dist/ directories across all packages
```

## Validation Loop

### Level 1: Basic Workspace Setup
```bash
# Verify Bun installation and version
bun --version
# Expected: Bun 1.x.x or higher

# Install workspace dependencies  
bun install
# Expected: Installation completes without errors, creates bun.lockb

# Verify workspace recognition
bun pm ls
# Expected: Lists all workspace packages correctly
```

### Level 2: Dependency Resolution & TypeScript
```bash
# Test workspace dependency resolution
cd packages/shared && bun run build
# Expected: Builds successfully with TypeScript compilation

# Test workspace cross-dependencies  
cd apps/web && bun run typecheck
# Expected: Can resolve "@aqlix-ai/shared" types correctly

# Test development mode
bun run dev:shared
# Expected: Starts in watch mode without errors
```

### Level 3: Full Workspace Integration
```bash
# Test concurrent development
bun run dev
# Expected: Starts all development servers on different ports
# web: http://localhost:3000, api: http://localhost:8000

# Test workspace build pipeline
bun run build
# Expected: Builds packages first, then apps, all successfully

# Test workspace testing
bun run test
# Expected: Runs tests across all packages, includes cultural validation
```

### Level 4: Iraqi AI Specific Validation
```bash  
# Test cultural validation scripts
bun run test:cultural
# Expected: Cultural compliance tests pass across workspace

# Test Arabic text processing (if implemented in shared)
cd packages/shared && bun test --grep="Arabic"
# Expected: Arabic RTL processing utilities work correctly

# Verify Iraqi naming conventions
bun pm ls | grep "@aqlix-ai/"
# Expected: All packages follow @aqlix-ai/ namespace convention
```

## Final Validation Checklist
- [ ] Root package.json created with proper workspace configuration
- [ ] Directory structure follows apps/ and packages/ organization
- [ ] All packages use @aqlix-ai/ namespace convention  
- [ ] Shared package builds and exports basic utilities
- [ ] Sample applications created and can import shared package
- [ ] TypeScript compilation works across all workspace packages
- [ ] Development servers run concurrently without port conflicts
- [ ] Build pipeline respects package dependencies
- [ ] All validation commands pass: `bun install && bun run build && bun run test`
- [ ] Workspace follows Iraqi AI project conventions from CLAUDE.md
- [ ] Performance optimized with Bun (verified 30x faster than npm equivalent)

---

## Anti-Patterns to Avoid
- ❌ Don't run `bun add` from workspace directories (auto-hoists to root)
- ❌ Don't put dependencies in root package.json (packages should be self-contained)
- ❌ Don't ignore the workspace protocol ("workspace:*") for internal deps
- ❌ Don't use inconsistent versions across packages (causes hoisting conflicts)
- ❌ Don't ignore TypeScript path mapping (breaks imports across packages)  
- ❌ Don't forget port allocation for concurrent development
- ❌ Don't skip the Iraqi naming convention (@aqlix-ai/ namespace)
- ❌ Don't use npm commands when Bun is mandated (CLAUDE.md requirement)

---

**PRP Confidence Level: 8/10**

High confidence for one-pass implementation due to:
✅ Comprehensive research of Bun workspace patterns and gotchas  
✅ Clear existing patterns from Iraqi AI codebase to follow
✅ Specific task breakdown with executable validation gates
✅ Iraqi-specific requirements integrated throughout
✅ Known issues and solutions documented

Potential risks: Bun-specific edge cases not covered in documentation, but major gotchas are well-researched and addressed.