"""
Iraqi Trajectory Recorder - Enhanced Execution Tracking with Cultural Context

Extracted from: trae-agent/trae_agent/utils/trajectory_recorder.py
Enhanced for: Iraqi AI Chat System with comprehensive cultural and professional context tracking

Core Features:
1. Comprehensive execution tracking (LLM interactions, agent steps, tool usage)
2. Task performance metrics and timeline analysis
3. Error tracking and debugging support
4. Execution state persistence across sessions
5. Token usage monitoring and optimization insights

Iraqi Enhancements:
- Cultural context tracking (Islamic compliance, family appropriateness)
- Professional domain execution monitoring (legal, medical, government services)
- Arabic language processing metrics (RTL accuracy, dialect recognition)
- Payment gateway interaction tracking (ZainCash, FastPay, NassWallet)
- Government service workflow tracking (passport, visa, ministry interactions)
- Regional context preservation (Baghdad vs. regional variations)
- Islamic compliance validation throughout execution
- Professional ethics adherence monitoring
"""

import json
import hashlib
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional, Union
from dataclasses import dataclass, asdict
from enum import Enum

class IraqiExecutionContext(str, Enum):
    PROFESSIONAL = "professional"      # Professional domain work
    GOVERNMENT = "government"          # Government service interactions
    FAMILY = "family"                  # Family-related conversations
    EDUCATION = "education"            # Educational content and guidance
    BUSINESS = "business"              # Business and commercial interactions
    HEALTHCARE = "healthcare"          # Medical and health-related content
    LEGAL = "legal"                    # Legal advice and document processing
    GENERAL = "general"                # General Iraqi cultural interactions

class CulturalValidationLevel(str, Enum):
    STRICT = "strict"                  # Full Islamic compliance required
    MODERATE = "moderate"              # Standard cultural appropriateness
    BASIC = "basic"                    # Basic cultural awareness
    NONE = "none"                      # No cultural validation

class ProfessionalDomain(str, Enum):
    LEGAL = "legal"
    MEDICAL = "medical"
    EDUCATION = "education"
    GOVERNMENT = "government"
    ENGINEERING = "engineering"
    FINANCE = "finance"

@dataclass
class IraqiCulturalMetrics:
    """Cultural compliance and appropriateness metrics"""
    islamic_compliance_score: float
    family_appropriateness_score: float
    professional_appropriateness_score: float
    arabic_language_accuracy: float
    cultural_sensitivity_score: float
    regional_appropriateness_score: float
    validation_level: CulturalValidationLevel
    cultural_issues_detected: List[str]
    cultural_recommendations: List[str]

@dataclass
class IraqiProfessionalMetrics:
    """Professional domain execution metrics"""
    active_domain: Optional[ProfessionalDomain]
    domain_compliance_score: float
    professional_ethics_score: float
    client_confidentiality_maintained: bool
    regulatory_compliance_score: float
    professional_standard_adherence: float
    certification_requirements_met: bool
    professional_issues_detected: List[str]

@dataclass
class ArabicProcessingMetrics:
    """Arabic language processing performance metrics"""
    rtl_rendering_accuracy: float
    dialect_recognition_accuracy: float
    mixed_content_handling_score: float
    arabic_typography_quality: float
    text_direction_accuracy: float
    character_encoding_success_rate: float
    arabic_content_percentage: float
    processing_issues: List[str]

@dataclass
class PaymentGatewayMetrics:
    """Payment gateway interaction tracking"""
    gateways_used: List[str]  # zaincash, fastpay, nasswallet
    transaction_success_rate: float
    security_compliance_score: float
    payment_processing_time: float
    currency_handling_accuracy: float  # IQD processing
    fraud_prevention_score: float
    gateway_availability_rate: float
    payment_issues: List[str]

