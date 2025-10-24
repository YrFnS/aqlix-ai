"""
Professional License Validator Service
Validates professional licenses for Iraqi domains (legal, medical, educational, engineering, organizational)
"""

from datetime import datetime
from typing import Optional, List, Dict
from enum import Enum
from pydantic import BaseModel


class ProfessionalDomain(str, Enum):
    """Iraqi professional domain types"""

    LEGAL = "legal"
    MEDICAL = "medical"
    EDUCATIONAL = "educational"
    ENGINEERING = "engineering"
    ORGANIZATIONAL = "organizational"


class IssuingAuthority(str, Enum):
    """Iraqi professional licensing authorities"""

    # Legal
    IRAQI_BAR_ASSOCIATION = "iraqi_bar_association"
    SUPREME_JUDICIAL_COUNCIL = "supreme_judicial_council"

    # Medical
    IRAQI_MEDICAL_ASSOCIATION = "iraqi_medical_association"
    MINISTRY_OF_HEALTH = "ministry_of_health"
    IRAQ_NURSING_COUNCIL = "iraq_nursing_council"

    # Educational
    MINISTRY_OF_EDUCATION = "ministry_of_education"
    MINISTRY_OF_HIGHER_EDUCATION = "ministry_of_higher_education"
    UNIVERSITY_ACCREDITATION = "university_accreditation"

    # Engineering
    IRAQI_ENGINEERS_SYNDICATE = "iraqi_engineers_syndicate"
    MINISTRY_OF_CONSTRUCTION = "ministry_of_construction"

    # Organizational
    MINISTRY_OF_PLANNING = "ministry_of_planning"
    IRAQI_CHAMBER_OF_COMMERCE = "iraqi_chamber_of_commerce"
    OTHER = "other"


class LicenseVerificationStatus(str, Enum):
    """License verification status"""

    PENDING = "pending"
    PENDING_MANUAL_VERIFICATION = "pending_manual_verification"
    VERIFIED = "verified"
    REJECTED = "rejected"
    EXPIRED = "expired"


class RequiredDocumentation(BaseModel):
    """Required documentation for license verification"""

    document_type: str
    description: str
    is_required: bool
    example_format: Optional[str] = None


class ProfessionalLicenseValidationResult(BaseModel):
    """Result of professional license validation"""

    is_valid: bool
    verification_status: LicenseVerificationStatus
    error_message: Optional[str] = None
    domain: Optional[ProfessionalDomain] = None
    issuing_authority: Optional[IssuingAuthority] = None
    license_format_valid: bool = False
    requires_manual_verification: bool = False
    required_documentation: List[RequiredDocumentation] = []
    validation_details: dict = {}


