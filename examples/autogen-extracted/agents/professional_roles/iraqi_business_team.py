"""
Iraqi Business Team Multi-Agent Coordination

Professional business team coordination with Islamic business principles,
Iraqi market knowledge, and cultural business etiquette.
"""

import asyncio
from typing import Dict, List, Any, Optional, Union
from dataclasses import dataclass
from enum import Enum
from datetime import datetime, timedelta
import json

# Import base AutoGen components
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
from arabic_agent_base import (
    IraqiProfessionalAgent,
    ArabicProcessingConfig,
    ProfessionalDomain,
)
from iraqi_group_chat import (
    IraqiGroupChat,
    IraqiGroupConfig,
    IraqiParticipant,
    IraqiGroupRole,
    IraqiDecisionPattern,
)


class BusinessRole(Enum):
    """Iraqi business roles with cultural hierarchy"""

    CEO = "ceo"  # الرئيس التنفيذي
    GENERAL_MANAGER = "general_manager"  # المدير العام
    DEPARTMENT_MANAGER = "department_manager"  # مدير القسم
    SENIOR_ANALYST = "senior_analyst"  # محلل أول
    BUSINESS_ANALYST = "business_analyst"  # محلل أعمال
    SALES_MANAGER = "sales_manager"  # مدير المبيعات
    MARKETING_MANAGER = "marketing_manager"  # مدير التسويق
    FINANCIAL_MANAGER = "financial_manager"  # المدير المالي
    HR_MANAGER = "hr_manager"  # مدير الموارد البشرية
    OPERATIONS_MANAGER = "operations_manager"  # مدير العمليات
    PROJECT_MANAGER = "project_manager"  # مدير المشاريع
    ISLAMIC_ADVISOR = "islamic_advisor"  # مستشار شرعي


class BusinessSector(Enum):
    """Iraqi business sectors"""

    TRADE_COMMERCE = "trade_commerce"  # التجارة
    MANUFACTURING = "manufacturing"  # الصناعة
    CONSTRUCTION = "construction"  # الإنشاءات
    TECHNOLOGY = "technology"  # التكنولوجيا
    FINANCIAL_SERVICES = "financial_services"  # الخدمات المالية
    HEALTHCARE = "healthcare"  # الرعاية الصحية
    EDUCATION = "education"  # التعليم
    TRANSPORTATION = "transportation"  # النقل
    TELECOMMUNICATIONS = "telecommunications"  # الاتصالات
    REAL_ESTATE = "real_estate"  # العقارات
    AGRICULTURE = "agriculture"  # الزراعة
    ENERGY = "energy"  # الطاقة


class BusinessDecisionType(Enum):
    """Types of business decisions"""

    STRATEGIC_PLANNING = "strategic_planning"  # التخطيط الاستراتيجي
    INVESTMENT = "investment"  # الاستثمار
    PARTNERSHIP = "partnership"  # الشراكة
    MARKET_EXPANSION = "market_expansion"  # التوسع في السوق
    PRODUCT_DEVELOPMENT = "product_development"  # تطوير المنتجات
    OPERATIONAL_IMPROVEMENT = "operational_improvement"  # تحسين العمليات
    FINANCIAL_RESTRUCTURING = "financial_restructuring"  # إعادة الهيكلة المالية
    RISK_MANAGEMENT = "risk_management"  # إدارة المخاطر
    COMPLIANCE = "compliance"  # الامتثال
    CRISIS_MANAGEMENT = "crisis_management"  # إدارة الأزمات


@dataclass
class BusinessContext:
    """Context for Iraqi business decisions"""

    business_id: str
    sector: BusinessSector
    decision_type: BusinessDecisionType
    urgency_level: str  # "routine", "important", "urgent", "critical"
    market_scope: str  # "local", "national", "regional", "international"
    budget_impact: str  # "minimal", "moderate", "significant", "major"
    stakeholders: List[str]
    islamic_compliance_required: bool = True
    cultural_sensitivity: str = "high"
    regulatory_requirements: List[str] = None
    competition_analysis_needed: bool = False


