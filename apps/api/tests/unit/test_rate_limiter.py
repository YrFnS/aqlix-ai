"""
Unit tests for rate limiting functionality
Tests IP-based and user-based rate limiting with prayer time flexibility
"""

import sys
import os
from datetime import time
import pytest

# Add parent directory to path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

# Import rate limiter module
import importlib.util

spec = importlib.util.spec_from_file_location(
    "rate_limiter",
    os.path.join(os.path.dirname(__file__), "../../services/rate_limiter.py"),
)
rate_limiter_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(rate_limiter_module)

is_prayer_time = rate_limiter_module.is_prayer_time
prayer_time_adjusted_limit = rate_limiter_module.prayer_time_adjusted_limit
get_auth_rate_limit = rate_limiter_module.get_auth_rate_limit
PRAYER_TIMES = rate_limiter_module.PRAYER_TIMES


class TestPrayerTimeDetection:
    """Test prayer time detection functionality"""

    def test_is_prayer_time_during_fajr(self):
        """Test detection during Fajr (dawn) prayer"""
        # Fajr: 4:30 - 5:30
        fajr_time = time(5, 0)  # Middle of Fajr
        result = is_prayer_time(fajr_time)
        assert result is True

    def test_is_prayer_time_during_dhuhr(self):
        """Test detection during Dhuhr (noon) prayer"""
        # Dhuhr: 12:00 - 12:45
        dhuhr_time = time(12, 20)  # Middle of Dhuhr
        result = is_prayer_time(dhuhr_time)
        assert result is True

    def test_is_prayer_time_during_asr(self):
        """Test detection during Asr (afternoon) prayer"""
        # Asr: 15:30 - 16:15
        asr_time = time(15, 50)  # Middle of Asr
        result = is_prayer_time(asr_time)
        assert result is True

    def test_is_prayer_time_during_maghrib(self):
        """Test detection during Maghrib (sunset) prayer"""
        # Maghrib: 18:00 - 18:30
        maghrib_time = time(18, 15)  # Middle of Maghrib
        result = is_prayer_time(maghrib_time)
        assert result is True

    def test_is_prayer_time_during_isha(self):
        """Test detection during Isha (night) prayer"""
        # Isha: 19:30 - 20:15
        isha_time = time(19, 50)  # Middle of Isha
        result = is_prayer_time(isha_time)
        assert result is True

    def test_is_not_prayer_time_between_prayers(self):
        """Test detection outside prayer times"""
        # Time between prayers (e.g., 10:00 AM)
        non_prayer_time = time(10, 0)
        result = is_prayer_time(non_prayer_time)
        assert result is False

    def test_is_not_prayer_time_late_night(self):
        """Test detection late at night (outside prayer times)"""
        late_night = time(23, 0)
        result = is_prayer_time(late_night)
        assert result is False

    def test_prayer_time_boundaries_start(self):
        """Test prayer time detection at exact start time"""
        # Test start of Dhuhr prayer
        dhuhr_start = time(12, 0)
        result = is_prayer_time(dhuhr_start)
        assert result is True

    def test_prayer_time_boundaries_end(self):
        """Test prayer time detection at exact end time"""
        # Test end of Dhuhr prayer
        dhuhr_end = time(12, 45)
        result = is_prayer_time(dhuhr_end)
        assert result is True

    def test_prayer_time_just_before_start(self):
        """Test detection just before prayer time starts"""
        before_dhuhr = time(11, 59)
        result = is_prayer_time(before_dhuhr)
        assert result is False

    def test_prayer_time_just_after_end(self):
        """Test detection just after prayer time ends"""
        after_dhuhr = time(12, 46)
        result = is_prayer_time(after_dhuhr)
        assert result is False


