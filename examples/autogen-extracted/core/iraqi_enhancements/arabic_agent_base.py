"""
Arabic-Enabled AutoGen Agent Base Class

Extends AutoGen's BaseAgent with Arabic language processing,
RTL support, and Iraqi dialect handling for multi-agent systems.
"""

from typing import Any, Dict, List, Optional, Sequence, Union
from abc import abstractmethod
import asyncio
from dataclasses import dataclass
from enum import Enum

from autogen_core import BaseAgent, MessageContext, CancellationToken
from autogen_core.models import LLMMessage

from .cultural_validator import (
    IraqiCulturalValidator,
    ProfessionalDomain,
    CulturalValidationResult,
)


class LanguageMode(Enum):
    """Language modes for Arabic processing"""

    ARABIC_ONLY = "arabic_only"
    ENGLISH_ONLY = "english_only"
    MIXED = "mixed"
    AUTO_DETECT = "auto_detect"


class DialectSupport(Enum):
    """Arabic dialect support levels"""

    IRAQI_DIALECT = "iraqi_dialect"
    STANDARD_ARABIC = "standard_arabic"
    MIXED_ARABIC = "mixed_arabic"


@dataclass
class ArabicProcessingConfig:
    """Configuration for Arabic language processing"""

    language_mode: LanguageMode = LanguageMode.AUTO_DETECT
    dialect_support: DialectSupport = DialectSupport.IRAQI_DIALECT
    rtl_support: bool = True
    cultural_validation: bool = True
    professional_domain: ProfessionalDomain = ProfessionalDomain.GENERAL
    preserve_english_terms: bool = True  # Keep technical English terms
    cultural_greetings: bool = True  # Auto-add appropriate greetings
    hierarchy_respect: bool = True  # Enforce hierarchy respect


