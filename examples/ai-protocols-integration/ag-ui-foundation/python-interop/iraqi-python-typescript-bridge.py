"""
Iraqi Enhanced AG-UI Python-TypeScript Bridge
Extracted from AG-UI python-sdk/ag_ui/core/types.py
Enhanced with Iraqi cultural context and cross-language interoperability
"""

from typing import Annotated, Any, List, Literal, Optional, Union, Dict
from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel
from datetime import datetime
from enum import Enum


class IraqiConfiguredBaseModel(BaseModel):
    """
    Iraqi enhanced configurable base model with cultural context support.
    """
    model_config = ConfigDict(
        extra="forbid",
        alias_generator=to_camel,
        populate_by_name=True,
        # Support for Arabic field names
        str_strip_whitespace=True,
        validate_assignment=True
    )


class CulturalContext(IraqiConfiguredBaseModel):
    """
    Cultural context for Iraqi AI system integration.
    """
    cultural_validation: bool = True
    islamic_compliance: bool = True
    arabic_support: bool = False
    rtl_layout: bool = False
    dialect_support: Literal["iraqi", "standard", "mixed"] = "iraqi"
    professional_domain: Optional[Literal[
        "legal", "medical", "educational", "business", 
        "government", "technology", "finance", "general"
    ]] = None
    cultural_score: float = Field(default=85.0, ge=0, le=100)
    islamic_score: float = Field(default=90.0, ge=0, le=100)


class IraqiLanguageEnum(str, Enum):
    """Language options for Iraqi system."""
    ARABIC = "arabic"
    ENGLISH = "english"
    KURDISH = "kurdish"
    MIXED = "mixed"


class IraqiDialectEnum(str, Enum):
    """Iraqi dialect variations."""
    IRAQI = "iraqi"
    STANDARD = "standard"
    GULF = "gulf"
    LEVANTINE = "levantine"
    MAGHREBI = "maghrebi"
    EGYPTIAN = "egyptian"


class IraqiFunctionCall(IraqiConfiguredBaseModel):
    """
    Enhanced function call with cultural validation.
    """
    name: str
    arguments: str
    cultural_context: Optional[CulturalContext] = None
    language: IraqiLanguageEnum = IraqiLanguageEnum.ENGLISH
    requires_cultural_validation: bool = False
    requires_islamic_compliance: bool = False


class IraqiToolCall(IraqiConfiguredBaseModel):
    """
    Enhanced tool call with Iraqi cultural intelligence.
    """
    id: str
    type: Literal["function"] = "function"
    function: IraqiFunctionCall
    cultural_context: Optional[CulturalContext] = None
    processing_time: Optional[float] = None
    cultural_validation_result: Optional[Dict[str, Any]] = None
    islamic_compliance_result: Optional[Dict[str, Any]] = None


class IraqiBaseMessage(IraqiConfiguredBaseModel):
    """
    Enhanced base message with Iraqi cultural support.
    """
    id: str
    role: str
    content: Optional[str] = None
    content_arabic: Optional[str] = None  # Arabic translation
    name: Optional[str] = None
    cultural_context: Optional[CulturalContext] = None
    language: IraqiLanguageEnum = IraqiLanguageEnum.ENGLISH
    dialect: IraqiDialectEnum = IraqiDialectEnum.IRAQI
    rtl_layout: bool = False
    timestamp: Optional[datetime] = None
    cultural_score: Optional[float] = None
    islamic_compliance_score: Optional[float] = None


class IraqiDeveloperMessage(IraqiBaseMessage):
    """
    Developer message with Iraqi enhancements.
    """
    role: Literal["developer"] = "developer"
    content: str
    cultural_guidance: Optional[str] = None
    islamic_compliance_notes: Optional[str] = None


class IraqiSystemMessage(IraqiBaseMessage):
    """
    System message with cultural context integration.
    """
    role: Literal["system"] = "system"
    content: str
    cultural_instructions: Optional[str] = None
    islamic_guidelines: Optional[str] = None
    professional_domain_context: Optional[str] = None


class IraqiAssistantMessage(IraqiBaseMessage):
    """
    Assistant message with Iraqi cultural intelligence.
    """
    role: Literal["assistant"] = "assistant"
    tool_calls: Optional[List[IraqiToolCall]] = None
    cultural_appropriateness_check: Optional[bool] = None
    islamic_compliance_verified: Optional[bool] = None
    professional_domain_validated: Optional[bool] = None
    response_confidence: Optional[float] = None


class IraqiUserMessage(IraqiBaseMessage):
    """
    User message with language detection and cultural context.
    """
    role: Literal["user"] = "user"
    content: str
    detected_language: Optional[IraqiLanguageEnum] = None
    detected_dialect: Optional[IraqiDialectEnum] = None
    cultural_sensitivity_required: bool = False
    professional_domain_query: Optional[str] = None


class IraqiToolMessage(IraqiConfiguredBaseModel):
    """
    Enhanced tool result message with cultural validation results.
    """
    id: str
    role: Literal["tool"] = "tool"
    content: str
    content_arabic: Optional[str] = None
    tool_call_id: str
    error: Optional[str] = None
    cultural_validation_passed: Optional[bool] = None
    islamic_compliance_passed: Optional[bool] = None
    processing_time: Optional[float] = None
    cultural_enhancement_applied: Optional[bool] = None


# Union type for all Iraqi enhanced messages
IraqiMessage = Annotated[
    Union[
        IraqiDeveloperMessage, 
        IraqiSystemMessage, 
        IraqiAssistantMessage, 
        IraqiUserMessage, 
        IraqiToolMessage
    ],
    Field(discriminator="role")
]

IraqiRole = Literal["developer", "system", "assistant", "user", "tool"]


