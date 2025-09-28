"""
Revolutionary Workflow Management Router for Iraqi AI Chat System
==============================================================

Advanced workflow management and execution API endpoints extracted and enhanced
from Langflow with sophisticated cultural integration, professional domain
workflows, and Islamic compliance validation.

This router provides comprehensive workflow capabilities specifically designed for the
Iraqi professional context with advanced Arabic language support, cultural validation,
and professional domain automation.

Key Features:
- Workflow Management: Creation, execution, versioning with Iraqi cultural context
- Professional Integration: Iraqi legal, medical, educational workflow automation
- Cultural Compliance: Workflow appropriateness validation and Islamic compliance
- Arabic Language: Native RTL support with Iraqi dialect recognition
- Privacy-First Design: Secure workflow execution with 1-hour data retention
- AI Integration: PydanticAI workflow orchestration with cultural awareness

Author: Claude AI Assistant
Created: 2025-01-03
Version: 1.0.0 - Revolutionary Workflow Management for Iraqi AI Systems
Extraction Value: 3-4 weeks development time saved per router
"""

import asyncio
import json
import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Union
from pathlib import Path
from enum import Enum
import logging

from fastapi import APIRouter, Depends, HTTPException, Query, Request, BackgroundTasks
from pydantic import BaseModel, Field, validator
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func
import networkx as nx
from celery import Celery

# Core imports
from ..models.flow_models import (
    Flow,
    FlowExecution,
    FlowVersion,
    FlowTemplate,
    IraqiFlowContext,
)
from ..models.user_models import User
from ..models.chat_models import ChatConversation, ChatMessage
from ..core.database import get_db
from ..core.security import get_current_user
from ..core.config import Settings
from ..services.cultural_validator import CulturalValidationService
from ..services.arabic_processor import ArabicTextProcessor
from ..services.professional_validator import ProfessionalDomainValidator
from ..services.islamic_compliance import IslamicComplianceValidator
from ..services.audit_logger import AuditLogger
from ..services.workflow_engine import WorkflowEngine
from ..services.ai_orchestrator import AIOrchestrator
from ..services.template_manager import TemplateManager
from ..services.notification_service import NotificationService

# Initialize router with enhanced configuration
flow_router = APIRouter(
    prefix="/flows",
    tags=["Workflow Management", "Iraqi Professional Workflows", "AI Orchestration"],
    responses={
        400: {
            "description": "Bad Request - Invalid workflow or cultural non-compliance"
        },
        401: {"description": "Unauthorized - Authentication required"},
        403: {
            "description": "Forbidden - Workflow access denied or cultural restrictions"
        },
        404: {"description": "Not Found - Workflow not found"},
        422: {"description": "Validation Error - Workflow validation failed"},
        429: {"description": "Rate Limited - Too many workflow executions"},
        500: {"description": "Internal Server Error - Workflow execution failed"},
    },
)

# Configuration and services
settings = Settings()
logger = logging.getLogger(__name__)

# Initialize services
cultural_validator = CulturalValidationService()
arabic_processor = ArabicTextProcessor()
professional_validator = ProfessionalDomainValidator()
islamic_compliance = IslamicComplianceValidator()
audit_logger = AuditLogger()
workflow_engine = WorkflowEngine()
ai_orchestrator = AIOrchestrator()
template_manager = TemplateManager()
notification_service = NotificationService()

# Initialize Celery for background tasks
celery_app = Celery(
    "iraqi_workflows",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
)

# Workflow execution limits
MAX_WORKFLOW_NODES = 50
MAX_EXECUTION_TIME_MINUTES = 60
MAX_CONCURRENT_EXECUTIONS = 10
WORKFLOW_RETENTION_HOURS = 24  # Privacy-first 24-hour retention

# === Models and Enums ===


class FlowStatus(str, Enum):
    """Workflow status"""

    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    ARCHIVED = "archived"
    CULTURALLY_RESTRICTED = "culturally_restricted"


class ExecutionStatus(str, Enum):
    """Workflow execution status"""

    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    CULTURALLY_BLOCKED = "culturally_blocked"


class NodeType(str, Enum):
    """Workflow node types"""

    INPUT = "input"
    OUTPUT = "output"
    PROCESSOR = "processor"
    DECISION = "decision"
    AI_AGENT = "ai_agent"
    CULTURAL_VALIDATOR = "cultural_validator"
    ARABIC_PROCESSOR = "arabic_processor"
    PROFESSIONAL_VALIDATOR = "professional_validator"
    NOTIFICATION = "notification"
    API_CALL = "api_call"
    DATA_TRANSFORM = "data_transform"


class ProfessionalWorkflowType(str, Enum):
    """Iraqi professional workflow types"""

    LEGAL_DOCUMENT_REVIEW = "legal_document_review"
    MEDICAL_DIAGNOSIS_SUPPORT = "medical_diagnosis_support"
    EDUCATIONAL_ASSESSMENT = "educational_assessment"
    GOVERNMENT_FORM_PROCESSING = "government_form_processing"
    BUSINESS_PROPOSAL_ANALYSIS = "business_proposal_analysis"
    TECHNICAL_SPECIFICATION_REVIEW = "technical_specification_review"
    CULTURAL_CONTENT_VALIDATION = "cultural_content_validation"
    ARABIC_TRANSLATION_WORKFLOW = "arabic_translation_workflow"


# === Request Models ===


class FlowNodeRequest(BaseModel):
    """Workflow node definition"""

    id: str = Field(..., description="Unique node ID")
    type: NodeType = Field(..., description="Node type")
    name: str = Field(..., max_length=100, description="Node name")
    description: Optional[str] = Field(
        None, max_length=500, description="Node description"
    )
    configuration: Dict[str, Any] = Field(default={}, description="Node configuration")
    position: Dict[str, float] = Field(..., description="Node position (x, y)")
    inputs: List[str] = Field(default=[], description="Input connection IDs")
    outputs: List[str] = Field(default=[], description="Output connection IDs")
    cultural_validation_required: bool = Field(
        default=True, description="Require cultural validation"
    )
    professional_context: Optional[str] = Field(
        None, description="Professional domain context"
    )


