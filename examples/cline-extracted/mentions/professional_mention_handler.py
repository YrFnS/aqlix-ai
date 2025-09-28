"""
Professional Mention Handler - Iraqi Professional Domain Context for @ Mentions

Extracted from: cline/src/core/mentions/index.ts
Enhanced for: Iraqi AI Chat System with comprehensive professional domain mention support

Core Features:
1. Professional Domain Mentions (@legal, @medical, @education, @government)
2. Professional Role Mentions (@senior-legal, @chief-medical)
3. Regional Service Mentions (@baghdad-court, @basra-hospital)
4. Compliance Framework Mentions (@iraqi-law, @islamic-finance)
5. Professional Hierarchy Context Processing

Iraqi Enhancements:
- Iraqi professional standards integration
- Domain-specific cultural requirements
- Professional hierarchy and authority patterns
- Regional professional service variations
- Iraqi compliance framework support
- Professional Arabic terminology
- Cultural adaptation for professional interactions
"""

from dataclasses import dataclass
from typing import Dict, List, Optional, Any, Tuple
from enum import Enum
from datetime import datetime
import asyncio
import json


class IraqiProfessionalDomain(str, Enum):
    LEGAL = "legal"  # Iraqi legal system, courts, law
    MEDICAL = "medical"  # Healthcare, hospitals, medical practice
    EDUCATION = "education"  # Schools, universities, academic institutions
    GOVERNMENT = "government"  # Ministries, public service, bureaucracy
    ENGINEERING = "engineering"  # Construction, infrastructure, technical
    FINANCE = "finance"  # Banking, investment, financial services
    TECHNOLOGY = "technology"  # IT, software, digital services
    BUSINESS = "business"  # Commerce, trade, entrepreneurship
    AGRICULTURE = "agriculture"  # Farming, irrigation, rural development
    OIL_GAS = "oil_gas"  # Petroleum, energy sector


class ProfessionalMentionType(str, Enum):
    DOMAIN = "domain"  # @legal, @medical, @education
    ROLE = "role"  # @senior-legal, @chief-medical
    SERVICE = "service"  # @court-service, @hospital-service
    REGIONAL = "regional"  # @baghdad-court, @basra-hospital
    COMPLIANCE = "compliance"  # @iraqi-law, @islamic-finance
    HIERARCHY = "hierarchy"  # @director, @manager, @supervisor
    CERTIFICATION = "certification"  # @board-certified, @licensed
    WORKFLOW = "workflow"  # @approval-process, @review-cycle


class ProfessionalHierarchyLevel(str, Enum):
    EXECUTIVE = "executive"  # Directors, CEOs, Ministers
    SENIOR = "senior"  # Senior professionals, department heads
    MIDDLE = "middle"  # Middle management, supervisors
    JUNIOR = "junior"  # Junior professionals, assistants
    TRAINEE = "trainee"  # Trainees, interns, students


class IraqiRegion(str, Enum):
    BAGHDAD = "baghdad"  # Baghdad Governorate
    BASRA = "basra"  # Basra Governorate
    MOSUL = "mosul"  # Nineveh Governorate
    ERBIL = "erbil"  # Erbil Governorate
    NAJAF = "najaf"  # Najaf Governorate
    KARBALA = "karbala"  # Karbala Governorate
    KIRKUK = "kirkuk"  # Kirkuk Governorate
    SULAYMANIYAH = "sulaymaniyah"  # Sulaymaniyah Governorate


@dataclass
class ProfessionalMentionContext:
    """Professional context for mention processing"""

    mention_type: ProfessionalMentionType
    professional_domain: IraqiProfessionalDomain
    hierarchy_level: Optional[ProfessionalHierarchyLevel]
    regional_context: Optional[IraqiRegion]
    compliance_requirements: List[str]
    cultural_requirements: List[str]
    language_requirements: Dict[str, Any]
    workflow_context: Optional[Dict[str, Any]]
    certification_requirements: List[str]


