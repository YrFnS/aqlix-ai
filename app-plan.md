# Iraqi AI Chat System - Development Plan

## 🏗️ Technical Architecture Overview

### 📊 **Research-Based Stack Decisions (July 19, 2025)**

**Key Research Findings:**
- **Next.js 15.1+**: 90% faster builds with Turbopack, streaming server components for AI chat
- **PydanticAI + LangGraph**: Superior performance (50× more concurrent agents vs LangChain alone)
- **SSE over WebSockets**: Better for AI streaming, built-in Next.js 15 support, automatic reconnection
- **Zustand + TanStack Query**: 90% of Redux power at fraction of complexity, perfect for chat apps
- **Iraqi Payment Gateways**: ZainCash (leading), FastPay (emerging), NassWallet (compliant) confirmed with APIs

### Technology Stack Decision Matrix (Updated July 2025)

#### Frontend Stack
```
Web Application: Next.js 15.1+ + TypeScript + React 19
├── UI Framework: Tailwind CSS v4 + shadcn/ui
├── State Management: Zustand (client) + TanStack Query (server state)
├── Real-time: Server-Sent Events (Next.js 15 streaming) + WebSockets (fallback)
├── Forms: React Hook Form + Zod validation
├── File Upload: react-dropzone + progress tracking
├── Arabic Support: react-rtl-support, arabic-reshaper
└── Voice: Web Audio API + OpenAI Whisper/TTS integration
```

#### Backend Stack
```
Primary API: Python FastAPI + Node.js Express (real-time)
├── AI Framework: PydanticAI (primary) + LangGraph (orchestration)
├── AI Models: OpenAI GPT-4o + Jais API (Arabic)
├── Document Processing: LangChain + PyMuPDF + pytesseract
├── Database: PostgreSQL + Redis (caching)
├── Vector DB: Supabase Vector (integrated) + Pinecone (cloud)
├── Authentication: Supabase Auth
├── File Storage: Supabase Storage
└── Queue System: Celery + Redis (document processing)
```

#### Shared Architecture (Web + Future Mobile)
```
Monorepo Structure:
packages/
├── shared/
│   ├── api/          # API clients, types, schemas
│   ├── utils/        # Shared utility functions
│   ├── constants/    # App constants, config
│   ├── types/        # TypeScript definitions
│   └── validation/   # Zod schemas for data validation
├── web/              # Next.js application
├── api/              # FastAPI backend
├── mobile/           # React Native (Phase 2)
└── docs/             # Documentation and PRPs
```

### Database Schema Design

#### Core Tables
```sql
-- Users and Authentication
users (id, email, phone, password_hash, created_at, updated_at)
user_profiles (user_id, name, job_title, profession, preferences, subscription_tier)
user_sessions (id, user_id, token, expires_at, created_at)

-- Chat System
conversations (id, user_id, title, created_at, updated_at)
messages (id, conversation_id, role, content, voice_url, created_at)
message_metadata (message_id, tokens_used, model_used, processing_time)

-- Document Management
user_documents (id, user_id, filename, file_type, file_size, s3_key, uploaded_at)
document_content (document_id, extracted_text, ocr_text, metadata, processed_at)
document_embeddings (id, document_id, chunk_text, embedding_vector, chunk_index)

-- Professional Knowledge Base
knowledge_domains (id, domain_name, description)
knowledge_articles (id, domain_id, title, content, source, language, created_at)
article_embeddings (id, article_id, chunk_text, embedding_vector)

-- Billing and Usage
subscriptions (id, user_id, plan_type, status, current_period_start, current_period_end)
usage_tracking (id, user_id, action_type, tokens_used, cost, timestamp)
payment_history (id, user_id, amount, currency, status, payment_method, created_at)
```

---

## 📋 Development Phases & Timeline

### Phase 1: MVP Foundation (8-10 weeks)

#### Week 1-2: Project Setup & Infrastructure
**PRP: PROJECT-SETUP**
- [ ] Initialize monorepo with Turborepo/Nx
- [ ] Set up Next.js app with TypeScript + Tailwind
- [ ] Configure FastAPI backend with proper project structure
- [ ] Set up PostgreSQL + Redis databases
- [ ] Create shared packages architecture
- [ ] Set up development environment (Docker containers)
- [ ] Configure ESLint, Prettier, pre-commit hooks
- [ ] Set up CI/CD pipeline basics (GitHub Actions)

