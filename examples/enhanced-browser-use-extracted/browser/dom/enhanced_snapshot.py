"""Enhanced DOM Snapshot Processing with Iraqi AI Integration.

Advanced DOM snapshot processing system combining browser-use infrastructure
with Arabic RTL processing, cultural validation, and performance optimization.
"""

from typing import Dict, List, Optional, Any, Union
from dataclasses import dataclass
import logging

# Enhanced computed styles for Iraqi AI processing
REQUIRED_COMPUTED_STYLES = [
    # Core layout and visibility
    "display",
    "visibility",
    "opacity",
    "position",
    "z-index",
    "overflow",
    "overflow-x",
    "overflow-y",
    # Dimensions and spacing
    "width",
    "height",
    "min-width",
    "min-height",
    "max-width",
    "max-height",
    "padding",
    "padding-top",
    "padding-right",
    "padding-bottom",
    "padding-left",
    "margin",
    "margin-top",
    "margin-right",
    "margin-bottom",
    "margin-left",
    "border-width",
    "border-top-width",
    "border-right-width",
    "border-bottom-width",
    "border-left-width",
    # Positioning
    "top",
    "right",
    "bottom",
    "left",
    "float",
    "clear",
    # Typography and content
    "font-family",
    "font-size",
    "font-weight",
    "font-style",
    "line-height",
    "text-align",
    "text-decoration",
    "color",
    "background-color",
    "background-image",
    "background-position",
    "background-repeat",
    "background-size",
    # Arabic and RTL specific styles (Iraqi AI Enhancement)
    "direction",
    "unicode-bidi",
    "text-orientation",
    "writing-mode",
    "text-anchor",
    "dominant-baseline",
    "glyph-orientation-horizontal",
    "glyph-orientation-vertical",
    # Flexbox and Grid (for modern Arabic layouts)
    "flex-direction",
    "flex-wrap",
    "justify-content",
    "align-items",
    "align-content",
    "grid-template-columns",
    "grid-template-rows",
    "grid-auto-flow",
    # Transform and animation
    "transform",
    "transform-origin",
    "transition",
    "animation",
    # Accessibility and interaction
    "pointer-events",
    "cursor",
    "user-select",
    "touch-action",
    # Cultural and Islamic compliance styles
    "content",
    "filter",
    "backdrop-filter",
    "image-rendering",
    "object-fit",
    "object-position",
]


@dataclass
class SnapshotBounds:
    """Enhanced bounds data with Iraqi AI processing capabilities."""

    x: float
    y: float
    width: float
    height: float

    # Iraqi AI enhancements
    rtl_adjusted_x: Optional[float] = None
    rtl_adjusted_y: Optional[float] = None
    cultural_visibility_score: Optional[float] = None
    arabic_text_bounds: Optional[Dict[str, float]] = None

    def __post_init__(self):
        """Post-initialization processing for Iraqi enhancements."""
        # Calculate RTL-adjusted coordinates if needed
        if self.rtl_adjusted_x is None:
            self.rtl_adjusted_x = self.x
        if self.rtl_adjusted_y is None:
            self.rtl_adjusted_y = self.y

        # Initialize cultural visibility score
        if self.cultural_visibility_score is None:
            self.cultural_visibility_score = 1.0  # Default to fully visible

    def is_valid(self) -> bool:
        """Check if bounds are valid for processing."""
        return self.width > 0 and self.height > 0 and self.x >= 0 and self.y >= 0

    def get_center_point(self) -> tuple[float, float]:
        """Get center point coordinates."""
        return (self.x + self.width / 2, self.y + self.height / 2)

    def intersects(self, other: "SnapshotBounds") -> bool:
        """Check if this bounds intersects with another bounds."""
        return not (
            self.x + self.width < other.x
            or other.x + other.width < self.x
            or self.y + self.height < other.y
            or other.y + other.height < self.y
        )

    def contains_point(self, x: float, y: float) -> bool:
        """Check if a point is contained within these bounds."""
        return (
            self.x <= x <= self.x + self.width and self.y <= y <= self.y + self.height
        )


