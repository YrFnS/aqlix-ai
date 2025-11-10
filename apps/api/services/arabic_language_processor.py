"""
Arabic Language Processor

Analyzes Arabic text to detect language percentage, RTL requirements, and Iraqi dialect markers.
Uses Unicode ranges for reliable Arabic character detection and Iraqi dialect identification.
"""

import threading
import unicodedata
import re
from dataclasses import dataclass
from typing import Optional
from enum import Enum


class ArabicDialect(str, Enum):
    """Iraqi Arabic dialect indicators."""

    IRAQI = "iraqi"
    MSA = "msa"  # Modern Standard Arabic
    MIXED = "mixed"
    UNKNOWN = "unknown"


@dataclass
class ArabicAnalysis:
    """Result of Arabic text analysis."""

    arabic_percentage: float  # 0-100, percentage of Arabic characters
    rtl_required: bool  # Whether RTL formatting is needed
    dialect: ArabicDialect  # Detected dialect
    dialect_confidence: float  # 0-1, confidence in dialect detection
    has_diacritics: bool  # Whether text includes diacritical marks
    code_switching_detected: bool  # Whether text switches between Arabic/English
    iraqi_markers: list[str]  # Detected Iraqi dialect markers
    raw_text: str  # Original text analyzed


class ArabicLanguageProcessor:
    """Process and analyze Arabic text for language detection and formatting."""

    # Unicode ranges for Arabic characters
    # Reference: https://en.wikipedia.org/wiki/Arabic_(Unicode_block)
    ARABIC_RANGES = [
        (0x0600, 0x06FF),  # Arabic block
        (0x0750, 0x077F),  # Arabic Supplement
        (0x08A0, 0x08FF),  # Arabic Extended-A
        (0xFB50, 0xFDFF),  # Arabic Presentation Forms-A
        (0xFE70, 0xFEFF),  # Arabic Presentation Forms-B
    ]

    # Iraqi dialect markers with common usage (regex word boundaries for accurate matching)
    IRAQI_MARKERS = {
        "شلونك": "How are you (Iraqi)",
        "شلونكم": "How are you all (Iraqi)",
        "شكو": "What (Iraqi colloquial)",
        "ماكو": "There is no (Iraqi colloquial)",
        "اكو": "There is (Iraqi colloquial)",
        "وين": "Where (Iraqi colloquial)",
        "شنو": "What (Iraqi colloquial)",
        "يلا": "Let's go (Iraqi colloquial)",
        "هاي": "This (Iraqi colloquial)",
        "هسه": "Now (Iraqi colloquial)",
        "زين": "Good/OK (Iraqi colloquial)",
        "بس": "But/Only (Iraqi colloquial)",
        "يا": "Oh (Iraqi colloquial)",
        "ياخذ": "Takes (Iraqi colloquial)",
        "ماني": "I'm not (Iraqi colloquial)",
        "قول": "Say (Iraqi colloquial)",
        "قالت": "She said (Iraqi colloquial)",
        "روح": "Go (Iraqi colloquial)",
        "تفضل": "Please/Go ahead (Iraqi colloquial)",
        "خلاص": "That's it/Enough (Iraqi colloquial)",
    }

    # MSA-specific markers (Modern Standard Arabic)
    MSA_MARKERS = {
        "الذي": "The one who (MSA)",
        "التي": "The one who (MSA, feminine)",
        "الذين": "Those who (MSA)",
        "اللواتي": "Those who (MSA, feminine)",
        "هؤلاء": "These (MSA)",
        "أولئك": "Those (MSA)",
        "إن": "Indeed (MSA)",
        "أما": "As for (MSA)",
        "لكن": "But (MSA)",
        "غير": "Other than (MSA)",
        "سوف": "Will (MSA)",
        "يجب": "Must (MSA)",
        "يمكن": "Can (MSA)",
        "ضد": "Against (MSA)",
        "بدلا": "Instead (MSA)",
    }

    def analyze_text(self, text: str) -> ArabicAnalysis:
        """
        Analyze text for Arabic language properties.

        Args:
            text: The text to analyze

        Returns:
            ArabicAnalysis with detected properties
        """
        if not text:
            return ArabicAnalysis(
                arabic_percentage=0.0,
                rtl_required=False,
                dialect=ArabicDialect.UNKNOWN,
                dialect_confidence=0.0,
                has_diacritics=False,
                code_switching_detected=False,
                iraqi_markers=[],
                raw_text=text,
            )

        # Calculate Arabic percentage using consistent Unicode ranges
        arabic_char_count = sum(1 for char in text if self._is_arabic_char(char))
        # Count meaningful characters (letters and digits, excluding spaces/punctuation)
        total_chars = sum(
            1 for char in text if self._is_arabic_char(char) or char.isalnum()
        )
        arabic_percentage = (
            (arabic_char_count / total_chars * 100) if total_chars > 0 else 0
        )

        # Detect if RTL is needed
        rtl_required = arabic_percentage > 10  # 10%+ Arabic requires RTL

        # Detect diacritics
        has_diacritics = any(0x064B <= ord(char) <= 0x065F for char in text)

        # Detect code-switching
        code_switching_detected = self._detect_code_switching(text, arabic_percentage)

        # Detect dialect
        dialect, confidence, markers = self._detect_iraqi_dialect(text)

        return ArabicAnalysis(
            arabic_percentage=round(arabic_percentage, 2),
            rtl_required=rtl_required,
            dialect=dialect,
            dialect_confidence=round(confidence, 2),
            has_diacritics=has_diacritics,
            code_switching_detected=code_switching_detected,
            iraqi_markers=markers,
            raw_text=text,
        )

    def _is_arabic_char(self, char: str) -> bool:
        """
        Check if character is Arabic using Unicode ranges.

        Args:
            char: Single character to check

        Returns:
            True if character is in Arabic Unicode ranges
        """
        char_code = ord(char)
        for start, end in self.ARABIC_RANGES:
            if start <= char_code <= end:
                return True
        return False

    def _detect_iraqi_dialect(
        self, text: str
    ) -> tuple[ArabicDialect, float, list[str]]:
        """
        Detect Iraqi dialect markers in text using word boundary regex.

        Args:
            text: Text to analyze

        Returns:
            Tuple of (dialect, confidence 0-1, list of detected markers)
        """
        # Normalize text for consistent Unicode comparison
        normalized_text = unicodedata.normalize("NFC", text)

        detected_iraqi_markers = []
        detected_msa_markers = []

        # Check for Iraqi markers using regex word boundaries
        for marker in self.IRAQI_MARKERS:
            # Use word boundary pattern for Arabic (surrounded by non-Arabic or string boundaries)
            pattern = (
                r"(?:^|[^\u0600-\u06FF])"
                + re.escape(marker)
                + r"(?:[^\u0600-\u06FF]|$)"
            )
            if re.search(pattern, normalized_text):
                detected_iraqi_markers.append(marker)

        # Check for MSA markers using regex word boundaries
        for marker in self.MSA_MARKERS:
            pattern = (
                r"(?:^|[^\u0600-\u06FF])"
                + re.escape(marker)
                + r"(?:[^\u0600-\u06FF]|$)"
            )
            if re.search(pattern, normalized_text):
                detected_msa_markers.append(marker)

        # Determine dialect based on markers found
        total_markers = len(detected_iraqi_markers) + len(detected_msa_markers)

        if total_markers == 0:
            return ArabicDialect.UNKNOWN, 0.0, []

        iraqi_score = (
            len(detected_iraqi_markers) / total_markers if total_markers > 0 else 0
        )
        msa_score = (
            len(detected_msa_markers) / total_markers if total_markers > 0 else 0
        )

        # Determine dominant dialect
        if iraqi_score > 0.5:
            return ArabicDialect.IRAQI, min(iraqi_score, 0.95), detected_iraqi_markers
        elif msa_score > 0.5:
            return ArabicDialect.MSA, min(msa_score, 0.95), detected_msa_markers
        elif iraqi_score > 0:
            return (
                ArabicDialect.MIXED,
                min(max(iraqi_score, msa_score), 0.80),
                detected_iraqi_markers + detected_msa_markers,
            )
        else:
            return ArabicDialect.UNKNOWN, 0.0, []

    def _detect_code_switching(self, text: str, arabic_percentage: float) -> bool:
        """
        Detect if text switches between Arabic and English/Latin.

        Args:
            text: Text to analyze
            arabic_percentage: Already calculated Arabic percentage

        Returns:
            True if both Arabic and non-Arabic scripts are present
        """
        # Code-switching occurs when there's significant Arabic and non-Arabic content
        if arabic_percentage <= 10 or arabic_percentage >= 90:
            return False

        # Check for presence of Latin characters
        has_latin = any(
            ("a" <= char <= "z" or "A" <= char <= "Z" or char.isdigit())
            for char in text
        )

        return has_latin and arabic_percentage > 0

    def normalize_text(self, text: str) -> str:
        """
        Normalize Arabic text by removing diacritics and applying Unicode NFC normalization.

        Args:
            text: Text to normalize

        Returns:
            Normalized text without diacritical marks
        """
        # Apply Unicode NFC normalization first
        text = unicodedata.normalize("NFC", text)

        # Remove Arabic diacritical marks (harakat)
        diacritics = [chr(code) for code in range(0x064B, 0x0660)]
        for diacritic in diacritics:
            text = text.replace(diacritic, "")
        return text

    def get_text_direction(self, text: str) -> str:
        """
        Determine text direction based on content.

        Args:
            text: Text to analyze

        Returns:
            "rtl" for right-to-left, "ltr" for left-to-right, or "auto"
        """
        analysis = self.analyze_text(text)

        if analysis.rtl_required:
            if analysis.arabic_percentage > 80:
                return "rtl"
            elif analysis.code_switching_detected:
                return "auto"  # Let browser decide
            else:
                return "rtl"
        else:
            return "ltr"


# Singleton instance for global use
_processor_instance: Optional[ArabicLanguageProcessor] = None
_processor_lock = threading.Lock()


def get_arabic_processor() -> ArabicLanguageProcessor:
    """Get singleton instance of Arabic Language Processor."""
    global _processor_instance
    if _processor_instance is None:
        with _processor_lock:
            if _processor_instance is None:
                _processor_instance = ArabicLanguageProcessor()
    return _processor_instance
