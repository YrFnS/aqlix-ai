"""
Integration Tests for Iraqi Enhanced Agent
Test framework validating cultural compatibility and functionality
"""

import asyncio
import pytest
from unittest.mock import Mock, AsyncMock, patch

import sys
from pathlib import Path

# Add the enhanced browser-use package to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from agent import (
    IraqiEnhancedAgent,
    IraqiAgentFactory,
    IraqiAgentState,
    CulturalValidationResult
)


class TestIraqiEnhancedAgent:
    """Test suite for Iraqi Enhanced Agent functionality"""
    
    @pytest.fixture
    def mock_cultural_validator(self):
        """Mock cultural validator"""
        validator = Mock()
        validator.validate_task = AsyncMock(return_value=CulturalValidationResult(
            is_valid=True,
            compliance_score=0.98,
            islamic_compliance_score=0.96
        ))
        validator.validate_actions = AsyncMock(return_value=CulturalValidationResult(
            is_valid=True,
            compliance_score=0.97,
            islamic_compliance_score=0.95
        ))
        return validator
    
    @pytest.fixture
    def mock_arabic_processor(self):
        """Mock Arabic processor"""
        processor = Mock()
        processor.contains_arabic = Mock(return_value=False)
        processor.analyze_text = AsyncMock(return_value={
            'has_arabic': False,
            'rtl_content': False,
            'dialect': None
        })
        return processor
    
    @pytest.fixture 
    def mock_llm(self):
        """Mock LLM provider"""
        llm = Mock()
        llm.generate = AsyncMock(return_value="Mock LLM response")
        return llm
    
    @pytest.fixture
    def basic_agent_config(self, mock_llm):
        """Basic agent configuration for testing"""
        return {
            'task': 'Test Iraqi portal navigation',
            'llm': mock_llm,
            'cultural_compliance': True,
            'islamic_values_compliance': True,
            'arabic_processing': True,
            'use_intelligent_routing': False  # Disable for testing
        }
    
    def test_agent_initialization_with_cultural_features(self, basic_agent_config):
        """Test agent initializes with Iraqi cultural features"""
        with patch('agent.service.CulturalValidator'), \
             patch('agent.service.ArabicProcessor'), \
             patch('agent.service.CulturalWatchdog'), \
             patch('agent.service.IraqiTelemetryService'):
            
            agent = IraqiEnhancedAgent(**basic_agent_config)
            
            # Verify core initialization
            assert agent.task == 'Test Iraqi portal navigation'
            assert agent.cultural_compliance is True
            assert agent.islamic_values_compliance is True
            assert agent.arabic_processing is True
            
            # Verify state initialization
            assert isinstance(agent.agent_state, IraqiAgentState)
            assert agent.agent_state.cultural_compliance_enabled is True
            assert agent.agent_state.islamic_values_enabled is True
            assert agent.agent_state.arabic_processing_enabled is True
    
    def test_agent_initialization_without_cultural_features(self, mock_llm):
        """Test agent works without cultural features for performance mode"""
        config = {
            'task': 'Performance optimized task',
            'llm': mock_llm,
            'cultural_compliance': False,
            'islamic_values_compliance': False,
            'arabic_processing': False,
            'use_intelligent_routing': False
        }
        
        with patch('agent.service.IraqiTelemetryService'):
            agent = IraqiEnhancedAgent(**config)
            
            assert agent.cultural_compliance is False
            assert agent.islamic_values_compliance is False
            assert agent.arabic_processing is False
            
            # Verify cultural components are not initialized
            assert not hasattr(agent, 'cultural_validator')
            assert not hasattr(agent, 'arabic_processor')
    
    def test_portal_mode_initialization(self, mock_llm):
        """Test agent initialization in portal mode"""
        config = {
            'task': 'Navigate passport renewal portal',
            'llm': mock_llm,
            'iraqi_portal_mode': True,
            'government_portal_type': 'passport_services',
            'use_intelligent_routing': False
        }
        
        with patch('agent.service.CulturalValidator'), \
             patch('agent.service.ArabicProcessor'), \
             patch('agent.service.IraqiPortalAgent'), \
             patch('agent.service.CulturalWatchdog'), \
             patch('agent.service.IraqiTelemetryService'):
            
            agent = IraqiEnhancedAgent(**config)
            
            assert agent.agent_state.portal_mode is True
            assert hasattr(agent, 'portal_agent')
    
    @pytest.mark.asyncio
    async def test_cultural_validation_pipeline(self, basic_agent_config, mock_cultural_validator):
        """Test cultural validation is properly integrated"""
        with patch('agent.service.CulturalValidator', return_value=mock_cultural_validator), \
             patch('agent.service.ArabicProcessor'), \
             patch('agent.service.CulturalWatchdog'), \
             patch('agent.service.IraqiTelemetryService'):
            
            agent = IraqiEnhancedAgent(**basic_agent_config)
            
            # Test task validation
            validation_result = await agent._validate_task_culturally("Test task")
            
            assert validation_result.is_valid is True
            assert validation_result.compliance_score >= 0.95
            assert validation_result.islamic_compliance_score >= 0.90
            
            # Verify validator was called
            mock_cultural_validator.validate_task.assert_called_once_with(
                task="Test task",
                islamic_compliance=True
            )
    
    @pytest.mark.asyncio
    async def test_arabic_processing_integration(self, basic_agent_config, mock_arabic_processor):
        """Test Arabic processing is properly integrated"""
        with patch('agent.service.CulturalValidator'), \
             patch('agent.service.ArabicProcessor', return_value=mock_arabic_processor), \
             patch('agent.service.CulturalWatchdog'), \
             patch('agent.service.IraqiTelemetryService'):
            
            agent = IraqiEnhancedAgent(**basic_agent_config)
            
            # Mock action results with Arabic content
            from agent.views import IraqiActionResult
            action_results = [
                IraqiActionResult(
                    action_type='text_extraction',
                    success=True,
                    extracted_content='Test Arabic content'
                )
            ]
            
            # Mock agent output
            from agent.views import IraqiAgentOutput
            agent_output = IraqiAgentOutput(
                thinking='Test thinking',
                evaluation_previous_goal='Test evaluation',
                memory='Test memory',
                next_goal='Test goal',
                action=[],
                cultural_assessment='Test assessment',
                islamic_values_consideration='Test consideration'
            )
            
            # Test Arabic processing enhancement
            enhanced_output = await agent._enhance_with_arabic_processing(
                agent_output, action_results
            )
            
            assert enhanced_output is not None
            # Arabic processor should be checked for content
            mock_arabic_processor.contains_arabic.assert_called()
    
    def test_factory_government_portal_agent(self):
        """Test factory method for government portal agents"""
        with patch('agent.service.CulturalValidator'), \
             patch('agent.service.ArabicProcessor'), \
             patch('agent.service.IraqiPortalAgent'), \
             patch('agent.service.CulturalWatchdog'), \
             patch('agent.service.IraqiTelemetryService'):
            
            agent = IraqiAgentFactory.create_government_portal_agent(
                task='Navigate passport renewal',
                portal_type='passport_services'
            )
            
            assert isinstance(agent, IraqiEnhancedAgent)
            assert agent.agent_state.portal_mode is True
            assert agent.cultural_compliance is True
            assert agent.islamic_values_compliance is True
            assert agent.arabic_processing is True
    
    def test_factory_cultural_validation_agent(self):
        """Test factory method for cultural validation agents"""
        with patch('agent.service.CulturalValidator'), \
             patch('agent.service.ArabicProcessor'), \
             patch('agent.service.CulturalWatchdog'), \
             patch('agent.service.IraqiTelemetryService'):
            
            agent = IraqiAgentFactory.create_cultural_validation_agent(
                task='Culturally sensitive task'
            )
            
            assert isinstance(agent, IraqiEnhancedAgent)
            assert agent.cultural_compliance is True
            assert agent.islamic_values_compliance is True
            assert agent.arabic_processing is True
            assert agent.settings.use_thinking is True
    
    def test_factory_performance_optimized_agent(self):
        """Test factory method for performance-optimized agents"""
        with patch('agent.service.IraqiTelemetryService'):
            agent = IraqiAgentFactory.create_performance_optimized_agent(
                task='Performance critical task'
            )
            
            assert isinstance(agent, IraqiEnhancedAgent)
            assert agent.cultural_compliance is False
            assert agent.arabic_processing is False
            assert agent.settings.use_thinking is False
    
    def test_agent_state_cultural_tracking(self, basic_agent_config):
        """Test Iraqi agent state properly tracks cultural metrics"""
        with patch('agent.service.CulturalValidator'), \
             patch('agent.service.ArabicProcessor'), \
             patch('agent.service.CulturalWatchdog'), \
             patch('agent.service.IraqiTelemetryService'):
            
            agent = IraqiEnhancedAgent(**basic_agent_config)
            state = agent.agent_state
            
            # Verify cultural tracking fields
            assert hasattr(state, 'cultural_compliance_score')
            assert hasattr(state, 'islamic_compliance_score')
            assert hasattr(state, 'cultural_violations')
            assert hasattr(state, 'arabic_text_detected')
            assert hasattr(state, 'rtl_layout_active')
            assert hasattr(state, 'dialect_detected')
            
            # Verify initial values
            assert state.cultural_compliance_score == 1.0
            assert state.islamic_compliance_score == 1.0
            assert state.cultural_violations == []
            assert state.arabic_text_detected is False


