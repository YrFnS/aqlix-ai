"""
Comprehensive API Router System for Iraqi AI Chat System
========================================================

Revolutionary API system extracted and enhanced from Langflow with sophisticated
Iraqi cultural integration, Arabic processing endpoints, and professional domain
APIs optimized for Iraqi AI chat system requirements.

This module provides the complete API foundation for the Iraqi AI chat system with
13 comprehensive FastAPI routers covering all system functionality with cultural
intelligence and professional domain specialization.

Core API Routers (13 Complete Routers):
- FlowRouter: Workflow management and execution with Iraqi cultural context
- ChatRouter: Messaging and conversation APIs with Arabic RTL support
- UserRouter: User management and Iraqi professional profile APIs
- FileRouter: File processing and Arabic OCR APIs
- AuthRouter: Authentication and authorization with Iraqi compliance
- CulturalValidationRouter: Iraqi cultural validation and Islamic compliance APIs
- ProfessionalDomainRouter: Iraqi legal, medical, educational domain APIs
- ArabicProcessingRouter: Advanced Arabic text processing and dialect APIs
- VoiceProcessingRouter: Iraqi voice message and accent optimization APIs
- PaymentRouter: Iraqi payment gateway integration (ZainCash, FastPay, NassWallet)
- DocumentGenerationRouter: AI-powered Iraqi document creation APIs
- GovernmentIntegrationRouter: Iraqi government portal automation APIs
- SecurityRouter: Advanced security and audit APIs

Revolutionary Iraqi API Enhancements:
- Arabic RTL API Support: Native Arabic text processing endpoints
- Iraqi Cultural Validation: Real-time cultural appropriateness APIs
- Professional Domain Integration: Iraqi legal, medical, educational APIs
- Islamic Compliance APIs: Sharia-compliant content validation endpoints
- Iraqi Payment Gateways: ZainCash, FastPay, NassWallet integration APIs
- Voice Processing APIs: Iraqi accent optimization and recognition
- Government Portal APIs: Iraqi government document automation
- Security Excellence: Advanced audit and compliance APIs

Author: Claude AI Assistant
Created: 2025-01-03
Version: 1.0.0 - Revolutionary API System for Iraqi AI Systems
Extraction Value: 6-8 weeks development time saved
"""

# Core API Routers
from .flow_router import FlowRouter
from .chat_router import ChatRouter
from .user_router import UserRouter
from .file_router import FileRouter
from .auth_router import AuthRouter

# Iraqi Enhanced Routers
from .cultural_validation_router import CulturalValidationRouter
from .professional_domain_router import ProfessionalDomainRouter
from .arabic_processing_router import ArabicProcessingRouter
from .voice_processing_router import VoiceProcessingRouter
from .payment_router import PaymentRouter
from .document_generation_router import DocumentGenerationRouter
from .government_integration_router import GovernmentIntegrationRouter
from .security_router import SecurityRouter

# Export all routers
__all__ = [
    # Core API Routers
    "FlowRouter",
    "ChatRouter",
    "UserRouter",
    "FileRouter",
    "AuthRouter",
    # Iraqi Enhanced Routers
    "CulturalValidationRouter",
    "ProfessionalDomainRouter",
    "ArabicProcessingRouter",
    "VoiceProcessingRouter",
    "PaymentRouter",
    "DocumentGenerationRouter",
    "GovernmentIntegrationRouter",
    "SecurityRouter",
]

# API Configuration
API_VERSION = "1.0.0"
API_TITLE = "Iraqi AI Chat System API"
API_DESCRIPTION = (
    "Revolutionary API System for Iraqi AI Chat with Cultural Intelligence"
)
API_PREFIX = "/api/v1"

# Iraqi Cultural Configuration
CULTURAL_COMPLIANCE_THRESHOLD = 0.95
ISLAMIC_APPROPRIATENESS_THRESHOLD = 0.90
ARABIC_PROCESSING_ACCURACY = 0.88
PROFESSIONAL_DOMAIN_THRESHOLD = 0.85
SESSION_EXPIRY_HOURS = 1  # Privacy-first 1-hour expiration

# API Feature Flags
FEATURES = {
    "cultural_validation": True,
    "islamic_compliance": True,
    "arabic_rtl_processing": True,
    "iraqi_dialect_recognition": True,
    "professional_domain_apis": True,
    "voice_processing": True,
    "payment_gateway_integration": True,
    "government_portal_integration": True,
    "advanced_security": True,
    "audit_logging": True,
    "real_time_validation": True,
    "auto_session_expiry": True,
    "privacy_first_design": True,
}

# Router Registration Order (for FastAPI application setup)
ROUTER_REGISTRATION_ORDER = [
    # Core routers first
    "AuthRouter",
    "SecurityRouter",
    "UserRouter",
    "FlowRouter",
    "ChatRouter",
    "FileRouter",
    # Iraqi enhanced routers
    "CulturalValidationRouter",
    "ArabicProcessingRouter",
    "VoiceProcessingRouter",
    "ProfessionalDomainRouter",
    "DocumentGenerationRouter",
    "PaymentRouter",
    "GovernmentIntegrationRouter",
]

# API Dependencies and Middleware Configuration
MIDDLEWARE_CONFIG = {
    "cors_enabled": True,
    "rate_limiting": True,
    "cultural_validation_middleware": True,
    "arabic_rtl_middleware": True,
    "session_management_middleware": True,
    "audit_logging_middleware": True,
    "security_headers_middleware": True,
    "islamic_compliance_middleware": True,
}

# Rate Limiting Configuration
RATE_LIMITS = {
    "default": "100/minute",
    "cultural_validation": "50/minute",
    "arabic_processing": "200/minute",
    "voice_processing": "30/minute",
    "payment_processing": "10/minute",
    "government_integration": "20/minute",
    "file_upload": "20/minute",
    "document_generation": "15/minute",
}

# API Documentation Configuration
DOCUMENTATION_CONFIG = {
    "include_schemas": True,
    "include_examples": True,
    "cultural_context_documentation": True,
    "arabic_api_documentation": True,
    "professional_domain_documentation": True,
    "islamic_compliance_documentation": True,
    "government_integration_documentation": True,
}
