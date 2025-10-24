"""
Unit tests for device fingerprinting service
Tests device fingerprint generation, parsing, and detection
"""

import sys
import os
import pytest

# Add parent directory to path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

# Import directly from the module file
import importlib.util

spec = importlib.util.spec_from_file_location(
    "device_fingerprinting",
    os.path.join(os.path.dirname(__file__), "../../services/device_fingerprinting.py"),
)
device_fingerprinting = importlib.util.module_from_spec(spec)
spec.loader.exec_module(device_fingerprinting)

DeviceFingerprintManager = device_fingerprinting.DeviceFingerprintManager
DeviceInfo = device_fingerprinting.DeviceInfo
DeviceFingerprintResult = device_fingerprinting.DeviceFingerprintResult
DeviceChangeDetection = device_fingerprinting.DeviceChangeDetection


class TestDeviceIDGeneration:
    """Test device ID generation"""

    def test_generate_device_id_consistent(self):
        """Test device ID is consistent for same inputs"""
        device_id1 = DeviceFingerprintManager.generate_device_id(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/119.0.0.0",
            ip_address="192.168.1.1",
            accept_language="en-US",
            accept_encoding="gzip",
        )

        device_id2 = DeviceFingerprintManager.generate_device_id(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/119.0.0.0",
            ip_address="192.168.1.1",
            accept_language="en-US",
            accept_encoding="gzip",
        )

        assert device_id1 == device_id2
        assert len(device_id1) == 64  # SHA-256 hex digest

    def test_generate_device_id_different_for_different_inputs(self):
        """Test device ID changes with different inputs"""
        device_id1 = DeviceFingerprintManager.generate_device_id(
            user_agent="Mozilla/5.0 Chrome/119.0.0.0",
            ip_address="192.168.1.1",
        )

        device_id2 = DeviceFingerprintManager.generate_device_id(
            user_agent="Mozilla/5.0 Firefox/120.0",  # Different user agent
            ip_address="192.168.1.1",
        )

        assert device_id1 != device_id2


class TestUserAgentParsing:
    """Test user agent string parsing"""

    def test_parse_chrome_windows(self):
        """Test parsing Chrome on Windows"""
        ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
        result = DeviceFingerprintManager.parse_user_agent(ua)

        assert result["device_type"] == "desktop"
        assert result["platform"] == "windows"
        assert result["browser"] == "chrome"
        assert result["os"] == "windows"
        assert "119" in result["browser_version"]

    def test_parse_safari_macos(self):
        """Test parsing Safari on macOS"""
        ua = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15"
        result = DeviceFingerprintManager.parse_user_agent(ua)

        assert result["device_type"] == "desktop"
        assert result["platform"] == "macos"
        assert result["browser"] == "safari"
        assert result["os"] == "macos"

    def test_parse_mobile_android(self):
        """Test parsing Chrome on Android mobile"""
        ua = "Mozilla/5.0 (Linux; Android 13; SM-G998B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36"
        result = DeviceFingerprintManager.parse_user_agent(ua)

        assert result["device_type"] == "mobile"
        assert result["platform"] == "android"
        assert result["browser"] == "chrome"
        assert result["os"] == "android"

    def test_parse_iphone_safari(self):
        """Test parsing Safari on iPhone"""
        ua = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
        result = DeviceFingerprintManager.parse_user_agent(ua)

        assert result["device_type"] == "mobile"
        assert result["platform"] == "ios"
        assert result["browser"] == "safari"
        assert result["os"] == "ios"


class TestDeviceFingerprintCreation:
    """Test complete device fingerprint creation"""

    def test_create_fingerprint_new_device(self):
        """Test creating fingerprint for new device"""
        result = DeviceFingerprintManager.create_device_fingerprint(
            user_agent="Mozilla/5.0 Chrome/119.0.0.0",
            ip_address="192.168.1.1",
            known_device_ids=[],
        )

        assert isinstance(result, DeviceFingerprintResult)
        assert result.is_new_device is True
        assert result.device_id
        assert result.device_info

    def test_create_fingerprint_known_device(self):
        """Test creating fingerprint for known device"""
        device_id = DeviceFingerprintManager.generate_device_id(
            user_agent="Mozilla/5.0 Chrome/119.0.0.0",
            ip_address="192.168.1.1",
        )

        result = DeviceFingerprintManager.create_device_fingerprint(
            user_agent="Mozilla/5.0 Chrome/119.0.0.0",
            ip_address="192.168.1.1",
            known_device_ids=[device_id],
        )

        assert result.is_new_device is False


