"""
Professional License Validator Service
Validates professional licenses for Iraqi domains (legal, medical, educational, engineering, organizational)
"""

from datetime import datetime
from typing import Optional, List, Dict, Tuple
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


import re


class ProfessionalLicenseValidator:
    """
    Professional License Validator

    Validates professional licenses for Iraqi domains with domain-specific rules.
    Most licenses require manual verification by domain authorities.

    License Format Examples (Simplified):
    - Legal: "LAW-12345-2020" (LAW-<5 digits>-<year>)
    - Medical: "MED-123456-SU" (MED-<6 digits>-<specialty code>)
    - Educational: "EDU-789012-BA" (EDU-<6 digits>-<region>)
    - Engineering: "ENG-345678-CE" (ENG-<6 digits>-<discipline>)
    - Organizational: "ORG-901234-MA" (ORG-<6 digits>-<type>)

    Valid Codes:
    - Medical Specialties: SU (Surgery), IM (Internal Medicine), PED (Pediatrics), etc.
    - Educational Regions: BA (Baghdad), BS (Basra), NI (Nineveh), ER (Erbil), etc.
    - Engineering Disciplines: CE (Civil), ME (Mechanical), EE (Electrical), etc.
    - Organizational Types: MA (Management), HR (Human Resources), FI (Finance), etc.
    """

    # Domain-specific license format patterns (simplified format)
    # Legal: LAW-12345-2020 (LAW-<5 digits>-<year>)
    # Medical: MED-123456-SU (MED-<6 digits>-<specialty code>)
    # Educational: EDU-789012-BA (EDU-<6 digits>-<region>)
    # Engineering: ENG-345678-CE (ENG-<6 digits>-<discipline>)
    # Organizational: ORG-901234-MA (ORG-<6 digits>-<type>)
    LICENSE_PATTERNS = {
        ProfessionalDomain.LEGAL: r"^LAW-\d{5}-\d{4}$",
        ProfessionalDomain.MEDICAL: r"^MED-\d{6}-[A-Z]{2,4}$",
        ProfessionalDomain.EDUCATIONAL: r"^EDU-\d{6}-[A-Z]{2}$",
        ProfessionalDomain.ENGINEERING: r"^ENG-\d{6}-[A-Z]{2}$",
        ProfessionalDomain.ORGANIZATIONAL: r"^ORG-\d{6}-[A-Z]{2}$",
    }

    # Valid specialty codes for medical domain
    MEDICAL_SPECIALTY_CODES = {
        "SU": "Surgery",
        "IM": "Internal Medicine",
        "PED": "Pediatrics",
        "OB": "Obstetrics",
        "GYN": "Gynecology",
        "CARD": "Cardiology",
        "ORTH": "Orthopedics",
        "NEUR": "Neurology",
        "DERM": "Dermatology",
        "PSY": "Psychiatry",
        "RAD": "Radiology",
        "ANES": "Anesthesiology",
    }

    # Valid region codes for educational domain (Iraqi governorates)
    EDUCATIONAL_REGION_CODES = {
        "BA": "Baghdad",
        "BS": "Basra",
        "NI": "Nineveh (Mosul)",
        "ER": "Erbil",
        "SU": "Sulaymaniyah",
        "AN": "Anbar",
        "DI": "Diyala",
        "KI": "Kirkuk",
        "NA": "Najaf",
        "KA": "Karbala",
        "WA": "Wasit",
        "SA": "Salah ad-Din",
        "QA": "Qadisiyyah",
        "BB": "Babil",
        "DH": "Dhi Qar",
        "MY": "Maysan",
        "MU": "Muthanna",
        "DU": "Duhok",
    }

    # Valid discipline codes for engineering domain
    ENGINEERING_DISCIPLINE_CODES = {
        "CE": "Civil Engineering",
        "ME": "Mechanical Engineering",
        "EE": "Electrical Engineering",
        "CH": "Chemical Engineering",
        "AR": "Architecture",
        "PE": "Petroleum Engineering",
        "IE": "Industrial Engineering",
        "CS": "Computer Engineering",
        "EN": "Environmental Engineering",
        "AG": "Agricultural Engineering",
    }

    # Valid type codes for organizational domain
    ORGANIZATIONAL_TYPE_CODES = {
        "MA": "Management",
        "HR": "Human Resources",
        "FI": "Finance",
        "IT": "Information Technology",
        "PR": "Project Management",
        "QA": "Quality Assurance",
        "OP": "Operations",
        "SA": "Strategic Analysis",
        "AD": "Administration",
        "CO": "Consulting",
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

        pattern = ProfessionalLicenseValidator.LICENSE_PATTERNS.get(domain)
        if not pattern:
            return False

        return bool(re.match(pattern, license_number))

    @classmethod
    def validate_legal_license(cls, license_number: str) -> Tuple[bool, Optional[str]]:
        """
        Validate legal professional license format
        Format: LAW-12345-2020 (LAW-<5 digits>-<year>)

        Args:
            license_number: License number to validate

        Returns:
            Tuple of (is_valid, error_message)
        """
        if not license_number:
            return False, "License number is required"

        # Check basic format
        if not re.match(cls.LICENSE_PATTERNS[ProfessionalDomain.LEGAL], license_number):
            return (
                False,
                "Invalid legal license format. Expected: LAW-12345-2020 (LAW-<5 digits>-<year>)",
            )

        # Extract year component
        parts = license_number.split("-")
        if len(parts) < 3:
            return (
                False,
                "Invalid legal license format. Expected: LAW-12345-2020",
            )
        year = int(parts[2])

        # Validate year is reasonable (1970 - current year)
        current_year = datetime.now().year
        if year < 1970 or year > current_year:
            return (
                False,
                f"Invalid year in license. Year must be between 1970 and {current_year}",
            )

        return True, None

    @classmethod
    def validate_medical_license(
        cls, license_number: str
    ) -> Tuple[bool, Optional[str]]:
        """
        Validate medical professional license format
        Format: MED-123456-SU (MED-<6 digits>-<specialty code>)

        Args:
            license_number: License number to validate

        Returns:
            Tuple of (is_valid, error_message)
        """
        if not license_number:
            return False, "License number is required"

        # Check basic format
        if not re.match(
            cls.LICENSE_PATTERNS[ProfessionalDomain.MEDICAL], license_number
        ):
            return (
                False,
                "Invalid medical license format. Expected: MED-123456-SU (MED-<6 digits>-<specialty code>)",
            )

        # Extract specialty code
        parts = license_number.split("-")
        if len(parts) < 3:
            return (
                False,
                "Invalid medical license format. Expected: MED-123456-SU",
            )
        specialty_code = parts[2]

        # Validate specialty code
        if specialty_code not in cls.MEDICAL_SPECIALTY_CODES:
            valid_codes = ", ".join(cls.MEDICAL_SPECIALTY_CODES.keys())
            return (
                False,
                f"Invalid medical specialty code '{specialty_code}'. Valid codes: {valid_codes}",
            )

        return True, None

    @classmethod
    def validate_educational_license(
        cls, license_number: str
    ) -> Tuple[bool, Optional[str]]:
        """
        Validate educational professional license format
        Format: EDU-789012-BA (EDU-<6 digits>-<region>)

        Args:
            license_number: License number to validate

        Returns:
            Tuple of (is_valid, error_message)
        """
        if not license_number:
            return False, "License number is required"

        # Check basic format
        if not re.match(
            cls.LICENSE_PATTERNS[ProfessionalDomain.EDUCATIONAL], license_number
        ):
            return (
                False,
                "Invalid educational license format. Expected: EDU-789012-BA (EDU-<6 digits>-<region>)",
            )

        # Extract region code
        parts = license_number.split("-")
        if len(parts) < 3:
            return (
                False,
                "Invalid educational license format. Expected: EDU-789012-BA",
            )
        region_code = parts[2]

        # Validate region code
        if region_code not in cls.EDUCATIONAL_REGION_CODES:
            valid_codes = ", ".join(cls.EDUCATIONAL_REGION_CODES.keys())
            return (
                False,
                f"Invalid region code '{region_code}'. Valid codes: {valid_codes}",
            )

        return True, None

    @classmethod
    def validate_engineering_license(
        cls, license_number: str
    ) -> Tuple[bool, Optional[str]]:
        """
        Validate engineering professional license format
        Format: ENG-345678-CE (ENG-<6 digits>-<discipline>)

        Args:
            license_number: License number to validate

        Returns:
            Tuple of (is_valid, error_message)
        """
        if not license_number:
            return False, "License number is required"

        # Check basic format
        if not re.match(
            cls.LICENSE_PATTERNS[ProfessionalDomain.ENGINEERING], license_number
        ):
            return (
                False,
                "Invalid engineering license format. Expected: ENG-345678-CE (ENG-<6 digits>-<discipline>)",
            )

        # Extract discipline code
        parts = license_number.split("-")
        if len(parts) < 3:
            return (
                False,
                "Invalid engineering license format. Expected: ENG-345678-CE",
            )
        discipline_code = parts[2]

        # Validate discipline code
        if discipline_code not in cls.ENGINEERING_DISCIPLINE_CODES:
            valid_codes = ", ".join(cls.ENGINEERING_DISCIPLINE_CODES.keys())
            return (
                False,
                f"Invalid discipline code '{discipline_code}'. Valid codes: {valid_codes}",
            )

        return True, None

    @classmethod
    def validate_organizational_license(
        cls, license_number: str
    ) -> Tuple[bool, Optional[str]]:
        """
        Validate organizational professional license format
        Format: ORG-901234-MA (ORG-<6 digits>-<type>)

        Args:
            license_number: License number to validate

        Returns:
            Tuple of (is_valid, error_message)
        """
        if not license_number:
            return False, "License number is required"

        # Check basic format
        if not re.match(
            cls.LICENSE_PATTERNS[ProfessionalDomain.ORGANIZATIONAL], license_number
        ):
            return (
                False,
                "Invalid organizational license format. Expected: ORG-901234-MA (ORG-<6 digits>-<type>)",
            )

        # Extract type code
        parts = license_number.split("-")
        if len(parts) < 3:
            return (
                False,
                "Invalid organizational license format. Expected: ORG-901234-MA",
            )
        type_code = parts[2]

        # Validate type code
        if type_code not in cls.ORGANIZATIONAL_TYPE_CODES:
            valid_codes = ", ".join(cls.ORGANIZATIONAL_TYPE_CODES.keys())
            return False, f"Invalid type code '{type_code}'. Valid codes: {valid_codes}"

        return True, None

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

        # Step 1: Validate license format with domain-specific validators
        format_valid = False
        format_error = None

        # Use domain-specific validators for detailed error messages
        if domain == ProfessionalDomain.LEGAL:
            format_valid, format_error = cls.validate_legal_license(license_number)
        elif domain == ProfessionalDomain.MEDICAL:
            format_valid, format_error = cls.validate_medical_license(license_number)
        elif domain == ProfessionalDomain.EDUCATIONAL:
            format_valid, format_error = cls.validate_educational_license(
                license_number
            )
        elif domain == ProfessionalDomain.ENGINEERING:
            format_valid, format_error = cls.validate_engineering_license(
                license_number
            )
        elif domain == ProfessionalDomain.ORGANIZATIONAL:
            format_valid, format_error = cls.validate_organizational_license(
                license_number
            )
        else:
            # Fallback to basic format validation
            format_valid = cls.validate_license_format(license_number, domain)
            if not format_valid:
                format_error = f"Invalid license format for {domain.value} domain"

        validation_details["format_valid"] = format_valid

        if not format_valid:
            return ProfessionalLicenseValidationResult(
                is_valid=False,
                verification_status=LicenseVerificationStatus.REJECTED,
                error_message=format_error
                or f"Invalid license format for {domain.value} domain",
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
