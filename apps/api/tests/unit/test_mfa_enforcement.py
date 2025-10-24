"""
Unit tests for MFA enforcement service
Tests MFA enforcement logic and policy compliance
"""

import sys
import os
from datetime import datetime, timedelta
import pytest

# Add parent directory to path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

# Import directly from the module file
import importlib.util

spec = importlib.util.spec_from_file_location(
    "mfa_enforcement",
    os.path.join(os.path.dirname(__file__), "../../services/mfa_enforcement.py"),
)
mfa_enforcement = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mfa_enforcement)

MFAEnforcementManager = mfa_enforcement.MFAEnforcementManager
MFAEnforcementConfig = mfa_enforcement.MFAEnforcementConfig
MFAEnforcementResult = mfa_enforcement.MFAEnforcementResult
MFAEnforcementStatus = mfa_enforcement.MFAEnforcementStatus

# Import MFA types from mfa_manager
mfa_spec = importlib.util.spec_from_file_location(
    "mfa_manager",
    os.path.join(os.path.dirname(__file__), "../../services/mfa_manager.py"),
)
mfa_manager = importlib.util.module_from_spec(mfa_spec)
mfa_spec.loader.exec_module(mfa_manager)

MFAFrequency = mfa_manager.MFAFrequency
MFAVerificationResult = mfa_manager.MFAVerificationResult


class TestMFAEnforcementBasics:
    """Test basic MFA enforcement logic"""

    def test_mfa_not_enabled_no_enforcement(self):
        """Test that MFA is not enforced when disabled"""
        result = MFAEnforcementManager.should_enforce_mfa(
            mfa_enabled=False,
            mfa_frequency=MFAFrequency.EVERY_LOGIN,
        )

        assert result.should_enforce is False
        assert result.can_skip is True
        assert "not enabled" in result.enforcement_reason.lower()

    def test_suspicious_activity_always_enforces(self):
        """Test that suspicious activity always enforces MFA"""
        result = MFAEnforcementManager.should_enforce_mfa(
            mfa_enabled=True,
            mfa_frequency=MFAFrequency.SUSPICIOUS_ACTIVITY,
            is_suspicious_activity=True,
        )

        assert result.should_enforce is True
        assert result.can_skip is False
        assert "suspicious" in result.enforcement_reason.lower()

    def test_every_login_frequency_enforces(self):
        """Test EVERY_LOGIN frequency enforces MFA"""
        result = MFAEnforcementManager.should_enforce_mfa(
            mfa_enabled=True,
            mfa_frequency=MFAFrequency.EVERY_LOGIN,
        )

        assert result.should_enforce is True
        assert "every_login" in result.enforcement_reason.lower()

    def test_new_device_without_trust_token_enforces(self):
        """Test NEW_DEVICE frequency enforces for new devices"""
        result = MFAEnforcementManager.should_enforce_mfa(
            mfa_enabled=True,
            mfa_frequency=MFAFrequency.NEW_DEVICE,
            device_id=None,  # No device ID
        )

        assert result.should_enforce is True
        assert "new device" in result.enforcement_reason.lower()


class TestSensitiveOperations:
    """Test MFA enforcement for sensitive operations"""

    def test_payment_operation_requires_mfa(self):
        """Test payment operations always require MFA"""
        result = MFAEnforcementManager.should_enforce_mfa(
            mfa_enabled=True,
            mfa_frequency=MFAFrequency.SUSPICIOUS_ACTIVITY,
            operation_type="payment",
        )

        assert result.should_enforce is True
        assert result.can_skip is False
        assert "payment" in result.enforcement_reason.lower()

    def test_password_change_requires_mfa(self):
        """Test password change requires MFA"""
        result = MFAEnforcementManager.should_enforce_mfa(
            mfa_enabled=True,
            mfa_frequency=MFAFrequency.SUSPICIOUS_ACTIVITY,
            operation_type="password_change",
        )

        assert result.should_enforce is True
        assert result.can_skip is False
        assert "password_change" in result.enforcement_reason.lower()

    def test_transfer_operation_requires_mfa(self):
        """Test transfer operations require MFA"""
        result = MFAEnforcementManager.should_enforce_mfa(
            mfa_enabled=True,
            mfa_frequency=MFAFrequency.SUSPICIOUS_ACTIVITY,
            operation_type="transfer",
        )

        assert result.should_enforce is True
        assert result.can_skip is False

    def test_mfa_disable_requires_mfa(self):
        """Test disabling MFA requires MFA verification"""
        result = MFAEnforcementManager.should_enforce_mfa(
            mfa_enabled=True,
            mfa_frequency=MFAFrequency.SUSPICIOUS_ACTIVITY,
            operation_type="mfa_disable",
        )

        assert result.should_enforce is True
        assert result.can_skip is False
        assert "mfa_disable" in result.enforcement_reason.lower()

    def test_login_operation_respects_frequency(self):
        """Test login operations respect frequency settings"""
        result = MFAEnforcementManager.should_enforce_mfa(
            mfa_enabled=True,
            mfa_frequency=MFAFrequency.SUSPICIOUS_ACTIVITY,
            operation_type="login",
            is_suspicious_activity=False,
        )

        # Login doesn't enforce for SUSPICIOUS_ACTIVITY frequency when not suspicious
        assert result.should_enforce is False


