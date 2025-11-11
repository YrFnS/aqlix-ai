"""
Authentication Middleware for FastAPI
Handles JWT verification, cultural context extraction, rate limiting, and session validation
"""

from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional, Dict, Callable, Tuple
from datetime import datetime
import jwt
import os
from collections import defaultdict
from datetime import timedelta

try:
    from apps.api.services.session_manager import SessionManager
    from apps.api.services.cultural_context_manager import CulturalContextManager
except ImportError:
    from services.session_manager import SessionManager
    from services.cultural_context_manager import CulturalContextManager


# Security scheme for Bearer tokens
security = HTTPBearer()


class RateLimiter:
    """
    Simple in-memory rate limiter with cultural timing awareness
    In production, use Redis for distributed rate limiting
    """

    def __init__(
        self,
        max_requests: int = 100,
        window_seconds: int = 60,
        respect_prayer_times: bool = True,
    ):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.respect_prayer_times = respect_prayer_times
        self.requests: Dict[str, list] = defaultdict(list)

    def is_allowed(
        self, identifier: str, current_time: Optional[datetime] = None
    ) -> Tuple[bool, Optional[str]]:
        """
        Check if request is allowed based on rate limit

        Args:
            identifier: User ID, IP address, or other identifier
            current_time: Current time (defaults to now)

        Returns:
            Tuple of (is_allowed, reason_if_denied)
        """
        if current_time is None:
            current_time = datetime.now()

        # Check prayer time if enabled
        if self.respect_prayer_times:
            should_delay, delay_reason = CulturalContextManager.should_delay_mfa(
                respect_prayer_times=True
            )
            if should_delay:
                return False, delay_reason

        # Clean old requests
        cutoff_time = current_time - timedelta(seconds=self.window_seconds)
        self.requests[identifier] = [
            req_time for req_time in self.requests[identifier] if req_time > cutoff_time
        ]

        # Check rate limit
        if len(self.requests[identifier]) >= self.max_requests:
            return (
                False,
                f"Rate limit exceeded: {self.max_requests} requests per {self.window_seconds} seconds",
            )

        # Add current request
        self.requests[identifier].append(current_time)
        return True, None


# Global rate limiter instance (in production, use Redis)
rate_limiter = RateLimiter(max_requests=100, window_seconds=60)


async def verify_jwt_token(
    credentials: HTTPAuthorizationCredentials,
) -> Dict:
    """
    Verify JWT token and extract claims

    Args:
        credentials: HTTP Bearer credentials

    Returns:
        JWT payload with claims

    Raises:
        HTTPException: If token is invalid or expired
    """
    try:
        token = credentials.credentials

        # Validate token with SessionManager
        validation_result = SessionManager.validate_access_token(token)

        if not validation_result.is_valid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=validation_result.error_message
                or "Invalid authentication token",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Token is valid, return decoded payload from validation result
        # No need to decode again - validation already decoded and verified it
        return validation_result.payload

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = None,
) -> Dict:
    """
    Get current authenticated user from JWT token

    Args:
        credentials: HTTP Bearer credentials (injected by FastAPI Depends)

    Returns:
        User information dictionary with:
        - user_id: User ID
        - cultural_context: Cultural context metadata
        - professional_context: Professional context (if any)
        - session_id: Session ID

    Raises:
        HTTPException: If authentication fails
    """
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Verify token
    payload = await verify_jwt_token(credentials)

    # Extract user information
    user_info = {
        "user_id": payload.get("sub"),
        "session_id": payload.get("session_id"),
        "cultural_context": payload.get("cultural_context", {}),
        "professional_context": payload.get("professional_context"),
        "token_issued_at": datetime.fromtimestamp(
            payload.get("iat", 0), tz=timezone.utc
        ),
        "token_expires_at": datetime.fromtimestamp(
            payload.get("exp", 0), tz=timezone.utc
        ),
    }

    return user_info


