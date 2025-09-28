"""
Iraqi AI Agent System Example
=============================

Comprehensive example demonstrating the Iraqi-enhanced Google ADK agent system
with cultural validation, Arabic processing, and multi-agent orchestration.

This example shows how to:
1. Create culturally-aware Iraqi agents
2. Set up multi-agent orchestration
3. Integrate tool processing
4. Handle cultural validation workflows
5. Process Arabic content with RTL support
"""

import asyncio
from typing import Dict, Any

# Import Iraqi agent system
from .core import IraqiAgent, IraqiLlmAgent, IraqiAgentConfig
from .orchestration import (
    IraqiMultiAgentSystem,
    OrchestrationConfig,
    OrchestrationStrategy,
)
from .tools import IraqiToolIntegration, ToolCategory
from .cultural import CulturalMixin, IslamicComplianceMixin


async def example_single_agent():
    """Example: Single Iraqi agent with cultural validation"""
    print("=== Single Agent Example ===")

    # Create a culturally-aware Iraqi agent
    agent = IraqiAgent(
        name="iraqi_cultural_validator",
        description="Validates content for Iraqi cultural appropriateness",
        instruction="You are a cultural validation agent that ensures all content respects Iraqi culture and Islamic principles",
        cultural_compliance_required=True,
        islamic_principles_enabled=True,
        arabic_rtl_support=True,
    )

    # Test input with Arabic content
    test_input = {
        "content": "مرحباً، هذا اختبار للنظام الذكي العراقي. Hello, this is a test for the Iraqi AI system.",
        "context": "professional_communication",
        "domain": "general",
    }

    # Process the input
    result = await agent.process(test_input)

    print(f"Agent: {result['agent']}")
    print(f"Status: {result['status']}")
    if "cultural_validation" in result:
        cv = result["cultural_validation"]
        print(f"Cultural Score: {cv['cultural_score']}")
        print(f"Islamic Compliance: {cv['islamic_compliance']}")

    return result


async def example_multi_agent_orchestration():
    """Example: Multi-agent orchestration with cultural priority"""
    print("\n=== Multi-Agent Orchestration Example ===")

    # Create multiple specialized agents
    cultural_agent = IraqiAgent(
        name="cultural_validator",
        description="Primary cultural validation agent",
        cultural_compliance_required=True,
        islamic_principles_enabled=True,
    )

    arabic_agent = IraqiAgent(
        name="arabic_processor",
        description="Arabic text processing and RTL layout agent",
        arabic_rtl_support=True,
        iraqi_dialect_processing=True,
    )

    professional_agent = IraqiAgent(
        name="legal_domain_agent",
        description="Iraqi legal domain specialist",
        professional_domains=["legal"],
        professional_context_validation=True,
    )

    # Create orchestration system
    orchestration_config = OrchestrationConfig(
        strategy=OrchestrationStrategy.CULTURAL_PRIORITY,
        cultural_validation_required=True,
        cultural_score_threshold=0.95,
        islamic_principles_enforcement=True,
    )

    orchestration_system = IraqiMultiAgentSystem(orchestration_config)

    # Register agents
    orchestration_system.register_agent(cultural_agent)
    orchestration_system.register_agent(arabic_agent)
    orchestration_system.register_agent(professional_agent)

    # Test input - legal content in Arabic
    legal_input = {
        "content": """
        قانون العقود العراقي ينص على ضرورة الالتزام بالمبادئ الإسلامية في جميع التعاملات التجارية.
        Iraqi contract law requires adherence to Islamic principles in all business transactions.
        """,
        "domain": "legal",
        "context": "contract_review",
        "requirements": ["cultural_validation", "arabic_processing", "legal_analysis"],
    }

    # Execute orchestration
    result = await orchestration_system.orchestrate(legal_input)

    print(f"Orchestration Status: {result['status']}")
    print(f"Orchestration Type: {result['orchestration_type']}")

    if "cultural_results" in result:
        print(
            f"Cultural validation completed: {len(result['cultural_results'])} agents"
        )

    if "other_results" in result:
        print(f"Additional processing completed: {len(result['other_results'])} agents")

    return result


async def example_tool_integration():
    """Example: Tool integration with Iraqi agents"""
    print("\n=== Tool Integration Example ===")

    # Create tool integration system
    tool_system = IraqiToolIntegration()

    # Test cultural validation tool
    cultural_input = {
        "text": "هذا محتوى يحترم القيم الإسلامية والثقافة العراقية",
        "context": "public_communication",
    }

    cultural_result = await tool_system.execute_tool(
        "cultural_validation_tool", cultural_input
    )

    print(f"Cultural Validation Status: {cultural_result['status']}")
    if cultural_result["status"] == "success":
        ca = cultural_result["cultural_assessment"]
        print(f"Overall Score: {ca['overall_score']}")
        print(f"Compliance Level: {ca['compliance_level'].value}")

    # Test Arabic processing tool
    arabic_input = "مرحباً بكم في النظام الذكي العراقي! Welcome to the Iraqi AI System!"

    arabic_result = await tool_system.execute_tool(
        "arabic_processing_tool", arabic_input
    )

    print(f"Arabic Processing Status: {arabic_result['status']}")
    if arabic_result["status"] == "success":
        print(f"Contains Arabic: {arabic_result['contains_arabic']}")
        if arabic_result["contains_arabic"]:
            print(f"RTL Processed: {arabic_result.get('rtl_processed', 'N/A')}")

    return {"cultural_result": cultural_result, "arabic_result": arabic_result}


