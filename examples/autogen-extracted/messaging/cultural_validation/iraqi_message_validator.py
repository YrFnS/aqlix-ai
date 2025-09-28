"""
Iraqi Message Cultural Validation System

Advanced message validation system for AutoGen multi-agent communications
with Islamic compliance, Arabic language processing, and Iraqi cultural context.
"""

import re
import json
from typing import Dict, List, Any, Optional, Union, Tuple
from dataclasses import dataclass, field
from enum import Enum
from datetime import datetime
import asyncio

# Import AutoGen messaging components
from autogen_core._message_context import MessageContext
from autogen_agentchat.messages import ChatMessage, MessageType

# Import Iraqi enhancements
import sys
import os

sys.path.append(
    os.path.join(os.path.dirname(__file__), "..", "..", "core", "iraqi_enhancements")
)

from cultural_validator import (
    IraqiCulturalValidator,
    CulturalValidationResult,
    ProfessionalDomain,
    CulturalCompliance,
)


class MessageSeverity(Enum):
    """Message validation severity levels"""

    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"


class ValidationRule(Enum):
    """Types of validation rules"""

    ISLAMIC_COMPLIANCE = "islamic_compliance"
    CULTURAL_APPROPRIATENESS = "cultural_appropriateness"
    PROFESSIONAL_ETIQUETTE = "professional_etiquette"
    LANGUAGE_QUALITY = "language_quality"
    CONTENT_SAFETY = "content_safety"
    HIERARCHICAL_RESPECT = "hierarchical_respect"
    GENDER_SENSITIVITY = "gender_sensitivity"
    RELIGIOUS_SENSITIVITY = "religious_sensitivity"


@dataclass
class ValidationIssue:
    """Represents a validation issue found in a message"""

    rule_type: ValidationRule
    severity: MessageSeverity
    description: str
    suggested_fix: str
    confidence_score: float
    location: Optional[str] = None
    context: Dict[str, Any] = field(default_factory=dict)


@dataclass
class MessageValidationResult:
    """Result of message validation"""

    message_id: str
    is_valid: bool
    overall_score: float
    issues: List[ValidationIssue]
    cultural_compliance: CulturalCompliance
    recommendations: List[str]
    auto_correctable: bool
    requires_human_review: bool
    validation_timestamp: str = field(
        default_factory=lambda: datetime.now().isoformat()
    )


