"""
Iraqi Workflow Models - Database models for enterprise workflow management

Provides comprehensive workflow, task, and execution tracking with:
- Islamic compliance and cultural validation
- Iraqi government portal integration
- Multi-ministry approval workflows
- Comprehensive audit trails for government compliance
"""

from datetime import datetime, timezone
from typing import Optional, Dict, Any, List, Union
from enum import Enum
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    Boolean,
    JSON,
    ForeignKey,
    Enum as SQLEnum,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from pydantic import BaseModel, Field
import uuid

Base = declarative_base()


class WorkflowStatus(str, Enum):
    """Workflow execution status"""

    DRAFT = "draft"
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class TaskStatus(str, Enum):
    """Task execution status"""

    PENDING = "pending"
    QUEUED = "queued"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    SKIPPED = "skipped"
    CANCELLED = "cancelled"


class StepStatus(str, Enum):
    """Step execution status"""

    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    RETRYING = "retrying"


class IraqiWorkflowCategory(str, Enum):
    """Categories for Iraqi workflow types"""

    GOVERNMENT_SERVICE = "government_service"
    LEGAL_PROCESS = "legal_process"
    HEALTHCARE = "healthcare"
    EDUCATION = "education"
    BUSINESS_REGISTRATION = "business_registration"
    REAL_ESTATE = "real_estate"
    FINANCIAL_SERVICE = "financial_service"
    CUSTOMS_IMMIGRATION = "customs_immigration"


class IraqiCulturalValidationLevel(str, Enum):
    """Levels of cultural validation required"""

    NONE = "none"
    BASIC = "basic"
    STANDARD = "standard"
    STRICT = "strict"
    RELIGIOUS_AUTHORITY = "religious_authority"


# Database Models


class IraqiWorkflowModel(Base):
    """Enhanced workflow model with Iraqi government and cultural features"""

    __tablename__ = "iraqi_workflows"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = Column(String, nullable=False, index=True)

    # Basic workflow information
    title = Column(String(255), nullable=False)
    description = Column(Text)
    category = Column(SQLEnum(IraqiWorkflowCategory), nullable=False)
    version = Column(String(50), default="1.0.0")

    # Workflow definition
    workflow_definition = Column(JSON, nullable=False)  # Complete workflow steps
    parameters_schema = Column(JSON)  # Expected input parameters

    # Iraqi-specific fields
    ministry_approvals_required = Column(JSON)  # List of required ministry approvals
    cultural_validation_level = Column(
        SQLEnum(IraqiCulturalValidationLevel),
        default=IraqiCulturalValidationLevel.STANDARD,
    )
    islamic_compliance_required = Column(Boolean, default=True)
    arabic_language_support = Column(Boolean, default=True)

    # Government portal integration
    government_portals = Column(
        JSON
    )  # List of government portals this workflow interacts with
    required_credentials = Column(JSON)  # Required credential types
    estimated_duration_minutes = Column(Integer)  # Expected completion time

    # Status and metadata
    status = Column(SQLEnum(WorkflowStatus), default=WorkflowStatus.DRAFT)
    is_public = Column(Boolean, default=False)  # Whether available to all citizens
    requires_approval = Column(
        Boolean, default=True
    )  # Whether execution needs approval

    # Audit and compliance
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by = Column(String, nullable=False)
    approved_by = Column(String)  # Government official who approved this workflow
    approval_date = Column(DateTime)

    # Relationships
    workflow_runs = relationship("IraqiWorkflowRunModel", back_populates="workflow")


class IraqiWorkflowRunModel(Base):
    """Enhanced workflow run model with Iraqi execution tracking"""

    __tablename__ = "iraqi_workflow_runs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    workflow_id = Column(String, ForeignKey("iraqi_workflows.id"), nullable=False)
    organization_id = Column(String, nullable=False, index=True)

    # Execution information
    status = Column(SQLEnum(WorkflowStatus), default=WorkflowStatus.PENDING)
    parameters = Column(JSON)  # Input parameters for this run

    # Iraqi citizen/entity information
    citizen_national_id = Column(String)  # Iraqi national ID (encrypted)
    entity_registration_number = Column(String)  # Business registration number
    requester_name_arabic = Column(String)  # Name in Arabic
    requester_name_english = Column(String)  # Name in English

    # Execution tracking
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    failed_at = Column(DateTime)

    # Progress tracking
    total_tasks = Column(Integer, default=0)
    completed_tasks = Column(Integer, default=0)
    failed_tasks = Column(Integer, default=0)
    current_task_id = Column(String)

    # Results and outputs
    workflow_outputs = Column(JSON)  # Final workflow outputs
    generated_documents = Column(JSON)  # List of generated document URLs
    tracking_numbers = Column(JSON)  # Government tracking numbers

    # Ministry approvals tracking
    ministry_approvals_status = Column(JSON)  # Status of each required approval
    approval_documents = Column(JSON)  # Approval document references

    # Cultural and compliance validation
    cultural_validation_results = Column(JSON)  # Results of cultural validation
    islamic_compliance_verified = Column(Boolean, default=False)
    compliance_verification_date = Column(DateTime)

    # Error handling
    error_message = Column(Text)
    retry_count = Column(Integer, default=0)
    max_retries = Column(Integer, default=3)

    # Audit trail
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    workflow = relationship("IraqiWorkflowModel", back_populates="workflow_runs")
    tasks = relationship("IraqiTaskModel", back_populates="workflow_run")


