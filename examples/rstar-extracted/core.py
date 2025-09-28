"""
Core R* (R-Star) Reasoning System with Iraqi Cultural Intelligence

This module implements the revolutionary R*-based reasoning system enhanced with
Iraqi cultural intelligence and Islamic principle compliance. The system provides
systematic tree-based problem solving with real-time cultural validation.

Key Features:
- Tree-based systematic reasoning with cultural branch evaluation
- Islamic principle-guided search and solution validation
- Iraqi professional domain expertise integration
- Real-time cultural appropriateness scoring and pruning
- Multi-layered problem decomposition with ethical constraints
- Performance-optimized systematic exploration

Architecture Overview:
The R* system uses a tree-based approach where each reasoning step creates branches
representing different solution paths. Iraqi cultural intelligence guides branch
evaluation, ensuring all exploration maintains Islamic compliance and cultural
appropriateness while systematically solving complex problems.

Core Components:
- IraqiRStarReasoner: Main orchestrator with cultural intelligence
- ReasoningTree: Tree structure with cultural branch evaluation
- CulturalBranch: Individual reasoning paths with Islamic validation
- SystematicProblemSolver: Multi-step systematic problem resolution
"""

from typing import Dict, Any, List, Optional, Union, Tuple, Set, Callable, Awaitable
from dataclasses import dataclass, field
from enum import Enum
from abc import ABC, abstractmethod
import asyncio
import time
import logging
import json
import uuid
import hashlib
from collections import deque, defaultdict
import heapq
from contextlib import asynccontextmanager


class ReasoningStrategy(Enum):
    """R* reasoning strategies for different problem types"""

    BREADTH_FIRST_CULTURAL = "breadth_first_cultural"
    DEPTH_FIRST_ISLAMIC = "depth_first_islamic"
    BEST_FIRST_PROFESSIONAL = "best_first_professional"
    ADAPTIVE_MIXED = "adaptive_mixed"
    SYSTEMATIC_EXPLORATION = "systematic_exploration"


class CulturalValidationLevel(Enum):
    """Levels of cultural validation for reasoning branches"""

    BASIC = "basic"  # Basic Islamic compliance
    STANDARD = "standard"  # Standard cultural appropriateness
    THOROUGH = "thorough"  # Thorough cultural and professional validation
    CRITICAL = "critical"  # Critical validation for sensitive domains


class BranchStatus(Enum):
    """Status of reasoning branches"""

    ACTIVE = "active"
    PRUNED = "pruned"
    COMPLETED = "completed"
    BLOCKED = "blocked"
    VALIDATED = "validated"
    REJECTED = "rejected"


@dataclass
class CulturalScore:
    """Cultural appropriateness scoring for reasoning branches"""

    islamic_compliance: float = 0.0
    cultural_appropriateness: float = 0.0
    professional_accuracy: float = 0.0
    ethical_alignment: float = 0.0
    overall_score: float = 0.0
    validation_notes: List[str] = field(default_factory=list)


@dataclass
class ReasoningMetrics:
    """Performance and quality metrics for R* reasoning"""

    total_nodes_explored: int = 0
    branches_pruned: int = 0
    cultural_validations_performed: int = 0
    average_branch_score: float = 0.0
    reasoning_depth_achieved: int = 0
    execution_time_ms: float = 0.0
    memory_usage_mb: float = 0.0
    success_rate: float = 0.0


@dataclass
class RStarConfig:
    """Configuration for R* reasoning system"""

    max_reasoning_depth: int = 10
    max_branches_per_node: int = 5
    cultural_validation_threshold: float = 0.8
    islamic_compliance_threshold: float = 0.9
    professional_accuracy_threshold: float = 0.85
    reasoning_strategy: ReasoningStrategy = ReasoningStrategy.ADAPTIVE_MIXED
    validation_level: CulturalValidationLevel = CulturalValidationLevel.STANDARD
    enable_branch_pruning: bool = True
    enable_cultural_caching: bool = True
    max_execution_time_ms: int = 10000
    cultural_context: str = "iraqi"
    professional_domains: List[str] = field(default_factory=lambda: ["general"])


