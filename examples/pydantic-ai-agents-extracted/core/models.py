"""
Iraqi AI Chat System - Pydantic Models
Comprehensive data models for Iraqi AI agents with cultural intelligence
"""
from typing import Optional, Dict, Any, List, Union, Literal
from datetime import datetime, timezone
from enum import Enum
from decimal import Decimal

try:
    from pydantic import BaseModel, Field, validator, root_validator
    from pydantic.types import UUID4
except ImportError as e:
    # Graceful handling for development environment
    BaseModel = object
    Field = lambda **kwargs: kwargs.get('default')
    validator = lambda *args, **kwargs: lambda func: func
    root_validator = lambda *args, **kwargs: lambda func: func
    UUID4 = str
    print(f"Pydantic not available: {e}")

import uuid


class IraqiCulturalMode(str, Enum):
    """Cultural validation modes"""
    STRICT = "strict"
    MODERATE = "moderate"
    ADAPTIVE = "adaptive"


class IslamicComplianceLevel(str, Enum):
    """Islamic compliance levels"""
    FULL = "full"
    STANDARD = "standard"
    BASIC = "basic"


class ArabicProcessingMode(str, Enum):
    """Arabic processing modes"""
    IRAQI_DIALECT = "iraqi_dialect"
    STANDARD_ARABIC = "standard_arabic"
    MIXED = "mixed"


class PaymentGateway(str, Enum):
    """Supported Iraqi payment gateways"""
    ZAINCASH = "zaincash"
    FASTPAY = "fastpay"
    NASSWALLET = "nasswallet"


class ProfessionalDomain(str, Enum):
    """Iraqi professional domains"""
    LEGAL = "legal"
    MEDICAL = "medical"
    EDUCATIONAL = "educational"
    ORGANIZATIONAL = "organizational"
    BUSINESS = "business"
    TECHNICAL = "technical"
    CULTURAL = "cultural"


class ResponseStatus(str, Enum):
    """Response status types"""
    SUCCESS = "success"
    PARTIAL_SUCCESS = "partial_success"
    VALIDATION_FAILED = "validation_failed"
    ERROR = "error"


