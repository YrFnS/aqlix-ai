name: "Supabase Client Setup for Iraqi AI Chat System"
description: |
  Complete Product Requirement Prompt for setting up Supabase JavaScript client
  with TypeScript integration, environment-based configuration, and proper client
  patterns for Next.js 15 App Router architecture.

---

## Goal

Set up a production-ready Supabase client infrastructure for the Iraqi AI Chat System that provides:
- Type-safe database operations with generated TypeScript types
- Secure authentication client for both server and client components
- Environment-based configuration following security best practices
- Proper client patterns for Next.js 15 App Router (no singleton pattern)
- Reusable client utilities in a shared workspace package

## Why

- **Database Foundation**: Supabase client is the core infrastructure for all database operations, authentication, real-time features, and storage
- **Type Safety**: TypeScript integration prevents runtime errors and provides excellent developer experience with autocomplete
- **Security**: Proper client setup ensures API keys are never exposed and Row Level Security (RLS) is respected
- **Scalability**: Correct client patterns enable the app to scale without authentication or connection issues
- **Iraqi AI Integration**: Provides foundation for cultural validation storage, Arabic text processing results, and professional domain data

## What

Implement Supabase client infrastructure with the following user-visible behavior:

### Functional Requirements

1. **Client Package Installation**
   - Install `@supabase/supabase-js` (v2.x latest) for JavaScript client
   - Install `@supabase/ssr` for server-side rendering support
   - Install as workspace dependency in `packages/` for shared use

2. **TypeScript Type Generation**
   - Generate database types from Supabase schema
   - Create type definitions file: `packages/types/src/database.types.ts`
   - Provide type-safe query builders for all tables

3. **Environment Configuration**
   - Use existing environment variables from `.env.example`
   - Validate required environment variables at startup
   - Support both development and production environments

4. **Client Implementations**
   - **Browser Client**: For Client Components (using anon key)
   - **Server Client**: For Server Components, Server Actions, Route Handlers (using cookies)
   - **Admin Client**: For backend operations (using service role key)

5. **Error Handling**
   - Graceful connection error handling
   - Clear error messages for missing environment variables
   - Type-safe error responses

### Success Criteria

- [ ] Supabase packages installed and configured in workspace
- [ ] Database types generated and accessible from `@iraqi-ai/types`
- [ ] Client utilities exported from a shared package
- [ ] Browser client works in Client Components
- [ ] Server client works in Server Components with proper auth
- [ ] Admin client available for backend operations
- [ ] Environment validation catches missing configuration
- [ ] TypeScript provides full autocomplete for database operations
- [ ] Zero TypeScript errors in client implementation
- [ ] Client utilities pass unit tests
- [ ] Example usage documented for developers

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Official Supabase Documentation

- url: https://supabase.com/docs/reference/javascript/initializing
  why: Core createClient API and initialization patterns
  critical: Shows proper client creation with type parameters

- url: https://supabase.com/docs/reference/javascript/typescript-support
  why: TypeScript integration patterns and type generation
  critical: Explains Database type usage and type inference

- url: https://supabase.com/docs/guides/api/rest/generating-types
  why: Type generation from database schema using Supabase CLI
  critical: Commands for generating types from remote/local database

- url: https://supabase.com/docs/guides/auth/server-side/nextjs
  why: Next.js App Router specific client patterns
  critical: DO NOT use singleton pattern - create fresh clients each time

- url: https://supabase.com/docs/guides/auth/server-side/creating-a-client
  why: Server-side client creation with cookies for auth
  critical: Shows proper SSR client setup with @supabase/ssr

- url: https://github.com/supabase/supabase-js
  why: Official supabase-js GitHub repository with examples
  critical: Latest API patterns and TypeScript examples

- url: https://github.com/orgs/supabase/discussions/26936
  why: Discussion on singleton pattern for Next.js App Router
  critical: Confirms best practice is to create fresh clients, not singletons

# Codebase References

- file: examples/kortix-suna-extracted/backend/services/supabase.py
  why: Python async Supabase client with singleton pattern
  note: DO NOT use singleton pattern for JavaScript/TypeScript Next.js clients

