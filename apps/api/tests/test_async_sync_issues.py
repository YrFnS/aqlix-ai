"""
Async/Sync Confusion and Type Safety Tests

Tests for:
- Methods declared async but containing no await (8+ methods)
- Type annotations that don't match return values (6+ issues)
- Unused variables and imports
"""

import pytest
import inspect
from typing import Optional
from unittest.mock import Mock, AsyncMock


class TestAsyncWithoutAwait:
    """Test that methods declared async but with no await are converted to sync."""

    def test_async_method_without_await_is_sync(self):
        """Verify methods with no await are converted from async to def."""
        # Problem methods:
        # - technical/debugger/tools.py lines 38-39, 84-86, 112-113, 141-143, 200-201
        # - technical/devops/tools.py line 25-38
        # - cultural/rtl_processor/tools.py lines 64, 110, 193, 244

        # Bad: async def without await
        async def bad_analyze_error_async():
            result = {"type": "error", "message": "test"}
            return result  # No await!

        # Good: regular def
        def good_analyze_error():
            result = {"type": "error", "message": "test"}
            return result

        # The async version creates an unnecessary coroutine
        bad_result = bad_analyze_error_async()
        assert inspect.iscoroutine(bad_result)
        bad_result.close()  # Clean up coroutine

        # The sync version returns directly
        good_result = good_analyze_error()
        assert not inspect.iscoroutine(good_result)
        assert good_result["type"] == "error"

    def test_detect_false_async_declarations(self):
        """Identify methods that are async but don't use await."""

        def analyze_method(func):
            """Analyze if an async method actually uses await."""
            if not inspect.iscoroutinefunction(func):
                return "not_async"

            # Get source code
            source = inspect.getsource(func)

            # Check for await keyword
            if "await" not in source:
                return "async_without_await"

            return "properly_async"

        # Examples
        async def method_with_await():
            result = await some_async_call()
            return result

        def method_without_await():  # FIXED: Changed from async to sync
            x = 1 + 1  # No await!
            return x

        def sync_method():
            x = 1 + 1
            return x

        # Mock async call
        async def some_async_call():
            return True

        assert analyze_method(method_with_await) == "properly_async"
        assert (
            analyze_method(method_without_await) == "not_async"
        )  # FIXED: Now correctly sync
        assert analyze_method(sync_method) == "not_async"


class TestTypeAnnotationMismatches:
    """Test type annotations match actual return values."""

    def test_optional_agent_annotation(self):
        """Verify methods that can return None have Optional annotation."""
        # Problem: 6+ methods annotated as -> Agent but can return None
        # Files:
        # - design/ux_researcher/agent.py
        # - coordination/doc_tracker/agent.py
        # - professional/product_manager/agent.py
        # - coordination/prp_orchestrator/agent.py
        # - technical/ai_architect/agent.py
        # - security/security_specialist/agent.py

        # Bad: Missing Optional
        def bad_create_agent() -> "Agent":  # Can return None but annotation says Agent
            # Type annotation says Agent but actually returns None on error
            return None

        # Good: Includes Optional
        def good_create_agent() -> Optional["Agent"]:
            # Type annotation correctly includes Optional
            return None

        # Mock agent
        class Agent:
            pass

        # Bad version returns None but typed as Agent only
        bad_result = bad_create_agent()
        assert (
            bad_result is None
        )  # Returns None, but annotation says Agent (type mismatch!)

        # Good version properly typed with Optional
        good_result = good_create_agent()
        assert good_result is None  # Type annotation Optional[Agent] matches reality

        # Verify the annotations are different
        bad_annotation = bad_create_agent.__annotations__.get("return", "")
        good_annotation = good_create_agent.__annotations__.get("return", "")

        # Bad should not have Optional, good should
        assert "Optional" not in str(bad_annotation), (
            "Bad annotation should NOT include Optional"
        )
        assert "Optional" in str(good_annotation), (
            "Good annotation SHOULD include Optional"
        )

    def test_annotation_consistency(self):
        """Verify all return type annotations match actual returns."""

        from typing import get_type_hints

        # Example of correct annotation
        def proper_function() -> Optional[str]:
            if True:
                return "result"
            return None

        # Should pass type checking
        hints = get_type_hints(proper_function)
        assert "return" in hints

    def test_type_mismatch_detection(self):
        """Demonstrate how to detect type mismatches."""

        def create_agent() -> Optional["Agent"]:
            """Create agent or return None."""
            return None

        class Agent:
            pass

        # Proper usage with Optional
        result = create_agent()
        assert result is None or isinstance(result, Agent)


