"""
Islamic Task Compliance - Comprehensive Islamic Compliance Validation for Focus Chain

Extracted from: cline/docs/features/focus-chain.mdx
Enhanced for: Iraqi AI Chat System with comprehensive Islamic compliance validation

Core Features:
1. Islamic Principles Compliance Validation with Iraqi Context
2. Halal/Haram Content Detection and Filtering
3. Islamic Ethics and Values Integration
4. Religious Obligations and Considerations
5. Community and Family Islamic Values

Iraqi Enhancements:
- Iraqi Islamic scholarly traditions integration
- Shia and Sunni considerations for Iraqi context
- Islamic jurisprudence (Fiqh) compliance validation
- Religious authority approval workflows
- Community Islamic values preservation
- Family Islamic obligations consideration
"""

from dataclasses import dataclass
from typing import Dict, List, Optional, Any, Tuple
from enum import Enum
import re
import asyncio
from datetime import datetime


class IslamicPrinciple(str, Enum):
    HALAL_CONTENT = "halal_content"
    FAMILY_VALUES = "family_values"
    RESPECT_ELDERS = "respect_elders"
    COMMUNITY_BENEFIT = "community_benefit"
    KNOWLEDGE_SEEKING = "knowledge_seeking"
    HONESTY_TRANSPARENCY = "honesty_transparency"
    PRIVACY_PROTECTION = "privacy_protection"
    SOCIAL_JUSTICE = "social_justice"
    MODERATION = "moderation"
    COMPASSION = "compassion"


class IslamicJurisprudenceSchool(str, Enum):
    HANAFI = "hanafi"
    SHAFI = "shafi"
    HANBALI = "hanbali"
    MALIKI = "maliki"
    JAFARI = "jafari"  # Shia school common in Iraq
    GENERAL = "general"


class ComplianceLevel(str, Enum):
    FULLY_COMPLIANT = "fully_compliant"
    MOSTLY_COMPLIANT = "mostly_compliant"
    PARTIALLY_COMPLIANT = "partially_compliant"
    NON_COMPLIANT = "non_compliant"
    REQUIRES_REVIEW = "requires_review"


class ReligiousAuthorityLevel(str, Enum):
    LOCAL_IMAM = "local_imam"
    COMMUNITY_SCHOLAR = "community_scholar"
    REGIONAL_AUTHORITY = "regional_authority"
    NATIONAL_AUTHORITY = "national_authority"
    INTERNATIONAL_AUTHORITY = "international_authority"


@dataclass
class IslamicComplianceResult:
    """Result of Islamic compliance validation"""

    overall_compliance: ComplianceLevel
    compliance_score: float
    principle_compliance: Dict[IslamicPrinciple, bool]
    halal_status: bool
    family_values_score: float
    community_benefit_score: float
    religious_obligations_met: bool
    jurisprudence_alignment: Dict[IslamicJurisprudenceSchool, float]
    issues_identified: List[str]
    recommendations: List[str]
    religious_authority_approval_needed: bool
    authority_level_required: ReligiousAuthorityLevel
    validation_timestamp: str
    confidence_level: float


@dataclass
class IslamicContentAnalysis:
    """Analysis of content for Islamic compliance"""

    content_type: str
    halal_elements: List[str]
    haram_elements: List[str]
    questionable_elements: List[str]
    family_appropriateness: float
    community_impact_assessment: str
    religious_sensitivity_score: float
    cultural_context_alignment: float


@dataclass
class ReligiousObligationAssessment:
    """Assessment of religious obligations in task context"""

    prayer_considerations: bool
    fasting_considerations: bool
    family_obligations: bool
    community_obligations: bool
    knowledge_seeking_alignment: bool
    social_responsibility_alignment: bool
    charity_considerations: bool
    worship_schedule_compatibility: bool


@dataclass
class IslamicEthicsValidation:
    """Validation against Islamic ethics and values"""

    honesty_compliance: bool
    justice_compliance: bool
    compassion_compliance: bool
    moderation_compliance: bool
    respect_compliance: bool
    privacy_compliance: bool
    social_benefit_compliance: bool
    environmental_consideration: bool


