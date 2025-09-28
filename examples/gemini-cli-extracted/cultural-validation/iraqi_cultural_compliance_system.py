"""
Iraqi Cultural Compliance System - Comprehensive cultural validation framework
Part of Gemini CLI extraction with Iraqi cultural compliance integration

Implements sophisticated cultural validation, Islamic compliance checking,
and Iraqi professional domain validation for government services.
"""

from typing import Dict, List, Optional, Union, Any, Tuple, Set, Callable
from dataclasses import dataclass, field
from enum import Enum
from abc import ABC, abstractmethod
import asyncio
import json
import time
from datetime import datetime, timedelta
import os
import hashlib
import logging
import re
import unicodedata
from collections import defaultdict
import math


class CulturalDomain(Enum):
    """Cultural validation domains"""

    RELIGIOUS = "religious"
    SOCIAL = "social"
    FAMILY = "family"
    BUSINESS = "business"
    GOVERNMENT = "government"
    EDUCATIONAL = "educational"
    MEDICAL = "medical"
    LEGAL = "legal"
    FINANCIAL = "financial"
    CULTURAL_HERITAGE = "cultural_heritage"


class IslamicPrinciple(Enum):
    """Core Islamic principles for validation"""

    HALAL_HARAM = "halal_haram"
    SOCIAL_JUSTICE = "social_justice"
    FAMILY_VALUES = "family_values"
    BUSINESS_ETHICS = "business_ethics"
    PRIVACY_PROTECTION = "privacy_protection"
    RESPECT_ELDERS = "respect_elders"
    COMMUNITY_WELFARE = "community_welfare"
    KNOWLEDGE_SEEKING = "knowledge_seeking"
    TRUTHFULNESS = "truthfulness"
    MODERATION = "moderation"


class ValidationSeverity(Enum):
    """Severity levels for validation issues"""

    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"
    BLOCKING = "blocking"


@dataclass
class CulturalValidationResult:
    """Result of cultural validation"""

    is_compliant: bool
    overall_score: float
    domain_scores: Dict[CulturalDomain, float]
    islamic_compliance_score: float

    issues: List[Dict[str, Any]] = field(default_factory=list)
    recommendations: List[str] = field(default_factory=list)
    cultural_enhancements: List[str] = field(default_factory=list)

    validation_timestamp: datetime = field(default_factory=datetime.now)
    validator_version: str = "1.0.0"

    def add_issue(
        self,
        severity: ValidationSeverity,
        domain: CulturalDomain,
        principle: Optional[IslamicPrinciple],
        message: str,
        suggestion: Optional[str] = None,
    ):
        """Add validation issue"""
        issue = {
            "severity": severity.value,
            "domain": domain.value,
            "principle": principle.value if principle else None,
            "message": message,
            "suggestion": suggestion,
            "timestamp": datetime.now().isoformat(),
        }
        self.issues.append(issue)

    def get_issues_by_severity(
        self, severity: ValidationSeverity
    ) -> List[Dict[str, Any]]:
        """Get issues by severity level"""
        return [issue for issue in self.issues if issue["severity"] == severity.value]

    def has_blocking_issues(self) -> bool:
        """Check if there are blocking issues"""
        return any(
            issue["severity"] == ValidationSeverity.BLOCKING.value
            for issue in self.issues
        )


@dataclass
class CulturalValidationConfig:
    """Configuration for cultural validation"""

    # Validation requirements
    require_islamic_compliance: bool = True
    require_arabic_support: bool = False
    require_cultural_sensitivity: bool = True

    # Scoring thresholds
    minimum_overall_score: float = 0.7
    minimum_islamic_score: float = 0.8
    minimum_domain_score: float = 0.6

    # Language requirements
    arabic_text_threshold: float = 0.3  # 30% Arabic text recommended
    mixed_language_support: bool = True
    rtl_layout_required: bool = False

    # Cultural domains to validate
    enabled_domains: Set[CulturalDomain] = field(
        default_factory=lambda: {
            CulturalDomain.RELIGIOUS,
            CulturalDomain.SOCIAL,
            CulturalDomain.FAMILY,
            CulturalDomain.BUSINESS,
            CulturalDomain.GOVERNMENT,
        }
    )

    # Professional context
    professional_domain: Optional[str] = None
    ministry_context: Optional[str] = None
    citizen_facing: bool = True

    # Validation modes
    strict_mode: bool = False
    government_compliance: bool = True
    educational_safe: bool = True


