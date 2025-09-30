name: "Environment Variables Setup PRP"
description: "Comprehensive setup for secure environment variable management across Iraqi AI Chat System monorepo with Bun native support, TypeScript validation, and cross-workspace configuration"

---

## Goal

Implement a secure, type-safe environment variable management system for the Iraqi AI Chat System that supports development, staging, and production environments across the monorepo. The system should use Bun's native environment loading, provide TypeScript type safety with Zod validation, and enable consistent environment access across all apps and packages.

## Why

- **Security First**: Proper credential management prevents API key leaks and security vulnerabilities
- **Developer Experience**: Type-safe environment variables catch configuration errors at compile time
- **Monorepo Support**: Unified environment configuration accessible across apps/web, apps/api, and shared packages
- **Deployment Confidence**: Clear separation between development, staging, and production prevents configuration errors
- **Cultural Compliance**: Environment-based configuration supports Iraqi-specific features (payment gateways, Arabic processing)

## What

Implement environment variable infrastructure that:
- Loads .env files automatically using Bun's native support
- Validates environment variables with Zod schemas for type safety
- Provides TypeScript autocompletion for all environment variables
- Separates client-side (NEXT_PUBLIC_*) and server-side environment variables
- Supports environment-specific overrides (.env.local, .env.production)
- Documents all required and optional environment variables
- Prevents sensitive credentials from being committed to version control

### Success Criteria

- [ ] .env.example files created for root, apps/web, and apps/api with all required variables documented
- [ ] Zod validation schemas implemented for environment variables with helpful error messages
- [ ] TypeScript type definitions provide autocompletion for process.env in all workspaces
- [ ] All sensitive environment files (.env, .env.local) properly ignored in .gitignore
- [ ] Environment variables accessible across apps and packages workspaces
- [ ] Validation runs at application startup and fails fast with clear error messages
- [ ] Documentation in README.md explains environment setup for new developers
- [ ] Test environment variables work correctly in test suites

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Bun Environment Variable Documentation
- url: https://bun.sh/docs/runtime/env
  why: >
    Bun automatically loads .env files with specific precedence:
    1. .env
    2. .env.production / .env.development / .env.test (based on NODE_ENV)
    3. .env.local (not loaded in test environment)

    Access via process.env, Bun.env, or import.meta.env (all typed as string | undefined)
    Supports quotes, variable expansion, and --env-file flag

- url: https://bun.sh/guides/runtime/read-env
  why: Official Bun examples for reading environment variables with TypeScript

- url: https://catalins.tech/validate-environment-variables-with-zod/
  why: >
    Complete Zod validation patterns:
    - Safe parsing with error handling: envSchema.safeParse()
    - Type inference: z.infer<typeof envSchema>
    - Extending ProcessEnv interface for global types
    - Separate client/server schemas

