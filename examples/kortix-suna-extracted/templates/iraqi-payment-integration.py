"""
Iraqi Payment Gateway Integration Templates
Supports ZainCash, FastPay, and NassWallet payment gateways for Iraqi businesses
"""

from typing import Dict, Any, Optional
from enum import Enum
from datetime import datetime
import hashlib
import hmac
import json
import aiohttp
from pydantic import BaseModel, Field
from decimal import Decimal


class PaymentGateway(str, Enum):
    ZAINCASH = "zaincash"
    FASTPAY = "fastpay"
    NASSWALLET = "nasswallet"


class Currency(str, Enum):
    IQD = "IQD"  # Iraqi Dinar
    USD = "USD"  # US Dollar (for some gateways)


class PaymentStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"


class IraqiPaymentRequest(BaseModel):
    """Standard payment request model for Iraqi gateways"""

    amount: Decimal = Field(..., gt=0, description="Payment amount")
    currency: Currency = Field(default=Currency.IQD)
    gateway: PaymentGateway
    customer_id: str
    customer_name: str
    customer_phone: str
    order_id: str
    description: str
    callback_url: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class IraqiPaymentResponse(BaseModel):
    """Standard payment response model"""

    payment_id: str
    gateway: PaymentGateway
    status: PaymentStatus
    amount: Decimal
    currency: Currency
    transaction_id: Optional[str] = None
    gateway_response: Dict[str, Any]
    created_at: datetime
    updated_at: datetime


# ZainCash Integration
class ZainCashConfig(BaseModel):
    merchant_id: str
    secret_key: str
    base_url: str = "https://api.zaincash.iq"
    minimum_amount: Decimal = Field(default=Decimal("1000"))  # 1000 IQD minimum
    maximum_amount: Decimal = Field(default=Decimal("25000000"))  # 25M IQD maximum


class ZainCashGateway:
    """ZainCash payment gateway integration for Iraqi businesses"""

    def __init__(self, config: ZainCashConfig):
        self.config = config
        self.session = aiohttp.ClientSession()

    def _generate_signature(self, data: Dict[str, Any]) -> str:
        """Generate HMAC signature for ZainCash API"""
        # Sort parameters alphabetically
        sorted_params = sorted(data.items())
        query_string = "&".join([f"{k}={v}" for k, v in sorted_params])

        # Generate HMAC-SHA256 signature
        signature = hmac.new(
            self.config.secret_key.encode(), query_string.encode(), hashlib.sha256
        ).hexdigest()

        return signature

    async def create_payment(
        self, request: IraqiPaymentRequest
    ) -> IraqiPaymentResponse:
        """Create payment transaction with ZainCash"""
        if request.amount < self.config.minimum_amount:
            raise ValueError(f"Amount below minimum: {self.config.minimum_amount} IQD")

        if request.amount > self.config.maximum_amount:
            raise ValueError(f"Amount above maximum: {self.config.maximum_amount} IQD")

        # Prepare ZainCash API request
        payment_data = {
            "amount": str(int(request.amount)),  # ZainCash expects integer fils
            "serviceType": "PaymentRequest",
            "msisdn": request.customer_phone,
            "orderId": request.order_id,
            "redirectUrl": request.callback_url or "",
            "iat": int(datetime.now().timestamp()),
            "exp": int(datetime.now().timestamp()) + 3600,  # 1 hour expiry
        }

        # Add signature
        payment_data["signature"] = self._generate_signature(payment_data)

        # Make API request
        async with self.session.post(
            f"{self.config.base_url}/transaction/init",
            json=payment_data,
            headers={"Content-Type": "application/json"},
        ) as response:
            result = await response.json()

            if response.status == 200 and result.get("status") == "success":
                return IraqiPaymentResponse(
                    payment_id=result["id"],
                    gateway=PaymentGateway.ZAINCASH,
                    status=PaymentStatus.PENDING,
                    amount=request.amount,
                    currency=request.currency,
                    transaction_id=result.get("transactionId"),
                    gateway_response=result,
                    created_at=datetime.now(),
                    updated_at=datetime.now(),
                )
            else:
                raise Exception(f"ZainCash payment failed: {result}")

    async def verify_payment(self, payment_id: str) -> IraqiPaymentResponse:
        """Verify payment status with ZainCash"""
        async with self.session.get(
            f"{self.config.base_url}/transaction/{payment_id}"
        ) as response:
            result = await response.json()

            status_mapping = {
                "success": PaymentStatus.COMPLETED,
                "pending": PaymentStatus.PENDING,
                "failed": PaymentStatus.FAILED,
                "cancelled": PaymentStatus.CANCELLED,
            }

            return IraqiPaymentResponse(
                payment_id=payment_id,
                gateway=PaymentGateway.ZAINCASH,
                status=status_mapping.get(result.get("status"), PaymentStatus.FAILED),
                amount=Decimal(result.get("amount", 0)),
                currency=Currency.IQD,
                transaction_id=result.get("transactionId"),
                gateway_response=result,
                created_at=datetime.fromisoformat(
                    result.get("createdAt", datetime.now().isoformat())
                ),
                updated_at=datetime.now(),
            )