class IraqiBusinessAgent(IraqiProfessionalAgent):
    """
    Iraqi business professional agent with market knowledge and Islamic principles
    """

    def __init__(
        self,
        name: str,
        role: BusinessRole,
        sector_expertise: BusinessSector,
        experience_years: int,
        specialization: str,
        model_client: Any,
    ):
        hierarchy_level = self._determine_business_hierarchy(role)

        super().__init__(
            description=f"Iraqi business professional in {sector_expertise.value}",
            professional_role=role.value,
            hierarchy_level=hierarchy_level,
            domain=ProfessionalDomain.BUSINESS,
        )

        self.name = name
        self.role = role
        self.sector_expertise = sector_expertise
        self.experience_years = experience_years
        self.specialization = specialization
        self.model_client = model_client

        # Business-specific knowledge
        self.business_knowledge = {
            "iraqi_market_conditions": True,
            "islamic_business_principles": True,
            "local_regulations": True,
            "cultural_business_practices": True,
            "regional_trade_knowledge": True,
            "government_procedures": True,
        }

        # Sector-specific expertise
        self.sector_knowledge = self._build_sector_knowledge()

        # Islamic business principles
        self.islamic_principles = {
            "halal_verification": True,
            "riba_avoidance": True,
            "ethical_trading": True,
            "social_responsibility": True,
            "transparency": True,
            "trust_building": True,
        }

    def _determine_business_hierarchy(self, role: BusinessRole) -> str:
        """Determine hierarchy level for business roles"""
        hierarchy_map = {
            BusinessRole.CEO: "senior_executive",
            BusinessRole.GENERAL_MANAGER: "senior_executive",
            BusinessRole.DEPARTMENT_MANAGER: "department_head",
            BusinessRole.SENIOR_ANALYST: "senior_professional",
            BusinessRole.SALES_MANAGER: "senior_professional",
            BusinessRole.MARKETING_MANAGER: "senior_professional",
            BusinessRole.FINANCIAL_MANAGER: "senior_professional",
            BusinessRole.HR_MANAGER: "senior_professional",
            BusinessRole.OPERATIONS_MANAGER: "senior_professional",
            BusinessRole.PROJECT_MANAGER: "mid_professional",
            BusinessRole.BUSINESS_ANALYST: "mid_professional",
            BusinessRole.ISLAMIC_ADVISOR: "senior_professional",
        }
        return hierarchy_map.get(role, "mid_professional")

    def _build_sector_knowledge(self) -> Dict[str, Any]:
        """Build sector-specific knowledge base"""

        base_knowledge = {
            "market_dynamics": True,
            "key_players": True,
            "regulatory_environment": True,
            "growth_opportunities": True,
            "challenges": True,
        }

        # Sector-specific additions
        sector_specific = {}

        if self.sector_expertise == BusinessSector.FINANCIAL_SERVICES:
            sector_specific.update(
                {
                    "banking_regulations": True,
                    "islamic_banking": True,
                    "central_bank_policies": True,
                    "payment_systems": True,
                }
            )
        elif self.sector_expertise == BusinessSector.TRADE_COMMERCE:
            sector_specific.update(
                {
                    "import_export_procedures": True,
                    "customs_regulations": True,
                    "trade_agreements": True,
                    "supply_chain_management": True,
                }
            )
        elif self.sector_expertise == BusinessSector.CONSTRUCTION:
            sector_specific.update(
                {
                    "building_codes": True,
                    "government_contracts": True,
                    "material_sourcing": True,
                    "project_management": True,
                }
            )
        # Add more sector-specific knowledge as needed

        return {**base_knowledge, **sector_specific}

    async def _generate_business_response(
        self, content: str, business_context: BusinessContext, ctx: Any
    ) -> str:
        """Generate business response with Iraqi market context"""

        response_parts = []

        # Business greeting
        response_parts.append(self._get_business_greeting(business_context))

        # Professional assessment
        assessment = await self._provide_business_assessment(content, business_context)
        response_parts.append(assessment)

        # Market analysis
        market_analysis = self._analyze_market_conditions(business_context)
        response_parts.append(market_analysis)

        # Islamic compliance check
        if business_context.islamic_compliance_required:
            islamic_compliance = self._check_islamic_business_compliance(
                content, business_context
            )
            response_parts.append(islamic_compliance)

        # Risk assessment
        risk_assessment = self._assess_business_risks(business_context)
        response_parts.append(risk_assessment)

        # Strategic recommendations
        recommendations = self._provide_business_recommendations(
            content, business_context
        )
        response_parts.append(recommendations)

        # Professional closing
        response_parts.append(self._get_business_closing())

        return "\n\n".join(response_parts)

    def _get_business_greeting(self, business_context: BusinessContext) -> str:
        """Get appropriate business greeting"""

        if business_context.urgency_level == "critical":
            return "بسم الله الرحمن الرحيم، في إطار الاستجابة العاجلة لهذه المسألة التجارية المهمة"
        elif business_context.cultural_sensitivity == "religious":
            return "بسم الله الرحمن الرحيم، بركة الله في أعمالنا وتجارتنا"
        else:
            return f"السلام عليكم، بصفتي {self.role.value} في قطاع {self.sector_expertise.value}"

    async def _provide_business_assessment(
        self, content: str, business_context: BusinessContext
    ) -> str:
        """Provide business assessment based on Iraqi market context"""

        assessment_parts = []

        # Role-specific assessment
        if self.role == BusinessRole.CEO:
            assessment_parts.append("من منظور القيادة الاستراتيجية:")
        elif self.role == BusinessRole.FINANCIAL_MANAGER:
            assessment_parts.append("من الناحية المالية والاستثمارية:")
        elif self.role == BusinessRole.MARKETING_MANAGER:
            assessment_parts.append("من ناحية التسويق والعلاقات مع العملاء:")
        elif self.role == BusinessRole.ISLAMIC_ADVISOR:
            assessment_parts.append("من ناحية الامتثال للشريعة الإسلامية في التجارة:")
        else:
            assessment_parts.append(f"من ناحية {self.specialization}:")

        # Sector-specific considerations
        sector_considerations = self._get_sector_considerations(business_context)
        assessment_parts.extend(sector_considerations)

        # Market scope analysis
        if business_context.market_scope == "international":
            assessment_parts.append(
                "بالنظر للطبيعة الدولية للعمل، يجب مراعاة المتطلبات الدولية"
            )
        elif business_context.market_scope == "national":
            assessment_parts.append(
                "على مستوى السوق العراقي، نحتاج لمراعاة الظروف المحلية"
            )

        return " ".join(assessment_parts)

    def _get_sector_considerations(
        self, business_context: BusinessContext
    ) -> List[str]:
        """Get sector-specific business considerations"""

        considerations = []

        if self.sector_expertise == BusinessSector.FINANCIAL_SERVICES:
            considerations.extend(
                [
                    "مراعاة تعليمات البنك المركزي العراقي",
                    "التأكد من التوافق مع المصرفية الإسلامية",
                    "تحليل المخاطر المالية في السوق العراقي",
                ]
            )
        elif self.sector_expertise == BusinessSector.TRADE_COMMERCE:
            considerations.extend(
                [
                    "دراسة إجراءات الاستيراد والتصدير",
                    "مراعاة التعرفة الجمركية",
                    "تحليل سلاسل التوريد المحلية والإقليمية",
                ]
            )
        elif self.sector_expertise == BusinessSector.CONSTRUCTION:
            considerations.extend(
                [
                    "الامتثال لقوانين البناء العراقية",
                    "توفر المواد المحلية",
                    "متطلبات التراخيص والموافقات",
                ]
            )
        elif self.sector_expertise == BusinessSector.TECHNOLOGY:
            considerations.extend(
                [
                    "البنية التحتية التكنولوجية",
                    "قوانين حماية البيانات",
                    "الكوادر التقنية المتخصصة",
                ]
            )

        return considerations

    def _analyze_market_conditions(self, business_context: BusinessContext) -> str:
        """Analyze current Iraqi market conditions"""

        market_parts = []
        market_parts.append("تحليل السوق العراقي:")

        # General market conditions
        market_parts.extend(
            [
                "- الاستقرار الاقتصادي النسبي في السنوات الأخيرة",
                "- نمو في القطاعات غير النفطية",
                "- تحسن في البنية التحتية التجارية",
            ]
        )

        # Sector-specific market analysis
        if self.sector_expertise == BusinessSector.TECHNOLOGY:
            market_parts.extend(
                [
                    "- نمو الطلب على الحلول التقنية",
                    "- استثمارات حكومية في التحول الرقمي",
                    "- زيادة استخدام الإنترنت والهواتف الذكية",
                ]
            )
        elif self.sector_expertise == BusinessSector.CONSTRUCTION:
            market_parts.extend(
                [
                    "- مشاريع إعمار كبيرة في جميع المحافظات",
                    "- استثمارات في الإسكان والبنية التحتية",
                    "- فرص في المدن الجديدة والتطوير العمراني",
                ]
            )

        # Regional considerations
        market_parts.extend(
            [
                "- موقع استراتيجي بين آسيا وأوروبا",
                "- علاقات تجارية متنامية مع دول الجوار",
                "- عضوية في منظمات اقتصادية إقليمية",
            ]
        )

        return "\n".join(market_parts)

    def _check_islamic_business_compliance(
        self, content: str, business_context: BusinessContext
    ) -> str:
        """Check Islamic business compliance"""

        compliance_parts = []
        compliance_parts.append("الامتثال للمبادئ الإسلامية في التجارة:")

        # Halal verification
        if business_context.sector in [
            BusinessSector.TRADE_COMMERCE,
            BusinessSector.MANUFACTURING,
        ]:
            compliance_parts.extend(
                [
                    "- التأكد من حلال جميع المنتجات والخدمات",
                    "- مراجعة مصادر التوريد للامتثال الشرعي",
                    "- الحصول على شهادات الحلال المطلوبة",
                ]
            )

        # Riba (interest) avoidance
        if business_context.decision_type in [
            BusinessDecisionType.INVESTMENT,
            BusinessDecisionType.FINANCIAL_RESTRUCTURING,
        ]:
            compliance_parts.extend(
                [
                    "- تجنب الربا في جميع المعاملات المالية",
                    "- استخدام أدوات التمويل الإسلامي",
                    "- التعامل مع البنوك الإسلامية عند الإمكان",
                ]
            )

        # Ethical business practices
        compliance_parts.extend(
            [
                "- الصدق والأمانة في جميع المعاملات",
                "- العدالة في التعامل مع الموظفين والعملاء",
                "- تجنب الغش والخداع في الإعلان والتسويق",
            ]
        )

        # Social responsibility
        if (
            self.role == BusinessRole.CEO
            or business_context.decision_type == BusinessDecisionType.STRATEGIC_PLANNING
        ):
            compliance_parts.extend(
                [
                    "- المساهمة في التنمية المجتمعية",
                    "- دعم الأعمال الخيرية والتطوعية",
                    "- خلق فرص عمل للشباب العراقي",
                ]
            )

        compliance_parts.append("والله أعلم بالصواب")

        return "\n".join(compliance_parts)

    def _assess_business_risks(self, business_context: BusinessContext) -> str:
        """Assess business risks in Iraqi context"""

        risk_parts = []
        risk_parts.append("تقييم المخاطر:")

        # Market risks
        risk_parts.append("المخاطر السوقية:")
        risk_parts.extend(
            [
                "- تقلبات أسعار النفط وتأثيرها على الاقتصاد",
                "- المنافسة من المنتجات المستوردة",
                "- تغيرات في أذواق المستهلكين",
            ]
        )

        # Operational risks
        risk_parts.append("المخاطر التشغيلية:")
        risk_parts.extend(
            [
                "- توفر الطاقة الكهربائية",
                "- استقرار سلاسل التوريد",
                "- توفر الكوادر المدربة",
            ]
        )

        # Regulatory risks
        risk_parts.append("المخاطر التنظيمية:")
        risk_parts.extend(
            [
                "- تغيرات في القوانين واللوائح",
                "- إجراءات الحصول على التراخيص",
                "- متطلبات الضرائب والرسوم",
            ]
        )

        # Financial risks
        if business_context.budget_impact in ["significant", "major"]:
            risk_parts.append("المخاطر المالية:")
            risk_parts.extend(
                [
                    "- تقلبات أسعار الصرف",
                    "- مخاطر الائتمان والسيولة",
                    "- تضخم التكاليف التشغيلية",
                ]
            )

        # Risk mitigation suggestions
        risk_parts.append("استراتيجيات تخفيف المخاطر:")
        risk_parts.extend(
            [
                "- تنويع مصادر الإيرادات",
                "- بناء احتياطيات مالية",
                "- التأمين على الأصول الرئيسية",
                "- تطوير خطط الطوارئ",
            ]
        )

        return "\n".join(risk_parts)

    def _provide_business_recommendations(
        self, content: str, business_context: BusinessContext
    ) -> str:
        """Provide business recommendations"""

        recommendations = []
        recommendations.append("التوصيات الاستراتيجية:")

        # Role-specific recommendations
        if self.role == BusinessRole.CEO:
            recommendations.extend(
                [
                    "1. وضع رؤية استراتيجية طويلة المدى",
                    "2. تعزيز الحوكمة المؤسسية",
                    "3. الاستثمار في تطوير الكوادر",
                ]
            )
        elif self.role == BusinessRole.MARKETING_MANAGER:
            recommendations.extend(
                [
                    "1. تطوير استراتيجية تسويق محلية",
                    "2. الاستفادة من وسائل التواصل الاجتماعي",
                    "3. بناء علاقات قوية مع العملاء",
                ]
            )
        elif self.role == BusinessRole.FINANCIAL_MANAGER:
            recommendations.extend(
                [
                    "1. تحسين إدارة التدفق النقدي",
                    "2. تنويع مصادر التمويل",
                    "3. تطبيق معايير المحاسبة الدولية",
                ]
            )

        # Decision type specific recommendations
        if business_context.decision_type == BusinessDecisionType.MARKET_EXPANSION:
            recommendations.extend(
                [
                    "4. دراسة الأسواق المستهدفة بعناية",
                    "5. تطوير منتجات تلبي احتياجات محلية",
                    "6. بناء شراكات مع موزعين محليين",
                ]
            )
        elif business_context.decision_type == BusinessDecisionType.INVESTMENT:
            recommendations.extend(
                [
                    "4. تقييم الجدوى الاقتصادية بدقة",
                    "5. التأكد من التوافق مع الأحكام الشرعية",
                    "6. وضع خطة استثمار مرحلية",
                ]
            )

        # Iraqi market specific recommendations
        recommendations.extend(
            [
                "7. الاستفادة من برامج الدعم الحكومي",
                "8. المشاركة في المعارض التجارية المحلية",
                "9. تطوير علاقات مع الجهات الحكومية",
            ]
        )

        return "\n".join(recommendations)

    def _get_business_closing(self) -> str:
        """Get business closing"""
        return (
            "نسأل الله البركة في الأعمال والتوفيق في الخدمة\nمع فائق الاحترام والتقدير"
        )


