# Environment Variables Setup Guide

**Iraqi AI Chat System - Environment Configuration Documentation**

This guide explains how to set up environment variables for local development, testing, and production deployment of the Iraqi AI Chat System.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Environment File Hierarchy](#environment-file-hierarchy)
3. [Required Environment Variables](#required-environment-variables)
4. [Optional Environment Variables](#optional-environment-variables)
5. [Security Best Practices](#security-best-practices)
6. [Troubleshooting](#troubleshooting)
7. [Common Scenarios](#common-scenarios)

## Quick Start

### 1. Create Environment Files

```bash
# Root environment (shared variables)
cp .env.example .env

# Next.js frontend (web app)
cp apps/web/.env.example apps/web/.env.local

# Python FastAPI backend (API)
cp apps/api/.env.example apps/api/.env
```

### 2. Fill in Required Values

Edit each `.env` file and replace placeholder values:

```bash
# Example: Replace "your-openai-api-key-here" with actual API key
LLM_API_KEY=sk-proj-abc123...

# Example: Replace "your-secure-secret-key" with generated secret
API_SECRET_KEY=$(openssl rand -base64 32)
```

### 3. Restart Development Servers

```bash
# Restart Next.js (picks up new environment variables)
bun run dev

# Restart FastAPI (picks up new environment variables)
bun run dev:api
```

## Environment File Hierarchy

### Bun Environment Loading Order

Bun automatically loads environment files in this order (later files override earlier ones):

```
1. .env                      # Base configuration (committed as .env.example)
2. .env.development          # Development-specific overrides
   .env.production           # Production-specific overrides
   .env.test                 # Test-specific overrides
3. .env.local                # Local overrides (gitignored, NOT loaded in tests)
```

### Where to Put Variables

#### Root-Level (`.env`)
Use for **shared** variables across all applications:
- `NODE_ENV`
- `LOG_LEVEL`
- `DATABASE_URL`
- `REDIS_URL`
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`
- `LLM_PROVIDER`, `LLM_API_KEY`, `LLM_MODEL`

#### apps/web (`.env.local`)
Use for **Next.js frontend** variables:
- Client-side: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SUPABASE_URL`
- Server-side: `API_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

#### apps/api (`.env`)
Use for **Python FastAPI backend** variables:
- `PORT`, `HOST`
- `CORS_ORIGINS`
- `ZAINCASH_API_KEY`, `FASTPAY_API_KEY`, `NASSWALLET_API_KEY`

## Required Environment Variables

### Critical Security Variables

These **MUST** be set for the application to function:

#### 1. `API_SECRET_KEY`

**Purpose**: JWT signing and encryption
**Minimum Length**: 32 characters
**Generate**:
```bash
openssl rand -base64 32
```

**Security**:
- ❌ NEVER commit this to git
- ❌ NEVER log this value
- ❌ NEVER expose to client-side code
- ✅ Use different keys for dev/staging/prod

#### 2. `LLM_API_KEY`

**Purpose**: OpenAI API access for LLM operations
**Get From**: https://platform.openai.com/api-keys
**Format**: `sk-proj-...` or `sk-...`

**Security**:
- ❌ NEVER commit this to git
- ❌ NEVER log this value
- ✅ Monitor usage on OpenAI dashboard
- ✅ Set spending limits

#### 3. `DATABASE_URL`

**Purpose**: PostgreSQL connection string
**Format**: `postgresql://username:password@host:port/database`
**Example**: `postgresql://postgres:password@localhost:5432/iraqi_ai_chat`

**Security**:
- ❌ NEVER use 'postgres' user in production
- ✅ Use strong passwords (16+ characters)
- ✅ Use connection pooling
- ✅ Encrypt in transit (SSL/TLS)

#### 4. `SUPABASE_URL` & `SUPABASE_ANON_KEY`

**Purpose**: Supabase project access
**Get From**: https://app.supabase.com/project/_/settings/api

**Security**:
- ✅ `SUPABASE_ANON_KEY` is safe for client-side (protected by RLS)
- ❌ `SUPABASE_SERVICE_ROLE_KEY` is server-only (bypasses RLS)

### Client-Side Variables (Next.js)

These are **exposed to the browser** and must be prefixed with `NEXT_PUBLIC_`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ SECURITY WARNING**: Never use `NEXT_PUBLIC_` prefix for secrets or API keys!

## Optional Environment Variables

### Iraqi Payment Gateways

Required only if using Iraqi payment processing:

```bash
# ZainCash (Minimum: 1000 IQD)
ZAINCASH_API_KEY=your-zaincash-api-key
ZAINCASH_MERCHANT_ID=your-merchant-id

# FastPay (Minimum: 500 IQD)
FASTPAY_API_KEY=your-fastpay-api-key
FASTPAY_MERCHANT_ID=your-merchant-id

# NassWallet (Minimum: 1000 IQD)
NASSWALLET_API_KEY=your-nasswallet-api-key
NASSWALLET_MERCHANT_ID=your-merchant-id
```

### Redis (Caching & Sessions)

```bash
REDIS_URL=redis://localhost:6379/0
REDIS_PASSWORD=your-redis-password  # If authentication enabled
```

### Monitoring (Sentry)

```bash
SENTRY_DSN=https://abc123@o123456.ingest.sentry.io/123456
SENTRY_ENVIRONMENT=development
SENTRY_SAMPLE_RATE=1.0
SENTRY_TRACES_SAMPLE_RATE=0.1
```

### Feature Flags

```bash
ENABLE_EXPERIMENTAL_FEATURES=false
ENABLE_MULTIMODAL=true
ENABLE_OFFLINE_MODE=false
CULTURAL_VALIDATION_ENABLED=true
ARABIC_DIALECT_PROCESSING=true
```

## Security Best Practices

### DO ✅

1. **Use `.env.example` as template**
   ```bash
   cp .env.example .env
   # Edit .env with actual values
   ```

2. **Generate strong secrets**
   ```bash
   # API secret (32+ characters)
   openssl rand -base64 32

   # Database password (16+ characters)
   openssl rand -base64 24
   ```

3. **Use different credentials per environment**
   ```bash
   # Development
   LLM_API_KEY=sk-dev-abc123...

   # Production
   LLM_API_KEY=sk-prod-xyz789...
   ```

4. **Verify `.gitignore` coverage**
   ```bash
   # Ensure .env files are gitignored
   git check-ignore -v .env
   # Expected output: .gitignore:37:.env	.env
   ```

5. **Validate environment at startup**
   - Next.js: Validation runs automatically in `apps/web/src/config/env.ts`
   - FastAPI: Validation runs automatically in `apps/api/config/settings.py`

### DON'T ❌

1. **Never commit `.env` files**
   ```bash
   # ❌ NEVER do this
   git add .env
   git commit -m "Add environment variables"

   # ✅ Only commit .env.example
   git add .env.example
   ```

2. **Never log sensitive values**
   ```typescript
   // ❌ NEVER do this
   console.log(process.env.LLM_API_KEY);
   console.log({ env: process.env });

   // ✅ Log non-sensitive info only
   console.log("Environment:", process.env.NODE_ENV);
   console.log("Has API Key:", !!process.env.LLM_API_KEY);
   ```

3. **Never use `NEXT_PUBLIC_` for secrets**
   ```bash
   # ❌ WRONG - Exposes to browser
   NEXT_PUBLIC_API_SECRET=my-secret-key

   # ✅ CORRECT - Server-only
   API_SECRET_KEY=my-secret-key
   ```

4. **Never hardcode values in code**
   ```typescript
   // ❌ NEVER do this
   const apiKey = "sk-proj-abc123...";

   // ✅ Use environment variables
   import { env } from "@/config/env";
   const apiKey = env.LLM_API_KEY;
   ```

## Troubleshooting

### Environment Variables Not Loading

**Symptom**: `Error: Environment validation failed`

**Solutions**:

1. **Verify file exists**
   ```bash
   # Check if .env files exist
   ls -la .env apps/web/.env.local apps/api/.env
   ```

2. **Restart dev server**
   ```bash
   # Environment variables are cached
   # Must restart after changes
   bun run dev
   ```

3. **Check file location**
   ```bash
   # Bun loads .env from current working directory
   # Make sure you're in the right directory
   pwd
   ```

4. **Verify syntax**
   ```bash
   # ✅ CORRECT
   API_KEY=sk-abc123
   DATABASE_URL="postgresql://localhost:5432/db"

   # ❌ WRONG
   API_KEY = sk-abc123       # No spaces around =
   DATABASE_URL='postgresql://...'  # Use double quotes for URLs
   ```

### Validation Errors

**Symptom**: Specific validation error messages

**Solutions**:

#### "API secret must be at least 32 characters"
```bash
# Generate a new 32+ character secret
openssl rand -base64 32
# Add to .env
API_SECRET_KEY=<generated-secret>
```

#### "Database URL must be valid"
```bash
# Check format: postgresql://user:pass@host:port/db
DATABASE_URL=postgresql://postgres:password@localhost:5432/iraqi_ai_chat
```

#### "Invalid URL format"
```bash
# Must be full URL with protocol
NEXT_PUBLIC_API_URL=http://localhost:8000  # ✅ CORRECT
NEXT_PUBLIC_API_URL=localhost:8000          # ❌ WRONG
```

### Client-Side Variables Not Available

**Symptom**: `undefined` when accessing in browser

**Solutions**:

1. **Add `NEXT_PUBLIC_` prefix**
   ```bash
   # ❌ WRONG - Not accessible in browser
   API_URL=http://localhost:8000

   # ✅ CORRECT - Accessible in browser
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

2. **Restart Next.js dev server**
   ```bash
   # Client-side variables are bundled at build time
   # Must restart to pick up changes
   bun run dev
   ```

3. **Check build logs**
   ```bash
   # Next.js shows which NEXT_PUBLIC_* variables are bundled
   bun run build
   ```

### Python API Not Loading Environment

**Symptom**: Python API can't find environment variables

**Solutions**:

1. **Verify `.env` file location**
   ```bash
   # Must be in apps/api/.env
   ls -la apps/api/.env
   ```

2. **Check pydantic-settings installation**
   ```bash
   pip list | grep pydantic-settings
   # If not installed:
   pip install pydantic-settings
   ```

3. **Verify `settings.py` import**
   ```python
   # In your FastAPI app
   from config import settings

   print(settings.NODE_ENV)  # Should print environment
   ```

## Common Scenarios

### New Developer Setup

```bash
# 1. Clone repository
git clone <repository-url>
cd aqlix-ai

# 2. Install dependencies
bun install

# 3. Create environment files
cp .env.example .env
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env

# 4. Generate secrets
echo "API_SECRET_KEY=$(openssl rand -base64 32)" >> .env

# 5. Add LLM API key
echo "LLM_API_KEY=sk-your-openai-api-key-here" >> .env

# 6. Set up Supabase (get from https://app.supabase.com)
# Add SUPABASE_URL and SUPABASE_ANON_KEY to .env

# 7. Start development servers
bun run dev        # Next.js frontend
bun run dev:api    # FastAPI backend (in separate terminal)
```

### Adding New Environment Variable

```bash
# 1. Add to .env.example with documentation
echo "# New feature flag" >> .env.example
echo "NEW_FEATURE_ENABLED=false" >> .env.example

# 2. Add to Zod schema (apps/web/src/config/env.ts)
# NEW_FEATURE_ENABLED: z.enum(["true", "false"])
#   .transform(v => v === "true")
#   .default("false"),

# 3. Add to TypeScript types (apps/web/src/types/env.d.ts)
# NEW_FEATURE_ENABLED: "true" | "false";

# 4. Add to your actual .env file
echo "NEW_FEATURE_ENABLED=true" >> .env

# 5. Restart dev server
bun run dev
```

### Switching Environments

```bash
# Development (default)
NODE_ENV=development bun run dev

# Production build
NODE_ENV=production bun run build
NODE_ENV=production bun start

# Testing
NODE_ENV=test bun test
```

### CI/CD Environment Variables

For GitHub Actions, Vercel, or other CI/CD:

```yaml
# .github/workflows/deploy.yml
env:
  NODE_ENV: production
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  API_SECRET_KEY: ${{ secrets.API_SECRET_KEY }}
  LLM_API_KEY: ${{ secrets.LLM_API_KEY }}
  SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
  SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
```

**Important**:
- Store secrets in CI/CD platform's secret management
- Never commit actual values to workflow files
- Use different credentials for staging vs production

## Additional Resources

- **Bun Environment Variables**: https://bun.sh/docs/runtime/env
- **Next.js Environment Variables**: https://nextjs.org/docs/app/building-your-application/configuring/environment-variables
- **Zod Validation**: https://zod.dev/
- **Pydantic Settings**: https://docs.pydantic.dev/latest/concepts/pydantic_settings/
- **Supabase Configuration**: https://supabase.com/docs/guides/cli/config

## Getting Help

If you encounter issues not covered in this guide:

1. Check validation error messages (they're designed to be helpful)
2. Verify your `.env.example` files match your actual `.env` files
3. Ensure all required variables are set
4. Try deleting and recreating your `.env` files from `.env.example`
5. Check the project's GitHub Issues for known problems

---

**Last Updated**: 2025-09-30
**Version**: 1.0.0
**Maintainer**: Iraqi AI Chat System Team
