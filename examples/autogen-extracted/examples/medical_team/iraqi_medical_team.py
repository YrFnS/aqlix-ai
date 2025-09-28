"""
Iraqi Medical Team Multi-Agent Coordination Example

Demonstrates AutoGen multi-agent coordination for Iraqi healthcare teams
with Islamic medical ethics, patient dignity, and cultural sensitivity.
"""

import asyncio
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from enum import Enum
from datetime import datetime

from autogen_core import SingleThreadedAgentRuntime, AgentId
from autogen_agentchat import GroupChat, AssistantAgent

# Import Iraqi enhancements
import sys
import os

sys.path.append(
    os.path.join(os.path.dirname(__file__), "..", "..", "core", "iraqi_enhancements")
)

from cultural_validator import IraqiCulturalValidator, ProfessionalDomain
from arabic_agent_base import IraqiProfessionalAgent, ArabicProcessingConfig


class MedicalRole(Enum):
    """Iraqi medical professional roles"""

    SENIOR_DOCTOR = "senior_doctor"
    SPECIALIST = "specialist"
    GENERAL_PRACTITIONER = "general_practitioner"
    HEAD_NURSE = "head_nurse"
    NURSE = "nurse"
    PHARMACIST = "pharmacist"
    MEDICAL_ADMINISTRATOR = "medical_administrator"
    SOCIAL_WORKER = "social_worker"


class MedicalSpecialty(Enum):
    """Medical specialties in Iraqi healthcare context"""

    INTERNAL_MEDICINE = "internal_medicine"
    SURGERY = "surgery"
    PEDIATRICS = "pediatrics"
    OBSTETRICS_GYNECOLOGY = "obstetrics_gynecology"
    CARDIOLOGY = "cardiology"
    NEUROLOGY = "neurology"
    PSYCHIATRY = "psychiatry"
    EMERGENCY_MEDICINE = "emergency_medicine"
    FAMILY_MEDICINE = "family_medicine"


class PatientPriority(Enum):
    """Patient priority levels"""

    EMERGENCY = "emergency"
    URGENT = "urgent"
    ROUTINE = "routine"
    FOLLOW_UP = "follow_up"


@dataclass
class PatientContext:
    """Context for patient care coordination"""

    patient_id: str
    age: int
    gender: str
    condition: str
    priority: PatientPriority
    cultural_considerations: List[str]
    family_involvement_required: bool = True
    islamic_medical_ethics: bool = True
    privacy_level: str = "high"


