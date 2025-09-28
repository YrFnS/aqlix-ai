"""
Iraqi Conditional Routing System for LangGraph Orchestration
Enhanced conditional routing with comprehensive Iraqi cultural validation and professional domain awareness.

Key Features:
- Conditional edge routing with Islamic compliance validation
- Multi-criteria decision making with cultural context
- Professional domain-aware routing logic
- Arabic processing conditional routing
- Error recovery routing with cultural preservation
- Performance-optimized routing decisions
"""

from typing import Dict, List, Optional, Any, Union, Callable, Awaitable
from enum import Enum
from dataclasses import dataclass, field
from datetime import datetime
import asyncio
import logging
from abc import ABC, abstractmethod


class IraqiRoutingCriteria(Enum):
    """Enhanced routing criteria for Iraqi workflow decisions"""

    CULTURAL_COMPLIANCE = "cultural_compliance"
    ISLAMIC_COMPLIANCE = "islamic_compliance"
    ARABIC_PROCESSING = "arabic_processing"
    PROFESSIONAL_DOMAIN = "professional_domain"
    FAMILY_SENSITIVITY = "family_sensitivity"
    REGIONAL_CONTEXT = "regional_context"
    PERFORMANCE_THRESHOLD = "performance_threshold"
    ERROR_RECOVERY = "error_recovery"
    USER_PREFERENCE = "user_preference"


@dataclass
class IraqiRoutingCondition:
    """Enhanced routing condition with comprehensive Iraqi validation"""

    condition_id: str
    criteria: IraqiRoutingCriteria
    threshold: float
    weight: float
    cultural_requirements: Dict[str, Any] = field(default_factory=dict)
    professional_requirements: Dict[str, Any] = field(default_factory=dict)
    arabic_requirements: Dict[str, Any] = field(default_factory=dict)
    islamic_requirements: Dict[str, Any] = field(default_factory=dict)

    async def evaluate(
        self, state: Dict[str, Any], cultural_context: Dict[str, Any]
    ) -> float:
        """Evaluate condition with Iraqi cultural context"""

        if self.criteria == IraqiRoutingCriteria.CULTURAL_COMPLIANCE:
            return await self._evaluate_cultural_compliance(state, cultural_context)
        elif self.criteria == IraqiRoutingCriteria.ISLAMIC_COMPLIANCE:
            return await self._evaluate_islamic_compliance(state, cultural_context)
        elif self.criteria == IraqiRoutingCriteria.ARABIC_PROCESSING:
            return await self._evaluate_arabic_processing(state, cultural_context)
        elif self.criteria == IraqiRoutingCriteria.PROFESSIONAL_DOMAIN:
            return await self._evaluate_professional_domain(state, cultural_context)
        elif self.criteria == IraqiRoutingCriteria.FAMILY_SENSITIVITY:
            return await self._evaluate_family_sensitivity(state, cultural_context)
        elif self.criteria == IraqiRoutingCriteria.REGIONAL_CONTEXT:
            return await self._evaluate_regional_context(state, cultural_context)
        elif self.criteria == IraqiRoutingCriteria.PERFORMANCE_THRESHOLD:
            return await self._evaluate_performance_threshold(state, cultural_context)
        elif self.criteria == IraqiRoutingCriteria.ERROR_RECOVERY:
            return await self._evaluate_error_recovery(state, cultural_context)
        elif self.criteria == IraqiRoutingCriteria.USER_PREFERENCE:
            return await self._evaluate_user_preference(state, cultural_context)

        return 0.0

    async def _evaluate_cultural_compliance(
        self, state: Dict[str, Any], cultural_context: Dict[str, Any]
    ) -> float:
        """Evaluate cultural compliance for routing"""

        cultural_score = 0.0

        # Check family context compliance
        if cultural_context.get("family_context"):
            family_validated = state.get("family_validated", False)
            cultural_score += 0.3 if family_validated else 0.0

        # Check religious context compliance
        if cultural_context.get("religious_context"):
            religious_validated = state.get("religious_validated", False)
            cultural_score += 0.3 if religious_validated else 0.0

        # Check professional context compliance
        if cultural_context.get("professional_context"):
            professional_validated = state.get("professional_validated", False)
            cultural_score += 0.4 if professional_validated else 0.0

        # If no specific contexts, assume general compliance
        if not any(
            [
                cultural_context.get("family_context"),
                cultural_context.get("religious_context"),
                cultural_context.get("professional_context"),
            ]
        ):
            cultural_score = 1.0

        return min(cultural_score, 1.0)

    async def _evaluate_islamic_compliance(
        self, state: Dict[str, Any], cultural_context: Dict[str, Any]
    ) -> float:
        """Evaluate Islamic compliance for routing"""

        islamic_state = state.get("islamic_compliance", {})
        compliance_score = islamic_state.get("score", 0.0)

        # Check for compliance issues
        issues = islamic_state.get("compliance_issues", [])
        if issues:
            compliance_score *= 1.0 - len(issues) * 0.1  # Reduce score for each issue

        return max(compliance_score, 0.0)

    async def _evaluate_arabic_processing(
        self, state: Dict[str, Any], cultural_context: Dict[str, Any]
    ) -> float:
        """Evaluate Arabic processing requirements for routing"""

        arabic_state = state.get("arabic_processing", {})

        # Check if Arabic processing is required
        if not cultural_context.get("arabic_required", False):
            return 1.0  # Not required, so full score

        # Check if Arabic processing is enabled and functional
        enabled = arabic_state.get("enabled", False)
        quality = arabic_state.get("processing_quality", 0.0)

        if enabled and quality > 0.8:
            return 1.0
        elif enabled and quality > 0.6:
            return 0.8
        elif enabled:
            return 0.6
        else:
            return 0.0

    async def _evaluate_professional_domain(
        self, state: Dict[str, Any], cultural_context: Dict[str, Any]
    ) -> float:
        """Evaluate professional domain compliance for routing"""

        professional_domain = cultural_context.get("professional_domain")
        if not professional_domain:
            return 1.0  # No domain requirements

        domain_state = state.get("professional_domain", {})
        compliance_score = domain_state.get("compliance_score", 0.0)
        validated = domain_state.get("validated", False)

        if validated and compliance_score > 0.9:
            return 1.0
        elif validated and compliance_score > 0.7:
            return 0.8
        elif validated:
            return 0.6
        else:
            return 0.0


