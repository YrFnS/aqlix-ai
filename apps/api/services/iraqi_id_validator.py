"""
Iraqi National ID Validator Service
Validates Iraqi national ID numbers with regional prefix checking and format validation
"""

from datetime import datetime
from typing import Optional, Tuple
from enum import Enum
import re

from pydantic import BaseModel


class IraqiRegion(str, Enum):
    """Iraqi regions with official ID prefixes (19 governorates)"""

    # Major cities
    BAGHDAD = "baghdad"
    BASRA = "basra"
    MOSUL = "mosul"  # Nineveh governorate
    ERBIL = "erbil"

    # Other governorates
    KIRKUK = "kirkuk"
    DIYALA = "diyala"
    ANBAR = "anbar"
    NAJAF = "najaf"
    KARBALA = "karbala"
    WASIT = "wasit"
    SALADIN = "saladin"
    QADISIYYAH = "qadisiyyah"
    BABIL = "babil"
    DHI_QAR = "dhi_qar"
    MAYSAN = "maysan"
    MUTHANNA = "muthanna"
    DOHUK = "dohuk"
    SULAYMANIYAH = "sulaymaniyah"
    HALABJA = "halabja"

    OTHER = "other"


class VerificationLevel(str, Enum):
    """ID verification strictness levels"""

    BASIC = "basic"  # Format validation only
    STANDARD = "standard"  # Format + regional prefix validation
    STRICT = "strict"  # Format + prefix + checksum validation


class IraqiIDValidationResult(BaseModel):
    """Result of Iraqi ID validation"""

    is_valid: bool
    error_message: Optional[str] = None
    extracted_birth_year: Optional[int] = None
    extracted_region: Optional[IraqiRegion] = None
    verification_level: VerificationLevel
    validation_details: dict = {}