- url: https://github.com/af/envalid
  why: >
    Alternative validation library (if Zod doesn't fit):
    - Lightweight, TypeScript-first
    - Built-in validators: str(), bool(), num(), email(), url()
    - Custom validators with type inference

- url: https://zod.dev/
  why: Zod documentation for schema validation (already installed in apps/web)

# EXISTING CODEBASE PATTERNS
- file: examples/main_agent_reference/.env.example
  why: Reference pattern for LLM configuration variables (LLM_PROVIDER, LLM_API_KEY, etc.)

- file: .gitignore:34-39
  why: >
    Already configured to ignore:
    .env, .env.local, .env.development.local, .env.test.local, .env.production.local

- file: test/setup.ts:8-10
  why: >
    Test environment pattern:
    process.env.NODE_ENV = "test"
    process.env.TESTING = "true"

- file: apps/web/playwright.config.ts:11-15
  why: >
    Existing process.env usage:
    forbidOnly: !!process.env.CI
    retries: process.env.CI ? 2 : 0
    workers: process.env.CI ? 1 : undefined
    reuseExistingServer: !process.env.CI

# INSTALLED DEPENDENCIES
- package: zod@^3.22.4
  location: apps/web/package.json
  why: Already available for environment validation in Next.js app

- package: dotenv@^16.3.1
  location: apps/api/package.json
  why: Available for Python FastAPI backend (though Bun handles .env natively)
```

### Current Codebase Structure

```bash
aqlix-ai/
├── .env                          # ❌ DOES NOT EXIST - Need to create
├── .env.example                  # ❌ DOES NOT EXIST - Need to create
├── .gitignore                    # ✅ EXISTS - Already ignores .env files
├── apps/
│   ├── web/                      # Next.js 15 + React 19
│   │   ├── .env.local            # ❌ DOES NOT EXIST - Need to create template
│   │   ├── .env.example          # ❌ DOES NOT EXIST - Need to create
│   │   ├── package.json          # ✅ Has Zod ^3.22.4
│   │   └── src/
│   │       ├── config/           # ❌ DOES NOT EXIST - Need to create
│   │       │   └── env.ts        # ❌ DOES NOT EXIST - Zod validation here
│   │       └── types/            # ❌ DOES NOT EXIST - Need to create
│   │           └── env.d.ts      # ❌ DOES NOT EXIST - Type definitions here
│   └── api/                      # FastAPI Python backend
│       ├── .env.example          # ❌ DOES NOT EXIST - Need to create
│       ├── config/               # ❌ DOES NOT EXIST - Need to create
│       │   └── settings.py       # ❌ DOES NOT EXIST - Python env config here
│       └── package.json          # ✅ Has dotenv ^16.3.1
├── packages/                     # Shared packages
│   └── types/                    # Shared TypeScript types
│       └── src/
│           └── env.ts            # ❌ DOES NOT EXIST - Shared env types here
└── test/
    └── setup.ts                  # ✅ EXISTS - Already sets test env vars
```

### Desired Codebase Structure

```bash
aqlix-ai/
├── .env.example                  # 🆕 Root-level example with shared variables
├── apps/
│   ├── web/
│   │   ├── .env.example          # 🆕 Next.js specific variables
│   │   └── src/
│   │       ├── config/
│   │       │   └── env.ts        # 🆕 Zod validation + type-safe env object
│   │       └── types/
│   │           └── env.d.ts      # 🆕 TypeScript ProcessEnv extension
│   └── api/
│       ├── .env.example          # 🆕 API specific variables
│       └── config/
│           └── settings.py       # 🆕 Python environment configuration
├── packages/
│   └── types/
│       └── src/
│           └── env.ts            # 🆕 Shared environment variable types
└── docs/
    └── ENVIRONMENT_SETUP.md      # 🆕 Developer documentation
```

### Known Gotchas & Library Quirks

```typescript
// CRITICAL: Bun environment variable quirks

// ❌ GOTCHA 1: All env vars are string | undefined
// process.env.PORT returns string, NOT number
const port = process.env.PORT; // Type: string | undefined
const portNum = Number(process.env.PORT); // Must manually convert

// ✅ SOLUTION: Use Zod for type coercion
const envSchema = z.object({
  PORT: z.string().transform(Number).default("3000"),
});

// ❌ GOTCHA 2: .env.local not loaded in test environment
// Tests won't see variables in .env.local
if (process.env.NODE_ENV === "test") {
  // .env.local is IGNORED here
}

// ✅ SOLUTION: Use .env.test for test-specific variables
// Or set in test/setup.ts

// ❌ GOTCHA 3: Next.js requires NEXT_PUBLIC_ prefix for client-side
// Regular env vars are undefined in browser
console.log(process.env.API_KEY); // ❌ undefined in browser
console.log(process.env.NEXT_PUBLIC_API_URL); // ✅ works in browser

// ✅ SOLUTION: Separate client and server schemas
const clientEnv = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
});
const serverEnv = z.object({
  API_SECRET: z.string().min(32),
});

// ❌ GOTCHA 4: Bun loads .env files in specific order
// Later files override earlier ones:
// 1. .env
// 2. .env.production | .env.development | .env.test
// 3. .env.local

// ✅ SOLUTION: Use this hierarchy intentionally
// .env         → Defaults for all environments
// .env.local   → Local overrides (gitignored)

// ❌ GOTCHA 5: Environment variables are cached
// Changes to .env files require restart
process.env.NEW_VAR = "value"; // ❌ Won't persist across files

