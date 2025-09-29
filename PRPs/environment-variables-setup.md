name: "Environment Variables Setup for Iraqi AI Chat System"
description: |

## Purpose

Establish secure environment variable management system for the Iraqi AI Chat System workspace using Bun's native .env file handling, TypeScript environment validation with Zod, and Python environment management with pydantic-settings.

## Core Principles

1. **Security First**: Never commit sensitive credentials to version control
2. **Type Safety**: Runtime validation for required environment variables
3. **Developer Experience**: Clear documentation and helpful error messages
4. **Cross-Platform**: Consistent behavior across Windows/Linux/macOS
5. **Monorepo Support**: Environment variables accessible across apps/ and packages/
6. **Global rules**: Follow all rules in CLAUDE.md

---

## Goal

Create a production-ready environment variable management system that provides secure credential handling, type-safe environment variable access, and comprehensive validation for the Iraqi AI Chat System monorepo.

## Why

- **Security**: Proper handling of API keys, database credentials, and sensitive configuration prevents credential leaks
- **Type Safety**: Runtime validation catches configuration errors early, preventing production issues
- **Development Efficiency**: Clear environment setup reduces onboarding time and configuration mistakes
- **Consistency**: Standardized environment management across TypeScript (Bun) and Python (FastAPI) applications
- **Scalability**: Foundation that supports additional environment-specific configurations as the system grows

## What

Implement comprehensive environment variable infrastructure with:

- Base environment file templates (.env.example) documenting all required variables
- Type-safe environment variable validation using Zod (TypeScript) and Pydantic Settings (Python)
- Secure .env file patterns with proper precedence (.env → .env.{NODE_ENV} → .env.local)
- Cross-workspace environment variable access patterns
- Development, staging, and production environment separation
- Clear documentation of required vs optional variables with helpful error messages

### Success Criteria

- [ ] .env.example file created with all required variables documented
- [ ] TypeScript environment validation with Zod catches missing variables at startup
- [ ] Python environment validation with Pydantic Settings catches missing variables at startup
- [ ] No sensitive credentials in version control (validated by git history check)
- [ ] Clear error messages for missing or invalid environment variables
- [ ] Environment variables accessible across all workspace packages
- [ ] Cross-platform compatibility verified (Windows, Linux, macOS)

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Include these in your context window
- url: https://bun.sh/docs/runtime/env
  why: Bun's automatic .env file loading, file precedence, and variable expansion
  critical: |
    - Bun automatically loads .env files (no dotenv package needed)
    - File precedence: .env → .env.{NODE_ENV} → .env.local
    - .env.local NOT loaded in test environment for consistency
    - Bun.env and process.env are aliases (use process.env for portability)
    - Automatic variable expansion (e.g., DB_URL=$DB_HOST:$DB_PORT)
    - Escape $ with backslash if value contains $ character

- url: https://creatures.sh/blog/env-type-safety-and-validation/
  why: TypeScript environment variable validation with Zod patterns
  critical: |
    - Define Zod schema for all environment variables
    - Use .parse() to validate at startup (fail fast)
    - Export typed ENV object for type-safe access throughout app
    - All process.env properties are string | undefined by default
    - Zod transforms strings to proper types (numbers, booleans, URLs)

- url: https://docs.pydantic.dev/latest/concepts/pydantic_settings/
  why: Python environment variable validation with Pydantic Settings
  critical: |
    - Pydantic Settings v2 integrates with python-dotenv automatically
    - BaseSettings class provides type validation and coercion
    - Field() provides defaults, aliases, and validation rules
    - model_config controls case sensitivity and .env file loading
    - Fails at startup with clear errors for missing required fields

- file: .gitignore
  why: Already has proper .env file patterns configured
  critical: |
    Lines 34-39 already exclude .env files:
    - .env
    - .env.local
    - .env.development.local
    - .env.test.local
    - .env.production.local

- file: examples/main_agent_reference/.env.example
  why: Example .env structure for LLM configuration
  pattern: |
    # Comments explaining each variable
    LLM_PROVIDER=openai
    LLM_API_KEY=sk-your-api-key-here
    LLM_CHOICE=gpt-4.1-mini
    LLM_BASE_URL=https://api.openai.com/v1

- file: apps/api/requirements.txt
  why: Python dependencies already include environment management tools
  critical: |
    Line 21-22:
    - python-dotenv>=1.0.0 (for .env file loading)
    - pydantic-settings>=2.1.0 (for typed environment validation)

