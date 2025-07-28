# Initial to PRP Command Guide - Iraqi AI Chat System

This guide shows which command to use for each initial file when creating and executing PRPs.

## 🤖 PydanticAI Features (Use `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`)

**Total: 9 PydanticAI features**

### Phase 1: Foundation & Setup
- **01_monorepo_setup.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`
  - *Reason: Contains Python FastAPI backend with PydanticAI agents*

- **02_basic_chat.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`
  - *Reason: Core PydanticAI chat agent with Iraqi cultural context*

- **04_streaming_responses.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`
  - *Reason: PydanticAI streaming integration with Iraqi context*

- **06_dev_environment.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`
  - *Reason: Python virtual environment and PydanticAI development setup*

### Phase 2: AI Document Processing
- **08_pdf_processing.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`
  - *Reason: PydanticAI agent for Iraqi document understanding and processing*

- **09_rag_integration.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`
  - *Reason: PydanticAI agents with RAG for Iraqi knowledge base integration*

- **10_iraqi_templates.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`
  - *Reason: PydanticAI agent for generating Iraqi professional documents*

### Phase 3: Cultural & Professional AI
- **15_cultural_framework.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`
  - *Reason: PydanticAI cultural validation agent with Islamic compliance*

- **16_professional_domains.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`
  - *Reason: PydanticAI agents specialized for Iraqi professional domains*

## 🌐 General Features (Use `/generate-prp` + `/execute-prp`)

**Total: 8 general features**

### Phase 1: Foundation & UI
- **03_rtl_arabic.md** → `/generate-prp` + `/execute-prp`
  - *Reason: Frontend CSS and React components for Arabic RTL layout*

- **05_type_safety.md** → `/generate-prp` + `/execute-prp`
  - *Reason: TypeScript types and validation schemas across the system*

### Phase 2: File Handling
- **07_file_upload.md** → `/generate-prp` + `/execute-prp`
  - *Reason: Frontend file upload components with security and Arabic support*

### Phase 3: Voice Features
- **11_voice_recording.md** → `/generate-prp` + `/execute-prp`
  - *Reason: Frontend voice recording components with Arabic speech recognition*

- **12_voice_streaming.md** → `/generate-prp` + `/execute-prp`
  - *Reason: WebSocket voice streaming infrastructure (frontend + backend)*

- **13_arabic_tts.md** → `/generate-prp` + `/execute-prp`
  - *Reason: Arabic text-to-speech integration and audio processing*

- **14_voice_ui.md** → `/generate-prp` + `/execute-prp`
  - *Reason: Frontend voice user interface components with cultural context*

### Phase 4: Infrastructure
- **17_deployment.md** → `/generate-prp` + `/execute-prp`
  - *Reason: Infrastructure deployment and Iraqi payment gateway setup*

## 📋 Usage Examples

```bash
# For PydanticAI features (AI agents)
/generate-pydantic-ai-prp initial/02_basic_chat.md
/execute-pydantic-ai-prp PRPs/02_basic_chat.md

/generate-pydantic-ai-prp initial/15_cultural_framework.md
/execute-pydantic-ai-prp PRPs/15_cultural_framework.md

# For general features (UI, infrastructure)
/generate-prp initial/03_rtl_arabic.md
/execute-prp PRPs/03_rtl_arabic.md

/generate-prp initial/11_voice_recording.md
/execute-prp PRPs/11_voice_recording.md
```

## 🎯 Command Selection Logic

**Use `/generate-pydantic-ai-prp` when the feature involves:**
- PydanticAI agents and AI processing
- Backend Python AI functionality
- Iraqi cultural AI validation and compliance
- AI-powered document understanding and processing
- Professional domain AI expertise and knowledge
- RAG integration and knowledge base access
- Template generation with AI intelligence

**Use `/generate-prp` when the feature involves:**
- Frontend UI components and interfaces
- CSS styling and RTL layout
- File upload/download functionality
- Voice recording and streaming interfaces
- Deployment and infrastructure setup
- TypeScript types and validation schemas
- General system integration (non-AI)

## 📁 Generated Files Location

All generated PRPs will be saved in the `PRPs/` directory:

**PydanticAI PRPs:**
- `PRPs/01_monorepo_setup.md`
- `PRPs/02_basic_chat.md`
- `PRPs/04_streaming_responses.md`
- `PRPs/06_dev_environment.md`
- `PRPs/08_pdf_processing.md`
- `PRPs/09_rag_integration.md`
- `PRPs/10_iraqi_templates.md`
- `PRPs/15_cultural_framework.md`
- `PRPs/16_professional_domains.md`

**General PRPs:**
- `PRPs/03_rtl_arabic.md`
- `PRPs/05_type_safety.md`
- `PRPs/07_file_upload.md`
- `PRPs/11_voice_recording.md`
- `PRPs/12_voice_streaming.md`
- `PRPs/13_arabic_tts.md`
- `PRPs/14_voice_ui.md`
- `PRPs/17_deployment.md`

## ✅ Quick Reference Summary

**All 17 Initial Files Complete:**
- **9 PydanticAI features** → use `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`
- **8 General features** → use `/generate-prp` + `/execute-prp`

Ready for testing and PRP generation!