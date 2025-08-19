"""
Iraqi Tool Repetition Detector - Enhanced tool repetition detection with cultural validation
Part of Roo-Code extraction with comprehensive Iraqi cultural compliance

Extends Roo-Code's ToolRepetitionDetector with Iraqi cultural validation,
Islamic compliance checking, and professional domain awareness to prevent
culturally inappropriate or religiously non-compliant tool repetition.
- Professional domain validation for Iraqi sectors
- Arabic language support for tool descriptions and feedback
- Government service workflow integration

Based on: RooCodeInc/Roo-Code tool orchestration patterns
Enhanced for: Iraqi AI Chat System with cultural and professional compliance
"""

from typing import Dict, List, Optional, Any, Tuple, Union
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
import asyncio
import json
from pathlib import Path


class ToolExecutionPattern(Enum):
    """Tool execution pattern types for advanced detection"""
    CONTINUOUS = "continuous"          # AAAA pattern
    ALTERNATING = "alternating"        # ABAB pattern  
    NON_CONTINUOUS = "non_continuous"  # ABABAB pattern
    RANDOM = "random"                  # ACBDAC pattern
    ESCALATING = "escalating"          # A->AB->ABC pattern


class CulturalValidationLevel(Enum):
    """Cultural validation levels for Iraqi context"""
    BASIC = "basic"                    # Basic cultural checks
    STANDARD = "standard"              # Standard Iraqi cultural validation
    PROFESSIONAL = "professional"     # Professional domain validation
    GOVERNMENT = "government"          # Government service validation
    FAMILY = "family"                  # Family context validation


@dataclass
class IraqiToolCall:
    """Enhanced tool call with Iraqi cultural context"""
    tool_name: str
    arguments: Dict[str, Any]
    call_id: str
    timestamp: datetime
    mode_slug: str
    user_id: Optional[str] = None
    
    # Iraqi-specific context
    cultural_context: Optional[Dict[str, Any]] = None
    professional_domain: Optional[str] = None
    islamic_compliance_required: bool = True
    arabic_language_context: bool = False
    government_service_context: bool = False
    family_context_sensitive: bool = False
    
    # Execution metadata
    execution_duration: Optional[float] = None
    success_status: Optional[bool] = None
    cultural_validation_score: Optional[float] = None
    islamic_approval_status: Optional[bool] = None


@dataclass
class RepetitionDetectionResult:
    """Result of repetition detection analysis"""
    allow_execution: bool
    repetition_detected: bool
    pattern_type: ToolExecutionPattern
    repetition_count: int
    consecutive_count: int
    time_window_violations: int
    
    # Iraqi compliance results
    cultural_compliance: bool
    islamic_approval: bool
    professional_appropriateness: bool
    family_context_appropriate: bool
    
    # Recommendations and reasoning
    rejection_reason: Optional[str] = None
    cultural_concerns: List[str] = field(default_factory=list)
    islamic_concerns: List[str] = field(default_factory=list)
    improvement_suggestions: List[str] = field(default_factory=list)
    alternative_tools: List[str] = field(default_factory=list)


@dataclass
class IraqiToolRepetitionConfig:
    """Configuration for Iraqi tool repetition detection"""
    max_consecutive_limit: int = 3
    max_total_limit: int = 10
    time_window_minutes: int = 15
    max_time_window_calls: int = 20
    
    # Cultural validation settings
    cultural_validation_level: CulturalValidationLevel = CulturalValidationLevel.STANDARD
    require_islamic_compliance: bool = True
    enable_family_context_filtering: bool = True
    enable_professional_validation: bool = True
    
    # Advanced pattern detection
    detect_non_continuous_patterns: bool = True
    max_pattern_length: int = 10
    escalation_threshold: int = 5