- file: .env.example
  why: Root environment variable structure for Supabase
  critical: Shows SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY

- file: apps/web/.env.example
  why: Next.js specific environment variables with NEXT_PUBLIC_ prefix
  critical: Shows client-safe vs server-only variables

- file: packages/api-client/package.json
  why: Example workspace package structure
  pattern: Use for creating new supabase-client package

- file: packages/types/package.json
  why: Shared types package structure
  pattern: Add generated database types here
```

### Current Codebase Structure

```bash
iraqi-ai-chat-system/
├── apps/
│   ├── web/                      # Next.js 15 frontend
│   │   ├── src/
│   │   │   ├── app/             # App Router pages
│   │   │   ├── components/      # React components
│   │   │   └── lib/             # Utility functions
│   │   ├── .env.example         # Frontend environment template
│   │   └── package.json
│   └── api/                      # Python FastAPI backend
│       └── .env.example          # Backend environment template
├── packages/                     # Shared workspace packages
│   ├── types/                   # TypeScript type definitions
│   │   ├── src/
│   │   │   └── index.ts
│   │   └── package.json
│   ├── api-client/              # API client utilities
│   ├── features/                # Business logic
│   ├── ui/                      # UI components
│   └── arabic-nlp/              # Arabic processing
├── .env.example                 # Root environment template
└── package.json                 # Root workspace config (Bun)
```

### Desired Codebase Structure (Files to Add)

```bash
packages/
├── supabase-client/                    # NEW: Shared Supabase client package
│   ├── src/
│   │   ├── index.ts                   # Main exports
│   │   ├── browser.ts                 # Browser client (Client Components)
│   │   ├── server.ts                  # Server client (Server Components)
│   │   ├── admin.ts                   # Admin client (Backend operations)
│   │   └── env.ts                     # Environment validation
│   ├── package.json                   # Package config
│   └── tsconfig.json                  # TypeScript config
├── types/
│   ├── src/
│   │   ├── database.types.ts          # NEW: Generated Supabase types
│   │   └── index.ts                   # Export database types
│   └── package.json                   # Update dependencies

apps/web/src/
├── lib/
│   └── supabase/                      # NEW: Next.js client utilities
│       ├── client.ts                  # Client Component client
│       ├── server.ts                  # Server Component client
│       └── middleware.ts              # Auth middleware helpers

# Testing
packages/supabase-client/
└── tests/
    ├── browser.test.ts                # Browser client tests
    ├── server.test.ts                 # Server client tests
    └── env.test.ts                    # Environment validation tests
```

### Known Gotchas & Library Quirks

```typescript
// CRITICAL: Supabase + Next.js App Router specific gotchas

// ❌ DO NOT use singleton pattern for Next.js App Router
// Source: https://github.com/orgs/supabase/discussions/26936
// The createClient function should be called fresh each time
class SupabaseClient {
  private static instance: SupabaseClient;
  // DON'T DO THIS! ❌
}

// ✅ CORRECT: Create fresh client instances
export function createClient() {
  return createSupabaseClient(url, key); // New instance each call
}

// CRITICAL: Next.js environment variable prefixes
// - NEXT_PUBLIC_* variables are exposed to browser (bundled in JavaScript)
// - Regular variables are server-side only
// - NEVER use NEXT_PUBLIC_ for service_role key!

// ❌ WRONG: Service role key with NEXT_PUBLIC_ prefix
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=xxx // NEVER DO THIS! ❌

// ✅ CORRECT: Service role key server-only
SUPABASE_SERVICE_ROLE_KEY=xxx // Server-only ✅
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx // Client-safe ✅

// CRITICAL: Server Component client requires cookies
// Source: https://supabase.com/docs/guides/auth/server-side/nextjs
import { cookies } from 'next/headers';

export function createServerClient() {
  const cookieStore = cookies(); // MUST call cookies() first
  return createClient(url, key, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      // ... implement set, remove
    },
  });
}

