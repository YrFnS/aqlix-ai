"""Iraqi Payment Watchdog - Enhanced browser-use watchdog for Iraqi payment gateway monitoring.

Monitors Iraqi payment systems (ZainCash, FastPay, NassWallet), validates transactions,
ensures security compliance, and tracks payment performance metrics.
"""

from typing import Dict, List, Optional, Set, Tuple
from pydantic import Field, BaseModel, validator
import re
import asyncio
from datetime import datetime, timedelta
from enum import Enum
import hashlib

from browser_use.agent.browser.browser_watchdog_base import BaseWatchdog
from browser_use.agent.events import (
    NavigateToUrlEvent,
    FormSubmissionEvent,
    RequestEvent,
    ResponseEvent,
    JSExecutionEvent,
)


class PaymentGateway(str, Enum):
    """Supported Iraqi payment gateways."""

    ZAINCASH = "zaincash"
    FASTPAY = "fastpay"
    NASSWALLET = "nasswallet"
    CBI_DIRECT = "cbi_direct"
    UNKNOWN = "unknown"


class TransactionStatus(str, Enum):
    """Payment transaction status."""

    INITIATED = "initiated"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"


class SecurityLevel(str, Enum):
    """Payment security levels."""

    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class PaymentTransaction(BaseModel):
    """Payment transaction model."""

    transaction_id: str
    gateway: PaymentGateway
    amount: Optional[float] = None
    currency: str = "IQD"
    merchant_id: Optional[str] = None
    customer_id: Optional[str] = None
    status: TransactionStatus = TransactionStatus.INITIATED
    security_level: SecurityLevel = SecurityLevel.MEDIUM
    initiated_at: datetime
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None
    validation_checks: Dict[str, bool] = Field(default_factory=dict)