if BaseModel != object:
    
    # Base Models
    
    class IraqiBaseModel(BaseModel):
        """Base model with Iraqi-specific configurations"""
        
        class Config:
            # Pydantic configuration
            validate_assignment = True
            use_enum_values = True
            allow_population_by_field_name = True
            json_encoders = {
                datetime: lambda v: v.isoformat(),
                Decimal: lambda v: float(v)
            }
        
        def dict_arabic_safe(self, **kwargs) -> Dict[str, Any]:
            """Convert to dict with Arabic text handling"""
            data = self.dict(**kwargs)
            return self._process_arabic_text(data)
        
        def _process_arabic_text(self, data: Any) -> Any:
            """Recursively process Arabic text in data structures"""
            if isinstance(data, dict):
                return {k: self._process_arabic_text(v) for k, v in data.items()}
            elif isinstance(data, list):
                return [self._process_arabic_text(item) for item in data]
            elif isinstance(data, str):
                # Ensure proper Unicode handling for Arabic text
                return data.encode('utf-8').decode('utf-8')
            else:
                return data
    
    
    # Cultural Context Models
    
    class IraqiCulturalContext(IraqiBaseModel):
        """Cultural context for Iraqi AI interactions"""
        
        user_cultural_background: str = Field(
            default="iraqi",
            description="User's cultural background"
        )
        primary_language: str = Field(
            default="arabic", 
            description="Primary language preference"
        )
        dialect: str = Field(
            default="iraqi_arabic",
            description="Arabic dialect preference"
        )
        islamic_compliance_required: bool = Field(
            default=True,
            description="Require Islamic compliance validation"
        )
        professional_domain: Optional[ProfessionalDomain] = Field(
            None,
            description="Professional domain context"
        )
        cultural_sensitivity_level: Literal["low", "medium", "high"] = Field(
            default="high",
            description="Cultural sensitivity requirement level"
        )
        prayer_time_awareness: bool = Field(
            default=True,
            description="Consider Islamic prayer times"
        )
        regional_context: str = Field(
            default="baghdad",
            description="Iraqi regional context"
        )
        
        @validator('primary_language')
        def validate_language(cls, v):
            supported_languages = ['arabic', 'english', 'mixed']
            if v not in supported_languages:
                raise ValueError(f'Language must be one of: {supported_languages}')
            return v
        
        @validator('regional_context')
        def validate_region(cls, v):
            iraqi_regions = ['baghdad', 'basra', 'erbil', 'najaf', 'karbala', 'mosul', 'kirkuk']
            if v.lower() not in iraqi_regions:
                return 'baghdad'  # Default fallback
            return v.lower()
    
    
    class CulturalValidationResult(IraqiBaseModel):
        """Results from cultural validation"""
        
        cultural_appropriateness: float = Field(
            ge=0.0, le=1.0,
            description="Cultural appropriateness score (0.0-1.0)"
        )
        islamic_compliance: float = Field(
            ge=0.0, le=1.0,
            description="Islamic compliance score (0.0-1.0)"
        )
        arabic_accuracy: float = Field(
            ge=0.0, le=1.0,
            description="Arabic text processing accuracy (0.0-1.0)"
        )
        dialect_recognition: float = Field(
            ge=0.0, le=1.0,
            description="Iraqi dialect recognition accuracy (0.0-1.0)"
        )
        professional_relevance: float = Field(
            ge=0.0, le=1.0,
            description="Professional domain relevance (0.0-1.0)"
        )
        
        validation_passed: bool = Field(
            description="Overall validation success"
        )
        confidence: float = Field(
            ge=0.0, le=1.0,
            description="Confidence in validation results"
        )
        
        issues: List[str] = Field(
            default_factory=list,
            description="List of validation issues found"
        )
        recommendations: List[str] = Field(
            default_factory=list,
            description="Recommendations for improvement"
        )
        processing_time: float = Field(
            ge=0.0,
            description="Validation processing time in seconds"
        )
        
        @root_validator
        def validate_overall_pass(cls, values):
            """Determine if validation passed based on scores"""
            cultural_score = values.get('cultural_appropriateness', 0.0)
            islamic_score = values.get('islamic_compliance', 0.0)
            arabic_score = values.get('arabic_accuracy', 0.0)
            
            # Default thresholds (can be customized)
            cultural_threshold = 0.95
            islamic_threshold = 1.0
            arabic_threshold = 0.99
            
            passed = (cultural_score >= cultural_threshold and
                     islamic_score >= islamic_threshold and
                     (arabic_score >= arabic_threshold if arabic_score > 0 else True))
            
            values['validation_passed'] = passed
            
            # Calculate confidence based on scores
            scores = [cultural_score, islamic_score]
            if arabic_score > 0:
                scores.append(arabic_score)
            
            values['confidence'] = sum(scores) / len(scores)
            
            return values
    
    
    # Input/Output Models
    
    class IraqiAgentInput(IraqiBaseModel):
        """Input model for Iraqi AI Agent requests"""
        
        message: str = Field(
            ...,
            min_length=1,
            max_length=10000,
            description="User message in Arabic, English, or mixed"
        )
        context: Optional[Dict[str, Any]] = Field(
            default_factory=dict,
            description="Additional context information"
        )
        cultural_context: Optional[IraqiCulturalContext] = Field(
            None,
            description="Iraqi cultural context"
        )
        require_validation: bool = Field(
            default=True,
            description="Require cultural and Islamic validation"
        )
        user_id: Optional[str] = Field(
            None,
            description="User identifier for personalization"
        )
        session_id: Optional[str] = Field(
            None,
            description="Session identifier"
        )
        request_id: UUID4 = Field(
            default_factory=uuid.uuid4,
            description="Unique request identifier"
        )
        timestamp: datetime = Field(
            default_factory=lambda: datetime.now(timezone.utc),
            description="Request timestamp"
        )
        
        @validator('message')
        def validate_message_content(cls, v):
            """Validate message content"""
            if not v or not v.strip():
                raise ValueError('Message cannot be empty')
            
            # Check for potentially harmful content (basic check)
            harmful_patterns = ['<script', '<?php', 'javascript:', 'data:']
            v_lower = v.lower()
            if any(pattern in v_lower for pattern in harmful_patterns):
                raise ValueError('Message contains potentially harmful content')
            
            return v.strip()
    
    
    class IraqiAgentOutput(IraqiBaseModel):
        """Output model for Iraqi AI Agent responses"""
        
        response: str = Field(
            ...,
            description="Agent response message"
        )
        status: ResponseStatus = Field(
            default=ResponseStatus.SUCCESS,
            description="Response status"
        )
        cultural_validation: CulturalValidationResult = Field(
            ...,
            description="Cultural validation results"
        )
        confidence: float = Field(
            ge=0.0, le=1.0,
            description="Overall response confidence"
        )
        processing_time: float = Field(
            ge=0.0,
            description="Total processing time in seconds"
        )
        model_used: str = Field(
            ...,
            description="AI model used for generation"
        )
        
        # Response metadata
        request_id: UUID4 = Field(
            ...,
            description="Original request identifier"
        )
        agent_id: str = Field(
            ...,
            description="Agent instance identifier"
        )
        timestamp: datetime = Field(
            default_factory=lambda: datetime.now(timezone.utc),
            description="Response timestamp"
        )
        metadata: Dict[str, Any] = Field(
            default_factory=dict,
            description="Additional response metadata"
        )
        
        # Arabic text properties
        contains_arabic: bool = Field(
            default=False,
            description="Response contains Arabic text"
        )
        text_direction: Literal["ltr", "rtl", "mixed"] = Field(
            default="ltr",
            description="Text direction for display"
        )
        
        @root_validator
        def analyze_response_text(cls, values):
            """Analyze response text for Arabic content"""
            response = values.get('response', '')
            
            # Check for Arabic characters
            arabic_chars = sum(1 for char in response if '\u0600' <= char <= '\u06FF')
            total_chars = len([c for c in response if c.isalpha()])
            
            if total_chars > 0:
                arabic_ratio = arabic_chars / total_chars
                values['contains_arabic'] = arabic_ratio > 0
                
                if arabic_ratio > 0.7:
                    values['text_direction'] = "rtl"
                elif arabic_ratio > 0.3:
                    values['text_direction'] = "mixed"
                else:
                    values['text_direction'] = "ltr"
            
            return values
    
    
    # Payment Models
    
    class PaymentRequest(IraqiBaseModel):
        """Iraqi payment request model"""
        
        amount: Decimal = Field(
            ...,
            gt=0,
            description="Payment amount"
        )
        currency: str = Field(
            default="IQD",
            description="Payment currency"
        )
        gateway: PaymentGateway = Field(
            ...,
            description="Iraqi payment gateway"
        )
        description: str = Field(
            ...,
            max_length=500,
            description="Payment description"
        )
        user_id: str = Field(
            ...,
            description="User making payment"
        )
        cultural_context: Optional[IraqiCulturalContext] = Field(
            None,
            description="Cultural context for validation"
        )
        islamic_compliance_check: bool = Field(
            default=True,
            description="Require Islamic compliance validation"
        )
        
        @validator('currency')
        def validate_currency(cls, v):
            supported_currencies = ['IQD', 'USD', 'EUR']
            if v not in supported_currencies:
                raise ValueError(f'Currency must be one of: {supported_currencies}')
            return v
        
        @validator('amount')
        def validate_amount_limits(cls, v, values):
            """Validate amount based on gateway limits"""
            gateway = values.get('gateway')
            if gateway:
                # Gateway-specific limits (simplified)
                limits = {
                    PaymentGateway.ZAINCASH: {'min': 1000, 'max': 5000000},
                    PaymentGateway.FASTPAY: {'min': 500, 'max': 10000000},
                    PaymentGateway.NASSWALLET: {'min': 1000, 'max': 3000000}
                }
                
                if gateway in limits:
                    min_amount = limits[gateway]['min']
                    max_amount = limits[gateway]['max']
                    
                    if v < min_amount:
                        raise ValueError(f'{gateway} minimum amount is {min_amount}')
                    if v > max_amount:
                        raise ValueError(f'{gateway} maximum amount is {max_amount}')
            
            return v
    
    
    class PaymentValidationResult(IraqiBaseModel):
        """Payment validation result"""
        
        valid: bool = Field(
            ...,
            description="Payment validation passed"
        )
        islamic_compliant: bool = Field(
            ...,
            description="Payment is Islamic compliant"
        )
        estimated_fee: Decimal = Field(
            ge=0,
            description="Estimated processing fee"
        )
        processing_time_estimate: str = Field(
            ...,
            description="Estimated processing time"
        )
        warnings: List[str] = Field(
            default_factory=list,
            description="Payment warnings"
        )
        errors: List[str] = Field(
            default_factory=list,
            description="Payment validation errors"
        )
        gateway_info: Dict[str, Any] = Field(
            default_factory=dict,
            description="Gateway-specific information"
        )
    
    
    # Professional Domain Models
    
    class ProfessionalQuery(IraqiBaseModel):
        """Professional domain query model"""
        
        domain: ProfessionalDomain = Field(
            ...,
            description="Professional domain"
        )
        question: str = Field(
            ...,
            min_length=10,
            max_length=2000,
            description="Professional question or request"
        )
        cultural_context: Optional[IraqiCulturalContext] = Field(
            None,
            description="Cultural context for guidance"
        )
        urgency: Literal["low", "medium", "high", "critical"] = Field(
            default="medium",
            description="Query urgency level"
        )
        user_role: Optional[str] = Field(
            None,
            description="User's professional role"
        )
        
        @validator('question')
        def validate_question_content(cls, v):
            """Validate professional question"""
            if not v or not v.strip():
                raise ValueError('Question cannot be empty')
            
            # Check for inappropriate content in professional context
            inappropriate_terms = ['illegal', 'unethical', 'harmful', 'dangerous']
            v_lower = v.lower()
            if any(term in v_lower for term in inappropriate_terms):
                raise ValueError('Question contains inappropriate content for professional guidance')
            
            return v.strip()
    
    
    class ProfessionalGuidanceResponse(IraqiBaseModel):
        """Professional domain guidance response"""
        
        domain: ProfessionalDomain = Field(
            ...,
            description="Professional domain"
        )
        guidance: str = Field(
            ...,
            description="Professional guidance content"
        )
        guidance_arabic: Optional[str] = Field(
            None,
            description="Guidance in Arabic"
        )
        disclaimer: str = Field(
            ...,
            description="Professional disclaimer"
        )
        cultural_notes: str = Field(
            ...,
            description="Iraqi cultural considerations"
        )
        professional_relevance: float = Field(
            ge=0.0, le=1.0,
            description="Professional relevance score"
        )
        recommended_next_steps: List[str] = Field(
            default_factory=list,
            description="Recommended next steps"
        )
        resources: List[Dict[str, str]] = Field(
            default_factory=list,
            description="Professional resources and references"
        )
        confidence: float = Field(
            ge=0.0, le=1.0,
            description="Guidance confidence level"
        )
    
    
    # Agent Performance Models
    
    class AgentPerformanceMetrics(IraqiBaseModel):
        """Agent performance tracking model"""
        
        agent_id: str = Field(
            ...,
            description="Agent identifier"
        )
        request_count: int = Field(
            ge=0,
            description="Total request count"
        )
        avg_processing_time: float = Field(
            ge=0.0,
            description="Average processing time in seconds"
        )
        cultural_validation_count: int = Field(
            ge=0,
            description="Number of cultural validations performed"
        )
        validation_success_rate: float = Field(
            ge=0.0, le=1.0,
            description="Cultural validation success rate"
        )
        islamic_compliance_rate: float = Field(
            ge=0.0, le=1.0,
            description="Islamic compliance success rate"
        )
        arabic_processing_accuracy: float = Field(
            ge=0.0, le=1.0,
            description="Arabic text processing accuracy"
        )
        uptime_hours: float = Field(
            ge=0.0,
            description="Agent uptime in hours"
        )
        last_updated: datetime = Field(
            default_factory=lambda: datetime.now(timezone.utc),
            description="Last metrics update timestamp"
        )