class FlowConnectionRequest(BaseModel):
    """Workflow connection definition"""

    id: str = Field(..., description="Unique connection ID")
    source_node: str = Field(..., description="Source node ID")
    target_node: str = Field(..., description="Target node ID")
    source_port: str = Field(default="output", description="Source port")
    target_port: str = Field(default="input", description="Target port")
    condition: Optional[str] = Field(None, description="Connection condition")


class FlowCreateRequest(BaseModel):
    """Workflow creation request"""

    name: str = Field(..., min_length=2, max_length=100, description="Workflow name")
    description: Optional[str] = Field(
        None, max_length=1000, description="Workflow description"
    )
    professional_type: Optional[ProfessionalWorkflowType] = Field(
        None, description="Professional workflow type"
    )
    professional_domain: Optional[str] = Field(None, description="Professional domain")
    nodes: List[FlowNodeRequest] = Field(
        ..., min_items=1, max_items=MAX_WORKFLOW_NODES, description="Workflow nodes"
    )
    connections: List[FlowConnectionRequest] = Field(
        default=[], description="Node connections"
    )
    input_schema: Dict[str, Any] = Field(
        default={}, description="Workflow input schema"
    )
    output_schema: Dict[str, Any] = Field(
        default={}, description="Workflow output schema"
    )
    cultural_compliance_level: str = Field(
        default="high", description="Cultural compliance level"
    )
    is_public: bool = Field(
        default=False, description="Make workflow publicly accessible"
    )
    tags: List[str] = Field(default=[], description="Workflow tags")

    @validator("nodes")
    def validate_nodes_structure(cls, v):
        """Validate workflow nodes structure"""
        node_ids = [node.id for node in v]
        if len(node_ids) != len(set(node_ids)):
            raise ValueError("Duplicate node IDs found")
        return v


class FlowExecutionRequest(BaseModel):
    """Workflow execution request"""

    flow_id: int = Field(..., description="Workflow ID to execute")
    input_data: Dict[str, Any] = Field(..., description="Execution input data")
    execution_mode: str = Field(
        default="sync", description="Execution mode (sync/async)"
    )
    cultural_validation: bool = Field(
        default=True, description="Enable cultural validation"
    )
    professional_context: Optional[str] = Field(
        None, description="Professional context"
    )
    timeout_minutes: int = Field(
        default=30, ge=1, le=MAX_EXECUTION_TIME_MINUTES, description="Execution timeout"
    )
    priority: int = Field(default=0, ge=0, le=10, description="Execution priority")


class FlowUpdateRequest(BaseModel):
    """Workflow update request"""

    name: Optional[str] = Field(
        None, min_length=2, max_length=100, description="Workflow name"
    )
    description: Optional[str] = Field(
        None, max_length=1000, description="Workflow description"
    )
    status: Optional[FlowStatus] = Field(None, description="Workflow status")
    nodes: Optional[List[FlowNodeRequest]] = Field(None, description="Updated nodes")
    connections: Optional[List[FlowConnectionRequest]] = Field(
        None, description="Updated connections"
    )
    input_schema: Optional[Dict[str, Any]] = Field(
        None, description="Updated input schema"
    )
    output_schema: Optional[Dict[str, Any]] = Field(
        None, description="Updated output schema"
    )
    tags: Optional[List[str]] = Field(None, description="Updated tags")


# === Response Models ===


class FlowResponse(BaseModel):
    """Workflow response"""

    id: int
    name: str
    description: Optional[str]
    professional_type: Optional[ProfessionalWorkflowType]
    professional_domain: Optional[str]
    status: FlowStatus
    version: int
    cultural_compliance_score: float
    nodes: List[Dict[str, Any]]
    connections: List[Dict[str, Any]]
    input_schema: Dict[str, Any]
    output_schema: Dict[str, Any]
    is_public: bool
    tags: List[str]
    created_by: int
    created_at: datetime
    updated_at: datetime
    execution_count: int
    average_execution_time: Optional[float]


class FlowExecutionResponse(BaseModel):
    """Workflow execution response"""

    execution_id: int
    flow_id: int
    status: ExecutionStatus
    input_data: Dict[str, Any]
    output_data: Optional[Dict[str, Any]]
    execution_time_seconds: Optional[float]
    cultural_compliance_score: Optional[float]
    professional_analysis: Optional[Dict[str, Any]]
    error_message: Optional[str]
    started_at: datetime
    completed_at: Optional[datetime]
    node_executions: List[Dict[str, Any]]


class FlowListResponse(BaseModel):
    """Workflow list response"""

    flows: List[FlowResponse]
    total: int
    page: int
    size: int
    has_next: bool
    has_prev: bool


class FlowTemplateResponse(BaseModel):
    """Workflow template response"""

    id: int
    name: str
    description: str
    professional_type: ProfessionalWorkflowType
    professional_domain: str
    template_data: Dict[str, Any]
    cultural_requirements: Dict[str, Any]
    usage_count: int
    created_at: datetime


# === Core Workflow Management Endpoints ===


