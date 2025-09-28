#!/usr/bin/env python3
"""
Iraqi Debugging Integration Module
ENHANCED INTEGRATION: Advanced Debugging + Trajectory Intelligence

This module provides seamless integration between the Iraqi Advanced Debugging Engine
and the main Iraqi Trajectory Intelligence System, enabling comprehensive debugging
capabilities for Iraqi AI systems.

Key Integration Features:
- Real-time debugging intelligence during trajectory recording
- Cultural context-aware error analysis and recovery
- MCP server coordination monitoring and failover
- Agent delegation debugging with Iraqi-specific intelligence
- Performance monitoring with Iraqi baseline metrics
- Emergency debugging protocols for critical system failures

Integration Architecture:
- Non-invasive enhancement of existing trajectory recording
- Backward compatibility with existing Iraqi AI systems
- Optional advanced debugging with graceful fallback
- Comprehensive diagnostics and reporting
- Production-ready logging and alerting
"""

import asyncio
import logging
from typing import Any, Dict, List, Optional
from datetime import datetime, timezone

# Import the advanced debugging engine
from iraqi_advanced_debugging import (
    IraqiAdvancedDebuggingEngine,
    IraqiDebugMetadata,
    IraqiDebugLevel,
    IraqiErrorCategory,
)

logger = logging.getLogger(__name__)


