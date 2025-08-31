name: "Iraqi AI Chat System - Deployment Pipeline PRP"
description: |
  Comprehensive deployment pipeline with CI/CD workflows, Docker containerization, environment management, and production deployment automation for reliable and secure application delivery with Iraqi cultural compliance validation.

---

## Goal
Implement a complete automated deployment pipeline for the Iraqi AI Chat System that provides:
- **CI/CD Automation**: GitHub Actions workflows for build, test, and deploy
- **Containerized Deployment**: Docker multi-stage builds with security hardening
- **Environment Management**: Dev/staging/production with secrets management
- **Security Integration**: OWASP-compliant security scanning and validation
- **Cultural Compliance**: Iraqi AI agent validation in deployment workflows
- **Monitoring & Rollback**: Health checks, performance monitoring, and automated rollback capabilities

## Why
- **Reliability**: Eliminate manual deployment errors and ensure consistent deployments across environments
- **Security**: Implement DevSecOps practices with automated vulnerability scanning and secrets management
- **Cultural Compliance**: Validate Iraqi cultural appropriateness and Arabic processing through automated testing
- **Developer Experience**: Enable fast, confident deployments with comprehensive validation loops
- **Production Readiness**: Support scalable deployment to production with monitoring and rollback capabilities
- **Integration**: Seamlessly integrate with existing Iraqi AI system architecture and agent workflows

## What
A production-ready deployment pipeline system that automates the entire deployment lifecycle from code commit to production deployment, including:

### Success Criteria
- [ ] GitHub Actions workflows execute build/test/deploy without manual intervention
- [ ] Docker containers deploy successfully to staging and production environments
- [ ] Security scans pass with zero critical vulnerabilities
- [ ] Cultural validation achieves 95%+ Iraqi compliance score
- [ ] Deployment completes in <10 minutes for staging, <15 minutes for production
- [ ] Rollback capability works within 5 minutes
- [ ] Health checks return positive status post-deployment
- [ ] All Iraqi AI agents integrate successfully with deployment validation

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- url: https://docs.github.com/en/actions
  why: Core GitHub Actions syntax, workflow triggers, and best practices
  section: Building and testing, Deployment, Security hardening
  
- url: https://github.blog/enterprise-software/ci-cd/build-ci-cd-pipeline-github-actions-four-steps/
  why: 2025 CI/CD workflow patterns and automation best practices
  critical: Multi-environment deployment strategies and approval processes

- url: https://docs.docker.com/build/building/multi-stage/
  why: Multi-stage Docker builds for production optimization
  section: Security hardening, non-root users, minimal attack surface
  
- url: https://owasp.org/www-project-devsecops-guideline/
  why: DevSecOps security practices and tool integration
  critical: SAST/DAST scanning, dependency checks, secrets management
  
- url: https://cheatsheetseries.owasp.org/cheatsheets/CI_CD_Security_Cheat_Sheet.html
  why: CI/CD specific security controls and threat mitigation
  section: Pipeline isolation, secure communication, access controls

- file: examples/phase3-reference-implementations/iraqi-deployment/package.json
  why: Existing deployment script patterns and Iraqi-specific commands
  critical: Bun commands, cultural validation scripts, performance benchmarking
  
- file: examples/phase3-reference-implementations/iraqi-deployment/src/orchestration/iraqi-deployment-orchestrator.ts
  why: Iraqi deployment orchestration patterns and health checking
  critical: Cultural compliance validation, professional domain integration

- docfile: CLAUDE.md
  why: Iraqi AI agent delegation rules and cultural validation requirements
  critical: 95%+ cultural compliance, agent workflow patterns, truthfulness protocol
```

### Current Codebase Tree
```bash
aqlix-ai/
├── .claude/
│   ├── agents/                    # 21 specialized Iraqi AI agents
│   └── settings.json
├── examples/
│   ├── phase3-reference-implementations/
│   │   └── iraqi-deployment/
│   │       ├── package.json       # Existing deployment patterns
│   │       └── src/
│   │           └── orchestration/ # Iraqi deployment orchestrator
├── PRPs/
├── CLAUDE.md                      # Agent delegation rules
└── NAMING_CONVENTIONS.md
```

### Desired Codebase Tree with files to be added
```bash
aqlix-ai/
├── .github/
│   ├── workflows/
│   │   ├── build.yml              # CI workflow: lint, test, build
│   │   ├── security.yml           # Security scanning workflow
│   │   ├── cultural-validation.yml # Iraqi AI agent validation
│   │   ├── deploy-staging.yml     # Staging deployment
│   │   ├── deploy-production.yml  # Production deployment with approval
│   │   └── rollback.yml           # Emergency rollback workflow
│   └── CODEOWNERS                 # Deployment approval requirements
├── docker/
│   ├── Dockerfile                 # Multi-stage production build
│   ├── docker-compose.staging.yml # Staging environment
│   ├── docker-compose.prod.yml   # Production environment
│   └── healthcheck.sh            # Container health check script
├── deployment/
│   ├── environments/
│   │   ├── development.env       # Dev environment config
│   │   ├── staging.env           # Staging environment config
│   │   └── production.env        # Production environment config
│   ├── scripts/
│   │   ├── deploy.sh             # Deployment orchestration script
│   │   ├── rollback.sh           # Rollback script
│   │   ├── health-check.sh       # Post-deployment validation
│   │   └── cultural-validate.sh  # Iraqi AI agent validation
│   └── monitoring/
│       ├── prometheus.yml        # Metrics configuration
│       └── alerts.yml            # Deployment alerts
└── package.json                   # Updated with deployment scripts
```

### Known Gotchas & Library Quirks
```typescript
// CRITICAL: Iraqi AI system specific requirements
// - ALWAYS validate cultural compliance before deployment
// - Arabic RTL processing must be tested in containers
// - Professional domain validation required for production
// - Bun runtime specifics for Iraqi packages

