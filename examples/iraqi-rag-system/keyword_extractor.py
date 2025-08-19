"""
Iraqi Keyword Extractor

Specialized keyword extraction for Iraqi context with Arabic language support,
dialect recognition, cultural term identification, and professional domain awareness.
"""

from typing import Any, Dict, List, Optional, Set, Tuple
import re
import logging
from dataclasses import dataclass
from collections import Counter

logger = logging.getLogger(__name__)

@dataclass
class IraqiKeywordExtractionResult:
    """Result of Iraqi keyword extraction"""
    keywords: List[str]                    # Primary extracted keywords
    arabic_keywords: List[str]             # Arabic-specific keywords
    english_keywords: List[str]            # English-specific keywords
    cultural_terms: List[str]              # Cultural/religious terms
    professional_terms: List[str]          # Professional domain terms
    dialect_markers: List[str]             # Iraqi dialect markers
    formal_terms: List[str]                # Formal/official terms
    
    # Keyword metadata
    keyword_confidence: Dict[str, float]   # Confidence score for each keyword
    term_frequencies: Dict[str, int]       # Frequency of each term
    contextual_relevance: Dict[str, float] # Contextual relevance scores
    
    # Processing metadata
    total_terms_analyzed: int
    extraction_method: str
    cultural_enhancement_applied: bool

