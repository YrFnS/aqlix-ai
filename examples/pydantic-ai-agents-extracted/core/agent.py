"""
Iraqi AI Chat System - Core Agent Implementation
Base Iraqi AI Agent with cultural intelligence and PydanticAI integration
"""

from typing import Union, Optional, Dict, Any, List, AsyncGenerator, TYPE_CHECKING
from dataclasses import dataclass, field
from datetime import datetime, timezone
import asyncio
import time
import json
import uuid
from abc import ABC, abstractmethod

try:
    from pydantic_ai import Agent, RunContext
    from pydantic_ai.messages import ModelMessage, ModelRequest
    from pydantic_ai.models import KnownModelName
    from pydantic import BaseModel, Field
except ImportError as e:
    # Graceful handling for development environment
    Agent = None
    RunContext = None
    ModelMessage = None
    ModelRequest = None
    KnownModelName = str
    BaseModel = object
    Field = lambda **kwargs: None
    print(f"PydanticAI not available: {e}")

from .settings import settings, IraqiCulturalMode, IslamicComplianceLevel
from .providers import get_llm_model, get_model_provider
from .dependencies import IraqiAgentDependencies


@dataclass
class IraqiCulturalContext:
    """Cultural context for Iraqi AI interactions"""

    user_cultural_background: str = "iraqi"
    primary_language: str = "arabic"
    dialect: str = "iraqi_arabic"
    islamic_compliance_required: bool = True
    professional_domain: Optional[str] = None
    cultural_sensitivity_level: str = "high"
    prayer_time_awareness: bool = True
    regional_context: str = "baghdad"  # Default to Baghdad

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for model context"""
        return {
            "cultural_background": self.user_cultural_background,
            "language": self.primary_language,
            "dialect": self.dialect,
            "islamic_compliance": self.islamic_compliance_required,
            "domain": self.professional_domain,
            "sensitivity": self.cultural_sensitivity_level,
            "prayer_aware": self.prayer_time_awareness,
            "region": self.regional_context,
        }


@dataclass
class IraqiValidationResult:
    """Results from Iraqi cultural and Islamic validation"""

    cultural_appropriateness: float = 0.0  # 0.0-1.0
    islamic_compliance: float = 0.0  # 0.0-1.0
    arabic_accuracy: float = 0.0  # 0.0-1.0 (for Arabic text)
    dialect_recognition: float = 0.0  # 0.0-1.0 (for Iraqi dialect)
    professional_relevance: float = 0.0  # 0.0-1.0 (for domain-specific content)

    validation_passed: bool = False
    issues: List[str] = field(default_factory=list)
    recommendations: List[str] = field(default_factory=list)
    processing_time: float = 0.0

    def meets_requirements(
        self,
        min_cultural: float = 0.95,
        min_islamic: float = 1.0,
        min_arabic: float = 0.99,
    ) -> bool:
        """Check if validation results meet Iraqi requirements"""
        return (
            self.cultural_appropriateness >= min_cultural
            and self.islamic_compliance >= min_islamic
            and (
                self.arabic_accuracy >= min_arabic if self.arabic_accuracy > 0 else True
            )
        )


if TYPE_CHECKING or BaseModel != object:

    class IraqiAgentInput(BaseModel):
        """Input model for Iraqi AI Agent"""

        message: str = Field(..., description="User message in Arabic or English")
        context: Optional[Dict[str, Any]] = Field(
            None, description="Additional context"
        )
        cultural_context: Optional[IraqiCulturalContext] = Field(
            None, description="Cultural context"
        )
        require_validation: bool = Field(
            True, description="Require cultural validation"
        )

    class IraqiAgentOutput(BaseModel):
        """Output model for Iraqi AI Agent"""

        response: str = Field(..., description="Agent response")
        cultural_validation: IraqiValidationResult = Field(
            ..., description="Validation results"
        )
        confidence: float = Field(..., description="Response confidence (0.0-1.0)")
        processing_time: float = Field(..., description="Processing time in seconds")
        model_used: str = Field(..., description="Model used for generation")
        metadata: Dict[str, Any] = Field(
            default_factory=dict, description="Additional metadata"
        )
else:
    # Fallback for development
    class IraqiAgentInput:
        def __init__(
            self,
            message: str,
            context=None,
            cultural_context=None,
            require_validation=True,
        ):
            self.message = message
            self.context = context or {}
            self.cultural_context = cultural_context
            self.require_validation = require_validation

    class IraqiAgentOutput:
        def __init__(
            self,
            response: str,
            cultural_validation,
            confidence: float,
            processing_time: float,
            model_used: str,
            metadata=None,
        ):
            self.response = response
            self.cultural_validation = cultural_validation
            self.confidence = confidence
            self.processing_time = processing_time
            self.model_used = model_used
            self.metadata = metadata or {}


class IraqiCulturalValidator(ABC):
    """Abstract base class for cultural validation"""

    @abstractmethod
    async def validate_content(
        self, content: str, context: IraqiCulturalContext
    ) -> IraqiValidationResult:
        """Validate content for Iraqi cultural appropriateness"""
        pass

    @abstractmethod
    async def validate_islamic_compliance(self, content: str) -> float:
        """Validate content for Islamic compliance"""
        pass


class DefaultIraqiValidator(IraqiCulturalValidator):
    """Default implementation of Iraqi cultural validator"""

    def __init__(self):
        self.cultural_keywords = {
            "positive": [
                "respect",
                "family",
                "tradition",
                "honor",
                "community",
                "islamic",
                "halal",
            ],
            "negative": ["haram", "inappropriate", "disrespectful", "offensive"],
        }
        self.islamic_principles = [
            "respect for elders",
            "family values",
            "religious observance",
            "modest behavior",
            "charitable giving",
            "community support",
        ]

    async def validate_content(
        self, content: str, context: IraqiCulturalContext
    ) -> IraqiValidationResult:
        """Basic cultural validation implementation"""
        start_time = time.time()

        # Simple keyword-based validation (replace with AI-powered validation in production)
        content_lower = content.lower()

        positive_score = sum(
            1
            for keyword in self.cultural_keywords["positive"]
            if keyword in content_lower
        )
        negative_score = sum(
            1
            for keyword in self.cultural_keywords["negative"]
            if keyword in content_lower
        )

        # Calculate cultural appropriateness (0.0-1.0)
        cultural_score = min(
            1.0, max(0.0, 0.8 + (positive_score * 0.1) - (negative_score * 0.2))
        )

        # Islamic compliance validation
        islamic_score = await self.validate_islamic_compliance(content)

        # Arabic accuracy (simplified - would use NLP in production)
        arabic_score = 0.99 if any(ord(char) > 127 for char in content) else 0.0

        processing_time = time.time() - start_time

        validation_passed = (
            cultural_score >= settings.min_cultural_appropriateness
            and islamic_score >= settings.min_islamic_compliance
        )

        issues = []
        recommendations = []

        if not validation_passed:
            if cultural_score < settings.min_cultural_appropriateness:
                issues.append(
                    f"Cultural appropriateness {cultural_score:.2f} below threshold {settings.min_cultural_appropriateness}"
                )
                recommendations.append("Consider using more respectful language")

            if islamic_score < settings.min_islamic_compliance:
                issues.append(
                    f"Islamic compliance {islamic_score:.2f} below threshold {settings.min_islamic_compliance}"
                )
                recommendations.append("Ensure content aligns with Islamic principles")

        return IraqiValidationResult(
            cultural_appropriateness=cultural_score,
            islamic_compliance=islamic_score,
            arabic_accuracy=arabic_score,
            dialect_recognition=0.8,  # Simplified
            professional_relevance=0.9,  # Simplified
            validation_passed=validation_passed,
            issues=issues,
            recommendations=recommendations,
            processing_time=processing_time,
        )

    async def validate_islamic_compliance(self, content: str) -> float:
        """Basic Islamic compliance validation"""
        content_lower = content.lower()

        # Check for Islamic principles
        principle_score = sum(
            1
            for principle in self.islamic_principles
            if any(word in content_lower for word in principle.split())
        )

        # Check for prohibited content (simplified)
        prohibited_terms = ["alcohol", "gambling", "interest", "riba"]
        prohibited_score = sum(1 for term in prohibited_terms if term in content_lower)

        # Calculate compliance score
        compliance = min(
            1.0, max(0.0, 0.9 + (principle_score * 0.05) - (prohibited_score * 0.3))
        )

        return compliance


class IraqiBaseAgent:
    """
    Base Iraqi AI Agent with cultural intelligence and PydanticAI integration
    """

    def __init__(
        self,
        name: str = "iraqi-base-agent",
        system_prompt: Optional[str] = None,
        dependencies: Optional[IraqiAgentDependencies] = None,
        validator: Optional[IraqiCulturalValidator] = None,
    ):
        self.name = name
        self.agent_id = str(uuid.uuid4())
        self.created_at = datetime.now(timezone.utc)
        self.dependencies = dependencies or IraqiAgentDependencies()
        self.cultural_validator = validator or DefaultIraqiValidator()
        self.model_provider = get_model_provider()

        # Default Iraqi AI system prompt
        self.system_prompt = system_prompt or self._get_default_system_prompt()

        # Initialize PydanticAI agent if available
        self.pydantic_agent = None
        if Agent is not None:
            self._initialize_pydantic_agent()

        # Performance tracking
        self.request_count = 0
        self.total_processing_time = 0.0
        self.validation_failures = 0

    def _get_default_system_prompt(self) -> str:
        """Get default system prompt for Iraqi AI agent"""
        return f"""
