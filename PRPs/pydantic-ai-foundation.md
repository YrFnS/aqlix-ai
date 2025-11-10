---
name: "PydanticAI Agent Foundation for Iraqi AI Chat System"
description: "Comprehensive PRP for implementing 21 specialized Iraqi AI agents with PydanticAI framework, cultural intelligence, and Arabic language processing"
initial_file: "initials/20_pydantic_ai_setup.md"
complexity: "Advanced"
created: "2025-11-09"
---

## Purpose

Build a comprehensive PydanticAI agent foundation system with 21 specialized Iraqi AI agents, reusable agent templates and base classes, cultural intelligence framework, Arabic language processing capabilities, and professional domain expertise for scalable Iraqi AI system architecture.

## Core Principles

1. **PydanticAI Best Practices**: Deep integration with PydanticAI patterns for agent creation, tools, and structured outputs following official framework guidelines
2. **Production Ready**: Include security, testing, monitoring, and error handling for production deployments
3. **Type Safety First**: Leverage PydanticAI's type-safe design and Pydantic validation throughout the entire system
4. **Cultural Intelligence**: 95%+ cultural appropriateness and 100% Islamic compliance in all agent behaviors
5. **Comprehensive Testing**: Use TestModel and FunctionModel for thorough agent validation with measurable metrics

## ⚠️ Implementation Guidelines: Follow Proven Patterns

**IMPORTANT**: Build on the established patterns from `examples/main_agent_reference/` and `examples/pydantic-ai-agents-extracted/`. Don't reinvent proven architecture.

### What TO do:

- ✅ **Follow main_agent_reference pattern** - Use the proven research_agent.py structure
- ✅ **Use get_llm_model() abstraction** - Never hardcode model strings like "openai:gpt-4o"
- ✅ **Environment-based configuration** - Settings with pydantic-settings for all config
- ✅ **Default to string output** - Only add result_type when structured validation is required
- ✅ **Dataclass dependencies** - Use dataclasses for dependency injection
- ✅ **Test early with TestModel** - Validate agent behavior during development

### What NOT to do:

- ❌ **Don't hardcode model names** - Always use providers.py abstraction
- ❌ **Don't skip cultural validation** - Every agent must have 95%+ cultural appropriateness
- ❌ **Don't over-engineer dependencies** - Keep them simple and focused
- ❌ **Don't add structured output unnecessarily** - Default to string responses
- ❌ **Don't skip testing** - All agents need comprehensive test coverage

### Key Question for Every Agent:

**"Does this agent follow the main_agent_reference pattern and meet Iraqi cultural requirements?"**

If the answer is no, refactor to align with proven patterns.

---

## Goal

Create a production-ready PydanticAI agent foundation that:

1. **Provides 21 Specialized Iraqi AI Agents** with cultural intelligence and professional domain expertise
2. **Implements Reusable Agent Templates** with base classes, mixins, and inheritance patterns
3. **Enables Multi-Agent Coordination** with intelligent routing and context sharing (35% performance improvement)
4. **Ensures Cultural Compliance** with 95%+ cultural appropriateness and 100% Islamic compliance validation
5. **Supports Arabic Language Processing** with RTL support and Iraqi dialect recognition (85%+ accuracy)
6. **Integrates Professional Domains** for Iraqi legal, medical, educational, and business expertise
7. **Maintains Type Safety** throughout the entire agent ecosystem with comprehensive validation

## Why

**Problem**: Building culturally-aware AI agents for Iraqi users requires specialized knowledge of PydanticAI framework, Iraqi cultural intelligence, Arabic language processing, Islamic compliance validation, and professional domain integration. The current system needs a comprehensive agent foundation to support scalable Iraqi AI development.

**Solution**: Implement a complete PydanticAI agent foundation with 21 specialized agents, reusable templates, cultural intelligence framework, and multi-agent coordination to enable production-ready Iraqi AI applications.

**Value**:
- **35% Performance Improvement**: Through intelligent context management and agent coordination
- **95%+ Cultural Appropriateness**: Validated Iraqi cultural compliance across all agents
- **100% Islamic Compliance**: Full adherence to Islamic principles in all agent behaviors
- **85%+ Dialect Recognition**: Accurate Iraqi Arabic dialect processing
- **Scalable Architecture**: Reusable patterns supporting unlimited agent expansion

## What

### Agent Type Classification

The Iraqi AI agent system consists of 21 specialized agents across 6 categories:

- [x] **Cultural Intelligence Agents (3)**: iraqi-cultural-validator, iraqi-cultural-tester, arabic-rtl-processor
- [x] **Professional Domain Agents (3)**: iraqi-business-analyst, iraqi-professional-domain-expert, iraqi-product-manager
- [x] **Technical Implementation Agents (3)**: iraqi-ai-agent-architect, iraqi-technical-debugger, iraqi-devops-engineer
- [x] **UI/UX Design Agents (4)**: iraqi-ui-designer, iraqi-ux-researcher, iraqi-interaction-designer, iraqi-accessibility-specialist
- [x] **Security & Payment Agents (3)**: iraqi-security-specialist, iraqi-payment-tester, payment-security-guardian
- [x] **System Coordination Agents (5)**: iraqi-workflow-orchestrator, iraqi-context-manager, iraqi-prp-execution-orchestrator, external-service-coordinator, app-documentation-tracker

### Model Provider Requirements

Following the established provider pattern from `examples/pydantic-ai-agents-extracted/core/providers.py`:

- [x] **Primary Models**: OpenAI GPT-4, Anthropic Claude Sonnet, Google Gemini
- [x] **Fallback Strategy**: Intelligent multi-provider fallback with performance tracking
- [x] **Model Abstraction**: `get_llm_model()` function with cultural context awareness
- [x] **Performance Monitoring**: Track cultural accuracy, Islamic compliance, Arabic processing for each model
- [x] **Never Hardcode Models**: Always use providers.py abstraction

### External Integrations

Based on Iraqi AI system requirements:

- [x] **Database**: Supabase for agent context persistence and real-time updates
- [x] **Cultural Services**: Iraqi cultural validation and Islamic compliance services
- [x] **Payment Gateways**: ZainCash, FastPay, NassWallet integration through payment agents
- [x] **Arabic Processing**: RTL text handling and Iraqi dialect recognition
- [x] **Professional Services**: Iraqi legal, medical, educational database integration
- [x] **Monitoring**: Sentry for agent performance tracking and error handling

### Success Criteria

