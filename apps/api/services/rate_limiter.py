"""
Rate Limiting Service
IP-based and user-based rate limiting with cultural prayer time flexibility
"""

from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Request
from typing import Optional, Dict, Tuple
from datetime import datetime, time, timedelta
import logging
import asyncio

logger = logging.getLogger(__name__)


# Prayer time cache with TTL (reduces latency from 50-200ms to <1ms)
_prayer_time_cache: Dict[str, Tuple[bool, datetime]] = {}
_prayer_time_cache_ttl_seconds: int = 120  # 2 minutes TTL
_prayer_time_cache_lock: asyncio.Lock = asyncio.Lock()


async def is_prayer_time_cached(city: str = "baghdad") -> bool:
    """
    Check if current time is during prayer time with caching

    Uses a 2-minute cache to reduce latency from 50-200ms to <1ms.
    Falls back to last cached value if the prayer times service fails.

    Args:
        city: Iraqi city (defaults to baghdad)

    Returns:
        True if during prayer time, False otherwise
    """
    global _prayer_time_cache

    now = datetime.now()

    # Check cache first (with async lock for coroutine safety)
    async with _prayer_time_cache_lock:
        if city in _prayer_time_cache:
            cached_result, cached_time = _prayer_time_cache[city]
            age_seconds = (now - cached_time).total_seconds()

            # Return cached result if still valid
            if age_seconds < _prayer_time_cache_ttl_seconds:
                return cached_result

    # Cache miss or expired - fetch fresh data
    try:
        from services.prayer_times_service import PrayerTimesService

        # Check if current time is within prayer time window (15 minutes flexibility)
        is_prayer, prayer_name = await PrayerTimesService.is_prayer_time(
            city=city, flexibility_minutes=15
        )

        if is_prayer:
            logger.info(f"Current time is during {prayer_name} prayer time in {city}")

        # Update cache with async lock
        async with _prayer_time_cache_lock:
            _prayer_time_cache[city] = (is_prayer, now)

        return is_prayer

    except Exception as e:
        logger.error(f"Failed to check prayer time: {e}")

        # Fallback: return last cached value if available
        async with _prayer_time_cache_lock:
            if city in _prayer_time_cache:
                cached_result, cached_time = _prayer_time_cache[city]
                logger.warning(
                    f"Using stale prayer time cache ({(now - cached_time).total_seconds():.0f}s old) due to service failure"
                )
                return cached_result

        # Ultimate fallback: assume not prayer time
        return False


# Deprecated: kept for backward compatibility, use is_prayer_time_cached instead
async def is_prayer_time(city: str = "baghdad") -> bool:
    """
    DEPRECATED: Use is_prayer_time_cached() instead for better performance.

    Check if current time is during prayer time using prayer times service

    Args:
        city: Iraqi city (defaults to baghdad)

    Returns:
        True if during prayer time, False otherwise
    """
    return await is_prayer_time_cached(city)


def get_rate_limit_key(request: Request) -> str:
    """
    Get rate limit key from request

    Uses IP address for anonymous requests, user ID for authenticated requests.
    During prayer times, rate limits are adjusted in prayer_time_adjusted_limit().

    Args:
        request: FastAPI request object

    Returns:
        Rate limit key (IP or user_id)
    """
    # Try to get user ID from request state (set by auth middleware)
    user = getattr(request.state, "user", None)
    if user and isinstance(user, dict):
        user_id = user.get("user_id")
        if user_id:
            return f"user:{user_id}"

    # Fall back to IP address for anonymous requests
    return f"ip:{get_remote_address(request)}"


async def prayer_time_adjusted_limit(base_limit: str, city: str = "baghdad") -> str:
    """
    Adjust rate limit if during prayer time using cached prayer times service

    During prayer times, doubles the allowed requests to respect cultural timing.
    For example: "5/15minutes" becomes "10/15minutes" during prayer times.

    Uses cached prayer time check (2-minute TTL) for <1ms latency.

    Args:
        base_limit: Base rate limit string (e.g., "5/15minutes")
        city: Iraqi city for prayer time check (defaults to baghdad)

    Returns:
        Adjusted rate limit string
    """
    if await is_prayer_time_cached(city):
        # Parse the limit (e.g., "5/15minutes")
        try:
            count, period = base_limit.split("/")
            adjusted_count = int(count) * 2  # Double the limit during prayer times
            adjusted_limit = f"{adjusted_count}/{period}"
            logger.info(
                f"Prayer time adjustment: {base_limit} -> {adjusted_limit} (doubled during prayer)"
            )
            return adjusted_limit
        except ValueError:
            logger.warning(f"Could not parse rate limit: {base_limit}")
            return base_limit

    return base_limit


# Initialize SlowAPI limiter
# Uses in-memory storage by default (for production, consider Redis)
limiter = Limiter(
    key_func=get_rate_limit_key,
    default_limits=["100/hour"],  # Global default: 100 requests per hour per user/IP
    storage_uri="memory://",  # In-memory storage (use redis:// for production)
    strategy="fixed-window",  # Fixed window strategy (simpler, faster)
    # strategy="moving-window",  # Alternative: more accurate but slower
    headers_enabled=True,  # Include rate limit headers in response
)


# Rate limit configurations for different endpoints
AUTH_RATE_LIMITS = {
    "register": "5/15minutes",  # 5 registration attempts per 15 minutes
    "login": "5/15minutes",  # 5 login attempts per 15 minutes
    "password_reset": "3/hour",  # 3 password reset requests per hour
    "email_verification": "10/hour",  # 10 email verification attempts per hour
    "mfa_setup": "5/hour",  # 5 MFA setup attempts per hour
    "mfa_verify": "10/15minutes",  # 10 MFA verification attempts per 15 minutes
}


async def get_auth_rate_limit(endpoint: str, city: str = "baghdad") -> str:
    """
    Get rate limit for authentication endpoint with prayer time adjustment

    Args:
        endpoint: Endpoint name (e.g., "login", "register")
        city: Iraqi city for prayer time check (defaults to baghdad)

    Returns:
        Rate limit string adjusted for prayer times if applicable
    """
    base_limit = AUTH_RATE_LIMITS.get(endpoint, "10/hour")
    return await prayer_time_adjusted_limit(base_limit, city)