class CulturalBranch:
    """Individual reasoning branch with cultural intelligence"""

    def __init__(
        self,
        branch_id: str,
        parent_id: Optional[str],
        reasoning_step: str,
        cultural_context: Dict[str, Any],
        config: RStarConfig,
    ):
        self.branch_id = branch_id
        self.parent_id = parent_id
        self.reasoning_step = reasoning_step
        self.cultural_context = cultural_context
        self.config = config

        # Branch state
        self.status = BranchStatus.ACTIVE
        self.depth = 0
        self.children: List[str] = []

        # Cultural scoring
        self.cultural_score = CulturalScore()
        self.validation_history: List[Dict[str, Any]] = []

        # Performance tracking
        self.creation_time = time.time()
        self.processing_time_ms = 0.0
        self.memory_footprint = 0

        # Reasoning content
        self.reasoning_content: Dict[str, Any] = {}
        self.intermediate_results: List[Dict[str, Any]] = []
        self.final_result: Optional[Dict[str, Any]] = None

        self.logger = logging.getLogger(f"{__name__}.CulturalBranch.{branch_id[:8]}")

    async def evaluate_cultural_appropriateness(
        self, validator: Optional[Callable] = None
    ) -> CulturalScore:
        """Evaluate cultural appropriateness of this reasoning branch"""

        start_time = time.time()

        try:
            # Basic Islamic compliance check
            islamic_score = await self._evaluate_islamic_compliance()

            # Cultural appropriateness assessment
            cultural_score = await self._evaluate_cultural_appropriateness()

            # Professional accuracy validation
            professional_score = await self._evaluate_professional_accuracy()

            # Ethical alignment check
            ethical_score = await self._evaluate_ethical_alignment()

            # Calculate overall score
            overall_score = (
                islamic_score * 0.3
                + cultural_score * 0.25
                + professional_score * 0.25
                + ethical_score * 0.2
            )

            # Create cultural score object
            self.cultural_score = CulturalScore(
                islamic_compliance=islamic_score,
                cultural_appropriateness=cultural_score,
                professional_accuracy=professional_score,
                ethical_alignment=ethical_score,
                overall_score=overall_score,
                validation_notes=self._generate_validation_notes(
                    islamic_score, cultural_score, professional_score, ethical_score
                ),
            )

            # Record validation
            self.validation_history.append(
                {
                    "timestamp": time.time(),
                    "cultural_score": self.cultural_score,
                    "validation_level": self.config.validation_level.value,
                    "processing_time_ms": (time.time() - start_time) * 1000,
                }
            )

            # Update status based on thresholds
            if overall_score >= self.config.cultural_validation_threshold:
                if self.status == BranchStatus.ACTIVE:
                    self.status = BranchStatus.VALIDATED
            else:
                self.status = BranchStatus.REJECTED
                self.logger.info(
                    f"Branch {self.branch_id[:8]} rejected: score {overall_score:.3f} below threshold {self.config.cultural_validation_threshold}"
                )

            return self.cultural_score

        except Exception as e:
            self.logger.error(
                f"Cultural evaluation failed for branch {self.branch_id[:8]}: {e}"
            )
            self.status = BranchStatus.BLOCKED
            raise

    async def _evaluate_islamic_compliance(self) -> float:
        """Evaluate Islamic compliance of reasoning step"""

        reasoning_text = str(self.reasoning_step).lower()

        # Islamic principles indicators
        positive_indicators = [
            "justice",
            "fairness",
            "compassion",
            "mercy",
            "honesty",
            "respect",
            "dignity",
            "wisdom",
            "knowledge",
            "charity",
            "عدل",
            "رحمة",
            "صدق",
            "احترام",
            "حكمة",
            "علم",
        ]

        # Problematic content indicators
        negative_indicators = [
            "gambling",
            "interest",
            "alcohol",
            "inappropriate",
            "disrespectful",
            "unfair",
            "deceptive",
            "harmful",
        ]

        compliance_score = 0.8  # Base score

        # Boost for positive indicators
        for indicator in positive_indicators:
            if indicator in reasoning_text:
                compliance_score += 0.02

        # Penalize negative indicators
        for indicator in negative_indicators:
            if indicator in reasoning_text:
                compliance_score -= 0.15

        # Consider cultural context
        if self.cultural_context.get("islamic_principles_required", True):
            # Higher standards when Islamic principles explicitly required
            if any(indicator in reasoning_text for indicator in positive_indicators):
                compliance_score += 0.05

        return max(0.0, min(1.0, compliance_score))

    async def _evaluate_cultural_appropriateness(self) -> float:
        """Evaluate Iraqi cultural appropriateness"""

        reasoning_text = str(self.reasoning_step).lower()
        cultural_context = self.cultural_context

        appropriateness_score = 0.85  # Base score

        # Cultural sensitivity indicators
        positive_cultural_indicators = [
            "family",
            "community",
            "tradition",
            "respect",
            "hospitality",
            "generosity",
            "wisdom",
            "experience",
            "عائلة",
            "مجتمع",
            "تقاليد",
            "احترام",
            "ضيافة",
            "كرم",
        ]

        # Cultural sensitivity concerns
        negative_cultural_indicators = [
            "politics",
            "sectarian",
            "tribal",
            "controversial",
            "divisive",
            "inappropriate",
            "disrespectful",
        ]

        # Boost for cultural awareness
        for indicator in positive_cultural_indicators:
            if indicator in reasoning_text:
                appropriateness_score += 0.02

        # Penalize cultural insensitivity
        for indicator in negative_cultural_indicators:
            if indicator in reasoning_text:
                appropriateness_score -= 0.12

        # Professional context considerations
        if cultural_context.get("professional_context"):
            professional_domain = cultural_context.get("professional_context")

            if professional_domain in ["legal", "medical", "educational"]:
                # Higher standards for professional domains
                appropriateness_score *= 1.05

            # Domain-specific cultural considerations
            if professional_domain == "legal" and "justice" in reasoning_text:
                appropriateness_score += 0.03
            elif professional_domain == "medical" and "care" in reasoning_text:
                appropriateness_score += 0.03
            elif professional_domain == "educational" and "knowledge" in reasoning_text:
                appropriateness_score += 0.03

        return max(0.0, min(1.0, appropriateness_score))

    async def _evaluate_professional_accuracy(self) -> float:
        """Evaluate professional accuracy of reasoning"""

        accuracy_score = 0.8  # Base score

        # Professional domain indicators
        professional_domains = self.config.professional_domains
        reasoning_text = str(self.reasoning_step).lower()

        # Domain-specific accuracy indicators
        domain_indicators = {
            "legal": ["law", "regulation", "compliance", "rights", "قانون", "حقوق"],
            "medical": ["health", "treatment", "care", "safety", "صحة", "علاج"],
            "educational": [
                "learning",
                "knowledge",
                "teaching",
                "development",
                "تعليم",
                "معرفة",
            ],
            "business": [
                "efficiency",
                "management",
                "strategy",
                "growth",
                "إدارة",
                "استراتيجية",
            ],
            "technical": [
                "system",
                "process",
                "optimization",
                "solution",
                "نظام",
                "حل",
            ],
        }

        # Check domain relevance
        for domain in professional_domains:
            if domain in domain_indicators:
                domain_terms = domain_indicators[domain]
                domain_relevance = sum(
                    1 for term in domain_terms if term in reasoning_text
                )

                if domain_relevance > 0:
                    accuracy_score += domain_relevance * 0.02

        # Logical reasoning indicators
        logical_indicators = [
            "therefore",
            "because",
            "if",
            "then",
            "analysis",
            "conclusion",
        ]
        logical_score = sum(
            1 for indicator in logical_indicators if indicator in reasoning_text
        )
        accuracy_score += logical_score * 0.01

        return max(0.0, min(1.0, accuracy_score))

    async def _evaluate_ethical_alignment(self) -> float:
        """Evaluate ethical alignment of reasoning"""

        ethical_score = 0.85  # Base score
        reasoning_text = str(self.reasoning_step).lower()

        # Ethical principle indicators
        ethical_indicators = [
            "benefit",
            "harm",
            "fairness",
            "transparency",
            "responsibility",
            "accountability",
            "integrity",
            "trust",
        ]

        # Ethical concerns
        ethical_concerns = [
            "deception",
            "manipulation",
            "exploitation",
            "discrimination",
            "bias",
            "unfair",
            "harmful",
        ]

        # Boost for ethical indicators
        for indicator in ethical_indicators:
            if indicator in reasoning_text:
                ethical_score += 0.015

        # Penalize ethical concerns
        for concern in ethical_concerns:
            if concern in reasoning_text:
                ethical_score -= 0.08

        return max(0.0, min(1.0, ethical_score))

    def _generate_validation_notes(
        self,
        islamic_score: float,
        cultural_score: float,
        professional_score: float,
        ethical_score: float,
    ) -> List[str]:
        """Generate validation notes based on scores"""

        notes = []
        threshold = 0.8

        if islamic_score < threshold:
            notes.append("Consider strengthening Islamic principle alignment")

        if cultural_score < threshold:
            notes.append("Review cultural appropriateness for Iraqi context")

        if professional_score < threshold:
            notes.append("Enhance professional domain accuracy")

        if ethical_score < threshold:
            notes.append("Address potential ethical concerns")

        if not notes:
            notes.append("Validation passed successfully")

        return notes

    def should_be_pruned(self) -> bool:
        """Determine if this branch should be pruned"""

        if not self.config.enable_branch_pruning:
            return False

        # Prune if rejected by cultural validation
        if self.status == BranchStatus.REJECTED:
            return True

        # Prune if overall score too low
        if (
            self.cultural_score.overall_score > 0
            and self.cultural_score.overall_score
            < self.config.cultural_validation_threshold
        ):
            return True

        # Prune if Islamic compliance too low (strict requirement)
        if (
            self.cultural_score.islamic_compliance > 0
            and self.cultural_score.islamic_compliance
            < self.config.islamic_compliance_threshold
        ):
            return True

        # Prune if blocked or takes too long
        if self.status == BranchStatus.BLOCKED:
            return True

        return False

    def get_branch_summary(self) -> Dict[str, Any]:
        """Get comprehensive summary of this branch"""

        return {
            "branch_id": self.branch_id,
            "parent_id": self.parent_id,
            "status": self.status.value,
            "depth": self.depth,
            "reasoning_step": self.reasoning_step,
            "cultural_score": {
                "islamic_compliance": self.cultural_score.islamic_compliance,
                "cultural_appropriateness": self.cultural_score.cultural_appropriateness,
                "professional_accuracy": self.cultural_score.professional_accuracy,
                "ethical_alignment": self.cultural_score.ethical_alignment,
                "overall_score": self.cultural_score.overall_score,
            },
            "validation_notes": self.cultural_score.validation_notes,
            "children_count": len(self.children),
            "processing_time_ms": self.processing_time_ms,
            "creation_time": self.creation_time,
            "should_prune": self.should_be_pruned(),
        }