class IraqiMedicalAgent(IraqiProfessionalAgent):
    """
    Iraqi medical professional agent with healthcare expertise and Islamic medical ethics
    """

    def __init__(
        self,
        name: str,
        role: MedicalRole,
        specialty: Optional[MedicalSpecialty],
        experience_years: int,
        model_client: Any,
    ):
        hierarchy_level = self._determine_hierarchy_level(role, experience_years)

        super().__init__(
            description=f"Iraqi medical professional specialized in {specialty.value if specialty else 'general_medicine'}",
            professional_role=role.value,
            hierarchy_level=hierarchy_level,
            domain=ProfessionalDomain.MEDICAL,
        )

        self.name = name
        self.role = role
        self.specialty = specialty
        self.experience_years = experience_years
        self.model_client = model_client

        # Medical-specific knowledge
        self.medical_expertise = {
            "islamic_medical_ethics": True,
            "patient_dignity": True,
            "family_centered_care": True,
            "gender_appropriate_care": True,
            "cultural_sensitivity": True,
        }

        # Islamic medical ethics principles
        self.islamic_medical_principles = [
            "الحفاظ على كرامة المريض",  # Preserve patient dignity
            "مراعاة الخصوصية والستر",  # Maintain privacy and modesty
            "إشراك الأسرة في القرارات",  # Involve family in decisions
            "الرحمة والرأفة في العلاج",  # Compassion and mercy in treatment
            "العدالة في تقديم الرعاية",  # Justice in healthcare provision
        ]

    def _determine_hierarchy_level(self, role: MedicalRole, experience: int) -> str:
        """Determine hierarchy level based on role and experience"""
        if role == MedicalRole.SENIOR_DOCTOR or experience > 15:
            return "senior_executive"
        elif role == MedicalRole.SPECIALIST and experience > 8:
            return "senior_professional"
        elif role in [MedicalRole.GENERAL_PRACTITIONER, MedicalRole.HEAD_NURSE]:
            return "mid_professional"
        else:
            return "junior_professional"

    async def _generate_response(self, content: str, ctx: Any) -> str:
        """
        Generate medical response with Islamic ethics and cultural sensitivity
        """
        patient_context = getattr(ctx, "patient_context", None)

        response_parts = []

        # Islamic opening for medical consultation
        if patient_context and patient_context.islamic_medical_ethics:
            response_parts.append("بسم الله الرحمن الرحيم")
            response_parts.append("السلام عليكم ورحمة الله وبركاته")
        else:
            response_parts.append("السلام عليكم، تحية طيبة")

        # Professional introduction
        intro = self._get_medical_introduction(patient_context)
        response_parts.append(intro)

        # Medical assessment with cultural sensitivity
        assessment = await self._provide_medical_assessment(content, patient_context)
        response_parts.append(assessment)

        # Treatment recommendations with Islamic ethics
        if patient_context:
            treatment = self._provide_treatment_recommendations(
                content, patient_context
            )
            response_parts.append(treatment)

        # Family involvement guidance
        if patient_context and patient_context.family_involvement_required:
            family_guidance = self._provide_family_guidance(patient_context)
            response_parts.append(family_guidance)

        # Cultural and ethical considerations
        ethical_considerations = self._address_ethical_considerations(patient_context)
        response_parts.append(ethical_considerations)

        # Medical closing with prayers
        closing = self._get_medical_closing(patient_context)
        response_parts.append(closing)

        return "\n\n".join(response_parts)

    def _get_medical_introduction(
        self, patient_context: Optional[PatientContext]
    ) -> str:
        """Get appropriate medical professional introduction"""
        if self.role == MedicalRole.SENIOR_DOCTOR:
            return f"بصفتي الطبيب الأول المختص في {self.specialty.value if self.specialty else 'الطب العام'}"
        elif self.role == MedicalRole.SPECIALIST:
            return f"بصفتي طبيب مختص في {self.specialty.value if self.specialty else 'التخصص الطبي'}"
        elif self.role == MedicalRole.HEAD_NURSE:
            return "بصفتي رئيسة التمريض"
        elif self.role == MedicalRole.PHARMACIST:
            return "بصفتي الصيدلاني المسؤول"
        else:
            return f"بصفتي {self.role.value} في الفريق الطبي"

    async def _provide_medical_assessment(
        self, content: str, patient_context: Optional[PatientContext]
    ) -> str:
        """Provide medical assessment with cultural sensitivity"""
        assessment_parts = []

        assessment_parts.append("التقييم الطبي:")

        # Role-specific assessment approach
        if self.role in [MedicalRole.SENIOR_DOCTOR, MedicalRole.SPECIALIST]:
            assessment_parts.append("بناء على الفحص السريري والتاريخ المرضي:")
        elif self.role == MedicalRole.HEAD_NURSE:
            assessment_parts.append("من ناحية الرعاية التمريضية والمتابعة:")
        elif self.role == MedicalRole.PHARMACIST:
            assessment_parts.append("من الناحية الدوائية والعلاجية:")

        # Patient-specific considerations
        if patient_context:
            if patient_context.gender == "female" and patient_context.age > 12:
                assessment_parts.append("- مراعاة الخصوصية والستر للمريضة")

            if patient_context.priority == PatientPriority.EMERGENCY:
                assessment_parts.append("- الحالة تتطلب تدخل عاجل")

            if patient_context.cultural_considerations:
                assessment_parts.append("- مراعاة الاعتبارات الثقافية والدينية")

        # Islamic medical ethics in assessment
        assessment_parts.append("- الحفاظ على كرامة المريض أولوية قصوى")
        assessment_parts.append("- اتباع مبادئ الطب الإسلامي في التشخيص والعلاج")

        return "\n".join(assessment_parts)

    def _provide_treatment_recommendations(
        self, content: str, patient_context: PatientContext
    ) -> str:
        """Provide treatment recommendations with Islamic medical ethics"""
        treatment_parts = []

        treatment_parts.append("التوصيات العلاجية:")

        # Role-specific treatment approach
        if self.role in [MedicalRole.SENIOR_DOCTOR, MedicalRole.SPECIALIST]:
            treatment_parts.extend(
                [
                    "1. العلاج الدوائي المناسب حسب الحالة",
                    "2. متابعة دورية للتأكد من الاستجابة",
                    "3. تعديل الخطة العلاجية حسب الحاجة",
                ]
            )
        elif self.role == MedicalRole.HEAD_NURSE:
            treatment_parts.extend(
                [
                    "1. خطة رعاية تمريضية شاملة",
                    "2. متابعة الحالة الصحية والنفسية",
                    "3. تثقيف المريض والأسرة",
                ]
            )
        elif self.role == MedicalRole.PHARMACIST:
            treatment_parts.extend(
                [
                    "1. مراجعة التداخلات الدوائية",
                    "2. ضبط الجرعات حسب الحالة",
                    "3. إرشادات الاستخدام الآمن",
                ]
            )

        # Gender-appropriate care
        if patient_context.gender == "female":
            treatment_parts.append("- ضمان توفر فريق طبي نسائي عند الحاجة")

        # Islamic considerations
        treatment_parts.extend(
            [
                "- التأكد من حلال المواد الدوائية المستخدمة",
                "- مراعاة أوقات الصلاة في جدولة العلاج",
                "- احترام تعاليم الدين في جميع مراحل العلاج",
            ]
        )

        return "\n".join(treatment_parts)

    def _provide_family_guidance(self, patient_context: PatientContext) -> str:
        """Provide guidance for family involvement"""
        guidance_parts = []

        guidance_parts.append("إرشادات للأسرة الكريمة:")

        guidance_parts.extend(
            [
                "- دور الأسرة مهم جداً في عملية الشفاء",
                "- التعاون مع الفريق الطبي في المتابعة",
                "- الالتزام بالتعليمات الطبية والدوائية",
                "- توفير الدعم النفسي والمعنوي للمريض",
            ]
        )

        # Cultural and religious guidance
        guidance_parts.extend(
            [
                "- الدعاء والتوكل على الله مع الأخذ بالأسباب",
                "- مراعاة راحة المريض وخصوصيته",
                "- التواصل مع الفريق الطبي عند أي استفسار",
            ]
        )

        return "\n".join(guidance_parts)

    def _address_ethical_considerations(
        self, patient_context: Optional[PatientContext]
    ) -> str:
        """Address Islamic medical ethics and cultural considerations"""
        ethical_parts = []

        ethical_parts.append("الاعتبارات الأخلاقية والثقافية:")

        # Core Islamic medical ethics
        ethical_parts.extend(
            [
                "- نلتزم بمبادئ الطب الإسلامي والأخلاق المهنية",
                "- حفظ النفس واجب شرعي وطبي",
                "- العدالة في تقديم الرعاية لجميع المرضى",
                "- الصدق والأمانة في التشخيص والعلاج",
            ]
        )

        # Patient-specific ethical considerations
        if patient_context:
            if patient_context.privacy_level == "high":
                ethical_parts.append("- ضمان أقصى درجات الخصوصية الطبية")

            if patient_context.cultural_considerations:
                ethical_parts.append("- احترام العادات والتقاليد المحلية")

        ethical_parts.append("- التوازن بين الحكمة الطبية والقيم الدينية")

        return "\n".join(ethical_parts)

    def _get_medical_closing(self, patient_context: Optional[PatientContext]) -> str:
        """Get appropriate medical professional closing"""
        if patient_context and patient_context.islamic_medical_ethics:
            return "نسأل الله العلي القدير أن يمن عليكم بالشفاء العاجل والعافية الدائمة، وأن يجعل في عملنا البركة والأجر. والله ولي التوفيق."
        else:
            return "نتمنى لكم الشفاء العاجل والصحة الدائمة، مع فائق الاحترام والتقدير."


