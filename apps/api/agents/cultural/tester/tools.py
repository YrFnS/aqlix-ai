"""
Cultural Tester Tools

Tool functions for generating and executing cultural compliance tests.
"""

from typing import List, Dict, Any, Optional
import time
from .models import CulturalTestScenario, CulturalTestResult


class CulturalTestingTools:
    """Tools for cultural compliance testing."""

    # Test scenario templates
    ISLAMIC_COMPLIANCE_SCENARIOS = [
        {
            "test_input": "Check out our new alcohol delivery service!",
            "expected_compliant": False,
            "description": "Detect alcohol reference (prohibited)",
        },
        {
            "test_input": "Our halal restaurant serves authentic Iraqi cuisine",
            "expected_compliant": True,
            "description": "Halal food reference (compliant)",
        },
        {
            "test_input": "Win big at our casino tonight!",
            "expected_compliant": False,
            "description": "Gambling reference (prohibited)",
        },
        {
            "test_input": "Prayer times for Baghdad: Fajr 5:30 AM, Dhuhr 12:15 PM",
            "expected_compliant": True,
            "description": "Prayer time information (compliant)",
        },
    ]

    CULTURAL_APPROPRIATENESS_SCENARIOS = [
        {
            "test_input": "استشارة قانونية مع المحامي أحمد",
            "expected_score": 0.95,
            "description": "Professional Arabic title usage",
        },
        {
            "test_input": "Family gatherings are important in Iraqi culture",
            "expected_score": 0.95,
            "description": "Family values acknowledgment",
        },
        {
            "test_input": "شلونك؟ شكو ماكو اليوم؟",
            "expected_score": 0.95,
            "description": "Iraqi dialect greeting",
        },
    ]

    POLITICAL_NEUTRALITY_SCENARIOS = [
        {
            "test_input": "We support all Iraqi citizens regardless of background",
            "expected_sensitive": False,
            "description": "Inclusive neutral statement",
        },
        {
            "test_input": "Our party is the best choice for Iraq",
            "expected_sensitive": True,
            "description": "Political party reference (sensitive)",
        },
    ]

    @staticmethod
    async def generate_test_scenarios(
        category: str, count: int = 10, include_edge_cases: bool = True
    ) -> List[CulturalTestScenario]:
        """
        Generate cultural test scenarios for a category.

        Args:
            category: Test category (islamic_compliance, cultural_appropriateness, etc.)
            count: Number of scenarios to generate
            include_edge_cases: Whether to include edge case scenarios

        Returns:
            List of generated test scenarios
        """
        # FIX #6: Validate category and ensure sufficient scenarios
        valid_categories = {
            "islamic_compliance": CulturalTestingTools.ISLAMIC_COMPLIANCE_SCENARIOS,
            "cultural_appropriateness": CulturalTestingTools.CULTURAL_APPROPRIATENESS_SCENARIOS,
            "political_neutrality": CulturalTestingTools.POLITICAL_NEUTRALITY_SCENARIOS,
        }

        if category not in valid_categories:
            raise ValueError(
                f"Invalid category '{category}'. Must be one of: {list(valid_categories.keys())}"
            )

        templates = valid_categories[category]

        # Ensure we have enough templates for requested count
        if len(templates) < count:
            raise ValueError(
                f"Cannot generate {count} scenarios for '{category}'. "
                f"Only {len(templates)} templates available. "
                f"Reduce count or add more templates."
            )

        scenarios = []

        if category == "islamic_compliance":
            for i, template in enumerate(templates[:count]):
                scenarios.append(
                    CulturalTestScenario(
                        scenario_id=f"islamic_{i + 1}",
                        category="islamic_compliance",
                        test_input=template["test_input"],
                        expected_result={
                            "compliant": template["expected_compliant"],
                            "violations": [],
                        },
                        severity="critical",
                        description=template["description"],
                    )
                )

        elif category == "cultural_appropriateness":
            for i, template in enumerate(templates[:count]):
                scenarios.append(
                    CulturalTestScenario(
                        scenario_id=f"cultural_{i + 1}",
                        category="cultural_appropriateness",
                        test_input=template["test_input"],
                        expected_result={
                            "cultural_appropriateness_score": template["expected_score"]
                        },
                        severity="high",
                        description=template["description"],
                    )
                )

        elif category == "political_neutrality":
            for i, template in enumerate(templates[:count]):
                scenarios.append(
                    CulturalTestScenario(
                        scenario_id=f"political_{i + 1}",
                        category="political_neutrality",
                        test_input=template["test_input"],
                        expected_result={
                            "is_sensitive": template["expected_sensitive"]
                        },
                        severity="high",
                        description=template["description"],
                    )
                )

        # Add edge cases if requested (FIX #6: Actually implement edge_cases)
        if include_edge_cases:
            # Add edge case scenarios for more comprehensive testing
            edge_case_scenarios = CulturalTestingTools._generate_edge_cases(category)
            scenarios.extend(edge_case_scenarios)

        return scenarios

    @staticmethod
    def _generate_edge_cases(category: str) -> List[CulturalTestScenario]:
        """
        Generate edge case scenarios for comprehensive testing.

        Args:
            category: Test category

        Returns:
            List of edge case scenarios
        """
        edge_cases = []

        if category == "islamic_compliance":
            edge_cases.append(
                CulturalTestScenario(
                    scenario_id="islamic_edge_1",
                    category="islamic_compliance",
                    test_input="Our business operates 24/7 including during prayer times",
                    expected_result={"compliant": True, "violations": []},
                    severity="medium",
                    description="Edge case: 24/7 operations (compliant if respectful)",
                )
            )

        elif category == "cultural_appropriateness":
            edge_cases.append(
                CulturalTestScenario(
                    scenario_id="cultural_edge_1",
                    category="cultural_appropriateness",
                    test_input="Mixed Arabic-English content: التواصل معنا for contact",
                    expected_result={"cultural_appropriateness_score": 0.90},
                    severity="medium",
                    description="Edge case: Mixed language content",
                )
            )

        elif category == "political_neutrality":
            edge_cases.append(
                CulturalTestScenario(
                    scenario_id="political_edge_1",
                    category="political_neutrality",
                    test_input="We serve all Iraqi regions: Baghdad, Basra, Erbil, Mosul",
                    expected_result={"is_sensitive": False},
                    severity="low",
                    description="Edge case: Regional references (neutral)",
                )
            )

        return edge_cases

    @staticmethod
    async def execute_islamic_compliance_test(
        scenario: CulturalTestScenario, validator
    ) -> CulturalTestResult:
        """
        Execute Islamic compliance test.

        Args:
            scenario: Test scenario
            validator: CulturalValidator instance

        Returns:
            Test result
        """
        start_time = time.time()

        try:
            # Execute validation
            result = await validator.tools.validate_islamic_compliance(
                scenario.test_input
            )

            execution_time_ms = (time.time() - start_time) * 1000

            # Compare with expected result
            expected_compliant = scenario.expected_result.get("compliant", True)
            actual_compliant = result.get("compliant", False)
            passed = expected_compliant == actual_compliant

            discrepancies = []
            if not passed:
                discrepancies.append(
                    f"Expected compliant={expected_compliant}, got {actual_compliant}"
                )

            return CulturalTestResult(
                scenario_id=scenario.scenario_id,
                category=scenario.category,
                passed=passed,
                execution_time_ms=execution_time_ms,
                actual_result=result,
                expected_result=scenario.expected_result,
                discrepancies=discrepancies,
            )

        except Exception as e:
            execution_time_ms = (time.time() - start_time) * 1000
            return CulturalTestResult(
                scenario_id=scenario.scenario_id,
                category=scenario.category,
                passed=False,
                execution_time_ms=execution_time_ms,
                actual_result={},
                expected_result=scenario.expected_result,
                discrepancies=[],
                error_message=str(e),
            )

    @staticmethod
    async def execute_cultural_appropriateness_test(
        scenario: CulturalTestScenario, validator
    ) -> CulturalTestResult:
        """
        Execute cultural appropriateness test.

        Args:
            scenario: Test scenario
            validator: CulturalValidator instance

        Returns:
            Test result
        """
        start_time = time.time()

        try:
            # Execute validation
            score = await validator.tools.score_cultural_appropriateness(
                scenario.test_input, "general"
            )

            execution_time_ms = (time.time() - start_time) * 1000

            # Compare with expected result
            expected_score = scenario.expected_result.get(
                "cultural_appropriateness_score", 0.95
            )
            # Allow 5% tolerance
            passed = abs(score - expected_score) <= 0.05

            discrepancies = []
            if not passed:
                discrepancies.append(
                    f"Expected score ~{expected_score}, got {score} (diff: {abs(score - expected_score):.2f})"
                )

            return CulturalTestResult(
                scenario_id=scenario.scenario_id,
                category=scenario.category,
                passed=passed,
                execution_time_ms=execution_time_ms,
                actual_result={"cultural_appropriateness_score": score},
                expected_result=scenario.expected_result,
                discrepancies=discrepancies,
            )

        except Exception as e:
            execution_time_ms = (time.time() - start_time) * 1000
            return CulturalTestResult(
                scenario_id=scenario.scenario_id,
                category=scenario.category,
                passed=False,
                execution_time_ms=execution_time_ms,
                actual_result={},
                expected_result=scenario.expected_result,
                discrepancies=[],
                error_message=str(e),
            )

    @staticmethod
    async def execute_political_neutrality_test(
        scenario: CulturalTestScenario, validator
    ) -> CulturalTestResult:
        """
        Execute political neutrality test.

        Args:
            scenario: Test scenario
            validator: CulturalValidator instance

        Returns:
            Test result
        """
        start_time = time.time()

        try:
            # Execute validation
            result = await validator.tools.detect_political_sensitivity(
                scenario.test_input
            )

            execution_time_ms = (time.time() - start_time) * 1000

            # Compare with expected result
            expected_sensitive = scenario.expected_result.get("is_sensitive", False)
            actual_sensitive = result.get("is_sensitive", False)
            passed = expected_sensitive == actual_sensitive

            discrepancies = []
            if not passed:
                discrepancies.append(
                    f"Expected is_sensitive={expected_sensitive}, got {actual_sensitive}"
                )

            return CulturalTestResult(
                scenario_id=scenario.scenario_id,
                category=scenario.category,
                passed=passed,
                execution_time_ms=execution_time_ms,
                actual_result=result,
                expected_result=scenario.expected_result,
                discrepancies=discrepancies,
            )

        except Exception as e:
            execution_time_ms = (time.time() - start_time) * 1000
            return CulturalTestResult(
                scenario_id=scenario.scenario_id,
                category=scenario.category,
                passed=False,
                execution_time_ms=execution_time_ms,
                actual_result={},
                expected_result=scenario.expected_result,
                discrepancies=[],
                error_message=str(e),
            )

    @staticmethod
    def analyze_test_results(
        results: List[CulturalTestResult],
    ) -> Dict[str, Any]:
        """
        Analyze test results and generate insights.

        Args:
            results: List of test results

        Returns:
            Analysis dictionary with insights and recommendations
        """
        # Calculate metrics
        total_tests = len(results)
        passed_tests = sum(1 for r in results if r.passed)
        failed_tests = total_tests - passed_tests
        success_rate = passed_tests / total_tests if total_tests > 0 else 0.0

        # Category breakdown
        category_results = {}
        for result in results:
            category = result.category
            if category not in category_results:
                category_results[category] = {
                    "total": 0,
                    "passed": 0,
                    "failed": 0,
                    "avg_time_ms": 0.0,
                }

            category_results[category]["total"] += 1
            if result.passed:
                category_results[category]["passed"] += 1
            else:
                category_results[category]["failed"] += 1

        # Calculate average times
        for category in category_results:
            category_tests = [r for r in results if r.category == category]
            avg_time = (
                sum(r.execution_time_ms for r in category_tests) / len(category_tests)
                if category_tests
                else 0.0
            )
            category_results[category]["avg_time_ms"] = avg_time

        # Identify critical failures
        critical_failures = [
            f"{r.scenario_id}: {r.error_message or 'Test failed'}"
            for r in results
            if not r.passed and r.category == "islamic_compliance"
        ]

        # Generate recommendations
        recommendations = []
        if success_rate < 0.95:
            recommendations.append(
                f"Overall success rate ({success_rate:.1%}) is below 95% target"
            )

        islamic_results = category_results.get("islamic_compliance", {})
        if islamic_results.get("failed", 0) > 0:
            recommendations.append(
                f"Islamic compliance tests failing: {islamic_results['failed']} failures - CRITICAL"
            )

        return {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": failed_tests,
            "success_rate": success_rate,
            "category_results": category_results,
            "critical_failures": critical_failures,
            "recommendations": recommendations,
        }
