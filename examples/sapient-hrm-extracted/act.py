"""
Adaptive Computational Time (ACT) System - Iraqi Enhanced
========================================================

Implementation of Sapient HRM's Adaptive Computational Time system with Iraqi cultural integration.
Provides dynamic resource allocation, Q-learning optimization, and System 1/System 2 thinking patterns.

Key Features:
- Dynamic Resource Allocation: Adjusts computational depth based on problem complexity
- Q-Learning Optimization: Determines optimal stopping points for reasoning processes
- System 1 & System 2 Thinking: Alternates between automatic and deliberate reasoning
- Cultural Complexity Assessment: Evaluates Iraqi cultural and Islamic reasoning requirements

Iraqi AI Applications:
- Critical for balancing quick cultural responses vs. deep Islamic principle analysis
- Optimizes resource usage for Arabic text processing and cultural validation
- Enables adaptive reasoning depth based on cultural context complexity
- Provides intelligent cultural validation stopping criteria
"""

from typing import Dict, List, Optional, Any, Tuple, Union
from dataclasses import dataclass, field
from abc import ABC, abstractmethod
import asyncio
import json
import time
import numpy as np
from enum import Enum
from collections import deque
import random


class ThinkingSystem(Enum):
    """Dual thinking system modes"""

    SYSTEM_1 = "system_1"  # Fast, automatic, intuitive
    SYSTEM_2 = "system_2"  # Slow, deliberate, analytical


class ReasoningDepth(Enum):
    """Reasoning depth levels for cultural queries"""

    SURFACE = "surface"  # Quick cultural checks
    STANDARD = "standard"  # Normal cultural validation
    DEEP = "deep"  # Thorough Islamic analysis
    COMPREHENSIVE = "comprehensive"  # Full cultural-religious analysis


class CulturalComplexityLevel(Enum):
    """Complexity levels for Iraqi cultural content"""

    SIMPLE = "simple"  # Basic cultural questions
    MODERATE = "moderate"  # Standard cultural validation
    COMPLEX = "complex"  # Multi-domain cultural analysis
    CRITICAL = "critical"  # Islamic principle conflicts


@dataclass
class ACTConfig:
    """Configuration for Adaptive Computational Time system"""

    # Core ACT settings
    max_computation_steps: int = 20
    convergence_threshold: float = 0.95
    min_thinking_time_ms: int = 50
    max_thinking_time_ms: int = 5000

    # Iraqi cultural settings
    cultural_complexity_weight: float = 0.4
    islamic_analysis_weight: float = 0.3
    arabic_processing_weight: float = 0.2
    professional_domain_weight: float = 0.1

    # Q-learning parameters
    learning_rate: float = 0.1
    discount_factor: float = 0.9
    exploration_rate: float = 0.1
    exploration_decay: float = 0.995

    # System 1/2 thresholds
    system_1_threshold: float = 0.3  # Below this = automatic response
    system_2_threshold: float = 0.7  # Above this = deliberate analysis

    # Cultural quality thresholds
    cultural_quality_threshold: float = 0.98
    islamic_compliance_threshold: float = 1.0
    arabic_accuracy_threshold: float = 0.95


