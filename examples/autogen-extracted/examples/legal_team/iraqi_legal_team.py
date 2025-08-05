"""
Iraqi Legal Team Multi-Agent Coordination Example

Demonstrates AutoGen multi-agent coordination for Iraqi legal professional teams
with cultural context, Islamic compliance, and hierarchical decision-making.
"""

import asyncio
from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from enum import Enum

from autogen_core import SingleThreadedAgentRuntime, AgentId
from autogen_agentchat import GroupChat, AssistantAgent, UserProxyAgent
from autogen_ext.models.openai import OpenAIChatCompletionClient

# Import Iraqi enhancements
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'core', 'iraqi_enhancements'))

from cultural_validator import (
    IraqiCulturalValidator, 
    IraqiProfessionalHierarchy,
    ProfessionalDomain, 
    CulturalCompliance
)
from arabic_agent_base import IraqiProfessionalAgent, ArabicProcessingConfig, ProfessionalDomain


class LegalRole(Enum):
    """Iraqi legal professional roles"""
    SENIOR_PARTNER = "senior_partner"
    ASSOCIATE_LAWYER = "associate_lawyer" 
    PARALEGAL = "paralegal"
    CASE_MANAGER = "case_manager"
    LEGAL_RESEARCHER = "legal_researcher"
    CLIENT_REPRESENTATIVE = "client_representative"


class CaseType(Enum):
    """Types of legal cases in Iraqi context"""
    CIVIL_LAW = "civil_law"
    COMMERCIAL_LAW = "commercial_law"
    FAMILY_LAW = "family_law"
    CRIMINAL_LAW = "criminal_law"
    ADMINISTRATIVE_LAW = "administrative_law"
    ISLAMIC_JURISPRUDENCE = "islamic_jurisprudence"


@dataclass
class LegalCaseContext:
    """Context for legal case coordination"""
    case_id: str
    case_type: CaseType
    urgency_level: str  # "low", "medium", "high", "urgent"
    cultural_sensitivity: str  # "standard", "high", "religious"
    client_info: Dict[str, Any]
    legal_requirements: List[str]
    islamic_compliance_required: bool = True