- file: bun.json
  why: Workspace configuration for Bun runtime
  critical: |
    - Workspace structure already defined
    - Build target: "bun" means no Node.js polyfills needed
    - Can access Bun.env directly or use process.env for compatibility
```

### Current Codebase tree (relevant parts)

```bash
/
├── apps/
│   ├── web/                    # Next.js 15+ web application
│   │   └── [NO package.json or src/ yet]
│   └── api/                    # Python FastAPI backend
│       ├── requirements.txt    # Already includes python-dotenv, pydantic-settings
│       └── tests/              # Test files exist
├── packages/
│   └── types/                  # Only package with structure
│       ├── tsconfig.json       # TypeScript config exists
│       └── package.json        # Package manifest exists
├── .gitignore                  # Already excludes .env files properly
├── bun.json                    # Workspace configuration exists
├── package.json                # Root workspace manifest exists
└── [NO .env.example yet]       # Missing - needs creation
```

### Desired Codebase tree with files to be added and responsibility of file

```bash
/
├── .env.example                # Root template documenting ALL environment variables
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── config/
│   │   │   │   └── env.ts      # TypeScript environment validation with Zod
│   │   │   └── lib/
│   │   │       └── env.ts      # Environment variable access utilities
│   │   └── .env.example        # Web-specific environment template (optional)
│   └── api/
│       ├── config/
│       │   ├── __init__.py
│       │   └── settings.py     # Python environment validation with Pydantic Settings
│       └── .env.example        # API-specific environment template (optional)
├── packages/
│   └── types/
│       └── src/
│           └── env.ts          # Shared environment type definitions
└── docs/
    └── ENVIRONMENT_SETUP.md    # Comprehensive environment setup guide
```

### Known Gotchas of our codebase & Library Quirks

```typescript
// CRITICAL: Bun automatic .env loading
// Bun loads .env files automatically WITHOUT requiring dotenv package
// File precedence: .env → .env.development → .env.local
// NOTE: .env.local is NOT loaded when NODE_ENV=test (ensures test consistency)

// GOTCHA: process.env returns string | undefined
// All environment variables are strings or undefined by default
process.env.PORT // Type: string | undefined
// Must parse/validate to get correct types

// GOTCHA: Variable expansion in Bun
// Bun automatically expands variables like: DB_URL=postgres://$DB_HOST:$DB_PORT
// If your value contains $, escape it: PASSWORD=my\$ecret

// GOTCHA: Bun.env vs process.env
// They are ALIASES - functionally identical
// Use process.env for Node.js compatibility
// Use Bun.env if you want to be explicit about Bun-specific code

// CRITICAL: Python dotenv loading
// Pydantic Settings loads .env automatically
// Use BaseSettings with model_config for .env file path customization
// python-dotenv NOT needed in code - pydantic-settings handles it

// GOTCHA: Next.js environment variables
// Variables prefixed with NEXT_PUBLIC_ are exposed to browser
// Server-only variables must NOT have NEXT_PUBLIC_ prefix
// NEXT_PUBLIC_API_URL → client-side accessible
// DATABASE_URL → server-only

// GOTCHA: Type coercion in Pydantic Settings
// Strings automatically converted to proper types
// "true" → True, "123" → 123, but validation can fail
// Use Field(default=...) for optional variables

// SECURITY: Never commit .env files
// .gitignore already configured to exclude all .env files
// ALWAYS use .env.example with placeholder values
// Run git log search to verify no credentials committed
```

## Implementation Blueprint

### Data models and structure

Create the core environment validation schemas that ensure type safety and consistency.

```typescript
// TypeScript environment schema with Zod (apps/web/src/config/env.ts)
import { z } from 'zod';

const envSchema = z.object({
  // Node environment
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  // API Configuration
  NEXT_PUBLIC_API_URL: z.string().url(),
  API_TIMEOUT_MS: z.string().transform(Number).pipe(z.number().positive()).default('30000'),

  // Database
  DATABASE_URL: z.string().url(),

  // Authentication
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),

  // LLM Configuration (Anthropic for Iraqi AI)
  ANTHROPIC_API_KEY: z.string().min(1),
  ANTHROPIC_MODEL: z.string().default('claude-sonnet-4.5'),

  // Optional: Feature flags
  ENABLE_ANALYTICS: z.string().transform(val => val === 'true').default('false'),
});