async def extract_cultural_context(request: Request) -> Dict:
    """
    Extract cultural context from request (JWT or headers)

    Args:
        request: FastAPI request

    Returns:
        Cultural context dictionary (empty if not authenticated)
    """
    try:
        # Try to get from Authorization header
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]

            # Use SessionManager for proper token validation (SECURITY FIX)
            # This ensures consistent validation logic and proper error handling
            validation_result = SessionManager.validate_access_token(token)

            if validation_result.is_valid and validation_result.payload:
                return validation_result.payload.get("cultural_context", {})
    except Exception:
        pass

    # Return empty context if not authenticated
    return {}


class AuthMiddleware:
    """
    FastAPI Middleware for authentication, cultural context, and rate limiting

    Features:
    - JWT token verification
    - Cultural context extraction
    - Rate limiting with cultural timing
    - Device tracking
    - Suspicious activity detection
    - Session validation
    """

    def __init__(
        self,
        app,
        excluded_paths: Optional[list] = None,
        rate_limit_requests: int = 100,
        rate_limit_window: int = 60,
    ):
        """
        Initialize authentication middleware

        Args:
            app: FastAPI application instance
            excluded_paths: Paths to exclude from auth (e.g., ["/api/auth/login", "/api/auth/register"])
            rate_limit_requests: Max requests per window
            rate_limit_window: Time window in seconds
        """
        self.app = app
        self.excluded_paths = excluded_paths or [
            "/api/auth/register",
            "/api/auth/login",
            "/api/auth/verify-email",
            "/api/auth/password/reset",
            "/docs",
            "/openapi.json",
            "/health",
        ]
        self.rate_limiter = RateLimiter(
            max_requests=rate_limit_requests, window_seconds=rate_limit_window
        )

    async def __call__(self, request: Request, call_next):
        """
        Process request through middleware

        Args:
            request: FastAPI request
            call_next: Next middleware or route handler

        Returns:
            Response from route handler
        """
        # Skip excluded paths
        if any(request.url.path.startswith(path) for path in self.excluded_paths):
            return await call_next(request)

        # Extract identifier for rate limiting (IP or user ID)
        identifier = request.client.host if request.client else "unknown"

        try:
            # Try to get user ID from token for better rate limiting
            auth_header = request.headers.get("Authorization")
            if auth_header and auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]

                # Use SessionManager for proper token validation (SECURITY FIX)
                validation_result = SessionManager.validate_access_token(token)

                if validation_result.is_valid and validation_result.payload:
                    identifier = validation_result.payload.get("sub", identifier)
        except Exception:
            pass

        # Check rate limit
        is_allowed, deny_reason = self.rate_limiter.is_allowed(identifier)
        if not is_allowed:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=deny_reason
            )

        # Add cultural context to request state
        request.state.cultural_context = await extract_cultural_context(request)

        # Track device information
        request.state.device_info = {
            "user_agent": request.headers.get("User-Agent"),
            "ip_address": request.client.host if request.client else None,
            "timestamp": datetime.now(),
        }

        # TODO: Implement suspicious activity detection
        # - Check for unusual access patterns
        # - Check for access from new locations
        # - Check for rapid token changes

        # Process request
        response = await call_next(request)

        # Add cultural headers to response (optional)
        if request.state.cultural_context:
            response.headers["X-Cultural-Region"] = request.state.cultural_context.get(
                "region", ""
            )
            response.headers["X-Cultural-Language"] = (
                request.state.cultural_context.get("language_preference", "")
            )

        return response


# Helper function for FastAPI Depends
async def get_current_user_dependency(
    credentials: HTTPAuthorizationCredentials = None,
) -> Dict:
    """
    FastAPI dependency for getting current user

    Usage:
        from fastapi import Depends
        from api.middleware import get_current_user_dependency

        @app.get("/protected")
        async def protected_route(user: Dict = Depends(get_current_user_dependency)):
            return {"message": f"Hello {user['user_id']}"}
    """
    return await get_current_user(credentials)
