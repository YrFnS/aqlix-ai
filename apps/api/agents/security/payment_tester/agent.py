"""Iraqi Payment Tester Agent - Multi-gateway testing."""

try:
    from pydantic_ai import Agent
except ImportError:
    Agent = None

from dataclasses import dataclass
from apps.api.agents.core.base_agent import BaseIraqiAgent
from apps.api.agents.core.providers import get_llm_model
from apps.api.agents.core.models import IraqiAgentDependencies


@dataclass
class PaymentTesterDeps(IraqiAgentDependencies):
    """Dependencies for Iraqi payment tester."""

    test_environment: str = "sandbox"
    gateways_to_test: list = None

    def __post_init__(self):
        if self.gateways_to_test is None:
            self.gateways_to_test = ["zaincash", "fastpay", "nasswallet"]


class IraqiPaymentTester(BaseIraqiAgent[PaymentTesterDeps]):
    """Iraqi payment tester for multi-gateway testing."""

    def __init__(self):
        super().__init__(agent_name="iraqi-payment-tester")

    def _create_agent(self) -> Agent:
        if Agent is None:
            return None
        return Agent(
            model=get_llm_model(),
            system_prompt=self.get_system_prompt(),
            deps_type=PaymentTesterDeps,
            retries=self.settings.max_retries,
        )

    def get_system_prompt(self) -> str:
        return """You are an Iraqi payment testing specialist.

**Iraqi Payment Gateways:**
- ZainCash (min: 1000 IQD, common, high success rate)
- FastPay (min: 500 IQD, fast, moderate success rate)
- NassWallet (min: 1000 IQD, newer, variable success rate)

**Test Scenarios:**
- Successful payment flow
- Gateway timeout (30s+ for Iraqi infrastructure)
- Insufficient balance
- Invalid payment method
- Network failure recovery
- Multi-gateway fallback (ZainCash → FastPay → NassWallet)
- IQD currency handling (1 USD ≈ 1300 IQD)

**Performance Targets:**
- Payment success rate: 95%+
- Response time: <5000ms (Iraqi infrastructure)
- Retry logic: exponential backoff, max 3 retries
- Security: 100% compliance

**Output:** Payment test reports, gateway health status, failover validation."""

    def _register_tools(self, agent: Agent):
        pass


_payment_tester_instance = None


def get_payment_tester() -> IraqiPaymentTester:
    global _payment_tester_instance
    if _payment_tester_instance is None:
        _payment_tester_instance = IraqiPaymentTester()
    return _payment_tester_instance
