"""
Base LLM Provider - Abstract interface for all LLM providers
Supports Arabic language processing and cultural context
"""

import logging
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any, Union, AsyncGenerator
from enum import Enum
import json
import time

logger = logging.getLogger(__name__)


class LLMProviderType(Enum):
    """Supported LLM provider types"""

    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    GOOGLE = "google"
    AZURE = "azure"
    COHERE = "cohere"
    OLLAMA = "ollama"
    HUGGINGFACE = "huggingface"
    LOCAL = "local"


class MessageRole(Enum):
    """Message roles in conversation"""

    SYSTEM = "system"
    USER = "user"
    ASSISTANT = "assistant"
    FUNCTION = "function"


@dataclass
class LLMMessage:
    """LLM conversation message"""

    role: MessageRole
    content: str
    metadata: Dict[str, Any] = field(default_factory=dict)
    timestamp: float = field(default_factory=time.time)
    language: str = "en"
    cultural_context: Optional[str] = None


@dataclass
class LLMConfig:
    """Configuration for LLM provider"""

    provider_type: LLMProviderType
    model_name: str
    api_key: str = ""
    api_url: str = ""
    max_tokens: int = 4000
    temperature: float = 0.7
    top_p: float = 1.0
    frequency_penalty: float = 0.0
    presence_penalty: float = 0.0
    timeout: int = 60

    # Arabic and cultural settings
    arabic_support: bool = True
    cultural_context: str = "iraqi"
    rtl_awareness: bool = True
    islamic_compliance: bool = True

    # Performance settings
    streaming: bool = False
    cache_responses: bool = True
    retry_attempts: int = 3

    # Security settings
    content_filtering: bool = True
    privacy_mode: bool = True


@dataclass
class LLMResponse:
    """Response from LLM provider"""

    content: str
    provider: LLMProviderType
    model: str
    tokens_used: int = 0
    response_time: float = 0.0
    success: bool = True
    error: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)

    # Arabic-specific fields
    detected_language: str = "en"
    contains_arabic: bool = False
    cultural_appropriateness: float = 1.0
    islamic_compliance_score: float = 1.0


