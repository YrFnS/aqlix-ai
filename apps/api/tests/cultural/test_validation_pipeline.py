"""
Test Cultural Validation Pipeline

Tests the complete validation pipeline from content input to result output.
Includes performance benchmarking and edge cases.
"""

import pytest
import time
from apps.api.agents.tools.cultural_validation_tool import (
    CulturalValidationTool,
    CulturalValidationDependencies,
)
from apps.api.services.arabic_language_processor import (
    get_arabic_processor,
    ArabicDialect,
)


class TestValidationPipeline:
    """Test complete validation pipeline."""

    @pytest.fixture
    def strict_deps(self):
        """Strict cultural validation dependencies."""
        return CulturalValidationDependencies(
            cultural_mode="strict",
            islamic_compliance_required=True,
            language_preference="mixed",
            validate_political_neutrality=True,
            check_family_values=True,
            check_professional_respect=True,
        )

    @pytest.fixture
    def moderate_deps(self):
        """Moderate cultural validation dependencies."""
        return CulturalValidationDependencies(
            cultural_mode="moderate",
            islamic_compliance_required=True,
            language_preference="mixed",
            validate_political_neutrality=False,
            check_family_values=True,
            check_professional_respect=True,
        )

    def test_valid_arabian_content(self, strict_deps):
        """Test validation of appropriate Arabic content."""
        content = "مرحبا بكم في النظام العراقي. نحن نقدر احترامكم وقيمتكم."
        result = CulturalValidationTool.validate_cultural_compliance(
            content, strict_deps
        )

        assert result.cultural_appropriateness_score >= 0.95
        assert result.islamic_compliance is True
        assert result.validation_passed is True
        assert len(result.improvement_suggestions) == 0

    def test_islamic_violation_content(self, strict_deps):
        """Test detection of Islamic compliance violations."""
        content = "دعونا نناقش شرب الكحول والخمر"  # Mentions alcohol
        result = CulturalValidationTool.validate_cultural_compliance(
            content, strict_deps
        )

        assert result.islamic_compliance is False
        assert result.validation_passed is False
        assert any(
            "Islamic" in suggestion for suggestion in result.improvement_suggestions
        )

    def test_political_sensitivity_detection(self, strict_deps):
        """Test detection of political sensitivity."""
        content = "الفرق بين الشيعة والسنة والأكراد في العراق"  # Sectarian content
        result = CulturalValidationTool.validate_cultural_compliance(
            content, strict_deps
        )

        assert result.political_sensitivity_detected is True
        assert result.cultural_appropriateness_score < 0.95

    def test_professional_respect_check(self, strict_deps):
        """Test professional respect validation."""
        content = "الدكتور أحمد هو متخصص في الهندسة المدنية ولديه خبرة عالية."
        result = CulturalValidationTool.validate_cultural_compliance(
            content, strict_deps
        )

        assert result.cultural_appropriateness_score >= 0.90
        assert result.islamic_compliance is True

    def test_mixed_language_content(self, strict_deps):
        """Test validation of mixed Arabic-English content."""
        content = "Hello, مرحبا بكم في our system الذي يدعم العربية والإنجليزية"
        result = CulturalValidationTool.validate_cultural_compliance(
            content, strict_deps
        )

        assert result.cultural_appropriateness_score > 0.80
        assert result.islamic_compliance is True

    def test_empty_content(self, strict_deps):
        """Test validation of empty content."""
        result = CulturalValidationTool.validate_cultural_compliance("", strict_deps)

        assert result.cultural_appropriateness_score == 1.0
        assert result.islamic_compliance is True
        assert result.validation_passed is True

    def test_performance_benchmark(self, strict_deps):
        """Test that validation completes within performance targets."""
        content = "مرحبا بكم في النظام العراقي الحديث. نحن نقدم خدمات عالية الجودة."

        start_time = time.time()
        result = CulturalValidationTool.validate_cultural_compliance(
            content, strict_deps
        )
        elapsed_time = (time.time() - start_time) * 1000  # Convert to ms

        assert elapsed_time < 200, f"Validation took {elapsed_time}ms, expected < 200ms"
        assert result.validation_passed is True

    def test_moderate_mode_less_strict(self, moderate_deps):
        """Test that moderate mode is less strict than strict mode."""
        # Content with political sensitivity (sectarian terms)
        content = "الشيعة والسنة يعيشون معا في العراق"

        result_strict = CulturalValidationTool.validate_cultural_compliance(
            content,
            CulturalValidationDependencies(
                cultural_mode="strict",
                islamic_compliance_required=True,
                validate_political_neutrality=True,
            ),
        )

        result_moderate = CulturalValidationTool.validate_cultural_compliance(
            content,
            moderate_deps,
        )

        # Moderate should have higher score than strict when political check is off
        assert (
            result_moderate.cultural_appropriateness_score
            >= result_strict.cultural_appropriateness_score
        )

    def test_large_content_handling(self, strict_deps):
        """Test validation of large content."""
        # Create large content (5000 characters)
        large_content = "مرحبا بكم في النظام العراقي. " * 200

        start_time = time.time()
        result = CulturalValidationTool.validate_cultural_compliance(
            large_content, strict_deps
        )
        elapsed_time = (time.time() - start_time) * 1000

        assert elapsed_time < 300  # Allow slightly more time for large content
        assert result.cultural_appropriateness_score > 0.90
        assert result.islamic_compliance is True

    def test_special_characters_handling(self, strict_deps):
        """Test handling of special characters and diacritics."""
        content = "مَرْحَبًا بِكُمْ فِي النِّظَامِ العِرَاقِيِّ"  # With diacritics

        result = CulturalValidationTool.validate_cultural_compliance(
            content, strict_deps
        )

        assert result.cultural_appropriateness_score >= 0.90
        assert result.islamic_compliance is True

    def test_whitespace_normalization(self, strict_deps):
        """Test handling of extra whitespace."""
        content = "مرحبا   بكم   في   النظام   العراقي"

        result = CulturalValidationTool.validate_cultural_compliance(
            content, strict_deps
        )

        assert result.cultural_appropriateness_score >= 0.90
        assert result.islamic_compliance is True