class TestMessageManagerIntegration:
    """Test message manager integration with cultural context"""
    
    @pytest.fixture
    def mock_cultural_context(self):
        """Mock cultural context"""
        context = Mock()
        context.get_current_context = AsyncMock(return_value={
            'current_time': '2025-01-25 10:00:00',
            'prayer_times_active': False,
            'sensitivity_level': 'High',
            'language_context': 'Mixed Arabic/English'
        })
        return context
    
    @pytest.fixture
    def mock_arabic_processor(self):
        """Mock Arabic processor for message manager"""
        processor = Mock()
        processor.contains_arabic = Mock(return_value=False)
        processor.analyze_text = AsyncMock(return_value={
            'has_arabic': False,
            'rtl_content': False,
            'dialect': None
        })
        return processor
    
    def test_message_manager_initialization(self):
        """Test message manager initializes with cultural features"""
        from agent.message_manager import MessageManager
        
        with patch('agent.message_manager.service.IraqiCulturalContext'), \
             patch('agent.message_manager.service.ArabicProcessor'):
            
            manager = MessageManager(
                cultural_context=True,
                arabic_processing=True,
                portal_context=True
            )
            
            assert manager.cultural_context_enabled is True
            assert manager.arabic_processing_enabled is True
            assert manager.portal_context_enabled is True
    
    @pytest.mark.asyncio
    async def test_cultural_context_message_generation(self, mock_cultural_context):
        """Test cultural context message generation"""
        from agent.message_manager import MessageManager
        
        with patch('agent.message_manager.service.IraqiCulturalContext', return_value=mock_cultural_context), \
             patch('agent.message_manager.service.ArabicProcessor'):
            
            manager = MessageManager(cultural_context=True)
            
            # Mock agent state
            from agent.views import IraqiAgentState
            agent_state = IraqiAgentState()
            
            # Test cultural context message creation
            cultural_message = await manager._create_cultural_context_message(agent_state)
            
            assert cultural_message is not None
            assert 'Cultural Context for Iraqi Operations' in cultural_message.content
            
            # Verify cultural context was requested
            mock_cultural_context.get_current_context.assert_called_once()


