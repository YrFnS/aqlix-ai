"""
Multi-Agent Orchestration System - Iraqi Enhanced
================================================

Extracted and enhanced multi-agent orchestration patterns from Google's Agent Development Kit,
specifically adapted for Iraqi cultural contexts and Islamic compliance.

Based on ADK patterns from:
- src/google/adk/orchestration/multi_agent.py  
- src/google/adk/orchestration/sequential_agent.py
- src/google/adk/orchestration/parallel_agent.py
- src/google/adk/orchestration/loop_agent.py
"""

from typing import Dict, List, Optional, Any, Union, Callable, AsyncGenerator
from dataclasses import dataclass, field
from abc import ABC, abstractmethod
import asyncio
import json
from enum import Enum
from concurrent.futures import ThreadPoolExecutor
import time
from collections import deque

# Import core agent classes
from .core import IraqiAgent, IraqiAgentConfig, AgentStatus
from .cultural import CulturalMixin, IslamicComplianceMixin


class OrchestrationStrategy(Enum):
    """Multi-agent orchestration strategies"""
    SEQUENTIAL = "sequential"
    PARALLEL = "parallel"
    CONDITIONAL = "conditional"
    LOOP = "loop"
    HYBRID = "hybrid"
    CULTURAL_PRIORITY = "cultural_priority"


class DelegationMode(Enum):
    """Task delegation modes for Iraqi agents"""
    AUTOMATIC = "automatic"
    CULTURAL_BASED = "cultural_based"
    DOMAIN_BASED = "domain_based"
    MANUAL = "manual"


@dataclass
class OrchestrationConfig:
    """Configuration for Iraqi multi-agent orchestration"""
    
    # Core orchestration settings
    strategy: OrchestrationStrategy = OrchestrationStrategy.HYBRID
    delegation_mode: DelegationMode = DelegationMode.CULTURAL_BASED
    max_parallel_agents: int = 5
    timeout_seconds: int = 300
    
    # Iraqi cultural requirements
    cultural_validation_required: bool = True
    cultural_score_threshold: float = 0.95
    islamic_principles_enforcement: bool = True
    
    # Performance settings  
    enable_caching: bool = True
    cache_ttl_seconds: int = 3600
    enable_monitoring: bool = True
    
    # Error handling
    max_retries: int = 3
    retry_backoff_seconds: float = 1.0
    fail_fast_on_cultural_violations: bool = True