class ReasoningNode:
    """Node in the R* reasoning tree with cultural intelligence"""

    def __init__(
        self,
        node_id: str,
        problem_statement: str,
        cultural_context: Dict[str, Any],
        config: RStarConfig,
        parent_node_id: Optional[str] = None,
    ):
        self.node_id = node_id
        self.problem_statement = problem_statement
        self.cultural_context = cultural_context
        self.config = config
        self.parent_node_id = parent_node_id

        # Node structure
        self.depth = 0
        self.children: List[str] = []
        self.branches: Dict[str, CulturalBranch] = {}

        # Node state
        self.is_solution_node = False
        self.best_branch_id: Optional[str] = None
        self.node_score: float = 0.0

        # Processing state
        self.processing_complete = False
        self.expansion_attempted = False
        self.cultural_validation_complete = False

        # Performance tracking
        self.creation_time = time.time()
        self.total_processing_time_ms = 0.0

        self.logger = logging.getLogger(f"{__name__}.ReasoningNode.{node_id[:8]}")

    async def expand_node(
        self, expansion_strategy: Optional[Callable] = None
    ) -> List[CulturalBranch]:
        """Expand this node by creating reasoning branches"""

        if self.expansion_attempted:
            return list(self.branches.values())

        start_time = time.time()
        self.expansion_attempted = True

        try:
            # Generate reasoning branches
            if expansion_strategy:
                branch_data = await expansion_strategy(
                    self.problem_statement, self.cultural_context
                )
            else:
                branch_data = await self._default_expansion_strategy()

            # Create cultural branches
            branches = []
            for i, branch_info in enumerate(
                branch_data[: self.config.max_branches_per_node]
            ):
                branch_id = f"{self.node_id}_branch_{i}"

                cultural_branch = CulturalBranch(
                    branch_id=branch_id,
                    parent_id=self.node_id,
                    reasoning_step=branch_info["reasoning_step"],
                    cultural_context=branch_info.get(
                        "cultural_context", self.cultural_context
                    ),
                    config=self.config,
                )

                cultural_branch.depth = self.depth + 1
                cultural_branch.reasoning_content = branch_info

                self.branches[branch_id] = cultural_branch
                branches.append(cultural_branch)

            # Evaluate cultural appropriateness of all branches
            await self._evaluate_all_branches()

            # Select best branch
            self._select_best_branch()

            processing_time = (time.time() - start_time) * 1000
            self.total_processing_time_ms += processing_time

            self.logger.info(
                f"Node {self.node_id[:8]} expanded with {len(branches)} branches in {processing_time:.2f}ms"
            )

            return branches

        except Exception as e:
            self.logger.error(f"Node expansion failed for {self.node_id[:8]}: {e}")
            raise

    async def _default_expansion_strategy(self) -> List[Dict[str, Any]]:
        """Default strategy for expanding reasoning branches"""

        problem = self.problem_statement
        cultural_context = self.cultural_context

        # Generate different reasoning approaches
        branch_templates = [
            {
                "reasoning_step": f"Apply Islamic principles to analyze: {problem}",
                "approach": "islamic_principles",
                "cultural_context": {**cultural_context, "focus": "islamic_guidance"},
            },
            {
                "reasoning_step": f"Consider Iraqi cultural norms for: {problem}",
                "approach": "cultural_analysis",
                "cultural_context": {
                    **cultural_context,
                    "focus": "cultural_appropriateness",
                },
            },
            {
                "reasoning_step": f"Analyze from professional domain perspective: {problem}",
                "approach": "professional_analysis",
                "cultural_context": {
                    **cultural_context,
                    "focus": "professional_accuracy",
                },
            },
            {
                "reasoning_step": f"Evaluate ethical implications of: {problem}",
                "approach": "ethical_analysis",
                "cultural_context": {**cultural_context, "focus": "ethical_alignment"},
            },
            {
                "reasoning_step": f"Seek systematic solution approach for: {problem}",
                "approach": "systematic_problem_solving",
                "cultural_context": {
                    **cultural_context,
                    "focus": "systematic_analysis",
                },
            },
        ]

        # Filter based on cultural context requirements
        professional_context = cultural_context.get("professional_context")
        if professional_context:
            # Add domain-specific reasoning
            branch_templates.append(
                {
                    "reasoning_step": f"Apply {professional_context} domain expertise to: {problem}",
                    "approach": "domain_specific",
                    "cultural_context": {
                        **cultural_context,
                        "focus": "domain_expertise",
                    },
                }
            )

        return branch_templates

    async def _evaluate_all_branches(self):
        """Evaluate cultural appropriateness of all branches"""

        evaluation_tasks = []
        for branch in self.branches.values():
            if branch.status == BranchStatus.ACTIVE:
                evaluation_tasks.append(branch.evaluate_cultural_appropriateness())

        if evaluation_tasks:
            await asyncio.gather(*evaluation_tasks, return_exceptions=True)

        self.cultural_validation_complete = True

    def _select_best_branch(self):
        """Select the best branch based on cultural scores"""

        valid_branches = [
            (branch_id, branch)
            for branch_id, branch in self.branches.items()
            if branch.status == BranchStatus.VALIDATED and not branch.should_be_pruned()
        ]

        if valid_branches:
            # Select branch with highest overall score
            best_branch_id, best_branch = max(
                valid_branches, key=lambda x: x[1].cultural_score.overall_score
            )

            self.best_branch_id = best_branch_id
            self.node_score = best_branch.cultural_score.overall_score

            self.logger.info(
                f"Node {self.node_id[:8]} selected best branch {best_branch_id[:8]} with score {self.node_score:.3f}"
            )
        else:
            self.logger.warning(f"Node {self.node_id[:8]} has no valid branches")

    def get_active_branches(self) -> List[CulturalBranch]:
        """Get all active (non-pruned) branches"""
        return [
            branch
            for branch in self.branches.values()
            if not branch.should_be_pruned()
            and branch.status in [BranchStatus.ACTIVE, BranchStatus.VALIDATED]
        ]

    def get_node_summary(self) -> Dict[str, Any]:
        """Get comprehensive summary of this node"""

        branch_summaries = {
            branch_id: branch.get_branch_summary()
            for branch_id, branch in self.branches.items()
        }

        return {
            "node_id": self.node_id,
            "parent_node_id": self.parent_node_id,
            "depth": self.depth,
            "problem_statement": self.problem_statement,
            "cultural_context": self.cultural_context,
            "is_solution_node": self.is_solution_node,
            "best_branch_id": self.best_branch_id,
            "node_score": self.node_score,
            "processing_complete": self.processing_complete,
            "cultural_validation_complete": self.cultural_validation_complete,
            "total_branches": len(self.branches),
            "active_branches": len(self.get_active_branches()),
            "processing_time_ms": self.total_processing_time_ms,
            "branches": branch_summaries,
        }


