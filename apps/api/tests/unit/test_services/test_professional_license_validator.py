"""
Unit tests for Professional License Validator
Tests all 5 professional domains, format validation, and error cases
"""

import pytest
from apps.api.services.professional_license_validator import (
    ProfessionalLicenseValidator,
    LicenseValidationResult,
    ProfessionalDomain,
)


class TestProfessionalLicenseValidatorBasicFormat:
    """Test basic format validation for all domains"""

    def test_valid_legal_license(self):
        """Valid legal license format LAW-12345-2025"""
        result = ProfessionalLicenseValidator.validate(
            license_number="LAW-12345-2025",
            domain=ProfessionalDomain.LEGAL,
        )
        assert result.is_valid is True
        assert result.error_message is None

    def test_valid_medical_license(self):
        """Valid medical license format MED-123456-SU (MED-<6 digits>-<specialty code>)"""
        result = ProfessionalLicenseValidator.validate(
            license_number="MED-123456-SU",
            domain=ProfessionalDomain.MEDICAL,
        )
        assert result.is_valid is True
        assert result.error_message is None

    def test_valid_educational_license(self):
        """Valid educational license format EDU-789012-BA (EDU-<6 digits>-<region>)"""
        result = ProfessionalLicenseValidator.validate(
            license_number="EDU-789012-BA",
            domain=ProfessionalDomain.EDUCATIONAL,
        )
        assert result.is_valid is True
        assert result.error_message is None

    def test_valid_engineering_license(self):
        """Valid engineering license format ENG-345678-CE (ENG-<6 digits>-<discipline>)"""
        result = ProfessionalLicenseValidator.validate(
            license_number="ENG-345678-CE",
            domain=ProfessionalDomain.ENGINEERING,
        )
        assert result.is_valid is True
        assert result.error_message is None

    def test_valid_organizational_license(self):
        """Valid organizational license format ORG-901234-MA (ORG-<6 digits>-<type>)"""
        result = ProfessionalLicenseValidator.validate(
            license_number="ORG-901234-MA",
            domain=ProfessionalDomain.ORGANIZATIONAL,
        )
        assert result.is_valid is True
        assert result.error_message is None

    def test_empty_license(self):
        """Empty license should fail"""
        result = ProfessionalLicenseValidator.validate(
            license_number="",
            domain=ProfessionalDomain.LEGAL,
        )
        assert result.is_valid is False

    def test_none_license(self):
        """None license should fail gracefully"""
        result = ProfessionalLicenseValidator.validate(
            license_number=None,
            domain=ProfessionalDomain.LEGAL,
        )
        assert result.is_valid is False


class TestLegalLicenseFormat:
    """Test legal domain license format: LAW-XXXXX-YYYY"""

    def test_correct_prefix(self):
        """Legal license must start with LAW-"""
        result = ProfessionalLicenseValidator.validate(
            license_number="LAW-12345-2025",
            domain=ProfessionalDomain.LEGAL,
        )
        assert result.is_valid is True

    def test_wrong_prefix(self):
        """Legal license with wrong prefix should fail"""
        result = ProfessionalLicenseValidator.validate(
            license_number="MED-12345-2025",
            domain=ProfessionalDomain.LEGAL,
        )
        assert result.is_valid is False
        assert "format" in result.error_message.lower()

    def test_missing_year(self):
        """Legal license missing year should fail"""
        result = ProfessionalLicenseValidator.validate(
            license_number="LAW-12345",
            domain=ProfessionalDomain.LEGAL,
        )
        assert result.is_valid is False

    def test_invalid_number_length(self):
        """Legal license with wrong number length should fail"""
        result = ProfessionalLicenseValidator.validate(
            license_number="LAW-123-2025",  # Too short
            domain=ProfessionalDomain.LEGAL,
        )
        assert result.is_valid is False

    def test_non_numeric_id(self):
        """Legal license with non-numeric ID should fail"""
        result = ProfessionalLicenseValidator.validate(
            license_number="LAW-ABCDE-2025",
            domain=ProfessionalDomain.LEGAL,
        )
        assert result.is_valid is False

    def test_non_numeric_year(self):
        """Legal license with non-numeric year should fail"""
        result = ProfessionalLicenseValidator.validate(
            license_number="LAW-12345-ABCD",
            domain=ProfessionalDomain.LEGAL,
        )
        assert result.is_valid is False

    def test_year_validation(self):
        """Legal license should validate year range"""
        # Valid years (1970-2050)
        result = ProfessionalLicenseValidator.validate(
            license_number="LAW-12345-2025",
            domain=ProfessionalDomain.LEGAL,
        )
        assert result.is_valid is True

        # Invalid year (too old)
        result = ProfessionalLicenseValidator.validate(
            license_number="LAW-12345-1950",
            domain=ProfessionalDomain.LEGAL,
        )
        assert result.is_valid is False

        # Invalid year (future)
        result = ProfessionalLicenseValidator.validate(
            license_number="LAW-12345-2100",
            domain=ProfessionalDomain.LEGAL,
        )
        assert result.is_valid is False


