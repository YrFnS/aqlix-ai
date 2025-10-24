"""
Unit tests for MFA Manager
Tests MFA setup, code generation/verification, prayer time delays, and device trust
"""

import pytest
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from apps.api.services.mfa_manager import (
    MFAManager,
    MFAMethod,
    MFASetupResult,
    MFAVerificationResult,
    CodeGenerationResult,
    IraqiRegion,
    IslamicComplianceLevel,
)


class TestMFASetup:
    """Test MFA setup for different methods"""

    def test_setup_sms_mfa(self):
        """Setup MFA with SMS method"""
        manager = MFAManager(user_id="user123")
        result = manager.setup_mfa(
            method=MFAMethod.SMS,
            destination="+9647501234567",
            islamic_compliance=IslamicComplianceLevel.STANDARD,
        )

        assert result.success is True
        assert result.method == MFAMethod.SMS
        assert result.setup_id is not None
        assert len(result.setup_id) > 0
        assert result.code_sent is True

    def test_setup_email_mfa(self):
        """Setup MFA with email method"""
        manager = MFAManager(user_id="user123")
        result = manager.setup_mfa(
            method=MFAMethod.EMAIL,
            destination="user@example.com",
            islamic_compliance=IslamicComplianceLevel.STANDARD,
        )

        assert result.success is True
        assert result.method == MFAMethod.EMAIL
        assert result.setup_id is not None
        assert result.code_sent is True

    def test_setup_cultural_questions_mfa(self):
        """Setup MFA with cultural questions method"""
        manager = MFAManager(user_id="user123")
        result = manager.setup_mfa(
            method=MFAMethod.CULTURAL_QUESTIONS,
            islamic_compliance=IslamicComplianceLevel.STANDARD,
        )

        assert result.success is True
        assert result.method == MFAMethod.CULTURAL_QUESTIONS
        assert result.setup_id is not None
        assert result.questions is not None
        assert len(result.questions) >= 3  # At least 3 cultural questions

    def test_setup_missing_destination_sms(self):
        """Setup SMS MFA without destination should fail"""
        manager = MFAManager(user_id="user123")
        result = manager.setup_mfa(
            method=MFAMethod.SMS,
            destination=None,
        )

        assert result.success is False
        assert "destination" in result.error_message.lower()

    def test_setup_missing_destination_email(self):
        """Setup email MFA without destination should fail"""
        manager = MFAManager(user_id="user123")
        result = manager.setup_mfa(
            method=MFAMethod.EMAIL,
            destination=None,
        )

        assert result.success is False
        assert "destination" in result.error_message.lower()

    def test_setup_invalid_phone_format(self):
        """Setup SMS MFA with invalid phone format should fail"""
        manager = MFAManager(user_id="user123")
        result = manager.setup_mfa(
            method=MFAMethod.SMS,
            destination="invalid-phone",
        )

        assert result.success is False
        assert (
            "phone" in result.error_message.lower()
            or "format" in result.error_message.lower()
        )

    def test_setup_invalid_email_format(self):
        """Setup email MFA with invalid email format should fail"""
        manager = MFAManager(user_id="user123")
        result = manager.setup_mfa(
            method=MFAMethod.EMAIL,
            destination="invalid-email",
        )

        assert result.success is False
        assert (
            "email" in result.error_message.lower()
            or "format" in result.error_message.lower()
        )


class TestCodeGeneration:
    """Test MFA code generation"""

    def test_generate_6_digit_code(self):
        """Generated code should be 6 digits"""
        manager = MFAManager(user_id="user123")
        code_result = manager.generate_code()

        assert code_result.success is True
        assert len(code_result.code) == 6
        assert code_result.code.isdigit()

    def test_code_expiration_time(self):
        """Code should have expiration time (10 minutes)"""
        manager = MFAManager(user_id="user123")
        code_result = manager.generate_code()

        assert code_result.expires_at is not None
        assert code_result.expires_at > datetime.now(tz=ZoneInfo("Asia/Baghdad"))

        # Should expire in approximately 10 minutes
        time_until_expiry = code_result.expires_at - datetime.now(
            tz=ZoneInfo("Asia/Baghdad")
        )
        assert time_until_expiry.total_seconds() > 500  # > 8 minutes
        assert time_until_expiry.total_seconds() < 700  # < 12 minutes

    def test_code_uniqueness(self):
        """Generated codes should be unique"""
        manager = MFAManager(user_id="user123")
        codes = set()

        # Generate 100 codes and check for uniqueness
        for _ in range(100):
            code_result = manager.generate_code()
            codes.add(code_result.code)

        # Should have at least 95% unique codes (some collisions expected)
        assert len(codes) >= 95

    def test_code_storage(self):
        """Generated code should be stored for verification"""
        manager = MFAManager(user_id="user123")
        code_result = manager.generate_code()

        assert manager.has_pending_code() is True
        assert manager.get_stored_code() == code_result.code


