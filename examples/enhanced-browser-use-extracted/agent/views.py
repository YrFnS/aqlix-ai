"""
Enhanced Browser-Use Agent Views - Iraqi AI Integration
Data models and views combining browser-use infrastructure with Iraqi customizations
"""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Generic, Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator
from typing_extensions import TypeVar
from uuid_extensions import uuid7str

# Core browser-use infrastructure (EXTRACTED)
from ..browser.views import BrowserStateHistory
from ..controller.registry.views import ActionModel
from ..dom.views import DOMInteractedElement
from ..filesystem.file_system import FileSystemState
from ..llm.base import BaseChatModel
from ..tokens.views import UsageSummary

# Iraqi cultural integration (PRESERVED + ENHANCED)
from ..cultural.processing.views import (
    CulturalValidationResult,
    IslamicComplianceResult,
    ArabicTextMetadata
)

# Message management (EXTRACTED)
from .message_manager.views import MessageManagerState


class AgentSettings(BaseModel):
    """Enhanced Agent configuration with Iraqi settings"""
    
    # Core browser-use settings (EXTRACTED)
    use_vision: bool = True
    vision_detail_level: Literal['auto', 'low', 'high'] = 'auto'
    save_conversation_path: str | Path | None = None
    save_conversation_path_encoding: str | None = 'utf-8'
    max_failures: int = 3
    retry_delay: int = 10
    validate_output: bool = False
    generate_gif: bool | str = False
    override_system_message: str | None = None
    extend_system_message: str | None = None
    max_actions_per_step: int = 10
    use_thinking: bool = True
    flash_mode: bool = False
    max_history_items: int | None = None
    calculate_cost: bool = False
    include_tool_call_examples: bool = False
    llm_timeout: int = 90
    step_timeout: int = 120
    
    # Iraqi-specific settings (NEW)
    cultural_compliance: bool = True
    islamic_values_compliance: bool = True
    arabic_processing: bool = True
    iraqi_portal_mode: bool = False
    government_portal_type: str | None = None
    use_intelligent_routing: bool = True
    cost_optimization: bool = True
    
    # Arabic processing settings
    rtl_layout_support: bool = True
    dialect_recognition: bool = True
    mixed_content_handling: bool = True
    
    # Cultural validation settings
    cultural_validation_threshold: float = 0.95
    islamic_compliance_threshold: float = 0.90
    
    # Performance settings
    cultural_validation_timeout: int = 5
    arabic_processing_timeout: int = 3


class AgentState(BaseModel):
    """Core Agent state from browser-use (EXTRACTED)"""
    
    agent_id: str = Field(default_factory=uuid7str)
    n_steps: int = 1
    consecutive_failures: int = 0
    last_result: list[ActionResult] | None = None
    last_plan: str | None = None
    last_model_output: AgentOutput | None = None
    paused: bool = False
    stopped: bool = False
    session_initialized: bool = False
    follow_up_task: bool = False
    
    message_manager_state: MessageManagerState = Field(default_factory=MessageManagerState)
    file_system_state: FileSystemState | None = None


class IraqiAgentState(AgentState):
    """Enhanced Agent state with Iraqi cultural tracking"""
    
    # Cultural compliance state
    cultural_compliance_enabled: bool = True
    islamic_values_enabled: bool = True
    arabic_processing_enabled: bool = True
    portal_mode: bool = False
    
    # Cultural validation tracking
    cultural_compliance_score: float = 1.0
    islamic_compliance_score: float = 1.0
    cultural_violations: list[str] = Field(default_factory=list)
    
    # Arabic processing state
    arabic_text_detected: bool = False
    rtl_layout_active: bool = False
    dialect_detected: str | None = None
    
    # Portal automation state
    current_portal_type: str | None = None
    portal_session_id: str | None = None
    government_service_type: str | None = None
    
    # Performance metrics
    cultural_validation_time: float = 0.0
    arabic_processing_time: float = 0.0
    llm_routing_decisions: int = 0


class AgentBrain(BaseModel):
    """Agent cognitive state (EXTRACTED from browser-use)"""
    
    thinking: str | None = None
    evaluation_previous_goal: str
    memory: str
    next_goal: str


class IraqiAgentBrain(AgentBrain):
    """Enhanced Agent brain with cultural awareness"""
    
    # Cultural reasoning
    cultural_assessment: str | None = None
    islamic_values_consideration: str | None = None
    
    # Arabic language processing
    language_detection: str | None = None
    rtl_layout_planning: str | None = None
    
    # Portal navigation planning
    portal_navigation_strategy: str | None = None
    government_workflow_progress: str | None = None


