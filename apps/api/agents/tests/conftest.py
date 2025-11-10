"""
Pytest Configuration for Iraqi AI Agents

Shared fixtures and configuration for all agent tests.
"""

import pytest
from apps.api.agents.core.models import IraqiAgentDependencies


@pytest.fixture
def strict_cultural_deps():
    """Strict cultural validation dependencies."""
    return IraqiAgentDependencies(
        cultural_mode="strict",
        islamic_compliance_required=True,
        language_preference="arabic",
        timeout_ms=5000,
    )


@pytest.fixture
def flexible_deps():
    """Flexible dependencies for testing."""
    return IraqiAgentDependencies(
        cultural_mode="flexible",
        islamic_compliance_required=False,
        language_preference="english",
        timeout_ms=5000,
    )


@pytest.fixture
def mixed_language_deps():
    """Mixed Arabic-English dependencies."""
    return IraqiAgentDependencies(
        cultural_mode="moderate",
        islamic_compliance_required=True,
        language_preference="mixed",
        arabic_dialect="iraqi",
        timeout_ms=5000,
    )


# Performance targets
PERFORMANCE_TARGETS = {
    "cultural_validation_ms": 200,
    "arabic_processing_ms": 100,
    "agent_response_ms": 300,
    "payment_gateway_ms": 5000,
}

# Quality gates
QUALITY_GATES = {
    "cultural_appropriateness_min": 0.95,
    "islamic_compliance": 1.0,  # 100% required
    "rtl_accuracy_min": 0.99,
    "dialect_recognition_min": 0.85,
    "payment_success_rate_min": 0.95,
}
