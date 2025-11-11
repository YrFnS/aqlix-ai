"""
Payments API Routes
FastAPI endpoints for payment processing via Iraqi payment gateways
Supports ZainCash, FastPay, and NassWallet
"""

from fastapi import APIRouter, Depends, HTTPException, status, Request, Header
from typing import Optional
from datetime import datetime
import logging

# Import models and services
try:
    from apps.api.models.payments import (
        PaymentInitiateRequest,
        PaymentInitiateResponse,
        PaymentStatusRequest,
        PaymentStatusResponse,
        PaymentRefundRequest,
        PaymentRefundResponse,
        PaymentHistoryResponse,
        PaymentTransaction,
        PaymentWebhookEvent,
    )
    from apps.api.services.payments_service import PaymentsService
    from apps.api.middleware.auth_middleware import get_current_user_dependency
except ImportError:
    from models.payments import (
        PaymentInitiateRequest,
        PaymentInitiateResponse,
        PaymentStatusRequest,
        PaymentStatusResponse,
        PaymentRefundRequest,
        PaymentRefundResponse,
        PaymentHistoryResponse,
        PaymentTransaction,
        PaymentWebhookEvent,
    )
    from services.payments_service import PaymentsService
    from middleware.auth_middleware import get_current_user_dependency

logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/api/v1/payments", tags=["payments"])

# Initialize payments service
payments_service = PaymentsService()


# ========== PAYMENT INITIATION ENDPOINTS ==========


@router.post(
    "/initiate",
    response_model=PaymentInitiateResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Initiate payment",
    description="Initiate a payment with Iraqi payment gateway",
)
async def initiate_payment(
    request: PaymentInitiateRequest,
    current_user: dict = Depends(get_current_user_dependency),
):
    """
    Initiate a payment with an Iraqi payment gateway.

    Supported Gateways:
    - **ZainCash**: Minimum 1000 IQD
    - **FastPay**: Minimum 500 IQD
    - **NassWallet**: Minimum 1000 IQD

    The payment will expire in 24 hours if not completed.

    Args:
        request: Payment initiation request
        current_user: Current authenticated user

    Returns:
        PaymentInitiateResponse: Payment details with redirect URL

    Raises:
        HTTPException 400: If payment validation fails (amount too low, etc.)
        HTTPException 500: If payment processing fails
    """
    try:
        # Validate amount
        if request.amount < 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Payment amount must be greater than 0",
            )

        # Initiate payment
        payment_response = await payments_service.initiate_payment(
            user_id=current_user["user_id"],
            amount=request.amount,
            currency=request.currency.value,
            gateway=request.gateway.value,
            payment_method=request.payment_method.value,
            description=request.description,
            order_id=request.order_id,
            customer_phone=request.customer_phone,
            return_url=request.return_url,
            cancel_url=request.cancel_url,
        )

        return PaymentInitiateResponse(**payment_response)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error initiating payment: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to initiate payment",
        )


# ========== PAYMENT STATUS ENDPOINTS ==========


@router.post(
    "/status",
    response_model=PaymentStatusResponse,
    summary="Check payment status",
    description="Check the status of a payment transaction",
)
async def check_payment_status(
    request: PaymentStatusRequest,
    current_user: dict = Depends(get_current_user_dependency),
):
    """
    Check the status of a payment.

    Args:
        request: Payment status request
        current_user: Current authenticated user

    Returns:
        PaymentStatusResponse: Current payment status and details

    Raises:
        HTTPException 404: If payment not found or unauthorized
    """
    try:
        payment = await payments_service.get_payment_status(
            payment_id=request.payment_id,
            user_id=current_user["user_id"],
        )

        if not payment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment not found",
            )

        return PaymentStatusResponse(**payment)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error checking payment status: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to check payment status",
        )


@router.get(
    "/{payment_id}",
    response_model=PaymentStatusResponse,
    summary="Get payment details",
    description="Retrieve payment details by ID",
)
async def get_payment_details(
    payment_id: str,
    current_user: dict = Depends(get_current_user_dependency),
):
    """
    Get detailed payment information.

    Args:
        payment_id: Payment ID
        current_user: Current authenticated user

    Returns:
        PaymentStatusResponse: Payment details

    Raises:
        HTTPException 404: If payment not found or unauthorized
    """
    try:
        payment = await payments_service.get_payment_status(
            payment_id=payment_id,
            user_id=current_user["user_id"],
        )

        if not payment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Payment not found",
            )

        return PaymentStatusResponse(**payment)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving payment {payment_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve payment",
        )


# ========== REFUND ENDPOINTS ==========


@router.post(
    "/{payment_id}/refund",
    response_model=PaymentRefundResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Refund payment",
    description="Refund a completed payment (full or partial)",
)
async def refund_payment(
    payment_id: str,
    request: PaymentRefundRequest,
    current_user: dict = Depends(get_current_user_dependency),
):
    """
    Refund a completed payment.

    Supports both full and partial refunds. Only completed payments can be refunded.

    Args:
        payment_id: Payment ID
        request: Refund request with reason and optional amount
        current_user: Current authenticated user

    Returns:
        PaymentRefundResponse: Refund transaction details

    Raises:
        HTTPException 404: If payment not found or unauthorized
        HTTPException 400: If payment cannot be refunded
    """
    try:
        # Verify payment ID matches
        if request.payment_id != payment_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Payment ID mismatch",
            )

        # Process refund
        refund = await payments_service.refund_payment(
            payment_id=payment_id,
            user_id=current_user["user_id"],
            reason=request.reason,
            amount=request.amount,
        )

        return PaymentRefundResponse(**refund)
    except ValueError as e:
        if "not found" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=str(e),
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e),
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error refunding payment {payment_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to refund payment",
        )


