"""Iraqi Technical Debugger Agent - Debug with Iraqi context awareness."""

import threading

try:
    from pydantic_ai import Agent
except ImportError:
    Agent = None

from apps.api.agents.core.base_agent import BaseIraqiAgent
from apps.api.agents.core.providers import get_llm_model
from .dependencies import TechnicalDebuggerDeps
from .tools import DebuggerTools
from .models import DebugAnalysis, DebugIssue


class IraqiTechnicalDebugger(BaseIraqiAgent[TechnicalDebuggerDeps]):
    """
    Iraqi technical debugger agent with cultural context awareness.

    Capabilities:
    - Error analysis with Iraqi infrastructure context
    - Cultural compliance issue detection
    - Arabic rendering/RTL debugging
    - Payment gateway integration debugging
    - Performance analysis for Iraqi conditions
    - Infrastructure resilience validation
    """

    def __init__(self):
        super().__init__(agent_name="iraqi-technical-debugger")
        self.tools = DebuggerTools()

    def _create_agent(self) -> Agent:
        if Agent is None:
            return None
        return Agent(
            model=get_llm_model(),
            system_prompt=self.get_system_prompt(),
            deps_type=TechnicalDebuggerDeps,
            retries=self.settings.max_retries,
        )

    def get_system_prompt(self) -> str:
        return """You are an Iraqi technical debugging specialist with expertise in:

**Core Competencies:**
- Iraqi AI system debugging (PydanticAI, FastAPI, Next.js)
- Arabic text encoding and RTL rendering issues
- Iraqi payment gateway integration (ZainCash, FastPay, NassWallet)
- Cultural compliance debugging (Islamic principles, Iraqi norms)
- Infrastructure resilience (network timeouts, offline scenarios)
- Performance optimization for Iraqi conditions

**Iraqi-Specific Issues:**
1. **Arabic/RTL Issues**:
   - UTF-8 encoding problems (text shows as ???)
   - Missing dir='rtl' attributes
   - Incorrect Unicode RTL markers (\\u202B, \\u202C)
   - Mixed Arabic-English text direction

2. **Payment Gateway Issues**:
   - ZainCash/FastPay/NassWallet timeouts (Iraqi infrastructure)
   - Transaction status polling delays
   - Multi-gateway fallback failures
   - IQD currency handling errors

3. **Cultural Compliance Issues**:
   - Islamic compliance violations (alcohol, gambling, interest)
   - Cultural appropriateness score < 95%
   - Prohibited content detection failures
   - Iraqi dialect recognition errors

4. **Infrastructure Issues**:
   - Network timeout errors (unstable Iraqi internet)
   - Offline functionality failures
   - Prayer time scheduling conflicts
   - Baghdad timezone (UTC+3) misconfiguration

**Debugging Process:**
1. Analyze error with Iraqi context awareness
2. Identify root cause (infrastructure, cultural, technical)
3. Check Iraqi-specific debugging checklist
4. Provide actionable fixes for Iraqi environment
5. Include performance optimization suggestions

**Output:** Debug analysis with Iraqi context, root cause, and Iraqi-specific solutions."""

    def _register_tools(self, agent: Agent):
        pass

    async def debug_system(
        self, error_message: str, context: dict = None
    ) -> DebugAnalysis:
        """Debug system error with Iraqi context."""
        context = context or {}
        issues = []

        # Analyze main error
        main_issue = self.tools.analyze_error(error_message, context)
        issues.append(main_issue)

        # Check cultural compliance if content provided
        if context.get("content"):
            cultural_issues = self.tools.check_cultural_compliance_issues(
                context["content"]
            )
            issues.extend(cultural_issues)

        # Check Arabic rendering if text provided
        if context.get("text"):
            arabic_issues = self.tools.check_arabic_rendering_issues(context["text"])
            issues.extend(arabic_issues)

        # Check performance if metrics provided
        if context.get("execution_time_ms"):
            perf_issues = self.tools.diagnose_performance_issues(
                context["execution_time_ms"], context.get("component", "unknown")
            )
            issues.extend(perf_issues)

        # Generate recommendations
        recommendations = []
        for issue in issues:
            fixes = self.tools.suggest_fixes(issue)
            recommendations.extend(fixes)

        # Identify Iraqi-specific issues
        iraqi_specific = [
            issue.description
            for issue in issues
            if issue.iraqi_context and issue.severity in ["critical", "high"]
        ]

        # Root cause analysis
        critical_issues = [i for i in issues if i.severity == "critical"]
        if critical_issues:
            root_cause = f"Critical: {critical_issues[0].description} - {critical_issues[0].iraqi_context}"
        elif issues:
            root_cause = f"{issues[0].category.title()}: {issues[0].description}"
        else:
            root_cause = "No significant issues detected"

        return DebugAnalysis(
            issues_found=issues,
            total_issues=len(issues),
            critical_count=len(critical_issues),
            root_cause_analysis=root_cause,
            iraqi_specific_issues=iraqi_specific,
            recommendations=list(set(recommendations)),  # Deduplicate
            performance_metrics=context.get("metrics", {}),
        )

    def get_debugging_checklist(self) -> list:
        """Get Iraqi debugging checklist."""
        return self.tools.get_iraqi_debugging_checklist()


_technical_debugger_instance = None
_technical_debugger_lock = threading.Lock()


def get_technical_debugger() -> IraqiTechnicalDebugger:
    global _technical_debugger_instance
    if _technical_debugger_instance is None:
        with _technical_debugger_lock:
            if _technical_debugger_instance is None:
                _technical_debugger_instance = IraqiTechnicalDebugger()
    return _technical_debugger_instance
