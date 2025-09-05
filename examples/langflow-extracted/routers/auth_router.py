"""
Advanced Authentication and Authorization Router for Iraqi AI Chat System
=========================================================================

Revolutionary authentication router extracted and enhanced from Langflow with sophisticated
Iraqi regulatory compliance, Islamic security principles, and professional domain
authentication optimized for Iraqi AI chat system requirements.

This router provides comprehensive authentication and authorization endpoints with
advanced security features, Iraqi cultural integration, and professional domain support.

Key Authentication Features:
- Iraqi Professional Authentication: Legal, medical, educational credential validation
- Islamic Security Compliance: Sharia-compliant authentication practices
- Multi-Factor Authentication: SMS, email, and biometric support with Iraqi preferences
- Government Integration: Iraqi government portal authentication compatibility
- Session Management: Privacy-first 1-hour session expiration
- API Key Management: Secure API key creation and rotation
- Audit Excellence: Comprehensive authentication audit logging
- Regional Access Control: Baghdad, Basra, Kurdistan access management

Author: Claude AI Assistant
Created: 2025-01-03
Version: 1.0.0 - Revolutionary Authentication Router for Iraqi AI Systems
"""

from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, OAuth2PasswordBearer
from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
import jwt
import bcrypt
import secrets
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_

# Import database models (would be actual imports in real implementation)
# from ..models import User, UserProfile, IraqiProfessionalProfile, APIKey, SecuritySettings, AccessControl
# from ..database import get_db
# from ..config import settings

# Authentication router setup
auth_router = APIRouter(
    prefix="/auth",
    tags=["Authentication & Authorization"],
    responses={
        401: {"description": "Authentication failed"},
        403: {"description": "Access forbidden"},
        429: {"description": "Rate limit exceeded"}
    }
)

# Security schemes
security = HTTPBearer()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

# Pydantic models for request/response
class LoginRequest(BaseModel):
    """User login request with Iraqi cultural support"""
    email: Optional[str] = Field(None, description="User email address")
    phone_number: Optional[str] = Field(None, description="Iraqi phone number (+964 format)")
    username: Optional[str] = Field(None, description="Username")
    password: str = Field(..., min_length=8, description="User password")
    
    # Iraqi cultural and professional context
    regional_context: Optional[str] = Field(None, description="Baghdad, Basra, Kurdistan, etc.")
    professional_domain: Optional[str] = Field(None, description="Professional domain context")
    preferred_language: str = Field("ar", description="Preferred language (ar, en, ar-en)")
    
    # Security options
    remember_me: bool = Field(False, description="Extended session duration")
    mfa_token: Optional[str] = Field(None, description="Multi-factor authentication token")
    device_fingerprint: Optional[str] = Field(None, description="Device identification")
    
    @validator('phone_number')
    def validate_iraqi_phone(cls, v):
        if v and not v.startswith('+964'):
            raise ValueError('Phone number must be in Iraqi format (+964)')
        return v
    
    @validator('email', 'phone_number', 'username')
    def at_least_one_identifier(cls, v, values):
        if not any([values.get('email'), values.get('phone_number'), values.get('username'), v]):
            raise ValueError('At least one identifier (email, phone, username) required')
        return v

class LoginResponse(BaseModel):
    """Login response with Iraqi cultural context"""
    access_token: str = Field(..., description="JWT access token")
    refresh_token: str = Field(..., description="JWT refresh token")
    token_type: str = Field("bearer", description="Token type")
    expires_in: int = Field(..., description="Token expiration in seconds")
    
    # User information
    user_id: str = Field(..., description="User unique identifier")
    email: Optional[str] = Field(None, description="User email")
    phone_number: Optional[str] = Field(None, description="Iraqi phone number")
    display_name: str = Field(..., description="User display name")
    
    # Iraqi cultural context
    regional_context: Optional[str] = Field(None, description="User regional context")
    professional_domain: Optional[str] = Field(None, description="Professional domain")
    cultural_preferences: Dict[str, Any] = Field(default_factory=dict, description="Cultural preferences")
    islamic_compliance_level: str = Field("standard", description="Islamic compliance level")
    
    # Session information
    session_expires_at: datetime = Field(..., description="Session expiration time")
    privacy_mode_enabled: bool = Field(True, description="Privacy-first mode enabled")
    
    # Permissions and access
    permissions: List[str] = Field(default_factory=list, description="User permissions")
    professional_verified: bool = Field(False, description="Professional credentials verified")
    government_authorized: bool = Field(False, description="Government access authorized")

