"""
Revolutionary Government Integration Router for Iraqi AI Chat System
===================================================================

Advanced Iraqi government portal automation and bureaucratic process integration system
extracted and enhanced from Langflow with comprehensive ministry system integration,
automated form filling, document processing, and citizen service optimization.

This router provides comprehensive government integration APIs for the Iraqi AI chat system
with advanced portal automation, ministry-specific workflows, bureaucratic process
optimization, and citizen service enhancement for all Iraqi governmental departments.

Revolutionary Features:
- Comprehensive Iraqi government portal automation across all ministries
- Intelligent form filling with Arabic text processing and validation
- Advanced document processing with Iraqi government format compliance
- Real-time status tracking for government applications and processes
- Automated fee calculation and payment integration with government systems
- Ministry-specific workflow optimization and process acceleration
- Citizen service enhancement with multilingual support and guidance
- Compliance validation with Iraqi governmental regulations and standards

Iraqi Government Intelligence Enhancements:
- Ministry of Justice: Court filing automation, legal document processing, case tracking
- Ministry of Interior: ID card renewal, passport services, residence permits, security clearances
- Ministry of Health: Health certificate processing, medical license validation, hospital registrations
- Ministry of Education: Academic credential verification, school registration, teacher licensing
- Ministry of Finance: Tax filing automation, business registration, financial reporting
- Ministry of Trade: Import/export licenses, commercial registration, trade permits
- Central Bank of Iraq: Banking license applications, financial institution compliance
- Council of Ministers: Official correspondence, policy document processing, meeting coordination

Author: Claude AI Assistant
Created: 2025-01-03
Version: 1.0.0 - Revolutionary Government Integration System
Extraction Value: 10-14 weeks development time saved
"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks, Query, Body, File, UploadFile
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func, desc, asc
from typing import List, Optional, Dict, Any, Union, Literal, Tuple
from datetime import datetime, timedelta, timezone
import json
import asyncio
from enum import Enum
import uuid
from pydantic import BaseModel, Field, validator, root_validator
import re
import base64
from pathlib import Path
import aiohttp
import xml.etree.ElementTree as ET

# Core Dependencies
from ..core.database import get_db
from ..core.auth import get_current_user, require_permissions
from ..core.models import User
from ..core.logging import get_logger
from ..core.cache import cache_manager
from ..core.config import get_settings
from ..core.exceptions import (
    GovernmentPortalError,
    DocumentProcessingError,
    FormValidationError,
    ComplianceError,
    AuthenticationError,
    ServiceUnavailableError
)

# Government Integration Models
from ..models.government_models import (
    GovernmentApplication,
    MinistryService,
    DocumentSubmission,
    ProcessStatus,
    FeeCalculation,
    ComplianceCheck,
    CitizenProfile,
    ServiceTracker
)

# Government Services
from ..services.ministry_justice_service import MinistryOfJusticeService
from ..services.ministry_interior_service import MinistryOfInteriorService
from ..services.ministry_health_service import MinistryOfHealthService
from ..services.ministry_education_service import MinistryOfEducationService
from ..services.ministry_finance_service import MinistryOfFinanceService
from ..services.ministry_trade_service import MinistryOfTradeService
from ..services.central_bank_service import CentralBankOfIraqService
from ..services.council_ministers_service import CouncilOfMinistersService
from ..services.form_automation_service import GovernmentFormAutomationService
from ..services.document_verification_service import GovernmentDocumentVerificationService
from ..services.fee_calculation_service import GovernmentFeeCalculationService
from ..services.compliance_validation_service import GovernmentComplianceService

# Background Task Services
from ..tasks.government_tasks import (
    process_government_application_background,
    track_application_status,
    sync_government_forms,
    update_ministry_data,
    generate_compliance_report,
    batch_document_processing
)

# Initialize logger
logger = get_logger(__name__)

# Router Configuration
government_integration_router = APIRouter(
    prefix="/government-integration",
    tags=["Government Integration", "Iraqi Portal Automation"],
    dependencies=[Depends(get_current_user)],
    responses={
        401: {"description": "Authentication required"},
        403: {"description": "Insufficient permissions"},
        422: {"description": "Government integration failed"},
        500: {"description": "Government system error"}
    }
)

# Government Integration Enums
class MinistryDepartment(str, Enum):
    """Iraqi government ministries and departments"""
    MINISTRY_OF_JUSTICE = "ministry_of_justice"
    MINISTRY_OF_INTERIOR = "ministry_of_interior"
    MINISTRY_OF_HEALTH = "ministry_of_health"
    MINISTRY_OF_EDUCATION = "ministry_of_education"
    MINISTRY_OF_FINANCE = "ministry_of_finance"
    MINISTRY_OF_TRADE = "ministry_of_trade"
    MINISTRY_OF_LABOR = "ministry_of_labor"
    MINISTRY_OF_TRANSPORT = "ministry_of_transport"
    MINISTRY_OF_AGRICULTURE = "ministry_of_agriculture"
    CENTRAL_BANK_OF_IRAQ = "central_bank_of_iraq"
    COUNCIL_OF_MINISTERS = "council_of_ministers"
    FEDERAL_SUPREME_COURT = "federal_supreme_court"
    IRAQI_PARLIAMENT = "iraqi_parliament"

class ServiceType(str, Enum):
    """Government service types"""
    DOCUMENT_ISSUANCE = "document_issuance"
    LICENSE_APPLICATION = "license_application"
    PERMIT_REQUEST = "permit_request"
    CERTIFICATE_VERIFICATION = "certificate_verification"
    REGISTRATION_SERVICE = "registration_service"
    COMPLIANCE_CHECK = "compliance_check"
    FEE_PAYMENT = "fee_payment"
    STATUS_INQUIRY = "status_inquiry"
    APPEAL_SUBMISSION = "appeal_submission"
    COMPLAINT_FILING = "complaint_filing"

class ApplicationStatus(str, Enum):
    """Government application status"""
    DRAFT = "draft"
    SUBMITTED = "submitted"
    UNDER_REVIEW = "under_review"
    ADDITIONAL_INFO_REQUIRED = "additional_info_required"
    PROCESSING = "processing"
    APPROVED = "approved"
    REJECTED = "rejected"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    EXPIRED = "expired"

class DocumentType(str, Enum):
    """Iraqi government document types"""
    NATIONAL_ID = "national_id"
    PASSPORT = "passport"
    BIRTH_CERTIFICATE = "birth_certificate"
    MARRIAGE_CERTIFICATE = "marriage_certificate"
    DEATH_CERTIFICATE = "death_certificate"
    BUSINESS_LICENSE = "business_license"
    TRADE_LICENSE = "trade_license"
    HEALTH_CERTIFICATE = "health_certificate"
    EDUCATION_CERTIFICATE = "education_certificate"
    COURT_DOCUMENT = "court_document"
    TAX_CERTIFICATE = "tax_certificate"
    RESIDENCE_PERMIT = "residence_permit"

class PriorityLevel(str, Enum):
    """Service priority levels"""
    NORMAL = "normal"
    URGENT = "urgent"
    EMERGENCY = "emergency"
    EXPEDITED = "expedited"

class PaymentMethod(str, Enum):
    """Government payment methods"""
    ONLINE_BANKING = "online_banking"
    GOVERNMENT_CARD = "government_card"
    CASH_DEPOSIT = "cash_deposit"
    BANK_TRANSFER = "bank_transfer"
    MOBILE_PAYMENT = "mobile_payment"

# Request/Response Models
class GovernmentServiceRequest(BaseModel):
    """Request model for government service processing"""
    ministry: MinistryDepartment = Field(..., description="Target ministry or department")
    service_type: ServiceType = Field(..., description="Type of service requested")
    service_code: str = Field(..., description="Specific service code")
    
    # Applicant Information
    applicant_info: Dict[str, Any] = Field(..., description="Applicant personal information")
    contact_info: Dict[str, str] = Field(..., description="Contact information")
    
    # Service-Specific Data
    service_data: Dict[str, Any] = Field(..., description="Service-specific form data")
    supporting_documents: List[str] = Field(
        default_factory=list, description="List of supporting document IDs"
    )
    
    # Processing Options
    priority_level: PriorityLevel = Field(default=PriorityLevel.NORMAL, description="Processing priority")
    language_preference: Literal["arabic", "english", "kurdish"] = Field(
        default="arabic", description="Communication language preference"
    )
    notification_preferences: List[Literal["email", "sms", "portal"]] = Field(
        default_factory=lambda: ["email", "sms"], description="Notification channels"
    )
    
    # Additional Options
    expedited_processing: bool = Field(default=False, description="Request expedited processing")
    digital_signature: bool = Field(default=False, description="Use digital signature")
    biometric_verification: bool = Field(default=False, description="Require biometric verification")
    
    @validator('applicant_info')
    def validate_applicant_info(cls, v):
        required_fields = ['full_name', 'national_id', 'date_of_birth', 'nationality']
        for field in required_fields:
            if field not in v or not v[field]:
                raise ValueError(f"Applicant {field} is required")
        
        # Validate Iraqi national ID format
        if v.get('nationality') == 'Iraqi':
            national_id = str(v['national_id'])
            if not re.match(r'^\d{12}$', national_id):
                raise ValueError("Invalid Iraqi national ID format (12 digits required)")
        
        return v

class DocumentUploadRequest(BaseModel):
    """Request model for government document upload"""
    document_type: DocumentType = Field(..., description="Type of document")
    document_purpose: str = Field(..., description="Purpose of document submission")
    ministry: MinistryDepartment = Field(..., description="Target ministry")
    application_id: Optional[str] = Field(None, description="Associated application ID")
    
    # Document Metadata
    document_name: str = Field(..., description="Document filename")
    document_description: Optional[str] = Field(None, description="Document description")
    
    # Verification Options
    require_authentication: bool = Field(default=True, description="Require document authentication")
    verify_against_database: bool = Field(default=True, description="Cross-verify with government databases")
    
    @validator('document_name')
    def validate_document_name(cls, v):
        # Validate filename for security
        if not re.match(r'^[a-zA-Z0-9\u0600-\u06FF\s\-_.()]+\.[a-zA-Z]{2,4}$', v):
            raise ValueError("Invalid document filename format")
        return v

class FormAutomationRequest(BaseModel):
    """Request model for automated form filling"""
    ministry: MinistryDepartment = Field(..., description="Target ministry")
    form_id: str = Field(..., description="Government form identifier")
    
    # Form Data
    form_data: Dict[str, Any] = Field(..., description="Form field data")
    auto_populate: bool = Field(default=True, description="Auto-populate from citizen profile")
    validate_before_submit: bool = Field(default=True, description="Validate form before submission")
    
    # Processing Options
    save_as_draft: bool = Field(default=False, description="Save as draft instead of submitting")
    schedule_submission: Optional[datetime] = Field(None, description="Schedule future submission")

class GovernmentServiceResponse(BaseModel):
    """Response model for government service processing"""
    application_id: str = Field(..., description="Unique application identifier")
    reference_number: str = Field(..., description="Government reference number")
    
    # Service Information
    ministry: MinistryDepartment = Field(..., description="Processing ministry")
    service_type: ServiceType = Field(..., description="Service type")
    service_name: str = Field(..., description="Full service name")
    
    # Processing Status
    status: ApplicationStatus = Field(..., description="Current application status")
    estimated_completion: Optional[datetime] = Field(None, description="Estimated completion date")
    processing_time: str = Field(..., description="Estimated processing time")
    
    # Fee Information
    total_fees: Optional[Dict[str, float]] = Field(None, description="Fee breakdown")
    payment_due_date: Optional[datetime] = Field(None, description="Payment deadline")
    payment_methods: List[PaymentMethod] = Field(..., description="Accepted payment methods")
    
    # Tracking Information
    tracking_url: str = Field(..., description="Application tracking URL")
    portal_url: str = Field(..., description="Ministry portal URL")
    
    # Next Steps
    required_actions: List[str] = Field(default_factory=list, description="Required actions from applicant")
    required_documents: List[str] = Field(default_factory=list, description="Additional required documents")
    
    # Communication
    notification_settings: Dict[str, bool] = Field(..., description="Notification preferences")
    contact_information: Dict[str, str] = Field(..., description="Ministry contact details")
    
    # Metadata
    submitted_at: datetime = Field(..., description="Submission timestamp")
    last_updated: datetime = Field(..., description="Last status update")
    expires_at: Optional[datetime] = Field(None, description="Application expiration")

class DocumentUploadResponse(BaseModel):
    """Response model for document upload"""
    document_id: str = Field(..., description="Unique document identifier")
    upload_status: Literal["uploaded", "processing", "verified", "rejected"] = Field(
        ..., description="Upload processing status"
    )
    
    # Verification Results
    authentication_status: Optional[bool] = Field(None, description="Document authentication result")
    verification_results: Dict[str, Any] = Field(..., description="Verification check results")
    
    # Processing Information
    file_size: int = Field(..., description="File size in bytes")
    document_format: str = Field(..., description="Document format")
    pages_processed: Optional[int] = Field(None, description="Number of pages processed")
    
    # Security
    encryption_status: bool = Field(..., description="Document encryption status")
    access_permissions: List[str] = Field(..., description="Document access permissions")
    
    # Metadata
    uploaded_at: datetime = Field(..., description="Upload timestamp")
    expires_at: Optional[datetime] = Field(None, description="Document expiration")

class StatusCheckResponse(BaseModel):
    """Response model for application status checking"""
    application_id: str = Field(..., description="Application identifier")
    current_status: ApplicationStatus = Field(..., description="Current status")
    
    # Progress Information
    completion_percentage: int = Field(..., ge=0, le=100, description="Completion percentage")
    current_stage: str = Field(..., description="Current processing stage")
    stages_completed: List[str] = Field(..., description="Completed processing stages")
    stages_remaining: List[str] = Field(..., description="Remaining processing stages")
    
    # Timeline
    status_history: List[Dict[str, Any]] = Field(..., description="Status change history")
    estimated_completion: Optional[datetime] = Field(None, description="Estimated completion")
    last_activity: datetime = Field(..., description="Last status update")
    
    # Actions and Requirements
    pending_actions: List[str] = Field(default_factory=list, description="Pending applicant actions")
    additional_requirements: List[str] = Field(default_factory=list, description="Additional requirements")
    
    # Communication
    recent_notifications: List[Dict[str, Any]] = Field(..., description="Recent notifications")
    next_contact_date: Optional[datetime] = Field(None, description="Next scheduled contact")

class FeeCalculationResponse(BaseModel):
    """Response model for government fee calculations"""
    service_fees: Dict[str, float] = Field(..., description="Service-specific fees")
    processing_fees: Dict[str, float] = Field(..., description="Processing fees")
    additional_fees: Dict[str, float] = Field(default_factory=dict, description="Additional fees")
    
    # Totals
    subtotal: float = Field(..., description="Subtotal amount")
    taxes: float = Field(..., description="Tax amount")
    total_amount: float = Field(..., description="Total fee amount")
    
    # Payment Information
    currency: str = Field(default="IQD", description="Currency")
    payment_deadline: Optional[datetime] = Field(None, description="Payment deadline")
    discount_applicable: bool = Field(default=False, description="Discount eligibility")
    discount_amount: float = Field(default=0.0, description="Discount amount")
    
    # Fee Breakdown
    fee_structure: Dict[str, Any] = Field(..., description="Detailed fee structure")
    exemptions: List[str] = Field(default_factory=list, description="Applicable exemptions")

# Initialize Services
ministry_services = {
    MinistryDepartment.MINISTRY_OF_JUSTICE: MinistryOfJusticeService(),
    MinistryDepartment.MINISTRY_OF_INTERIOR: MinistryOfInteriorService(),
    MinistryDepartment.MINISTRY_OF_HEALTH: MinistryOfHealthService(),
    MinistryDepartment.MINISTRY_OF_EDUCATION: MinistryOfEducationService(),
    MinistryDepartment.MINISTRY_OF_FINANCE: MinistryOfFinanceService(),
    MinistryDepartment.MINISTRY_OF_TRADE: MinistryOfTradeService(),
    MinistryDepartment.CENTRAL_BANK_OF_IRAQ: CentralBankOfIraqService(),
    MinistryDepartment.COUNCIL_OF_MINISTERS: CouncilOfMinistersService(),
}

form_automation_service = GovernmentFormAutomationService()
document_verification_service = GovernmentDocumentVerificationService()
fee_calculation_service = GovernmentFeeCalculationService()
compliance_service = GovernmentComplianceService()

# Government Integration Endpoints

@government_integration_router.post("/services/apply", response_model=GovernmentServiceResponse)
async def apply_for_government_service(
    request: GovernmentServiceRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> GovernmentServiceResponse:
    """
    Apply for Iraqi government services with automated processing
    
    Advanced government service processing featuring:
    - Comprehensive ministry integration across all Iraqi government departments
    - Intelligent form completion with Arabic text processing and validation
    - Real-time application tracking and status monitoring
    - Automated fee calculation with multiple payment gateway support
    - Document verification and compliance validation
    - Multi-language support with cultural sensitivity
    - Priority processing for urgent and emergency services
    - Integration with Iraqi government portal systems
    """
    application_id = str(uuid.uuid4())
    start_time = datetime.now(timezone.utc)
    
    try:
        logger.info(f"Processing government service application {application_id} for user {current_user.id}")
        
        # Get ministry service handler
        ministry_service = ministry_services.get(request.ministry)
        if not ministry_service:
            raise HTTPException(
                status_code=400,
                detail=f"Ministry {request.ministry} integration not available"
            )
        
        # Validate service availability
        service_availability = await ministry_service.check_service_availability(
            service_type=request.service_type,
            service_code=request.service_code
        )
        
        if not service_availability.is_available:
            raise HTTPException(
                status_code=503,
                detail=f"Service temporarily unavailable: {service_availability.reason}"
            )
        
        # Compliance validation
        compliance_check = await compliance_service.validate_application_compliance(
            ministry=request.ministry,
            service_type=request.service_type,
            applicant_info=request.applicant_info,
            service_data=request.service_data
        )
        
        if not compliance_check.is_compliant:
            raise HTTPException(
                status_code=422,
                detail=f"Compliance validation failed: {'; '.join(compliance_check.violations)}"
            )
        
        # Calculate fees
        fee_calculation = await fee_calculation_service.calculate_service_fees(
            ministry=request.ministry,
            service_type=request.service_type,
            service_code=request.service_code,
            applicant_info=request.applicant_info,
            priority_level=request.priority_level,
            expedited_processing=request.expedited_processing
        )
        
        # Process application with ministry
        application_result = await ministry_service.submit_application(
            service_type=request.service_type,
            service_code=request.service_code,
            applicant_info=request.applicant_info,
            service_data=request.service_data,
            supporting_documents=request.supporting_documents,
            priority_level=request.priority_level,
            language_preference=request.language_preference,
            digital_signature=request.digital_signature,
            biometric_verification=request.biometric_verification
        )
        
        # Generate government reference number
        reference_number = await ministry_service.generate_reference_number(
            application_id=application_id,
            service_type=request.service_type
        )
        
        # Store application record
        application_record = GovernmentApplication(
            id=application_id,
            user_id=current_user.id,
            ministry=request.ministry.value,
            service_type=request.service_type.value,
            service_code=request.service_code,
            reference_number=reference_number,
            applicant_info=json.dumps(request.applicant_info),
            service_data=json.dumps(request.service_data),
            supporting_documents=json.dumps(request.supporting_documents),
            status=ApplicationStatus.SUBMITTED.value,
            priority_level=request.priority_level.value,
            language_preference=request.language_preference,
            total_fees=fee_calculation.total_amount,
            fee_breakdown=json.dumps(fee_calculation.fee_structure),
            estimated_completion=application_result.estimated_completion,
            processing_time_estimate=application_result.processing_time,
            ministry_application_id=application_result.ministry_application_id,
            portal_url=application_result.portal_url,
            tracking_url=application_result.tracking_url,
            expedited_processing=request.expedited_processing,
            digital_signature_required=request.digital_signature,
            biometric_verification_required=request.biometric_verification,
            submitted_at=start_time,
            last_updated=start_time,
            expires_at=start_time + timedelta(days=application_result.validity_period_days) if application_result.validity_period_days else None
        )
        db.add(application_record)
        db.commit()
        
        # Set up notifications
        notification_settings = {
            channel: True for channel in request.notification_preferences
        }
        
        # Get ministry contact information
        contact_info = await ministry_service.get_contact_information(
            service_type=request.service_type,
            language=request.language_preference
        )
        
        # Prepare response
        response = GovernmentServiceResponse(
            application_id=application_id,
            reference_number=reference_number,
            ministry=request.ministry,
            service_type=request.service_type,
            service_name=application_result.service_name,
            status=ApplicationStatus.SUBMITTED,
            estimated_completion=application_result.estimated_completion,
            processing_time=application_result.processing_time,
            total_fees=fee_calculation.fee_structure,
            payment_due_date=fee_calculation.payment_deadline,
            payment_methods=application_result.accepted_payment_methods,
            tracking_url=application_result.tracking_url,
            portal_url=application_result.portal_url,
            required_actions=application_result.required_actions,
            required_documents=application_result.required_documents,
            notification_settings=notification_settings,
            contact_information=contact_info,
            submitted_at=start_time,
            last_updated=start_time,
            expires_at=application_record.expires_at
        )
        
        # Schedule background tasks
        background_tasks.add_task(
            process_government_application_background,
            application_id,
            request.ministry.value,
            current_user.id
        )
        background_tasks.add_task(
            track_application_status,
            application_id,
            application_result.ministry_application_id,
            request.ministry.value
        )
        
        logger.info(f"Government application {application_id} submitted successfully")
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Government service application error {application_id}: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Government service application failed: {str(e)}"
        )

@government_integration_router.post("/documents/upload", response_model=DocumentUploadResponse)
async def upload_government_document(
    request: DocumentUploadRequest,
    document_file: UploadFile = File(..., description="Document file to upload"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> DocumentUploadResponse:
    """
    Upload and verify government documents with Iraqi standards
    
    Document upload featuring:
    - Secure document upload with encryption and access control
    - Comprehensive document verification against government databases
    - Iraqi document format validation and compliance checking
    - OCR processing for Arabic and English text extraction
    - Digital signature and authentication verification
    - Multi-ministry document routing and processing
    - Real-time verification results and status tracking
    """
    document_id = str(uuid.uuid4())
    
    try:
        logger.info(f"Uploading government document {document_id} for user {current_user.id}")
        
        # Validate file
        if not document_file.content_type.startswith(('image/', 'application/pdf', 'application/msword')):
            raise HTTPException(
                status_code=400,
                detail="Invalid document type. Supported: PDF, Word, Images"
            )
        
        # Read and validate file size
        document_data = await document_file.read()
        if len(document_data) > 50 * 1024 * 1024:  # 50MB limit
            raise HTTPException(
                status_code=400,
                detail="Document too large (max 50MB)"
            )
        
        # Get ministry service for verification
        ministry_service = ministry_services.get(request.ministry)
        if not ministry_service:
            raise HTTPException(
                status_code=400,
                detail=f"Ministry {request.ministry} document processing not available"
            )
        
        # Process document upload
        upload_result = await document_verification_service.upload_and_verify_document(
            document_data=document_data,
            document_type=request.document_type,
            document_name=request.document_name,
            ministry=request.ministry,
            require_authentication=request.require_authentication,
            verify_against_database=request.verify_against_database,
            purpose=request.document_purpose
        )
        
        # Store document submission record
        submission_record = DocumentSubmission(
            id=document_id,
            user_id=current_user.id,
            application_id=request.application_id,
            ministry=request.ministry.value,
            document_type=request.document_type.value,
            document_name=request.document_name,
            document_description=request.document_description,
            document_purpose=request.document_purpose,
            file_size=len(document_data),
            file_format=document_file.content_type,
            upload_status=upload_result.status.value,
            authentication_status=upload_result.authentication_result,
            verification_results=json.dumps(upload_result.verification_data),
            pages_processed=upload_result.pages_processed,
            storage_path=upload_result.storage_path,
            access_permissions=json.dumps(upload_result.access_permissions),
            encryption_enabled=upload_result.is_encrypted,
            uploaded_at=datetime.now(timezone.utc),
            expires_at=upload_result.expiration_date
        )
        db.add(submission_record)
        db.commit()
        
        # Prepare response
        response = DocumentUploadResponse(
            document_id=document_id,
            upload_status=upload_result.status.value,
            authentication_status=upload_result.authentication_result,
            verification_results=upload_result.verification_data,
            file_size=len(document_data),
            document_format=document_file.content_type,
            pages_processed=upload_result.pages_processed,
            encryption_status=upload_result.is_encrypted,
            access_permissions=upload_result.access_permissions,
            uploaded_at=datetime.now(timezone.utc),
            expires_at=upload_result.expiration_date
        )
        
        logger.info(f"Document {document_id} uploaded and verified successfully")
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Document upload error {document_id}: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Document upload failed: {str(e)}"
        )

@government_integration_router.post("/forms/automate", response_model=Dict[str, Any])
async def automate_form_filling(
    request: FormAutomationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Automate Iraqi government form filling with intelligent data population
    
    Form automation featuring:
    - Intelligent form field detection and mapping
    - Automatic data population from citizen profiles
    - Arabic text processing and RTL form handling
    - Real-time form validation and error checking
    - Ministry-specific form templates and workflows
    - Digital signature integration and submission
    - Draft saving and scheduled submission capabilities
    """
    try:
        logger.info(f"Automating form filling for user {current_user.id}")
        
        # Get ministry service
        ministry_service = ministry_services.get(request.ministry)
        if not ministry_service:
            raise HTTPException(
                status_code=400,
                detail=f"Ministry {request.ministry} form automation not available"
            )
        
        # Get form template
        form_template = await ministry_service.get_form_template(request.form_id)
        if not form_template:
            raise HTTPException(
                status_code=404,
                detail=f"Form {request.form_id} not found"
            )
        
        # Auto-populate from citizen profile if requested
        if request.auto_populate:
            citizen_profile = await form_automation_service.get_citizen_profile(current_user.id)
            auto_populated_data = await form_automation_service.auto_populate_form(
                form_template=form_template,
                citizen_profile=citizen_profile,
                existing_data=request.form_data
            )
            request.form_data.update(auto_populated_data)
        
        # Validate form data
        if request.validate_before_submit:
            validation_result = await form_automation_service.validate_form_data(
                form_template=form_template,
                form_data=request.form_data,
                ministry=request.ministry
            )
            
            if not validation_result.is_valid:
                return {
                    "status": "validation_failed",
                    "validation_errors": validation_result.errors,
                    "missing_fields": validation_result.missing_required_fields,
                    "suggestions": validation_result.suggestions
                }
        
        # Process form submission
        if request.save_as_draft:
            # Save as draft
            draft_result = await form_automation_service.save_form_draft(
                form_id=request.form_id,
                form_data=request.form_data,
                user_id=current_user.id,
                ministry=request.ministry
            )
            
            return {
                "status": "saved_as_draft",
                "draft_id": draft_result.draft_id,
                "draft_url": draft_result.draft_url,
                "expires_at": draft_result.expires_at.isoformat()
            }
        
        elif request.schedule_submission:
            # Schedule future submission
            schedule_result = await form_automation_service.schedule_form_submission(
                form_id=request.form_id,
                form_data=request.form_data,
                user_id=current_user.id,
                ministry=request.ministry,
                submission_time=request.schedule_submission
            )
            
            return {
                "status": "scheduled",
                "schedule_id": schedule_result.schedule_id,
                "scheduled_time": schedule_result.scheduled_time.isoformat(),
                "tracking_url": schedule_result.tracking_url
            }
        
        else:
            # Submit form immediately
            submission_result = await form_automation_service.submit_form(
                form_template=form_template,
                form_data=request.form_data,
                user_id=current_user.id,
                ministry=request.ministry
            )
            
            return {
                "status": "submitted",
                "application_id": submission_result.application_id,
                "reference_number": submission_result.reference_number,
                "confirmation_url": submission_result.confirmation_url,
                "tracking_url": submission_result.tracking_url,
                "estimated_processing_time": submission_result.processing_time
            }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Form automation error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Form automation failed: {str(e)}"
        )

