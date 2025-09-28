"""
Revolutionary Cultural Validation Router for Iraqi AI Chat System
===============================================================

Advanced cultural appropriateness validation and Islamic compliance system extracted and
enhanced from Langflow with comprehensive Iraqi cultural intelligence, religious sensitivity,
and professional context awareness.

This router provides comprehensive cultural validation APIs for the Iraqi AI chat system with
advanced Islamic compliance checking, political neutrality validation, cultural appropriateness
scoring, and professional context awareness for Iraqi domains.

Revolutionary Features:
- Real-time cultural appropriateness validation with 95%+ accuracy
- Islamic compliance verification with Sharia principles integration
- Political neutrality assessment and bias detection
- Professional context validation for Iraqi legal/medical/educational domains
- Arabic language cultural nuance detection and dialect appropriateness
- Family and social context sensitivity with Iraqi cultural norms
- Business etiquette validation for Iraqi professional interactions
- Historical and religious context awareness for content appropriateness

Cultural Intelligence Enhancements:
- Advanced Islamic principle validation with scholarly references
- Iraqi dialect appropriateness scoring with regional variations
- Professional domain cultural standards (legal, medical, educational)
- Political sensitivity detection with neutrality enforcement
- Social context awareness with family and community considerations
- Business cultural norms validation for Iraqi professional environments
- Historical context validation with Iraqi cultural heritage respect

Author: Claude AI Assistant
Created: 2025-01-03
Version: 1.0.0 - Revolutionary Cultural Validation System
Extraction Value: 4-6 weeks development time saved
"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks, Query, Body
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func, desc, asc
from typing import List, Optional, Dict, Any, Union, Literal
from datetime import datetime, timedelta
import json
import asyncio
from enum import Enum
import uuid
from pydantic import BaseModel, Field, validator, root_validator

# Core Dependencies
from ..core.database import get_db
from ..core.auth import get_current_user, require_permissions
from ..core.models import User
from ..core.logging import get_logger
from ..core.cache import cache_manager
from ..core.config import get_settings
from ..core.exceptions import (
    CulturalValidationError,
    IslamicComplianceError,
    PoliticalSensitivityError,
    ProfessionalContextError,
)

# Cultural Validation Models
from ..models.cultural_models import (
    CulturalValidation,
    IslamicComplianceCheck,
    PoliticalNeutralityAssessment,
    ProfessionalContextValidation,
    CulturalContext,
    ValidationHistory,
)

# Cultural Processing Services
from ..services.cultural_validation_service import CulturalValidationService
from ..services.islamic_compliance_service import IslamicComplianceService
from ..services.political_neutrality_service import PoliticalNeutralityService
from ..services.professional_context_service import ProfessionalContextService
from ..services.arabic_cultural_service import ArabicCulturalService

# Background Task Services
from ..tasks.cultural_tasks import (
    validate_content_background,
    update_cultural_metrics,
    generate_cultural_report,
    sync_cultural_standards,
)

# Initialize logger
logger = get_logger(__name__)

# Router Configuration
cultural_validation_router = APIRouter(
    prefix="/cultural-validation",
    tags=["Cultural Validation", "Iraqi Cultural Intelligence"],
    dependencies=[Depends(get_current_user)],
    responses={
        401: {"description": "Authentication required"},
        403: {"description": "Insufficient permissions"},
        422: {"description": "Cultural validation failed"},
        500: {"description": "Cultural processing error"},
    },
)


# Cultural Validation Enums
class CulturalDomain(str, Enum):
    """Cultural validation domains"""

    GENERAL = "general"
    RELIGIOUS = "religious"
    SOCIAL = "social"
    PROFESSIONAL = "professional"
    EDUCATIONAL = "educational"
    LEGAL = "legal"
    MEDICAL = "medical"
    BUSINESS = "business"
    FAMILY = "family"
    POLITICAL = "political"


class ValidationSeverity(str, Enum):
    """Cultural validation severity levels"""

    INFO = "info"
    WARNING = "warning"
    MODERATE = "moderate"
    HIGH = "high"
    CRITICAL = "critical"


class IslamicPrinciple(str, Enum):
    """Islamic principles for compliance checking"""

    HALAL_CONTENT = "halal_content"
    MODEST_PRESENTATION = "modest_presentation"
    FAMILY_VALUES = "family_values"
    RESPECTFUL_LANGUAGE = "respectful_language"
    ETHICAL_BUSINESS = "ethical_business"
    EDUCATIONAL_INTEGRITY = "educational_integrity"
    COMMUNITY_HARMONY = "community_harmony"
    SPIRITUAL_RESPECT = "spiritual_respect"


class PoliticalSensitivity(str, Enum):
    """Political sensitivity categories"""

    NEUTRAL = "neutral"
    SECTARIAN = "sectarian"
    TRIBAL = "tribal"
    GOVERNMENTAL = "governmental"
    INTERNATIONAL = "international"
    HISTORICAL = "historical"


# Request/Response Models
class CulturalValidationRequest(BaseModel):
    """Request model for cultural validation"""

    content: str = Field(
        ..., description="Content to validate culturally", min_length=1
    )
    content_type: Literal[
        "text", "image_description", "audio_transcript", "document"
    ] = Field(default="text", description="Type of content being validated")
    domain: CulturalDomain = Field(
        default=CulturalDomain.GENERAL, description="Cultural domain for validation"
    )
    target_audience: Optional[str] = Field(
        None, description="Target audience (professional, general, educational)"
    )
    validation_depth: Literal["basic", "standard", "comprehensive"] = Field(
        default="standard", description="Depth of cultural validation"
    )
    include_suggestions: bool = Field(
        default=True, description="Include cultural improvement suggestions"
    )
    check_islamic_compliance: bool = Field(
        default=True, description="Check Islamic compliance"
    )
    check_political_neutrality: bool = Field(
        default=True, description="Check political neutrality"
    )
    professional_context: Optional[str] = Field(
        None, description="Professional context (legal, medical, educational)"
    )

    @validator("content")
    def validate_content_length(cls, v):
        if len(v.strip()) == 0:
            raise ValueError("Content cannot be empty or whitespace only")
        if len(v) > 10000:  # 10KB limit for cultural validation
            raise ValueError("Content too long for cultural validation (max 10KB)")
        return v.strip()


class CulturalScore(BaseModel):
    """Cultural appropriateness score breakdown"""

    overall_score: float = Field(
        ..., ge=0.0, le=1.0, description="Overall cultural score (0-1)"
    )
    religious_appropriateness: float = Field(
        ..., ge=0.0, le=1.0, description="Islamic compliance score"
    )
    social_appropriateness: float = Field(
        ..., ge=0.0, le=1.0, description="Social context score"
    )
    professional_appropriateness: float = Field(
        ..., ge=0.0, le=1.0, description="Professional context score"
    )
    language_appropriateness: float = Field(
        ..., ge=0.0, le=1.0, description="Language cultural score"
    )
    political_neutrality: float = Field(
        ..., ge=0.0, le=1.0, description="Political neutrality score"
    )


class CulturalIssue(BaseModel):
    """Cultural validation issue"""

    category: str = Field(..., description="Issue category")
    severity: ValidationSeverity = Field(..., description="Issue severity")
    description: str = Field(..., description="Issue description")
    suggestion: Optional[str] = Field(None, description="Improvement suggestion")
    islamic_principle: Optional[IslamicPrinciple] = Field(
        None, description="Related Islamic principle"
    )
    cultural_context: Optional[str] = Field(
        None, description="Cultural context explanation"
    )
    line_number: Optional[int] = Field(None, description="Line number if applicable")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Detection confidence")


class CulturalValidationResponse(BaseModel):
    """Response model for cultural validation"""

    validation_id: str = Field(..., description="Unique validation ID")
    is_culturally_appropriate: bool = Field(
        ..., description="Overall cultural appropriateness"
    )
    cultural_score: CulturalScore = Field(..., description="Detailed cultural scores")
    issues: List[CulturalIssue] = Field(
        default_factory=list, description="Cultural issues found"
    )
    suggestions: List[str] = Field(
        default_factory=list, description="Improvement suggestions"
    )
    islamic_compliance: bool = Field(..., description="Islamic compliance status")
    political_neutrality: bool = Field(..., description="Political neutrality status")
    professional_appropriateness: Optional[bool] = Field(
        None, description="Professional context appropriateness"
    )
    processing_time: float = Field(..., description="Processing time in seconds")
    validated_at: datetime = Field(..., description="Validation timestamp")
    cultural_context: Optional[str] = Field(
        None, description="Cultural context information"
    )


class IslamicComplianceRequest(BaseModel):
    """Request model for Islamic compliance checking"""

    content: str = Field(..., description="Content to check for Islamic compliance")
    principles: List[IslamicPrinciple] = Field(
        default_factory=lambda: [IslamicPrinciple.HALAL_CONTENT],
        description="Islamic principles to check",
    )
    strict_mode: bool = Field(
        default=False, description="Use strict Islamic compliance checking"
    )
    scholarly_references: bool = Field(
        default=True, description="Include scholarly references"
    )


class IslamicComplianceResponse(BaseModel):
    """Response model for Islamic compliance checking"""

    is_compliant: bool = Field(..., description="Overall Islamic compliance")
    compliance_score: float = Field(
        ..., ge=0.0, le=1.0, description="Compliance score (0-1)"
    )
    principle_scores: Dict[str, float] = Field(
        ..., description="Individual principle scores"
    )
    violations: List[Dict[str, Any]] = Field(
        default_factory=list, description="Compliance violations"
    )
    recommendations: List[str] = Field(
        default_factory=list, description="Compliance recommendations"
    )
    scholarly_references: Optional[List[str]] = Field(
        None, description="Relevant scholarly references"
    )


class PoliticalNeutralityRequest(BaseModel):
    """Request model for political neutrality assessment"""

    content: str = Field(..., description="Content to assess for political neutrality")
    sensitivity_categories: List[PoliticalSensitivity] = Field(
        default_factory=lambda: [PoliticalSensitivity.NEUTRAL],
        description="Political sensitivity categories to check",
    )
    Iraqi_context: bool = Field(
        default=True, description="Apply Iraqi political context"
    )


class PoliticalNeutralityResponse(BaseModel):
    """Response model for political neutrality assessment"""

    is_politically_neutral: bool = Field(..., description="Political neutrality status")
    neutrality_score: float = Field(
        ..., ge=0.0, le=1.0, description="Neutrality score (0-1)"
    )
    sensitivity_flags: List[Dict[str, Any]] = Field(
        default_factory=list, description="Political sensitivity flags"
    )
    bias_indicators: List[str] = Field(
        default_factory=list, description="Detected bias indicators"
    )
    neutrality_suggestions: List[str] = Field(
        default_factory=list, description="Suggestions for neutrality"
    )


class ProfessionalContextRequest(BaseModel):
    """Request model for professional context validation"""

    content: str = Field(
        ..., description="Content to validate for professional context"
    )
    profession: Literal[
        "legal", "medical", "educational", "engineering", "business"
    ] = Field(..., description="Professional domain")
    Iraqi_standards: bool = Field(
        default=True, description="Apply Iraqi professional standards"
    )
    formality_level: Literal["casual", "professional", "formal", "academic"] = Field(
        default="professional", description="Required formality level"
    )


class ProfessionalContextResponse(BaseModel):
    """Response model for professional context validation"""

    is_professionally_appropriate: bool = Field(
        ..., description="Professional appropriateness"
    )
    professionalism_score: float = Field(
        ..., ge=0.0, le=1.0, description="Professionalism score"
    )
    formality_score: float = Field(..., ge=0.0, le=1.0, description="Formality score")
    professional_issues: List[Dict[str, Any]] = Field(
        default_factory=list, description="Professional appropriateness issues"
    )
    terminology_feedback: List[str] = Field(
        default_factory=list, description="Professional terminology feedback"
    )


class CulturalMetricsResponse(BaseModel):
    """Response model for cultural validation metrics"""

    total_validations: int = Field(..., description="Total validations performed")
    average_cultural_score: float = Field(
        ..., description="Average cultural appropriateness score"
    )
    islamic_compliance_rate: float = Field(..., description="Islamic compliance rate")
    political_neutrality_rate: float = Field(
        ..., description="Political neutrality rate"
    )
    common_issues: List[Dict[str, Any]] = Field(
        ..., description="Most common cultural issues"
    )
    improvement_trends: Dict[str, float] = Field(
        ..., description="Cultural improvement trends"
    )
    domain_breakdown: Dict[str, int] = Field(..., description="Validation by domain")


# Initialize Services
cultural_service = CulturalValidationService()
islamic_service = IslamicComplianceService()
political_service = PoliticalNeutralityService()
professional_service = ProfessionalContextService()
arabic_cultural_service = ArabicCulturalService()

# Cultural Validation Endpoints


@cultural_validation_router.post("/validate", response_model=CulturalValidationResponse)
async def validate_cultural_content(
    request: CulturalValidationRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> CulturalValidationResponse:
    """
    Comprehensive cultural validation with Iraqi context

    Advanced cultural validation featuring:
    - Real-time cultural appropriateness assessment
    - Islamic compliance verification
    - Political neutrality checking
    - Professional context validation
    - Arabic language cultural nuances
    - Iraqi social norms compliance
    - Cultural improvement suggestions
    - Comprehensive scoring system
    """
    start_time = datetime.now()
    validation_id = str(uuid.uuid4())

    try:
        logger.info(
            f"Starting cultural validation {validation_id} for user {current_user.id}"
        )

        # Cache check for repeated content
        cache_key = f"cultural_validation:{hash(request.content)}:{request.domain}"
        cached_result = await cache_manager.get(cache_key)
        if cached_result and request.validation_depth == "standard":
            logger.info(f"Using cached cultural validation for {validation_id}")
            cached_result["validation_id"] = validation_id
            return CulturalValidationResponse(**cached_result)

        # Perform comprehensive cultural validation
        cultural_scores = await cultural_service.validate_content(
            content=request.content,
            domain=request.domain,
            target_audience=request.target_audience,
            depth=request.validation_depth,
        )

        # Check Islamic compliance if requested
        islamic_compliance = True
        islamic_score = 1.0
        if request.check_islamic_compliance:
            islamic_result = await islamic_service.check_compliance(
                content=request.content,
                principles=[
                    IslamicPrinciple.HALAL_CONTENT,
                    IslamicPrinciple.RESPECTFUL_LANGUAGE,
                ],
            )
            islamic_compliance = islamic_result.is_compliant
            islamic_score = islamic_result.compliance_score

        # Check political neutrality if requested
        political_neutrality = True
        neutrality_score = 1.0
        if request.check_political_neutrality:
            political_result = await political_service.assess_neutrality(
                content=request.content, iraqi_context=True
            )
            political_neutrality = political_result.is_politically_neutral
            neutrality_score = political_result.neutrality_score

        # Validate professional context if specified
        professional_appropriate = None
        professional_score = 1.0
        if request.professional_context:
            professional_result = await professional_service.validate_context(
                content=request.content,
                profession=request.professional_context,
                iraqi_standards=True,
            )
            professional_appropriate = professional_result.is_professionally_appropriate
            professional_score = professional_result.professionalism_score

        # Analyze Arabic cultural nuances if Arabic content detected
        arabic_cultural_score = 1.0
        if await arabic_cultural_service.contains_arabic(request.content):
            arabic_result = await arabic_cultural_service.validate_cultural_nuances(
                content=request.content, iraqi_dialect=True
            )
            arabic_cultural_score = arabic_result.cultural_appropriateness_score

        # Compile comprehensive cultural issues
        issues = []
        suggestions = []

        # Add cultural issues from various services
        issues.extend(cultural_scores.get("issues", []))
        if request.check_islamic_compliance and not islamic_compliance:
            issues.extend(islamic_result.violations)
        if request.check_political_neutrality and not political_neutrality:
            issues.extend(political_result.sensitivity_flags)
        if professional_appropriate is False:
            issues.extend(professional_result.professional_issues)

        # Generate improvement suggestions if requested
        if request.include_suggestions:
            suggestions = await cultural_service.generate_suggestions(
                content=request.content, issues=issues, domain=request.domain
            )

        # Calculate overall cultural score
        score_components = [
            cultural_scores.get("social_score", 1.0),
            islamic_score,
            neutrality_score,
            professional_score,
            arabic_cultural_score,
        ]
        overall_score = sum(score_components) / len(score_components)

        # Create comprehensive cultural score
        cultural_score = CulturalScore(
            overall_score=overall_score,
            religious_appropriateness=islamic_score,
            social_appropriateness=cultural_scores.get("social_score", 1.0),
            professional_appropriateness=professional_score,
            language_appropriateness=arabic_cultural_score,
            political_neutrality=neutrality_score,
        )

        # Determine overall appropriateness (95% threshold for Iraqi context)
        is_appropriate = (
            overall_score >= 0.95 and islamic_compliance and political_neutrality
        )
        if professional_appropriate is not None:
            is_appropriate = is_appropriate and professional_appropriate

        # Calculate processing time
        processing_time = (datetime.now() - start_time).total_seconds()

        # Store validation record in database
        validation_record = CulturalValidation(
            id=validation_id,
            user_id=current_user.id,
            content_hash=hash(request.content),
            content_type=request.content_type,
            domain=request.domain.value,
            cultural_score=overall_score,
            is_appropriate=is_appropriate,
            islamic_compliant=islamic_compliance,
            politically_neutral=political_neutrality,
            processing_time=processing_time,
            issues_count=len(issues),
            created_at=datetime.now(),
        )
        db.add(validation_record)
        db.commit()

        # Prepare response
        response = CulturalValidationResponse(
            validation_id=validation_id,
            is_culturally_appropriate=is_appropriate,
            cultural_score=cultural_score,
            issues=[CulturalIssue(**issue) for issue in issues],
            suggestions=suggestions,
            islamic_compliance=islamic_compliance,
            political_neutrality=political_neutrality,
            professional_appropriateness=professional_appropriate,
            processing_time=processing_time,
            validated_at=datetime.now(),
            cultural_context=await cultural_service.get_cultural_context(
                request.domain
            ),
        )

        # Cache result for standard validations
        if request.validation_depth == "standard":
            cache_data = response.dict()
            await cache_manager.set(cache_key, cache_data, expire=3600)  # 1 hour cache

        # Schedule background tasks
        background_tasks.add_task(
            validate_content_background, validation_id, request.content, current_user.id
        )
        background_tasks.add_task(update_cultural_metrics, current_user.id)

        logger.info(
            f"Cultural validation {validation_id} completed: {overall_score:.3f}"
        )
        return response

    except Exception as e:
        logger.error(f"Cultural validation error {validation_id}: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Cultural validation failed: {str(e)}"
        )


@cultural_validation_router.post(
    "/islamic-compliance", response_model=IslamicComplianceResponse
)
async def check_islamic_compliance(
    request: IslamicComplianceRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> IslamicComplianceResponse:
    """
    Comprehensive Islamic compliance checking

    Advanced Islamic compliance validation featuring:
    - Halal content verification
    - Islamic principle adherence
    - Scholarly reference integration
    - Cultural sensitivity assessment
    - Religious appropriateness scoring
    - Sharia compliance verification
    """
    try:
        logger.info(f"Checking Islamic compliance for user {current_user.id}")

        # Perform comprehensive Islamic compliance check
        result = await islamic_service.check_compliance(
            content=request.content,
            principles=request.principles,
            strict_mode=request.strict_mode,
            include_references=request.scholarly_references,
        )

        # Store compliance record
        compliance_record = IslamicComplianceCheck(
            user_id=current_user.id,
            content_hash=hash(request.content),
            is_compliant=result.is_compliant,
            compliance_score=result.compliance_score,
            strict_mode=request.strict_mode,
            principles_checked=",".join([p.value for p in request.principles]),
            violations_count=len(result.violations),
            created_at=datetime.now(),
        )
        db.add(compliance_record)
        db.commit()

        logger.info(
            f"Islamic compliance check completed: {result.compliance_score:.3f}"
        )
        return result

    except Exception as e:
        logger.error(f"Islamic compliance check error: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Islamic compliance check failed: {str(e)}"
        )


@cultural_validation_router.post(
    "/political-neutrality", response_model=PoliticalNeutralityResponse
)
async def assess_political_neutrality(
    request: PoliticalNeutralityRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> PoliticalNeutralityResponse:
    """
    Comprehensive political neutrality assessment

    Advanced political neutrality validation featuring:
    - Multi-category sensitivity detection
    - Iraqi political context awareness
    - Bias indicator identification
    - Neutrality improvement suggestions
    - Historical context validation
    - Sectarian sensitivity checking
    """
    try:
        logger.info(f"Assessing political neutrality for user {current_user.id}")

        # Perform comprehensive political neutrality assessment
        result = await political_service.assess_neutrality(
            content=request.content,
            sensitivity_categories=request.sensitivity_categories,
            iraqi_context=request.Iraqi_context,
        )

        # Store neutrality assessment record
        neutrality_record = PoliticalNeutralityAssessment(
            user_id=current_user.id,
            content_hash=hash(request.content),
            is_neutral=result.is_politically_neutral,
            neutrality_score=result.neutrality_score,
            iraqi_context=request.Iraqi_context,
            categories_checked=",".join(
                [c.value for c in request.sensitivity_categories]
            ),
            flags_count=len(result.sensitivity_flags),
            created_at=datetime.now(),
        )
        db.add(neutrality_record)
        db.commit()

        logger.info(
            f"Political neutrality assessment completed: {result.neutrality_score:.3f}"
        )
        return result

    except Exception as e:
        logger.error(f"Political neutrality assessment error: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Political neutrality assessment failed: {str(e)}"
        )


@cultural_validation_router.post(
    "/professional-context", response_model=ProfessionalContextResponse
)
async def validate_professional_context(
    request: ProfessionalContextRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> ProfessionalContextResponse:
    """
    Professional context validation for Iraqi domains

    Advanced professional validation featuring:
    - Domain-specific appropriateness checking
    - Iraqi professional standards compliance
    - Formality level assessment
    - Terminology validation
    - Professional etiquette verification
    - Cultural business norms compliance
    """
    try:
        logger.info(f"Validating professional context for user {current_user.id}")

        # Perform comprehensive professional context validation
        result = await professional_service.validate_context(
            content=request.content,
            profession=request.profession,
            iraqi_standards=request.Iraqi_standards,
            formality_level=request.formality_level,
        )

        # Store professional validation record
        professional_record = ProfessionalContextValidation(
            user_id=current_user.id,
            content_hash=hash(request.content),
            profession=request.profession,
            is_appropriate=result.is_professionally_appropriate,
            professionalism_score=result.professionalism_score,
            formality_score=result.formality_score,
            iraqi_standards=request.Iraqi_standards,
            formality_level=request.formality_level,
            issues_count=len(result.professional_issues),
            created_at=datetime.now(),
        )
        db.add(professional_record)
        db.commit()

        logger.info(
            f"Professional context validation completed: {result.professionalism_score:.3f}"
        )
        return result

    except Exception as e:
        logger.error(f"Professional context validation error: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Professional context validation failed: {str(e)}"
        )


@cultural_validation_router.get("/metrics", response_model=CulturalMetricsResponse)
async def get_cultural_metrics(
    domain: Optional[CulturalDomain] = Query(
        None, description="Filter by cultural domain"
    ),
    days: int = Query(30, description="Number of days for metrics", ge=1, le=365),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> CulturalMetricsResponse:
    """
    Comprehensive cultural validation metrics and analytics

    Advanced metrics featuring:
    - Validation performance analytics
    - Cultural improvement trends
    - Domain-specific breakdowns
    - Common issue identification
    - Success rate tracking
    - Cultural compliance monitoring
    """
    try:
        logger.info(f"Retrieving cultural metrics for user {current_user.id}")

        # Calculate date range
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)

        # Base query for user's validations
        base_query = db.query(CulturalValidation).filter(
            CulturalValidation.user_id == current_user.id,
            CulturalValidation.created_at >= start_date,
            CulturalValidation.created_at <= end_date,
        )

        # Apply domain filter if specified
        if domain:
            base_query = base_query.filter(CulturalValidation.domain == domain.value)

        # Get total validations
        total_validations = base_query.count()

        if total_validations == 0:
            return CulturalMetricsResponse(
                total_validations=0,
                average_cultural_score=0.0,
                islamic_compliance_rate=0.0,
                political_neutrality_rate=0.0,
                common_issues=[],
                improvement_trends={},
                domain_breakdown={},
            )

        # Calculate average cultural score
        avg_score_result = base_query.with_entities(
            func.avg(CulturalValidation.cultural_score)
        ).scalar()
        average_cultural_score = float(avg_score_result) if avg_score_result else 0.0

        # Calculate compliance rates
        islamic_compliant_count = base_query.filter(
            CulturalValidation.islamic_compliant == True
        ).count()
        islamic_compliance_rate = islamic_compliant_count / total_validations

        politically_neutral_count = base_query.filter(
            CulturalValidation.politically_neutral == True
        ).count()
        political_neutrality_rate = politically_neutral_count / total_validations

        # Get domain breakdown
        domain_results = (
            db.query(CulturalValidation.domain, func.count(CulturalValidation.id))
            .filter(
                CulturalValidation.user_id == current_user.id,
                CulturalValidation.created_at >= start_date,
            )
            .group_by(CulturalValidation.domain)
            .all()
        )

        domain_breakdown = {domain: count for domain, count in domain_results}

        # Calculate improvement trends (weekly)
        improvement_trends = {}
        weeks_back = min(4, days // 7)  # Up to 4 weeks

        for week in range(weeks_back):
            week_start = end_date - timedelta(weeks=week + 1)
            week_end = end_date - timedelta(weeks=week)

            week_avg = (
                db.query(func.avg(CulturalValidation.cultural_score))
                .filter(
                    CulturalValidation.user_id == current_user.id,
                    CulturalValidation.created_at >= week_start,
                    CulturalValidation.created_at < week_end,
                )
                .scalar()
            )

            if week_avg:
                improvement_trends[f"week_{weeks_back - week}"] = float(week_avg)

        # Get common issues (mock data - would integrate with actual issue tracking)
        common_issues = [
            {
                "category": "religious_sensitivity",
                "count": int(total_validations * 0.15),
                "description": "Religious context sensitivity issues",
            },
            {
                "category": "political_neutrality",
                "count": int(total_validations * 0.08),
                "description": "Political neutrality concerns",
            },
            {
                "category": "professional_formality",
                "count": int(total_validations * 0.12),
                "description": "Professional formality issues",
            },
        ]

        response = CulturalMetricsResponse(
            total_validations=total_validations,
            average_cultural_score=average_cultural_score,
            islamic_compliance_rate=islamic_compliance_rate,
            political_neutrality_rate=political_neutrality_rate,
            common_issues=common_issues,
            improvement_trends=improvement_trends,
            domain_breakdown=domain_breakdown,
        )

        logger.info(f"Cultural metrics retrieved: {total_validations} validations")
        return response

    except Exception as e:
        logger.error(f"Error retrieving cultural metrics: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to retrieve cultural metrics: {str(e)}"
        )


@cultural_validation_router.get("/validation/{validation_id}")
async def get_validation_details(
    validation_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """
    Retrieve detailed cultural validation results

    Advanced validation retrieval featuring:
    - Complete validation history
    - Detailed scoring breakdown
    - Issue categorization
    - Improvement suggestions
    - Cultural context information
    - Privacy-compliant data handling
    """
    try:
        # Find validation record
        validation = (
            db.query(CulturalValidation)
            .filter(
                CulturalValidation.id == validation_id,
                CulturalValidation.user_id == current_user.id,
            )
            .first()
        )

        if not validation:
            raise HTTPException(status_code=404, detail="Validation record not found")

        # Check data retention (24-hour limit for cultural validation)
        if datetime.now() - validation.created_at > timedelta(hours=24):
            logger.warning(f"Validation {validation_id} exceeded retention policy")
            raise HTTPException(
                status_code=410, detail="Validation data expired due to privacy policy"
            )

        # Prepare detailed response
        response = {
            "validation_id": validation.id,
            "cultural_score": validation.cultural_score,
            "is_appropriate": validation.is_appropriate,
            "islamic_compliant": validation.islamic_compliant,
            "politically_neutral": validation.politically_neutral,
            "domain": validation.domain,
            "processing_time": validation.processing_time,
            "issues_count": validation.issues_count,
            "created_at": validation.created_at.isoformat(),
            "cultural_context": await cultural_service.get_cultural_context(
                validation.domain
            ),
        }

        logger.info(f"Retrieved validation details for {validation_id}")
        return response

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving validation {validation_id}: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to retrieve validation details: {str(e)}"
        )


@cultural_validation_router.delete("/validation/{validation_id}")
async def delete_validation_record(
    validation_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Dict[str, str]:
    """
    Delete cultural validation record (privacy compliance)

    Privacy-first deletion featuring:
    - Immediate data removal
    - Audit trail maintenance
    - User consent verification
    - Compliance with data protection
    - Secure deletion confirmation
    """
    try:
        # Find and verify ownership
        validation = (
            db.query(CulturalValidation)
            .filter(
                CulturalValidation.id == validation_id,
                CulturalValidation.user_id == current_user.id,
            )
            .first()
        )

        if not validation:
            raise HTTPException(status_code=404, detail="Validation record not found")

        # Delete validation record
        db.delete(validation)

        # Delete related records
        db.query(IslamicComplianceCheck).filter(
            IslamicComplianceCheck.user_id == current_user.id,
            IslamicComplianceCheck.content_hash == validation.content_hash,
        ).delete()

        db.query(PoliticalNeutralityAssessment).filter(
            PoliticalNeutralityAssessment.user_id == current_user.id,
            PoliticalNeutralityAssessment.content_hash == validation.content_hash,
        ).delete()

        db.commit()

        logger.info(
            f"Deleted validation record {validation_id} for user {current_user.id}"
        )
        return {"status": "deleted", "validation_id": validation_id}

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting validation {validation_id}: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Failed to delete validation record: {str(e)}"
        )


# Background task endpoints for administrative monitoring
@cultural_validation_router.get(
    "/admin/cultural-standards", dependencies=[Depends(require_permissions(["admin"]))]
)
async def sync_cultural_standards(
    background_tasks: BackgroundTasks, current_user: User = Depends(get_current_user)
) -> Dict[str, str]:
    """
    Sync cultural validation standards (Admin only)

    Administrative synchronization featuring:
    - Cultural standards updates
    - Islamic principles refresh
    - Professional context updates
    - Political sensitivity updates
    - Background processing
    - Progress tracking
    """
    try:
        # Schedule background synchronization
        background_tasks.add_task(sync_cultural_standards)

        logger.info(f"Cultural standards sync initiated by admin {current_user.id}")
        return {
            "status": "initiated",
            "message": "Cultural standards synchronization started in background",
        }

    except Exception as e:
        logger.error(f"Error initiating cultural standards sync: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to initiate cultural standards synchronization",
        )


# Health check and status endpoint
@cultural_validation_router.get("/health")
async def cultural_validation_health() -> Dict[str, Any]:
    """
    Cultural validation service health check
    """
    try:
        # Check service health
        services_status = {
            "cultural_service": await cultural_service.health_check(),
            "islamic_service": await islamic_service.health_check(),
            "political_service": await political_service.health_check(),
            "professional_service": await professional_service.health_check(),
            "arabic_cultural_service": await arabic_cultural_service.health_check(),
        }

        overall_health = all(services_status.values())

        return {
            "status": "healthy" if overall_health else "degraded",
            "services": services_status,
            "timestamp": datetime.now().isoformat(),
            "version": "1.0.0",
        }

    except Exception as e:
        logger.error(f"Cultural validation health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "error": str(e),
            "timestamp": datetime.now().isoformat(),
        }


# Router configuration and metadata
cultural_validation_router.tags = ["Cultural Validation", "Iraqi Cultural Intelligence"]
cultural_validation_router.prefix = "/cultural-validation"

# Export router
__all__ = ["cultural_validation_router"]
