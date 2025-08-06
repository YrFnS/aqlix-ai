# Iraqi AI Chat System

Project-specific knowledge for the Iraqi AI chat system with cultural context and Arabic RTL support.

## Sub-Agent Usage Guidelines

Always use specialized agents for complex tasks:
- **Iraqi cultural content**: Use iraqi-cultural-validator PROACTIVELY for Islamic compliance and cultural appropriateness
- **Arabic text processing**: Use arabic-rtl-processor for RTL layout, Iraqi dialect recognition, and mixed content
- **Payment security**: Use payment-security-guardian for gateway integration and financial transaction validation
- **Professional domains**: Use iraqi-professional-domain-expert for Iraqi legal/medical/educational queries
- **UI/UX work**: Use iraqi-ui-designer, iraqi-ux-researcher, iraqi-interaction-designer, iraqi-accessibility-specialist for design tasks
- **Quality assurance**: Use iraqi-cultural-tester, iraqi-arabic-tester, iraqi-payment-tester for comprehensive testing
- **Complex workflows**: Use iraqi-workflow-orchestrator for multi-agent coordination

## MCP Server Requirements

Always use these MCP servers:
- **Sequential MCP**: For analysis and complex problem-solving
- **Context7 MCP**: For latest documentation and official library references
- **Playwright MCP**: For testing workflows and browser automation
- **Desktop Commander MCP**: For file operations and system tasks
- **Serena MCP**: For searching through the application (read Serena's instructions first)

## Bash commands

**Bun-Optimized Commands (30x faster than npm):**
- `bun run dev`: Start all applications in development mode
- `bun run build`: Build all applications for production  
- `bun test`: Run all tests (built-in Bun test runner)
- `bun run typecheck`: TypeScript compilation check
- `bun run lint`: Code style validation
- `bun run test:cultural`: Run Iraqi cultural validation tests
- `bun run test:arabic`: Run Arabic RTL and dialect tests
- `bun install`: Install dependencies (30x faster than npm)

## Project structure

- **Frontend**: Next.js 15.1 + React 19 + Bun in `apps/web/`
- **Backend**: FastAPI + SQLAlchemy 2.0 + PydanticAI in `apps/api/`
- **Shared packages**: Bun workspaces in `packages/` (ui, types, features, api-client, arabic-nlp)
- **UI Components**: 44 Iraqi-enhanced custom components from `examples/dyad-extracted/`
- **Sub-agents**: 20 specialized agents in `.claude/agents/`
- **Context management**: Persistent knowledge base in `project-context/`
- **Examples**: Production reference implementations in `examples/`
- **PRPs**: Product Requirement Prompts in `PRPs/`
- **Data**: Iraqi knowledge base in `data/` (iraqi-law, education, templates)

```

├── .claude/
│   └── agents/                 # 20 specialized agents for complex tasks
├── project-context/            # Context management system
│   ├── agents/
│   │   ├── knowledge-base/     # Persistent agent knowledge (cultural-decisions.md, etc.)
│   │   ├── session-logs/       # Agent interaction logs
│   │   └── workflows/          # Multi-agent workflow templates
│   └── current-context.md      # Active session context
├── apps/
│   ├── web/                    # Next.js 15+ web application
│   ├── mobile/                 # React Native app (future)
│   └── api/                    # Python FastAPI backend
│       ├── agents/             # PydanticAI agent modules
│       ├── routes/             # FastAPI route handlers
│       └── services/           # Business logic services
├── packages/                   # Shared between web & mobile
│   ├── ui/                     # Shared UI components
│   ├── types/                  # TypeScript types
│   ├── features/               # Shared business logic (chat/, documents/, payments/)
│   ├── api-client/             # API client logic
│   └── arabic-nlp/             # Arabic processing logic
├── examples/                   # reference implementations
├── data/                       # Iraqi knowledge base (iraqi-law/, education/, templates/)
├── PRPs/                       # Product Requirement Prompts
└── CLAUDE.md                   # Project memory and agent guidelines
```

## Tech stack

**Frontend (Optimized 2025 Stack):**
- **Runtime**: Bun (30x faster installs, native TypeScript)
- **Framework**: Next.js 15.1+ with React 19
- **UI**: Tailwind CSS v4 + 44 Custom Iraqi-Enhanced Components
- **ORM**: Drizzle ORM (100x faster than Prisma, SQL-first)
- **State**: Zustand + TanStack Query
- **TypeScript**: Strict mode, zero external UI dependencies

**Backend:**
- **Framework**: Python FastAPI with SQLAlchemy 2.0 (async/await)
- **AI**: PydanticAI + OpenAI GPT-4o
- **Database**: PostgreSQL + Redis

**Payment & Languages:**
- **Gateways**: ZainCash (1000 IQD min), FastPay (500 IQD min), NassWallet (1000 IQD min)
- **Languages**: Iraqi Arabic (primary), Standard Arabic, English

## Code style

- **TypeScript**: Strict mode enabled, zero `any` types, Bun native support
- **Python**: SQLAlchemy 2.0 async patterns, python-dotenv with `load_dotenv()`, never hardcode API keys
- **RTL Support**: Built-in Iraqi components with `cultural="iraqi"` prop and automatic RTL
- **Imports**: Absolute imports with `@/` for src, `@iraqi-ai/` for Bun workspaces
- **File organization**: Group by features (chat/, documents/, payments/), not technology
- **Components**: Use custom Iraqi-enhanced components from `examples/dyad-extracted/`

## Iraqi cultural requirements

- **Islamic compliance**: All features must respect Islamic values
- **Political neutrality**: Avoid sectarian, political, or tribal sensitive topics
- **Professional context**: Support Iraqi legal, medical, educational, engineering domains
- **Arabic language**: Support Iraqi dialect vocabulary with formal Arabic for professional contexts
- **RTL design**: Right-align Arabic text, left-align English, use `font-arabic` class

## Testing standards

- **Cultural tests**: 100% pass rate for Islamic compliance and Iraqi appropriateness
- **Arabic tests**: RTL layout accuracy >99%, Iraqi dialect recognition >85%
- **Payment tests**: All Iraqi gateways tested, security compliance 100%
- **Test pyramid**: Unit tests 95%+, integration 90%+, cultural tests 100%

## Development workflow

- **Research first**: Web search extensively, study official docs
- **Test-driven**: Write tests first, confirm failures, implement to pass
- **Cultural validation**: All content validated for Iraqi appropriateness
- **Privacy-first**: Session-only training, auto-expire data within 1 hour

## Agent specialization

When complex tasks require specialized expertise, delegate to appropriate agents:
- **iraqi-cultural-validator**: Cultural appropriateness and Islamic compliance
- **arabic-rtl-processor**: RTL text handling and Iraqi dialect processing  
- **payment-security-guardian**: Payment gateway security and validation
- **iraqi-professional-domain-expert**: Iraqi legal/medical/educational domains

## Environment setup

**Bun + PydanticAI + SQLAlchemy 2.0 Pattern:**
```bash
# Frontend setup with Bun
bun install
bun add drizzle-orm pg @types/pg
bun add -D drizzle-kit
```

```python
# Backend: PydanticAI + SQLAlchemy 2.0 pattern
from pydantic_settings import BaseSettings
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine

class Settings(BaseSettings):
    llm_api_key: str = Field(..., description="API key for LLM")
    database_url: str = Field(..., description="Async PostgreSQL URL")
    
def load_settings():
    load_dotenv()  # CRITICAL: Always load .env first
    return Settings()

# SQLAlchemy 2.0 async setup
async_engine = create_async_engine(settings.database_url)
```

## Security requirements

- **API keys**: Use .env files with python-dotenv, never commit keys
- **Input validation**: Validate all inputs for security and cultural appropriateness  
- **Arabic text**: Preserve Iraqi dialect while filtering malicious content
- **Payment security**: Parameterized statements only, end-to-end encryption

## Key directories to know

**Core Architecture:**
- `apps/web/src/`: Next.js 15.1 + React 19 + Bun frontend
- `apps/api/src/`: FastAPI + SQLAlchemy 2.0 + PydanticAI backend
- `packages/`: Bun workspaces with shared logic (ui, types, features, api-client, arabic-nlp)

**UI Components (Iraqi-Enhanced):**
- `examples/dyad-extracted/components/ui/`: 44 production-ready components
- `examples/dyad-extracted/IRAQI_ENHANCEMENT_STRATEGY.md`: Cultural customization guide

**AI & Context:**
- `examples/main_agent_reference/`: Production PydanticAI patterns
- `.claude/agents/`: 20 specialized agents for complex tasks
- `project-context/agents/knowledge-base/`: Persistent agent decisions
- `project-context/current-context.md`: Active session context
