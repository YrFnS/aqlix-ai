---
name: "Iraqi AI Chat System Monorepo Setup PRP"
description: "Comprehensive PRP for setting up production-ready monorepo infrastructure with Bun workspaces, Next.js web app, FastAPI backend with PydanticAI agents, shared TypeScript packages, and Iraqi cultural context support"
---

## Purpose

Implementing a **production-ready monorepo structure** for the Iraqi AI Chat System that supports concurrent development of web and mobile applications, shared business logic, Arabic RTL text handling, and PydanticAI agent integration with proper build optimization and cross-platform compatibility.

## Core Principles

1. **Monorepo Best Practices**: Ultra-fast development with Bun workspaces (30x faster than npm), intelligent dependency hoisting, and optimized build caching
2. **Production Ready**: Include security, testing, monitoring, and deployment for all applications and shared packages
3. **Type Safety First**: Leverage TypeScript across all packages with proper path mapping and shared type definitions
4. **Arabic-First Design**: Built-in RTL support, Arabic font optimization, and Iraqi dialect processing capabilities
5. **PydanticAI Integration**: Follow main_agent_reference patterns for agent creation within FastAPI backend
6. **Cultural Compliance**: NON-NEGOTIABLE Iraqi cultural validation and Islamic principles integration
7. **Cross-Platform Support**: Shared packages designed for web and future React Native mobile development

## ⚠️ Implementation Guidelines: Production-Scale Monorepo

**IMPORTANT**: This is advanced monorepo infrastructure, not a simple multi-package setup.

### What NOT to do:
- ❌ **Don't skip workspace optimization** - Bun's performance gains require proper configuration
- ❌ **Don't ignore build dependencies** - Circular dependencies will break the entire build
- ❌ **Don't hardcode ports or paths** - Development servers must coordinate properly  
- ❌ **Don't skip Arabic testing** - RTL support failures will break production
- ❌ **Don't bypass cultural validation** - All content must pass Iraqi cultural compliance
- ❌ **Don't mix Python/Node environments** - Proper isolation is critical

### What TO do:
- ✅ **Start with workspace foundation** - Get Bun workspaces working before adding applications
- ✅ **Build incrementally** - Apps → Packages → Integration → Optimization
- ✅ **Test continuously** - Validate each layer before proceeding
- ✅ **Follow Iraqi patterns** - Use existing cultural validation and Arabic processing agents
- ✅ **Optimize for development** - Hot reloading and concurrent development are essential

### Key Question:
**"Does this monorepo configuration support efficient Iraqi AI Chat System development across all platforms?"**

---

## Goal

Create a comprehensive development infrastructure that enables:
- **Concurrent Development**: Web, mobile, and backend teams working simultaneously
- **Shared Business Logic**: TypeScript packages used across all applications  
- **Arabic RTL Excellence**: Perfect text rendering and cultural context support
- **PydanticAI Integration**: Agents seamlessly integrated within FastAPI backend
- **Iraqi Cultural Context**: Built-in validation and compliance with Islamic principles
- **Production Readiness**: Monitoring, testing, security, and deployment automation

## Why

Current development is fragmented without shared infrastructure. This monorepo will:
- **Accelerate Development**: Bun's 30x performance improvement and shared packages
- **Ensure Consistency**: Shared types, utilities, and UI components across platforms
- **Support Arabic Excellence**: Centralized RTL support and font optimization
- **Enable Cultural Compliance**: Integrated Iraqi validation and Islamic principles
- **Prepare for Scale**: Mobile app development and microservices expansion

## What

### Architecture Classification
- [x] **Advanced Monorepo**: Multiple applications with shared packages and complex build optimization
- [x] **Cross-Platform Support**: Web (Next.js) and future mobile (React Native) compatibility  
- [x] **Multi-Language Stack**: TypeScript frontend with Python FastAPI backend
- [x] **Cultural Integration**: Iraqi-specific validation and Arabic language processing

### Application Structure
- [x] **Web Application**: Next.js 15+ with Arabic RTL support and Iraqi UI components
- [x] **API Backend**: FastAPI with PydanticAI agents, Supabase integration, MCP server coordination
- [x] **Shared Packages**: UI components, TypeScript types, utilities, Supabase client, Arabic NLP

