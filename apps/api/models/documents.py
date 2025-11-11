"""
Pydantic models for document management
Defines data structures for document uploads, storage, and processing
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field
from enum import Enum


class DocumentType(str, Enum):
    """Document type enumeration"""

    PDF = "pdf"
    DOCX = "docx"
    TXT = "txt"
    IMAGE = "image"
    SPREADSHEET = "spreadsheet"
    PRESENTATION = "presentation"


class DocumentStatus(str, Enum):
    """Document processing status"""

    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class DocumentCreate(BaseModel):
    """Request to upload a document"""

    filename: str = Field(..., description="Document filename")
    content_type: str = Field(..., description="MIME type (e.g., application/pdf)")
    size_bytes: int = Field(
        ..., description="File size in bytes", ge=1, le=52428800
    )  # 50MB max
    title: Optional[str] = Field(None, description="Document title/description")
    tags: Optional[List[str]] = Field(
        None, description="Document tags for organization"
    )


class Document(BaseModel):
    """Document response"""

    id: str = Field(..., description="Document ID")
    user_id: str = Field(..., description="User ID")
    filename: str = Field(..., description="Original filename")
    title: Optional[str] = Field(None, description="Document title")
    document_type: DocumentType = Field(..., description="Document type")
    size_bytes: int = Field(..., description="File size in bytes")
    status: DocumentStatus = Field(..., description="Processing status")
    storage_url: str = Field(..., description="URL to access document")
    tags: List[str] = Field(default_factory=list, description="Document tags")
    created_at: datetime = Field(..., description="Upload timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")
    processed_at: Optional[datetime] = Field(
        None, description="Processing completion time"
    )


class DocumentProcessRequest(BaseModel):
    """Request to process a document with AI"""

    analysis_type: str = Field(
        default="summary",
        description="Type of analysis (summary, extraction, translation, etc.)",
    )
    language: str = Field(default="ar", description="Output language (ar, en)")
    include_images: bool = Field(
        default=False, description="Include image analysis if available"
    )


class DocumentAnalysis(BaseModel):
    """Document analysis/processing result"""

    document_id: str = Field(..., description="Document ID")
    analysis_type: str = Field(..., description="Type of analysis performed")
    result: dict = Field(..., description="Analysis result data")
    processing_time_ms: float = Field(
        ..., description="Processing time in milliseconds"
    )
    model: str = Field(..., description="Model used for analysis")
    created_at: datetime = Field(..., description="Analysis timestamp")


class DocumentListResponse(BaseModel):
    """List of documents"""

    documents: List[Document] = Field(..., description="List of documents")
    total: int = Field(..., description="Total number of documents")
    limit: int = Field(..., description="Limit used for query")
    offset: int = Field(..., description="Offset used for query")


class UploadResponse(BaseModel):
    """Response for document upload"""

    document_id: str = Field(..., description="Uploaded document ID")
    upload_url: str = Field(..., description="Presigned URL for upload")
    expiration: int = Field(..., description="URL expiration time in seconds")


class DocumentDeleteResponse(BaseModel):
    """Response for document deletion"""

    document_id: str = Field(..., description="Deleted document ID")
    deleted_at: datetime = Field(..., description="Deletion timestamp")