// ✅ SOLUTION: Always restart dev server after .env changes

// ❌ GOTCHA 6: Zod validates but doesn't prevent access
const env = envSchema.parse(process.env);
// Can still access process.env.INVALID_VAR directly

// ✅ SOLUTION: Always use validated env object, not process.env
export const env = envSchema.parse(process.env); // Use this
// DON'T use process.env.* directly after validation

// CRITICAL: Monorepo environment variable access
// Bun loads .env from CWD (current working directory)
// In monorepo, CWD matters!

// ❌ PROBLEM: Running from root vs app directory
// cd apps/web && bun dev   → Loads apps/web/.env
// bun run dev:web          → Loads root .env

// ✅ SOLUTION: Use --cwd flag in package.json scripts
"scripts": {
  "dev": "bun --cwd apps/web run dev"
}

// SECURITY: Never log environment variables
console.log(process.env); // ❌ NEVER do this in production
console.log({ env }); // ❌ Exposes all secrets

// ✅ SOLUTION: Log only non-sensitive info
console.log("Environment loaded:", {
  nodeEnv: process.env.NODE_ENV,
  hasApiKey: !!process.env.API_KEY, // Boolean check only
});
```

## Implementation Blueprint

### Data Models and Structure

Create type-safe environment configuration system:

```typescript
// packages/types/src/env.ts - Shared environment types
export interface BaseEnv {
  NODE_ENV: "development" | "production" | "test";
  LOG_LEVEL: "debug" | "info" | "warn" | "error";
}

// apps/web/src/types/env.d.ts - Extend ProcessEnv for autocompletion
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Next.js
      NODE_ENV: "development" | "production" | "test";

      // Client-side (NEXT_PUBLIC_*)
      NEXT_PUBLIC_API_URL: string;
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;

      // Server-side
      API_SECRET_KEY: string;
      DATABASE_URL: string;
      REDIS_URL?: string;

      // LLM Configuration
      LLM_PROVIDER: "openai";
      LLM_API_KEY: string;
      LLM_MODEL: string;

      // Iraqi AI Specific
      ZAINCASH_API_KEY?: string;
      FASTPAY_API_KEY?: string;
      CULTURAL_VALIDATION_ENABLED: "true" | "false";
    }
  }
}

export {};

// apps/web/src/config/env.ts - Zod validation
import { z } from "zod";

// Client environment (browser-accessible)
const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

// Server environment (server-only)
const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  API_SECRET_KEY: z.string().min(32, "API secret must be at least 32 characters"),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url().optional(),

  // LLM Configuration
  LLM_PROVIDER: z.enum(["openai"]),
  LLM_API_KEY: z.string().min(1, "LLM API key is required"),
  LLM_MODEL: z.string().min(1),

  // Iraqi AI Specific
  ZAINCASH_API_KEY: z.string().optional(),
  FASTPAY_API_KEY: z.string().optional(),
  CULTURAL_VALIDATION_ENABLED: z.enum(["true", "false"]).default("true"),
});

// Combine and validate
const envSchema = serverEnvSchema.merge(clientEnvSchema);

// Validate and export
function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Invalid environment variables:");
    console.error(result.error.flatten().fieldErrors);
    throw new Error("Environment validation failed");
  }

  return result.data;
}

export const env = validateEnv();

// Type-safe environment object
export type Env = z.infer<typeof envSchema>;
```

### Task List

```yaml
Task 1: Create root .env.example template
  Description: Create root-level .env.example with shared environment variables
  Files:
    - CREATE .env.example
  Actions:
    - Document all shared environment variables (NODE_ENV, LOG_LEVEL, etc.)
    - Add comments explaining each variable's purpose and valid values
    - Include security notes about never committing actual .env files

Task 2: Create apps/web environment configuration
  Description: Set up Next.js environment variables with Zod validation
  Files:
    - CREATE apps/web/.env.example
    - CREATE apps/web/src/config/env.ts
    - CREATE apps/web/src/types/env.d.ts
  Actions:
    - Define client-side (NEXT_PUBLIC_*) and server-side variables in .env.example
    - Implement Zod validation schema in env.ts
    - Create TypeScript type definitions in env.d.ts
    - Export type-safe env object from env.ts