class TestPrayerTimeAdjustedLimits:
    """Test prayer time rate limit adjustments"""

    def test_adjusted_limit_doubles_during_prayer(self):
        """Test that rate limits double during prayer times"""
        base_limit = "5/15minutes"

        # Mock is_prayer_time to return True
        import unittest.mock as mock

        with mock.patch.object(
            rate_limiter_module, "is_prayer_time", return_value=True
        ):
            adjusted = prayer_time_adjusted_limit(base_limit)
            assert adjusted == "10/15minutes"

    def test_adjusted_limit_unchanged_outside_prayer(self):
        """Test that rate limits stay the same outside prayer times"""
        base_limit = "5/15minutes"

        # Mock is_prayer_time to return False
        import unittest.mock as mock

        with mock.patch.object(
            rate_limiter_module, "is_prayer_time", return_value=False
        ):
            adjusted = prayer_time_adjusted_limit(base_limit)
            assert adjusted == "5/15minutes"

    def test_adjusted_limit_various_formats(self):
        """Test limit adjustment with various format strings"""
        test_cases = [
            ("5/15minutes", "10/15minutes"),
            ("10/hour", "20/hour"),
            ("3/hour", "6/hour"),
            ("100/day", "200/day"),
        ]

        import unittest.mock as mock

        with mock.patch.object(
            rate_limiter_module, "is_prayer_time", return_value=True
        ):
            for base_limit, expected in test_cases:
                result = prayer_time_adjusted_limit(base_limit)
                assert result == expected, (
                    f"Expected {expected} for {base_limit}, got {result}"
                )

    def test_adjusted_limit_handles_invalid_format(self):
        """Test that invalid format strings are returned unchanged"""
        invalid_limits = [
            "invalid",
            "5",
            "/15minutes",
            "5/",
        ]

        import unittest.mock as mock

        with mock.patch.object(
            rate_limiter_module, "is_prayer_time", return_value=True
        ):
            for invalid_limit in invalid_limits:
                result = prayer_time_adjusted_limit(invalid_limit)
                # Should return unchanged if parsing fails
                assert result == invalid_limit


class TestAuthRateLimits:
    """Test authentication endpoint rate limit configurations"""

    def test_get_auth_rate_limit_login(self):
        """Test rate limit for login endpoint"""
        import unittest.mock as mock

        with mock.patch.object(
            rate_limiter_module, "is_prayer_time", return_value=False
        ):
            limit = get_auth_rate_limit("login")
            assert limit == "5/15minutes"

    def test_get_auth_rate_limit_register(self):
        """Test rate limit for register endpoint"""
        import unittest.mock as mock

        with mock.patch.object(
            rate_limiter_module, "is_prayer_time", return_value=False
        ):
            limit = get_auth_rate_limit("register")
            assert limit == "5/15minutes"

    def test_get_auth_rate_limit_password_reset(self):
        """Test rate limit for password reset endpoint"""
        import unittest.mock as mock

        with mock.patch.object(
            rate_limiter_module, "is_prayer_time", return_value=False
        ):
            limit = get_auth_rate_limit("password_reset")
            assert limit == "3/hour"

    def test_get_auth_rate_limit_mfa_setup(self):
        """Test rate limit for MFA setup endpoint"""
        import unittest.mock as mock

        with mock.patch.object(
            rate_limiter_module, "is_prayer_time", return_value=False
        ):
            limit = get_auth_rate_limit("mfa_setup")
            assert limit == "5/hour"

    def test_get_auth_rate_limit_mfa_verify(self):
        """Test rate limit for MFA verify endpoint"""
        import unittest.mock as mock

        with mock.patch.object(
            rate_limiter_module, "is_prayer_time", return_value=False
        ):
            limit = get_auth_rate_limit("mfa_verify")
            assert limit == "10/15minutes"

    def test_get_auth_rate_limit_unknown_endpoint(self):
        """Test rate limit for unknown endpoint (defaults to 10/hour)"""
        import unittest.mock as mock

        with mock.patch.object(
            rate_limiter_module, "is_prayer_time", return_value=False
        ):
            limit = get_auth_rate_limit("unknown_endpoint")
            assert limit == "10/hour"

    def test_get_auth_rate_limit_login_during_prayer(self):
        """Test that login rate limit doubles during prayer time"""
        import unittest.mock as mock

        with mock.patch.object(
            rate_limiter_module, "is_prayer_time", return_value=True
        ):
            limit = get_auth_rate_limit("login")
            assert limit == "10/15minutes"  # Doubled from 5/15minutes

    def test_get_auth_rate_limit_register_during_prayer(self):
        """Test that register rate limit doubles during prayer time"""
        import unittest.mock as mock

        with mock.patch.object(
            rate_limiter_module, "is_prayer_time", return_value=True
        ):
            limit = get_auth_rate_limit("register")
            assert limit == "10/15minutes"  # Doubled from 5/15minutes


