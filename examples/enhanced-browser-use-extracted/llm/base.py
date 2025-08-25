"""
Enhanced base chat model protocol with Iraqi AI integration.
Extracted from browser-use with cultural validation support.
"""

from typing import Any, Protocol, TypeVar, overload, runtime_checkable

from pydantic import BaseModel

from .messages import BaseMessage
from .views import ChatInvokeCompletion

T = TypeVar('T', bound=BaseModel)


@runtime_checkable
class BaseChatModel(Protocol):
    """
    Base protocol for chat models with Iraqi AI enhancements.
    
    Provides a unified interface for all LLM providers while supporting
    Iraqi cultural validation, Arabic RTL processing, and Islamic compliance.
    """
    _verified_api_keys: bool = False
    
    # Iraqi AI specific attributes
    _cultural_validation_enabled: bool = False
    _arabic_rtl_support: bool = False
    _islamic_compliance_mode: bool = False
    
    model: str

    @property
    def provider(self) -> str:
        """Return the provider name (e.g., 'openai', 'anthropic')."""
        ...

    @property
    def name(self) -> str:
        """Return the model name."""
        ...

    @property
    def model_name(self) -> str:
        """Legacy support for model name access."""
        return self.model

    # Iraqi AI enhancement methods
    def enable_cultural_validation(self) -> None:
        """Enable Iraqi cultural validation for all interactions."""
        self._cultural_validation_enabled = True

    def enable_arabic_rtl_support(self) -> None:
        """Enable Arabic RTL text processing support."""
        self._arabic_rtl_support = True

    def enable_islamic_compliance_mode(self) -> None:
        """Enable Islamic compliance mode for content filtering."""
        self._islamic_compliance_mode = True

    @overload
    async def ainvoke(self, messages: list[BaseMessage], output_format: None = None) -> ChatInvokeCompletion[str]:
        ...

    @overload
    async def ainvoke(self, messages: list[BaseMessage], output_format: type[T]) -> ChatInvokeCompletion[T]:
        ...

    async def ainvoke(
        self, messages: list[BaseMessage], output_format: type[T] | None = None
    ) -> ChatInvokeCompletion[T] | ChatInvokeCompletion[str]:
        """
        Invoke the model with the given messages.
        
        Enhanced with Iraqi AI cultural validation and Arabic processing.
        
        Args:
            messages: List of chat messages
            output_format: Optional Pydantic model class for structured output
            
        Returns:
            Either a string response or an instance of output_format
        """
        ...

    @classmethod
    def __get_pydantic_core_schema__(
        cls,
        source_type: type,
        handler: Any,
    ) -> Any:
        """
        Allow this Protocol to be used in Pydantic models.
        Returns a schema that allows any object (since this is a Protocol).
        """
        from pydantic_core import core_schema

        return core_schema.any_schema()


class IraqiChatModelMixin:
    """
    Mixin class providing Iraqi AI enhancements for chat models.
    
    Adds cultural validation, Arabic RTL processing, and Islamic compliance
    to any chat model implementation.
    """
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._cultural_validation_enabled = kwargs.get('cultural_validation', False)
        self._arabic_rtl_support = kwargs.get('arabic_rtl_support', True)
        self._islamic_compliance_mode = kwargs.get('islamic_compliance', True)
    
    async def _validate_cultural_appropriateness(self, content: str) -> tuple[bool, str]:
        """
        Validate content for Iraqi cultural appropriateness.
        
        Args:
            content: Content to validate
            
        Returns:
            Tuple of (is_appropriate, validation_message)
        """
        if not self._cultural_validation_enabled:
            return True, "Cultural validation disabled"
        
        # Enhanced validation would integrate with iraqi-cultural-validator agent
        # For now, provide basic validation
        inappropriate_patterns = [
            'sectarian content',
            'political bias',
            'cultural insensitivity'
        ]
        
        content_lower = content.lower()
        for pattern in inappropriate_patterns:
            if pattern in content_lower:
                return False, f"Content contains {pattern}"
        
        return True, "Content culturally appropriate"
    
    async def _process_arabic_rtl(self, text: str) -> str:
        """
        Process Arabic RTL text for proper display.
        
        Args:
            text: Text that may contain Arabic
            
        Returns:
            Processed text with proper RTL markers
        """
        if not self._arabic_rtl_support:
            return text
        
        # Enhanced processing would integrate with arabic-rtl-processor agent
        # For now, provide basic RTL detection and processing
        import re
        
        # Detect Arabic text
        arabic_pattern = r'[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]'
        has_arabic = bool(re.search(arabic_pattern, text))
        
        if has_arabic:
            # Add RTL direction marker for Arabic text
            text = f'\u202B{text}\u202C'  # RLE + text + PDF
        
        return text
    
    async def _ensure_islamic_compliance(self, content: str) -> tuple[bool, str]:
        """
        Ensure content complies with Islamic principles.
        
        Args:
            content: Content to check
            
        Returns:
            Tuple of (is_compliant, compliance_message)
        """
        if not self._islamic_compliance_mode:
            return True, "Islamic compliance checking disabled"
        
        # Enhanced compliance would integrate with cultural validation
        # For now, provide basic compliance check
        non_compliant_patterns = [
            'gambling',
            'alcohol promotion',
            'inappropriate content'
        ]
        
        content_lower = content.lower()
        for pattern in non_compliant_patterns:
            if pattern in content_lower:
                return False, f"Content violates Islamic principles: {pattern}"
        
        return True, "Content compliant with Islamic principles"