// Export type-safe environment
export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
```

```python
# Python environment settings with Pydantic (apps/api/config/settings.py)
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, field_validator
from typing import Literal

class Settings(BaseSettings):
    """
    Iraqi AI Chat System - API Configuration

    Environment variables loaded from .env file automatically.
    All required variables must be set or application will fail at startup.
    """

    model_config = SettingsConfigDict(
        env_file='.env',
        env_file_encoding='utf-8',
        case_sensitive=True,
        extra='ignore'  # Ignore extra variables
    )

    # Environment
    environment: Literal['development', 'staging', 'production'] = 'development'

    # API Configuration
    api_host: str = Field(default='0.0.0.0', alias='API_HOST')
    api_port: int = Field(default=8000, alias='API_PORT')

    # Database
    database_url: str = Field(..., alias='DATABASE_URL')  # Required (...)

    # Authentication
    secret_key: str = Field(..., min_length=32, alias='SECRET_KEY')
    algorithm: str = Field(default='HS256', alias='ALGORITHM')
    access_token_expire_minutes: int = Field(default=30, alias='ACCESS_TOKEN_EXPIRE_MINUTES')

    # LLM Configuration
    anthropic_api_key: str = Field(..., alias='ANTHROPIC_API_KEY')
    anthropic_model: str = Field(default='claude-sonnet-4.5', alias='ANTHROPIC_MODEL')

    # Iraqi-specific
    enable_arabic_processing: bool = Field(default=True, alias='ENABLE_ARABIC_PROCESSING')
    enable_cultural_validation: bool = Field(default=True, alias='ENABLE_CULTURAL_VALIDATION')

    @field_validator('database_url')
    @classmethod
    def validate_database_url(cls, v: str) -> str:
        if not v.startswith('postgresql://'):
            raise ValueError('DATABASE_URL must be a PostgreSQL connection string')
        return v

