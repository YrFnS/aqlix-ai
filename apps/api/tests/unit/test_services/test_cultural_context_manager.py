"""
Unit tests for Cultural Context Manager
Tests greeting generation, prayer time detection, and timezone handling
"""

import pytest
from datetime import datetime, time
from zoneinfo import ZoneInfo
from apps.api.services.cultural_context_manager import (
    CulturalContextManager,
    GreetingResult,
    PrayerTime,
    IraqiRegion,
    IslamicComplianceLevel,
    LanguagePreference,
)


class TestGreetingGeneration:
    """Test greeting generation based on time and cultural preferences"""

    def test_morning_greeting_arabic(self):
        """Morning greeting in Arabic (6 AM)"""
        manager = CulturalContextManager(
            region=IraqiRegion.BAGHDAD,
            islamic_compliance=IslamicComplianceLevel.BASIC,
            language_preference=LanguagePreference.ARABIC,
        )
        morning_time = datetime(2025, 1, 15, 6, 0, 0, tzinfo=ZoneInfo("Asia/Baghdad"))
        greeting = manager.generate_greeting(current_time=morning_time)

        assert greeting.primary_greeting == "صباح الخير"
        assert greeting.response_greeting == "صباح النور"
        assert "morning" in greeting.time_period.lower()

    def test_afternoon_greeting_arabic(self):
        """Afternoon greeting in Arabic (3 PM)"""
        manager = CulturalContextManager(
            region=IraqiRegion.BAGHDAD,
            islamic_compliance=IslamicComplianceLevel.BASIC,
            language_preference=LanguagePreference.ARABIC,
        )
        afternoon_time = datetime(
            2025, 1, 15, 15, 0, 0, tzinfo=ZoneInfo("Asia/Baghdad")
        )
        greeting = manager.generate_greeting(current_time=afternoon_time)

        assert greeting.primary_greeting == "مساء الخير"
        assert greeting.response_greeting == "مساء النور"
        assert "afternoon" in greeting.time_period.lower()

    def test_islamic_greeting_standard_compliance(self):
        """Islamic greeting for standard compliance level"""
        manager = CulturalContextManager(
            region=IraqiRegion.BAGHDAD,
            islamic_compliance=IslamicComplianceLevel.STANDARD,
            language_preference=LanguagePreference.ARABIC,
        )
        greeting = manager.generate_greeting()

        assert "السلام عليكم" in greeting.primary_greeting
        assert "وعليكم السلام" in greeting.response_greeting

    def test_islamic_greeting_strict_compliance(self):
        """Full Islamic greeting for strict compliance level"""
        manager = CulturalContextManager(
            region=IraqiRegion.BAGHDAD,
            islamic_compliance=IslamicComplianceLevel.STRICT,
            language_preference=LanguagePreference.ARABIC,
        )
        greeting = manager.generate_greeting()

        assert greeting.primary_greeting == "السلام عليكم ورحمة الله وبركاته"
        assert greeting.response_greeting == "وعليكم السلام ورحمة الله وبركاته"

    def test_bilingual_greeting(self):
        """Bilingual greeting (Arabic + English)"""
        manager = CulturalContextManager(
            region=IraqiRegion.BAGHDAD,
            islamic_compliance=IslamicComplianceLevel.BASIC,
            language_preference=LanguagePreference.BOTH,
        )
        morning_time = datetime(2025, 1, 15, 6, 0, 0, tzinfo=ZoneInfo("Asia/Baghdad"))
        greeting = manager.generate_greeting(current_time=morning_time)

        assert "صباح الخير" in greeting.primary_greeting
        assert "Good morning" in greeting.primary_greeting

    def test_english_only_greeting(self):
        """English-only greeting"""
        manager = CulturalContextManager(
            region=IraqiRegion.BAGHDAD,
            islamic_compliance=IslamicComplianceLevel.BASIC,
            language_preference=LanguagePreference.ENGLISH,
        )
        morning_time = datetime(2025, 1, 15, 6, 0, 0, tzinfo=ZoneInfo("Asia/Baghdad"))
        greeting = manager.generate_greeting(current_time=morning_time)

        assert greeting.primary_greeting == "Good morning"
        assert "صباح" not in greeting.primary_greeting


