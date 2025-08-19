"""
Iraqi-Enhanced Base Search Strategy

Implements the foundational vector similarity search with Iraqi cultural intelligence integration.
This extends Archon's base search with Arabic language processing and cultural compliance validation.
"""

from typing import Any, List, Dict, Optional
import asyncio
import json
import logging
from dataclasses import dataclass
from supabase import Client

# Iraqi context imports (would be available in actual implementation)
from .cultural_validator import IraqiCulturalValidator
from .arabic_processor import ArabicTextProcessor

logger = logging.getLogger(__name__)

# Iraqi-specific similarity thresholds
ARABIC_SIMILARITY_THRESHOLD = 0.12  # Lower threshold for Arabic due to morphological complexity
ENGLISH_SIMILARITY_THRESHOLD = 0.15  # Standard threshold for English content
CULTURAL_COMPLIANCE_THRESHOLD = 0.95  # Minimum cultural compliance score

@dataclass
class IraqiSearchContext:
    """Context information for Iraqi-enhanced search operations"""
    language: str = "mixed"  # "arabic", "english", "mixed"
    dialect: str = "iraqi"  # "iraqi", "standard", "mixed" 
    professional_domain: str = "general"  # "legal", "medical", "educational", "government"
    cultural_sensitivity: float = 0.95  # Required cultural compliance score
    islamic_compliance: bool = True  # Filter for Islamic values compliance
    region: str = "iraq"  # Geographic context
    
