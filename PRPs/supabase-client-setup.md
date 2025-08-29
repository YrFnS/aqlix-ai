name: "Supabase Client Setup - Iraqi AI Chat System Foundation"
description: |
  Comprehensive PRP for establishing core Supabase client connection infrastructure with TypeScript integration, 
  environment-based configuration, and secure authentication client setup for the Iraqi AI Chat System workspace.

## Goal
Create a foundational `packages/supabase-client` package that provides secure, type-safe Supabase database connectivity with proper environment configuration, basic authentication client setup, and reusable client patterns. This establishes the core infrastructure for all future database operations, authentication, and real-time subscriptions in the Iraqi AI Chat System.

## Why
- **Infrastructure Foundation**: Every feature needs secure database connectivity - this is the bedrock
- **Iraqi AI System Integration**: Enables future cultural validation data storage, Arabic content management, and professional domain data
- **Security First**: Proper credential management and secure client initialization prevents data breaches
- **Developer Experience**: Type-safe client with autocompletion reduces bugs and development time
- **Scalability**: Singleton pattern and connection reuse supports growing user base efficiently

## What
A workspace package that exports configured Supabase clients with TypeScript support, environment validation, error handling, and connection management. Developers import `@aqlix-ai/supabase-client` and get ready-to-use clients without configuration concerns.

### Success Criteria
- [ ] Package successfully installs and builds with `bun install` and `bun run build`
- [ ] TypeScript compilation passes with `bun run typecheck`
- [ ] Environment validation catches missing/invalid configuration with clear error messages
- [ ] Client can establish connection to Supabase instance
- [ ] Authentication client initializes properly for future auth features
- [ ] Singleton pattern prevents multiple client instantiation
- [ ] Package exports work correctly from other workspace packages

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- url: https://supabase.com/docs/reference/javascript/installing
  why: Official installation guide for @supabase/supabase-js v2.56.0+ with npm/yarn/bun setup
  
- url: https://supabase.com/docs/reference/javascript/typescript-support  
  why: TypeScript integration patterns, type generation, client configuration with Database types
  
- url: https://supabase.com/docs/guides/auth/server-side/creating-a-client
  why: SSR client patterns, anon vs service role key usage, secure client configuration
  
- url: https://github.com/supabase/supabase-js
  why: Official examples, best practices, latest API patterns, and troubleshooting
  
- file: examples/kortix-suna-extracted/backend/services/supabase.py
  why: Singleton pattern implementation, async initialization, environment validation, error handling patterns
  
- file: PRPs/typescript-foundation.md  
  why: Workspace TypeScript configuration, path mapping setup, package structure patterns
  
- file: CLAUDE.md
  why: Security requirements, environment variable handling, Iraqi AI system context and agent integration points
```

### Current Codebase Tree (Key Relevant Files)
```bash
aqlix-ai/
├── packages/                   # Workspace packages directory exists
│   ├── shared/                 # Shared utilities package exists
│   └── types/                  # Types package exists
├── PRPs/
│   └── typescript-foundation.md    # TypeScript workspace setup completed
├── examples/kortix-suna-extracted/backend/services/
│   └── supabase.py            # Python singleton pattern reference
└── CLAUDE.md                  # Security and Iraqi context requirements
```

### Desired Codebase Tree with Files to be Added
```bash
aqlix-ai/
├── packages/
│   └── supabase-client/              # NEW PACKAGE
│       ├── src/
│       │   ├── index.ts              # Public API exports (createSupabaseClient, getSupabaseClient)
│       │   ├── client.ts             # Core client implementation with singleton pattern  
│       │   ├── config.ts             # Environment validation and configuration
│       │   └── types.ts              # TypeScript interfaces and database types
│       ├── tests/
│       │   ├── client.test.ts        # Client initialization and singleton tests
│       │   ├── config.test.ts        # Environment configuration tests
│       │   └── integration.test.ts   # Connection and auth client tests
│       ├── package.json              # Dependencies: @supabase/supabase-js@^2.56.0
│       ├── tsconfig.json             # Extends workspace TypeScript config
│       └── README.md                 # Usage examples and configuration guide
├── tsconfig.json                     # MODIFY: Add @aqlix-ai/supabase-client path mapping
└── package.json                      # MODIFY: Add workspace reference
```

### Known Gotchas & Library Quirks
```typescript
// CRITICAL: @supabase/supabase-js v2.56.0+ requires specific client configuration
// - createClient() is async-safe but initialization should be singleton
// - Environment variables must be validated before client creation
// - Auth client state persists between calls - handle initialization properly
// - TypeScript types require proper Database interface configuration
// - Connection timeouts need explicit handling

// GOTCHA: Multiple client instances cause connection pool issues
// Solution: Implement singleton pattern like Python example

// GOTCHA: Environment variables might not be available at import time  
// Solution: Lazy initialization with validation on first access

