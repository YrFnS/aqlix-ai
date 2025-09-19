name: "Supabase Client Setup PRP"
description: |

## Purpose
Comprehensive setup of Supabase client connection for the Iraqi AI Chat System with TypeScript integration, environment-based configuration, and basic authentication client initialization.

## Core Principles
1. **Context is King**: All necessary documentation, examples, and caveats included
2. **Validation Loops**: Executable tests and lints for self-validation
3. **Information Dense**: Keywords and patterns from existing codebase
4. **Progressive Success**: Start simple, validate, then enhance
5. **Global rules**: Follow all rules in CLAUDE.md

---

## Goal
Set up core Supabase client connection infrastructure for the Iraqi AI Chat System workspace that provides secure database connectivity, authentication client setup, and basic TypeScript integration. The end state should be a reusable client pattern that supports future feature additions without complex database operations or schemas.

## Why
- **Foundation Infrastructure**: Core requirement for all database operations in the system
- **Security Foundation**: Proper credential management and secure connection patterns
- **Development Efficiency**: TypeScript integration for better developer experience
- **Scalability Preparation**: Client setup that supports future feature additions
- **Integration Ready**: Basic authentication client for future auth system integration

## What
Developers will be able to import and use Supabase client with proper TypeScript support, environment-based configuration, and basic authentication setup. The implementation provides connection management, error handling, and reusable client patterns.

### Success Criteria
- [ ] Supabase client connects successfully to database
- [ ] Environment variables properly configured and validated
- [ ] TypeScript integration working with type safety and autocompletion
- [ ] Authentication client initialized and accessible
- [ ] Connection errors handled gracefully with proper logging
- [ ] Reusable singleton client pattern established
- [ ] Import patterns work correctly across different environments

## All Needed Context

### Documentation & References (MUST READ - Include these in your context window)
```yaml
- url: https://supabase.com/docs/reference/javascript/installing
  why: Client installation methods, package setup, and basic configuration

- url: https://supabase.com/docs/reference/javascript/typescript-support
  why: TypeScript integration patterns, type generation, and client typing

- url: https://supabase.com/docs/reference/javascript/auth-api
  why: Authentication client setup patterns and configuration options

- file: examples/kortix-suna-extracted/backend/services/supabase.py
  why: Existing Python singleton pattern to mirror in TypeScript implementation

- file: examples/lobe-chat-desktop-extracted/offline-manager.ts
  why: TypeScript client usage example with createClient pattern

- file: examples/kortix-suna-extracted/frontend/basejump/user-account-button.tsx
  why: Frontend client import pattern and server client usage

- file: examples/pydantic-ai-agents-extracted/requirements.txt
  why: Shows supabase>=2.0.0 dependency and related packages
```

### Current Codebase tree (run `tree` in the root of the project to get an overview)
```bash
# Main structure observed:
.
├── examples/               # Reference implementations with Supabase patterns
├── initials/               # Template requirements (including this one)
├── PRPs/                   # Product Requirement Prompts
├── CLAUDE.md               # Global rules and standards
└── package.json files     # Multiple in examples/ showing Bun usage patterns
```

### Desired Codebase tree with files to be added and responsibility of file
```bash
lib/
├── supabase/
│   ├── types.ts           # TypeScript type definitions from schema
│   ├── config.ts          # Environment variable validation and configuration
│   ├── client.ts          # Client-side Supabase client setup
│   ├── server.ts          # Server-side Supabase client setup
│   └── index.ts           # Main export file with unified interface
└── __tests__/
    └── supabase/
        ├── config.test.ts      # Environment validation tests
        ├── client.test.ts      # Client initialization tests
        └── connection.test.ts  # Integration connection tests
```

### Known Gotchas of our codebase & Library Quirks
```typescript
// CRITICAL: @supabase/supabase-js requires proper singleton pattern
// Example: Multiple client instances cause connection pool issues
// Example: Environment variables must be validated before client creation
// Example: TypeScript types need generation via CLI: supabase gen types typescript

// GOTCHA: Missing environment variables throw runtime errors
if (!process.env.SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL environment variable')
}

// GOTCHA: Auth client configuration differs for server vs client
// Server components need: autoRefreshToken: false, persistSession: false
// Client components use defaults: autoRefreshToken: true, persistSession: true

// GOTCHA: Connection timeout problems need retry logic
// Pattern from examples/kortix-suna-extracted/backend/services/supabase.py
// Use create_async_client for async operations

// PATTERN: Environment priority - SERVICE_ROLE_KEY over ANON_KEY for backend
const supabaseKey = config.SUPABASE_SERVICE_ROLE_KEY || config.SUPABASE_ANON_KEY

// PATTERN: Thread-safe singleton from Python example to mirror in TypeScript
// Use module-level singleton with lazy initialization

// CRITICAL: Follow CLAUDE.md standards - Use Bun commands not npm
// bun run dev, bun run build, bun test, bun run lint, bun run typecheck
```

