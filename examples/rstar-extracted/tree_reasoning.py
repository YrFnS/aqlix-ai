"""
Tree-based Reasoning with Iraqi Cultural Branch Evaluation

This module implements sophisticated tree-based reasoning algorithms with deep
Iraqi cultural intelligence and Islamic principle guidance. The system provides
advanced branch evaluation, cultural path finding, and systematic tree pruning
while maintaining perfect cultural compliance.

Key Features:
- Cultural branch evaluation with Islamic principle scoring
- Iraqi context-aware tree building and navigation
- Intelligent tree pruning with cultural preservation
- Path finding with cultural appropriateness optimization
- Real-time cultural validation during tree exploration
- Professional domain integration with cultural awareness

Architecture Components:
- CulturalBranchEvaluator: Deep cultural assessment of reasoning branches
- IslamicPrincipleGuidedSearch: Search algorithm guided by Islamic values
- IraqiContextTreeBuilder: Tree construction with cultural intelligence
- TreePruningAlgorithm: Culturally-aware branch elimination
- CulturalPathFinder: Optimal path discovery with cultural scoring
"""

from typing import Dict, Any, List, Optional, Union, Tuple, Set, Callable, Awaitable
from dataclasses import dataclass, field
from enum import Enum
from abc import ABC, abstractmethod
import asyncio
import time
import logging
import json
import math
import heapq
from collections import defaultdict, deque

# Import core components
from .core import (
    CulturalBranch,
    ReasoningNode,
    ReasoningTree,
    CulturalScore,
    BranchStatus,
    CulturalValidationLevel,
    RStarConfig,
)


class SearchDirection(Enum):
    """Direction for tree search algorithms"""

    BREADTH_FIRST = "breadth_first"
    DEPTH_FIRST = "depth_first"
    BEST_FIRST = "best_first"
    CULTURAL_PRIORITY = "cultural_priority"
    ISLAMIC_GUIDED = "islamic_guided"


class PruningStrategy(Enum):
    """Strategies for tree pruning"""

    AGGRESSIVE = "aggressive"  # Prune low-scoring branches quickly
    CONSERVATIVE = "conservative"  # Preserve branches for exploration
    BALANCED = "balanced"  # Balance exploration vs exploitation
    CULTURAL_FOCUSED = "cultural"  # Prioritize cultural appropriateness
    ISLAMIC_STRICT = "islamic"  # Strict Islamic compliance requirements


class CulturalPathType(Enum):
    """Types of cultural reasoning paths"""

    ISLAMIC_PRINCIPLES = "islamic_principles"
    IRAQI_CULTURAL = "iraqi_cultural"
    PROFESSIONAL_DOMAIN = "professional_domain"
    ETHICAL_REASONING = "ethical_reasoning"
    SYSTEMATIC_ANALYSIS = "systematic_analysis"
    MIXED_APPROACH = "mixed_approach"


@dataclass
class BranchEvaluationCriteria:
    """Criteria for evaluating reasoning branches"""

    islamic_compliance_weight: float = 0.3
    cultural_appropriateness_weight: float = 0.25
    professional_accuracy_weight: float = 0.25
    ethical_alignment_weight: float = 0.2
    min_overall_threshold: float = 0.8
    min_islamic_threshold: float = 0.9
    require_professional_validation: bool = True
    cultural_sensitivity_level: CulturalValidationLevel = (
        CulturalValidationLevel.STANDARD
    )


@dataclass
class CulturalPath:
    """Represents a culturally-validated reasoning path"""

    path_id: str
    node_sequence: List[str]
    branch_sequence: List[str]
    path_type: CulturalPathType
    total_cultural_score: float
    path_depth: int
    reasoning_steps: List[str]
    cultural_validations: List[CulturalScore]
    execution_time_ms: float
    is_complete: bool = False
    is_optimal: bool = False