class TestCodeVerification:
    """Test MFA code verification"""

    def test_verify_correct_code(self):
        """Verify correct code should succeed"""
        manager = MFAManager(user_id="user123")
        code_result = manager.generate_code()

        verification = manager.verify_code(code_result.code)

        assert verification.success is True
        assert verification.error_message is None

    def test_verify_incorrect_code(self):
        """Verify incorrect code should fail"""
        manager = MFAManager(user_id="user123")
        manager.generate_code()

        verification = manager.verify_code("000000")  # Wrong code

        assert verification.success is False
        assert (
            "invalid" in verification.error_message.lower()
            or "incorrect" in verification.error_message.lower()
        )

    def test_verify_expired_code(self):
        """Verify expired code should fail"""
        manager = MFAManager(user_id="user123")
        code_result = manager.generate_code()

        # Simulate code expiration
        manager.set_code_expiration(
            datetime.now(tz=ZoneInfo("Asia/Baghdad")) - timedelta(minutes=1)
        )

        verification = manager.verify_code(code_result.code)

        assert verification.success is False
        assert "expired" in verification.error_message.lower()

    def test_verify_code_without_generation(self):
        """Verify code without generating one should fail"""
        manager = MFAManager(user_id="user123")
        verification = manager.verify_code("123456")

        assert verification.success is False
        assert (
            "no pending" in verification.error_message.lower()
            or "not found" in verification.error_message.lower()
        )

    def test_verify_code_rate_limiting(self):
        """Verify too many attempts should trigger rate limiting"""
        manager = MFAManager(user_id="user123")
        code_result = manager.generate_code()

        # Attempt verification 5 times (incorrect)
        for i in range(5):
            manager.verify_code("000000")

        # 6th attempt should be rate-limited
        verification = manager.verify_code(code_result.code)

        assert verification.success is False
        assert (
            "rate limit" in verification.error_message.lower()
            or "too many" in verification.error_message.lower()
        )

    def test_code_single_use(self):
        """Code should only be usable once"""
        manager = MFAManager(user_id="user123")
        code_result = manager.generate_code()

        # First verification
        first_verification = manager.verify_code(code_result.code)
        assert first_verification.success is True

        # Second verification with same code
        second_verification = manager.verify_code(code_result.code)
        assert second_verification.success is False
        assert (
            "already used" in second_verification.error_message.lower()
            or "invalid" in second_verification.error_message.lower()
        )


class TestPrayerTimeDelay:
    """Test prayer time awareness in MFA operations"""

    def test_code_generation_during_fajr(self):
        """Code generation during Fajr prayer should include delay notice"""
        manager = MFAManager(
            user_id="user123",
            islamic_compliance=IslamicComplianceLevel.STANDARD,
        )
        fajr_time = datetime(2025, 1, 15, 5, 0, 0, tzinfo=ZoneInfo("Asia/Baghdad"))

        code_result = manager.generate_code(current_time=fajr_time)

        assert code_result.success is True
        assert code_result.prayer_time_delay is not None
        assert "Fajr" in code_result.prayer_time_delay

    def test_code_generation_during_dhuhr(self):
        """Code generation during Dhuhr prayer should include delay notice"""
        manager = MFAManager(
            user_id="user123",
            islamic_compliance=IslamicComplianceLevel.STANDARD,
        )
        dhuhr_time = datetime(2025, 1, 15, 12, 15, 0, tzinfo=ZoneInfo("Asia/Baghdad"))

        code_result = manager.generate_code(current_time=dhuhr_time)

        assert code_result.success is True
        assert code_result.prayer_time_delay is not None
        assert "Dhuhr" in code_result.prayer_time_delay

    def test_code_generation_outside_prayer_time(self):
        """Code generation outside prayer time should have no delay"""
        manager = MFAManager(
            user_id="user123",
            islamic_compliance=IslamicComplianceLevel.STANDARD,
        )
        regular_time = datetime(2025, 1, 15, 10, 0, 0, tzinfo=ZoneInfo("Asia/Baghdad"))

        code_result = manager.generate_code(current_time=regular_time)

        assert code_result.success is True
        assert code_result.prayer_time_delay is None

    def test_basic_compliance_ignores_prayer_time(self):
        """Basic compliance should not delay for prayer times"""
        manager = MFAManager(
            user_id="user123",
            islamic_compliance=IslamicComplianceLevel.BASIC,
        )
        fajr_time = datetime(2025, 1, 15, 5, 0, 0, tzinfo=ZoneInfo("Asia/Baghdad"))

        code_result = manager.generate_code(current_time=fajr_time)

        assert code_result.success is True
        assert code_result.prayer_time_delay is None


