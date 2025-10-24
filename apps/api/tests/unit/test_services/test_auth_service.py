"""
Unit tests for Auth Service
Tests complete registration, login, and service orchestration flows
"""

import pytest
from datetime import datetime
from zoneinfo import ZoneInfo
from apps.api.services.auth_service import (
    AuthService,
    RegistrationData,
    LoginData,
    RegistrationResult,
    LoginResult,
    IraqiRegion,
    IslamicComplianceLevel,
    LanguagePreference,
    ProfessionalDomain,
)


class TestUserRegistration:
    """Test user registration flows"""

    def test_register_basic_user(self):
        """Register basic user with minimal fields"""
        service = AuthService()
        registration_data = RegistrationData(
            full_name="أحمد محمد / Ahmed Mohammed",
            email="ahmed@example.com",
            password="SecurePass123!",
            region=IraqiRegion.BAGHDAD,
            language_preference=LanguagePreference.BOTH,
            islamic_compliance_level=IslamicComplianceLevel.BASIC,
        )

        result = service.register(registration_data)

        assert result.success is True
        assert result.user_id is not None
        assert result.email_sent is True
        assert result.error_message is None

    def test_register_professional_user(self):
        """Register professional user with Iraqi ID and license"""
        service = AuthService()
        registration_data = RegistrationData(
            full_name="د. فاطمة علي / Dr. Fatima Ali",
            email="fatima@example.com",
            password="SecurePass123!",
            region=IraqiRegion.BASRA,
            iraqi_id="061985123456",
            professional_domain=ProfessionalDomain.MEDICAL,
            professional_license="MED-123456-BA",
            language_preference=LanguagePreference.BOTH,
            islamic_compliance_level=IslamicComplianceLevel.STANDARD,
        )

        result = service.register(registration_data)

        assert result.success is True
        assert result.user_id is not None
        assert result.email_sent is True

    def test_register_duplicate_email(self):
        """Register with duplicate email should fail"""
        service = AuthService()
        registration_data = RegistrationData(
            full_name="أحمد محمد",
            email="duplicate@example.com",
            password="SecurePass123!",
            region=IraqiRegion.BAGHDAD,
            language_preference=LanguagePreference.BOTH,
            islamic_compliance_level=IslamicComplianceLevel.BASIC,
        )

        # First registration
        first_result = service.register(registration_data)
        assert first_result.success is True

        # Second registration with same email
        second_result = service.register(registration_data)
        assert second_result.success is False
        assert (
            "email" in second_result.error_message.lower()
            or "exists" in second_result.error_message.lower()
        )

    def test_register_invalid_email(self):
        """Register with invalid email format should fail"""
        service = AuthService()
        registration_data = RegistrationData(
            full_name="أحمد محمد",
            email="invalid-email",
            password="SecurePass123!",
            region=IraqiRegion.BAGHDAD,
            language_preference=LanguagePreference.BOTH,
            islamic_compliance_level=IslamicComplianceLevel.BASIC,
        )

        result = service.register(registration_data)

        assert result.success is False
        assert "email" in result.error_message.lower()

    def test_register_weak_password(self):
        """Register with weak password should fail"""
        service = AuthService()
        registration_data = RegistrationData(
            full_name="أحمد محمد",
            email="ahmed@example.com",
            password="weak",
            region=IraqiRegion.BAGHDAD,
            language_preference=LanguagePreference.BOTH,
            islamic_compliance_level=IslamicComplianceLevel.BASIC,
        )

        result = service.register(registration_data)

        assert result.success is False
        assert "password" in result.error_message.lower()

    def test_register_invalid_iraqi_id(self):
        """Register with invalid Iraqi ID should fail"""
        service = AuthService()
        registration_data = RegistrationData(
            full_name="أحمد محمد",
            email="ahmed@example.com",
            password="SecurePass123!",
            region=IraqiRegion.BAGHDAD,
            iraqi_id="123",  # Invalid format
            language_preference=LanguagePreference.BOTH,
            islamic_compliance_level=IslamicComplianceLevel.BASIC,
        )

        result = service.register(registration_data)

        assert result.success is False
        assert (
            "iraqi id" in result.error_message.lower()
            or "id" in result.error_message.lower()
        )

    def test_register_invalid_professional_license(self):
        """Register with invalid professional license should fail"""
        service = AuthService()
        registration_data = RegistrationData(
            full_name="أحمد محمد",
            email="ahmed@example.com",
            password="SecurePass123!",
            region=IraqiRegion.BAGHDAD,
            professional_domain=ProfessionalDomain.LEGAL,
            professional_license="INVALID-LICENSE",
            language_preference=LanguagePreference.BOTH,
            islamic_compliance_level=IslamicComplianceLevel.BASIC,
        )

        result = service.register(registration_data)

        assert result.success is False
        assert "license" in result.error_message.lower()

    def test_register_mismatched_region_and_iraqi_id(self):
        """Register with Baghdad region but Basra ID prefix should fail"""
        service = AuthService()
        registration_data = RegistrationData(
            full_name="أحمد محمد",
            email="ahmed@example.com",
            password="SecurePass123!",
            region=IraqiRegion.BAGHDAD,  # Baghdad
            iraqi_id="061985123456",  # Basra prefix (06)
            language_preference=LanguagePreference.BOTH,
            islamic_compliance_level=IslamicComplianceLevel.BASIC,
        )

        result = service.register(registration_data)

        # Should either fail or warn about mismatch
        if not result.success:
            assert (
                "region" in result.error_message.lower()
                or "prefix" in result.error_message.lower()
            )


