"""Product Manager Tools - Iraqi product management utilities."""

from typing import List
from apps.api.agents.professional.product_manager.models import (
    FeaturePriority,
    IraqiUserPersona,
)


class ProductManagementTools:
    """Tools for Iraqi product management."""

    @staticmethod
    async def calculate_rice_score(
        reach: int, impact: int, confidence: float, effort: int
    ) -> float:
        """Calculate RICE score: (Reach * Impact * Confidence) / Effort"""
        if effort == 0:
            return 0.0
        return (reach * impact * confidence) / effort

    @staticmethod
    async def prioritize_features(
        features: List[dict],
    ) -> List[FeaturePriority]:
        """Prioritize features using RICE framework."""
        prioritized = []
        for f in features:
            rice_score = await ProductManagementTools.calculate_rice_score(
                f.get("reach", 100),
                f.get("impact", 2),
                f.get("confidence", 0.8),
                f.get("effort", 1),
            )
            priority = "p0" if rice_score > 50 else "p1" if rice_score > 20 else "p2"

            prioritized.append(
                FeaturePriority(
                    feature_name=f["name"],
                    description=f.get("description", ""),
                    reach=f.get("reach", 100),
                    impact=f.get("impact", 2),
                    confidence=f.get("confidence", 0.8),
                    effort=f.get("effort", 1),
                    rice_score=rice_score,
                    priority=priority,
                    cultural_validation_required=f.get("cultural_validation", True),
                )
            )

        return sorted(prioritized, key=lambda x: x.rice_score, reverse=True)

    @staticmethod
    async def generate_iraqi_personas() -> List[IraqiUserPersona]:
        """Generate common Iraqi user personas."""
        return [
            IraqiUserPersona(
                name="Ahmad - Baghdad Professional",
                name_arabic="أحمد - محترف من بغداد",
                age_range="28-35",
                location="Baghdad",
                profession="Software Engineer",
                tech_savviness="high",
                language_preference="mixed",
                pain_points=[
                    "Unreliable internet connectivity",
                    "Limited payment options",
                    "Lack of Arabic language support",
                ],
                goals=[
                    "Efficient work tools",
                    "Reliable services",
                    "Bilingual support",
                ],
                cultural_considerations=[
                    "Respects prayer times",
                    "Values family time",
                    "Prefers local payment methods",
                ],
            ),
            IraqiUserPersona(
                name="Fatima - Basra Business Owner",
                name_arabic="فاطمة - صاحبة عمل من البصرة",
                age_range="35-45",
                location="Basra",
                profession="Retail Business Owner",
                tech_savviness="medium",
                language_preference="arabic",
                pain_points=[
                    "Complex digital tools",
                    "No Arabic support",
                    "High transaction fees",
                ],
                goals=[
                    "Simple business tools",
                    "Low-cost solutions",
                    "Arabic interface",
                ],
                cultural_considerations=[
                    "Traditional business practices",
                    "Family-oriented decisions",
                    "Trust-based relationships",
                ],
            ),
        ]

    @staticmethod
    def get_iraqi_market_insights(market: str) -> List[str]:
        """Get Iraqi market insights for product planning."""
        insights = {
            "nationwide": [
                "47M population with growing digital adoption",
                "Mobile-first market (80%+ smartphone penetration)",
                "Payment gateways: ZainCash, FastPay, NassWallet",
                "Infrastructure challenges require offline-first design",
                "Arabic language essential for mass adoption",
                "Cultural and Islamic compliance non-negotiable",
            ],
            "baghdad": [
                "7M+ population, largest tech-savvy market",
                "High demand for digital services",
                "English proficiency higher than other cities",
                "Payment gateway availability good",
            ],
            "erbil": [
                "Most stable infrastructure in Iraq",
                "Bilingual market (Kurdish, Arabic, English)",
                "International business presence",
                "Growing startup ecosystem",
            ],
        }
        return insights.get(market, insights["nationwide"])
