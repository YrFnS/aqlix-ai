name: "Railway Deployment Configuration for Iraqi AI Chat System"
description: |

## Goal
Create comprehensive Railway platform deployment foundation for the Iraqi AI Chat System with monorepo service orchestration, production-ready automation, and cultural intelligence preservation. Deploy Next.js frontend, FastAPI backend with Iraqi cultural engines, and PostgreSQL database using Railway's developer-friendly platform.

## Why
- **Developer Experience**: Railway provides zero-config deployment with usage-based pricing optimal for Iraqi AI workloads
- **Monorepo Support**: Native support for Bun workspaces with service isolation and efficient builds
- **Cultural Intelligence Preservation**: Maintain 95%+ cultural compliance, 90%+ Arabic dialect accuracy, and 98%+ Islamic compliance during platform migration
- **Cost Optimization**: Usage-based billing more cost-effective than flat pricing for variable Iraqi AI processing loads
- **Scalability**: Auto-scaling capabilities handle cultural processing spikes during peak usage periods

## What
Railway deployment system with comprehensive service orchestration, environment management, health monitoring, and cultural intelligence validation endpoints.

### Success Criteria
- [ ] Railway CLI configured and authenticated
- [ ] Three services deployed: web (Next.js), api (FastAPI), postgres (Database)
- [ ] Environment variables properly scoped and secured
- [ ] Health checks responding for all Iraqi AI components
- [ ] Cultural validation endpoints accessible: >95% compliance rate
- [ ] Arabic processing endpoints functional: >90% dialect accuracy
- [ ] Professional domain validation working: >95% accuracy rate
- [ ] Custom domain configured with SSL certificates
- [ ] Auto-scaling policies active for cultural processing loads

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Railway Platform Documentation
- url: https://docs.railway.com/guides/monorepo
  why: Comprehensive monorepo deployment patterns and configuration
  
- url: https://docs.railway.com/reference/config-as-code
  why: railway.json configuration file structure and parameters
  
- url: https://docs.railway.com/guides/variables
  why: Environment variable scoping, sealed variables, and security

- url: https://docs.railway.com/guides/fastapi  
  why: FastAPI deployment methods and best practices
  
- url: https://docs.railway.com/reference/cli-api
  why: Railway CLI commands and automation capabilities

# MUST REFERENCE - Existing Deployment Patterns  
- file: examples/phase3-reference-implementations/PHASE3_DEPLOYMENT.md
  why: Iraqi AI deployment architecture and performance requirements

- file: examples/phase3-reference-implementations/iraqi-deployment/package.json
  why: Deployment scripts, health checks, and Iraqi AI component testing

- file: examples/phase3-reference-implementations/iraqi-deployment/src/orchestration/iraqi-deployment-orchestrator.ts
  why: Component health checking, metrics collection, and cultural validation patterns

# CRITICAL - Monorepo Examples
- url: https://github.com/GRoobArt/Railway-Monorepo-Next-Nest
  why: Real-world monorepo structure with Next.js and NestJS on Railway

- url: https://bun.com/guides/install/workspaces
  why: Bun workspace configuration for Railway deployment optimization
```

### Current Codebase Structure (Inferred)
```bash
aqlix-ai/
├── apps/
│   ├── web/              # Next.js frontend (to be created)
│   └── api/              # FastAPI backend (to be created)
├── packages/
│   ├── iraqi-cultural-engine/    # Cultural decision engine
│   ├── iraqi-arabic-nlp/         # Arabic dialect processing
│   ├── iraqi-professional-domains/  # Professional validation
│   ├── iraqi-cultural-learning/   # ML cultural adaptation
│   └── types/            # Shared TypeScript types
├── examples/phase3-reference-implementations/
│   └── iraqi-deployment/ # Existing deployment orchestration
├── package.json          # Root workspace configuration
└── CLAUDE.md            # Project instructions and standards
```

### Desired Railway Deployment Structure
```bash
aqlix-ai/
├── apps/
│   ├── web/
│   │   ├── railway.json          # Next.js service configuration
│   │   ├── package.json          # Web dependencies
│   │   └── next.config.js        # Next.js configuration
│   └── api/
│       ├── railway.json          # FastAPI service configuration
│       ├── requirements.txt      # Python dependencies
│       ├── main.py              # FastAPI application
│       └── Dockerfile           # Container configuration
├── railway-project.json         # Project-level Railway configuration
├── .railway/                    # Railway CLI configuration
└── scripts/
    ├── deploy.sh               # Deployment automation
    ├── health-check.sh         # Health validation
    └── cultural-validation.sh  # Iraqi AI testing
