"""
Tool Integration System - Iraqi Enhanced
========================================

Extracted and enhanced tool integration patterns from Google's Agent Development Kit,
specifically adapted for Iraqi cultural contexts and Islamic compliance.

Based on ADK patterns from:
- src/google/adk/tools/tool_registry.py
- src/google/adk/tools/tool_integration.py
- src/google/adk/tools/mcp_integration.py
"""

from typing import Dict, List, Optional, Any, Union, Callable, Type
from dataclasses import dataclass, field
from abc import ABC, abstractmethod
import asyncio
import json
from enum import Enum
import time
from collections import defaultdict

# Import cultural capabilities
from .cultural import CulturalMixin, IslamicComplianceMixin, ArabicLanguageMixin


class ToolCategory(Enum):
    """Categories for Iraqi AI tools"""

    CULTURAL_VALIDATION = "cultural_validation"
    ARABIC_PROCESSING = "arabic_processing"
    PROFESSIONAL_DOMAIN = "professional_domain"
    PAYMENT_PROCESSING = "payment_processing"
    SECURITY_VALIDATION = "security_validation"
    UI_GENERATION = "ui_generation"
    DATA_ANALYSIS = "data_analysis"
    DOCUMENTATION = "documentation"
    TESTING = "testing"
    MONITORING = "monitoring"


class ToolPriority(Enum):
    """Priority levels for tool execution"""

    CRITICAL = "critical"  # Cultural compliance, security
    HIGH = "high"  # Professional domains, Arabic processing
    MEDIUM = "medium"  # UI generation, documentation
    LOW = "low"  # Monitoring, analytics
    BACKGROUND = "background"  # Performance tracking


@dataclass
class IraqiToolConfig:
    """Configuration for Iraqi AI tools"""

    # Basic tool information
    name: str
    description: str = ""
    category: ToolCategory = ToolCategory.DATA_ANALYSIS
    priority: ToolPriority = ToolPriority.MEDIUM

    # Cultural requirements
    cultural_compliance_required: bool = True
    islamic_principles_validation: bool = True
    arabic_content_support: bool = False

    # Performance settings
    timeout_seconds: int = 30
    max_retries: int = 3
    enable_caching: bool = True
    cache_ttl_seconds: int = 3600

    # Integration settings
    mcp_server_required: Optional[str] = None
    dependencies: List[str] = field(default_factory=list)
    required_permissions: List[str] = field(default_factory=list)


class IraqiTool(ABC):
    """Base class for Iraqi AI tools"""

    def __init__(self, config: IraqiToolConfig):
        self.config = config
        self.execution_history = []
        self.performance_metrics = defaultdict(list)

    @abstractmethod
    async def execute(
        self, input_data: Any, context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Execute the tool with given input"""
        pass

    @abstractmethod
    async def validate_input(self, input_data: Any) -> Dict[str, Any]:
        """Validate tool input"""
        pass

    async def pre_execution_hook(
        self, input_data: Any, context: Optional[Dict[str, Any]] = None
    ) -> None:
        """Hook called before tool execution"""
        pass

    async def post_execution_hook(
        self, result: Dict[str, Any], context: Optional[Dict[str, Any]] = None
    ) -> None:
        """Hook called after tool execution"""
        pass


class CulturalValidationTool(IraqiTool, CulturalMixin):
    """Tool for validating Iraqi cultural appropriateness"""

    def __init__(self):
        config = IraqiToolConfig(
            name="cultural_validation_tool",
            description="Validates content for Iraqi cultural appropriateness and Islamic compliance",
            category=ToolCategory.CULTURAL_VALIDATION,
            priority=ToolPriority.CRITICAL,
            cultural_compliance_required=True,
            islamic_principles_validation=True,
        )
        super().__init__(config)
        CulturalMixin.__init__(self)

    async def validate_input(self, input_data: Any) -> Dict[str, Any]:
        """Validate cultural validation input"""
        if not input_data:
            return {"valid": False, "error": "No input data provided"}

        return {"valid": True}

    async def execute(
        self, input_data: Any, context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Execute cultural validation"""
        start_time = time.time()

        try:
            # Validate input
            input_validation = await self.validate_input(input_data)
            if not input_validation["valid"]:
                return {
                    "status": "error",
                    "error": input_validation["error"],
                    "tool": self.config.name,
                }

            # Perform cultural assessment
            cultural_assessment = await self.assess_cultural_appropriateness(input_data)

            # Islamic compliance check
            islamic_compliance = await self.assess_islamic_compliance(input_data)

            # Professional context validation
            professional_validation = await self.validate_professional_context(
                input_data
            )

            # Compile results
            result = {
                "status": "success",
                "tool": self.config.name,
                "cultural_assessment": cultural_assessment,
                "islamic_compliance": islamic_compliance,
                "professional_validation": professional_validation,
                "overall_compliance": (
                    cultural_assessment["overall_score"] >= 0.95
                    and islamic_compliance["compliant"]
                    and professional_validation["appropriate"]
                ),
                "execution_time": time.time() - start_time,
            }

            # Record performance
            self.performance_metrics["execution_time"].append(result["execution_time"])
            self.performance_metrics["compliance_rate"].append(
                1.0 if result["overall_compliance"] else 0.0
            )

            return result

        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "tool": self.config.name,
                "execution_time": time.time() - start_time,
            }

    async def validate_professional_context(self, content: Any) -> Dict[str, Any]:
        """Validate professional domain context"""
        # Placeholder for professional context validation
        return {"appropriate": True, "domain": "general", "confidence": 0.95}