- [x] All 21 agents successfully instantiate with proper PydanticAI configuration
- [x] Agent tools work correctly with proper error handling and retry mechanisms
- [x] Cultural validation achieves 95%+ appropriateness across all agents
- [x] Islamic compliance validation maintains 100% adherence
- [x] Arabic processing achieves 85%+ Iraqi dialect recognition accuracy
- [x] Comprehensive test coverage with TestModel and FunctionModel
- [x] Performance meets requirements (<200ms cultural validation, <300ms multi-agent workflows)
- [x] Security measures implemented (API keys, input validation, rate limiting)

## All Needed Context

### PydanticAI Documentation & Research (COMPLETED)

```yaml
# ESSENTIAL PYDANTIC AI DOCUMENTATION - Thoroughly researched

core_framework:
  - url: https://ai.pydantic.dev/
    content: Official PydanticAI documentation with getting started guide
    key_findings: |
      - Type-safe agent framework with FastAPI philosophy
      - Model-agnostic supporting OpenAI, Anthropic, Google, and others
      - Dependency injection via RunContext for type-safe context passing
      - Structured outputs with Pydantic validation
      - Observability through Pydantic Logfire integration

  - url: https://ai.pydantic.dev/agents/
    content: Comprehensive agent architecture and configuration patterns
    key_findings: |
      - Basic agent: Agent('anthropic:claude-sonnet-4-0', instructions='Be concise')
      - Advanced pattern: deps_type for dependency injection
      - @agent.tool decorator for context-aware tools
      - @agent.instructions for dynamic prompts
      - result_type for structured output (only when validation needed)

  - url: https://ai.pydantic.dev/tools/
    content: Tool integration patterns and function registration
    key_findings: |
      - @agent.tool with RunContext[DepsType] for dependency access
      - Tool functions as pure functions callable independently
      - Proper error handling and logging in tool implementations
      - Dependency injection through RunContext.deps

  - url: https://ai.pydantic.dev/testing/
    content: Testing strategies specific to PydanticAI agents
    key_findings: |
      - TestModel for rapid development validation (deterministic data generation)
      - FunctionModel for custom behavior testing (context-aware responses)
      - Agent.override() for test isolation without modifying call sites
      - pytest patterns with async support via pytest.mark.anyio
      - capture_run_messages() for inspecting agent-model exchange

  - url: https://ai.pydantic.dev/models/
    content: Model provider configuration and authentication
    key_findings: |
      - OpenAI, Anthropic, Gemini setup with API key management
      - Fallback models for production resilience
      - Never hardcode model strings - use abstraction layer

  - url: https://ai.pydantic.dev/dependencies/
    content: Dependency injection patterns and RunContext usage
    key_findings: |
      - Use dataclasses as dependency containers
      - Specify deps_type parameter in Agent initialization (pass TYPE not instance)
      - Access dependencies via RunContext[DepsType] in tools and prompts
      - Agent.override(deps=test_instance) for testing
      - Supports both async and sync dependencies

multi_agent_patterns:
  - url: https://ai.pydantic.dev/multi-agent-applications/
    content: Multi-agent coordination and communication strategies
    key_findings: |
      - Agent Delegation: Parent agents invoke delegate agents through tools
      - Programmatic Hand-off: Application code orchestrates sequential agent calls
      - Graph-Based Control Flow: State machines for complex multi-agent scenarios
      - Dependency Sharing: Delegate agents need same or subset of parent dependencies
      - Usage Tracking: Pass ctx.usage to aggregate metrics across agent chains
      - UsageLimits enforcement to prevent runaway costs
```

### Codebase Reference Patterns (ANALYZED)

