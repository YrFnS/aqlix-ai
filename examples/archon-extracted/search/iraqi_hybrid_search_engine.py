"""
Iraqi Hybrid Search Engine - Advanced search combining vector, keyword, and cultural intelligence
Part of Archon extraction with Iraqi professional knowledge base optimization

Implements sophisticated hybrid search with Arabic text processing, Iraqi dialect recognition,
and professional domain specialization with comprehensive cultural validation.
"""

from typing import Dict, List, Optional, Union, Any, Tuple, Set
from dataclasses import dataclass, field
from enum import Enum
import asyncio
import json
import time
import re
from datetime import datetime, timedelta
import hashlib
import logging
from abc import ABC, abstractmethod


class SearchMode(Enum):
    """Search mode types for Iraqi hybrid search"""

    VECTOR_ONLY = "vector_only"
    KEYWORD_ONLY = "keyword_only"
    HYBRID_BALANCED = "hybrid_balanced"
    HYBRID_VECTOR_HEAVY = "hybrid_vector_heavy"
    HYBRID_KEYWORD_HEAVY = "hybrid_keyword_heavy"
    CULTURAL_OPTIMIZED = "cultural_optimized"


class ArabicProcessingMode(Enum):
    """Arabic text processing modes"""

    STANDARD = "standard"
    IRAQI_DIALECT = "iraqi_dialect"
    MIXED_LANGUAGE = "mixed_language"
    PROFESSIONAL_ARABIC = "professional_arabic"


class ResultMergeStrategy(Enum):
    """Result merging strategies for hybrid search"""

    SCORE_WEIGHTED = "score_weighted"
    RANK_FUSION = "rank_fusion"
    CULTURAL_PRIORITY = "cultural_priority"
    PROFESSIONAL_PRIORITY = "professional_priority"


@dataclass
class KeywordExtractionConfig:
    """Configuration for Arabic keyword extraction"""

    min_length: int = 2
    max_keywords: int = 10
    include_root_forms: bool = True
    include_synonyms: bool = True
    filter_stop_words: bool = True
    expand_iraqi_dialect: bool = True
    professional_terms_boost: float = 1.5


@dataclass
class SearchQuery:
    """Enhanced search query with Iraqi context"""

    text: str
    language: str = "ar"  # ar, en, mixed
    dialect: str = "iraqi"  # iraqi, standard, mixed

    # Search configuration
    mode: SearchMode = SearchMode.HYBRID_BALANCED
    arabic_processing: ArabicProcessingMode = ArabicProcessingMode.IRAQI_DIALECT
    merge_strategy: ResultMergeStrategy = ResultMergeStrategy.CULTURAL_PRIORITY

    # Weights and thresholds
    vector_weight: float = 0.6
    keyword_weight: float = 0.4
    cultural_boost: float = 0.1
    similarity_threshold: float = 0.6

    # Iraqi-specific parameters
    governorate_context: Optional[str] = None
    institution_context: Optional[str] = None
    time_period: Optional[str] = None
    professional_domain: Optional[str] = None

    # Quality requirements
    require_cultural_validation: bool = True
    islamic_compliance_required: bool = True
    minimum_accuracy: float = 0.7


@dataclass
class SearchMatch:
    """Individual search match with Iraqi metadata"""

    id: str
    content: str
    title: Optional[str] = None

    # Relevance scores
    vector_score: float = 0.0
    keyword_score: float = 0.0
    hybrid_score: float = 0.0
    cultural_score: float = 0.0
    final_score: float = 0.0

    # Match metadata
    match_type: str = "unknown"  # vector, keyword, hybrid, cultural
    matched_keywords: List[str] = field(default_factory=list)
    keyword_positions: List[int] = field(default_factory=list)

    # Arabic processing results
    language_detected: str = "ar"
    dialect_detected: str = "iraqi"
    arabic_quality_score: float = 0.0
    rtl_compliance: bool = True

    # Cultural validation
    islamic_compliance_passed: bool = False
    cultural_appropriateness_score: float = 0.0
    professional_accuracy_score: float = 0.0

    # Source information
    source_id: str = ""
    source_type: str = ""
    source_authority: str = ""
    chunk_number: Optional[int] = None

    # Iraqi context
    governorate: Optional[str] = None
    institution: Optional[str] = None
    publication_date: Optional[datetime] = None
    last_updated: Optional[datetime] = None