#### Week 3-4: Authentication & User Management
**PRP: AUTH-SYSTEM**
- [ ] Implement JWT authentication (FastAPI)
- [ ] Create user registration/login API endpoints
- [ ] Build Next.js auth pages (login, register, profile)
- [ ] Add password reset functionality
- [ ] Implement user profile management
- [ ] Add profession/job selection during onboarding
- [ ] Create protected route middleware
- [ ] Add user session management

#### Week 5-6: Core Chat Interface
**PRP: CHAT-INTERFACE**
- [ ] Design chat UI components (messages, input, sidebar)
- [ ] Implement real-time WebSocket connection
- [ ] Create conversation management (new, save, load)
- [ ] Add message history persistence
- [ ] Implement typing indicators and message status
- [ ] Add Arabic RTL text support
- [ ] Create language toggle functionality
- [ ] Add basic message formatting (markdown support)

#### Week 7-8: AI Integration & Iraqi Accent
**PRP: AI-INTEGRATION**
- [ ] Set up OpenAI API integration
- [ ] Implement chat completion with system prompts
- [ ] Create Iraqi dialect system prompts
- [ ] Add conversation context management
- [ ] Implement token usage tracking
- [ ] Add response streaming for real-time feel
- [ ] Create fallback handling for API failures
- [ ] Add basic content filtering

#### Week 9-10: Voice Features & Polish
**PRP: VOICE-FEATURES**
- [ ] Implement speech-to-text (OpenAI Whisper)
- [ ] Add text-to-speech with Iraqi accent (OpenAI TTS)
- [ ] Create voice recording UI components
- [ ] Add audio playback controls
- [ ] Implement voice message persistence
- [ ] Add push-to-talk functionality
- [ ] Create voice settings (speed, volume)
- [ ] Test and polish voice quality

### Phase 2: Document Processing & Web Integration (6-8 weeks)

#### Week 11-12: File Upload System
**PRP: FILE-UPLOAD**
- [ ] Create file upload API with validation
- [ ] Implement file storage (S3 or local)
- [ ] Add file type detection and validation
- [ ] Create upload progress tracking
- [ ] Build file management UI
- [ ] Add file size and format restrictions
- [ ] Implement file deletion
- [ ] Add file preview capabilities

#### Week 13-14: Document Processing Pipeline
**PRP: DOCUMENT-PROCESSING**
- [ ] Set up PDF text extraction (PyPDF2)
- [ ] Implement Word document processing (python-docx)
- [ ] Add Excel file parsing (openpyxl)
- [ ] Set up OCR for images (pytesseract)
- [ ] Create document content indexing
- [ ] Implement text chunking for embeddings
- [ ] Add document metadata extraction
- [ ] Create background processing with Celery

#### Week 15-16: Document Q&A System
**PRP: DOCUMENT-QA**
- [ ] Implement vector embeddings for documents
- [ ] Create semantic search functionality
- [ ] Build document-aware chat context
- [ ] Add citation system (page/section references)
- [ ] Implement cross-document search
- [ ] Create document summary generation
- [ ] Add relevance scoring for answers
- [ ] Build document management interface

### Phase 3: Professional Knowledge & Billing (3-4 weeks)

#### Week 17-18: Iraqi Knowledge Base
**PRP: IRAQI-KNOWLEDGE**
- [ ] Create knowledge base structure
- [ ] Import Iraqi legal documents (provided by you)
- [ ] Set up educational content database
- [ ] Implement domain-specific prompts
- [ ] Create knowledge search and retrieval
- [ ] Add professional template system
- [ ] Build knowledge base admin interface
- [ ] Implement content versioning

#### Week 19-20: Document Generation & Advanced Features
**PRP: DOCUMENT-GENERATION**
- [ ] Set up PDF generation (ReportLab/WeasyPrint)
- [ ] Implement Word document creation
- [ ] Create Arabic-compatible templates
- [ ] Build document formatting system
- [ ] Add custom styling options
- [ ] Implement CV/Resume generator (Iraqi format)

**PRP: WEB-INTEGRATION-MVP**
- [ ] Implement web search capability (real-time data)
- [ ] Add news aggregation for Iraqi events
- [ ] Create web scraping service (basic)
- [ ] Build credential storage system (encrypted)
- [ ] Add simple form automation (phase 1)

**PRP: BILLING-SYSTEM**
- [ ] Implement ZainCash payment gateway (primary)
- [ ] Add FastPay and NassWallet integration
- [ ] Create credit-based system (IQD pricing)
- [ ] Build usage tracking dashboard
- [ ] Add low balance warnings
- [ ] Implement token package system