class TestRegionalGreetings:
    """Test regional variations in greetings"""

    def test_baghdad_regional_greeting(self):
        """Baghdad dialect: شلونك (Shlonuk)"""
        manager = CulturalContextManager(
            region=IraqiRegion.BAGHDAD,
            islamic_compliance=IslamicComplianceLevel.BASIC,
            language_preference=LanguagePreference.ARABIC,
        )
        greeting = manager.generate_greeting()

        assert greeting.regional_variation == "شلونك"
        assert greeting.region == IraqiRegion.BAGHDAD

    def test_basra_regional_greeting(self):
        """Basra dialect: شلونكم (Shlonkum)"""
        manager = CulturalContextManager(
            region=IraqiRegion.BASRA,
            islamic_compliance=IslamicComplianceLevel.BASIC,
            language_preference=LanguagePreference.ARABIC,
        )
        greeting = manager.generate_greeting()

        assert greeting.regional_variation == "شلونكم"
        assert greeting.region == IraqiRegion.BASRA

    def test_mosul_regional_greeting(self):
        """Mosul dialect: كيفك (Kifuk)"""
        manager = CulturalContextManager(
            region=IraqiRegion.MOSUL,
            islamic_compliance=IslamicComplianceLevel.BASIC,
            language_preference=LanguagePreference.ARABIC,
        )
        greeting = manager.generate_greeting()

        assert greeting.regional_variation == "كيفك"
        assert greeting.region == IraqiRegion.MOSUL

    def test_erbil_regional_greeting(self):
        """Erbil dialect: چونی (Choni - Kurdish)"""
        manager = CulturalContextManager(
            region=IraqiRegion.ERBIL,
            islamic_compliance=IslamicComplianceLevel.BASIC,
            language_preference=LanguagePreference.ARABIC,
        )
        greeting = manager.generate_greeting()

        assert greeting.regional_variation == "چونی"
        assert greeting.region == IraqiRegion.ERBIL

    def test_other_region_no_dialect(self):
        """Other region should use standard greeting without dialect"""
        manager = CulturalContextManager(
            region=IraqiRegion.OTHER,
            islamic_compliance=IslamicComplianceLevel.BASIC,
            language_preference=LanguagePreference.ARABIC,
        )
        greeting = manager.generate_greeting()

        assert greeting.regional_variation is None or greeting.regional_variation == ""


class TestPrayerTimeDetection:
    """Test prayer time detection and awareness"""

    def test_fajr_prayer_time(self):
        """Detect Fajr prayer time (4:30 AM - 5:30 AM)"""
        manager = CulturalContextManager(
            region=IraqiRegion.BAGHDAD,
            islamic_compliance=IslamicComplianceLevel.STANDARD,
        )
        fajr_time = datetime(2025, 1, 15, 5, 0, 0, tzinfo=ZoneInfo("Asia/Baghdad"))
        prayer = manager.get_current_prayer_time(current_time=fajr_time)

        assert prayer is not None
        assert prayer.name == "Fajr"
        assert prayer.is_active is True

    def test_dhuhr_prayer_time(self):
        """Detect Dhuhr prayer time (12:00 PM - 12:30 PM)"""
        manager = CulturalContextManager(
            region=IraqiRegion.BAGHDAD,
            islamic_compliance=IslamicComplianceLevel.STANDARD,
        )
        dhuhr_time = datetime(2025, 1, 15, 12, 15, 0, tzinfo=ZoneInfo("Asia/Baghdad"))
        prayer = manager.get_current_prayer_time(current_time=dhuhr_time)

        assert prayer is not None
        assert prayer.name == "Dhuhr"
        assert prayer.is_active is True

    def test_asr_prayer_time(self):
        """Detect Asr prayer time (3:00 PM - 3:30 PM)"""
        manager = CulturalContextManager(
            region=IraqiRegion.BAGHDAD,
            islamic_compliance=IslamicComplianceLevel.STANDARD,
        )
        asr_time = datetime(2025, 1, 15, 15, 15, 0, tzinfo=ZoneInfo("Asia/Baghdad"))
        prayer = manager.get_current_prayer_time(current_time=asr_time)

        assert prayer is not None
        assert prayer.name == "Asr"
        assert prayer.is_active is True

    def test_maghrib_prayer_time(self):
        """Detect Maghrib prayer time (5:30 PM - 6:00 PM)"""
        manager = CulturalContextManager(
            region=IraqiRegion.BAGHDAD,
            islamic_compliance=IslamicComplianceLevel.STANDARD,
        )
        maghrib_time = datetime(2025, 1, 15, 17, 45, 0, tzinfo=ZoneInfo("Asia/Baghdad"))
        prayer = manager.get_current_prayer_time(current_time=maghrib_time)

        assert prayer is not None
        assert prayer.name == "Maghrib"
        assert prayer.is_active is True

    def test_isha_prayer_time(self):
        """Detect Isha prayer time (7:00 PM - 7:30 PM)"""
        manager = CulturalContextManager(
            region=IraqiRegion.BAGHDAD,
            islamic_compliance=IslamicComplianceLevel.STANDARD,
        )
        isha_time = datetime(2025, 1, 15, 19, 15, 0, tzinfo=ZoneInfo("Asia/Baghdad"))
        prayer = manager.get_current_prayer_time(current_time=isha_time)

        assert prayer is not None
        assert prayer.name == "Isha"
        assert prayer.is_active is True

    def test_non_prayer_time(self):
        """Non-prayer time should return None"""
        manager = CulturalContextManager(
            region=IraqiRegion.BAGHDAD,
            islamic_compliance=IslamicComplianceLevel.STANDARD,
        )
        regular_time = datetime(2025, 1, 15, 10, 0, 0, tzinfo=ZoneInfo("Asia/Baghdad"))
        prayer = manager.get_current_prayer_time(current_time=regular_time)

        assert prayer is None

    def test_basic_compliance_ignores_prayer_time(self):
        """Basic compliance level should not track prayer times"""
        manager = CulturalContextManager(
            region=IraqiRegion.BAGHDAD,
            islamic_compliance=IslamicComplianceLevel.BASIC,
        )
        fajr_time = datetime(2025, 1, 15, 5, 0, 0, tzinfo=ZoneInfo("Asia/Baghdad"))
        prayer = manager.get_current_prayer_time(current_time=fajr_time)

        # Basic compliance may return None or minimal prayer info
        assert prayer is None or prayer.is_active is False


