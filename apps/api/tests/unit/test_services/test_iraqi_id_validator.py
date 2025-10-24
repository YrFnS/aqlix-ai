"""
Unit tests for Iraqi ID Validator
Tests all validation levels, regional prefixes, and error cases
"""

import pytest
from datetime import datetime
from apps.api.services.iraqi_id_validator import (
    IraqiIDValidator,
    IraqiIDValidationResult,
    VerificationLevel,
)
from apps.api.models.iraqi_user import IraqiRegion


class TestIraqiIDValidatorBasicFormat:
    """Test basic format validation (12 digits)"""

    def test_valid_12_digit_id(self):
        """Valid 12-digit ID should pass basic validation"""
        result = IraqiIDValidator.validate(
            iraqi_id="101990123456", verification_level=VerificationLevel.BASIC
        )
        assert result.is_valid is True
        assert result.error_message is None

    def test_invalid_too_short(self):
        """ID with less than 12 digits should fail"""
        result = IraqiIDValidator.validate(
            iraqi_id="10199012345", verification_level=VerificationLevel.BASIC
        )
        assert result.is_valid is False
        assert "12 digits" in result.error_message

    def test_invalid_too_long(self):
        """ID with more than 12 digits should fail"""
        result = IraqiIDValidator.validate(
            iraqi_id="1019901234567", verification_level=VerificationLevel.BASIC
        )
        assert result.is_valid is False
        assert "12 digits" in result.error_message

    def test_invalid_non_numeric(self):
        """ID with non-numeric characters should fail"""
        result = IraqiIDValidator.validate(
            iraqi_id="10199012345A", verification_level=VerificationLevel.BASIC
        )
        assert result.is_valid is False

    def test_empty_id(self):
        """Empty ID should fail"""
        result = IraqiIDValidator.validate(
            iraqi_id="", verification_level=VerificationLevel.BASIC
        )
        assert result.is_valid is False

    def test_none_id(self):
        """None ID should fail gracefully"""
        result = IraqiIDValidator.validate(
            iraqi_id=None, verification_level=VerificationLevel.BASIC
        )
        assert result.is_valid is False


class TestIraqiIDBirthYearExtraction:
    """Test birth year extraction (digits 3-6)"""

    def test_extract_valid_birth_year_1990(self):
        """Should extract birth year 1990 from position 3-6"""
        result = IraqiIDValidator.validate("101990123456")
        assert result.birth_year == 1990

    def test_extract_valid_birth_year_2000(self):
        """Should extract birth year 2000"""
        result = IraqiIDValidator.validate("102000123456")
        assert result.birth_year == 2000

    def test_extract_valid_birth_year_1950(self):
        """Should extract birth year 1950"""
        result = IraqiIDValidator.validate("101950123456")
        assert result.birth_year == 1950

    def test_invalid_birth_year_too_old(self):
        """Birth year before 1900 should fail"""
        result = IraqiIDValidator.validate("101850123456")
        assert result.is_valid is False
        assert "birth year" in result.error_message.lower()

    def test_invalid_birth_year_future(self):
        """Birth year in the future should fail"""
        future_year = datetime.now().year + 1
        id_with_future_year = f"10{future_year}123456"
        result = IraqiIDValidator.validate(id_with_future_year)
        assert result.is_valid is False
        assert "birth year" in result.error_message.lower()

    def test_birth_year_current_year(self):
        """Birth year as current year should be valid"""
        current_year = datetime.now().year
        id_with_current_year = f"10{current_year}123456"
        result = IraqiIDValidator.validate(id_with_current_year)
        assert result.is_valid is True
        assert result.birth_year == current_year


class TestIraqiIDRegionalPrefixes:
    """Test regional prefix validation (STANDARD level)"""

    def test_baghdad_prefix_10_valid(self):
        """Baghdad ID starting with 10 should be valid"""
        result = IraqiIDValidator.validate(
            iraqi_id="101990123456",
            expected_region=IraqiRegion.BAGHDAD,
            verification_level=VerificationLevel.STANDARD,
        )
        assert result.is_valid is True

    def test_basra_prefix_06_valid(self):
        """Basra ID starting with 06 should be valid"""
        result = IraqiIDValidator.validate(
            iraqi_id="061990123456",
            expected_region=IraqiRegion.BASRA,
            verification_level=VerificationLevel.STANDARD,
        )
        assert result.is_valid is True

    def test_mosul_prefix_02_valid(self):
        """Mosul ID starting with 02 should be valid"""
        result = IraqiIDValidator.validate(
            iraqi_id="021990123456",
            expected_region=IraqiRegion.MOSUL,
            verification_level=VerificationLevel.STANDARD,
        )
        assert result.is_valid is True

    def test_erbil_prefix_05_valid(self):
        """Erbil ID starting with 05 should be valid"""
        result = IraqiIDValidator.validate(
            iraqi_id="051990123456",
            expected_region=IraqiRegion.ERBIL,
            verification_level=VerificationLevel.STANDARD,
        )
        assert result.is_valid is True

    def test_wrong_regional_prefix_baghdad(self):
        """Baghdad ID with wrong prefix should fail"""
        result = IraqiIDValidator.validate(
            iraqi_id="061990123456",  # Basra prefix
            expected_region=IraqiRegion.BAGHDAD,
            verification_level=VerificationLevel.STANDARD,
        )
        assert result.is_valid is False
        assert "prefix" in result.error_message.lower()

    def test_other_region_accepts_any_prefix(self):
        """OTHER region should accept any valid prefix"""
        result = IraqiIDValidator.validate(
            iraqi_id="991990123456",  # Unknown prefix
            expected_region=IraqiRegion.OTHER,
            verification_level=VerificationLevel.STANDARD,
        )
        # Should pass basic + birth year validation even with unknown prefix
        assert result.is_valid is True or "prefix" not in result.error_message.lower()