class ReasoningTree:
    """Tree structure for R* reasoning with cultural intelligence"""

    def __init__(self, config: RStarConfig):
        self.config = config
        self.logger = logging.getLogger(f"{__name__}.ReasoningTree")

        # Tree structure
        self.nodes: Dict[str, ReasoningNode] = {}
        self.root_node_id: Optional[str] = None

        # Tree state
        self.max_depth_reached = 0
        self.total_nodes_created = 0
        self.total_branches_created = 0
        self.total_branches_pruned = 0

        # Cultural tracking
        self.cultural_validations_performed = 0
        self.average_cultural_score = 0.0
        self.islamic_compliance_rate = 0.0

        # Performance tracking
        self.creation_time = time.time()
        self.total_processing_time_ms = 0.0

    async def initialize_tree(
        self, root_problem: str, cultural_context: Dict[str, Any]
    ) -> str:
        """Initialize the reasoning tree with root problem"""

        root_id = f"root_{uuid.uuid4().hex[:8]}"

        root_node = ReasoningNode(
            node_id=root_id,
            problem_statement=root_problem,
            cultural_context=cultural_context,
            config=self.config,
        )

        self.nodes[root_id] = root_node
        self.root_node_id = root_id
        self.total_nodes_created = 1

        self.logger.info(f"Reasoning tree initialized with root node {root_id[:8]}")
        return root_id

    async def expand_tree_systematically(
        self, max_iterations: Optional[int] = None
    ) -> Dict[str, Any]:
        """Systematically expand the reasoning tree with cultural validation"""

        if not self.root_node_id:
            raise ValueError("Tree must be initialized before expansion")

        start_time = time.time()
        iterations = 0
        max_iter = max_iterations or 20

        # Priority queue for systematic expansion
        expansion_queue = [(0, self.root_node_id)]  # (priority, node_id)
        expanded_nodes = set()

        try:
            while expansion_queue and iterations < max_iter:
                # Get next node to expand
                priority, node_id = heapq.heappop(expansion_queue)

                if node_id in expanded_nodes:
                    continue

                node = self.nodes.get(node_id)
                if not node:
                    continue

                # Expand node
                branches = await node.expand_node()
                expanded_nodes.add(node_id)

                # Update tree statistics
                self.total_branches_created += len(branches)
                self.max_depth_reached = max(self.max_depth_reached, node.depth)

                # Process branches for further expansion
                for branch in branches:
                    if not branch.should_be_pruned():
                        # Create child node if branch is promising
                        if await self._should_create_child_node(branch):
                            child_node_id = await self._create_child_node(
                                node_id, branch
                            )

                            if child_node_id:
                                # Add to expansion queue with priority based on cultural score
                                priority = (
                                    -branch.cultural_score.overall_score
                                )  # Negative for max-heap behavior
                                heapq.heappush(
                                    expansion_queue, (priority, child_node_id)
                                )
                    else:
                        self.total_branches_pruned += 1

                iterations += 1

                # Check if we found a satisfactory solution
                if self._has_satisfactory_solution():
                    self.logger.info(
                        f"Satisfactory solution found after {iterations} iterations"
                    )
                    break

            # Calculate final statistics
            processing_time_ms = (time.time() - start_time) * 1000
            self.total_processing_time_ms += processing_time_ms

            # Update cultural statistics
            self._update_cultural_statistics()

            result = {
                "expansion_complete": True,
                "iterations_performed": iterations,
                "nodes_created": len(self.nodes),
                "branches_created": self.total_branches_created,
                "branches_pruned": self.total_branches_pruned,
                "max_depth_reached": self.max_depth_reached,
                "processing_time_ms": processing_time_ms,
                "cultural_validations": self.cultural_validations_performed,
                "average_cultural_score": self.average_cultural_score,
                "islamic_compliance_rate": self.islamic_compliance_rate,
                "has_solution": self._has_satisfactory_solution(),
            }

            self.logger.info(f"Tree expansion completed: {result}")
            return result

        except Exception as e:
            self.logger.error(f"Tree expansion failed: {e}")
            raise

    async def _should_create_child_node(self, branch: CulturalBranch) -> bool:
        """Determine if a child node should be created for this branch"""

        # Don't create child if branch should be pruned
        if branch.should_be_pruned():
            return False

        # Don't exceed maximum depth
        if branch.depth >= self.config.max_reasoning_depth:
            return False

        # Must pass cultural validation
        if (
            branch.cultural_score.overall_score
            < self.config.cultural_validation_threshold
        ):
            return False

        # Must pass Islamic compliance
        if (
            branch.cultural_score.islamic_compliance
            < self.config.islamic_compliance_threshold
        ):
            return False

        # Check if this appears to be a promising path
        if (
            branch.status == BranchStatus.VALIDATED
            and branch.cultural_score.overall_score > 0.8
        ):
            return True

        return False

    async def _create_child_node(
        self, parent_node_id: str, branch: CulturalBranch
    ) -> Optional[str]:
        """Create a child node based on the reasoning branch"""

        try:
            child_id = f"node_{uuid.uuid4().hex[:8]}"

            # Generate child problem statement based on branch reasoning
            child_problem = self._generate_child_problem(branch)

            # Create child node
            child_node = ReasoningNode(
                node_id=child_id,
                problem_statement=child_problem,
                cultural_context=branch.cultural_context,
                config=self.config,
                parent_node_id=parent_node_id,
            )

            child_node.depth = branch.depth

            # Add to tree
            self.nodes[child_id] = child_node
            self.total_nodes_created += 1

            # Update parent relationships
            parent_node = self.nodes[parent_node_id]
            parent_node.children.append(child_id)
            branch.children.append(child_id)

            self.logger.debug(
                f"Created child node {child_id[:8]} from parent {parent_node_id[:8]}"
            )
            return child_id

        except Exception as e:
            self.logger.error(f"Failed to create child node: {e}")
            return None

    def _generate_child_problem(self, branch: CulturalBranch) -> str:
        """Generate child problem statement based on branch reasoning"""

        reasoning_step = branch.reasoning_step
        cultural_focus = branch.cultural_context.get("focus", "general")

        if "Islamic principles" in reasoning_step:
            return f"Implement Islamic guidance for: {reasoning_step}"
        elif "cultural norms" in reasoning_step:
            return f"Apply Iraqi cultural considerations to: {reasoning_step}"
        elif "professional" in reasoning_step:
            return f"Execute professional approach for: {reasoning_step}"
        elif "ethical" in reasoning_step:
            return f"Ensure ethical implementation of: {reasoning_step}"
        else:
            return f"Continue systematic analysis of: {reasoning_step}"

    def _has_satisfactory_solution(self) -> bool:
        """Check if tree has found a satisfactory solution"""

        for node in self.nodes.values():
            if node.best_branch_id:
                best_branch = node.branches.get(node.best_branch_id)
                if (
                    best_branch
                    and best_branch.cultural_score.overall_score
                    >= self.config.cultural_validation_threshold
                    and best_branch.cultural_score.islamic_compliance
                    >= self.config.islamic_compliance_threshold
                ):
                    return True

        return False

    def _update_cultural_statistics(self):
        """Update cultural validation statistics"""

        all_branches = []
        for node in self.nodes.values():
            all_branches.extend(node.branches.values())

        if all_branches:
            self.cultural_validations_performed = len(
                [b for b in all_branches if b.validation_history]
            )

            cultural_scores = [
                b.cultural_score.overall_score
                for b in all_branches
                if b.cultural_score.overall_score > 0
            ]

            if cultural_scores:
                self.average_cultural_score = sum(cultural_scores) / len(
                    cultural_scores
                )

            islamic_compliant = [
                b
                for b in all_branches
                if b.cultural_score.islamic_compliance
                >= self.config.islamic_compliance_threshold
            ]

            self.islamic_compliance_rate = (
                len(islamic_compliant) / len(all_branches) if all_branches else 0
            )

    def get_best_solution_path(self) -> List[Dict[str, Any]]:
        """Get the best solution path through the tree"""

        if not self.root_node_id:
            return []

        path = []
        current_node_id = self.root_node_id

        while current_node_id:
            node = self.nodes.get(current_node_id)
            if not node:
                break

            path.append(
                {
                    "node_id": current_node_id,
                    "problem": node.problem_statement,
                    "score": node.node_score,
                    "depth": node.depth,
                }
            )

            # Find next node in path
            if node.best_branch_id:
                best_branch = node.branches.get(node.best_branch_id)
                if best_branch and best_branch.children:
                    current_node_id = (
                        best_branch.children[0] if best_branch.children else None
                    )
                else:
                    current_node_id = None
            else:
                current_node_id = None

        return path

    def get_tree_summary(self) -> Dict[str, Any]:
        """Get comprehensive summary of the reasoning tree"""

        return {
            "tree_id": f"tree_{int(self.creation_time)}",
            "root_node_id": self.root_node_id,
            "total_nodes": len(self.nodes),
            "total_branches_created": self.total_branches_created,
            "total_branches_pruned": self.total_branches_pruned,
            "max_depth_reached": self.max_depth_reached,
            "cultural_validations_performed": self.cultural_validations_performed,
            "average_cultural_score": self.average_cultural_score,
            "islamic_compliance_rate": self.islamic_compliance_rate,
            "has_satisfactory_solution": self._has_satisfactory_solution(),
            "best_solution_path": self.get_best_solution_path(),
            "processing_time_ms": self.total_processing_time_ms,
            "config": {
                "max_depth": self.config.max_reasoning_depth,
                "max_branches_per_node": self.config.max_branches_per_node,
                "cultural_threshold": self.config.cultural_validation_threshold,
                "islamic_threshold": self.config.islamic_compliance_threshold,
                "reasoning_strategy": self.config.reasoning_strategy.value,
            },
        }