class TestPrayerTimeConfiguration:
    """Test prayer time configuration"""

    def test_prayer_times_defined(self):
        """Test that all five prayer times are defined"""
        assert "fajr" in PRAYER_TIMES
        assert "dhuhr" in PRAYER_TIMES
        assert "asr" in PRAYER_TIMES
        assert "maghrib" in PRAYER_TIMES
        assert "isha" in PRAYER_TIMES

    def test_prayer_times_have_start_and_end(self):
        """Test that each prayer time has start and end times"""
        for prayer_name, (start, end) in PRAYER_TIMES.items():
            assert isinstance(start, time), (
                f"{prayer_name} start time should be time object"
            )
            assert isinstance(end, time), (
                f"{prayer_name} end time should be time object"
            )
            assert start < end, f"{prayer_name} start time should be before end time"

    def test_prayer_times_order(self):
        """Test that prayer times are in chronological order"""
        prayer_order = ["fajr", "dhuhr", "asr", "maghrib", "isha"]
        times = [PRAYER_TIMES[name][0] for name in prayer_order]

        for i in range(len(times) - 1):
            assert times[i] < times[i + 1], (
                f"{prayer_order[i]} should be before {prayer_order[i + 1]}"
            )

    def test_prayer_times_reasonable_durations(self):
        """Test that prayer times have reasonable durations (15-60 minutes)"""
        for prayer_name, (start, end) in PRAYER_TIMES.items():
            # Calculate duration in minutes
            start_minutes = start.hour * 60 + start.minute
            end_minutes = end.hour * 60 + end.minute
            duration = end_minutes - start_minutes

            assert 15 <= duration <= 60, (
                f"{prayer_name} duration should be 15-60 minutes, got {duration}"
            )


class TestRateLimiterIntegration:
    """Integration tests for rate limiter"""

    def test_limiter_instance_exists(self):
        """Test that limiter instance is created"""
        limiter = rate_limiter_module.limiter
        assert limiter is not None
        assert hasattr(limiter, "limit")

    def test_limiter_default_limits(self):
        """Test that default limits are configured"""
        limiter = rate_limiter_module.limiter
        # SlowAPI limiter should have default_limits attribute
        assert hasattr(limiter, "_default_limits")

    def test_limiter_headers_enabled(self):
        """Test that rate limit headers are enabled"""
        limiter = rate_limiter_module.limiter
        # SlowAPI limiter should have headers_enabled attribute
        assert hasattr(limiter, "_headers_enabled")


class TestCulturalRateLimitingBehavior:
    """Test cultural rate limiting behavior"""

    def test_prayer_time_flexibility_standard_case(self):
        """Test that rate limits are more lenient during prayer times"""
        # Outside prayer time: 5 requests per 15 minutes
        import unittest.mock as mock

        with mock.patch.object(
            rate_limiter_module, "is_prayer_time", return_value=False
        ):
            normal_limit = get_auth_rate_limit("login")
            assert normal_limit == "5/15minutes"

        # During prayer time: 10 requests per 15 minutes (doubled)
        with mock.patch.object(
            rate_limiter_module, "is_prayer_time", return_value=True
        ):
            prayer_limit = get_auth_rate_limit("login")
            assert prayer_limit == "10/15minutes"

    def test_prayer_time_flexibility_all_auth_endpoints(self):
        """Test that all auth endpoints get prayer time flexibility"""
        endpoints = ["login", "register", "password_reset", "mfa_setup", "mfa_verify"]

        import unittest.mock as mock

        for endpoint in endpoints:
            # Get normal limit
            with mock.patch.object(
                rate_limiter_module, "is_prayer_time", return_value=False
            ):
                normal_limit = get_auth_rate_limit(endpoint)
                normal_count = int(normal_limit.split("/")[0])

            # Get prayer time limit
            with mock.patch.object(
                rate_limiter_module, "is_prayer_time", return_value=True
            ):
                prayer_limit = get_auth_rate_limit(endpoint)
                prayer_count = int(prayer_limit.split("/")[0])

            # Prayer limit should be double the normal limit
            assert prayer_count == normal_count * 2, (
                f"{endpoint}: Prayer limit {prayer_count} should be double normal limit {normal_count}"
            )
