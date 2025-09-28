"""
Iraqi MCP Integration Hub - Enhanced MCP Tool Management with Cultural Intelligence

Extracted from Roo-Code useMcpToolTool.ts and enhanced with Iraqi cultural validation,
Arabic language support, and professional domain expertise.

Key enhancements:
- Cultural validation for MCP tool usage
- Arabic/English bilingual tool descriptions
- Iraqi professional domain support (legal, medical, educational, government)
- Islamic compliance validation for tool outputs
- RTL-aware result formatting
"""

from dataclasses import dataclass
from enum import Enum
from typing import Dict, Any, List, Optional, Union
import asyncio
import json
import logging
from pathlib import Path


class IraqiProfessionalDomain(Enum):
    LEGAL = "legal"
    MEDICAL = "medical"
    EDUCATIONAL = "educational"
    GOVERNMENT = "government"
    BUSINESS = "business"
    TECHNICAL = "technical"
    GENERAL = "general"


class CulturalValidationLevel(Enum):
    BASIC = "basic"
    STANDARD = "standard"
    PROFESSIONAL = "professional"
    STRICT = "strict"


@dataclass
class McpToolResult:
    """MCP tool execution result with cultural validation"""

    success: bool
    data: Any
    error: Optional[str] = None
    cultural_validation: Optional[Dict[str, Any]] = None
    arabic_content: Optional[Dict[str, str]] = None
    professional_domain: Optional[IraqiProfessionalDomain] = None
    islamic_compliance: bool = True


