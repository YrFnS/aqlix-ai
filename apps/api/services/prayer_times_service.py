"""
Prayer Times Service

Integrates with Aladhan API to fetch accurate Islamic prayer times for Iraqi regions.
Implements 24-hour caching for performance and provides prayer time flexibility for MFA.

API Documentation: https://aladhan.com/prayer-times-api
"""

import logging
from datetime import datetime, timedelta
from typing import Optional, Dict, List, Tuple
from dataclasses import dataclass
import httpx
import asyncio


# Configure logger
logger = logging.getLogger(__name__)


@dataclass
class PrayerTimes:
    """Prayer times for a specific date"""

    fajr: str  # Dawn prayer
    sunrise: str  # Sunrise (not a prayer time, but important for calculation)
    dhuhr: str  # Noon prayer
    asr: str  # Afternoon prayer
    maghrib: str  # Sunset prayer
    isha: str  # Night prayer
    date: str  # Gregorian date (YYYY-MM-DD)
    hijri_date: str  # Hijri date
    timezone: str  # Timezone


@dataclass
class PrayerTimeWindow:
    """Prayer time window with flexibility"""

    prayer_name: str
    start_time: datetime
    end_time: datetime
    is_prayer_time: bool  # True if current time is within window


class PrayerTimesService:
    """
    Service for fetching and caching Islamic prayer times using Aladhan API

    Features:
    - Fetches prayer times for Iraqi cities (Baghdad, Basra, Mosul, Erbil)
    - 24-hour caching to minimize API calls
    - Prayer time flexibility (+/- 15 minutes default)
    - Supports multiple calculation methods (Iraqi standard)
    """

    # Aladhan API configuration
    ALADHAN_API_BASE = "https://api.aladhan.com/v1"

    # Iraqi city coordinates
    IRAQI_CITIES = {
        "baghdad": {
            "latitude": 33.3152,
            "longitude": 44.3661,
            "timezone": "Asia/Baghdad",
        },
        "basra": {
            "latitude": 30.5085,
            "longitude": 47.7835,
            "timezone": "Asia/Baghdad",
        },
        "mosul": {
            "latitude": 36.3350,
            "longitude": 43.1189,
            "timezone": "Asia/Baghdad",
        },
        "erbil": {
            "latitude": 36.1911,
            "longitude": 44.0091,
            "timezone": "Asia/Baghdad",
        },
    }

    # Calculation method for Iraqi region (Shia Ithna-Ashari)
    CALCULATION_METHOD = 0  # Shia Ithna-Ashari (Jafari)

    # Cache storage (in-memory cache)
    # In production, use Redis or similar distributed cache
    _cache: Dict[str, Dict] = {}
    _cache_expiry: Dict[str, datetime] = {}
    _cache_lock: asyncio.Lock = (
        asyncio.Lock()
    )  # Async-safe cache access (coroutine synchronization)

    @classmethod
    async def get_prayer_times(
        cls,
        city: str = "baghdad",
        date: Optional[datetime] = None,
    ) -> Optional[PrayerTimes]:
        """
        Get prayer times for a specific Iraqi city and date

        Args:
            city: Iraqi city (baghdad, basra, mosul, erbil)
            date: Date for prayer times (defaults to today)

        Returns:
            PrayerTimes object or None if fetch fails
        """
        if date is None:
            date = datetime.now()

        city = city.lower()
        if city not in cls.IRAQI_CITIES:
            logger.warning(f"Unknown city '{city}', defaulting to Baghdad")
            city = "baghdad"

        # Check cache first (with lock for thread safety)
        cache_key = f"{city}_{date.strftime('%Y-%m-%d')}"

        async with cls._cache_lock:
            if cache_key in cls._cache and cache_key in cls._cache_expiry:
                if datetime.now() < cls._cache_expiry[cache_key]:
                    logger.info(
                        f"Returning cached prayer times for {city} on {date.date()}"
                    )
                    return cls._cache[cache_key]

        # Fetch from API
        try:
            prayer_times = await cls._fetch_from_aladhan_api(city, date)

            if prayer_times:
                # Cache for 24 hours (with lock for thread safety)
                async with cls._cache_lock:
                    cls._cache[cache_key] = prayer_times
                    cls._cache_expiry[cache_key] = datetime.now() + timedelta(hours=24)
                logger.info(
                    f"Fetched and cached prayer times for {city} on {date.date()}"
                )

            return prayer_times

        except Exception as e:
            logger.error(f"Failed to fetch prayer times for {city}: {e}")
            return None

    @classmethod
    async def _fetch_from_aladhan_api(
        cls, city: str, date: datetime
    ) -> Optional[PrayerTimes]:
        """
        Fetch prayer times from Aladhan API

        Args:
            city: Iraqi city name
            date: Date for prayer times

        Returns:
            PrayerTimes object or None if fetch fails
        """
        city_config = cls.IRAQI_CITIES[city]

        # Construct API URL
        url = (
            f"{cls.ALADHAN_API_BASE}/timings/{date.strftime('%d-%m-%Y')}"
            f"?latitude={city_config['latitude']}"
            f"&longitude={city_config['longitude']}"
            f"&method={cls.CALCULATION_METHOD}"
        )

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(url)
                response.raise_for_status()

                data = response.json()

                if data.get("code") == 200 and data.get("status") == "OK":
                    timings = data["data"]["timings"]
                    date_info = data["data"]["date"]

                    return PrayerTimes(
                        fajr=timings["Fajr"],
                        sunrise=timings["Sunrise"],
                        dhuhr=timings["Dhuhr"],
                        asr=timings["Asr"],
                        maghrib=timings["Maghrib"],
                        isha=timings["Isha"],
                        date=date_info["gregorian"]["date"],
                        hijri_date=f"{date_info['hijri']['day']} {date_info['hijri']['month']['en']} {date_info['hijri']['year']}",
                        timezone=city_config["timezone"],
                    )

                else:
                    logger.error(f"Aladhan API returned error: {data}")
                    return None

        except httpx.HTTPError as e:
            logger.error(f"HTTP error fetching prayer times: {e}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error fetching prayer times: {e}")
            return None

    @classmethod
    async def is_prayer_time(
        cls,
        city: str = "baghdad",
        flexibility_minutes: int = 15,
    ) -> Tuple[bool, Optional[str]]:
        """
        Check if current time is within prayer time window (with flexibility)

        Args:
            city: Iraqi city
            flexibility_minutes: Minutes of flexibility before/after prayer time

        Returns:
            (is_prayer_time, prayer_name) tuple
        """
        prayer_times = await cls.get_prayer_times(city)

        if not prayer_times:
            logger.warning("Could not fetch prayer times, assuming not prayer time")
            return False, None

        now = datetime.now()
        current_time = now.time()

        # Parse prayer times and check each one
        prayer_schedule = {
            "Fajr": prayer_times.fajr,
            "Dhuhr": prayer_times.dhuhr,
            "Asr": prayer_times.asr,
            "Maghrib": prayer_times.maghrib,
            "Isha": prayer_times.isha,
        }

        for prayer_name, prayer_time_str in prayer_schedule.items():
            try:
                # Parse prayer time (format: "HH:MM")
                prayer_time = datetime.strptime(prayer_time_str, "%H:%M").time()

                # Create datetime objects for comparison
                prayer_datetime = datetime.combine(now.date(), prayer_time)

                # Calculate flexibility window
                start_window = prayer_datetime - timedelta(minutes=flexibility_minutes)
                end_window = prayer_datetime + timedelta(minutes=flexibility_minutes)

                # Check if current time is within window
                if start_window <= now <= end_window:
                    return True, prayer_name

            except Exception as e:
                logger.error(f"Error parsing prayer time {prayer_name}: {e}")
                continue

        return False, None

    @classmethod
    async def get_next_prayer(cls, city: str = "baghdad") -> Optional[Tuple[str, str]]:
        """
        Get the next upcoming prayer time

        Args:
            city: Iraqi city

        Returns:
            (prayer_name, prayer_time) tuple or None
        """
        prayer_times = await cls.get_prayer_times(city)

        if not prayer_times:
            return None

        now = datetime.now()
        current_time = now.time()

        # Prayer schedule in order
        prayer_schedule = [
            ("Fajr", prayer_times.fajr),
            ("Dhuhr", prayer_times.dhuhr),
            ("Asr", prayer_times.asr),
            ("Maghrib", prayer_times.maghrib),
            ("Isha", prayer_times.isha),
        ]

        # Find next prayer
        for prayer_name, prayer_time_str in prayer_schedule:
            try:
                prayer_time = datetime.strptime(prayer_time_str, "%H:%M").time()

                if current_time < prayer_time:
                    return prayer_name, prayer_time_str

            except Exception as e:
                logger.error(f"Error parsing prayer time {prayer_name}: {e}")
                continue

        # If no prayer found today, fetch tomorrow's Fajr time
        tomorrow = now + timedelta(days=1)
        tomorrow_prayer_times = await cls.get_prayer_times(city, tomorrow)

        if tomorrow_prayer_times:
            return "Fajr (tomorrow)", tomorrow_prayer_times.fajr
        else:
            # Fallback to today's Fajr if tomorrow fetch fails
            logger.warning(
                "Could not fetch tomorrow's prayer times, using today's Fajr as fallback"
            )
            return "Fajr", prayer_times.fajr

    @classmethod
    async def clear_cache(cls):
        """Clear the prayer times cache (with lock for thread safety)"""
        async with cls._cache_lock:
            cls._cache.clear()
            cls._cache_expiry.clear()
        logger.info("Prayer times cache cleared")