```

### Known Gotchas & Critical Requirements
```bash
# CRITICAL: Railway Configuration Gotchas
# Railway config files don't follow root directory paths - use absolute paths
# railway.json preferred over railway.toml for schema validation
# Watch paths essential for monorepo efficiency - prevent unnecessary builds

# CRITICAL: Iraqi AI Component Requirements
# Cultural Decision Engine: <200ms response, 98%+ Islamic compliance
# Arabic NLP Pipeline: <300ms processing, 90%+ dialect accuracy  
# Professional Validator: <500ms validation, 95%+ accuracy
# Cultural Learning: <200ms inference, 90%+ prediction accuracy

# CRITICAL: Bun Workspace Integration
# Railway detects Bun automatically but requires proper package.json setup
# Environment variables must be scoped per service for Iraqi components
# Health checks must validate cultural intelligence metrics, not just HTTP status

# CRITICAL: Security Requirements
# Use sealed variables for API keys and cultural model secrets
# Railway provides $RAILWAY_PUBLIC_DOMAIN for service communication
# PostgreSQL connection strings auto-generated but need cultural schema setup
```

## Implementation Blueprint

### Data Models and Configuration Schemas
```typescript
// Railway Configuration Types
interface RailwayServiceConfig {
  build: {
    builder: "NIXPACKS" | "DOCKERFILE";
    buildCommand?: string;
    watchPaths?: string[];
  };
  deploy: {
    startCommand: string;
    healthcheckPath?: string;
    healthcheckTimeout?: number;
    restartPolicy?: "ON_FAILURE" | "NEVER";
  };
}

interface IraqiAIEnvironmentVars {
  // Core Configuration
  NODE_ENV: "production" | "staging" | "development";
  RAILWAY_ENVIRONMENT: string;
  
  // Iraqi AI Components
  IRAQI_CULTURAL_ENGINE_ENABLED: "true" | "false";
  ARABIC_NLP_PIPELINE_ENABLED: "true" | "false";
  PROFESSIONAL_VALIDATION_ENABLED: "true" | "false";
  CULTURAL_LEARNING_ENABLED: "true" | "false";
  
  // Performance Thresholds
  CULTURAL_VALIDATION_TIMEOUT: "200";
  ARABIC_NLP_TIMEOUT: "300"; 
  PROFESSIONAL_VALIDATION_TIMEOUT: "500";
  LEARNING_INFERENCE_TIMEOUT: "200";
  
  // Quality Thresholds
  CULTURAL_COMPLIANCE_THRESHOLD: "95";
  ISLAMIC_COMPLIANCE_THRESHOLD: "98";
  ARABIC_DIALECT_ACCURACY_THRESHOLD: "90";
  PROFESSIONAL_ACCURACY_THRESHOLD: "95";
}
```

### Task Implementation Sequence
```yaml
Task 1 - Railway CLI Setup and Authentication:
  INSTALL Railway CLI:
    - METHOD: npm install -g @railway/cli
    - VERIFY: railway --version
    - AUTH: railway login
  
  CREATE Railway Project:
    - COMMAND: railway init
    - SELECT: "Create new project"
    - NAME: "iraqi-ai-chat-system"

Task 2 - PostgreSQL Database Service:
  ADD Database Service:
    - COMMAND: railway add --database postgres
    - CONFIGURE: Set PGDATABASE, PGUSER, PGPASSWORD variables
    - INIT: Create Iraqi AI schema with cultural tables

Task 3 - Web Service Configuration (Next.js Frontend):
  CREATE apps/web/railway.json:
    - PATTERN: Mirror existing Next.js Railway configs
    - SET: Root directory to "apps/web"  
    - CONFIGURE: Build and deployment commands
    - ADD: Watch paths for efficient rebuilds
  
  UPDATE apps/web/package.json:
    - ADD: Next.js dependencies and build scripts
    - CONFIGURE: Bun workspace references

Task 4 - API Service Configuration (FastAPI Backend):  
  CREATE apps/api/railway.json:
    - PATTERN: Follow FastAPI Railway deployment guide
    - SET: Root directory to "apps/api"
    - CONFIGURE: Python runtime and dependencies
    - ADD: Health check endpoint configuration
  
  CREATE apps/api/requirements.txt:
    - INCLUDE: FastAPI, uvicorn, Iraqi AI packages
    - ADD: Database and monitoring dependencies

Task 5 - Environment Variable Configuration:
  CONFIGURE Service Variables:
    - WEB: Next.js environment variables and API URLs
    - API: Iraqi AI component configuration and thresholds
    - SHARED: Database connection and monitoring settings
  
  SETUP Sealed Variables:
    - SEAL: API keys, cultural model secrets, JWT secrets
    - VERIFY: Variables not visible in Railway dashboard