class IraqiCulturalValidator:
    """Cultural validation for tool repetition patterns"""
    
    def __init__(self):
        self.cultural_rules = {
            "respectful_automation": "Avoid excessive automation that may disrespect human decision-making",
            "family_privacy": "Protect family context information from excessive processing",
            "islamic_principles": "Ensure tool usage aligns with Islamic principles",
            "professional_ethics": "Maintain professional standards in repetitive operations"
        }
    
    async def validate_tool_repetition(self, 
                                     tool_call: IraqiToolCall, 
                                     context: Dict[str, Any], 
                                     repetition_count: int) -> Tuple[bool, List[str], float]:
        """Validate tool repetition against Iraqi cultural standards"""
        
        concerns = []
        compliance_score = 1.0
        
        # Family context validation
        if tool_call.family_context_sensitive and repetition_count > 2:
            concerns.append("Excessive repetition may compromise family privacy")
            compliance_score -= 0.3
        
        # Professional ethics validation
        if tool_call.professional_domain and repetition_count > 5:
            concerns.append(f"Repetitive {tool_call.tool_name} usage may violate {tool_call.professional_domain} standards")
            compliance_score -= 0.2
        
        # Islamic principles validation
        if tool_call.islamic_compliance_required:
            if tool_call.tool_name in ["web_search", "content_generation"] and repetition_count > 7:
                concerns.append("Excessive information gathering may lead to harmful content exposure")
                compliance_score -= 0.3
        
        # Government service validation
        if tool_call.government_service_context and repetition_count > 3:
            concerns.append("Government service tools should be used carefully and deliberately")
            compliance_score -= 0.4
        
        # Arabic language processing validation
        if tool_call.arabic_language_context and repetition_count > 6:
            concerns.append("Excessive Arabic processing may degrade cultural context accuracy")
            compliance_score -= 0.2
        
        is_compliant = compliance_score >= 0.7 and len(concerns) == 0
        return is_compliant, concerns, max(0.0, compliance_score)


class IslamicComplianceTracker:
    """Islamic compliance validation for repetitive tool actions"""
    
    def __init__(self):
        self.halal_tools = {
            "read_file", "write_file", "search_text", "create_directory",
            "professional_document_processor", "arabic_text_processor"
        }
        self.restricted_tools = {
            "web_search": {"max_repetitions": 5, "reason": "Avoid excessive information seeking"},
            "image_generator": {"max_repetitions": 3, "reason": "Avoid potential haram content generation"},
            "random_generator": {"max_repetitions": 2, "reason": "Avoid gambling-like patterns"}
        }
    
    async def validate_repetitive_action(self, 
                                       tool_call: IraqiToolCall, 
                                       islamic_context: Dict[str, Any],
                                       repetition_count: int) -> Tuple[bool, List[str], str]:
        """Validate repetitive actions against Islamic principles"""
        
        concerns = []
        halal_status = "approved"
        
        # Check if tool is inherently problematic
        if tool_call.tool_name in self.restricted_tools:
            restriction = self.restricted_tools[tool_call.tool_name]
            if repetition_count > restriction["max_repetitions"]:
                concerns.append(f"Tool repetition limit exceeded: {restriction['reason']}")
                halal_status = "restricted"
        
        # Time-based validation (avoid excessive late-night automation)
        current_hour = datetime.now().hour
        if 23 <= current_hour or current_hour <= 4:  # Late night
            if repetition_count > 2:
                concerns.append("Excessive automation during rest hours may disrupt Islamic work-life balance")
                halal_status = "time_restricted"
        
        # Family time validation
        if islamic_context.get("family_time_active", False) and repetition_count > 1:
            concerns.append("Repetitive tool usage during family time should be minimized")
            halal_status = "family_time_restricted"
        
        # Prayer time validation
        if islamic_context.get("prayer_time_approaching", False) and repetition_count > 1:
            concerns.append("Limit repetitive actions when prayer time approaches")
            halal_status = "prayer_time_restricted"
        
        is_approved = halal_status == "approved" and len(concerns) == 0
        return is_approved, concerns, halal_status


