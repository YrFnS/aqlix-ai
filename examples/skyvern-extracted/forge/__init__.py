"""
Skyvern Forge - Enterprise Workflow Engine for Iraqi AI Chat System

The Forge module provides enterprise-grade workflow orchestration, task management,
and integration capabilities optimized for Iraqi government and business processes.

Key Components:
- SDK: Core workflow engine and task management
- API: RESTful endpoints for workflow management
- Services: Authentication, security, and integration services

Iraqi Enhancements:
- Islamic compliance validation and audit trails
- Arabic workflow templates and cultural validation
- Iraqi government portal integration patterns
- Multi-ministry coordination and approval workflows
"""

from .sdk import IraqiWorkflowEngine, IraqiTaskManager
from .api import IraqiWorkflowAPI
from .services import IraqiAuthService, IraqiAuditService

__all__ = [
    'IraqiWorkflowEngine',
    'IraqiTaskManager', 
    'IraqiWorkflowAPI',
    'IraqiAuthService',
    'IraqiAuditService'
]

__version__ = "1.0.0-iraqi"