```yaml
# EXISTING PATTERNS - Thoroughly analyzed from codebase

main_agent_reference:
  path: examples/main_agent_reference/research_agent.py
  architecture_pattern: |
    1. CONFIGURATION LAYER:
       - settings.py: Environment-based config with pydantic-settings
       - providers.py: Model provider abstraction with get_llm_model()
       - Never hardcode model strings

    2. AGENT DEFINITION:
       - Use get_llm_model() for model configuration
       - System prompt as string constant or function
       - Dependency injection with dataclass
       - NO result_type unless structured output specifically needed
       - @agent.tool decorators with RunContext[DepsType]

    3. DEPENDENCY PATTERN:
       @dataclass
       class ResearchAgentDependencies:
           brave_api_key: str
           gmail_credentials_path: str
           session_id: Optional[str] = None

    4. TOOL PATTERN:
       @research_agent.tool
       async def search_web(
           ctx: RunContext[ResearchAgentDependencies],
           query: str,
           max_results: int = 10
       ) -> List[Dict[str, Any]]:
           # Use ctx.deps to access dependencies
           results = await search_web_tool(
               api_key=ctx.deps.brave_api_key,
               query=query,
               count=max_results
           )
           return results

    5. MULTI-AGENT DELEGATION:
       # Create delegate agent dependencies
       email_deps = EmailAgentDependencies(
           gmail_credentials_path=ctx.deps.gmail_credentials_path,
           session_id=ctx.deps.session_id
       )
       # Run delegate agent with usage tracking
       result = await email_agent.run(
           prompt,
           deps=email_deps,
           usage=ctx.usage  # Pass usage for token tracking
       )

iraqi_agent_settings:
  path: examples/pydantic-ai-agents-extracted/core/settings.py
  pattern: |
    class IraqiAgentSettings(BaseSettings):
        # Core configuration
        agent_name: str
        debug_mode: bool

        # Model providers (environment variables)
        openai_api_key: Optional[str] = Field(None, env="OPENAI_API_KEY")
        anthropic_api_key: Optional[str] = Field(None, env="ANTHROPIC_API_KEY")

        # Iraqi cultural configuration
        cultural_mode: IraqiCulturalMode = Field(IraqiCulturalMode.STRICT)
        islamic_compliance_level: IslamicComplianceLevel = Field(IslamicComplianceLevel.FULL)
        arabic_processing_mode: ArabicProcessingMode = Field(ArabicProcessingMode.MIXED)

        # Cultural thresholds
        min_cultural_appropriateness: float = Field(0.95, ge=0.0, le=1.0)
        min_islamic_compliance: float = Field(1.0, ge=0.0, le=1.0)
        min_arabic_accuracy: float = Field(0.99, ge=0.0, le=1.0)

        # Validators ensure cultural compliance
        @validator("min_cultural_appropriateness")
        def validate_cultural_threshold(cls, v, values):
            cultural_mode = values.get("cultural_mode")
            if cultural_mode == IraqiCulturalMode.STRICT and v < 0.95:
                raise ValueError("Strict mode requires ≥95% appropriateness")
            return v

iraqi_model_provider:
  path: examples/pydantic-ai-agents-extracted/core/providers.py
  pattern: |
    class IraqiModelProvider:
        """Intelligent model provider with cultural context awareness"""

        def _initialize_providers(self):
            # OpenAI
            self.providers["openai:gpt-4"] = OpenAIModel("gpt-4")
            self.metrics["openai:gpt-4"] = ModelPerformanceMetrics(
                cultural_accuracy_score=0.9,
                islamic_compliance_score=0.85,
                arabic_processing_accuracy=0.8
            )

            # Anthropic (better cultural nuance)
            self.providers["anthropic:claude-3-sonnet"] = AnthropicModel(...)
            self.metrics["anthropic:claude-3-sonnet"] = ModelPerformanceMetrics(
                cultural_accuracy_score=0.95,
                islamic_compliance_score=0.9,
                arabic_processing_accuracy=0.85
            )

        def _setup_fallback_chain(self):
            # Priority: Cultural accuracy > Arabic processing > Speed
            priority_order = [
                "anthropic:claude-3-sonnet",  # Best cultural nuance
                "openai:gpt-4",               # Good cultural understanding
                "openai:gpt-3.5-turbo",       # Fast, decent awareness
            ]

        async def get_model_with_fallback(self) -> tuple[Any, str]:
            """Get model with automatic fallback on failure"""
            for model_name in self.fallback_chain:
                try:
                    return self.providers[model_name], model_name
                except Exception as e:
                    continue
            raise RuntimeError("All models failed")

    # Global function for agents to use
    async def get_llm_model(context: Optional[Dict] = None) -> tuple[Any, str]:
        provider = get_model_provider()
        return await provider.get_model_with_fallback(context)

testing_patterns:
  path: examples/testing_examples/test_agent_patterns.py
  pattern: |
    # 1. TestModel for fast development validation
    def test_agent_with_test_model(test_dependencies):
        test_model = TestModel()
        with test_agent.override(model=test_model):
            result = test_agent.run_sync("Hello", deps=test_dependencies)
            assert result.data.message is not None

    # 2. TestModel with custom output
    def test_custom_output(test_dependencies):
        test_model = TestModel(
            custom_output_text='{"message": "Custom response", "confidence": 0.9}'
        )
        with test_agent.override(model=test_model):
            result = test_agent.run_sync("Test", deps=test_dependencies)
            assert result.data.message == "Custom response"

    # 3. TestModel calling specific tools
    async def test_tool_invocation(mock_dependencies):
        test_model = TestModel(call_tools=["database_query"])
        with test_agent.override(model=test_model):
            result = await test_agent.run("Query DB", deps=mock_dependencies)
            mock_dependencies.database.execute_query.assert_called()

    # 4. FunctionModel for custom behavior
    def test_function_model_custom(test_dependencies):
        def custom_response(messages, tools):
            if "error" in messages[-1].content.lower():
                return '{"message": "Error handled", "confidence": 0.6}'
            return '{"message": "Normal", "confidence": 0.9}'

        with test_agent.override(model=FunctionModel(custom_response)):
            result1 = test_agent.run_sync("Normal request", deps=deps)
            assert result1.data.confidence == 0.9

            result2 = test_agent.run_sync("Error case", deps=deps)
            assert result2.data.confidence == 0.6

    # 5. Error handling tests
    async def test_tool_error_recovery(failing_dependencies):
        test_model = TestModel(call_tools="all")
        with test_agent.override(model=test_model):
            result = await test_agent.run("Access DB", deps=failing_dependencies)
            # Agent should handle failures gracefully
            assert result.data.message is not None
```

### Iraqi Agent Definitions (REVIEWED)

```yaml
# 22 AGENT DEFINITIONS - Available in .claude/agents/ directory

context_managed_agents:
  count: 13
  agents:
    - iraqi-cultural-validator
    - iraqi-cultural-tester
    - iraqi-business-analyst
    - iraqi-product-manager
    - iraqi-professional-domain-expert
    - iraqi-ui-designer
    - iraqi-ux-researcher
    - iraqi-interaction-designer
    - iraqi-ai-agent-architect
    - iraqi-devops-engineer
    - iraqi-workflow-orchestrator
    - iraqi-context-manager
    - iraqi-prp-execution-orchestrator
  characteristics:
    - Maintain historical context for complex decisions
    - Use project-context/agents/knowledge-base/ for persistent knowledge
    - Track performance metrics and cultural compliance over time
    - Coordinate with other agents through context sharing

specialized_tool_agents:
  count: 9
  agents:
    - arabic-rtl-processor
    - iraqi-arabic-tester
    - iraqi-payment-tester
    - iraqi-accessibility-specialist
    - iraqi-security-specialist
    - payment-security-guardian
    - iraqi-technical-debugger
    - external-service-coordinator
    - app-documentation-tracker
  characteristics:
    - Immediate processing without context overhead
    - Focused single-responsibility tools
    - High-performance specialized processing
    - Minimal dependencies for fast execution

mcp_integration:
  all_agents_use:
    - archon: Task management, project coordination, RAG knowledge base (MANDATORY)
  technical_agents_use:
    - serena: Code intelligence, semantic search, AST operations
    - context7: Up-to-date library documentation
    - github: Version control operations, CI/CD integration
    - supabase: Database operations, auth, real-time
  testing_agents_use:
    - playwright: E2E testing, browser automation
    - chrome-devtools: Performance profiling, network analysis
  monitoring_agents_use:
    - sentry: Error tracking, performance monitoring
```

### Security and Production Considerations (RESEARCHED)

