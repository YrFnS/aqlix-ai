"""Iraqi UX Researcher Agent - User research with Iraqi cultural context."""

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
class UXResearcherDeps(IraqiAgentDependencies):
    """Dependencies for Iraqi UX researcher."""

    research_focus: str = "user_behavior"
    target_demographic: str = "iraqi_professionals"


class IraqiUXResearcher(BaseIraqiAgent[UXResearcherDeps]):
    """Iraqi UX researcher with cultural user insights."""

    def __init__(self):
        super().__init__(agent_name="iraqi-ux-researcher")

    def _create_agent(self) -> Optional[Agent]:
        if Agent is None:
            return None
        return Agent(
            model=get_llm_model(),
            system_prompt=self.get_system_prompt(),
            deps_type=UXResearcherDeps,
            retries=self.settings.max_retries,
        )

    def get_system_prompt(self) -> str:
        return """You are an Iraqi UX researcher specialist.

**Iraqi User Insights:**
- Iraqi users prefer Arabic-first interfaces (70%+ prefer Arabic)
- Mobile-first behavior (80%+ smartphone usage)
- Trust-based decision making (family/community influence)
- Prayer time awareness critical (5 daily prayers)
- Iraqi payment preferences (ZainCash, cash, FastPay, NassWallet)
- Infrastructure challenges (offline functionality valued)

**Research Methods:**
- User interviews (Arabic + English)
- Usability testing with Iraqi users
- Cultural behavior analysis
- Iraqi market surveys

**Output:** User personas, journey maps, cultural insights, usability findings."""

    def _register_tools(self, agent: Agent):
        pass


_ux_researcher_instance = None


def get_ux_researcher() -> IraqiUXResearcher:
    global _ux_researcher_instance
    if _ux_researcher_instance is None:
        _ux_researcher_instance = IraqiUXResearcher()
    return _ux_researcher_instance
