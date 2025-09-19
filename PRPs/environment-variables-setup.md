# Environment Variables Setup for Iraqi AI Chat System

## Goal
Establish secure, type-safe environment variable management across the Iraqi AI Chat System monorepo using Bun native support, TypeScript validation, and cross-workspace configuration patterns that handle API keys, database connections, and service configurations for development, staging, and production environments.

## Why
- **Security Foundation**: Proper credential management prevents API key exposure and enables secure deployment patterns
- **Developer Experience**: Type-safe environment variables with validation reduce configuration errors and improve onboarding
- **Monorepo Support**: Consistent environment handling across apps/web, apps/api, and packages/ workspaces
- **Cultural Compliance**: Secure handling of Iraqi-specific configurations (payment gateway credentials, cultural validation settings)
- **Production Readiness**: Environment separation and validation patterns required for Iraqi government deployment standards

## What
Create a comprehensive environment variable management system with:

1. **File Structure**: `.env`, `.env.example`, `.env.local`, and environment-specific files with proper hierarchy
2. **Type Safety**: TypeScript definitions and runtime validation using Zod schemas
3. **Security**: Credential protection patterns with .gitignore configuration and validation
4. **Cross-Workspace**: Environment variable access patterns for monorepo architecture
5. **Validation**: Early startup validation with helpful error messages for missing/invalid variables
6. **Documentation**: Clear documentation of all required and optional environment variables

### Success Criteria
- [ ] `.env.example` file with all required variables documented with Iraqi AI system context
- [ ] Type-safe environment variable access with Zod validation schemas
- [ ] Cross-workspace environment variable loading in packages/ and apps/
- [ ] Secure credential handling with proper .gitignore patterns
- [ ] Development vs production environment separation
- [ ] Runtime validation with clear error messages for missing variables
- [ ] Documentation of all environment variables with Iraqi cultural context
- [ ] Bun native environment loading without external dependencies

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- url: https://bun.sh/docs/runtime/env
  why: Bun native environment variable loading and .env file hierarchy

- url: https://infisical.com/blog/bun-environment-variables
  why: Best practices for Bun environment management with examples

- url: https://creatures.sh/blog/env-type-safety-and-validation/
  why: TypeScript validation patterns using Zod for type-safe environment variables

- file: examples/main_agent_reference/settings.py
  why: Python environment variable patterns using pydantic-settings for API reference

- file: examples/anything-llm-admin-extracted/src/hooks/useAdminData.ts
  why: TypeScript environment variable usage patterns with process.env

- file: CLAUDE.md
  section: Security Rules and Session Memory Rules
  critical: Never hardcode API keys, use .env with secure patterns, Iraqi cultural compliance

- file: .gitignore
  why: Existing .env file exclusion patterns to extend

- docfile: PRPs/templates/prp_base.md
  why: PRP validation patterns and testing approaches for environment setup
```

### Current Codebase Tree
```bash
/
├── .gitignore                  # Contains .env* exclusions
├── CLAUDE.md                   # Iraqi AI system rules and security requirements
├── examples/                   # 79 examples with various env patterns
│   ├── main_agent_reference/   # Python pydantic-settings patterns
│   ├── anything-llm-admin-*/   # TypeScript process.env patterns
│   ├── iraqi-ai-desktop-*/     # Desktop app configuration patterns
│   └── phase3-reference-*/     # Production deployment patterns
├── packages/                   # Shared workspace packages (future)
├── apps/                       # Main applications (future)
└── PRPs/                       # Product Requirement Prompts
```

### Desired Codebase Tree
```bash
/
├── .env.example                # Template with all required variables
├── .env                        # Local environment (git-ignored, created by developer)
├── .env.local                  # Local overrides (git-ignored)
├── .gitignore                  # Updated with comprehensive .env exclusions
├── bun.json                    # Workspace configuration for Bun
├── package.json                # Root workspace package configuration
├── packages/
│   └── env-config/             # Shared environment configuration package
│       ├── package.json        # @iraqi-ai/env-config package
│       ├── src/
│       │   ├── index.ts        # Main exports
│       │   ├── schemas.ts      # Zod validation schemas
│       │   ├── types.ts        # TypeScript environment variable types
│       │   └── config.ts       # Environment configuration utilities
│       └── README.md           # Package documentation
├── apps/
│   ├── web/
│   │   ├── .env.example        # Web-specific environment template
│   │   └── next.config.js      # Next.js environment configuration
│   └── api/
│       ├── .env.example        # API-specific environment template
│       └── config/
│           └── settings.py     # Python FastAPI environment configuration
└── docs/
    └── ENVIRONMENT_SETUP.md    # Comprehensive environment setup guide
```

### Known Gotchas & Library Quirks
```typescript
// CRITICAL: Bun loads .env files automatically, no dotenv needed
// Hierarchy: .env → .env.{NODE_ENV} → .env.local (highest precedence)
// Exception: .env.local NOT loaded when NODE_ENV=test

