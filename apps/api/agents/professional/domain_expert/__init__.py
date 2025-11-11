"""
Iraqi Professional Domain Expert Agent

Professional domain expertise (legal, medical, educational, engineering).
"""

from apps.api.agents.professional.domain_expert.agent import (
    IraqiProfessionalDomainExpert,
    get_domain_expert,
)
from apps.api.agents.professional.domain_expert.dependencies import DomainExpertDeps
from apps.api.agents.professional.domain_expert.tools import DomainExpertTools
from apps.api.agents.professional.domain_expert.models import (
    ProfessionalTerminology,
    ProfessionalReference,
    DomainSpecificResponse,
    LegalDomainResponse,
    MedicalDomainResponse,
    EducationalDomainResponse,
)

__all__ = [
    "IraqiProfessionalDomainExpert",
    "get_domain_expert",
    "DomainExpertDeps",
    "DomainExpertTools",
    "ProfessionalTerminology",
    "ProfessionalReference",
    "DomainSpecificResponse",
    "LegalDomainResponse",
    "MedicalDomainResponse",
    "EducationalDomainResponse",
]