async def example_comprehensive_workflow():
    """Example: Comprehensive workflow combining agents and tools"""
    print("\n=== Comprehensive Workflow Example ===")

    # Create advanced LLM agent
    advanced_agent = IraqiLlmAgent(
        name="iraqi_professional_assistant",
        model="gemini-2.0-flash",
        instruction="""
        You are an advanced Iraqi AI assistant that:
        1. Respects Iraqi culture and Islamic principles
        2. Processes Arabic text with proper RTL formatting
        3. Provides professional guidance for Iraqi domains
        4. Ensures all responses meet cultural compliance standards
        """,
        cultural_compliance_required=True,
        islamic_principles_enabled=True,
        arabic_rtl_support=True,
        professional_domains=["legal", "medical", "educational"],
    )

    # Test comprehensive input
    comprehensive_input = {
        "query": """
        أحتاج إلى مساعدة في صياغة عقد عمل يتماشى مع القانون العراقي والمبادئ الإسلامية.
        I need help drafting an employment contract that complies with Iraqi law and Islamic principles.
        
        المتطلبات:
        Requirements:
        - يجب أن يكون العقد مطابقاً للقانون العراقي
        - احترام المبادئ الإسلامية في العمل  
        - حماية حقوق الموظف والموظف
        - The contract must comply with Iraqi law
        - Respect Islamic principles in employment
        - Protect both employee and employer rights
        """,
        "domain": "legal",
        "context": "employment_contract",
        "cultural_requirements": {
            "islamic_compliance": True,
            "iraqi_law_compliance": True,
            "professional_standards": True,
        },
    }

    # Process with comprehensive validation
    result = await advanced_agent.process(comprehensive_input)

    print(f"Advanced Agent Status: {result['status']}")
    print(f"Processing Type: {result.get('processing_type', 'N/A')}")

    if "cultural_validation" in result:
        cv = result["cultural_validation"]
        print(f"Cultural Compliance: {cv['is_compliant']}")
        print(f"Cultural Score: {cv['cultural_score']}")
        print(f"Islamic Compliance: {cv['islamic_compliance']}")

    return result


async def example_performance_monitoring():
    """Example: Performance monitoring and metrics"""
    print("\n=== Performance Monitoring Example ===")

    # Create orchestration system with monitoring enabled
    config = OrchestrationConfig(enable_monitoring=True, enable_caching=True)

    system = IraqiMultiAgentSystem(config)

    # Create a simple test agent
    test_agent = IraqiAgent(
        name="performance_test_agent", description="Agent for performance testing"
    )

    system.register_agent(test_agent)

    # Run multiple orchestrations
    test_cases = [
        {"content": "Test case 1", "complexity": "low"},
        {"content": "اختبار الأداء مع النص العربي", "complexity": "medium"},
        {
            "content": "Complex multi-domain test with legal and medical content",
            "complexity": "high",
        },
    ]

    results = []
    for i, test_case in enumerate(test_cases):
        result = await system.orchestrate(test_case, ["performance_test_agent"])
        results.append(result)
        print(
            f"Test {i + 1} - Status: {result['status']}, Time: {result.get('execution_time', 0):.3f}s"
        )

    # Get performance metrics
    if hasattr(system, "performance_tracker"):
        performance_summary = system.performance_tracker.get_performance_summary()
        print(
            f"Total Orchestrations: {performance_summary.get('total_orchestrations', 0)}"
        )
        print(f"Success Rate: {performance_summary.get('success_rate', 0):.2%}")
        print(
            f"Average Execution Time: {performance_summary.get('average_execution_time', 0):.3f}s"
        )

    return results


async def main():
    """Main function to run all examples"""
    print("Iraqi AI Agent System - Comprehensive Examples")
    print("=" * 50)

    try:
        # Run all examples
        await example_single_agent()
        await example_multi_agent_orchestration()
        await example_tool_integration()
        await example_comprehensive_workflow()
        await example_performance_monitoring()

        print("\n" + "=" * 50)
        print("All examples completed successfully!")

    except Exception as e:
        print(f"Error running examples: {str(e)}")
        raise


if __name__ == "__main__":
    # Run the examples
    asyncio.run(main())
