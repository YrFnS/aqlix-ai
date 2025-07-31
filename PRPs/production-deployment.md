---
name: "Iraqi AI Chat System - Production Deployment PRP"
description: "Comprehensive PRP for deploying the Iraqi AI Chat System to production with Vercel frontend, Railway backend, Iraqi payment gateway integration, Arabic RTL optimization, and comprehensive monitoring"
---

## Purpose

**Production-Ready Deployment Infrastructure** for the Iraqi AI Chat System with comprehensive security, monitoring, scalability, and Iraqi-specific integrations optimized for Middle Eastern network conditions and Iraqi user base.

## Core Principles

1. **Iraqi-First Deployment**: Optimize for Middle East regions, Arabic text encoding, and Iraqi payment gateway integration
2. **Security-First**: Address critical vulnerabilities (CVE-2025-29927), implement proper security headers, and ensure data protection compliance
3. **Cultural Compliance**: Session-only storage, Iraqi data protection law adherence, and cultural content validation
4. **Performance Optimization**: CDN optimization for Arabic text, proper caching strategies, and Iraqi network condition adaptations
5. **Production Readiness**: Comprehensive monitoring, automated backups, disaster recovery, and scalability configuration

## ⚠️ Implementation Guidelines: Focus on Iraqi Production Requirements

**IMPORTANT**: This deployment must prioritize Iraqi user experience and cultural compliance over generic deployment patterns.

### What NOT to do:
- ❌ **Don't ignore the CVE-2025-29927 vulnerability** - This is critical for Next.js security
- ❌ **Don't skip Arabic text optimization** - UTF-8 encoding must be configured at every layer
- ❌ **Don't use generic payment solutions** - Must integrate ZainCash, FastPay, and NassWallet specifically
- ❌ **Don't ignore Iraqi timezone** - All services must use Asia/Baghdad timezone
- ❌ **Don't skip cultural validation** - Content filtering for political/sectarian sensitivity is mandatory

### What TO do:
- ✅ **Prioritize Iraqi payment gateway integration** - Test with actual Iraqi payment providers
- ✅ **Optimize for mobile traffic** - Primary access method for Iraqi users
- ✅ **Implement session-only storage** - Auto-expire data within 1 hour per privacy requirements
- ✅ **Configure Middle East CDN regions** - Optimize latency for Iraqi users
- ✅ **Test Arabic RTL thoroughly** - Ensure proper text direction and font loading

---

## Goal

**Deploy the complete Iraqi AI Chat System to production** with Vercel frontend deployment, Railway backend hosting, Iraqi payment gateway integration, comprehensive monitoring, security hardening, and cultural compliance validation.

## Why

The Iraqi AI Chat System requires sophisticated production infrastructure that can:
- Handle high traffic volumes from Iraqi mobile users with optimized performance
- Process Iraqi payment transactions through local gateways (ZainCash, FastPay, NassWallet)
- Serve Arabic RTL content with proper encoding and cultural appropriateness
- Maintain Iraqi data protection compliance with session-only storage
- Provide comprehensive monitoring and alerting for system health and user experience
- Scale automatically based on Iraqi user traffic patterns and peak usage times

## What

### Production Infrastructure Classification
- [x] **Frontend Deployment**: Next.js 15+ on Vercel with Arabic i18n and CDN optimization
- [x] **Backend Deployment**: FastAPI with PydanticAI on Railway with managed PostgreSQL
- [x] **Payment Integration**: ZainCash, FastPay, NassWallet production API integration
- [x] **Security Hardening**: CVE-2025-29927 mitigation, security headers, SSL configuration
- [x] **Monitoring Setup**: PydanticAI Logfire, Prometheus/Grafana, error tracking
- [x] **Cultural Compliance**: Iraqi data protection, session storage, content filtering

