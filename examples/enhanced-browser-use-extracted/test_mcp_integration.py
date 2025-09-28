#!/usr/bin/env python3
"""
Iraqi Enhanced MCP Server Integration Tests

This script tests the MCP server integration with Iraqi AI agents and cultural validation.

Test Categories:
1. MCP server startup and tool discovery
2. Iraqi-specific tools (iraqi_portal_navigate, arabic_form_fill, cultural_validate)
3. Enhanced browser tools with cultural validation
4. Iraqi agent bridge layer functionality
5. Cultural validation pipeline
6. Arabic RTL text processing
7. Professional domain validation
8. Claude Desktop integration compatibility

Usage:
    python test_mcp_integration.py
    python test_mcp_integration.py --verbose
    python test_mcp_integration.py --category cultural
"""

import asyncio
import json
import logging
import os
import sys
import time
from pathlib import Path
from typing import Any, Dict, List, Optional

# Add project root to path
project_root = Path(__file__).parent.parent.parent.parent
sys.path.insert(0, str(project_root))

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Test configuration
TEST_CONFIG = {
    "timeout_seconds": 30,
    "iraqi_test_urls": [
        "https://www.gov.iq",
        "https://www.cbi.iq",
        "https://www.mohesr.gov.iq",
    ],
    "arabic_test_texts": [
        "مرحبا، كيف حالك اليوم؟",  # Hello, how are you today?
        "شلونك؟ شكو ماكو؟",  # Iraqi dialect greeting
        "أهلا وسهلا بك في العراق",  # Welcome to Iraq
    ],
    "cultural_test_content": [
        "Iraqi government services are available online",
        "Islamic banking principles guide financial services",
        "Educational reforms support Iraqi students",
    ],
    "professional_domains": ["legal", "medical", "educational", "banking"],
}