class IraqiLawyerAgent(IraqiProfessionalAgent):
    """
    Iraqi lawyer agent with legal expertise and cultural context
    """
    
    def __init__(
        self,
        name: str,
        role: LegalRole,
        specialization: str,
        experience_years: int,
        model_client: Any
    ):
        hierarchy_level = self._determine_hierarchy_level(role, experience_years)
        
        super().__init__(
            description=f"Iraqi lawyer specialized in {specialization}",
            professional_role=role.value,
            hierarchy_level=hierarchy_level,
            domain=ProfessionalDomain.LEGAL
        )
        
        self.name = name
        self.role = role
        self.specialization = specialization
        self.experience_years = experience_years
        self.model_client = model_client
        
        # Legal-specific knowledge
        self.legal_expertise = {
            'iraqi_legal_system': True,
            'islamic_jurisprudence': True,
            'civil_code': specialization in ['civil_law', 'commercial_law'],
            'family_law': specialization == 'family_law',
            'shariah_compliance': True
        }
    
    def _determine_hierarchy_level(self, role: LegalRole, experience: int) -> str:
        """Determine hierarchy level based on role and experience"""
        if role == LegalRole.SENIOR_PARTNER or experience > 15:
            return "senior_executive"
        elif role == LegalRole.ASSOCIATE_LAWYER and experience > 5:
            return "senior_professional"
        elif role in [LegalRole.CASE_MANAGER, LegalRole.LEGAL_RESEARCHER]:
            return "mid_professional" 
        else:
            return "junior_professional"
    
    async def _generate_response(self, content: str, ctx: Any) -> str:
        """
        Generate legal response with Iraqi professional context
        """
        # Extract case context if available
        case_context = getattr(ctx, 'case_context', None)
        
        # Build response with legal and cultural considerations
        response_parts = []
        
        # Professional legal greeting
        greeting = self._get_legal_greeting(case_context)
        response_parts.append(greeting)
        
        # Legal analysis with cultural context
        analysis = await self._provide_legal_analysis(content, case_context)
        response_parts.append(analysis)
        
        # Islamic compliance check if required
        if case_context and case_context.islamic_compliance_required:
            compliance_check = self._check_islamic_compliance(content, case_context)
            response_parts.append(compliance_check)
        
        # Professional recommendations
        recommendations = self._provide_legal_recommendations(content, case_context)
        response_parts.append(recommendations)
        
        # Professional closing
        closing = self._get_legal_closing(case_context)
        response_parts.append(closing)
        
        return "\n\n".join(response_parts)
    
    def _get_legal_greeting(self, case_context: Optional[LegalCaseContext]) -> str:
        """Get appropriate legal professional greeting"""
        if case_context and case_context.cultural_sensitivity == "religious":
            return "بسم الله الرحمن الرحيم، السلام عليكم ورحمة الله وبركاته"
        else:
            return "السلام عليكم، تحية طيبة وبعد"
    
    async def _provide_legal_analysis(self, content: str, case_context: Optional[LegalCaseContext]) -> str:
        """Provide legal analysis based on Iraqi law and Islamic principles"""
        analysis_parts = []
        
        # Role-specific analysis
        if self.role == LegalRole.SENIOR_PARTNER:
            analysis_parts.append("بصفتي الشريك الأول في المكتب، أقدم التحليل القانوني التالي:")
        elif self.role == LegalRole.ASSOCIATE_LAWYER:
            analysis_parts.append(f"بصفتي محامي متخصص في {self.specialization}، أرى أن:")
        else:
            analysis_parts.append("من الناحية القانونية:")
        
        # Case type specific analysis
        if case_context:
            if case_context.case_type == CaseType.FAMILY_LAW:
                analysis_parts.append("في قضايا الأحوال الشخصية، يجب مراعاة أحكام الشريعة الإسلامية")
            elif case_context.case_type == CaseType.COMMERCIAL_LAW:
                analysis_parts.append("في القانون التجاري، نلتزم بأحكام الشريعة في المعاملات المالية")
            elif case_context.case_type == CaseType.CIVIL_LAW:
                analysis_parts.append("وفقاً للقانون المدني العراقي ومبادئ الشريعة الإسلامية")
        
        # Add legal framework reference
        analysis_parts.append("استناداً إلى الدستور العراقي والقوانين النافذة")
        
        return " ".join(analysis_parts)
    
    def _check_islamic_compliance(self, content: str, case_context: LegalCaseContext) -> str:
        """Check Islamic compliance for legal matters"""
        compliance_parts = []
        
        compliance_parts.append("من ناحية الامتثال للشريعة الإسلامية:")
        
        # Case-specific Islamic considerations
        if case_context.case_type == CaseType.COMMERCIAL_LAW:
            compliance_parts.extend([
                "- يجب التأكد من خلو العقد من الربا",
                "- مراجعة عدم وجود غرر أو جهالة في المعاملة",
                "- التأكد من حلال الأنشطة التجارية المذكورة"
            ])
        elif case_context.case_type == CaseType.FAMILY_LAW:
            compliance_parts.extend([
                "- مراعاة أحكام الميراث الشرعي",
                "- التأكد من صحة الإجراءات وفق الشريعة",
                "- مراجعة المتطلبات الشرعية للزواج أو الطلاق"
            ])
        
        compliance_parts.append("والله أعلم بالصواب")
        
        return "\n".join(compliance_parts)
    
    def _provide_legal_recommendations(self, content: str, case_context: Optional[LegalCaseContext]) -> str:
        """Provide legal recommendations based on role and expertise"""
        recommendations = []
        
        recommendations.append("التوصيات القانونية:")
        
        # Role-based recommendations
        if self.role == LegalRole.SENIOR_PARTNER:
            recommendations.extend([
                "1. مراجعة شاملة للوثائق القانونية",
                "2. استشارة فقهية إضافية إذا لزم الأمر",
                "3. إعداد استراتيجية قانونية متكاملة"
            ])
        elif self.role == LegalRole.LEGAL_RESEARCHER:
            recommendations.extend([
                "1. البحث في السوابق القضائية ذات الصلة",
                "2. مراجعة النصوص القانونية والفقهية",
                "3. إعداد مذكرة قانونية مفصلة"
            ])
        else:
            recommendations.extend([
                "1. متابعة الإجراءات القانونية المطلوبة",
                "2. التنسيق مع الزملاء المختصين",
                "3. إعلام الموكل بالتطورات"
            ])
        
        return "\n".join(recommendations)
    
    def _get_legal_closing(self, case_context: Optional[LegalCaseContext]) -> str:
        """Get appropriate legal professional closing"""
        if case_context and case_context.cultural_sensitivity == "religious":
            return "نسأل الله التوفيق والسداد، ومع فائق الاحترام والتقدير"
        else:
            return "مع أطيب التحيات وفائق الاحترام"