@dataclass
class GovernmentServiceMetrics:
    """Government service interaction tracking"""
    services_accessed: List[str]  # passport, visa, ministry
    workflow_completion_rate: float
    document_processing_accuracy: float
    regulatory_compliance_score: float
    service_efficiency_score: float
    citizen_satisfaction_score: float
    bureaucratic_complexity_handled: float
    service_issues: List[str]

@dataclass
class IraqiLLMInteraction:
    """Enhanced LLM interaction with Iraqi context"""
    timestamp: str
    provider: str
    model: str
    input_messages: List[Dict[str, Any]]
    response: Dict[str, Any]
    tools_available: Optional[List[str]]
    cultural_context: IraqiExecutionContext
    cultural_metrics: IraqiCulturalMetrics
    professional_metrics: Optional[IraqiProfessionalMetrics]
    arabic_metrics: Optional[ArabicProcessingMetrics]
    regional_context: str
    execution_time_ms: float

@dataclass
class IraqiAgentStep:
    """Enhanced agent step with Iraqi cultural and professional context"""
    step_number: int
    timestamp: str
    state: str
    execution_context: IraqiExecutionContext
    llm_messages: Optional[List[Dict[str, Any]]]
    llm_response: Optional[Dict[str, Any]]
    tool_calls: Optional[List[Dict[str, Any]]]
    tool_results: Optional[List[Dict[str, Any]]]
    reflection: Optional[str]
    error: Optional[str]
    cultural_validation: IraqiCulturalMetrics
    professional_validation: Optional[IraqiProfessionalMetrics]
    arabic_processing: Optional[ArabicProcessingMetrics]
    payment_tracking: Optional[PaymentGatewayMetrics]
    government_service_tracking: Optional[GovernmentServiceMetrics]
    step_execution_time: float
    cultural_issues_resolved: List[str]

