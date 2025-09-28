"""
Enhanced Message Manager Views - Iraqi AI Integration
Data models for message management with cultural context
"""

from __future__ import annotations

from typing import Any
from pydantic import BaseModel, Field

from ..views import AgentOutput, IraqiAgentOutput, ActionResult, IraqiActionResult
from ...cultural.processing.views import CulturalValidationResult


class MessageManagerState(BaseModel):
    """State management for message manager (EXTRACTED from browser-use)"""

    total_messages: int = 0
    total_tokens_used: int = 0
    conversation_started: bool = False
    last_message_timestamp: float | None = None


class IraqiMessageManagerState(MessageManagerState):
    """Enhanced message manager state with Iraqi cultural tracking"""

    # Cultural context tracking
    cultural_messages_sent: int = 0
    islamic_compliance_checks: int = 0

    # Arabic processing tracking
    arabic_messages_processed: int = 0
    rtl_layout_messages: int = 0

    # Portal context tracking
    portal_context_active: bool = False
    government_workflow_messages: int = 0


class HistoryItem(BaseModel):
    """Single conversation history item (EXTRACTED + ENHANCED)"""

    step_number: int
    agent_output: AgentOutput | IraqiAgentOutput | None = None
    action_results: list[ActionResult | IraqiActionResult] = Field(default_factory=list)
    step_duration: float = 0.0

    # Iraqi-specific tracking
    cultural_validation: dict[str, Any] | None = None
    arabic_processing_applied: bool = False
    portal_interaction: bool = False

    def was_successful(self) -> bool:
        """Check if the step was successful"""
        if not self.action_results:
            return False
        return all(result.success for result in self.action_results)

    def get_cultural_compliance_score(self) -> float:
        """Get cultural compliance score for this step"""
        if not self.cultural_validation:
            return 1.0

        return self.cultural_validation.get("compliance_score", 1.0)

    def contains_arabic_content(self) -> bool:
        """Check if step contains Arabic content"""
        if not self.action_results:
            return False

        for result in self.action_results:
            if isinstance(result, IraqiActionResult) and result.arabic_text_metadata:
                return True

        return False


class ConversationContext(BaseModel):
    """Context information for conversation management"""

    # Basic context
    session_id: str
    agent_id: str
    task_description: str

    # Iraqi cultural context
    cultural_compliance_required: bool = True
    islamic_values_compliance: bool = True
    arabic_processing_enabled: bool = True

    # Portal context
    portal_mode: bool = False
    portal_type: str | None = None
    government_service_type: str | None = None

    # Performance context
    target_response_time: float = 5.0
    max_tokens_per_message: int = 1000

    # Quality requirements
    minimum_cultural_score: float = 0.95
    minimum_islamic_compliance: float = 0.90


class MessageOptimizationSettings(BaseModel):
    """Settings for message optimization and context management"""

    # History management
    max_history_items: int = 10
    max_total_tokens: int = 8000

    # Cultural context optimization
    cultural_context_tokens: int = 500
    islamic_context_tokens: int = 300

    # Arabic processing optimization
    arabic_processing_tokens: int = 200
    rtl_context_tokens: int = 100

    # Portal context optimization
    portal_context_tokens: int = 400
    government_workflow_tokens: int = 300

    # Compression settings
    enable_message_compression: bool = True
    compression_threshold: int = 6000
    preserve_cultural_context: bool = True


class CulturalMessageContext(BaseModel):
    """Cultural context for message generation"""

    # Islamic considerations
    prayer_time_awareness: bool = True
    ramadan_awareness: bool = False
    friday_prayer_awareness: bool = True

    # Cultural sensitivity
    family_values_context: bool = True
    gender_interaction_guidelines: bool = True
    social_norms_awareness: bool = True

    # Language context
    arabic_english_mixing: bool = True
    formal_language_required: bool = False
    dialect_recognition: bool = True

    # Regional context
    iraqi_cultural_norms: bool = True
    baghdad_context: bool = False
    regional_variations: bool = False