---

## 🔧 Technical Implementation Details

### AI & Language Processing

#### PydanticAI Implementation (2025 Best Practice)
```python
# PydanticAI agent with Iraqi dialect specialization
from pydantic_ai import Agent, RunContext
from pydantic import BaseModel

class IraqiContext(BaseModel):
    user_profession: str
    language_preference: str = "arabic"
    dialect: str = "iraqi"

class IraqiAIAgent:
    def __init__(self):
        self.agent = Agent(
            'openai:gpt-4o',  # Primary model
            system_prompt=self.get_iraqi_system_prompt(),
            deps_type=IraqiContext,
            result_type=str
        )
    
    def get_iraqi_system_prompt(self):
        return """
        أنت مساعد ذكي يتحدث باللهجة العراقية الأصيلة. 
        تتميز بـ:
        - استخدام المفردات العراقية المحلية
        - النبرة الودودة والمألوفة للعراقيين  
        - فهم السياق الثقافي العراقي
        - المعرفة بالقوانين والأنظمة العراقية
        """

# Multi-model fallback strategy
MODEL_FALLBACK = [
    "openai:gpt-4o",           # Primary
    "anthropic:claude-3-5-sonnet", # Fallback
    "jais-api"                 # Arabic specialist
]

# Voice configuration optimized for Iraqi accent
VOICE_CONFIG = {
    "model": "tts-1-hd",      # Higher quality for 2025
    "voice": "alloy",         # Test results show best for Arabic
    "speed": 0.9,             # Slightly slower for clarity
    "response_format": "mp3"
}
```

#### LangGraph Orchestration (Complex Workflows)
```python
# For multi-step document processing and agent routing
from langgraph.graph import StateGraph, END
from typing import TypedDict

class AgentState(TypedDict):
    messages: list
    user_context: IraqiContext
    document_content: str
    next_action: str

def create_iraqi_agent_graph():
    workflow = StateGraph(AgentState)
    
    # Add nodes for different capabilities
    workflow.add_node("chat", handle_chat)
    workflow.add_node("document_analysis", process_documents)
    workflow.add_node("legal_specialist", legal_expert)
    workflow.add_node("education_specialist", education_expert)
    
    # Define routing logic
    workflow.add_conditional_edges(
        "chat",
        route_to_specialist,
        {
            "legal": "legal_specialist",
            "education": "education_specialist", 
            "document": "document_analysis",
            "general": END
        }
    )
    
    return workflow.compile()
```

### Document Processing Pipeline

#### Multi-format Processing
```python
# Document processing strategy
PROCESSORS = {
    'pdf': PDFProcessor,
    'docx': WordProcessor,
    'xlsx': ExcelProcessor,
    'txt': TextProcessor,
    'jpg': OCRProcessor,
    'png': OCRProcessor
}

# Embedding and search
class DocumentEmbedding:
    def __init__(self):
        self.embedder = OpenAIEmbeddings()
        self.vector_store = PineconeVectorStore()
    
    def process_document(self, doc_content: str):
        chunks = self.chunk_text(doc_content)
        embeddings = self.embedder.embed_documents(chunks)
        return self.vector_store.add_embeddings(embeddings)
```

### Real-time Communication (2025 Optimized)
```typescript
// SSE implementation for AI streaming (primary)
class ChatStreamingService {
  async streamAIResponse(message: string) {
    const response = await fetch('/api/chat/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      // Handle streaming AI response chunks
      this.handleStreamChunk(chunk);
    }
  }
}

// WebSocket fallback for bidirectional features
class ChatWebSocketFallback {
  private socket: Socket;
  
  constructor(token: string) {
    this.socket = io('/chat', {
      auth: { token },
      transports: ['websocket'],
      upgrade: true,  // Allow upgrade from polling
      rememberUpgrade: true
    });
    
    this.setupEventHandlers();
  }
  
  private setupEventHandlers() {
    this.socket.on('message', this.handleMessage);
    this.socket.on('typing', this.handleTyping);
    this.socket.on('voice_generated', this.handleVoice);
    this.socket.on('document_processed', this.handleDocumentUpdate);
  }
}

// Zustand + TanStack Query state management
import { create } from 'zustand';
import { useQuery, useMutation } from '@tanstack/react-query';

// Client state (Zustand)
interface ChatUIState {
  isTyping: boolean;
  selectedLanguage: 'arabic' | 'english';
  voiceEnabled: boolean;
  setIsTyping: (typing: boolean) => void;
  setLanguage: (lang: 'arabic' | 'english') => void;
  toggleVoice: () => void;
}

const useChatUIStore = create<ChatUIState>((set) => ({
  isTyping: false,
  selectedLanguage: 'arabic',
  voiceEnabled: true,
  setIsTyping: (typing) => set({ isTyping: typing }),
  setLanguage: (lang) => set({ selectedLanguage: lang }),
  toggleVoice: () => set((state) => ({ voiceEnabled: !state.voiceEnabled }))
}));

// Server state (TanStack Query)
function useChatMessages(conversationId: string) {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => fetchMessages(conversationId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });
}
```