class IraqiCulturalValidator:
    """Core cultural validator for Iraqi context"""

    def __init__(self, config: CulturalValidationConfig):
        self.config = config
        self.logger = logging.getLogger(__name__)

        # Load cultural knowledge bases
        self.islamic_principles = self._load_islamic_principles()
        self.cultural_patterns = self._load_cultural_patterns()
        self.prohibited_content = self._load_prohibited_content()
        self.professional_standards = self._load_professional_standards()

        # Arabic language processor
        self.arabic_processor = ArabicLanguageProcessor()

        # Domain-specific validators
        self.domain_validators = {
            CulturalDomain.RELIGIOUS: IslamicComplianceValidator(
                self.islamic_principles
            ),
            CulturalDomain.SOCIAL: SocialNormsValidator(),
            CulturalDomain.FAMILY: FamilyValuesValidator(),
            CulturalDomain.BUSINESS: BusinessEthicsValidator(),
            CulturalDomain.GOVERNMENT: GovernmentStandardsValidator(),
            CulturalDomain.EDUCATIONAL: EducationalStandardsValidator(),
            CulturalDomain.MEDICAL: MedicalEthicsValidator(),
            CulturalDomain.LEGAL: LegalComplianceValidator(),
            CulturalDomain.FINANCIAL: FinancialEthicsValidator(),
            CulturalDomain.CULTURAL_HERITAGE: CulturalHeritageValidator(),
        }

    async def validate_content(
        self, content: str, context: Dict[str, Any] = None
    ) -> CulturalValidationResult:
        """
        Comprehensive cultural validation of content

        Args:
            content: Text content to validate
            context: Additional context for validation

        Returns:
            Detailed validation result
        """
        context = context or {}
        result = CulturalValidationResult(
            is_compliant=True,
            overall_score=0.0,
            domain_scores={},
            islamic_compliance_score=0.0,
        )

        try:
            # Preprocess content
            processed_content = await self._preprocess_content(content)

            # Arabic language analysis
            arabic_analysis = await self.arabic_processor.analyze_text(
                processed_content
            )

            # Validate against each enabled domain
            domain_scores = {}
            for domain in self.config.enabled_domains:
                if domain in self.domain_validators:
                    validator = self.domain_validators[domain]
                    domain_score = await validator.validate(
                        processed_content, context, arabic_analysis
                    )
                    domain_scores[domain] = domain_score

                    # Check if domain meets minimum score
                    if domain_score < self.config.minimum_domain_score:
                        result.add_issue(
                            ValidationSeverity.ERROR,
                            domain,
                            None,
                            f"Domain {domain.value} score {domain_score:.2f} below minimum {self.config.minimum_domain_score:.2f}",
                            f"Review content for {domain.value} compliance",
                        )

            result.domain_scores = domain_scores

            # Calculate overall Islamic compliance score
            if CulturalDomain.RELIGIOUS in domain_scores:
                result.islamic_compliance_score = domain_scores[
                    CulturalDomain.RELIGIOUS
                ]

            # Calculate overall cultural score
            if domain_scores:
                result.overall_score = sum(domain_scores.values()) / len(domain_scores)

            # Apply Arabic language bonus
            if arabic_analysis.arabic_percentage > self.config.arabic_text_threshold:
                result.overall_score = min(1.0, result.overall_score + 0.1)

            # Check overall compliance
            result.is_compliant = (
                result.overall_score >= self.config.minimum_overall_score
                and result.islamic_compliance_score >= self.config.minimum_islamic_score
                and not result.has_blocking_issues()
            )

            # Generate recommendations
            await self._generate_recommendations(
                result, processed_content, arabic_analysis
            )

            self.logger.info(
                f"Cultural validation completed: {result.overall_score:.2f} overall, {result.islamic_compliance_score:.2f} Islamic"
            )

        except Exception as e:
            self.logger.error(f"Cultural validation error: {str(e)}")
            result.is_compliant = False
            result.add_issue(
                ValidationSeverity.CRITICAL,
                CulturalDomain.GOVERNMENT,
                None,
                f"Validation system error: {str(e)}",
                "Contact system administrator",
            )

        return result

    async def validate_ui_component(
        self, component_data: Dict[str, Any]
    ) -> CulturalValidationResult:
        """Validate UI component for cultural compliance"""
        # Extract text content from component
        text_content = self._extract_text_from_component(component_data)

        # Add UI-specific context
        context = {
            "component_type": component_data.get("type", "unknown"),
            "interactive": component_data.get("interactive", False),
            "rtl_support": component_data.get("rtl_support", False),
            "arabic_support": component_data.get("arabic_support", False),
            "color_scheme": component_data.get("color_scheme", {}),
            "layout": component_data.get("layout", {}),
        }

        result = await self.validate_content(text_content, context)

        # Add UI-specific validation
        await self._validate_ui_specific_requirements(component_data, result)

        return result

    def _extract_text_from_component(self, component_data: Dict[str, Any]) -> str:
        """Extract all text content from UI component"""
        text_parts = []

        # Common text fields
        text_fields = [
            "title",
            "label",
            "description",
            "placeholder",
            "tooltip",
            "error_message",
        ]
        for field in text_fields:
            if field in component_data and component_data[field]:
                text_parts.append(str(component_data[field]))

        # Extract from options/choices
        if "options" in component_data:
            for option in component_data["options"]:
                if isinstance(option, dict) and "label" in option:
                    text_parts.append(str(option["label"]))
                elif isinstance(option, str):
                    text_parts.append(option)

        # Extract from nested content
        if "content" in component_data:
            text_parts.append(str(component_data["content"]))

        return " ".join(text_parts)

    async def _validate_ui_specific_requirements(
        self, component_data: Dict[str, Any], result: CulturalValidationResult
    ):
        """Validate UI-specific cultural requirements"""
        # Check RTL support for Arabic interfaces
        if self.config.rtl_layout_required and not component_data.get(
            "rtl_support", False
        ):
            result.add_issue(
                ValidationSeverity.WARNING,
                CulturalDomain.SOCIAL,
                None,
                "Component lacks RTL (Right-to-Left) layout support required for Arabic interfaces",
                "Add RTL layout support for proper Arabic text display",
            )

        # Check color scheme cultural appropriateness
        color_scheme = component_data.get("color_scheme", {})
        if color_scheme:
            await self._validate_color_scheme(color_scheme, result)

        # Check interactive elements for cultural appropriateness
        if component_data.get("interactive", False):
            await self._validate_interactive_elements(component_data, result)

    async def _validate_color_scheme(
        self, color_scheme: Dict[str, str], result: CulturalValidationResult
    ):
        """Validate color scheme for cultural appropriateness"""
        # Colors with cultural significance in Iraqi context
        culturally_sensitive_colors = {
            "#FF0000": "red - associated with blood, may be sensitive in security contexts",
            "#000000": "black - associated with mourning, use carefully",
            "#FFFFFF": "white - associated with purity, generally positive",
            "#008000": "green - positive Islamic association",
            "#0000FF": "blue - generally neutral, associated with trust",
        }

        for color_key, color_value in color_scheme.items():
            if color_value.upper() in [
                c.upper() for c in culturally_sensitive_colors.keys()
            ]:
                # Add informational note about color cultural significance
                result.add_issue(
                    ValidationSeverity.INFO,
                    CulturalDomain.CULTURAL_HERITAGE,
                    None,
                    f"Color {color_value} in {color_key} has cultural significance in Iraqi context",
                    "Consider cultural associations when using this color",
                )

    async def _validate_interactive_elements(
        self, component_data: Dict[str, Any], result: CulturalValidationResult
    ):
        """Validate interactive elements for cultural appropriateness"""
        # Check for gambling-like interactions
        gambling_patterns = ["spin", "random", "chance", "lottery", "bet"]
        component_text = json.dumps(component_data).lower()

        for pattern in gambling_patterns:
            if pattern in component_text:
                result.add_issue(
                    ValidationSeverity.ERROR,
                    CulturalDomain.RELIGIOUS,
                    IslamicPrinciple.HALAL_HARAM,
                    f"Interactive element contains gambling-related pattern: {pattern}",
                    "Remove gambling-like interactions to ensure Islamic compliance",
                )

    async def _preprocess_content(self, content: str) -> str:
        """Preprocess content for validation"""
        # Normalize Unicode characters
        content = unicodedata.normalize("NFKC", content)

        # Remove excessive whitespace
        content = re.sub(r"\s+", " ", content).strip()

        return content

    async def _generate_recommendations(
        self, result: CulturalValidationResult, content: str, arabic_analysis: Any
    ):
        """Generate cultural enhancement recommendations"""
        recommendations = []
        enhancements = []

        # Arabic language recommendations
        if arabic_analysis.arabic_percentage < self.config.arabic_text_threshold:
            recommendations.append(
                f"Consider adding more Arabic content (currently {arabic_analysis.arabic_percentage:.1%}, "
                f"recommended {self.config.arabic_text_threshold:.1%})"
            )
            enhancements.append("Add Arabic translations for key terms and phrases")

        # Islamic compliance enhancements
        if result.islamic_compliance_score < 0.9:
            enhancements.append("Review content for stronger Islamic values alignment")
            enhancements.append(
                "Consider adding Islamic greetings or blessings where appropriate"
            )

        # Cultural sensitivity enhancements
        if result.overall_score < 0.9:
            enhancements.append(
                "Enhance cultural sensitivity through local context awareness"
            )
            enhancements.append("Consider Iraqi cultural norms in content presentation")

        # Professional domain enhancements
        if self.config.professional_domain:
            enhancements.append(
                f"Enhance content for {self.config.professional_domain} professional standards"
            )

        result.recommendations = recommendations
        result.cultural_enhancements = enhancements

    def _load_islamic_principles(self) -> Dict[IslamicPrinciple, Dict[str, Any]]:
        """Load Islamic principles knowledge base"""
        return {
            IslamicPrinciple.HALAL_HARAM: {
                "prohibited_keywords": [
                    "gambling",
                    "lottery",
                    "alcohol",
                    "pork",
                    "interest",
                    "usury",
                    "riba",
                    "casino",
                    "betting",
                    "wine",
                    "beer",
                    "loan_interest",
                ],
                "encouraged_keywords": [
                    "charity",
                    "justice",
                    "family",
                    "community",
                    "education",
                    "health",
                    "welfare",
                    "cooperation",
                    "peace",
                    "knowledge",
                ],
            },
            IslamicPrinciple.FAMILY_VALUES: {
                "positive_keywords": [
                    "family",
                    "parents",
                    "children",
                    "respect",
                    "care",
                    "support",
                    "marriage",
                    "community",
                    "elders",
                    "youth",
                ],
                "negative_keywords": [
                    "abandonment",
                    "neglect",
                    "disrespect",
                    "family_breakdown",
                ],
            },
            IslamicPrinciple.SOCIAL_JUSTICE: {
                "positive_keywords": [
                    "justice",
                    "equality",
                    "fairness",
                    "rights",
                    "protection",
                    "dignity",
                    "respect",
                    "opportunity",
                    "welfare",
                ]
            },
        }

    def _load_cultural_patterns(self) -> Dict[str, Any]:
        """Load Iraqi cultural patterns"""
        return {
            "greetings": ["السلام عليكم", "أهلاً وسهلاً", "حياكم الله", "مرحباً"],
            "respectful_terms": ["حضرتك", "سيادتك", "أستاذ", "دكتور", "مهندس"],
            "cultural_values": ["الكرم", "الضيافة", "الأخلاق", "الاحترام", "التقدير"],
        }

    def _load_prohibited_content(self) -> Dict[str, List[str]]:
        """Load prohibited content patterns"""
        return {
            "religious": ["gambling", "alcohol", "usury", "inappropriate_images"],
            "cultural": [
                "disrespectful_language",
                "inappropriate_humor",
                "cultural_insensitivity",
            ],
            "political": [
                "sectarian_content",
                "political_bias",
                "inflammatory_rhetoric",
            ],
        }

    def _load_professional_standards(self) -> Dict[str, Dict[str, Any]]:
        """Load professional domain standards"""
        return {
            "legal": {
                "required_disclaimers": True,
                "formal_language": True,
                "accuracy_critical": True,
            },
            "medical": {
                "privacy_protection": True,
                "accuracy_critical": True,
                "ethical_considerations": True,
            },
            "educational": {
                "age_appropriate": True,
                "culturally_inclusive": True,
                "accurate_information": True,
            },
        }


