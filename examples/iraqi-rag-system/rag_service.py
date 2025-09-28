"""
Iraqi-Enhanced RAG Service - Thin Coordinator

This service acts as a coordinator that delegates to Iraqi-enhanced strategy implementations.
It combines multiple Iraqi RAG strategies in a pipeline fashion:

1. Iraqi Base vector search with cultural intelligence
2. + Iraqi Hybrid search (vector + cultural keyword search)
3. + Iraqi Reranking (cultural compliance + Arabic processing)
4. + Iraqi Agentic RAG (code examples with cultural context)

Multiple strategies work together with Iraqi cultural intelligence throughout.
"""

import logging
from typing import Any, Dict, List, Optional, Tuple
from dataclasses import dataclass

from .base_search_strategy import IraqiBaseSearchStrategy, IraqiSearchContext
from .cultural_validator import IraqiCulturalValidator
from .arabic_processor import ArabicTextProcessor
from .hybrid_search_strategy import IraqiHybridSearchStrategy, IraqiHybridSearchConfig
from .reranking_strategy import IraqiRerankingStrategy, IraqiRerankingConfig
from .agentic_rag_strategy import IraqiAgenticRAGStrategy, IraqiAgenticConfig
from .keyword_extractor import IraqiKeywordExtractor

logger = logging.getLogger(__name__)


@dataclass
class IraqiRAGConfig:
    """Configuration for Iraqi RAG service"""

    enable_hybrid_search: bool = True
    enable_reranking: bool = True
    enable_agentic_rag: bool = True
    enable_cultural_validation: bool = True
    enable_arabic_processing: bool = True

    # Default Iraqi context
    default_cultural_sensitivity: float = 0.95
    default_islamic_compliance: bool = True
    default_professional_domain: str = "general"
    default_language: str = "mixed"
    default_dialect: str = "iraqi"

    # Performance settings
    cultural_validation_timeout: float = 5.0
    arabic_processing_timeout: float = 3.0
    max_results_per_strategy: int = 50


