"""
Message model extracted from Langflow for Iraqi AI Chat System
Original: src/backend/base/langflow/services/database/models/message/model.py
"""
import json
from datetime import datetime, timezone
from typing import TYPE_CHECKING, Annotated
from uuid import UUID, uuid4

from pydantic import ConfigDict, field_serializer, field_validator
from sqlalchemy import Text
from sqlmodel import JSON, Column, Field, SQLModel

# Imports for related schemas
from langflow.schema.content_block import ContentBlock
from langflow.schema.properties import Properties
from langflow.schema.validators import str_to_timestamp_validator

class MessageBase(SQLModel):
    """Base message model with core attributes"""
    timestamp: Annotated[datetime, str_to_timestamp_validator]
    sender: str
    sender_name: str
    session_id: str
    text: str
    files: list[str]
    error: bool
    edit: bool
    properties: Properties
    category: str
    content_blocks: list[ContentBlock]

    @field_serializer("timestamp")
    def serialize_timestamp(self, value):
        """Convert timestamp to standardized UTC format"""
        if isinstance(value, datetime):
            return value.isoformat()
        return value

    @field_validator("files", mode="before")
    @classmethod
    def validate_files(cls, value):
        """Ensure files is a list"""
        if value is None:
            return []
        if isinstance(value, str):
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                return [value]
        return value

    @classmethod
    def from_message(cls, message: "Message", flow_id: str | UUID | None = None):
        """Convert message to MessageBase instance"""
        return cls(
            timestamp=message.timestamp,
            sender=message.sender,
            sender_name=message.sender_name,
            session_id=message.session_id,
            text=message.text,
            files=message.files,
            error=message.error,
            edit=message.edit,
            properties=message.properties,
            category=message.category,
            content_blocks=message.content_blocks
        )

class MessageTable(MessageBase, table=True):
    """Database table model for messages"""
    __tablename__ = "message"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    flow_id: UUID | None = Field(default=None, foreign_key="flow.id")
    files: list[str] = Field(sa_column=Column(JSON, default=list))
    properties: dict | Properties = Field(sa_column=Column(JSON, default=dict))
    category: str = Field(default="message")
    content_blocks: list[dict | ContentBlock] = Field(sa_column=Column(JSON, default=list))

class MessageRead(MessageBase):
    """Read-only message model with ID"""
    id: UUID
    flow_id: UUID | None

class MessageCreate(MessageBase):
    """Model for creating new messages"""
    pass

class MessageUpdate(SQLModel):
    """Model for updating existing messages - allows partial updates"""
    text: str | None = None
    files: list[str] | None = None
    properties: Properties | None = None
    category: str | None = None
    content_blocks: list[ContentBlock] | None = None

# Iraqi AI Chat System enhancements needed:
# - Add language_detected: str (arabic/english)
# - Add cultural_validated: bool for Islamic compliance
# - Add rtl_processed: bool for Arabic text handling
# - Add iraqi_dialect: bool for dialect detection
# - Add professional_domain: str for Iraqi domain context