### Technology Requirements
- [x] **Runtime**: Bun for ultra-fast package management and development
- [x] **Frontend**: Next.js 15+ with React 19, Arabic RTL, responsive design
- [x] **Backend**: Python FastAPI with PydanticAI, async support, proper error handling
- [x] **Database**: Supabase client with TypeScript integration and real-time features
- [x] **Monitoring**: Sentry integration across all applications
- [x] **Development**: Concurrent development, hot reloading, build optimization

### Iraqi Cultural Requirements  
- [x] **Language Support**: Arabic RTL rendering, Iraqi dialect processing, mixed Arabic-English
- [x] **Cultural Validation**: Islamic principles compliance, political neutrality, professional context
- [x] **UI Patterns**: Iraqi-enhanced components with cultural design patterns
- [x] **Agent Integration**: Cultural validation agents, Arabic processing agents

### Success Criteria
- [x] All applications build successfully and run concurrently 
- [x] Shared TypeScript packages work across web and mobile
- [x] Arabic RTL text renders perfectly with proper font optimization
- [x] PydanticAI agents integrate seamlessly with cultural validation
- [x] Build performance meets targets (sub-10 second full rebuild)
- [x] Development workflow supports efficient team collaboration

## All Needed Context

### Monorepo Architecture Research

```yaml
# ESSENTIAL MONOREPO DOCUMENTATION - Must be researched
- url: https://bun.sh/docs/install/workspaces
  why: Ultra-fast monorepo management with Bun workspaces (30x faster than npm)
  content: Workspace configuration, dependency hoisting, parallel builds, performance optimization

- url: https://nextjs.org/docs
  why: Next.js framework with Arabic RTL support and international features
  content: App router, internationalization, font optimization, build configuration

- url: https://fastapi.tiangolo.com/
  why: FastAPI framework for Python backend with async support
  content: Project structure, dependency injection, async patterns, testing strategies

- url: https://ai.pydantic.dev/
  why: PydanticAI framework for agent integration within FastAPI backend
  content: Agent creation, model providers, tools, dependencies, testing with TestModel

- url: https://supabase.com/docs
  why: Supabase integration across TypeScript and Python applications
  content: Client setup, real-time features, authentication, database operations

- url: https://docs.sentry.io/
  why: Error tracking and performance monitoring across monorepo applications
  content: Multi-project setup, source maps, release tracking, performance monitoring

- url: https://www.typescriptlang.org/docs/handbook/project-references.html
  why: TypeScript project references for monorepo package relationships
  content: Build optimization, path mapping, incremental compilation, shared configurations
```

### Existing Codebase Patterns (CRITICAL to follow)

```yaml
# PydanticAI Integration Patterns (follow exactly)
pydantic_ai_reference:
  - path: examples/main_agent_reference/
    why: Perfect PydanticAI patterns with providers, settings, and agent structure
    content: |
      - settings.py: Environment configuration with pydantic-settings
      - providers.py: get_llm_model() function - NEVER hardcode model strings
      - research_agent.py: Complete agent with tools, dependencies, RunContext
      - Default to string output unless structured output specifically required

  - path: examples/main_agent_reference/providers.py
    why: Model provider abstraction that should be used for all agents
    content: get_llm_model() function with environment-based configuration

# Iraqi Cultural Integration (NON-NEGOTIABLE)
iraqi_enhancements:
  - path: examples/dyad-extracted/components/
    why: 44 Iraqi-enhanced UI components with cultural design patterns
    content: Arabic typography, RTL layouts, cultural color schemes, accessibility

  - path: .claude/agents/
    why: 20 specialized Iraqi AI agents for cultural validation and Arabic processing
    content: |
      - iraqi-cultural-validator: 95% cultural appropriateness required
      - arabic-rtl-processor: 99% RTL accuracy, 85% Iraqi dialect recognition
      - iraqi-payment-tester: ZainCash/FastPay/NassWallet integration testing

# Arabic Processing Dependencies  
arabic_dependencies:
  - path: examples/browser-use-extracted/requirements.txt
    why: Python dependencies with Arabic text processing support
    content: arabic-reshaper, python-bidi, langdetect for RTL text handling

# Development Workflow Patterns
shared_configurations:
  - existing: TypeScript configurations with absolute imports (@/, @iraqi-ai/)
  - existing: ESLint/Prettier configurations for code quality
  - required: Bun workspace configuration for dependency management
  - required: Concurrent development scripts for all applications
```

### Technology Integration Gotchas (proactively address)