// GOTCHA: Bun.env vs process.env - both work but process.env more portable
const apiKey = process.env.API_KEY; // Preferred for compatibility
const apiKey2 = Bun.env.API_KEY;    // Bun-specific alternative

// CRITICAL: Zod validation must happen at startup, not lazy loading
// Pattern: Validate all environment variables before app initialization

// GOTCHA: TypeScript process.env types default to string | undefined
// Solution: Use Zod parsing with transform for numbers/booleans

// IRAQI SPECIFIC: Cultural validation settings and payment gateway credentials
// Must be validated for Islamic compliance and security requirements
```

## Implementation Blueprint

### Data Models and Structure
Environment variable configuration using Zod schemas for type safety and validation:

```typescript
// Type-safe environment variable schemas
// Covers: API keys, database URLs, cultural settings, payment gateways
// Validation: Required vs optional, formats (URL, email), transformations
// Security: Sensitive credential handling with proper masking
```

### List of Tasks to Complete

```yaml
Task 1:
CREATE .env.example:
  - DOCUMENT all required environment variables for Iraqi AI system
  - INCLUDE cultural compliance settings and thresholds
  - ADD payment gateway configuration (ZainCash, FastPay, NassWallet)
  - PROVIDE helpful comments and example values (non-sensitive)

Task 2:
UPDATE .gitignore:
  - ENSURE comprehensive .env file exclusions
  - ADD patterns for environment-specific files
  - VERIFY existing patterns are sufficient

Task 3:
CREATE packages/env-config/package.json:
  - SETUP @iraqi-ai/env-config workspace package
  - ADD Zod dependency for validation
  - CONFIGURE TypeScript and build settings

Task 4:
CREATE packages/env-config/src/schemas.ts:
  - DEFINE Zod schemas for all environment variable categories
  - IMPLEMENT validation for URLs, numbers, booleans, enum values
  - ADD custom validators for Iraqi-specific formats

Task 5:
CREATE packages/env-config/src/types.ts:
  - GENERATE TypeScript types from Zod schemas
  - EXPORT environment variable interfaces
  - PROVIDE type-safe access patterns

Task 6:
CREATE packages/env-config/src/config.ts:
  - IMPLEMENT environment configuration utility functions
  - ADD startup validation with clear error messages
  - PROVIDE masked logging for sensitive values

Task 7:
CREATE packages/env-config/src/index.ts:
  - EXPORT all schemas, types, and utilities
  - PROVIDE convenience functions for common patterns
  - ENSURE tree-shakable exports

Task 8:
CREATE bun.json:
  - CONFIGURE workspace settings for Bun
  - SETUP proper package resolution
  - ENABLE native TypeScript support

Task 9:
UPDATE package.json (root):
  - ADD workspace configuration
  - DEFINE environment-related scripts
  - SETUP proper dependencies

Task 10:
CREATE apps/web/.env.example:
  - DEFINE web-specific environment variables
  - INCLUDE Next.js public vs server variables
  - ADD Iraqi UI/UX configuration settings

Task 11:
CREATE apps/api/.env.example:
  - DEFINE API-specific environment variables
  - INCLUDE database connection settings
  - ADD AI model and service configurations

Task 12:
CREATE docs/ENVIRONMENT_SETUP.md:
  - PROVIDE comprehensive setup guide
  - DOCUMENT security best practices
  - INCLUDE troubleshooting section
```

### Per-Task Pseudocode

```typescript
// Task 3-7: Environment Configuration Package Structure
// PATTERN: Type-safe environment variables with runtime validation

// schemas.ts - Zod validation schemas
const DatabaseSchema = z.object({
  DATABASE_URL: z.string().url("Invalid database URL format"),
  DATABASE_POOL_SIZE: z.string().transform(Number).default("10"),
  DATABASE_SSL: z.enum(["true", "false"]).transform(Boolean).default("true")
});

const ApiSchema = z.object({
  LLM_PROVIDER: z.enum(["openai", "anthropic", "azure"]).default("openai"),
  LLM_API_KEY: z.string().min(1, "LLM API key is required"),
  LLM_MODEL: z.string().default("gpt-4"),
  BRAVE_API_KEY: z.string().min(1, "Brave API key is required")
});

// IRAQI-SPECIFIC: Cultural and compliance settings
const IraqiCulturalSchema = z.object({
  CULTURAL_COMPLIANCE_THRESHOLD: z.string().transform(Number).min(95).default("95"),
  ISLAMIC_COMPLIANCE_ENABLED: z.enum(["true", "false"]).transform(Boolean).default("true"),
  ARABIC_RTL_PROCESSING: z.enum(["true", "false"]).transform(Boolean).default("true"),
  IRAQI_DIALECT_RECOGNITION: z.enum(["true", "false"]).transform(Boolean).default("true")
});