class IraqiMessageValidator:
    """
    Comprehensive message validator for Iraqi cultural context
    """

    def __init__(self):
        self.cultural_validator = IraqiCulturalValidator()

        # Load validation rules and patterns
        self.islamic_terms = self._load_islamic_terms()
        self.inappropriate_content = self._load_inappropriate_content_patterns()
        self.professional_greetings = self._load_professional_greetings()
        self.hierarchy_markers = self._load_hierarchy_markers()
        self.gender_sensitive_terms = self._load_gender_sensitive_terms()

        # Validation statistics
        self.validation_stats = {
            "total_validations": 0,
            "passed_validations": 0,
            "failed_validations": 0,
            "issues_by_type": {rule.value: 0 for rule in ValidationRule},
            "average_score": 0.0,
        }

    def _load_islamic_terms(self) -> Dict[str, Any]:
        """Load Islamic terms and their appropriate usage"""
        return {
            "greetings": [
                "السلام عليكم",
                "السلام عليكم ورحمة الله",
                "السلام عليكم ورحمة الله وبركاته",
            ],
            "closings": [
                "والسلام عليكم ورحمة الله وبركاته",
                "بارك الله فيكم",
                "جزاكم الله خيراً",
                "والله ولي التوفيق",
            ],
            "blessed_beginnings": ["بسم الله الرحمن الرحيم", "بسم الله", "الحمد لله"],
            "inappropriate_religious": [
                "wallah",  # Casual use of Allah's name
                "by god",  # English casual reference
                "swear to god",  # Inappropriate oath
            ],
            "professional_religious": [
                "إن شاء الله",
                "بإذن الله",
                "والله أعلم",
                "حفظه الله",
            ],
        }

    def _load_inappropriate_content_patterns(self) -> List[Dict[str, Any]]:
        """Load patterns for inappropriate content detection"""
        return [
            {
                "pattern": r"\b(كحول|خمر|مشروبات كحولية)\b",
                "category": "alcohol",
                "severity": MessageSeverity.ERROR,
                "description": "Reference to alcoholic beverages",
            },
            {
                "pattern": r"\b(فوائد بنكية|ربا|فائدة مالية)\b",
                "category": "riba",
                "severity": MessageSeverity.ERROR,
                "description": "Reference to interest/usury (riba)",
            },
            {
                "pattern": r"\b(قمار|مراهنة|يانصيب)\b",
                "category": "gambling",
                "severity": MessageSeverity.ERROR,
                "description": "Reference to gambling",
            },
            {
                "pattern": r"\b(لحم خنزير|ham|pork)\b",
                "category": "haram_food",
                "severity": MessageSeverity.WARNING,
                "description": "Reference to prohibited food",
            },
            {
                "pattern": r"\b(طائفي|مذهبي|سني|شيعي) .*(سيء|سوء|مشكلة)",
                "category": "sectarian",
                "severity": MessageSeverity.CRITICAL,
                "description": "Potentially sectarian content",
            },
        ]

    def _load_professional_greetings(self) -> Dict[str, List[str]]:
        """Load appropriate professional greetings by context"""
        return {
            "formal": [
                "تحية طيبة وبعد",
                "السلام عليكم ورحمة الله وبركاته",
                "المحترم/المحترمة",
            ],
            "business": ["تحية طيبة", "أهلاً وسهلاً", "مرحباً بكم"],
            "government": [
                "بسم الله الرحمن الرحيم",
                "السلام عليكم ورحمة الله وبركاته",
                "تحية طيبة وبعد",
            ],
            "religious": [
                "بسم الله الرحمن الرحيم",
                "السلام عليكم ورحمة الله وبركاته",
                "الحمد لله رب العالمين",
            ],
        }

    def _load_hierarchy_markers(self) -> Dict[str, Any]:
        """Load hierarchy and respect markers"""
        return {
            "respectful_titles": [
                "أستاذ",
                "دكتور",
                "مهندس",
                "المحترم",
                "المحترمة",
                "فضيلة",
                "معالي",
                "سعادة",
            ],
            "seniority_markers": ["كبير", "أول", "رئيس", "مدير عام", "وكيل", "مستشار"],
            "disrespectful_patterns": [
                r"\bأنت\b(?!\s+(محترم|كريم|فاضل))",  # Direct "you" without respect
                r"\b(اعمل|افعل|قل)\b",  # Direct imperatives
                r"\b(خطأ|غلط|مو صحيح)\s+أنت",  # Direct criticism
            ],
        }

    def _load_gender_sensitive_terms(self) -> Dict[str, Any]:
        """Load gender-sensitive terms and appropriate usage"""
        return {
            "inclusive_terms": [
                "الزملاء والزميلات",
                "الأخوة والأخوات",
                "الحضور الكريم",
                "السادة والسيدات",
            ],
            "avoid_assumptions": [
                r"\bكل الرجال\b",
                r"\bجميع النساء\b",
                r"\bالرجال فقط\b",
                r"\bالنساء فقط\b",
            ],
            "respectful_references": {
                "male": ["الأخ", "الأستاذ", "السيد"],
                "female": ["الأخت", "الأستاذة", "السيدة"],
                "neutral": ["الزميل/ة", "المختص/ة", "المسؤول/ة"],
            },
        }

    async def validate_message(
        self,
        message: Union[ChatMessage, str],
        context: Optional[Dict[str, Any]] = None,
        domain: ProfessionalDomain = ProfessionalDomain.GENERAL,
    ) -> MessageValidationResult:
        """
        Validate a message for Iraqi cultural appropriateness

        Args:
            message: Message to validate (ChatMessage object or string)
            context: Additional context for validation
            domain: Professional domain for context-specific validation

        Returns:
            MessageValidationResult with validation details
        """

        # Extract message content and metadata
        if isinstance(message, ChatMessage):
            content = message.content
            message_id = (
                str(message.source) if hasattr(message, "source") else "unknown"
            )
        else:
            content = message
            message_id = f"msg_{datetime.now().timestamp()}"

        # Initialize validation result
        issues = []
        overall_score = 1.0

        # Update statistics
        self.validation_stats["total_validations"] += 1

        # Perform various validation checks
        issues.extend(await self._check_islamic_compliance(content, context))
        issues.extend(
            await self._check_cultural_appropriateness(content, domain, context)
        )
        issues.extend(
            await self._check_professional_etiquette(content, domain, context)
        )
        issues.extend(await self._check_language_quality(content, context))
        issues.extend(await self._check_content_safety(content, context))
        issues.extend(await self._check_hierarchical_respect(content, context))
        issues.extend(await self._check_gender_sensitivity(content, context))
        issues.extend(await self._check_religious_sensitivity(content, context))

        # Calculate overall score
        if issues:
            # Weight issues by severity
            severity_weights = {
                MessageSeverity.CRITICAL: 0.4,
                MessageSeverity.ERROR: 0.3,
                MessageSeverity.WARNING: 0.2,
                MessageSeverity.INFO: 0.1,
            }

            total_penalty = sum(
                severity_weights.get(issue.severity, 0.1) * (1 - issue.confidence_score)
                for issue in issues
            )
            overall_score = max(0.0, 1.0 - total_penalty)

        # Determine cultural compliance level
        cultural_compliance = self._determine_compliance_level(overall_score, issues)

        # Generate recommendations
        recommendations = self._generate_recommendations(issues, content, domain)

        # Check if auto-correctable or requires human review
        auto_correctable = self._is_auto_correctable(issues)
        requires_human_review = self._requires_human_review(issues, overall_score)

        # Update statistics
        if overall_score >= 0.7:
            self.validation_stats["passed_validations"] += 1
        else:
            self.validation_stats["failed_validations"] += 1

        for issue in issues:
            self.validation_stats["issues_by_type"][issue.rule_type.value] += 1

        # Update average score
        total_validations = self.validation_stats["total_validations"]
        current_avg = self.validation_stats["average_score"]
        self.validation_stats["average_score"] = (
            current_avg * (total_validations - 1) + overall_score
        ) / total_validations

        return MessageValidationResult(
            message_id=message_id,
            is_valid=overall_score >= 0.7,
            overall_score=overall_score,
            issues=issues,
            cultural_compliance=cultural_compliance,
            recommendations=recommendations,
            auto_correctable=auto_correctable,
            requires_human_review=requires_human_review,
        )

    async def _check_islamic_compliance(
        self, content: str, context: Optional[Dict[str, Any]]
    ) -> List[ValidationIssue]:
        """Check Islamic compliance in message content"""

        issues = []
        content_lower = content.lower()

        # Check for inappropriate religious references
        for inappropriate in self.islamic_terms["inappropriate_religious"]:
            if inappropriate in content_lower:
                issues.append(
                    ValidationIssue(
                        rule_type=ValidationRule.ISLAMIC_COMPLIANCE,
                        severity=MessageSeverity.ERROR,
                        description=f"Inappropriate casual use of religious terms: {inappropriate}",
                        suggested_fix="Use formal religious expressions",
                        confidence_score=0.9,
                        location=f"Contains '{inappropriate}'",
                    )
                )

        # Check for prohibited content patterns
        for pattern_info in self.inappropriate_content:
            pattern = re.compile(pattern_info["pattern"], re.IGNORECASE | re.UNICODE)
            matches = pattern.findall(content)

            if matches:
                issues.append(
                    ValidationIssue(
                        rule_type=ValidationRule.ISLAMIC_COMPLIANCE,
                        severity=pattern_info["severity"],
                        description=pattern_info["description"],
                        suggested_fix=f"Remove or rephrase content related to {pattern_info['category']}",
                        confidence_score=0.85,
                        location=f"Matches: {matches}",
                    )
                )

        # Check for appropriate Islamic greetings in formal contexts
        if context and context.get("formal_context", False):
            has_islamic_greeting = any(
                greeting in content for greeting in self.islamic_terms["greetings"]
            )
            has_blessed_beginning = any(
                beginning in content
                for beginning in self.islamic_terms["blessed_beginnings"]
            )

            if not (has_islamic_greeting or has_blessed_beginning):
                issues.append(
                    ValidationIssue(
                        rule_type=ValidationRule.ISLAMIC_COMPLIANCE,
                        severity=MessageSeverity.INFO,
                        description="Formal context should include Islamic greeting",
                        suggested_fix="Add 'بسم الله الرحمن الرحيم' or 'السلام عليكم'",
                        confidence_score=0.7,
                    )
                )

        return issues

    async def _check_cultural_appropriateness(
        self,
        content: str,
        domain: ProfessionalDomain,
        context: Optional[Dict[str, Any]],
    ) -> List[ValidationIssue]:
        """Check cultural appropriateness using base cultural validator"""

        issues = []

        # Use the base cultural validator
        validation_result = self.cultural_validator.validate_message_content(
            content=content, domain=domain, context=context or {}
        )

        # Convert cultural validator issues to validation issues
        for issue_desc in validation_result.issues:
            severity = MessageSeverity.WARNING
            if validation_result.compliance_level == CulturalCompliance.NON_COMPLIANT:
                severity = MessageSeverity.ERROR
            elif (
                validation_result.compliance_level == CulturalCompliance.REQUIRES_REVIEW
            ):
                severity = MessageSeverity.CRITICAL

            issues.append(
                ValidationIssue(
                    rule_type=ValidationRule.CULTURAL_APPROPRIATENESS,
                    severity=severity,
                    description=issue_desc,
                    suggested_fix="Review content for cultural appropriateness",
                    confidence_score=validation_result.confidence_score,
                    context={
                        "cultural_compliance": validation_result.compliance_level.value
                    },
                )
            )

        return issues

    async def _check_professional_etiquette(
        self,
        content: str,
        domain: ProfessionalDomain,
        context: Optional[Dict[str, Any]],
    ) -> List[ValidationIssue]:
        """Check professional etiquette and communication standards"""

        issues = []

        # Check for appropriate greetings based on domain
        domain_greetings = self.professional_greetings.get(
            domain.value if domain != ProfessionalDomain.GENERAL else "formal",
            self.professional_greetings["formal"],
        )

        has_appropriate_greeting = any(
            greeting in content for greeting in domain_greetings
        )

        # Only check for greeting if this appears to be start of conversation
        if (
            len(content) > 50
            and any(
                word in content.lower() for word in ["أول", "بداية", "استهلال", "مرحبا"]
            )
            and not has_appropriate_greeting
        ):
            issues.append(
                ValidationIssue(
                    rule_type=ValidationRule.PROFESSIONAL_ETIQUETTE,
                    severity=MessageSeverity.INFO,
                    description="Message lacks appropriate professional greeting",
                    suggested_fix=f"Consider starting with: {domain_greetings[0]}",
                    confidence_score=0.6,
                )
            )

        # Check for excessive casual language in formal domains
        if domain in [ProfessionalDomain.GOVERNMENT, ProfessionalDomain.LEGAL]:
            casual_patterns = [
                r"\bشلونك\b",  # How are you (very casual)
                r"\bشنو\b",  # What (casual)
                r"\bهاي\b",  # This (casual)
                r"\bياخي\b",  # Casual address
            ]

            for pattern in casual_patterns:
                if re.search(pattern, content, re.IGNORECASE):
                    issues.append(
                        ValidationIssue(
                            rule_type=ValidationRule.PROFESSIONAL_ETIQUETTE,
                            severity=MessageSeverity.WARNING,
                            description="Casual language inappropriate for formal domain",
                            suggested_fix="Use formal Arabic expressions",
                            confidence_score=0.8,
                            location=f"Pattern: {pattern}",
                        )
                    )

        return issues

    async def _check_language_quality(
        self, content: str, context: Optional[Dict[str, Any]]
    ) -> List[ValidationIssue]:
        """Check Arabic language quality and grammar"""

        issues = []

        # Check for excessive code-switching (Arabic-English mixing)
        arabic_pattern = r"[\u0600-\u06FF]+"
        english_pattern = r"[a-zA-Z]+"

        arabic_matches = len(re.findall(arabic_pattern, content))
        english_matches = len(re.findall(english_pattern, content))

        if arabic_matches > 0 and english_matches > 0:
            switch_ratio = min(arabic_matches, english_matches) / max(
                arabic_matches, english_matches
            )

            if switch_ratio > 0.3:  # More than 30% code-switching
                issues.append(
                    ValidationIssue(
                        rule_type=ValidationRule.LANGUAGE_QUALITY,
                        severity=MessageSeverity.INFO,
                        description="Excessive code-switching between Arabic and English",
                        suggested_fix="Use primarily one language or translate technical terms",
                        confidence_score=0.7,
                        context={
                            "arabic_ratio": arabic_matches
                            / (arabic_matches + english_matches)
                        },
                    )
                )

        # Check for common Arabic spelling mistakes
        common_mistakes = {
            "إنشاءالله": "إن شاء الله",
            "مشاءالله": "ما شاء الله",
            "والله اعلم": "والله أعلم",
            "جزاك الله خير": "جزاك الله خيراً",
        }

        for mistake, correction in common_mistakes.items():
            if mistake in content:
                issues.append(
                    ValidationIssue(
                        rule_type=ValidationRule.LANGUAGE_QUALITY,
                        severity=MessageSeverity.WARNING,
                        description=f"Common spelling error: '{mistake}'",
                        suggested_fix=f"Use correct spelling: '{correction}'",
                        confidence_score=0.9,
                        location=f"Error: {mistake}",
                    )
                )

        return issues

    async def _check_content_safety(
        self, content: str, context: Optional[Dict[str, Any]]
    ) -> List[ValidationIssue]:
        """Check content safety and appropriateness"""

        issues = []

        # Check for potentially offensive language
        offensive_patterns = [
            r"\b(كلب|حمار|غبي|أحمق)\b",  # Offensive terms
            r"\b(يا حيوان|يا بهيمة)\b",  # Animal insults
            r"\b(الله يلعنك|تفوّ عليك)\b",  # Cursing
        ]

        for pattern in offensive_patterns:
            if re.search(pattern, content, re.IGNORECASE):
                issues.append(
                    ValidationIssue(
                        rule_type=ValidationRule.CONTENT_SAFETY,
                        severity=MessageSeverity.ERROR,
                        description="Potentially offensive language detected",
                        suggested_fix="Remove offensive terms and use respectful language",
                        confidence_score=0.85,
                        location=f"Pattern: {pattern}",
                    )
                )

        # Check for all-caps (shouting)
        caps_ratio = (
            sum(1 for c in content if c.isupper()) / len(content) if content else 0
        )
        if caps_ratio > 0.3:
            issues.append(
                ValidationIssue(
                    rule_type=ValidationRule.CONTENT_SAFETY,
                    severity=MessageSeverity.WARNING,
                    description="Excessive use of capital letters (may appear as shouting)",
                    suggested_fix="Use normal capitalization",
                    confidence_score=0.7,
                    context={"caps_ratio": caps_ratio},
                )
            )

        return issues

    async def _check_hierarchical_respect(
        self, content: str, context: Optional[Dict[str, Any]]
    ) -> List[ValidationIssue]:
        """Check for appropriate hierarchical respect"""

        issues = []

        # Check for disrespectful patterns
        for pattern in self.hierarchy_markers["disrespectful_patterns"]:
            if re.search(pattern, content, re.IGNORECASE):
                issues.append(
                    ValidationIssue(
                        rule_type=ValidationRule.HIERARCHICAL_RESPECT,
                        severity=MessageSeverity.WARNING,
                        description="Direct or potentially disrespectful communication",
                        suggested_fix="Use more respectful, indirect communication style",
                        confidence_score=0.75,
                        location=f"Pattern: {pattern}",
                    )
                )

        # Check if addressing seniors without titles
        if context and context.get("recipient_seniority", 0) > context.get(
            "sender_seniority", 5
        ):
            has_respectful_title = any(
                title in content
                for title in self.hierarchy_markers["respectful_titles"]
            )

            if not has_respectful_title:
                issues.append(
                    ValidationIssue(
                        rule_type=ValidationRule.HIERARCHICAL_RESPECT,
                        severity=MessageSeverity.INFO,
                        description="Consider using respectful titles when addressing seniors",
                        suggested_fix="Add appropriate title (أستاذ، دكتور، المحترم)",
                        confidence_score=0.6,
                    )
                )

        return issues

    async def _check_gender_sensitivity(
        self, content: str, context: Optional[Dict[str, Any]]
    ) -> List[ValidationIssue]:
        """Check for gender-sensitive language"""

        issues = []

        # Check for gender assumptions
        for assumption_pattern in self.gender_sensitive_terms["avoid_assumptions"]:
            if re.search(assumption_pattern, content, re.IGNORECASE):
                issues.append(
                    ValidationIssue(
                        rule_type=ValidationRule.GENDER_SENSITIVITY,
                        severity=MessageSeverity.WARNING,
                        description="Avoid making assumptions about gender roles",
                        suggested_fix="Use inclusive language",
                        confidence_score=0.7,
                        location=f"Pattern: {assumption_pattern}",
                    )
                )

        # Check for inclusive language usage
        if any(term in content.lower() for term in ["جميع", "كل", "الموظفين"]):
            has_inclusive = any(
                inclusive in content
                for inclusive in self.gender_sensitive_terms["inclusive_terms"]
            )

            if not has_inclusive:
                issues.append(
                    ValidationIssue(
                        rule_type=ValidationRule.GENDER_SENSITIVITY,
                        severity=MessageSeverity.INFO,
                        description="Consider using more inclusive language",
                        suggested_fix="Use terms like 'الزملاء والزميلات' or 'الحضور الكريم'",
                        confidence_score=0.5,
                    )
                )

        return issues

    async def _check_religious_sensitivity(
        self, content: str, context: Optional[Dict[str, Any]]
    ) -> List[ValidationIssue]:
        """Check for religious sensitivity"""

        issues = []

        # Check for inappropriate religious comparisons
        problematic_patterns = [
            r"\b(أفضل من|أسوأ من).*(دين|مذهب|طائفة)",
            r"\b(مسيحي|يهودي|مسلم).*(سيء|جيد|أفضل)",
            r"\b(سني|شيعي).*(خطأ|صحيح|أفضل)",
        ]

        for pattern in problematic_patterns:
            if re.search(pattern, content, re.IGNORECASE):
                issues.append(
                    ValidationIssue(
                        rule_type=ValidationRule.RELIGIOUS_SENSITIVITY,
                        severity=MessageSeverity.CRITICAL,
                        description="Potentially insensitive religious comparison",
                        suggested_fix="Avoid making comparisons between religious groups",
                        confidence_score=0.8,
                        location=f"Pattern: {pattern}",
                    )
                )

        # Check for appropriate religious context
        religious_keywords = ["دين", "شريعة", "إسلام", "قرآن", "حديث"]
        if any(keyword in content.lower() for keyword in religious_keywords):
            # Should have appropriate religious opening
            has_religious_opening = any(
                opening in content
                for opening in self.islamic_terms["blessed_beginnings"]
            )

            if not has_religious_opening and len(content) > 100:
                issues.append(
                    ValidationIssue(
                        rule_type=ValidationRule.RELIGIOUS_SENSITIVITY,
                        severity=MessageSeverity.INFO,
                        description="Religious discussion should include appropriate Islamic opening",
                        suggested_fix="Consider starting with 'بسم الله الرحمن الرحيم'",
                        confidence_score=0.6,
                    )
                )

        return issues

    def _determine_compliance_level(
        self, overall_score: float, issues: List[ValidationIssue]
    ) -> CulturalCompliance:
        """Determine cultural compliance level based on score and issues"""

        # Check for critical issues
        critical_issues = [
            issue for issue in issues if issue.severity == MessageSeverity.CRITICAL
        ]
        if critical_issues:
            return CulturalCompliance.NON_COMPLIANT

        # Check for error-level issues
        error_issues = [
            issue for issue in issues if issue.severity == MessageSeverity.ERROR
        ]
        if error_issues:
            return CulturalCompliance.QUESTIONABLE

        # Based on overall score
        if overall_score >= 0.9:
            return CulturalCompliance.COMPLIANT
        elif overall_score >= 0.7:
            return CulturalCompliance.QUESTIONABLE
        else:
            return CulturalCompliance.NON_COMPLIANT

    def _generate_recommendations(
        self, issues: List[ValidationIssue], content: str, domain: ProfessionalDomain
    ) -> List[str]:
        """Generate actionable recommendations based on issues"""

        recommendations = []

        # Group issues by type
        issues_by_type = {}
        for issue in issues:
            if issue.rule_type not in issues_by_type:
                issues_by_type[issue.rule_type] = []
            issues_by_type[issue.rule_type].append(issue)

        # Generate type-specific recommendations
        if ValidationRule.ISLAMIC_COMPLIANCE in issues_by_type:
            recommendations.append(
                "Review content for Islamic compliance - avoid references to prohibited items and use appropriate religious language"
            )

        if ValidationRule.CULTURAL_APPROPRIATENESS in issues_by_type:
            recommendations.append(
                "Ensure content respects Iraqi cultural values and traditions"
            )

        if ValidationRule.PROFESSIONAL_ETIQUETTE in issues_by_type:
            recommendations.append(
                f"Use appropriate professional communication style for {domain.value} domain"
            )

        if ValidationRule.HIERARCHICAL_RESPECT in issues_by_type:
            recommendations.append(
                "Show proper respect for hierarchy using appropriate titles and indirect communication"
            )

        if ValidationRule.GENDER_SENSITIVITY in issues_by_type:
            recommendations.append("Use inclusive language that respects all genders")

        if ValidationRule.RELIGIOUS_SENSITIVITY in issues_by_type:
            recommendations.append(
                "Handle religious topics with sensitivity and avoid comparisons between faiths"
            )

        if ValidationRule.LANGUAGE_QUALITY in issues_by_type:
            recommendations.append(
                "Improve Arabic language quality and reduce excessive code-switching"
            )

        if ValidationRule.CONTENT_SAFETY in issues_by_type:
            recommendations.append(
                "Remove offensive language and use respectful communication"
            )

        # Add general recommendation if no specific issues
        if not recommendations:
            recommendations.append(
                "Message meets cultural standards - consider minor improvements for enhanced professionalism"
            )

        return recommendations

    def _is_auto_correctable(self, issues: List[ValidationIssue]) -> bool:
        """Check if issues can be auto-corrected"""

        auto_correctable_types = [
            ValidationRule.LANGUAGE_QUALITY,
            ValidationRule.PROFESSIONAL_ETIQUETTE,
        ]

        # Only auto-correctable if all issues are of correctable types and not critical
        for issue in issues:
            if (
                issue.rule_type not in auto_correctable_types
                or issue.severity == MessageSeverity.CRITICAL
            ):
                return False

        return True

    def _requires_human_review(
        self, issues: List[ValidationIssue], score: float
    ) -> bool:
        """Check if message requires human review"""

        # Always require human review for critical issues
        critical_issues = [
            issue for issue in issues if issue.severity == MessageSeverity.CRITICAL
        ]
        if critical_issues:
            return True

        # Require review for low scores
        if score < 0.5:
            return True

        # Require review for sensitive topics
        sensitive_types = [
            ValidationRule.RELIGIOUS_SENSITIVITY,
            ValidationRule.ISLAMIC_COMPLIANCE,
        ]

        sensitive_issues = [
            issue for issue in issues if issue.rule_type in sensitive_types
        ]
        if sensitive_issues:
            return True

        return False

    async def auto_correct_message(
        self, content: str, validation_result: MessageValidationResult
    ) -> Tuple[str, List[str]]:
        """
        Attempt to auto-correct message issues

        Args:
            content: Original message content
            validation_result: Validation result with issues

        Returns:
            Tuple of (corrected_content, applied_corrections)
        """

        if not validation_result.auto_correctable:
            return content, []

        corrected_content = content
        applied_corrections = []

        # Apply language quality corrections
        language_issues = [
            issue
            for issue in validation_result.issues
            if issue.rule_type == ValidationRule.LANGUAGE_QUALITY
        ]

        for issue in language_issues:
            if "Error:" in issue.location:
                mistake = issue.location.split("Error: ")[1]
                correction = (
                    issue.suggested_fix.split("'")[1]
                    if "'" in issue.suggested_fix
                    else ""
                )

                if mistake in corrected_content and correction:
                    corrected_content = corrected_content.replace(mistake, correction)
                    applied_corrections.append(
                        f"Corrected '{mistake}' to '{correction}'"
                    )

        # Apply professional etiquette corrections
        etiquette_issues = [
            issue
            for issue in validation_result.issues
            if issue.rule_type == ValidationRule.PROFESSIONAL_ETIQUETTE
        ]

        for issue in etiquette_issues:
            if "lacks appropriate professional greeting" in issue.description:
                if (
                    issue.suggested_fix
                    and "Consider starting with:" in issue.suggested_fix
                ):
                    greeting = issue.suggested_fix.split("Consider starting with: ")[1]
                    corrected_content = f"{greeting}\n\n{corrected_content}"
                    applied_corrections.append(
                        f"Added professional greeting: {greeting}"
                    )

        return corrected_content, applied_corrections

    def get_validation_statistics(self) -> Dict[str, Any]:
        """Get validation statistics"""
        return self.validation_stats.copy()

    def reset_statistics(self) -> None:
        """Reset validation statistics"""
        self.validation_stats = {
            "total_validations": 0,
            "passed_validations": 0,
            "failed_validations": 0,
            "issues_by_type": {rule.value: 0 for rule in ValidationRule},
            "average_score": 0.0,
        }


