# Initial to PRP Command Guide - Iraqi AI Chat System

This guide shows which command to use for each initial file when creating and executing PRPs. Our architecture includes 61 focused initials organized in strategic phases, with MVP scope covering initials 1-47 for faster time to market.

## 📋 Architecture Overview

**61 Initials in Strategic Phases (Post-Consolidation):**

- **MVP Phase (01-47)**: Core system with complete web app, cultural compliance, and basic image processing
- **Post-MVP Phase (48-56)**: Advanced image processing, voice/audio system, and desktop application
- **Legacy MVP Components (60-69)**: Development infrastructure (error monitoring, testing, deployment)

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
- Complete voice/audio system (49, 51)
- User intelligence and personalization (53)
- Website automation and form filling (56)
- **Target**: 6-8 months additional development

**Legacy MVP Components (60-69)**: Development infrastructure

- Error monitoring, testing, deployment, optimization
- File generation, multi-model providers, browser automation
- Plugin architecture, workflow orchestration, subscription management

---

## 🌐 General Features (Use `/generate-prp` + `/execute-prp`)

### Foundation Layer (01-04)

- **01_bun_workspace_setup.md** → `/generate-prp` + `/execute-prp` ✅
  - _Reason: Bun monorepo workspace configuration and setup_

- **02_environment_variables.md** → `/generate-prp` + `/execute-prp` ✅
  - _Reason: .env file management and environment configuration_

- **03_typescript_foundation.md** → `/generate-prp` + `/execute-prp` ✅
  - _Reason: TypeScript configuration, tsconfig.json, and path mapping_

- **04_supabase_client_setup.md** → `/generate-prp` + `/execute-prp` ✅
  - _Reason: Supabase client initialization and basic connection_

### UI Layer (05-10)

- **05_nextjs_app_setup.md** → `/generate-prp` + `/execute-prp` ✅
  - _Reason: Next.js 15 application setup with App Router and React 19_

- **06_ui_component_system.md** → `/generate-prp` + `/execute-prp`
  - _Reason: shadcn/ui component system and design tokens_

- **07_basic_routing.md** → `/generate-prp` + `/execute-prp`
  - _Reason: Next.js App Router navigation and routing components_

- **08_responsive_layout.md** → `/generate-prp` + `/execute-prp`
  - _Reason: Tailwind CSS responsive design and mobile-first patterns_

- **09_form_handling.md** → `/generate-prp` + `/execute-prp`
  - _Reason: react-hook-form with Zod validation and form components_

- **10_error_handling.md** → `/generate-prp` + `/execute-prp`
  - _Reason: React Error Boundaries and global error handling_

### Arabic Layer (11-16)

- **11_arabic_font_system.md** → `/generate-prp` + `/execute-prp`
  - _Reason: Google Fonts Arabic integration and typography optimization_

- **12_rtl_layout_foundation.md** → `/generate-prp` + `/execute-prp`
  - _Reason: CSS logical properties and Tailwind RTL layout system_

- **13_arabic_text_processing.md** → `/generate-prp` + `/execute-prp`
  - _Reason: Arabic text normalization and Unicode processing utilities_

- **14_bidirectional_ui.md** → `/generate-prp` + `/execute-prp`
  - _Reason: Direction-aware React components and mixed content handling_

- **15_arabic_input_handling.md** → `/generate-prp` + `/execute-prp`
  - _Reason: Arabic keyboard input, IME support, and composition events_

- **16_language_switching.md** → `/generate-prp` + `/execute-prp`
  - _Reason: Dynamic Arabic-English language toggle and direction switching_

### Cultural Compliance Layer (17, 19-22)

- **17_cultural_islamic_compliance_system.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`
  - _Reason: Requires PydanticAI agent for Iraqi cultural appropriateness and Islamic compliance validation_

- **19_professional_domain_integration_system.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`
  - _Reason: Requires PydanticAI agent for Iraqi legal/medical/educational domain validation_

- **20_iraqi_dialect.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`
  - _Reason: Requires PydanticAI agent for Iraqi Arabic dialect processing_

- **21_political_neutrality.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`
  - _Reason: Requires PydanticAI agent for political content detection_

- **22_accessibility_compliance.md** → `/generate-prp` + `/execute-prp`
  - _Reason: WCAG 2.1 AA compliance and Arabic screen reader support_

### Integration Layer (23-28)

- **23_payment_gateway_integration.md** → `/generate-prp` + `/execute-prp`
  - _Reason: ZainCash, FastPay, NassWallet API integration and webhook handling_

- **24_pydantic_ai_setup.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`
  - _Reason: Core PydanticAI agent architecture setup with dependency injection_

- **25_iraqi_ai_database_schema.md** → `/generate-prp` + `/execute-prp`
  - _Reason: Iraqi AI-specific PostgreSQL schema with cultural context and agent data_

- **26_authentication_system.md** → `/generate-prp` + `/execute-prp`
  - _Reason: Supabase Auth, JWT tokens, and session management_

- **27_iraqi_chat_api_endpoints.md** → `/generate-prp` + `/execute-prp`
  - _Reason: Iraqi chat-specific FastAPI endpoints with Arabic/cultural support_

### Iraqi AI Agent Coordination Layer (29-38) - **Split Components**

_Note: These are the focused components created from splitting the original massive coordination files_

- **29_context_management_foundation.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`
  - _Reason: Shared context services and validation foundation for Iraqi AI agents_