class IraqiMedicalTeam:
    """
    Coordinates Iraqi medical team with Islamic medical ethics and cultural sensitivity
    """

    def __init__(self, model_client: Any):
        self.model_client = model_client
        self.cultural_validator = IraqiCulturalValidator()

        # Initialize team members
        self.team_members: Dict[str, IraqiMedicalAgent] = {}
        self.runtime: Optional[SingleThreadedAgentRuntime] = None
        self.group_chat: Optional[GroupChat] = None

        # Medical team protocols
        self.protocols = {
            "gender_appropriate_care": True,
            "family_involvement": True,
            "islamic_medical_ethics": True,
            "cultural_sensitivity": True,
            "patient_dignity": True,
        }

    def add_team_member(
        self,
        agent_id: str,
        role: MedicalRole,
        specialty: Optional[MedicalSpecialty],
        experience_years: int,
    ) -> IraqiMedicalAgent:
        """Add a medical team member"""
        agent = IraqiMedicalAgent(
            name=agent_id,
            role=role,
            specialty=specialty,
            experience_years=experience_years,
            model_client=self.model_client,
        )

        self.team_members[agent_id] = agent
        return agent

    async def setup_team_coordination(self) -> None:
        """Setup multi-agent coordination with Iraqi medical protocols"""
        if not self.team_members:
            raise ValueError("No team members added")

        # Initialize runtime
        self.runtime = SingleThreadedAgentRuntime()

        # Register agents
        registered_agents = []
        for agent_id, agent in self.team_members.items():
            await agent.register_instance(
                runtime=self.runtime, agent_id=AgentId(agent_id, "iraqi_medical")
            )
            registered_agents.append(agent)

        # Create group chat with Iraqi medical coordination
        self.group_chat = GroupChat(
            participants=registered_agents,
            max_turns=15,
            cultural_context="iraqi_medical_professional",
        )

    async def handle_patient_consultation(
        self, patient_context: PatientContext, medical_query: str
    ) -> Dict[str, Any]:
        """
        Handle patient consultation with multi-agent medical team coordination

        Args:
            patient_context: Patient context information
            medical_query: Medical consultation query

        Returns:
            Comprehensive medical consultation result
        """
        if not self.group_chat:
            await self.setup_team_coordination()

        # Validate cultural appropriateness for medical context
        validation_result = self.cultural_validator.validate_message_content(
            content=medical_query,
            domain=ProfessionalDomain.MEDICAL,
            context={
                "patient_gender": patient_context.gender,
                "cultural_sensitivity": patient_context.cultural_considerations,
            },
        )

        if validation_result.requires_human_review:
            return {
                "status": "requires_review",
                "validation_issues": validation_result.issues,
                "recommendations": validation_result.recommendations,
            }

        # Execute medical consultation
        consultation_result = await self._execute_medical_consultation(
            patient_context=patient_context, medical_query=medical_query
        )

        return {
            "status": "completed",
            "patient_id": patient_context.patient_id,
            "consultation_result": consultation_result,
            "islamic_ethics_applied": True,
            "cultural_validation": validation_result.compliance_level.value,
        }

    async def _execute_medical_consultation(
        self, patient_context: PatientContext, medical_query: str
    ) -> Dict[str, Any]:
        """Execute medical consultation with team coordination"""

        # Prepare culturally appropriate medical consultation
        consultation_request = self._prepare_medical_consultation_request(
            patient_context, medical_query
        )

        messages = []

        # Senior doctor leads critical cases
        senior_doctors = [
            agent
            for agent in self.team_members.values()
            if agent.role == MedicalRole.SENIOR_DOCTOR
        ]

        # Priority-based coordination
        if patient_context.priority in [
            PatientPriority.EMERGENCY,
            PatientPriority.URGENT,
        ]:
            if senior_doctors:
                lead_agent = senior_doctors[0]
                lead_response = await lead_agent._generate_response(
                    consultation_request,
                    type("Context", (), {"patient_context": patient_context})(),
                )
                messages.append(
                    {
                        "agent": lead_agent.name,
                        "role": lead_agent.role.value,
                        "specialty": lead_agent.specialty.value
                        if lead_agent.specialty
                        else "general",
                        "response": lead_response,
                        "priority": "lead_physician",
                    }
                )

        # All relevant team members provide input
        for agent_id, agent in self.team_members.items():
            # Skip if already provided lead response
            if (
                patient_context.priority
                in [PatientPriority.EMERGENCY, PatientPriority.URGENT]
                and agent.role == MedicalRole.SENIOR_DOCTOR
            ):
                continue

            response = await agent._generate_response(
                consultation_request,
                type("Context", (), {"patient_context": patient_context})(),
            )

            messages.append(
                {
                    "agent": agent.name,
                    "role": agent.role.value,
                    "specialty": agent.specialty.value
                    if agent.specialty
                    else "general",
                    "response": response,
                }
            )

        # Generate comprehensive medical plan
        medical_plan = self._create_comprehensive_medical_plan(
            messages, patient_context
        )

        return {
            "consultation_messages": messages,
            "comprehensive_plan": medical_plan,
            "islamic_ethics_verified": patient_context.islamic_medical_ethics,
            "family_involvement_planned": patient_context.family_involvement_required,
            "cultural_sensitivity_maintained": True,
        }

    def _prepare_medical_consultation_request(
        self, patient_context: PatientContext, medical_query: str
    ) -> str:
        """Prepare culturally appropriate medical consultation request"""

        request_parts = []

        # Islamic opening for medical consultation
        request_parts.append("بسم الله الرحمن الرحيم")
        request_parts.append("استشارة طبية - الفريق الطبي المختص")

        # Patient information (maintaining privacy)
        request_parts.append(f"\nمعلومات المريض:")
        request_parts.append(f"- رقم الملف: {patient_context.patient_id}")
        request_parts.append(f"- العمر: {patient_context.age} سنة")
        request_parts.append(f"- الجنس: {patient_context.gender}")
        request_parts.append(f"- الحالة: {patient_context.condition}")
        request_parts.append(f"- مستوى الأولوية: {patient_context.priority.value}")

        # Cultural considerations
        if patient_context.cultural_considerations:
            request_parts.append(
                f"- اعتبارات ثقافية: {', '.join(patient_context.cultural_considerations)}"
            )

        if patient_context.family_involvement_required:
            request_parts.append("- مطلوب: إشراك الأسرة في القرارات الطبية")

        request_parts.append("\nالاستفسار الطبي:")
        request_parts.append(medical_query)

        request_parts.append("\nالمطلوب من الفريق الطبي:")
        request_parts.append("- تقييم طبي شامل")
        request_parts.append("- خطة علاجية متكاملة")
        request_parts.append("- مراعاة الأخلاق الطبية الإسلامية")
        request_parts.append("- إرشادات للمريض والأسرة")

        return "\n".join(request_parts)

    def _create_comprehensive_medical_plan(
        self, messages: List[Dict[str, Any]], patient_context: PatientContext
    ) -> str:
        """Create comprehensive medical plan from team input"""

        plan_parts = []

        plan_parts.append("الخطة الطبية الشاملة")
        plan_parts.append("=" * 40)

        # Medical assessment summary
        plan_parts.append("\n1. التقييم الطبي الجماعي:")
        doctors_input = [
            msg
            for msg in messages
            if msg["role"] in ["senior_doctor", "specialist", "general_practitioner"]
        ]

        for doc_input in doctors_input:
            plan_parts.append(
                f"   - {doc_input['specialty']}: {doc_input['response'][:200]}..."
            )

        # Nursing care plan
        plan_parts.append("\n2. خطة الرعاية التمريضية:")
        nursing_input = [msg for msg in messages if "nurse" in msg["role"]]
        for nurse_input in nursing_input:
            plan_parts.append(f"   - {nurse_input['response'][:200]}...")

        # Pharmaceutical considerations
        plan_parts.append("\n3. الاعتبارات الدوائية:")
        pharmacy_input = [msg for msg in messages if msg["role"] == "pharmacist"]
        if pharmacy_input:
            plan_parts.append(f"   - {pharmacy_input[0]['response'][:200]}...")
        else:
            plan_parts.append("   - مراجعة دوائية مطلوبة")

        # Islamic medical ethics integration
        plan_parts.append("\n4. تطبيق الأخلاق الطبية الإسلامية:")
        plan_parts.extend(
            [
                "   - حفظ كرامة المريض والخصوصية",
                "   - إشراك الأسرة في القرارات المهمة",
                "   - الرحمة والرأفة في التعامل",
                "   - العدالة في تقديم الرعاية",
            ]
        )

        # Family involvement plan
        if patient_context.family_involvement_required:
            plan_parts.append("\n5. خطة إشراك الأسرة:")
            plan_parts.extend(
                [
                    "   - توضيح الحالة الطبية للأسرة",
                    "   - إرشادات الرعاية المنزلية",
                    "   - جدولة المتابعة الطبية",
                    "   - التواصل المستمر مع الفريق الطبي",
                ]
            )

        # Cultural sensitivity measures
        plan_parts.append("\n6. مراعاة الحساسية الثقافية:")
        if patient_context.gender == "female":
            plan_parts.append("   - توفير فريق طبي نسائي عند الحاجة")
        plan_parts.extend(
            [
                "   - احترام العادات والتقاليد",
                "   - مراعاة أوقات الصلاة",
                "   - التعامل بحساسية مع القضايا الدينية",
            ]
        )

        plan_parts.append("\nوالله نسأل أن يمن بالشفاء العاجل والعافية الدائمة")

        return "\n".join(plan_parts)