---

## 🚀 Deployment Strategy

### MVP Deployment (Cost-Effective)
```yaml
Infrastructure:
  Web Hosting: Vercel (Next.js)
  API Hosting: Railway/Render (FastAPI)
  Database: Supabase (PostgreSQL + real-time)
  File Storage: Supabase Storage
  Cache: Upstash Redis
  
Cost Estimate:
  - Vercel: Free tier initially
  - Railway: ~$5/month
  - Supabase: ~$25/month
  - Upstash: ~$10/month
  Total: ~$40/month + API costs
```

### Production Scaling
```yaml
Infrastructure:
  Web: Vercel Pro
  API: AWS ECS or Google Cloud Run
  Database: AWS RDS PostgreSQL
  Cache: AWS ElastiCache Redis
  Storage: AWS S3
  CDN: CloudFront
  
Monitoring:
  - Error tracking: Sentry
  - Performance: DataDog/NewRelic
  - Uptime: Pingdom
```

---

## 📊 Development Workflow

### Context Engineering Workflow
1. **Feature Planning**: Create detailed PRP for each feature section
2. **Context Generation**: Use PRP to generate comprehensive development context
3. **Implementation**: Develop with full context awareness
4. **Validation**: Test against PRP requirements
5. **Iteration**: Refine based on testing and feedback

### Git Workflow
```
Branches:
  main: Production-ready code
  develop: Integration branch
  feature/*: Feature development
  hotfix/*: Critical fixes
  
Release Process:
  1. Feature branch → develop
  2. develop → staging deployment
  3. QA testing on staging
  4. develop → main (production)
```

### Quality Assurance
```typescript
// Testing strategy
Testing Pyramid:
  - Unit tests: Jest + React Testing Library
  - Integration tests: FastAPI TestClient
  - E2E tests: Playwright
  - Performance tests: Lighthouse CI
  - Security tests: OWASP ZAP
  
Code Quality:
  - TypeScript strict mode
  - ESLint + Prettier
  - SonarQube analysis
  - Pre-commit hooks
```

---

## 🔐 Security & Compliance

### Data Protection Strategy
```python
Security Measures:
  - End-to-end encryption for sensitive data
  - JWT tokens with short expiration
  - Input validation and sanitization
  - Rate limiting and DDoS protection
  - Regular security audits
  
Iraqi Compliance:
  - Data residency considerations
  - User consent management
  - Right to data deletion
  - Audit logging
```

### Payment Integration (Iraqi-Specific - Updated July 2025)
```typescript
// Confirmed Iraqi payment gateways with API support
Primary Payment Options:
  1. ZainCash - Leading mobile payment (API: docs.zaincash.iq)
     - Merchant ID + JWT authentication
     - Minimum: 1000 IQD per transaction
     - 3% transaction fee
  2. FastPay - Emerging gateway with good API docs
     - Step-by-step integration guides
     - Support for new payment methods
  3. NassWallet - CBI & PCI DSS compliant
     - Mobile-based digital finance
     - 3% transaction fee
  4. PayTabs - International gateway with Iraq support
     - Reliable payment processing
     - Multi-currency support
  
Implementation Strategy:
  - Primary: ZainCash (largest user base)
  - Secondary: FastPay + NassWallet
  - Fallback: PayTabs for international users
  - Multi-gateway support with unified API
```

---

## 📈 Performance Optimization

### Frontend Optimization
```typescript
Performance Strategy:
  - Next.js App Router with streaming
  - Component lazy loading
  - Image optimization (next/image)
  - Bundle analysis and code splitting
  - Service worker for offline capability
  
Real-time Optimization:
  - WebSocket connection pooling
  - Message debouncing
  - Optimistic UI updates
  - Background sync
```