You are an Iraqi AI assistant with deep cultural intelligence and Islamic knowledge.

CULTURAL REQUIREMENTS:
- Cultural appropriateness: ≥{settings.min_cultural_appropriateness * 100}%
- Islamic compliance: ≥{settings.min_islamic_compliance * 100}%
- Arabic RTL accuracy: ≥{settings.min_arabic_accuracy * 100}%

CORE PRINCIPLES:
1. Respect Iraqi cultural values and Islamic principles
2. Support both Iraqi Arabic dialect and Modern Standard Arabic
3. Provide culturally-sensitive responses for professional domains: {", ".join(settings.enabled_domains)}
4. Maintain political neutrality and avoid sectarian topics
5. Respect family values, elder wisdom, and community traditions

RESPONSE GUIDELINES:
- Use appropriate Islamic greetings when culturally relevant
- Acknowledge prayer times and religious observances
- Provide practical advice respecting Iraqi social norms
- Support Arabic RTL text processing and mixed-language content
- Validate all responses for cultural appropriateness

PROFESSIONAL DOMAINS SUPPORTED:
{chr(10).join(f"- {domain.title()}: Provide domain-specific knowledge while respecting cultural context" for domain in settings.enabled_domains)}

Remember: You serve the Iraqi community with respect, cultural awareness, and Islamic values.
        """.strip()

    def _initialize_pydantic_agent(self):
        """Initialize PydanticAI agent with Iraqi configuration"""
        try:
            # This will be implemented when PydanticAI is available
            # self.pydantic_agent = Agent(
            #     model=...,  # Will use our provider system
            #     system_prompt=self.system_prompt,
            #     deps_type=IraqiAgentDependencies
            # )
            pass
        except Exception as e:
            print(f"Failed to initialize PydanticAI agent: {e}")

    async def process_message(
        self,
        input_data: Union[IraqiAgentInput, str, Dict[str, Any]],
        context: Optional[IraqiCulturalContext] = None,
    ) -> IraqiAgentOutput:
        """
        Process user message with cultural intelligence
        """
        start_time = time.time()
        self.request_count += 1

        # Normalize input
        if isinstance(input_data, str):
            agent_input = IraqiAgentInput(message=input_data, cultural_context=context)
        elif isinstance(input_data, dict):
            agent_input = IraqiAgentInput(**input_data)
        else:
            agent_input = input_data

        try:
            # Get model with fallback
            model, model_name = await get_llm_model()

            # Prepare cultural context
            cultural_ctx = agent_input.cultural_context or IraqiCulturalContext()

            # Generate response (simplified for now - will use PydanticAI when available)
            response = await self._generate_response(
                agent_input.message, cultural_ctx, model
            )

            # Validate response if required
            validation_result = IraqiValidationResult(validation_passed=True)
            if agent_input.require_validation:
                validation_result = await self.cultural_validator.validate_content(
                    response, cultural_ctx
                )

                if not validation_result.validation_passed:
                    self.validation_failures += 1
                    # Attempt to regenerate if validation fails
                    response = await self._regenerate_response(
                        agent_input.message, cultural_ctx, model, validation_result
                    )
                    # Re-validate
                    validation_result = await self.cultural_validator.validate_content(
                        response, cultural_ctx
                    )

            processing_time = time.time() - start_time
            self.total_processing_time += processing_time

            # Update model performance metrics
            await self.model_provider.update_model_performance(
                model_name=model_name,
                response_time=processing_time,
                cultural_score=validation_result.cultural_appropriateness,
                islamic_score=validation_result.islamic_compliance,
                arabic_score=validation_result.arabic_accuracy,
                success=validation_result.validation_passed,
            )

            # Calculate confidence based on validation results
            confidence = self._calculate_confidence(validation_result)

            return IraqiAgentOutput(
                response=response,
                cultural_validation=validation_result,
                confidence=confidence,
                processing_time=processing_time,
                model_used=model_name,
                metadata={
                    "agent_id": self.agent_id,
                    "request_count": self.request_count,
                    "cultural_context": cultural_ctx.to_dict(),
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                },
            )

        except Exception as e:
            processing_time = time.time() - start_time

            # Return error response with cultural context
            return IraqiAgentOutput(
                response=f"أعتذر، حدث خطأ في المعالجة. Sorry, an error occurred during processing.",
                cultural_validation=IraqiValidationResult(
                    validation_passed=False, issues=[f"Processing error: {str(e)}"]
                ),
                confidence=0.0,
                processing_time=processing_time,
                model_used="error",
                metadata={"error": str(e), "agent_id": self.agent_id},
            )

    async def _generate_response(
        self, message: str, cultural_context: IraqiCulturalContext, model: Any
    ) -> str:
        """Generate response using model (simplified implementation)"""
        # This would use the actual model when PydanticAI is integrated
        # For now, return a culturally-aware placeholder

        greeting = (
            "السلام عليكم" if cultural_context.islamic_compliance_required else "مرحبا"
        )

        if cultural_context.primary_language == "arabic":
            return f"{greeting}! شكراً لك على رسالتك. نحن نعمل على تطوير نظام الذكاء الاصطناعي العراقي."
        else:
            return f"{greeting}! Thank you for your message. We are developing the Iraqi AI system with cultural intelligence."

    async def _regenerate_response(
        self,
        message: str,
        cultural_context: IraqiCulturalContext,
        model: Any,
        validation_result: IraqiValidationResult,
    ) -> str:
        """Regenerate response based on validation feedback"""
        # Enhanced prompt with validation feedback
        feedback_prompt = f"""
        Previous response failed validation:
        Issues: {", ".join(validation_result.issues)}
        Recommendations: {", ".join(validation_result.recommendations)}
        
        Please provide a culturally appropriate response that meets Iraqi standards.
        """

        # Would use model with enhanced prompt in production
        return await self._generate_response(message, cultural_context, model)

    def _calculate_confidence(self, validation_result: IraqiValidationResult) -> float:
        """Calculate response confidence based on validation"""
        if not validation_result.validation_passed:
            return 0.3  # Low confidence for failed validation

        # Weighted confidence based on validation scores
        confidence = (
            0.4 * validation_result.cultural_appropriateness
            + 0.3 * validation_result.islamic_compliance
            + 0.2 * validation_result.arabic_accuracy
            + 0.1 * validation_result.professional_relevance
        )

        return min(1.0, max(0.0, confidence))

    def get_stats(self) -> Dict[str, Any]:
        """Get agent performance statistics"""
        avg_processing_time = (
            self.total_processing_time / self.request_count
            if self.request_count > 0
            else 0.0
        )

        return {
            "agent_id": self.agent_id,
            "name": self.name,
            "created_at": self.created_at.isoformat(),
            "request_count": self.request_count,
            "avg_processing_time": round(avg_processing_time, 3),
            "validation_failures": self.validation_failures,
            "failure_rate": (
                self.validation_failures / self.request_count
                if self.request_count > 0
                else 0.0
            ),
            "model_stats": self.model_provider.get_model_stats(),
        }


# Factory function for creating Iraqi agents
async def create_iraqi_agent(
    name: str = "iraqi-ai-agent",
    system_prompt: Optional[str] = None,
    dependencies: Optional[IraqiAgentDependencies] = None,
) -> IraqiBaseAgent:
    """Create and initialize an Iraqi AI agent"""
    return IraqiBaseAgent(
        name=name, system_prompt=system_prompt, dependencies=dependencies
    )
