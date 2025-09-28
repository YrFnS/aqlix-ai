"""Enhanced DOM Views and Data Structures with Iraqi AI Integration.

Comprehensive data models for DOM processing with Arabic RTL support,
cultural validation, and accessibility integration.
"""

from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any, Union
from enum import Enum, IntEnum

from .enhanced_snapshot import SnapshotNodeData


class NodeType(IntEnum):
    """Enhanced DOM node types with Iraqi AI considerations."""

    ELEMENT_NODE = 1
    ATTRIBUTE_NODE = 2
    TEXT_NODE = 3
    CDATA_SECTION_NODE = 4
    ENTITY_REFERENCE_NODE = 5
    ENTITY_NODE = 6
    PROCESSING_INSTRUCTION_NODE = 7
    COMMENT_NODE = 8
    DOCUMENT_NODE = 9
    DOCUMENT_TYPE_NODE = 10
    DOCUMENT_FRAGMENT_NODE = 11
    NOTATION_NODE = 12

    # Iraqi AI specific node classifications
    ARABIC_TEXT_NODE = 100
    RTL_ELEMENT_NODE = 101
    ISLAMIC_CONTENT_NODE = 102
    GOVERNMENT_FORM_NODE = 103


class CulturalValidationLevel(Enum):
    """Cultural validation levels for Iraqi AI processing."""

    STRICT = "strict"  # Full Islamic compliance required
    MODERATE = "moderate"  # Basic cultural sensitivity
    PERMISSIVE = "permissive"  # Minimal validation
    GOVERNMENT = "government"  # Iraqi government standards


class AccessibilityLevel(Enum):
    """Accessibility compliance levels."""

    WCAG_A = "wcag-a"
    WCAG_AA = "wcag-aa"
    WCAG_AAA = "wcag-aaa"
    IRAQI_STANDARD = "iraqi-standard"


@dataclass
class DOMRect:
    """Enhanced DOM rectangle with Iraqi AI coordinate processing."""

    x: float
    y: float
    width: float
    height: float

    # Iraqi AI enhancements
    rtl_adjusted_x: Optional[float] = None
    rtl_adjusted_y: Optional[float] = None
    cultural_zone: Optional[str] = None  # 'safe', 'warning', 'restricted'

    def __post_init__(self):
        """Post-initialization for Iraqi AI processing."""
        if self.rtl_adjusted_x is None:
            self.rtl_adjusted_x = self.x
        if self.rtl_adjusted_y is None:
            self.rtl_adjusted_y = self.y
        if self.cultural_zone is None:
            self.cultural_zone = "safe"

    def get_center(self) -> tuple[float, float]:
        """Get center point coordinates."""
        return (self.x + self.width / 2, self.y + self.height / 2)

    def get_rtl_center(self) -> tuple[float, float]:
        """Get RTL-adjusted center point coordinates."""
        return (
            self.rtl_adjusted_x + self.width / 2,
            self.rtl_adjusted_y + self.height / 2,
        )

    def contains_point(self, x: float, y: float) -> bool:
        """Check if point is within rectangle."""
        return (
            self.x <= x <= self.x + self.width and self.y <= y <= self.y + self.height
        )

    def intersects(self, other: "DOMRect") -> bool:
        """Check if this rectangle intersects with another."""
        return not (
            self.x + self.width < other.x
            or other.x + other.width < self.x
            or self.y + self.height < other.y
            or other.y + other.height < self.y
        )


@dataclass
class EnhancedAXProperty:
    """Enhanced accessibility property with Iraqi AI validation."""

    name: str
    value: Optional[Any] = None

    # Iraqi AI enhancements
    cultural_appropriate: bool = True
    arabic_translation: Optional[str] = None
    islamic_compliant: bool = True

    def __post_init__(self):
        """Validate property for Iraqi AI compliance."""
        self._validate_cultural_appropriateness()
        self._check_islamic_compliance()

    def _validate_cultural_appropriateness(self):
        """Validate cultural appropriateness of the property."""
        if not self.value:
            return

        value_str = str(self.value).lower()
        inappropriate_content = ["alcohol", "pork", "gambling", "dating"]

        self.cultural_appropriate = not any(
            inappropriate in value_str for inappropriate in inappropriate_content
        )

    def _check_islamic_compliance(self):
        """Check Islamic compliance of the property."""
        if not self.value:
            return

        value_str = str(self.value).lower()
        islamic_violations = ["nudity", "inappropriate", "haram"]

        self.islamic_compliant = not any(
            violation in value_str for violation in islamic_violations
        )


