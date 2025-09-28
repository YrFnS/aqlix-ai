"""
Iraqi Cultural Reranker - Advanced reranking with cultural intelligence and professional domain awareness
Part of Archon extraction with Iraqi knowledge base optimization

Implements sophisticated reranking that considers Islamic compliance, Iraqi cultural context,
professional accuracy, and Arabic language quality for optimal result ordering.
"""

from typing import Dict, List, Optional, Union, Any, Tuple
from dataclasses import dataclass, field
from enum import Enum
import asyncio
import json
import time
import math
from datetime import datetime, timedelta
import logging
from abc import ABC, abstractmethod


class RerankingStrategy(Enum):
    """Reranking strategy types for Iraqi systems"""

    CULTURAL_FIRST = "cultural_first"
    PROFESSIONAL_ACCURACY = "professional_accuracy"
    ISLAMIC_COMPLIANCE = "islamic_compliance"
    BALANCED_SCORING = "balanced_scoring"
    SOURCE_AUTHORITY = "source_authority"
    TEMPORAL_RELEVANCE = "temporal_relevance"


class CulturalWeight(Enum):
    """Cultural weight levels for reranking"""

    MINIMAL = 0.1
    MODERATE = 0.3
    HIGH = 0.5
    MAXIMUM = 0.7


class ProfessionalDomain(Enum):
    """Iraqi professional domains for specialized reranking"""

    LEGAL = "legal"
    MEDICAL = "medical"
    EDUCATION = "education"
    GOVERNMENT = "government"
    BANKING = "banking"
    ENGINEERING = "engineering"
    RELIGIOUS = "religious"
    GENERAL = "general"


@dataclass
class RerankingContext:
    """Context for Iraqi cultural reranking"""

    strategy: RerankingStrategy = RerankingStrategy.BALANCED_SCORING
    cultural_weight: CulturalWeight = CulturalWeight.HIGH
    professional_domain: Optional[ProfessionalDomain] = None

    # Cultural requirements
    islamic_compliance_required: bool = True
    cultural_sensitivity_level: str = "high"  # low, medium, high, strict
    arabic_preference: bool = True
    iraqi_dialect_preference: bool = True

    # Professional requirements
    minimum_professional_accuracy: float = 0.8
    require_official_sources: bool = False
    require_citations: bool = False
    temporal_decay_factor: float = 0.1

    # Scoring weights
    relevance_weight: float = 0.4
    cultural_weight_value: float = 0.3
    professional_weight: float = 0.2
    source_authority_weight: float = 0.1

    # Iraqi-specific context
    governorate_preference: Optional[str] = None
    institution_preference: Optional[str] = None
    time_period_preference: Optional[str] = None


@dataclass
class RerankingFeatures:
    """Features extracted for reranking calculation"""

    # Original relevance scores
    original_score: float
    vector_similarity: float
    keyword_match_score: float

    # Cultural features
    islamic_compliance_score: float
    cultural_appropriateness_score: float
    arabic_quality_score: float
    iraqi_dialect_score: float

    # Professional features
    professional_accuracy_score: float
    domain_expertise_score: float
    citation_quality_score: float

    # Source features
    source_authority_score: float
    publication_date_score: float
    update_frequency_score: float

    # Content features
    content_completeness_score: float
    readability_score: float
    factual_accuracy_score: float

    # Iraqi context features
    governorate_relevance_score: float = 0.0
    institution_relevance_score: float = 0.0
    local_context_score: float = 0.0


@dataclass
class RerankingResult:
    """Individual reranking result with detailed scoring"""

    id: str
    content: str
    title: Optional[str] = None

    # Reranking scores
    original_rank: int = 0
    reranked_score: float = 0.0
    new_rank: int = 0
    rank_change: int = 0

    # Feature scores
    features: Optional[RerankingFeatures] = None

    # Cultural validation
    cultural_compliance_passed: bool = False
    islamic_compliance_passed: bool = False
    cultural_appropriateness_level: str = "unknown"

    # Professional validation
    professional_accuracy_passed: bool = False
    domain_expertise_validated: bool = False
    citation_requirements_met: bool = False

    # Explanation
    reranking_explanation: str = ""
    confidence_score: float = 0.0

    # Metadata
    source_id: str = ""
    source_type: str = ""
    governorate: Optional[str] = None
    institution: Optional[str] = None

    # Quality indicators
    quality_indicators: List[str] = field(default_factory=list)
    improvement_suggestions: List[str] = field(default_factory=list)


@dataclass
class RerankingAnalytics:
    """Analytics for reranking performance"""

    total_items_reranked: int
    reranking_time_ms: float

    # Effectiveness metrics
    average_rank_change: float
    significant_rank_changes: int  # Changes > 5 positions
    cultural_compliance_improvement: float
    professional_accuracy_improvement: float

    # Strategy effectiveness
    strategy_used: RerankingStrategy
    cultural_weight_impact: float
    professional_weight_impact: float
    source_authority_impact: float

    # Quality metrics
    overall_quality_improvement: float
    user_satisfaction_prediction: float

    # Warnings and recommendations
    warnings: List[str] = field(default_factory=list)
    recommendations: List[str] = field(default_factory=list)