class TestMedicalLicenseFormat:
    """Test medical domain license format: MED-XXXXXX-XX (MED-<6 digits>-<specialty code>)"""

    def test_correct_prefix(self):
        """Medical license must start with MED-"""
        result = ProfessionalLicenseValidator.validate(
            license_number="MED-123456-SU",
            domain=ProfessionalDomain.MEDICAL,
        )
        assert result.is_valid is True

    def test_wrong_prefix(self):
        """Medical license with wrong prefix should fail"""
        result = ProfessionalLicenseValidator.validate(
            license_number="LAW-123456-SU",
            domain=ProfessionalDomain.MEDICAL,
        )
        assert result.is_valid is False

    def test_valid_specialization_codes(self):
        """Medical license should accept valid specialty codes (SU, IM, PED, etc.)"""
        # Test valid codes from MEDICAL_SPECIALTY_CODES
        valid_codes = [
            "SU",
            "IM",
            "PED",
            "OB",
            "GYN",
            "CARD",
            "ORTH",
            "NEUR",
            "DERM",
            "PSY",
            "RAD",
            "ANES",
        ]
        for code in valid_codes:
            result = ProfessionalLicenseValidator.validate(
                license_number=f"MED-123456-{code}",
                domain=ProfessionalDomain.MEDICAL,
            )
            assert result.is_valid is True, f"Failed for code: {code}"

    def test_invalid_specialization_code(self):
        """Medical license with invalid specialty code should fail with clear message"""
        result = ProfessionalLicenseValidator.validate(
            license_number="MED-123456-XX",  # Invalid code
            domain=ProfessionalDomain.MEDICAL,
        )
        assert result.is_valid is False
        assert "specialty code" in result.error_message.lower()

    def test_lowercase_specialization_code(self):
        """Medical license with lowercase code should fail"""
        result = ProfessionalLicenseValidator.validate(
            license_number="MED-123456-su",
            domain=ProfessionalDomain.MEDICAL,
        )
        assert result.is_valid is False

    def test_invalid_number_length(self):
        """Medical license with wrong number length should fail"""
        result = ProfessionalLicenseValidator.validate(
            license_number="MED-1234-SU",  # Too short (4 digits instead of 6)
            domain=ProfessionalDomain.MEDICAL,
        )
        assert result.is_valid is False

    def test_numeric_specialization_code(self):
        """Medical license with numeric code should fail"""
        result = ProfessionalLicenseValidator.validate(
            license_number="MED-123456-12",
            domain=ProfessionalDomain.MEDICAL,
        )
        assert result.is_valid is False


class TestEducationalLicenseFormat:
    """Test educational domain license format: EDU-XXXXXX-XX (EDU-<6 digits>-<region>)"""

    def test_correct_prefix(self):
        """Educational license must start with EDU-"""
        result = ProfessionalLicenseValidator.validate(
            license_number="EDU-789012-BA",
            domain=ProfessionalDomain.EDUCATIONAL,
        )
        assert result.is_valid is True

    def test_wrong_prefix(self):
        """Educational license with wrong prefix should fail"""
        result = ProfessionalLicenseValidator.validate(
            license_number="LAW-789012-BA",
            domain=ProfessionalDomain.EDUCATIONAL,
        )
        assert result.is_valid is False

    def test_valid_region_codes(self):
        """Educational license should accept valid Iraqi region codes"""
        # Test valid codes from EDUCATIONAL_REGION_CODES
        valid_codes = ["BA", "BS", "NI", "ER", "SU", "AN", "DI", "KI", "NA", "KA"]
        for code in valid_codes:
            result = ProfessionalLicenseValidator.validate(
                license_number=f"EDU-789012-{code}",
                domain=ProfessionalDomain.EDUCATIONAL,
            )
            assert result.is_valid is True, f"Failed for code: {code}"

    def test_invalid_region_code(self):
        """Educational license with invalid region code should fail with clear message"""
        result = ProfessionalLicenseValidator.validate(
            license_number="EDU-789012-XX",  # Invalid code
            domain=ProfessionalDomain.EDUCATIONAL,
        )
        assert result.is_valid is False
        assert "region code" in result.error_message.lower()

    def test_invalid_number_length(self):
        """Educational license with wrong number length should fail"""
        result = ProfessionalLicenseValidator.validate(
            license_number="EDU-12345-BA",  # Too short (5 digits instead of 6)
            domain=ProfessionalDomain.EDUCATIONAL,
        )
        assert result.is_valid is False