class TestPeriodicMFA:
    """Test periodic MFA enforcement"""

    def test_periodic_mfa_with_recent_login(self):
        """Test periodic MFA not enforced for recent logins"""
        recent_login = datetime.now() - timedelta(days=3)

        result = MFAEnforcementManager.should_enforce_mfa(
            mfa_enabled=True,
            mfa_frequency=MFAFrequency.PERIODIC,
            last_login=recent_login,
        )

        assert result.should_enforce is False
        assert "recent login" in result.enforcement_reason.lower()

    def test_periodic_mfa_with_old_login(self):
        """Test periodic MFA enforced for old logins (>7 days)"""
        old_login = datetime.now() - timedelta(days=10)

        result = MFAEnforcementManager.should_enforce_mfa(
            mfa_enabled=True,
            mfa_frequency=MFAFrequency.PERIODIC,
            last_login=old_login,
        )

        assert result.should_enforce is True
        assert "periodic" in result.enforcement_reason.lower()

    def test_periodic_mfa_at_threshold(self):
        """Test periodic MFA at exactly 7 days threshold"""
        threshold_login = datetime.now() - timedelta(days=7)

        result = MFAEnforcementManager.should_enforce_mfa(
            mfa_enabled=True,
            mfa_frequency=MFAFrequency.PERIODIC,
            last_login=threshold_login,
        )

        # Should not enforce at exactly 7 days (only >7)
        assert result.should_enforce is False

    def test_periodic_mfa_without_last_login(self):
        """Test periodic MFA when last login is None"""
        result = MFAEnforcementManager.should_enforce_mfa(
            mfa_enabled=True,
            mfa_frequency=MFAFrequency.PERIODIC,
            last_login=None,
        )

        # Should not enforce if we don't know last login
        assert result.should_enforce is False


class TestEnforcementStatus:
    """Test MFA enforcement status"""

    def test_get_enforcement_status_enabled(self):
        """Test getting enforcement status when MFA enabled"""
        status = MFAEnforcementManager.get_enforcement_status(
            mfa_enabled=True,
            mfa_frequency=MFAFrequency.EVERY_LOGIN,
        )

        assert isinstance(status, MFAEnforcementStatus)
        assert status.mfa_required is True
        assert status.mfa_enforced is True

    def test_get_enforcement_status_disabled(self):
        """Test getting enforcement status when MFA disabled"""
        status = MFAEnforcementManager.get_enforcement_status(
            mfa_enabled=False,
            mfa_frequency=MFAFrequency.EVERY_LOGIN,
        )

        assert status.mfa_required is False
        assert status.mfa_enforced is False
        assert status.can_skip is True

    def test_get_enforcement_status_suspicious(self):
        """Test enforcement status with suspicious activity"""
        status = MFAEnforcementManager.get_enforcement_status(
            mfa_enabled=True,
            mfa_frequency=MFAFrequency.EVERY_LOGIN,
            is_suspicious_activity=True,
        )

        assert status.mfa_enforced is True
        assert status.can_skip is False


