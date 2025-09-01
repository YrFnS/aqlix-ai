# Initial to PRP Command Guide - Iraqi AI Chat System

This guide shows which command to use for each initial file when creating and executing PRPs. Our new architecture eliminates scope creep with 42 focused initials organized in 7 dependency layers.

## 📋 Architecture Overview

**42 Initials in 7 Layers:**
- **Foundation Layer (01-04)**: Infrastructure setup
- **UI Layer (05-10)**: User interface components  
- **Arabic Layer (11-16)**: Language and RTL support
- **Cultural Layer (17-22)**: Cultural compliance
- **Integration Layer (23-28)**: System integration
- **Production Layer (29-32)**: Production readiness
- **Post-MVP Enhancement Layer (33-41)**: Advanced AI capabilities and SaaS features

## 🌐 General Features (Use `/generate-prp` + `/execute-prp`)

**Total: 35 general infrastructure and UI features (27 MVP + 8 Post-MVP)**

### Foundation Layer (01-04)
- **01_bun_workspace_setup.md** → `/generate-prp` + `/execute-prp` ✅
  - *Reason: Bun monorepo workspace configuration and setup*

- **02_environment_variables.md** → `/generate-prp` + `/execute-prp` ✅
  - *Reason: .env file management and environment configuration*

- **03_typescript_foundation.md** → `/generate-prp` + `/execute-prp` ✅
  - *Reason: TypeScript configuration, tsconfig.json, and path mapping*

- **04_supabase_client_setup.md** → `/generate-prp` + `/execute-prp` ✅
  - *Reason: Supabase client initialization and basic connection*

### UI Layer (05-10)
- **05_nextjs_app_setup.md** → `/generate-prp` + `/execute-prp` ✅
  - *Reason: Next.js 15 application setup with App Router and React 19*

- **06_ui_component_system.md** → `/generate-prp` + `/execute-prp` ✅
  - *Reason: shadcn/ui component system and design tokens*

- **07_basic_routing.md** → `/generate-prp` + `/execute-prp` ✅
  - *Reason: Next.js App Router navigation and routing components*

- **08_responsive_layout.md** → `/generate-prp` + `/execute-prp` ✅
  - *Reason: Tailwind CSS responsive design and mobile-first patterns*

- **09_form_handling.md** → `/generate-prp` + `/execute-prp` ✅
  - *Reason: react-hook-form with Zod validation and form components*

- **10_error_handling.md** → `/generate-prp` + `/execute-prp` ✅
  - *Reason: React Error Boundaries and global error handling*

### Arabic Layer (11-16)
- **11_arabic_font_system.md** → `/generate-prp` + `/execute-prp` ✅
  - *Reason: Google Fonts Arabic integration and typography optimization*

- **12_rtl_layout_foundation.md** → `/generate-prp` + `/execute-prp` ✅
  - *Reason: CSS logical properties and Tailwind RTL layout system*

- **13_arabic_text_processing.md** → `/generate-prp` + `/execute-prp` ✅
  - *Reason: Arabic text normalization and Unicode processing utilities*

- **14_bidirectional_ui.md** → `/generate-prp` + `/execute-prp` ✅
  - *Reason: Direction-aware React components and mixed content handling*

- **15_arabic_input_handling.md** → `/generate-prp` + `/execute-prp` ✅
  - *Reason: Arabic keyboard input, IME support, and composition events*

- **16_language_switching.md** → `/generate-prp` + `/execute-prp` ✅
  - *Reason: Dynamic Arabic-English language toggle and direction switching*

### Cultural Layer (22)
- **22_accessibility_compliance.md** → `/generate-prp` + `/execute-prp` ✅
  - *Reason: WCAG 2.1 AA compliance and Arabic screen reader support*

### Integration Layer (23-28)
- **23_payment_gateway_integration.md** → `/generate-prp` + `/execute-prp` ✅
  - *Reason: ZainCash, FastPay, NassWallet API integration and webhook handling*

- **25_database_schema.md** → `/generate-prp` + `/execute-prp` ✅
  - *Reason: PostgreSQL schema design, relationships, and Supabase configuration*

- **26_authentication_system.md** → `/generate-prp` + `/execute-prp` ✅
  - *Reason: Supabase Auth, JWT tokens, and session management*

- **27_api_endpoints.md** → `/generate-prp` + `/execute-prp` ✅
  - *Reason: FastAPI REST endpoints, Pydantic validation, and response formatting*

- **28_realtime_subscriptions.md** → `/generate-prp` + `/execute-prp` ✅
  - *Reason: Supabase real-time WebSocket subscriptions and live data updates*

### Production Layer (29-32)
- **29_error_monitoring.md** → `/generate-prp` + `/execute-prp` ✅
  - *Reason: Sentry error tracking, performance monitoring, and issue management*

- **30_testing_framework.md** → `/generate-prp` + `/execute-prp` ✅
  - *Reason: Jest/Vitest unit tests, Playwright E2E tests, and cultural testing*