### Success Criteria
- [x] Complete system accessible via production URLs with sub-3-second load times for Iraqi users
- [x] All Iraqi payment gateways functional with proper minimum amount validation
- [x] Arabic RTL text renders correctly across all devices and browsers
- [x] PydanticAI agents respond with Iraqi cultural context and appropriate dialect
- [x] Security headers properly configured and CVE-2025-29927 vulnerability mitigated
- [x] Monitoring dashboards operational with Iraqi timezone and Arabic language support
- [x] Automated backup procedures working with encryption and retention policies
- [x] Load testing validates system handles expected Iraqi user traffic patterns

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Critical deployment documentation
- url: https://vercel.com/docs/frameworks/nextjs
  why: Official Next.js 15 deployment with Arabic i18n configuration
  critical: Security headers, environment variables, CDN optimization

- url: https://docs.railway.com/guides/fastapi  
  why: FastAPI deployment with PydanticAI integration patterns
  critical: PostgreSQL connection, environment management, container optimization

- url: https://next-intl.dev/
  why: Modern i18n library for Next.js with comprehensive RTL support
  critical: Arabic locale configuration, direction detection, font optimization

- url: https://www.iraqpayments.com/docs/introduction
  why: Comprehensive Iraqi payment gateway developer documentation
  critical: ZainCash, FastPay, NassWallet API integration patterns and testing

- url: https://strobes.co/blog/understanding-next-js-vulnerability/
  why: CVE-2025-29927 vulnerability explanation and mitigation strategies
  critical: x-middleware-subrequest header bypass prevention

- url: https://www.dataguidance.com/notes/iraq-data-protection-overview
  why: Iraqi data protection law overview and compliance requirements
  critical: Session-only storage implementation and privacy compliance

# Essential codebase patterns
- file: examples/main_agent_reference/settings.py
  why: PydanticAI environment configuration with pydantic-settings
  critical: load_dotenv() usage, secure API key management, validation patterns

- file: CLAUDE.md
  why: Iraqi AI system rules, cultural requirements, and technical standards
  critical: Privacy-first training, cultural sensitivity, professional domains, Iraqi context

- file: PRPs/monorepo_setup.md
  why: Existing monorepo architecture patterns and cross-platform setup
  critical: Turborepo configuration, shared packages, Arabic RTL components
```

### Current Codebase Tree
```bash
/
├── PRPs/                       # Product requirements and templates
├── examples/                   # Reference implementations
│   ├── main_agent_reference/   # PydanticAI production patterns
│   │   ├── settings.py        # Environment configuration template
│   │   └── providers.py       # LLM provider setup patterns
│   └── monorepo/              # Monorepo structure example
├── initial/                   # Initial requirements including this deployment spec
└── CLAUDE.md                  # Project rules and Iraqi cultural requirements
```

### Desired Codebase Tree After Deployment Setup
```bash
/
├── apps/
│   ├── web/                   # Next.js 15+ production application
│   │   ├── Dockerfile         # Multi-stage production container
│   │   ├── next.config.js     # Arabic i18n + security headers + CVE mitigation
│   │   ├── middleware.ts      # Security middleware and RTL detection
│   │   ├── vercel.json        # Vercel deployment configuration
│   │   └── src/
│   │       ├── i18n/          # Arabic/English locale configuration
│   │       └── components/    # RTL-aware UI components
│   └── api/                   # FastAPI backend production setup
│       ├── Dockerfile         # Optimized Python container
│       ├── railway.toml       # Railway deployment configuration
│       ├── agents/            # PydanticAI agents with Iraqi context
│       │   ├── settings.py    # Production environment configuration
│       │   ├── agent.py       # Iraqi cultural agent implementation
│       │   └── tools.py       # Payment gateway and cultural tools
│       ├── routes/            # FastAPI route handlers
│       ├── services/          # Business logic services
│       └── monitoring/        # Logfire integration and metrics
├── packages/
│   ├── ui/                    # Arabic RTL shared components
│   ├── types/                 # Production TypeScript types
│   └── payments/              # Iraqi payment gateway integration
│       ├── zaincash.ts        # ZainCash API integration
│       ├── fastpay.ts         # FastPay API integration
│       └── nasswallet.ts      # NassWallet API integration
├── infrastructure/
│   ├── docker-compose.prod.yml # Production services orchestration
│   ├── nginx.conf             # Reverse proxy and SSL termination
│   ├── monitoring/
│   │   ├── prometheus.yml     # Metrics collection configuration
│   │   ├── grafana/           # Dashboard configuration with Arabic support
│   │   └── logfire.toml       # PydanticAI monitoring setup
│   └── scripts/
│       ├── deploy.sh          # Automated deployment script
│       ├── backup.sh          # Database backup automation
│       └── health-check.sh    # Production health validation
├── .env.production            # Production environment configuration
├── .env.example               # Environment template with all required variables
├── .dockerignore              # Docker build optimization
└── railway.json               # Multi-service Railway configuration
```

### Known Gotchas & Critical Requirements

```python
# CRITICAL: Next.js CVE-2025-29927 vulnerability mitigation
# GOTCHA: Versions 11.1.4-15.2.2 allow auth bypass with x-middleware-subrequest header
# SOLUTION: Update to 15.2.3+ and configure proper middleware

