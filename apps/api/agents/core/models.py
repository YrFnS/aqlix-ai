"""
Iraqi AI Agent Core Models

Shared Pydantic models and base dependencies for all Iraqi AI agents.
"""

from typing import Optional, Literal, Dict, Any
from pydantic import BaseModel, Field
from dataclasses import dataclass


# ============================================================================
# Base Dependencies
# ============================================================================


@dataclass
class IraqiAgentDependencies:
    """
    Base dependencies for all Iraqi AI agents.

    This dataclass provides the minimum required dependencies that all agents
    need for Iraqi cultural intelligence integration.
    """

    # Cultural Context
    cultural_mode: Literal["strict", "moderate", "flexible"] = "strict"
    islamic_compliance_required: bool = True

    # Language Configuration
    language_preference: Literal["arabic", "english", "mixed"] = "mixed"
    arabic_dialect: Literal["iraqi", "msa", "auto"] = "iraqi"

    # Professional Context
    professional_domain: Optional[str] = None  # legal, medical, educational, etc.

    # Session Context
    session_id: Optional[str] = None
    user_id: Optional[str] = None

    # Performance Configuration
    timeout_ms: int = 5000
    max_retries: int = 3


# ============================================================================
# Cultural Validation Models
# ============================================================================


class CulturalValidationResult(BaseModel):
    """Result from cultural appropriateness validation."""

    cultural_appropriateness_score: float = Field(
        ge=0.0, le=1.0, description="Cultural appropriateness score (0.0-1.0)"
    )
    islamic_compliance: bool = Field(
        description="Whether content meets 100% Islamic compliance"
    )
    political_sensitivity_detected: bool = Field(
        default=False,
        description="Whether politically/sectarian sensitive content detected",
    )
    professional_context_valid: bool = Field(
        default=True,
        description="Whether content is appropriate for professional domain",
    )
    improvement_suggestions: list[str] = Field(
        default_factory=list,
        description="Suggestions for improving cultural appropriateness",
    )
    filtered_content: Optional[str] = Field(
        default=None, description="Content with sensitive topics filtered"
    )


class IslamicComplianceViolation(BaseModel):
    """Details of an Islamic compliance violation."""

    rule_id: str = Field(description="Violation rule identifier")
    category: str = Field(description="Violation category")
    description: str = Field(description="Violation description")
    severity: Literal["critical", "high", "medium", "low"] = Field(
        description="Violation severity"
    )
    location: Optional[str] = Field(
        default=None, description="Location in content where violation occurred"
    )


class IslamicComplianceResult(BaseModel):
    """Result from Islamic compliance validation."""

    compliant: bool = Field(description="Whether content is 100% compliant")
    violations: list[IslamicComplianceViolation] = Field(
        default_factory=list, description="List of compliance violations found"
    )
    filtered_content: Optional[str] = Field(
        default=None, description="Content with violations filtered/corrected"
    )


# ============================================================================
# Arabic Processing Models
# ============================================================================


class ArabicProcessingResult(BaseModel):
    """Result from Arabic text processing."""

    # Input/Output
    original_text: str = Field(description="Original input text")
    rtl_formatted_text: str = Field(
        description="Text with proper RTL formatting applied"
    )
    normalized_text: Optional[str] = Field(
        default=None, description="Normalized Arabic text (optional)"
    )

    # Direction Analysis
    text_direction: Literal["rtl", "ltr", "mixed"] = Field(
        description="Text direction (RTL, LTR, or mixed)"
    )

    # Dialect Detection
    detected_dialect: Literal[
        "iraqi", "msa", "gulf", "levantine", "egyptian", "maghrebi", "none"
    ] = Field(description="Detected Arabic dialect")
    dialect_confidence: float = Field(
        ge=0.0, le=1.0, description="Dialect detection confidence (0.0-1.0)"
    )
    is_iraqi_dialect: bool = Field(
        default=False, description="Whether Iraqi dialect was detected"
    )

    # Code-Switching Analysis
    is_code_switching: bool = Field(
        default=False, description="Whether Arabic-English code-switching detected"
    )
    arabic_ratio: float = Field(
        ge=0.0, le=1.0, description="Ratio of Arabic to total text (0.0-1.0)"
    )

    # RTL Metadata
    rtl_metadata: Dict[str, Any] = Field(
        default_factory=dict, description="Additional RTL formatting metadata"
    )

    # Legacy fields (for backward compatibility)
    confidence_score: Optional[float] = Field(
        default=None, ge=0.0, le=1.0, description="Legacy: same as dialect_confidence"
    )
    dialect_features: Dict[str, float] = Field(
        default_factory=dict, description="Dialect-specific feature scores"
    )
    language_mix: Optional[Dict[str, float]] = Field(
        default=None, description="Language percentages if mixed content detected"
    )