- **30_realtime_websocket_management.md** → `/generate-prp` + `/execute-prp`
  - _Reason: WebSocket connection lifecycle and subscription management_

- **31_cross_session_context_persistence.md** → `/generate-prp` + `/execute-prp`
  - _Reason: Context storage, compression, and recovery mechanisms_

- **32_multi_device_synchronization.md** → `/generate-prp` + `/execute-prp`
  - _Reason: Cross-device context synchronization and conflict resolution_

- **33_cultural_state_management.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`
  - _Reason: Iraqi cultural state validation and Islamic compliance tracking_

- **34_agent_orchestration_engine.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`
  - _Reason: Workflow coordination and dynamic agent selection for Iraqi AI agents_

- **35_context_sharing_optimization.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`
  - _Reason: 35% performance gains through intelligent context compression and caching_

- **36_cultural_compliance_coordination.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`
  - _Reason: 100% Islamic compliance and 95%+ cultural appropriateness coordination_

- **37_agent_load_balancing_performance.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`
  - _Reason: Performance optimization across 21 specialized Iraqi AI agents_

- **38_agent_registry_specialization.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`
  - _Reason: Centralized agent registry and specialization management_

### System Components Layer (39-47)

- **39_usage_tracking_rate_limiting.md** → `/generate-prp` + `/execute-prp`
  - _Reason: Real-time usage monitoring, cultural timing-aware rate limits, and cost tracking_

- **40_application_security_system.md** → `/generate-prp` + `/execute-prp`
  - _Reason: Comprehensive security framework with Iraqi compliance and threat detection_

- **41_web_search_integration.md** → `/generate-prp` + `/execute-prp`
  - _Reason: Real-time web search with cultural filtering and Iraqi context-aware results_

- **42_flyio_istanbul_deployment_configuration.md** → `/generate-prp` + `/execute-prp`
  - _Reason: Fly.io deployment configuration with Istanbul region optimization_

- **44_performance_monitoring.md** → `/generate-prp` + `/execute-prp`
  - _Reason: Enterprise-grade performance monitoring with cultural validation tracking_

- **45_basic_image_upload_display.md** → `/generate-prp` + `/execute-prp`
  - _Reason: Image upload, display, and basic processing with Arabic metadata_

- **46_arabic_ocr_text_extraction.md** → `/generate-prp` + `/execute-prp`
  - _Reason: Arabic OCR and text extraction from images and documents_

- **47_image_generation_ai_art.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`
  - _Reason: AI-powered image generation with cultural and Islamic compliance_

---

## 🚀 Post-MVP Features (Use `/generate-prp` + `/execute-prp`)

### Advanced Features Layer (48-56)

- **48_image_editing_processing.md** → `/generate-prp` + `/execute-prp`
  - _Reason: Advanced image editing tools and processing algorithms_

- **49_speech_processing_system_stt_tts.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`
  - _Reason: Iraqi Arabic speech recognition and text-to-speech with dialect support_

- **51_voice_interaction_recording_system.md** → `/generate-prp` + `/execute-prp`
  - _Reason: Voice command processing and audio recording with Arabic support_

- **53_user_intelligence_personalization_system.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`
  - _Reason: AI-powered user personalization with Iraqi cultural preferences_

- **56_website_automation_form_filling_system.md** → `/generate-prp` + `/execute-prp`
  - _Reason: Iraqi government website automation and Arabic form filling_

---

## 🛠️ Legacy MVP Components (Use `/generate-prp` + `/execute-prp`)

### Development Infrastructure Layer (60-69)

_Note: These were renumbered to avoid conflicts with Iraqi AI coordination components_

- **60_error_monitoring.md** → `/generate-prp` + `/execute-prp`
  - _Reason: Sentry error tracking, performance monitoring, and issue management_

- **61_testing_framework.md** → `/generate-prp` + `/execute-prp`
  - _Reason: Jest/Vitest unit tests, Playwright E2E tests, and cultural testing_

- **62_deployment_pipeline.md** → `/generate-prp` + `/execute-prp`
  - _Reason: GitHub Actions CI/CD, Docker deployment, and environment management_

- **63_production_optimization.md** → `/generate-prp` + `/execute-prp`
  - _Reason: Redis caching, CDN configuration, and performance optimization_

- **64_file_generation_pipeline.md** → `/generate-prp` + `/execute-prp`
  - _Reason: PDF/Word/Excel document generation with Arabic support_

- **65_multi_model_providers.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`
  - _Reason: Intelligent AI model routing with Arabic-optimized model selection_

