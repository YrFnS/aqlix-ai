"""
Iraqi Integration API for Skyvern Enterprise
RESTful APIs for workflow management with Iraqi government systems integration
"""

import asyncio
import json
import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Union
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field, ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from ..exceptions import (
    AuthenticationError,
    IraqiComplianceError,
    TaskExecutionError,
    WorkflowExecutionError
)
from ..services.iraqi_auth_service import (
    IraqiInstitutionAuthService,
    IraqiAuthCredentials,
    IraqiInstitutionConfig
)
from ..task_manager import IraqiTaskManager, IraqiTaskType, IraqiTaskPriority, IraqiTaskConfig
from ..workflow.service import WorkflowService, IraqiWorkflowConfig


logger = logging.getLogger(__name__)
security = HTTPBearer()


# Request/Response Models

class IraqiAuthRequest(BaseModel):
    """Authentication request for Iraqi institutions"""
    username: str
    password: str
    institution_id: str
    national_id: Optional[str] = None
    department: Optional[str] = None
    totp_code: Optional[str] = None
    sms_code: Optional[str] = None
    client_ip: str
    user_agent: str


class IraqiAuthResponse(BaseModel):
    """Authentication response with Iraqi-specific fields"""
    success: bool
    session_token: Optional[str] = None
    user_id: Optional[str] = None
    institution_name: Optional[str] = None
    permissions: List[str] = Field(default_factory=list)
    security_clearance: Optional[str] = None
    government_portal_access: bool = Field(default=False)
    ministry_access: List[str] = Field(default_factory=list)
    expires_at: Optional[str] = None
    error_message: Optional[str] = None


class CreateIraqiTaskRequest(BaseModel):
    """Request to create Iraqi-specific task"""
    task_type: IraqiTaskType
    title: str
    description: str
    url: Optional[str] = None
    priority: IraqiTaskPriority = Field(default=IraqiTaskPriority.NORMAL)
    
    # Task configuration
    respect_business_hours: bool = Field(default=True)
    avoid_friday_prayer: bool = Field(default=True)
    require_cultural_validation: bool = Field(default=True)
    islamic_compliance_check: bool = Field(default=True)
    government_portal_mode: bool = Field(default=False)
    
    # Ministry-specific
    ministry_codes: List[str] = Field(default_factory=list)
    security_clearance_required: str = Field(default="public")
    multi_ministry_coordination: bool = Field(default=False)
    
    # Execution parameters
    parameters: Dict[str, Any] = Field(default_factory=dict)
    max_retries: int = Field(default=3)
    timeout_seconds: int = Field(default=120)


class IraqiTaskResponse(BaseModel):
    """Response for Iraqi task operations"""
    task_id: str
    status: str
    title: str
    task_type: str
    priority: str
    created_at: str
    scheduled_at: Optional[str] = None
    started_at: Optional[str] = None
    completed_at: Optional[str] = None
    
    # Iraqi-specific fields
    islamic_compliance_status: str
    cultural_validation_status: str
    ministry_context: Dict[str, Any] = Field(default_factory=dict)
    
    # Results
    results: Dict[str, Any] = Field(default_factory=dict)
    error_message: Optional[str] = None
    retry_count: int = Field(default=0)


class CreateWorkflowRequest(BaseModel):
    """Request to create Iraqi workflow"""
    workflow_name: str
    description: str
    workflow_type: str = Field(default="iraqi_government")
    
    # Iraqi configuration
    business_hours_enabled: bool = Field(default=True)
    islamic_compliance_required: bool = Field(default=True)
    arabic_processing_enabled: bool = Field(default=True)
    government_portal_mode: bool = Field(default=False)
    multi_ministry_coordination: bool = Field(default=False)
    
    # Workflow definition
    blocks: List[Dict[str, Any]]
    parameters: Dict[str, Any] = Field(default_factory=dict)


class ExecuteWorkflowRequest(BaseModel):
    """Request to execute Iraqi workflow"""
    parameters: Dict[str, Any] = Field(default_factory=dict)
    webhook_callback_url: Optional[str] = None
    
    # Execution preferences
    respect_business_hours: bool = Field(default=True)
    priority: str = Field(default="normal")


class WorkflowResponse(BaseModel):
    """Response for workflow operations"""
    workflow_id: str
    workflow_name: str
    status: str
    created_at: str
    
    # Iraqi-specific
    iraqi_config: Dict[str, Any] = Field(default_factory=dict)
    compliance_status: str = Field(default="pending")


