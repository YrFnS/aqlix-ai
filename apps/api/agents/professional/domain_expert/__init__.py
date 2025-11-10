"""
Iraqi Professional Domain Expert Agent

Professional domain expertise (legal, medical, educational, engineering).
"""

from .agent import IraqiProfessionalDomainExpert, get_domain_expert
from .dependencies import DomainExpertDeps
from .tools import DomainExpertTools
from .models import (
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
