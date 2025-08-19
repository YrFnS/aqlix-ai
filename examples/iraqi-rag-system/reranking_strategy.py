"""
Iraqi-Enhanced Reranking Strategy

Extends Archon's reranking with cultural intelligence, Arabic language processing,
and Iraqi professional domain awareness. Uses cross-encoder models enhanced with
cultural relevance scoring and Arabic text understanding.
"""

from typing import Any, Dict, List, Optional, Tuple, Union
import logging
from dataclasses import dataclass

try:
    from sentence_transformers import CrossEncoder
    CROSSENCODER_AVAILABLE = True
except ImportError:
    CrossEncoder = None
    CROSSENCODER_AVAILABLE = False

from .cultural_validator import IraqiCulturalValidator, CulturalValidationResult
from .arabic_processor import ArabicTextProcessor

logger = logging.getLogger(__name__)

# Iraqi-enhanced reranking models
DEFAULT_IRAQI_RERANKING_MODEL = "cross-encoder/ms-marco-MiniLM-L-6-v2"
ARABIC_ENHANCED_MODEL = "aubmindlab/bert-base-arabertv02"  # Example Arabic model

@dataclass
class IraqiRerankingConfig:
    """Configuration for Iraqi-enhanced reranking"""
    base_model_name: str = DEFAULT_IRAQI_RERANKING_MODEL
    enable_cultural_scoring: bool = True
    enable_arabic_processing: bool = True
    cultural_weight: float = 0.3              # Weight for cultural relevance (0-1)
    arabic_processing_weight: float = 0.2     # Weight for Arabic processing (0-1)
    professional_domain_weight: float = 0.2   # Weight for professional relevance (0-1)
    base_similarity_weight: float = 0.3       # Weight for base similarity (0-1)
    
    # Minimum thresholds
    cultural_compliance_threshold: float = 0.8
    arabic_quality_threshold: float = 0.7
    professional_relevance_threshold: float = 0.6

@dataclass
class IraqiRerankingResult:
    """Result of Iraqi-enhanced reranking process"""
    reranked_results: List[Dict[str, Any]]
    original_count: int
    reranked_count: int
    cultural_filtering_applied: bool
    arabic_processing_applied: bool
    professional_enhancement_applied: bool
    performance_metrics: Dict[str, Any]

