# Initial to PRP Command Guide - Iraqi AI Chat System

This guide shows which command to use for each initial file when creating and executing PRPs.

## 🤖 PydanticAI Features (Use `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`)

### Phase 1: Foundation
- **01_monorepo_setup.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`
  - *Reason: Contains Python FastAPI backend with PydanticAI agents*

- **02_basic_chat.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`
  - *Reason: Core PydanticAI chat agent with Iraqi cultural context*

- **04_streaming_responses.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`
  - *Reason: PydanticAI streaming integration with Iraqi context*

- **06_dev_environment.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`
  - *Reason: Python virtual environment and PydanticAI development setup*

### Phase 2: Document Processing
- **08_pdf_processing.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`
  - *Reason: PydanticAI agent for Iraqi document understanding*

- **09_rag_integration.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`
  - *Reason: PydanticAI agents with RAG for Iraqi knowledge base*

- **10_iraqi_templates.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`
  - *Reason: PydanticAI agent for generating Iraqi documents*

### Phase 4: Cultural & Advanced
- **15_cultural_framework.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`
  - *Reason: PydanticAI cultural validation agent*

- **16_professional_domains.md** → `/generate-pydantic-ai-prp` + `/execute-pydantic-ai-prp`
  - *Reason: PydanticAI agents specialized for Iraqi professionals*

## 🌐 General Features (Use `/generate-prp` + `/execute-prp`)

### Phase 1: Foundation
- **03_rtl_arabic.md** → `/generate-prp` + `/execute-prp`
  - *Reason: Frontend CSS and React components for Arabic RTL*

- **05_type_safety.md** → `/generate-prp` + `/execute-prp`
  - *Reason: TypeScript types and validation schemas*

### Phase 2: Document Processing
- **07_file_upload.md** → `/generate-prp` + `/execute-prp`
  - *Reason: Frontend file upload components and security*

### Phase 3: Voice Features
- **11_voice_recording.md** → `/generate-prp` + `/execute-prp`
  - *Reason: Frontend voice recording components*

- **12_voice_streaming.md** → `/generate-prp` + `/execute-prp`
  - *Reason: WebSocket voice streaming (frontend + backend)*

- **13_arabic_tts.md** → `/generate-prp` + `/execute-prp`
  - *Reason: TTS integration and audio processing*

- **14_voice_ui.md** → `/generate-prp` + `/execute-prp`
  - *Reason: Frontend voice user interface components*

### Phase 4: Cultural & Advanced
- **17_deployment.md** → `/generate-prp` + `/execute-prp`
  - *Reason: Infrastructure deployment and payment gateway setup*

## 📋 Usage Example

```bash
# For PydanticAI features
/generate-pydantic-ai-prp initial/02_basic_chat.md
/execute-pydantic-ai-prp PRPs/02_basic_chat.md

# For general features
/generate-prp initial/03_rtl_arabic.md
/execute-prp PRPs/03_rtl_arabic.md
```

## 🎯 Command Selection Logic

**Use `/generate-pydantic-ai-prp` when:**
- Feature involves PydanticAI agents
- Backend Python AI processing
- Iraqi cultural AI validation
- AI-powered document processing
- Professional domain AI expertise

**Use `/generate-prp` when:**
- Frontend UI components
- CSS and styling
- File upload/download
- Voice recording interfaces
- Deployment and infrastructure
- TypeScript types and validation

## 📁 Generated Files Location

All generated PRPs will be saved in the `PRPs/` directory:
- `PRPs/01_monorepo_setup.md`
- `PRPs/02_basic_chat.md`
- `PRPs/03_rtl_arabic.md`
- etc...