class TestDeviceTrust:
    """Test device trust functionality"""

    def test_trust_new_device(self):
        """Trust a new device"""
        manager = MFAManager(user_id="user123")
        device_id = "device-abc-123"

        trust_result = manager.trust_device(device_id, device_name="iPhone 14")

        assert trust_result.success is True
        assert manager.is_device_trusted(device_id) is True

    def test_trusted_device_skips_mfa(self):
        """Trusted device should skip MFA requirement"""
        manager = MFAManager(user_id="user123")
        device_id = "device-abc-123"

        manager.trust_device(device_id, device_name="iPhone 14")
        requires_mfa = manager.requires_mfa(device_id)

        assert requires_mfa is False

    def test_untrusted_device_requires_mfa(self):
        """Untrusted device should require MFA"""
        manager = MFAManager(user_id="user123")
        device_id = "device-xyz-789"

        requires_mfa = manager.requires_mfa(device_id)

        assert requires_mfa is True

    def test_revoke_device_trust(self):
        """Revoke trust for a device"""
        manager = MFAManager(user_id="user123")
        device_id = "device-abc-123"

        manager.trust_device(device_id, device_name="iPhone 14")
        assert manager.is_device_trusted(device_id) is True

        revoke_result = manager.revoke_device_trust(device_id)

        assert revoke_result.success is True
        assert manager.is_device_trusted(device_id) is False

    def test_list_trusted_devices(self):
        """List all trusted devices"""
        manager = MFAManager(user_id="user123")

        manager.trust_device("device-1", device_name="iPhone 14")
        manager.trust_device("device-2", device_name="MacBook Pro")
        manager.trust_device("device-3", device_name="iPad Air")

        devices = manager.list_trusted_devices()

        assert len(devices) == 3
        assert any(d["device_id"] == "device-1" for d in devices)
        assert any(d["device_id"] == "device-2" for d in devices)
        assert any(d["device_id"] == "device-3" for d in devices)


class TestCulturalQuestions:
    """Test cultural questions MFA method"""

    def test_generate_cultural_questions(self):
        """Generate cultural questions for MFA"""
        manager = MFAManager(user_id="user123", region=IraqiRegion.BAGHDAD)

        questions = manager.generate_cultural_questions()

        assert len(questions) >= 3
        assert all("question" in q for q in questions)
        assert all("answer" in q for q in questions)

    def test_verify_cultural_answers_correct(self):
        """Verify correct cultural answers"""
        manager = MFAManager(user_id="user123", region=IraqiRegion.BAGHDAD)

        questions = manager.generate_cultural_questions()
        correct_answers = {q["id"]: q["answer"] for q in questions}

        verification = manager.verify_cultural_answers(correct_answers)

        assert verification.success is True

    def test_verify_cultural_answers_incorrect(self):
        """Verify incorrect cultural answers"""
        manager = MFAManager(user_id="user123", region=IraqiRegion.BAGHDAD)

        questions = manager.generate_cultural_questions()
        incorrect_answers = {q["id"]: "wrong answer" for q in questions}

        verification = manager.verify_cultural_answers(incorrect_answers)

        assert verification.success is False
        assert "incorrect" in verification.error_message.lower()

    def test_cultural_questions_regional_variation(self):
        """Cultural questions should vary by region"""
        baghdad_manager = MFAManager(user_id="user123", region=IraqiRegion.BAGHDAD)
        basra_manager = MFAManager(user_id="user123", region=IraqiRegion.BASRA)

        baghdad_questions = baghdad_manager.generate_cultural_questions()
        basra_questions = basra_manager.generate_cultural_questions()

        # Questions should have regional context
        assert len(baghdad_questions) >= 3
        assert len(basra_questions) >= 3

        # At least some questions should be different
        baghdad_q_text = {q["question"] for q in baghdad_questions}
        basra_q_text = {q["question"] for q in basra_questions}
        assert baghdad_q_text != basra_q_text