class SystematicProblemSolver:
    """High-level systematic problem solver using R* with cultural intelligence"""

    def __init__(self, config: RStarConfig = None):
        self.config = config or RStarConfig()
        self.logger = logging.getLogger(__name__)

        # Problem solving state
        self.current_tree: Optional[ReasoningTree] = None
        self.solving_history: List[Dict[str, Any]] = []

        # Performance tracking
        self.total_problems_solved = 0
        self.success_rate = 0.0
        self.average_solving_time_ms = 0.0

    async def solve_problem_systematically(
        self,
        problem_statement: str,
        cultural_context: Dict[str, Any] = None,
        custom_config: Dict[str, Any] = None,
    ) -> Dict[str, Any]:
        """Solve a problem systematically using R* reasoning with cultural intelligence"""

        start_time = time.time()

        # Prepare cultural context
        if cultural_context is None:
            cultural_context = {
                "cultural_domain": "iraqi",
                "islamic_principles_required": True,
                "professional_context": "general",
                "language_preference": "bilingual",
            }

        # Apply custom configuration
        config = self.config
        if custom_config:
            config = RStarConfig(**{**self.config.__dict__, **custom_config})

        try:
            # Initialize reasoning tree
            self.current_tree = ReasoningTree(config)
            root_id = await self.current_tree.initialize_tree(
                problem_statement, cultural_context
            )

            # Systematically expand tree
            expansion_result = await self.current_tree.expand_tree_systematically()

            # Extract solution
            solution_path = self.current_tree.get_best_solution_path()
            tree_summary = self.current_tree.get_tree_summary()

            # Calculate metrics
            solving_time_ms = (time.time() - start_time) * 1000
            success = expansion_result.get("has_solution", False)

            # Create comprehensive result
            result = {
                "problem_statement": problem_statement,
                "cultural_context": cultural_context,
                "solution_found": success,
                "solution_path": solution_path,
                "tree_summary": tree_summary,
                "expansion_result": expansion_result,
                "solving_time_ms": solving_time_ms,
                "reasoning_metrics": ReasoningMetrics(
                    total_nodes_explored=len(self.current_tree.nodes),
                    branches_pruned=self.current_tree.total_branches_pruned,
                    cultural_validations_performed=self.current_tree.cultural_validations_performed,
                    average_branch_score=self.current_tree.average_cultural_score,
                    reasoning_depth_achieved=self.current_tree.max_depth_reached,
                    execution_time_ms=solving_time_ms,
                    success_rate=1.0 if success else 0.0,
                ),
            }

            # Update solver statistics
            self._update_solver_statistics(solving_time_ms, success)

            # Record in history
            self.solving_history.append(
                {
                    "timestamp": time.time(),
                    "problem": problem_statement,
                    "success": success,
                    "solving_time_ms": solving_time_ms,
                    "cultural_score": self.current_tree.average_cultural_score,
                }
            )

            self.logger.info(
                f"Problem solving completed: success={success}, time={solving_time_ms:.2f}ms"
            )

            return result

        except Exception as e:
            solving_time_ms = (time.time() - start_time) * 1000
            self.logger.error(f"Problem solving failed: {e}")

            # Update statistics for failure
            self._update_solver_statistics(solving_time_ms, False)

            return {
                "problem_statement": problem_statement,
                "cultural_context": cultural_context,
                "solution_found": False,
                "error": str(e),
                "solving_time_ms": solving_time_ms,
                "reasoning_metrics": ReasoningMetrics(
                    execution_time_ms=solving_time_ms, success_rate=0.0
                ),
            }

    def _update_solver_statistics(self, solving_time_ms: float, success: bool):
        """Update solver performance statistics"""

        self.total_problems_solved += 1

        # Update success rate
        if success:
            successes = self.success_rate * (self.total_problems_solved - 1) + 1
            self.success_rate = successes / self.total_problems_solved
        else:
            successes = self.success_rate * (self.total_problems_solved - 1)
            self.success_rate = successes / self.total_problems_solved

        # Update average solving time
        total_time = (
            self.average_solving_time_ms * (self.total_problems_solved - 1)
            + solving_time_ms
        )
        self.average_solving_time_ms = total_time / self.total_problems_solved

    def get_solver_statistics(self) -> Dict[str, Any]:
        """Get comprehensive solver statistics"""

        return {
            "total_problems_solved": self.total_problems_solved,
            "success_rate": self.success_rate,
            "average_solving_time_ms": self.average_solving_time_ms,
            "recent_performance": self.solving_history[-10:]
            if len(self.solving_history) > 10
            else self.solving_history,
            "current_config": {
                "max_reasoning_depth": self.config.max_reasoning_depth,
                "cultural_validation_threshold": self.config.cultural_validation_threshold,
                "islamic_compliance_threshold": self.config.islamic_compliance_threshold,
                "reasoning_strategy": self.config.reasoning_strategy.value,
            },
        }


