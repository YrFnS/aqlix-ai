#!/usr/bin/env python3
"""
🇮🇶 Iraqi Government Telemetry System
========================================

Enterprise-grade telemetry and analytics system with Islamic compliance,
privacy protection, and comprehensive audit logging for Iraqi government services.

Features:
- Government-compliant usage analytics with privacy protection
- Cultural interaction pattern analysis for service improvement
- Islamic compliance metrics tracking with detailed reporting
- Performance optimization insights for Arabic language processing
- Security audit trail generation with comprehensive logging
- Real-time performance monitoring with cultural context awareness

Author: Iraqi AI Development Team
Date: August 20, 2025
Version: 2.1.0
License: Government Use Only - Iraqi Ministry of Digital Transformation
"""

import asyncio
import json
import logging
import hashlib
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple, Union
from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path
import aiofiles
import aiohttp
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import base64
import os

# Cultural and compliance validation
from cultural_validation import IraqiCulturalValidator, IslamicComplianceChecker
from arabic_processor import ArabicDialectProcessor, RTLTextAnalyzer


class TelemetryLevel(Enum):
    """Security classification levels for telemetry data"""

    PUBLIC = "public"
    INTERNAL = "internal"
    CONFIDENTIAL = "confidential"
    SECRET = "secret"
    TOP_SECRET = "top_secret"


class MetricType(Enum):
    """Types of metrics collected by the telemetry system"""

    PERFORMANCE = "performance"
    USAGE = "usage"
    CULTURAL = "cultural"
    SECURITY = "security"
    COMPLIANCE = "compliance"
    LINGUISTIC = "linguistic"


class MinistryDomain(Enum):
    """Iraqi government ministry domains for specialized tracking"""

    INTERIOR = "interior"
    DEFENSE = "defense"
    FOREIGN_AFFAIRS = "foreign_affairs"
    FINANCE = "finance"
    HEALTH = "health"
    EDUCATION = "education"
    JUSTICE = "justice"
    AGRICULTURE = "agriculture"
    TRANSPORT = "transport"
    COMMUNICATIONS = "communications"
    LABOR = "labor"
    YOUTH_SPORTS = "youth_sports"


@dataclass
class TelemetryEvent:
    """Individual telemetry event with cultural and security context"""

    event_id: str
    timestamp: datetime
    event_type: str
    classification: TelemetryLevel
    ministry_domain: Optional[MinistryDomain]
    user_id_hash: str
    session_id: str

    # Performance metrics
    response_time_ms: float
    memory_usage_mb: float
    cpu_usage_percent: float

    # Cultural metrics
    language: str  # 'ar' for Arabic, 'en' for English
    dialect: Optional[str]  # Baghdad, Basra, Mosul, etc.
    cultural_compliance_score: float
    islamic_compliance_score: float

    # Content analysis
    content_type: str
    content_length: int
    rtl_text_percentage: float

    # Security metrics
    authentication_method: str
    security_level: str
    audit_required: bool

    # Additional context
    metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class PerformanceMetrics:
    """Performance analytics with cultural context"""

    avg_response_time_ms: float
    p95_response_time_ms: float
    p99_response_time_ms: float
    avg_memory_usage_mb: float
    peak_memory_usage_mb: float
    cpu_utilization_percent: float

    # Arabic processing performance
    arabic_text_processing_ms: float
    rtl_layout_rendering_ms: float
    dialect_recognition_ms: float
    cultural_validation_ms: float

    # Compliance processing
    islamic_compliance_check_ms: float
    security_validation_ms: float

    total_requests: int
    failed_requests: int
    success_rate: float


@dataclass
class CulturalMetrics:
    """Cultural interaction pattern analysis"""

    total_arabic_interactions: int
    total_english_interactions: int
    mixed_language_interactions: int

    # Dialect usage distribution
    baghdad_dialect_usage: int
    basra_dialect_usage: int
    mosul_dialect_usage: int
    standard_arabic_usage: int

    # Cultural compliance
    cultural_compliance_violations: int
    islamic_compliance_violations: int
    political_neutrality_violations: int

    # Professional etiquette
    formal_interaction_count: int
    informal_interaction_count: int
    professional_terminology_usage: int

    # Prayer time accommodation
    prayer_time_pauses: int
    ramadan_accommodations: int
    islamic_calendar_references: int