Task 3: Create apps/api environment configuration
  Description: Set up Python FastAPI environment variables with pydantic validation
  Files:
    - CREATE apps/api/.env.example
    - CREATE apps/api/config/__init__.py
    - CREATE apps/api/config/settings.py
  Actions:
    - Document Python backend environment variables
    - Implement pydantic BaseSettings for validation
    - Add type hints for all environment variables
    - Export settings instance for import

Task 4: Create shared environment types
  Description: Define shared TypeScript types for environment variables
  Files:
    - CREATE packages/types/src/env.ts
  Actions:
    - Define BaseEnv interface with common variables
    - Export environment-related types
    - Document shared environment patterns

Task 5: Update .gitignore security
  Description: Ensure all sensitive environment files are ignored
  Files:
    - VERIFY .gitignore
  Actions:
    - Confirm .env patterns are ignored (already present)
    - Add any missing patterns if needed
    - Document security requirements in comments

Task 6: Create environment setup documentation
  Description: Document environment setup process for developers
  Files:
    - CREATE docs/ENVIRONMENT_SETUP.md
  Actions:
    - Document .env file creation process
    - Explain environment variable hierarchy
    - Provide troubleshooting guide
    - Include security best practices
    - Add examples for common scenarios

Task 7: Integrate environment validation in apps
  Description: Add environment validation to application startup
  Files:
    - MODIFY apps/web/src/app/layout.tsx or next.config.js
    - MODIFY apps/api/main.py
  Actions:
    - Import and run env validation at startup
    - Add helpful error messages for missing variables
    - Ensure validation fails fast before app initialization

Task 8: Update test configuration
  Description: Configure test environments properly
  Files:
    - MODIFY test/setup.ts
    - CREATE .env.test (gitignored)
  Actions:
    - Set test-specific environment variables
    - Document test environment requirements
    - Ensure .env.local not loaded in tests

Task 9: Update package.json scripts
  Description: Ensure scripts use correct working directory
  Files:
    - VERIFY package.json scripts
  Actions:
    - Check --cwd flags for monorepo commands
    - Document script usage in README
    - Ensure consistent environment loading

Task 10: Create environment validation tests
  Description: Test environment validation logic
  Files:
    - CREATE apps/web/src/config/__tests__/env.test.ts
  Actions:
    - Test successful validation with valid env vars
    - Test validation failures with missing required vars
    - Test type coercion (strings to numbers, etc.)
    - Test environment-specific loading
```

### Per Task Pseudocode

```typescript
// Task 2: apps/web/src/config/env.ts detailed implementation

import { z } from "zod";

// PATTERN: Separate client and server schemas for security
const clientEnvSchema = z.object({
  // CRITICAL: Only NEXT_PUBLIC_* variables are exposed to browser
  NEXT_PUBLIC_API_URL: z.string().url("API URL must be valid URL"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // GOTCHA: Port comes as string, transform to number
  PORT: z.string().transform(Number).default("3000"),

  // PATTERN: Minimum length validation for security
  API_SECRET_KEY: z.string().min(32, {
    message: "API secret must be at least 32 characters for security",
  }),

  DATABASE_URL: z.string().url("Database URL must be valid"),

  // PATTERN: Optional with .optional()
  REDIS_URL: z.string().url().optional(),

  // Iraqi AI specific
  LLM_PROVIDER: z.enum(["openai"], {
    errorMap: () => ({ message: "LLM provider must be openai" }),
  }),
  LLM_API_KEY: z.string().min(1, "LLM API key is required"),
  LLM_MODEL: z.string().default("gpt-4o-mini"),

  // PATTERN: Boolean as string, transform to boolean
  CULTURAL_VALIDATION_ENABLED: z
    .enum(["true", "false"])
    .transform((val) => val === "true")
    .default("true"),
});

// Merge schemas
const envSchema = serverEnvSchema.merge(clientEnvSchema);

// CRITICAL: Validation function with helpful error messages
function validateEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error("❌ Environment validation failed:");
    console.error("Missing or invalid environment variables:\n");

    // PATTERN: Helpful error formatting
    const errors = parsed.error.flatten().fieldErrors;
    Object.entries(errors).forEach(([key, messages]) => {
      console.error(`  ${key}:`);
      messages?.forEach((msg) => console.error(`    - ${msg}`));
    });

    console.error("\n💡 Check .env.example for required variables");

    throw new Error("Invalid environment configuration");
  }

  return parsed.data;
}