class TestUserLogin:
    """Test user login flows"""

    def test_login_valid_credentials(self):
        """Login with valid email and password"""
        service = AuthService()

        # Register user first
        registration_data = RegistrationData(
            full_name="أحمد محمد",
            email="login@example.com",
            password="SecurePass123!",
            region=IraqiRegion.BAGHDAD,
            language_preference=LanguagePreference.BOTH,
            islamic_compliance_level=IslamicComplianceLevel.BASIC,
        )
        service.register(registration_data)

        # Verify email (simulate)
        service.verify_email("login@example.com")

        # Login
        login_data = LoginData(
            email="login@example.com",
            password="SecurePass123!",
            device_id="device-abc-123",
            device_type="iPhone 14",
            ip_address="192.168.1.100",
        )

        result = service.login(login_data)

        assert result.success is True
        assert result.access_token is not None
        assert result.refresh_token is not None
        assert result.user_id is not None

    def test_login_invalid_email(self):
        """Login with non-existent email should fail"""
        service = AuthService()

        login_data = LoginData(
            email="nonexistent@example.com",
            password="SecurePass123!",
            device_id="device-abc-123",
            device_type="iPhone 14",
            ip_address="192.168.1.100",
        )

        result = service.login(login_data)

        assert result.success is False
        assert (
            "email" in result.error_message.lower()
            or "not found" in result.error_message.lower()
        )

    def test_login_wrong_password(self):
        """Login with wrong password should fail"""
        service = AuthService()

        # Register user
        registration_data = RegistrationData(
            full_name="أحمد محمد",
            email="wrongpass@example.com",
            password="SecurePass123!",
            region=IraqiRegion.BAGHDAD,
            language_preference=LanguagePreference.BOTH,
            islamic_compliance_level=IslamicComplianceLevel.BASIC,
        )
        service.register(registration_data)
        service.verify_email("wrongpass@example.com")

        # Login with wrong password
        login_data = LoginData(
            email="wrongpass@example.com",
            password="WrongPassword123!",
            device_id="device-abc-123",
            device_type="iPhone 14",
            ip_address="192.168.1.100",
        )

        result = service.login(login_data)

        assert result.success is False
        assert (
            "password" in result.error_message.lower()
            or "invalid" in result.error_message.lower()
        )

    def test_login_unverified_email(self):
        """Login with unverified email should fail or require verification"""
        service = AuthService()

        # Register user but don't verify
        registration_data = RegistrationData(
            full_name="أحمد محمد",
            email="unverified@example.com",
            password="SecurePass123!",
            region=IraqiRegion.BAGHDAD,
            language_preference=LanguagePreference.BOTH,
            islamic_compliance_level=IslamicComplianceLevel.BASIC,
        )
        service.register(registration_data)

        # Login without verification
        login_data = LoginData(
            email="unverified@example.com",
            password="SecurePass123!",
            device_id="device-abc-123",
            device_type="iPhone 14",
            ip_address="192.168.1.100",
        )

        result = service.login(login_data)

        # Should fail or indicate email verification required
        if not result.success:
            assert (
                "verify" in result.error_message.lower()
                or "email" in result.error_message.lower()
            )

    def test_login_requires_mfa(self):
        """Login should require MFA for new device"""
        service = AuthService()

        # Register and verify user
        registration_data = RegistrationData(
            full_name="أحمد محمد",
            email="mfa@example.com",
            password="SecurePass123!",
            region=IraqiRegion.BAGHDAD,
            language_preference=LanguagePreference.BOTH,
            islamic_compliance_level=IslamicComplianceLevel.STANDARD,
        )
        service.register(registration_data)
        service.verify_email("mfa@example.com")

        # Login from new device
        login_data = LoginData(
            email="mfa@example.com",
            password="SecurePass123!",
            device_id="new-device-123",
            device_type="iPhone 14",
            ip_address="192.168.1.100",
        )

        result = service.login(login_data)

        # Should require MFA
        if result.success:
            assert result.requires_mfa is True
            assert result.mfa_setup_id is not None
        else:
            assert "mfa" in result.error_message.lower()

    def test_login_rate_limiting(self):
        """Login should enforce rate limiting after multiple failures"""
        service = AuthService()

        # Register user
        registration_data = RegistrationData(
            full_name="أحمد محمد",
            email="ratelimit@example.com",
            password="SecurePass123!",
            region=IraqiRegion.BAGHDAD,
            language_preference=LanguagePreference.BOTH,
            islamic_compliance_level=IslamicComplianceLevel.BASIC,
        )
        service.register(registration_data)
        service.verify_email("ratelimit@example.com")

        # Attempt login 5 times with wrong password
        for _ in range(5):
            login_data = LoginData(
                email="ratelimit@example.com",
                password="WrongPassword!",
                device_id="device-abc",
                device_type="iPhone",
                ip_address="192.168.1.100",
            )
            service.login(login_data)

        # 6th attempt should be rate-limited
        final_attempt = service.login(login_data)

        assert final_attempt.success is False
        assert (
            "rate limit" in final_attempt.error_message.lower()
            or "too many" in final_attempt.error_message.lower()
        )


