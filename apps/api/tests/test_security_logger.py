"""
Unit Tests for Security Audit Logger
Tests comprehensive security event logging functionality
"""

import pytest
import json
import os
from pathlib import Path
from datetime import datetime, timedelta
from unittest.mock import patch, MagicMock
import pytz

from services.security_logger import (
    SecurityLogger,
    SecurityEvent,
    SecurityEventType,
    SecurityEventSeverity,
    SecurityLogEntry,
    get_security_logger,
    log_security_event,
)


# ============================================================================
# Fixtures
# ============================================================================


@pytest.fixture
def security_logger():
    """Create SecurityLogger instance for testing"""
    logger = SecurityLogger()
    yield logger
    # Cleanup: Remove test log files
    # Note: In production, use separate test log directory
    # for log_file in logger.LOG_BASE_DIR.glob("*.log*"):
    #     try:
    #         log_file.unlink()
    #     except Exception:
    #         pass


@pytest.fixture
def sample_security_event():
    """Sample security event for testing"""
    return SecurityEvent(
        event_type=SecurityEventType.LOGIN,
        severity=SecurityEventSeverity.LOW,
        timestamp=datetime.now(pytz.timezone("Asia/Baghdad")),
        user_id="test-user-123",
        email="test@example.com",
        ip_address="192.168.1.100",
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        device_id="device-abc123",
        session_id="session-xyz789",
        success=True,
        event_details={"login_method": "email_password"},
        metadata={"event_name_ar": "تسجيل دخول ناجح"},
    )


@pytest.fixture
def failed_login_event():
    """Sample failed login event"""
    return SecurityEvent(
        event_type=SecurityEventType.FAILED_LOGIN,
        severity=SecurityEventSeverity.MEDIUM,
        timestamp=datetime.now(pytz.timezone("Asia/Baghdad")),
        email="test@example.com",
        ip_address="192.168.1.100",
        user_agent="Mozilla/5.0",
        success=False,
        failure_reason="invalid_password",
        event_details={"attempts_remaining": 3},
    )


# ============================================================================
# Security Logger Initialization Tests
# ============================================================================


@pytest.mark.unit
def test_security_logger_initialization(security_logger):
    """Test SecurityLogger initializes correctly"""
    assert security_logger is not None
    assert isinstance(security_logger.loggers, dict)
    assert "security_audit" in security_logger.loggers
    assert "failed_attempts" in security_logger.loggers
    assert "suspicious_activity" in security_logger.loggers
    assert "session_management" in security_logger.loggers
    assert "mfa_events" in security_logger.loggers


@pytest.mark.unit
def test_log_directory_creation(security_logger):
    """Test log directory is created"""
    assert security_logger.LOG_BASE_DIR.exists()
    assert security_logger.LOG_BASE_DIR.is_dir()


@pytest.mark.unit
def test_singleton_instance():
    """Test get_security_logger returns singleton instance"""
    logger1 = get_security_logger()
    logger2 = get_security_logger()
    assert logger1 is logger2


# ============================================================================
# Event Logging Tests
# ============================================================================


@pytest.mark.unit
def test_log_event_basic(security_logger, sample_security_event):
    """Test basic event logging"""
    log_id = security_logger.log_event(sample_security_event)

    assert log_id is not None
    assert isinstance(log_id, str)
    assert len(log_id) > 0


@pytest.mark.unit
def test_log_event_generates_unique_ids(security_logger, sample_security_event):
    """Test each log entry gets unique ID"""
    log_id1 = security_logger.log_event(sample_security_event)
    log_id2 = security_logger.log_event(sample_security_event)

    assert log_id1 != log_id2


@pytest.mark.unit
def test_log_event_adds_timestamp(security_logger):
    """Test timestamp is added if not provided"""
    event = SecurityEvent(
        event_type=SecurityEventType.LOGIN,
        severity=SecurityEventSeverity.LOW,
        user_id="test-user",
        success=True,
    )

    # Event should initially have no timestamp
    assert event.timestamp is None

    # Log the event (should add timestamp)
    log_id = security_logger.log_event(event)
    assert log_id is not None

    # After logging, timestamp should be set
    assert event.timestamp is not None
    assert isinstance(event.timestamp, datetime)


