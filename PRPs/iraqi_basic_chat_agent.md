---
name: "Iraqi AI Basic Chat Agent - PydanticAI Implementation"
description: "Comprehensive PRP for building a culturally-aware PydanticAI chat agent for Iraqi users with dialect processing, Islamic values integration, and professional domain expertise"
---

## Purpose

Build a production-ready PydanticAI chat agent specifically designed for Iraqi users that understands Iraqi Arabic dialect, respects Islamic values, provides culturally appropriate responses, and offers professional domain expertise while maintaining privacy-first architecture with session-only data handling.

## Core Principles

1. **PydanticAI Best Practices**: Deep integration with PydanticAI 2025 patterns for agent creation, dependency injection, and tool integration
2. **Iraqi Cultural Authenticity**: Authentic Iraqi dialect processing, Islamic values integration, and regional cultural awareness
3. **Professional Boundaries**: Clear ethical boundaries for legal, medical, educational, and engineering advice with appropriate disclaimers
4. **Privacy-First Architecture**: Session-only conversation memory with automatic 1-hour data expiration
5. **Type Safety & Validation**: Leverage PydanticAI's type-safe design and comprehensive input/output validation

## ⚠️ Implementation Guidelines: Focus on Cultural Integration

**IMPORTANT**: This agent must balance technical excellence with authentic Iraqi cultural context.

### What NOT to do:
- ❌ **Don't ignore cultural validation** - Every response must be culturally appropriate
- ❌ **Don't use generic Arabic** - Focus specifically on Iraqi dialect and customs
- ❌ **Don't bypass professional boundaries** - Maintain clear ethical guidelines
- ❌ **Don't store persistent user data** - Strict session-only privacy compliance
- ❌ **Don't assume Western cultural norms** - Adapt all interactions for Iraqi context

### What TO do:
- ✅ **Validate cultural appropriateness** - Use existing cultural validators from codebase
- ✅ **Process Iraqi dialect** - Recognize and respond with appropriate Iraqi vocabulary
- ✅ **Respect Islamic values** - Integrate religious sensitivity without compromising functionality
- ✅ **Maintain professional ethics** - Provide guidance while avoiding specific advice
- ✅ **Protect user privacy** - Implement session-only data handling with automatic expiration

### Key Question:
**"Does this response respect Iraqi cultural values and maintain appropriate professional boundaries?"**

---

## Goal

Create an intelligent PydanticAI chat agent that serves as the primary conversational interface for the Iraqi AI Chat System, capable of:
- Understanding and responding in Iraqi Arabic dialect with cultural authenticity
- Providing professional guidance across legal, medical, educational, and engineering domains
- Maintaining Islamic values integration while serving diverse users
- Switching seamlessly between Arabic and English based on user preferences
- Protecting user privacy with session-only conversation memory

## Why

Iraqi professionals and general users need an AI assistant that understands their unique cultural context, linguistic patterns, and professional requirements. Existing generic AI systems lack the cultural sensitivity, dialect processing, and professional domain knowledge specific to Iraqi users. This agent fills that gap by providing culturally authentic, professionally appropriate, and privacy-compliant AI assistance.

## What

### Agent Type Classification
- [x] **Chat Agent**: Conversational interface with Iraqi cultural context and memory
- [x] **Tool-Enabled Agent**: External tools for cultural validation and professional context

### Model Provider Requirements
- [x] **OpenAI**: `openai:gpt-4o` (primary) or `openai:gpt-4o-mini` (fallback)
- [ ] **Anthropic**: `anthropic:claude-3-5-sonnet-20241022` (secondary fallback)
- [x] **Fallback Strategy**: Multiple provider support with cultural context preservation

### External Integrations
- [x] **Cultural Validation Services**: Iraqi cultural appropriateness validation
- [x] **Arabic NLP Processing**: Iraqi dialect recognition and response adaptation
- [x] **Professional Knowledge Integration**: Domain-specific guidance systems
- [x] **Content Moderation**: Iraqi cultural and religious sensitivity filtering
- [x] **Session Management**: Privacy-compliant conversation context handling

### Success Criteria
- [x] Agent successfully handles Iraqi dialect conversations with cultural authenticity
- [x] All cultural validation tools work correctly with comprehensive sensitivity checking
- [x] Professional boundaries maintained across all domains (legal, medical, educational, engineering)
- [x] Comprehensive test coverage with Iraqi-specific scenarios and cultural validation
- [x] Privacy compliance implemented (session-only data, automatic expiration)
- [x] Seamless Arabic-English code switching based on user preferences