class IraqiCulturalReranker:
    """
    Advanced cultural reranker for Iraqi knowledge systems

    Reorders search results based on cultural appropriateness, Islamic compliance,
    professional accuracy, and Iraqi context for optimal user experience.
    """

    def __init__(self):
        self.logger = logging.getLogger(__name__)

        # Cultural scoring weights
        self.cultural_weights = {
            "islamic_compliance": 0.4,
            "cultural_appropriateness": 0.3,
            "arabic_quality": 0.2,
            "iraqi_dialect": 0.1,
        }

        # Professional domain requirements
        self.domain_requirements = {
            ProfessionalDomain.LEGAL: {
                "minimum_accuracy": 0.95,
                "require_citations": True,
                "require_official_sources": True,
                "islamic_law_compliance": True,
            },
            ProfessionalDomain.MEDICAL: {
                "minimum_accuracy": 0.98,
                "require_citations": True,
                "require_official_sources": True,
                "islamic_bioethics": True,
            },
            ProfessionalDomain.EDUCATION: {
                "minimum_accuracy": 0.90,
                "require_citations": False,
                "cultural_appropriateness": True,
                "age_appropriate": True,
            },
            ProfessionalDomain.GOVERNMENT: {
                "minimum_accuracy": 0.95,
                "require_official_sources": True,
                "require_citations": True,
                "current_policy": True,
            },
            ProfessionalDomain.RELIGIOUS: {
                "minimum_accuracy": 0.98,
                "islamic_compliance": True,
                "require_religious_authority": True,
                "sectarian_neutral": True,
            },
        }

        # Source authority scores
        self.authority_scores = {
            "government_official": 1.0,
            "religious_authority": 0.95,
            "academic_institution": 0.9,
            "professional_organization": 0.85,
            "verified_expert": 0.8,
            "community_leader": 0.7,
            "citizen": 0.6,
            "unknown": 0.5,
        }

        # Performance metrics
        self.metrics = {
            "total_reranking_operations": 0,
            "average_reranking_time": 0.0,
            "cultural_improvement_rate": 0.0,
            "professional_accuracy_improvement": 0.0,
            "user_satisfaction_improvement": 0.0,
        }

    async def rerank(
        self, results: List[Dict[str, Any]], context: RerankingContext
    ) -> Tuple[List[RerankingResult], RerankingAnalytics]:
        """
        Rerank search results with Iraqi cultural intelligence

        Args:
            results: Original search results to rerank
            context: Reranking context with Iraqi requirements

        Returns:
            Tuple of (reranked_results, analytics)
        """
        start_time = time.time()

        try:
            self.logger.info(
                f"Starting Iraqi cultural reranking with {len(results)} results"
            )
            self.metrics["total_reranking_operations"] += 1

            # Step 1: Extract features for each result
            feature_extraction_results = await self._extract_reranking_features(
                results, context
            )

            # Step 2: Calculate reranking scores based on strategy
            scored_results = await self._calculate_reranking_scores(
                feature_extraction_results, context
            )

            # Step 3: Apply cultural and professional validation
            validated_results = await self._apply_validation_filters(
                scored_results, context
            )

            # Step 4: Final ranking and explanation generation
            final_results = await self._generate_final_ranking(
                validated_results, context
            )

            # Step 5: Generate analytics and performance metrics
            analytics = await self._generate_reranking_analytics(
                results, final_results, context, start_time
            )

            self._update_performance_metrics(analytics)

            return final_results, analytics

        except Exception as e:
            self.logger.error(f"Iraqi cultural reranking failed: {str(e)}")

            # Return original order with error analytics
            fallback_results = [
                RerankingResult(
                    id=result.get("id", f"item_{i}"),
                    content=result.get("content", ""),
                    title=result.get("title"),
                    original_rank=i + 1,
                    reranked_score=1.0 - (i * 0.1),
                    new_rank=i + 1,
                    rank_change=0,
                    reranking_explanation="Fallback ranking due to processing error",
                    confidence_score=0.3,
                )
                for i, result in enumerate(results)
            ]

            error_analytics = RerankingAnalytics(
                total_items_reranked=len(results),
                reranking_time_ms=(time.time() - start_time) * 1000,
                average_rank_change=0.0,
                significant_rank_changes=0,
                cultural_compliance_improvement=0.0,
                professional_accuracy_improvement=0.0,
                strategy_used=context.strategy,
                cultural_weight_impact=0.0,
                professional_weight_impact=0.0,
                source_authority_impact=0.0,
                overall_quality_improvement=0.0,
                user_satisfaction_prediction=0.3,
                warnings=[f"Reranking failed: {str(e)}"],
            )

            return fallback_results, error_analytics

    async def _extract_reranking_features(
        self, results: List[Dict[str, Any]], context: RerankingContext
    ) -> List[Dict[str, Any]]:
        """Extract comprehensive features for reranking"""

        featured_results = []

        for i, result in enumerate(results):
            # Extract basic features
            features = RerankingFeatures(
                original_score=result.get("similarity", result.get("score", 0.5)),
                vector_similarity=result.get(
                    "vector_score", result.get("similarity", 0.5)
                ),
                keyword_match_score=result.get("keyword_score", 0.0),
            )

            # Extract cultural features
            features.islamic_compliance_score = (
                await self._calculate_islamic_compliance(result)
            )
            features.cultural_appropriateness_score = (
                await self._calculate_cultural_appropriateness(result)
            )
            features.arabic_quality_score = await self._calculate_arabic_quality(result)
            features.iraqi_dialect_score = await self._calculate_iraqi_dialect_score(
                result
            )

            # Extract professional features
            if context.professional_domain:
                features.professional_accuracy_score = (
                    await self._calculate_professional_accuracy(
                        result, context.professional_domain
                    )
                )
                features.domain_expertise_score = (
                    await self._calculate_domain_expertise(
                        result, context.professional_domain
                    )
                )
                features.citation_quality_score = (
                    await self._calculate_citation_quality(result)
                )
            else:
                features.professional_accuracy_score = (
                    0.8  # Default for general content
                )
                features.domain_expertise_score = 0.7
                features.citation_quality_score = 0.6

            # Extract source features
            features.source_authority_score = await self._calculate_source_authority(
                result
            )
            features.publication_date_score = await self._calculate_temporal_relevance(
                result
            )
            features.update_frequency_score = (
                await self._calculate_update_frequency_score(result)
            )

            # Extract content features
            features.content_completeness_score = (
                await self._calculate_content_completeness(result)
            )
            features.readability_score = await self._calculate_readability(result)
            features.factual_accuracy_score = await self._estimate_factual_accuracy(
                result
            )

            # Extract Iraqi context features
            if context.governorate_preference:
                features.governorate_relevance_score = (
                    await self._calculate_governorate_relevance(
                        result, context.governorate_preference
                    )
                )

            if context.institution_preference:
                features.institution_relevance_score = (
                    await self._calculate_institution_relevance(
                        result, context.institution_preference
                    )
                )

            features.local_context_score = await self._calculate_local_context_score(
                result
            )

            # Create enhanced result with features
            enhanced_result = result.copy()
            enhanced_result["features"] = features
            enhanced_result["original_rank"] = i + 1

            featured_results.append(enhanced_result)

        return featured_results

    async def _calculate_islamic_compliance(self, result: Dict[str, Any]) -> float:
        """Calculate Islamic compliance score"""

        content = result.get("content", "").lower()

        # Prohibited content indicators
        prohibited_terms = [
            "gambling",
            "alcohol",
            "usury",
            "interest",
            "riba",
            "قمار",
            "خمر",
            "ربا",
            "فوائد",
        ]

        prohibited_count = sum(1 for term in prohibited_terms if term in content)

        # Positive Islamic values
        positive_terms = [
            "family",
            "community",
            "charity",
            "justice",
            "compassion",
            "عائلة",
            "مجتمع",
            "زكاة",
            "عدالة",
            "رحمة",
            "إحسان",
        ]

        positive_count = sum(1 for term in positive_terms if term in content)

        # Calculate compliance score
        base_score = 1.0
        base_score -= prohibited_count * 0.3  # Heavy penalty for prohibited content
        base_score += positive_count * 0.1  # Bonus for positive values

        return max(0.0, min(1.0, base_score))

    async def _calculate_cultural_appropriateness(
        self, result: Dict[str, Any]
    ) -> float:
        """Calculate cultural appropriateness score for Iraqi context"""

        content = result.get("content", "").lower()

        # Iraqi cultural values
        cultural_values = [
            "hospitality",
            "respect",
            "tradition",
            "heritage",
            "honor",
            "ضيافة",
            "احترام",
            "تقليد",
            "تراث",
            "شرف",
            "كرامة",
        ]

        cultural_count = sum(1 for value in cultural_values if value in content)

        # Sensitivity factors
        sensitive_topics = [
            "sectarian",
            "political conflict",
            "tribal disputes",
            "طائفي",
            "صراع سياسي",
            "نزاع قبلي",
        ]

        sensitive_count = sum(1 for topic in sensitive_topics if topic in content)

        # Calculate appropriateness score
        base_score = 0.7  # Default neutral score
        base_score += cultural_count * 0.1  # Bonus for cultural values
        base_score -= sensitive_count * 0.2  # Penalty for sensitive content

        return max(0.0, min(1.0, base_score))

    async def _calculate_arabic_quality(self, result: Dict[str, Any]) -> float:
        """Calculate Arabic language quality score"""

        content = result.get("content", "")

        # Count Arabic characters
        import re

        arabic_chars = len(re.findall(r"[\u0600-\u06FF]", content))
        total_chars = len(content)

        if total_chars == 0:
            return 0.5

        arabic_ratio = arabic_chars / total_chars

        # Quality indicators
        quality_score = 0.5  # Base score

        # Proper Arabic script usage
        if arabic_ratio > 0.8:
            quality_score += 0.3
        elif arabic_ratio > 0.5:
            quality_score += 0.2

        # Check for common Arabic linguistic patterns
        arabic_patterns = ["ال", "في", "من", "إلى", "على"]
        pattern_count = sum(1 for pattern in arabic_patterns if pattern in content)
        quality_score += min(0.2, pattern_count * 0.05)

        return min(1.0, quality_score)

    async def _calculate_iraqi_dialect_score(self, result: Dict[str, Any]) -> float:
        """Calculate Iraqi dialect recognition score"""

        content = result.get("content", "")

        # Iraqi dialect indicators
        iraqi_terms = [
            "شلونك",
            "اكو",
            "ماكو",
            "هسه",
            "زين",
            "مال",
            "وين",
            "منين",
            "شنو",
            "ليش",
            "ماني",
            "مو",
            "هاي",
            "هاك",
        ]

        iraqi_count = sum(1 for term in iraqi_terms if term in content)

        # Calculate dialect score
        if iraqi_count > 3:
            return 1.0  # Strong Iraqi dialect presence
        elif iraqi_count > 1:
            return 0.8  # Moderate Iraqi dialect
        elif iraqi_count > 0:
            return 0.6  # Some Iraqi dialect
        else:
            return 0.4  # Standard Arabic or no dialect detected

    async def _calculate_professional_accuracy(
        self, result: Dict[str, Any], domain: ProfessionalDomain
    ) -> float:
        """Calculate professional accuracy for specific domain"""

        content = result.get("content", "").lower()

        # Domain-specific terminology
        domain_terms = {
            ProfessionalDomain.LEGAL: [
                "قانون",
                "محكمة",
                "قاضي",
                "عدالة",
                "حكم",
                "دعوى",
                "تشريع",
            ],
            ProfessionalDomain.MEDICAL: [
                "طب",
                "طبيب",
                "مريض",
                "علاج",
                "تشخيص",
                "عملية",
                "فحص",
            ],
            ProfessionalDomain.EDUCATION: [
                "تعليم",
                "معلم",
                "طالب",
                "مدرسة",
                "منهج",
                "امتحان",
                "شهادة",
            ],
            ProfessionalDomain.GOVERNMENT: [
                "حكومة",
                "وزارة",
                "خدمة",
                "إدارة",
                "مؤسسة",
                "رسمي",
            ],
        }

        terms = domain_terms.get(domain, [])
        term_count = sum(1 for term in terms if term in content)

        # Calculate accuracy based on terminology density
        base_accuracy = 0.6
        terminology_boost = min(0.4, term_count * 0.1)

        # Boost for authoritative sources
        source_authority = result.get("source_authority", "")
        if source_authority == "official":
            base_accuracy += 0.2
        elif source_authority == "academic":
            base_accuracy += 0.1

        return min(1.0, base_accuracy + terminology_boost)

    async def _calculate_domain_expertise(
        self, result: Dict[str, Any], domain: ProfessionalDomain
    ) -> float:
        """Calculate domain expertise level"""

        # Check for expertise indicators
        content = result.get("content", "").lower()

        expertise_indicators = [
            "expert",
            "specialist",
            "professional",
            "certified",
            "licensed",
            "خبير",
            "متخصص",
            "محترف",
            "معتمد",
            "مرخص",
        ]

        expertise_count = sum(
            1 for indicator in expertise_indicators if indicator in content
        )

        # Check metadata for author credentials
        metadata = result.get("metadata", {})
        author_credentials = metadata.get("author_credentials", "")

        expertise_score = 0.5  # Base score
        expertise_score += expertise_count * 0.1

        if "dr." in author_credentials.lower() or "دكتور" in author_credentials:
            expertise_score += 0.3
        elif "prof." in author_credentials.lower() or "أستاذ" in author_credentials:
            expertise_score += 0.4

        return min(1.0, expertise_score)

    async def _calculate_citation_quality(self, result: Dict[str, Any]) -> float:
        """Calculate citation and reference quality"""

        content = result.get("content", "")

        # Look for citation patterns
        citation_patterns = [
            r"\[\d+\]",
            r"\(\d{4}\)",
            r"et al\.",
            r"pp\. \d+",
            r"المرجع",
            r"المصدر",
            r"انظر",
        ]

        import re

        citation_count = 0
        for pattern in citation_patterns:
            citation_count += len(re.findall(pattern, content))

        # Check for reference sections
        reference_indicators = [
            "references",
            "bibliography",
            "sources",
            "مراجع",
            "مصادر",
        ]
        has_references = any(
            indicator in content.lower() for indicator in reference_indicators
        )

        citation_score = 0.4  # Base score
        citation_score += min(0.4, citation_count * 0.05)
        if has_references:
            citation_score += 0.2

        return min(1.0, citation_score)

    async def _calculate_source_authority(self, result: Dict[str, Any]) -> float:
        """Calculate source authority score"""

        source_type = result.get(
            "source_authority", result.get("source_type", "unknown")
        )
        return self.authority_scores.get(source_type, 0.5)

    async def _calculate_temporal_relevance(self, result: Dict[str, Any]) -> float:
        """Calculate temporal relevance based on publication date"""

        pub_date = result.get("publication_date")
        if not pub_date:
            return 0.6  # Default for unknown dates

        try:
            if isinstance(pub_date, str):
                pub_date = datetime.fromisoformat(pub_date.replace("Z", "+00:00"))

            # Calculate age in years
            age_years = (datetime.now() - pub_date).days / 365.25

            # Temporal decay function
            if age_years <= 1:
                return 1.0
            elif age_years <= 3:
                return 0.9
            elif age_years <= 5:
                return 0.7
            elif age_years <= 10:
                return 0.5
            else:
                return 0.3

        except Exception:
            return 0.6  # Default for parsing errors

    async def _calculate_update_frequency_score(self, result: Dict[str, Any]) -> float:
        """Calculate update frequency score"""

        last_updated = result.get("last_updated")
        if not last_updated:
            return 0.5

        try:
            if isinstance(last_updated, str):
                last_updated = datetime.fromisoformat(
                    last_updated.replace("Z", "+00:00")
                )

            days_since_update = (datetime.now() - last_updated).days

            if days_since_update <= 30:
                return 1.0
            elif days_since_update <= 90:
                return 0.8
            elif days_since_update <= 180:
                return 0.6
            else:
                return 0.4

        except Exception:
            return 0.5

    async def _calculate_content_completeness(self, result: Dict[str, Any]) -> float:
        """Calculate content completeness score"""

        content = result.get("content", "")

        # Basic completeness indicators
        word_count = len(content.split())

        if word_count < 50:
            return 0.3  # Too short
        elif word_count < 200:
            return 0.6  # Moderate length
        elif word_count < 1000:
            return 0.9  # Good length
        else:
            return 1.0  # Comprehensive

    async def _calculate_readability(self, result: Dict[str, Any]) -> float:
        """Calculate readability score"""

        content = result.get("content", "")

        # Simple readability metrics
        sentences = content.split(".")
        words = content.split()

        if len(sentences) == 0 or len(words) == 0:
            return 0.5

        avg_words_per_sentence = len(words) / len(sentences)

        # Optimal range for Arabic text
        if 8 <= avg_words_per_sentence <= 20:
            return 1.0
        elif 5 <= avg_words_per_sentence <= 25:
            return 0.8
        else:
            return 0.6

    async def _estimate_factual_accuracy(self, result: Dict[str, Any]) -> float:
        """Estimate factual accuracy based on available indicators"""

        # Use source authority as primary indicator
        source_score = await self._calculate_source_authority(result)

        # Check for factual uncertainty indicators
        content = result.get("content", "").lower()
        uncertainty_terms = [
            "allegedly",
            "reportedly",
            "rumored",
            "يقال",
            "ربما",
            "قيل",
        ]
        uncertainty_count = sum(1 for term in uncertainty_terms if term in content)

        # Calculate accuracy estimate
        accuracy = source_score
        accuracy -= uncertainty_count * 0.1  # Reduce for uncertainty

        return max(0.3, min(1.0, accuracy))

    async def _calculate_governorate_relevance(
        self, result: Dict[str, Any], preferred_governorate: str
    ) -> float:
        """Calculate relevance to specific Iraqi governorate"""

        content = result.get("content", "").lower()
        governorate = result.get("governorate", "").lower()

        # Direct match
        if governorate == preferred_governorate.lower():
            return 1.0

        # Content mention
        if preferred_governorate.lower() in content:
            return 0.8

        # Related cities/areas (simplified)
        governorate_cities = {
            "baghdad": ["baghdad", "kadhimiya", "sadr city", "بغداد", "الكاظمية"],
            "basra": ["basra", "fao", "البصرة", "الفاو"],
            "erbil": ["erbil", "hawler", "أربيل", "هولير"],
            "najaf": ["najaf", "kufa", "النجف", "الكوفة"],
        }

        cities = governorate_cities.get(preferred_governorate.lower(), [])
        city_mentions = sum(1 for city in cities if city in content)

        if city_mentions > 0:
            return 0.6

        return 0.2  # Default low relevance

    async def _calculate_institution_relevance(
        self, result: Dict[str, Any], preferred_institution: str
    ) -> float:
        """Calculate relevance to specific Iraqi institution"""

        content = result.get("content", "").lower()
        institution = result.get("institution", "").lower()

        # Direct match
        if institution == preferred_institution.lower():
            return 1.0

        # Content mention
        if preferred_institution.lower() in content:
            return 0.8

        return 0.2  # Default low relevance

    async def _calculate_local_context_score(self, result: Dict[str, Any]) -> float:
        """Calculate local Iraqi context relevance"""

        content = result.get("content", "").lower()

        # Iraqi context indicators
        local_terms = [
            "iraq",
            "iraqi",
            "mesopotamia",
            "tigris",
            "euphrates",
            "عراق",
            "عراقي",
            "الرافدين",
            "دجلة",
            "الفرات",
        ]

        local_count = sum(1 for term in local_terms if term in content)

        return min(1.0, 0.3 + (local_count * 0.2))

    async def _calculate_reranking_scores(
        self, featured_results: List[Dict[str, Any]], context: RerankingContext
    ) -> List[Dict[str, Any]]:
        """Calculate reranking scores based on strategy"""

        scored_results = []

        for result in featured_results:
            features = result["features"]

            if context.strategy == RerankingStrategy.CULTURAL_FIRST:
                score = await self._calculate_cultural_first_score(features, context)
            elif context.strategy == RerankingStrategy.PROFESSIONAL_ACCURACY:
                score = await self._calculate_professional_first_score(
                    features, context
                )
            elif context.strategy == RerankingStrategy.ISLAMIC_COMPLIANCE:
                score = await self._calculate_islamic_first_score(features, context)
            elif context.strategy == RerankingStrategy.SOURCE_AUTHORITY:
                score = await self._calculate_authority_first_score(features, context)
            elif context.strategy == RerankingStrategy.TEMPORAL_RELEVANCE:
                score = await self._calculate_temporal_first_score(features, context)
            else:  # BALANCED_SCORING
                score = await self._calculate_balanced_score(features, context)

            result["reranking_score"] = score
            scored_results.append(result)

        return scored_results

    async def _calculate_balanced_score(
        self, features: RerankingFeatures, context: RerankingContext
    ) -> float:
        """Calculate balanced reranking score"""

        # Weighted combination of all factors
        score = (
            features.original_score * context.relevance_weight
            +
            # Cultural factors
            (
                features.islamic_compliance_score * 0.4
                + features.cultural_appropriateness_score * 0.3
                + features.arabic_quality_score * 0.2
                + features.iraqi_dialect_score * 0.1
            )
            * context.cultural_weight_value
            +
            # Professional factors
            (
                features.professional_accuracy_score * 0.5
                + features.domain_expertise_score * 0.3
                + features.citation_quality_score * 0.2
            )
            * context.professional_weight
            +
            # Source authority
            features.source_authority_score * context.source_authority_weight
        )

        # Apply Iraqi context boost
        if context.governorate_preference:
            score += features.governorate_relevance_score * 0.1

        if context.institution_preference:
            score += features.institution_relevance_score * 0.1

        score += features.local_context_score * 0.05

        return min(1.0, score)

    async def _calculate_cultural_first_score(
        self, features: RerankingFeatures, context: RerankingContext
    ) -> float:
        """Calculate cultural-first reranking score"""

        cultural_score = (
            features.islamic_compliance_score * 0.4
            + features.cultural_appropriateness_score * 0.3
            + features.arabic_quality_score * 0.2
            + features.iraqi_dialect_score * 0.1
        )

        score = (
            cultural_score * 0.6
            + features.original_score * 0.3
            + features.source_authority_score * 0.1
        )

        return min(1.0, score)

    async def _calculate_professional_first_score(
        self, features: RerankingFeatures, context: RerankingContext
    ) -> float:
        """Calculate professional-first reranking score"""

        professional_score = (
            features.professional_accuracy_score * 0.5
            + features.domain_expertise_score * 0.3
            + features.citation_quality_score * 0.2
        )

        score = (
            professional_score * 0.5
            + features.original_score * 0.3
            + features.islamic_compliance_score * 0.2
        )

        return min(1.0, score)

    async def _calculate_islamic_first_score(
        self, features: RerankingFeatures, context: RerankingContext
    ) -> float:
        """Calculate Islamic compliance-first reranking score"""

        score = (
            features.islamic_compliance_score * 0.6
            + features.cultural_appropriateness_score * 0.2
            + features.original_score * 0.2
        )

        return min(1.0, score)

    async def _calculate_authority_first_score(
        self, features: RerankingFeatures, context: RerankingContext
    ) -> float:
        """Calculate source authority-first reranking score"""

        score = (
            features.source_authority_score * 0.5
            + features.original_score * 0.3
            + features.islamic_compliance_score * 0.2
        )

        return min(1.0, score)

    async def _calculate_temporal_first_score(
        self, features: RerankingFeatures, context: RerankingContext
    ) -> float:
        """Calculate temporal relevance-first reranking score"""

        score = (
            features.publication_date_score * 0.4
            + features.update_frequency_score * 0.2
            + features.original_score * 0.3
            + features.islamic_compliance_score * 0.1
        )

        return min(1.0, score)

    async def _apply_validation_filters(
        self, scored_results: List[Dict[str, Any]], context: RerankingContext
    ) -> List[Dict[str, Any]]:
        """Apply validation filters based on requirements"""

        validated_results = []

        for result in scored_results:
            features = result["features"]

            # Islamic compliance filter
            if context.islamic_compliance_required:
                if features.islamic_compliance_score < 0.7:
                    result["reranking_score"] *= (
                        0.5  # Heavy penalty instead of filtering
                    )

            # Professional accuracy filter
            if context.professional_domain:
                domain_req = self.domain_requirements.get(
                    context.professional_domain, {}
                )
                min_accuracy = domain_req.get(
                    "minimum_accuracy", context.minimum_professional_accuracy
                )

                if features.professional_accuracy_score < min_accuracy:
                    result["reranking_score"] *= 0.7  # Penalty for low accuracy

            # Source authority filter
            if context.require_official_sources:
                if features.source_authority_score < 0.8:
                    result["reranking_score"] *= 0.6

            validated_results.append(result)

        return validated_results

    async def _generate_final_ranking(
        self, validated_results: List[Dict[str, Any]], context: RerankingContext
    ) -> List[RerankingResult]:
        """Generate final ranking with explanations"""

        # Sort by reranking score
        sorted_results = sorted(
            validated_results, key=lambda x: x["reranking_score"], reverse=True
        )

        final_results = []

        for new_rank, result in enumerate(sorted_results, 1):
            features = result["features"]
            original_rank = result["original_rank"]
            rank_change = original_rank - new_rank

            # Generate explanation
            explanation = self._generate_ranking_explanation(
                result, context, rank_change
            )

            # Calculate confidence
            confidence = self._calculate_ranking_confidence(result, context)

            # Generate quality indicators and suggestions
            quality_indicators, suggestions = self._generate_quality_feedback(
                result, context
            )

            reranking_result = RerankingResult(
                id=result.get("id", f"item_{original_rank}"),
                content=result.get("content", ""),
                title=result.get("title"),
                original_rank=original_rank,
                reranked_score=result["reranking_score"],
                new_rank=new_rank,
                rank_change=rank_change,
                features=features,
                cultural_compliance_passed=features.islamic_compliance_score >= 0.7,
                islamic_compliance_passed=features.islamic_compliance_score >= 0.8,
                cultural_appropriateness_level=self._get_appropriateness_level(
                    features.cultural_appropriateness_score
                ),
                professional_accuracy_passed=features.professional_accuracy_score
                >= context.minimum_professional_accuracy,
                domain_expertise_validated=features.domain_expertise_score >= 0.7,
                citation_requirements_met=features.citation_quality_score >= 0.6,
                reranking_explanation=explanation,
                confidence_score=confidence,
                source_id=result.get("source_id", ""),
                source_type=result.get("source_type", ""),
                governorate=result.get("governorate"),
                institution=result.get("institution"),
                quality_indicators=quality_indicators,
                improvement_suggestions=suggestions,
            )

            final_results.append(reranking_result)

        return final_results

    def _generate_ranking_explanation(
        self, result: Dict[str, Any], context: RerankingContext, rank_change: int
    ) -> str:
        """Generate explanation for ranking decision"""

        features = result["features"]

        if rank_change > 5:
            direction = "significantly promoted"
        elif rank_change > 0:
            direction = "promoted"
        elif rank_change < -5:
            direction = "significantly demoted"
        elif rank_change < 0:
            direction = "demoted"
        else:
            direction = "maintained position"

        factors = []

        if features.islamic_compliance_score >= 0.9:
            factors.append("excellent Islamic compliance")
        elif features.islamic_compliance_score >= 0.7:
            factors.append("good Islamic compliance")

        if features.professional_accuracy_score >= 0.9:
            factors.append("high professional accuracy")

        if features.source_authority_score >= 0.9:
            factors.append("authoritative source")

        if features.arabic_quality_score >= 0.8:
            factors.append("high Arabic quality")

        factor_text = ", ".join(factors) if factors else "standard content quality"

        return f"Result {direction} due to {factor_text}."

    def _calculate_ranking_confidence(
        self, result: Dict[str, Any], context: RerankingContext
    ) -> float:
        """Calculate confidence in ranking decision"""

        features = result["features"]

        # Base confidence from score distribution
        score = result["reranking_score"]
        confidence = 0.5 + (score * 0.3)

        # Boost confidence for clear quality indicators
        if features.islamic_compliance_score >= 0.9:
            confidence += 0.1

        if features.source_authority_score >= 0.9:
            confidence += 0.1

        if features.professional_accuracy_score >= 0.9:
            confidence += 0.1

        return min(1.0, confidence)

    def _get_appropriateness_level(self, score: float) -> str:
        """Get cultural appropriateness level description"""

        if score >= 0.9:
            return "excellent"
        elif score >= 0.8:
            return "very_good"
        elif score >= 0.7:
            return "good"
        elif score >= 0.6:
            return "acceptable"
        elif score >= 0.5:
            return "moderate"
        else:
            return "low"

    def _generate_quality_feedback(
        self, result: Dict[str, Any], context: RerankingContext
    ) -> Tuple[List[str], List[str]]:
        """Generate quality indicators and improvement suggestions"""

        features = result["features"]
        indicators = []
        suggestions = []

        # Quality indicators
        if features.islamic_compliance_score >= 0.9:
            indicators.append("Excellent Islamic compliance")

        if features.professional_accuracy_score >= 0.9:
            indicators.append("High professional accuracy")

        if features.source_authority_score >= 0.9:
            indicators.append("Authoritative source")

        if features.arabic_quality_score >= 0.8:
            indicators.append("High Arabic language quality")

        # Improvement suggestions
        if features.islamic_compliance_score < 0.7:
            suggestions.append("Improve Islamic compliance validation")

        if features.professional_accuracy_score < 0.8 and context.professional_domain:
            suggestions.append(
                f"Enhance {context.professional_domain.value} domain accuracy"
            )

        if features.citation_quality_score < 0.6:
            suggestions.append("Add citations and references")

        if features.arabic_quality_score < 0.7 and context.arabic_preference:
            suggestions.append("Improve Arabic language quality")

        return indicators, suggestions

    async def _generate_reranking_analytics(
        self,
        original_results: List[Dict[str, Any]],
        final_results: List[RerankingResult],
        context: RerankingContext,
        start_time: float,
    ) -> RerankingAnalytics:
        """Generate comprehensive reranking analytics"""

        reranking_time = (time.time() - start_time) * 1000

        # Calculate rank changes
        rank_changes = [abs(result.rank_change) for result in final_results]
        average_rank_change = (
            sum(rank_changes) / len(rank_changes) if rank_changes else 0
        )
        significant_changes = sum(1 for change in rank_changes if change > 5)

        # Calculate quality improvements
        original_cultural_avg = 0.5  # Assumed baseline
        new_cultural_avg = sum(
            r.features.islamic_compliance_score for r in final_results
        ) / len(final_results)
        cultural_improvement = new_cultural_avg - original_cultural_avg

        original_professional_avg = 0.6  # Assumed baseline
        new_professional_avg = sum(
            r.features.professional_accuracy_score for r in final_results
        ) / len(final_results)
        professional_improvement = new_professional_avg - original_professional_avg

        # Predict user satisfaction
        satisfaction_factors = [
            sum(r.features.islamic_compliance_score for r in final_results)
            / len(final_results)
            * 0.3,
            sum(r.features.cultural_appropriateness_score for r in final_results)
            / len(final_results)
            * 0.3,
            sum(r.features.professional_accuracy_score for r in final_results)
            / len(final_results)
            * 0.2,
            sum(r.features.source_authority_score for r in final_results)
            / len(final_results)
            * 0.2,
        ]
        user_satisfaction = sum(satisfaction_factors)

        # Generate warnings and recommendations
        warnings = []
        recommendations = []

        if cultural_improvement < 0.1:
            warnings.append("Low cultural compliance improvement achieved")
            recommendations.append("Consider adjusting cultural weight parameters")

        if professional_improvement < 0.1 and context.professional_domain:
            warnings.append("Limited professional accuracy improvement")
            recommendations.append("Review professional domain validation criteria")

        if average_rank_change < 1:
            warnings.append("Minimal reranking impact detected")
            recommendations.append("Consider different reranking strategy")

        analytics = RerankingAnalytics(
            total_items_reranked=len(final_results),
            reranking_time_ms=reranking_time,
            average_rank_change=average_rank_change,
            significant_rank_changes=significant_changes,
            cultural_compliance_improvement=cultural_improvement,
            professional_accuracy_improvement=professional_improvement,
            strategy_used=context.strategy,
            cultural_weight_impact=context.cultural_weight_value,
            professional_weight_impact=context.professional_weight,
            source_authority_impact=context.source_authority_weight,
            overall_quality_improvement=(
                cultural_improvement + professional_improvement
            )
            / 2,
            user_satisfaction_prediction=user_satisfaction,
            warnings=warnings,
            recommendations=recommendations,
        )

        return analytics

    def _update_performance_metrics(self, analytics: RerankingAnalytics):
        """Update reranker performance metrics"""

        total = self.metrics["total_reranking_operations"]
        if total > 0:
            # Update running averages
            self.metrics["average_reranking_time"] = (
                self.metrics["average_reranking_time"] * (total - 1)
                + analytics.reranking_time_ms
            ) / total

            self.metrics["cultural_improvement_rate"] = (
                self.metrics["cultural_improvement_rate"] * (total - 1)
                + analytics.cultural_compliance_improvement
            ) / total

            self.metrics["professional_accuracy_improvement"] = (
                self.metrics["professional_accuracy_improvement"] * (total - 1)
                + analytics.professional_accuracy_improvement
            ) / total

            self.metrics["user_satisfaction_improvement"] = (
                self.metrics["user_satisfaction_improvement"] * (total - 1)
                + analytics.user_satisfaction_prediction
            ) / total

    def get_performance_summary(self) -> Dict[str, Any]:
        """Get comprehensive performance summary"""

        return {
            "total_reranking_operations": self.metrics["total_reranking_operations"],
            "average_reranking_time_ms": self.metrics["average_reranking_time"],
            "cultural_improvement_rate": self.metrics["cultural_improvement_rate"],
            "professional_accuracy_improvement": self.metrics[
                "professional_accuracy_improvement"
            ],
            "user_satisfaction_improvement": self.metrics[
                "user_satisfaction_improvement"
            ],
            "reranker_effectiveness": "high"
            if self.metrics["cultural_improvement_rate"] > 0.2
            else "moderate"
            if self.metrics["cultural_improvement_rate"] > 0.1
            else "low",
        }