// PATTERN: Validate immediately on import
export const env = validateEnv();

// PATTERN: Export type for consumers
export type Env = z.infer<typeof envSchema>;

// SECURITY: Only export validated env, never process.env directly
// ❌ export { process.env }  // NEVER do this
// ✅ export { env }           // Use validated object
```

```typescript
// Task 7: Integration in apps/web/next.config.js

// PATTERN: Validate environment at build time
import "./src/config/env.js"; // Import to trigger validation

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js config here
  reactStrictMode: true,

  // PATTERN: Only NEXT_PUBLIC_* variables are bundled
  env: {
    // Don't manually specify - Next.js handles NEXT_PUBLIC_* automatically
  },
};

export default nextConfig;
```

```python
# Task 3: apps/api/config/settings.py implementation

from pydantic_settings import BaseSettings
from typing import Literal

class Settings(BaseSettings):
    """
    Environment configuration for Iraqi AI Chat System API.
    Uses pydantic-settings for automatic .env loading and validation.
    """

    # Application
    NODE_ENV: Literal["development", "production", "test"] = "development"
    PORT: int = 8000
    LOG_LEVEL: Literal["DEBUG", "INFO", "WARNING", "ERROR"] = "INFO"

    # Security
    API_SECRET_KEY: str  # Required, no default
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]

    # Database
    DATABASE_URL: str
    REDIS_URL: str | None = None

    # LLM Configuration
    LLM_PROVIDER: Literal["openai"]
    LLM_API_KEY: str
    LLM_MODEL: str = "gpt-4o-mini"
    LLM_BASE_URL: str = "https://api.openai.com/v1"

    # Iraqi AI Specific
    ZAINCASH_API_KEY: str | None = None
    FASTPAY_API_KEY: str | None = None
    CULTURAL_VALIDATION_ENABLED: bool = True

    class Config:
        # PATTERN: Pydantic automatically loads .env files
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

        # GOTCHA: Validate on initialization
        validate_assignment = True

# PATTERN: Create singleton instance
settings = Settings()

# SECURITY: Validate required fields
if not settings.API_SECRET_KEY:
    raise ValueError("API_SECRET_KEY must be set in environment")
if len(settings.API_SECRET_KEY) < 32:
    raise ValueError("API_SECRET_KEY must be at least 32 characters")
```

### Integration Points

```yaml
APPS/WEB (Next.js):
  - import: apps/web/src/config/env.ts in app/layout.tsx
  - validation: Runs at build time via next.config.js import
  - usage: Import { env } from "@/config/env" throughout app
  - pattern: Use env.API_URL not process.env.API_URL

APPS/API (Python):
  - import: apps/api/config/settings.py in main.py
  - validation: Settings() validates on instantiation
  - usage: from config.settings import settings
  - pattern: settings.DATABASE_URL not os.getenv("DATABASE_URL")

PACKAGES (Shared):
  - import: packages/types/src/env.ts for shared types
  - usage: Import types in other packages
  - pattern: Define types once, use everywhere

TESTS:
  - setup: test/setup.ts sets process.env.NODE_ENV = "test"
  - files: Use .env.test for test-specific variables
  - pattern: Mock environment in tests, don't rely on .env.local

CI/CD:
  - environment: GitHub Actions secrets mapped to env vars
  - validation: Same validation runs in CI as locally
  - pattern: Fail fast if validation fails in CI
```

## Validation Loop

### Level 1: TypeScript & Linting

```bash
# Run type checking first
cd apps/web
bun run typecheck
# Expected: No errors, env types should resolve correctly

# Check for unused environment variables
grep -r "process.env\." src/ --exclude-dir=node_modules
# Expected: No direct process.env usage except in config/env.ts

