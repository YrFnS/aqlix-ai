"""
Monitoring and Error Tracking Service
Integrates Sentry for error tracking and performance monitoring
"""

import logging
import os
from typing import Optional, Dict, Any
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
from sentry_sdk.integrations.redis import RedisIntegration

logger = logging.getLogger(__name__)


class MonitoringService:
    """
    Service for initializing and managing error tracking and monitoring.

    Features:
    - Sentry integration for error tracking
    - Performance monitoring (Sentry Performance)
    - Structured logging
    - Custom error context
    - Dashboard metrics
    """

    @staticmethod
    def initialize_sentry(
        dsn: Optional[str] = None,
        environment: str = "development",
        traces_sample_rate: float = 0.1,
        debug: bool = False,
    ) -> bool:
        """
        Initialize Sentry for error tracking.

        Args:
            dsn: Sentry DSN URL
            environment: Environment name (development, staging, production)
            traces_sample_rate: Fraction of transactions to sample (0.0 - 1.0)
            debug: Enable debug mode

        Returns:
            True if initialized successfully, False otherwise
        """
        try:
            if not dsn:
                logger.info("⚠️  Sentry DSN not configured - error tracking disabled")
                return False

            sentry_sdk.init(
                dsn=dsn,
                environment=environment,
                traces_sample_rate=traces_sample_rate,
                debug=debug,
                # Integrations
                integrations=[
                    FastApiIntegration(),
                    SqlalchemyIntegration(),
                    RedisIntegration(),
                ],
                # Performance monitoring
                enable_tracing=True,
                # Release tracking (set in CI/CD)
                release=os.getenv("APP_VERSION", "unknown"),
                # Error sampling
                sample_rate=1.0,  # Capture 100% of errors
                # Attach stack traces
                attach_stacktrace=True,
                # Include local variables in stack traces
                include_local_variables=debug,
            )

            logger.info("✅ Sentry initialized for error tracking")
            return True
        except Exception as e:
            logger.error(f"❌ Failed to initialize Sentry: {e}")
            return False

    @staticmethod
    def setup_structured_logging(
        log_level: str = "INFO",
        format: str = "json",
    ) -> None:
        """
        Setup structured logging with JSON format.

        Args:
            log_level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
            format: Log format (json or text)
        """
        try:
            # Import structlog if available
            try:
                import structlog

                structlog.configure(
                    processors=[
                        structlog.stdlib.filter_by_level,
                        structlog.stdlib.add_logger_name,
                        structlog.stdlib.add_log_level,
                        structlog.stdlib.PositionalArgumentsFormatter(),
                        structlog.processors.TimeStamper(fmt="iso"),
                        structlog.processors.StackInfoRenderer(),
                        structlog.processors.format_exc_info,
                        structlog.processors.UnicodeDecoder(),
                        structlog.processors.JSONRenderer(),
                    ],
                    context_class=dict,
                    logger_factory=structlog.stdlib.LoggerFactory(),
                    cache_logger_on_first_use=True,
                )
                logger.info("✅ Structured JSON logging enabled")
            except ImportError:
                logger.warning("⚠️  structlog not installed - using standard logging")
                # Configure standard Python logging
                logging.basicConfig(
                    level=getattr(logging, log_level),
                    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
                )

        except Exception as e:
            logger.error(f"Failed to setup structured logging: {e}")

    @staticmethod
    def capture_exception(
        error: Exception,
        context: Optional[Dict[str, Any]] = None,
        level: str = "error",
    ) -> None:
        """
        Capture an exception to Sentry with optional context.

        Args:
            error: The exception to capture
            context: Additional context information
            level: Error level (info, warning, error, fatal)
        """
        try:
            with sentry_sdk.push_scope() as scope:
                if context:
                    for key, value in context.items():
                        scope.set_context(key, value)

                scope.set_level(level)
                sentry_sdk.capture_exception(error)

                logger.info(f"Captured {level} to Sentry: {str(error)}")
        except Exception as e:
            logger.error(f"Failed to capture exception to Sentry: {e}")

    @staticmethod
    def set_user_context(
        user_id: str,
        email: Optional[str] = None,
        ip_address: Optional[str] = None,
    ) -> None:
        """
        Set user context for Sentry error tracking.

        Args:
            user_id: Unique user identifier
            email: User email address
            ip_address: User IP address
        """
        try:
            sentry_sdk.set_user(
                {
                    "id": user_id,
                    "email": email,
                    "ip_address": ip_address,
                }
            )
        except Exception as e:
            logger.error(f"Failed to set user context in Sentry: {e}")

    @staticmethod
    def clear_user_context() -> None:
        """Clear user context from Sentry."""
        try:
            sentry_sdk.set_user(None)
        except Exception as e:
            logger.error(f"Failed to clear user context: {e}")

    @staticmethod
    def add_breadcrumb(
        message: str,
        category: str = "info",
        level: str = "info",
        data: Optional[Dict[str, Any]] = None,
    ) -> None:
        """
        Add a breadcrumb for transaction tracking.

        Useful for tracking user actions leading up to an error.

        Args:
            message: Breadcrumb message
            category: Breadcrumb category
            level: Breadcrumb level
            data: Additional data
        """
        try:
            sentry_sdk.add_breadcrumb(
                message=message,
                category=category,
                level=level,
                data=data or {},
            )
        except Exception as e:
            logger.error(f"Failed to add breadcrumb: {e}")

    @staticmethod
    def start_transaction(
        name: str,
        op: str = "http.server",
    ) -> Optional[Any]:
        """
        Start a new transaction for performance monitoring.

        Args:
            name: Transaction name
            op: Operation type

        Returns:
            Transaction object or None
        """
        try:
            transaction = sentry_sdk.start_transaction(
                name=name,
                op=op,
            )
            return transaction
        except Exception as e:
            logger.error(f"Failed to start transaction: {e}")
            return None

    @staticmethod
    def create_dashboard_config() -> Dict[str, Any]:
        """
        Get recommended dashboard configuration for key metrics.

        Returns:
            Dashboard configuration dictionary
        """
        return {
            "dashboards": [
                {
                    "name": "API Health",
                    "panels": [
                        {
                            "title": "Error Rate",
                            "query": 'event.type:"error"',
                            "visualization": "line",
                        },
                        {
                            "title": "API Response Time (P95)",
                            "query": 'transaction.op:"http.server"',
                            "visualization": "line",
                        },
                        {
                            "title": "Throughput",
                            "query": 'event.type:"transaction"',
                            "visualization": "line",
                        },
                    ],
                },
                {
                    "name": "Business Metrics",
                    "panels": [
                        {
                            "title": "Chat Completion Rate",
                            "query": 'tags.event_type:"chat_completion"',
                            "visualization": "line",
                        },
                        {
                            "title": "Payment Success Rate",
                            "query": 'tags.event_type:"payment_completed"',
                            "visualization": "gauge",
                        },
                        {
                            "title": "Document Processing Time",
                            "query": 'tags.event_type:"document_processed"',
                            "visualization": "line",
                        },
                    ],
                },
                {
                    "name": "User Activity",
                    "panels": [
                        {
                            "title": "Active Users",
                            "query": "user.id:[* TO *]",
                            "visualization": "stat",
                        },
                        {
                            "title": "Error by Region",
                            "query": "tags.region:[* TO *]",
                            "visualization": "bar",
                        },
                    ],
                },
            ],
            "alerts": [
                {
                    "name": "High Error Rate",
                    "condition": "error_rate > 5%",
                    "actions": ["email", "slack"],
                },
                {
                    "name": "API Latency Alert",
                    "condition": "p95_latency > 1000ms",
                    "actions": ["email", "slack"],
                },
                {
                    "name": "Payment Failure",
                    "condition": "payment_failed > 10 in 1 hour",
                    "actions": ["email", "sms", "slack"],
                },
            ],
        }

    @staticmethod
    def get_monitoring_config() -> Dict[str, Any]:
        """
        Get comprehensive monitoring configuration.

        Returns:
            Monitoring configuration dictionary
        """
        return {
            "sentry": {
                "enabled": bool(os.getenv("SENTRY_DSN")),
                "environment": os.getenv("SENTRY_ENVIRONMENT", "development"),
                "traces_sample_rate": float(
                    os.getenv("SENTRY_TRACES_SAMPLE_RATE", "0.1")
                ),
                "performance_monitoring": True,
                "error_tracking": True,
            },
            "logging": {
                "level": os.getenv("LOG_LEVEL", "INFO"),
                "format": "json",
                "structured": True,
                "output": ["stdout", "file"],
            },
            "metrics": {
                "api_response_time_target": 200,  # ms
                "chat_completion_target": 5000,  # ms
                "payment_success_target": 99,  # %
                "error_rate_threshold": 5,  # %
            },
            "retention": {
                "error_logs": 30,  # days
                "transaction_logs": 7,  # days
                "performance_data": 90,  # days
            },
        }