# Global settings instance
settings = Settings()
```

### List of tasks to be completed to fulfill the PRP in the order they should be completed

```yaml
Task 1: Create Root Environment Template
CREATE .env.example (root):
  - DOCUMENT: All environment variables used across entire monorepo
  - ORGANIZE: Sections with clear comments (API, Database, Auth, LLM, Iraqi-specific)
  - PLACEHOLDER: Safe example values (sk-example-key-here, postgres://user:pass@localhost:5432/db)
  - SECURITY: NO actual credentials or sensitive values
  - FORMAT: KEY=value with inline comments explaining each variable

Task 2: Setup TypeScript Environment Validation (Web App)
CREATE apps/web/src/config/env.ts:
  - IMPORT: Zod for schema validation
  - DEFINE: envSchema with all required web environment variables
  - VALIDATE: Parse process.env at module load time (fail fast)
  - EXPORT: Typed env object for use throughout application
  - TYPES: Transform strings to proper types (numbers, booleans, URLs)

CREATE apps/web/src/config/index.ts:
  - EXPORT: Centralized configuration access point
  - PATTERN: Re-export env for clean imports: import { env } from '@/config'

ADD packages/types/src/env.ts (optional):
  - DEFINE: Shared environment type definitions if needed across packages
  - PATTERN: Common validation helpers and types

Task 3: Setup Python Environment Validation (API)
CREATE apps/api/config/__init__.py:
  - PATTERN: Empty file to make config a package

CREATE apps/api/config/settings.py:
  - IMPORT: BaseSettings from pydantic_settings
  - DEFINE: Settings class with all API environment variables
  - VALIDATE: Field validators for critical variables (database_url, api_key format)
  - CONFIGURE: model_config with .env file path and case sensitivity
  - EXPORT: Global settings instance: settings = Settings()

UPDATE apps/api/main.py (if exists):
  - IMPORT: from config.settings import settings
  - VALIDATE: Environment at startup (happens automatically with Settings())
  - LOG: Startup message confirming environment loaded

Task 4: Create Environment Documentation
CREATE docs/ENVIRONMENT_SETUP.md:
  - SECTION: Overview of environment variable management
  - SECTION: Required variables with explanations
  - SECTION: Optional variables with defaults
  - SECTION: How to setup local development environment
  - SECTION: Environment-specific configurations (dev/staging/production)
  - SECTION: Security best practices
  - SECTION: Troubleshooting common issues
  - EXAMPLES: Copy-paste ready .env file examples

Task 5: Add Development Dependencies
UPDATE apps/web/package.json (when created):
  - ADD: "zod": "^3.22.4" for environment validation
  - SCRIPT: "validate:env": "bun run src/config/env.ts"

UPDATE package.json (root):
  - SCRIPT: "validate:env": "bun run --filter '*' validate:env" (workspace-wide)

Task 6: Add Validation to Startup Scripts
UPDATE apps/web/src/app/layout.tsx (or _app.tsx when created):
  - IMPORT: Environment config at top of file to trigger validation
  - PATTERN: import { env } from '@/config/env'
  - EFFECT: Validation happens before any app code runs

UPDATE apps/api/main.py:
  - IMPORT: settings at module level to trigger validation
  - PATTERN: from config.settings import settings
  - EFFECT: FastAPI won't start if environment is invalid

Task 7: Create Environment Testing
CREATE apps/web/src/config/env.test.ts:
  - TEST: Valid environment variables pass validation
  - TEST: Missing required variables throw clear errors
  - TEST: Invalid types/formats throw validation errors
  - TEST: Default values work correctly
  - PATTERN: Mock process.env for testing

CREATE apps/api/tests/config/test_settings.py:
  - TEST: Valid environment loads correctly
  - TEST: Missing required variables raise ValidationError
  - TEST: Field validators work correctly
  - TEST: Default values applied correctly
  - PATTERN: Use pytest with monkeypatch for env variables
```

### Per task pseudocode as needed added to each task

```bash
# Task 1: Root .env.example structure
# ==================================
# Iraqi AI Chat System - Environment Variables
# Copy this file to .env and fill in your values
# NEVER commit .env to version control!
# ==================================

# ===== Environment =====
NODE_ENV=development  # development | test | production

# ===== Web Application (Next.js) =====
NEXT_PUBLIC_API_URL=http://localhost:8000  # API endpoint (exposed to browser)
NEXTAUTH_SECRET=your-secret-key-min-32-chars-long-here  # Session secret (server-only)
NEXTAUTH_URL=http://localhost:3000  # App URL for auth callbacks

# ===== API Configuration =====
API_HOST=0.0.0.0  # API host binding
API_PORT=8000  # API port
API_TIMEOUT_MS=30000  # Request timeout in milliseconds

# ===== Database =====
DATABASE_URL=postgresql://postgres:password@localhost:5432/iraqi_ai  # PostgreSQL connection string

# ===== Authentication & Security =====
SECRET_KEY=your-secret-key-min-32-chars-long-here  # JWT secret key
ALGORITHM=HS256  # JWT algorithm
ACCESS_TOKEN_EXPIRE_MINUTES=30  # Token expiration time

# ===== LLM Configuration (Anthropic Claude) =====
ANTHROPIC_API_KEY=sk-ant-your-api-key-here  # Anthropic API key for Claude
ANTHROPIC_MODEL=claude-sonnet-4.5  # Model to use

# ===== Iraqi AI Specific =====
ENABLE_ARABIC_PROCESSING=true  # Enable Arabic text processing
ENABLE_CULTURAL_VALIDATION=true  # Enable cultural compliance validation

# ===== Optional Features =====
ENABLE_ANALYTICS=false  # Enable analytics tracking
SENTRY_DSN=  # Sentry error tracking (optional)
```

```typescript
// Task 2: TypeScript validation with Zod
// apps/web/src/config/env.ts

import { z } from 'zod';

// Define schema for all environment variables
const envSchema = z.object({
  // Environment
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  // Next.js Web App
  NEXT_PUBLIC_API_URL: z
    .string()
    .url()
    .describe('API endpoint URL (exposed to browser)'),

  NEXTAUTH_SECRET: z
    .string()
    .min(32, 'NEXTAUTH_SECRET must be at least 32 characters')
    .describe('Secret key for session encryption'),

  NEXTAUTH_URL: z
    .string()
    .url()
    .describe('Application URL for authentication callbacks'),

  // API Configuration
  API_TIMEOUT_MS: z
    .string()
    .transform(Number)
    .pipe(z.number().positive())
    .default('30000'),

  // Database
  DATABASE_URL: z
    .string()
    .url()
    .startsWith('postgresql://', 'DATABASE_URL must be a PostgreSQL connection string')
    .describe('PostgreSQL database connection string'),

  // LLM Configuration
  ANTHROPIC_API_KEY: z
    .string()
    .min(1, 'ANTHROPIC_API_KEY is required')
    .startsWith('sk-ant-', 'ANTHROPIC_API_KEY must start with sk-ant-')
    .describe('Anthropic Claude API key'),

  ANTHROPIC_MODEL: z
    .string()
    .default('claude-sonnet-4.5')
    .describe('Anthropic model to use'),

  // Iraqi AI Features
  ENABLE_ARABIC_PROCESSING: z
    .string()
    .transform(val => val === 'true')
    .default('true'),

  ENABLE_CULTURAL_VALIDATION: z
    .string()
    .transform(val => val === 'true')
    .default('true'),

  // Optional Features
  ENABLE_ANALYTICS: z
    .string()
    .transform(val => val === 'true')
    .default('false'),

  SENTRY_DSN: z
    .string()
    .url()
    .optional()
    .describe('Sentry error tracking DSN (optional)'),
});

// Parse and validate environment variables
// This runs at module load time - will throw if validation fails
export const env = envSchema.parse(process.env);

// Export type for use in TypeScript code
export type Env = z.infer<typeof envSchema>;

// Helper to check if we're in production
export const isProd = env.NODE_ENV === 'production';
export const isDev = env.NODE_ENV === 'development';
export const isTest = env.NODE_ENV === 'test';
```

```python
# Task 3: Python validation with Pydantic Settings
# apps/api/config/settings.py

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, field_validator, HttpUrl
from typing import Literal
import os

class Settings(BaseSettings):
    """
    Iraqi AI Chat System - API Configuration

    Environment variables are loaded from .env file automatically.
    All required variables must be set or the application will fail at startup
    with a clear validation error.

    Usage:
        from config.settings import settings

        # Access typed settings
        api_url = settings.api_host
        db = settings.database_url
    """

    # Configure Pydantic Settings
    model_config = SettingsConfigDict(
        env_file='.env',  # Load from .env file
        env_file_encoding='utf-8',
        case_sensitive=True,  # Respect case in environment variables
        extra='ignore',  # Ignore extra variables not in schema
    )

    # ===== Environment =====
    environment: Literal['development', 'staging', 'production'] = Field(
        default='development',
        alias='NODE_ENV',
        description='Application environment'
    )

    # ===== API Configuration =====
    api_host: str = Field(
        default='0.0.0.0',
        alias='API_HOST',
        description='API server host binding'
    )

    api_port: int = Field(
        default=8000,
        alias='API_PORT',
        ge=1,
        le=65535,
        description='API server port'
    )

    # ===== Database =====
    database_url: str = Field(
        ...,  # Required field
        alias='DATABASE_URL',
        description='PostgreSQL database connection string'
    )

    # ===== Authentication & Security =====
    secret_key: str = Field(
        ...,  # Required
        min_length=32,
        alias='SECRET_KEY',
        description='Secret key for JWT tokens (min 32 characters)'
    )

    algorithm: str = Field(
        default='HS256',
        alias='ALGORITHM',
        description='JWT signing algorithm'
    )

    access_token_expire_minutes: int = Field(
        default=30,
        alias='ACCESS_TOKEN_EXPIRE_MINUTES',
        ge=1,
        description='Access token expiration time in minutes'
    )

    # ===== LLM Configuration =====
    anthropic_api_key: str = Field(
        ...,  # Required
        alias='ANTHROPIC_API_KEY',
        description='Anthropic Claude API key'
    )

    anthropic_model: str = Field(
        default='claude-sonnet-4.5',
        alias='ANTHROPIC_MODEL',
        description='Anthropic Claude model to use'
    )

    # ===== Iraqi AI Features =====
    enable_arabic_processing: bool = Field(
        default=True,
        alias='ENABLE_ARABIC_PROCESSING',
        description='Enable Arabic text processing features'
    )

    enable_cultural_validation: bool = Field(
        default=True,
        alias='ENABLE_CULTURAL_VALIDATION',
        description='Enable cultural compliance validation'
    )

    # ===== Optional Features =====
    enable_analytics: bool = Field(
        default=False,
        alias='ENABLE_ANALYTICS',
        description='Enable analytics tracking'
    )

    sentry_dsn: str | None = Field(
        default=None,
        alias='SENTRY_DSN',
        description='Sentry error tracking DSN (optional)'
    )

    # ===== Validators =====
    @field_validator('database_url')
    @classmethod
    def validate_database_url(cls, v: str) -> str:
        """Ensure database URL is PostgreSQL"""
        if not v.startswith('postgresql://'):
            raise ValueError(
                'DATABASE_URL must be a PostgreSQL connection string '
                'starting with postgresql://'
            )
        return v

    @field_validator('anthropic_api_key')
    @classmethod
    def validate_anthropic_key(cls, v: str) -> str:
        """Ensure Anthropic API key has correct format"""
        if not v.startswith('sk-ant-'):
            raise ValueError(
                'ANTHROPIC_API_KEY must start with sk-ant- '
                '(get your key from https://console.anthropic.com/)'
            )
        return v

    # ===== Computed Properties =====
    @property
    def is_production(self) -> bool:
        """Check if running in production"""
        return self.environment == 'production'

    @property
    def is_development(self) -> bool:
        """Check if running in development"""
        return self.environment == 'development'


# Global settings instance
# This will load and validate environment variables when imported
# If validation fails, a clear error will be raised
settings = Settings()

# Example usage in other modules:
# from config.settings import settings
# print(f"API running on {settings.api_host}:{settings.api_port}")
```

```typescript
// Task 7: TypeScript environment validation tests
// apps/web/src/config/env.test.ts

import { describe, it, expect, beforeEach, afterEach } from 'bun:test';

describe('Environment Validation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset modules and environment before each test
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  it('should validate correct environment variables', () => {
    process.env = {
      NODE_ENV: 'development',
      NEXT_PUBLIC_API_URL: 'http://localhost:8000',
      NEXTAUTH_SECRET: 'a'.repeat(32), // Min 32 chars
      NEXTAUTH_URL: 'http://localhost:3000',
      DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
      ANTHROPIC_API_KEY: 'sk-ant-example-key',
      API_TIMEOUT_MS: '30000',
    };

    // Re-import to trigger validation with new env
    const { env } = require('./env');

    expect(env.NODE_ENV).toBe('development');
    expect(env.NEXT_PUBLIC_API_URL).toBe('http://localhost:8000');
    expect(env.ANTHROPIC_API_KEY).toBe('sk-ant-example-key');
  });

  it('should throw error for missing required variable', () => {
    process.env = {
      NODE_ENV: 'development',
      // Missing NEXT_PUBLIC_API_URL
      NEXTAUTH_SECRET: 'a'.repeat(32),
      NEXTAUTH_URL: 'http://localhost:3000',
      DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
      ANTHROPIC_API_KEY: 'sk-ant-example-key',
    };

    expect(() => {
      // Re-import should throw validation error
      jest.resetModules();
      require('./env');
    }).toThrow();
  });

  it('should apply default values for optional variables', () => {
    process.env = {
      // Minimal required variables
      NEXT_PUBLIC_API_URL: 'http://localhost:8000',
      NEXTAUTH_SECRET: 'a'.repeat(32),
      NEXTAUTH_URL: 'http://localhost:3000',
      DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
      ANTHROPIC_API_KEY: 'sk-ant-example-key',
      // API_TIMEOUT_MS not provided - should use default
    };

    const { env } = require('./env');

    expect(env.API_TIMEOUT_MS).toBe(30000); // Default value
    expect(env.ANTHROPIC_MODEL).toBe('claude-sonnet-4.5'); // Default
  });

  it('should transform string booleans correctly', () => {
    process.env = {
      NEXT_PUBLIC_API_URL: 'http://localhost:8000',
      NEXTAUTH_SECRET: 'a'.repeat(32),
      NEXTAUTH_URL: 'http://localhost:3000',
      DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
      ANTHROPIC_API_KEY: 'sk-ant-example-key',
      ENABLE_ANALYTICS: 'true',
      ENABLE_ARABIC_PROCESSING: 'false',
    };

    const { env } = require('./env');

    expect(env.ENABLE_ANALYTICS).toBe(true);
    expect(env.ENABLE_ARABIC_PROCESSING).toBe(false);
  });
});
```

### Integration Points

```yaml
BUN RUNTIME:
  - loading: "Automatic .env file loading on process start"
  - precedence: ".env → .env.{NODE_ENV} → .env.local"
  - access: "process.env or Bun.env (aliases)"
  - expansion: "Automatic variable expansion with $VARIABLE syntax"