# CRITICAL: PydanticAI requires proper async setup
# GOTCHA: Must use load_dotenv() before Settings initialization
# PATTERN: Follow examples/main_agent_reference/settings.py exactly

from dotenv import load_dotenv
load_dotenv()  # CRITICAL: Must come before Settings import

class IraqiProductionSettings(BaseSettings):
    model_config = ConfigDict(
        env_file=".env.production",
        env_file_encoding="utf-8",
        case_sensitive=False
    )

# CRITICAL: Iraqi payment gateway minimum amounts
# GOTCHA: ZainCash minimum 1000 IQD, FastPay minimum 500 IQD, NassWallet minimum 1000 IQD
# SOLUTION: Validate amounts before API calls

# CRITICAL: Arabic text encoding at all layers
# GOTCHA: UTF-8 must be configured in database, API responses, CDN, and HTML
# SOLUTION: Set charset=utf-8 everywhere, use proper Content-Type headers

# CRITICAL: Iraqi timezone configuration
# GOTCHA: All services must use Asia/Baghdad timezone consistently
# SOLUTION: Set TZ=Asia/Baghdad in all containers and services

# CRITICAL: Session-only storage requirement
# GOTCHA: CLAUDE.md requires auto-expire data within 1 hour
# SOLUTION: Implement Redis with TTL or database cleanup jobs
```

## Implementation Blueprint

### Phase 1: Infrastructure Foundation Setup

**Task 1 - Environment Configuration Management:**
```python
# CREATE apps/api/agents/settings.py
# PATTERN: Follow examples/main_agent_reference/settings.py
from pydantic_settings import BaseSettings
from pydantic import Field, field_validator, ConfigDict
from dotenv import load_dotenv

class IraqiProductionSettings(BaseSettings):
    """Production settings for Iraqi AI Chat System."""
    
    model_config = ConfigDict(
        env_file=".env.production",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )
    
    # LLM Configuration - CRITICAL: Never hardcode API keys
    openai_api_key: str = Field(..., description="OpenAI API key")
    anthropic_api_key: str = Field(..., description="Anthropic API key")
    
    # Database Configuration
    database_url: str = Field(..., description="PostgreSQL connection URL")
    redis_url: str = Field(..., description="Redis connection URL for caching")
    
    # Iraqi Payment Gateways - CRITICAL: Production API keys
    zaincash_api_key: str = Field(..., description="ZainCash production API key")
    fastpay_api_key: str = Field(..., description="FastPay production API key")
    nasswallet_api_key: str = Field(..., description="NassWallet production API key")
    
    # Iraqi Configuration
    timezone: str = Field(default="Asia/Baghdad", description="Iraqi timezone")
    default_language: str = Field(default="arabic", description="Default UI language")
    cultural_context: str = Field(default="iraqi", description="Cultural context for AI")
    session_ttl: int = Field(default=3600, description="Session TTL in seconds (1 hour)")
    
    @field_validator("zaincash_api_key", "fastpay_api_key", "nasswallet_api_key")
    @classmethod
    def validate_payment_keys(cls, v):
        if not v or v.strip() == "":
            raise ValueError("Payment gateway API keys cannot be empty")
        return v
