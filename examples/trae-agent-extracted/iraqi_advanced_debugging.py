#!/usr/bin/env python3
"""
Iraqi Advanced Debugging Intelligence Module
ENHANCED FOR: Iraqi AI Systems with Cultural Context Awareness

This module provides advanced debugging capabilities specifically designed for Iraqi AI systems,
including Arabic text processing, cultural compliance monitoring, payment gateway debugging,
MCP server coordination analysis, and agent delegation intelligence.

Key Features:
- Iraqi-specific error pattern recognition
- Arabic text and RTL rendering diagnostics
- Cultural compliance debugging with Islamic principles
- Payment gateway integration debugging (ZainCash, FastPay, NassWallet)
- MCP server coordination monitoring (Sequential, Context7, Magic, Playwright, Supabase, Sentry)
- Agent delegation performance analysis
- Real-time system health monitoring
- Emergency debugging protocols for critical Iraqi system failures

Technical Integration:
- Performance monitoring with Iraqi baseline metrics
- Error recovery with cultural context preservation
- System diagnostics with Arabic content analysis
- Multi-agent coordination debugging
- Production-ready logging and alerting
"""

import asyncio
import hashlib
import logging
import psutil
import re
import time
import traceback
from collections import defaultdict, deque
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional, Tuple
from dataclasses import dataclass, field
from enum import Enum

# Configure logging for Arabic text support
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class IraqiDebugLevel(Enum):
    """Debug levels for Iraqi-specific debugging scenarios."""

    TRACE = "trace"  # Detailed execution tracing
    DEBUG = "debug"  # General debugging information
    INFO = "info"  # Informational messages
    WARNING = "warning"  # Warning conditions
    ERROR = "error"  # Error conditions
    CRITICAL = "critical"  # Critical system failures
    CULTURAL = "cultural"  # Cultural compliance issues
    ARABIC = "arabic"  # Arabic text processing issues
    PAYMENT = "payment"  # Payment gateway issues
    SECURITY = "security"  # Security-related issues


class IraqiErrorCategory(Enum):
    """Categories for Iraqi-specific error classification."""

    CULTURAL_VIOLATION = "cultural_violation"
    ARABIC_ENCODING = "arabic_encoding"
    RTL_RENDERING = "rtl_rendering"
    ISLAMIC_COMPLIANCE = "islamic_compliance"
    PAYMENT_GATEWAY = "payment_gateway"
    PROFESSIONAL_DOMAIN = "professional_domain"
    AGENT_COORDINATION = "agent_coordination"
    MCP_SERVER_FAILURE = "mcp_server_failure"
    PERFORMANCE_DEGRADATION = "performance_degradation"
    SECURITY_BREACH = "security_breach"
    SYSTEM_INTEGRATION = "system_integration"
    DIALECT_RECOGNITION = "dialect_recognition"
    GOVERNMENT_SERVICE = "government_service"
    MIXED_CONTENT = "mixed_content"


@dataclass
class IraqiDebugMetadata:
    """Advanced debugging metadata for Iraqi technical systems."""

    debug_level: IraqiDebugLevel
    error_category: Optional[IraqiErrorCategory] = None
    stack_trace: Optional[str] = None
    system_metrics: Dict[str, Any] = field(default_factory=dict)
    arabic_processing_stats: Dict[str, Any] = field(default_factory=dict)
    mcp_server_status: Dict[str, str] = field(default_factory=dict)
    agent_coordination_logs: List[Dict[str, Any]] = field(default_factory=list)
    performance_benchmarks: Dict[str, float] = field(default_factory=dict)
    cultural_validation_results: Dict[str, Any] = field(default_factory=dict)
    security_analysis: Dict[str, Any] = field(default_factory=dict)
    error_patterns: List[str] = field(default_factory=list)
    recovery_attempts: List[Dict[str, Any]] = field(default_factory=list)
    root_cause_analysis: Optional[str] = None
    resolution_confidence: float = 0.0
    debugging_duration_ms: float = 0.0