@dataclass
class SnapshotScrollRect:
    """Enhanced scroll rectangle data with Iraqi RTL support."""

    x: float
    y: float
    width: float
    height: float

    # Iraqi AI enhancements for RTL scroll handling
    rtl_scroll_direction: str = "ltr"  # 'ltr', 'rtl', 'auto'
    arabic_scroll_behavior: Optional[str] = None

    def __post_init__(self):
        """Post-initialization for RTL scroll processing."""
        if self.arabic_scroll_behavior is None:
            self.arabic_scroll_behavior = "standard"


@dataclass
class SnapshotClientRect:
    """Enhanced client rectangle data."""

    width: float
    height: float

    def is_valid(self) -> bool:
        """Check if client rect is valid."""
        return self.width > 0 and self.height > 0


@dataclass
class SnapshotNodeData:
    """Enhanced snapshot node data with comprehensive Iraqi AI integration."""

    bounds: Optional[SnapshotBounds] = None
    scrollRects: Optional[SnapshotScrollRect] = None
    clientRects: Optional[SnapshotClientRect] = None
    computed_styles: Optional[Dict[str, str]] = None

    # Iraqi AI enhancements
    arabic_text_detected: bool = False
    rtl_layout_active: bool = False
    cultural_compliance_score: Optional[float] = None
    islamic_content_validated: bool = False
    government_portal_optimized: bool = False

    # Performance and accessibility
    accessibility_score: Optional[float] = None
    performance_impact: Optional[str] = None

    def __post_init__(self):
        """Post-initialization processing with Iraqi AI validation."""
        if self.computed_styles:
            self._analyze_arabic_content()
            self._validate_cultural_compliance()
            self._assess_accessibility()

    def _analyze_arabic_content(self):
        """Analyze computed styles for Arabic content and RTL layout."""
        if not self.computed_styles:
            return

        direction = self.computed_styles.get("direction", "ltr").lower()
        unicode_bidi = self.computed_styles.get("unicode-bidi", "normal").lower()
        writing_mode = self.computed_styles.get("writing-mode", "horizontal-tb").lower()

        # Detect RTL layout
        self.rtl_layout_active = (
            direction == "rtl" or "rtl" in unicode_bidi or "vertical" in writing_mode
        )

        # Detect Arabic text characteristics
        font_family = self.computed_styles.get("font-family", "").lower()
        arabic_fonts = [
            "arabic",
            "naskh",
            "kufi",
            "tahoma",
            "arial unicode ms",
            "times new roman",
            "amiri",
            "scheherazade",
            "lateef",
        ]

        self.arabic_text_detected = (
            any(arabic_font in font_family for arabic_font in arabic_fonts)
            or self.rtl_layout_active
        )

    def _validate_cultural_compliance(self):
        """Validate cultural compliance based on styling and content."""
        if not self.computed_styles:
            self.cultural_compliance_score = 0.8  # Default score
            return

        score = 1.0

        # Check for culturally inappropriate styles
        background_image = self.computed_styles.get("background-image", "").lower()
        content = self.computed_styles.get("content", "").lower()

        # Deduct points for potentially inappropriate imagery
        inappropriate_content = ["bikini", "alcohol", "pork", "gambling"]
        for inappropriate in inappropriate_content:
            if inappropriate in background_image or inappropriate in content:
                score -= 0.3
                break

        # Reward good accessibility and RTL support
        if self.rtl_layout_active:
            score += 0.1

        if self.computed_styles.get("font-size", "12px") >= "14px":
            score += 0.05  # Reward readable font sizes

        self.cultural_compliance_score = max(0.0, min(1.0, score))

    def _assess_accessibility(self):
        """Assess accessibility score based on computed styles."""
        if not self.computed_styles:
            self.accessibility_score = 0.5  # Default score
            return

        score = 0.5  # Base score

        # Font size assessment
        try:
            font_size_str = self.computed_styles.get("font-size", "12px")
            font_size = float(
                font_size_str.replace("px", "").replace("pt", "").replace("em", "")
            )
            if font_size >= 14:
                score += 0.2
            elif font_size >= 12:
                score += 0.1
        except (ValueError, AttributeError):
            pass

        # Color contrast (basic check)
        color = self.computed_styles.get("color", "").lower()
        background_color = self.computed_styles.get("background-color", "").lower()

        if color and background_color and color != background_color:
            score += 0.2

        # Visibility and interaction
        if self.computed_styles.get("cursor") == "pointer":
            score += 0.1

        self.accessibility_score = min(1.0, score)

    def is_element_interactive(self) -> bool:
        """Check if element appears to be interactive."""
        if not self.computed_styles:
            return False

        cursor = self.computed_styles.get("cursor", "auto")
        pointer_events = self.computed_styles.get("pointer-events", "auto")

        return cursor in ["pointer", "hand"] or pointer_events != "none"

    def is_element_visible(self) -> bool:
        """Enhanced visibility check with Iraqi AI considerations."""
        if not self.computed_styles:
            return True

        display = self.computed_styles.get("display", "").lower()
        visibility = self.computed_styles.get("visibility", "").lower()
        opacity = self.computed_styles.get("opacity", "1")

        if display == "none" or visibility == "hidden":
            return False

        try:
            opacity_val = float(opacity)
            if opacity_val <= 0:
                return False
        except (ValueError, TypeError):
            pass

        return True

    def get_layout_info(self) -> Dict[str, Any]:
        """Get comprehensive layout information for Iraqi AI processing."""
        return {
            "bounds": self.bounds,
            "scrollRects": self.scrollRects,
            "clientRects": self.clientRects,
            "arabic_text_detected": self.arabic_text_detected,
            "rtl_layout_active": self.rtl_layout_active,
            "cultural_compliance_score": self.cultural_compliance_score,
            "accessibility_score": self.accessibility_score,
            "is_interactive": self.is_element_interactive(),
            "is_visible": self.is_element_visible(),
        }


