"""
Iraqi Professional Domain Expert Dependencies

Dependencies for the Iraqi professional domain expert agent.
"""

from dataclasses import dataclass
from typing import Literal, Optional, List
from apps.api.agents.core.models import IraqiAgentDependencies


@dataclass
class DomainExpertDeps(IraqiAgentDependencies):
    """
    Dependencies for Iraqi professional domain expert agent.

    Extends base Iraqi agent dependencies with domain expert configuration.
    """

    # Domain Configuration
    primary_domain: Literal[
        "legal", "medical", "educational", "engineering", "organizational"
    ] = "legal"
    expertise_level: Literal["basic", "intermediate", "expert"] = "expert"

    # Iraqi Professional Context
    target_audience: Literal[
        "professionals", "students", "general_public", "government"
    ] = "professionals"
    regulation_focus: bool = True  # Focus on Iraqi regulations

    # Language and Terminology
    terminology_mode: Literal["formal", "simplified", "mixed"] = "formal"
    include_arabic_terms: bool = True
    include_definitions: bool = True

    # Response Configuration
    include_references: bool = True
    include_disclaimers: bool = True  # Professional liability disclaimers
    cite_iraqi_law: bool = True  # For legal domain

    # Domain-Specific Features
    medical_specialization: Optional[str] = None  # cardiology, pediatrics, etc.
    legal_specialty: Optional[str] = None  # commercial, civil, criminal, etc.
    educational_level: Optional[str] = None  # primary, secondary, university
    engineering_discipline: Optional[str] = None  # civil, electrical, software, etc.