// CRITICAL: Type generation requires Supabase CLI
// Install: npm i supabase --save-dev
// Generate types BEFORE implementing client
// Remote: npx supabase gen types typescript --project-id "xxx" > types.ts
// Local: npx supabase gen types typescript --local > types.ts

// GOTCHA: @supabase/ssr package is required for SSR
// Don't try to implement cookie handling manually
// Use: npm install @supabase/ssr

// GOTCHA: Anon key is safe ONLY when Row Level Security (RLS) is enabled
// Always enable RLS on production tables
// Verify RLS policies before using anon key in browser

// CRITICAL: TypeScript generic type for createClient
import type { Database } from '@iraqi-ai/types';

const supabase = createClient<Database>(url, key);
// Without <Database> type, you lose autocomplete! ❌

// GOTCHA: Bun native TypeScript support
// Our project uses Bun, so no need for ts-node or tsx
// Run directly: bun run src/index.ts

// CRITICAL: Workspace package references
// In package.json: "@iraqi-ai/types": "workspace:*"
// Bun resolves workspace: protocol automatically
```

## Implementation Blueprint

### Phase 1: Package Setup and Installation

**Task 1.1: Install Supabase packages in root**

```bash
# Install Supabase client packages
cd packages/
bun add @supabase/supabase-js@latest @supabase/ssr@latest
```

**Task 1.2: Create supabase-client package structure**

```bash
CREATE packages/supabase-client/
├── src/
│   ├── index.ts
│   ├── browser.ts
│   ├── server.ts
│   ├── admin.ts
│   └── env.ts
├── package.json
└── tsconfig.json
```

**Task 1.3: Configure package.json for supabase-client**

```json
{
  "name": "@iraqi-ai/supabase-client",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": "./dist/index.js",
    "./browser": "./dist/browser.js",
    "./server": "./dist/server.js",
    "./admin": "./dist/admin.js"
  },
  "scripts": {
    "build": "bun run build:types && bun run build:js",
    "build:types": "tsc --declaration --emitDeclarationOnly --outDir dist",
    "build:js": "bun build src/index.ts --outdir dist --format esm",
    "dev": "bun --watch src/index.ts",
    "test": "bun test",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@iraqi-ai/types": "workspace:*",
    "@supabase/supabase-js": "^2.39.0",
    "@supabase/ssr": "^0.0.10"
  },
  "devDependencies": {
    "@types/bun": "latest",
    "typescript": "^5.3.3"
  }
}
```

### Phase 2: Type Generation

**Task 2.1: Install Supabase CLI as dev dependency**

```bash
# In root directory
bun add -d supabase
```

**Task 2.2: Generate TypeScript types from Supabase database**

```bash
# Option 1: From remote Supabase project (RECOMMENDED for initial setup)
npx supabase gen types typescript \
  --project-id "your-project-id" \
  > packages/types/src/database.types.ts

# Option 2: From local Supabase instance (for local development)
# First start local Supabase: npx supabase start
npx supabase gen types typescript --local \
  > packages/types/src/database.types.ts
```

**Task 2.3: Export database types from @iraqi-ai/types package**

MODIFY `packages/types/src/index.ts`:
```typescript
// Export existing types
export * from './chat.types';
export * from './user.types';
// ... other existing exports

// Export Supabase database types
export type { Database, Tables, Enums } from './database.types';
```

### Phase 3: Environment Validation

**Task 3.1: Create environment validation utility**

CREATE `packages/supabase-client/src/env.ts`:
```typescript
/**
 * Environment variable validation for Supabase client
 * Ensures required configuration is present before client initialization
 */

export interface SupabaseEnv {
  url: string;
  anonKey: string;
  serviceRoleKey?: string; // Optional, only for server-side admin operations
}

export class SupabaseEnvError extends Error {
  constructor(message: string) {
    super(`Supabase Environment Error: ${message}`);
    this.name = 'SupabaseEnvError';
  }
}

/**
 * Validate and retrieve browser-safe Supabase environment variables
 * Uses NEXT_PUBLIC_ prefixed variables safe for client-side
 */