class ArabicProcessingTool(IraqiTool, ArabicLanguageMixin):
    """Tool for processing Arabic text with RTL support"""

    def __init__(self):
        config = IraqiToolConfig(
            name="arabic_processing_tool",
            description="Processes Arabic text with RTL layout and Iraqi dialect support",
            category=ToolCategory.ARABIC_PROCESSING,
            priority=ToolPriority.HIGH,
            arabic_content_support=True,
        )
        super().__init__(config)
        ArabicLanguageMixin.__init__(self)

    async def validate_input(self, input_data: Any) -> Dict[str, Any]:
        """Validate Arabic processing input"""
        if not input_data:
            return {"valid": False, "error": "No input data provided"}

        text = str(input_data)
        contains_arabic = any("\u0600" <= char <= "\u06ff" for char in text)

        return {
            "valid": True,
            "contains_arabic": contains_arabic,
            "text_length": len(text),
        }

    async def execute(
        self, input_data: Any, context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Execute Arabic text processing"""
        start_time = time.time()

        try:
            # Validate input
            input_validation = await self.validate_input(input_data)
            if not input_validation["valid"]:
                return {
                    "status": "error",
                    "error": input_validation["error"],
                    "tool": self.config.name,
                }

            text = str(input_data)

            # Process Arabic content
            if input_validation["contains_arabic"]:
                # RTL layout processing
                rtl_processed = await self.process_rtl_layout(text)

                # Iraqi dialect detection
                dialect_analysis = await self.analyze_iraqi_dialect(text)

                # Mixed content handling
                mixed_content = await self.handle_mixed_arabic_english(text)

                result = {
                    "status": "success",
                    "tool": self.config.name,
                    "original_text": text,
                    "rtl_processed": rtl_processed,
                    "dialect_analysis": dialect_analysis,
                    "mixed_content_processed": mixed_content,
                    "contains_arabic": True,
                    "execution_time": time.time() - start_time,
                }
            else:
                result = {
                    "status": "success",
                    "tool": self.config.name,
                    "original_text": text,
                    "contains_arabic": False,
                    "processing_required": False,
                    "execution_time": time.time() - start_time,
                }

            # Record performance
            self.performance_metrics["execution_time"].append(result["execution_time"])
            self.performance_metrics["arabic_detection_rate"].append(
                1.0 if result["contains_arabic"] else 0.0
            )

            return result

        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "tool": self.config.name,
                "execution_time": time.time() - start_time,
            }


class ProfessionalDomainTool(IraqiTool):
    """Tool for processing Iraqi professional domain content"""

    def __init__(self, domain: str = "general"):
        config = IraqiToolConfig(
            name=f"professional_{domain}_tool",
            description=f"Processes {domain} professional domain content for Iraqi context",
            category=ToolCategory.PROFESSIONAL_DOMAIN,
            priority=ToolPriority.HIGH,
        )
        super().__init__(config)
        self.domain = domain

        # Domain-specific knowledge bases
        self.domain_patterns = {
            "legal": ["قانون", "محكمة", "قاض", "law", "court", "judge"],
            "medical": ["طبيب", "مستشفى", "صحة", "doctor", "hospital", "health"],
            "educational": [
                "مدرسة",
                "جامعة",
                "تعليم",
                "school",
                "university",
                "education",
            ],
        }

    async def validate_input(self, input_data: Any) -> Dict[str, Any]:
        """Validate professional domain input"""
        if not input_data:
            return {"valid": False, "error": "No input data provided"}

        text = str(input_data).lower()
        domain_relevance = 0.0

        if self.domain in self.domain_patterns:
            patterns = self.domain_patterns[self.domain]
            matches = sum(1 for pattern in patterns if pattern in text)
            domain_relevance = matches / len(patterns)

        return {
            "valid": True,
            "domain_relevance": domain_relevance,
            "detected_domain": self.domain if domain_relevance > 0.2 else "general",
        }

    async def execute(
        self, input_data: Any, context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Execute professional domain processing"""
        start_time = time.time()

        try:
            # Validate input
            input_validation = await self.validate_input(input_data)
            if not input_validation["valid"]:
                return {
                    "status": "error",
                    "error": input_validation["error"],
                    "tool": self.config.name,
                }

            # Process professional domain content
            domain_analysis = {
                "domain": self.domain,
                "relevance_score": input_validation["domain_relevance"],
                "detected_domain": input_validation["detected_domain"],
                "professional_compliance": input_validation["domain_relevance"] > 0.5,
                "recommendations": [],
            }

            if domain_analysis["professional_compliance"]:
                domain_analysis["recommendations"].append(
                    f"Content is appropriate for {self.domain} domain"
                )
            else:
                domain_analysis["recommendations"].append(
                    f"Content may not be suitable for {self.domain} domain"
                )

            result = {
                "status": "success",
                "tool": self.config.name,
                "domain_analysis": domain_analysis,
                "execution_time": time.time() - start_time,
            }

            # Record performance
            self.performance_metrics["execution_time"].append(result["execution_time"])
            self.performance_metrics["domain_relevance"].append(
                domain_analysis["relevance_score"]
            )

            return result

        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "tool": self.config.name,
                "execution_time": time.time() - start_time,
            }


