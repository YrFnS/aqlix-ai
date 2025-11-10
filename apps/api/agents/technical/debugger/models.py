"""Technical Debugger Models"""

from typing import Optional, Literal, List, Dict, Any
from pydantic import BaseModel, Field


class DebugIssue(BaseModel):
    """Technical issue with Iraqi context."""

    issue_id: str
    severity: Literal["critical", "high", "medium", "low"]
    category: Literal[
        "cultural_compliance",
        "arabic_rendering",
        "payment_gateway",
        "performance",
        "infrastructure",
        "agent_error",
    ]
    description: str
    iraqi_context: Optional[str] = None
    stack_trace: Optional[str] = None
    affected_components: List[str] = Field(default_factory=list)
    reproduction_steps: List[str] = Field(default_factory=list)


class DebugAnalysis(BaseModel):
    """Debug analysis report."""

    issues_found: List[DebugIssue]
    total_issues: int
    critical_count: int
    root_cause_analysis: str
    iraqi_specific_issues: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)
    performance_metrics: Dict[str, Any] = Field(default_factory=dict)