@dataclass
class IraqiRoutingDecision:
    """Enhanced routing decision with comprehensive validation results"""

    target_node: str
    confidence_score: float
    decision_rationale: str
    cultural_factors: Dict[str, Any]
    islamic_compliance_factors: Dict[str, Any]
    professional_factors: Dict[str, Any]
    arabic_processing_factors: Dict[str, Any]
    condition_evaluations: List[Dict[str, Any]]
    timestamp: datetime

    def to_dict(self) -> Dict[str, Any]:
        """Convert decision to dictionary for logging"""
        return {
            "target_node": self.target_node,
            "confidence_score": self.confidence_score,
            "decision_rationale": self.decision_rationale,
            "cultural_factors": self.cultural_factors,
            "islamic_compliance_factors": self.islamic_compliance_factors,
            "professional_factors": self.professional_factors,
            "arabic_processing_factors": self.arabic_processing_factors,
            "condition_evaluations": self.condition_evaluations,
            "timestamp": self.timestamp.isoformat(),
        }


class IraqiConditionalRouter(ABC):
    """Enhanced abstract base class for Iraqi conditional routing"""

    def __init__(self, router_id: str):
        self.router_id = router_id
        self.conditions: List[IraqiRoutingCondition] = []
        self.routing_history: List[IraqiRoutingDecision] = []
        self.logger = logging.getLogger(f"IraqiRouter.{router_id}")

    def add_condition(self, condition: IraqiRoutingCondition):
        """Add routing condition with validation"""
        self.conditions.append(condition)
        self.logger.info(
            f"Added condition {condition.condition_id} for criteria {condition.criteria}"
        )

    async def route(
        self,
        state: Dict[str, Any],
        cultural_context: Dict[str, Any],
        available_nodes: List[str],
    ) -> IraqiRoutingDecision:
        """Execute routing decision with comprehensive Iraqi validation"""

        routing_start = datetime.now()

        # Evaluate all conditions
        condition_evaluations = []
        total_score = 0.0
        total_weight = 0.0

        for condition in self.conditions:
            try:
                score = await condition.evaluate(state, cultural_context)
                weighted_score = score * condition.weight
                total_score += weighted_score
                total_weight += condition.weight

                condition_evaluations.append(
                    {
                        "condition_id": condition.condition_id,
                        "criteria": condition.criteria.value,
                        "score": score,
                        "weight": condition.weight,
                        "weighted_score": weighted_score,
                        "threshold_met": score >= condition.threshold,
                    }
                )

            except Exception as e:
                self.logger.error(
                    f"Error evaluating condition {condition.condition_id}: {str(e)}"
                )
                condition_evaluations.append(
                    {
                        "condition_id": condition.condition_id,
                        "criteria": condition.criteria.value,
                        "error": str(e),
                        "score": 0.0,
                    }
                )

        # Calculate overall confidence
        confidence_score = total_score / total_weight if total_weight > 0 else 0.0

        # Make routing decision
        target_node = await self._select_target_node(
            state,
            cultural_context,
            available_nodes,
            condition_evaluations,
            confidence_score,
        )

        # Generate decision rationale
        rationale = await self._generate_decision_rationale(
            target_node, condition_evaluations, confidence_score
        )

        # Extract factor summaries
        cultural_factors = await self._extract_cultural_factors(state, cultural_context)
        islamic_factors = await self._extract_islamic_factors(state, cultural_context)
        professional_factors = await self._extract_professional_factors(
            state, cultural_context
        )
        arabic_factors = await self._extract_arabic_factors(state, cultural_context)

        # Create routing decision
        decision = IraqiRoutingDecision(
            target_node=target_node,
            confidence_score=confidence_score,
            decision_rationale=rationale,
            cultural_factors=cultural_factors,
            islamic_compliance_factors=islamic_factors,
            professional_factors=professional_factors,
            arabic_processing_factors=arabic_factors,
            condition_evaluations=condition_evaluations,
            timestamp=routing_start,
        )

        # Record decision
        self.routing_history.append(decision)
        self.logger.info(
            f"Routing decision: {target_node} (confidence: {confidence_score:.2f})"
        )

        return decision

    @abstractmethod
    async def _select_target_node(
        self,
        state: Dict[str, Any],
        cultural_context: Dict[str, Any],
        available_nodes: List[str],
        condition_evaluations: List[Dict[str, Any]],
        confidence_score: float,
    ) -> str:
        """Select target node based on evaluations"""
        pass

    async def _generate_decision_rationale(
        self,
        target_node: str,
        condition_evaluations: List[Dict[str, Any]],
        confidence_score: float,
    ) -> str:
        """Generate human-readable decision rationale"""

        met_conditions = [
            eval for eval in condition_evaluations if eval.get("threshold_met", False)
        ]
        failed_conditions = [
            eval
            for eval in condition_evaluations
            if not eval.get("threshold_met", False)
        ]

        rationale = f"Selected {target_node} with {confidence_score:.2f} confidence. "

        if met_conditions:
            criteria_list = [eval["criteria"] for eval in met_conditions]
            rationale += f"Met criteria: {', '.join(criteria_list)}. "

        if failed_conditions:
            criteria_list = [eval["criteria"] for eval in failed_conditions]
            rationale += f"Failed criteria: {', '.join(criteria_list)}. "

        return rationale

    async def _extract_cultural_factors(
        self, state: Dict[str, Any], cultural_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Extract cultural factors for decision logging"""
        return {
            "family_context": cultural_context.get("family_context", False),
            "religious_context": cultural_context.get("religious_context", False),
            "professional_context": cultural_context.get("professional_context", False),
            "regional_context": cultural_context.get("regional_context", "general"),
            "family_validated": state.get("family_validated", False),
            "religious_validated": state.get("religious_validated", False),
            "professional_validated": state.get("professional_validated", False),
        }

    async def _extract_islamic_factors(
        self, state: Dict[str, Any], cultural_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Extract Islamic compliance factors for decision logging"""
        islamic_state = state.get("islamic_compliance", {})
        return {
            "required": islamic_state.get("required", True),
            "score": islamic_state.get("score", 0.0),
            "validated_components": islamic_state.get("validated_components", []),
            "compliance_issues": islamic_state.get("compliance_issues", []),
            "family_sensitivity": islamic_state.get("family_sensitivity", False),
            "religious_sensitivity": islamic_state.get("religious_sensitivity", False),
        }


class IraqiManagerRouter(IraqiConditionalRouter):
    """Enhanced Manager router for Iraqi GitHub issue and message classification"""

    def __init__(self):
        super().__init__("manager_router")
        self._initialize_manager_conditions()

    def _initialize_manager_conditions(self):
        """Initialize manager-specific routing conditions"""

        # Cultural compliance condition
        cultural_condition = IraqiRoutingCondition(
            condition_id="manager_cultural_compliance",
            criteria=IraqiRoutingCriteria.CULTURAL_COMPLIANCE,
            threshold=0.8,
            weight=0.3,
            cultural_requirements={"validate_before_routing": True},
        )
        self.add_condition(cultural_condition)

        # Islamic compliance condition
        islamic_condition = IraqiRoutingCondition(
            condition_id="manager_islamic_compliance",
            criteria=IraqiRoutingCriteria.ISLAMIC_COMPLIANCE,
            threshold=0.9,
            weight=0.3,
            islamic_requirements={
                "family_respect": True,
                "religious_sensitivity": True,
            },
        )
        self.add_condition(islamic_condition)

        # Professional domain condition
        professional_condition = IraqiRoutingCondition(
            condition_id="manager_professional_domain",
            criteria=IraqiRoutingCriteria.PROFESSIONAL_DOMAIN,
            threshold=0.7,
            weight=0.2,
            professional_requirements={"domain_detection": True},
        )
        self.add_condition(professional_condition)

        # Arabic processing condition
        arabic_condition = IraqiRoutingCondition(
            condition_id="manager_arabic_processing",
            criteria=IraqiRoutingCriteria.ARABIC_PROCESSING,
            threshold=0.8,
            weight=0.2,
            arabic_requirements={"rtl_support": True, "dialect_recognition": True},
        )
        self.add_condition(arabic_condition)

    async def _select_target_node(
        self,
        state: Dict[str, Any],
        cultural_context: Dict[str, Any],
        available_nodes: List[str],
        condition_evaluations: List[Dict[str, Any]],
        confidence_score: float,
    ) -> str:
        """Select target node for manager routing"""

        # Check classification result
        classification = state.get("classification", {})
        action = classification.get("action", "")

        # High confidence routing based on classification
        if confidence_score > 0.8:
            if action == "start_planner" and "planner" in available_nodes:
                return "planner"
            elif action == "create_session" and "session_creator" in available_nodes:
                return "session_creator"
            elif (
                action == "validate_culture" and "cultural_validator" in available_nodes
            ):
                return "cultural_validator"

        # Medium confidence routing with cultural considerations
        elif confidence_score > 0.6:
            # If cultural validation is needed
            cultural_eval = next(
                (
                    eval
                    for eval in condition_evaluations
                    if eval["criteria"] == "cultural_compliance"
                ),
                None,
            )
            if cultural_eval and not cultural_eval.get("threshold_met", False):
                if "cultural_validator" in available_nodes:
                    return "cultural_validator"

            # Default to planner if available
            if "planner" in available_nodes:
                return "planner"

        # Low confidence - route to validation or end
        if "cultural_validator" in available_nodes:
            return "cultural_validator"
        elif "END" in available_nodes:
            return "END"

        # Fallback to first available node
        return available_nodes[0] if available_nodes else "END"


class IraqiProgrammerRouter(IraqiConditionalRouter):
    """Enhanced Programmer router for Iraqi execution decisions"""

    def __init__(self):
        super().__init__("programmer_router")
        self._initialize_programmer_conditions()

    def _initialize_programmer_conditions(self):
        """Initialize programmer-specific routing conditions"""

        # Cultural compliance condition (higher weight for execution)
        cultural_condition = IraqiRoutingCondition(
            condition_id="programmer_cultural_compliance",
            criteria=IraqiRoutingCriteria.CULTURAL_COMPLIANCE,
            threshold=0.9,
            weight=0.4,
            cultural_requirements={"execution_validation": True},
        )
        self.add_condition(cultural_condition)

        # Islamic compliance condition (critical for execution)
        islamic_condition = IraqiRoutingCondition(
            condition_id="programmer_islamic_compliance",
            criteria=IraqiRoutingCriteria.ISLAMIC_COMPLIANCE,
            threshold=0.95,
            weight=0.3,
            islamic_requirements={"action_compliance": True},
        )
        self.add_condition(islamic_condition)

        # Professional domain condition
        professional_condition = IraqiRoutingCondition(
            condition_id="programmer_professional_domain",
            criteria=IraqiRoutingCriteria.PROFESSIONAL_DOMAIN,
            threshold=0.8,
            weight=0.2,
            professional_requirements={"execution_standards": True},
        )
        self.add_condition(professional_condition)

        # Error recovery condition
        error_condition = IraqiRoutingCondition(
            condition_id="programmer_error_recovery",
            criteria=IraqiRoutingCriteria.ERROR_RECOVERY,
            threshold=0.7,
            weight=0.1,
        )
        self.add_condition(error_condition)

    async def _select_target_node(
        self,
        state: Dict[str, Any],
        cultural_context: Dict[str, Any],
        available_nodes: List[str],
        condition_evaluations: List[Dict[str, Any]],
        confidence_score: float,
    ) -> str:
        """Select target node for programmer routing"""

        # Check for errors first
        errors = state.get("errors", [])
        if errors and "error_handler" in available_nodes:
            return "error_handler"

        # Check for tool calls
        last_message = state.get("internal_messages", [])
        if last_message:
            last_msg = last_message[-1]
            if last_msg.get("tool_calls"):
                # Validate tool call culturally before executing
                if confidence_score > 0.9 and "take_action" in available_nodes:
                    return "take_action"
                elif "cultural_validator" in available_nodes:
                    return "cultural_validator"

        # Check if execution is complete
        execution_complete = state.get("execution_complete", False)
        if execution_complete and "reviewer" in available_nodes:
            return "reviewer"

        # Check if should continue generating actions
        remaining_tasks = state.get("remaining_tasks", [])
        if remaining_tasks and "generate_action" in available_nodes:
            return "generate_action"

        # Default routing based on confidence
        if confidence_score > 0.8:
            if "execute_action" in available_nodes:
                return "execute_action"
        elif confidence_score > 0.6:
            if "validate_action" in available_nodes:
                return "validate_action"

        # Fallback to review or end
        if "reviewer" in available_nodes:
            return "reviewer"

        return "END"


class IraqiRoutingOrchestrator:
    """Main orchestrator for Iraqi conditional routing"""

    def __init__(self):
        self.routers: Dict[str, IraqiConditionalRouter] = {}
        self.routing_history: List[IraqiRoutingDecision] = []
        self.performance_metrics: Dict[str, Any] = {}
        self.logger = logging.getLogger("IraqiRoutingOrchestrator")

        # Initialize routers
        self._initialize_routers()
        self._initialize_metrics()

    def _initialize_routers(self):
        """Initialize all routing components"""

        # Manager router
        self.routers["manager"] = IraqiManagerRouter()

        # Programmer router
        self.routers["programmer"] = IraqiProgrammerRouter()

        # Add more routers as needed
        self.logger.info(f"Initialized {len(self.routers)} routers")

    def _initialize_metrics(self):
        """Initialize performance tracking"""
        self.performance_metrics = {
            "total_routing_decisions": 0,
            "successful_routes": 0,
            "failed_routes": 0,
            "average_confidence": 0.0,
            "cultural_validation_rate": 0.0,
            "islamic_compliance_rate": 0.0,
            "professional_compliance_rate": 0.0,
            "routing_time_total": 0.0,
            "start_time": datetime.now(),
        }

    async def route_from_node(
        self,
        current_node: str,
        state: Dict[str, Any],
        cultural_context: Dict[str, Any],
        available_nodes: List[str],
    ) -> IraqiRoutingDecision:
        """Route from current node with comprehensive validation"""

        routing_start = datetime.now()

        try:
            # Get appropriate router
            router = self.routers.get(current_node)
            if not router:
                # Create default routing decision
                decision = IraqiRoutingDecision(
                    target_node=available_nodes[0] if available_nodes else "END",
                    confidence_score=0.5,
                    decision_rationale=f"No specific router for {current_node}, using default",
                    cultural_factors={},
                    islamic_compliance_factors={},
                    professional_factors={},
                    arabic_processing_factors={},
                    condition_evaluations=[],
                    timestamp=routing_start,
                )
            else:
                # Execute routing with specific router
                decision = await router.route(state, cultural_context, available_nodes)

            # Update metrics
            routing_time = (datetime.now() - routing_start).total_seconds()
            await self._update_metrics(decision, routing_time)

            # Record in global history
            self.routing_history.append(decision)

            return decision

        except Exception as e:
            self.logger.error(f"Routing failed for node {current_node}: {str(e)}")

            # Create error decision
            error_decision = IraqiRoutingDecision(
                target_node="error_handler"
                if "error_handler" in available_nodes
                else "END",
                confidence_score=0.0,
                decision_rationale=f"Routing error: {str(e)}",
                cultural_factors={},
                islamic_compliance_factors={},
                professional_factors={},
                arabic_processing_factors={},
                condition_evaluations=[],
                timestamp=routing_start,
            )

            self.performance_metrics["failed_routes"] += 1
            return error_decision

    async def _update_metrics(
        self, decision: IraqiRoutingDecision, routing_time: float
    ):
        """Update performance metrics"""

        self.performance_metrics["total_routing_decisions"] += 1
        self.performance_metrics["routing_time_total"] += routing_time

        if decision.confidence_score > 0.5:
            self.performance_metrics["successful_routes"] += 1

        # Update averages
        total_decisions = self.performance_metrics["total_routing_decisions"]
        current_avg = self.performance_metrics["average_confidence"]
        self.performance_metrics["average_confidence"] = (
            current_avg * (total_decisions - 1) + decision.confidence_score
        ) / total_decisions

        # Update compliance rates
        cultural_score = decision.cultural_factors.get("cultural_compliance_score", 0.0)
        islamic_score = decision.islamic_compliance_factors.get("score", 0.0)
        professional_score = decision.professional_factors.get("compliance_score", 0.0)

        current_cultural = self.performance_metrics["cultural_validation_rate"]
        current_islamic = self.performance_metrics["islamic_compliance_rate"]
        current_professional = self.performance_metrics["professional_compliance_rate"]

        self.performance_metrics["cultural_validation_rate"] = (
            current_cultural * (total_decisions - 1) + cultural_score
        ) / total_decisions
        self.performance_metrics["islamic_compliance_rate"] = (
            current_islamic * (total_decisions - 1) + islamic_score
        ) / total_decisions
        self.performance_metrics["professional_compliance_rate"] = (
            current_professional * (total_decisions - 1) + professional_score
        ) / total_decisions

    async def get_routing_analytics(self) -> Dict[str, Any]:
        """Get comprehensive routing analytics"""

        total_time = (
            datetime.now() - self.performance_metrics["start_time"]
        ).total_seconds()

        return {
            "total_routing_decisions": self.performance_metrics[
                "total_routing_decisions"
            ],
            "successful_routes": self.performance_metrics["successful_routes"],
            "failed_routes": self.performance_metrics["failed_routes"],
            "success_rate": (
                self.performance_metrics["successful_routes"]
                / self.performance_metrics["total_routing_decisions"]
                if self.performance_metrics["total_routing_decisions"] > 0
                else 0.0
            ),
            "average_confidence": self.performance_metrics["average_confidence"],
            "cultural_validation_rate": self.performance_metrics[
                "cultural_validation_rate"
            ],
            "islamic_compliance_rate": self.performance_metrics[
                "islamic_compliance_rate"
            ],
            "professional_compliance_rate": self.performance_metrics[
                "professional_compliance_rate"
            ],
            "average_routing_time": (
                self.performance_metrics["routing_time_total"]
                / self.performance_metrics["total_routing_decisions"]
                if self.performance_metrics["total_routing_decisions"] > 0
                else 0.0
            ),
            "total_session_time": total_time,
            "recent_decisions": [
                decision.to_dict() for decision in self.routing_history[-5:]
            ],
        }


# Example usage
async def example_iraqi_conditional_routing():
    """Example demonstrating Iraqi conditional routing"""

    # Initialize routing orchestrator
    orchestrator = IraqiRoutingOrchestrator()

    # Sample state
    state = {
        "current_node": "manager",
        "classification": {"action": "start_planner"},
        "islamic_compliance": {"score": 0.95, "compliance_issues": []},
        "arabic_processing": {"enabled": True, "processing_quality": 0.9},
        "family_validated": True,
        "religious_validated": True,
        "professional_validated": True,
    }

    # Cultural context
    cultural_context = {
        "family_context": True,
        "religious_context": True,
        "professional_context": True,
        "professional_domain": "medical",
        "regional_context": "Baghdad",
        "arabic_required": True,
    }

    # Available nodes
    available_nodes = ["planner", "cultural_validator", "END"]

    # Execute routing
    decision = await orchestrator.route_from_node(
        current_node="manager",
        state=state,
        cultural_context=cultural_context,
        available_nodes=available_nodes,
    )

    print(f"Routing decision: {decision.target_node}")
    print(f"Confidence: {decision.confidence_score:.2f}")
    print(f"Rationale: {decision.decision_rationale}")

    # Get analytics
    analytics = await orchestrator.get_routing_analytics()
    print(f"Routing analytics: {analytics}")

    return orchestrator


if __name__ == "__main__":
    # Run example
    asyncio.run(example_iraqi_conditional_routing())
