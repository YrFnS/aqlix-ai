name: "Environment Variables Setup PRP - Secure Configuration Foundation"
description: |
  Comprehensive PRP for setting up secure environment variable management for the Iraqi AI Chat System with Bun native support, type-safe validation, and cross-workspace configuration for the monorepo architecture.

---

## Goal
Set up a complete environment variable management system for the Iraqi AI Chat System that handles secure credential storage, runtime validation, and consistent configuration access across all workspace applications and packages. The system should leverage Bun's native environment capabilities, provide TypeScript type safety with Zod validation, and support Iraqi-specific configuration patterns.

## Why
- **Security Foundation**: Secure handling of sensitive credentials like API keys, database connections, and payment gateway tokens without hardcoding secrets in source code
- **Type Safety**: Runtime validation and compile-time type safety for environment variables to prevent configuration-related failures in production
- **Workspace Consistency**: Unified environment variable access patterns across the monorepo (apps/web, apps/api, packages/*) 
- **Iraqi AI Compliance**: Environment configuration that supports Iraqi cultural settings, Arabic processing, and government security standards
- **Development Experience**: Clear documentation and validation of required variables with helpful error messages for developers

## What
Create a foundational environment variable system with:
- Secure .env file structure with proper hierarchical precedence (.env, .env.local, .env.development, etc.)
- Type-safe environment schema validation using Zod for runtime verification
- Cross-workspace environment variable access from shared configuration
- Iraqi-specific environment variables for cultural intelligence, Arabic processing, and payment gateways
- Development tools for environment validation and debugging

### Success Criteria
- [ ] Environment variables load automatically in Bun runtime without additional libraries
- [ ] All required variables are validated at application startup with clear error messages
- [ ] TypeScript provides full IntelliSense and type checking for environment variables
- [ ] Sensitive credentials are properly secured and never committed to version control
- [ ] Environment configuration works consistently across all workspace packages
- [ ] Iraqi-specific settings (cultural compliance, Arabic processing, payment gateways) are properly configured
- [ ] Development and production environments have clear separation with appropriate validation

## All Needed Context

### Documentation & References
```yaml
# CRITICAL READING - Bun environment capabilities
- url: https://bun.com/docs/runtime/env
  why: Official Bun environment variable documentation and automatic .env loading
  critical: "Bun reads .env files automatically and provides Bun.env, process.env, import.meta.env access"

- url: https://bun.sh/guides/runtime/read-env
  why: Practical examples of reading environment variables in Bun runtime
  
- url: https://bun.sh/guides/runtime/set-env
  why: Setting environment variables and using --env-file flag
  critical: "Use --env-file for custom .env files and multiple env file support"

# TYPE SAFETY PATTERNS - Zod validation approach
- url: https://creatures.sh/blog/env-type-safety-and-validation/
  why: Complete guide to environment variable validation with Zod and TypeScript
  critical: "Use z.coerce for type conversion, safeParse for better error handling"

- url: https://jacobparis.com/content/type-safe-env
  why: Typesafe environment variables pattern with Zod
  critical: "Define schema, validate on startup, export typed result"

# EXISTING PATTERNS - Follow these conventions
- file: examples/ai-design-generation/package.json
  why: Shows existing Zod usage (zod: "^3.22.4") and Bun script patterns
  critical: All packages already use Zod for validation - maintain consistency

- file: examples/unified-integration-orchestrator/config.py
  why: Iraqi-specific configuration patterns and environment variable usage
  critical: Follow Iraqi AI cultural settings and government security patterns

- file: CLAUDE.md
  why: Project requirements mandate python-dotenv pattern and security rules
  critical: "Never hardcode API keys - use .env with python-dotenv, Validate all inputs"

- file: .gitignore
  why: Existing .env patterns are properly configured for security
  critical: Lines 34-39 show comprehensive .env file gitignore patterns
```

### Current Codebase Tree (Workspace Context)
```bash
C:\Users\Itokoro\Documents\projects\aqlix-ai\
├── .gitignore                   # ✅ Already has proper .env patterns
├── CLAUDE.md                    # Project requirements and standards
├── PRPs/
│   └── bun-workspace-setup.md   # Workspace structure foundation
├── examples/                    # 44 extracted components with patterns
│   ├── ai-design-generation/    # ✅ Uses Zod validation
│   ├── unified-integration-orchestrator/ # ✅ Environment variable examples
│   └── dyad-extracted/          # TypeScript configuration patterns
└── initials/                    # This PRP: 02_environment_variables.md

# MISSING: No root workspace, no environment configuration system
# DEPENDS ON: PRP bun-workspace-setup.md must be completed first
```

### Desired Codebase Tree with Environment Configuration
```bash
C:\Users\Itokoro\Documents\projects\aqlix-ai\
├── .env.example                 # Template with all required variables documented
├── .env                         # Local environment (gitignored, created by developers)
├── .env.local                   # Local overrides (gitignored)
├── .env.development             # Development environment defaults
├── .env.production              # Production environment template
├── apps/
│   ├── web/                    # Frontend application
│   │   ├── .env.example        # Frontend-specific variables template
│   │   └── src/lib/env.ts      # Environment validation and access
│   └── api/                    # Backend application  
│       ├── .env.example        # Backend-specific variables template
│       └── src/lib/env.ts      # Environment validation and access
├── packages/
│   └── shared/                 # Shared utilities package
│       └── src/env.ts          # Shared environment configuration
└── scripts/
    ├── validate-env.ts         # Environment validation utility
    └── setup-env.ts           # Environment setup helper
```

### Known Gotchas of Bun Environment & Iraqi AI Codebase
```javascript
// CRITICAL: Bun reads .env files automatically in precedence order
// .env.production/.env.development/.env.test > .env.local > .env
// SOLUTION: Structure files correctly and understand precedence

// CRITICAL: Bun build --target=bun inlines environment variables
// Issue #11191: Values from .env are embedded into bundles
// SOLUTION: Use runtime checks, separate build vs runtime environments

// CRITICAL: process.env vs Bun.env vs import.meta.env
// All three are aliases, but import.meta.env is preferred for bundling
// SOLUTION: Use import.meta.env consistently across applications

// IRAQI AI SPECIFIC: Sensitive payment gateway credentials
// ZainCash, FastPay, NassWallet API keys must never be committed
// SOLUTION: Use descriptive .env.example with dummy values

// CULTURAL: Arabic text processing environment variables  
// RTL settings and dialect configurations need proper validation
// SOLUTION: Use Zod enums for cultural settings validation

// WORKSPACE: Environment variables shared across monorepo packages
// Each package needs access to shared configuration
// SOLUTION: Centralized validation with package-specific overrides
```

## Implementation Blueprint

### Data Models and Structure

Define comprehensive environment variable structure for Iraqi AI system:
```typescript
// Shared environment schema structure
interface EnvironmentConfig {
  // Core application settings
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number;
  
  // Database configuration
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  
  // Iraqi Payment Gateways
  ZAINCASH_API_KEY: string;
  ZAINCASH_MERCHANT_ID: string;
  FASTPAY_API_KEY: string;
  NASSWALLET_API_KEY: string;
  
  // Cultural Intelligence APIs
  CULTURAL_VALIDATION_API_KEY: string;
  ARABIC_NLP_API_KEY: string;
  
  // Security and monitoring
  SENTRY_DSN: string;
  ENCRYPTION_KEY: string;
  JWT_SECRET: string;
  
  // Iraqi-specific configuration
  DEFAULT_ARABIC_DIALECT: 'baghdad' | 'basra' | 'mosul' | 'iraqi_general';
  CULTURAL_COMPLIANCE_LEVEL: 'strict' | 'standard' | 'lenient';
  ISLAMIC_COMPLIANCE_ENABLED: boolean;
}
```

### Task List - Implementation Order (Security First)

```yaml
Task 1 - CREATE Root Environment Template:
  CREATE .env.example:
    - PATTERN: Comprehensive template documenting all required variables
    - INCLUDE: Iraqi payment gateways, cultural settings, security keys
    - DOCUMENT: Clear comments explaining each variable's purpose
    - SECURITY: Use dummy/example values, never real credentials
  
  CREATE .env.development:
    - PATTERN: Development-specific defaults for local development
    - INCLUDE: Local database URLs, development API endpoints
    - CULTURAL: Iraqi dialect settings, cultural compliance defaults

Task 2 - CREATE Shared Environment Schema:
  CREATE packages/shared/src/env.ts:
    - PATTERN: Mirror validation approach from examples/ai-design-generation
    - SCHEMA: Use Zod for comprehensive validation with Iraqi-specific enums
    - EXPORTS: Validated environment object with full TypeScript types
    - ERROR HANDLING: Clear error messages for missing/invalid variables
  
  CREATE packages/shared/src/types/env.ts:
    - TYPES: Export TypeScript interfaces for environment configuration
    - ENUMS: Iraqi dialects, cultural compliance levels, payment gateways
    - DOCUMENTATION: JSDoc comments for all environment variable types

Task 3 - CREATE Application-Specific Environment:
  CREATE apps/web/src/lib/env.ts:
    - PATTERN: Import and extend shared environment schema
    - FRONTEND: Browser-safe environment variables only (no secrets)
    - VALIDATION: Client-side environment validation on app startup
    - TYPES: Re-export types for easy import throughout frontend
  
  CREATE apps/api/src/lib/env.ts:
    - PATTERN: Import shared schema and add backend-specific variables
    - BACKEND: Include sensitive credentials and database connections
    - VALIDATION: Server-side validation with detailed error reporting
    - SECURITY: Ensure sensitive variables never reach client bundle

Task 4 - CREATE Environment Templates:
  CREATE apps/web/.env.example:
    - VARIABLES: Frontend-specific environment variables template
    - PUBLIC: Only include NEXT_PUBLIC_ prefixed variables
    - DOCUMENTATION: Comments explaining frontend configuration
  
  CREATE apps/api/.env.example:
    - VARIABLES: Backend-specific environment variables template
    - SENSITIVE: Payment gateways, database, API keys (with dummy values)
    - DOCUMENTATION: Comments explaining backend configuration

Task 5 - CREATE Development Tools:
  CREATE scripts/validate-env.ts:
    - PURPOSE: Standalone environment validation utility
    - USAGE: "bun run validate-env" to check environment setup
    - REPORTING: Detailed validation results with specific error messages
    - TESTING: Validate both development and production configurations
  
  CREATE scripts/setup-env.ts:
    - PURPOSE: Interactive environment setup for new developers
    - WORKFLOW: Copy .env.example, guide through configuration
    - VALIDATION: Verify setup after initial configuration
    - DOCUMENTATION: Generate setup report for troubleshooting

Task 6 - CONFIGURE Bun Environment Loading:
  MODIFY root package.json:
    - SCRIPTS: Add environment validation commands
    - SCRIPTS: "env:validate", "env:setup", "env:check"
    - PATTERN: Use Bun for all environment-related commands
  
  CREATE bunfig.toml (if needed):
    - CONFIGURATION: Bun-specific environment loading settings
    - DEFAULTS: Configure default environment file precedence
    - OPTIMIZATION: Environment variable loading performance

Task 7 - IMPLEMENT Iraqi-Specific Configuration:
  ENHANCE shared environment schema:
    - CULTURAL: Cultural compliance threshold validation
    - ARABIC: RTL processing and dialect configuration  
    - PAYMENT: Iraqi payment gateway validation and limits
    - SECURITY: Government-grade security requirements
    - MONITORING: Cultural compliance monitoring configuration

Task 8 - CREATE Documentation and Validation:
  CREATE docs/environment-setup.md:
    - GUIDE: Complete environment variable setup guide
    - EXAMPLES: Configuration examples for different environments
    - TROUBLESHOOTING: Common issues and solutions
    - SECURITY: Best practices for credential management
  
  ENHANCE existing validation:
    - TESTS: Environment validation unit tests
    - CI/CD: Environment configuration validation in build pipeline
    - MONITORING: Runtime environment validation and alerting
```

### Task 2 Pseudocode - Shared Environment Schema
```typescript
// packages/shared/src/env.ts
import { z } from 'zod'

// PATTERN: Follow creatures.sh type-safe environment guide
// Define comprehensive schema for Iraqi AI system
const envSchema = z.object({
  // Core application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().min(1000).max(65535).default(3000),
  
  // Supabase configuration  
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  
  // Iraqi Payment Gateways - CRITICAL for Iraqi AI system
  ZAINCASH_API_KEY: z.string().min(1),
  ZAINCASH_MERCHANT_ID: z.string().min(1), 
  ZAINCASH_CURRENCY: z.literal('IQD').default('IQD'),
  FASTPAY_API_KEY: z.string().min(1),
  NASSWALLET_API_KEY: z.string().min(1),
  
  // Cultural Intelligence Configuration
  DEFAULT_ARABIC_DIALECT: z.enum(['baghdad', 'basra', 'mosul', 'iraqi_general']).default('iraqi_general'),
  CULTURAL_COMPLIANCE_LEVEL: z.enum(['strict', 'standard', 'lenient']).default('standard'),
  ISLAMIC_COMPLIANCE_ENABLED: z.coerce.boolean().default(true),
  CULTURAL_VALIDATION_THRESHOLD: z.coerce.number().min(0).max(100).default(95),
  
  // Security configuration
  ENCRYPTION_KEY: z.string().min(32), // 256-bit key
  JWT_SECRET: z.string().min(32),
  SENTRY_DSN: z.string().url().optional(),
  
  // Feature flags for Iraqi AI capabilities
  ENABLE_ARABIC_PROCESSING: z.coerce.boolean().default(true),
  ENABLE_RTL_SUPPORT: z.coerce.boolean().default(true),
  ENABLE_PAYMENT_GATEWAYS: z.coerce.boolean().default(true),
  ENABLE_CULTURAL_VALIDATION: z.coerce.boolean().default(true),
})

// CRITICAL: Use Bun.env for Bun runtime compatibility
// Validate environment on module import for early error detection
const env = envSchema.parse(Bun.env)

export default env
export type Env = z.infer<typeof envSchema>
```

### Task 3 Pseudocode - Frontend Environment Setup  
```typescript
// apps/web/src/lib/env.ts
import { z } from 'zod'

// PATTERN: Browser-safe environment variables only
// CRITICAL: No sensitive credentials in frontend environment
const clientEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Public Supabase configuration (safe for browser)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  
  // Public Iraqi AI configuration
  NEXT_PUBLIC_DEFAULT_LANGUAGE: z.enum(['ar-IQ', 'en', 'ar']).default('ar-IQ'),
  NEXT_PUBLIC_RTL_ENABLED: z.coerce.boolean().default(true),
  NEXT_PUBLIC_CULTURAL_THEME: z.enum(['modern', 'traditional', 'government']).default('modern'),
  
  // Public monitoring (no sensitive data)
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),
})

// CRITICAL: Validate at app startup to catch configuration issues early
const env = clientEnvSchema.parse(import.meta.env)

export default env
export type ClientEnv = z.infer<typeof clientEnvSchema>
```

### Integration Points
```yaml
WORKSPACE INTEGRATION:
  - shared_config: Central environment schema in packages/shared/
  - app_specific: Each app imports and extends shared configuration
  - validation: Consistent validation approach across all packages
  - types: Shared TypeScript types for environment variables

BUN_RUNTIME_INTEGRATION:
  - auto_loading: Leverage Bun's automatic .env file loading
  - precedence: Use proper .env file hierarchy (.env.local > .env)
  - access_methods: Prefer import.meta.env for consistency
  - validation: Runtime validation on application startup

SECURITY_INTEGRATION:
  - gitignore: All actual .env files properly ignored
  - templates: .env.example files with documentation and dummy values
  - separation: Clear distinction between development and production configs
  - credentials: Never commit real API keys or sensitive information

IRAQI_AI_INTEGRATION:
  - cultural_settings: Environment variables for cultural compliance levels
  - payment_gateways: Configuration for ZainCash, FastPay, NassWallet
  - arabic_processing: Settings for RTL support and dialect recognition
  - government_compliance: Security and monitoring configuration
```

## Validation Loop

### Level 1: Basic Environment Setup
```bash
# Verify Bun can read environment files
echo "TEST_VAR=hello" > .env
bun --print import.meta.env.TEST_VAR
# Expected: "hello"

# Test environment file precedence
echo "ENV_TEST=local" > .env.local  
echo "ENV_TEST=base" > .env
bun --print import.meta.env.ENV_TEST
# Expected: "local" (local takes precedence)

# Clean up test files
rm .env .env.local
```

### Level 2: Schema Validation
```bash
# Test shared environment validation
cd packages/shared
bun run build
# Expected: Builds successfully with TypeScript compilation

# Test invalid environment handling
cd packages/shared && NODE_ENV=invalid bun src/env.ts
# Expected: Zod validation error with clear message about invalid NODE_ENV

# Test missing required variable
cd packages/shared && unset SUPABASE_URL && bun src/env.ts  
# Expected: Clear error message about missing SUPABASE_URL
```

### Level 3: Application Integration
```bash
# Test frontend environment validation
cd apps/web
cp .env.example .env.local
bun run build
# Expected: Builds successfully, no environment variable errors

# Test backend environment validation  
cd apps/api
cp .env.example .env.local
bun run typecheck
# Expected: TypeScript compilation passes with proper environment types

# Test cross-workspace environment access
bun run dev
# Expected: All applications start with proper environment configuration
```

### Level 4: Iraqi AI Specific Validation
```bash
# Test cultural configuration validation
bun run validate-env
# Expected: Validates Iraqi-specific settings (dialects, payment gateways, cultural compliance)

# Test payment gateway configuration
ZAINCASH_API_KEY="" bun run validate-env
# Expected: Clear error about missing payment gateway configuration

# Test Arabic processing configuration  
DEFAULT_ARABIC_DIALECT="invalid" bun run validate-env
# Expected: Zod validation error with valid dialect options
```

## Final Validation Checklist
- [ ] .env.example files created with comprehensive Iraqi AI configuration
- [ ] Shared environment schema validates all required variables with proper types
- [ ] Frontend and backend applications have separate, appropriate environment configurations
- [ ] Zod validation provides clear error messages for missing/invalid variables
- [ ] TypeScript provides full IntelliSense for environment variables
- [ ] Sensitive credentials are properly secured and documented
- [ ] Iraqi-specific configuration (dialects, payment gateways, cultural settings) validated
- [ ] Development tools for environment validation and setup work correctly
- [ ] All validation commands pass: `bun run validate-env && bun run build`
- [ ] Environment configuration follows Iraqi AI security and cultural standards
- [ ] Bun's native environment loading works seamlessly across workspace

---

## Anti-Patterns to Avoid
- ❌ Don't hardcode API keys or sensitive credentials in source code
- ❌ Don't commit actual .env files with real credentials to version control
- ❌ Don't skip environment validation - applications should fail fast on misconfiguration
- ❌ Don't use process.env directly without validation and type safety  
- ❌ Don't mix development and production credentials in same environment files
- ❌ Don't ignore Bun's automatic .env loading - use it instead of manual loading
- ❌ Don't forget to document environment variables in .env.example files
- ❌ Don't use inconsistent environment variable naming across applications

---

**PRP Confidence Level: 9/10**

High confidence for one-pass implementation due to:
✅ Comprehensive research of Bun environment variable capabilities and best practices
✅ Clear existing Zod validation patterns from codebase to follow  
✅ Detailed Iraqi AI-specific requirements integrated throughout
✅ Security best practices and proper .gitignore patterns already established
✅ Specific task breakdown with executable validation gates
✅ Type safety approach validated with current TypeScript patterns

Potential risks: Minor edge cases with Bun's environment variable precedence, but well-researched and documented.