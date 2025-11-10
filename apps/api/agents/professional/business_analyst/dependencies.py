"""
Iraqi Business Analyst Dependencies

Dependencies for the Iraqi business analysis agent.
"""

from dataclasses import dataclass
from typing import Literal, Optional, List
from apps.api.agents.core.models import IraqiAgentDependencies


@dataclass
class BusinessAnalystDeps(IraqiAgentDependencies):
    """
    Dependencies for Iraqi business analyst agent.

    Extends base Iraqi agent dependencies with business analysis configuration.
    """

    # Business Analysis Configuration
    analysis_depth: Literal["quick", "standard", "comprehensive"] = "standard"
    focus_area: Optional[str] = None  # requirements, roi, processes, compliance

    # Iraqi Market Context
    target_market: Literal["baghdad", "basra", "erbil", "mosul", "nationwide"] = (
        "nationwide"
    )
    business_sector: Optional[str] = (
        None  # retail, finance, healthcare, education, etc.
    )
    company_size: Literal["startup", "sme", "enterprise"] = "sme"

    # Requirements Analysis
    include_user_stories: bool = True
    include_acceptance_criteria: bool = True
    include_technical_specs: bool = True

    # ROI Analysis
    calculate_roi: bool = False
    roi_timeframe_months: int = 12
    currency: Literal["IQD", "USD"] = "IQD"

    # Stakeholder Management
    stakeholder_languages: List[str] = None  # ["arabic", "english"]
    include_stakeholder_matrix: bool = True

    # Compliance
    validate_iraqi_regulations: bool = True
    include_commercial_law_check: bool = True

    def __post_init__(self):
        if self.stakeholder_languages is None:
            self.stakeholder_languages = ["arabic", "english"]
