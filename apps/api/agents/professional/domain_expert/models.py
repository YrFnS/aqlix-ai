"""
Professional Domain Expert Models

Pydantic models for professional domain expert responses.
"""

from typing import Optional, Literal, Dict, Any, List
from pydantic import BaseModel, Field


class ProfessionalTerminology(BaseModel):
    """Professional domain terminology with Arabic translation."""

    term_english: str = Field(description="Term in English")
    term_arabic: str = Field(description="Term in Arabic")
    domain: str = Field(description="Professional domain")
    definition_english: str = Field(description="Definition in English")
    definition_arabic: Optional[str] = Field(
        default=None, description="Definition in Arabic"
    )
    usage_context: str = Field(description="Context where term is used")
    related_terms: List[str] = Field(
        default_factory=list, description="Related terminology"
    )


class ProfessionalReference(BaseModel):
    """Reference to Iraqi professional standards or regulations."""

    reference_id: str = Field(description="Reference identifier")
    reference_type: Literal[
        "iraqi_law", "regulation", "standard", "guideline", "best_practice"
    ] = Field(description="Type of reference")
    title: str = Field(description="Reference title")
    title_arabic: Optional[str] = Field(default=None, description="Arabic title")
    issuing_authority: str = Field(
        description="Issuing authority (e.g., Iraqi Ministry)"
    )
    year: Optional[int] = Field(default=None, description="Year of issuance")
    article_number: Optional[str] = Field(
        default=None, description="Article/section number"
    )
    summary: str = Field(description="Brief summary of reference")


class DomainSpecificResponse(BaseModel):
    """Professional domain expert response."""

    # Core Response
    domain: Literal[
        "legal", "medical", "educational", "engineering", "organizational"
    ] = Field(description="Professional domain")
    expertise_level: Literal["basic", "intermediate", "expert"] = Field(
        description="Expertise level of response"
    )
    response_content: str = Field(description="Main response content")
    response_content_arabic: Optional[str] = Field(
        default=None, description="Arabic translation of response"
    )

    # Professional Context
    terminology_used: List[ProfessionalTerminology] = Field(
        default_factory=list, description="Professional terminology used"
    )
    references: List[ProfessionalReference] = Field(
        default_factory=list, description="Iraqi professional references"
    )

    # Iraqi Context
    iraqi_specific_considerations: List[str] = Field(
        default_factory=list, description="Iraq-specific considerations"
    )
    cultural_compliance_notes: List[str] = Field(
        default_factory=list, description="Cultural compliance notes"
    )

    # Professional Disclaimers
    disclaimer: Optional[str] = Field(
        default=None, description="Professional liability disclaimer"
    )
    requires_licensed_professional: bool = Field(
        default=False, description="Whether licensed professional consultation required"
    )

    # Additional Resources
    recommended_resources: List[str] = Field(
        default_factory=list, description="Recommended resources"
    )
    next_steps: List[str] = Field(
        default_factory=list, description="Suggested next steps"
    )


class LegalDomainResponse(DomainSpecificResponse):
    """Legal domain response with Iraqi law specifics."""

    legal_specialty: Optional[str] = Field(
        default=None, description="Legal specialty (commercial, civil, criminal)"
    )
    applicable_iraqi_laws: List[str] = Field(
        default_factory=list, description="Applicable Iraqi laws"
    )
    court_jurisdiction: Optional[str] = Field(
        default=None, description="Relevant Iraqi court jurisdiction"
    )


class MedicalDomainResponse(DomainSpecificResponse):
    """Medical domain response with Iraqi healthcare context."""

    medical_specialization: Optional[str] = Field(
        default=None, description="Medical specialization"
    )
    iraqi_healthcare_system_notes: List[str] = Field(
        default_factory=list, description="Iraqi healthcare system considerations"
    )
    medication_availability_iraq: Optional[str] = Field(
        default=None, description="Medication availability in Iraq"
    )


class EducationalDomainResponse(DomainSpecificResponse):
    """Educational domain response with Iraqi education system context."""

    educational_level: Optional[str] = Field(
        default=None, description="Educational level (primary, secondary, university)"
    )
    iraqi_curriculum_alignment: bool = Field(
        default=False, description="Whether aligned with Iraqi national curriculum"
    )
    ministry_of_education_standards: List[str] = Field(
        default_factory=list, description="Relevant Iraqi MoE standards"
    )
