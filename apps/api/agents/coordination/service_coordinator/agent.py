"""External Service Coordinator Agent - Service health monitoring."""

import threading

try:
    from pydantic_ai import Agent
except ImportError:
    Agent = None

from dataclasses import dataclass
from apps.api.agents.core.base_agent import BaseIraqiAgent
from apps.api.agents.core.providers import get_llm_model
from apps.api.agents.core.models import IraqiAgentDependencies


@dataclass
class ServiceCoordinatorDeps(IraqiAgentDependencies):
    """Dependencies for external service coordinator."""

    monitor_payment_gateways: bool = True
    monitor_cultural_services: bool = True
    health_check_interval_seconds: int = 60


class ExternalServiceCoordinator(BaseIraqiAgent[ServiceCoordinatorDeps]):
    """External service coordinator for health monitoring."""

    def __init__(self):
        super().__init__(agent_name="external-service-coordinator")

    def _create_agent(self) -> Agent:
        if Agent is None:
            return None
        return Agent(
            model=get_llm_model(),
            system_prompt=self.get_system_prompt(),
            deps_type=ServiceCoordinatorDeps,
            retries=self.settings.max_retries,
        )

    def get_system_prompt(self) -> str:
        return """You are an external service coordinator specialist.

**Service Monitoring:**
- Payment gateways (ZainCash, FastPay, NassWallet)
- Cultural validation service
- Arabic RTL processing service
- Iraqi infrastructure services
- Database connectivity (Supabase)

**Health Checks:**
- Gateway availability (ping every 60s)
- Response time monitoring (<5000ms for payments)
- Success rate tracking (95%+ target)
- Failover triggering (auto-switch to backup gateway)
- Alert generation for degraded services

**Service Coordination:**
- Intelligent routing to healthy services
- Load balancing across gateways
- Retry with exponential backoff
- Circuit breaker pattern implementation
- Graceful degradation strategies

**Output:** Service health reports, routing decisions, failover triggers, performance metrics."""

    def _register_tools(self, agent: Agent):
        pass


_service_coordinator_instance = None
_service_coordinator_lock = threading.Lock()


def get_service_coordinator() -> ExternalServiceCoordinator:
    global _service_coordinator_instance
    if _service_coordinator_instance is None:
        with _service_coordinator_lock:
            if _service_coordinator_instance is None:
                _service_coordinator_instance = ExternalServiceCoordinator()
    return _service_coordinator_instance
