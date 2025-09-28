"""
Iraqi Government Multi-Ministry Coordination System

Demonstrates AutoGen multi-agent coordination for Iraqi government teams
with inter-ministry collaboration, regulatory compliance, and cultural protocols.
"""

import asyncio
from typing import Dict, List, Any, Optional, Set
from dataclasses import dataclass
from enum import Enum
from datetime import datetime, timedelta

from autogen_core import SingleThreadedAgentRuntime, AgentId
from autogen_agentchat import GroupChat, AssistantAgent, UserProxyAgent
from autogen_ext.models.openai import OpenAIChatCompletionClient

# Import Iraqi enhancements
import sys
import os

sys.path.append(
    os.path.join(os.path.dirname(__file__), "..", "..", "core", "iraqi_enhancements")
)
sys.path.append(
    os.path.join(
        os.path.dirname(__file__), "..", "..", "agentchat", "autogen_agentchat"
    )
)

from cultural_validator import (
    IraqiCulturalValidator,
    ProfessionalDomain,
    CulturalCompliance,
)
from arabic_agent_base import IraqiProfessionalAgent, ArabicProcessingConfig
from iraqi_group_chat import (
    IraqiGroupChat,
    IraqiGroupConfig,
    IraqiParticipant,
    IraqiGroupRole,
    IraqiDecisionPattern,
)


class IraqiMinistry(Enum):
    """Iraqi government ministries"""

    HEALTH = "health"  # وزارة الصحة
    EDUCATION = "education"  # وزارة التربية
    INTERIOR = "interior"  # وزارة الداخلية
    DEFENSE = "defense"  # وزارة الدفاع
    FINANCE = "finance"  # وزارة المالية
    JUSTICE = "justice"  # وزارة العدل
    FOREIGN_AFFAIRS = "foreign_affairs"  # وزارة الخارجية
    OIL = "oil"  # وزارة النفط
    ELECTRICITY = "electricity"  # وزارة الكهرباء
    TRANSPORTATION = "transportation"  # وزارة النقل
    TRADE = "trade"  # وزارة التجارة
    AGRICULTURE = "agriculture"  # وزارة الزراعة
    LABOR = "labor"  # وزارة العمل
    PLANNING = "planning"  # وزارة التخطيط
    HIGHER_EDUCATION = "higher_education"  # وزارة التعليم العالي


class GovernmentProjectType(Enum):
    """Types of government projects requiring coordination"""

    INFRASTRUCTURE = "infrastructure"  # مشاريع البنية التحتية
    SOCIAL_SERVICES = "social_services"  # الخدمات الاجتماعية
    ECONOMIC_DEVELOPMENT = "economic_development"  # التنمية الاقتصادية
    SECURITY_COOPERATION = "security_cooperation"  # التعاون الأمني
    EDUCATIONAL_REFORM = "educational_reform"  # الإصلاح التعليمي
    HEALTHCARE_IMPROVEMENT = "healthcare_improvement"  # تطوير الرعاية الصحية
    DIGITAL_TRANSFORMATION = "digital_transformation"  # التحول الرقمي
    ENVIRONMENTAL_PROTECTION = "environmental_protection"  # حماية البيئة
    CULTURAL_PRESERVATION = "cultural_preservation"  # الحفاظ على التراث
    ADMINISTRATIVE_REFORM = "administrative_reform"  # الإصلاح الإداري


class GovernmentUrgency(Enum):
    """Government project urgency levels"""

    ROUTINE = "routine"  # روتيني
    IMPORTANT = "important"  # مهم
    URGENT = "urgent"  # عاجل
    EMERGENCY = "emergency"  # طارئ
    NATIONAL_PRIORITY = "national_priority"  # أولوية وطنية


@dataclass
class GovernmentProjectContext:
    """Context for government project coordination"""

    project_id: str
    project_type: GovernmentProjectType
    urgency_level: GovernmentUrgency
    involved_ministries: List[IraqiMinistry]
    budget_range: str
    timeline_months: int
    requires_parliament_approval: bool = False
    requires_pm_approval: bool = False
    cultural_impact_assessment: bool = True
    environmental_clearance: bool = False
    security_clearance: bool = False
    islamic_compliance_required: bool = True