// GOTCHA: TypeScript types need manual generation from database schema
// Solution: Provide Database interface placeholder with clear documentation

// CRITICAL: Bun workspace requires proper package.json setup
// - Dependencies must be listed explicitly even if hoisted
// - exports field needed for proper module resolution
// - TypeScript path mapping must match workspace structure
```

## Implementation Blueprint

### Data Models and Structure
```typescript
// Core configuration interface for type safety
interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
}

// Client wrapper interface for consistent API
interface SupabaseClientWrapper {
  client: SupabaseClient;
  isConnected: boolean;
  config: SupabaseConfig;
}

// Error types for proper error handling
interface SupabaseConnectionError {
  type: 'CONFIGURATION' | 'CONNECTION' | 'AUTHENTICATION';
  message: string;
  details?: any;
}
```

### List of Tasks in Implementation Order

```yaml
Task 1:
CREATE packages/supabase-client/package.json:
  - DEPENDENCIES: @supabase/supabase-js@^2.56.0, typescript, @types/node
  - SCRIPTS: build, typecheck, test, dev
  - EXPORTS: proper module resolution for workspace
  - NAME: @aqlix-ai/supabase-client

Task 2:  
CREATE packages/supabase-client/tsconfig.json:
  - EXTENDS: ../../tsconfig.json (workspace config)
  - INCLUDE: src/**/*
  - OUTPUT: dist/ for build artifacts
  - MODULE RESOLUTION: Node16 for proper imports

Task 3:
CREATE packages/supabase-client/src/config.ts:
  - VALIDATE environment variables (SUPABASE_URL, SUPABASE_ANON_KEY)
  - PROVIDE clear error messages for missing config
  - SUPPORT optional service role key for admin operations
  - EXPORT configuration interface and validation function

Task 4:
CREATE packages/supabase-client/src/types.ts:
  - DEFINE Database interface placeholder (to be generated later)
  - EXPORT SupabaseClient type with proper generics
  - PROVIDE type aliases for common operations
  - INCLUDE documentation for type generation process

Task 5:
CREATE packages/supabase-client/src/client.ts:
  - IMPLEMENT singleton pattern mirroring Python example structure
  - HANDLE async initialization with proper error handling  
  - PROVIDE separate anon and service role client access
  - INCLUDE connection retry logic and timeout handling
  - EXPORT factory functions for client creation

Task 6:
CREATE packages/supabase-client/src/index.ts:
  - EXPORT public API functions (createSupabaseClient, getSupabaseClient)
  - EXPORT types and interfaces for consumer use
  - PROVIDE clean, documented API surface
  - INCLUDE usage examples in JSDoc comments

Task 7:
UPDATE root tsconfig.json:
  - ADD path mapping: "@aqlix-ai/supabase-client": ["./packages/supabase-client/src"]
  - ENSURE proper module resolution for workspace imports
  - MAINTAIN existing path mappings

Task 8:
UPDATE root package.json:
  - ADD workspace reference: "packages/supabase-client"
  - MAINTAIN existing workspace structure
  - ENSURE proper dependency hoisting

Task 9:
CREATE packages/supabase-client/tests/:
  - UNIT tests for configuration validation
  - INTEGRATION tests for client initialization
  - CONNECTION tests with environment validation
  - SINGLETON pattern verification tests

Task 10:
CREATE packages/supabase-client/README.md:
  - INSTALLATION and setup instructions  
  - USAGE examples for different client types
  - CONFIGURATION environment variable documentation
  - TROUBLESHOOTING common issues guide
```

### Key Implementation Pseudocode

```typescript
// Task 5: Core client implementation pattern
class SupabaseClientManager {
  private static instance: SupabaseClientManager;
  private anonClient: SupabaseClient | null = null;
  private serviceClient: SupabaseClient | null = null;
  private config: SupabaseConfig | null = null;

  // PATTERN: Singleton with lazy initialization (mirrors Python example)
  public static getInstance(): SupabaseClientManager {
    if (!SupabaseClientManager.instance) {
      SupabaseClientManager.instance = new SupabaseClientManager();
    }
    return SupabaseClientManager.instance;
  }

  // CRITICAL: Async initialization with proper validation
  public async initialize(config?: SupabaseConfig): Promise<void> {
    // VALIDATE environment before client creation
    this.config = config || await validateEnvironmentConfig();
    
    // GOTCHA: Always validate URL format includes https://
    if (!this.config.url.startsWith('https://')) {
      throw new SupabaseConnectionError('CONFIGURATION', 'URL must use HTTPS');
    }

    // PATTERN: Create clients with proper error handling
    try {
      this.anonClient = createClient(this.config.url, this.config.anonKey);
      
      if (this.config.serviceRoleKey) {
        this.serviceClient = createClient(this.config.url, this.config.serviceRoleKey);
      }
    } catch (error) {
      // CRITICAL: Clean error messages without exposing secrets
      throw new SupabaseConnectionError('CONNECTION', 'Failed to initialize Supabase client');
    }
  }