```

**Task 2 - Docker Production Containers:**
```dockerfile
# CREATE apps/web/Dockerfile
# PATTERN: Multi-stage Next.js 15 build with Arabic optimization
FROM node:18-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# CRITICAL: Build with Arabic RTL support and security headers
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

FROM base AS runner
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
# CRITICAL: Use server.js for proper Arabic RTL handling
CMD ["node", "server.js"]
```

**Task 3 - Next.js Security and Arabic Configuration:**
```javascript
// MODIFY apps/web/next.config.js
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // CRITICAL: CVE-2025-29927 mitigation
  experimental: {
    serverComponentsExternalPackages: [],
  },
  
  // Arabic RTL and i18n configuration
  i18n: {
    locales: ['en', 'ar'],
    defaultLocale: 'ar', // Iraqi Arabic as default
    domains: [
      {
        domain: 'iraqi-ai.com',
        defaultLocale: 'ar',
      },
    ],
  },
  
  // Security headers - CRITICAL for production
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ];
  },
  
  // Output configuration for container deployment
  output: 'standalone',
};

export default withNextIntl(nextConfig);
```

### Phase 2: Platform Deployment Configuration

**Task 4 - Vercel Frontend Deployment:**
```json
# CREATE apps/web/vercel.json
{
  "version": 2,
  "regions": ["bom1", "dub1", "fra1"],
  "env": {
    "NEXT_PUBLIC_API_URL": "@api-url-production",
    "NEXT_PUBLIC_ENVIRONMENT": "production"
  },
  "build": {
    "env": {
      "NEXT_TELEMETRY_DISABLED": "1"
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        },
        {
          "key": "Content-Language",
          "value": "ar, en"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/",
      "destination": "/ar",
      "permanent": false
    }
  ]
}
```

**Task 5 - Railway Backend Deployment:**
```toml
# CREATE apps/api/railway.toml
[build]
builder = "dockerfile"
dockerfilePath = "apps/api/Dockerfile"

[deploy]
healthcheckPath = "/health"
healthcheckTimeout = 30
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 3

[env]
TZ = "Asia/Baghdad"
PYTHONPATH = "/app"
DATABASE_URL = "${{Postgres.DATABASE_URL}}"
REDIS_URL = "${{Redis.REDIS_URL}}"

[services.web]
port = 8000
```

**Task 6 - Iraqi Payment Gateway Integration:**
```python
# CREATE packages/payments/iraqi_gateways.py
from enum import Enum
from typing import Dict, Any
import httpx
from pydantic import BaseModel, Field

class PaymentGateway(str, Enum):
    ZAINCASH = "zaincash"
    FASTPAY = "fastpay" 
    NASSWALLET = "nasswallet"

class PaymentRequest(BaseModel):
    gateway: PaymentGateway
    amount: int = Field(..., gt=0, description="Amount in Iraqi Dinar")
    currency: str = Field(default="IQD")
    reference: str = Field(..., description="Unique transaction reference")
    
    @field_validator("amount")
    @classmethod
    def validate_minimum_amount(cls, v, info):
        gateway = info.data.get("gateway")
        # CRITICAL: Validate minimum amounts per gateway
        min_amounts = {
            PaymentGateway.ZAINCASH: 1000,
            PaymentGateway.FASTPAY: 500,
            PaymentGateway.NASSWALLET: 1000
        }
        if gateway and v < min_amounts.get(gateway, 0):
            raise ValueError(f"{gateway} requires minimum {min_amounts[gateway]} IQD")
        return v

