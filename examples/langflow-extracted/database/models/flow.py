"""
Flow model extracted from Langflow for Iraqi AI Chat System
Original: src/backend/base/langflow/services/database/models/flow/model.py
"""
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel, JSON, Column, Relationship
from pydantic import field_validator
from langflow.schema.serialize import UUIDstr

class FlowBase(SQLModel):
    """Base flow model with core attributes"""
    name: str = Field(index=True)
    description: str | None = Field(default=None)
    data: Dict[str, Any] = Field(sa_column=Column(JSON), default_factory=dict)
    is_component: bool = Field(default=False)
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    folder_id: UUID | None = Field(default=None, foreign_key="folder.id")
    endpoint_name: str | None = Field(default=None)
    tags: List[str] = Field(sa_column=Column(JSON), default_factory=list)
    icon: str | None = Field(default=None)
    icon_bg_color: str | None = Field(default=None)
    gradient: str | None = Field(default=None)
    last_tested_version: str | None = Field(default=None)

    @field_validator("endpoint_name")
    @classmethod
    def validate_endpoint_name(cls, v):
        """Validate endpoint name format"""
        if v is not None and not v.replace("-", "").replace("_", "").isalnum():
            raise ValueError("Endpoint name must be alphanumeric with hyphens/underscores only")
        return v

    @field_validator("tags", mode="before")
    @classmethod
    def validate_tags(cls, v):
        """Ensure tags is a list"""
        if isinstance(v, str):
            return [v]
        return v or []

class Flow(FlowBase, table=True):
    """Full database model for AI workflows"""
    __tablename__ = "flow"
    
    id: UUIDstr = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    # Relationships
    user: "User" = Relationship(back_populates="flows")
    folder: Optional["Folder"] = Relationship(back_populates="flows")

class FlowCreate(FlowBase):
    """Model for creating new flows"""
    pass

class FlowRead(FlowBase):
    """Read-only flow model"""
    id: UUIDstr
    user_id: UUID
    created_at: datetime

class FlowHeader(SQLModel):
    """Lightweight flow metadata"""
    id: UUIDstr
    name: str
    description: str | None
    updated_at: datetime
    created_at: datetime
    folder_id: UUID | None
    endpoint_name: str | None
    tags: List[str]

class FlowUpdate(SQLModel):
    """Model for updating existing flows"""
    name: str | None = None
    description: str | None = None
    data: Dict[str, Any] | None = None
    folder_id: UUID | None = None
    endpoint_name: str | None = None
    tags: List[str] | None = None
    icon: str | None = None
    icon_bg_color: str | None = None

# Iraqi AI Chat System enhancements needed:
# - Add workflow_type: str (chat, document_processing, voice, payment)
# - Add cultural_compliance: bool for Islamic validation
# - Add language_support: List[str] (arabic, english)
# - Add iraqi_domain: str (legal, medical, educational, general)
# - Add rtl_compatible: bool for Arabic interface support
# - Add security_level: str (public, private, confidential)
# - Add payment_required: bool for premium workflows
# - Add template_category: str for Iraqi professional templates