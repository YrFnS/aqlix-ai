"""
IP-based Suspicious Activity Detection
Monitors IP addresses for suspicious patterns and behaviors
"""

from datetime import datetime, timedelta
from typing import Optional, Dict, List
from pydantic import BaseModel
from enum import Enum
import re


class ThreatLevel(str, Enum):
    """Threat level classification"""

    LOW = "low"  # Normal activity
    MEDIUM = "medium"  # Suspicious activity
    HIGH = "high"  # Likely attack
    CRITICAL = "critical"  # Confirmed attack


class ActivityPattern(str, Enum):
    """Types of suspicious activity patterns"""

    RAPID_ATTEMPTS = "rapid_attempts"  # Too many attempts in short time
    MULTIPLE_ACCOUNTS = "multiple_accounts"  # Multiple account access
    GEOGRAPHIC_IMPOSSIBLE = "geographic_impossible"  # Location hopping
    KNOWN_ATTACKER = "known_attacker"  # Known malicious IP
    UNUSUAL_HOURS = "unusual_hours"  # Access at unusual times
    TOR_EXIT_NODE = "tor_exit_node"  # Tor exit node detected
    VPN_DETECTED = "vpn_detected"  # VPN/proxy detected
    BOT_BEHAVIOR = "bot_behavior"  # Automated bot behavior


class IPGeolocation(BaseModel):
    """IP geolocation data"""

    ip_address: str
    country: str
    city: Optional[str] = None
    latitude: float
    longitude: float
    timezone: str
    isp: Optional[str] = None


class SuspiciousActivity(BaseModel):
    """Suspicious activity report"""

    ip_address: str
    threat_level: ThreatLevel
    patterns: List[ActivityPattern]
    confidence_score: float  # 0.0 to 1.0
    details: str
    recommended_action: str
    should_block: bool


class LoginAttempt(BaseModel):
    """Login attempt record"""

    ip_address: str
    timestamp: datetime
    user_id: Optional[str] = None
    email: Optional[str] = None
    success: bool
    country: Optional[str] = None


