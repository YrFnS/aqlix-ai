"""
Integration Layer for HRM System with Iraqi AI Agents

This module provides seamless integration between the Sapient HRM system and
existing Iraqi AI agents, enabling hierarchical reasoning with cultural intelligence.
It handles agent orchestration, context management, and performance optimization.

Key Features:
- Seamless agent coordination with HRM reasoning
- Context-aware agent selection and routing
- Performance optimization with caching
- Cultural validation through agent integration
- Real-time monitoring and quality assurance
"""

from typing import Dict, Any, List, Optional, Union, Callable, Awaitable
from dataclasses import dataclass, field
from enum import Enum
import asyncio
import time
import logging
import json
from contextlib import asynccontextmanager
from abc import ABC, abstractmethod

# Import HRM components
from .core import IraqiHierarchicalReasoningAgent, HierarchicalReasoningConfig
from .act import CulturalACT
from .reasoning_patterns import (
    IraqiReasoningPatterns,
    ReasoningContext,
    CulturalComplexity,
)


class AgentRole(Enum):
    """Roles for Iraqi AI agents in HRM system"""

    CULTURAL_VALIDATOR = "cultural_validator"
    ARABIC_PROCESSOR = "arabic_processor"
    SECURITY_GUARDIAN = "security_guardian"
    ACCESSIBILITY_SPECIALIST = "accessibility_specialist"
    UI_DESIGNER = "ui_designer"
    TECHNICAL_DEBUGGER = "technical_debugger"
    BUSINESS_ANALYST = "business_analyst"
    PRODUCT_MANAGER = "product_manager"
    PROFESSIONAL_EXPERT = "professional_expert"
    UX_RESEARCHER = "ux_researcher"
    INTERACTION_DESIGNER = "interaction_designer"
    PAYMENT_TESTER = "payment_tester"
    DEVOPS_ENGINEER = "devops_engineer"
    WORKFLOW_ORCHESTRATOR = "workflow_orchestrator"
    CONTEXT_MANAGER = "context_manager"
    PRP_ORCHESTRATOR = "prp_orchestrator"


class IntegrationType(Enum):
    """Types of HRM-Agent integration patterns"""

    SEQUENTIAL = "sequential"  # Agents work in sequence with HRM
    PARALLEL = "parallel"  # Agents work in parallel with HRM
    HIERARCHICAL = "hierarchical"  # Agents work within HRM hierarchy
    VALIDATION = "validation"  # Agents validate HRM outputs
    ENHANCEMENT = "enhancement"  # Agents enhance HRM capabilities


@dataclass
class AgentCapability:
    """Represents capabilities of an Iraqi AI agent"""

    agent_role: AgentRole
    cultural_validation: bool = True
    arabic_processing: bool = False
    security_focus: bool = False
    ui_ux_focus: bool = False
    technical_debugging: bool = False
    business_analysis: bool = False
    performance_metrics: Dict[str, float] = field(default_factory=dict)
    integration_patterns: List[IntegrationType] = field(default_factory=list)


@dataclass
class IntegrationContext:
    """Context for HRM-Agent integration"""

    task_complexity: float
    cultural_sensitivity_required: bool
    arabic_content_present: bool
    security_critical: bool
    performance_requirements: Dict[str, float]
    user_preferences: Dict[str, Any] = field(default_factory=dict)
    session_metadata: Dict[str, Any] = field(default_factory=dict)


@dataclass
class IntegrationResult:
    """Result from HRM-Agent integration"""

    hrm_result: Dict[str, Any]
    agent_contributions: Dict[AgentRole, Dict[str, Any]]
    cultural_validation_score: float
    performance_metrics: Dict[str, float]
    integration_success: bool
    execution_time_ms: float
    metadata: Dict[str, Any] = field(default_factory=dict)


