# Iraqi AI Chat System - Complete Development Plan

## Executive Summary

A comprehensive AI chat system designed specifically for Iraqi users, featuring Arabic language processing with Iraqi dialect support, document handling capabilities, and profession-based customization. The system will operate on a freemium model with usage-based API billing and local payment integration.

## Tech Stack Overview (Updated for July 2025)

### Frontend
- **Framework**: Next.js 15+ (App Router)
- **UI Library**: React 19 (stable)
- **Styling**: Tailwind CSS v4 + Shadcn/ui
- **State Management**: Zustand + React Query (TanStack Query)
- **Real-time**: Server-Sent Events (built-in Next.js streaming)
- **Arabic Support**: react-rtl-support, arabic-reshaper
- **File Handling**: react-dropzone, file-saver

### Backend
- **Primary API**: Python (FastAPI)
- **Node Service**: Express.js (for real-time features)
- **Task Queue**: Celery + Redis
- **Database**: PostgreSQL (primary) + Redis (caching)
- **Vector DB**: Pinecone (cloud) / Supabase Vector (integrated)
- **File Storage**: Supabase Storage / AWS S3

### AI/ML Stack (API-Based for MVP)
- **Primary LLM**: 
  - OpenAI GPT-4o (main)
  - Jais API (Arabic specialized)
- **Embeddings**: OpenAI text-embedding-3-large
- **Document Processing**: LangChain + PyMuPDF
- **Workflow Orchestration**: LangGraph
- **Chat Framework**: PydanticAI
- **Voice**: OpenAI Whisper + TTS API

### Infrastructure
- **Cloud**: 
  - Vercel (Next.js hosting)
  - Railway/Render (Python API)
  - Supabase (Database & Auth)
- **Container**: Docker
- **CI/CD**: GitHub Actions
- **Monitoring**: Vercel Analytics + Sentry
- **CDN**: Vercel Edge Network

### Payment & Auth
- **Payment Gateways**: 
  - FastPay (primary)
  - NassWallet
  - PayTabs
  - ZainCash
- **Authentication**: Supabase Auth
- **Usage Tracking**: Custom billing service

---

## AI Agent Architecture

### MVP: Single Master Agent with Tool Access
```python
# Single intelligent agent that can access multiple tools
class MasterAgent:
    - Chat capabilities (general conversation)
    - Document processing tools
    - Knowledge base search
    - Document generation
    - Web search (when needed)
```

### Future: Multi-Agent System
```python
# Specialized agents for different tasks
class AgentOrchestrator:
    agents = {
        "chat": GeneralChatAgent(),
        "legal": IraqiLegalAgent(),
        "education": EducationAgent(),
        "medical": MedicalAgent(),
        "document": DocumentProcessingAgent(),
        "research": WebResearchAgent()
    }
    
    def route_request(self, user_input, user_profession):
        # Intelligently route to appropriate agent(s)
```

---

## Base App Structure for Scalable Development

```
iraqi-ai-chat/
├── apps/
│   ├── web/                    # Next.js 15 web app
│   ├── mobile/                 # React Native mobile app
│   │   ├── src/
│   │   │   ├── screens/       # Mobile screens
│   │   │   ├── components/    # Mobile-specific components
│   │   │   ├── navigation/    # React Navigation setup
│   │   │   └── services/      # Mobile-specific services
│   │   └── shared/            # Shared with web via packages
│   └── api/                    # Python FastAPI backend
├── packages/                   # Shared between web & mobile
│   ├── ui/                     # Shared UI components
│   ├── types/                  # TypeScript types
│   ├── utils/                  # Shared utilities
│   ├── api-client/            # API client logic
│   ├── arabic-nlp/            # Arabic processing logic
│   └── features/              # Shared business logic
│       ├── chat/
│       ├── documents/
│       └── payments/
├── services/
│   ├── chat-engine/           # Chat processing service
│   ├── document-processor/    # Document handling service
│   ├── payment-service/       # Payment & billing integration
│   ├── knowledge-base/        # Knowledge base management
│   └── agent-orchestrator/    # Agent routing (future)
├── data/                      # Knowledge base data
│   ├── iraqi-law/            # Legal documents
│   ├── education/            # Educational materials
│   ├── templates/            # Document templates
│   └── embeddings/           # Pre-computed embeddings
└── infrastructure/
    ├── docker/               # Docker configurations
    └── scripts/              # Deployment scripts

# Next.js App Structure (apps/web)
src/
├── app/                      # App Router pages
│   ├── (auth)/              # Auth group layout
│   ├── (dashboard)/         # Dashboard group
│   ├── api/                 # API routes
│   └── [...locale]/         # i18n routing
├── components/
│   ├── chat/                # Chat-specific components
│   ├── common/              # Reusable components
│   ├── layout/              # Layout components
│   └── ui/                  # Base UI primitives
├── features/                # Feature-based modules
│   ├── chat/
│   │   ├── hooks/
│   │   ├── components/
│   │   └── services/
│   ├── documents/
│   └── payments/
├── lib/                     # Core libraries
│   ├── api/                # API clients
│   ├── arabic/             # Arabic utilities
│   └── auth/               # Auth utilities
├── hooks/                   # Global custom hooks
├── stores/                  # Zustand stores
├── types/                   # TypeScript definitions
└── utils/                   # Utility functions

# React Native App Structure (apps/mobile)
src/
├── screens/                 # Screen components
│   ├── Auth/
│   ├── Chat/
│   ├── Documents/
│   └── Profile/
├── components/             # Mobile-specific components
│   ├── chat/
│   └── common/
├── navigation/             # Navigation configuration
├── services/               # Mobile-specific services
│   ├── storage/           # AsyncStorage wrapper
│   └── notifications/     # Push notifications
└── hooks/                  # Mobile-specific hooks
```