@dataclass
class HybridSearchResult:
    """Comprehensive hybrid search result"""

    query: SearchQuery
    matches: List[SearchMatch]

    # Execution metadata
    total_matches_found: int
    vector_matches: int
    keyword_matches: int
    hybrid_boosted_matches: int

    # Performance metrics
    search_time_ms: float
    vector_search_time: float
    keyword_search_time: float
    merge_time: float
    cultural_validation_time: float

    # Quality metrics
    average_relevance: float = 0.0
    cultural_compliance_rate: float = 0.0
    arabic_quality_average: float = 0.0
    professional_accuracy_average: float = 0.0

    # Search strategy effectiveness
    vector_contribution: float = 0.0
    keyword_contribution: float = 0.0
    cultural_boost_impact: float = 0.0

    # Warnings and recommendations
    warnings: List[str] = field(default_factory=list)
    recommendations: List[str] = field(default_factory=list)


class IraqiKeywordExtractor:
    """Advanced keyword extractor for Arabic and Iraqi dialect text"""

    def __init__(self):
        self.logger = logging.getLogger(__name__)

        # Arabic stop words
        self.arabic_stop_words = {
            "في",
            "من",
            "إلى",
            "على",
            "عن",
            "مع",
            "أن",
            "كان",
            "هذا",
            "هذه",
            "التي",
            "الذي",
            "التي",
            "التني",
            "قد",
            "لقد",
            "كل",
            "بعض",
            "أكثر",
            "أول",
            "آخر",
            "بعد",
            "قبل",
            "عند",
            "لدى",
            "أمام",
            "وراء",
            "تحت",
            "فوق",
        }

        # Iraqi dialect-specific terms and their standard Arabic equivalents
        self.iraqi_dialect_mapping = {
            "شلونك": "كيف حالك",
            "اكو": "يوجد",
            "ماكو": "لا يوجد",
            "هسه": "الآن",
            "زين": "جيد",
            "مال": "ماذا",
            "وين": "أين",
            "منين": "من أين",
            "شنو": "ماذا",
            "ليش": "لماذا",
            "تريد": "تريد",
            "اريد": "أريد",
            "ماني": "لست",
            "مو": "ليس",
            "هاي": "هذه",
            "هاك": "هناك",
        }

        # Professional domain terms
        self.professional_terms = {
            "legal": [
                "قانون",
                "محكمة",
                "قاضي",
                "عدالة",
                "حكم",
                "دعوى",
                "محام",
                "برلمان",
                "دستور",
                "تشريع",
                "قرار",
                "لائحة",
                "نظام",
                "مرسوم",
            ],
            "medical": [
                "طب",
                "طبيب",
                "مريض",
                "علاج",
                "دواء",
                "مستشفى",
                "عيادة",
                "تشخيص",
                "عملية",
                "فحص",
                "صحة",
                "مرض",
                "وقاية",
                "تطعيم",
            ],
            "education": [
                "تعليم",
                "تربية",
                "مدرسة",
                "جامعة",
                "معلم",
                "أستاذ",
                "طالب",
                "دراسة",
                "منهج",
                "امتحان",
                "شهادة",
                "كلية",
                "قسم",
                "تخرج",
            ],
            "government": [
                "حكومة",
                "وزارة",
                "وزير",
                "دولة",
                "حكومي",
                "رسمي",
                "خدمة",
                "إدارة",
                "مؤسسة",
                "هيئة",
                "مجلس",
                "لجنة",
                "سلطة",
                "منصب",
            ],
        }

    def extract_keywords(self, text: str, config: KeywordExtractionConfig) -> List[str]:
        """Extract keywords from Arabic/Iraqi text with cultural awareness"""

        text_clean = self._preprocess_text(text)

        # Extract base keywords
        base_keywords = self._extract_base_keywords(text_clean, config)

        # Expand with Iraqi dialect variations
        if config.expand_iraqi_dialect:
            base_keywords.extend(self._expand_iraqi_dialect(base_keywords))

        # Add root forms for Arabic words
        if config.include_root_forms:
            base_keywords.extend(self._extract_arabic_roots(base_keywords))

        # Add synonyms and related terms
        if config.include_synonyms:
            base_keywords.extend(self._expand_synonyms(base_keywords))

        # Boost professional terms
        professional_keywords = self._identify_professional_terms(base_keywords)

        # Final filtering and ranking
        final_keywords = self._filter_and_rank_keywords(
            base_keywords + professional_keywords, config
        )

        return final_keywords[: config.max_keywords]

    def _preprocess_text(self, text: str) -> str:
        """Preprocess Arabic text for keyword extraction"""

        # Remove diacritics
        text = re.sub(r"[\u064B-\u065F\u0670\u0640]", "", text)

        # Normalize Arabic letters
        text = re.sub(r"[أإآ]", "ا", text)
        text = re.sub(r"[ىي]", "ي", text)
        text = re.sub(r"[ةه]", "ه", text)

        # Remove extra whitespace
        text = re.sub(r"\s+", " ", text.strip())

        return text

    def _extract_base_keywords(
        self, text: str, config: KeywordExtractionConfig
    ) -> List[str]:
        """Extract base keywords from preprocessed text"""

        # Split into words
        words = text.split()

        keywords = []
        for word in words:
            # Filter by length
            if len(word) < config.min_length:
                continue

            # Filter stop words
            if config.filter_stop_words and word in self.arabic_stop_words:
                continue

            # Remove punctuation
            clean_word = re.sub(
                r"[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z]",
                "",
                word,
            )

            if clean_word and len(clean_word) >= config.min_length:
                keywords.append(clean_word)

        return keywords

    def _expand_iraqi_dialect(self, keywords: List[str]) -> List[str]:
        """Expand keywords with Iraqi dialect variations"""

        expanded = []

        for keyword in keywords:
            # Check if it's an Iraqi dialect term
            if keyword in self.iraqi_dialect_mapping:
                expanded.append(self.iraqi_dialect_mapping[keyword])

            # Check if it's a standard Arabic term with Iraqi equivalent
            for iraqi, standard in self.iraqi_dialect_mapping.items():
                if keyword == standard:
                    expanded.append(iraqi)

        return expanded

    def _extract_arabic_roots(self, keywords: List[str]) -> List[str]:
        """Extract Arabic root forms (simplified implementation)"""

        roots = []

        for keyword in keywords:
            if len(keyword) >= 3 and self._is_arabic(keyword):
                # Simplified root extraction (real implementation would use morphological analysis)
                if len(keyword) >= 4:
                    # Try to extract 3-letter root
                    potential_root = keyword[:3]
                    if len(potential_root) == 3:
                        roots.append(potential_root)

        return roots

    def _is_arabic(self, text: str) -> bool:
        """Check if text contains Arabic characters"""
        arabic_pattern = re.compile(r"[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]")
        return bool(arabic_pattern.search(text))

    def _expand_synonyms(self, keywords: List[str]) -> List[str]:
        """Expand keywords with synonyms and related terms"""

        # Simple synonym expansion (real implementation would use thesaurus)
        synonym_map = {
            "تعليم": ["تربية", "دراسة", "تدريس"],
            "طب": ["صحة", "علاج", "دواء"],
            "قانون": ["تشريع", "نظام", "حكم"],
            "حكومة": ["دولة", "إدارة", "سلطة"],
        }

        synonyms = []
        for keyword in keywords:
            if keyword in synonym_map:
                synonyms.extend(synonym_map[keyword])

        return synonyms

    def _identify_professional_terms(self, keywords: List[str]) -> List[str]:
        """Identify and boost professional domain terms"""

        professional_keywords = []

        for domain, terms in self.professional_terms.items():
            for keyword in keywords:
                if keyword in terms:
                    professional_keywords.append(keyword)

        return professional_keywords

    def _filter_and_rank_keywords(
        self, keywords: List[str], config: KeywordExtractionConfig
    ) -> List[str]:
        """Filter and rank keywords by importance"""

        # Count frequency
        keyword_freq = {}
        for keyword in keywords:
            keyword_freq[keyword] = keyword_freq.get(keyword, 0) + 1

        # Sort by frequency and importance
        sorted_keywords = sorted(
            keyword_freq.keys(),
            key=lambda k: (
                keyword_freq[k],  # Frequency
                len(k),  # Length (longer words often more specific)
                self._get_professional_boost(k, config.professional_terms_boost),
            ),
            reverse=True,
        )

        return sorted_keywords

    def _get_professional_boost(self, keyword: str, boost_factor: float) -> float:
        """Get professional term boost score"""

        for domain_terms in self.professional_terms.values():
            if keyword in domain_terms:
                return boost_factor

        return 1.0


