"""
Transaction model extracted from Langflow for Iraqi AI Chat System
Original: src/backend/base/langflow/services/database/models/transactions/model.py
"""
from datetime import datetime, timezone
from typing import Any, Dict
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel, JSON, Column
from pydantic import field_validator
from langflow.schema.serialize import UUIDstr

class TransactionBase(SQLModel):
    """Base transaction model with core attributes"""
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    vertex_id: str
    target_id: str | None = Field(default=None)
    inputs: Dict[str, Any] = Field(sa_column=Column(JSON), default_factory=dict)
    outputs: Dict[str, Any] = Field(sa_column=Column(JSON), default_factory=dict)
    status: str = Field(default="pending")
    error: str | None = Field(default=None)
    flow_id: UUIDstr

    @field_validator("flow_id", mode="before")
    @classmethod
    def validate_flow_id(cls, v):
        """Convert flow_id to string if UUID"""
        if isinstance(v, UUID):
            return str(v)
        return v

class TransactionTable(TransactionBase, table=True):
    """Database table model for transactions"""
    __tablename__ = "transactions"
    
    id: UUIDstr = Field(default_factory=uuid4, primary_key=True)

class TransactionReadResponse(TransactionBase):
    """Response model for reading transactions"""
    id: UUIDstr

class TransactionCreate(TransactionBase):
    """Model for creating new transactions"""
    pass

class TransactionUpdate(SQLModel):
    """Model for updating existing transactions"""
    status: str | None = None
    outputs: Dict[str, Any] | None = None
    error: str | None = None

# Iraqi AI Chat System enhancements needed for payment integration:
# - Add payment_provider: str (zaincash, fastpay, nasswallet)
# - Add payment_amount: float (IQD amount)
# - Add payment_currency: str = "IQD"
# - Add payment_status: str (pending, completed, failed, refunded)
# - Add payment_reference: str (external payment ID)
# - Add payment_method: str (mobile_wallet, bank_card)
# - Add user_id: UUID (link to user for payment tracking)
# - Add billing_address: Dict for Iraqi address format
# - Add tax_amount: float for Iraqi tax calculations
# - Add payment_fees: float for provider fees