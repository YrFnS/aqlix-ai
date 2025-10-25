"""
CSRF Protection Service
Implements CSRF token generation, validation, and double-submit cookie pattern
Ensures Iraqi regulatory compliance and secure state-changing request protection
"""

from datetime import datetime, timedelta
from typing import Optional, Dict, Tuple
from pydantic import BaseModel
import secrets
import hashlib
import hmac
from enum import Enum
import threading


class CSRFTokenStatus(str, Enum):
    """CSRF token validation status"""

    VALID = "valid"
    EXPIRED = "expired"
    INVALID = "invalid"
    MISSING = "missing"
    MISMATCH = "mismatch"


class CSRFTokenInfo(BaseModel):
    """CSRF token information"""

    token: str
    token_hash: str
    session_id: str
    created_at: datetime
    expires_at: datetime
    is_active: bool = True


class CSRFValidationResult(BaseModel):
    """Result of CSRF token validation"""

    is_valid: bool
    status: CSRFTokenStatus
    error_message: Optional[str] = None
    requires_regeneration: bool = False


class CSRFService:
    """
    CSRF Protection Service

    Implements comprehensive CSRF protection for state-changing requests:
    - Secure random token generation (cryptographically secure)
    - Double-submit cookie pattern
    - Token expiry management (configurable, default 1 hour)
    - Session-based token storage
    - Safe method exemption (GET, HEAD, OPTIONS)
    - Iraqi regulatory compliance

    Security Standards:
    - Uses secrets.token_urlsafe for cryptographically secure randomness
    - Implements HMAC-SHA256 for token integrity
    - Thread-safe repository with locking for concurrent access
    - OWASP CSRF prevention best practices
    """

    # CSRF token settings (configurable via environment)
    CSRF_TOKEN_LENGTH = 32  # 32 bytes = 256 bits
    CSRF_TOKEN_EXPIRY_MINUTES = 60  # 1 hour default
    CSRF_HEADER_NAME = "X-CSRF-Token"
    CSRF_COOKIE_NAME = "csrf_token"
    CSRF_FORM_FIELD_NAME = "csrf_token"

    # Safe HTTP methods that don't require CSRF protection
    SAFE_METHODS = {"GET", "HEAD", "OPTIONS"}

    # Secret key for HMAC (in production, load from environment)
    # This should be different from JWT secret for defense in depth
    CSRF_SECRET_KEY: Optional[str] = None

    @classmethod
    def initialize(cls, secret_key: str, token_expiry_minutes: int = 60):
        """
        Initialize CSRF service with configuration

        Args:
            secret_key: Secret key for HMAC token signing
            token_expiry_minutes: Token expiry in minutes
        """
        if not secret_key or len(secret_key) < 32:
            raise ValueError(
                "CSRF secret key must be at least 32 characters for security"
            )

        cls.CSRF_SECRET_KEY = secret_key
        cls.CSRF_TOKEN_EXPIRY_MINUTES = token_expiry_minutes

    @classmethod
    def generate_csrf_token(cls, session_id: str) -> CSRFTokenInfo:
        """
        Generate cryptographically secure CSRF token for session

        Args:
            session_id: Session ID to bind token to

        Returns:
            CSRFTokenInfo with token and metadata

        Security:
        - Uses secrets.token_urlsafe for secure random generation
        - Binds token to specific session
        - Creates HMAC hash for integrity verification
        """
        if not cls.CSRF_SECRET_KEY:
            raise RuntimeError("CSRF service not initialized. Call initialize() first.")

        # Generate cryptographically secure random token
        raw_token = secrets.token_urlsafe(cls.CSRF_TOKEN_LENGTH)

        # Create HMAC hash for integrity (bind to session)
        token_data = f"{session_id}:{raw_token}".encode("utf-8")
        token_hash = hmac.new(
            cls.CSRF_SECRET_KEY.encode("utf-8"), token_data, hashlib.sha256
        ).hexdigest()

        # Calculate expiry
        now = datetime.utcnow()
        expires_at = now + timedelta(minutes=cls.CSRF_TOKEN_EXPIRY_MINUTES)

        return CSRFTokenInfo(
            token=raw_token,
            token_hash=token_hash,
            session_id=session_id,
            created_at=now,
            expires_at=expires_at,
            is_active=True,
        )

    @classmethod
    def validate_csrf_token(
        cls,
        token: Optional[str],
        session_id: str,
        stored_token_info: Optional[CSRFTokenInfo] = None,
    ) -> CSRFValidationResult:
        """
        Validate CSRF token against session

        Args:
            token: CSRF token from request (header or form)
            session_id: Session ID from authenticated request
            stored_token_info: Stored token information from session

        Returns:
            CSRFValidationResult with validation status

        Security:
        - Validates token presence
        - Verifies token integrity via HMAC
        - Checks token expiry
        - Ensures token matches session
        """
        if not cls.CSRF_SECRET_KEY:
            raise RuntimeError("CSRF service not initialized. Call initialize() first.")

        # Check if token is provided
        if not token:
            return CSRFValidationResult(
                is_valid=False,
                status=CSRFTokenStatus.MISSING,
                error_message="CSRF token is required for state-changing requests",
                requires_regeneration=True,
            )

        # Check if stored token info exists
        if not stored_token_info:
            return CSRFValidationResult(
                is_valid=False,
                status=CSRFTokenStatus.INVALID,
                error_message="No CSRF token found in session",
                requires_regeneration=True,
            )

        # Verify token matches stored token
        if token != stored_token_info.token:
            return CSRFValidationResult(
                is_valid=False,
                status=CSRFTokenStatus.MISMATCH,
                error_message="CSRF token does not match session token",
                requires_regeneration=False,
            )

        # Check if token is expired
        if datetime.utcnow() > stored_token_info.expires_at:
            return CSRFValidationResult(
                is_valid=False,
                status=CSRFTokenStatus.EXPIRED,
                error_message="CSRF token has expired",
                requires_regeneration=True,
            )

        # Verify token integrity via HMAC
        token_data = f"{session_id}:{token}".encode("utf-8")
        expected_hash = hmac.new(
            cls.CSRF_SECRET_KEY.encode("utf-8"), token_data, hashlib.sha256
        ).hexdigest()

        if not hmac.compare_digest(expected_hash, stored_token_info.token_hash):
            return CSRFValidationResult(
                is_valid=False,
                status=CSRFTokenStatus.INVALID,
                error_message="CSRF token integrity check failed",
                requires_regeneration=True,
            )

        # Check if token is active
        if not stored_token_info.is_active:
            return CSRFValidationResult(
                is_valid=False,
                status=CSRFTokenStatus.INVALID,
                error_message="CSRF token has been revoked",
                requires_regeneration=True,
            )

        # Token is valid
        return CSRFValidationResult(
            is_valid=True,
            status=CSRFTokenStatus.VALID,
            requires_regeneration=False,
        )

    @classmethod
    def is_safe_method(cls, method: str) -> bool:
        """
        Check if HTTP method is safe (doesn't require CSRF protection)

        Args:
            method: HTTP method (GET, POST, PUT, DELETE, etc.)

        Returns:
            True if method is safe
        """
        return method.upper() in cls.SAFE_METHODS

    @classmethod
    def extract_csrf_token_from_request(
        cls, headers: Dict[str, str], form_data: Optional[Dict] = None
    ) -> Optional[str]:
        """
        Extract CSRF token from request headers or form data

        Priority:
        1. X-CSRF-Token header
        2. csrf_token form field

        Args:
            headers: Request headers dict
            form_data: Form data dict (optional)

        Returns:
            CSRF token or None
        """
        # Check header first (preferred for APIs)
        csrf_token = headers.get(cls.CSRF_HEADER_NAME) or headers.get(
            cls.CSRF_HEADER_NAME.lower()
        )

        if csrf_token:
            return csrf_token

        # Check form data (for traditional form submissions)
        if form_data and cls.CSRF_FORM_FIELD_NAME in form_data:
            return form_data[cls.CSRF_FORM_FIELD_NAME]

        return None

    @classmethod
    def create_double_submit_cookie_value(cls, token: str) -> str:
        """
        Create double-submit cookie value (hash of token)

        This implements the double-submit cookie pattern where:
        - Token is sent in header/form AND cookie
        - Cookie value is hash of token for additional security

        Args:
            token: CSRF token

        Returns:
            Hashed cookie value
        """
        if not cls.CSRF_SECRET_KEY:
            raise RuntimeError("CSRF service not initialized. Call initialize() first.")

        cookie_data = f"csrf:{token}".encode("utf-8")
        cookie_hash = hmac.new(
            cls.CSRF_SECRET_KEY.encode("utf-8"), cookie_data, hashlib.sha256
        ).hexdigest()

        return cookie_hash

    @classmethod
    def verify_double_submit_cookie(cls, token: str, cookie_value: str) -> bool:
        """
        Verify double-submit cookie matches token

        Args:
            token: CSRF token from header/form
            cookie_value: CSRF cookie value

        Returns:
            True if cookie matches token
        """
        if not cls.CSRF_SECRET_KEY:
            raise RuntimeError("CSRF service not initialized. Call initialize() first.")

        expected_cookie = cls.create_double_submit_cookie_value(token)
        return hmac.compare_digest(expected_cookie, cookie_value)

    @staticmethod
    def generate_csrf_meta_tags(csrf_token: str) -> Dict[str, str]:
        """
        Generate CSRF meta tags for HTML templates

        Usage in HTML:
        <meta name="csrf-token" content="{{ csrf_token }}">
        <meta name="csrf-header" content="X-CSRF-Token">

        Args:
            csrf_token: CSRF token

        Returns:
            Dict with meta tag names and values
        """
        return {
            "csrf-token": csrf_token,
            "csrf-header": CSRFService.CSRF_HEADER_NAME,
        }

    @staticmethod
    def should_check_csrf(
        method: str, path: str, excluded_paths: Optional[list] = None
    ) -> bool:
        """
        Determine if request should be checked for CSRF

        Args:
            method: HTTP method
            path: Request path
            excluded_paths: List of paths to exclude from CSRF check

        Returns:
            True if CSRF check should be performed
        """
        # Skip safe methods
        if CSRFService.is_safe_method(method):
            return False

        # Skip excluded paths (e.g., login, register)
        if excluded_paths:
            for excluded_path in excluded_paths:
                if path.startswith(excluded_path):
                    return False

        # All other state-changing requests require CSRF check
        return True