class IraqiHybridSearchEngine:
    """
    Advanced hybrid search engine for Iraqi knowledge systems

    Combines vector similarity search with intelligent keyword search,
    Arabic text processing, and cultural validation for optimal results.
    """

    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.keyword_extractor = IraqiKeywordExtractor()

        # Search performance metrics
        self.metrics = {
            "total_searches": 0,
            "successful_searches": 0,
            "average_search_time": 0.0,
            "vector_search_time": 0.0,
            "keyword_search_time": 0.0,
            "cultural_validation_time": 0.0,
            "average_relevance_score": 0.0,
            "cultural_compliance_rate": 0.0,
        }

        # Cultural validation rules
        self.cultural_rules = {
            "prohibited_content": [
                "gambling",
                "alcohol",
                "usury",
                "inappropriate_content",
            ],
            "positive_indicators": [
                "family",
                "community",
                "education",
                "justice",
                "health",
            ],
            "professional_requirements": {
                "legal": {"accuracy_min": 0.95, "citation_required": True},
                "medical": {"accuracy_min": 0.98, "citation_required": True},
                "education": {"accuracy_min": 0.90, "cultural_appropriate": True},
            },
        }

    async def search(
        self, query: SearchQuery, max_results: int = 10
    ) -> HybridSearchResult:
        """
        Perform comprehensive hybrid search with Iraqi cultural optimization

        Args:
            query: Search query with Iraqi context
            max_results: Maximum number of results to return

        Returns:
            HybridSearchResult with culturally validated matches
        """
        start_time = time.time()

        try:
            self.logger.info(f"Starting Iraqi hybrid search: {query.text[:100]}")
            self.metrics["total_searches"] += 1

            # Step 1: Preprocess and enhance query
            enhanced_query = await self._enhance_query_for_iraqi_context(query)

            # Step 2: Extract keywords with Arabic processing
            extraction_config = KeywordExtractionConfig(
                expand_iraqi_dialect=True,
                include_synonyms=True,
                professional_terms_boost=2.0 if query.professional_domain else 1.0,
            )
            keywords = self.keyword_extractor.extract_keywords(
                enhanced_query.text, extraction_config
            )

            # Step 3: Execute searches based on mode
            search_results = await self._execute_search_strategy(
                enhanced_query, keywords, max_results
            )

            # Step 4: Apply cultural validation and filtering
            validated_results = await self._apply_cultural_validation(
                search_results, query
            )

            # Step 5: Merge and rank results
            final_matches = await self._merge_and_rank_results(validated_results, query)

            # Step 6: Build comprehensive response
            result = await self._build_search_result(
                query, final_matches, start_time, search_results
            )

            self.metrics["successful_searches"] += 1
            self._update_performance_metrics(result)

            return result

        except Exception as e:
            self.logger.error(f"Iraqi hybrid search failed: {str(e)}")

            return HybridSearchResult(
                query=query,
                matches=[],
                total_matches_found=0,
                vector_matches=0,
                keyword_matches=0,
                hybrid_boosted_matches=0,
                search_time_ms=(time.time() - start_time) * 1000,
                vector_search_time=0.0,
                keyword_search_time=0.0,
                merge_time=0.0,
                cultural_validation_time=0.0,
                warnings=[f"Search execution failed: {str(e)}"],
            )

    async def _enhance_query_for_iraqi_context(self, query: SearchQuery) -> SearchQuery:
        """Enhance query with Iraqi cultural and linguistic context"""

        enhanced_text = query.text

        # Add Arabic/Iraqi context terms
        if query.arabic_processing != ArabicProcessingMode.STANDARD:
            # Add Iraqi dialect context
            if "iraqi" in query.dialect.lower():
                enhanced_text = self._add_iraqi_context_terms(enhanced_text)

        # Add professional domain context
        if query.professional_domain:
            enhanced_text = self._add_professional_context(
                enhanced_text, query.professional_domain
            )

        # Add geographical context
        if query.governorate_context:
            enhanced_text += f" {query.governorate_context}"

        # Create enhanced query
        enhanced_query = SearchQuery(
            text=enhanced_text,
            language=query.language,
            dialect=query.dialect,
            mode=query.mode,
            arabic_processing=query.arabic_processing,
            merge_strategy=query.merge_strategy,
            vector_weight=query.vector_weight,
            keyword_weight=query.keyword_weight,
            cultural_boost=query.cultural_boost,
            similarity_threshold=query.similarity_threshold,
            governorate_context=query.governorate_context,
            institution_context=query.institution_context,
            professional_domain=query.professional_domain,
            require_cultural_validation=query.require_cultural_validation,
            islamic_compliance_required=query.islamic_compliance_required,
            minimum_accuracy=query.minimum_accuracy,
        )

        return enhanced_query

    def _add_iraqi_context_terms(self, text: str) -> str:
        """Add Iraqi dialect and cultural context terms"""

        iraqi_context_terms = ["عراقي", "بغداد", "محلي", "عراق"]

        # Add relevant context terms
        for term in iraqi_context_terms:
            if term not in text:
                text += f" {term}"

        return text

    def _add_professional_context(self, text: str, domain: str) -> str:
        """Add professional domain context terms"""

        domain_context = {
            "legal": ["قانوني", "قضائي", "تشريعي"],
            "medical": ["طبي", "صحي", "علاجي"],
            "education": ["تعليمي", "تربوي", "أكاديمي"],
            "government": ["حكومي", "رسمي", "إداري"],
        }

        terms = domain_context.get(domain, [])
        for term in terms:
            if term not in text:
                text += f" {term}"

        return text

    async def _execute_search_strategy(
        self, query: SearchQuery, keywords: List[str], max_results: int
    ) -> Dict[str, List[SearchMatch]]:
        """Execute search strategy based on query mode"""

        results = {}

        if query.mode in [
            SearchMode.VECTOR_ONLY,
            SearchMode.HYBRID_BALANCED,
            SearchMode.HYBRID_VECTOR_HEAVY,
            SearchMode.CULTURAL_OPTIMIZED,
        ]:
            # Execute vector search
            vector_start = time.time()
            results["vector"] = await self._vector_search(query, max_results * 2)
            self.metrics["vector_search_time"] = (time.time() - vector_start) * 1000

        if query.mode in [
            SearchMode.KEYWORD_ONLY,
            SearchMode.HYBRID_BALANCED,
            SearchMode.HYBRID_KEYWORD_HEAVY,
            SearchMode.CULTURAL_OPTIMIZED,
        ]:
            # Execute keyword search
            keyword_start = time.time()
            results["keyword"] = await self._keyword_search(
                query, keywords, max_results * 2
            )
            self.metrics["keyword_search_time"] = (time.time() - keyword_start) * 1000

        return results

    async def _vector_search(
        self, query: SearchQuery, max_results: int
    ) -> List[SearchMatch]:
        """Perform vector-based semantic search"""

        # Mock vector search implementation
        # In real implementation, this would use embeddings and vector database

        matches = []
        for i in range(min(max_results, 8)):
            match = SearchMatch(
                id=f"vec_{i}",
                content=f"Vector search result {i} for: {query.text}",
                title=f"Document {i}",
                vector_score=0.9 - (i * 0.1),
                match_type="vector",
                language_detected=query.language,
                dialect_detected=query.dialect,
                source_id=f"source_{i}",
                governorate=query.governorate_context,
            )
            matches.append(match)

        return matches

    async def _keyword_search(
        self, query: SearchQuery, keywords: List[str], max_results: int
    ) -> List[SearchMatch]:
        """Perform keyword-based search with Arabic support"""

        matches = []

        # Simulate keyword search for each extracted keyword
        for i, keyword in enumerate(keywords[:6]):  # Limit keywords processed
            for j in range(min(2, max_results // len(keywords) + 1)):
                match_id = f"kw_{i}_{j}"

                # Calculate keyword score based on match quality
                keyword_score = 0.8 - (i * 0.1) - (j * 0.05)

                match = SearchMatch(
                    id=match_id,
                    content=f"Keyword search result for '{keyword}': {query.text}",
                    title=f"Document with keyword: {keyword}",
                    keyword_score=keyword_score,
                    match_type="keyword",
                    matched_keywords=[keyword],
                    keyword_positions=[20 + j * 50],  # Mock positions
                    language_detected=query.language,
                    dialect_detected=query.dialect,
                    source_id=f"source_kw_{i}",
                    governorate=query.governorate_context,
                )
                matches.append(match)

        # Sort by keyword score
        matches.sort(key=lambda x: x.keyword_score, reverse=True)

        return matches[:max_results]

    async def _apply_cultural_validation(
        self, search_results: Dict[str, List[SearchMatch]], query: SearchQuery
    ) -> Dict[str, List[SearchMatch]]:
        """Apply cultural validation to search results"""

        if not query.require_cultural_validation:
            return search_results

        validation_start = time.time()
        validated_results = {}

        for search_type, matches in search_results.items():
            validated_matches = []

            for match in matches:
                # Perform cultural validation
                cultural_validation = await self._validate_cultural_appropriateness(
                    match, query
                )

                match.cultural_appropriateness_score = cultural_validation["score"]
                match.islamic_compliance_passed = cultural_validation[
                    "islamic_compliant"
                ]

                # Apply filtering based on requirements
                if (
                    query.islamic_compliance_required
                    and not match.islamic_compliance_passed
                ):
                    continue

                if match.cultural_appropriateness_score < 0.5:
                    continue

                # Calculate Arabic quality score
                match.arabic_quality_score = self._calculate_arabic_quality(
                    match, query
                )

                # Calculate professional accuracy if applicable
                if query.professional_domain:
                    match.professional_accuracy_score = (
                        await self._calculate_professional_accuracy(
                            match, query.professional_domain
                        )
                    )

                validated_matches.append(match)

            validated_results[search_type] = validated_matches

        self.metrics["cultural_validation_time"] = (
            time.time() - validation_start
        ) * 1000

        return validated_results

    async def _validate_cultural_appropriateness(
        self, match: SearchMatch, query: SearchQuery
    ) -> Dict[str, Any]:
        """Validate cultural appropriateness of search result"""

        content_lower = match.content.lower()

        # Check for prohibited content
        prohibited_violations = 0
        for term in self.cultural_rules["prohibited_content"]:
            if term in content_lower:
                prohibited_violations += 1

        # Check for positive indicators
        positive_count = 0
        for indicator in self.cultural_rules["positive_indicators"]:
            if indicator in content_lower:
                positive_count += 1

        # Calculate cultural score
        cultural_score = 1.0 - (prohibited_violations * 0.3) + (positive_count * 0.1)
        cultural_score = max(0.0, min(1.0, cultural_score))

        # Islamic compliance check
        islamic_compliant = prohibited_violations == 0 and cultural_score >= 0.7

        return {
            "score": cultural_score,
            "islamic_compliant": islamic_compliant,
            "prohibited_violations": prohibited_violations,
            "positive_indicators": positive_count,
        }

    def _calculate_arabic_quality(
        self, match: SearchMatch, query: SearchQuery
    ) -> float:
        """Calculate Arabic text quality score"""

        content = match.content

        # Check for Arabic characters
        arabic_char_count = len(re.findall(r"[\u0600-\u06FF]", content))
        total_chars = len(content)

        if total_chars == 0:
            return 0.5

        arabic_ratio = arabic_char_count / total_chars

        # Quality based on Arabic content ratio and language requirements
        if query.language == "ar":
            if arabic_ratio > 0.8:
                return 1.0
            elif arabic_ratio > 0.5:
                return 0.8
            else:
                return 0.4
        elif query.language == "mixed":
            if 0.3 <= arabic_ratio <= 0.7:
                return 1.0
            else:
                return 0.7
        else:  # English
            return 0.8  # Default for English content

    async def _calculate_professional_accuracy(
        self, match: SearchMatch, domain: str
    ) -> float:
        """Calculate professional accuracy score for domain-specific content"""

        domain_keywords = self.keyword_extractor.professional_terms.get(domain, [])
        if not domain_keywords:
            return 0.7  # Default accuracy

        content_lower = match.content.lower()
        matched_terms = sum(1 for term in domain_keywords if term in content_lower)

        # Calculate accuracy based on professional term density
        accuracy = min(1.0, 0.5 + (matched_terms * 0.1))

        # Boost for official sources
        if match.source_authority == "official":
            accuracy += 0.2
        elif match.source_authority == "academic":
            accuracy += 0.1

        return min(1.0, accuracy)

    async def _merge_and_rank_results(
        self, validated_results: Dict[str, List[SearchMatch]], query: SearchQuery
    ) -> List[SearchMatch]:
        """Merge and rank results using specified strategy"""

        merge_start = time.time()

        if query.merge_strategy == ResultMergeStrategy.SCORE_WEIGHTED:
            merged = await self._merge_score_weighted(validated_results, query)
        elif query.merge_strategy == ResultMergeStrategy.RANK_FUSION:
            merged = await self._merge_rank_fusion(validated_results, query)
        elif query.merge_strategy == ResultMergeStrategy.CULTURAL_PRIORITY:
            merged = await self._merge_cultural_priority(validated_results, query)
        else:  # PROFESSIONAL_PRIORITY
            merged = await self._merge_professional_priority(validated_results, query)

        self.metrics["merge_time"] = (time.time() - merge_start) * 1000

        return merged

    async def _merge_score_weighted(
        self, results: Dict[str, List[SearchMatch]], query: SearchQuery
    ) -> List[SearchMatch]:
        """Merge results using weighted scoring"""

        all_matches = []
        seen_ids = set()

        # Collect all unique matches
        for search_type, matches in results.items():
            for match in matches:
                if match.id not in seen_ids:
                    # Calculate hybrid score
                    vector_component = match.vector_score * query.vector_weight
                    keyword_component = match.keyword_score * query.keyword_weight
                    cultural_component = (
                        match.cultural_appropriateness_score * query.cultural_boost
                    )

                    match.hybrid_score = (
                        vector_component + keyword_component + cultural_component
                    )
                    match.final_score = match.hybrid_score

                    all_matches.append(match)
                    seen_ids.add(match.id)

        # Sort by final score
        all_matches.sort(key=lambda x: x.final_score, reverse=True)

        return all_matches

    async def _merge_rank_fusion(
        self, results: Dict[str, List[SearchMatch]], query: SearchQuery
    ) -> List[SearchMatch]:
        """Merge results using reciprocal rank fusion"""

        # Create rank mappings for each search type
        rank_maps = {}
        for search_type, matches in results.items():
            rank_maps[search_type] = {
                match.id: rank + 1 for rank, match in enumerate(matches)
            }

        # Calculate RRF scores
        all_matches = {}
        for search_type, matches in results.items():
            for match in matches:
                if match.id not in all_matches:
                    all_matches[match.id] = match
                    match.final_score = 0.0

                # Add RRF contribution
                rank = rank_maps[search_type].get(match.id, len(matches) + 1)
                rrf_score = 1.0 / (60 + rank)  # Standard RRF with k=60

                match.final_score += rrf_score

        # Apply cultural boost
        for match in all_matches.values():
            cultural_boost = match.cultural_appropriateness_score * query.cultural_boost
            match.final_score += cultural_boost

        # Sort by final score
        final_matches = list(all_matches.values())
        final_matches.sort(key=lambda x: x.final_score, reverse=True)

        return final_matches

    async def _merge_cultural_priority(
        self, results: Dict[str, List[SearchMatch]], query: SearchQuery
    ) -> List[SearchMatch]:
        """Merge results with cultural appropriateness as primary factor"""

        all_matches = []
        seen_ids = set()

        # Collect all matches
        for search_type, matches in results.items():
            for match in matches:
                if match.id not in seen_ids:
                    all_matches.append(match)
                    seen_ids.add(match.id)

        # Calculate cultural-priority score
        for match in all_matches:
            relevance_score = max(match.vector_score, match.keyword_score)
            cultural_weight = 0.6  # Heavy emphasis on cultural factors
            relevance_weight = 0.4

            match.final_score = (
                match.cultural_appropriateness_score * cultural_weight
                + relevance_score * relevance_weight
            )

            # Boost Islamic compliant content
            if match.islamic_compliance_passed:
                match.final_score += 0.1

        # Sort by final score
        all_matches.sort(key=lambda x: x.final_score, reverse=True)

        return all_matches

    async def _merge_professional_priority(
        self, results: Dict[str, List[SearchMatch]], query: SearchQuery
    ) -> List[SearchMatch]:
        """Merge results with professional accuracy as primary factor"""

        all_matches = []
        seen_ids = set()

        # Collect all matches
        for search_type, matches in results.items():
            for match in matches:
                if match.id not in seen_ids:
                    all_matches.append(match)
                    seen_ids.add(match.id)

        # Calculate professional-priority score
        for match in all_matches:
            relevance_score = max(match.vector_score, match.keyword_score)
            professional_weight = 0.5
            cultural_weight = 0.3
            relevance_weight = 0.2

            match.final_score = (
                match.professional_accuracy_score * professional_weight
                + match.cultural_appropriateness_score * cultural_weight
                + relevance_score * relevance_weight
            )

        # Sort by final score
        all_matches.sort(key=lambda x: x.final_score, reverse=True)

        return all_matches

    async def _build_search_result(
        self,
        query: SearchQuery,
        matches: List[SearchMatch],
        start_time: float,
        search_results: Dict[str, List[SearchMatch]],
    ) -> HybridSearchResult:
        """Build comprehensive search result"""

        total_time = (time.time() - start_time) * 1000

        # Count match types
        vector_count = len(search_results.get("vector", []))
        keyword_count = len(search_results.get("keyword", []))
        hybrid_boosted = sum(1 for m in matches if m.match_type == "hybrid")

        # Calculate quality metrics
        if matches:
            avg_relevance = sum(m.final_score for m in matches) / len(matches)
            cultural_compliance_rate = sum(
                1 for m in matches if m.islamic_compliance_passed
            ) / len(matches)
            arabic_quality_avg = sum(m.arabic_quality_score for m in matches) / len(
                matches
            )
            professional_accuracy_avg = sum(
                m.professional_accuracy_score for m in matches
            ) / len(matches)
        else:
            avg_relevance = 0.0
            cultural_compliance_rate = 0.0
            arabic_quality_avg = 0.0
            professional_accuracy_avg = 0.0

        # Generate recommendations
        recommendations = []
        if cultural_compliance_rate < 0.8:
            recommendations.append(
                "Consider refining query for better cultural compliance"
            )
        if arabic_quality_avg < 0.7 and query.language == "ar":
            recommendations.append("Arabic content quality could be improved")
        if professional_accuracy_avg < 0.8 and query.professional_domain:
            recommendations.append(
                f"Professional accuracy for {query.professional_domain} domain needs improvement"
            )

        result = HybridSearchResult(
            query=query,
            matches=matches,
            total_matches_found=vector_count + keyword_count,
            vector_matches=vector_count,
            keyword_matches=keyword_count,
            hybrid_boosted_matches=hybrid_boosted,
            search_time_ms=total_time,
            vector_search_time=self.metrics.get("vector_search_time", 0.0),
            keyword_search_time=self.metrics.get("keyword_search_time", 0.0),
            merge_time=self.metrics.get("merge_time", 0.0),
            cultural_validation_time=self.metrics.get("cultural_validation_time", 0.0),
            average_relevance=avg_relevance,
            cultural_compliance_rate=cultural_compliance_rate,
            arabic_quality_average=arabic_quality_avg,
            professional_accuracy_average=professional_accuracy_avg,
            vector_contribution=query.vector_weight,
            keyword_contribution=query.keyword_weight,
            cultural_boost_impact=query.cultural_boost,
            recommendations=recommendations,
        )

        return result

    def _update_performance_metrics(self, result: HybridSearchResult):
        """Update search engine performance metrics"""

        total = self.metrics["total_searches"]
        if total > 0:
            # Update running averages
            self.metrics["average_search_time"] = (
                self.metrics["average_search_time"] * (total - 1)
                + result.search_time_ms
            ) / total

            self.metrics["average_relevance_score"] = (
                self.metrics["average_relevance_score"] * (total - 1)
                + result.average_relevance
            ) / total

            self.metrics["cultural_compliance_rate"] = (
                self.metrics["cultural_compliance_rate"] * (total - 1)
                + result.cultural_compliance_rate
            ) / total

    def get_performance_analytics(self) -> Dict[str, Any]:
        """Get comprehensive performance analytics"""

        success_rate = 0.0
        if self.metrics["total_searches"] > 0:
            success_rate = (
                self.metrics["successful_searches"] / self.metrics["total_searches"]
            )

        return {
            "total_searches": self.metrics["total_searches"],
            "successful_searches": self.metrics["successful_searches"],
            "success_rate": success_rate,
            "average_search_time_ms": self.metrics["average_search_time"],
            "average_vector_search_time_ms": self.metrics["vector_search_time"],
            "average_keyword_search_time_ms": self.metrics["keyword_search_time"],
            "average_cultural_validation_time_ms": self.metrics[
                "cultural_validation_time"
            ],
            "average_relevance_score": self.metrics["average_relevance_score"],
            "cultural_compliance_rate": self.metrics["cultural_compliance_rate"],
            "search_engine_health": "healthy"
            if success_rate > 0.95
            else "warning"
            if success_rate > 0.85
            else "critical",
        }
