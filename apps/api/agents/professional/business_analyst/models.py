"""
Business Analyst Models

Pydantic models for business analysis results.
"""

from typing import Optional, Literal, Dict, Any, List
from pydantic import BaseModel, Field


class UserStory(BaseModel):
    """User story for business requirements."""

    story_id: str = Field(description="Unique story identifier")
    as_a: str = Field(description="User role (Arabic/English)")
    i_want: str = Field(description="Desired functionality")
    so_that: str = Field(description="Business value")
    acceptance_criteria: List[str] = Field(
        default_factory=list, description="Acceptance criteria"
    )
    priority: Literal["critical", "high", "medium", "low"] = Field(
        default="medium", description="Story priority"
    )
    story_points: Optional[int] = Field(
        default=None, description="Estimated complexity (1-13)"
    )
    cultural_considerations: List[str] = Field(
        default_factory=list, description="Iraqi cultural considerations"
    )


class BusinessRequirement(BaseModel):
    """Business requirement specification."""

    requirement_id: str = Field(description="Unique requirement identifier")
    category: Literal[
        "functional", "non-functional", "cultural", "regulatory", "security"
    ] = Field(description="Requirement category")
    description: str = Field(description="Requirement description")
    description_arabic: Optional[str] = Field(
        default=None, description="Arabic translation"
    )
    rationale: str = Field(description="Business rationale")
    priority: Literal["must_have", "should_have", "could_have", "wont_have"] = Field(
        description="MoSCoW priority"
    )
    stakeholders: List[str] = Field(
        default_factory=list, description="Affected stakeholders"
    )
    acceptance_criteria: List[str] = Field(
        default_factory=list, description="Acceptance criteria"
    )
    iraqi_compliance_required: bool = Field(
        default=False, description="Whether Iraqi regulatory compliance required"
    )


class ROIAnalysis(BaseModel):
    """Return on Investment analysis for Iraqi market."""

    total_investment_iqd: float = Field(description="Total investment in IQD")
    total_investment_usd: Optional[float] = Field(
        default=None, description="Total investment in USD"
    )
    expected_revenue_iqd: float = Field(description="Expected revenue in IQD")
    timeframe_months: int = Field(description="ROI timeframe in months")
    roi_percentage: float = Field(description="ROI percentage")
    break_even_months: int = Field(description="Break-even point in months")
    risk_factors: List[str] = Field(
        default_factory=list, description="Iraqi market risk factors"
    )
    assumptions: List[str] = Field(
        default_factory=list, description="Analysis assumptions"
    )


class StakeholderAnalysis(BaseModel):
    """Stakeholder analysis matrix."""

    stakeholder_name: str = Field(description="Stakeholder name")
    role: str = Field(description="Stakeholder role")
    influence: Literal["high", "medium", "low"] = Field(
        description="Stakeholder influence"
    )
    interest: Literal["high", "medium", "low"] = Field(
        description="Stakeholder interest"
    )
    language_preference: Literal["arabic", "english", "mixed"] = Field(
        description="Communication language preference"
    )
    engagement_strategy: str = Field(description="How to engage this stakeholder")
    cultural_considerations: List[str] = Field(
        default_factory=list, description="Cultural considerations for engagement"
    )


class BusinessAnalysisReport(BaseModel):
    """Comprehensive business analysis report."""

    # Executive Summary
    project_name: str = Field(description="Project name")
    analysis_date: str = Field(description="Analysis date")
    analyst_name: str = Field(description="Analyst name")
    executive_summary: str = Field(description="Executive summary")
    executive_summary_arabic: Optional[str] = Field(
        default=None, description="Arabic executive summary"
    )

    # Requirements
    business_requirements: List[BusinessRequirement] = Field(
        default_factory=list, description="Business requirements"
    )
    user_stories: List[UserStory] = Field(
        default_factory=list, description="User stories"
    )

    # Analysis
    roi_analysis: Optional[ROIAnalysis] = Field(
        default=None, description="ROI analysis"
    )
    stakeholder_analysis: List[StakeholderAnalysis] = Field(
        default_factory=list, description="Stakeholder analysis"
    )

    # Iraqi Context
    iraqi_market_insights: List[str] = Field(
        default_factory=list, description="Iraqi market insights"
    )
    cultural_requirements: List[str] = Field(
        default_factory=list, description="Cultural requirements"
    )
    regulatory_compliance: List[str] = Field(
        default_factory=list, description="Iraqi regulatory compliance items"
    )

    # Recommendations
    recommendations: List[str] = Field(
        default_factory=list, description="Business recommendations"
    )
    risks: List[str] = Field(default_factory=list, description="Identified risks")
    mitigation_strategies: List[str] = Field(
        default_factory=list, description="Risk mitigation strategies"
    )