class ProfessionalContextTracker:
    """Professional domain validation for Iraqi contexts"""
    
    def __init__(self):
        self.domain_limits = {
            "legal": {"max_repetitions": 5, "sensitive_tools": ["document_search", "case_analysis"]},
            "medical": {"max_repetitions": 3, "sensitive_tools": ["patient_data", "medical_search"]},
            "education": {"max_repetitions": 7, "sensitive_tools": ["student_data", "grade_processor"]},
            "government": {"max_repetitions": 2, "sensitive_tools": ["citizen_data", "official_document"]},
            "finance": {"max_repetitions": 4, "sensitive_tools": ["payment_processor", "bank_integration"]}
        }
    
    async def validate(self, tool_call: IraqiToolCall, repetition_count: int) -> Tuple[bool, str]:
        """Validate tool usage against professional domain standards"""
        
        if not tool_call.professional_domain:
            return True, "No professional domain restrictions"
        
        domain = tool_call.professional_domain
        if domain not in self.domain_limits:
            return True, f"Unknown domain {domain}, allowing execution"
        
        limits = self.domain_limits[domain]
        
        # Check general repetition limits
        if repetition_count > limits["max_repetitions"]:
            return False, f"Exceeded {domain} domain repetition limit ({limits['max_repetitions']})"
        
        # Check sensitive tool usage
        if tool_call.tool_name in limits["sensitive_tools"] and repetition_count > 2:
            return False, f"Sensitive {domain} tool {tool_call.tool_name} used too frequently"
        
        return True, f"Professional validation passed for {domain} domain"