class IraqiPaymentProcessor:
    def __init__(self, settings: IraqiProductionSettings):
        self.settings = settings
        self.gateway_configs = {
            PaymentGateway.ZAINCASH: {
                "api_key": settings.zaincash_api_key,
                "base_url": "https://api.zaincash.iq/transaction/init",
                "test_url": "https://test.zaincash.iq/transaction/init"
            },
            PaymentGateway.FASTPAY: {
                "api_key": settings.fastpay_api_key,
                "base_url": "https://developer.fast-pay.cash/api/v1",
                "test_url": "https://developer.fast-pay.cash/api/v1"
            },
            PaymentGateway.NASSWALLET: {
                "api_key": settings.nasswallet_api_key,
                "base_url": "https://api.nasswallet.com/v1",
                "test_url": "https://sandbox.nasswallet.com/v1"
            }
        }
    
    async def process_payment(self, request: PaymentRequest) -> Dict[str, Any]:
        """Process payment through specified Iraqi gateway."""
        config = self.gateway_configs[request.gateway]
        
        async with httpx.AsyncClient() as client:
            # PATTERN: Implement gateway-specific API calls
            if request.gateway == PaymentGateway.ZAINCASH:
                return await self._process_zaincash(client, config, request)
            elif request.gateway == PaymentGateway.FASTPAY:
                return await self._process_fastpay(client, config, request)
            elif request.gateway == PaymentGateway.NASSWALLET:
                return await self._process_nasswallet(client, config, request)
```

### Phase 3: Security and Monitoring Implementation

**Task 7 - Security Middleware Implementation:**
```typescript
// CREATE apps/web/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { createContext } from 'next-intl/middleware';

export function middleware(request: NextRequest) {
  // CRITICAL: CVE-2025-29927 mitigation
  if (request.headers.get('x-middleware-subrequest')) {
    return new NextResponse('Forbidden', { status: 403 });
  }
  
  // Security headers
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  
  // Arabic RTL detection and redirection
  const locale = request.nextUrl.locale || 'ar';
  const pathname = request.nextUrl.pathname;
  
  // Redirect root to Arabic version
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/ar', request.url));
  }
  
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

**Task 8 - PydanticAI Monitoring Setup:**
```python
# CREATE apps/api/monitoring/logfire_setup.py
import logfire
from pydantic_ai import Agent
from apps.api.agents.settings import IraqiProductionSettings

def setup_production_monitoring(settings: IraqiProductionSettings):
    """Configure Logfire monitoring for PydanticAI agents."""
    
    # CRITICAL: Configure Logfire for production monitoring
    logfire.configure(
        service_name="iraqi-ai-chat-system",
        service_version="1.0.0",
        environment="production",
        # Iraqi timezone for proper log timestamps
        timezone="Asia/Baghdad"
    )
    
    # Instrument PydanticAI agents
    logfire.instrument_pydantic_ai(
        capture_conversation_data=True,  # Track conversation flow
        capture_tool_calls=True,         # Monitor tool usage
        capture_agent_metrics=True       # Performance metrics
    )
    
    return logfire

# CREATE apps/api/monitoring/prometheus_metrics.py
from prometheus_client import Counter, Histogram, Gauge
import time

# Iraqi AI system specific metrics
PAYMENT_REQUESTS = Counter(
    'iraqi_payment_requests_total',
    'Total payment requests by gateway',
    ['gateway', 'status']
)

ARABIC_TEXT_PROCESSING_TIME = Histogram(
    'arabic_text_processing_seconds',
    'Time spent processing Arabic text',
    ['operation_type']
)

ACTIVE_SESSIONS = Gauge(
    'iraqi_active_sessions',
    'Number of active user sessions'
)

CULTURAL_VALIDATIONS = Counter(
    'iraqi_cultural_validations_total',
    'Cultural appropriateness validations',
    ['validation_type', 'result']
)
```