@pytest.mark.unit
def test_calculate_checksum(security_logger, sample_security_event):
    """Test integrity checksum calculation"""
    checksum = security_logger._calculate_checksum(sample_security_event)

    assert checksum is not None
    assert len(checksum) == 64  # SHA-256 produces 64-character hex string
    assert all(c in "0123456789abcdef" for c in checksum)


@pytest.mark.unit
def test_checksum_consistency(security_logger, sample_security_event):
    """Test checksum is consistent for same event"""
    checksum1 = security_logger._calculate_checksum(sample_security_event)
    checksum2 = security_logger._calculate_checksum(sample_security_event)

    assert checksum1 == checksum2


# ============================================================================
# Event Routing Tests
# ============================================================================


@pytest.mark.unit
def test_route_failed_login_to_correct_logger(security_logger):
    """Test failed login events route to failed_attempts logger"""
    logger_name = security_logger._route_event_to_logger(SecurityEventType.FAILED_LOGIN)
    assert logger_name == "failed_attempts"


@pytest.mark.unit
def test_route_suspicious_activity_to_correct_logger(security_logger):
    """Test suspicious activity routes to suspicious_activity logger"""
    logger_name = security_logger._route_event_to_logger(
        SecurityEventType.SUSPICIOUS_ACTIVITY
    )
    assert logger_name == "suspicious_activity"


@pytest.mark.unit
def test_route_session_events_to_correct_logger(security_logger):
    """Test session events route to session_management logger"""
    logger_name = security_logger._route_event_to_logger(
        SecurityEventType.SESSION_CREATED
    )
    assert logger_name == "session_management"


@pytest.mark.unit
def test_route_mfa_events_to_correct_logger(security_logger):
    """Test MFA events route to mfa_events logger"""
    logger_name = security_logger._route_event_to_logger(SecurityEventType.MFA_SETUP)
    assert logger_name == "mfa_events"


@pytest.mark.unit
def test_route_default_to_audit_logger(security_logger):
    """Test unknown events route to security_audit logger"""
    logger_name = security_logger._route_event_to_logger(SecurityEventType.LOGIN)
    assert logger_name == "security_audit"


# ============================================================================
# High-Level Logging Method Tests
# ============================================================================


@pytest.mark.unit
def test_log_login(security_logger):
    """Test log_login method"""
    log_id = security_logger.log_login(
        user_id="test-user-123",
        email="test@example.com",
        ip_address="192.168.1.100",
        user_agent="Mozilla/5.0",
        device_id="device-abc",
        session_id="session-xyz",
        mfa_used=False,
    )

    assert log_id is not None
    assert isinstance(log_id, str)


@pytest.mark.unit
def test_log_failed_login(security_logger):
    """Test log_failed_login method"""
    log_id = security_logger.log_failed_login(
        email="test@example.com",
        ip_address="192.168.1.100",
        user_agent="Mozilla/5.0",
        reason="invalid_password",
        attempts_remaining=3,
    )

    assert log_id is not None
    assert isinstance(log_id, str)


@pytest.mark.unit
def test_log_failed_login_severity_escalation(security_logger):
    """Test failed login severity escalates when attempts low"""
    # Should be HIGH severity when 1 or fewer attempts remaining
    with patch.object(security_logger, "log_event") as mock_log:
        security_logger.log_failed_login(
            email="test@example.com",
            ip_address="192.168.1.100",
            reason="invalid_password",
            attempts_remaining=1,
        )

        # Check that HIGH severity was used
        call_args = mock_log.call_args[0][0]
        assert call_args.severity == SecurityEventSeverity.HIGH


@pytest.mark.unit
def test_log_logout(security_logger):
    """Test log_logout method"""
    log_id = security_logger.log_logout(
        user_id="test-user-123",
        email="test@example.com",
        session_id="session-xyz",
        ip_address="192.168.1.100",
    )

    assert log_id is not None