class LLMProvider(ABC):
    """
    Abstract base class for all LLM providers
    Provides consistent interface for browser automation tasks
    """

    def __init__(self, config: LLMConfig):
        self.config = config
        self.provider_type = config.provider_type
        self.conversation_history: List[LLMMessage] = []
        self.total_tokens_used = 0
        self.request_count = 0

    @abstractmethod
    async def generate_response(self, messages: List[LLMMessage]) -> LLMResponse:
        """Generate response from LLM"""
        pass

    @abstractmethod
    async def generate_streaming_response(
        self, messages: List[LLMMessage]
    ) -> AsyncGenerator[str, None]:
        """Generate streaming response from LLM"""
        pass

    async def chat(
        self,
        message: str,
        system_prompt: Optional[str] = None,
        cultural_context: Optional[str] = None,
    ) -> LLMResponse:
        """Simple chat interface"""
        try:
            messages = []

            # Add system prompt
            if system_prompt:
                messages.append(
                    LLMMessage(
                        role=MessageRole.SYSTEM,
                        content=system_prompt,
                        cultural_context=cultural_context
                        or self.config.cultural_context,
                    )
                )

            # Add user message
            messages.append(
                LLMMessage(
                    role=MessageRole.USER,
                    content=message,
                    language=self._detect_language(message),
                    cultural_context=cultural_context or self.config.cultural_context,
                )
            )

            # Generate response
            response = await self.generate_response(messages)

            # Update conversation history
            self.conversation_history.extend(messages)
            if response.success:
                self.conversation_history.append(
                    LLMMessage(
                        role=MessageRole.ASSISTANT,
                        content=response.content,
                        language=response.detected_language,
                    )
                )

            # Update statistics
            self.total_tokens_used += response.tokens_used
            self.request_count += 1

            return response

        except Exception as e:
            logger.error(f"Chat failed: {e}")
            return LLMResponse(
                content="",
                provider=self.provider_type,
                model=self.config.model_name,
                success=False,
                error=str(e),
            )

    async def analyze_webpage(
        self, page_content: str, task_description: str
    ) -> LLMResponse:
        """Analyze webpage content for automation tasks"""
        system_prompt = """You are an expert web automation assistant with deep knowledge of Iraqi government portals and Arabic web interfaces. 

Your responsibilities:
1. Analyze web page content and structure
2. Identify interactive elements and forms
3. Understand Arabic text and RTL layouts
4. Respect Iraqi cultural context and Islamic values
5. Provide actionable automation instructions

Focus on:
- Form fields and their Arabic labels
- Navigation elements and buttons
- Government portal patterns
- Cultural appropriateness
- Security considerations"""

        user_message = f"""
Task: {task_description}

Page Content:
{page_content[:8000]}  # Limit content length

Please analyze this webpage and provide:
1. Page type and purpose
2. Key interactive elements
3. Form fields and their mappings
4. Recommended automation strategy
5. Cultural considerations
6. Potential issues or warnings

Respond in a structured format suitable for automation processing.
"""

        return await self.chat(
            message=user_message,
            system_prompt=system_prompt,
            cultural_context="iraqi_government",
        )

    async def generate_form_strategy(
        self, form_analysis: Dict[str, Any]
    ) -> LLMResponse:
        """Generate strategy for filling Iraqi government forms"""
        system_prompt = """You are an expert in Iraqi government forms and procedures. You understand:

1. Iraqi data formats (national ID, passport, phone numbers)
2. Arabic form labels and field types
3. Government portal workflows
4. Required documentation and validation
5. Cultural and religious considerations

Provide practical, step-by-step form filling strategies that respect Iraqi customs and regulations."""

        user_message = f"""
Form Analysis:
{json.dumps(form_analysis, indent=2, ensure_ascii=False)}

Please provide:
1. Form type identification
2. Required vs optional fields
3. Data validation requirements
4. Filling sequence and dependencies
5. Common errors to avoid
6. Cultural considerations
7. Success indicators

Format your response as actionable automation instructions.
"""

        return await self.chat(
            message=user_message,
            system_prompt=system_prompt,
            cultural_context="iraqi_government",
        )

    async def translate_content(
        self, content: str, target_language: str = "ar"
    ) -> LLMResponse:
        """Translate content with cultural awareness"""
        system_prompt = f"""You are an expert translator specializing in Iraqi Arabic and government terminology. 

Guidelines:
1. Maintain cultural appropriateness for Iraqi context
2. Use formal Arabic for government documents
3. Preserve technical terms and proper nouns
4. Respect Islamic values and customs
5. Ensure natural, idiomatic translation

Target language: {target_language}
Context: Iraqi government and citizen services
"""

        user_message = f"Please translate the following content:\n\n{content}"

        return await self.chat(
            message=user_message,
            system_prompt=system_prompt,
            cultural_context="iraqi_translation",
        )

    def add_to_conversation(self, message: LLMMessage) -> None:
        """Add message to conversation history"""
        self.conversation_history.append(message)

    def clear_conversation(self) -> None:
        """Clear conversation history"""
        self.conversation_history.clear()

    def get_conversation_summary(self) -> Dict[str, Any]:
        """Get conversation statistics and summary"""
        return {
            "total_messages": len(self.conversation_history),
            "total_tokens_used": self.total_tokens_used,
            "request_count": self.request_count,
            "provider": self.provider_type.value,
            "model": self.config.model_name,
            "arabic_messages": sum(
                1
                for msg in self.conversation_history
                if self._contains_arabic(msg.content)
            ),
            "average_response_time": self._calculate_avg_response_time(),
        }

    def _detect_language(self, text: str) -> str:
        """Detect language of text"""
        import re

        arabic_pattern = re.compile(r"[\u0600-\u06FF]")

        if arabic_pattern.search(text):
            return "ar"
        else:
            return "en"

    def _contains_arabic(self, text: str) -> bool:
        """Check if text contains Arabic characters"""
        import re

        arabic_pattern = re.compile(r"[\u0600-\u06FF]")
        return bool(arabic_pattern.search(text))

    def _calculate_avg_response_time(self) -> float:
        """Calculate average response time"""
        # This would be implemented based on stored timing data
        return 0.0

    def _validate_cultural_content(self, content: str) -> Tuple[bool, float]:
        """Validate content for cultural appropriateness"""
        # Basic implementation - would be enhanced with more sophisticated checking
        inappropriate_terms = [
            # Add terms that should be avoided in Iraqi context
        ]

        score = 1.0
        is_appropriate = True

        content_lower = content.lower()
        for term in inappropriate_terms:
            if term in content_lower:
                score -= 0.2
                is_appropriate = False

        return is_appropriate, max(0.0, score)

    def _validate_islamic_compliance(self, content: str) -> float:
        """Validate content for Islamic compliance"""
        # Basic implementation - would be enhanced with proper Islamic content validation
        positive_terms = ["إن شاء الله", "الحمد لله", "بإذن الله"]
        negative_terms = []  # Terms that violate Islamic principles

        score = 0.8  # Base score

        content_lower = content.lower()
        for term in positive_terms:
            if term in content_lower:
                score += 0.05

        for term in negative_terms:
            if term in content_lower:
                score -= 0.3

        return min(1.0, max(0.0, score))


class MockLLMProvider(LLMProvider):
    """Mock provider for testing"""

    def __init__(self, config: LLMConfig):
        super().__init__(config)

    async def generate_response(self, messages: List[LLMMessage]) -> LLMResponse:
        """Generate mock response"""
        last_message = messages[-1] if messages else None

        if last_message:
            content = f"Mock response to: {last_message.content[:100]}..."
            contains_arabic = self._contains_arabic(last_message.content)
        else:
            content = "Mock response"
            contains_arabic = False

        return LLMResponse(
            content=content,
            provider=self.provider_type,
            model=self.config.model_name,
            tokens_used=50,
            response_time=0.1,
            success=True,
            detected_language="ar" if contains_arabic else "en",
            contains_arabic=contains_arabic,
            cultural_appropriateness=1.0,
            islamic_compliance_score=1.0,
        )

    async def generate_streaming_response(
        self, messages: List[LLMMessage]
    ) -> AsyncGenerator[str, None]:
        """Generate mock streaming response"""
        response = await self.generate_response(messages)
        words = response.content.split()

        for word in words:
            yield word + " "
            await asyncio.sleep(0.1)  # Simulate streaming delay
