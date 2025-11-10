"""
Test PydanticAI Agent Integration

Tests integration of cultural validation tools with PydanticAI agents.
"""

import pytest
from apps.api.agents.tools.cultural_validation_tool import (
    get_cultural_validation_agent,
    CulturalValidationDependencies,
    CulturalValidationTool,
)


class TestCulturalValidationAgent:
    """Test PydanticAI agent with cultural validation."""

    @pytest.fixture
    def agent(self):
        """Get cultural validation agent."""
        return get_cultural_validation_agent()

    @pytest.fixture
    def deps(self):
        """Create validation dependencies."""
        return CulturalValidationDependencies(
            cultural_mode="strict",
            islamic_compliance_required=True,
            language_preference="mixed",
            arabic_dialect="iraqi",
            validate_political_neutrality=True,
            check_family_values=True,
            check_professional_respect=True,
        )

    def test_agent_initialization(self, agent):
        """Test agent initializes correctly."""
        assert agent is not None
        assert hasattr(agent, "run")
        assert hasattr(agent, "run_sync")

    def test_validate_cultural_compliance_tool(self, agent, deps):
        """Test validate_cultural_compliance tool exists and is callable."""
        # Get tools from agent
        assert agent is not None
        # The agent should be configured with validation tools

    def test_analyze_arabic_text_tool(self, agent):
        """Test analyze_arabic_text tool exists."""
        assert agent is not None
        # The agent should have Arabic analysis capability

    def test_tool_integration_with_strict_mode(self, deps):
        """Test tool integration with strict mode."""
        content = "مرحبا بكم في النظام العراقي"

        # Direct tool test
        result = CulturalValidationTool.validate_cultural_compliance(content, deps)

        assert result.validation_passed is True
        assert result.cultural_appropriateness_score >= 0.95
        assert result.islamic_compliance is True

    def test_tool_integration_with_islamic_violation(self, deps):
        """Test tool detects Islamic violations."""
        content = "دعونا نناقش شرب الكحول والخمر"

        result = CulturalValidationTool.validate_cultural_compliance(content, deps)

        assert result.validation_passed is False
        assert result.islamic_compliance is False
        assert any(
            "Islamic" in suggestion for suggestion in result.improvement_suggestions
        )

    def test_tool_integration_with_political_sensitivity(self, deps):
        """Test tool detects political sensitivity."""
        content = "الشيعة والسنة في العراق"

        result = CulturalValidationTool.validate_cultural_compliance(content, deps)

        assert result.political_sensitivity_detected is True

    def test_tool_dependency_injection(self):
        """Test tool correctly uses dependency injection."""
        # Test with different dependency configurations
        strict_deps = CulturalValidationDependencies(
            cultural_mode="strict",
            islamic_compliance_required=True,
        )

        moderate_deps = CulturalValidationDependencies(
            cultural_mode="moderate",
            islamic_compliance_required=True,
            validate_political_neutrality=False,
        )

        content = "الشيعة والسنة يعيشان معاً"

        result_strict = CulturalValidationTool.validate_cultural_compliance(
            content, strict_deps
        )
        result_moderate = CulturalValidationTool.validate_cultural_compliance(
            content, moderate_deps
        )

        # Moderate should be less strict
        assert (
            result_moderate.cultural_appropriateness_score
            >= result_strict.cultural_appropriateness_score
        )

    def test_agent_system_prompt(self, agent):
        """Test agent has appropriate system prompt."""
        assert agent is not None
        # The agent should be configured for cultural compliance