class IraqiRerankingStrategy:
    """
    Iraqi-enhanced reranking strategy that combines cross-encoder models with
    cultural intelligence, Arabic language processing, and professional domain awareness.
    
    Features:
    - Cultural relevance scoring and filtering
    - Arabic text quality assessment
    - Professional domain relevance scoring
    - Iraqi dialect recognition enhancement
    - Islamic compliance validation
    - Bilingual content handling
    """

    def __init__(
        self,
        config: Optional[IraqiRerankingConfig] = None,
        cultural_validator: Optional[IraqiCulturalValidator] = None,
        arabic_processor: Optional[ArabicTextProcessor] = None,
        model_instance: Optional[Any] = None
    ):
        """Initialize Iraqi-enhanced reranking strategy"""
        self.config = config or IraqiRerankingConfig()
        self.cultural_validator = cultural_validator or IraqiCulturalValidator()
        self.arabic_processor = arabic_processor or ArabicTextProcessor()
        
        # Load base cross-encoder model
        self.base_model = model_instance or self._load_base_model()
        
        # Performance tracking
        self.reranking_stats = {
            "total_reranking_operations": 0,
            "cultural_filtered_results": 0,
            "arabic_enhanced_results": 0,
            "professional_enhanced_results": 0,
            "average_reranking_time": 0.0
        }

    def _load_base_model(self) -> Optional[CrossEncoder]:
        """Load the base cross-encoder model"""
        if not CROSSENCODER_AVAILABLE:
            logger.warning("sentence-transformers not available - base reranking disabled")
            return None
        
        try:
            logger.info(f"Loading Iraqi reranking model: {self.config.base_model_name}")
            return CrossEncoder(self.config.base_model_name)
        except Exception as e:
            logger.error(f"Failed to load reranking model {self.config.base_model_name}: {e}")
            return None

    def is_available(self) -> bool:
        """Check if Iraqi reranking is available"""
        return self.base_model is not None

    async def rerank_results(
        self,
        query: str,
        results: List[Dict[str, Any]],
        iraqi_context: Optional[Any] = None,  # IraqiSearchContext
        content_key: str = "content",
        top_k: Optional[int] = None
    ) -> IraqiRerankingResult:
        """
        Perform Iraqi-enhanced reranking with cultural intelligence and Arabic processing.
        
        Args:
            query: The search query used to retrieve results
            results: List of search results to rerank
            iraqi_context: Iraqi-specific search context
            content_key: The key containing text content for reranking
            top_k: Optional limit on number of results to return
            
        Returns:
            IraqiRerankingResult with reranked results and processing metadata
        """
        try:
            import time
            start_time = time.time()
            
            logger.info(f"Starting Iraqi reranking - {len(results)} results, "
                       f"Cultural scoring: {self.config.enable_cultural_scoring}, "
                       f"Arabic processing: {self.config.enable_arabic_processing}")
            
            if not results:
                return self._create_empty_result()
            
            # 1. Prepare results for Iraqi-enhanced processing
            processed_results = await self._prepare_results_for_iraqi_processing(
                results, iraqi_context, content_key
            )
            
            # 2. Apply base cross-encoder reranking if available
            base_reranked_results = await self._apply_base_reranking(
                query, processed_results, content_key
            )
            
            # 3. Apply Iraqi cultural intelligence scoring
            culturally_scored_results = await self._apply_cultural_intelligence_scoring(
                base_reranked_results, iraqi_context
            )
            
            # 4. Apply Arabic language processing enhancement
            arabic_enhanced_results = await self._apply_arabic_processing_enhancement(
                culturally_scored_results, query
            )
            
            # 5. Apply professional domain relevance scoring
            professionally_enhanced_results = await self._apply_professional_domain_scoring(
                arabic_enhanced_results, iraqi_context
            )
            
            # 6. Combine all scores and perform final ranking
            final_ranked_results = await self._perform_final_iraqi_ranking(
                professionally_enhanced_results, top_k
            )
            
            # 7. Apply filtering based on Iraqi standards
            filtered_results = await self._apply_iraqi_filtering(
                final_ranked_results, iraqi_context
            )
            
            # Calculate performance metrics
            processing_time = time.time() - start_time
            performance_metrics = self._calculate_performance_metrics(
                results, filtered_results, processing_time
            )
            
            # Update statistics
            self._update_reranking_stats(performance_metrics)
            
            result = IraqiRerankingResult(
                reranked_results=filtered_results,
                original_count=len(results),
                reranked_count=len(filtered_results),
                cultural_filtering_applied=self.config.enable_cultural_scoring,
                arabic_processing_applied=self.config.enable_arabic_processing,
                professional_enhancement_applied=iraqi_context is not None and 
                    hasattr(iraqi_context, 'professional_domain') and 
                    iraqi_context.professional_domain != "general",
                performance_metrics=performance_metrics
            )
            
            logger.info(f"Iraqi reranking completed - {len(filtered_results)} final results, "
                       f"Processing time: {processing_time:.2f}s")
            
            return result
            
        except Exception as e:
            logger.error(f"Iraqi reranking failed: {e}")
            return self._create_error_result(results, str(e))

    async def _prepare_results_for_iraqi_processing(
        self,
        results: List[Dict[str, Any]],
        iraqi_context: Optional[Any],
        content_key: str
    ) -> List[Dict[str, Any]]:
        """Prepare results for Iraqi-enhanced processing"""
        
        processed_results = []
        
        for result in results:
            processed_result = result.copy()
            
            # Initialize Iraqi processing metadata
            processed_result["iraqi_processing"] = {
                "cultural_validation_pending": self.config.enable_cultural_scoring,
                "arabic_processing_pending": self.config.enable_arabic_processing,
                "professional_scoring_pending": iraqi_context is not None,
                "original_similarity": result.get("similarity", 0.0),
                "base_rerank_score": None,
                "cultural_score": None,
                "arabic_score": None,
                "professional_score": None,
                "final_iraqi_score": None
            }
            
            processed_results.append(processed_result)
        
        return processed_results

    async def _apply_base_reranking(
        self,
        query: str,
        results: List[Dict[str, Any]],
        content_key: str
    ) -> List[Dict[str, Any]]:
        """Apply base cross-encoder reranking"""
        
        if not self.base_model:
            logger.debug("Base model not available, skipping base reranking")
            # Use original similarity scores
            for result in results:
                result["iraqi_processing"]["base_rerank_score"] = result.get("similarity", 0.0)
            return results
        
        try:
            # Build query-document pairs
            query_doc_pairs = []
            valid_indices = []
            
            for i, result in enumerate(results):
                content = result.get(content_key, "")
                if content and isinstance(content, str):
                    query_doc_pairs.append([query, content])
                    valid_indices.append(i)
            
            if not query_doc_pairs:
                logger.warning("No valid content for base reranking")
                return results
            
            # Get reranking scores from base model
            base_scores = self.base_model.predict(query_doc_pairs)
            
            # Apply base scores to results
            for i, valid_idx in enumerate(valid_indices):
                results[valid_idx]["iraqi_processing"]["base_rerank_score"] = float(base_scores[i])
            
            # Set default scores for invalid results
            for i, result in enumerate(results):
                if i not in valid_indices:
                    result["iraqi_processing"]["base_rerank_score"] = result.get("similarity", 0.0)
            
            logger.debug(f"Base reranking applied to {len(valid_indices)} results")
            
        except Exception as e:
            logger.warning(f"Base reranking failed: {e}, using original scores")
            for result in results:
                result["iraqi_processing"]["base_rerank_score"] = result.get("similarity", 0.0)
        
        return results

    async def _apply_cultural_intelligence_scoring(
        self,
        results: List[Dict[str, Any]],
        iraqi_context: Optional[Any]
    ) -> List[Dict[str, Any]]:
        """Apply Iraqi cultural intelligence scoring"""
        
        if not self.config.enable_cultural_scoring:
            for result in results:
                result["iraqi_processing"]["cultural_score"] = 0.8  # Default neutral score
            return results
        
        culturally_scored_results = []
        
        for result in results:
            try:
                content = result.get("content", "")
                
                # Check if cultural validation already exists
                if "cultural_validation" in result:
                    cultural_validation = result["cultural_validation"]
                    if isinstance(cultural_validation, dict):
                        cultural_score = cultural_validation.get("overall_score", 0.5)
                    else:
                        cultural_score = cultural_validation.overall_score
                else:
                    # Perform cultural validation
                    domain = "general"
                    islamic_compliance = True
                    
                    if iraqi_context:
                        if hasattr(iraqi_context, 'professional_domain'):
                            domain = iraqi_context.professional_domain
                        if hasattr(iraqi_context, 'islamic_compliance'):
                            islamic_compliance = iraqi_context.islamic_compliance
                    
                    cultural_validation = await self.cultural_validator.validate_content(
                        content=content,
                        domain=domain,
                        islamic_compliance_required=islamic_compliance
                    )
                    
                    cultural_score = cultural_validation.overall_score
                    result["cultural_validation"] = cultural_validation.__dict__
                
                result["iraqi_processing"]["cultural_score"] = cultural_score
                culturally_scored_results.append(result)
                
            except Exception as e:
                logger.warning(f"Cultural scoring failed for result: {e}")
                result["iraqi_processing"]["cultural_score"] = 0.5  # Neutral score on error
                culturally_scored_results.append(result)
        
        cultural_count = sum(1 for r in culturally_scored_results 
                           if r["iraqi_processing"]["cultural_score"] > 0.8)
        self.reranking_stats["cultural_filtered_results"] += cultural_count
        
        return culturally_scored_results

    async def _apply_arabic_processing_enhancement(
        self,
        results: List[Dict[str, Any]],
        query: str
    ) -> List[Dict[str, Any]]:
        """Apply Arabic language processing enhancement"""
        
        if not self.config.enable_arabic_processing:
            for result in results:
                result["iraqi_processing"]["arabic_score"] = 0.7  # Default neutral score
            return results
        
        arabic_enhanced_results = []
        
        for result in results:
            try:
                content = result.get("content", "")
                arabic_score = 0.7  # Default score
                
                # Check if content contains Arabic
                if await self.arabic_processor.contains_arabic(content):
                    # Process Arabic content
                    arabic_processing = await self.arabic_processor.process_content(content)
                    
                    # Calculate Arabic quality score
                    arabic_score = await self._calculate_arabic_quality_score(
                        arabic_processing, query
                    )
                    
                    # Store Arabic processing metadata
                    result["arabic_processing_metadata"] = {
                        "script_type": arabic_processing.script_type.value,
                        "dialect_type": arabic_processing.dialect_type.value,
                        "dialect_confidence": arabic_processing.dialect_confidence,
                        "cultural_terms_count": len(arabic_processing.cultural_terms),
                        "professional_terms_count": len(arabic_processing.professional_terms),
                        "mixed_direction": arabic_processing.mixed_direction
                    }
                    
                    self.reranking_stats["arabic_enhanced_results"] += 1
                
                result["iraqi_processing"]["arabic_score"] = arabic_score
                arabic_enhanced_results.append(result)
                
            except Exception as e:
                logger.warning(f"Arabic processing failed for result: {e}")
                result["iraqi_processing"]["arabic_score"] = 0.7  # Neutral score on error
                arabic_enhanced_results.append(result)
        
        return arabic_enhanced_results

    async def _apply_professional_domain_scoring(
        self,
        results: List[Dict[str, Any]],
        iraqi_context: Optional[Any]
    ) -> List[Dict[str, Any]]:
        """Apply professional domain relevance scoring"""
        
        if not iraqi_context or not hasattr(iraqi_context, 'professional_domain'):
            for result in results:
                result["iraqi_processing"]["professional_score"] = 0.6  # Default neutral score
            return results
        
        domain = iraqi_context.professional_domain
        
        if domain == "general":
            for result in results:
                result["iraqi_processing"]["professional_score"] = 0.6  # Neutral for general
            return results
        
        professionally_scored_results = []
        
        for result in results:
            try:
                professional_score = await self._calculate_professional_relevance_score(
                    result, domain
                )
                
                result["iraqi_processing"]["professional_score"] = professional_score
                
                if professional_score > 0.7:
                    self.reranking_stats["professional_enhanced_results"] += 1
                
                professionally_scored_results.append(result)
                
            except Exception as e:
                logger.warning(f"Professional scoring failed for result: {e}")
                result["iraqi_processing"]["professional_score"] = 0.6  # Neutral score on error
                professionally_scored_results.append(result)
        
        return professionally_scored_results

    async def _perform_final_iraqi_ranking(
        self,
        results: List[Dict[str, Any]],
        top_k: Optional[int]
    ) -> List[Dict[str, Any]]:
        """Combine all scores and perform final Iraqi-enhanced ranking"""
        
        for result in results:
            iraqi_processing = result["iraqi_processing"]
            
            # Get all component scores
            base_score = iraqi_processing.get("base_rerank_score", 0.0)
            cultural_score = iraqi_processing.get("cultural_score", 0.5)
            arabic_score = iraqi_processing.get("arabic_score", 0.7)
            professional_score = iraqi_processing.get("professional_score", 0.6)
            
            # Calculate weighted final score
            final_score = (
                base_score * self.config.base_similarity_weight +
                cultural_score * self.config.cultural_weight +
                arabic_score * self.config.arabic_processing_weight +
                professional_score * self.config.professional_domain_weight
            )
            
            # Normalize to 0-1 range
            total_weight = (
                self.config.base_similarity_weight +
                self.config.cultural_weight +
                self.config.arabic_processing_weight +
                self.config.professional_domain_weight
            )
            
            final_score = final_score / total_weight
            
            # Store final Iraqi score
            iraqi_processing["final_iraqi_score"] = final_score
            result["iraqi_rerank_score"] = final_score
        
        # Sort by final Iraqi score
        results.sort(key=lambda x: x.get("iraqi_rerank_score", 0), reverse=True)
        
        # Apply top_k limit if specified
        if top_k is not None and top_k > 0:
            results = results[:top_k]
        
        return results

    async def _apply_iraqi_filtering(
        self,
        results: List[Dict[str, Any]],
        iraqi_context: Optional[Any]
    ) -> List[Dict[str, Any]]:
        """Apply Iraqi standards filtering to results"""
        
        filtered_results = []
        
        for result in results:
            iraqi_processing = result["iraqi_processing"]
            
            # Check cultural compliance threshold
            cultural_score = iraqi_processing.get("cultural_score", 0.5)
            if cultural_score < self.config.cultural_compliance_threshold:
                logger.debug(f"Result filtered for cultural compliance: {cultural_score:.2f}")
                continue
            
            # Check Arabic quality threshold (if applicable)
            arabic_score = iraqi_processing.get("arabic_score", 0.7)
            if (await self.arabic_processor.contains_arabic(result.get("content", "")) and
                arabic_score < self.config.arabic_quality_threshold):
                logger.debug(f"Result filtered for Arabic quality: {arabic_score:.2f}")
                continue
            
            # Check professional relevance threshold (if applicable)
            if iraqi_context and hasattr(iraqi_context, 'professional_domain'):
                domain = iraqi_context.professional_domain
                if domain != "general":
                    professional_score = iraqi_processing.get("professional_score", 0.6)
                    if professional_score < self.config.professional_relevance_threshold:
                        logger.debug(f"Result filtered for professional relevance: {professional_score:.2f}")
                        continue
            
            filtered_results.append(result)
        
        return filtered_results

    async def _calculate_arabic_quality_score(
        self,
        arabic_processing: Any,  # ArabicProcessingResult
        query: str
    ) -> float:
        """Calculate Arabic language quality score"""
        
        score = 0.7  # Base score
        
        # Dialect confidence boost
        if arabic_processing.dialect_confidence > 0.7:
            score += 0.15  # Iraqi dialect recognition bonus
        
        # Cultural terms boost
        cultural_terms_ratio = len(arabic_processing.cultural_terms) / max(1, arabic_processing.word_count)
        score += min(0.1, cultural_terms_ratio * 10)
        
        # Professional terms boost
        professional_terms_ratio = len(arabic_processing.professional_terms) / max(1, arabic_processing.word_count)
        score += min(0.1, professional_terms_ratio * 10)
        
        # Mixed direction penalty (for readability)
        if arabic_processing.mixed_direction:
            score -= 0.05
        
        # Formal language boost
        formal_ratio = len(arabic_processing.formal_indicators) / max(1, arabic_processing.word_count)
        score += min(0.1, formal_ratio * 10)
        
        return min(1.0, score)

    async def _calculate_professional_relevance_score(
        self,
        result: Dict[str, Any],
        domain: str
    ) -> float:
        """Calculate professional domain relevance score"""
        
        content = result.get("content", "").lower()
        score = 0.5  # Base score
        
        # Professional context boost
        if "professional_context" in result:
            score += 0.2
        
        # Domain-specific keyword analysis (simplified)
        domain_keywords = {
            "legal": ["قانون", "محكمة", "حكم", "law", "court", "legal"],
            "medical": ["طبيب", "مستشفى", "علاج", "doctor", "hospital", "medical"],
            "educational": ["مدرسة", "جامعة", "تعليم", "school", "university", "education"],
            "government": ["وزارة", "حكومة", "خدمات", "ministry", "government", "services"],
            "technical": ["تقنية", "برمجة", "نظام", "technology", "programming", "system"]
        }
        
        if domain in domain_keywords:
            keyword_matches = sum(1 for keyword in domain_keywords[domain] if keyword in content)
            keyword_score = min(0.3, keyword_matches * 0.1)
            score += keyword_score
        
        # Professional metadata boost
        metadata = result.get("metadata", {})
        if isinstance(metadata, dict) and metadata.get("professional_domain") == domain:
            score += 0.1
        
        return min(1.0, score)

    def _calculate_performance_metrics(
        self,
        original_results: List[Dict[str, Any]],
        final_results: List[Dict[str, Any]],
        processing_time: float
    ) -> Dict[str, Any]:
        """Calculate performance metrics for reranking operation"""
        
        return {
            "processing_time_seconds": processing_time,
            "original_count": len(original_results),
            "final_count": len(final_results),
            "filtering_rate": (len(original_results) - len(final_results)) / max(1, len(original_results)),
            "average_cultural_score": sum(
                r.get("iraqi_processing", {}).get("cultural_score", 0)
                for r in final_results
            ) / max(1, len(final_results)),
            "average_arabic_score": sum(
                r.get("iraqi_processing", {}).get("arabic_score", 0)
                for r in final_results
            ) / max(1, len(final_results)),
            "average_professional_score": sum(
                r.get("iraqi_processing", {}).get("professional_score", 0)
                for r in final_results
            ) / max(1, len(final_results)),
            "average_final_score": sum(
                r.get("iraqi_rerank_score", 0)
                for r in final_results
            ) / max(1, len(final_results))
        }

    def _update_reranking_stats(self, metrics: Dict[str, Any]):
        """Update reranking statistics"""
        self.reranking_stats["total_reranking_operations"] += 1
        
        # Update average processing time
        current_avg = self.reranking_stats["average_reranking_time"]
        new_time = metrics["processing_time_seconds"]
        total_ops = self.reranking_stats["total_reranking_operations"]
        
        self.reranking_stats["average_reranking_time"] = (
            (current_avg * (total_ops - 1) + new_time) / total_ops
        )

    def _create_empty_result(self) -> IraqiRerankingResult:
        """Create empty result for edge cases"""
        return IraqiRerankingResult(
            reranked_results=[],
            original_count=0,
            reranked_count=0,
            cultural_filtering_applied=False,
            arabic_processing_applied=False,
            professional_enhancement_applied=False,
            performance_metrics={}
        )

    def _create_error_result(self, results: List[Dict[str, Any]], error: str) -> IraqiRerankingResult:
        """Create error result when reranking fails"""
        return IraqiRerankingResult(
            reranked_results=results,  # Return original results
            original_count=len(results),
            reranked_count=len(results),
            cultural_filtering_applied=False,
            arabic_processing_applied=False,
            professional_enhancement_applied=False,
            performance_metrics={"error": error}
        )

    def get_reranking_statistics(self) -> Dict[str, Any]:
        """Get Iraqi reranking performance statistics"""
        return {
            "reranking_stats": self.reranking_stats,
            "model_available": self.is_available(),
            "cultural_scoring_enabled": self.config.enable_cultural_scoring,
            "arabic_processing_enabled": self.config.enable_arabic_processing,
            "config": {
                "cultural_weight": self.config.cultural_weight,
                "arabic_weight": self.config.arabic_processing_weight,
                "professional_weight": self.config.professional_domain_weight,
                "base_weight": self.config.base_similarity_weight
            }
        }

    @classmethod
    def create_from_config(cls, config_dict: Dict[str, Any]) -> "IraqiRerankingStrategy":
        """Create strategy from configuration dictionary"""
        config = IraqiRerankingConfig(**config_dict)
        return cls(config=config)