@dataclass
class ProfessionalValidationResult:
    """Result of professional validation"""

    validation_passed: bool
    professional_compliance_score: float
    cultural_compliance_score: float
    hierarchy_compliance_score: float
    validation_details: Dict[str, Any]
    recommendations: List[str]
    required_certifications: List[str]
    workflow_requirements: List[str]


@dataclass
class ProfessionalProcessingResult:
    """Result of professional mention processing"""

    processed_content: str
    professional_context: ProfessionalMentionContext
    validation_result: ProfessionalValidationResult
    terminology_result: Dict[str, Any]
    workflow_result: Optional[Dict[str, Any]]
    regional_adaptation_result: Optional[Dict[str, Any]]
    compliance_result: Dict[str, Any]


class ProfessionalMentionHandler:
    """
    Handles professional domain mentions with Iraqi professional standards

    Handles:
    - Professional domain mentions for all Iraqi sectors
    - Professional role mentions with hierarchy awareness
    - Regional professional service mentions
    - Compliance framework mentions with Iraqi standards
    - Professional workflow context processing
    - Cultural adaptation for professional interactions
    - Professional terminology in Arabic and English
    """

    def __init__(self):
        self.domain_analyzer = ProfessionalDomainAnalyzer()
        self.hierarchy_validator = ProfessionalHierarchyValidator()
        self.regional_adapter = RegionalProfessionalAdapter()
        self.compliance_manager = IraqiComplianceManager()
        self.terminology_manager = ProfessionalTerminologyManager()
        self.workflow_processor = ProfessionalWorkflowProcessor()
        self.cultural_adapter = ProfessionalCulturalAdapter()

        # Professional mention patterns
        self.professional_patterns = {
            # Domain patterns
            "legal": r"@(legal|law|court|judge|lawyer|attorney|legal-advice|legal-consultation)",
            "medical": r"@(medical|health|doctor|physician|hospital|clinic|medical-advice|healthcare)",
            "education": r"@(education|school|university|academic|teacher|professor|student|curriculum)",
            "government": r"@(government|ministry|department|public-service|official|bureaucracy)",
            "engineering": r"@(engineering|construction|infrastructure|technical|engineer|architect)",
            "finance": r"@(finance|bank|investment|loan|credit|financial|islamic-finance|banking)",
            "technology": r"@(technology|tech|software|IT|programming|development|digital)",
            "business": r"@(business|commerce|trade|company|enterprise|commercial|entrepreneurship)",
            "agriculture": r"@(agriculture|farming|crop|irrigation|rural|agricultural|farmer)",
            "oil_gas": r"@(oil|gas|petroleum|energy|refinery|drilling|oil-gas|energy-sector)",
            # Role patterns
            "senior_roles": r"@(senior-\w+|chief-\w+|head-\w+|director-\w+|manager-\w+)",
            "regional_services": r"@(baghdad-\w+|basra-\w+|mosul-\w+|erbil-\w+|najaf-\w+|karbala-\w+)",
            "compliance_frameworks": r"@(iraqi-law|islamic-finance|ministry-regulations|professional-ethics)",
            # Workflow patterns
            "workflows": r"@(approval-process|review-cycle|certification-process|workflow|procedure)",
        }

        # Professional processing configuration
        self.config = {
            "require_professional_validation": True,
            "require_cultural_compliance": True,
            "require_hierarchy_validation": True,
            "support_arabic_terminology": True,
            "adapt_regional_context": True,
            "validate_compliance_frameworks": True,
            "process_workflow_context": True,
            "min_professional_compliance": 0.85,
            "min_cultural_compliance": 0.90,
            "professional_processing_timeout": 20.0,  # seconds
        }

    async def process_professional_mention(
        self,
        mention_text: str,
        professional_context: Dict[str, Any],
        cultural_context: Dict[str, Any],
    ) -> ProfessionalProcessingResult:
        """
        Process professional mention with Iraqi professional standards

        Args:
            mention_text: The professional mention text
            professional_context: Professional domain context
            cultural_context: Cultural context for adaptation

        Returns:
            Comprehensive professional processing result
        """

        # Parse professional mention
        (
            mention_type,
            domain,
            hierarchy,
            region,
        ) = await self._parse_professional_mention(mention_text)

        # Create professional mention context
        professional_mention_context = await self._create_professional_context(
            mention_type,
            domain,
            hierarchy,
            region,
            professional_context,
            cultural_context,
        )

        # Validate professional compliance
        validation_result = await self._validate_professional_compliance(
            professional_mention_context, professional_context, cultural_context
        )

        # Process professional terminology
        terminology_result = (
            await self.terminology_manager.process_professional_terminology(
                professional_mention_context, cultural_context
            )
        )

        # Process workflow context if applicable
        workflow_result = None
        if mention_type == ProfessionalMentionType.WORKFLOW:
            workflow_result = await self.workflow_processor.process_workflow_mention(
                professional_mention_context, professional_context
            )

        # Apply regional adaptation if applicable
        regional_adaptation_result = None
        if region and self.config["adapt_regional_context"]:
            regional_adaptation_result = (
                await self.regional_adapter.adapt_regional_context(
                    professional_mention_context, cultural_context
                )
            )

        # Process compliance requirements
        compliance_result = (
            await self.compliance_manager.process_compliance_requirements(
                professional_mention_context, professional_context
            )
        )

        # Generate processed content
        processed_content = await self._generate_professional_content(
            professional_mention_context,
            validation_result,
            terminology_result,
            workflow_result,
            regional_adaptation_result,
            compliance_result,
        )

        return ProfessionalProcessingResult(
            processed_content=processed_content,
            professional_context=professional_mention_context,
            validation_result=validation_result,
            terminology_result=terminology_result,
            workflow_result=workflow_result,
            regional_adaptation_result=regional_adaptation_result,
            compliance_result=compliance_result,
        )

    async def validate_professional_authority(
        self, mention_text: str, user_professional_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Validate user's professional authority for mention

        Args:
            mention_text: Professional mention requiring authority
            user_professional_context: User's professional context

        Returns:
            Authority validation result
        """

        # Parse mention requirements
        (
            mention_type,
            domain,
            hierarchy,
            region,
        ) = await self._parse_professional_mention(mention_text)

        # Validate domain authority
        domain_authority = await self._validate_domain_authority(
            domain, user_professional_context
        )

        # Validate hierarchy authority
        hierarchy_authority = await self._validate_hierarchy_authority(
            hierarchy, user_professional_context
        )

        # Validate regional authority if applicable
        regional_authority = True
        if region:
            regional_authority = await self._validate_regional_authority(
                region, user_professional_context
            )

        # Calculate overall authority score
        authority_score = (
            domain_authority["score"] * 0.5
            + hierarchy_authority["score"] * 0.3
            + (1.0 if regional_authority else 0.5) * 0.2
        )

        return {
            "authority_validated": authority_score >= 0.70,
            "authority_score": authority_score,
            "domain_authority": domain_authority,
            "hierarchy_authority": hierarchy_authority,
            "regional_authority": regional_authority,
            "required_certifications": await self._get_required_certifications(
                domain, hierarchy
            ),
            "authority_level": await self._determine_authority_level(authority_score),
        }

    # Internal processing methods

    async def _parse_professional_mention(
        self, mention_text: str
    ) -> Tuple[
        ProfessionalMentionType,
        IraqiProfessionalDomain,
        Optional[ProfessionalHierarchyLevel],
        Optional[IraqiRegion],
    ]:
        """Parse professional mention components"""

        # Remove @ symbol
        content = mention_text[1:] if mention_text.startswith("@") else mention_text
        content = content.lower()

        # Determine mention type
        mention_type = ProfessionalMentionType.DOMAIN  # Default

        if any(
            role in content
            for role in ["senior-", "chief-", "head-", "director-", "manager-"]
        ):
            mention_type = ProfessionalMentionType.ROLE
        elif any(
            region in content for region in ["baghdad-", "basra-", "mosul-", "erbil-"]
        ):
            mention_type = ProfessionalMentionType.REGIONAL
        elif any(
            comp in content
            for comp in ["iraqi-law", "islamic-finance", "ministry-regulations"]
        ):
            mention_type = ProfessionalMentionType.COMPLIANCE
        elif any(
            flow in content for flow in ["approval-process", "review-cycle", "workflow"]
        ):
            mention_type = ProfessionalMentionType.WORKFLOW

        # Determine professional domain
        domain = IraqiProfessionalDomain.GOVERNMENT  # Default for Iraqi context

        domain_mapping = {
            "legal": IraqiProfessionalDomain.LEGAL,
            "law": IraqiProfessionalDomain.LEGAL,
            "court": IraqiProfessionalDomain.LEGAL,
            "medical": IraqiProfessionalDomain.MEDICAL,
            "health": IraqiProfessionalDomain.MEDICAL,
            "doctor": IraqiProfessionalDomain.MEDICAL,
            "education": IraqiProfessionalDomain.EDUCATION,
            "school": IraqiProfessionalDomain.EDUCATION,
            "university": IraqiProfessionalDomain.EDUCATION,
            "government": IraqiProfessionalDomain.GOVERNMENT,
            "ministry": IraqiProfessionalDomain.GOVERNMENT,
            "engineering": IraqiProfessionalDomain.ENGINEERING,
            "construction": IraqiProfessionalDomain.ENGINEERING,
            "finance": IraqiProfessionalDomain.FINANCE,
            "bank": IraqiProfessionalDomain.FINANCE,
            "technology": IraqiProfessionalDomain.TECHNOLOGY,
            "software": IraqiProfessionalDomain.TECHNOLOGY,
            "business": IraqiProfessionalDomain.BUSINESS,
            "commerce": IraqiProfessionalDomain.BUSINESS,
            "agriculture": IraqiProfessionalDomain.AGRICULTURE,
            "farming": IraqiProfessionalDomain.AGRICULTURE,
            "oil": IraqiProfessionalDomain.OIL_GAS,
            "gas": IraqiProfessionalDomain.OIL_GAS,
            "petroleum": IraqiProfessionalDomain.OIL_GAS,
        }

        for keyword, mapped_domain in domain_mapping.items():
            if keyword in content:
                domain = mapped_domain
                break

        # Determine hierarchy level
        hierarchy = None
        if "senior-" in content or "chief-" in content:
            hierarchy = ProfessionalHierarchyLevel.SENIOR
        elif "head-" in content or "director-" in content:
            hierarchy = ProfessionalHierarchyLevel.EXECUTIVE
        elif "manager-" in content:
            hierarchy = ProfessionalHierarchyLevel.MIDDLE
        elif "junior-" in content or "assistant-" in content:
            hierarchy = ProfessionalHierarchyLevel.JUNIOR

        # Determine region
        region = None
        region_mapping = {
            "baghdad": IraqiRegion.BAGHDAD,
            "basra": IraqiRegion.BASRA,
            "mosul": IraqiRegion.MOSUL,
            "erbil": IraqiRegion.ERBIL,
            "najaf": IraqiRegion.NAJAF,
            "karbala": IraqiRegion.KARBALA,
            "kirkuk": IraqiRegion.KIRKUK,
            "sulaymaniyah": IraqiRegion.SULAYMANIYAH,
        }

        for region_name, mapped_region in region_mapping.items():
            if region_name in content:
                region = mapped_region
                break

        return mention_type, domain, hierarchy, region

    async def _create_professional_context(
        self,
        mention_type: ProfessionalMentionType,
        domain: IraqiProfessionalDomain,
        hierarchy: Optional[ProfessionalHierarchyLevel],
        region: Optional[IraqiRegion],
        professional_context: Dict[str, Any],
        cultural_context: Dict[str, Any],
    ) -> ProfessionalMentionContext:
        """Create professional mention context"""

        # Determine compliance requirements
        compliance_requirements = await self._get_compliance_requirements(
            domain, cultural_context
        )

        # Determine cultural requirements
        cultural_requirements = await self._get_cultural_requirements(
            domain, cultural_context
        )

        # Determine language requirements
        language_requirements = {
            "arabic_required": domain
            in [IraqiProfessionalDomain.LEGAL, IraqiProfessionalDomain.GOVERNMENT],
            "english_required": domain
            in [IraqiProfessionalDomain.TECHNOLOGY, IraqiProfessionalDomain.MEDICAL],
            "formal_language": True,
            "professional_terminology": True,
        }

        # Determine workflow context
        workflow_context = None
        if mention_type == ProfessionalMentionType.WORKFLOW:
            workflow_context = {
                "workflow_type": "professional_process",
                "domain_specific": True,
                "approval_required": True,
                "documentation_required": True,
            }

        # Determine certification requirements
        certification_requirements = await self._get_certification_requirements(
            domain, hierarchy
        )

        return ProfessionalMentionContext(
            mention_type=mention_type,
            professional_domain=domain,
            hierarchy_level=hierarchy,
            regional_context=region,
            compliance_requirements=compliance_requirements,
            cultural_requirements=cultural_requirements,
            language_requirements=language_requirements,
            workflow_context=workflow_context,
            certification_requirements=certification_requirements,
        )

    async def _validate_professional_compliance(
        self,
        context: ProfessionalMentionContext,
        professional_context: Dict[str, Any],
        cultural_context: Dict[str, Any],
    ) -> ProfessionalValidationResult:
        """Validate professional compliance"""

        # Professional domain validation
        professional_score = await self._validate_professional_domain_compliance(
            context, professional_context
        )

        # Cultural compliance validation
        cultural_score = await self._validate_cultural_compliance(
            context, cultural_context
        )

        # Hierarchy compliance validation
        hierarchy_score = await self._validate_hierarchy_compliance(
            context, professional_context
        )

        # Overall validation
        overall_passed = (
            professional_score >= self.config["min_professional_compliance"]
            and cultural_score >= self.config["min_cultural_compliance"]
            and hierarchy_score >= 0.80
        )

        # Generate recommendations
        recommendations = []
        if professional_score < self.config["min_professional_compliance"]:
            recommendations.append("Enhance professional domain expertise")
        if cultural_score < self.config["min_cultural_compliance"]:
            recommendations.append("Improve cultural compliance and sensitivity")
        if hierarchy_score < 0.80:
            recommendations.append("Respect professional hierarchy and authority")

        # Determine required certifications
        required_certifications = context.certification_requirements

        # Determine workflow requirements
        workflow_requirements = []
        if context.workflow_context:
            workflow_requirements = [
                "Formal approval process",
                "Documentation requirements",
                "Professional review cycle",
                "Compliance validation",
            ]

        return ProfessionalValidationResult(
            validation_passed=overall_passed,
            professional_compliance_score=professional_score,
            cultural_compliance_score=cultural_score,
            hierarchy_compliance_score=hierarchy_score,
            validation_details={
                "professional_validation": {
                    "score": professional_score,
                    "requirements": context.compliance_requirements,
                },
                "cultural_validation": {
                    "score": cultural_score,
                    "requirements": context.cultural_requirements,
                },
                "hierarchy_validation": {
                    "score": hierarchy_score,
                    "level": context.hierarchy_level.value
                    if context.hierarchy_level
                    else "standard",
                },
            },
            recommendations=recommendations,
            required_certifications=required_certifications,
            workflow_requirements=workflow_requirements,
        )

    async def _generate_professional_content(
        self,
        context: ProfessionalMentionContext,
        validation_result: ProfessionalValidationResult,
        terminology_result: Dict[str, Any],
        workflow_result: Optional[Dict[str, Any]],
        regional_adaptation_result: Optional[Dict[str, Any]],
        compliance_result: Dict[str, Any],
    ) -> str:
        """Generate professional context content"""

        domain_name = context.professional_domain.value.replace("_", " ").title()

        content = f"""Iraqi Professional Context: {domain_name}

Professional Domain Information:
- Domain: {domain_name}
- Hierarchy Level: {context.hierarchy_level.value if context.hierarchy_level else "Standard"}
- Regional Context: {context.regional_context.value if context.regional_context else "National"}

Compliance Requirements:
{chr(10).join(f"- {req}" for req in context.compliance_requirements)}

Cultural Requirements:
{chr(10).join(f"- {req}" for req in context.cultural_requirements)}

Professional Terminology:
- Arabic Terms: {", ".join(terminology_result.get("arabic_terms", []))}
- English Terms: {", ".join(terminology_result.get("english_terms", []))}

Professional Standards:
- Iraqi Professional Ethics: Applied
- Cultural Sensitivity: Required
- Language Proficiency: {", ".join(k for k, v in context.language_requirements.items() if v and isinstance(v, bool))}
"""

        if workflow_result:
            content += f"\n\nWorkflow Context:\n{workflow_result.get('workflow_description', 'Standard professional workflow')}"

        if regional_adaptation_result:
            content += f"\n\nRegional Adaptations:\n{regional_adaptation_result.get('regional_notes', 'National standards apply')}"

        content += f"\n\nCompliance Status:\n- Professional Compliance: {validation_result.professional_compliance_score:.1%}\n- Cultural Compliance: {validation_result.cultural_compliance_score:.1%}\n- Overall Status: {'✅ Validated' if validation_result.validation_passed else '⚠️ Requires Review'}"

        return content


# Supporting processor classes (simplified implementations)


class ProfessionalDomainAnalyzer:
    """Analyzes professional domain context"""

    pass


class ProfessionalHierarchyValidator:
    """Validates professional hierarchy"""

    pass


class RegionalProfessionalAdapter:
    """Adapts context for regional variations"""

    async def adapt_regional_context(
        self, context: ProfessionalMentionContext, cultural_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Adapt for regional context"""
        return {
            "regional_notes": f"Standards adapted for {context.regional_context.value if context.regional_context else 'national'} context",
            "local_requirements": ["Regional compliance", "Local cultural adaptation"],
        }


class IraqiComplianceManager:
    """Manages Iraqi compliance requirements"""

    async def process_compliance_requirements(
        self, context: ProfessionalMentionContext, professional_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Process compliance requirements"""
        return {
            "compliance_framework": "iraqi_professional_standards",
            "regulatory_requirements": context.compliance_requirements,
            "cultural_compliance": context.cultural_requirements,
        }


class ProfessionalTerminologyManager:
    """Manages professional terminology"""

    async def process_professional_terminology(
        self, context: ProfessionalMentionContext, cultural_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Process professional terminology"""
        # Simplified terminology mapping
        domain_terminology = {
            IraqiProfessionalDomain.LEGAL: {
                "arabic_terms": ["قانون", "محكمة", "قاضي", "محامي"],
                "english_terms": ["law", "court", "judge", "lawyer"],
            },
            IraqiProfessionalDomain.MEDICAL: {
                "arabic_terms": ["طب", "طبيب", "مستشفى", "علاج"],
                "english_terms": ["medicine", "doctor", "hospital", "treatment"],
            },
            IraqiProfessionalDomain.EDUCATION: {
                "arabic_terms": ["تعليم", "مدرسة", "جامعة", "أستاذ"],
                "english_terms": ["education", "school", "university", "professor"],
            },
        }

        return domain_terminology.get(
            context.professional_domain,
            {
                "arabic_terms": ["مهني", "خدمة", "عمل"],
                "english_terms": ["professional", "service", "work"],
            },
        )


class ProfessionalWorkflowProcessor:
    """Processes professional workflows"""

    async def process_workflow_mention(
        self, context: ProfessionalMentionContext, professional_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Process workflow mention"""
        return {
            "workflow_description": f"Standard {context.professional_domain.value} professional workflow",
            "required_steps": ["Initiation", "Review", "Approval", "Implementation"],
            "approval_levels": ["Supervisor", "Department Head", "Director"],
        }


class ProfessionalCulturalAdapter:
    """Adapts professional context culturally"""

    pass
