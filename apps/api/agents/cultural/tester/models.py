"""
Cultural Tester Models

Pydantic models for cultural testing results.
"""

from typing import Optional, Literal, Dict, Any, List
from pydantic import BaseModel, Field


class CulturalTestScenario(BaseModel):
    """A single cultural test scenario."""

    scenario_id: str = Field(description="Unique scenario identifier")
    category: Literal[
        "islamic_compliance",
        "cultural_appropriateness",
        "political_neutrality",
        "professional_context",
        "arabic_processing",
    ] = Field(description="Test category")
    test_input: str = Field(description="Test input content")
    expected_result: Dict[str, Any] = Field(
        description="Expected validation/processing result"
    )
    severity: Literal["critical", "high", "medium", "low"] = Field(
        default="medium", description="Test severity/importance"
    )
    description: str = Field(description="Test scenario description")


class CulturalTestResult(BaseModel):
    """Result from a single cultural test."""

    scenario_id: str = Field(description="Test scenario identifier")
    category: str = Field(description="Test category")
    passed: bool = Field(description="Whether test passed")
    execution_time_ms: float = Field(description="Test execution time")
    actual_result: Dict[str, Any] = Field(description="Actual validation result")
    expected_result: Dict[str, Any] = Field(description="Expected result")
    discrepancies: List[str] = Field(
        default_factory=list, description="Differences between expected and actual"
    )
    error_message: Optional[str] = Field(
        default=None, description="Error message if test failed"
    )


class CulturalTestReport(BaseModel):
    """Comprehensive cultural testing report."""

    # Test Summary
    total_tests: int = Field(description="Total number of tests executed")
    passed_tests: int = Field(description="Number of tests passed")
    failed_tests: int = Field(description="Number of tests failed")
    success_rate: float = Field(
        ge=0.0, le=1.0, description="Test success rate (0.0-1.0)"
    )

    # Category Breakdown
    category_results: Dict[str, Dict[str, Any]] = Field(
        default_factory=dict, description="Results by test category"
    )

    # Test Results
    test_results: List[CulturalTestResult] = Field(
        description="Individual test results"
    )

    # Metrics
    total_execution_time_ms: float = Field(description="Total testing time")
    average_test_time_ms: float = Field(description="Average time per test")

    # Analysis
    critical_failures: List[str] = Field(
        default_factory=list, description="Critical test failures"
    )
    recommendations: List[str] = Field(
        default_factory=list, description="Recommendations for improvement"
    )

    # Quality Gates
    islamic_compliance_passed: bool = Field(
        description="Whether Islamic compliance tests passed"
    )
    cultural_appropriateness_passed: bool = Field(
        description="Whether cultural appropriateness tests passed"
    )
    political_neutrality_passed: bool = Field(
        description="Whether political neutrality tests passed"
    )