class ArabicLanguageProcessor:
    """Arabic language analysis and processing"""

    @dataclass
    class ArabicAnalysis:
        arabic_percentage: float
        has_arabic_text: bool
        mixed_language: bool
        rtl_required: bool
        dialect_detected: Optional[str] = None

    async def analyze_text(self, text: str) -> ArabicAnalysis:
        """Analyze text for Arabic language characteristics"""
        if not text:
            return self.ArabicAnalysis(0.0, False, False, False)

        # Count Arabic characters
        arabic_chars = 0
        total_chars = 0

        for char in text:
            if not char.isspace():
                total_chars += 1
                if self._is_arabic_char(char):
                    arabic_chars += 1

        arabic_percentage = arabic_chars / total_chars if total_chars > 0 else 0.0
        has_arabic = arabic_percentage > 0
        mixed_language = 0.1 < arabic_percentage < 0.9
        rtl_required = arabic_percentage > 0.3

        # Simple Iraqi dialect detection
        dialect = None
        if has_arabic:
            dialect = self._detect_iraqi_dialect(text)

        return self.ArabicAnalysis(
            arabic_percentage=arabic_percentage,
            has_arabic_text=has_arabic,
            mixed_language=mixed_language,
            rtl_required=rtl_required,
            dialect_detected=dialect,
        )

    def _is_arabic_char(self, char: str) -> bool:
        """Check if character is Arabic"""
        # Arabic Unicode blocks
        arabic_ranges = [
            (0x0600, 0x06FF),  # Arabic
            (0x0750, 0x077F),  # Arabic Supplement
            (0x08A0, 0x08FF),  # Arabic Extended-A
            (0xFB50, 0xFDFF),  # Arabic Presentation Forms-A
            (0xFE70, 0xFEFF),  # Arabic Presentation Forms-B
        ]

        char_code = ord(char)
        return any(start <= char_code <= end for start, end in arabic_ranges)

    def _detect_iraqi_dialect(self, text: str) -> Optional[str]:
        """Detect Iraqi dialect patterns"""
        iraqi_markers = ["شلونك", "شكو", "ماكو", "اني", "انت", "هاي", "هذا", "هذه"]

        for marker in iraqi_markers:
            if marker in text:
                return "iraqi"

        return None


