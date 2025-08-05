"""
Browser Automation Agent System
Intelligent agents for web automation with Iraqi portal support
"""

from .browser_agent import BrowserAgent, AgentConfig, AgentTask
from .iraqi_portal_agent import IraqiPortalAgent, PortalType, ServiceType
from .form_automation_agent import FormAutomationAgent, FormTask
from .navigation_agent import NavigationAgent, NavigationStrategy
from .content_analysis_agent import ContentAnalysisAgent, AnalysisTask

__all__ = [
    'BrowserAgent',
    'AgentConfig',
    'AgentTask',
    'IraqiPortalAgent',
    'PortalType',
    'ServiceType',
    'FormAutomationAgent',
    'FormTask',
    'NavigationAgent',
    'NavigationStrategy',
    'ContentAnalysisAgent',
    'AnalysisTask'
]