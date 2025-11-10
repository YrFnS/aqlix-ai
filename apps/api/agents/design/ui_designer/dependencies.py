"""Iraqi UI Designer Dependencies"""

from dataclasses import dataclass
from typing import Literal, Optional
from apps.api.agents.core.models import IraqiAgentDependencies


@dataclass
class UIDesignerDeps(IraqiAgentDependencies):
    """Dependencies for Iraqi UI designer agent."""

    design_style: Literal["modern", "traditional", "mixed"] = "modern"
    color_scheme: Literal["light", "dark", "auto"] = "auto"
    target_platform: Literal["web", "mobile", "desktop"] = "web"

    # Iraqi Design Requirements
    rtl_first_design: bool = True
    arabic_typography_optimized: bool = True
    islamic_design_principles: bool = True

    # Cultural Preferences
    prefer_warm_colors: bool = True  # Iraqi cultural preference
    avoid_western_imagery: bool = True
    professional_aesthetic: bool = True
