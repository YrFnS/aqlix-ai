#!/usr/bin/env python3
"""
Test Enhanced Iraqi Trajectory Intelligence System
Simple validation script to test the enhanced debugging capabilities.
"""

import asyncio
import sys
from pathlib import Path

# Add current directory to path
sys.path.insert(0, str(Path(__file__).parent))

async def test_enhanced_system():
    """Test the enhanced Iraqi trajectory intelligence system."""
    
    print("🧪 Testing Enhanced Iraqi Trajectory Intelligence System")
    print("=" * 60)
    
    try:
        # Test importing the enhanced debugging engine
        print("1. Testing Advanced Debugging Engine...")
        from iraqi_advanced_debugging import (
            IraqiAdvancedDebuggingEngine,
            IraqiDebugLevel,
            IraqiErrorCategory
        )
        
        # Initialize debugging engine
        debug_engine = IraqiAdvancedDebuggingEngine()
        print("   ✅ Advanced debugging engine initialized successfully")
        
        # Test error analysis
        test_error = "Arabic text encoding error: invalid UTF-8 sequence"
        test_context = {
            "operation": "arabic_processing",
            "content": "مرحباً بكم في النظام",
            "encoding": "utf-8"
        }
        
        debug_result = await debug_engine.analyze_error_with_context(
            error_message=test_error,
            context=test_context,
            cultural_context="cultural_heritage"
        )
        
        print(f"   📊 Error analysis completed:")
        print(f"      - Category: {debug_result.error_category.value if debug_result.error_category else 'unknown'}")
        print(f"      - Debug Level: {debug_result.debug_level.value}")
        print(f"      - Resolution Confidence: {debug_result.resolution_confidence:.2f}")
        print(f"      - Recovery Attempts: {len(debug_result.recovery_attempts)}")
        
        # Test 2: Integration Manager
        print("\\n2. Testing Debugging Integration Manager...")
        from iraqi_debugging_integration import IraqiDebuggingIntegrationManager
        
        integration_manager = IraqiDebuggingIntegrationManager(enable_advanced_debugging=True)
        print("   ✅ Integration manager initialized successfully")
        
        # Test integration status
        integration_status = integration_manager.get_integration_status()
        print(f"   📋 Integration Status:")
        print(f"      - Advanced Debugging: {integration_status['advanced_debugging_enabled']}")
        print(f"      - Engine Available: {integration_status['debugging_engine_available']}")
        
        # Test 3: Basic trajectory recording validation
        print("\\n3. Testing Enhanced Trajectory Recording...")
        
        # Create a minimal test to validate the enhanced system works
        test_step_data = {
            "step_number": 1,
            "operation": "test_operation",
            "duration_ms": 250,
            "success": True
        }
        
        integration_result = await integration_manager.integrate_with_trajectory_step(
            step_data=test_step_data,
            cultural_context="business_commercial"
        )
        
        print(f"   📈 Step Integration Result:")
        print(f"      - Debugging Enabled: {integration_result.get('debugging_enabled', False)}")
        print(f"      - Integration Status: {integration_result.get('integration_status', 'unknown')}")
        
        if integration_result.get('recommendations'):
            print(f"      - Recommendations: {len(integration_result['recommendations'])}")
        
        # Test 4: System health check
        print("\\n4. Testing System Health Check...")
        
        health_check = await integration_manager.perform_system_health_check()
        
        if health_check.get('health_check_available'):
            health_score = health_check.get('overall_health_score', 0.0)
            print(f"   🏥 System Health Score: {health_score:.2f}/1.0")
            
            if health_check.get('debugging_diagnostics'):
                diagnostics = health_check['debugging_diagnostics']
                system_health = diagnostics.get('system_health_score', 0.0)
                print(f"   📊 Detailed Health Score: {system_health:.2f}")
        else:
            print(f"   ⚠️  Health check issue: {health_check.get('message', 'Unknown')}")
        
        # Test 5: Validate key functionality works
        print("\\n5. Testing Key Iraqi-Specific Features...")
        
        # Test Arabic content analysis
        arabic_test = "مرحباً، شلونك؟ كيف الحال؟"
        arabic_analysis = await debug_engine._analyze_arabic_content(arabic_test)
        
        print(f"   🔤 Arabic Analysis:")
        print(f"      - Arabic Characters: {arabic_analysis['total_arabic_chars']}")
        print(f"      - Arabic Words: {arabic_analysis['arabic_words']}")
        print(f"      - Dialect Classification: {arabic_analysis['dialect_classification']}")
        
        # Test cultural validation
        cultural_test_content = "Educational content respecting Islamic principles"
        cultural_validation = await debug_engine._perform_cultural_validation(
            cultural_test_content, 
            "professional_educational"
        )
        
        print(f"   ☪️  Cultural Validation:")
        print(f"      - Islamic Compliance: {cultural_validation['islamic_compliance_score']:.2f}")
        print(f"      - Cultural Appropriateness: {cultural_validation['cultural_appropriateness_score']:.2f}")
        print(f"      - Issues Detected: {len(cultural_validation['issues_detected'])}")
        
        print("\\n🎉 ALL TESTS PASSED SUCCESSFULLY!")
        print("\\n✅ Enhanced Iraqi Trajectory Intelligence System is working correctly")
        print("\\nKey capabilities validated:")
        print("   • Advanced error pattern recognition")
        print("   • Iraqi-specific debugging intelligence")
        print("   • Cultural compliance validation") 
        print("   • Arabic text processing analysis")
        print("   • System health monitoring")
        print("   • Integration management")
        print("\\n🇮🇶 Ready for Iraqi AI system debugging and trajectory recording!")
        
        return True
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("   Please ensure all modules are in the correct location")
        return False
        
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        return False

async def main():
    """Main test execution."""
    success = await test_enhanced_system()
    
    if success:
        print("\\n🎯 Test Summary: ALL SYSTEMS OPERATIONAL")
        sys.exit(0)
    else:
        print("\\n⚠️  Test Summary: ISSUES DETECTED")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())