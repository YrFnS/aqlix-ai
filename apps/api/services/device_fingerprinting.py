"""
Device Fingerprinting Service
Generates and validates device fingerprints for security and multi-device session management
"""

import hashlib
import re
from typing import Optional, Dict, Tuple
from pydantic import BaseModel
from datetime import datetime


class DeviceInfo(BaseModel):
    """Device information extracted from request"""

    user_agent: str
    ip_address: Optional[str] = None
    accept_language: Optional[str] = None
    accept_encoding: Optional[str] = None
    device_type: Optional[str] = None  # mobile, desktop, tablet
    platform: Optional[str] = None  # ios, android, web, windows, macos, linux
    browser: Optional[str] = None
    browser_version: Optional[str] = None
    os: Optional[str] = None
    os_version: Optional[str] = None


class DeviceFingerprintResult(BaseModel):
    """Result of device fingerprinting"""

    device_id: str
    device_info: DeviceInfo
    is_new_device: bool
    fingerprint_strength: str  # weak, medium, strong
    suspicious_indicators: list[str] = []


class DeviceChangeDetection(BaseModel):
    """Result of device change detection"""

    device_changed: bool
    change_type: str  # none, ip_only, browser_upgrade, device_switch, suspicious
    severity: str  # low, medium, high
    details: str
    requires_reverification: bool


