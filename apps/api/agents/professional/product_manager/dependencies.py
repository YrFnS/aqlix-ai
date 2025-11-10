"""
Iraqi Product Manager Dependencies

Dependencies for the Iraqi product manager agent.
"""

from dataclasses import dataclass
from typing import Literal, Optional, List
from apps.api.agents.core.models import IraqiAgentDependencies


@dataclass
class ProductManagerDeps(IraqiAgentDependencies):
    """
    Dependencies for Iraqi product manager agent.

    Extends base Iraqi agent dependencies with product management configuration.
    """

    # Product Configuration
    product_stage: Literal["ideation", "mvp", "growth", "maturity"] = "mvp"
    target_market: Literal[
        "baghdad", "basra", "erbil", "mosul", "nationwide", "mena"
    ] = "nationwide"

    # Market Analysis
    analyze_competition: bool = True
    include_market_sizing: bool = True
    validate_product_market_fit: bool = True

    # Feature Management
    prioritization_framework: Literal["rice", "moscow", "kano", "value_vs_effort"] = (
        "rice"
    )
    max_features_to_prioritize: int = 20

    # Iraqi Market Focus
    consider_infrastructure_constraints: bool = True
    include_payment_gateway_analysis: bool = True
    validate_cultural_acceptance: bool = True
    assess_regulatory_compliance: bool = True

    # Stakeholder Management
    include_user_personas: bool = True
    include_journey_maps: bool = False
    stakeholder_languages: List[str] = None

    # Roadmap Planning
    roadmap_timeframe_months: int = 12
    include_milestones: bool = True
    include_success_metrics: bool = True

    def __post_init__(self):
        if self.stakeholder_languages is None:
            self.stakeholder_languages = ["arabic", "english"]
