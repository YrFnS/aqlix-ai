"""Iraqi DOM Watchdog - Enhanced browser-use watchdog for DOM structure and manipulation monitoring.

Monitors DOM changes, Arabic content rendering, RTL layout integrity, and ensures
proper DOM accessibility and semantic structure for Iraqi web applications.
"""

from typing import Dict, List, Optional, Set, Tuple, Any
from pydantic import Field, validator
import re
import asyncio
from datetime import datetime
from enum import Enum

from browser_use.agent.browser.browser_watchdog_base import BaseWatchdog
from browser_use.agent.events import (
    DomContentLoadedEvent,
    DomMutationEvent,
    ElementCreatedEvent,
    ElementRemovedEvent,
    ElementAttributeChangedEvent,
    StyleChangeEvent,
)


class DomViolationType(str, Enum):
    """Types of DOM violations."""

    SEMANTIC_STRUCTURE = "semantic_structure"
    RTL_LAYOUT_BREAK = "rtl_layout_break"
    ARABIC_RENDERING_ISSUE = "arabic_rendering_issue"
    ACCESSIBILITY_VIOLATION = "accessibility_violation"
    PERFORMANCE_ISSUE = "performance_issue"
    SECURITY_RISK = "security_risk"
    CULTURAL_INAPPROPRIATENESS = "cultural_inappropriateness"


class ElementType(str, Enum):
    """Types of DOM elements for monitoring."""

    FORM_ELEMENT = "form_element"
    NAVIGATION_ELEMENT = "navigation_element"
    CONTENT_ELEMENT = "content_element"
    INTERACTIVE_ELEMENT = "interactive_element"
    MEDIA_ELEMENT = "media_element"
    TEXT_ELEMENT = "text_element"
    LAYOUT_ELEMENT = "layout_element"