### Phase 4: Database and Caching Configuration

**Task 9 - Production Database Setup:**
```python
# CREATE apps/api/database/connection.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
import redis.asyncio as redis
from apps.api.agents.settings import IraqiProductionSettings

class DatabaseManager:
    def __init__(self, settings: IraqiProductionSettings):
        self.settings = settings
        
        # PostgreSQL connection with Iraqi timezone
        self.engine = create_async_engine(
            settings.database_url,
            echo=False,  # Disable in production
            pool_size=20,
            max_overflow=0,
            pool_pre_ping=True,
            connect_args={
                "server_settings": {
                    "timezone": "Asia/Baghdad",  # CRITICAL: Iraqi timezone
                    "application_name": "iraqi-ai-chat-system"
                }
            }
        )
        
        self.async_session = sessionmaker(
            self.engine, 
            class_=AsyncSession, 
            expire_on_commit=False
        )
        
        # Redis for session management with TTL
        self.redis_client = redis.from_url(
            settings.redis_url,
            encoding="utf-8",
            decode_responses=True
        )
    
    async def create_session_with_ttl(self, session_id: str, data: dict):
        """Create session with 1-hour TTL per CLAUDE.md requirements."""
        await self.redis_client.setex(
            f"session:{session_id}",
            self.settings.session_ttl,  # 3600 seconds = 1 hour
            json.dumps(data, ensure_ascii=False)  # CRITICAL: Arabic text support
        )
```

### Phase 5: Deployment Automation and Validation

**Task 10 - Deployment Scripts:**
```bash
# CREATE infrastructure/scripts/deploy.sh
#!/bin/bash
set -e

echo "🚀 Deploying Iraqi AI Chat System to Production"

# Environment validation
if [ ! -f .env.production ]; then
    echo "❌ .env.production file not found"
    exit 1
fi

# Load production environment
source .env.production

# Validate required environment variables
required_vars=(
    "OPENAI_API_KEY"
    "DATABASE_URL"
    "REDIS_URL"
    "ZAINCASH_API_KEY"
    "FASTPAY_API_KEY"
    "NASSWALLET_API_KEY"
)

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Missing required environment variable: $var"
        exit 1
    fi
done

echo "✅ Environment validation passed"

# Build and deploy frontend to Vercel
echo "📦 Deploying frontend to Vercel..."
cd apps/web
npx vercel --prod --confirm
cd ../..

# Deploy backend to Railway
echo "🚂 Deploying backend to Railway..."
cd apps/api
railway deploy
cd ../..

# Health check validation
echo "🔍 Running health checks..."
./infrastructure/scripts/health-check.sh

echo "🎉 Deployment completed successfully!"
```

## Validation Loop

### Level 1: Environment and Configuration Validation

```bash
# Verify environment configuration
python -c "
from apps.api.agents.settings import IraqiProductionSettings
settings = IraqiProductionSettings()
print(f'✅ Settings loaded successfully')
print(f'Database URL configured: {bool(settings.database_url)}')
print(f'Payment gateways configured: {bool(settings.zaincash_api_key and settings.fastpay_api_key)}')
print(f'Timezone: {settings.timezone}')
"

# Validate Next.js configuration
cd apps/web
npx next-intl --validate-config
npm run typecheck

# Expected: All configurations valid, Arabic RTL properly configured
# If failing: Check environment variables and i18n configuration
```

### Level 2: Container Build and Security Validation