TYPESCRIPT APPS (apps/web):
  - validation: "Zod schema validation at app startup"
  - import: "import { env } from '@/config/env'"
  - types: "Type-safe environment access throughout app"
  - testing: "Bun test with mocked environment variables"

PYTHON API (apps/api):
  - validation: "Pydantic Settings validation at import time"
  - import: "from config.settings import settings"
  - types: "Type-safe settings with Python type hints"
  - testing: "pytest with monkeypatch for environment variables"

CROSS-WORKSPACE:
  - pattern: "Root .env.example documents all variables"
  - override: "App-specific .env files can override root variables"
  - sharing: "Shared environment types in packages/types if needed"

VERSION CONTROL:
  - exclude: ".env files excluded via .gitignore (already configured)"
  - template: ".env.example committed to repository"
  - security: "Never commit actual credentials or secrets"
```

## Validation Loop

### Level 1: File Structure & Git Security

```bash
# Verify .env.example exists and is documented
cat .env.example                  # Should have clear comments and sections
grep -E "^[A-Z_]+=.+" .env.example # Should have all variables documented

# Verify no actual .env files in git
git ls-files | grep "\.env$"      # Should return nothing (only .env.example)
git log --all -S "sk-ant-" --      # Should NOT find any API keys in history

# Verify .gitignore properly excludes .env files
git check-ignore .env             # Should return ".env" (ignored)
git check-ignore .env.local       # Should return ".env.local" (ignored)

