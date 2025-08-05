"""
Skyvern WebEye - AI-Powered Browser Automation Engine

This module provides advanced browser automation capabilities using computer vision
and Large Language Models to interact with websites dynamically.

Key Features:
- Vision-based element detection and interaction
- Dynamic adaptation to website layout changes  
- Arabic RTL text handling and Iraqi cultural validation
- Complex form filling with government portal support
- Multi-step workflow execution with error recovery

Iraqi Enhancements:
- Arabic text recognition and RTL layout handling
- Iraqi government portal element detection patterns
- Cultural form validation and Islamic compliance
- Iraqi business hours and government schedule awareness
"""

from .browser_factory import IraqiBrowserFactory
from .actions.handler import IraqiActionHandler
from .actions.elements import ArabicElementDetector
from .vision.processor import ArabicVisionProcessor

__all__ = [
    'IraqiBrowserFactory',
    'IraqiActionHandler', 
    'ArabicElementDetector',
    'ArabicVisionProcessor'
]

__version__ = "1.0.0-iraqi"