class IraqiKeywordExtractor:
    """
    Advanced keyword extractor with Iraqi cultural intelligence and Arabic language processing.
    
    Features:
    - Iraqi dialect recognition and keyword extraction
    - Cultural and religious term identification
    - Professional domain-specific terminology
    - Bilingual (Arabic-English) keyword processing
    - Contextual relevance scoring
    """
    
    def __init__(self):
        """Initialize with Iraqi linguistic and cultural knowledge"""
        self.arabic_stopwords = self._load_arabic_stopwords()
        self.english_stopwords = self._load_english_stopwords()
        self.iraqi_dialect_terms = self._load_iraqi_dialect_terms()
        self.cultural_keywords = self._load_cultural_keywords()
        self.professional_keywords = self._load_professional_keywords()
        self.formal_patterns = self._load_formal_patterns()
        self.keyword_variations = self._load_keyword_variations()
        
        # Extraction statistics
        self.extraction_stats = {
            "total_extractions": 0,
            "arabic_extractions": 0,
            "dialect_detections": 0,
            "cultural_term_detections": 0,
            "professional_term_detections": 0
        }

    def _load_arabic_stopwords(self) -> Set[str]:
        """Load Arabic stopwords including Iraqi dialect stopwords"""
        return {
            # Standard Arabic stopwords
            "في", "من", "إلى", "على", "عن", "مع", "بعد", "قبل", "تحت", "فوق",
            "هذا", "هذه", "ذلك", "تلك", "التي", "الذي", "التي", "اللذان", "اللتان",
            "كان", "كانت", "يكون", "تكون", "سوف", "قد", "لقد", "منذ", "حتى",
            "ان", "أن", "لا", "ما", "لم", "لن", "لكن", "غير", "سوى", "إلا",
            "كل", "بعض", "جميع", "معظم", "أكثر", "أقل", "كثير", "قليل",
            
            # Iraqi dialect stopwords
            "مو", "ماكو", "اكو", "جان", "كان", "راح", "بيه", "وياه", "معاه",
            "هذا", "هذي", "هاي", "ذاك", "ذيك", "هاك", "هيك"
        }

    def _load_english_stopwords(self) -> Set[str]:
        """Load English stopwords"""
        return {
            "a", "an", "and", "are", "as", "at", "be", "by", "for", "from",
            "has", "he", "in", "is", "it", "its", "of", "on", "that", "the",
            "to", "was", "will", "with", "the", "this", "but", "they", "have",
            "had", "what", "said", "each", "which", "their", "time", "would",
            "there", "we", "been", "has", "when", "who", "did", "get", "may"
        }

    def _load_iraqi_dialect_terms(self) -> Dict[str, List[str]]:
        """Load Iraqi dialect terms and variations"""
        return {
            "greeting_terms": [
                "شلونك", "شلونج", "كيفك", "كيفج", "أشلونك", "أشلونج",
                "صباح الخير", "مساء الخير", "السلام عليكم"
            ],
            
            "question_words": [
                "شنو", "شني", "شينو", "وين", "متى", "كيف", "شيف", "شدرني", "شدراني"
            ],
            
            "affirmative_terms": [
                "زين", "ماشي", "طيب", "صح", "اي", "نعم", "خلاص", "بس"
            ],
            
            "family_terms": [
                "عمي", "خالي", "عمتي", "خالتي", "ابو", "ام", "بابا", "ماما",
                "اخوي", "اختي", "عمي", "خالتي"
            ],
            
            "place_terms": [
                "بيت", "دار", "محلة", "فريج", "سوق", "جامع", "مدرسة", "مستشفى"
            ]
        }

    def _load_cultural_keywords(self) -> Dict[str, List[str]]:
        """Load cultural and religious keywords"""
        return {
            "islamic_terms": [
                "الله", "محمد", "القرآن", "الصلاة", "الزكاة", "الحج", "الصوم",
                "مسجد", "جامع", "إمام", "خطبة", "دعاء", "ذكر", "تسبيح",
                "ان شاء الله", "ماشاء الله", "الحمد لله", "استغفر الله",
                "بسم الله", "لا اله الا الله"
            ],
            
            "cultural_values": [
                "كرم", "ضيافة", "شرف", "كرامة", "احترام", "تقدير", "محبة",
                "عائلة", "قبيلة", "عشيرة", "تقاليد", "عادات", "تراث"
            ],
            
            "iraqi_identity": [
                "عراق", "عراقي", "عراقية", "بغداد", "بصرة", "موصل", "كردستان",
                "دجلة", "فرات", "بلاد الرافدين", "حضارة", "تاريخ", "تراث"
            ],
            
            "social_terms": [
                "مجتمع", "جيران", "أصدقاء", "زملاء", "رفاق", "أحباب",
                "تعاون", "مساعدة", "مشاركة", "تضامن", "وحدة"
            ]
        }

    def _load_professional_keywords(self) -> Dict[str, List[str]]:
        """Load professional domain keywords"""
        return {
            "legal": [
                "قانون", "قاضي", "محكمة", "حكم", "عقد", "اتفاقية", "دعوى",
                "محام", "محامي", "استئناف", "تمييز", "جنح", "جناية", "حقوق",
                "واجبات", "التزام", "ضمان", "كفالة", "رهن", "ملكية"
            ],
            
            "medical": [
                "طبيب", "طبيبة", "مريض", "مريضة", "مستشفى", "عيادة", "علاج",
                "دواء", "تشخيص", "فحص", "عملية", "جراحة", "طب", "صحة",
                "تمريض", "صيدلة", "أشعة", "مختبر", "تحليل"
            ],
            
            "educational": [
                "مدرسة", "جامعة", "كلية", "طالب", "طالبة", "استاذ", "معلم",
                "درس", "امتحان", "شهادة", "منهج", "تعليم", "تربية", "تدريس",
                "مناهج", "دراسة", "بحث", "رسالة", "أطروحة"
            ],
            
            "government": [
                "وزارة", "وزير", "حكومة", "مجلس", "رئيس", "محافظ", "قائممقام",
                "ناحية", "بلدية", "خدمات", "مواطن", "جواز سفر", "هوية",
                "برلمان", "دستور", "قرار", "مرسوم", "تعليمات"
            ],
            
            "business": [
                "شركة", "تجارة", "أعمال", "استثمار", "مال", "ربح", "خسارة",
                "بيع", "شراء", "سوق", "عملة", "دينار", "صرف", "بنك",
                "قرض", "فائدة", "تأمين", "صندوق", "رصيد"
            ],
            
            "technical": [
                "تقنية", "تكنولوجيا", "حاسوب", "برمجة", "نظام", "شبكة",
                "انترنت", "موقع", "تطبيق", "برنامج", "بيانات", "معلومات",
                "رقمي", "إلكتروني", "ذكي", "آلي"
            ]
        }

    def _load_formal_patterns(self) -> List[str]:
        """Load formal language patterns"""
        return [
            r"حضرتكم", r"سيادتكم", r"معالي", r"سعادة", r"فخامة",
            r"المحترم", r"المحترمة", r"الكريم", r"الكريمة",
            r"تفضلوا", r"يرجى", r"نرجو", r"نأمل", r"نتطلع",
            r"مع فائق الاحترام", r"وتقبلوا فائق الاحترام"
        ]

    def _load_keyword_variations(self) -> Dict[str, List[str]]:
        """Load keyword variations and synonyms"""
        return {
            "education": ["تعليم", "تربية", "تدريس", "دراسة", "تعلم"],
            "health": ["صحة", "طب", "علاج", "شفاء", "دواء"],
            "government": ["حكومة", "دولة", "سلطة", "إدارة", "نظام"],
            "law": ["قانون", "حق", "عدالة", "نظام", "قضاء"],
            "business": ["تجارة", "أعمال", "اقتصاد", "مال", "استثمار"],
            "technology": ["تقنية", "تكنولوجيا", "رقمي", "إلكتروني", "ذكي"]
        }

    async def extract_iraqi_keywords(
        self,
        text: str,
        iraqi_context: Optional[Any] = None,  # IraqiSearchContext
        max_keywords: int = 15,
        include_variations: bool = True,
        cultural_enhancement: bool = True
    ) -> IraqiKeywordExtractionResult:
        """
        Extract keywords with Iraqi cultural intelligence and Arabic processing.
        
        Args:
            text: Input text to extract keywords from
            iraqi_context: Iraqi search context for domain-aware extraction
            max_keywords: Maximum number of keywords to extract
            include_variations: Whether to include keyword variations
            cultural_enhancement: Whether to apply cultural enhancement
            
        Returns:
            IraqiKeywordExtractionResult with comprehensive keyword data
        """
        try:
            logger.info(f"Extracting Iraqi keywords - Length: {len(text)}, "
                       f"Cultural enhancement: {cultural_enhancement}")
            
            # Initialize extraction data
            all_keywords = []
            arabic_keywords = []
            english_keywords = []
            cultural_terms = []
            professional_terms = []
            dialect_markers = []
            formal_terms = []
            keyword_confidence = {}
            term_frequencies = {}
            contextual_relevance = {}
            
            # 1. Basic keyword extraction
            basic_keywords = await self._extract_basic_keywords(text, max_keywords)
            
            # 2. Language-specific extraction
            if await self._contains_arabic(text):
                arabic_extracted = await self._extract_arabic_keywords(text, max_keywords // 2)
                arabic_keywords.extend(arabic_extracted)
                all_keywords.extend(arabic_extracted)
                self.extraction_stats["arabic_extractions"] += 1
            
            if await self._contains_english(text):
                english_extracted = await self._extract_english_keywords(text, max_keywords // 2)
                english_keywords.extend(english_extracted)
                all_keywords.extend(english_extracted)
            
            # 3. Iraqi dialect detection and extraction
            dialect_detected = await self._extract_dialect_markers(text)
            dialect_markers.extend(dialect_detected)
            if dialect_detected:
                self.extraction_stats["dialect_detections"] += 1
            
            # 4. Cultural term extraction
            if cultural_enhancement:
                cultural_detected = await self._extract_cultural_terms(text)
                cultural_terms.extend(cultural_detected)
                if cultural_detected:
                    self.extraction_stats["cultural_term_detections"] += 1
            
            # 5. Professional domain extraction
            if iraqi_context and hasattr(iraqi_context, 'professional_domain'):
                professional_detected = await self._extract_professional_terms(
                    text, iraqi_context.professional_domain
                )
                professional_terms.extend(professional_detected)
                if professional_detected:
                    self.extraction_stats["professional_term_detections"] += 1
            
            # 6. Formal language detection
            formal_detected = await self._extract_formal_terms(text)
            formal_terms.extend(formal_detected)
            
            # 7. Combine and deduplicate keywords
            combined_keywords = list(set(
                basic_keywords + all_keywords + dialect_markers + 
                cultural_terms + professional_terms + formal_terms
            ))
            
            # 8. Calculate confidence scores
            for keyword in combined_keywords:
                confidence = await self._calculate_keyword_confidence(keyword, text, iraqi_context)
                keyword_confidence[keyword] = confidence
            
            # 9. Calculate term frequencies
            term_frequencies = await self._calculate_term_frequencies(text, combined_keywords)
            
            # 10. Calculate contextual relevance
            contextual_relevance = await self._calculate_contextual_relevance(
                combined_keywords, text, iraqi_context
            )
            
            # 11. Apply keyword variations if requested
            if include_variations:
                expanded_keywords = await self._expand_keyword_variations(combined_keywords)
                combined_keywords.extend(expanded_keywords)
            
            # 12. Rank and limit keywords
            final_keywords = await self._rank_and_limit_keywords(
                combined_keywords, keyword_confidence, term_frequencies, 
                contextual_relevance, max_keywords
            )
            
            # Update statistics
            self.extraction_stats["total_extractions"] += 1
            
            result = IraqiKeywordExtractionResult(
                keywords=final_keywords,
                arabic_keywords=arabic_keywords,
                english_keywords=english_keywords,
                cultural_terms=cultural_terms,
                professional_terms=professional_terms,
                dialect_markers=dialect_markers,
                formal_terms=formal_terms,
                keyword_confidence=keyword_confidence,
                term_frequencies=term_frequencies,
                contextual_relevance=contextual_relevance,
                total_terms_analyzed=len(combined_keywords),
                extraction_method="iraqi_enhanced",
                cultural_enhancement_applied=cultural_enhancement
            )
            
            logger.info(f"Iraqi keyword extraction completed - {len(final_keywords)} keywords, "
                       f"{len(cultural_terms)} cultural terms, {len(dialect_markers)} dialect markers")
            
            return result
            
        except Exception as e:
            logger.error(f"Iraqi keyword extraction failed: {e}")
            # Return minimal result on error
            basic_keywords = text.split()[:max_keywords]
            return IraqiKeywordExtractionResult(
                keywords=basic_keywords,
                arabic_keywords=[],
                english_keywords=basic_keywords,
                cultural_terms=[],
                professional_terms=[],
                dialect_markers=[],
                formal_terms=[],
                keyword_confidence={},
                term_frequencies={},
                contextual_relevance={},
                total_terms_analyzed=len(basic_keywords),
                extraction_method="basic_fallback",
                cultural_enhancement_applied=False
            )

    async def _extract_basic_keywords(self, text: str, max_keywords: int) -> List[str]:
        """Extract basic keywords using frequency and length filtering"""
        # Clean and tokenize
        words = re.findall(r'\b\w+\b', text.lower())
        
        # Filter by length and stopwords
        filtered_words = []
        for word in words:
            if (len(word) > 2 and 
                word not in self.arabic_stopwords and 
                word not in self.english_stopwords):
                filtered_words.append(word)
        
        # Count frequencies
        word_freq = Counter(filtered_words)
        
        # Return most frequent words
        return [word for word, freq in word_freq.most_common(max_keywords)]

    async def _contains_arabic(self, text: str) -> bool:
        """Check if text contains Arabic characters"""
        arabic_pattern = r'[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]'
        return bool(re.search(arabic_pattern, text))

    async def _contains_english(self, text: str) -> bool:
        """Check if text contains English characters"""
        english_pattern = r'[a-zA-Z]'
        return bool(re.search(english_pattern, text))

    async def _extract_arabic_keywords(self, text: str, max_keywords: int) -> List[str]:
        """Extract Arabic-specific keywords with normalization"""
        # Simple Arabic word extraction (would be more sophisticated in practice)
        arabic_words = re.findall(r'[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+', text)
        
        # Filter by length and stopwords
        filtered_arabic = []
        for word in arabic_words:
            if len(word) > 1 and word not in self.arabic_stopwords:
                # Basic normalization
                normalized = self._normalize_arabic_word(word)
                filtered_arabic.append(normalized)
        
        # Count and return most frequent
        word_freq = Counter(filtered_arabic)
        return [word for word, freq in word_freq.most_common(max_keywords)]

    async def _extract_english_keywords(self, text: str, max_keywords: int) -> List[str]:
        """Extract English-specific keywords"""
        english_words = re.findall(r'\b[a-zA-Z]+\b', text.lower())
        
        # Filter by length and stopwords
        filtered_english = []
        for word in english_words:
            if len(word) > 2 and word not in self.english_stopwords:
                filtered_english.append(word)
        
        # Count and return most frequent
        word_freq = Counter(filtered_english)
        return [word for word, freq in word_freq.most_common(max_keywords)]

    async def _extract_dialect_markers(self, text: str) -> List[str]:
        """Extract Iraqi dialect markers"""
        detected_markers = []
        
        for category, terms in self.iraqi_dialect_terms.items():
            for term in terms:
                if term in text:
                    detected_markers.append(term)
        
        return list(set(detected_markers))

    async def _extract_cultural_terms(self, text: str) -> List[str]:
        """Extract cultural and religious terms"""
        detected_terms = []
        
        for category, terms in self.cultural_keywords.items():
            for term in terms:
                if term in text:
                    detected_terms.append(term)
        
        return list(set(detected_terms))

    async def _extract_professional_terms(self, text: str, domain: str) -> List[str]:
        """Extract professional domain-specific terms"""
        if domain not in self.professional_keywords:
            return []
        
        detected_terms = []
        domain_terms = self.professional_keywords[domain]
        
        for term in domain_terms:
            if term in text:
                detected_terms.append(term)
        
        return detected_terms

    async def _extract_formal_terms(self, text: str) -> List[str]:
        """Extract formal language indicators"""
        detected_formal = []
        
        for pattern in self.formal_patterns:
            if re.search(pattern, text):
                detected_formal.append(pattern)
        
        return detected_formal

    async def _calculate_keyword_confidence(
        self, 
        keyword: str, 
        text: str, 
        iraqi_context: Optional[Any]
    ) -> float:
        """Calculate confidence score for keyword relevance"""
        confidence = 0.5  # Base confidence
        
        # Frequency boost
        keyword_count = text.lower().count(keyword.lower())
        total_words = len(text.split())
        frequency_score = min(0.3, (keyword_count / max(1, total_words)) * 10)
        confidence += frequency_score
        
        # Cultural term boost
        if keyword in [term for terms in self.cultural_keywords.values() for term in terms]:
            confidence += 0.2
        
        # Professional term boost
        if iraqi_context and hasattr(iraqi_context, 'professional_domain'):
            domain = iraqi_context.professional_domain
            if domain in self.professional_keywords and keyword in self.professional_keywords[domain]:
                confidence += 0.2
        
        # Dialect marker boost
        if keyword in [term for terms in self.iraqi_dialect_terms.values() for term in terms]:
            confidence += 0.15
        
        return min(1.0, confidence)

    async def _calculate_term_frequencies(self, text: str, keywords: List[str]) -> Dict[str, int]:
        """Calculate term frequencies for keywords"""
        frequencies = {}
        text_lower = text.lower()
        
        for keyword in keywords:
            frequencies[keyword] = text_lower.count(keyword.lower())
        
        return frequencies

    async def _calculate_contextual_relevance(
        self, 
        keywords: List[str], 
        text: str, 
        iraqi_context: Optional[Any]
    ) -> Dict[str, float]:
        """Calculate contextual relevance scores"""
        relevance = {}
        
        for keyword in keywords:
            score = 0.5  # Base relevance
            
            # Context window analysis (simplified)
            keyword_positions = []
            text_lower = text.lower()
            start = 0
            while True:
                pos = text_lower.find(keyword.lower(), start)
                if pos == -1:
                    break
                keyword_positions.append(pos)
                start = pos + 1
            
            # Context relevance based on surrounding words
            for pos in keyword_positions:
                window_start = max(0, pos - 50)
                window_end = min(len(text), pos + 50)
                context_window = text[window_start:window_end].lower()
                
                # Check for related terms in context
                related_terms = 0
                if iraqi_context and hasattr(iraqi_context, 'professional_domain'):
                    domain = iraqi_context.professional_domain
                    if domain in self.professional_keywords:
                        related_terms = sum(
                            1 for term in self.professional_keywords[domain]
                            if term in context_window
                        )
                
                context_score = min(0.3, related_terms * 0.1)
                score += context_score
            
            relevance[keyword] = min(1.0, score)
        
        return relevance

    async def _expand_keyword_variations(self, keywords: List[str]) -> List[str]:
        """Expand keywords with variations and synonyms"""
        expanded = []
        
        for keyword in keywords:
            for base_term, variations in self.keyword_variations.items():
                if keyword in variations:
                    # Add other variations
                    for variation in variations:
                        if variation != keyword and variation not in keywords:
                            expanded.append(variation)
        
        return expanded

    async def _rank_and_limit_keywords(
        self,
        keywords: List[str],
        confidence: Dict[str, float],
        frequencies: Dict[str, int],
        relevance: Dict[str, float],
        max_keywords: int
    ) -> List[str]:
        """Rank keywords by combined score and limit to max count"""
        
        keyword_scores = []
        
        for keyword in keywords:
            # Combined score calculation
            conf_score = confidence.get(keyword, 0.5)
            freq_score = min(1.0, frequencies.get(keyword, 0) * 0.1)
            rel_score = relevance.get(keyword, 0.5)
            
            combined_score = (conf_score * 0.4 + freq_score * 0.3 + rel_score * 0.3)
            keyword_scores.append((keyword, combined_score))
        
        # Sort by score and return top keywords
        keyword_scores.sort(key=lambda x: x[1], reverse=True)
        return [keyword for keyword, score in keyword_scores[:max_keywords]]

    def _normalize_arabic_word(self, word: str) -> str:
        """Basic Arabic word normalization"""
        # Simple normalization (would be more comprehensive in practice)
        normalized = word
        
        # Alef normalization
        normalized = re.sub(r'[أإآ]', 'ا', normalized)
        
        # Yeh normalization
        normalized = re.sub(r'[يى]', 'ي', normalized)
        
        # Remove diacritics
        normalized = re.sub(r'[\u064B-\u0652\u0670\u0640]', '', normalized)
        
        return normalized

    def get_extraction_statistics(self) -> Dict[str, Any]:
        """Get keyword extraction performance statistics"""
        total = max(1, self.extraction_stats["total_extractions"])
        
        return {
            "total_extractions": total,
            "arabic_processing_rate": self.extraction_stats["arabic_extractions"] / total,
            "dialect_detection_rate": self.extraction_stats["dialect_detections"] / total,
            "cultural_term_detection_rate": self.extraction_stats["cultural_term_detections"] / total,
            "professional_term_detection_rate": self.extraction_stats["professional_term_detections"] / total,
        }

    async def extract_search_variations(self, keywords: List[str]) -> List[str]:
        """Generate search variations for improved recall"""
        variations = []
        
        for keyword in keywords:
            # Add original
            variations.append(keyword)
            
            # Add stemmed version (simplified)
            if await self._contains_arabic(keyword):
                # Simple Arabic stemming
                if len(keyword) > 3:
                    # Remove common prefixes/suffixes
                    stemmed = re.sub(r'^(ال|و|ف|ب|ل|ك)', '', keyword)
                    stemmed = re.sub(r'(ة|ات|ين|ون|ها|هم|هن)$', '', stemmed)
                    if len(stemmed) > 2:
                        variations.append(stemmed)
            else:
                # Simple English stemming
                if keyword.endswith('ing'):
                    variations.append(keyword[:-3])
                elif keyword.endswith('ed'):
                    variations.append(keyword[:-2])
                elif keyword.endswith('s') and len(keyword) > 3:
                    variations.append(keyword[:-1])
            
            # Add from variation dictionary
            for base_term, term_variations in self.keyword_variations.items():
                if keyword in term_variations:
                    variations.extend([v for v in term_variations if v != keyword])
        
        return list(set(variations))