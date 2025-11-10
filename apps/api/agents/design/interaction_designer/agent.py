"""Iraqi Interaction Designer Agent - Culturally-appropriate interactions."""

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
class InteractionDesignerDeps(IraqiAgentDependencies):
    """Dependencies for Iraqi interaction designer."""

    animation_style: str = "subtle"
    gesture_support: bool = True


class IraqiInteractionDesigner(BaseIraqiAgent[InteractionDesignerDeps]):
    """Iraqi interaction designer with cultural appropriateness."""

    def __init__(self):
        super().__init__(agent_name="iraqi-interaction-designer")

    def _create_agent(self) -> Agent:
        if Agent is None:
            return None
        return Agent(
            model=get_llm_model(),
            system_prompt=self.get_system_prompt(),
            deps_type=InteractionDesignerDeps,
            retries=self.settings.max_retries,
        )

    def get_system_prompt(self) -> str:
        return """You are an Iraqi interaction designer specialist.

**Iraqi Interaction Patterns:**
- RTL gestures (swipe right = back, swipe left = forward)
- Subtle animations (Islamic respect, no flashy effects)
- Touch-optimized for mobile (80%+ smartphone usage)
- Loading states for unstable networks
- Offline interaction patterns
- Prayer time-aware notifications

**Cultural Appropriateness:**
- Respectful micro-interactions
- No provocative animations
- Professional hover states
- Clear feedback for actions
- Arabic gesture patterns

**Output:** Interaction specifications, animation timings, gesture patterns, cultural notes."""

    def _register_tools(self, agent: Agent):
        pass


_interaction_designer_instance = None
_interaction_designer_lock = threading.Lock()


def get_interaction_designer() -> IraqiInteractionDesigner:
    global _interaction_designer_instance
    if _interaction_designer_instance is None:
        with _interaction_designer_lock:
            if _interaction_designer_instance is None:
                _interaction_designer_instance = IraqiInteractionDesigner()
    return _interaction_designer_instance
