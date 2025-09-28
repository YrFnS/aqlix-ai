"""
Iraqi Payment Gateway Router - Enhanced routing for Iraqi payment systems
Part of Claude Code Router extraction with Iraqi cultural compliance

Implements intelligent routing for ZainCash, FastPay, and NassWallet gateways
with cultural validation, transaction monitoring, and failover management.
"""

from typing import Dict, List, Optional, Union, Any, Tuple
from dataclasses import dataclass, field
from enum import Enum
import asyncio
import json
import time
from datetime import datetime, timedelta
import hashlib
import logging
from abc import ABC, abstractmethod


class IraqiPaymentGateway(Enum):
    """Supported Iraqi payment gateways"""

    ZAINCASH = "zaincash"
    FASTPAY = "fastpay"
    NASSWALLET = "nasswallet"
    GOVERNMENT = "government"  # Iraqi government payment system


class PaymentMethod(Enum):
    """Payment method types"""

    MOBILE_WALLET = "mobile_wallet"
    BANK_TRANSFER = "bank_transfer"
    CREDIT_CARD = "credit_card"
    GOVERNMENT_VOUCHER = "government_voucher"


class TransactionPriority(Enum):
    """Transaction priority levels"""

    LOW = 1
    NORMAL = 2
    HIGH = 3
    CRITICAL = 4  # Government or emergency transactions


@dataclass
class IraqiPaymentRequest:
    """Enhanced payment request with Iraqi context"""

    amount: int  # Amount in Iraqi Dinar (IQD)
    currency: str = "IQD"
    payment_method: PaymentMethod = PaymentMethod.MOBILE_WALLET
    preferred_gateway: Optional[IraqiPaymentGateway] = None
    fallback_gateways: List[IraqiPaymentGateway] = field(default_factory=list)

    # Iraqi-specific fields
    is_government_payment: bool = False
    requires_islamic_compliance: bool = True
    professional_domain: Optional[str] = None  # legal, medical, education
    customer_governorate: Optional[str] = None  # Iraqi governorate

    # Cultural context
    arabic_description: Optional[str] = None
    cultural_context: Dict[str, Any] = field(default_factory=dict)
    priority: TransactionPriority = TransactionPriority.NORMAL

    # Technical fields
    request_id: str = ""
    timestamp: datetime = field(default_factory=datetime.now)
    retry_count: int = 0
    max_retries: int = 3


@dataclass
class GatewayStatus:
    """Gateway availability and performance status"""

    gateway: IraqiPaymentGateway
    is_available: bool
    response_time_ms: float
    success_rate: float  # 0.0 to 1.0
    queue_length: int
    last_check: datetime
    error_count: int = 0
    cultural_compliance_score: float = 1.0  # 0.0 to 1.0


@dataclass
class RoutingDecision:
    """Payment gateway routing decision"""

    selected_gateway: IraqiPaymentGateway
    fallback_sequence: List[IraqiPaymentGateway]
    routing_reason: str
    cultural_validation_passed: bool
    estimated_processing_time: int  # seconds
    confidence_score: float  # 0.0 to 1.0
    routing_metadata: Dict[str, Any] = field(default_factory=dict)