@dataclass
class EnhancedAXNode:
    """Enhanced accessibility node with Iraqi AI cultural validation."""

    ax_node_id: int
    ignored: bool
    role: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    properties: Optional[List[EnhancedAXProperty]] = None

    # Iraqi AI enhancements
    arabic_content_detected: bool = False
    cultural_compliance_score: float = 1.0
    accessibility_score: float = 0.5
    islamic_compliant: bool = True
    government_portal_element: bool = False

    def __post_init__(self):
        """Post-initialization Iraqi AI processing."""
        self._analyze_content()
        self._calculate_scores()

    def _analyze_content(self):
        """Analyze content for Arabic and cultural elements."""
        text_content = " ".join(filter(None, [self.name, self.description]))

        # Detect Arabic content
        if text_content:
            # Simple Arabic detection (looking for Arabic Unicode ranges)
            arabic_chars = any(
                "\u0600" <= char <= "\u06ff"  # Arabic
                or "\u0750" <= char <= "\u077f"  # Arabic Supplement
                or "\u08a0" <= char <= "\u08ff"  # Arabic Extended-A
                for char in text_content
            )
            self.arabic_content_detected = arabic_chars

            # Government portal detection
            government_keywords = [
                "ministry",
                "government",
                "official",
                "iraq",
                "baghdad",
            ]
            self.government_portal_element = any(
                keyword in text_content.lower() for keyword in government_keywords
            )

    def _calculate_scores(self):
        """Calculate compliance and accessibility scores."""
        # Cultural compliance scoring
        score = 1.0

        if self.properties:
            inappropriate_properties = sum(
                1
                for prop in self.properties
                if not prop.cultural_appropriate or not prop.islamic_compliant
            )
            score -= inappropriate_properties * 0.2

        if not self.name and not self.description:
            score -= 0.1  # Penalize missing accessibility info

        self.cultural_compliance_score = max(0.0, min(1.0, score))

        # Accessibility scoring
        accessibility = 0.5  # Base score

        if self.name:
            accessibility += 0.2
        if self.description:
            accessibility += 0.2
        if self.role:
            accessibility += 0.1

        self.accessibility_score = min(1.0, accessibility)

    def get_cultural_validation(self) -> Dict[str, Any]:
        """Get comprehensive cultural validation information."""
        return {
            "cultural_compliance_score": self.cultural_compliance_score,
            "accessibility_score": self.accessibility_score,
            "islamic_compliant": self.islamic_compliant,
            "arabic_content_detected": self.arabic_content_detected,
            "government_portal_element": self.government_portal_element,
            "validation_level": self._determine_validation_level(),
        }

    def _determine_validation_level(self) -> CulturalValidationLevel:
        """Determine appropriate cultural validation level."""
        if self.government_portal_element:
            return CulturalValidationLevel.GOVERNMENT
        elif self.cultural_compliance_score < 0.5:
            return CulturalValidationLevel.STRICT
        elif self.cultural_compliance_score < 0.8:
            return CulturalValidationLevel.MODERATE
        else:
            return CulturalValidationLevel.PERMISSIVE