## Implementation Blueprint

### Data models and structure

Create the core configuration and client models to ensure type safety and consistency.
```typescript
// Environment configuration interface
interface SupabaseConfig {
  url: string
  anonKey: string
  serviceRoleKey?: string
}

// Client configuration for different environments
interface ClientOptions {
  auth?: {
    autoRefreshToken?: boolean
    persistSession?: boolean
    detectSessionInUrl?: boolean
  }
}

// Error handling types
interface ConnectionError extends Error {
  code: string
  details?: string
}
```

### List of tasks to be completed to fulfill the PRP in the order they should be completed

```yaml
Task 1:
CREATE lib/supabase/types.ts:
  - DEFINE TypeScript interfaces for Supabase configuration
  - INCLUDE environment variable types and client option types
  - PREPARE for future database type generation
  - EXPORT all types for reuse across modules

Task 2:
CREATE lib/supabase/config.ts:
  - MIRROR pattern from: examples/kortix-suna-extracted/backend/services/supabase.py (environment validation)
  - IMPLEMENT environment variable validation with clear error messages
  - PROVIDE configuration getter with fallback patterns
  - INCLUDE logging for configuration status (following Iraqi error handling patterns)

Task 3:
CREATE lib/supabase/client.ts:
  - MIRROR pattern from: examples/lobe-chat-desktop-extracted/offline-manager.ts (createClient usage)
  - IMPLEMENT client-side Supabase client with singleton pattern
  - CONFIGURE for browser environment (autoRefreshToken: true, persistSession: true)
  - INCLUDE connection error handling and retry logic

Task 4:
CREATE lib/supabase/server.ts:
  - MIRROR pattern from: examples/kortix-suna-extracted/frontend/basejump/user-account-button.tsx (server client)
  - IMPLEMENT server-side Supabase client configuration
  - CONFIGURE for server environment (autoRefreshToken: false, persistSession: false)
  - PRIORITIZE SERVICE_ROLE_KEY over ANON_KEY for backend operations

Task 5:
CREATE lib/supabase/index.ts:
  - EXPORT unified interface for both client and server
  - PROVIDE convenient imports for different use cases
  - INCLUDE basic authentication client exports
  - MAINTAIN clean API surface for consumers

Task 6:
CREATE tests for validation:
  - TEST environment variable validation (config.test.ts)
  - TEST client initialization success and failure scenarios (client.test.ts)
  - TEST actual connection to Supabase (connection.test.ts)
  - VALIDATE TypeScript type safety across all modules
```

### Per task pseudocode as needed added to each task

```typescript
// Task 1: Types
export interface SupabaseConfig {
  url: string
  anonKey: string
  serviceRoleKey?: string
}

export interface ClientOptions {
  auth?: AuthOptions
}

// Task 2: Config validation
export function validateSupabaseConfig(): SupabaseConfig {
  // PATTERN: Always validate environment first (see Python DBConnection)
  const url = process.env.SUPABASE_URL
  const anonKey = process.env.SUPABASE_ANON_KEY

  if (!url || !anonKey) {
    // PATTERN: Structured error messages from existing codebase
    throw new ConnectionError('Missing required Supabase environment variables')
  }

  return { url, anonKey, serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY }
}

// Task 3: Client-side client
let clientInstance: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  // PATTERN: Lazy singleton initialization
  if (!clientInstance) {
    const config = validateSupabaseConfig()
    clientInstance = createClient(config.url, config.anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  }
  return clientInstance
}

// Task 4: Server-side client
export async function createServerClient(): Promise<SupabaseClient> {
  const config = validateSupabaseConfig()
  // PRIORITY: Use service role key for backend operations
  const key = config.serviceRoleKey || config.anonKey

  return createClient(config.url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  })
}
```

### Integration Points
```yaml
ENVIRONMENT:
  - add to: .env.local (development) and .env (production)
  - pattern: "SUPABASE_URL=https://your-project.supabase.co"
  - pattern: "SUPABASE_ANON_KEY=your-anon-key"
  - pattern: "SUPABASE_SERVICE_ROLE_KEY=your-service-role-key"

TYPESCRIPT:
  - add to: tsconfig.json paths mapping if needed
  - pattern: "paths": { "@/lib/*": ["lib/*"] }

PACKAGE:
  - add dependency: "@supabase/supabase-js": "^2.39.0" (latest stable)
  - verify with: bun add @supabase/supabase-js

IMPORTS:
  - client usage: "import { getSupabaseClient } from '@/lib/supabase'"
  - server usage: "import { createServerClient } from '@/lib/supabase/server'"
  - types usage: "import type { SupabaseConfig } from '@/lib/supabase/types'"
```