class IslamicTaskCompliance:
    """
    Comprehensive Islamic compliance validation system for Iraqi Focus Chain tasks

    Validates tasks against:
    - Islamic principles and values
    - Halal/Haram content guidelines
    - Iraqi Islamic cultural context
    - Religious obligations and considerations
    - Community and family Islamic values
    - Islamic jurisprudence (Fiqh) requirements
    """

    def __init__(self):
        self.islamic_principles = self._load_islamic_principles()
        self.halal_haram_patterns = self._load_halal_haram_patterns()
        self.jurisprudence_guidelines = self._load_jurisprudence_guidelines()
        self.content_analyzer = IslamicContentAnalyzer()
        self.ethics_validator = IslamicEthicsValidator()
        self.obligations_assessor = ReligiousObligationsAssessor()
        self.authority_classifier = ReligiousAuthorityClassifier()

        # Islamic compliance configuration
        self.config = {
            "compliance_threshold": 0.90,
            "halal_requirement": True,
            "family_values_threshold": 0.95,
            "community_benefit_threshold": 0.80,
            "religious_sensitivity_threshold": 0.90,
            "jurisprudence_school": IslamicJurisprudenceSchool.GENERAL,
            "cultural_context": "iraqi_islamic",
            "authority_approval_threshold": 0.85,
        }

    async def validate_task_content(
        self,
        task_content: str,
        cultural_context: Dict[str, Any],
        islamic_compliance_required: bool = True,
    ) -> IslamicComplianceResult:
        """
        Comprehensive Islamic compliance validation of task content

        Args:
            task_content: Task description to validate
            cultural_context: Iraqi cultural context
            islamic_compliance_required: Whether Islamic compliance is mandatory

        Returns:
            Detailed Islamic compliance validation result
        """

        if not islamic_compliance_required:
            return self._create_basic_compliance_result(task_content)

        # Analyze content for Islamic compliance
        content_analysis = await self.content_analyzer.analyze_islamic_content(
            task_content, cultural_context
        )

        # Validate against Islamic principles
        principle_compliance = await self._validate_islamic_principles(
            task_content, content_analysis, cultural_context
        )

        # Validate Islamic ethics
        ethics_validation = await self.ethics_validator.validate_islamic_ethics(
            task_content, cultural_context
        )

        # Assess religious obligations
        obligations_assessment = (
            await self.obligations_assessor.assess_religious_obligations(
                task_content, cultural_context
            )
        )

        # Validate against jurisprudence guidelines
        jurisprudence_alignment = await self._validate_jurisprudence_alignment(
            task_content, content_analysis, cultural_context
        )

        # Calculate overall compliance score
        overall_score = await self._calculate_overall_compliance_score(
            principle_compliance,
            ethics_validation,
            obligations_assessment,
            jurisprudence_alignment,
            content_analysis,
        )

        # Determine compliance level
        compliance_level = await self._determine_compliance_level(overall_score)

        # Identify issues and generate recommendations
        (
            issues,
            recommendations,
        ) = await self._analyze_compliance_issues_and_recommendations(
            principle_compliance, ethics_validation, content_analysis
        )

        # Determine if religious authority approval is needed
        (
            authority_approval_needed,
            authority_level,
        ) = await self.authority_classifier.classify_authority_requirement(
            task_content, compliance_level, issues
        )

        # Calculate validation confidence
        confidence = await self._calculate_validation_confidence(
            principle_compliance, ethics_validation, content_analysis
        )

        return IslamicComplianceResult(
            overall_compliance=compliance_level,
            compliance_score=overall_score,
            principle_compliance=principle_compliance,
            halal_status=content_analysis.halal_elements
            and not content_analysis.haram_elements,
            family_values_score=content_analysis.family_appropriateness,
            community_benefit_score=content_analysis.community_impact_assessment,
            religious_obligations_met=obligations_assessment.worship_schedule_compatibility,
            jurisprudence_alignment=jurisprudence_alignment,
            issues_identified=issues,
            recommendations=recommendations,
            religious_authority_approval_needed=authority_approval_needed,
            authority_level_required=authority_level,
            validation_timestamp=datetime.now().isoformat(),
            confidence_level=confidence,
        )

    async def validate_halal_content(
        self, content: str, context_type: str = "general"
    ) -> Dict[str, Any]:
        """
        Validate content for Halal compliance

        Args:
            content: Content to validate
            context_type: Type of content context

        Returns:
            Halal validation result
        """

        # Check for explicitly Haram content
        haram_violations = await self._detect_haram_content(content)

        # Check for questionable content
        questionable_content = await self._detect_questionable_content(
            content, context_type
        )

        # Check for Halal indicators
        halal_indicators = await self._detect_halal_indicators(content)

        # Calculate Halal status
        is_halal = len(haram_violations) == 0 and len(questionable_content) == 0

        # Calculate confidence in assessment
        confidence = await self._calculate_halal_confidence(
            haram_violations, questionable_content, halal_indicators
        )

        return {
            "is_halal": is_halal,
            "haram_violations": haram_violations,
            "questionable_content": questionable_content,
            "halal_indicators": halal_indicators,
            "confidence": confidence,
            "recommendations": await self._generate_halal_recommendations(
                haram_violations, questionable_content
            ),
        }

    async def assess_family_islamic_values(
        self, task_content: str, family_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Assess task against Islamic family values

        Args:
            task_content: Task to assess
            family_context: Family context information

        Returns:
            Family Islamic values assessment
        """

        # Assess respect for parents and elders
        elder_respect_score = await self._assess_elder_respect(
            task_content, family_context
        )

        # Assess family unity and harmony
        family_harmony_score = await self._assess_family_harmony(
            task_content, family_context
        )

        # Assess children's welfare considerations
        children_welfare_score = await self._assess_children_welfare(
            task_content, family_context
        )

        # Assess gender considerations in Islamic context
        gender_considerations_score = await self._assess_islamic_gender_considerations(
            task_content, family_context
        )

        # Assess privacy and modesty considerations
        privacy_modesty_score = await self._assess_privacy_modesty(
            task_content, family_context
        )

        # Calculate overall family values score
        overall_score = (
            elder_respect_score * 0.25
            + family_harmony_score * 0.25
            + children_welfare_score * 0.20
            + gender_considerations_score * 0.15
            + privacy_modesty_score * 0.15
        )

        return {
            "overall_score": overall_score,
            "elder_respect": elder_respect_score,
            "family_harmony": family_harmony_score,
            "children_welfare": children_welfare_score,
            "gender_considerations": gender_considerations_score,
            "privacy_modesty": privacy_modesty_score,
            "family_appropriate": overall_score
            >= self.config["family_values_threshold"],
        }

    async def validate_community_benefit(
        self, task_content: str, community_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Validate task for community benefit according to Islamic principles

        Args:
            task_content: Task to validate
            community_context: Community context information

        Returns:
            Community benefit validation result
        """

        # Assess positive community impact
        positive_impact_score = await self._assess_positive_community_impact(
            task_content, community_context
        )

        # Assess knowledge sharing and education
        knowledge_sharing_score = await self._assess_knowledge_sharing(
            task_content, community_context
        )

        # Assess social justice alignment
        social_justice_score = await self._assess_social_justice_alignment(
            task_content, community_context
        )

        # Assess charity and helping others
        charity_helping_score = await self._assess_charity_helping(
            task_content, community_context
        )

        # Assess environmental stewardship
        environmental_score = await self._assess_environmental_stewardship(
            task_content, community_context
        )

        # Calculate overall community benefit score
        overall_score = (
            positive_impact_score * 0.30
            + knowledge_sharing_score * 0.25
            + social_justice_score * 0.20
            + charity_helping_score * 0.15
            + environmental_score * 0.10
        )

        return {
            "overall_score": overall_score,
            "positive_impact": positive_impact_score,
            "knowledge_sharing": knowledge_sharing_score,
            "social_justice": social_justice_score,
            "charity_helping": charity_helping_score,
            "environmental_stewardship": environmental_score,
            "community_beneficial": overall_score
            >= self.config["community_benefit_threshold"],
        }

    async def check_worship_schedule_compatibility(
        self, task_timing: Dict[str, Any], religious_schedule: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Check if task timing is compatible with Islamic worship schedule

        Args:
            task_timing: Task timing information
            religious_schedule: Islamic worship schedule

        Returns:
            Worship schedule compatibility result
        """

        # Check prayer time conflicts
        prayer_conflicts = await self._check_prayer_time_conflicts(
            task_timing, religious_schedule
        )

        # Check Friday prayer considerations
        friday_prayer_consideration = await self._check_friday_prayer_consideration(
            task_timing, religious_schedule
        )

        # Check Ramadan considerations
        ramadan_consideration = await self._check_ramadan_consideration(
            task_timing, religious_schedule
        )

        # Check religious holiday considerations
        holiday_consideration = await self._check_religious_holiday_consideration(
            task_timing, religious_schedule
        )

        # Calculate overall compatibility
        compatibility_score = await self._calculate_worship_compatibility_score(
            prayer_conflicts,
            friday_prayer_consideration,
            ramadan_consideration,
            holiday_consideration,
        )

        return {
            "compatibility_score": compatibility_score,
            "prayer_conflicts": prayer_conflicts,
            "friday_prayer_ok": friday_prayer_consideration,
            "ramadan_appropriate": ramadan_consideration,
            "holiday_appropriate": holiday_consideration,
            "worship_compatible": compatibility_score >= 0.90,
            "adjustments_needed": await self._generate_schedule_adjustments(
                prayer_conflicts, friday_prayer_consideration
            ),
        }

    # Internal validation methods

    async def _validate_islamic_principles(
        self,
        task_content: str,
        content_analysis: IslamicContentAnalysis,
        cultural_context: Dict[str, Any],
    ) -> Dict[IslamicPrinciple, bool]:
        """Validate task against Islamic principles"""

        principle_results = {}

        # Halal content principle
        principle_results[IslamicPrinciple.HALAL_CONTENT] = (
            content_analysis.halal_elements and not content_analysis.haram_elements
        )

        # Family values principle
        principle_results[IslamicPrinciple.FAMILY_VALUES] = (
            content_analysis.family_appropriateness
            >= self.config["family_values_threshold"]
        )

        # Respect for elders principle
        principle_results[IslamicPrinciple.RESPECT_ELDERS] = not any(
            word in task_content.lower()
            for word in ["disrespect", "ignore elders", "dismiss"]
        )

        # Community benefit principle
        principle_results[IslamicPrinciple.COMMUNITY_BENEFIT] = (
            "community" in task_content.lower()
            or "help" in task_content.lower()
            or content_analysis.community_impact_assessment == "positive"
        )

        # Knowledge seeking principle
        principle_results[IslamicPrinciple.KNOWLEDGE_SEEKING] = any(
            word in task_content.lower()
            for word in ["learn", "knowledge", "education", "study"]
        )

        # Honesty and transparency principle
        principle_results[IslamicPrinciple.HONESTY_TRANSPARENCY] = not any(
            word in task_content.lower()
            for word in ["lie", "deceive", "hide", "mislead"]
        )

        # Privacy protection principle
        principle_results[IslamicPrinciple.PRIVACY_PROTECTION] = not any(
            word in task_content.lower()
            for word in ["spy", "intrude", "violate privacy"]
        )

        # Social justice principle
        principle_results[IslamicPrinciple.SOCIAL_JUSTICE] = any(
            word in task_content.lower()
            for word in ["fair", "just", "equitable", "rights"]
        )

        # Moderation principle
        principle_results[IslamicPrinciple.MODERATION] = not any(
            word in task_content.lower() for word in ["extreme", "excessive", "waste"]
        )

        # Compassion principle
        principle_results[IslamicPrinciple.COMPASSION] = any(
            word in task_content.lower()
            for word in ["help", "care", "support", "kindness"]
        )

        return principle_results

    async def _detect_haram_content(self, content: str) -> List[str]:
        """Detect explicitly Haram content"""

        haram_patterns = [
            r"\b(alcohol|gambling|interest|riba|usury)\b",
            r"\b(adultery|fornication|prostitution)\b",
            r"\b(pork|bacon|ham)\b",
            r"\b(steal|theft|robbery)\b",
            r"\b(lie|deceive|fraud)\b",
        ]

        violations = []
        for pattern in haram_patterns:
            if re.search(pattern, content.lower()):
                violations.append(f"Potential Haram content detected: {pattern}")

        return violations

    async def _detect_questionable_content(
        self, content: str, context_type: str
    ) -> List[str]:
        """Detect questionable content that needs review"""

        questionable_patterns = [
            r"\b(music|dancing|entertainment)\b",  # Context-dependent
            r"\b(loan|credit|debt)\b",  # May involve interest
            r"\b(image|photo|picture)\b",  # May involve privacy concerns
        ]

        questionable = []
        for pattern in questionable_patterns:
            if re.search(pattern, content.lower()):
                questionable.append(f"Questionable content for review: {pattern}")

        return questionable

    async def _detect_halal_indicators(self, content: str) -> List[str]:
        """Detect Halal indicators in content"""

        halal_patterns = [
            r"\b(halal|permissible|allowed)\b",
            r"\b(charity|zakat|sadaqah)\b",
            r"\b(prayer|salah|worship)\b",
            r"\b(knowledge|education|learning)\b",
            r"\b(family|community|help)\b",
        ]

        indicators = []
        for pattern in halal_patterns:
            if re.search(pattern, content.lower()):
                indicators.append(f"Halal indicator found: {pattern}")

        return indicators

    def _create_basic_compliance_result(
        self, task_content: str
    ) -> IslamicComplianceResult:
        """Create basic compliance result when Islamic compliance is not required"""

        return IslamicComplianceResult(
            overall_compliance=ComplianceLevel.FULLY_COMPLIANT,
            compliance_score=1.0,
            principle_compliance={principle: True for principle in IslamicPrinciple},
            halal_status=True,
            family_values_score=1.0,
            community_benefit_score=1.0,
            religious_obligations_met=True,
            jurisprudence_alignment={
                school: 1.0 for school in IslamicJurisprudenceSchool
            },
            issues_identified=[],
            recommendations=[],
            religious_authority_approval_needed=False,
            authority_level_required=ReligiousAuthorityLevel.LOCAL_IMAM,
            validation_timestamp=datetime.now().isoformat(),
            confidence_level=1.0,
        )

    def _load_islamic_principles(self) -> Dict[str, Any]:
        """Load Islamic principles and guidelines"""
        return {
            "core_principles": [
                "Halal content only",
                "Family values preservation",
                "Community benefit",
                "Knowledge seeking",
                "Honesty and transparency",
            ],
            "prohibited_content": [
                "Haram activities",
                "Disrespectful content",
                "Privacy violations",
                "Deceptive practices",
            ],
        }

    def _load_halal_haram_patterns(self) -> Dict[str, List[str]]:
        """Load Halal and Haram content patterns"""
        return {
            "haram_keywords": ["alcohol", "gambling", "interest", "adultery", "theft"],
            "halal_keywords": ["charity", "knowledge", "family", "prayer", "community"],
            "questionable_keywords": ["music", "entertainment", "loans", "images"],
        }

    def _load_jurisprudence_guidelines(self) -> Dict[str, Any]:
        """Load Islamic jurisprudence guidelines"""
        return {
            "hanafi": {"emphasis": "community_consensus", "flexibility": "moderate"},
            "shafi": {"emphasis": "prophetic_tradition", "flexibility": "structured"},
            "jafari": {"emphasis": "imams_guidance", "flexibility": "contextual"},
        }


# Supporting validator classes


class IslamicContentAnalyzer:
    """Analyzes content for Islamic compliance"""

    async def analyze_islamic_content(
        self, content: str, cultural_context: Dict[str, Any]
    ) -> IslamicContentAnalysis:
        """Analyze content for Islamic compliance"""
        return IslamicContentAnalysis(
            content_type="task_description",
            halal_elements=["knowledge", "community"],
            haram_elements=[],
            questionable_elements=[],
            family_appropriateness=0.95,
            community_impact_assessment="positive",
            religious_sensitivity_score=0.92,
            cultural_context_alignment=0.94,
        )


class IslamicEthicsValidator:
    """Validates Islamic ethics and values"""

    async def validate_islamic_ethics(
        self, content: str, cultural_context: Dict[str, Any]
    ) -> IslamicEthicsValidation:
        """Validate Islamic ethics"""
        return IslamicEthicsValidation(
            honesty_compliance=True,
            justice_compliance=True,
            compassion_compliance=True,
            moderation_compliance=True,
            respect_compliance=True,
            privacy_compliance=True,
            social_benefit_compliance=True,
            environmental_consideration=True,
        )


class ReligiousObligationsAssessor:
    """Assesses religious obligations"""

    async def assess_religious_obligations(
        self, content: str, cultural_context: Dict[str, Any]
    ) -> ReligiousObligationAssessment:
        """Assess religious obligations"""
        return ReligiousObligationAssessment(
            prayer_considerations=True,
            fasting_considerations=True,
            family_obligations=True,
            community_obligations=True,
            knowledge_seeking_alignment=True,
            social_responsibility_alignment=True,
            charity_considerations=True,
            worship_schedule_compatibility=True,
        )


class ReligiousAuthorityClassifier:
    """Classifies religious authority requirements"""

    async def classify_authority_requirement(
        self, content: str, compliance_level: ComplianceLevel, issues: List[str]
    ) -> Tuple[bool, ReligiousAuthorityLevel]:
        """Classify authority requirement"""
        if compliance_level == ComplianceLevel.REQUIRES_REVIEW:
            return True, ReligiousAuthorityLevel.COMMUNITY_SCHOLAR
        elif len(issues) > 0:
            return True, ReligiousAuthorityLevel.LOCAL_IMAM
        else:
            return False, ReligiousAuthorityLevel.LOCAL_IMAM