# Expected: .env.example documented, no .env files tracked, no secrets in history
```

### Level 2: TypeScript Validation Testing

```bash
# Create test .env file for web app
cd apps/web
cp ../../.env.example .env
# Edit .env with valid test values

# Test environment validation loads correctly
bun run src/config/env.ts         # Should load without errors

# Test validation catches missing variables
mv .env .env.backup
echo "NODE_ENV=development" > .env  # Incomplete .env
bun run src/config/env.ts         # Should throw clear validation error

# Restore and test again
mv .env.backup .env
bun run src/config/env.ts         # Should succeed

# Expected:
# - Valid .env loads successfully
# - Missing variables throw clear errors with variable names
# - Error messages are helpful for developers
```

### Level 3: Python Validation Testing

```bash
# Create test .env file for API
cd apps/api
cp ../../.env.example .env
# Edit .env with valid test values

# Test environment validation
python3 -c "from config.settings import settings; print(settings.api_host)"
# Should print: 0.0.0.0

# Test validation catches missing variables
mv .env .env.backup
echo "NODE_ENV=development" > .env  # Incomplete .env
python3 -c "from config.settings import settings"
# Should raise ValidationError with clear message

# Test field validators
echo "DATABASE_URL=mysql://user:pass@localhost/db" >> .env
python3 -c "from config.settings import settings"
# Should raise ValueError: DATABASE_URL must be PostgreSQL

