"""
Iraqi AI Agent System - Archon-Enhanced Agent Architecture

Comprehensive agent system providing Iraqi cultural intelligence,
Arabic language processing, and professional domain expertise
built on proven Archon architectural patterns.

🎯 System Performance Standards:
- Agent Initialization: <100ms for any agent type
- Cultural Compliance: 95%+ across all agent interactions
- Arabic Processing: 99%+ RTL accuracy, 85%+ Iraqi dialect recognition
- Response Time: <300ms including cultural intelligence processing
- Scalability: Support for 50+ concurrent agent instances

🔧 Core Features:
- PydanticAI-based agent architecture with cultural intelligence
- Centralized agent factory with performance monitoring
- Professional domain specialization (legal, medical, educational, government)
- Comprehensive Arabic language processing with RTL support
- Islamic compliance validation and cultural appropriateness checking
- Real-time performance metrics and cultural intelligence tracking
- Rate limiting with exponential backoff and cultural context awareness
- Shared cultural intelligence models for memory efficiency

🎓 Agent Specializations:
- RAG Agent: Cultural intelligence-enhanced document search and retrieval
- Cultural Validator: Iraqi cultural compliance and Islamic values validation  
- Arabic Processor: RTL text processing and Iraqi dialect recognition
- Legal Advisor: Iraqi law context with Islamic jurisprudence integration
- Medical Assistant: Islamic medical ethics and patient dignity focus
- Educational Helper: Iraqi curriculum and Islamic education principles
- Government Service: Public service transparency and accountability
- Business Analyst: Iraqi market dynamics with cultural context
- Technical Writer: Professional documentation with cultural adaptation
- Translation Agent: Bilingual technical and cultural translation

📋 Architecture Components:
- IraqiBaseAgent: Enhanced foundation with cultural intelligence
- IraqiAgentFactory: Centralized creation and lifecycle management  
- IraqiCulturalIntelligence: Comprehensive cultural analysis engine
- IraqiRateLimitHandler: Cultural context-aware rate limiting
- Professional domain specialization with Iraqi context
- Performance monitoring and cultural metrics tracking
"""

from .iraqi_base_agent import (
    IraqiBaseAgent,
    IraqiAgentDependencies,
    IraqiAgentOutput,
    IraqiCulturalContext,
    IraqiCulturalIntelligence,
    IraqiRateLimitHandler
)

from .iraqi_rag_agent import (
    IraqiRagAgent,
    IraqiRagDependencies,
    IraqiRagQueryResult
)

from .iraqi_agent_factory import (
    IraqiAgentFactory,
    IraqiAgentConfiguration,
    IraqiAgentInstance,
    IraqiAgentType,
    IraqiProfessionalDomain,
    iraqi_agent_factory,
    create_iraqi_rag_agent,
    get_iraqi_agent,
    execute_iraqi_agent
)

# Version and metadata
__version__ = "1.0.0"
__author__ = "Iraqi AI Development Team"
__description__ = "Iraqi-enhanced PydanticAI agent system with cultural intelligence"

# Quality metrics and standards
QUALITY_STANDARDS = {
    "cultural_compliance_threshold": 0.95,
    "islamic_compliance_threshold": 0.90,
    "arabic_processing_accuracy": 0.99,
    "dialect_recognition_accuracy": 0.85,
    "max_response_time_ms": 300,
    "agent_initialization_time_ms": 100
}

# Professional domain configurations  
PROFESSIONAL_DOMAINS = {
    "legal": {
        "cultural_sensitivity": 0.98,
        "islamic_jurisprudence_required": True,
        "iraqi_law_context": True,
        "professional_terminology": "legal_arabic"
    },
    "medical": {
        "cultural_sensitivity": 0.99,
        "islamic_medical_ethics": True,
        "patient_dignity": True,
        "professional_terminology": "medical_arabic"
    },
    "educational": {
        "cultural_sensitivity": 0.96,
        "islamic_education_principles": True,
        "iraqi_curriculum_alignment": True,
        "professional_terminology": "educational_arabic"
    },
    "government": {
        "cultural_sensitivity": 0.94,
        "public_service_focus": True,
        "transparency_required": True,
        "professional_terminology": "government_arabic"
    }
}

# Export all main components
__all__ = [
    # Base agent system
    "IraqiBaseAgent",
    "IraqiAgentDependencies", 
    "IraqiAgentOutput",
    "IraqiCulturalContext",
    "IraqiCulturalIntelligence",
    "IraqiRateLimitHandler",
    
    # RAG agent specialization
    "IraqiRagAgent",
    "IraqiRagDependencies",
    "IraqiRagQueryResult",
    
    # Agent factory and management
    "IraqiAgentFactory",
    "IraqiAgentConfiguration",
    "IraqiAgentInstance",
    "IraqiAgentType", 
    "IraqiProfessionalDomain",
    "iraqi_agent_factory",
    
    # Convenience functions
    "create_iraqi_rag_agent",
    "get_iraqi_agent", 
    "execute_iraqi_agent",
    
    # Constants and metadata
    "QUALITY_STANDARDS",
    "PROFESSIONAL_DOMAINS",
    "__version__",
    "__author__",
    "__description__"
]

# Initialization logging
import logging
logger = logging.getLogger(__name__)
logger.info(f"✓ Iraqi AI Agent System v{__version__} initialized")
logger.info(f"✓ Cultural compliance threshold: {QUALITY_STANDARDS['cultural_compliance_threshold']:.1%}")
logger.info(f"✓ Islamic compliance threshold: {QUALITY_STANDARDS['islamic_compliance_threshold']:.1%}")
logger.info(f"✓ Arabic processing accuracy target: {QUALITY_STANDARDS['arabic_processing_accuracy']:.1%}")
logger.info(f"✓ Professional domains supported: {len(PROFESSIONAL_DOMAINS)}")

# System health check
def get_system_health() -> dict:
    """
    Get system health status for Iraqi AI Agent System.
    
    Returns:
        Dictionary with system health metrics
    """
    return {
        "system_version": __version__,
        "cultural_intelligence_enabled": True,
        "arabic_processing_enabled": True,
        "professional_domains_count": len(PROFESSIONAL_DOMAINS),
        "quality_standards": QUALITY_STANDARDS,
        "factory_active": iraqi_agent_factory is not None,
        "system_status": "healthy"
    }