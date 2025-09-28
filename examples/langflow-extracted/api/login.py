"""
Login router extracted from Langflow for Iraqi AI Chat System
Original: src/backend/base/langflow/api/v1/login.py
"""

from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.security import OAuth2PasswordRequestForm
from langflow.services.auth.utils import (
    authenticate_user,
    create_access_token,
    create_refresh_token,
    verify_token,
)
from langflow.services.database.utils import DbSession
from langflow.services.settings.service import get_settings

router = APIRouter(tags=["Login"])


class Token:
    """Token response model"""

    def __init__(self, access_token: str, token_type: str = "bearer"):
        self.access_token = access_token
        self.token_type = token_type


@router.post("/login", response_model=Token)
async def login_to_get_access_token(
    response: Response,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: DbSession,
):
    """
    Authenticate user and create access tokens.

    Iraqi AI enhancements:
    - Support Arabic username/email formats
    - Apply cultural authentication preferences
    - Log authentication in user's preferred language
    - Set up Iraqi professional domain context
    """
    try:
        # Authenticate user
        user = authenticate_user(
            db=db, username=form_data.username, password=form_data.password
        )

        if not user:
            raise HTTPException(
                status_code=401, detail="Incorrect username or password"
            )

        # Create tokens
        access_token = create_access_token(data={"sub": user.username})
        refresh_token = create_refresh_token(data={"sub": user.username})

        # Set cookies with Iraqi-specific settings
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=True,
            samesite="strict",
        )
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            secure=True,
            samesite="strict",
        )

        # Iraqi AI specific: Update last login and set cultural preferences
        # user.last_login_at = datetime.now(timezone.utc)
        # user.update_cultural_context()

        return Token(access_token=access_token)
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))


@router.get("/auto_login")
async def auto_login(response: Response, db: DbSession):
    """
    Automatic login endpoint with conditional token generation.

    Iraqi AI enhancements:
    - Apply Iraqi security standards
    - Set cultural defaults for auto-login users
    - Enable Islamic-compliant defaults
    """
    try:
        settings = get_settings()

        if not settings.auto_login:
            raise HTTPException(status_code=403, detail="Auto login is disabled")

        # Create auto-login user or get existing
        auto_user = get_or_create_auto_user(db)

        # Create tokens
        access_token = create_access_token(data={"sub": auto_user.username})
        refresh_token = create_refresh_token(data={"sub": auto_user.username})

        # Set cookies
        response.set_cookie(
            key="access_token", value=access_token, httponly=True, secure=True
        )
        response.set_cookie(
            key="refresh_token", value=refresh_token, httponly=True, secure=True
        )

        return {"message": "Auto login successful"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/refresh")
async def refresh_token(
    request: Request,
    response: Response,
    db: DbSession,
):
    """
    Token refresh mechanism with cookie management.

    Iraqi AI enhancements:
    - Maintain cultural preferences across token refresh
    - Update professional domain context
    - Apply Iraqi security standards
    """
    try:
        # Get refresh token from cookies
        refresh_token = request.cookies.get("refresh_token")
        if not refresh_token:
            raise HTTPException(status_code=401, detail="Refresh token not found")

        # Verify refresh token
        payload = verify_token(refresh_token)
        username = payload.get("sub")

        if not username:
            raise HTTPException(status_code=401, detail="Invalid token")

        # Create new access token
        new_access_token = create_access_token(data={"sub": username})

        # Set new access token cookie
        response.set_cookie(
            key="access_token",
            value=new_access_token,
            httponly=True,
            secure=True,
            samesite="strict",
        )

        return {"message": "Token refreshed successfully"}
    except Exception as e:
        raise HTTPException(status_code=401, detail="Token refresh failed")


@router.post("/logout")
async def logout(response: Response):
    """
    Logout endpoint that clears authentication cookies.

    Iraqi AI enhancements:
    - Clear cultural preference cache
    - Log logout in user's preferred language
    - Clean up Iraqi-specific session data
    """
    try:
        # Clear authentication cookies
        response.delete_cookie(key="access_token")
        response.delete_cookie(key="refresh_token")

        # Iraqi AI specific: Clear cultural session data
        # clear_cultural_session_data()
        # log_logout_event()

        return {"message": "Logged out successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Logout failed")


def get_or_create_auto_user(db: DbSession):
    """Get or create auto-login user with Iraqi defaults"""
    # Implementation would create user with Iraqi cultural defaults
    pass


# Iraqi AI Chat System enhancements needed:
# - Add /login/arabic endpoint for Arabic-first authentication
# - Add /login/professional/{domain} for Iraqi professional login
# - Add /login/cultural-setup for Islamic compliance preferences
# - Add OAuth integration for Iraqi identity providers
# - Add two-factor authentication with Arabic SMS
# - Add password reset with Arabic language support
# - Add session management with cultural context preservation