class CSRFTokenRepository:
    """
    Thread-safe repository for CSRF token storage and retrieval
    In-memory storage for development, database storage for production

    Thread Safety:
    - Uses threading.RLock for synchronization
    - All operations are atomic and race-free
    - Safe for concurrent access across multiple requests
    """

    # In-memory storage (for development/testing)
    _tokens: Dict[str, CSRFTokenInfo] = {}
    # Thread lock for synchronization
    _lock: threading.RLock = threading.RLock()

    @classmethod
    def store_token(cls, session_id: str, token_info: CSRFTokenInfo):
        """
        Store CSRF token for session (thread-safe)

        Args:
            session_id: Session ID
            token_info: CSRF token information
        """
        with cls._lock:
            cls._tokens[session_id] = token_info

    @classmethod
    def get_token(cls, session_id: str) -> Optional[CSRFTokenInfo]:
        """
        Retrieve CSRF token for session (thread-safe)

        Args:
            session_id: Session ID

        Returns:
            CSRFTokenInfo or None
        """
        with cls._lock:
            return cls._tokens.get(session_id)

    @classmethod
    def delete_token(cls, session_id: str) -> bool:
        """
        Delete CSRF token for session (thread-safe)

        Args:
            session_id: Session ID

        Returns:
            True if deleted
        """
        with cls._lock:
            if session_id in cls._tokens:
                del cls._tokens[session_id]
                return True
            return False

    @classmethod
    def cleanup_expired_tokens(cls) -> int:
        """
        Cleanup expired CSRF tokens (thread-safe)

        Returns:
            Number of tokens cleaned up
        """
        with cls._lock:
            now = datetime.utcnow()
            expired_sessions = [
                session_id
                for session_id, token_info in cls._tokens.items()
                if token_info.expires_at < now
            ]

            for session_id in expired_sessions:
                del cls._tokens[session_id]

            return len(expired_sessions)

    @classmethod
    def clear_all(cls):
        """Clear all tokens (thread-safe, for testing)"""
        with cls._lock:
            cls._tokens.clear()