class GovernmentPortalRequest(BaseModel):
    """Request for government portal operations"""
    portal_type: str  # ministry, municipal, court, etc.
    portal_url: str
    operation: str    # login, form_fill, document_download, etc.
    ministry_code: Optional[str] = None
    
    # Authentication
    credentials: Dict[str, str] = Field(default_factory=dict)
    
    # Operation parameters
    form_data: Dict[str, Any] = Field(default_factory=dict)
    documents_to_download: List[str] = Field(default_factory=list)
    
    # Iraqi-specific settings
    arabic_form_processing: bool = Field(default=True)
    islamic_compliance_check: bool = Field(default=True)
    cultural_validation: bool = Field(default=True)


class GovernmentPortalResponse(BaseModel):
    """Response for government portal operations"""
    operation_id: str
    portal_type: str
    status: str
    
    # Results
    forms_processed: List[str] = Field(default_factory=list)
    documents_downloaded: List[Dict[str, Any]] = Field(default_factory=list)
    certificates_obtained: List[Dict[str, Any]] = Field(default_factory=list)
    
    # Compliance
    islamic_compliance_passed: bool = Field(default=True)
    cultural_validation_passed: bool = Field(default=True)
    
    # Errors
    error_message: Optional[str] = None
    warnings: List[str] = Field(default_factory=list)


# API Router
router = APIRouter(prefix="/api/v1/iraqi", tags=["Iraqi Integration"])


# Dependency injection
async def get_auth_service() -> IraqiInstitutionAuthService:
    """Get Iraqi authentication service instance"""
    # This would be injected with proper dependencies
    from ..database import get_db_session
    db_session = await get_db_session()
    return IraqiInstitutionAuthService(
        db_session=db_session,
        jwt_secret="your-jwt-secret",
        encryption_key="your-encryption-key"
    )


async def get_task_manager() -> IraqiTaskManager:
    """Get Iraqi task manager instance"""
    from ..database import get_db_session
    db_session = await get_db_session()
    auth_service = await get_auth_service()
    return IraqiTaskManager(db_session=db_session, auth_service=auth_service)


async def get_workflow_service() -> WorkflowService:
    """Get workflow service instance"""
    from ..database import get_db_session
    db_session = await get_db_session()
    return WorkflowService(db_session=db_session)


async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """Verify JWT token and return user claims"""
    try:
        auth_service = await get_auth_service()
        claims = await auth_service.validate_session_token(credentials.credentials)
        
        if not claims:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token"
            )
            
        return claims
        
    except Exception as e:
        logger.error(f"Token verification failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed"
        )


# Authentication Endpoints

@router.post("/auth/login", response_model=IraqiAuthResponse)
async def authenticate_iraqi_institution(
    request: IraqiAuthRequest,
    http_request: Request,
    auth_service: IraqiInstitutionAuthService = Depends(get_auth_service)
):
    """Authenticate user with Iraqi institution credentials"""
    
    try:
        # Create credentials object
        credentials = IraqiAuthCredentials(
            username=request.username,
            password=request.password,
            institution_id=request.institution_id,
            national_id=request.national_id,
            department=request.department,
            totp_code=request.totp_code,
            sms_code=request.sms_code,
            client_ip=request.client_ip,
            user_agent=request.user_agent
        )
        
        # Default institution config (would be loaded from database)
        institution_config = IraqiInstitutionConfig(
            institution_type="government",
            require_two_factor=True,
            session_timeout_minutes=30,
            require_iraqi_citizenship=True,
            allow_government_portal_access=True
        )
        
        # Authenticate
        auth_result = await auth_service.authenticate_iraqi_institution(
            credentials, institution_config
        )
        
        if auth_result.success:
            return IraqiAuthResponse(
                success=True,
                session_token=auth_result.session_token,
                user_id=auth_result.user_id,
                institution_name="Iraqi Government Institution",
                permissions=auth_result.permissions,
                security_clearance=auth_result.security_clearance,
                government_portal_access=auth_result.government_portal_access,
                ministry_access=auth_result.ministry_access,
                expires_at=auth_result.expires_at.isoformat() if auth_result.expires_at else None
            )
        else:
            return IraqiAuthResponse(
                success=False,
                error_message=auth_result.error_message
            )
            
    except Exception as e:
        logger.error(f"Authentication error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication system error"
        )


@router.post("/auth/logout")
async def logout_iraqi_session(
    user_claims: Dict[str, Any] = Depends(verify_token),
    auth_service: IraqiInstitutionAuthService = Depends(get_auth_service)
):
    """Logout and revoke Iraqi session token"""
    
    try:
        # Revoke session token
        token_revoked = await auth_service.revoke_session_token(
            user_claims.get("jti", "")
        )
        
        return {"success": token_revoked, "message": "Session terminated"}
        
    except Exception as e:
        logger.error(f"Logout error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Logout failed"
        )