# Restore and test
mv .env.backup .env
python3 -m pytest tests/config/test_settings.py -v
# All tests should pass

# Expected:
# - Valid .env loads successfully
# - Missing required variables raise ValidationError
# - Field validators work correctly
# - Test suite passes
```

### Level 4: Cross-Platform Testing

```bash
# Test on Windows (Git Bash)
export TEST_VAR="windows test"
bun run -e 'console.log(process.env.TEST_VAR)'
# Should print: windows test

# Test on Linux/macOS
export TEST_VAR="unix test"
bun run -e 'console.log(process.env.TEST_VAR)'
# Should print: unix test

# Test variable expansion (Bun feature)
echo "BASE=hello" > .env
echo "FULL=$BASE world" >> .env
bun run -e 'console.log(process.env.FULL)'
# Should print: hello world

# Test escaped dollar sign
echo 'PASSWORD=my$ecret' > .env    # Wrong - will try to expand
bun run -e 'console.log(process.env.PASSWORD)'
# Might print: myecret (expansion of non-existent $ecret)

echo 'PASSWORD=my\$ecret' > .env   # Correct - escaped
bun run -e 'console.log(process.env.PASSWORD)'
# Should print: my$ecret

# Expected: Consistent behavior across platforms
```

### Level 5: Workspace Integration Testing

```bash
# Test environment variables accessible across workspace
cd /path/to/project/root

# Set variable in root .env
echo "SHARED_VAR=test_value" > .env