@pytest.mark.unit
def test_log_register(security_logger):
    """Test log_register method"""
    log_id = security_logger.log_register(
        user_id="test-user-123",
        email="test@example.com",
        ip_address="192.168.1.100",
        user_agent="Mozilla/5.0",
        region="baghdad",
        professional_domain="legal",
    )

    assert log_id is not None


@pytest.mark.unit
def test_log_session_created(security_logger):
    """Test log_session_created method"""
    expires_at = datetime.now() + timedelta(hours=24)

    log_id = security_logger.log_session_created(
        user_id="test-user-123",
        session_id="session-xyz",
        device_id="device-abc",
        ip_address="192.168.1.100",
        expires_at=expires_at,
    )

    assert log_id is not None


@pytest.mark.unit
def test_log_session_revoked(security_logger):
    """Test log_session_revoked method"""
    log_id = security_logger.log_session_revoked(
        user_id="test-user-123",
        session_id="session-xyz",
        reason="user_logout",
        ip_address="192.168.1.100",
    )

    assert log_id is not None


@pytest.mark.unit
def test_log_suspicious_activity(security_logger):
    """Test log_suspicious_activity method"""
    log_id = security_logger.log_suspicious_activity(
        user_id="test-user-123",
        email="test@example.com",
        ip_address="192.168.1.100",
        activity_type="suspicious_device",
        details={"indicators": ["bot-like user agent"]},
        severity=SecurityEventSeverity.HIGH,
    )

    assert log_id is not None


@pytest.mark.unit
def test_log_mfa_setup(security_logger):
    """Test log_mfa_setup method"""
    log_id = security_logger.log_mfa_setup(
        user_id="test-user-123",
        email="test@example.com",
        mfa_method="email",
        ip_address="192.168.1.100",
    )

    assert log_id is not None


@pytest.mark.unit
def test_log_mfa_verified(security_logger):
    """Test log_mfa_verified method"""
    log_id = security_logger.log_mfa_verified(
        user_id="test-user-123",
        email="test@example.com",
        mfa_method="email",
        ip_address="192.168.1.100",
    )

    assert log_id is not None


@pytest.mark.unit
def test_log_account_locked(security_logger):
    """Test log_account_locked method"""
    locked_until = datetime.now() + timedelta(minutes=30)

    log_id = security_logger.log_account_locked(
        user_id="test-user-123",
        email="test@example.com",
        ip_address="192.168.1.100",
        reason="failed_login_attempts",
        locked_until=locked_until,
    )

    assert log_id is not None


# ============================================================================
# Iraqi Timezone Tests
# ============================================================================


@pytest.mark.unit
def test_iraqi_timezone_configuration(security_logger):
    """Test Iraqi timezone is configured correctly"""
    assert security_logger.IRAQI_TZ.zone == "Asia/Baghdad"


@pytest.mark.unit
def test_get_iraqi_timestamp(security_logger):
    """Test timestamp generation in Iraqi timezone"""
    timestamp = security_logger._get_iraqi_timestamp()

    assert timestamp is not None
    assert isinstance(timestamp, datetime)
    assert timestamp.tzinfo is not None
    # Check timezone name contains Baghdad
    assert "Baghdad" in str(timestamp.tzinfo) or timestamp.tzinfo.zone == "Asia/Baghdad"


# ============================================================================
# Thread Safety Tests
# ============================================================================


@pytest.mark.unit
def test_concurrent_logging(security_logger, sample_security_event):
    """Test thread-safe concurrent logging"""
    import threading

    log_ids = []
    errors = []

    def log_events():
        try:
            for _ in range(10):
                log_id = security_logger.log_event(sample_security_event)
                log_ids.append(log_id)
        except Exception as e:
            errors.append(e)

    # Create multiple threads
    threads = [threading.Thread(target=log_events) for _ in range(5)]

    # Start all threads
    for thread in threads:
        thread.start()

    # Wait for completion
    for thread in threads:
        thread.join()

    # Verify no errors
    assert len(errors) == 0

    # Verify all log IDs are unique
    assert len(log_ids) == len(set(log_ids))


