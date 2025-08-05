"""
PraisonAI Multi-Agent Framework - Iraqi AI Chat System Integration
=================================================================

A production-ready Multi AI Agents framework adapted for Iraqi professional domains,
designed to create specialized AI Agents for Iraqi legal, medical, educational, 
government, business, and engineering contexts.

Key Features:
- Multi-agent collaboration with Iraqi cultural context
- Professional domain specialization
- Islamic compliance and cultural appropriateness
- Arabic RTL support with Iraqi dialect recognition
- Integration with Iraqi payment systems and government services

This module provides the core initialization for the PraisonAI framework
with Iraqi-specific enhancements and cultural adaptations.
"""

import os

# Disable OpenTelemetry for cleaner operation
os.environ["OTEL_SDK_DISABLED"] = "false"
os.environ["EC_TELEMETRY"] = "false"

from .cli import PraisonAI
from .version import __version__

# Core exports for Iraqi AI Chat System
__all__ = ["PraisonAI", "__version__"]

# Optional imports for extended functionality
try:
    import praisonaiagents
    from praisonaiagents import Agent, Task, Crew
    __all__.extend(["Agent", "Task", "Crew", "praisonaiagents"])
except ImportError:
    # Graceful degradation if praisonaiagents is not available
    pass

# Iraqi AI Chat System specific imports
try:
    from .iraqi_agents import (
        IraqiLegalAgent,
        IraqiMedicalAgent,
        IraqiEducationalAgent,
        IraqiGovernmentAgent,
        IraqiBusinessAgent,
        IraqiEngineeringAgent
    )
    __all__.extend([
        "IraqiLegalAgent",
        "IraqiMedicalAgent", 
        "IraqiEducationalAgent",
        "IraqiGovernmentAgent",
        "IraqiBusinessAgent",
        "IraqiEngineeringAgent"
    ])
except ImportError:
    # Iraqi agents will be available after full integration
    pass

# Version and metadata
__author__ = "Mervin Praison, Iraqi AI Chat System Team"
__description__ = "Multi-Agent AI Framework for Iraqi Professional Domains"
__url__ = "https://github.com/MervinPraison/PraisonAI"