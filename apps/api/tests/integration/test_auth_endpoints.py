"""
Integration tests for Authentication API Endpoints
Tests complete auth flows with real database and API calls
"""

import pytest
from fastapi.testclient import TestClient
from datetime import datetime
from zoneinfo import ZoneInfo
from apps.api.main import app
from apps.api.models.iraqi_user import IraqiRegion, ProfessionalDomain
from apps.api.database import get_db


@pytest.fixture
def client():
    """Create test client for FastAPI app"""
    return TestClient(app)


@pytest.fixture
def db_session():
    """Create database session for tests"""
    db = next(get_db())
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def cleanup_test_users(db_session):
    """Cleanup test users after each test"""
    yield
    # Cleanup logic here - using parameterized query to prevent SQL injection
    from sqlalchemy import text

    db_session.execute(
        text("DELETE FROM iraqi_user_authentication WHERE email LIKE :email_pattern"),
        {"email_pattern": "%@test.example.com"},
    )
    db_session.commit()


class TestRegistrationEndpoint:
    """Test /api/auth/register endpoint"""

    def test_register_basic_user(self, client, cleanup_test_users):
        """POST /api/auth/register with basic user data"""
        response = client.post(
            "/api/auth/register",
            json={
                "full_name": "#-E/ E-E/ / Ahmed Mohammed",
                "email": "ahmed@test.example.com",
                "password": "SecurePass123!",
                "region": "baghdad",
                "language_preference": "both",
                "islamic_compliance_level": "basic",
            },
        )

        assert response.status_code == 201
        data = response.json()
        assert data["success"] is True
        assert data["user_id"] is not None
        assert data["email_sent"] is True
        assert "verification_token" in data

    def test_register_professional_user(self, client, cleanup_test_users):
        """POST /api/auth/register with professional credentials"""
        response = client.post(
            "/api/auth/register",
            json={
                "full_name": "/. A'7E) 9DJ / Dr. Fatima Ali",
                "email": "fatima@test.example.com",
                "password": "SecurePass123!",
                "region": "basra",
                "iraqi_id": "061985123456",
                "professional_domain": "medical",
                "professional_license": "MED-123456-BA",
                "language_preference": "both",
                "islamic_compliance_level": "standard",
            },
        )

        assert response.status_code == 201
        data = response.json()
        assert data["success"] is True
        assert data["iraqi_id_validated"] is True
        assert data["license_validated"] is True

    def test_register_duplicate_email(self, client, cleanup_test_users):
        """POST /api/auth/register with duplicate email should fail"""
        # First registration
        client.post(
            "/api/auth/register",
            json={
                "full_name": "Test User",
                "email": "duplicate@test.example.com",
                "password": "SecurePass123!",
                "region": "baghdad",
                "language_preference": "both",
                "islamic_compliance_level": "basic",
            },
        )

        # Second registration with same email
        response = client.post(
            "/api/auth/register",
            json={
                "full_name": "Test User 2",
                "email": "duplicate@test.example.com",
                "password": "SecurePass123!",
                "region": "baghdad",
                "language_preference": "both",
                "islamic_compliance_level": "basic",
            },
        )

        assert response.status_code == 400
        data = response.json()
        assert data["success"] is False
        assert "email" in data["error_message"].lower()

    def test_register_invalid_iraqi_id(self, client, cleanup_test_users):
        """POST /api/auth/register with invalid Iraqi ID format"""
        response = client.post(
            "/api/auth/register",
            json={
                "full_name": "Test User",
                "email": "invalidid@test.example.com",
                "password": "SecurePass123!",
                "region": "baghdad",
                "iraqi_id": "123",  # Invalid format
                "language_preference": "both",
                "islamic_compliance_level": "basic",
            },
        )

        assert response.status_code == 400
        data = response.json()
        assert data["success"] is False
        assert "iraqi id" in data["error_message"].lower()

    def test_register_weak_password(self, client, cleanup_test_users):
        """POST /api/auth/register with weak password"""
        response = client.post(
            "/api/auth/register",
            json={
                "full_name": "Test User",
                "email": "weakpass@test.example.com",
                "password": "weak",  # Too weak
                "region": "baghdad",
                "language_preference": "both",
                "islamic_compliance_level": "basic",
            },
        )

        assert response.status_code == 400
        data = response.json()
        assert data["success"] is False
        assert "password" in data["error_message"].lower()