class IraqiToolIntegration:
    """Main tool integration system for Iraqi agents"""

    def __init__(self):
        self.tools: Dict[str, IraqiTool] = {}
        self.tool_categories: Dict[ToolCategory, List[str]] = defaultdict(list)
        self.execution_queue = asyncio.Queue()
        self.performance_tracker = ToolPerformanceTracker()

        # Register default tools
        self._register_default_tools()

    def _register_default_tools(self) -> None:
        """Register default Iraqi AI tools"""
        # Cultural validation tool
        cultural_tool = CulturalValidationTool()
        self.register_tool(cultural_tool)

        # Arabic processing tool
        arabic_tool = ArabicProcessingTool()
        self.register_tool(arabic_tool)

        # Professional domain tools
        for domain in ["legal", "medical", "educational"]:
            professional_tool = ProfessionalDomainTool(domain)
            self.register_tool(professional_tool)

    def register_tool(self, tool: IraqiTool) -> None:
        """Register a tool with the integration system"""
        self.tools[tool.config.name] = tool
        self.tool_categories[tool.config.category].append(tool.config.name)

    def unregister_tool(self, tool_name: str) -> None:
        """Remove a tool from the integration system"""
        if tool_name in self.tools:
            tool = self.tools[tool_name]
            self.tool_categories[tool.config.category].remove(tool_name)
            del self.tools[tool_name]

    async def execute_tool(
        self, tool_name: str, input_data: Any, context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Execute a specific tool"""
        if tool_name not in self.tools:
            return {
                "status": "error",
                "error": f"Tool '{tool_name}' not found",
                "available_tools": list(self.tools.keys()),
            }

        tool = self.tools[tool_name]

        try:
            # Execute tool with hooks
            await tool.pre_execution_hook(input_data, context)
            result = await tool.execute(input_data, context)
            await tool.post_execution_hook(result, context)

            # Track performance
            self.performance_tracker.record_execution(
                tool_name,
                result.get("execution_time", 0),
                result.get("status") == "success",
            )

            return result

        except Exception as e:
            return {
                "status": "error",
                "error": f"Tool execution failed: {str(e)}",
                "tool": tool_name,
            }

    async def execute_tools_by_category(
        self,
        category: ToolCategory,
        input_data: Any,
        context: Optional[Dict[str, Any]] = None,
        parallel: bool = False,
    ) -> Dict[str, Any]:
        """Execute all tools in a category"""
        tool_names = self.tool_categories.get(category, [])

        if not tool_names:
            return {
                "status": "error",
                "error": f"No tools found for category '{category.value}'",
                "category": category.value,
            }

        if parallel:
            # Execute tools in parallel
            tasks = []
            for tool_name in tool_names:
                task = self.execute_tool(tool_name, input_data, context)
                tasks.append(task)

            results = await asyncio.gather(*tasks, return_exceptions=True)

            # Process results
            tool_results = {}
            errors = []

            for i, result in enumerate(results):
                if isinstance(result, Exception):
                    errors.append(f"Tool {tool_names[i]}: {str(result)}")
                else:
                    tool_results[tool_names[i]] = result

            return {
                "status": "success" if tool_results else "error",
                "category": category.value,
                "tool_results": tool_results,
                "errors": errors if errors else None,
                "execution_mode": "parallel",
            }
        else:
            # Execute tools sequentially
            tool_results = {}

            for tool_name in tool_names:
                result = await self.execute_tool(tool_name, input_data, context)
                tool_results[tool_name] = result

            return {
                "status": "success",
                "category": category.value,
                "tool_results": tool_results,
                "execution_mode": "sequential",
            }

    async def execute_tool_chain(
        self,
        tool_chain: List[str],
        input_data: Any,
        context: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Execute tools in a specific chain/sequence"""
        results = []
        current_input = input_data

        for tool_name in tool_chain:
            result = await self.execute_tool(tool_name, current_input, context)
            results.append(result)

            if result.get("status") != "success":
                return {
                    "status": "error",
                    "error": f"Tool chain failed at {tool_name}",
                    "partial_results": results,
                    "failed_tool": tool_name,
                }

            # Chain output to next tool input (if available)
            if "processed_data" in result:
                current_input = result["processed_data"]

        return {
            "status": "success",
            "tool_chain": tool_chain,
            "results": results,
            "final_output": results[-1] if results else None,
        }

    def get_tools_by_category(self, category: ToolCategory) -> List[str]:
        """Get all tools in a specific category"""
        return self.tool_categories.get(category, [])

    def get_tool_info(self, tool_name: str) -> Optional[Dict[str, Any]]:
        """Get information about a specific tool"""
        if tool_name not in self.tools:
            return None

        tool = self.tools[tool_name]
        return {
            "name": tool.config.name,
            "description": tool.config.description,
            "category": tool.config.category.value,
            "priority": tool.config.priority.value,
            "cultural_compliance_required": tool.config.cultural_compliance_required,
            "arabic_content_support": tool.config.arabic_content_support,
            "performance_metrics": dict(tool.performance_metrics),
        }

    def get_system_status(self) -> Dict[str, Any]:
        """Get overall tool integration system status"""
        return {
            "total_tools": len(self.tools),
            "tools_by_category": {
                category.value: len(tools)
                for category, tools in self.tool_categories.items()
            },
            "available_tools": list(self.tools.keys()),
            "performance_summary": self.performance_tracker.get_summary(),
        }


class ToolPerformanceTracker:
    """Performance tracking for tool execution"""

    def __init__(self):
        self.execution_metrics = []
        self.tool_stats = defaultdict(list)

    def record_execution(
        self, tool_name: str, execution_time: float, success: bool
    ) -> None:
        """Record tool execution metrics"""
        metric = {
            "tool_name": tool_name,
            "execution_time": execution_time,
            "success": success,
            "timestamp": time.time(),
        }

        self.execution_metrics.append(metric)
        self.tool_stats[tool_name].append(metric)

    def get_summary(self) -> Dict[str, Any]:
        """Get performance summary"""
        if not self.execution_metrics:
            return {"status": "no_data"}

        total_executions = len(self.execution_metrics)
        successful_executions = len([m for m in self.execution_metrics if m["success"]])
        avg_execution_time = (
            sum(m["execution_time"] for m in self.execution_metrics) / total_executions
        )

        return {
            "total_executions": total_executions,
            "success_rate": successful_executions / total_executions,
            "average_execution_time": avg_execution_time,
            "tool_performance": self._get_tool_performance(),
        }

    def _get_tool_performance(self) -> Dict[str, Dict[str, float]]:
        """Get per-tool performance metrics"""
        performance = {}

        for tool_name, metrics in self.tool_stats.items():
            if not metrics:
                continue

            successful = [m for m in metrics if m["success"]]
            performance[tool_name] = {
                "success_rate": len(successful) / len(metrics),
                "average_execution_time": sum(m["execution_time"] for m in metrics)
                / len(metrics),
                "total_executions": len(metrics),
            }

        return performance