class IraqiToolRepetitionDetector:
    """
    Enhanced tool repetition detection with comprehensive Iraqi cultural validation
    
    Based on Roo-Code patterns with advanced ABABAB non-continuous pattern detection
    and comprehensive Iraqi cultural, Islamic, and professional compliance checking.
    """
    
    def __init__(self, 
                 config: IraqiToolRepetitionConfig = None,
                 cultural_validator: IraqiCulturalValidator = None,
                 islamic_tracker: IslamicComplianceTracker = None,
                 professional_tracker: ProfessionalContextTracker = None):
        
        self.config = config or IraqiToolRepetitionConfig()
        self.cultural_validator = cultural_validator or IraqiCulturalValidator()
        self.islamic_tracker = islamic_tracker or IslamicComplianceTracker()
        self.professional_tracker = professional_tracker or ProfessionalContextTracker()
        
        # Tool call history for pattern detection
        self.call_history: List[IraqiToolCall] = []
        self.pattern_cache: Dict[str, List[ToolExecutionPattern]] = {}
        
        # Performance tracking
        self.detection_metrics = {
            "total_calls_analyzed": 0,
            "repetitions_detected": 0,
            "cultural_violations": 0,
            "islamic_violations": 0,
            "professional_violations": 0
        }
    
    async def check_with_cultural_context(self, 
                                        tool_call: IraqiToolCall, 
                                        context: Dict[str, Any]) -> RepetitionDetectionResult:
        """
        Comprehensive repetition detection with Iraqi cultural validation
        
        Args:
            tool_call: Tool call to validate
            context: Iraqi cultural and professional context
            
        Returns:
            RepetitionDetectionResult with comprehensive validation results
        """
        
        self.detection_metrics["total_calls_analyzed"] += 1
        
        # Add to call history
        self.call_history.append(tool_call)
        self._cleanup_old_calls()
        
        # Base repetition detection (Roo-Code pattern)
        base_repetition_result = await self._detect_repetition_patterns(tool_call)
        
        # Iraqi cultural validation
        cultural_approved, cultural_concerns, cultural_score = await self.cultural_validator.validate_tool_repetition(
            tool_call, context, base_repetition_result["total_count"]
        )
        
        # Islamic compliance validation
        islamic_approved, islamic_concerns, halal_status = await self.islamic_tracker.validate_repetitive_action(
            tool_call, context.get("islamic_context", {}), base_repetition_result["total_count"]
        )
        
        # Professional domain validation
        professional_approved, professional_reason = await self.professional_tracker.validate(
            tool_call, base_repetition_result["total_count"]
        )
        
        # Family context validation
        family_approved = await self._validate_family_context(
            tool_call, context, base_repetition_result["total_count"]
        )
        
        # Compile comprehensive result
        result = RepetitionDetectionResult(
            allow_execution=self._determine_final_approval(
                base_repetition_result["allow"], cultural_approved, 
                islamic_approved, professional_approved, family_approved
            ),
            repetition_detected=base_repetition_result["detected"],
            pattern_type=base_repetition_result["pattern_type"],
            repetition_count=base_repetition_result["total_count"],
            consecutive_count=base_repetition_result["consecutive_count"],
            time_window_violations=base_repetition_result["time_violations"],
            
            # Iraqi compliance results
            cultural_compliance=cultural_approved,
            islamic_approval=islamic_approved,
            professional_appropriateness=professional_approved,
            family_context_appropriate=family_approved,
            
            # Detailed feedback
            cultural_concerns=cultural_concerns,
            islamic_concerns=islamic_concerns,
            improvement_suggestions=await self._generate_improvement_suggestions(
                tool_call, base_repetition_result, cultural_concerns, islamic_concerns
            ),
            alternative_tools=await self._suggest_alternative_tools(tool_call)
        )
        
        # Update metrics
        if result.repetition_detected:
            self.detection_metrics["repetitions_detected"] += 1
        if not result.cultural_compliance:
            self.detection_metrics["cultural_violations"] += 1
        if not result.islamic_approval:
            self.detection_metrics["islamic_violations"] += 1
        if not result.professional_appropriateness:
            self.detection_metrics["professional_violations"] += 1
        
        # Set rejection reason if not approved
        if not result.allow_execution:
            result.rejection_reason = self._compile_rejection_reason(result)
        
        return result
    
    async def _detect_repetition_patterns(self, tool_call: IraqiToolCall) -> Dict[str, Any]:
        """
        Advanced repetition pattern detection including non-continuous ABABAB patterns
        Based on Roo-Code's enhanced repetition detection requirements
        """
        
        tool_name = tool_call.tool_name
        recent_calls = [call for call in self.call_history[-20:] if call.tool_name == tool_name]
        
        # Count consecutive repetitions
        consecutive_count = 0
        for call in reversed(self.call_history):
            if call.tool_name == tool_name:
                consecutive_count += 1
            else:
                break
        
        # Count total repetitions in time window
        time_threshold = datetime.now() - timedelta(minutes=self.config.time_window_minutes)
        window_calls = [call for call in recent_calls if call.timestamp > time_threshold]
        total_count = len(recent_calls)
        time_window_count = len(window_calls)
        
        # Detect pattern type
        pattern_type = self._analyze_execution_pattern(recent_calls)
        
        # Apply Roo-Code validation rules
        base_allow = True
        detected = False
        
        # Consecutive limit check
        if consecutive_count > self.config.max_consecutive_limit:
            base_allow = False
            detected = True
        
        # Total repetition limit check
        if total_count > self.config.max_total_limit:
            base_allow = False
            detected = True
        
        # Time window limit check
        time_violations = 0
        if time_window_count > self.config.max_time_window_calls:
            base_allow = False
            detected = True
            time_violations = time_window_count - self.config.max_time_window_calls
        
        # Non-continuous pattern detection (enhanced Roo-Code feature)
        if self.config.detect_non_continuous_patterns:
            if pattern_type == ToolExecutionPattern.NON_CONTINUOUS and total_count > 6:
                base_allow = False
                detected = True
        
        return {
            "allow": base_allow,
            "detected": detected,
            "pattern_type": pattern_type,
            "total_count": total_count,
            "consecutive_count": consecutive_count,
            "time_violations": time_violations
        }
    
    def _analyze_execution_pattern(self, recent_calls: List[IraqiToolCall]) -> ToolExecutionPattern:
        """Analyze the execution pattern of recent tool calls"""
        
        if len(recent_calls) < 2:
            return ToolExecutionPattern.RANDOM
        
        # Extract just the tool names for pattern analysis
        tools = [call.tool_name for call in recent_calls[-self.config.max_pattern_length:]]
        
        # Check for continuous pattern (AAAA)
        if len(set(tools)) == 1:
            return ToolExecutionPattern.CONTINUOUS
        
        # Check for alternating pattern (ABAB)
        if len(tools) >= 4:
            if tools[0] == tools[2] and tools[1] == tools[3] and tools[0] != tools[1]:
                return ToolExecutionPattern.ALTERNATING
        
        # Check for non-continuous repetition (ABABAB)
        if len(tools) >= 6:
            pattern_length = 2
            while pattern_length <= len(tools) // 2:
                pattern = tools[:pattern_length]
                matches = True
                for i in range(pattern_length, len(tools), pattern_length):
                    if tools[i:i+pattern_length] != pattern:
                        matches = False
                        break
                if matches:
                    return ToolExecutionPattern.NON_CONTINUOUS
                pattern_length += 1
        
        # Check for escalating pattern (A -> AB -> ABC)
        unique_tools = []
        for tool in tools:
            if tool not in unique_tools:
                unique_tools.append(tool)
        
        if len(unique_tools) > 2 and len(tools) > 5:
            return ToolExecutionPattern.ESCALATING
        
        return ToolExecutionPattern.RANDOM
    
    async def _validate_family_context(self, 
                                     tool_call: IraqiToolCall, 
                                     context: Dict[str, Any], 
                                     repetition_count: int) -> bool:
        """Validate tool usage against Iraqi family context sensitivity"""
        
        if not tool_call.family_context_sensitive:
            return True
        
        family_context = context.get("family_context", {})
        
        # Check if family members are present
        if family_context.get("family_members_present", False) and repetition_count > 2:
            return False
        
        # Check if children are present (extra sensitivity)
        if family_context.get("children_present", False) and repetition_count > 1:
            return False
        
        # Check if it's family meal time
        if family_context.get("family_meal_time", False) and repetition_count > 1:
            return False
        
        return True
    
    def _determine_final_approval(self, 
                                base_allow: bool, 
                                cultural_approved: bool, 
                                islamic_approved: bool, 
                                professional_approved: bool, 
                                family_approved: bool) -> bool:
        """Determine final approval based on all validation results"""
        
        # All validations must pass for approval
        return (base_allow and cultural_approved and islamic_approved and 
                professional_approved and family_approved)
    
    def _compile_rejection_reason(self, result: RepetitionDetectionResult) -> str:
        """Compile comprehensive rejection reason"""
        
        reasons = []
        
        if result.repetition_detected:
            reasons.append(f"Tool repetition detected: {result.pattern_type.value} pattern with {result.repetition_count} calls")
        
        if not result.cultural_compliance:
            reasons.append(f"Cultural compliance failed: {', '.join(result.cultural_concerns)}")
        
        if not result.islamic_approval:
            reasons.append(f"Islamic compliance failed: {', '.join(result.islamic_concerns)}")
        
        if not result.professional_appropriateness:
            reasons.append("Professional domain standards not met")
        
        if not result.family_context_appropriate:
            reasons.append("Family context sensitivity requirements not met")
        
        return "; ".join(reasons)
    
    async def _generate_improvement_suggestions(self, 
                                              tool_call: IraqiToolCall, 
                                              base_result: Dict[str, Any], 
                                              cultural_concerns: List[str], 
                                              islamic_concerns: List[str]) -> List[str]:
        """Generate contextual improvement suggestions"""
        
        suggestions = []
        
        # Base repetition suggestions
        if base_result["consecutive_count"] > self.config.max_consecutive_limit:
            suggestions.append(f"Use batch operations instead of {base_result['consecutive_count']} consecutive calls")
        
        # Cultural improvement suggestions
        if cultural_concerns:
            suggestions.append("Consider cultural impact: space out tool usage and ensure human oversight")
        
        # Islamic improvement suggestions  
        if islamic_concerns:
            suggestions.append("Align with Islamic principles: avoid excessive automation during prayer times")
        
        # Professional suggestions
        if tool_call.professional_domain:
            suggestions.append(f"Follow {tool_call.professional_domain} professional standards for tool usage frequency")
        
        # Pattern-specific suggestions
        if base_result["pattern_type"] == ToolExecutionPattern.NON_CONTINUOUS:
            suggestions.append("Detected ABABAB pattern - consider workflow optimization to reduce repetitive switching")
        
        return suggestions
    
    async def _suggest_alternative_tools(self, tool_call: IraqiToolCall) -> List[str]:
        """Suggest alternative tools for Iraqi context"""
        
        alternatives = []
        tool_name = tool_call.tool_name
        
        # Tool-specific alternatives
        alternative_map = {
            "web_search": ["cached_search", "knowledge_base_query", "professional_database_search"],
            "file_write": ["batch_file_writer", "template_processor", "document_generator"],
            "content_generator": ["template_expander", "professional_content_library", "arabic_content_processor"],
            "document_processor": ["batch_document_processor", "professional_template_system", "arabic_document_handler"]
        }
        
        if tool_name in alternative_map:
            alternatives.extend(alternative_map[tool_name])
        
        # Professional domain alternatives
        if tool_call.professional_domain:
            alternatives.append(f"{tool_call.professional_domain}_specialized_processor")
        
        # Arabic language alternatives
        if tool_call.arabic_language_context:
            alternatives.extend(["arabic_batch_processor", "rtl_document_handler", "iraqi_dialect_processor"])
        
        return alternatives
    
    def _cleanup_old_calls(self):
        """Clean up old call history to maintain performance"""
        
        # Keep only recent calls (last 24 hours and max 1000 calls)
        cutoff_time = datetime.now() - timedelta(hours=24)
        self.call_history = [
            call for call in self.call_history[-1000:] 
            if call.timestamp > cutoff_time
        ]
    
    def get_detection_metrics(self) -> Dict[str, Any]:
        """Get comprehensive detection metrics for monitoring"""
        
        total_calls = self.detection_metrics["total_calls_analyzed"]
        
        if total_calls == 0:
            return self.detection_metrics
        
        return {
            **self.detection_metrics,
            "repetition_rate": self.detection_metrics["repetitions_detected"] / total_calls,
            "cultural_violation_rate": self.detection_metrics["cultural_violations"] / total_calls,
            "islamic_violation_rate": self.detection_metrics["islamic_violations"] / total_calls,
            "professional_violation_rate": self.detection_metrics["professional_violations"] / total_calls,
            "overall_compliance_rate": 1.0 - (
                (self.detection_metrics["cultural_violations"] + 
                 self.detection_metrics["islamic_violations"] + 
                 self.detection_metrics["professional_violations"]) / (total_calls * 3)
            )
        }
    
    async def export_analysis_report(self, file_path: Path) -> Dict[str, Any]:
        """Export comprehensive analysis report for Iraqi compliance monitoring"""
        
        report = {
            "generated_at": datetime.now().isoformat(),
            "detection_metrics": self.get_detection_metrics(),
            "configuration": {
                "max_consecutive_limit": self.config.max_consecutive_limit,
                "max_total_limit": self.config.max_total_limit,
                "time_window_minutes": self.config.time_window_minutes,
                "cultural_validation_level": self.config.cultural_validation_level.value,
                "require_islamic_compliance": self.config.require_islamic_compliance,
                "detect_non_continuous_patterns": self.config.detect_non_continuous_patterns
            },
            "recent_patterns": self._analyze_recent_patterns(),
            "recommendations": await self._generate_system_recommendations()
        }
        
        # Save report
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)
        
        return report
    
    def _analyze_recent_patterns(self) -> Dict[str, Any]:
        """Analyze recent execution patterns for reporting"""
        
        recent_calls = self.call_history[-100:]  # Last 100 calls
        
        if not recent_calls:
            return {"message": "No recent calls to analyze"}
        
        # Tool usage frequency
        tool_frequency = {}
        for call in recent_calls:
            tool_frequency[call.tool_name] = tool_frequency.get(call.tool_name, 0) + 1
        
        # Pattern type distribution
        pattern_distribution = {}
        for tool_name in tool_frequency.keys():
            tool_calls = [call for call in recent_calls if call.tool_name == tool_name]
            pattern = self._analyze_execution_pattern(tool_calls)
            pattern_distribution[pattern.value] = pattern_distribution.get(pattern.value, 0) + 1
        
        return {
            "total_recent_calls": len(recent_calls),
            "unique_tools_used": len(tool_frequency),
            "most_used_tools": sorted(tool_frequency.items(), key=lambda x: x[1], reverse=True)[:5],
            "pattern_distribution": pattern_distribution,
            "time_span": {
                "start": recent_calls[0].timestamp.isoformat() if recent_calls else None,
                "end": recent_calls[-1].timestamp.isoformat() if recent_calls else None
            }
        }
    
    async def _generate_system_recommendations(self) -> List[str]:
        """Generate system-level recommendations for improvement"""
        
        recommendations = []
        metrics = self.get_detection_metrics()
        
        # High repetition rate recommendations
        if metrics.get("repetition_rate", 0) > 0.3:
            recommendations.append("Consider implementing batch operations to reduce tool repetition")
        
        # Cultural violation recommendations
        if metrics.get("cultural_violation_rate", 0) > 0.1:
            recommendations.append("Review cultural validation rules and provide user education on appropriate tool usage")
        
        # Islamic compliance recommendations
        if metrics.get("islamic_violation_rate", 0) > 0.05:
            recommendations.append("Implement stronger Islamic compliance safeguards and prayer time awareness")
        
        # Professional standards recommendations
        if metrics.get("professional_violation_rate", 0) > 0.1:
            recommendations.append("Enhance professional domain validation rules and provide domain-specific guidance")
        
        # Performance recommendations
        total_calls = metrics.get("total_calls_analyzed", 0)
        if total_calls > 10000:
            recommendations.append("Consider implementing call history archiving for improved performance")
        
        return recommendations