# ============================================================================
# Arabic Content Tests
# ============================================================================


@pytest.mark.unit
@pytest.mark.arabic
def test_log_event_with_arabic_content(security_logger):
    """Test logging events with Arabic content"""
    event = SecurityEvent(
        event_type=SecurityEventType.LOGIN,
        severity=SecurityEventSeverity.LOW,
        timestamp=datetime.now(pytz.timezone("Asia/Baghdad")),
        user_id="test-user-123",
        email="test@example.com",
        success=True,
        metadata={
            "event_name_ar": "تسجيل دخول ناجح",
            "greeting_ar": "مرحباً بك",
        },
    )

    log_id = security_logger.log_event(event)
    assert log_id is not None


# ============================================================================
# Security Event Model Tests
# ============================================================================


@pytest.mark.unit
def test_security_event_creation():
    """Test SecurityEvent model creation"""
    event = SecurityEvent(
        event_type=SecurityEventType.LOGIN,
        severity=SecurityEventSeverity.LOW,
        timestamp=datetime.now(),
        user_id="test-user",
        success=True,
    )

    assert event.event_type == SecurityEventType.LOGIN
    assert event.severity == SecurityEventSeverity.LOW
    assert event.success is True


@pytest.mark.unit
def test_security_event_optional_fields():
    """Test SecurityEvent with optional fields"""
    event = SecurityEvent(
        event_type=SecurityEventType.FAILED_LOGIN,
        severity=SecurityEventSeverity.MEDIUM,
        timestamp=datetime.now(),
        success=False,
    )

    assert event.user_id is None
    assert event.email is None
    assert event.ip_address is None
    assert event.failure_reason is None


@pytest.mark.unit
def test_security_event_with_all_fields():
    """Test SecurityEvent with all fields populated"""
    timestamp = datetime.now(pytz.timezone("Asia/Baghdad"))
    event = SecurityEvent(
        event_type=SecurityEventType.LOGIN,
        severity=SecurityEventSeverity.LOW,
        timestamp=timestamp,
        user_id="user-123",
        email="test@example.com",
        ip_address="192.168.1.100",
        user_agent="Mozilla/5.0",
        device_id="device-abc",
        session_id="session-xyz",
        success=True,
        failure_reason=None,
        location="Baghdad, Iraq",
        event_details={"key": "value"},
        metadata={"meta": "data"},
    )

    assert event.user_id == "user-123"
    assert event.email == "test@example.com"
    assert event.ip_address == "192.168.1.100"
    assert event.location == "Baghdad, Iraq"


# ============================================================================
# Log Entry Model Tests
# ============================================================================


@pytest.mark.unit
def test_security_log_entry_creation(sample_security_event):
    """Test SecurityLogEntry creation"""
    log_entry = SecurityLogEntry(
        log_id="test-log-id-123",
        event=sample_security_event,
        checksum="abc123def456",
        encrypted=False,
    )

    assert log_entry.log_id == "test-log-id-123"
    assert log_entry.event == sample_security_event
    assert log_entry.checksum == "abc123def456"
    assert log_entry.encrypted is False


@pytest.mark.unit
def test_security_log_entry_serialization(sample_security_event, security_logger):
    """Test SecurityLogEntry can be serialized to JSON"""
    checksum = security_logger._calculate_checksum(sample_security_event)
    log_entry = SecurityLogEntry(
        log_id="test-log-id-123",
        event=sample_security_event,
        checksum=checksum,
        encrypted=False,
    )

    # Should not raise exception
    json_data = log_entry.model_dump_json()
    assert json_data is not None
    assert isinstance(json_data, str)

    # Verify JSON is valid
    parsed = json.loads(json_data)
    assert parsed["log_id"] == "test-log-id-123"
    assert parsed["checksum"] == checksum


# ============================================================================
# Convenience Function Tests
# ============================================================================


