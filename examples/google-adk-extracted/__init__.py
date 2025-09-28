"""
Google ADK Python Extraction for Iraqi AI Chat System
====================================================

This module contains extracted and Iraqi-adapted patterns from Google's Agent Development Kit (ADK).
The ADK provides a powerful framework for building multi-agent systems with hierarchical orchestration.

Key Components:
- Core Agent Classes: Base agent architecture with Iraqi cultural integration
- Multi-Agent Orchestration: Hierarchical agent coordination and delegation
- Tool Integration: Seamless MCP server integration with cultural awareness
- Cultural Enhancement: Iraqi-specific agent capabilities and validation

Strategic Value:
- 95% alignment with Iraqi AI agent architecture needs
- Production-ready multi-agent orchestration framework
- Hierarchical delegation perfect for cultural validation chains
- Dynamic LLM-driven routing for specialized agent coordination

Usage:
    from examples.google_adk_extracted import IraqiAgent, IraqiMultiAgentSystem

    # Create culturally-aware agent
    cultural_agent = IraqiAgent(
        name="iraqi_cultural_validator",
        cultural_compliance_required=True,
        islamic_principles=True
    )
"""

__version__ = "1.0.0"
__author__ = "Iraqi AI Development Team"

# Core ADK agent imports
from .core import IraqiAgent, IraqiLlmAgent, IraqiBaseAgent, IraqiAgentConfig

# Multi-agent orchestration
from .orchestration import (
    IraqiMultiAgentSystem,
    IraqiSequentialAgent,
    IraqiParallelAgent,
    IraqiLoopAgent,
    OrchestrationConfig,
    OrchestrationStrategy,
    DelegationMode,
    PerformanceTracker,
)

# Tool integration
from .tools import (
    IraqiToolIntegration,
    CulturalValidationTool,
    ArabicProcessingTool,
    ProfessionalDomainTool,
    IraqiTool,
    IraqiToolConfig,
    ToolCategory,
    ToolPriority,
    ToolPerformanceTracker,
)

# Cultural enhancements
from .cultural import (
    CulturalMixin,
    IslamicComplianceMixin,
    ArabicLanguageMixin,
    ProfessionalContextMixin,
)

__all__ = [
    # Core agents
    "IraqiAgent",
    "IraqiLlmAgent",
    "IraqiBaseAgent",
    "IraqiAgentConfig",
    # Orchestration
    "IraqiMultiAgentSystem",
    "IraqiSequentialAgent",
    "IraqiParallelAgent",
    "IraqiLoopAgent",
    "OrchestrationConfig",
    "OrchestrationStrategy",
    "DelegationMode",
    "PerformanceTracker",
    # Tools
    "IraqiToolIntegration",
    "CulturalValidationTool",
    "ArabicProcessingTool",
    "ProfessionalDomainTool",
    "IraqiTool",
    "IraqiToolConfig",
    "ToolCategory",
    "ToolPriority",
    "ToolPerformanceTracker",
    # Cultural mixins
    "CulturalMixin",
    "IslamicComplianceMixin",
    "ArabicLanguageMixin",
    "ProfessionalContextMixin",
]
