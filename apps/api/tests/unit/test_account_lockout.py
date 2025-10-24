"""
Unit tests for account lockout functionality
Tests failed login tracking, lockout mechanism, and auto-unlock
"""

import sys
import os
from datetime import datetime, timedelta
import pytest

# Add parent directory to path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

# Import account lockout module
import importlib.util

spec = importlib.util.spec_from_file_location(
    "account_lockout",
    os.path.join(os.path.dirname(__file__), "../../services/account_lockout.py"),
)
account_lockout_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(account_lockout_module)

AccountLockoutManager = account_lockout_module.AccountLockoutManager
LockoutStatus = account_lockout_module.LockoutStatus
MAX_FAILED_ATTEMPTS = account_lockout_module.MAX_FAILED_ATTEMPTS
LOCKOUT_DURATION_MINUTES = account_lockout_module.LOCKOUT_DURATION_MINUTES
ATTEMPT_WINDOW_MINUTES = account_lockout_module.ATTEMPT_WINDOW_MINUTES


class TestLockoutStatusCheck:
    """Test lockout status checking"""

    def test_check_lockout_status_not_locked(self):
        """Test status when account is not locked"""
        status = AccountLockoutManager.check_lockout_status(
            failed_attempts=2, locked_until=None
        )

        assert status.is_locked is False
        assert status.failed_attempts == 2
        assert status.locked_until is None
        assert status.remaining_attempts == 3  # 5 - 2
        assert status.can_attempt_login is True
        assert status.lockout_reason is None

    def test_check_lockout_status_currently_locked(self):
        """Test status when account is currently locked"""
        future_time = datetime.now() + timedelta(minutes=20)
        status = AccountLockoutManager.check_lockout_status(
            failed_attempts=5, locked_until=future_time
        )

        assert status.is_locked is True
        assert status.failed_attempts == 5
        assert status.locked_until == future_time
        assert status.remaining_attempts == 0
        assert status.can_attempt_login is False
        assert "locked" in status.lockout_reason.lower()
        assert (
            "20 minute" in status.lockout_reason or "19 minute" in status.lockout_reason
        )

    def test_check_lockout_status_expired_lockout(self):
        """Test status when lockout has expired (auto-unlock)"""
        past_time = datetime.now() - timedelta(minutes=10)
        status = AccountLockoutManager.check_lockout_status(
            failed_attempts=5, locked_until=past_time
        )

        # Should be unlocked and counter reset
        assert status.is_locked is False
        assert status.failed_attempts == 0  # Reset after auto-unlock
        assert status.locked_until is None
        assert status.remaining_attempts == MAX_FAILED_ATTEMPTS
        assert status.can_attempt_login is True
        assert status.lockout_reason is None

    def test_check_lockout_status_attempt_window_expired(self):
        """Test counter reset when attempt window expires"""
        old_attempt = datetime.now() - timedelta(minutes=20)
        status = AccountLockoutManager.check_lockout_status(
            failed_attempts=3,
            locked_until=None,
            last_failed_attempt=old_attempt,
        )

        # Counter should be reset
        assert status.is_locked is False
        assert status.failed_attempts == 0
        assert status.remaining_attempts == MAX_FAILED_ATTEMPTS
        assert status.can_attempt_login is True

    def test_check_lockout_status_within_attempt_window(self):
        """Test counter maintained within attempt window"""
        recent_attempt = datetime.now() - timedelta(minutes=5)
        status = AccountLockoutManager.check_lockout_status(
            failed_attempts=3,
            locked_until=None,
            last_failed_attempt=recent_attempt,
        )

        # Counter should be maintained
        assert status.is_locked is False
        assert status.failed_attempts == 3
        assert status.remaining_attempts == 2
        assert status.can_attempt_login is True