```yaml
security_requirements:
  api_management:
    pattern: |
      # Environment variables only - NEVER commit API keys
      class Settings(BaseSettings):
          openai_api_key: Optional[str] = Field(None, env="OPENAI_API_KEY")
          anthropic_api_key: Optional[str] = Field(None, env="ANTHROPIC_API_KEY")

          class Config:
              env_file = ".env"
              env_file_encoding = "utf-8"

    requirements:
      - Store all API keys in .env files
      - Use python-dotenv for environment variable loading
      - Never log API keys or sensitive data
      - Rotate keys regularly with proper key management

  input_validation:
    pattern: |
      # Pydantic models for all inputs
      class AgentInput(BaseModel):
          message: str
          cultural_context: IraqiCulturalContext

          @validator('message')
          def validate_message(cls, v):
              # Sanitize and validate user input
              if len(v) > 10000:
                  raise ValueError("Message too long")
              return v

    requirements:
      - Validate all user inputs with Pydantic models
      - Implement prompt injection prevention
      - Rate limiting with proper throttling
      - Content filtering for malicious inputs

  output_security:
    requirements:
      - Filter sensitive data from agent responses
      - Validate output structure and content
      - Safe logging without exposing secrets
      - Cultural compliance validation on all outputs

production_patterns:
  error_handling:
    pattern: |
      @agent.tool
      async def risky_operation(ctx: RunContext[Deps]) -> str:
          try:
              result = await external_service.call()
              return result
          except TimeoutError:
              logger.error("Service timeout")
              return "Service temporarily unavailable"
          except Exception as e:
              logger.error(f"Unexpected error: {e}")
              return "An error occurred"

    requirements:
      - Comprehensive try-except blocks in all tools
      - Proper logging with structured error messages
      - Graceful degradation on failures
      - Retry mechanisms with exponential backoff

  monitoring:
    requirements:
      - Sentry integration for error tracking
      - Pydantic Logfire for agent observability
      - Performance metrics tracking
      - Cultural compliance monitoring
      - Cost tracking across model providers
```

### Common PydanticAI Gotchas (DOCUMENTED)

```yaml
gotcha_1_async_patterns:
  issue: "Mixing sync and async agent calls inconsistently"
  solution: |
    - Use agent.run() for async calls
    - Use agent.run_sync() for synchronous calls
    - Tools can be async or sync (async preferred for IO)
    - Don't mix async/sync in dependency injection

gotcha_2_model_limits:
  issue: "Different models have different capabilities and token limits"
  solution: |
    - Track model-specific capabilities in provider metadata
    - Implement intelligent model selection based on task requirements
    - Monitor token usage with ctx.usage
    - Set UsageLimits to prevent runaway costs

gotcha_3_dependency_complexity:
  issue: "Complex dependency graphs can be hard to debug"
  solution: |
    - Keep dependencies simple with dataclasses
    - Delegate agents need same or subset of parent dependencies
    - Use Agent.override(deps=test_deps) for testing
    - Document dependency requirements clearly

gotcha_4_tool_error_handling:
  issue: "Tool failures can crash entire agent runs"
  solution: |
    - Implement comprehensive error handling in all tools
    - Return error messages instead of raising exceptions
    - Log errors for debugging but continue execution
    - Test error scenarios with FunctionModel

gotcha_5_hardcoded_models:
  issue: "Hardcoding model names makes switching providers difficult"
  solution: |
    - NEVER use agent = Agent('openai:gpt-4', ...)
    - ALWAYS use agent = Agent(get_llm_model(), ...)
    - Implement provider abstraction layer
    - Support fallback chains for resilience

gotcha_6_structured_output_overuse:
  issue: "Adding result_type when simple strings suffice"
  solution: |
    - Default to string output for agent responses
    - Only add result_type when validation is specifically needed
    - Use Pydantic models for complex structured data
    - Keep output schemas simple and focused
```

## Implementation Blueprint

### RESEARCH COMPLETED ✅

All necessary research has been completed:

✅ **PydanticAI Framework Deep Dive:**
- ✅ Agent creation patterns and best practices (ai.pydantic.dev/agents/)
- ✅ Model provider configuration and fallback strategies (ai.pydantic.dev/models/)
- ✅ Tool integration patterns (@agent.tool vs @agent.tool_plain) (ai.pydantic.dev/tools/)
- ✅ Dependency injection system and type safety (ai.pydantic.dev/dependencies/)
- ✅ Testing strategies with TestModel and FunctionModel (ai.pydantic.dev/testing/)

✅ **Agent Architecture Investigation:**
- ✅ Project structure conventions from examples/main_agent_reference/
- ✅ System prompt design (static vs dynamic) patterns
- ✅ Structured output validation with Pydantic models
- ✅ Async/sync patterns and streaming support
- ✅ Error handling and retry mechanisms

✅ **Security and Production Patterns:**
- ✅ API key management and secure configuration via environment variables
- ✅ Input validation and prompt injection prevention
- ✅ Rate limiting and monitoring strategies with Sentry
- ✅ Logging and observability patterns with Pydantic Logfire
- ✅ Deployment and scaling considerations

✅ **Iraqi AI System Analysis:**
- ✅ Reviewed all 22 agent definitions in .claude/agents/
- ✅ Analyzed existing patterns in examples/pydantic-ai-agents-extracted/
- ✅ Studied settings.py, providers.py, and testing patterns
- ✅ Documented multi-agent coordination requirements
- ✅ Identified MCP server integrations per agent type

### Implementation Task 1 - Core Infrastructure Setup

**Objective**: Create the foundational infrastructure for Iraqi AI agent system

**Location**: `apps/api/agents/`

**Steps**:

1. **Create Core Configuration Layer**:
   ```
   apps/api/agents/
   ├── core/
   │   ├── __init__.py
   │   ├── settings.py          # Iraqi agent settings (IraqiAgentSettings)
   │   ├── providers.py         # Model provider abstraction (get_llm_model)
   │   ├── base_agent.py        # Base Iraqi agent class
   │   ├── mixins.py            # Reusable mixins (CulturalValidationMixin, etc.)
   │   └── constants.py         # Cultural thresholds, enums
   ```

2. **Implement IraqiAgentSettings** (based on examples/pydantic-ai-agents-extracted/core/settings.py):
   - Environment-based configuration with pydantic-settings
   - Cultural mode enums (STRICT, MODERATE, ADAPTIVE)
   - Islamic compliance levels (FULL, STANDARD, BASIC)
   - Arabic processing modes (IRAQI_DIALECT, STANDARD_ARABIC, MIXED)
   - Cultural validation thresholds (min_cultural_appropriateness: 0.95)
   - Performance configuration (max_response_time: 200ms)
   - Professional domain configuration
   - Payment gateway configuration (ZainCash, FastPay, NassWallet)
   - Security configuration
   - Validators to ensure cultural compliance

