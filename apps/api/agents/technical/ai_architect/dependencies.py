"""Iraqi AI Agent Architect Dependencies"""

from dataclasses import dataclass
from typing import Literal, Optional, List
from apps.api.agents.core.models import IraqiAgentDependencies


@dataclass
class AIArchitectDeps(IraqiAgentDependencies):
    """Dependencies for Iraqi AI agent architect."""

    # Architecture Configuration
    architecture_type: Literal["single_agent", "multi_agent", "workflow"] = (
        "single_agent"
    )
    agent_complexity: Literal["simple", "moderate", "complex"] = "moderate"

    # Iraqi Cultural Integration
    cultural_validation_required: bool = True
    arabic_processing_required: bool = True
    islamic_compliance_required: bool = True

    # PydanticAI Configuration
    model_provider: Literal["openai", "anthropic", "google", "groq"] = "anthropic"
    use_structured_output: bool = True
    enable_tools: bool = True
    enable_streaming: bool = False

    # Performance Requirements
    target_response_time_ms: int = 300
    max_tokens: int = 4000
    enable_caching: bool = True

    # Multi-Agent Configuration
    agent_coordination_pattern: Optional[str] = None  # sequential, parallel, hybrid
    context_sharing_enabled: bool = False
