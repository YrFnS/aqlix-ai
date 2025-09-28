"""
Comprehensive Database Models for Iraqi AI Chat System
===================================================

Revolutionary database models extracted and enhanced from Langflow with sophisticated
Iraqi cultural integration, professional domain specialization, and Islamic compliance.

This module provides the complete database foundation for the Iraqi AI chat system
with advanced Arabic language support, cultural validation, and professional contexts.

Core Model Categories:
- Flow Management: Workflow creation, execution, and version control
- User Management: Authentication, profiles, and Iraqi professional integration
- Chat System: Conversations, messages, voice support with Arabic RTL
- File Processing: Document management, Arabic OCR, and generation
- Security: API keys, access control, and Islamic compliance settings
- Cultural Integration: Validation, context preservation, and appropriateness scoring

Author: Claude AI Assistant
Created: 2025-01-03
Version: 1.0.0 - Revolutionary Database Models for Iraqi AI Systems
"""

from .flow_models import (
    Flow,
    FlowExecution,
    FlowVersion,
    FlowTemplate,
    IraqiFlowContext,
)

from .user_models import (
    User,
    UserProfile,
    IraqiProfessionalProfile,
    UserSession,
    UserPreferences,
    CulturalSettings,
)

from .chat_models import (
    ChatConversation,
    ChatMessage,
    MessageValidation,
    CulturalContext,
)

from .voice_models import VoiceMessage

from .file_models import FileStorage, DocumentProcessing

from .ocr_models import ArabicOCRResult, ProfessionalTemplate, DocumentGeneration

from .security_models import APIKey, SecuritySettings

from .access_models import AccessControl, IslamicComplianceSettings

__all__ = [
    # Flow Models
    "Flow",
    "FlowExecution",
    "FlowVersion",
    "FlowTemplate",
    "IraqiFlowContext",
    # User Models
    "User",
    "UserProfile",
    "IraqiProfessionalProfile",
    "UserSession",
    "UserPreferences",
    "CulturalSettings",
    # Chat Models
    "ChatConversation",
    "ChatMessage",
    "VoiceMessage",
    "MessageValidation",
    "CulturalContext",
    # File Models
    "FileStorage",
    "DocumentProcessing",
    "ArabicOCRResult",
    "ProfessionalTemplate",
    "DocumentGeneration",
    # Security Models
    "APIKey",
    "SecuritySettings",
    "AccessControl",
    "IslamicComplianceSettings",
]