# Example usage and testing
async def main():
    """Example usage of Iraqi message validator"""

    validator = IraqiMessageValidator()

    # Test messages
    test_messages = [
        {
            "content": "السلام عليكم ورحمة الله وبركاته، أحتاج مساعدة في مشروع تجاري يتطلب تمويل إسلامي.",
            "context": {"formal_context": True},
            "domain": ProfessionalDomain.BUSINESS,
        },
        {
            "content": "wallah هذا المشروع فيه ربا وكحول، بس نقدر نعمله",
            "context": {},
            "domain": ProfessionalDomain.BUSINESS,
        },
        {
            "content": "شلونك أخي؟ شنو رأيك بالاستثمار هاي؟",
            "context": {"formal_context": True},
            "domain": ProfessionalDomain.GOVERNMENT,
        },
        {
            "content": "بسم الله الرحمن الرحيم، نحن في الشركة نلتزم بالمبادئ الإسلامية في جميع معاملاتنا التجارية.",
            "context": {"formal_context": True},
            "domain": ProfessionalDomain.BUSINESS,
        },
    ]

    print("Iraqi Message Validation System Test Results:")
    print("=" * 60)

    for i, test_case in enumerate(test_messages, 1):
        print(f"\nTest Message {i}:")
        print(f"Content: {test_case['content']}")
        print(f"Domain: {test_case['domain'].value}")

        result = await validator.validate_message(
            message=test_case["content"],
            context=test_case["context"],
            domain=test_case["domain"],
        )

        print(f"Valid: {result.is_valid}")
        print(f"Score: {result.overall_score:.2f}")
        print(f"Cultural Compliance: {result.cultural_compliance.value}")
        print(f"Issues: {len(result.issues)}")

        for issue in result.issues:
            print(f"  - {issue.severity.value.upper()}: {issue.description}")
            print(f"    Fix: {issue.suggested_fix}")

        print(f"Recommendations:")
        for rec in result.recommendations:
            print(f"  • {rec}")

        # Test auto-correction if applicable
        if result.auto_correctable:
            corrected, corrections = await validator.auto_correct_message(
                test_case["content"], result
            )
            print(f"Auto-corrected: {corrected}")
            print(f"Applied corrections: {corrections}")

        print("-" * 40)

    # Print validation statistics
    stats = validator.get_validation_statistics()
    print(f"\nValidation Statistics:")
    print(f"Total validations: {stats['total_validations']}")
    print(f"Passed: {stats['passed_validations']}")
    print(f"Failed: {stats['failed_validations']}")
    print(f"Average score: {stats['average_score']:.2f}")
    print(f"Issues by type: {stats['issues_by_type']}")


if __name__ == "__main__":
    asyncio.run(main())