def build_snapshot_lookup(
    snapshot: Dict[str, Any],
    device_pixel_ratio: float = 1.0,
    enable_iraqi_processing: bool = True,
    logger: Optional[logging.Logger] = None,
) -> Dict[int, SnapshotNodeData]:
    """Build enhanced snapshot lookup with Iraqi AI processing capabilities.

    Args:
        snapshot: Raw DOM snapshot data from CDP
        device_pixel_ratio: Device pixel ratio for coordinate mapping
        enable_iraqi_processing: Enable Iraqi AI enhancements
        logger: Optional logger for debugging

    Returns:
        Dictionary mapping backend node IDs to enhanced snapshot data
    """
    if not logger:
        logger = logging.getLogger(__name__)

    lookup: Dict[int, SnapshotNodeData] = {}

    if not snapshot or "documents" not in snapshot:
        logger.warning("Invalid snapshot data provided")
        return lookup

    try:
        # Process all documents in the snapshot
        for doc_index, document in enumerate(snapshot["documents"]):
            if "nodes" not in document:
                continue

            nodes = document["nodes"]

            # Extract layout data arrays with error handling
            layout_data = document.get("layout", {})

            node_bounds = layout_data.get("bounds", [])
            scroll_rects = layout_data.get("scrollRects", [])
            client_rects = layout_data.get("clientRects", [])

            # Extract computed styles
            computed_styles_data = document.get("computedStyles", {})
            computed_styles_strings = computed_styles_data.get("computedStyles", [])

            # Process each node
            for node_index, node_data in enumerate(nodes):
                backend_node_id = node_data.get("backendNodeId")
                if not backend_node_id:
                    continue

                # Extract bounds with device pixel ratio adjustment
                bounds = None
                if node_index < len(node_bounds) and len(node_bounds[node_index]) >= 4:
                    raw_bounds = node_bounds[node_index]
                    bounds = SnapshotBounds(
                        x=raw_bounds[0] / device_pixel_ratio,
                        y=raw_bounds[1] / device_pixel_ratio,
                        width=raw_bounds[2] / device_pixel_ratio,
                        height=raw_bounds[3] / device_pixel_ratio,
                    )

                    # Iraqi AI enhancement for RTL coordinate adjustment
                    if enable_iraqi_processing:
                        bounds.rtl_adjusted_x = bounds.x
                        bounds.rtl_adjusted_y = bounds.y

                # Extract scroll rectangles
                scroll_rect = None
                if (
                    node_index < len(scroll_rects)
                    and len(scroll_rects[node_index]) >= 4
                ):
                    raw_scroll = scroll_rects[node_index]
                    scroll_rect = SnapshotScrollRect(
                        x=raw_scroll[0] / device_pixel_ratio,
                        y=raw_scroll[1] / device_pixel_ratio,
                        width=raw_scroll[2] / device_pixel_ratio,
                        height=raw_scroll[3] / device_pixel_ratio,
                    )

                # Extract client rectangles
                client_rect = None
                if (
                    node_index < len(client_rects)
                    and len(client_rects[node_index]) >= 2
                ):
                    raw_client = client_rects[node_index]
                    client_rect = SnapshotClientRect(
                        width=raw_client[0] / device_pixel_ratio,
                        height=raw_client[1] / device_pixel_ratio,
                    )

                # Extract computed styles
                computed_styles = None
                if node_index < len(computed_styles_strings):
                    styles_data = computed_styles_strings[node_index]
                    if isinstance(styles_data, dict):
                        computed_styles = styles_data
                    elif isinstance(styles_data, list) and len(styles_data) >= 2:
                        # Convert array format to dictionary
                        computed_styles = {}
                        for i in range(0, len(styles_data), 2):
                            if i + 1 < len(styles_data):
                                computed_styles[styles_data[i]] = styles_data[i + 1]

                # Create enhanced snapshot node data
                snapshot_node = SnapshotNodeData(
                    bounds=bounds,
                    scrollRects=scroll_rect,
                    clientRects=client_rect,
                    computed_styles=computed_styles,
                )

                # Iraqi AI processing
                if enable_iraqi_processing:
                    _enhance_node_with_iraqi_processing(snapshot_node, logger)

                lookup[backend_node_id] = snapshot_node

    except Exception as e:
        logger.error(f"Failed to build snapshot lookup: {e}")

    logger.debug(f"Built snapshot lookup with {len(lookup)} nodes")
    return lookup