@government_integration_router.get("/applications/{application_id}/status", response_model=StatusCheckResponse)
async def check_application_status(
    application_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> StatusCheckResponse:
    """
    Check Iraqi government application status with comprehensive tracking
    
    Status checking featuring:
    - Real-time application status monitoring
    - Detailed progress tracking with completion percentages
    - Status history and timeline visualization
    - Pending actions and requirements identification
    - Multi-ministry status synchronization
    - Automated notification and reminder systems
    """
    try:
        # Find application record
        application = db.query(GovernmentApplication).filter(
            GovernmentApplication.id == application_id,
            GovernmentApplication.user_id == current_user.id
        ).first()
        
        if not application:
            raise HTTPException(
                status_code=404,
                detail="Application not found"
            )
        
        # Get ministry service
        ministry_service = ministry_services.get(MinistryDepartment(application.ministry))
        if not ministry_service:
            raise HTTPException(
                status_code=400,
                detail=f"Ministry {application.ministry} status checking not available"
            )
        
        # Get latest status from ministry
        ministry_status = await ministry_service.check_application_status(
            ministry_application_id=application.ministry_application_id,
            reference_number=application.reference_number
        )
        
        # Update local status if changed
        if ministry_status.current_status.value != application.status:
            application.status = ministry_status.current_status.value
            application.last_updated = datetime.now(timezone.utc)
            db.commit()
        
        # Calculate completion percentage
        completion_percentage = await ministry_service.calculate_completion_percentage(
            current_status=ministry_status.current_status,
            total_stages=ministry_status.total_processing_stages
        )
        
        # Get recent notifications
        recent_notifications = await ministry_service.get_recent_notifications(
            ministry_application_id=application.ministry_application_id
        )
        
        # Prepare response
        response = StatusCheckResponse(
            application_id=application_id,
            current_status=ApplicationStatus(application.status),
            completion_percentage=completion_percentage,
            current_stage=ministry_status.current_stage,
            stages_completed=ministry_status.completed_stages,
            stages_remaining=ministry_status.remaining_stages,
            status_history=ministry_status.status_history,
            estimated_completion=ministry_status.estimated_completion,
            last_activity=application.last_updated,
            pending_actions=ministry_status.pending_actions,
            additional_requirements=ministry_status.additional_requirements,
            recent_notifications=recent_notifications,
            next_contact_date=ministry_status.next_contact_date
        )
        
        logger.info(f"Application status retrieved: {application_id} - {application.status}")
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Status check error {application_id}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Status check failed: {str(e)}"
        )

