"""Iraqi Product Manager Agent - Product management with Iraqi market focus."""

try:
    from pydantic_ai import Agent
except ImportError:
    Agent = None

from typing import Optional
from apps.api.agents.core.base_agent import BaseIraqiAgent
from apps.api.agents.core.providers import get_llm_model
from apps.api.agents.professional.product_manager.dependencies import ProductManagerDeps
from apps.api.agents.professional.product_manager.tools import ProductManagementTools
from apps.api.agents.professional.product_manager.models import (
    ProductRoadmap,
    FeaturePriority,
)


class IraqiProductManager(BaseIraqiAgent[ProductManagerDeps]):
    """Iraqi product manager agent with market and cultural awareness."""

    def __init__(self):
        super().__init__(agent_name="iraqi-product-manager")
        self.tools = ProductManagementTools()

    def _create_agent(self) -> Optional[Agent]:
        if Agent is None:
            return None
        return Agent(
            model=get_llm_model(),
            system_prompt=self.get_system_prompt(),
            deps_type=ProductManagerDeps,
            retries=self.settings.max_retries,
        )

    def get_system_prompt(self) -> str:
        return """You are an Iraqi product manager expert with:

**Core Competencies:**
- Iraqi market analysis and product-market fit validation
- Feature prioritization with cultural constraints (RICE, MoSCoW)
- User persona development for Iraqi demographics
- Product roadmap planning with Iraqi market dynamics
- Stakeholder management across Arabic-English communication
- Competitive analysis in MENA region

**Iraqi Market Focus:**
- Population: 47M with 80%+ smartphone penetration
- Payment: ZainCash, FastPay, NassWallet (local gateways)
- Infrastructure: Offline-first design critical
- Language: Arabic essential, English for professionals
- Cultural: Islamic compliance, family-oriented, trust-based
- Regulations: Iraqi commercial law, data protection

**Product Management Principles:**
1. Validate product-market fit for Iraqi conditions
2. Prioritize features using RICE/MoSCoW with cultural validation
3. Design for infrastructure constraints (offline-first)
4. Ensure cultural and Islamic compliance
5. Support bilingual experiences (Arabic + English)
6. Integrate Iraqi payment gateways
7. Respect prayer times and Iraqi business hours

**Output:** Product roadmaps, feature priorities, user personas, market analysis with Iraqi context."""

    def _register_tools(self, agent: Agent):
        pass  # Tools registered via @agent.tool decorator

    async def plan_product_roadmap(
        self, product_name: str, features: List[dict], target_market: str = "nationwide"
    ) -> ProductRoadmap:
        """Plan product roadmap with Iraqi market focus."""
        prioritized_features = await self.tools.prioritize_features(features)
        market_insights = self.tools.get_iraqi_market_insights(target_market)

        return ProductRoadmap(
            product_name=product_name,
            timeframe_months=12,
            target_market=target_market,
            features=prioritized_features[:20],  # Top 20
            milestones=[
                {
                    "month": 3,
                    "goal": "MVP with Arabic support and ZainCash integration",
                },
                {"month": 6, "goal": "Baghdad market launch with cultural validation"},
                {
                    "month": 12,
                    "goal": "Nationwide expansion with all payment gateways",
                },
            ],
            success_metrics=[
                "User adoption rate > 10K users in 6 months",
                "Cultural appropriateness score > 95%",
                "Payment success rate > 95% (Iraqi gateways)",
                "Arabic interface usage > 70%",
            ],
            iraqi_market_considerations=market_insights,
            regulatory_requirements=[
                "Iraqi commercial law compliance",
                "Data protection regulations",
                "Islamic compliance (100%)",
                "Payment gateway regulations (Iraqi banks)",
            ],
        )

    async def generate_personas(self):
        """Generate Iraqi user personas."""
        return await self.tools.generate_iraqi_personas()


_product_manager_instance = None


def get_product_manager() -> IraqiProductManager:
    global _product_manager_instance
    if _product_manager_instance is None:
        _product_manager_instance = IraqiProductManager()
    return _product_manager_instance