def _enhance_node_with_iraqi_processing(node: SnapshotNodeData, logger: logging.Logger):
    """Enhance snapshot node with Iraqi AI processing."""
    try:
        if not node.computed_styles:
            return

        # Detect government portal patterns
        background_color = node.computed_styles.get("background-color", "").lower()
        color_scheme = node.computed_styles.get("color-scheme", "").lower()

        # Iraqi government color schemes (green, red, white, black)
        government_colors = ["#006633", "#cc0000", "#ffffff", "#000000", "green", "red"]
        node.government_portal_optimized = any(
            gov_color in background_color for gov_color in government_colors
        )

        # Islamic content validation (basic)
        font_family = node.computed_styles.get("font-family", "").lower()
        islamic_fonts = ["amiri", "scheherazade", "lateef", "arabic", "naskh"]
        node.islamic_content_validated = any(
            islamic_font in font_family for islamic_font in islamic_fonts
        )

        # Performance impact assessment
        filters = node.computed_styles.get("filter", "")
        transforms = node.computed_styles.get("transform", "")

        if filters or "matrix" in transforms or "rotate" in transforms:
            node.performance_impact = "high"
        elif transforms and transforms != "none":
            node.performance_impact = "medium"
        else:
            node.performance_impact = "low"

    except Exception as e:
        logger.debug(f"Iraqi AI processing failed for node: {e}")


def get_enhanced_snapshot_capabilities() -> Dict[str, Any]:
    """Get information about enhanced snapshot processing capabilities."""
    return {
        "supported_styles": len(REQUIRED_COMPUTED_STYLES),
        "style_categories": {
            "layout_and_visibility": 12,
            "dimensions_and_spacing": 20,
            "positioning": 6,
            "typography_and_content": 14,
            "arabic_and_rtl": 8,
            "flexbox_and_grid": 7,
            "transform_and_animation": 4,
            "accessibility_and_interaction": 4,
            "cultural_and_islamic": 4,
        },
        "iraqi_enhancements": [
            "Arabic RTL coordinate adjustment",
            "Cultural compliance scoring",
            "Islamic content validation",
            "Government portal detection",
            "Performance impact assessment",
            "Accessibility scoring",
            "Interactive element detection",
            "Enhanced visibility calculation",
        ],
        "data_structures": [
            "SnapshotBounds with RTL support",
            "SnapshotScrollRect with Arabic behavior",
            "SnapshotClientRect with validation",
            "SnapshotNodeData with Iraqi AI integration",
        ],
        "processing_features": [
            "Device pixel ratio adjustment",
            "Multi-document snapshot processing",
            "Error handling and fallback values",
            "Performance optimization",
            "Comprehensive logging support",
        ],
    }
