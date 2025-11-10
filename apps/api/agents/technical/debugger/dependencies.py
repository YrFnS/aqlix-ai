"""Iraqi Technical Debugger Dependencies"""

from dataclasses import dataclass
from typing import Literal, Optional, List
from apps.api.agents.core.models import IraqiAgentDependencies


@dataclass
class TechnicalDebuggerDeps(IraqiAgentDependencies):
    """Dependencies for Iraqi technical debugger agent."""

    # Debug Configuration
    debug_scope: Literal["system", "agent", "cultural", "arabic", "payment"] = "system"
    severity_filter: Literal["all", "critical", "high", "medium"] = "all"

    # Iraqi-Specific Debug Areas
    check_cultural_compliance: bool = True
    check_arabic_rendering: bool = True
    check_payment_integration: bool = False
    check_infrastructure_resilience: bool = True

    # Analysis Depth
    include_stack_trace: bool = True
    include_performance_analysis: bool = True
    include_suggestions: bool = True

    # Iraqi Context
    timezone: str = "Asia/Baghdad"  # UTC+3
    expected_infrastructure: Literal["stable", "unstable", "offline"] = "unstable"