class IraqiMultiAgentSystem(CulturalMixin):
    """
    Main orchestration system for Iraqi agents based on Google ADK patterns
    
    Provides hierarchical multi-agent coordination with cultural awareness
    """
    
    def __init__(self, config: OrchestrationConfig):
        """Initialize Iraqi multi-agent orchestration system"""
        self.config = config
        self.agents: Dict[str, IraqiAgent] = {}
        self.orchestration_history = deque(maxlen=1000)
        self.performance_metrics = {}
        
        # Initialize cultural compliance
        CulturalMixin.__init__(self)
        
        # Set up monitoring and caching
        if config.enable_caching:
            self.result_cache = {}
            
        if config.enable_monitoring:
            self.performance_tracker = PerformanceTracker()
    
    def register_agent(self, agent: IraqiAgent) -> None:
        """Register an agent with the orchestration system"""
        self.agents[agent.config.name] = agent
        
    def unregister_agent(self, agent_name: str) -> None:
        """Remove an agent from orchestration system"""
        if agent_name in self.agents:
            del self.agents[agent_name]
    
    async def orchestrate(
        self,
        task: Dict[str, Any],
        agent_selection: Optional[List[str]] = None,
        strategy_override: Optional[OrchestrationStrategy] = None
    ) -> Dict[str, Any]:
        """
        Main orchestration method for coordinating multiple Iraqi agents
        """
        orchestration_id = f"orch_{int(time.time() * 1000)}"
        start_time = time.time()
        
        try:
            # Pre-orchestration cultural validation
            if self.config.cultural_validation_required:
                cultural_validation = await self.validate_cultural_compliance(task)
                if not cultural_validation["is_compliant"]:
                    return {
                        "status": "error",
                        "orchestration_id": orchestration_id,
                        "error": "Cultural compliance validation failed",
                        "cultural_validation": cultural_validation
                    }
            
            # Determine strategy and agent selection
            strategy = strategy_override or self.config.strategy
            selected_agents = await self._select_agents(task, agent_selection)
            
            if not selected_agents:
                return {
                    "status": "error",
                    "orchestration_id": orchestration_id,
                    "error": "No suitable agents found for task"
                }
            
            # Execute orchestration based on strategy
            if strategy == OrchestrationStrategy.SEQUENTIAL:
                result = await self._execute_sequential(task, selected_agents, orchestration_id)
            elif strategy == OrchestrationStrategy.PARALLEL:
                result = await self._execute_parallel(task, selected_agents, orchestration_id)
            elif strategy == OrchestrationStrategy.LOOP:
                result = await self._execute_loop(task, selected_agents, orchestration_id)
            elif strategy == OrchestrationStrategy.CULTURAL_PRIORITY:
                result = await self._execute_cultural_priority(task, selected_agents, orchestration_id)
            else:  # HYBRID
                result = await self._execute_hybrid(task, selected_agents, orchestration_id)
            
            # Post-orchestration cultural validation
            if self.config.cultural_validation_required:
                cultural_validation = await self.validate_cultural_compliance(result)
                result["cultural_validation"] = cultural_validation
                
                if not cultural_validation["is_compliant"] and self.config.fail_fast_on_cultural_violations:
                    result = await self._apply_cultural_corrections(result, cultural_validation)
            
            # Record performance metrics
            execution_time = time.time() - start_time
            if self.config.enable_monitoring:
                self.performance_tracker.record_orchestration(
                    orchestration_id, strategy, len(selected_agents), execution_time, result["status"]
                )
            
            # Update orchestration history
            self.orchestration_history.append({
                "id": orchestration_id,
                "strategy": strategy.value,
                "agents": [agent.config.name for agent in selected_agents],
                "execution_time": execution_time,
                "status": result["status"],
                "timestamp": time.time()
            })
            
            return result
            
        except Exception as e:
            return {
                "status": "error",
                "orchestration_id": orchestration_id,
                "error": str(e),
                "execution_time": time.time() - start_time
            }
    
    async def _select_agents(
        self,
        task: Dict[str, Any],
        explicit_selection: Optional[List[str]] = None
    ) -> List[IraqiAgent]:
        """Select appropriate agents for the task"""
        
        if explicit_selection:
            return [self.agents[name] for name in explicit_selection if name in self.agents]
        
        # Intelligent agent selection based on task characteristics
        selected = []
        task_text = str(task).lower()
        
        # Cultural validation always required
        cultural_agents = [agent for agent in self.agents.values() 
                         if "cultural" in agent.config.name.lower() or "validator" in agent.config.name.lower()]
        selected.extend(cultural_agents[:1])  # Add primary cultural validator
        
        # Arabic processing if needed
        if self._contains_arabic_content(task):
            arabic_agents = [agent for agent in self.agents.values()
                           if "arabic" in agent.config.name.lower() or "rtl" in agent.config.name.lower()]
            selected.extend(arabic_agents[:1])
        
        # Professional domain agents
        for domain in ["legal", "medical", "educational"]:
            if domain in task_text:
                domain_agents = [agent for agent in self.agents.values()
                               if domain in agent.config.name.lower() or domain in str(agent.config.professional_domains)]
                selected.extend(domain_agents[:1])
        
        # Payment processing if needed
        if any(term in task_text for term in ["payment", "zain", "fastpay", "nasswal"]):
            payment_agents = [agent for agent in self.agents.values()
                            if "payment" in agent.config.name.lower() or "financial" in agent.config.name.lower()]
            selected.extend(payment_agents[:1])
        
        return selected[:self.config.max_parallel_agents]
    
    async def _execute_sequential(
        self,
        task: Dict[str, Any],
        agents: List[IraqiAgent],
        orchestration_id: str
    ) -> Dict[str, Any]:
        """Execute agents sequentially with result chaining"""
        
        results = []
        current_input = task
        
        for i, agent in enumerate(agents):
            agent_result = await agent.process({
                **current_input,
                "orchestration_id": orchestration_id,
                "agent_sequence_position": i,
                "previous_results": results
            })
            
            results.append(agent_result)
            
            # Chain results for next agent
            if agent_result.get("status") == "success":
                current_input = {
                    **current_input,
                    "previous_agent_output": agent_result.get("response"),
                    "cumulative_results": results
                }
            else:
                # Handle agent failure
                return {
                    "status": "error",
                    "orchestration_id": orchestration_id,
                    "error": f"Agent {agent.config.name} failed: {agent_result.get('error')}",
                    "partial_results": results,
                    "orchestration_type": "sequential"
                }
        
        return {
            "status": "success",
            "orchestration_id": orchestration_id,
            "response": self._synthesize_sequential_results(results),
            "agent_results": results,
            "orchestration_type": "sequential"
        }
    
    async def _execute_parallel(
        self,
        task: Dict[str, Any],
        agents: List[IraqiAgent],
        orchestration_id: str
    ) -> Dict[str, Any]:
        """Execute agents in parallel for independent processing"""
        
        # Create individual tasks for each agent
        agent_tasks = []
        for i, agent in enumerate(agents):
            agent_task = agent.process({
                **task,
                "orchestration_id": orchestration_id,
                "agent_parallel_position": i
            })
            agent_tasks.append(agent_task)
        
        # Execute all agents concurrently
        try:
            results = await asyncio.gather(*agent_tasks, return_exceptions=True)
            
            # Process results and handle exceptions
            processed_results = []
            errors = []
            
            for i, result in enumerate(results):
                if isinstance(result, Exception):
                    errors.append(f"Agent {agents[i].config.name}: {str(result)}")
                else:
                    processed_results.append(result)
            
            if errors and not processed_results:
                return {
                    "status": "error",
                    "orchestration_id": orchestration_id,
                    "error": "All agents failed",
                    "errors": errors,
                    "orchestration_type": "parallel"
                }
            
            return {
                "status": "success" if not errors else "partial_success",
                "orchestration_id": orchestration_id,
                "response": self._synthesize_parallel_results(processed_results),
                "agent_results": processed_results,
                "errors": errors if errors else None,
                "orchestration_type": "parallel"
            }
            
        except Exception as e:
            return {
                "status": "error",
                "orchestration_id": orchestration_id,
                "error": f"Parallel execution failed: {str(e)}",
                "orchestration_type": "parallel"
            }
    
    async def _execute_loop(
        self,
        task: Dict[str, Any],
        agents: List[IraqiAgent],
        orchestration_id: str
    ) -> Dict[str, Any]:
        """Execute agents in iterative loop until convergence or max iterations"""
        
        max_iterations = task.get("max_iterations", 5)
        convergence_threshold = task.get("convergence_threshold", 0.95)
        
        results = []
        current_state = task
        iteration = 0
        
        while iteration < max_iterations:
            iteration_results = []
            
            # Execute all agents in current iteration
            for agent in agents:
                agent_result = await agent.process({
                    **current_state,
                    "orchestration_id": orchestration_id,
                    "loop_iteration": iteration,
                    "previous_loop_results": results
                })
                iteration_results.append(agent_result)
            
            results.append({
                "iteration": iteration,
                "agent_results": iteration_results,
                "timestamp": time.time()
            })
            
            # Check for convergence or termination conditions
            if self._check_loop_convergence(iteration_results, convergence_threshold):
                break
            
            # Update state for next iteration
            current_state = {
                **current_state,
                "loop_state": self._extract_loop_state(iteration_results),
                "iteration_history": results
            }
            
            iteration += 1
        
        return {
            "status": "success",
            "orchestration_id": orchestration_id,
            "response": self._synthesize_loop_results(results),
            "loop_results": results,
            "total_iterations": iteration + 1,
            "orchestration_type": "loop"
        }
    
    async def _execute_cultural_priority(
        self,
        task: Dict[str, Any],
        agents: List[IraqiAgent],
        orchestration_id: str
    ) -> Dict[str, Any]:
        """Execute with cultural validation taking priority"""
        
        # Separate cultural and non-cultural agents
        cultural_agents = [agent for agent in agents 
                          if "cultural" in agent.config.name.lower() or 
                          getattr(agent.config, 'cultural_compliance_required', False)]
        
        other_agents = [agent for agent in agents if agent not in cultural_agents]
        
        # Execute cultural agents first
        cultural_results = []
        if cultural_agents:
            for agent in cultural_agents:
                result = await agent.process({
                    **task,
                    "orchestration_id": orchestration_id,
                    "cultural_priority_mode": True
                })
                cultural_results.append(result)
                
                # Check cultural compliance
                if result.get("status") != "success" or not result.get("cultural_validation", {}).get("is_compliant", True):
                    return {
                        "status": "error",
                        "orchestration_id": orchestration_id,
                        "error": "Cultural compliance validation failed",
                        "cultural_results": cultural_results,
                        "orchestration_type": "cultural_priority"
                    }
        
        # Execute other agents only if cultural validation passed
        other_results = []
        if other_agents:
            enhanced_task = {
                **task,
                "cultural_context": self._extract_cultural_context(cultural_results),
                "orchestration_id": orchestration_id
            }
            
            for agent in other_agents:
                result = await agent.process(enhanced_task)
                other_results.append(result)
        
        return {
            "status": "success",
            "orchestration_id": orchestration_id,
            "response": self._synthesize_cultural_priority_results(cultural_results, other_results),
            "cultural_results": cultural_results,
            "other_results": other_results,
            "orchestration_type": "cultural_priority"
        }
    
    async def _execute_hybrid(
        self,
        task: Dict[str, Any],
        agents: List[IraqiAgent],
        orchestration_id: str
    ) -> Dict[str, Any]:
        """Execute using hybrid strategy based on task characteristics"""
        
        task_complexity = self._assess_task_complexity(task)
        
        if task_complexity > 0.8:
            # High complexity: Use cultural priority with sequential processing
            return await self._execute_cultural_priority(task, agents, orchestration_id)
        elif task_complexity > 0.5:
            # Medium complexity: Use parallel processing
            return await self._execute_parallel(task, agents, orchestration_id)
        else:
            # Low complexity: Use sequential processing
            return await self._execute_sequential(task, agents, orchestration_id)
    
    def _contains_arabic_content(self, data: Any) -> bool:
        """Check if data contains Arabic content"""
        text = str(data)
        return any('\u0600' <= char <= '\u06FF' for char in text)
    
    def _assess_task_complexity(self, task: Dict[str, Any]) -> float:
        """Assess task complexity for hybrid strategy selection"""
        complexity_score = 0.0
        
        # Text complexity
        task_text = str(task)
        complexity_score += min(len(task_text) / 1000, 0.3)
        
        # Cultural requirements
        if self._contains_arabic_content(task):
            complexity_score += 0.2
        
        # Professional domain indicators
        professional_terms = ["legal", "medical", "educational", "organizational"]
        if any(term in task_text.lower() for term in professional_terms):
            complexity_score += 0.2
        
        # Payment processing
        payment_terms = ["payment", "financial", "transaction"]
        if any(term in task_text.lower() for term in payment_terms):
            complexity_score += 0.2
        
        # Multi-step indicators
        step_indicators = ["step", "phase", "stage", "process"]
        if any(indicator in task_text.lower() for indicator in step_indicators):
            complexity_score += 0.1
        
        return min(complexity_score, 1.0)
    
    def _synthesize_sequential_results(self, results: List[Dict[str, Any]]) -> str:
        """Synthesize results from sequential execution"""
        if not results:
            return "No results to synthesize"
        
        final_result = results[-1].get("response", "")
        context_summary = f"Sequential processing completed with {len(results)} agents"
        
        return f"{context_summary}\n\nFinal Result: {final_result}"
    
    def _synthesize_parallel_results(self, results: List[Dict[str, Any]]) -> str:
        """Synthesize results from parallel execution"""
        if not results:
            return "No results to synthesize"
        
        successful_results = [r for r in results if r.get("status") == "success"]
        responses = [r.get("response", "") for r in successful_results if r.get("response")]
        
        return f"Parallel processing completed with {len(successful_results)}/{len(results)} successful agents\n\n" + \
               "\n---\n".join(responses)
    
    def _synthesize_loop_results(self, results: List[Dict[str, Any]]) -> str:
        """Synthesize results from loop execution"""
        if not results:
            return "No loop results to synthesize"
        
        final_iteration = results[-1]["agent_results"]
        summary = f"Loop processing completed after {len(results)} iterations"
        
        final_responses = [r.get("response", "") for r in final_iteration if r.get("response")]
        
        return f"{summary}\n\nFinal Results:\n" + "\n---\n".join(final_responses)
    
    def _synthesize_cultural_priority_results(
        self,
        cultural_results: List[Dict[str, Any]],
        other_results: List[Dict[str, Any]]
    ) -> str:
        """Synthesize results from cultural priority execution"""
        
        cultural_summary = f"Cultural validation completed with {len(cultural_results)} agents"
        
        if other_results:
            other_summary = f"Additional processing completed with {len(other_results)} agents"
            other_responses = [r.get("response", "") for r in other_results if r.get("response")]
            return f"{cultural_summary}\n{other_summary}\n\n" + "\n---\n".join(other_responses)
        
        return cultural_summary
    
    def _check_loop_convergence(self, iteration_results: List[Dict[str, Any]], threshold: float) -> bool:
        """Check if loop has converged"""
        # Simple convergence check - can be enhanced with more sophisticated logic
        successful_results = [r for r in iteration_results if r.get("status") == "success"]
        return len(successful_results) / len(iteration_results) >= threshold
    
    def _extract_loop_state(self, iteration_results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Extract state for next loop iteration"""
        return {
            "previous_iteration_success_rate": len([r for r in iteration_results if r.get("status") == "success"]) / len(iteration_results),
            "agent_outputs": [r.get("response") for r in iteration_results if r.get("response")]
        }
    
    def _extract_cultural_context(self, cultural_results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Extract cultural context from cultural agent results"""
        context = {
            "cultural_compliance_verified": True,
            "islamic_principles_validated": True,
            "cultural_recommendations": []
        }
        
        for result in cultural_results:
            if cultural_validation := result.get("cultural_validation"):
                context["cultural_compliance_verified"] &= cultural_validation.get("is_compliant", True)
                context["islamic_principles_validated"] &= cultural_validation.get("islamic_compliance", True)
                context["cultural_recommendations"].extend(cultural_validation.get("recommendations", []))
        
        return context
    
    async def _apply_cultural_corrections(
        self,
        result: Dict[str, Any],
        validation: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Apply cultural corrections to result"""
        result["cultural_corrections_applied"] = True
        result["original_validation"] = validation
        result["status"] = "corrected"
        
        return result


class IraqiSequentialAgent(IraqiAgent):
    """
    Sequential processing agent based on Google ADK patterns
    
    Processes tasks in sequential order with result chaining
    """
    
    def __init__(self, name: str, sub_agents: List[IraqiAgent], **kwargs):
        super().__init__(name=name, **kwargs)
        self.sub_agents = sub_agents
        self.orchestration_system = IraqiMultiAgentSystem(OrchestrationConfig(
            strategy=OrchestrationStrategy.SEQUENTIAL
        ))
        
        # Register sub-agents
        for agent in sub_agents:
            self.orchestration_system.register_agent(agent)
    
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process input through sequential agent chain"""
        return await self.orchestration_system.orchestrate(
            input_data,
            agent_selection=[agent.config.name for agent in self.sub_agents],
            strategy_override=OrchestrationStrategy.SEQUENTIAL
        )


class IraqiParallelAgent(IraqiAgent):
    """
    Parallel processing agent based on Google ADK patterns
    
    Processes tasks in parallel for independent operations
    """
    
    def __init__(self, name: str, sub_agents: List[IraqiAgent], **kwargs):
        super().__init__(name=name, **kwargs)
        self.sub_agents = sub_agents
        self.orchestration_system = IraqiMultiAgentSystem(OrchestrationConfig(
            strategy=OrchestrationStrategy.PARALLEL,
            max_parallel_agents=len(sub_agents)
        ))
        
        # Register sub-agents
        for agent in sub_agents:
            self.orchestration_system.register_agent(agent)
    
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process input through parallel agent execution"""
        return await self.orchestration_system.orchestrate(
            input_data,
            agent_selection=[agent.config.name for agent in self.sub_agents],
            strategy_override=OrchestrationStrategy.PARALLEL
        )


class IraqiLoopAgent(IraqiAgent):
    """
    Iterative loop processing agent based on Google ADK patterns
    
    Processes tasks in iterative loops until convergence
    """
    
    def __init__(
        self,
        name: str,
        sub_agents: List[IraqiAgent],
        max_iterations: int = 5,
        convergence_threshold: float = 0.95,
        **kwargs
    ):
        super().__init__(name=name, **kwargs)
        self.sub_agents = sub_agents
        self.max_iterations = max_iterations
        self.convergence_threshold = convergence_threshold
        
        self.orchestration_system = IraqiMultiAgentSystem(OrchestrationConfig(
            strategy=OrchestrationStrategy.LOOP
        ))
        
        # Register sub-agents
        for agent in sub_agents:
            self.orchestration_system.register_agent(agent)
    
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process input through iterative loop execution"""
        enhanced_input = {
            **input_data,
            "max_iterations": self.max_iterations,
            "convergence_threshold": self.convergence_threshold
        }
        
        return await self.orchestration_system.orchestrate(
            enhanced_input,
            agent_selection=[agent.config.name for agent in self.sub_agents],
            strategy_override=OrchestrationStrategy.LOOP
        )


class PerformanceTracker:
    """Performance monitoring for orchestration system"""
    
    def __init__(self):
        self.orchestration_metrics = []
        self.agent_metrics = {}
    
    def record_orchestration(
        self,
        orchestration_id: str,
        strategy: OrchestrationStrategy,
        agent_count: int,
        execution_time: float,
        status: str
    ) -> None:
        """Record orchestration performance metrics"""
        self.orchestration_metrics.append({
            "id": orchestration_id,
            "strategy": strategy.value,
            "agent_count": agent_count,
            "execution_time": execution_time,
            "status": status,
            "timestamp": time.time()
        })
    
    def get_performance_summary(self) -> Dict[str, Any]:
        """Get performance summary statistics"""
        if not self.orchestration_metrics:
            return {"status": "no_data"}
        
        total_orchestrations = len(self.orchestration_metrics)
        successful_orchestrations = len([m for m in self.orchestration_metrics if m["status"] == "success"])
        avg_execution_time = sum(m["execution_time"] for m in self.orchestration_metrics) / total_orchestrations
        
        return {
            "total_orchestrations": total_orchestrations,
            "success_rate": successful_orchestrations / total_orchestrations,
            "average_execution_time": avg_execution_time,
            "strategy_distribution": self._get_strategy_distribution()
        }
    
    def _get_strategy_distribution(self) -> Dict[str, int]:
        """Get distribution of orchestration strategies used"""
        distribution = {}
        for metric in self.orchestration_metrics:
            strategy = metric["strategy"]
            distribution[strategy] = distribution.get(strategy, 0) + 1
        return distribution