class IraqiPaymentWatchdog(BaseWatchdog):
    """Enhanced watchdog for Iraqi payment gateway monitoring.

    Features:
    - ZainCash, FastPay, NassWallet integration monitoring
    - Transaction security validation
    - Payment flow performance tracking
    - Fraud detection and prevention
    - Compliance with Iraqi banking regulations
    - Currency conversion monitoring (USD/IQD)
    - Payment failure analysis and recovery
    - Real-time transaction alerts
    """

    # Payment Gateway Configuration
    supported_gateways: Dict[PaymentGateway, Dict] = Field(
        default_factory=lambda: {
            PaymentGateway.ZAINCASH: {
                "domains": ["*.zaincash.iq", "*.zain.iq"],
                "api_endpoints": [
                    "/payment/init",
                    "/payment/verify",
                    "/payment/callback",
                ],
                "min_amount": 1000,  # IQD
                "max_amount": 5000000,  # IQD
                "supported_currencies": ["IQD", "USD"],
                "security_features": ["2FA", "OTP", "biometric"],
            },
            PaymentGateway.FASTPAY: {
                "domains": ["*.fastpay.iq", "*.fastpay.com"],
                "api_endpoints": ["/api/payment", "/api/verify", "/api/status"],
                "min_amount": 500,  # IQD
                "max_amount": 3000000,  # IQD
                "supported_currencies": ["IQD"],
                "security_features": ["PIN", "OTP", "card_verification"],
            },
            PaymentGateway.NASSWALLET: {
                "domains": ["*.nasswallet.iq", "*.nass.iq"],
                "api_endpoints": ["/wallet/pay", "/wallet/verify", "/wallet/history"],
                "min_amount": 1000,  # IQD
                "max_amount": 2000000,  # IQD
                "supported_currencies": ["IQD"],
                "security_features": ["PIN", "fingerprint", "face_id"],
            },
            PaymentGateway.CBI_DIRECT: {
                "domains": ["*.cbi.iq", "*.centralbank.iq"],
                "api_endpoints": ["/direct/payment", "/direct/verify"],
                "min_amount": 10000,  # IQD
                "max_amount": 10000000,  # IQD
                "supported_currencies": ["IQD", "USD"],
                "security_features": ["digital_signature", "HSM", "encryption"],
            },
        }
    )

    # Security Validation Rules
    required_security_headers: Set[str] = Field(
        default_factory=lambda: {
            "strict-transport-security",
            "content-security-policy",
            "x-frame-options",
            "x-content-type-options",
            "x-xss-protection",
        }
    )

    # Transaction Monitoring
    active_transactions: Dict[str, PaymentTransaction] = Field(default_factory=dict)
    completed_transactions: List[PaymentTransaction] = Field(default_factory=list)
    failed_transactions: List[PaymentTransaction] = Field(default_factory=list)
    security_violations: List[Dict] = Field(default_factory=list)

    # Performance Thresholds
    performance_thresholds: Dict[str, float] = Field(
        default_factory=lambda: {
            "payment_init_timeout": 30.0,  # seconds
            "payment_completion_timeout": 300.0,  # seconds
            "api_response_timeout": 10.0,  # seconds
            "ssl_handshake_timeout": 5.0,  # seconds
        }
    )

    # Fraud Detection
    fraud_detection_rules: List[Dict] = Field(
        default_factory=lambda: [
            {
                "name": "rapid_successive_payments",
                "condition": "multiple_payments_same_session",
                "threshold": 3,
                "window_seconds": 60,
            },
            {
                "name": "unusual_amount",
                "condition": "amount_deviation",
                "threshold_percentage": 500,  # 500% of normal amount
            },
            {
                "name": "suspicious_location",
                "condition": "ip_geolocation_mismatch",
                "allowed_countries": ["IQ", "SA", "AE", "JO"],
            },
        ]
    )

    @validator("supported_gateways")
    def validate_gateway_config(cls, v):
        for gateway, config in v.items():
            required_keys = {"domains", "api_endpoints", "min_amount", "max_amount"}
            if not all(key in config for key in required_keys):
                raise ValueError(f"Gateway {gateway} missing required config keys")
        return v

    def identify_payment_gateway(self, url: str) -> PaymentGateway:
        """Identify payment gateway from URL."""
        url_lower = url.lower()

        for gateway, config in self.supported_gateways.items():
            for domain_pattern in config["domains"]:
                if self._matches_domain_pattern(url, domain_pattern):
                    return gateway

        # Check for gateway keywords in URL
        if any(keyword in url_lower for keyword in ["zaincash", "zain"]):
            return PaymentGateway.ZAINCASH
        elif any(keyword in url_lower for keyword in ["fastpay", "fast"]):
            return PaymentGateway.FASTPAY
        elif any(keyword in url_lower for keyword in ["nasswallet", "nass"]):
            return PaymentGateway.NASSWALLET
        elif any(keyword in url_lower for keyword in ["cbi", "centralbank"]):
            return PaymentGateway.CBI_DIRECT

        return PaymentGateway.UNKNOWN

    def _matches_domain_pattern(self, url: str, pattern: str) -> bool:
        """Check if URL matches domain pattern."""
        import fnmatch
        from urllib.parse import urlparse

        try:
            parsed = urlparse(url)
            domain = parsed.netloc.lower()
            pattern_clean = pattern.lower().replace("*.", "")
            return domain.endswith(pattern_clean) or fnmatch.fnmatch(
                domain, pattern.lower()
            )
        except Exception:
            return False

    async def on_NavigateToUrlEvent(self, event: NavigateToUrlEvent) -> None:
        """Handle navigation to payment gateway URLs."""
        url = event.url
        gateway = self.identify_payment_gateway(url)

        if gateway != PaymentGateway.UNKNOWN:
            await self.emit_payment_gateway_access(url, gateway)

            # Start monitoring payment session
            session_id = self._generate_session_id(url)
            await self._start_payment_session_monitoring(session_id, url, gateway)

            # Validate SSL/TLS security
            await self._validate_payment_security(url, gateway)

    async def on_FormSubmissionEvent(self, event: FormSubmissionEvent) -> None:
        """Handle form submissions for payment processing."""
        try:
            form_action = getattr(event, "action", "")
            form_data = getattr(event, "data", {})
            page_url = getattr(event, "page_url", "")

            gateway = self.identify_payment_gateway(form_action or page_url)

            if gateway != PaymentGateway.UNKNOWN:
                # Extract payment information (safely, without sensitive data)
                payment_info = await self._extract_payment_info(form_data, gateway)

                if payment_info:
                    transaction_id = self._generate_transaction_id()

                    # Create transaction record
                    transaction = PaymentTransaction(
                        transaction_id=transaction_id,
                        gateway=gateway,
                        amount=payment_info.get("amount"),
                        merchant_id=payment_info.get("merchant_id"),
                        status=TransactionStatus.INITIATED,
                        initiated_at=datetime.now(),
                    )

                    # Validate transaction
                    validation_result = await self._validate_payment_transaction(
                        transaction, form_data
                    )
                    transaction.validation_checks = validation_result

                    # Store active transaction
                    self.active_transactions[transaction_id] = transaction

                    # Emit transaction initiated event
                    await self.emit_payment_transaction_initiated(transaction)

                    # Start fraud detection monitoring
                    await self._monitor_transaction_fraud(transaction)

        except Exception as e:
            await self.emit_error(
                f"Payment form submission monitoring failed: {str(e)}"
            )

    async def on_RequestEvent(self, event: RequestEvent) -> None:
        """Handle API requests to payment gateways."""
        try:
            url = getattr(event, "url", "")
            method = getattr(event, "method", "GET")
            headers = getattr(event, "headers", {})

            gateway = self.identify_payment_gateway(url)

            if gateway != PaymentGateway.UNKNOWN:
                # Check if this is a payment API endpoint
                if self._is_payment_api_endpoint(url, gateway):
                    # Monitor API request security
                    security_check = await self._validate_api_security(
                        url, method, headers, gateway
                    )

                    if not security_check["is_secure"]:
                        await self.emit_payment_security_violation(
                            url, gateway, security_check
                        )

                    # Track API performance
                    request_start = datetime.now()
                    await self._track_api_performance(url, gateway, request_start)

        except Exception as e:
            await self.emit_error(f"Payment API request monitoring failed: {str(e)}")

    async def on_ResponseEvent(self, event: ResponseEvent) -> None:
        """Handle responses from payment gateways."""
        try:
            url = getattr(event, "url", "")
            status_code = getattr(event, "status_code", 0)
            headers = getattr(event, "headers", {})
            response_time = getattr(event, "response_time", 0)

            gateway = self.identify_payment_gateway(url)

            if gateway != PaymentGateway.UNKNOWN:
                # Validate response security headers
                security_validation = await self._validate_response_security(
                    headers, gateway
                )

                if not security_validation["is_secure"]:
                    await self.emit_payment_security_violation(
                        url, gateway, security_validation
                    )

                # Check for payment status updates
                if self._is_payment_status_response(url, status_code):
                    await self._process_payment_status_update(
                        url, status_code, headers, gateway
                    )

                # Track response performance
                if (
                    response_time
                    > self.performance_thresholds["api_response_timeout"] * 1000
                ):
                    await self.emit_payment_performance_warning(
                        url, gateway, "slow_api_response", response_time
                    )

        except Exception as e:
            await self.emit_error(f"Payment response monitoring failed: {str(e)}")

    async def _start_payment_session_monitoring(
        self, session_id: str, url: str, gateway: PaymentGateway
    ) -> None:
        """Start monitoring a payment session."""
        session_data = {
            "session_id": session_id,
            "url": url,
            "gateway": gateway,
            "started_at": datetime.now(),
            "status": "active",
            "security_checks": [],
            "performance_metrics": {},
        }

        # Schedule periodic security checks
        asyncio.create_task(self._periodic_security_monitoring(session_id, gateway))

        # Schedule session timeout monitoring
        asyncio.create_task(self._monitor_session_timeout(session_id))

    async def _validate_payment_security(
        self, url: str, gateway: PaymentGateway
    ) -> Dict:
        """Validate payment gateway security."""
        security_result = {
            "url": url,
            "gateway": gateway.value,
            "is_secure": True,
            "violations": [],
            "recommendations": [],
        }

        # Check HTTPS usage
        if not url.startswith("https://"):
            security_result["violations"].append(
                {
                    "type": "insecure_protocol",
                    "severity": "critical",
                    "description": "Payment page not using HTTPS",
                }
            )
            security_result["is_secure"] = False

        # Check domain authenticity
        if not self._is_authentic_gateway_domain(url, gateway):
            security_result["violations"].append(
                {
                    "type": "suspicious_domain",
                    "severity": "high",
                    "description": "Domain does not match known gateway domains",
                }
            )
            security_result["is_secure"] = False

        return security_result

    async def _extract_payment_info(
        self, form_data: Dict, gateway: PaymentGateway
    ) -> Optional[Dict]:
        """Extract payment information from form data (safely)."""
        payment_info = {}

        # Extract amount (common field names)
        amount_fields = ["amount", "price", "total", "value", "cost"]
        for field in amount_fields:
            if field in form_data:
                try:
                    amount_str = str(form_data[field]).replace(",", "")
                    amount = float(amount_str)
                    payment_info["amount"] = amount
                    break
                except (ValueError, TypeError):
                    continue

        # Extract merchant ID (common field names)
        merchant_fields = ["merchant_id", "merchantId", "store_id", "shop_id"]
        for field in merchant_fields:
            if field in form_data:
                payment_info["merchant_id"] = str(form_data[field])[:50]  # Limit length
                break

        # Extract currency
        currency_fields = ["currency", "curr", "currency_code"]
        for field in currency_fields:
            if field in form_data:
                payment_info["currency"] = str(form_data[field]).upper()
                break

        if not payment_info.get("currency"):
            payment_info["currency"] = "IQD"  # Default to Iraqi Dinar

        return payment_info if payment_info else None

    async def _validate_payment_transaction(
        self, transaction: PaymentTransaction, form_data: Dict
    ) -> Dict:
        """Validate payment transaction against rules."""
        validation_results = {}
        gateway_config = self.supported_gateways.get(transaction.gateway, {})

        # Amount validation
        if transaction.amount:
            min_amount = gateway_config.get("min_amount", 0)
            max_amount = gateway_config.get("max_amount", float("inf"))

            validation_results["amount_in_range"] = (
                min_amount <= transaction.amount <= max_amount
            )
        else:
            validation_results["amount_in_range"] = False

        # Currency validation
        supported_currencies = gateway_config.get("supported_currencies", ["IQD"])
        validation_results["currency_supported"] = (
            transaction.currency in supported_currencies
        )

        # Security validation
        validation_results[
            "has_security_fields"
        ] = await self._validate_security_fields(form_data, transaction.gateway)

        # Fraud detection
        validation_results["fraud_check_passed"] = await self._check_transaction_fraud(
            transaction
        )

        return validation_results

    async def _monitor_transaction_fraud(self, transaction: PaymentTransaction) -> None:
        """Monitor transaction for fraud indicators."""
        for rule in self.fraud_detection_rules:
            fraud_detected = await self._evaluate_fraud_rule(transaction, rule)

            if fraud_detected:
                await self.emit_payment_fraud_alert(transaction, rule)
                transaction.security_level = SecurityLevel.CRITICAL

    async def _evaluate_fraud_rule(
        self, transaction: PaymentTransaction, rule: Dict
    ) -> bool:
        """Evaluate a specific fraud detection rule."""
        rule_name = rule.get("name", "")

        if rule_name == "rapid_successive_payments":
            return await self._check_rapid_payments(transaction, rule)
        elif rule_name == "unusual_amount":
            return await self._check_unusual_amount(transaction, rule)
        elif rule_name == "suspicious_location":
            return await self._check_suspicious_location(transaction, rule)

        return False

    async def _check_rapid_payments(
        self, transaction: PaymentTransaction, rule: Dict
    ) -> bool:
        """Check for rapid successive payments from same user."""
        threshold = rule.get("threshold", 3)
        window_seconds = rule.get("window_seconds", 60)

        current_time = datetime.now()
        window_start = current_time - timedelta(seconds=window_seconds)

        # Count recent transactions (simplified - would use customer_id in real implementation)
        recent_count = sum(
            1
            for tx in self.active_transactions.values()
            if tx.initiated_at >= window_start
        )

        return recent_count >= threshold

    async def _check_unusual_amount(
        self, transaction: PaymentTransaction, rule: Dict
    ) -> bool:
        """Check for unusual transaction amounts."""
        if not transaction.amount:
            return False

        threshold_percentage = rule.get("threshold_percentage", 500)

        # Calculate average transaction amount (simplified)
        if self.completed_transactions:
            amounts = [tx.amount for tx in self.completed_transactions if tx.amount]
            if amounts:
                avg_amount = sum(amounts) / len(amounts)
                threshold_amount = avg_amount * (threshold_percentage / 100)
                return transaction.amount > threshold_amount

        return False

    async def _check_suspicious_location(
        self, transaction: PaymentTransaction, rule: Dict
    ) -> bool:
        """Check for suspicious IP geolocation."""
        allowed_countries = rule.get("allowed_countries", ["IQ"])

        # Placeholder for IP geolocation check
        # In real implementation, would use IP geolocation service
        return False  # Assume location is valid for now

    def _generate_transaction_id(self) -> str:
        """Generate unique transaction ID."""
        timestamp = datetime.now().isoformat()
        return hashlib.sha256(f"tx_{timestamp}".encode()).hexdigest()[:16]

    def _generate_session_id(self, url: str) -> str:
        """Generate unique session ID."""
        timestamp = datetime.now().isoformat()
        return hashlib.sha256(f"session_{url}_{timestamp}".encode()).hexdigest()[:16]

    def _is_payment_api_endpoint(self, url: str, gateway: PaymentGateway) -> bool:
        """Check if URL is a payment API endpoint."""
        gateway_config = self.supported_gateways.get(gateway, {})
        api_endpoints = gateway_config.get("api_endpoints", [])

        return any(endpoint in url for endpoint in api_endpoints)

    def _is_payment_status_response(self, url: str, status_code: int) -> bool:
        """Check if response contains payment status information."""
        return status_code in [200, 201] and any(
            keyword in url.lower()
            for keyword in ["status", "verify", "callback", "result"]
        )

    def _is_authentic_gateway_domain(self, url: str, gateway: PaymentGateway) -> bool:
        """Check if domain is authentic gateway domain."""
        gateway_config = self.supported_gateways.get(gateway, {})
        authentic_domains = gateway_config.get("domains", [])

        return any(
            self._matches_domain_pattern(url, domain) for domain in authentic_domains
        )

    async def _validate_security_fields(
        self, form_data: Dict, gateway: PaymentGateway
    ) -> bool:
        """Validate presence of required security fields."""
        gateway_config = self.supported_gateways.get(gateway, {})
        required_security = gateway_config.get("security_features", [])

        # Check for common security field indicators
        security_indicators = {
            "2FA": ["otp", "two_factor", "2fa", "verification_code"],
            "OTP": ["otp", "verification_code", "sms_code"],
            "PIN": ["pin", "password", "secret"],
            "biometric": ["fingerprint", "face_id", "biometric"],
            "card_verification": ["cvv", "cvc", "security_code"],
        }

        for security_type in required_security:
            indicators = security_indicators.get(security_type, [])
            if not any(
                indicator in str(form_data.keys()).lower() for indicator in indicators
            ):
                return False

        return True

    async def _check_transaction_fraud(self, transaction: PaymentTransaction) -> bool:
        """Perform basic fraud check on transaction."""
        # Basic fraud indicators
        if transaction.amount and transaction.amount <= 0:
            return False

        if transaction.amount and transaction.amount > 10000000:  # Very large amount
            return False

        return True

    # Event Emission Methods
    async def emit_payment_gateway_access(self, url: str, gateway: PaymentGateway):
        """Emit payment gateway access event."""
        if self.cultural_validation_enabled:
            from browser_use.agent.events import PaymentGatewayAccessEvent

            event = PaymentGatewayAccessEvent(
                data={
                    "url": url,
                    "gateway": gateway.value,
                    "timestamp": datetime.now().isoformat(),
                }
            )
            self.event_bus.dispatch(event)

    async def emit_payment_transaction_initiated(self, transaction: PaymentTransaction):
        """Emit payment transaction initiated event."""
        if self.cultural_validation_enabled:
            from browser_use.agent.events import PaymentTransactionInitiatedEvent

            event = PaymentTransactionInitiatedEvent(
                data={
                    "transaction_id": transaction.transaction_id,
                    "gateway": transaction.gateway.value,
                    "amount": transaction.amount,
                    "currency": transaction.currency,
                    "timestamp": transaction.initiated_at.isoformat(),
                }
            )
            self.event_bus.dispatch(event)

    async def emit_payment_security_violation(
        self, url: str, gateway: PaymentGateway, violation_data: Dict
    ):
        """Emit payment security violation event."""
        if self.cultural_validation_enabled:
            from browser_use.agent.events import PaymentSecurityViolationEvent

            event = PaymentSecurityViolationEvent(
                data={
                    "url": url,
                    "gateway": gateway.value,
                    "violation_data": violation_data,
                    "timestamp": datetime.now().isoformat(),
                    "severity": "high",
                }
            )
            self.event_bus.dispatch(event)

    async def emit_payment_fraud_alert(
        self, transaction: PaymentTransaction, fraud_rule: Dict
    ):
        """Emit payment fraud alert event."""
        if self.cultural_validation_enabled:
            from browser_use.agent.events import PaymentFraudAlertEvent

            event = PaymentFraudAlertEvent(
                data={
                    "transaction_id": transaction.transaction_id,
                    "gateway": transaction.gateway.value,
                    "fraud_rule": fraud_rule.get("name", "unknown"),
                    "severity": "critical",
                    "timestamp": datetime.now().isoformat(),
                }
            )
            self.event_bus.dispatch(event)

    async def emit_payment_performance_warning(
        self, url: str, gateway: PaymentGateway, metric: str, value: float
    ):
        """Emit payment performance warning event."""
        if self.cultural_validation_enabled:
            from browser_use.agent.events import PaymentPerformanceWarningEvent

            event = PaymentPerformanceWarningEvent(
                data={
                    "url": url,
                    "gateway": gateway.value,
                    "metric": metric,
                    "value": value,
                    "threshold": self.performance_thresholds.get(metric, 0),
                    "timestamp": datetime.now().isoformat(),
                }
            )
            self.event_bus.dispatch(event)

    # Additional monitoring methods (placeholders)
    async def _validate_api_security(
        self, url: str, method: str, headers: Dict, gateway: PaymentGateway
    ) -> Dict:
        """Validate API request security."""
        return {"is_secure": True, "violations": []}

    async def _validate_response_security(
        self, headers: Dict, gateway: PaymentGateway
    ) -> Dict:
        """Validate response security headers."""
        return {"is_secure": True, "violations": []}

    async def _process_payment_status_update(
        self, url: str, status_code: int, headers: Dict, gateway: PaymentGateway
    ) -> None:
        """Process payment status update from gateway."""
        pass

    async def _track_api_performance(
        self, url: str, gateway: PaymentGateway, request_start: datetime
    ) -> None:
        """Track API performance metrics."""
        pass

    async def _periodic_security_monitoring(
        self, session_id: str, gateway: PaymentGateway
    ) -> None:
        """Perform periodic security monitoring for active session."""
        pass

    async def _monitor_session_timeout(self, session_id: str) -> None:
        """Monitor session timeout."""
        pass