else:
    # Fallback classes for development without Pydantic
    
    class IraqiCulturalContext:
        def __init__(self, **kwargs):
            for k, v in kwargs.items():
                setattr(self, k, v)
    
    class CulturalValidationResult:
        def __init__(self, **kwargs):
            for k, v in kwargs.items():
                setattr(self, k, v)
    
    class IraqiAgentInput:
        def __init__(self, **kwargs):
            for k, v in kwargs.items():
                setattr(self, k, v)
    
    class IraqiAgentOutput:
        def __init__(self, **kwargs):
            for k, v in kwargs.items():
                setattr(self, k, v)
    
    class PaymentRequest:
        def __init__(self, **kwargs):
            for k, v in kwargs.items():
                setattr(self, k, v)
    
    class PaymentValidationResult:
        def __init__(self, **kwargs):
            for k, v in kwargs.items():
                setattr(self, k, v)
    
    class ProfessionalQuery:
        def __init__(self, **kwargs):
            for k, v in kwargs.items():
                setattr(self, k, v)
    
    class ProfessionalGuidanceResponse:
        def __init__(self, **kwargs):
            for k, v in kwargs.items():
                setattr(self, k, v)
    
    class AgentPerformanceMetrics:
        def __init__(self, **kwargs):
            for k, v in kwargs.items():
                setattr(self, k, v)


# Model registry for easy access
MODEL_REGISTRY = {
    'IraqiCulturalContext': IraqiCulturalContext,
    'CulturalValidationResult': CulturalValidationResult,
    'IraqiAgentInput': IraqiAgentInput,
    'IraqiAgentOutput': IraqiAgentOutput,
    'PaymentRequest': PaymentRequest,
    'PaymentValidationResult': PaymentValidationResult,
    'ProfessionalQuery': ProfessionalQuery,
    'ProfessionalGuidanceResponse': ProfessionalGuidanceResponse,
    'AgentPerformanceMetrics': AgentPerformanceMetrics
}


def get_model_by_name(model_name: str):
    """Get model class by name"""
    return MODEL_REGISTRY.get(model_name)


def get_available_models() -> List[str]:
    """Get list of available model names"""
    return list(MODEL_REGISTRY.keys())