3. **Implement IraqiModelProvider** (based on examples/pydantic-ai-agents-extracted/core/providers.py):
   - Initialize OpenAI, Anthropic, Google providers with API key management
   - Track performance metrics per model (cultural_accuracy, islamic_compliance, arabic_accuracy)
   - Implement intelligent fallback chain prioritizing cultural accuracy
   - Calculate overall scores based on Iraqi requirements
   - Update performance metrics with moving averages
   - Provide get_llm_model() global function

4. **Create Base Agent Classes**:
   ```python
   # base_agent.py
   from dataclasses import dataclass
   from pydantic_ai import Agent, RunContext
   from .providers import get_llm_model
   from .settings import settings

   @dataclass
   class IraqiAgentBaseDeps:
       """Base dependencies for all Iraqi agents"""
       cultural_mode: IraqiCulturalMode
       islamic_compliance: IslamicComplianceLevel
       session_id: Optional[str] = None

   class BaseIraqiAgent:
       """Base class for all Iraqi AI agents"""

       def __init__(self, name: str, system_prompt: str):
           self.name = name
           self.agent = Agent(
               get_llm_model(),
               deps_type=IraqiAgentBaseDeps,
               system_prompt=system_prompt
           )
   ```

5. **Create Reusable Mixins**:
   ```python
   # mixins.py
   class CulturalValidationMixin:
       """Mixin for cultural compliance validation"""

       async def validate_cultural_content(
           self,
           content: str,
           min_appropriateness: float = 0.95
       ) -> CulturalValidationResult:
           # Cultural validation logic
           pass

   class ArabicProcessingMixin:
       """Mixin for Arabic RTL processing"""

       async def process_arabic_text(
           self,
           text: str,
           mode: ArabicProcessingMode
       ) -> ArabicProcessingResult:
           # RTL processing logic
           pass
   ```

**Validation**:
```bash
# Test settings load correctly
python -c "from apps.api.agents.core.settings import settings; print(settings.cultural_mode)"

# Test provider initialization
python -c "from apps.api.agents.core.providers import get_model_provider; print(get_model_provider().fallback_chain)"

# Verify configuration
pytest apps/api/agents/tests/core/test_settings.py -v
pytest apps/api/agents/tests/core/test_providers.py -v
```

### Implementation Task 2 - Cultural Intelligence Agents

**Objective**: Implement the 3 cultural intelligence agents (iraqi-cultural-validator, iraqi-cultural-tester, arabic-rtl-processor)

**Location**: `apps/api/agents/cultural/`

**Steps**:

1. **Create Cultural Agents Structure**:
   ```
   apps/api/agents/cultural/
   ├── __init__.py
   ├── validator/
   │   ├── agent.py              # iraqi-cultural-validator
   │   ├── tools.py              # Validation tools
   │   ├── models.py             # Validation models
   │   └── dependencies.py       # Validator dependencies
   ├── tester/
   │   ├── agent.py              # iraqi-cultural-tester
   │   ├── tools.py              # Testing tools
   │   └── dependencies.py       # Tester dependencies
   └── arabic_processor/
       ├── agent.py              # arabic-rtl-processor
       ├── tools.py              # RTL processing tools
       └── dependencies.py       # Processor dependencies
   ```

2. **Implement iraqi-cultural-validator**:
   ```python
   # cultural/validator/agent.py
   from pydantic_ai import Agent, RunContext
   from apps.api.agents.core.providers import get_llm_model
   from .dependencies import CulturalValidatorDeps

   SYSTEM_PROMPT = """You are an Iraqi cultural validation specialist.

   Validate content for:
   - 95%+ cultural appropriateness
   - 100% Islamic compliance
   - Political neutrality
   - Iraqi professional standards

   Return validation scores and recommendations."""

   cultural_validator = Agent(
       get_llm_model(),
       deps_type=CulturalValidatorDeps,
       system_prompt=SYSTEM_PROMPT
   )

   @cultural_validator.tool
   async def validate_content(
       ctx: RunContext[CulturalValidatorDeps],
       content: str,
       domain: str
   ) -> Dict[str, Any]:
       """Validate content for cultural appropriateness"""
       # Validation logic using cultural services
       pass
   ```

3. **Implement iraqi-cultural-tester**:
   - Create test scenarios for cultural compliance
   - Generate test cases for different cultural contexts
   - Validate agent behaviors against Iraqi standards

4. **Implement arabic-rtl-processor**:
   - RTL text direction detection
   - Iraqi dialect recognition
   - Mixed Arabic-English content handling
   - Text normalization and formatting

**Validation**:
```bash
# Test cultural validator
pytest apps/api/agents/tests/cultural/test_validator.py -v

# Test with TestModel
python -c "
from apps.api.agents.cultural.validator.agent import cultural_validator
from pydantic_ai.models.test import TestModel

with cultural_validator.override(model=TestModel()):
    result = cultural_validator.run_sync('Test content')
    print(result.data)
"
```

### Implementation Task 3 - Professional Domain Agents

**Objective**: Implement the 3 professional domain agents (iraqi-business-analyst, iraqi-professional-domain-expert, iraqi-product-manager)

**Location**: `apps/api/agents/professional/`

**Steps**:

1. **Create Professional Agents Structure**:
   ```
   apps/api/agents/professional/
   ├── __init__.py
   ├── business_analyst/
   │   ├── agent.py
   │   ├── tools.py              # Business analysis tools
   │   └── dependencies.py
   ├── domain_expert/
   │   ├── agent.py
   │   ├── tools.py              # Legal, medical, educational tools
   │   └── dependencies.py
   └── product_manager/
       ├── agent.py
       ├── tools.py              # Market analysis tools
       └── dependencies.py
   ```

2. **Implement agents following main_agent_reference pattern**
3. **Integrate with Iraqi professional databases and services**
4. **Add domain-specific validation and compliance checks**

### Implementation Task 4 - Technical Implementation Agents

**Objective**: Implement the 3 technical agents (iraqi-ai-agent-architect, iraqi-technical-debugger, iraqi-devops-engineer)

**Location**: `apps/api/agents/technical/`

**Steps**:

1. **Create Technical Agents Structure** (similar to professional agents)
2. **Implement ai-agent-architect for PydanticAI agent development**
3. **Implement technical-debugger for Iraqi-specific debugging**
4. **Implement devops-engineer for infrastructure with Iraqi compliance**

### Implementation Task 5 - UI/UX Design Agents

**Objective**: Implement the 4 UI/UX agents (iraqi-ui-designer, iraqi-ux-researcher, iraqi-interaction-designer, iraqi-accessibility-specialist)

**Location**: `apps/api/agents/design/`