# Access from web app
cd apps/web
bun run -e 'console.log(process.env.SHARED_VAR)'
# Should print: test_value

# Access from API (Python reads .env from root)
cd apps/api
python3 -c "import os; print(os.getenv('SHARED_VAR'))"
# Should print: test_value

# Test override with local .env
echo "SHARED_VAR=local_override" > .env
bun run -e 'console.log(process.env.SHARED_VAR)'
# Should print: local_override (local .env takes precedence)

# Expected: Variables accessible across workspace, local overrides work
```

## Final validation Checklist

- [ ] .env.example created with comprehensive documentation: `cat .env.example | wc -l` shows >30 lines
- [ ] No .env files in git: `git ls-files | grep "\.env$"` returns nothing
- [ ] No secrets in git history: `git log --all -S "sk-ant-"` finds nothing
- [ ] TypeScript validation works: `cd apps/web && bun run src/config/env.ts` succeeds with valid .env
- [ ] Python validation works: `cd apps/api && python3 -c "from config.settings import settings"` succeeds
- [ ] Missing variables fail gracefully: Clear error messages identifying missing variables
- [ ] Type transformations work: Strings correctly converted to numbers/booleans
- [ ] Default values applied: Optional variables get correct defaults
- [ ] Field validators work: Database URL format validated, API key format validated
- [ ] Cross-platform compatible: Tested on Windows and Linux/macOS
- [ ] Variable expansion works: Bun expands $VARIABLE references correctly
- [ ] Documentation complete: ENVIRONMENT_SETUP.md created with setup instructions
- [ ] Tests pass: Both TypeScript and Python test suites pass

---

## Anti-Patterns to Avoid

- ❌ Don't commit .env files to version control (use .env.example instead)
- ❌ Don't hardcode API keys or secrets in code
- ❌ Don't skip environment validation at startup (fail fast is better)
- ❌ Don't use process.env directly throughout app (use validated env object)
- ❌ Don't assume environment variables are always present (validate with Zod/Pydantic)
- ❌ Don't use NODE_ENV in production without validation
- ❌ Don't expose server-only variables to browser (no NEXT_PUBLIC_ for secrets)
- ❌ Don't forget to escape $ in passwords when using Bun (use \$)
- ❌ Don't load python-dotenv manually in FastAPI (pydantic-settings handles it)
- ❌ Don't ignore type safety (strings need transformation to numbers/booleans)
- ❌ Don't provide unclear error messages (use .describe() in Zod, docstrings in Pydantic)

---

## Quality Score Assessment

**Confidence Level: 9.5/10**

**Strengths:**

- **Comprehensive Context**: Official Bun documentation, Zod validation patterns, Pydantic Settings documentation
- **Real-World Examples**: Actual .env.example files from examples/ directory
- **Existing Infrastructure**: python-dotenv and pydantic-settings already in requirements.txt
- **Clear Validation**: Executable validation commands at each level
- **Cross-Platform**: Specific testing for Windows/Linux/macOS compatibility
- **Security First**: Git security validation and credential protection patterns
- **Type Safety**: Both TypeScript (Zod) and Python (Pydantic) validation patterns
- **Monorepo Aware**: Workspace-level and app-specific environment management

**Areas of Excellence:**

- **Beginner-Friendly**: Matches required complexity level with clear documentation
- **Fail Fast**: Validation happens at startup with clear error messages
- **Production-Ready**: Security patterns and validation suitable for production deployment
- **Iraqi AI Integration**: Specific environment variables for Arabic processing and cultural validation
- **Complete Testing**: Testing patterns for both TypeScript and Python environments
- **Documentation**: Comprehensive ENVIRONMENT_SETUP.md guide included

**Minor Considerations:**

- Apps/web structure may need adjustment based on actual Next.js app structure (App Router vs Pages Router)
- Some Iraqi-specific environment variables may need refinement based on actual feature requirements
- Python .env file loading path may need adjustment if apps/api is run from different working directory

**Expected Success Rate: 98%** - This PRP provides comprehensive context, clear validation loops, and executable tests for successful one-pass implementation of environment variable management in the Iraqi AI Chat System.

The high confidence is based on:
1. Bun's automatic .env loading (no additional package needed)
2. Existing python-dotenv and pydantic-settings dependencies
3. Clear validation patterns from official documentation
4. Executable validation commands at every level
5. Security-first approach with git history checks
6. Real examples from the codebase