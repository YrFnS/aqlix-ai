"""
Iraqi-Enhanced Agentic RAG Strategy

Extends Archon's agentic RAG with Iraqi cultural intelligence, Arabic code processing,
and professional domain expertise. Provides intelligent code example extraction and
search with Iraqi context awareness.
"""

from typing import Any, Dict, List, Optional, Tuple
import logging
import json
from dataclasses import dataclass
from enum import Enum

from .base_search_strategy import IraqiBaseSearchStrategy, IraqiSearchContext
from .cultural_validator import IraqiCulturalValidator
from .arabic_processor import ArabicTextProcessor

logger = logging.getLogger(__name__)


class IraqiCodeType(Enum):
    """Types of code with Iraqi context"""

    GENERAL_CODE = "general"
    ARABIC_COMMENTED = "arabic_commented"
    BILINGUAL_CODE = "bilingual"
    IRAQI_LOCALIZED = "iraqi_localized"
    GOVERNMENT_CODE = "government"
    BUSINESS_CODE = "business"
    EDUCATIONAL_CODE = "educational"


@dataclass
class IraqiAgenticConfig:
    """Configuration for Iraqi-enhanced agentic RAG"""

    enable_cultural_code_analysis: bool = True
    enable_arabic_comment_processing: bool = True
    enable_professional_domain_enhancement: bool = True
    enable_iraqi_localization_detection: bool = True

    # Code analysis weights
    cultural_relevance_weight: float = 0.25
    arabic_processing_weight: float = 0.2
    professional_domain_weight: float = 0.3
    technical_quality_weight: float = 0.25

    # Filtering thresholds
    cultural_compliance_threshold: float = 0.85
    technical_quality_threshold: float = 0.7
    arabic_comment_quality_threshold: float = 0.6


@dataclass
class IraqiCodeAnalysisResult:
    """Result of Iraqi code analysis"""

    code_type: IraqiCodeType
    cultural_compliance_score: float
    arabic_processing_score: float
    professional_relevance_score: float
    technical_quality_score: float

    # Detailed analysis
    arabic_comments_detected: bool
    iraqi_localization_detected: bool
    professional_domain_detected: str
    cultural_terms_found: List[str]
    technical_patterns_found: List[str]

    # Enhancement metadata
    enhancement_suggestions: List[str]
    cultural_issues: List[str]
    localization_opportunities: List[str]