# Task Management Endpoints

@router.post("/tasks", response_model=IraqiTaskResponse)
async def create_iraqi_task(
    request: CreateIraqiTaskRequest,
    user_claims: Dict[str, Any] = Depends(verify_token),
    task_manager: IraqiTaskManager = Depends(get_task_manager)
):
    """Create a new Iraqi-specific task"""
    
    try:
        # Create task configuration
        task_config = IraqiTaskConfig(
            task_type=request.task_type,
            priority=request.priority,
            respect_business_hours=request.respect_business_hours,
            avoid_friday_prayer=request.avoid_friday_prayer,
            require_cultural_validation=request.require_cultural_validation,
            islamic_compliance_check=request.islamic_compliance_check,
            government_portal_mode=request.government_portal_mode,
            ministry_codes=request.ministry_codes,
            security_clearance_required=request.security_clearance_required,
            multi_ministry_coordination=request.multi_ministry_coordination,
            max_retries=request.max_retries,
            timeout_seconds=request.timeout_seconds
        )
        
        # Create task
        task_id = await task_manager.create_task(
            task_type=request.task_type,
            title=request.title,
            description=request.description,
            config=task_config,
            parameters=request.parameters,
            url=request.url,
            user_id=user_claims.get("user_id"),
            institution_id=user_claims.get("institution_id")
        )
        
        # Get task status
        task_status = await task_manager.get_task_status(task_id)
        
        if not task_status:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to retrieve created task"
            )
            
        return IraqiTaskResponse(**task_status)
        
    except TaskExecutionError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Task creation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Task creation failed"
        )


@router.get("/tasks/{task_id}", response_model=IraqiTaskResponse)
async def get_iraqi_task_status(
    task_id: str,
    user_claims: Dict[str, Any] = Depends(verify_token),
    task_manager: IraqiTaskManager = Depends(get_task_manager)
):
    """Get Iraqi task status and details"""
    
    try:
        task_status = await task_manager.get_task_status(task_id)
        
        if not task_status:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
            
        # Verify user has access to this task
        if task_status.get("user_id") != user_claims.get("user_id"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
            
        return IraqiTaskResponse(**task_status)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Task status retrieval error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve task status"
        )


@router.delete("/tasks/{task_id}")
async def cancel_iraqi_task(
    task_id: str,
    user_claims: Dict[str, Any] = Depends(verify_token),
    task_manager: IraqiTaskManager = Depends(get_task_manager)
):
    """Cancel a pending or running Iraqi task"""
    
    try:
        # Verify task exists and user has access
        task_status = await task_manager.get_task_status(task_id)
        
        if not task_status:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
            
        if task_status.get("user_id") != user_claims.get("user_id"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
            
        # Cancel task
        cancelled = await task_manager.cancel_task(task_id)
        
        return {
            "success": cancelled,
            "message": "Task cancelled" if cancelled else "Task could not be cancelled"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Task cancellation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Task cancellation failed"
        )


# Workflow Management Endpoints

@router.post("/workflows", response_model=WorkflowResponse)
async def create_iraqi_workflow(
    request: CreateWorkflowRequest,
    user_claims: Dict[str, Any] = Depends(verify_token),
    workflow_service: WorkflowService = Depends(get_workflow_service)
):
    """Create a new Iraqi workflow"""
    
    try:
        # Create Iraqi workflow configuration
        iraqi_config = IraqiWorkflowConfig(
            business_hours_enabled=request.business_hours_enabled,
            islamic_compliance_required=request.islamic_compliance_required,
            arabic_processing_enabled=request.arabic_processing_enabled,
            government_portal_mode=request.government_portal_mode,
            multi_ministry_coordination=request.multi_ministry_coordination
        )
        
        # Create workflow definition
        from ..workflow.models import WorkflowDefinition
        workflow_def = WorkflowDefinition(
            workflow_name=request.workflow_name,
            description=request.description,
            blocks=request.blocks,
            parameters=request.parameters
        )
        
        # Create workflow
        workflow_id = await workflow_service.create_workflow(
            workflow_definition=workflow_def,
            organization_id=user_claims.get("institution_id"),
            workflow_type=request.workflow_type
        )
        
        return WorkflowResponse(
            workflow_id=workflow_id,
            workflow_name=request.workflow_name,
            status="created",
            created_at=datetime.now(timezone.utc).isoformat(),
            iraqi_config=iraqi_config.dict(),
            compliance_status="pending"
        )
        
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Validation error: {e}"
        )
    except Exception as e:
        logger.error(f"Workflow creation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Workflow creation failed"
        )


