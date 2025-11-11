"""
Pydantic models for payment processing
Defines data structures for Iraqi payment gateway integration
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field
from enum import Enum


class PaymentGateway(str, Enum):
    """Iraqi payment gateways"""

    ZAINCASH = "zaincash"  # Min: 1000 IQD
    FASTPAY = "fastpay"  # Min: 500 IQD
    NASSWALLET = "nasswallet"  # Min: 1000 IQD


class PaymentStatus(str, Enum):
    """Payment transaction status"""

    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"


class PaymentMethod(str, Enum):
    """Payment method types"""

    SUBSCRIPTION = "subscription"
    ONE_TIME = "one_time"
    CREDIT = "credit"


class Currency(str, Enum):
    """Supported currencies"""

    IQD = "IQD"  # Iraqi Dinar (default)
    USD = "USD"  # US Dollar


class PaymentInitiateRequest(BaseModel):
    """Request to initiate a payment"""

    amount: int = Field(
        ..., description="Amount in smallest currency unit (fils for IQD)", ge=1
    )
    currency: Currency = Field(default=Currency.IQD, description="Currency code")
    gateway: PaymentGateway = Field(..., description="Payment gateway to use")
    payment_method: PaymentMethod = Field(..., description="Payment method type")
    description: Optional[str] = Field(None, description="Payment description")
    order_id: Optional[str] = Field(None, description="Order ID for tracking")
    customer_phone: Optional[str] = Field(None, description="Customer phone number")
    return_url: str = Field(..., description="URL to return after payment")
    cancel_url: Optional[str] = Field(None, description="URL if payment cancelled")


class PaymentInitiateResponse(BaseModel):
    """Response for payment initiation"""

    payment_id: str = Field(..., description="Payment transaction ID")
    gateway_transaction_id: Optional[str] = Field(
        None, description="Gateway-specific transaction ID"
    )
    redirect_url: str = Field(..., description="URL to redirect user for payment")
    status: PaymentStatus = Field(..., description="Payment status")
    amount: int = Field(..., description="Amount to pay")
    currency: Currency = Field(..., description="Currency")
    gateway: PaymentGateway = Field(..., description="Payment gateway")
    expires_at: datetime = Field(..., description="Payment expiration time")
    created_at: datetime = Field(..., description="Creation timestamp")


class PaymentStatusRequest(BaseModel):
    """Request to check payment status"""

    payment_id: str = Field(..., description="Payment ID")


class PaymentStatusResponse(BaseModel):
    """Payment status response"""

    payment_id: str = Field(..., description="Payment ID")
    status: PaymentStatus = Field(..., description="Current payment status")
    gateway_transaction_id: Optional[str] = Field(
        None, description="Gateway transaction ID"
    )
    amount: int = Field(..., description="Payment amount")
    currency: Currency = Field(..., description="Currency")
    gateway: PaymentGateway = Field(..., description="Payment gateway")
    user_id: str = Field(..., description="User ID")
    completed_at: Optional[datetime] = Field(None, description="Completion timestamp")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")


class PaymentWebhookEvent(BaseModel):
    """Webhook event from payment gateway"""

    event_type: str = Field(
        ..., description="Event type (payment.completed, payment.failed, etc)"
    )
    payment_id: str = Field(..., description="Payment ID")
    gateway_transaction_id: str = Field(..., description="Gateway transaction ID")
    status: PaymentStatus = Field(..., description="Payment status")
    amount: int = Field(..., description="Amount")
    currency: str = Field(..., description="Currency")
    timestamp: datetime = Field(..., description="Event timestamp")
    gateway_signature: Optional[str] = Field(
        None, description="Gateway signature for verification"
    )


class PaymentRefundRequest(BaseModel):
    """Request to refund a payment"""

    payment_id: str = Field(..., description="Payment ID to refund")
    reason: str = Field(..., description="Refund reason")
    amount: Optional[int] = Field(
        None, description="Partial refund amount (if None, full refund)"
    )


class PaymentRefundResponse(BaseModel):
    """Response for refund request"""

    refund_id: str = Field(..., description="Refund transaction ID")
    payment_id: str = Field(..., description="Original payment ID")
    amount: int = Field(..., description="Refunded amount")
    currency: Currency = Field(..., description="Currency")
    status: PaymentStatus = Field(..., description="Refund status")
    reason: str = Field(..., description="Refund reason")
    created_at: datetime = Field(..., description="Refund timestamp")


class PaymentTransaction(BaseModel):
    """Payment transaction record"""

    id: str = Field(..., description="Transaction ID")
    user_id: str = Field(..., description="User ID")
    amount: int = Field(..., description="Amount in smallest currency unit")
    currency: Currency = Field(..., description="Currency")
    gateway: PaymentGateway = Field(..., description="Payment gateway")
    gateway_transaction_id: Optional[str] = Field(
        None, description="Gateway transaction ID"
    )
    status: PaymentStatus = Field(..., description="Transaction status")
    description: Optional[str] = Field(None, description="Transaction description")
    order_id: Optional[str] = Field(None, description="Associated order ID")
    payment_method: PaymentMethod = Field(..., description="Payment method")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")
    completed_at: Optional[datetime] = Field(None, description="Completion timestamp")


class PaymentHistoryResponse(BaseModel):
    """Payment history response"""

    transactions: List[PaymentTransaction] = Field(
        ..., description="List of transactions"
    )
    total: int = Field(..., description="Total number of transactions")
    limit: int = Field(..., description="Limit used for query")
    offset: int = Field(..., description="Offset used for query")
    total_spent: int = Field(..., description="Total amount spent by user")