class TestMFAResultStructures:
    """Test MFA result data structures"""

    def test_setup_result_has_all_fields(self):
        """MFA setup result should have all expected fields"""
        manager = MFAManager(user_id="user123")
        result = manager.setup_mfa(method=MFAMethod.SMS, destination="+9647501234567")

        assert hasattr(result, "success")
        assert hasattr(result, "method")
        assert hasattr(result, "setup_id")
        assert hasattr(result, "code_sent")
        assert hasattr(result, "error_message")

    def test_verification_result_has_all_fields(self):
        """MFA verification result should have all expected fields"""
        manager = MFAManager(user_id="user123")
        code_result = manager.generate_code()
        verification = manager.verify_code(code_result.code)

        assert hasattr(verification, "success")
        assert hasattr(verification, "error_message")


class TestEdgeCases:
    """Test edge cases and boundary conditions"""

    def test_multiple_pending_codes(self):
        """Generate multiple codes should invalidate previous"""
        manager = MFAManager(user_id="user123")

        first_code = manager.generate_code()
        second_code = manager.generate_code()

        # First code should be invalid
        first_verification = manager.verify_code(first_code.code)
        assert first_verification.success is False

        # Second code should be valid
        second_verification = manager.verify_code(second_code.code)
        assert second_verification.success is True

    def test_empty_user_id(self):
        """Empty user ID should fail gracefully"""
        manager = MFAManager(user_id="")
        result = manager.setup_mfa(method=MFAMethod.SMS, destination="+9647501234567")

        assert result.success is False

    def test_none_user_id(self):
        """None user ID should fail gracefully"""
        manager = MFAManager(user_id=None)
        result = manager.setup_mfa(method=MFAMethod.SMS, destination="+9647501234567")

        assert result.success is False


class TestRealWorldScenarios:
    """Test realistic MFA scenarios"""

    def test_complete_sms_mfa_flow(self):
        """Complete SMS MFA flow: setup → generate → verify"""
        manager = MFAManager(user_id="user123")

        # Setup
        setup = manager.setup_mfa(method=MFAMethod.SMS, destination="+9647501234567")
        assert setup.success is True

        # Generate code
        code_result = manager.generate_code()
        assert code_result.success is True

        # Verify code
        verification = manager.verify_code(code_result.code)
        assert verification.success is True

    def test_complete_cultural_mfa_flow(self):
        """Complete cultural questions MFA flow"""
        manager = MFAManager(user_id="user123", region=IraqiRegion.BAGHDAD)

        # Setup
        setup = manager.setup_mfa(method=MFAMethod.CULTURAL_QUESTIONS)
        assert setup.success is True
        assert len(setup.questions) >= 3

        # Verify answers
        correct_answers = {q["id"]: q["answer"] for q in setup.questions}
        verification = manager.verify_cultural_answers(correct_answers)
        assert verification.success is True

    def test_trusted_device_login(self):
        """Login from trusted device skips MFA"""
        manager = MFAManager(user_id="user123")
        device_id = "trusted-device-123"

        # Trust device
        manager.trust_device(device_id, device_name="MacBook Pro")

        # Check MFA requirement
        requires_mfa = manager.requires_mfa(device_id)
        assert requires_mfa is False

    def test_mfa_during_prayer_time(self):
        """MFA during prayer time with standard compliance"""
        manager = MFAManager(
            user_id="user123",
            islamic_compliance=IslamicComplianceLevel.STANDARD,
        )

        fajr_time = datetime(2025, 1, 15, 5, 0, 0, tzinfo=ZoneInfo("Asia/Baghdad"))
        code_result = manager.generate_code(current_time=fajr_time)

        assert code_result.success is True
        assert code_result.prayer_time_delay is not None
        assert "Fajr" in code_result.prayer_time_delay

        # Code should still work
        verification = manager.verify_code(code_result.code)
        assert verification.success is True