```yaml
# Critical Monorepo Challenges
workspace_challenges:
  dependency_hoisting:
    issue: "Package version conflicts between TypeScript and Python applications"
    solution: "Bun's superior resolution algorithm + proper workspace boundaries"
    
  build_order:
    issue: "Circular dependencies and build sequence management"
    solution: "Clear dependency graph with packages → apps build order"
    
  port_coordination:
    issue: "Development server conflicts (Next.js 3000, FastAPI 8000)"
    solution: "Orchestrated development scripts with proper port allocation"

# Arabic-Specific Integration  
arabic_challenges:
  font_loading:
    issue: "Arabic font optimization across multiple applications"
    solution: "Centralized font management in shared UI package"
    
  rtl_consistency:
    issue: "RTL layout coordination between web and mobile packages"
    solution: "Shared RTL utilities and consistent design tokens"

# PydanticAI Integration
agent_challenges:
  python_environment:
    issue: "Python virtual environment integration with Bun workspaces"
    solution: "Separate Python environment with proper requirements management"
    
  model_configuration:
    issue: "Model provider setup across different development environments"
    solution: "Environment-based configuration with .env files and validation"
```

## Implementation Blueprint

### Phase 1: Workspace Foundation

```yaml
Task 1 - Root Workspace Setup:
  CREATE monorepo structure:
    - package.json: Bun workspaces configuration with apps/ and packages/
    - .gitignore: Comprehensive ignore patterns for Node.js, Python, and build artifacts  
    - .env.example: Environment variable templates for all applications
    - bun.lockb: Locked dependencies for reproducible builds
    - README.md: Development setup and workflow documentation

Task 2 - Directory Structure:
  ESTABLISH standard structure:
    ```
    aqlix-ai/
    ├── apps/
    │   ├── web/           # Next.js application
    │   └── api/           # FastAPI backend
    ├── packages/
    │   ├── ui/            # Shared UI components
    │   ├── types/         # TypeScript type definitions
    │   ├── utilities/     # Shared utility functions
    │   ├── supabase-client/ # Database client
    │   └── arabic-nlp/    # Arabic text processing
    ├── docs/              # Documentation
    ├── docker/            # Container configurations
    └── .github/           # CI/CD workflows
    ```

Task 3 - Shared Configuration:
  SETUP base configurations:
    - tsconfig.json: Root TypeScript configuration with path mapping
    - eslint.config.js: Shared linting rules across all packages
    - prettier.config.js: Code formatting consistency
    - vitest.workspace.ts: Testing configuration for TypeScript packages
```

### Phase 2: Application Scaffolding

```yaml
Task 4 - Next.js Web Application:
  CREATE apps/web/:
    - Next.js 15+ with App Router and React 19
    - Arabic RTL support with next-intl
    - Tailwind CSS with Arabic font optimization
    - Integration with shared packages (@iraqi-ai/ui, @iraqi-ai/types)
    - Proper path mapping for absolute imports

Task 5 - FastAPI Backend Setup:
  CREATE apps/api/:
    - FastAPI application with proper project structure
    - Python environment with requirements.txt (Arabic dependencies)
    - Basic health check and API documentation endpoints
    - CORS configuration for Next.js integration
    - Environment configuration with pydantic-settings

Task 6 - Shared Package Foundation:
  CREATE packages/types/:
    - Comprehensive TypeScript type definitions
    - Supabase database types
    - API request/response types
    - Shared configuration types
  
  CREATE packages/ui/:
    - Base UI components with Arabic RTL support
    - Design system tokens (colors, typography, spacing)
    - Cultural design patterns integration
    - Storybook setup for component documentation
```

### Phase 3: PydanticAI Agent Integration

```yaml
Task 7 - Agent Architecture (follow main_agent_reference exactly):
  IMPLEMENT apps/api/agents/:
    - settings.py: Environment-based configuration with pydantic-settings
    - providers.py: get_llm_model() function with model provider abstraction
    - dependencies.py: Shared dependencies for Supabase, HTTP clients
    - base_agent.py: Base agent class with common patterns

Task 8 - Cultural Validation Agents:
  INTEGRATE Iraqi AI agent patterns:
    - cultural_agent.py: Iraqi cultural validation with 95% accuracy requirement
    - arabic_agent.py: RTL text processing with 99% accuracy
    - payment_agent.py: Iraqi payment gateway integration (ZainCash, FastPay, NassWallet)
    - Use Task tool delegation to Iraqi specialized agents

Task 9 - Agent Testing Framework:
  SETUP comprehensive testing:
    - TestModel integration for development validation
    - FunctionModel for custom behavior testing  
    - Agent.override() patterns for test isolation
    - Cultural validation test suites
    - Mock external services (Supabase, payment gateways)
```

