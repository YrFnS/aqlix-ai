"""
Arabic Text Processor - RTL layout and Arabic text handling
Specialized for Iraqi dialect and government portal content
"""

import re
import logging
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass
from enum import Enum

logger = logging.getLogger(__name__)


class ArabicTextType(Enum):
    """Types of Arabic text content"""

    STANDARD_ARABIC = "standard"
    IRAQI_DIALECT = "iraqi"
    MIXED_CONTENT = "mixed"
    GOVERNMENT_FORMAL = "formal"


class TextDirection(Enum):
    """Text direction options"""

    LTR = "ltr"
    RTL = "rtl"
    AUTO = "auto"


@dataclass
class ArabicTextInfo:
    """Information about Arabic text content"""

    text: str
    text_type: ArabicTextType
    direction: TextDirection
    confidence: float
    contains_numbers: bool = False
    contains_english: bool = False
    is_government_content: bool = False
    dialect_features: List[str] = None


class ArabicTextProcessor:
    """
    Specialized processor for Arabic text content
    Handles Iraqi dialect recognition and government portal text
    """

    def __init__(self):
        self.arabic_range = re.compile(r"[\u0600-\u06FF]")
        self.english_range = re.compile(r"[a-zA-Z]")
        self.number_range = re.compile(r"[\d\u0660-\u0669]")  # Arabic-Indic digits

        # Iraqi dialect patterns
        self.iraqi_patterns = self._load_iraqi_patterns()
        self.government_terms = self._load_government_terms()
        self.common_forms = self._load_common_form_terms()

    def analyze_text(self, text: str) -> ArabicTextInfo:
        """Analyze Arabic text content and characteristics"""
        try:
            # Basic character analysis
            has_arabic = bool(self.arabic_range.search(text))
            has_english = bool(self.english_range.search(text))
            has_numbers = bool(self.number_range.search(text))

            if not has_arabic:
                return ArabicTextInfo(
                    text=text,
                    text_type=ArabicTextType.STANDARD_ARABIC,
                    direction=TextDirection.LTR,
                    confidence=0.0,
                    contains_numbers=has_numbers,
                    contains_english=has_english,
                )

            # Determine text type and direction
            text_type = self._detect_text_type(text)
            direction = self._detect_direction(text, has_english)
            confidence = self._calculate_confidence(text, text_type)

            # Check for government content
            is_government = self._is_government_content(text)

            # Detect dialect features
            dialect_features = self._detect_dialect_features(text)

            return ArabicTextInfo(
                text=text,
                text_type=text_type,
                direction=direction,
                confidence=confidence,
                contains_numbers=has_numbers,
                contains_english=has_english,
                is_government_content=is_government,
                dialect_features=dialect_features,
            )

        except Exception as e:
            logger.error(f"Arabic text analysis failed: {e}")
            return ArabicTextInfo(
                text=text,
                text_type=ArabicTextType.STANDARD_ARABIC,
                direction=TextDirection.AUTO,
                confidence=0.0,
            )

    def normalize_text(self, text: str) -> str:
        """Normalize Arabic text for better processing"""
        try:
            # Unicode normalization
            import unicodedata

            text = unicodedata.normalize("NFKD", text)

            # Normalize Arabic characters
            text = self._normalize_arabic_chars(text)

            # Normalize whitespace
            text = re.sub(r"\s+", " ", text).strip()

            # Normalize punctuation
            text = self._normalize_punctuation(text)

            return text

        except Exception as e:
            logger.error(f"Text normalization failed: {e}")
            return text

    def extract_keywords(self, text: str) -> List[str]:
        """Extract key terms from Arabic text"""
        keywords = []

        try:
            # Normalize text first
            normalized = self.normalize_text(text)

            # Extract government keywords
            for keyword in self.government_terms:
                if keyword in normalized.lower():
                    keywords.append(keyword)

            # Extract form-related keywords
            for keyword in self.common_forms:
                if keyword in normalized.lower():
                    keywords.append(keyword)

            # Extract Iraqi dialect terms
            for pattern in self.iraqi_patterns["vocabulary"]:
                if pattern in normalized:
                    keywords.append(pattern)

            return list(set(keywords))  # Remove duplicates

        except Exception as e:
            logger.error(f"Keyword extraction failed: {e}")
            return []

    def detect_form_fields(self, text: str) -> Dict[str, str]:
        """Detect form field types from Arabic labels"""
        field_mappings = {}

        try:
            normalized = self.normalize_text(text.lower())

            # Map Arabic labels to field types
            arabic_field_map = {
                "الاسم": "name",
                "الاسم الكامل": "full_name",
                "الاسم الأول": "first_name",
                "اسم العائلة": "last_name",
                "رقم الجواز": "passport_number",
                "رقم الهوية": "national_id",
                "رقم الهوية الوطنية": "national_id",
                "تاريخ الميلاد": "birth_date",
                "مكان الميلاد": "birth_place",
                "الجنسية": "nationality",
                "رقم الهاتف": "phone_number",
                "الهاتف النقال": "mobile_phone",
                "البريد الإلكتروني": "email",
                "العنوان": "address",
                "المدينة": "city",
                "المحافظة": "province",
                "الرمز البريدي": "postal_code",
                "المهنة": "occupation",
                "جهة العمل": "employer",
                "الغرض من السفر": "travel_purpose",
                "مدة الإقامة": "duration_stay",
                "كلمة المرور": "password",
                "تأكيد كلمة المرور": "confirm_password",
            }

            for arabic_label, field_type in arabic_field_map.items():
                if arabic_label in normalized:
                    field_mappings[field_type] = arabic_label

            return field_mappings

        except Exception as e:
            logger.error(f"Form field detection failed: {e}")
            return {}

    def format_iraqi_data(self, field_type: str, value: str) -> str:
        """Format data according to Iraqi standards"""
        try:
            if field_type == "phone_number":
                return self._format_iraqi_phone(value)
            elif field_type == "national_id":
                return self._format_iraqi_national_id(value)
            elif field_type == "passport_number":
                return self._format_iraqi_passport(value)
            elif field_type == "birth_date":
                return self._format_iraqi_date(value)
            elif field_type in ["name", "first_name", "last_name"]:
                return self._format_iraqi_name(value)
            else:
                return value

        except Exception as e:
            logger.error(f"Data formatting failed for {field_type}: {e}")
            return value

    def _detect_text_type(self, text: str) -> ArabicTextType:
        """Detect the type of Arabic text"""
        # Check for government formal language
        gov_count = sum(1 for term in self.government_terms if term in text.lower())
        if gov_count >= 2:
            return ArabicTextType.GOVERNMENT_FORMAL

        # Check for Iraqi dialect features
        dialect_count = sum(
            1 for pattern in self.iraqi_patterns["vocabulary"] if pattern in text
        )
        if dialect_count >= 1:
            return ArabicTextType.IRAQI_DIALECT

        # Check for mixed content
        if self.english_range.search(text):
            return ArabicTextType.MIXED_CONTENT

        return ArabicTextType.STANDARD_ARABIC

    def _detect_direction(self, text: str, has_english: bool) -> TextDirection:
        """Detect appropriate text direction"""
        arabic_chars = len(self.arabic_range.findall(text))
        english_chars = len(self.english_range.findall(text))

        if arabic_chars > english_chars:
            return TextDirection.RTL
        elif english_chars > arabic_chars and not has_english:
            return TextDirection.LTR
        else:
            return TextDirection.AUTO

    def _calculate_confidence(self, text: str, text_type: ArabicTextType) -> float:
        """Calculate confidence score for text analysis"""
        base_score = 0.7

        # Boost confidence for government content
        if text_type == ArabicTextType.GOVERNMENT_FORMAL:
            base_score += 0.2

        # Boost confidence for Iraqi dialect
        if text_type == ArabicTextType.IRAQI_DIALECT:
            dialect_matches = sum(
                1 for pattern in self.iraqi_patterns["vocabulary"] if pattern in text
            )
            base_score += min(0.2, dialect_matches * 0.05)

        # Reduce confidence for very short text
        if len(text) < 10:
            base_score -= 0.2

        return min(1.0, max(0.0, base_score))

    def _is_government_content(self, text: str) -> bool:
        """Check if text contains government-related content"""
        gov_indicators = sum(
            1 for term in self.government_terms if term in text.lower()
        )
        return gov_indicators >= 1

    def _detect_dialect_features(self, text: str) -> List[str]:
        """Detect Iraqi dialect features in text"""
        features = []

        for category, patterns in self.iraqi_patterns.items():
            for pattern in patterns:
                if pattern in text:
                    features.append(f"{category}:{pattern}")

        return features

    def _normalize_arabic_chars(self, text: str) -> str:
        """Normalize Arabic character variants"""
        # Normalize Alef variants
        text = re.sub(r"[آأإٱ]", "ا", text)

        # Normalize Teh Marbuta
        text = re.sub(r"ة", "ه", text)

        # Normalize Yeh variants
        text = re.sub(r"[يى]", "ي", text)

        # Remove diacritics
        text = re.sub(r"[\u064B-\u065F\u0670\u0640]", "", text)

        return text

    def _normalize_punctuation(self, text: str) -> str:
        """Normalize punctuation marks"""
        # Replace Arabic punctuation with standard
        text = text.replace("؟", "?")
        text = text.replace("؛", ";")
        text = text.replace("،", ",")

        return text

    def _format_iraqi_phone(self, phone: str) -> str:
        """Format Iraqi phone number"""
        # Remove all non-digits
        digits = re.sub(r"\D", "", phone)

        # Add country code if not present
        if not digits.startswith("964"):
            if digits.startswith("0"):
                digits = "964" + digits[1:]
            else:
                digits = "964" + digits

        # Format: +964XXXXXXXXX
        return f"+{digits}"

    def _format_iraqi_national_id(self, national_id: str) -> str:
        """Format Iraqi national ID"""
        # Remove hyphens and spaces
        clean_id = re.sub(r"[-\s]", "", national_id)

        # Validate length (typically 12 digits)
        if len(clean_id) != 12:
            logger.warning(f"Invalid Iraqi national ID length: {len(clean_id)}")

        return clean_id

    def _format_iraqi_passport(self, passport: str) -> str:
        """Format Iraqi passport number"""
        # Remove spaces and special characters
        clean_passport = re.sub(r"[^\w]", "", passport).upper()
        return clean_passport

    def _format_iraqi_date(self, date: str) -> str:
        """Format date in Iraqi format (DD/MM/YYYY)"""
        # Try to parse and reformat common date patterns
        import re

        # Match various date formats
        patterns = [
            r"(\d{1,2})[/-](\d{1,2})[/-](\d{4})",  # DD/MM/YYYY or DD-MM-YYYY
            r"(\d{4})[/-](\d{1,2})[/-](\d{1,2})",  # YYYY/MM/DD or YYYY-MM-DD
        ]

        for pattern in patterns:
            match = re.match(pattern, date)
            if match:
                if len(match.group(1)) == 4:  # YYYY format
                    year, month, day = match.groups()
                    return f"{day.zfill(2)}/{month.zfill(2)}/{year}"
                else:  # DD format
                    day, month, year = match.groups()
                    return f"{day.zfill(2)}/{month.zfill(2)}/{year}"

        return date  # Return original if no pattern matches

    def _format_iraqi_name(self, name: str) -> str:
        """Format Iraqi name (proper capitalization)"""
        # Split and capitalize each part
        parts = name.strip().split()
        formatted_parts = []

        for part in parts:
            if self.arabic_range.search(part):
                # Arabic names - no case change needed
                formatted_parts.append(part)
            else:
                # English names - capitalize first letter
                formatted_parts.append(part.capitalize())

        return " ".join(formatted_parts)

    def _load_iraqi_patterns(self) -> Dict[str, List[str]]:
        """Load Iraqi dialect patterns and vocabulary"""
        return {
            "vocabulary": [
                "شلونك",
                "شنو",
                "وين",
                "أني",
                "إنت",
                "إنتي",
                "هاي",
                "هذا",
                "هذه",
                "يالله",
                "ماكو",
                "إيا",
            ],
            "greetings": [
                "أهلاً وسهلاً",
                "مرحبا",
                "السلام عليكم",
                "صباح الخير",
                "مساء الخير",
                "تسلم",
            ],
            "expressions": [
                "إن شاء الله",
                "الحمد لله",
                "بإذن الله",
                "ما شاء الله",
                "سبحان الله",
                "الله يعطيك العافية",
            ],
        }

    def _load_government_terms(self) -> List[str]:
        """Load government and official terms"""
        return [
            "وزارة",
            "ministry",
            "حكومة",
            "government",
            "جواز",
            "passport",
            "هوية",
            "identity",
            "رسمي",
            "official",
            "طلب",
            "application",
            "استمارة",
            "form",
            "شهادة",
            "certificate",
            "تصديق",
            "authentication",
            "موافقة",
            "approval",
            "رخصة",
            "license",
            "إجازة",
            "permit",
            "قانون",
            "law",
            "نظام",
            "regulation",
            "تعليمات",
            "instructions",
            "دائرة",
            "department",
            "مديرية",
            "directorate",
            "أمانة",
            "secretariat",
        ]

    def _load_common_form_terms(self) -> List[str]:
        """Load common form field terms"""
        return [
            "اسم",
            "name",
            "رقم",
            "number",
            "تاريخ",
            "date",
            "مكان",
            "place",
            "عنوان",
            "address",
            "هاتف",
            "phone",
            "بريد",
            "email",
            "جنسية",
            "nationality",
            "مهنة",
            "occupation",
            "توقيع",
            "signature",
            "صورة",
            "photo",
            "إرسال",
            "submit",
            "إلغاء",
            "cancel",
            "حفظ",
            "save",
            "طباعة",
            "print",
            "تحميل",
            "download",
            "رفع",
            "upload",
            "بحث",
            "search",
            "تصفية",
            "filter",
        ]


