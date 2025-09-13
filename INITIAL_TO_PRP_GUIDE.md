# Initial to PRP Command Guide - Iraqi AI Chat System

This guide shows which command to use for each initial file when creating and executing PRPs. Our architecture includes 56 focused initials organized in strategic phases, with MVP scope covering initials 1-47 for faster time to market.

## 📋 Architecture Overview

**56 Initials in Strategic Phases:**
- **MVP Phase (01-47)**: Core system with complete web app, cultural compliance, and basic image processing
- **Post-MVP Phase (48-56)**: Advanced image processing, voice/audio system, and desktop application

## 🎯 MVP vs Post-MVP Strategy

**MVP Scope (Initials 1-47)**: Complete web application ready for Iraqi market launch
- Foundation, UI, Arabic, Cultural compliance systems
- Payment integration (ZainCash, FastPay, NassWallet)
- Core AI agents and cultural validation
- Basic image processing with Arabic OCR
- Production deployment and monitoring
- **Target**: 3-4 months to market

**Post-MVP Scope (Initials 48-56)**: Advanced features after market validation  
- Advanced image editing and AI art generation (48)
- Complete voice/audio system (49-52)
- Desktop application with offline capabilities (53-56)
- **Target**: 6-8 months additional development

## 🌐 General Features (Use `/generate-prp` + `/execute-prp`)

**MVP Phase (40 general infrastructure and UI features)**

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

- **37_workflow_orchestration.md** → `/generate-prp` + `/execute-prp` ✅
  - *Source: sim-studio-extracted visual workflow components + Iraqi cultural workflow patterns*
  - *Purpose: Visual drag-and-drop workflow builder with Iraqi cultural validation blocks, Arabic RTL support, and intelligent workflow orchestration*

- **38_subscription_management_system.md** → `/generate-prp` + `/execute-prp` ✅
  - *Source: Kortix-SUNA billing system*
  - *Purpose: Multi-tier subscription plans with billing cycles, feature access control, and subscription lifecycle management*

- **39_usage_tracking_rate_limiting.md** → `/generate-prp` + `/execute-prp` ✅
  - *Source: Kortix-SUNA usage tracking + custom rate limiting*
  - *Purpose: Real-time usage monitoring, subscription-based rate limits, and token consumption tracking*

- **40_application_security_system.md** → `/generate-prp` + `/execute-prp` ✅
  - *Source: Security patterns from examples folder (botpress, open-webui, skyvern)*
  - *Purpose: Comprehensive application security framework with vulnerability protection, Iraqi compliance, and threat detection*

- **41_web_search_integration.md** → `/generate-prp` + `/execute-prp` ✅
  - *Source: Kortix-Suna web_search_tool.py + Brave Search integration*
  - *Purpose: Real-time web search with user toggle controls, cultural filtering, and Iraqi context-aware search results*

- **42_Fly.io_deployment_configuration.md** → `/generate-prp` + `/execute-prp` ✅
  - *Source: Fly.io platform-specific deployment patterns*
  - *Purpose: Fly.io monorepo deployment configuration with service orchestration and production optimization*

- **43_multi_agent_coordination.md** → `/generate-prp` + `/execute-prp` ✅
  - *Source: Advanced multi-agent orchestration patterns + Iraqi AI agent coordination*
  - *Purpose: Intelligent coordination system for 21 specialized Iraqi AI agents with 35% performance improvement through context optimization*

- **44_performance_monitoring.md** → `/generate-prp` + `/execute-prp` ✅
  - *Source: Enterprise monitoring patterns + Iraqi cultural performance metrics*
  - *Purpose: Enterprise-grade performance monitoring for millions of users with real-time agent analytics and cultural validation tracking*

## ✅ Updated Quick Reference Summary

**All 56 Initial Files:**
**MVP Phase (47 initials):**
- **40 General features** → use `/generate-prp` + `/execute-prp`  
- **7 PydanticAI features** → use `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`

**Post-MVP Phase (9 initials):**
- **9 Advanced features** → use `/generate-prp` + `/execute-prp`

## 🎯 MVP Priority Strategy

**MVP Phase Benefits:**
- **Faster Time to Market**: 3-4 months vs 6-8 months for full system
- **Revenue Generation**: Payment integration with ZainCash, FastPay, NassWallet
- **User Validation**: Test core value proposition with Iraqi users
- **Market Fit Validation**: Prove demand before investing in advanced features

**Post-MVP Value Addition:**
- **Advanced Image Processing**: Complex editing and AI art generation
- **Voice/Audio System**: Complete speech recognition and synthesis
- **Desktop Application**: Offline capabilities and native OS integration
- **Enterprise Features**: Advanced security and desktop deployment

**Strategic Development Flow:**
- **Phase 1 (MVP)**: Core web application with essential Iraqi features
- **Phase 2 (Post-MVP)**: Advanced capabilities based on user feedback and market demand

## 🚀 Key Architecture Benefits

**Strategic Phasing:**
- ✅ MVP-focused: 47 initials for complete web application
- ✅ Post-MVP enhancement: 9 initials for advanced desktop/voice features
- ✅ Clear separation: Core features vs nice-to-have enhancements

**Clean Dependency Management:**
- **Foundation** → **UI** → **Arabic** → **Cultural** → **Integration** → **Production** → **MVP Enhancement**
- **Post-MVP**: Advanced Image, Voice/Audio, Desktop systems

**Market-Driven Development:**
- MVP provides immediate value to Iraqi users
- Post-MVP features developed based on user feedback
- Revenue-generating features prioritized in MVP phase

Ready for systematic PRP generation with strategic MVP-first approach!