class IraqiTaskModel(Base):
    """Enhanced task model with Iraqi government portal interaction"""

    __tablename__ = "iraqi_tasks"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    workflow_run_id = Column(
        String, ForeignKey("iraqi_workflow_runs.id"), nullable=False
    )
    organization_id = Column(String, nullable=False, index=True)

    # Task definition
    task_type = Column(String, nullable=False)  # Type of automation task
    task_name = Column(String(255), nullable=False)
    task_description = Column(Text)

    # Iraqi portal integration
    target_portal = Column(String)  # Which government portal this task targets
    portal_credentials_id = Column(String)  # Reference to stored credentials
    required_documents = Column(JSON)  # List of required documents

    # Execution configuration
    task_parameters = Column(JSON)  # Task-specific parameters
    retry_policy = Column(JSON)  # Retry configuration
    timeout_seconds = Column(Integer, default=300)

    # Status and execution
    status = Column(SQLEnum(TaskStatus), default=TaskStatus.PENDING)
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    failed_at = Column(DateTime)

    # Results
    task_outputs = Column(JSON)  # Task execution outputs
    extracted_data = Column(JSON)  # Data extracted from portals
    generated_files = Column(JSON)  # Files generated during execution
    government_references = Column(JSON)  # Reference numbers from government systems

    # Error handling
    failure_reason = Column(Text)
    retry_count = Column(Integer, default=0)
    last_error = Column(Text)

    # Cultural validation for task outputs
    cultural_validation_required = Column(Boolean, default=False)
    cultural_validation_status = Column(String, default="pending")
    cultural_validation_notes = Column(Text)

    # Audit and metadata
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    workflow_run = relationship("IraqiWorkflowRunModel", back_populates="tasks")
    steps = relationship("IraqiStepModel", back_populates="task")


class IraqiStepModel(Base):
    """Enhanced step model with detailed execution tracking"""

    __tablename__ = "iraqi_steps"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    task_id = Column(String, ForeignKey("iraqi_tasks.id"), nullable=False)
    organization_id = Column(String, nullable=False, index=True)

    # Step definition
    step_name = Column(String(255), nullable=False)
    step_type = Column(String, nullable=False)  # click, input, upload, etc.
    step_order = Column(Integer, nullable=False)

    # Execution details
    target_element = Column(String)  # CSS selector or element identifier
    action_data = Column(JSON)  # Data for the action

    # Status and timing
    status = Column(SQLEnum(StepStatus), default=StepStatus.PENDING)
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    execution_time_ms = Column(Integer)

    # Results and outputs
    step_output = Column(JSON)  # Step execution result
    screenshot_path = Column(String)  # Screenshot after step execution
    element_detected = Column(
        Boolean, default=False
    )  # Whether target element was found

    # Error handling
    retry_count = Column(Integer, default=0)
    max_retries = Column(Integer, default=3)
    error_message = Column(Text)

    # Arabic/RTL specific tracking
    arabic_text_processed = Column(Boolean, default=False)
    rtl_layout_detected = Column(Boolean, default=False)

    # Audit
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    task = relationship("IraqiTaskModel", back_populates="steps")


class IraqiWorkflowParameterModel(Base):
    """Parameters for workflow execution"""

    __tablename__ = "iraqi_workflow_parameters"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    workflow_id = Column(String, ForeignKey("iraqi_workflows.id"), nullable=False)

    parameter_name = Column(String(100), nullable=False)
    parameter_type = Column(
        String(50), nullable=False
    )  # string, integer, boolean, file, etc.
    is_required = Column(Boolean, default=False)
    default_value = Column(String)

    # Iraqi-specific parameter attributes
    is_sensitive = Column(Boolean, default=False)  # PII or sensitive data
    requires_encryption = Column(Boolean, default=False)
    cultural_validation_required = Column(Boolean, default=False)

    # Validation rules
    validation_rules = Column(JSON)  # JSON schema or validation rules
    allowed_values = Column(JSON)  # For enum-type parameters

    # Display information
    display_name_arabic = Column(String)
    display_name_english = Column(String)
    description_arabic = Column(Text)
    description_english = Column(Text)
    help_text_arabic = Column(Text)
    help_text_english = Column(Text)

    created_at = Column(DateTime, default=datetime.utcnow)