class ActionResult(BaseModel):
    """Result of an executed action (EXTRACTED)"""
    
    action_type: str
    success: bool
    error_message: str | None = None
    extracted_content: str | None = None
    screenshot_path: str | None = None
    
    # Timing information
    execution_time: float = 0.0
    
    @model_validator(mode='after')
    def validate_success(self):
        """Ensure error_message is provided when success=False"""
        if not self.success and not self.error_message:
            self.error_message = "Action failed without specific error message"
        return self


class IraqiActionResult(ActionResult):
    """Enhanced action result with cultural validation"""
    
    # Cultural validation results
    cultural_validation_result: CulturalValidationResult | None = None
    islamic_compliance_result: IslamicComplianceResult | None = None
    
    # Arabic processing results
    arabic_text_metadata: ArabicTextMetadata | None = None
    rtl_processing_applied: bool = False
    
    # Portal automation results
    portal_interaction_type: str | None = None
    government_form_detected: bool = False
    ministry_workflow_step: str | None = None
    
    # Performance metrics
    cultural_validation_time: float = 0.0
    arabic_processing_time: float = 0.0


class AgentOutput(BaseModel):
    """Core Agent output structure (EXTRACTED from browser-use)"""
    
    model_config = ConfigDict(arbitrary_types_allowed=True, extra='forbid')
    
    thinking: str | None = None
    evaluation_previous_goal: str | None = None
    memory: str | None = None
    next_goal: str | None = None
    action: list[ActionModel] = Field(
        ...,
        description='List of actions to execute',
        json_schema_extra={'min_items': 1}
    )
    
    @classmethod
    def model_json_schema(cls, **kwargs):
        schema = super().model_json_schema(**kwargs)
        schema['required'] = ['evaluation_previous_goal', 'memory', 'next_goal', 'action']
        return schema
    
    @property
    def current_state(self) -> AgentBrain:
        """For backward compatibility - returns AgentBrain with flattened properties"""
        return AgentBrain(
            thinking=self.thinking,
            evaluation_previous_goal=self.evaluation_previous_goal if self.evaluation_previous_goal else '',
            memory=self.memory if self.memory else '',
            next_goal=self.next_goal if self.next_goal else '',
        )


class IraqiAgentOutput(AgentOutput):
    """Enhanced Agent output with Iraqi cultural intelligence"""
    
    # Cultural reasoning fields
    cultural_assessment: str | None = None
    islamic_values_consideration: str | None = None
    
    # Arabic language fields
    language_detection: str | None = None
    arabic_content_handling: str | None = None
    rtl_layout_planning: str | None = None
    
    # Portal automation fields
    portal_navigation_strategy: str | None = None
    government_workflow_status: str | None = None
    ministry_compliance_notes: str | None = None
    
    # Enhanced state property
    @property
    def current_state(self) -> IraqiAgentBrain:
        """Returns enhanced AgentBrain with cultural fields"""
        return IraqiAgentBrain(
            thinking=self.thinking,
            evaluation_previous_goal=self.evaluation_previous_goal if self.evaluation_previous_goal else '',
            memory=self.memory if self.memory else '',
            next_goal=self.next_goal if self.next_goal else '',
            cultural_assessment=self.cultural_assessment,
            islamic_values_consideration=self.islamic_values_consideration,
            language_detection=self.language_detection,
            rtl_layout_planning=self.rtl_layout_planning,
            portal_navigation_strategy=self.portal_navigation_strategy,
            government_workflow_progress=self.government_workflow_status
        )
    
    @classmethod
    def model_json_schema(cls, **kwargs):
        schema = super().model_json_schema(**kwargs)
        # Add Iraqi-specific required fields for cultural context
        schema['required'].extend([
            'cultural_assessment',
            'islamic_values_consideration'
        ])
        return schema


class StepMetadata(BaseModel):
    """Metadata for a single step (EXTRACTED)"""
    
    step_start_time: float
    step_end_time: float
    step_number: int
    
    @property
    def duration_seconds(self) -> float:
        """Calculate step duration in seconds"""
        return self.step_end_time - self.step_start_time


class IraqiStepMetadata(StepMetadata):
    """Enhanced step metadata with cultural performance tracking"""
    
    # Cultural processing metrics
    cultural_validation_duration: float = 0.0
    islamic_compliance_duration: float = 0.0
    arabic_processing_duration: float = 0.0
    
    # Portal automation metrics
    portal_interaction_duration: float = 0.0
    government_form_processing_duration: float = 0.0
    
    # LLM routing metrics
    llm_provider_used: str | None = None
    llm_routing_decision_time: float = 0.0
    token_cost_optimization: float = 0.0
    
    # Quality metrics
    cultural_compliance_score: float = 1.0
    islamic_values_score: float = 1.0
    arabic_processing_accuracy: float = 1.0


