"""Iraqi DevOps Engineer Agent - DevOps with Iraqi infrastructure awareness."""

import threading

try:
    from pydantic_ai import Agent
except ImportError:
    Agent = None

from apps.api.agents.core.base_agent import BaseIraqiAgent
from apps.api.agents.core.providers import get_llm_model
from apps.api.agents.technical.devops.dependencies import DevOpsEngineerDeps
from apps.api.agents.technical.devops.tools import DevOpsTools
from apps.api.agents.technical.devops.models import (
    InfrastructureHealthReport,
    MonitoringAlert,
)


class IraqiDevOpsEngineer(BaseIraqiAgent[DevOpsEngineerDeps]):
    """
    Iraqi DevOps engineer agent with infrastructure awareness.

    Capabilities:
    - Deployment automation for Iraqi infrastructure
    - Payment gateway health monitoring (ZainCash, FastPay, NassWallet)
    - Cultural compliance monitoring
    - Arabic performance tracking
    - CI/CD pipeline management with Iraqi requirements
    - Infrastructure resilience for unstable networks
    - Backup strategy for Iraqi compliance
    """

    def __init__(self):
        super().__init__(agent_name="iraqi-devops-engineer")
        self.tools = DevOpsTools()

    def _create_agent(self) -> Agent:
        if Agent is None:
            return None
        return Agent(
            model=get_llm_model(),
            system_prompt=self.get_system_prompt(),
            deps_type=DevOpsEngineerDeps,
            retries=self.settings.max_retries,
        )

    def get_system_prompt(self) -> str:
        return """You are an Iraqi DevOps engineer specialist with expertise in:

**Core Competencies:**
- Iraqi infrastructure deployment and automation
- Payment gateway monitoring (ZainCash, FastPay, NassWallet)
- Cultural compliance and Arabic performance monitoring
- CI/CD pipelines with Iraqi validation gates
- Network resilience for unstable Iraqi infrastructure
- Baghdad timezone (Asia/Baghdad UTC+3) operations
- Backup and disaster recovery for Iraqi compliance

**Iraqi Infrastructure Considerations:**
1. **Network Instability**:
   - Expect frequent connection drops
   - Implement aggressive caching (CDN, service workers)
   - Use offline-first architecture
   - Set timeouts >= 30s for external services
   - Retry with exponential backoff (max 3 retries)

2. **Payment Gateway Monitoring**:
   - Monitor ZainCash, FastPay, NassWallet uptime
   - Track payment success rate (target: 95%+)
   - Alert on gateway timeouts or failures
   - Implement multi-gateway fallback

3. **Cultural & Arabic Monitoring**:
   - Track cultural appropriateness score (95%+)
   - Monitor Islamic compliance (100%)
   - Arabic RTL accuracy (99%+)
   - Iraqi dialect recognition (85%+)

4. **CI/CD Requirements**:
   - Run cultural validation tests (95%+ pass rate)
   - Run Arabic rendering tests (99%+ RTL accuracy)
   - Lint, typecheck, unit tests (100% pass)
   - Manual approval for production deployments

5. **Deployment Checklist**:
   - Baghdad timezone configured
   - UTF-8 encoding for Arabic
   - Payment gateways configured
   - Cultural validator running
   - Arabic processor active
   - CDN enabled
   - Prayer time awareness
   - Monitoring alerts active

**Output:** Infrastructure health reports, deployment configs, monitoring alerts, CI/CD pipelines."""

    def _register_tools(self, agent: Agent):
        pass

    async def check_infrastructure_health(self) -> InfrastructureHealthReport:
        """Check Iraqi infrastructure health."""
        # Check payment gateways
        payment_status = await self.tools.check_payment_gateway_health()

        # Check cultural compliance
        cultural_alert = await self.tools.monitor_cultural_compliance()

        # Check Arabic processing
        arabic_alert = await self.tools.monitor_arabic_performance()

        # Collect alerts
        alerts = [cultural_alert, arabic_alert]

        # Determine overall health
        critical_alerts = [a for a in alerts if a.severity == "critical"]
        high_alerts = [a for a in alerts if a.severity == "high"]

        if critical_alerts:
            overall_health = "critical"
        elif high_alerts or any(s == "degraded" for s in payment_status.values()):
            overall_health = "degraded"
        else:
            overall_health = "healthy"

        # Generate recommendations
        recommendations = []
        if overall_health != "healthy":
            recommendations.append("Review critical and high severity alerts")
        if any(s == "degraded" for s in payment_status.values()):
            recommendations.append(
                "Check degraded payment gateways - implement fallback"
            )

        return InfrastructureHealthReport(
            overall_health=overall_health,
            payment_gateway_status=payment_status,
            cultural_validation_status=cultural_alert.message,
            arabic_processing_status=arabic_alert.message,
            network_stability="unstable",  # Default for Iraqi infrastructure
            active_alerts=alerts,
            recommendations=recommendations,
        )

    def get_deployment_checklist(self) -> list:
        """Get Iraqi deployment checklist."""
        return self.tools.IRAQI_DEPLOYMENT_CHECKLIST

    def get_cicd_config(self) -> dict:
        """Get CI/CD pipeline configuration."""
        return self.tools.get_iraqi_cicd_pipeline_config()

    def get_monitoring_metrics(self) -> list:
        """Get monitoring metrics for Iraqi infrastructure."""
        return self.tools.get_monitoring_metrics()

    async def create_alert(
        self, category: str, severity: str, message: str
    ) -> MonitoringAlert:
        """Create infrastructure monitoring alert."""
        return await self.tools.create_infrastructure_alert(category, severity, message)


_devops_engineer_instance = None
_devops_engineer_lock = threading.Lock()


def get_devops_engineer() -> IraqiDevOpsEngineer:
    global _devops_engineer_instance
    if _devops_engineer_instance is None:
        with _devops_engineer_lock:
            if _devops_engineer_instance is None:
                _devops_engineer_instance = IraqiDevOpsEngineer()
    return _devops_engineer_instance
