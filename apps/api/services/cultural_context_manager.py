"""
Cultural Context Manager Service
Manages cultural preferences, greetings, and timing for Iraqi users
"""

from datetime import datetime, time
from typing import Optional, Dict, List
from enum import Enum
from pydantic import BaseModel
import zoneinfo


class IraqiRegion(str, Enum):
    """Iraqi regions"""

    BAGHDAD = "baghdad"
    BASRA = "basra"
    MOSUL = "mosul"
    ERBIL = "erbil"
    OTHER = "other"


class IslamicComplianceLevel(str, Enum):
    """Islamic compliance level preferences"""

    BASIC = "basic"
    STANDARD = "standard"
    STRICT = "strict"


class TimeOfDay(str, Enum):
    """Time of day for greeting customization"""

    DAWN = "dawn"  # 4:00-6:00
    MORNING = "morning"  # 6:00-12:00
    AFTERNOON = "afternoon"  # 12:00-16:00
    EVENING = "evening"  # 16:00-20:00
    NIGHT = "night"  # 20:00-4:00


class PrayerTime(str, Enum):
    """Islamic prayer times"""

    FAJR = "fajr"  # Dawn prayer
    DHUHR = "dhuhr"  # Noon prayer
    ASR = "asr"  # Afternoon prayer
    MAGHRIB = "maghrib"  # Sunset prayer
    ISHA = "isha"  # Night prayer


class CulturalGreeting(BaseModel):
    """Culturally appropriate greeting"""

    primary_greeting: str
    regional_variation: Optional[str] = None
    professional_suffix: Optional[str] = None
    time_based_adjustment: str
    cultural_respect_level: str
    language: str = "ar-IQ"


class PrayerTimeWindow(BaseModel):
    """Prayer time window"""

    prayer_name: PrayerTime
    start_time: time
    end_time: time
    is_current: bool = False


