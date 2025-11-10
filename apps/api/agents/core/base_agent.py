"""
Iraqi AI Agent Base Classes

Abstract base classes and interfaces for all Iraqi AI agents.
"""

from abc import ABC, abstractmethod
from typing import Generic, TypeVar, Optional, Dict, Any
from datetime import datetime
import time

try:
    from pydantic_ai import Agent, RunContext
except ImportError:
    # Graceful handling for development environment
    Agent = Any
    RunContext = Any
    print("PydanticAI not available - using mock types")

from .settings import settings, IraqiAgentSettings
from .providers import get_llm_model, get_model_provider, IraqiModelProvider
from .models import IraqiAgentDependencies, AgentPerformanceMetrics

# Type variable for dependencies
DepsType = TypeVar("DepsType", bound=IraqiAgentDependencies)


class BaseIraqiAgent(ABC, Generic[DepsType]):
    """
    Abstract base class for all Iraqi AI agents.

    Provides:
    - Standardized agent initialization
    - Cultural validation hooks
    - Performance tracking
    - Dependency injection patterns
    - Testing support

    All Iraqi AI agents should inherit from this class to ensure
    consistent behavior and cultural compliance.
    """

    def __init__(
        self,
        agent_name: str,
        agent_settings: Optional[IraqiAgentSettings] = None,
        model_provider: Optional[IraqiModelProvider] = None,
    ):
        """
        Initialize Iraqi AI agent.

        Args:
            agent_name: Unique identifier for this agent
            agent_settings: Iraqi agent settings (uses global settings if None)
            model_provider: Model provider instance (creates new if None)
        """
        self.agent_name = agent_name
        self.settings = agent_settings or settings
        self.model_provider = model_provider or get_model_provider()

        # Initialize agent with cultural system prompt
        self.agent = self._create_agent()

        # Performance tracking
        self.execution_metrics: Dict[str, Any] = {
            "total_runs": 0,
            "total_cultural_validations": 0,
            "avg_response_time_ms": 0.0,
            "cultural_compliance_rate": 0.0,
            "last_execution": None,
        }

    @abstractmethod
    def _create_agent(self) -> Agent:
        """
        Create PydanticAI agent with Iraqi cultural configuration.

        Must be implemented by each agent to define:
        - System prompt with Iraqi cultural context
        - Agent-specific tools
        - Output model (if structured output needed)

        Returns:
            Configured PydanticAI Agent instance
        """
        pass

    @abstractmethod
    def get_system_prompt(self) -> str:
        """
        Get Iraqi cultural system prompt for this agent.

        Must be implemented by each agent to define culturally-appropriate
        system instructions including:
        - Islamic compliance requirements
        - Iraqi cultural context
        - Professional domain guidelines
        - Political neutrality rules

        Returns:
            System prompt string with Iraqi cultural context
        """
        pass

    async def run(self, user_prompt: str, deps: DepsType, **kwargs) -> Any:
        """
        Execute agent with cultural validation and performance tracking.

        Args:
            user_prompt: User request
            deps: Iraqi dependencies (cultural context, language, professional domain)
            **kwargs: Additional run parameters

        Returns:
            Agent response with cultural validation
        """
        start_time = datetime.now()

        # Pre-validation: Input cultural screening
        if self.settings.input_validation_enabled:
            await self._validate_input(user_prompt, deps)

        # Run agent
        try:
            result = await self.agent.run(user_prompt, deps=deps, **kwargs)

            # Post-validation: Output cultural compliance
            if self.settings.islamic_compliance_required:
                await self._validate_output(result.data, deps)

            # Track performance
            duration_ms = (datetime.now() - start_time).total_seconds() * 1000
            self._track_execution(duration_ms, deps, success=True)

            return result

        except Exception as e:
            # Track failed execution
            duration_ms = (datetime.now() - start_time).total_seconds() * 1000
            self._track_execution(duration_ms, deps, success=False, error=str(e))
            raise

    async def _validate_input(self, user_prompt: str, deps: DepsType):
        """
        Validate input for cultural appropriateness.

        Args:
            user_prompt: User input to validate
            deps: Agent dependencies with cultural context
        """
        # TODO: Implement with cultural-validator agent
        # This will be implemented when cultural-validator agent is created
        pass

    async def _validate_output(self, output: Any, deps: DepsType):
        """
        Validate output for Islamic compliance.

        Args:
            output: Agent output to validate
            deps: Agent dependencies with cultural context
        """
        # TODO: Implement with cultural-validator agent
        # This will be implemented when cultural-validator agent is created
        pass

    def _track_execution(
        self,
        duration_ms: float,
        deps: DepsType,
        success: bool = True,
        error: Optional[str] = None,
    ):
        """
        Track agent execution metrics.

        Args:
            duration_ms: Execution time in milliseconds
            deps: Agent dependencies
            success: Whether execution succeeded
            error: Error message if execution failed
        """
        self.execution_metrics["total_runs"] += 1
        self.execution_metrics["last_execution"] = datetime.now().isoformat()

        # Update average response time
        current_avg = self.execution_metrics["avg_response_time_ms"]
        total_runs = self.execution_metrics["total_runs"]
        self.execution_metrics["avg_response_time_ms"] = (
            current_avg * (total_runs - 1) + duration_ms
        ) / total_runs

        # Track cultural validations if enabled
        if self.settings.enable_cultural_metrics and deps.islamic_compliance_required:
            self.execution_metrics["total_cultural_validations"] += 1

    def get_metrics(self) -> AgentPerformanceMetrics:
        """
        Get agent performance metrics.

        Returns:
            Performance metrics for this agent
        """
        return AgentPerformanceMetrics(
            agent_name=self.agent_name,
            execution_time_ms=self.execution_metrics["avg_response_time_ms"],
            tokens_used=0,  # Will be updated with actual token tracking
            cultural_validation_time_ms=None,  # Will be updated with cultural validator
            cultural_appropriateness_score=None,  # Will be updated with cultural validator
            success=True,  # Based on last execution
            error_message=None,
        )

    def reset_metrics(self):
        """Reset performance metrics."""
        self.execution_metrics = {
            "total_runs": 0,
            "total_cultural_validations": 0,
            "avg_response_time_ms": 0.0,
            "cultural_compliance_rate": 0.0,
            "last_execution": None,
        }