### Phase 4: Advanced Integration

```yaml
Task 10 - Supabase Integration:
  CREATE packages/supabase-client/:
    - TypeScript client with proper type generation
    - Real-time subscription utilities
    - Authentication helpers
    - Database query utilities with cultural context
    - Python client integration for FastAPI backend

Task 11 - MCP Server Coordination:
  INTEGRATE MCP servers:
    - Sequential server for complex analysis workflows
    - Context7 server for documentation and patterns
    - Playwright server for E2E testing across applications
    - @21st-dev/magic for UI component generation

Task 12 - Arabic Language Processing:
  CREATE packages/arabic-nlp/:
    - RTL text processing utilities
    - Iraqi dialect recognition
    - Mixed Arabic-English content handling
    - Font optimization and loading
    - Cultural context extraction
```

### Phase 5: Development Workflow Optimization

```yaml
Task 13 - Concurrent Development:
  SETUP development scripts:
    - "bun run dev": Parallel development servers for all apps
    - "bun run build": Optimized build pipeline with dependency resolution
    - "bun run test": Comprehensive testing across all packages
    - "bun run lint": Code quality validation
    - "bun run typecheck": TypeScript validation across monorepo

Task 14 - Build Optimization:
  IMPLEMENT performance optimization:
    - Bun's native caching for dependencies
    - Incremental TypeScript builds with project references
    - Shared build outputs and intelligent cache invalidation
    - Parallel builds where dependencies allow
    - Production build optimization with code splitting

Task 15 - Monitoring Integration:
  SETUP Sentry monitoring:
    - Multi-project Sentry configuration
    - Source map uploads for error tracking
    - Performance monitoring across Next.js and FastAPI
    - Cultural validation error tracking
    - Release and deployment tracking
```

## Validation Loop

### Level 1: Workspace Integrity Validation

```bash
# Verify complete monorepo structure exists
find . -name "package.json" | grep -E "(apps/web|apps/api|packages/ui|packages/types)" | wc -l | grep -q "4"
test -f bun.lockb && echo "✓ Bun lockfile present"

# Test workspace dependency resolution  
bun install && bun workspaces list | grep -q "4 workspaces"
bun run --filter="packages/*" build

# Verify TypeScript path mapping works
cd apps/web && bun run typecheck
cd apps/api && python -m mypy . --ignore-missing-imports

# Expected: All packages found, dependencies resolved, builds successful, types validate
# If failing: Fix workspace configuration, resolve dependency conflicts, update tsconfig paths
```

### Level 2: Application Integration Validation

```bash
# Test Next.js application with Arabic support
cd apps/web && bun run build
test -d ".next" && echo "✓ Next.js build successful"
grep -q "direction.*rtl" "tailwind.config.js" && echo "✓ RTL support configured"

# Test FastAPI backend with PydanticAI agents  
cd apps/api && python -m pytest tests/ -v --tb=short
curl -f http://localhost:8000/health && echo "✓ FastAPI health check passed"

# Test shared package imports across applications
bun run test:shared-imports

# Expected: Both applications build and run, shared packages import correctly, health checks pass
# If failing: Fix import paths, resolve package dependencies, update build configurations
```

### Level 3: Cultural & Arabic Validation

```bash
# Test Arabic RTL text rendering and font loading
cd packages/ui && bun run test:rtl
bun run test:arabic-fonts

# Validate Iraqi cultural compliance with specialized agents
python -c "
from apps.api.agents.cultural_agent import validate_cultural_content
from apps.api.agents.arabic_agent import process_arabic_text
assert validate_cultural_content('test content') >= 0.95
assert process_arabic_text('مرحبا بكم') is not None
print('✓ Cultural and Arabic validation passed')
"

# Test payment gateway integration with Iraqi providers
cd apps/api && python -m pytest tests/test_payment_agents.py::test_zaincash_integration -v

# Expected: RTL rendering works, fonts load correctly, cultural validation ≥95%, Arabic processing ≥99%
# If failing: Fix Arabic text processing, update cultural validation, resolve font loading issues
```

### Level 4: Production Readiness Validation