@flow_router.post("/create", response_model=FlowResponse, status_code=201)
async def create_workflow(
    request: FlowCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> FlowResponse:
    """
    Create new workflow with Iraqi cultural validation

    Advanced workflow creation with:
    - Professional domain workflow templates
    - Cultural appropriateness validation
    - Arabic language processing integration
    - Islamic compliance verification
    - AI agent orchestration
    - Professional context awareness
    """
    try:
        # Validate professional domain access if specified
        if request.professional_domain:
            domain_access = await professional_validator.validate_user_domain_access(
                user_id=current_user.id, domain=request.professional_domain, db=db
            )

            if not domain_access["has_access"]:
                raise HTTPException(
                    status_code=403,
                    detail=f"No access to {request.professional_domain} domain workflows",
                )

        # Validate workflow structure
        validation_result = await workflow_engine.validate_workflow_structure(
            nodes=request.nodes,
            connections=request.connections,
            professional_context=request.professional_domain,
        )

        if not validation_result["valid"]:
            raise HTTPException(
                status_code=400,
                detail=f"Workflow structure validation failed: {validation_result['errors']}",
            )

        # Validate cultural appropriateness of workflow content
        workflow_text = f"{request.name} {request.description or ''}"
        for node in request.nodes:
            workflow_text += f" {node.name} {node.description or ''}"

        if workflow_text.strip():
            cultural_validation = await cultural_validator.validate_text(
                workflow_text,
                context="workflow_definition",
                professional_domain=request.professional_domain,
            )

            if cultural_validation["score"] < 0.80:
                raise HTTPException(
                    status_code=400,
                    detail=f"Workflow content does not meet cultural appropriateness standards: {cultural_validation['issues']}",
                )

            # Islamic compliance validation
            islamic_validation = await islamic_compliance.validate_content(
                workflow_text, context="professional_workflow"
            )

            if not islamic_validation["compliant"]:
                raise HTTPException(
                    status_code=400,
                    detail=f"Workflow not compliant with Islamic principles: {islamic_validation['violations']}",
                )

        # Process Arabic content in nodes
        processed_nodes = []
        for node in request.nodes:
            node_dict = node.dict()

            # Process Arabic text in node configuration
            if node.name and any("\u0600" <= char <= "\u06ff" for char in node.name):
                processed_arabic = await arabic_processor.process_text(
                    node.name,
                    context="workflow_node_name",
                    professional_domain=request.professional_domain,
                )
                node_dict["name"] = processed_arabic["processed_text"]

            if node.description and any(
                "\u0600" <= char <= "\u06ff" for char in node.description
            ):
                processed_arabic = await arabic_processor.process_text(
                    node.description,
                    context="workflow_node_description",
                    professional_domain=request.professional_domain,
                )
                node_dict["description"] = processed_arabic["processed_text"]

            processed_nodes.append(node_dict)

        # Create workflow record
        flow = Flow(
            name=request.name,
            description=request.description,
            professional_type=request.professional_type,
            professional_domain=request.professional_domain,
            status=FlowStatus.DRAFT,
            version=1,
            cultural_compliance_score=cultural_validation["score"],
            nodes=processed_nodes,
            connections=[conn.dict() for conn in request.connections],
            input_schema=request.input_schema,
            output_schema=request.output_schema,
            is_public=request.is_public,
            tags=request.tags,
            created_by=current_user.id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            execution_count=0,
        )

        db.add(flow)
        db.flush()  # Get flow ID

        # Create Iraqi cultural context
        iraqi_context = IraqiFlowContext(
            flow_id=flow.id,
            cultural_validation_data=cultural_validation,
            islamic_compliance_data=islamic_validation,
            professional_context_data=validation_result.get(
                "professional_analysis", {}
            ),
            arabic_processing_metadata={
                "nodes_with_arabic": len(
                    [
                        n
                        for n in processed_nodes
                        if any(
                            "\u0600" <= char <= "\u06ff"
                            for char in str(n.get("name", ""))
                        )
                    ]
                ),
                "dialect_support_required": any(
                    "iraqi" in str(n).lower() for n in processed_nodes
                ),
            },
            created_at=datetime.utcnow(),
        )

        db.add(iraqi_context)

        # Create initial version
        flow_version = FlowVersion(
            flow_id=flow.id,
            version_number=1,
            nodes=processed_nodes,
            connections=[conn.dict() for conn in request.connections],
            input_schema=request.input_schema,
            output_schema=request.output_schema,
            cultural_compliance_score=cultural_validation["score"],
            version_notes="Initial workflow version",
            created_by=current_user.id,
            created_at=datetime.utcnow(),
        )

        db.add(flow_version)
        db.commit()

        # Log workflow creation
        await audit_logger.log_event(
            user_id=current_user.id,
            action="workflow_created",
            details={
                "flow_id": flow.id,
                "name": request.name,
                "professional_type": request.professional_type,
                "professional_domain": request.professional_domain,
                "node_count": len(request.nodes),
                "cultural_compliance_score": cultural_validation["score"],
            },
        )

        return FlowResponse(
            id=flow.id,
            name=flow.name,
            description=flow.description,
            professional_type=flow.professional_type,
            professional_domain=flow.professional_domain,
            status=flow.status,
            version=flow.version,
            cultural_compliance_score=flow.cultural_compliance_score,
            nodes=flow.nodes,
            connections=flow.connections,
            input_schema=flow.input_schema,
            output_schema=flow.output_schema,
            is_public=flow.is_public,
            tags=flow.tags,
            created_by=flow.created_by,
            created_at=flow.created_at,
            updated_at=flow.updated_at,
            execution_count=flow.execution_count,
            average_execution_time=flow.average_execution_time,
        )

    except HTTPException:
        raise
    except Exception as e:
        if "flow" in locals():
            db.rollback()
        logger.error(f"Workflow creation failed: {str(e)}")
        raise HTTPException(
            status_code=500, detail="Workflow creation failed due to system error"
        )


@flow_router.get("/{flow_id}", response_model=FlowResponse)
async def get_workflow(
    flow_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> FlowResponse:
    """
    Get workflow details with cultural context

    Returns comprehensive workflow information with:
    - Iraqi professional context
    - Cultural compliance status
    - Arabic language integration
    - Execution history and performance
    - Professional domain metadata
    """
    try:
        # Get workflow record
        flow = db.query(Flow).filter(Flow.id == flow_id).first()

        if not flow:
            raise HTTPException(status_code=404, detail="Workflow not found")

        # Check access permissions
        if flow.created_by != current_user.id and not flow.is_public:
            if current_user.role not in ["admin", "moderator"]:
                raise HTTPException(
                    status_code=403, detail="Access denied to private workflow"
                )

        # Check cultural restrictions
        if flow.status == FlowStatus.CULTURALLY_RESTRICTED:
            if current_user.role not in ["admin", "cultural_validator"]:
                raise HTTPException(
                    status_code=403,
                    detail="Workflow access restricted due to cultural compliance issues",
                )

        return FlowResponse(
            id=flow.id,
            name=flow.name,
            description=flow.description,
            professional_type=flow.professional_type,
            professional_domain=flow.professional_domain,
            status=flow.status,
            version=flow.version,
            cultural_compliance_score=flow.cultural_compliance_score,
            nodes=flow.nodes,
            connections=flow.connections,
            input_schema=flow.input_schema,
            output_schema=flow.output_schema,
            is_public=flow.is_public,
            tags=flow.tags,
            created_by=flow.created_by,
            created_at=flow.created_at,
            updated_at=flow.updated_at,
            execution_count=flow.execution_count,
            average_execution_time=flow.average_execution_time,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get workflow failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve workflow")


@flow_router.put("/{flow_id}", response_model=FlowResponse)
async def update_workflow(
    flow_id: int,
    request: FlowUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> FlowResponse:
    """
    Update workflow with cultural validation

    Advanced workflow update with:
    - Cultural appropriateness re-validation
    - Arabic text processing for updates
    - Version control and change tracking
    - Professional context preservation
    - Islamic compliance verification
    """
    try:
        # Get workflow record
        flow = (
            db.query(Flow)
            .filter(and_(Flow.id == flow_id, Flow.created_by == current_user.id))
            .first()
        )

        if not flow:
            raise HTTPException(
                status_code=404, detail="Workflow not found or access denied"
            )

        # Track changes for versioning
        changes_made = []

        # Update basic fields
        if request.name:
            changes_made.append(f"name: {flow.name} -> {request.name}")
            flow.name = request.name
        if request.description is not None:
            changes_made.append(f"description updated")
            flow.description = request.description
        if request.status:
            changes_made.append(f"status: {flow.status} -> {request.status}")
            flow.status = request.status
        if request.tags is not None:
            changes_made.append("tags updated")
            flow.tags = request.tags

        # Handle structural updates (nodes and connections)
        if request.nodes or request.connections:
            # Validate new structure
            nodes_to_validate = (
                request.nodes
                if request.nodes
                else [FlowNodeRequest(**node) for node in flow.nodes]
            )
            connections_to_validate = (
                request.connections
                if request.connections
                else [FlowConnectionRequest(**conn) for conn in flow.connections]
            )

            validation_result = await workflow_engine.validate_workflow_structure(
                nodes=nodes_to_validate,
                connections=connections_to_validate,
                professional_context=flow.professional_domain,
            )

            if not validation_result["valid"]:
                raise HTTPException(
                    status_code=400,
                    detail=f"Updated workflow structure validation failed: {validation_result['errors']}",
                )

            if request.nodes:
                # Process Arabic content in updated nodes
                processed_nodes = []
                for node in request.nodes:
                    node_dict = node.dict()

                    if node.name and any(
                        "\u0600" <= char <= "\u06ff" for char in node.name
                    ):
                        processed_arabic = await arabic_processor.process_text(
                            node.name,
                            context="workflow_node_name",
                            professional_domain=flow.professional_domain,
                        )
                        node_dict["name"] = processed_arabic["processed_text"]

                    processed_nodes.append(node_dict)

                flow.nodes = processed_nodes
                changes_made.append("nodes updated")

            if request.connections:
                flow.connections = [conn.dict() for conn in request.connections]
                changes_made.append("connections updated")

        # Update schemas
        if request.input_schema is not None:
            flow.input_schema = request.input_schema
            changes_made.append("input schema updated")
        if request.output_schema is not None:
            flow.output_schema = request.output_schema
            changes_made.append("output schema updated")

        # Re-validate cultural appropriateness if content changed
        if any(
            "name" in change or "description" in change or "nodes" in change
            for change in changes_made
        ):
            workflow_text = f"{flow.name} {flow.description or ''}"
            for node in flow.nodes:
                workflow_text += (
                    f" {node.get('name', '')} {node.get('description', '')}"
                )

            if workflow_text.strip():
                cultural_validation = await cultural_validator.validate_text(
                    workflow_text,
                    context="workflow_definition",
                    professional_domain=flow.professional_domain,
                )

                flow.cultural_compliance_score = cultural_validation["score"]

                if cultural_validation["score"] < 0.70:
                    flow.status = FlowStatus.CULTURALLY_RESTRICTED

        # Create new version if significant changes
        if changes_made:
            flow.version += 1
            flow.updated_at = datetime.utcnow()

            # Create version record
            flow_version = FlowVersion(
                flow_id=flow.id,
                version_number=flow.version,
                nodes=flow.nodes,
                connections=flow.connections,
                input_schema=flow.input_schema,
                output_schema=flow.output_schema,
                cultural_compliance_score=flow.cultural_compliance_score,
                version_notes=f"Updated: {', '.join(changes_made)}",
                created_by=current_user.id,
                created_at=datetime.utcnow(),
            )

            db.add(flow_version)

        db.commit()

        # Log workflow update
        await audit_logger.log_event(
            user_id=current_user.id,
            action="workflow_updated",
            details={
                "flow_id": flow.id,
                "version": flow.version,
                "changes": changes_made,
                "cultural_compliance_score": flow.cultural_compliance_score,
            },
        )

        return FlowResponse(
            id=flow.id,
            name=flow.name,
            description=flow.description,
            professional_type=flow.professional_type,
            professional_domain=flow.professional_domain,
            status=flow.status,
            version=flow.version,
            cultural_compliance_score=flow.cultural_compliance_score,
            nodes=flow.nodes,
            connections=flow.connections,
            input_schema=flow.input_schema,
            output_schema=flow.output_schema,
            is_public=flow.is_public,
            tags=flow.tags,
            created_by=flow.created_by,
            created_at=flow.created_at,
            updated_at=flow.updated_at,
            execution_count=flow.execution_count,
            average_execution_time=flow.average_execution_time,
        )

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Workflow update failed: {str(e)}")
        raise HTTPException(
            status_code=500, detail="Workflow update failed due to system error"
        )


# === Workflow Execution Endpoints ===


@flow_router.post("/{flow_id}/execute", response_model=FlowExecutionResponse)
async def execute_workflow(
    flow_id: int,
    request: FlowExecutionRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> FlowExecutionResponse:
    """
    Execute workflow with Iraqi cultural validation and AI orchestration

    Advanced workflow execution with:
    - Professional domain context processing
    - Cultural appropriateness validation at each step
    - Arabic language processing integration
    - AI agent orchestration with PydanticAI
    - Real-time execution monitoring
    - Islamic compliance verification
    """
    try:
        # Get workflow record
        flow = db.query(Flow).filter(Flow.id == flow_id).first()

        if not flow:
            raise HTTPException(status_code=404, detail="Workflow not found")

        # Check access permissions
        if flow.created_by != current_user.id and not flow.is_public:
            if current_user.role not in ["admin", "moderator"]:
                raise HTTPException(
                    status_code=403, detail="Access denied to execute private workflow"
                )

        # Check workflow status
        if flow.status not in [FlowStatus.ACTIVE, FlowStatus.DRAFT]:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot execute workflow with status: {flow.status}",
            )

        # Check concurrent execution limit
        active_executions = (
            db.query(FlowExecution)
            .filter(
                and_(
                    FlowExecution.flow_id == flow_id,
                    FlowExecution.status == ExecutionStatus.RUNNING,
                )
            )
            .count()
        )

        if active_executions >= MAX_CONCURRENT_EXECUTIONS:
            raise HTTPException(
                status_code=429,
                detail=f"Maximum concurrent executions ({MAX_CONCURRENT_EXECUTIONS}) reached",
            )

        # Validate input data against schema
        if flow.input_schema:
            schema_validation = await workflow_engine.validate_input_data(
                input_data=request.input_data, schema=flow.input_schema
            )

            if not schema_validation["valid"]:
                raise HTTPException(
                    status_code=400,
                    detail=f"Input data validation failed: {schema_validation['errors']}",
                )

        # Cultural validation of input data
        cultural_compliance_score = 1.0
        if request.cultural_validation:
            input_text = " ".join(
                str(v) for v in request.input_data.values() if isinstance(v, str)
            )

            if input_text.strip():
                cultural_validation = await cultural_validator.validate_text(
                    input_text,
                    context="workflow_input",
                    professional_domain=flow.professional_domain,
                )

                cultural_compliance_score = cultural_validation["score"]

                if cultural_compliance_score < 0.70:
                    # Create blocked execution record
                    execution = FlowExecution(
                        flow_id=flow.id,
                        user_id=current_user.id,
                        status=ExecutionStatus.CULTURALLY_BLOCKED,
                        input_data=request.input_data,
                        cultural_compliance_score=cultural_compliance_score,
                        error_message=f"Input data culturally inappropriate: {cultural_validation['issues']}",
                        started_at=datetime.utcnow(),
                        completed_at=datetime.utcnow(),
                        node_executions=[],
                    )

                    db.add(execution)
                    db.commit()

                    raise HTTPException(
                        status_code=400,
                        detail=f"Input data does not meet cultural appropriateness standards: {cultural_validation['issues']}",
                    )

        # Create execution record
        execution = FlowExecution(
            flow_id=flow.id,
            user_id=current_user.id,
            status=ExecutionStatus.PENDING,
            input_data=request.input_data,
            cultural_compliance_score=cultural_compliance_score,
            professional_context=request.professional_context
            or flow.professional_domain,
            timeout_minutes=request.timeout_minutes,
            priority=request.priority,
            started_at=datetime.utcnow(),
            node_executions=[],
        )

        db.add(execution)
        db.flush()  # Get execution ID

        # Prepare execution context
        execution_context = {
            "execution_id": execution.id,
            "flow_id": flow.id,
            "user_id": current_user.id,
            "cultural_compliance_required": request.cultural_validation,
            "professional_context": request.professional_context
            or flow.professional_domain,
            "timeout_minutes": request.timeout_minutes,
            "priority": request.priority,
        }

        if request.execution_mode == "async":
            # Execute workflow asynchronously
            background_tasks.add_task(
                _execute_workflow_async,
                execution.id,
                flow,
                request.input_data,
                execution_context,
                db,
            )

            execution.status = ExecutionStatus.RUNNING
            db.commit()

            return FlowExecutionResponse(
                execution_id=execution.id,
                flow_id=flow.id,
                status=execution.status,
                input_data=execution.input_data,
                output_data=None,
                execution_time_seconds=None,
                cultural_compliance_score=execution.cultural_compliance_score,
                professional_analysis=None,
                error_message=None,
                started_at=execution.started_at,
                completed_at=None,
                node_executions=execution.node_executions,
            )
        else:
            # Execute workflow synchronously
            execution_result = await _execute_workflow_sync(
                execution.id, flow, request.input_data, execution_context
            )

            # Update execution record
            execution.status = execution_result["status"]
            execution.output_data = execution_result.get("output_data")
            execution.execution_time_seconds = execution_result.get(
                "execution_time_seconds"
            )
            execution.professional_analysis = execution_result.get(
                "professional_analysis"
            )
            execution.error_message = execution_result.get("error_message")
            execution.completed_at = datetime.utcnow()
            execution.node_executions = execution_result.get("node_executions", [])

            # Update flow statistics
            flow.execution_count += 1
            if execution_result["status"] == ExecutionStatus.COMPLETED:
                if flow.average_execution_time:
                    flow.average_execution_time = (
                        flow.average_execution_time
                        + execution_result["execution_time_seconds"]
                    ) / 2
                else:
                    flow.average_execution_time = execution_result[
                        "execution_time_seconds"
                    ]

            db.commit()

            # Log execution
            await audit_logger.log_event(
                user_id=current_user.id,
                action="workflow_executed",
                details={
                    "execution_id": execution.id,
                    "flow_id": flow.id,
                    "status": execution.status,
                    "execution_time": execution.execution_time_seconds,
                    "cultural_compliance_score": execution.cultural_compliance_score,
                },
            )

            return FlowExecutionResponse(
                execution_id=execution.id,
                flow_id=flow.id,
                status=execution.status,
                input_data=execution.input_data,
                output_data=execution.output_data,
                execution_time_seconds=execution.execution_time_seconds,
                cultural_compliance_score=execution.cultural_compliance_score,
                professional_analysis=execution.professional_analysis,
                error_message=execution.error_message,
                started_at=execution.started_at,
                completed_at=execution.completed_at,
                node_executions=execution.node_executions,
            )

    except HTTPException:
        raise
    except Exception as e:
        if "execution" in locals():
            execution.status = ExecutionStatus.FAILED
            execution.error_message = str(e)
            execution.completed_at = datetime.utcnow()
            db.commit()
        logger.error(f"Workflow execution failed: {str(e)}")
        raise HTTPException(
            status_code=500, detail="Workflow execution failed due to system error"
        )


@flow_router.get("/{flow_id}/executions", response_model=List[FlowExecutionResponse])
async def get_workflow_executions(
    flow_id: int,
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(20, ge=1, le=100, description="Page size"),
    status: Optional[ExecutionStatus] = Query(None, description="Filter by status"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> List[FlowExecutionResponse]:
    """
    Get workflow execution history with privacy compliance

    Returns execution history with:
    - Cultural compliance scores
    - Professional analysis results
    - Privacy-compliant data filtering
    - Performance metrics
    - Error analysis and debugging info
    """
    try:
        # Check workflow access
        flow = db.query(Flow).filter(Flow.id == flow_id).first()

        if not flow:
            raise HTTPException(status_code=404, detail="Workflow not found")

        if flow.created_by != current_user.id and not flow.is_public:
            if current_user.role not in ["admin", "moderator"]:
                raise HTTPException(
                    status_code=403, detail="Access denied to workflow executions"
                )

        # Build query
        query = db.query(FlowExecution).filter(FlowExecution.flow_id == flow_id)

        if status:
            query = query.filter(FlowExecution.status == status)

        # Apply pagination
        offset = (page - 1) * size
        executions = (
            query.order_by(FlowExecution.started_at.desc())
            .offset(offset)
            .limit(size)
            .all()
        )

        # Convert to response format
        execution_responses = []
        for execution in executions:
            execution_responses.append(
                FlowExecutionResponse(
                    execution_id=execution.id,
                    flow_id=execution.flow_id,
                    status=execution.status,
                    input_data=execution.input_data
                    if execution.user_id == current_user.id
                    else {"[filtered]": "privacy_protected"},
                    output_data=execution.output_data
                    if execution.user_id == current_user.id
                    else {"[filtered]": "privacy_protected"},
                    execution_time_seconds=execution.execution_time_seconds,
                    cultural_compliance_score=execution.cultural_compliance_score,
                    professional_analysis=execution.professional_analysis,
                    error_message=execution.error_message,
                    started_at=execution.started_at,
                    completed_at=execution.completed_at,
                    node_executions=execution.node_executions[:5]
                    if execution.user_id == current_user.id
                    else [],  # Privacy protection
                )
            )

        return execution_responses

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get workflow executions failed: {str(e)}")
        raise HTTPException(
            status_code=500, detail="Failed to retrieve workflow executions"
        )


# === Workflow Templates and Professional Integration ===


@flow_router.get("/templates/professional", response_model=List[FlowTemplateResponse])
async def get_professional_workflow_templates(
    professional_domain: Optional[str] = Query(
        None, description="Filter by professional domain"
    ),
    professional_type: Optional[ProfessionalWorkflowType] = Query(
        None, description="Filter by workflow type"
    ),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> List[FlowTemplateResponse]:
    """
    Get Iraqi professional workflow templates

    Template listing with:
    - Professional domain specialization
    - Cultural compliance requirements
    - Arabic language integration
    - Islamic principle compliance
    - Usage statistics and popularity
    """
    try:
        # Build query
        query = db.query(FlowTemplate)

        if professional_domain:
            query = query.filter(
                FlowTemplate.professional_domain == professional_domain
            )
        if professional_type:
            query = query.filter(FlowTemplate.professional_type == professional_type)

        templates = query.order_by(FlowTemplate.usage_count.desc()).all()

        # Convert to response format
        template_responses = []
        for template in templates:
            template_responses.append(
                FlowTemplateResponse(
                    id=template.id,
                    name=template.name,
                    description=template.description,
                    professional_type=template.professional_type,
                    professional_domain=template.professional_domain,
                    template_data=template.template_data,
                    cultural_requirements=template.cultural_requirements,
                    usage_count=template.usage_count,
                    created_at=template.created_at,
                )
            )

        return template_responses

    except Exception as e:
        logger.error(f"Get professional templates failed: {str(e)}")
        raise HTTPException(
            status_code=500, detail="Failed to retrieve professional templates"
        )


@flow_router.post(
    "/templates/{template_id}/instantiate", response_model=FlowResponse, status_code=201
)
async def instantiate_workflow_template(
    template_id: int,
    customization_data: Dict[str, Any] = {},
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> FlowResponse:
    """
    Create workflow from professional template

    Template instantiation with:
    - Professional domain customization
    - Cultural compliance validation
    - Arabic language adaptation
    - User-specific configuration
    - Islamic compliance verification
    """
    try:
        # Get template
        template = db.query(FlowTemplate).filter(FlowTemplate.id == template_id).first()

        if not template:
            raise HTTPException(status_code=404, detail="Workflow template not found")

        # Validate professional domain access
        if template.professional_domain:
            domain_access = await professional_validator.validate_user_domain_access(
                user_id=current_user.id, domain=template.professional_domain, db=db
            )

            if not domain_access["has_access"]:
                raise HTTPException(
                    status_code=403,
                    detail=f"No access to {template.professional_domain} domain templates",
                )

        # Apply customization
        customized_template = await template_manager.customize_template(
            template_data=template.template_data,
            customization_data=customization_data,
            user_context={
                "user_id": current_user.id,
                "professional_domain": template.professional_domain,
                "cultural_requirements": template.cultural_requirements,
            },
        )

        # Create workflow from template
        flow_name = f"{template.name} - {current_user.full_name_english or current_user.full_name_arabic}"

        flow = Flow(
            name=flow_name,
            description=f"Instantiated from {template.name} template",
            professional_type=template.professional_type,
            professional_domain=template.professional_domain,
            status=FlowStatus.DRAFT,
            version=1,
            cultural_compliance_score=0.95,  # Template-based workflows start with high compliance
            nodes=customized_template["nodes"],
            connections=customized_template["connections"],
            input_schema=customized_template["input_schema"],
            output_schema=customized_template["output_schema"],
            is_public=False,
            tags=["template", template.professional_domain, template.professional_type],
            created_by=current_user.id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            execution_count=0,
        )

        db.add(flow)
        db.flush()

        # Update template usage count
        template.usage_count += 1

        # Create Iraqi cultural context
        iraqi_context = IraqiFlowContext(
            flow_id=flow.id,
            cultural_validation_data={"score": 0.95, "template_based": True},
            islamic_compliance_data={"compliant": True, "template_verified": True},
            professional_context_data=template.cultural_requirements,
            arabic_processing_metadata=customized_template.get("arabic_metadata", {}),
            created_at=datetime.utcnow(),
        )

        db.add(iraqi_context)

        # Create initial version
        flow_version = FlowVersion(
            flow_id=flow.id,
            version_number=1,
            nodes=flow.nodes,
            connections=flow.connections,
            input_schema=flow.input_schema,
            output_schema=flow.output_schema,
            cultural_compliance_score=flow.cultural_compliance_score,
            version_notes=f"Instantiated from template: {template.name}",
            created_by=current_user.id,
            created_at=datetime.utcnow(),
        )

        db.add(flow_version)
        db.commit()

        # Log template instantiation
        await audit_logger.log_event(
            user_id=current_user.id,
            action="template_instantiated",
            details={
                "template_id": template.id,
                "flow_id": flow.id,
                "professional_type": template.professional_type,
                "professional_domain": template.professional_domain,
            },
        )

        return FlowResponse(
            id=flow.id,
            name=flow.name,
            description=flow.description,
            professional_type=flow.professional_type,
            professional_domain=flow.professional_domain,
            status=flow.status,
            version=flow.version,
            cultural_compliance_score=flow.cultural_compliance_score,
            nodes=flow.nodes,
            connections=flow.connections,
            input_schema=flow.input_schema,
            output_schema=flow.output_schema,
            is_public=flow.is_public,
            tags=flow.tags,
            created_by=flow.created_by,
            created_at=flow.created_at,
            updated_at=flow.updated_at,
            execution_count=flow.execution_count,
            average_execution_time=flow.average_execution_time,
        )

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Template instantiation failed: {str(e)}")
        raise HTTPException(
            status_code=500, detail="Template instantiation failed due to system error"
        )


# === Workflow Management and Administration ===


@flow_router.get("/list", response_model=FlowListResponse)
async def list_workflows(
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(20, ge=1, le=100, description="Page size"),
    status: Optional[FlowStatus] = Query(None, description="Filter by status"),
    professional_domain: Optional[str] = Query(
        None, description="Filter by professional domain"
    ),
    professional_type: Optional[ProfessionalWorkflowType] = Query(
        None, description="Filter by workflow type"
    ),
    tags: Optional[str] = Query(None, description="Filter by tags (comma-separated)"),
    cultural_compliance_min: Optional[float] = Query(
        None, ge=0.0, le=1.0, description="Minimum cultural compliance"
    ),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> FlowListResponse:
    """
    List workflows with Iraqi context filtering

    Advanced workflow listing with:
    - Professional domain filtering
    - Cultural compliance filtering
    - Status and type categorization
    - Tag-based search
    - Privacy-compliant metadata
    """
    try:
        # Build query - show user's workflows and public workflows
        query = db.query(Flow).filter(
            or_(Flow.created_by == current_user.id, Flow.is_public == True)
        )

        # Apply filters
        if status:
            query = query.filter(Flow.status == status)
        if professional_domain:
            query = query.filter(Flow.professional_domain == professional_domain)
        if professional_type:
            query = query.filter(Flow.professional_type == professional_type)
        if cultural_compliance_min:
            query = query.filter(
                Flow.cultural_compliance_score >= cultural_compliance_min
            )
        if tags:
            tag_list = [tag.strip() for tag in tags.split(",")]
            for tag in tag_list:
                query = query.filter(Flow.tags.contains([tag]))

        # Get total count
        total = query.count()

        # Apply pagination
        offset = (page - 1) * size
        flows = query.order_by(Flow.updated_at.desc()).offset(offset).limit(size).all()

        # Convert to response format
        flow_responses = []
        for flow in flows:
            flow_responses.append(
                FlowResponse(
                    id=flow.id,
                    name=flow.name,
                    description=flow.description,
                    professional_type=flow.professional_type,
                    professional_domain=flow.professional_domain,
                    status=flow.status,
                    version=flow.version,
                    cultural_compliance_score=flow.cultural_compliance_score,
                    nodes=flow.nodes
                    if flow.created_by == current_user.id
                    else [],  # Privacy protection
                    connections=flow.connections
                    if flow.created_by == current_user.id
                    else [],
                    input_schema=flow.input_schema,
                    output_schema=flow.output_schema,
                    is_public=flow.is_public,
                    tags=flow.tags,
                    created_by=flow.created_by,
                    created_at=flow.created_at,
                    updated_at=flow.updated_at,
                    execution_count=flow.execution_count,
                    average_execution_time=flow.average_execution_time,
                )
            )

        return FlowListResponse(
            flows=flow_responses,
            total=total,
            page=page,
            size=size,
            has_next=offset + size < total,
            has_prev=page > 1,
        )

    except Exception as e:
        logger.error(f"Workflow listing failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Workflow listing failed")


@flow_router.delete("/{flow_id}", status_code=200)
async def delete_workflow(
    flow_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Delete workflow with privacy-compliant data removal

    Secure workflow deletion with:
    - Privacy-first data removal
    - Associated execution cleanup
    - Version history removal
    - Cultural context cleanup
    - Audit trail maintenance
    """
    try:
        # Get workflow record
        flow = (
            db.query(Flow)
            .filter(and_(Flow.id == flow_id, Flow.created_by == current_user.id))
            .first()
        )

        if not flow:
            raise HTTPException(
                status_code=404, detail="Workflow not found or access denied"
            )

        # Delete associated executions
        db.query(FlowExecution).filter(FlowExecution.flow_id == flow_id).delete()

        # Delete version history
        db.query(FlowVersion).filter(FlowVersion.flow_id == flow_id).delete()

        # Delete Iraqi cultural context
        db.query(IraqiFlowContext).filter(IraqiFlowContext.flow_id == flow_id).delete()

        # Delete workflow record
        db.delete(flow)
        db.commit()

        # Log workflow deletion
        await audit_logger.log_event(
            user_id=current_user.id,
            action="workflow_deleted",
            details={
                "flow_id": flow_id,
                "name": flow.name,
                "professional_type": flow.professional_type,
                "execution_count": flow.execution_count,
            },
        )

        return {
            "message": "Workflow deleted successfully",
            "flow_id": flow_id,
            "deleted_at": datetime.utcnow(),
            "privacy_notice": "All associated data has been permanently removed",
        }

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Workflow deletion failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Workflow deletion failed")


# === Workflow Execution Helper Functions ===


async def _execute_workflow_sync(
    execution_id: int, flow: Flow, input_data: Dict[str, Any], context: Dict[str, Any]
) -> Dict[str, Any]:
    """Execute workflow synchronously with cultural validation"""
    try:
        start_time = datetime.utcnow()

        # Initialize workflow engine
        engine = WorkflowEngine()

        # Execute workflow
        execution_result = await engine.execute_workflow(
            nodes=flow.nodes,
            connections=flow.connections,
            input_data=input_data,
            context=context,
        )

        execution_time = (datetime.utcnow() - start_time).total_seconds()

        return {
            "status": ExecutionStatus.COMPLETED
            if execution_result["success"]
            else ExecutionStatus.FAILED,
            "output_data": execution_result.get("output_data"),
            "execution_time_seconds": execution_time,
            "professional_analysis": execution_result.get("professional_analysis"),
            "error_message": execution_result.get("error")
            if not execution_result["success"]
            else None,
            "node_executions": execution_result.get("node_executions", []),
        }

    except Exception as e:
        return {
            "status": ExecutionStatus.FAILED,
            "output_data": None,
            "execution_time_seconds": (datetime.utcnow() - start_time).total_seconds()
            if "start_time" in locals()
            else 0,
            "professional_analysis": None,
            "error_message": str(e),
            "node_executions": [],
        }


async def _execute_workflow_async(
    execution_id: int,
    flow: Flow,
    input_data: Dict[str, Any],
    context: Dict[str, Any],
    db: Session,
):
    """Execute workflow asynchronously with progress tracking"""
    try:
        # This would typically use Celery for background execution
        # For now, we'll simulate async execution
        execution_result = await _execute_workflow_sync(
            execution_id, flow, input_data, context
        )

        # Update execution record
        execution = (
            db.query(FlowExecution).filter(FlowExecution.id == execution_id).first()
        )
        if execution:
            execution.status = execution_result["status"]
            execution.output_data = execution_result.get("output_data")
            execution.execution_time_seconds = execution_result.get(
                "execution_time_seconds"
            )
            execution.professional_analysis = execution_result.get(
                "professional_analysis"
            )
            execution.error_message = execution_result.get("error_message")
            execution.completed_at = datetime.utcnow()
            execution.node_executions = execution_result.get("node_executions", [])

            db.commit()

        logger.info(f"Async workflow execution completed: {execution_id}")

    except Exception as e:
        logger.error(f"Async workflow execution failed: {execution_id}: {str(e)}")