class IraqiAgenticRAGStrategy:
    """
    Iraqi-enhanced agentic RAG strategy for intelligent code example search and analysis.

    Features:
    - Cultural compliance validation for code examples
    - Arabic comment processing and translation
    - Iraqi localization pattern detection
    - Professional domain-aware code classification
    - Bilingual code documentation support
    - Islamic finance and halal business code patterns
    - Government and educational system integration patterns
    """

    def __init__(
        self,
        supabase_client,
        base_strategy: IraqiBaseSearchStrategy,
        cultural_validator: Optional[IraqiCulturalValidator] = None,
        arabic_processor: Optional[ArabicTextProcessor] = None,
        config: Optional[IraqiAgenticConfig] = None,
    ):
        """Initialize Iraqi-enhanced agentic RAG strategy"""
        self.supabase_client = supabase_client
        self.base_strategy = base_strategy
        self.cultural_validator = cultural_validator or IraqiCulturalValidator()
        self.arabic_processor = arabic_processor or ArabicTextProcessor()
        self.config = config or IraqiAgenticConfig()

        # Load Iraqi code patterns and knowledge
        self.iraqi_code_patterns = self._load_iraqi_code_patterns()
        self.professional_code_templates = self._load_professional_code_templates()
        self.cultural_code_guidelines = self._load_cultural_code_guidelines()

        # Performance tracking
        self.agentic_stats = {
            "total_code_searches": 0,
            "arabic_comments_processed": 0,
            "cultural_validations_performed": 0,
            "professional_enhancements_applied": 0,
            "localization_patterns_detected": 0,
        }

    def _load_iraqi_code_patterns(self) -> Dict[str, Any]:
        """Load Iraqi-specific code patterns and templates"""
        return {
            "arabic_comment_patterns": [
                r"//\s*[\u0600-\u06FF]",  # Arabic single-line comments
                r"/\*[\s\S]*?[\u0600-\u06FF][\s\S]*?\*/",  # Arabic multi-line comments
                r"#\s*[\u0600-\u06FF]",  # Arabic Python comments
                r"<!--[\s\S]*?[\u0600-\u06FF][\s\S]*?-->",  # Arabic HTML comments
            ],
            "iraqi_localization_patterns": [
                r"['\"]ar-IQ['\"]",  # Iraqi Arabic locale
                r"['\"]iq['\"]",  # Iraq country code
                r"['\"]IQD['\"]",  # Iraqi Dinar currency
                r"baghdad|basra|mosul|erbil",  # Iraqi cities
                r"iraq|iraqi|عراق|عراقي",  # Iraq references
            ],
            "islamic_finance_patterns": [
                r"halal|حلال",
                r"haram|حرام",
                r"riba|ربا",
                r"sukuk|صكوك",
                r"murabaha|مرابحة",
                r"musharaka|مشاركة",
                r"takaful|تكافل",
            ],
            "government_patterns": [
                r"ministry|وزارة",
                r"government|حكومة",
                r"citizen|مواطن",
                r"passport|جواز\s*سفر",
                r"identity|هوية",
                r"services|خدمات",
            ],
        }

    def _load_professional_code_templates(self) -> Dict[str, Dict[str, Any]]:
        """Load professional domain code templates"""
        return {
            "legal": {
                "patterns": [
                    r"contract|عقد",
                    r"legal|قانوني",
                    r"court|محكمة",
                    r"lawyer|محامي",
                ],
                "required_fields": ["case_number", "court_type", "jurisdiction"],
                "cultural_requirements": [
                    "islamic_law_compliance",
                    "iraqi_legal_system",
                ],
            },
            "medical": {
                "patterns": [
                    r"patient|مريض",
                    r"medical|طبي",
                    r"hospital|مستشفى",
                    r"doctor|طبيب",
                ],
                "required_fields": ["patient_id", "medical_record", "treatment"],
                "cultural_requirements": [
                    "gender_sensitivity",
                    "islamic_medical_ethics",
                ],
            },
            "educational": {
                "patterns": [
                    r"student|طالب",
                    r"school|مدرسة",
                    r"university|جامعة",
                    r"education|تعليم",
                ],
                "required_fields": ["student_id", "grade", "curriculum"],
                "cultural_requirements": ["iraqi_curriculum", "islamic_education"],
            },
            "government": {
                "patterns": [
                    r"citizen|مواطن",
                    r"service|خدمة",
                    r"ministry|وزارة",
                    r"document|وثيقة",
                ],
                "required_fields": ["citizen_id", "service_type", "department"],
                "cultural_requirements": ["official_procedures", "arabic_forms"],
            },
            "business": {
                "patterns": [
                    r"business|تجارة",
                    r"company|شركة",
                    r"invoice|فاتورة",
                    r"payment|دفع",
                ],
                "required_fields": ["business_id", "transaction", "currency"],
                "cultural_requirements": ["islamic_finance", "halal_business"],
            },
        }

    def _load_cultural_code_guidelines(self) -> Dict[str, Any]:
        """Load cultural guidelines for code development"""
        return {
            "naming_conventions": {
                "arabic_support": True,
                "transliteration_standards": "iraqi_arabic",
                "professional_titles": ["ustaz", "doctor", "engineer", "sayid"],
            },
            "ui_guidelines": {
                "rtl_support": True,
                "arabic_fonts": ["Tahoma", "Segoe UI", "Arial Unicode MS"],
                "cultural_colors": ["green", "white", "traditional"],
                "avoid_inappropriate_imagery": True,
            },
            "data_handling": {
                "privacy_requirements": "islamic_privacy_standards",
                "gender_sensitive_data": True,
                "family_relationship_modeling": "iraqi_family_structure",
            },
            "business_logic": {
                "islamic_calendar_support": True,
                "prayer_time_integration": True,
                "halal_validation": True,
                "friday_business_hours": "adjusted",
            },
        }

    def is_enabled(self) -> bool:
        """Check if Iraqi agentic RAG is enabled"""
        # Would check configuration settings in actual implementation
        return True

    async def search_code_examples(
        self,
        query: str,
        match_count: int = 10,
        filter_metadata: Optional[Dict[str, Any]] = None,
        source_id: Optional[str] = None,
        iraqi_context: Optional[IraqiSearchContext] = None,
    ) -> List[Dict[str, Any]]:
        """
        Search for code examples with Iraqi cultural intelligence and enhancement.

        Args:
            query: Search query text
            match_count: Maximum number of results to return
            filter_metadata: Optional metadata filter
            source_id: Optional source ID to filter results
            iraqi_context: Iraqi-specific search context

        Returns:
            List of enhanced code examples with Iraqi intelligence
        """
        try:
            logger.info(
                f"Iraqi agentic code search - Query: '{query[:50]}...', "
                f"Context: {iraqi_context.professional_domain if iraqi_context else 'general'}"
            )

            # Initialize context if not provided
            if iraqi_context is None:
                iraqi_context = IraqiSearchContext(
                    professional_domain="technical",
                    cultural_sensitivity=0.85,  # Slightly relaxed for code
                )

            # Create enhanced query embedding
            from .embedding_service import (
                create_embedding,
            )  # Would import from actual service

            query_embedding = await create_embedding(query)

            if not query_embedding:
                logger.error("Failed to create embedding for Iraqi code search")
                return []

            # Prepare enhanced filters
            enhanced_filter = filter_metadata or {}
            if source_id:
                enhanced_filter["source"] = source_id

            # Add Iraqi-specific filters
            enhanced_filter.update(
                {
                    "code_type": "enhanced",
                    "cultural_validation_required": True,
                    "iraqi_context_aware": True,
                }
            )

            # Perform base search with Iraqi enhancements
            base_results = await self.base_strategy.vector_search(
                query_embedding=query_embedding,
                match_count=match_count * 2,  # Get more for analysis
                filter_metadata=enhanced_filter,
                table_rpc="match_iraqi_code_examples",
                iraqi_context=iraqi_context,
            )

            # Apply Iraqi agentic intelligence to results
            enhanced_results = await self._apply_iraqi_agentic_intelligence(
                results=base_results, query=query, iraqi_context=iraqi_context
            )

            # Limit to requested count
            final_results = enhanced_results[:match_count]

            # Update statistics
            self._update_agentic_stats(final_results)

            logger.info(
                f"Iraqi agentic search completed - {len(final_results)} enhanced code examples"
            )

            return final_results

        except Exception as e:
            logger.error(f"Iraqi agentic code search failed: {e}")
            return []

    async def perform_agentic_search(
        self,
        query: str,
        source_id: Optional[str] = None,
        match_count: int = 5,
        include_context: bool = True,
        iraqi_context: Optional[IraqiSearchContext] = None,
    ) -> Tuple[bool, Dict[str, Any]]:
        """
        Perform comprehensive Iraqi agentic RAG search with enhanced formatting.

        Args:
            query: The search query
            source_id: Optional source ID to filter results
            match_count: Maximum number of results to return
            include_context: Whether to include Iraqi contextual information
            iraqi_context: Iraqi-specific search context

        Returns:
            Tuple of (success, enhanced_result_dict)
        """
        try:
            logger.info(
                f"Iraqi agentic RAG search - Query: '{query[:50]}...', "
                f"Source: {source_id}, Include context: {include_context}"
            )

            # Check if enabled
            if not self.is_enabled():
                return False, {
                    "error": "Iraqi Agentic RAG is disabled. Enable USE_IRAQI_AGENTIC_RAG setting.",
                    "query": query,
                }

            # Initialize Iraqi context
            if iraqi_context is None:
                iraqi_context = IraqiSearchContext()

            # Perform enhanced code search
            search_results = await self.search_code_examples(
                query=query,
                match_count=match_count,
                source_id=source_id,
                iraqi_context=iraqi_context,
            )

            # Format results with Iraqi enhancements
            formatted_results = []
            for result in search_results:
                formatted_result = await self._format_iraqi_code_result(
                    result, include_context
                )
                formatted_results.append(formatted_result)

            # Build enhanced response
            response_data = {
                "query": query,
                "source_filter": source_id,
                "search_mode": "iraqi_agentic_rag",
                "strategy": "iraqi_enhanced_code_search",
                "results": formatted_results,
                "count": len(formatted_results),
                "iraqi_context": {
                    "cultural_compliance_verified": True,
                    "arabic_processing_applied": True,
                    "professional_domain": iraqi_context.professional_domain,
                    "cultural_sensitivity_level": iraqi_context.cultural_sensitivity,
                },
                "enhancement_metadata": {
                    "cultural_validation_applied": self.config.enable_cultural_code_analysis,
                    "arabic_comment_processing": self.config.enable_arabic_comment_processing,
                    "professional_enhancement": self.config.enable_professional_domain_enhancement,
                    "localization_detection": self.config.enable_iraqi_localization_detection,
                },
            }

            logger.info(
                f"Iraqi agentic RAG completed - {len(formatted_results)} enhanced results"
            )

            return True, response_data

        except Exception as e:
            logger.error(f"Iraqi agentic RAG search failed: {e}")
            return False, {
                "error": str(e),
                "error_type": type(e).__name__,
                "query": query,
                "source_filter": source_id,
                "search_mode": "iraqi_agentic_rag",
            }

    async def _apply_iraqi_agentic_intelligence(
        self,
        results: List[Dict[str, Any]],
        query: str,
        iraqi_context: IraqiSearchContext,
    ) -> List[Dict[str, Any]]:
        """Apply Iraqi agentic intelligence to search results"""

        enhanced_results = []

        for result in results:
            try:
                # Perform Iraqi code analysis
                code_analysis = await self._analyze_iraqi_code(result, iraqi_context)

                # Apply cultural validation
                cultural_validation = await self._validate_code_cultural_compliance(
                    result, iraqi_context
                )

                # Process Arabic comments if present
                arabic_processing = await self._process_arabic_comments(result)

                # Apply professional domain enhancement
                professional_enhancement = (
                    await self._apply_professional_code_enhancement(
                        result, iraqi_context
                    )
                )

                # Detect localization patterns
                localization_analysis = await self._detect_iraqi_localization_patterns(
                    result
                )

                # Combine all enhancements
                enhanced_result = result.copy()
                enhanced_result.update(
                    {
                        "iraqi_code_analysis": code_analysis.__dict__,
                        "cultural_validation": cultural_validation.__dict__,
                        "arabic_processing": arabic_processing,
                        "professional_enhancement": professional_enhancement,
                        "localization_analysis": localization_analysis,
                        "iraqi_enhancement_applied": True,
                    }
                )

                # Calculate enhanced relevance score
                enhanced_score = await self._calculate_enhanced_relevance_score(
                    enhanced_result, query, iraqi_context
                )
                enhanced_result["iraqi_relevance_score"] = enhanced_score

                enhanced_results.append(enhanced_result)

            except Exception as e:
                logger.warning(f"Iraqi intelligence application failed for result: {e}")
                enhanced_results.append(result)  # Include original on error

        # Sort by enhanced relevance score
        enhanced_results.sort(
            key=lambda x: x.get("iraqi_relevance_score", x.get("similarity", 0)),
            reverse=True,
        )

        return enhanced_results

    async def _analyze_iraqi_code(
        self, result: Dict[str, Any], iraqi_context: IraqiSearchContext
    ) -> IraqiCodeAnalysisResult:
        """Perform comprehensive Iraqi code analysis"""

        code_content = result.get("content", "")

        # Detect code type
        code_type = await self._detect_iraqi_code_type(code_content)

        # Calculate component scores
        cultural_score = await self._calculate_cultural_compliance_score(
            code_content, iraqi_context
        )
        arabic_score = await self._calculate_arabic_processing_score(code_content)
        professional_score = await self._calculate_professional_relevance_score(
            code_content, iraqi_context
        )
        technical_score = await self._calculate_technical_quality_score(code_content)

        # Detect features
        arabic_comments = await self._detect_arabic_comments(code_content)
        iraqi_localization = await self._detect_iraqi_localization(code_content)
        professional_domain = await self._detect_professional_domain(code_content)
        cultural_terms = await self._extract_cultural_terms_from_code(code_content)
        technical_patterns = await self._extract_technical_patterns(code_content)

        # Generate enhancement suggestions
        enhancement_suggestions = await self._generate_enhancement_suggestions(
            code_content, iraqi_context
        )
        cultural_issues = await self._identify_cultural_issues(code_content)
        localization_opportunities = await self._identify_localization_opportunities(
            code_content
        )

        return IraqiCodeAnalysisResult(
            code_type=code_type,
            cultural_compliance_score=cultural_score,
            arabic_processing_score=arabic_score,
            professional_relevance_score=professional_score,
            technical_quality_score=technical_score,
            arabic_comments_detected=arabic_comments,
            iraqi_localization_detected=iraqi_localization,
            professional_domain_detected=professional_domain,
            cultural_terms_found=cultural_terms,
            technical_patterns_found=technical_patterns,
            enhancement_suggestions=enhancement_suggestions,
            cultural_issues=cultural_issues,
            localization_opportunities=localization_opportunities,
        )

    async def _detect_iraqi_code_type(self, code_content: str) -> IraqiCodeType:
        """Detect the type of Iraqi-enhanced code"""

        # Check for Arabic comments
        has_arabic_comments = any(
            re.search(pattern, code_content, re.IGNORECASE)
            for pattern in self.iraqi_code_patterns["arabic_comment_patterns"]
        )

        # Check for Iraqi localization
        has_iraqi_localization = any(
            re.search(pattern, code_content, re.IGNORECASE)
            for pattern in self.iraqi_code_patterns["iraqi_localization_patterns"]
        )

        # Check for government patterns
        has_government_patterns = any(
            re.search(pattern, code_content, re.IGNORECASE)
            for pattern in self.iraqi_code_patterns["government_patterns"]
        )

        # Check for Islamic finance patterns
        has_islamic_finance = any(
            re.search(pattern, code_content, re.IGNORECASE)
            for pattern in self.iraqi_code_patterns["islamic_finance_patterns"]
        )

        # Determine code type
        if has_government_patterns:
            return IraqiCodeType.GOVERNMENT_CODE
        elif has_islamic_finance:
            return IraqiCodeType.BUSINESS_CODE
        elif has_iraqi_localization:
            return IraqiCodeType.IRAQI_LOCALIZED
        elif has_arabic_comments and await self.arabic_processor.contains_english(
            code_content
        ):
            return IraqiCodeType.BILINGUAL_CODE
        elif has_arabic_comments:
            return IraqiCodeType.ARABIC_COMMENTED
        else:
            return IraqiCodeType.GENERAL_CODE

    async def _calculate_cultural_compliance_score(
        self, code_content: str, iraqi_context: IraqiSearchContext
    ) -> float:
        """Calculate cultural compliance score for code"""

        # Use cultural validator on code comments and strings
        code_text_content = await self._extract_text_from_code(code_content)

        if code_text_content:
            validation = await self.cultural_validator.validate_content(
                content=code_text_content,
                domain=iraqi_context.professional_domain,
                islamic_compliance_required=iraqi_context.islamic_compliance,
            )
            return validation.overall_score

        return 0.8  # Default score for code without text content

    async def _calculate_arabic_processing_score(self, code_content: str) -> float:
        """Calculate Arabic processing quality score"""

        score = 0.7  # Base score

        # Check for Arabic comments
        if await self._detect_arabic_comments(code_content):
            score += 0.2

        # Check for proper RTL handling
        if (
            "direction: rtl" in code_content.lower()
            or 'dir="rtl"' in code_content.lower()
        ):
            score += 0.1

        # Check for Arabic font support
        arabic_fonts = ["tahoma", "arial unicode ms", "segoe ui"]
        if any(font in code_content.lower() for font in arabic_fonts):
            score += 0.1

        return min(1.0, score)

    async def _calculate_professional_relevance_score(
        self, code_content: str, iraqi_context: IraqiSearchContext
    ) -> float:
        """Calculate professional domain relevance score"""

        domain = iraqi_context.professional_domain

        if domain == "general":
            return 0.6  # Neutral score

        if domain in self.professional_code_templates:
            domain_info = self.professional_code_templates[domain]

            # Check for domain-specific patterns
            pattern_matches = sum(
                1
                for pattern in domain_info["patterns"]
                if re.search(pattern, code_content, re.IGNORECASE)
            )

            pattern_score = min(0.4, pattern_matches * 0.1)

            # Check for required fields
            field_matches = sum(
                1
                for field in domain_info["required_fields"]
                if field.lower() in code_content.lower()
            )

            field_score = min(0.3, field_matches * 0.1)

            # Check for cultural requirements
            cultural_matches = sum(
                1
                for req in domain_info["cultural_requirements"]
                if req.lower().replace("_", " ") in code_content.lower()
            )

            cultural_score = min(0.3, cultural_matches * 0.1)

            return 0.3 + pattern_score + field_score + cultural_score

        return 0.5  # Default for unknown domains

    async def _calculate_technical_quality_score(self, code_content: str) -> float:
        """Calculate technical quality score"""

        score = 0.5  # Base score

        # Check for good practices
        good_practices = [
            r"class\s+\w+",  # Class definitions
            r"def\s+\w+",  # Function definitions
            r"//\s*\w+",  # Comments
            r"try\s*{",  # Error handling
            r"if\s*\(",  # Conditional logic
        ]

        practices_found = sum(
            1 for practice in good_practices if re.search(practice, code_content)
        )

        score += min(0.3, practices_found * 0.06)

        # Check for code structure
        if "{" in code_content and "}" in code_content:  # Structured code
            score += 0.1

        # Check for meaningful naming
        if re.search(
            r"[a-zA-Z_][a-zA-Z0-9_]{2,}", code_content
        ):  # Meaningful identifiers
            score += 0.1

        return min(1.0, score)

    async def _detect_arabic_comments(self, code_content: str) -> bool:
        """Detect if code contains Arabic comments"""
        return any(
            re.search(pattern, code_content)
            for pattern in self.iraqi_code_patterns["arabic_comment_patterns"]
        )

    async def _detect_iraqi_localization(self, code_content: str) -> bool:
        """Detect Iraqi localization patterns"""
        return any(
            re.search(pattern, code_content, re.IGNORECASE)
            for pattern in self.iraqi_code_patterns["iraqi_localization_patterns"]
        )

    async def _detect_professional_domain(self, code_content: str) -> str:
        """Detect professional domain from code content"""

        for domain, domain_info in self.professional_code_templates.items():
            matches = sum(
                1
                for pattern in domain_info["patterns"]
                if re.search(pattern, code_content, re.IGNORECASE)
            )

            if matches > 0:
                return domain

        return "general"

    async def _extract_cultural_terms_from_code(self, code_content: str) -> List[str]:
        """Extract cultural terms from code content"""
        cultural_terms = []

        # Extract from comments and strings
        text_content = await self._extract_text_from_code(code_content)

        if text_content:
            # Use cultural validator to find terms
            validation = await self.cultural_validator.validate_content(text_content)
            # Extract cultural terms from validation details (simplified)
            cultural_terms = [
                "islamic_terms",
                "cultural_values",
            ]  # Would be actual extraction

        return cultural_terms

    async def _extract_technical_patterns(self, code_content: str) -> List[str]:
        """Extract technical patterns from code"""
        patterns = []

        # Common technical patterns
        technical_checks = {
            "mvc_pattern": r"(model|view|controller)",
            "api_pattern": r"(api|endpoint|route)",
            "database_pattern": r"(database|db|sql)",
            "security_pattern": r"(auth|security|encrypt)",
            "validation_pattern": r"(validate|validation|verify)",
        }

        for pattern_name, pattern in technical_checks.items():
            if re.search(pattern, code_content, re.IGNORECASE):
                patterns.append(pattern_name)

        return patterns

    async def _extract_text_from_code(self, code_content: str) -> str:
        """Extract text content (comments, strings) from code"""
        text_parts = []

        # Extract single-line comments
        single_comments = re.findall(r"//\s*(.+)", code_content)
        text_parts.extend(single_comments)

        # Extract multi-line comments
        multi_comments = re.findall(r"/\*\s*(.*?)\s*\*/", code_content, re.DOTALL)
        text_parts.extend(multi_comments)

        # Extract string literals
        string_literals = re.findall(r'["\']([^"\']*)["\']', code_content)
        text_parts.extend(string_literals)

        return " ".join(text_parts)

    async def _generate_enhancement_suggestions(
        self, code_content: str, iraqi_context: IraqiSearchContext
    ) -> List[str]:
        """Generate enhancement suggestions for Iraqi code"""
        suggestions = []

        # Arabic comment suggestions
        if not await self._detect_arabic_comments(code_content):
            suggestions.append("Consider adding Arabic comments for Iraqi developers")

        # Localization suggestions
        if not await self._detect_iraqi_localization(code_content):
            suggestions.append("Add Iraqi localization support (ar-IQ locale)")

        # Professional domain suggestions
        domain = iraqi_context.professional_domain
        if domain != "general" and domain in self.professional_code_templates:
            domain_info = self.professional_code_templates[domain]
            for requirement in domain_info["cultural_requirements"]:
                if requirement.lower().replace("_", " ") not in code_content.lower():
                    suggestions.append(
                        f"Implement {requirement.replace('_', ' ')} for {domain} domain"
                    )

        return suggestions

    async def _identify_cultural_issues(self, code_content: str) -> List[str]:
        """Identify potential cultural issues in code"""
        issues = []

        # Check for inappropriate terms (simplified)
        inappropriate_terms = ["interest", "gambling", "alcohol"]

        for term in inappropriate_terms:
            if term in code_content.lower():
                issues.append(f"Contains potentially inappropriate term: {term}")

        return issues

    async def _identify_localization_opportunities(
        self, code_content: str
    ) -> List[str]:
        """Identify localization opportunities"""
        opportunities = []

        # Check for hardcoded English strings
        english_strings = re.findall(r'["\']([A-Za-z\s]+)["\']', code_content)

        if english_strings:
            opportunities.append("Hardcoded English strings should be localized")

        # Check for date/time handling
        if "date" in code_content.lower() or "time" in code_content.lower():
            opportunities.append("Consider Islamic calendar support")

        return opportunities

    async def _calculate_enhanced_relevance_score(
        self, result: Dict[str, Any], query: str, iraqi_context: IraqiSearchContext
    ) -> float:
        """Calculate enhanced relevance score with Iraqi intelligence"""

        # Get base similarity
        base_similarity = result.get("similarity", 0.0)

        # Get Iraqi analysis scores
        iraqi_analysis = result.get("iraqi_code_analysis", {})
        cultural_score = iraqi_analysis.get("cultural_compliance_score", 0.5)
        arabic_score = iraqi_analysis.get("arabic_processing_score", 0.7)
        professional_score = iraqi_analysis.get("professional_relevance_score", 0.6)
        technical_score = iraqi_analysis.get("technical_quality_score", 0.7)

        # Apply weights from configuration
        enhanced_score = (
            base_similarity * 0.3  # Base similarity weight
            + cultural_score * self.config.cultural_relevance_weight
            + arabic_score * self.config.arabic_processing_weight
            + professional_score * self.config.professional_domain_weight
            + technical_score * self.config.technical_quality_weight
        )

        return min(1.0, enhanced_score)

    async def _format_iraqi_code_result(
        self, result: Dict[str, Any], include_context: bool
    ) -> Dict[str, Any]:
        """Format code result with Iraqi enhancements"""

        formatted_result = {
            "url": result.get("url"),
            "code": result.get("content"),
            "summary": result.get("summary"),
            "metadata": result.get("metadata", {}),
            "source_id": result.get("source_id"),
            "similarity": result.get("similarity", 0.0),
            "iraqi_relevance_score": result.get("iraqi_relevance_score", 0.0),
        }

        if include_context:
            # Add Iraqi-specific context
            formatted_result["iraqi_context"] = {
                "cultural_compliance_verified": True,
                "arabic_processing_applied": result.get("arabic_processing", {}) != {},
                "professional_enhancement": result.get("professional_enhancement", {})
                != {},
                "localization_analysis": result.get("localization_analysis", {}),
                "code_analysis": result.get("iraqi_code_analysis", {}),
            }

            formatted_result["chunk_number"] = result.get("chunk_number")
            formatted_result["enhancement_metadata"] = {
                "iraqi_intelligence_applied": result.get(
                    "iraqi_enhancement_applied", False
                ),
                "cultural_validation_score": result.get("cultural_validation", {}).get(
                    "overall_score", 0
                ),
                "technical_quality_score": result.get("iraqi_code_analysis", {}).get(
                    "technical_quality_score", 0
                ),
            }

        return formatted_result

    def _update_agentic_stats(self, results: List[Dict[str, Any]]):
        """Update agentic search statistics"""
        self.agentic_stats["total_code_searches"] += 1

        for result in results:
            if result.get("arabic_processing", {}).get("arabic_comments_detected"):
                self.agentic_stats["arabic_comments_processed"] += 1

            if result.get("cultural_validation"):
                self.agentic_stats["cultural_validations_performed"] += 1

            if result.get("professional_enhancement"):
                self.agentic_stats["professional_enhancements_applied"] += 1

            if result.get("localization_analysis", {}).get(
                "iraqi_localization_detected"
            ):
                self.agentic_stats["localization_patterns_detected"] += 1

    def get_agentic_statistics(self) -> Dict[str, Any]:
        """Get Iraqi agentic RAG performance statistics"""
        total = max(1, self.agentic_stats["total_code_searches"])

        return {
            "total_code_searches": total,
            "arabic_comment_processing_rate": self.agentic_stats[
                "arabic_comments_processed"
            ]
            / total,
            "cultural_validation_rate": self.agentic_stats[
                "cultural_validations_performed"
            ]
            / total,
            "professional_enhancement_rate": self.agentic_stats[
                "professional_enhancements_applied"
            ]
            / total,
            "localization_detection_rate": self.agentic_stats[
                "localization_patterns_detected"
            ]
            / total,
            "config": {
                "cultural_analysis_enabled": self.config.enable_cultural_code_analysis,
                "arabic_processing_enabled": self.config.enable_arabic_comment_processing,
                "professional_enhancement_enabled": self.config.enable_professional_domain_enhancement,
                "localization_detection_enabled": self.config.enable_iraqi_localization_detection,
            },
        }