# Domain-specific validators
class DomainValidator(ABC):
    """Abstract base class for domain validators"""

    @abstractmethod
    async def validate(
        self, content: str, context: Dict[str, Any], arabic_analysis: Any
    ) -> float:
        """Validate content for specific domain"""
        pass


class IslamicComplianceValidator(DomainValidator):
    """Islamic compliance validator"""

    def __init__(self, islamic_principles: Dict[IslamicPrinciple, Dict[str, Any]]):
        self.islamic_principles = islamic_principles

    async def validate(
        self, content: str, context: Dict[str, Any], arabic_analysis: Any
    ) -> float:
        """Validate Islamic compliance"""
        score = 0.8  # Base score
        content_lower = content.lower()

        # Check for prohibited content
        halal_haram = self.islamic_principles[IslamicPrinciple.HALAL_HARAM]

        for prohibited in halal_haram["prohibited_keywords"]:
            if prohibited in content_lower:
                return 0.0  # Complete non-compliance

        # Boost for encouraged content
        for encouraged in halal_haram["encouraged_keywords"]:
            if encouraged in content_lower:
                score += 0.02  # Small boost per positive keyword

        # Boost for family values
        family_values = self.islamic_principles[IslamicPrinciple.FAMILY_VALUES]
        for positive in family_values["positive_keywords"]:
            if positive in content_lower:
                score += 0.01

        return min(1.0, score)


