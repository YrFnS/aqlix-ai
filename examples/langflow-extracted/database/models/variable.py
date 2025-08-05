"""
Variable model extracted from Langflow for Iraqi AI Chat System
Original: src/backend/base/langflow/services/database/models/variable/model.py
"""
from datetime import datetime, timezone
from uuid import UUID, uuid4
from pydantic import ValidationInfo, field_validator
from sqlmodel import JSON, Column, DateTime, Field, Relationship, SQLModel, func
from langflow.services.variable.constants import CREDENTIAL_TYPE

def utc_now():
    """Get current UTC datetime"""
    return datetime.now(timezone.utc)

class VariableBase(SQLModel):
    """Base variable model with core attributes"""
    name: str = Field(description="Name of the variable")
    value: str = Field(description="Encrypted value of the variable")
    default_fields: list[str] | None = Field(sa_column=Column(JSON))
    type: str | None = Field(None, description="Type of the variable")

class Variable(VariableBase, table=True):
    """Main database table model for global variables"""
    __tablename__ = "variable"
    
    id: UUID | None = Field(
        default_factory=uuid4,
        primary_key=True,
        description="Unique ID for the variable",
    )
    created_at: datetime | None = Field(
        default=None,
        sa_column=Column(DateTime(timezone=True), server_default=func.now(), nullable=True),
        description="Creation time of the variable",
    )
    updated_at: datetime | None = Field(
        default=None,
        sa_column=Column(DateTime(timezone=True), nullable=True),
        description="Last update time of the variable",
    )
    user_id: UUID = Field(description="User ID associated with this variable", foreign_key="user.id")
    
    # Relationships
    user: "User" = Relationship(back_populates="variables")

class VariableCreate(VariableBase):
    """Model for creating new variables"""
    created_at: datetime | None = Field(default_factory=utc_now, description="Creation time of the variable")
    updated_at: datetime | None = Field(default_factory=utc_now, description="Creation time of the variable")

class VariableRead(SQLModel):
    """Read-only variable model"""
    id: UUID
    name: str | None = Field(None, description="Name of the variable")
    type: str | None = Field(None, description="Type of the variable")
    value: str | None = Field(None, description="Variable value (may be masked)")
    default_fields: list[str] | None = None

class VariableUpdate(SQLModel):
    """Model for updating variables"""
    name: str | None = None
    value: str | None = None
    type: str | None = None
    default_fields: list[str] | None = None

# Iraqi AI Chat System enhancements needed:
# - Add variable_category: str (cultural, payment, language, security)
# - Add is_cultural_setting: bool for Islamic compliance variables
# - Add is_payment_config: bool for ZainCash/FastPay/NassWallet settings
# - Add is_language_config: bool for Arabic/RTL configuration
# - Add scope: str (user, system, global, professional_domain)
# - Add encryption_level: str (basic, advanced, military_grade)
# - Add iraqi_compliance: bool for Iraqi regulatory compliance
# - Add professional_domain: str (legal, medical, educational)
# - Add access_level: str (public, private, restricted, classified)