@pytest.mark.unit
def test_log_security_event_convenience_function(sample_security_event):
    """Test log_security_event convenience function"""
    log_id = log_security_event(sample_security_event)

    assert log_id is not None
    assert isinstance(log_id, str)


# ============================================================================
# Configuration Tests
# ============================================================================


@pytest.mark.unit
def test_log_retention_configuration(security_logger):
    """Test log retention is configured correctly"""
    assert security_logger.LOG_RETENTION_DAYS == 30
    assert security_logger.BACKUP_COUNT == 30


@pytest.mark.unit
def test_log_file_configuration(security_logger):
    """Test log files are configured correctly"""
    expected_log_files = [
        "security_audit.log",
        "failed_attempts.log",
        "suspicious_activity.log",
        "session_management.log",
        "mfa_events.log",
    ]

    # Check that loggers are initialized
    for log_file in expected_log_files:
        logger_name = log_file.replace(".log", "")
        assert logger_name in security_logger.loggers


# ============================================================================
# Error Handling Tests
# ============================================================================


@pytest.mark.unit
def test_log_event_with_invalid_severity():
    """Test logging with invalid severity raises error"""
    with pytest.raises(ValueError):
        SecurityEvent(
            event_type=SecurityEventType.LOGIN,
            severity="invalid_severity",  # Invalid
            timestamp=datetime.now(),
            success=True,
        )


@pytest.mark.unit
def test_log_event_with_invalid_event_type():
    """Test logging with invalid event type raises error"""
    with pytest.raises(ValueError):
        SecurityEvent(
            event_type="invalid_type",  # Invalid
            severity=SecurityEventSeverity.LOW,
            timestamp=datetime.now(),
            success=True,
        )


# ============================================================================
# Integration Tests (with file system)
# ============================================================================


@pytest.mark.integration
def test_log_files_created(security_logger, sample_security_event):
    """Test log files are created on disk"""
    # Log an event
    security_logger.log_event(sample_security_event)

    # Check that security_audit.log exists
    audit_log = security_logger.LOG_BASE_DIR / "security_audit.log"
    assert audit_log.exists()
    assert audit_log.is_file()


@pytest.mark.integration
def test_failed_attempts_log_file_created(security_logger, failed_login_event):
    """Test failed_attempts.log is created"""
    security_logger.log_event(failed_login_event)

    failed_log = security_logger.LOG_BASE_DIR / "failed_attempts.log"
    assert failed_log.exists()


@pytest.mark.integration
def test_log_entry_written_to_file(security_logger, sample_security_event):
    """Test log entry is written to file"""
    log_id = security_logger.log_event(sample_security_event)

    # Read log file
    audit_log = security_logger.LOG_BASE_DIR / "security_audit.log"
    with open(audit_log, "r", encoding="utf-8") as f:
        content = f.read()

    # Verify log ID is in file
    assert log_id in content


@pytest.mark.integration
def test_log_entry_is_valid_json(security_logger, sample_security_event):
    """Test log entries are valid JSON"""
    security_logger.log_event(sample_security_event)

    audit_log = security_logger.LOG_BASE_DIR / "security_audit.log"
    with open(audit_log, "r", encoding="utf-8") as f:
        last_line = f.readlines()[-1]

    # Should parse as valid JSON
    parsed = json.loads(last_line)
    assert "log_id" in parsed
    assert "event" in parsed
    assert "checksum" in parsed


# ============================================================================
# Performance Tests
# ============================================================================


@pytest.mark.unit
@pytest.mark.slow
def test_logging_performance(security_logger, sample_security_event):
    """Test logging performance meets requirements"""
    import time

    iterations = 100
    start_time = time.time()

    for _ in range(iterations):
        security_logger.log_event(sample_security_event)

    elapsed = time.time() - start_time
    avg_time_ms = (elapsed / iterations) * 1000

    # Should log in less than 10ms average (well under 200ms requirement)
    assert avg_time_ms < 10, f"Logging took {avg_time_ms:.2f}ms (should be < 10ms)"
