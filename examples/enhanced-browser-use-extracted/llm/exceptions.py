"""
Enhanced LLM exceptions with Iraqi AI integration.
Extracted from browser-use with cultural validation and Arabic processing error handling.
"""

from typing import Optional


class ModelProviderError(Exception):
    """
    Enhanced model provider error with Iraqi AI context.
    
    Includes cultural validation failures, Arabic processing errors,
    and Islamic compliance violations.
    """
    
    def __init__(
        self,
        message: str,
        model: str,
        status_code: Optional[int] = None,
        cultural_validation_failed: bool = False,
        arabic_processing_failed: bool = False,
        islamic_compliance_failed: bool = False,
        iraqi_dialect_processing_failed: bool = False
    ):
        """
        Initialize enhanced model provider error.
        
        Args:
            message: Error message
            model: Model name that failed
            status_code: HTTP status code if applicable
            cultural_validation_failed: Whether cultural validation failed
            arabic_processing_failed: Whether Arabic RTL processing failed
            islamic_compliance_failed: Whether Islamic compliance check failed
            iraqi_dialect_processing_failed: Whether Iraqi dialect processing failed
        """
        super().__init__(message)
        self.message = message
        self.model = model
        self.status_code = status_code
        self.cultural_validation_failed = cultural_validation_failed
        self.arabic_processing_failed = arabic_processing_failed
        self.islamic_compliance_failed = islamic_compliance_failed
        self.iraqi_dialect_processing_failed = iraqi_dialect_processing_failed
    
    def __str__(self) -> str:
        """Return detailed error message with Iraqi AI context."""
        error_parts = [f"Model '{self.model}' error: {self.message}"]
        
        if self.status_code:
            error_parts.append(f"Status code: {self.status_code}")
        
        # Add Iraqi AI specific error context
        if self.cultural_validation_failed:
            error_parts.append("Cultural validation failed")
        
        if self.arabic_processing_failed:
            error_parts.append("Arabic RTL processing failed")
        
        if self.islamic_compliance_failed:
            error_parts.append("Islamic compliance check failed")
        
        if self.iraqi_dialect_processing_failed:
            error_parts.append("Iraqi dialect processing failed")
        
        return " | ".join(error_parts)
    
    @property
    def has_iraqi_ai_failures(self) -> bool:
        """Check if error involves Iraqi AI processing failures."""
        return (
            self.cultural_validation_failed or
            self.arabic_processing_failed or
            self.islamic_compliance_failed or
            self.iraqi_dialect_processing_failed
        )


class ModelRateLimitError(ModelProviderError):
    """
    Rate limit error with Iraqi AI processing context.
    
    Includes information about which Iraqi AI services were being used
    when rate limiting occurred.
    """
    
    def __init__(self, message: str, model: str, retry_after: Optional[int] = None, **kwargs):
        """
        Initialize rate limit error.
        
        Args:
            message: Error message
            model: Model name that hit rate limit
            retry_after: Seconds to wait before retrying
            **kwargs: Additional Iraqi AI error context
        """
        super().__init__(message, model, status_code=429, **kwargs)
        self.retry_after = retry_after
    
    def __str__(self) -> str:
        base_msg = super().__str__()
        if self.retry_after:
            base_msg += f" | Retry after: {self.retry_after}s"
        return base_msg


class CulturalValidationError(ModelProviderError):
    """
    Cultural validation specific error.
    
    Raised when content fails Iraqi cultural appropriateness checks.
    """
    
    def __init__(
        self,
        message: str,
        model: str,
        validation_score: float,
        required_score: float = 0.95,
        validation_details: Optional[list[str]] = None
    ):
        """
        Initialize cultural validation error.
        
        Args:
            message: Error message
            model: Model name
            validation_score: Actual validation score (0.0-1.0)
            required_score: Required minimum score
            validation_details: List of specific validation issues
        """
        super().__init__(
            message,
            model,
            cultural_validation_failed=True
        )
        self.validation_score = validation_score
        self.required_score = required_score
        self.validation_details = validation_details or []
    
    def __str__(self) -> str:
        base_msg = super().__str__()
        score_info = f"Score: {self.validation_score:.1%} (required: {self.required_score:.1%})"
        
        if self.validation_details:
            details = ", ".join(self.validation_details)
            return f"{base_msg} | {score_info} | Issues: {details}"
        
        return f"{base_msg} | {score_info}"


class ArabicProcessingError(ModelProviderError):
    """
    Arabic RTL processing specific error.
    
    Raised when Arabic text processing or Iraqi dialect recognition fails.
    """
    
    def __init__(
        self,
        message: str,
        model: str,
        processing_stage: str,
        arabic_text: Optional[str] = None,
        dialect_confidence: Optional[float] = None
    ):
        """
        Initialize Arabic processing error.
        
        Args:
            message: Error message
            model: Model name
            processing_stage: Stage where processing failed (rtl, dialect, etc.)
            arabic_text: Arabic text that failed processing
            dialect_confidence: Iraqi dialect confidence if applicable
        """
        super().__init__(
            message,
            model,
            arabic_processing_failed=True,
            iraqi_dialect_processing_failed=(processing_stage == 'dialect')
        )
        self.processing_stage = processing_stage
        self.arabic_text = arabic_text
        self.dialect_confidence = dialect_confidence
    
    def __str__(self) -> str:
        base_msg = super().__str__()
        stage_info = f"Processing stage: {self.processing_stage}"
        
        if self.dialect_confidence is not None:
            stage_info += f" | Dialect confidence: {self.dialect_confidence:.1%}"
        
        return f"{base_msg} | {stage_info}"


class IslamicComplianceError(ModelProviderError):
    """
    Islamic compliance specific error.
    
    Raised when content violates Islamic principles or values.
    """
    
    def __init__(
        self,
        message: str,
        model: str,
        compliance_score: float,
        required_score: float = 0.90,
        violation_type: Optional[str] = None,
        content_excerpt: Optional[str] = None
    ):
        """
        Initialize Islamic compliance error.
        
        Args:
            message: Error message
            model: Model name
            compliance_score: Actual compliance score (0.0-1.0)
            required_score: Required minimum score
            violation_type: Type of Islamic principle violation
            content_excerpt: Excerpt of problematic content (sanitized)
        """
        super().__init__(
            message,
            model,
            islamic_compliance_failed=True
        )
        self.compliance_score = compliance_score
        self.required_score = required_score
        self.violation_type = violation_type
        self.content_excerpt = content_excerpt
    
    def __str__(self) -> str:
        base_msg = super().__str__()
        score_info = f"Compliance score: {self.compliance_score:.1%} (required: {self.required_score:.1%})"
        
        if self.violation_type:
            score_info += f" | Violation type: {self.violation_type}"
        
        return f"{base_msg} | {score_info}"