class TestLoginEndpoint:
    """Test /api/auth/login endpoint"""

    @pytest.fixture
    def registered_user(self, client, cleanup_test_users):
        """Create and verify a test user"""
        # Register
        reg_response = client.post(
            "/api/auth/register",
            json={
                "full_name": "Login Test User",
                "email": "logintest@test.example.com",
                "password": "SecurePass123!",
                "region": "baghdad",
                "language_preference": "both",
                "islamic_compliance_level": "basic",
            },
        )
        token = reg_response.json()["verification_token"]

        # Verify email
        client.post("/api/auth/verify-email", json={"token": token})

        return {
            "email": "logintest@test.example.com",
            "password": "SecurePass123!",
        }

    def test_login_valid_credentials(self, client, registered_user):
        """POST /api/auth/login with valid credentials"""
        response = client.post(
            "/api/auth/login",
            json={
                "email": registered_user["email"],
                "password": registered_user["password"],
                "device_id": "test-device-123",
                "device_type": "Test Browser",
                "ip_address": "192.168.1.100",
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["access_token"] is not None
        assert data["refresh_token"] is not None
        assert data["user_id"] is not None

    def test_login_wrong_password(self, client, registered_user):
        """POST /api/auth/login with wrong password"""
        response = client.post(
            "/api/auth/login",
            json={
                "email": registered_user["email"],
                "password": "WrongPassword123!",
                "device_id": "test-device-123",
                "device_type": "Test Browser",
                "ip_address": "192.168.1.100",
            },
        )

        assert response.status_code == 401
        data = response.json()
        assert data["success"] is False
        assert "password" in data["error_message"].lower()

    def test_login_nonexistent_email(self, client):
        """POST /api/auth/login with non-existent email"""
        response = client.post(
            "/api/auth/login",
            json={
                "email": "nonexistent@test.example.com",
                "password": "SecurePass123!",
                "device_id": "test-device-123",
                "device_type": "Test Browser",
                "ip_address": "192.168.1.100",
            },
        )

        assert response.status_code == 404
        data = response.json()
        assert data["success"] is False
        assert "not found" in data["error_message"].lower()


class TestEmailVerificationEndpoint:
    """Test /api/auth/verify-email endpoint"""

    def test_verify_email_valid_token(self, client, cleanup_test_users):
        """POST /api/auth/verify-email with valid token"""
        # Register user
        reg_response = client.post(
            "/api/auth/register",
            json={
                "full_name": "Verify Test",
                "email": "verify@test.example.com",
                "password": "SecurePass123!",
                "region": "baghdad",
                "language_preference": "both",
                "islamic_compliance_level": "basic",
            },
        )
        token = reg_response.json()["verification_token"]

        # Verify email
        response = client.post("/api/auth/verify-email", json={"token": token})

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True

    def test_verify_email_invalid_token(self, client):
        """POST /api/auth/verify-email with invalid token"""
        response = client.post(
            "/api/auth/verify-email", json={"token": "invalid-token-123"}
        )

        assert response.status_code == 400
        data = response.json()
        assert data["success"] is False
        assert "invalid" in data["error_message"].lower()

    def test_verify_email_already_verified(self, client, cleanup_test_users):
        """POST /api/auth/verify-email with already verified email"""
        # Register and verify
        reg_response = client.post(
            "/api/auth/register",
            json={
                "full_name": "Double Verify Test",
                "email": "doubleverify@test.example.com",
                "password": "SecurePass123!",
                "region": "baghdad",
                "language_preference": "both",
                "islamic_compliance_level": "basic",
            },
        )
        token = reg_response.json()["verification_token"]
        client.post("/api/auth/verify-email", json={"token": token})

        # Try to verify again
        response = client.post("/api/auth/verify-email", json={"token": token})

        assert response.status_code == 400
        data = response.json()
        assert data["success"] is False


class TestMFAEndpoints:
    """Test MFA setup and verification endpoints"""

    @pytest.fixture
    def verified_user(self, client, cleanup_test_users):
        """Create verified user for MFA tests"""
        reg_response = client.post(
            "/api/auth/register",
            json={
                "full_name": "MFA Test User",
                "email": "mfatest@test.example.com",
                "password": "SecurePass123!",
                "region": "baghdad",
                "language_preference": "both",
                "islamic_compliance_level": "standard",
            },
        )
        token = reg_response.json()["verification_token"]
        client.post("/api/auth/verify-email", json={"token": token})

        # Login to get access token
        login_response = client.post(
            "/api/auth/login",
            json={
                "email": "mfatest@test.example.com",
                "password": "SecurePass123!",
                "device_id": "test-device",
                "device_type": "Test",
                "ip_address": "192.168.1.100",
            },
        )

        return {
            "email": "mfatest@test.example.com",
            "access_token": login_response.json()["access_token"],
        }

    def test_mfa_setup_sms(self, client, verified_user):
        """POST /api/auth/mfa/setup with SMS method"""
        response = client.post(
            "/api/auth/mfa/setup",
            json={
                "method": "sms",
                "destination": "+9647501234567",
            },
            headers={"Authorization": f"Bearer {verified_user['access_token']}"},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["method"] == "sms"
        assert data["setup_id"] is not None

    def test_mfa_setup_email(self, client, verified_user):
        """POST /api/auth/mfa/setup with email method"""
        response = client.post(
            "/api/auth/mfa/setup",
            json={
                "method": "email",
                "destination": verified_user["email"],
            },
            headers={"Authorization": f"Bearer {verified_user['access_token']}"},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["method"] == "email"

    def test_mfa_verify_valid_code(self, client, verified_user):
        """POST /api/auth/mfa/verify with valid code"""
        # Setup MFA
        setup_response = client.post(
            "/api/auth/mfa/setup",
            json={"method": "email", "destination": verified_user["email"]},
            headers={"Authorization": f"Bearer {verified_user['access_token']}"},
        )
        setup_id = setup_response.json()["setup_id"]

        # In real implementation, code would be sent to email
        # For testing, we'll use a mock code retrieval
        code = "123456"  # This would come from email in production

        response = client.post(
            "/api/auth/mfa/verify",
            json={"setup_id": setup_id, "code": code},
            headers={"Authorization": f"Bearer {verified_user['access_token']}"},
        )

        # Valid code should return 200 with success=True
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") is True

    def test_mfa_verify_invalid_code(self, client, verified_user):
        """POST /api/auth/mfa/verify with invalid code"""
        # Setup MFA first to get a valid setup_id
        setup_response = client.post(
            "/api/auth/mfa/setup",
            json={"method": "email", "destination": verified_user["email"]},
            headers={"Authorization": f"Bearer {verified_user['access_token']}"},
        )
        setup_id = setup_response.json()["setup_id"]

        # Use invalid code
        invalid_code = "000000"

        response = client.post(
            "/api/auth/mfa/verify",
            json={"setup_id": setup_id, "code": invalid_code},
            headers={"Authorization": f"Bearer {verified_user['access_token']}"},
        )

        # Invalid code should return 400
        assert response.status_code == 400


class TestPasswordResetEndpoints:
    """Test password reset endpoints"""

    @pytest.fixture
    def registered_user_for_reset(self, client, cleanup_test_users):
        """Create user for password reset tests"""
        reg_response = client.post(
            "/api/auth/register",
            json={
                "full_name": "Reset Test User",
                "email": "resettest@test.example.com",
                "password": "OldPass123!",
                "region": "baghdad",
                "language_preference": "both",
                "islamic_compliance_level": "basic",
            },
        )
        token = reg_response.json()["verification_token"]
        client.post("/api/auth/verify-email", json={"token": token})
        return "resettest@test.example.com"

    def test_request_password_reset(self, client, registered_user_for_reset):
        """POST /api/auth/password-reset/request"""
        response = client.post(
            "/api/auth/password-reset/request",
            json={"email": registered_user_for_reset},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["email_sent"] is True
        assert "reset_token" in data

    def test_reset_password_with_token(self, client, registered_user_for_reset):
        """POST /api/auth/password-reset/confirm with valid token"""
        # Request reset
        reset_request = client.post(
            "/api/auth/password-reset/request",
            json={"email": registered_user_for_reset},
        )
        reset_token = reset_request.json()["reset_token"]

        # Reset password
        response = client.post(
            "/api/auth/password-reset/confirm",
            json={"token": reset_token, "new_password": "NewPass123!"},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True

        # Verify old password doesn't work
        old_login = client.post(
            "/api/auth/login",
            json={
                "email": registered_user_for_reset,
                "password": "OldPass123!",
                "device_id": "test",
                "device_type": "Test",
                "ip_address": "192.168.1.100",
            },
        )
        assert old_login.status_code == 401

        # Verify new password works
        new_login = client.post(
            "/api/auth/login",
            json={
                "email": registered_user_for_reset,
                "password": "NewPass123!",
                "device_id": "test",
                "device_type": "Test",
                "ip_address": "192.168.1.100",
            },
        )
        assert new_login.status_code == 200


class TestSessionManagementEndpoints:
    """Test session management endpoints"""

    @pytest.fixture
    def authenticated_user(self, client, cleanup_test_users):
        """Create authenticated user with active session"""
        # Register and verify
        reg_response = client.post(
            "/api/auth/register",
            json={
                "full_name": "Session Test User",
                "email": "sessiontest@test.example.com",
                "password": "SecurePass123!",
                "region": "baghdad",
                "language_preference": "both",
                "islamic_compliance_level": "basic",
            },
        )
        token = reg_response.json()["verification_token"]
        client.post("/api/auth/verify-email", json={"token": token})

        # Login
        login_response = client.post(
            "/api/auth/login",
            json={
                "email": "sessiontest@test.example.com",
                "password": "SecurePass123!",
                "device_id": "session-device",
                "device_type": "Test Device",
                "ip_address": "192.168.1.100",
            },
        )

        return {
            "email": "sessiontest@test.example.com",
            "access_token": login_response.json()["access_token"],
            "refresh_token": login_response.json()["refresh_token"],
        }

    def test_get_active_sessions(self, client, authenticated_user):
        """GET /api/auth/sessions - get all active sessions"""
        response = client.get(
            "/api/auth/sessions",
            headers={"Authorization": f"Bearer {authenticated_user['access_token']}"},
        )

        assert response.status_code == 200
        data = response.json()
        assert "sessions" in data
        assert len(data["sessions"]) >= 1

    def test_refresh_token(self, client, authenticated_user):
        """POST /api/auth/refresh - refresh access token"""
        response = client.post(
            "/api/auth/refresh",
            json={"refresh_token": authenticated_user["refresh_token"]},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["access_token"] is not None
        assert data["refresh_token"] is not None

    def test_logout(self, client, authenticated_user):
        """POST /api/auth/logout - revoke current session"""
        response = client.post(
            "/api/auth/logout",
            headers={"Authorization": f"Bearer {authenticated_user['access_token']}"},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True

        # Verify session is revoked
        sessions_response = client.get(
            "/api/auth/sessions",
            headers={"Authorization": f"Bearer {authenticated_user['access_token']}"},
        )
        assert sessions_response.status_code == 401

    def test_logout_all_devices(self, client, authenticated_user):
        """POST /api/auth/logout/all - revoke all sessions"""
        # Create second session
        client.post(
            "/api/auth/login",
            json={
                "email": authenticated_user["email"],
                "password": "SecurePass123!",
                "device_id": "second-device",
                "device_type": "Test Device 2",
                "ip_address": "192.168.1.101",
            },
        )

        # Logout from all devices
        response = client.post(
            "/api/auth/logout/all",
            headers={"Authorization": f"Bearer {authenticated_user['access_token']}"},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["sessions_revoked"] >= 2


class TestCulturalContextIntegration:
    """Test cultural context persistence across auth flows"""

    def test_registration_with_cultural_context(self, client, cleanup_test_users):
        """Cultural preferences should persist through registration"""
        response = client.post(
            "/api/auth/register",
            json={
                "full_name": "E-E/ -3JF",
                "email": "cultural@test.example.com",
                "password": "SecurePass123!",
                "region": "mosul",
                "language_preference": "arabic",
                "islamic_compliance_level": "strict",
            },
        )

        assert response.status_code == 201
        data = response.json()
        assert data["cultural_context"]["region"] == "mosul"
        assert data["cultural_context"]["language_preference"] == "arabic"
        assert data["cultural_context"]["islamic_compliance_level"] == "strict"

    def test_login_returns_cultural_greeting(self, client, cleanup_test_users):
        """Login should return culturally appropriate greeting"""
        # Register with cultural preferences
        reg_response = client.post(
            "/api/auth/register",
            json={
                "full_name": "A'7E) 9DJ",
                "email": "greeting@test.example.com",
                "password": "SecurePass123!",
                "region": "baghdad",
                "language_preference": "both",
                "islamic_compliance_level": "standard",
            },
        )
        token = reg_response.json()["verification_token"]
        client.post("/api/auth/verify-email", json={"token": token})

        # Login
        response = client.post(
            "/api/auth/login",
            json={
                "email": "greeting@test.example.com",
                "password": "SecurePass123!",
                "device_id": "test-device",
                "device_type": "Test",
                "ip_address": "192.168.1.100",
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert "cultural_greeting" in data
        assert "'D3D'E 9DJCE" in data["cultural_greeting"]["primary_greeting"]
        assert data["cultural_greeting"]["regional_variation"] == "4DHFC"


class TestCompleteAuthFlows:
    """Test complete authentication workflows"""

    def test_complete_professional_registration_to_login(
        self, client, cleanup_test_users
    ):
        """Complete flow: register Iraqi professional → verify → login"""
        # 1. Register
        reg_response = client.post(
            "/api/auth/register",
            json={
                "full_name": "/. 9E1 'D,(H1J",
                "email": "complete@test.example.com",
                "password": "SecurePass123!",
                "region": "baghdad",
                "iraqi_id": "101980123456",
                "professional_domain": "legal",
                "professional_license": "LAW-12345-2020",
                "language_preference": "both",
                "islamic_compliance_level": "standard",
            },
        )
        assert reg_response.status_code == 201
        token = reg_response.json()["verification_token"]

        # 2. Verify email
        verify_response = client.post("/api/auth/verify-email", json={"token": token})
        assert verify_response.status_code == 200

        # 3. Login
        login_response = client.post(
            "/api/auth/login",
            json={
                "email": "complete@test.example.com",
                "password": "SecurePass123!",
                "device_id": "test-device",
                "device_type": "Test Browser",
                "ip_address": "192.168.1.100",
            },
        )
        assert login_response.status_code == 200
        assert login_response.json()["access_token"] is not None

    def test_multi_device_session_management(self, client, cleanup_test_users):
        """User logging in from multiple devices"""
        # Register and verify
        reg_response = client.post(
            "/api/auth/register",
            json={
                "full_name": "Multi Device User",
                "email": "multidevice@test.example.com",
                "password": "SecurePass123!",
                "region": "basra",
                "language_preference": "both",
                "islamic_compliance_level": "basic",
            },
        )
        token = reg_response.json()["verification_token"]
        client.post("/api/auth/verify-email", json={"token": token})

        # Login from device 1
        device1_response = client.post(
            "/api/auth/login",
            json={
                "email": "multidevice@test.example.com",
                "password": "SecurePass123!",
                "device_id": "device-1",
                "device_type": "iPhone",
                "ip_address": "192.168.1.100",
            },
        )
        assert device1_response.status_code == 200

        # Login from device 2
        device2_response = client.post(
            "/api/auth/login",
            json={
                "email": "multidevice@test.example.com",
                "password": "SecurePass123!",
                "device_id": "device-2",
                "device_type": "MacBook",
                "ip_address": "192.168.1.101",
            },
        )
        assert device2_response.status_code == 200

        # Check active sessions
        sessions_response = client.get(
            "/api/auth/sessions",
            headers={
                "Authorization": f"Bearer {device1_response.json()['access_token']}"
            },
        )
        assert sessions_response.status_code == 200
        assert len(sessions_response.json()["sessions"]) == 2