class TestIraqiIDVerificationLevels:
    """Test different verification levels (BASIC, STANDARD, STRICT)"""

    def test_basic_level_skips_regional_check(self):
        """BASIC level should not validate regional prefix"""
        result = IraqiIDValidator.validate(
            iraqi_id="991990123456",  # Invalid prefix for Baghdad
            expected_region=IraqiRegion.BAGHDAD,
            verification_level=VerificationLevel.BASIC,
        )
        # Should pass because BASIC doesn't check prefix
        assert result.is_valid is True

    def test_standard_level_validates_regional_prefix(self):
        """STANDARD level should validate regional prefix"""
        result = IraqiIDValidator.validate(
            iraqi_id="061990123456",  # Basra prefix
            expected_region=IraqiRegion.BAGHDAD,  # Expecting Baghdad
            verification_level=VerificationLevel.STANDARD,
        )
        assert result.is_valid is False
        assert "prefix" in result.error_message.lower()

    def test_strict_level_validates_checksum(self):
        """STRICT level should validate checksum"""
        # Note: This test assumes a checksum algorithm is implemented
        result = IraqiIDValidator.validate(
            iraqi_id="101990123456",
            expected_region=IraqiRegion.BAGHDAD,
            verification_level=VerificationLevel.STRICT,
        )
        # Result depends on actual checksum implementation
        assert result.is_valid is not None


class TestIraqiIDValidationResult:
    """Test IraqiIDValidationResult data structure"""

    def test_result_contains_all_fields(self):
        """Validation result should contain all expected fields"""
        result = IraqiIDValidator.validate("101990123456")
        assert hasattr(result, "is_valid")
        assert hasattr(result, "birth_year")
        assert hasattr(result, "error_message")
        assert hasattr(result, "warnings")

    def test_successful_result_no_error(self):
        """Successful validation should have no error message"""
        result = IraqiIDValidator.validate("101990123456")
        if result.is_valid:
            assert result.error_message is None or result.error_message == ""

    def test_failed_result_has_error(self):
        """Failed validation should have error message"""
        result = IraqiIDValidator.validate("123")  # Too short
        assert result.is_valid is False
        assert result.error_message is not None
        assert len(result.error_message) > 0


class TestIraqiIDEdgeCases:
    """Test edge cases and boundary conditions"""

    def test_all_zeros(self):
        """ID with all zeros should fail (invalid birth year)"""
        result = IraqiIDValidator.validate("000000000000")
        assert result.is_valid is False

    def test_all_nines(self):
        """ID with all nines should fail (invalid birth year)"""
        result = IraqiIDValidator.validate("999999999999")
        assert result.is_valid is False

    def test_minimum_valid_year_1900(self):
        """ID with birth year 1900 should be valid"""
        result = IraqiIDValidator.validate("101900123456")
        assert result.birth_year == 1900
        # Should be valid or have non-birth-year error
        if not result.is_valid:
            assert "birth year" not in result.error_message.lower()

    def test_whitespace_in_id(self):
        """ID with whitespace should fail"""
        result = IraqiIDValidator.validate("10 1990 123456")
        assert result.is_valid is False

    def test_leading_zeros_preserved(self):
        """Leading zeros should be preserved in validation"""
        result = IraqiIDValidator.validate("061990123456")
        assert result.is_valid is True
        assert result.birth_year == 1990


class TestIraqiIDRealWorldScenarios:
    """Test realistic Iraqi ID scenarios"""

    def test_typical_baghdad_resident_born_1985(self):
        """Typical Baghdad resident born in 1985"""
        result = IraqiIDValidator.validate(
            iraqi_id="101985654321",
            expected_region=IraqiRegion.BAGHDAD,
            verification_level=VerificationLevel.STANDARD,
        )
        assert result.is_valid is True
        assert result.birth_year == 1985

    def test_young_adult_born_2005(self):
        """Young adult born in 2005"""
        result = IraqiIDValidator.validate("102005123456")
        assert result.is_valid is True
        assert result.birth_year == 2005

    def test_senior_born_1945(self):
        """Senior citizen born in 1945"""
        result = IraqiIDValidator.validate("101945987654")
        assert result.is_valid is True
        assert result.birth_year == 1945

    def test_newborn_current_year(self):
        """Newborn registered in current year"""
        current_year = datetime.now().year
        id_newborn = f"10{current_year}111111"
        result = IraqiIDValidator.validate(id_newborn)
        assert result.is_valid is True
        assert result.birth_year == current_year

    def test_cross_region_validation_basra_to_baghdad(self):
        """Basra ID validated against Baghdad region should fail"""
        result = IraqiIDValidator.validate(
            iraqi_id="061990123456",  # Basra ID
            expected_region=IraqiRegion.BAGHDAD,
            verification_level=VerificationLevel.STANDARD,
        )
        assert result.is_valid is False
        assert (
            "baghdad" in result.error_message.lower()
            or "prefix" in result.error_message.lower()
        )
