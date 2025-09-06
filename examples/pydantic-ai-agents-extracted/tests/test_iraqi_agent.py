#!/usr/bin/env python3
"""
Iraqi AI Chat System - Agent Tests
Comprehensive test suite for Iraqi AI agents with cultural intelligence
"""
import asyncio
import pytest
import time
from typing import Dict, Any
from unittest.mock import Mock, AsyncMock

# Import core system
from apps.agents.core import (
    create_iraqi_agent,
    IraqiAgentInput,
    IraqiCulturalContext,
    ProfessionalDomain,
    IraqiCulturalMode,
    IslamicComplianceLevel,
    IraqiBaseAgent,
    DefaultIraqiValidator,
    settings
)

from apps.agents.core.tools import (
    validate_cultural_content,
    process_arabic_text,
    check_prayer_times,
    validate_payment_request,
    IraqiToolContext
)


class TestIraqiAgent:
    """Test suite for Iraqi AI Agent core functionality"""
    
    @pytest.fixture
    async def basic_agent(self):
        """Create a basic Iraqi agent for testing"""
        return await create_iraqi_agent(
            name="test-iraqi-agent",
            system_prompt="Test Iraqi AI agent with cultural intelligence"
        )
    
    @pytest.fixture
    def cultural_context(self):
        """Create a test cultural context"""
        return IraqiCulturalContext(
            user_cultural_background="iraqi",
            primary_language="arabic",
            dialect="iraqi_arabic",
            islamic_compliance_required=True,
            professional_domain=ProfessionalDomain.BUSINESS,
            regional_context="baghdad"
        )
    
    @pytest.mark.asyncio
    async def test_agent_creation(self):
        """Test basic agent creation"""
        agent = await create_iraqi_agent(
            name="test-agent",
            system_prompt="Test system prompt"
        )
        
        assert isinstance(agent, IraqiBaseAgent)
        assert agent.name == "test-agent"
        assert agent.agent_id is not None
        assert agent.created_at is not None
        assert agent.request_count == 0
    
    @pytest.mark.asyncio
    async def test_basic_message_processing(self, basic_agent, cultural_context):
        """Test basic message processing functionality"""
        input_msg = IraqiAgentInput(
            message="السلام عليكم، كيف الحال؟",
            cultural_context=cultural_context,
            require_validation=True
        )
        
        result = await basic_agent.process_message(input_msg)
        
        # Verify response structure
        assert result.response is not None
        assert len(result.response) > 0
        assert result.cultural_validation is not None
        assert result.confidence >= 0.0
        assert result.confidence <= 1.0
        assert result.processing_time > 0.0
        assert result.model_used is not None
        
        # Verify agent state updated
        assert basic_agent.request_count == 1
        assert basic_agent.total_processing_time > 0.0
    
    @pytest.mark.asyncio
    async def test_cultural_validation_pass(self, basic_agent):
        """Test cultural validation with appropriate content"""
        cultural_context = IraqiCulturalContext(
            islamic_compliance_required=True,
            cultural_sensitivity_level="high"
        )
        
        input_msg = IraqiAgentInput(
            message="بسم الله الرحمن الرحيم، أسعد الله أوقاتكم. أريد معلومات عن التقاليد العراقية الأصيلة.",
            cultural_context=cultural_context,
            require_validation=True
        )
        
        result = await basic_agent.process_message(input_msg)
        
        # Should pass cultural validation
        assert result.cultural_validation.validation_passed == True
        assert result.cultural_validation.cultural_appropriateness >= settings.min_cultural_appropriateness
        assert result.cultural_validation.islamic_compliance >= settings.min_islamic_compliance
        assert len(result.cultural_validation.issues) == 0
    
    @pytest.mark.asyncio
    async def test_arabic_text_detection(self, basic_agent):
        """Test Arabic text detection and processing"""
        input_msg = IraqiAgentInput(
            message="شلونك؟ شكو ماكو اليوم؟ وين رايحين؟",
            require_validation=True
        )
        
        result = await basic_agent.process_message(input_msg)
        
        # Should detect Arabic content
        assert result.cultural_validation.arabic_accuracy > 0.0
        assert result.cultural_validation.dialect_recognition > 0.0
    
    @pytest.mark.asyncio
    async def test_mixed_language_processing(self, basic_agent):
        """Test mixed Arabic-English content processing"""
        input_msg = IraqiAgentInput(
            message="Hello مرحبا، I want to learn about Iraqi culture. أريد تعلم الثقافة العراقية.",
            require_validation=True
        )
        
        result = await basic_agent.process_message(input_msg)
        
        # Should handle mixed content appropriately
        assert result.cultural_validation is not None
        assert result.processing_time > 0.0
        
        # Should detect mixed language
        assert result.metadata.get("cultural_context", {}).get("language") in ["mixed", "arabic", "english"]
    
    @pytest.mark.asyncio
    async def test_professional_domain_context(self, basic_agent):
        """Test professional domain-specific processing"""
        legal_context = IraqiCulturalContext(
            professional_domain=ProfessionalDomain.LEGAL,
            islamic_compliance_required=True
        )
        
        input_msg = IraqiAgentInput(
            message="What are the key principles of Iraqi civil law regarding contracts?",
            cultural_context=legal_context,
            require_validation=True
        )
        
        result = await basic_agent.process_message(input_msg)
        
        # Should process professional domain content
        assert result.cultural_validation.professional_relevance > 0.0
        assert result.cultural_validation.validation_passed == True
    
    @pytest.mark.asyncio
    async def test_agent_performance_tracking(self, basic_agent):
        """Test agent performance metrics tracking"""
        initial_stats = basic_agent.get_stats()
        assert initial_stats["request_count"] == 0
        
        # Process multiple messages
        for i in range(3):
            input_msg = IraqiAgentInput(
                message=f"Test message {i+1}: مرحبا",
                require_validation=True
            )
            await basic_agent.process_message(input_msg)
        
        final_stats = basic_agent.get_stats()
        
        # Verify metrics updated
        assert final_stats["request_count"] == 3
        assert final_stats["avg_processing_time"] > 0.0
        assert final_stats["validation_failures"] >= 0
        assert 0.0 <= final_stats["failure_rate"] <= 1.0
    
    @pytest.mark.asyncio
    async def test_error_handling(self, basic_agent):
        """Test error handling with invalid input"""
        # Test empty message
        try:
            input_msg = IraqiAgentInput(
                message="",
                require_validation=True
            )
            result = await basic_agent.process_message(input_msg)
            
            # Should handle gracefully
            assert result.confidence == 0.0
            assert result.model_used == "error"
            
        except Exception as e:
            # Should handle validation errors
            assert "empty" in str(e).lower()


