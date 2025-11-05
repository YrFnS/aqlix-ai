"""
Authentication API Routes
FastAPI endpoints for user authentication, registration, and session management
"""

from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timezone

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
    from ..database.client import SessionRepository
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
    from database.client import SessionRepository

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
        device_info=device_info,
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
    try:
        # Step 1: Verify token with Supabase Auth
        # The token is sent via email after registration
        # Supabase Auth stores and manages these tokens internally
        verify_response = auth_service.supabase.auth.verify_otp(
            {
                "token_hash": request.token,
                "type": "email",
            }
        )

        # Step 2: Check if verification was successful
        if not verify_response.user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "success": False,
                    "error_message": "Invalid or expired verification token",
                },
            )

        user_id = verify_response.user.id

        # Step 3: Update iraqi_user_authentication record
        # Update verification_status to "email_verified"
        update_response = (
            auth_service.supabase.table("iraqi_user_authentication")
            .update(
                {
                    "verification_status": "email_verified",
                    "email_verified": True,
                    "email_verified_at": datetime.now(timezone.utc).isoformat(),
                }
            )
            .eq("id", user_id)
            .execute()
        )

        if not update_response.data:
            # Log error but don't fail the request
            # Email is already verified in auth.users
            auth_service.logger.warning(
                f"Failed to update verification status for user {user_id} "
                "in iraqi_user_authentication"
            )

        # Step 4: Return success response
        return {
            "success": True,
            "message": "Email verified successfully",
            "next_steps": ["Complete your profile", "Login to your account"],
        }

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Handle unexpected errors
        auth_service.logger.error(f"Email verification error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "success": False,
                "error_message": (
                    "Email verification failed. "
                    "Please request a new verification email."
                ),
            },
        )


@router.post(
    "/password/reset",
    response_model=dict,
    summary="Request password reset",
    description="Send password reset email to user",
)
async def request_password_reset(reset_request: PasswordResetRequest):
    """
    Request password reset

    Sends password reset email with secure token.

    Args:
        reset_request: Password reset request with email

    Returns:
        Success message
    """
    try:
        # Step 1: Use Supabase Auth's built-in password reset
        # This sends an email with a recovery link/token
        reset_response = auth_service.supabase.auth.reset_password_for_email(
            reset_request.email,
            {
                "redirect_to": None,  # API-only flow, no redirect
            },
        )

        # Supabase always returns success even if email doesn't exist
        # This prevents email enumeration attacks

        # For testing purposes, we return a token
        # In production, the token would only be sent via email
        # Note: Supabase manages tokens internally, we cannot extract them
        # For tests to work, they must use the actual email token

        return {
            "success": True,
            "email_sent": True,
            "message": ("If the email exists, a password reset link has been sent"),
        }

    except Exception as e:
        # Log error but return success to prevent email enumeration
        auth_service.logger.error(f"Password reset request error: {str(e)}")

        # Always return success for security
        return {
            "success": True,
            "email_sent": True,
            "message": ("If the email exists, a password reset link has been sent"),
        }


@router.post(
    "/password/reset/confirm",
    response_model=dict,
    summary="Confirm password reset",
    description="Reset password using verification token",
)
async def confirm_password_reset(
    confirmation: PasswordResetConfirmation,
):
    """
    Confirm password reset with token

    Uses the token from password reset email to update the user's password.

    Args:
        confirmation: Password reset confirmation with token and new password

    Returns:
        Success status
    """
    try:
        # Step 1: Verify the reset token with Supabase
        # The token was sent via email in the reset request
        verify_response = auth_service.supabase.auth.verify_otp(
            {
                "token_hash": confirmation.token,
                "type": "recovery",
            }
        )

        if not verify_response.user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "success": False,
                    "error_message": "Invalid or expired reset token",
                },
            )

        # Step 2: Update the user's password
        # Supabase Auth handles password hashing internally
        update_response = auth_service.supabase.auth.update_user(
            {
                "password": confirmation.new_password,
            }
        )

        if not update_response.user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "success": False,
                    "error_message": "Failed to update password",
                },
            )

        # Step 3: Log the password change for security audit
        user_id = update_response.user.id
        auth_service.logger.info(
            f"Password reset completed for user {user_id}",
            extra={"event": "password_reset", "user_id": user_id},
        )

        return {
            "success": True,
            "message": "Password reset successfully",
        }

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Handle unexpected errors
        auth_service.logger.error(f"Password reset confirmation error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "success": False,
                "error_message": (
                    "Password reset failed. Please request a new reset link."
                ),
            },
        )


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
    try:
        # Step 1: Extract user ID from authenticated user
        user_id = user.get("id")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={
                    "success": False,
                    "error_message": "Invalid user authentication",
                },
            )

        # Step 2: Query active sessions from database
        # SessionRepository filters by user_id, status='active', and non-expired
        sessions_data = await SessionRepository.get_active_sessions(user_id)

        # Step 3: Format session data for response
        # Remove sensitive data like tokens
        formatted_sessions = []
        for session in sessions_data:
            formatted_sessions.append(
                {
                    "session_id": session.get("id"),
                    "device_id": session.get("device_id"),
                    "device_type": session.get("device_type"),
                    "platform": session.get("platform"),
                    "ip_address": session.get("ip_address"),
                    "user_agent": session.get("user_agent"),
                    "created_at": (
                        session.get("created_at").isoformat()
                        if session.get("created_at")
                        else None
                    ),
                    "last_activity": (
                        session.get("last_activity").isoformat()
                        if session.get("last_activity")
                        else None
                    ),
                    "expires_at": (
                        session.get("expires_at").isoformat()
                        if session.get("expires_at")
                        else None
                    ),
                    "login_method": session.get("login_method"),
                    "mfa_completed": session.get("mfa_completed"),
                    "language_used": session.get("language_used"),
                    "regional_context": session.get("regional_context"),
                }
            )

        return {
            "success": True,
            "sessions": formatted_sessions,
            "count": len(formatted_sessions),
        }

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Handle unexpected errors
        auth_service.logger.error(f"Get active sessions error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "success": False,
                "error_message": "Failed to retrieve sessions",
            },
        )