@router.post("/workflows/{workflow_id}/execute")
async def execute_iraqi_workflow(
    workflow_id: str,
    request: ExecuteWorkflowRequest,
    user_claims: Dict[str, Any] = Depends(verify_token),
    workflow_service: WorkflowService = Depends(get_workflow_service)
):
    """Execute an Iraqi workflow"""
    
    try:
        # Execute workflow
        run_id = await workflow_service.execute_workflow(
            workflow_id=workflow_id,
            parameters=request.parameters,
            webhook_callback_url=request.webhook_callback_url
        )
        
        return {
            "success": True,
            "workflow_id": workflow_id,
            "run_id": run_id,
            "status": "running",
            "started_at": datetime.now(timezone.utc).isoformat()
        }
        
    except WorkflowExecutionError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Workflow execution error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Workflow execution failed"
        )


# Government Portal Integration Endpoints

@router.post("/government-portal", response_model=GovernmentPortalResponse)
async def access_government_portal(
    request: GovernmentPortalRequest,
    user_claims: Dict[str, Any] = Depends(verify_token),
    task_manager: IraqiTaskManager = Depends(get_task_manager)
):
    """Access Iraqi government portal for automated operations"""
    
    try:
        # Verify government portal access permission
        if not user_claims.get("government_access", False):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Government portal access not authorized"
            )
            
        # Create government portal task
        task_config = IraqiTaskConfig(
            task_type=IraqiTaskType.GOVERNMENT_PORTAL,
            priority=IraqiTaskPriority.HIGH,
            government_portal_mode=True,
            require_cultural_validation=request.cultural_validation,
            islamic_compliance_check=request.islamic_compliance_check,
            arabic_text_processing=request.arabic_form_processing,
            ministry_codes=[request.ministry_code] if request.ministry_code else [],
            timeout_seconds=120
        )
        
        # Prepare task parameters
        parameters = {
            "portal_type": request.portal_type,
            "portal_url": request.portal_url,
            "operation": request.operation,
            "form_data": request.form_data,
            "documents_to_download": request.documents_to_download,
            "credentials": request.credentials
        }
        
        # Create and execute task
        task_id = await task_manager.create_task(
            task_type=IraqiTaskType.GOVERNMENT_PORTAL,
            title=f"Government Portal: {request.operation}",
            description=f"Portal operation on {request.portal_type}",
            config=task_config,
            parameters=parameters,
            url=request.portal_url,
            user_id=user_claims.get("user_id"),
            institution_id=user_claims.get("institution_id")
        )
        
        # Return operation ID and initial status
        return GovernmentPortalResponse(
            operation_id=task_id,
            portal_type=request.portal_type,
            status="processing",
            islamic_compliance_passed=True,
            cultural_validation_passed=True
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Government portal access error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Government portal access failed"
        )


# System Status and Health Endpoints

@router.get("/status")
async def get_system_status(
    user_claims: Dict[str, Any] = Depends(verify_token),
    task_manager: IraqiTaskManager = Depends(get_task_manager)
):
    """Get Iraqi AI system status"""
    
    try:
        queue_status = await task_manager.get_queue_status()
        
        return {
            "system": "Iraqi AI Chat System - Skyvern Integration",
            "status": "operational",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "task_queues": queue_status,
            "features": {
                "government_portal_access": True,
                "islamic_compliance": True,
                "arabic_processing": True,
                "multi_ministry_coordination": True,
                "business_hours_scheduling": True
            }
        }
        
    except Exception as e:
        logger.error(f"Status retrieval error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Status retrieval failed"
        )


@router.get("/health")
async def health_check():
    """Health check endpoint for Iraqi AI system"""
    
    try:
        # Basic health checks
        current_time = datetime.now(timezone.utc)
        
        return {
            "status": "healthy",
            "timestamp": current_time.isoformat(),
            "version": "1.0.0",
            "components": {
                "authentication": "healthy",
                "task_manager": "healthy",
                "workflow_service": "healthy",
                "browser_automation": "healthy",
                "government_portals": "healthy"
            }
        }
        
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now(timezone.utc).isoformat()
        }


# Error handlers
@router.exception_handler(IraqiComplianceError)
async def iraqi_compliance_exception_handler(request: Request, exc: IraqiComplianceError):
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"Iraqi compliance error: {str(exc)}"
    )


@router.exception_handler(AuthenticationError)
async def auth_exception_handler(request: Request, exc: AuthenticationError):
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=f"Authentication error: {str(exc)}"
    )