class ArabicProcessingContext(BaseModel):
    """Context for Arabic text processing in messages"""

    # Text processing
    rtl_layout_support: bool = True
    arabic_shaping_enabled: bool = True
    bidi_algorithm_support: bool = True

    # Dialect support
    iraqi_dialect_recognition: bool = True
    standard_arabic_support: bool = True
    mixed_content_handling: bool = True

    # Input/Output handling
    arabic_keyboard_support: bool = True
    arabic_number_processing: bool = True
    calendar_conversion: bool = False


class PortalMessageContext(BaseModel):
    """Context for government portal interactions"""

    # Portal identification
    portal_domain: str | None = None
    portal_type: str | None = None
    ministry_identifier: str | None = None

    # Workflow context
    current_service_type: str | None = None
    workflow_step: str | None = None
    form_type: str | None = None

    # Authentication context
    requires_authentication: bool = False
    multi_factor_enabled: bool = False
    session_timeout_minutes: int = 30

    # Compliance context
    audit_trail_required: bool = True
    data_privacy_level: str = "high"
    encryption_required: bool = True


class MessagePerformanceMetrics(BaseModel):
    """Performance metrics for message processing"""

    # Processing times
    message_generation_time: float = 0.0
    cultural_validation_time: float = 0.0
    arabic_processing_time: float = 0.0

    # Token usage
    total_tokens_used: int = 0
    cultural_context_tokens: int = 0
    arabic_processing_tokens: int = 0

    # Quality metrics
    cultural_compliance_score: float = 1.0
    islamic_values_score: float = 1.0
    arabic_processing_accuracy: float = 1.0

    # Efficiency metrics
    context_compression_ratio: float = 0.0
    message_optimization_savings: int = 0


class EnhancedMessageHistory(BaseModel):
    """Enhanced message history with Iraqi cultural tracking"""

    items: list[HistoryItem] = Field(default_factory=list)

    # Summary metrics
    total_steps: int = 0
    successful_steps: int = 0
    failed_steps: int = 0

    # Cultural metrics
    average_cultural_score: float = 1.0
    average_islamic_score: float = 1.0
    cultural_violations: int = 0

    # Arabic processing metrics
    arabic_content_steps: int = 0
    rtl_processing_accuracy: float = 1.0
    dialect_recognition_accuracy: float = 1.0

    # Portal interaction metrics
    portal_interaction_steps: int = 0
    government_workflow_completions: int = 0

    # Performance metrics
    total_processing_time: float = 0.0
    average_step_time: float = 0.0
    token_efficiency: float = 1.0

    def add_item(self, item: HistoryItem):
        """Add item to history and update metrics"""
        self.items.append(item)
        self.total_steps += 1

        if item.was_successful():
            self.successful_steps += 1
        else:
            self.failed_steps += 1

        # Update cultural metrics
        cultural_score = item.get_cultural_compliance_score()
        self.average_cultural_score = (
            self.average_cultural_score * (self.total_steps - 1) + cultural_score
        ) / self.total_steps

        # Update Arabic processing metrics
        if item.contains_arabic_content():
            self.arabic_content_steps += 1

        # Update portal metrics
        if item.portal_interaction:
            self.portal_interaction_steps += 1

        # Update performance metrics
        self.total_processing_time += item.step_duration
        self.average_step_time = self.total_processing_time / self.total_steps

    def get_recent_items(self, count: int = 5) -> list[HistoryItem]:
        """Get most recent history items"""
        return self.items[-count:] if len(self.items) > count else self.items

    def get_cultural_summary(self) -> dict[str, Any]:
        """Get summary of cultural compliance"""
        return {
            "average_cultural_score": self.average_cultural_score,
            "average_islamic_score": self.average_islamic_score,
            "cultural_violations": self.cultural_violations,
            "steps_with_arabic": self.arabic_content_steps,
            "portal_interactions": self.portal_interaction_steps,
            "overall_compliance": "High"
            if self.average_cultural_score > 0.95
            else "Medium",
        }


# Export main types
__all__ = [
    "MessageManagerState",
    "IraqiMessageManagerState",
    "HistoryItem",
    "ConversationContext",
    "MessageOptimizationSettings",
    "CulturalMessageContext",
    "ArabicProcessingContext",
    "PortalMessageContext",
    "MessagePerformanceMetrics",
    "EnhancedMessageHistory",
]