@dataclass
class SecurityMetrics:
    """Security and audit trail analytics"""

    authentication_attempts: int
    successful_authentications: int
    failed_authentications: int
    multi_factor_auth_usage: int

    # Access control
    role_based_access_grants: int
    permission_denials: int
    privilege_escalation_attempts: int

    # Data protection
    encryption_operations: int
    data_anonymization_operations: int
    audit_log_entries: int

    # Threat detection
    suspicious_activity_alerts: int
    security_policy_violations: int
    intrusion_attempts: int

    # Compliance tracking
    gdpr_requests: int
    iraqi_privacy_law_compliance: int
    government_audit_requests: int


class IraqiGovernmentTelemetry:
    """
    Comprehensive telemetry system for Iraqi government services with
    cultural intelligence, Islamic compliance, and enterprise security.
    """

    def __init__(
        self,
        config_path: str = "/etc/iraqi-gov/telemetry-config.json",
        encryption_key: Optional[bytes] = None,
        ministry_domain: MinistryDomain = MinistryDomain.COMMUNICATIONS,
    ):
        self.config_path = config_path
        self.ministry_domain = ministry_domain
        self.events: List[TelemetryEvent] = []

        # Cultural processors
        self.cultural_validator = IraqiCulturalValidator()
        self.islamic_checker = IslamicComplianceChecker()
        self.arabic_processor = ArabicDialectProcessor()
        self.rtl_analyzer = RTLTextAnalyzer()

        # Encryption setup
        if encryption_key:
            self.encryption = Fernet(encryption_key)
        else:
            self.encryption = self._generate_encryption_key()

        # Performance tracking
        self.performance_buffer: List[Dict[str, Any]] = []
        self.cultural_buffer: List[Dict[str, Any]] = []
        self.security_buffer: List[Dict[str, Any]] = []

        # Configuration
        self.config = self._load_configuration()
        self.logger = self._setup_logging()

    def _generate_encryption_key(self) -> Fernet:
        """Generate encryption key for sensitive telemetry data"""
        # In production, this should be loaded from secure key management
        password = os.environ.get(
            "TELEMETRY_ENCRYPTION_PASSWORD", "iraqi-gov-telemetry-2025"
        ).encode()
        salt = b"iraqi_government_salt"
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        key = base64.urlsafe_b64encode(kdf.derive(password))
        return Fernet(key)

    def _load_configuration(self) -> Dict[str, Any]:
        """Load telemetry configuration with Iraqi government defaults"""
        default_config = {
            "collection_enabled": True,
            "privacy_protection": True,
            "islamic_compliance_required": True,
            "cultural_validation_enabled": True,
            "audit_logging_enabled": True,
            "data_retention_days": 365,
            "anonymization_required": True,
            "encryption_required": True,
            # Performance thresholds
            "performance_thresholds": {
                "response_time_ms": 100,
                "memory_usage_mb": 256,
                "cpu_usage_percent": 70,
                "arabic_processing_ms": 150,
                "cultural_validation_ms": 200,
            },
            # Cultural compliance targets
            "compliance_targets": {
                "cultural_compliance_score": 0.95,
                "islamic_compliance_score": 1.0,
                "political_neutrality_score": 0.98,
                "professional_etiquette_score": 0.92,
            },
            # Ministry-specific settings
            "ministry_settings": {
                "data_classification": "confidential",
                "audit_level": "comprehensive",
                "cultural_sensitivity": "high",
                "language_priority": "arabic_first",
            },
        }

        try:
            if Path(self.config_path).exists():
                with open(self.config_path, "r", encoding="utf-8") as f:
                    config = json.load(f)
                    # Merge with defaults
                    return {**default_config, **config}
        except Exception as e:
            self.logger.warning(f"Could not load config from {self.config_path}: {e}")

        return default_config

    def _setup_logging(self) -> logging.Logger:
        """Setup secure audit logging with Iraqi government compliance"""
        logger = logging.getLogger(f"IraqiGovTelemetry-{self.ministry_domain.value}")
        logger.setLevel(logging.INFO)

        # Secure file handler with rotation
        log_path = f"/var/log/iraqi-gov/telemetry-{self.ministry_domain.value}.log"
        os.makedirs(os.path.dirname(log_path), exist_ok=True)

        handler = logging.FileHandler(log_path, encoding="utf-8")

        # Arabic-compatible formatter
        formatter = logging.Formatter(
            "%(asctime)s | %(levelname)s | %(name)s | %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)

        return logger

    async def record_event(
        self,
        event_type: str,
        user_context: Dict[str, Any],
        performance_data: Dict[str, Any],
        content_data: Dict[str, Any],
        classification: TelemetryLevel = TelemetryLevel.INTERNAL,
    ) -> str:
        """
        Record telemetry event with comprehensive cultural and security analysis

        Args:
            event_type: Type of event (e.g., 'cli_command', 'api_request')
            user_context: User information and session context
            performance_data: Performance metrics (response time, memory, CPU)
            content_data: Content analysis (language, compliance scores)
            classification: Security classification level

        Returns:
            event_id: Unique identifier for the recorded event
        """
        if not self.config.get("collection_enabled", True):
            return ""

        # Generate secure event ID
        event_id = self._generate_event_id(user_context, event_type)

        # Hash user ID for privacy
        user_id_hash = self._hash_user_id(user_context.get("user_id", "anonymous"))

        # Analyze cultural context
        cultural_scores = await self._analyze_cultural_context(content_data)

        # Detect language and dialect
        language_info = await self._analyze_language_content(content_data)

        # Create telemetry event
        event = TelemetryEvent(
            event_id=event_id,
            timestamp=datetime.now(),
            event_type=event_type,
            classification=classification,
            ministry_domain=self.ministry_domain,
            user_id_hash=user_id_hash,
            session_id=user_context.get("session_id", "unknown"),
            # Performance metrics
            response_time_ms=performance_data.get("response_time_ms", 0.0),
            memory_usage_mb=performance_data.get("memory_usage_mb", 0.0),
            cpu_usage_percent=performance_data.get("cpu_usage_percent", 0.0),
            # Cultural metrics
            language=language_info["primary_language"],
            dialect=language_info.get("dialect"),
            cultural_compliance_score=cultural_scores["cultural_compliance"],
            islamic_compliance_score=cultural_scores["islamic_compliance"],
            # Content analysis
            content_type=content_data.get("content_type", "text"),
            content_length=content_data.get("content_length", 0),
            rtl_text_percentage=language_info["rtl_percentage"],
            # Security metrics
            authentication_method=user_context.get("auth_method", "unknown"),
            security_level=user_context.get("security_level", "basic"),
            audit_required=classification
            in [TelemetryLevel.SECRET, TelemetryLevel.TOP_SECRET],
            # Additional metadata
            metadata={
                "user_agent": user_context.get("user_agent", ""),
                "ip_address_hash": self._hash_ip_address(
                    user_context.get("ip_address", "")
                ),
                "ministry_department": user_context.get("department", ""),
                "prayer_time_context": await self._get_prayer_time_context(),
                "cultural_context": cultural_scores.get("cultural_context", {}),
                "performance_context": performance_data.get("context", {}),
            },
        )

        # Store event
        self.events.append(event)

        # Buffer for batch processing
        await self._buffer_event(event)

        # Log for audit trail
        await self._log_audit_event(event)

        # Check for alerts
        await self._check_performance_alerts(event)
        await self._check_compliance_alerts(event)

        self.logger.info(f"Recorded telemetry event: {event_id} - {event_type}")

        return event_id

    def _generate_event_id(self, user_context: Dict[str, Any], event_type: str) -> str:
        """Generate unique, secure event identifier"""
        timestamp = datetime.now().isoformat()
        user_id = user_context.get("user_id", "anonymous")
        ministry = self.ministry_domain.value

        # Create hash-based ID for security
        content = f"{timestamp}:{user_id}:{event_type}:{ministry}"
        event_hash = hashlib.sha256(content.encode()).hexdigest()[:16]

        return f"IQ-{ministry.upper()}-{event_hash}"

    def _hash_user_id(self, user_id: str) -> str:
        """Hash user ID for privacy protection while maintaining analytics capability"""
        if not user_id or user_id == "anonymous":
            return "anonymous"

        # Add salt for additional security
        salt = f"iraqi-gov-{self.ministry_domain.value}-2025"
        content = f"{salt}:{user_id}"

        return hashlib.sha256(content.encode()).hexdigest()[:32]

    def _hash_ip_address(self, ip_address: str) -> str:
        """Hash IP address for privacy while maintaining network analytics"""
        if not ip_address:
            return ""

        # Hash with ministry-specific salt
        salt = f"ip-{self.ministry_domain.value}-2025"
        content = f"{salt}:{ip_address}"

        return hashlib.sha256(content.encode()).hexdigest()[:16]

    async def _analyze_cultural_context(
        self, content_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Analyze cultural compliance and appropriateness of content"""
        content_text = content_data.get("text", "")
        content_type = content_data.get("content_type", "text")

        if not content_text:
            return {
                "cultural_compliance": 1.0,
                "islamic_compliance": 1.0,
                "cultural_context": {},
            }

        try:
            # Cultural compliance analysis
            cultural_result = await self.cultural_validator.validate_content(
                content_text,
                context_type=content_type,
                ministry_domain=self.ministry_domain.value,
            )

            # Islamic compliance analysis
            islamic_result = await self.islamic_checker.check_compliance(
                content_text, check_level="comprehensive"
            )

            return {
                "cultural_compliance": cultural_result.get("compliance_score", 1.0),
                "islamic_compliance": islamic_result.get("compliance_score", 1.0),
                "cultural_context": {
                    "cultural_issues": cultural_result.get("issues", []),
                    "islamic_issues": islamic_result.get("issues", []),
                    "professional_tone": cultural_result.get("professional_tone", True),
                    "political_neutrality": cultural_result.get(
                        "political_neutrality", True
                    ),
                },
            }

        except Exception as e:
            self.logger.error(f"Cultural analysis error: {e}")
            return {
                "cultural_compliance": 0.9,  # Conservative estimate
                "islamic_compliance": 0.9,
                "cultural_context": {"analysis_error": str(e)},
            }

    async def _analyze_language_content(
        self, content_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Analyze language, dialect, and RTL text characteristics"""
        content_text = content_data.get("text", "")

        if not content_text:
            return {
                "primary_language": "unknown",
                "dialect": None,
                "rtl_percentage": 0.0,
            }

        try:
            # Language detection
            language_result = await self.arabic_processor.detect_language_and_dialect(
                content_text
            )

            # RTL analysis
            rtl_analysis = await self.rtl_analyzer.analyze_text_direction(content_text)

            return {
                "primary_language": language_result.get("primary_language", "unknown"),
                "dialect": language_result.get("dialect"),
                "rtl_percentage": rtl_analysis.get("rtl_percentage", 0.0),
                "mixed_language": language_result.get("mixed_language", False),
                "script_types": rtl_analysis.get("script_types", []),
            }

        except Exception as e:
            self.logger.error(f"Language analysis error: {e}")
            return {
                "primary_language": "unknown",
                "dialect": None,
                "rtl_percentage": 0.0,
                "analysis_error": str(e),
            }

    async def _get_prayer_time_context(self) -> Dict[str, Any]:
        """Get current prayer time context for cultural accommodation tracking"""
        try:
            from prayer_times import IraqiPrayerTimes

            prayer_times = IraqiPrayerTimes()
            current_context = await prayer_times.get_current_context()

            return {
                "is_prayer_time": current_context.get("is_prayer_time", False),
                "next_prayer": current_context.get("next_prayer", ""),
                "time_until_prayer": current_context.get(
                    "time_until_prayer_minutes", 0
                ),
                "is_ramadan": current_context.get("is_ramadan", False),
                "islamic_date": current_context.get("islamic_date", ""),
            }

        except ImportError:
            # Prayer times module not available
            return {"is_prayer_time": False, "prayer_module_available": False}
        except Exception as e:
            self.logger.warning(f"Prayer time context error: {e}")
            return {"prayer_time_error": str(e)}

    async def _buffer_event(self, event: TelemetryEvent):
        """Buffer event for batch processing and analysis"""
        # Performance buffer
        self.performance_buffer.append(
            {
                "timestamp": event.timestamp.isoformat(),
                "response_time_ms": event.response_time_ms,
                "memory_usage_mb": event.memory_usage_mb,
                "cpu_usage_percent": event.cpu_usage_percent,
                "event_type": event.event_type,
            }
        )

        # Cultural buffer
        self.cultural_buffer.append(
            {
                "timestamp": event.timestamp.isoformat(),
                "language": event.language,
                "dialect": event.dialect,
                "cultural_compliance_score": event.cultural_compliance_score,
                "islamic_compliance_score": event.islamic_compliance_score,
                "rtl_text_percentage": event.rtl_text_percentage,
            }
        )

        # Security buffer
        self.security_buffer.append(
            {
                "timestamp": event.timestamp.isoformat(),
                "classification": event.classification.value,
                "authentication_method": event.authentication_method,
                "security_level": event.security_level,
                "audit_required": event.audit_required,
            }
        )

        # Flush buffers if they get too large
        if len(self.performance_buffer) > 1000:
            await self._flush_buffers()

    async def _log_audit_event(self, event: TelemetryEvent):
        """Log event to secure audit trail"""
        if event.classification in [TelemetryLevel.SECRET, TelemetryLevel.TOP_SECRET]:
            # High-security events require enhanced logging
            audit_entry = {
                "event_id": event.event_id,
                "timestamp": event.timestamp.isoformat(),
                "classification": event.classification.value,
                "ministry_domain": event.ministry_domain.value
                if event.ministry_domain
                else None,
                "user_id_hash": event.user_id_hash,
                "event_type": event.event_type,
                "audit_required": event.audit_required,
                "cultural_compliance": event.cultural_compliance_score,
                "islamic_compliance": event.islamic_compliance_score,
            }

            # Encrypt sensitive audit data
            encrypted_data = self.encryption.encrypt(
                json.dumps(audit_entry, ensure_ascii=False).encode()
            )

            # Write to secure audit log
            audit_log_path = (
                f"/var/log/iraqi-gov/secure-audit-{self.ministry_domain.value}.log"
            )
            async with aiofiles.open(audit_log_path, "ab") as f:
                await f.write(encrypted_data + b"\n")

            self.logger.info(f"Secure audit logged: {event.event_id}")

    async def _check_performance_alerts(self, event: TelemetryEvent):
        """Check for performance threshold violations and generate alerts"""
        thresholds = self.config.get("performance_thresholds", {})

        alerts = []

        if event.response_time_ms > thresholds.get("response_time_ms", 100):
            alerts.append(
                {
                    "type": "performance",
                    "severity": "warning",
                    "message": f"Response time {event.response_time_ms}ms exceeds threshold {thresholds['response_time_ms']}ms",
                    "event_id": event.event_id,
                }
            )

        if event.memory_usage_mb > thresholds.get("memory_usage_mb", 256):
            alerts.append(
                {
                    "type": "performance",
                    "severity": "warning",
                    "message": f"Memory usage {event.memory_usage_mb}MB exceeds threshold {thresholds['memory_usage_mb']}MB",
                    "event_id": event.event_id,
                }
            )

        if event.cpu_usage_percent > thresholds.get("cpu_usage_percent", 70):
            alerts.append(
                {
                    "type": "performance",
                    "severity": "critical",
                    "message": f"CPU usage {event.cpu_usage_percent}% exceeds threshold {thresholds['cpu_usage_percent']}%",
                    "event_id": event.event_id,
                }
            )

        for alert in alerts:
            await self._send_alert(alert)

    async def _check_compliance_alerts(self, event: TelemetryEvent):
        """Check for cultural and Islamic compliance violations"""
        targets = self.config.get("compliance_targets", {})

        alerts = []

        if event.cultural_compliance_score < targets.get(
            "cultural_compliance_score", 0.95
        ):
            alerts.append(
                {
                    "type": "compliance",
                    "severity": "high",
                    "message": f"Cultural compliance score {event.cultural_compliance_score:.2f} below target {targets['cultural_compliance_score']:.2f}",
                    "event_id": event.event_id,
                }
            )

        if event.islamic_compliance_score < targets.get(
            "islamic_compliance_score", 1.0
        ):
            alerts.append(
                {
                    "type": "compliance",
                    "severity": "critical",
                    "message": f"Islamic compliance score {event.islamic_compliance_score:.2f} below required standard",
                    "event_id": event.event_id,
                }
            )

        for alert in alerts:
            await self._send_alert(alert)

    async def _send_alert(self, alert: Dict[str, Any]):
        """Send alert to monitoring system"""
        self.logger.warning(
            f"ALERT: {alert['type']} - {alert['severity']} - {alert['message']}"
        )

        # In production, this would integrate with monitoring systems
        # like Prometheus, Grafana, or Iraqi government monitoring infrastructure

    async def _flush_buffers(self):
        """Flush buffered events for batch analysis"""
        if not any(
            [self.performance_buffer, self.cultural_buffer, self.security_buffer]
        ):
            return

        # Batch analysis and storage
        await self._batch_analyze_performance()
        await self._batch_analyze_cultural_patterns()
        await self._batch_analyze_security_metrics()

        # Clear buffers
        self.performance_buffer.clear()
        self.cultural_buffer.clear()
        self.security_buffer.clear()

        self.logger.info("Telemetry buffers flushed and analyzed")

    async def _batch_analyze_performance(self):
        """Analyze performance trends from buffered data"""
        if not self.performance_buffer:
            return

        # Calculate aggregated metrics
        response_times = [
            event["response_time_ms"] for event in self.performance_buffer
        ]
        memory_usage = [event["memory_usage_mb"] for event in self.performance_buffer]
        cpu_usage = [event["cpu_usage_percent"] for event in self.performance_buffer]

        metrics = {
            "avg_response_time": sum(response_times) / len(response_times),
            "max_response_time": max(response_times),
            "avg_memory_usage": sum(memory_usage) / len(memory_usage),
            "max_memory_usage": max(memory_usage),
            "avg_cpu_usage": sum(cpu_usage) / len(cpu_usage),
            "max_cpu_usage": max(cpu_usage),
            "event_count": len(self.performance_buffer),
        }

        # Store aggregated metrics (in production, this would go to a time series database)
        self.logger.info(f"Performance metrics: {metrics}")

    async def _batch_analyze_cultural_patterns(self):
        """Analyze cultural interaction patterns from buffered data"""
        if not self.cultural_buffer:
            return

        # Language distribution
        languages = [event["language"] for event in self.cultural_buffer]
        dialects = [
            event["dialect"] for event in self.cultural_buffer if event["dialect"]
        ]

        # Compliance scores
        cultural_scores = [
            event["cultural_compliance_score"] for event in self.cultural_buffer
        ]
        islamic_scores = [
            event["islamic_compliance_score"] for event in self.cultural_buffer
        ]

        patterns = {
            "arabic_usage": languages.count("ar") / len(languages),
            "english_usage": languages.count("en") / len(languages),
            "avg_cultural_compliance": sum(cultural_scores) / len(cultural_scores),
            "avg_islamic_compliance": sum(islamic_scores) / len(islamic_scores),
            "dialect_distribution": {
                dialect: dialects.count(dialect) for dialect in set(dialects)
            },
            "event_count": len(self.cultural_buffer),
        }

        self.logger.info(f"Cultural patterns: {patterns}")

    async def _batch_analyze_security_metrics(self):
        """Analyze security metrics from buffered data"""
        if not self.security_buffer:
            return

        # Security classification distribution
        classifications = [event["classification"] for event in self.security_buffer]
        auth_methods = [
            event["authentication_method"] for event in self.security_buffer
        ]

        metrics = {
            "classification_distribution": {
                level: classifications.count(level) for level in set(classifications)
            },
            "auth_method_distribution": {
                method: auth_methods.count(method) for method in set(auth_methods)
            },
            "high_security_events": sum(
                1 for event in self.security_buffer if event["audit_required"]
            ),
            "event_count": len(self.security_buffer),
        }

        self.logger.info(f"Security metrics: {metrics}")

    async def generate_analytics_report(
        self,
        start_date: datetime,
        end_date: datetime,
        report_type: str = "comprehensive",
    ) -> Dict[str, Any]:
        """
        Generate comprehensive analytics report with cultural and security insights

        Args:
            start_date: Report start date
            end_date: Report end date
            report_type: Type of report ('performance', 'cultural', 'security', 'comprehensive')

        Returns:
            Detailed analytics report with metrics and recommendations
        """
        # Filter events by date range
        filtered_events = [
            event for event in self.events if start_date <= event.timestamp <= end_date
        ]

        if not filtered_events:
            return {
                "error": "No events found in specified date range",
                "start_date": start_date.isoformat(),
                "end_date": end_date.isoformat(),
            }

        # Generate report sections based on type
        report = {
            "report_metadata": {
                "generated_at": datetime.now().isoformat(),
                "start_date": start_date.isoformat(),
                "end_date": end_date.isoformat(),
                "ministry_domain": self.ministry_domain.value,
                "total_events": len(filtered_events),
                "report_type": report_type,
            }
        }

        if report_type in ["performance", "comprehensive"]:
            report["performance_metrics"] = await self._generate_performance_report(
                filtered_events
            )

        if report_type in ["cultural", "comprehensive"]:
            report["cultural_metrics"] = await self._generate_cultural_report(
                filtered_events
            )

        if report_type in ["security", "comprehensive"]:
            report["security_metrics"] = await self._generate_security_report(
                filtered_events
            )

        if report_type == "comprehensive":
            report["recommendations"] = await self._generate_recommendations(
                filtered_events
            )

        return report

    async def _generate_performance_report(
        self, events: List[TelemetryEvent]
    ) -> Dict[str, Any]:
        """Generate performance analytics section"""
        response_times = [e.response_time_ms for e in events]
        memory_usage = [e.memory_usage_mb for e in events]
        cpu_usage = [e.cpu_usage_percent for e in events]

        return {
            "response_time": {
                "average_ms": sum(response_times) / len(response_times),
                "median_ms": sorted(response_times)[len(response_times) // 2],
                "p95_ms": sorted(response_times)[int(len(response_times) * 0.95)],
                "p99_ms": sorted(response_times)[int(len(response_times) * 0.99)],
                "max_ms": max(response_times),
                "threshold_violations": sum(1 for rt in response_times if rt > 100),
            },
            "memory_usage": {
                "average_mb": sum(memory_usage) / len(memory_usage),
                "peak_mb": max(memory_usage),
                "threshold_violations": sum(1 for mu in memory_usage if mu > 256),
            },
            "cpu_usage": {
                "average_percent": sum(cpu_usage) / len(cpu_usage),
                "peak_percent": max(cpu_usage),
                "threshold_violations": sum(1 for cu in cpu_usage if cu > 70),
            },
            "total_events": len(events),
        }

    async def _generate_cultural_report(
        self, events: List[TelemetryEvent]
    ) -> Dict[str, Any]:
        """Generate cultural analytics section"""
        arabic_events = [e for e in events if e.language == "ar"]
        english_events = [e for e in events if e.language == "en"]

        cultural_scores = [e.cultural_compliance_score for e in events]
        islamic_scores = [e.islamic_compliance_score for e in events]

        dialects = [e.dialect for e in events if e.dialect]

        return {
            "language_distribution": {
                "arabic_usage": len(arabic_events) / len(events),
                "english_usage": len(english_events) / len(events),
                "total_arabic_events": len(arabic_events),
                "total_english_events": len(english_events),
            },
            "dialect_analysis": {
                "dialect_distribution": {
                    dialect: dialects.count(dialect) for dialect in set(dialects)
                }
                if dialects
                else {},
                "total_dialect_events": len(dialects),
            },
            "compliance_metrics": {
                "cultural_compliance": {
                    "average_score": sum(cultural_scores) / len(cultural_scores),
                    "min_score": min(cultural_scores),
                    "violations": sum(1 for score in cultural_scores if score < 0.95),
                },
                "islamic_compliance": {
                    "average_score": sum(islamic_scores) / len(islamic_scores),
                    "min_score": min(islamic_scores),
                    "violations": sum(1 for score in islamic_scores if score < 1.0),
                },
            },
            "rtl_text_analysis": {
                "average_rtl_percentage": sum(e.rtl_text_percentage for e in events)
                / len(events),
                "high_rtl_events": sum(
                    1 for e in events if e.rtl_text_percentage > 0.8
                ),
            },
        }

    async def _generate_security_report(
        self, events: List[TelemetryEvent]
    ) -> Dict[str, Any]:
        """Generate security analytics section"""
        classifications = [e.classification.value for e in events]
        auth_methods = [e.authentication_method for e in events]
        security_levels = [e.security_level for e in events]

        return {
            "classification_distribution": {
                level: classifications.count(level) for level in set(classifications)
            },
            "authentication_analysis": {
                "method_distribution": {
                    method: auth_methods.count(method) for method in set(auth_methods)
                },
                "security_level_distribution": {
                    level: security_levels.count(level)
                    for level in set(security_levels)
                },
            },
            "audit_requirements": {
                "audit_required_events": sum(1 for e in events if e.audit_required),
                "high_security_events": sum(
                    1
                    for e in events
                    if e.classification
                    in [TelemetryLevel.SECRET, TelemetryLevel.TOP_SECRET]
                ),
            },
            "total_events": len(events),
        }

    async def _generate_recommendations(
        self, events: List[TelemetryEvent]
    ) -> Dict[str, Any]:
        """Generate actionable recommendations based on analytics"""
        recommendations = {
            "performance": [],
            "cultural": [],
            "security": [],
            "priority": "medium",
        }

        # Performance recommendations
        avg_response_time = sum(e.response_time_ms for e in events) / len(events)
        if avg_response_time > 100:
            recommendations["performance"].append(
                {
                    "type": "optimization",
                    "message": f"Average response time {avg_response_time:.1f}ms exceeds 100ms target",
                    "action": "Consider optimizing Arabic text processing and cultural validation pipelines",
                    "priority": "high",
                }
            )

        # Cultural recommendations
        cultural_violations = sum(
            1 for e in events if e.cultural_compliance_score < 0.95
        )
        if cultural_violations > len(events) * 0.05:  # More than 5% violations
            recommendations["cultural"].append(
                {
                    "type": "compliance",
                    "message": f"{cultural_violations} cultural compliance violations detected",
                    "action": "Review cultural validation rules and enhance Iraqi cultural context",
                    "priority": "high",
                }
            )

        # Security recommendations
        high_security_events = sum(1 for e in events if e.audit_required)
        if high_security_events > 0:
            recommendations["security"].append(
                {
                    "type": "audit",
                    "message": f"{high_security_events} events require enhanced security audit",
                    "action": "Ensure comprehensive audit logging and monitoring for sensitive operations",
                    "priority": "critical",
                }
            )

        # Set overall priority
        if any(
            r.get("priority") == "critical"
            for section in recommendations.values()
            if isinstance(section, list)
            for r in section
        ):
            recommendations["priority"] = "critical"
        elif any(
            r.get("priority") == "high"
            for section in recommendations.values()
            if isinstance(section, list)
            for r in section
        ):
            recommendations["priority"] = "high"

        return recommendations

    async def close(self):
        """Clean shutdown with final buffer flush"""
        await self._flush_buffers()
        self.logger.info("Iraqi Government Telemetry system shutdown complete")


# Example usage and testing
async def main():
    """Example usage of the Iraqi Government Telemetry system"""
    telemetry = IraqiGovernmentTelemetry(ministry_domain=MinistryDomain.EDUCATION)

    # Example event recording
    user_context = {
        "user_id": "gov_employee_12345",
        "session_id": "session_abc123",
        "auth_method": "iraqi_id_biometric",
        "security_level": "confidential",
        "department": "Higher Education Ministry",
        "ip_address": "192.168.1.100",
    }

    performance_data = {
        "response_time_ms": 85.5,
        "memory_usage_mb": 128.3,
        "cpu_usage_percent": 45.2,
    }

    content_data = {
        "text": "مرحباً، أحتاج للمساعدة في تقديم طلب للحصول على شهادة تخرج من الجامعة",
        "content_type": "user_query",
        "content_length": 67,
    }

    # Record event
    event_id = await telemetry.record_event(
        event_type="education_service_request",
        user_context=user_context,
        performance_data=performance_data,
        content_data=content_data,
        classification=TelemetryLevel.CONFIDENTIAL,
    )

    print(f"Recorded event: {event_id}")

    # Generate analytics report
    end_date = datetime.now()
    start_date = end_date - timedelta(days=7)

    report = await telemetry.generate_analytics_report(
        start_date=start_date, end_date=end_date, report_type="comprehensive"
    )

    print("Analytics Report Generated:")
    print(json.dumps(report, indent=2, ensure_ascii=False))

    await telemetry.close()


if __name__ == "__main__":
    asyncio.run(main())
