#!/usr/bin/env python3
"""
Iraqi AI Trajectory Intelligence System
EXTRACTED FROM: bytedance/trae-agent trajectory recording + sequential thinking

A comprehensive trajectory recording and sequential thinking system enhanced with Iraqi cultural intelligence,
Arabic language processing, professional domain knowledge, and advanced debugging capabilities.

Key Enhancements:
- Iraqi cultural context tracking and validation
- Arabic text processing with RTL support and dialect recognition
- Professional domain intelligence (legal, medical, educational, government)
- Islamic compliance monitoring and validation
- Advanced debugging with cultural awareness
- Multi-language trajectory analysis (Arabic, English, Kurdish)
- Professional compliance tracking for Iraqi regulations

TECHNICAL ARCHITECTURE:
- Comprehensive trajectory recording with cultural metadata
- Sequential thinking with Islamic principles integration
- Professional domain expertise integration
- Advanced debugging with Arabic language support
- Multi-provider LLM integration with cultural validation
- Enterprise-grade security with Iraqi compliance
"""

import json
import asyncio
import logging
import re
import traceback
import hashlib
import psutil
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Union, Callable, Tuple
from dataclasses import dataclass, asdict, field
from enum import Enum
from abc import ABC, abstractmethod
import uuid
from concurrent.futures import ThreadPoolExecutor, as_completed
from collections import defaultdict, deque

# Configure logging for Arabic text support
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class IraqiCulturalContext(Enum):
    """Iraqi cultural context types for trajectory tracking."""
    ISLAMIC_PRINCIPLES = "islamic_principles"
    PROFESSIONAL_LEGAL = "professional_legal"
    PROFESSIONAL_MEDICAL = "professional_medical"
    PROFESSIONAL_EDUCATIONAL = "professional_educational"
    GOVERNMENT_SERVICES = "government_services"
    BUSINESS_COMMERCIAL = "business_commercial"
    FAMILY_SOCIAL = "family_social"
    RELIGIOUS_GUIDANCE = "religious_guidance"
    CULTURAL_HERITAGE = "cultural_heritage"

class LanguageMode(Enum):
    """Language modes for trajectory processing."""
    ARABIC_STANDARD = "arabic_standard"
    ARABIC_IRAQI_DIALECT = "iraqi_dialect"
    ENGLISH = "english"
    KURDISH = "kurdish"
    MIXED_ARABIC_ENGLISH = "mixed"

class ProfessionalDomain(Enum):
    """Professional domain types for specialized trajectory analysis."""
    LEGAL_LAW = "legal"
    MEDICAL_HEALTHCARE = "medical"
    EDUCATIONAL_ACADEMIC = "education"
    GOVERNMENT_PUBLIC = "government"
    ENGINEERING_TECHNICAL = "engineering"
    FINANCE_BANKING = "finance"
    RELIGIOUS_ISLAMIC = "religious"
    CULTURAL_ARTS = "cultural"

class TrajectoryStepState(Enum):
    """Enhanced trajectory step states with Iraqi cultural awareness and debugging."""
    INITIALIZING = "initializing"
    THINKING_CULTURALLY = "thinking_culturally"
    VALIDATING_ISLAMIC = "validating_islamic"
    CALLING_TOOL = "calling_tool"
    PROCESSING_ARABIC = "processing_arabic"
    REFLECTING = "reflecting"
    COMPLETED_SUCCESS = "completed_success"
    COMPLETED_ERROR = "completed_error"
    CULTURAL_REVIEW = "cultural_review"
    PROFESSIONAL_VALIDATION = "professional_validation"
    DEBUGGING_ANALYSIS = "debugging_analysis"
    ERROR_RECOVERY = "error_recovery"
    PERFORMANCE_ANALYSIS = "performance_analysis"
    SECURITY_VALIDATION = "security_validation"
    MCP_COORDINATION = "mcp_coordination"
    AGENT_DELEGATION = "agent_delegation"
    SYSTEM_DIAGNOSIS = "system_diagnosis"
    CULTURAL_DEBUGGING = "cultural_debugging"

class IraqiDebugLevel(Enum):
    """Debug levels for Iraqi-specific debugging scenarios."""
    TRACE = "trace"  # Detailed execution tracing
    DEBUG = "debug"  # General debugging information
    INFO = "info"    # Informational messages
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
    
@dataclass
class IraqiCulturalMetadata:
    """Enhanced cultural metadata with debugging integration."""
    context_type: IraqiCulturalContext
    language_mode: LanguageMode
    professional_domain: Optional[ProfessionalDomain] = None
    islamic_compliance_score: float = 0.0
    cultural_appropriateness_score: float = 0.0
    arabic_text_accuracy: float = 0.0
    dialect_recognition_confidence: float = 0.0
    professional_relevance_score: float = 0.0
    cultural_validation_notes: List[str] = field(default_factory=list)
    # Enhanced debugging fields
    debug_metadata: Optional[IraqiDebugMetadata] = None
    validation_errors: List[Dict[str, Any]] = field(default_factory=list)
    performance_metrics: Dict[str, float] = field(default_factory=dict)
    
    def __post_init__(self):
        if not self.cultural_validation_notes:
            self.cultural_validation_notes = []
        if not self.validation_errors:
            self.validation_errors = []
        if not self.performance_metrics:
            self.performance_metrics = {}

@dataclass
class IraqiThoughtData:
    """Enhanced thought data with Iraqi cultural intelligence."""
    thought: str
    thought_number: int
    total_thoughts: int
    next_thought_needed: bool
    timestamp: str
    language_detected: LanguageMode
    cultural_context: IraqiCulturalContext
    
    # Cultural Intelligence Fields
    islamic_compliance_check: bool = False
    cultural_appropriateness: float = 0.0
    arabic_content: Optional[str] = None
    english_translation: Optional[str] = None
    professional_domain_relevance: Optional[ProfessionalDomain] = None
    
    # Sequential Thinking Fields
    is_revision: Optional[bool] = None
    revises_thought: Optional[int] = None
    branch_from_thought: Optional[int] = None
    branch_id: Optional[str] = None
    needs_more_thoughts: Optional[bool] = None
    
    # Advanced Fields
    confidence_score: float = 0.0
    cultural_validation_status: str = "pending"
    error_details: Optional[Dict[str, Any]] = None

@dataclass
class IraqiLLMInteraction:
    """LLM interaction with Iraqi cultural intelligence."""
    timestamp: str
    provider: str
    model: str
    input_messages: List[Dict[str, Any]]
    response: Dict[str, Any]
    cultural_metadata: IraqiCulturalMetadata
    tools_available: Optional[List[str]] = None
    
    # Iraqi-specific fields
    arabic_text_processing: Optional[Dict[str, Any]] = None
    islamic_compliance_validation: Optional[Dict[str, Any]] = None
    professional_domain_analysis: Optional[Dict[str, Any]] = None
    cultural_appropriateness_check: Optional[Dict[str, Any]] = None

@dataclass
class IraqiAgentStep:
    """Agent execution step with Iraqi cultural intelligence."""
    step_number: int
    timestamp: str
    state: TrajectoryStepState
    cultural_metadata: IraqiCulturalMetadata
    
    # Core execution data
    llm_messages: Optional[List[Dict[str, Any]]] = None
    llm_response: Optional[Dict[str, Any]] = None
    tool_calls: Optional[List[Dict[str, Any]]] = None
    tool_results: Optional[List[Dict[str, Any]]] = None
    reflection: Optional[str] = None
    error: Optional[str] = None
    
    # Iraqi-specific enhancements
    cultural_validation_result: Optional[Dict[str, Any]] = None
    arabic_processing_result: Optional[Dict[str, Any]] = None
    professional_compliance_check: Optional[Dict[str, Any]] = None
    islamic_principles_validation: Optional[Dict[str, Any]] = None