class CulturalComplexityDetector:
    """
    Detects and assesses complexity of Iraqi cultural content

    Analyzes multiple dimensions:
    - Islamic principle complexity
    - Cultural context depth
    - Arabic language processing requirements
    - Professional domain considerations
    """

    def __init__(self, config: ACTConfig):
        self.config = config
        self.complexity_patterns = {
            # Islamic complexity indicators
            "islamic_indicators": {
                "halal_haram": {"complexity": 0.9, "weight": 0.4},
                "religious_practices": {"complexity": 0.7, "weight": 0.3},
                "social_values": {"complexity": 0.6, "weight": 0.3},
            },
            # Cultural complexity indicators
            "cultural_indicators": {
                "family_values": {"complexity": 0.8, "weight": 0.3},
                "professional_etiquette": {"complexity": 0.6, "weight": 0.3},
                "social_customs": {"complexity": 0.5, "weight": 0.4},
            },
            # Arabic processing complexity
            "arabic_indicators": {
                "iraqi_dialect": {"complexity": 0.7, "weight": 0.4},
                "mixed_content": {"complexity": 0.8, "weight": 0.3},
                "rtl_layout": {"complexity": 0.6, "weight": 0.3},
            },
            # Professional domain complexity
            "professional_indicators": {
                "legal": {"complexity": 0.9, "weight": 0.4},
                "medical": {"complexity": 0.8, "weight": 0.3},
                "educational": {"complexity": 0.6, "weight": 0.3},
            },
        }

        # Learning history for complexity assessment
        self.assessment_history = deque(maxlen=1000)

    async def assess(self, cultural_query: Any) -> Dict[str, Any]:
        """Assess complexity of cultural query"""
        start_time = time.time()

        try:
            query_text = str(cultural_query).lower()

            # Assess each dimension
            islamic_complexity = await self._assess_islamic_complexity(query_text)
            cultural_complexity = await self._assess_cultural_complexity(query_text)
            arabic_complexity = await self._assess_arabic_complexity(query_text)
            professional_complexity = await self._assess_professional_complexity(
                query_text
            )

            # Calculate weighted overall complexity
            overall_complexity = (
                islamic_complexity * self.config.islamic_analysis_weight
                + cultural_complexity * self.config.cultural_complexity_weight
                + arabic_complexity * self.config.arabic_processing_weight
                + professional_complexity * self.config.professional_domain_weight
            )

            # Determine complexity level
            complexity_level = self._determine_complexity_level(overall_complexity)

            # Generate reasoning depth recommendation
            reasoning_depth = self._recommend_reasoning_depth(
                complexity_level, islamic_complexity
            )

            # Determine thinking system
            thinking_system = self._determine_thinking_system(overall_complexity)

            assessment_result = {
                "overall_complexity": overall_complexity,
                "complexity_level": complexity_level,
                "reasoning_depth": reasoning_depth,
                "thinking_system": thinking_system,
                "dimension_complexities": {
                    "islamic": islamic_complexity,
                    "cultural": cultural_complexity,
                    "arabic": arabic_complexity,
                    "professional": professional_complexity,
                },
                "assessment_time": time.time() - start_time,
                "confidence": self._calculate_assessment_confidence(overall_complexity),
            }

            # Record assessment for learning
            self.assessment_history.append(
                {
                    "query": query_text[:100],  # First 100 chars for privacy
                    "complexity": overall_complexity,
                    "level": complexity_level.value,
                    "timestamp": time.time(),
                }
            )

            return assessment_result

        except Exception as e:
            return {
                "overall_complexity": 0.5,  # Default medium complexity
                "complexity_level": CulturalComplexityLevel.MODERATE,
                "reasoning_depth": ReasoningDepth.STANDARD,
                "thinking_system": ThinkingSystem.SYSTEM_2,
                "error": str(e),
                "assessment_time": time.time() - start_time,
            }

    async def _assess_islamic_complexity(self, query_text: str) -> float:
        """Assess Islamic principle complexity in query"""
        complexity_score = 0.0
        total_weight = 0.0

        for indicator, data in self.complexity_patterns["islamic_indicators"].items():
            if self._contains_islamic_indicator(query_text, indicator):
                complexity_score += data["complexity"] * data["weight"]
                total_weight += data["weight"]

        return complexity_score / max(total_weight, 0.1)

    async def _assess_cultural_complexity(self, query_text: str) -> float:
        """Assess Iraqi cultural complexity in query"""
        complexity_score = 0.0
        total_weight = 0.0

        for indicator, data in self.complexity_patterns["cultural_indicators"].items():
            if self._contains_cultural_indicator(query_text, indicator):
                complexity_score += data["complexity"] * data["weight"]
                total_weight += data["weight"]

        return complexity_score / max(total_weight, 0.1)

    async def _assess_arabic_complexity(self, query_text: str) -> float:
        """Assess Arabic processing complexity"""
        complexity_score = 0.0

        # Check for Arabic content
        has_arabic = any("\u0600" <= char <= "\u06ff" for char in query_text)
        if not has_arabic:
            return 0.0

        # Iraqi dialect indicators
        iraqi_markers = ["شلونك", "شكو", "ماكو", "وين"]
        if any(marker in query_text for marker in iraqi_markers):
            complexity_score += 0.7

        # Mixed content complexity
        arabic_chars = sum(1 for char in query_text if "\u0600" <= char <= "\u06ff")
        english_chars = sum(
            1
            for char in query_text
            if char.isalpha() and not ("\u0600" <= char <= "\u06ff")
        )
        if arabic_chars > 0 and english_chars > 0:
            complexity_score += 0.8

        # RTL layout complexity
        if has_arabic:
            complexity_score += 0.6

        return min(complexity_score / 2.1, 1.0)  # Normalize

    async def _assess_professional_complexity(self, query_text: str) -> float:
        """Assess professional domain complexity"""
        complexity_score = 0.0

        # Legal domain indicators
        legal_terms = ["قانون", "محكمة", "قاض", "law", "court", "legal"]
        if any(term in query_text for term in legal_terms):
            complexity_score = max(complexity_score, 0.9)

        # Medical domain indicators
        medical_terms = ["طبيب", "مستشفى", "صحة", "doctor", "medical", "health"]
        if any(term in query_text for term in medical_terms):
            complexity_score = max(complexity_score, 0.8)

        # Educational domain indicators
        educational_terms = [
            "مدرسة",
            "جامعة",
            "تعليم",
            "school",
            "university",
            "education",
        ]
        if any(term in query_text for term in educational_terms):
            complexity_score = max(complexity_score, 0.6)

        return complexity_score

    def _contains_islamic_indicator(self, query_text: str, indicator: str) -> bool:
        """Check if query contains Islamic complexity indicators"""
        indicator_patterns = {
            "halal_haram": [
                "halal",
                "haram",
                "حلال",
                "حرام",
                "permissible",
                "forbidden",
            ],
            "religious_practices": [
                "prayer",
                "صلاة",
                "fasting",
                "صوم",
                "pilgrimage",
                "حج",
            ],
            "social_values": [
                "charity",
                "زكاة",
                "kindness",
                "إحسان",
                "justice",
                "عدالة",
            ],
        }

        patterns = indicator_patterns.get(indicator, [])
        return any(pattern in query_text for pattern in patterns)

    def _contains_cultural_indicator(self, query_text: str, indicator: str) -> bool:
        """Check if query contains cultural complexity indicators"""
        indicator_patterns = {
            "family_values": [
                "family",
                "عائلة",
                "parent",
                "والدين",
                "children",
                "أطفال",
            ],
            "professional_etiquette": [
                "respect",
                "احترام",
                "courtesy",
                "أدب",
                "professional",
                "مهني",
            ],
            "social_customs": [
                "tradition",
                "تقاليد",
                "custom",
                "عادات",
                "culture",
                "ثقافة",
            ],
        }

        patterns = indicator_patterns.get(indicator, [])
        return any(pattern in query_text for pattern in patterns)

    def _determine_complexity_level(
        self, overall_complexity: float
    ) -> CulturalComplexityLevel:
        """Determine complexity level from overall score"""
        if overall_complexity >= 0.8:
            return CulturalComplexityLevel.CRITICAL
        elif overall_complexity >= 0.6:
            return CulturalComplexityLevel.COMPLEX
        elif overall_complexity >= 0.4:
            return CulturalComplexityLevel.MODERATE
        else:
            return CulturalComplexityLevel.SIMPLE

    def _recommend_reasoning_depth(
        self, complexity_level: CulturalComplexityLevel, islamic_complexity: float
    ) -> ReasoningDepth:
        """Recommend reasoning depth based on complexity"""

        # Islamic content always requires deeper analysis
        if islamic_complexity > 0.5:
            if complexity_level == CulturalComplexityLevel.CRITICAL:
                return ReasoningDepth.COMPREHENSIVE
            else:
                return ReasoningDepth.DEEP

        # Non-Islamic content depth based on complexity
        if complexity_level == CulturalComplexityLevel.CRITICAL:
            return ReasoningDepth.DEEP
        elif complexity_level == CulturalComplexityLevel.COMPLEX:
            return ReasoningDepth.STANDARD
        else:
            return ReasoningDepth.SURFACE

    def _determine_thinking_system(self, overall_complexity: float) -> ThinkingSystem:
        """Determine appropriate thinking system"""
        if overall_complexity <= self.config.system_1_threshold:
            return ThinkingSystem.SYSTEM_1  # Fast, automatic
        elif overall_complexity >= self.config.system_2_threshold:
            return ThinkingSystem.SYSTEM_2  # Slow, deliberate
        else:
            # Mixed system - default to System 2 for safety in cultural contexts
            return ThinkingSystem.SYSTEM_2

    def _calculate_assessment_confidence(self, overall_complexity: float) -> float:
        """Calculate confidence in complexity assessment"""
        # Higher confidence for extreme values, lower for middle range
        distance_from_middle = abs(overall_complexity - 0.5)
        base_confidence = 0.7 + (distance_from_middle * 0.6)

        # Adjust based on assessment history
        if len(self.assessment_history) > 10:
            recent_variance = np.var(
                [item["complexity"] for item in list(self.assessment_history)[-10:]]
            )
            confidence_adjustment = max(0, 0.3 - recent_variance)
            base_confidence += confidence_adjustment

        return min(base_confidence, 1.0)


