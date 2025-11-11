"""Technical Debugger Tools"""

from typing import List, Dict, Any
from apps.api.agents.technical.debugger.models import DebugIssue


class DebuggerTools:
    """Tools for Iraqi technical debugging."""

    IRAQI_COMMON_ISSUES = {
        "arabic_encoding": {
            "description": "Arabic text showing as question marks or garbled",
            "root_cause": "UTF-8 encoding not set or database charset issue",
            "solution": "Ensure UTF-8 encoding: charset='utf8mb4', Content-Type: text/html; charset=UTF-8",
        },
        "rtl_layout_broken": {
            "description": "RTL layout not rendering correctly",
            "root_cause": "Missing dir='rtl' or incorrect CSS flex/grid direction",
            "solution": "Add dir='rtl' to HTML element, use flex-direction: row-reverse for RTL",
        },
        "payment_gateway_timeout": {
            "description": "ZainCash/FastPay/NassWallet timeout errors",
            "root_cause": "Iraqi infrastructure network instability",
            "solution": "Increase timeout to 30s+, implement retry with exponential backoff",
        },
        "cultural_validation_failure": {
            "description": "Cultural appropriateness score < 95%",
            "root_cause": "Content not validated against Iraqi cultural standards",
            "solution": "Use iraqi-cultural-validator before displaying content",
        },
        "prayer_time_conflict": {
            "description": "Scheduled tasks running during prayer times",
            "root_cause": "Not accounting for 5 daily prayer times in Iraq",
            "solution": "Implement prayer time awareness using Baghdad timezone (UTC+3)",
        },
    }

    # Category to IRAQI_COMMON_ISSUES key mapping
    CATEGORY_TO_ISSUE_KEY = {
        "arabic_rendering": "arabic_encoding",
        "rtl_layout": "rtl_layout_broken",
        "payment_gateway": "payment_gateway_timeout",
        "cultural_compliance": "cultural_validation_failure",
        "prayer_time": "prayer_time_conflict",
        "infrastructure": "payment_gateway_timeout",  # Infrastructure maps to timeout guidance
    }

    @staticmethod
    def analyze_error(error_message: str, context: Dict[str, Any]) -> DebugIssue:
        """Analyze error with Iraqi context awareness."""
        severity = "high"
        category = "agent_error"
        iraqi_context = None

        # Check for Iraqi-specific issues
        if "encoding" in error_message.lower() or "utf" in error_message.lower():
            category = "arabic_rendering"
            severity = "high"
            iraqi_context = "Arabic text encoding issue - common in Iraqi systems"

        elif (
            "timeout" in error_message.lower() or "connection" in error_message.lower()
        ):
            category = "infrastructure"
            severity = "medium"
            iraqi_context = "Network timeout - Iraqi infrastructure instability"

        elif (
            "zaincash" in error_message.lower()
            or "fastpay" in error_message.lower()
            or "payment" in error_message.lower()
        ):
            category = "payment_gateway"
            severity = "critical"
            iraqi_context = "Iraqi payment gateway error - affects transactions"

        elif (
            "cultural" in error_message.lower() or "compliance" in error_message.lower()
        ):
            category = "cultural_compliance"
            severity = "critical"
            iraqi_context = "Cultural compliance failure - must be fixed"

        # Use uuid for stable, unique IDs (FIX #2: Hash Collision)
        import uuid

        issue_id_uuid = uuid.uuid5(uuid.NAMESPACE_DNS, error_message)
        issue_id = f"DBG-{str(issue_id_uuid)[:8].upper()}"

        return DebugIssue(
            issue_id=issue_id,
            severity=severity,
            category=category,
            description=error_message,
            iraqi_context=iraqi_context,
            affected_components=context.get("components", []),
            reproduction_steps=context.get("steps", []),
        )

    @staticmethod
    def check_cultural_compliance_issues(
        content: str,
    ) -> List[DebugIssue]:
        """Check for cultural compliance issues."""
        issues = []

        # Check for prohibited content
        prohibited = ["alcohol", "gambling", "pork", "interest", "riba"]
        for word in prohibited:
            if word in content.lower():
                # Use uuid for stable, unique IDs (FIX #2: Hash Collision)
                import uuid

                issue_id_uuid = uuid.uuid5(uuid.NAMESPACE_DNS, f"cultural_{word}")
                issue_id = f"CULT-{str(issue_id_uuid)[:6].upper()}"

                issues.append(
                    DebugIssue(
                        issue_id=issue_id,
                        severity="critical",
                        category="cultural_compliance",
                        description=f"Prohibited content detected: {word}",
                        iraqi_context="Islamic compliance violation - 100% compliance required",
                        affected_components=["content_validator"],
                        reproduction_steps=[
                            f"Content contains '{word}'",
                            "Run through cultural validator",
                        ],
                    )
                )

        return issues

    @staticmethod
    def check_arabic_rendering_issues(text: str) -> List[DebugIssue]:
        """Check for Arabic rendering issues."""
        issues = []

        # Check for Arabic characters
        has_arabic = any("\u0600" <= c <= "\u06ff" for c in text)

        if has_arabic:
            # Check if RTL markers present
            has_rtl_marker = "\u202b" in text or "\u202a" in text
            if not has_rtl_marker:
                issues.append(
                    DebugIssue(
                        issue_id="RTL-001",
                        severity="medium",
                        category="arabic_rendering",
                        description="Arabic text without RTL direction markers",
                        iraqi_context="Arabic text may render incorrectly without proper RTL formatting",
                        affected_components=["arabic_processor"],
                        reproduction_steps=[
                            "Render Arabic text without dir='rtl'",
                            "Text direction will be incorrect",
                        ],
                    )
                )

        return issues

    @staticmethod
    def diagnose_performance_issues(
        execution_time_ms: float, component: str
    ) -> List[DebugIssue]:
        """Diagnose performance issues with Iraqi infrastructure context."""
        issues = []

        # Cultural validation should be <200ms
        if component == "cultural_validator" and execution_time_ms > 200:
            issues.append(
                DebugIssue(
                    issue_id="PERF-CULT-001",
                    severity="medium",
                    category="performance",
                    description=f"Cultural validation took {execution_time_ms}ms (target: <200ms)",
                    iraqi_context="Slow cultural validation impacts user experience",
                    affected_components=["cultural_validator"],
                    reproduction_steps=[
                        "Run cultural validator",
                        "Measure execution time",
                    ],
                )
            )

        # Payment gateway should complete <5000ms
        if "payment" in component.lower() and execution_time_ms > 5000:
            issues.append(
                DebugIssue(
                    issue_id="PERF-PAY-001",
                    severity="high",
                    category="payment_gateway",
                    description=f"Payment gateway took {execution_time_ms}ms (target: <5000ms)",
                    iraqi_context="Iraqi payment gateways can be slow - may need timeout increase",
                    affected_components=[component],
                    reproduction_steps=[
                        "Initiate payment transaction",
                        "Monitor response time",
                    ],
                )
            )

        return issues

    @staticmethod
    def get_iraqi_debugging_checklist() -> List[str]:
        """Get Iraqi-specific debugging checklist."""
        return [
            "✓ UTF-8 encoding set for Arabic text",
            "✓ dir='rtl' attribute for Arabic content",
            "✓ Cultural validation passing (95%+ score)",
            "✓ Islamic compliance check (100% required)",
            "✓ Payment gateway timeout >= 30 seconds",
            "✓ Retry logic for Iraqi infrastructure",
            "✓ Prayer time awareness implemented",
            "✓ Arabic RTL formatting with Unicode markers",
            "✓ Iraqi timezone (Asia/Baghdad UTC+3) configured",
            "✓ Offline-first design for unstable connections",
        ]

    @staticmethod
    def suggest_fixes(issue: DebugIssue) -> List[str]:
        """Suggest fixes for Iraqi technical issues."""
        # FIX #1: Use category-to-key mapping for proper lookup
        issue_key = DebuggerTools.CATEGORY_TO_ISSUE_KEY.get(issue.category)
        common_issue = (
            DebuggerTools.IRAQI_COMMON_ISSUES.get(issue_key, {}) if issue_key else {}
        )

        suggestions = []

        if issue.category == "arabic_rendering":
            suggestions = [
                "Set UTF-8 encoding: <meta charset='UTF-8'>",
                "Add dir='rtl' to HTML elements with Arabic",
                "Use Unicode RTL markers: \\u202B (RLE) and \\u202C (PDF)",
                "Apply font-arabic class for proper Arabic typography",
            ]

        elif issue.category == "payment_gateway":
            suggestions = [
                "Increase timeout to 30+ seconds for Iraqi gateways",
                "Implement exponential backoff retry (max 3 retries)",
                "Add payment status polling for async completion",
                "Use multi-gateway fallback (ZainCash → FastPay → NassWallet)",
            ]

        elif issue.category == "cultural_compliance":
            suggestions = [
                "Run content through iraqi-cultural-validator",
                "Remove prohibited content (alcohol, gambling, interest)",
                "Validate Islamic compliance score = 100%",
                "Use appropriate Iraqi Arabic dialect",
            ]

        elif issue.category == "infrastructure":
            suggestions = [
                "Design for offline-first functionality",
                "Cache critical data locally",
                "Implement service worker for PWA",
                "Add connection status indicators",
            ]

        # Add common issue guidance if available
        if common_issue:
            suggestions.insert(
                0, f"Root cause: {common_issue.get('root_cause', 'Unknown')}"
            )
            suggestions.append(
                f"Recommended solution: {common_issue.get('solution', 'See documentation')}"
            )

        return suggestions or ["Consult Iraqi technical documentation"]