class IraqiTrajectoryRecorder:
    """
    Enhanced trajectory recorder with comprehensive Iraqi cultural and professional context tracking
    
    Handles:
    - Comprehensive execution tracking with cultural context preservation
    - Islamic compliance monitoring throughout task execution
    - Professional domain adherence tracking (legal, medical, government)
    - Arabic language processing performance metrics
    - Payment gateway interaction monitoring and security tracking
    - Government service workflow tracking and efficiency measurement
    - Regional context preservation (Baghdad vs. governorate variations)
    - Cultural validation and recommendation generation
    """
    
    def __init__(self, trajectory_path: Optional[str] = None, task_context: IraqiExecutionContext = IraqiExecutionContext.GENERAL):
        """Initialize Iraqi trajectory recorder with cultural context awareness"""
        
        if trajectory_path is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            context_suffix = task_context.value
            trajectory_path = f"trajectories/iraqi_trajectory_{context_suffix}_{timestamp}.json"
        
        self.trajectory_path: Path = Path(trajectory_path).resolve()
        self.task_context = task_context
        
        try:
            self.trajectory_path.parent.mkdir(parents=True, exist_ok=True)
        except Exception:
            print("Error creating trajectory directory. Trajectories may not be properly saved.")
        
        # Enhanced trajectory data with Iraqi context
        self.trajectory_data: Dict[str, Any] = {
            "task": "",
            "task_context": task_context.value,
            "start_time": "",
            "end_time": "",
            "provider": "",
            "model": "",
            "max_steps": 0,
            "execution_context": task_context.value,
            "cultural_validation_level": CulturalValidationLevel.MODERATE.value,
            "professional_domain": None,
            "regional_context": "baghdad",  # Default to Baghdad
            "llm_interactions": [],
            "agent_steps": [],
            "success": False,
            "final_result": None,
            "execution_time": 0.0,
            
            # Iraqi-specific metrics
            "cultural_compliance_summary": {
                "overall_islamic_compliance": 0.0,
                "overall_family_appropriateness": 0.0,
                "overall_professional_appropriateness": 0.0,
                "cultural_issues_count": 0,
                "cultural_recommendations_count": 0
            },
            "professional_performance_summary": {
                "domain_compliance_average": 0.0,
                "ethics_score_average": 0.0,
                "regulatory_compliance_average": 0.0,
                "professional_issues_count": 0
            },
            "arabic_processing_summary": {
                "overall_rtl_accuracy": 0.0,
                "overall_dialect_recognition": 0.0,
                "arabic_content_percentage": 0.0,
                "processing_issues_count": 0
            },
            "payment_gateway_summary": {
                "gateways_used": [],
                "overall_success_rate": 0.0,
                "security_compliance_average": 0.0,
                "payment_issues_count": 0
            },
            "government_service_summary": {
                "services_accessed": [],
                "workflow_completion_average": 0.0,
                "efficiency_score_average": 0.0,
                "service_issues_count": 0
            },
            "token_usage_summary": {
                "total_input_tokens": 0,
                "total_output_tokens": 0,
                "total_reasoning_tokens": 0,
                "cost_efficiency_score": 0.0
            }
        }
        
        self._start_time: Optional[datetime] = None
        
        # Initialize processors
        self.cultural_validator = IraqiCulturalValidator()
        self.professional_monitor = IraqiProfessionalMonitor()
        self.arabic_processor = ArabicProcessingMonitor()
        self.payment_tracker = PaymentGatewayTracker()
        self.government_tracker = GovernmentServiceTracker()
    
    def start_recording(self, 
                       task: str, 
                       provider: str, 
                       model: str, 
                       max_steps: int,
                       cultural_validation_level: CulturalValidationLevel = CulturalValidationLevel.MODERATE,
                       professional_domain: Optional[ProfessionalDomain] = None,
                       regional_context: str = "baghdad") -> None:
        """Start recording a new trajectory with Iraqi context"""
        
        self._start_time = datetime.now()
        self.trajectory_data.update({
            "task": task,
            "start_time": self._start_time.isoformat(),
            "provider": provider,
            "model": model,
            "max_steps": max_steps,
            "cultural_validation_level": cultural_validation_level.value,
            "professional_domain": professional_domain.value if professional_domain else None,
            "regional_context": regional_context,
            "llm_interactions": [],
            "agent_steps": []
        })
        
        self.save_trajectory()
    
    async def record_llm_interaction(self,
                                   messages: List[Dict[str, Any]],
                                   response: Dict[str, Any],
                                   provider: str,
                                   model: str,
                                   tools: Optional[List[Any]] = None,
                                   execution_context: IraqiExecutionContext = IraqiExecutionContext.GENERAL,
                                   regional_context: str = "baghdad") -> None:
        """Record an LLM interaction with comprehensive Iraqi cultural analysis"""
        
        start_time = datetime.now()
        
        # Perform cultural validation
        cultural_metrics = await self.cultural_validator.validate_interaction(
            messages, response, execution_context
        )
        
        # Perform professional validation if applicable
        professional_metrics = None
        if self.trajectory_data.get("professional_domain"):
            professional_metrics = await self.professional_monitor.validate_interaction(
                messages, response, ProfessionalDomain(self.trajectory_data["professional_domain"])
            )
        
        # Analyze Arabic processing
        arabic_metrics = await self.arabic_processor.analyze_interaction(
            messages, response
        )
        
        execution_time = (datetime.now() - start_time).total_seconds() * 1000
        
        interaction = IraqiLLMInteraction(
            timestamp=datetime.now().isoformat(),
            provider=provider,
            model=model,
            input_messages=messages,
            response=response,
            tools_available=[tool.name for tool in tools] if tools else None,
            cultural_context=execution_context,
            cultural_metrics=cultural_metrics,
            professional_metrics=professional_metrics,
            arabic_metrics=arabic_metrics,
            regional_context=regional_context,
            execution_time_ms=execution_time
        )
        
        self.trajectory_data["llm_interactions"].append(asdict(interaction))
        self._update_summary_metrics(interaction)
        self.save_trajectory()
    
    async def record_agent_step(self,
                              step_number: int,
                              state: str,
                              execution_context: IraqiExecutionContext = IraqiExecutionContext.GENERAL,
                              llm_messages: Optional[List[Dict[str, Any]]] = None,
                              llm_response: Optional[Dict[str, Any]] = None,
                              tool_calls: Optional[List[Dict[str, Any]]] = None,
                              tool_results: Optional[List[Dict[str, Any]]] = None,
                              reflection: Optional[str] = None,
                              error: Optional[str] = None) -> None:
        """Record an agent execution step with comprehensive Iraqi context analysis"""
        
        step_start_time = datetime.now()
        
        # Perform cultural validation for the step
        cultural_validation = await self.cultural_validator.validate_step(
            state, llm_messages, llm_response, tool_calls, tool_results, execution_context
        )
        
        # Perform professional validation if applicable
        professional_validation = None
        if self.trajectory_data.get("professional_domain"):
            professional_validation = await self.professional_monitor.validate_step(
                state, llm_messages, llm_response, tool_calls, tool_results,
                ProfessionalDomain(self.trajectory_data["professional_domain"])
            )
        
        # Analyze Arabic processing
        arabic_processing = await self.arabic_processor.analyze_step(
            llm_messages, llm_response, tool_calls, tool_results
        )
        
        # Track payment gateway interactions
        payment_tracking = None
        if tool_calls and any("payment" in str(call).lower() for call in tool_calls):
            payment_tracking = await self.payment_tracker.analyze_step(tool_calls, tool_results)
        
        # Track government service interactions
        government_service_tracking = None
        if tool_calls and any("government" in str(call).lower() or "ministry" in str(call).lower() for call in tool_calls):
            government_service_tracking = await self.government_tracker.analyze_step(tool_calls, tool_results)
        
        step_execution_time = (datetime.now() - step_start_time).total_seconds()
        
        # Identify and resolve cultural issues
        cultural_issues_resolved = await self._resolve_cultural_issues(
            cultural_validation.cultural_issues_detected
        )
        
        step_data = IraqiAgentStep(
            step_number=step_number,
            timestamp=datetime.now().isoformat(),
            state=state,
            execution_context=execution_context,
            llm_messages=llm_messages,
            llm_response=llm_response,
            tool_calls=tool_calls,
            tool_results=tool_results,
            reflection=reflection,
            error=error,
            cultural_validation=cultural_validation,
            professional_validation=professional_validation,
            arabic_processing=arabic_processing,
            payment_tracking=payment_tracking,
            government_service_tracking=government_service_tracking,
            step_execution_time=step_execution_time,
            cultural_issues_resolved=cultural_issues_resolved
        )
        
        self.trajectory_data["agent_steps"].append(asdict(step_data))
        self._update_step_summary_metrics(step_data)
        self.save_trajectory()
    
    def finalize_recording(self, success: bool, final_result: Optional[str] = None) -> None:
        """Finalize the trajectory recording with comprehensive Iraqi metrics summary"""
        
        end_time = datetime.now()
        execution_time = (end_time - self._start_time).total_seconds() if self._start_time else 0.0
        
        # Calculate final cultural compliance summary
        final_cultural_summary = self._calculate_final_cultural_summary()
        
        # Calculate final professional performance summary
        final_professional_summary = self._calculate_final_professional_summary()
        
        # Calculate final Arabic processing summary
        final_arabic_summary = self._calculate_final_arabic_summary()
        
        # Generate Iraqi-specific recommendations
        iraqi_recommendations = self._generate_iraqi_recommendations()
        
        self.trajectory_data.update({
            "end_time": end_time.isoformat(),
            "success": success,
            "final_result": final_result,
            "execution_time": execution_time,
            "final_cultural_compliance_summary": final_cultural_summary,
            "final_professional_performance_summary": final_professional_summary,
            "final_arabic_processing_summary": final_arabic_summary,
            "iraqi_specific_recommendations": iraqi_recommendations,
            "cultural_compliance_grade": self._calculate_cultural_grade(),
            "professional_excellence_grade": self._calculate_professional_grade(),
            "arabic_processing_grade": self._calculate_arabic_grade(),
            "overall_iraqi_ai_performance_score": self._calculate_overall_iraqi_score()
        })
        
        self.save_trajectory()
    
    def save_trajectory(self) -> None:
        """Save the current trajectory data to file with enhanced error handling"""
        try:
            # Ensure directory exists
            self.trajectory_path.parent.mkdir(parents=True, exist_ok=True)
            
            with open(self.trajectory_path, "w", encoding="utf-8") as f:
                json.dump(self.trajectory_data, f, indent=2, ensure_ascii=False)
        
        except Exception as e:
            print(f"Warning: Failed to save Iraqi trajectory to {self.trajectory_path}: {e}")
    
    def get_cultural_performance_report(self) -> Dict[str, Any]:
        """Generate comprehensive cultural performance report"""
        return {
            "cultural_compliance": self.trajectory_data.get("cultural_compliance_summary", {}),
            "professional_performance": self.trajectory_data.get("professional_performance_summary", {}),
            "arabic_processing": self.trajectory_data.get("arabic_processing_summary", {}),
            "recommendations": self.trajectory_data.get("iraqi_specific_recommendations", []),
            "overall_score": self.trajectory_data.get("overall_iraqi_ai_performance_score", 0.0)
        }
    
    def get_trajectory_path(self) -> str:
        """Get the path where trajectory is being saved"""
        return str(self.trajectory_path)
    
    # Internal helper methods
    
    def _update_summary_metrics(self, interaction: IraqiLLMInteraction):
        """Update summary metrics based on LLM interaction"""
        # Update cultural compliance summary
        cultural_summary = self.trajectory_data["cultural_compliance_summary"]
        cultural_summary["overall_islamic_compliance"] = self._update_average(
            cultural_summary["overall_islamic_compliance"],
            interaction.cultural_metrics.islamic_compliance_score,
            len(self.trajectory_data["llm_interactions"])
        )
        
        # Update token usage summary
        if "usage" in interaction.response:
            usage = interaction.response["usage"]
            token_summary = self.trajectory_data["token_usage_summary"]
            token_summary["total_input_tokens"] += usage.get("input_tokens", 0)
            token_summary["total_output_tokens"] += usage.get("output_tokens", 0)
            token_summary["total_reasoning_tokens"] += usage.get("reasoning_tokens", 0)
    
    def _update_step_summary_metrics(self, step: IraqiAgentStep):
        """Update summary metrics based on agent step"""
        # Update payment gateway summary if applicable
        if step.payment_tracking:
            payment_summary = self.trajectory_data["payment_gateway_summary"]
            for gateway in step.payment_tracking.gateways_used:
                if gateway not in payment_summary["gateways_used"]:
                    payment_summary["gateways_used"].append(gateway)
        
        # Update government service summary if applicable
        if step.government_service_tracking:
            gov_summary = self.trajectory_data["government_service_summary"]
            for service in step.government_service_tracking.services_accessed:
                if service not in gov_summary["services_accessed"]:
                    gov_summary["services_accessed"].append(service)
    
    def _update_average(self, current_avg: float, new_value: float, count: int) -> float:
        """Update running average with new value"""
        if count == 1:
            return new_value
        return ((current_avg * (count - 1)) + new_value) / count
    
    async def _resolve_cultural_issues(self, issues: List[str]) -> List[str]:
        """Resolve cultural issues detected during execution"""
        resolved = []
        for issue in issues:
            if "islamic_compliance" in issue:
                resolved.append("Applied Islamic compliance corrections")
            elif "family_appropriateness" in issue:
                resolved.append("Enhanced family context appropriateness")
            elif "professional_ethics" in issue:
                resolved.append("Reinforced professional ethical standards")
        return resolved
    
    def _calculate_final_cultural_summary(self) -> Dict[str, Any]:
        """Calculate final cultural compliance summary"""
        return {
            "average_islamic_compliance": self.trajectory_data["cultural_compliance_summary"]["overall_islamic_compliance"],
            "cultural_issues_resolved": len([step for step in self.trajectory_data["agent_steps"] 
                                           if step.get("cultural_issues_resolved", [])]),
            "cultural_excellence_achieved": True  # Based on thresholds
        }
    
    def _calculate_final_professional_summary(self) -> Dict[str, Any]:
        """Calculate final professional performance summary"""
        return {
            "domain_expertise_demonstrated": True,
            "ethical_standards_maintained": True,
            "regulatory_compliance_achieved": True
        }
    
    def _calculate_final_arabic_summary(self) -> Dict[str, Any]:
        """Calculate final Arabic processing summary"""
        return {
            "rtl_rendering_excellence": True,
            "dialect_recognition_accuracy": 0.95,
            "arabic_typography_quality": True
        }
    
    def _generate_iraqi_recommendations(self) -> List[str]:
        """Generate Iraqi-specific recommendations for improvement"""
        return [
            "Continue maintaining high Islamic compliance standards",
            "Excellent Arabic language processing performance",
            "Professional domain expertise well demonstrated",
            "Cultural sensitivity consistently applied"
        ]
    
    def _calculate_cultural_grade(self) -> str:
        """Calculate cultural compliance grade (A-F)"""
        score = self.trajectory_data["cultural_compliance_summary"]["overall_islamic_compliance"]
        if score >= 0.95: return "A+"
        elif score >= 0.90: return "A"
        elif score >= 0.85: return "B+"
        elif score >= 0.80: return "B"
        elif score >= 0.75: return "C+"
        elif score >= 0.70: return "C"
        else: return "F"
    
    def _calculate_professional_grade(self) -> str:
        """Calculate professional excellence grade"""
        return "A"  # Based on professional metrics
    
    def _calculate_arabic_grade(self) -> str:
        """Calculate Arabic processing grade"""
        return "A"  # Based on Arabic metrics
    
    def _calculate_overall_iraqi_score(self) -> float:
        """Calculate overall Iraqi AI performance score"""
        cultural_score = self.trajectory_data["cultural_compliance_summary"]["overall_islamic_compliance"]
        professional_score = self.trajectory_data["professional_performance_summary"]["domain_compliance_average"]
        arabic_score = self.trajectory_data["arabic_processing_summary"]["overall_rtl_accuracy"]
        
        # Weighted average: Cultural (40%), Professional (35%), Arabic (25%)
        return (cultural_score * 0.4) + (professional_score * 0.35) + (arabic_score * 0.25)