class RTLLayoutHandler:
    """
    Handler for RTL (Right-to-Left) layout processing
    Manages text direction and layout adjustments
    """

    def __init__(self):
        self.text_processor = ArabicTextProcessor()

    def detect_layout_direction(self, elements: List[Dict[str, Any]]) -> str:
        """Detect overall layout direction from page elements"""
        rtl_count = 0
        ltr_count = 0

        for element in elements:
            text = element.get("text", "")
            if text:
                text_info = self.text_processor.analyze_text(text)
                if text_info.direction == TextDirection.RTL:
                    rtl_count += 1
                elif text_info.direction == TextDirection.LTR:
                    ltr_count += 1

        return "rtl" if rtl_count > ltr_count else "ltr"

    def adjust_coordinates_for_rtl(
        self,
        x: int,
        y: int,
        element_width: int,
        container_width: int,
        is_rtl: bool = True,
    ) -> Tuple[int, int]:
        """Adjust element coordinates for RTL layout"""
        if not is_rtl:
            return x, y

        # Mirror X coordinate for RTL
        adjusted_x = container_width - x - element_width
        return adjusted_x, y

    def get_text_alignment(self, text: str) -> str:
        """Get appropriate text alignment based on content"""
        text_info = self.text_processor.analyze_text(text)

        if text_info.direction == TextDirection.RTL:
            return "right"
        elif text_info.direction == TextDirection.LTR:
            return "left"
        else:
            return "auto"

    def generate_rtl_css(self, selector: str = "body") -> str:
        """Generate CSS for RTL layout support"""
        return f"""
        {selector} {{
            direction: rtl;
            text-align: right;
        }}
        
        {selector} input[type="text"],
        {selector} input[type="email"],
        {selector} input[type="password"],
        {selector} textarea {{
            text-align: right;
            direction: rtl;
        }}
        
        {selector} .ltr {{
            direction: ltr;
            text-align: left;
        }}
        
        {selector} .number-input {{
            direction: ltr;
            text-align: left;
        }}
        """

    def identify_mixed_content_elements(
        self, elements: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """Identify elements with mixed Arabic/English content"""
        mixed_elements = []

        for element in elements:
            text = element.get("text", "")
            if text:
                text_info = self.text_processor.analyze_text(text)
                if text_info.text_type == ArabicTextType.MIXED_CONTENT or (
                    text_info.contains_english and text_info.contains_numbers
                ):
                    mixed_elements.append(
                        {
                            **element,
                            "text_info": text_info,
                            "suggested_direction": text_info.direction.value,
                        }
                    )

        return mixed_elements