export function getBrowserEnv(): Omit<SupabaseEnv, 'serviceRoleKey'> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new SupabaseEnvError(
      'Missing required browser environment variables. ' +
      'Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
    );
  }

  return { url, anonKey };
}

/**
 * Validate and retrieve server-side Supabase environment variables
 * Uses non-prefixed variables for server-only access
 */
export function getServerEnv(): SupabaseEnv {
  // For server, we can use either NEXT_PUBLIC_ or non-prefixed
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey) {
    throw new SupabaseEnvError(
      'Missing required server environment variables. ' +
      'Ensure SUPABASE_URL and SUPABASE_ANON_KEY are set.'
    );
  }

  return { url, anonKey, serviceRoleKey };
}

/**
 * Validate admin environment variables (requires service role key)
 */
export function getAdminEnv(): Required<SupabaseEnv> {
  const { url, anonKey, serviceRoleKey } = getServerEnv();

  if (!serviceRoleKey) {
    throw new SupabaseEnvError(
      'Missing SUPABASE_SERVICE_ROLE_KEY for admin operations. ' +
      'Admin client requires service role key for elevated permissions.'
    );
  }

  return { url, anonKey, serviceRoleKey };
}
```

### Phase 4: Client Implementations

**Task 4.1: Implement browser client for Client Components**

CREATE `packages/supabase-client/src/browser.ts`:
```typescript
/**
 * Supabase client for browser/Client Components
 * Safe for use in React Client Components that run in the browser
 * Uses anon key which is safe when Row Level Security (RLS) is enabled
 */

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@iraqi-ai/types';
import { getBrowserEnv } from './env';

/**
 * Create a Supabase client for browser/Client Components
 *
 * IMPORTANT: Create fresh instances, DO NOT use singleton pattern
 * Source: https://github.com/orgs/supabase/discussions/26936
 *
 * @example
 * 'use client';
 * import { createClient } from '@iraqi-ai/supabase-client/browser';
 *
 * export function MyComponent() {
 *   const supabase = createClient();
 *   // Use supabase for queries, auth, etc.
 * }
 */
export function createClient() {
  const { url, anonKey } = getBrowserEnv();

  return createBrowserClient<Database>(url, anonKey);
}

/**
 * Type-safe reference to Supabase client instance
 * Use this type for function parameters and component props
 */
export type SupabaseBrowserClient = ReturnType<typeof createClient>;
```

**Task 4.2: Implement server client for Server Components**

CREATE `packages/supabase-client/src/server.ts`:
```typescript
/**
 * Supabase client for Server Components and Server Actions
 * Properly handles cookies for authentication in Next.js App Router
 * Uses @supabase/ssr for server-side rendering support
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@iraqi-ai/types';
import { getServerEnv } from './env';

/**
 * Create a Supabase client for Server Components
 *
 * IMPORTANT: Create fresh instances, DO NOT use singleton pattern
 * CRITICAL: Must call cookies() to opt out of Next.js caching
 * Source: https://supabase.com/docs/guides/auth/server-side/nextjs
 *
 * @example
 * import { createClient } from '@iraqi-ai/supabase-client/server';
 *
 * export default async function ServerComponent() {
 *   const supabase = createClient();
 *   const { data } = await supabase.from('users').select();
 *   return <div>{JSON.stringify(data)}</div>;
 * }
 */
export function createClient() {
  const { url, anonKey } = getServerEnv();
  const cookieStore = cookies();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch (error) {
          // Server Component cannot set cookies after rendering
          // This is expected during Server Component rendering
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options });
        } catch (error) {
          // Server Component cannot remove cookies after rendering
        }
      },
    },
  });
}

/**
 * Create a Supabase client for Server Actions and Route Handlers
 * Allows setting and removing cookies during mutations
 *
 * @example
 * 'use server';
 * import { createActionClient } from '@iraqi-ai/supabase-client/server';
 *
 * export async function signIn(formData: FormData) {
 *   const supabase = createActionClient();
 *   await supabase.auth.signInWithPassword({
 *     email: formData.get('email'),
 *     password: formData.get('password'),
 *   });
 * }
 */