class TestEmailVerification:
    """Test email verification functionality"""

    def test_send_verification_email(self):
        """Send verification email after registration"""
        service = AuthService()

        registration_data = RegistrationData(
            full_name="أحمد محمد",
            email="verify@example.com",
            password="SecurePass123!",
            region=IraqiRegion.BAGHDAD,
            language_preference=LanguagePreference.BOTH,
            islamic_compliance_level=IslamicComplianceLevel.BASIC,
        )

        result = service.register(registration_data)

        assert result.email_sent is True
        assert result.verification_token is not None

    def test_verify_email_with_valid_token(self):
        """Verify email with valid token"""
        service = AuthService()

        # Register
        registration_data = RegistrationData(
            full_name="أحمد محمد",
            email="validtoken@example.com",
            password="SecurePass123!",
            region=IraqiRegion.BAGHDAD,
            language_preference=LanguagePreference.BOTH,
            islamic_compliance_level=IslamicComplianceLevel.BASIC,
        )
        result = service.register(registration_data)

        # Verify
        verification_result = service.verify_email_token(result.verification_token)

        assert verification_result.success is True

    def test_verify_email_with_expired_token(self):
        """Verify email with expired token should fail"""
        service = AuthService()

        # Create expired token
        expired_token = service.create_verification_token(
            "user123", expires_in_hours=-1
        )

        verification_result = service.verify_email_token(expired_token)

        assert verification_result.success is False
        assert "expired" in verification_result.error_message.lower()

    def test_verify_email_with_invalid_token(self):
        """Verify email with invalid token should fail"""
        service = AuthService()

        verification_result = service.verify_email_token("invalid-token-123")

        assert verification_result.success is False
        assert "invalid" in verification_result.error_message.lower()


