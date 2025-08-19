"""
Arabic Text Processor

Comprehensive Arabic language processing with Iraqi dialect recognition, RTL handling,
and bilingual content processing. Integrates with Iraqi cultural context for
enhanced search and content understanding.
"""

from typing import Any, Dict, List, Optional, Tuple, Union
import re
import logging
from dataclasses import dataclass
from enum import Enum
import unicodedata

logger = logging.getLogger(__name__)

class ArabicScript(Enum):
    """Arabic script detection types"""
    ARABIC_ONLY = "arabic_only"
    MIXED_ARABIC_ENGLISH = "mixed"
    ENGLISH_ONLY = "english_only"
    UNKNOWN = "unknown"

class IraqiDialectType(Enum):
    """Iraqi dialect classification"""
    BAGHDADI = "baghdadi"           # Baghdad dialect
    BASRAWI = "basrawi"            # Basra dialect  
    MOSLAWI = "moslawi"            # Mosul dialect
    KURDISH_ARABIC = "kurdish_arabic"  # Kurdish-influenced Arabic
    STANDARD_ARABIC = "standard"    # Modern Standard Arabic
    MIXED_DIALECT = "mixed"        # Multiple dialects
    UNKNOWN_DIALECT = "unknown"

@dataclass
class ArabicProcessingResult:
    """Result of Arabic text processing"""
    original_text: str
    normalized_text: str
    script_type: ArabicScript
    dialect_type: IraqiDialectType
    dialect_confidence: float          # 0.0 to 1.0 confidence in dialect detection
    
    # Text statistics
    arabic_ratio: float               # Percentage of Arabic characters
    word_count: int                   # Total word count
    arabic_word_count: int           # Arabic word count
    english_word_count: int          # English word count
    
    # Processing metadata
    rtl_segments: List[Tuple[int, int]]  # RTL text segment positions
    ltr_segments: List[Tuple[int, int]]  # LTR text segment positions
    mixed_direction: bool             # Contains mixed text direction
    
    # Iraqi-specific features
    iraqi_markers: List[str]         # Iraqi dialect markers found
    formal_indicators: List[str]     # Formal Arabic indicators
    colloquial_indicators: List[str] # Colloquial/informal indicators
    
    # Cultural context
    cultural_terms: List[str]        # Cultural/religious terms found
    professional_terms: List[str]   # Professional terminology
    
    processing_metadata: Dict[str, Any]