# Verify TypeScript can resolve env types
# Open apps/web/src/config/env.ts in IDE
# Expected: Autocompletion works for env.API_URL etc.
```

### Level 2: Environment Validation Tests

```typescript
// apps/web/src/config/__tests__/env.test.ts

import { describe, it, expect, beforeEach } from "bun:test";
import { z } from "zod";

// Test the validation logic directly
describe("Environment Validation", () => {
  // PATTERN: Save and restore process.env
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  it("should validate correct environment variables", () => {
    process.env = {
      NODE_ENV: "development",
      NEXT_PUBLIC_API_URL: "http://localhost:8000",
      NEXT_PUBLIC_SUPABASE_URL: "https://test.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-key",
      API_SECRET_KEY: "a".repeat(32), // 32 chars minimum
      DATABASE_URL: "postgresql://localhost:5432/test",
      LLM_PROVIDER: "openai",
      LLM_API_KEY: "sk-test",
      LLM_MODEL: "gpt-4o-mini",
    };

    // Re-import to trigger validation
    expect(() => {
      // Validation logic here
    }).not.toThrow();
  });

  it("should fail on missing required variables", () => {
    process.env = {
      NODE_ENV: "development",
      // Missing required variables
    };

    expect(() => {
      // Validation should throw
    }).toThrow("Environment validation failed");
  });

  it("should fail on invalid URL format", () => {
    process.env = {
      ...process.env,
      NEXT_PUBLIC_API_URL: "not-a-url", // Invalid URL
    };

    expect(() => {
      // Validation should throw
    }).toThrow();
  });

  it("should apply default values correctly", () => {
    process.env = {
      // Minimal required vars
      NEXT_PUBLIC_API_URL: "http://localhost:8000",
      NEXT_PUBLIC_SUPABASE_URL: "https://test.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-key",
      API_SECRET_KEY: "a".repeat(32),
      DATABASE_URL: "postgresql://localhost:5432/test",
      LLM_PROVIDER: "openai",
      LLM_API_KEY: "sk-test",
      // NODE_ENV should default to "development"
      // LLM_MODEL should default to "gpt-4o-mini"
    };

    // Validate defaults are applied
  });
});
```

```bash
# Run environment tests
cd apps/web
bun test src/config/__tests__/env.test.ts

# Expected output:
# ✓ should validate correct environment variables
# ✓ should fail on missing required variables
# ✓ should fail on invalid URL format
# ✓ should apply default values correctly
#
# 4 tests passed
```

### Level 3: Integration Test

```bash
# Test 1: Verify .env.example files exist
test -f .env.example && echo "✅ Root .env.example exists"
test -f apps/web/.env.example && echo "✅ Web .env.example exists"
test -f apps/api/.env.example && echo "✅ API .env.example exists"

# Test 2: Copy examples and start apps
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env

# Fill in required values (in real scenario)
# For testing, use minimal valid values

# Test 3: Verify apps start without validation errors
cd apps/web
bun run dev &
WEB_PID=$!
sleep 5

# Check if Next.js started successfully
curl -s http://localhost:3000 | grep -q "200" || echo "❌ Web app failed to start"

# Kill dev server
kill $WEB_PID

# Test 4: Verify validation catches errors
echo "INVALID_URL=not-a-url" >> apps/web/.env.local
bun run dev 2>&1 | grep -q "Environment validation failed" && echo "✅ Validation catches errors"

# Clean up
rm apps/web/.env.local
```

### Level 4: Security Verification

```bash
# Verify no .env files committed
git ls-files | grep -E "^\.env$|\.env\.local$" && echo "❌ SECURITY: .env files in git!" || echo "✅ No .env files committed"

# Verify .gitignore coverage
grep -q "^\.env$" .gitignore && echo "✅ .env ignored"
grep -q "\.env\.local" .gitignore && echo "✅ .env.local ignored"

# Check for hardcoded secrets in code
grep -r "sk-[a-zA-Z0-9]\{32,\}" apps/ --exclude-dir=node_modules && echo "❌ Potential API key in code!" || echo "✅ No hardcoded API keys found"

