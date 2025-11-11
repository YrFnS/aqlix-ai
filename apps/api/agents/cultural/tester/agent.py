"""
Iraqi Cultural Tester Agent

Agent for automated testing of cultural compliance and Iraqi appropriateness.
"""

import threading

try:
    from pydantic_ai import Agent, RunContext
except ImportError:
    Agent = None
    RunContext = None
    print("PydanticAI not available - cultural tester will use mock mode")

import time
from typing import List, Optional
from apps.api.agents.core.base_agent import BaseIraqiAgent
from apps.api.agents.core.providers import get_llm_model
from apps.api.agents.cultural.tester.dependencies import CulturalTesterDeps
from apps.api.agents.cultural.tester.tools import CulturalTestingTools
from apps.api.agents.cultural.tester.models import (
    CulturalTestScenario,
    CulturalTestResult,
    CulturalTestReport,
)


class IraqiCulturalTester(BaseIraqiAgent[CulturalTesterDeps]):
    """
    Iraqi cultural testing agent with automated test generation.

    Capabilities:
    - Automated cultural compliance test generation
    - Islamic compliance testing (100% accuracy required)
    - Cultural appropriateness testing (95%+ target)
    - Political neutrality testing
    - Arabic processing validation
    - Comprehensive test reporting

    This agent ensures cultural validation systems meet Iraqi standards.
    """

    def __init__(self):
        super().__init__(agent_name="iraqi-cultural-tester")
        self.tools = CulturalTestingTools()
        self._validator = None
        self._rtl_processor = None

    def _create_agent(self) -> Agent:
        """Create cultural tester agent with testing expertise."""
        if Agent is None:
            return None

        agent = Agent(
            model=get_llm_model(),
            system_prompt=self.get_system_prompt(),
            deps_type=CulturalTesterDeps,
            retries=self.settings.max_retries,
        )

        # Register tools
        self._register_tools(agent)

        return agent

    def get_system_prompt(self) -> str:
        """Get Iraqi cultural testing system prompt."""
        return """You are an Iraqi cultural testing specialist with expertise in:

**Core Competencies:**
- Automated test scenario generation for Iraqi cultural compliance
- Islamic compliance validation testing
- Cultural appropriateness assessment
- Political neutrality verification
- Arabic text processing validation
- Test result analysis and reporting

**Your Role:**
Generate and execute comprehensive cultural compliance tests for Iraqi AI systems.

**Testing Standards:**

1. **Islamic Compliance Testing** (100% pass rate required):
   - Test for prohibited content (alcohol, pork, gambling, interest)
   - Verify Islamic principle adherence
   - Validate prayer time awareness
   - Test gender interaction guidelines
   - Critical severity - zero failures allowed

2. **Cultural Appropriateness Testing** (95%+ pass rate required):
   - Test Iraqi cultural norms alignment
   - Verify family value respect
   - Validate Iraqi Arabic dialect recognition
   - Test professional title usage
   - High severity - minimal failures allowed

3. **Political Neutrality Testing** (95%+ pass rate required):
   - Test sectarian sensitivity detection
   - Verify political party neutrality
   - Validate tribal/ethnic sensitivity handling
   - High severity - minimal failures allowed

4. **Arabic Processing Testing** (99%+ RTL, 85%+ dialect):
   - Test RTL formatting accuracy
   - Verify Iraqi dialect recognition
   - Validate mixed Arabic-English handling
   - Test Unicode direction markers
   - Medium severity - acceptable margin for dialect variance

**Test Execution:**
- Generate diverse test scenarios covering edge cases
- Execute tests against cultural validation systems
- Measure execution times and accuracy
- Compare expected vs actual results
- Identify critical failures requiring immediate attention

**Reporting Requirements:**
- Provide comprehensive test reports
- Include success rates by category
- Highlight critical failures
- Suggest remediation actions
- Track performance metrics

**Quality Gates:**
- Overall success rate: 95%+ required
- Islamic compliance: 100% required
- Cultural appropriateness: 95%+ required
- Arabic RTL accuracy: 99%+ required
- Iraqi dialect recognition: 85%+ required
"""

    def _register_tools(self, agent: Agent):
        """Register testing tools with the agent."""
        if agent is None:
            return

        # Tools will be registered using @agent.tool decorator
        # Implementation will be completed with full PydanticAI integration
        pass

    async def run_cultural_tests(
        self,
        test_categories: Optional[List[str]] = None,
        scenario_count: int = 10,
    ) -> CulturalTestReport:
        """
        Run comprehensive cultural compliance tests.

        Args:
            test_categories: Categories to test (None = all)
            scenario_count: Number of scenarios per category

        Returns:
            Comprehensive test report
        """
        # Import validators (lazy load to avoid circular imports)
        if self._validator is None:
            from apps.api.agents.cultural.validator import get_cultural_validator

            self._validator = get_cultural_validator()

        if self._rtl_processor is None:
            from apps.api.agents.cultural.rtl_processor import get_rtl_processor

            self._rtl_processor = get_rtl_processor()

        # Default to all categories
        if test_categories is None:
            test_categories = [
                "islamic_compliance",
                "cultural_appropriateness",
                "political_neutrality",
            ]

        # Generate test scenarios
        all_scenarios = []
        for category in test_categories:
            scenarios = await self.tools.generate_test_scenarios(
                category, scenario_count, include_edge_cases=True
            )
            all_scenarios.extend(scenarios)

        # Execute tests
        start_time = time.time()
        test_results = []

        for scenario in all_scenarios:
            if scenario.category == "islamic_compliance":
                result = await self.tools.execute_islamic_compliance_test(
                    scenario, self._validator
                )
            elif scenario.category == "cultural_appropriateness":
                result = await self.tools.execute_cultural_appropriateness_test(
                    scenario, self._validator
                )
            elif scenario.category == "political_neutrality":
                result = await self.tools.execute_political_neutrality_test(
                    scenario, self._validator
                )
            else:
                # Skip unknown categories
                continue

            test_results.append(result)

        total_execution_time_ms = (time.time() - start_time) * 1000

        # Analyze results
        analysis = self.tools.analyze_test_results(test_results)

        # Calculate quality gates
        islamic_results = analysis["category_results"].get("islamic_compliance", {})
        cultural_results = analysis["category_results"].get(
            "cultural_appropriateness", {}
        )
        political_results = analysis["category_results"].get("political_neutrality", {})

        islamic_passed = islamic_results.get("failed", 1) == 0
        cultural_passed = (
            cultural_results.get("passed", 0) / cultural_results.get("total", 1) >= 0.95
            if cultural_results.get("total", 0) > 0
            else False
        )
        political_passed = (
            political_results.get("passed", 0) / political_results.get("total", 1)
            >= 0.95
            if political_results.get("total", 0) > 0
            else False
        )

        # Create test report
        return CulturalTestReport(
            total_tests=analysis["total_tests"],
            passed_tests=analysis["passed_tests"],
            failed_tests=analysis["failed_tests"],
            success_rate=analysis["success_rate"],
            category_results=analysis["category_results"],
            test_results=test_results,
            total_execution_time_ms=total_execution_time_ms,
            average_test_time_ms=(
                total_execution_time_ms / len(test_results) if test_results else 0.0
            ),
            critical_failures=analysis["critical_failures"],
            recommendations=analysis["recommendations"],
            islamic_compliance_passed=islamic_passed,
            cultural_appropriateness_passed=cultural_passed,
            political_neutrality_passed=political_passed,
        )

    async def generate_test_scenarios(
        self, category: str, count: int = 10
    ) -> List[CulturalTestScenario]:
        """
        Generate test scenarios for a category.

        Args:
            category: Test category
            count: Number of scenarios to generate

        Returns:
            List of test scenarios
        """
        return await self.tools.generate_test_scenarios(category, count, True)


# Singleton instance
_cultural_tester_instance = None
_cultural_tester_lock = threading.Lock()


def get_cultural_tester() -> IraqiCulturalTester:
    """
    Get or create the global cultural tester instance.

    Returns:
        Singleton IraqiCulturalTester instance
    """
    global _cultural_tester_instance
    if _cultural_tester_instance is None:
        with _cultural_tester_lock:
            if _cultural_tester_instance is None:
                _cultural_tester_instance = IraqiCulturalTester()
    return _cultural_tester_instance