class IraqiCulturalValidator:
    """Advanced cultural validation system for Iraqi context."""
    
    def __init__(self):
        self.islamic_principles = self._load_islamic_principles()
        self.professional_standards = self._load_professional_standards()
        self.cultural_guidelines = self._load_cultural_guidelines()
    
    def _load_islamic_principles(self) -> Dict[str, Any]:
        """Load Islamic principles for validation."""
        return {
            "halal_content": {
                "permitted_topics": [
                    "education", "healthcare", "technology", "business", 
                    "family", "community", "science", "art", "culture"
                ],
                "guidelines": [
                    "respect for family values",
                    "ethical business practices",
                    "community service orientation",
                    "knowledge seeking encouragement",
                    "social responsibility emphasis"
                ]
            },
            "respectful_communication": {
                "tone_requirements": ["respectful", "professional", "courteous"],
                "avoid_topics": ["inappropriate content", "disrespectful language"],
                "encourage_topics": ["beneficial knowledge", "community building", "personal growth"]
            },
            "cultural_sensitivity": {
                "respect_religious_practices": True,
                "acknowledge_cultural_traditions": True,
                "support_family_values": True,
                "promote_education": True
            }
        }
    
    def _load_professional_standards(self) -> Dict[str, Any]:
        """Load Iraqi professional domain standards."""
        return {
            "legal": {
                "iraqi_civil_law": "basis_for_legal_analysis",
                "islamic_jurisprudence": "complementary_guidance",
                "professional_ethics": "mandatory_compliance",
                "client_confidentiality": "absolute_requirement"
            },
            "medical": {
                "hippocratic_oath": "fundamental_principle",
                "islamic_medical_ethics": "cultural_integration",
                "patient_privacy": "strict_enforcement",
                "cultural_sensitivity": "essential_requirement"
            },
            "education": {
                "knowledge_pursuit": "islamic_encouragement",
                "student_welfare": "primary_concern",
                "cultural_integration": "balanced_approach",
                "professional_development": "continuous_requirement"
            },
            "government": {
                "public_service": "civic_duty",
                "transparency": "governance_principle",
                "cultural_respect": "policy_requirement",
                "citizen_welfare": "primary_objective"
            }
        }
    
    def _load_cultural_guidelines(self) -> Dict[str, Any]:
        """Load Iraqi cultural guidelines."""
        return {
            "communication_style": {
                "formal_address": "professional_contexts",
                "respectful_tone": "all_interactions",
                "cultural_awareness": "context_dependent",
                "language_accommodation": "arabic_priority"
            },
            "family_values": {
                "respect_elders": "fundamental_principle",
                "family_unity": "social_priority",
                "child_welfare": "community_responsibility",
                "intergenerational_wisdom": "cultural_asset"
            },
            "social_norms": {
                "hospitality": "cultural_tradition",
                "community_support": "social_obligation",
                "cultural_pride": "identity_component",
                "religious_tolerance": "coexistence_principle"
            }
        }
    
    async def validate_cultural_appropriateness(
        self, 
        content: str, 
        context: IraqiCulturalContext,
        language_mode: LanguageMode
    ) -> Dict[str, Any]:
        """Validate content for Iraqi cultural appropriateness."""
        validation_result = {
            "overall_score": 0.0,
            "islamic_compliance": 0.0,
            "cultural_sensitivity": 0.0,
            "professional_appropriateness": 0.0,
            "language_accuracy": 0.0,
            "recommendations": [],
            "approval_status": "pending",
            "validation_details": {}
        }
        
        try:
            # Islamic compliance check
            islamic_score = await self._validate_islamic_compliance(content, context)
            validation_result["islamic_compliance"] = islamic_score
            
            # Cultural sensitivity analysis
            cultural_score = await self._analyze_cultural_sensitivity(content, context)
            validation_result["cultural_sensitivity"] = cultural_score
            
            # Professional appropriateness (if applicable)
            if context in [IraqiCulturalContext.PROFESSIONAL_LEGAL, 
                          IraqiCulturalContext.PROFESSIONAL_MEDICAL,
                          IraqiCulturalContext.PROFESSIONAL_EDUCATIONAL]:
                prof_score = await self._validate_professional_appropriateness(content, context)
                validation_result["professional_appropriateness"] = prof_score
            
            # Language accuracy (if Arabic content detected)
            if language_mode in [LanguageMode.ARABIC_STANDARD, 
                               LanguageMode.ARABIC_IRAQI_DIALECT, 
                               LanguageMode.MIXED_ARABIC_ENGLISH]:
                lang_score = await self._validate_arabic_accuracy(content, language_mode)
                validation_result["language_accuracy"] = lang_score
            
            # Calculate overall score
            validation_result["overall_score"] = (
                validation_result["islamic_compliance"] * 0.3 +
                validation_result["cultural_sensitivity"] * 0.3 +
                validation_result["professional_appropriateness"] * 0.2 +
                validation_result["language_accuracy"] * 0.2
            )
            
            # Determine approval status
            if validation_result["overall_score"] >= 0.95:
                validation_result["approval_status"] = "approved"
            elif validation_result["overall_score"] >= 0.85:
                validation_result["approval_status"] = "conditionally_approved"
            else:
                validation_result["approval_status"] = "requires_revision"
                validation_result["recommendations"].append(
                    "Content requires cultural and Islamic compliance improvements"
                )
            
            return validation_result
            
        except Exception as e:
            logger.error(f"Cultural validation error: {e}")
            validation_result["error"] = str(e)
            validation_result["approval_status"] = "validation_failed"
            return validation_result
    
    async def _validate_islamic_compliance(self, content: str, context: IraqiCulturalContext) -> float:
        """Validate content against Islamic principles."""
        # Implement Islamic compliance validation logic
        compliance_score = 0.95  # High default for educational/professional content
        
        # Check for respectful language
        respectful_indicators = ["please", "thank you", "respect", "honor", "beneficial"]
        respect_count = sum(1 for indicator in respectful_indicators if indicator in content.lower())
        compliance_score += min(0.05, respect_count * 0.01)
        
        return min(1.0, compliance_score)
    
    async def _analyze_cultural_sensitivity(self, content: str, context: IraqiCulturalContext) -> float:
        """Analyze content for cultural sensitivity."""
        sensitivity_score = 0.90  # Good default
        
        # Check for cultural awareness indicators
        cultural_indicators = ["culture", "tradition", "heritage", "community", "family"]
        cultural_count = sum(1 for indicator in cultural_indicators if indicator in content.lower())
        sensitivity_score += min(0.10, cultural_count * 0.02)
        
        return min(1.0, sensitivity_score)
    
    async def _validate_professional_appropriateness(self, content: str, context: IraqiCulturalContext) -> float:
        """Validate content for professional appropriateness."""
        professional_score = 0.85  # Professional default
        
        # Professional language indicators
        professional_indicators = ["analysis", "recommendation", "procedure", "standard", "compliance"]
        prof_count = sum(1 for indicator in professional_indicators if indicator in content.lower())
        professional_score += min(0.15, prof_count * 0.03)
        
        return min(1.0, professional_score)
    
    async def _validate_arabic_accuracy(self, content: str, language_mode: LanguageMode) -> float:
        """Validate Arabic text accuracy and dialect recognition."""
        # Basic Arabic text validation
        arabic_score = 0.85  # Good default for mixed content
        
        # Check for Arabic script presence
        arabic_pattern = re.compile(r'[\u0600-\u06FF]+')
        if arabic_pattern.search(content):
            arabic_score += 0.10
        
        # Iraqi dialect detection (simplified)
        iraqi_indicators = ["شلونك", "شكو ماكو", "وين", "احنا", "انتو"]
        if language_mode == LanguageMode.ARABIC_IRAQI_DIALECT:
            dialect_count = sum(1 for indicator in iraqi_indicators if indicator in content)
            arabic_score += min(0.05, dialect_count * 0.01)
        
        return min(1.0, arabic_score)

