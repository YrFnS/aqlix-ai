"""
Iraqi-Enhanced RAG System

A comprehensive RAG system based on Archon's architecture with Iraqi cultural intelligence,
Arabic language processing, and professional domain expertise integration.

This system provides:
- Cultural compliance validation throughout the search pipeline
- Arabic language processing with Iraqi dialect recognition
- Professional domain-aware search and ranking (legal, medical, educational, government)
- Islamic values compliance filtering
- Bilingual (Arabic-English) content handling
- Iraqi localization and regional context awareness

Architecture:
- IraqiBaseSearchStrategy: Foundation vector search with cultural intelligence
- IraqiHybridSearchStrategy: Combined vector + cultural keyword search
- IraqiRerankingStrategy: Cultural compliance + Arabic processing reranking
- IraqiAgenticRAGStrategy: Intelligent code examples with cultural context
- IraqiRAGService: Thin coordinator orchestrating all strategies

Components:
- IraqiCulturalValidator: Comprehensive cultural compliance validation
- ArabicTextProcessor: Arabic language processing with dialect recognition
- IraqiKeywordExtractor: Culturally-aware keyword extraction
"""

from .base_search_strategy import (
    IraqiBaseSearchStrategy,
    IraqiSearchContext,
    ARABIC_SIMILARITY_THRESHOLD,
    ENGLISH_SIMILARITY_THRESHOLD,
    CULTURAL_COMPLIANCE_THRESHOLD
)

from .cultural_validator import (
    IraqiCulturalValidator,
    CulturalValidationResult,
    CulturalSensitivityLevel,
    ProfessionalDomain
)

from .arabic_processor import (
    ArabicTextProcessor,
    ArabicProcessingResult,
    ArabicScript,
    IraqiDialectType
)

from .keyword_extractor import (
    IraqiKeywordExtractor,
    IraqiKeywordExtractionResult
)

from .hybrid_search_strategy import (
    IraqiHybridSearchStrategy,
    IraqiHybridSearchConfig
)

from .reranking_strategy import (
    IraqiRerankingStrategy,
    IraqiRerankingConfig,
    IraqiRerankingResult
)

from .agentic_rag_strategy import (
    IraqiAgenticRAGStrategy,
    IraqiAgenticConfig,
    IraqiCodeAnalysisResult,
    IraqiCodeType
)

from .rag_service import (
    IraqiRAGService,
    IraqiRAGConfig
)

# Version information
__version__ = "1.0.0"
__author__ = "Iraqi AI Development Team"
__description__ = "Iraqi-enhanced RAG system with cultural intelligence and Arabic processing"

# Default configuration for easy setup
DEFAULT_IRAQI_RAG_CONFIG = IraqiRAGConfig(
    enable_hybrid_search=True,
    enable_reranking=True,
    enable_agentic_rag=True,
    enable_cultural_validation=True,
    enable_arabic_processing=True,
    default_cultural_sensitivity=0.95,
    default_islamic_compliance=True,
    default_professional_domain="general",
    default_language="mixed",
    default_dialect="iraqi"
)

# Convenience factory functions
def create_iraqi_rag_service(
    supabase_client=None,
    config=None,
    cultural_sensitivity=0.95,
    enable_arabic_processing=True
):
    """
    Create a fully configured Iraqi RAG service with sensible defaults.
    
    Args:
        supabase_client: Supabase client instance
        config: Optional IraqiRAGConfig instance
        cultural_sensitivity: Cultural compliance threshold (0.0-1.0)
        enable_arabic_processing: Whether to enable Arabic processing
        
    Returns:
        Configured IraqiRAGService instance
    """
    if config is None:
        config = IraqiRAGConfig(
            default_cultural_sensitivity=cultural_sensitivity,
            enable_arabic_processing=enable_arabic_processing
        )
    
    return IraqiRAGService(supabase_client=supabase_client, config=config)

def create_iraqi_search_context(
    professional_domain="general",
    cultural_sensitivity=0.95,
    islamic_compliance=True,
    language="mixed",
    dialect="iraqi"
):
    """
    Create an Iraqi search context with specified parameters.
    
    Args:
        professional_domain: Professional domain (legal, medical, educational, government, business, technical, general)
        cultural_sensitivity: Required cultural compliance score (0.0-1.0)
        islamic_compliance: Whether Islamic compliance is required
        language: Language context (arabic, english, mixed)
        dialect: Arabic dialect (iraqi, standard, mixed)
        
    Returns:
        Configured IraqiSearchContext instance
    """
    return IraqiSearchContext(
        language=language,
        dialect=dialect,
        professional_domain=professional_domain,
        cultural_sensitivity=cultural_sensitivity,
        islamic_compliance=islamic_compliance,
        region="iraq"
    )

# Export all public components
__all__ = [
    # Main service
    "IraqiRAGService",
    "IraqiRAGConfig",
    
    # Search strategies
    "IraqiBaseSearchStrategy",
    "IraqiHybridSearchStrategy", 
    "IraqiRerankingStrategy",
    "IraqiAgenticRAGStrategy",
    
    # Core components
    "IraqiCulturalValidator",
    "ArabicTextProcessor",
    "IraqiKeywordExtractor",
    
    # Data structures
    "IraqiSearchContext",
    "CulturalValidationResult",
    "ArabicProcessingResult",
    "IraqiKeywordExtractionResult",
    "IraqiRerankingResult",
    "IraqiCodeAnalysisResult",
    
    # Configuration classes
    "IraqiHybridSearchConfig",
    "IraqiRerankingConfig", 
    "IraqiAgenticConfig",
    
    # Enums
    "ArabicScript",
    "IraqiDialectType",
    "CulturalSensitivityLevel",
    "ProfessionalDomain",
    "IraqiCodeType",
    
    # Constants
    "ARABIC_SIMILARITY_THRESHOLD",
    "ENGLISH_SIMILARITY_THRESHOLD", 
    "CULTURAL_COMPLIANCE_THRESHOLD",
    
    # Factory functions
    "create_iraqi_rag_service",
    "create_iraqi_search_context",
    
    # Default configuration
    "DEFAULT_IRAQI_RAG_CONFIG",
    
    # Package metadata
    "__version__",
    "__author__",
    "__description__"
]