// CRITICAL: Docker multi-stage builds
// - Use Alpine base images for minimal attack surface
// - Run as non-root user for security
// - Health checks must validate Arabic processing
// - Environment variables for Iraqi cultural settings

// CRITICAL: GitHub Actions security
// - Never expose secrets in logs or error messages
// - Use environment-specific approval gates
// - Validate all inputs and sanitize outputs
// - Implement proper RBAC for deployment permissions

// CRITICAL: Deployment sequence
// - Cultural validation MUST pass before deployment
// - Health checks MUST validate Iraqi agent integration
// - Rollback MUST preserve cultural validation state
// - Performance benchmarks MUST include Arabic processing
```

## Implementation Blueprint

### Data Models and Structure
```typescript
// Deployment configuration models
interface DeploymentConfig {
  environment: 'development' | 'staging' | 'production';
  region: string;
  culturalValidation: CulturalValidationConfig;
  security: SecurityConfig;
  monitoring: MonitoringConfig;
}

interface CulturalValidationConfig {
  arabicProcessingEnabled: boolean;
  islamicComplianceThreshold: number; // 95% minimum
  professionalDomainsEnabled: string[];
  dialectSupport: IraqiDialectConfig;
}

interface SecurityConfig {
  vulnerabilityScanEnabled: boolean;
  secretsManagementProvider: string;
  accessControlEnabled: boolean;
  auditLogging: boolean;
}
```

### List of tasks to be completed in order

```yaml
Task 1: "Setup GitHub Actions Workflow Foundation"
CREATE .github/workflows/build.yml:
  - PATTERN: Standard CI workflow with Bun commands
  - INCLUDE: lint, typecheck, test, build steps
  - REFERENCE: Use bun commands from iraqi-deployment package.json
  - TRIGGER: Push to main, pull request events

Task 2: "Implement Security Scanning Workflow"
CREATE .github/workflows/security.yml:
  - INCLUDE: OWASP ZAP DAST scanning, Trivy container scanning
  - INCLUDE: SonarQube SAST analysis, dependency vulnerability checks
  - PATTERN: Fail deployment on critical vulnerabilities
  - REFERENCE: OWASP DevSecOps Guidelines

Task 3: "Create Cultural Validation Workflow" 
CREATE .github/workflows/cultural-validation.yml:
  - INTEGRATE: Iraqi AI agents for cultural compliance validation
  - INCLUDE: Arabic RTL testing, Islamic compliance verification
  - INCLUDE: Professional domain validation checks
  - PATTERN: Must achieve 95%+ compliance score to proceed

Task 4: "Build Docker Multi-Stage Configuration"
CREATE docker/Dockerfile:
  - PATTERN: Multi-stage build (build stage + runtime stage)
  - SECURITY: Non-root user, minimal Alpine base image
  - INCLUDE: Health check endpoint for Iraqi agent validation
  - REFERENCE: Docker best practices 2025 for production hardening