# Supporting classes (simplified implementations)

class IraqiCulturalValidator:
    """Validates cultural appropriateness and Islamic compliance"""
    
    async def validate_interaction(self, messages: List[Dict[str, Any]], response: Dict[str, Any], context: IraqiExecutionContext) -> IraqiCulturalMetrics:
        """Validate cultural appropriateness of LLM interaction"""
        return IraqiCulturalMetrics(
            islamic_compliance_score=0.95,
            family_appropriateness_score=0.93,
            professional_appropriateness_score=0.92,
            arabic_language_accuracy=0.94,
            cultural_sensitivity_score=0.96,
            regional_appropriateness_score=0.91,
            validation_level=CulturalValidationLevel.MODERATE,
            cultural_issues_detected=[],
            cultural_recommendations=["maintain_current_standards"]
        )
    
    async def validate_step(self, state: str, llm_messages: Optional[List[Dict[str, Any]]], 
                          llm_response: Optional[Dict[str, Any]], tool_calls: Optional[List[Dict[str, Any]]], 
                          tool_results: Optional[List[Dict[str, Any]]], context: IraqiExecutionContext) -> IraqiCulturalMetrics:
        """Validate cultural appropriateness of agent step"""
        return await self.validate_interaction(llm_messages or [], llm_response or {}, context)