class TestTimezoneHandling:
    """Test timezone conversion and handling"""

    def test_baghdad_timezone(self):
        """Baghdad timezone (Asia/Baghdad, UTC+3)"""
        manager = CulturalContextManager(
            region=IraqiRegion.BAGHDAD,
            islamic_compliance=IslamicComplianceLevel.STANDARD,
        )

        assert manager.timezone.key == "Asia/Baghdad"

    def test_timezone_conversion_from_utc(self):
        """Convert UTC time to Baghdad time"""
        manager = CulturalContextManager(region=IraqiRegion.BAGHDAD)
        utc_time = datetime(2025, 1, 15, 3, 0, 0, tzinfo=ZoneInfo("UTC"))
        baghdad_time = manager.convert_to_local_time(utc_time)

        # UTC+3 means Baghdad is 3 hours ahead
        assert baghdad_time.hour == 6
        assert baghdad_time.tzinfo == ZoneInfo("Asia/Baghdad")

    def test_timezone_conversion_to_utc(self):
        """Convert Baghdad time to UTC"""
        manager = CulturalContextManager(region=IraqiRegion.BAGHDAD)
        baghdad_time = datetime(2025, 1, 15, 6, 0, 0, tzinfo=ZoneInfo("Asia/Baghdad"))
        utc_time = manager.convert_to_utc(baghdad_time)

        # UTC+3 means UTC is 3 hours behind
        assert utc_time.hour == 3
        assert utc_time.tzinfo == ZoneInfo("UTC")

    def test_current_time_in_baghdad(self):
        """Get current time in Baghdad timezone"""
        manager = CulturalContextManager(region=IraqiRegion.BAGHDAD)
        current = manager.get_current_time()

        assert current.tzinfo == ZoneInfo("Asia/Baghdad")
        assert isinstance(current, datetime)


class TestGreetingResultStructure:
    """Test GreetingResult data structure"""

    def test_greeting_result_has_all_fields(self):
        """Greeting result should contain all expected fields"""
        manager = CulturalContextManager(region=IraqiRegion.BAGHDAD)
        greeting = manager.generate_greeting()

        assert hasattr(greeting, "primary_greeting")
        assert hasattr(greeting, "response_greeting")
        assert hasattr(greeting, "regional_variation")
        assert hasattr(greeting, "time_period")
        assert hasattr(greeting, "region")

    def test_greeting_result_types(self):
        """Greeting result fields should have correct types"""
        manager = CulturalContextManager(region=IraqiRegion.BAGHDAD)
        greeting = manager.generate_greeting()

        assert isinstance(greeting.primary_greeting, str)
        assert isinstance(greeting.response_greeting, str)
        assert greeting.region == IraqiRegion.BAGHDAD


class TestProfessionalGreetings:
    """Test professional etiquette in greetings"""

    def test_formal_professional_greeting(self):
        """Formal professional greeting with titles"""
        manager = CulturalContextManager(
            region=IraqiRegion.BAGHDAD,
            islamic_compliance=IslamicComplianceLevel.STANDARD,
            professional_etiquette_level="formal",
        )
        greeting = manager.generate_professional_greeting(title="Dr.")

        assert (
            "Dr." in greeting.primary_greeting or "الدكتور" in greeting.primary_greeting
        )

    def test_casual_professional_greeting(self):
        """Casual professional greeting without titles"""
        manager = CulturalContextManager(
            region=IraqiRegion.BAGHDAD,
            islamic_compliance=IslamicComplianceLevel.BASIC,
            professional_etiquette_level="casual",
        )
        greeting = manager.generate_professional_greeting()

        assert greeting is not None
        assert len(greeting.primary_greeting) > 0


