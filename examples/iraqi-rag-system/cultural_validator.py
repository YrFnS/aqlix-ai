"""
Iraqi Cultural Validator

Provides comprehensive cultural compliance validation for content within Iraqi social,
religious, and professional contexts. Ensures content respects Islamic values,
Iraqi customs, and professional standards across different domains.
"""

from typing import Any, Dict, List, Optional, Tuple
import re
import logging
from dataclasses import dataclass
from enum import Enum

logger = logging.getLogger(__name__)


class CulturalSensitivityLevel(Enum):
    """Levels of cultural sensitivity for different contexts"""

    STRICT = "strict"  # Religious, educational content
    MODERATE = "moderate"  # Professional, business content
    RELAXED = "relaxed"  # General, technical content


class ProfessionalDomain(Enum):
    """Iraqi professional domains with specific cultural requirements"""

    LEGAL = "legal"
    MEDICAL = "medical"
    EDUCATIONAL = "educational"
    GOVERNMENT = "government"
    BUSINESS = "business"
    TECHNICAL = "technical"
    GENERAL = "general"


@dataclass
class CulturalValidationResult:
    """Result of cultural validation process"""

    overall_score: float  # 0.0 to 1.0 overall compliance
    islamic_compliance: float  # Islamic values compliance
    professional_appropriateness: float  # Professional domain appropriateness
    language_appropriateness: float  # Language and terminology appropriateness
    regional_sensitivity: float  # Iraqi regional/tribal sensitivity

    # Detailed feedback
    issues_found: List[str]  # List of cultural issues
    recommendations: List[str]  # Improvement recommendations
    filtered_content: Optional[str]  # Content with problematic parts filtered
    validation_details: Dict[str, Any]  # Detailed validation metadata


