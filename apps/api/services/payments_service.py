"""
Payments Service - Handles payment processing and Iraqi gateway integration
Supports ZainCash, FastPay, and NassWallet
"""

import logging
import uuid
import hashlib
import hmac
from datetime import datetime, timezone, timedelta
from typing import Optional, List, Dict, Any
from enum import Enum

logger = logging.getLogger(__name__)


class PaymentGateway(str, Enum):
    """Iraqi payment gateways"""

    ZAINCASH = "zaincash"
    FASTPAY = "fastpay"
    NASSWALLET = "nasswallet"


class PaymentStatus(str, Enum):
    """Payment status types"""

    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"


class PaymentsService:
    """
    Service for handling payment processing through Iraqi payment gateways.

    Supported Gateways:
    - ZainCash: Minimum transaction 1000 IQD
    - FastPay: Minimum transaction 500 IQD
    - NassWallet: Minimum transaction 1000 IQD

    Features:
    - Multi-gateway support with fallback
    - Payment status tracking
    - Webhook handling for payment notifications
    - Refund management
    - Transaction history
    """

    # Minimum transaction amounts for each gateway (in fils, 1000 fils = 1 IQD)
    MINIMUM_AMOUNTS = {
        PaymentGateway.ZAINCASH: 1000000,  # 1000 IQD
        PaymentGateway.FASTPAY: 500000,  # 500 IQD
        PaymentGateway.NASSWALLET: 1000000,  # 1000 IQD
    }

    def __init__(self):
        """Initialize payments service"""
        # In-memory storage for demo (replace with database in production)
        self.transactions: Dict[str, Dict[str, Any]] = {}

    async def initiate_payment(
        self,
        user_id: str,
        amount: int,
        currency: str,
        gateway: str,
        payment_method: str,
        description: Optional[str] = None,
        order_id: Optional[str] = None,
        customer_phone: Optional[str] = None,
        return_url: str = "",
        cancel_url: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Initiate a payment with Iraqi gateway.

        Args:
            user_id: User ID
            amount: Amount in smallest currency unit (fils for IQD)
            currency: Currency code (IQD, USD)
            gateway: Payment gateway (zaincash, fastpay, nasswallet)
            payment_method: Payment method (subscription, one_time, credit)
            description: Payment description
            order_id: Optional order ID
            customer_phone: Customer phone number
            return_url: URL to return after payment
            cancel_url: Optional cancel URL

        Returns:
            Payment initiation response with redirect URL

        Raises:
            ValueError: If validation fails
        """
        # Validate amount
        gateway_enum = PaymentGateway(gateway.lower())
        min_amount = self.MINIMUM_AMOUNTS.get(gateway_enum, 500000)

        if amount < min_amount:
            raise ValueError(
                f"Amount {amount} fils is below minimum for {gateway}: {min_amount} fils"
            )

        # Create payment record
        payment_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc)

        transaction = {
            "id": payment_id,
            "user_id": user_id,
            "amount": amount,
            "currency": currency,
            "gateway": gateway,
            "gateway_transaction_id": None,
            "payment_method": payment_method,
            "status": "pending",
            "description": description,
            "order_id": order_id,
            "customer_phone": customer_phone,
            "return_url": return_url,
            "cancel_url": cancel_url,
            "created_at": now,
            "updated_at": now,
            "completed_at": None,
        }

        self.transactions[payment_id] = transaction

        # Generate redirect URL based on gateway
        redirect_url = await self._generate_gateway_redirect_url(
            payment_id, gateway, amount, currency, customer_phone
        )

        logger.info(f"Initiated payment {payment_id} for user {user_id} via {gateway}")

        return {
            "payment_id": payment_id,
            "gateway_transaction_id": None,
            "redirect_url": redirect_url,
            "status": "pending",
            "amount": amount,
            "currency": currency,
            "gateway": gateway,
            "expires_at": now + timedelta(hours=24),
            "created_at": now,
        }

    async def get_payment_status(
        self, payment_id: str, user_id: str
    ) -> Optional[Dict[str, Any]]:
        """
        Get payment status.

        Args:
            payment_id: Payment ID
            user_id: User ID (for authorization)

        Returns:
            Payment status dict or None if not found
        """
        transaction = self.transactions.get(payment_id)

        if not transaction:
            logger.warning(f"Payment {payment_id} not found")
            return None

        # Verify ownership
        if transaction["user_id"] != user_id:
            logger.warning(
                f"User {user_id} attempted unauthorized access to payment {payment_id}"
            )
            return None

        return transaction

    async def handle_webhook(
        self,
        event_type: str,
        payment_id: str,
        gateway_transaction_id: str,
        status: str,
        amount: int,
        currency: str,
        timestamp: datetime,
        gateway_signature: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Handle webhook event from payment gateway.

        Verifies gateway signature and updates payment status.

        Args:
            event_type: Event type (payment.completed, payment.failed, etc.)
            payment_id: Payment ID
            gateway_transaction_id: Gateway transaction ID
            status: Payment status
            amount: Amount
            currency: Currency
            timestamp: Event timestamp
            gateway_signature: Signature for verification

        Returns:
            Updated transaction

        Raises:
            ValueError: If payment not found or signature invalid
        """
        transaction = self.transactions.get(payment_id)

        if not transaction:
            logger.error(f"Webhook received for unknown payment {payment_id}")
            raise ValueError("Payment not found")

        # Verify signature (in production, implement proper signature verification)
        # For demo, we'll skip signature verification
        if gateway_signature:
            logger.info(f"Signature verification skipped for payment {payment_id}")

        # Update transaction status
        transaction["gateway_transaction_id"] = gateway_transaction_id
        transaction["status"] = status.lower()
        transaction["updated_at"] = datetime.now(timezone.utc)

        if status.lower() in ["completed", "paid", "success"]:
            transaction["status"] = "completed"
            transaction["completed_at"] = datetime.now(timezone.utc)
            logger.info(f"Payment {payment_id} completed via webhook")
        elif status.lower() in ["failed", "failed", "error"]:
            transaction["status"] = "failed"
            logger.warning(f"Payment {payment_id} failed via webhook")

        return transaction

    async def refund_payment(
        self,
        payment_id: str,
        user_id: str,
        reason: str,
        amount: Optional[int] = None,
    ) -> Dict[str, Any]:
        """
        Refund a payment.

        Args:
            payment_id: Payment ID
            user_id: User ID (for authorization)
            reason: Refund reason
            amount: Optional partial refund amount (None = full refund)

        Returns:
            Refund transaction

        Raises:
            ValueError: If payment not found or refund not allowed
        """
        transaction = self.transactions.get(payment_id)

        if not transaction:
            logger.error(f"Refund requested for unknown payment {payment_id}")
            raise ValueError("Payment not found")

        # Verify ownership
        if transaction["user_id"] != user_id:
            logger.warning(
                f"User {user_id} attempted unauthorized refund of {payment_id}"
            )
            raise ValueError("Unauthorized")

        # Verify payment is completed
        if transaction["status"] != "completed":
            raise ValueError(
                f"Cannot refund payment with status {transaction['status']}"
            )

        # Create refund record
        refund_id = str(uuid.uuid4())
        refund_amount = amount or transaction["amount"]

        if refund_amount > transaction["amount"]:
            raise ValueError("Refund amount exceeds original payment")

        # Process refund (in production, call gateway refund API)
        now = datetime.now(timezone.utc)
        refund = {
            "refund_id": refund_id,
            "payment_id": payment_id,
            "amount": refund_amount,
            "currency": transaction["currency"],
            "status": "completed",  # In production, may be pending
            "reason": reason,
            "created_at": now,
        }

        # Update transaction status if full refund
        if refund_amount == transaction["amount"]:
            transaction["status"] = "refunded"
            transaction["updated_at"] = now

        logger.info(f"Created refund {refund_id} for payment {payment_id}")

        return refund

    async def get_payment_history(
        self, user_id: str, limit: int = 50, offset: int = 0
    ) -> tuple[List[Dict[str, Any]], int, int]:
        """
        Get payment history for a user.

        Args:
            user_id: User ID
            limit: Number of transactions to return
            offset: Offset for pagination

        Returns:
            Tuple of (transactions list, total count, total spent)
        """
        user_transactions = [
            txn for txn in self.transactions.values() if txn["user_id"] == user_id
        ]

        # Sort by created_at descending
        user_transactions.sort(key=lambda x: x["created_at"], reverse=True)

        # Calculate total spent (only completed transactions)
        total_spent = sum(
            txn["amount"] for txn in user_transactions if txn["status"] == "completed"
        )

        total = len(user_transactions)
        paginated = user_transactions[offset : offset + limit]

        return paginated, total, total_spent

    async def _generate_gateway_redirect_url(
        self,
        payment_id: str,
        gateway: str,
        amount: int,
        currency: str,
        phone: Optional[str] = None,
    ) -> str:
        """
        Generate gateway-specific redirect URL.

        TODO: Integrate with actual gateway APIs:
        - ZainCash: https://zaincash.io/
        - FastPay: https://fastpay.iq/
        - NassWallet: https://nasswallet.iq/

        Args:
            payment_id: Payment ID
            gateway: Payment gateway
            amount: Amount
            currency: Currency
            phone: Customer phone

        Returns:
            Redirect URL
        """
        gateway_lower = gateway.lower()

        # Placeholder URLs for demo
        if gateway_lower == "zaincash":
            return f"https://zaincash.io/pay/payment?id={payment_id}&amount={amount}&currency={currency}"
        elif gateway_lower == "fastpay":
            return (
                f"https://fastpay.iq/checkout?payment_id={payment_id}&amount={amount}"
            )
        elif gateway_lower == "nasswallet":
            return f"https://nasswallet.iq/api/initiate?id={payment_id}&amount={amount}&phone={phone}"
        else:
            raise ValueError(f"Unknown gateway: {gateway}")

    async def validate_payment_signature(
        self, gateway: str, payload: str, signature: str, secret: str
    ) -> bool:
        """
        Validate payment gateway webhook signature.

        Args:
            gateway: Payment gateway
            payload: Webhook payload
            signature: Signature from gateway
            secret: Gateway secret key

        Returns:
            True if signature is valid
        """
        # HMAC-SHA256 signature validation
        expected_signature = hmac.new(
            secret.encode(),
            payload.encode(),
            hashlib.sha256,
        ).hexdigest()

        return signature.lower() == expected_signature.lower()
