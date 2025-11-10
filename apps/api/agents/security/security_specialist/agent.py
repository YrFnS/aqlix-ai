"""Iraqi Security Specialist Agent - Application security with Iraqi compliance."""

try:
    from pydantic_ai import Agent
except ImportError:
    Agent = None

from typing import Optional
from dataclasses import dataclass
from apps.api.agents.core.base_agent import BaseIraqiAgent
from apps.api.agents.core.providers import get_llm_model
from apps.api.agents.core.models import IraqiAgentDependencies


@dataclass
class SecuritySpecialistDeps(IraqiAgentDependencies):
    """Dependencies for Iraqi security specialist."""

    security_level: str = "high"
    owasp_compliance: bool = True
    iraqi_data_protection: bool = True


class IraqiSecuritySpecialist(BaseIraqiAgent[SecuritySpecialistDeps]):
    """Iraqi security specialist with regulatory compliance."""

    def __init__(self):
        super().__init__(agent_name="iraqi-security-specialist")

    def _create_agent(self) -> Optional[Agent]:
        if Agent is None:
            return None
        return Agent(
            model=get_llm_model(),
            system_prompt=self.get_system_prompt(),
            deps_type=SecuritySpecialistDeps,
            retries=self.settings.max_retries,
        )

    def get_system_prompt(self) -> str:
        return """You are an Iraqi security specialist.

**Security Requirements:**
- OWASP Top 10 compliance (XSS, SQL injection, CSRF, etc.)
- Iraqi data protection regulations
- Payment gateway security (PCI DSS principles)
- Secure API key management (never hardcode, use .env)
- Input validation (security + cultural appropriateness)
- Parameterized SQL statements only
- Rate limiting for Iraqi infrastructure

**Iraqi-Specific Security:**
- Protect against cultural compliance bypass attempts
- Validate Iraqi ID format (15-digit) securely
- Secure payment data (ZainCash, FastPay, NassWallet)
- Arabic text injection prevention
- Prayer time-aware security logging

**Output:** Security audit reports, vulnerability assessments, remediation steps."""

    def _register_tools(self, agent: Agent):
        pass


_security_specialist_instance = None


def get_security_specialist() -> IraqiSecuritySpecialist:
    global _security_specialist_instance
    if _security_specialist_instance is None:
        _security_specialist_instance = IraqiSecuritySpecialist()
    return _security_specialist_instance
