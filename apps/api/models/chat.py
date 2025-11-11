"""
Pydantic models for chat functionality
Defines data structures for chat sessions, messages, and AI responses
"""

from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, Field
from enum import Enum


class MessageRole(str, Enum):
    """Message role types"""

    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class ChatMessage(BaseModel):
    """Individual message in a chat"""

    id: Optional[str] = Field(None, description="Message ID")
    role: MessageRole = Field(..., description="Message role")
    content: str = Field(..., description="Message content")
    created_at: Optional[datetime] = Field(
        None, description="Message creation timestamp"
    )
    updated_at: Optional[datetime] = Field(None, description="Message update timestamp")


class ChatSessionCreate(BaseModel):
    """Request to create a new chat session"""

    title: Optional[str] = Field(None, description="Chat session title")
    language: str = Field(default="ar", description="Language code (ar, en)")
    dialect: Optional[str] = Field(
        None, description="Iraqi dialect (baghdad, basra, mosul, kurdish, standard)"
    )


class ChatSession(BaseModel):
    """Chat session response"""

    id: str = Field(..., description="Chat session ID")
    user_id: str = Field(..., description="User ID")
    title: Optional[str] = Field(None, description="Chat session title")
    language: str = Field(..., description="Language code")
    dialect: Optional[str] = Field(None, description="Iraqi dialect")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")
    message_count: int = Field(default=0, description="Number of messages in session")


class MessageCreate(BaseModel):
    """Request to send a message"""

    content: str = Field(
        ..., description="Message content", min_length=1, max_length=10000
    )
    system_prompt: Optional[str] = Field(
        None, description="Optional system prompt for AI context"
    )


class MessageResponse(BaseModel):
    """AI message response"""

    id: str = Field(..., description="Message ID")
    user_message: ChatMessage = Field(..., description="User message")
    assistant_message: ChatMessage = Field(..., description="Assistant response")
    processing_time_ms: float = Field(
        ..., description="Processing time in milliseconds"
    )
    tokens_used: Optional[int] = Field(None, description="Tokens used by the model")
    model: str = Field(default="gpt-4o-mini", description="Model used")


class ChatHistoryFilter(BaseModel):
    """Filter options for chat history"""

    limit: int = Field(
        default=50, ge=1, le=100, description="Number of messages to retrieve"
    )
    offset: int = Field(default=0, ge=0, description="Offset for pagination")
    order: str = Field(default="desc", description="Order by timestamp (asc or desc)")


class ChatSessionListResponse(BaseModel):
    """List of chat sessions"""

    sessions: List[ChatSession] = Field(..., description="List of chat sessions")
    total: int = Field(..., description="Total number of sessions")
    limit: int = Field(..., description="Limit used for query")
    offset: int = Field(..., description="Offset used for query")


class ErrorResponse(BaseModel):
    """Error response"""

    error: str = Field(..., description="Error message")
    code: Optional[str] = Field(None, description="Error code")
    details: Optional[dict] = Field(None, description="Additional error details")