---

## Knowledge Base Integration

### Where to Add Your Database/Documents:

1. **Development Phase**:
   ```
   data/
   ├── iraqi-law/
   │   ├── constitution.pdf
   │   ├── civil_code.pdf
   │   └── ...
   ├── education/
   │   ├── curriculum/
   │   └── exam_templates/
   └── templates/
       ├── cv_templates/
       └── legal_forms/
   ```

2. **Processing Pipeline**:
   - Upload documents via admin panel
   - Process with LangChain document loaders
   - Generate embeddings with OpenAI
   - Store in vector database (Pinecone/Supabase)
   - Index metadata in PostgreSQL

3. **Runtime Access**:
   ```python
   # The AI accesses knowledge base through:
   - Vector similarity search
   - Metadata filtering (profession, category)
   - RAG (Retrieval Augmented Generation)
   ```

---

## MVP Features (3-4 Months)

### 1. Core Chat Functionality
- **Single Master Agent**
  - Handles all chat interactions
  - Access to document tools
  - Knowledge base search
  - Context-aware responses
  - Iraqi dialect support

- **API Usage Billing**
  - Track tokens per user
  - Prepaid credit system
  - Real-time usage display
  - Low balance warnings

### 2. User Management
- **Authentication System**
  - Email/password registration
  - Phone number verification (Iraqi numbers)
  - Password reset functionality
  - Session management

- **User Profiles**
  - Basic profile information
  - Language preference setting
  - Profession field (important for routing)
  - Usage tracking & credits

### 3. Knowledge Base
- **Pre-loaded Documents**
  - Iraqi law documents
  - Educational materials (Iraqi curriculum)
  - Professional templates
  - Common forms

- **Search Functionality**
  - Semantic search in Arabic
  - Profession-based filtering
  - Source citations in responses

### 4. Document Generation
- **Basic Templates**
  - CV/Resume generator (Arabic/English)
  - Simple legal forms
  - Educational worksheets
  - Export as PDF/Word

### 5. Pricing & Credits System
- **Free Tier**
  - 10,000 tokens free on signup (~50 messages)
  - Basic features only
  - No document generation

- **Credit Packages**
  - 5,000 IQD = 50,000 tokens (~250 messages)
  - 10,000 IQD = 120,000 tokens (~600 messages)
  - 20,000 IQD = 300,000 tokens (~1500 messages)

### 6. Payment Integration
- **Local Payment Methods**
  - FastPay integration
  - NassWallet support
  - Credit purchase flow
  - Payment history

### 7. Basic Admin Panel
- **Content Management**
  - Upload knowledge base documents
  - Manage templates
  - View usage statistics
  - User management

---

## Future Features (Post-MVP)

### Phase 1: Multi-Agent System (Months 4-6)

#### Specialized Agents
- **Agent Orchestrator**
  - Routes requests to specialized agents
  - Manages agent collaboration
  - Optimizes token usage

- **Profession-Specific Agents**
  - Legal Agent (Iraqi law expertise)
  - Education Agent (curriculum aligned)
  - Medical Agent (Arabic medical terms)
  - Business Agent (Iraqi market)

#### Voice Features
- **Arabic Voice Support**
  - OpenAI Whisper for speech-to-text
  - Custom Iraqi TTS model
  - Voice message support

