"""
Core ADK Agent Classes - Iraqi Enhanced
=======================================

Extracted and enhanced core agent classes from Google's Agent Development Kit,
specifically adapted for Iraqi cultural contexts and Islamic compliance.

Based on ADK patterns from:
- src/google/adk/agents/base_agent.py
- src/google/adk/agents/llm_agent.py
- src/google/adk/agents/agent_config.py
"""

from typing import Dict, List, Optional, Any, Union, Callable
from dataclasses import dataclass, field
from abc import ABC, abstractmethod
import asyncio
import json
from enum import Enum

# Cultural integration mixins
from .cultural import CulturalMixin, IslamicComplianceMixin, ArabicLanguageMixin


class AgentStatus(Enum):
    """Agent execution status states"""

    IDLE = "idle"
    PROCESSING = "processing"
    WAITING_FOR_INPUT = "waiting_for_input"
    DELEGATING = "delegating"
    VALIDATING_CULTURE = "validating_culture"
    ERROR = "error"
    COMPLETED = "completed"


@dataclass
class IraqiAgentConfig:
    """
    Configuration class for Iraqi-enhanced ADK agents

    Based on Google ADK agent_config.py but enhanced with Iraqi cultural requirements
    """

    # Core ADK configuration
    name: str
    description: str = ""
    instruction: str = ""
    model: str = "gemini-2.0-flash"

    # Iraqi cultural configuration
    cultural_compliance_required: bool = True
    cultural_score_threshold: float = 0.95
    islamic_principles_enabled: bool = True
    arabic_rtl_support: bool = True
    iraqi_dialect_processing: bool = True

    # Professional domain support
    professional_domains: List[str] = field(
        default_factory=lambda: ["legal", "medical", "educational"]
    )
    professional_context_validation: bool = True

    # Multi-agent configuration
    sub_agents: Optional[List["IraqiAgent"]] = None
    delegation_strategy: str = "llm_driven"  # "llm_driven", "rule_based", "hybrid"

    # Tool integration
    tools: Optional[List[Any]] = None
    mcp_servers_enabled: List[str] = field(
        default_factory=lambda: ["context7", "sequential", "magic"]
    )

    # Performance and monitoring
    max_response_time_ms: int = 300
    enable_telemetry: bool = True
    enable_cultural_monitoring: bool = True