export function createActionClient() {
  const { url, anonKey } = getServerEnv();
  const cookieStore = cookies();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        cookieStore.set({ name, value: '', ...options });
      },
    },
  });
}

/**
 * Type-safe reference to Supabase server client instance
 */
export type SupabaseServerClient = ReturnType<typeof createClient>;
```

**Task 4.3: Implement admin client for backend operations**

CREATE `packages/supabase-client/src/admin.ts`:
```typescript
/**
 * Supabase admin client for backend operations
 * Uses service role key for elevated permissions
 * BYPASSES Row Level Security (RLS) - use with extreme caution!
 *
 * SECURITY WARNING:
 * - Service role key has admin privileges
 * - Bypasses all RLS policies
 * - Should NEVER be exposed to client-side code
 * - Use only in server-side code (API routes, Server Actions)
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@iraqi-ai/types';
import { getAdminEnv } from './env';

/**
 * Create a Supabase admin client with service role key
 *
 * SECURITY: Service role key bypasses Row Level Security!
 * Only use for:
 * - Administrative operations
 * - System-level data access
 * - Backend automation tasks
 *
 * DO NOT use for:
 * - User-facing queries (use server client instead)
 * - Any client-side code
 * - Operations that should respect RLS
 *
 * @example
 * import { createAdminClient } from '@iraqi-ai/supabase-client/admin';
 *
 * export async function deleteUser(userId: string) {
 *   const supabase = createAdminClient();
 *   // Admin operations that bypass RLS
 *   await supabase.auth.admin.deleteUser(userId);
 * }
 */