class TestEdgeCases:
    """Test edge cases and boundary conditions"""

    def test_midnight_greeting(self):
        """Greeting at midnight (12:00 AM)"""
        manager = CulturalContextManager(region=IraqiRegion.BAGHDAD)
        midnight = datetime(2025, 1, 15, 0, 0, 0, tzinfo=ZoneInfo("Asia/Baghdad"))
        greeting = manager.generate_greeting(current_time=midnight)

        assert greeting is not None
        assert len(greeting.primary_greeting) > 0

    def test_noon_greeting(self):
        """Greeting at noon (12:00 PM)"""
        manager = CulturalContextManager(region=IraqiRegion.BAGHDAD)
        noon = datetime(2025, 1, 15, 12, 0, 0, tzinfo=ZoneInfo("Asia/Baghdad"))
        greeting = manager.generate_greeting(current_time=noon)

        assert greeting is not None
        assert len(greeting.primary_greeting) > 0

    def test_none_time_uses_current(self):
        """None time should use current time"""
        manager = CulturalContextManager(region=IraqiRegion.BAGHDAD)
        greeting = manager.generate_greeting(current_time=None)

        assert greeting is not None
        assert len(greeting.primary_greeting) > 0

    def test_invalid_region_defaults(self):
        """Invalid region should use default Baghdad"""
        manager = CulturalContextManager(region=None)
        greeting = manager.generate_greeting()

        assert greeting is not None
        # Should default to Baghdad or OTHER region


class TestRealWorldScenarios:
    """Test realistic cultural context scenarios"""

    def test_baghdad_lawyer_morning_strict(self):
        """Baghdad lawyer, morning, strict Islamic compliance"""
        manager = CulturalContextManager(
            region=IraqiRegion.BAGHDAD,
            islamic_compliance=IslamicComplianceLevel.STRICT,
            language_preference=LanguagePreference.BOTH,
        )
        morning_time = datetime(2025, 1, 15, 8, 0, 0, tzinfo=ZoneInfo("Asia/Baghdad"))
        greeting = manager.generate_greeting(current_time=morning_time)

        assert "السلام عليكم ورحمة الله وبركاته" in greeting.primary_greeting
        assert greeting.regional_variation == "شلونك"

    def test_basra_doctor_afternoon_standard(self):
        """Basra doctor, afternoon, standard Islamic compliance"""
        manager = CulturalContextManager(
            region=IraqiRegion.BASRA,
            islamic_compliance=IslamicComplianceLevel.STANDARD,
            language_preference=LanguagePreference.ARABIC,
        )
        afternoon_time = datetime(
            2025, 1, 15, 14, 0, 0, tzinfo=ZoneInfo("Asia/Baghdad")
        )
        greeting = manager.generate_greeting(current_time=afternoon_time)

        assert "السلام عليكم" in greeting.primary_greeting
        assert greeting.regional_variation == "شلونكم"

    def test_mosul_engineer_during_prayer(self):
        """Mosul engineer requesting greeting during Dhuhr prayer"""
        manager = CulturalContextManager(
            region=IraqiRegion.MOSUL,
            islamic_compliance=IslamicComplianceLevel.STANDARD,
            language_preference=LanguagePreference.BOTH,
        )
        dhuhr_time = datetime(2025, 1, 15, 12, 15, 0, tzinfo=ZoneInfo("Asia/Baghdad"))
        prayer = manager.get_current_prayer_time(current_time=dhuhr_time)

        assert prayer is not None
        assert prayer.name == "Dhuhr"
        assert prayer.is_active is True

    def test_erbil_professor_bilingual_basic(self):
        """Erbil professor, bilingual, basic compliance"""
        manager = CulturalContextManager(
            region=IraqiRegion.ERBIL,
            islamic_compliance=IslamicComplianceLevel.BASIC,
            language_preference=LanguagePreference.BOTH,
        )
        evening_time = datetime(2025, 1, 15, 18, 0, 0, tzinfo=ZoneInfo("Asia/Baghdad"))
        greeting = manager.generate_greeting(current_time=evening_time)

        assert (
            "مساء" in greeting.primary_greeting
            or "evening" in greeting.primary_greeting.lower()
        )
        assert greeting.regional_variation == "چونی"
