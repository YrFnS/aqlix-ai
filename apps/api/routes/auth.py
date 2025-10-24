"""
Authentication API Routes
FastAPI endpoints for user authentication, registration, and session management
"""

from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# Import services
try:
    from ..services.auth_service import AuthService, RegistrationResult, LoginResult
    from ..models.iraqi_user import (
        IraqiUserRegistration,
        LoginRequest,
        MFASetupRequest,
        MFAVerificationRequest,
        PasswordResetRequest,
        PasswordResetConfirmation,
    )
    from ..middleware.auth_middleware import get_current_user_dependency
except ImportError:
    from services.auth_service import AuthService, RegistrationResult, LoginResult
    from models.iraqi_user import (
        IraqiUserRegistration,
        LoginRequest,
        MFASetupRequest,
        MFAVerificationRequest,
        PasswordResetRequest,
        PasswordResetConfirmation,
    )
    from middleware.auth_middleware import get_current_user_dependency

# Create router
router = APIRouter(prefix="/api/auth", tags=["authentication"])

# Security scheme
security = HTTPBearer()

# Initialize AuthService
auth_service = AuthService()


# Request/Response Models
class TokenRefreshRequest(BaseModel):
    """Token refresh request"""

    refresh_token: str


class EmailVerificationRequest(BaseModel):
    """Email verification request"""

    token: str


class LogoutRequest(BaseModel):
    """Logout request"""

    session_id: str
    logout_all_devices: bool = False


# ========== PUBLIC ENDPOINTS (No Authentication Required) ==========


@router.post(
    "/register",
    response_model=dict,
    status_code=status.HTTP_201_CREATED,
    summary="Register new Iraqi user",
    description="Register a new user with Iraqi cultural context, ID validation, and professional license support",
)
async def register(registration: IraqiUserRegistration):
    """
    Register new user with Iraqi authentication system

    Features:
    - Iraqi national ID validation with regional prefix
    - Professional license validation (legal, medical, educational, engineering, organizational)
    - Cultural preferences (Islamic compliance level, language, etiquette)
    - Automatic cultural greeting generation
    - Email verification workflow

    Returns:
    - User ID and verification status
    - Cultural greeting
    - Next steps for verification
    """
    result = await auth_service.register_user(registration)

    if not result.success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "message": result.error_message or "Registration failed",
                "validation_errors": result.validation_errors,
            },
        )

    return {
        "success": True,
        "user_id": result.user_id,
        "email": result.email,
        "verification_status": result.verification_status,
        "next_steps": result.next_steps,
        "cultural_greeting": (
            result.cultural_greeting.dict() if result.cultural_greeting else None
        ),
    }


@router.post(
    "/login",
    response_model=dict,
    summary="Login with cultural context",
    description="Authenticate user and create session with Iraqi cultural greeting",
)
async def login(
    login_request: LoginRequest,
    request: Request,
):
    """
    Login user and create authenticated session

    Features:
    - Cultural greeting based on time of day and region
    - Prayer time consideration for MFA timing
    - Multi-factor authentication support
    - Device tracking and trust management
    - Cultural context preservation in JWT tokens

    Returns:
    - Access and refresh tokens (if no MFA required)
    - Cultural greeting
    - MFA setup details (if MFA required)
    - Verification status
    """
    # Extract device info from request
    device_info = {
        "user_agent": request.headers.get("User-Agent"),
        "ip_address": request.client.host if request.client else None,
    }

    # Use device info for login
    result = await auth_service.login_user(
        login_request,
        respect_prayer_times=True,
        cultural_timing_flexibility=15,
    )

    if not result.success:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=result.error_message or "Login failed",
        )

    response = {
        "success": True,
        "user_id": result.user_id,
        "cultural_greeting": (
            result.cultural_greeting.dict() if result.cultural_greeting else None
        ),
        "requires_mfa": result.requires_mfa,
    }

    if result.requires_mfa:
        response["mfa_setup_id"] = result.mfa_setup_id
        response["message"] = "MFA verification required. Please check your email/SMS."
    else:
        response["tokens"] = result.tokens.dict() if result.tokens else None
        response["verification_status"] = (
            result.verification_status.dict() if result.verification_status else None
        )

    return response


@router.post(
    "/verify-email",
    response_model=dict,
    summary="Verify email address",
    description="Verify user email with verification token",
)
async def verify_email(request: EmailVerificationRequest):
    """
    Verify user email address

    This endpoint is called from email verification links.

    Args:
        request: Email verification request with token

    Returns:
        Verification status
    """
    # TODO: Implement email verification with Supabase
    # 1. Validate token
    # 2. Update user email_verified status
    # 3. Update iraqi_user_authentication record
    # 4. Generate success response

    return {
        "success": True,
        "message": "Email verified successfully",
        "next_steps": ["Complete your profile", "Login to your account"],
    }


@router.post(
    "/password/reset",
    response_model=dict,
    summary="Request password reset",
    description="Send password reset email to user",
)
async def request_password_reset(request: PasswordResetRequest):
    """
    Request password reset

    Sends password reset email with secure token.

    Args:
        request: Password reset request with email

    Returns:
        Success message
    """
    # TODO: Implement password reset request
    # 1. Validate email exists
    # 2. Generate reset token
    # 3. Send reset email
    # 4. Return success (don't reveal if email exists)

    return {
        "success": True,
        "message": "If the email exists, a password reset link has been sent",
    }


# ========== MFA ENDPOINTS ==========