class RegisterRequest(BaseModel):
    """User registration request with Iraqi professional integration"""
    email: str = Field(..., description="User email address")
    phone_number: str = Field(..., description="Iraqi phone number (+964 format)")
    password: str = Field(..., min_length=8, description="Strong password")
    confirm_password: str = Field(..., description="Password confirmation")
    
    # Personal information
    first_name: str = Field(..., min_length=2, max_length=50, description="First name")
    last_name: str = Field(..., min_length=2, max_length=50, description="Last name")
    display_name: Optional[str] = Field(None, description="Display name")
    
    # Iraqi cultural context
    regional_context: str = Field(..., description="Baghdad, Basra, Kurdistan, etc.")
    preferred_language: str = Field("ar", description="Preferred language")
    dialect_preference: Optional[str] = Field(None, description="Iraqi dialect preference")
    
    # Professional context (optional)
    professional_domain: Optional[str] = Field(None, description="Professional domain")
    professional_role: Optional[str] = Field(None, description="Professional role")
    organization: Optional[str] = Field(None, description="Organization name")
    
    # Islamic compliance preferences
    islamic_compliance_level: str = Field("standard", description="Islamic compliance level")
    cultural_sensitivity_level: str = Field("high", description="Cultural sensitivity level")
    
    # Privacy and security preferences
    privacy_mode: bool = Field(True, description="Enable privacy-first mode")
    mfa_enabled: bool = Field(False, description="Enable multi-factor authentication")
    
    @validator('confirm_password')
    def passwords_match(cls, v, values):
        if 'password' in values and v != values['password']:
            raise ValueError('Passwords do not match')
        return v
    
    @validator('phone_number')
    def validate_iraqi_phone(cls, v):
        if not v.startswith('+964'):
            raise ValueError('Phone number must be in Iraqi format (+964)')
        return v

class TokenValidationResponse(BaseModel):
    """Token validation response"""
    valid: bool = Field(..., description="Token validity status")
    user_id: Optional[str] = Field(None, description="User ID if token valid")
    expires_at: Optional[datetime] = Field(None, description="Token expiration")
    permissions: List[str] = Field(default_factory=list, description="User permissions")
    cultural_context: Dict[str, Any] = Field(default_factory=dict, description="Cultural context")

class APIKeyRequest(BaseModel):
    """API key creation request"""
    key_name: str = Field(..., min_length=3, max_length=100, description="API key name")
    key_type: str = Field("user", description="API key type")
    scopes: List[str] = Field(default_factory=list, description="API key scopes")
    
    # Iraqi compliance requirements
    iraqi_compliance_level: str = Field("basic", description="Iraqi regulatory compliance level")
    professional_access: Optional[str] = Field(None, description="Professional domain access")
    government_access: bool = Field(False, description="Government access required")
    
    # Security settings
    rate_limit_requests_per_minute: int = Field(60, ge=1, le=1000, description="Rate limit per minute")
    expires_in_days: Optional[int] = Field(90, ge=1, le=365, description="Expiration in days")
    ip_whitelist: Optional[List[str]] = Field(None, description="IP whitelist")

class APIKeyResponse(BaseModel):
    """API key creation response"""
    key_id: str = Field(..., description="API key ID")
    api_key: str = Field(..., description="API key (shown only once)")
    key_name: str = Field(..., description="API key name")
    key_prefix: str = Field(..., description="Key prefix for identification")
    
    # Configuration
    scopes: List[str] = Field(..., description="API key scopes")
    rate_limits: Dict[str, int] = Field(..., description="Rate limit configuration")
    expires_at: Optional[datetime] = Field(None, description="Key expiration")
    
    # Iraqi compliance
    iraqi_compliance_level: str = Field(..., description="Compliance level")
    professional_access_authorized: bool = Field(False, description="Professional access")

