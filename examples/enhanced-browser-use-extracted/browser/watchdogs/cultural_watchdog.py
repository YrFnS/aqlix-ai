"""
Iraqi cultural validation watchdog.
Monitors browser content for Iraqi cultural appropriateness and Islamic compliance.
"""

import asyncio
import time
from typing import TYPE_CHECKING, ClassVar, Dict, List, Optional, Set
import re

from bubus import BaseEvent
from pydantic import Field, PrivateAttr

from ..watchdog_base import (
    BaseWatchdog,
    IraqiCulturalViolationEvent,
    ArabicContentProcessedEvent,
)

if TYPE_CHECKING:
    pass


class IraqiCulturalWatchdog(BaseWatchdog):
    """
    Iraqi cultural validation watchdog.

    Monitors browser content for:
    - Iraqi cultural appropriateness (95%+ accuracy target)
    - Islamic compliance validation
    - Arabic content processing
    - Professional domain context
    - Political neutrality enforcement
    """

    # Event contracts
    LISTENS_TO: ClassVar[
        list[type[BaseEvent]]
    ] = []  # Will be populated from browser events
    EMITS: ClassVar[list[type[BaseEvent]]] = [
        IraqiCulturalViolationEvent,
        ArabicContentProcessedEvent,
    ]

    # Cultural validation configuration
    cultural_validation_threshold: float = Field(default=0.95, ge=0.0, le=1.0)
    islamic_compliance_threshold: float = Field(default=0.90, ge=0.0, le=1.0)
    political_neutrality_threshold: float = Field(default=0.85, ge=0.0, le=1.0)

    # Content analysis settings
    real_time_content_scanning: bool = Field(default=True)
    arabic_content_processing: bool = Field(default=True)
    professional_domain_validation: bool = Field(default=True)

    # Cultural patterns
    inappropriate_content_patterns: List[str] = Field(
        default_factory=lambda: [
            # Sectarian content
            "sunni vs shia",
            "sectarian conflict",
            "religious division",
            # Political bias
            "political party",
            "partisan politics",
            "political bias",
            # Cultural insensitivity
            "cultural stereotype",
            "ethnic discrimination",
            "tribal conflict",
            # Religious offense
            "religious mockery",
            "blasphemy",
            "religious insult",
        ]
    )

    islamic_compliance_patterns: List[str] = Field(
        default_factory=lambda: [
            # Prohibited content
            "gambling",
            "alcohol promotion",
            "haram content",
            "inappropriate imagery",
            "non-halal business",
            # Financial compliance
            "interest-based lending",
            "riba",
            "usury",
        ]
    )

    iraqi_cultural_markers: Dict[str, float] = Field(
        default_factory=lambda: {
            # Positive cultural markers
            "السلام عليكم": 0.9,  # Islamic greeting
            "أهلا وسهلا": 0.8,  # Iraqi welcome
            "شلونك": 0.9,  # Iraqi "how are you"
            "العراق": 0.7,  # Iraq
            "بغداد": 0.6,  # Baghdad
            "الحمد لله": 0.8,  # Praise be to God
            # Professional contexts
            "وزارة": 0.7,  # Ministry
            "جامعة": 0.6,  # University
            "مستشفى": 0.7,  # Hospital
            "محكمة": 0.8,  # Court
        }
    )

    # Private state
    _content_analysis_cache: Dict[str, dict] = PrivateAttr(default_factory=dict)
    _violation_history: List[dict] = PrivateAttr(default_factory=list)
    _cultural_scores_history: List[dict] = PrivateAttr(default_factory=list)
    _arabic_processing_stats: Dict[str, int] = PrivateAttr(default_factory=dict)

    async def on_NavigationCompleteEvent(self, event) -> None:
        """
        Analyze page content for cultural appropriateness after navigation.

        Args:
            event: NavigationCompleteEvent with page details
        """
        if not self.cultural_validation_enabled:
            return

        url = getattr(event, "url", "")

        try:
            # Extract and analyze page content
            content_analysis = await self._analyze_page_content(url, event)

            # Validate cultural appropriateness
            if content_analysis["cultural_score"] < self.cultural_validation_threshold:
                await self._handle_cultural_violation(
                    url, content_analysis, "low_cultural_score"
                )

            # Validate Islamic compliance
            if (
                content_analysis["islamic_compliance_score"]
                < self.islamic_compliance_threshold
            ):
                await self._handle_cultural_violation(
                    url, content_analysis, "islamic_non_compliance"
                )

            # Check political neutrality
            if (
                content_analysis["political_neutrality_score"]
                < self.political_neutrality_threshold
            ):
                await self._handle_cultural_violation(
                    url, content_analysis, "political_bias"
                )

            # Process Arabic content if detected
            if content_analysis["arabic_content_detected"]:
                await self._process_arabic_content(url, content_analysis)

        except Exception as e:
            self.logger.error(f"Error in cultural validation: {e}")

    async def on_DomChangeEvent(self, event) -> None:
        """
        Monitor DOM changes for cultural content validation.

        Args:
            event: DomChangeEvent with DOM modification details
        """
        if not self.real_time_content_scanning:
            return

        try:
            # Extract changed content
            changed_content = self._extract_changed_content(event)

            if changed_content:
                # Perform real-time cultural analysis
                analysis = await self._analyze_content_snippet(changed_content)

                if analysis["requires_validation"]:
                    url = getattr(event, "url", "current_page")
                    await self._validate_content_snippet(url, changed_content, analysis)

        except Exception as e:
            self.logger.error(f"Error in DOM change cultural analysis: {e}")

    async def on_InputEvent(self, event) -> None:
        """
        Validate user input for cultural appropriateness.

        Args:
            event: InputEvent with user input details
        """
        if not self.cultural_validation_enabled:
            return

        try:
            input_text = getattr(event, "text", "")

            if (
                input_text and len(input_text.strip()) > 10
            ):  # Only analyze substantial input
                # Analyze input for cultural appropriateness
                analysis = await self._analyze_user_input(input_text)

                if analysis["cultural_violation_detected"]:
                    await self._handle_input_violation(input_text, analysis, event)

        except Exception as e:
            self.logger.error(f"Error in input cultural validation: {e}")

    async def _analyze_page_content(self, url: str, event) -> Dict[str, any]:
        """
        Analyze page content for cultural appropriateness.

        Args:
            url: Page URL
            event: Navigation event

        Returns:
            Content analysis results
        """
        # Check cache first
        cache_key = f"{url}_{int(time.time() / 300)}"  # 5-minute cache
        if cache_key in self._content_analysis_cache:
            return self._content_analysis_cache[cache_key]

        # Simulate content extraction (in real implementation, would use browser session)
        page_content = await self._extract_page_content(url, event)

        analysis = {
            "url": url,
            "timestamp": time.time(),
            "content_length": len(page_content),
            "arabic_content_detected": self.is_arabic_rtl_content(page_content),
            "iraqi_content_detected": self.is_iraqi_content_detected(page_content),
            "cultural_score": await self._calculate_cultural_score(page_content),
            "islamic_compliance_score": await self._calculate_islamic_compliance_score(
                page_content
            ),
            "political_neutrality_score": await self._calculate_political_neutrality_score(
                page_content
            ),
            "professional_domain": self._identify_professional_domain(page_content),
            "language_distribution": self._analyze_language_distribution(page_content),
            "cultural_markers_found": self._find_cultural_markers(page_content),
        }

        # Cache analysis
        self._content_analysis_cache[cache_key] = analysis

        # Store in history
        self._cultural_scores_history.append(analysis)

        # Cleanup old cache entries
        await self._cleanup_analysis_cache()

        return analysis

    async def _extract_page_content(self, url: str, event) -> str:
        """
        Extract page content for analysis.

        Args:
            url: Page URL
            event: Navigation event

        Returns:
            Extracted page content
        """
        # In real implementation, this would use browser session to extract content
        # For now, simulate based on available event data

        content_parts = []

        # Add page title if available
        title = getattr(event, "title", "")
        if title:
            content_parts.append(title)

        # Add meta description if available
        description = getattr(event, "description", "")
        if description:
            content_parts.append(description)

        # Add URL-based content analysis
        parsed_url = url.lower()
        if "gov.iq" in parsed_url:
            content_parts.append("Iraqi government portal content")
        elif "education" in parsed_url or "university" in parsed_url:
            content_parts.append("Educational content")
        elif "health" in parsed_url or "medical" in parsed_url:
            content_parts.append("Healthcare content")

        return " ".join(content_parts) or "No content extracted"

    async def _calculate_cultural_score(self, content: str) -> float:
        """
        Calculate cultural appropriateness score.

        Args:
            content: Content to analyze

        Returns:
            Cultural appropriateness score (0.0-1.0)
        """
        base_score = 0.8  # Start with neutral score

        content_lower = content.lower()

        # Check for inappropriate patterns
        violations = 0
        for pattern in self.inappropriate_content_patterns:
            if pattern.lower() in content_lower:
                violations += 1
                base_score -= 0.15  # Deduct for each violation

        # Boost score for positive cultural markers
        for marker, boost in self.iraqi_cultural_markers.items():
            if marker in content:
                base_score += boost * 0.1  # Modest boost for cultural markers

        # Check for Arabic content (positive indicator for Iraqi context)
        if self.is_arabic_rtl_content(content):
            base_score += 0.05

        # Professional domain bonus
        if self._identify_professional_domain(content) != "unknown":
            base_score += 0.05

        return max(0.0, min(1.0, base_score))

    async def _calculate_islamic_compliance_score(self, content: str) -> float:
        """
        Calculate Islamic compliance score.

        Args:
            content: Content to analyze

        Returns:
            Islamic compliance score (0.0-1.0)
        """
        base_score = 0.9  # Start with high compliance assumption

        content_lower = content.lower()

        # Check for Islamic non-compliance patterns
        for pattern in self.islamic_compliance_patterns:
            if pattern.lower() in content_lower:
                base_score -= 0.2  # Significant deduction for non-compliance

        # Boost for Islamic content
        islamic_markers = ["الله", "إسلام", "مسلم", "حلال", "الحمد لله"]
        for marker in islamic_markers:
            if marker in content:
                base_score = min(1.0, base_score + 0.02)

        return max(0.0, base_score)

    async def _calculate_political_neutrality_score(self, content: str) -> float:
        """
        Calculate political neutrality score.

        Args:
            content: Content to analyze

        Returns:
            Political neutrality score (0.0-1.0)
        """
        base_score = 0.85  # Start with neutral assumption

        content_lower = content.lower()

        # Political bias indicators
        political_bias_patterns = [
            "partisan",
            "political party",
            "sectarian",
            "tribal politics",
            "government criticism",
            "political propaganda",
        ]

        for pattern in political_bias_patterns:
            if pattern in content_lower:
                base_score -= 0.15

        # Neutral language bonus
        neutral_patterns = ["objective", "factual", "informational", "educational"]

        for pattern in neutral_patterns:
            if pattern in content_lower:
                base_score = min(1.0, base_score + 0.05)

        return max(0.0, base_score)

    def _identify_professional_domain(self, content: str) -> str:
        """
        Identify professional domain of content.

        Args:
            content: Content to analyze

        Returns:
            Professional domain classification
        """
        content_lower = content.lower()

        domain_patterns = {
            "legal": ["قانون", "محكمة", "lawyer", "court", "legal", "law"],
            "medical": ["طب", "مستشفى", "doctor", "medical", "health", "clinic"],
            "educational": [
                "تعليم",
                "جامعة",
                "education",
                "university",
                "school",
                "academic",
            ],
            "government": ["حكومة", "وزارة", "government", "ministry", "official"],
            "banking": ["بنك", "مصرف", "bank", "financial", "banking"],
        }

        for domain, patterns in domain_patterns.items():
            if any(pattern in content_lower for pattern in patterns):
                return domain

        return "unknown"

    def _analyze_language_distribution(self, content: str) -> Dict[str, float]:
        """
        Analyze language distribution in content.

        Args:
            content: Content to analyze

        Returns:
            Language distribution percentages
        """
        if not content:
            return {"arabic": 0.0, "english": 0.0, "other": 0.0}

        # Count Arabic characters
        arabic_pattern = (
            r"[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]"
        )
        arabic_chars = len(re.findall(arabic_pattern, content))

        # Count English characters
        english_pattern = r"[a-zA-Z]"
        english_chars = len(re.findall(english_pattern, content))

        # Count all alphanumeric characters
        total_chars = len(
            re.findall(
                r"[a-zA-Z\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]",
                content,
            )
        )

        if total_chars == 0:
            return {"arabic": 0.0, "english": 0.0, "other": 0.0}

        arabic_percent = arabic_chars / total_chars
        english_percent = english_chars / total_chars
        other_percent = max(0.0, 1.0 - arabic_percent - english_percent)

        return {
            "arabic": arabic_percent,
            "english": english_percent,
            "other": other_percent,
        }

    def _find_cultural_markers(self, content: str) -> List[Dict[str, any]]:
        """
        Find cultural markers in content.

        Args:
            content: Content to analyze

        Returns:
            List of found cultural markers with confidence scores
        """
        found_markers = []

        for marker, confidence in self.iraqi_cultural_markers.items():
            if marker in content:
                found_markers.append(
                    {
                        "marker": marker,
                        "confidence": confidence,
                        "type": "cultural_positive",
                        "found_at": content.find(marker),
                    }
                )

        return found_markers

    async def _analyze_content_snippet(self, content: str) -> Dict[str, any]:
        """
        Analyze a small content snippet for cultural issues.

        Args:
            content: Content snippet to analyze

        Returns:
            Snippet analysis results
        """
        return {
            "requires_validation": len(content) > 50
            and (
                self.is_arabic_rtl_content(content)
                or self.is_iraqi_content_detected(content)
                or any(
                    pattern.lower() in content.lower()
                    for pattern in self.inappropriate_content_patterns
                )
            ),
            "cultural_risk_score": await self._calculate_cultural_score(content),
            "content_type": "user_generated"
            if self._appears_user_generated(content)
            else "page_content",
        }

    def _appears_user_generated(self, content: str) -> bool:
        """Check if content appears to be user-generated."""
        user_indicators = ["comment", "post", "message", "reply", "input", "textarea"]
        return any(indicator in content.lower() for indicator in user_indicators)

    async def _analyze_user_input(self, input_text: str) -> Dict[str, any]:
        """
        Analyze user input for cultural violations.

        Args:
            input_text: User input text

        Returns:
            Input analysis results
        """
        analysis = {
            "cultural_violation_detected": False,
            "violation_types": [],
            "severity": "low",
            "cultural_score": await self._calculate_cultural_score(input_text),
            "islamic_compliance_score": await self._calculate_islamic_compliance_score(
                input_text
            ),
            "contains_arabic": self.is_arabic_rtl_content(input_text),
            "contains_inappropriate_content": False,
        }

        # Check for inappropriate patterns
        input_lower = input_text.lower()
        for pattern in self.inappropriate_content_patterns:
            if pattern.lower() in input_lower:
                analysis["cultural_violation_detected"] = True
                analysis["violation_types"].append(pattern)
                analysis["severity"] = (
                    "high" if len(analysis["violation_types"]) > 2 else "medium"
                )

        # Check Islamic compliance
        for pattern in self.islamic_compliance_patterns:
            if pattern.lower() in input_lower:
                analysis["cultural_violation_detected"] = True
                analysis["violation_types"].append(f"islamic_non_compliance_{pattern}")
                analysis["severity"] = "high"

        return analysis

    def _extract_changed_content(self, event) -> str:
        """
        Extract changed content from DOM change event.

        Args:
            event: DOM change event

        Returns:
            Changed content text
        """
        # In real implementation, would extract actual changed DOM content
        # For now, simulate based on event attributes

        content_parts = []

        if hasattr(event, "added_text"):
            content_parts.append(event.added_text)

        if hasattr(event, "modified_text"):
            content_parts.append(event.modified_text)

        if hasattr(event, "element_text"):
            content_parts.append(event.element_text)

        return " ".join(content_parts)

    async def _handle_cultural_violation(
        self, url: str, analysis: Dict, violation_type: str
    ) -> None:
        """
        Handle detected cultural violation.

        Args:
            url: URL where violation occurred
            analysis: Content analysis results
            violation_type: Type of violation detected
        """
        severity = self._calculate_violation_severity(analysis, violation_type)

        self.logger.warning(
            f"🚨 Cultural violation detected: {violation_type} on {url} "
            f"(Cultural Score: {analysis['cultural_score']:.2f}, "
            f"Islamic Compliance: {analysis['islamic_compliance_score']:.2f})"
        )

        # Store in violation history
        violation_record = {
            "url": url,
            "violation_type": violation_type,
            "severity": severity,
            "analysis": analysis,
            "timestamp": time.time(),
        }
        self._violation_history.append(violation_record)

        # Emit violation event
        await self.emit_iraqi_cultural_violation(
            content=f"URL: {url}", violation_type=violation_type, severity=severity
        )

    async def _handle_input_violation(
        self, input_text: str, analysis: Dict, event
    ) -> None:
        """
        Handle cultural violation in user input.

        Args:
            input_text: User input text
            analysis: Input analysis results
            event: Input event
        """
        self.logger.warning(
            f"⚠️ Cultural violation in user input: {analysis['violation_types']} "
            f"(Severity: {analysis['severity']})"
        )

        # Store violation
        violation_record = {
            "input_text": input_text[:100],  # Store first 100 chars only
            "violation_types": analysis["violation_types"],
            "severity": analysis["severity"],
            "timestamp": time.time(),
            "event_type": type(event).__name__,
        }
        self._violation_history.append(violation_record)

        # Emit violation event
        await self.emit_iraqi_cultural_violation(
            content=input_text[:50],  # Only first 50 chars for privacy
            violation_type="user_input_violation",
            severity=analysis["severity"],
        )

    async def _validate_content_snippet(
        self, url: str, content: str, analysis: Dict
    ) -> None:
        """
        Validate a content snippet for cultural appropriateness.

        Args:
            url: URL where content was found
            content: Content snippet
            analysis: Snippet analysis
        """
        if analysis["cultural_risk_score"] < self.cultural_validation_threshold:
            await self._handle_cultural_violation(
                url,
                {"cultural_score": analysis["cultural_risk_score"]},
                "dynamic_content_violation",
            )

    async def _process_arabic_content(self, url: str, analysis: Dict) -> None:
        """
        Process Arabic content and emit processing event.

        Args:
            url: URL with Arabic content
            analysis: Content analysis
        """
        # Update Arabic processing stats
        self._arabic_processing_stats["total_processed"] = (
            self._arabic_processing_stats.get("total_processed", 0) + 1
        )

        processing_result = {
            "url": url,
            "language_distribution": analysis["language_distribution"],
            "cultural_markers_found": analysis["cultural_markers_found"],
            "professional_domain": analysis["professional_domain"],
            "timestamp": time.time(),
        }

        await self.emit_arabic_content_processed(
            content=f"Arabic content on {url}",
            processing_type="page_content_analysis",
            result=processing_result,
        )

    def _calculate_violation_severity(self, analysis: Dict, violation_type: str) -> str:
        """
        Calculate severity of cultural violation.

        Args:
            analysis: Content analysis
            violation_type: Type of violation

        Returns:
            Severity level ('low', 'medium', 'high', 'critical')
        """
        base_severity = "medium"

        # High severity conditions
        if (
            analysis.get("cultural_score", 1.0) < 0.5
            or analysis.get("islamic_compliance_score", 1.0) < 0.5
        ):
            base_severity = "high"

        # Critical severity for multiple violations
        if (
            analysis.get("cultural_score", 1.0) < 0.3
            and analysis.get("islamic_compliance_score", 1.0) < 0.3
        ):
            base_severity = "critical"

        # Lower severity for minor issues
        if analysis.get("cultural_score", 1.0) > 0.8 and violation_type in [
            "dynamic_content_violation",
            "user_input_violation",
        ]:
            base_severity = "low"

        return base_severity

    async def _cleanup_analysis_cache(self) -> None:
        """Clean up old cache entries."""
        current_time = time.time()
        expired_keys = [
            key
            for key, analysis in self._content_analysis_cache.items()
            if current_time - analysis.get("timestamp", 0) > 1800  # 30 minutes
        ]

        for key in expired_keys:
            del self._content_analysis_cache[key]

        # Cleanup violation history (keep last 1000 entries)
        if len(self._violation_history) > 1000:
            self._violation_history = self._violation_history[-1000:]

        # Cleanup cultural scores history (keep last 500 entries)
        if len(self._cultural_scores_history) > 500:
            self._cultural_scores_history = self._cultural_scores_history[-500:]