@dataclass
class EnhancedDOMTreeNode:
    """Enhanced DOM tree node with comprehensive Iraqi AI integration."""

    node_id: Optional[int]
    backend_node_id: Optional[int]
    node_type: NodeType
    node_name: str
    node_value: Optional[str] = None
    attributes: Dict[str, str] = field(default_factory=dict)
    is_scrollable: Optional[bool] = None
    frame_id: Optional[str] = None
    session_id: Optional[str] = None
    target_id: Optional[str] = None
    content_document: Optional["EnhancedDOMTreeNode"] = None
    shadow_root_type: Optional[str] = None
    shadow_roots: Optional[List["EnhancedDOMTreeNode"]] = None
    parent_node: Optional["EnhancedDOMTreeNode"] = None
    children_nodes: Optional[List["EnhancedDOMTreeNode"]] = None
    ax_node: Optional[EnhancedAXNode] = None
    snapshot_node: Optional[SnapshotNodeData] = None
    is_visible: Optional[bool] = None
    absolute_position: Optional[DOMRect] = None
    element_index: Optional[int] = None

    # Iraqi AI enhancements
    arabic_content_score: float = 0.0
    cultural_validation_result: Optional[Dict[str, Any]] = None
    rtl_layout_applied: bool = False
    islamic_compliance_validated: bool = False
    government_form_element: bool = False
    accessibility_enhanced: bool = False

    def __post_init__(self):
        """Post-initialization Iraqi AI processing."""
        self._analyze_iraqi_characteristics()
        self._validate_cultural_compliance()
        self._enhance_accessibility()

    def _analyze_iraqi_characteristics(self):
        """Analyze node for Iraqi-specific characteristics."""
        # Analyze tag name and attributes
        tag_name = self.node_name.lower() if self.node_name else ""

        # Detect Arabic content
        text_content = self.node_value or ""
        if self.attributes:
            text_content += " " + " ".join(self.attributes.values())

        if text_content:
            arabic_char_count = sum(
                1
                for char in text_content
                if "\u0600" <= char <= "\u06ff"
                or "\u0750" <= char <= "\u077f"
                or "\u08a0" <= char <= "\u08ff"
            )
            self.arabic_content_score = min(
                1.0, arabic_char_count / max(1, len(text_content))
            )

        # Detect RTL layout
        if self.attributes:
            dir_attr = self.attributes.get("dir", "").lower()
            class_attr = self.attributes.get("class", "").lower()

            self.rtl_layout_applied = (
                dir_attr == "rtl" or "rtl" in class_attr or "arabic" in class_attr
            )

        # Detect government form elements
        if tag_name in ["form", "input", "select", "textarea"]:
            form_keywords = ["ministry", "government", "official", "national", "iraq"]
            form_indicators = (
                text_content.lower() + " ".join(self.attributes.values()).lower()
            )

            self.government_form_element = any(
                keyword in form_indicators for keyword in form_keywords
            )

    def _validate_cultural_compliance(self):
        """Validate cultural compliance with Islamic principles."""
        validation_result = {
            "score": 1.0,
            "violations": [],
            "recommendations": [],
            "islamic_compliant": True,
            "culturally_appropriate": True,
        }

        # Check for inappropriate content
        content_to_check = (self.node_value or "") + " ".join(self.attributes.values())
        content_lower = content_to_check.lower()

        inappropriate_terms = ["alcohol", "pork", "gambling", "dating", "nudity"]
        violations = [term for term in inappropriate_terms if term in content_lower]

        if violations:
            validation_result["violations"].extend(violations)
            validation_result["score"] -= len(violations) * 0.2
            validation_result["islamic_compliant"] = False
            validation_result["culturally_appropriate"] = False

        # Check for accessibility improvements
        if self.node_name and self.node_name.lower() in ["img", "button", "input"]:
            alt_text = self.attributes.get("alt", "")
            aria_label = self.attributes.get("aria-label", "")

            if not alt_text and not aria_label:
                validation_result["recommendations"].append(
                    "Add alt text or aria-label for accessibility"
                )
                validation_result["score"] -= 0.1

        # Reward RTL and Arabic support
        if self.rtl_layout_applied:
            validation_result["score"] += 0.05
        if self.arabic_content_score > 0:
            validation_result["score"] += 0.05

        validation_result["score"] = max(0.0, min(1.0, validation_result["score"]))
        self.cultural_validation_result = validation_result
        self.islamic_compliance_validated = validation_result["islamic_compliant"]

    def _enhance_accessibility(self):
        """Enhance accessibility features for Iraqi users."""
        if not self.node_name:
            return

        tag_name = self.node_name.lower()

        # Check for accessibility enhancements
        has_aria_label = "aria-label" in self.attributes
        has_role = "role" in self.attributes
        has_tabindex = "tabindex" in self.attributes

        # Interactive elements should have proper accessibility
        interactive_tags = ["button", "input", "select", "textarea", "a"]

        if tag_name in interactive_tags:
            self.accessibility_enhanced = (
                has_aria_label
                or has_role
                or self.attributes.get("alt")
                or self.attributes.get("title")
            )
        else:
            self.accessibility_enhanced = True  # Non-interactive elements are ok

    @property
    def tag_name(self) -> Optional[str]:
        """Get the tag name for element nodes."""
        if self.node_type == NodeType.ELEMENT_NODE:
            return self.node_name
        return None

    @property
    def text_content(self) -> str:
        """Get combined text content including children."""
        content = self.node_value or ""

        if self.children_nodes:
            for child in self.children_nodes:
                if child.node_type == NodeType.TEXT_NODE and child.node_value:
                    content += child.node_value

        return content.strip()

    @property
    def is_interactive_element(self) -> bool:
        """Check if this is an interactive element."""
        if not self.tag_name:
            return False

        interactive_tags = ["button", "input", "select", "textarea", "a", "form"]
        return self.tag_name.lower() in interactive_tags

    @property
    def is_arabic_element(self) -> bool:
        """Check if this element contains Arabic content."""
        return self.arabic_content_score > 0.1 or self.rtl_layout_applied

    def get_cultural_summary(self) -> Dict[str, Any]:
        """Get comprehensive cultural analysis summary."""
        return {
            "node_info": {
                "tag_name": self.tag_name,
                "node_type": self.node_type.name,
                "is_visible": self.is_visible,
                "is_interactive": self.is_interactive_element,
            },
            "arabic_integration": {
                "arabic_content_score": self.arabic_content_score,
                "rtl_layout_applied": self.rtl_layout_applied,
                "is_arabic_element": self.is_arabic_element,
            },
            "cultural_validation": self.cultural_validation_result,
            "accessibility": {
                "enhanced": self.accessibility_enhanced,
                "ax_node_available": self.ax_node is not None,
                "accessibility_score": self.ax_node.accessibility_score
                if self.ax_node
                else 0.5,
            },
            "government_integration": {
                "government_form_element": self.government_form_element,
                "government_portal_element": self.ax_node.government_portal_element
                if self.ax_node
                else False,
            },
            "islamic_compliance": {
                "validated": self.islamic_compliance_validated,
                "compliant": self.cultural_validation_result["islamic_compliant"]
                if self.cultural_validation_result
                else True,
            },
        }

    def find_elements_by_tag(self, tag_name: str) -> List["EnhancedDOMTreeNode"]:
        """Find all descendant elements with specified tag name."""
        results = []

        if self.tag_name and self.tag_name.lower() == tag_name.lower():
            results.append(self)

        if self.children_nodes:
            for child in self.children_nodes:
                results.extend(child.find_elements_by_tag(tag_name))

        if self.content_document:
            results.extend(self.content_document.find_elements_by_tag(tag_name))

        if self.shadow_roots:
            for shadow_root in self.shadow_roots:
                results.extend(shadow_root.find_elements_by_tag(tag_name))

        return results

    def find_elements_with_arabic_content(self) -> List["EnhancedDOMTreeNode"]:
        """Find all descendant elements with Arabic content."""
        results = []

        if self.is_arabic_element:
            results.append(self)

        if self.children_nodes:
            for child in self.children_nodes:
                results.extend(child.find_elements_with_arabic_content())

        if self.content_document:
            results.extend(self.content_document.find_elements_with_arabic_content())

        if self.shadow_roots:
            for shadow_root in self.shadow_roots:
                results.extend(shadow_root.find_elements_with_arabic_content())

        return results