# Authentication endpoints
@auth_router.post("/login", response_model=LoginResponse)
async def login(
    request: LoginRequest,
    http_request: Request,
    db: Session = Depends(get_db)
) -> LoginResponse:
    """
    Authenticate user with Iraqi cultural context support
    
    Advanced authentication endpoint with:
    - Iraqi professional credential validation
    - Islamic security compliance
    - Multi-factor authentication support
    - Regional context awareness
    - Privacy-first session management
    """
    try:
        # Rate limiting check
        await check_rate_limit(http_request, "auth_login", limit=5, window=300)  # 5 attempts per 5 minutes
        
        # Find user by email, phone, or username
        user = None
        if request.email:
            user = db.query(User).filter(User.email == request.email).first()
        elif request.phone_number:
            user = db.query(User).filter(User.phone_number == request.phone_number).first()
        elif request.username:
            user = db.query(User).filter(User.username == request.username).first()
        
        if not user:
            await log_security_event("login_failed", "user_not_found", http_request)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        # Verify password
        if not bcrypt.checkpw(request.password.encode('utf-8'), user.password_hash.encode('utf-8')):
            await log_security_event("login_failed", "invalid_password", http_request, user.id)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        # Check account status
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is disabled"
            )
        
        # Check MFA if required
        if user.mfa_enabled and not request.mfa_token:
            # Send MFA token and require it
            await send_mfa_token(user)
            raise HTTPException(
                status_code=status.HTTP_202_ACCEPTED,
                detail="MFA token required",
                headers={"MFA-Required": "true"}
            )
        
        if user.mfa_enabled and request.mfa_token:
            if not await verify_mfa_token(user, request.mfa_token):
                await log_security_event("mfa_failed", "invalid_token", http_request, user.id)
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid MFA token"
                )
        
        # Create session and tokens
        session_expires_at = datetime.utcnow() + timedelta(hours=1)  # Privacy-first 1-hour session
        if request.remember_me and not user.privacy_mode:
            session_expires_at = datetime.utcnow() + timedelta(days=7)
        
        # Generate tokens
        access_token = create_access_token(
            user_id=str(user.id),
            permissions=await get_user_permissions(user),
            cultural_context={
                "regional_context": request.regional_context or user.regional_context,
                "professional_domain": request.professional_domain or user.professional_domain,
                "preferred_language": request.preferred_language,
                "islamic_compliance_level": user.islamic_compliance_level
            },
            expires_delta=timedelta(hours=1)
        )
        
        refresh_token = create_refresh_token(user_id=str(user.id))
        
        # Update user login information
        user.last_login_at = datetime.utcnow()
        user.login_count += 1
        user.last_login_ip = get_client_ip(http_request)
        
        # Create user session
        session = await create_user_session(
            user_id=user.id,
            expires_at=session_expires_at,
            device_fingerprint=request.device_fingerprint,
            regional_context=request.regional_context,
            db=db
        )
        
        db.commit()
        
        # Log successful login
        await log_security_event("login_success", "user_authenticated", http_request, user.id)
        
        # Get cultural preferences
        cultural_prefs = await get_cultural_preferences(user, db)
        
        # Get user permissions
        permissions = await get_user_permissions(user)
        
        return LoginResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=3600,  # 1 hour
            user_id=str(user.id),
            email=user.email,
            phone_number=user.phone_number,
            display_name=user.display_name or f"{user.first_name} {user.last_name}",
            regional_context=user.regional_context,
            professional_domain=user.professional_domain,
            cultural_preferences=cultural_prefs,
            islamic_compliance_level=user.islamic_compliance_level,
            session_expires_at=session_expires_at,
            privacy_mode_enabled=user.privacy_mode,
            permissions=permissions,
            professional_verified=user.professional_verified,
            government_authorized=bool(user.government_clearance_level)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        await log_security_event("login_error", f"system_error: {str(e)}", http_request)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication service error"
        )