class IraqiBaseSearchStrategy:
    """Iraqi-enhanced base strategy implementing cultural intelligence and Arabic processing"""

    def __init__(self, supabase_client: Client, cultural_validator: IraqiCulturalValidator = None,
                 arabic_processor: ArabicTextProcessor = None):
        """Initialize with database client and Iraqi-specific processors"""
        self.supabase_client = supabase_client
        self.cultural_validator = cultural_validator or IraqiCulturalValidator()
        self.arabic_processor = arabic_processor or ArabicTextProcessor()
        
        # Performance tracking
        self.search_metrics = {
            "total_searches": 0,
            "cultural_filtered": 0,
            "arabic_processed": 0,
            "dialect_recognized": 0
        }

    async def vector_search(
        self,
        query_embedding: List[float],
        match_count: int,
        filter_metadata: Optional[Dict] = None,
        table_rpc: str = "match_iraqi_documents",
        iraqi_context: Optional[IraqiSearchContext] = None,
    ) -> List[Dict[str, Any]]:
        """
        Perform Iraqi-enhanced vector similarity search with cultural intelligence.

        Args:
            query_embedding: The embedding vector for the query
            match_count: Number of results to return
            filter_metadata: Optional metadata filters
            table_rpc: The RPC function to call
            iraqi_context: Iraqi-specific search context

        Returns:
            List of culturally-validated matching documents with Arabic processing
        """
        try:
            # Initialize context if not provided
            if iraqi_context is None:
                iraqi_context = IraqiSearchContext()
            
            # Determine similarity threshold based on language
            similarity_threshold = (
                ARABIC_SIMILARITY_THRESHOLD if iraqi_context.language in ["arabic", "mixed"]
                else ENGLISH_SIMILARITY_THRESHOLD
            )
            
            logger.info(f"Iraqi search started - Language: {iraqi_context.language}, "
                       f"Domain: {iraqi_context.professional_domain}, "
                       f"Cultural sensitivity: {iraqi_context.cultural_sensitivity}")
            
            # Build RPC parameters with Iraqi enhancements
            rpc_params = {
                "query_embedding": query_embedding,
                "match_count": match_count * 2,  # Get more for cultural filtering
                "similarity_threshold": similarity_threshold
            }
            
            # Add Iraqi-specific filters
            iraqi_filters = {}
            if filter_metadata:
                iraqi_filters.update(filter_metadata)
            
            # Add cultural compliance filters
            iraqi_filters.update({
                "cultural_compliance_min": iraqi_context.cultural_sensitivity,
                "islamic_compliant": iraqi_context.islamic_compliance,
                "professional_domain": iraqi_context.professional_domain,
                "language_support": iraqi_context.language,
                "region": iraqi_context.region
            })
            
            rpc_params["iraqi_filter"] = iraqi_filters
            
            # Execute search with Iraqi RPC function
            response = self.supabase_client.rpc(table_rpc, rpc_params).execute()
            
            if not response.data:
                logger.warning("No results returned from Iraqi search")
                return []
            
            # Process results with Iraqi intelligence
            processed_results = await self._process_iraqi_results(
                response.data, iraqi_context, similarity_threshold
            )
            
            # Apply cultural validation and Arabic processing
            validated_results = await self._apply_cultural_intelligence(
                processed_results, iraqi_context
            )
            
            # Limit to requested count
            final_results = validated_results[:match_count]
            
            # Update metrics
            self.search_metrics["total_searches"] += 1
            self.search_metrics["cultural_filtered"] += len(response.data) - len(validated_results)
            
            logger.info(f"Iraqi search completed - {len(final_results)} culturally-validated results, "
                       f"{self.search_metrics['cultural_filtered']} filtered for cultural compliance")
            
            return final_results
            
        except Exception as e:
            logger.error(f"Iraqi vector search failed: {e}")
            return []

    async def _process_iraqi_results(
        self, 
        raw_results: List[Dict[str, Any]], 
        context: IraqiSearchContext,
        similarity_threshold: float
    ) -> List[Dict[str, Any]]:
        """Process raw search results with Iraqi-specific intelligence"""
        
        processed_results = []
        
        for result in raw_results:
            try:
                # Check similarity threshold
                similarity = float(result.get("similarity", 0.0))
                if similarity < similarity_threshold:
                    continue
                
                # Extract and validate content
                content = result.get("content", "")
                if not content:
                    continue
                
                # Process Arabic content if present
                if await self.arabic_processor.contains_arabic(content):
                    arabic_metadata = await self.arabic_processor.process_content(
                        content, context.dialect
                    )
                    result["arabic_metadata"] = arabic_metadata
                    self.search_metrics["arabic_processed"] += 1
                    
                    # Check for Iraqi dialect
                    if arabic_metadata.get("dialect_confidence", 0) > 0.7:
                        self.search_metrics["dialect_recognized"] += 1
                
                # Add Iraqi-specific metadata
                result["iraqi_metadata"] = {
                    "processed_at": "2025-01-01T00:00:00Z",  # Current timestamp
                    "cultural_context": context.professional_domain,
                    "language_detected": await self._detect_language(content),
                    "regional_relevance": await self._calculate_regional_relevance(content, context)
                }
                
                processed_results.append(result)
                
            except Exception as e:
                logger.warning(f"Error processing Iraqi result: {e}")
                continue
        
        return processed_results

    async def _apply_cultural_intelligence(
        self, 
        results: List[Dict[str, Any]], 
        context: IraqiSearchContext
    ) -> List[Dict[str, Any]]:
        """Apply Iraqi cultural intelligence validation to search results"""
        
        culturally_validated = []
        
        for result in results:
            try:
                content = result.get("content", "")
                
                # Validate cultural compliance
                cultural_score = await self.cultural_validator.validate_content(
                    content, 
                    context.professional_domain,
                    context.islamic_compliance
                )
                
                # Check if meets cultural threshold
                if cultural_score.overall_score >= context.cultural_sensitivity:
                    # Add cultural validation metadata
                    result["cultural_validation"] = {
                        "overall_score": cultural_score.overall_score,
                        "islamic_compliance": cultural_score.islamic_compliance,
                        "professional_appropriateness": cultural_score.professional_appropriateness,
                        "language_appropriateness": cultural_score.language_appropriateness,
                        "regional_sensitivity": cultural_score.regional_sensitivity,
                        "validation_timestamp": "2025-01-01T00:00:00Z"
                    }
                    
                    # Enhance with professional domain context
                    if context.professional_domain != "general":
                        professional_enhancement = await self._enhance_professional_context(
                            result, context.professional_domain
                        )
                        result["professional_context"] = professional_enhancement
                    
                    culturally_validated.append(result)
                else:
                    logger.debug(f"Content filtered for cultural compliance: {cultural_score.overall_score:.2f} < {context.cultural_sensitivity}")
            
            except Exception as e:
                logger.warning(f"Error in cultural validation: {e}")
                continue
        
        return culturally_validated

    async def _detect_language(self, content: str) -> str:
        """Detect language of content"""
        if await self.arabic_processor.contains_arabic(content):
            if await self.arabic_processor.contains_english(content):
                return "mixed"
            return "arabic"
        return "english"

    async def _calculate_regional_relevance(self, content: str, context: IraqiSearchContext) -> float:
        """Calculate relevance score for Iraqi regional context"""
        # Iraqi-specific keywords and concepts
        iraqi_indicators = [
            "العراق", "baghdad", "بغداد", "basra", "البصرة", "kurdistan", "كردستان",
            "iraqi", "dinar", "دينار", "ministry", "وزارة", "government", "حكومة"
        ]
        
        content_lower = content.lower()
        matches = sum(1 for indicator in iraqi_indicators if indicator in content_lower)
        
        # Calculate relevance score (0.0 to 1.0)
        max_possible_matches = min(len(iraqi_indicators), 10)  # Cap for normalization
        relevance_score = min(1.0, matches / max_possible_matches * 2)  # Boost factor of 2
        
        return relevance_score

    async def _enhance_professional_context(
        self, 
        result: Dict[str, Any], 
        domain: str
    ) -> Dict[str, Any]:
        """Enhance results with professional domain-specific context"""
        
        domain_enhancements = {
            "legal": {
                "relevant_laws": await self._extract_legal_references(result.get("content", "")),
                "legal_terminology": await self._identify_legal_terms(result.get("content", "")),
                "court_jurisdiction": "iraqi_courts",
                "legal_system": "iraqi_civil_law"
            },
            "medical": {
                "medical_terminology": await self._identify_medical_terms(result.get("content", "")),
                "iraqi_medical_standards": True,
                "healthcare_system": "iraqi_ministry_of_health",
                "medical_ethics": "islamic_medical_ethics"
            },
            "educational": {
                "curriculum_alignment": await self._check_curriculum_alignment(result.get("content", "")),
                "educational_level": await self._determine_education_level(result.get("content", "")),
                "iraqi_education_system": True,
                "language_instruction": "arabic_english_bilingual"
            },
            "government": {
                "government_level": await self._identify_government_level(result.get("content", "")),
                "ministry_alignment": await self._identify_relevant_ministry(result.get("content", "")),
                "administrative_process": True,
                "citizen_services": await self._identify_citizen_services(result.get("content", ""))
            }
        }
        
        return domain_enhancements.get(domain, {})

    # Professional domain helper methods (simplified implementations)
    async def _extract_legal_references(self, content: str) -> List[str]:
        """Extract Iraqi legal references from content"""
        # Simplified: would use NLP to extract law numbers, articles, etc.
        legal_keywords = ["قانون", "law", "article", "مادة", "decree", "مرسوم"]
        return [kw for kw in legal_keywords if kw in content.lower()]

    async def _identify_legal_terms(self, content: str) -> List[str]:
        """Identify legal terminology in content"""
        return ["contract", "عقد", "court", "محكمة", "judge", "قاضي"]

    async def _identify_medical_terms(self, content: str) -> List[str]:
        """Identify medical terminology in content"""
        return ["patient", "مريض", "diagnosis", "تشخيص", "treatment", "علاج"]

    async def _check_curriculum_alignment(self, content: str) -> str:
        """Check alignment with Iraqi curriculum standards"""
        return "iraqi_national_curriculum_2025"

    async def _determine_education_level(self, content: str) -> str:
        """Determine educational level of content"""
        return "secondary"  # Simplified

    async def _identify_government_level(self, content: str) -> str:
        """Identify level of government (federal, provincial, local)"""
        return "federal"  # Simplified

    async def _identify_relevant_ministry(self, content: str) -> str:
        """Identify relevant Iraqi ministry"""
        return "ministry_of_education"  # Simplified

    async def _identify_citizen_services(self, content: str) -> List[str]:
        """Identify citizen services mentioned in content"""
        return ["passport", "جواز سفر", "license", "رخصة"]

    def get_search_metrics(self) -> Dict[str, Any]:
        """Get Iraqi search performance metrics"""
        return {
            "search_metrics": self.search_metrics,
            "cultural_compliance_rate": (
                1 - (self.search_metrics["cultural_filtered"] / max(1, self.search_metrics["total_searches"]))
            ),
            "arabic_processing_rate": (
                self.search_metrics["arabic_processed"] / max(1, self.search_metrics["total_searches"])
            ),
            "dialect_recognition_rate": (
                self.search_metrics["dialect_recognized"] / max(1, self.search_metrics["arabic_processed"])
            )
        }

    def reset_metrics(self):
        """Reset search metrics"""
        self.search_metrics = {
            "total_searches": 0,
            "cultural_filtered": 0,
            "arabic_processed": 0,
            "dialect_recognized": 0
        }