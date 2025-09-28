"""
Iraqi AI Chat System - Authentication Middleware
Enhanced authentication with Iraqi phone validation and cultural context
"""

import time
import jwt
import logging
from typing import Optional, Dict, Any
from fastapi import HTTPException, status, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext

from ..models.users import Users, UserModel, IraqiProfession
from ..middleware.cultural_validation import validate_iraqi_phone

# Configure logging
log = logging.getLogger(__name__)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = "your-secret-key-change-in-production"  # Should be from environment
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Security scheme
security = HTTPBearer()

####################
# Authentication Models
####################


class IraqiTokenData:
    """Enhanced token data with Iraqi user context"""

    def __init__(
        self,
        user_id: str,
        email: str,
        role: str,
        profession: IraqiProfession,
        dialect_preference: str,
        cultural_settings: Dict[str, Any] = None,
    ):
        self.user_id = user_id
        self.email = email
        self.role = role
        self.profession = profession
        self.dialect_preference = dialect_preference
        self.cultural_settings = cultural_settings or {}


####################
# Password Utilities
####################


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash password"""
    return pwd_context.hash(password)


####################
# JWT Token Utilities
####################


def create_access_token(user: UserModel, expires_delta: Optional[int] = None) -> str:
    """
    Create JWT access token with Iraqi user context
    """
    if expires_delta:
        expire = time.time() + expires_delta
    else:
        expire = time.time() + (ACCESS_TOKEN_EXPIRE_MINUTES * 60)

    # Enhanced payload with Iraqi user data
    to_encode = {
        "sub": user.id,
        "email": user.email,
        "role": user.role,
        "profession": user.profession.value,
        "dialect": user.dialect_preference.value,
        "subscription_tier": user.subscription_tier.value,
        "exp": expire,
        "iat": time.time(),
        "iss": "iraqi-ai-chat",  # Issuer
        "aud": "iraqi-users",  # Audience
        "cultural_context": {
            "islamic_compliance": user.cultural_settings.islamic_compliance_level
            if user.cultural_settings
            else "moderate",
            "regional_context": "baghdad",  # Default or from user preferences
            "sectarian_sensitivity": user.cultural_settings.sectarian_sensitivity
            if user.cultural_settings
            else "neutral",
        },
    }

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    log.info(
        f"Access token created for Iraqi user: {user.email} ({user.profession.value})"
    )
    return encoded_jwt


def verify_token(token: str) -> Optional[IraqiTokenData]:
    """
    Verify JWT token and extract Iraqi user data
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        # Check token expiration
        if payload.get("exp", 0) < time.time():
            log.warning("Token expired")
            return None

        # Verify issuer and audience for security
        if payload.get("iss") != "iraqi-ai-chat" or payload.get("aud") != "iraqi-users":
            log.warning("Invalid token issuer or audience")
            return None

        user_id = payload.get("sub")
        email = payload.get("email")
        role = payload.get("role")
        profession = payload.get("profession", "other")
        dialect = payload.get("dialect", "iraqi")
        cultural_context = payload.get("cultural_context", {})

        if not user_id or not email:
            log.warning("Invalid token payload")
            return None

        return IraqiTokenData(
            user_id=user_id,
            email=email,
            role=role,
            profession=IraqiProfession(profession),
            dialect_preference=dialect,
            cultural_settings=cultural_context,
        )

    except jwt.ExpiredSignatureError:
        log.warning("Token expired")
        return None
    except jwt.JWTError as e:
        log.warning(f"JWT decode error: {e}")
        return None


####################
# Authentication Dependencies
####################


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> UserModel:
    """
    Get current authenticated user
    """
    token = credentials.credentials
    token_data = verify_token(token)

    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="رمز الدخول غير صحيح",  # Invalid access token
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = Users.get_user_by_id(token_data.user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="المستخدم غير موجود",  # User not found
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Update last active time
    Users.update_user_last_active_by_id(user.id)

    return user


async def get_current_iraqi_user(
    user: UserModel = Depends(get_current_user),
) -> UserModel:
    """
    Get current Iraqi user with enhanced context
    """
    # Additional Iraqi-specific validations could be added here
    if not user.phone or not validate_iraqi_phone(user.phone):
        log.warning(f"User {user.id} has invalid Iraqi phone number")

    return user


async def get_verified_user(user: UserModel = Depends(get_current_user)) -> UserModel:
    """
    Get verified user (role: user, admin, or pending)
    """
    if user.role in ["pending", "user", "admin"]:
        return user

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="المستخدم غير مفعل",  # User not activated
    )


