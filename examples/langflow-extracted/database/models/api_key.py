"""
API Key model extracted from Langflow for Iraqi AI Chat System
Original: src/backend/base/langflow/services/database/models/api_key/model.py
"""

from datetime import datetime, timezone
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel, Relationship, Column, DateTime
from sqlalchemy import func
from langflow.schema.serialize import UUIDstr


def utc_now():
    """Get current UTC datetime"""
    return datetime.now(timezone.utc)


class ApiKeyBase(SQLModel):
    """Base API key model with core attributes"""

    name: str | None = Field(index=True, nullable=True, default=None)
    last_used_at: datetime | None = Field(default=None, nullable=True)
    total_uses: int = Field(default=0)
    is_active: bool = Field(default=True)


class ApiKey(ApiKeyBase, table=True):
    """Main database table model for API keys"""

    __tablename__ = "api_key"

    id: UUIDstr = Field(default_factory=uuid4, primary_key=True, unique=True)
    created_at: datetime | None = Field(
        default=None,
        sa_column=Column(
            DateTime(timezone=True), server_default=func.now(), nullable=False
        ),
    )
    api_key: str = Field(index=True, unique=True)
    user_id: UUIDstr = Field(index=True, foreign_key="user.id")

    # Relationships
    user: "User" = Relationship(back_populates="api_keys")


class ApiKeyCreate(ApiKeyBase):
    """Model for creating new API keys"""

    api_key: str | None = None
    user_id: UUIDstr | None = None
    created_at: datetime | None = Field(default_factory=utc_now)


class UnmaskedApiKeyRead(ApiKeyBase):
    """Unmasked API key read model (for internal use)"""

    id: UUIDstr
    api_key: str = Field()
    user_id: UUIDstr = Field()


class ApiKeyRead(ApiKeyBase):
    """Masked API key read model (for external use)"""

    id: UUIDstr
    api_key: str = Field(schema_extra={"validate_default": True})
    user_id: UUIDstr = Field()
    created_at: datetime = Field()


class ApiKeyUpdate(SQLModel):
    """Model for updating API keys"""

    name: str | None = None
    is_active: bool | None = None


# Iraqi AI Chat System enhancements needed:
# - Add api_key_type: str (user, service, integration, payment)
# - Add scope: List[str] (chat, files, payments, admin)
# - Add rate_limit: int (requests per hour for Iraqi usage)
# - Add expires_at: datetime for key expiration
# - Add ip_whitelist: List[str] for security restrictions
# - Add cultural_access: bool for Islamic compliance features
# - Add payment_enabled: bool for Iraqi payment gateway access
# - Add domain_restrictions: List[str] for Iraqi domain access
# - Add encryption_level: str (standard, high, military)
