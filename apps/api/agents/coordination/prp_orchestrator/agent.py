"""Iraqi PRP Execution Orchestrator Agent - PRP workflow management with 95%+ accuracy."""

try:
    from pydantic_ai import Agent
except ImportError:
    Agent = None

from typing import Optional
from dataclasses import dataclass
from apps.api.agents.core.base_agent import BaseIraqiAgent
from apps.api.agents.core.providers import get_llm_model
from apps.api.agents.core.models import IraqiAgentDependencies


@dataclass
class PRPOrchestratorDeps(IraqiAgentDependencies):
    """Dependencies for Iraqi PRP orchestrator."""

    prp_execution_mode: str = "systematic"  # systematic, parallel, adaptive
    health_assessment_enabled: bool = True
    accuracy_target: float = 0.95  # 95%+ PRP execution accuracy


class IraqiPRPExecutionOrchestrator(BaseIraqiAgent[PRPOrchestratorDeps]):
    """Iraqi PRP execution orchestrator with 95%+ accuracy."""

    def __init__(self):
        super().__init__(agent_name="iraqi-prp-execution-orchestrator")

    def _create_agent(self) -> Optional[Agent]:
        if Agent is None:
            return None
        return Agent(
            model=get_llm_model(),
            system_prompt=self.get_system_prompt(),
            deps_type=PRPOrchestratorDeps,
            retries=self.settings.max_retries,
        )

    def get_system_prompt(self) -> str:
        return """You are an Iraqi PRP execution orchestrator specialist.

**PRP Workflow Management:**
- Systematic PRP execution (56 PRPs: 1-47 MVP, 48-56 Post-MVP)
- Health assessment before/after PRP execution
- Dependency analysis and intelligent sequencing
- Cultural validation gates (95%+ required)
- Performance tracking and optimization

**PRP Execution Accuracy (95%+ target):**
- Validate all requirements before implementation
- Track PRP completion status in Archon
- Ensure cultural compliance in all PRPs
- Test coverage validation
- Documentation completeness checks

**Iraqi Context Integration:**
- All PRPs must respect Iraqi cultural norms
- Arabic language support validated
- Payment gateway integration tested
- Performance targets met (<300ms)
- Islamic compliance verified (100%)

**Output:** PRP execution plans, health reports, dependency graphs, completion tracking."""

    def _register_tools(self, agent: Agent):
        pass


_prp_orchestrator_instance = None


def get_prp_orchestrator() -> IraqiPRPExecutionOrchestrator:
    global _prp_orchestrator_instance
    if _prp_orchestrator_instance is None:
        _prp_orchestrator_instance = IraqiPRPExecutionOrchestrator()
    return _prp_orchestrator_instance