# Example usage
async def main():
    """Example of Iraqi medical team coordination"""

    # Initialize model client (placeholder)
    from autogen_ext.models.openai import OpenAIChatCompletionClient

    model_client = OpenAIChatCompletionClient(
        model="gpt-4",
        # api_key="your_api_key_here"
    )

    # Create medical team
    medical_team = IraqiMedicalTeam(model_client)

    # Add team members
    medical_team.add_team_member(
        "dr_ahmad", MedicalRole.SENIOR_DOCTOR, MedicalSpecialty.INTERNAL_MEDICINE, 15
    )

    medical_team.add_team_member(
        "dr_fatima", MedicalRole.SPECIALIST, MedicalSpecialty.CARDIOLOGY, 10
    )

    medical_team.add_team_member("nurse_zahra", MedicalRole.HEAD_NURSE, None, 8)

    medical_team.add_team_member("pharmacist_hassan", MedicalRole.PHARMACIST, None, 6)

    # Create patient context
    patient_context = PatientContext(
        patient_id="P_2025_001",
        age=45,
        gender="male",
        condition="chest_pain_cardiac_evaluation",
        priority=PatientPriority.URGENT,
        cultural_considerations=["islamic_dietary_laws", "prayer_times"],
        family_involvement_required=True,
        islamic_medical_ethics=True,
        privacy_level="high",
    )

    # Medical query
    medical_query = """
    السلام عليكم، المريض يعاني من ألم في الصدر منذ ساعتين.
    الألم شديد ويصاحبه ضيق في النفس وتعرق.
    لديه تاريخ مرضي لارتفاع ضغط الدم والسكري.
    نحتاج تقييم عاجل وخطة علاجية شاملة.
    """

    # Handle consultation
    result = await medical_team.handle_patient_consultation(
        patient_context=patient_context, medical_query=medical_query
    )

    print("Iraqi Medical Team Consultation Result:")
    print("=" * 50)
    print(f"Status: {result['status']}")
    print(f"Patient ID: {result.get('patient_id', 'N/A')}")
    print(f"Islamic Ethics Applied: {result.get('islamic_ethics_applied', 'N/A')}")
    print(f"Cultural Validation: {result.get('cultural_validation', 'N/A')}")

    if result["status"] == "completed":
        consultation = result["consultation_result"]
        print("\nComprehensive Medical Plan:")
        print(consultation["comprehensive_plan"])

        print(
            f"\nFamily Involvement Planned: {consultation['family_involvement_planned']}"
        )
        print(
            f"Cultural Sensitivity Maintained: {consultation['cultural_sensitivity_maintained']}"
        )


if __name__ == "__main__":
    asyncio.run(main())
