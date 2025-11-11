"""Iraqi Technical Agents - AI architecture, debugging, and DevOps."""

from apps.api.agents.technical.ai_architect import (
    IraqiAIAgentArchitect,
    get_ai_architect,
    AIArchitectDeps,
)
from apps.api.agents.technical.debugger import (
    IraqiTechnicalDebugger,
    get_technical_debugger,
    TechnicalDebuggerDeps,
)
from apps.api.agents.technical.devops import (
    IraqiDevOpsEngineer,
    get_devops_engineer,
    DevOpsEngineerDeps,
)

__all__ = [
    "IraqiAIAgentArchitect",
    "get_ai_architect",
    "AIArchitectDeps",
    "IraqiTechnicalDebugger",
    "get_technical_debugger",
    "TechnicalDebuggerDeps",
    "IraqiDevOpsEngineer",
    "get_devops_engineer",
    "DevOpsEngineerDeps",
]
