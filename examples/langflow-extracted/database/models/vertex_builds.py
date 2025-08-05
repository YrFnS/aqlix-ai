"""
Vertex Builds model extracted from Langflow for Iraqi AI Chat System
Original: src/backend/base/langflow/services/database/models/vertex_builds/model.py
"""
from datetime import datetime, timezone
from uuid import UUID, uuid4
from typing import Dict, List, Any
from pydantic import BaseModel, field_serializer, field_validator
from sqlalchemy import Text
from sqlmodel import JSON, Column, Field, SQLModel

class VertexBuildBase(SQLModel):
    """Base vertex build model for AI workflow execution tracking"""
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    id: str = Field(nullable=False)
    data: dict | None = Field(default=None, sa_column=Column(JSON))
    artifacts: dict | None = Field(default=None, sa_column=Column(JSON))
    params: str | None = Field(default=None, sa_column=Column(Text, nullable=True))
    valid: bool = Field(nullable=False)
    flow_id: UUID = Field()

    @field_validator("data", mode="before")
    @classmethod
    def validate_data(cls, v):
        """Validate and serialize data field"""
        if v is None:
            return v
        # Add serialization logic here
        return v

    @field_validator("artifacts", mode="before")
    @classmethod
    def validate_artifacts(cls, v):
        """Validate and serialize artifacts field"""
        if v is None:
            return v
        # Add serialization logic here
        return v

class VertexBuildTable(VertexBuildBase, table=True):
    """Database table model for vertex builds"""
    __tablename__ = "vertex_build"
    
    build_id: UUID | None = Field(default_factory=uuid4, primary_key=True)

class VertexBuildMapModel(BaseModel):
    """Model for mapping vertex builds by ID"""
    vertex_builds: Dict[str, List[VertexBuildTable]]

    @classmethod
    def from_list_of_dicts(cls, vertex_build_dicts: List[VertexBuildTable]):
        """Create vertex build map from list of vertex builds"""
        vertex_build_map: Dict[str, List[VertexBuildTable]] = {}
        for vertex_build in vertex_build_dicts:
            if vertex_build.id not in vertex_build_map:
                vertex_build_map[vertex_build.id] = []
            vertex_build_map[vertex_build.id].append(vertex_build)
        return cls(vertex_builds=vertex_build_map)

class VertexBuildCreate(VertexBuildBase):
    """Model for creating new vertex builds"""
    pass

class VertexBuildRead(VertexBuildBase):
    """Read-only vertex build model"""
    build_id: UUID

# Iraqi AI Chat System enhancements needed:
# - Add execution_language: str (arabic, english) for language-specific builds
# - Add cultural_validation_passed: bool for Islamic compliance
# - Add performance_metrics: dict for Iraqi network conditions
# - Add security_scan_results: dict for security validation
# - Add iraqi_domain_context: str (legal, medical, educational)
# - Add rtl_processing_applied: bool for Arabic text handling
# - Add payment_integration_status: str for Iraqi payment gateways
# - Add error_details_arabic: str for Arabic error messages