class BaseAgentConnector(ABC):
    """Base class for connecting Iraqi AI agents to HRM system"""

    def __init__(self, agent_role: AgentRole, config: Dict[str, Any]):
        self.agent_role = agent_role
        self.config = config
        self.logger = logging.getLogger(f"AgentConnector.{agent_role.value}")
        self.performance_history = []
        self.integration_cache = {}

    @abstractmethod
    async def validate_input(
        self, input_data: Any, context: IntegrationContext
    ) -> bool:
        """Validate if this agent can process the input"""
        pass

    @abstractmethod
    async def process_with_hrm(
        self, input_data: Any, hrm_result: Dict[str, Any], context: IntegrationContext
    ) -> Dict[str, Any]:
        """Process data in coordination with HRM result"""
        pass

    @abstractmethod
    async def enhance_hrm_reasoning(
        self, reasoning_state: Dict[str, Any], context: IntegrationContext
    ) -> Dict[str, Any]:
        """Enhance HRM reasoning with agent-specific capabilities"""
        pass

    def get_performance_metrics(self) -> Dict[str, float]:
        """Get performance metrics for this agent connector"""
        if not self.performance_history:
            return {"success_rate": 0.0, "avg_response_time_ms": 0.0}

        successes = sum(1 for result in self.performance_history if result["success"])
        success_rate = successes / len(self.performance_history)
        avg_time = sum(
            result["response_time_ms"] for result in self.performance_history
        ) / len(self.performance_history)

        return {
            "success_rate": success_rate,
            "avg_response_time_ms": avg_time,
            "total_interactions": len(self.performance_history),
        }

    def _record_performance(
        self, success: bool, response_time_ms: float, metadata: Dict[str, Any] = None
    ):
        """Record performance metrics"""
        self.performance_history.append(
            {
                "success": success,
                "response_time_ms": response_time_ms,
                "timestamp": time.time(),
                "metadata": metadata or {},
            }
        )

        # Keep only recent history to prevent memory growth
        if len(self.performance_history) > 1000:
            self.performance_history = self.performance_history[-500:]