class TestIraqiTools:
    """Test suite for Iraqi AI tools"""
    
    @pytest.fixture
    def tool_context(self):
        """Create tool context for testing"""
        return IraqiToolContext(
            user_id="test_user",
            cultural_background="iraqi",
            primary_language="arabic",
            islamic_compliance_required=True
        )
    
    @pytest.mark.asyncio
    async def test_cultural_content_validation(self, tool_context):
        """Test cultural content validation tool"""
        # Test positive content
        positive_content = "السلام عليكم، أهلاً وسهلاً. نحن نحترم التقاليد العراقية والقيم الإسلامية."
        
        result = await validate_cultural_content(positive_content, tool_context)
        
        assert result.success == True
        assert result.cultural_validation_score >= 0.8
        assert result.islamic_compliance_score >= 0.8
        assert result.processing_time > 0.0
        assert isinstance(result.data, dict)
    
    @pytest.mark.asyncio
    async def test_arabic_text_processing(self, tool_context):
        """Test Arabic text processing tool"""
        arabic_text = "شلونكم اليوم؟ شكو ماكو؟ وين رايحين هسة؟"
        
        result = await process_arabic_text(arabic_text, "analyze", tool_context)
        
        assert result.success == True
        assert result.data["has_arabic"] == True
        assert result.data["text_direction"] == "rtl"
        assert result.data["language_detected"] == "arabic"
        assert len(result.data["dialect_indicators"]) > 0
        
        # Check Iraqi dialect recognition
        found_phrases = [indicator["phrase"] for indicator in result.data["dialect_indicators"]]
        iraqi_phrases = ["شلونكم", "شكو ماكو", "وين", "هسة"]
        assert any(phrase in found_phrases for phrase in iraqi_phrases)
    
    @pytest.mark.asyncio
    async def test_prayer_times_check(self, tool_context):
        """Test Islamic prayer times tool"""
        result = await check_prayer_times("Baghdad", context=tool_context)
        
        assert result.success == True
        assert result.islamic_compliance_score == 1.0
        
        data = result.data
        assert data["location"] == "Baghdad"
        assert "date" in data
        assert "prayers" in data
        assert "fajr" in data["prayers"]
        assert "dhuhr" in data["prayers"]
        assert "asr" in data["prayers"]
        assert "maghrib" in data["prayers"]
        assert "isha" in data["prayers"]
    
    @pytest.mark.asyncio
    async def test_payment_validation(self, tool_context):
        """Test Iraqi payment gateway validation"""
        # Test valid ZainCash payment
        result = await validate_payment_request(
            amount=5000.0,
            currency="IQD",
            gateway="zaincash",
            context=tool_context
        )
        
        assert result.success == True
        assert result.data["valid"] == True
        assert result.data["amount"] == 5000.0
        assert result.data["currency"] == "IQD"
        assert result.data["gateway"] == "zaincash"
        assert result.data["islamic_compliant"] == True
        assert result.data["estimated_fee"] > 0.0
    
    @pytest.mark.asyncio
    async def test_payment_validation_limits(self, tool_context):
        """Test payment validation with amount limits"""
        # Test amount below minimum
        result = await validate_payment_request(
            amount=100.0,  # Below ZainCash minimum of 1000
            currency="IQD",
            gateway="zaincash",
            context=tool_context
        )
        
        assert result.success == False
        assert len(result.errors) > 0
        assert "minimum" in result.errors[0].lower()
    
    @pytest.mark.asyncio
    async def test_unsupported_gateway(self, tool_context):
        """Test unsupported payment gateway"""
        result = await validate_payment_request(
            amount=5000.0,
            currency="IQD",
            gateway="unsupported_gateway",
            context=tool_context
        )
        
        assert result.success == False
        assert len(result.errors) > 0
        assert "unsupported" in result.errors[0].lower()