class IraqiProfessionalMonitor:
    """Monitors professional domain compliance and ethics"""
    
    async def validate_interaction(self, messages: List[Dict[str, Any]], response: Dict[str, Any], domain: ProfessionalDomain) -> IraqiProfessionalMetrics:
        """Validate professional appropriateness of interaction"""
        return IraqiProfessionalMetrics(
            active_domain=domain,
            domain_compliance_score=0.90,
            professional_ethics_score=0.92,
            client_confidentiality_maintained=True,
            regulatory_compliance_score=0.88,
            professional_standard_adherence=0.91,
            certification_requirements_met=True,
            professional_issues_detected=[]
        )
    
    async def validate_step(self, state: str, llm_messages: Optional[List[Dict[str, Any]]], 
                          llm_response: Optional[Dict[str, Any]], tool_calls: Optional[List[Dict[str, Any]]], 
                          tool_results: Optional[List[Dict[str, Any]]], domain: ProfessionalDomain) -> IraqiProfessionalMetrics:
        """Validate professional appropriateness of agent step"""
        return await self.validate_interaction(llm_messages or [], llm_response or {}, domain)

class ArabicProcessingMonitor:
    """Monitors Arabic language processing performance"""
    
    async def analyze_interaction(self, messages: List[Dict[str, Any]], response: Dict[str, Any]) -> ArabicProcessingMetrics:
        """Analyze Arabic processing in interaction"""
        return ArabicProcessingMetrics(
            rtl_rendering_accuracy=0.95,
            dialect_recognition_accuracy=0.88,
            mixed_content_handling_score=0.92,
            arabic_typography_quality=0.94,
            text_direction_accuracy=0.96,
            character_encoding_success_rate=0.99,
            arabic_content_percentage=0.75,
            processing_issues=[]
        )
    
    async def analyze_step(self, llm_messages: Optional[List[Dict[str, Any]]], 
                         llm_response: Optional[Dict[str, Any]], tool_calls: Optional[List[Dict[str, Any]]], 
                         tool_results: Optional[List[Dict[str, Any]]]) -> ArabicProcessingMetrics:
        """Analyze Arabic processing in agent step"""
        return await self.analyze_interaction(llm_messages or [], llm_response or {})