## All Needed Context

### PydanticAI Documentation & Research

```yaml
# ESSENTIAL PYDANTIC AI DOCUMENTATION - Researched and Validated
- url: https://ai.pydantic.dev/
  why: Official PydanticAI documentation with comprehensive patterns
  content: Agent creation, model providers, dependency injection, tool integration
  findings: |
    - Simple agent creation in 5 lines, model-agnostic architecture
    - Type safety with Pydantic validation for structured outputs
    - Dependency injection system for external services
    - @agent.tool decorators for context-aware tool integration
    - TestModel/FunctionModel for comprehensive testing

- url: https://ai.pydantic.dev/agents/
  why: Agent architecture and configuration patterns
  content: System prompts, dependency injection, tool integration
  findings: |
    - System prompts can be static strings or dynamic functions
    - Dependency injection through deps_type parameter
    - Tool integration with RunContext for accessing dependencies
    - Agent composition patterns for complex workflows

- url: https://ai.pydantic.dev/tools/
  why: Tool integration patterns and function registration
  content: @agent.tool decorators, parameter validation, error handling
  findings: |
    - @agent.tool for context-aware tools with RunContext[DepsType]
    - @agent.tool_plain for simple tools without context dependencies
    - Automatic parameter validation with Pydantic models
    - Tool documentation generation for LLM understanding

- url: https://ai.pydantic.dev/testing/
  why: Testing strategies specific to PydanticAI agents
  content: TestModel, FunctionModel, Agent.override(), pytest patterns
  findings: |
    - TestModel for rapid development validation without API costs
    - FunctionModel for custom behavior testing and controlled responses
    - Agent.override() for test isolation and model replacement
    - Comprehensive testing patterns for tool validation

- url: https://ai.pydantic.dev/models/
  why: Model provider configuration and authentication
  content: OpenAI, Anthropic, Gemini setup, API key management
  findings: |
    - Model-agnostic architecture supporting multiple providers
    - Environment-based API key management with security best practices
    - Provider-specific configuration and fallback strategies
    - Streaming support and real-time response processing
```

### Codebase Analysis - Existing Patterns

```yaml
# Iraqi Cultural Integration Patterns (Validated from examples/)
cultural_validation:
  source: examples/cultural-validation/cultural-appropriateness-scorer.py
  patterns: |
    - IraqiCulturalValidator with comprehensive sensitivity checking
    - Political/sectarian content filtering with Iraqi context
    - Religious appropriateness validation with Islamic principles
    - Professional title and etiquette validation
    - Regional Iraqi dialect recognition and cultural markers
  integration: Direct import and integration into agent dependencies

content_moderation:
  source: examples/content-filtering/arabic-content-moderator.py
  patterns: |
    - IraqiContentModerator with advanced filtering capabilities
    - Multi-category content analysis (political, sectarian, tribal, profanity)
    - Severity level assessment with confidence scoring
    - Cultural sensitivity patterns and keyword detection
    - Professional context awareness and suggestion generation
  integration: Tool integration for real-time content validation

professional_etiquette:
  source: examples/professional-etiquette/iraqi-business-protocols.py
  patterns: |
    - IraqiBusinessEtiquetteManager for professional domain expertise
    - Professional title systems with gender and context variants
    - Business protocol templates for different interaction contexts
    - Cultural communication guidelines and timing protocols
    - Professional boundary validation and suggestion systems
  integration: Professional context tool for domain-specific interactions

agent_architecture:
  source: examples/basic_chat_agent/agent.py + examples/main_agent_reference/
  patterns: |
    - Environment-based configuration with pydantic-settings
    - ConversationContext dataclass for session management
    - Dynamic system prompts with context injection
    - Model provider abstraction with get_llm_model()
    - Testing patterns with TestModel/FunctionModel integration
  integration: Foundation architecture for Iraqi cultural adaptation

testing_patterns:
  source: examples/testing_examples/test_agent_patterns.py
  patterns: |
    - Comprehensive pytest fixtures and async testing
    - TestModel integration for rapid development validation
    - FunctionModel for custom behavior testing
    - Agent.override() for test isolation
    - Tool validation with mock dependencies
  integration: Testing framework for Iraqi-specific scenarios
```

### Arabic NLP & Cultural Research

