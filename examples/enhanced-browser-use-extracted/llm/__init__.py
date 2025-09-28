"""
Enhanced multi-LLM provider system with Iraqi AI integration.
Extracted from browser-use with cultural validation and Arabic RTL support.

Features:
- 10+ LLM provider support with lazy loading
- Iraqi cultural validation integration
- Arabic RTL text processing
- Unified interface for Iraqi AI agents
- Fallback strategies for production reliability
"""

from typing import TYPE_CHECKING

# Lightweight imports for common usage
from .base import BaseChatModel
from .messages import (
    AssistantMessage,
    BaseMessage,
    SystemMessage,
    UserMessage,
)
from .messages import (
    ContentPartImageParam as ContentImage,
)
from .messages import (
    ContentPartRefusalParam as ContentRefusal,
)
from .messages import (
    ContentPartTextParam as ContentText,
)

# Iraqi AI integration
from .iraqi_provider import IraqiAIChatModel

# Type stubs for lazy imports
if TYPE_CHECKING:
    from .anthropic.chat import ChatAnthropic
    from .aws.chat_anthropic import ChatAnthropicBedrock
    from .aws.chat_bedrock import ChatAWSBedrock
    from .azure.chat import ChatAzureOpenAI
    from .deepseek.chat import ChatDeepSeek
    from .google.chat import ChatGoogle
    from .groq.chat import ChatGroq
    from .ollama.chat import ChatOllama
    from .openai.chat import ChatOpenAI
    from .openrouter.chat import ChatOpenRouter

# Lazy imports mapping for heavy chat models
_LAZY_IMPORTS = {
    "ChatAnthropic": (
        "enhanced_browser_use_extracted.llm.anthropic.chat",
        "ChatAnthropic",
    ),
    "ChatAnthropicBedrock": (
        "enhanced_browser_use_extracted.llm.aws.chat_anthropic",
        "ChatAnthropicBedrock",
    ),
    "ChatAWSBedrock": (
        "enhanced_browser_use_extracted.llm.aws.chat_bedrock",
        "ChatAWSBedrock",
    ),
    "ChatAzureOpenAI": (
        "enhanced_browser_use_extracted.llm.azure.chat",
        "ChatAzureOpenAI",
    ),
    "ChatDeepSeek": (
        "enhanced_browser_use_extracted.llm.deepseek.chat",
        "ChatDeepSeek",
    ),
    "ChatGoogle": ("enhanced_browser_use_extracted.llm.google.chat", "ChatGoogle"),
    "ChatGroq": ("enhanced_browser_use_extracted.llm.groq.chat", "ChatGroq"),
    "ChatOllama": ("enhanced_browser_use_extracted.llm.ollama.chat", "ChatOllama"),
    "ChatOpenAI": ("enhanced_browser_use_extracted.llm.openai.chat", "ChatOpenAI"),
    "ChatOpenRouter": (
        "enhanced_browser_use_extracted.llm.openrouter.chat",
        "ChatOpenRouter",
    ),
}


def __getattr__(name: str):
    """Lazy import mechanism for heavy chat model imports."""
    if name in _LAZY_IMPORTS:
        module_path, attr_name = _LAZY_IMPORTS[name]
        try:
            from importlib import import_module

            module = import_module(module_path)
            attr = getattr(module, attr_name)
            # Cache the imported attribute in the module's globals
            globals()[name] = attr
            return attr
        except ImportError as e:
            # Fallback to original browser-use import for compatibility
            try:
                original_path = module_path.replace(
                    "enhanced_browser_use_extracted.llm", "browser_use.llm"
                )
                module = import_module(original_path)
                attr = getattr(module, attr_name)
                globals()[name] = attr
                return attr
            except ImportError:
                raise ImportError(
                    f"Failed to import {name} from {module_path}: {e}"
                ) from e

    raise AttributeError(f"module '{__name__}' has no attribute '{name}'")


__all__ = [
    # Message types
    "BaseMessage",
    "UserMessage",
    "SystemMessage",
    "AssistantMessage",
    # Content parts
    "ContentText",
    "ContentRefusal",
    "ContentImage",
    # Chat models
    "BaseChatModel",
    "IraqiAIChatModel",  # Iraqi AI integration
    "ChatOpenAI",
    "ChatDeepSeek",
    "ChatGoogle",
    "ChatAnthropic",
    "ChatAnthropicBedrock",
    "ChatAWSBedrock",
    "ChatGroq",
    "ChatAzureOpenAI",
    "ChatOllama",
    "ChatOpenRouter",
]
