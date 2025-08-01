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

- `npm run dev`: Start all applications in development mode
- `npm run build`: Build all applications for production  
- `npm run test`: Run all tests (unit, integration, cultural)
- `npm run typecheck`: TypeScript compilation check
- `npm run lint`: Code style validation
- `npm run test:cultural`: Run Iraqi cultural validation tests
- `npm run test:arabic`: Run Arabic RTL and dialect tests

## Project structure

- **Frontend**: Next.js 15+ with TypeScript, Arabic RTL support in `apps/web/`
- **Backend**: Python FastAPI with PydanticAI agents in `apps/api/`
- **Shared packages**: Cross-platform code in `packages/` (ui, types, features, api-client, arabic-nlp)
- **Sub-agents**: 20 specialized agents in `.claude/agents/`
- **Context management**: Persistent knowledge base in `project-context/`
- **Examples**: PydanticAI reference implementations in `examples/`
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

- **Frontend**: Next.js 15+, TypeScript, Arabic RTL support
- **Backend**: Python FastAPI, PydanticAI, OpenAI GPT-4o  
- **Payment gateways**: ZainCash (1000 IQD min), FastPay (500 IQD min), NassWallet (1000 IQD min)
- **Languages**: Iraqi Arabic (primary), Standard Arabic, English

## Code style

- **TypeScript**: Strict mode enabled, zero `any` types
- **Python**: Always use python-dotenv with `load_dotenv()`, never hardcode API keys
- **RTL Support**: All UI components handle `dir={language === 'arabic' ? 'rtl' : 'ltr'}`
- **Imports**: Absolute imports with `@/` for src, `@iraqi-ai/` for packages
- **File organization**: Group by features (chat/, documents/, payments/), not technology

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

```python
# Always use this pattern for PydanticAI agents
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

class Settings(BaseSettings):
    llm_api_key: str = Field(..., description="API key for LLM")
    
def load_settings():
    load_dotenv()  # CRITICAL: Always load .env first
    return Settings()
```

## Security requirements

- **API keys**: Use .env files with python-dotenv, never commit keys
- **Input validation**: Validate all inputs for security and cultural appropriateness  
- **Arabic text**: Preserve Iraqi dialect while filtering malicious content
- **Payment security**: Parameterized statements only, end-to-end encryption

## Key directories to know

- `apps/web/src/`: Next.js frontend application
- `apps/api/src/`: FastAPI backend with PydanticAI agents
- `packages/features/`: Shared business logic (chat, documents, payments)
- `examples/main_agent_reference/`: Production PydanticAI patterns
- `.claude/agents/`: 20 specialized agents for complex tasks
- `project-context/agents/knowledge-base/`: Persistent agent decisions and patterns
- `project-context/agents/workflows/`: Multi-agent workflow templates
- `project-context/current-context.md`: Active session context