class IraqiMinistryAgent(IraqiProfessionalAgent):
    """
    Iraqi ministry representative agent with government protocols
    """

    def __init__(
        self,
        ministry: IraqiMinistry,
        representative_name: str,
        position_level: str,  # minister, deputy_minister, director_general, director
        specialization: str,
        model_client: Any,
    ):
        hierarchy_level = self._determine_government_hierarchy(position_level)

        super().__init__(
            description=f"Representative from {ministry.value} ministry",
            professional_role=f"{position_level}_{ministry.value}",
            hierarchy_level=hierarchy_level,
            domain=ProfessionalDomain.GOVERNMENT,
        )

        self.ministry = ministry
        self.representative_name = representative_name
        self.position_level = position_level
        self.specialization = specialization
        self.model_client = model_client

        # Ministry-specific authorities and responsibilities
        self.ministry_authorities = self._get_ministry_authorities()
        self.coordination_protocols = self._get_coordination_protocols()

        # Government-specific knowledge
        self.government_knowledge = {
            "iraqi_constitution": True,
            "administrative_procedures": True,
            "inter_ministry_protocols": True,
            "budget_procedures": True,
            "parliamentary_procedures": position_level
            in ["minister", "deputy_minister"],
            "cabinet_procedures": position_level == "minister",
        }

    def _determine_government_hierarchy(self, position: str) -> str:
        """Determine hierarchy level for government positions"""
        hierarchy_map = {
            "minister": "senior_executive",
            "deputy_minister": "senior_executive",
            "director_general": "department_head",
            "director": "senior_professional",
            "deputy_director": "mid_professional",
            "section_head": "mid_professional",
            "specialist": "junior_professional",
        }
        return hierarchy_map.get(position, "mid_professional")

    def _get_ministry_authorities(self) -> Dict[str, Any]:
        """Get ministry-specific authorities and responsibilities"""

        authorities = {
            "budget_authority": self.position_level in ["minister", "deputy_minister"],
            "policy_making": self.position_level
            in ["minister", "deputy_minister", "director_general"],
            "operational_decisions": True,
            "inter_ministry_agreements": self.position_level
            in ["minister", "deputy_minister"],
            "regulatory_oversight": True,
        }

        # Ministry-specific authorities
        ministry_specific = {}

        if self.ministry == IraqiMinistry.FINANCE:
            ministry_specific.update(
                {
                    "budget_approval": self.position_level == "minister",
                    "financial_oversight": True,
                    "taxation_policy": self.position_level
                    in ["minister", "deputy_minister"],
                    "international_loans": self.position_level == "minister",
                }
            )
        elif self.ministry == IraqiMinistry.HEALTH:
            ministry_specific.update(
                {
                    "healthcare_policy": self.position_level
                    in ["minister", "deputy_minister"],
                    "hospital_oversight": True,
                    "medical_standards": True,
                    "emergency_response": True,
                }
            )
        elif self.ministry == IraqiMinistry.EDUCATION:
            ministry_specific.update(
                {
                    "curriculum_approval": self.position_level
                    in ["minister", "deputy_minister"],
                    "school_oversight": True,
                    "teacher_standards": True,
                    "educational_policy": self.position_level
                    in ["minister", "deputy_minister"],
                }
            )
        # Add more ministry-specific authorities as needed

        return {**authorities, **ministry_specific}

    def _get_coordination_protocols(self) -> Dict[str, Any]:
        """Get inter-ministry coordination protocols"""

        return {
            "formal_communication_required": True,
            "documentation_standards": "official_government",
            "approval_chain": self._get_approval_chain(),
            "consultation_requirements": self._get_consultation_requirements(),
            "reporting_obligations": self._get_reporting_obligations(),
        }

    def _get_approval_chain(self) -> List[str]:
        """Get approval chain for this ministry position"""

        if self.position_level == "minister":
            return ["cabinet", "prime_minister", "council_of_ministers"]
        elif self.position_level == "deputy_minister":
            return ["minister", "cabinet"]
        elif self.position_level == "director_general":
            return ["deputy_minister", "minister"]
        else:
            return ["director_general", "deputy_minister"]

    def _get_consultation_requirements(self) -> List[str]:
        """Get required consultations for decision making"""

        base_consultations = ["legal_review", "budget_review"]

        if self.ministry in [IraqiMinistry.DEFENSE, IraqiMinistry.INTERIOR]:
            base_consultations.append("security_clearance")

        if self.ministry == IraqiMinistry.FINANCE:
            base_consultations.extend(["economic_impact", "fiscal_sustainability"])

        return base_consultations

    def _get_reporting_obligations(self) -> List[str]:
        """Get reporting obligations"""

        obligations = ["monthly_progress", "quarterly_budget", "annual_review"]

        if self.position_level == "minister":
            obligations.extend(["cabinet_reports", "parliamentary_reports"])

        return obligations

    async def _generate_government_response(
        self, content: str, project_context: GovernmentProjectContext, ctx: Any
    ) -> str:
        """Generate government response with official protocols"""

        response_parts = []

        # Official greeting
        response_parts.append(self._get_official_greeting(project_context))

        # Ministry position statement
        ministry_position = await self._provide_ministry_position(
            content, project_context
        )
        response_parts.append(ministry_position)

        # Authority and responsibility assessment
        authority_assessment = self._assess_authority_scope(project_context)
        response_parts.append(authority_assessment)

        # Inter-ministry coordination requirements
        coordination_needs = self._identify_coordination_needs(project_context)
        response_parts.append(coordination_needs)

        # Budget and resource implications
        if "budget" in content.lower() or project_context.budget_range:
            budget_analysis = self._analyze_budget_implications(project_context)
            response_parts.append(budget_analysis)

        # Regulatory and compliance considerations
        compliance_check = self._check_regulatory_compliance(project_context)
        response_parts.append(compliance_check)

        # Next steps and recommendations
        recommendations = self._provide_government_recommendations(project_context)
        response_parts.append(recommendations)

        # Official closing
        response_parts.append(self._get_official_closing())

        return "\n\n".join(response_parts)

    def _get_official_greeting(self, project_context: GovernmentProjectContext) -> str:
        """Get official government greeting"""

        if project_context.urgency_level == GovernmentUrgency.EMERGENCY:
            return "بسم الله الرحمن الرحيم، في إطار الاستجابة العاجلة للمسألة المطروحة"
        else:
            return f"بسم الله الرحمن الرحيم، بصفتي {self.position_level} في {self.ministry.value}"

    async def _provide_ministry_position(
        self, content: str, project_context: GovernmentProjectContext
    ) -> str:
        """Provide ministry's official position"""

        position_parts = []

        # Ministry jurisdiction assessment
        is_primary_ministry = self._is_primary_ministry(project_context)
        is_supporting_ministry = self._is_supporting_ministry(project_context)

        if is_primary_ministry:
            position_parts.append(
                f"وزارة {self.ministry.value} تتولى الدور الرئيسي في هذا المشروع"
            )
        elif is_supporting_ministry:
            position_parts.append(
                f"وزارة {self.ministry.value} تقدم الدعم المطلوب ضمن اختصاصها"
            )
        else:
            position_parts.append(
                f"وزارة {self.ministry.value} تقدم المشورة الفنية المطلوبة"
            )

        # Specific ministry expertise
        expertise_area = self._identify_expertise_area(project_context.project_type)
        if expertise_area:
            position_parts.append(f"خبرتنا في {expertise_area} تساهم في نجاح المشروع")

        # Resource availability assessment
        resource_assessment = self._assess_resource_availability(project_context)
        position_parts.append(resource_assessment)

        return " ".join(position_parts)

    def _is_primary_ministry(self, project_context: GovernmentProjectContext) -> bool:
        """Check if this ministry is primary for the project type"""

        primary_ministry_map = {
            GovernmentProjectType.HEALTHCARE_IMPROVEMENT: [IraqiMinistry.HEALTH],
            GovernmentProjectType.EDUCATIONAL_REFORM: [
                IraqiMinistry.EDUCATION,
                IraqiMinistry.HIGHER_EDUCATION,
            ],
            GovernmentProjectType.INFRASTRUCTURE: [
                IraqiMinistry.PLANNING,
                IraqiMinistry.TRANSPORTATION,
            ],
            GovernmentProjectType.ECONOMIC_DEVELOPMENT: [
                IraqiMinistry.FINANCE,
                IraqiMinistry.PLANNING,
            ],
            GovernmentProjectType.SECURITY_COOPERATION: [
                IraqiMinistry.INTERIOR,
                IraqiMinistry.DEFENSE,
            ],
            GovernmentProjectType.DIGITAL_TRANSFORMATION: [IraqiMinistry.PLANNING],
            GovernmentProjectType.ENVIRONMENTAL_PROTECTION: [
                IraqiMinistry.HEALTH,
                IraqiMinistry.AGRICULTURE,
            ],
        }

        primary_ministries = primary_ministry_map.get(project_context.project_type, [])
        return self.ministry in primary_ministries

    def _is_supporting_ministry(
        self, project_context: GovernmentProjectContext
    ) -> bool:
        """Check if this ministry has supporting role"""

        return (
            self.ministry in project_context.involved_ministries
            and not self._is_primary_ministry(project_context)
        )

    def _identify_expertise_area(
        self, project_type: GovernmentProjectType
    ) -> Optional[str]:
        """Identify ministry's expertise area for project type"""

        expertise_map = {
            IraqiMinistry.HEALTH: {
                GovernmentProjectType.HEALTHCARE_IMPROVEMENT: "الرعاية الصحية",
                GovernmentProjectType.ENVIRONMENTAL_PROTECTION: "الصحة البيئية",
                GovernmentProjectType.SOCIAL_SERVICES: "الخدمات الصحية",
            },
            IraqiMinistry.EDUCATION: {
                GovernmentProjectType.EDUCATIONAL_REFORM: "النظام التعليمي",
                GovernmentProjectType.DIGITAL_TRANSFORMATION: "التعليم الرقمي",
                GovernmentProjectType.CULTURAL_PRESERVATION: "التربية والتراث",
            },
            IraqiMinistry.FINANCE: {
                GovernmentProjectType.ECONOMIC_DEVELOPMENT: "السياسة المالية",
                GovernmentProjectType.INFRASTRUCTURE: "التمويل والاستثمار",
                GovernmentProjectType.ADMINISTRATIVE_REFORM: "الإصلاح المالي",
            },
        }

        ministry_expertise = expertise_map.get(self.ministry, {})
        return ministry_expertise.get(project_type)

    def _assess_resource_availability(
        self, project_context: GovernmentProjectContext
    ) -> str:
        """Assess ministry's resource availability for project"""

        # Simplified resource assessment based on budget range and ministry capacity
        if project_context.budget_range in ["large", "very_large"]:
            if self.ministry == IraqiMinistry.FINANCE:
                return "الموارد المالية تحتاج لمراجعة الموازنة العامة"
            else:
                return "المشروع يتطلب تخصيص موارد إضافية"
        elif project_context.budget_range == "medium":
            return "الموارد المتاحة قد تكون كافية ضمن الموازنة الحالية"
        else:
            return "الموارد المطلوبة متاحة ضمن الإمكانيات الحالية"

    def _assess_authority_scope(self, project_context: GovernmentProjectContext) -> str:
        """Assess authority scope for the project"""

        authority_parts = []

        authority_parts.append("من ناحية الصلاحيات:")

        # Check specific authorities
        if self.ministry_authorities.get(
            "budget_authority"
        ) and project_context.budget_range in ["large", "very_large"]:
            authority_parts.append("- لدينا صلاحية الموافقة على التخصيصات المالية")

        if self.ministry_authorities.get("policy_making"):
            authority_parts.append("- نشارك في وضع السياسات المتعلقة بالمشروع")

        if self.ministry_authorities.get("regulatory_oversight"):
            authority_parts.append("- نتولى الرقابة التنظيمية ضمن اختصاصنا")

        # Inter-ministry agreement authority
        if (
            self.ministry_authorities.get("inter_ministry_agreements")
            and len(project_context.involved_ministries) > 1
        ):
            authority_parts.append("- يمكننا التوقيع على الاتفاقيات بين الوزارات")

        return "\n".join(authority_parts)

    def _identify_coordination_needs(
        self, project_context: GovernmentProjectContext
    ) -> str:
        """Identify inter-ministry coordination needs"""

        coordination_parts = []
        coordination_parts.append("متطلبات التنسيق:")

        # Identify required ministries not yet involved
        required_ministries = self._get_required_ministries(
            project_context.project_type
        )
        missing_ministries = set(required_ministries) - set(
            project_context.involved_ministries
        )

        if missing_ministries:
            missing_names = [ministry.value for ministry in missing_ministries]
            coordination_parts.append(
                f"- يجب إشراك الوزارات التالية: {', '.join(missing_names)}"
            )

        # Specific coordination protocols
        if project_context.requires_parliament_approval:
            coordination_parts.append("- التنسيق مع مجلس النواب مطلوب للموافقة")

        if project_context.requires_pm_approval:
            coordination_parts.append("- موافقة رئيس الوزراء مطلوبة")

        if project_context.security_clearance:
            coordination_parts.append("- التنسيق الأمني مع الوزارات المختصة")

        # Timeline coordination
        if project_context.timeline_months > 12:
            coordination_parts.append("- التنسيق طويل المدى عبر عدة دورات موازنة")

        return "\n".join(coordination_parts)

    def _get_required_ministries(
        self, project_type: GovernmentProjectType
    ) -> List[IraqiMinistry]:
        """Get required ministries for project type"""

        required_ministries_map = {
            GovernmentProjectType.HEALTHCARE_IMPROVEMENT: [
                IraqiMinistry.HEALTH,
                IraqiMinistry.FINANCE,
                IraqiMinistry.PLANNING,
            ],
            GovernmentProjectType.EDUCATIONAL_REFORM: [
                IraqiMinistry.EDUCATION,
                IraqiMinistry.HIGHER_EDUCATION,
                IraqiMinistry.FINANCE,
                IraqiMinistry.PLANNING,
            ],
            GovernmentProjectType.INFRASTRUCTURE: [
                IraqiMinistry.PLANNING,
                IraqiMinistry.FINANCE,
                IraqiMinistry.TRANSPORTATION,
                IraqiMinistry.ELECTRICITY,
                IraqiMinistry.OIL,
            ],
            GovernmentProjectType.SECURITY_COOPERATION: [
                IraqiMinistry.INTERIOR,
                IraqiMinistry.DEFENSE,
                IraqiMinistry.JUSTICE,
            ],
            GovernmentProjectType.ECONOMIC_DEVELOPMENT: [
                IraqiMinistry.FINANCE,
                IraqiMinistry.PLANNING,
                IraqiMinistry.TRADE,
                IraqiMinistry.OIL,
                IraqiMinistry.AGRICULTURE,
            ],
        }

        return required_ministries_map.get(project_type, [])

    def _analyze_budget_implications(
        self, project_context: GovernmentProjectContext
    ) -> str:
        """Analyze budget implications"""

        budget_parts = []
        budget_parts.append("التحليل المالي:")

        # Budget size implications
        if project_context.budget_range == "very_large":
            budget_parts.extend(
                [
                    "- المشروع يتطلب موافقة خاصة من مجلس الوزراء",
                    "- قد يحتاج لتخصيص إضافي في الموازنة",
                    "- تقييم الأثر الاقتصادي مطلوب",
                ]
            )
        elif project_context.budget_range == "large":
            budget_parts.extend(
                [
                    "- ضمن حدود الموازنة مع إعادة تخصيص",
                    "- مراجعة الأولويات المالية مطلوبة",
                ]
            )
        else:
            budget_parts.append("- ضمن المخصصات العادية للوزارة")

        # Timeline budget implications
        if project_context.timeline_months > 24:
            budget_parts.append("- التمويل متعدد السنوات يتطلب التزامات مستقبلية")

        # Ministry-specific budget considerations
        if self.ministry == IraqiMinistry.FINANCE:
            budget_parts.extend(
                [
                    "- سنقوم بمراجعة التأثير على الموازنة العامة",
                    "- تقييم استدامة التمويل على المدى الطويل",
                ]
            )

        return "\n".join(budget_parts)

    def _check_regulatory_compliance(
        self, project_context: GovernmentProjectContext
    ) -> str:
        """Check regulatory compliance requirements"""

        compliance_parts = []
        compliance_parts.append("المتطلبات التنظيمية والامتثال:")

        # Constitutional compliance
        compliance_parts.append("- الامتثال لأحكام الدستور العراقي")

        # Islamic compliance
        if project_context.islamic_compliance_required:
            compliance_parts.append("- التأكد من التوافق مع أحكام الشريعة الإسلامية")

        # Environmental clearance
        if project_context.environmental_clearance:
            compliance_parts.append("- الحصول على الموافقة البيئية المطلوبة")

        # Security clearance
        if project_context.security_clearance:
            compliance_parts.append("- التنسيق الأمني والحصول على التصاريح")

        # Cultural impact assessment
        if project_context.cultural_impact_assessment:
            compliance_parts.append("- تقييم الأثر الثقافي والاجتماعي")

        # Parliamentary procedures
        if project_context.requires_parliament_approval:
            compliance_parts.append("- اتباع الإجراءات البرلمانية للموافقة")

        # International agreements (if applicable)
        if project_context.project_type in [GovernmentProjectType.ECONOMIC_DEVELOPMENT]:
            compliance_parts.append("- مراجعة الالتزامات الدولية ذات الصلة")

        return "\n".join(compliance_parts)

    def _provide_government_recommendations(
        self, project_context: GovernmentProjectContext
    ) -> str:
        """Provide government recommendations"""

        recommendations = []
        recommendations.append("التوصيات:")

        # Urgency-based recommendations
        if project_context.urgency_level == GovernmentUrgency.EMERGENCY:
            recommendations.extend(
                [
                    "1. تفعيل إجراءات الطوارئ",
                    "2. تشكيل لجنة أزمة مشتركة",
                    "3. تخصيص موارد عاجلة",
                ]
            )
        elif project_context.urgency_level == GovernmentUrgency.NATIONAL_PRIORITY:
            recommendations.extend(
                [
                    "1. إدراج المشروع ضمن الأولويات الوطنية",
                    "2. تشكيل لجنة وزارية عليا",
                    "3. وضع جدول زمني مسرع",
                ]
            )
        else:
            recommendations.extend(
                [
                    "1. اتباع الإجراءات الاعتيادية",
                    "2. التنسيق وفق الآليات المعتادة",
                    "3. التقيد بالجدول الزمني المحدد",
                ]
            )

        # Ministry-specific recommendations
        if self.ministry == IraqiMinistry.PLANNING:
            recommendations.append("4. إدراج المشروع في خطة التنمية الوطنية")
        elif self.ministry == IraqiMinistry.FINANCE:
            recommendations.append("4. مراجعة التخصيصات في الموازنة القادمة")

        # Multi-ministry coordination
        if len(project_context.involved_ministries) > 2:
            recommendations.append("5. تشكيل لجنة تنسيق مشتركة بين الوزارات")

        return "\n".join(recommendations)

    def _get_official_closing(self) -> str:
        """Get official government closing"""
        return "مع فائق الاحترام والتقدير\nنسأل الله التوفيق لخدمة شعبنا العراقي الكريم"