# Example usage and testing
if __name__ == "__main__":
    async def test_iraqi_tool_repetition_detector():
        """Test the Iraqi tool repetition detector with various scenarios"""
        
        # Initialize detector with Iraqi configuration
        config = IraqiToolRepetitionConfig(
            max_consecutive_limit=3,
            cultural_validation_level=CulturalValidationLevel.PROFESSIONAL,
            require_islamic_compliance=True
        )
        
        detector = IraqiToolRepetitionDetector(config)
        
        # Test scenarios
        test_cases = [
            {
                "name": "Professional Legal Document Processing",
                "tool_call": IraqiToolCall(
                    tool_name="document_processor",
                    arguments={"file": "legal_contract.pdf"},
                    call_id="legal_001",
                    timestamp=datetime.now(),
                    mode_slug="professional",
                    professional_domain="legal",
                    islamic_compliance_required=True,
                    cultural_context={"professional_domain": "legal", "document_type": "contract"}
                ),
                "context": {
                    "professional_domain": "legal",
                    "islamic_context": {"halal_business": True, "prayer_time_approaching": False},
                    "family_context": {"family_members_present": False}
                }
            },
            {
                "name": "Arabic Content Generation with Family Context",
                "tool_call": IraqiToolCall(
                    tool_name="content_generator",
                    arguments={"language": "arabic", "content_type": "family_letter"},
                    call_id="arabic_001",
                    timestamp=datetime.now(),
                    mode_slug="family",
                    arabic_language_context=True,
                    family_context_sensitive=True,
                    cultural_context={"language": "arabic", "family_context": True}
                ),
                "context": {
                    "family_context": {"family_members_present": True, "children_present": True},
                    "islamic_context": {"family_time_active": True}
                }
            }
        ]
        
        # Run tests
        for test_case in test_cases:
            print(f"\n🧪 Testing: {test_case['name']}")
            
            # Simulate multiple calls to trigger repetition detection
            for i in range(5):
                result = await detector.check_with_cultural_context(
                    test_case["tool_call"], 
                    test_case["context"]
                )
                
                print(f"  Call {i+1}: {'✅ Allowed' if result.allow_execution else '❌ Blocked'}")
                if not result.allow_execution:
                    print(f"    Reason: {result.rejection_reason}")
                    if result.improvement_suggestions:
                        print(f"    Suggestions: {', '.join(result.improvement_suggestions[:2])}")
                    break
        
        # Print final metrics
        print(f"\n📊 Final Detection Metrics:")
        metrics = detector.get_detection_metrics()
        for key, value in metrics.items():
            if isinstance(value, float):
                print(f"  {key}: {value:.2%}")
            else:
                print(f"  {key}: {value}")
    
    # Run the test
    asyncio.run(test_iraqi_tool_repetition_detector())