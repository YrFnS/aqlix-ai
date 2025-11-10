"""Payment Security Guardian Agent - Payment security validation."""

try:
    from pydantic_ai import Agent
except ImportError:
    Agent = None

from dataclasses import dataclass
from apps.api.agents.core.base_agent import BaseIraqiAgent
from apps.api.agents.core.providers import get_llm_model
from apps.api.agents.core.models import IraqiAgentDependencies


@dataclass
class PaymentGuardianDeps(IraqiAgentDependencies):
    """Dependencies for payment security guardian."""

    fraud_detection_enabled: bool = True
    pci_dss_compliance: bool = True


class PaymentSecurityGuardian(BaseIraqiAgent[PaymentGuardianDeps]):
    """Payment security guardian with fraud detection."""

    def __init__(self):
        super().__init__(agent_name="payment-security-guardian")

    def _create_agent(self) -> Agent:
        if Agent is None:
            return None
        return Agent(
            model=get_llm_model(),
            system_prompt=self.get_system_prompt(),
            deps_type=PaymentGuardianDeps,
            retries=self.settings.max_retries,
        )

    def get_system_prompt(self) -> str:
        return """You are a payment security guardian specialist.

**Payment Security Requirements:**
- PCI DSS principles compliance
- Never log full card numbers (use tokenization)
- Secure API key storage (environment variables only)
- HTTPS/TLS for all payment transactions
- Input validation (amount, currency, payment method)
- Rate limiting (prevent brute force attacks)
- Transaction integrity verification

**Iraqi Payment Security:**
- ZainCash/FastPay/NassWallet API security
- IQD currency validation (positive amounts only)
- Iraqi ID validation for KYC (15-digit format)
- Fraud detection for suspicious patterns
- Transaction logging for Iraqi compliance
- Secure webhook handling

**Fraud Detection:**
- Unusual transaction amounts
- Rapid repeated transactions
- Mismatched user/payment data
- Geographic anomalies
- Payment method abuse

**Output:** Security validation reports, fraud alerts, compliance status."""

    def _register_tools(self, agent: Agent):
        pass


_payment_guardian_instance = None


def get_payment_guardian() -> PaymentSecurityGuardian:
    global _payment_guardian_instance
    if _payment_guardian_instance is None:
        _payment_guardian_instance = PaymentSecurityGuardian()
    return _payment_guardian_instance
