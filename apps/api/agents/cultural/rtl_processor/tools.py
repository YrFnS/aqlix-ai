"""
Arabic RTL Processor Tools

Tool functions for Arabic text processing, RTL formatting, and dialect recognition.
"""

from typing import Dict, Any, List, Tuple, Literal
import re
import unicodedata


class ArabicRTLTools:
    """Tools for Arabic RTL text processing and dialect recognition."""

    # Arabic character ranges
    ARABIC_RANGE = (
        r"[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]"
    )
    ARABIC_PATTERN = re.compile(ARABIC_RANGE)

    # Iraqi dialect markers (common words/phrases)
    IRAQI_DIALECT_MARKERS = [
        "شلونك",  # How are you (Iraqi)
        "شكو ماكو",  # What's up (Iraqi)
        "زين",  # Good (Iraqi)
        "هاي",  # This (Iraqi)
        "هسه",  # Now (Iraqi)
        "وين",  # Where (Iraqi)
        "شنو",  # What (Iraqi)
        "اكو",  # There is (Iraqi)
        "ماكو",  # There isn't (Iraqi)
    ]

    @staticmethod
    def detect_text_direction(text: str) -> Literal["rtl", "ltr", "mixed"]:
        """
        Detect the primary text direction.

        Args:
            text: Input text

        Returns:
            Text direction: "rtl", "ltr", or "mixed"
        """
        if not text or not text.strip():
            return "ltr"

        # Count Arabic vs Latin characters
        arabic_chars = len(ArabicRTLTools.ARABIC_PATTERN.findall(text))
        total_chars = len(re.findall(r"[a-zA-Z\u0600-\u06FF]", text))

        if total_chars == 0:
            return "ltr"

        arabic_ratio = arabic_chars / total_chars

        if arabic_ratio > 0.7:
            return "rtl"
        elif arabic_ratio < 0.3:
            return "ltr"
        else:
            return "mixed"

    @staticmethod
    def detect_iraqi_dialect(text: str) -> Dict[str, Any]:
        """
        Detect Iraqi Arabic dialect in text.

        Args:
            text: Arabic text to analyze

        Returns:
            Detection result with dialect type and confidence
        """
        if not text or not ArabicRTLTools.ARABIC_PATTERN.search(text):
            return {
                "dialect": "none",
                "confidence": 0.0,
                "markers_found": [],
                "is_iraqi": False,
            }

        # Check for Iraqi dialect markers
        markers_found = [
            marker for marker in ArabicRTLTools.IRAQI_DIALECT_MARKERS if marker in text
        ]

        # Calculate confidence based on markers found
        confidence = min(len(markers_found) * 0.3, 1.0)

        # Check for MSA indicators (formal language, case endings, etc.)
        # TODO: Implement more sophisticated MSA detection

        if markers_found:
            return {
                "dialect": "iraqi",
                "confidence": max(confidence, 0.85),  # At least 85% if markers found
                "markers_found": markers_found,
                "is_iraqi": True,
            }

        # Default to MSA for formal Arabic text
        return {
            "dialect": "msa",
            "confidence": 0.7,
            "markers_found": [],
            "is_iraqi": False,
        }

    @staticmethod
    def format_rtl_text(
        text: str, format_type: Literal["unicode", "html", "css"] = "unicode"
    ) -> str:
        """
        Format text with RTL directionality markers.

        Args:
            text: Input text
            format_type: Output format (unicode, html, css)

        Returns:
            Formatted text with RTL markers
        """
        direction = ArabicRTLTools.detect_text_direction(text)

        if format_type == "unicode":
            # Unicode direction markers
            if direction == "rtl":
                return f"\u202b{text}\u202c"  # RLE + text + PDF
            elif direction == "ltr":
                return f"\u202a{text}\u202c"  # LRE + text + PDF
            else:  # mixed
                # Wrap Arabic segments with RLM
                return ArabicRTLTools._wrap_arabic_segments(text)

        elif format_type == "html":
            if direction == "rtl":
                return f'<div dir="rtl" lang="ar">{text}</div>'
            elif direction == "ltr":
                return f'<div dir="ltr">{text}</div>'
            else:  # mixed
                return f'<div dir="auto">{text}</div>'

        elif format_type == "css":
            if direction == "rtl":
                return f'<span class="text-rtl font-arabic">{text}</span>'
            elif direction == "ltr":
                return f'<span class="text-ltr">{text}</span>'
            else:  # mixed
                return f'<span class="text-auto font-arabic">{text}</span>'

        return text

    @staticmethod
    def _wrap_arabic_segments(text: str) -> str:
        """
        Wrap Arabic segments in mixed text with RLM markers.
        Fixed: Prevents overlapping matches by tracking current position.

        Args:
            text: Mixed Arabic-English text

        Returns:
            Text with Arabic segments wrapped in RLM
        """
        # Find Arabic segments
        segments = []
        current_pos = 0

        for match in ArabicRTLTools.ARABIC_PATTERN.finditer(text):
            # Skip matches before current position (prevents overlapping)
            if match.start() < current_pos:
                continue

            # Add LTR text before Arabic
            if match.start() > current_pos:
                segments.append(text[current_pos : match.start()])

            # Find end of Arabic segment
            end_pos = match.end()
            while end_pos < len(text) and ArabicRTLTools.ARABIC_PATTERN.match(
                text[end_pos]
            ):
                end_pos += 1

            # Add Arabic segment with RLM
            arabic_segment = text[match.start() : end_pos]
            segments.append(f"\u200f{arabic_segment}\u200f")  # RLM markers

            current_pos = end_pos

        # Add remaining LTR text
        if current_pos < len(text):
            segments.append(text[current_pos:])

        return "".join(segments)

    @staticmethod
    def detect_code_switching(text: str) -> Dict[str, Any]:
        """
        Detect Arabic-English code-switching in text.
        Fixed: Properly initialize prev_is_arabic before loop to prevent first-char false positive.

        Args:
            text: Input text

        Returns:
            Code-switching analysis result
        """
        # Find Arabic segments
        arabic_segments = ArabicRTLTools.ARABIC_PATTERN.findall(text)

        # Find English segments (simple Latin alphabet detection)
        english_segments = re.findall(r"[a-zA-Z]+", text)

        has_arabic = len(arabic_segments) > 0
        has_english = len(english_segments) > 0
        is_code_switching = has_arabic and has_english

        # Calculate switching points (transitions between Arabic and English)
        switching_points = 0
        if is_code_switching:
            # Initialize with first character type to avoid counting first char as switch
            prev_is_arabic = None
            for char in text:
                is_arabic = bool(ArabicRTLTools.ARABIC_PATTERN.match(char))
                is_english = char.isalpha() and not is_arabic

                # Only count switches after first character is identified
                if prev_is_arabic is not None:
                    if is_arabic and not prev_is_arabic and has_english:
                        switching_points += 1
                    elif is_english and prev_is_arabic:
                        switching_points += 1

                # Update prev_is_arabic only for actual Arabic or English characters
                if is_arabic or is_english:
                    prev_is_arabic = is_arabic

        return {
            "is_code_switching": is_code_switching,
            "has_arabic": has_arabic,
            "has_english": has_english,
            "switching_points": switching_points,
            "arabic_ratio": (
                len("".join(arabic_segments)) / len(text) if text else 0.0
            ),
            "complexity": "high"
            if switching_points > 3
            else "medium"
            if switching_points > 1
            else "low",
        }

    @staticmethod
    def normalize_arabic_text(text: str, normalize_taa_marbuta: bool = False) -> str:
        """
        Normalize Arabic text (remove diacritics, normalize forms).
        Fixed: Added normalize_taa_marbuta parameter to prevent semantic changes.

        Args:
            text: Arabic text
            normalize_taa_marbuta: If True, converts ة (taa marbuta) to ه (haa).
                                   Default False to preserve word semantics.

        Returns:
            Normalized Arabic text
        """
        if not text:
            return text

        # Apply Unicode NFC normalization for consistent representation
        text = unicodedata.normalize("NFC", text)

        # Remove Arabic diacritics (tashkeel)
        diacritics = re.compile(
            r"[\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]"
        )
        text = diacritics.sub("", text)

        # Normalize Arabic letters
        # Alef variations -> Alef
        text = re.sub(r"[إأآا]", "ا", text)

        # Taa marbuta -> Haa (ONLY if explicitly requested)
        # This changes word semantics, so it's optional
        if normalize_taa_marbuta:
            text = text.replace("ة", "ه")

        # Remove tatweel (kashida)
        text = text.replace("\u0640", "")

        return text

    @staticmethod
    def get_rtl_metadata(text: str) -> Dict[str, Any]:
        """
        Get comprehensive RTL metadata for text.

        Args:
            text: Input text

        Returns:
            RTL metadata dictionary
        """
        direction = ArabicRTLTools.detect_text_direction(text)
        arabic_chars = len(ArabicRTLTools.ARABIC_PATTERN.findall(text))
        total_chars = len(text)

        return {
            "text_direction": direction,
            "arabic_char_count": arabic_chars,
            "total_char_count": total_chars,
            "arabic_ratio": arabic_chars / total_chars if total_chars > 0 else 0.0,
            "requires_rtl_formatting": direction in ["rtl", "mixed"],
            "unicode_direction_marker": "\u202b" if direction == "rtl" else "\u202a",
            "html_dir_attribute": direction,
            "css_class": f"text-{direction}",
        }