```yaml
# Arabic NLP Libraries Integration (Researched 2025)
arabic_processing:
  libraries: |
    - CAMeL Tools: Comprehensive Arabic NLP with dialect identification
    - Farasa: State-of-the-art full-stack Arabic processing from QCRI
    - Yarub Library: Open-source Arabic NLP for morphological analysis
    - PyArabic + NLTK: Basic Arabic text processing and stemming
  iraqi_dialect: |
    - DART dataset includes Iraqi dialect annotations (25K tweets)
    - Limited specific Iraqi dialect resources available
    - General dialectal processing tools applicable with adaptation
  rtl_processing: |
    - Right-to-left script handling requirements
    - Special typography and rendering considerations
    - CSS frameworks and Python libraries for RTL text support

cultural_sensitivity:
  islamic_values: |
    - Religious context understanding critical for appropriate responses
    - Islamic expressions and courtesy phrases integration
    - Avoiding conflicts with religious principles and cultural norms
  iraqi_context: |
    - Regional variations (Baghdad, Basra, Kurdistan) awareness
    - Professional domain expertise for Iraqi systems and standards
    - Political and sectarian sensitivity with content filtering
  ai_challenges: |
    - Western-biased AI responses inappropriate for Iraqi cultural context
    - Limited Arabic training data compared to other languages
    - Need for culturally sensitive and representative training approaches
```

### Security and Production Considerations

```yaml
# PydanticAI Security Patterns (Implemented)
security_requirements:
  api_management:
    environment_variables: ["LLM_API_KEY", "OPENAI_API_KEY", "ANTHROPIC_API_KEY"]
    secure_storage: "Environment-based configuration with .env files"
    rotation_strategy: "API key rotation support with provider fallback"
  
  input_validation:
    sanitization: "Comprehensive input validation with Pydantic models"
    cultural_filtering: "Iraqi cultural sensitivity validation for all inputs"
    prompt_injection: "Multi-layer prompt injection prevention strategies"
  
  output_security:
    cultural_validation: "All responses validated for Iraqi cultural appropriateness"
    content_filtering: "Real-time content moderation with Iraqi context"
    privacy_compliance: "Session-only data handling with automatic expiration"

privacy_architecture:
  session_management: |
    - Session-only conversation memory with 1-hour automatic expiration
    - No persistent user data storage beyond session requirements
    - Privacy-compliant context retention with intelligent summarization
  data_protection: |
    - Iraqi data protection law compliance considerations
    - Islamic privacy principles integration
    - User consent and transparency in data handling
```

## Implementation Blueprint

### Technology Research Phase ✅ COMPLETED

**PydanticAI Framework Mastery:**
- [x] Agent creation patterns: Simple initialization, dependency injection, model configuration
- [x] Model provider configuration: OpenAI integration, fallback strategies, environment management
- [x] Tool integration patterns: @agent.tool decorators, RunContext usage, parameter validation
- [x] Dependency injection system: Type-safe external service integration
- [x] Testing strategies: TestModel development validation, FunctionModel custom behavior testing

**Iraqi Cultural Integration Research:**
- [x] Cultural validation systems: IraqiCulturalValidator integration from existing codebase
- [x] Content moderation: IraqiContentModerator with political/sectarian/tribal sensitivity
- [x] Professional etiquette: IraqiBusinessEtiquetteManager for domain expertise
- [x] Arabic NLP integration: CAMeL Tools, Farasa, dialect processing libraries
- [x] Islamic values integration: Religious appropriateness without compromising functionality

**Security and Production Patterns:**
- [x] Environment-based API key management with secure configuration
- [x] Cultural input validation and prompt injection prevention
- [x] Privacy-first architecture with session-only data handling
- [x] Content filtering and cultural sensitivity validation
- [x] Professional boundary enforcement with appropriate disclaimers

### Agent Implementation Plan