class IraqiPaymentGatewayRouter:
    """
    Enhanced payment gateway router with Iraqi cultural compliance

    Provides intelligent routing for Iraqi payment gateways with:
    - Cultural validation and Islamic compliance
    - Professional domain awareness
    - Load balancing and failover
    - Performance monitoring and optimization
    """

    def __init__(self):
        self.logger = logging.getLogger(__name__)

        # Gateway configurations
        self.gateway_configs = {
            IraqiPaymentGateway.ZAINCASH: {
                "name": "زين كاش",
                "arabic_name": "زين كاش",
                "max_amount": 1000000,  # 1M IQD
                "min_amount": 1000,  # 1K IQD
                "processing_time": 30,  # seconds
                "availability": 0.98,
                "islamic_compliant": True,
                "government_approved": True,
                "supported_governorates": "all",
            },
            IraqiPaymentGateway.FASTPAY: {
                "name": "فاست باي",
                "arabic_name": "فاست باي",
                "max_amount": 500000,  # 500K IQD
                "min_amount": 500,  # 500 IQD
                "processing_time": 20,  # seconds
                "availability": 0.95,
                "islamic_compliant": True,
                "government_approved": True,
                "supported_governorates": ["Baghdad", "Basra", "Erbil", "Najaf"],
            },
            IraqiPaymentGateway.NASSWALLET: {
                "name": "محفظة نص",
                "arabic_name": "محفظة نص",
                "max_amount": 1000000,  # 1M IQD
                "min_amount": 1000,  # 1K IQD
                "processing_time": 25,  # seconds
                "availability": 0.96,
                "islamic_compliant": True,
                "government_approved": True,
                "supported_governorates": "all",
            },
            IraqiPaymentGateway.GOVERNMENT: {
                "name": "النظام الحكومي للدفع",
                "arabic_name": "النظام الحكومي للدفع العراقي",
                "max_amount": 10000000,  # 10M IQD
                "min_amount": 100,  # 100 IQD
                "processing_time": 60,  # seconds
                "availability": 0.99,
                "islamic_compliant": True,
                "government_approved": True,
                "supported_governorates": "all",
            },
        }

        # Gateway status tracking
        self.gateway_status: Dict[IraqiPaymentGateway, GatewayStatus] = {}
        self._initialize_gateway_status()

        # Cultural validation rules
        self.cultural_rules = {
            "islamic_compliance": {
                "no_interest": True,
                "no_gambling": True,
                "no_alcohol": True,
                "halal_only": True,
            },
            "professional_domains": {
                "legal": {"min_amount": 5000, "max_processing_time": 120},
                "medical": {"min_amount": 1000, "max_processing_time": 60},
                "education": {"min_amount": 500, "max_processing_time": 180},
                "government": {"min_amount": 100, "max_processing_time": 300},
            },
        }

        # Performance metrics
        self.metrics = {
            "total_requests": 0,
            "successful_routes": 0,
            "failed_routes": 0,
            "average_response_time": 0.0,
            "cultural_compliance_rate": 1.0,
        }

    def _initialize_gateway_status(self):
        """Initialize gateway status tracking"""
        for gateway in IraqiPaymentGateway:
            config = self.gateway_configs[gateway]
            self.gateway_status[gateway] = GatewayStatus(
                gateway=gateway,
                is_available=True,
                response_time_ms=config["processing_time"] * 1000,
                success_rate=config["availability"],
                queue_length=0,
                last_check=datetime.now(),
                cultural_compliance_score=1.0 if config["islamic_compliant"] else 0.5,
            )

    async def route_payment(self, request: IraqiPaymentRequest) -> RoutingDecision:
        """
        Route payment request to optimal Iraqi gateway

        Args:
            request: Payment request with Iraqi context

        Returns:
            RoutingDecision with selected gateway and fallbacks
        """
        start_time = time.time()

        try:
            # Update metrics
            self.metrics["total_requests"] += 1

            # Cultural validation
            cultural_validation = await self._validate_cultural_compliance(request)
            if not cultural_validation["is_compliant"]:
                self.logger.warning(
                    f"Cultural validation failed: {cultural_validation['reason']}"
                )
                return RoutingDecision(
                    selected_gateway=IraqiPaymentGateway.ZAINCASH,  # Default safe option
                    fallback_sequence=[],
                    routing_reason=f"Cultural validation failed: {cultural_validation['reason']}",
                    cultural_validation_passed=False,
                    estimated_processing_time=60,
                    confidence_score=0.0,
                )

            # Get available gateways
            available_gateways = await self._get_available_gateways(request)

            if not available_gateways:
                raise Exception("No available payment gateways")

            # Calculate routing scores
            gateway_scores = {}
            for gateway in available_gateways:
                score = await self._calculate_gateway_score(gateway, request)
                gateway_scores[gateway] = score

            # Select best gateway
            selected_gateway = max(
                gateway_scores.keys(), key=lambda g: gateway_scores[g]
            )

            # Build fallback sequence
            fallback_sequence = sorted(
                [g for g in gateway_scores.keys() if g != selected_gateway],
                key=lambda g: gateway_scores[g],
                reverse=True,
            )

            # Calculate estimated processing time
            estimated_time = self.gateway_configs[selected_gateway]["processing_time"]
            if request.priority == TransactionPriority.CRITICAL:
                estimated_time = int(estimated_time * 0.7)  # Priority processing

            decision = RoutingDecision(
                selected_gateway=selected_gateway,
                fallback_sequence=fallback_sequence,
                routing_reason=f"Optimal gateway based on score: {gateway_scores[selected_gateway]:.2f}",
                cultural_validation_passed=True,
                estimated_processing_time=estimated_time,
                confidence_score=gateway_scores[selected_gateway],
                routing_metadata={
                    "gateway_scores": gateway_scores,
                    "cultural_validation": cultural_validation,
                    "processing_time_ms": (time.time() - start_time) * 1000,
                },
            )

            self.metrics["successful_routes"] += 1
            return decision

        except Exception as e:
            self.logger.error(f"Payment routing failed: {str(e)}")
            self.metrics["failed_routes"] += 1

            # Return emergency fallback
            return RoutingDecision(
                selected_gateway=IraqiPaymentGateway.ZAINCASH,
                fallback_sequence=[
                    IraqiPaymentGateway.NASSWALLET,
                    IraqiPaymentGateway.FASTPAY,
                ],
                routing_reason=f"Emergency fallback due to error: {str(e)}",
                cultural_validation_passed=False,
                estimated_processing_time=60,
                confidence_score=0.1,
            )

    async def _validate_cultural_compliance(
        self, request: IraqiPaymentRequest
    ) -> Dict[str, Any]:
        """Validate payment request against Iraqi cultural requirements"""

        validation_result = {
            "is_compliant": True,
            "reason": "",
            "score": 1.0,
            "violations": [],
        }

        # Islamic compliance check
        if request.requires_islamic_compliance:
            if request.amount <= 0:
                validation_result["violations"].append("Invalid amount")
                validation_result["score"] -= 0.3

            # Check for prohibited transaction types based on description
            if request.arabic_description:
                prohibited_keywords = ["فوائد", "قمار", "خمور", "كحول"]
                description_lower = request.arabic_description.lower()
                for keyword in prohibited_keywords:
                    if keyword in description_lower:
                        validation_result["violations"].append(
                            f"Contains prohibited content: {keyword}"
                        )
                        validation_result["score"] -= 0.5

        # Professional domain validation
        if request.professional_domain:
            domain_rules = self.cultural_rules["professional_domains"].get(
                request.professional_domain, {}
            )

            if (
                "min_amount" in domain_rules
                and request.amount < domain_rules["min_amount"]
            ):
                validation_result["violations"].append(
                    f"Amount below minimum for {request.professional_domain}"
                )
                validation_result["score"] -= 0.2

        # Government payment special handling
        if request.is_government_payment:
            if (
                request.priority != TransactionPriority.HIGH
                and request.priority != TransactionPriority.CRITICAL
            ):
                validation_result["violations"].append(
                    "Government payments require high priority"
                )
                validation_result["score"] -= 0.1

        # Final compliance decision
        if validation_result["score"] < 0.7:
            validation_result["is_compliant"] = False
            validation_result["reason"] = "; ".join(validation_result["violations"])

        return validation_result

    async def _get_available_gateways(
        self, request: IraqiPaymentRequest
    ) -> List[IraqiPaymentGateway]:
        """Get list of available gateways for the request"""

        available = []

        for gateway, status in self.gateway_status.items():
            config = self.gateway_configs[gateway]

            # Check basic availability
            if not status.is_available:
                continue

            # Check amount limits
            if (
                request.amount > config["max_amount"]
                or request.amount < config["min_amount"]
            ):
                continue

            # Check governorate support
            if (
                request.customer_governorate
                and config["supported_governorates"] != "all"
                and request.customer_governorate not in config["supported_governorates"]
            ):
                continue

            # Check government payment requirements
            if (
                request.is_government_payment
                and gateway != IraqiPaymentGateway.GOVERNMENT
            ):
                # Allow other gateways but with lower priority
                pass

            available.append(gateway)

        # Ensure government gateway is available for government payments
        if (
            request.is_government_payment
            and IraqiPaymentGateway.GOVERNMENT not in available
        ):
            if self.gateway_status[IraqiPaymentGateway.GOVERNMENT].is_available:
                available.append(IraqiPaymentGateway.GOVERNMENT)

        return available

    async def _calculate_gateway_score(
        self, gateway: IraqiPaymentGateway, request: IraqiPaymentRequest
    ) -> float:
        """Calculate routing score for a gateway"""

        status = self.gateway_status[gateway]
        config = self.gateway_configs[gateway]

        # Base score from success rate
        score = status.success_rate * 0.4

        # Response time factor (lower is better)
        time_factor = max(
            0, 1 - (status.response_time_ms / 60000)
        )  # Normalize to 60s max
        score += time_factor * 0.2

        # Queue length factor (lower is better)
        queue_factor = max(0, 1 - (status.queue_length / 100))  # Normalize to 100 max
        score += queue_factor * 0.1

        # Cultural compliance factor
        score += status.cultural_compliance_score * 0.2

        # Preferred gateway bonus
        if request.preferred_gateway == gateway:
            score += 0.2

        # Professional domain optimization
        if request.professional_domain:
            domain_rules = self.cultural_rules["professional_domains"].get(
                request.professional_domain, {}
            )
            if config["processing_time"] <= domain_rules.get(
                "max_processing_time", 300
            ):
                score += 0.1

        # Government payment priority
        if request.is_government_payment and gateway == IraqiPaymentGateway.GOVERNMENT:
            score += 0.3

        # Amount optimization
        amount_ratio = request.amount / config["max_amount"]
        if 0.1 <= amount_ratio <= 0.8:  # Sweet spot for amount handling
            score += 0.05

        return min(1.0, score)  # Cap at 1.0

    async def update_gateway_status(
        self, gateway: IraqiPaymentGateway, response_time_ms: float, success: bool
    ):
        """Update gateway performance metrics"""

        status = self.gateway_status[gateway]

        # Update response time (moving average)
        status.response_time_ms = status.response_time_ms * 0.8 + response_time_ms * 0.2

        # Update success rate (moving average)
        current_success = 1.0 if success else 0.0
        status.success_rate = status.success_rate * 0.9 + current_success * 0.1

        # Update error count
        if not success:
            status.error_count += 1
        else:
            status.error_count = max(0, status.error_count - 1)

        # Update availability based on recent performance
        status.is_available = status.success_rate > 0.5 and status.error_count < 10

        status.last_check = datetime.now()

        # Update global metrics
        self.metrics["average_response_time"] = (
            self.metrics["average_response_time"] * 0.9 + response_time_ms * 0.1
        )

    def get_gateway_health(self) -> Dict[str, Any]:
        """Get comprehensive gateway health report"""

        health_report = {
            "overall_health": "healthy",
            "total_gateways": len(self.gateway_status),
            "available_gateways": sum(
                1 for s in self.gateway_status.values() if s.is_available
            ),
            "average_response_time": self.metrics["average_response_time"],
            "success_rate": self.metrics["successful_routes"]
            / max(1, self.metrics["total_requests"]),
            "cultural_compliance_rate": self.metrics["cultural_compliance_rate"],
            "gateway_details": {},
        }

        for gateway, status in self.gateway_status.items():
            config = self.gateway_configs[gateway]
            health_report["gateway_details"][gateway.value] = {
                "name": config["name"],
                "arabic_name": config["arabic_name"],
                "available": status.is_available,
                "response_time_ms": status.response_time_ms,
                "success_rate": status.success_rate,
                "queue_length": status.queue_length,
                "cultural_compliance": status.cultural_compliance_score,
                "last_check": status.last_check.isoformat(),
            }

        # Determine overall health
        available_ratio = (
            health_report["available_gateways"] / health_report["total_gateways"]
        )
        if available_ratio < 0.5:
            health_report["overall_health"] = "critical"
        elif available_ratio < 0.8:
            health_report["overall_health"] = "warning"

        return health_report


