"""
Iraqi Professional Domain Expert Agent

Agent for professional domain expertise (legal, medical, educational, engineering).
"""

import threading

try:
    from pydantic_ai import Agent, RunContext
except ImportError:
    Agent = None
    RunContext = None
    print("PydanticAI not available - domain expert will use mock mode")

from apps.api.agents.core.base_agent import BaseIraqiAgent
from apps.api.agents.core.providers import get_llm_model
from apps.api.agents.professional.domain_expert.dependencies import DomainExpertDeps
from apps.api.agents.professional.domain_expert.tools import DomainExpertTools
from apps.api.agents.professional.domain_expert.models import DomainSpecificResponse


class IraqiProfessionalDomainExpert(BaseIraqiAgent[DomainExpertDeps]):
    """
    Iraqi professional domain expert agent with specialized knowledge.

    Capabilities:
    - Iraqi legal domain expertise (civil, commercial, criminal law)
    - Iraqi medical domain expertise (healthcare system, terminology)
    - Iraqi educational domain expertise (curriculum, standards)
    - Iraqi engineering domain expertise (building codes, licensing)
    - Iraqi organizational domain expertise (business structures)
    - Bilingual professional terminology (Arabic + English)
    - Iraqi regulatory compliance guidance

    This agent provides professional domain expertise with Iraqi context.
    """

    def __init__(self):
        super().__init__(agent_name="iraqi-professional-domain-expert")
        self.tools = DomainExpertTools()

    def _create_agent(self) -> Agent:
        """Create professional domain expert agent."""
        if Agent is None:
            return None

        agent = Agent(
            model=get_llm_model(),
            system_prompt=self.get_system_prompt(),
            deps_type=DomainExpertDeps,
            retries=self.settings.max_retries,
        )

        # Register tools
        self._register_tools(agent)

        return agent

    def get_system_prompt(self) -> str:
        """Get Iraqi professional domain expert system prompt."""
        return """You are an Iraqi professional domain expert with specialized knowledge in:

**Core Competencies:**
- Iraqi legal system (civil law, commercial law, personal status law)
- Iraqi healthcare system and medical practice
- Iraqi education system and academic standards
- Iraqi engineering practices and building codes
- Iraqi organizational structures and business regulations
- Bilingual professional terminology (Arabic + English)
- Iraqi regulatory compliance and licensing requirements

**Your Role:**
Provide expert guidance on Iraqi professional domains with cultural and regulatory awareness.

**Domain Expertise:**

1. **Legal Domain** (القانون):
   - Iraqi Civil Code (القانون المدني العراقي رقم 40 لسنة 1951)
   - Iraqi Commercial Code (قانون التجارة العراقي رقم 30 لسنة 1984)
   - Personal status law (influenced by Sharia for Muslims)
   - Federal court system and KRG courts
   - Iraqi Bar Association regulations
   - Professional titles: المحامي (attorney), القاضي (judge), المستشار القانوني (legal advisor)

2. **Medical Domain** (الطب):
   - Iraqi Ministry of Health regulations
   - Medical licensing and practice standards
   - Healthcare facility types (public hospitals, private clinics)
   - Iraqi Pharmacopoeia for medications
   - Medical education (Iraqi medical colleges)
   - Professional titles: الدكتور (doctor), الطبيب (physician), الصيدلي (pharmacist)

3. **Educational Domain** (التعليم):
   - Iraqi Ministry of Education curriculum
   - Education structure: Primary (ابتدائي), Intermediate (متوسط), Secondary (ثانوي)
   - Higher education standards (Ministry of Higher Education)
   - Academic accreditation and recognition
   - Professional titles: الأستاذ (professor), المعلم (teacher), المدرس (instructor)

4. **Engineering Domain** (الهندسة):
   - Iraqi Engineers Syndicate (نقابة المهندسين العراقيين)
   - Engineering disciplines and licensing
   - Iraqi building codes and standards
   - Project approval and permit processes
   - Professional title: المهندس (engineer)

5. **Organizational Domain** (التنظيمي):
   - Iraqi business structures (LLC, partnership, sole proprietorship)
   - Iraqi Company Law
   - Professional organizations and syndicates
   - Business licensing and registration

**Response Principles:**

1. **Professional Accuracy** (CRITICAL):
   - Provide accurate, fact-based professional information
   - Cite Iraqi laws, regulations, and standards when applicable
   - Clearly state expertise level (basic/intermediate/expert)
   - Include professional liability disclaimers

2. **Bilingual Terminology** (REQUIRED):
   - Provide Arabic professional terms with English translations
   - Use formal Arabic (MSA) for professional terminology
   - Include definitions for technical terms
   - Respect professional title conventions (الدكتور, المهندس, الأستاذ)

3. **Iraqi Context** (ESSENTIAL):
   - Reference Iraqi-specific regulations and practices
   - Account for regional variations (Baghdad, Basra, Erbil, Kurdistan Region)
   - Consider cultural and Islamic compliance
   - Acknowledge infrastructure and resource constraints

4. **Professional Ethics** (MANDATORY):
   - Always include appropriate disclaimers
   - Recommend licensed professionals for complex matters
   - Respect professional boundaries and limitations
   - Maintain cultural sensitivity and respect

**Output Requirements:**
- Provide bilingual responses (Arabic + English)
- Include relevant professional terminology
- Cite Iraqi laws and regulations
- Add professional disclaimers
- Recommend next steps and resources
- Consider cultural and Islamic compliance

**Important Notes:**
- This is educational information, NOT professional advice
- Complex matters require licensed Iraqi professionals
- Iraqi regulatory environment may change
- Regional differences exist (Federal Iraq vs. Kurdistan Region)
- Professional licensing is mandatory for practice in Iraq
"""

    def _register_tools(self, agent: Agent):
        """Register domain expert tools with the agent."""
        if agent is None:
            return

        # Tools will be registered using @agent.tool decorator
        # Implementation will be completed with full PydanticAI integration
        pass

    async def provide_domain_expertise(
        self,
        query: str,
        domain: str = "legal",
        expertise_level: str = "expert",
    ) -> DomainSpecificResponse:
        """
        Provide professional domain expertise for query.

        Args:
            query: Professional query
            domain: Professional domain (legal, medical, educational, engineering)
            expertise_level: Response expertise level

        Returns:
            Domain-specific expert response
        """
        # Create dependencies
        deps = DomainExpertDeps(
            primary_domain=domain,
            expertise_level=expertise_level,
            include_arabic_terms=True,
            include_disclaimers=True,
            cite_iraqi_law=domain == "legal",
            cultural_mode="strict",
            islamic_compliance_required=True,
        )

        # Validate query
        validation = await self.tools.validate_professional_query(query, domain)

        # Get domain-specific context
        iraqi_context = await self.tools.get_iraqi_professional_context(domain)

        # Get professional disclaimer
        disclaimer = await self.tools.get_professional_disclaimer(domain)

        # Get relevant references (for legal domain)
        references = []
        if domain == "legal":
            references = await self.tools.get_iraqi_legal_references(query)

        # TODO: Generate actual expert response using LLM
        # For now, provide template response
        response_content = f"""
Based on Iraqi {domain} professional standards:

{query}

This is a general overview. For detailed {domain} matters in Iraq, please consult
a licensed Iraqi professional.
"""

        # Create domain-specific response
        return DomainSpecificResponse(
            domain=domain,
            expertise_level=expertise_level,
            response_content=response_content,
            terminology_used=[],  # Would be populated with extracted terminology
            references=references,
            iraqi_specific_considerations=iraqi_context,
            cultural_compliance_notes=[
                "Response respects Iraqi cultural norms",
                "Islamic compliance maintained",
                "Professional titles used appropriately",
            ],
            disclaimer=disclaimer,
            requires_licensed_professional=validation["requires_licensed_professional"],
            recommended_resources=[
                f"Iraqi {domain.title()} Syndicate/Association",
                "Relevant Iraqi Ministry (Health, Education, etc.)",
                "Iraqi regulatory authorities",
            ],
            next_steps=validation["recommendations"],
        )

    async def get_terminology(self, domain: str, term: str):
        """
        Get professional terminology for domain.

        Args:
            domain: Professional domain
            term: English term

        Returns:
            Professional terminology object
        """
        return await self.tools.get_domain_terminology(domain, term)

    async def get_legal_references(self, topic: str):
        """
        Get Iraqi legal references for topic.

        Args:
            topic: Legal topic

        Returns:
            List of Iraqi legal references
        """
        return await self.tools.get_iraqi_legal_references(topic)


# Singleton instance
_domain_expert_instance = None
_domain_expert_lock = threading.Lock()


def get_domain_expert() -> IraqiProfessionalDomainExpert:
    """
    Get or create the global domain expert instance.

    Returns:
        Singleton IraqiProfessionalDomainExpert instance
    """
    global _domain_expert_instance
    if _domain_expert_instance is None:
        with _domain_expert_lock:
            if _domain_expert_instance is None:
                _domain_expert_instance = IraqiProfessionalDomainExpert()
    return _domain_expert_instance