```yaml
Implementation Task 1 - Iraqi Agent Foundation:
  CREATE agent project structure in apps/api/agents/iraqi_chat_agent/:
    - settings.py: Environment configuration with Iraqi cultural context settings
    - providers.py: Model provider abstraction with OpenAI integration
    - agent.py: Main Iraqi chat agent with cultural system prompt
    - dependencies.py: Iraqi cultural validators and professional context managers
    - models.py: Iraqi conversation models and cultural validation schemas
    - tools.py: Cultural validation, dialect processing, and professional context tools
    - tests/: Comprehensive testing with Iraqi-specific scenarios

Implementation Task 2 - Cultural Context Integration:
  IMPLEMENT Iraqi cultural awareness in agent.py:
    - System prompt with Iraqi cultural identity and Islamic values
    - Professional domain awareness (legal, medical, educational, engineering)
    - Regional adaptation (Baghdad, Basra, Kurdistan) capability
    - Arabic-English code switching based on user preferences
    - Privacy-first conversation context with session management

Implementation Task 3 - Tool Development:
  DEVELOP cultural and professional tools in tools.py:
    - cultural_validation_tool: Using IraqiCulturalValidator from examples
    - content_moderation_tool: Using IraqiContentModerator for sensitivity checking
    - professional_context_tool: Using IraqiBusinessEtiquetteManager for domain expertise
    - dialect_recognition_tool: Iraqi Arabic dialect detection and response adaptation
    - session_management_tool: Privacy-compliant conversation context handling

Implementation Task 4 - Dependencies and Models:
  CREATE Iraqi-specific dependencies and models:
    - IraqiAgentDependencies: Cultural validators, professional context managers
    - ConversationContext: Session management with Iraqi cultural markers
    - CulturalResponse: Structured responses with cultural validation metadata
    - Professional validation models for legal/medical/educational/engineering domains

Implementation Task 5 - Comprehensive Testing:
  IMPLEMENT Iraqi-specific testing suite:
    - TestModel integration for rapid cultural validation development
    - Iraqi conversation scenarios with dialect and cultural appropriateness testing
    - Professional boundary testing for each domain with ethical validation
    - Arabic-English code switching validation with linguistic accuracy testing
    - Privacy compliance testing with session-only data handling verification

Implementation Task 6 - Production Integration:
  SETUP production-ready deployment:
    - FastAPI integration with existing backend structure
    - React frontend RTL text support and cultural UI components
    - Credit consumption tracking for AI agent usage
    - Monitoring and logging with cultural decision tracking
    - Performance optimization for Arabic text processing
```

### Detailed Agent Architecture

```python
# Agent Structure Preview (Implementation Reference)
from dataclasses import dataclass
from typing import Optional
from pydantic_ai import Agent, RunContext
from examples.cultural_validation.cultural_appropriateness_scorer import IraqiCulturalValidator
from examples.content_filtering.arabic_content_moderator import IraqiContentModerator
from examples.professional_etiquette.iraqi_business_protocols import IraqiBusinessEtiquetteManager

@dataclass
class IraqiAgentDependencies:
    """Dependencies for Iraqi AI chat agent."""
    cultural_validator: IraqiCulturalValidator
    content_moderator: IraqiContentModerator
    etiquette_manager: IraqiBusinessEtiquetteManager
    user_session_id: str
    preferred_language: str = "arabic"
    professional_context: Optional[str] = None
    regional_context: str = "general"  # baghdad, basra, kurdistan, general

IRAQI_SYSTEM_PROMPT = """
أنت مساعد ذكي مخصص للمستخدمين العراقيين. You are an AI assistant designed specifically for Iraqi users.

شخصيتك وهويتك الثقافية:
- تفهم الثقافة العراقية والعادات المحلية بعمق
- تحترم القيم الإسلامية والتقاليد الدينية
- تستخدم اللهجة العراقية بشكل طبيعي ومناسب
- تقدر التنوع الإقليمي في العراق (بغداد، البصرة، كردستان)

Your Cultural Identity:
- Deep understanding of Iraqi culture and local customs
- Respect for Islamic values and religious traditions  
- Natural use of Iraqi dialect when appropriate
- Appreciation for regional diversity across Iraq

المبادئ المهنية:
- تقدم إرشادات مهنية مفيدة دون تجاوز الحدود الأخلاقية
- تتجنب تقديم استشارات قانونية أو طبية محددة
- تحافظ على حدود مهنية واضحة مع كل المجالات
- تشجع المراجعة المهنية المتخصصة عند الحاجة

Professional Principles:
- Provide helpful professional guidance without crossing ethical boundaries
- Avoid specific legal or medical advice
- Maintain clear professional boundaries across all domains
- Encourage specialized professional consultation when needed

الخصوصية والأمان:
- تحتفظ بالمحادثات في إطار الجلسة فقط
- تحترم خصوصية المستخدمين وفقاً للمبادئ الإسلامية
- لا تحتفظ بأي بيانات شخصية بعد انتهاء الجلسة

Privacy and Security:
- Maintain conversations within session scope only
- Respect user privacy according to Islamic principles
- No personal data retention after session ends
"""

iraqi_chat_agent = Agent(
    get_llm_model(),  # From providers.py
    deps_type=IraqiAgentDependencies,
    system_prompt=IRAQI_SYSTEM_PROMPT
)

@iraqi_chat_agent.tool
async def cultural_validation_tool(
    ctx: RunContext[IraqiAgentDependencies], 
    content: str
) -> str:
    """Validate content for Iraqi cultural appropriateness."""
    result = ctx.deps.cultural_validator.validate_content(
        content, 
        context={'profession': ctx.deps.professional_context}
    )
    
    if result.level.value == "inappropriate":
        return f"Content requires cultural adjustment: {result.suggestions[0] if result.suggestions else 'Please review for cultural sensitivity'}"
    
    return f"Content is culturally appropriate (score: {result.score:.2f})"

@iraqi_chat_agent.tool
async def professional_context_tool(
    ctx: RunContext[IraqiAgentDependencies],
    user_message: str,
    professional_domain: str
) -> str:
    """Provide professional context guidance for Iraqi domains."""
    validation = ctx.deps.etiquette_manager.validate_business_communication(
        user_message,
        context=BusinessContext.CONSULTATION,
        profession=ProfessionType(professional_domain)
    )
    
    if not validation.is_appropriate:
        return f"Professional guidance: {validation.suggestions[0]}"
    
    # Get cultural tips for the profession
    tips = ctx.deps.etiquette_manager.get_cultural_tips_for_profession(
        ProfessionType(professional_domain)
    )
    
    return f"Professional context provided. {tips.get('do', [])[0] if tips.get('do') else 'Professional standards maintained.'}"
```

