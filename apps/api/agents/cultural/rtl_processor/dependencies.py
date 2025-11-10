"""
Arabic RTL Processor Dependencies

Dependencies for the Arabic RTL processing agent.
"""

from dataclasses import dataclass
from typing import Literal, Optional, List
from apps.api.agents.core.models import IraqiAgentDependencies


@dataclass
class RTLProcessorDeps(IraqiAgentDependencies):
    """
    Dependencies for Arabic RTL processing agent.

    Extends base Iraqi agent dependencies with RTL-specific configuration.
    """

    # Text processing configuration
    text_direction_mode: Literal["auto", "rtl", "ltr", "mixed"] = "auto"
    dialect_detection_enabled: bool = True

    # Dialect preferences
    preferred_dialect: Literal["iraqi", "msa", "gulf", "levantine"] = "iraqi"
    fallback_to_msa: bool = True  # Fallback to Modern Standard Arabic

    # Processing options
    normalize_arabic_text: bool = True
    detect_code_switching: bool = True  # Arabic-English mixing
    preserve_english_ltr: bool = True

    # Output formatting
    include_direction_markers: bool = True  # Unicode direction markers
    format_for_web: bool = True  # HTML/CSS RTL attributes
    include_dialect_metadata: bool = True

    # Performance tuning
    cache_dialect_results: bool = True
    max_processing_time_ms: int = 100  # Target: <100ms
