"""Iraqi DevOps Engineer Dependencies"""

from dataclasses import dataclass
from typing import Literal, Optional, List
from apps.api.agents.core.models import IraqiAgentDependencies


@dataclass
class DevOpsEngineerDeps(IraqiAgentDependencies):
    """Dependencies for Iraqi DevOps engineer agent."""

    # Deployment Configuration
    deployment_target: Literal["production", "staging", "development"] = "production"
    region: Literal["iraq", "mena", "global"] = "iraq"

    # Iraqi Infrastructure
    timezone: str = "Asia/Baghdad"  # UTC+3
    expect_network_instability: bool = True
    offline_first_deployment: bool = True

    # Monitoring Configuration
    monitor_payment_gateways: bool = True
    monitor_cultural_compliance: bool = True
    monitor_arabic_performance: bool = True

    # CI/CD Configuration
    enable_automated_tests: bool = True
    require_cultural_validation: bool = True
    require_arabic_tests: bool = True

    # Infrastructure Requirements
    cdn_enabled: bool = True
    caching_strategy: Literal["aggressive", "moderate", "minimal"] = "aggressive"
    backup_frequency_hours: int = 6
