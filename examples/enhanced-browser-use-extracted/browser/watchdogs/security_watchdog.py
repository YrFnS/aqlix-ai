"""
Enhanced security watchdog with Iraqi AI integration.
Extracted from browser-use with Iraqi portal security and cultural threat detection.
"""

from typing import TYPE_CHECKING, ClassVar, Dict, List, Optional
import re
import time
from urllib.parse import urlparse

from bubus import BaseEvent
from pydantic import Field, PrivateAttr

from ..watchdog_base import (
    BaseWatchdog,
    IraqiSecurityThreatEvent,
    IraqiPortalAccessEvent,
    IraqiCulturalViolationEvent,
)

if TYPE_CHECKING:
    pass

# Track if we've shown the glob warning
_GLOB_WARNING_SHOWN = False


class IraqiSecurityWatchdog(BaseWatchdog):
    """
    Enhanced security watchdog with Iraqi AI integration.

    Monitors and enforces security policies for URL access with:
    - Iraqi portal security validation
    - Cultural threat detection
    - Enhanced domain filtering
    - Islamic compliance monitoring
    - Real-time threat assessment
    """

    # Event contracts
    LISTENS_TO: ClassVar[
        list[type[BaseEvent]]
    ] = []  # Will be populated from browser events
    EMITS: ClassVar[list[type[BaseEvent]]] = [
        IraqiSecurityThreatEvent,
        IraqiPortalAccessEvent,
        IraqiCulturalViolationEvent,
    ]

    # Iraqi security configuration
    iraqi_portal_whitelist: List[str] = Field(
        default_factory=lambda: [
            "*.gov.iq",
            "*.iraq.gov.iq",
            "*.cabinet.iq",
            "*.cbi.iq",
            "*.moh.gov.iq",
            "*.moe.gov.iq",
            "*.zaincash.iq",
            "*.fastpay.iq",
            "*.nasswallet.com",
        ]
    )

    cultural_threat_patterns: List[str] = Field(
        default_factory=lambda: [
            "sectarian",
            "political bias",
            "cultural insensitivity",
            "religious offense",
            "tribal conflict",
        ]
    )

    suspicious_activity_threshold: float = Field(default=0.7, ge=0.0, le=1.0)
    block_non_compliant_content: bool = Field(default=True)
    enable_real_time_scanning: bool = Field(default=True)

    # Private state
    _threat_history: Dict[str, List[dict]] = PrivateAttr(default_factory=dict)
    _portal_access_log: List[dict] = PrivateAttr(default_factory=list)
    _cultural_violations: List[dict] = PrivateAttr(default_factory=list)

    async def on_NavigateToUrlEvent(self, event) -> None:
        """
        Enhanced navigation security check with Iraqi portal validation.

        Args:
            event: NavigateToUrlEvent with URL to validate
        """
        url = event.url

        # Basic URL validation
        if not self._is_url_allowed(url):
            await self._handle_blocked_navigation(url, "domain_not_allowed")
            return

        # Iraqi portal security check
        if self.is_iraqi_government_url(url):
            await self._validate_iraqi_portal_access(url, event)

        # Cultural threat assessment
        if self.enable_real_time_scanning:
            await self._assess_cultural_threats(url, event)

        # Enhanced security validation
        threat_score = await self._calculate_threat_score(url)
        if threat_score > self.suspicious_activity_threshold:
            await self._handle_security_threat(url, threat_score, event)

    async def on_NavigationCompleteEvent(self, event) -> None:
        """
        Post-navigation security validation and monitoring.

        Args:
            event: NavigationCompleteEvent with completed navigation details
        """
        url = event.url

        # Log successful Iraqi portal access
        if self.is_iraqi_government_url(url):
            await self._log_iraqi_portal_access(url, "success", event)

        # Scan page content for cultural violations
        if self.cultural_validation_enabled:
            await self._scan_page_content_for_violations(url, event)

        # Update threat tracking
        await self._update_threat_tracking(url, "navigation_complete")

    async def on_TabCreatedEvent(self, event) -> None:
        """
        Validate new tab creation for security compliance.

        Args:
            event: TabCreatedEvent with new tab details
        """
        url = event.url

        if not self._is_url_allowed(url):
            await self._handle_blocked_tab_creation(url, event)

        # Monitor new tab for Iraqi portal access
        if self.is_iraqi_government_url(url):
            await self._log_iraqi_portal_access(url, "tab_created", event)

    def _log_glob_warning(self) -> None:
        """Log a warning about glob patterns in allowed_domains."""
        global _GLOB_WARNING_SHOWN
        if not _GLOB_WARNING_SHOWN:
            _GLOB_WARNING_SHOWN = True
            self.logger.warning(
                "⚠️ Using glob patterns in allowed_domains. "
                'Note: Patterns like "*.example.com" will match both subdomains AND the main domain.'
            )

    def _is_url_allowed(self, url: str) -> bool:
        """
        Enhanced URL validation with Iraqi portal considerations.

        Args:
            url: The URL to check

        Returns:
            True if the URL is allowed, False otherwise
        """
        # Get allowed domains from browser profile
        allowed_domains = getattr(
            getattr(self.browser_session, "browser_profile", None),
            "allowed_domains",
            [],
        )

        # If no allowed_domains specified, allow all URLs
        if not allowed_domains:
            return True

        # Always allow internal browser targets
        internal_urls = [
            "about:blank",
            "chrome://new-tab-page/",
            "chrome://new-tab-page",
            "chrome://newtab/",
            "edge://new-tab-page/",
            "safari://new-tab/",
        ]
        if url in internal_urls:
            return True

        # Parse the URL
        try:
            parsed = urlparse(url)
        except Exception:
            return False

        host = parsed.hostname
        if not host:
            return False

        # Iraqi portal special handling
        if self.is_iraqi_government_url(url):
            return self._validate_iraqi_portal_domain(host)

        # Check against allowed domains with glob pattern support
        for pattern in allowed_domains:
            if self._match_domain_pattern(host, pattern, parsed.scheme):
                return True

        return False

    def _match_domain_pattern(self, host: str, pattern: str, scheme: str) -> bool:
        """
        Match host against domain pattern with glob support.

        Args:
            host: The hostname to match
            pattern: The pattern to match against
            scheme: The URL scheme (http, https)

        Returns:
            True if host matches pattern
        """
        # Handle glob patterns
        if "*" in pattern:
            self._log_glob_warning()
            import fnmatch

            if pattern.startswith("*."):
                # Pattern like *.example.com should match subdomains and main domain
                domain_part = pattern[2:]  # Remove *.
                if host == domain_part or host.endswith("." + domain_part):
                    # Only match http/https URLs for domain-only patterns
                    return scheme in ["http", "https"]
            else:
                # Use fnmatch for other glob patterns
                return fnmatch.fnmatch(host, pattern)
        else:
            # Exact match or prefix match
            return host == pattern or (
                pattern.startswith(".") and host.endswith(pattern)
            )

        return False

    def _validate_iraqi_portal_domain(self, host: str) -> bool:
        """
        Validate access to Iraqi portal domains.

        Args:
            host: The hostname to validate

        Returns:
            True if access is allowed to this Iraqi portal
        """
        for pattern in self.iraqi_portal_whitelist:
            if self._match_domain_pattern(host, pattern, "https"):
                return True

        # Log unauthorized Iraqi domain access attempt
        self.logger.warning(f"⛔️ Unauthorized Iraqi domain access attempt: {host}")
        return False

    async def _calculate_threat_score(self, url: str) -> float:
        """
        Calculate threat score for URL based on various factors.

        Args:
            url: URL to assess

        Returns:
            Threat score from 0.0 (safe) to 1.0 (high threat)
        """
        score = 0.0

        # URL structure analysis
        parsed = urlparse(url)

        # Suspicious patterns in URL
        suspicious_patterns = [
            "phish",
            "fake",
            "scam",
            "malware",
            "virus",
            "download",
            "executable",
            "script",
        ]

        url_lower = url.lower()
        for pattern in suspicious_patterns:
            if pattern in url_lower:
                score += 0.3

        # Non-standard ports
        if parsed.port and parsed.port not in [80, 443, 8080, 8443]:
            score += 0.2

        # IP address instead of domain
        if re.match(r"^\d+\.\d+\.\d+\.\d+$", parsed.hostname or ""):
            score += 0.4

        # Historical threat data
        host = parsed.hostname or ""
        if host in self._threat_history:
            recent_threats = [
                threat
                for threat in self._threat_history[host]
                if time.time() - threat.get("timestamp", 0) < 3600  # Last hour
            ]
            if recent_threats:
                score += min(0.3, len(recent_threats) * 0.1)

        return min(1.0, score)

    async def _assess_cultural_threats(self, url: str, event) -> None:
        """
        Assess URL and context for cultural threats.

        Args:
            url: URL to assess
            event: Associated event
        """
        # Check URL for culturally inappropriate patterns
        url_lower = url.lower()

        for pattern in self.cultural_threat_patterns:
            if pattern.replace(" ", "").lower() in url_lower:
                await self.emit_iraqi_cultural_violation(
                    content=url,
                    violation_type=f"url_contains_{pattern.replace(' ', '_')}",
                    severity="high",
                )

                # Add to violation tracking
                violation = {
                    "url": url,
                    "pattern": pattern,
                    "timestamp": time.time(),
                    "event_type": type(event).__name__,
                }
                self._cultural_violations.append(violation)

    async def _validate_iraqi_portal_access(self, url: str, event) -> None:
        """
        Validate and monitor Iraqi portal access.

        Args:
            url: Iraqi portal URL
            event: Associated event
        """
        portal_type = self._identify_iraqi_portal_type(url)

        # Enhanced validation for specific portal types
        validation_result = await self._perform_portal_validation(url, portal_type)

        if not validation_result["allowed"]:
            await self.emit_iraqi_security_threat(
                threat_type="unauthorized_portal_access",
                url=url,
                details={
                    "portal_type": portal_type,
                    "reason": validation_result["reason"],
                    "timestamp": time.time(),
                },
            )

            # Block access if configured
            if self.block_non_compliant_content:
                raise ValueError(
                    f"Access blocked to Iraqi portal: {validation_result['reason']}"
                )

    def _identify_iraqi_portal_type(self, url: str) -> str:
        """
        Identify the type of Iraqi portal being accessed.

        Args:
            url: Portal URL

        Returns:
            Portal type classification
        """
        url_lower = url.lower()

        portal_types = {
            "government": ["gov.iq", "iraq.gov.iq", "cabinet.iq"],
            "banking": ["cbi.iq"],
            "health": ["moh.gov.iq"],
            "education": ["moe.gov.iq"],
            "payment": ["zaincash.iq", "fastpay.iq", "nasswallet.com"],
        }

        for portal_type, patterns in portal_types.items():
            if any(pattern in url_lower for pattern in patterns):
                return portal_type

        return "unknown"

    async def _perform_portal_validation(
        self, url: str, portal_type: str
    ) -> Dict[str, any]:
        """
        Perform detailed validation for Iraqi portal access.

        Args:
            url: Portal URL
            portal_type: Type of portal

        Returns:
            Validation result dictionary
        """
        result = {"allowed": True, "reason": "", "security_level": "standard"}

        # Time-based access restrictions
        current_hour = time.localtime().tm_hour

        # Government portals - restricted outside business hours
        if portal_type == "government" and (current_hour < 8 or current_hour > 17):
            result["allowed"] = False
            result["reason"] = "government_portal_outside_business_hours"
            return result

        # Payment portals - enhanced security
        if portal_type == "payment":
            result["security_level"] = "high"
            # Additional payment portal validation would go here

        # Banking portals - maximum security
        if portal_type == "banking":
            result["security_level"] = "maximum"
            # Additional banking portal validation would go here

        return result

    async def _scan_page_content_for_violations(self, url: str, event) -> None:
        """
        Scan page content for cultural violations after navigation.

        Args:
            url: Page URL
            event: Navigation event
        """
        try:
            # In a real implementation, this would extract and scan page content
            # For now, simulate content scanning
            page_title = getattr(event, "title", "")

            if page_title and self.is_iraqi_content_detected(page_title):
                # Scan for cultural violations in title
                for pattern in self.cultural_threat_patterns:
                    if pattern.lower() in page_title.lower():
                        await self.emit_iraqi_cultural_violation(
                            content=page_title,
                            violation_type="page_title_violation",
                            severity="medium",
                        )
        except Exception as e:
            self.logger.error(f"Error scanning page content: {e}")

    async def _handle_blocked_navigation(self, url: str, reason: str) -> None:
        """
        Handle blocked navigation with enhanced Iraqi context.

        Args:
            url: Blocked URL
            reason: Reason for blocking
        """
        self.logger.warning(
            f"⛔️ Blocking navigation to disallowed URL: {url} (Reason: {reason})"
        )

        # Emit security threat event
        await self.emit_iraqi_security_threat(
            threat_type="blocked_navigation",
            url=url,
            details={
                "reason": reason,
                "timestamp": time.time(),
                "is_iraqi_portal": self.is_iraqi_government_url(url),
            },
        )

        # Raise exception to block navigation
        raise ValueError(
            f"Navigation to {url} blocked by Iraqi security policy: {reason}"
        )

    async def _handle_blocked_tab_creation(self, url: str, event) -> None:
        """
        Handle blocked tab creation.

        Args:
            url: Blocked URL
            event: Tab creation event
        """
        self.logger.warning(f"⛔️ New tab created with disallowed URL: {url}")

        await self.emit_iraqi_security_threat(
            threat_type="blocked_tab_creation",
            url=url,
            details={
                "target_id": getattr(event, "target_id", ""),
                "timestamp": time.time(),
            },
        )

        # Try to close the offending tab
        try:
            target_id = getattr(event, "target_id", None)
            if target_id and hasattr(self.browser_session, "_cdp_close_page"):
                await self.browser_session._cdp_close_page(target_id)
                self.logger.info(f"⛔️ Closed new tab with non-allowed URL: {url}")
        except Exception as e:
            self.logger.error(
                f"⛔️ Failed to close new tab with non-allowed URL: {type(e).__name__} {e}"
            )

    async def _handle_security_threat(
        self, url: str, threat_score: float, event
    ) -> None:
        """
        Handle detected security threat.

        Args:
            url: Threatening URL
            threat_score: Calculated threat score
            event: Associated event
        """
        self.logger.warning(
            f"🚨 Security threat detected: {url} (Score: {threat_score:.2f})"
        )

        await self.emit_iraqi_security_threat(
            threat_type="high_threat_score",
            url=url,
            details={
                "threat_score": threat_score,
                "threshold": self.suspicious_activity_threshold,
                "timestamp": time.time(),
            },
        )

        # Update threat history
        parsed = urlparse(url)
        host = parsed.hostname or ""

        if host not in self._threat_history:
            self._threat_history[host] = []

        self._threat_history[host].append(
            {
                "url": url,
                "threat_score": threat_score,
                "timestamp": time.time(),
                "event_type": type(event).__name__,
            }
        )

    async def _log_iraqi_portal_access(self, url: str, access_type: str, event) -> None:
        """
        Log Iraqi portal access for monitoring.

        Args:
            url: Portal URL
            access_type: Type of access (success, tab_created, etc.)
            event: Associated event
        """
        portal_type = self._identify_iraqi_portal_type(url)

        access_log = {
            "url": url,
            "portal_type": portal_type,
            "access_type": access_type,
            "timestamp": time.time(),
            "event_type": type(event).__name__,
            "target_id": getattr(event, "target_id", ""),
        }

        self._portal_access_log.append(access_log)

        await self.emit_iraqi_portal_access(
            url=url, portal_type=portal_type, access_result=access_type
        )

    async def _update_threat_tracking(self, url: str, activity_type: str) -> None:
        """
        Update threat tracking for URL.

        Args:
            url: URL to track
            activity_type: Type of activity
        """
        parsed = urlparse(url)
        host = parsed.hostname or ""

        # Clean old threat history (older than 24 hours)
        current_time = time.time()
        for tracked_host in list(self._threat_history.keys()):
            self._threat_history[tracked_host] = [
                threat
                for threat in self._threat_history[tracked_host]
                if current_time - threat.get("timestamp", 0) < 86400
            ]

            # Remove hosts with no recent threats
            if not self._threat_history[tracked_host]:
                del self._threat_history[tracked_host]