# ========== PAYMENT HISTORY ENDPOINTS ==========


@router.get(
    "",
    response_model=PaymentHistoryResponse,
    summary="Get payment history",
    description="Retrieve payment history for the current user",
)
async def get_payment_history(
    limit: int = 50,
    offset: int = 0,
    current_user: dict = Depends(get_current_user_dependency),
):
    """
    Get payment history for the current user.

    Supports pagination. Results are sorted by most recent first.

    Args:
        limit: Number of payments to return (default: 50, max: 100)
        offset: Offset for pagination (default: 0)
        current_user: Current authenticated user

    Returns:
        PaymentHistoryResponse: List of transactions with summary

    Raises:
        HTTPException 500: If retrieval fails
    """
    try:
        # Validate pagination params
        limit = min(limit, 100)
        if offset < 0:
            offset = 0

        transactions, total, total_spent = await payments_service.get_payment_history(
            user_id=current_user["user_id"],
            limit=limit,
            offset=offset,
        )

        return PaymentHistoryResponse(
            transactions=[PaymentTransaction(**t) for t in transactions],
            total=total,
            limit=limit,
            offset=offset,
            total_spent=total_spent,
        )
    except Exception as e:
        logger.error(f"Error retrieving payment history: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve payment history",
        )


# ========== WEBHOOK ENDPOINTS (NO AUTHENTICATION) ==========


@router.post(
    "/webhooks/zaincash",
    summary="ZainCash webhook",
    description="Webhook endpoint for ZainCash payment notifications",
)
async def zaincash_webhook(
    request: Request,
    x_zaincash_signature: Optional[str] = Header(None),
):
    """
    Handle ZainCash payment notification webhook.

    ZainCash will POST payment status updates to this endpoint.

    Signature Verification:
    - Header: X-ZainCash-Signature
    - Algorithm: HMAC-SHA256

    Args:
        request: Webhook request
        x_zaincash_signature: ZainCash signature header

    Returns:
        dict: Webhook acknowledgment
    """
    try:
        # Parse webhook payload
        body = await request.json()

        logger.info(f"Received ZainCash webhook: {body}")

        # Verify signature (implement in production)
        # await payments_service.validate_payment_signature(
        #     gateway="zaincash",
        #     payload=request.body,
        #     signature=x_zaincash_signature,
        #     secret=settings.ZAINCASH_API_SECRET
        # )

        # Extract payment data
        payment_id = body.get("payment_id") or body.get("id")
        status = body.get("status")
        gateway_txn_id = body.get("transaction_id") or body.get("txn_id")

        if payment_id and status:
            # Update payment status
            await payments_service.handle_webhook(
                event_type="payment.zaincash",
                payment_id=payment_id,
                gateway_transaction_id=gateway_txn_id or payment_id,
                status=status,
                amount=body.get("amount", 0),
                currency=body.get("currency", "IQD"),
                timestamp=datetime.utcnow(),
                gateway_signature=x_zaincash_signature,
            )

        return {"status": "received"}
    except Exception as e:
        logger.error(f"Error processing ZainCash webhook: {e}")
        return {"status": "error", "message": str(e)}


@router.post(
    "/webhooks/fastpay",
    summary="FastPay webhook",
    description="Webhook endpoint for FastPay payment notifications",
)
async def fastpay_webhook(
    request: Request,
    x_fastpay_signature: Optional[str] = Header(None),
):
    """
    Handle FastPay payment notification webhook.

    Args:
        request: Webhook request
        x_fastpay_signature: FastPay signature header

    Returns:
        dict: Webhook acknowledgment
    """
    try:
        body = await request.json()

        logger.info(f"Received FastPay webhook: {body}")

        payment_id = body.get("payment_id") or body.get("id")
        status = body.get("status")

        if payment_id and status:
            await payments_service.handle_webhook(
                event_type="payment.fastpay",
                payment_id=payment_id,
                gateway_transaction_id=body.get("transaction_id", payment_id),
                status=status,
                amount=body.get("amount", 0),
                currency=body.get("currency", "IQD"),
                timestamp=datetime.utcnow(),
                gateway_signature=x_fastpay_signature,
            )

        return {"status": "received"}
    except Exception as e:
        logger.error(f"Error processing FastPay webhook: {e}")
        return {"status": "error", "message": str(e)}


@router.post(
    "/webhooks/nasswallet",
    summary="NassWallet webhook",
    description="Webhook endpoint for NassWallet payment notifications",
)
async def nasswallet_webhook(
    request: Request,
    x_nass_signature: Optional[str] = Header(None),
):
    """
    Handle NassWallet payment notification webhook.

    Args:
        request: Webhook request
        x_nass_signature: NassWallet signature header

    Returns:
        dict: Webhook acknowledgment
    """
    try:
        body = await request.json()

        logger.info(f"Received NassWallet webhook: {body}")

        payment_id = body.get("payment_id") or body.get("id")
        status = body.get("status")

        if payment_id and status:
            await payments_service.handle_webhook(
                event_type="payment.nasswallet",
                payment_id=payment_id,
                gateway_transaction_id=body.get("transaction_id", payment_id),
                status=status,
                amount=body.get("amount", 0),
                currency=body.get("currency", "IQD"),
                timestamp=datetime.utcnow(),
                gateway_signature=x_nass_signature,
            )

        return {"status": "received"}
    except Exception as e:
        logger.error(f"Error processing NassWallet webhook: {e}")
        return {"status": "error", "message": str(e)}