### Backend Optimization
```python
API Performance:
  - FastAPI async/await patterns
  - Database connection pooling
  - Redis caching strategy
  - Background task processing
  - Response compression
  
AI Integration:
  - Token usage optimization
  - Response streaming
  - Model selection based on complexity
  - Caching for repeated queries
```

---

## 🎯 Success Metrics & Monitoring

### Technical Metrics
- API response time: <500ms p95
- Chat message delivery: <100ms
- Document processing: <30 seconds
- Voice generation: <3 seconds
- Uptime: 99.9%

### Business Metrics
- User acquisition: 100 users/month by month 3
- Conversion rate: 15% free to paid
- Monthly retention: 70%
- Revenue: $1K MRR by month 6

### Development Metrics
- Code coverage: >80%
- Build time: <5 minutes
- Deployment frequency: Daily
- Lead time: <2 days
- MTTR: <1 hour

---

## 🔬 **Repository Integration Analysis**

### **Context Engineering vs BMAD Method**
**Recommendation: Use Context Engineering (Primary) + BMAD Method (Complex Features)**

**Context Engineering Advantages:**
- **Perfect for your PRP approach** - Create individual PRPs for each feature
- **Systematic methodology** - Transforms "sticky note" prompting to "screenplay" implementation
- **10× better than prompt engineering** according to research
- **Ideal for Iraqi-specific features** requiring deep context

**BMAD Method Integration:**
- **Use for complex multi-agent features** (Post-MVP)
- **Agentic planning** with specialized AI agents (Analyst, PM, Architect)
- **Hyper-detailed development stories** for complex workflows
- **Complement Context Engineering** for large-scale features

**Implementation Strategy:**
```
MVP Phase: Context Engineering only
├── Individual PRPs for each feature section
├── Comprehensive context for Iraqi dialect
└── Systematic development approach

Post-MVP: Context Engineering + BMAD Method
├── Context Engineering for feature development
├── BMAD Method for multi-agent orchestration
└── Combined approach for enterprise features
```

### **Make-it-Heavy Repository Analysis**
**Recommendation: Post-MVP Integration (Month 6+)**

**Why Post-MVP:**
- **Heavy computational requirements** - Multiple agents running in parallel
- **MVP focus should be single-agent excellence** with Iraqi specialization
- **Perfect for professional specialization phase** (lawyers, teachers, doctors)
- **Ideal for complex analysis** that Iraqi professionals need

**Integration Timeline:**
```
Month 1-4 (MVP): Single Master Agent
├── Focus on Iraqi dialect perfection
├── Core document processing
└── Basic professional knowledge

Month 6+ (Advanced): Make-it-Heavy Integration
├── Multi-agent analysis for legal queries
├── Educational content creation with multiple perspectives
├── Medical consultation with specialist agents
└── Business analysis with market-specific agents
```

**Specific Use Cases for Iraqi Professionals:**
- **Legal**: Multi-agent analysis of Iraqi law with different perspectives
- **Education**: Curriculum development with pedagogical expert agents
- **Medical**: Diagnostic assistance with multiple medical specialist agents
- **Business**: Market analysis with economic and cultural expert agents

### **Development Methodology Integration**
```
Feature Development Workflow:
1. Create PRP using Context Engineering principles
2. For complex features: Use BMAD Method for planning
3. Implement with comprehensive context
4. For advanced analysis: Integrate Make-it-Heavy agents
5. Validate and iterate based on Iraqi user feedback
```

---

## 🎯 **Updated Feature Priority Matrix**

### **MVP Features (Months 1-4)**
```
Priority 1 (Essential):
├── Chat with Iraqi dialect (Context Engineering PRP)
├── Document upload/Q&A (Context Engineering PRP)
├── User authentication & profiles
├── Basic payment integration (ZainCash primary)
└── CV/Resume generator (Iraqi format)

Priority 2 (Important):
├── Real-time web search integration
├── Basic document generation (PDF/Word)
├── Professional knowledge base (law/education)
└── Voice features (speech-to-text/text-to-speech)
```

### **Post-MVP Features (Months 4+)**
```
Phase 1 (Months 4-6):
├── Multi-agent system (BMAD Method planning)
├── Web automation with credentials
├── Advanced document processing
└── Mobile app development

Phase 2 (Months 6+):
├── Make-it-Heavy integration for professional analysis
├── Enterprise features and team collaboration
├── API platform for developers
└── Government service integration
```

This comprehensive development plan provides the technical roadmap for building your Iraqi AI chat system using the optimal combination of Context Engineering (primary), BMAD Method (complex features), and Make-it-Heavy (advanced analysis) methodologies.