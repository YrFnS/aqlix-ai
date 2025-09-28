"""
Government Service Handler - Iraqi Government Service Mention Processing

Extracted from: cline/src/core/mentions/index.ts
Enhanced for: Iraqi AI Chat System with comprehensive government service mention support

Core Features:
1. Government Service Mentions (@passport, @visa, @ministry, @department)
2. Iraqi Bureaucracy Integration (@baghdad-ministry, @basra-department)
3. Service Process Workflow Management
4. Document Requirements and Authentication
5. Regional Government Service Support

Iraqi Enhancements:
- Iraqi government service integration (@passport, @visa, @ministry, @department)
- Regional service center support (@baghdad-ministry, @basra-department)
- Service process workflow management with approval chains
- Document requirements and authentication procedures
- Cultural adaptation for government interactions
- Arabic-English bilingual support for official processes
- Compliance with Iraqi government standards and procedures
"""

from dataclasses import dataclass
from typing import Dict, List, Optional, Any, Tuple
from enum import Enum
from datetime import datetime
import asyncio
import json


class IraqiGovernmentServiceType(str, Enum):
    PASSPORT = "passport"  # Iraqi passport services
    VISA = "visa"  # Visa and travel documents
    MINISTRY = "ministry"  # Ministry-level services
    DEPARTMENT = "department"  # Government departments
    LICENSE = "license"  # Licensing services
    PERMIT = "permit"  # Permits and approvals
    REGISTRATION = "registration"  # Official registrations
    ID_CARD = "id_card"  # Iraqi identity cards
    DRIVING_LICENSE = "driving_license"  # Driving licenses
    CIVIL_SERVICE = "civil_service"  # Civil service procedures


class GovernmentRegion(str, Enum):
    BAGHDAD = "baghdad"  # Baghdad Governorate services
    BASRA = "basra"  # Basra Governorate services
    MOSUL = "mosul"  # Nineveh Governorate services
    ERBIL = "erbil"  # Erbil Governorate services (KRG)
    NAJAF = "najaf"  # Najaf Governorate services
    KARBALA = "karbala"  # Karbala Governorate services
    SULAYMANIYAH = "sulaymaniyah"  # Sulaymaniyah Governorate services (KRG)
    NATIONAL = "national"  # National-level services


class ServiceProcessStage(str, Enum):
    DOCUMENTATION = "documentation"  # Document collection stage
    SUBMISSION = "submission"  # Application submission
    REVIEW = "review"  # Government review process
    APPROVAL = "approval"  # Approval stage
    PAYMENT = "payment"  # Fee payment
    ISSUANCE = "issuance"  # Document issuance
    DELIVERY = "delivery"  # Service delivery


class ServiceUrgencyLevel(str, Enum):
    STANDARD = "standard"  # Standard processing time
    EXPEDITED = "expedited"  # Faster processing (extra fee)
    URGENT = "urgent"  # Emergency processing
    PRIORITY = "priority"  # Priority processing


@dataclass
class GovernmentServiceContext:
    """Government service context for mention processing"""

    service_type: IraqiGovernmentServiceType
    regional_context: GovernmentRegion
    process_stage: Optional[ServiceProcessStage]
    urgency_level: ServiceUrgencyLevel
    required_documents: List[str]
    estimated_processing_time: Optional[str]
    associated_fees: List[Dict[str, Any]]
    approval_chain: List[str]
    cultural_requirements: List[str]
    language_requirements: Dict[str, Any]


@dataclass
class ServiceValidationResult:
    """Result of government service validation"""

    validation_passed: bool
    compliance_score: float
    document_completeness: float
    process_readiness: float
    validation_details: Dict[str, Any]
    required_actions: List[str]
    warnings: List[str]
    next_steps: List[str]


@dataclass
class GovernmentServiceResult:
    """Result of government service processing"""

    processed_content: str
    service_context: GovernmentServiceContext
    validation_result: ServiceValidationResult
    workflow_guidance: Dict[str, Any]
    document_checklist: List[Dict[str, Any]]
    contact_information: Dict[str, Any]
    regional_variations: Optional[Dict[str, Any]]