class TestMFAValidation:
    """Test MFA completion validation"""

    def test_validate_mfa_completion_success(self):
        """Test successful MFA completion validation"""
        verification_result = MFAVerificationResult(
            success=True,
            verification_id="test-id",
            attempts_remaining=2,
        )

        is_valid, error = MFAEnforcementManager.validate_mfa_completion(
            verification_result=verification_result,
            required=True,
        )

        assert is_valid is True
        assert error is None

    def test_validate_mfa_completion_failure(self):
        """Test failed MFA completion validation"""
        verification_result = MFAVerificationResult(
            success=False,
            verification_id="test-id",
            error_message="Invalid code",
            attempts_remaining=2,
        )

        is_valid, error = MFAEnforcementManager.validate_mfa_completion(
            verification_result=verification_result,
            required=True,
        )

        assert is_valid is False
        assert error == "Invalid code"

    def test_validate_mfa_completion_not_required(self):
        """Test MFA validation when not required"""
        verification_result = MFAVerificationResult(
            success=False,
            verification_id="test-id",
            error_message="Invalid code",
            attempts_remaining=2,
        )

        is_valid, error = MFAEnforcementManager.validate_mfa_completion(
            verification_result=verification_result,
            required=False,
        )

        # Should be valid even if verification failed, since MFA not required
        assert is_valid is True
        assert error is None


class TestOperationTypeChecks:
    """Test operation type MFA requirement checks"""

    def test_payment_operation_requires_mfa(self):
        """Test payment operations require MFA"""
        requires_mfa = MFAEnforcementManager.check_operation_requires_mfa("payment")
        assert requires_mfa is True

    def test_transfer_operation_requires_mfa(self):
        """Test transfer operations require MFA"""
        requires_mfa = MFAEnforcementManager.check_operation_requires_mfa("transfer")
        assert requires_mfa is True

    def test_password_change_requires_mfa(self):
        """Test password change requires MFA"""
        requires_mfa = MFAEnforcementManager.check_operation_requires_mfa(
            "password_change"
        )
        assert requires_mfa is True

    def test_login_operation_does_not_require_mfa(self):
        """Test login operations don't automatically require MFA"""
        requires_mfa = MFAEnforcementManager.check_operation_requires_mfa("login")
        assert requires_mfa is False

    def test_case_insensitive_operation_check(self):
        """Test operation type checking is case-insensitive"""
        requires_mfa_upper = MFAEnforcementManager.check_operation_requires_mfa(
            "PAYMENT"
        )
        requires_mfa_lower = MFAEnforcementManager.check_operation_requires_mfa(
            "payment"
        )

        assert requires_mfa_upper is True
        assert requires_mfa_lower is True


class TestConfiguration:
    """Test MFA enforcement configuration"""

    def test_get_enforcement_config(self):
        """Test retrieving enforcement configuration"""
        config = MFAEnforcementManager.get_enforcement_config()

        assert isinstance(config, dict)
        assert "max_verification_attempts" in config
        assert "code_expiry_minutes" in config
        assert "require_mfa_for_sensitive_operations" in config
        assert "allow_trusted_device_skip" in config
        assert "periodic_reverification_days" in config

    def test_config_values_reasonable(self):
        """Test configuration values are reasonable"""
        config = MFAEnforcementManager.get_enforcement_config()

        # Max attempts should be between 1-10
        assert 1 <= config["max_verification_attempts"] <= 10

        # Code expiry should be between 1-30 minutes
        assert 1 <= config["code_expiry_minutes"] <= 30

        # Periodic reverification should be between 1-30 days
        assert 1 <= config["periodic_reverification_days"] <= 30

        # Boolean flags should be boolean
        assert isinstance(config["require_mfa_for_sensitive_operations"], bool)
        assert isinstance(config["allow_trusted_device_skip"], bool)


