"""
Suspicious Activity Detection Service

Implements comprehensive suspicious activity detection for authentication:
- IP-based geographic anomaly detection
- Unusual login time detection
- Device fingerprint analysis
- Suspicious activity score calculation

Uses database query patterns to detect anomalies from historical user behavior.
"""

import logging
from datetime import datetime, timedelta
from typing import Optional, Tuple, List
from dataclasses import dataclass


# Configure logger
logger = logging.getLogger(__name__)


@dataclass
class SuspiciousActivityScore:
    """Result of suspicious activity detection"""

    score: float  # 0.0-1.0, where 1.0 is most suspicious
    geographic_anomaly_detected: bool
    unusual_time_detected: bool
    device_change_detected: bool
    recent_failed_attempts_detected: bool
    risk_level: str  # low, medium, high, critical
    reasons: List[str]  # Human-readable reasons for score  # Human-readable reasons for score


class SuspiciousActivityDetector:
    """
    Detects suspicious login activity based on multiple factors

    Scoring system:
    - Geographic anomaly: +0.40 (new country/city from different location)
    - Unusual time: +0.20 (login at unusual hour compared to historical pattern)
    - New device: +0.30 (device not seen before for this user)
    - Multiple failed attempts: +0.10 (recent failed login attempts)

    Risk levels:
    - Low: 0.0-0.25 (normal activity)
    - Medium: 0.26-0.50 (slightly suspicious, monitor)
    - High: 0.51-0.75 (suspicious, trigger MFA)
    - Critical: 0.76-1.0 (highly suspicious, trigger MFA + notifications)
    """

    # Suspicious activity thresholds
    MFA_TRIGGER_THRESHOLD = 0.50  # Trigger MFA at medium-high risk
    CRITICAL_THRESHOLD = 0.75  # Critical risk level

    @classmethod
    def calculate_suspicious_score(
        cls,
        user_id: str,
        ip_address: Optional[str],
        device_id: Optional[str],
        user_agent: Optional[str],
        supabase_client,
    ) -> SuspiciousActivityScore:
        """
        Calculate comprehensive suspicious activity score

        Args:
            user_id: User ID for historical pattern analysis
            ip_address: Client IP address
            device_id: Device fingerprint ID
            user_agent: User agent string
            supabase_client: Supabase client for database queries

        Returns:
            SuspiciousActivityScore with detailed analysis
        """
        score = 0.0
        reasons = []
        geographic_anomaly = False
        unusual_time = False
        device_change = False

        # Factor 1: Geographic anomaly detection (weight: 0.40)
        if ip_address:
            geo_anomaly, geo_reason = cls._detect_geographic_anomaly(
                user_id=user_id,
                current_ip=ip_address,
                supabase_client=supabase_client,
            )

            if geo_anomaly:
                score += 0.40
                geographic_anomaly = True
                reasons.append(geo_reason)

        # Factor 2: Unusual login time detection (weight: 0.20)
        time_anomaly, time_reason = cls._detect_unusual_login_time(
            user_id=user_id, supabase_client=supabase_client
        )

        if time_anomaly:
            score += 0.20
            unusual_time = True
            reasons.append(time_reason)

        # Factor 3: New device detection (weight: 0.30)
        if device_id:
            new_device, device_reason = cls._detect_new_device(
                user_id=user_id,
                current_device_id=device_id,
                supabase_client=supabase_client,
            )

            if new_device:
                score += 0.30
                device_change = True
                reasons.append(device_reason)

        # Factor 4: Recent failed attempts (weight: 0.10)
        failed_attempts, fail_reason = cls._check_recent_failed_attempts(
            user_id=user_id, supabase_client=supabase_client
        )

        if failed_attempts:
            score += 0.10
            reasons.append(fail_reason)

        # Determine risk level
        if score >= cls.CRITICAL_THRESHOLD:
            risk_level = "critical"
        elif score >= cls.MFA_TRIGGER_THRESHOLD:
            risk_level = "high"
        elif score >= 0.26:
            risk_level = "medium"
        else:
            risk_level = "low"

        # Cap score at 1.0
        score = min(score, 1.0)

        return SuspiciousActivityScore(
            score=score,
            geographic_anomaly_detected=geographic_anomaly,
            unusual_time_detected=unusual_time,
            device_change_detected=device_change,
            recent_failed_attempts_detected=failed_attempts,
            risk_level=risk_level,
            reasons=reasons if reasons else ["Normal activity"],
        )

    @classmethod
    def _detect_geographic_anomaly(
        cls, user_id: str, current_ip: str, supabase_client
    ) -> Tuple[bool, str]:
        """
        Detect geographic anomalies based on IP address changes

        Simplified implementation:
        - Check if user has logged in from this IP before
        - Check if IP is from a different country/region

        Returns:
            (is_anomaly, reason_message)
        """
        try:
            # Query recent sessions for this user (last 30 days)
            response = (
                supabase_client.table("iraqi_authentication_sessions")
                .select("ip_address, created_at")
                .eq("user_id", user_id)
                .gte("created_at", (datetime.now() - timedelta(days=30)).isoformat())
                .order("created_at", desc=True)
                .limit(10)
                .execute()
            )

            if not response.data:
                # First login - not suspicious (new user)
                return False, ""

            # Check if current IP has been used before
            previous_ips = [
                session["ip_address"]
                for session in response.data
                if session["ip_address"]
            ]

            if current_ip not in previous_ips:
                # New IP address - potential geographic anomaly
                # In production, would use IP geolocation API to check country/city

                if previous_ips:
                    # Get most recent known IP or list of known IPs for context
                    most_recent_ip = previous_ips[
                        0
                    ]  # Already sorted by created_at desc
                    unique_ips_count = len(set(previous_ips))

                    if unique_ips_count == 1:
                        # User has only used one IP before
                        return (
                            True,
                            f"Login from new IP address (previous IP: {most_recent_ip[:10]}...)",
                        )
                    else:
                        # User has multiple known IPs
                        return (
                            True,
                            f"Login from new IP address (most recent IP: {most_recent_ip[:10]}..., {unique_ips_count} known IPs)",
                        )

            return False, ""

        except Exception as e:
            logger.warning(f"Geographic anomaly detection failed: {e}")
            # Don't fail the login on detection error
            return False, ""

    @classmethod
    def _detect_unusual_login_time(
        cls, user_id: str, supabase_client
    ) -> Tuple[bool, str]:
        """
        Detect unusual login times compared to user's historical pattern

        Checks if current login time falls outside user's typical login hours

        Returns:
            (is_unusual, reason_message)
        """
        try:
            # Get current hour (0-23)
            current_hour = datetime.now().hour

            # Query recent login times (last 30 days)
            response = (
                supabase_client.table("iraqi_authentication_sessions")
                .select("created_at")
                .eq("user_id", user_id)
                .gte("created_at", (datetime.now() - timedelta(days=30)).isoformat())
                .execute()
            )

            if not response.data or len(response.data) < 3:
                # Not enough historical data
                return False, ""

            # Extract hours from historical logins
            historical_hours = []
            for session in response.data:
                try:
                    # Parse ISO timestamp
                    session_time = datetime.fromisoformat(
                        session["created_at"].replace("Z", "+00:00")
                    )
                    historical_hours.append(session_time.hour)
                except Exception:
                    continue

            if not historical_hours:
                return False, ""

            # Calculate typical login hour range (mean +/- 3 hours)
            avg_hour = sum(historical_hours) / len(historical_hours)
            min_hour = max(0, int(avg_hour - 3))
            max_hour = min(23, int(avg_hour + 3))

            # Check if current hour is outside typical range
            if current_hour < min_hour or current_hour > max_hour:
                return (
                    True,
                    f"Login at unusual hour ({current_hour}:00, typical: {int(avg_hour)}:00)",
                )

            return False, ""

        except Exception as e:
            logger.warning(f"Unusual time detection failed: {e}")
            return False, ""

    @classmethod
    def _detect_new_device(
        cls, user_id: str, current_device_id: str, supabase_client
    ) -> Tuple[bool, str]:
        """
        Detect if user is logging in from a new device

        Returns:
            (is_new_device, reason_message)
        """
        try:
            # Query recent sessions for device history
            response = (
                supabase_client.table("iraqi_authentication_sessions")
                .select("device_id")
                .eq("user_id", user_id)
                .not_.is_("device_id", "null")
                .execute()
            )

            if not response.data:
                # First login - not suspicious (new user)
                return False, ""

            # Check if current device has been used before
            previous_devices = [
                session["device_id"]
                for session in response.data
                if session.get("device_id")
            ]

            if current_device_id not in previous_devices:
                return (
                    True,
                    f"Login from new device (device count: {len(set(previous_devices)) + 1})",
                )

            return False, ""

        except Exception as e:
            logger.warning(f"New device detection failed: {e}")
            return False, ""

    @classmethod
    def _check_recent_failed_attempts(
        cls, user_id: str, supabase_client
    ) -> Tuple[bool, str]:
        """
        Check for recent failed login attempts

        Returns:
            (has_failed_attempts, reason_message)
        """
        try:
            # Query user authentication profile for failed attempts
            response = (
                supabase_client.table("iraqi_user_authentication")
                .select("login_attempts")
                .eq("id", user_id)
                .single()
                .execute()
            )

            if response.data:
                login_attempts = response.data.get("login_attempts", 0)

                if login_attempts > 0:
                    return True, f"Recent failed login attempts ({login_attempts})"

            return False, ""

        except Exception as e:
            logger.warning(f"Failed attempts check failed: {e}")
            return False, ""