async def get_admin_user(user: UserModel = Depends(get_current_user)) -> UserModel:
    """
    Get admin user only
    """
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="يتطلب صلاحيات المدير",  # Requires admin privileges
        )

    return user


async def get_professional_user(
    required_profession: IraqiProfession, user: UserModel = Depends(get_current_user)
) -> UserModel:
    """
    Get user with specific professional qualification
    """
    if user.profession != required_profession:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"يتطلب تخصص {required_profession.value}",  # Requires [profession] specialization
        )

    return user


####################
# Iraqi Phone Authentication
####################


async def authenticate_with_iraqi_phone(
    phone: str, password: str
) -> Optional[UserModel]:
    """
    Authenticate user using Iraqi phone number
    """
    if not validate_iraqi_phone(phone):
        log.warning(f"Invalid Iraqi phone format: {phone}")
        return None

    user = Users.get_user_by_phone(phone)
    if not user:
        log.info(f"User not found for phone: {phone}")
        return None

    # Verify password (would need to integrate with password storage)
    # This is a placeholder - actual implementation would check against stored hash
    if verify_password(
        password, user.password_hash if hasattr(user, "password_hash") else ""
    ):
        log.info(f"Successful Iraqi phone authentication: {phone}")
        return user

    log.warning(f"Failed Iraqi phone authentication: {phone}")
    return None


####################
# Permission Checks
####################


def check_cultural_permission(
    user: UserModel, action: str, content_type: str = "general"
) -> bool:
    """
    Check if user has permission for culturally sensitive actions
    """
    if user.role == "admin":
        return True

    cultural_settings = user.cultural_settings
    if not cultural_settings:
        return True  # Default allow if no settings

    islamic_compliance = cultural_settings.islamic_compliance_level

    # Strict Islamic compliance restrictions
    if islamic_compliance == "strict":
        if action in ["create_religious_content", "modify_islamic_content"]:
            return user.profession in [IraqiProfession.TEACHER, IraqiProfession.OTHER]
        if content_type in ["sectarian", "political"]:
            return False

    # Professional context permissions
    if user.profession == IraqiProfession.LAWYER:
        return action not in ["medical_advice", "engineering_calculations"]
    elif user.profession == IraqiProfession.DOCTOR:
        return action not in ["legal_advice", "religious_fatwa"]
    elif user.profession == IraqiProfession.TEACHER:
        return True  # Teachers generally have broad permissions

    return True


def check_professional_access(
    user: UserModel, domain: str, resource_type: str = "content"
) -> bool:
    """
    Check professional domain access permissions
    """
    if user.role == "admin":
        return True

    # Professional domain mapping
    domain_permissions = {
        "legal": [IraqiProfession.LAWYER],
        "medical": [IraqiProfession.DOCTOR],
        "educational": [IraqiProfession.TEACHER],
        "engineering": [IraqiProfession.ENGINEER],
        "government": [IraqiProfession.GOVERNMENT],
        "business": [IraqiProfession.BUSINESSMAN, IraqiProfession.ENGINEER],
    }

    allowed_professions = domain_permissions.get(domain, [])
    if not allowed_professions:
        return True  # Open domain

    return user.profession in allowed_professions


####################
# Session Management
####################


