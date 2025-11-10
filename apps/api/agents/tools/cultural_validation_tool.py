"""
PydanticAI Cultural Validation Tool

Provides @agent.tool decorated functions for cultural and Islamic compliance validation.
Integrates with PydanticAI agents to validate content before generating responses.
"""

import threading
import unicodedata
from dataclasses import dataclass
from typing import Optional
from pydantic_ai import Agent
from pydantic_ai.models import ModelT

from apps.api.agents.core.models import (
    IraqiAgentDependencies,
    CulturalValidationResult,
)
from apps.api.services.arabic_language_processor import (
    get_arabic_processor,
    ArabicDialect,
)


@dataclass
class CulturalValidationDependencies(IraqiAgentDependencies):
    """Dependencies for cultural validation tool usage."""

    cultural_mode: str = "strict"  # strict, moderate, flexible
    islamic_compliance_required: bool = True
    language_preference: str = "mixed"  # arabic, english, mixed
    arabic_dialect: str = "iraqi"  # iraqi, msa, auto
    professional_domain: Optional[str] = (
        None  # legal, medical, educational, organizational, general
    )
    validate_political_neutrality: bool = True
    check_family_values: bool = True
    check_professional_respect: bool = True


class CulturalValidationTool:
    """Cultural validation tool for PydanticAI agents."""

    # Islamic compliance keywords that must be avoided
    FORBIDDEN_ISLAMIC_KEYWORDS = {
        "alcohol": ["كحول", "خمر", "نبيذ", "بيرة"],
        "gambling": ["قمار", "رهان", "ميسر"],
        "interest": ["فائدة", "ربا"],
        "pork": ["خنزير", "لحم خنزير"],
        "haram": ["حرام"],
        "shirk": ["شرك"],
    }

    # Political sensitivity keywords
    POLITICAL_SENSITIVITY_KEYWORDS = {
        "sectarian": [
            "شيعي",
            "سني",
            "كردي",
            "تركماني",
            "عرب",
            "مذهب",
            "طائفة",
        ],
        "tribal": ["عشيرة", "قبيلة", "عائلة", "أصل"],
        "political": [
            "حزب",
            "انتخابات",
            "حكومة",
            "رئيس",
            "وزير",
            "برلمان",
        ],
    }

    @staticmethod
    def _normalize_text(text: str) -> str:
        """
        Normalize text for cultural validation using Unicode normalization.

        For Arabic text, uses Unicode NFC normalization.
        For ASCII text, uses casefold() for case-insensitive comparison.

        Args:
            text: Text to normalize

        Returns:
            Normalized text for comparison
        """
        # Apply Unicode NFC normalization for consistent character representation
        normalized = unicodedata.normalize("NFC", text)

        # Only apply casefold for ASCII characters to preserve Arabic semantics
        # Arabic doesn't have uppercase/lowercase distinction like Latin
        return normalized.casefold() if normalized.isascii() else normalized

    @staticmethod
    def validate_cultural_compliance(
        content: str,
        dependencies: CulturalValidationDependencies,
    ) -> CulturalValidationResult:
        """
        Validate content for cultural and Islamic compliance.

        Args:
            content: The content to validate
            dependencies: Cultural validation dependencies

        Returns:
            CulturalValidationResult with scores and recommendations
        """
        processor = get_arabic_processor()
        analysis = processor.analyze_text(content)

        # Initialize scores
        cultural_score = 100.0
        islamic_compliant = True
        political_sensitivity_detected = False
        recommendations = []

        # 1. Check Islamic compliance (100% required in strict mode)
        if dependencies.islamic_compliance_required:
            islamic_compliant, islamic_issues = (
                CulturalValidationTool._check_islamic_compliance(content)
            )
            if not islamic_compliant:
                cultural_score -= 30
                recommendations.extend(islamic_issues)

        # 2. Check political sensitivity
        if dependencies.validate_political_neutrality:
            political_issues = CulturalValidationTool._check_political_sensitivity(
                content
            )
            if political_issues:
                political_sensitivity_detected = True
                cultural_score -= 15
                recommendations.extend(political_issues)

        # 3. Check for professional respect
        if dependencies.check_professional_respect:
            respect_issues = CulturalValidationTool._check_professional_respect(content)
            if respect_issues:
                cultural_score -= 10
                recommendations.extend(respect_issues)

        # 4. Check family values alignment
        if dependencies.check_family_values:
            family_issues = CulturalValidationTool._check_family_values(content)
            if family_issues:
                cultural_score -= 10
                recommendations.extend(family_issues)

        # 5. Language preference alignment
        if (
            dependencies.language_preference == "arabic"
            and analysis.arabic_percentage < 70
        ):
            cultural_score -= 5
            recommendations.append(
                "Content should be primarily in Arabic for Arabic preference"
            )
        elif (
            dependencies.language_preference == "english"
            and analysis.arabic_percentage > 30
        ):
            cultural_score -= 5
            recommendations.append(
                "Content should be primarily in English for English preference"
            )

        # Ensure score stays between 0 and 100
        cultural_score = max(0, min(100, cultural_score))
        cultural_appropriateness_score = cultural_score / 100

        return CulturalValidationResult(
            cultural_appropriateness_score=cultural_appropriateness_score,
            islamic_compliance=islamic_compliant,
            political_sensitivity_detected=political_sensitivity_detected,
            improvement_suggestions=recommendations,
            validation_passed=cultural_appropriateness_score >= 0.95
            and islamic_compliant,
        )

    @staticmethod
    def _check_islamic_compliance(content: str) -> tuple[bool, list[str]]:
        """
        Check for Islamic compliance violations using Unicode normalization.

        Args:
            content: Content to validate

        Returns:
            Tuple of (is_compliant, list of issues)
        """
        issues = []
        # Normalize content for comparison (preserves Arabic semantics)
        content_normalized = CulturalValidationTool._normalize_text(content)

        for (
            category,
            keywords,
        ) in CulturalValidationTool.FORBIDDEN_ISLAMIC_KEYWORDS.items():
            for keyword in keywords:
                # Normalize keyword for comparison
                keyword_normalized = CulturalValidationTool._normalize_text(keyword)
                if keyword_normalized in content_normalized:
                    issues.append(
                        f"Islamic compliance violation: {category} mentioned - remove or rephrase"
                    )
                    return False, issues

        return True, issues

    @staticmethod
    def _check_political_sensitivity(content: str) -> list[str]:
        """
        Check for political sensitivity issues using Unicode normalization.

        Args:
            content: Content to validate

        Returns:
            List of detected political sensitivity issues
        """
        issues = []
        # Normalize content for comparison
        content_normalized = CulturalValidationTool._normalize_text(content)

        for (
            sensitivity_type,
            keywords,
        ) in CulturalValidationTool.POLITICAL_SENSITIVITY_KEYWORDS.items():
            detected = []
            for kw in keywords:
                kw_normalized = CulturalValidationTool._normalize_text(kw)
                if kw_normalized in content_normalized:
                    detected.append(kw)

            if detected:
                issues.append(
                    f"Political sensitivity detected ({sensitivity_type}): {', '.join(detected)} - "
                    f"ensure neutral, inclusive language"
                )

        return issues

    @staticmethod
    def _check_professional_respect(content: str) -> list[str]:
        """
        Check for professional respect and courtesy.

        Args:
            content: Content to validate

        Returns:
            List of professional respect issues
        """
        issues = []

        # Normalize for case-insensitive English term checking
        content_normalized = CulturalValidationTool._normalize_text(content)

        # Check for disrespectful terms (case-insensitive for English)
        disrespectful_terms = ["idiot", "stupid", "fool", "incompetent"]
        if any(term in content_normalized for term in disrespectful_terms):
            issues.append("Use respectful language in professional contexts")

        # Check for proper use of titles (for Arabic)
        # Note: We check original content for Arabic characters
        if "الدكتور" not in content and "المهندس" not in content:
            if (
                any(
                    title in content_normalized
                    for title in ["doctor", "engineer", "professor"]
                )
                and "dr." not in content_normalized
            ):
                issues.append(
                    "Professional titles should be properly used (الدكتور, المهندس, etc.)"
                )

        return issues

    @staticmethod
    def _check_family_values(content: str) -> list[str]:
        """
        Check for alignment with Iraqi family values.

        Args:
            content: Content to validate

        Returns:
            List of family values issues
        """
        issues = []

        # Normalize for comparison
        content_normalized = CulturalValidationTool._normalize_text(content)

        # Check for respectful family references (English phrases)
        disrespectful_phrases = [
            "disrespect family",
            "ignore elders",
            "dishonor parents",
        ]
        if any(phrase in content_normalized for phrase in disrespectful_phrases):
            issues.append("Content should respect family values and hierarchy")

        return issues