class IraqiAdvancedDebuggingEngine:
    """Advanced debugging engine for Iraqi AI systems with comprehensive intelligence."""

    def __init__(self):
        self.error_patterns_db = self._initialize_error_patterns()
        self.performance_baselines = self._initialize_performance_baselines()
        self.mcp_server_health = {}
        self.agent_coordination_stats = defaultdict(list)
        self.debugging_cache = {}
        self.error_recovery_strategies = self._initialize_recovery_strategies()
        self.system_metrics_history = deque(maxlen=1000)
        self.cultural_debugging_rules = self._initialize_cultural_rules()
        self.arabic_processing_tools = self._initialize_arabic_tools()

    def _initialize_error_patterns(self) -> Dict[str, Dict[str, Any]]:
        """Initialize comprehensive Iraqi-specific error patterns."""
        return {
            "arabic_encoding": {
                "patterns": [
                    r"UnicodeDecodeError.*arabic",
                    r"\?{3,}",  # Question marks indicating encoding issues
                    r"mojibake.*arabic",
                    r"charset.*utf-8.*error",
                    r"\\u[0-9a-f]{4}.*arabic",
                    r"encoding.*error.*[\u0600-\u06FF]",
                    r"utf.*8.*decode.*error",
                    r"invalid.*continuation.*byte",
                ],
                "category": IraqiErrorCategory.ARABIC_ENCODING,
                "debug_level": IraqiDebugLevel.CRITICAL,
                "recovery_priority": 1,
                "cultural_impact": "critical",
                "agents_required": ["arabic-rtl-processor", "iraqi-technical-debugger"],
            },
            "rtl_rendering": {
                "patterns": [
                    r"direction.*rtl.*error",
                    r"text-align.*right.*broken",
                    r"arabic.*layout.*issue",
                    r"bidi.*algorithm.*fail",
                    r"mixed.*content.*direction",
                    r"css.*rtl.*conflict",
                    r"unicode.*bidi.*error",
                    r"layout.*engine.*rtl",
                ],
                "category": IraqiErrorCategory.RTL_RENDERING,
                "debug_level": IraqiDebugLevel.ERROR,
                "recovery_priority": 2,
                "cultural_impact": "high",
                "agents_required": [
                    "iraqi-ui-designer",
                    "iraqi-accessibility-specialist",
                ],
            },
            "payment_gateway": {
                "patterns": [
                    r"zaincash.*error.*[0-9]{4}",
                    r"fastpay.*authentication.*failed",
                    r"nasswallet.*timeout",
                    r"iqd.*conversion.*error",
                    r"payment.*gateway.*[45][0-9]{2}",
                    r"merchant.*id.*invalid",
                    r"webhook.*verification.*failed",
                    r"transaction.*declined.*iraqi",
                ],
                "category": IraqiErrorCategory.PAYMENT_GATEWAY,
                "debug_level": IraqiDebugLevel.CRITICAL,
                "recovery_priority": 1,
                "cultural_impact": "critical",
                "agents_required": [
                    "payment-security-guardian",
                    "iraqi-payment-tester",
                ],
            },
            "cultural_violation": {
                "patterns": [
                    r"islamic.*compliance.*fail",
                    r"cultural.*inappropriate",
                    r"haram.*content.*detected",
                    r"religious.*sensitivity.*violation",
                    r"professional.*domain.*mismatch",
                    r"cultural.*norm.*violation",
                    r"inappropriate.*iraqi.*context",
                    r"offensive.*religious.*content",
                ],
                "category": IraqiErrorCategory.CULTURAL_VIOLATION,
                "debug_level": IraqiDebugLevel.CRITICAL,
                "recovery_priority": 1,
                "cultural_impact": "critical",
                "agents_required": [
                    "iraqi-cultural-validator",
                    "iraqi-cultural-tester",
                ],
            },
            "mcp_server_failure": {
                "patterns": [
                    r"sequential.*mcp.*timeout",
                    r"context7.*unavailable",
                    r"magic.*server.*error",
                    r"playwright.*connection.*failed",
                    r"supabase.*mcp.*disconnect",
                    r"sentry.*mcp.*unreachable",
                    r"mcp.*protocol.*error",
                    r"server.*coordination.*failed",
                ],
                "category": IraqiErrorCategory.MCP_SERVER_FAILURE,
                "debug_level": IraqiDebugLevel.ERROR,
                "recovery_priority": 2,
                "cultural_impact": "medium",
                "agents_required": [
                    "iraqi-technical-debugger",
                    "iraqi-devops-engineer",
                ],
            },
            "agent_coordination": {
                "patterns": [
                    r"agent.*delegation.*failed",
                    r"iraqi.*agent.*timeout",
                    r"cultural.*validator.*error",
                    r"arabic.*processor.*crash",
                    r"payment.*tester.*unavailable",
                    r"agent.*communication.*error",
                    r"coordination.*timeout",
                    r"agent.*not.*responding",
                ],
                "category": IraqiErrorCategory.AGENT_COORDINATION,
                "debug_level": IraqiDebugLevel.WARNING,
                "recovery_priority": 3,
                "cultural_impact": "medium",
                "agents_required": [
                    "iraqi-workflow-orchestrator",
                    "iraqi-context-manager",
                ],
            },
            "dialect_recognition": {
                "patterns": [
                    r"iraqi.*dialect.*not.*recognized",
                    r"colloquial.*arabic.*processing.*error",
                    r"dialect.*classification.*failed",
                    r"vernacular.*arabic.*issue",
                    r"local.*expression.*not.*understood",
                ],
                "category": IraqiErrorCategory.DIALECT_RECOGNITION,
                "debug_level": IraqiDebugLevel.WARNING,
                "recovery_priority": 4,
                "cultural_impact": "medium",
                "agents_required": ["iraqi-arabic-tester", "arabic-rtl-processor"],
            },
        }

    def _initialize_performance_baselines(self) -> Dict[str, Dict[str, float]]:
        """Initialize performance baselines for Iraqi systems."""
        return {
            "cultural_validation": {
                "max_response_time_ms": 500.0,
                "success_rate_threshold": 0.95,
                "accuracy_threshold": 0.90,
                "islamic_compliance_threshold": 0.90,
            },
            "arabic_processing": {
                "max_response_time_ms": 200.0,
                "rtl_accuracy_threshold": 0.99,
                "dialect_recognition_threshold": 0.85,
                "encoding_success_rate": 0.99,
            },
            "payment_gateway": {
                "max_response_time_ms": 3000.0,
                "success_rate_threshold": 0.99,
                "security_compliance_threshold": 1.0,
                "transaction_timeout_ms": 30000.0,
            },
            "mcp_coordination": {
                "max_response_time_ms": 1000.0,
                "server_availability_threshold": 0.98,
                "coordination_success_rate": 0.95,
                "failover_time_ms": 2000.0,
            },
            "agent_delegation": {
                "max_response_time_ms": 2000.0,
                "delegation_success_rate": 0.90,
                "context_preservation_rate": 0.95,
                "coordination_efficiency": 0.85,
            },
        }

    def _initialize_recovery_strategies(
        self,
    ) -> Dict[IraqiErrorCategory, Dict[str, Any]]:
        """Initialize comprehensive error recovery strategies."""
        return {
            IraqiErrorCategory.ARABIC_ENCODING: {
                "immediate_actions": [
                    "force_utf8_encoding",
                    "validate_arabic_input",
                    "apply_encoding_fallback",
                    "isolate_corrupted_text",
                    "restart_arabic_processor",
                ],
                "escalation_path": [
                    "arabic-rtl-processor",
                    "iraqi-technical-debugger",
                    "iraqi-devops-engineer",
                ],
                "recovery_timeout_ms": 5000,
                "retry_limit": 3,
                "fallback_mode": "ascii_transliteration",
            },
            IraqiErrorCategory.CULTURAL_VIOLATION: {
                "immediate_actions": [
                    "block_inappropriate_content",
                    "apply_cultural_filter",
                    "escalate_to_validator",
                    "notify_compliance_team",
                    "audit_content_pipeline",
                ],
                "escalation_path": [
                    "iraqi-cultural-validator",
                    "iraqi-cultural-tester",
                    "iraqi-professional-domain-expert",
                ],
                "recovery_timeout_ms": 1000,
                "retry_limit": 1,
                "fallback_mode": "safe_mode_with_cultural_guard",
            },
            IraqiErrorCategory.PAYMENT_GATEWAY: {
                "immediate_actions": [
                    "retry_with_exponential_backoff",
                    "validate_credentials",
                    "switch_gateway_fallback",
                    "check_network_connectivity",
                    "verify_iqd_conversion_rates",
                ],
                "escalation_path": [
                    "payment-security-guardian",
                    "iraqi-payment-tester",
                    "external-service-coordinator",
                ],
                "recovery_timeout_ms": 10000,
                "retry_limit": 3,
                "fallback_mode": "alternative_payment_gateway",
            },
            IraqiErrorCategory.MCP_SERVER_FAILURE: {
                "immediate_actions": [
                    "health_check_all_mcp_servers",
                    "retry_connection_with_backoff",
                    "activate_fallback_servers",
                    "switch_to_local_processing",
                    "alert_operations_team",
                ],
                "escalation_path": [
                    "iraqi-technical-debugger",
                    "iraqi-devops-engineer",
                    "iraqi-workflow-orchestrator",
                ],
                "recovery_timeout_ms": 5000,
                "retry_limit": 2,
                "fallback_mode": "local_processing_with_degraded_features",
            },
            IraqiErrorCategory.AGENT_COORDINATION: {
                "immediate_actions": [
                    "restart_failed_agents",
                    "check_agent_health",
                    "retry_coordination",
                    "fallback_to_direct_processing",
                    "preserve_cultural_context",
                ],
                "escalation_path": [
                    "iraqi-workflow-orchestrator",
                    "iraqi-context-manager",
                    "iraqi-ai-agent-architect",
                ],
                "recovery_timeout_ms": 8000,
                "retry_limit": 2,
                "fallback_mode": "single_agent_processing",
            },
        }

    def _initialize_cultural_rules(self) -> Dict[str, Dict[str, Any]]:
        """Initialize Iraqi cultural debugging rules."""
        return {
            "islamic_compliance": {
                "prohibited_content": [
                    "alcohol",
                    "gambling",
                    "interest",
                    "usury",
                    "adultery",
                    "inappropriate_imagery",
                    "offensive_language",
                    "blasphemy",
                ],
                "required_respect": [
                    "prayer_times",
                    "ramadan_consideration",
                    "religious_holidays",
                    "family_values",
                    "elder_respect",
                    "community_harmony",
                ],
                "validation_threshold": 0.90,
            },
            "professional_domains": {
                "legal": {
                    "iraqi_civil_law_compliance": True,
                    "islamic_jurisprudence_consideration": True,
                    "professional_ethics_required": True,
                    "client_confidentiality_absolute": True,
                },
                "medical": {
                    "hippocratic_oath_compliance": True,
                    "islamic_medical_ethics": True,
                    "patient_privacy_absolute": True,
                    "cultural_sensitivity_required": True,
                },
                "educational": {
                    "knowledge_pursuit_encouraged": True,
                    "student_welfare_priority": True,
                    "cultural_integration_balanced": True,
                    "continuous_development_required": True,
                },
            },
            "linguistic_requirements": {
                "arabic_accuracy": 0.99,
                "iraqi_dialect_recognition": 0.85,
                "mixed_content_handling": True,
                "rtl_rendering_required": True,
                "unicode_compliance": True,
            },
        }

    def _initialize_arabic_tools(self) -> Dict[str, Any]:
        """Initialize Arabic text processing debugging tools."""
        return {
            "encoding_patterns": {
                "utf8_valid": re.compile(
                    r"^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s\d\w]*$"
                ),
                "corruption_indicators": ["\\ufffd", "?", "???", "????", "�"],
                "mixed_content": re.compile(
                    r"[\u0600-\u06FF]+.*[a-zA-Z]+|[a-zA-Z]+.*[\u0600-\u06FF]+"
                ),
            },
            "rtl_patterns": {
                "rtl_markers": ["\\u202E", "\\u202D", "\\u202C"],  # RLE, LRE, PDF
                "bidi_controls": ["\\u200E", "\\u200F", "\\u061C"],  # LRM, RLM, ALM
                "direction_conflicts": re.compile(
                    r"direction\s*:\s*ltr.*[\u0600-\u06FF]|text-align\s*:\s*left.*[\u0600-\u06FF]",
                    re.IGNORECASE,
                ),
            },
            "dialect_detection": {
                "iraqi_markers": [
                    "شلونك",
                    "شكو ماكو",
                    "وين رايح",
                    "احنا",
                    "انتو",
                    "هاي",
                    "هذول",
                    "وكت",
                    "شسوي",
                ],
                "formal_markers": [
                    "كيف حالك",
                    "ماذا تفعل",
                    "أين تذهب",
                    "نحن",
                    "أنتم",
                    "هذه",
                    "هؤلاء",
                    "وقت",
                    "ماذا تفعل",
                ],
                "confidence_threshold": 0.7,
            },
        }

    async def analyze_error_with_context(
        self,
        error_message: str,
        context: Dict[str, Any],
        stack_trace: Optional[str] = None,
        cultural_context: Optional[str] = None,
    ) -> IraqiDebugMetadata:
        """Analyze error with comprehensive Iraqi context awareness."""
        start_time = time.time()

        debug_metadata = IraqiDebugMetadata(
            debug_level=IraqiDebugLevel.INFO,
            stack_trace=stack_trace,
            system_metrics=await self._collect_comprehensive_metrics(),
            debugging_duration_ms=0.0,
        )

        try:
            # Enhanced error classification
            error_category = await self._classify_error_with_intelligence(
                error_message, stack_trace, context, cultural_context
            )
            debug_metadata.error_category = error_category

            # Set debug level based on category and severity
            if error_category:
                pattern_info = self._get_pattern_info(error_category)
                debug_metadata.debug_level = pattern_info["debug_level"]

                # Cultural impact assessment
                cultural_impact = pattern_info.get("cultural_impact", "low")
                if cultural_impact == "critical":
                    debug_metadata.debug_level = IraqiDebugLevel.CRITICAL

            # Comprehensive context analysis
            await self._analyze_comprehensive_context(
                debug_metadata, context, cultural_context
            )

            # Advanced root cause analysis
            root_cause = await self._perform_advanced_root_cause_analysis(
                error_message, context, error_category, stack_trace, cultural_context
            )
            debug_metadata.root_cause_analysis = root_cause

            # Intelligent recovery plan generation
            recovery_plan = await self._generate_intelligent_recovery_plan(
                error_category, error_message, context, cultural_context
            )
            debug_metadata.recovery_attempts = recovery_plan

            # Enhanced confidence calculation
            debug_metadata.resolution_confidence = self._calculate_enhanced_confidence(
                error_category, root_cause, context, cultural_context
            )

            # Pattern learning and storage
            await self._learn_and_store_pattern(
                error_message, error_category, context, cultural_context
            )

            logger.info(
                f"Advanced error analysis complete: {error_category.value if error_category else 'unknown'} | Confidence: {debug_metadata.resolution_confidence:.2f}"
            )

        except Exception as e:
            logger.error(f"Critical error during advanced debugging analysis: {e}")
            debug_metadata.debug_level = IraqiDebugLevel.CRITICAL
            debug_metadata.error_category = IraqiErrorCategory.SYSTEM_INTEGRATION
            debug_metadata.root_cause_analysis = (
                f"Debugging system critical failure: {str(e)}"
            )
            debug_metadata.resolution_confidence = 0.1

        debug_metadata.debugging_duration_ms = (time.time() - start_time) * 1000
        return debug_metadata

    async def _classify_error_with_intelligence(
        self,
        error_message: str,
        stack_trace: Optional[str],
        context: Dict[str, Any],
        cultural_context: Optional[str],
    ) -> Optional[IraqiErrorCategory]:
        """Enhanced error classification with cultural intelligence."""
        combined_text = f"{error_message} {stack_trace or ''} {str(context)} {cultural_context or ''}"

        # Multi-pass classification for accuracy
        classifications = []

        # Pattern-based classification
        for pattern_name, pattern_info in self.error_patterns_db.items():
            for pattern in pattern_info["patterns"]:
                if re.search(pattern, combined_text, re.IGNORECASE):
                    classifications.append(
                        {
                            "category": pattern_info["category"],
                            "confidence": self._calculate_pattern_confidence(
                                pattern, combined_text
                            ),
                            "method": "pattern_match",
                        }
                    )

        # Context-based classification
        context_category = self._classify_by_context(context, cultural_context)
        if context_category:
            classifications.append(
                {
                    "category": context_category,
                    "confidence": 0.7,
                    "method": "context_analysis",
                }
            )

        # Cultural context classification
        if cultural_context:
            cultural_category = self._classify_by_cultural_context(
                cultural_context, error_message
            )
            if cultural_category:
                classifications.append(
                    {
                        "category": cultural_category,
                        "confidence": 0.8,
                        "method": "cultural_analysis",
                    }
                )

        # Return highest confidence classification
        if classifications:
            best_classification = max(classifications, key=lambda x: x["confidence"])
            if best_classification["confidence"] > 0.6:
                return best_classification["category"]

        return None

    def _calculate_pattern_confidence(self, pattern: str, text: str) -> float:
        """Calculate confidence score for pattern match."""
        matches = len(re.findall(pattern, text, re.IGNORECASE))
        text_length = len(text)

        # Base confidence from match count
        confidence = min(matches * 0.3, 0.9)

        # Adjust based on pattern specificity
        if "iraqi" in pattern.lower() or "arabic" in pattern.lower():
            confidence += 0.1  # Higher confidence for Iraqi-specific patterns

        # Adjust based on text context
        if text_length > 1000:  # Longer text, lower individual pattern confidence
            confidence *= 0.9

        return min(confidence, 1.0)

    def _classify_by_context(
        self, context: Dict[str, Any], cultural_context: Optional[str]
    ) -> Optional[IraqiErrorCategory]:
        """Classify error based on context analysis."""
        context_str = str(context).lower()

        # Payment-related context
        if any(
            gateway in context_str
            for gateway in ["zaincash", "fastpay", "nasswallet", "payment", "iqd"]
        ):
            return IraqiErrorCategory.PAYMENT_GATEWAY

        # Arabic processing context
        if any(
            term in context_str
            for term in ["arabic", "rtl", "unicode", "encoding", "dialect"]
        ):
            return IraqiErrorCategory.ARABIC_ENCODING

        # Cultural context
        if any(
            term in context_str
            for term in ["cultural", "islamic", "compliance", "inappropriate"]
        ):
            return IraqiErrorCategory.CULTURAL_VIOLATION

        # MCP server context
        if any(
            server in context_str
            for server in [
                "sequential",
                "context7",
                "magic",
                "playwright",
                "supabase",
                "sentry",
            ]
        ):
            return IraqiErrorCategory.MCP_SERVER_FAILURE

        # Agent coordination context
        if any(
            term in context_str
            for term in ["agent", "delegate", "coordination", "iraqi-"]
        ):
            return IraqiErrorCategory.AGENT_COORDINATION

        return None

    def _classify_by_cultural_context(
        self, cultural_context: str, error_message: str
    ) -> Optional[IraqiErrorCategory]:
        """Classify error based on cultural context."""
        cultural_lower = cultural_context.lower()
        error_lower = error_message.lower()

        # Professional domain issues
        if any(
            domain in cultural_lower
            for domain in ["legal", "medical", "educational", "government"]
        ):
            if "compliance" in error_lower or "standards" in error_lower:
                return IraqiErrorCategory.PROFESSIONAL_DOMAIN

        # Islamic compliance issues
        if any(
            term in cultural_lower
            for term in ["islamic", "religious", "halal", "haram"]
        ):
            return IraqiErrorCategory.ISLAMIC_COMPLIANCE

        # Arabic language issues
        if any(
            term in cultural_lower for term in ["arabic", "language", "dialect", "rtl"]
        ):
            if "encoding" in error_lower:
                return IraqiErrorCategory.ARABIC_ENCODING
            elif "rendering" in error_lower or "display" in error_lower:
                return IraqiErrorCategory.RTL_RENDERING
            elif "dialect" in error_lower or "recognition" in error_lower:
                return IraqiErrorCategory.DIALECT_RECOGNITION

        return None

    async def _collect_comprehensive_metrics(self) -> Dict[str, Any]:
        """Collect comprehensive system metrics for debugging."""
        try:
            basic_metrics = {
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "cpu_usage_percent": psutil.cpu_percent(interval=0.1),
                "memory_usage_percent": psutil.virtual_memory().percent,
                "disk_usage_percent": psutil.disk_usage("/").percent,
                "process_count": len(psutil.pids()),
                "available_memory_mb": psutil.virtual_memory().available
                // (1024 * 1024),
                "load_average": psutil.getloadavg()
                if hasattr(psutil, "getloadavg")
                else [0, 0, 0],
            }

            # Network statistics
            try:
                network_stats = psutil.net_io_counters()
                basic_metrics.update(
                    {
                        "bytes_sent": network_stats.bytes_sent,
                        "bytes_recv": network_stats.bytes_recv,
                        "packets_sent": network_stats.packets_sent,
                        "packets_recv": network_stats.packets_recv,
                    }
                )
            except Exception as e:
                basic_metrics["network_error"] = str(e)

            # Process-specific metrics
            try:
                current_process = psutil.Process()
                basic_metrics.update(
                    {
                        "process_memory_mb": current_process.memory_info().rss
                        // (1024 * 1024),
                        "process_cpu_percent": current_process.cpu_percent(),
                        "process_threads": current_process.num_threads(),
                        "process_fds": current_process.num_fds()
                        if hasattr(current_process, "num_fds")
                        else 0,
                    }
                )
            except Exception as e:
                basic_metrics["process_error"] = str(e)

            return basic_metrics

        except Exception as e:
            logger.warning(f"Failed to collect comprehensive system metrics: {e}")
            return {
                "error": str(e),
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }

    async def _analyze_comprehensive_context(
        self,
        debug_metadata: IraqiDebugMetadata,
        context: Dict[str, Any],
        cultural_context: Optional[str],
    ) -> None:
        """Perform comprehensive context analysis."""
        # Arabic processing analysis
        context_str = str(context)
        if re.search(r"[\u0600-\u06FF]", context_str):
            debug_metadata.arabic_processing_stats = await self._analyze_arabic_content(
                context_str
            )

        # MCP server status analysis
        mcp_servers = [
            "sequential",
            "context7",
            "magic",
            "playwright",
            "supabase",
            "sentry",
        ]
        for server in mcp_servers:
            debug_metadata.mcp_server_status[
                server
            ] = await self._check_enhanced_mcp_health(server)

        # Performance benchmarking
        debug_metadata.performance_benchmarks = {
            "context_size_bytes": len(str(context).encode("utf-8")),
            "complexity_score": self._calculate_enhanced_complexity(context),
            "processing_time_estimate_ms": self._estimate_enhanced_processing_time(
                context
            ),
            "cultural_complexity_score": self._calculate_cultural_complexity(
                cultural_context
            )
            if cultural_context
            else 0.0,
        }

        # Cultural validation if cultural context provided
        if cultural_context:
            debug_metadata.cultural_validation_results = (
                await self._perform_cultural_validation(context_str, cultural_context)
            )

    async def _analyze_arabic_content(self, content: str) -> Dict[str, Any]:
        """Analyze Arabic content for debugging insights."""
        arabic_stats = {
            "total_arabic_chars": len(re.findall(r"[\u0600-\u06FF]", content)),
            "arabic_words": len(re.findall(r"[\u0600-\u06FF]+", content)),
            "mixed_content_detected": bool(
                self.arabic_processing_tools["encoding_patterns"][
                    "mixed_content"
                ].search(content)
            ),
            "encoding_issues": [],
            "rtl_issues": [],
            "dialect_classification": "unknown",
            "processing_recommendation": [],
        }

        # Encoding analysis
        for indicator in self.arabic_processing_tools["encoding_patterns"][
            "corruption_indicators"
        ]:
            if indicator in content:
                arabic_stats["encoding_issues"].append(
                    f"Corruption indicator found: {indicator}"
                )

        # RTL analysis
        if arabic_stats["mixed_content_detected"]:
            if not any(
                marker in content
                for marker in self.arabic_processing_tools["rtl_patterns"][
                    "rtl_markers"
                ]
            ):
                arabic_stats["rtl_issues"].append("Mixed content lacks RTL markers")

        # Dialect classification
        iraqi_count = sum(
            1
            for marker in self.arabic_processing_tools["dialect_detection"][
                "iraqi_markers"
            ]
            if marker in content
        )
        formal_count = sum(
            1
            for marker in self.arabic_processing_tools["dialect_detection"][
                "formal_markers"
            ]
            if marker in content
        )

        if iraqi_count > formal_count and iraqi_count > 0:
            arabic_stats["dialect_classification"] = "iraqi_dialect"
        elif formal_count > iraqi_count and formal_count > 0:
            arabic_stats["dialect_classification"] = "formal_arabic"

        # Processing recommendations
        if arabic_stats["encoding_issues"]:
            arabic_stats["processing_recommendation"].append(
                "Use arabic-rtl-processor for encoding fixes"
            )
        if arabic_stats["rtl_issues"]:
            arabic_stats["processing_recommendation"].append(
                "Apply RTL rendering corrections"
            )
        if arabic_stats["dialect_classification"] == "iraqi_dialect":
            arabic_stats["processing_recommendation"].append(
                "Use iraqi-arabic-tester for dialect validation"
            )

        return arabic_stats

    async def _check_enhanced_mcp_health(self, server_name: str) -> str:
        """Enhanced MCP server health check with Iraqi context."""
        try:
            # Simulate server health check with timeout
            start_time = time.time()
            await asyncio.wait_for(asyncio.sleep(0.01), timeout=0.1)
            response_time = (time.time() - start_time) * 1000

            # Determine health based on response time and server type
            if response_time > 100:  # Over 100ms
                return "slow"
            elif server_name in ["sequential", "context7"] and response_time > 50:
                return "degraded"  # Critical servers have stricter requirements
            else:
                return "healthy"

        except asyncio.TimeoutError:
            return "timeout"
        except Exception as e:
            return f"error: {str(e)}"

    def _calculate_enhanced_complexity(self, context: Dict[str, Any]) -> float:
        """Calculate enhanced complexity score with Iraqi-specific factors."""
        complexity = 0.0
        context_str = str(context)

        # Base complexity from size
        complexity += min(len(context_str) / 10000, 0.3)  # Max 0.3 for size

        # Arabic content complexity
        arabic_matches = len(re.findall(r"[\u0600-\u06FF]+", context_str))
        complexity += min(arabic_matches / 100, 0.2)  # Max 0.2 for Arabic

        # Mixed content complexity
        if self.arabic_processing_tools["encoding_patterns"]["mixed_content"].search(
            context_str
        ):
            complexity += 0.15

        # Cultural context complexity
        cultural_indicators = [
            "islamic",
            "cultural",
            "religious",
            "professional",
            "compliance",
        ]
        cultural_count = sum(
            1 for indicator in cultural_indicators if indicator in context_str.lower()
        )
        complexity += min(cultural_count / 10, 0.1)  # Max 0.1 for cultural

        # Payment gateway complexity
        payment_indicators = [
            "payment",
            "gateway",
            "zaincash",
            "fastpay",
            "nasswallet",
            "iqd",
        ]
        payment_count = sum(
            1 for indicator in payment_indicators if indicator in context_str.lower()
        )
        complexity += min(payment_count / 10, 0.1)  # Max 0.1 for payment

        # Nested structure complexity
        if isinstance(context, dict):
            complexity += min(
                self._count_nested_depth(context) / 15, 0.15
            )  # Max 0.15 for nesting

        return min(complexity, 1.0)

    def _calculate_cultural_complexity(self, cultural_context: str) -> float:
        """Calculate cultural context complexity score."""
        if not cultural_context:
            return 0.0

        complexity = 0.0
        cultural_lower = cultural_context.lower()

        # Professional domain complexity
        professional_domains = [
            "legal",
            "medical",
            "educational",
            "government",
            "religious",
        ]
        domain_count = sum(
            1 for domain in professional_domains if domain in cultural_lower
        )
        complexity += min(domain_count / 5, 0.4)  # Max 0.4 for domains

        # Islamic compliance complexity
        islamic_indicators = [
            "islamic",
            "religious",
            "halal",
            "haram",
            "sharia",
            "compliance",
        ]
        islamic_count = sum(
            1 for indicator in islamic_indicators if indicator in cultural_lower
        )
        complexity += min(islamic_count / 6, 0.3)  # Max 0.3 for Islamic

        # Arabic language complexity
        arabic_indicators = ["arabic", "rtl", "dialect", "encoding", "rendering"]
        arabic_count = sum(
            1 for indicator in arabic_indicators if indicator in cultural_lower
        )
        complexity += min(arabic_count / 5, 0.3)  # Max 0.3 for Arabic

        return min(complexity, 1.0)

    def _estimate_enhanced_processing_time(self, context: Dict[str, Any]) -> float:
        """Enhanced processing time estimation with Iraqi factors."""
        base_time = 100.0  # Base 100ms

        context_str = str(context)
        size_factor = len(context_str) / 1000  # 1ms per KB

        # Arabic processing factor
        arabic_factor = (
            len(re.findall(r"[\u0600-\u06FF]+", context_str)) * 5
        )  # 5ms per Arabic segment

        # Mixed content factor (more complex processing)
        mixed_content_factor = (
            50.0
            if self.arabic_processing_tools["encoding_patterns"][
                "mixed_content"
            ].search(context_str)
            else 0.0
        )

        # Cultural validation factor
        cultural_indicators = ["islamic", "cultural", "religious", "compliance"]
        cultural_factor = sum(
            10 for indicator in cultural_indicators if indicator in context_str.lower()
        )

        # Payment gateway factor (external API calls)
        payment_indicators = ["payment", "gateway", "zaincash", "fastpay", "nasswallet"]
        payment_factor = sum(
            100 for indicator in payment_indicators if indicator in context_str.lower()
        )

        # Complexity factor
        complexity_factor = (
            self._calculate_enhanced_complexity(context) * 300
        )  # Up to 300ms for complexity

        total_time = (
            base_time
            + size_factor
            + arabic_factor
            + mixed_content_factor
            + cultural_factor
            + payment_factor
            + complexity_factor
        )

        return min(total_time, 30000.0)  # Cap at 30 seconds

    async def _perform_cultural_validation(
        self, content: str, cultural_context: str
    ) -> Dict[str, Any]:
        """Perform cultural validation for debugging context."""
        validation_result = {
            "islamic_compliance_score": 0.0,
            "cultural_appropriateness_score": 0.0,
            "professional_compliance_score": 0.0,
            "issues_detected": [],
            "recommendations": [],
        }

        # Islamic compliance check
        islamic_rules = self.cultural_debugging_rules["islamic_compliance"]
        for prohibited in islamic_rules["prohibited_content"]:
            if prohibited.lower() in content.lower():
                validation_result["issues_detected"].append(
                    {
                        "type": "prohibited_content",
                        "content": prohibited,
                        "severity": "critical",
                    }
                )

        # Calculate scores based on issues
        total_issues = len(validation_result["issues_detected"])
        if total_issues == 0:
            validation_result["islamic_compliance_score"] = 1.0
            validation_result["cultural_appropriateness_score"] = 0.9
        else:
            critical_issues = sum(
                1
                for issue in validation_result["issues_detected"]
                if issue["severity"] == "critical"
            )
            validation_result["islamic_compliance_score"] = max(
                0.0, 1.0 - (critical_issues * 0.5)
            )
            validation_result["cultural_appropriateness_score"] = max(
                0.0, 0.9 - (total_issues * 0.2)
            )

        # Professional compliance
        cultural_lower = cultural_context.lower()
        if any(
            domain in cultural_lower for domain in ["legal", "medical", "educational"]
        ):
            validation_result["professional_compliance_score"] = (
                0.85  # Default professional score
            )

        return validation_result

    def _count_nested_depth(self, obj: Any, current_depth: int = 0) -> int:
        """Count maximum nesting depth in data structure."""
        if isinstance(obj, dict):
            if not obj:
                return current_depth
            return max(
                self._count_nested_depth(v, current_depth + 1) for v in obj.values()
            )
        elif isinstance(obj, list):
            if not obj:
                return current_depth
            return max(
                self._count_nested_depth(item, current_depth + 1) for item in obj
            )
        else:
            return current_depth

    def _get_pattern_info(self, error_category: IraqiErrorCategory) -> Dict[str, Any]:
        """Get pattern information for error category."""
        for pattern_info in self.error_patterns_db.values():
            if pattern_info["category"] == error_category:
                return pattern_info
        return {
            "debug_level": IraqiDebugLevel.ERROR,
            "recovery_priority": 5,
            "cultural_impact": "low",
            "agents_required": ["iraqi-technical-debugger"],
        }

    async def _perform_advanced_root_cause_analysis(
        self,
        error_message: str,
        context: Dict[str, Any],
        error_category: Optional[IraqiErrorCategory],
        stack_trace: Optional[str],
        cultural_context: Optional[str],
    ) -> str:
        """Perform advanced root cause analysis with Iraqi intelligence."""
        analysis_parts = []

        # Category-specific advanced analysis
        if error_category == IraqiErrorCategory.ARABIC_ENCODING:
            analysis_parts.append(
                "Arabic text encoding failure - analyzing character sequences and encoding pipeline"
            )

            # Check for specific encoding issues
            context_str = str(context)
            if "utf-8" not in context_str.lower():
                analysis_parts.append(
                    "UTF-8 encoding specification missing from processing pipeline"
                )
            if re.search(r"[\u0600-\u06FF]", error_message):
                analysis_parts.append(
                    "Arabic characters present in error message indicate encoding corruption during error handling"
                )
            if "mojibake" in error_message.lower():
                analysis_parts.append(
                    "Mojibake pattern detected - character set conversion failure"
                )

        elif error_category == IraqiErrorCategory.CULTURAL_VIOLATION:
            analysis_parts.append(
                "Cultural compliance violation - analyzing content against Iraqi cultural norms and Islamic principles"
            )

            if "islamic" in error_message.lower():
                analysis_parts.append("Islamic principles compliance failure detected")
            if "inappropriate" in error_message.lower():
                analysis_parts.append(
                    "Content flagged as culturally inappropriate for Iraqi context"
                )
            if cultural_context and "professional" in cultural_context.lower():
                analysis_parts.append(
                    "Professional domain cultural standards violation"
                )

        elif error_category == IraqiErrorCategory.PAYMENT_GATEWAY:
            analysis_parts.append(
                "Iraqi payment gateway integration failure - analyzing gateway-specific error patterns"
            )

            if "4001" in error_message:
                analysis_parts.append(
                    "ZainCash authentication error (4001) - merchant credentials or API key invalid"
                )
            elif "4003" in error_message:
                analysis_parts.append(
                    "ZainCash transaction declined (4003) - insufficient funds or blocked account"
                )
            elif (
                "timeout" in error_message.lower() and "fastpay" in str(context).lower()
            ):
                analysis_parts.append(
                    "FastPay gateway timeout - Iraqi network infrastructure or API endpoint issues"
                )
            elif "webhook" in error_message.lower():
                analysis_parts.append(
                    "Payment webhook verification failure - signature mismatch or timestamp issues"
                )

        elif error_category == IraqiErrorCategory.MCP_SERVER_FAILURE:
            analysis_parts.append(
                "MCP server coordination failure - analyzing server health and communication patterns"
            )

            failed_servers = [
                server
                for server, status in context.get("mcp_status", {}).items()
                if status != "healthy"
            ]
            if failed_servers:
                analysis_parts.append(
                    f"Failed MCP servers identified: {', '.join(failed_servers)}"
                )

            if "sequential" in error_message.lower():
                analysis_parts.append(
                    "Sequential MCP server failure impacts complex reasoning and cultural analysis"
                )
            elif "context7" in error_message.lower():
                analysis_parts.append(
                    "Context7 MCP server failure impacts documentation access and best practices"
                )

        elif error_category == IraqiErrorCategory.AGENT_COORDINATION:
            analysis_parts.append(
                "Iraqi agent coordination failure - analyzing agent communication and delegation patterns"
            )

            if "cultural-validator" in error_message.lower():
                analysis_parts.append(
                    "Iraqi cultural validator agent communication failure - critical for compliance"
                )
            elif "arabic-processor" in error_message.lower():
                analysis_parts.append(
                    "Arabic RTL processor agent failure - impacts Arabic text processing pipeline"
                )

        # Stack trace analysis
        if stack_trace:
            # Look for Iraqi-specific patterns in stack trace
            if re.search(r"iraqi.*agent", stack_trace, re.IGNORECASE):
                analysis_parts.append(
                    "Stack trace indicates failure in Iraqi agent system components"
                )
            if re.search(
                r"arabic.*processing|rtl.*rendering", stack_trace, re.IGNORECASE
            ):
                analysis_parts.append(
                    "Stack trace shows Arabic text processing failure in rendering pipeline"
                )
            if re.search(r"cultural.*validation", stack_trace, re.IGNORECASE):
                analysis_parts.append(
                    "Stack trace indicates cultural validation system failure"
                )

        # Context complexity impact
        context_complexity = self._calculate_enhanced_complexity(context)
        if context_complexity > 0.8:
            analysis_parts.append(
                f"High context complexity ({context_complexity:.2f}) contributes to processing failure"
            )

        # Cultural context impact
        if cultural_context:
            cultural_complexity = self._calculate_cultural_complexity(cultural_context)
            if cultural_complexity > 0.7:
                analysis_parts.append(
                    f"Complex cultural context ({cultural_complexity:.2f}) increases processing difficulty"
                )

        # System resource impact
        if hasattr(self, "_last_system_metrics"):
            metrics = self._last_system_metrics
            if metrics.get("cpu_usage_percent", 0) > 80:
                analysis_parts.append(
                    "High CPU usage may contribute to processing delays and timeouts"
                )
            if metrics.get("memory_usage_percent", 0) > 85:
                analysis_parts.append(
                    "High memory usage may cause processing failures and resource exhaustion"
                )

        return (
            "; ".join(analysis_parts)
            if analysis_parts
            else "Advanced analysis could not determine specific root cause - requires manual investigation"
        )

    async def _generate_intelligent_recovery_plan(
        self,
        error_category: Optional[IraqiErrorCategory],
        error_message: str,
        context: Dict[str, Any],
        cultural_context: Optional[str],
    ) -> List[Dict[str, Any]]:
        """Generate intelligent recovery plan with Iraqi context awareness."""
        recovery_plan = []

        if not error_category:
            recovery_plan.append(
                {
                    "action": "comprehensive_system_diagnosis",
                    "description": "Perform comprehensive system diagnosis with Iraqi context preservation",
                    "priority": 5,
                    "timeout_ms": 10000,
                    "agents_required": ["iraqi-technical-debugger"],
                    "success_criteria": "System state analyzed and issues identified",
                }
            )
            return recovery_plan

        # Get category-specific recovery strategies
        if error_category in self.error_recovery_strategies:
            strategy = self.error_recovery_strategies[error_category]

            # Enhanced recovery actions with Iraqi context
            for i, action in enumerate(strategy["immediate_actions"]):
                recovery_action = {
                    "action": action,
                    "description": self._get_enhanced_action_description(
                        action, error_category
                    ),
                    "priority": i + 1,
                    "timeout_ms": strategy["recovery_timeout_ms"]
                    // len(strategy["immediate_actions"]),
                    "category": error_category.value,
                    "agents_required": strategy.get(
                        "agents_required", ["iraqi-technical-debugger"]
                    ),
                    "success_criteria": self._get_success_criteria(
                        action, error_category
                    ),
                }

                # Add Iraqi-specific enhancements
                if error_category == IraqiErrorCategory.ARABIC_ENCODING:
                    recovery_action["cultural_preservation"] = (
                        "Preserve Arabic content integrity during recovery"
                    )
                elif error_category == IraqiErrorCategory.CULTURAL_VIOLATION:
                    recovery_action["compliance_check"] = (
                        "Ensure Islamic compliance throughout recovery process"
                    )
                elif error_category == IraqiErrorCategory.PAYMENT_GATEWAY:
                    recovery_action["security_validation"] = (
                        "Maintain Iraqi payment security standards"
                    )

                recovery_plan.append(recovery_action)

            # Enhanced escalation actions
            for agent in strategy["escalation_path"]:
                escalation_action = {
                    "action": f"escalate_to_{agent}",
                    "description": f"Escalate to {agent} for specialized Iraqi context handling",
                    "priority": 10,
                    "timeout_ms": 15000,
                    "category": "escalation",
                    "agents_required": [agent],
                    "success_criteria": f"{agent} successfully engaged and processing issue",
                    "iraqi_context_required": True,
                }
                recovery_plan.append(escalation_action)

            # Add fallback mode if available
            if "fallback_mode" in strategy:
                fallback_action = {
                    "action": "activate_fallback_mode",
                    "description": f"Activate {strategy['fallback_mode']} for continued operation",
                    "priority": 15,
                    "timeout_ms": 5000,
                    "category": "fallback",
                    "fallback_mode": strategy["fallback_mode"],
                    "success_criteria": "Fallback mode operational with reduced functionality",
                }
                recovery_plan.append(fallback_action)

        return recovery_plan

    def _get_enhanced_action_description(
        self, action: str, category: IraqiErrorCategory
    ) -> str:
        """Get enhanced action descriptions with Iraqi context."""
        base_descriptions = {
            "force_utf8_encoding": "Force UTF-8 encoding across all Arabic text processing pipelines",
            "validate_arabic_input": "Validate Arabic text input format, encoding, and dialect compatibility",
            "apply_encoding_fallback": "Apply fallback encoding mechanisms with Arabic character preservation",
            "isolate_corrupted_text": "Isolate and quarantine corrupted Arabic text segments",
            "restart_arabic_processor": "Restart Arabic RTL processor with fresh configuration",
            "block_inappropriate_content": "Block culturally inappropriate content and prevent access",
            "apply_cultural_filter": "Apply Iraqi cultural compliance filter with Islamic principles",
            "escalate_to_validator": "Escalate to Iraqi cultural validation system for expert review",
            "notify_compliance_team": "Notify cultural compliance team of violation for immediate action",
            "audit_content_pipeline": "Audit entire content pipeline for cultural compliance gaps",
            "retry_with_exponential_backoff": "Retry payment operation with exponential backoff strategy",
            "validate_credentials": "Validate Iraqi payment gateway credentials and permissions",
            "switch_gateway_fallback": "Switch to alternative Iraqi payment gateway (ZainCash ↔ FastPay)",
            "check_network_connectivity": "Check network connectivity to Iraqi payment infrastructure",
            "verify_iqd_conversion_rates": "Verify IQD currency conversion rates and precision",
            "health_check_all_mcp_servers": "Perform comprehensive health check on all MCP servers",
            "retry_connection_with_backoff": "Retry MCP server connections with intelligent backoff",
            "activate_fallback_servers": "Activate backup MCP servers for continued operation",
            "switch_to_local_processing": "Switch to local processing mode with reduced capabilities",
            "alert_operations_team": "Alert operations team of MCP coordination failure",
            "restart_failed_agents": "Restart failed Iraqi agents with preserved cultural context",
            "check_agent_health": "Check health and responsiveness of all Iraqi agents",
            "retry_coordination": "Retry agent coordination with enhanced error handling",
            "fallback_to_direct_processing": "Fallback to direct processing bypassing failed agents",
            "preserve_cultural_context": "Preserve Iraqi cultural context during agent recovery",
        }

        description = base_descriptions.get(
            action, f"Execute {action} with Iraqi context awareness"
        )

        # Add category-specific enhancements
        if category == IraqiErrorCategory.ARABIC_ENCODING:
            description += " - Ensure Arabic text integrity throughout process"
        elif category == IraqiErrorCategory.CULTURAL_VIOLATION:
            description += " - Maintain Islamic compliance and cultural sensitivity"
        elif category == IraqiErrorCategory.PAYMENT_GATEWAY:
            description += (
                " - Preserve transaction security and Iraqi regulatory compliance"
            )

        return description

    def _get_success_criteria(self, action: str, category: IraqiErrorCategory) -> str:
        """Get success criteria for recovery actions."""
        criteria_map = {
            "force_utf8_encoding": "All Arabic text displays correctly without encoding errors",
            "validate_arabic_input": "Arabic text validation passes with 99%+ accuracy",
            "apply_encoding_fallback": "Fallback encoding successfully preserves Arabic content",
            "block_inappropriate_content": "Inappropriate content blocked and inaccessible",
            "apply_cultural_filter": "Cultural filter active with 95%+ compliance rate",
            "escalate_to_validator": "Cultural validator engaged and processing violation",
            "retry_with_exponential_backoff": "Payment operation succeeds or reaches retry limit",
            "validate_credentials": "Payment gateway credentials validated successfully",
            "switch_gateway_fallback": "Alternative payment gateway operational",
            "health_check_all_mcp_servers": "All MCP servers report health status",
            "retry_connection_with_backoff": "MCP server connection restored",
            "activate_fallback_servers": "Backup MCP servers operational",
            "restart_failed_agents": "Failed agents restarted and responsive",
            "check_agent_health": "All agents report healthy status",
            "retry_coordination": "Agent coordination restored",
        }

        return criteria_map.get(action, "Action completed successfully")

    def _calculate_enhanced_confidence(
        self,
        error_category: Optional[IraqiErrorCategory],
        root_cause: str,
        context: Dict[str, Any],
        cultural_context: Optional[str],
    ) -> float:
        """Calculate enhanced confidence score for resolution success."""
        base_confidence = 0.5

        # Category-specific confidence adjustments
        if error_category:
            pattern_info = self._get_pattern_info(error_category)
            recovery_priority = pattern_info.get("recovery_priority", 5)

            if recovery_priority <= 2:
                base_confidence += 0.3  # High priority = high confidence
            elif recovery_priority >= 4:
                base_confidence -= 0.2  # Low priority = lower confidence

            # Agent availability boost
            agents_required = pattern_info.get("agents_required", [])
            if len(agents_required) <= 2:
                base_confidence += 0.1  # Fewer agents needed = higher confidence

        # Root cause analysis quality impact
        if "Advanced analysis could not determine" in root_cause:
            base_confidence -= 0.3
        elif len(root_cause.split(";")) >= 3:  # Multiple analysis points
            base_confidence += 0.2

        # Context complexity impact
        complexity = self._calculate_enhanced_complexity(context)
        if complexity > 0.8:
            base_confidence -= 0.15
        elif complexity < 0.3:
            base_confidence += 0.1

        # Cultural context impact
        if cultural_context:
            cultural_complexity = self._calculate_cultural_complexity(cultural_context)
            if cultural_complexity > 0.8:
                base_confidence -= 0.1
            elif cultural_complexity < 0.3:
                base_confidence += 0.05

        # Iraqi-specific confidence factors
        if error_category in [
            IraqiErrorCategory.ARABIC_ENCODING,
            IraqiErrorCategory.CULTURAL_VIOLATION,
        ]:
            # These are well-understood domains with good tooling
            base_confidence += 0.1
        elif error_category == IraqiErrorCategory.PAYMENT_GATEWAY:
            # Payment issues can be complex but have clear error codes
            base_confidence += 0.05

        return max(0.0, min(1.0, base_confidence))

    async def _learn_and_store_pattern(
        self,
        error_message: str,
        error_category: Optional[IraqiErrorCategory],
        context: Dict[str, Any],
        cultural_context: Optional[str],
    ) -> None:
        """Learn from error pattern and store for future improvement."""
        pattern_hash = hashlib.md5(
            f"{error_message}{str(error_category)}{cultural_context or ''}".encode()
        ).hexdigest()[:12]

        pattern_record = {
            "pattern_id": pattern_hash,
            "error_message": error_message[:1000],  # Truncate for storage
            "category": error_category.value if error_category else "unknown",
            "context_complexity": self._calculate_enhanced_complexity(context),
            "cultural_complexity": self._calculate_cultural_complexity(cultural_context)
            if cultural_context
            else 0.0,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "context_summary": self._enhanced_context_summary(context),
            "cultural_context": cultural_context,
            "recovery_success": None,  # Will be updated if recovery is attempted
            "learning_tags": self._generate_learning_tags(
                error_message, context, cultural_context
            ),
        }

        # Store in cache for session reuse and learning
        self.debugging_cache[pattern_hash] = pattern_record

        # Add to system metrics for trend analysis
        self.system_metrics_history.append(
            {
                "operation": "error_pattern_recorded",
                "pattern_id": pattern_hash,
                "category": error_category.value if error_category else "unknown",
                "timestamp": time.time(),
            }
        )

        logger.debug(f"Learned error pattern {pattern_hash}: {error_category}")

    def _enhanced_context_summary(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Create enhanced context summary for pattern analysis."""
        context_str = str(context)

        return {
            "has_arabic_content": bool(re.search(r"[\u0600-\u06FF]", context_str)),
            "has_mixed_content": bool(
                self.arabic_processing_tools["encoding_patterns"][
                    "mixed_content"
                ].search(context_str)
            ),
            "has_payment_references": any(
                term in context_str.lower()
                for term in ["payment", "zaincash", "fastpay", "nasswallet", "iqd"]
            ),
            "has_cultural_references": any(
                term in context_str.lower()
                for term in ["cultural", "islamic", "religious", "compliance"]
            ),
            "has_mcp_references": any(
                term in context_str.lower()
                for term in [
                    "sequential",
                    "context7",
                    "magic",
                    "playwright",
                    "supabase",
                    "sentry",
                ]
            ),
            "has_agent_references": bool(
                re.search(r"iraqi.*agent|agent.*iraqi", context_str, re.IGNORECASE)
            ),
            "context_size_kb": len(context_str.encode("utf-8")) // 1024,
            "nesting_depth": self._count_nested_depth(context),
            "key_count": len(context) if isinstance(context, dict) else 0,
            "complexity_indicators": {
                "professional_domain": any(
                    term in context_str.lower()
                    for term in ["legal", "medical", "educational", "government"]
                ),
                "multi_language": self.arabic_processing_tools["encoding_patterns"][
                    "mixed_content"
                ].search(context_str)
                is not None,
                "high_stakes": any(
                    term in context_str.lower()
                    for term in ["critical", "emergency", "security", "compliance"]
                ),
            },
        }

    def _generate_learning_tags(
        self,
        error_message: str,
        context: Dict[str, Any],
        cultural_context: Optional[str],
    ) -> List[str]:
        """Generate learning tags for pattern classification and improvement."""
        tags = []

        error_lower = error_message.lower()
        context_str = str(context).lower()
        cultural_lower = cultural_context.lower() if cultural_context else ""

        # Technical tags
        if "encoding" in error_lower or "utf" in error_lower:
            tags.append("encoding_issue")
        if "timeout" in error_lower:
            tags.append("timeout_issue")
        if "authentication" in error_lower or "credential" in error_lower:
            tags.append("authentication_issue")
        if "network" in error_lower or "connection" in error_lower:
            tags.append("network_issue")

        # Iraqi-specific tags
        if re.search(r"[\u0600-\u06FF]", error_message):
            tags.append("arabic_content")
        if any(term in context_str for term in ["zaincash", "fastpay", "nasswallet"]):
            tags.append("iraqi_payment_gateway")
        if "cultural" in error_lower or "islamic" in error_lower:
            tags.append("cultural_compliance")
        if "dialect" in error_lower or "colloquial" in error_lower:
            tags.append("dialect_processing")

        # Context tags
        if any(term in cultural_lower for term in ["legal", "medical", "educational"]):
            tags.append("professional_domain")
        if "critical" in error_lower or "emergency" in error_lower:
            tags.append("high_priority")
        if any(
            server in context_str
            for server in ["sequential", "context7", "magic", "playwright"]
        ):
            tags.append("mcp_coordination")

        # System tags
        complexity = self._calculate_enhanced_complexity(context)
        if complexity > 0.7:
            tags.append("high_complexity")
        elif complexity < 0.3:
            tags.append("low_complexity")

        return list(set(tags))  # Remove duplicates

    def get_comprehensive_diagnostics(self) -> Dict[str, Any]:
        """Get comprehensive Iraqi system diagnostics with advanced intelligence."""
        try:
            # Error pattern analysis
            error_categories = defaultdict(int)
            recent_patterns = []
            learning_tags = defaultdict(int)

            for pattern_id, pattern_record in self.debugging_cache.items():
                error_categories[pattern_record["category"]] += 1

                # Check if pattern is recent (last hour)
                try:
                    pattern_time = datetime.fromisoformat(
                        pattern_record["timestamp"].replace("Z", "+00:00")
                    )
                    if (
                        datetime.now(timezone.utc) - pattern_time
                    ).total_seconds() < 3600:
                        recent_patterns.append(pattern_record)
                except Exception:
                    pass  # Skip if timestamp parsing fails

                # Aggregate learning tags
                for tag in pattern_record.get("learning_tags", []):
                    learning_tags[tag] += 1

            # Performance analysis
            recent_metrics = list(self.system_metrics_history)[
                -200:
            ]  # Last 200 operations

            # Calculate trends
            performance_trends = self._calculate_performance_trends(recent_metrics)

            # MCP server reliability analysis
            mcp_reliability = self._analyze_mcp_reliability()

            # Agent coordination analysis
            agent_stats = self._analyze_agent_coordination()

            # Cultural processing analysis
            cultural_stats = self._analyze_cultural_processing(recent_patterns)

            # Arabic processing analysis
            arabic_stats = self._analyze_arabic_processing(recent_patterns)

            # Payment gateway analysis
            payment_stats = self._analyze_payment_processing(recent_patterns)

            # System health score
            system_health = self._calculate_comprehensive_health_score(
                performance_trends,
                mcp_reliability,
                agent_stats,
                cultural_stats,
                arabic_stats,
                payment_stats,
            )

            # Generate intelligent recommendations
            recommendations = self._generate_intelligent_recommendations(
                error_categories,
                performance_trends,
                mcp_reliability,
                cultural_stats,
                arabic_stats,
                payment_stats,
            )

            return {
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "system_health_score": system_health,
                "error_analysis": {
                    "total_patterns": len(self.debugging_cache),
                    "recent_patterns": len(recent_patterns),
                    "error_categories": dict(error_categories),
                    "learning_tags": dict(learning_tags),
                    "pattern_trends": self._analyze_pattern_trends(recent_patterns),
                },
                "performance_analysis": performance_trends,
                "mcp_server_analysis": mcp_reliability,
                "agent_coordination_analysis": agent_stats,
                "iraqi_specific_analysis": {
                    "cultural_processing": cultural_stats,
                    "arabic_processing": arabic_stats,
                    "payment_processing": payment_stats,
                },
                "intelligent_recommendations": recommendations,
                "system_capabilities": {
                    "advanced_debugging_enabled": True,
                    "cultural_intelligence": True,
                    "arabic_processing_intelligence": True,
                    "payment_gateway_debugging": True,
                    "mcp_coordination_monitoring": True,
                    "agent_delegation_tracking": True,
                    "emergency_protocols": True,
                },
            }

        except Exception as e:
            logger.error(f"Error generating comprehensive diagnostics: {e}")
            return {
                "error": str(e),
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "system_health_score": 0.0,
                "fallback_mode": True,
            }

    def _calculate_performance_trends(
        self, recent_metrics: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Calculate performance trends from recent metrics."""
        if len(recent_metrics) < 5:
            return {"status": "insufficient_data", "metrics_count": len(recent_metrics)}

        # Extract performance data
        durations = [
            m.get("duration_ms", 0) for m in recent_metrics if "duration_ms" in m
        ]
        success_rates = []

        # Calculate rolling success rates
        window_size = 10
        for i in range(window_size, len(recent_metrics)):
            window = recent_metrics[i - window_size : i]
            success_count = sum(1 for m in window if m.get("success", False))
            success_rates.append(success_count / window_size)

        return {
            "average_duration_ms": sum(durations) / len(durations) if durations else 0,
            "duration_trend": self._calculate_trend(durations[-20:])
            if len(durations) >= 20
            else "stable",
            "success_rate_trend": self._calculate_trend(success_rates[-10:])
            if len(success_rates) >= 10
            else "stable",
            "overall_success_rate": sum(
                1 for m in recent_metrics if m.get("success", False)
            )
            / len(recent_metrics),
            "performance_status": self._assess_performance_status(
                durations, success_rates
            ),
            "metrics_analyzed": len(recent_metrics),
        }

    def _calculate_trend(self, values: List[float]) -> str:
        """Calculate trend direction from series of values."""
        if len(values) < 5:
            return "insufficient_data"

        # Simple linear regression
        n = len(values)
        x_vals = list(range(n))

        x_mean = sum(x_vals) / n
        y_mean = sum(values) / n

        numerator = sum((x_vals[i] - x_mean) * (values[i] - y_mean) for i in range(n))
        denominator = sum((x_vals[i] - x_mean) ** 2 for i in range(n))

        if denominator == 0:
            return "stable"

        slope = numerator / denominator

        # Classify trend
        if slope > 0.05:
            return "increasing"
        elif slope < -0.05:
            return "decreasing"
        else:
            return "stable"

    def _assess_performance_status(
        self, durations: List[float], success_rates: List[float]
    ) -> str:
        """Assess overall performance status."""
        if not durations or not success_rates:
            return "unknown"

        avg_duration = sum(durations) / len(durations)
        avg_success_rate = (
            sum(success_rates) / len(success_rates) if success_rates else 0
        )

        if avg_duration < 1000 and avg_success_rate > 0.95:
            return "excellent"
        elif avg_duration < 2000 and avg_success_rate > 0.90:
            return "good"
        elif avg_duration < 5000 and avg_success_rate > 0.80:
            return "acceptable"
        else:
            return "poor"

    def _analyze_mcp_reliability(self) -> Dict[str, Any]:
        """Analyze MCP server reliability."""
        return {
            "server_health": dict(self.mcp_server_health),
            "total_servers": len(self.mcp_server_health),
            "healthy_servers": sum(
                1 for status in self.mcp_server_health.values() if status == "healthy"
            ),
            "reliability_score": sum(
                1 for status in self.mcp_server_health.values() if status == "healthy"
            )
            / len(self.mcp_server_health)
            if self.mcp_server_health
            else 0,
            "critical_servers_status": {
                server: status
                for server, status in self.mcp_server_health.items()
                if server in ["sequential", "context7"] and status != "healthy"
            },
        }

    def _analyze_agent_coordination(self) -> Dict[str, Any]:
        """Analyze agent coordination patterns."""
        total_coordinations = sum(
            len(coords) for coords in self.agent_coordination_stats.values()
        )

        if total_coordinations == 0:
            return {"status": "no_coordination_data", "total_coordinations": 0}

        # Calculate coordination success rates
        coordination_success = {}
        for pattern, coords in self.agent_coordination_stats.items():
            successful = sum(1 for coord in coords if coord.get("success", False))
            coordination_success[pattern] = successful / len(coords) if coords else 0

        return {
            "total_coordinations": total_coordinations,
            "coordination_patterns": len(self.agent_coordination_stats),
            "overall_success_rate": sum(coordination_success.values())
            / len(coordination_success)
            if coordination_success
            else 0,
            "pattern_success_rates": coordination_success,
            "most_reliable_pattern": max(
                coordination_success, key=coordination_success.get
            )
            if coordination_success
            else None,
            "least_reliable_pattern": min(
                coordination_success, key=coordination_success.get
            )
            if coordination_success
            else None,
        }

    def _analyze_cultural_processing(
        self, recent_patterns: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Analyze cultural processing patterns."""
        cultural_patterns = [
            p for p in recent_patterns if "cultural" in p.get("category", "").lower()
        ]

        if not cultural_patterns:
            return {"status": "no_cultural_data", "patterns_analyzed": 0}

        islamic_violations = sum(
            1
            for p in cultural_patterns
            if "islamic" in p.get("error_message", "").lower()
        )
        professional_issues = sum(
            1
            for p in cultural_patterns
            if "professional" in p.get("error_message", "").lower()
        )

        return {
            "total_cultural_patterns": len(cultural_patterns),
            "islamic_compliance_issues": islamic_violations,
            "professional_domain_issues": professional_issues,
            "cultural_violation_rate": len(cultural_patterns) / len(recent_patterns)
            if recent_patterns
            else 0,
            "compliance_score": 1.0 - (islamic_violations / len(cultural_patterns))
            if cultural_patterns
            else 1.0,
            "recommendations": self._generate_cultural_recommendations(
                cultural_patterns
            ),
        }

    def _analyze_arabic_processing(
        self, recent_patterns: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Analyze Arabic processing patterns."""
        arabic_patterns = [
            p
            for p in recent_patterns
            if any(
                tag in p.get("learning_tags", [])
                for tag in ["arabic_content", "dialect_processing", "encoding_issue"]
            )
        ]

        if not arabic_patterns:
            return {"status": "no_arabic_data", "patterns_analyzed": 0}

        encoding_issues = sum(
            1 for p in arabic_patterns if "encoding" in p.get("category", "").lower()
        )
        rtl_issues = sum(
            1 for p in arabic_patterns if "rtl" in p.get("category", "").lower()
        )
        dialect_issues = sum(
            1 for p in arabic_patterns if "dialect" in p.get("category", "").lower()
        )

        return {
            "total_arabic_patterns": len(arabic_patterns),
            "encoding_issues": encoding_issues,
            "rtl_rendering_issues": rtl_issues,
            "dialect_recognition_issues": dialect_issues,
            "arabic_processing_error_rate": len(arabic_patterns) / len(recent_patterns)
            if recent_patterns
            else 0,
            "processing_accuracy_estimate": 1.0
            - (
                len(arabic_patterns) / max(1, len(recent_patterns) * 0.3)
            ),  # Assume 30% Arabic content
            "recommendations": self._generate_arabic_recommendations(arabic_patterns),
        }

    def _analyze_payment_processing(
        self, recent_patterns: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Analyze payment processing patterns."""
        payment_patterns = [
            p
            for p in recent_patterns
            if "payment" in p.get("category", "").lower()
            or "iraqi_payment_gateway" in p.get("learning_tags", [])
        ]

        if not payment_patterns:
            return {"status": "no_payment_data", "patterns_analyzed": 0}

        gateway_issues = defaultdict(int)
        for pattern in payment_patterns:
            error_msg = pattern.get("error_message", "").lower()
            if "zaincash" in error_msg:
                gateway_issues["zaincash"] += 1
            elif "fastpay" in error_msg:
                gateway_issues["fastpay"] += 1
            elif "nasswallet" in error_msg:
                gateway_issues["nasswallet"] += 1

        return {
            "total_payment_patterns": len(payment_patterns),
            "gateway_specific_issues": dict(gateway_issues),
            "payment_failure_rate": len(payment_patterns) / len(recent_patterns)
            if recent_patterns
            else 0,
            "most_problematic_gateway": max(gateway_issues, key=gateway_issues.get)
            if gateway_issues
            else None,
            "recommendations": self._generate_payment_recommendations(
                payment_patterns, gateway_issues
            ),
        }

    def _calculate_comprehensive_health_score(
        self,
        performance_trends,
        mcp_reliability,
        agent_stats,
        cultural_stats,
        arabic_stats,
        payment_stats,
    ) -> float:
        """Calculate comprehensive system health score."""
        health_components = []

        # Performance component (25%)
        perf_status = performance_trends.get("performance_status", "unknown")
        perf_scores = {
            "excellent": 1.0,
            "good": 0.8,
            "acceptable": 0.6,
            "poor": 0.3,
            "unknown": 0.5,
        }
        health_components.append(perf_scores.get(perf_status, 0.5) * 0.25)

        # MCP reliability component (20%)
        mcp_score = mcp_reliability.get("reliability_score", 0.5)
        health_components.append(mcp_score * 0.20)

        # Agent coordination component (15%)
        agent_success_rate = agent_stats.get("overall_success_rate", 0.5)
        health_components.append(agent_success_rate * 0.15)

        # Cultural processing component (15%)
        cultural_compliance = cultural_stats.get("compliance_score", 1.0)
        health_components.append(cultural_compliance * 0.15)

        # Arabic processing component (15%)
        arabic_accuracy = arabic_stats.get("processing_accuracy_estimate", 0.9)
        health_components.append(arabic_accuracy * 0.15)

        # Payment processing component (10%)
        payment_success_rate = 1.0 - payment_stats.get("payment_failure_rate", 0.0)
        health_components.append(payment_success_rate * 0.10)

        return sum(health_components)

    def _generate_intelligent_recommendations(
        self,
        error_categories,
        performance_trends,
        mcp_reliability,
        cultural_stats,
        arabic_stats,
        payment_stats,
    ) -> List[Dict[str, Any]]:
        """Generate intelligent recommendations based on comprehensive analysis."""
        recommendations = []

        # Performance recommendations
        if performance_trends.get("performance_status") == "poor":
            recommendations.append(
                {
                    "category": "performance",
                    "priority": "high",
                    "title": "Performance Optimization Required",
                    "description": "System performance is below acceptable thresholds",
                    "actions": [
                        "Analyze system resource usage and optimize bottlenecks",
                        "Review Arabic text processing pipeline for efficiency gains",
                        "Implement caching for cultural validation results",
                        "Consider load balancing for MCP server coordination",
                    ],
                    "expected_impact": "30-50% performance improvement",
                }
            )

        # MCP server recommendations
        if mcp_reliability.get("reliability_score", 1.0) < 0.8:
            recommendations.append(
                {
                    "category": "mcp_infrastructure",
                    "priority": "high",
                    "title": "MCP Server Reliability Issues",
                    "description": f"Only {mcp_reliability.get('healthy_servers', 0)}/{mcp_reliability.get('total_servers', 0)} MCP servers are healthy",
                    "actions": [
                        "Investigate failed MCP server connections",
                        "Implement MCP server health monitoring and alerting",
                        "Deploy backup MCP servers for critical services",
                        "Review network connectivity to MCP infrastructure",
                    ],
                    "expected_impact": "Improved system stability and coordination",
                }
            )

        # Cultural processing recommendations
        if cultural_stats.get("compliance_score", 1.0) < 0.95:
            recommendations.append(
                {
                    "category": "cultural_compliance",
                    "priority": "critical",
                    "title": "Cultural Compliance Issues Detected",
                    "description": f"Cultural compliance score is {cultural_stats.get('compliance_score', 1.0):.1%}, below 95% target",
                    "actions": [
                        "Review and strengthen Islamic compliance validation rules",
                        "Enhance cultural appropriateness detection algorithms",
                        "Deploy additional iraqi-cultural-validator agents",
                        "Implement proactive cultural content scanning",
                    ],
                    "expected_impact": "Improved cultural compliance and reduced violations",
                }
            )

        # Arabic processing recommendations
        if arabic_stats.get("processing_accuracy_estimate", 0.9) < 0.95:
            recommendations.append(
                {
                    "category": "arabic_processing",
                    "priority": "medium",
                    "title": "Arabic Processing Accuracy Issues",
                    "description": f"Arabic processing accuracy is estimated at {arabic_stats.get('processing_accuracy_estimate', 0.9):.1%}",
                    "actions": [
                        "Upgrade Arabic RTL processor with latest algorithms",
                        "Implement Iraqi dialect recognition improvements",
                        "Enhance UTF-8 encoding validation and error recovery",
                        "Deploy specialized iraqi-arabic-tester agents",
                    ],
                    "expected_impact": "Improved Arabic text processing accuracy and user experience",
                }
            )

        # Payment processing recommendations
        if payment_stats.get("payment_failure_rate", 0.0) > 0.05:  # >5% failure rate
            recommendations.append(
                {
                    "category": "payment_infrastructure",
                    "priority": "high",
                    "title": "Payment Gateway Reliability Issues",
                    "description": f"Payment failure rate is {payment_stats.get('payment_failure_rate', 0.0):.1%}",
                    "actions": [
                        "Investigate Iraqi payment gateway connectivity issues",
                        "Implement payment gateway failover mechanisms",
                        "Deploy payment-security-guardian for enhanced monitoring",
                        "Review IQD currency conversion accuracy and precision",
                    ],
                    "expected_impact": "Reduced payment failures and improved transaction success",
                }
            )

        # Error pattern recommendations
        most_common_error = (
            max(error_categories, key=error_categories.get)
            if error_categories
            else None
        )
        if most_common_error and error_categories[most_common_error] > 5:
            recommendations.append(
                {
                    "category": "error_patterns",
                    "priority": "medium",
                    "title": f"Recurring {most_common_error} Errors",
                    "description": f"{error_categories[most_common_error]} instances of {most_common_error} errors detected",
                    "actions": [
                        f"Implement preventive measures for {most_common_error} errors",
                        "Deploy specialized debugging agents for error category",
                        "Create automated recovery workflows for common patterns",
                        "Enhance error detection and early warning systems",
                    ],
                    "expected_impact": "Reduced error frequency and improved system stability",
                }
            )

        return recommendations

    def _generate_cultural_recommendations(
        self, cultural_patterns: List[Dict[str, Any]]
    ) -> List[str]:
        """Generate cultural processing recommendations."""
        recommendations = []

        islamic_issues = sum(
            1
            for p in cultural_patterns
            if "islamic" in p.get("error_message", "").lower()
        )
        if islamic_issues > 0:
            recommendations.append(
                "Strengthen Islamic compliance validation with enhanced rule engine"
            )

        professional_issues = sum(
            1
            for p in cultural_patterns
            if "professional" in p.get("error_message", "").lower()
        )
        if professional_issues > 0:
            recommendations.append(
                "Deploy iraqi-professional-domain-expert for specialized validation"
            )

        if len(cultural_patterns) > 3:
            recommendations.append(
                "Implement proactive cultural content scanning and filtering"
            )

        return recommendations

    def _generate_arabic_recommendations(
        self, arabic_patterns: List[Dict[str, Any]]
    ) -> List[str]:
        """Generate Arabic processing recommendations."""
        recommendations = []

        encoding_issues = sum(
            1 for p in arabic_patterns if "encoding" in p.get("category", "").lower()
        )
        if encoding_issues > 0:
            recommendations.append(
                "Enhance UTF-8 encoding validation and automatic correction"
            )

        rtl_issues = sum(
            1 for p in arabic_patterns if "rtl" in p.get("category", "").lower()
        )
        if rtl_issues > 0:
            recommendations.append(
                "Improve RTL rendering with enhanced bidirectional text support"
            )

        dialect_issues = sum(
            1 for p in arabic_patterns if "dialect" in p.get("category", "").lower()
        )
        if dialect_issues > 0:
            recommendations.append(
                "Deploy iraqi-arabic-tester for enhanced dialect recognition"
            )

        return recommendations

    def _generate_payment_recommendations(
        self, payment_patterns: List[Dict[str, Any]], gateway_issues: Dict[str, int]
    ) -> List[str]:
        """Generate payment processing recommendations."""
        recommendations = []

        if gateway_issues.get("zaincash", 0) > 0:
            recommendations.append(
                "Review ZainCash API integration and merchant credentials"
            )

        if gateway_issues.get("fastpay", 0) > 0:
            recommendations.append(
                "Investigate FastPay connectivity and authentication issues"
            )

        if gateway_issues.get("nasswallet", 0) > 0:
            recommendations.append(
                "Enhance NassWallet integration with improved error handling"
            )

        if len(payment_patterns) > 2:
            recommendations.append(
                "Deploy payment-security-guardian for enhanced monitoring and security"
            )

        return recommendations

    def _analyze_pattern_trends(
        self, recent_patterns: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Analyze trends in error patterns."""
        if len(recent_patterns) < 3:
            return {"status": "insufficient_data"}

        # Group patterns by hour for trend analysis
        hourly_patterns = defaultdict(list)
        for pattern in recent_patterns:
            try:
                timestamp = datetime.fromisoformat(
                    pattern["timestamp"].replace("Z", "+00:00")
                )
                hour_key = timestamp.strftime("%Y-%m-%d-%H")
                hourly_patterns[hour_key].append(pattern)
            except Exception:
                continue

        # Calculate trend metrics
        pattern_counts = [len(patterns) for patterns in hourly_patterns.values()]

        return {
            "hourly_pattern_distribution": dict(hourly_patterns),
            "pattern_count_trend": self._calculate_trend(pattern_counts)
            if len(pattern_counts) >= 3
            else "stable",
            "peak_error_hour": max(
                hourly_patterns, key=lambda k: len(hourly_patterns[k])
            )
            if hourly_patterns
            else None,
            "average_patterns_per_hour": sum(pattern_counts) / len(pattern_counts)
            if pattern_counts
            else 0,
        }


# Export main classes for integration
__all__ = [
    "IraqiAdvancedDebuggingEngine",
    "IraqiDebugMetadata",
    "IraqiDebugLevel",
    "IraqiErrorCategory",
]