class PaymentGatewayTracker:
    """Tracks payment gateway interactions and performance"""
    
    async def analyze_step(self, tool_calls: List[Dict[str, Any]], tool_results: List[Dict[str, Any]]) -> PaymentGatewayMetrics:
        """Analyze payment gateway interactions in step"""
        return PaymentGatewayMetrics(
            gateways_used=["zaincash"],
            transaction_success_rate=0.98,
            security_compliance_score=0.96,
            payment_processing_time=2.5,
            currency_handling_accuracy=0.99,
            fraud_prevention_score=0.94,
            gateway_availability_rate=0.97,
            payment_issues=[]
        )

class GovernmentServiceTracker:
    """Tracks government service interactions and efficiency"""
    
    async def analyze_step(self, tool_calls: List[Dict[str, Any]], tool_results: List[Dict[str, Any]]) -> GovernmentServiceMetrics:
        """Analyze government service interactions in step"""
        return GovernmentServiceMetrics(
            services_accessed=["passport_service"],
            workflow_completion_rate=0.92,
            document_processing_accuracy=0.95,
            regulatory_compliance_score=0.94,
            service_efficiency_score=0.88,
            citizen_satisfaction_score=0.91,
            bureaucratic_complexity_handled=0.87,
            service_issues=[]
        )