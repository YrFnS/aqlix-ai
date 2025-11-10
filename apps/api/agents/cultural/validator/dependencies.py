"""
Cultural Validator Dependencies

Dependencies for the Iraqi cultural validation agent.
"""

from dataclasses import dataclass
from typing import Literal, Optional
from apps.api.agents.core.models import IraqiAgentDependencies


@dataclass
class CulturalValidatorDeps(IraqiAgentDependencies):
    """
    Dependencies for Iraqi cultural validation agent.

    Extends base Iraqi agent dependencies with validator-specific configuration.
    """

    # Cultural validation configuration
    validation_strictness: Literal["strict", "moderate", "flexible"] = "strict"

    # Validation scope
    validate_islamic_compliance: bool = True
    validate_political_neutrality: bool = True
    validate_professional_appropriateness: bool = True

    # Output configuration
    include_improvement_suggestions: bool = True
    filter_sensitive_content: bool = True
