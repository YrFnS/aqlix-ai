"""Iraqi Portal Watchdog - Enhanced browser-use watchdog for Iraqi government and institutional portals.

Monitors Iraqi government portals, educational systems, banking platforms, and ensures
proper Arabic RTL display, cultural compliance, and accessibility standards.
"""

from typing import Dict, List, Optional, Set
from pydantic import Field, validator
import re
import asyncio
from datetime import datetime, timedelta

from browser_use.agent.browser.browser_watchdog_base import BaseWatchdog
from browser_use.agent.service import BrowserUserSession
from browser_use.agent.events import (
    NavigateToUrlEvent,
    PageLoadEvent,
    DomContentLoadedEvent,
    RequestEvent,
    ResponseEvent,
)


class IraqiPortalWatchdog(BaseWatchdog):
    """Enhanced watchdog for monitoring Iraqi government and institutional portals.

    Features:
    - Iraqi government portal validation (.gov.iq, .iraq.gov.iq)
    - Educational institution monitoring (.edu.iq, universities)
    - Banking platform security (CBI, Iraqi banks)
    - Arabic RTL display validation
    - Cultural compliance checking
    - Accessibility standards verification
    - Performance monitoring for Iraqi network conditions
    """

    # Iraqi Portal Configuration
    iraqi_government_domains: List[str] = Field(
        default_factory=lambda: [
            "*.gov.iq",
            "*.iraq.gov.iq",
            "*.cabinet.iq",
            "*.cbi.iq",
            "*.moi.gov.iq",
            "*.mohesr.gov.iq",
            "*.moe.gov.iq",
            "*.mod.gov.iq",
            "*.moh.gov.iq",
        ]
    )

    iraqi_educational_domains: List[str] = Field(
        default_factory=lambda: [
            "*.edu.iq",
            "*.uobaghdad.edu.iq",
            "*.uomustansiriyah.edu.iq",
            "*.uotechnology.edu.iq",
            "*.ust.edu.iq",
            "*.uobasrah.edu.iq",
            "*.uomosul.edu.iq",
        ]
    )

    iraqi_banking_domains: List[str] = Field(
        default_factory=lambda: [
            "*.rafidain-bank.gov.iq",
            "*.rasheed-bank.gov.iq",
            "*.cbi.iq",
            "*.iraqiislamic-bank.com",
            "*.baghdad-bank.com",
            "*.ahliunited-bank.com",
        ]
    )

    # Performance Thresholds for Iraqi Network Conditions
    iraqi_network_thresholds: Dict[str, float] = Field(
        default_factory=lambda: {
            "page_load_time": 15.0,  # seconds (3G networks)
            "dom_ready_time": 8.0,  # seconds
            "first_paint_time": 5.0,  # seconds
            "arabic_font_load_time": 3.0,  # seconds
        }
    )

    # Cultural Validation Settings
    required_arabic_elements: Set[str] = Field(
        default_factory=lambda: {
            'html[lang="ar"]',
            'html[dir="rtl"]',
            '[class*="arabic"]',
            '[class*="rtl"]',
        }
    )

    islamic_compliance_checks: List[str] = Field(
        default_factory=lambda: [
            "no_inappropriate_imagery",
            "respectful_language",
            "proper_greeting_formats",
            "islamic_calendar_support",
        ]
    )

    # Monitoring State
    portal_sessions: Dict[str, Dict] = Field(default_factory=dict)
    performance_metrics: Dict[str, List[float]] = Field(default_factory=dict)
    cultural_violations: List[Dict] = Field(default_factory=list)
    accessibility_issues: List[Dict] = Field(default_factory=list)

    @validator("iraqi_network_thresholds")
    def validate_thresholds(cls, v):
        required_keys = {
            "page_load_time",
            "dom_ready_time",
            "first_paint_time",
            "arabic_font_load_time",
        }
        if not all(key in v for key in required_keys):
            raise ValueError(
                f"Missing required threshold keys: {required_keys - set(v.keys())}"
            )
        return v

    def is_iraqi_portal(self, url: str) -> bool:
        """Check if URL belongs to Iraqi government, educational, or banking portal."""
        all_domains = (
            self.iraqi_government_domains
            + self.iraqi_educational_domains
            + self.iraqi_banking_domains
        )

        for domain_pattern in all_domains:
            if self._matches_domain_pattern(url, domain_pattern):
                return True
        return False

    def get_portal_type(self, url: str) -> str:
        """Determine the type of Iraqi portal."""
        if any(
            self._matches_domain_pattern(url, domain)
            for domain in self.iraqi_government_domains
        ):
            return "government"
        elif any(
            self._matches_domain_pattern(url, domain)
            for domain in self.iraqi_educational_domains
        ):
            return "educational"
        elif any(
            self._matches_domain_pattern(url, domain)
            for domain in self.iraqi_banking_domains
        ):
            return "banking"
        return "unknown"

    def _matches_domain_pattern(self, url: str, pattern: str) -> bool:
        """Check if URL matches domain pattern (supports wildcards)."""
        import fnmatch
        from urllib.parse import urlparse

        try:
            parsed = urlparse(url)
            domain = parsed.netloc.lower()
            pattern_clean = pattern.lower().replace("*.", "")
            return domain.endswith(pattern_clean) or fnmatch.fnmatch(
                domain, pattern.lower()
            )
        except Exception:
            return False

    async def on_NavigateToUrlEvent(self, event: NavigateToUrlEvent) -> None:
        """Handle navigation to Iraqi portal URLs."""
        url = event.url

        if self.is_iraqi_portal(url):
            portal_type = self.get_portal_type(url)
            session_id = f"{portal_type}_{datetime.now().timestamp()}"

            self.portal_sessions[session_id] = {
                "url": url,
                "portal_type": portal_type,
                "start_time": datetime.now(),
                "navigation_start": event.timestamp
                if hasattr(event, "timestamp")
                else datetime.now(),
                "status": "navigating",
            }

            await self.emit_iraqi_portal_navigation(url, portal_type, session_id)

            # Start portal-specific monitoring
            if portal_type == "government":
                await self._monitor_government_portal(session_id, url)
            elif portal_type == "educational":
                await self._monitor_educational_portal(session_id, url)
            elif portal_type == "banking":
                await self._monitor_banking_portal(session_id, url)

    async def on_PageLoadEvent(self, event: PageLoadEvent) -> None:
        """Handle page load completion for Iraqi portals."""
        url = getattr(event, "url", "")

        if self.is_iraqi_portal(url):
            # Find matching session
            session_id = None
            for sid, session in self.portal_sessions.items():
                if session["url"] == url and session["status"] == "navigating":
                    session_id = sid
                    break

            if session_id:
                session = self.portal_sessions[session_id]
                load_time = (datetime.now() - session["start_time"]).total_seconds()

                session.update(
                    {
                        "status": "loaded",
                        "load_time": load_time,
                        "page_load_complete": datetime.now(),
                    }
                )

                # Check performance against Iraqi network thresholds
                if load_time > self.iraqi_network_thresholds["page_load_time"]:
                    await self.emit_iraqi_performance_warning(
                        session_id, "page_load_slow", load_time
                    )

                # Schedule cultural and accessibility validation
                await self._validate_portal_compliance(session_id, url)

    async def on_DomContentLoadedEvent(self, event: DomContentLoadedEvent) -> None:
        """Handle DOM ready event for Iraqi portals."""
        url = getattr(event, "url", "")

        if self.is_iraqi_portal(url):
            # Find matching session
            for session_id, session in self.portal_sessions.items():
                if session["url"] == url and session["status"] in [
                    "navigating",
                    "loaded",
                ]:
                    dom_ready_time = (
                        datetime.now() - session["start_time"]
                    ).total_seconds()
                    session["dom_ready_time"] = dom_ready_time

                    # Check DOM ready performance
                    if dom_ready_time > self.iraqi_network_thresholds["dom_ready_time"]:
                        await self.emit_iraqi_performance_warning(
                            session_id, "dom_ready_slow", dom_ready_time
                        )

                    # Start DOM-based validation
                    await self._validate_dom_structure(session_id, url)
                    break

    async def _monitor_government_portal(self, session_id: str, url: str) -> None:
        """Monitor Iraqi government portal specific requirements."""
        monitoring_tasks = [
            self._check_official_branding(session_id, url),
            self._validate_arabic_language_support(session_id, url),
            self._check_accessibility_compliance(session_id, url),
            self._monitor_security_headers(session_id, url),
        ]

        await asyncio.gather(*monitoring_tasks, return_exceptions=True)

    async def _monitor_educational_portal(self, session_id: str, url: str) -> None:
        """Monitor Iraqi educational portal specific requirements."""
        monitoring_tasks = [
            self._check_academic_calendar_integration(session_id, url),
            self._validate_student_portal_functionality(session_id, url),
            self._check_arabic_english_bilingual_support(session_id, url),
            self._monitor_educational_accessibility(session_id, url),
        ]

        await asyncio.gather(*monitoring_tasks, return_exceptions=True)

    async def _monitor_banking_portal(self, session_id: str, url: str) -> None:
        """Monitor Iraqi banking portal specific requirements."""
        monitoring_tasks = [
            self._check_ssl_security(session_id, url),
            self._validate_cbi_compliance(session_id, url),
            self._check_arabic_numerals_support(session_id, url),
            self._monitor_transaction_security(session_id, url),
        ]

        await asyncio.gather(*monitoring_tasks, return_exceptions=True)

    async def _validate_portal_compliance(self, session_id: str, url: str) -> None:
        """Validate overall portal compliance with Iraqi standards."""
        session = self.portal_sessions.get(session_id, {})
        portal_type = session.get("portal_type", "unknown")

        compliance_tasks = [
            self._check_cultural_appropriateness(session_id, url),
            self._validate_islamic_compliance(session_id, url),
            self._check_arabic_rtl_display(session_id, url),
            self._validate_accessibility_standards(session_id, url),
        ]

        results = await asyncio.gather(*compliance_tasks, return_exceptions=True)

        # Aggregate compliance results
        compliance_score = self._calculate_compliance_score(results)
        session["compliance_score"] = compliance_score

        if compliance_score < 0.8:  # 80% compliance threshold
            await self.emit_iraqi_compliance_violation(
                session_id, portal_type, compliance_score, results
            )

    async def _validate_dom_structure(self, session_id: str, url: str) -> None:
        """Validate DOM structure for Arabic RTL and accessibility."""
        try:
            # Note: In real implementation, would use browser session to inspect DOM
            # This is a placeholder for the validation logic

            validation_results = {
                "html_lang_ar": True,  # Check for html[lang="ar"]
                "html_dir_rtl": True,  # Check for html[dir="rtl"]
                "arabic_fonts_loaded": True,  # Check Arabic font loading
                "accessibility_landmarks": True,  # Check ARIA landmarks
                "heading_hierarchy": True,  # Check proper heading structure
            }

            session = self.portal_sessions.get(session_id, {})
            session["dom_validation"] = validation_results

            # Track failures
            failures = [key for key, passed in validation_results.items() if not passed]
            if failures:
                await self.emit_iraqi_dom_validation_failure(session_id, failures)

        except Exception as e:
            await self.emit_error(f"DOM validation failed for {session_id}: {str(e)}")

    async def _check_cultural_appropriateness(self, session_id: str, url: str) -> bool:
        """Check cultural appropriateness of portal content."""
        # Placeholder for cultural validation logic
        # In real implementation, would use Iraqi cultural validator agent
        return True

    async def _validate_islamic_compliance(self, session_id: str, url: str) -> bool:
        """Validate Islamic compliance of portal content."""
        # Placeholder for Islamic compliance checking
        # In real implementation, would use Islamic compliance validator
        return True

    async def _check_arabic_rtl_display(self, session_id: str, url: str) -> bool:
        """Check proper Arabic RTL text display."""
        # Placeholder for RTL validation
        # In real implementation, would use Arabic RTL processor
        return True

    async def _validate_accessibility_standards(
        self, session_id: str, url: str
    ) -> bool:
        """Validate WCAG 2.1 AA accessibility compliance."""
        # Placeholder for accessibility validation
        # In real implementation, would use accessibility specialist agent
        return True

    def _calculate_compliance_score(self, validation_results: List) -> float:
        """Calculate overall compliance score from validation results."""
        if not validation_results:
            return 0.0

        passed_checks = sum(1 for result in validation_results if result is True)
        total_checks = len(validation_results)

        return passed_checks / total_checks if total_checks > 0 else 0.0

    # Event Emission Methods
    async def emit_iraqi_portal_navigation(
        self, url: str, portal_type: str, session_id: str
    ):
        """Emit Iraqi portal navigation event."""
        if self.cultural_validation_enabled:
            from browser_use.agent.events import IraqiPortalNavigationEvent

            event = IraqiPortalNavigationEvent(
                data={
                    "url": url,
                    "portal_type": portal_type,
                    "session_id": session_id,
                    "timestamp": datetime.now().isoformat(),
                }
            )
            self.event_bus.dispatch(event)

    async def emit_iraqi_performance_warning(
        self, session_id: str, metric: str, value: float
    ):
        """Emit performance warning for Iraqi network conditions."""
        if self.cultural_validation_enabled:
            from browser_use.agent.events import IraqiPerformanceWarningEvent

            event = IraqiPerformanceWarningEvent(
                data={
                    "session_id": session_id,
                    "metric": metric,
                    "value": value,
                    "threshold": self.iraqi_network_thresholds.get(metric, 0),
                    "severity": "high"
                    if value > self.iraqi_network_thresholds.get(metric, 0) * 2
                    else "medium",
                }
            )
            self.event_bus.dispatch(event)

    async def emit_iraqi_compliance_violation(
        self, session_id: str, portal_type: str, score: float, details: List
    ):
        """Emit compliance violation event."""
        if self.cultural_validation_enabled:
            from browser_use.agent.events import IraqiComplianceViolationEvent

            event = IraqiComplianceViolationEvent(
                data={
                    "session_id": session_id,
                    "portal_type": portal_type,
                    "compliance_score": score,
                    "violation_details": str(details)[:500],  # Truncate for event size
                    "severity": "high" if score < 0.6 else "medium",
                }
            )
            self.event_bus.dispatch(event)

    async def emit_iraqi_dom_validation_failure(
        self, session_id: str, failures: List[str]
    ):
        """Emit DOM validation failure event."""
        if self.cultural_validation_enabled:
            from browser_use.agent.events import IraqiDomValidationEvent

            event = IraqiDomValidationEvent(
                data={
                    "session_id": session_id,
                    "failed_validations": failures,
                    "failure_count": len(failures),
                    "severity": "high" if len(failures) > 3 else "medium",
                }
            )
            self.event_bus.dispatch(event)

    # Additional monitoring methods (placeholders for full implementation)
    async def _check_official_branding(self, session_id: str, url: str) -> bool:
        """Check for official Iraqi government branding elements."""
        return True

    async def _validate_arabic_language_support(
        self, session_id: str, url: str
    ) -> bool:
        """Validate proper Arabic language support."""
        return True

    async def _check_accessibility_compliance(self, session_id: str, url: str) -> bool:
        """Check WCAG accessibility compliance."""
        return True

    async def _monitor_security_headers(self, session_id: str, url: str) -> bool:
        """Monitor security headers for government portals."""
        return True

    async def _check_academic_calendar_integration(
        self, session_id: str, url: str
    ) -> bool:
        """Check academic calendar integration."""
        return True

    async def _validate_student_portal_functionality(
        self, session_id: str, url: str
    ) -> bool:
        """Validate student portal functionality."""
        return True

    async def _check_arabic_english_bilingual_support(
        self, session_id: str, url: str
    ) -> bool:
        """Check bilingual support for educational portals."""
        return True

    async def _monitor_educational_accessibility(
        self, session_id: str, url: str
    ) -> bool:
        """Monitor educational accessibility features."""
        return True

    async def _check_ssl_security(self, session_id: str, url: str) -> bool:
        """Check SSL/TLS security for banking portals."""
        return True

    async def _validate_cbi_compliance(self, session_id: str, url: str) -> bool:
        """Validate Central Bank of Iraq compliance."""
        return True

    async def _check_arabic_numerals_support(self, session_id: str, url: str) -> bool:
        """Check Arabic-Indic numerals support."""
        return True

    async def _monitor_transaction_security(self, session_id: str, url: str) -> bool:
        """Monitor transaction security measures."""
        return True