## Validation Loop

### Level 1: Cultural Foundation Validation

```bash
# Verify Iraqi cultural integration
python -c "
from apps.api.agents.iraqi_chat_agent.agent import iraqi_chat_agent
from apps.api.agents.iraqi_chat_agent.dependencies import IraqiAgentDependencies
from examples.cultural_validation.cultural_appropriateness_scorer import IraqiCulturalValidator
from examples.content_filtering.arabic_content_moderator import IraqiContentModerator
from examples.professional_etiquette.iraqi_business_protocols import IraqiBusinessEtiquetteManager

# Test cultural validator integration
validator = IraqiCulturalValidator()
moderator = IraqiContentModerator()
etiquette = IraqiBusinessEtiquetteManager()

deps = IraqiAgentDependencies(
    cultural_validator=validator,
    content_moderator=moderator,
    etiquette_manager=etiquette,
    user_session_id='test_session'
)

print('Iraqi cultural dependencies loaded successfully')
print(f'Cultural validator: {type(deps.cultural_validator).__name__}')
print(f'Content moderator: {type(deps.content_moderator).__name__}')
print(f'Etiquette manager: {type(deps.etiquette_manager).__name__}')
"

# Expected: All Iraqi cultural components loaded, dependencies configured
# If failing: Check import paths and cultural component initialization
```

### Level 2: Agent Cultural Response Validation

```bash
# Test agent with Iraqi cultural scenarios
python -c "
from pydantic_ai.models.test import TestModel
from apps.api.agents.iraqi_chat_agent.agent import iraqi_chat_agent
from apps.api.agents.iraqi_chat_agent.dependencies import create_iraqi_dependencies

test_model = TestModel()
deps = create_iraqi_dependencies('test_session')

# Test Iraqi greeting
with iraqi_chat_agent.override(model=test_model):
    result = iraqi_chat_agent.run_sync('شلونك؟ شكو ماكو؟', deps=deps)
    print(f'Iraqi greeting response: {result.data[:100]}...')
    
# Test professional context
with iraqi_chat_agent.override(model=test_model):
    result = iraqi_chat_agent.run_sync('أريد استشارة قانونية', deps=deps)
    print(f'Legal consultation response: {result.data[:100]}...')
"

# Expected: Agent responds appropriately to Iraqi dialect and professional requests
# If failing: Debug system prompt and cultural tool integration
```

### Level 3: Cultural Validation Tools Testing

```bash
# Test cultural validation tools
python -c "
from pydantic_ai.models.test import TestModel
from apps.api.agents.iraqi_chat_agent.agent import iraqi_chat_agent
from apps.api.agents.iraqi_chat_agent.dependencies import create_iraqi_dependencies

test_model = TestModel()
deps = create_iraqi_dependencies('test_session')

# Test cultural validation tool
with iraqi_chat_agent.override(model=test_model):
    result = iraqi_chat_agent.run_sync(
        'يسقط الحكومة الفاسدة',  # Political content test
        deps=deps
    )
    print(f'Political content handling: {result.data[:150]}...')

# Test professional context tool
with iraqi_chat_agent.override(model=test_model):
    result = iraqi_chat_agent.run_sync(
        'السلام عليكم دكتور، أحتاج مساعدة طبية',
        deps=deps
    )
    print(f'Medical context handling: {result.data[:150]}...')
"

# Expected: Cultural validation catches inappropriate content, professional context maintained
# If failing: Debug tool implementation and cultural logic
```