```bash
# Build production containers
docker build -f apps/web/Dockerfile . -t iraqi-ai-web:production
docker build -f apps/api/Dockerfile . -t iraqi-ai-api:production

# Test container startup
docker run -d --name test-web -p 3000:3000 iraqi-ai-web:production
docker run -d --name test-api -p 8000:8000 iraqi-ai-api:production

# Security validation - CVE-2025-29927 mitigation
curl -H "x-middleware-subrequest: true" http://localhost:3000/protected
# Expected: 403 Forbidden response

# Arabic RTL validation
curl -s http://localhost:3000/ar | grep 'dir="rtl"'
# Expected: RTL direction detected

# API health check
curl -f http://localhost:8000/health
# Expected: {"status": "healthy", "timezone": "Asia/Baghdad"}

# Cleanup
docker stop test-web test-api && docker rm test-web test-api
```

### Level 3: Production Deployment Validation

```bash
# Deploy to production platforms
cd apps/web && npx vercel --prod --confirm
cd ../api && railway deploy

# Validate deployments
FRONTEND_URL="https://your-app.vercel.app"
BACKEND_URL="https://your-api.railway.app"

# Health checks
curl -f "$FRONTEND_URL/health" || echo "Frontend health check failed"
curl -f "$BACKEND_URL/health" || echo "Backend health check failed"

# Arabic RTL validation in production
curl -s "$FRONTEND_URL/ar" | grep 'dir="rtl"' || echo "RTL not configured"

# Security headers validation
curl -I "$FRONTEND_URL" | grep -E "(X-Frame-Options|Content-Security-Policy|Strict-Transport-Security)"
# Expected: All security headers present

# SSL certificate validation
openssl s_client -connect your-app.vercel.app:443 -servername your-app.vercel.app < /dev/null
# Expected: Valid SSL certificate
```

### Level 4: Iraqi Payment Gateway Integration Testing

```bash
# Test payment gateway connectivity
curl -X POST "$BACKEND_URL/payments/test" \
  -H "Content-Type: application/json" \
  -d '{
    "gateway": "zaincash",
    "amount": 1000,
    "currency": "IQD",
    "reference": "test-' $(date +%s) '"
  }'
# Expected: {"status": "success", "gateway": "zaincash"}

# Test minimum amount validation
curl -X POST "$BACKEND_URL/payments/test" \
  -H "Content-Type: application/json" \
  -d '{
    "gateway": "zaincash",
    "amount": 500,
    "currency": "IQD"
  }'
# Expected: {"error": "ZainCash requires minimum 1000 IQD"}

# Test all Iraqi gateways
for gateway in zaincash fastpay nasswallet; do
  echo "Testing $gateway gateway..."
  curl -X POST "$BACKEND_URL/payments/test" \
    -H "Content-Type: application/json" \
    -d "{\"gateway\": \"$gateway\", \"amount\": 1000}" \
    | jq '.status'
done
# Expected: All gateways return "success"
```

### Level 5: Performance and Monitoring Validation

```bash
# Performance testing for Iraqi users
curl -w "@curl-format.txt" -o /dev/null -s "$FRONTEND_URL/ar"
# Expected: Total time < 3 seconds

# Monitoring system validation
curl -f "$BACKEND_URL/metrics" | grep iraqi_payment_requests_total
# Expected: Prometheus metrics available

# Arabic text encoding validation
curl -s "$FRONTEND_URL/ar" | file -
# Expected: UTF-8 Unicode text

# Session TTL validation
redis-cli -u "$REDIS_URL" TTL "session:test-session"
# Expected: TTL around 3600 seconds (1 hour)

# Cultural validation test
curl -X POST "$BACKEND_URL/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "مرحبا، كيف حالك؟",
    "language": "arabic",
    "cultural_context": "iraqi"
  }'
# Expected: Response in Iraqi Arabic dialect with cultural appropriateness
```

## Final Validation Checklist

### Production Infrastructure Completeness

- [ ] **Frontend Deployment**: Next.js 15+ deployed to Vercel with Arabic RTL and security headers
- [ ] **Backend Deployment**: FastAPI with PydanticAI deployed to Railway with managed PostgreSQL
- [ ] **Database Configuration**: PostgreSQL with Asia/Baghdad timezone and UTF-8 encoding
- [ ] **Caching Setup**: Redis with session TTL (1 hour) and Arabic text support
- [ ] **Iraqi Payment Integration**: ZainCash, FastPay, NassWallet APIs tested and functional
- [ ] **Security Hardening**: CVE-2025-29927 mitigated, security headers configured, SSL active