# FastPay Integration
class FastPayConfig(BaseModel):
    api_key: str
    merchant_code: str
    base_url: str = "https://api.fastpay.iq"
    minimum_amount: Decimal = Field(default=Decimal("500"))  # 500 IQD minimum
    maximum_amount: Decimal = Field(default=Decimal("10000000"))  # 10M IQD maximum


class FastPayGateway:
    """FastPay payment gateway integration for Iraqi businesses"""

    def __init__(self, config: FastPayConfig):
        self.config = config
        self.session = aiohttp.ClientSession()

    async def create_payment(
        self, request: IraqiPaymentRequest
    ) -> IraqiPaymentResponse:
        """Create payment transaction with FastPay"""
        if request.amount < self.config.minimum_amount:
            raise ValueError(f"Amount below minimum: {self.config.minimum_amount} IQD")

        if request.amount > self.config.maximum_amount:
            raise ValueError(f"Amount above maximum: {self.config.maximum_amount} IQD")

        payment_data = {
            "merchant_code": self.config.merchant_code,
            "amount": float(request.amount),
            "currency": request.currency.value,
            "order_id": request.order_id,
            "customer_name": request.customer_name,
            "customer_phone": request.customer_phone,
            "description": request.description,
            "callback_url": request.callback_url,
            "timestamp": int(datetime.now().timestamp()),
        }

        headers = {
            "Authorization": f"Bearer {self.config.api_key}",
            "Content-Type": "application/json",
        }

        async with self.session.post(
            f"{self.config.base_url}/v1/payments", json=payment_data, headers=headers
        ) as response:
            result = await response.json()

            if response.status == 200 and result.get("success"):
                return IraqiPaymentResponse(
                    payment_id=result["payment_id"],
                    gateway=PaymentGateway.FASTPAY,
                    status=PaymentStatus.PENDING,
                    amount=request.amount,
                    currency=request.currency,
                    transaction_id=result.get("transaction_id"),
                    gateway_response=result,
                    created_at=datetime.now(),
                    updated_at=datetime.now(),
                )
            else:
                raise Exception(f"FastPay payment failed: {result}")


# NassWallet Integration
class NassWalletConfig(BaseModel):
    wallet_id: str
    api_secret: str
    base_url: str = "https://api.nasswallet.com"
    minimum_amount: Decimal = Field(default=Decimal("1000"))  # 1000 IQD minimum
    maximum_amount: Decimal = Field(default=Decimal("50000000"))  # 50M IQD maximum


class NassWalletGateway:
    """NassWallet payment gateway integration for Iraqi businesses"""

    def __init__(self, config: NassWalletConfig):
        self.config = config
        self.session = aiohttp.ClientSession()

    def _generate_signature(self, data: str) -> str:
        """Generate signature for NassWallet API"""
        return hmac.new(
            self.config.api_secret.encode(), data.encode(), hashlib.sha256
        ).hexdigest()

    async def create_payment(
        self, request: IraqiPaymentRequest
    ) -> IraqiPaymentResponse:
        """Create payment transaction with NassWallet"""
        if request.amount < self.config.minimum_amount:
            raise ValueError(f"Amount below minimum: {self.config.minimum_amount} IQD")

        if request.amount > self.config.maximum_amount:
            raise ValueError(f"Amount above maximum: {self.config.maximum_amount} IQD")

        payment_data = {
            "wallet_id": self.config.wallet_id,
            "amount": str(request.amount),
            "currency": request.currency.value,
            "reference": request.order_id,
            "customer": {
                "name": request.customer_name,
                "phone": request.customer_phone,
            },
            "description": request.description,
            "return_url": request.callback_url,
            "timestamp": datetime.now().isoformat(),
        }

        # Generate signature
        data_string = json.dumps(payment_data, sort_keys=True)
        signature = self._generate_signature(data_string)

        headers = {"X-Nass-Signature": signature, "Content-Type": "application/json"}

        async with self.session.post(
            f"{self.config.base_url}/api/v1/payments",
            json=payment_data,
            headers=headers,
        ) as response:
            result = await response.json()

            if response.status == 200 and result.get("status") == "created":
                return IraqiPaymentResponse(
                    payment_id=result["payment_id"],
                    gateway=PaymentGateway.NASSWALLET,
                    status=PaymentStatus.PENDING,
                    amount=request.amount,
                    currency=request.currency,
                    transaction_id=result.get("transaction_id"),
                    gateway_response=result,
                    created_at=datetime.now(),
                    updated_at=datetime.now(),
                )
            else:
                raise Exception(f"NassWallet payment failed: {result}")