### Phase 2: Mobile App Launch (Months 6-9)

#### React Native App
- **Core Features**
  - Full chat functionality
  - Document upload/viewing
  - Voice messages
  - Push notifications
  - Offline message queue

#### Mobile-Specific Features
- **Native Capabilities**
  - Camera document scanning
  - Biometric authentication
  - Share extensions
  - Background sync

### Phase 3: Advanced Features (Months 9-12)

#### Enhanced Document Processing
- **Advanced Capabilities**
  - Excel formula processing
  - Multi-document analysis
  - OCR for scanned documents
  - Automatic summarization

#### Web Integration
- **External Data Access**
  - Web search capability
  - Real-time information
  - News aggregation
  - Government service integration

### Phase 4: Collaboration (Year 2)

#### Team Features
- **Shared Workspaces**
  - Organization accounts
  - Shared knowledge bases
  - Team chat rooms
  - Usage pooling

#### API Platform
- **Developer Access**
  - Public API
  - Webhook support
  - Custom integrations
  - Usage analytics

---

## Implementation Roadmap

### Month 1: Foundation
- Set up monorepo structure
- Implement basic chat with single agent
- OpenAI API integration
- Basic authentication (Supabase)
- Credit system implementation

### Month 2: Core Features
- Document upload/processing
- Knowledge base integration
- RAG implementation
- PDF/Word generation
- Payment gateway integration

### Month 3: Iraqi Localization
- Iraqi dialect fine-tuning
- Arabic UI refinement
- Knowledge base population
- Legal/educational templates
- Beta testing preparation

### Month 4: MVP Launch
- Production deployment
- Marketing website
- User onboarding flow
- Support system
- Analytics setup

---

## Usage-Based Pricing Strategy

### Token Packages (Prepaid)
- **Starter**: 5,000 IQD
  - 50,000 tokens
  - ~250 chat messages
  - Basic features

- **Standard**: 10,000 IQD
  - 120,000 tokens (20% bonus)
  - ~600 chat messages
  - Document generation

- **Professional**: 20,000 IQD
  - 300,000 tokens (50% bonus)
  - ~1500 chat messages
  - All features

- **Business**: 50,000 IQD
  - 1,000,000 tokens (100% bonus)
  - ~5000 chat messages
  - Priority support

### Token Usage Estimates
- Simple chat: ~200 tokens
- Document Q&A: ~500 tokens
- Document generation: ~1000 tokens
- Complex analysis: ~2000 tokens

---

## Development Best Practices

### Shared Code Strategy
```typescript
// packages/features/chat/useChatLogic.ts
// Shared between web and mobile
export const useChatLogic = () => {
  const sendMessage = async (message: string) => {
    // Common chat logic
  };
  
  return { sendMessage };
};

// Web implementation
// apps/web/features/chat/ChatInterface.tsx
import { useChatLogic } from '@iraqi-ai/features';

// Mobile implementation  
// apps/mobile/src/screens/Chat/ChatScreen.tsx
import { useChatLogic } from '@iraqi-ai/features';
```

### API Client Architecture
```typescript
// packages/api-client/services/agent.service.ts
export class AgentService {
  async chat(message: string, context: ChatContext) {
    // Handles API calls for both web and mobile
  }
}
```

---

## Key Success Metrics

### MVP Success Criteria
- 1000+ registered users in first month
- 500+ paying users
- <2 second response time
- 95%+ Iraqi dialect accuracy
- 4.5+ app store rating (when launched)

### Long-term Goals
- 100,000+ active users
- Multi-agent system handling 80% of queries
- Government partnership for official services
- Educational institution adoption
- Regional expansion

---

## Budget Estimates

### MVP Development (3 months)
- Development team: $0 (existing team)
- Infrastructure: $200/month (Vercel, Supabase)
- API costs: User-funded (prepaid)
- Payment gateway fees: 2-3% per transaction
- Initial knowledge base setup: $500
- Marketing: $1000
- **Total MVP**: ~$2,100

### Monthly Operating Costs (Post-MVP)
- Infrastructure: $500-2000 (scales with users)
- API costs: User-funded
- Support staff: $2000
- Marketing: $1500
- **Total Monthly**: $4,000-5,500

---

## Risk Mitigation

### Technical Risks
- **API Costs**: Prepaid model prevents losses
- **Arabic Accuracy**: Multi-model validation
- **Scalability**: Auto-scaling infrastructure

### Business Risks
- **Payment Processing**: Multiple gateways
- **User Adoption**: Free tier for trial
- **Competition**: Unique Iraqi focus