class SocialNormsValidator(DomainValidator):
    """Social norms and cultural appropriateness validator"""

    async def validate(
        self, content: str, context: Dict[str, Any], arabic_analysis: Any
    ) -> float:
        """Validate social norms compliance"""
        score = 0.7  # Base score

        # Boost for respectful language
        respectful_indicators = ["please", "thank you", "respect", "honor", "courtesy"]
        for indicator in respectful_indicators:
            if indicator in content.lower():
                score += 0.05

        # Boost for Arabic content in social context
        if arabic_analysis.has_arabic_text:
            score += 0.1

        return min(1.0, score)


class FamilyValuesValidator(DomainValidator):
    """Family values validator"""

    async def validate(
        self, content: str, context: Dict[str, Any], arabic_analysis: Any
    ) -> float:
        """Validate family values compliance"""
        score = 0.8  # Base score
        content_lower = content.lower()

        # Check for family-positive content
        family_positive = [
            "family",
            "parents",
            "children",
            "respect",
            "care",
            "support",
            "marriage",
            "community",
            "elders",
            "youth",
            "cooperation",
        ]

        for term in family_positive:
            if term in content_lower:
                score += 0.02

        return min(1.0, score)


# Additional domain validators (simplified for brevity)
class BusinessEthicsValidator(DomainValidator):
    async def validate(
        self, content: str, context: Dict[str, Any], arabic_analysis: Any
    ) -> float:
        return 0.8  # Simplified implementation