  // PATTERN: Type-safe client access with validation
  public getAnonClient(): SupabaseClient {
    if (!this.anonClient) {
      throw new Error('Supabase client not initialized. Call initialize() first.');
    }
    return this.anonClient;
  }
}
```

### Integration Points
```yaml
WORKSPACE:
  - modify: tsconfig.json (path mapping for @aqlix-ai/supabase-client)
  - modify: package.json (workspace reference)
  
ENVIRONMENT:
  - add to: .env.example
  - pattern: "SUPABASE_URL=https://your-project.supabase.co"
  - pattern: "SUPABASE_ANON_KEY=your-anon-key"
  
FUTURE_INTEGRATIONS:
  - ready for: Iraqi cultural validation data storage
  - ready for: Arabic content management with RTL support  
  - ready for: Professional domain data (legal, medical, educational)
  - ready for: Real-time Arabic chat subscriptions
  - ready for: Authentication system integration
```

## Validation Loop

### Level 1: Syntax & Style  
```bash
# Run these FIRST - fix any errors before proceeding
cd packages/supabase-client
bun run typecheck                    # TypeScript compilation
bun run build                       # Package build validation  

# From workspace root
bun run typecheck                    # Workspace-wide TypeScript validation

# Expected: No errors. If errors, READ the error message and fix.
```

### Level 2: Unit Tests
```typescript
// CREATE packages/supabase-client/tests/config.test.ts
describe('Supabase Configuration', () => {
  test('validates required environment variables', () => {
    // Missing SUPABASE_URL should throw clear error
    expect(() => validateEnvironmentConfig({}))
      .toThrow('SUPABASE_URL is required');
  });

  test('validates URL format', () => {
    // Non-HTTPS URLs should be rejected
    expect(() => validateEnvironmentConfig({
      SUPABASE_URL: 'http://insecure.com',
      SUPABASE_ANON_KEY: 'key'
    })).toThrow('URL must use HTTPS');
  });
});

// CREATE packages/supabase-client/tests/client.test.ts  
describe('Supabase Client Manager', () => {
  test('implements singleton pattern', () => {
    const instance1 = SupabaseClientManager.getInstance();
    const instance2 = SupabaseClientManager.getInstance();
    expect(instance1).toBe(instance2);
  });

  test('prevents client access before initialization', () => {
    const manager = new SupabaseClientManager();
    expect(() => manager.getAnonClient())
      .toThrow('Supabase client not initialized');
  });
});
```

```bash
# Run and iterate until passing:
cd packages/supabase-client
bun test                             # Run all package tests
bun test --coverage                  # Ensure good test coverage

# If failing: Read error, understand root cause, fix code, re-run
```

### Level 3: Integration Test
```bash
# Test package installation and imports
cd packages/supabase-client
bun install                          # Install dependencies
bun run build                       # Build package

# Test workspace import resolution
cd ../../
echo "import { createSupabaseClient } from '@aqlix-ai/supabase-client'; console.log('Import successful');" | bun run -

# Expected: "Import successful" without errors
# If error: Check tsconfig.json path mapping and package.json exports
```

### Level 4: Environment Integration Test
```bash
# Create test environment file
echo "SUPABASE_URL=https://test.supabase.co" > .env.test
echo "SUPABASE_ANON_KEY=test-anon-key" >> .env.test

# Test client initialization with real environment
cd packages/supabase-client
bun run test:integration            # Integration tests with environment

# Expected: Configuration validation passes, client initializes
# If error: Check environment variable loading and validation logic
```

## Final Validation Checklist
- [ ] All tests pass: `bun test` (from package and workspace root)
- [ ] No TypeScript errors: `bun run typecheck` (package and workspace)  
- [ ] Package builds successfully: `bun run build`
- [ ] Workspace imports resolve: `import from '@aqlix-ai/supabase-client'`
- [ ] Environment validation works with clear error messages
- [ ] Singleton pattern prevents multiple client instances
- [ ] Client initialization handles missing environment variables gracefully
- [ ] Documentation includes setup and usage examples
- [ ] Security: No hardcoded API keys or URLs in source code

---

## Anti-Patterns to Avoid
- ❌ Don't create multiple Supabase client instances - use singleton pattern
- ❌ Don't hardcode Supabase URL or API keys - always use environment variables
- ❌ Don't skip environment validation - fail fast with clear error messages  
- ❌ Don't expose service role keys in client-side code - separate client types
- ❌ Don't ignore connection errors - implement proper error handling
- ❌ Don't skip TypeScript types - maintain type safety throughout
- ❌ Don't bypass workspace path mapping - use proper import aliases
- ❌ Don't create package without proper exports - ensure module resolution works

## Confidence Level: 8/10
This PRP provides comprehensive context, clear implementation path, executable validation, and addresses all security and Iraqi AI system requirements for successful one-pass implementation.