class TestCulturalValidator:
    """Test suite for cultural validation components"""
    
    @pytest.fixture
    def validator(self):
        """Create cultural validator for testing"""
        return DefaultIraqiValidator()
    
    @pytest.mark.asyncio
    async def test_cultural_appropriateness_validation(self, validator):
        """Test cultural appropriateness scoring"""
        context = IraqiCulturalContext(
            cultural_sensitivity_level="high",
            islamic_compliance_required=True
        )
        
        # High appropriateness content
        high_content = "أسعد الله أوقاتكم، نحن نحترم التقاليد العراقية العريقة والقيم الإسلامية النبيلة في مجتمعنا."
        result = await validator.validate_content(high_content, context)
        
        assert result.cultural_appropriateness >= 0.8
        assert result.islamic_compliance >= 0.8
        assert result.validation_passed == True
        
        # Low appropriateness content
        low_content = "This is inappropriate and disrespectful content that goes against cultural values."
        result = await validator.validate_content(low_content, context)
        
        assert result.cultural_appropriateness < 0.8
        assert result.validation_passed == False
        assert len(result.issues) > 0
    
    @pytest.mark.asyncio
    async def test_islamic_compliance_validation(self, validator):
        """Test Islamic compliance validation"""
        # Compliant content
        compliant_content = "نحن نقدر قيم العدالة والسلام والمعرفة والخير في ديننا الحنيف."
        score = await validator.validate_islamic_compliance(compliant_content)
        assert score >= 0.9
        
        # Non-compliant content
        non_compliant_content = "Let's discuss alcohol and gambling businesses in Iraq."
        score = await validator.validate_islamic_compliance(non_compliant_content)
        assert score < 0.9
    
    @pytest.mark.asyncio
    async def test_validation_performance(self, validator):
        """Test validation performance requirements"""
        context = IraqiCulturalContext()
        test_content = "السلام عليكم، مرحبا بكم في نظام الذكاء الاصطناعي العراقي."
        
        start_time = time.time()
        result = await validator.validate_content(test_content, context)
        processing_time = time.time() - start_time
        
        # Should meet performance requirements
        assert processing_time < 0.5  # 500ms max
        assert result.processing_time < 0.5
        assert result.processing_time > 0.0