@dataclass
class CurrentPageTargets:
    """Enhanced current page targets with Iraqi AI session management."""

    page_session: Dict[str, Any]
    iframe_sessions: List[Dict[str, Any]] = field(default_factory=list)

    # Iraqi AI enhancements
    cultural_validation_enabled: bool = True
    arabic_processing_active: bool = False
    government_portal_detected: bool = False

    def __post_init__(self):
        """Post-initialization for Iraqi AI target analysis."""
        self._analyze_targets()

    def _analyze_targets(self):
        """Analyze targets for Iraqi characteristics."""
        if self.page_session:
            url = self.page_session.get("url", "").lower()

            # Detect government portals
            government_domains = [
                ".gov.iq",
                "ministry",
                "government",
                "baghdad",
                "iraq",
            ]
            self.government_portal_detected = any(
                domain in url for domain in government_domains
            )

            # Detect Arabic content likelihood
            arabic_indicators = ["ar", "arabic", "rtl", "iraq", "baghdad"]
            self.arabic_processing_active = any(
                indicator in url for indicator in arabic_indicators
            )


@dataclass
class TargetAllTrees:
    """Enhanced target trees data with Iraqi AI processing metrics."""

    snapshot: Dict[str, Any]
    dom_tree: Dict[str, Any]
    ax_tree: Dict[str, Any]
    device_pixel_ratio: float
    cdp_timing: Dict[str, float]

    # Iraqi AI enhancements
    arabic_nodes_count: int = 0
    rtl_elements_count: int = 0
    cultural_compliance_average: float = 1.0
    accessibility_score_average: float = 0.5
    government_elements_count: int = 0

    def __post_init__(self):
        """Post-initialization Iraqi AI analysis."""
        self._analyze_trees()

    def _analyze_trees(self):
        """Analyze trees for Iraqi AI metrics."""
        # This would be populated during actual tree processing
        # For now, we'll set reasonable defaults
        pass

    def get_performance_summary(self) -> Dict[str, Any]:
        """Get comprehensive performance and cultural analysis summary."""
        return {
            "timing": self.cdp_timing,
            "device_info": {
                "device_pixel_ratio": self.device_pixel_ratio,
            },
            "content_analysis": {
                "arabic_nodes_count": self.arabic_nodes_count,
                "rtl_elements_count": self.rtl_elements_count,
                "government_elements_count": self.government_elements_count,
            },
            "quality_metrics": {
                "cultural_compliance_average": self.cultural_compliance_average,
                "accessibility_score_average": self.accessibility_score_average,
            },
            "data_size": {
                "snapshot_documents": len(self.snapshot.get("documents", [])),
                "ax_nodes": len(self.ax_tree.get("nodes", [])),
                "has_dom_tree": bool(self.dom_tree.get("root")),
            },
        }