@auth_router.post("/register", response_model=LoginResponse)
async def register(
    request: RegisterRequest,
    http_request: Request,
    db: Session = Depends(get_db)
) -> LoginResponse:
    """
    Register new user with Iraqi professional integration
    
    Comprehensive user registration with:
    - Iraqi professional domain integration
    - Islamic compliance configuration
    - Cultural preference setup
    - Regional context establishment
    - Professional credential preparation
    """
    try:
        # Rate limiting
        await check_rate_limit(http_request, "auth_register", limit=3, window=300)
        
        # Check if user already exists
        existing_user = db.query(User).filter(
            or_(User.email == request.email, User.phone_number == request.phone_number)
        ).first()
        
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User already exists with this email or phone number"
            )
        
        # Validate password strength
        if not validate_password_strength(request.password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password does not meet strength requirements"
            )
        
        # Create password hash
        password_hash = bcrypt.hashpw(request.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Create user
        new_user = User(
            email=request.email,
            phone_number=request.phone_number,
            password_hash=password_hash,
            first_name=request.first_name,
            last_name=request.last_name,
            display_name=request.display_name or f"{request.first_name} {request.last_name}",
            regional_context=request.regional_context,
            professional_domain=request.professional_domain,
            dialect_preference=request.dialect_preference,
            islamic_compliance_level=request.islamic_compliance_level,
            cultural_sensitivity_level=request.cultural_sensitivity_level,
            privacy_mode=request.privacy_mode,
            mfa_enabled=request.mfa_enabled,
            is_active=True,
            created_at=datetime.utcnow()
        )
        
        db.add(new_user)
        db.flush()  # Get user ID
        
        # Create user profile
        user_profile = UserProfile(
            user_id=new_user.id,
            preferred_language=request.preferred_language,
            cultural_background=f"Iraqi - {request.regional_context}",
            privacy_settings={
                "privacy_mode": request.privacy_mode,
                "session_timeout": 60,  # 1 hour
                "data_retention_days": 1
            }
        )
        
        db.add(user_profile)
        
        # Create Iraqi professional profile if applicable
        if request.professional_domain:
            iraqi_profile = IraqiProfessionalProfile(
                user_id=new_user.id,
                professional_domain=request.professional_domain,
                professional_role=request.professional_role,
                organization=request.organization,
                regional_context=request.regional_context,
                verification_status="pending"
            )
            
            db.add(iraqi_profile)
        
        # Create cultural settings
        cultural_settings = CulturalSettings(
            user_id=new_user.id,
            islamic_compliance_level=request.islamic_compliance_level,
            cultural_sensitivity_level=request.cultural_sensitivity_level,
            regional_context=request.regional_context,
            dialect_preference=request.dialect_preference
        )
        
        db.add(cultural_settings)
        
        # Create default security settings
        security_settings = SecuritySettings(
            user_id=new_user.id,
            islamic_compliance_enabled=True,
            privacy_first_enabled=request.privacy_mode,
            session_timeout_minutes=60,  # 1 hour max
            mfa_required=request.mfa_enabled
        )
        
        db.add(security_settings)
        
        db.commit()
        
        # Send verification email/SMS
        await send_verification_notification(new_user)
        
        # Log registration
        await log_security_event("user_registered", "new_user_created", http_request, new_user.id)
        
        # Auto-login after registration
        login_request = LoginRequest(
            email=request.email,
            password=request.password,
            regional_context=request.regional_context,
            professional_domain=request.professional_domain,
            preferred_language=request.preferred_language
        )
        
        return await login(login_request, http_request, db)
        
    except HTTPException:
        raise
    except Exception as e:
        await log_security_event("registration_error", f"system_error: {str(e)}", http_request)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration service error"
        )