// config.ts - Environment configuration utility
function validateEnvironment(): EnvironmentConfig {
  try {
    // PATTERN: Validate all schemas at startup
    const env = z.object({
      ...DatabaseSchema.shape,
      ...ApiSchema.shape,
      ...IraqiCulturalSchema.shape
    }).parse(process.env);

    return env;
  } catch (error) {
    // CRITICAL: Clear error messages for missing/invalid variables
    console.error("Environment validation failed:", error.message);
    process.exit(1);
  }
}
```

### Integration Points
```yaml
WORKSPACE:
  - package: "@iraqi-ai/env-config"
  - exports: "schemas, types, validateEnvironment, config"

APPS_WEB:
  - import: "import { config } from '@iraqi-ai/env-config'"
  - usage: "const apiUrl = config.NEXT_PUBLIC_API_URL"

APPS_API:
  - import: "from iraqi_ai_env_config import get_config"
  - usage: "config = get_config(); db_url = config.DATABASE_URL"

ENVIRONMENT_FILES:
  - hierarchy: ".env → .env.{NODE_ENV} → .env.local"
  - exclusions: ".gitignore patterns for all .env* files"

VALIDATION:
  - startup: "Validate all required variables before app initialization"
  - runtime: "Type-safe access with Zod-generated TypeScript types"
```

## Validation Loop

### Level 1: File Structure & Configuration
```bash
# Verify environment files are created and ignored
test -f .env.example && echo "✓ Environment template exists"
test -f bun.json && echo "✓ Bun workspace configuration exists"
grep -q "\.env" .gitignore && echo "✓ Environment files excluded from git"

# Verify package structure
test -d packages/env-config && echo "✓ Environment config package exists"
test -f packages/env-config/package.json && echo "✓ Package configuration exists"
```

### Level 2: Package Validation
```bash
# Install dependencies and validate package
cd packages/env-config
bun install
bun run build
bun run type-check

# Expected: No TypeScript errors, successful build
# If errors: Check Zod schema definitions and TypeScript types
```

### Level 3: Environment Variable Loading
```typescript
// CREATE test-env-loading.ts
import { validateEnvironment } from '@iraqi-ai/env-config';

// Test environment validation
try {
  const config = validateEnvironment();
  console.log("✓ Environment validation successful");
  console.log("✓ Cultural compliance threshold:", config.CULTURAL_COMPLIANCE_THRESHOLD);
} catch (error) {
  console.error("✗ Environment validation failed:", error.message);
  process.exit(1);
}
```

```bash
# Run environment validation test
bun run test-env-loading.ts
# Expected: Successful validation or clear error messages for missing variables
```

### Level 4: Cross-Workspace Integration
```bash
# Test importing from workspace packages
cd apps/web
bun add @iraqi-ai/env-config@workspace:*
echo "import { config } from '@iraqi-ai/env-config'; console.log(config.LLM_PROVIDER);" | bun run --stdin

# Expected: Successful import and access to typed environment variables
```

## Final Validation Checklist
- [ ] All environment files created: `.env.example`, workspace-specific templates
- [ ] Environment config package builds: `bun run build` in packages/env-config/
- [ ] Type checking passes: `bun run type-check` with no errors
- [ ] Environment validation works: Test script validates all required variables
- [ ] Cross-workspace imports: Web and API apps can import @iraqi-ai/env-config
- [ ] Git security: All .env files properly excluded from version control
- [ ] Documentation complete: Environment setup guide with Iraqi context
- [ ] Iraqi compliance: Cultural and payment gateway variables properly configured

---

## Anti-Patterns to Avoid
- ❌ Don't hardcode API keys or sensitive values in source code
- ❌ Don't commit actual .env files to version control
- ❌ Don't skip environment validation at startup
- ❌ Don't use string values for numbers/booleans without transformation
- ❌ Don't create duplicate environment variable definitions across workspaces
- ❌ Don't ignore TypeScript errors from environment variable access
- ❌ Don't provide unclear error messages for missing required variables
- ❌ Don't forget Iraqi cultural compliance thresholds and validation settings

---

**PRP Confidence Score: 9/10**

This PRP provides comprehensive context for one-pass implementation success with:
- ✅ Complete technical specifications with Bun and TypeScript patterns
- ✅ Detailed codebase integration points and workspace structure
- ✅ Security best practices with Iraqi government compliance requirements
- ✅ Step-by-step validation loops with executable commands
- ✅ Real examples from existing codebase patterns
- ✅ Clear error handling and troubleshooting guidance
- ✅ Cultural context for Iraqi AI system requirements

The only minor uncertainty is around specific Iraqi payment gateway credential formats, which can be refined during implementation based on actual integration requirements.