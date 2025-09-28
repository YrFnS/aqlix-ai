"""
Enhanced chat views with Iraqi AI integration.
Extracted from browser-use with cultural validation and Arabic processing.
"""

from typing import Generic, TypeVar, Optional
from pydantic import BaseModel, Field

T = TypeVar("T")


class ChatInvokeUsage(BaseModel):
    """
    Usage statistics for chat invocations with Iraqi AI enhancements.
    """

    # Token usage
    prompt_tokens: int = Field(description="Number of tokens in the prompt")
    prompt_cached_tokens: Optional[int] = Field(
        default=None, description="Number of cached prompt tokens"
    )
    prompt_cache_creation_tokens: Optional[int] = Field(
        default=None, description="Tokens used for cache creation"
    )
    prompt_image_tokens: Optional[int] = Field(
        default=None, description="Tokens used for image processing"
    )
    completion_tokens: int = Field(description="Number of tokens in the completion")
    total_tokens: int = Field(description="Total number of tokens used")

    # Iraqi AI specific metrics
    cultural_validation_tokens: Optional[int] = Field(
        default=None, description="Tokens used for cultural validation"
    )
    arabic_processing_tokens: Optional[int] = Field(
        default=None, description="Tokens used for Arabic RTL processing"
    )
    islamic_compliance_tokens: Optional[int] = Field(
        default=None, description="Tokens used for Islamic compliance checking"
    )

    # Performance metrics
    cultural_validation_time_ms: Optional[float] = Field(
        default=None, description="Time spent on cultural validation"
    )
    arabic_processing_time_ms: Optional[float] = Field(
        default=None, description="Time spent on Arabic processing"
    )
    total_processing_time_ms: Optional[float] = Field(
        default=None, description="Total processing time"
    )


class IraqiAIMetrics(BaseModel):
    """
    Iraqi AI specific metrics for chat completions.
    """

    # Cultural validation scores
    cultural_appropriateness_score: float = Field(
        ge=0.0, le=1.0, description="Cultural appropriateness score (0-1)"
    )
    islamic_compliance_score: float = Field(
        ge=0.0, le=1.0, description="Islamic compliance score (0-1)"
    )
    political_neutrality_score: float = Field(
        ge=0.0, le=1.0, description="Political neutrality score (0-1)"
    )

    # Arabic processing metrics
    arabic_content_percentage: float = Field(
        ge=0.0, le=1.0, description="Percentage of Arabic content"
    )
    rtl_accuracy_score: float = Field(
        ge=0.0, le=1.0, description="RTL processing accuracy"
    )
    iraqi_dialect_confidence: float = Field(
        ge=0.0, le=1.0, description="Iraqi dialect detection confidence"
    )

    # Professional domain metrics
    legal_domain_relevance: float = Field(
        default=0.0, ge=0.0, le=1.0, description="Legal domain relevance"
    )
    medical_domain_relevance: float = Field(
        default=0.0, ge=0.0, le=1.0, description="Medical domain relevance"
    )
    educational_domain_relevance: float = Field(
        default=0.0, ge=0.0, le=1.0, description="Educational domain relevance"
    )

    # Quality assurance
    validation_passed: bool = Field(description="Whether all validations passed")
    validation_warnings: list[str] = Field(
        default_factory=list, description="List of validation warnings"
    )


class ChatInvokeCompletion(BaseModel, Generic[T]):
    """
    Chat completion result with Iraqi AI enhancements.

    Generic type T can be either str for text completions or a Pydantic model
    for structured output completions.
    """

    completion: T = Field(description="The completion result")
    usage: Optional[ChatInvokeUsage] = Field(
        default=None, description="Token usage statistics"
    )
    iraqi_metrics: Optional[IraqiAIMetrics] = Field(
        default=None, description="Iraqi AI specific metrics"
    )

    # Response metadata
    response_id: Optional[str] = Field(
        default=None, description="Unique response identifier"
    )
    model_name: Optional[str] = Field(
        default=None, description="Name of the model used"
    )
    provider: Optional[str] = Field(default=None, description="LLM provider name")

    # Iraqi AI processing flags
    cultural_validation_applied: bool = Field(
        default=False, description="Whether cultural validation was applied"
    )
    arabic_processing_applied: bool = Field(
        default=False, description="Whether Arabic RTL processing was applied"
    )
    islamic_compliance_checked: bool = Field(
        default=False, description="Whether Islamic compliance was checked"
    )

    def is_culturally_appropriate(self, threshold: float = 0.95) -> bool:
        """
        Check if the completion meets cultural appropriateness threshold.

        Args:
            threshold: Minimum score required (0.0 to 1.0)

        Returns:
            True if culturally appropriate
        """
        if not self.iraqi_metrics:
            return False
        return self.iraqi_metrics.cultural_appropriateness_score >= threshold

    def is_islamically_compliant(self, threshold: float = 0.90) -> bool:
        """
        Check if the completion meets Islamic compliance threshold.

        Args:
            threshold: Minimum score required (0.0 to 1.0)

        Returns:
            True if Islamically compliant
        """
        if not self.iraqi_metrics:
            return False
        return self.iraqi_metrics.islamic_compliance_score >= threshold

    def is_politically_neutral(self, threshold: float = 0.85) -> bool:
        """
        Check if the completion meets political neutrality threshold.

        Args:
            threshold: Minimum score required (0.0 to 1.0)

        Returns:
            True if politically neutral
        """
        if not self.iraqi_metrics:
            return False
        return self.iraqi_metrics.political_neutrality_score >= threshold

    def has_quality_validation_passed(self) -> bool:
        """
        Check if all Iraqi AI quality validations passed.

        Returns:
            True if all validations passed
        """
        if not self.iraqi_metrics:
            return False
        return self.iraqi_metrics.validation_passed

    def get_total_cost_estimate(
        self, input_cost_per_1k: float = 0.001, output_cost_per_1k: float = 0.002
    ) -> float:
        """
        Estimate total cost including Iraqi AI processing overhead.

        Args:
            input_cost_per_1k: Cost per 1000 input tokens
            output_cost_per_1k: Cost per 1000 output tokens

        Returns:
            Estimated total cost in USD
        """
        if not self.usage:
            return 0.0

        input_cost = (self.usage.prompt_tokens / 1000) * input_cost_per_1k
        output_cost = (self.usage.completion_tokens / 1000) * output_cost_per_1k

        # Add Iraqi AI processing overhead (typically 5-10% additional cost)
        base_cost = input_cost + output_cost
        iraqi_overhead = (
            base_cost * 0.075
        )  # 7.5% overhead for cultural/Arabic processing

        return base_cost + iraqi_overhead