```bash
# Build performance and optimization validation
time bun run build:all
test $? -eq 0 && echo "✓ Production build successful"

# Security validation across all applications
bun audit && echo "✓ No security vulnerabilities in dependencies"  
cd apps/api && pip-audit && echo "✓ Python dependencies secure"

# Test development workflow efficiency
time bun run dev:all &
sleep 10 && curl -f http://localhost:3000 && curl -f http://localhost:8000/health
pkill -f "bun run dev:all"

# Monitor integration validation
grep -q "SENTRY_DSN" ".env.example" && echo "✓ Sentry integration configured"

# Expected: Build <10s, no security issues, concurrent development works, monitoring configured
# If failing: Optimize build pipeline, resolve security issues, fix development server coordination
```

## Final Validation Checklist

### Monorepo Infrastructure Completeness

- [x] **Complete workspace structure**: apps/, packages/, docs/, proper bun.lockb management
- [x] **All applications functional**: Next.js web app, FastAPI backend build and run successfully  
- [x] **Shared packages integrated**: UI, types, utilities work across all applications
- [x] **TypeScript path mapping**: Absolute imports (@/, @iraqi-ai/) resolve correctly
- [x] **Build optimization**: Incremental builds, caching, dependency resolution under 10 seconds
- [x] **Development workflow**: Concurrent development, hot reloading, testing pipeline functional

### Iraqi AI System Integration

- [x] **PydanticAI agent architecture**: Following main_agent_reference patterns with get_llm_model()
- [x] **Cultural validation integration**: Iraqi specialized agents accessible via Task tool
- [x] **Arabic RTL excellence**: Perfect text rendering, font optimization, mixed content handling
- [x] **Payment gateway support**: ZainCash, FastPay, NassWallet integration testing
- [x] **Supabase integration**: Client libraries working across TypeScript and Python
- [x] **MCP server coordination**: Sequential, Context7, Playwright, Magic servers integrated

### Production Readiness

- [x] **Security measures**: Environment variables, dependency auditing, no hardcoded secrets
- [x] **Monitoring integration**: Sentry setup across all applications with source maps
- [x] **Testing comprehensive**: Unit tests, integration tests, cultural validation tests
- [x] **Build optimization**: Production builds optimized, code splitting, performance monitoring
- [x] **Documentation complete**: Setup instructions, development workflow, deployment guides
- [x] **Iraqi compliance**: Cultural validation ≥95%, Arabic processing ≥99%, Islamic principles respected

---

## Anti-Patterns to Avoid

### Monorepo Development

- ❌ Don't skip Bun workspace configuration - npm/yarn patterns won't work optimally
- ❌ Don't ignore build dependencies - circular dependencies will break production builds
- ❌ Don't hardcode ports or paths - development server coordination is critical
- ❌ Don't mix package managers - stick to Bun throughout the entire workspace
- ❌ Don't bypass shared packages - direct imports between apps break the architecture

### PydanticAI Integration  

- ❌ Don't hardcode model strings - always use get_llm_model() from providers.py
- ❌ Don't skip TestModel validation - development validation is essential
- ❌ Don't ignore dependency injection - use proper RunContext patterns
- ❌ Don't create complex tool chains - keep tools focused and testable
- ❌ Don't bypass cultural validation - all content must use Iraqi specialized agents

### Arabic & Cultural Integration

- ❌ Don't ignore RTL testing - Arabic text rendering must be validated continuously
- ❌ Don't skip cultural compliance - 95% cultural appropriateness is NON-NEGOTIABLE
- ❌ Don't hardcode English assumptions - design for Arabic-first user experience
- ❌ Don't bypass Iraqi agent validation - direct cultural validation will miss cultural nuances

### Production Deployment

- ❌ Don't expose sensitive configuration - environment variables for all secrets
- ❌ Don't skip security auditing - dependency vulnerabilities must be monitored
- ❌ Don't ignore monitoring setup - Sentry integration is essential for production
- ❌ Don't deploy without performance validation - build times and runtime performance must meet targets

**RESEARCH STATUS: COMPLETED** - Comprehensive research completed covering Bun workspaces, Next.js Arabic support, FastAPI integration, PydanticAI patterns, Iraqi cultural requirements, and monorepo best practices.

**PRP CONFIDENCE LEVEL: 8/10** - High confidence for one-pass implementation success due to comprehensive context, existing patterns, executable validation gates, and detailed Iraqi cultural integration requirements. Medium complexity due to multi-technology integration and cultural compliance requirements.