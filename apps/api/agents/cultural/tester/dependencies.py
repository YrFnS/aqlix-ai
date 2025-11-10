"""
Iraqi Cultural Tester Dependencies

Dependencies for the Iraqi cultural testing agent.
"""

from dataclasses import dataclass
from typing import Literal, Optional, List
from apps.api.agents.core.models import IraqiAgentDependencies


@dataclass
class CulturalTesterDeps(IraqiAgentDependencies):
    """
    Dependencies for Iraqi cultural testing agent.

    Extends base Iraqi agent dependencies with tester-specific configuration.
    """

    # Test Configuration
    test_strictness: Literal["strict", "moderate", "flexible"] = "strict"
    test_scope: Literal["full", "quick", "custom"] = "full"

    # Test Categories
    test_islamic_compliance: bool = True
    test_cultural_appropriateness: bool = True
    test_political_neutrality: bool = True
    test_professional_context: bool = True
    test_arabic_processing: bool = True

    # Test Data Generation
    generate_test_scenarios: bool = True
    scenario_count: int = 10  # Number of test scenarios per category
    include_edge_cases: bool = True

    # Test Execution
    parallel_execution: bool = True
    timeout_per_test_ms: int = 1000

    # Reporting
    detailed_reporting: bool = True
    include_test_data: bool = False  # Include test inputs/outputs in report
    failure_analysis: bool = True

    # Integration
    validator_integration: bool = True  # Use cultural-validator for validation
    rtl_processor_integration: bool = True  # Use rtl-processor for Arabic tests