class IraqiBaseAgent(ABC, CulturalMixin):
    """
    Base Iraqi agent class based on Google ADK BaseAgent

    Enhanced with Iraqi cultural awareness and Islamic compliance
    """

    def __init__(self, config: IraqiAgentConfig):
        """Initialize base Iraqi agent with cultural capabilities"""
        self.config = config
        self.status = AgentStatus.IDLE
        self.context = {}
        self.cultural_state = {}
        self.execution_history = []

        # Initialize cultural mixins
        CulturalMixin.__init__(self)

        # Set up cultural monitoring
        if config.enable_cultural_monitoring:
            self.cultural_monitor = CulturalMonitor(
                score_threshold=config.cultural_score_threshold,
                islamic_compliance=config.islamic_principles_enabled,
            )

    @abstractmethod
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process input with cultural awareness"""
        pass

    async def validate_cultural_compliance(self, content: Any) -> Dict[str, Any]:
        """Validate content against Iraqi cultural standards"""
        validation_result = {
            "is_compliant": True,
            "cultural_score": 1.0,
            "islamic_compliance": True,
            "professional_appropriateness": True,
            "recommendations": [],
        }

        # Cultural validation logic
        if self.config.cultural_compliance_required:
            cultural_score = await self.assess_cultural_appropriateness(content)
            validation_result["cultural_score"] = cultural_score
            validation_result["is_compliant"] = (
                cultural_score >= self.config.cultural_score_threshold
            )

        # Islamic compliance check
        if self.config.islamic_principles_enabled:
            islamic_compliance = await self.assess_islamic_compliance(content)
            validation_result["islamic_compliance"] = islamic_compliance
            validation_result["is_compliant"] &= islamic_compliance

        return validation_result

    async def delegate_to_sub_agent(
        self, task: Dict[str, Any], agent_name: str
    ) -> Dict[str, Any]:
        """Delegate task to specialized sub-agent"""
        if not self.config.sub_agents:
            raise ValueError("No sub-agents configured for delegation")

        # Find appropriate sub-agent
        sub_agent = self.find_sub_agent(agent_name)
        if not sub_agent:
            raise ValueError(f"Sub-agent '{agent_name}' not found")

        # Update status
        self.status = AgentStatus.DELEGATING

        # Delegate task with cultural context
        task_with_context = {
            **task,
            "cultural_context": self.cultural_state,
            "parent_agent": self.config.name,
            "delegation_time": asyncio.get_event_loop().time(),
        }

        # Process task through sub-agent
        result = await sub_agent.process(task_with_context)

        # Validate cultural compliance of result
        if self.config.cultural_compliance_required:
            cultural_validation = await self.validate_cultural_compliance(result)
            result["cultural_validation"] = cultural_validation

        self.status = AgentStatus.IDLE
        return result

    def find_sub_agent(self, agent_name: str) -> Optional["IraqiAgent"]:
        """Find sub-agent by name"""
        if not self.config.sub_agents:
            return None

        for agent in self.config.sub_agents:
            if agent.config.name == agent_name:
                return agent
        return None

    async def assess_cultural_appropriateness(self, content: Any) -> float:
        """Assess cultural appropriateness score (0.0 to 1.0)"""
        # Placeholder for cultural assessment logic
        # In production, this would integrate with cultural validation models
        return 0.95

    async def assess_islamic_compliance(self, content: Any) -> bool:
        """Assess Islamic principle compliance"""
        # Placeholder for Islamic compliance logic
        # In production, this would check against Islamic guidelines
        return True


class IraqiAgent(IraqiBaseAgent):
    """
    Main Iraqi agent class based on Google ADK Agent

    Provides complete agent functionality with cultural integration
    """

    def __init__(
        self,
        name: str,
        description: str = "",
        instruction: str = "",
        model: str = "gemini-2.0-flash",
        tools: Optional[List[Any]] = None,
        sub_agents: Optional[List["IraqiAgent"]] = None,
        cultural_compliance_required: bool = True,
        **kwargs,
    ):
        """Initialize Iraqi agent with simplified interface"""
        config = IraqiAgentConfig(
            name=name,
            description=description,
            instruction=instruction,
            model=model,
            tools=tools or [],
            sub_agents=sub_agents or [],
            cultural_compliance_required=cultural_compliance_required,
            **kwargs,
        )
        super().__init__(config)

        # Initialize tool integration
        self.tools = tools or []
        self.tool_registry = {}
        self._register_tools()

    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process input with full Iraqi cultural awareness"""
        self.status = AgentStatus.PROCESSING

        try:
            # Pre-process cultural validation
            if self.config.cultural_compliance_required:
                cultural_validation = await self.validate_cultural_compliance(
                    input_data
                )
                if not cultural_validation["is_compliant"]:
                    return {
                        "status": "error",
                        "error": "Cultural compliance validation failed",
                        "cultural_validation": cultural_validation,
                    }

            # Determine processing strategy
            if self.config.sub_agents and self._should_delegate(input_data):
                # Multi-agent processing
                result = await self._process_with_delegation(input_data)
            else:
                # Single agent processing
                result = await self._process_single_agent(input_data)

            # Post-process cultural validation
            if self.config.cultural_compliance_required:
                cultural_validation = await self.validate_cultural_compliance(result)
                result["cultural_validation"] = cultural_validation

                if not cultural_validation["is_compliant"]:
                    result = await self._apply_cultural_corrections(
                        result, cultural_validation
                    )

            self.status = AgentStatus.COMPLETED
            return result

        except Exception as e:
            self.status = AgentStatus.ERROR
            return {"status": "error", "error": str(e), "agent": self.config.name}

    async def _process_single_agent(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process input with single agent"""
        # Integrate with LLM (placeholder for actual LLM integration)
        response = await self._call_llm(input_data)

        # Tool integration if needed
        if self.tools and self._requires_tool_use(response):
            tool_results = await self._execute_tools(response)
            response = await self._integrate_tool_results(response, tool_results)

        return {
            "status": "success",
            "response": response,
            "agent": self.config.name,
            "processing_type": "single_agent",
        }

    async def _process_with_delegation(
        self, input_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Process input with multi-agent delegation"""
        # Determine delegation strategy
        delegation_plan = await self._create_delegation_plan(input_data)

        # Execute delegation plan
        results = []
        for task in delegation_plan:
            result = await self.delegate_to_sub_agent(task["content"], task["agent"])
            results.append(result)

        # Synthesize results
        final_result = await self._synthesize_delegation_results(results)

        return {
            "status": "success",
            "response": final_result,
            "agent": self.config.name,
            "processing_type": "multi_agent",
            "delegation_results": results,
        }

    def _should_delegate(self, input_data: Dict[str, Any]) -> bool:
        """Determine if input should be delegated to sub-agents"""
        # Simple delegation logic - can be enhanced
        if not self.config.sub_agents:
            return False

        # Check for cultural validation needs
        if "cultural_validation" in input_data.get("requirements", []):
            return True

        # Check for Arabic processing needs
        if self._contains_arabic_content(input_data):
            return True

        # Check for professional domain requirements
        if any(
            domain in str(input_data).lower()
            for domain in self.config.professional_domains
        ):
            return True

        return False

    async def _create_delegation_plan(
        self, input_data: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Create delegation plan for multi-agent processing"""
        plan = []

        # Cultural validation task
        if self._needs_cultural_validation(input_data):
            plan.append(
                {
                    "agent": "iraqi_cultural_validator",
                    "content": input_data,
                    "type": "cultural_validation",
                }
            )

        # Arabic processing task
        if self._contains_arabic_content(input_data):
            plan.append(
                {
                    "agent": "arabic_rtl_processor",
                    "content": input_data,
                    "type": "arabic_processing",
                }
            )

        # Professional domain task
        professional_domain = self._identify_professional_domain(input_data)
        if professional_domain:
            plan.append(
                {
                    "agent": f"professional_{professional_domain}_agent",
                    "content": input_data,
                    "type": "professional_domain",
                }
            )

        return plan

    def _register_tools(self):
        """Register tools in the tool registry"""
        for tool in self.tools:
            self.tool_registry[tool.name] = tool

    async def _call_llm(self, input_data: Dict[str, Any]) -> str:
        """Call LLM with cultural context (placeholder)"""
        # Placeholder for actual LLM integration
        return f"Processed by {self.config.name}: {json.dumps(input_data)}"

    def _requires_tool_use(self, response: str) -> bool:
        """Check if response requires tool usage"""
        # Placeholder logic
        return "tool:" in response.lower()

    async def _execute_tools(self, response: str) -> Dict[str, Any]:
        """Execute required tools"""
        # Placeholder for tool execution
        return {"tool_results": "executed"}

    async def _integrate_tool_results(
        self, response: str, tool_results: Dict[str, Any]
    ) -> str:
        """Integrate tool results into response"""
        return f"{response} | Tools: {json.dumps(tool_results)}"

    async def _synthesize_delegation_results(
        self, results: List[Dict[str, Any]]
    ) -> str:
        """Synthesize results from multiple agents"""
        return f"Multi-agent synthesis: {len(results)} agents processed"

    async def _apply_cultural_corrections(
        self, result: Dict[str, Any], validation: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Apply cultural corrections to result"""
        result["cultural_corrections_applied"] = True
        result["original_validation"] = validation
        return result

    def _contains_arabic_content(self, data: Any) -> bool:
        """Check if data contains Arabic content"""
        text = str(data)
        return any("\u0600" <= char <= "\u06ff" for char in text)

    def _needs_cultural_validation(self, data: Any) -> bool:
        """Check if data needs cultural validation"""
        return self.config.cultural_compliance_required

    def _identify_professional_domain(self, data: Any) -> Optional[str]:
        """Identify professional domain from data"""
        text = str(data).lower()
        for domain in self.config.professional_domains:
            if domain in text:
                return domain
        return None


class IraqiLlmAgent(IraqiAgent, IslamicComplianceMixin, ArabicLanguageMixin):
    """
    Advanced LLM-powered Iraqi agent based on Google ADK LlmAgent

    Enhanced with Islamic compliance and Arabic language processing
    """

    def __init__(
        self,
        name: str,
        model: str = "gemini-2.0-flash",
        instruction: str = "",
        **kwargs,
    ):
        """Initialize advanced LLM agent with cultural enhancements"""
        super().__init__(name=name, model=model, instruction=instruction, **kwargs)

        # Initialize Islamic compliance mixin
        IslamicComplianceMixin.__init__(self)

        # Initialize Arabic language mixin
        ArabicLanguageMixin.__init__(self)

        # Enhanced LLM configuration
        self.llm_config = {
            "model": model,
            "temperature": 0.7,
            "cultural_context_awareness": True,
            "islamic_principles_integration": True,
            "arabic_language_support": True,
        }

    async def _call_llm(self, input_data: Dict[str, Any]) -> str:
        """Enhanced LLM call with cultural context"""
        # Prepare culturally-aware prompt
        cultural_context = self._build_cultural_context()
        enhanced_instruction = self._enhance_instruction_with_culture(
            self.config.instruction
        )

        # Integrate Arabic language processing
        if self._contains_arabic_content(input_data):
            enhanced_instruction = self._add_arabic_processing_instructions(
                enhanced_instruction
            )

        # Add Islamic principle guidance
        if self.config.islamic_principles_enabled:
            enhanced_instruction = self._add_islamic_guidance(enhanced_instruction)

        # Placeholder for actual LLM call
        return f"Enhanced LLM response with cultural context: {json.dumps(input_data)}"

    def _build_cultural_context(self) -> Dict[str, Any]:
        """Build cultural context for LLM"""
        return {
            "iraqi_cultural_norms": True,
            "islamic_principles": self.config.islamic_principles_enabled,
            "arabic_language_support": self.config.arabic_rtl_support,
            "professional_domains": self.config.professional_domains,
        }

    def _enhance_instruction_with_culture(self, instruction: str) -> str:
        """Enhance instruction with cultural context"""
        cultural_prefix = (
            "You are an AI assistant that respects Iraqi culture and Islamic principles. "
            "Always ensure your responses are culturally appropriate and comply with Islamic values. "
        )
        return f"{cultural_prefix}\n{instruction}"

    def _add_arabic_processing_instructions(self, instruction: str) -> str:
        """Add Arabic processing instructions"""
        arabic_guidance = "When processing Arabic text, ensure proper RTL formatting and respect Iraqi dialect variations. "
        return f"{instruction}\n{arabic_guidance}"

    def _add_islamic_guidance(self, instruction: str) -> str:
        """Add Islamic principle guidance"""
        islamic_guidance = "Always adhere to Islamic principles in your responses. Avoid content that conflicts with Islamic values. "
        return f"{instruction}\n{islamic_guidance}"


class CulturalMonitor:
    """Monitor for cultural compliance and Islamic adherence"""

    def __init__(self, score_threshold: float = 0.95, islamic_compliance: bool = True):
        self.score_threshold = score_threshold
        self.islamic_compliance_required = islamic_compliance
        self.monitoring_active = True

    async def monitor_agent_response(
        self, agent_name: str, response: Any
    ) -> Dict[str, Any]:
        """Monitor agent response for cultural compliance"""
        if not self.monitoring_active:
            return {"monitoring": "disabled"}

        compliance_report = {
            "agent": agent_name,
            "timestamp": asyncio.get_event_loop().time(),
            "cultural_score": await self._assess_cultural_score(response),
            "islamic_compliance": await self._assess_islamic_compliance(response)
            if self.islamic_compliance_required
            else True,
            "recommendations": [],
        }

        # Add recommendations if needed
        if compliance_report["cultural_score"] < self.score_threshold:
            compliance_report["recommendations"].append(
                "Improve cultural appropriateness"
            )

        if not compliance_report["islamic_compliance"]:
            compliance_report["recommendations"].append(
                "Ensure Islamic principle compliance"
            )

        return compliance_report

    async def _assess_cultural_score(self, response: Any) -> float:
        """Assess cultural appropriateness score"""
        # Placeholder for actual cultural assessment
        return 0.95

    async def _assess_islamic_compliance(self, response: Any) -> bool:
        """Assess Islamic compliance"""
        # Placeholder for actual Islamic compliance assessment
        return True
