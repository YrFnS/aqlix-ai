# Secrets Management Guide

This document describes how to manage secrets and environment variables for the Iraqi AI Chat System.

## Overview

The application uses environment variables to manage secrets across all environments. The following structure is recommended:

- **Development**: `.env.local` (local machine, not committed)
- **Staging**: `.env.staging` (staging environment variables)
- **Production**: `.env.production` (production environment variables)

⚠️ **IMPORTANT**: NEVER commit `.env` files with actual secrets to version control. Use environment variable injection in CI/CD systems.

## Environment Setup

### Local Development

1. Create a local `.env.local` file (not committed):
   ```bash
   cp .env.example .env.local
   ```

2. Update with your local development values

3. The application will automatically load from `.env.local` when running locally

### Staging Environment

Staging uses `.env.staging` as a template. Configure the following in your staging CI/CD:

```bash
DATABASE_URL_STAGING=postgresql://user:pass@staging-db:5432/aqlix
REDIS_URL_STAGING=redis://staging-redis:6379
SUPABASE_STAGING_URL=https://xxx.supabase.co
SUPABASE_STAGING_ANON_KEY=xxx
# ... other staging variables
```

### Production Environment

Production uses `.env.production` as a template. Configure the following in your production CI/CD:

```bash
DATABASE_URL=postgresql://user:pass@prod-db:5432/aqlix
REDIS_URL=redis://prod-redis:6379
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
# ... other production variables
```

## Required Secrets by Category

### Database & Storage

| Variable | Required | Format | Example |
|----------|----------|--------|---------|
| `DATABASE_URL` | ✅ | PostgreSQL URL | `postgresql://user:pass@host:5432/db` |
| `REDIS_URL` | ✅ | Redis URL | `redis://host:6379/0` |
| `SUPABASE_URL` | ✅ | HTTPS URL | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | ✅ | String | `eyJhbGc...` |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | String | `eyJhbGc...` |

### Application Security

| Variable | Required | Format | Example |
|----------|----------|--------|---------|
| `API_SECRET_KEY` | ✅ | 32+ random chars | `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |
| `JWT_SECRET` | ✅ | 32+ random chars | `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` |

**Generating secure keys:**
```bash
# Generate 32-character random string
python -c "import secrets; print(secrets.token_hex(16))"

# Or using OpenSSL
openssl rand -hex 16
```

### LLM & AI Services

| Variable | Required | Format | Notes |
|----------|----------|--------|-------|
| `OPENAI_API_KEY` | ✅ | String | From OpenAI platform |
| `OPENAI_MODEL` | ✅ | String | `gpt-4o` (production), `gpt-4o-mini` (cost) |

### Iraqi Payment Gateways

**ZainCash** (Min: 1000 IQD)

| Variable | Required | Notes |
|----------|----------|-------|
| `ZAINCASH_API_KEY` | ✅ | Merchant API key |
| `ZAINCASH_API_SECRET` | ✅ | Merchant secret |
| `ZAINCASH_MERCHANT_ID` | ✅ | Your merchant ID |

**FastPay** (Min: 500 IQD)

| Variable | Required | Notes |
|----------|----------|-------|
| `FASTPAY_API_KEY` | ✅ | Merchant API key |
| `FASTPAY_API_SECRET` | ✅ | Merchant secret |
| `FASTPAY_MERCHANT_ID` | ✅ | Your merchant ID |

**NassWallet** (Min: 1000 IQD)

| Variable | Required | Notes |
|----------|----------|-------|
| `NASSWALLET_API_KEY` | ✅ | Merchant API key |
| `NASSWALLET_API_SECRET` | ✅ | Merchant secret |
| `NASSWALLET_MERCHANT_ID` | ✅ | Your merchant ID |

### Email Service

| Variable | Required | Provider |
|----------|----------|----------|
| `SENDGRID_API_KEY` | ✅ | SendGrid |
| `EMAIL_FROM` | ✅ | All providers |

### Monitoring & Analytics

| Variable | Required | Notes |
|----------|----------|-------|
| `SENTRY_DSN` | ⚠️ | Optional but recommended |

### OAuth Providers (Optional)

| Variable | Required | Notes |
|----------|----------|-------|
| `GOOGLE_CLIENT_ID` | ⚠️ | For Google Sign-in |
| `GOOGLE_CLIENT_SECRET` | ⚠️ | For Google Sign-in |
| `MICROSOFT_CLIENT_ID` | ⚠️ | For Microsoft Sign-in |
| `MICROSOFT_CLIENT_SECRET` | ⚠️ | For Microsoft Sign-in |

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

env:
  # Staging
  DATABASE_URL_STAGING: ${{ secrets.DATABASE_URL_STAGING }}
  REDIS_URL_STAGING: ${{ secrets.REDIS_URL_STAGING }}
  SUPABASE_STAGING_URL: ${{ secrets.SUPABASE_STAGING_URL }}

  # Production
  DATABASE_URL: ${{ secrets.DATABASE_URL_PROD }}
  REDIS_URL: ${{ secrets.REDIS_URL_PROD }}
  SUPABASE_URL: ${{ secrets.SUPABASE_URL_PROD }}

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to production
        run: |
          docker build -f Dockerfile.api -t api:latest .
          docker run -e DATABASE_URL=$DATABASE_URL \
                     -e REDIS_URL=$REDIS_URL \
                     -e SUPABASE_URL=$SUPABASE_URL \
                     api:latest
```