class TestEngineeringLicenseFormat:
    """Test engineering domain license format: ENG-XXXXXX-XX (ENG-<6 digits>-<discipline>)"""

    def test_correct_prefix(self):
        """Engineering license must start with ENG-"""
        result = ProfessionalLicenseValidator.validate(
            license_number="ENG-345678-CE",
            domain=ProfessionalDomain.ENGINEERING,
        )
        assert result.is_valid is True

    def test_wrong_prefix(self):
        """Engineering license with wrong prefix should fail"""
        result = ProfessionalLicenseValidator.validate(
            license_number="LAW-345678-CE",
            domain=ProfessionalDomain.ENGINEERING,
        )
        assert result.is_valid is False

    def test_valid_discipline_codes(self):
        """Engineering license should accept valid 2-letter discipline codes"""
        # Test valid codes from ENGINEERING_DISCIPLINE_CODES
        valid_codes = ["CE", "ME", "EE", "CH", "AR", "PE", "IE", "CS", "EN", "AG"]
        for code in valid_codes:
            result = ProfessionalLicenseValidator.validate(
                license_number=f"ENG-345678-{code}",
                domain=ProfessionalDomain.ENGINEERING,
            )
            assert result.is_valid is True, f"Failed for code: {code}"

    def test_invalid_discipline_code(self):
        """Engineering license with invalid discipline code should fail with clear message"""
        result = ProfessionalLicenseValidator.validate(
            license_number="ENG-345678-XX",  # Invalid code
            domain=ProfessionalDomain.ENGINEERING,
        )
        assert result.is_valid is False
        assert "discipline code" in result.error_message.lower()

    def test_lowercase_discipline_code(self):
        """Engineering license with lowercase code should fail"""
        result = ProfessionalLicenseValidator.validate(
            license_number="ENG-345678-ce",
            domain=ProfessionalDomain.ENGINEERING,
        )
        assert result.is_valid is False

    def test_three_letter_code(self):
        """Engineering license with 3-letter code should fail (only 2 letters allowed)"""
        result = ProfessionalLicenseValidator.validate(
            license_number="ENG-345678-CIV",
            domain=ProfessionalDomain.ENGINEERING,
        )
        assert result.is_valid is False


class TestOrganizationalLicenseFormat:
    """Test organizational domain license format: ORG-XXXXXX-XX (ORG-<6 digits>-<type>)"""

    def test_correct_prefix(self):
        """Organizational license must start with ORG-"""
        result = ProfessionalLicenseValidator.validate(
            license_number="ORG-901234-MA",
            domain=ProfessionalDomain.ORGANIZATIONAL,
        )
        assert result.is_valid is True

    def test_wrong_prefix(self):
        """Organizational license with wrong prefix should fail"""
        result = ProfessionalLicenseValidator.validate(
            license_number="LAW-901234-MA",
            domain=ProfessionalDomain.ORGANIZATIONAL,
        )
        assert result.is_valid is False

    def test_valid_type_codes(self):
        """Organizational license should accept valid type codes"""
        # Test valid codes from ORGANIZATIONAL_TYPE_CODES
        valid_codes = ["MA", "HR", "FI", "IT", "PR", "QA", "OP", "SA", "AD", "CO"]
        for code in valid_codes:
            result = ProfessionalLicenseValidator.validate(
                license_number=f"ORG-901234-{code}",
                domain=ProfessionalDomain.ORGANIZATIONAL,
            )
            assert result.is_valid is True, f"Failed for code: {code}"

    def test_invalid_type_code(self):
        """Organizational license with invalid type code should fail with clear message"""
        result = ProfessionalLicenseValidator.validate(
            license_number="ORG-901234-XX",  # Invalid code
            domain=ProfessionalDomain.ORGANIZATIONAL,
        )
        assert result.is_valid is False
        assert "type code" in result.error_message.lower()

    def test_invalid_number_length(self):
        """Organizational license with wrong number length should fail"""
        result = ProfessionalLicenseValidator.validate(
            license_number="ORG-12345-MA",  # Too short (5 digits instead of 6)
            domain=ProfessionalDomain.ORGANIZATIONAL,
        )
        assert result.is_valid is False