class TestIntegrationScenarios:
    """Integration test scenarios for complete workflows"""
    
    @pytest.mark.asyncio
    async def test_complete_iraqi_conversation_flow(self):
        """Test complete conversation flow with cultural intelligence"""
        # Create agent
        agent = await create_iraqi_agent(
            name="integration-test-agent",
            system_prompt="Iraqi AI assistant for integration testing"
        )
        
        # Cultural context
        context = IraqiCulturalContext(
            user_cultural_background="iraqi",
            primary_language="mixed",
            islamic_compliance_required=True,
            professional_domain=ProfessionalDomain.BUSINESS,
            prayer_time_awareness=True
        )
        
        # Multi-turn conversation
        conversation_turns = [
            "السلام عليكم، أريد معلومات عن الأعمال التجارية في العراق",
            "What are the Islamic principles I should follow in business?",
            "شكراً لك، Can you help me with Iraqi business customs and etiquette?",
            "هل يمكن أن تساعدني في فهم التقاليد التجارية العراقية؟"
        ]
        
        conversation_results = []
        
        for turn, message in enumerate(conversation_turns, 1):
            input_msg = IraqiAgentInput(
                message=message,
                cultural_context=context,
                require_validation=True
            )
            
            result = await agent.process_message(input_msg)
            conversation_results.append(result)
            
            # Verify each turn
            assert result.cultural_validation.validation_passed == True
            assert result.confidence > 0.0
            assert result.processing_time < 2.0  # Reasonable response time
        
        # Verify conversation progression
        assert len(conversation_results) == 4
        
        # Check agent performance after conversation
        stats = agent.get_stats()
        assert stats["request_count"] == 4
        assert stats["validation_failures"] == 0
        assert stats["failure_rate"] == 0.0
    
    @pytest.mark.asyncio
    async def test_professional_domain_workflow(self):
        """Test professional domain-specific workflow"""
        agent = await create_iraqi_agent(
            name="professional-test-agent",
            system_prompt="Iraqi professional domain assistant"
        )
        
        # Test different professional domains
        domains = [
            (ProfessionalDomain.LEGAL, "What are Iraqi contract law basics?"),
            (ProfessionalDomain.MEDICAL, "معلومات عن النظام الصحي في العراق"),
            (ProfessionalDomain.EDUCATIONAL, "Iraqi educational system structure"),
            (ProfessionalDomain.BUSINESS, "أسس التجارة في العراق")
        ]
        
        for domain, question in domains:
            context = IraqiCulturalContext(
                professional_domain=domain,
                islamic_compliance_required=True
            )
            
            input_msg = IraqiAgentInput(
                message=question,
                cultural_context=context,
                require_validation=True
            )
            
            result = await agent.process_message(input_msg)
            
            # Verify domain-specific processing
            assert result.cultural_validation.professional_relevance > 0.5
            assert result.cultural_validation.validation_passed == True
            assert domain.value in str(result.metadata.get("cultural_context", {}))


# Test runner
async def run_tests():
    """Run all tests"""
    print("🧪 Running Iraqi AI Agent Tests")
    print("=" * 60)
    
    # Note: In a real environment, you would use pytest to run these tests
    # For this example, we'll demonstrate basic test execution
    
    try:
        # Basic agent tests
        agent_test = TestIraqiAgent()
        print("\n✅ Iraqi Agent Tests - Setup Complete")
        
        # Tools tests
        tools_test = TestIraqiTools()
        print("✅ Iraqi Tools Tests - Setup Complete")
        
        # Validator tests
        validator_test = TestCulturalValidator()
        print("✅ Cultural Validator Tests - Setup Complete")
        
        # Integration tests
        integration_test = TestIntegrationScenarios()
        print("✅ Integration Tests - Setup Complete")
        
        print("\n🎉 All Test Suites Initialized Successfully!")
        print("\nTo run these tests, use:")
        print("  pytest apps/agents/tests/test_iraqi_agent.py -v")
        print("  or")
        print("  python apps/agents/tests/test_iraqi_agent.py")
        
    except Exception as e:
        print(f"❌ Test setup error: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    # Run test setup
    asyncio.run(run_tests())