class IraqiGovernmentCoordination:
    """
    Coordinates Iraqi government multi-ministry teams
    """

    def __init__(self, model_client: Any):
        self.model_client = model_client
        self.cultural_validator = IraqiCulturalValidator()

        # Ministry representatives
        self.ministry_agents: Dict[IraqiMinistry, IraqiMinistryAgent] = {}
        self.coordination_group: Optional[IraqiGroupChat] = None

        # Government coordination state
        self.active_projects: Dict[str, GovernmentProjectContext] = {}
        self.coordination_history: List[Dict[str, Any]] = []

    def add_ministry_representative(
        self,
        ministry: IraqiMinistry,
        representative_name: str,
        position_level: str,
        specialization: str,
    ) -> IraqiMinistryAgent:
        """Add ministry representative to coordination team"""

        agent = IraqiMinistryAgent(
            ministry=ministry,
            representative_name=representative_name,
            position_level=position_level,
            specialization=specialization,
            model_client=self.model_client,
        )

        self.ministry_agents[ministry] = agent
        return agent

    async def setup_government_coordination(
        self, project_context: GovernmentProjectContext
    ) -> None:
        """Setup multi-ministry coordination for government project"""

        # Ensure all required ministries are represented
        required_ministries = self._get_required_ministries_for_project(project_context)
        missing_ministries = set(required_ministries) - set(self.ministry_agents.keys())

        if missing_ministries:
            raise ValueError(
                f"Missing ministry representatives: {[m.value for m in missing_ministries]}"
            )

        # Create Iraqi participants
        participants = []
        for ministry, agent in self.ministry_agents.items():
            if ministry in project_context.involved_ministries:
                # Determine role based on ministry and project
                role = self._determine_government_role(agent.position_level)
                seniority = self._calculate_government_seniority(
                    agent.position_level, ministry
                )

                participant = IraqiParticipant(
                    agent=agent,
                    role=role,
                    seniority_level=seniority,
                    specialization=agent.specialization + f"_{ministry.value}",
                    cultural_background="iraqi",
                    language_preference="arabic",
                )
                participants.append(participant)

        # Configure Iraqi group chat for government coordination
        config = IraqiGroupConfig(
            professional_domain=ProfessionalDomain.GOVERNMENT,
            decision_pattern=self._determine_decision_pattern(project_context),
            islamic_compliance_required=project_context.islamic_compliance_required,
            cultural_sensitivity_level="high",
        )

        # Create government coordination group
        self.coordination_group = IraqiGroupChat(
            participants=participants,
            model_client=self.model_client,
            config=config,
            max_turns=30,
        )

        # Register project as active
        self.active_projects[project_context.project_id] = project_context

    def _get_required_ministries_for_project(
        self, project_context: GovernmentProjectContext
    ) -> List[IraqiMinistry]:
        """Get required ministries for project type"""

        # Base required ministries from project context
        required = list(project_context.involved_ministries)

        # Always include Finance for budget oversight
        if IraqiMinistry.FINANCE not in required:
            required.append(IraqiMinistry.FINANCE)

        # Always include Planning for development projects
        if (
            project_context.project_type
            in [
                GovernmentProjectType.INFRASTRUCTURE,
                GovernmentProjectType.ECONOMIC_DEVELOPMENT,
                GovernmentProjectType.DIGITAL_TRANSFORMATION,
            ]
            and IraqiMinistry.PLANNING not in required
        ):
            required.append(IraqiMinistry.PLANNING)

        return required

    def _determine_government_role(self, position_level: str) -> IraqiGroupRole:
        """Determine Iraqi group role for government position"""

        role_map = {
            "minister": IraqiGroupRole.SENIOR_EXECUTIVE,
            "deputy_minister": IraqiGroupRole.SENIOR_EXECUTIVE,
            "director_general": IraqiGroupRole.DEPARTMENT_HEAD,
            "director": IraqiGroupRole.SENIOR_PROFESSIONAL,
            "deputy_director": IraqiGroupRole.MID_PROFESSIONAL,
            "section_head": IraqiGroupRole.MID_PROFESSIONAL,
            "specialist": IraqiGroupRole.JUNIOR_PROFESSIONAL,
        }

        return role_map.get(position_level, IraqiGroupRole.MID_PROFESSIONAL)

    def _calculate_government_seniority(
        self, position_level: str, ministry: IraqiMinistry
    ) -> int:
        """Calculate seniority level for government positions"""

        base_seniority = {
            "minister": 10,
            "deputy_minister": 9,
            "director_general": 8,
            "director": 6,
            "deputy_director": 5,
            "section_head": 4,
            "specialist": 3,
        }

        seniority = base_seniority.get(position_level, 3)

        # Adjust for strategic ministries
        strategic_ministries = [
            IraqiMinistry.FINANCE,
            IraqiMinistry.PLANNING,
            IraqiMinistry.DEFENSE,
            IraqiMinistry.INTERIOR,
            IraqiMinistry.OIL,
        ]

        if ministry in strategic_ministries:
            seniority += 1

        return min(seniority, 10)

    def _determine_decision_pattern(
        self, project_context: GovernmentProjectContext
    ) -> IraqiDecisionPattern:
        """Determine decision pattern for government project"""

        if project_context.urgency_level == GovernmentUrgency.EMERGENCY:
            return IraqiDecisionPattern.HIERARCHICAL
        elif (
            project_context.requires_parliament_approval
            or project_context.requires_pm_approval
        ):
            return IraqiDecisionPattern.HIERARCHICAL
        elif len(project_context.involved_ministries) > 3:
            return IraqiDecisionPattern.CONSENSUS_BUILDING
        elif project_context.project_type in [
            GovernmentProjectType.SECURITY_COOPERATION,
            GovernmentProjectType.ADMINISTRATIVE_REFORM,
        ]:
            return IraqiDecisionPattern.EXPERT_CONSULTATION
        else:
            return IraqiDecisionPattern.COLLABORATIVE

    async def coordinate_government_project(
        self, project_context: GovernmentProjectContext, coordination_request: str
    ) -> Dict[str, Any]:
        """
        Coordinate government project with multi-ministry team

        Args:
            project_context: Government project context
            coordination_request: Coordination request details

        Returns:
            Government coordination results
        """

        if not self.coordination_group:
            await self.setup_government_coordination(project_context)

        # Validate request for government appropriateness
        validation_result = self.cultural_validator.validate_message_content(
            content=coordination_request,
            domain=ProfessionalDomain.GOVERNMENT,
            context={
                "project_type": project_context.project_type.value,
                "urgency": project_context.urgency_level.value,
                "ministries": [m.value for m in project_context.involved_ministries],
            },
        )

        if validation_result.requires_human_review:
            return {
                "status": "requires_review",
                "validation_issues": validation_result.issues,
                "recommendations": validation_result.recommendations,
            }

        # Format coordination request with government protocol
        formatted_request = self._format_government_request(
            coordination_request, project_context
        )

        # Execute government coordination
        coordination_result = await self.coordination_group.run_iraqi_consultation(
            initial_message=formatted_request,
            cultural_context={
                "project_context": project_context.__dict__,
                "government_protocol": True,
                "inter_ministry_coordination": True,
            },
        )

        # Process and structure results
        final_result = self._process_government_results(
            coordination_result, project_context
        )

        # Log coordination
        self.coordination_history.append(
            {
                "timestamp": datetime.now().isoformat(),
                "project_id": project_context.project_id,
                "involved_ministries": [
                    m.value for m in project_context.involved_ministries
                ],
                "result_status": final_result["status"],
                "cultural_compliance": final_result.get("cultural_compliance", {}).get(
                    "total_validations", 0
                ),
            }
        )

        return final_result

    def _format_government_request(
        self, request: str, project_context: GovernmentProjectContext
    ) -> str:
        """Format coordination request with government protocol"""

        formatted_parts = []

        # Official header
        formatted_parts.append("بسم الله الرحمن الرحيم")
        formatted_parts.append("جلسة تنسيق حكومية")
        formatted_parts.append("=" * 40)

        # Project information
        formatted_parts.append("معلومات المشروع:")
        formatted_parts.append(f"- رقم المشروع: {project_context.project_id}")
        formatted_parts.append(f"- نوع المشروع: {project_context.project_type.value}")
        formatted_parts.append(
            f"- مستوى الأولوية: {project_context.urgency_level.value}"
        )
        formatted_parts.append(
            f"- المدة الزمنية: {project_context.timeline_months} شهر"
        )
        formatted_parts.append(f"- النطاق المالي: {project_context.budget_range}")

        # Involved ministries
        ministry_names = [
            f"وزارة {m.value}" for m in project_context.involved_ministries
        ]
        formatted_parts.append(f"- الوزارات المشاركة: {', '.join(ministry_names)}")

        # Approval requirements
        if project_context.requires_parliament_approval:
            formatted_parts.append("- مطلوب: موافقة مجلس النواب")
        if project_context.requires_pm_approval:
            formatted_parts.append("- مطلوب: موافقة رئيس الوزراء")

        # Request content
        formatted_parts.append("\nموضوع التنسيق:")
        formatted_parts.append(request)

        # Protocol requirements
        formatted_parts.append("\nالمطلوب من كل وزارة:")
        formatted_parts.append("1. تحديد الاختصاص والدور المطلوب")
        formatted_parts.append("2. تقييم الموارد والإمكانيات المتاحة")
        formatted_parts.append("3. تحديد متطلبات التنسيق مع الوزارات الأخرى")
        formatted_parts.append("4. وضع الجدول الزمني والمعالم الرئيسية")
        formatted_parts.append("5. تحديد المخاطر والتحديات المتوقعة")

        formatted_parts.append("\nنسأل الله التوفيق في خدمة شعبنا العراقي الكريم")

        return "\n".join(formatted_parts)

    def _process_government_results(
        self,
        coordination_result: Dict[str, Any],
        project_context: GovernmentProjectContext,
    ) -> Dict[str, Any]:
        """Process and structure government coordination results"""

        # Extract consultation messages
        consultation = coordination_result.get("consultation_result", {})
        messages = consultation.get("consultation_messages", [])

        # Analyze ministry positions
        ministry_positions = {}
        resource_commitments = {}
        coordination_requirements = {}

        for message in messages:
            agent_info = message.get("agent", "")
            ministry_name = self._extract_ministry_from_agent(agent_info)

            if ministry_name:
                ministry_positions[ministry_name] = {
                    "role": message.get("role", ""),
                    "specialization": message.get("specialization", ""),
                    "position_summary": self._extract_position_summary(
                        message.get("response", "")
                    ),
                }

        # Government-specific analysis
        government_analysis = {
            "decision_consensus": self._analyze_consensus_level(messages),
            "budget_implications": self._extract_budget_implications(messages),
            "timeline_feasibility": self._assess_timeline_feasibility(
                messages, project_context
            ),
            "regulatory_compliance": self._check_government_compliance(messages),
            "inter_ministry_dependencies": self._identify_dependencies(messages),
        }

        # Final government recommendation
        final_recommendation = self._generate_government_recommendation(
            ministry_positions, government_analysis, project_context
        )

        return {
            "status": "completed",
            "project_id": project_context.project_id,
            "government_coordination": {
                "ministry_positions": ministry_positions,
                "government_analysis": government_analysis,
                "final_recommendation": final_recommendation,
                "consensus_level": government_analysis["decision_consensus"],
                "next_steps": self._determine_next_steps(
                    government_analysis, project_context
                ),
            },
            "cultural_compliance": coordination_result.get("cultural_compliance", {}),
            "islamic_compliance_verified": coordination_result.get(
                "islamic_compliance_verified", True
            ),
            "coordination_pattern": coordination_result.get("decision_pattern", ""),
            "participants_summary": coordination_result.get("participants", []),
        }

    def _extract_ministry_from_agent(self, agent_info: str) -> Optional[str]:
        """Extract ministry name from agent information"""
        for ministry in IraqiMinistry:
            if ministry.value in agent_info.lower():
                return ministry.value
        return None

    def _extract_position_summary(self, response: str) -> str:
        """Extract key position points from ministry response"""
        # Simple extraction - in production, use NLP
        lines = response.split("\n")
        summary_lines = [
            line
            for line in lines
            if any(keyword in line for keyword in ["توصي", "نقترح", "نرى", "الموقف"])
        ]
        return " ".join(summary_lines[:3])  # Top 3 position statements

    def _analyze_consensus_level(self, messages: List[Dict[str, Any]]) -> str:
        """Analyze consensus level among ministries"""

        # Simple sentiment analysis based on keywords
        positive_keywords = ["نوافق", "نؤيد", "ممتاز", "جيد", "مناسب"]
        negative_keywords = ["نعارض", "صعوبة", "مشكلة", "غير ممكن", "تحديات"]
        neutral_keywords = ["نحتاج", "يتطلب", "مراجعة", "دراسة"]

        positive_count = 0
        negative_count = 0
        neutral_count = 0

        for message in messages:
            response = message.get("response", "").lower()

            if any(keyword in response for keyword in positive_keywords):
                positive_count += 1
            elif any(keyword in response for keyword in negative_keywords):
                negative_count += 1
            else:
                neutral_count += 1

        total = len(messages)
        if total == 0:
            return "unknown"

        positive_ratio = positive_count / total
        negative_ratio = negative_count / total

        if positive_ratio >= 0.7:
            return "high_consensus"
        elif negative_ratio >= 0.3:
            return "low_consensus"
        else:
            return "moderate_consensus"

    def _extract_budget_implications(
        self, messages: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Extract budget implications from ministry responses"""

        budget_implications = {
            "total_concerns": 0,
            "major_issues": [],
            "funding_sources": [],
            "timeline_impact": "none",
        }

        for message in messages:
            response = message.get("response", "").lower()

            # Budget concerns
            if any(
                keyword in response
                for keyword in ["ميزانية", "تمويل", "مالية", "تكلفة"]
            ):
                budget_implications["total_concerns"] += 1

                if any(keyword in response for keyword in ["صعوبة", "تحدي", "نقص"]):
                    budget_implications["major_issues"].append(
                        message.get("agent", "unknown")
                    )

        return budget_implications

    def _assess_timeline_feasibility(
        self, messages: List[Dict[str, Any]], project_context: GovernmentProjectContext
    ) -> str:
        """Assess timeline feasibility based on ministry responses"""

        timeline_concerns = 0
        for message in messages:
            response = message.get("response", "").lower()
            if any(keyword in response for keyword in ["وقت", "مدة", "جدول", "تأخير"]):
                timeline_concerns += 1

        if timeline_concerns >= len(messages) * 0.5:
            return "challenging"
        elif timeline_concerns > 0:
            return "moderate"
        else:
            return "feasible"

    def _check_government_compliance(
        self, messages: List[Dict[str, Any]]
    ) -> Dict[str, bool]:
        """Check government compliance requirements"""

        compliance_checks = {
            "constitutional": True,
            "regulatory": True,
            "procedural": True,
            "islamic": True,
        }

        for message in messages:
            response = message.get("response", "").lower()

            if any(
                keyword in response for keyword in ["مخالفة", "غير قانوني", "غير شرعي"]
            ):
                compliance_checks["regulatory"] = False

            if "شريعة" in response and any(
                keyword in response for keyword in ["مخالف", "غير متوافق"]
            ):
                compliance_checks["islamic"] = False

        return compliance_checks

    def _identify_dependencies(
        self, messages: List[Dict[str, Any]]
    ) -> List[Dict[str, str]]:
        """Identify inter-ministry dependencies"""

        dependencies = []

        for message in messages:
            response = message.get("response", "")
            agent = message.get("agent", "")

            # Look for dependency keywords
            if any(
                keyword in response
                for keyword in ["يتطلب", "نحتاج", "التنسيق مع", "بالتعاون مع"]
            ):
                dependencies.append(
                    {
                        "from_ministry": agent,
                        "dependency_type": "coordination",
                        "description": self._extract_dependency_description(response),
                    }
                )

        return dependencies

    def _extract_dependency_description(self, response: str) -> str:
        """Extract dependency description from response"""
        # Simple extraction - in production, use NLP
        sentences = response.split(".")
        dependency_sentences = [
            sentence
            for sentence in sentences
            if any(keyword in sentence for keyword in ["يتطلب", "نحتاج", "التنسيق"])
        ]
        return dependency_sentences[0] if dependency_sentences else "غير محدد"

    def _generate_government_recommendation(
        self,
        ministry_positions: Dict[str, Any],
        government_analysis: Dict[str, Any],
        project_context: GovernmentProjectContext,
    ) -> str:
        """Generate final government recommendation"""

        recommendation_parts = []

        recommendation_parts.append("التوصية الحكومية النهائية:")
        recommendation_parts.append("=" * 40)

        # Consensus assessment
        consensus = government_analysis["decision_consensus"]
        if consensus == "high_consensus":
            recommendation_parts.append("✅ يوجد إجماع وزاري على المضي قدماً في المشروع")
        elif consensus == "moderate_consensus":
            recommendation_parts.append("⚠️ يوجد اتفاق جزئي، مع الحاجة لمزيد من التنسيق")
        else:
            recommendation_parts.append("❌ يحتاج المشروع لمراجعة شاملة وحل الخلافات")

        # Budget assessment
        budget_issues = government_analysis["budget_implications"]["major_issues"]
        if not budget_issues:
            recommendation_parts.append("💰 الجانب المالي مقبول من جميع الوزارات")
        else:
            recommendation_parts.append(
                f"💰 مخاوف مالية من: {', '.join(budget_issues)}"
            )

        # Timeline assessment
        timeline = government_analysis["timeline_feasibility"]
        if timeline == "feasible":
            recommendation_parts.append("⏰ الجدول الزمني قابل للتنفيذ")
        else:
            recommendation_parts.append("⏰ الجدول الزمني يحتاج مراجعة")

        # Final decision
        if (
            consensus in ["high_consensus", "moderate_consensus"]
            and timeline in ["feasible", "moderate"]
            and len(budget_issues) <= 1
        ):
            recommendation_parts.append(
                "\n✅ التوصية: الموافقة على المشروع مع التنسيق المطلوب"
            )

            if project_context.requires_pm_approval:
                recommendation_parts.append(
                    "📋 المرحلة التالية: رفع التوصية لرئيس الوزراء"
                )
            elif project_context.requires_parliament_approval:
                recommendation_parts.append(
                    "📋 المرحلة التالية: رفع مشروع القانون للبرلمان"
                )
            else:
                recommendation_parts.append("📋 المرحلة التالية: تشكيل لجنة التنفيذ")
        else:
            recommendation_parts.append(
                "\n❌ التوصية: تأجيل المشروع لحين حل المسائل المعلقة"
            )
            recommendation_parts.append("📋 المطلوب: جلسة تنسيق إضافية لحل الخلافات")

        recommendation_parts.append("\nوالله ولي التوفيق")

        return "\n".join(recommendation_parts)

    def _determine_next_steps(
        self,
        government_analysis: Dict[str, Any],
        project_context: GovernmentProjectContext,
    ) -> List[str]:
        """Determine next steps for government coordination"""

        next_steps = []

        # Based on consensus level
        consensus = government_analysis["decision_consensus"]
        if consensus == "low_consensus":
            next_steps.extend(
                [
                    "1. جلسة تنسيق إضافية لحل الخلافات",
                    "2. مراجعة المتطلبات مع الوزارات المعنية",
                    "3. تعديل نطاق المشروع إذا لزم الأمر",
                ]
            )
        else:
            next_steps.extend(
                [
                    "1. تشكيل لجنة التنسيق الدائمة",
                    "2. وضع الخطة التفصيلية للتنفيذ",
                    "3. تحديد المعالم والمواعيد النهائية",
                ]
            )

        # Based on approval requirements
        if project_context.requires_pm_approval:
            next_steps.append("4. إعداد الملف لرئيس مجلس الوزراء")

        if project_context.requires_parliament_approval:
            next_steps.append("5. صياغة مشروع القانون المطلوب")

        # Budget and resources
        if government_analysis["budget_implications"]["major_issues"]:
            next_steps.append("6. مراجعة التخصيصات المالية مع وزارة المالية")

        return next_steps

    def get_coordination_summary(self) -> Dict[str, Any]:
        """Get summary of government coordination activities"""

        return {
            "total_projects": len(self.active_projects),
            "total_coordinations": len(self.coordination_history),
            "participating_ministries": list(self.ministry_agents.keys()),
            "ministry_count": len(self.ministry_agents),
            "recent_activity": self.coordination_history[-5:]
            if self.coordination_history
            else [],
            "active_projects": {
                project_id: {
                    "type": project.project_type.value,
                    "urgency": project.urgency_level.value,
                    "ministries_count": len(project.involved_ministries),
                }
                for project_id, project in self.active_projects.items()
            },
        }


# Example usage
async def main():
    """Example of Iraqi government multi-ministry coordination"""

    # Initialize model client (placeholder)
    model_client = OpenAIChatCompletionClient(
        model="gpt-4",
        # api_key="your_api_key_here"
    )

    # Create government coordination system
    gov_coordination = IraqiGovernmentCoordination(model_client)

    # Add ministry representatives
    gov_coordination.add_ministry_representative(
        ministry=IraqiMinistry.HEALTH,
        representative_name="د. أحمد محمد",
        position_level="minister",
        specialization="healthcare_policy",
    )

    gov_coordination.add_ministry_representative(
        ministry=IraqiMinistry.FINANCE,
        representative_name="د. فاطمة علي",
        position_level="deputy_minister",
        specialization="budget_planning",
    )

    gov_coordination.add_ministry_representative(
        ministry=IraqiMinistry.PLANNING,
        representative_name="م. حسن كريم",
        position_level="director_general",
        specialization="development_planning",
    )

    # Create government project context
    project_context = GovernmentProjectContext(
        project_id="GOV_2025_HEALTH_001",
        project_type=GovernmentProjectType.HEALTHCARE_IMPROVEMENT,
        urgency_level=GovernmentUrgency.IMPORTANT,
        involved_ministries=[
            IraqiMinistry.HEALTH,
            IraqiMinistry.FINANCE,
            IraqiMinistry.PLANNING,
        ],
        budget_range="large",
        timeline_months=18,
        requires_parliament_approval=False,
        requires_pm_approval=True,
        islamic_compliance_required=True,
        environmental_clearance=False,
        security_clearance=False,
    )

    # Coordination request
    coordination_request = """
    السلام عليكم إخواني الكرام،
    
    نحتاج للتنسيق بخصوص مشروع تطوير الرعاية الصحية الأولية في المحافظات.
    المشروع يهدف إلى:
    
    1. تحديث وتطوير مراكز الرعاية الصحية الأولية
    2. تدريب الكوادر الطبية والصحية
    3. توفير المعدات والأجهزة الطبية الحديثة
    4. تطوير أنظمة المعلومات الصحية
    
    المطلوب من كل وزارة تحديد:
    - الدور والمسؤوليات ضمن اختصاصها
    - المتطلبات المالية والبشرية
    - الجدول الزمني المقترح
    - التحديات المتوقعة وكيفية التعامل معها
    
    مع مراعاة الالتزام بأحكام الشريعة الإسلامية في جميع جوانب المشروع.
    """

    # Execute government coordination
    result = await gov_coordination.coordinate_government_project(
        project_context=project_context, coordination_request=coordination_request
    )

    print("Iraqi Government Multi-Ministry Coordination Result:")
    print("=" * 60)
    print(f"Status: {result['status']}")
    print(f"Project ID: {result.get('project_id', 'N/A')}")

    if result["status"] == "completed":
        gov_coord = result["government_coordination"]
        print(f"\nConsensus Level: {gov_coord['consensus_level']}")
        print(f"Ministries Involved: {len(gov_coord['ministry_positions'])}")

        print("\nFinal Government Recommendation:")
        print(gov_coord["final_recommendation"])

        print(f"\nNext Steps:")
        for step in gov_coord["next_steps"]:
            print(f"  {step}")

        print(
            f"\nIslamic Compliance Verified: {result.get('islamic_compliance_verified', 'N/A')}"
        )

        # Cultural compliance summary
        cultural = result.get("cultural_compliance", {})
        print(f"Cultural Validations: {cultural.get('total_validations', 0)}")
        print(f"Compliance Score: {cultural.get('average_compliance', 0):.2f}")


if __name__ == "__main__":
    asyncio.run(main())
