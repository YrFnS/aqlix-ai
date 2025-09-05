"""
Basic Functionality Test for Iraqi ADK Agent System
==================================================

Simple test to validate that the extracted Google ADK patterns work correctly
with Iraqi cultural enhancements.
"""

import asyncio
import sys
import os
from typing import Dict, Any

# Add the current directory to Python path for testing
sys.path.insert(0, os.path.dirname(__file__))

# Test imports
try:
    from core import IraqiAgent, IraqiAgentConfig, AgentStatus
    from cultural import CulturalMixin, IslamicComplianceMixin
    from orchestration import IraqiMultiAgentSystem, OrchestrationConfig
    from tools import IraqiToolIntegration, ToolCategory
    print("✅ All imports successful")
except ImportError as e:
    print(f"❌ Import error: {e}")
    sys.exit(1)


async def test_basic_agent_creation():
    """Test basic agent creation and configuration"""
    print("\n--- Testing Basic Agent Creation ---")
    
    try:
        # Create a basic Iraqi agent
        agent = IraqiAgent(
            name="test_agent",
            description="Test agent for validation",
            cultural_compliance_required=True,
            islamic_principles_enabled=True
        )
        
        print(f"✅ Agent created: {agent.config.name}")
        print(f"✅ Cultural compliance required: {agent.config.cultural_compliance_required}")
        print(f"✅ Islamic principles enabled: {agent.config.islamic_principles_enabled}")
        print(f"✅ Initial status: {agent.status}")
        
        return True
        
    except Exception as e:
        print(f"❌ Agent creation failed: {e}")
        return False


async def test_cultural_validation():
    """Test cultural validation functionality"""
    print("\n--- Testing Cultural Validation ---")
    
    try:
        agent = IraqiAgent(
            name="cultural_test_agent",
            cultural_compliance_required=True,
            islamic_principles_enabled=True
        )
        
        # Test cultural validation
        test_content = {
            "text": "هذا اختبار للنظام الذكي العراقي",
            "context": "testing"
        }
        
        validation_result = await agent.validate_cultural_compliance(test_content)
        
        print(f"✅ Cultural validation completed")
        print(f"✅ Is compliant: {validation_result['is_compliant']}")
        print(f"✅ Cultural score: {validation_result['cultural_score']}")
        print(f"✅ Islamic compliance: {validation_result['islamic_compliance']}")
        
        return validation_result['is_compliant']
        
    except Exception as e:
        print(f"❌ Cultural validation failed: {e}")
        return False


async def test_agent_processing():
    """Test basic agent processing"""
    print("\n--- Testing Agent Processing ---")
    
    try:
        agent = IraqiAgent(
            name="processing_test_agent",
            description="Test agent for processing validation"
        )
        
        test_input = {
            "content": "Test processing input",
            "type": "basic_test"
        }
        
        result = await agent.process(test_input)
        
        print(f"✅ Agent processing completed")
        print(f"✅ Status: {result['status']}")
        print(f"✅ Agent: {result['agent']}")
        
        if "cultural_validation" in result:
            print(f"✅ Cultural validation included: {result['cultural_validation']['is_compliant']}")
        
        return result['status'] in ['success', 'completed']
        
    except Exception as e:
        print(f"❌ Agent processing failed: {e}")
        return False


async def test_tool_system():
    """Test tool integration system"""
    print("\n--- Testing Tool Integration System ---")
    
    try:
        # Create tool integration system
        tool_system = IraqiToolIntegration()
        
        # Get system status
        status = tool_system.get_system_status()
        
        print(f"✅ Tool system created")
        print(f"✅ Total tools: {status['total_tools']}")
        print(f"✅ Available tools: {len(status['available_tools'])}")
        
        # Test cultural validation tool
        if "cultural_validation_tool" in status['available_tools']:
            test_input = "Test content for cultural validation"
            result = await tool_system.execute_tool("cultural_validation_tool", test_input)
            
            print(f"✅ Cultural validation tool executed: {result['status']}")
            
            return result['status'] == 'success'
        else:
            print("⚠️ Cultural validation tool not found")
            return False
        
    except Exception as e:
        print(f"❌ Tool system test failed: {e}")
        return False


async def test_orchestration_system():
    """Test basic orchestration system"""
    print("\n--- Testing Orchestration System ---")
    
    try:
        # Create orchestration system
        config = OrchestrationConfig(
            cultural_validation_required=True,
            islamic_principles_enforcement=True
        )
        
        orchestration_system = IraqiMultiAgentSystem(config)
        
        # Create a test agent
        test_agent = IraqiAgent(
            name="orchestration_test_agent",
            description="Agent for testing orchestration"
        )
        
        # Register agent
        orchestration_system.register_agent(test_agent)
        
        print(f"✅ Orchestration system created")
        print(f"✅ Agent registered: {test_agent.config.name}")
        
        # Test basic orchestration
        test_task = {
            "content": "Test orchestration task",
            "type": "basic_orchestration"
        }
        
        result = await orchestration_system.orchestrate(
            test_task,
            agent_selection=["orchestration_test_agent"]
        )
        
        print(f"✅ Orchestration completed: {result['status']}")
        
        if "cultural_validation" in result:
            print(f"✅ Cultural validation: {result['cultural_validation']['is_compliant']}")
        
        return result['status'] in ['success', 'completed']
        
    except Exception as e:
        print(f"❌ Orchestration system test failed: {e}")
        return False


async def run_all_tests():
    """Run all basic functionality tests"""
    print("Iraqi ADK Agent System - Basic Functionality Tests")
    print("=" * 55)
    
    tests = [
        ("Agent Creation", test_basic_agent_creation),
        ("Cultural Validation", test_cultural_validation),
        ("Agent Processing", test_agent_processing),
        ("Tool Integration", test_tool_system),
        ("Orchestration System", test_orchestration_system)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"\n🧪 Running {test_name} test...")
        try:
            success = await test_func()
            results.append((test_name, success))
            status = "✅ PASSED" if success else "❌ FAILED"
            print(f"{status}: {test_name}")
        except Exception as e:
            print(f"❌ ERROR in {test_name}: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 55)
    print("TEST SUMMARY")
    print("=" * 55)
    
    passed = 0
    failed = 0
    
    for test_name, success in results:
        status = "✅ PASSED" if success else "❌ FAILED"
        print(f"{status}: {test_name}")
        if success:
            passed += 1
        else:
            failed += 1
    
    print(f"\nTotal Tests: {len(results)}")
    print(f"Passed: {passed}")
    print(f"Failed: {failed}")
    print(f"Success Rate: {passed/len(results)*100:.1f}%")
    
    if failed == 0:
        print("\n🎉 All tests passed! Iraqi ADK system is working correctly.")
    else:
        print(f"\n⚠️ {failed} test(s) failed. Please review the system.")
    
    return failed == 0


if __name__ == "__main__":
    success = asyncio.run(run_all_tests())
    sys.exit(0 if success else 1)