- **66_browser_automation.md** → `/generate-prp` + `/execute-prp`
  - _Reason: Iraqi government website automation and form filling capabilities_

- **67_plugin_architecture.md** → `/generate-prp` + `/execute-prp`
  - _Reason: Extensible plugin system for Iraqi professional domain integrations_

- **68_workflow_orchestration.md** → `/generate-prp` + `/execute-prp`
  - _Reason: Visual workflow builder with Iraqi cultural validation blocks_

- **69_subscription_management_system.md** → `/generate-prp` + `/execute-prp`
  - _Reason: Multi-tier subscription plans with billing cycles and feature access control_

---

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

# Arabic Layer
/generate-prp initials/11_arabic_font_system.md
/execute-prp PRPs/11_arabic_font_system.md

# Cultural Compliance (PydanticAI)
/generate-pydantic-ai-prp initials/17_cultural_islamic_compliance_system.md
/execute-pydantic-ai-prp PRPs/17_cultural_islamic_compliance_system.md

/generate-pydantic-ai-prp initials/20_iraqi_dialect.md
/execute-pydantic-ai-prp PRPs/20_iraqi_dialect.md

# Iraqi AI Agent Coordination (PydanticAI)
/generate-pydantic-ai-prp initials/29_context_management_foundation.md
/execute-pydantic-ai-prp PRPs/29_context_management_foundation.md

/generate-pydantic-ai-prp initials/34_agent_orchestration_engine.md
/execute-pydantic-ai-prp PRPs/34_agent_orchestration_engine.md

/generate-pydantic-ai-prp initials/36_cultural_compliance_coordination.md
/execute-pydantic-ai-prp PRPs/36_cultural_compliance_coordination.md

# System Components
/generate-prp initials/39_usage_tracking_rate_limiting.md
/execute-prp PRPs/39_usage_tracking_rate_limiting.md

/generate-prp initials/40_application_security_system.md
/execute-prp PRPs/40_application_security_system.md

# Post-MVP Features
/generate-pydantic-ai-prp initials/49_speech_processing_system_stt_tts.md
/execute-pydantic-ai-prp PRPs/49_speech_processing_system_stt_tts.md

/generate-pydantic-ai-prp initials/53_user_intelligence_personalization_system.md
/execute-pydantic-ai-prp PRPs/53_user_intelligence_personalization_system.md

# Legacy Infrastructure
/generate-prp initials/60_error_monitoring.md
/execute-prp PRPs/60_error_monitoring.md

/generate-pydantic-ai-prp initials/65_multi_model_providers.md
/execute-pydantic-ai-prp PRPs/65_multi_model_providers.md
```

---

## 🎯 Command Selection Logic

**Use `/generate-pydantic-ai-prp` when the initial involves:**

- PydanticAI agents and AI processing
- Backend Python AI functionality
- Iraqi cultural AI validation and compliance
- AI agent architecture and conversation management
- Iraqi AI agent coordination and orchestration
- Context management and optimization for AI agents
- Cultural state management and Islamic compliance
- Agent registry and specialization management
- Speech processing with AI dialect recognition
- User intelligence and AI personalization

**Use `/generate-prp` when the initial involves:**

- Frontend UI components and interfaces
- Infrastructure setup and configuration
- Database schema and API development
- Testing, deployment, and production optimization
- Arabic language processing and cultural systems
- Payment gateway integration and authentication
- WebSocket management and real-time features
- Security systems and monitoring
- Image processing and file handling
- All other non-AI system components

---

## 📊 Updated File Organization Summary

**Total: 61 Initials (Post-Consolidation)**

### **MVP Phase (47 initials):**

- **31 General features** → use `/generate-prp` + `/execute-prp`
- **16 PydanticAI features** → use `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`

### **Post-MVP Phase (5 initials):**

- **3 General features** → use `/generate-prp` + `/execute-prp`
- **2 PydanticAI features** → use `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`

### **Legacy Infrastructure (10 initials):**

- **9 General features** → use `/generate-prp` + `/execute-prp`
- **1 PydanticAI feature** → use `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`

---

## 🏆 Key Consolidation Benefits

**Perfect Organization:**

- **Zero overlaps** - Every file has single responsibility
- **Clear boundaries** - Well-defined scope and integration points
- **Focused components** - No more 500+ line overlapping files
- **Strategic numbering** - Logical file organization by functionality

**Iraqi AI Agent Architecture:**

- **29-38**: Dedicated range for Iraqi AI agent coordination components
- **Split architecture** - 5 focused components from original massive coordination file
- **Cultural integration** - Islamic compliance and Iraqi cultural validation throughout
- **Performance optimization** - 35% gains through intelligent context management

**Development Efficiency:**

- **Clear PRP mapping** - Know exactly which command to use for each feature
- **Dependency clarity** - Clean separation between general and AI-specific features
- **Strategic phasing** - MVP vs Post-MVP clearly defined
- **Infrastructure separation** - Development tools in dedicated 60+ range

Ready for systematic PRP generation with perfect architectural organization! 🎯