Task 6 - Service Health Checks and Monitoring:
  IMPLEMENT Health Check Endpoints:
    - API: /health - Basic service health
    - API: /health/cultural - Cultural engine validation
    - API: /health/arabic - Arabic NLP validation
    - API: /health/professional - Professional validator check
  
  CONFIGURE Railway Health Checks:
    - SET: Health check paths in railway.json
    - CONFIGURE: Timeout and retry policies

Task 7 - Service Communication and Networking:
  SETUP Internal Service URLs:
    - USE: $RAILWAY_PUBLIC_DOMAIN for API communication
    - CONFIGURE: CORS for cross-service requests
    - VERIFY: Database connection from API service

Task 8 - Custom Domain and SSL Configuration:
  CONFIGURE Custom Domain:
    - DOMAIN: Set production domain in Railway dashboard
    - SSL: Enable automatic SSL certificate management
    - DNS: Configure DNS records for domain

Task 9 - Auto-scaling and Performance Configuration:
  CONFIGURE Scaling Policies:
    - WEB: Scale based on request volume
    - API: Scale based on cultural processing load
    - SET: Min/max instances for cost optimization

Task 10 - Deployment Automation Scripts:
  CREATE Deployment Scripts:
    - scripts/deploy.sh: Multi-service deployment
    - scripts/health-check.sh: Comprehensive health validation
    - scripts/cultural-validation.sh: Iraqi AI component testing
```

### Critical Integration Points
```yaml
ENVIRONMENT_VARIABLES:
  - scope: web_service
    variables: ["NEXT_PUBLIC_API_URL", "NEXT_PUBLIC_RAILWAY_ENV"]
  
  - scope: api_service  
    variables: ["DATABASE_URL", "IRAQI_CULTURAL_ENGINE_ENABLED", "ARABIC_NLP_PIPELINE_ENABLED"]
  
  - scope: shared
    variables: ["RAILWAY_ENVIRONMENT", "SENTRY_DSN", "LOG_LEVEL"]

DATABASE_INTEGRATION:
  - migration: "Create Iraqi AI cultural validation tables"
  - schema: "cultural_decisions, arabic_processing_cache, professional_validations"
  - indexes: "Performance indexes for cultural queries"

SERVICE_COMMUNICATION:
  - web_to_api: "Use RAILWAY_PUBLIC_DOMAIN for API calls"  
  - api_to_db: "Auto-configured DATABASE_URL from Railway"
  - monitoring: "Health check endpoints for each Iraqi AI component"
```

## Validation Loops

### Level 1: Railway Configuration and Authentication
```bash
# FIRST: Verify Railway CLI setup
railway --version
railway whoami

# Validate configuration files
railway config validate

# Check project services
railway status

# Expected: CLI authenticated, config files valid, services listed
# If errors: Re-authenticate with railway login, fix JSON syntax errors
```

### Level 2: Service Deployment and Health
```bash
# Deploy each service individually
railway up --service web
railway up --service api
railway up --service postgres

# Verify deployments
railway logs --service web --tail 50
railway logs --service api --tail 50

# Check service status  
railway ps

# Expected: All services "RUNNING", no error logs, healthy status
# If errors: Check logs for startup failures, fix environment variables
```

### Level 3: Iraqi AI Component Validation
```bash
# Get API service URL
API_URL=$(railway variables get RAILWAY_PUBLIC_DOMAIN --service api)

# Test basic health check
curl -f "$API_URL/health" || echo "Health check failed"

# Test cultural validation (95%+ compliance required)
curl -X POST "$API_URL/cultural/validate" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "السلام عليكم ورحمة الله وبركاته",
    "cultural_context": {
      "user_context": {
        "cultural_background": "iraqi",
        "religious_affiliation": "muslim"
      }
    }
  }' | jq '.islamic_compliance_score' | awk '$1 >= 98 {exit 0} {exit 1}'

# Test Arabic NLP processing (90%+ accuracy required)  
curl -X POST "$API_URL/arabic/process" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "شلونك اليوم؟ شكو ماكو بالعراق؟",
    "culturalContext": {
      "user_context": {
        "cultural_background": "iraqi"
      }
    }
  }' | jq '.dialect_analysis.accuracy' | awk '$1 >= 90 {exit 0} {exit 1}'

# Test professional domain validation (95%+ accuracy required)
curl -X POST "$API_URL/professional/validate" \
  -H "Content-Type: application/json" \
  -d '{
    "content": {
      "text": "هذا محتوى طبي للاستشارة العامة",
      "language": "ar"
    },
    "domain": {"primary": "medical"},
    "thresholds": {
      "accuracy_threshold": 95,
      "cultural_appropriateness": 90
    }
  }' | jq '.overall.confidence_score' | awk '$1 >= 95 {exit 0} {exit 1}'