class CulturalBranchEvaluator:
    """Advanced cultural evaluation system for reasoning branches"""

    def __init__(self, config: RStarConfig):
        self.config = config
        self.logger = logging.getLogger(f"{__name__}.CulturalBranchEvaluator")

        # Evaluation settings
        self.evaluation_criteria = BranchEvaluationCriteria()
        self.cultural_patterns_cache: Dict[str, float] = {}
        self.evaluation_history: List[Dict[str, Any]] = []

        # Islamic principles knowledge base
        self.islamic_principles = {
            "justice": {
                "arabic": "العدل",
                "weight": 0.95,
                "keywords": [
                    "fair",
                    "equal",
                    "justice",
                    "rights",
                    "عدل",
                    "حق",
                    "انصاف",
                ],
                "negative_keywords": ["unfair", "biased", "discriminate", "ظلم"],
            },
            "compassion": {
                "arabic": "الرحمة",
                "weight": 0.90,
                "keywords": [
                    "mercy",
                    "kind",
                    "compassion",
                    "help",
                    "رحمة",
                    "طيبة",
                    "مساعدة",
                ],
                "negative_keywords": ["cruel", "harsh", "merciless", "قسوة"],
            },
            "honesty": {
                "arabic": "الصدق",
                "weight": 0.92,
                "keywords": [
                    "truth",
                    "honest",
                    "transparent",
                    "sincere",
                    "صدق",
                    "شفافية",
                ],
                "negative_keywords": ["lie", "deceive", "false", "كذب", "خداع"],
            },
            "wisdom": {
                "arabic": "الحكمة",
                "weight": 0.88,
                "keywords": [
                    "wise",
                    "thoughtful",
                    "careful",
                    "prudent",
                    "حكمة",
                    "تفكير",
                ],
                "negative_keywords": ["reckless", "impulsive", "foolish", "تهور"],
            },
            "respect": {
                "arabic": "الاحترام",
                "weight": 0.90,
                "keywords": [
                    "respect",
                    "dignity",
                    "honor",
                    "courtesy",
                    "احترام",
                    "كرامة",
                ],
                "negative_keywords": ["disrespect", "insult", "degrade", "اهانة"],
            },
        }

        # Iraqi cultural values knowledge base
        self.iraqi_cultural_values = {
            "hospitality": {
                "arabic": "الضيافة",
                "importance": 0.95,
                "keywords": ["welcome", "guest", "generous", "ضيافة", "كرم", "استقبال"],
                "contexts": ["social", "business", "family"],
            },
            "family_orientation": {
                "arabic": "التوجه العائلي",
                "importance": 0.92,
                "keywords": ["family", "relatives", "kinship", "عائلة", "أهل", "قرابة"],
                "contexts": ["personal", "social", "decision_making"],
            },
            "respect_for_elders": {
                "arabic": "احترام الكبار",
                "importance": 0.88,
                "keywords": ["elder", "senior", "experience", "wisdom", "كبير", "خبرة"],
                "contexts": ["family", "professional", "social"],
            },
            "education_reverence": {
                "arabic": "تقدير التعليم",
                "importance": 0.90,
                "keywords": [
                    "education",
                    "knowledge",
                    "teacher",
                    "learning",
                    "تعليم",
                    "معرفة",
                    "استاذ",
                ],
                "contexts": ["educational", "professional", "social"],
            },
            "community_solidarity": {
                "arabic": "التضامن المجتمعي",
                "importance": 0.87,
                "keywords": [
                    "community",
                    "solidarity",
                    "support",
                    "together",
                    "مجتمع",
                    "تضامن",
                    "دعم",
                ],
                "contexts": ["social", "crisis", "collective"],
            },
        }

        # Professional domain validation patterns
        self.professional_patterns = {
            "legal": {
                "validation_keywords": [
                    "law",
                    "legal",
                    "court",
                    "rights",
                    "قانون",
                    "حقوق",
                    "محكمة",
                ],
                "accuracy_indicators": [
                    "precedent",
                    "evidence",
                    "procedure",
                    "سابقة",
                    "دليل",
                ],
                "cultural_considerations": [
                    "islamic_law_compatibility",
                    "traditional_dispute_resolution",
                ],
            },
            "medical": {
                "validation_keywords": [
                    "health",
                    "medical",
                    "treatment",
                    "care",
                    "صحة",
                    "طبي",
                    "علاج",
                ],
                "accuracy_indicators": [
                    "diagnosis",
                    "symptom",
                    "treatment",
                    "تشخيص",
                    "عرض",
                ],
                "cultural_considerations": [
                    "islamic_medical_ethics",
                    "family_involvement",
                    "privacy",
                ],
            },
            "educational": {
                "validation_keywords": [
                    "education",
                    "teaching",
                    "learning",
                    "student",
                    "تعليم",
                    "طلاب",
                ],
                "accuracy_indicators": [
                    "curriculum",
                    "assessment",
                    "development",
                    "منهج",
                    "تقييم",
                ],
                "cultural_considerations": [
                    "respect_for_teacher",
                    "collective_learning",
                    "moral_education",
                ],
            },
            "business": {
                "validation_keywords": [
                    "business",
                    "management",
                    "strategy",
                    "أعمال",
                    "إدارة",
                ],
                "accuracy_indicators": [
                    "profit",
                    "efficiency",
                    "growth",
                    "ربح",
                    "كفاءة",
                    "نمو",
                ],
                "cultural_considerations": [
                    "relationship_based",
                    "trust_building",
                    "long_term_thinking",
                ],
            },
        }

    async def evaluate_branch_comprehensively(
        self, branch: CulturalBranch, evaluation_context: Dict[str, Any] = None
    ) -> CulturalScore:
        """Perform comprehensive cultural evaluation of a reasoning branch"""

        start_time = time.time()

        try:
            # Extract evaluation context
            context = evaluation_context or {}
            professional_domain = context.get("professional_domain", "general")
            cultural_sensitivity_required = context.get(
                "cultural_sensitivity_required", True
            )
            islamic_compliance_required = context.get(
                "islamic_compliance_required", True
            )

            # Perform multi-dimensional evaluation
            islamic_score = await self._evaluate_islamic_principles(
                branch, islamic_compliance_required
            )
            cultural_score = await self._evaluate_iraqi_cultural_appropriateness(
                branch, cultural_sensitivity_required
            )
            professional_score = await self._evaluate_professional_domain_accuracy(
                branch, professional_domain
            )
            ethical_score = await self._evaluate_ethical_alignment(branch)

            # Calculate weighted overall score
            overall_score = (
                islamic_score * self.evaluation_criteria.islamic_compliance_weight
                + cultural_score
                * self.evaluation_criteria.cultural_appropriateness_weight
                + professional_score
                * self.evaluation_criteria.professional_accuracy_weight
                + ethical_score * self.evaluation_criteria.ethical_alignment_weight
            )

            # Generate detailed validation notes
            validation_notes = await self._generate_comprehensive_validation_notes(
                islamic_score,
                cultural_score,
                professional_score,
                ethical_score,
                context,
            )

            # Create cultural score result
            cultural_score_result = CulturalScore(
                islamic_compliance=islamic_score,
                cultural_appropriateness=cultural_score,
                professional_accuracy=professional_score,
                ethical_alignment=ethical_score,
                overall_score=overall_score,
                validation_notes=validation_notes,
            )

            # Record evaluation
            evaluation_record = {
                "branch_id": branch.branch_id,
                "timestamp": time.time(),
                "evaluation_context": context,
                "scores": {
                    "islamic_compliance": islamic_score,
                    "cultural_appropriateness": cultural_score,
                    "professional_accuracy": professional_score,
                    "ethical_alignment": ethical_score,
                    "overall_score": overall_score,
                },
                "processing_time_ms": (time.time() - start_time) * 1000,
            }

            self.evaluation_history.append(evaluation_record)

            # Cache cultural patterns for future use
            await self._cache_cultural_patterns(branch, cultural_score_result)

            self.logger.debug(
                f"Branch {branch.branch_id[:8]} evaluation: {overall_score:.3f}"
            )

            return cultural_score_result

        except Exception as e:
            self.logger.error(
                f"Branch evaluation failed for {branch.branch_id[:8]}: {e}"
            )
            raise

    async def _evaluate_islamic_principles(
        self, branch: CulturalBranch, required: bool
    ) -> float:
        """Evaluate adherence to Islamic principles"""

        reasoning_text = str(branch.reasoning_step).lower()
        reasoning_content = str(branch.reasoning_content).lower()
        combined_text = f"{reasoning_text} {reasoning_content}"

        principle_scores = []

        for principle, data in self.islamic_principles.items():
            principle_score = 0.0

            # Check for positive indicators
            positive_matches = sum(
                1 for keyword in data["keywords"] if keyword in combined_text
            )
            if positive_matches > 0:
                principle_score += min(0.3, positive_matches * 0.1)

            # Penalize negative indicators
            negative_matches = sum(
                1 for keyword in data["negative_keywords"] if keyword in combined_text
            )
            if negative_matches > 0:
                principle_score -= min(0.4, negative_matches * 0.2)

            # Weight by principle importance
            weighted_score = principle_score * data["weight"]
            principle_scores.append(max(0.0, min(1.0, weighted_score)))

        # Base Islamic compliance score
        if principle_scores:
            base_score = sum(principle_scores) / len(principle_scores)
        else:
            base_score = 0.7  # Neutral score if no indicators found

        # Adjust for requirements
        if required:
            # Higher standards when Islamic compliance is required
            if base_score < 0.5:
                base_score *= 0.8  # Penalize low scores more
            else:
                base_score = min(1.0, base_score * 1.1)  # Slight boost for compliance

        # Final adjustments based on cultural context
        cultural_context = branch.cultural_context
        if cultural_context.get("islamic_principles_applicable", True):
            # Ensure minimum compliance in Islamic contexts
            base_score = max(base_score, 0.6)

        return max(0.0, min(1.0, base_score))

    async def _evaluate_iraqi_cultural_appropriateness(
        self, branch: CulturalBranch, required: bool
    ) -> float:
        """Evaluate Iraqi cultural appropriateness"""

        reasoning_text = str(branch.reasoning_step).lower()
        reasoning_content = str(branch.reasoning_content).lower()
        combined_text = f"{reasoning_text} {reasoning_content}"

        cultural_scores = []

        for value, data in self.iraqi_cultural_values.items():
            value_score = 0.0

            # Check for cultural value indicators
            keyword_matches = sum(
                1 for keyword in data["keywords"] if keyword in combined_text
            )
            if keyword_matches > 0:
                value_score = min(0.25, keyword_matches * 0.08)

            # Context relevance boost
            cultural_context = branch.cultural_context
            branch_context = cultural_context.get("cultural_domain", "general")

            if branch_context in data["contexts"]:
                value_score *= 1.2

            # Weight by cultural importance
            weighted_score = value_score * data["importance"]
            cultural_scores.append(weighted_score)

        # Base cultural appropriateness score
        if cultural_scores:
            base_score = 0.8 + (sum(cultural_scores) * 0.2)  # Start at 0.8, add bonuses
        else:
            base_score = 0.75  # Default score

        # Check for cultural sensitivity issues
        sensitive_topics = ["politics", "sectarian", "tribal", "controversial"]
        sensitivity_penalty = sum(
            0.15 for topic in sensitive_topics if topic in combined_text
        )
        base_score -= sensitivity_penalty

        # Professional context adjustments
        professional_context = branch.cultural_context.get("professional_context")
        if professional_context and professional_context in self.professional_patterns:
            cultural_considerations = self.professional_patterns[professional_context][
                "cultural_considerations"
            ]

            # Boost score if cultural considerations are addressed
            for consideration in cultural_considerations:
                if any(
                    keyword in combined_text for keyword in consideration.split("_")
                ):
                    base_score += 0.03

        return max(0.0, min(1.0, base_score))

    async def _evaluate_professional_domain_accuracy(
        self, branch: CulturalBranch, domain: str
    ) -> float:
        """Evaluate professional domain accuracy"""

        if domain == "general":
            return 0.8  # Default score for general reasoning

        reasoning_text = str(branch.reasoning_step).lower()
        reasoning_content = str(branch.reasoning_content).lower()
        combined_text = f"{reasoning_text} {reasoning_content}"

        if domain not in self.professional_patterns:
            return 0.7  # Default for unknown domains

        domain_data = self.professional_patterns[domain]

        # Check domain relevance
        validation_keywords = domain_data["validation_keywords"]
        relevance_score = sum(
            1 for keyword in validation_keywords if keyword in combined_text
        )
        relevance_ratio = (
            relevance_score / len(validation_keywords) if validation_keywords else 0
        )

        # Check accuracy indicators
        accuracy_keywords = domain_data["accuracy_indicators"]
        accuracy_score = sum(
            1 for keyword in accuracy_keywords if keyword in combined_text
        )
        accuracy_ratio = (
            accuracy_score / len(accuracy_keywords) if accuracy_keywords else 0
        )

        # Base professional accuracy
        base_score = 0.7 + (relevance_ratio * 0.2) + (accuracy_ratio * 0.1)

        # Cultural considerations bonus
        cultural_considerations = domain_data["cultural_considerations"]
        cultural_bonus = 0
        for consideration in cultural_considerations:
            consideration_keywords = consideration.split("_")
            if any(keyword in combined_text for keyword in consideration_keywords):
                cultural_bonus += 0.02

        final_score = base_score + cultural_bonus

        return max(0.0, min(1.0, final_score))

    async def _evaluate_ethical_alignment(self, branch: CulturalBranch) -> float:
        """Evaluate ethical alignment of reasoning"""

        reasoning_text = str(branch.reasoning_step).lower()
        reasoning_content = str(branch.reasoning_content).lower()
        combined_text = f"{reasoning_text} {reasoning_content}"

        # Ethical principles
        positive_ethical_indicators = [
            "benefit",
            "help",
            "improve",
            "positive",
            "constructive",
            "fair",
            "just",
            "honest",
            "transparent",
            "responsible",
            "respect",
            "dignity",
            "integrity",
            "trust",
            "accountability",
        ]

        negative_ethical_indicators = [
            "harm",
            "damage",
            "hurt",
            "unfair",
            "unjust",
            "deceptive",
            "misleading",
            "biased",
            "discriminate",
            "exploit",
            "manipulate",
            "abuse",
            "violate",
        ]

        # Calculate ethical score
        positive_score = sum(
            0.05
            for indicator in positive_ethical_indicators
            if indicator in combined_text
        )
        negative_penalty = sum(
            0.1
            for indicator in negative_ethical_indicators
            if indicator in combined_text
        )

        base_ethical_score = 0.8 + positive_score - negative_penalty

        # Context-specific adjustments
        cultural_context = branch.cultural_context
        if cultural_context.get("ethical_sensitivity_required", False):
            # Higher standards for ethically sensitive contexts
            if base_ethical_score < 0.9:
                base_ethical_score *= 0.9

        return max(0.0, min(1.0, base_ethical_score))

    async def _generate_comprehensive_validation_notes(
        self,
        islamic_score: float,
        cultural_score: float,
        professional_score: float,
        ethical_score: float,
        context: Dict[str, Any],
    ) -> List[str]:
        """Generate detailed validation notes"""

        notes = []

        # Islamic compliance notes
        if islamic_score < 0.8:
            notes.append(
                "Consider strengthening Islamic principle alignment and compliance"
            )
        elif islamic_score > 0.95:
            notes.append("Excellent Islamic principle integration demonstrated")

        # Cultural appropriateness notes
        if cultural_score < 0.8:
            notes.append(
                "Review Iraqi cultural appropriateness and social sensitivities"
            )
        elif cultural_score > 0.9:
            notes.append("Strong Iraqi cultural awareness and sensitivity shown")

        # Professional accuracy notes
        professional_domain = context.get("professional_domain", "general")
        if professional_domain != "general":
            if professional_score < 0.8:
                notes.append(
                    f"Enhance {professional_domain} domain accuracy and expertise"
                )
            elif professional_score > 0.9:
                notes.append(
                    f"Excellent {professional_domain} professional competence displayed"
                )

        # Ethical alignment notes
        if ethical_score < 0.8:
            notes.append(
                "Address potential ethical concerns and improve moral alignment"
            )
        elif ethical_score > 0.95:
            notes.append(
                "Outstanding ethical awareness and moral reasoning demonstrated"
            )

        # Overall assessment
        overall_score = (
            islamic_score + cultural_score + professional_score + ethical_score
        ) / 4
        if overall_score > 0.9:
            notes.append("Comprehensive validation passed with distinction")
        elif overall_score < 0.75:
            notes.append("Significant improvements needed across multiple dimensions")

        return notes

    async def _cache_cultural_patterns(
        self, branch: CulturalBranch, cultural_score: CulturalScore
    ):
        """Cache cultural patterns for future optimization"""

        reasoning_pattern = str(branch.reasoning_step)[:100]  # First 100 chars
        pattern_hash = str(hash(reasoning_pattern))

        self.cultural_patterns_cache[pattern_hash] = cultural_score.overall_score

        # Limit cache size
        if len(self.cultural_patterns_cache) > 1000:
            # Remove oldest entries (simple FIFO)
            oldest_keys = list(self.cultural_patterns_cache.keys())[:200]
            for key in oldest_keys:
                del self.cultural_patterns_cache[key]

    def get_evaluation_statistics(self) -> Dict[str, Any]:
        """Get comprehensive evaluation statistics"""

        if not self.evaluation_history:
            return {"message": "No evaluations performed yet"}

        recent_evaluations = self.evaluation_history[-100:]  # Last 100 evaluations

        # Calculate averages
        avg_islamic = sum(
            eval_["scores"]["islamic_compliance"] for eval_ in recent_evaluations
        ) / len(recent_evaluations)
        avg_cultural = sum(
            eval_["scores"]["cultural_appropriateness"] for eval_ in recent_evaluations
        ) / len(recent_evaluations)
        avg_professional = sum(
            eval_["scores"]["professional_accuracy"] for eval_ in recent_evaluations
        ) / len(recent_evaluations)
        avg_ethical = sum(
            eval_["scores"]["ethical_alignment"] for eval_ in recent_evaluations
        ) / len(recent_evaluations)
        avg_overall = sum(
            eval_["scores"]["overall_score"] for eval_ in recent_evaluations
        ) / len(recent_evaluations)
        avg_processing_time = sum(
            eval_["processing_time_ms"] for eval_ in recent_evaluations
        ) / len(recent_evaluations)

        # Calculate pass rates
        islamic_pass_rate = sum(
            1
            for eval_ in recent_evaluations
            if eval_["scores"]["islamic_compliance"] >= 0.8
        ) / len(recent_evaluations)
        cultural_pass_rate = sum(
            1
            for eval_ in recent_evaluations
            if eval_["scores"]["cultural_appropriateness"] >= 0.8
        ) / len(recent_evaluations)
        overall_pass_rate = sum(
            1 for eval_ in recent_evaluations if eval_["scores"]["overall_score"] >= 0.8
        ) / len(recent_evaluations)

        return {
            "total_evaluations": len(self.evaluation_history),
            "recent_evaluations_analyzed": len(recent_evaluations),
            "average_scores": {
                "islamic_compliance": avg_islamic,
                "cultural_appropriateness": avg_cultural,
                "professional_accuracy": avg_professional,
                "ethical_alignment": avg_ethical,
                "overall_score": avg_overall,
            },
            "pass_rates": {
                "islamic_compliance": islamic_pass_rate,
                "cultural_appropriateness": cultural_pass_rate,
                "overall_validation": overall_pass_rate,
            },
            "performance_metrics": {
                "average_processing_time_ms": avg_processing_time,
                "cached_patterns": len(self.cultural_patterns_cache),
            },
            "evaluation_criteria": {
                "min_overall_threshold": self.evaluation_criteria.min_overall_threshold,
                "min_islamic_threshold": self.evaluation_criteria.min_islamic_threshold,
                "cultural_sensitivity_level": self.evaluation_criteria.cultural_sensitivity_level.value,
            },
        }