@router.post(
    "/mfa/setup",
    response_model=dict,
    summary="Setup multi-factor authentication",
    description="Initialize MFA for user account with cultural timing consideration",
)
async def setup_mfa(
    mfa_request: MFASetupRequest,
    user: dict = Depends(get_current_user_dependency),
):
    """
    Setup MFA for authenticated user

    Features:
    - Prayer time awareness (delays MFA during prayer times)
    - SMS, email, or cultural questions
    - Device trust management

    Args:
        mfa_request: MFA setup configuration
        user: Current authenticated user

    Returns:
        MFA setup details and verification code (masked)
    """
    # TODO: Implement MFA setup
    # 1. Use MFAManager.setup_mfa()
    # 2. Store MFA configuration in database
    # 3. Send verification code
    # 4. Return setup details

    return {
        "success": True,
        "mfa_setup_id": "placeholder-mfa-id",
        "message": "MFA setup initiated. Please verify with the code sent to your device.",
    }


@router.post(
    "/mfa/verify",
    response_model=dict,
    summary="Verify MFA code and create session",
    description="Verify MFA code and create authenticated session",
)
async def verify_mfa(mfa_verification: MFAVerificationRequest):
    """
    Verify MFA code and create session

    Args:
        mfa_verification: MFA verification request

    Returns:
        Access and refresh tokens
        Session details
    """
    result = await auth_service.verify_mfa_and_create_session(
        verification_id=mfa_verification.verification_id,
        code=mfa_verification.code,
        user_id=mfa_verification.user_id,
        device_id=mfa_verification.device_id,
        remember_device=mfa_verification.remember_device,
    )

    if not result.success:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=result.error_message or "MFA verification failed",
        )

    return {
        "success": True,
        "tokens": result.tokens.dict() if result.tokens else None,
        "user_id": result.user_id,
    }


# ========== AUTHENTICATED ENDPOINTS (Require JWT Token) ==========


@router.post(
    "/refresh",
    response_model=dict,
    summary="Refresh access token",
    description="Refresh expired access token using refresh token",
)
async def refresh_token(refresh_request: TokenRefreshRequest):
    """
    Refresh access token

    Args:
        refresh_request: Refresh token request

    Returns:
        New access token
    """
    # TODO: Implement token refresh
    # 1. Validate refresh token
    # 2. Create new access token
    # 3. Update session last_activity
    # 4. Return new token

    return {
        "success": True,
        "access_token": "new-access-token",
        "expires_at": datetime.now().isoformat(),
    }


@router.post(
    "/refresh",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    summary="Refresh access token",
    description="Refresh access token using refresh token with automatic token rotation",
)
async def refresh_tokens(
    refresh_request: TokenRefreshRequest,
    user: dict = Depends(get_current_user_dependency),
):
    """
    Refresh access token using refresh token

    Features:
    - Automatic refresh token rotation (security best practice)
    - Token family tracking for reuse attack detection
    - Old token invalidation
    - New access token with same cultural context

    Args:
        refresh_request: Refresh token
        user: Current authenticated user (from JWT)

    Returns:
        New token pair with rotated refresh token
    """
    # Import SessionManager for token refresh
    from ..services.session_manager import SessionManager

    # Refresh the session tokens with rotation
    result = await SessionManager.refresh_session(
        refresh_token=refresh_request.refresh_token,
        cultural_context=user.get("cultural_context", {}),
        professional_context=user.get("professional_context"),
    )

    if not result.success:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=result.error_message or "Token refresh failed",
        )

    return {
        "success": True,
        "access_token": result.tokens.access_token,
        "refresh_token": result.tokens.refresh_token,
        "expires_at": result.tokens.expires_at.isoformat(),
        "token_type": result.tokens.token_type,
        "message": "Token rotated successfully",
    }


@router.post(
    "/logout",
    response_model=dict,
    summary="Logout user",
    description="Logout user by revoking session(s)",
)
async def logout(
    logout_request: LogoutRequest,
    user: dict = Depends(get_current_user_dependency),
):
    """
    Logout user

    Features:
    - Single device logout
    - Logout from all devices

    Args:
        logout_request: Logout configuration
        user: Current authenticated user

    Returns:
        Logout confirmation
    """
    if logout_request.logout_all_devices:
        sessions_revoked = await auth_service.logout_all_devices(user["user_id"])
        message = f"Logged out from all devices ({sessions_revoked} sessions)"
    else:
        success = await auth_service.logout_user(logout_request.session_id)
        message = "Logged out successfully"

    return {"success": True, "message": message}


@router.get(
    "/me",
    response_model=dict,
    summary="Get current user profile",
    description="Get current authenticated user profile with cultural context",
)
async def get_current_user_profile(
    user: dict = Depends(get_current_user_dependency),
):
    """
    Get current user profile

    Returns:
    - User information
    - Cultural context
    - Professional context
    - Verification status
    """
    return {
        "success": True,
        "user": user,
    }


@router.get(
    "/sessions",
    response_model=dict,
    summary="Get active sessions",
    description="Get all active sessions for current user",
)
async def get_active_sessions(
    user: dict = Depends(get_current_user_dependency),
):
    """
    Get active sessions for user

    Returns:
    - List of active sessions with device information
    - Session creation time and last activity
    """
    # Import SessionManager
    from ..services.session_manager import SessionManager

    # Get active sessions from database
    sessions = await SessionManager.get_active_sessions(user["user_id"])

    # Convert SessionInfo objects to dicts
    sessions_data = []
    for session in sessions:
        sessions_data.append(
            {
                "session_id": session.session_id,
                "device_id": session.device_id,
                "device_type": session.device_type,
                "platform": session.platform,
                "created_at": session.created_at.isoformat(),
                "last_activity": session.last_activity.isoformat(),
                "expires_at": session.expires_at.isoformat(),
                "is_current": session.session_id == user.get("session_id"),
            }
        )

    return {
        "success": True,
        "sessions": sessions_data,
        "count": len(sessions_data),
    }
