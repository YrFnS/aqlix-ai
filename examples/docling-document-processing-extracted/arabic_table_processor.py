"""
Arabic Table Processing Utilities
Supporting file for IraqiTableExtractor

Features:
- RTL (Right-to-Left) table layout detection and normalization
- Arabic character handling with diacritic support
- Mixed Arabic-English cell alignment
- Iraqi number system conversion (Eastern Arabic numerals to Western)
- Table cell merging detection for Arabic documents
- Arabic text direction handling in complex tables

Usage:
    from examples.docling_document_processing_extracted.arabic_table_processor import ArabicTableProcessor

    processor = ArabicTableProcessor()
    rtl_cells = processor.normalize_rtl_cells(cells)
    arabic_text = processor.clean_arabic_text("نص عربي مع تشكيل")
"""

from typing import List, Tuple, Optional, Dict
from enum import Enum
import re
import unicodedata


class TextDirection(str, Enum):
    """Text direction for table cells"""

    LTR = "ltr"  # Left-to-Right (English, numbers)
    RTL = "rtl"  # Right-to-Left (Arabic, Farsi)
    MIXED = "mixed"  # Mixed content


class ArabicNumeralType(str, Enum):
    """Arabic numeral systems"""

    EASTERN = "eastern"  # ٠١٢٣٤٥٦٧٨٩ (used in Iraq)
    WESTERN = "western"  # 0123456789 (international)