class TestRecordFailedAttempt:
    """Test recording failed login attempts"""

    def test_record_first_failed_attempt(self):
        """Test recording the first failed attempt"""
        attempts, locked_until, should_notify = (
            AccountLockoutManager.record_failed_attempt(
                current_failed_attempts=0, locked_until=None
            )
        )

        assert attempts == 1
        assert locked_until is None
        assert should_notify is False

    def test_record_multiple_failed_attempts(self):
        """Test recording multiple failed attempts without locking"""
        for i in range(1, MAX_FAILED_ATTEMPTS):
            attempts, locked_until, should_notify = (
                AccountLockoutManager.record_failed_attempt(
                    current_failed_attempts=i, locked_until=None
                )
            )

            assert attempts == i + 1
            if attempts < MAX_FAILED_ATTEMPTS:
                assert locked_until is None
                assert should_notify is False

    def test_record_failed_attempt_triggers_lockout(self):
        """Test that 5th failed attempt triggers account lockout"""
        attempts, locked_until, should_notify = (
            AccountLockoutManager.record_failed_attempt(
                current_failed_attempts=4, locked_until=None
            )
        )

        assert attempts == MAX_FAILED_ATTEMPTS
        assert locked_until is not None
        assert should_notify is True  # Should send email notification

        # Check locked_until is in the future
        assert locked_until > datetime.now()

        # Check locked_until is approximately 30 minutes from now
        time_diff = locked_until - datetime.now()
        assert 29 <= time_diff.total_seconds() / 60 <= 31

    def test_record_failed_attempt_on_locked_account(self):
        """Test that failed attempt on locked account doesn't increment counter"""
        future_time = datetime.now() + timedelta(minutes=20)
        attempts, locked_until, should_notify = (
            AccountLockoutManager.record_failed_attempt(
                current_failed_attempts=5, locked_until=future_time
            )
        )

        # Counter should not increment
        assert attempts == 5
        assert locked_until == future_time
        assert should_notify is False


class TestResetFailedAttempts:
    """Test resetting failed attempts counter"""

    def test_reset_failed_attempts(self):
        """Test that reset returns (0, None)"""
        attempts, locked_until = AccountLockoutManager.reset_failed_attempts()

        assert attempts == 0
        assert locked_until is None


class TestUserWarnings:
    """Test user warning messages"""

    def test_should_warn_user_2_attempts_remaining(self):
        """Test warning when 2 attempts remaining"""
        should_warn, message = AccountLockoutManager.should_warn_user(3)

        assert should_warn is True
        assert message is not None
        assert "2" in message  # 2 attempts remaining
        assert "locked" in message.lower()

    def test_should_warn_user_1_attempt_remaining(self):
        """Test warning when 1 attempt remaining"""
        should_warn, message = AccountLockoutManager.should_warn_user(4)

        assert should_warn is True
        assert message is not None
        assert "1" in message  # 1 attempt remaining
        assert "locked" in message.lower()

    def test_should_not_warn_user_many_attempts(self):
        """Test no warning when many attempts remaining"""
        should_warn, message = AccountLockoutManager.should_warn_user(0)

        assert should_warn is False
        assert message is None

    def test_should_not_warn_user_3_attempts_remaining(self):
        """Test no warning when 3+ attempts remaining"""
        should_warn, message = AccountLockoutManager.should_warn_user(2)

        assert should_warn is False
        assert message is None


class TestLockoutEmailContent:
    """Test lockout email generation"""

    def test_generate_lockout_email_content(self):
        """Test email content generation"""
        locked_until = datetime.now() + timedelta(minutes=25)
        content = AccountLockoutManager.generate_lockout_email_content(
            full_name="Ahmed Mohammed",
            email="ahmed@example.com",
            locked_until=locked_until,
            ip_address="192.168.1.100",
        )

        # Check structure
        assert "subject" in content
        assert "body_arabic" in content
        assert "body_english" in content
        assert "full_body" in content
        assert "recipient" in content

        # Check subject
        assert "Locked" in content["subject"] or "locked" in content["subject"]

        # Check Arabic body
        assert "Ahmed Mohammed" in content["body_arabic"]
        assert "ahmed@example.com" in content["body_arabic"]
        assert "192.168.1.100" in content["body_arabic"]

        # Check English body
        assert "Ahmed Mohammed" in content["body_english"]
        assert "ahmed@example.com" in content["body_english"]
        assert "192.168.1.100" in content["body_english"]

        # Check recipient
        assert content["recipient"] == "ahmed@example.com"

    def test_generate_lockout_email_without_ip(self):
        """Test email generation without IP address"""
        locked_until = datetime.now() + timedelta(minutes=30)
        content = AccountLockoutManager.generate_lockout_email_content(
            full_name="Sara Ali",
            email="sara@example.com",
            locked_until=locked_until,
        )

        # Should still work without IP
        assert "subject" in content
        assert "Sara Ali" in content["body_english"]
        assert content["recipient"] == "sara@example.com"


