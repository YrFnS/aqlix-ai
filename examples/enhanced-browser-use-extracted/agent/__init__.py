"""
Enhanced Browser-Use Agent System - Iraqi AI Integration
Main agent module exports with hybrid browser-use + Iraqi capabilities
"""

from .service import IraqiEnhancedAgent, IraqiAgentFactory

from .views import (
    AgentSettings,
    AgentState,
    IraqiAgentState,
    AgentBrain,
    IraqiAgentBrain,
    AgentOutput,
    IraqiAgentOutput,
    ActionResult,
    IraqiActionResult,
    StepMetadata,
    IraqiStepMetadata,
    AgentStepInfo,
    AgentHistory,
    AgentHistoryList,
    CulturalValidationResult,
    IraqiAgentError,
)

from .message_manager.service import MessageManager
from .message_manager.views import (
    MessageManagerState,
    IraqiMessageManagerState,
    HistoryItem,
    ConversationContext,
    MessageOptimizationSettings,
    CulturalMessageContext,
    ArabicProcessingContext,
    PortalMessageContext,
    MessagePerformanceMetrics,
    EnhancedMessageHistory,
)

# Main agent class for easy import
Agent = IraqiEnhancedAgent


# Factory convenience functions
def create_iraqi_portal_agent(
    task: str, portal_type: str, **kwargs
) -> IraqiEnhancedAgent:
    """Create agent optimized for Iraqi government portals"""
    return IraqiAgentFactory.create_government_portal_agent(task, portal_type, **kwargs)


def create_cultural_agent(task: str, **kwargs) -> IraqiEnhancedAgent:
    """Create agent with maximum cultural validation"""
    return IraqiAgentFactory.create_cultural_validation_agent(task, **kwargs)


def create_performance_agent(task: str, **kwargs) -> IraqiEnhancedAgent:
    """Create agent optimized for performance"""
    return IraqiAgentFactory.create_performance_optimized_agent(task, **kwargs)


# Version information
__version__ = "0.1.0"
__description__ = "Enhanced Browser-Use Agent with Iraqi AI Integration"

__all__ = [
    # Core agent classes
    "IraqiEnhancedAgent",
    "Agent",  # Alias for convenience
    "IraqiAgentFactory",
    # Agent data models
    "AgentSettings",
    "AgentState",
    "IraqiAgentState",
    "AgentBrain",
    "IraqiAgentBrain",
    "AgentOutput",
    "IraqiAgentOutput",
    "ActionResult",
    "IraqiActionResult",
    "StepMetadata",
    "IraqiStepMetadata",
    "AgentStepInfo",
    "AgentHistory",
    "AgentHistoryList",
    "CulturalValidationResult",
    "IraqiAgentError",
    # Message management
    "MessageManager",
    "MessageManagerState",
    "IraqiMessageManagerState",
    "HistoryItem",
    "ConversationContext",
    "MessageOptimizationSettings",
    "CulturalMessageContext",
    "ArabicProcessingContext",
    "PortalMessageContext",
    "MessagePerformanceMetrics",
    "EnhancedMessageHistory",
    # Factory functions
    "create_iraqi_portal_agent",
    "create_cultural_agent",
    "create_performance_agent",
]