class TestLicenseValidationResult:
    """Test LicenseValidationResult data structure"""

    def test_result_contains_all_fields(self):
        """Validation result should contain all expected fields"""
        result = ProfessionalLicenseValidator.validate(
            license_number="LAW-12345-2025",
            domain=ProfessionalDomain.LEGAL,
        )
        assert hasattr(result, "is_valid")
        assert hasattr(result, "error_message")
        assert hasattr(result, "domain")

    def test_successful_result_no_error(self):
        """Successful validation should have no error message"""
        result = ProfessionalLicenseValidator.validate(
            license_number="LAW-12345-2025",
            domain=ProfessionalDomain.LEGAL,
        )
        if result.is_valid:
            assert result.error_message is None or result.error_message == ""

    def test_failed_result_has_error(self):
        """Failed validation should have error message"""
        result = ProfessionalLicenseValidator.validate(
            license_number="INVALID",
            domain=ProfessionalDomain.LEGAL,
        )
        assert result.is_valid is False
        assert result.error_message is not None
        assert len(result.error_message) > 0


class TestCrossDomainValidation:
    """Test validation across different domains"""

    def test_legal_license_in_medical_domain_fails(self):
        """Legal license format should fail in medical domain"""
        result = ProfessionalLicenseValidator.validate(
            license_number="LAW-12345-2025",
            domain=ProfessionalDomain.MEDICAL,
        )
        assert result.is_valid is False

    def test_medical_license_in_legal_domain_fails(self):
        """Medical license format should fail in legal domain"""
        result = ProfessionalLicenseValidator.validate(
            license_number="MED-123456-SU",
            domain=ProfessionalDomain.LEGAL,
        )
        assert result.is_valid is False

    def test_engineering_license_in_educational_domain_fails(self):
        """Engineering license format should fail in educational domain"""
        result = ProfessionalLicenseValidator.validate(
            license_number="ENG-345678-CE",
            domain=ProfessionalDomain.EDUCATIONAL,
        )
        assert result.is_valid is False


class TestEdgeCases:
    """Test edge cases and boundary conditions"""

    def test_whitespace_in_license(self):
        """License with whitespace should fail"""
        result = ProfessionalLicenseValidator.validate(
            license_number="LAW - 12345 - 2025",
            domain=ProfessionalDomain.LEGAL,
        )
        assert result.is_valid is False

    def test_extra_hyphens(self):
        """License with extra hyphens should fail"""
        result = ProfessionalLicenseValidator.validate(
            license_number="LAW--12345--2025",
            domain=ProfessionalDomain.LEGAL,
        )
        assert result.is_valid is False

    def test_missing_hyphens(self):
        """License with missing hyphens should fail"""
        result = ProfessionalLicenseValidator.validate(
            license_number="LAW123452025",
            domain=ProfessionalDomain.LEGAL,
        )
        assert result.is_valid is False

    def test_case_sensitivity(self):
        """License prefix should be case-sensitive"""
        result = ProfessionalLicenseValidator.validate(
            license_number="law-12345-2025",
            domain=ProfessionalDomain.LEGAL,
        )
        assert result.is_valid is False

    def test_special_characters(self):
        """License with special characters should fail"""
        result = ProfessionalLicenseValidator.validate(
            license_number="LAW-12345@2025",
            domain=ProfessionalDomain.LEGAL,
        )
        assert result.is_valid is False


class TestRealWorldScenarios:
    """Test realistic professional license scenarios"""

    def test_baghdad_lawyer_license(self):
        """Typical Baghdad lawyer license"""
        result = ProfessionalLicenseValidator.validate(
            license_number="LAW-56789-2020",
            domain=ProfessionalDomain.LEGAL,
        )
        assert result.is_valid is True
        assert result.domain == ProfessionalDomain.LEGAL

    def test_basra_doctor_license(self):
        """Basra doctor specializing in surgery"""
        result = ProfessionalLicenseValidator.validate(
            license_number="MED-987654-SU",
            domain=ProfessionalDomain.MEDICAL,
        )
        assert result.is_valid is True
        assert result.domain == ProfessionalDomain.MEDICAL

    def test_baghdad_professor_license(self):
        """Baghdad university professor"""
        result = ProfessionalLicenseValidator.validate(
            license_number="EDU-246801-BA",  # Baghdad region
            domain=ProfessionalDomain.EDUCATIONAL,
        )
        assert result.is_valid is True
        assert result.domain == ProfessionalDomain.EDUCATIONAL

    def test_mosul_civil_engineer_license(self):
        """Mosul civil engineer"""
        result = ProfessionalLicenseValidator.validate(
            license_number="ENG-135792-CE",  # Civil Engineering
            domain=ProfessionalDomain.ENGINEERING,
        )
        assert result.is_valid is True
        assert result.domain == ProfessionalDomain.ENGINEERING

    def test_erbil_organization_license(self):
        """Erbil professional organization manager"""
        result = ProfessionalLicenseValidator.validate(
            license_number="ORG-112233-MA",  # Management type
            domain=ProfessionalDomain.ORGANIZATIONAL,
        )
        assert result.is_valid is True
        assert result.domain == ProfessionalDomain.ORGANIZATIONAL