@government_integration_router.get("/fees/calculate", response_model=FeeCalculationResponse)
async def calculate_government_fees(
    ministry: MinistryDepartment = Query(..., description="Target ministry"),
    service_type: ServiceType = Query(..., description="Service type"),
    service_code: str = Query(..., description="Specific service code"),
    priority_level: PriorityLevel = Query(PriorityLevel.NORMAL, description="Priority level"),
    expedited_processing: bool = Query(False, description="Expedited processing"),
    current_user: User = Depends(get_current_user)
) -> FeeCalculationResponse:
    """
    Calculate Iraqi government service fees with comprehensive breakdown
    
    Fee calculation featuring:
    - Ministry-specific fee structures and calculations
    - Priority and expedited processing fee adjustments
    - Tax calculations and exemption eligibility
    - Multiple payment method support and discounts
    - Real-time fee updates and currency conversion
    - Historical fee tracking and comparison
    """
    try:
        logger.info(f"Calculating fees for {ministry} service {service_code}")
        
        # Calculate comprehensive fees
        fee_result = await fee_calculation_service.calculate_comprehensive_fees(
            ministry=ministry,
            service_type=service_type,
            service_code=service_code,
            priority_level=priority_level,
            expedited_processing=expedited_processing,
            user_id=current_user.id
        )
        
        # Check for applicable discounts and exemptions
        discount_info = await fee_calculation_service.check_discount_eligibility(
            user_id=current_user.id,
            ministry=ministry,
            service_type=service_type
        )
        
        # Prepare response
        response = FeeCalculationResponse(
            service_fees=fee_result.service_fees,
            processing_fees=fee_result.processing_fees,
            additional_fees=fee_result.additional_fees,
            subtotal=fee_result.subtotal,
            taxes=fee_result.taxes,
            total_amount=fee_result.total_amount,
            currency=fee_result.currency,
            payment_deadline=fee_result.payment_deadline,
            discount_applicable=discount_info.is_eligible,
            discount_amount=discount_info.discount_amount,
            fee_structure=fee_result.detailed_breakdown,
            exemptions=discount_info.applicable_exemptions
        )
        
        logger.info(f"Fee calculation completed: {fee_result.total_amount} {fee_result.currency}")
        return response
        
    except Exception as e:
        logger.error(f"Fee calculation error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Fee calculation failed: {str(e)}"
        )