def create_cultural_validation_agent() -> Agent:
    """
    Create an example PydanticAI agent with cultural validation tool.

    This demonstrates how to integrate cultural validation into agents.

    Returns:
        Agent with cultural validation tool registered
    """

    @dataclass
    class ContentCheckDeps(CulturalValidationDependencies):
        """Dependencies for content checking agent."""

        user_input: str = ""

    agent = Agent(
        model="claude-3-5-haiku-20241022",
        deps_type=ContentCheckDeps,
        system_prompt="""You are a cultural compliance validator for Iraqi content.

Your role is to:
1. Validate content for Islamic compliance (100% required)
2. Check for cultural appropriateness (95%+ target)
3. Detect political sensitivity issues
4. Suggest improvements for better cultural alignment

Always use the validate_cultural_compliance tool before processing content.""",
    )

    @agent.tool
    def validate_cultural_compliance(
        content: str,
        cultural_mode: str = "strict",
    ) -> CulturalValidationResult:
        """
        Validate content for cultural and Islamic compliance.

        Args:
            content: The content to validate
            cultural_mode: Validation mode (strict, moderate, flexible)

        Returns:
            Validation result with scores and recommendations
        """
        deps = CulturalValidationDependencies(
            cultural_mode=cultural_mode,
            islamic_compliance_required=True,
            language_preference="mixed",
            validate_political_neutrality=True,
            check_family_values=True,
            check_professional_respect=True,
        )
        return CulturalValidationTool.validate_cultural_compliance(content, deps)

    @agent.tool
    def analyze_arabic_text(text: str) -> dict:
        """
        Analyze Arabic text for language and dialect properties.

        Args:
            text: The Arabic text to analyze

        Returns:
            Dictionary with Arabic analysis results
        """
        processor = get_arabic_processor()
        analysis = processor.analyze_text(text)
        return {
            "arabic_percentage": analysis.arabic_percentage,
            "rtl_required": analysis.rtl_required,
            "dialect": analysis.dialect.value,
            "dialect_confidence": analysis.dialect_confidence,
            "code_switching_detected": analysis.code_switching_detected,
            "iraqi_markers": analysis.iraqi_markers,
        }

    return agent


