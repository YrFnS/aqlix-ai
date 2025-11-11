"""Iraqi AI Agent Architect Agent - PydanticAI architecture with Iraqi context."""

try:
    from pydantic_ai import Agent
except ImportError:
    Agent = None

from typing import Optional
from apps.api.agents.core.base_agent import BaseIraqiAgent
from apps.api.agents.core.providers import get_llm_model
from apps.api.agents.technical.ai_architect.dependencies import AIArchitectDeps
from apps.api.agents.technical.ai_architect.tools import AIArchitectTools
from apps.api.agents.technical.ai_architect.models import (
    AgentArchitectureSpec,
    PydanticAIPattern,
    MultiAgentWorkflow,
)


class IraqiAIAgentArchitect(BaseIraqiAgent[AIArchitectDeps]):
    """
    Iraqi AI agent architect with PydanticAI expertise.

    Capabilities:
    - PydanticAI agent architecture design with Iraqi cultural integration
    - Multi-agent workflow orchestration patterns
    - Model provider recommendations for Iraqi use cases
    - Performance optimization for Iraqi infrastructure
    - Cultural validation pipeline design
    - Arabic NLP integration patterns
    """

    def __init__(self):
        super().__init__(agent_name="iraqi-ai-agent-architect")
        self.tools = AIArchitectTools()

    def _create_agent(self) -> Optional[Agent]:
        if Agent is None:
            return None
        return Agent(
            model=get_llm_model(),
            system_prompt=self.get_system_prompt(),
            deps_type=AIArchitectDeps,
            retries=self.settings.max_retries,
        )

    def get_system_prompt(self) -> str:
        return """You are an Iraqi AI agent architect specialist with expertise in:

**Core Competencies:**
- PydanticAI framework architecture and patterns
- Multi-agent coordination with Iraqi cultural context
- RunContext[DepsType] dependency injection patterns
- Tool registration and function calling (@agent.tool)
- Structured output validation with Pydantic models
- Model provider selection (Anthropic, OpenAI, Google, Groq)

**Iraqi Integration Requirements:**
- Cultural validation integration in agent pipelines
- Arabic text processing with RTL support
- Islamic compliance checking (100% required)
- Iraqi infrastructure considerations (timeouts, retries, offline-first)
- Performance targets: <300ms response, <200ms cultural validation
- Bilingual support (Arabic + English) in all agents

**PydanticAI Best Practices:**
1. Extend BaseIraqiAgent for all Iraqi AI agents
2. Use IraqiAgentDependencies dataclass for type-safe config
3. Implement singleton pattern with get_agent() factory
4. Register tools with @agent.tool decorator
5. Enable retries and timeouts for Iraqi infrastructure
6. Track cultural_appropriateness_score in metrics
7. Validate inputs/outputs for cultural compliance

**Architecture Patterns:**
- **Simple Agent**: Single-purpose with cultural validation
- **Tool-Enabled Agent**: Function calling with Iraqi tools
- **Multi-Agent Workflow**: Sequential/parallel with context sharing
- **Streaming Agent**: Real-time responses with Arabic RTL
- **Structured Output**: Pydantic models for Iraqi data

**Model Selection:**
- Cultural validation: claude-3-5-haiku (fast, accurate)
- Arabic processing: gpt-4o-mini (multilingual, cost-effective)
- Complex reasoning: claude-3-5-sonnet (best Iraqi context)
- Testing: TestModel/FunctionModel (zero cost)

**Output:** Agent architecture specs, code templates, workflow designs, performance optimization."""

    def _register_tools(self, agent: Agent):
        pass

    async def design_agent_architecture(
        self, agent_name: str, purpose: str, cultural_requirements: bool = True
    ) -> AgentArchitectureSpec:
        """Design PydanticAI agent architecture with Iraqi context."""
        spec_dict = await self.tools.generate_agent_spec(
            agent_name, purpose, cultural_requirements
        )

        # Validate architecture
        validation = await self.tools.validate_architecture(spec_dict)

        # Get model recommendation
        model_rec = await self.tools.recommend_model_provider(purpose)

        return AgentArchitectureSpec(
            agent_name=agent_name,
            agent_type="single",
            system_prompt=spec_dict["system_prompt_template"],
            dependencies_class="IraqiAgentDependencies",
            tools_required=spec_dict["tools"],
            cultural_integration={
                "islamic_compliance": cultural_requirements,
                "arabic_processing": True,
                "cultural_validation": True,
            },
            performance_targets=spec_dict["performance_targets"],
            model_config={
                "provider": model_rec["provider"],
                "model": model_rec["model"],
                "reason": model_rec["reason"],
            },
        )

    async def design_multi_agent_workflow(
        self, workflow_purpose: str, agents: list
    ) -> MultiAgentWorkflow:
        """Design multi-agent workflow with Iraqi cultural gates."""
        workflow_dict = await self.tools.design_multi_agent_workflow(
            workflow_purpose, agents
        )

        return MultiAgentWorkflow(
            workflow_name=workflow_dict["workflow_name"],
            agents=workflow_dict["agents"],
            coordination_pattern=workflow_dict["pattern"],
            context_sharing=workflow_dict["context_optimization"],
            cultural_validation_points=workflow_dict["cultural_validation_gates"],
            performance_budget_ms=workflow_dict["performance_budget_ms"],
        )

    def get_pydantic_ai_pattern(self, pattern_name: str) -> str:
        """Get PydanticAI code template for pattern."""
        return self.tools.PYDANTIC_AI_PATTERNS.get(
            pattern_name, self.tools.PYDANTIC_AI_PATTERNS["simple_agent"]
        )

    def get_best_practices(self) -> list:
        """Get PydanticAI best practices for Iraqi agents."""
        return self.tools.get_best_practices()


_ai_architect_instance = None


def get_ai_architect() -> IraqiAIAgentArchitect:
    global _ai_architect_instance
    if _ai_architect_instance is None:
        _ai_architect_instance = IraqiAIAgentArchitect()
    return _ai_architect_instance
