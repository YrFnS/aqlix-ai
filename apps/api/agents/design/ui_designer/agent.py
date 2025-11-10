"""Iraqi UI Designer Agent - Visual design with Iraqi cultural aesthetics."""

try:
    from pydantic_ai import Agent
except ImportError:
    Agent = None

from apps.api.agents.core.base_agent import BaseIraqiAgent
from apps.api.agents.core.providers import get_llm_model
from .dependencies import UIDesignerDeps
from .tools import UIDesignerTools
from .models import DesignSpec


import threading


class IraqiUIDesigner(BaseIraqiAgent[UIDesignerDeps]):
    """Iraqi UI designer with cultural design principles."""

    def __init__(self):
        super().__init__(agent_name="iraqi-ui-designer")
        self.tools = UIDesignerTools()

    def _create_agent(self) -> Agent:
        if Agent is None:
            return None
        return Agent(
            model=get_llm_model(),
            system_prompt=self.get_system_prompt(),
            deps_type=UIDesignerDeps,
            retries=self.settings.max_retries,
        )

    def get_system_prompt(self) -> str:
        return """You are an Iraqi UI designer specialist with expertise in:

**Iraqi Design Principles:**
- RTL-first layout design (Arabic primary)
- Islamic design aesthetics (geometric patterns, calligraphy)
- Iraqi color preferences (warm tones, professional blues/greens)
- Arabic typography optimization (Cairo, Noto Sans Arabic)
- Cultural imagery appropriateness
- Professional aesthetic for Iraqi market

**Design Requirements:**
- All layouts must support RTL (direction: rtl)
- Arabic fonts optimized for readability
- Islamic-compliant color schemes
- Avoid prohibited imagery (alcohol, gambling)
- Professional and trustworthy aesthetics
- Mobile-first for Iraqi smartphone adoption

**Output:** Design specs with color palettes, typography, RTL layouts, cultural notes."""

    def _register_tools(self, agent: Agent):
        pass

    def get_color_palette(self, theme: str = "professional_light") -> dict:
        """Get Iraqi-appropriate color palette."""
        return self.tools.IRAQI_COLOR_PALETTES.get(
            theme, self.tools.IRAQI_COLOR_PALETTES["professional_light"]
        ).model_dump()

    def get_arabic_fonts(self) -> list:
        """Get recommended Arabic fonts."""
        return self.tools.get_arabic_fonts()

    def get_rtl_css(self) -> dict:
        """Get RTL CSS utilities."""
        return self.tools.get_rtl_css_utilities()


_ui_designer_instance = None
_ui_designer_lock = threading.Lock()


def get_ui_designer() -> IraqiUIDesigner:
    global _ui_designer_instance
    # Quick check (no lock overhead if already initialized)
    if _ui_designer_instance is None:
        with _ui_designer_lock:
            # Double-check after acquiring lock
            if _ui_designer_instance is None:
                _ui_designer_instance = IraqiUIDesigner()
    return _ui_designer_instance