# Verify no env vars in package.json
grep -r "API_KEY\|SECRET" package.json apps/*/package.json && echo "⚠️  Check if these should be in .env" || echo "✅ No secrets in package.json"
```

## Final Validation Checklist

- [ ] All .env.example files created with comprehensive documentation
- [ ] Zod validation schemas implemented in apps/web/src/config/env.ts
- [ ] Python pydantic validation in apps/api/config/settings.py
- [ ] TypeScript type definitions provide autocompletion
- [ ] All tests pass: `bun test apps/web/src/config/__tests__/`
- [ ] No linting errors: `bun run lint`
- [ ] No type errors: `bun run typecheck`
- [ ] Apps start successfully with example .env files
- [ ] Validation catches missing/invalid variables
- [ ] No .env files committed to git
- [ ] Security verification passes (no hardcoded secrets)
- [ ] Documentation created in docs/ENVIRONMENT_SETUP.md
- [ ] README.md updated with environment setup instructions

## Anti-Patterns to Avoid

```typescript
// ❌ Don't access process.env directly after validation
import { env } from "@/config/env";
const apiUrl = process.env.NEXT_PUBLIC_API_URL; // ❌ WRONG

// ✅ Use validated env object
const apiUrl = env.NEXT_PUBLIC_API_URL; // ✅ CORRECT

// ❌ Don't use string comparison for booleans
if (process.env.ENABLED === "true") { } // ❌ Fragile

// ✅ Transform to boolean in schema
const schema = z.object({
  ENABLED: z.enum(["true", "false"]).transform(v => v === "true"),
});

// ❌ Don't silently ignore validation errors
try {
  validateEnv();
} catch (e) {
  console.log("Env validation failed, using defaults"); // ❌ DANGEROUS
}

// ✅ Fail fast with clear errors
const env = validateEnv(); // Throws if invalid

// ❌ Don't commit .env files
git add .env  // ❌ NEVER

// ✅ Only commit .env.example
git add .env.example  // ✅ SAFE

// ❌ Don't log environment variables
console.log(process.env); // ❌ Exposes secrets

// ✅ Log only non-sensitive info
console.log("Environment:", process.env.NODE_ENV); // ✅ SAFE

// ❌ Don't mix client and server env vars
const serverEnv = z.object({
  NEXT_PUBLIC_API_URL: z.string(), // ❌ NEXT_PUBLIC in server schema
  API_SECRET: z.string(),
});

// ✅ Separate client and server schemas
const clientEnv = z.object({
  NEXT_PUBLIC_API_URL: z.string(),
});
const serverEnv = z.object({
  API_SECRET: z.string(),
});
```

---

## PRP Confidence Score: 9/10

**Justification:**
- ✅ **Comprehensive Context**: All Bun documentation, Zod patterns, and security best practices included
- ✅ **Existing Patterns**: Leverages installed dependencies (Zod, dotenv) and existing .gitignore
- ✅ **Clear Implementation Path**: Step-by-step tasks with detailed pseudocode
- ✅ **Executable Validation**: All validation gates are runnable bash commands and tests
- ✅ **Error Handling**: Comprehensive gotchas and anti-patterns documented
- ✅ **Security Focused**: Multiple security checks and best practices
- ✅ **Monorepo Support**: Handles workspace-specific and shared environment variables
- ⚠️ **Minor Gap**: Python API configuration needs FastAPI/uvicorn startup integration details (not critical for MVP)

**Why not 10/10:**
Minor uncertainty in Python FastAPI startup integration with environment validation - may need to verify exact import location in `apps/api/main.py` (which doesn't exist yet). However, pydantic-settings pattern is well-established and should work first-pass.

**One-Pass Implementation Confidence:** Very High (95%+)
- All research is comprehensive and recent (2025)
- Patterns are proven and well-documented
- Validation is executable and comprehensive
- Security is properly addressed
- Beginner-friendly complexity matches the scope

---

**Implementation Time Estimate:** 2-3 hours for complete setup including documentation and tests

**Follow-up PRPs Needed:** None - this is foundational infrastructure. Future PRPs will consume these environment variables.