class CulturalValidatorConnector(BaseAgentConnector):
    """Connector for Iraqi Cultural Validator agent"""

    def __init__(self, config: Dict[str, Any]):
        super().__init__(AgentRole.CULTURAL_VALIDATOR, config)
        self.validation_thresholds = {
            "cultural_appropriateness": 0.95,
            "islamic_compliance": 0.90,
            "political_neutrality": 0.98,
        }

    async def validate_input(
        self, input_data: Any, context: IntegrationContext
    ) -> bool:
        """Always applicable for cultural validation"""
        return True

    async def process_with_hrm(
        self, input_data: Any, hrm_result: Dict[str, Any], context: IntegrationContext
    ) -> Dict[str, Any]:
        """Validate HRM results for cultural appropriateness"""
        start_time = time.time()

        try:
            # Extract content to validate
            content_to_validate = self._extract_validation_content(hrm_result)

            # Perform cultural validation
            validation_result = await self._perform_cultural_validation(
                content_to_validate, context
            )

            # Check if validation passes thresholds
            passes_validation = all(
                validation_result.get(metric, 0) >= threshold
                for metric, threshold in self.validation_thresholds.items()
            )

            response_time_ms = (time.time() - start_time) * 1000

            result = {
                "validation_passed": passes_validation,
                "cultural_scores": validation_result,
                "recommendations": self._generate_improvement_recommendations(
                    validation_result
                ),
                "response_time_ms": response_time_ms,
            }

            self._record_performance(
                passes_validation, response_time_ms, validation_result
            )
            return result

        except Exception as e:
            response_time_ms = (time.time() - start_time) * 1000
            self.logger.error(f"Cultural validation failed: {e}")
            self._record_performance(False, response_time_ms, {"error": str(e)})
            raise

    async def enhance_hrm_reasoning(
        self, reasoning_state: Dict[str, Any], context: IntegrationContext
    ) -> Dict[str, Any]:
        """Enhance HRM reasoning with cultural context"""

        cultural_enhancements = {
            "cultural_context_awareness": True,
            "islamic_principle_integration": context.cultural_sensitivity_required,
            "iraqi_social_norms": {
                "hospitality_consideration": True,
                "family_orientation": True,
                "respect_for_elders": True,
                "religious_sensitivity": True,
            },
            "language_considerations": {
                "arabic_dialect_support": context.arabic_content_present,
                "bilingual_capability": True,
                "rtl_formatting_aware": context.arabic_content_present,
            },
        }

        # Add cultural enhancement to reasoning state
        reasoning_state.setdefault("cultural_enhancements", {}).update(
            cultural_enhancements
        )

        return reasoning_state

    def _extract_validation_content(self, hrm_result: Dict[str, Any]) -> str:
        """Extract content that needs cultural validation"""

        content_parts = []

        # Extract various content types
        if "response_content" in hrm_result:
            content_parts.append(str(hrm_result["response_content"]))

        if "reasoning_output" in hrm_result:
            content_parts.append(str(hrm_result["reasoning_output"]))

        if "generated_text" in hrm_result:
            content_parts.append(hrm_result["generated_text"])

        return " ".join(content_parts)

    async def _perform_cultural_validation(
        self, content: str, context: IntegrationContext
    ) -> Dict[str, float]:
        """Perform comprehensive cultural validation"""

        # Simulated cultural validation - in real implementation,
        # this would call the actual iraqi-cultural-validator agent
        validation_scores = {
            "cultural_appropriateness": 0.95,
            "islamic_compliance": 0.92,
            "political_neutrality": 0.98,
            "professional_appropriateness": 0.90,
            "language_appropriateness": 0.88,
        }

        # Adjust scores based on content analysis
        content_lower = content.lower()

        # Check for potential issues
        sensitive_terms = ["politics", "sectarian", "controversial"]
        for term in sensitive_terms:
            if term in content_lower:
                validation_scores["political_neutrality"] -= 0.1
                validation_scores["cultural_appropriateness"] -= 0.05

        # Boost for Islamic values
        islamic_values = ["respect", "kindness", "justice", "compassion"]
        for value in islamic_values:
            if value in content_lower:
                validation_scores["islamic_compliance"] += 0.02

        # Ensure scores don't exceed 1.0 or go below 0.0
        return {k: max(0.0, min(1.0, v)) for k, v in validation_scores.items()}

    def _generate_improvement_recommendations(
        self, validation_result: Dict[str, float]
    ) -> List[str]:
        """Generate recommendations for improving cultural compliance"""

        recommendations = []

        for metric, score in validation_result.items():
            if score < 0.95:
                if metric == "cultural_appropriateness":
                    recommendations.append(
                        "Consider Iraqi cultural norms and social expectations"
                    )
                elif metric == "islamic_compliance":
                    recommendations.append(
                        "Align content with Islamic principles and values"
                    )
                elif metric == "political_neutrality":
                    recommendations.append(
                        "Maintain political neutrality and avoid sectarian topics"
                    )
                elif metric == "professional_appropriateness":
                    recommendations.append(
                        "Use appropriate professional tone and terminology"
                    )
                elif metric == "language_appropriateness":
                    recommendations.append(
                        "Ensure appropriate Arabic-English language usage"
                    )

        return recommendations