Task 5: "Environment Configuration Management"
CREATE deployment/environments/* files:
  - SEPARATE: Development, staging, production configurations
  - INCLUDE: Iraqi cultural settings, Arabic processing config
  - SECURITY: Use GitHub Secrets for sensitive values
  - PATTERN: Environment-specific validation thresholds

Task 6: "Deployment Orchestration Scripts"
CREATE deployment/scripts/deploy.sh:
  - INTEGRATE: Bun build process and Iraqi validation commands
  - INCLUDE: Pre-deployment health checks and cultural validation
  - INCLUDE: Docker container deployment with environment configs
  - PATTERN: Atomic deployment with automatic rollback on failure

Task 7: "Monitoring and Health Check Integration"
CREATE deployment/monitoring/* configurations:
  - INCLUDE: Prometheus metrics for deployment tracking
  - INCLUDE: Health check endpoints for Arabic processing
  - INCLUDE: Alert configurations for deployment failures
  - PATTERN: Cultural compliance monitoring dashboard

Task 8: "Production Deployment Workflow with Approvals"
CREATE .github/workflows/deploy-production.yml:
  - INCLUDE: Manual approval gates for production deployment
  - INCLUDE: Cultural validation gate with Iraqi AI agents
  - INCLUDE: Security scan gate with vulnerability threshold
  - PATTERN: Blue-green deployment strategy with rollback capability

Task 9: "Emergency Rollback Workflow"
CREATE .github/workflows/rollback.yml:
  - INCLUDE: Automated rollback triggers on health check failures
  - INCLUDE: Cultural compliance preservation during rollback
  - INCLUDE: Notification system for rollback events
  - PATTERN: Fast rollback within 5 minutes maximum

Task 10: "Package.json Integration and Documentation"
MODIFY package.json:
  - ADD: Deployment scripts mirroring iraqi-deployment patterns
  - INCLUDE: Cultural validation, security checks, health monitoring
  - PATTERN: Consistent with existing Bun command structure
  - UPDATE: Dependencies for deployment tooling
```

### Integration Points
```yaml
IRAQI AI AGENTS:
  - integration: "Cultural validator agent in pre-deployment checks"
  - integration: "Security specialist agent for deployment validation"
  - integration: "Technical debugger agent for deployment troubleshooting"
  
GITHUB ACTIONS:
  - secrets: "DOCKER_REGISTRY_TOKEN, SUPABASE_KEY, SENTRY_DSN"
  - environments: "development, staging, production with approval gates"
  - permissions: "Deploy team access, security team review requirements"
  
MONITORING:
  - integration: "Sentry deployment tracking and error monitoring"
  - integration: "Prometheus metrics for deployment performance"
  - integration: "Custom health check endpoints for Iraqi system validation"
  
DATABASE:
  - migration: "Deployment metadata tracking table"
  - migration: "Cultural validation results logging table"
  - index: "Deployment status and environment indexing"
```

## Validation Loop

### Level 1: Syntax & Style
```bash
# Run these FIRST - fix any errors before proceeding
bun run lint                      # ESLint with Iraqi AI project rules
bun run typecheck                # TypeScript validation
docker build -f docker/Dockerfile --target build .  # Docker syntax validation

# Expected: No errors. If errors, READ the error message and fix.
```

### Level 2: Unit Tests
```bash
# Test deployment configuration and scripts
bun test deployment/              # Deployment script unit tests
bun test docker/                  # Docker configuration tests

# Test cultural validation integration
bun run cultural:validate        # Iraqi cultural compliance testing
bun run arabic:test              # Arabic RTL processing validation
bun run professional:validate    # Professional domain validation

# Expected: All tests pass with 95%+ cultural compliance score
```

### Level 3: Integration Testing
```bash
# Test staging deployment end-to-end
bun run deploy:staging
# Wait for deployment completion
curl -f http://staging.aqlix-ai.local/health
# Expected: HTTP 200 with cultural validation status

# Test production deployment process (without actual deploy)
.github/workflows/deploy-production.yml --dry-run
# Expected: All gates pass, approval required

# Test rollback capability
deployment/scripts/rollback.sh --environment=staging --version=previous
# Expected: Rollback completes within 5 minutes
```

### Level 4: Security Validation
```bash
# Run security scans locally
docker run --rm -v $(pwd):/app aquasec/trivy fs /app
# Expected: No critical vulnerabilities

# Test secrets management
deployment/scripts/test-secrets.sh
# Expected: All secrets properly encrypted and accessible

# Validate cultural compliance security
bun run test:cultural --security-mode
# Expected: Cultural data handling meets security requirements
```

## Final Validation Checklist
- [ ] All GitHub Actions workflows execute without errors
- [ ] Docker containers build and deploy successfully to all environments
- [ ] Security scans pass with zero critical vulnerabilities
- [ ] Cultural validation achieves 95%+ Iraqi compliance score
- [ ] Deployment completes within time thresholds (staging <10min, production <15min)
- [ ] Rollback capability tested and works within 5 minutes
- [ ] Health checks return positive status post-deployment
- [ ] All Iraqi AI agents integrate successfully with deployment validation
- [ ] Monitoring and alerting systems capture deployment events
- [ ] Documentation updated with deployment procedures

---

## Anti-Patterns to Avoid
- ❌ Don't skip cultural validation for "faster" deployments
- ❌ Don't deploy without security scan approval
- ❌ Don't use root users in Docker containers
- ❌ Don't hardcode secrets in workflow files
- ❌ Don't deploy without health check validation
- ❌ Don't ignore Iraqi AI agent validation failures
- ❌ Don't skip rollback capability testing
- ❌ Don't deploy to production without manual approval gates
- ❌ Don't ignore Arabic RTL processing validation in containers
- ❌ Don't deploy without monitoring integration