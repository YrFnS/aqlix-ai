# Iraqi AI Chat System - Core Rules & Principles

# Rules Must Follow
Must always follow these rules: before doing anything
Always use MCP servers to search for the latest documentation during development.
Always use Sequential MCP for analysis and complex problem-solving.
Always use Context7 MCP for latest docs and official library documentation.
Always use Serena MCP when searching through the app
- you should "read Serena's initial instructions" to understand how to use serena mcp
Always use Playwright MCP for testing workflows, browser automation, and E2E testing.
Always use Desktop Commander MCP for file operations, process management, and system tasks.
Always use Puppeteer MCP for browser automation and screenshot generation when needed.
Always search the web for the latest information.
AND TAKE NOTE OF THE YEAR WHEN DO THE SEARCHING WE ARE IN 2025

Core constants and principles for Iraqi AI chat system. Rarely change. For implementation tasks, see PRPs.

## 🔄 Context Engineering & Development Workflow

### Claude Code Best Practices
- **Explore-Plan-Code-Commit Pattern**: Read files first, create plan, implement with verification, commit
- **Test-Driven Development**: Write tests first, confirm failures, implement to pass, verify incrementally
- **Be Specific**: Mention exact files to work on, use visual references, course-correct early
- **Use `/clear`** to maintain focused context when switching between complex tasks

### Context Engineering Principles
- **Always start with INITIAL.md** - Define requirements before generating PRPs
- **Research First**: Web search extensively before implementation, study official docs
- **Pattern Extraction**: Identify reusable patterns and architectural conventions
- **Validation Loops**: Each PRP must include executable validation steps
- **Context is King**: Include ALL necessary documentation, examples, and patterns

### PRP Framework Workflow
- Use appropriate commands: `/generate-prp` or `/generate-pydantic-ai-prp` based on feature type
- Follow validation loops for quality assurance at each step
- Break complex tasks into smaller steps with clear completion criteria
- Mark tasks complete immediately after finishing them

## Tech Stack

- **Frontend**: Next.js 15+, TypeScript, Arabic RTL support
- **Backend**: Python FastAPI, PydanticAI, OpenAI GPT-4o
- **Shared**: Cross-platform packages for web/mobile future
- **Payment**: ZainCash (primary), FastPay, NassWallet, PayTabs
- **Languages**: Iraqi Arabic (primary), Standard Arabic, English

## Project Structure

```
/
├── apps/
│   ├── web/                    # Next.js 15+ web application
│   ├── mobile/                 # React Native app (future)
│   └── api/                    # Python FastAPI backend
│       ├── agents/             # PydanticAI agent modules
│       │   ├── agent.py        # Main agent definition
│       │   ├── tools.py        # Agent tools and integrations
│       │   ├── models.py       # Pydantic models and dependencies
│       │   └── settings.py     # Environment configuration
│       ├── routes/             # FastAPI route handlers
│       └── services/           # Business logic services
├── packages/                   # Shared between web & mobile
│   ├── ui/                     # Shared UI components
│   ├── types/                  # TypeScript types
│   ├── features/              # Shared business logic (chat/, documents/, payments/)
│   ├── api-client/            # API client logic
│   └── arabic-nlp/            # Arabic processing logic
├── examples/                   # Reference implementations
│   ├── basic_chat_agent/       # Simple PydanticAI agent patterns
│   ├── main_agent_reference/   # Production agent architecture
│   ├── tool_enabled_agent/     # Agent with external tools
│   ├── structured_output_agent/ # Professional report generation
│   └── testing_examples/       # Agent testing patterns
├── services/                   # Microservices
├── data/                      # Knowledge base (iraqi-law/, education/, templates/)
├── PRPs/                      # Product Requirement Prompts
└── CLAUDE.md                  # This rules file
```

## Commands

