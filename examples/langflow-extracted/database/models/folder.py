"""
Folder model extracted from Langflow for Iraqi AI Chat System
Original: src/backend/base/langflow/services/database/models/folder/model.py
"""
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel, JSON, Column, Relationship, UniqueConstraint
from langflow.schema.serialize import UUIDstr

class FolderBase(SQLModel):
    """Base folder model with core attributes"""
    name: str = Field(index=True)
    description: str | None = Field(default=None)
    auth_settings: Dict[str, Any] = Field(sa_column=Column(JSON), default_factory=dict)

class Folder(FolderBase, table=True):
    """Main database table model for folder organization"""
    __tablename__ = "folder"
    __table_args__ = (UniqueConstraint("user_id", "name", name="unique_folder_name_per_user"),)
    
    id: UUIDstr = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id")
    parent_id: UUID | None = Field(default=None, foreign_key="folder.id")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    # Relationships
    user: "User" = Relationship(back_populates="folders")
    parent: Optional["Folder"] = Relationship(
        back_populates="children",
        sa_relationship_kwargs={"remote_side": "Folder.id"}
    )
    children: List["Folder"] = Relationship(
        back_populates="parent",
        sa_relationship_kwargs={"cascade": "delete"}
    )
    flows: List["Flow"] = Relationship(
        back_populates="folder",
        sa_relationship_kwargs={"cascade": "delete"}
    )

class FolderCreate(FolderBase):
    """Model for creating new folders"""
    parent_id: UUID | None = None

class FolderRead(FolderBase):
    """Basic folder read representation"""
    id: UUIDstr
    user_id: UUID
    parent_id: UUID | None
    created_at: datetime
    updated_at: datetime

class FolderReadWithFlows(FolderRead):
    """Folder read with associated flows"""
    flows: List["FlowHeader"] = []

class FolderUpdate(SQLModel):
    """Model for updating folder details"""
    name: str | None = None
    description: str | None = None
    parent_id: UUID | None = None
    auth_settings: Dict[str, Any] | None = None

# Iraqi AI Chat System enhancements needed:
# - Add folder_type: str (personal, shared, professional, templates)
# - Add cultural_category: str (general, islamic, iraqi_professional)
# - Add language_primary: str (arabic, english, mixed)
# - Add access_level: str (private, team, public)
# - Add iraqi_domain: str (legal, medical, educational, business)
# - Add rtl_support: bool for Arabic folder management
# - Add template_library: bool for Iraqi professional templates
# - Add security_classification: str (public, confidential, restricted)