class QOptimizer:
    """
    Q-learning optimizer for cultural reasoning stopping criteria

    Learns optimal stopping points for different types of cultural reasoning
    to maximize accuracy while minimizing computational cost
    """

    def __init__(self, config: ACTConfig):
        self.config = config
        self.q_table = {}  # State-action Q-values
        self.state_history = deque(maxlen=1000)
        self.learning_stats = {
            "total_episodes": 0,
            "total_rewards": 0.0,
            "average_reward": 0.0,
            "exploration_rate": config.exploration_rate,
        }

    def get_state_key(
        self,
        complexity_level: CulturalComplexityLevel,
        reasoning_depth: ReasoningDepth,
        iteration: int,
    ) -> str:
        """Generate state key for Q-learning"""
        return f"{complexity_level.value}_{reasoning_depth.value}_{min(iteration, 10)}"

    def get_actions(self) -> List[str]:
        """Get available actions for Q-learning"""
        return ["continue", "stop"]

    def get_q_value(self, state_key: str, action: str) -> float:
        """Get Q-value for state-action pair"""
        if state_key not in self.q_table:
            self.q_table[state_key] = {action: 0.0 for action in self.get_actions()}

        return self.q_table[state_key][action]

    def update_q_value(
        self, state_key: str, action: str, reward: float, next_state_key: str
    ) -> None:
        """Update Q-value using Q-learning formula"""
        current_q = self.get_q_value(state_key, action)

        # Get maximum Q-value for next state
        if next_state_key:
            next_max_q = max(
                self.get_q_value(next_state_key, a) for a in self.get_actions()
            )
        else:
            next_max_q = 0.0  # Terminal state

        # Q-learning update
        new_q = current_q + self.config.learning_rate * (
            reward + self.config.discount_factor * next_max_q - current_q
        )

        self.q_table[state_key][action] = new_q

    def select_action(
        self,
        complexity_level: CulturalComplexityLevel,
        reasoning_depth: ReasoningDepth,
        iteration: int,
        current_quality: float,
    ) -> str:
        """Select action using epsilon-greedy policy"""

        state_key = self.get_state_key(complexity_level, reasoning_depth, iteration)

        # Epsilon-greedy action selection
        if random.random() < self.learning_stats["exploration_rate"]:
            # Exploration: random action
            action = random.choice(self.get_actions())
        else:
            # Exploitation: best action based on Q-values
            q_values = {
                action: self.get_q_value(state_key, action)
                for action in self.get_actions()
            }
            action = max(q_values, key=q_values.get)

        # Override with rule-based logic for safety in critical cultural contexts
        if complexity_level == CulturalComplexityLevel.CRITICAL:
            if current_quality < self.config.islamic_compliance_threshold:
                action = "continue"  # Always continue for critical Islamic content

        return action

    def calculate_reward(
        self,
        complexity_level: CulturalComplexityLevel,
        reasoning_depth: ReasoningDepth,
        final_quality: float,
        computation_time: float,
        iterations: int,
    ) -> float:
        """Calculate reward for Q-learning"""

        # Quality reward (most important for cultural contexts)
        quality_reward = final_quality * 10.0

        # Efficiency reward (negative for excessive computation)
        efficiency_penalty = min(computation_time / 1000.0, 5.0)  # Max 5 point penalty
        iteration_penalty = (
            max(0, iterations - 5) * 0.5
        )  # Penalty for too many iterations

        # Complexity-based adjustment
        complexity_multipliers = {
            CulturalComplexityLevel.SIMPLE: 0.8,
            CulturalComplexityLevel.MODERATE: 1.0,
            CulturalComplexityLevel.COMPLEX: 1.2,
            CulturalComplexityLevel.CRITICAL: 1.5,
        }

        complexity_multiplier = complexity_multipliers.get(complexity_level, 1.0)

        # Total reward
        total_reward = (
            quality_reward - efficiency_penalty - iteration_penalty
        ) * complexity_multiplier

        return total_reward

    def update_learning_stats(self, reward: float) -> None:
        """Update learning statistics"""
        self.learning_stats["total_episodes"] += 1
        self.learning_stats["total_rewards"] += reward
        self.learning_stats["average_reward"] = (
            self.learning_stats["total_rewards"] / self.learning_stats["total_episodes"]
        )

        # Decay exploration rate
        self.learning_stats["exploration_rate"] *= self.config.exploration_decay
        self.learning_stats["exploration_rate"] = max(
            self.learning_stats["exploration_rate"], 0.01
        )

    def get_optimization_stats(self) -> Dict[str, Any]:
        """Get Q-learning optimization statistics"""
        return {
            "q_table_size": len(self.q_table),
            "learning_stats": self.learning_stats,
            "recent_states": list(self.state_history)[-10:],
        }