class ArabicAgentBase(BaseAgent):
    """
    Base class for Arabic-enabled AutoGen agents with Iraqi cultural context

    Provides:
    - Arabic text processing and RTL support
    - Iraqi dialect recognition and handling
    - Cultural validation and Islamic compliance
    - Professional hierarchy respect patterns
    - Mixed Arabic-English content processing
    """

    def __init__(
        self,
        description: str,
        arabic_config: Optional[ArabicProcessingConfig] = None,
        cultural_validator: Optional[IraqiCulturalValidator] = None,
    ):
        super().__init__(description)

        self._arabic_config = arabic_config or ArabicProcessingConfig()
        self._cultural_validator = cultural_validator or IraqiCulturalValidator()

        # Arabic language patterns
        self._arabic_patterns = {
            "greeting_patterns": [
                "السلام عليكم",
                "صباح الخير",
                "مساء الخير",
                "أهلاً وسهلاً",
                "مرحباً",
                "شلونك",  # Iraqi greeting
            ],
            "respect_patterns": [
                "أستاذ",
                "دكتور",
                "مهندس",
                "الأستاذ المحترم",
                "سيادة الدكتور",
                "المهندس الفاضل",
            ],
            "closing_patterns": [
                "بارك الله فيك",
                "جزاك الله خيراً",
                "والله يعطيك العافية",
                "مع التقدير",
                "وفقك الله",
            ],
            "iraqi_expressions": [
                "ان شاء الله",
                "ماشاء الله",
                "الله يعطيك العافية",
                "يسلمو",
                "الله وياك",
                "عاشت ايدك",  # Iraqi expressions
            ],
        }

        # Technical terms to preserve in English
        self._preserve_english = {
            "technical_terms": [
                "API",
                "database",
                "server",
                "client",
                "framework",
                "algorithm",
                "software",
                "hardware",
                "network",
                "protocol",
            ],
            "professional_terms": [
                "management",
                "strategy",
                "analysis",
                "implementation",
                "evaluation",
                "optimization",
                "coordination",
            ],
        }

    async def on_message_impl(self, message: Any, ctx: MessageContext) -> Any:
        """
        Process incoming message with Arabic language support and cultural validation

        Args:
            message: Incoming message
            ctx: Message context

        Returns:
            Processed response with cultural validation
        """
        # Extract message content
        content = self._extract_message_content(message)

        # Detect language and process accordingly
        language_info = self._detect_language(content)

        # Apply cultural validation if enabled
        if self._arabic_config.cultural_validation:
            validation_result = await self._validate_culturally(content, ctx)
            if validation_result.requires_human_review:
                # Log or handle validation issues
                await self._handle_validation_issues(validation_result)

        # Process the message with Arabic support
        processed_content = await self._process_arabic_content(
            content, language_info, ctx
        )

        # Generate response using the derived agent's logic
        response = await self._generate_response(processed_content, ctx)

        # Post-process response for Arabic formatting and cultural appropriateness
        final_response = await self._post_process_response(response, language_info, ctx)

        return final_response

    @abstractmethod
    async def _generate_response(self, content: str, ctx: MessageContext) -> Any:
        """
        Generate response - to be implemented by derived agents

        Args:
            content: Processed content
            ctx: Message context

        Returns:
            Generated response
        """
        pass

    def _extract_message_content(self, message: Any) -> str:
        """Extract text content from various message types"""
        if isinstance(message, str):
            return message
        elif hasattr(message, "content"):
            return str(message.content)
        elif isinstance(message, dict) and "content" in message:
            return str(message["content"])
        else:
            return str(message)

    def _detect_language(self, content: str) -> Dict[str, Any]:
        """
        Detect language and dialect information

        Args:
            content: Text content to analyze

        Returns:
            Language detection information
        """
        arabic_chars = len([c for c in content if "\u0600" <= c <= "\u06ff"])
        english_chars = len([c for c in content if c.isascii() and c.isalpha()])
        total_chars = len([c for c in content if c.isalpha()])

        if total_chars == 0:
            return {"primary": "unknown", "mixed": False, "arabic_ratio": 0}

        arabic_ratio = arabic_chars / total_chars
        english_ratio = english_chars / total_chars

        # Detect Iraqi dialect markers
        iraqi_markers = [
            "شلونك",
            "اكو",
            "ماكو",
            "يلا",
            "حبيبي",
            "والله",
            "انشالله",
            "ماشالله",
        ]
        has_iraqi_dialect = any(marker in content for marker in iraqi_markers)

        # Determine primary language
        if arabic_ratio > 0.7:
            primary = "arabic"
        elif english_ratio > 0.7:
            primary = "english"
        else:
            primary = "mixed"

        return {
            "primary": primary,
            "mixed": arabic_ratio > 0.1 and english_ratio > 0.1,
            "arabic_ratio": arabic_ratio,
            "english_ratio": english_ratio,
            "has_iraqi_dialect": has_iraqi_dialect,
            "direction": "rtl" if arabic_ratio > 0.3 else "ltr",
        }

    async def _validate_culturally(
        self, content: str, ctx: MessageContext
    ) -> CulturalValidationResult:
        """
        Validate content for cultural appropriateness

        Args:
            content: Content to validate
            ctx: Message context

        Returns:
            Cultural validation result
        """
        # Extract context information
        sender_role = getattr(ctx, "sender_role", None)
        domain = self._arabic_config.professional_domain

        # Perform validation
        result = self._cultural_validator.validate_message_content(
            content=content, domain=domain, sender_role=sender_role, context={}
        )

        return result

    async def _handle_validation_issues(
        self, validation_result: CulturalValidationResult
    ):
        """
        Handle cultural validation issues

        Args:
            validation_result: Validation result with issues
        """
        if validation_result.issues:
            # Log validation issues (in a real implementation, this might be logged to a service)
            print(f"Cultural validation issues: {validation_result.issues}")
            print(f"Recommendations: {validation_result.recommendations}")

    async def _process_arabic_content(
        self, content: str, language_info: Dict[str, Any], ctx: MessageContext
    ) -> str:
        """
        Process content with Arabic language support

        Args:
            content: Original content
            language_info: Language detection information
            ctx: Message context

        Returns:
            Processed content
        """
        processed = content

        # Normalize Arabic text
        if language_info["arabic_ratio"] > 0:
            processed = self._normalize_arabic_text(processed)

        # Handle mixed content
        if language_info["mixed"]:
            processed = self._process_mixed_content(processed)

        # Add cultural context if needed
        if self._arabic_config.cultural_greetings:
            processed = self._ensure_appropriate_greeting(processed, language_info)

        return processed

    def _normalize_arabic_text(self, text: str) -> str:
        """
        Normalize Arabic text for consistent processing

        Args:
            text: Arabic text to normalize

        Returns:
            Normalized Arabic text
        """
        # Common Arabic text normalizations
        replacements = [
            ("أ", "ا"),  # Normalize alif variations
            ("إ", "ا"),
            ("آ", "ا"),
            ("ة", "ه"),  # Normalize taa marbouta
            ("ي", "ى"),  # Normalize yaa variations
        ]

        normalized = text
        for old, new in replacements:
            normalized = normalized.replace(old, new)

        return normalized

    def _process_mixed_content(self, content: str) -> str:
        """
        Process mixed Arabic-English content

        Args:
            content: Mixed content

        Returns:
            Processed mixed content
        """
        # Preserve technical English terms
        if self._arabic_config.preserve_english_terms:
            # This is a simplified approach - in practice, you'd use more sophisticated NLP
            words = content.split()
            processed_words = []

            for word in words:
                # Check if word should be preserved in English
                word_lower = word.lower().strip(".,!?")
                if (
                    word_lower in self._preserve_english["technical_terms"]
                    or word_lower in self._preserve_english["professional_terms"]
                ):
                    processed_words.append(word)  # Keep English term
                else:
                    processed_words.append(word)  # Keep as-is for now

            return " ".join(processed_words)

        return content

    def _ensure_appropriate_greeting(
        self, content: str, language_info: Dict[str, Any]
    ) -> str:
        """
        Ensure content has appropriate cultural greeting

        Args:
            content: Original content
            language_info: Language information

        Returns:
            Content with appropriate greeting
        """
        # Check if content already has greeting
        has_greeting = any(
            greeting in content
            for greeting in self._arabic_patterns["greeting_patterns"]
        )

        if not has_greeting and len(content) > 50:  # Only for substantial messages
            if language_info["primary"] == "arabic":
                greeting = "السلام عليكم ورحمة الله وبركاته"
                if language_info["has_iraqi_dialect"]:
                    greeting = "السلام عليكم، شلونك حبيبي"
                return f"{greeting}\n\n{content}"
            elif (
                language_info["primary"] == "english"
                and self._arabic_config.cultural_greetings
            ):
                return f"Peace be upon you,\n\n{content}"

        return content

    async def _post_process_response(
        self, response: Any, language_info: Dict[str, Any], ctx: MessageContext
    ) -> Any:
        """
        Post-process response for Arabic formatting and cultural appropriateness

        Args:
            response: Generated response
            language_info: Language information
            ctx: Message context

        Returns:
            Post-processed response
        """
        if isinstance(response, str):
            processed_response = response

            # Add appropriate closing if Arabic content
            if language_info["arabic_ratio"] > 0.3:
                processed_response = self._add_cultural_closing(
                    processed_response, language_info
                )

            # Format for RTL if needed
            if language_info["direction"] == "rtl" and self._arabic_config.rtl_support:
                processed_response = self._format_rtl(processed_response)

            return processed_response

        return response

    def _add_cultural_closing(self, content: str, language_info: Dict[str, Any]) -> str:
        """
        Add appropriate cultural closing to content

        Args:
            content: Original content
            language_info: Language information

        Returns:
            Content with cultural closing
        """
        # Check if already has closing
        has_closing = any(
            closing in content for closing in self._arabic_patterns["closing_patterns"]
        )

        if not has_closing:
            if language_info["has_iraqi_dialect"]:
                closing = "والله يعطيك العافية"
            else:
                closing = "بارك الله فيك"

            return f"{content}\n\n{closing}"

        return content

    def _format_rtl(self, content: str) -> str:
        """
        Format content for RTL display

        Args:
            content: Content to format

        Returns:
            RTL-formatted content
        """
        # Add RTL markers for proper text direction
        # In a real implementation, this would integrate with UI components
        return f"\u202b{content}\u202c"  # RTL embedding markers

    def get_language_capabilities(self) -> Dict[str, Any]:
        """
        Get agent's language processing capabilities

        Returns:
            Dictionary describing language capabilities
        """
        return {
            "arabic_support": True,
            "iraqi_dialect": self._arabic_config.dialect_support
            == DialectSupport.IRAQI_DIALECT,
            "rtl_support": self._arabic_config.rtl_support,
            "cultural_validation": self._arabic_config.cultural_validation,
            "mixed_language": True,
            "professional_domains": [domain.value for domain in ProfessionalDomain],
            "language_modes": [mode.value for mode in LanguageMode],
        }

    async def set_professional_domain(self, domain: ProfessionalDomain):
        """
        Set the professional domain for cultural context

        Args:
            domain: Professional domain to set
        """
        self._arabic_config.professional_domain = domain

        # Update cultural validator with domain-specific guidelines
        if self._cultural_validator:
            guidelines = self._cultural_validator.get_cultural_guidelines(domain)
            # Apply domain-specific configuration
            await self._apply_domain_guidelines(guidelines)

    async def _apply_domain_guidelines(self, guidelines: Dict[str, Any]):
        """
        Apply domain-specific cultural guidelines

        Args:
            guidelines: Cultural guidelines to apply
        """
        # Update language patterns based on domain
        if "language" in guidelines:
            required_terms = guidelines["language"].get("required", [])
            prohibited_terms = guidelines["language"].get("prohibited", [])

            # Update processing based on domain requirements
            # This is a placeholder for domain-specific configuration
            pass