### Level 4: Comprehensive Iraqi Scenario Testing

```bash
# Run complete Iraqi cultural test suite
cd apps/api/agents/iraqi_chat_agent/
python -m pytest tests/ -v

# Test specific Iraqi scenarios
python -m pytest tests/test_iraqi_cultural_scenarios.py::test_dialect_recognition -v
python -m pytest tests/test_iraqi_cultural_scenarios.py::test_professional_boundaries -v
python -m pytest tests/test_iraqi_cultural_scenarios.py::test_islamic_values_integration -v
python -m pytest tests/test_iraqi_cultural_scenarios.py::test_privacy_compliance -v

# Expected: All Iraqi cultural scenarios pass with comprehensive validation
# If failing: Fix cultural logic based on specific scenario failures
```

### Level 5: Production Integration Validation

```bash
# Verify FastAPI integration
curl -X POST "http://localhost:8000/api/chat/iraqi" \
  -H "Content-Type: application/json" \
  -d '{"message": "شلونك؟ شكو ماكو؟", "session_id": "test_session"}'

# Test Arabic RTL frontend integration
curl -X POST "http://localhost:8000/api/chat/iraqi" \
  -H "Content-Type: application/json" \
  -d '{"message": "أريد مساعدة في موضوع قانوني", "session_id": "test_session", "language": "arabic"}'

# Expected: API responds with culturally appropriate Iraqi responses, RTL formatting
# If failing: Debug API integration and response formatting
```

## Final Validation Checklist

### Iraqi Cultural Integration Completeness

- [ ] Complete Iraqi agent project structure with cultural dependencies
- [ ] Cultural validation tools integrated from existing codebase examples
- [ ] Iraqi dialect recognition and appropriate response generation
- [ ] Professional boundary enforcement for all Iraqi professional domains
- [ ] Islamic values integration without compromising functionality
- [ ] Regional awareness (Baghdad, Basra, Kurdistan) in responses
- [ ] Privacy-first architecture with session-only data handling

### PydanticAI Best Practices Implementation

- [ ] Type safety throughout with comprehensive Iraqi cultural validation
- [ ] Security patterns implemented (API keys, cultural input validation, content moderation)
- [ ] Error handling and retry mechanisms for cultural and professional tools
- [ ] Async/sync patterns consistent with PydanticAI requirements
- [ ] Comprehensive testing with TestModel and Iraqi-specific scenarios

### Production Readiness for Iraqi Context

- [ ] Environment configuration with Iraqi cultural context settings
- [ ] Cultural decision logging and monitoring for Iraqi appropriateness
- [ ] Performance optimization for Arabic text processing and RTL display
- [ ] FastAPI integration with React frontend RTL support
- [ ] Credit consumption tracking and Iraqi market payment gateway compatibility

---

## Anti-Patterns to Avoid

### Iraqi Cultural Development

- ❌ Don't ignore cultural validation - Every response must pass Iraqi cultural appropriateness checks
- ❌ Don't use generic Arabic responses - Focus specifically on Iraqi dialect and customs
- ❌ Don't bypass Islamic values integration - Respectful religious context is mandatory
- ❌ Don't store cultural preferences permanently - Session-only cultural context handling
- ❌ Don't assume uniform Iraqi culture - Account for regional variations and professional contexts

### Professional Boundary Management

- ❌ Don't provide specific legal advice - Maintain clear professional boundaries with disclaimers
- ❌ Don't diagnose medical conditions - Offer general guidance with professional referral suggestions
- ❌ Don't bypass professional etiquette - Use IraqiBusinessEtiquetteManager for all professional interactions
- ❌ Don't ignore domain-specific cultural norms - Each profession has unique Iraqi cultural expectations

### Privacy and Security

- ❌ Don't store conversation history beyond session - Strict session-only privacy compliance
- ❌ Don't log sensitive cultural preferences - Privacy-compliant cultural context handling
- ❌ Don't expose cultural validation logic - Keep cultural decision-making processes internal
- ❌ Don't compromise on content moderation - All responses must pass Iraqi cultural sensitivity checks

**IMPLEMENTATION STATUS: READY FOR EXECUTION** - Comprehensive research completed, architecture designed, validation strategy defined.