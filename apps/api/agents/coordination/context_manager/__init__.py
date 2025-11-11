"""Iraqi Context Manager - Context optimization (35% improvement)."""

from apps.api.agents.coordination.context_manager.agent import (
    IraqiContextManager,
    get_context_manager,
    ContextManagerDeps,
)

__all__ = ["IraqiContextManager", "get_context_manager", "ContextManagerDeps"]