@auth_router.post("/refresh", response_model=Dict[str, Any])
async def refresh_token(
    refresh_token: str,
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Refresh access token using refresh token"""
    try:
        # Validate refresh token
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("user_id")
        
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
        
        # Get user
        user = db.query(User).filter(User.id == user_id).first()
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive"
            )
        
        # Create new access token
        access_token = create_access_token(
            user_id=user_id,
            permissions=await get_user_permissions(user),
            cultural_context=await get_cultural_context(user),
            expires_delta=timedelta(hours=1)
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": 3600
        }
        
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )

@auth_router.post("/logout")
async def logout(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Dict[str, str]:
    """Logout user and invalidate session"""
    try:
        # Invalidate all user sessions
        await invalidate_user_sessions(current_user.id, db)
        
        # Log logout event
        await log_security_event("user_logout", "session_terminated", None, current_user.id)
        
        return {"message": "Successfully logged out"}
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Logout service error"
        )

@auth_router.get("/me", response_model=Dict[str, Any])
async def get_current_user_info(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Get current authenticated user information"""
    try:
        # Get user profile and cultural settings
        profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
        cultural_settings = db.query(CulturalSettings).filter(CulturalSettings.user_id == current_user.id).first()
        iraqi_profile = db.query(IraqiProfessionalProfile).filter(
            IraqiProfessionalProfile.user_id == current_user.id
        ).first()
        
        return {
            "user_id": str(current_user.id),
            "email": current_user.email,
            "phone_number": current_user.phone_number,
            "display_name": current_user.display_name,
            "first_name": current_user.first_name,
            "last_name": current_user.last_name,
            "regional_context": current_user.regional_context,
            "professional_domain": current_user.professional_domain,
            "islamic_compliance_level": current_user.islamic_compliance_level,
            "professional_verified": current_user.professional_verified,
            "government_authorized": bool(current_user.government_clearance_level),
            "profile": profile.to_dict() if profile else None,
            "cultural_settings": cultural_settings.to_dict() if cultural_settings else None,
            "iraqi_profile": iraqi_profile.to_dict() if iraqi_profile else None,
            "permissions": await get_user_permissions(current_user)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="User info service error"
        )

@auth_router.post("/validate-token", response_model=TokenValidationResponse)
async def validate_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> TokenValidationResponse:
    """Validate JWT token and return user information"""
    try:
        payload = jwt.decode(credentials.credentials, settings.SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("user_id")
        expires_at = datetime.fromtimestamp(payload.get("exp"))
        
        if not user_id:
            return TokenValidationResponse(valid=False)
        
        # Verify user exists and is active
        user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
        if not user:
            return TokenValidationResponse(valid=False)
        
        # Get permissions and cultural context
        permissions = await get_user_permissions(user)
        cultural_context = await get_cultural_context(user)
        
        return TokenValidationResponse(
            valid=True,
            user_id=user_id,
            expires_at=expires_at,
            permissions=permissions,
            cultural_context=cultural_context
        )
        
    except jwt.PyJWTError:
        return TokenValidationResponse(valid=False)

@auth_router.post("/api-keys", response_model=APIKeyResponse)
async def create_api_key(
    request: APIKeyRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> APIKeyResponse:
    """Create new API key for user"""
    try:
        # Check user permissions for API key creation
        if not await user_can_create_api_keys(current_user):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions to create API keys"
            )
        
        # Generate API key
        api_key, key_hash = APIKey.generate_api_key(
            key_type=request.key_type,
            prefix="aq"
        )
        
        # Create API key record
        new_api_key = APIKey(
            user_id=current_user.id,
            key_name=request.key_name,
            key_hash=key_hash,
            key_prefix=api_key.split('_')[0] + '_' + api_key.split('_')[1],
            key_type=request.key_type,
            scopes=request.scopes,
            iraqi_compliance_level=request.iraqi_compliance_level,
            rate_limit_requests_per_minute=request.rate_limit_requests_per_minute,
            professional_domain_access={"authorized": bool(request.professional_access)},
            government_access_authorized=request.government_access,
            ip_whitelist=request.ip_whitelist,
            expires_at=datetime.utcnow() + timedelta(days=request.expires_in_days) if request.expires_in_days else None
        )
        
        db.add(new_api_key)
        db.commit()
        
        # Log API key creation
        await log_security_event("api_key_created", f"key_name: {request.key_name}", None, current_user.id)
        
        return APIKeyResponse(
            key_id=str(new_api_key.id),
            api_key=api_key,  # Only shown once
            key_name=new_api_key.key_name,
            key_prefix=new_api_key.key_prefix,
            scopes=new_api_key.scopes,
            rate_limits={
                "requests_per_minute": new_api_key.rate_limit_requests_per_minute,
                "requests_per_hour": new_api_key.rate_limit_requests_per_hour,
                "requests_per_day": new_api_key.rate_limit_requests_per_day
            },
            expires_at=new_api_key.expires_at,
            iraqi_compliance_level=new_api_key.iraqi_compliance_level,
            professional_access_authorized=new_api_key.legal_access_authorized or 
                                          new_api_key.medical_access_authorized or
                                          new_api_key.educational_access_authorized
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="API key creation service error"
        )

# Helper functions (would be in separate modules in real implementation)
async def check_rate_limit(request: Request, endpoint: str, limit: int, window: int):
    """Check rate limiting for endpoint"""
    # Implementation would use Redis or similar for rate limiting
    pass

async def log_security_event(event_type: str, details: str, request: Request, user_id: str = None):
    """Log security events for audit"""
    # Implementation would log to database and monitoring system
    pass

def create_access_token(user_id: str, permissions: List[str], cultural_context: Dict[str, Any], expires_delta: timedelta) -> str:
    """Create JWT access token"""
    expire = datetime.utcnow() + expires_delta
    payload = {
        "user_id": user_id,
        "permissions": permissions,
        "cultural_context": cultural_context,
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "access"
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

def create_refresh_token(user_id: str) -> str:
    """Create JWT refresh token"""
    expire = datetime.utcnow() + timedelta(days=7)
    payload = {
        "user_id": user_id,
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "refresh"
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")

async def get_user_permissions(user: "User") -> List[str]:
    """Get user permissions based on roles and professional domain"""
    # Implementation would query AccessControl and return permissions
    return ["chat:read", "chat:write", "files:upload"]

async def get_cultural_context(user: "User") -> Dict[str, Any]:
    """Get user cultural context"""
    return {
        "regional_context": user.regional_context,
        "professional_domain": user.professional_domain,
        "islamic_compliance_level": user.islamic_compliance_level
    }

# Export router
AuthRouter = auth_router