class IraqiBusinessTeam:
    """
    Coordinates Iraqi business teams with Islamic principles and market knowledge
    """

    def __init__(self, model_client: Any):
        self.model_client = model_client
        self.cultural_validator = IraqiCulturalValidator()

        # Business team members
        self.team_members: Dict[str, IraqiBusinessAgent] = {}
        self.business_group: Optional[IraqiGroupChat] = None

        # Business coordination state
        self.active_decisions: Dict[str, BusinessContext] = {}
        self.decision_history: List[Dict[str, Any]] = []

    def add_team_member(
        self,
        agent_id: str,
        role: BusinessRole,
        sector_expertise: BusinessSector,
        experience_years: int,
        specialization: str,
    ) -> IraqiBusinessAgent:
        """Add team member to business team"""

        agent = IraqiBusinessAgent(
            name=agent_id,
            role=role,
            sector_expertise=sector_expertise,
            experience_years=experience_years,
            specialization=specialization,
            model_client=self.model_client,
        )

        self.team_members[agent_id] = agent
        return agent

    async def setup_business_coordination(
        self, business_context: BusinessContext
    ) -> None:
        """Setup business team coordination"""

        if not self.team_members:
            raise ValueError("No team members added")

        # Create Iraqi participants
        participants = []
        for agent_id, agent in self.team_members.items():
            # Determine role and seniority
            iraqi_role = self._map_business_to_iraqi_role(agent.role)
            seniority = self._calculate_business_seniority(
                agent.role, agent.experience_years
            )

            participant = IraqiParticipant(
                agent=agent,
                role=iraqi_role,
                seniority_level=seniority,
                specialization=f"{agent.specialization}_{agent.sector_expertise.value}",
                cultural_background="iraqi",
                language_preference="arabic",
                religious_role=(agent.role == BusinessRole.ISLAMIC_ADVISOR),
            )
            participants.append(participant)

        # Configure business group chat
        config = IraqiGroupConfig(
            professional_domain=ProfessionalDomain.BUSINESS,
            decision_pattern=self._determine_business_decision_pattern(
                business_context
            ),
            islamic_compliance_required=business_context.islamic_compliance_required,
            cultural_sensitivity_level=business_context.cultural_sensitivity,
        )

        # Create business coordination group
        self.business_group = IraqiGroupChat(
            participants=participants,
            model_client=self.model_client,
            config=config,
            max_turns=25,
        )

        # Register business decision as active
        self.active_decisions[business_context.business_id] = business_context

    def _map_business_to_iraqi_role(
        self, business_role: BusinessRole
    ) -> IraqiGroupRole:
        """Map business role to Iraqi group role"""

        role_mapping = {
            BusinessRole.CEO: IraqiGroupRole.SENIOR_EXECUTIVE,
            BusinessRole.GENERAL_MANAGER: IraqiGroupRole.SENIOR_EXECUTIVE,
            BusinessRole.DEPARTMENT_MANAGER: IraqiGroupRole.DEPARTMENT_HEAD,
            BusinessRole.SENIOR_ANALYST: IraqiGroupRole.SENIOR_PROFESSIONAL,
            BusinessRole.SALES_MANAGER: IraqiGroupRole.SENIOR_PROFESSIONAL,
            BusinessRole.MARKETING_MANAGER: IraqiGroupRole.SENIOR_PROFESSIONAL,
            BusinessRole.FINANCIAL_MANAGER: IraqiGroupRole.SENIOR_PROFESSIONAL,
            BusinessRole.HR_MANAGER: IraqiGroupRole.SENIOR_PROFESSIONAL,
            BusinessRole.OPERATIONS_MANAGER: IraqiGroupRole.SENIOR_PROFESSIONAL,
            BusinessRole.PROJECT_MANAGER: IraqiGroupRole.MID_PROFESSIONAL,
            BusinessRole.BUSINESS_ANALYST: IraqiGroupRole.MID_PROFESSIONAL,
            BusinessRole.ISLAMIC_ADVISOR: IraqiGroupRole.RELIGIOUS_ADVISOR,
        }

        return role_mapping.get(business_role, IraqiGroupRole.MID_PROFESSIONAL)

    def _calculate_business_seniority(self, role: BusinessRole, experience: int) -> int:
        """Calculate seniority level for business roles"""

        base_seniority = {
            BusinessRole.CEO: 10,
            BusinessRole.GENERAL_MANAGER: 9,
            BusinessRole.DEPARTMENT_MANAGER: 7,
            BusinessRole.SENIOR_ANALYST: 6,
            BusinessRole.SALES_MANAGER: 6,
            BusinessRole.MARKETING_MANAGER: 6,
            BusinessRole.FINANCIAL_MANAGER: 6,
            BusinessRole.HR_MANAGER: 6,
            BusinessRole.OPERATIONS_MANAGER: 6,
            BusinessRole.PROJECT_MANAGER: 5,
            BusinessRole.BUSINESS_ANALYST: 4,
            BusinessRole.ISLAMIC_ADVISOR: 8,  # High respect for religious advisor
        }

        seniority = base_seniority.get(role, 4)

        # Adjust based on experience
        if experience > 15:
            seniority += 1
        elif experience > 10:
            seniority += 0.5
        elif experience < 3:
            seniority -= 1

        return min(int(seniority), 10)

    def _determine_business_decision_pattern(
        self, business_context: BusinessContext
    ) -> IraqiDecisionPattern:
        """Determine decision pattern for business context"""

        if business_context.urgency_level == "critical":
            return IraqiDecisionPattern.HIERARCHICAL
        elif (
            business_context.islamic_compliance_required
            and business_context.cultural_sensitivity == "religious"
        ):
            return IraqiDecisionPattern.RELIGIOUS_VALIDATION
        elif business_context.decision_type in [
            BusinessDecisionType.STRATEGIC_PLANNING,
            BusinessDecisionType.INVESTMENT,
        ]:
            return IraqiDecisionPattern.EXPERT_CONSULTATION
        elif len(business_context.stakeholders) > 3:
            return IraqiDecisionPattern.CONSENSUS_BUILDING
        else:
            return IraqiDecisionPattern.COLLABORATIVE

    async def coordinate_business_decision(
        self, business_context: BusinessContext, decision_request: str
    ) -> Dict[str, Any]:
        """
        Coordinate business decision with multi-role team

        Args:
            business_context: Business decision context
            decision_request: Business decision request

        Returns:
            Business coordination results
        """

        if not self.business_group:
            await self.setup_business_coordination(business_context)

        # Validate business appropriateness
        validation_result = self.cultural_validator.validate_message_content(
            content=decision_request,
            domain=ProfessionalDomain.BUSINESS,
            context={
                "sector": business_context.sector.value,
                "decision_type": business_context.decision_type.value,
                "islamic_compliance": business_context.islamic_compliance_required,
            },
        )

        if validation_result.requires_human_review:
            return {
                "status": "requires_review",
                "validation_issues": validation_result.issues,
                "recommendations": validation_result.recommendations,
            }

        # Format business decision request
        formatted_request = self._format_business_request(
            decision_request, business_context
        )

        # Execute business coordination
        coordination_result = await self.business_group.run_iraqi_consultation(
            initial_message=formatted_request,
            cultural_context={
                "business_context": business_context.__dict__,
                "islamic_business_principles": True,
                "iraqi_market_focus": True,
            },
        )

        # Process business results
        final_result = self._process_business_results(
            coordination_result, business_context
        )

        # Log decision
        self.decision_history.append(
            {
                "timestamp": datetime.now().isoformat(),
                "business_id": business_context.business_id,
                "decision_type": business_context.decision_type.value,
                "sector": business_context.sector.value,
                "result_status": final_result["status"],
                "islamic_compliance": final_result.get(
                    "islamic_compliance_verified", True
                ),
            }
        )

        return final_result

    def _format_business_request(
        self, request: str, business_context: BusinessContext
    ) -> str:
        """Format business decision request"""

        formatted_parts = []

        # Business header
        formatted_parts.append("بسم الله الرحمن الرحيم")
        formatted_parts.append("اجتماع فريق القيادة التجارية")
        formatted_parts.append("=" * 35)

        # Business information
        formatted_parts.append("معلومات العمل:")
        formatted_parts.append(f"- رقم القرار: {business_context.business_id}")
        formatted_parts.append(f"- القطاع: {business_context.sector.value}")
        formatted_parts.append(f"- نوع القرار: {business_context.decision_type.value}")
        formatted_parts.append(f"- مستوى الأولوية: {business_context.urgency_level}")
        formatted_parts.append(f"- نطاق السوق: {business_context.market_scope}")
        formatted_parts.append(f"- التأثير المالي: {business_context.budget_impact}")

        # Stakeholders
        if business_context.stakeholders:
            stakeholders_str = ", ".join(business_context.stakeholders)
            formatted_parts.append(f"- أصحاب المصلحة: {stakeholders_str}")

        # Islamic compliance requirement
        if business_context.islamic_compliance_required:
            formatted_parts.append("- مطلوب: التأكد من الامتثال للشريعة الإسلامية")

        # Decision request
        formatted_parts.append("\nموضوع القرار التجاري:")
        formatted_parts.append(request)

        # Required from each role
        formatted_parts.append("\nالمطلوب من كل عضو في الفريق:")
        formatted_parts.append("1. تحليل الوضع من منظور تخصصه")
        formatted_parts.append("2. تقييم المخاطر والفرص")
        formatted_parts.append("3. تقديم التوصيات العملية")
        formatted_parts.append("4. تحديد متطلبات التنفيذ")
        formatted_parts.append("5. تقييم الامتثال للشريعة الإسلامية")

        formatted_parts.append("\nبارك الله في أعمالنا وتجارتنا")

        return "\n".join(formatted_parts)

    def _process_business_results(
        self, coordination_result: Dict[str, Any], business_context: BusinessContext
    ) -> Dict[str, Any]:
        """Process business coordination results"""

        # Extract coordination data
        consultation = coordination_result.get("consultation_result", {})
        messages = consultation.get("consultation_messages", [])

        # Analyze role perspectives
        role_perspectives = {}
        market_analysis = {}
        risk_assessments = {}

        for message in messages:
            agent_info = message.get("agent", "")
            role = message.get("role", "")
            response = message.get("response", "")

            role_perspectives[role] = {
                "agent": agent_info,
                "specialization": message.get("specialization", ""),
                "key_points": self._extract_key_business_points(response),
            }

        # Business-specific analysis
        business_analysis = {
            "market_viability": self._assess_market_viability(messages),
            "financial_feasibility": self._assess_financial_feasibility(messages),
            "risk_level": self._assess_overall_risk(messages),
            "islamic_compliance": self._verify_islamic_compliance(messages),
            "strategic_alignment": self._assess_strategic_alignment(
                messages, business_context
            ),
        }

        # Final business recommendation
        final_recommendation = self._generate_business_recommendation(
            role_perspectives, business_analysis, business_context
        )

        return {
            "status": "completed",
            "business_id": business_context.business_id,
            "business_coordination": {
                "role_perspectives": role_perspectives,
                "business_analysis": business_analysis,
                "final_recommendation": final_recommendation,
                "market_viability": business_analysis["market_viability"],
                "islamic_compliance_verified": business_analysis["islamic_compliance"],
                "next_steps": self._determine_business_next_steps(
                    business_analysis, business_context
                ),
            },
            "cultural_compliance": coordination_result.get("cultural_compliance", {}),
            "islamic_compliance_verified": business_analysis["islamic_compliance"],
            "coordination_pattern": coordination_result.get("decision_pattern", ""),
            "participants_summary": coordination_result.get("participants", []),
        }

    def _extract_key_business_points(self, response: str) -> List[str]:
        """Extract key business points from response"""

        # Simple extraction based on Arabic business keywords
        business_keywords = [
            "توصي",
            "نقترح",
            "الفرصة",
            "المخاطر",
            "السوق",
            "الاستثمار",
            "الربح",
        ]

        sentences = response.split(".")
        key_points = []

        for sentence in sentences:
            if any(keyword in sentence for keyword in business_keywords):
                key_points.append(sentence.strip())

        return key_points[:5]  # Top 5 key points

    def _assess_market_viability(self, messages: List[Dict[str, Any]]) -> str:
        """Assess market viability from team input"""

        positive_indicators = ["فرصة", "نمو", "طلب", "مربح", "واعد"]
        negative_indicators = ["مخاطر", "صعوبة", "تحدي", "منافسة", "خسارة"]

        positive_count = 0
        negative_count = 0

        for message in messages:
            response = message.get("response", "").lower()

            positive_count += sum(
                1 for indicator in positive_indicators if indicator in response
            )
            negative_count += sum(
                1 for indicator in negative_indicators if indicator in response
            )

        if positive_count > negative_count * 1.5:
            return "high"
        elif positive_count > negative_count:
            return "moderate"
        else:
            return "low"

    def _assess_financial_feasibility(self, messages: List[Dict[str, Any]]) -> str:
        """Assess financial feasibility"""

        financial_positive = ["مربح", "جدوى", "عائد", "استثمار جيد"]
        financial_negative = ["تكلفة عالية", "خسارة", "غير مجدي", "صعوبة مالية"]

        positive_score = 0
        negative_score = 0

        for message in messages:
            response = message.get("response", "").lower()

            # Check if it's from financial manager
            if "financial" in message.get("role", "").lower():
                weight = 2  # Higher weight for financial expert
            else:
                weight = 1

            positive_score += weight * sum(
                1 for term in financial_positive if term in response
            )
            negative_score += weight * sum(
                1 for term in financial_negative if term in response
            )

        if positive_score > negative_score:
            return "feasible"
        elif positive_score == negative_score:
            return "marginal"
        else:
            return "not_feasible"

    def _assess_overall_risk(self, messages: List[Dict[str, Any]]) -> str:
        """Assess overall business risk level"""

        high_risk_terms = ["مخاطر عالية", "غير مضمون", "تحدي كبير"]
        medium_risk_terms = ["مخاطر متوسطة", "يحتاج حذر", "تحدي"]
        low_risk_terms = ["مخاطر قليلة", "آمن", "مضمون"]

        risk_scores = {"high": 0, "medium": 0, "low": 0}

        for message in messages:
            response = message.get("response", "").lower()

            if any(term in response for term in high_risk_terms):
                risk_scores["high"] += 1
            elif any(term in response for term in medium_risk_terms):
                risk_scores["medium"] += 1
            elif any(term in response for term in low_risk_terms):
                risk_scores["low"] += 1

        max_risk = max(risk_scores.items(), key=lambda x: x[1])
        return max_risk[0]

    def _verify_islamic_compliance(self, messages: List[Dict[str, Any]]) -> bool:
        """Verify Islamic compliance from team assessment"""

        non_compliant_terms = ["ربا", "غير حلال", "مخالف للشريعة", "غير جائز"]
        compliant_terms = ["حلال", "متوافق مع الشريعة", "جائز شرعاً"]

        compliance_issues = 0
        compliance_confirmations = 0

        for message in messages:
            response = message.get("response", "").lower()

            compliance_issues += sum(
                1 for term in non_compliant_terms if term in response
            )
            compliance_confirmations += sum(
                1 for term in compliant_terms if term in response
            )

        return compliance_confirmations > compliance_issues

    def _assess_strategic_alignment(
        self, messages: List[Dict[str, Any]], business_context: BusinessContext
    ) -> str:
        """Assess strategic alignment with business goals"""

        alignment_terms = ["يتماشى", "يدعم", "استراتيجي", "يحقق الأهداف"]
        misalignment_terms = ["لا يتماشى", "يتعارض", "غير مناسب"]

        alignment_score = 0
        misalignment_score = 0

        for message in messages:
            response = message.get("response", "").lower()

            alignment_score += sum(1 for term in alignment_terms if term in response)
            misalignment_score += sum(
                1 for term in misalignment_terms if term in response
            )

        if alignment_score > misalignment_score:
            return "high"
        elif alignment_score == misalignment_score:
            return "moderate"
        else:
            return "low"

    def _generate_business_recommendation(
        self,
        role_perspectives: Dict[str, Any],
        business_analysis: Dict[str, Any],
        business_context: BusinessContext,
    ) -> str:
        """Generate final business recommendation"""

        recommendation_parts = []

        recommendation_parts.append("التوصية التجارية النهائية:")
        recommendation_parts.append("=" * 35)

        # Market viability assessment
        viability = business_analysis["market_viability"]
        if viability == "high":
            recommendation_parts.append("📈 السوق: فرصة ممتازة مع إمكانيات نمو عالية")
        elif viability == "moderate":
            recommendation_parts.append("📊 السوق: فرصة جيدة مع بعض التحديات")
        else:
            recommendation_parts.append("📉 السوق: فرصة محدودة تحتاج دراسة إضافية")

        # Financial feasibility
        financial = business_analysis["financial_feasibility"]
        if financial == "feasible":
            recommendation_parts.append("💰 المالية: جدوى اقتصادية مقبولة")
        elif financial == "marginal":
            recommendation_parts.append("💰 المالية: جدوى محدودة تحتاج تحسين")
        else:
            recommendation_parts.append("💰 المالية: غير مجدية اقتصادياً حالياً")

        # Risk assessment
        risk = business_analysis["risk_level"]
        if risk == "low":
            recommendation_parts.append("🛡️ المخاطر: مستوى مخاطر منخفض ومقبول")
        elif risk == "medium":
            recommendation_parts.append("⚠️ المخاطر: مستوى مخاطر متوسط قابل للإدارة")
        else:
            recommendation_parts.append(
                "🚨 المخاطر: مستوى مخاطر عالي يحتاج إدارة دقيقة"
            )

        # Islamic compliance
        islamic_compliance = business_analysis["islamic_compliance"]
        if islamic_compliance:
            recommendation_parts.append("☪️ الشريعة: متوافق مع أحكام الشريعة الإسلامية")
        else:
            recommendation_parts.append("⚠️ الشريعة: يحتاج مراجعة للامتثال الشرعي")

        # Final decision
        if (
            viability in ["high", "moderate"]
            and financial in ["feasible", "marginal"]
            and risk in ["low", "medium"]
            and islamic_compliance
        ):
            recommendation_parts.append(
                "\n✅ التوصية النهائية: الموافقة على المبادرة التجارية"
            )

            if business_context.urgency_level == "critical":
                recommendation_parts.append("⚡ المرحلة التالية: بدء التنفيذ الفوري")
            else:
                recommendation_parts.append(
                    "📋 المرحلة التالية: إعداد خطة التنفيذ التفصيلية"
                )
        else:
            recommendation_parts.append(
                "\n❌ التوصية النهائية: تأجيل المبادرة لحين معالجة المسائل المعلقة"
            )
            recommendation_parts.append("🔄 المطلوب: مراجعة شاملة للعوامل المحددة")

        recommendation_parts.append("\nبارك الله في أعمالنا")

        return "\n".join(recommendation_parts)

    def _determine_business_next_steps(
        self, business_analysis: Dict[str, Any], business_context: BusinessContext
    ) -> List[str]:
        """Determine next steps for business decision"""

        next_steps = []

        # Based on analysis results
        if business_analysis["market_viability"] == "low":
            next_steps.extend(
                [
                    "1. إجراء دراسة سوق أكثر تفصيلاً",
                    "2. استشارة خبراء السوق المحلي",
                    "3. تحليل احتياجات العملاء",
                ]
            )

        if business_analysis["financial_feasibility"] != "feasible":
            next_steps.extend(
                [
                    "4. مراجعة النموذج المالي",
                    "5. البحث عن مصادر تمويل بديلة",
                    "6. تحسين هيكل التكاليف",
                ]
            )

        if not business_analysis["islamic_compliance"]:
            next_steps.extend(
                [
                    "7. استشارة مختص في الاقتصاد الإسلامي",
                    "8. تعديل النموذج للامتثال الشرعي",
                    "9. الحصول على فتوى شرعية",
                ]
            )

        if business_analysis["risk_level"] == "high":
            next_steps.extend(
                [
                    "10. وضع خطة إدارة المخاطر",
                    "11. الحصول على تأمين مناسب",
                    "12. إعداد خطط الطوارئ",
                ]
            )

        # General business steps
        if business_analysis["market_viability"] in ["high", "moderate"]:
            next_steps.extend(
                [
                    "13. تشكيل فريق التنفيذ",
                    "14. وضع الجدول الزمني التفصيلي",
                    "15. تحديد مؤشرات الأداء الرئيسية",
                ]
            )

        return next_steps

    def get_team_summary(self) -> Dict[str, Any]:
        """Get summary of business team and activities"""

        return {
            "total_members": len(self.team_members),
            "total_decisions": len(self.decision_history),
            "active_decisions": len(self.active_decisions),
            "role_distribution": {
                role.value: sum(
                    1 for agent in self.team_members.values() if agent.role == role
                )
                for role in BusinessRole
            },
            "sector_expertise": {
                sector.value: sum(
                    1
                    for agent in self.team_members.values()
                    if agent.sector_expertise == sector
                )
                for sector in BusinessSector
            },
            "recent_decisions": self.decision_history[-5:]
            if self.decision_history
            else [],
            "team_experience": {
                "average_years": sum(
                    agent.experience_years for agent in self.team_members.values()
                )
                / len(self.team_members)
                if self.team_members
                else 0,
                "senior_members": sum(
                    1
                    for agent in self.team_members.values()
                    if agent.experience_years > 10
                ),
                "islamic_advisor_present": any(
                    agent.role == BusinessRole.ISLAMIC_ADVISOR
                    for agent in self.team_members.values()
                ),
            },
        }