class IraqiCulturalValidator:
    """Comprehensive Iraqi cultural intelligence validator"""

    def __init__(self):
        """Initialize with Iraqi cultural knowledge base"""
        self.islamic_guidelines = self._load_islamic_guidelines()
        self.iraqi_customs = self._load_iraqi_customs()
        self.professional_standards = self._load_professional_standards()
        self.sensitive_topics = self._load_sensitive_topics()
        self.language_standards = self._load_language_standards()

        # Performance tracking
        self.validation_stats = {
            "total_validations": 0,
            "cultural_violations": 0,
            "islamic_violations": 0,
            "professional_violations": 0,
            "language_violations": 0,
        }

    def _load_islamic_guidelines(self) -> Dict[str, Any]:
        """Load Islamic compliance guidelines"""
        return {
            "prohibited_content": [
                # Financial/Business
                "interest",
                "riba",
                "ربا",
                "gambling",
                "قمار",
                "lottery",
                "يانصيب",
                "alcohol",
                "خمر",
                "pork",
                "خنزير",
                "casino",
                "كازينو",
                # Social/Moral
                "inappropriate_relationships",
                "adultery",
                "زنا",
                "immodest_content",
                "محتوى غير محتشم",
                # Religious
                "blasphemy",
                "تجديف",
                "religious_mockery",
                "استهزاء_ديني",
            ],
            "encouraged_values": [
                "charity",
                "زكاة",
                "community",
                "مجتمع",
                "family",
                "عائلة",
                "education",
                "تعليم",
                "honesty",
                "صدق",
                "justice",
                "عدالة",
                "respect",
                "احترام",
                "cooperation",
                "تعاون",
            ],
            "business_ethics": [
                "halal_business",
                "حلال",
                "fair_trade",
                "تجارة_عادلة",
                "transparency",
                "شفافية",
                "mutual_benefit",
                "منفعة_متبادلة",
            ],
        }

    def _load_iraqi_customs(self) -> Dict[str, Any]:
        """Load Iraqi cultural customs and traditions"""
        return {
            "family_values": [
                "respect_for_elders",
                "احترام_الكبار",
                "family_honor",
                "شرف_العائلة",
                "hospitality",
                "ضيافة",
                "traditional_roles",
                "أدوار_تقليدية",
            ],
            "social_etiquette": [
                "formal_address",
                "خطاب_رسمي",
                "proper_greetings",
                "تحيات_مناسبة",
                "professional_titles",
                "ألقاب_مهنية",
                "gender_appropriate",
                "مناسب_للجنس",
            ],
            "regional_sensitivity": [
                "avoid_sectarian",
                "تجنب_الطائفية",
                "avoid_tribal",
                "تجنب_القبلية",
                "political_neutrality",
                "حياد_سياسي",
                "inclusive_language",
                "لغة_شاملة",
            ],
        }

    def _load_professional_standards(self) -> Dict[str, Dict[str, Any]]:
        """Load professional domain-specific standards"""
        return {
            "legal": {
                "terminology": ["contract", "عقد", "law", "قانون", "court", "محكمة"],
                "formality_level": "high",
                "cultural_considerations": [
                    "islamic_law_compatibility",
                    "iraqi_legal_system",
                ],
                "prohibited": ["unlawful_advice", "نصائح_غير_قانونية"],
            },
            "medical": {
                "terminology": [
                    "patient",
                    "مريض",
                    "treatment",
                    "علاج",
                    "diagnosis",
                    "تشخيص",
                ],
                "formality_level": "high",
                "cultural_considerations": [
                    "gender_sensitivity",
                    "islamic_medical_ethics",
                ],
                "prohibited": ["unprofessional_advice", "نصائح_غير_مهنية"],
            },
            "educational": {
                "terminology": [
                    "student",
                    "طالب",
                    "curriculum",
                    "منهج",
                    "education",
                    "تعليم",
                ],
                "formality_level": "moderate",
                "cultural_considerations": ["age_appropriate", "value_based_education"],
                "prohibited": ["inappropriate_content", "محتوى_غير_مناسب"],
            },
            "government": {
                "terminology": [
                    "citizen",
                    "مواطن",
                    "service",
                    "خدمة",
                    "ministry",
                    "وزارة",
                ],
                "formality_level": "high",
                "cultural_considerations": ["official_procedures", "citizen_respect"],
                "prohibited": ["political_bias", "تحيز_سياسي"],
            },
        }

    def _load_sensitive_topics(self) -> Dict[str, List[str]]:
        """Load politically and socially sensitive topics to handle carefully"""
        return {
            "political": [
                "sectarian_references",
                "مراجع_طائفية",
                "political_parties",
                "أحزاب_سياسية",
                "government_criticism",
                "انتقاد_الحكومة",
                "electoral_bias",
                "تحيز_انتخابي",
            ],
            "social": [
                "tribal_disputes",
                "نزاعات_عشائرية",
                "ethnic_tensions",
                "توترات_عرقية",
                "religious_disputes",
                "نزاعات_دينية",
                "gender_controversies",
                "جدل_جنسي",
            ],
            "economic": [
                "corruption_allegations",
                "ادعاءات_فساد",
                "economic_bias",
                "تحيز_اقتصادي",
                "resource_disputes",
                "نزاعات_الموارد",
            ],
        }

    def _load_language_standards(self) -> Dict[str, Any]:
        """Load language appropriateness standards"""
        return {
            "formal_arabic": {
                "required_contexts": ["legal", "government", "educational"],
                "honorifics": ["أستاذ", "دكتور", "مهندس", "سيد", "سيدة"],
                "formal_phrases": ["حضرتك", "سيادتك", "معالي", "سعادة"],
            },
            "iraqi_dialect": {
                "appropriate_contexts": ["informal", "local_business", "community"],
                "common_terms": ["شلونك", "وين", "شنو", "زين", "مو"],
                "cultural_expressions": ["ماشاء الله", "إن شاء الله", "الحمد لله"],
            },
            "english_standards": {
                "formality_level": "professional",
                "cultural_adaptation": ["mr", "mrs", "dr", "engineer"],
                "avoid": ["slang", "informal_contractions", "cultural_insensitivity"],
            },
        }

    async def validate_content(
        self,
        content: str,
        domain: str = "general",
        islamic_compliance_required: bool = True,
        sensitivity_level: CulturalSensitivityLevel = CulturalSensitivityLevel.MODERATE,
    ) -> CulturalValidationResult:
        """
        Perform comprehensive cultural validation of content

        Args:
            content: Text content to validate
            domain: Professional domain context
            islamic_compliance_required: Whether Islamic compliance is required
            sensitivity_level: Level of cultural sensitivity required

        Returns:
            CulturalValidationResult with detailed validation scores and feedback
        """
        try:
            logger.info(
                f"Starting cultural validation - Domain: {domain}, "
                f"Islamic required: {islamic_compliance_required}, "
                f"Sensitivity: {sensitivity_level.value}"
            )

            # Initialize validation scores
            validation_scores = {
                "islamic_compliance": 1.0,
                "professional_appropriateness": 1.0,
                "language_appropriateness": 1.0,
                "regional_sensitivity": 1.0,
            }

            issues_found = []
            recommendations = []
            validation_details = {}

            # 1. Islamic Compliance Validation
            if islamic_compliance_required:
                islamic_score, islamic_issues = await self._validate_islamic_compliance(
                    content
                )
                validation_scores["islamic_compliance"] = islamic_score
                issues_found.extend(islamic_issues)
                validation_details["islamic_validation"] = {
                    "score": islamic_score,
                    "issues": islamic_issues,
                }

                if islamic_score < 0.9:
                    recommendations.append("Review content for Islamic compliance")

            # 2. Professional Domain Validation
            prof_score, prof_issues = await self._validate_professional_appropriateness(
                content, domain
            )
            validation_scores["professional_appropriateness"] = prof_score
            issues_found.extend(prof_issues)
            validation_details["professional_validation"] = {
                "score": prof_score,
                "domain": domain,
                "issues": prof_issues,
            }

            # 3. Language and Terminology Validation
            lang_score, lang_issues = await self._validate_language_appropriateness(
                content, domain
            )
            validation_scores["language_appropriateness"] = lang_score
            issues_found.extend(lang_issues)
            validation_details["language_validation"] = {
                "score": lang_score,
                "issues": lang_issues,
            }

            # 4. Regional Sensitivity Validation
            regional_score, regional_issues = await self._validate_regional_sensitivity(
                content
            )
            validation_scores["regional_sensitivity"] = regional_score
            issues_found.extend(regional_issues)
            validation_details["regional_validation"] = {
                "score": regional_score,
                "issues": regional_issues,
            }

            # 5. Calculate Overall Score
            weights = {
                "islamic_compliance": 0.3 if islamic_compliance_required else 0.1,
                "professional_appropriateness": 0.3,
                "language_appropriateness": 0.2,
                "regional_sensitivity": 0.2,
            }

            overall_score = sum(
                validation_scores[key] * weights[key] for key in validation_scores
            )

            # 6. Apply Sensitivity Level Adjustments
            overall_score = self._apply_sensitivity_adjustments(
                overall_score, sensitivity_level, validation_scores
            )

            # 7. Generate Recommendations
            recommendations.extend(
                self._generate_recommendations(validation_scores, domain)
            )

            # 8. Filter Content if Needed
            filtered_content = await self._filter_problematic_content(
                content, issues_found
            )

            # Update statistics
            self._update_validation_stats(validation_scores)

            result = CulturalValidationResult(
                overall_score=overall_score,
                islamic_compliance=validation_scores["islamic_compliance"],
                professional_appropriateness=validation_scores[
                    "professional_appropriateness"
                ],
                language_appropriateness=validation_scores["language_appropriateness"],
                regional_sensitivity=validation_scores["regional_sensitivity"],
                issues_found=issues_found,
                recommendations=recommendations,
                filtered_content=filtered_content,
                validation_details=validation_details,
            )

            logger.info(
                f"Cultural validation completed - Overall score: {overall_score:.2f}, "
                f"Issues found: {len(issues_found)}"
            )

            return result

        except Exception as e:
            logger.error(f"Cultural validation failed: {e}")
            # Return minimal compliance result on error
            return CulturalValidationResult(
                overall_score=0.5,
                islamic_compliance=0.5,
                professional_appropriateness=0.5,
                language_appropriateness=0.5,
                regional_sensitivity=0.5,
                issues_found=[f"Validation error: {str(e)}"],
                recommendations=["Manual review required due to validation error"],
                filtered_content=content,
                validation_details={"error": str(e)},
            )

    async def _validate_islamic_compliance(
        self, content: str
    ) -> Tuple[float, List[str]]:
        """Validate content against Islamic guidelines"""
        issues = []
        score = 1.0

        content_lower = content.lower()

        # Check for prohibited content
        prohibited = self.islamic_guidelines["prohibited_content"]
        for item in prohibited:
            if item in content_lower:
                issues.append(f"Contains prohibited content: {item}")
                score -= 0.2

        # Check for encouraged values (bonus points)
        encouraged = self.islamic_guidelines["encouraged_values"]
        encouragement_bonus = sum(0.05 for item in encouraged if item in content_lower)
        score = min(1.0, score + encouragement_bonus)

        return max(0.0, score), issues

    async def _validate_professional_appropriateness(
        self, content: str, domain: str
    ) -> Tuple[float, List[str]]:
        """Validate content for professional domain appropriateness"""
        issues = []
        score = 1.0

        if domain in self.professional_standards:
            standards = self.professional_standards[domain]

            # Check prohibited content for domain
            prohibited = standards.get("prohibited", [])
            for item in prohibited:
                if item in content.lower():
                    issues.append(f"Contains domain-inappropriate content: {item}")
                    score -= 0.3

            # Check formality level
            formality_required = standards.get("formality_level", "moderate")
            formality_score = await self._assess_formality_level(
                content, formality_required
            )
            if formality_score < 0.7:
                issues.append(f"Content formality too low for {domain} domain")
                score -= 0.2

        return max(0.0, score), issues

    async def _validate_language_appropriateness(
        self, content: str, domain: str
    ) -> Tuple[float, List[str]]:
        """Validate language and terminology appropriateness"""
        issues = []
        score = 1.0

        # Check for appropriate honorifics and formal language
        if domain in ["legal", "government", "medical"]:
            formal_indicators = self.language_standards["formal_arabic"][
                "formal_phrases"
            ]
            has_formal_language = any(phrase in content for phrase in formal_indicators)

            if (
                not has_formal_language and len(content) > 100
            ):  # Only for longer content
                issues.append(
                    "Consider using more formal language for professional context"
                )
                score -= 0.1

        # Check for inappropriate informal language in formal contexts
        if domain in ["legal", "government"] and any(
            slang in content.lower() for slang in ["lol", "omg", "wtf"]
        ):
            issues.append("Informal language inappropriate for professional context")
            score -= 0.3

        return max(0.0, score), issues

    async def _validate_regional_sensitivity(
        self, content: str
    ) -> Tuple[float, List[str]]:
        """Validate content for Iraqi regional sensitivity"""
        issues = []
        score = 1.0

        content_lower = content.lower()

        # Check for sensitive political/social topics
        for category, sensitive_items in self.sensitive_topics.items():
            for item in sensitive_items:
                if item in content_lower:
                    issues.append(f"Contains sensitive {category} content: {item}")
                    score -= 0.2

        return max(0.0, score), issues

    async def _assess_formality_level(self, content: str, required_level: str) -> float:
        """Assess the formality level of content"""
        formal_indicators = [
            "please",
            "thank you",
            "respectfully",
            "sincerely",
            "يرجى",
            "شكرا",
            "باحترام",
            "مع التقدير",
        ]

        informal_indicators = ["hey", "hi", "cool", "awesome", "مرحبا", "زين", "ممتاز"]

        formal_count = sum(
            1 for indicator in formal_indicators if indicator in content.lower()
        )
        informal_count = sum(
            1 for indicator in informal_indicators if indicator in content.lower()
        )

        # Calculate formality score
        total_indicators = formal_count + informal_count
        if total_indicators == 0:
            return 0.7  # Neutral

        formality_ratio = formal_count / total_indicators

        # Map to required level
        level_thresholds = {"high": 0.8, "moderate": 0.5, "relaxed": 0.3}

        required_threshold = level_thresholds.get(required_level, 0.5)
        return (
            1.0
            if formality_ratio >= required_threshold
            else formality_ratio / required_threshold
        )

    def _apply_sensitivity_adjustments(
        self,
        base_score: float,
        sensitivity_level: CulturalSensitivityLevel,
        validation_scores: Dict[str, float],
    ) -> float:
        """Apply sensitivity level adjustments to overall score"""

        if sensitivity_level == CulturalSensitivityLevel.STRICT:
            # In strict mode, any score below 0.9 significantly impacts overall score
            min_acceptable = min(validation_scores.values())
            if min_acceptable < 0.9:
                base_score *= 0.8  # 20% penalty

        elif sensitivity_level == CulturalSensitivityLevel.MODERATE:
            # Moderate mode is more forgiving
            min_acceptable = min(validation_scores.values())
            if min_acceptable < 0.7:
                base_score *= 0.9  # 10% penalty

        # Relaxed mode (default) - no additional penalties

        return base_score

    def _generate_recommendations(
        self, validation_scores: Dict[str, float], domain: str
    ) -> List[str]:
        """Generate improvement recommendations based on validation results"""
        recommendations = []

        if validation_scores["islamic_compliance"] < 0.8:
            recommendations.append("Review content for Islamic values alignment")

        if validation_scores["professional_appropriateness"] < 0.8:
            recommendations.append(
                f"Enhance content for {domain} professional standards"
            )

        if validation_scores["language_appropriateness"] < 0.8:
            recommendations.append("Improve language formality and terminology")

        if validation_scores["regional_sensitivity"] < 0.8:
            recommendations.append("Review content for regional cultural sensitivity")

        return recommendations

    async def _filter_problematic_content(self, content: str, issues: List[str]) -> str:
        """Filter out problematic content sections"""
        # This would implement sophisticated content filtering
        # For now, return original content with warning markers

        if issues:
            warning = "\n[CULTURAL_WARNING: Content may require manual review]\n"
            return warning + content

        return content

    def _update_validation_stats(self, validation_scores: Dict[str, float]):
        """Update validation statistics"""
        self.validation_stats["total_validations"] += 1

        if validation_scores["islamic_compliance"] < 0.8:
            self.validation_stats["islamic_violations"] += 1

        if validation_scores["professional_appropriateness"] < 0.8:
            self.validation_stats["professional_violations"] += 1

        if validation_scores["language_appropriateness"] < 0.8:
            self.validation_stats["language_violations"] += 1

    def get_validation_statistics(self) -> Dict[str, Any]:
        """Get validation performance statistics"""
        total = max(1, self.validation_stats["total_validations"])

        return {
            "total_validations": total,
            "islamic_compliance_rate": 1
            - (self.validation_stats["islamic_violations"] / total),
            "professional_compliance_rate": 1
            - (self.validation_stats["professional_violations"] / total),
            "language_compliance_rate": 1
            - (self.validation_stats["language_violations"] / total),
            "overall_compliance_rate": 1
            - (
                sum(
                    [
                        self.validation_stats["islamic_violations"],
                        self.validation_stats["professional_violations"],
                        self.validation_stats["language_violations"],
                    ]
                )
                / (total * 3)
            ),
        }
