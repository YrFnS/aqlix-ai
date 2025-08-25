"""
Enhanced Iraqi MCP Server Package

This package provides an MCP (Model Context Protocol) server that integrates
browser-use capabilities with Iraqi AI agents for cultural validation, Arabic
processing, and professional domain expertise.

Components:
- server: Main MCP server with Iraqi enhancements
- iraqi_bridge: Bridge layer connecting to 22 Iraqi AI agents
- cultural validation tools
- Arabic RTL processing tools
- Professional domain integration

Usage:
    python -m enhanced_browser_use_extracted.mcp.server
    
    Or with Claude Desktop MCP integration:
    {
        "iraqi-browser-use": {
            "command": "python",
            "args": ["-m", "enhanced_browser_use_extracted.mcp.server"]
        }
    }
"""

from .server import IraqiEnhancedMcpServer
from .iraqi_bridge import IraqiAgentBridge, iraqi_bridge

__all__ = ['IraqiEnhancedMcpServer', 'IraqiAgentBridge', 'iraqi_bridge']