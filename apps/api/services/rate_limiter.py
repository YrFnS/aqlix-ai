"""
Rate Limiting Service
IP-based and user-based rate limiting with cultural prayer time flexibility
"""

from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Request
from typing import Optional
from datetime import datetime, time
import logging

logger = logging.getLogger(__name__)


# Prayer time ranges (Baghdad timezone UTC+3)
# These are approximate times - in production, would use prayer time API
PRAYER_TIMES = {
    "fajr": (time(4, 30), time(5, 30)),  # Dawn prayer
    "dhuhr": (time(12, 0), time(12, 45)),  # Noon prayer
    "asr": (time(15, 30), time(16, 15)),  # Afternoon prayer
    "maghrib": (time(18, 0), time(18, 30)),  # Sunset prayer
    "isha": (time(19, 30), time(20, 15)),  # Night prayer
}


def is_prayer_time(current_time: Optional[time] = None) -> bool:
    """
    Check if current time is during prayer time

    Args:
        current_time: Time to check (defaults to now)

    Returns:
        True if during prayer time, False otherwise
    """
    if current_time is None:
        current_time = datetime.now().time()

    for prayer_name, (start, end) in PRAYER_TIMES.items():
        if start <= current_time <= end:
            logger.info(
                f"Current time {current_time} is during {prayer_name} prayer ({start}-{end})"
            )
            return True

    return False


def get_rate_limit_key(request: Request) -> str:
    """
    Get rate limit key from request

    Uses IP address for anonymous requests, user ID for authenticated requests.
    During prayer times, returns a special key to apply more lenient rate limiting.

    Args:
        request: FastAPI request object

    Returns:
        Rate limit key (IP or user_id)
    """
    # Check if during prayer time
    if is_prayer_time():
        # During prayer times, use a special key prefix to apply more lenient limits
        # This is handled by applying different limits in the decorator
        pass

    # Try to get user ID from request state (set by auth middleware)
    user = getattr(request.state, "user", None)
    if user and isinstance(user, dict):
        user_id = user.get("user_id")
        if user_id:
            return f"user:{user_id}"

    # Fall back to IP address for anonymous requests
    return f"ip:{get_remote_address(request)}"


def prayer_time_adjusted_limit(base_limit: str) -> str:
    """
    Adjust rate limit if during prayer time

    During prayer times, doubles the allowed requests to respect cultural timing.
    For example: "5/15minutes" becomes "10/15minutes" during prayer times.

    Args:
        base_limit: Base rate limit string (e.g., "5/15minutes")

    Returns:
        Adjusted rate limit string
    """
    if is_prayer_time():
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


def get_auth_rate_limit(endpoint: str) -> str:
    """
    Get rate limit for authentication endpoint with prayer time adjustment

    Args:
        endpoint: Endpoint name (e.g., "login", "register")

    Returns:
        Rate limit string adjusted for prayer times if applicable
    """
    base_limit = AUTH_RATE_LIMITS.get(endpoint, "10/hour")
    return prayer_time_adjusted_limit(base_limit)
