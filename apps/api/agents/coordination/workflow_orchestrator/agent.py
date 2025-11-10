"""Iraqi Workflow Orchestrator Agent - Multi-agent coordination."""

import threading

try:
    from pydantic_ai import Agent
except ImportError:
    Agent = None

from dataclasses import dataclass
from apps.api.agents.core.base_agent import BaseIraqiAgent
from apps.api.agents.core.providers import get_llm_model
from apps.api.agents.core.models import IraqiAgentDependencies


@dataclass
class WorkflowOrchestratorDeps(IraqiAgentDependencies):
    """Dependencies for Iraqi workflow orchestrator."""

    coordination_pattern: str = "sequential"  # sequential, parallel, hybrid
    enable_cultural_gates: bool = True
    max_agents_parallel: int = 3


class IraqiWorkflowOrchestrator(BaseIraqiAgent[WorkflowOrchestratorDeps]):
    """Iraqi workflow orchestrator for multi-agent coordination."""

    def __init__(self):
        super().__init__(agent_name="iraqi-workflow-orchestrator")

    def _create_agent(self) -> Agent:
        if Agent is None:
            return None
        return Agent(
            model=get_llm_model(),
            system_prompt=self.get_system_prompt(),
            deps_type=WorkflowOrchestratorDeps,
            retries=self.settings.max_retries,
        )

    def get_system_prompt(self) -> str:
        return """You are an Iraqi workflow orchestrator specialist.

**Multi-Agent Coordination:**
- Sequential workflows (Agent A → Agent B → Agent C)
- Parallel workflows (Agents A, B, C execute simultaneously)
- Hybrid workflows (mix of sequential and parallel)
- Cultural validation gates between agent executions

**Iraqi Workflow Patterns:**
1. **Cultural Validation Chain**: cultural-validator → content → arabic-processor
2. **UI Development Chain**: ux-researcher → ui-designer → interaction-designer → accessibility
3. **Payment Integration**: payment-guardian → payment-tester → service-coordinator
4. **Professional Analysis**: business-analyst → domain-expert → product-manager

**Coordination Principles:**
- Always validate cultural compliance between agents (95%+)
- Track performance budgets (<300ms per agent)
- Enable context sharing for efficient workflows
- Implement graceful fallback for agent failures
- Maintain Islamic compliance throughout pipeline (100%)

**Output:** Workflow execution plans, agent coordination specs, performance reports."""

    def _register_tools(self, agent: Agent):
        pass


_workflow_orchestrator_instance = None
_workflow_orchestrator_lock = threading.Lock()


def get_workflow_orchestrator() -> IraqiWorkflowOrchestrator:
    global _workflow_orchestrator_instance
    if _workflow_orchestrator_instance is None:
        with _workflow_orchestrator_lock:
            if _workflow_orchestrator_instance is None:
                _workflow_orchestrator_instance = IraqiWorkflowOrchestrator()
    return _workflow_orchestrator_instance