- **31_deployment_pipeline.md** → `/generate-prp` + `/execute-prp` ✅
  - *Reason: GitHub Actions CI/CD, Docker deployment, and environment management*

- **32_production_optimization.md** → `/generate-prp` + `/execute-prp` ✅
  - *Reason: Redis caching, CDN configuration, and performance optimization*

## 🤖 PydanticAI Features (Use `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`)

**Total: 7 AI agent and cultural validation features (6 MVP + 1 Post-MVP)**

### Cultural Layer (17-21)
- **17_cultural_validation.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp` ✅
  - *Reason: Requires PydanticAI agent for Iraqi cultural appropriateness validation with structured output models*

- **18_islamic_compliance.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp` ✅
  - *Reason: Requires PydanticAI agent for Sharia-compliant content checking with model provider integration*

- **19_professional_domains.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp` ✅
  - *Reason: Requires PydanticAI agent for Iraqi legal/medical/educational domain validation with tool integration*

- **20_iraqi_dialect.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp` ✅
  - *Reason: Requires PydanticAI agent for Iraqi Arabic dialect processing with language model capabilities*

- **21_political_neutrality.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp` ✅
  - *Reason: Requires PydanticAI agent for political content detection with bias prevention algorithms*

### Integration Layer (24)
- **24_pydantic_ai_setup.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp` ✅
  - *Reason: Core PydanticAI agent architecture setup with dependency injection and testing patterns*

### Post-MVP Enhancement Layer (34)
- **34_multi_model_providers.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp` ✅
  - *Reason: Requires PydanticAI agents for intelligent AI model routing with cultural context and Arabic-optimized model selection*

## 📋 Usage Examples

```bash
# Foundation Layer
/generate-prp initials/01_bun_workspace_setup.md
/execute-prp PRPs/01_bun_workspace_setup.md

/generate-prp initials/02_environment_variables.md
/execute-prp PRPs/02_environment_variables.md

# UI Layer  
/generate-prp initials/05_nextjs_app_setup.md
/execute-prp PRPs/05_nextjs_app_setup.md

/generate-prp initials/06_ui_component_system.md
/execute-prp PRPs/06_ui_component_system.md

# Arabic Layer
/generate-prp initials/11_arabic_font_system.md
/execute-prp PRPs/11_arabic_font_system.md

/generate-prp initials/12_rtl_layout_foundation.md
/execute-prp PRPs/12_rtl_layout_foundation.md

# Cultural Layer
/generate-prp initials/22_accessibility_compliance.md
/execute-prp PRPs/22_accessibility_compliance.md

# Integration Layer
/generate-prp initials/23_payment_gateway_integration.md
/execute-prp PRPs/23_payment_gateway_integration.md

# PydanticAI features (Cultural AI Agents)
/generate-pydantic-ai-prp initials/17_cultural_validation.md
/execute-pydantic-ai-prp PRPs/17_cultural_validation.md

/generate-pydantic-ai-prp initials/18_islamic_compliance.md
/execute-pydantic-ai-prp PRPs/18_islamic_compliance.md

/generate-pydantic-ai-prp initials/19_professional_domains.md
/execute-pydantic-ai-prp PRPs/19_professional_domains.md

/generate-pydantic-ai-prp initials/20_iraqi_dialect.md
/execute-pydantic-ai-prp PRPs/20_iraqi_dialect.md

/generate-pydantic-ai-prp initials/21_political_neutrality.md
/execute-pydantic-ai-prp PRPs/21_political_neutrality.md

/generate-pydantic-ai-prp initials/24_pydantic_ai_setup.md
/execute-pydantic-ai-prp PRPs/24_pydantic_ai_setup.md

# Production Layer
/generate-prp initials/29_error_monitoring.md
/execute-prp PRPs/29_error_monitoring.md