class DeviceFingerprintManager:
    """
    Device Fingerprinting Manager

    Manages device fingerprinting for security purposes:
    - Generate device fingerprints from request headers
    - Parse user agent for device/browser/OS info
    - Detect new devices and suspicious changes
    - Track device history across sessions
    - Trigger MFA on new or suspicious devices
    """

    @staticmethod
    def generate_device_id(
        user_agent: str,
        ip_address: Optional[str] = None,
        accept_language: Optional[str] = None,
        accept_encoding: Optional[str] = None,
    ) -> str:
        """
        Generate stable device ID from request headers

        Uses SHA-256 hash of:
        - User agent (most stable identifier)
        - IP address (changes with network, optional)
        - Accept-Language header
        - Accept-Encoding header

        Args:
            user_agent: User-Agent header
            ip_address: Client IP address (optional, less stable)
            accept_language: Accept-Language header
            accept_encoding: Accept-Encoding header

        Returns:
            Hashed device ID (64-character hex string)
        """
        # Normalize inputs
        user_agent = user_agent.strip().lower() if user_agent else "unknown"
        ip_address = ip_address.strip() if ip_address else ""
        accept_language = accept_language.strip().lower() if accept_language else ""
        accept_encoding = accept_encoding.strip().lower() if accept_encoding else ""

        # Build fingerprint string
        fingerprint_data = (
            f"{user_agent}|{ip_address}|{accept_language}|{accept_encoding}"
        )

        # Hash using SHA-256
        device_id = hashlib.sha256(fingerprint_data.encode()).hexdigest()

        return device_id

    @staticmethod
    def parse_user_agent(user_agent: str) -> Dict[str, Optional[str]]:
        """
        Parse user agent string to extract device/browser/OS info

        Args:
            user_agent: User-Agent header string

        Returns:
            Dictionary with device_type, platform, browser, os, versions
        """
        if not user_agent:
            return {
                "device_type": "unknown",
                "platform": "unknown",
                "browser": "unknown",
                "browser_version": None,
                "os": "unknown",
                "os_version": None,
            }

        ua = user_agent.lower()

        # Device Type Detection
        device_type = "desktop"  # Default
        if "mobile" in ua or "android" in ua or "iphone" in ua:
            device_type = "mobile"
        elif "tablet" in ua or "ipad" in ua:
            device_type = "tablet"

        # Platform Detection
        platform = "web"  # Default
        if "android" in ua:
            platform = "android"
        elif "iphone" in ua or "ipad" in ua or "ipod" in ua:
            platform = "ios"
        elif "windows" in ua:
            platform = "windows"
        elif "mac" in ua and "iphone" not in ua and "ipad" not in ua:
            platform = "macos"
        elif "linux" in ua:
            platform = "linux"

        # Browser Detection
        browser = "unknown"
        browser_version = None

        # Check for specific browsers (order matters - most specific first)
        if "edg/" in ua:  # Edge (Chromium-based)
            browser = "edge"
            match = re.search(r"edg/(\d+\.\d+)", ua)
            if match:
                browser_version = match.group(1)
        elif "chrome" in ua and "safari" in ua:
            browser = "chrome"
            match = re.search(r"chrome/(\d+\.\d+)", ua)
            if match:
                browser_version = match.group(1)
        elif "firefox" in ua:
            browser = "firefox"
            match = re.search(r"firefox/(\d+\.\d+)", ua)
            if match:
                browser_version = match.group(1)
        elif "safari" in ua and "chrome" not in ua:
            browser = "safari"
            match = re.search(r"version/(\d+\.\d+)", ua)
            if match:
                browser_version = match.group(1)
        elif "opera" in ua or "opr/" in ua:
            browser = "opera"
            match = re.search(r"(?:opera|opr)/(\d+\.\d+)", ua)
            if match:
                browser_version = match.group(1)

        # OS Detection
        os = "unknown"
        os_version = None

        if "windows nt" in ua:
            os = "windows"
            match = re.search(r"windows nt (\d+\.\d+)", ua)
            if match:
                os_version = match.group(1)
        elif "mac os x" in ua:
            os = "macos"
            match = re.search(r"mac os x (\d+[._]\d+)", ua)
            if match:
                os_version = match.group(1).replace("_", ".")
        elif "android" in ua:
            os = "android"
            match = re.search(r"android (\d+\.\d+)", ua)
            if match:
                os_version = match.group(1)
        elif "iphone os" in ua or "cpu os" in ua:
            os = "ios"
            match = re.search(r"(?:iphone )?os (\d+[._]\d+)", ua)
            if match:
                os_version = match.group(1).replace("_", ".")
        elif "linux" in ua:
            os = "linux"

        return {
            "device_type": device_type,
            "platform": platform,
            "browser": browser,
            "browser_version": browser_version,
            "os": os,
            "os_version": os_version,
        }

    @classmethod
    def create_device_fingerprint(
        cls,
        user_agent: str,
        ip_address: Optional[str] = None,
        accept_language: Optional[str] = None,
        accept_encoding: Optional[str] = None,
        known_device_ids: Optional[list[str]] = None,
    ) -> DeviceFingerprintResult:
        """
        Create comprehensive device fingerprint with detection

        Args:
            user_agent: User-Agent header
            ip_address: Client IP address
            accept_language: Accept-Language header
            accept_encoding: Accept-Encoding header
            known_device_ids: List of known device IDs for this user

        Returns:
            DeviceFingerprintResult with device info and detection
        """
        # Generate device ID
        device_id = cls.generate_device_id(
            user_agent=user_agent,
            ip_address=ip_address,
            accept_language=accept_language,
            accept_encoding=accept_encoding,
        )

        # Parse user agent
        parsed_ua = cls.parse_user_agent(user_agent)

        # Build device info
        device_info = DeviceInfo(
            user_agent=user_agent,
            ip_address=ip_address,
            accept_language=accept_language,
            accept_encoding=accept_encoding,
            device_type=parsed_ua["device_type"],
            platform=parsed_ua["platform"],
            browser=parsed_ua["browser"],
            browser_version=parsed_ua["browser_version"],
            os=parsed_ua["os"],
            os_version=parsed_ua["os_version"],
        )

        # Check if device is new
        is_new_device = True
        if known_device_ids:
            is_new_device = device_id not in known_device_ids

        # Calculate fingerprint strength
        fingerprint_strength = "weak"
        strength_score = 0

        if user_agent and user_agent != "unknown":
            strength_score += 2
        if ip_address:
            strength_score += 1
        if accept_language:
            strength_score += 1
        if accept_encoding:
            strength_score += 1

        if strength_score >= 4:
            fingerprint_strength = "strong"
        elif strength_score >= 2:
            fingerprint_strength = "medium"

        # Detect suspicious indicators
        suspicious_indicators = []

        # Check for missing user agent
        if not user_agent or user_agent.lower() in ["unknown", "", "null"]:
            suspicious_indicators.append("Missing or invalid user agent")

        # Check for common bot patterns
        bot_patterns = [
            "bot",
            "crawler",
            "spider",
            "scraper",
            "curl",
            "wget",
            "python-requests",
        ]
        if any(pattern in user_agent.lower() for pattern in bot_patterns):
            suspicious_indicators.append("Bot-like user agent detected")

        # Check for unusual browser/OS combinations
        if parsed_ua["browser"] == "safari" and parsed_ua["os"] not in [
            "macos",
            "ios",
            "unknown",
        ]:
            suspicious_indicators.append(
                "Unusual browser/OS combination (Safari on non-Apple OS)"
            )

        if parsed_ua["platform"] == "ios" and parsed_ua["browser"] not in [
            "safari",
            "unknown",
        ]:
            suspicious_indicators.append("Unusual iOS browser (Apple requires WebKit)")

        return DeviceFingerprintResult(
            device_id=device_id,
            device_info=device_info,
            is_new_device=is_new_device,
            fingerprint_strength=fingerprint_strength,
            suspicious_indicators=suspicious_indicators,
        )

    @staticmethod
    def detect_device_change(
        previous_device_id: str,
        current_device_id: str,
        previous_device_info: Optional[DeviceInfo] = None,
        current_device_info: Optional[DeviceInfo] = None,
    ) -> DeviceChangeDetection:
        """
        Detect and classify device changes

        Args:
            previous_device_id: Previous device ID
            current_device_id: Current device ID
            previous_device_info: Previous device info (optional)
            current_device_info: Current device info (optional)

        Returns:
            DeviceChangeDetection with change analysis
        """
        # No change
        if previous_device_id == current_device_id:
            return DeviceChangeDetection(
                device_changed=False,
                change_type="none",
                severity="low",
                details="Device ID unchanged",
                requires_reverification=False,
            )

        # Device changed - need to determine severity
        if not previous_device_info or not current_device_info:
            # Can't determine change type without device info
            return DeviceChangeDetection(
                device_changed=True,
                change_type="device_switch",
                severity="medium",
                details="Device ID changed (unable to determine specifics)",
                requires_reverification=True,
            )

        # Analyze specific changes
        change_indicators = []

        # Check IP change
        if previous_device_info.ip_address != current_device_info.ip_address:
            change_indicators.append("IP address changed")

        # Check browser change
        if previous_device_info.browser != current_device_info.browser:
            change_indicators.append("Browser changed")

        # Check OS change
        if previous_device_info.os != current_device_info.os:
            change_indicators.append("Operating system changed")

        # Check platform change
        if previous_device_info.platform != current_device_info.platform:
            change_indicators.append("Platform changed")

        # Check device type change
        if previous_device_info.device_type != current_device_info.device_type:
            change_indicators.append("Device type changed")

        # Classify change type and severity
        change_type = "device_switch"
        severity = "high"
        requires_reverification = True

        # IP-only change (common, less severe)
        if change_indicators == ["IP address changed"]:
            change_type = "ip_only"
            severity = "low"
            requires_reverification = False

        # Browser version upgrade (expected, low severity)
        elif (
            previous_device_info.browser == current_device_info.browser
            and previous_device_info.os == current_device_info.os
            and previous_device_info.browser_version
            != current_device_info.browser_version
        ):
            change_type = "browser_upgrade"
            severity = "low"
            requires_reverification = False

        # Suspicious changes (OS/Platform/Browser all different)
        elif len(change_indicators) >= 3:
            change_type = "suspicious"
            severity = "high"
            requires_reverification = True

        details = (
            ", ".join(change_indicators) if change_indicators else "Device ID changed"
        )

        return DeviceChangeDetection(
            device_changed=True,
            change_type=change_type,
            severity=severity,
            details=details,
            requires_reverification=requires_reverification,
        )

    @staticmethod
    def should_trigger_mfa(
        fingerprint_result: DeviceFingerprintResult,
        mfa_on_new_device: bool = True,
    ) -> Tuple[bool, str]:
        """
        Determine if MFA should be triggered based on device fingerprint

        Args:
            fingerprint_result: Device fingerprint result
            mfa_on_new_device: Whether to require MFA on new devices

        Returns:
            Tuple of (should_trigger_mfa, reason)
        """
        # Trigger MFA if suspicious indicators found
        if fingerprint_result.suspicious_indicators:
            return (
                True,
                f"Suspicious device indicators: {', '.join(fingerprint_result.suspicious_indicators)}",
            )

        # Trigger MFA if new device and policy enabled
        if fingerprint_result.is_new_device and mfa_on_new_device:
            return True, "New device detected"

        # Trigger MFA if fingerprint strength is weak
        if fingerprint_result.fingerprint_strength == "weak":
            return True, "Weak device fingerprint"

        return False, "Trusted device"

    @staticmethod
    def get_device_summary(device_info: DeviceInfo) -> str:
        """
        Generate human-readable device summary

        Args:
            device_info: Device information

        Returns:
            Human-readable device summary
        """
        parts = []

        # Browser info
        if device_info.browser and device_info.browser != "unknown":
            browser_str = device_info.browser.title()
            if device_info.browser_version:
                browser_str += f" {device_info.browser_version}"
            parts.append(browser_str)

        # OS info
        if device_info.os and device_info.os != "unknown":
            os_str = (
                device_info.os.upper()
                if device_info.os in ["ios", "macos"]
                else device_info.os.title()
            )
            if device_info.os_version:
                os_str += f" {device_info.os_version}"
            parts.append(os_str)

        # Device type
        if device_info.device_type and device_info.device_type != "unknown":
            parts.append(device_info.device_type.title())

        # Platform
        if device_info.platform and device_info.platform not in ["unknown", "web"]:
            platform_str = (
                device_info.platform.upper()
                if device_info.platform in ["ios", "macos"]
                else device_info.platform.title()
            )
            if platform_str not in " ".join(parts):  # Avoid duplication
                parts.append(platform_str)

        if not parts:
            return "Unknown Device"

        return " on ".join(parts[:2]) if len(parts) >= 2 else parts[0]