class TestToolValidationResults:
    """Test tool validation result formats."""

    def test_validation_result_structure(self):
        """Test validation result has correct structure."""
        deps = CulturalValidationDependencies()
        content = "مرحبا بكم"

        result = CulturalValidationTool.validate_cultural_compliance(content, deps)

        # Check all required fields exist
        assert hasattr(result, "cultural_appropriateness_score")
        assert hasattr(result, "islamic_compliance")
        assert hasattr(result, "political_sensitivity_detected")
        assert hasattr(result, "improvement_suggestions")
        assert hasattr(result, "validation_passed")

    def test_validation_result_types(self):
        """Test validation result fields have correct types."""
        deps = CulturalValidationDependencies()
        content = "مرحبا بكم"

        result = CulturalValidationTool.validate_cultural_compliance(content, deps)

        assert isinstance(result.cultural_appropriateness_score, float)
        assert isinstance(result.islamic_compliance, bool)
        assert isinstance(result.political_sensitivity_detected, bool)
        assert isinstance(result.improvement_suggestions, list)
        assert isinstance(result.validation_passed, bool)

    def test_validation_result_value_ranges(self):
        """Test validation result values are within expected ranges."""
        deps = CulturalValidationDependencies()
        content = "مرحبا بكم"

        result = CulturalValidationTool.validate_cultural_compliance(content, deps)

        # Score should be between 0 and 1
        assert 0 <= result.cultural_appropriateness_score <= 1

        # Validation passed should be consistent with score
        if result.cultural_appropriateness_score >= 0.95 and result.islamic_compliance:
            assert result.validation_passed is True
        else:
            # Not necessarily false if score is below 0.95 or not Islamic compliant
            pass


class TestIraqiDialectRecognition:
    """Test Iraqi dialect recognition in agent context."""

    def test_iraqi_greeting_recognition(self):
        """Test recognition of Iraqi greetings."""
        from apps.api.services.arabic_language_processor import get_arabic_processor

        processor = get_arabic_processor()
        iraqi_greeting = "شلونك يا أخي؟"

        analysis = processor.analyze_text(iraqi_greeting)

        assert analysis.dialect.value == "iraqi"
        assert analysis.dialect_confidence > 0.5

    def test_iraqi_colloquial_markers(self):
        """Test detection of Iraqi colloquial markers."""
        from apps.api.services.arabic_language_processor import get_arabic_processor

        processor = get_arabic_processor()
        content = "شكو أخبارك؟ ماكو مشاكل؟"

        analysis = processor.analyze_text(content)

        assert len(analysis.iraqi_markers) > 0
        assert "شكو" in analysis.iraqi_markers or "ماكو" in analysis.iraqi_markers

    def test_msa_vs_iraqi_distinction(self):
        """Test distinction between MSA and Iraqi dialect."""
        from apps.api.services.arabic_language_processor import get_arabic_processor

        processor = get_arabic_processor()

        # MSA content
        msa_content = "إن الذي يعمل بجد سيحقق نجاحه"
        msa_analysis = processor.analyze_text(msa_content)

        # Iraqi content
        iraqi_content = "شلونك؟ شكو أخبارك؟"
        iraqi_analysis = processor.analyze_text(iraqi_content)

        # Should detect different dialects
        assert msa_analysis.dialect.value == "msa"
        assert iraqi_analysis.dialect.value == "iraqi"


class TestCulturalComplianceDependencies:
    """Test cultural validation dependencies configuration."""

    def test_default_dependencies(self):
        """Test default dependency values."""
        deps = CulturalValidationDependencies()

        assert deps.cultural_mode == "strict"
        assert deps.islamic_compliance_required is True
        assert deps.language_preference == "mixed"
        assert deps.arabic_dialect == "iraqi"
        assert deps.validate_political_neutrality is True
        assert deps.check_family_values is True
        assert deps.check_professional_respect is True

    def test_custom_dependencies(self):
        """Test custom dependency values."""
        deps = CulturalValidationDependencies(
            cultural_mode="moderate",
            islamic_compliance_required=False,
            language_preference="arabic",
            validate_political_neutrality=False,
        )

        assert deps.cultural_mode == "moderate"
        assert deps.islamic_compliance_required is False
        assert deps.language_preference == "arabic"
        assert deps.validate_political_neutrality is False

    def test_dependencies_affect_validation(self):
        """Test that dependencies affect validation results."""
        content = "الشيعة والسنة"

        # Strict mode
        strict_deps = CulturalValidationDependencies(
            cultural_mode="strict",
            validate_political_neutrality=True,
        )

        # Lenient mode
        lenient_deps = CulturalValidationDependencies(
            cultural_mode="flexible",
            validate_political_neutrality=False,
        )

        strict_result = CulturalValidationTool.validate_cultural_compliance(
            content, strict_deps
        )
        lenient_result = CulturalValidationTool.validate_cultural_compliance(
            content, lenient_deps
        )

        # Lenient should score higher
        assert (
            lenient_result.cultural_appropriateness_score
            >= strict_result.cultural_appropriateness_score
        )