/generate-prp initials/31_deployment_pipeline.md
/execute-prp PRPs/31_deployment_pipeline.md
```

## 🎯 Command Selection Logic

**Use `/generate-pydantic-ai-prp` when the micro-initial involves:**
- PydanticAI agents and AI processing
- Backend Python AI functionality  
- Iraqi cultural AI validation and compliance
- AI agent architecture and conversation management

**Use `/generate-prp` when the micro-initial involves:**
- Frontend UI components and interfaces
- Infrastructure setup and configuration
- Database schema and API development
- Testing, deployment, and production optimization
- Arabic language processing and cultural systems
- Payment gateway integration and authentication
- All other non-AI system components

## 📁 Generated Files Location

All generated PRPs will be saved in the `PRPs/` directory:

**Foundation Layer PRPs:**
- `PRPs/01_bun_workspace_setup.md`
- `PRPs/02_environment_variables.md`
- `PRPs/03_typescript_foundation.md`
- `PRPs/04_supabase_client_setup.md`

**UI Layer PRPs:**
- `PRPs/05_nextjs_app_setup.md`
- `PRPs/06_ui_component_system.md`
- `PRPs/07_basic_routing.md`
- `PRPs/08_responsive_layout.md`
- `PRPs/09_form_handling.md`
- `PRPs/10_error_handling.md`

**Arabic Layer PRPs:**
- `PRPs/11_arabic_font_system.md`
- `PRPs/12_rtl_layout_foundation.md`
- `PRPs/13_arabic_text_processing.md`
- `PRPs/14_bidirectional_ui.md`
- `PRPs/15_arabic_input_handling.md`
- `PRPs/16_language_switching.md`

**Cultural Layer PRPs:**
- `PRPs/17_cultural_validation.md` *(PydanticAI)*
- `PRPs/18_islamic_compliance.md` *(PydanticAI)*
- `PRPs/19_professional_domains.md` *(PydanticAI)*
- `PRPs/20_iraqi_dialect.md` *(PydanticAI)*
- `PRPs/21_political_neutrality.md` *(PydanticAI)*
- `PRPs/22_accessibility_compliance.md`

**Integration Layer PRPs:**
- `PRPs/23_payment_gateway_integration.md`
- `PRPs/24_pydantic_ai_setup.md` *(PydanticAI)*
- `PRPs/25_database_schema.md`
- `PRPs/26_authentication_system.md`
- `PRPs/27_api_endpoints.md`
- `PRPs/28_realtime_subscriptions.md`

**Production Layer PRPs:**
- `PRPs/29_error_monitoring.md`
- `PRPs/30_testing_framework.md`
- `PRPs/31_deployment_pipeline.md`
- `PRPs/32_production_optimization.md`

## 🆕 Micro-Initials from LibreChat/Botpress Extraction (33-40)

**Based on extraction analysis and security requirements, 8 new initials have been added:**

### Post-MVP Enhancement Layer (33-40) - **Use `/generate-prp` + `/execute-prp`**

- **33_file_generation_pipeline.md** → `/generate-prp` + `/execute-prp` ✅
  - *Source: LibreChat File.js + generation tools*
  - *Purpose: PDF/Word/Excel document generation from chat content with Arabic support and Iraqi cultural templates*

- **34_multi_model_providers.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp` ✅
  - *Source: LibreChat BaseClient.js + OpenAIClient.js*
  - *Purpose: Intelligent AI model routing with Arabic-optimized and culturally-aware model selection using PydanticAI agents*

- **35_browser_automation.md** → `/generate-prp` + `/execute-prp` ✅
  - *Source: Botpress browser integration*
  - *Purpose: Iraqi government website automation and Arabic form filling capabilities*

- **36_plugin_architecture.md** → `/generate-prp` + `/execute-prp` ✅
  - *Source: Botpress knowledge plugin framework*
  - *Purpose: Extensible plugin system for Iraqi professional domain integrations*

- **37_reserved** → *Skipped for future use*

- **38_subscription_management_system.md** → `/generate-prp` + `/execute-prp` ✅
  - *Source: Kortix-SUNA billing system*
  - *Purpose: Multi-tier subscription plans with billing cycles, feature access control, and subscription lifecycle management*

- **39_usage_tracking_rate_limiting.md** → `/generate-prp` + `/execute-prp` ✅
  - *Source: Kortix-SUNA usage tracking + custom rate limiting*
  - *Purpose: Real-time usage monitoring, subscription-based rate limits, and token consumption tracking*

- **40_application_security_system.md** → `/generate-prp` + `/execute-prp` ✅
  - *Source: Security patterns from examples folder (botpress, open-webui, skyvern)*
  - *Purpose: Comprehensive application security framework with vulnerability protection, Iraqi compliance, and threat detection*

- **41_web_search_integration.md** → `/generate-prp` + `/execute-prp`
  - *Source: Kortix-Suna web_search_tool.py + Brave Search integration*
  - *Purpose: Real-time web search with user toggle controls, cultural filtering, and Iraqi context-aware search results*

- **42_railway_deployment_configuration.md** → `/generate-prp` + `/execute-prp`
  - *Source: Railway platform-specific deployment patterns*
  - *Purpose: Railway monorepo deployment configuration with service orchestration and production optimization*

## ✅ Updated Quick Reference Summary

**All 42 Initial Files (33 MVP + 9 Post-MVP):**
- **35 General features** → use `/generate-prp` + `/execute-prp`  
- **7 PydanticAI features** → use `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`

## 🚀 Key Improvements from Old Architecture

**Eliminated Scope Creep:**
- ❌ Old: 21 bloated initials with massive overlaps  
- ✅ New: 32 focused MVP initials with single responsibility
- ✅ Additional: 8 Post-MVP enhancement initials for complete SaaS platform

**Clean Dependency Layers:**
- **Foundation** → **UI** → **Arabic** → **Cultural** → **Integration** → **Production** → **Post-MVP Enhancement**

**Single Responsibility Principle:**
- Each initial has ONE focused purpose
- No overlaps or cross-cutting concerns
- Clear dependency flow and integration points

**Systematic Architecture:**
- Progressive complexity from basic setup to production optimization
- Cultural integration throughout all layers
- Iraqi AI Chat System specific requirements in every component

Ready for systematic PRP generation and implementation using the new micro-initial architecture!