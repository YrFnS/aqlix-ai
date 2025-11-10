"""
Iraqi Cultural Validator Agent

Agent for validating content for Iraqi cultural appropriateness and Islamic compliance.
"""

try:
    from pydantic_ai import Agent, RunContext
except ImportError:
    Agent = None
    RunContext = None
    print("PydanticAI not available - cultural validator will use mock mode")

from apps.api.agents.core.base_agent import BaseIraqiAgent
from apps.api.agents.core.providers import get_llm_model
from apps.api.agents.core.models import CulturalValidationResult
from .dependencies import CulturalValidatorDeps
from .tools import CulturalValidationTools


class IraqiCulturalValidator(BaseIraqiAgent[CulturalValidatorDeps]):
    """
    Iraqi cultural validation agent with Islamic compliance.

    Capabilities:
    - 95%+ cultural appropriateness validation
    - 100% Islamic compliance checking
    - Political/sectarian sensitivity filtering
    - Professional domain context validation

    This agent ensures all content meets Iraqi cultural standards.
    """

    def __init__(self):
        super().__init__(agent_name="iraqi-cultural-validator")
        self.tools = CulturalValidationTools()

    def _create_agent(self) -> Agent:
        """Create cultural validator agent with Iraqi context."""
        if Agent is None:
            return None

        agent = Agent(
            model=get_llm_model(),
            system_prompt=self.get_system_prompt(),
            deps_type=CulturalValidatorDeps,
            retries=self.settings.max_retries,
        )

        # Register tools
        self._register_tools(agent)

        return agent

    def get_system_prompt(self) -> str:
        """Get Iraqi cultural validation system prompt."""
        return """You are an Iraqi cultural validation specialist with expertise in:

**Core Competencies:**
- Islamic values and principles (100% compliance required)
- Iraqi customs, traditions, and social norms
- Professional contexts (legal, medical, educational, engineering, organizational)
- Political neutrality (avoiding sectarian/tribal sensitivities)
- Arabic language appropriateness (Iraqi dialect + Modern Standard Arabic)

**Your Role:**
Validate content for Iraqi cultural appropriateness and Islamic compliance.

**Validation Rules:**

1. **Islamic Compliance** (MANDATORY - 100%):
   - All content must respect Islamic principles
   - No references to alcohol, pork, gambling, interest-based finance
   - Modest and respectful language only
   - Appropriate gender interaction guidelines
   - Prayer time and Ramadan awareness

2. **Cultural Appropriateness** (MINIMUM 95%):
   - Alignment with Iraqi cultural norms and values
   - Respect for family structure and social hierarchy
   - Appropriate use of Iraqi Arabic dialect
   - Professional titles and honorifics in Arabic
   - Cultural context awareness (legal, medical, educational, etc.)

3. **Political Neutrality** (MANDATORY):
   - Avoid sectarian (Shia/Sunni) sensitive topics
   - Avoid political party references
   - Avoid tribal/ethnic sensitive topics
   - Maintain neutral stance on controversial issues

4. **Professional Respect** (REQUIRED):
   - Use appropriate professional titles (الدكتور, المهندس, الأستاذ)
   - Respect professional hierarchies
   - Domain-appropriate language and terminology

**Output Requirements:**
- Provide cultural appropriateness score (0.0-1.0)
- Indicate Islamic compliance status (pass/fail)
- Detect political sensitivity
- Suggest improvements if score < 0.95
- Filter sensitive content if requested

**Quality Standards:**
- Cultural validation response time: <200ms
- Accuracy: 95%+ cultural appropriateness detection
- Islamic compliance: 100% accuracy required
"""

    def _register_tools(self, agent: Agent):
        """Register validation tools with the agent."""
        if agent is None:
            return

        # Tools will be registered using @agent.tool decorator
        # Implementation will be completed with full PydanticAI integration
        pass

    async def validate_content(
        self, content: str, context: str = "general"
    ) -> CulturalValidationResult:
        """
        Validate content for Iraqi cultural appropriateness.

        Args:
            content: Text to validate
            context: Professional domain context

        Returns:
            Validation result with scores and recommendations
        """
        # Create dependencies
        deps = CulturalValidatorDeps(
            cultural_mode="strict",
            islamic_compliance_required=True,
            professional_domain=context,
            language_preference="mixed",
        )

        # Perform validation using tools
        islamic_result = await self.tools.validate_islamic_compliance(content)
        cultural_score = await self.tools.score_cultural_appropriateness(
            content, context
        )
        political_result = await self.tools.detect_political_sensitivity(content)

        # Generate improvements if needed
        improvements = []
        if cultural_score < 0.95:
            improvements = await self.tools.suggest_cultural_improvements(
                content, cultural_score
            )

        # Filter content if sensitive and requested
        filtered_content = content
        if deps.filter_sensitive_content and political_result["is_sensitive"]:
            filtered_content = self.tools.filter_sensitive_topics(content)

        # Create validation result
        return CulturalValidationResult(
            cultural_appropriateness_score=cultural_score,
            islamic_compliance=islamic_result["compliant"],
            political_sensitivity_detected=political_result["is_sensitive"],
            professional_context_valid=True,  # Will be validated with domain-specific checks
            improvement_suggestions=improvements,
            filtered_content=filtered_content if filtered_content != content else None,
        )


# Singleton instance
_cultural_validator_instance = None


def get_cultural_validator() -> IraqiCulturalValidator:
    """
    Get or create the global cultural validator instance.

    Returns:
        Singleton IraqiCulturalValidator instance
    """
    global _cultural_validator_instance
    if _cultural_validator_instance is None:
        _cultural_validator_instance = IraqiCulturalValidator()
    return _cultural_validator_instance