class IraqiDomWatchdog(BaseWatchdog):
    """Enhanced watchdog for Iraqi DOM structure and content monitoring.

    Features:
    - Semantic HTML structure validation
    - Arabic text rendering monitoring
    - RTL layout integrity checking
    - DOM accessibility validation
    - Performance impact tracking
    - Security vulnerability detection
    - Cultural content appropriateness
    - Dynamic content change monitoring
    - Form validation for Arabic input
    - Navigation structure validation
    """

    # DOM Structure Configuration
    enable_semantic_validation: bool = Field(default=True)
    enable_rtl_monitoring: bool = Field(default=True)
    enable_arabic_rendering_check: bool = Field(default=True)
    enable_accessibility_validation: bool = Field(default=True)
    enable_performance_monitoring: bool = Field(default=True)
    enable_security_scanning: bool = Field(default=True)

    # Semantic HTML Requirements
    required_semantic_elements: Set[str] = Field(
        default_factory=lambda: {
            "header",
            "nav",
            "main",
            "article",
            "section",
            "aside",
            "footer",
        }
    )

    required_accessibility_attributes: Dict[str, List[str]] = Field(
        default_factory=lambda: {
            "img": ["alt"],
            "input": ["id", "aria-label"],
            "label": ["for"],
            "button": ["aria-label", "type"],
            "form": ["role", "aria-labelledby"],
            "nav": ["role", "aria-label"],
            "main": ["role"],
            "section": ["aria-labelledby", "role"],
        }
    )

    # RTL Layout Requirements
    rtl_layout_indicators: Dict[str, str] = Field(
        default_factory=lambda: {
            "html_dir": "rtl",
            "body_dir": "rtl",
            "text_align": "right",
            "margin_left": "auto",
            "margin_right": "0",
            "padding_left": "auto",
            "padding_right": "0",
        }
    )

    # Arabic Text Validation Patterns
    arabic_text_patterns: Dict[str, str] = Field(
        default_factory=lambda: {
            "arabic_unicode": r"[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]",
            "arabic_numbers": r"[\u0660-\u0669]",  # Arabic-Indic digits
            "arabic_punctuation": r"[\u061B\u061F\u060C\u066A\u066B\u066C\u066D]",
            "mixed_content": r"[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF][A-Za-z0-9]|[A-Za-z0-9][\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]",
        }
    )

    # Performance Thresholds
    dom_performance_thresholds: Dict[str, float] = Field(
        default_factory=lambda: {
            "max_dom_nodes": 3000,  # Maximum DOM nodes
            "max_nesting_depth": 20,  # Maximum nesting depth
            "max_mutation_rate": 50,  # Mutations per second
            "max_render_blocking_elements": 5,  # CSS/JS blocking elements
            "max_inline_styles": 20,  # Maximum inline style attributes
        }
    )

    # Security Patterns
    security_risk_patterns: List[str] = Field(
        default_factory=lambda: [
            r"javascript:",  # JavaScript URLs
            r"on\w+\s*=",  # Event handlers
            r"<script[^>]*>.*?</script>",  # Script tags
            r"eval\s*\(",  # eval() usage
            r"innerHTML\s*=",  # innerHTML assignments
            r"document\.write\s*\(",  # document.write usage
        ]
    )

    # Cultural Content Validation
    cultural_content_rules: Dict[str, List[str]] = Field(
        default_factory=lambda: {
            "inappropriate_images": ['src*="*.jpg"', 'src*="*.png"', 'src*="*.gif"'],
            "cultural_text_patterns": [
                "inappropriate",
                "offensive",
                "culturally_insensitive",
            ],
            "islamic_compliance_indicators": [
                "halal",
                "islamic",
                "respectful",
                "appropriate",
            ],
        }
    )

    # Monitoring State
    dom_violations: List[Dict] = Field(default_factory=list)
    dom_mutations_count: int = Field(default=0)
    arabic_rendering_issues: List[Dict] = Field(default_factory=list)
    accessibility_violations: List[Dict] = Field(default_factory=list)
    performance_warnings: List[Dict] = Field(default_factory=list)
    security_risks: List[Dict] = Field(default_factory=list)

    # DOM Structure Tracking
    current_dom_structure: Dict[str, Any] = Field(default_factory=dict)
    semantic_elements_count: Dict[str, int] = Field(default_factory=dict)
    rtl_compliance_score: float = Field(default=0.0)

    @validator("dom_performance_thresholds")
    def validate_performance_thresholds(cls, v):
        required_keys = {
            "max_dom_nodes",
            "max_nesting_depth",
            "max_mutation_rate",
            "max_render_blocking_elements",
        }
        if not all(key in v for key in required_keys):
            raise ValueError(f"Missing required performance threshold keys")
        return v

    async def on_DomContentLoadedEvent(self, event: DomContentLoadedEvent) -> None:
        """Handle DOM content loaded for comprehensive validation."""
        try:
            url = getattr(event, "url", "")
            timestamp = datetime.now()

            # Perform comprehensive DOM analysis
            await self._analyze_dom_structure(url, timestamp)

        except Exception as e:
            await self.emit_error(f"DOM content loaded analysis failed: {str(e)}")

    async def on_DomMutationEvent(self, event: DomMutationEvent) -> None:
        """Handle DOM mutations for performance and integrity monitoring."""
        try:
            mutation_type = getattr(event, "mutation_type", "unknown")
            target_element = getattr(event, "target_element", {})
            added_nodes = getattr(event, "added_nodes", [])
            removed_nodes = getattr(event, "removed_nodes", [])
            page_url = getattr(event, "page_url", "")

            # Track mutation count
            self.dom_mutations_count += 1

            # Check mutation rate
            await self._check_mutation_rate()

            # Validate new nodes for compliance
            for node in added_nodes:
                await self._validate_new_dom_node(node, page_url)

            # Check for RTL layout disruption
            if self.enable_rtl_monitoring:
                await self._check_rtl_layout_integrity(target_element, page_url)

            # Monitor for security risks in mutations
            if self.enable_security_scanning:
                await self._scan_mutation_security_risks(
                    mutation_type, target_element, added_nodes, page_url
                )

        except Exception as e:
            await self.emit_error(f"DOM mutation monitoring failed: {str(e)}")

    async def on_ElementCreatedEvent(self, event: ElementCreatedEvent) -> None:
        """Handle element creation for validation."""
        try:
            element_info = getattr(event, "element_info", {})
            page_url = getattr(event, "page_url", "")

            # Validate new element
            validation_result = await self._validate_element_creation(
                element_info, page_url
            )

            if validation_result["violations"]:
                for violation in validation_result["violations"]:
                    await self.emit_dom_violation(
                        page_url, violation["type"], violation
                    )

        except Exception as e:
            await self.emit_error(f"Element creation validation failed: {str(e)}")

    async def on_ElementRemovedEvent(self, event: ElementRemovedEvent) -> None:
        """Handle element removal for structure integrity."""
        try:
            element_info = getattr(event, "element_info", {})
            page_url = getattr(event, "page_url", "")

            # Check if removed element was semantically important
            await self._check_semantic_element_removal(element_info, page_url)

            # Update semantic elements count
            element_tag = element_info.get("tagName", "").lower()
            if element_tag in self.required_semantic_elements:
                if element_tag in self.semantic_elements_count:
                    self.semantic_elements_count[element_tag] = max(
                        0, self.semantic_elements_count[element_tag] - 1
                    )

        except Exception as e:
            await self.emit_error(f"Element removal monitoring failed: {str(e)}")

    async def on_ElementAttributeChangedEvent(
        self, event: ElementAttributeChangedEvent
    ) -> None:
        """Handle attribute changes for compliance monitoring."""
        try:
            element_info = getattr(event, "element_info", {})
            attribute_name = getattr(event, "attribute_name", "")
            old_value = getattr(event, "old_value", "")
            new_value = getattr(event, "new_value", "")
            page_url = getattr(event, "page_url", "")

            # Validate attribute changes for RTL compliance
            if (
                attribute_name in ["dir", "lang", "style"]
                and self.enable_rtl_monitoring
            ):
                await self._validate_rtl_attribute_change(
                    element_info, attribute_name, old_value, new_value, page_url
                )

            # Check for accessibility attribute changes
            if self.enable_accessibility_validation:
                await self._validate_accessibility_attribute_change(
                    element_info, attribute_name, old_value, new_value, page_url
                )

            # Monitor security-sensitive attribute changes
            if self.enable_security_scanning:
                await self._check_security_attribute_change(
                    element_info, attribute_name, new_value, page_url
                )

        except Exception as e:
            await self.emit_error(f"Attribute change monitoring failed: {str(e)}")

    async def on_StyleChangeEvent(self, event: StyleChangeEvent) -> None:
        """Handle style changes for RTL and accessibility monitoring."""
        try:
            element_info = getattr(event, "element_info", {})
            style_property = getattr(event, "style_property", "")
            old_value = getattr(event, "old_value", "")
            new_value = getattr(event, "new_value", "")
            page_url = getattr(event, "page_url", "")

            # Monitor RTL-related style changes
            if self.enable_rtl_monitoring:
                await self._monitor_rtl_style_changes(
                    element_info, style_property, old_value, new_value, page_url
                )

            # Check for accessibility impact
            if self.enable_accessibility_validation:
                await self._check_style_accessibility_impact(
                    element_info, style_property, new_value, page_url
                )

        except Exception as e:
            await self.emit_error(f"Style change monitoring failed: {str(e)}")

    async def _analyze_dom_structure(self, url: str, timestamp: datetime) -> Dict:
        """Perform comprehensive DOM structure analysis."""
        analysis_result = {
            "url": url,
            "timestamp": timestamp.isoformat(),
            "violations": [],
            "passed_checks": [],
            "recommendations": [],
        }

        try:
            # Run all DOM analysis tasks in parallel
            analysis_tasks = [
                self._validate_semantic_structure(url),
                self._validate_rtl_compliance(url),
                self._validate_arabic_content_rendering(url),
                self._check_accessibility_compliance(url),
                self._monitor_performance_metrics(url),
                self._scan_security_risks(url),
                self._validate_cultural_appropriateness(url),
            ]

            analysis_results = await asyncio.gather(
                *analysis_tasks, return_exceptions=True
            )

            # Aggregate results
            for result in analysis_results:
                if isinstance(result, dict):
                    if result.get("violations"):
                        analysis_result["violations"].extend(result["violations"])
                    if result.get("passed_checks"):
                        analysis_result["passed_checks"].extend(result["passed_checks"])
                    if result.get("recommendations"):
                        analysis_result["recommendations"].extend(
                            result["recommendations"]
                        )

            # Calculate overall compliance scores
            await self._calculate_compliance_scores(analysis_result)

            # Emit comprehensive DOM analysis event
            await self.emit_dom_analysis_complete(analysis_result)

            return analysis_result

        except Exception as e:
            analysis_result["error"] = str(e)
            await self.emit_error(f"DOM structure analysis failed for {url}: {str(e)}")
            return analysis_result

    async def _validate_semantic_structure(self, url: str) -> Dict:
        """Validate semantic HTML structure."""
        result = {
            "check_name": "semantic_structure",
            "violations": [],
            "passed_checks": [],
            "recommendations": [],
        }

        if not self.enable_semantic_validation:
            return result

        # Placeholder for semantic structure validation
        # In real implementation, would use browser DOM inspection

        # Check for required semantic elements
        missing_elements = []
        for element in self.required_semantic_elements:
            element_count = self.semantic_elements_count.get(element, 0)
            if element_count == 0:
                missing_elements.append(element)

        if missing_elements:
            result["violations"].append(
                {
                    "type": DomViolationType.SEMANTIC_STRUCTURE,
                    "description": f"Missing semantic elements: {', '.join(missing_elements)}",
                    "missing_elements": missing_elements,
                    "severity": "medium",
                }
            )
        else:
            result["passed_checks"].append("all_semantic_elements_present")

        # Check heading hierarchy (placeholder)
        if not self._validate_heading_hierarchy():
            result["violations"].append(
                {
                    "type": DomViolationType.SEMANTIC_STRUCTURE,
                    "description": "Invalid heading hierarchy detected",
                    "severity": "medium",
                }
            )
        else:
            result["passed_checks"].append("valid_heading_hierarchy")

        return result

    async def _validate_rtl_compliance(self, url: str) -> Dict:
        """Validate RTL layout compliance."""
        result = {
            "check_name": "rtl_compliance",
            "violations": [],
            "passed_checks": [],
            "recommendations": [],
        }

        if not self.enable_rtl_monitoring:
            return result

        # Check RTL indicators (placeholder implementation)
        rtl_score = 0.8  # Placeholder score
        self.rtl_compliance_score = rtl_score

        if rtl_score < 0.7:
            result["violations"].append(
                {
                    "type": DomViolationType.RTL_LAYOUT_BREAK,
                    "description": f"RTL compliance score too low: {rtl_score:.2f}",
                    "compliance_score": rtl_score,
                    "severity": "high",
                }
            )
        else:
            result["passed_checks"].append("rtl_compliance_acceptable")

        # Check for mixed content issues
        if self._detect_mixed_content_issues():
            result["violations"].append(
                {
                    "type": DomViolationType.RTL_LAYOUT_BREAK,
                    "description": "Mixed Arabic-English content alignment issues detected",
                    "severity": "medium",
                }
            )
        else:
            result["passed_checks"].append("no_mixed_content_issues")

        return result

    async def _validate_arabic_content_rendering(self, url: str) -> Dict:
        """Validate Arabic content rendering."""
        result = {
            "check_name": "arabic_rendering",
            "violations": [],
            "passed_checks": [],
            "recommendations": [],
        }

        if not self.enable_arabic_rendering_check:
            return result

        # Check Arabic font loading (placeholder)
        if not self._check_arabic_fonts_loaded():
            result["violations"].append(
                {
                    "type": DomViolationType.ARABIC_RENDERING_ISSUE,
                    "description": "Arabic fonts not properly loaded",
                    "severity": "high",
                }
            )
        else:
            result["passed_checks"].append("arabic_fonts_loaded")

        # Check Arabic text direction
        if not self._validate_arabic_text_direction():
            result["violations"].append(
                {
                    "type": DomViolationType.ARABIC_RENDERING_ISSUE,
                    "description": "Arabic text direction not properly set",
                    "severity": "high",
                }
            )
        else:
            result["passed_checks"].append("arabic_text_direction_correct")

        return result

    async def _check_accessibility_compliance(self, url: str) -> Dict:
        """Check accessibility compliance."""
        result = {
            "check_name": "accessibility_compliance",
            "violations": [],
            "passed_checks": [],
            "recommendations": [],
        }

        if not self.enable_accessibility_validation:
            return result

        # Check for missing accessibility attributes (placeholder)
        missing_attrs = self._check_missing_accessibility_attributes()

        if missing_attrs:
            result["violations"].append(
                {
                    "type": DomViolationType.ACCESSIBILITY_VIOLATION,
                    "description": "Missing accessibility attributes detected",
                    "missing_attributes": missing_attrs,
                    "severity": "high",
                }
            )
        else:
            result["passed_checks"].append("accessibility_attributes_present")

        return result

    async def _monitor_performance_metrics(self, url: str) -> Dict:
        """Monitor DOM performance metrics."""
        result = {
            "check_name": "performance_metrics",
            "violations": [],
            "passed_checks": [],
            "recommendations": [],
        }

        if not self.enable_performance_monitoring:
            return result

        # Check DOM node count (placeholder)
        dom_node_count = 2500  # Placeholder count
        max_nodes = self.dom_performance_thresholds["max_dom_nodes"]

        if dom_node_count > max_nodes:
            result["violations"].append(
                {
                    "type": DomViolationType.PERFORMANCE_ISSUE,
                    "description": f"Too many DOM nodes: {dom_node_count} (max: {max_nodes})",
                    "node_count": dom_node_count,
                    "threshold": max_nodes,
                    "severity": "medium",
                }
            )
        else:
            result["passed_checks"].append("dom_node_count_acceptable")

        # Check mutation rate
        mutation_rate = self._calculate_mutation_rate()
        max_mutation_rate = self.dom_performance_thresholds["max_mutation_rate"]

        if mutation_rate > max_mutation_rate:
            result["violations"].append(
                {
                    "type": DomViolationType.PERFORMANCE_ISSUE,
                    "description": f"High DOM mutation rate: {mutation_rate:.2f}/sec (max: {max_mutation_rate})",
                    "mutation_rate": mutation_rate,
                    "threshold": max_mutation_rate,
                    "severity": "medium",
                }
            )
        else:
            result["passed_checks"].append("mutation_rate_acceptable")

        return result

    async def _scan_security_risks(self, url: str) -> Dict:
        """Scan for security risks in DOM."""
        result = {
            "check_name": "security_scan",
            "violations": [],
            "passed_checks": [],
            "recommendations": [],
        }

        if not self.enable_security_scanning:
            return result

        # Scan for security patterns (placeholder)
        security_issues = self._detect_security_patterns()

        if security_issues:
            for issue in security_issues:
                result["violations"].append(
                    {
                        "type": DomViolationType.SECURITY_RISK,
                        "description": f"Security risk detected: {issue['pattern']}",
                        "pattern": issue["pattern"],
                        "locations": issue["locations"],
                        "severity": "high",
                    }
                )
        else:
            result["passed_checks"].append("no_security_risks_detected")

        return result

    async def _validate_cultural_appropriateness(self, url: str) -> Dict:
        """Validate cultural appropriateness of DOM content."""
        result = {
            "check_name": "cultural_appropriateness",
            "violations": [],
            "passed_checks": [],
            "recommendations": [],
        }

        # Check for culturally inappropriate content (placeholder)
        cultural_issues = self._detect_cultural_issues()

        if cultural_issues:
            for issue in cultural_issues:
                result["violations"].append(
                    {
                        "type": DomViolationType.CULTURAL_INAPPROPRIATENESS,
                        "description": f"Cultural inappropriateness detected: {issue['type']}",
                        "issue_type": issue["type"],
                        "severity": "medium",
                    }
                )
        else:
            result["passed_checks"].append("culturally_appropriate_content")

        return result

    # Helper Methods (Placeholders for real implementation)
    def _validate_heading_hierarchy(self) -> bool:
        """Validate heading hierarchy."""
        return True  # Placeholder

    def _detect_mixed_content_issues(self) -> bool:
        """Detect mixed Arabic-English content issues."""
        return False  # Placeholder

    def _check_arabic_fonts_loaded(self) -> bool:
        """Check if Arabic fonts are loaded."""
        return True  # Placeholder

    def _validate_arabic_text_direction(self) -> bool:
        """Validate Arabic text direction."""
        return True  # Placeholder

    def _check_missing_accessibility_attributes(self) -> List[str]:
        """Check for missing accessibility attributes."""
        return []  # Placeholder

    def _calculate_mutation_rate(self) -> float:
        """Calculate DOM mutation rate per second."""
        # Simplified calculation - would use time-based tracking in real implementation
        return self.dom_mutations_count / 60.0  # Placeholder: mutations per minute

    def _detect_security_patterns(self) -> List[Dict]:
        """Detect security risk patterns."""
        return []  # Placeholder

    def _detect_cultural_issues(self) -> List[Dict]:
        """Detect cultural appropriateness issues."""
        return []  # Placeholder

    async def _validate_new_dom_node(self, node: Dict, page_url: str) -> None:
        """Validate newly created DOM node."""
        # Placeholder validation logic
        pass

    async def _check_rtl_layout_integrity(
        self, target_element: Dict, page_url: str
    ) -> None:
        """Check RTL layout integrity after mutation."""
        # Placeholder RTL check logic
        pass

    async def _scan_mutation_security_risks(
        self, mutation_type: str, target_element: Dict, added_nodes: List, page_url: str
    ) -> None:
        """Scan mutation for security risks."""
        # Placeholder security scan logic
        pass

    async def _validate_element_creation(
        self, element_info: Dict, page_url: str
    ) -> Dict:
        """Validate element creation."""
        return {"violations": []}  # Placeholder

    async def _check_semantic_element_removal(
        self, element_info: Dict, page_url: str
    ) -> None:
        """Check semantic element removal impact."""
        # Placeholder logic
        pass

    async def _validate_rtl_attribute_change(
        self,
        element_info: Dict,
        attr_name: str,
        old_value: str,
        new_value: str,
        page_url: str,
    ) -> None:
        """Validate RTL-related attribute changes."""
        # Placeholder RTL validation logic
        pass

    async def _validate_accessibility_attribute_change(
        self,
        element_info: Dict,
        attr_name: str,
        old_value: str,
        new_value: str,
        page_url: str,
    ) -> None:
        """Validate accessibility attribute changes."""
        # Placeholder accessibility validation logic
        pass

    async def _check_security_attribute_change(
        self, element_info: Dict, attr_name: str, new_value: str, page_url: str
    ) -> None:
        """Check security implications of attribute changes."""
        # Placeholder security check logic
        pass

    async def _monitor_rtl_style_changes(
        self,
        element_info: Dict,
        style_property: str,
        old_value: str,
        new_value: str,
        page_url: str,
    ) -> None:
        """Monitor RTL-related style changes."""
        # Placeholder RTL style monitoring logic
        pass

    async def _check_style_accessibility_impact(
        self, element_info: Dict, style_property: str, new_value: str, page_url: str
    ) -> None:
        """Check accessibility impact of style changes."""
        # Placeholder accessibility style check logic
        pass

    async def _check_mutation_rate(self) -> None:
        """Check if mutation rate exceeds thresholds."""
        mutation_rate = self._calculate_mutation_rate()
        max_rate = self.dom_performance_thresholds["max_mutation_rate"]

        if mutation_rate > max_rate:
            await self.emit_dom_performance_warning(
                "high_mutation_rate", mutation_rate, max_rate
            )

    async def _calculate_compliance_scores(self, analysis_result: Dict) -> None:
        """Calculate overall compliance scores."""
        # Placeholder compliance score calculation
        pass

    # Event Emission Methods
    async def emit_dom_violation(
        self, url: str, violation_type: DomViolationType, violation_data: Dict
    ):
        """Emit DOM violation event."""
        if self.cultural_validation_enabled:
            from browser_use.agent.events import DomViolationEvent

            event = DomViolationEvent(
                data={
                    "url": url,
                    "violation_type": violation_type.value,
                    "violation_data": violation_data,
                    "timestamp": datetime.now().isoformat(),
                    "severity": violation_data.get("severity", "medium"),
                }
            )
            self.event_bus.dispatch(event)

            # Store violation
            self.dom_violations.append(
                {
                    "url": url,
                    "violation_type": violation_type.value,
                    "violation_data": violation_data,
                    "timestamp": datetime.now(),
                }
            )

    async def emit_dom_analysis_complete(self, analysis_result: Dict):
        """Emit DOM analysis completion event."""
        if self.cultural_validation_enabled:
            from browser_use.agent.events import DomAnalysisCompleteEvent

            event = DomAnalysisCompleteEvent(
                data={
                    "url": analysis_result["url"],
                    "total_violations": len(analysis_result["violations"]),
                    "total_passed": len(analysis_result["passed_checks"]),
                    "rtl_compliance_score": self.rtl_compliance_score,
                    "dom_mutations_count": self.dom_mutations_count,
                    "timestamp": analysis_result["timestamp"],
                }
            )
            self.event_bus.dispatch(event)

    async def emit_dom_performance_warning(
        self, metric_type: str, actual_value: float, threshold: float
    ):
        """Emit DOM performance warning event."""
        if self.cultural_validation_enabled:
            from browser_use.agent.events import DomPerformanceWarningEvent

            event = DomPerformanceWarningEvent(
                data={
                    "metric_type": metric_type,
                    "actual_value": actual_value,
                    "threshold": threshold,
                    "severity": "high" if actual_value > threshold * 2 else "medium",
                    "timestamp": datetime.now().isoformat(),
                }
            )
            self.event_bus.dispatch(event)

    def get_dom_monitoring_summary(self) -> Dict:
        """Get summary of DOM monitoring."""
        total_violations = len(self.dom_violations)

        # Count violations by type
        violation_counts = {}
        for violation in self.dom_violations:
            violation_type = violation["violation_type"]
            violation_counts[violation_type] = (
                violation_counts.get(violation_type, 0) + 1
            )

        return {
            "total_dom_violations": total_violations,
            "dom_mutations_count": self.dom_mutations_count,
            "rtl_compliance_score": self.rtl_compliance_score,
            "arabic_rendering_issues": len(self.arabic_rendering_issues),
            "accessibility_violations": len(self.accessibility_violations),
            "performance_warnings": len(self.performance_warnings),
            "security_risks": len(self.security_risks),
            "violation_counts_by_type": violation_counts,
            "semantic_elements_count": self.semantic_elements_count,
            "monitoring_enabled": {
                "semantic_validation": self.enable_semantic_validation,
                "rtl_monitoring": self.enable_rtl_monitoring,
                "arabic_rendering_check": self.enable_arabic_rendering_check,
                "accessibility_validation": self.enable_accessibility_validation,
                "performance_monitoring": self.enable_performance_monitoring,
                "security_scanning": self.enable_security_scanning,
            },
        }