**Implementation**: Follow same pattern as previous agent categories

### Implementation Task 6 - Security & Payment Agents

**Objective**: Implement the 3 security agents (iraqi-security-specialist, iraqi-payment-tester, payment-security-guardian)

**Location**: `apps/api/agents/security/`

**Implementation**: Follow same pattern with enhanced security validation

### Implementation Task 7 - System Coordination Agents

**Objective**: Implement the 5 coordination agents (iraqi-workflow-orchestrator, iraqi-context-manager, iraqi-prp-execution-orchestrator, external-service-coordinator, app-documentation-tracker)

**Location**: `apps/api/agents/coordination/`

**Steps**:

1. **Implement multi-agent coordination patterns**
2. **Create context management system (35% performance improvement)**
3. **Integrate with Archon MCP for task management**

### Implementation Task 8 - Comprehensive Testing Suite

**Objective**: Create comprehensive tests for all agents using TestModel and FunctionModel

**Location**: `apps/api/agents/tests/`

**Steps**:

1. **Create Test Structure**:
   ```
   apps/api/agents/tests/
   ├── __init__.py
   ├── conftest.py              # Pytest fixtures
   ├── core/
   │   ├── test_settings.py
   │   ├── test_providers.py
   │   └── test_base_agent.py
   ├── cultural/
   │   ├── test_validator.py
   │   ├── test_tester.py
   │   └── test_arabic_processor.py
   ├── professional/
   │   └── ...
   ├── technical/
   │   └── ...
   ├── design/
   │   └── ...
   ├── security/
   │   └── ...
   └── coordination/
       └── ...
   ```

2. **Implement Test Patterns** (based on examples/testing_examples/test_agent_patterns.py):
   ```python
   # Example test pattern
   class TestCulturalValidator:
       @pytest.fixture
       def validator_deps(self):
           return CulturalValidatorDeps(
               cultural_mode=IraqiCulturalMode.STRICT,
               islamic_compliance=IslamicComplianceLevel.FULL
           )

       def test_validator_with_test_model(self, validator_deps):
           test_model = TestModel()
           with cultural_validator.override(model=test_model):
               result = cultural_validator.run_sync(
                   "Test content",
                   deps=validator_deps
               )
               assert result.data is not None

       @pytest.mark.asyncio
       async def test_validator_tools(self, validator_deps):
           test_model = TestModel(call_tools=["validate_content"])
           with cultural_validator.override(model=test_model):
               result = await cultural_validator.run(
                   "Validate this Iraqi content",
                   deps=validator_deps
               )
               # Verify validation logic
               assert "cultural_appropriateness" in str(result.data)
   ```

3. **Create Integration Tests** for multi-agent workflows
4. **Create Performance Tests** to verify <200ms cultural validation, <300ms multi-agent workflows

### Implementation Task 9 - Documentation and Examples

**Objective**: Create comprehensive documentation and usage examples

**Steps**:

1. **Create Documentation**:
   ```
   apps/api/agents/
   ├── README.md                # Overview and quick start
   ├── docs/
   │   ├── architecture.md      # System architecture
   │   ├── agents/              # Per-agent documentation
   │   ├── testing.md           # Testing guide
   │   └── deployment.md        # Production deployment
   └── examples/
       ├── basic_agent_usage.py
       ├── multi_agent_coordination.py
       └── cultural_validation_workflow.py
   ```

2. **Write Examples** demonstrating:
   - Basic agent usage
   - Multi-agent coordination
   - Cultural validation workflows
   - Professional domain integration
   - Error handling patterns

## Validation Loop

### Level 1: Agent Structure Validation

```bash
# Verify complete agent structure
find apps/api/agents -type d | sort

# Expected directories:
# apps/api/agents/core/
# apps/api/agents/cultural/
# apps/api/agents/professional/
# apps/api/agents/technical/
# apps/api/agents/design/
# apps/api/agents/security/
# apps/api/agents/coordination/
# apps/api/agents/tests/

# Verify all agents have required files
for agent_dir in apps/api/agents/cultural/* apps/api/agents/professional/* apps/api/agents/technical/* apps/api/agents/design/* apps/api/agents/security/* apps/api/agents/coordination/*; do
    test -f "$agent_dir/agent.py" && echo "✅ $agent_dir/agent.py" || echo "❌ Missing $agent_dir/agent.py"
    test -f "$agent_dir/tools.py" && echo "✅ $agent_dir/tools.py" || echo "❌ Missing $agent_dir/tools.py"
    test -f "$agent_dir/dependencies.py" && echo "✅ $agent_dir/dependencies.py" || echo "❌ Missing $agent_dir/dependencies.py"
done

# Verify proper PydanticAI imports
grep -r "from pydantic_ai import Agent" apps/api/agents/*/*/agent.py | wc -l
# Expected: 21 (one per agent)

grep -r "@.*\.tool" apps/api/agents/*/*/tools.py | wc -l
# Expected: >0 (tools defined)

# Expected: All 21 agents with proper structure
# If missing: Generate missing components with correct patterns
```

### Level 2: Configuration and Provider Validation

```bash
# Test settings load correctly
python -c "
from apps.api.agents.core.settings import settings
print(f'Cultural Mode: {settings.cultural_mode}')
print(f'Islamic Compliance: {settings.islamic_compliance_level}')
print(f'Min Cultural Appropriateness: {settings.min_cultural_appropriateness}')
print(f'Min Islamic Compliance: {settings.min_islamic_compliance}')
print(f'Enabled Domains: {settings.enabled_domains}')
"
# Expected: All settings load with correct cultural thresholds

# Test provider initialization
python -c "
from apps.api.agents.core.providers import get_model_provider
provider = get_model_provider()
print(f'Fallback Chain: {provider.fallback_chain}')
print(f'Available Models: {list(provider.providers.keys())}')
stats = provider.get_model_stats()
for model, metrics in stats.items():
    print(f'{model}: Cultural={metrics[\"cultural_accuracy\"]}, Islamic={metrics[\"islamic_compliance\"]}')
"
# Expected: Provider initialized with fallback chain, model performance metrics

# Verify get_llm_model() works
python -c "
import asyncio
from apps.api.agents.core.providers import get_llm_model

async def test():
    model, model_name = await get_llm_model()
    print(f'Selected Model: {model_name}')
    print(f'Model Type: {type(model)}')
    return model, model_name

asyncio.run(test())
"
# Expected: Model and name returned successfully
```

### Level 3: Agent Functionality Validation