- `npm run dev`: Start all applications in development mode
- `npm run build`: Build all applications for production
- `npm run test`: Run all tests (unit, integration, cultural)
- `npm run typecheck`: TypeScript compilation check
- `npm run lint`: Code style validation

## Core Principles

- **KISS**: Choose simple solutions over complex ones
- **YAGNI**: Implement only when needed, not speculative
- **Iraqi-First**: All features consider Iraqi cultural context and Arabic RTL
- **Privacy-First**: Session-only training, auto-expire data within 1 hour
- **Feature-Based**: Organize by features (chat/, documents/, payments/), not technology

## 🤖 PydanticAI Development Standards

### Agent Architecture Patterns
- **Use environment-based configuration** with python-dotenv and pydantic-settings
- **Default to string outputs** - Only use `result_type` when structured output specifically needed
- **Implement dependency injection** with `deps_type` for external services and Iraqi context
- **Follow examples/main_agent_reference/** patterns for production-grade agents
- **Use virtual environments** - Create if one doesn't exist when needed

### Environment Configuration (CRITICAL)
```python
# Always use this pattern for environment setup
from pydantic_settings import BaseSettings
from pydantic import Field, ConfigDict
from dotenv import load_dotenv

class Settings(BaseSettings):
    """Application settings with environment variable support."""
    
    model_config = ConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )
    
    # LLM Configuration
    llm_api_key: str = Field(..., description="API key for the LLM provider")
    llm_model: str = Field(default="gpt-4", description="Model name to use")

def load_settings() -> Settings:
    """Load settings with proper error handling."""
    load_dotenv()  # CRITICAL: Always load .env first
    try:
        return Settings()
    except Exception as e:
        if "llm_api_key" in str(e).lower():
            raise ValueError("Make sure to set LLM_API_KEY in your .env file") from e
        raise
```

### Agent Creation Patterns
```python
# Standard agent pattern for Iraqi AI
from pydantic_ai import Agent, RunContext
from dataclasses import dataclass

@dataclass
class IraqiAgentDependencies:
    """Dependencies for Iraqi AI agent."""
    api_key: str
    cultural_context: str = "iraqi"
    language: str = "arabic"
    professional_domain: str = "general"

# Simple agent with string output (default approach)
iraqi_agent = Agent(
    get_llm_model(),  # Uses load_settings() internally
    deps_type=IraqiAgentDependencies,
    system_prompt="""You are an AI assistant for Iraqi users.
    Respect Islamic values and Iraqi customs.
    Use appropriate Iraqi dialect when speaking Arabic.
    """
)

@iraqi_agent.tool
async def cultural_validation_tool(
    ctx: RunContext[IraqiAgentDependencies], 
    content: str
) -> str:
    """Validate content for Iraqi cultural appropriateness."""
    # Implementation with proper context access
    return validated_content
```

### Testing Standards for AI Agents
- **Use TestModel for development** - Fast validation without API costs
- **Use FunctionModel for custom behavior** - Control agent responses in tests
- **Use Agent.override() for testing** - Replace models in test contexts
- **Test Iraqi-specific scenarios** - Cultural validation, Arabic text, dialect recognition

```python
# Testing pattern for Iraqi AI agents
from pydantic_ai.test import TestModel, FunctionModel

async def test_iraqi_agent():
    # Test with TestModel for fast validation
    test_model = TestModel()
    result = await iraqi_agent.run(
        "شلونك؟",  # Iraqi greeting
        deps=IraqiAgentDependencies(api_key="test"),
        model=test_model
    )
    assert result.data  # Validates agent logic without API calls
```

### Tool Integration Standards
- **Use @agent.tool decorator** for context-aware tools with RunContext[DepsType]
- **Use @agent.tool_plain decorator** for simple tools without context dependencies
- **Implement Iraqi-specific tools** - Cultural validation, Arabic processing, dialect handling
- **Handle tool errors gracefully** - Implement retry mechanisms and cultural error messages

### Security Best Practices for AI Agents
- **API key management** - Use python-dotenv with .env files, never commit keys
- **Input validation** - Use Pydantic models for all tool parameters
- **Iraqi cultural filtering** - Validate content for political/sectarian sensitivity
- **Prompt injection prevention** - Sanitize user inputs while preserving Iraqi dialect

## Iraqi AI Constants

**Target Users**: Iraqi professionals (lawyers, teachers, doctors, engineers) and general users

**Cultural Framework**: 
- Respect Islamic values and Iraqi customs
- Use Iraqi dialect vocabulary patterns
- Professional titles use Iraqi formal address conventions
- Avoid political, sectarian, or tribal sensitive topics

**Professional Knowledge Domains**:
- Legal: Iraqi civil law, criminal procedures, commercial law
- Educational: Iraqi curriculum standards, teaching methods  
- Medical: Iraqi healthcare system, medical terminology
- Engineering: Iraqi building codes, safety regulations

**Payment Gateways**: ZainCash 1000 IQD min, FastPay 500 IQD min, NassWallet 1000 IQD min

## Code Standards

**TypeScript Rules**:
- Strict mode enabled, zero `any` types
- All UI components handle RTL text direction
- Zod validation for all API inputs/outputs
- Cross-platform types work on both web and mobile

**Python Rules (PydanticAI)**:
- **Always use python-dotenv** with `load_dotenv()` - Follow examples/main_agent_reference/settings.py
- **Never hardcode API keys** - Use .env files and pydantic-settings
- **Use async/await consistently** - PydanticAI is designed for async patterns
- **Keep agent files under 500 lines** - Split into agent.py, tools.py, models.py modules

**React Component Standards**:
- `dir={language === 'arabic' ? 'rtl' : 'ltr'}` for all text containers
- `font-arabic` class for Arabic text, `font-sans` for English
- Right-align Arabic, left-align English
- Iraqi professional honorifics in Arabic

**File Organization**:
- Keep files focused on single responsibility
- Group by features, not technology
- Absolute imports: @/ for src, @iraqi-ai/ for packages
- Monorepo conventions: apps/ for applications, packages/ for shared code
- **Agent modules**: agent.py, tools.py, models.py, settings.py structure

## Security & Privacy Rules

- **Privacy-First Training**: Session-only data storage, auto-expire within 1 hour
- **Input Validation**: Validate all inputs for security and cultural appropriateness
- **Iraqi Cultural Filtering**: Block sensitive political, sectarian content
- **SQL Injection Protection**: Use parameterized statements only
- **Arabic Text Sanitization**: Preserve Iraqi dialect while filtering malicious content
- **AI Agent Security**: Never expose API keys, validate tool inputs, handle errors gracefully

## Testing Requirements

- Test all new features: functions, components, API routes, Iraqi-specific logic
- Test both Arabic and English modes for all UI components
- Test Iraqi functionality: cultural validation, payment gateways, professional context
- Testing pyramid: Unit tests (95%+), integration (90%+), cultural tests (100%)
- Tests mirror app structure by features
- **AI Agent Testing**: Use TestModel/FunctionModel for agent validation, test tool behavior

## AI Behavior Rules

- **Never assume missing context** - Ask about Iraqi cultural requirements if uncertain
- **Respect Iraqi cultural sensitivity** - Avoid political, sectarian, inappropriate topics
- **Use verified libraries only** - Confirm before referencing, no hallucination
- **Validate Arabic text handling** - Ensure RTL direction and Iraqi dialect support
- **Maintain professional accuracy** - Provide accurate Iraqi domain expertise
- **Preserve user privacy** - Session-only training, auto-expire data, no persistent storage

**Professional Context Rules**:
- Lawyer: Iraqi civil law, commercial law, family law (cannot provide specific legal advice)
- Teacher: Iraqi curriculum, teaching methods, assessment (cannot diagnose learning disabilities)
- Doctor: General health info, Iraqi healthcare system (cannot diagnose or prescribe)
- Engineer: Iraqi building codes, safety regulations (cannot approve structural designs)

**Language Rules**:
- Prefer Iraqi Arabic dialect vocabulary when speaking Arabic
- Switch languages only when user explicitly requests
- Use formal Arabic for professional contexts, informal for casual chat
- Translate technical terms appropriately between Arabic and English

## Documentation Standards

- Maintain bilingual documentation (Arabic and English) for all user-facing content
- Comment Iraqi-specific logic: cultural adaptations, dialect processing, professional context
- Document architectural decisions: monorepo choices, cross-platform patterns
- Keep documentation current when features, dependencies, or cultural requirements change
- **Document agent behavior**: System prompts, tool functions, dependency requirements

## Project Awareness

- **Monorepo Structure**: apps/ (Next.js web, FastAPI api), packages/ (shared), services/ (microservices)
- **Iraqi-First Principles**: All features must consider Iraqi cultural context and Arabic RTL support
- **Cross-Platform Ready**: Shared business logic between web and future mobile app
- **API-First Design**: FastAPI backend serves both web and mobile frontends
- **AI-Powered Features**: Use PydanticAI for intelligent Iraqi-context chat, document processing, cultural validation

**Integration Touchpoints** - When modifying ANY component, consider impacts on:
1. Arabic text handling (RTL direction, Iraqi dialect)
2. Professional context (works across all Iraqi professions) 
3. Payment flow (credit consumption, Iraqi gateway compatibility)
4. Mobile readiness (shared components work on React Native)
5. Cultural sensitivity (respects Iraqi customs and norms)
6. Privacy compliance (no persistent user data storage)
7. **AI agent behavior** (cultural context, language handling, professional domain awareness)

## 🚫 Critical Anti-Patterns to Avoid

### General Development
- ❌ Don't skip research - Always understand the technology deeply first
- ❌ Don't ignore validation - Every step must include verification
- ❌ Don't assume knowledge - Document everything explicitly
- ❌ Don't skip examples - Always include working code examples

### PydanticAI Specific
- ❌ **Don't hardcode API keys** - Always use .env files with load_dotenv()
- ❌ **Don't use result_type unless needed** - Default to string outputs
- ❌ **Don't skip agent testing** - Always use TestModel/FunctionModel
- ❌ **Don't ignore async patterns** - PydanticAI requires proper async/await
- ❌ **Don't create complex dependency graphs** - Keep dependencies simple and testable
- ❌ **Don't skip environment configuration** - Follow examples/main_agent_reference/settings.py

### Iraqi AI Specific
- ❌ **Don't ignore cultural validation** - Test all AI responses for Iraqi appropriateness
- ❌ **Don't hardcode Arabic text** - Handle RTL direction and font selection properly
- ❌ **Don't skip dialect testing** - Verify Iraqi Arabic recognition works correctly

## Quick Reference

**Adding New Features**:
1. Create PRP in `PRPs/` using appropriate template
2. Include Iraqi context: culture, dialect, professional requirements
3. Define types in `packages/types/` with Arabic text support
4. **For AI features**: Use examples/main_agent_reference/ patterns with proper environment setup
5. Implement backend in `apps/api/src/` with Iraqi specialization
6. Create frontend in `apps/web/src/` with RTL support
7. Add shared logic in `packages/features/` for mobile readiness
8. **Test thoroughly**: Unit tests, cultural validation, Arabic text handling
9. Update documentation with Iraqi-specific examples

**Available Examples & References**:
- `examples/basic_chat_agent/` - Simple conversational agent patterns
- `examples/main_agent_reference/` - Production-grade agent architecture
- `examples/tool_enabled_agent/` - Agent with external tools integration
- `examples/structured_output_agent/` - Professional report generation
- `examples/testing_examples/` - Comprehensive agent testing patterns

# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.