class IraqiDebuggingIntegrationManager:
    """Integration manager for advanced debugging with trajectory recording."""

    def __init__(self, enable_advanced_debugging: bool = True):
        self.enable_advanced_debugging = enable_advanced_debugging
        self.debugging_engine = (
            IraqiAdvancedDebuggingEngine() if enable_advanced_debugging else None
        )
        self.integration_metrics = {
            "total_integrations": 0,
            "successful_integrations": 0,
            "failed_integrations": 0,
            "emergency_protocols_activated": 0,
        }

    async def integrate_with_trajectory_step(
        self,
        step_data: Dict[str, Any],
        cultural_context: str,
        error_message: Optional[str] = None,
        stack_trace: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Integrate advanced debugging with trajectory step processing."""

        if not self.enable_advanced_debugging or not self.debugging_engine:
            return {"debugging_enabled": False, "integration_status": "disabled"}

        try:
            self.integration_metrics["total_integrations"] += 1

            integration_result = {
                "debugging_enabled": True,
                "integration_status": "success",
                "debug_metadata": None,
                "performance_analysis": None,
                "recommendations": [],
                "emergency_actions": [],
            }

            # Perform error analysis if error detected
            if error_message:
                debug_metadata = await self.debugging_engine.analyze_error_with_context(
                    error_message=error_message,
                    context=step_data,
                    stack_trace=stack_trace,
                    cultural_context=cultural_context,
                )
                integration_result["debug_metadata"] = debug_metadata

                # Check for emergency conditions
                if debug_metadata.debug_level == IraqiDebugLevel.CRITICAL:
                    emergency_response = await self._handle_emergency_debugging(
                        error_message, step_data, cultural_context, debug_metadata
                    )
                    integration_result["emergency_actions"] = emergency_response
                    self.integration_metrics["emergency_protocols_activated"] += 1

            # Performance monitoring for all steps
            step_duration = step_data.get("duration_ms", 0)
            if step_duration > 0:
                performance_analysis = await self.debugging_engine.monitor_performance(
                    operation_name=f"trajectory_step_{step_data.get('step_number', 'unknown')}",
                    duration_ms=step_duration,
                    success=not bool(error_message),
                    cultural_context=cultural_context,
                )
                integration_result["performance_analysis"] = performance_analysis

            # Generate step-specific recommendations
            recommendations = self._generate_step_recommendations(
                step_data, cultural_context, integration_result.get("debug_metadata")
            )
            integration_result["recommendations"] = recommendations

            self.integration_metrics["successful_integrations"] += 1
            return integration_result

        except Exception as e:
            logger.error(f"Error during debugging integration: {e}")
            self.integration_metrics["failed_integrations"] += 1
            return {
                "debugging_enabled": True,
                "integration_status": "failed",
                "integration_error": str(e),
                "fallback_mode": True,
            }

    async def integrate_with_llm_interaction(
        self,
        interaction_data: Dict[str, Any],
        cultural_context: str,
        provider: str,
        model: str,
    ) -> Dict[str, Any]:
        """Integrate advanced debugging with LLM interaction analysis."""

        if not self.enable_advanced_debugging or not self.debugging_engine:
            return {"debugging_enabled": False}

        try:
            integration_result = {
                "debugging_enabled": True,
                "mcp_coordination_analysis": None,
                "arabic_content_analysis": None,
                "cultural_validation_analysis": None,
                "performance_insights": [],
            }

            # Analyze MCP server coordination if applicable
            if any(
                server in str(interaction_data).lower()
                for server in ["sequential", "context7", "magic", "playwright"]
            ):
                mcp_analysis = await self._analyze_mcp_coordination(
                    interaction_data, provider
                )
                integration_result["mcp_coordination_analysis"] = mcp_analysis

            # Analyze Arabic content if present
            content_str = str(interaction_data)
            if any(ord(char) >= 0x0600 and ord(char) <= 0x06FF for char in content_str):
                arabic_analysis = await self.debugging_engine._analyze_arabic_content(
                    content_str
                )
                integration_result["arabic_content_analysis"] = arabic_analysis

            # Cultural validation analysis
            cultural_analysis = (
                await self.debugging_engine._perform_cultural_validation(
                    content_str, cultural_context
                )
            )
            integration_result["cultural_validation_analysis"] = cultural_analysis

            # Generate performance insights
            insights = self._generate_llm_interaction_insights(
                interaction_data, provider, model, cultural_context
            )
            integration_result["performance_insights"] = insights

            return integration_result

        except Exception as e:
            logger.error(f"Error during LLM interaction debugging integration: {e}")
            return {
                "debugging_enabled": True,
                "integration_error": str(e),
                "fallback_mode": True,
            }

    async def integrate_with_sequential_thinking(
        self, thought_data: Dict[str, Any], cultural_context: str, language_mode: str
    ) -> Dict[str, Any]:
        """Integrate advanced debugging with sequential thinking analysis."""

        if not self.enable_advanced_debugging or not self.debugging_engine:
            return {"debugging_enabled": False}

        try:
            integration_result = {
                "debugging_enabled": True,
                "thought_complexity_analysis": None,
                "cultural_debugging_analysis": None,
                "performance_optimization_suggestions": [],
            }

            # Analyze thought complexity
            thought_content = thought_data.get("thought", "")
            complexity_score = self.debugging_engine._calculate_enhanced_complexity(
                {"thought": thought_content}
            )

            integration_result["thought_complexity_analysis"] = {
                "complexity_score": complexity_score,
                "processing_difficulty": "high"
                if complexity_score > 0.7
                else "medium"
                if complexity_score > 0.4
                else "low",
                "estimated_processing_time_ms": self.debugging_engine._estimate_enhanced_processing_time(
                    {"thought": thought_content}
                ),
            }

            # Cultural debugging analysis if applicable
            if cultural_context and cultural_context != "business_commercial":
                cultural_debug = await self._analyze_thought_cultural_context(
                    thought_content, cultural_context, language_mode
                )
                integration_result["cultural_debugging_analysis"] = cultural_debug

            # Performance optimization suggestions
            optimization_suggestions = self._generate_thought_optimization_suggestions(
                thought_data, complexity_score, cultural_context
            )
            integration_result["performance_optimization_suggestions"] = (
                optimization_suggestions
            )

            return integration_result

        except Exception as e:
            logger.error(f"Error during sequential thinking debugging integration: {e}")
            return {
                "debugging_enabled": True,
                "integration_error": str(e),
                "fallback_mode": True,
            }

    async def _handle_emergency_debugging(
        self,
        error_message: str,
        context: Dict[str, Any],
        cultural_context: str,
        debug_metadata: IraqiDebugMetadata,
    ) -> List[Dict[str, Any]]:
        """Handle emergency debugging scenarios."""

        emergency_actions = []

        try:
            # Determine emergency type based on error category
            if debug_metadata.error_category == IraqiErrorCategory.CULTURAL_VIOLATION:
                emergency_actions.extend(
                    [
                        {
                            "action": "isolate_cultural_violation",
                            "description": "Immediately isolate culturally inappropriate content",
                            "priority": 1,
                            "timeout_seconds": 30,
                            "agents_required": ["iraqi-cultural-validator"],
                        },
                        {
                            "action": "notify_compliance_team",
                            "description": "Alert cultural compliance team of violation",
                            "priority": 2,
                            "timeout_seconds": 60,
                            "escalation_required": True,
                        },
                    ]
                )

            elif debug_metadata.error_category == IraqiErrorCategory.PAYMENT_GATEWAY:
                emergency_actions.extend(
                    [
                        {
                            "action": "halt_payment_processing",
                            "description": "Stop all payment processing to prevent financial damage",
                            "priority": 1,
                            "timeout_seconds": 15,
                            "agents_required": ["payment-security-guardian"],
                        },
                        {
                            "action": "activate_payment_fallback",
                            "description": "Switch to backup Iraqi payment gateway",
                            "priority": 2,
                            "timeout_seconds": 120,
                            "agents_required": [
                                "iraqi-payment-tester",
                                "external-service-coordinator",
                            ],
                        },
                    ]
                )

            elif debug_metadata.error_category == IraqiErrorCategory.ARABIC_ENCODING:
                emergency_actions.extend(
                    [
                        {
                            "action": "force_utf8_encoding",
                            "description": "Force UTF-8 encoding across all Arabic text systems",
                            "priority": 1,
                            "timeout_seconds": 30,
                            "agents_required": ["arabic-rtl-processor"],
                        },
                        {
                            "action": "quarantine_corrupted_text",
                            "description": "Isolate and quarantine corrupted Arabic text segments",
                            "priority": 2,
                            "timeout_seconds": 60,
                            "agents_required": ["iraqi-technical-debugger"],
                        },
                    ]
                )

            elif debug_metadata.error_category == IraqiErrorCategory.MCP_SERVER_FAILURE:
                emergency_actions.extend(
                    [
                        {
                            "action": "activate_mcp_failover",
                            "description": "Activate backup MCP servers for critical operations",
                            "priority": 1,
                            "timeout_seconds": 60,
                            "agents_required": ["iraqi-devops-engineer"],
                        },
                        {
                            "action": "switch_local_processing",
                            "description": "Switch to local processing mode with degraded features",
                            "priority": 2,
                            "timeout_seconds": 30,
                            "feature_degradation": True,
                        },
                    ]
                )

            # Add general emergency protocol
            emergency_actions.append(
                {
                    "action": "preserve_iraqi_context",
                    "description": "Ensure Iraqi cultural context is preserved during emergency recovery",
                    "priority": 10,
                    "timeout_seconds": 5,
                    "critical": True,
                }
            )

            logger.critical(
                f"Emergency debugging protocol activated: {debug_metadata.error_category.value if debug_metadata.error_category else 'unknown'} | Actions: {len(emergency_actions)}"
            )

            return emergency_actions

        except Exception as e:
            logger.error(f"Error handling emergency debugging: {e}")
            return [
                {
                    "action": "emergency_handler_failure",
                    "description": f"Emergency handler failed: {str(e)}",
                    "priority": 1,
                    "manual_intervention_required": True,
                }
            ]

    async def _analyze_mcp_coordination(
        self, interaction_data: Dict[str, Any], provider: str
    ) -> Dict[str, Any]:
        """Analyze MCP server coordination during LLM interactions."""

        coordination_analysis = {
            "mcp_servers_involved": [],
            "coordination_efficiency": "unknown",
            "potential_issues": [],
            "optimization_suggestions": [],
        }

        try:
            # Detect MCP servers involved
            data_str = str(interaction_data).lower()
            mcp_servers = [
                "sequential",
                "context7",
                "magic",
                "playwright",
                "supabase",
                "sentry",
            ]

            for server in mcp_servers:
                if server in data_str:
                    coordination_analysis["mcp_servers_involved"].append(server)

            # Analyze coordination efficiency
            if len(coordination_analysis["mcp_servers_involved"]) > 3:
                coordination_analysis["coordination_efficiency"] = "complex"
                coordination_analysis["potential_issues"].append(
                    "High MCP server coordination complexity may cause delays"
                )
            elif len(coordination_analysis["mcp_servers_involved"]) > 1:
                coordination_analysis["coordination_efficiency"] = "moderate"
            else:
                coordination_analysis["coordination_efficiency"] = "simple"

            # Check for specific coordination patterns
            if (
                "sequential" in coordination_analysis["mcp_servers_involved"]
                and "context7" in coordination_analysis["mcp_servers_involved"]
            ):
                coordination_analysis["optimization_suggestions"].append(
                    "Consider caching Context7 documentation lookups for Sequential analysis"
                )

            if "magic" in coordination_analysis["mcp_servers_involved"]:
                if any(term in data_str for term in ["arabic", "rtl"]):
                    coordination_analysis["potential_issues"].append(
                        "Magic MCP server may need Arabic/RTL component support"
                    )

            return coordination_analysis

        except Exception as e:
            logger.error(f"Error analyzing MCP coordination: {e}")
            return {"error": str(e), "fallback_analysis": True}

    async def _analyze_thought_cultural_context(
        self, thought_content: str, cultural_context: str, language_mode: str
    ) -> Dict[str, Any]:
        """Analyze cultural context of sequential thoughts."""

        cultural_analysis = {
            "cultural_complexity": 0.0,
            "language_processing_requirements": [],
            "cultural_compliance_risk": "low",
            "recommendations": [],
        }

        try:
            # Calculate cultural complexity
            cultural_analysis["cultural_complexity"] = (
                self.debugging_engine._calculate_cultural_complexity(cultural_context)
            )

            # Analyze language processing requirements
            if language_mode in ["arabic_standard", "iraqi_dialect", "mixed"]:
                cultural_analysis["language_processing_requirements"].append(
                    "Arabic text processing"
                )

                if any(
                    ord(char) >= 0x0600 and ord(char) <= 0x06FF
                    for char in thought_content
                ):
                    cultural_analysis["language_processing_requirements"].append(
                        "RTL rendering support"
                    )

            # Assess cultural compliance risk
            if "professional" in cultural_context.lower():
                if any(
                    term in thought_content.lower()
                    for term in ["legal", "medical", "educational"]
                ):
                    cultural_analysis["cultural_compliance_risk"] = "medium"
                    cultural_analysis["recommendations"].append(
                        "Ensure professional domain compliance"
                    )

            if any(
                term in thought_content.lower()
                for term in ["islamic", "religious", "cultural"]
            ):
                cultural_analysis["cultural_compliance_risk"] = "high"
                cultural_analysis["recommendations"].append(
                    "Validate against Islamic principles and Iraqi cultural norms"
                )

            # Language-specific recommendations
            if language_mode == "iraqi_dialect":
                cultural_analysis["recommendations"].append(
                    "Use iraqi-arabic-tester for dialect-specific validation"
                )

            return cultural_analysis

        except Exception as e:
            logger.error(f"Error analyzing thought cultural context: {e}")
            return {"error": str(e), "fallback_analysis": True}

    def _generate_step_recommendations(
        self,
        step_data: Dict[str, Any],
        cultural_context: str,
        debug_metadata: Optional[IraqiDebugMetadata],
    ) -> List[str]:
        """Generate recommendations for trajectory step optimization."""

        recommendations = []

        # Performance-based recommendations
        step_duration = step_data.get("duration_ms", 0)
        if step_duration > 2000:  # Over 2 seconds
            recommendations.append(
                "Consider optimizing step processing time - current duration exceeds 2 seconds"
            )

        # Cultural context recommendations
        if "professional" in cultural_context.lower():
            recommendations.append(
                "Ensure professional domain compliance throughout step execution"
            )

        # Debug metadata recommendations
        if debug_metadata:
            if debug_metadata.resolution_confidence < 0.7:
                recommendations.append(
                    "Low resolution confidence detected - consider manual review"
                )

            if debug_metadata.error_category == IraqiErrorCategory.ARABIC_ENCODING:
                recommendations.append(
                    "Deploy arabic-rtl-processor for Arabic text processing improvements"
                )

            if debug_metadata.error_category == IraqiErrorCategory.CULTURAL_VIOLATION:
                recommendations.append(
                    "Activate iraqi-cultural-validator for enhanced cultural compliance"
                )

        # Step-specific recommendations
        if step_data.get("tool_calls"):
            tool_count = len(step_data["tool_calls"])
            if tool_count > 5:
                recommendations.append(
                    f"High tool usage ({tool_count} tools) - consider consolidating operations"
                )

        return recommendations

    def _generate_llm_interaction_insights(
        self,
        interaction_data: Dict[str, Any],
        provider: str,
        model: str,
        cultural_context: str,
    ) -> List[str]:
        """Generate performance insights for LLM interactions."""

        insights = []

        # Provider-specific insights
        if provider == "anthropic" and "claude" in model.lower():
            insights.append("Claude model optimized for cultural context understanding")

        # Cultural context insights
        if "islamic" in cultural_context.lower():
            insights.append(
                "Islamic compliance validation recommended for this interaction"
            )

        if "arabic" in str(interaction_data).lower():
            insights.append(
                "Arabic content detected - ensure RTL processing capabilities"
            )

        # Token usage insights
        if "usage" in interaction_data:
            usage = interaction_data["usage"]
            input_tokens = usage.get("input_tokens", 0)
            output_tokens = usage.get("output_tokens", 0)

            if input_tokens > 8000:
                insights.append(
                    f"High input token usage ({input_tokens}) - consider context optimization"
                )

            if output_tokens > 4000:
                insights.append(
                    f"High output token usage ({output_tokens}) - monitor for completeness"
                )

        return insights

    def _generate_thought_optimization_suggestions(
        self,
        thought_data: Dict[str, Any],
        complexity_score: float,
        cultural_context: str,
    ) -> List[str]:
        """Generate optimization suggestions for sequential thoughts."""

        suggestions = []

        # Complexity-based suggestions
        if complexity_score > 0.8:
            suggestions.append(
                "High thought complexity - consider breaking into smaller, focused thoughts"
            )

        # Cultural context suggestions
        if "professional" in cultural_context.lower():
            suggestions.append(
                "Professional domain context - ensure specialized agent validation"
            )

        # Arabic content suggestions
        thought_content = thought_data.get("thought", "")
        if any(ord(char) >= 0x0600 and ord(char) <= 0x06FF for char in thought_content):
            suggestions.append(
                "Arabic content in thought - validate encoding and dialect processing"
            )

        # Performance suggestions
        if len(thought_content) > 1000:
            suggestions.append(
                "Long thought content - consider caching for repeated processing"
            )

        return suggestions

    def get_integration_status(self) -> Dict[str, Any]:
        """Get comprehensive integration status and metrics."""

        status = {
            "advanced_debugging_enabled": self.enable_advanced_debugging,
            "debugging_engine_available": self.debugging_engine is not None,
            "integration_metrics": dict(self.integration_metrics),
            "success_rate": 0.0,
            "emergency_protocol_rate": 0.0,
        }

        # Calculate success rate
        total_integrations = self.integration_metrics["total_integrations"]
        if total_integrations > 0:
            status["success_rate"] = (
                self.integration_metrics["successful_integrations"] / total_integrations
            )
            status["emergency_protocol_rate"] = (
                self.integration_metrics["emergency_protocols_activated"]
                / total_integrations
            )

        # Add debugging engine status
        if self.debugging_engine:
            status["debugging_engine_status"] = {
                "error_patterns_learned": len(self.debugging_engine.debugging_cache),
                "system_metrics_collected": len(
                    self.debugging_engine.system_metrics_history
                ),
                "mcp_servers_monitored": len(self.debugging_engine.mcp_server_health),
                "agent_coordination_patterns": len(
                    self.debugging_engine.agent_coordination_stats
                ),
            }

        return status

    async def perform_system_health_check(self) -> Dict[str, Any]:
        """Perform comprehensive system health check using debugging intelligence."""

        if not self.enable_advanced_debugging or not self.debugging_engine:
            return {
                "health_check_available": False,
                "message": "Advanced debugging disabled - basic health check not available",
            }

        try:
            # Get comprehensive diagnostics from debugging engine
            diagnostics = self.debugging_engine.get_comprehensive_diagnostics()

            # Add integration-specific health metrics
            integration_health = {
                "integration_success_rate": self.integration_metrics[
                    "successful_integrations"
                ]
                / max(1, self.integration_metrics["total_integrations"]),
                "emergency_protocols_functioning": self.integration_metrics[
                    "emergency_protocols_activated"
                ]
                >= 0,
                "debugging_integration_status": "operational",
            }

            # Combine results
            health_check_result = {
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "overall_health_score": diagnostics.get("system_health_score", 0.0),
                "debugging_diagnostics": diagnostics,
                "integration_health": integration_health,
                "health_check_available": True,
                "recommendations": diagnostics.get("intelligent_recommendations", []),
            }

            return health_check_result

        except Exception as e:
            logger.error(f"Error performing system health check: {e}")
            return {
                "health_check_available": True,
                "health_check_error": str(e),
                "fallback_status": "error",
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }


# Export for easy integration
__all__ = ["IraqiDebuggingIntegrationManager"]