class TestLockoutConfiguration:
    """Test lockout configuration"""

    def test_get_lockout_config(self):
        """Test getting lockout configuration"""
        config = AccountLockoutManager.get_lockout_config()

        assert "max_failed_attempts" in config
        assert "lockout_duration_minutes" in config
        assert "attempt_window_minutes" in config

        assert config["max_failed_attempts"] == MAX_FAILED_ATTEMPTS
        assert config["lockout_duration_minutes"] == LOCKOUT_DURATION_MINUTES
        assert config["attempt_window_minutes"] == ATTEMPT_WINDOW_MINUTES

    def test_lockout_config_values(self):
        """Test that lockout config has reasonable values"""
        config = AccountLockoutManager.get_lockout_config()

        # MAX_FAILED_ATTEMPTS should be reasonable (3-10)
        assert 3 <= config["max_failed_attempts"] <= 10

        # LOCKOUT_DURATION should be reasonable (15-60 minutes)
        assert 15 <= config["lockout_duration_minutes"] <= 60

        # ATTEMPT_WINDOW should be reasonable (10-30 minutes)
        assert 10 <= config["attempt_window_minutes"] <= 30


class TestIntegrationScenarios:
    """Test complete lockout scenarios"""

    def test_complete_lockout_flow(self):
        """Test complete flow: attempts → lockout → unlock"""
        # Start with 0 attempts
        status = AccountLockoutManager.check_lockout_status(0, None)
        assert status.can_attempt_login is True

        # Record 4 failed attempts
        attempts = 0
        locked_until = None
        for i in range(4):
            attempts, locked_until, should_notify = (
                AccountLockoutManager.record_failed_attempt(attempts, locked_until)
            )
            assert locked_until is None  # Not locked yet
            assert should_notify is False

        assert attempts == 4

        # 5th attempt triggers lockout
        attempts, locked_until, should_notify = (
            AccountLockoutManager.record_failed_attempt(attempts, locked_until)
        )
        assert attempts == 5
        assert locked_until is not None
        assert should_notify is True

        # Check locked status
        status = AccountLockoutManager.check_lockout_status(attempts, locked_until)
        assert status.is_locked is True
        assert status.can_attempt_login is False

        # Simulate time passing (lockout expires)
        expired_time = datetime.now() - timedelta(minutes=1)
        status = AccountLockoutManager.check_lockout_status(attempts, expired_time)
        assert status.is_locked is False
        assert status.failed_attempts == 0  # Counter reset
        assert status.can_attempt_login is True

    def test_successful_login_resets_counter(self):
        """Test that successful login resets failed attempts"""
        # User has 3 failed attempts
        status = AccountLockoutManager.check_lockout_status(3, None)
        assert status.failed_attempts == 3

        # Successful login
        attempts, locked_until = AccountLockoutManager.reset_failed_attempts()
        assert attempts == 0
        assert locked_until is None

        # Check status after reset
        status = AccountLockoutManager.check_lockout_status(0, None)
        assert status.failed_attempts == 0
        assert status.remaining_attempts == MAX_FAILED_ATTEMPTS

    def test_warning_threshold_behavior(self):
        """Test warning behavior at different attempt levels"""
        # 1 attempt: no warning
        should_warn, message = AccountLockoutManager.should_warn_user(1)
        assert should_warn is False

        # 2 attempts: no warning
        should_warn, message = AccountLockoutManager.should_warn_user(2)
        assert should_warn is False

        # 3 attempts: warning (2 remaining)
        should_warn, message = AccountLockoutManager.should_warn_user(3)
        assert should_warn is True
        assert "2" in message

        # 4 attempts: warning (1 remaining)
        should_warn, message = AccountLockoutManager.should_warn_user(4)
        assert should_warn is True
        assert "1" in message

    def test_attempt_window_expiry(self):
        """Test that old attempts are cleared after window expires"""
        # Last attempt was 20 minutes ago (outside 15-minute window)
        old_attempt = datetime.now() - timedelta(minutes=20)

        status = AccountLockoutManager.check_lockout_status(
            failed_attempts=4,
            locked_until=None,
            last_failed_attempt=old_attempt,
        )

        # Counter should be reset
        assert status.failed_attempts == 0
        assert status.remaining_attempts == MAX_FAILED_ATTEMPTS

        # Recent attempt within window
        recent_attempt = datetime.now() - timedelta(minutes=5)

        status = AccountLockoutManager.check_lockout_status(
            failed_attempts=4,
            locked_until=None,
            last_failed_attempt=recent_attempt,
        )

        # Counter should be maintained
        assert status.failed_attempts == 4
        assert status.remaining_attempts == 1