class CulturalContextManager:
    """
    Cultural Context Manager

    Manages Iraqi cultural preferences including:
    - Time-appropriate greetings (Arabic/English)
    - Prayer time considerations for MFA
    - Regional cultural variations
    - Professional etiquette levels
    - Islamic compliance levels
    """

    # Iraqi timezone
    IRAQ_TIMEZONE = zoneinfo.ZoneInfo("Asia/Baghdad")

    # Standard prayer times (approximate for Baghdad, adjusted seasonally in production)
    PRAYER_TIMES = {
        PrayerTime.FAJR: {"start": time(4, 30), "end": time(5, 30)},
        PrayerTime.DHUHR: {"start": time(12, 0), "end": time(12, 30)},
        PrayerTime.ASR: {"start": time(15, 30), "end": time(16, 15)},
        PrayerTime.MAGHRIB: {"start": time(18, 0), "end": time(18, 30)},
        PrayerTime.ISHA: {"start": time(19, 30), "end": time(20, 15)},
    }

    # Regional greeting variations (Iraqi Arabic dialect)
    REGIONAL_GREETINGS = {
        IraqiRegion.BAGHDAD: "شلونك",  # Shlonuk (How are you - Baghdad)
        IraqiRegion.BASRA: "شلونكم",  # Shlonkum (How are you - Basra)
        IraqiRegion.MOSUL: "كيفك",  # Kifuk (How are you - Mosul)
        IraqiRegion.ERBIL: "چونی",  # Choni (How are you - Kurdish/Erbil)
        IraqiRegion.OTHER: "شلونك",  # Default to Baghdad dialect
    }

    # Professional titles by domain
    PROFESSIONAL_TITLES = {
        "legal": {"ar": "الأستاذ", "en": "Counselor"},
        "medical": {"ar": "الدكتور", "en": "Doctor"},
        "educational": {"ar": "الأستاذ", "en": "Professor"},
        "engineering": {"ar": "المهندس", "en": "Engineer"},
        "organizational": {"ar": "الأستاذ", "en": "Mr./Ms."},
    }

    @staticmethod
    def get_current_time_of_day(current_time: Optional[datetime] = None) -> TimeOfDay:
        """
        Get time of day category

        Args:
            current_time: Current time (defaults to now in Iraq timezone)

        Returns:
            TimeOfDay enum value
        """
        if current_time is None:
            current_time = datetime.now(CulturalContextManager.IRAQ_TIMEZONE)

        hour = current_time.hour

        if 4 <= hour < 6:
            return TimeOfDay.DAWN
        elif 6 <= hour < 12:
            return TimeOfDay.MORNING
        elif 12 <= hour < 16:
            return TimeOfDay.AFTERNOON
        elif 16 <= hour < 20:
            return TimeOfDay.EVENING
        else:
            return TimeOfDay.NIGHT

    @staticmethod
    def get_time_based_greeting(time_of_day: TimeOfDay, language: str = "ar-IQ") -> str:
        """
        Get time-appropriate greeting

        Args:
            time_of_day: Time of day category
            language: Language preference (ar-IQ, en-US)

        Returns:
            Time-appropriate greeting
        """
        arabic_greetings = {
            TimeOfDay.DAWN: "صباح الخير",  # Good morning (early)
            TimeOfDay.MORNING: "صباح الخير",  # Good morning
            TimeOfDay.AFTERNOON: "مساء الخير",  # Good afternoon
            TimeOfDay.EVENING: "مساء الخير",  # Good evening
            TimeOfDay.NIGHT: "مساء الخير",  # Good evening
        }

        english_greetings = {
            TimeOfDay.DAWN: "Good morning",
            TimeOfDay.MORNING: "Good morning",
            TimeOfDay.AFTERNOON: "Good afternoon",
            TimeOfDay.EVENING: "Good evening",
            TimeOfDay.NIGHT: "Good evening",
        }

        if language == "ar-IQ":
            return arabic_greetings.get(time_of_day, "السلام عليكم")
        else:
            return english_greetings.get(time_of_day, "Hello")

    @classmethod
    def get_current_prayer_time(
        cls, current_time: Optional[datetime] = None
    ) -> Optional[PrayerTimeWindow]:
        """
        Check if current time falls within a prayer time window

        Args:
            current_time: Current time (defaults to now in Iraq timezone)

        Returns:
            PrayerTimeWindow if currently in prayer time, None otherwise
        """
        if current_time is None:
            current_time = datetime.now(cls.IRAQ_TIMEZONE)

        current_time_only = current_time.time()

        for prayer, times in cls.PRAYER_TIMES.items():
            start = times["start"]
            end = times["end"]

            if start <= current_time_only <= end:
                return PrayerTimeWindow(
                    prayer_name=prayer,
                    start_time=start,
                    end_time=end,
                    is_current=True,
                )

        return None

    @classmethod
    async def should_delay_mfa(
        cls,
        respect_prayer_times: bool = True,
        cultural_timing_flexibility: int = 15,
        current_time: Optional[datetime] = None,
        city: str = "baghdad",
    ) -> tuple[bool, Optional[str]]:
        """
        Check if MFA should be delayed due to prayer time

        Now uses Aladhan API for accurate prayer times instead of hardcoded times

        Args:
            respect_prayer_times: Whether to respect prayer times
            cultural_timing_flexibility: Minutes of flexibility before/after prayer
            current_time: Current time (defaults to now)
            city: Iraqi city for prayer times (baghdad, basra, mosul, erbil)

        Returns:
            Tuple of (should_delay, reason)
        """
        if not respect_prayer_times:
            return False, None

        if current_time is None:
            current_time = datetime.now(cls.IRAQ_TIMEZONE)

        # Import prayer times service
        from apps.api.services.prayer_times_service import PrayerTimesService

        # Check if currently in prayer time using Aladhan API
        is_prayer, prayer_name = await PrayerTimesService.is_prayer_time(
            city=city, flexibility_minutes=cultural_timing_flexibility
        )

        if is_prayer and prayer_name:
            # Get next prayer time to inform user when to retry
            next_prayer_info = await PrayerTimesService.get_next_prayer(city=city)

            if next_prayer_info:
                next_prayer_name, next_prayer_time = next_prayer_info
                return (
                    True,
                    f"During {prayer_name} prayer time. "
                    f"Please try again after the prayer (next prayer: {next_prayer_name} at {next_prayer_time})",
                )
            else:
                return (
                    True,
                    f"During {prayer_name} prayer time. Please try again after the prayer.",
                )

        return False, None

    @classmethod
    def generate_cultural_greeting(
        cls,
        full_name: str,
        region: IraqiRegion = IraqiRegion.BAGHDAD,
        islamic_compliance_level: IslamicComplianceLevel = IslamicComplianceLevel.STANDARD,
        language_preference: str = "ar-IQ",
        professional_domain: Optional[str] = None,
        professional_etiquette_level: str = "standard",
        current_time: Optional[datetime] = None,
    ) -> CulturalGreeting:
        """
        Generate culturally appropriate greeting

        Args:
            full_name: User's full name
            region: Iraqi region for dialect variation
            islamic_compliance_level: Islamic compliance level
            language_preference: Language preference (ar-IQ, en-US, both)
            professional_domain: Professional domain for title
            professional_etiquette_level: Etiquette level (standard, formal, traditional)
            current_time: Current time (defaults to now)

        Returns:
            CulturalGreeting with appropriate greeting and variations
        """
        if current_time is None:
            current_time = datetime.now(cls.IRAQ_TIMEZONE)

        time_of_day = cls.get_current_time_of_day(current_time)

        # Build primary greeting based on Islamic compliance
        if islamic_compliance_level in [
            IslamicComplianceLevel.STANDARD,
            IslamicComplianceLevel.STRICT,
        ]:
            # Use Islamic greeting
            if language_preference == "ar-IQ":
                primary_greeting = "السلام عليكم ورحمة الله وبركاته"
            else:
                primary_greeting = "Peace be upon you"
        else:
            # Use time-based greeting
            primary_greeting = cls.get_time_based_greeting(
                time_of_day, language_preference
            )

        # Add regional variation
        regional_variation = None
        if language_preference in ["ar-IQ", "both"]:
            regional_variation = cls.REGIONAL_GREETINGS.get(
                region, cls.REGIONAL_GREETINGS[IraqiRegion.BAGHDAD]
            )

        # Add professional suffix
        professional_suffix = None
        if professional_domain and professional_etiquette_level in [
            "formal",
            "traditional",
        ]:
            title_map = cls.PROFESSIONAL_TITLES.get(professional_domain, {})
            if language_preference == "ar-IQ":
                professional_suffix = title_map.get("ar", "")
            else:
                professional_suffix = title_map.get("en", "")

        # Determine cultural respect level
        cultural_respect_level = "high"
        if islamic_compliance_level == IslamicComplianceLevel.STRICT:
            cultural_respect_level = "very_high"
        elif islamic_compliance_level == IslamicComplianceLevel.BASIC:
            cultural_respect_level = "standard"

        return CulturalGreeting(
            primary_greeting=primary_greeting,
            regional_variation=regional_variation,
            professional_suffix=professional_suffix,
            time_based_adjustment=time_of_day.value,
            cultural_respect_level=cultural_respect_level,
            language=language_preference,
        )

    @staticmethod
    def get_cultural_jwt_metadata(
        region: IraqiRegion,
        islamic_compliance_level: IslamicComplianceLevel,
        language_preference: str,
        professional_domain: Optional[str] = None,
        family_privacy_level: str = "family",
        professional_etiquette_level: str = "standard",
    ) -> Dict:
        """
        Generate cultural metadata for JWT token

        Args:
            region: Iraqi region
            islamic_compliance_level: Islamic compliance level
            language_preference: Language preference
            professional_domain: Professional domain
            family_privacy_level: Family privacy level
            professional_etiquette_level: Professional etiquette level

        Returns:
            Dictionary of cultural metadata for JWT
        """
        return {
            "region": region.value,
            "islamic_compliance_level": islamic_compliance_level.value,
            "language_preference": language_preference,
            "professional_domain": professional_domain,
            "family_privacy_level": family_privacy_level,
            "professional_etiquette_level": professional_etiquette_level,
            "cultural_context_version": "1.0",
            "timezone": "Asia/Baghdad",
        }

    @staticmethod
    def get_timing_preferences(
        respect_prayer_times: bool = True,
        cultural_timing_flexibility: int = 15,
    ) -> Dict:
        """
        Get timing preferences for MFA and notifications

        Args:
            respect_prayer_times: Whether to respect prayer times
            cultural_timing_flexibility: Minutes of flexibility

        Returns:
            Dictionary of timing preferences
        """
        return {
            "respect_prayer_times": respect_prayer_times,
            "cultural_timing_flexibility_minutes": cultural_timing_flexibility,
            "avoid_late_night_notifications": True,
            "quiet_hours_start": "22:00",
            "quiet_hours_end": "06:00",
            "prefer_business_hours": True,
            "business_hours_start": "08:00",
            "business_hours_end": "17:00",
        }
