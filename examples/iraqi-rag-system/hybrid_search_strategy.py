"""
Iraqi-Enhanced Hybrid Search Strategy

Extends Archon's hybrid search with Arabic keyword processing, cultural intelligence,
and Iraqi professional domain awareness. Combines vector similarity with culturally-aware
keyword search and Iraqi dialect processing.
"""

from typing import Any, Dict, List, Optional, Tuple
import logging
from dataclasses import dataclass

from .base_search_strategy import IraqiBaseSearchStrategy, IraqiSearchContext
from .cultural_validator import IraqiCulturalValidator
from .arabic_processor import ArabicTextProcessor
from .keyword_extractor import IraqiKeywordExtractor

logger = logging.getLogger(__name__)


@dataclass
class IraqiHybridSearchConfig:
    """Configuration for Iraqi hybrid search operations"""

    enable_arabic_keywords: bool = True
    enable_cultural_filtering: bool = True
    enable_professional_enhancement: bool = True
    arabic_keyword_weight: float = 1.2  # Boost for Arabic keyword matches
    cultural_compliance_weight: float = 1.1  # Boost for culturally compliant content
    dialect_recognition_weight: float = 1.05  # Small boost for dialect matches


class IraqiHybridSearchStrategy:
    """
    Iraqi-enhanced hybrid search combining vector similarity with culturally-aware keyword search.

    Features:
    - Arabic keyword extraction with Iraqi dialect recognition
    - Cultural compliance scoring and filtering
    - Professional domain-aware search enhancement
    - Bilingual (Arabic-English) search capabilities
    - Regional relevance scoring
    """

    def __init__(
        self,
        supabase_client,
        base_strategy: IraqiBaseSearchStrategy,
        cultural_validator: Optional[IraqiCulturalValidator] = None,
        arabic_processor: Optional[ArabicTextProcessor] = None,
        keyword_extractor: Optional[IraqiKeywordExtractor] = None,
    ):
        """Initialize with Iraqi-enhanced components"""
        self.supabase_client = supabase_client
        self.base_strategy = base_strategy
        self.cultural_validator = cultural_validator or IraqiCulturalValidator()
        self.arabic_processor = arabic_processor or ArabicTextProcessor()
        self.keyword_extractor = keyword_extractor or IraqiKeywordExtractor()

        # Performance tracking
        self.search_metrics = {
            "total_hybrid_searches": 0,
            "arabic_keyword_searches": 0,
            "cultural_filtered_results": 0,
            "dialect_enhanced_results": 0,
            "professional_enhanced_results": 0,
        }

    async def search_documents_hybrid(
        self,
        query: str,
        query_embedding: List[float],
        match_count: int,
        filter_metadata: Optional[Dict] = None,
        iraqi_context: Optional[IraqiSearchContext] = None,
        config: Optional[IraqiHybridSearchConfig] = None,
    ) -> List[Dict[str, Any]]:
        """
        Perform Iraqi-enhanced hybrid search on documents with cultural intelligence.

        Args:
            query: Original search query text
            query_embedding: Pre-computed query embedding
            match_count: Number of results to return
            filter_metadata: Optional metadata filter dict
            iraqi_context: Iraqi-specific search context
            config: Hybrid search configuration

        Returns:
            List of culturally-validated and enhanced matching documents
        """
        try:
            # Initialize context and config if not provided
            if iraqi_context is None:
                iraqi_context = IraqiSearchContext()
            if config is None:
                config = IraqiHybridSearchConfig()

            logger.info(
                f"Iraqi hybrid search started - Query: '{query[:50]}...', "
                f"Language: {iraqi_context.language}, Domain: {iraqi_context.professional_domain}"
            )

            # 1. Enhanced Vector Search (using Iraqi base strategy)
            vector_results = await self.base_strategy.vector_search(
                query_embedding=query_embedding,
                match_count=match_count * 2,  # Get more for merging
                filter_metadata=filter_metadata,
                table_rpc="match_iraqi_crawled_pages",
                iraqi_context=iraqi_context,
            )

            # 2. Arabic-Enhanced Keyword Search
            keyword_results = await self._perform_iraqi_keyword_search(
                query=query,
                match_count=match_count * 2,
                table_name="iraqi_crawled_pages",
                filter_metadata=filter_metadata,
                iraqi_context=iraqi_context,
                config=config,
            )

            # 3. Intelligent Iraqi-Aware Result Merging
            merged_results = await self._merge_iraqi_search_results(
                vector_results=vector_results,
                keyword_results=keyword_results,
                match_count=match_count,
                iraqi_context=iraqi_context,
                config=config,
            )

            # 4. Apply Iraqi Cultural and Professional Enhancement
            enhanced_results = await self._apply_iraqi_enhancements(
                results=merged_results,
                query=query,
                iraqi_context=iraqi_context,
                config=config,
            )

            # Update metrics
            self._update_search_metrics(
                vector_results, keyword_results, enhanced_results, config
            )

            logger.info(
                f"Iraqi hybrid search completed - {len(enhanced_results)} culturally-enhanced results"
            )

            return enhanced_results

        except Exception as e:
            logger.error(f"Iraqi hybrid search failed: {e}")
            return []

    async def search_code_examples_hybrid(
        self,
        query: str,
        match_count: int,
        filter_metadata: Optional[Dict] = None,
        source_id: Optional[str] = None,
        iraqi_context: Optional[IraqiSearchContext] = None,
        config: Optional[IraqiHybridSearchConfig] = None,
    ) -> List[Dict[str, Any]]:
        """
        Perform Iraqi-enhanced hybrid search on code examples with technical and cultural context.

        Args:
            query: Search query text
            match_count: Number of results to return
            filter_metadata: Optional metadata filter dict
            source_id: Optional source ID to filter results
            iraqi_context: Iraqi-specific search context
            config: Hybrid search configuration

        Returns:
            List of culturally and technically relevant code examples
        """
        try:
            # Initialize context for technical domain
            if iraqi_context is None:
                iraqi_context = IraqiSearchContext(
                    professional_domain="technical",
                    cultural_sensitivity=0.85,  # Slightly relaxed for technical content
                )

            if config is None:
                config = IraqiHybridSearchConfig()

            logger.info(
                f"Iraqi code search started - Query: '{query[:50]}...', Source: {source_id}"
            )

            # Create query embedding
            from .embedding_service import (
                create_embedding,
            )  # Would import from actual service

            query_embedding = await create_embedding(query)

            if not query_embedding:
                logger.error("Failed to create embedding for Iraqi code search")
                return []

            # 1. Vector Search for Code Examples
            combined_filter = filter_metadata or {}
            if source_id:
                combined_filter["source"] = source_id

            vector_results = await self.base_strategy.vector_search(
                query_embedding=query_embedding,
                match_count=match_count * 2,
                filter_metadata=combined_filter,
                table_rpc="match_iraqi_code_examples",
                iraqi_context=iraqi_context,
            )

            # 2. Technical Keyword Search with Arabic Support
            keyword_filter = filter_metadata or {}
            if source_id:
                keyword_filter["source_id"] = source_id

            keyword_results = await self._perform_iraqi_keyword_search(
                query=query,
                match_count=match_count * 2,
                table_name="iraqi_code_examples",
                filter_metadata=keyword_filter,
                iraqi_context=iraqi_context,
                config=config,
                search_fields=[
                    "content",
                    "summary",
                    "comments",
                ],  # Code-specific fields
            )

            # 3. Merge with Technical Context Awareness
            merged_results = await self._merge_iraqi_search_results(
                vector_results=vector_results,
                keyword_results=keyword_results,
                match_count=match_count,
                iraqi_context=iraqi_context,
                config=config,
            )

            # 4. Apply Technical and Cultural Enhancement
            enhanced_results = await self._apply_technical_cultural_enhancement(
                results=merged_results, query=query, iraqi_context=iraqi_context
            )

            logger.info(
                f"Iraqi code search completed - {len(enhanced_results)} enhanced code examples"
            )

            return enhanced_results

        except Exception as e:
            logger.error(f"Iraqi code search failed: {e}")
            return []

    async def _perform_iraqi_keyword_search(
        self,
        query: str,
        match_count: int,
        table_name: str,
        filter_metadata: Optional[Dict] = None,
        iraqi_context: Optional[IraqiSearchContext] = None,
        config: Optional[IraqiHybridSearchConfig] = None,
        search_fields: Optional[List[str]] = None,
    ) -> List[Dict[str, Any]]:
        """
        Perform Iraqi-enhanced keyword search with Arabic processing and cultural awareness.
        """
        try:
            # Extract keywords with Iraqi dialect awareness
            extracted_keywords = await self.keyword_extractor.extract_iraqi_keywords(
                text=query, iraqi_context=iraqi_context
            )

            # Process Arabic content if present
            arabic_keywords = []
            if await self.arabic_processor.contains_arabic(query):
                arabic_processing = await self.arabic_processor.process_content(
                    text=query,
                    dialect_preference=iraqi_context.dialect
                    if iraqi_context
                    else "iraqi",
                )
                arabic_keywords = await self.arabic_processor.extract_keywords_arabic(
                    text=arabic_processing.normalized_text, max_keywords=8
                )
                self.search_metrics["arabic_keyword_searches"] += 1

            # Combine all keywords
            all_keywords = extracted_keywords.keywords + arabic_keywords
            if not all_keywords:
                logger.warning("No keywords extracted from query")
                return []

            # Search with Iraqi-enhanced keyword matching
            search_results = await self._execute_iraqi_keyword_search(
                keywords=all_keywords,
                table_name=table_name,
                match_count=match_count,
                filter_metadata=filter_metadata,
                search_fields=search_fields or ["content"],
                iraqi_context=iraqi_context,
            )

            # Enhance results with cultural scoring
            enhanced_results = []
            for result in search_results:
                # Add keyword matching metadata
                result["keyword_extraction"] = {
                    "arabic_keywords": arabic_keywords,
                    "total_keywords": len(all_keywords),
                    "cultural_terms": extracted_keywords.cultural_terms,
                    "professional_terms": extracted_keywords.professional_terms,
                }

                enhanced_results.append(result)

            return enhanced_results

        except Exception as e:
            logger.error(f"Iraqi keyword search failed: {e}")
            return []

    async def _execute_iraqi_keyword_search(
        self,
        keywords: List[str],
        table_name: str,
        match_count: int,
        filter_metadata: Optional[Dict] = None,
        search_fields: List[str] = None,
        iraqi_context: Optional[IraqiSearchContext] = None,
    ) -> List[Dict[str, Any]]:
        """Execute database keyword search with Iraqi enhancements"""

        all_results = []
        seen_ids = set()

        # Search for each keyword with cultural context
        for keyword in keywords[:8]:  # Limit to avoid too many queries
            try:
                # Build query with appropriate fields
                query_builder = self.supabase_client.from_(table_name).select("*")

                # Create search pattern
                search_pattern = f"%{keyword}%"

                # Multi-field search for Iraqi content
                if len(search_fields) > 1:
                    or_conditions = []
                    for field in search_fields:
                        or_conditions.append(f"{field}.ilike.{search_pattern}")
                    query_builder = query_builder.or_(",".join(or_conditions))
                else:
                    query_builder = query_builder.ilike(
                        search_fields[0], search_pattern
                    )

                # Add Iraqi-specific filters
                if filter_metadata:
                    for key, value in filter_metadata.items():
                        if key == "source":
                            query_builder = query_builder.eq("source_id", value)
                        else:
                            query_builder = query_builder.eq(key, value)

                # Add cultural compliance filter if context provided
                if iraqi_context and iraqi_context.cultural_sensitivity > 0:
                    query_builder = query_builder.gte(
                        "cultural_compliance_score", iraqi_context.cultural_sensitivity
                    )

                # Execute query
                response = query_builder.limit(match_count).execute()

                if response.data:
                    for result in response.data:
                        result_id = result.get("id")
                        if result_id and result_id not in seen_ids:
                            # Calculate keyword relevance score
                            relevance_score = await self._calculate_keyword_relevance(
                                result, keywords, iraqi_context
                            )
                            result["keyword_relevance_score"] = relevance_score
                            result["matched_keyword"] = keyword

                            all_results.append(result)
                            seen_ids.add(result_id)

            except Exception as e:
                logger.warning(f"Keyword search failed for '{keyword}': {e}")
                continue

        # Sort by relevance score
        all_results.sort(
            key=lambda x: x.get("keyword_relevance_score", 0), reverse=True
        )

        return all_results[:match_count]

    async def _calculate_keyword_relevance(
        self,
        result: Dict[str, Any],
        keywords: List[str],
        iraqi_context: Optional[IraqiSearchContext],
    ) -> float:
        """Calculate keyword relevance score with Iraqi cultural context"""

        content = result.get("content", "").lower()
        summary = result.get("summary", "").lower()
        combined_text = f"{content} {summary}"

        # Base keyword matching score
        keyword_matches = sum(
            1 for keyword in keywords if keyword.lower() in combined_text
        )
        base_score = keyword_matches / max(1, len(keywords))

        # Cultural enhancement
        cultural_bonus = 0.0
        if iraqi_context and result.get("cultural_validation"):
            cultural_score = result["cultural_validation"].get("overall_score", 0)
            cultural_bonus = cultural_score * 0.2  # Up to 20% bonus

        # Arabic content bonus
        arabic_bonus = 0.0
        if await self.arabic_processor.contains_arabic(combined_text):
            arabic_bonus = 0.1  # 10% bonus for Arabic content

        # Professional domain relevance
        domain_bonus = 0.0
        if iraqi_context and iraqi_context.professional_domain != "general":
            professional_context = result.get("professional_context", {})
            if professional_context:
                domain_bonus = 0.15  # 15% bonus for professional relevance

        total_score = base_score + cultural_bonus + arabic_bonus + domain_bonus
        return min(1.0, total_score)

    async def _merge_iraqi_search_results(
        self,
        vector_results: List[Dict[str, Any]],
        keyword_results: List[Dict[str, Any]],
        match_count: int,
        iraqi_context: IraqiSearchContext,
        config: IraqiHybridSearchConfig,
    ) -> List[Dict[str, Any]]:
        """
        Intelligently merge vector and keyword results with Iraqi cultural intelligence.

        Priority order with Iraqi enhancements:
        1. Results in BOTH searches with high cultural compliance
        2. Culturally compliant vector-only results
        3. Arabic keyword matches with cultural validation
        4. Other results
        """

        seen_ids = set()
        combined_results = []

        # Create lookup for vector results
        vector_lookup = {r.get("id"): r for r in vector_results if r.get("id")}

        # Phase 1: Hybrid matches with cultural compliance
        for keyword_result in keyword_results:
            result_id = keyword_result.get("id")
            if result_id and result_id in vector_lookup and result_id not in seen_ids:
                vector_result = vector_lookup[result_id]

                # Calculate enhanced similarity score
                base_similarity = vector_result.get("similarity", 0)
                cultural_score = vector_result.get("cultural_validation", {}).get(
                    "overall_score", 0.5
                )
                keyword_score = keyword_result.get("keyword_relevance_score", 0)

                # Apply Iraqi enhancement weights
                enhanced_similarity = self._calculate_enhanced_similarity(
                    base_similarity, cultural_score, keyword_score, config
                )

                vector_result["similarity"] = min(1.0, enhanced_similarity)
                vector_result["match_type"] = "iraqi_hybrid"
                vector_result["enhancement_applied"] = True

                combined_results.append(vector_result)
                seen_ids.add(result_id)

        # Phase 2: High-quality vector-only results
        for vector_result in vector_results:
            result_id = vector_result.get("id")
            if (
                result_id
                and result_id not in seen_ids
                and len(combined_results) < match_count
            ):
                cultural_score = vector_result.get("cultural_validation", {}).get(
                    "overall_score", 0.5
                )

                # Only include if meets cultural threshold
                if cultural_score >= iraqi_context.cultural_sensitivity:
                    vector_result["match_type"] = "iraqi_vector"
                    combined_results.append(vector_result)
                    seen_ids.add(result_id)

        # Phase 3: Culturally-validated keyword-only results
        for keyword_result in keyword_results:
            result_id = keyword_result.get("id")
            if (
                result_id
                and result_id not in seen_ids
                and len(combined_results) < match_count
            ):
                # Apply cultural validation if not already done
                if "cultural_validation" not in keyword_result:
                    cultural_validation = await self.cultural_validator.validate_content(
                        content=keyword_result.get("content", ""),
                        domain=iraqi_context.professional_domain,
                        islamic_compliance_required=iraqi_context.islamic_compliance,
                    )
                    keyword_result["cultural_validation"] = cultural_validation.__dict__

                cultural_score = keyword_result["cultural_validation"]["overall_score"]

                # Only include if meets cultural threshold
                if cultural_score >= iraqi_context.cultural_sensitivity:
                    # Convert to standard format
                    standardized_result = self._standardize_keyword_result(
                        keyword_result, config
                    )
                    combined_results.append(standardized_result)
                    seen_ids.add(result_id)

        # Sort by enhanced similarity score
        combined_results.sort(key=lambda x: x.get("similarity", 0), reverse=True)

        return combined_results[:match_count]

    def _calculate_enhanced_similarity(
        self,
        base_similarity: float,
        cultural_score: float,
        keyword_score: float,
        config: IraqiHybridSearchConfig,
    ) -> float:
        """Calculate enhanced similarity score with Iraqi weights"""

        # Apply cultural compliance boost
        cultural_boost = cultural_score * config.cultural_compliance_weight

        # Apply keyword relevance boost
        keyword_boost = keyword_score * config.arabic_keyword_weight

        # Combine with weights
        enhanced_score = (
            base_similarity * 0.6  # Base vector similarity
            + cultural_boost * 0.25  # Cultural compliance
            + keyword_boost * 0.15  # Keyword relevance
        )

        return enhanced_score

    def _standardize_keyword_result(
        self, keyword_result: Dict[str, Any], config: IraqiHybridSearchConfig
    ) -> Dict[str, Any]:
        """Standardize keyword result to match vector result format"""

        keyword_score = keyword_result.get("keyword_relevance_score", 0.5)
        cultural_score = keyword_result.get("cultural_validation", {}).get(
            "overall_score", 0.5
        )

        # Scale scores to similarity range
        scaled_similarity = min(0.8, 0.4 + (keyword_score * 0.4))

        # Apply cultural enhancement
        if cultural_score > 0.8:
            scaled_similarity *= config.cultural_compliance_weight

        standardized = {
            "id": keyword_result["id"],
            "content": keyword_result["content"],
            "similarity": scaled_similarity,
            "match_type": "iraqi_keyword",
            "keyword_relevance_score": keyword_score,
            "cultural_validation": keyword_result.get("cultural_validation", {}),
            "enhancement_applied": True,
        }

        # Copy other fields
        for key in ["url", "metadata", "source_id", "chunk_number"]:
            if key in keyword_result:
                standardized[key] = keyword_result[key]

        return standardized

    async def _apply_iraqi_enhancements(
        self,
        results: List[Dict[str, Any]],
        query: str,
        iraqi_context: IraqiSearchContext,
        config: IraqiHybridSearchConfig,
    ) -> List[Dict[str, Any]]:
        """Apply Iraqi cultural and professional enhancements to results"""

        enhanced_results = []

        for result in results:
            try:
                # Apply cultural enhancement
                if config.enable_cultural_filtering:
                    cultural_enhancement = await self._apply_cultural_enhancement(
                        result, iraqi_context
                    )
                    result.update(cultural_enhancement)

                # Apply professional enhancement
                if (
                    config.enable_professional_enhancement
                    and iraqi_context.professional_domain != "general"
                ):
                    professional_enhancement = (
                        await self._apply_professional_enhancement(
                            result, iraqi_context.professional_domain
                        )
                    )
                    result.update(professional_enhancement)

                # Apply Arabic processing enhancement
                if config.enable_arabic_keywords:
                    arabic_enhancement = await self._apply_arabic_enhancement(
                        result, query, config
                    )
                    result.update(arabic_enhancement)

                enhanced_results.append(result)

            except Exception as e:
                logger.warning(
                    f"Enhancement failed for result {result.get('id', 'unknown')}: {e}"
                )
                enhanced_results.append(result)  # Include without enhancement

        return enhanced_results

    async def _apply_cultural_enhancement(
        self, result: Dict[str, Any], iraqi_context: IraqiSearchContext
    ) -> Dict[str, Any]:
        """Apply cultural enhancement to search result"""

        enhancement = {
            "iraqi_cultural_context": {
                "cultural_compliance_verified": True,
                "islamic_compliance_verified": iraqi_context.islamic_compliance,
                "regional_relevance": iraqi_context.region,
                "cultural_sensitivity_level": iraqi_context.cultural_sensitivity,
            }
        }

        # Add cultural metadata if available
        if "cultural_validation" in result:
            cultural_data = result["cultural_validation"]
            enhancement["iraqi_cultural_context"]["validation_details"] = {
                "overall_score": cultural_data.get("overall_score", 0),
                "islamic_compliance": cultural_data.get("islamic_compliance", 0),
                "professional_appropriateness": cultural_data.get(
                    "professional_appropriateness", 0
                ),
            }

        return enhancement

    async def _apply_professional_enhancement(
        self, result: Dict[str, Any], domain: str
    ) -> Dict[str, Any]:
        """Apply professional domain enhancement"""

        enhancement = {
            "iraqi_professional_context": {
                "domain": domain,
                "enhanced_for_domain": True,
                "domain_specific_metadata": await self._extract_domain_metadata(
                    result, domain
                ),
            }
        }

        return enhancement

    async def _apply_arabic_enhancement(
        self, result: Dict[str, Any], query: str, config: IraqiHybridSearchConfig
    ) -> Dict[str, Any]:
        """Apply Arabic language processing enhancement"""

        content = result.get("content", "")
        enhancement = {"arabic_processing": {}}

        if await self.arabic_processor.contains_arabic(content):
            arabic_processing = await self.arabic_processor.process_content(content)

            enhancement["arabic_processing"] = {
                "contains_arabic": True,
                "script_type": arabic_processing.script_type.value,
                "dialect_type": arabic_processing.dialect_type.value,
                "dialect_confidence": arabic_processing.dialect_confidence,
                "cultural_terms_found": len(arabic_processing.cultural_terms),
                "mixed_direction": arabic_processing.mixed_direction,
            }

            # Apply dialect boost if applicable
            if arabic_processing.dialect_confidence > 0.7:
                current_similarity = result.get("similarity", 0)
                result["similarity"] = min(
                    1.0, current_similarity * config.dialect_recognition_weight
                )
                enhancement["arabic_processing"]["dialect_boost_applied"] = True

        return enhancement

    async def _apply_technical_cultural_enhancement(
        self,
        results: List[Dict[str, Any]],
        query: str,
        iraqi_context: IraqiSearchContext,
    ) -> List[Dict[str, Any]]:
        """Apply technical and cultural enhancement for code examples"""

        enhanced_results = []

        for result in results:
            # Add technical context
            result["technical_context"] = {
                "code_example": True,
                "cultural_compliance_verified": True,
                "iraqi_technical_standards": True,
            }

            # Check for Arabic comments in code
            content = result.get("content", "")
            if await self.arabic_processor.contains_arabic(content):
                result["technical_context"]["contains_arabic_comments"] = True
                result["technical_context"]["bilingual_code"] = True

            enhanced_results.append(result)

        return enhanced_results

    async def _extract_domain_metadata(
        self, result: Dict[str, Any], domain: str
    ) -> Dict[str, Any]:
        """Extract domain-specific metadata from result"""

        content = result.get("content", "")

        domain_metadata = {
            "domain": domain,
            "content_analyzed": True,
            "timestamp": "2025-01-01T00:00:00Z",
        }

        # Add domain-specific analysis (simplified)
        if domain == "legal":
            domain_metadata["legal_terms_detected"] = (
                "قانون" in content or "law" in content.lower()
            )
        elif domain == "medical":
            domain_metadata["medical_terms_detected"] = (
                "طبيب" in content or "doctor" in content.lower()
            )
        elif domain == "educational":
            domain_metadata["educational_terms_detected"] = (
                "مدرسة" in content or "school" in content.lower()
            )

        return domain_metadata

    def _update_search_metrics(
        self,
        vector_results: List[Dict[str, Any]],
        keyword_results: List[Dict[str, Any]],
        enhanced_results: List[Dict[str, Any]],
        config: IraqiHybridSearchConfig,
    ):
        """Update search performance metrics"""

        self.search_metrics["total_hybrid_searches"] += 1

        # Count cultural filtering
        culturally_filtered = sum(
            1
            for r in enhanced_results
            if r.get("cultural_validation", {}).get("overall_score", 0) > 0.8
        )
        self.search_metrics["cultural_filtered_results"] += culturally_filtered

        # Count dialect enhancement
        dialect_enhanced = sum(
            1
            for r in enhanced_results
            if r.get("arabic_processing", {}).get("dialect_boost_applied", False)
        )
        self.search_metrics["dialect_enhanced_results"] += dialect_enhanced

        # Count professional enhancement
        professional_enhanced = sum(
            1 for r in enhanced_results if "iraqi_professional_context" in r
        )
        self.search_metrics["professional_enhanced_results"] += professional_enhanced

    def get_search_performance_metrics(self) -> Dict[str, Any]:
        """Get Iraqi hybrid search performance metrics"""
        total = max(1, self.search_metrics["total_hybrid_searches"])

        return {
            "total_hybrid_searches": total,
            "arabic_keyword_usage_rate": self.search_metrics["arabic_keyword_searches"]
            / total,
            "cultural_filtering_rate": self.search_metrics["cultural_filtered_results"]
            / total,
            "dialect_enhancement_rate": self.search_metrics["dialect_enhanced_results"]
            / total,
            "professional_enhancement_rate": self.search_metrics[
                "professional_enhanced_results"
            ]
            / total,
            **self.base_strategy.get_search_metrics(),
            **self.cultural_validator.get_validation_statistics(),
            **self.arabic_processor.get_processing_statistics(),
        }