class GovernmentServiceHandler:
    """
    Handles Iraqi government service mentions with comprehensive workflow support

    Handles:
    - Government service mentions for all Iraqi government services
    - Regional service center processing and requirements
    - Service process workflow management and guidance
    - Document requirements and authentication procedures
    - Cultural adaptation for government interactions
    - Arabic-English bilingual support for official processes
    - Compliance with Iraqi government standards and procedures
    """

    def __init__(self):
        self.document_manager = GovernmentDocumentManager()
        self.workflow_processor = ServiceWorkflowProcessor()
        self.regional_adapter = RegionalServiceAdapter()
        self.compliance_validator = GovernmentComplianceValidator()
        self.cultural_adapter = GovernmentCulturalAdapter()
        self.authentication_manager = DocumentAuthenticationManager()

        # Government service patterns
        self.service_patterns = {
            # Basic service patterns
            "passport": r"@(passport|iraqi-passport|passport-renewal|passport-application)",
            "visa": r"@(visa|travel-visa|entry-visa|exit-visa|transit-visa)",
            "ministry": r"@(ministry|ministry-of-\w+|وزارة)",
            "department": r"@(department|dept|government-department|حكومي)",
            "license": r"@(license|permit|رخصة|تصريح)",
            "registration": r"@(registration|civil-registration|تسجيل)",
            "id_card": r"@(id-card|identity-card|national-id|هوية)",
            "driving": r"@(driving-license|driver-license|سواقة)",
            # Regional service patterns
            "regional_services": r"@(baghdad-\w+|basra-\w+|mosul-\w+|erbil-\w+|najaf-\w+)",
            "ministry_regional": r"@(baghdad-ministry|basra-ministry|erbil-ministry)",
            "department_regional": r"@(baghdad-department|basra-department|mosul-department)",
        }

        # Service processing configuration
        self.config = {
            "require_document_validation": True,
            "require_cultural_adaptation": True,
            "require_workflow_guidance": True,
            "support_arabic_processing": True,
            "validate_regional_requirements": True,
            "provide_contact_information": True,
            "track_process_stages": True,
            "estimate_processing_times": True,
            "calculate_service_fees": True,
            "min_compliance_score": 0.85,
            "service_processing_timeout": 25.0,  # seconds
        }

    async def process_government_service_mention(
        self,
        mention_text: str,
        cultural_context: Dict[str, Any],
        user_context: Dict[str, Any],
    ) -> GovernmentServiceResult:
        """
        Process government service mention with comprehensive workflow support

        Args:
            mention_text: The government service mention text
            cultural_context: Cultural context for adaptation
            user_context: User context for personalization

        Returns:
            Comprehensive government service processing result
        """

        # Parse government service mention
        service_type, region, urgency = await self._parse_government_service_mention(
            mention_text
        )

        # Create government service context
        service_context = await self._create_government_service_context(
            service_type, region, urgency, cultural_context, user_context
        )

        # Validate service requirements
        validation_result = await self._validate_service_requirements(
            service_context, cultural_context, user_context
        )

        # Process service workflow
        workflow_guidance = await self.workflow_processor.process_service_workflow(
            service_context, cultural_context
        )

        # Generate document checklist
        document_checklist = await self.document_manager.generate_document_checklist(
            service_context, cultural_context
        )

        # Get contact information
        contact_information = await self._get_service_contact_information(
            service_context, cultural_context
        )

        # Apply regional adaptations if applicable
        regional_variations = None
        if region != GovernmentRegion.NATIONAL:
            regional_variations = await self.regional_adapter.adapt_regional_service(
                service_context, cultural_context
            )

        # Generate processed content
        processed_content = await self._generate_government_service_content(
            service_context,
            validation_result,
            workflow_guidance,
            document_checklist,
            contact_information,
            regional_variations,
        )

        return GovernmentServiceResult(
            processed_content=processed_content,
            service_context=service_context,
            validation_result=validation_result,
            workflow_guidance=workflow_guidance,
            document_checklist=document_checklist,
            contact_information=contact_information,
            regional_variations=regional_variations,
        )

    async def validate_service_readiness(
        self,
        service_type: IraqiGovernmentServiceType,
        user_documents: List[str],
        user_context: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        Validate user's readiness for government service

        Args:
            service_type: Type of government service
            user_documents: Documents user currently has
            user_context: User context information

        Returns:
            Service readiness assessment
        """

        # Get required documents for service
        required_documents = await self._get_required_documents(
            service_type, user_context
        )

        # Check document completeness
        document_completeness = await self._assess_document_completeness(
            required_documents, user_documents
        )

        # Validate document authenticity requirements
        authenticity_requirements = await self._get_authenticity_requirements(
            service_type, required_documents
        )

        # Calculate readiness score
        readiness_score = (
            document_completeness["completeness_score"] * 0.6
            + authenticity_requirements["authenticity_score"] * 0.4
        )

        return {
            "service_ready": readiness_score >= 0.85,
            "readiness_score": readiness_score,
            "document_completeness": document_completeness,
            "authenticity_requirements": authenticity_requirements,
            "missing_documents": document_completeness.get("missing_documents", []),
            "next_steps": await self._generate_readiness_next_steps(
                readiness_score, document_completeness
            ),
            "estimated_preparation_time": await self._estimate_preparation_time(
                document_completeness
            ),
        }

    # Internal processing methods

    async def _parse_government_service_mention(
        self, mention_text: str
    ) -> Tuple[IraqiGovernmentServiceType, GovernmentRegion, ServiceUrgencyLevel]:
        """Parse government service mention components"""

        # Remove @ symbol
        content = mention_text[1:] if mention_text.startswith("@") else mention_text
        content = content.lower()

        # Determine service type
        service_type = IraqiGovernmentServiceType.CIVIL_SERVICE  # Default

        service_mapping = {
            "passport": IraqiGovernmentServiceType.PASSPORT,
            "visa": IraqiGovernmentServiceType.VISA,
            "ministry": IraqiGovernmentServiceType.MINISTRY,
            "department": IraqiGovernmentServiceType.DEPARTMENT,
            "license": IraqiGovernmentServiceType.LICENSE,
            "permit": IraqiGovernmentServiceType.PERMIT,
            "registration": IraqiGovernmentServiceType.REGISTRATION,
            "id-card": IraqiGovernmentServiceType.ID_CARD,
            "driving": IraqiGovernmentServiceType.DRIVING_LICENSE,
        }

        for keyword, mapped_service in service_mapping.items():
            if keyword in content:
                service_type = mapped_service
                break

        # Determine region
        region = GovernmentRegion.NATIONAL  # Default

        region_mapping = {
            "baghdad": GovernmentRegion.BAGHDAD,
            "basra": GovernmentRegion.BASRA,
            "mosul": GovernmentRegion.MOSUL,
            "erbil": GovernmentRegion.ERBIL,
            "najaf": GovernmentRegion.NAJAF,
            "karbala": GovernmentRegion.KARBALA,
            "sulaymaniyah": GovernmentRegion.SULAYMANIYAH,
        }

        for region_name, mapped_region in region_mapping.items():
            if region_name in content:
                region = mapped_region
                break

        # Determine urgency level
        urgency = ServiceUrgencyLevel.STANDARD  # Default

        if any(
            urgent_word in content for urgent_word in ["urgent", "emergency", "طارئ"]
        ):
            urgency = ServiceUrgencyLevel.URGENT
        elif any(
            expedited_word in content
            for expedited_word in ["expedited", "fast", "سريع"]
        ):
            urgency = ServiceUrgencyLevel.EXPEDITED
        elif any(priority_word in content for priority_word in ["priority", "أولوية"]):
            urgency = ServiceUrgencyLevel.PRIORITY

        return service_type, region, urgency

    async def _create_government_service_context(
        self,
        service_type: IraqiGovernmentServiceType,
        region: GovernmentRegion,
        urgency: ServiceUrgencyLevel,
        cultural_context: Dict[str, Any],
        user_context: Dict[str, Any],
    ) -> GovernmentServiceContext:
        """Create government service context"""

        # Determine required documents
        required_documents = await self._get_required_documents(
            service_type, user_context
        )

        # Estimate processing time
        estimated_processing_time = await self._estimate_processing_time(
            service_type, urgency, region
        )

        # Calculate associated fees
        associated_fees = await self._calculate_service_fees(
            service_type, urgency, region
        )

        # Define approval chain
        approval_chain = await self._get_approval_chain(service_type, region)

        # Determine cultural requirements
        cultural_requirements = await self._get_cultural_requirements(
            service_type, cultural_context
        )

        # Define language requirements
        language_requirements = {
            "arabic_required": True,  # All Iraqi government services require Arabic
            "english_accepted": service_type
            in [IraqiGovernmentServiceType.PASSPORT, IraqiGovernmentServiceType.VISA],
            "translation_required": True,
            "official_language": "arabic",
        }

        return GovernmentServiceContext(
            service_type=service_type,
            regional_context=region,
            process_stage=ServiceProcessStage.DOCUMENTATION,  # Default starting stage
            urgency_level=urgency,
            required_documents=required_documents,
            estimated_processing_time=estimated_processing_time,
            associated_fees=associated_fees,
            approval_chain=approval_chain,
            cultural_requirements=cultural_requirements,
            language_requirements=language_requirements,
        )

    async def _validate_service_requirements(
        self,
        context: GovernmentServiceContext,
        cultural_context: Dict[str, Any],
        user_context: Dict[str, Any],
    ) -> ServiceValidationResult:
        """Validate government service requirements"""

        # Document completeness validation
        document_completeness = await self._assess_document_completeness(
            context.required_documents, user_context.get("available_documents", [])
        )

        # Process readiness validation
        process_readiness = await self._assess_process_readiness(context, user_context)

        # Overall compliance validation
        compliance_score = await self._calculate_compliance_score(
            context, cultural_context
        )

        # Overall validation
        overall_passed = (
            document_completeness["completeness_score"] >= 0.80
            and process_readiness["readiness_score"] >= 0.75
            and compliance_score >= self.config["min_compliance_score"]
        )

        # Generate required actions
        required_actions = []
        if document_completeness["completeness_score"] < 0.80:
            required_actions.extend(document_completeness.get("missing_actions", []))
        if process_readiness["readiness_score"] < 0.75:
            required_actions.extend(process_readiness.get("readiness_actions", []))

        # Generate warnings
        warnings = []
        if context.urgency_level != ServiceUrgencyLevel.STANDARD:
            warnings.append(
                f"Additional fees apply for {context.urgency_level.value} processing"
            )
        if context.regional_context != GovernmentRegion.NATIONAL:
            warnings.append(
                f"Regional requirements may apply for {context.regional_context.value}"
            )

        # Generate next steps
        next_steps = await self._generate_next_steps(
            context, document_completeness, process_readiness
        )

        return ServiceValidationResult(
            validation_passed=overall_passed,
            compliance_score=compliance_score,
            document_completeness=document_completeness["completeness_score"],
            process_readiness=process_readiness["readiness_score"],
            validation_details={
                "document_validation": document_completeness,
                "process_validation": process_readiness,
                "compliance_validation": {
                    "score": compliance_score,
                    "requirements": context.cultural_requirements,
                },
            },
            required_actions=required_actions,
            warnings=warnings,
            next_steps=next_steps,
        )

    async def _generate_government_service_content(
        self,
        context: GovernmentServiceContext,
        validation_result: ServiceValidationResult,
        workflow_guidance: Dict[str, Any],
        document_checklist: List[Dict[str, Any]],
        contact_information: Dict[str, Any],
        regional_variations: Optional[Dict[str, Any]],
    ) -> str:
        """Generate government service context content"""

        service_name = context.service_type.value.replace("_", " ").title()
        region_name = context.regional_context.value.title()

        content = f"""Iraqi Government Service: {service_name} ({region_name})

Service Information:
- Service Type: {service_name}
- Regional Context: {region_name}
- Processing Priority: {context.urgency_level.value.title()}
- Estimated Processing Time: {context.estimated_processing_time}

Document Requirements:
{chr(10).join(f"- {doc}" for doc in context.required_documents)}

Service Fees:
{chr(10).join(f"- {fee['description']}: {fee['amount']} IQD" for fee in context.associated_fees)}

Process Workflow:
{chr(10).join(f"{i + 1}. {step}" for i, step in enumerate(workflow_guidance.get("process_steps", [])))}

Cultural Requirements:
{chr(10).join(f"- {req}" for req in context.cultural_requirements)}

Contact Information:
- Primary Office: {contact_information.get("primary_office", "N/A")}
- Phone: {contact_information.get("phone", "N/A")}
- Address: {contact_information.get("address", "N/A")}
- Operating Hours: {contact_information.get("operating_hours", "Sunday-Thursday: 8:00 AM - 2:00 PM")}
"""

        if regional_variations:
            content += f"\n\nRegional Adaptations:\n{regional_variations.get('regional_notes', 'Standard national procedures apply')}"

        content += f"\n\nService Readiness:\n- Document Completeness: {validation_result.document_completeness:.1%}\n- Process Readiness: {validation_result.process_readiness:.1%}\n- Overall Status: {'✅ Ready to Proceed' if validation_result.validation_passed else '⚠️ Preparation Required'}"

        if validation_result.next_steps:
            content += f"\n\nNext Steps:\n{chr(10).join(f'- {step}' for step in validation_result.next_steps)}"

        return content


# Supporting processor classes (simplified implementations)


class GovernmentDocumentManager:
    """Manages government document requirements"""

    async def generate_document_checklist(
        self, context: GovernmentServiceContext, cultural_context: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Generate document checklist"""
        return [
            {
                "document": doc,
                "required": True,
                "description": f"Required for {context.service_type.value}",
            }
            for doc in context.required_documents
        ]


class ServiceWorkflowProcessor:
    """Processes government service workflows"""

    async def process_service_workflow(
        self, context: GovernmentServiceContext, cultural_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Process service workflow"""
        return {
            "process_steps": [
                "Document preparation and collection",
                "Application submission",
                "Fee payment",
                "Government review and processing",
                "Document issuance and delivery",
            ],
            "current_stage": context.process_stage.value
            if context.process_stage
            else "documentation",
            "estimated_completion": context.estimated_processing_time,
        }


class RegionalServiceAdapter:
    """Adapts services for regional variations"""

    async def adapt_regional_service(
        self, context: GovernmentServiceContext, cultural_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Adapt for regional service context"""
        return {
            "regional_notes": f"Service adapted for {context.regional_context.value} regional requirements",
            "local_requirements": ["Regional documentation", "Local office procedures"],
            "contact_variations": f"Contact {context.regional_context.value} regional office",
        }


class GovernmentComplianceValidator:
    """Validates government compliance requirements"""

    async def validate_compliance(
        self, context: GovernmentServiceContext, cultural_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Validate government compliance"""
        return {
            "compliance_framework": "iraqi_government_standards",
            "regulatory_requirements": context.cultural_requirements,
            "legal_compliance": True,
        }


class GovernmentCulturalAdapter:
    """Adapts government services culturally"""

    async def adapt_cultural_context(
        self, context: GovernmentServiceContext, cultural_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Adapt for cultural context"""
        return {
            "cultural_adaptation": "applied",
            "language_support": context.language_requirements,
            "respectful_interaction": True,
            "religious_considerations": cultural_context.get(
                "islamic_compliance", True
            ),
        }


class DocumentAuthenticationManager:
    """Manages document authentication requirements"""

    async def validate_authentication(
        self, documents: List[str], service_type: IraqiGovernmentServiceType
    ) -> Dict[str, Any]:
        """Validate document authentication requirements"""
        return {
            "authentication_required": True,
            "notarization_needed": service_type
            in [IraqiGovernmentServiceType.PASSPORT, IraqiGovernmentServiceType.VISA],
            "translation_required": True,
            "authentication_locations": [
                "Ministry of Foreign Affairs",
                "Iraqi Embassy",
            ],
        }