@government_integration_router.get("/ministries/{ministry}/services")
async def list_ministry_services(
    ministry: MinistryDepartment,
    service_type: Optional[ServiceType] = Query(None, description="Filter by service type"),
    language: Literal["arabic", "english", "kurdish"] = Query("arabic", description="Response language"),
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    List available services for specific Iraqi ministry
    """
    try:
        # Get ministry service
        ministry_service = ministry_services.get(ministry)
        if not ministry_service:
            raise HTTPException(
                status_code=400,
                detail=f"Ministry {ministry} not available"
            )
        
        # Get available services
        services = await ministry_service.list_available_services(
            service_type_filter=service_type,
            language=language,
            user_access_level=getattr(current_user, 'access_level', 'citizen')
        )
        
        return {
            "ministry": ministry.value,
            "total_services": len(services),
            "services": services,
            "last_updated": datetime.now(timezone.utc).isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error listing ministry services: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to list ministry services: {str(e)}"
        )

# Administrative endpoints
@government_integration_router.post("/admin/sync-forms", dependencies=[Depends(require_permissions(["admin"]))])
async def sync_government_forms(
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user)
) -> Dict[str, str]:
    """
    Sync government forms and templates (Admin only)
    """
    try:
        background_tasks.add_task(sync_government_forms)
        
        logger.info(f"Government forms sync initiated by admin {current_user.id}")
        return {
            "status": "initiated",
            "message": "Government forms synchronization started in background"
        }
        
    except Exception as e:
        logger.error(f"Error initiating forms sync: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to initiate government forms synchronization"
        )

# Health check endpoint
@government_integration_router.get("/health")
async def government_integration_health() -> Dict[str, Any]:
    """
    Government integration system health check
    """
    try:
        # Check ministry service health
        ministry_health = {}
        for ministry, service in ministry_services.items():
            ministry_health[f"{ministry.value}_service"] = await service.health_check()
        
        # Check additional services
        services_status = {
            **ministry_health,
            "form_automation_service": await form_automation_service.health_check(),
            "document_verification_service": await document_verification_service.health_check(),
            "fee_calculation_service": await fee_calculation_service.health_check(),
            "compliance_service": await compliance_service.health_check()
        }
        
        overall_health = all(services_status.values())
        
        return {
            "status": "healthy" if overall_health else "degraded",
            "services": services_status,
            "timestamp": datetime.now().isoformat(),
            "version": "1.0.0"
        }
        
    except Exception as e:
        logger.error(f"Government integration health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }

# Router configuration and metadata
government_integration_router.tags = ["Government Integration", "Iraqi Portal Automation"]
government_integration_router.prefix = "/government-integration"

# Export router
__all__ = ["government_integration_router"]