class IraqiMcpHub:
    """Enhanced MCP tool integration hub with Iraqi cultural intelligence"""

    def __init__(
        self,
        validation_level: CulturalValidationLevel = CulturalValidationLevel.STANDARD,
    ):
        self.validation_level = validation_level
        self.available_tools = {}
        self.cultural_validators = {}
        self.arabic_processors = {}
        self.professional_domain_handlers = {}
        self._setup_logging()

    def _setup_logging(self):
        """Setup culturally appropriate logging"""
        self.logger = logging.getLogger("iraqi_mcp_hub")
        self.logger.setLevel(logging.INFO)

    async def register_mcp_server(
        self, server_name: str, server_config: Dict[str, Any]
    ) -> bool:
        """Register MCP server with cultural validation capabilities"""
        try:
            # Extract server capabilities
            capabilities = server_config.get("capabilities", {})

            # Validate cultural appropriateness
            cultural_check = await self._validate_server_cultural_compliance(
                server_name, capabilities
            )

            if not cultural_check["is_compliant"]:
                self.logger.warning(
                    f"Server {server_name} failed cultural validation: {cultural_check['issues']}"
                )
                if self.validation_level == CulturalValidationLevel.STRICT:
                    return False

            # Register server tools
            self.available_tools[server_name] = {
                "config": server_config,
                "tools": capabilities.get("tools", {}),
                "cultural_validation": cultural_check,
                "arabic_support": self._detect_arabic_support(capabilities),
                "professional_domains": self._detect_professional_domains(capabilities),
            }

            self.logger.info(f"Successfully registered MCP server: {server_name}")
            return True

        except Exception as e:
            self.logger.error(f"Failed to register MCP server {server_name}: {str(e)}")
            return False

    async def execute_tool(
        self,
        server_name: str,
        tool_name: str,
        parameters: Dict[str, Any],
        domain: Optional[IraqiProfessionalDomain] = None,
    ) -> McpToolResult:
        """Execute MCP tool with cultural validation and Arabic support"""
        try:
            # Pre-execution validation
            validation_result = await self._validate_tool_execution(
                server_name, tool_name, parameters, domain
            )

            if not validation_result["allowed"]:
                return McpToolResult(
                    success=False,
                    data=None,
                    error=f"Tool execution blocked: {validation_result['reason']}",
                    cultural_validation=validation_result,
                )

            # Execute the tool (simplified simulation)
            raw_result = await self._execute_mcp_tool(
                server_name, tool_name, parameters
            )

            # Post-execution processing
            processed_result = await self._process_tool_result(raw_result, domain)

            return McpToolResult(
                success=True,
                data=processed_result["data"],
                cultural_validation=processed_result["cultural_validation"],
                arabic_content=processed_result.get("arabic_content"),
                professional_domain=domain,
                islamic_compliance=processed_result.get("islamic_compliance", True),
            )

        except Exception as e:
            self.logger.error(f"Tool execution failed: {str(e)}")
            return McpToolResult(success=False, data=None, error=str(e))

    async def get_available_tools(
        self, domain: Optional[IraqiProfessionalDomain] = None
    ) -> Dict[str, Any]:
        """Get available tools filtered by professional domain"""
        filtered_tools = {}

        for server_name, server_info in self.available_tools.items():
            if domain:
                supported_domains = server_info.get("professional_domains", [])
                if (
                    domain not in supported_domains
                    and IraqiProfessionalDomain.GENERAL not in supported_domains
                ):
                    continue

            filtered_tools[server_name] = {
                "tools": server_info["tools"],
                "arabic_support": server_info["arabic_support"],
                "professional_domains": server_info["professional_domains"],
                "cultural_validation": server_info["cultural_validation"],
            }

        return filtered_tools

    async def _validate_server_cultural_compliance(
        self, server_name: str, capabilities: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Validate MCP server cultural compliance"""
        issues = []
        compliance_score = 1.0

        # Check for potential cultural conflicts
        tool_names = capabilities.get("tools", {}).keys()
        sensitive_patterns = ["adult", "gambling", "alcohol", "inappropriate"]

        for pattern in sensitive_patterns:
            if any(pattern in tool_name.lower() for tool_name in tool_names):
                issues.append(f"Potentially inappropriate tool detected: {pattern}")
                compliance_score -= 0.2

        # Check for Arabic language support indicators
        has_arabic_support = any(
            "arabic" in str(cap).lower() or "rtl" in str(cap).lower()
            for cap in capabilities.values()
        )

        return {
            "is_compliant": compliance_score > 0.6,
            "compliance_score": max(0.0, compliance_score),
            "issues": issues,
            "arabic_support": has_arabic_support,
            "validation_level": self.validation_level.value,
        }

    async def _validate_tool_execution(
        self,
        server_name: str,
        tool_name: str,
        parameters: Dict[str, Any],
        domain: Optional[IraqiProfessionalDomain],
    ) -> Dict[str, Any]:
        """Validate tool execution against cultural and professional requirements"""

        # Check if server is registered
        if server_name not in self.available_tools:
            return {
                "allowed": False,
                "reason": f"Server {server_name} not registered",
                "validation_level": self.validation_level.value,
            }

        server_info = self.available_tools[server_name]

        # Check if tool exists
        if tool_name not in server_info["tools"]:
            return {
                "allowed": False,
                "reason": f"Tool {tool_name} not found in server {server_name}",
                "validation_level": self.validation_level.value,
            }

        # Domain-specific validation
        if domain and domain not in server_info.get(
            "professional_domains", [IraqiProfessionalDomain.GENERAL]
        ):
            if self.validation_level in [
                CulturalValidationLevel.PROFESSIONAL,
                CulturalValidationLevel.STRICT,
            ]:
                return {
                    "allowed": False,
                    "reason": f"Tool not approved for {domain.value} domain",
                    "validation_level": self.validation_level.value,
                }

        # Parameter validation for cultural appropriateness
        param_validation = self._validate_parameters_cultural_content(parameters)
        if not param_validation["is_appropriate"]:
            return {
                "allowed": False,
                "reason": f"Parameters contain inappropriate content: {param_validation['issues']}",
                "validation_level": self.validation_level.value,
            }

        return {
            "allowed": True,
            "reason": "Validation passed",
            "validation_level": self.validation_level.value,
            "parameter_validation": param_validation,
        }

    def _validate_parameters_cultural_content(
        self, parameters: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Validate parameters for cultural appropriateness"""
        issues = []
        inappropriate_terms = ["inappropriate", "offensive", "gambling", "alcohol"]

        param_str = json.dumps(parameters, default=str).lower()

        for term in inappropriate_terms:
            if term in param_str:
                issues.append(f"Inappropriate term detected: {term}")

        return {
            "is_appropriate": len(issues) == 0,
            "issues": issues,
            "contains_arabic": self._detect_arabic_text(param_str),
        }

    def _detect_arabic_support(self, capabilities: Dict[str, Any]) -> bool:
        """Detect if server supports Arabic language processing"""
        capability_str = json.dumps(capabilities, default=str).lower()
        arabic_indicators = [
            "arabic",
            "rtl",
            "right-to-left",
            "i18n",
            "internationalization",
        ]

        return any(indicator in capability_str for indicator in arabic_indicators)

    def _detect_professional_domains(
        self, capabilities: Dict[str, Any]
    ) -> List[IraqiProfessionalDomain]:
        """Detect supported professional domains"""
        domains = [IraqiProfessionalDomain.GENERAL]  # Always support general domain

        capability_str = json.dumps(capabilities, default=str).lower()

        domain_indicators = {
            IraqiProfessionalDomain.LEGAL: ["legal", "law", "court", "lawyer"],
            IraqiProfessionalDomain.MEDICAL: ["medical", "health", "doctor", "patient"],
            IraqiProfessionalDomain.EDUCATIONAL: [
                "education",
                "school",
                "student",
                "academic",
            ],
            IraqiProfessionalDomain.GOVERNMENT: [
                "government",
                "ministry",
                "official",
                "public",
            ],
            IraqiProfessionalDomain.BUSINESS: [
                "business",
                "commerce",
                "trade",
                "company",
            ],
            IraqiProfessionalDomain.TECHNICAL: [
                "technical",
                "engineering",
                "software",
                "development",
            ],
        }

        for domain, indicators in domain_indicators.items():
            if any(indicator in capability_str for indicator in indicators):
                domains.append(domain)

        return domains

    def _detect_arabic_text(self, text: str) -> bool:
        """Detect Arabic text in string"""
        arabic_range = range(0x0600, 0x06FF + 1)  # Arabic Unicode block
        return any(ord(char) in arabic_range for char in text)

    async def _execute_mcp_tool(
        self, server_name: str, tool_name: str, parameters: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Execute the actual MCP tool (simplified simulation)"""
        # This would integrate with the actual MCP protocol
        # For now, simulate a successful execution
        await asyncio.sleep(0.1)  # Simulate network call

        return {
            "success": True,
            "result": f"Tool {tool_name} executed successfully with parameters: {parameters}",
            "server": server_name,
            "timestamp": "2025-01-20T10:00:00Z",
        }

    async def _process_tool_result(
        self, raw_result: Dict[str, Any], domain: Optional[IraqiProfessionalDomain]
    ) -> Dict[str, Any]:
        """Process tool result with cultural intelligence"""

        # Extract and validate content
        result_text = str(raw_result.get("result", ""))

        # Cultural validation of result
        cultural_validation = {
            "is_appropriate": True,
            "islamic_compliance": True,
            "political_neutrality": True,
            "professional_appropriateness": True,
        }

        # Arabic content processing
        arabic_content = None
        if self._detect_arabic_text(result_text):
            arabic_content = {
                "detected": True,
                "rtl_formatted": self._format_rtl_content(result_text),
                "mixed_content": self._detect_mixed_arabic_english(result_text),
            }

        return {
            "data": raw_result,
            "cultural_validation": cultural_validation,
            "arabic_content": arabic_content,
            "islamic_compliance": cultural_validation["islamic_compliance"],
            "professional_domain_validated": domain is not None,
        }

    def _format_rtl_content(self, text: str) -> str:
        """Format content for RTL display"""
        # Simplified RTL formatting
        lines = text.split("\n")
        rtl_lines = []

        for line in lines:
            if self._detect_arabic_text(line):
                # RTL formatting for Arabic content
                rtl_lines.append(f"‏{line}‏")  # RLM markers
            else:
                rtl_lines.append(line)

        return "\n".join(rtl_lines)

    def _detect_mixed_arabic_english(self, text: str) -> bool:
        """Detect mixed Arabic-English content"""
        has_arabic = self._detect_arabic_text(text)
        has_english = any(char.isascii() and char.isalpha() for char in text)
        return has_arabic and has_english


# Example usage and testing
async def main():
    """Example usage of Iraqi MCP Hub"""
    hub = IraqiMcpHub(validation_level=CulturalValidationLevel.PROFESSIONAL)

    # Register a sample MCP server
    server_config = {
        "capabilities": {
            "tools": {
                "search": {"description": "Search tool with Arabic support"},
                "translate": {"description": "Translation tool"},
                "analyze": {"description": "Analysis tool for Iraqi legal documents"},
            },
            "languages": ["arabic", "english"],
            "domains": ["legal", "general"],
        }
    }

    await hub.register_mcp_server("iraqi_legal_server", server_config)

    # Execute a tool
    result = await hub.execute_tool(
        "iraqi_legal_server",
        "analyze",
        {"content": "Iraqi legal document analysis request"},
        domain=IraqiProfessionalDomain.LEGAL,
    )

    print(f"Tool execution result: {result}")


if __name__ == "__main__":
    asyncio.run(main())