# Singleton instance
_agent_instance = None
_agent_lock = threading.Lock()


def get_cultural_validation_agent() -> Agent:
    """Get or create the cultural validation agent."""
    global _agent_instance
    if _agent_instance is None:
        with _agent_lock:
            if _agent_instance is None:
                _agent_instance = create_cultural_validation_agent()
    return _agent_instance


# Example usage documentation
"""
EXAMPLE: Using Cultural Validation Tool in an Agent

from apps.api.agents.tools.cultural_validation_tool import (
    get_cultural_validation_agent,
    CulturalValidationDependencies,
)

# Get the agent
agent = get_cultural_validation_agent()

# Create dependencies
deps = CulturalValidationDependencies(
    cultural_mode="strict",
    islamic_compliance_required=True,
    language_preference="mixed",
    arabic_dialect="iraqi",
    validate_political_neutrality=True,
)

# Use in your agent
async def validate_user_content(user_input: str):
    result = await agent.run(
        f"Please validate this content for cultural compliance: {user_input}",
        deps=deps,
    )
    return result.data

# Or directly validate
from apps.api.agents.tools.cultural_validation_tool import CulturalValidationTool

validation = CulturalValidationTool.validate_cultural_compliance(
    content="مرحبا بكم في النظام العراقي",
    dependencies=deps,
)

print(f"Appropriateness: {validation.cultural_appropriateness_score}")
print(f"Islamic Compliant: {validation.islamic_compliance}")
print(f"Passed: {validation.validation_passed}")
"""