class ArabicTextProcessor:
    """Comprehensive Arabic text processor with Iraqi dialect specialization"""
    
    def __init__(self):
        """Initialize with Iraqi Arabic linguistic knowledge"""
        self.iraqi_dialect_markers = self._load_iraqi_dialect_markers()
        self.arabic_normalization_rules = self._load_normalization_rules()
        self.cultural_terminology = self._load_cultural_terminology()
        self.professional_terminology = self._load_professional_terminology()
        self.formal_patterns = self._load_formal_patterns()
        
        # Processing statistics
        self.processing_stats = {
            "total_processed": 0,
            "arabic_detected": 0,
            "iraqi_dialect_detected": 0,
            "mixed_content_processed": 0,
            "normalized_texts": 0
        }

    def _load_iraqi_dialect_markers(self) -> Dict[str, List[str]]:
        """Load Iraqi dialect markers and patterns"""
        return {
            "baghdadi": [
                "شلونك", "وين", "شنو", "زين", "مو", "هذا", "هذي",
                "ماكو", "اكو", "جان", "كان", "راح", "دانگ", "شدراني"
            ],
            
            "basrawi": [
                "شيفيگ", "ويگ", "شدراگ", "چان", "يرچع", "گام", "گعد",
                "مگدار", "ماگو", "اگو", "چذي", "هيچ"
            ],
            
            "moslawi": [
                "شان", "كيف", "وين", "شنهو", "زين", "ماكه", "اكه",
                "جان", "هذا", "هذي", "شدرني"
            ],
            
            "common_iraqi": [
                # Common across Iraqi dialects
                "عمي", "خالتي", "استاذ", "دكتور", "ابو", "ام",
                "حبيبي", "حبيبتي", "يا رب", "ماشاء الله", "الله يعطيك العافية",
                "صدگ", "يالله", "خلاص", "بس", "طيب", "زين"
            ],
            
            "formal_markers": [
                "حضرتك", "سيادتك", "معالي", "سعادة", "فخامة", "جلالة",
                "المحترم", "المحترمة", "الكريم", "الكريمة"
            ]
        }

    def _load_normalization_rules(self) -> Dict[str, str]:
        """Load Arabic text normalization rules"""
        return {
            # Alef normalization
            "أ": "ا", "إ": "ا", "آ": "ا",
            
            # Yeh normalization  
            "ي": "ي", "ى": "ي",
            
            # Teh marbuta normalization
            "ة": "ه",
            
            # Remove diacritics (Tashkeel)
            "َ": "", "ُ": "", "ِ": "", "ً": "", "ٌ": "", "ٍ": "",
            "ْ": "", "ّ": "", "ۡ": "", "ۢ": "", "ۣ": "", "ۤ": "",
            "ۥ": "", "ۦ": "", "ۧ": "", "ۨ": "", "۩": "",
            
            # Tatweel (elongation) removal
            "ـ": "",
            
            # Persian/Urdu characters commonly mixed in Iraqi text
            "گ": "ك", "پ": "ب", "چ": "ج", "ژ": "ز"
        }

    def _load_cultural_terminology(self) -> Dict[str, List[str]]:
        """Load cultural and religious terminology"""
        return {
            "islamic_terms": [
                "الله", "الرحمن", "الرحيم", "صلى الله عليه وسلم", "رضي الله عنه",
                "ان شاء الله", "ماشاء الله", "الحمد لله", "استغفر الله",
                "بسم الله", "لا اله الا الله", "محمد رسول الله"
            ],
            
            "cultural_greetings": [
                "السلام عليكم", "وعليكم السلام", "صباح الخير", "مساء الخير",
                "اهلا وسهلا", "حياك الله", "مرحبا", "الله يعطيك العافية"
            ],
            
            "iraqi_cultural": [
                "بيت", "عشيرة", "قبيلة", "محلة", "فريج", "كرخ", "رصافة",
                "دجلة", "فرات", "بلاد الرافدين", "عراقي", "عراقية", "بغداد"
            ]
        }

    def _load_professional_terminology(self) -> Dict[str, List[str]]:
        """Load professional domain terminology"""
        return {
            "legal": [
                "قانون", "قاضي", "محكمة", "حكم", "عقد", "اتفاقية", "دعوى",
                "محام", "محامي", "استئناف", "تمييز", "جنح", "جناية"
            ],
            
            "medical": [
                "طبيب", "طبيبة", "مريض", "مريضة", "مستشفى", "عيادة", "علاج",
                "دواء", "تشخيص", "فحص", "عملية", "جراحة", "طب"
            ],
            
            "educational": [
                "مدرسة", "جامعة", "كلية", "طالب", "طالبة", "استاذ", "معلم",
                "درس", "امتحان", "شهادة", "منهج", "تعليم", "تربية"
            ],
            
            "government": [
                "وزارة", "وزير", "حكومة", "مجلس", "رئيس", "محافظ", "قائممقام",
                "ناحية", "بلدية", "خدمات", "مواطن", "جواز سفر", "هوية"
            ]
        }

    def _load_formal_patterns(self) -> List[str]:
        """Load formal Arabic patterns and structures"""
        return [
            r"حضرتكم", r"سيادتكم", r"معالي", r"سعادة",
            r"المحترم", r"المحترمة", r"الكريم", r"الكريمة",
            r"تفضلوا", r"يرجى", r"نرجو", r"نأمل",
            r"مع فائق الاحترام", r"وتقبلوا فائق الاحترام"
        ]

    async def process_content(
        self, 
        text: str, 
        dialect_preference: str = "iraqi",
        normalize_text: bool = True,
        detect_cultural_terms: bool = True
    ) -> ArabicProcessingResult:
        """
        Comprehensive Arabic text processing with Iraqi dialect recognition
        
        Args:
            text: Input text to process
            dialect_preference: Preferred dialect context ("iraqi", "standard", "mixed")
            normalize_text: Whether to normalize Arabic text
            detect_cultural_terms: Whether to detect cultural/professional terms
            
        Returns:
            ArabicProcessingResult with comprehensive processing data
        """
        try:
            logger.info(f"Processing Arabic content - Length: {len(text)}, "
                       f"Dialect preference: {dialect_preference}")
            
            # 1. Script Detection
            script_type = await self._detect_script_type(text)
            
            # 2. Text Statistics
            arabic_ratio = await self._calculate_arabic_ratio(text)
            word_counts = await self._count_words_by_language(text)
            
            # 3. Dialect Detection (if Arabic content present)
            dialect_type = IraqiDialectType.UNKNOWN_DIALECT
            dialect_confidence = 0.0
            iraqi_markers = []
            
            if script_type in [ArabicScript.ARABIC_ONLY, ArabicScript.MIXED_ARABIC_ENGLISH]:
                dialect_type, dialect_confidence, iraqi_markers = await self._detect_iraqi_dialect(text)
            
            # 4. Text Normalization
            normalized_text = text
            if normalize_text and arabic_ratio > 0:
                normalized_text = await self._normalize_arabic_text(text)
                self.processing_stats["normalized_texts"] += 1
            
            # 5. Direction Analysis (RTL/LTR)
            rtl_segments, ltr_segments, mixed_direction = await self._analyze_text_direction(text)
            
            # 6. Linguistic Feature Detection
            formal_indicators = await self._detect_formal_indicators(text)
            colloquial_indicators = await self._detect_colloquial_indicators(text)
            
            # 7. Cultural and Professional Term Detection
            cultural_terms = []
            professional_terms = []
            
            if detect_cultural_terms:
                cultural_terms = await self._detect_cultural_terms(text)
                professional_terms = await self._detect_professional_terms(text)
            
            # 8. Processing Metadata
            processing_metadata = {
                "processing_timestamp": "2025-01-01T00:00:00Z",
                "dialect_preference": dialect_preference,
                "normalization_applied": normalize_text,
                "cultural_detection_enabled": detect_cultural_terms,
                "script_confidence": await self._calculate_script_confidence(text, script_type)
            }
            
            # Update statistics
            self._update_processing_stats(script_type, dialect_type, mixed_direction)
            
            result = ArabicProcessingResult(
                original_text=text,
                normalized_text=normalized_text,
                script_type=script_type,
                dialect_type=dialect_type,
                dialect_confidence=dialect_confidence,
                arabic_ratio=arabic_ratio,
                word_count=word_counts["total"],
                arabic_word_count=word_counts["arabic"],
                english_word_count=word_counts["english"],
                rtl_segments=rtl_segments,
                ltr_segments=ltr_segments,
                mixed_direction=mixed_direction,
                iraqi_markers=iraqi_markers,
                formal_indicators=formal_indicators,
                colloquial_indicators=colloquial_indicators,
                cultural_terms=cultural_terms,
                professional_terms=professional_terms,
                processing_metadata=processing_metadata
            )
            
            logger.info(f"Arabic processing completed - Script: {script_type.value}, "
                       f"Dialect: {dialect_type.value} ({dialect_confidence:.2f})")
            
            return result
            
        except Exception as e:
            logger.error(f"Arabic processing failed: {e}")
            # Return minimal result on error
            return ArabicProcessingResult(
                original_text=text,
                normalized_text=text,
                script_type=ArabicScript.UNKNOWN,
                dialect_type=IraqiDialectType.UNKNOWN_DIALECT,
                dialect_confidence=0.0,
                arabic_ratio=0.0,
                word_count=len(text.split()),
                arabic_word_count=0,
                english_word_count=0,
                rtl_segments=[],
                ltr_segments=[],
                mixed_direction=False,
                iraqi_markers=[],
                formal_indicators=[],
                colloquial_indicators=[],
                cultural_terms=[],
                professional_terms=[],
                processing_metadata={"error": str(e)}
            )

    async def contains_arabic(self, text: str) -> bool:
        """Check if text contains Arabic characters"""
        arabic_pattern = r'[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]'
        return bool(re.search(arabic_pattern, text))

    async def contains_english(self, text: str) -> bool:
        """Check if text contains English characters"""
        english_pattern = r'[a-zA-Z]'
        return bool(re.search(english_pattern, text))

    async def _detect_script_type(self, text: str) -> ArabicScript:
        """Detect the script type of the text"""
        has_arabic = await self.contains_arabic(text)
        has_english = await self.contains_english(text)
        
        if has_arabic and has_english:
            return ArabicScript.MIXED_ARABIC_ENGLISH
        elif has_arabic:
            return ArabicScript.ARABIC_ONLY
        elif has_english:
            return ArabicScript.ENGLISH_ONLY
        else:
            return ArabicScript.UNKNOWN

    async def _calculate_arabic_ratio(self, text: str) -> float:
        """Calculate the ratio of Arabic characters in text"""
        if not text:
            return 0.0
        
        arabic_chars = len(re.findall(r'[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]', text))
        total_chars = len([c for c in text if c.isalpha()])
        
        return arabic_chars / max(1, total_chars)

    async def _count_words_by_language(self, text: str) -> Dict[str, int]:
        """Count words by language (Arabic vs English)"""
        words = text.split()
        arabic_words = 0
        english_words = 0
        
        for word in words:
            if await self.contains_arabic(word):
                arabic_words += 1
            elif await self.contains_english(word):
                english_words += 1
        
        return {
            "total": len(words),
            "arabic": arabic_words,
            "english": english_words
        }

    async def _detect_iraqi_dialect(self, text: str) -> Tuple[IraqiDialectType, float, List[str]]:
        """Detect Iraqi dialect type and confidence"""
        text_lower = text.lower()
        detected_markers = []
        dialect_scores = {
            IraqiDialectType.BAGHDADI: 0,
            IraqiDialectType.BASRAWI: 0,
            IraqiDialectType.MOSLAWI: 0,
            IraqiDialectType.STANDARD_ARABIC: 0
        }
        
        # Check dialect markers
        for dialect, markers in self.iraqi_dialect_markers.items():
            for marker in markers:
                if marker in text:
                    detected_markers.append(marker)
                    if dialect == "baghdadi":
                        dialect_scores[IraqiDialectType.BAGHDADI] += 1
                    elif dialect == "basrawi":
                        dialect_scores[IraqiDialectType.BASRAWI] += 1
                    elif dialect == "moslawi":
                        dialect_scores[IraqiDialectType.MOSLAWI] += 1
                    elif dialect == "formal_markers":
                        dialect_scores[IraqiDialectType.STANDARD_ARABIC] += 1
        
        # Determine dominant dialect
        if not detected_markers:
            return IraqiDialectType.UNKNOWN_DIALECT, 0.0, []
        
        max_score_dialect = max(dialect_scores, key=dialect_scores.get)
        max_score = dialect_scores[max_score_dialect]
        
        # Calculate confidence based on marker density
        confidence = min(1.0, max_score / max(1, len(text.split()) * 0.1))
        
        # Check for mixed dialects
        high_scoring_dialects = [d for d, s in dialect_scores.items() if s > 0]
        if len(high_scoring_dialects) > 1:
            return IraqiDialectType.MIXED_DIALECT, confidence, detected_markers
        
        return max_score_dialect, confidence, detected_markers

    async def _normalize_arabic_text(self, text: str) -> str:
        """Normalize Arabic text using normalization rules"""
        normalized = text
        
        for original, replacement in self.arabic_normalization_rules.items():
            normalized = normalized.replace(original, replacement)
        
        # Additional Unicode normalization
        normalized = unicodedata.normalize('NFKC', normalized)
        
        # Remove extra whitespace
        normalized = re.sub(r'\s+', ' ', normalized).strip()
        
        return normalized

    async def _analyze_text_direction(self, text: str) -> Tuple[List[Tuple[int, int]], List[Tuple[int, int]], bool]:
        """Analyze text direction and identify RTL/LTR segments"""
        rtl_segments = []
        ltr_segments = []
        
        # Simple implementation - would be more sophisticated in practice
        arabic_pattern = r'[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\s]+'
        english_pattern = r'[a-zA-Z0-9\s]+'
        
        # Find Arabic (RTL) segments
        for match in re.finditer(arabic_pattern, text):
            rtl_segments.append((match.start(), match.end()))
        
        # Find English (LTR) segments
        for match in re.finditer(english_pattern, text):
            ltr_segments.append((match.start(), match.end()))
        
        mixed_direction = len(rtl_segments) > 0 and len(ltr_segments) > 0
        
        return rtl_segments, ltr_segments, mixed_direction

    async def _detect_formal_indicators(self, text: str) -> List[str]:
        """Detect formal Arabic indicators in text"""
        found_indicators = []
        
        for pattern in self.formal_patterns:
            if re.search(pattern, text):
                found_indicators.append(pattern)
        
        return found_indicators

    async def _detect_colloquial_indicators(self, text: str) -> List[str]:
        """Detect colloquial/informal indicators"""
        colloquial_markers = []
        
        # Check for Iraqi dialect markers (informal)
        for dialect_markers in self.iraqi_dialect_markers.values():
            for marker in dialect_markers:
                if marker in text and marker not in self.iraqi_dialect_markers.get("formal_markers", []):
                    colloquial_markers.append(marker)
        
        return colloquial_markers

    async def _detect_cultural_terms(self, text: str) -> List[str]:
        """Detect cultural and religious terms"""
        found_terms = []
        
        for category, terms in self.cultural_terminology.items():
            for term in terms:
                if term in text:
                    found_terms.append(term)
        
        return found_terms

    async def _detect_professional_terms(self, text: str) -> List[str]:
        """Detect professional terminology"""
        found_terms = []
        
        for domain, terms in self.professional_terminology.items():
            for term in terms:
                if term in text:
                    found_terms.append(term)
        
        return found_terms

    async def _calculate_script_confidence(self, text: str, script_type: ArabicScript) -> float:
        """Calculate confidence in script type detection"""
        if script_type == ArabicScript.UNKNOWN:
            return 0.0
        
        # Simple confidence calculation based on character ratios
        arabic_ratio = await self._calculate_arabic_ratio(text)
        
        if script_type == ArabicScript.ARABIC_ONLY:
            return arabic_ratio
        elif script_type == ArabicScript.ENGLISH_ONLY:
            return 1.0 - arabic_ratio
        elif script_type == ArabicScript.MIXED_ARABIC_ENGLISH:
            # Mixed text confidence based on how balanced the mix is
            return 1.0 - abs(arabic_ratio - 0.5) * 2
        
        return 0.5

    def _update_processing_stats(self, script_type: ArabicScript, dialect_type: IraqiDialectType, mixed_direction: bool):
        """Update processing statistics"""
        self.processing_stats["total_processed"] += 1
        
        if script_type in [ArabicScript.ARABIC_ONLY, ArabicScript.MIXED_ARABIC_ENGLISH]:
            self.processing_stats["arabic_detected"] += 1
        
        if dialect_type != IraqiDialectType.UNKNOWN_DIALECT:
            self.processing_stats["iraqi_dialect_detected"] += 1
        
        if mixed_direction:
            self.processing_stats["mixed_content_processed"] += 1

    def get_processing_statistics(self) -> Dict[str, Any]:
        """Get Arabic processing performance statistics"""
        total = max(1, self.processing_stats["total_processed"])
        
        return {
            "total_processed": total,
            "arabic_detection_rate": self.processing_stats["arabic_detected"] / total,
            "iraqi_dialect_recognition_rate": self.processing_stats["iraqi_dialect_detected"] / max(1, self.processing_stats["arabic_detected"]),
            "mixed_content_rate": self.processing_stats["mixed_content_processed"] / total,
            "normalization_rate": self.processing_stats["normalized_texts"] / total
        }

    async def extract_keywords_arabic(self, text: str, max_keywords: int = 10) -> List[str]:
        """Extract keywords from Arabic text with Iraqi dialect awareness"""
        # Normalize first
        normalized = await self._normalize_arabic_text(text)
        
        # Remove stop words (simplified implementation)
        arabic_stopwords = {
            "في", "من", "إلى", "على", "هذا", "هذه", "ذلك", "تلك",
            "كان", "كانت", "يكون", "تكون", "التي", "الذي", "التي",
            "ان", "أن", "لا", "ما", "لم", "لن", "قد", "كل"
        }
        
        words = normalized.split()
        keywords = []
        
        for word in words:
            # Remove punctuation
            clean_word = re.sub(r'[^\w\u0600-\u06FF]', '', word)
            
            # Filter by length and stopwords
            if len(clean_word) > 2 and clean_word not in arabic_stopwords:
                keywords.append(clean_word)
        
        # Return top keywords (would implement frequency analysis in practice)
        return keywords[:max_keywords]