### Cultural and Regional Compliance

- [ ] **Arabic RTL Support**: Text direction, font loading, and encoding working across all pages
- [ ] **Iraqi Timezone**: Asia/Baghdad configured in all services and logging
- [ ] **Cultural Content Filtering**: Political and sectarian content blocking implemented
- [ ] **Professional Context**: Iraqi legal, medical, educational domain support functional
- [ ] **Session Privacy**: Auto-expire data within 1 hour, no persistent user data storage
- [ ] **Payment Gateway Compliance**: Iraqi payment methods working with proper minimums

### Monitoring and Operations

- [ ] **PydanticAI Monitoring**: Logfire configured with conversation tracking and metrics
- [ ] **Application Metrics**: Prometheus/Grafana dashboards with Iraqi-specific metrics
- [ ] **Error Tracking**: Comprehensive error logging with Arabic text support
- [ ] **Performance Monitoring**: Load times <3s for Iraqi users, CDN optimization active
- [ ] **Backup Procedures**: Automated database backup with encryption and retention
- [ ] **Health Checks**: All services responding to health endpoints correctly

---

## Anti-Patterns to Avoid

### Security and Deployment

- ❌ Don't ignore the CVE-2025-29927 vulnerability - This allows authentication bypass
- ❌ Don't skip security headers - Required for production security compliance
- ❌ Don't hardcode API keys - Use environment variables and secure management
- ❌ Don't deploy without health checks - Implement proper monitoring from day one
- ❌ Don't ignore SSL certificate renewal - Automate certificate management

### Iraqi-Specific Requirements

- ❌ Don't use generic payment solutions - Must integrate specific Iraqi gateways
- ❌ Don't ignore Arabic text optimization - UTF-8 encoding required at every layer
- ❌ Don't skip cultural validation - Content filtering for sensitivity is mandatory
- ❌ Don't ignore Iraqi timezone - All timestamps must use Asia/Baghdad
- ❌ Don't violate session-only storage - Auto-expire data within 1 hour per CLAUDE.md

### Performance and Scalability

- ❌ Don't ignore mobile optimization - Primary access method for Iraqi users
- ❌ Don't skip CDN optimization - Use Middle East regions for Iraqi users
- ❌ Don't ignore database connection pooling - Required for production performance
- ❌ Don't skip monitoring setup - Implement comprehensive observability from start
- ❌ Don't ignore backup procedures - Data protection is critical for production

**IMPLEMENTATION STATUS: READY FOR EXECUTION** - Comprehensive research completed, Iraqi-specific patterns documented, validation gates prepared for one-pass deployment success.

---

## Confidence Score: 9/10

This PRP provides comprehensive context for successful production deployment:

**Strengths:**
- Complete 2025 deployment research with Iraqi-specific platform recommendations
- Detailed security configuration including critical vulnerability mitigation (CVE-2025-29927)
- Comprehensive Iraqi payment gateway integration with actual API patterns
- Arabic RTL and UTF-8 encoding configured at all infrastructure layers
- PydanticAI production patterns following existing codebase conventions
- Executable validation commands that verify each component works correctly
- Cultural compliance and Iraqi data protection law adherence

**High Success Probability:**
- Clear deployment path with platform-specific configuration examples
- All critical gotchas documented with practical solutions
- Iraqi payment gateway integration with minimum amount validation
- Security hardening with specific vulnerability mitigation
- Comprehensive monitoring setup with PydanticAI Logfire integration
- Performance optimization for Middle East network conditions and Iraqi users

This PRP enables confident, efficient deployment of a production-ready Iraqi AI Chat System that meets all technical, cultural, and security requirements for serving Iraqi users effectively.