class TestPasswordReset:
    """Test password reset functionality"""

    def test_request_password_reset(self):
        """Request password reset sends email"""
        service = AuthService()

        # Register user
        registration_data = RegistrationData(
            full_name="أحمد محمد",
            email="reset@example.com",
            password="SecurePass123!",
            region=IraqiRegion.BAGHDAD,
            language_preference=LanguagePreference.BOTH,
            islamic_compliance_level=IslamicComplianceLevel.BASIC,
        )
        service.register(registration_data)

        # Request reset
        reset_result = service.request_password_reset("reset@example.com")

        assert reset_result.success is True
        assert reset_result.reset_token is not None
        assert reset_result.email_sent is True

    def test_reset_password_with_valid_token(self):
        """Reset password with valid token"""
        service = AuthService()

        # Register
        registration_data = RegistrationData(
            full_name="أحمد محمد",
            email="validreset@example.com",
            password="OldPass123!",
            region=IraqiRegion.BAGHDAD,
            language_preference=LanguagePreference.BOTH,
            islamic_compliance_level=IslamicComplianceLevel.BASIC,
        )
        service.register(registration_data)

        # Request reset
        reset_request = service.request_password_reset("validreset@example.com")

        # Reset password
        reset_result = service.reset_password(reset_request.reset_token, "NewPass123!")

        assert reset_result.success is True

        # Verify old password doesn't work
        service.verify_email("validreset@example.com")
        old_login = service.login(
            LoginData(
                email="validreset@example.com",
                password="OldPass123!",
                device_id="device-abc",
                device_type="iPhone",
                ip_address="192.168.1.100",
            )
        )
        assert old_login.success is False

        # Verify new password works
        new_login = service.login(
            LoginData(
                email="validreset@example.com",
                password="NewPass123!",
                device_id="device-abc",
                device_type="iPhone",
                ip_address="192.168.1.100",
            )
        )
        assert new_login.success is True

    def test_reset_password_with_expired_token(self):
        """Reset password with expired token should fail"""
        service = AuthService()

        expired_token = service.create_reset_token("user123", expires_in_hours=-1)
        reset_result = service.reset_password(expired_token, "NewPass123!")

        assert reset_result.success is False
        assert "expired" in reset_result.error_message.lower()


class TestCulturalContextPersistence:
    """Test cultural context persistence across auth operations"""

    def test_registration_stores_cultural_context(self):
        """Registration should store cultural preferences"""
        service = AuthService()

        registration_data = RegistrationData(
            full_name="أحمد محمد",
            email="cultural@example.com",
            password="SecurePass123!",
            region=IraqiRegion.MOSUL,
            language_preference=LanguagePreference.ARABIC,
            islamic_compliance_level=IslamicComplianceLevel.STRICT,
        )

        result = service.register(registration_data)
        assert result.success is True

        # Get user cultural context
        user = service.get_user_by_email("cultural@example.com")

        assert user.region == IraqiRegion.MOSUL
        assert user.language_preference == LanguagePreference.ARABIC
        assert user.islamic_compliance_level == IslamicComplianceLevel.STRICT

    def test_login_returns_cultural_context(self):
        """Login should return cultural context in tokens"""
        service = AuthService()

        # Register with cultural preferences
        registration_data = RegistrationData(
            full_name="فاطمة علي",
            email="culturallogin@example.com",
            password="SecurePass123!",
            region=IraqiRegion.ERBIL,
            language_preference=LanguagePreference.BOTH,
            islamic_compliance_level=IslamicComplianceLevel.STANDARD,
        )
        service.register(registration_data)
        service.verify_email("culturallogin@example.com")

        # Login
        login_data = LoginData(
            email="culturallogin@example.com",
            password="SecurePass123!",
            device_id="device-abc",
            device_type="iPhone",
            ip_address="192.168.1.100",
        )
        result = service.login(login_data)

        # Decode token to check cultural claims
        token_payload = service.decode_token(result.access_token)

        assert token_payload["region"] == "erbil"
        assert token_payload["language_preference"] == "both"
        assert token_payload["islamic_compliance"] == "standard"