class IraqiIDValidator:
    """
    Iraqi National ID Validator

    Validates Iraqi national IDs with the following format:
    - 12 digits total
    - First 2 digits: Regional prefix
    - Digits 3-6: Birth year (e.g., 1985)
    - Digits 7-11: Sequential number
    - Digit 12: Checksum (placeholder for future official specs)

    Regional Prefixes (All 19 Iraqi Governorates):
    - Baghdad: 10, 11
    - Nineveh (Mosul): 02
    - Sulaymaniyah: 03
    - Erbil: 04
    - Dohuk: 05
    - Basra: 06
    - Diyala: 07
    - Anbar: 08
    - Kirkuk: 09
    - Najaf: 12
    - Karbala: 13
    - Wasit: 14
    - Saladin: 15
    - Qadisiyyah: 16
    - Babil: 17
    - Dhi Qar: 18
    - Maysan: 19
    - Muthanna: 20
    - Halabja: 21
    """

    # Official regional prefix mappings for all 19 Iraqi governorates
    # Based on Iraqi Civil Affairs numbering system
    REGIONAL_PREFIXES = {
        # Note: Baghdad has multiple prefixes (10, 11) due to population size
        IraqiRegion.BAGHDAD: ["10", "11"],
        IraqiRegion.MOSUL: ["02"],  # Nineveh governorate
        IraqiRegion.SULAYMANIYAH: ["03"],
        IraqiRegion.ERBIL: ["04"],
        IraqiRegion.DOHUK: ["05"],
        IraqiRegion.BASRA: ["06"],
        IraqiRegion.DIYALA: ["07"],
        IraqiRegion.ANBAR: ["08"],
        IraqiRegion.KIRKUK: ["09"],
        IraqiRegion.NAJAF: ["12"],
        IraqiRegion.KARBALA: ["13"],
        IraqiRegion.WASIT: ["14"],
        IraqiRegion.SALADIN: ["15"],
        IraqiRegion.QADISIYYAH: ["16"],
        IraqiRegion.BABIL: ["17"],
        IraqiRegion.DHI_QAR: ["18"],
        IraqiRegion.MAYSAN: ["19"],
        IraqiRegion.MUTHANNA: ["20"],
        IraqiRegion.HALABJA: ["21"],
    }

    # Reverse mapping for prefix lookup (prefix -> region)
    PREFIX_TO_REGION = {}
    for region, prefixes in REGIONAL_PREFIXES.items():
        for prefix in prefixes:
            PREFIX_TO_REGION[prefix] = region

    # Arabic region names for validation messages
    REGION_NAMES_ARABIC = {
        IraqiRegion.BAGHDAD: "بغداد",
        IraqiRegion.BASRA: "البصرة",
        IraqiRegion.MOSUL: "الموصل",
        IraqiRegion.ERBIL: "أربيل",
        IraqiRegion.KIRKUK: "كركوك",
        IraqiRegion.DIYALA: "ديالى",
        IraqiRegion.ANBAR: "الأنبار",
        IraqiRegion.NAJAF: "النجف",
        IraqiRegion.KARBALA: "كربلاء",
        IraqiRegion.WASIT: "واسط",
        IraqiRegion.SALADIN: "صلاح الدين",
        IraqiRegion.QADISIYYAH: "القادسية",
        IraqiRegion.BABIL: "بابل",
        IraqiRegion.DHI_QAR: "ذي قار",
        IraqiRegion.MAYSAN: "ميسان",
        IraqiRegion.MUTHANNA: "المثنى",
        IraqiRegion.DOHUK: "دهوك",
        IraqiRegion.SULAYMANIYAH: "السليمانية",
        IraqiRegion.HALABJA: "حلبجة",
        IraqiRegion.OTHER: "أخرى",
    }

    @staticmethod
    def validate_format(iraqi_id: str) -> Tuple[bool, Optional[str]]:
        """
        Validate basic format (12 digits)

        Args:
            iraqi_id: Iraqi national ID string

        Returns:
            Tuple of (is_valid, error_message)
        """
        if not iraqi_id:
            return False, "Iraqi ID cannot be empty"

        if not isinstance(iraqi_id, str):
            return False, "Iraqi ID must be a string"

        if not re.match(r"^\d{12}$", iraqi_id):
            return False, "Iraqi ID must be exactly 12 digits"

        return True, None

    @staticmethod
    def extract_birth_year(iraqi_id: str) -> Optional[int]:
        """
        Extract birth year from Iraqi ID (digits 3-6)

        Args:
            iraqi_id: Valid 12-digit Iraqi ID

        Returns:
            Birth year as integer, or None if invalid
        """
        if len(iraqi_id) < 6:
            return None

        try:
            birth_year = int(iraqi_id[2:6])

            # Validate reasonable birth year range (1920-2025)
            current_year = datetime.now().year
            if birth_year < 1920 or birth_year > current_year:
                return None

            return birth_year
        except ValueError:
            return None

    @classmethod
    def extract_region(cls, iraqi_id: str) -> Optional[IraqiRegion]:
        """
        Extract region from Iraqi ID prefix (first 2 digits)

        Args:
            iraqi_id: Valid 12-digit Iraqi ID

        Returns:
            IraqiRegion enum value, or None if prefix not recognized
        """
        if len(iraqi_id) < 2:
            return None

        prefix = iraqi_id[:2]
        return cls.PREFIX_TO_REGION.get(prefix)

    @classmethod
    def validate_regional_prefix(
        cls, iraqi_id: str, expected_region: IraqiRegion
    ) -> Tuple[bool, Optional[str]]:
        """
        Validate that Iraqi ID prefix matches expected region

        Args:
            iraqi_id: Valid 12-digit Iraqi ID
            expected_region: Expected region for this ID

        Returns:
            Tuple of (is_valid, error_message with Arabic translation)
        """
        if expected_region == IraqiRegion.OTHER:
            # For 'other' region, we only validate format, not prefix
            return True, None

        prefix = iraqi_id[:2]
        expected_prefixes = cls.REGIONAL_PREFIXES.get(expected_region)

        if not expected_prefixes:
            return (
                False,
                f"No prefix mapping for region: {expected_region.value}",
            )

        if prefix not in expected_prefixes:
            # Get Arabic region name
            arabic_name = cls.REGION_NAMES_ARABIC.get(
                expected_region, expected_region.value
            )

            # Format prefix list for error message
            prefix_list = ", ".join(expected_prefixes)

            return (
                False,
                f"رقم الهوية يجب أن يبدأ بـ {prefix_list} لمحافظة {arabic_name} (تم استلام {prefix}) / "
                f"Iraqi ID must start with {prefix_list} for {expected_region.value} region (got {prefix})",
            )

        return True, None

    @staticmethod
    def calculate_checksum(iraqi_id: str) -> int:
        """
        Calculate checksum for Iraqi ID (placeholder implementation)

        NOTE: This is a placeholder. The official Iraqi ID checksum algorithm
        is not publicly documented. This uses a simple modulo-10 algorithm
        as a placeholder until official specs are available.

        Args:
            iraqi_id: Valid 12-digit Iraqi ID

        Returns:
            Calculated checksum digit (0-9)
        """
        if len(iraqi_id) < 11:
            return -1

        # Use first 11 digits for checksum calculation
        digits = [int(d) for d in iraqi_id[:11]]

        # Simple weighted sum modulo 10 (placeholder algorithm)
        weights = [2, 7, 6, 5, 4, 3, 2, 7, 6, 5, 4]
        weighted_sum = sum(d * w for d, w in zip(digits, weights))
        checksum = (11 - (weighted_sum % 11)) % 10

        return checksum

    @classmethod
    def validate_checksum(cls, iraqi_id: str) -> Tuple[bool, Optional[str]]:
        """
        Validate Iraqi ID checksum (placeholder implementation)

        NOTE: This uses a placeholder algorithm. Will need to be updated
        when official Iraqi ID checksum specs are available.

        Args:
            iraqi_id: Valid 12-digit Iraqi ID

        Returns:
            Tuple of (is_valid, error_message)
        """
        if len(iraqi_id) != 12:
            return False, "Iraqi ID must be 12 digits for checksum validation"

        try:
            provided_checksum = int(iraqi_id[11])
            calculated_checksum = cls.calculate_checksum(iraqi_id)

            if provided_checksum != calculated_checksum:
                return (
                    False,
                    f"Iraqi ID checksum invalid (expected {calculated_checksum}, got {provided_checksum})",
                )

            return True, None
        except ValueError:
            return False, "Iraqi ID contains invalid checksum digit"

    @classmethod
    def validate(
        cls,
        iraqi_id: str,
        expected_region: Optional[IraqiRegion] = None,
        verification_level: VerificationLevel = VerificationLevel.STANDARD,
    ) -> IraqiIDValidationResult:
        """
        Comprehensive Iraqi ID validation

        Args:
            iraqi_id: Iraqi national ID to validate
            expected_region: Expected region for this ID (required for STANDARD+ verification)
            verification_level: Strictness level for validation

        Returns:
            IraqiIDValidationResult with validation status and details
        """
        validation_details = {
            "format_valid": False,
            "prefix_valid": False,
            "birth_year_valid": False,
            "checksum_valid": False,
        }

        # Step 1: Basic format validation (required for all levels)
        format_valid, format_error = cls.validate_format(iraqi_id)
        validation_details["format_valid"] = format_valid

        if not format_valid:
            return IraqiIDValidationResult(
                is_valid=False,
                error_message=format_error,
                verification_level=verification_level,
                validation_details=validation_details,
            )

        # Step 2: Extract birth year and region
        birth_year = cls.extract_birth_year(iraqi_id)
        extracted_region = cls.extract_region(iraqi_id)

        validation_details["birth_year_valid"] = birth_year is not None
        validation_details["extracted_birth_year"] = birth_year
        validation_details["extracted_region"] = (
            extracted_region.value if extracted_region else None
        )

        if birth_year is None:
            return IraqiIDValidationResult(
                is_valid=False,
                error_message="Invalid birth year in Iraqi ID",
                extracted_region=extracted_region,
                verification_level=verification_level,
                validation_details=validation_details,
            )

        # Step 3: Regional prefix validation (STANDARD and STRICT)
        if verification_level in [VerificationLevel.STANDARD, VerificationLevel.STRICT]:
            if expected_region is None:
                return IraqiIDValidationResult(
                    is_valid=False,
                    error_message="Expected region required for STANDARD/STRICT validation",
                    extracted_birth_year=birth_year,
                    extracted_region=extracted_region,
                    verification_level=verification_level,
                    validation_details=validation_details,
                )

            prefix_valid, prefix_error = cls.validate_regional_prefix(
                iraqi_id, expected_region
            )
            validation_details["prefix_valid"] = prefix_valid

            if not prefix_valid:
                return IraqiIDValidationResult(
                    is_valid=False,
                    error_message=prefix_error,
                    extracted_birth_year=birth_year,
                    extracted_region=extracted_region,
                    verification_level=verification_level,
                    validation_details=validation_details,
                )

        # Step 4: Checksum validation (STRICT only)
        if verification_level == VerificationLevel.STRICT:
            checksum_valid, checksum_error = cls.validate_checksum(iraqi_id)
            validation_details["checksum_valid"] = checksum_valid

            if not checksum_valid:
                return IraqiIDValidationResult(
                    is_valid=False,
                    error_message=f"{checksum_error} (Note: Using placeholder algorithm)",
                    extracted_birth_year=birth_year,
                    extracted_region=extracted_region,
                    verification_level=verification_level,
                    validation_details=validation_details,
                )

        # All validations passed
        return IraqiIDValidationResult(
            is_valid=True,
            error_message=None,
            extracted_birth_year=birth_year,
            extracted_region=extracted_region or expected_region,
            verification_level=verification_level,
            validation_details=validation_details,
        )