# Example usage
async def main():
    """Example of Iraqi business team coordination"""

    # Initialize model client (placeholder)
    model_client = OpenAIChatCompletionClient(
        model="gpt-4",
        # api_key="your_api_key_here"
    )

    # Create business team
    business_team = IraqiBusinessTeam(model_client)

    # Add team members
    business_team.add_team_member(
        "ahmed_ceo",
        BusinessRole.CEO,
        BusinessSector.TECHNOLOGY,
        15,
        "strategic_leadership",
    )

    business_team.add_team_member(
        "fatima_finance",
        BusinessRole.FINANCIAL_MANAGER,
        BusinessSector.FINANCIAL_SERVICES,
        12,
        "islamic_finance",
    )

    business_team.add_team_member(
        "omar_marketing",
        BusinessRole.MARKETING_MANAGER,
        BusinessSector.TECHNOLOGY,
        8,
        "digital_marketing",
    )

    business_team.add_team_member(
        "dr_hassan_advisor",
        BusinessRole.ISLAMIC_ADVISOR,
        BusinessSector.FINANCIAL_SERVICES,
        20,
        "islamic_jurisprudence",
    )

    # Create business context
    business_context = BusinessContext(
        business_id="BIZ_2025_TECH_001",
        sector=BusinessSector.TECHNOLOGY,
        decision_type=BusinessDecisionType.INVESTMENT,
        urgency_level="important",
        market_scope="national",
        budget_impact="significant",
        stakeholders=["investors", "employees", "customers", "partners"],
        islamic_compliance_required=True,
        cultural_sensitivity="high",
    )

    # Business decision request
    decision_request = """
    السلام عليكم إخواني في الفريق،
    
    نحتاج لاتخاذ قرار حول الاستثمار في تطوير منصة تكنولوجية جديدة للتجارة الإلكترونية
    تستهدف السوق العراقي والإقليمي.
    
    تفاصيل المشروع:
    1. منصة تجارة إلكترونية متكاملة
    2. دعم اللغة العربية والإنجليزية
    3. تكامل مع أنظمة الدفع المحلية (زين كاش، فاست باي، ناس والت)
    4. امتثال كامل للشريعة الإسلامية
    5. استهداف الشركات الصغيرة والمتوسطة
    
    المطلوب تحليل:
    - الجدوى الاقتصادية والسوقية
    - المتطلبات التقنية والمالية
    - استراتيجية التسويق
    - الامتثال للشريعة الإسلامية
    - خطة التنفيذ والجدول الزمني
    
    مع مراعاة الظروف الاقتصادية الحالية وفرص النمو في القطاع التقني.
    """

    # Execute business coordination
    result = await business_team.coordinate_business_decision(
        business_context=business_context, decision_request=decision_request
    )

    print("Iraqi Business Team Coordination Result:")
    print("=" * 50)
    print(f"Status: {result['status']}")
    print(f"Business ID: {result.get('business_id', 'N/A')}")

    if result["status"] == "completed":
        business_coord = result["business_coordination"]
        print(f"\nMarket Viability: {business_coord['market_viability']}")
        print(f"Team Members Involved: {len(business_coord['role_perspectives'])}")

        print("\nFinal Business Recommendation:")
        print(business_coord["final_recommendation"])

        print(f"\nNext Steps:")
        for step in business_coord["next_steps"][:5]:  # Show first 5 steps
            print(f"  {step}")

        print(
            f"\nIslamic Compliance Verified: {result.get('islamic_compliance_verified', 'N/A')}"
        )

        # Cultural compliance summary
        cultural = result.get("cultural_compliance", {})
        print(f"Cultural Validations: {cultural.get('total_validations', 0)}")
        print(f"Average Compliance: {cultural.get('average_compliance', 0):.2f}")


if __name__ == "__main__":
    asyncio.run(main())