export function createAdminClient() {
  const { url, serviceRoleKey } = getAdminEnv();

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Type-safe reference to Supabase admin client instance
 */
export type SupabaseAdminClient = ReturnType<typeof createAdminClient>;
```

**Task 4.4: Create main package exports**

CREATE `packages/supabase-client/src/index.ts`:
```typescript
/**
 * @iraqi-ai/supabase-client
 *
 * Supabase client utilities for Iraqi AI Chat System
 * Provides type-safe database access with proper Next.js App Router patterns
 *
 * @example
 * // Client Component
 * import { createClient } from '@iraqi-ai/supabase-client/browser';
 *
 * // Server Component
 * import { createClient } from '@iraqi-ai/supabase-client/server';
 *
 * // Admin operations
 * import { createAdminClient } from '@iraqi-ai/supabase-client/admin';
 */

// Re-export environment utilities
export { getBrowserEnv, getServerEnv, getAdminEnv, SupabaseEnvError } from './env';
export type { SupabaseEnv } from './env';

// Re-export client types for convenience
export type { SupabaseBrowserClient } from './browser';
export type { SupabaseServerClient } from './server';
export type { SupabaseAdminClient } from './admin';

// Note: Actual client creation functions are exported from subpaths
// to prevent importing server code in browser and vice versa
```

### Phase 5: Next.js Integration Utilities

**Task 5.1: Create Next.js client utilities**

CREATE `apps/web/src/lib/supabase/client.ts`:
```typescript
/**
 * Client Component Supabase utilities for Next.js
 * Re-exports from @iraqi-ai/supabase-client for convenience
 */

'use client';

export { createClient } from '@iraqi-ai/supabase-client/browser';
export type { SupabaseBrowserClient } from '@iraqi-ai/supabase-client';
```

CREATE `apps/web/src/lib/supabase/server.ts`:
```typescript
/**
 * Server Component Supabase utilities for Next.js
 * Re-exports from @iraqi-ai/supabase-client for convenience
 */

export { createClient, createActionClient } from '@iraqi-ai/supabase-client/server';
export type { SupabaseServerClient } from '@iraqi-ai/supabase-client';
```

CREATE `apps/web/src/lib/supabase/middleware.ts`:
```typescript
/**
 * Middleware utilities for Supabase auth in Next.js
 * Handles token refresh for authenticated routes
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from '@iraqi-ai/types';

/**
 * Update session in middleware
 * Refreshes authentication tokens for protected routes
 *
 * IMPORTANT: Must be called in middleware.ts for auth to work properly
 * Source: https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Refresh session if needed
  await supabase.auth.getUser();

  return response;
}
```

CREATE `apps/web/src/middleware.ts`:
```typescript
/**
 * Next.js middleware for authentication and protected routes
 */

import { updateSession } from './lib/supabase/middleware';

export async function middleware(request: any) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

### Phase 6: Testing

**Task 6.1: Create environment validation tests**

CREATE `packages/supabase-client/tests/env.test.ts`:
```typescript
import { describe, test, expect, beforeEach } from 'bun:test';
import { getBrowserEnv, getServerEnv, getAdminEnv, SupabaseEnvError } from '../src/env';

describe('Environment Validation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment before each test
    process.env = { ...originalEnv };
  });

  describe('getBrowserEnv', () => {
    test('should return valid browser environment', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

      const env = getBrowserEnv();
      expect(env.url).toBe('https://test.supabase.co');
      expect(env.anonKey).toBe('test-anon-key');
    });

    test('should throw error when URL is missing', () => {
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

      expect(() => getBrowserEnv()).toThrow(SupabaseEnvError);
    });

    test('should throw error when anon key is missing', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';

      expect(() => getBrowserEnv()).toThrow(SupabaseEnvError);
    });
  });

  describe('getServerEnv', () => {
    test('should return valid server environment', () => {
      process.env.SUPABASE_URL = 'https://test.supabase.co';
      process.env.SUPABASE_ANON_KEY = 'test-anon-key';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';

      const env = getServerEnv();
      expect(env.url).toBe('https://test.supabase.co');
      expect(env.anonKey).toBe('test-anon-key');
      expect(env.serviceRoleKey).toBe('test-service-key');
    });

    test('should fallback to NEXT_PUBLIC_ variables', () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

      const env = getServerEnv();
      expect(env.url).toBe('https://test.supabase.co');
      expect(env.anonKey).toBe('test-anon-key');
    });
  });

  describe('getAdminEnv', () => {
    test('should return valid admin environment', () => {
      process.env.SUPABASE_URL = 'https://test.supabase.co';
      process.env.SUPABASE_ANON_KEY = 'test-anon-key';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';

      const env = getAdminEnv();
      expect(env.serviceRoleKey).toBe('test-service-key');
    });

    test('should throw error when service role key is missing', () => {
      process.env.SUPABASE_URL = 'https://test.supabase.co';
      process.env.SUPABASE_ANON_KEY = 'test-anon-key';

      expect(() => getAdminEnv()).toThrow(SupabaseEnvError);
    });
  });
});
```

**Task 6.2: Create client instantiation tests**

CREATE `packages/supabase-client/tests/browser.test.ts`:
```typescript
import { describe, test, expect, beforeEach } from 'bun:test';
import { createClient } from '../src/browser';

describe('Browser Client', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
  });

  test('should create client instance', () => {
    const client = createClient();
    expect(client).toBeDefined();
    expect(typeof client.from).toBe('function');
    expect(typeof client.auth.signIn).toBe('function');
  });

  test('should create different instances on each call', () => {
    const client1 = createClient();
    const client2 = createClient();
    // Instances should be different (no singleton)
    expect(client1).not.toBe(client2);
  });
});
```

CREATE `packages/supabase-client/tests/admin.test.ts`:
```typescript
import { describe, test, expect, beforeEach } from 'bun:test';
import { createAdminClient } from '../src/admin';

describe('Admin Client', () => {
  beforeEach(() => {
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_ANON_KEY = 'test-anon-key';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
  });

  test('should create admin client instance', () => {
    const client = createAdminClient();
    expect(client).toBeDefined();
    expect(typeof client.from).toBe('function');
    expect(typeof client.auth.admin.deleteUser).toBe('function');
  });

  test('should create instances with service role key', () => {
    const client = createAdminClient();
    // Admin client should have admin auth methods
    expect(client.auth.admin).toBeDefined();
  });
});
```

### Phase 7: Documentation and Examples

**Task 7.1: Create usage examples documentation**

CREATE `packages/supabase-client/README.md`:
```markdown
# @iraqi-ai/supabase-client

Type-safe Supabase client utilities for the Iraqi AI Chat System.

## Installation

This package is part of the Iraqi AI workspace and is automatically available to other workspace packages.

## Usage

### Client Components (Browser)

```typescript
'use client';

import { createClient } from '@iraqi-ai/supabase-client/browser';

export function MyComponent() {
  const supabase = createClient();

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('status', 'active');

    if (error) console.error(error);
    return data;
  };

  return <button onClick={fetchData}>Fetch Users</button>;
}
```

### Server Components

```typescript
import { createClient } from '@iraqi-ai/supabase-client/server';