class IraqiAgentMixin:
    """
    Mixin class providing common Iraqi agent functionality.

    This mixin can be composed with specific agent implementations to
    provide reusable Iraqi-specific capabilities.
    """

    def get_cultural_context(self, deps: IraqiAgentDependencies) -> str:
        """
        Get cultural context description for agent prompts.

        Args:
            deps: Agent dependencies with cultural configuration

        Returns:
            Cultural context string for system prompt enhancement
        """
        context_parts = []

        # Cultural mode
        if deps.cultural_mode == "strict":
            context_parts.append(
                "Operating in STRICT cultural mode - 95%+ cultural appropriateness required"
            )
        elif deps.cultural_mode == "moderate":
            context_parts.append(
                "Operating in MODERATE cultural mode - 85%+ cultural appropriateness required"
            )
        else:
            context_parts.append(
                "Operating in FLEXIBLE cultural mode - context-aware cultural validation"
            )

        # Islamic compliance
        if deps.islamic_compliance_required:
            context_parts.append("100% Islamic compliance REQUIRED - no exceptions")

        # Language preference
        if deps.language_preference == "arabic":
            context_parts.append(
                "Arabic language preference - use Iraqi Arabic dialect"
            )
        elif deps.language_preference == "english":
            context_parts.append(
                "English language preference - maintain cultural awareness"
            )
        else:
            context_parts.append(
                "Mixed language support - Iraqi Arabic + English code switching"
            )

        # Professional domain
        if deps.professional_domain:
            context_parts.append(
                f"Professional domain: {deps.professional_domain.upper()}"
            )

        return "\n".join(context_parts)

    def format_arabic_response(self, text: str, rtl: bool = True) -> str:
        """
        Format response text for proper Arabic RTL display.

        Args:
            text: Text to format
            rtl: Whether to apply RTL formatting

        Returns:
            Formatted text with RTL markers if needed
        """
        if not rtl:
            return text

        # Add RTL markers for proper display
        # This is a simple implementation - full implementation in arabic-rtl-processor
        return f"\u202b{text}\u202c"  # RLE (Right-to-Left Embedding) markers


# Helper function to create basic agents quickly
def create_simple_agent(
    agent_name: str,
    system_prompt: str,
    deps_type: type[IraqiAgentDependencies] = IraqiAgentDependencies,
) -> Agent:
    """
    Create a simple PydanticAI agent with Iraqi cultural defaults.

    Args:
        agent_name: Agent identifier
        system_prompt: System prompt (should include Iraqi cultural context)
        deps_type: Dependencies type (default: IraqiAgentDependencies)

    Returns:
        Configured Agent instance
    """
    return Agent(
        model=get_llm_model(),
        system_prompt=system_prompt,
        deps_type=deps_type,
        retries=settings.max_retries,
    )