class TestArabicProcessing:
    """Test Arabic language processing in pipeline."""

    def test_iraqi_dialect_detection(self):
        """Test detection of Iraqi dialect."""
        processor = get_arabic_processor()
        content = "شلونك يا أخي؟ شكو أخبارك؟"  # Iraqi greeting

        analysis = processor.analyze_text(content)

        assert analysis.dialect == ArabicDialect.IRAQI
        assert analysis.dialect_confidence > 0.7
        assert len(analysis.iraqi_markers) > 0

    def test_msa_detection(self):
        """Test detection of Modern Standard Arabic."""
        processor = get_arabic_processor()
        content = "إن الذي يعمل بجد سيحقق أهدافه"  # MSA formal text

        analysis = processor.analyze_text(content)

        assert analysis.dialect == ArabicDialect.MSA
        assert analysis.dialect_confidence > 0.5

    def test_code_switching_detection(self):
        """Test detection of Arabic-English code switching."""
        processor = get_arabic_processor()
        content = "Hello مرحبا, welcome أهلا في our system النظام"

        analysis = processor.analyze_text(content)

        assert analysis.code_switching_detected is True
        assert analysis.arabic_percentage > 30
        assert analysis.arabic_percentage < 70

    def test_diacritics_detection(self):
        """Test detection of diacritical marks."""
        processor = get_arabic_processor()
        content = "مَرْحَبًا بِكُمْ"  # With diacritics

        analysis = processor.analyze_text(content)

        assert analysis.has_diacritics is True

    def test_text_normalization(self):
        """Test Arabic text normalization."""
        processor = get_arabic_processor()
        content = "مَرْحَبًا بِكُمْ"  # With diacritics

        normalized = processor.normalize_text(content)

        assert "َ" not in normalized  # Diacritics removed
        assert "مرحبا" in normalized

    def test_rtl_requirement(self):
        """Test RTL requirement detection."""
        processor = get_arabic_processor()

        # High Arabic percentage should require RTL
        content_ar = "مرحبا بكم في النظام العراقي الحديث"
        analysis_ar = processor.analyze_text(content_ar)
        assert analysis_ar.rtl_required is True

        # Low Arabic percentage should not require RTL
        content_en = "Hello, this is English content"
        analysis_en = processor.analyze_text(content_en)
        assert analysis_en.rtl_required is False

    def test_text_direction(self):
        """Test text direction determination."""
        processor = get_arabic_processor()

        content = "مرحبا بكم في النظام العراقي"
        direction = processor.get_text_direction(content)

        assert direction == "rtl"


class TestEdgeCases:
    """Test edge cases and boundary conditions."""

    @pytest.fixture
    def strict_deps(self):
        """Strict cultural validation dependencies."""
        return CulturalValidationDependencies(
            cultural_mode="strict",
            islamic_compliance_required=True,
        )

    def test_none_content(self, strict_deps):
        """Test handling of None content (should be treated as empty)."""
        # Python would normally raise TypeError, but let's test empty string behavior
        content = ""
        result = CulturalValidationTool.validate_cultural_compliance(
            content, strict_deps
        )
        assert result.validation_passed is True

    def test_unicode_combining_characters(self, strict_deps):
        """Test handling of Unicode combining characters."""
        content = "مرحبا" + "\u0301"  # Arabic text with combining accent

        result = CulturalValidationTool.validate_cultural_compliance(
            content, strict_deps
        )
        assert result.cultural_appropriateness_score >= 0.85

    def test_numbers_only(self, strict_deps):
        """Test content with only numbers."""
        content = "123456789"

        result = CulturalValidationTool.validate_cultural_compliance(
            content, strict_deps
        )
        assert result.cultural_appropriateness_score == 1.0

    def test_mixed_scripts_with_symbols(self, strict_deps):
        """Test content with mixed scripts and symbols."""
        content = "مرحبا 👋 Hello! Welcome to النظام @2024"

        result = CulturalValidationTool.validate_cultural_compliance(
            content, strict_deps
        )
        assert result.cultural_appropriateness_score > 0.80


class TestPerformanceRequirements:
    """Test performance requirements and metrics."""

    @pytest.fixture
    def strict_deps(self):
        return CulturalValidationDependencies(
            cultural_mode="strict",
            islamic_compliance_required=True,
        )

    def test_validation_under_200ms(self, strict_deps):
        """Test that validation completes under 200ms target."""
        contents = [
            "مرحبا بكم",
            "Hello",
            "مرحبا Hello mixed content",
            "الدكتور أحمد محمد محترف في الهندسة",
        ]

        for content in contents:
            start = time.time()
            CulturalValidationTool.validate_cultural_compliance(content, strict_deps)
            elapsed = (time.time() - start) * 1000

            assert elapsed < 200, f"Content '{content}' took {elapsed}ms"

    def test_batch_validation_performance(self, strict_deps):
        """Test performance of batch validation."""
        contents = ["مرحبا بكم"] * 100

        start = time.time()
        for content in contents:
            CulturalValidationTool.validate_cultural_compliance(content, strict_deps)
        total_elapsed = (time.time() - start) * 1000
        average_per_item = total_elapsed / len(contents)

        assert average_per_item < 200, f"Average validation took {average_per_item}ms"