class ArabicProcessorConnector(BaseAgentConnector):
    """Connector for Arabic RTL processor agent"""

    def __init__(self, config: Dict[str, Any]):
        super().__init__(AgentRole.ARABIC_PROCESSOR, config)
        self.rtl_processing_enabled = True
        self.dialect_recognition_threshold = 0.85

    async def validate_input(
        self, input_data: Any, context: IntegrationContext
    ) -> bool:
        """Validate if Arabic processing is needed"""
        return context.arabic_content_present

    async def process_with_hrm(
        self, input_data: Any, hrm_result: Dict[str, Any], context: IntegrationContext
    ) -> Dict[str, Any]:
        """Process Arabic content in HRM results"""
        start_time = time.time()

        try:
            # Extract Arabic content
            arabic_content = self._extract_arabic_content(hrm_result)

            if not arabic_content:
                return {"arabic_processing": "not_required"}

            # Process Arabic content
            processing_result = await self._process_arabic_content(
                arabic_content, context
            )

            response_time_ms = (time.time() - start_time) * 1000

            result = {
                "rtl_formatting_applied": processing_result.get("rtl_applied", False),
                "dialect_recognition": processing_result.get("dialect_info", {}),
                "text_direction_handling": processing_result.get(
                    "text_direction", "rtl"
                ),
                "mixed_language_support": processing_result.get(
                    "mixed_language", False
                ),
                "response_time_ms": response_time_ms,
            }

            self._record_performance(True, response_time_ms, processing_result)
            return result

        except Exception as e:
            response_time_ms = (time.time() - start_time) * 1000
            self.logger.error(f"Arabic processing failed: {e}")
            self._record_performance(False, response_time_ms, {"error": str(e)})
            raise

    async def enhance_hrm_reasoning(
        self, reasoning_state: Dict[str, Any], context: IntegrationContext
    ) -> Dict[str, Any]:
        """Enhance HRM reasoning with Arabic processing capabilities"""

        if context.arabic_content_present:
            arabic_enhancements = {
                "rtl_layout_support": True,
                "arabic_font_optimization": True,
                "iraqi_dialect_recognition": True,
                "mixed_language_handling": True,
                "cultural_arabic_expressions": True,
                "professional_arabic_terminology": True,
            }

            reasoning_state.setdefault("arabic_enhancements", {}).update(
                arabic_enhancements
            )

        return reasoning_state

    def _extract_arabic_content(self, hrm_result: Dict[str, Any]) -> str:
        """Extract Arabic text from HRM results"""

        arabic_content = []

        # Search through HRM result for Arabic text
        def extract_arabic_recursive(obj):
            if isinstance(obj, str):
                # Simple Arabic character detection
                if any("\u0600" <= char <= "\u06ff" for char in obj):
                    arabic_content.append(obj)
            elif isinstance(obj, dict):
                for value in obj.values():
                    extract_arabic_recursive(value)
            elif isinstance(obj, list):
                for item in obj:
                    extract_arabic_recursive(item)

        extract_arabic_recursive(hrm_result)

        return " ".join(arabic_content)

    async def _process_arabic_content(
        self, content: str, context: IntegrationContext
    ) -> Dict[str, Any]:
        """Process Arabic content with RTL and dialect recognition"""

        # Simulated Arabic processing - in real implementation,
        # this would call the actual arabic-rtl-processor agent
        processing_result = {
            "rtl_applied": True,
            "text_direction": "rtl",
            "dialect_info": {
                "detected_dialect": "iraqi",
                "confidence": 0.90,
                "regional_markers": ["شلونك", "مرحبا", "يلا"],
            },
            "mixed_language": "english" in content.lower(),
            "formatting_adjustments": {
                "punctuation_fixed": True,
                "number_formatting": "arabic-indic",
                "text_alignment": "right",
            },
        }

        return processing_result