```bash
# Test each agent can be imported and instantiated
for agent_path in apps/api/agents/cultural/validator apps/api/agents/cultural/tester apps/api/agents/cultural/arabic_processor apps/api/agents/professional/business_analyst apps/api/agents/professional/domain_expert apps/api/agents/professional/product_manager apps/api/agents/technical/ai_agent_architect apps/api/agents/technical/technical_debugger apps/api/agents/technical/devops_engineer apps/api/agents/design/ui_designer apps/api/agents/design/ux_researcher apps/api/agents/design/interaction_designer apps/api/agents/design/accessibility_specialist apps/api/agents/security/security_specialist apps/api/agents/security/payment_tester apps/api/agents/security/payment_security_guardian apps/api/agents/coordination/workflow_orchestrator apps/api/agents/coordination/context_manager apps/api/agents/coordination/prp_execution_orchestrator apps/api/agents/coordination/external_service_coordinator apps/api/agents/coordination/app_documentation_tracker; do
    python -c "
from ${agent_path/\//.}.agent import *
print(f'✅ {agent_path} loaded successfully')
    " || echo "❌ Failed to load ${agent_path}"
done

# Test agents with TestModel
python -c "
from pydantic_ai.models.test import TestModel
from apps.api.agents.cultural.validator.agent import cultural_validator
from apps.api.agents.cultural.validator.dependencies import CulturalValidatorDeps

deps = CulturalValidatorDeps(
    cultural_mode='strict',
    islamic_compliance='full'
)

with cultural_validator.override(model=TestModel()):
    result = cultural_validator.run_sync(
        'Test Iraqi cultural content validation',
        deps=deps
    )
    print(f'✅ Cultural Validator Test: {result.data[:100]}...')
"

# Expected: All agents instantiate and run with TestModel
# If failing: Debug agent configuration and imports
```

### Level 4: Comprehensive Testing Validation

```bash
# Run complete test suite
cd apps/api/agents
pytest tests/ -v

# Test specific agent categories
pytest tests/core/ -v
pytest tests/cultural/ -v
pytest tests/professional/ -v
pytest tests/technical/ -v
pytest tests/design/ -v
pytest tests/security/ -v
pytest tests/coordination/ -v

# Test with coverage
pytest tests/ --cov=apps.api.agents --cov-report=html

# Expected coverage targets:
# - Core infrastructure: >90%
# - Agent implementations: >80%
# - Tool implementations: >85%
# - Overall: >85%

# Run performance tests
pytest tests/ -v -m performance

# Expected performance:
# - Cultural validation: <200ms
# - Arabic processing: <300ms
# - Multi-agent workflows: <300ms

# If failing: Fix implementation based on test failures
```

### Level 5: Cultural Compliance Validation

```bash
# Verify cultural validation thresholds
python -c "
import asyncio
from apps.api.agents.cultural.validator.agent import cultural_validator
from apps.api.agents.cultural.validator.dependencies import CulturalValidatorDeps
from pydantic_ai.models.test import TestModel

async def test_cultural_compliance():
    deps = CulturalValidatorDeps(
        cultural_mode='strict',
        islamic_compliance='full'
    )

    test_cases = [
        'السلام عليكم، أهلاً وسهلاً بكم في شركتنا العراقية',
        'بسم الله الرحمن الرحيم، نقدم خدمات احترافية',
        'مرحبا، نحن نحترم التقاليد العراقية والقيم الإسلامية'
    ]

    for content in test_cases:
        with cultural_validator.override(model=TestModel()):
            result = await cultural_validator.run(
                f'Validate this content: {content}',
                deps=deps
            )
            print(f'Content: {content[:50]}...')
            print(f'Validation Result: {str(result.data)[:100]}...')
            print('---')

asyncio.run(test_cultural_compliance())
"

# Verify Islamic compliance
python -c "
# Test Islamic compliance validation
# Should validate greeting formats, religious terminology, cultural appropriateness
# Expected: 100% Islamic compliance validation
"

# Verify Arabic processing accuracy
python -c "
# Test Iraqi dialect recognition
# Should identify dialect indicators, RTL processing, mixed language handling
# Expected: 85%+ dialect recognition accuracy
"

# Expected: All cultural validation passes with required thresholds
# If issues: Adjust validation logic and cultural models
```

### Level 6: Multi-Agent Coordination Validation

```bash
# Test agent delegation patterns
python -c "
import asyncio
from apps.api.agents.coordination.workflow_orchestrator.agent import workflow_orchestrator
from apps.api.agents.cultural.validator.agent import cultural_validator
from apps.api.agents.cultural.arabic_processor.agent import arabic_processor

async def test_multi_agent_coordination():
    # Test workflow orchestration
    # Coordinator should delegate to cultural validator and arabic processor
    # Should track usage across agent chain
    # Should share context between agents
    pass

asyncio.run(test_multi_agent_coordination())
"

# Test context sharing (35% performance improvement)
python -c "
from apps.api.agents.coordination.context_manager.agent import context_manager
# Test context optimization
# Expected: 35% performance improvement through context caching
"

# Expected: Successful multi-agent coordination with performance gains
# If failing: Debug coordination logic and context sharing
```

### Level 7: Production Readiness Validation

```bash
# Verify security patterns
grep -r "API_KEY" apps/api/agents/ --exclude-dir=tests | grep -v ".py:"
# Expected: No API keys exposed in code

test -f apps/api/agents/.env.example && echo "✅ .env.example present" || echo "❌ Missing .env.example"

# Check error handling
grep -r "try:" apps/api/agents/ | wc -l
grep -r "except" apps/api/agents/ | wc -l
# Expected: Comprehensive error handling throughout

# Verify logging setup
grep -r "import logging\|from logging" apps/api/agents/ | wc -l
grep -r "logger\." apps/api/agents/ | wc -l
# Expected: Logging configured in all agents

# Test with real models (requires API keys)
export ALLOW_MODEL_REQUESTS=true
python -c "
import asyncio
from apps.api.agents.cultural.validator.agent import cultural_validator
from apps.api.agents.cultural.validator.dependencies import CulturalValidatorDeps

async def test_real_model():
    deps = CulturalValidatorDeps(
        cultural_mode='strict',
        islamic_compliance='full'
    )

    result = await cultural_validator.run(
        'Validate this Iraqi content: السلام عليكم ورحمة الله وبركاته',
        deps=deps
    )

    print(f'Real Model Result: {result.data}')
    print(f'Model Used: {result.usage}')

asyncio.run(test_real_model())
"

# Expected: Security measures in place, error handling comprehensive, logging configured
# If issues: Implement missing security and production patterns
```

