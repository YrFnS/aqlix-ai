"""Product Manager Models - Pydantic models for product management."""

from typing import Optional, Literal, List
from pydantic import BaseModel, Field


class IraqiUserPersona(BaseModel):
    """Iraqi user persona with cultural context."""

    name: str
    name_arabic: Optional[str] = None
    age_range: str
    location: str  # baghdad, basra, erbil, etc.
    profession: str
    tech_savviness: Literal["low", "medium", "high"]
    language_preference: Literal["arabic", "english", "mixed"]
    pain_points: List[str]
    goals: List[str]
    cultural_considerations: List[str]


class FeaturePriority(BaseModel):
    """Feature prioritization with RICE framework."""

    feature_name: str
    description: str
    reach: int  # Users affected
    impact: int  # 0-3 scale
    confidence: float  # 0-1 scale
    effort: int  # Person-weeks
    rice_score: float  # (Reach * Impact * Confidence) / Effort
    priority: Literal["p0", "p1", "p2", "p3"]
    cultural_validation_required: bool = True


class ProductRoadmap(BaseModel):
    """Product roadmap with Iraqi market focus."""

    product_name: str
    timeframe_months: int
    target_market: str
    features: List[FeaturePriority]
    milestones: List[Dict]
    success_metrics: List[str]
    iraqi_market_considerations: List[str]
    regulatory_requirements: List[str]


Dict = dict  # Type hint fix