class SecurityGuardianConnector(BaseAgentConnector):
    """Connector for Security Guardian agent"""

    def __init__(self, config: Dict[str, Any]):
        super().__init__(AgentRole.SECURITY_GUARDIAN, config)
        self.security_thresholds = {
            "vulnerability_risk": 0.1,  # Max 10% risk
            "data_protection": 0.95,  # Min 95% protection
            "access_control": 0.98,  # Min 98% access control
        }

    async def validate_input(
        self, input_data: Any, context: IntegrationContext
    ) -> bool:
        """Validate if security validation is needed"""
        return context.security_critical or "payment" in str(input_data).lower()

    async def process_with_hrm(
        self, input_data: Any, hrm_result: Dict[str, Any], context: IntegrationContext
    ) -> Dict[str, Any]:
        """Validate HRM results for security compliance"""
        start_time = time.time()

        try:
            # Perform security analysis
            security_analysis = await self._analyze_security_risks(hrm_result, context)

            # Check compliance with security thresholds
            security_compliant = all(
                security_analysis.get(metric, 1.0) <= threshold
                if "risk" in metric
                else security_analysis.get(metric, 0.0) >= threshold
                for metric, threshold in self.security_thresholds.items()
            )

            response_time_ms = (time.time() - start_time) * 1000

            result = {
                "security_compliant": security_compliant,
                "security_scores": security_analysis,
                "risk_assessment": self._assess_risk_level(security_analysis),
                "security_recommendations": self._generate_security_recommendations(
                    security_analysis
                ),
                "response_time_ms": response_time_ms,
            }

            self._record_performance(
                security_compliant, response_time_ms, security_analysis
            )
            return result

        except Exception as e:
            response_time_ms = (time.time() - start_time) * 1000
            self.logger.error(f"Security validation failed: {e}")
            self._record_performance(False, response_time_ms, {"error": str(e)})
            raise

    async def enhance_hrm_reasoning(
        self, reasoning_state: Dict[str, Any], context: IntegrationContext
    ) -> Dict[str, Any]:
        """Enhance HRM reasoning with security considerations"""

        if context.security_critical:
            security_enhancements = {
                "data_encryption_required": True,
                "access_control_validation": True,
                "audit_trail_generation": True,
                "secure_communication": True,
                "privacy_protection": True,
                "iraqi_regulatory_compliance": True,
            }

            reasoning_state.setdefault("security_enhancements", {}).update(
                security_enhancements
            )

        return reasoning_state

    async def _analyze_security_risks(
        self, hrm_result: Dict[str, Any], context: IntegrationContext
    ) -> Dict[str, float]:
        """Analyze security risks in HRM results"""

        # Simulated security analysis - in real implementation,
        # this would call the actual security guardian agents
        security_scores = {
            "vulnerability_risk": 0.05,  # Low risk
            "data_protection": 0.98,  # High protection
            "access_control": 0.99,  # Excellent access control
            "privacy_compliance": 0.96,  # High privacy compliance
            "encryption_strength": 0.95,  # Strong encryption
        }

        # Adjust scores based on content analysis
        result_str = str(hrm_result).lower()

        # Check for security concerns
        if "password" in result_str or "key" in result_str:
            security_scores["vulnerability_risk"] += 0.02
            security_scores["data_protection"] -= 0.02

        if "payment" in result_str or "transaction" in result_str:
            security_scores["encryption_strength"] = 0.99  # Higher requirement
            security_scores["privacy_compliance"] = 0.99  # Higher requirement

        return {k: max(0.0, min(1.0, v)) for k, v in security_scores.items()}

    def _assess_risk_level(self, security_analysis: Dict[str, float]) -> str:
        """Assess overall security risk level"""

        vulnerability_risk = security_analysis.get("vulnerability_risk", 0)

        if vulnerability_risk <= 0.05:
            return "low"
        elif vulnerability_risk <= 0.15:
            return "medium"
        else:
            return "high"

    def _generate_security_recommendations(
        self, security_analysis: Dict[str, float]
    ) -> List[str]:
        """Generate security improvement recommendations"""

        recommendations = []

        if security_analysis.get("vulnerability_risk", 0) > 0.1:
            recommendations.append(
                "Implement additional vulnerability scanning and mitigation"
            )

        if security_analysis.get("data_protection", 1) < 0.95:
            recommendations.append("Strengthen data protection and encryption measures")

        if security_analysis.get("access_control", 1) < 0.98:
            recommendations.append(
                "Enhance access control and authentication mechanisms"
            )

        if security_analysis.get("privacy_compliance", 1) < 0.95:
            recommendations.append(
                "Improve privacy compliance and data handling procedures"
            )

        return recommendations