## Final Validation Checklist

### Agent Implementation Completeness

- [ ] All 21 agents have complete structure (agent.py, tools.py, dependencies.py)
- [ ] All agents use get_llm_model() abstraction (no hardcoded model names)
- [ ] All agents follow main_agent_reference pattern
- [ ] All agents have dataclass dependencies with proper typing
- [ ] All agents have @agent.tool decorators with RunContext[DepsType]
- [ ] All agents default to string output (result_type only when needed)
- [ ] All agents have comprehensive error handling in tools
- [ ] All agents have proper logging configured

### PydanticAI Best Practices

- [ ] Type safety throughout with proper type hints and validation
- [ ] Security patterns implemented (API keys in .env, input validation, rate limiting)
- [ ] Error handling and retry mechanisms for robust operation
- [ ] Async/sync patterns consistent and appropriate
- [ ] Documentation and code comments for maintainability
- [ ] TestModel and FunctionModel testing for all agents
- [ ] Agent.override() patterns for test isolation
- [ ] Usage tracking with ctx.usage across agent chains

### Iraqi Cultural Compliance

- [ ] Cultural validation achieves 95%+ appropriateness across all agents
- [ ] Islamic compliance validation maintains 100% adherence
- [ ] Arabic processing achieves 85%+ Iraqi dialect recognition accuracy
- [ ] RTL text handling works correctly for all Arabic content
- [ ] Mixed Arabic-English content processed properly
- [ ] Professional domain integration for legal, medical, educational, business
- [ ] Payment gateway integration for ZainCash, FastPay, NassWallet
- [ ] Regional adaptation for Baghdad, Basra, Mosul, Erbil

### Multi-Agent Coordination

- [ ] Agent delegation patterns working correctly
- [ ] Programmatic hand-off between agents functional
- [ ] Dependency sharing between parent and delegate agents
- [ ] Usage aggregation across agent chains
- [ ] Context optimization achieving 35% performance improvement
- [ ] Intelligent agent routing based on domain expertise
- [ ] Parallel processing for complex workflows
- [ ] Error recovery with graceful fallback

### Performance Requirements

- [ ] Cultural validation: <200ms response time
- [ ] Arabic processing: <300ms response time
- [ ] Multi-agent workflows: <300ms end-to-end
- [ ] Model provider fallback: <500ms failover time
- [ ] Database operations: <100ms per query
- [ ] API integrations: <200ms per call
- [ ] Overall system responsiveness: <1s for complex requests

### Production Readiness

- [ ] Environment configuration with .env files and validation
- [ ] All API keys stored securely (never in code)
- [ ] Logging and monitoring setup for observability (Sentry, Logfire)
- [ ] Performance optimization and resource management
- [ ] Deployment readiness with proper configuration management
- [ ] Comprehensive test coverage (>85% overall)
- [ ] Documentation complete and examples functional
- [ ] Security audit passed (input validation, output filtering, rate limiting)

## Anti-Patterns to Avoid

### PydanticAI Agent Development

- ❌ **Don't skip TestModel validation** - always test with TestModel during development
- ❌ **Don't hardcode API keys** - use environment variables for all credentials
- ❌ **Don't ignore async patterns** - PydanticAI has specific async/sync requirements
- ❌ **Don't create complex tool chains** - keep tools focused and composable
- ❌ **Don't skip error handling** - implement comprehensive retry and fallback mechanisms
- ❌ **Don't hardcode model names** - always use get_llm_model() abstraction
- ❌ **Don't skip cultural validation** - every agent must meet Iraqi requirements

### Agent Architecture

- ❌ **Don't mix agent types** - clearly separate cultural, professional, technical patterns
- ❌ **Don't ignore dependency injection** - use proper type-safe dependency management
- ❌ **Don't skip output validation** - use Pydantic models when structured responses needed
- ❌ **Don't forget tool documentation** - ensure all tools have proper descriptions
- ❌ **Don't create circular dependencies** - maintain clear dependency hierarchies
- ❌ **Don't reinvent patterns** - use established patterns from main_agent_reference

### Security and Production

- ❌ **Don't expose sensitive data** - validate all outputs and logs for security
- ❌ **Don't skip input validation** - sanitize and validate all user inputs
- ❌ **Don't ignore rate limiting** - implement proper throttling for external services
- ❌ **Don't deploy without monitoring** - include proper observability from the start
- ❌ **Don't skip Iraqi compliance** - cultural and Islamic validation is mandatory
- ❌ **Don't ignore performance metrics** - track response times and cultural accuracy

---

## PRP Quality Assessment

### Confidence Level: 9.5/10

**Strengths**:
1. ✅ **Comprehensive Research**: All PydanticAI documentation thoroughly reviewed
2. ✅ **Proven Patterns**: Based on main_agent_reference and pydantic-ai-agents-extracted
3. ✅ **Detailed Implementation**: Step-by-step blueprint with clear validation gates
4. ✅ **Cultural Intelligence**: Full Iraqi cultural requirements documented
5. ✅ **Testing Strategy**: Comprehensive TestModel/FunctionModel patterns included
6. ✅ **Security Focus**: Production-ready security and monitoring requirements
7. ✅ **Clear Examples**: Code snippets from actual codebase throughout
8. ✅ **Performance Targets**: Specific metrics for cultural validation and multi-agent coordination

**Potential Challenges**:
- Multi-agent coordination complexity may require iteration
- Cultural validation accuracy depends on quality of validation services
- Performance optimization may need tuning for specific use cases

**Mitigation**:
- Follow proven patterns from main_agent_reference step-by-step
- Use TestModel extensively during development before real model integration
- Implement comprehensive error handling and logging for production debugging
- Start with core agents (cultural, professional) before advanced coordination

**Success Factors**:
- Comprehensive research completed upfront (all documentation reviewed)
- Clear validation gates at every implementation level
- Proven patterns from existing codebase to follow
- Strong testing strategy with TestModel and FunctionModel
- Detailed cultural compliance requirements with measurable metrics

This PRP provides a complete roadmap for one-pass implementation success through comprehensive context, proven patterns, and clear validation checkpoints. The implementation team has everything needed to build production-ready Iraqi AI agents with PydanticAI.

---

**END OF PRP** - Ready for implementation by AI agent or development team