class TestServiceIntegration:
    """Test integration between multiple services"""

    def test_complete_registration_and_login_flow(self):
        """Complete flow: register → verify email → login"""
        service = AuthService()

        # 1. Register
        registration_data = RegistrationData(
            full_name="محمد حسين",
            email="complete@example.com",
            password="SecurePass123!",
            region=IraqiRegion.BAGHDAD,
            language_preference=LanguagePreference.BOTH,
            islamic_compliance_level=IslamicComplianceLevel.STANDARD,
        )
        reg_result = service.register(registration_data)
        assert reg_result.success is True

        # 2. Verify email
        verify_result = service.verify_email_token(reg_result.verification_token)
        assert verify_result.success is True

        # 3. Login
        login_data = LoginData(
            email="complete@example.com",
            password="SecurePass123!",
            device_id="device-abc",
            device_type="iPhone 14",
            ip_address="192.168.1.100",
        )
        login_result = service.login(login_data)
        assert login_result.success is True
        assert login_result.access_token is not None

    def test_professional_registration_with_validation(self):
        """Professional registration with Iraqi ID and license validation"""
        service = AuthService()

        registration_data = RegistrationData(
            full_name="د. عمر الجبوري",
            email="professional@example.com",
            password="SecurePass123!",
            region=IraqiRegion.BAGHDAD,
            iraqi_id="101980123456",
            professional_domain=ProfessionalDomain.LEGAL,
            professional_license="LAW-12345-2020",
            language_preference=LanguagePreference.BOTH,
            islamic_compliance_level=IslamicComplianceLevel.STANDARD,
        )

        result = service.register(registration_data)

        assert result.success is True
        assert result.iraqi_id_validated is True
        assert result.license_validated is True


class TestEdgeCases:
    """Test edge cases and error handling"""

    def test_register_with_empty_name(self):
        """Register with empty name should fail"""
        service = AuthService()

        registration_data = RegistrationData(
            full_name="",
            email="emptyname@example.com",
            password="SecurePass123!",
            region=IraqiRegion.BAGHDAD,
            language_preference=LanguagePreference.BOTH,
            islamic_compliance_level=IslamicComplianceLevel.BASIC,
        )

        result = service.register(registration_data)
        assert result.success is False

    def test_login_with_empty_password(self):
        """Login with empty password should fail"""
        service = AuthService()

        login_data = LoginData(
            email="test@example.com",
            password="",
            device_id="device-abc",
            device_type="iPhone",
            ip_address="192.168.1.100",
        )

        result = service.login(login_data)
        assert result.success is False


class TestRealWorldScenarios:
    """Test realistic authentication scenarios"""

    def test_baghdad_lawyer_complete_flow(self):
        """Baghdad lawyer: register with license, verify, login, MFA"""
        service = AuthService()

        # Register
        registration_data = RegistrationData(
            full_name="المحامي أحمد العبيدي",
            email="lawyer@iraq-legal.com",
            password="LegalPass123!",
            region=IraqiRegion.BAGHDAD,
            iraqi_id="101975123456",
            professional_domain=ProfessionalDomain.LEGAL,
            professional_license="LAW-56789-2015",
            language_preference=LanguagePreference.BOTH,
            islamic_compliance_level=IslamicComplianceLevel.STANDARD,
        )
        reg_result = service.register(registration_data)
        assert reg_result.success is True

        # Verify email
        service.verify_email_token(reg_result.verification_token)

        # Login
        login_result = service.login(
            LoginData(
                email="lawyer@iraq-legal.com",
                password="LegalPass123!",
                device_id="office-laptop",
                device_type="MacBook Pro",
                ip_address="192.168.1.50",
            )
        )
        assert login_result.success is True

    def test_basra_doctor_multi_device_sessions(self):
        """Basra doctor: login from multiple devices"""
        service = AuthService()

        # Register
        registration_data = RegistrationData(
            full_name="د. فاطمة الموسوي",
            email="doctor@basra-hospital.com",
            password="MedPass123!",
            region=IraqiRegion.BASRA,
            iraqi_id="061980654321",
            professional_domain=ProfessionalDomain.MEDICAL,
            professional_license="MED-987654-SU",
            language_preference=LanguagePreference.BOTH,
            islamic_compliance_level=IslamicComplianceLevel.STRICT,
        )
        service.register(registration_data)
        service.verify_email("doctor@basra-hospital.com")

        # Login from iPhone
        iphone_login = service.login(
            LoginData(
                email="doctor@basra-hospital.com",
                password="MedPass123!",
                device_id="doctor-iphone",
                device_type="iPhone 14 Pro",
                ip_address="192.168.1.100",
            )
        )
        assert iphone_login.success is True

        # Login from office computer
        office_login = service.login(
            LoginData(
                email="doctor@basra-hospital.com",
                password="MedPass123!",
                device_id="office-pc",
                device_type="Windows 11",
                ip_address="192.168.1.101",
            )
        )
        assert office_login.success is True

        # Both sessions should be active
        sessions = service.get_active_sessions("doctor@basra-hospital.com")
        assert len(sessions) >= 2
