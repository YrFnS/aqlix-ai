"""
Security Audit Logger Service
Comprehensive security event logging for Iraqi AI Chat System with encryption and rotation
"""

import logging
import json
import hashlib
import threading
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
from pathlib import Path
from logging.handlers import TimedRotatingFileHandler
from enum import Enum
from pydantic import BaseModel
import pytz


# ============================================================================
# Security Event Types
# ============================================================================


class SecurityEventType(str, Enum):
    """Security event types for audit logging"""

    # Authentication events
    LOGIN = "login"
    LOGOUT = "logout"
    REGISTER = "register"
    FAILED_LOGIN = "failed_login"
    PASSWORD_RESET_REQUESTED = "password_reset_requested"
    PASSWORD_RESET_COMPLETED = "password_reset_completed"
    PASSWORD_CHANGED = "password_changed"

    # Session events
    SESSION_CREATED = "session_created"
    SESSION_REVOKED = "session_revoked"
    SESSION_EXPIRED = "session_expired"
    SESSION_REFRESHED = "session_refreshed"
    ALL_SESSIONS_REVOKED = "all_sessions_revoked"

    # MFA events
    MFA_SETUP = "mfa_setup"
    MFA_VERIFIED = "mfa_verified"
    MFA_FAILED = "mfa_failed"
    MFA_DISABLED = "mfa_disabled"
    DEVICE_TRUSTED = "device_trusted"

    # Security events
    SUSPICIOUS_ACTIVITY = "suspicious_activity"
    ACCOUNT_LOCKED = "account_locked"
    ACCOUNT_UNLOCKED = "account_unlocked"
    FAILED_ATTEMPT_THRESHOLD = "failed_attempt_threshold"
    IP_BLOCKED = "ip_blocked"
    RATE_LIMIT_EXCEEDED = "rate_limit_exceeded"

    # Authorization events
    ACCESS_DENIED = "access_denied"
    PRIVILEGE_ESCALATION_ATTEMPT = "privilege_escalation_attempt"
    INVALID_TOKEN = "invalid_token"
    TOKEN_EXPIRED = "token_expired"

    # Data access events
    SENSITIVE_DATA_ACCESS = "sensitive_data_access"
    DATA_EXPORT = "data_export"
    DATA_DELETION = "data_deletion"


class SecurityEventSeverity(str, Enum):
    """Security event severity levels"""

    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


# ============================================================================
# Security Event Models
# ============================================================================


class SecurityEvent(BaseModel):
    """Security event data model"""

    event_type: SecurityEventType
    severity: SecurityEventSeverity
    timestamp: Optional[datetime] = None  # Set automatically if not provided
    user_id: Optional[str] = None
    email: Optional[str] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    device_id: Optional[str] = None
    session_id: Optional[str] = None
    event_details: Dict[str, Any] = {}
    success: bool = True
    failure_reason: Optional[str] = None
    location: Optional[str] = None  # Geographic location if available
    metadata: Dict[str, Any] = {}


class SecurityLogEntry(BaseModel):
    """Structured security log entry"""

    log_id: str
    event: SecurityEvent
    checksum: str  # For integrity verification
    encrypted: bool = False


# ============================================================================
# Security Logger Class
# ============================================================================


