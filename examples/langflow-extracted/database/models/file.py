"""
File model extracted from Langflow for Iraqi AI Chat System
Original: src/backend/base/langflow/services/database/models/file/model.py
"""
from datetime import datetime, timezone
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel
from langflow.schema.serialize import UUIDstr

class File(SQLModel, table=True):
    """File model for document storage and management"""
    __tablename__ = "file"
    
    id: UUIDstr = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id")
    name: str = Field(unique=True, nullable=False)
    path: str = Field(nullable=False)
    size: int = Field(nullable=False)
    provider: str | None = Field(default=None)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Iraqi AI Chat System enhancements needed:
# - Add file_type: str (pdf, docx, txt, image, etc.)
# - Add content_language: str (arabic/english)
# - Add has_arabic_content: bool for RTL handling
# - Add security_scanned: bool for malware scanning
# - Add cultural_approved: bool for Islamic compliance
# - Add iraqi_legal_doc: bool for legal document processing
# - Add mime_type: str for proper file handling
# - Add encryption_key: str for secure file storage
# - Add iraqi_classification: str (legal, medical, educational, etc.)