class TestCompatibilityWithExistingSystem:
    """Test compatibility with existing Iraqi AI system"""
    
    def test_agent_preserves_existing_interfaces(self):
        """Test that enhanced agent preserves interfaces used by existing system"""
        # This would test compatibility with existing Iraqi agents
        # For now, we verify the interface exists
        
        from agent import IraqiEnhancedAgent
        
        # Verify key methods exist that existing system expects
        agent_methods = dir(IraqiEnhancedAgent)
        
        assert 'run' in agent_methods  # Main execution method
        assert '__init__' in agent_methods  # Constructor
        
        # Verify key attributes exist
        with patch('agent.service.CulturalValidator'), \
             patch('agent.service.ArabicProcessor'), \
             patch('agent.service.IraqiTelemetryService'):
            
            agent = IraqiEnhancedAgent(
                task='Test task',
                cultural_compliance=True
            )
            
            # Verify expected attributes exist
            assert hasattr(agent, 'task')
            assert hasattr(agent, 'llm')
            assert hasattr(agent, 'agent_state')
            assert hasattr(agent, 'cultural_compliance')
    
    def test_backward_compatibility_with_simple_initialization(self):
        """Test that agent can be initialized with minimal parameters like existing system"""
        with patch('agent.service.IraqiTelemetryService'):
            # Should work with just a task, similar to existing system
            agent = IraqiEnhancedAgent(task='Simple task')
            
            assert agent.task == 'Simple task'
            assert agent.llm is not None  # Should have default LLM
            assert isinstance(agent.agent_state, IraqiAgentState)


if __name__ == '__main__':
    # Run tests
    pytest.main([__file__, '-v'])