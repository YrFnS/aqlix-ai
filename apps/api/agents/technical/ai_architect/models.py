"""AI Agent Architect Models"""

from typing import Optional, Literal, List, Dict, Any
from pydantic import BaseModel, Field


class AgentArchitectureSpec(BaseModel):
    """PydanticAI agent architecture specification."""

    agent_name: str
    agent_type: Literal["single", "multi", "workflow"]
    system_prompt: str
    dependencies_class: str
    tools_required: List[str] = Field(default_factory=list)
    cultural_integration: Dict[str, bool] = Field(default_factory=dict)
    performance_targets: Dict[str, int] = Field(default_factory=dict)
    model_config: Dict[str, Any] = Field(default_factory=dict)


class PydanticAIPattern(BaseModel):
    """PydanticAI implementation pattern."""

    pattern_name: str
    use_case: str
    code_template: str
    best_practices: List[str]
    iraqi_considerations: List[str]


class MultiAgentWorkflow(BaseModel):
    """Multi-agent workflow specification."""

    workflow_name: str
    agents: List[str]
    coordination_pattern: Literal["sequential", "parallel", "hybrid"]
    context_sharing: bool
    cultural_validation_points: List[str]
    performance_budget_ms: int
