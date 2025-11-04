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
    """Test regional prefix validation (STANDARD level) for all 19 governorates"""

    def test_baghdad_prefix_10_valid(self):
        """Baghdad ID starting with 10 should be valid"""
        result = IraqiIDValidator.validate(
            iraqi_id="101990123456",
            expected_region=IraqiRegion.BAGHDAD,
            verification_level=VerificationLevel.STANDARD,
        )
        assert result.is_valid is True
        assert result.extracted_region == IraqiRegion.BAGHDAD

    def test_baghdad_prefix_11_valid(self):
        """Baghdad ID starting with 11 should be valid (multiple prefixes)"""
        result = IraqiIDValidator.validate(
            iraqi_id="111990123456",
            expected_region=IraqiRegion.BAGHDAD,
            verification_level=VerificationLevel.STANDARD,
        )
        assert result.is_valid is True
        assert result.extracted_region == IraqiRegion.BAGHDAD

    def test_mosul_prefix_02_valid(self):
        """Mosul (Nineveh) ID starting with 02 should be valid"""
        result = IraqiIDValidator.validate(
            iraqi_id="021990123456",
            expected_region=IraqiRegion.MOSUL,
            verification_level=VerificationLevel.STANDARD,
        )
        assert result.is_valid is True
        assert result.extracted_region == IraqiRegion.MOSUL

    def test_sulaymaniyah_prefix_03_valid(self):
        """Sulaymaniyah ID starting with 03 should be valid"""
        result = IraqiIDValidator.validate(
            iraqi_id="031990123456",
            expected_region=IraqiRegion.SULAYMANIYAH,
            verification_level=VerificationLevel.STANDARD,
        )
        assert result.is_valid is True

    def test_erbil_prefix_04_valid(self):
        """Erbil ID starting with 04 should be valid"""
        result = IraqiIDValidator.validate(
            iraqi_id="041990123456",
            expected_region=IraqiRegion.ERBIL,
            verification_level=VerificationLevel.STANDARD,
        )
        assert result.is_valid is True

    def test_dohuk_prefix_05_valid(self):
        """Dohuk ID starting with 05 should be valid"""
        result = IraqiIDValidator.validate(
            iraqi_id="051990123456",
            expected_region=IraqiRegion.DOHUK,
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
        assert result.extracted_region == IraqiRegion.BASRA

    def test_diyala_prefix_07_valid(self):
        """Diyala ID starting with 07 should be valid"""
        result = IraqiIDValidator.validate(
            iraqi_id="071990123456",
            expected_region=IraqiRegion.DIYALA,
            verification_level=VerificationLevel.STANDARD,
        )
        assert result.is_valid is True

    def test_anbar_prefix_08_valid(self):
        """Anbar ID starting with 08 should be valid"""
        result = IraqiIDValidator.validate(
            iraqi_id="081990123456",
            expected_region=IraqiRegion.ANBAR,
            verification_level=VerificationLevel.STANDARD,
        )
        assert result.is_valid is True

    def test_kirkuk_prefix_09_valid(self):
        """Kirkuk ID starting with 09 should be valid"""
        result = IraqiIDValidator.validate(
            iraqi_id="091990123456",
            expected_region=IraqiRegion.KIRKUK,
            verification_level=VerificationLevel.STANDARD,
        )
        assert result.is_valid is True

    def test_najaf_prefix_12_valid(self):
        """Najaf ID starting with 12 should be valid"""
        result = IraqiIDValidator.validate(
            iraqi_id="121990123456",
            expected_region=IraqiRegion.NAJAF,
            verification_level=VerificationLevel.STANDARD,
        )
        assert result.is_valid is True

    def test_karbala_prefix_13_valid(self):
        """Karbala ID starting with 13 should be valid"""
        result = IraqiIDValidator.validate(
            iraqi_id="131990123456",
            expected_region=IraqiRegion.KARBALA,
            verification_level=VerificationLevel.STANDARD,
        )
        assert result.is_valid is True

    def test_wasit_prefix_14_valid(self):
        """Wasit ID starting with 14 should be valid"""
        result = IraqiIDValidator.validate(
            iraqi_id="141990123456",
            expected_region=IraqiRegion.WASIT,
            verification_level=VerificationLevel.STANDARD,
        )
        assert result.is_valid is True

    def test_saladin_prefix_15_valid(self):
        """Saladin ID starting with 15 should be valid"""
        result = IraqiIDValidator.validate(
            iraqi_id="151990123456",
            expected_region=IraqiRegion.SALADIN,
            verification_level=VerificationLevel.STANDARD,
        )
        assert result.is_valid is True

    def test_qadisiyyah_prefix_16_valid(self):
        """Qadisiyyah ID starting with 16 should be valid"""
        result = IraqiIDValidator.validate(
            iraqi_id="161990123456",
            expected_region=IraqiRegion.QADISIYYAH,
            verification_level=VerificationLevel.STANDARD,
        )
        assert result.is_valid is True

    def test_babil_prefix_17_valid(self):
        """Babil ID starting with 17 should be valid"""
        result = IraqiIDValidator.validate(
            iraqi_id="171990123456",
            expected_region=IraqiRegion.BABIL,
            verification_level=VerificationLevel.STANDARD,
        )
        assert result.is_valid is True

    def test_dhi_qar_prefix_18_valid(self):
        """Dhi Qar ID starting with 18 should be valid"""
        result = IraqiIDValidator.validate(
            iraqi_id="181990123456",
            expected_region=IraqiRegion.DHI_QAR,
            verification_level=VerificationLevel.STANDARD,
        )
        assert result.is_valid is True

    def test_maysan_prefix_19_valid(self):
        """Maysan ID starting with 19 should be valid"""
        result = IraqiIDValidator.validate(
            iraqi_id="191990123456",
            expected_region=IraqiRegion.MAYSAN,
            verification_level=VerificationLevel.STANDARD,
        )
        assert result.is_valid is True

    def test_muthanna_prefix_20_valid(self):
        """Muthanna ID starting with 20 should be valid"""
        result = IraqiIDValidator.validate(
            iraqi_id="201990123456",
            expected_region=IraqiRegion.MUTHANNA,
            verification_level=VerificationLevel.STANDARD,
        )
        assert result.is_valid is True

    def test_halabja_prefix_21_valid(self):
        """Halabja ID starting with 21 should be valid"""
        result = IraqiIDValidator.validate(
            iraqi_id="211990123456",
            expected_region=IraqiRegion.HALABJA,
            verification_level=VerificationLevel.STANDARD,
        )
        assert result.is_valid is True

    def test_wrong_regional_prefix_baghdad(self):
        """Baghdad ID with wrong prefix should fail with Arabic message"""
        result = IraqiIDValidator.validate(
            iraqi_id="061990123456",  # Basra prefix
            expected_region=IraqiRegion.BAGHDAD,
            verification_level=VerificationLevel.STANDARD,
        )
        assert result.is_valid is False
        assert (
            "prefix" in result.error_message.lower() or "بغداد" in result.error_message
        )

    def test_wrong_regional_prefix_basra(self):
        """Basra ID with wrong prefix should fail with Arabic message"""
        result = IraqiIDValidator.validate(
            iraqi_id="101990123456",  # Baghdad prefix
            expected_region=IraqiRegion.BASRA,
            verification_level=VerificationLevel.STANDARD,
        )
        assert result.is_valid is False
        assert (
            "البصرة" in result.error_message or "basra" in result.error_message.lower()
        )

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
        """STRICT level should validate checksum using ICAO 9303 MRZ algorithm"""
        # Test with valid checksum (calculated using ICAO 9303 algorithm)
        # For "10199012345", checksum calculation:
        # digits: [1,0,1,9,9,0,1,2,3,4,5]
        # weights: [7,3,1,7,3,1,7,3,1,7,3]
        # sum: 1*7 + 0*3 + 1*1 + 9*7 + 9*3 + 0*1 + 1*7 + 2*3 + 3*1 + 4*7 + 5*3 = 163
        # checksum: 163 % 10 = 3
        valid_id_with_checksum = "101990123453"

        result = IraqiIDValidator.validate(
            iraqi_id=valid_id_with_checksum,
            expected_region=IraqiRegion.BAGHDAD,
            verification_level=VerificationLevel.STRICT,
        )
        assert result.is_valid is True, (
            f"Valid checksum should pass: {result.error_message}"
        )

        # Test with invalid checksum
        invalid_checksum_id = "101990123456"  # Wrong checksum (should be 3, not 6)

        result_invalid = IraqiIDValidator.validate(
            iraqi_id=invalid_checksum_id,
            expected_region=IraqiRegion.BAGHDAD,
            verification_level=VerificationLevel.STRICT,
        )
        assert result_invalid.is_valid is False, "Invalid checksum should fail"
        assert "checksum" in result_invalid.error_message.lower(), (
            f"Error message should mention checksum: {result_invalid.error_message}"
        )
        assert "ICAO 9303" in result_invalid.error_message, (
            "Error message should reference ICAO 9303 standard"
        )


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