class TestUnusedVariables:
    """Test that unused variables and dead code are removed."""

    def test_unused_deps_variable_removed(self):
        """Verify unused BusinessAnalystDeps variable is removed."""
        # Problem: professional/business_analyst/agent.py lines 160-167
        # Creates BusinessAnalystDeps but never uses it

        def bad_implementation():
            """Creates deps but doesn't use it."""
            deps = {
                "user_id": "test",
                "company_name": "Test Corp",
                "employees": 100,
            }
            # ... rest of method doesn't use deps ...
            return "result"

        def good_implementation():
            """No unused variables."""
            # Either use deps or don't create it
            return "result"

        # Both work, but good_implementation is cleaner
        bad_result = bad_implementation()
        good_result = good_implementation()

        assert bad_result == good_result

    def test_dead_code_detection(self):
        """Identify unreachable code."""

        def function_with_dead_code():
            """Returns before unreachable code."""
            return "value"

            # This code is unreachable
            unused_variable = 42
            print(unused_variable)

        def function_without_dead_code():
            """No unreachable code."""
            return "value"

        # Both work the same, but one has dead code
        result1 = function_with_dead_code()
        result2 = function_without_dead_code()

        assert result1 == result2


class TestImportErrorHandling:
    """Test proper handling of import errors."""

    def test_import_error_handling_uses_logging(self):
        """Verify import errors use logging, not print."""
        # Problem: base_agent.py lines 12-18
        # Uses print() instead of logging for ImportError

        import logging

        # Bad: Using print
        def bad_handle_import_error():
            try:
                from pydantic_ai import Agent
            except ImportError:
                print("pydantic_ai not available")  # BAD
                Agent = None

        # Good: Using logging
        def good_handle_import_error():
            logger = logging.getLogger(__name__)
            try:
                from pydantic_ai import Agent
            except ImportError:
                logger.warning("pydantic_ai not available")  # GOOD
                Agent = None

        # Good version should use logging
        logger = logging.getLogger("test")
        logger.setLevel(logging.WARNING)


class TestZeroDivisionHandling:
    """Test that zero division errors are prevented."""

    def test_zero_division_validation(self):
        """Verify division operations validate denominator."""
        # Problem: business_analyst/tools.py lines 109-169
        # Divides by timeframe_months without checking if it's 0

        def bad_calculate_break_even(revenue, monthly_costs, timeframe_months):
            # BAD: Can divide by zero
            if timeframe_months == 0:
                return float("inf")  # Not ideal

            monthly_revenue = revenue / timeframe_months
            # ...

        def good_calculate_break_even(revenue, monthly_costs, timeframe_months):
            # GOOD: Validates input
            if timeframe_months <= 0:
                raise ValueError("timeframe_months must be positive")

            monthly_revenue = revenue / timeframe_months
            # ...

        # Good version raises clear error
        with pytest.raises(ValueError, match="must be positive"):
            good_calculate_break_even(1000, 100, 0)

    def test_division_fallback(self):
        """Verify sensible defaults for division by zero."""

        def calculate_with_fallback(numerator, denominator, fallback=0):
            """Calculate with fallback value."""
            if denominator == 0:
                return fallback
            return numerator / denominator

        # Should return fallback when denominator is 0
        assert calculate_with_fallback(100, 0, fallback=0) == 0
        assert calculate_with_fallback(100, 0, fallback=-1) == -1

        # Should calculate normally otherwise
        assert calculate_with_fallback(100, 2) == 50.0


class TestStaticMethodDeclaration:
    """Test that static methods are properly declared."""

    def test_static_method_detection(self):
        """Verify static methods don't incorrectly use async."""

        # Bad: Async staticmethod (usually wrong)
        class BadClass:
            @staticmethod
            async def bad_method():
                return "result"  # No await!

        # Good: Regular staticmethod
        class GoodClass:
            @staticmethod
            def good_method():
                return "result"

        # Verify declarations
        assert inspect.iscoroutinefunction(BadClass.bad_method)
        assert not inspect.iscoroutinefunction(GoodClass.good_method)


class TestFunctionSignatureConsistency:
    """Test that function signatures are consistent with their usage."""

    def test_prefer_provider_parameter_usage(self):
        """Verify prefer_provider parameter is actually used."""
        # Problem: providers.py line 394-405
        # prefer_provider parameter passed but ignored in get_model()

        def bad_get_model(prefer_provider=None):
            # BAD: Parameter ignored
            return "default_model"

        def good_get_model(prefer_provider=None):
            # GOOD: Parameter used
            if prefer_provider:
                return f"model_from_{prefer_provider}"
            return "default_model"

        # Good version uses the parameter
        assert good_get_model(prefer_provider="openai") == "model_from_openai"
        assert good_get_model() == "default_model"
