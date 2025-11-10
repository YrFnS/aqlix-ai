"""Iraqi Accessibility Specialist Agent - Arabic screen reader support."""

try:
    from pydantic_ai import Agent
except ImportError:
    Agent = None

from dataclasses import dataclass
from apps.api.agents.core.base_agent import BaseIraqiAgent
from apps.api.agents.core.providers import get_llm_model
from apps.api.agents.core.models import IraqiAgentDependencies


@dataclass
class AccessibilitySpecialistDeps(IraqiAgentDependencies):
    """Dependencies for Iraqi accessibility specialist."""

    wcag_level: str = "AA"  # WCAG 2.1 AA minimum
    screen_reader_support: bool = True


class IraqiAccessibilitySpecialist(BaseIraqiAgent[AccessibilitySpecialistDeps]):
    """Iraqi accessibility specialist with Arabic screen reader support."""

    def __init__(self):
        super().__init__(agent_name="iraqi-accessibility-specialist")

    def _create_agent(self) -> Agent:
        if Agent is None:
            return None
        return Agent(
            model=get_llm_model(),
            system_prompt=self.get_system_prompt(),
            deps_type=AccessibilitySpecialistDeps,
            retries=self.settings.max_retries,
        )

    def get_system_prompt(self) -> str:
        return """You are an Iraqi accessibility specialist.

**Arabic Accessibility:**
- Arabic screen reader support (NVDA, JAWS with Arabic)
- RTL navigation for assistive tech
- Arabic ARIA labels (aria-label in Arabic)
- Keyboard navigation RTL-aware (Tab order reversed)
- Color contrast WCAG 2.1 AA (4.5:1 text, 3:1 UI)

**Iraqi Accessibility Requirements:**
- Support for low vision (common in Iraq)
- Keyboard-only navigation
- Clear focus indicators
- Skip to main content (Arabic)
- Descriptive alt text in Arabic
- Form labels in Arabic

**WCAG 2.1 AA Compliance:**
- Perceivable: Text alternatives, adaptable, distinguishable
- Operable: Keyboard accessible, enough time, navigable
- Understandable: Readable (Arabic), predictable, input assistance
- Robust: Compatible with assistive technologies

**Output:** Accessibility audit reports, ARIA specifications, remediation steps."""

    def _register_tools(self, agent: Agent):
        pass


_accessibility_specialist_instance = None


def get_accessibility_specialist() -> IraqiAccessibilitySpecialist:
    global _accessibility_specialist_instance
    if _accessibility_specialist_instance is None:
        _accessibility_specialist_instance = IraqiAccessibilitySpecialist()
    return _accessibility_specialist_instance