# Unified Iraqi Payment Service
class IraqiPaymentService:
    """Unified service for all Iraqi payment gateways"""

    def __init__(
        self,
        zaincash_config: Optional[ZainCashConfig] = None,
        fastpay_config: Optional[FastPayConfig] = None,
        nasswallet_config: Optional[NassWalletConfig] = None,
    ):
        self.gateways = {}

        if zaincash_config:
            self.gateways[PaymentGateway.ZAINCASH] = ZainCashGateway(zaincash_config)
        if fastpay_config:
            self.gateways[PaymentGateway.FASTPAY] = FastPayGateway(fastpay_config)
        if nasswallet_config:
            self.gateways[PaymentGateway.NASSWALLET] = NassWalletGateway(
                nasswallet_config
            )

    async def create_payment(
        self, request: IraqiPaymentRequest
    ) -> IraqiPaymentResponse:
        """Create payment using specified gateway"""
        if request.gateway not in self.gateways:
            raise ValueError(f"Gateway {request.gateway} not configured")

        gateway = self.gateways[request.gateway]
        return await gateway.create_payment(request)

    async def verify_payment(
        self, payment_id: str, gateway: PaymentGateway
    ) -> IraqiPaymentResponse:
        """Verify payment status"""
        if gateway not in self.gateways:
            raise ValueError(f"Gateway {gateway} not configured")

        gateway_instance = self.gateways[gateway]
        return await gateway_instance.verify_payment(payment_id)

    def get_available_gateways(self) -> list[PaymentGateway]:
        """Get list of configured payment gateways"""
        return list(self.gateways.keys())

    def get_gateway_info(self, gateway: PaymentGateway) -> Dict[str, Any]:
        """Get gateway configuration info"""
        gateway_info = {
            PaymentGateway.ZAINCASH: {
                "name": "ZainCash",
                "currency": "IQD",
                "min_amount": 1000,
                "max_amount": 25000000,
                "fees": "2.5% + 250 IQD",
                "processing_time": "Instant",
            },
            PaymentGateway.FASTPAY: {
                "name": "FastPay",
                "currency": "IQD/USD",
                "min_amount": 500,
                "max_amount": 10000000,
                "fees": "2.0% + 200 IQD",
                "processing_time": "1-3 minutes",
            },
            PaymentGateway.NASSWALLET: {
                "name": "NassWallet",
                "currency": "IQD",
                "min_amount": 1000,
                "max_amount": 50000000,
                "fees": "1.5% + 150 IQD",
                "processing_time": "Instant",
            },
        }

        return gateway_info.get(gateway, {})


# Usage Example for Iraqi AI Chat System
"""
Example usage in FastAPI application:

from iraqi_payment_integration import IraqiPaymentService, IraqiPaymentRequest, PaymentGateway

# Configure payment service
payment_service = IraqiPaymentService(
    zaincash_config=ZainCashConfig(
        merchant_id="your_merchant_id",
        secret_key="your_secret_key"
    ),
    fastpay_config=FastPayConfig(
        api_key="your_api_key",
        merchant_code="your_merchant_code"
    ),
    nasswallet_config=NassWalletConfig(
        wallet_id="your_wallet_id",
        api_secret="your_api_secret"
    )
)

# Create payment
payment_request = IraqiPaymentRequest(
    amount=Decimal("5000"),  # 5000 IQD
    gateway=PaymentGateway.ZAINCASH,
    customer_id="user_123",
    customer_name="أحمد علي",
    customer_phone="07901234567",
    order_id="order_456",
    description="AI Chat System Subscription - الاشتراك في نظام الذكاء الاصطناعي",
    callback_url="https://yourapp.com/payment/callback"
)

payment_response = await payment_service.create_payment(payment_request)
"""