### Docker Secrets (for Docker Swarm/Compose)

```yaml
services:
  api:
    environment:
      - DATABASE_URL=/run/secrets/db_url
    secrets:
      - db_url

secrets:
  db_url:
    external: true
```

## Rotating Secrets

### Database Password

1. Create new database user with new password
2. Update `DATABASE_URL` in all environments
3. Redeploy application
4. Delete old database user

### API Secret Keys

1. Generate new secret key
2. Update `API_SECRET_KEY` in all environments
3. Redeploy application
4. Invalidate all existing sessions (optional)

### Payment Gateway Credentials

1. Contact gateway merchant support
2. Rotate credentials in payment gateway dashboard
3. Update corresponding environment variables
4. Test in staging first
5. Deploy to production

### JWT Secret

⚠️ **Rotating JWT secret will invalidate all existing tokens**

1. Generate new JWT secret
2. Update `JWT_SECRET` in application
3. **Impact**: All users will need to re-login
4. Consider gradual rollout or off-peak time

## Security Best Practices

1. **Never commit secrets** - Use `.gitignore` for `.env` files
2. **Use strong passwords** - Minimum 32 characters, random
3. **Restrict access** - Limit who can view/modify secrets
4. **Audit logging** - Log all secret access and changes
5. **Regular rotation** - Rotate credentials quarterly
6. **Environment isolation** - Use different secrets per environment
7. **Secret scanning** - Use tools like `git-secrets` or `pre-commit`
8. **Access control** - Use IAM roles for service-to-service auth

## Validation

The application validates all required environment variables on startup:

```python
# From config/settings.py
# If any required variable is missing, the application will fail to start

REQUIRED_VARS = [
    'DATABASE_URL',
    'REDIS_URL',
    'OPENAI_API_KEY',
    'API_SECRET_KEY',
    # ... others
]
```

Check startup logs for missing variables:
```
ERROR: Missing required environment variable: DATABASE_URL
```

## Troubleshooting

### Application won't start - "Missing required environment variable"

1. Check which variable is missing from the error message
2. Add the variable to your `.env` file
3. Restart the application

### Wrong values in production - "Connection refused"

1. Verify the environment variable is set correctly
2. Check that the service (database, Redis, etc.) is accessible
3. Verify firewall/network rules
4. Check logs for connection details

### Secrets not being injected in Docker

1. Verify secrets are passed via `-e` flag or Docker Compose
2. Check that service can read from `/run/secrets/`
3. Verify file permissions on secret files

## Checklist for Production Deployment

- [ ] All required environment variables are set
- [ ] Database credentials are correct and secure
- [ ] API secret key is at least 32 random characters
- [ ] All payment gateway credentials are correct (test in staging first!)
- [ ] Monitoring/Sentry DSN is configured
- [ ] Email service credentials are set
- [ ] OAuth credentials are configured (if using)
- [ ] CORS origins are correct for production domain
- [ ] SSL/TLS certificates are valid
- [ ] Secrets are rotated at least quarterly
- [ ] Access to secrets is restricted and logged
- [ ] Backup recovery keys are stored securely

## References

- [Environment Variables Docs](https://docs.your-domain.com/env)
- [Security Best Practices](https://docs.your-domain.com/security)
- [Deployment Guide](https://docs.your-domain.com/deployment)