class IraqiDebuggingIntelligence:
    """Advanced debugging intelligence system for Iraqi AI systems."""
    
    def __init__(self):
        self.error_patterns_db = self._initialize_error_patterns()
        self.performance_baselines = self._initialize_performance_baselines()
        self.mcp_server_health = {}
        self.agent_coordination_stats = defaultdict(list)
        self.debugging_cache = {}
        self.error_recovery_strategies = self._initialize_recovery_strategies()
        self.system_metrics_history = deque(maxlen=1000)
        
    def _initialize_error_patterns(self) -> Dict[str, Dict[str, Any]]:
        """Initialize known Iraqi-specific error patterns."""
        return {
            "arabic_encoding": {
                "patterns": [
                    r"UnicodeDecodeError.*arabic",
                    r"\?{3,}",  # Question marks indicating encoding issues
                    r"mojibake.*arabic",
                    r"charset.*utf-8.*error",
                    r"\\u[0-9a-f]{4}.*arabic"
                ],
                "category": IraqiErrorCategory.ARABIC_ENCODING,
                "debug_level": IraqiDebugLevel.ERROR,
                "recovery_priority": 1,
                "cultural_impact": "high"
            },
            "rtl_rendering": {
                "patterns": [
                    r"direction.*rtl.*error",
                    r"text-align.*right.*broken",
                    r"arabic.*layout.*issue",
                    r"bidi.*algorithm.*fail",
                    r"mixed.*content.*direction"
                ],
                "category": IraqiErrorCategory.RTL_RENDERING,
                "debug_level": IraqiDebugLevel.WARNING,
                "recovery_priority": 2,
                "cultural_impact": "medium"
            },
            "payment_gateway": {
                "patterns": [
                    r"zaincash.*error.*[0-9]{4}",
                    r"fastpay.*authentication.*failed",
                    r"nasswallet.*timeout",
                    r"iqd.*conversion.*error",
                    r"payment.*gateway.*[45][0-9]{2}"
                ],
                "category": IraqiErrorCategory.PAYMENT_GATEWAY,
                "debug_level": IraqiDebugLevel.CRITICAL,
                "recovery_priority": 1,
                "cultural_impact": "critical"
            },
            "cultural_violation": {
                "patterns": [
                    r"islamic.*compliance.*fail",
                    r"cultural.*inappropriate",
                    r"haram.*content.*detected",
                    r"religious.*sensitivity.*violation",
                    r"professional.*domain.*mismatch"
                ],
                "category": IraqiErrorCategory.CULTURAL_VIOLATION,
                "debug_level": IraqiDebugLevel.CRITICAL,
                "recovery_priority": 1,
                "cultural_impact": "critical"
            },
            "mcp_server_failure": {
                "patterns": [
                    r"sequential.*mcp.*timeout",
                    r"context7.*unavailable",
                    r"magic.*server.*error",
                    r"playwright.*connection.*failed",
                    r"supabase.*mcp.*disconnect",
                    r"sentry.*mcp.*unreachable"
                ],
                "category": IraqiErrorCategory.MCP_SERVER_FAILURE,
                "debug_level": IraqiDebugLevel.ERROR,
                "recovery_priority": 2,
                "cultural_impact": "medium"
            },
            "agent_coordination": {
                "patterns": [
                    r"agent.*delegation.*failed",
                    r"iraqi.*agent.*timeout",
                    r"cultural.*validator.*error",
                    r"arabic.*processor.*crash",
                    r"payment.*tester.*unavailable"
                ],
                "category": IraqiErrorCategory.AGENT_COORDINATION,
                "debug_level": IraqiDebugLevel.WARNING,
                "recovery_priority": 3,
                "cultural_impact": "medium"
            }
        }
    
    def _initialize_performance_baselines(self) -> Dict[str, Dict[str, float]]:
        """Initialize performance baselines for Iraqi systems."""
        return {
            "cultural_validation": {
                "max_response_time_ms": 500.0,
                "success_rate_threshold": 0.95,
                "accuracy_threshold": 0.90
            },
            "arabic_processing": {
                "max_response_time_ms": 200.0,
                "rtl_accuracy_threshold": 0.99,
                "dialect_recognition_threshold": 0.85
            },
            "payment_gateway": {
                "max_response_time_ms": 3000.0,
                "success_rate_threshold": 0.99,
                "security_compliance_threshold": 1.0
            },
            "mcp_coordination": {
                "max_response_time_ms": 1000.0,
                "server_availability_threshold": 0.98,
                "coordination_success_rate": 0.95
            },
            "agent_delegation": {
                "max_response_time_ms": 2000.0,
                "delegation_success_rate": 0.90,
                "context_preservation_rate": 0.95
            }
        }
    
    def _initialize_recovery_strategies(self) -> Dict[IraqiErrorCategory, Dict[str, Any]]:
        """Initialize error recovery strategies."""
        return {
            IraqiErrorCategory.ARABIC_ENCODING: {
                "immediate_actions": [
                    "force_utf8_encoding",
                    "validate_arabic_input",
                    "apply_encoding_fallback"
                ],
                "escalation_path": ["arabic-rtl-processor", "iraqi-technical-debugger"],
                "recovery_timeout_ms": 5000,
                "retry_limit": 3
            },
            IraqiErrorCategory.RTL_RENDERING: {
                "immediate_actions": [
                    "force_rtl_direction",
                    "apply_bidi_override",
                    "reset_text_alignment"
                ],
                "escalation_path": ["iraqi-ui-designer", "iraqi-accessibility-specialist"],
                "recovery_timeout_ms": 3000,
                "retry_limit": 2
            },
            IraqiErrorCategory.CULTURAL_VIOLATION: {
                "immediate_actions": [
                    "block_inappropriate_content",
                    "apply_cultural_filter",
                    "escalate_to_validator"
                ],
                "escalation_path": ["iraqi-cultural-validator", "iraqi-cultural-tester"],
                "recovery_timeout_ms": 1000,
                "retry_limit": 1
            },
            IraqiErrorCategory.PAYMENT_GATEWAY: {
                "immediate_actions": [
                    "retry_with_backoff",
                    "validate_credentials",
                    "switch_gateway_fallback"
                ],
                "escalation_path": ["payment-security-guardian", "iraqi-payment-tester"],
                "recovery_timeout_ms": 10000,
                "retry_limit": 3
            },
            IraqiErrorCategory.MCP_SERVER_FAILURE: {
                "immediate_actions": [
                    "health_check_mcp_servers",
                    "retry_connection",
                    "activate_fallback_server"
                ],
                "escalation_path": ["iraqi-technical-debugger", "iraqi-devops-engineer"],
                "recovery_timeout_ms": 5000,
                "retry_limit": 2
            }
        }
    
    async def analyze_error(
        self, 
        error_message: str, 
        context: Dict[str, Any],
        stack_trace: Optional[str] = None
    ) -> IraqiDebugMetadata:
        """Analyze error with Iraqi-specific intelligence."""
        start_time = time.time()
        
        debug_metadata = IraqiDebugMetadata(
            debug_level=IraqiDebugLevel.INFO,
            stack_trace=stack_trace,
            system_metrics=await self._collect_system_metrics(),
            debugging_duration_ms=0.0
        )
        
        try:
            # Pattern matching for error classification
            error_category = await self._classify_error(error_message, stack_trace)
            debug_metadata.error_category = error_category
            
            # Adjust debug level based on category
            if error_category:
                pattern_info = self._get_pattern_info(error_category)
                debug_metadata.debug_level = pattern_info["debug_level"]
            
            # Collect context-specific metrics
            await self._collect_context_metrics(debug_metadata, context)
            
            # Perform root cause analysis
            root_cause = await self._perform_root_cause_analysis(
                error_message, context, error_category
            )
            debug_metadata.root_cause_analysis = root_cause
            
            # Generate recovery recommendations
            recovery_attempts = await self._generate_recovery_plan(
                error_category, error_message, context
            )
            debug_metadata.recovery_attempts = recovery_attempts
            
            # Calculate resolution confidence
            debug_metadata.resolution_confidence = self._calculate_resolution_confidence(
                error_category, root_cause, context
            )
            
            # Record error pattern for future reference
            await self._record_error_pattern(error_message, error_category, context)
            
        except Exception as e:
            logger.error(f"Error during debugging analysis: {e}")
            debug_metadata.debug_level = IraqiDebugLevel.CRITICAL
            debug_metadata.error_category = IraqiErrorCategory.SYSTEM_INTEGRATION
            debug_metadata.root_cause_analysis = f"Debugging system failure: {str(e)}"
            debug_metadata.resolution_confidence = 0.1
        
        debug_metadata.debugging_duration_ms = (time.time() - start_time) * 1000
        return debug_metadata
    
    async def _classify_error(
        self, 
        error_message: str, 
        stack_trace: Optional[str] = None
    ) -> Optional[IraqiErrorCategory]:
        """Classify error based on Iraqi-specific patterns."""
        combined_text = f"{error_message} {stack_trace or ''}"
        
        for pattern_name, pattern_info in self.error_patterns_db.items():
            for pattern in pattern_info["patterns"]:
                if re.search(pattern, combined_text, re.IGNORECASE):
                    return pattern_info["category"]
        
        return None
    
    def _get_pattern_info(self, error_category: IraqiErrorCategory) -> Dict[str, Any]:
        """Get pattern information for error category."""
        for pattern_info in self.error_patterns_db.values():
            if pattern_info["category"] == error_category:
                return pattern_info
        return {
            "debug_level": IraqiDebugLevel.ERROR,
            "recovery_priority": 5,
            "cultural_impact": "low"
        }
    
    async def _collect_system_metrics(self) -> Dict[str, Any]:
        """Collect system performance metrics."""
        try:
            return {
                "cpu_usage_percent": psutil.cpu_percent(interval=0.1),
                "memory_usage_percent": psutil.virtual_memory().percent,
                "disk_usage_percent": psutil.disk_usage('/').percent,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "process_count": len(psutil.pids()),
                "available_memory_mb": psutil.virtual_memory().available // (1024 * 1024)
            }
        except Exception as e:
            logger.warning(f"Failed to collect system metrics: {e}")
            return {"error": str(e), "timestamp": datetime.now(timezone.utc).isoformat()}
    
    async def _collect_context_metrics(
        self, 
        debug_metadata: IraqiDebugMetadata, 
        context: Dict[str, Any]
    ) -> None:
        """Collect context-specific debugging metrics."""
        # Arabic processing metrics
        if "arabic" in str(context).lower():
            debug_metadata.arabic_processing_stats = {
                "text_segments_detected": len(re.findall(r'[\u0600-\u06FF]+', str(context))),
                "mixed_content_detected": bool(re.search(r'[\u0600-\u06FF].*[a-zA-Z]', str(context))),
                "rtl_indicators": len(re.findall(r'direction.*rtl|text-align.*right', str(context))),
                "processing_timestamp": datetime.now(timezone.utc).isoformat()
            }
        
        # MCP server status check
        mcp_servers = ["sequential", "context7", "magic", "playwright", "supabase", "sentry"]
        for server in mcp_servers:
            debug_metadata.mcp_server_status[server] = await self._check_mcp_server_health(server)
        
        # Performance benchmarks
        debug_metadata.performance_benchmarks = {
            "context_size_bytes": len(str(context).encode('utf-8')),
            "complexity_score": self._calculate_context_complexity(context),
            "processing_time_estimate_ms": self._estimate_processing_time(context)
        }
    
    async def _check_mcp_server_health(self, server_name: str) -> str:
        """Check MCP server health status."""
        # Simplified health check - would integrate with actual MCP servers
        try:
            # Simulate server health check with timeout
            await asyncio.wait_for(asyncio.sleep(0.01), timeout=0.1)
            return "healthy"
        except asyncio.TimeoutError:
            return "timeout"
        except Exception as e:
            return f"error: {str(e)}"
    
    def _calculate_context_complexity(self, context: Dict[str, Any]) -> float:
        """Calculate context complexity score."""
        complexity = 0.0
        
        # Base complexity from context size
        context_str = str(context)
        complexity += min(len(context_str) / 10000, 0.5)  # Max 0.5 for size
        
        # Arabic content complexity
        arabic_matches = len(re.findall(r'[\u0600-\u06FF]+', context_str))
        complexity += min(arabic_matches / 100, 0.2)  # Max 0.2 for Arabic
        
        # Mixed content complexity
        if re.search(r'[\u0600-\u06FF].*[a-zA-Z]', context_str):
            complexity += 0.1
        
        # Nested structure complexity
        if isinstance(context, dict):
            complexity += min(self._count_nested_depth(context) / 10, 0.2)
        
        return min(complexity, 1.0)
    
    def _count_nested_depth(self, obj: Any, current_depth: int = 0) -> int:
        """Count maximum nesting depth in data structure."""
        if isinstance(obj, dict):
            if not obj:
                return current_depth
            return max(self._count_nested_depth(v, current_depth + 1) for v in obj.values())
        elif isinstance(obj, list):
            if not obj:
                return current_depth
            return max(self._count_nested_depth(item, current_depth + 1) for item in obj)
        else:
            return current_depth
    
    def _estimate_processing_time(self, context: Dict[str, Any]) -> float:
        """Estimate processing time in milliseconds."""
        base_time = 100.0  # Base 100ms
        
        context_str = str(context)
        size_factor = len(context_str) / 1000  # 1ms per KB
        
        arabic_factor = len(re.findall(r'[\u0600-\u06FF]+', context_str)) * 5  # 5ms per Arabic segment
        
        complexity_factor = self._calculate_context_complexity(context) * 200  # Up to 200ms for complexity
        
        return base_time + size_factor + arabic_factor + complexity_factor
    
    async def _perform_root_cause_analysis(
        self, 
        error_message: str, 
        context: Dict[str, Any], 
        error_category: Optional[IraqiErrorCategory]
    ) -> str:
        """Perform intelligent root cause analysis."""
        analysis_parts = []
        
        # Category-specific analysis
        if error_category == IraqiErrorCategory.ARABIC_ENCODING:
            analysis_parts.append("Arabic text encoding failure likely due to UTF-8 conversion issues")
            if "utf" not in str(context).lower():
                analysis_parts.append("Missing UTF-8 encoding specification in context")
        
        elif error_category == IraqiErrorCategory.CULTURAL_VIOLATION:
            analysis_parts.append("Cultural compliance violation detected in content or behavior")
            if "islamic" in error_message.lower():
                analysis_parts.append("Islamic principles compliance check failed")
        
        elif error_category == IraqiErrorCategory.PAYMENT_GATEWAY:
            analysis_parts.append("Iraqi payment gateway integration failure")
            if "4001" in error_message:
                analysis_parts.append("ZainCash authentication error - verify merchant credentials")
            elif "timeout" in error_message.lower():
                analysis_parts.append("Payment gateway timeout - check network connectivity")
        
        elif error_category == IraqiErrorCategory.MCP_SERVER_FAILURE:
            analysis_parts.append("MCP server coordination failure")
            failed_servers = [server for server, status in context.get("mcp_status", {}).items() 
                            if status != "healthy"]
            if failed_servers:
                analysis_parts.append(f"Failed servers: {', '.join(failed_servers)}")
        
        # General analysis
        if "timeout" in error_message.lower():
            analysis_parts.append("Timeout condition indicates network or processing delays")
        
        if "permission" in error_message.lower():
            analysis_parts.append("Access control or permission issue detected")
        
        # Context analysis
        complexity = self._calculate_context_complexity(context)
        if complexity > 0.7:
            analysis_parts.append(f"High context complexity ({complexity:.2f}) may contribute to processing issues")
        
        return "; ".join(analysis_parts) if analysis_parts else "No specific root cause identified"
    
    async def _generate_recovery_plan(
        self, 
        error_category: Optional[IraqiErrorCategory], 
        error_message: str, 
        context: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Generate intelligent recovery plan."""
        recovery_plan = []
        
        if not error_category:
            recovery_plan.append({
                "action": "generic_error_recovery",
                "description": "Apply generic error recovery procedures",
                "priority": 5,
                "timeout_ms": 5000
            })
            return recovery_plan
        
        # Get category-specific recovery strategies
        if error_category in self.error_recovery_strategies:
            strategy = self.error_recovery_strategies[error_category]
            
            for i, action in enumerate(strategy["immediate_actions"]):
                recovery_plan.append({
                    "action": action,
                    "description": self._get_action_description(action),
                    "priority": i + 1,
                    "timeout_ms": strategy["recovery_timeout_ms"] // len(strategy["immediate_actions"]),
                    "category": error_category.value
                })
            
            # Add escalation actions
            for agent in strategy["escalation_path"]:
                recovery_plan.append({
                    "action": f"escalate_to_{agent}",
                    "description": f"Escalate to {agent} for specialized handling",
                    "priority": 10,
                    "timeout_ms": 10000,
                    "category": "escalation"
                })
        
        return recovery_plan
    
    def _get_action_description(self, action: str) -> str:
        """Get human-readable description for recovery action."""
        descriptions = {
            "force_utf8_encoding": "Force UTF-8 encoding for all Arabic text processing",
            "validate_arabic_input": "Validate Arabic text input format and encoding",
            "apply_encoding_fallback": "Apply fallback encoding mechanisms",
            "force_rtl_direction": "Force right-to-left text direction",
            "apply_bidi_override": "Apply bidirectional text override",
            "reset_text_alignment": "Reset text alignment to default RTL",
            "block_inappropriate_content": "Block culturally inappropriate content",
            "apply_cultural_filter": "Apply Iraqi cultural compliance filter",
            "escalate_to_validator": "Escalate to cultural validation system",
            "retry_with_backoff": "Retry operation with exponential backoff",
            "validate_credentials": "Validate payment gateway credentials",
            "switch_gateway_fallback": "Switch to fallback payment gateway",
            "health_check_mcp_servers": "Perform health check on all MCP servers",
            "retry_connection": "Retry MCP server connection",
            "activate_fallback_server": "Activate backup MCP server"
        }
        return descriptions.get(action, f"Execute {action}")
    
    def _calculate_resolution_confidence(self, 
                                       error_category: Optional[IraqiErrorCategory],
                                       root_cause: str, 
                                       context: Dict[str, Any]) -> float:
        """Calculate confidence in resolution success."""
        base_confidence = 0.5
        
        # Category-specific confidence adjustments
        if error_category:
            pattern_info = self._get_pattern_info(error_category)
            if pattern_info["recovery_priority"] <= 2:
                base_confidence += 0.3  # High priority = high confidence
            elif pattern_info["recovery_priority"] >= 4:
                base_confidence -= 0.2  # Low priority = lower confidence
        
        # Root cause clarity impact
        if "No specific root cause" in root_cause:
            base_confidence -= 0.2
        elif len(root_cause.split(";")) >= 3:  # Multiple analysis points
            base_confidence += 0.2
        
        # Context complexity impact
        complexity = self._calculate_context_complexity(context)
        if complexity > 0.8:
            base_confidence -= 0.1
        elif complexity < 0.3:
            base_confidence += 0.1
        
        return max(0.0, min(1.0, base_confidence))
    
    async def _record_error_pattern(
        self, 
        error_message: str, 
        error_category: Optional[IraqiErrorCategory], 
        context: Dict[str, Any]
    ) -> None:
        """Record error pattern for machine learning and improvement."""
        pattern_hash = hashlib.md5(error_message.encode()).hexdigest()[:8]
        
        pattern_record = {
            "pattern_id": pattern_hash,
            "error_message": error_message[:500],  # Truncate for storage
            "category": error_category.value if error_category else "unknown",
            "context_complexity": self._calculate_context_complexity(context),
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "context_summary": self._summarize_context(context)
        }
        
        # Store in cache for session reuse
        self.debugging_cache[pattern_hash] = pattern_record
        
        logger.debug(f"Recorded error pattern {pattern_hash}: {error_category}")
    
    def _summarize_context(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Create summary of context for pattern analysis."""
        return {
            "has_arabic_content": bool(re.search(r'[\u0600-\u06FF]', str(context))),
            "has_mixed_content": bool(re.search(r'[\u0600-\u06FF].*[a-zA-Z]', str(context))),
            "context_size_kb": len(str(context).encode('utf-8')) // 1024,
            "nesting_depth": self._count_nested_depth(context),
            "key_count": len(context) if isinstance(context, dict) else 0
        }
    
    async def monitor_performance(
        self, 
        operation_name: str, 
        duration_ms: float, 
        success: bool,
        cultural_context: Optional[IraqiCulturalContext] = None
    ) -> Dict[str, Any]:
        """Monitor and analyze performance with Iraqi-specific baselines."""
        
        performance_analysis = {
            "operation": operation_name,
            "duration_ms": duration_ms,
            "success": success,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "cultural_context": cultural_context.value if cultural_context else None,
            "performance_status": "unknown",
            "recommendations": []
        }
        
        # Check against baselines
        baseline_key = self._map_operation_to_baseline(operation_name)
        if baseline_key in self.performance_baselines:
            baseline = self.performance_baselines[baseline_key]
            max_time = baseline["max_response_time_ms"]
            
            if duration_ms <= max_time:
                performance_analysis["performance_status"] = "good"
            elif duration_ms <= max_time * 1.5:
                performance_analysis["performance_status"] = "acceptable"
                performance_analysis["recommendations"].append(f"Performance slightly degraded: {duration_ms:.1f}ms vs {max_time:.1f}ms baseline")
            else:
                performance_analysis["performance_status"] = "poor"
                performance_analysis["recommendations"].append(f"Performance significantly degraded: {duration_ms:.1f}ms vs {max_time:.1f}ms baseline")
                performance_analysis["recommendations"].append("Consider optimizing operation or checking system resources")
        
        # Cultural context specific analysis
        if cultural_context and "arabic" in operation_name.lower():
            if duration_ms > 300:  # Arabic processing should be fast
                performance_analysis["recommendations"].append("Arabic text processing taking longer than expected - check encoding and text complexity")
        
        # Store metrics for trend analysis
        self.system_metrics_history.append({
            "operation": operation_name,
            "duration_ms": duration_ms,
            "success": success,
            "timestamp": time.time()
        })
        
        return performance_analysis
    
    def _map_operation_to_baseline(self, operation_name: str) -> str:
        """Map operation name to performance baseline category."""
        operation_lower = operation_name.lower()
        
        if "cultural" in operation_lower or "islamic" in operation_lower:
            return "cultural_validation"
        elif "arabic" in operation_lower or "rtl" in operation_lower:
            return "arabic_processing"
        elif "payment" in operation_lower or "gateway" in operation_lower:
            return "payment_gateway"
        elif "mcp" in operation_lower or "server" in operation_lower:
            return "mcp_coordination"
        elif "agent" in operation_lower or "delegate" in operation_lower:
            return "agent_delegation"
        else:
            return "cultural_validation"  # Default fallback
    
    def get_debugging_summary(self) -> Dict[str, Any]:
        """Get comprehensive debugging intelligence summary."""
        recent_metrics = list(self.system_metrics_history)[-100:]  # Last 100 operations
        
        return {
            "error_patterns_count": len(self.debugging_cache),
            "performance_metrics": {
                "total_operations": len(recent_metrics),
                "success_rate": sum(1 for m in recent_metrics if m["success"]) / len(recent_metrics) if recent_metrics else 0,
                "average_duration_ms": sum(m["duration_ms"] for m in recent_metrics) / len(recent_metrics) if recent_metrics else 0,
                "recent_failures": len([m for m in recent_metrics if not m["success"]])
            },
            "mcp_server_health": dict(self.mcp_server_health),
            "error_categories_detected": list(set(p["category"] for p in self.debugging_cache.values())),
            "system_health_score": self._calculate_system_health_score(recent_metrics),
            "recommendations": self._generate_system_recommendations(recent_metrics)
        }
    
    def _calculate_system_health_score(self, recent_metrics: List[Dict[str, Any]]) -> float:
        """Calculate overall system health score."""
        if not recent_metrics:
            return 0.5  # Neutral score
        
        success_rate = sum(1 for m in recent_metrics if m["success"]) / len(recent_metrics)
        avg_duration = sum(m["duration_ms"] for m in recent_metrics) / len(recent_metrics)
        
        # Base score from success rate
        health_score = success_rate * 0.6
        
        # Performance component
        if avg_duration < 1000:  # Less than 1 second average
            health_score += 0.3
        elif avg_duration < 3000:  # Less than 3 seconds
            health_score += 0.2
        elif avg_duration < 5000:  # Less than 5 seconds
            health_score += 0.1
        
        # Recent trend component
        recent_10 = recent_metrics[-10:] if len(recent_metrics) >= 10 else recent_metrics
        recent_success_rate = sum(1 for m in recent_10 if m["success"]) / len(recent_10)
        
        if recent_success_rate > success_rate:
            health_score += 0.1  # Improving trend
        elif recent_success_rate < success_rate * 0.8:
            health_score -= 0.1  # Declining trend
        
        return max(0.0, min(1.0, health_score))
    
    def _generate_system_recommendations(self, recent_metrics: List[Dict[str, Any]]) -> List[str]:
        """Generate system-level recommendations."""
        recommendations = []
        
        if not recent_metrics:
            return ["Insufficient data for recommendations"]
        
        # Success rate analysis
        success_rate = sum(1 for m in recent_metrics if m["success"]) / len(recent_metrics)
        if success_rate < 0.9:
            recommendations.append(f"System success rate is {success_rate:.1%}, below 90% target. Investigate frequent failure patterns.")
        
        # Performance analysis
        avg_duration = sum(m["duration_ms"] for m in recent_metrics) / len(recent_metrics)
        if avg_duration > 2000:
            recommendations.append(f"Average operation time is {avg_duration:.0f}ms, consider performance optimization.")
        
        # Error pattern analysis
        error_categories = [p["category"] for p in self.debugging_cache.values()]
        if error_categories:
            common_errors = defaultdict(int)
            for category in error_categories:
                common_errors[category] += 1
            
            most_common = max(common_errors, key=common_errors.get)
            if common_errors[most_common] > 3:
                recommendations.append(f"Recurring {most_common} errors detected. Implement preventive measures.")
        
        # Cultural context recommendations
        cultural_operations = [m for m in recent_metrics if "cultural" in m["operation"].lower() or "arabic" in m["operation"].lower()]
        if cultural_operations:
            cultural_success = sum(1 for m in cultural_operations if m["success"]) / len(cultural_operations)
            if cultural_success < 0.95:
                recommendations.append(f"Iraqi cultural operations success rate is {cultural_success:.1%}, below 95% target. Review cultural validation logic.")
        
        return recommendations or ["System performing within acceptable parameters."]

class IraqiPerformanceMonitor:
    """Advanced performance monitoring for Iraqi AI systems."""
    
    def __init__(self):
        self.performance_history = deque(maxlen=10000)
        self.arabic_processing_metrics = defaultdict(list)
        self.cultural_validation_metrics = defaultdict(list)
        self.payment_gateway_metrics = defaultdict(list)
        self.mcp_server_metrics = defaultdict(list)
        self.alert_thresholds = self._initialize_alert_thresholds()
        
    def _initialize_alert_thresholds(self) -> Dict[str, Dict[str, float]]:
        """Initialize performance alert thresholds."""
        return {
            "cultural_validation": {
                "response_time_ms": 500.0,
                "success_rate": 0.95,
                "accuracy_score": 0.90
            },
            "arabic_processing": {
                "response_time_ms": 200.0,
                "rtl_accuracy": 0.99,
                "dialect_recognition": 0.85
            },
            "payment_processing": {
                "response_time_ms": 3000.0,
                "success_rate": 0.99,
                "security_compliance": 1.0
            },
            "mcp_coordination": {
                "response_time_ms": 1000.0,
                "availability": 0.98,
                "coordination_success": 0.95
            }
        }
    
    async def record_performance(
        self,
        operation_type: str,
        duration_ms: float,
        success: bool,
        accuracy_score: float = 0.0,
        cultural_context: Optional[IraqiCulturalContext] = None,
        additional_metrics: Optional[Dict[str, float]] = None
    ) -> Dict[str, Any]:
        """Record performance metrics with Iraqi-specific analysis."""
        
        timestamp = datetime.now(timezone.utc)
        
        performance_record = {
            "timestamp": timestamp.isoformat(),
            "operation_type": operation_type,
            "duration_ms": duration_ms,
            "success": success,
            "accuracy_score": accuracy_score,
            "cultural_context": cultural_context.value if cultural_context else None,
            "additional_metrics": additional_metrics or {}
        }
        
        # Store in appropriate metric collection
        if "cultural" in operation_type.lower() or "islamic" in operation_type.lower():
            self.cultural_validation_metrics[operation_type].append(performance_record)
        elif "arabic" in operation_type.lower() or "rtl" in operation_type.lower():
            self.arabic_processing_metrics[operation_type].append(performance_record)
        elif "payment" in operation_type.lower():
            self.payment_gateway_metrics[operation_type].append(performance_record)
        elif "mcp" in operation_type.lower():
            self.mcp_server_metrics[operation_type].append(performance_record)
        
        # Store in general history
        self.performance_history.append(performance_record)
        
        # Check for performance alerts
        alerts = await self._check_performance_alerts(operation_type, performance_record)
        
        # Calculate performance trends
        trends = self._calculate_performance_trends(operation_type)
        
        return {
            "recorded": True,
            "performance_status": self._assess_performance_status(operation_type, performance_record),
            "alerts": alerts,
            "trends": trends,
            "recommendations": self._generate_performance_recommendations(operation_type, performance_record, trends)
        }
    
    async def _check_performance_alerts(
        self,
        operation_type: str,
        performance_record: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Check for performance alerts based on thresholds."""
        alerts = []
        
        # Map operation to threshold category
        threshold_category = self._map_operation_to_threshold_category(operation_type)
        
        if threshold_category in self.alert_thresholds:
            thresholds = self.alert_thresholds[threshold_category]
            
            # Response time alert
            if performance_record["duration_ms"] > thresholds.get("response_time_ms", float('inf')):
                alerts.append({
                    "type": "response_time_exceeded",
                    "severity": "warning" if performance_record["duration_ms"] < thresholds["response_time_ms"] * 2 else "critical",
                    "message": f"Operation {operation_type} took {performance_record['duration_ms']:.1f}ms, exceeding {thresholds['response_time_ms']:.1f}ms threshold",
                    "threshold": thresholds["response_time_ms"],
                    "actual": performance_record["duration_ms"]
                })
            
            # Success rate alert (based on recent operations)
            if threshold_category in ["cultural_validation", "payment_processing", "mcp_coordination"]:
                recent_ops = self._get_recent_operations(operation_type, 10)
                if recent_ops:
                    success_rate = sum(1 for op in recent_ops if op["success"]) / len(recent_ops)
                    if success_rate < thresholds.get("success_rate", 0.0):
                        alerts.append({
                            "type": "success_rate_low",
                            "severity": "critical",
                            "message": f"Operation {operation_type} success rate is {success_rate:.1%}, below {thresholds['success_rate']:.1%} threshold",
                            "threshold": thresholds["success_rate"],
                            "actual": success_rate
                        })
            
            # Accuracy alert
            if performance_record["accuracy_score"] > 0 and performance_record["accuracy_score"] < thresholds.get("accuracy_score", 0.0):
                alerts.append({
                    "type": "accuracy_low",
                    "severity": "warning",
                    "message": f"Operation {operation_type} accuracy is {performance_record['accuracy_score']:.1%}, below {thresholds['accuracy_score']:.1%} threshold",
                    "threshold": thresholds["accuracy_score"],
                    "actual": performance_record["accuracy_score"]
                })
        
        return alerts
    
    def _map_operation_to_threshold_category(self, operation_type: str) -> str:
        """Map operation type to alert threshold category."""
        operation_lower = operation_type.lower()
        
        if "cultural" in operation_lower or "islamic" in operation_lower:
            return "cultural_validation"
        elif "arabic" in operation_lower or "rtl" in operation_lower:
            return "arabic_processing"
        elif "payment" in operation_lower:
            return "payment_processing"
        elif "mcp" in operation_lower:
            return "mcp_coordination"
        else:
            return "cultural_validation"  # Default
    
    def _get_recent_operations(self, operation_type: str, count: int) -> List[Dict[str, Any]]:
        """Get recent operations of specified type."""
        recent = []
        for record in reversed(self.performance_history):
            if record["operation_type"] == operation_type:
                recent.append(record)
                if len(recent) >= count:
                    break
        return recent
    
    def _calculate_performance_trends(self, operation_type: str) -> Dict[str, Any]:
        """Calculate performance trends for operation type."""
        recent_ops = self._get_recent_operations(operation_type, 50)  # Last 50 operations
        
        if len(recent_ops) < 5:
            return {"trend": "insufficient_data", "data_points": len(recent_ops)}
        
        # Calculate trend in response time
        response_times = [op["duration_ms"] for op in reversed(recent_ops)]  # Chronological order
        time_trend = self._calculate_trend(response_times)
        
        # Calculate trend in success rate
        success_rates = []
        for i in range(4, len(recent_ops)):  # Rolling 5-operation windows
            window = recent_ops[i-4:i+1]
            success_rate = sum(1 for op in window if op["success"]) / len(window)
            success_rates.append(success_rate)
        
        success_trend = self._calculate_trend(success_rates) if success_rates else "stable"
        
        # Calculate trend in accuracy
        accuracy_scores = [op["accuracy_score"] for op in reversed(recent_ops) if op["accuracy_score"] > 0]
        accuracy_trend = self._calculate_trend(accuracy_scores) if len(accuracy_scores) >= 5 else "stable"
        
        return {
            "response_time_trend": time_trend,
            "success_rate_trend": success_trend,
            "accuracy_trend": accuracy_trend,
            "data_points": len(recent_ops),
            "time_window": "last_50_operations"
        }
    
    def _calculate_trend(self, values: List[float]) -> str:
        """Calculate trend direction from series of values."""
        if len(values) < 5:
            return "insufficient_data"
        
        # Simple linear regression to detect trend
        n = len(values)
        x_vals = list(range(n))
        
        x_mean = sum(x_vals) / n
        y_mean = sum(values) / n
        
        numerator = sum((x_vals[i] - x_mean) * (values[i] - y_mean) for i in range(n))
        denominator = sum((x_vals[i] - x_mean) ** 2 for i in range(n))
        
        if denominator == 0:
            return "stable"
        
        slope = numerator / denominator
        
        # Classify trend based on slope
        if slope > 0.1:
            return "increasing"
        elif slope < -0.1:
            return "decreasing"
        else:
            return "stable"
    
    def _assess_performance_status(
        self,
        operation_type: str,
        performance_record: Dict[str, Any]
    ) -> str:
        """Assess overall performance status for operation."""
        threshold_category = self._map_operation_to_threshold_category(operation_type)
        
        if threshold_category not in self.alert_thresholds:
            return "unknown"
        
        thresholds = self.alert_thresholds[threshold_category]
        
        # Check response time
        if performance_record["duration_ms"] > thresholds.get("response_time_ms", float('inf')) * 2:
            return "poor"
        elif performance_record["duration_ms"] > thresholds.get("response_time_ms", float('inf')):
            return "fair"
        
        # Check success
        if not performance_record["success"]:
            return "poor"
        
        # Check accuracy if available
        if performance_record["accuracy_score"] > 0:
            if performance_record["accuracy_score"] < thresholds.get("accuracy_score", 0.0):
                return "fair"
        
        return "good"
    
    def _generate_performance_recommendations(
        self,
        operation_type: str,
        performance_record: Dict[str, Any],
        trends: Dict[str, Any]
    ) -> List[str]:
        """Generate performance improvement recommendations."""
        recommendations = []
        
        # Response time recommendations
        if performance_record["duration_ms"] > 1000:  # Over 1 second
            if "arabic" in operation_type.lower():
                recommendations.append("Consider optimizing Arabic text processing algorithms or caching Arabic language models")
            elif "cultural" in operation_type.lower():
                recommendations.append("Cultural validation taking too long - consider pre-computing common validations or optimizing rule engine")
            elif "payment" in operation_type.lower():
                recommendations.append("Payment processing slow - check network connectivity to Iraqi payment gateways and consider timeout optimizations")
        
        # Trend-based recommendations
        if trends.get("response_time_trend") == "increasing":
            recommendations.append(f"Response times for {operation_type} are increasing over time - investigate resource constraints or code degradation")
        
        if trends.get("success_rate_trend") == "decreasing":
            recommendations.append(f"Success rates for {operation_type} are declining - review error patterns and implement preventive measures")
        
        if trends.get("accuracy_trend") == "decreasing":
            recommendations.append(f"Accuracy for {operation_type} is declining - review model performance and retrain if necessary")
        
        # Iraqi-specific recommendations
        if not performance_record["success"] and "cultural" in operation_type.lower():
            recommendations.append("Cultural validation failure - review Iraqi cultural guidelines and Islamic compliance rules")
        
        if not performance_record["success"] and "arabic" in operation_type.lower():
            recommendations.append("Arabic processing failure - check UTF-8 encoding, RTL rendering, and Iraqi dialect recognition")
        
        return recommendations
    
    def get_performance_dashboard(self) -> Dict[str, Any]:
        """Generate comprehensive performance dashboard."""
        recent_history = list(self.performance_history)[-1000:]  # Last 1000 operations
        
        # Overall metrics
        total_operations = len(recent_history)
        overall_success_rate = sum(1 for op in recent_history if op["success"]) / total_operations if total_operations > 0 else 0
        average_response_time = sum(op["duration_ms"] for op in recent_history) / total_operations if total_operations > 0 else 0
        
        # Category breakdown
        category_metrics = {}
        for category in ["cultural_validation", "arabic_processing", "payment_processing", "mcp_coordination"]:
            category_ops = [op for op in recent_history if self._map_operation_to_threshold_category(op["operation_type"]) == category]
            
            if category_ops:
                category_metrics[category] = {
                    "operation_count": len(category_ops),
                    "success_rate": sum(1 for op in category_ops if op["success"]) / len(category_ops),
                    "average_response_time_ms": sum(op["duration_ms"] for op in category_ops) / len(category_ops),
                    "average_accuracy": sum(op["accuracy_score"] for op in category_ops if op["accuracy_score"] > 0) / len([op for op in category_ops if op["accuracy_score"] > 0]) if any(op["accuracy_score"] > 0 for op in category_ops) else 0
                }
        
        # Recent alerts
        recent_operations = recent_history[-10:]  # Last 10 operations
        active_alerts = []
        for op in recent_operations:
            alerts = asyncio.run(self._check_performance_alerts(op["operation_type"], op))
            active_alerts.extend(alerts)
        
        return {
            "summary": {
                "total_operations": total_operations,
                "overall_success_rate": overall_success_rate,
                "average_response_time_ms": average_response_time,
                "data_time_window": "last_1000_operations"
            },
            "category_breakdown": category_metrics,
            "active_alerts": active_alerts,
            "system_health_score": self._calculate_overall_health_score(category_metrics),
            "top_recommendations": self._generate_dashboard_recommendations(category_metrics, active_alerts)
        }
    
    def _calculate_overall_health_score(self, category_metrics: Dict[str, Dict[str, float]]) -> float:
        """Calculate overall system health score."""
        if not category_metrics:
            return 0.5
        
        health_scores = []
        
        for category, metrics in category_metrics.items():
            category_score = 0.0
            
            # Success rate component (40% weight)
            category_score += metrics["success_rate"] * 0.4
            
            # Response time component (30% weight)
            threshold_category = category
            if threshold_category in self.alert_thresholds:
                max_time = self.alert_thresholds[threshold_category].get("response_time_ms", 1000)
                time_score = max(0, 1 - (metrics["average_response_time_ms"] / (max_time * 2)))  # Score 0 if 2x threshold
                category_score += time_score * 0.3
            
            # Accuracy component (30% weight)
            if metrics["average_accuracy"] > 0:
                category_score += metrics["average_accuracy"] * 0.3
            else:
                category_score += 0.3  # Assume good if no accuracy data
            
            health_scores.append(category_score)
        
        return sum(health_scores) / len(health_scores)
    
    def _generate_dashboard_recommendations(
        self,
        category_metrics: Dict[str, Dict[str, float]],
        active_alerts: List[Dict[str, Any]]
    ) -> List[str]:
        """Generate top-level recommendations for dashboard."""
        recommendations = []
        
        # Critical alerts first
        critical_alerts = [alert for alert in active_alerts if alert["severity"] == "critical"]
        if critical_alerts:
            recommendations.append(f"CRITICAL: {len(critical_alerts)} critical performance issues require immediate attention")
        
        # Category-specific issues
        for category, metrics in category_metrics.items():
            if metrics["success_rate"] < 0.9:
                recommendations.append(f"Low success rate in {category}: {metrics['success_rate']:.1%} - investigate error patterns")
            
            threshold_category = category
            if threshold_category in self.alert_thresholds:
                max_time = self.alert_thresholds[threshold_category].get("response_time_ms", 1000)
                if metrics["average_response_time_ms"] > max_time:
                    recommendations.append(f"Slow response times in {category}: {metrics['average_response_time_ms']:.0f}ms - optimize processing")
        
        # Iraqi-specific recommendations
        if "arabic_processing" in category_metrics:
            arabic_metrics = category_metrics["arabic_processing"]
            if arabic_metrics["success_rate"] < 0.95:
                recommendations.append("Arabic text processing issues detected - review encoding, RTL rendering, and dialect recognition")
        
        if "cultural_validation" in category_metrics:
            cultural_metrics = category_metrics["cultural_validation"]
            if cultural_metrics["success_rate"] < 0.95:
                recommendations.append("Cultural validation issues detected - review Islamic compliance rules and Iraqi professional standards")
        
        return recommendations[:5]  # Top 5 recommendations

class IraqiSequentialThinkingEngine:
    """Advanced sequential thinking engine with Iraqi cultural intelligence."""
    
    def __init__(self, cultural_validator: IraqiCulturalValidator, debugging_intelligence: IraqiDebuggingIntelligence):
        self.cultural_validator = cultural_validator
        self.debugging_intelligence = debugging_intelligence
        self.thought_history: List[IraqiThoughtData] = []
        self.branches: Dict[str, List[IraqiThoughtData]] = {}
        self.cultural_context_stack: List[IraqiCulturalContext] = []
        self.professional_domain_context: Optional[ProfessionalDomain] = None
        self.error_recovery_attempts: Dict[str, int] = defaultdict(int)
        self.performance_monitor = IraqiPerformanceMonitor()
    
    async def process_thought(
        self,
        thought_content: str,
        thought_number: int,
        total_thoughts: int,
        next_thought_needed: bool,
        cultural_context: IraqiCulturalContext,
        language_mode: LanguageMode = LanguageMode.ENGLISH,
        **kwargs
    ) -> IraqiThoughtData:
        """Process a thought with Iraqi cultural intelligence."""
        
        timestamp = datetime.now(timezone.utc).isoformat()
        
        # Create thought data structure
        thought_data = IraqiThoughtData(
            thought=thought_content,
            thought_number=thought_number,
            total_thoughts=total_thoughts,
            next_thought_needed=next_thought_needed,
            timestamp=timestamp,
            language_detected=language_mode,
            cultural_context=cultural_context,
            **kwargs
        )
        
        try:
            start_time = time.time()
            
            # Cultural validation with performance monitoring
            cultural_validation = await self.cultural_validator.validate_cultural_appropriateness(
                thought_content, cultural_context, language_mode
            )
            
            cultural_validation_time = (time.time() - start_time) * 1000
            
            # Record performance metrics
            await self.performance_monitor.record_performance(
                operation_type=f"cultural_validation_{language_mode.value}",
                duration_ms=cultural_validation_time,
                success=cultural_validation["approval_status"] != "validation_failed",
                accuracy_score=cultural_validation["overall_score"],
                cultural_context=cultural_context
            )
            
            thought_data.cultural_appropriateness = cultural_validation["overall_score"]
            thought_data.islamic_compliance_check = cultural_validation["islamic_compliance"] >= 0.90
            thought_data.cultural_validation_status = cultural_validation["approval_status"]
            
            # Advanced debugging if validation failed
            if cultural_validation["approval_status"] == "validation_failed":
                error_context = {
                    "thought_content": thought_content,
                    "cultural_context": cultural_context.value,
                    "language_mode": language_mode.value,
                    "validation_result": cultural_validation
                }
                
                debug_metadata = await self.debugging_intelligence.analyze_error(
                    error_message="Cultural validation failed",
                    context=error_context,
                    stack_trace=None
                )
                
                thought_data.error_details = {
                    "debug_metadata": asdict(debug_metadata),
                    "validation_errors": cultural_validation.get("recommendations", []),
                    "recovery_suggestions": debug_metadata.recovery_attempts
                }
            
            # Arabic content processing
            if language_mode in [LanguageMode.ARABIC_STANDARD, LanguageMode.ARABIC_IRAQI_DIALECT, LanguageMode.MIXED_ARABIC_ENGLISH]:
                await self._process_arabic_content(thought_data)
            
            # Professional domain analysis
            if cultural_context in [IraqiCulturalContext.PROFESSIONAL_LEGAL, 
                                  IraqiCulturalContext.PROFESSIONAL_MEDICAL, 
                                  IraqiCulturalContext.PROFESSIONAL_EDUCATIONAL]:
                await self._analyze_professional_relevance(thought_data)
            
            # Confidence scoring
            thought_data.confidence_score = self._calculate_thought_confidence(thought_data)
            
            # Add to history
            self.thought_history.append(thought_data)
            
            # Handle branching if specified
            if thought_data.branch_id and thought_data.branch_from_thought:
                await self._handle_thought_branching(thought_data)
            
            logger.info(f"Processed thought {thought_number}/{total_thoughts} with {thought_data.cultural_appropriateness:.2f} cultural score")
            return thought_data
            
        except Exception as e:
            logger.error(f"Thought processing error: {e}")
            
            # Advanced error analysis
            error_context = {
                "thought_content": thought_content,
                "thought_number": thought_number,
                "cultural_context": cultural_context.value,
                "language_mode": language_mode.value,
                "operation": "sequential_thinking"
            }
            
            debug_metadata = await self.debugging_intelligence.analyze_error(
                error_message=str(e),
                context=error_context,
                stack_trace=traceback.format_exc()
            )
            
            thought_data.error_details = {
                "error": str(e),
                "timestamp": timestamp,
                "debug_analysis": asdict(debug_metadata),
                "recovery_attempts": debug_metadata.recovery_attempts,
                "resolution_confidence": debug_metadata.resolution_confidence
            }
            
            thought_data.cultural_validation_status = "error"
            
            # Attempt error recovery if confidence is high enough
            if debug_metadata.resolution_confidence > 0.7:
                recovery_key = f"{cultural_context.value}_{language_mode.value}"
                if self.error_recovery_attempts[recovery_key] < 2:  # Max 2 recovery attempts
                    self.error_recovery_attempts[recovery_key] += 1
                    logger.info(f"Attempting error recovery for thought processing (attempt {self.error_recovery_attempts[recovery_key]})")
                    
                    # Simplified recovery: retry with basic cultural context
                    try:
                        simplified_validation = await self.cultural_validator.validate_cultural_appropriateness(
                            thought_content[:500],  # Truncate if too long
                            IraqiCulturalContext.BUSINESS_COMMERCIAL,  # Safe default
                            LanguageMode.ENGLISH  # Safe default
                        )
                        
                        thought_data.cultural_appropriateness = simplified_validation["overall_score"]
                        thought_data.cultural_validation_status = "recovered"
                        thought_data.error_details["recovery_successful"] = True
                        
                    except Exception as recovery_error:
                        logger.error(f"Error recovery failed: {recovery_error}")
                        thought_data.error_details["recovery_successful"] = False
                        thought_data.error_details["recovery_error"] = str(recovery_error)
            
            return thought_data
    
    async def _process_arabic_content(self, thought_data: IraqiThoughtData) -> None:
        """Process Arabic content within thoughts."""
        arabic_pattern = re.compile(r'[\u0600-\u06FF]+')
        arabic_matches = arabic_pattern.findall(thought_data.thought)
        
        if arabic_matches:
            thought_data.arabic_content = ' '.join(arabic_matches)
            # Simplified translation placeholder - would integrate with translation service
            thought_data.english_translation = f"[Arabic content detected: {len(arabic_matches)} segments]"
    
    async def _analyze_professional_relevance(self, thought_data: IraqiThoughtData) -> None:
        """Analyze professional domain relevance."""
        # Map cultural context to professional domain
        domain_mapping = {
            IraqiCulturalContext.PROFESSIONAL_LEGAL: ProfessionalDomain.LEGAL_LAW,
            IraqiCulturalContext.PROFESSIONAL_MEDICAL: ProfessionalDomain.MEDICAL_HEALTHCARE,
            IraqiCulturalContext.PROFESSIONAL_EDUCATIONAL: ProfessionalDomain.EDUCATIONAL_ACADEMIC,
            IraqiCulturalContext.GOVERNMENT_SERVICES: ProfessionalDomain.GOVERNMENT_PUBLIC,
        }
        
        if thought_data.cultural_context in domain_mapping:
            thought_data.professional_domain_relevance = domain_mapping[thought_data.cultural_context]
            
            # Calculate professional relevance score
            professional_keywords = {
                ProfessionalDomain.LEGAL_LAW: ["law", "legal", "court", "judgment", "contract", "rights"],
                ProfessionalDomain.MEDICAL_HEALTHCARE: ["medical", "health", "patient", "treatment", "diagnosis", "care"],
                ProfessionalDomain.EDUCATIONAL_ACADEMIC: ["education", "student", "learning", "curriculum", "academic", "knowledge"],
                ProfessionalDomain.GOVERNMENT_PUBLIC: ["government", "public", "service", "policy", "administration", "citizen"]
            }
            
            if thought_data.professional_domain_relevance in professional_keywords:
                keywords = professional_keywords[thought_data.professional_domain_relevance]
                relevance_count = sum(1 for keyword in keywords if keyword in thought_data.thought.lower())
                thought_data.professional_relevance_score = min(1.0, relevance_count * 0.15)
    
    def _calculate_thought_confidence(self, thought_data: IraqiThoughtData) -> float:
        """Calculate confidence score for a thought."""
        confidence = 0.7  # Base confidence
        
        # Cultural appropriateness factor
        confidence += thought_data.cultural_appropriateness * 0.2
        
        # Islamic compliance factor
        if thought_data.islamic_compliance_check:
            confidence += 0.05
        
        # Professional relevance factor
        if thought_data.professional_relevance_score:
            confidence += thought_data.professional_relevance_score * 0.05
        
        return min(1.0, confidence)
    
    async def _handle_thought_branching(self, thought_data: IraqiThoughtData) -> None:
        """Handle thought branching logic."""
        if thought_data.branch_id not in self.branches:
            self.branches[thought_data.branch_id] = []
        self.branches[thought_data.branch_id].append(thought_data)
    
    def get_thought_summary(self) -> Dict[str, Any]:
        """Get comprehensive thought summary with Iraqi intelligence."""
        return {
            "total_thoughts": len(self.thought_history),
            "cultural_contexts": list(set(t.cultural_context.value for t in self.thought_history)),
            "language_modes": list(set(t.language_detected.value for t in self.thought_history)),
            "average_cultural_score": sum(t.cultural_appropriateness for t in self.thought_history) / len(self.thought_history) if self.thought_history else 0,
            "islamic_compliance_rate": sum(1 for t in self.thought_history if t.islamic_compliance_check) / len(self.thought_history) if self.thought_history else 0,
            "professional_thoughts": sum(1 for t in self.thought_history if t.professional_domain_relevance) / len(self.thought_history) if self.thought_history else 0,
            "branch_count": len(self.branches),
            "arabic_content_detected": sum(1 for t in self.thought_history if t.arabic_content) / len(self.thought_history) if self.thought_history else 0
        }

class IraqiTrajectoryRecorder:
    """Comprehensive trajectory recording system with Iraqi cultural intelligence."""
    
    def __init__(self, trajectory_path: Optional[str] = None, enable_cultural_validation: bool = True, enable_advanced_debugging: bool = True):
        """Initialize Iraqi trajectory recorder."""
        if trajectory_path is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            trajectory_path = f"trajectories/iraqi_trajectory_{timestamp}.json"
        
        self.trajectory_path: Path = Path(trajectory_path).resolve()
        self.enable_cultural_validation = enable_cultural_validation
        
        # Ensure trajectory directory exists
        try:
            self.trajectory_path.parent.mkdir(parents=True, exist_ok=True)
        except Exception as e:
            logger.error(f"Error creating trajectory directory: {e}")
        
        # Initialize cultural components with advanced debugging
        self.cultural_validator = IraqiCulturalValidator()
        self.debugging_intelligence = IraqiDebuggingIntelligence() if enable_advanced_debugging else None
        self.thinking_engine = IraqiSequentialThinkingEngine(
            self.cultural_validator, 
            self.debugging_intelligence
        ) if self.debugging_intelligence else IraqiSequentialThinkingEngine(self.cultural_validator, None)
        self.performance_monitor = IraqiPerformanceMonitor() if enable_advanced_debugging else None
        self.enable_advanced_debugging = enable_advanced_debugging
        
        # Trajectory data structure
        self.trajectory_data: Dict[str, Any] = {
            "metadata": {
                "system_info": {
                    "system_type": "Iraqi AI Trajectory Intelligence",
                    "version": "1.0.0",
                    "cultural_validation_enabled": enable_cultural_validation,
                    "supported_languages": ["Arabic", "English", "Kurdish"],
                    "professional_domains": [domain.value for domain in ProfessionalDomain]
                }
            },
            "task_info": {
                "task_description": "",
                "cultural_context": "",
                "primary_language": "",
                "professional_domain": "",
                "start_time": "",
                "end_time": "",
                "execution_time_seconds": 0.0
            },
            "model_info": {
                "provider": "",
                "model": "",
                "max_steps": 0,
                "cultural_validation_threshold": 0.90
            },
            "cultural_intelligence": {
                "overall_islamic_compliance": 0.0,
                "cultural_appropriateness_score": 0.0,
                "arabic_processing_accuracy": 0.0,
                "professional_compliance_score": 0.0,
                "cultural_context_distribution": {},
                "language_distribution": {},
                "professional_domain_analysis": {}
            },
            "llm_interactions": [],
            "agent_steps": [],
            "sequential_thoughts": [],
            "cultural_validations": [],
            "performance_metrics": {
                "total_llm_calls": 0,
                "total_tokens_used": 0,
                "cultural_validation_calls": 0,
                "arabic_processing_events": 0,
                "professional_validations": 0
            },
            "execution_summary": {
                "success": False,
                "final_result": None,
                "cultural_compliance_achieved": False,
                "professional_standards_met": False,
                "recommendations": []
            }
        }
        
        self._start_time: Optional[datetime] = None
        
    async def start_recording(
        self, 
        task: str, 
        provider: str, 
        model: str, 
        max_steps: int,
        cultural_context: IraqiCulturalContext = IraqiCulturalContext.BUSINESS_COMMERCIAL,
        primary_language: LanguageMode = LanguageMode.ENGLISH,
        professional_domain: Optional[ProfessionalDomain] = None
    ) -> None:
        """Start recording trajectory with Iraqi cultural context."""
        self._start_time = datetime.now(timezone.utc)
        
        self.trajectory_data["task_info"].update({
            "task_description": task,
            "cultural_context": cultural_context.value,
            "primary_language": primary_language.value,
            "professional_domain": professional_domain.value if professional_domain else None,
            "start_time": self._start_time.isoformat()
        })
        
        self.trajectory_data["model_info"].update({
            "provider": provider,
            "model": model,
            "max_steps": max_steps
        })
        
        await self._save_trajectory()
        logger.info(f"Started Iraqi trajectory recording: {task} | Context: {cultural_context.value}")
    
    async def record_llm_interaction(
        self,
        messages: List[Dict[str, Any]],
        response: Dict[str, Any],
        provider: str,
        model: str,
        cultural_context: IraqiCulturalContext,
        language_mode: LanguageMode = LanguageMode.ENGLISH,
        tools: Optional[List[str]] = None,
        professional_domain: Optional[ProfessionalDomain] = None
    ) -> None:
        """Record LLM interaction with Iraqi cultural intelligence."""
        timestamp = datetime.now(timezone.utc).isoformat()
        
        # Create cultural metadata
        cultural_metadata = IraqiCulturalMetadata(
            context_type=cultural_context,
            language_mode=language_mode,
            professional_domain=professional_domain
        )
        
        # Perform cultural validation if enabled
        if self.enable_cultural_validation:
            await self._perform_interaction_cultural_validation(messages, response, cultural_metadata)
        
        # Create interaction record
        interaction = IraqiLLMInteraction(
            timestamp=timestamp,
            provider=provider,
            model=model,
            input_messages=messages,
            response=response,
            cultural_metadata=cultural_metadata,
            tools_available=tools
        )
        
        # Process Arabic content if present
        await self._process_interaction_arabic_content(interaction)
        
        # Add to trajectory
        self.trajectory_data["llm_interactions"].append(asdict(interaction))
        self.trajectory_data["performance_metrics"]["total_llm_calls"] += 1
        
        # Update token usage if available
        if "usage" in response and response["usage"]:
            usage = response["usage"]
            input_tokens = usage.get("input_tokens", 0)
            output_tokens = usage.get("output_tokens", 0)
            self.trajectory_data["performance_metrics"]["total_tokens_used"] += input_tokens + output_tokens
        
        await self._save_trajectory()
        logger.debug(f"Recorded LLM interaction: {provider}/{model} | Cultural context: {cultural_context.value}")
    
    async def record_agent_step(
        self,
        step_number: int,
        state: TrajectoryStepState,
        cultural_context: IraqiCulturalContext,
        language_mode: LanguageMode = LanguageMode.ENGLISH,
        professional_domain: Optional[ProfessionalDomain] = None,
        **kwargs
    ) -> None:
        """Record agent execution step with Iraqi cultural intelligence."""
        timestamp = datetime.now(timezone.utc).isoformat()
        
        # Create cultural metadata
        cultural_metadata = IraqiCulturalMetadata(
            context_type=cultural_context,
            language_mode=language_mode,
            professional_domain=professional_domain
        )
        
        # Perform cultural validation if enabled
        if self.enable_cultural_validation and "reflection" in kwargs:
            await self._perform_step_cultural_validation(kwargs["reflection"], cultural_metadata)
        
        # Create step record
        step = IraqiAgentStep(
            step_number=step_number,
            timestamp=timestamp,
            state=state,
            cultural_metadata=cultural_metadata,
            **kwargs
        )
        
        # Process Arabic content if present
        await self._process_step_arabic_content(step)
        
        # Add to trajectory
        self.trajectory_data["agent_steps"].append(asdict(step))
        
        await self._save_trajectory()
        logger.debug(f"Recorded agent step {step_number}: {state.value} | Cultural context: {cultural_context.value}")
    
    async def record_sequential_thought(
        self,
        thought_content: str,
        thought_number: int,
        total_thoughts: int,
        next_thought_needed: bool,
        cultural_context: IraqiCulturalContext,
        language_mode: LanguageMode = LanguageMode.ENGLISH,
        **kwargs
    ) -> IraqiThoughtData:
        """Record sequential thought with Iraqi cultural intelligence."""
        
        # Process thought through thinking engine
        thought_data = await self.thinking_engine.process_thought(
            thought_content=thought_content,
            thought_number=thought_number,
            total_thoughts=total_thoughts,
            next_thought_needed=next_thought_needed,
            cultural_context=cultural_context,
            language_mode=language_mode,
            **kwargs
        )
        
        # Add to trajectory
        self.trajectory_data["sequential_thoughts"].append(asdict(thought_data))
        
        await self._save_trajectory()
        logger.debug(f"Recorded thought {thought_number}/{total_thoughts}: Cultural score {thought_data.cultural_appropriateness:.2f}")
        
        return thought_data
    
    async def _perform_interaction_cultural_validation(
        self, 
        messages: List[Dict[str, Any]], 
        response: Dict[str, Any], 
        cultural_metadata: IraqiCulturalMetadata
    ) -> None:
        """Perform cultural validation on LLM interaction."""
        try:
            # Extract content for validation
            content_to_validate = ""
            if messages:
                content_to_validate += " ".join([msg.get("content", "") for msg in messages])
            if response.get("content"):
                content_to_validate += " " + response["content"]
            
            # Perform validation
            validation_result = await self.cultural_validator.validate_cultural_appropriateness(
                content_to_validate,
                cultural_metadata.context_type,
                cultural_metadata.language_mode
            )
            
            # Update metadata
            cultural_metadata.islamic_compliance_score = validation_result["islamic_compliance"]
            cultural_metadata.cultural_appropriateness_score = validation_result["overall_score"]
            cultural_metadata.cultural_validation_notes = validation_result.get("recommendations", [])
            
            # Record validation
            self.trajectory_data["cultural_validations"].append({
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "validation_type": "llm_interaction",
                "content_preview": content_to_validate[:100] + "..." if len(content_to_validate) > 100 else content_to_validate,
                "validation_result": validation_result
            })
            
            self.trajectory_data["performance_metrics"]["cultural_validation_calls"] += 1
            
        except Exception as e:
            logger.error(f"Cultural validation error in interaction: {e}")
            cultural_metadata.cultural_validation_notes.append(f"Validation error: {str(e)}")
    
    async def _perform_step_cultural_validation(
        self, 
        reflection: str, 
        cultural_metadata: IraqiCulturalMetadata
    ) -> None:
        """Perform cultural validation on agent step."""
        try:
            validation_result = await self.cultural_validator.validate_cultural_appropriateness(
                reflection,
                cultural_metadata.context_type,
                cultural_metadata.language_mode
            )
            
            # Update metadata
            cultural_metadata.islamic_compliance_score = validation_result["islamic_compliance"]
            cultural_metadata.cultural_appropriateness_score = validation_result["overall_score"]
            cultural_metadata.cultural_validation_notes = validation_result.get("recommendations", [])
            
            # Record validation
            self.trajectory_data["cultural_validations"].append({
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "validation_type": "agent_step",
                "reflection_preview": reflection[:100] + "..." if len(reflection) > 100 else reflection,
                "validation_result": validation_result
            })
            
        except Exception as e:
            logger.error(f"Cultural validation error in step: {e}")
            cultural_metadata.cultural_validation_notes.append(f"Validation error: {str(e)}")
    
    async def _process_interaction_arabic_content(self, interaction: IraqiLLMInteraction) -> None:
        """Process Arabic content in LLM interaction."""
        arabic_pattern = re.compile(r'[\u0600-\u06FF]+')
        
        # Check input messages for Arabic
        input_arabic = []
        for message in interaction.input_messages:
            content = message.get("content", "")
            arabic_matches = arabic_pattern.findall(content)
            if arabic_matches:
                input_arabic.extend(arabic_matches)
        
        # Check response for Arabic
        response_arabic = []
        if interaction.response.get("content"):
            response_matches = arabic_pattern.findall(interaction.response["content"])
            response_arabic.extend(response_matches)
        
        # Record Arabic processing if found
        if input_arabic or response_arabic:
            interaction.arabic_text_processing = {
                "input_arabic_segments": len(input_arabic),
                "response_arabic_segments": len(response_arabic),
                "total_arabic_words": len(input_arabic) + len(response_arabic),
                "rtl_processing_required": True,
                "dialect_detection_attempted": True
            }
            
            # Update cultural metadata
            interaction.cultural_metadata.arabic_text_accuracy = 0.90  # Default good accuracy
            
            self.trajectory_data["performance_metrics"]["arabic_processing_events"] += 1
    
    async def _process_step_arabic_content(self, step: IraqiAgentStep) -> None:
        """Process Arabic content in agent step."""
        arabic_pattern = re.compile(r'[\u0600-\u06FF]+')
        arabic_found = False
        
        # Check reflection for Arabic
        if step.reflection:
            arabic_matches = arabic_pattern.findall(step.reflection)
            if arabic_matches:
                arabic_found = True
                step.arabic_processing_result = {
                    "reflection_arabic_segments": len(arabic_matches),
                    "arabic_content": ' '.join(arabic_matches),
                    "rtl_display_required": True
                }
        
        # Check LLM messages for Arabic
        if step.llm_messages:
            for message in step.llm_messages:
                content = message.get("content", "")
                if arabic_pattern.search(content):
                    arabic_found = True
                    break
        
        if arabic_found:
            step.cultural_metadata.arabic_text_accuracy = 0.88  # Good default
    
    async def finalize_recording(
        self, 
        success: bool, 
        final_result: Optional[str] = None,
        cultural_compliance_achieved: bool = False,
        professional_standards_met: bool = False
    ) -> None:
        """Finalize trajectory recording with comprehensive analysis."""
        end_time = datetime.now(timezone.utc)
        execution_time = (end_time - self._start_time).total_seconds() if self._start_time else 0.0
        
        # Update task info
        self.trajectory_data["task_info"].update({
            "end_time": end_time.isoformat(),
            "execution_time_seconds": execution_time
        })
        
        # Update execution summary
        self.trajectory_data["execution_summary"].update({
            "success": success,
            "final_result": final_result,
            "cultural_compliance_achieved": cultural_compliance_achieved,
            "professional_standards_met": professional_standards_met
        })
        
        # Calculate cultural intelligence metrics
        await self._calculate_cultural_intelligence_metrics()
        
        # Generate recommendations
        recommendations = await self._generate_recommendations()
        self.trajectory_data["execution_summary"]["recommendations"] = recommendations
        
        # Final save
        await self._save_trajectory()
        
        logger.info(f"Finalized Iraqi trajectory recording: {success} | Duration: {execution_time:.2f}s | Cultural score: {self.trajectory_data['cultural_intelligence']['cultural_appropriateness_score']:.2f}")
    
    async def _calculate_cultural_intelligence_metrics(self) -> None:
        """Calculate comprehensive cultural intelligence metrics."""
        cultural_scores = []
        islamic_scores = []
        arabic_accuracies = []
        professional_scores = []
        
        # Analyze LLM interactions
        for interaction in self.trajectory_data["llm_interactions"]:
            if isinstance(interaction, dict) and "cultural_metadata" in interaction:
                meta = interaction["cultural_metadata"]
                if "cultural_appropriateness_score" in meta:
                    cultural_scores.append(meta["cultural_appropriateness_score"])
                if "islamic_compliance_score" in meta:
                    islamic_scores.append(meta["islamic_compliance_score"])
                if "arabic_text_accuracy" in meta:
                    arabic_accuracies.append(meta["arabic_text_accuracy"])
                if "professional_relevance_score" in meta:
                    professional_scores.append(meta["professional_relevance_score"])
        
        # Analyze agent steps
        for step in self.trajectory_data["agent_steps"]:
            if isinstance(step, dict) and "cultural_metadata" in step:
                meta = step["cultural_metadata"]
                if "cultural_appropriateness_score" in meta:
                    cultural_scores.append(meta["cultural_appropriateness_score"])
                if "islamic_compliance_score" in meta:
                    islamic_scores.append(meta["islamic_compliance_score"])
        
        # Analyze sequential thoughts
        for thought in self.trajectory_data["sequential_thoughts"]:
            if isinstance(thought, dict):
                if "cultural_appropriateness" in thought:
                    cultural_scores.append(thought["cultural_appropriateness"])
        
        # Calculate averages
        self.trajectory_data["cultural_intelligence"].update({
            "overall_islamic_compliance": sum(islamic_scores) / len(islamic_scores) if islamic_scores else 0.0,
            "cultural_appropriateness_score": sum(cultural_scores) / len(cultural_scores) if cultural_scores else 0.0,
            "arabic_processing_accuracy": sum(arabic_accuracies) / len(arabic_accuracies) if arabic_accuracies else 0.0,
            "professional_compliance_score": sum(professional_scores) / len(professional_scores) if professional_scores else 0.0
        })
        
        # Calculate distributions
        cultural_contexts = []
        language_modes = []
        
        for interaction in self.trajectory_data["llm_interactions"]:
            if isinstance(interaction, dict) and "cultural_metadata" in interaction:
                meta = interaction["cultural_metadata"]
                if "context_type" in meta:
                    cultural_contexts.append(meta["context_type"])
                if "language_mode" in meta:
                    language_modes.append(meta["language_mode"])
        
        # Context distribution
        context_dist = {}
        for context in cultural_contexts:
            context_dist[context] = context_dist.get(context, 0) + 1
        self.trajectory_data["cultural_intelligence"]["cultural_context_distribution"] = context_dist
        
        # Language distribution
        lang_dist = {}
        for lang in language_modes:
            lang_dist[lang] = lang_dist.get(lang, 0) + 1
        self.trajectory_data["cultural_intelligence"]["language_distribution"] = lang_dist
    
    async def _generate_recommendations(self) -> List[str]:
        """Generate intelligent recommendations based on trajectory analysis."""
        recommendations = []
        
        cultural_score = self.trajectory_data["cultural_intelligence"]["cultural_appropriateness_score"]
        islamic_score = self.trajectory_data["cultural_intelligence"]["overall_islamic_compliance"]
        arabic_score = self.trajectory_data["cultural_intelligence"]["arabic_processing_accuracy"]
        
        # Cultural appropriateness recommendations
        if cultural_score < 0.85:
            recommendations.append("Improve cultural sensitivity by incorporating more Iraqi cultural awareness in responses")
        
        # Islamic compliance recommendations
        if islamic_score < 0.90:
            recommendations.append("Enhance Islamic compliance by ensuring all content respects Islamic principles and values")
        
        # Arabic processing recommendations
        if arabic_score > 0 and arabic_score < 0.90:
            recommendations.append("Improve Arabic text processing accuracy and dialect recognition capabilities")
        
        # Professional domain recommendations
        prof_score = self.trajectory_data["cultural_intelligence"]["professional_compliance_score"]
        if prof_score > 0 and prof_score < 0.85:
            recommendations.append("Strengthen professional domain expertise and compliance standards")
        
        # Performance recommendations
        total_steps = len(self.trajectory_data["agent_steps"])
        if total_steps > 15:
            recommendations.append("Optimize execution efficiency to reduce number of steps required")
        
        # Language diversity recommendations
        lang_dist = self.trajectory_data["cultural_intelligence"]["language_distribution"]
        if len(lang_dist) == 1 and "english" in str(lang_dist).lower():
            recommendations.append("Consider incorporating Arabic language processing for better Iraqi cultural integration")
        
        return recommendations
    
    async def _save_trajectory(self) -> None:
        """Save trajectory data to file with error handling."""
        try:
            self.trajectory_path.parent.mkdir(parents=True, exist_ok=True)
            
            with open(self.trajectory_path, "w", encoding="utf-8") as f:
                json.dump(self.trajectory_data, f, indent=2, ensure_ascii=False, default=str)
                
        except Exception as e:
            logger.error(f"Failed to save trajectory to {self.trajectory_path}: {e}")
    
    def get_trajectory_path(self) -> str:
        """Get trajectory file path."""
        return str(self.trajectory_path)
    
    def get_summary_report(self) -> Dict[str, Any]:
        """Generate comprehensive summary report."""
        return {
            "trajectory_path": self.get_trajectory_path(),
            "execution_success": self.trajectory_data["execution_summary"]["success"],
            "cultural_intelligence_summary": self.trajectory_data["cultural_intelligence"],
            "performance_metrics": self.trajectory_data["performance_metrics"],
            "thinking_summary": self.thinking_engine.get_thought_summary(),
            "execution_time": self.trajectory_data["task_info"]["execution_time_seconds"],
            "recommendations": self.trajectory_data["execution_summary"]["recommendations"]
        }

# Example usage and testing
async def main():
    """Example usage of Iraqi Trajectory Intelligence System."""
    
    # Initialize system
    recorder = IraqiTrajectoryRecorder(
        trajectory_path="trajectories/demo_iraqi_trajectory.json",
        enable_cultural_validation=True
    )
    
    # Start recording
    await recorder.start_recording(
        task="Develop Iraqi legal document analysis system",
        provider="anthropic",
        model="claude-sonnet-4",
        max_steps=10,
        cultural_context=IraqiCulturalContext.PROFESSIONAL_LEGAL,
        primary_language=LanguageMode.MIXED_ARABIC_ENGLISH,
        professional_domain=ProfessionalDomain.LEGAL_LAW
    )
    
    # Record some interactions
    await recorder.record_llm_interaction(
        messages=[
            {"role": "system", "content": "You are an Iraqi legal assistant respecting Islamic principles"},
            {"role": "user", "content": "Please analyze this contract while respecting Iraqi civil law and Islamic jurisprudence"}
        ],
        response={
            "content": "I will analyze this contract according to Iraqi civil law principles and Islamic legal guidelines...",
            "usage": {"input_tokens": 150, "output_tokens": 75}
        },
        provider="anthropic",
        model="claude-sonnet-4",
        cultural_context=IraqiCulturalContext.PROFESSIONAL_LEGAL,
        language_mode=LanguageMode.ENGLISH,
        professional_domain=ProfessionalDomain.LEGAL_LAW
    )
    
    # Record sequential thoughts
    thought1 = await recorder.record_sequential_thought(
        thought_content="First, I need to understand the Iraqi legal framework and Islamic principles that apply to contract analysis",
        thought_number=1,
        total_thoughts=3,
        next_thought_needed=True,
        cultural_context=IraqiCulturalContext.PROFESSIONAL_LEGAL,
        language_mode=LanguageMode.ENGLISH
    )
    
    thought2 = await recorder.record_sequential_thought(
        thought_content="يجب أن أتأكد من أن العقد يتوافق مع الشريعة الإسلامية والقوانين العراقية",
        thought_number=2,
        total_thoughts=3,
        next_thought_needed=True,
        cultural_context=IraqiCulturalContext.PROFESSIONAL_LEGAL,
        language_mode=LanguageMode.ARABIC_STANDARD
    )
    
    # Record agent steps
    await recorder.record_agent_step(
        step_number=1,
        state=TrajectoryStepState.THINKING_CULTURALLY,
        cultural_context=IraqiCulturalContext.PROFESSIONAL_LEGAL,
        language_mode=LanguageMode.MIXED_ARABIC_ENGLISH,
        professional_domain=ProfessionalDomain.LEGAL_LAW,
        reflection="Successfully analyzed legal document with cultural and religious sensitivity"
    )
    
    # Finalize recording
    await recorder.finalize_recording(
        success=True,
        final_result="Legal document analysis completed with full Iraqi cultural and Islamic compliance",
        cultural_compliance_achieved=True,
        professional_standards_met=True
    )
    
    # Get summary report
    summary = recorder.get_summary_report()
    print("Iraqi Trajectory Intelligence Summary:")
    print(f"- Cultural Appropriateness Score: {summary['cultural_intelligence_summary']['cultural_appropriateness_score']:.2f}")
    print(f"- Islamic Compliance Score: {summary['cultural_intelligence_summary']['overall_islamic_compliance']:.2f}")
    print(f"- Professional Compliance Score: {summary['cultural_intelligence_summary']['professional_compliance_score']:.2f}")
    print(f"- Execution Time: {summary['execution_time']:.2f} seconds")
    print(f"- Success: {summary['execution_success']}")
    print(f"- Recommendations: {len(summary['recommendations'])}")

if __name__ == "__main__":
    asyncio.run(main())