class IraqiProfessionalAgent(ArabicAgentBase):
    """
    Specialized agent for Iraqi professional contexts

    Includes enhanced cultural validation, hierarchy respect,
    and domain-specific Iraqi professional patterns.
    """

    def __init__(
        self,
        description: str,
        professional_role: str,
        hierarchy_level: str,
        domain: ProfessionalDomain,
        arabic_config: Optional[ArabicProcessingConfig] = None,
    ):
        # Configure Arabic processing for professional context
        if arabic_config is None:
            arabic_config = ArabicProcessingConfig(
                professional_domain=domain,
                cultural_validation=True,
                hierarchy_respect=True,
                cultural_greetings=True,
            )

        super().__init__(description, arabic_config)

        self._professional_role = professional_role
        self._hierarchy_level = hierarchy_level
        self._domain = domain

        # Professional context patterns
        self._professional_patterns = {
            "titles": {
                "doctor": ["دكتور", "الدكتور", "د."],
                "engineer": ["مهندس", "المهندس", "م."],
                "professor": ["أستاذ", "الأستاذ", "أ.د."],
                "lawyer": ["محامي", "المحامي", "الأستاذ المحامي"],
            },
            "formal_language": [
                "نتشرف",
                "يسعدنا",
                "نقدر تعاونكم",
                "مع فائق الاحترام",
                "بكل التقدير",
            ],
        }

    async def _generate_response(self, content: str, ctx: MessageContext) -> str:
        """
        Generate professional response with Iraqi cultural context

        Args:
            content: Processed input content
            ctx: Message context

        Returns:
            Generated professional response
        """
        # This is a base implementation - derived agents would override
        # with their specific professional logic

        response_parts = []

        # Add professional greeting
        if self._should_add_formal_greeting(content):
            greeting = self._get_professional_greeting()
            response_parts.append(greeting)

        # Generate main content (placeholder - would be implemented by derived agents)
        main_response = f"شكراً لتواصلكم. كوني {self._professional_role}، "
        main_response += "سأقوم بمساعدتكم في هذا الموضوع."
        response_parts.append(main_response)

        # Add professional closing
        closing = self._get_professional_closing()
        response_parts.append(closing)

        return "\n\n".join(response_parts)

    def _should_add_formal_greeting(self, content: str) -> bool:
        """Check if formal greeting should be added"""
        return len(content) > 30 and "سلام" not in content.lower()

    def _get_professional_greeting(self) -> str:
        """Get appropriate professional greeting"""
        if self._domain == ProfessionalDomain.MEDICAL:
            return "السلام عليكم ورحمة الله وبركاته"
        elif self._domain == ProfessionalDomain.LEGAL:
            return "السلام عليكم، تحية طيبة"
        else:
            return "السلام عليكم، أهلاً وسهلاً"

    def _get_professional_closing(self) -> str:
        """Get appropriate professional closing"""
        closings = {
            ProfessionalDomain.MEDICAL: "دمتم بصحة وعافية، والله يشفي مرضاكم",
            ProfessionalDomain.LEGAL: "مع فائق الاحترام والتقدير",
            ProfessionalDomain.EDUCATIONAL: "بارك الله فيكم ووفقكم",
            ProfessionalDomain.ENGINEERING: "نسأل الله التوفيق والنجاح",
        }

        return closings.get(self._domain, "بارك الله فيكم")