class IraqiContext(IraqiConfiguredBaseModel):
    """
    Enhanced context with Iraqi professional domain support.
    """
    description: str
    description_arabic: Optional[str] = None
    value: str
    value_arabic: Optional[str] = None
    cultural_context: Optional[CulturalContext] = None
    professional_domain: Optional[str] = None
    language: IraqiLanguageEnum = IraqiLanguageEnum.ENGLISH
    rtl_layout: bool = False


class IraqiTool(IraqiConfiguredBaseModel):
    """
    Enhanced tool definition with cultural validation capabilities.
    """
    name: str
    name_arabic: Optional[str] = None
    description: str
    description_arabic: Optional[str] = None
    parameters: Any  # JSON Schema for the tool parameters
    cultural_validation_required: bool = False
    islamic_compliance_required: bool = False
    professional_domain_specific: Optional[str] = None
    supported_languages: List[IraqiLanguageEnum] = [IraqiLanguageEnum.ENGLISH]
    rtl_support: bool = False


class IraqiAgentCapabilities(IraqiConfiguredBaseModel):
    """
    Agent capabilities with Iraqi specializations.
    """
    cultural_validation: bool = False
    arabic_processing: bool = False
    islamic_compliance: bool = False
    professional_domain_expertise: Optional[List[str]] = None
    rtl_layout_support: bool = False
    dialect_recognition: bool = False
    cross_language_support: bool = False
    payment_gateway_integration: bool = False
    security_compliance: bool = False


class IraqiRunAgentInput(IraqiConfiguredBaseModel):
    """
    Enhanced agent input with Iraqi cultural intelligence integration.
    """
    thread_id: str
    run_id: str
    state: Any
    messages: List[IraqiMessage]
    tools: List[IraqiTool]
    context: List[IraqiContext]
    forwarded_props: Any
    
    # Iraqi enhancements
    cultural_context: Optional[CulturalContext] = None
    agent_capabilities: Optional[IraqiAgentCapabilities] = None
    preferred_language: IraqiLanguageEnum = IraqiLanguageEnum.ENGLISH
    preferred_dialect: IraqiDialectEnum = IraqiDialectEnum.IRAQI
    rtl_layout_enabled: bool = False
    professional_domain_active: Optional[str] = None
    cultural_validation_strict_mode: bool = False
    islamic_compliance_strict_mode: bool = True
    performance_monitoring_enabled: bool = True


class IraqiAgentResponse(IraqiConfiguredBaseModel):
    """
    Enhanced agent response with cultural validation results.
    """
    response: str
    response_arabic: Optional[str] = None
    cultural_validation_result: Optional[Dict[str, Any]] = None
    islamic_compliance_result: Optional[Dict[str, Any]] = None
    professional_domain_validation: Optional[Dict[str, Any]] = None
    processing_metrics: Optional[Dict[str, float]] = None
    language_used: IraqiLanguageEnum = IraqiLanguageEnum.ENGLISH
    dialect_used: IraqiDialectEnum = IraqiDialectEnum.IRAQI
    rtl_formatted: bool = False
    confidence_score: float = Field(default=0.85, ge=0, le=1)
    cultural_appropriateness_score: float = Field(default=85.0, ge=0, le=100)
    islamic_compliance_score: float = Field(default=90.0, ge=0, le=100)
    recommendations: Optional[List[str]] = None
    warnings: Optional[List[str]] = None


class IraqiPythonTypescriptBridge:
    """
    Bridge class for Python-TypeScript interoperability in Iraqi AI system.
    """
    
    @staticmethod
    def convert_message_to_typescript_format(message: IraqiMessage) -> Dict[str, Any]:
        """
        Convert Python message to TypeScript-compatible format.
        """
        result = message.model_dump(by_alias=True)
        
        # Add TypeScript-specific enhancements
        result['__type'] = 'IraqiMessage'
        result['__culturalContext'] = message.cultural_context.model_dump() if message.cultural_context else None
        
        return result
    
    @staticmethod
    def convert_tool_result_to_typescript(tool_result: IraqiToolMessage) -> Dict[str, Any]:
        """
        Convert tool result to TypeScript format with cultural validation.
        """
        result = tool_result.model_dump(by_alias=True)
        result['__type'] = 'IraqiToolResult'
        
        return result
    
    @staticmethod
    def create_cultural_context_payload(
        cultural_validation: bool = True,
        islamic_compliance: bool = True,
        arabic_support: bool = False,
        professional_domain: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Create cultural context payload for TypeScript integration.
        """
        context = CulturalContext(
            cultural_validation=cultural_validation,
            islamic_compliance=islamic_compliance,
            arabic_support=arabic_support,
            professional_domain=professional_domain
        )
        
        return {
            '__type': 'CulturalContext',
            **context.model_dump(by_alias=True)
        }
    
    @staticmethod
    def validate_typescript_message_format(data: Dict[str, Any]) -> bool:
        """
        Validate that incoming TypeScript data matches expected Iraqi message format.
        """
        required_fields = ['id', 'role', 'content']
        has_required = all(field in data for field in required_fields)
        
        # Validate cultural context if present
        if 'culturalContext' in data and data['culturalContext']:
            cultural_required = ['culturalValidation', 'islamicCompliance']
            has_cultural = all(field in data['culturalContext'] for field in cultural_required)
            return has_required and has_cultural
        
        return has_required


# State management with cultural context
IraqiState = Any

# Export types for TypeScript generation
__all__ = [
    'IraqiMessage',
    'IraqiRole', 
    'IraqiContext',
    'IraqiTool',
    'IraqiRunAgentInput',
    'IraqiAgentResponse',
    'CulturalContext',
    'IraqiLanguageEnum',
    'IraqiDialectEnum',
    'IraqiPythonTypescriptBridge',
    'IraqiState'
]