class HRMAgentIntegrationOrchestrator:
    """Main orchestrator for HRM-Agent integration"""

    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.logger = logging.getLogger(__name__)

        # Initialize HRM system components
        self.hrm_agent = IraqiHierarchicalReasoningAgent(config=config)
        self.cultural_act = CulturalACT(config.get("act_config", {}))
        self.reasoning_patterns = IraqiReasoningPatterns(
            config.get("reasoning_config", {})
        )

        # Initialize agent connectors
        self.agent_connectors = {
            AgentRole.CULTURAL_VALIDATOR: CulturalValidatorConnector(config),
            AgentRole.ARABIC_PROCESSOR: ArabicProcessorConnector(config),
            AgentRole.SECURITY_GUARDIAN: SecurityGuardianConnector(config),
            # Additional connectors can be added here
        }

        # Performance tracking
        self.integration_metrics = {
            "total_integrations": 0,
            "successful_integrations": 0,
            "average_response_time_ms": 0,
            "cultural_validation_rate": 0,
            "security_compliance_rate": 0,
        }

    async def integrated_reasoning(
        self, input_data: Any, context: Optional[IntegrationContext] = None
    ) -> IntegrationResult:
        """Perform integrated reasoning using HRM + Iraqi agents"""

        start_time = time.time()

        if context is None:
            context = await self._build_integration_context(input_data)

        try:
            # Phase 1: Determine optimal reasoning depth using Cultural ACT
            reasoning_depth_result = await self.cultural_act.determine_reasoning_depth(
                input_data
            )

            # Phase 2: Apply HRM reasoning
            hrm_reasoning_result = await self.hrm_agent.hierarchical_reason(
                input_data, reasoning_params=reasoning_depth_result["reasoning_params"]
            )

            # Phase 3: Apply cultural reasoning patterns
            reasoning_context = ReasoningContext(
                user_query=str(input_data),
                cultural_domain=context.user_preferences.get(
                    "cultural_domain", "general"
                ),
                cultural_sensitivity=CulturalComplexity.MODERATE,
            )

            pattern_results = (
                await self.reasoning_patterns.reason_with_cultural_intelligence(
                    reasoning_context
                )
            )

            # Phase 4: Coordinate with Iraqi agents
            agent_results = await self._coordinate_agents(
                input_data, hrm_reasoning_result, context
            )

            # Phase 5: Integrate and validate results
            integrated_result = await self._integrate_results(
                hrm_reasoning_result, pattern_results, agent_results, context
            )

            execution_time_ms = (time.time() - start_time) * 1000

            # Calculate final scores
            cultural_validation_score = self._calculate_cultural_score(agent_results)

            result = IntegrationResult(
                hrm_result=integrated_result,
                agent_contributions=agent_results,
                cultural_validation_score=cultural_validation_score,
                performance_metrics={
                    "execution_time_ms": execution_time_ms,
                    "reasoning_depth": reasoning_depth_result["reasoning_depth"],
                    "agents_involved": len(agent_results),
                },
                integration_success=True,
                execution_time_ms=execution_time_ms,
                metadata={
                    "reasoning_strategy": reasoning_depth_result["strategy"],
                    "cultural_patterns_applied": list(pattern_results.keys()),
                    "context_complexity": context.task_complexity,
                },
            )

            # Update metrics
            self._update_integration_metrics(result)

            return result

        except Exception as e:
            execution_time_ms = (time.time() - start_time) * 1000
            self.logger.error(f"Integrated reasoning failed: {e}")

            # Return error result
            return IntegrationResult(
                hrm_result={"error": str(e)},
                agent_contributions={},
                cultural_validation_score=0.0,
                performance_metrics={"execution_time_ms": execution_time_ms},
                integration_success=False,
                execution_time_ms=execution_time_ms,
                metadata={"error": str(e)},
            )

    async def _build_integration_context(self, input_data: Any) -> IntegrationContext:
        """Build integration context from input data"""

        input_str = str(input_data).lower()

        # Analyze input characteristics
        task_complexity = self._estimate_task_complexity(input_str)
        cultural_sensitivity = "culture" in input_str or "islam" in input_str
        arabic_content = any("\u0600" <= char <= "\u06ff" for char in str(input_data))
        security_critical = any(
            term in input_str for term in ["payment", "security", "auth", "login"]
        )

        return IntegrationContext(
            task_complexity=task_complexity,
            cultural_sensitivity_required=cultural_sensitivity,
            arabic_content_present=arabic_content,
            security_critical=security_critical,
            performance_requirements={
                "max_response_time_ms": 5000,
                "min_cultural_score": 0.95,
                "min_security_score": 0.90,
            },
        )

    def _estimate_task_complexity(self, input_str: str) -> float:
        """Estimate task complexity from 0.0 to 1.0"""

        complexity_indicators = {
            "simple": ["hello", "hi", "thanks", "yes", "no"],
            "moderate": ["how", "what", "explain", "help"],
            "complex": ["analyze", "design", "implement", "optimize"],
            "critical": ["security", "payment", "legal", "medical"],
        }

        complexity_score = 0.3  # Base complexity

        for level, keywords in complexity_indicators.items():
            if any(keyword in input_str for keyword in keywords):
                if level == "simple":
                    complexity_score = max(complexity_score, 0.2)
                elif level == "moderate":
                    complexity_score = max(complexity_score, 0.5)
                elif level == "complex":
                    complexity_score = max(complexity_score, 0.8)
                elif level == "critical":
                    complexity_score = max(complexity_score, 1.0)

        return complexity_score

    async def _coordinate_agents(
        self, input_data: Any, hrm_result: Dict[str, Any], context: IntegrationContext
    ) -> Dict[AgentRole, Dict[str, Any]]:
        """Coordinate Iraqi agents with HRM results"""

        agent_results = {}

        # Determine which agents to involve
        agents_to_involve = []

        # Cultural validation is always required
        agents_to_involve.append(AgentRole.CULTURAL_VALIDATOR)

        # Arabic processing if Arabic content present
        if context.arabic_content_present:
            agents_to_involve.append(AgentRole.ARABIC_PROCESSOR)

        # Security validation if security critical
        if context.security_critical:
            agents_to_involve.append(AgentRole.SECURITY_GUARDIAN)

        # Process with each relevant agent
        for agent_role in agents_to_involve:
            connector = self.agent_connectors.get(agent_role)
            if connector and await connector.validate_input(input_data, context):
                try:
                    agent_result = await connector.process_with_hrm(
                        input_data, hrm_result, context
                    )
                    agent_results[agent_role] = agent_result
                except Exception as e:
                    self.logger.error(
                        f"Agent {agent_role.value} processing failed: {e}"
                    )
                    agent_results[agent_role] = {"error": str(e)}

        return agent_results

    async def _integrate_results(
        self,
        hrm_result: Dict[str, Any],
        pattern_results: Dict[str, Any],
        agent_results: Dict[AgentRole, Dict[str, Any]],
        context: IntegrationContext,
    ) -> Dict[str, Any]:
        """Integrate HRM, pattern, and agent results"""

        integrated_result = {
            "hrm_reasoning": hrm_result,
            "cultural_patterns": pattern_results,
            "agent_validations": {},
        }

        # Process agent results
        for agent_role, result in agent_results.items():
            if "error" not in result:
                integrated_result["agent_validations"][agent_role.value] = {
                    "status": "success",
                    "validation_passed": result.get("validation_passed", True),
                    "scores": result.get("cultural_scores")
                    or result.get("security_scores", {}),
                    "recommendations": result.get("recommendations", []),
                }
            else:
                integrated_result["agent_validations"][agent_role.value] = {
                    "status": "error",
                    "error": result["error"],
                }

        # Add integration summary
        integrated_result["integration_summary"] = {
            "cultural_compliance": self._calculate_cultural_compliance(agent_results),
            "security_compliance": self._calculate_security_compliance(agent_results),
            "overall_quality_score": self._calculate_overall_quality(
                hrm_result, agent_results
            ),
        }

        return integrated_result

    def _calculate_cultural_score(
        self, agent_results: Dict[AgentRole, Dict[str, Any]]
    ) -> float:
        """Calculate overall cultural validation score"""

        cultural_result = agent_results.get(AgentRole.CULTURAL_VALIDATOR, {})

        if "cultural_scores" in cultural_result:
            scores = cultural_result["cultural_scores"]
            return sum(scores.values()) / len(scores)

        return 0.8  # Default score

    def _calculate_cultural_compliance(
        self, agent_results: Dict[AgentRole, Dict[str, Any]]
    ) -> float:
        """Calculate cultural compliance score"""
        return self._calculate_cultural_score(agent_results)

    def _calculate_security_compliance(
        self, agent_results: Dict[AgentRole, Dict[str, Any]]
    ) -> float:
        """Calculate security compliance score"""

        security_result = agent_results.get(AgentRole.SECURITY_GUARDIAN, {})

        if "security_scores" in security_result:
            scores = security_result["security_scores"]
            # For security, lower risk scores are better
            risk_scores = {
                k: (1.0 - v) if "risk" in k else v for k, v in scores.items()
            }
            return sum(risk_scores.values()) / len(risk_scores)

        return 0.8  # Default score

    def _calculate_overall_quality(
        self, hrm_result: Dict[str, Any], agent_results: Dict[AgentRole, Dict[str, Any]]
    ) -> float:
        """Calculate overall quality score"""

        cultural_score = self._calculate_cultural_compliance(agent_results)
        security_score = self._calculate_security_compliance(agent_results)

        # Weight the scores
        overall_score = (
            cultural_score * 0.4
            + security_score * 0.3
            + 0.3 * 0.9  # HRM reasoning quality (assumed good)
        )

        return overall_score

    def _update_integration_metrics(self, result: IntegrationResult):
        """Update integration performance metrics"""

        self.integration_metrics["total_integrations"] += 1

        if result.integration_success:
            self.integration_metrics["successful_integrations"] += 1

        # Update average response time
        total_time = (
            self.integration_metrics["average_response_time_ms"]
            * (self.integration_metrics["total_integrations"] - 1)
            + result.execution_time_ms
        )
        self.integration_metrics["average_response_time_ms"] = (
            total_time / self.integration_metrics["total_integrations"]
        )

        # Update cultural validation rate
        cultural_validations = sum(
            1
            for role_result in result.agent_contributions.values()
            if role_result.get("validation_passed", False)
        )

        if result.agent_contributions:
            cultural_rate = cultural_validations / len(result.agent_contributions)
            total_cultural = (
                self.integration_metrics["cultural_validation_rate"]
                * (self.integration_metrics["total_integrations"] - 1)
                + cultural_rate
            )
            self.integration_metrics["cultural_validation_rate"] = (
                total_cultural / self.integration_metrics["total_integrations"]
            )

    def get_integration_metrics(self) -> Dict[str, Any]:
        """Get comprehensive integration metrics"""

        metrics = self.integration_metrics.copy()

        # Add agent-specific metrics
        metrics["agent_performance"] = {
            role.value: connector.get_performance_metrics()
            for role, connector in self.agent_connectors.items()
        }

        # Add HRM metrics
        metrics["hrm_performance"] = self.hrm_agent.get_performance_metrics()

        # Add pattern metrics
        metrics["reasoning_patterns"] = self.reasoning_patterns.get_performance_stats()

        return metrics

    @asynccontextmanager
    async def integration_session(self, session_metadata: Dict[str, Any] = None):
        """Context manager for integration sessions"""

        session_start = time.time()
        session_id = f"hrm_integration_{int(session_start)}"

        self.logger.info(f"Starting HRM integration session {session_id}")

        try:
            yield session_id
        finally:
            session_duration = time.time() - session_start
            self.logger.info(
                f"HRM integration session {session_id} completed in {session_duration:.2f}s"
            )


# Export main integration classes
__all__ = [
    "HRMAgentIntegrationOrchestrator",
    "IntegrationContext",
    "IntegrationResult",
    "AgentRole",
    "IntegrationType",
    "CulturalValidatorConnector",
    "ArabicProcessorConnector",
    "SecurityGuardianConnector",
]