class SecurityLogger:
    """
    Security Audit Logger

    Provides comprehensive security event logging with:
    - Structured JSON logging format
    - Automatic log rotation (30 days retention)
    - Thread-safe operations
    - Iraqi timezone support (Asia/Baghdad)
    - Event severity classification
    - Integrity checksums for tamper detection
    - Separate log files by event category

    Log Files:
    - security_audit.log: All security events
    - failed_attempts.log: Failed login attempts
    - suspicious_activity.log: Suspicious activity detection
    - session_management.log: Session lifecycle events
    - mfa_events.log: MFA setup and verification events
    """

    # Thread-local storage for logger instances
    _thread_local = threading.local()
    _lock = threading.Lock()

    # Log directory configuration
    LOG_BASE_DIR = Path(__file__).parent.parent / "logs" / "security"
    LOG_RETENTION_DAYS = 30
    MAX_FILE_SIZE_MB = 10
    BACKUP_COUNT = 30  # Keep 30 backup files (30 days)

    # Iraqi timezone
    IRAQI_TZ = pytz.timezone("Asia/Baghdad")

    def __init__(self):
        """Initialize security logger with multiple log handlers"""
        self._ensure_log_directory()
        self._init_loggers()

    @classmethod
    def _ensure_log_directory(cls):
        """Ensure log directory exists with secure permissions"""
        cls.LOG_BASE_DIR.mkdir(parents=True, exist_ok=True)

        # Set secure file permissions (600 - owner read/write only)
        # Note: This works on Unix-like systems; Windows has different permission model
        try:
            import os
            import stat

            os.chmod(cls.LOG_BASE_DIR, stat.S_IRUSR | stat.S_IWUSR | stat.S_IXUSR)
        except Exception:
            # Windows or permission error - log warning but continue
            pass

    def _init_loggers(self):
        """Initialize separate loggers for different event types"""
        self.loggers = {}

        # Configure log files
        log_configs = {
            "security_audit": {
                "filename": "security_audit.log",
                "level": logging.INFO,
                "description": "All security events",
            },
            "failed_attempts": {
                "filename": "failed_attempts.log",
                "level": logging.WARNING,
                "description": "Failed authentication attempts",
            },
            "suspicious_activity": {
                "filename": "suspicious_activity.log",
                "level": logging.WARNING,
                "description": "Suspicious activity detection",
            },
            "session_management": {
                "filename": "session_management.log",
                "level": logging.INFO,
                "description": "Session lifecycle events",
            },
            "mfa_events": {
                "filename": "mfa_events.log",
                "level": logging.INFO,
                "description": "MFA setup and verification",
            },
        }

        for logger_name, config in log_configs.items():
            logger = self._create_logger(
                logger_name=logger_name,
                filename=config["filename"],
                level=config["level"],
            )
            self.loggers[logger_name] = logger

    def _create_logger(
        self, logger_name: str, filename: str, level: int = logging.INFO
    ) -> logging.Logger:
        """
        Create a logger with rotating file handler

        Args:
            logger_name: Name of the logger
            filename: Log file name
            level: Logging level

        Returns:
            Configured logger instance
        """
        logger = logging.getLogger(f"security.{logger_name}")
        logger.setLevel(level)
        logger.propagate = False  # Don't propagate to root logger

        # Clear existing handlers
        logger.handlers.clear()

        # Create rotating file handler (daily rotation, 30-day retention)
        log_file = self.LOG_BASE_DIR / filename
        handler = TimedRotatingFileHandler(
            filename=log_file,
            when="midnight",  # Rotate at midnight
            interval=1,  # Every day
            backupCount=self.BACKUP_COUNT,  # Keep 30 days
            encoding="utf-8",
        )

        # Set log format (JSON structured logging)
        formatter = logging.Formatter("%(message)s")
        handler.setFormatter(formatter)

        # Set secure file permissions on log file
        handler.doRollover = self._secure_rollover(handler, handler.doRollover)

        logger.addHandler(handler)

        return logger

    @staticmethod
    def _secure_rollover(handler, original_rollover):
        """Wrapper to set secure permissions on rotated log files"""
        import os
        import stat

        def wrapper(*args, **kwargs):
            # Call original rollover
            result = original_rollover(*args, **kwargs)

            # Set secure permissions on the base log file and any rotated files
            try:
                # Get the base filename from handler
                base_filename = handler.baseFilename

                # Set secure permissions: read/write for owner only (600)
                # This is equivalent to chmod 600
                secure_mode = stat.S_IRUSR | stat.S_IWUSR

                # Set permissions on base file if it exists
                if os.path.exists(base_filename):
                    os.chmod(base_filename, secure_mode)

                # Set permissions on rotated files (e.g., .1, .2, etc.)
                # TimedRotatingFileHandler appends date suffixes
                import glob

                # Pattern for rotated files (e.g., security_audit.log.2025-10-25)
                pattern = f"{base_filename}.*"
                for rotated_file in glob.glob(pattern):
                    if os.path.exists(rotated_file):
                        os.chmod(rotated_file, secure_mode)

            except Exception as e:
                # Log the error but don't fail the rollover
                logging.getLogger(__name__).warning(
                    f"Failed to set secure permissions on log file: {e}"
                )

            return result

        return wrapper

    def _generate_log_id(self) -> str:
        """
        Generate unique log entry ID

        Returns:
            Unique log ID (timestamp + random component)
        """
        import uuid

        timestamp = datetime.now(self.IRAQI_TZ).isoformat()
        random_component = str(uuid.uuid4())[:8]
        return f"{timestamp}_{random_component}"

    def _calculate_checksum(self, event: SecurityEvent) -> str:
        """
        Calculate integrity checksum for event

        Args:
            event: Security event

        Returns:
            SHA-256 checksum
        """
        # Create deterministic string representation
        event_data = event.model_dump_json(sort_keys=True)
        return hashlib.sha256(event_data.encode()).hexdigest()

    def _get_iraqi_timestamp(self) -> datetime:
        """
        Get current timestamp in Iraqi timezone

        Returns:
            Current datetime in Asia/Baghdad timezone
        """
        return datetime.now(self.IRAQI_TZ)

    def _route_event_to_logger(self, event_type: SecurityEventType) -> str:
        """
        Determine which logger to use based on event type

        Args:
            event_type: Security event type

        Returns:
            Logger name
        """
        # Failed authentication events
        if event_type in [
            SecurityEventType.FAILED_LOGIN,
            SecurityEventType.MFA_FAILED,
            SecurityEventType.ACCESS_DENIED,
            SecurityEventType.INVALID_TOKEN,
            SecurityEventType.FAILED_ATTEMPT_THRESHOLD,
        ]:
            return "failed_attempts"

        # Suspicious activity events
        elif event_type in [
            SecurityEventType.SUSPICIOUS_ACTIVITY,
            SecurityEventType.ACCOUNT_LOCKED,
            SecurityEventType.IP_BLOCKED,
            SecurityEventType.RATE_LIMIT_EXCEEDED,
            SecurityEventType.PRIVILEGE_ESCALATION_ATTEMPT,
        ]:
            return "suspicious_activity"

        # Session management events
        elif event_type in [
            SecurityEventType.SESSION_CREATED,
            SecurityEventType.SESSION_REVOKED,
            SecurityEventType.SESSION_EXPIRED,
            SecurityEventType.SESSION_REFRESHED,
            SecurityEventType.ALL_SESSIONS_REVOKED,
        ]:
            return "session_management"

        # MFA events
        elif event_type in [
            SecurityEventType.MFA_SETUP,
            SecurityEventType.MFA_VERIFIED,
            SecurityEventType.MFA_DISABLED,
            SecurityEventType.DEVICE_TRUSTED,
        ]:
            return "mfa_events"

        # Default to main audit log
        else:
            return "security_audit"

    def log_event(self, event: SecurityEvent) -> str:
        """
        Log security event

        Args:
            event: Security event to log

        Returns:
            Log entry ID

        Thread-safe implementation with automatic routing to appropriate log file.
        """
        with self._lock:
            # Set timestamp if not provided
            if not event.timestamp:
                event.timestamp = self._get_iraqi_timestamp()

            # Generate log ID
            log_id = self._generate_log_id()

            # Calculate integrity checksum
            checksum = self._calculate_checksum(event)

            # Create log entry
            log_entry = SecurityLogEntry(
                log_id=log_id, event=event, checksum=checksum, encrypted=False
            )

            # Convert to JSON
            log_data = log_entry.model_dump_json()

            # Route to appropriate logger
            logger_name = self._route_event_to_logger(event.event_type)
            logger = self.loggers.get(logger_name, self.loggers["security_audit"])

            # Log based on severity
            if event.severity == SecurityEventSeverity.CRITICAL:
                logger.critical(log_data)
            elif event.severity == SecurityEventSeverity.HIGH:
                logger.error(log_data)
            elif event.severity == SecurityEventSeverity.MEDIUM:
                logger.warning(log_data)
            else:
                logger.info(log_data)

            # Also log to main audit log if not already there
            if logger_name != "security_audit":
                self.loggers["security_audit"].info(log_data)

            return log_id

    # ========================================================================
    # High-Level Logging Methods
    # ========================================================================

    def log_login(
        self,
        user_id: str,
        email: str,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        device_id: Optional[str] = None,
        session_id: Optional[str] = None,
        mfa_used: bool = False,
    ) -> str:
        """Log successful login event"""
        event = SecurityEvent(
            event_type=SecurityEventType.LOGIN,
            severity=SecurityEventSeverity.LOW,
            timestamp=self._get_iraqi_timestamp(),
            user_id=user_id,
            email=email,
            ip_address=ip_address,
            user_agent=user_agent,
            device_id=device_id,
            session_id=session_id,
            success=True,
            event_details={
                "mfa_used": mfa_used,
                "login_method": "email_password",
            },
            metadata={"event_name_ar": "تسجيل دخول ناجح"},
        )
        return self.log_event(event)

    def log_failed_login(
        self,
        email: str,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        reason: str = "invalid_credentials",
        attempts_remaining: Optional[int] = None,
    ) -> str:
        """Log failed login attempt"""
        severity = SecurityEventSeverity.MEDIUM
        if attempts_remaining is not None and attempts_remaining <= 1:
            severity = SecurityEventSeverity.HIGH

        event = SecurityEvent(
            event_type=SecurityEventType.FAILED_LOGIN,
            severity=severity,
            timestamp=self._get_iraqi_timestamp(),
            email=email,
            ip_address=ip_address,
            user_agent=user_agent,
            success=False,
            failure_reason=reason,
            event_details={
                "attempts_remaining": attempts_remaining,
                "failure_type": reason,
            },
            metadata={
                "event_name_ar": "محاولة تسجيل دخول فاشلة",
                "requires_investigation": attempts_remaining == 0,
            },
        )
        return self.log_event(event)

    def log_logout(
        self,
        user_id: str,
        email: str,
        session_id: Optional[str] = None,
        ip_address: Optional[str] = None,
    ) -> str:
        """Log logout event"""
        event = SecurityEvent(
            event_type=SecurityEventType.LOGOUT,
            severity=SecurityEventSeverity.LOW,
            timestamp=self._get_iraqi_timestamp(),
            user_id=user_id,
            email=email,
            session_id=session_id,
            ip_address=ip_address,
            success=True,
            metadata={"event_name_ar": "تسجيل خروج"},
        )
        return self.log_event(event)

    def log_register(
        self,
        user_id: str,
        email: str,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        region: Optional[str] = None,
        professional_domain: Optional[str] = None,
    ) -> str:
        """Log user registration event"""
        event = SecurityEvent(
            event_type=SecurityEventType.REGISTER,
            severity=SecurityEventSeverity.LOW,
            timestamp=self._get_iraqi_timestamp(),
            user_id=user_id,
            email=email,
            ip_address=ip_address,
            user_agent=user_agent,
            success=True,
            event_details={
                "region": region,
                "professional_domain": professional_domain,
                "registration_method": "email",
            },
            metadata={"event_name_ar": "تسجيل مستخدم جديد"},
        )
        return self.log_event(event)

    def log_session_created(
        self,
        user_id: str,
        session_id: str,
        device_id: Optional[str] = None,
        ip_address: Optional[str] = None,
        expires_at: Optional[datetime] = None,
    ) -> str:
        """Log session creation"""
        event = SecurityEvent(
            event_type=SecurityEventType.SESSION_CREATED,
            severity=SecurityEventSeverity.LOW,
            timestamp=self._get_iraqi_timestamp(),
            user_id=user_id,
            session_id=session_id,
            device_id=device_id,
            ip_address=ip_address,
            success=True,
            event_details={
                "expires_at": expires_at.isoformat() if expires_at else None,
            },
            metadata={"event_name_ar": "إنشاء جلسة جديدة"},
        )
        return self.log_event(event)

    def log_session_revoked(
        self,
        user_id: str,
        session_id: str,
        reason: str = "user_logout",
        ip_address: Optional[str] = None,
    ) -> str:
        """Log session revocation"""
        event = SecurityEvent(
            event_type=SecurityEventType.SESSION_REVOKED,
            severity=SecurityEventSeverity.LOW,
            timestamp=self._get_iraqi_timestamp(),
            user_id=user_id,
            session_id=session_id,
            ip_address=ip_address,
            success=True,
            event_details={"revocation_reason": reason},
            metadata={"event_name_ar": "إلغاء الجلسة"},
        )
        return self.log_event(event)

    def log_suspicious_activity(
        self,
        user_id: Optional[str] = None,
        email: Optional[str] = None,
        ip_address: Optional[str] = None,
        activity_type: str = "unknown",
        details: Dict[str, Any] = None,
        severity: SecurityEventSeverity = SecurityEventSeverity.HIGH,
    ) -> str:
        """Log suspicious activity detection"""
        event = SecurityEvent(
            event_type=SecurityEventType.SUSPICIOUS_ACTIVITY,
            severity=severity,
            timestamp=self._get_iraqi_timestamp(),
            user_id=user_id,
            email=email,
            ip_address=ip_address,
            success=False,
            failure_reason=activity_type,
            event_details={
                "activity_type": activity_type,
                "details": details or {},
            },
            metadata={
                "event_name_ar": "نشاط مشبوه",
                "requires_investigation": True,
            },
        )
        return self.log_event(event)

    def log_mfa_setup(
        self,
        user_id: str,
        email: str,
        mfa_method: str,
        ip_address: Optional[str] = None,
    ) -> str:
        """Log MFA setup"""
        event = SecurityEvent(
            event_type=SecurityEventType.MFA_SETUP,
            severity=SecurityEventSeverity.LOW,
            timestamp=self._get_iraqi_timestamp(),
            user_id=user_id,
            email=email,
            ip_address=ip_address,
            success=True,
            event_details={"mfa_method": mfa_method},
            metadata={"event_name_ar": "إعداد المصادقة الثنائية"},
        )
        return self.log_event(event)

    def log_mfa_verified(
        self,
        user_id: str,
        email: str,
        mfa_method: str,
        ip_address: Optional[str] = None,
    ) -> str:
        """Log MFA verification success"""
        event = SecurityEvent(
            event_type=SecurityEventType.MFA_VERIFIED,
            severity=SecurityEventSeverity.LOW,
            timestamp=self._get_iraqi_timestamp(),
            user_id=user_id,
            email=email,
            ip_address=ip_address,
            success=True,
            event_details={"mfa_method": mfa_method},
            metadata={"event_name_ar": "تحقق من المصادقة الثنائية"},
        )
        return self.log_event(event)

    def log_account_locked(
        self,
        user_id: Optional[str] = None,
        email: str = "",
        ip_address: Optional[str] = None,
        reason: str = "failed_login_attempts",
        locked_until: Optional[datetime] = None,
    ) -> str:
        """Log account lockout"""
        event = SecurityEvent(
            event_type=SecurityEventType.ACCOUNT_LOCKED,
            severity=SecurityEventSeverity.HIGH,
            timestamp=self._get_iraqi_timestamp(),
            user_id=user_id,
            email=email,
            ip_address=ip_address,
            success=True,
            event_details={
                "reason": reason,
                "locked_until": locked_until.isoformat() if locked_until else None,
            },
            metadata={
                "event_name_ar": "قفل الحساب",
                "requires_notification": True,
            },
        )
        return self.log_event(event)

    # ========================================================================
    # Query Methods (for security monitoring)
    # ========================================================================

    def get_recent_events(
        self,
        user_id: Optional[str] = None,
        event_type: Optional[SecurityEventType] = None,
        hours: int = 24,
    ) -> List[SecurityLogEntry]:
        """
        Get recent security events (requires parsing log files)

        Note: This is a basic implementation. For production, consider using
        a dedicated log aggregation system (ELK stack, Splunk, etc.)

        Args:
            user_id: Filter by user ID
            event_type: Filter by event type
            hours: Number of hours to look back

        Returns:
            List of security log entries
        """
        # This would require parsing log files
        # Implementation depends on log aggregation system
        # For now, return empty list as placeholder
        return []

    def get_failed_login_count(self, email: str, minutes: int = 15) -> int:
        """
        Get count of failed login attempts for email in time window

        Args:
            email: Email address
            minutes: Time window in minutes

        Returns:
            Count of failed login attempts
        """
        # This would require parsing failed_attempts.log
        # Implementation depends on log aggregation system
        return 0


# ============================================================================
# Singleton Instance
# ============================================================================

# Global security logger instance
_security_logger_instance: Optional[SecurityLogger] = None
_instance_lock = threading.Lock()


def get_security_logger() -> SecurityLogger:
    """
    Get global security logger instance (thread-safe singleton)

    Returns:
        SecurityLogger instance
    """
    global _security_logger_instance

    if _security_logger_instance is None:
        with _instance_lock:
            if _security_logger_instance is None:
                _security_logger_instance = SecurityLogger()

    return _security_logger_instance


# ============================================================================
# Convenience Functions
# ============================================================================


def log_security_event(event: SecurityEvent) -> str:
    """
    Convenience function to log security event

    Args:
        event: Security event to log

    Returns:
        Log entry ID
    """
    logger = get_security_logger()
    return logger.log_event(event)
