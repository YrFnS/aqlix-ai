"""
Browser Engine for Iraqi AI Chat System
Extracted from browser-use with Iraqi portal optimizations
"""

from .browser import Browser, BrowserConfig
from .iraqi_browser import IraqiBrowser, IraqiPortalConfig
from .session_manager import SessionManager, IraqiSessionManager
from .capabilities import BrowserCapabilities, IraqiCapabilities

__all__ = [
    "Browser",
    "BrowserConfig", 
    "IraqiBrowser",
    "IraqiPortalConfig",
    "SessionManager",
    "IraqiSessionManager",
    "BrowserCapabilities",
    "IraqiCapabilities"
]