@dataclass
class SerializedDOMState:
    """Enhanced serialized DOM state with Iraqi AI optimization."""

    serialized_content: str
    element_count: int = 0

    # Iraqi AI enhancements
    arabic_elements_count: int = 0
    cultural_validation_summary: Optional[Dict[str, Any]] = None
    accessibility_improvements: Optional[List[str]] = None
    government_forms_detected: int = 0

    def __post_init__(self):
        """Post-initialization for Iraqi AI state analysis."""
        if self.cultural_validation_summary is None:
            self.cultural_validation_summary = {
                "total_elements": self.element_count,
                "arabic_elements": self.arabic_elements_count,
                "compliance_rate": 1.0,
                "validation_timestamp": None,
            }

        if self.accessibility_improvements is None:
            self.accessibility_improvements = []

    def get_summary(self) -> Dict[str, Any]:
        """Get comprehensive DOM state summary."""
        return {
            "content_size": len(self.serialized_content),
            "element_counts": {
                "total": self.element_count,
                "arabic": self.arabic_elements_count,
                "government_forms": self.government_forms_detected,
            },
            "cultural_validation": self.cultural_validation_summary,
            "accessibility": {
                "improvements_count": len(self.accessibility_improvements),
                "improvements": self.accessibility_improvements,
            },
        }