class IraqiSessionManager:
    """Enhanced session management for Iraqi users"""

    @staticmethod
    def create_session_context(user: UserModel) -> Dict[str, Any]:
        """Create session context with Iraqi user data"""
        return {
            "user_id": user.id,
            "profession": user.profession.value,
            "dialect": user.dialect_preference.value,
            "cultural_settings": user.cultural_settings.model_dump()
            if user.cultural_settings
            else {},
            "regional_context": "baghdad",  # Could be derived from user preferences
            "session_start": time.time(),
            "last_activity": time.time(),
            "islamic_calendar_enabled": user.cultural_settings.arabic_calendar_preference
            if user.cultural_settings
            else False,
            "prayer_time_awareness": user.cultural_settings.prayer_reminders
            if user.cultural_settings
            else False,
        }

    @staticmethod
    def update_session_activity(session_context: Dict[str, Any]) -> Dict[str, Any]:
        """Update session activity timestamp"""
        session_context["last_activity"] = time.time()
        return session_context

    @staticmethod
    def is_session_valid(
        session_context: Dict[str, Any], timeout_hours: int = 24
    ) -> bool:
        """Check if session is still valid"""
        last_activity = session_context.get("last_activity", 0)
        timeout_seconds = timeout_hours * 3600
        return (time.time() - last_activity) < timeout_seconds


####################
# Authentication Middleware
####################


async def iraqi_auth_middleware(request: Request, call_next):
    """
    Iraqi authentication middleware for FastAPI
    """
    # Skip authentication for health checks and public endpoints
    if request.url.path in ["/health", "/docs", "/openapi.json"]:
        response = await call_next(request)
        return response

    # Extract token from Authorization header
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        # Public endpoints or will be handled by endpoint dependencies
        response = await call_next(request)
        return response

    token = auth_header.split(" ")[1]
    token_data = verify_token(token)

    if token_data:
        # Add Iraqi user context to request state
        request.state.iraqi_user_context = {
            "user_id": token_data.user_id,
            "profession": token_data.profession.value,
            "dialect": token_data.dialect_preference,
            "cultural_settings": token_data.cultural_settings,
            "role": token_data.role,
        }

        log.debug(f"Request authenticated for Iraqi user: {token_data.email}")

    response = await call_next(request)
    return response


####################
# Rate Limiting for Iraqi Users
####################


class IraqiRateLimiter:
    """Rate limiting with Iraqi business hours consideration"""

    def __init__(self):
        self.user_requests = {}  # In production, use Redis

    def is_business_hours(self) -> bool:
        """Check if it's Iraqi business hours (8 AM - 6 PM Baghdad time)"""
        import datetime
        import pytz

        baghdad_tz = pytz.timezone("Asia/Baghdad")
        current_time = datetime.datetime.now(baghdad_tz)
        hour = current_time.hour

        # Business hours: 8 AM to 6 PM
        return 8 <= hour <= 18

    def check_rate_limit(self, user_id: str, profession: IraqiProfession) -> bool:
        """Check rate limit with profession-based limits"""
        current_time = time.time()
        hour_window = 3600  # 1 hour

        # Different limits based on profession
        if profession in [IraqiProfession.DOCTOR, IraqiProfession.LAWYER]:
            max_requests = 200  # Higher for professionals
        elif profession == IraqiProfession.TEACHER:
            max_requests = 150
        else:
            max_requests = 100

        # Higher limits during business hours
        if self.is_business_hours():
            max_requests = int(max_requests * 1.5)

        user_requests = self.user_requests.get(user_id, [])

        # Remove old requests outside the window
        user_requests = [
            req_time
            for req_time in user_requests
            if current_time - req_time < hour_window
        ]

        if len(user_requests) >= max_requests:
            return False  # Rate limit exceeded

        # Add current request
        user_requests.append(current_time)
        self.user_requests[user_id] = user_requests

        return True


# Global rate limiter instance
iraqi_rate_limiter = IraqiRateLimiter()

####################
# Export
####################

__all__ = [
    "get_current_user",
    "get_current_iraqi_user",
    "get_verified_user",
    "get_admin_user",
    "get_professional_user",
    "create_access_token",
    "verify_token",
    "authenticate_with_iraqi_phone",
    "check_cultural_permission",
    "check_professional_access",
    "IraqiSessionManager",
    "iraqi_auth_middleware",
    "iraqi_rate_limiter",
]