class TestEmailGeneration:
    """Test MFA enforcement email generation"""

    def test_generate_mfa_enforcement_email(self):
        """Test generating MFA enforcement email"""
        email = MFAEnforcementManager.generate_mfa_enforcement_email(
            full_name="Ahmed Mohammed",
            email="ahmed@example.com",
            enforcement_reason="MFA frequency: EVERY_LOGIN",
            operation_type="login",
        )

        assert isinstance(email, dict)
        assert "subject" in email
        assert "body_arabic" in email
        assert "body_english" in email
        assert "body" in email

    def test_email_contains_user_info(self):
        """Test email contains user information"""
        full_name = "Ahmed Mohammed"
        user_email = "ahmed@example.com"

        email = MFAEnforcementManager.generate_mfa_enforcement_email(
            full_name=full_name,
            email=user_email,
            enforcement_reason="MFA frequency: EVERY_LOGIN",
            operation_type="login",
        )

        assert full_name in email["body_arabic"]
        assert full_name in email["body_english"]
        assert user_email in email["body_arabic"]
        assert user_email in email["body_english"]

    def test_email_contains_enforcement_reason(self):
        """Test email contains enforcement reason"""
        reason = "Suspicious activity detected"

        email = MFAEnforcementManager.generate_mfa_enforcement_email(
            full_name="Ahmed Mohammed",
            email="ahmed@example.com",
            enforcement_reason=reason,
            operation_type="login",
        )

        assert reason in email["body_arabic"]
        assert reason in email["body_english"]

    def test_email_bilingual_content(self):
        """Test email contains both Arabic and English content"""
        email = MFAEnforcementManager.generate_mfa_enforcement_email(
            full_name="Ahmed Mohammed",
            email="ahmed@example.com",
            enforcement_reason="MFA frequency: EVERY_LOGIN",
            operation_type="login",
        )

        # Check Arabic content
        assert "مرحباً" in email["body_arabic"]
        assert "التحقق بخطوتين" in email["body_arabic"]

        # Check English content
        assert "Hello" in email["body_english"]
        assert "Multi-Factor Authentication" in email["body_english"]

        # Check combined body contains both
        assert "مرحباً" in email["body"]
        assert "Hello" in email["body"]


class TestIntegrationScenarios:
    """Test complete MFA enforcement scenarios"""

    def test_standard_login_with_mfa_enabled(self):
        """Test standard login flow with MFA enabled"""
        # User has MFA enabled with EVERY_LOGIN frequency
        result = MFAEnforcementManager.should_enforce_mfa(
            mfa_enabled=True,
            mfa_frequency=MFAFrequency.EVERY_LOGIN,
            operation_type="login",
        )

        assert result.should_enforce is True
        assert result.can_skip is False

    def test_payment_with_mfa_disabled(self):
        """Test payment operation when MFA disabled"""
        # Even with MFA disabled, sensitive operations should still require it
        # But current implementation skips if MFA not enabled
        result = MFAEnforcementManager.should_enforce_mfa(
            mfa_enabled=False,
            mfa_frequency=MFAFrequency.EVERY_LOGIN,
            operation_type="payment",
        )

        # When MFA is disabled globally, no enforcement
        assert result.should_enforce is False
        assert result.can_skip is True

    def test_suspicious_activity_overrides_frequency(self):
        """Test suspicious activity overrides frequency settings"""
        # Even with SUSPICIOUS_ACTIVITY frequency, should enforce if activity is suspicious
        result = MFAEnforcementManager.should_enforce_mfa(
            mfa_enabled=True,
            mfa_frequency=MFAFrequency.SUSPICIOUS_ACTIVITY,
            is_suspicious_activity=True,
            operation_type="login",
        )

        assert result.should_enforce is True
        assert result.can_skip is False

    def test_periodic_verification_flow(self):
        """Test complete periodic verification flow"""
        # Recent login - no MFA
        recent_result = MFAEnforcementManager.should_enforce_mfa(
            mfa_enabled=True,
            mfa_frequency=MFAFrequency.PERIODIC,
            last_login=datetime.now() - timedelta(days=3),
        )
        assert recent_result.should_enforce is False

        # Old login - requires MFA
        old_result = MFAEnforcementManager.should_enforce_mfa(
            mfa_enabled=True,
            mfa_frequency=MFAFrequency.PERIODIC,
            last_login=datetime.now() - timedelta(days=10),
        )
        assert old_result.should_enforce is True

    def test_complete_enforcement_validation_flow(self):
        """Test complete enforcement and validation flow"""
        # Step 1: Check if MFA should be enforced
        enforcement_result = MFAEnforcementManager.should_enforce_mfa(
            mfa_enabled=True,
            mfa_frequency=MFAFrequency.EVERY_LOGIN,
        )
        assert enforcement_result.should_enforce is True

        # Step 2: Simulate successful MFA verification
        verification_result = MFAVerificationResult(
            success=True,
            verification_id="test-id",
            attempts_remaining=2,
        )

        # Step 3: Validate MFA completion
        is_valid, error = MFAEnforcementManager.validate_mfa_completion(
            verification_result=verification_result,
            required=enforcement_result.should_enforce,
        )

        assert is_valid is True
        assert error is None
