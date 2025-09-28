"""
Enhanced base watchdog class with Iraqi AI integration.
Extracted from browser-use with cultural validation and security monitoring.
"""

import inspect
import time
from collections.abc import Iterable
from typing import Any, ClassVar, Optional
from dataclasses import dataclass

from bubus import BaseEvent, EventBus
from pydantic import BaseModel, ConfigDict, Field


# Iraqi AI specific events
@dataclass
class IraqiCulturalViolationEvent(BaseEvent[dict]):
    """Event triggered when cultural validation fails."""

    event_type = "IraqiCulturalViolationEvent"


@dataclass
class IraqiSecurityThreatEvent(BaseEvent[dict]):
    """Event triggered when security threat is detected."""

    event_type = "IraqiSecurityThreatEvent"


@dataclass
class IraqiPortalAccessEvent(BaseEvent[dict]):
    """Event triggered when accessing Iraqi government portals."""

    event_type = "IraqiPortalAccessEvent"


@dataclass
class ArabicContentProcessedEvent(BaseEvent[dict]):
    """Event triggered when Arabic content is processed."""

    event_type = "ArabicContentProcessedEvent"


class BaseWatchdog(BaseModel):
    """
    Enhanced base class for all browser watchdogs with Iraqi AI integration.

    Watchdogs monitor browser state and emit events based on changes.
    They automatically register event handlers based on method names.

    Enhanced features:
    - Cultural validation monitoring
    - Arabic content processing
    - Iraqi portal security
    - Islamic compliance checking

    Handler methods should be named: on_EventTypeName(self, event: EventTypeName)
    """

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        extra="forbid",
        validate_assignment=False,
        revalidate_instances="never",
    )

    # Class variables for event contracts
    LISTENS_TO: ClassVar[list[type[BaseEvent[Any]]]] = []
    EMITS: ClassVar[list[type[BaseEvent[Any]]]] = []

    # Core dependencies
    event_bus: EventBus = Field()
    browser_session: Any = Field()  # BrowserSession type

    # Iraqi AI configuration
    cultural_validation_enabled: bool = Field(default=True)
    arabic_rtl_support_enabled: bool = Field(default=True)
    islamic_compliance_enabled: bool = Field(default=True)
    iraqi_portal_monitoring_enabled: bool = Field(default=True)

    # Security configuration
    enhanced_security_monitoring: bool = Field(default=True)
    threat_detection_sensitivity: float = Field(default=0.8, ge=0.0, le=1.0)

    # Performance configuration
    monitoring_interval_seconds: float = Field(default=1.0, gt=0.0)
    enable_performance_monitoring: bool = Field(default=True)

    @property
    def logger(self):
        """Get the logger from the browser session."""
        return self.browser_session.logger

    @staticmethod
    def attach_handler_to_session(
        browser_session: Any, event_class: type[BaseEvent[Any]], handler
    ) -> None:
        """
        Attach a single event handler to a browser session.

        Args:
            browser_session: The browser session to attach to
            event_class: The event class to listen for
            handler: The handler method (must start with 'on_' and end with event type)
        """
        event_bus = browser_session.event_bus

        # Validate handler naming convention
        assert hasattr(handler, "__name__"), "Handler must have a __name__ attribute"
        assert handler.__name__.startswith("on_"), (
            f'Handler {handler.__name__} must start with "on_"'
        )
        assert handler.__name__.endswith(event_class.__name__), (
            f"Handler {handler.__name__} must end with event type {event_class.__name__}"
        )

        # Get the watchdog instance if this is a bound method
        watchdog_instance = getattr(handler, "__self__", None)
        watchdog_class_name = (
            watchdog_instance.__class__.__name__ if watchdog_instance else "Unknown"
        )

        # Enhanced logging with Iraqi AI context
        red = "\033[91m"
        green = "\033[92m"
        yellow = "\033[93m"
        magenta = "\033[95m"
        cyan = "\033[96m"
        blue = "\033[94m"
        reset = "\033[0m"

        def make_unique_handler(actual_handler):
            async def unique_handler(event):
                # Enhanced logging with Iraqi AI event tracking
                parent_event = (
                    event_bus.event_history.get(event.event_parent_id)
                    if event.event_parent_id
                    else None
                )
                grandparent_event = (
                    event_bus.event_history.get(parent_event.event_parent_id)
                    if parent_event and parent_event.event_parent_id
                    else None
                )

                parent = (
                    f"{yellow}↲  triggered by {cyan}on_{parent_event.event_type}#{parent_event.event_id[-4:]}{reset}"
                    if parent_event
                    else f"{magenta}👈 by Agent{reset}"
                )

                # Iraqi AI event context
                iraqi_context = ""
                if hasattr(event, "event_type"):
                    if "Iraqi" in event.event_type or "Arabic" in event.event_type:
                        iraqi_context = f"{blue}🇮🇶 Iraqi AI{reset} "

                browser_session.logger.debug(
                    f"{green}⚡{reset} {iraqi_context}{cyan}{watchdog_class_name}{reset}.{handler.__name__}"
                    f"{magenta}(#{event.event_id[-4:]}){reset} {parent}"
                )

                start_time = time.time()
                try:
                    # Execute the handler
                    result = await actual_handler(event)

                    execution_time = time.time() - start_time
                    if execution_time > 1.0:  # Log slow handlers
                        browser_session.logger.warning(
                            f"{yellow}⚠️{reset} Slow handler: {watchdog_class_name}.{handler.__name__} "
                            f"took {execution_time:.2f}s"
                        )

                    return result

                except Exception as e:
                    execution_time = time.time() - start_time
                    browser_session.logger.error(
                        f"{red}❌{reset} Handler failed: {watchdog_class_name}.{handler.__name__} "
                        f"after {execution_time:.2f}s: {type(e).__name__}: {e}"
                    )
                    raise

            return unique_handler

        # Create and register the handler
        wrapped_handler = make_unique_handler(handler)
        wrapped_handler.__name__ = (
            f"{watchdog_class_name}_{handler.__name__}_{id(handler)}"
        )

        event_bus.on(event_class, wrapped_handler)

    @classmethod
    def attach_to_session(cls, browser_session: Any, **kwargs) -> "BaseWatchdog":
        """
        Create and attach a watchdog instance to a browser session.

        Args:
            browser_session: The browser session to attach to
            **kwargs: Additional configuration for the watchdog

        Returns:
            The created watchdog instance
        """
        # Create watchdog instance
        watchdog = cls(
            event_bus=browser_session.event_bus,
            browser_session=browser_session,
            **kwargs,
        )

        # Auto-discover and attach event handlers
        for attr_name in dir(watchdog):
            if not attr_name.startswith("on_"):
                continue

            handler = getattr(watchdog, attr_name)
            if not callable(handler):
                continue

            # Extract event type from handler name
            event_type_name = attr_name[3:]  # Remove 'on_' prefix

            # Find matching event class
            event_class = cls._find_event_class(event_type_name)
            if event_class:
                cls.attach_handler_to_session(browser_session, event_class, handler)
                watchdog.logger.debug(f"Attached {attr_name} to {event_class.__name__}")

        return watchdog

    @classmethod
    def _find_event_class(cls, event_type_name: str) -> Optional[type[BaseEvent[Any]]]:
        """
        Find event class by name from the LISTENS_TO list or common event modules.

        Args:
            event_type_name: Name of the event type to find

        Returns:
            Event class if found, None otherwise
        """
        # Check in LISTENS_TO first
        for event_class in cls.LISTENS_TO:
            if event_class.__name__ == event_type_name:
                return event_class

        # Check common Iraqi AI events
        iraqi_events = [
            IraqiCulturalViolationEvent,
            IraqiSecurityThreatEvent,
            IraqiPortalAccessEvent,
            ArabicContentProcessedEvent,
        ]

        for event_class in iraqi_events:
            if event_class.__name__ == event_type_name:
                return event_class

        # Try to import from browser events module
        try:
            from browser_use.browser.events import (
                BrowserErrorEvent,
                NavigateToUrlEvent,
                NavigationCompleteEvent,
                TabCreatedEvent,
                BrowserConnectedEvent,
                BrowserStoppedEvent,
            )

            common_events = [
                BrowserErrorEvent,
                NavigateToUrlEvent,
                NavigationCompleteEvent,
                TabCreatedEvent,
                BrowserConnectedEvent,
                BrowserStoppedEvent,
            ]

            for event_class in common_events:
                if event_class.__name__ == event_type_name:
                    return event_class

        except ImportError:
            pass

        return None

    # Iraqi AI helper methods
    def is_iraqi_content_detected(self, content: str) -> bool:
        """Check if content contains Iraqi cultural markers."""
        if not self.cultural_validation_enabled:
            return False

        iraqi_markers = [
            "العراق",  # Iraq
            "بغداد",  # Baghdad
            "شلونك",  # Iraqi greeting
            "شكو",  # Iraqi "what's up"
            "ماكو",  # Iraqi "there isn't"
        ]

        return any(marker in content for marker in iraqi_markers)

    def is_arabic_rtl_content(self, content: str) -> bool:
        """Check if content contains Arabic RTL text."""
        if not self.arabic_rtl_support_enabled:
            return False

        import re

        arabic_pattern = (
            r"[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]"
        )
        return bool(re.search(arabic_pattern, content))

    def is_iraqi_government_url(self, url: str) -> bool:
        """Check if URL is an Iraqi government portal."""
        if not self.iraqi_portal_monitoring_enabled:
            return False

        iraqi_gov_patterns = [
            ".gov.iq",
            ".iraq.gov.iq",
            "cabinet.iq",
            "cbi.iq",
            "moh.gov.iq",
            "moe.gov.iq",
        ]

        return any(pattern in url.lower() for pattern in iraqi_gov_patterns)

    async def emit_iraqi_cultural_violation(
        self, content: str, violation_type: str, severity: str = "medium"
    ):
        """Emit cultural violation event."""
        if self.cultural_validation_enabled:
            event = IraqiCulturalViolationEvent(
                data={
                    "content_excerpt": content[:200],  # First 200 chars
                    "violation_type": violation_type,
                    "severity": severity,
                    "timestamp": time.time(),
                    "watchdog": self.__class__.__name__,
                }
            )
            self.event_bus.dispatch(event)

    async def emit_iraqi_security_threat(
        self, threat_type: str, url: str, details: dict
    ):
        """Emit security threat event."""
        if self.enhanced_security_monitoring:
            event = IraqiSecurityThreatEvent(
                data={
                    "threat_type": threat_type,
                    "url": url,
                    "details": details,
                    "severity": "high",
                    "timestamp": time.time(),
                    "watchdog": self.__class__.__name__,
                }
            )
            self.event_bus.dispatch(event)

    async def emit_iraqi_portal_access(
        self, url: str, portal_type: str, access_result: str
    ):
        """Emit Iraqi portal access event."""
        if self.iraqi_portal_monitoring_enabled:
            event = IraqiPortalAccessEvent(
                data={
                    "url": url,
                    "portal_type": portal_type,
                    "access_result": access_result,
                    "timestamp": time.time(),
                    "watchdog": self.__class__.__name__,
                }
            )
            self.event_bus.dispatch(event)

    async def emit_arabic_content_processed(
        self, content: str, processing_type: str, result: dict
    ):
        """Emit Arabic content processing event."""
        if self.arabic_rtl_support_enabled:
            event = ArabicContentProcessedEvent(
                data={
                    "content_length": len(content),
                    "processing_type": processing_type,
                    "result": result,
                    "timestamp": time.time(),
                    "watchdog": self.__class__.__name__,
                }
            )
            self.event_bus.dispatch(event)