## Validation Loop

### Level 1: Syntax & Style
```bash
# Run these FIRST - fix any errors before proceeding
bun run typecheck                    # TypeScript type checking
bun run lint                         # Code linting (from CLAUDE.md standards)

# Expected: No errors. If errors, READ the error and fix.
```

### Level 2: Unit Tests each new feature/file/function use existing test patterns
```typescript
// CREATE lib/__tests__/supabase/config.test.ts
describe('Supabase Configuration', () => {
  test('validates required environment variables', () => {
    // Test missing SUPABASE_URL throws error
    delete process.env.SUPABASE_URL
    expect(() => validateSupabaseConfig()).toThrow('Missing required')
  })

  test('returns valid configuration', () => {
    process.env.SUPABASE_URL = 'https://test.supabase.co'
    process.env.SUPABASE_ANON_KEY = 'test-key'
    const config = validateSupabaseConfig()
    expect(config.url).toBe('https://test.supabase.co')
  })
})

// CREATE lib/__tests__/supabase/client.test.ts
describe('Supabase Client', () => {
  test('creates singleton client instance', () => {
    const client1 = getSupabaseClient()
    const client2 = getSupabaseClient()
    expect(client1).toBe(client2) // Same instance
  })

  test('client has auth configured', () => {
    const client = getSupabaseClient()
    expect(client.auth).toBeDefined()
  })
})

// CREATE lib/__tests__/supabase/connection.test.ts
describe('Supabase Connection', () => {
  test('connects to Supabase successfully', async () => {
    const client = getSupabaseClient()
    // Test basic connection (this requires valid env vars)
    const { data, error } = await client.from('test').select('*').limit(1)
    expect(error).toBeNull()
  })
})
```

```bash
# Run and iterate until passing:
bun test lib/__tests__/supabase
# If failing: Read error, understand root cause, fix code, re-run (never mock to pass)
```

### Level 3: Integration Test
```bash
# Verify environment setup
echo "Testing environment variables..."
node -e "console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? 'SET' : 'MISSING')"

# Test the client import and initialization
node -e "
const { getSupabaseClient } = require('./lib/supabase');
const client = getSupabaseClient();
console.log('Client initialized:', !!client);
console.log('Auth available:', !!client.auth);
"

# Expected:
# - Environment variables properly set
# - Client initialized: true
# - Auth available: true
# If error: Check environment setup and configuration
```

## Final validation Checklist
- [ ] All tests pass: `bun test lib/__tests__/supabase`
- [ ] No linting errors: `bun run lint`
- [ ] No type errors: `bun run typecheck`
- [ ] Manual connection test successful: `node -e "const client = require('./lib/supabase').getSupabaseClient(); console.log('Connected:', !!client)"`
- [ ] Environment validation working correctly
- [ ] Both client and server configurations tested
- [ ] Import patterns work from external modules
- [ ] Authentication client accessible and functional
- [ ] Error cases handled gracefully with informative messages
- [ ] Singleton pattern preventing multiple connections
- [ ] TypeScript autocompletion working in IDE

---

## Anti-Patterns to Avoid
- ❌ Don't create multiple client instances - use singleton pattern
- ❌ Don't skip environment validation - validate before client creation
- ❌ Don't use sync patterns for async operations
- ❌ Don't hardcode URLs or keys - always use environment variables
- ❌ Don't ignore connection errors - implement proper error handling
- ❌ Don't mix client and server configurations - keep them separate
- ❌ Don't assume environment variables exist - always validate first

---

## PRP Quality Score: 9/10

**Confidence Level for One-Pass Implementation: 9/10**

**Reasoning:**
- ✅ All necessary documentation URLs and examples provided
- ✅ Existing codebase patterns clearly referenced for mirroring
- ✅ Known gotchas and library quirks explicitly documented
- ✅ Step-by-step implementation tasks with clear dependencies
- ✅ Executable validation commands using project standards (Bun)
- ✅ Comprehensive test cases covering edge cases
- ✅ Integration points clearly specified
- ✅ Anti-patterns explicitly called out to prevent common mistakes
- ✅ Clear success criteria and validation checklist

**Potential Issues:**
- Minor: Actual Supabase project credentials needed for full integration testing
- Minor: Database schema may not exist yet for complete type generation

This PRP provides comprehensive context and validation for successful one-pass implementation of the Supabase client setup foundation.