class IslamicPrincipleGuidedSearch:
    """Search algorithm guided by Islamic principles and values"""

    def __init__(self, config: RStarConfig, evaluator: CulturalBranchEvaluator):
        self.config = config
        self.evaluator = evaluator
        self.logger = logging.getLogger(f"{__name__}.IslamicPrincipleGuidedSearch")

        # Islamic guidance principles for search
        self.guidance_principles = {
            "seek_knowledge": {
                "priority": 0.95,
                "guidance": "Prioritize branches that increase understanding and wisdom",
                "search_bias": "depth_first",
            },
            "choose_just_path": {
                "priority": 0.90,
                "guidance": "Favor branches that promote justice and fairness",
                "search_bias": "best_first",
            },
            "show_mercy": {
                "priority": 0.85,
                "guidance": "Consider compassionate and beneficial solutions",
                "search_bias": "breadth_first",
            },
            "avoid_harm": {
                "priority": 0.92,
                "guidance": "Actively avoid branches that may cause harm",
                "search_bias": "pruning",
            },
            "maintain_integrity": {
                "priority": 0.88,
                "guidance": "Ensure honesty and transparency in reasoning",
                "search_bias": "validation",
            },
        }

    async def search_with_islamic_guidance(
        self,
        tree: ReasoningTree,
        search_objective: str,
        cultural_context: Dict[str, Any] = None,
    ) -> List[CulturalPath]:
        """Perform tree search guided by Islamic principles"""

        start_time = time.time()

        if not tree.root_node_id:
            raise ValueError("Tree must have root node for search")

        try:
            # Determine search strategy based on Islamic guidance
            search_strategy = await self._determine_islamic_search_strategy(
                search_objective, cultural_context
            )

            # Initialize search state
            search_state = {
                "visited_nodes": set(),
                "cultural_paths": [],
                "priority_queue": [
                    (0, tree.root_node_id, [])
                ],  # (priority, node_id, path)
                "best_cultural_score": 0.0,
                "islamic_compliance_violations": 0,
            }

            # Perform guided search
            paths = await self._execute_guided_search(
                tree, search_state, search_strategy, search_objective
            )

            # Filter and rank paths by Islamic principles
            islamic_validated_paths = await self._validate_paths_islamically(paths)

            execution_time_ms = (time.time() - start_time) * 1000

            self.logger.info(
                f"Islamic guided search completed: {len(islamic_validated_paths)} paths found in {execution_time_ms:.2f}ms"
            )

            return islamic_validated_paths

        except Exception as e:
            self.logger.error(f"Islamic guided search failed: {e}")
            raise

    async def _determine_islamic_search_strategy(
        self, search_objective: str, cultural_context: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """Determine search strategy based on Islamic guidance principles"""

        objective_lower = search_objective.lower()
        context = cultural_context or {}

        # Analyze objective against Islamic principles
        principle_relevance = {}
        for principle, data in self.guidance_principles.items():
            relevance = 0.0

            if principle == "seek_knowledge" and any(
                word in objective_lower
                for word in ["learn", "understand", "knowledge", "wisdom"]
            ):
                relevance = 0.9
            elif principle == "choose_just_path" and any(
                word in objective_lower
                for word in ["fair", "just", "right", "equitable"]
            ):
                relevance = 0.85
            elif principle == "show_mercy" and any(
                word in objective_lower
                for word in ["help", "compassion", "benefit", "support"]
            ):
                relevance = 0.8
            elif principle == "avoid_harm" and any(
                word in objective_lower
                for word in ["prevent", "avoid", "protect", "safety"]
            ):
                relevance = 0.95
            elif principle == "maintain_integrity" and any(
                word in objective_lower
                for word in ["honest", "truth", "transparent", "integrity"]
            ):
                relevance = 0.88

            principle_relevance[principle] = relevance

        # Select primary guidance principle
        primary_principle = max(principle_relevance.items(), key=lambda x: x[1])
        primary_principle_name, primary_relevance = primary_principle

        # Determine search parameters
        if primary_relevance > 0.7:
            primary_data = self.guidance_principles[primary_principle_name]
            search_strategy = {
                "primary_principle": primary_principle_name,
                "search_bias": primary_data["search_bias"],
                "priority_weight": primary_data["priority"],
                "guidance_text": primary_data["guidance"],
                "islamic_threshold": 0.9,
                "cultural_threshold": 0.8,
                "max_depth": self.config.max_reasoning_depth,
                "exploration_factor": 0.7
                if primary_data["search_bias"] == "depth_first"
                else 0.9,
            }
        else:
            # Default balanced strategy
            search_strategy = {
                "primary_principle": "balanced_approach",
                "search_bias": "best_first",
                "priority_weight": 0.8,
                "guidance_text": "Use balanced Islamic approach to reasoning",
                "islamic_threshold": 0.85,
                "cultural_threshold": 0.8,
                "max_depth": self.config.max_reasoning_depth,
                "exploration_factor": 0.8,
            }

        # Add context-specific adjustments
        if context.get("professional_context") in ["legal", "medical"]:
            search_strategy["islamic_threshold"] = 0.95  # Higher standards
            search_strategy["cultural_threshold"] = 0.85

        return search_strategy

    async def _execute_guided_search(
        self,
        tree: ReasoningTree,
        search_state: Dict[str, Any],
        strategy: Dict[str, Any],
        objective: str,
    ) -> List[CulturalPath]:
        """Execute the Islamic-guided search algorithm"""

        max_iterations = 50
        iterations = 0
        found_paths = []

        while search_state["priority_queue"] and iterations < max_iterations:
            # Get next node to explore
            priority, node_id, current_path = heapq.heappop(
                search_state["priority_queue"]
            )

            if node_id in search_state["visited_nodes"]:
                continue

            search_state["visited_nodes"].add(node_id)
            iterations += 1

            # Get node
            node = tree.nodes.get(node_id)
            if not node:
                continue

            # Expand node if not already expanded
            if not node.expansion_attempted:
                await node.expand_node()

            # Evaluate branches according to Islamic principles
            for branch_id, branch in node.branches.items():
                if branch.should_be_pruned():
                    continue

                # Evaluate branch with Islamic focus
                cultural_score = await self.evaluator.evaluate_branch_comprehensively(
                    branch, {"islamic_focus": True, "objective": objective}
                )

                # Check Islamic compliance
                if cultural_score.islamic_compliance < strategy["islamic_threshold"]:
                    search_state["islamic_compliance_violations"] += 1
                    continue

                # Check cultural appropriateness
                if (
                    cultural_score.cultural_appropriateness
                    < strategy["cultural_threshold"]
                ):
                    continue

                # Create path
                new_path = current_path + [node_id]

                # Check if this forms a complete reasoning path
                if self._is_complete_reasoning_path(branch, objective, strategy):
                    cultural_path = CulturalPath(
                        path_id=f"islamic_path_{len(found_paths)}",
                        node_sequence=new_path,
                        branch_sequence=[branch_id],
                        path_type=CulturalPathType.ISLAMIC_PRINCIPLES,
                        total_cultural_score=cultural_score.overall_score,
                        path_depth=len(new_path),
                        reasoning_steps=[branch.reasoning_step],
                        cultural_validations=[cultural_score],
                        execution_time_ms=0.0,  # Will be calculated later
                        is_complete=True,
                    )

                    found_paths.append(cultural_path)

                    # Update best score
                    if (
                        cultural_score.overall_score
                        > search_state["best_cultural_score"]
                    ):
                        search_state["best_cultural_score"] = (
                            cultural_score.overall_score
                        )

                # Add child nodes to search queue
                for child_node_id in node.children:
                    if child_node_id not in search_state["visited_nodes"]:
                        # Calculate priority based on Islamic guidance
                        child_priority = await self._calculate_islamic_priority(
                            branch, cultural_score, strategy
                        )

                        heapq.heappush(
                            search_state["priority_queue"],
                            (child_priority, child_node_id, new_path),
                        )

            # Early termination if we found excellent Islamic solutions
            if len(found_paths) >= 3 and search_state["best_cultural_score"] > 0.95:
                break

        return found_paths

    def _is_complete_reasoning_path(
        self, branch: CulturalBranch, objective: str, strategy: Dict[str, Any]
    ) -> bool:
        """Determine if branch represents complete reasoning path"""

        reasoning_step = branch.reasoning_step.lower()
        objective_lower = objective.lower()

        # Check for conclusion indicators
        conclusion_indicators = [
            "therefore",
            "thus",
            "conclude",
            "result",
            "solution",
            "answer",
        ]
        has_conclusion = any(
            indicator in reasoning_step for indicator in conclusion_indicators
        )

        # Check for objective alignment
        objective_keywords = objective_lower.split()
        objective_alignment = sum(
            1 for keyword in objective_keywords if keyword in reasoning_step
        )
        objective_ratio = (
            objective_alignment / len(objective_keywords) if objective_keywords else 0
        )

        # Islamic completeness check
        islamic_completeness = (
            branch.cultural_score.islamic_compliance >= strategy["islamic_threshold"]
        )

        return has_conclusion and objective_ratio > 0.3 and islamic_completeness

    async def _calculate_islamic_priority(
        self,
        branch: CulturalBranch,
        cultural_score: CulturalScore,
        strategy: Dict[str, Any],
    ) -> float:
        """Calculate search priority based on Islamic principles"""

        base_priority = (
            1.0 - cultural_score.overall_score
        )  # Lower values = higher priority in heapq

        # Islamic compliance bonus
        islamic_bonus = (cultural_score.islamic_compliance - 0.8) * 0.5
        if islamic_bonus > 0:
            base_priority -= islamic_bonus

        # Strategy-specific adjustments
        search_bias = strategy["search_bias"]

        if search_bias == "depth_first":
            base_priority -= branch.depth * 0.1  # Prefer deeper nodes
        elif search_bias == "breadth_first":
            base_priority += branch.depth * 0.1  # Prefer shallower nodes
        elif search_bias == "best_first":
            base_priority = 1.0 - cultural_score.overall_score  # Pure score-based

        return max(0.0, base_priority)

    async def _validate_paths_islamically(
        self, paths: List[CulturalPath]
    ) -> List[CulturalPath]:
        """Validate and rank paths according to Islamic principles"""

        validated_paths = []

        for path in paths:
            # Check Islamic compliance of entire path
            islamic_scores = [
                validation.islamic_compliance
                for validation in path.cultural_validations
            ]
            if islamic_scores:
                avg_islamic_score = sum(islamic_scores) / len(islamic_scores)

                if avg_islamic_score >= 0.85:  # Islamic validation threshold
                    path.is_optimal = avg_islamic_score >= 0.95
                    validated_paths.append(path)

        # Sort by Islamic compliance then overall cultural score
        validated_paths.sort(
            key=lambda p: (
                sum(v.islamic_compliance for v in p.cultural_validations)
                / len(p.cultural_validations),
                p.total_cultural_score,
            ),
            reverse=True,
        )

        return validated_paths


class IraqiContextTreeBuilder:
    """Advanced tree builder with Iraqi cultural intelligence"""

    def __init__(self, config: RStarConfig, evaluator: CulturalBranchEvaluator):
        self.config = config
        self.evaluator = evaluator
        self.logger = logging.getLogger(f"{__name__}.IraqiContextTreeBuilder")

        # Iraqi context patterns for tree building
        self.iraqi_reasoning_patterns = {
            "family_consultation": {
                "description": "Consider family and community perspectives",
                "branch_templates": [
                    "What would family elders advise in this situation?",
                    "How does this decision affect the extended family?",
                    "What are the community implications of this choice?",
                ],
                "cultural_weight": 0.9,
            },
            "religious_guidance": {
                "description": "Apply Islamic principles and religious guidance",
                "branch_templates": [
                    "What do Islamic principles teach about this matter?",
                    "How can we ensure religious compliance in this decision?",
                    "What would religious scholars advise in this case?",
                ],
                "cultural_weight": 0.95,
            },
            "traditional_wisdom": {
                "description": "Draw upon Iraqi traditional knowledge and experience",
                "branch_templates": [
                    "What does Iraqi traditional wisdom suggest?",
                    "How have similar situations been handled historically?",
                    "What lessons can we learn from Iraqi cultural experience?",
                ],
                "cultural_weight": 0.85,
            },
            "professional_expertise": {
                "description": "Apply professional domain knowledge with cultural awareness",
                "branch_templates": [
                    "What does professional expertise recommend while respecting culture?",
                    "How can we balance professional standards with cultural values?",
                    "What is the culturally-appropriate professional approach?",
                ],
                "cultural_weight": 0.8,
            },
            "community_benefit": {
                "description": "Consider collective benefit and social harmony",
                "branch_templates": [
                    "How does this benefit the broader Iraqi community?",
                    "What promotes social harmony and collective welfare?",
                    "How can we ensure equitable outcomes for all?",
                ],
                "cultural_weight": 0.88,
            },
        }

    async def build_culturally_intelligent_tree(
        self,
        problem_statement: str,
        cultural_context: Dict[str, Any] = None,
        building_strategy: str = "comprehensive",
    ) -> ReasoningTree:
        """Build reasoning tree with Iraqi cultural intelligence"""

        start_time = time.time()

        # Initialize tree
        tree = ReasoningTree(self.config)
        await tree.initialize_tree(problem_statement, cultural_context or {})

        try:
            # Determine cultural building approach
            cultural_approach = await self._determine_cultural_building_approach(
                problem_statement, cultural_context, building_strategy
            )

            # Build tree with cultural intelligence
            await self._build_tree_with_cultural_patterns(tree, cultural_approach)

            # Validate cultural appropriateness of entire tree
            await self._validate_tree_cultural_appropriateness(tree)

            building_time_ms = (time.time() - start_time) * 1000

            self.logger.info(
                f"Culturally intelligent tree built in {building_time_ms:.2f}ms: {len(tree.nodes)} nodes"
            )

            return tree

        except Exception as e:
            self.logger.error(f"Cultural tree building failed: {e}")
            raise

    async def _determine_cultural_building_approach(
        self,
        problem: str,
        cultural_context: Dict[str, Any] = None,
        strategy: str = "comprehensive",
    ) -> Dict[str, Any]:
        """Determine approach for culturally intelligent tree building"""

        context = cultural_context or {}
        problem_lower = problem.lower()

        # Analyze problem for cultural patterns
        pattern_relevance = {}
        for pattern_name, pattern_data in self.iraqi_reasoning_patterns.items():
            relevance = 0.0

            if pattern_name == "family_consultation" and any(
                word in problem_lower
                for word in ["family", "personal", "relationship", "عائلة"]
            ):
                relevance = 0.9
            elif pattern_name == "religious_guidance" and any(
                word in problem_lower
                for word in ["ethical", "moral", "right", "wrong", "halal", "haram"]
            ):
                relevance = 0.95
            elif pattern_name == "traditional_wisdom" and any(
                word in problem_lower
                for word in ["traditional", "cultural", "custom", "تقليد"]
            ):
                relevance = 0.85
            elif pattern_name == "professional_expertise" and context.get(
                "professional_context"
            ):
                relevance = 0.8
            elif pattern_name == "community_benefit" and any(
                word in problem_lower
                for word in ["community", "society", "public", "مجتمع"]
            ):
                relevance = 0.88

            pattern_relevance[pattern_name] = relevance

        # Select patterns based on strategy
        if strategy == "comprehensive":
            selected_patterns = [
                name for name, relevance in pattern_relevance.items() if relevance > 0.3
            ]
        elif strategy == "focused":
            top_pattern = max(pattern_relevance.items(), key=lambda x: x[1])
            selected_patterns = [top_pattern[0]] if top_pattern[1] > 0.5 else []
        elif strategy == "balanced":
            selected_patterns = [
                name for name, relevance in pattern_relevance.items() if relevance > 0.6
            ]
        else:
            selected_patterns = list(self.iraqi_reasoning_patterns.keys())

        return {
            "selected_patterns": selected_patterns,
            "pattern_relevance": pattern_relevance,
            "building_strategy": strategy,
            "cultural_context": context,
            "expansion_depth": min(
                self.config.max_reasoning_depth, len(selected_patterns) + 2
            ),
        }

    async def _build_tree_with_cultural_patterns(
        self, tree: ReasoningTree, approach: Dict[str, Any]
    ):
        """Build tree nodes using Iraqi cultural reasoning patterns"""

        selected_patterns = approach["selected_patterns"]
        pattern_relevance = approach["pattern_relevance"]

        if not tree.root_node_id:
            return

        # Expand root node with cultural patterns
        root_node = tree.nodes[tree.root_node_id]

        # Create culturally-guided expansion strategy
        async def cultural_expansion_strategy(problem_statement, cultural_context):
            branches = []

            for pattern_name in selected_patterns:
                if pattern_name not in self.iraqi_reasoning_patterns:
                    continue

                pattern_data = self.iraqi_reasoning_patterns[pattern_name]
                relevance = pattern_relevance[pattern_name]

                if relevance > 0.4:  # Only include relevant patterns
                    for template in pattern_data["branch_templates"][
                        :2
                    ]:  # Limit branches per pattern
                        branch_info = {
                            "reasoning_step": template,
                            "cultural_pattern": pattern_name,
                            "cultural_weight": pattern_data["cultural_weight"],
                            "relevance_score": relevance,
                            "cultural_context": {
                                **cultural_context,
                                "reasoning_pattern": pattern_name,
                                "cultural_focus": pattern_data["description"],
                            },
                        }
                        branches.append(branch_info)

            return branches

        # Expand root with cultural strategy
        await root_node.expand_node(cultural_expansion_strategy)

        # Continue expansion for promising branches
        await self._continue_cultural_expansion(tree, approach)

    async def _continue_cultural_expansion(
        self, tree: ReasoningTree, approach: Dict[str, Any]
    ):
        """Continue expanding tree with cultural intelligence"""

        max_depth = approach["expansion_depth"]
        current_depth = 1

        while current_depth < max_depth:
            nodes_at_depth = [
                node
                for node in tree.nodes.values()
                if node.depth == current_depth and node.get_active_branches()
            ]

            if not nodes_at_depth:
                break

            # Expand promising nodes
            for node in nodes_at_depth:
                if len(tree.nodes) >= 20:  # Limit total nodes
                    break

                # Select best branches for further expansion
                active_branches = node.get_active_branches()
                best_branches = sorted(
                    active_branches,
                    key=lambda b: b.cultural_score.overall_score,
                    reverse=True,
                )[:2]  # Top 2 branches

                # Create child nodes for best branches
                for branch in best_branches:
                    if await tree._should_create_child_node(branch):
                        child_node_id = await tree._create_child_node(
                            node.node_id, branch
                        )
                        if child_node_id:
                            # Expand child node
                            child_node = tree.nodes[child_node_id]
                            await child_node.expand_node()

            current_depth += 1

    async def _validate_tree_cultural_appropriateness(self, tree: ReasoningTree):
        """Validate cultural appropriateness of entire tree"""

        total_cultural_score = 0.0
        total_islamic_score = 0.0
        branch_count = 0

        for node in tree.nodes.values():
            for branch in node.branches.values():
                if branch.cultural_score.overall_score > 0:
                    total_cultural_score += (
                        branch.cultural_score.cultural_appropriateness
                    )
                    total_islamic_score += branch.cultural_score.islamic_compliance
                    branch_count += 1

        if branch_count > 0:
            avg_cultural_score = total_cultural_score / branch_count
            avg_islamic_score = total_islamic_score / branch_count

            tree.average_cultural_score = avg_cultural_score
            tree.islamic_compliance_rate = avg_islamic_score

            self.logger.info(
                f"Tree cultural validation: {avg_cultural_score:.3f} cultural, {avg_islamic_score:.3f} Islamic"
            )


class TreePruningAlgorithm:
    """Advanced tree pruning with cultural preservation"""

    def __init__(self, config: RStarConfig, evaluator: CulturalBranchEvaluator):
        self.config = config
        self.evaluator = evaluator
        self.logger = logging.getLogger(f"{__name__}.TreePruningAlgorithm")

        # Pruning strategies
        self.pruning_strategies = {
            PruningStrategy.AGGRESSIVE: {
                "cultural_threshold": 0.85,
                "islamic_threshold": 0.9,
                "prune_ratio": 0.6,  # Prune 60% of low-scoring branches
            },
            PruningStrategy.CONSERVATIVE: {
                "cultural_threshold": 0.7,
                "islamic_threshold": 0.8,
                "prune_ratio": 0.3,  # Prune 30% of branches
            },
            PruningStrategy.BALANCED: {
                "cultural_threshold": 0.8,
                "islamic_threshold": 0.85,
                "prune_ratio": 0.45,  # Prune 45% of branches
            },
            PruningStrategy.CULTURAL_FOCUSED: {
                "cultural_threshold": 0.9,
                "islamic_threshold": 0.8,
                "prune_ratio": 0.5,
            },
            PruningStrategy.ISLAMIC_STRICT: {
                "cultural_threshold": 0.75,
                "islamic_threshold": 0.95,
                "prune_ratio": 0.55,
            },
        }

    async def prune_tree_intelligently(
        self,
        tree: ReasoningTree,
        strategy: PruningStrategy = PruningStrategy.BALANCED,
        preserve_diversity: bool = True,
    ) -> Dict[str, Any]:
        """Intelligently prune tree while preserving cultural diversity"""

        start_time = time.time()

        try:
            strategy_config = self.pruning_strategies[strategy]

            # Analyze tree before pruning
            initial_stats = self._analyze_tree_structure(tree)

            # Identify branches for pruning
            pruning_candidates = await self._identify_pruning_candidates(
                tree, strategy_config
            )

            # Preserve cultural diversity if requested
            if preserve_diversity:
                pruning_candidates = await self._preserve_cultural_diversity(
                    tree, pruning_candidates
                )

            # Execute pruning
            pruning_results = await self._execute_intelligent_pruning(
                tree, pruning_candidates, strategy_config
            )

            # Analyze tree after pruning
            final_stats = self._analyze_tree_structure(tree)

            # Update tree statistics
            tree.total_branches_pruned += pruning_results["branches_pruned"]
            tree._update_cultural_statistics()

            processing_time_ms = (time.time() - start_time) * 1000

            result = {
                "pruning_strategy": strategy.value,
                "initial_stats": initial_stats,
                "final_stats": final_stats,
                "pruning_results": pruning_results,
                "cultural_diversity_preserved": preserve_diversity,
                "processing_time_ms": processing_time_ms,
            }

            self.logger.info(
                f"Tree pruning completed: {pruning_results['branches_pruned']} branches pruned in {processing_time_ms:.2f}ms"
            )

            return result

        except Exception as e:
            self.logger.error(f"Tree pruning failed: {e}")
            raise

    def _analyze_tree_structure(self, tree: ReasoningTree) -> Dict[str, Any]:
        """Analyze tree structure and branch distribution"""

        total_nodes = len(tree.nodes)
        total_branches = sum(len(node.branches) for node in tree.nodes.values())

        # Branch status distribution
        status_counts = defaultdict(int)
        cultural_scores = []
        islamic_scores = []

        for node in tree.nodes.values():
            for branch in node.branches.values():
                status_counts[branch.status.value] += 1
                if branch.cultural_score.overall_score > 0:
                    cultural_scores.append(
                        branch.cultural_score.cultural_appropriateness
                    )
                    islamic_scores.append(branch.cultural_score.islamic_compliance)

        avg_cultural = (
            sum(cultural_scores) / len(cultural_scores) if cultural_scores else 0
        )
        avg_islamic = sum(islamic_scores) / len(islamic_scores) if islamic_scores else 0

        return {
            "total_nodes": total_nodes,
            "total_branches": total_branches,
            "branch_status_distribution": dict(status_counts),
            "average_cultural_score": avg_cultural,
            "average_islamic_score": avg_islamic,
            "max_depth": tree.max_depth_reached,
        }

    async def _identify_pruning_candidates(
        self, tree: ReasoningTree, strategy_config: Dict[str, Any]
    ) -> List[Tuple[str, str, float]]:  # (node_id, branch_id, priority)
        """Identify branches that are candidates for pruning"""

        candidates = []
        cultural_threshold = strategy_config["cultural_threshold"]
        islamic_threshold = strategy_config["islamic_threshold"]

        for node_id, node in tree.nodes.items():
            for branch_id, branch in node.branches.items():
                # Skip already pruned branches
                if branch.status == BranchStatus.PRUNED:
                    continue

                should_prune = False
                priority = 0.0

                # Cultural appropriateness check
                if branch.cultural_score.cultural_appropriateness < cultural_threshold:
                    should_prune = True
                    priority += (
                        cultural_threshold
                        - branch.cultural_score.cultural_appropriateness
                    )

                # Islamic compliance check
                if branch.cultural_score.islamic_compliance < islamic_threshold:
                    should_prune = True
                    priority += (
                        islamic_threshold - branch.cultural_score.islamic_compliance
                    ) * 1.2  # Higher weight

                # Overall score check
                if branch.cultural_score.overall_score < 0.7:
                    should_prune = True
                    priority += 0.7 - branch.cultural_score.overall_score

                # Additional pruning criteria
                if branch.status == BranchStatus.BLOCKED:
                    should_prune = True
                    priority += 0.5

                if should_prune:
                    candidates.append((node_id, branch_id, priority))

        # Sort by priority (higher priority = more likely to prune)
        candidates.sort(key=lambda x: x[2], reverse=True)

        # Apply prune ratio
        prune_ratio = strategy_config["prune_ratio"]
        max_to_prune = int(len(candidates) * prune_ratio)

        return candidates[:max_to_prune]

    async def _preserve_cultural_diversity(
        self, tree: ReasoningTree, pruning_candidates: List[Tuple[str, str, float]]
    ) -> List[Tuple[str, str, float]]:
        """Preserve cultural diversity by protecting diverse reasoning approaches"""

        # Identify unique cultural patterns
        cultural_patterns = set()
        pattern_representatives = {}

        for node in tree.nodes.values():
            for branch in node.branches.values():
                cultural_context = branch.cultural_context
                pattern = cultural_context.get("reasoning_pattern", "general")

                cultural_patterns.add(pattern)

                # Keep track of best representative for each pattern
                if (
                    pattern not in pattern_representatives
                    or branch.cultural_score.overall_score
                    > pattern_representatives[pattern][1].cultural_score.overall_score
                ):
                    pattern_representatives[pattern] = (branch.branch_id, branch)

        # Remove representatives from pruning candidates
        protected_branches = {
            branch_id for branch_id, _ in pattern_representatives.values()
        }

        filtered_candidates = []
        for node_id, branch_id, priority in pruning_candidates:
            if branch_id not in protected_branches:
                filtered_candidates.append((node_id, branch_id, priority))
            else:
                self.logger.debug(
                    f"Protected branch {branch_id[:8]} for cultural diversity"
                )

        return filtered_candidates

    async def _execute_intelligent_pruning(
        self,
        tree: ReasoningTree,
        pruning_candidates: List[Tuple[str, str, float]],
        strategy_config: Dict[str, Any],
    ) -> Dict[str, Any]:
        """Execute the intelligent pruning process"""

        branches_pruned = 0
        cultural_scores_removed = []
        islamic_scores_removed = []

        for node_id, branch_id, priority in pruning_candidates:
            node = tree.nodes.get(node_id)
            if not node:
                continue

            branch = node.branches.get(branch_id)
            if not branch or branch.status == BranchStatus.PRUNED:
                continue

            # Record scores before pruning
            if branch.cultural_score.overall_score > 0:
                cultural_scores_removed.append(
                    branch.cultural_score.cultural_appropriateness
                )
                islamic_scores_removed.append(branch.cultural_score.islamic_compliance)

            # Prune the branch
            branch.status = BranchStatus.PRUNED
            branches_pruned += 1

            self.logger.debug(
                f"Pruned branch {branch_id[:8]} with priority {priority:.3f}"
            )

        # Calculate pruning statistics
        avg_cultural_removed = (
            sum(cultural_scores_removed) / len(cultural_scores_removed)
            if cultural_scores_removed
            else 0
        )
        avg_islamic_removed = (
            sum(islamic_scores_removed) / len(islamic_scores_removed)
            if islamic_scores_removed
            else 0
        )

        return {
            "branches_pruned": branches_pruned,
            "pruning_candidates_identified": len(pruning_candidates),
            "average_cultural_score_removed": avg_cultural_removed,
            "average_islamic_score_removed": avg_islamic_removed,
            "pruning_efficiency": branches_pruned / len(pruning_candidates)
            if pruning_candidates
            else 0,
        }


class CulturalPathFinder:
    """Advanced path finding with cultural optimization"""

    def __init__(self, config: RStarConfig, evaluator: CulturalBranchEvaluator):
        self.config = config
        self.evaluator = evaluator
        self.logger = logging.getLogger(f"{__name__}.CulturalPathFinder")

    async def find_optimal_cultural_paths(
        self,
        tree: ReasoningTree,
        path_type: CulturalPathType = CulturalPathType.MIXED_APPROACH,
        max_paths: int = 5,
    ) -> List[CulturalPath]:
        """Find optimal cultural paths through the reasoning tree"""

        start_time = time.time()

        try:
            # Find all possible paths
            all_paths = await self._discover_all_paths(tree)

            # Filter paths by type and cultural criteria
            filtered_paths = await self._filter_paths_by_type(all_paths, path_type)

            # Optimize paths for cultural appropriateness
            optimized_paths = await self._optimize_paths_culturally(filtered_paths)

            # Select best paths
            best_paths = await self._select_best_cultural_paths(
                optimized_paths, max_paths
            )

            execution_time_ms = (time.time() - start_time) * 1000

            # Update execution time for all paths
            for path in best_paths:
                path.execution_time_ms = execution_time_ms / len(best_paths)

            self.logger.info(
                f"Found {len(best_paths)} optimal cultural paths in {execution_time_ms:.2f}ms"
            )

            return best_paths

        except Exception as e:
            self.logger.error(f"Cultural path finding failed: {e}")
            raise

    async def _discover_all_paths(self, tree: ReasoningTree) -> List[CulturalPath]:
        """Discover all possible paths in the tree"""

        if not tree.root_node_id:
            return []

        paths = []

        def traverse_node(
            node_id: str, current_path: List[str], current_branches: List[str]
        ):
            node = tree.nodes.get(node_id)
            if not node:
                return

            # Add current node to path
            path_with_node = current_path + [node_id]

            # Check each branch
            active_branches = node.get_active_branches()

            if not active_branches:
                # Leaf node - create path
                if len(path_with_node) > 1:  # Don't include single-node paths
                    cultural_path = CulturalPath(
                        path_id=f"path_{len(paths)}",
                        node_sequence=path_with_node,
                        branch_sequence=current_branches,
                        path_type=CulturalPathType.MIXED_APPROACH,  # Will be determined later
                        total_cultural_score=0.0,  # Will be calculated
                        path_depth=len(path_with_node),
                        reasoning_steps=[],  # Will be populated
                        cultural_validations=[],  # Will be populated
                        execution_time_ms=0.0,
                    )
                    paths.append(cultural_path)
            else:
                # Continue traversing through branches
                for branch in active_branches:
                    if branch.children:
                        for child_node_id in branch.children:
                            traverse_node(
                                child_node_id,
                                path_with_node,
                                current_branches + [branch.branch_id],
                            )

        # Start traversal from root
        traverse_node(tree.root_node_id, [], [])

        return paths

    async def _filter_paths_by_type(
        self, paths: List[CulturalPath], path_type: CulturalPathType
    ) -> List[CulturalPath]:
        """Filter paths by cultural reasoning type"""

        if path_type == CulturalPathType.MIXED_APPROACH:
            return paths  # Include all paths for mixed approach

        filtered_paths = []

        for path in paths:
            path_matches_type = await self._evaluate_path_type(path, path_type)
            if path_matches_type:
                path.path_type = path_type
                filtered_paths.append(path)

        return filtered_paths

    async def _evaluate_path_type(
        self, path: CulturalPath, target_type: CulturalPathType
    ) -> bool:
        """Evaluate if path matches the target cultural reasoning type"""

        # This is a simplified implementation
        # In a real system, you would analyze the reasoning steps more thoroughly

        reasoning_steps_text = " ".join(path.reasoning_steps).lower()

        type_indicators = {
            CulturalPathType.ISLAMIC_PRINCIPLES: [
                "islamic",
                "religious",
                "halal",
                "haram",
                "principle",
            ],
            CulturalPathType.IRAQI_CULTURAL: [
                "iraqi",
                "cultural",
                "tradition",
                "custom",
                "social",
            ],
            CulturalPathType.PROFESSIONAL_DOMAIN: [
                "professional",
                "expert",
                "technical",
                "domain",
            ],
            CulturalPathType.ETHICAL_REASONING: [
                "ethical",
                "moral",
                "right",
                "wrong",
                "values",
            ],
            CulturalPathType.SYSTEMATIC_ANALYSIS: [
                "systematic",
                "analysis",
                "logical",
                "methodical",
            ],
        }

        if target_type in type_indicators:
            indicators = type_indicators[target_type]
            matches = sum(
                1 for indicator in indicators if indicator in reasoning_steps_text
            )
            return matches >= 1

        return False

    async def _optimize_paths_culturally(
        self, paths: List[CulturalPath]
    ) -> List[CulturalPath]:
        """Optimize paths for cultural appropriateness"""

        optimized_paths = []

        for path in paths:
            # Calculate comprehensive cultural score
            cultural_scores = []
            reasoning_steps = []

            # Get branches and their cultural scores
            for branch_id in path.branch_sequence:
                # Find branch in tree (simplified - would need proper lookup)
                branch_cultural_score = 0.8  # Placeholder
                cultural_scores.append(branch_cultural_score)
                reasoning_steps.append(f"Reasoning step for branch {branch_id[:8]}")

            if cultural_scores:
                path.total_cultural_score = sum(cultural_scores) / len(cultural_scores)
                path.reasoning_steps = reasoning_steps

                # Mark as complete if score is high enough
                if path.total_cultural_score >= 0.8:
                    path.is_complete = True

                # Mark as optimal if score is very high
                if path.total_cultural_score >= 0.95:
                    path.is_optimal = True

                optimized_paths.append(path)

        return optimized_paths

    async def _select_best_cultural_paths(
        self, paths: List[CulturalPath], max_paths: int
    ) -> List[CulturalPath]:
        """Select best cultural paths based on multiple criteria"""

        # Sort paths by cultural score and completeness
        sorted_paths = sorted(
            paths,
            key=lambda p: (
                p.is_optimal,
                p.is_complete,
                p.total_cultural_score,
                -p.path_depth,  # Prefer shorter paths if scores are equal
            ),
            reverse=True,
        )

        return sorted_paths[:max_paths]


# Export main classes
__all__ = [
    "CulturalBranchEvaluator",
    "IslamicPrincipleGuidedSearch",
    "IraqiContextTreeBuilder",
    "TreePruningAlgorithm",
    "CulturalPathFinder",
    "SearchDirection",
    "PruningStrategy",
    "CulturalPathType",
    "BranchEvaluationCriteria",
    "CulturalPath",
]