class IraqiRStarReasoner:
    """Main Iraqi R* reasoning system integrating all components"""

    def __init__(self, config: RStarConfig = None):
        self.config = config or RStarConfig()
        self.logger = logging.getLogger(__name__)

        # Core components
        self.problem_solver = SystematicProblemSolver(self.config)

        # System state
        self.reasoning_sessions: Dict[str, Dict[str, Any]] = {}
        self.performance_history: List[Dict[str, Any]] = []

        self.logger.info(
            f"Iraqi R* Reasoner initialized with {self.config.reasoning_strategy.value} strategy"
        )

    async def reason_systematically(
        self,
        problem: str,
        cultural_context: Dict[str, Any] = None,
        session_id: str = None,
    ) -> Dict[str, Any]:
        """Main entry point for systematic reasoning with cultural intelligence"""

        session_id = session_id or f"session_{uuid.uuid4().hex[:8]}"

        try:
            # Solve problem systematically
            result = await self.problem_solver.solve_problem_systematically(
                problem, cultural_context
            )

            # Store session information
            self.reasoning_sessions[session_id] = {
                "problem": problem,
                "cultural_context": cultural_context,
                "result": result,
                "timestamp": time.time(),
            }

            # Track performance
            self.performance_history.append(
                {
                    "session_id": session_id,
                    "success": result.get("solution_found", False),
                    "execution_time_ms": result.get("solving_time_ms", 0),
                    "cultural_score": result.get("tree_summary", {}).get(
                        "average_cultural_score", 0
                    ),
                    "timestamp": time.time(),
                }
            )

            return {"session_id": session_id, **result}

        except Exception as e:
            self.logger.error(f"Systematic reasoning failed: {e}")
            raise

    async def get_reasoning_explanation(self, session_id: str) -> Dict[str, Any]:
        """Get detailed explanation of reasoning process for a session"""

        session = self.reasoning_sessions.get(session_id)
        if not session:
            raise ValueError(f"Session {session_id} not found")

        result = session["result"]
        tree_summary = result.get("tree_summary", {})
        solution_path = result.get("solution_path", [])

        explanation = {
            "session_id": session_id,
            "problem_analyzed": session["problem"],
            "cultural_context": session["cultural_context"],
            "reasoning_approach": {
                "strategy_used": self.config.reasoning_strategy.value,
                "max_depth": self.config.max_reasoning_depth,
                "cultural_validation": "enabled"
                if self.config.cultural_validation_threshold > 0
                else "disabled",
                "islamic_compliance": "required"
                if self.config.islamic_compliance_threshold > 0.8
                else "optional",
            },
            "exploration_summary": {
                "nodes_explored": tree_summary.get("total_nodes", 0),
                "branches_generated": tree_summary.get("total_branches_created", 0),
                "branches_pruned": tree_summary.get("total_branches_pruned", 0),
                "max_depth_reached": tree_summary.get("max_depth_reached", 0),
            },
            "cultural_analysis": {
                "validations_performed": tree_summary.get(
                    "cultural_validations_performed", 0
                ),
                "average_cultural_score": tree_summary.get("average_cultural_score", 0),
                "islamic_compliance_rate": tree_summary.get(
                    "islamic_compliance_rate", 0
                ),
                "cultural_appropriateness": "high"
                if tree_summary.get("average_cultural_score", 0) > 0.8
                else "moderate",
            },
            "solution_path": solution_path,
            "reasoning_quality": {
                "solution_found": result.get("solution_found", False),
                "reasoning_depth": len(solution_path),
                "cultural_compliance": tree_summary.get("islamic_compliance_rate", 0)
                > 0.9,
                "systematic_coverage": tree_summary.get("total_nodes", 0) > 3,
            },
        }

        return explanation

    def get_system_performance(self) -> Dict[str, Any]:
        """Get comprehensive system performance metrics"""

        recent_performance = (
            self.performance_history[-50:]
            if len(self.performance_history) > 50
            else self.performance_history
        )

        if recent_performance:
            success_rate = sum(1 for p in recent_performance if p["success"]) / len(
                recent_performance
            )
            avg_execution_time = sum(
                p["execution_time_ms"] for p in recent_performance
            ) / len(recent_performance)
            avg_cultural_score = sum(
                p["cultural_score"] for p in recent_performance
            ) / len(recent_performance)
        else:
            success_rate = avg_execution_time = avg_cultural_score = 0

        return {
            "system_stats": {
                "total_sessions": len(self.reasoning_sessions),
                "recent_success_rate": success_rate,
                "average_execution_time_ms": avg_execution_time,
                "average_cultural_score": avg_cultural_score,
            },
            "solver_statistics": self.problem_solver.get_solver_statistics(),
            "configuration": {
                "reasoning_strategy": self.config.reasoning_strategy.value,
                "max_depth": self.config.max_reasoning_depth,
                "max_branches_per_node": self.config.max_branches_per_node,
                "cultural_threshold": self.config.cultural_validation_threshold,
                "islamic_threshold": self.config.islamic_compliance_threshold,
                "cultural_context": self.config.cultural_context,
            },
            "performance_trend": recent_performance[-10:],  # Last 10 sessions
        }


# Export main classes
__all__ = [
    "IraqiRStarReasoner",
    "SystematicProblemSolver",
    "ReasoningTree",
    "ReasoningNode",
    "CulturalBranch",
    "RStarConfig",
    "ReasoningStrategy",
    "CulturalValidationLevel",
    "BranchStatus",
    "CulturalScore",
    "ReasoningMetrics",
]