class TestSuspiciousDetection:
    """Test suspicious indicator detection"""

    def test_detect_bot_user_agent(self):
        """Test bot detection in user agent"""
        result = DeviceFingerprintManager.create_device_fingerprint(
            user_agent="Googlebot/2.1",
            ip_address="192.168.1.1",
        )

        assert len(result.suspicious_indicators) > 0
        assert any("bot" in i.lower() for i in result.suspicious_indicators)

    def test_detect_missing_user_agent(self):
        """Test detection of missing user agent"""
        result = DeviceFingerprintManager.create_device_fingerprint(
            user_agent="",
            ip_address="192.168.1.1",
        )

        assert len(result.suspicious_indicators) > 0


class TestDeviceChangeDetection:
    """Test device change detection"""

    def test_no_device_change(self):
        """Test no change detected for same device"""
        device_id = "abc123"
        result = DeviceFingerprintManager.detect_device_change(
            previous_device_id=device_id,
            current_device_id=device_id,
        )

        assert result.device_changed is False
        assert result.change_type == "none"

    def test_detect_device_switch(self):
        """Test device switch detection"""
        result = DeviceFingerprintManager.detect_device_change(
            previous_device_id="abc123",
            current_device_id="xyz789",
        )

        assert result.device_changed is True
        assert result.requires_reverification is True

    def test_detect_ip_only_change(self):
        """Test IP-only change (low severity)"""
        prev_info = DeviceInfo(
            user_agent="Mozilla/5.0 Chrome/119",
            ip_address="192.168.1.1",
            browser="chrome",
            os="windows",
            platform="windows",
        )

        curr_info = DeviceInfo(
            user_agent="Mozilla/5.0 Chrome/119",
            ip_address="192.168.1.2",  # Different IP
            browser="chrome",
            os="windows",
            platform="windows",
        )

        result = DeviceFingerprintManager.detect_device_change(
            previous_device_id="abc",
            current_device_id="xyz",
            previous_device_info=prev_info,
            current_device_info=curr_info,
        )

        assert result.change_type == "ip_only"
        assert result.severity == "low"
        assert result.requires_reverification is False


class TestMFATrigger:
    """Test MFA triggering based on device fingerprint"""

    def test_trigger_mfa_for_new_device(self):
        """Test MFA triggered for new device"""
        result = DeviceFingerprintManager.create_device_fingerprint(
            user_agent="Mozilla/5.0 Chrome/119",
            known_device_ids=[],
        )

        should_trigger, reason = DeviceFingerprintManager.should_trigger_mfa(
            fingerprint_result=result,
            mfa_on_new_device=True,
        )

        assert should_trigger is True
        assert "new device" in reason.lower()

    def test_no_mfa_for_known_device(self):
        """Test no MFA for known device"""
        device_id = DeviceFingerprintManager.generate_device_id(
            user_agent="Mozilla/5.0 Chrome/119",
        )

        result = DeviceFingerprintManager.create_device_fingerprint(
            user_agent="Mozilla/5.0 Chrome/119",
            known_device_ids=[device_id],
        )

        should_trigger, reason = DeviceFingerprintManager.should_trigger_mfa(
            fingerprint_result=result,
            mfa_on_new_device=True,
        )

        assert should_trigger is False


class TestDeviceSummary:
    """Test device summary generation"""

    def test_generate_device_summary(self):
        """Test human-readable device summary"""
        device_info = DeviceInfo(
            user_agent="test",
            browser="chrome",
            browser_version="119.0",
            os="windows",
            os_version="10.0",
            device_type="desktop",
            platform="windows",
        )

        summary = DeviceFingerprintManager.get_device_summary(device_info)

        assert "Chrome" in summary
        assert "Windows" in summary
