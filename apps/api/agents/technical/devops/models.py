"""DevOps Engineer Models"""

from typing import Optional, Literal, List, Dict, Any
from pydantic import BaseModel, Field


class DeploymentConfig(BaseModel):
    """Deployment configuration for Iraqi infrastructure."""

    environment: Literal["production", "staging", "development"]
    region: str
    timezone: str
    cdn_enabled: bool
    caching_enabled: bool
    monitoring_enabled: bool
    backup_enabled: bool


class MonitoringAlert(BaseModel):
    """Monitoring alert with Iraqi context."""

    alert_id: str
    severity: Literal["critical", "high", "medium", "low"]
    category: Literal[
        "payment_gateway",
        "cultural_compliance",
        "performance",
        "infrastructure",
        "arabic_rendering",
    ]
    message: str
    iraqi_context: Optional[str] = None
    affected_services: List[str] = Field(default_factory=list)
    suggested_action: str


class InfrastructureHealthReport(BaseModel):
    """Infrastructure health report for Iraqi deployment."""

    overall_health: Literal["healthy", "degraded", "critical"]
    payment_gateway_status: Dict[str, str] = Field(default_factory=dict)
    cultural_validation_status: str
    arabic_processing_status: str
    network_stability: Literal["stable", "unstable", "offline"]
    active_alerts: List[MonitoringAlert] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)