class MCPTestResult:
    """Test result container."""

    def __init__(self, name: str):
        self.name = name
        self.success = False
        self.duration_ms = 0
        self.error_message = None
        self.details = {}
        self.start_time = time.time()

    def complete(self, success: bool, error_message: str = None, **details):
        """Mark test as complete."""
        self.success = success
        self.duration_ms = int((time.time() - self.start_time) * 1000)
        self.error_message = error_message
        self.details.update(details)

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for reporting."""
        return {
            "name": self.name,
            "success": self.success,
            "duration_ms": self.duration_ms,
            "error_message": self.error_message,
            "details": self.details,
        }


class IraqiMCPTester:
    """Comprehensive tester for Iraqi Enhanced MCP Server."""

    def __init__(self, verbose: bool = False):
        self.verbose = verbose
        self.results: List[MCPTestResult] = []

        # Mock MCP client (in real implementation, would use actual MCP client)
        self.mcp_client = None

    async def run_all_tests(self, category: Optional[str] = None) -> Dict[str, Any]:
        """Run all tests or tests in specific category."""

        logger.info("Starting Iraqi Enhanced MCP Server integration tests...")

        test_categories = {
            "startup": self._test_server_startup,
            "tools": self._test_tool_discovery,
            "iraqi_tools": self._test_iraqi_specific_tools,
            "cultural": self._test_cultural_validation,
            "arabic": self._test_arabic_processing,
            "professional": self._test_professional_domains,
            "browser": self._test_enhanced_browser_tools,
            "integration": self._test_claude_desktop_integration,
        }

        # Run specific category or all categories
        categories_to_run = [category] if category else list(test_categories.keys())

        for cat in categories_to_run:
            if cat in test_categories:
                logger.info(f"\n=== Testing {cat.upper()} ===")
                await test_categories[cat]()
            else:
                logger.warning(f"Unknown test category: {cat}")

        return self._generate_report()

    async def _test_server_startup(self):
        """Test MCP server startup and basic functionality."""

        result = MCPTestResult("server_startup")

        try:
            # Test server import
            from examples.enhanced_browser_use_extracted.mcp.server import (
                IraqiEnhancedMcpServer,
            )

            # Create server instance
            server = IraqiEnhancedMcpServer()

            # Test basic initialization
            assert hasattr(server, "server")
            assert hasattr(server, "cultural_validator")
            assert hasattr(server, "arabic_processor")

            result.complete(
                success=True, server_initialized=True, components_loaded=True
            )

        except Exception as e:
            result.complete(success=False, error_message=str(e))

        self.results.append(result)

    async def _test_tool_discovery(self):
        """Test MCP tool discovery and registration."""

        result = MCPTestResult("tool_discovery")

        try:
            from examples.enhanced_browser_use_extracted.mcp.server import (
                IraqiEnhancedMcpServer,
            )

            server = IraqiEnhancedMcpServer()

            # Get handler function
            list_tools_handler = None
            for handler in server.server._request_handlers.get("tools/list", []):
                list_tools_handler = handler
                break

            if list_tools_handler:
                # Simulate tool listing
                tools = await list_tools_handler()

                # Verify expected tools are present
                expected_tools = [
                    "iraqi_portal_navigate",
                    "arabic_form_fill",
                    "cultural_validate",
                    "browser_navigate",
                    "browser_click",
                    "browser_type",
                    "browser_get_state",
                    "iraqi_agent_task",
                    "get_cultural_state",
                ]

                tool_names = [tool.name for tool in tools]
                missing_tools = [
                    name for name in expected_tools if name not in tool_names
                ]

                result.complete(
                    success=len(missing_tools) == 0,
                    error_message=f"Missing tools: {missing_tools}"
                    if missing_tools
                    else None,
                    total_tools=len(tools),
                    expected_tools=len(expected_tools),
                    missing_tools=missing_tools,
                    discovered_tools=tool_names,
                )
            else:
                result.complete(
                    success=False, error_message="No tool list handler found"
                )

        except Exception as e:
            result.complete(success=False, error_message=str(e))

        self.results.append(result)

    async def _test_iraqi_specific_tools(self):
        """Test Iraqi-specific MCP tools."""

        # Test iraqi_portal_navigate
        result = MCPTestResult("iraqi_portal_navigate")

        try:
            from examples.enhanced_browser_use_extracted.mcp.server import (
                IraqiEnhancedMcpServer,
            )

            server = IraqiEnhancedMcpServer()

            # Test portal navigation
            navigation_result = await server._iraqi_portal_navigate(
                url="https://www.gov.iq",
                portal_type="government",
                validate_cultural=True,
            )

            # Should return JSON with cultural validation
            result_data = json.loads(navigation_result)

            result.complete(
                success="cultural_validation" in result_data,
                portal_type="government",
                has_cultural_validation=True,
                result_keys=list(result_data.keys()),
            )

        except Exception as e:
            result.complete(success=False, error_message=str(e))

        self.results.append(result)

        # Test arabic_form_fill
        result = MCPTestResult("arabic_form_fill")

        try:
            server = IraqiEnhancedMcpServer()

            # Test Arabic form filling
            form_data = {
                "name": "احمد محمد",  # Ahmed Mohammed in Arabic
                "email": "ahmed@example.com",
                "message": "مرحبا، كيف حالك؟",  # Hello, how are you?
            }

            fill_result = await server._arabic_form_fill(
                form_data=form_data, validate_islamic=True, preserve_dialect=True
            )

            result.complete(
                success="✅" in fill_result or "Arabic RTL" in fill_result,
                form_fields=len(form_data),
                arabic_processing=True,
            )

        except Exception as e:
            result.complete(success=False, error_message=str(e))

        self.results.append(result)

        # Test cultural_validate
        result = MCPTestResult("cultural_validate")

        try:
            server = IraqiEnhancedMcpServer()

            # Test cultural validation
            validation_result = await server._cultural_validate(
                content="Iraqi government services support citizens",
                validation_type="cultural",
                domain="government",
            )

            validation_data = json.loads(validation_result)

            result.complete(
                success=validation_data.get("cultural_score", 0) > 0.8,
                cultural_score=validation_data.get("cultural_score", 0),
                islamic_score=validation_data.get("islamic_score", 0),
                is_compliant=validation_data.get("is_compliant", False),
            )

        except Exception as e:
            result.complete(success=False, error_message=str(e))

        self.results.append(result)

    async def _test_cultural_validation(self):
        """Test cultural validation pipeline."""

        for i, content in enumerate(TEST_CONFIG["cultural_test_content"]):
            result = MCPTestResult(f"cultural_validation_{i + 1}")

            try:
                from examples.enhanced_browser_use_extracted.mcp.iraqi_bridge import (
                    iraqi_bridge,
                )

                # Test cultural validation pipeline
                pipeline = await iraqi_bridge.validate_cultural_pipeline(
                    content=content, domain="general"
                )

                result.complete(
                    success=pipeline.overall_score > 0.8,
                    overall_score=pipeline.overall_score,
                    is_compliant=pipeline.is_compliant,
                    validation_types=pipeline.validation_types,
                    content_preview=content[:50] + "..."
                    if len(content) > 50
                    else content,
                )

            except Exception as e:
                result.complete(success=False, error_message=str(e))

            self.results.append(result)

    async def _test_arabic_processing(self):
        """Test Arabic RTL text processing."""

        for i, text in enumerate(TEST_CONFIG["arabic_test_texts"]):
            result = MCPTestResult(f"arabic_processing_{i + 1}")

            try:
                from examples.enhanced_browser_use_extracted.mcp.iraqi_bridge import (
                    iraqi_bridge,
                )

                # Test Arabic processing
                processed = await iraqi_bridge.process_arabic_content(
                    text=text, preserve_dialect=True
                )

                result.complete(
                    success="processed_text" in processed,
                    is_rtl=processed.get("is_rtl", False),
                    dialect=processed.get("dialect", "unknown"),
                    confidence=processed.get("confidence", 0),
                    text_preview=text[:30] + "..." if len(text) > 30 else text,
                )

            except Exception as e:
                result.complete(success=False, error_message=str(e))

            self.results.append(result)

    async def _test_professional_domains(self):
        """Test professional domain validation."""

        for domain in TEST_CONFIG["professional_domains"]:
            result = MCPTestResult(f"professional_domain_{domain}")

            try:
                from examples.enhanced_browser_use_extracted.mcp.iraqi_bridge import (
                    iraqi_bridge,
                )

                # Test professional domain validation
                domain_result = await iraqi_bridge.validate_professional_domain(
                    content=f"Professional {domain} services in Iraq", domain=domain
                )

                result.complete(
                    success=domain_result.get("domain_validation", False),
                    domain=domain,
                    compliance_score=domain_result.get("compliance_score", 0),
                    professional_standards=domain_result.get(
                        "professional_standards", "unknown"
                    ),
                )

            except Exception as e:
                result.complete(success=False, error_message=str(e))

            self.results.append(result)

    async def _test_enhanced_browser_tools(self):
        """Test enhanced browser automation tools."""

        result = MCPTestResult("enhanced_browser_tools")

        try:
            from examples.enhanced_browser_use_extracted.mcp.server import (
                IraqiEnhancedMcpServer,
            )

            server = IraqiEnhancedMcpServer()

            # Test enhanced navigation
            nav_result = await server._enhanced_navigate(
                url="https://www.gov.iq", validate_cultural=True
            )

            # Test enhanced typing with Arabic
            type_result = await server._enhanced_type(
                index=1,
                text="مرحبا",  # Hello in Arabic
                is_arabic=True,
                validate_content=True,
            )

            # Test enhanced state extraction
            state_result = await server._enhanced_get_state(
                extract_arabic=True, cultural_analysis=True
            )

            result.complete(
                success=all(
                    [
                        "cultural validation" in nav_result.lower(),
                        "arabic" in type_result.lower(),
                        "cultural_analysis" in state_result,
                    ]
                ),
                navigation_test=True,
                typing_test=True,
                state_test=True,
            )

        except Exception as e:
            result.complete(success=False, error_message=str(e))

        self.results.append(result)

    async def _test_claude_desktop_integration(self):
        """Test Claude Desktop MCP integration compatibility."""

        result = MCPTestResult("claude_desktop_integration")

        try:
            # Test configuration file exists and is valid
            config_path = Path(__file__).parent / "claude_desktop_config.json"

            if config_path.exists():
                with open(config_path) as f:
                    config = json.load(f)

                # Verify required config structure
                required_keys = ["mcpServers"]
                server_configs = config.get("mcpServers", {})

                iraqi_server_config = server_configs.get("iraqi-browser-use", {})

                result.complete(
                    success=all(key in config for key in required_keys)
                    and bool(iraqi_server_config),
                    config_exists=True,
                    server_configs=list(server_configs.keys()),
                    has_iraqi_server=bool(iraqi_server_config),
                    config_keys=list(config.keys()),
                )
            else:
                result.complete(
                    success=False,
                    error_message="Claude Desktop config file not found",
                    config_exists=False,
                )

        except Exception as e:
            result.complete(success=False, error_message=str(e))

        self.results.append(result)

    def _generate_report(self) -> Dict[str, Any]:
        """Generate comprehensive test report."""

        total_tests = len(self.results)
        passed_tests = sum(1 for r in self.results if r.success)
        failed_tests = total_tests - passed_tests

        success_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0

        # Group results by category
        categories = {}
        for result in self.results:
            category = result.name.split("_")[0]
            if category not in categories:
                categories[category] = []
            categories[category].append(result.to_dict())

        report = {
            "summary": {
                "total_tests": total_tests,
                "passed_tests": passed_tests,
                "failed_tests": failed_tests,
                "success_rate": round(success_rate, 2),
                "total_duration_ms": sum(r.duration_ms for r in self.results),
            },
            "categories": categories,
            "failed_tests": [r.to_dict() for r in self.results if not r.success],
            "timestamp": time.time(),
        }

        return report


async def main():
    """Main test entry point."""

    import argparse

    parser = argparse.ArgumentParser(
        description="Iraqi Enhanced MCP Server Integration Tests"
    )
    parser.add_argument("--verbose", action="store_true", help="Enable verbose logging")
    parser.add_argument("--category", help="Run specific test category only")
    parser.add_argument("--output", help="Output report to file")

    args = parser.parse_args()

    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    # Create tester and run tests
    tester = IraqiMCPTester(verbose=args.verbose)
    report = await tester.run_all_tests(category=args.category)

    # Print summary
    print(f"\n{'=' * 60}")
    print("IRAQI ENHANCED MCP SERVER TEST RESULTS")
    print(f"{'=' * 60}")
    print(f"Total Tests: {report['summary']['total_tests']}")
    print(f"Passed: {report['summary']['passed_tests']}")
    print(f"Failed: {report['summary']['failed_tests']}")
    print(f"Success Rate: {report['summary']['success_rate']}%")
    print(f"Duration: {report['summary']['total_duration_ms']}ms")

    # Print failed tests
    if report["failed_tests"]:
        print(f"\n{'=' * 30} FAILED TESTS {'=' * 30}")
        for failed_test in report["failed_tests"]:
            print(f"❌ {failed_test['name']}: {failed_test['error_message']}")

    # Print category breakdown
    print(f"\n{'=' * 25} CATEGORY BREAKDOWN {'=' * 25}")
    for category, tests in report["categories"].items():
        passed = sum(1 for t in tests if t["success"])
        total = len(tests)
        rate = (passed / total * 100) if total > 0 else 0
        print(f"{category.upper()}: {passed}/{total} ({rate:.1f}%)")

    # Save report if requested
    if args.output:
        with open(args.output, "w") as f:
            json.dump(report, f, indent=2)
        print(f"\nReport saved to: {args.output}")

    # Exit with appropriate code
    exit_code = 0 if report["summary"]["failed_tests"] == 0 else 1
    sys.exit(exit_code)


if __name__ == "__main__":
    asyncio.run(main())