class ArabicTableProcessor:
    """
    Utility class for processing Arabic tables with RTL awareness

    Features:
    - RTL table cell normalization
    - Arabic text cleaning (remove diacritics, normalize)
    - Eastern Arabic numeral conversion
    - Text direction detection
    - Mixed content alignment
    - Table structure validation for Arabic
    """

    # Arabic Unicode ranges
    ARABIC_RANGE = (0x0600, 0x06FF)  # Arabic block
    ARABIC_SUPPLEMENT = (0x0750, 0x077F)  # Arabic Supplement
    ARABIC_EXTENDED_A = (0x08A0, 0x08FF)  # Arabic Extended-A
    ARABIC_PRESENTATION_FORMS_A = (0xFB50, 0xFDFF)  # Presentation Forms A
    ARABIC_PRESENTATION_FORMS_B = (0xFE70, 0xFEFF)  # Presentation Forms B

    # Eastern Arabic numerals (٠-٩)
    EASTERN_NUMERALS = "٠١٢٣٤٥٦٧٨٩"
    WESTERN_NUMERALS = "0123456789"

    # Arabic diacritics (tashkeel) Unicode ranges
    ARABIC_DIACRITICS = [
        "\u064b",  # Fathatan
        "\u064c",  # Dammatan
        "\u064d",  # Kasratan
        "\u064e",  # Fatha
        "\u064f",  # Damma
        "\u0650",  # Kasra
        "\u0651",  # Shadda
        "\u0652",  # Sukun
        "\u0653",  # Maddah
        "\u0654",  # Hamza above
        "\u0655",  # Hamza below
        "\u0656",  # Subscript alef
        "\u0657",  # Inverted damma
        "\u0658",  # Mark noon ghunna
        "\u0670",  # Superscript alef
    ]

    def __init__(self):
        self.numeral_mapping = str.maketrans(
            self.EASTERN_NUMERALS, self.WESTERN_NUMERALS
        )

    def detect_text_direction(self, text: str) -> TextDirection:
        """
        Detect text direction (LTR, RTL, or MIXED)

        Args:
            text: Input text to analyze

        Returns:
            TextDirection: Detected direction
        """
        if not text.strip():
            return TextDirection.LTR

        arabic_chars = sum(1 for char in text if self._is_arabic_char(char))
        latin_chars = sum(1 for char in text if char.isascii() and char.isalpha())
        total_chars = arabic_chars + latin_chars

        if total_chars == 0:
            return TextDirection.LTR

        arabic_ratio = arabic_chars / total_chars

        if arabic_ratio > 0.7:
            return TextDirection.RTL
        elif arabic_ratio < 0.3:
            return TextDirection.LTR
        else:
            return TextDirection.MIXED

    def _is_arabic_char(self, char: str) -> bool:
        """Check if character is Arabic"""
        code_point = ord(char)
        return (
            self.ARABIC_RANGE[0] <= code_point <= self.ARABIC_RANGE[1]
            or self.ARABIC_SUPPLEMENT[0] <= code_point <= self.ARABIC_SUPPLEMENT[1]
            or self.ARABIC_EXTENDED_A[0] <= code_point <= self.ARABIC_EXTENDED_A[1]
            or self.ARABIC_PRESENTATION_FORMS_A[0]
            <= code_point
            <= self.ARABIC_PRESENTATION_FORMS_A[1]
            or self.ARABIC_PRESENTATION_FORMS_B[0]
            <= code_point
            <= self.ARABIC_PRESENTATION_FORMS_B[1]
        )

    def clean_arabic_text(
        self, text: str, remove_diacritics: bool = True, normalize: bool = True
    ) -> str:
        """
        Clean Arabic text by removing diacritics and normalizing

        Args:
            text: Arabic text to clean
            remove_diacritics: Remove tashkeel marks
            normalize: Normalize Arabic characters

        Returns:
            Cleaned Arabic text
        """
        cleaned = text

        # Remove diacritics
        if remove_diacritics:
            for diacritic in self.ARABIC_DIACRITICS:
                cleaned = cleaned.replace(diacritic, "")

        # Normalize Arabic characters
        if normalize:
            cleaned = self._normalize_arabic_chars(cleaned)

        # Remove extra whitespace
        cleaned = " ".join(cleaned.split())

        return cleaned

    def _normalize_arabic_chars(self, text: str) -> str:
        """
        Normalize Arabic character variations

        Normalizations:
        - Alef variations (إ أ آ) → ا
        - Teh marbuta ة → ه (optional)
        - Yeh variations ى → ي
        """
        # Alef normalization
        text = re.sub(r"[إأآ]", "ا", text)

        # Yeh normalization
        text = re.sub(r"ى", "ي", text)

        # Heh normalization (optional, context-dependent)
        # text = re.sub(r'ة', 'ه', text)

        return text

    def convert_eastern_to_western_numerals(self, text: str) -> str:
        """
        Convert Eastern Arabic numerals (٠-٩) to Western (0-9)

        Args:
            text: Text containing Eastern Arabic numerals

        Returns:
            Text with Western numerals
        """
        return text.translate(self.numeral_mapping)

    def convert_western_to_eastern_numerals(self, text: str) -> str:
        """
        Convert Western numerals (0-9) to Eastern Arabic (٠-٩)

        Args:
            text: Text containing Western numerals

        Returns:
            Text with Eastern Arabic numerals
        """
        reverse_mapping = str.maketrans(self.WESTERN_NUMERALS, self.EASTERN_NUMERALS)
        return text.translate(reverse_mapping)

    def extract_numbers_from_text(
        self, text: str, numeral_type: ArabicNumeralType = ArabicNumeralType.WESTERN
    ) -> List[float]:
        """
        Extract numbers from Arabic text

        Args:
            text: Text containing numbers
            numeral_type: Type of numerals to extract

        Returns:
            List of extracted numbers as floats
        """
        # Convert Eastern to Western for easier parsing
        if numeral_type == ArabicNumeralType.EASTERN:
            text = self.convert_eastern_to_western_numerals(text)

        # Extract numbers (including decimals and thousands separators)
        number_patterns = [
            r"\d{1,3}(?:,\d{3})*(?:\.\d+)?",  # 1,000.50
            r"\d+\.\d+",  # 123.45
            r"\d+",  # 123
        ]

        numbers = []
        for pattern in number_patterns:
            matches = re.findall(pattern, text)
            for match in matches:
                try:
                    # Remove commas and convert to float
                    number = float(match.replace(",", ""))
                    numbers.append(number)
                except ValueError:
                    continue

        return numbers

    def normalize_rtl_table_cells(self, cells: List[Dict]) -> List[Dict]:
        """
        Normalize RTL table cells for proper rendering

        Args:
            cells: List of table cells with 'text' field

        Returns:
            Normalized cells with RTL markers
        """
        normalized_cells = []

        for cell in cells:
            text = cell.get("text", "")
            direction = self.detect_text_direction(text)

            normalized_cell = cell.copy()
            normalized_cell["text"] = self.clean_arabic_text(text)
            normalized_cell["direction"] = direction.value
            normalized_cell["is_rtl"] = direction in [
                TextDirection.RTL,
                TextDirection.MIXED,
            ]

            normalized_cells.append(normalized_cell)

        return normalized_cells

    def detect_merged_cells(
        self, cells: List[Dict], num_columns: int
    ) -> List[Tuple[int, int, int, int]]:
        """
        Detect merged cells in Arabic tables

        Args:
            cells: List of table cells with row/column info
            num_columns: Expected number of columns

        Returns:
            List of (start_row, start_col, row_span, col_span) for merged cells
        """
        merged_regions = []

        # Group cells by row
        rows = {}
        for cell in cells:
            row = cell.get("row", 0)
            if row not in rows:
                rows[row] = []
            rows[row].append(cell)

        # Detect column spans (merged horizontal cells)
        for row_num, row_cells in sorted(rows.items()):
            row_cells.sort(key=lambda c: c.get("column", 0))

            # Check for gaps indicating merged cells
            for i, cell in enumerate(row_cells):
                col = cell.get("column", 0)
                next_col = (
                    row_cells[i + 1].get("column", col + 1)
                    if i + 1 < len(row_cells)
                    else col + 1
                )

                if next_col - col > 1:
                    # Merged cell detected
                    col_span = next_col - col
                    merged_regions.append((row_num, col, 1, col_span))

        return merged_regions

    def align_mixed_content(self, text: str) -> Tuple[str, str]:
        """
        Align mixed Arabic-English content for table cells

        Args:
            text: Mixed content text

        Returns:
            Tuple of (arabic_part, english_part)
        """
        # Split by language
        arabic_parts = []
        english_parts = []

        words = text.split()
        for word in words:
            direction = self.detect_text_direction(word)
            if direction == TextDirection.RTL:
                arabic_parts.append(word)
            else:
                english_parts.append(word)

        arabic_text = " ".join(arabic_parts)
        english_text = " ".join(english_parts)

        return arabic_text, english_text

    def validate_arabic_table_structure(
        self, cells: List[Dict], expected_columns: int
    ) -> Dict[str, any]:
        """
        Validate Arabic table structure

        Args:
            cells: List of table cells
            expected_columns: Expected number of columns

        Returns:
            Validation result with errors and warnings
        """
        errors = []
        warnings = []

        # Check for RTL consistency
        rtl_cells = sum(
            1
            for cell in cells
            if self.detect_text_direction(cell.get("text", "")) == TextDirection.RTL
        )
        total_cells = len(cells)

        if rtl_cells > total_cells * 0.5:
            # Table is primarily Arabic
            for cell in cells:
                text = cell.get("text", "")
                direction = self.detect_text_direction(text)
                if direction == TextDirection.LTR and not text.isdigit():
                    warnings.append(
                        f"Cell at ({cell.get('row')}, {cell.get('column')}) has LTR text in RTL table"
                    )

        # Check column count consistency
        rows = {}
        for cell in cells:
            row = cell.get("row", 0)
            if row not in rows:
                rows[row] = []
            rows[row].append(cell)

        for row_num, row_cells in rows.items():
            if len(row_cells) != expected_columns:
                errors.append(
                    f"Row {row_num} has {len(row_cells)} cells, expected {expected_columns}"
                )

        # Check for Arabic numeral consistency
        eastern_numerals = sum(
            1
            for cell in cells
            if any(char in cell.get("text", "") for char in self.EASTERN_NUMERALS)
        )
        western_numerals = sum(
            1
            for cell in cells
            if any(char in cell.get("text", "") for char in self.WESTERN_NUMERALS)
        )

        if eastern_numerals > 0 and western_numerals > 0:
            warnings.append(
                f"Mixed numeral systems detected: {eastern_numerals} Eastern, {western_numerals} Western"
            )

        return {
            "is_valid": len(errors) == 0,
            "errors": errors,
            "warnings": warnings,
            "rtl_ratio": rtl_cells / total_cells if total_cells > 0 else 0,
            "is_rtl_dominant": rtl_cells > total_cells * 0.5,
        }

    def format_currency_cell(self, text: str, currency: str = "IQD") -> str:
        """
        Format currency cell with Iraqi standards

        Args:
            text: Cell text containing amount
            currency: Currency code (default IQD)

        Returns:
            Formatted currency string
        """
        # Extract number
        numbers = self.extract_numbers_from_text(text)
        if not numbers:
            return text

        amount = numbers[0]

        # Format with thousands separator
        formatted_amount = f"{amount:,.0f}"

        # Iraqi currency format: "1,000 دينار عراقي" or "1,000 IQD"
        if currency == "IQD":
            return f"{formatted_amount} دينار عراقي"
        else:
            return f"{formatted_amount} {currency}"

    def reorder_rtl_table_for_display(
        self, cells: List[Dict], num_columns: int
    ) -> List[List[Dict]]:
        """
        Reorder RTL table cells for proper display

        Arabic tables read right-to-left, so column order is reversed

        Args:
            cells: List of table cells
            num_columns: Number of columns

        Returns:
            2D array of cells reordered for RTL display
        """
        # Group by rows
        rows = {}
        for cell in cells:
            row = cell.get("row", 0)
            if row not in rows:
                rows[row] = []
            rows[row].append(cell)

        # Reorder each row (reverse columns for RTL)
        reordered_table = []
        for row_num in sorted(rows.keys()):
            row_cells = sorted(rows[row_num], key=lambda c: c.get("column", 0))

            # Check if row is RTL
            rtl_cells = sum(
                1
                for cell in row_cells
                if self.detect_text_direction(cell.get("text", "")) == TextDirection.RTL
            )
            is_rtl_row = rtl_cells > len(row_cells) * 0.5

            if is_rtl_row:
                # Reverse column order for RTL
                row_cells = list(reversed(row_cells))

            reordered_table.append(row_cells)

        return reordered_table