---

## Next Steps

1. **Week 1-2**: 
   - Set up monorepo structure
   - Initialize web and mobile projects
   - Configure shared packages

2. **Week 3-4**: 
   - Implement single agent with OpenAI
   - Basic chat interface
   - Authentication system

3. **Month 2**: 
   - Knowledge base integration
   - Document processing
   - Payment system

4. **Month 3**: 
   - Iraqi localization
   - Beta testing
   - Mobile app foundation

5. **Month 4**: 
   - MVP launch (web)
   - Continue mobile development
   - Gather feedback for multi-agent system

This plan provides a clear path from a single-agent MVP to a sophisticated multi-agent platform, with mobile considerations from day one and a sustainable usage-based pricing model.

---

No, you don't add the PDFs directly in the app directory! Let me clarify the proper workflow:

## Knowledge Base Document Workflow

### 1. **Initial Storage (Development Phase)**
```
data/                          # Temporary folder for organizing docs
├── iraqi-law/                # Just for development/testing
│   ├── constitution.pdf      # These get processed and uploaded
│   └── civil_code.pdf        # to the actual database
```

### 2. **Actual Database Storage (Production)**

The PDFs should be stored in:

**Supabase Storage** (for file storage):
```sql
-- Supabase Storage Buckets
documents/
├── iraqi-law/
├── education/
├── templates/
└── user-uploads/
```

**PostgreSQL** (for metadata):
```sql
-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY,
  title TEXT,
  category TEXT,
  file_url TEXT,        -- Supabase Storage URL
  profession TEXT[],    -- ['lawyer', 'teacher']
  created_at TIMESTAMP
);
```

**Vector Database** (Pinecone/Supabase Vector):
```python
# Processed text chunks with embeddings
{
  "id": "doc_chunk_123",
  "values": [0.123, -0.456, ...],  # embedding vector
  "metadata": {
    "source": "iraqi_constitution.pdf",
    "page": 5,
    "text": "المادة الأولى...",
    "category": "law"
  }
}
```

### 3. **Document Processing Pipeline**

```python
# services/document-processor/process.py

async def process_document(file_path: str):
    # 1. Upload PDF to Supabase Storage
    file_url = await supabase.storage.upload(file_path)
    
    # 2. Extract text from PDF
    text = extract_text_from_pdf(file_path)
    
    # 3. Split into chunks
    chunks = split_into_chunks(text, chunk_size=500)
    
    # 4. Generate embeddings for each chunk
    embeddings = await openai.embeddings.create(
        input=chunks,
        model="text-embedding-3-large"
    )
    
    # 5. Store in vector database
    await pinecone.upsert(embeddings)
    
    # 6. Store metadata in PostgreSQL
    await supabase.from_('documents').insert({
        'title': document_title,
        'file_url': file_url,
        'category': category
    })
```

### 4. **How the AI Accesses Documents**

```python
# When user asks a question
async def answer_question(question: str, user_profession: str):
    # 1. Generate embedding for the question
    question_embedding = await openai.embeddings.create(
        input=question,
        model="text-embedding-3-large"
    )
    
    # 2. Search vector database
    relevant_chunks = await pinecone.query(
        vector=question_embedding,
        filter={"profession": user_profession},
        top_k=5
    )
    
    # 3. Use retrieved chunks as context
    response = await openai.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": f"Use this context: {relevant_chunks}"},
            {"role": "user", "content": question}
        ]
    )
```

### 5. **Admin Panel for Document Management**

```typescript
// app/(dashboard)/admin/documents/page.tsx

export default function DocumentsAdmin() {
  const handleUpload = async (file: File) => {
    // 1. Upload to Supabase Storage
    const { data } = await supabase.storage
      .from('documents')
      .upload(`${category}/${file.name}`, file);
    
    // 2. Trigger processing pipeline
    await fetch('/api/process-document', {
      method: 'POST',
      body: JSON.stringify({ fileUrl: data.path })
    });
  };
  
  return (
    <DocumentUploader 
      onUpload={handleUpload}
      categories={['law', 'education', 'medical']}
    />
  );
}
```

## Summary

- **DON'T** put PDFs in the app directory
- **DO** upload them to Supabase Storage
- **DO** process them into embeddings
- **DO** store embeddings in vector database
- **DO** store metadata in PostgreSQL

The `data/` folder in the project structure is just for organizing documents before processing, not for runtime access. The actual documents live in your cloud database (Supabase) where they can be properly searched, indexed, and accessed by the AI.