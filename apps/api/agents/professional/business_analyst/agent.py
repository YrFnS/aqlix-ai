"""
Iraqi Business Analyst Agent

Agent for business analysis with Iraqi market context and cultural awareness.
"""

import threading

try:
    from pydantic_ai import Agent, RunContext
except ImportError:
    Agent = None
    RunContext = None
    print("PydanticAI not available - business analyst will use mock mode")

from datetime import datetime
from apps.api.agents.core.base_agent import BaseIraqiAgent
from apps.api.agents.core.providers import get_llm_model
from .dependencies import BusinessAnalystDeps
from .tools import BusinessAnalysisTools
from .models import BusinessAnalysisReport


class IraqiBusinessAnalyst(BaseIraqiAgent[BusinessAnalystDeps]):
    """
    Iraqi business analyst agent with cultural and market awareness.

    Capabilities:
    - Business requirement analysis with Iraqi context
    - ROI modeling for Iraqi market conditions
    - Stakeholder coordination across Arabic-English communication
    - Iraqi commercial law compliance validation
    - User story generation with cultural considerations
    - Market insights for Iraqi regions

    This agent ensures business analysis aligns with Iraqi market realities.
    """

    def __init__(self):
        super().__init__(agent_name="iraqi-business-analyst")
        self.tools = BusinessAnalysisTools()

    def _create_agent(self) -> Agent:
        """Create business analyst agent with Iraqi market expertise."""
        if Agent is None:
            return None

        agent = Agent(
            model=get_llm_model(),
            system_prompt=self.get_system_prompt(),
            deps_type=BusinessAnalystDeps,
            retries=self.settings.max_retries,
        )

        # Register tools
        self._register_tools(agent)

        return agent

    def get_system_prompt(self) -> str:
        """Get Iraqi business analyst system prompt."""
        return """You are an Iraqi business analyst specialist with expertise in:

**Core Competencies:**
- Iraqi market analysis and business environment understanding
- Requirements engineering with cultural context
- Stakeholder management across Arabic-English communication
- ROI modeling for Iraqi economic conditions
- Iraqi commercial law and regulatory compliance
- User story development with cultural considerations

**Your Role:**
Analyze business requirements and translate them into actionable specifications that work in Iraqi market context.

**Analysis Principles:**

1. **Iraqi Market Context** (CRITICAL):
   - Understand regional differences (Baghdad, Basra, Erbil, Mosul)
   - Account for infrastructure challenges (electricity, internet)
   - Consider currency fluctuations (IQD exchange rate volatility)
   - Factor in Iraqi business hours and prayer times
   - Respect cultural decision-making processes (family-oriented, hierarchical)

2. **Requirements Engineering** (ESSENTIAL):
   - Extract clear, actionable business requirements
   - Translate between stakeholder languages (Arabic/English)
   - Apply MoSCoW prioritization (Must/Should/Could/Won't)
   - Generate SMART acceptance criteria
   - Ensure Iraqi cultural compliance in all requirements

3. **Stakeholder Management** (REQUIRED):
   - Identify all stakeholders with Iraqi context
   - Assess influence and interest levels
   - Plan culturally appropriate engagement strategies
   - Support bilingual communication (Arabic + English)
   - Respect professional hierarchies and titles

4. **ROI Analysis** (Iraqi Market Conditions):
   - Calculate in both IQD and USD
   - Account for Iraqi-specific risk factors:
     * Currency volatility
     * Economic sanctions impact
     * Infrastructure reliability
     * Political stability
     * Payment gateway availability
   - Provide realistic break-even projections
   - Include mitigation strategies for Iraqi risks

5. **Regulatory Compliance** (MANDATORY):
   - Iraqi commercial law compliance
   - Islamic principles adherence
   - Data protection regulations
   - Payment gateway regulations (Iraqi banks only)
   - Professional licensing requirements

**Output Requirements:**
- Provide bilingual documentation (Arabic + English)
- Use formal Arabic (MSA) for official documents
- Include cultural considerations in all requirements
- Generate user stories with Iraqi context
- Validate all requirements against Iraqi regulations
- Provide actionable recommendations

**Iraqi Business Environment Knowledge:**
- Payment gateways: ZainCash, FastPay, NassWallet
- Exchange rate: ~1,300 IQD = 1 USD (variable)
- Working hours: Respect prayer times (5 daily prayers)
- Business culture: Relationship-oriented, hierarchical
- Key sectors: Oil/gas, trade, retail, services, technology
- Languages: Arabic (primary), Kurdish (Kurdistan Region), English (business)
"""

    def _register_tools(self, agent: Agent):
        """Register business analysis tools with the agent."""
        if agent is None:
            return

        # Tools will be registered using @agent.tool decorator
        # Implementation will be completed with full PydanticAI integration
        pass

    async def analyze_business(
        self,
        project_description: str,
        target_market: str = "nationwide",
        business_sector: str = "general",
        include_roi: bool = False,
    ) -> BusinessAnalysisReport:
        """
        Perform comprehensive business analysis for Iraqi market.

        Args:
            project_description: Project description with business goals
            target_market: Target Iraqi market (baghdad, basra, erbil, nationwide)
            business_sector: Business sector (retail, finance, healthcare, etc.)
            include_roi: Whether to include ROI analysis

        Returns:
            Comprehensive business analysis report
        """
        # FIX #4: Remove unused deps variable creation (was never used in the function)
        # Removed lines 162-169 that created but never used BusinessAnalystDeps

        # Analyze business requirements
        requirements = await self.tools.analyze_business_requirements(
            project_description, business_sector
        )

        # Generate user stories
        user_stories = await self.tools.generate_user_stories(requirements)

        # Analyze stakeholders
        stakeholders = await self.tools.analyze_stakeholders(project_description)

        # Calculate ROI if requested
        roi_analysis = None
        if include_roi:
            # Example calculation - would be extracted from project_description
            roi_analysis = await self.tools.calculate_roi(
                investment_iqd=50_000_000,  # 50M IQD (~$38,500 USD)
                expected_revenue_iqd=80_000_000,  # 80M IQD
                timeframe_months=12,
                market_context=target_market,
            )

        # Validate Iraqi compliance
        compliance_result = await self.tools.validate_iraqi_compliance(requirements)

        # Generate market insights
        market_insights = self.tools.generate_market_insights(
            target_market, business_sector
        )

        # Cultural requirements
        cultural_requirements = [
            "All user-facing content must support Arabic language",
            "Respect Iraqi business hours and prayer times",
            "Islamic compliance in all features (no alcohol, gambling, interest)",
            "Use appropriate professional titles in Arabic (الدكتور, المهندس, الأستاذ)",
            "Support Iraqi payment gateways (ZainCash, FastPay, NassWallet)",
            "Validate Iraqi national ID format (15-digit)",
        ]

        # Create analysis report
        return BusinessAnalysisReport(
            project_name=f"{business_sector.title()} Project",
            analysis_date=datetime.now().strftime("%Y-%m-%d"),
            analyst_name="Iraqi Business Analyst Agent",
            executive_summary=f"Business analysis for {business_sector} project targeting {target_market} market in Iraq.",
            executive_summary_arabic=f"تحليل الأعمال لمشروع {business_sector} يستهدف سوق {target_market} في العراق",
            business_requirements=requirements,
            user_stories=user_stories,
            roi_analysis=roi_analysis,
            stakeholder_analysis=stakeholders,
            iraqi_market_insights=market_insights,
            cultural_requirements=cultural_requirements,
            regulatory_compliance=compliance_result["compliance_items"],
            recommendations=compliance_result["recommendations"],
            risks=[
                "Currency fluctuation (IQD volatility)",
                "Infrastructure challenges (electricity, internet)",
                "Payment gateway integration complexity",
                "Regulatory compliance overhead",
            ],
            mitigation_strategies=[
                "Use multi-gateway payment integration with fallback",
                "Design offline-first features for infrastructure resilience",
                "Early engagement with Iraqi regulatory authorities",
                "Comprehensive cultural validation testing",
            ],
        )

    async def generate_requirements(self, description: str, context: str = "general"):
        """
        Generate business requirements from description.

        Args:
            description: Requirements description
            context: Business context

        Returns:
            List of business requirements
        """
        return await self.tools.analyze_business_requirements(description, context)

    async def calculate_market_roi(
        self, investment_iqd: float, revenue_iqd: float, months: int = 12
    ):
        """
        Calculate ROI for Iraqi market.

        Args:
            investment_iqd: Investment amount in IQD
            revenue_iqd: Expected revenue in IQD
            months: Timeframe in months

        Returns:
            ROI analysis
        """
        return await self.tools.calculate_roi(
            investment_iqd, revenue_iqd, months, "iraq"
        )


# Singleton instance
_business_analyst_instance = None
_business_analyst_lock = threading.Lock()


def get_business_analyst() -> IraqiBusinessAnalyst:
    """
    Get or create the global business analyst instance.

    Returns:
        Singleton IraqiBusinessAnalyst instance
    """
    global _business_analyst_instance
    if _business_analyst_instance is None:
        with _business_analyst_lock:
            if _business_analyst_instance is None:
                _business_analyst_instance = IraqiBusinessAnalyst()
    return _business_analyst_instance