export default async function ServerPage() {
  const supabase = createClient();

  const { data: users } = await supabase
    .from('users')
    .select('*');

  return (
    <div>
      {users?.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### Server Actions

```typescript
'use server';

import { createActionClient } from '@iraqi-ai/supabase-client/server';

export async function updateProfile(formData: FormData) {
  const supabase = createActionClient();

  const { error } = await supabase
    .from('profiles')
    .update({ name: formData.get('name') })
    .eq('id', formData.get('id'));

  if (error) throw error;
}
```

### Admin Operations (Server-Side Only)

```typescript
import { createAdminClient } from '@iraqi-ai/supabase-client/admin';

export async function deleteUser(userId: string) {
  const supabase = createAdminClient();

  // Bypasses RLS - use with caution!
  await supabase.auth.admin.deleteUser(userId);
}
```

## Type Safety

All clients are fully typed with your database schema:

```typescript
import type { Database } from '@iraqi-ai/types';

// TypeScript knows your table structure!
const { data } = await supabase
  .from('users') // ✅ Autocomplete available
  .select('id, name, email') // ✅ Column names validated
  .eq('status', 'active'); // ✅ Type-safe filters
```

## Security

- **Browser Client**: Uses anon key, safe for client-side when RLS is enabled
- **Server Client**: Uses anon key with cookies for user authentication
- **Admin Client**: Uses service role key, bypasses RLS - server-side only!

## Environment Variables

Required environment variables:

```bash
# Browser-safe (NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx

# Server-only (no prefix)
SUPABASE_SERVICE_ROLE_KEY=eyJxxx
```

## Best Practices

1. ✅ Create fresh client instances (no singletons)
2. ✅ Use browser client in Client Components
3. ✅ Use server client in Server Components
4. ✅ Use action client in Server Actions
5. ✅ Use admin client only when RLS bypass is required
6. ❌ Never expose service role key to browser
7. ❌ Never use singleton pattern with Next.js App Router
```

## Integration Points

```yaml
PACKAGES:
  - modify: packages/types/package.json
    action: Add @supabase/supabase-js to dependencies

  - modify: packages/types/src/index.ts
    action: Export Database types from database.types.ts

  - create: packages/supabase-client/
    action: New package with all client utilities

APPS:
  - modify: apps/web/package.json
    action: Add @iraqi-ai/supabase-client to dependencies

  - create: apps/web/src/lib/supabase/
    action: Next.js integration utilities

  - create: apps/web/src/middleware.ts
    action: Auth middleware for session management

ENVIRONMENT:
  - verify: .env.example has Supabase variables
  - verify: apps/web/.env.example has NEXT_PUBLIC_ variables
```

## Validation Loop

### Level 1: Syntax & Type Checking

```bash
# Navigate to supabase-client package
cd packages/supabase-client

# Type check the package
bun run typecheck
# Expected: No TypeScript errors

# Type check the entire workspace
cd ../..
bun run typecheck
# Expected: All packages pass type checking
```

### Level 2: Unit Tests

```bash
# Run supabase-client tests
cd packages/supabase-client
bun test

# Expected output:
# ✓ Environment Validation > getBrowserEnv > should return valid browser environment
# ✓ Environment Validation > getBrowserEnv > should throw error when URL is missing
# ✓ Environment Validation > getServerEnv > should return valid server environment
# ✓ Browser Client > should create client instance
# ✓ Browser Client > should create different instances on each call
# ✓ Admin Client > should create admin client instance

# Run all workspace tests
cd ../..
bun test
# Expected: All tests pass
```

### Level 3: Build Verification

```bash
# Build the supabase-client package
cd packages/supabase-client
bun run build

# Verify build output
ls dist/
# Expected: index.js, browser.js, server.js, admin.js, env.js, *.d.ts files

# Build entire workspace
cd ../..
bun run build
# Expected: All packages build successfully
```

### Level 4: Integration Test

```bash
# Set up test environment variables
cp .env.example .env
# Edit .env with your actual Supabase credentials

# Start Next.js dev server
bun run dev:web

# In browser, navigate to: http://localhost:3000
# Expected: No Supabase-related errors in console

# Test type generation
npx supabase gen types typescript --project-id "your-project-ref" > test-types.ts
# Expected: File generated with database types
rm test-types.ts
```

### Level 5: Manual Testing Checklist

```typescript
// Create test page: apps/web/src/app/test-supabase/page.tsx
'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export default function TestSupabasePage() {
  const [status, setStatus] = useState('Testing...');

  useEffect(() => {
    async function testConnection() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('profiles') // Use any table from your database
          .select('count')
          .limit(1);

        if (error) throw error;
        setStatus('✅ Supabase connection successful!');
      } catch (error) {
        setStatus(`❌ Error: ${error.message}`);
      }
    }

    testConnection();
  }, []);

  return <div>{status}</div>;
}
```

Navigate to http://localhost:3000/test-supabase
Expected: "✅ Supabase connection successful!"

## Final Validation Checklist

- [ ] ✅ Supabase packages installed in workspace
- [ ] ✅ Database types generated successfully
- [ ] ✅ Environment validation catches missing variables
- [ ] ✅ Browser client creates fresh instances (no singleton)
- [ ] ✅ Server client uses cookies properly
- [ ] ✅ Admin client uses service role key
- [ ] ✅ All TypeScript types resolve correctly
- [ ] ✅ No TypeScript errors in any package
- [ ] ✅ Unit tests pass (100% for env validation)
- [ ] ✅ Build produces correct output files
- [ ] ✅ Next.js dev server starts without errors
- [ ] ✅ Manual test page connects successfully
- [ ] ✅ README documentation is clear and complete
- [ ] ✅ Example usage code is tested and working
- [ ] ✅ Middleware updates session correctly
- [ ] ✅ No security warnings (service key not in client code)

---

## Anti-Patterns to Avoid

- ❌ **Singleton Pattern**: Don't cache client instances for Next.js App Router
- ❌ **Exposing Service Key**: Never use NEXT_PUBLIC_ prefix for service role key
- ❌ **Skipping Type Generation**: Generate types before implementing queries
- ❌ **Hardcoded URLs**: Always use environment variables
- ❌ **Mixing Client Types**: Use correct client for each context (browser/server/admin)
- ❌ **Forgetting Cookies**: Server client requires cookies() call
- ❌ **Manual Cookie Handling**: Use @supabase/ssr, don't implement manually
- ❌ **Ignoring RLS**: Admin client bypasses security - use with extreme caution

---

## PRP Confidence Score

**Score: 9/10** - High confidence for one-pass implementation

### Strengths:
- ✅ Comprehensive documentation with official Supabase sources
- ✅ Clear anti-patterns identified (no singleton)
- ✅ Security best practices explicitly documented
- ✅ Complete code examples for all client types
- ✅ Validation gates are executable and thorough
- ✅ Integration with existing project structure
- ✅ Type safety enforced throughout
- ✅ Iraqi AI specific context included

### Minor Risks:
- ⚠️ Type generation requires actual Supabase project (may fail if project not set up)
- ⚠️ Middleware testing requires authenticated routes (may need adjustment)

### Mitigation:
- Use placeholder types initially if database isn't ready
- Test middleware with public routes first, then add auth

This PRP provides complete context for one-pass implementation with high success probability.