class IPActivityMonitor:
    """
    IP-based Suspicious Activity Detection

    Monitors IP addresses for suspicious patterns including:
    - Rapid login attempts (brute force detection)
    - Multiple account access from single IP
    - Geographic impossibility detection
    - Known attacker IP lists
    - Unusual access hours
    - Tor/VPN/Proxy detection
    - Bot behavior patterns
    """

    # Thresholds
    RAPID_ATTEMPTS_THRESHOLD = 5  # attempts per minute
    RAPID_ATTEMPTS_WINDOW = 60  # seconds
    MULTIPLE_ACCOUNTS_THRESHOLD = 3  # different accounts per hour
    MULTIPLE_ACCOUNTS_WINDOW = 3600  # seconds
    GEOGRAPHIC_IMPOSSIBLE_DISTANCE = 500  # km
    GEOGRAPHIC_IMPOSSIBLE_TIME = 3600  # seconds (1 hour)

    # Known malicious IP patterns (simplified examples)
    KNOWN_ATTACKER_PATTERNS = [
        r"^185\.220\.",  # Known Tor exit node range
        r"^45\.142\.",  # Known VPN provider range
    ]

    # Iraqi business hours (8 AM - 6 PM Baghdad time)
    IRAQI_BUSINESS_HOURS_START = 8  # 8 AM
    IRAQI_BUSINESS_HOURS_END = 18  # 6 PM

    @staticmethod
    def analyze_ip_activity(
        ip_address: str,
        recent_attempts: List[LoginAttempt],
        current_location: Optional[IPGeolocation] = None,
        user_id: Optional[str] = None,
    ) -> SuspiciousActivity:
        """
        Analyze IP address for suspicious activity

        Args:
            ip_address: IP address to analyze
            recent_attempts: Recent login attempts from this IP
            current_location: Current geolocation data for IP
            user_id: Optional user ID for account-specific analysis

        Returns:
            SuspiciousActivity report with threat level and recommendations
        """
        patterns: List[ActivityPattern] = []
        confidence_score = 0.0
        details_list = []

        # Check for rapid attempts (brute force)
        rapid_check = IPActivityMonitor._check_rapid_attempts(recent_attempts)
        if rapid_check["is_suspicious"]:
            patterns.append(ActivityPattern.RAPID_ATTEMPTS)
            confidence_score += 0.3
            details_list.append(rapid_check["details"])

        # Check for multiple account access
        multi_account_check = IPActivityMonitor._check_multiple_accounts(
            recent_attempts
        )
        if multi_account_check["is_suspicious"]:
            patterns.append(ActivityPattern.MULTIPLE_ACCOUNTS)
            confidence_score += 0.25
            details_list.append(multi_account_check["details"])

        # Check for geographic impossibility
        if current_location:
            geo_check = IPActivityMonitor._check_geographic_impossibility(
                recent_attempts, current_location
            )
            if geo_check["is_suspicious"]:
                patterns.append(ActivityPattern.GEOGRAPHIC_IMPOSSIBLE)
                confidence_score += 0.4
                details_list.append(geo_check["details"])

        # Check against known attacker IPs
        attacker_check = IPActivityMonitor._check_known_attacker(ip_address)
        if attacker_check["is_suspicious"]:
            patterns.append(ActivityPattern.KNOWN_ATTACKER)
            confidence_score += 0.5
            details_list.append(attacker_check["details"])

        # Check for unusual access hours (Iraqi context)
        unusual_hours_check = IPActivityMonitor._check_unusual_hours(recent_attempts)
        if unusual_hours_check["is_suspicious"]:
            patterns.append(ActivityPattern.UNUSUAL_HOURS)
            confidence_score += 0.15
            details_list.append(unusual_hours_check["details"])

        # Check for Tor exit nodes
        tor_check = IPActivityMonitor._check_tor_exit_node(ip_address)
        if tor_check["is_suspicious"]:
            patterns.append(ActivityPattern.TOR_EXIT_NODE)
            confidence_score += 0.35
            details_list.append(tor_check["details"])

        # Check for bot behavior
        bot_check = IPActivityMonitor._check_bot_behavior(recent_attempts)
        if bot_check["is_suspicious"]:
            patterns.append(ActivityPattern.BOT_BEHAVIOR)
            confidence_score += 0.3
            details_list.append(bot_check["details"])

        # Normalize confidence score (cap at 1.0)
        confidence_score = min(confidence_score, 1.0)

        # Determine threat level
        threat_level = IPActivityMonitor._calculate_threat_level(confidence_score)

        # Determine recommended action
        recommended_action = IPActivityMonitor._get_recommended_action(
            threat_level, patterns
        )

        # Determine if IP should be blocked
        should_block = threat_level in [ThreatLevel.HIGH, ThreatLevel.CRITICAL]

        details = (
            " | ".join(details_list)
            if details_list
            else "No suspicious activity detected"
        )

        return SuspiciousActivity(
            ip_address=ip_address,
            threat_level=threat_level,
            patterns=patterns,
            confidence_score=confidence_score,
            details=details,
            recommended_action=recommended_action,
            should_block=should_block,
        )

    @staticmethod
    def _check_rapid_attempts(attempts: List[LoginAttempt]) -> Dict:
        """Check for rapid login attempts (brute force)"""
        if len(attempts) < IPActivityMonitor.RAPID_ATTEMPTS_THRESHOLD:
            return {"is_suspicious": False, "details": ""}

        # Get attempts in last minute
        now = datetime.now()
        recent = [
            a
            for a in attempts
            if (now - a.timestamp).total_seconds()
            <= IPActivityMonitor.RAPID_ATTEMPTS_WINDOW
        ]

        if len(recent) >= IPActivityMonitor.RAPID_ATTEMPTS_THRESHOLD:
            failed_count = sum(1 for a in recent if not a.success)
            return {
                "is_suspicious": True,
                "details": f"Rapid attempts: {len(recent)} login attempts in last minute ({failed_count} failed)",
            }

        return {"is_suspicious": False, "details": ""}

    @staticmethod
    def _check_multiple_accounts(attempts: List[LoginAttempt]) -> Dict:
        """Check for access to multiple accounts from same IP"""
        if len(attempts) < IPActivityMonitor.MULTIPLE_ACCOUNTS_THRESHOLD:
            return {"is_suspicious": False, "details": ""}

        # Get unique user IDs/emails in last hour
        now = datetime.now()
        recent = [
            a
            for a in attempts
            if (now - a.timestamp).total_seconds()
            <= IPActivityMonitor.MULTIPLE_ACCOUNTS_WINDOW
        ]

        unique_accounts = set()
        for attempt in recent:
            if attempt.user_id:
                unique_accounts.add(attempt.user_id)
            elif attempt.email:
                unique_accounts.add(attempt.email)

        if len(unique_accounts) >= IPActivityMonitor.MULTIPLE_ACCOUNTS_THRESHOLD:
            return {
                "is_suspicious": True,
                "details": f"Multiple accounts: {len(unique_accounts)} different accounts accessed in last hour",
            }

        return {"is_suspicious": False, "details": ""}

    @staticmethod
    def _check_geographic_impossibility(
        attempts: List[LoginAttempt], current_location: IPGeolocation
    ) -> Dict:
        """Check for geographic impossibility (location hopping)"""
        if len(attempts) < 2:
            return {"is_suspicious": False, "details": ""}

        # Get most recent attempt with location data
        for attempt in reversed(attempts):
            if attempt.country and attempt.country != current_location.country:
                time_diff = (datetime.now() - attempt.timestamp).total_seconds()

                # Check if time difference is less than threshold
                if time_diff < IPActivityMonitor.GEOGRAPHIC_IMPOSSIBLE_TIME:
                    return {
                        "is_suspicious": True,
                        "details": f"Geographic impossibility: Location changed from {attempt.country} to {current_location.country} in {int(time_diff / 60)} minutes",
                    }
                break

        return {"is_suspicious": False, "details": ""}

    @staticmethod
    def _check_known_attacker(ip_address: str) -> Dict:
        """Check if IP matches known attacker patterns"""
        for pattern in IPActivityMonitor.KNOWN_ATTACKER_PATTERNS:
            if re.match(pattern, ip_address):
                return {
                    "is_suspicious": True,
                    "details": f"Known attacker: IP matches known malicious pattern",
                }

        return {"is_suspicious": False, "details": ""}

    @staticmethod
    def _check_unusual_hours(attempts: List[LoginAttempt]) -> Dict:
        """Check for unusual access hours (Iraqi business hours context)"""
        if not attempts:
            return {"is_suspicious": False, "details": ""}

        # Count attempts outside business hours
        unusual_count = 0
        for attempt in attempts:
            hour = attempt.timestamp.hour
            if (
                hour < IPActivityMonitor.IRAQI_BUSINESS_HOURS_START
                or hour > IPActivityMonitor.IRAQI_BUSINESS_HOURS_END
            ):
                unusual_count += 1

        # If more than 70% of attempts are outside business hours
        if len(attempts) > 0 and unusual_count / len(attempts) > 0.7:
            return {
                "is_suspicious": True,
                "details": f"Unusual hours: {unusual_count}/{len(attempts)} attempts outside Iraqi business hours (8 AM - 6 PM Baghdad time)",
            }

        return {"is_suspicious": False, "details": ""}

    @staticmethod
    def _check_tor_exit_node(ip_address: str) -> Dict:
        """Check if IP is a Tor exit node (simplified check)"""
        # In production, use a Tor exit node database/API
        # For now, check against known Tor ranges
        tor_patterns = [
            r"^185\.220\.",  # Tor exit node range
            r"^185\.100\.",  # Tor exit node range
            r"^23\.129\.",  # Tor exit node range
        ]

        for pattern in tor_patterns:
            if re.match(pattern, ip_address):
                return {
                    "is_suspicious": True,
                    "details": "Tor exit node: IP matches known Tor exit node range",
                }

        return {"is_suspicious": False, "details": ""}

    @staticmethod
    def _check_bot_behavior(attempts: List[LoginAttempt]) -> Dict:
        """Check for bot-like behavior patterns"""
        if len(attempts) < 3:
            return {"is_suspicious": False, "details": ""}

        # Check for perfectly regular intervals (bot pattern)
        if len(attempts) >= 3:
            intervals = []
            for i in range(len(attempts) - 1):
                interval = (
                    attempts[i + 1].timestamp - attempts[i].timestamp
                ).total_seconds()
                intervals.append(interval)

            # If intervals are too regular (within 5% variance), likely a bot
            if intervals:
                avg_interval = sum(intervals) / len(intervals)
                variance = sum((i - avg_interval) ** 2 for i in intervals) / len(
                    intervals
                )
                coefficient_of_variation = (
                    (variance**0.5) / avg_interval if avg_interval > 0 else 1
                )

                # Less than 5% variance = likely automated
                if coefficient_of_variation < 0.05:
                    return {
                        "is_suspicious": True,
                        "details": f"Bot behavior: Login attempts show automated pattern (regularity coefficient: {coefficient_of_variation:.3f})",
                    }

        return {"is_suspicious": False, "details": ""}

    @staticmethod
    def _calculate_threat_level(confidence_score: float) -> ThreatLevel:
        """Calculate threat level from confidence score"""
        if confidence_score >= 0.8:
            return ThreatLevel.CRITICAL
        elif confidence_score >= 0.6:
            return ThreatLevel.HIGH
        elif confidence_score >= 0.3:
            return ThreatLevel.MEDIUM
        else:
            return ThreatLevel.LOW

    @staticmethod
    def _get_recommended_action(
        threat_level: ThreatLevel, patterns: List[ActivityPattern]
    ) -> str:
        """Get recommended action based on threat level and patterns"""
        if threat_level == ThreatLevel.CRITICAL:
            return "IMMEDIATE ACTION: Block IP address, trigger security alert, notify security team"

        if threat_level == ThreatLevel.HIGH:
            if ActivityPattern.RAPID_ATTEMPTS in patterns:
                return "Block IP temporarily (1 hour), require CAPTCHA on next attempt"
            if ActivityPattern.KNOWN_ATTACKER in patterns:
                return "Block IP permanently, add to blacklist"
            return "Block IP temporarily (30 minutes), require additional verification"

        if threat_level == ThreatLevel.MEDIUM:
            if ActivityPattern.MULTIPLE_ACCOUNTS in patterns:
                return "Require CAPTCHA, enable enhanced monitoring"
            if ActivityPattern.TOR_EXIT_NODE in patterns:
                return "Require additional verification (MFA), monitor closely"
            return "Require CAPTCHA, log for analysis"

        # LOW threat
        return "Continue monitoring, no immediate action required"

    @staticmethod
    def should_trigger_additional_security(
        activity: SuspiciousActivity,
    ) -> Dict[str, bool]:
        """
        Determine which additional security measures should be triggered

        Returns:
            Dict with security measure flags
        """
        return {
            "require_captcha": activity.threat_level
            in [ThreatLevel.MEDIUM, ThreatLevel.HIGH],
            "require_mfa": activity.threat_level
            in [ThreatLevel.HIGH, ThreatLevel.CRITICAL],
            "block_ip": activity.should_block,
            "notify_security_team": activity.threat_level == ThreatLevel.CRITICAL,
            "enable_enhanced_monitoring": activity.threat_level
            in [ThreatLevel.MEDIUM, ThreatLevel.HIGH, ThreatLevel.CRITICAL],
        }