class AgentStepInfo(BaseModel):
    """Agent step information (EXTRACTED)"""
    
    step_start_time: float
    step_end_time: float  
    step_number: int
    
    @property
    def duration_seconds(self) -> float:
        return self.step_end_time - self.step_start_time


class AgentHistory(BaseModel):
    """History item for agent actions (EXTRACTED + ENHANCED)"""
    
    model_output: AgentOutput | IraqiAgentOutput | None
    result: list[ActionResult] = Field(default_factory=list)
    browser_state_history: BrowserStateHistory | None = None
    step_metadata: StepMetadata | IraqiStepMetadata | None = None
    
    # Error tracking
    error: str | None = None
    
    # Iraqi-specific tracking
    cultural_validation_result: CulturalValidationResult | None = None
    arabic_processing_results: list[ArabicTextMetadata] = Field(default_factory=list)
    portal_automation_context: dict[str, Any] | None = None


class AgentHistoryList(BaseModel):
    """List of agent history items with summary (EXTRACTED + ENHANCED)"""
    
    steps: list[AgentHistory] = Field(default_factory=list)
    
    # Execution summary
    total_steps: int = 0
    total_duration: float = 0.0
    success: bool = False
    
    # Iraqi-specific summary
    cultural_compliance_average: float = 1.0
    islamic_values_compliance_average: float = 1.0
    arabic_processing_accuracy_average: float = 1.0
    
    # Cost tracking
    total_token_cost: float = 0.0
    llm_provider_usage: dict[str, int] = Field(default_factory=dict)
    
    @property
    def step_count(self) -> int:
        """Number of steps executed"""
        return len(self.steps)
    
    @property
    def failed_steps(self) -> int:
        """Number of failed steps"""
        return sum(1 for step in self.steps if step.error or not self._step_successful(step))
    
    @property
    def success_rate(self) -> float:
        """Success rate as percentage"""
        if not self.steps:
            return 0.0
        return ((self.step_count - self.failed_steps) / self.step_count) * 100
    
    def _step_successful(self, step: AgentHistory) -> bool:
        """Check if a step was successful"""
        if step.error:
            return False
        
        if not step.result:
            return False
        
        return all(result.success for result in step.result)
    
    def get_cultural_compliance_report(self) -> dict[str, Any]:
        """Generate cultural compliance report"""
        if not self.steps:
            return {"error": "No steps to analyze"}
        
        cultural_scores = []
        islamic_scores = []
        violations = []
        
        for step in self.steps:
            if step.cultural_validation_result:
                cultural_scores.append(step.cultural_validation_result.compliance_score)
                islamic_scores.append(step.cultural_validation_result.islamic_compliance_score)
                if step.cultural_validation_result.violations:
                    violations.extend(step.cultural_validation_result.violations)
        
        return {
            "average_cultural_compliance": sum(cultural_scores) / len(cultural_scores) if cultural_scores else 1.0,
            "average_islamic_compliance": sum(islamic_scores) / len(islamic_scores) if islamic_scores else 1.0,
            "total_violations": len(violations),
            "violation_details": violations,
            "steps_analyzed": len([s for s in self.steps if s.cultural_validation_result])
        }


class CulturalValidationResult(BaseModel):
    """Result of cultural validation check"""
    
    is_valid: bool
    compliance_score: float = Field(ge=0.0, le=1.0)
    islamic_compliance_score: float = Field(ge=0.0, le=1.0)
    
    reason: str | None = None
    violations: list[str] = Field(default_factory=list)
    recommendations: list[str] = Field(default_factory=list)
    
    # Processing metadata
    validation_time: float = 0.0
    validator_version: str = "1.0.0"


class IraqiAgentError(BaseModel):
    """Iraqi agent specific error information"""
    
    error_type: Literal[
        'cultural_violation',
        'islamic_non_compliance', 
        'arabic_processing_error',
        'portal_navigation_error',
        'llm_routing_error'
    ]
    error_message: str
    error_context: dict[str, Any] | None = None
    
    # Recovery suggestions
    recovery_actions: list[str] = Field(default_factory=list)
    retry_recommended: bool = True
    
    # Timing
    timestamp: float = Field(default_factory=lambda: __import__('time').time())


# Export main types for easy import
__all__ = [
    'AgentSettings',
    'AgentState', 
    'IraqiAgentState',
    'AgentBrain',
    'IraqiAgentBrain',
    'AgentOutput',
    'IraqiAgentOutput', 
    'ActionResult',
    'IraqiActionResult',
    'StepMetadata',
    'IraqiStepMetadata',
    'AgentStepInfo',
    'AgentHistory',
    'AgentHistoryList',
    'CulturalValidationResult',
    'IraqiAgentError'
]