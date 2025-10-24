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
        """Valid medical license format MED-123456-BA"""
        result = ProfessionalLicenseValidator.validate(
            license_number="MED-123456-BA",
            domain=ProfessionalDomain.MEDICAL,
        )
        assert result.is_valid is True
        assert result.error_message is None

    def test_valid_educational_license(self):
        """Valid educational license format EDU-12345-2025"""
        result = ProfessionalLicenseValidator.validate(
            license_number="EDU-12345-2025",
            domain=ProfessionalDomain.EDUCATIONAL,
        )
        assert result.is_valid is True
        assert result.error_message is None

    def test_valid_engineering_license(self):
        """Valid engineering license format ENG-123456-CIV"""
        result = ProfessionalLicenseValidator.validate(
            license_number="ENG-123456-CIV",
            domain=ProfessionalDomain.ENGINEERING,
        )
        assert result.is_valid is True
        assert result.error_message is None

    def test_valid_organizational_license(self):
        """Valid organizational license format ORG-12345-2025"""
        result = ProfessionalLicenseValidator.validate(
            license_number="ORG-12345-2025",
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
    """Test medical domain license format: MED-XXXXXX-YY"""

    def test_correct_prefix(self):
        """Medical license must start with MED-"""
        result = ProfessionalLicenseValidator.validate(
            license_number="MED-123456-BA",
            domain=ProfessionalDomain.MEDICAL,
        )
        assert result.is_valid is True

    def test_wrong_prefix(self):
        """Medical license with wrong prefix should fail"""
        result = ProfessionalLicenseValidator.validate(
            license_number="LAW-123456-BA",
            domain=ProfessionalDomain.MEDICAL,
        )
        assert result.is_valid is False

    def test_valid_specialization_codes(self):
        """Medical license should accept valid 2-letter codes"""
        valid_codes = ["BA", "MO", "ER", "SU", "PE", "CA", "NE", "PS"]
        for code in valid_codes:
            result = ProfessionalLicenseValidator.validate(
                license_number=f"MED-123456-{code}",
                domain=ProfessionalDomain.MEDICAL,
            )
            assert result.is_valid is True, f"Failed for code: {code}"

    def test_lowercase_specialization_code(self):
        """Medical license with lowercase code should fail"""
        result = ProfessionalLicenseValidator.validate(
            license_number="MED-123456-ba",
            domain=ProfessionalDomain.MEDICAL,
        )
        assert result.is_valid is False

    def test_invalid_number_length(self):
        """Medical license with wrong number length should fail"""
        result = ProfessionalLicenseValidator.validate(
            license_number="MED-1234-BA",  # Too short
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
    """Test educational domain license format: EDU-XXXXX-YYYY"""

    def test_correct_prefix(self):
        """Educational license must start with EDU-"""
        result = ProfessionalLicenseValidator.validate(
            license_number="EDU-12345-2025",
            domain=ProfessionalDomain.EDUCATIONAL,
        )
        assert result.is_valid is True

    def test_wrong_prefix(self):
        """Educational license with wrong prefix should fail"""
        result = ProfessionalLicenseValidator.validate(
            license_number="LAW-12345-2025",
            domain=ProfessionalDomain.EDUCATIONAL,
        )
        assert result.is_valid is False

    def test_year_range_validation(self):
        """Educational license should validate year range"""
        # Valid year
        result = ProfessionalLicenseValidator.validate(
            license_number="EDU-12345-2025",
            domain=ProfessionalDomain.EDUCATIONAL,
        )
        assert result.is_valid is True

        # Invalid year (too old)
        result = ProfessionalLicenseValidator.validate(
            license_number="EDU-12345-1960",
            domain=ProfessionalDomain.EDUCATIONAL,
        )
        assert result.is_valid is False


class TestEngineeringLicenseFormat:
    """Test engineering domain license format: ENG-XXXXXX-YYY"""

    def test_correct_prefix(self):
        """Engineering license must start with ENG-"""
        result = ProfessionalLicenseValidator.validate(
            license_number="ENG-123456-CIV",
            domain=ProfessionalDomain.ENGINEERING,
        )
        assert result.is_valid is True

    def test_wrong_prefix(self):
        """Engineering license with wrong prefix should fail"""
        result = ProfessionalLicenseValidator.validate(
            license_number="LAW-123456-CIV",
            domain=ProfessionalDomain.ENGINEERING,
        )
        assert result.is_valid is False

    def test_valid_specialization_codes(self):
        """Engineering license should accept valid 3-letter codes"""
        valid_codes = ["CIV", "MEC", "ELE", "CHE", "ARC", "PET", "ENV"]
        for code in valid_codes:
            result = ProfessionalLicenseValidator.validate(
                license_number=f"ENG-123456-{code}",
                domain=ProfessionalDomain.ENGINEERING,
            )
            assert result.is_valid is True, f"Failed for code: {code}"

    def test_lowercase_specialization_code(self):
        """Engineering license with lowercase code should fail"""
        result = ProfessionalLicenseValidator.validate(
            license_number="ENG-123456-civ",
            domain=ProfessionalDomain.ENGINEERING,
        )
        assert result.is_valid is False

    def test_two_letter_code(self):
        """Engineering license with 2-letter code should fail"""
        result = ProfessionalLicenseValidator.validate(
            license_number="ENG-123456-CI",
            domain=ProfessionalDomain.ENGINEERING,
        )
        assert result.is_valid is False


class TestOrganizationalLicenseFormat:
    """Test organizational domain license format: ORG-XXXXX-YYYY"""

    def test_correct_prefix(self):
        """Organizational license must start with ORG-"""
        result = ProfessionalLicenseValidator.validate(
            license_number="ORG-12345-2025",
            domain=ProfessionalDomain.ORGANIZATIONAL,
        )
        assert result.is_valid is True

    def test_wrong_prefix(self):
        """Organizational license with wrong prefix should fail"""
        result = ProfessionalLicenseValidator.validate(
            license_number="LAW-12345-2025",
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
            license_number="MED-123456-BA",
            domain=ProfessionalDomain.LEGAL,
        )
        assert result.is_valid is False

    def test_engineering_license_in_educational_domain_fails(self):
        """Engineering license format should fail in educational domain"""
        result = ProfessionalLicenseValidator.validate(
            license_number="ENG-123456-CIV",
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
            license_number="EDU-24680-2015",
            domain=ProfessionalDomain.EDUCATIONAL,
        )
        assert result.is_valid is True
        assert result.domain == ProfessionalDomain.EDUCATIONAL

    def test_mosul_civil_engineer_license(self):
        """Mosul civil engineer"""
        result = ProfessionalLicenseValidator.validate(
            license_number="ENG-135792-CIV",
            domain=ProfessionalDomain.ENGINEERING,
        )
        assert result.is_valid is True
        assert result.domain == ProfessionalDomain.ENGINEERING

    def test_erbil_organization_license(self):
        """Erbil professional organization"""
        result = ProfessionalLicenseValidator.validate(
            license_number="ORG-11223-2022",
            domain=ProfessionalDomain.ORGANIZATIONAL,
        )
        assert result.is_valid is True
        assert result.domain == ProfessionalDomain.ORGANIZATIONAL