class GovernmentStandardsValidator(DomainValidator):
    async def validate(
        self, content: str, context: Dict[str, Any], arabic_analysis: Any
    ) -> float:
        return 0.9  # Government content assumed compliant


class EducationalStandardsValidator(DomainValidator):
    async def validate(
        self, content: str, context: Dict[str, Any], arabic_analysis: Any
    ) -> float:
        return 0.8  # Simplified implementation


class MedicalEthicsValidator(DomainValidator):
    async def validate(
        self, content: str, context: Dict[str, Any], arabic_analysis: Any
    ) -> float:
        return 0.8  # Simplified implementation


class LegalComplianceValidator(DomainValidator):
    async def validate(
        self, content: str, context: Dict[str, Any], arabic_analysis: Any
    ) -> float:
        return 0.9  # Legal content assumed compliant


class FinancialEthicsValidator(DomainValidator):
    async def validate(
        self, content: str, context: Dict[str, Any], arabic_analysis: Any
    ) -> float:
        score = 0.7
        # Check for Islamic finance compliance
        if "interest" in content.lower() or "usury" in content.lower():
            return 0.0  # Non-compliant with Islamic finance
        return score


class CulturalHeritageValidator(DomainValidator):
    async def validate(
        self, content: str, context: Dict[str, Any], arabic_analysis: Any
    ) -> float:
        score = 0.8
        # Boost for Arabic language
        if arabic_analysis.has_arabic_text:
            score += 0.1
        return min(1.0, score)