class ProfessionalLicenseValidator:
    """
    Professional License Validator

    Validates professional licenses for Iraqi domains with domain-specific rules.
    Most licenses require manual verification by domain authorities.

    License Format Examples:
    - Legal: "LAW-BGD-2020-12345" (Law-City-Year-Number)
    - Medical: "MED-PHYS-IMA-2018-98765" (Med-Specialty-Authority-Year-Number)
    - Educational: "EDU-UNI-MOE-2015-54321" (Edu-Level-Authority-Year-Number)
    - Engineering: "ENG-CIV-IES-2019-11111" (Eng-Discipline-Authority-Year-Number)
    - Organizational: "ORG-PM-MOP-2021-22222" (Org-Type-Authority-Year-Number)
    """

    # Domain-specific license format patterns
    LICENSE_PATTERNS = {
        ProfessionalDomain.LEGAL: r"^LAW-[A-Z]{3}-\d{4}-\d{5}$",
        ProfessionalDomain.MEDICAL: r"^MED-[A-Z]{4}-[A-Z]{3}-\d{4}-\d{5}$",
        ProfessionalDomain.EDUCATIONAL: r"^EDU-[A-Z]{3}-[A-Z]{3}-\d{4}-\d{5}$",
        ProfessionalDomain.ENGINEERING: r"^ENG-[A-Z]{3}-[A-Z]{3}-\d{4}-\d{5}$",
        ProfessionalDomain.ORGANIZATIONAL: r"^ORG-[A-Z]{2,4}-[A-Z]{3}-\d{4}-\d{5}$",
    }

    # Valid issuing authorities by domain
    DOMAIN_AUTHORITIES = {
        ProfessionalDomain.LEGAL: [
            IssuingAuthority.IRAQI_BAR_ASSOCIATION,
            IssuingAuthority.SUPREME_JUDICIAL_COUNCIL,
        ],
        ProfessionalDomain.MEDICAL: [
            IssuingAuthority.IRAQI_MEDICAL_ASSOCIATION,
            IssuingAuthority.MINISTRY_OF_HEALTH,
            IssuingAuthority.IRAQ_NURSING_COUNCIL,
        ],
        ProfessionalDomain.EDUCATIONAL: [
            IssuingAuthority.MINISTRY_OF_EDUCATION,
            IssuingAuthority.MINISTRY_OF_HIGHER_EDUCATION,
            IssuingAuthority.UNIVERSITY_ACCREDITATION,
        ],
        ProfessionalDomain.ENGINEERING: [
            IssuingAuthority.IRAQI_ENGINEERS_SYNDICATE,
            IssuingAuthority.MINISTRY_OF_CONSTRUCTION,
        ],
        ProfessionalDomain.ORGANIZATIONAL: [
            IssuingAuthority.MINISTRY_OF_PLANNING,
            IssuingAuthority.IRAQI_CHAMBER_OF_COMMERCE,
            IssuingAuthority.OTHER,
        ],
    }

    @staticmethod
    def validate_license_format(
        license_number: str, domain: ProfessionalDomain
    ) -> bool:
        """
        Validate license format for domain

        Args:
            license_number: Professional license number
            domain: Professional domain

        Returns:
            True if format is valid
        """
        if not license_number:
            return False

        import re

        pattern = ProfessionalLicenseValidator.LICENSE_PATTERNS.get(domain)
        if not pattern:
            return False

        return bool(re.match(pattern, license_number))

    @staticmethod
    def validate_issuing_authority(
        authority: IssuingAuthority, domain: ProfessionalDomain
    ) -> bool:
        """
        Validate that issuing authority is valid for domain

        Args:
            authority: Issuing authority
            domain: Professional domain

        Returns:
            True if authority is valid for domain
        """
        valid_authorities = ProfessionalLicenseValidator.DOMAIN_AUTHORITIES.get(domain)
        if not valid_authorities:
            return False

        return authority in valid_authorities

    @staticmethod
    def get_required_documentation(
        domain: ProfessionalDomain,
    ) -> List[RequiredDocumentation]:
        """
        Get required documentation for manual verification by domain

        Args:
            domain: Professional domain

        Returns:
            List of required documentation
        """
        documentation_map = {
            ProfessionalDomain.LEGAL: [
                RequiredDocumentation(
                    document_type="bar_certificate",
                    description="Iraqi Bar Association membership certificate",
                    is_required=True,
                    example_format="PDF or scanned image of official certificate",
                ),
                RequiredDocumentation(
                    document_type="law_degree",
                    description="Law degree from recognized Iraqi university",
                    is_required=True,
                    example_format="Certified copy of degree",
                ),
                RequiredDocumentation(
                    document_type="practicing_certificate",
                    description="Current practicing certificate",
                    is_required=True,
                    example_format="Valid certificate with expiry date",
                ),
            ],
            ProfessionalDomain.MEDICAL: [
                RequiredDocumentation(
                    document_type="medical_license",
                    description="Iraqi Medical Association license",
                    is_required=True,
                    example_format="PDF or scanned image of license card",
                ),
                RequiredDocumentation(
                    document_type="medical_degree",
                    description="Medical degree from recognized institution",
                    is_required=True,
                    example_format="Certified copy of MD/MBBS degree",
                ),
                RequiredDocumentation(
                    document_type="specialization_certificate",
                    description="Board certification or specialization certificate",
                    is_required=False,
                    example_format="Certificate from Iraqi Board or equivalent",
                ),
                RequiredDocumentation(
                    document_type="ministry_registration",
                    description="Ministry of Health registration certificate",
                    is_required=True,
                    example_format="Current registration certificate",
                ),
            ],
            ProfessionalDomain.EDUCATIONAL: [
                RequiredDocumentation(
                    document_type="teaching_license",
                    description="Ministry of Education teaching license",
                    is_required=True,
                    example_format="Valid teaching license document",
                ),
                RequiredDocumentation(
                    document_type="education_degree",
                    description="University degree in education or subject area",
                    is_required=True,
                    example_format="Bachelor's or Master's degree certificate",
                ),
                RequiredDocumentation(
                    document_type="employment_verification",
                    description="Letter from current educational institution",
                    is_required=True,
                    example_format="Official letter on institution letterhead",
                ),
            ],
            ProfessionalDomain.ENGINEERING: [
                RequiredDocumentation(
                    document_type="engineering_license",
                    description="Iraqi Engineers Syndicate membership",
                    is_required=True,
                    example_format="Current membership card or certificate",
                ),
                RequiredDocumentation(
                    document_type="engineering_degree",
                    description="Engineering degree from recognized university",
                    is_required=True,
                    example_format="Bachelor's or Master's in Engineering",
                ),
                RequiredDocumentation(
                    document_type="project_portfolio",
                    description="Portfolio of completed engineering projects",
                    is_required=False,
                    example_format="List or documentation of projects",
                ),
            ],
            ProfessionalDomain.ORGANIZATIONAL: [
                RequiredDocumentation(
                    document_type="organizational_credential",
                    description="Organizational management or leadership credential",
                    is_required=True,
                    example_format="Certificate or official credential",
                ),
                RequiredDocumentation(
                    document_type="management_degree",
                    description="Degree in business, management, or related field",
                    is_required=True,
                    example_format="Bachelor's or Master's degree certificate",
                ),
                RequiredDocumentation(
                    document_type="employment_verification",
                    description="Current organizational employment verification",
                    is_required=True,
                    example_format="Letter from employer on official letterhead",
                ),
            ],
        }

        return documentation_map.get(domain, [])

    @classmethod
    def validate(
        cls,
        license_number: str,
        domain: ProfessionalDomain,
        issuing_authority: Optional[IssuingAuthority] = None,
        license_issue_date: Optional[datetime] = None,
        license_expiry_date: Optional[datetime] = None,
    ) -> ProfessionalLicenseValidationResult:
        """
        Comprehensive professional license validation

        NOTE: Most professional licenses require manual verification by domain authorities.
        This validation performs format checks and sets appropriate status flags.

        Args:
            license_number: Professional license number
            domain: Professional domain
            issuing_authority: Issuing authority (optional)
            license_issue_date: License issue date (optional)
            license_expiry_date: License expiry date (optional)

        Returns:
            ProfessionalLicenseValidationResult with validation status
        """
        validation_details: Dict = {
            "format_valid": False,
            "authority_valid": False,
            "date_valid": False,
            "manual_verification_required": True,
        }

        # Step 1: Validate license format
        format_valid = cls.validate_license_format(license_number, domain)
        validation_details["format_valid"] = format_valid

        if not format_valid:
            return ProfessionalLicenseValidationResult(
                is_valid=False,
                verification_status=LicenseVerificationStatus.REJECTED,
                error_message=f"Invalid license format for {domain.value} domain. "
                f"Expected format: {cls.LICENSE_PATTERNS.get(domain)}",
                domain=domain,
                license_format_valid=False,
                requires_manual_verification=True,
                required_documentation=cls.get_required_documentation(domain),
                validation_details=validation_details,
            )

        # Step 2: Validate issuing authority (if provided)
        authority_valid = True
        if issuing_authority:
            authority_valid = cls.validate_issuing_authority(issuing_authority, domain)
            validation_details["authority_valid"] = authority_valid

            if not authority_valid:
                return ProfessionalLicenseValidationResult(
                    is_valid=False,
                    verification_status=LicenseVerificationStatus.REJECTED,
                    error_message=f"Invalid issuing authority {issuing_authority.value} for {domain.value} domain",
                    domain=domain,
                    issuing_authority=issuing_authority,
                    license_format_valid=True,
                    requires_manual_verification=True,
                    required_documentation=cls.get_required_documentation(domain),
                    validation_details=validation_details,
                )

        # Step 3: Validate license dates (if provided)
        date_valid = True
        current_date = datetime.now()

        if license_expiry_date:
            if license_expiry_date < current_date:
                return ProfessionalLicenseValidationResult(
                    is_valid=False,
                    verification_status=LicenseVerificationStatus.EXPIRED,
                    error_message=f"License expired on {license_expiry_date.strftime('%Y-%m-%d')}",
                    domain=domain,
                    issuing_authority=issuing_authority,
                    license_format_valid=True,
                    requires_manual_verification=True,
                    required_documentation=cls.get_required_documentation(domain),
                    validation_details=validation_details,
                )

        if license_issue_date:
            if license_issue_date > current_date:
                date_valid = False
                return ProfessionalLicenseValidationResult(
                    is_valid=False,
                    verification_status=LicenseVerificationStatus.REJECTED,
                    error_message=f"License issue date {license_issue_date.strftime('%Y-%m-%d')} is in the future",
                    domain=domain,
                    issuing_authority=issuing_authority,
                    license_format_valid=True,
                    requires_manual_verification=True,
                    required_documentation=cls.get_required_documentation(domain),
                    validation_details=validation_details,
                )

        validation_details["date_valid"] = date_valid

        # Format and dates are valid, but manual verification required
        return ProfessionalLicenseValidationResult(
            is_valid=True,
            verification_status=LicenseVerificationStatus.PENDING_MANUAL_VERIFICATION,
            error_message=None,
            domain=domain,
            issuing_authority=issuing_authority,
            license_format_valid=True,
            requires_manual_verification=True,
            required_documentation=cls.get_required_documentation(domain),
            validation_details=validation_details,
        )