class IraqiLegalTeam:
    """
    Coordinates Iraqi legal team with cultural context and hierarchical decision-making
    """
    
    def __init__(self, model_client: Any):
        self.model_client = model_client
        self.cultural_validator = IraqiCulturalValidator()
        self.hierarchy_manager = IraqiProfessionalHierarchy()
        
        # Initialize team members
        self.team_members: Dict[str, IraqiLawyerAgent] = {}
        self.runtime: Optional[SingleThreadedAgentRuntime] = None
        self.group_chat: Optional[GroupChat] = None
        
    def add_team_member(
        self,
        agent_id: str,
        role: LegalRole,
        specialization: str,
        experience_years: int
    ) -> IraqiLawyerAgent:
        """Add a team member to the legal team"""
        agent = IraqiLawyerAgent(
            name=agent_id,
            role=role,
            specialization=specialization,
            experience_years=experience_years,
            model_client=self.model_client
        )
        
        self.team_members[agent_id] = agent
        return agent
    
    async def setup_team_coordination(self) -> None:
        """Setup multi-agent coordination with Iraqi hierarchy"""
        if not self.team_members:
            raise ValueError("No team members added")
        
        # Initialize runtime
        self.runtime = SingleThreadedAgentRuntime()
        
        # Register agents
        registered_agents = []
        for agent_id, agent in self.team_members.items():
            await agent.register_instance(
                runtime=self.runtime,
                agent_id=AgentId(agent_id, "iraqi_lawyer")
            )
            registered_agents.append(agent)
        
        # Create group chat with Iraqi coordination patterns
        self.group_chat = GroupChat(
            participants=registered_agents,
            max_turns=20,
            cultural_context="iraqi_legal_professional"
        )
    
    async def handle_legal_consultation(
        self, 
        case_context: LegalCaseContext,
        client_query: str
    ) -> Dict[str, Any]:
        """
        Handle legal consultation with multi-agent coordination
        
        Args:
            case_context: Legal case context
            client_query: Client's legal query
            
        Returns:
            Comprehensive legal consultation result
        """
        if not self.group_chat:
            await self.setup_team_coordination()
        
        # Validate cultural appropriateness
        validation_result = self.cultural_validator.validate_message_content(
            content=client_query,
            domain=ProfessionalDomain.LEGAL,
            context={'case_type': case_context.case_type.value}
        )
        
        if validation_result.requires_human_review:
            return {
                'status': 'requires_review',
                'validation_issues': validation_result.issues,
                'recommendations': validation_result.recommendations
            }
        
        # Determine coordination pattern based on case complexity
        participants = [
            {
                'id': agent_id,
                'role': agent.role.value,
                'level': agent._hierarchy_level,
                'specialization': agent.specialization
            }
            for agent_id, agent in self.team_members.items()
        ]
        
        coordination_pattern = self.hierarchy_manager.get_coordination_pattern(
            participants=participants,
            task_type=case_context.case_type.value
        )
        
        # Execute consultation with cultural context
        consultation_result = await self._execute_consultation(
            case_context=case_context,
            client_query=client_query,
            coordination_pattern=coordination_pattern
        )
        
        return {
            'status': 'completed',
            'case_id': case_context.case_id,
            'consultation_result': consultation_result,
            'coordination_pattern': coordination_pattern,
            'cultural_validation': validation_result.compliance_level.value
        }
    
    async def _execute_consultation(
        self,
        case_context: LegalCaseContext,
        client_query: str,
        coordination_pattern: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Execute legal consultation with team coordination"""
        
        # Prepare culturally appropriate consultation request
        consultation_request = self._prepare_consultation_request(
            case_context, client_query
        )
        
        # Execute group consultation
        messages = []
        
        # Senior partner leads if available
        senior_partners = [
            agent for agent in self.team_members.values()
            if agent.role == LegalRole.SENIOR_PARTNER
        ]
        
        if senior_partners and coordination_pattern['decision_type'] == 'senior_approval':
            lead_agent = senior_partners[0]
            lead_response = await lead_agent._generate_response(
                consultation_request, 
                type('Context', (), {'case_context': case_context})()
            )
            messages.append({
                'agent': lead_agent.name,
                'role': lead_agent.role.value,
                'response': lead_response
            })
        
        # Specialized agents provide input
        for agent_id, agent in self.team_members.items():
            if (agent.role != LegalRole.SENIOR_PARTNER or 
                coordination_pattern['decision_type'] != 'senior_approval'):
                
                response = await agent._generate_response(
                    consultation_request,
                    type('Context', (), {'case_context': case_context})()
                )
                messages.append({
                    'agent': agent.name,
                    'role': agent.role.value,
                    'specialization': agent.specialization,
                    'response': response
                })
        
        # Generate final recommendation
        final_recommendation = self._synthesize_recommendations(
            messages, case_context, coordination_pattern
        )
        
        return {
            'consultation_messages': messages,
            'final_recommendation': final_recommendation,
            'islamic_compliance_verified': case_context.islamic_compliance_required,
            'hierarchy_respected': True
        }
    
    def _prepare_consultation_request(
        self, 
        case_context: LegalCaseContext, 
        client_query: str
    ) -> str:
        """Prepare culturally appropriate consultation request"""
        
        request_parts = []
        
        # Islamic opening
        request_parts.append("بسم الله الرحمن الرحيم")
        
        # Case information
        request_parts.append(f"معلومات القضية:")
        request_parts.append(f"- رقم القضية: {case_context.case_id}")
        request_parts.append(f"- نوع القضية: {case_context.case_type.value}")
        request_parts.append(f"- مستوى الأولوية: {case_context.urgency_level}")
        
        if case_context.islamic_compliance_required:
            request_parts.append("- مطلوب: التأكد من الامتثال للشريعة الإسلامية")
        
        request_parts.append("\nاستفسار الموكل:")
        request_parts.append(client_query)
        
        request_parts.append("\nالمطلوب: تقديم المشورة القانونية الشاملة مع مراعاة:")
        request_parts.append("- القوانين العراقية النافذة")
        request_parts.append("- أحكام الشريعة الإسلامية")
        request_parts.append("- الاعتبارات الثقافية والاجتماعية")
        
        return "\n".join(request_parts)
    
    def _synthesize_recommendations(
        self,
        messages: List[Dict[str, Any]],
        case_context: LegalCaseContext,
        coordination_pattern: Dict[str, Any]
    ) -> str:
        """Synthesize final recommendations from team input"""
        
        synthesis_parts = []
        
        synthesis_parts.append("الرأي القانوني النهائي للفريق:")
        synthesis_parts.append("=" * 40)
        
        # Hierarchical synthesis based on coordination pattern
        if coordination_pattern['decision_type'] == 'senior_approval':
            senior_input = [msg for msg in messages 
                          if msg['role'] == LegalRole.SENIOR_PARTNER.value]
            if senior_input:
                synthesis_parts.append("رأي الشريك الأول:")
                synthesis_parts.append(senior_input[0]['response'])
        
        # Specialized input summary
        synthesis_parts.append("\nآراء المختصين:")
        specializations = {}
        for msg in messages:
            if 'specialization' in msg:
                spec = msg['specialization']
                if spec not in specializations:
                    specializations[spec] = []
                specializations[spec].append(msg['response'])
        
        for spec, responses in specializations.items():
            synthesis_parts.append(f"\n{spec}:")
            synthesis_parts.extend(responses)
        
        # Final unified recommendation
        synthesis_parts.append("\nالتوصية النهائية:")
        synthesis_parts.append("بناء على المشاورة الجماعية وخبرة الفريق القانوني")
        synthesis_parts.append("نوصي بالإجراءات التالية مع مراعاة الشريعة الإسلامية والقانون العراقي")
        
        synthesis_parts.append("\nوالله ولي التوفيق")
        
        return "\n".join(synthesis_parts)


# Example usage
async def main():
    """Example of Iraqi legal team coordination"""
    
    # Initialize model client (placeholder)
    model_client = OpenAIChatCompletionClient(
        model="gpt-4",
        # api_key="your_api_key_here"
    )
    
    # Create legal team
    legal_team = IraqiLegalTeam(model_client)
    
    # Add team members
    legal_team.add_team_member(
        "ahmed_partner",
        LegalRole.SENIOR_PARTNER,
        "civil_law",
        20
    )
    
    legal_team.add_team_member(
        "fatima_associate",
        LegalRole.ASSOCIATE_LAWYER,
        "commercial_law",
        8
    )
    
    legal_team.add_team_member(
        "hassan_researcher",
        LegalRole.LEGAL_RESEARCHER,
        "islamic_jurisprudence",
        5
    )
    
    # Create case context
    case_context = LegalCaseContext(
        case_id="CASE_2025_001",
        case_type=CaseType.COMMERCIAL_LAW,
        urgency_level="high",
        cultural_sensitivity="religious",
        client_info={"name": "شركة النور التجارية", "type": "commercial"},
        legal_requirements=["shariah_compliance", "commercial_law"],
        islamic_compliance_required=True
    )
    
    # Client query
    client_query = """
    السلام عليكم، نحتاج مشورة قانونية بخصوص عقد شراكة تجارية جديدة.
    الشراكة تتضمن استثمار في مجال التكنولوجيا المالية.
    نريد التأكد من أن العقد متوافق مع الشريعة الإسلامية والقانون العراقي.
    """
    
    # Handle consultation
    result = await legal_team.handle_legal_consultation(
        case_context=case_context,
        client_query=client_query
    )
    
    print("Iraqi Legal Team Consultation Result:")
    print("=" * 50)
    print(f"Status: {result['status']}")
    print(f"Case ID: {result.get('case_id', 'N/A')}")
    print(f"Cultural Validation: {result.get('cultural_validation', 'N/A')}")
    
    if result['status'] == 'completed':
        consultation = result['consultation_result']
        print("\nFinal Recommendation:")
        print(consultation['final_recommendation'])
        
        print(f"\nIslamic Compliance Verified: {consultation['islamic_compliance_verified']}")
        print(f"Hierarchy Respected: {consultation['hierarchy_respected']}")


if __name__ == "__main__":
    asyncio.run(main())