# Expected: All API calls return 200, compliance scores meet thresholds
# If failing: Check Iraqi AI component configuration, verify environment variables
```

### Level 4: End-to-End Integration Test
```bash
# Get web service URL
WEB_URL=$(railway variables get RAILWAY_PUBLIC_DOMAIN --service web)

# Test Next.js frontend loads
curl -f "$WEB_URL" | grep -q "Iraqi AI Chat" || echo "Frontend load failed"

# Test frontend-to-API communication
curl -f "$WEB_URL/api/test" || echo "Frontend-API communication failed"

# Test database connectivity
curl -f "$API_URL/health/database" || echo "Database connectivity failed"

# Expected: Frontend loads, API communication works, database connected
# If failing: Check CORS configuration, service URLs, database migrations
```

## Final Validation Checklist
- [ ] Railway CLI authenticated: `railway whoami`
- [ ] All services deployed: `railway ps | grep RUNNING | wc -l` equals 3
- [ ] Environment variables configured: `railway variables list`
- [ ] Health checks passing: `curl -f $API_URL/health`
- [ ] Cultural validation >95%: Test cultural compliance endpoint
- [ ] Arabic processing >90%: Test dialect recognition accuracy
- [ ] Professional validation >95%: Test domain-specific accuracy
- [ ] Database connectivity: `curl -f $API_URL/health/database`
- [ ] Frontend-API integration: Test cross-service communication
- [ ] SSL certificates active: `curl -I $WEB_URL | grep "HTTP/2 200"`
- [ ] Auto-scaling configured: Check Railway dashboard scaling settings
- [ ] Custom domain configured: DNS resolution working
- [ ] Monitoring active: Iraqi AI metrics being collected

---

## Configuration Templates

### apps/web/railway.json (Next.js Frontend)
```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "bun run build",
    "watchPaths": [
      "apps/web/**",
      "packages/types/**",
      "packages/ui/**"
    ]
  },
  "deploy": {
    "startCommand": "bun run start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 30,
    "restartPolicy": "ON_FAILURE"
  }
}
```

### apps/api/railway.json (FastAPI Backend)
```json
{
  "$schema": "https://railway.com/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pip install -r requirements.txt",
    "watchPaths": [
      "apps/api/**",
      "packages/iraqi-cultural-engine/**",
      "packages/iraqi-arabic-nlp/**",
      "packages/iraqi-professional-domains/**"
    ]
  },
  "deploy": {
    "startCommand": "uvicorn main:app --host 0.0.0.0 --port $PORT",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 60,
    "restartPolicy": "ON_FAILURE"
  }
}
```

### Railway Environment Variables Template
```bash
# Service: web
NEXT_PUBLIC_API_URL=${{api.RAILWAY_PUBLIC_DOMAIN}}
NEXT_PUBLIC_RAILWAY_ENV=${{RAILWAY_ENVIRONMENT}}

# Service: api  
DATABASE_URL=${{Postgres.DATABASE_URL}}
IRAQI_CULTURAL_ENGINE_ENABLED=true
ARABIC_NLP_PIPELINE_ENABLED=true
PROFESSIONAL_VALIDATION_ENABLED=true
CULTURAL_LEARNING_ENABLED=true
CULTURAL_VALIDATION_TIMEOUT=200
ARABIC_NLP_TIMEOUT=300
PROFESSIONAL_VALIDATION_TIMEOUT=500
CULTURAL_COMPLIANCE_THRESHOLD=95
ISLAMIC_COMPLIANCE_THRESHOLD=98

# Shared variables
RAILWAY_ENVIRONMENT=${{RAILWAY_ENVIRONMENT}}
SENTRY_DSN=${{SENTRY_DSN}} # Sealed variable
LOG_LEVEL=info
```

## Anti-Patterns to Avoid
- ❌ Don't use relative paths in Railway config files - they don't follow root directory
- ❌ Don't skip watch paths configuration - causes unnecessary rebuilds in monorepo
- ❌ Don't use railway.toml when railway.json provides schema validation
- ❌ Don't put sensitive variables as regular variables - use sealed variables
- ❌ Don't skip Iraqi AI component health checks - cultural compliance is critical
- ❌ Don't hardcode service URLs - use Railway's environment variables
- ❌ Don't deploy without testing cultural validation endpoints first
- ❌ Don't ignore performance thresholds - they're requirements, not suggestions

**PRP Confidence Score: 8.5/10** - High confidence due to comprehensive Railway research, existing Iraqi deployment patterns, and executable validation gates that enable iterative refinement.