class IraqiRAGService:
    """
    Iraqi-enhanced RAG coordinator service that orchestrates multiple strategies
    with comprehensive cultural intelligence and Arabic language processing.

    Features:
    - Cultural compliance validation throughout pipeline
    - Arabic language processing with Iraqi dialect recognition
    - Professional domain-aware search and ranking
    - Islamic values compliance filtering
    - Bilingual (Arabic-English) content handling
    - Iraqi professional domain integration
    """

    def __init__(
        self,
        supabase_client=None,
        config: Optional[IraqiRAGConfig] = None,
        cultural_validator: Optional[IraqiCulturalValidator] = None,
        arabic_processor: Optional[ArabicTextProcessor] = None,
    ):
        """Initialize Iraqi RAG service as enhanced coordinator"""
        from .utils import get_supabase_client  # Would import from actual utils

        self.supabase_client = supabase_client or get_supabase_client()
        self.config = config or IraqiRAGConfig()

        # Initialize Iraqi intelligence components
        self.cultural_validator = cultural_validator or IraqiCulturalValidator()
        self.arabic_processor = arabic_processor or ArabicTextProcessor()
        self.keyword_extractor = IraqiKeywordExtractor()

        # Initialize Iraqi-enhanced strategies
        self.base_strategy = IraqiBaseSearchStrategy(
            self.supabase_client, self.cultural_validator, self.arabic_processor
        )

        self.hybrid_strategy = IraqiHybridSearchStrategy(
            self.supabase_client,
            self.base_strategy,
            self.cultural_validator,
            self.arabic_processor,
            self.keyword_extractor,
        )

        # Initialize reranking strategy if enabled
        self.reranking_strategy = None
        if self.config.enable_reranking:
            try:
                reranking_config = IraqiRerankingConfig(
                    enable_cultural_scoring=self.config.enable_cultural_validation,
                    enable_arabic_processing=self.config.enable_arabic_processing,
                )
                self.reranking_strategy = IraqiRerankingStrategy(
                    config=reranking_config,
                    cultural_validator=self.cultural_validator,
                    arabic_processor=self.arabic_processor,
                )
                logger.info("Iraqi reranking strategy loaded successfully")
            except Exception as e:
                logger.warning(f"Failed to load Iraqi reranking strategy: {e}")
                self.reranking_strategy = None

        # Initialize agentic strategy
        self.agentic_strategy = IraqiAgenticRAGStrategy(
            self.supabase_client,
            self.base_strategy,
            self.cultural_validator,
            self.arabic_processor,
        )

        # Performance tracking
        self.service_stats = {
            "total_queries": 0,
            "cultural_validations": 0,
            "arabic_processing_sessions": 0,
            "hybrid_searches": 0,
            "reranking_operations": 0,
            "agentic_searches": 0,
            "average_response_time": 0.0,
        }

    def get_setting(self, key: str, default: str = "false") -> str:
        """Get a setting from environment or configuration"""
        # Simplified implementation - would integrate with actual settings
        import os

        return os.getenv(key, default)

    def get_bool_setting(self, key: str, default: bool = False) -> bool:
        """Get a boolean setting"""
        value = self.get_setting(key, "false" if not default else "true")
        return value.lower() in ("true", "1", "yes", "on")

    async def search_documents(
        self,
        query: str,
        match_count: int = 5,
        filter_metadata: Optional[Dict] = None,
        iraqi_context: Optional[IraqiSearchContext] = None,
        use_hybrid_search: bool = None,
        cached_api_key: Optional[str] = None,  # Legacy compatibility
    ) -> List[Dict[str, Any]]:
        """
        Document search with Iraqi cultural intelligence and Arabic processing.

        Args:
            query: Search query string
            match_count: Number of results to return
            filter_metadata: Optional metadata filter dict
            iraqi_context: Iraqi-specific search context
            use_hybrid_search: Whether to use hybrid search (defaults to config)
            cached_api_key: Deprecated parameter for compatibility

        Returns:
            List of culturally-validated matching documents
        """
        try:
            import time

            start_time = time.time()

            # Initialize Iraqi context if not provided
            if iraqi_context is None:
                iraqi_context = self._create_default_iraqi_context()

            # Determine hybrid search usage
            if use_hybrid_search is None:
                use_hybrid_search = self.config.enable_hybrid_search

            logger.info(
                f"Iraqi document search - Query: '{query[:50]}...', "
                f"Domain: {iraqi_context.professional_domain}, "
                f"Cultural sensitivity: {iraqi_context.cultural_sensitivity}"
            )

            # Create enhanced query embedding
            from .embedding_service import (
                create_embedding,
            )  # Would import from actual service

            query_embedding = await create_embedding(query)

            if not query_embedding:
                logger.error("Failed to create embedding for Iraqi document search")
                return []

            # Apply Iraqi search pipeline
            if use_hybrid_search:
                # Use Iraqi hybrid strategy
                results = await self.hybrid_strategy.search_documents_hybrid(
                    query=query,
                    query_embedding=query_embedding,
                    match_count=match_count,
                    filter_metadata=filter_metadata,
                    iraqi_context=iraqi_context,
                )
                self.service_stats["hybrid_searches"] += 1
            else:
                # Use Iraqi base search
                results = await self.base_strategy.vector_search(
                    query_embedding=query_embedding,
                    match_count=match_count,
                    filter_metadata=filter_metadata,
                    iraqi_context=iraqi_context,
                )

            # Apply Iraqi reranking if enabled
            if self.reranking_strategy and results:
                try:
                    reranking_result = await self.reranking_strategy.rerank_results(
                        query=query,
                        results=results,
                        iraqi_context=iraqi_context,
                        content_key="content",
                    )
                    results = reranking_result.reranked_results
                    self.service_stats["reranking_operations"] += 1
                except Exception as e:
                    logger.warning(f"Iraqi reranking failed: {e}")

            # Update performance statistics
            processing_time = time.time() - start_time
            self._update_service_stats(processing_time)

            logger.info(
                f"Iraqi document search completed - {len(results)} results, "
                f"Time: {processing_time:.2f}s"
            )

            return results

        except Exception as e:
            logger.error(f"Iraqi document search failed: {e}")
            return []

    async def search_code_examples(
        self,
        query: str,
        match_count: int = 10,
        filter_metadata: Optional[Dict[str, Any]] = None,
        source_id: Optional[str] = None,
        iraqi_context: Optional[IraqiSearchContext] = None,
    ) -> List[Dict[str, Any]]:
        """
        Search for code examples with Iraqi cultural intelligence and technical enhancement.

        Args:
            query: Query text
            match_count: Maximum number of results to return
            filter_metadata: Optional metadata filter
            source_id: Optional source ID to filter results
            iraqi_context: Iraqi-specific search context

        Returns:
            List of culturally-validated and technically-enhanced code examples
        """
        try:
            # Initialize Iraqi context for technical domain
            if iraqi_context is None:
                iraqi_context = IraqiSearchContext(
                    professional_domain="technical",
                    cultural_sensitivity=0.85,  # Slightly relaxed for code
                )

            logger.info(
                f"Iraqi code search - Query: '{query[:50]}...', "
                f"Source: {source_id}, Domain: {iraqi_context.professional_domain}"
            )

            # Use Iraqi agentic strategy for code search
            results = await self.agentic_strategy.search_code_examples(
                query=query,
                match_count=match_count,
                filter_metadata=filter_metadata,
                source_id=source_id,
                iraqi_context=iraqi_context,
            )

            self.service_stats["agentic_searches"] += 1

            logger.info(
                f"Iraqi code search completed - {len(results)} enhanced code examples"
            )

            return results

        except Exception as e:
            logger.error(f"Iraqi code search failed: {e}")
            return []

    async def perform_rag_query(
        self,
        query: str,
        source: Optional[str] = None,
        match_count: int = 5,
        iraqi_context: Optional[IraqiSearchContext] = None,
    ) -> Tuple[bool, Dict[str, Any]]:
        """
        Perform comprehensive Iraqi RAG query combining all enabled strategies.

        Pipeline:
        1. Iraqi base/hybrid search with cultural intelligence
        2. Cultural compliance validation and Arabic processing
        3. Iraqi reranking with cultural and linguistic enhancement
        4. Professional domain contextualization

        Args:
            query: The search query
            source: Optional source domain to filter results
            match_count: Maximum number of results to return
            iraqi_context: Iraqi-specific search context

        Returns:
            Tuple of (success, enhanced_result_dict)
        """
        try:
            import time

            start_time = time.time()

            # Initialize Iraqi context
            if iraqi_context is None:
                iraqi_context = self._create_default_iraqi_context()

            logger.info(
                f"Iraqi RAG query - Query: '{query[:50]}...', "
                f"Source: {source}, Domain: {iraqi_context.professional_domain}"
            )

            # Build Iraqi-enhanced filter metadata
            filter_metadata = {"source": source} if source else None

            # Add cultural compliance filter
            if filter_metadata is None:
                filter_metadata = {}
            filter_metadata.update(
                {
                    "cultural_compliance_required": True,
                    "islamic_compliance": iraqi_context.islamic_compliance,
                    "cultural_sensitivity_min": iraqi_context.cultural_sensitivity,
                }
            )

            # Perform Iraqi-enhanced document search
            search_results = await self.search_documents(
                query=query,
                match_count=match_count,
                filter_metadata=filter_metadata,
                iraqi_context=iraqi_context,
                use_hybrid_search=self.config.enable_hybrid_search,
            )

            # Format results with Iraqi enhancements
            formatted_results = []
            for i, result in enumerate(search_results):
                try:
                    formatted_result = await self._format_iraqi_rag_result(
                        result, iraqi_context
                    )
                    formatted_results.append(formatted_result)
                except Exception as format_error:
                    logger.warning(f"Failed to format Iraqi result {i}: {format_error}")
                    continue

            # Calculate processing metrics
            processing_time = time.time() - start_time

            # Build enhanced response with Iraqi metadata
            response_data = {
                "results": formatted_results,
                "query": query,
                "source": source,
                "match_count": match_count,
                "total_found": len(formatted_results),
                "execution_path": "iraqi_rag_service_pipeline",
                "search_mode": "hybrid"
                if self.config.enable_hybrid_search
                else "vector",
                "reranking_applied": self.reranking_strategy is not None,
                "cultural_validation_applied": self.config.enable_cultural_validation,
                "arabic_processing_applied": self.config.enable_arabic_processing,
                "iraqi_context": {
                    "professional_domain": iraqi_context.professional_domain,
                    "cultural_sensitivity": iraqi_context.cultural_sensitivity,
                    "islamic_compliance": iraqi_context.islamic_compliance,
                    "language": iraqi_context.language,
                    "dialect": iraqi_context.dialect,
                    "region": iraqi_context.region,
                },
                "performance_metrics": {
                    "processing_time_seconds": processing_time,
                    "cultural_validations_performed": len(
                        [r for r in formatted_results if "cultural_validation" in r]
                    ),
                    "arabic_processing_applied": len(
                        [r for r in formatted_results if "arabic_processing" in r]
                    ),
                    "average_cultural_score": self._calculate_average_cultural_score(
                        formatted_results
                    ),
                },
            }

            # Update service statistics
            self._update_service_stats(processing_time)

            logger.info(
                f"Iraqi RAG query completed - {len(formatted_results)} results, "
                f"Time: {processing_time:.2f}s"
            )

            return True, response_data

        except Exception as e:
            logger.error(f"Iraqi RAG query failed: {e}")
            return False, {
                "error": str(e),
                "error_type": type(e).__name__,
                "query": query,
                "source": source,
                "execution_path": "iraqi_rag_service_pipeline",
                "iraqi_context_attempted": iraqi_context.__dict__
                if iraqi_context
                else None,
            }

    async def search_code_examples_service(
        self,
        query: str,
        source_id: Optional[str] = None,
        match_count: int = 5,
        iraqi_context: Optional[IraqiSearchContext] = None,
    ) -> Tuple[bool, Dict[str, Any]]:
        """
        Search for code examples using Iraqi agentic strategy with full pipeline.

        Pipeline for Iraqi code examples:
        1. Check if Iraqi agentic RAG is enabled
        2. Use Iraqi agentic strategy for enhanced code search
        3. Apply Iraqi hybrid search if enabled
        4. Apply Iraqi reranking with technical and cultural context
        5. Professional domain enhancement and cultural validation

        Args:
            query: The search query
            source_id: Optional source ID to filter results
            match_count: Maximum number of results to return
            iraqi_context: Iraqi-specific search context

        Returns:
            Tuple of (success, enhanced_result_dict)
        """
        try:
            # Initialize Iraqi context for code search
            if iraqi_context is None:
                iraqi_context = IraqiSearchContext(
                    professional_domain="technical", cultural_sensitivity=0.85
                )

            logger.info(
                f"Iraqi code service search - Query: '{query[:50]}...', "
                f"Source: {source_id}, Domain: {iraqi_context.professional_domain}"
            )

            # Check if Iraqi agentic RAG is enabled
            if not self.agentic_strategy.is_enabled():
                return False, {
                    "error": "Iraqi Agentic RAG is disabled. Enable USE_IRAQI_AGENTIC_RAG setting.",
                    "query": query,
                }

            # Use Iraqi agentic strategy for comprehensive search
            (
                success,
                agentic_result,
            ) = await self.agentic_strategy.perform_agentic_search(
                query=query,
                source_id=source_id,
                match_count=match_count,
                include_context=True,
                iraqi_context=iraqi_context,
            )

            if not success:
                return False, agentic_result

            # Apply additional Iraqi reranking if enabled and different from agentic
            results = agentic_result.get("results", [])
            if self.reranking_strategy and results:
                try:
                    reranking_result = await self.reranking_strategy.rerank_results(
                        query=query,
                        results=results,
                        iraqi_context=iraqi_context,
                        content_key="code",
                    )
                    results = reranking_result.reranked_results

                    # Update results in agentic response
                    agentic_result["results"] = results
                    agentic_result["reranking_applied"] = True
                    agentic_result["reranking_metadata"] = (
                        reranking_result.performance_metrics
                    )

                except Exception as e:
                    logger.warning(f"Iraqi code reranking failed: {e}")

            # Add service-level enhancements
            enhanced_response = agentic_result.copy()
            enhanced_response.update(
                {
                    "service_level": "iraqi_rag_service",
                    "pipeline_components": {
                        "iraqi_agentic_rag": True,
                        "cultural_validation": self.config.enable_cultural_validation,
                        "arabic_processing": self.config.enable_arabic_processing,
                        "hybrid_search": self.config.enable_hybrid_search,
                        "reranking": self.reranking_strategy is not None,
                    },
                    "code_specific_enhancements": {
                        "arabic_comment_processing": True,
                        "cultural_code_analysis": True,
                        "professional_domain_aware": True,
                        "iraqi_localization_detection": True,
                    },
                }
            )

            self.service_stats["agentic_searches"] += 1

            logger.info(
                f"Iraqi code service completed - {len(results)} enhanced code examples"
            )

            return True, enhanced_response

        except Exception as e:
            logger.error(f"Iraqi code service search failed: {e}")
            return False, {
                "error": str(e),
                "error_type": type(e).__name__,
                "query": query,
                "source_filter": source_id,
                "service_level": "iraqi_rag_service",
            }

    def _create_default_iraqi_context(self) -> IraqiSearchContext:
        """Create default Iraqi search context from configuration"""
        return IraqiSearchContext(
            language=self.config.default_language,
            dialect=self.config.default_dialect,
            professional_domain=self.config.default_professional_domain,
            cultural_sensitivity=self.config.default_cultural_sensitivity,
            islamic_compliance=self.config.default_islamic_compliance,
            region="iraq",
        )

    async def _format_iraqi_rag_result(
        self, result: Dict[str, Any], iraqi_context: IraqiSearchContext
    ) -> Dict[str, Any]:
        """Format search result with Iraqi enhancements"""

        formatted_result = {
            "id": result.get("id", f"result_unknown"),
            "content": result.get("content", "")[:1000],  # Limit content
            "metadata": result.get("metadata", {}),
            "similarity_score": result.get("similarity", 0.0),
            "iraqi_relevance_score": result.get(
                "iraqi_relevance_score", result.get("similarity", 0.0)
            ),
        }

        # Add Iraqi-specific metadata
        if "cultural_validation" in result:
            formatted_result["cultural_validation"] = result["cultural_validation"]

        if "arabic_processing" in result:
            formatted_result["arabic_processing"] = result["arabic_processing"]

        if "professional_context" in result:
            formatted_result["professional_context"] = result["professional_context"]

        # Add reranking score if available
        if "iraqi_rerank_score" in result:
            formatted_result["iraqi_rerank_score"] = result["iraqi_rerank_score"]

        # Add enhancement metadata
        formatted_result["iraqi_enhancements"] = {
            "cultural_intelligence_applied": "cultural_validation" in result,
            "arabic_processing_applied": "arabic_processing" in result,
            "professional_enhancement_applied": "professional_context" in result,
            "context_domain": iraqi_context.professional_domain,
            "cultural_sensitivity_level": iraqi_context.cultural_sensitivity,
        }

        return formatted_result

    def _calculate_average_cultural_score(self, results: List[Dict[str, Any]]) -> float:
        """Calculate average cultural compliance score"""
        if not results:
            return 0.0

        scores = []
        for result in results:
            cultural_validation = result.get("cultural_validation", {})
            if isinstance(cultural_validation, dict):
                score = cultural_validation.get("overall_score", 0.0)
            else:
                score = 0.0
            scores.append(score)

        return sum(scores) / len(scores) if scores else 0.0

    def _update_service_stats(self, processing_time: float):
        """Update service performance statistics"""
        self.service_stats["total_queries"] += 1

        # Update average response time
        current_avg = self.service_stats["average_response_time"]
        total_queries = self.service_stats["total_queries"]

        self.service_stats["average_response_time"] = (
            current_avg * (total_queries - 1) + processing_time
        ) / total_queries

    def get_service_statistics(self) -> Dict[str, Any]:
        """Get comprehensive Iraqi RAG service statistics"""
        return {
            "service_stats": self.service_stats,
            "config": {
                "hybrid_search_enabled": self.config.enable_hybrid_search,
                "reranking_enabled": self.config.enable_reranking,
                "agentic_rag_enabled": self.config.enable_agentic_rag,
                "cultural_validation_enabled": self.config.enable_cultural_validation,
                "arabic_processing_enabled": self.config.enable_arabic_processing,
                "default_cultural_sensitivity": self.config.default_cultural_sensitivity,
                "default_islamic_compliance": self.config.default_islamic_compliance,
            },
            "component_stats": {
                "base_strategy": self.base_strategy.get_search_metrics(),
                "hybrid_strategy": self.hybrid_strategy.get_search_performance_metrics()
                if hasattr(self.hybrid_strategy, "get_search_performance_metrics")
                else {},
                "reranking_strategy": self.reranking_strategy.get_reranking_statistics()
                if self.reranking_strategy
                else {},
                "agentic_strategy": self.agentic_strategy.get_agentic_statistics(),
                "cultural_validator": self.cultural_validator.get_validation_statistics(),
                "arabic_processor": self.arabic_processor.get_processing_statistics(),
                "keyword_extractor": self.keyword_extractor.get_extraction_statistics(),
            },
        }

    async def health_check(self) -> Dict[str, Any]:
        """Perform health check on all Iraqi RAG components"""
        health_status = {
            "overall_status": "healthy",
            "components": {},
            "timestamp": "2025-01-01T00:00:00Z",
        }

        try:
            # Check base components
            health_status["components"]["supabase_client"] = (
                "connected" if self.supabase_client else "disconnected"
            )
            health_status["components"]["cultural_validator"] = "loaded"
            health_status["components"]["arabic_processor"] = "loaded"
            health_status["components"]["keyword_extractor"] = "loaded"

            # Check strategies
            health_status["components"]["base_strategy"] = "loaded"
            health_status["components"]["hybrid_strategy"] = "loaded"
            health_status["components"]["reranking_strategy"] = (
                "loaded" if self.reranking_strategy else "disabled"
            )
            health_status["components"]["agentic_strategy"] = (
                "loaded" if self.agentic_strategy.is_enabled() else "disabled"
            )

            # Check for any issues
            if not self.supabase_client:
                health_status["overall_status"] = "degraded"
                health_status["issues"] = ["Supabase client not connected"]

        except Exception as e:
            health_status["overall_status"] = "unhealthy"
            health_status["error"] = str(e)

        return health_status

    @classmethod
    def create_from_config(
        cls, config_dict: Dict[str, Any], supabase_client=None
    ) -> "IraqiRAGService":
        """Create Iraqi RAG service from configuration dictionary"""
        config = IraqiRAGConfig(**config_dict)
        return cls(supabase_client=supabase_client, config=config)