# Cultural validation utilities
class IraqiPaymentValidator:
    """Utilities for Iraqi payment cultural validation"""

    @staticmethod
    def validate_islamic_compliance(amount: int, description: str) -> bool:
        """Validate payment for Islamic compliance"""

        # Check for interest-based transactions
        prohibited_terms = ["فائدة", "ربا", "قرض بفائدة"]
        description_lower = description.lower()

        for term in prohibited_terms:
            if term in description_lower:
                return False

        # Validate amount (no negative or zero amounts)
        return amount > 0

    @staticmethod
    def get_arabic_gateway_name(gateway: IraqiPaymentGateway) -> str:
        """Get Arabic name for payment gateway"""

        arabic_names = {
            IraqiPaymentGateway.ZAINCASH: "زين كاش",
            IraqiPaymentGateway.FASTPAY: "فاست باي",
            IraqiPaymentGateway.NASSWALLET: "محفظة نص",
            IraqiPaymentGateway.GOVERNMENT: "النظام الحكومي للدفع",
        }

        return arabic_names.get(gateway, gateway.value)

    @staticmethod
    def format_iraqi_amount(amount: int) -> str:
        """Format amount in Iraqi Dinar with proper Arabic numerals"""

        # Convert to Arabic numerals
        arabic_numerals = str(amount).translate(
            str.maketrans("0123456789", "٠١٢٣٤٥٦٧٨٩")
        )

        # Add currency symbol
        return f"{arabic_numerals} د.ع"