class ReasoningDepthController:
    """
    Controls reasoning depth and computational allocation for Iraqi cultural reasoning

    Manages System 1 vs System 2 thinking and adaptive resource allocation
    """

    def __init__(self, config: ACTConfig):
        self.config = config
        self.depth_history = deque(maxlen=100)
        self.performance_metrics = {
            "system_1_accuracy": 0.0,
            "system_2_accuracy": 0.0,
            "average_depth_time": {},
            "depth_success_rates": {},
        }

    async def determine_reasoning_depth(
        self,
        complexity_assessment: Dict[str, Any],
        resource_constraints: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Determine optimal reasoning depth and computational allocation"""

        complexity_level = complexity_assessment["complexity_level"]
        thinking_system = complexity_assessment["thinking_system"]
        overall_complexity = complexity_assessment["overall_complexity"]

        # Base reasoning parameters
        if thinking_system == ThinkingSystem.SYSTEM_1:
            # Fast, automatic processing
            reasoning_params = {
                "max_iterations": 3,
                "time_limit_ms": 200,
                "quality_threshold": 0.8,
                "early_stopping": True,
                "computational_budget": "low",
            }
        else:  # System 2
            # Slow, deliberate processing
            reasoning_params = {
                "max_iterations": self.config.max_computation_steps,
                "time_limit_ms": self.config.max_thinking_time_ms,
                "quality_threshold": self.config.cultural_quality_threshold,
                "early_stopping": False,
                "computational_budget": "high",
            }

        # Adjust based on complexity level
        complexity_adjustments = {
            CulturalComplexityLevel.SIMPLE: {
                "iterations": 0.5,
                "time": 0.5,
                "quality": 0.9,
            },
            CulturalComplexityLevel.MODERATE: {
                "iterations": 0.8,
                "time": 0.8,
                "quality": 0.95,
            },
            CulturalComplexityLevel.COMPLEX: {
                "iterations": 1.0,
                "time": 1.0,
                "quality": 0.98,
            },
            CulturalComplexityLevel.CRITICAL: {
                "iterations": 1.5,
                "time": 1.5,
                "quality": 1.0,
            },
        }

        adjustment = complexity_adjustments.get(
            complexity_level, {"iterations": 1.0, "time": 1.0, "quality": 0.95}
        )

        reasoning_params["max_iterations"] = int(
            reasoning_params["max_iterations"] * adjustment["iterations"]
        )
        reasoning_params["time_limit_ms"] = int(
            reasoning_params["time_limit_ms"] * adjustment["time"]
        )
        reasoning_params["quality_threshold"] = min(
            reasoning_params["quality_threshold"] * adjustment["quality"], 1.0
        )

        # Resource constraint adjustments
        if resource_constraints:
            if resource_constraints.get("memory_limited", False):
                reasoning_params["max_iterations"] = min(
                    reasoning_params["max_iterations"], 5
                )
            if resource_constraints.get("time_critical", False):
                reasoning_params["time_limit_ms"] = min(
                    reasoning_params["time_limit_ms"], 1000
                )

        # Special handling for Islamic content
        islamic_complexity = complexity_assessment["dimension_complexities"]["islamic"]
        if islamic_complexity > 0.5:
            reasoning_params["quality_threshold"] = max(
                reasoning_params["quality_threshold"],
                self.config.islamic_compliance_threshold,
            )
            reasoning_params["early_stopping"] = (
                False  # Never stop early for Islamic content
            )

        return {
            "reasoning_depth": complexity_assessment["reasoning_depth"],
            "thinking_system": thinking_system,
            "reasoning_parameters": reasoning_params,
            "resource_allocation": self._calculate_resource_allocation(
                reasoning_params
            ),
            "cultural_priorities": self._determine_cultural_priorities(
                complexity_assessment
            ),
        }

    def _calculate_resource_allocation(
        self, reasoning_params: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Calculate computational resource allocation"""

        budget = reasoning_params["computational_budget"]

        if budget == "low":
            allocation = {
                "cpu_allocation": 0.3,
                "memory_allocation": 0.2,
                "parallel_processing": False,
                "caching_enabled": True,
                "optimization_level": "speed",
            }
        else:  # high
            allocation = {
                "cpu_allocation": 0.8,
                "memory_allocation": 0.6,
                "parallel_processing": True,
                "caching_enabled": True,
                "optimization_level": "quality",
            }

        return allocation

    def _determine_cultural_priorities(
        self, complexity_assessment: Dict[str, Any]
    ) -> List[str]:
        """Determine cultural validation priorities"""

        priorities = []
        dimension_complexities = complexity_assessment["dimension_complexities"]

        # Order by complexity (highest first)
        sorted_dimensions = sorted(
            dimension_complexities.items(), key=lambda x: x[1], reverse=True
        )

        for dimension, complexity in sorted_dimensions:
            if complexity > 0.3:  # Only include significant complexities
                if dimension == "islamic":
                    priorities.append("islamic_principle_validation")
                elif dimension == "cultural":
                    priorities.append("iraqi_cultural_appropriateness")
                elif dimension == "arabic":
                    priorities.append("arabic_rtl_processing")
                elif dimension == "professional":
                    priorities.append("professional_domain_validation")

        # Default priority if none detected
        if not priorities:
            priorities.append("general_cultural_validation")

        return priorities


class CulturalACT:
    """
    Main Adaptive Computational Time system for Iraqi cultural reasoning

    Integrates complexity detection, Q-learning optimization, and depth control
    for optimal cultural validation performance
    """

    def __init__(self, config: Optional[ACTConfig] = None):
        self.config = config or ACTConfig()

        # Core components
        self.complexity_detector = CulturalComplexityDetector(self.config)
        self.q_optimizer = QOptimizer(self.config)
        self.depth_controller = ReasoningDepthController(self.config)

        # System state
        self.active_reasonings = {}
        self.performance_history = deque(maxlen=1000)

        # Performance metrics
        self.system_metrics = {
            "total_reasonings": 0,
            "system_1_count": 0,
            "system_2_count": 0,
            "average_quality": 0.0,
            "average_computation_time": 0.0,
            "cultural_compliance_rate": 0.0,
        }

    async def determine_reasoning_depth(self, cultural_query: Any) -> Dict[str, Any]:
        """Main entry point for determining reasoning depth"""
        reasoning_id = f"act_{int(time.time() * 1000)}"
        start_time = time.time()

        try:
            # Assess complexity
            complexity_assessment = await self.complexity_detector.assess(
                cultural_query
            )

            # Determine reasoning depth and parameters
            reasoning_strategy = await self.depth_controller.determine_reasoning_depth(
                complexity_assessment
            )

            # Generate ACT decision
            act_decision = {
                "reasoning_id": reasoning_id,
                "complexity_assessment": complexity_assessment,
                "reasoning_strategy": reasoning_strategy,
                "thinking_system": complexity_assessment["thinking_system"],
                "recommended_depth": complexity_assessment["reasoning_depth"],
                "max_iterations": reasoning_strategy["reasoning_parameters"][
                    "max_iterations"
                ],
                "time_limit_ms": reasoning_strategy["reasoning_parameters"][
                    "time_limit_ms"
                ],
                "quality_threshold": reasoning_strategy["reasoning_parameters"][
                    "quality_threshold"
                ],
                "cultural_priorities": reasoning_strategy["cultural_priorities"],
                "resource_allocation": reasoning_strategy["resource_allocation"],
                "decision_time": time.time() - start_time,
            }

            # Store active reasoning
            self.active_reasonings[reasoning_id] = {
                "start_time": start_time,
                "complexity_level": complexity_assessment["complexity_level"],
                "thinking_system": complexity_assessment["thinking_system"],
                "parameters": reasoning_strategy["reasoning_parameters"],
            }

            return act_decision

        except Exception as e:
            return {
                "reasoning_id": reasoning_id,
                "status": "error",
                "error": str(e),
                "default_strategy": self._get_default_strategy(),
                "decision_time": time.time() - start_time,
            }

    async def should_continue_reasoning(
        self,
        reasoning_id: str,
        current_iteration: int,
        current_quality: float,
        computation_time: float,
    ) -> Dict[str, Any]:
        """Determine if reasoning should continue or stop"""

        if reasoning_id not in self.active_reasonings:
            return {"continue": False, "reason": "reasoning_not_found"}

        reasoning_info = self.active_reasonings[reasoning_id]
        complexity_level = reasoning_info["complexity_level"]
        reasoning_params = reasoning_info["parameters"]

        # Check hard limits
        if current_iteration >= reasoning_params["max_iterations"]:
            return {"continue": False, "reason": "max_iterations_reached"}

        if computation_time >= reasoning_params["time_limit_ms"]:
            return {"continue": False, "reason": "time_limit_reached"}

        # Check quality threshold
        if current_quality >= reasoning_params["quality_threshold"]:
            if reasoning_params.get("early_stopping", True):
                return {"continue": False, "reason": "quality_threshold_met"}

        # Use Q-learning to make decision for complex cases
        if complexity_level in [
            CulturalComplexityLevel.COMPLEX,
            CulturalComplexityLevel.CRITICAL,
        ]:
            reasoning_depth = reasoning_info.get(
                "reasoning_depth", ReasoningDepth.STANDARD
            )
            action = self.q_optimizer.select_action(
                complexity_level, reasoning_depth, current_iteration, current_quality
            )

            return {
                "continue": action == "continue",
                "reason": f"q_learning_decision_{action}",
                "confidence": self._calculate_decision_confidence(
                    current_quality, complexity_level
                ),
            }

        # Default: continue if quality not met
        return {
            "continue": current_quality < reasoning_params["quality_threshold"],
            "reason": "quality_based_decision",
            "confidence": 0.8,
        }

    async def complete_reasoning(
        self,
        reasoning_id: str,
        final_quality: float,
        total_iterations: int,
        total_time: float,
        cultural_compliance: bool,
    ) -> Dict[str, Any]:
        """Complete reasoning episode and update learning"""

        if reasoning_id not in self.active_reasonings:
            return {"status": "error", "reason": "reasoning_not_found"}

        reasoning_info = self.active_reasonings[reasoning_id]
        complexity_level = reasoning_info["complexity_level"]
        thinking_system = reasoning_info["thinking_system"]

        # Calculate reward for Q-learning
        reasoning_depth = reasoning_info.get("reasoning_depth", ReasoningDepth.STANDARD)
        reward = self.q_optimizer.calculate_reward(
            complexity_level,
            reasoning_depth,
            final_quality,
            total_time,
            total_iterations,
        )

        # Update Q-learning (simplified - would need proper state transitions)
        self.q_optimizer.update_learning_stats(reward)

        # Update system metrics
        await self._update_system_metrics(
            thinking_system, final_quality, total_time, cultural_compliance
        )

        # Record performance history
        performance_record = {
            "reasoning_id": reasoning_id,
            "complexity_level": complexity_level.value,
            "thinking_system": thinking_system.value,
            "final_quality": final_quality,
            "total_iterations": total_iterations,
            "total_time": total_time,
            "cultural_compliance": cultural_compliance,
            "reward": reward,
            "timestamp": time.time(),
        }

        self.performance_history.append(performance_record)

        # Clean up active reasoning
        del self.active_reasonings[reasoning_id]

        return {
            "status": "completed",
            "performance_record": performance_record,
            "learning_reward": reward,
            "system_updated": True,
        }

    def _get_default_strategy(self) -> Dict[str, Any]:
        """Get default reasoning strategy for error cases"""
        return {
            "thinking_system": ThinkingSystem.SYSTEM_2,
            "reasoning_depth": ReasoningDepth.STANDARD,
            "max_iterations": 5,
            "time_limit_ms": 2000,
            "quality_threshold": 0.95,
            "early_stopping": True,
        }

    def _calculate_decision_confidence(
        self, current_quality: float, complexity_level: CulturalComplexityLevel
    ) -> float:
        """Calculate confidence in continue/stop decision"""

        # Higher confidence for extreme quality values
        quality_confidence = 1.0 - 2 * abs(0.5 - current_quality)

        # Adjust based on complexity
        complexity_adjustments = {
            CulturalComplexityLevel.SIMPLE: 1.1,
            CulturalComplexityLevel.MODERATE: 1.0,
            CulturalComplexityLevel.COMPLEX: 0.9,
            CulturalComplexityLevel.CRITICAL: 0.8,
        }

        adjustment = complexity_adjustments.get(complexity_level, 1.0)
        return min(quality_confidence * adjustment, 1.0)

    async def _update_system_metrics(
        self,
        thinking_system: ThinkingSystem,
        final_quality: float,
        total_time: float,
        cultural_compliance: bool,
    ) -> None:
        """Update system performance metrics"""

        self.system_metrics["total_reasonings"] += 1
        total = self.system_metrics["total_reasonings"]

        # Update thinking system counts
        if thinking_system == ThinkingSystem.SYSTEM_1:
            self.system_metrics["system_1_count"] += 1
        else:
            self.system_metrics["system_2_count"] += 1

        # Update averages
        current_avg_quality = self.system_metrics["average_quality"]
        self.system_metrics["average_quality"] = (
            current_avg_quality * (total - 1) + final_quality
        ) / total

        current_avg_time = self.system_metrics["average_computation_time"]
        self.system_metrics["average_computation_time"] = (
            current_avg_time * (total - 1) + total_time
        ) / total

        # Update cultural compliance rate
        current_compliance_rate = self.system_metrics["cultural_compliance_rate"]
        new_compliance = (
            current_compliance_rate * (total - 1)
            + (1.0 if cultural_compliance else 0.0)
        ) / total
        self.system_metrics["cultural_compliance_rate"] = new_compliance

    def get_performance_summary(self) -> Dict[str, Any]:
        """Get comprehensive performance summary"""
        return {
            "system_metrics": self.system_metrics,
            "q_learning_stats": self.q_optimizer.get_optimization_stats(),
            "complexity_detector_stats": {
                "assessment_count": len(self.complexity_detector.assessment_history),
                "recent_assessments": list(self.complexity_detector.assessment_history)[
                    -5:
                ],
            },
            "active_reasonings": len(self.active_reasonings),
            "recent_performance": list(self.performance_history)[-10:],
        }


# Convenience class for simplified ACT usage
class AdaptiveComputationalTime(CulturalACT):
    """Simplified interface for Adaptive Computational Time system"""

    def __init__(self, **kwargs):
        config = ACTConfig(**kwargs)
        super().__init__(config)

    async def optimize(self, cultural_query: Any) -> Dict[str, Any]:
        """Simple optimization interface"""
        return await self.determine_reasoning_depth(cultural_query)