# ============================================================================
# Professional Domain Models
# ============================================================================


class ProfessionalTerminology(BaseModel):
    """Professional domain terminology mapping."""

    domain: Literal[
        "legal",
        "medical",
        "educational",
        "engineering",
        "organizational",
        "business",
        "technical",
    ]
    term_english: str = Field(description="Term in English")
    term_arabic: str = Field(description="Term in Arabic")
    definition: Optional[str] = Field(default=None, description="Term definition")
    usage_context: Optional[str] = Field(default=None, description="Usage context")


class ProfessionalDomainResponse(BaseModel):
    """Response from professional domain agent."""

    domain: str = Field(description="Professional domain")
    expertise_level: Literal["basic", "intermediate", "expert"] = Field(
        description="Expertise level of response"
    )
    response_content: str = Field(description="Main response content")
    terminology_used: list[ProfessionalTerminology] = Field(
        default_factory=list, description="Professional terminology used in response"
    )
    references: list[str] = Field(
        default_factory=list, description="References or citations"
    )
    disclaimer: Optional[str] = Field(
        default=None, description="Professional disclaimer if needed"
    )


# ============================================================================
# Performance Tracking Models
# ============================================================================


class AgentPerformanceMetrics(BaseModel):
    """Performance metrics for an agent execution."""

    agent_name: str = Field(description="Agent identifier")
    execution_time_ms: float = Field(description="Execution time in milliseconds")
    tokens_used: int = Field(default=0, description="Tokens consumed")
    cultural_validation_time_ms: Optional[float] = Field(
        default=None, description="Time spent on cultural validation"
    )
    cultural_appropriateness_score: Optional[float] = Field(
        default=None, description="Cultural appropriateness score achieved"
    )
    success: bool = Field(description="Whether execution succeeded")
    error_message: Optional[str] = Field(
        default=None, description="Error message if execution failed"
    )


class MultiAgentWorkflowMetrics(BaseModel):
    """Metrics for multi-agent workflow execution."""

    workflow_name: str = Field(description="Workflow identifier")
    total_execution_time_ms: float = Field(description="Total workflow execution time")
    agent_executions: list[AgentPerformanceMetrics] = Field(
        description="Metrics for each agent in workflow"
    )
    context_optimization_applied: bool = Field(
        default=False, description="Whether context optimization was applied"
    )
    context_size_reduction_percent: Optional[float] = Field(
        default=None, description="Percentage reduction in context size"
    )
    total_tokens_used: int = Field(description="Total tokens used across all agents")
    success: bool = Field(description="Whether workflow completed successfully")


# ============================================================================
# Security Models
# ============================================================================


class SecurityVulnerability(BaseModel):
    """Details of a security vulnerability."""

    vulnerability_id: str = Field(description="Vulnerability identifier")
    severity: Literal["critical", "high", "medium", "low"] = Field(
        description="Vulnerability severity"
    )
    category: str = Field(description="Vulnerability category")
    description: str = Field(description="Vulnerability description")
    location: Optional[str] = Field(
        default=None, description="Location where vulnerability was found"
    )
    remediation: Optional[str] = Field(
        default=None, description="Suggested remediation steps"
    )


class SecurityAuditReport(BaseModel):
    """Result from security audit."""

    audit_passed: bool = Field(description="Whether audit passed all checks")
    vulnerabilities: list[SecurityVulnerability] = Field(
        default_factory=list, description="Vulnerabilities found"
    )
    compliance_status: Dict[str, bool] = Field(
        default_factory=dict, description="Compliance status for various standards"
    )
    recommendations: list[str] = Field(
        default_factory=list, description="Security recommendations"
    )


# ============================================================================
# Payment Models
# ============================================================================


class PaymentGatewayTest(BaseModel):
    """Result from payment gateway testing."""

    gateway: Literal["zaincash", "fastpay", "nasswallet"] = Field(
        description="Payment gateway tested"
    )
    test_type: Literal["connection", "transaction", "error_handling", "security"] = (
        Field(description="Type of test performed")
    )
    success: bool = Field(description="Whether test passed")
    response_time_ms: float = Field(description="Gateway response time")
    error_message: Optional[str] = Field(
        default=None, description="Error message if test failed"
    )
    transaction_id: Optional[str] = Field(
        default=None, description="Test transaction ID"
    )


class PaymentTestReport(BaseModel):
    """Comprehensive payment testing report."""

    gateway_tests: list[PaymentGatewayTest] = Field(
        description="Individual gateway test results"
    )
    overall_success_rate: float = Field(
        description="Overall test success rate (0.0-1.0)"
    )
    security_validation_passed: bool = Field(
        description="Whether security validation passed"
    )
    recommendations: list[str] = Field(
        default_factory=list, description="Recommendations for improvement"
    )