class IraqiAuditLogModel(Base):
    """Comprehensive audit logging for government compliance"""

    __tablename__ = "iraqi_audit_logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))

    # Reference information
    workflow_run_id = Column(String, ForeignKey("iraqi_workflow_runs.id"))
    task_id = Column(String, ForeignKey("iraqi_tasks.id"))
    step_id = Column(String, ForeignKey("iraqi_steps.id"))
    organization_id = Column(String, nullable=False, index=True)

    # Audit event details
    event_type = Column(
        String(100), nullable=False
    )  # workflow_started, task_completed, etc.
    event_description = Column(Text)
    actor_id = Column(String)  # User or system that triggered the event
    actor_role = Column(String)  # User role

    # Government portal interaction
    portal_name = Column(String)  # Which government portal was accessed
    portal_action = Column(String)  # What action was performed
    portal_response = Column(JSON)  # Portal response (sanitized)

    # Data access and modification
    data_accessed = Column(JSON)  # What data was accessed (field names only)
    data_modified = Column(JSON)  # What data was modified
    sensitive_data_involved = Column(Boolean, default=False)

    # Cultural and compliance
    cultural_validation_performed = Column(Boolean, default=False)
    islamic_compliance_checked = Column(Boolean, default=False)
    compliance_status = Column(String)

    # Technical details
    ip_address = Column(String)
    user_agent = Column(String)
    session_id = Column(String)

    # Timing
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    duration_ms = Column(Integer)  # How long the operation took

    # Result
    success = Column(Boolean, default=True)
    error_message = Column(Text)


# Pydantic Models for API


class IraqiWorkflowCreate(BaseModel):
    """Create new Iraqi workflow"""

    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    category: IraqiWorkflowCategory
    workflow_definition: Dict[str, Any]
    parameters_schema: Optional[Dict[str, Any]] = None
    ministry_approvals_required: Optional[List[str]] = []
    cultural_validation_level: IraqiCulturalValidationLevel = (
        IraqiCulturalValidationLevel.STANDARD
    )
    islamic_compliance_required: bool = True
    government_portals: Optional[List[str]] = []
    estimated_duration_minutes: Optional[int] = None


class IraqiWorkflowResponse(BaseModel):
    """Iraqi workflow response"""

    id: str
    title: str
    description: Optional[str]
    category: IraqiWorkflowCategory
    version: str
    status: WorkflowStatus
    cultural_validation_level: IraqiCulturalValidationLevel
    islamic_compliance_required: bool
    created_at: datetime
    created_by: str
    approved_by: Optional[str]
    approval_date: Optional[datetime]


class IraqiWorkflowRunCreate(BaseModel):
    """Create new workflow run"""

    workflow_id: str
    parameters: Dict[str, Any]
    citizen_national_id: Optional[str] = None
    entity_registration_number: Optional[str] = None
    requester_name_arabic: Optional[str] = None
    requester_name_english: Optional[str] = None


class IraqiWorkflowRunResponse(BaseModel):
    """Workflow run response"""

    id: str
    workflow_id: str
    status: WorkflowStatus
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    total_tasks: int
    completed_tasks: int
    failed_tasks: int
    cultural_validation_results: Optional[Dict[str, Any]]
    islamic_compliance_verified: bool
    tracking_numbers: Optional[Dict[str, str]]


class IraqiTaskResponse(BaseModel):
    """Task execution response"""

    id: str
    task_name: str
    task_type: str
    status: TaskStatus
    target_portal: Optional[str]
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    task_outputs: Optional[Dict[str, Any]]
    government_references: Optional[Dict[str, str]]
    cultural_validation_status: str


class IraqiStepResponse(BaseModel):
    """Step execution response"""

    id: str
    step_name: str
    step_type: str
    status: StepStatus
    execution_time_ms: Optional[int]
    arabic_text_processed: bool
    rtl_layout_detected: bool
    element_detected: bool


# Configuration and utility models


class IraqiWorkflowTemplate(BaseModel):
    """Template for common Iraqi workflows"""

    name: str
    category: IraqiWorkflowCategory
    description_arabic: str
    description_english: str
    workflow_definition: Dict[str, Any]
    required_documents: List[str]
    estimated_duration_minutes: int
    ministry_approvals: List[str]
    cultural_validation_level: IraqiCulturalValidationLevel


class IraqiGovernmentPortalConfig(BaseModel):
    """Configuration for Iraqi government portal integration"""

    portal_name: str
    base_url: str
    authentication_type: str
    supports_2fa: bool
    arabic_interface_available: bool
    business_hours: Dict[str, Any]  # Operating hours in Baghdad timezone
    supported_services: List[str]
    required_credentials: List[str]
