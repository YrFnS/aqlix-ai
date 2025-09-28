"""
Enhanced Message Manager - Iraqi AI Integration
Message management system combining browser-use infrastructure with Iraqi cultural context
"""

from __future__ import annotations

import logging
from typing import Literal

from .views import HistoryItem, MessageManagerState
from ..views import (
    ActionResult,
    IraqiActionResult,
    AgentOutput,
    IraqiAgentOutput,
    AgentStepInfo,
    IraqiAgentState,
)
from ...browser.views import BrowserStateSummary
from ...filesystem.file_system import FileSystem
from ...llm.messages import (
    BaseMessage,
    ContentPartTextParam,
    SystemMessage,
    UserMessage,
    AssistantMessage,
)

# Iraqi cultural integration
from ...cultural.processing.cultural_context import IraqiCulturalContext
from ...cultural.processing.arabic_processor import ArabicProcessor

logger = logging.getLogger(__name__)


class MessageManager:
    """
    Enhanced message manager with Iraqi cultural context integration

    Manages conversation history and context for Iraqi Enhanced Agent,
    including cultural validation prompts, Arabic text handling,
    and government portal context.
    """

    def __init__(
        self,
        cultural_context: bool = True,
        arabic_processing: bool = True,
        portal_context: bool = False,
    ):
        """Initialize enhanced message manager"""
        self.cultural_context_enabled = cultural_context
        self.arabic_processing_enabled = arabic_processing
        self.portal_context_enabled = portal_context

        # Iraqi cultural components
        if cultural_context:
            self.cultural_context = IraqiCulturalContext()

        if arabic_processing:
            self.arabic_processor = ArabicProcessor()

        # Message history management
        self.history: list[HistoryItem] = []
        self.system_messages: list[SystemMessage] = []

        # Context optimization
        self.max_history_tokens = 8000
        self.cultural_context_tokens = 500

        self._logger = logger.getChild("message_manager")

    async def get_messages(
        self,
        agent_state: IraqiAgentState,
        browser_state: BrowserStateSummary,
        settings: dict | None = None,
    ) -> list[BaseMessage]:
        """
        Generate complete message list for LLM with Iraqi cultural integration

        Args:
            agent_state: Current Iraqi agent state
            browser_state: Current browser state
            settings: Agent settings

        Returns:
            Complete message list including cultural context
        """
        messages = []

        # 1. System message with Iraqi cultural context
        system_message = await self._create_enhanced_system_message(
            agent_state, settings
        )
        messages.append(system_message)

        # 2. Cultural context message if enabled
        if self.cultural_context_enabled:
            cultural_message = await self._create_cultural_context_message(agent_state)
            messages.append(cultural_message)

        # 3. Portal context if in portal mode
        if self.portal_context_enabled and agent_state.portal_mode:
            portal_message = await self._create_portal_context_message(agent_state)
            messages.append(portal_message)

        # 4. Browser state context
        browser_message = await self._create_browser_state_message(browser_state)
        messages.append(browser_message)

        # 5. Conversation history (optimized for context length)
        history_messages = await self._get_optimized_history_messages(agent_state)
        messages.extend(history_messages)

        # 6. Current task context
        task_message = await self._create_current_task_message(agent_state)
        messages.append(task_message)

        return messages

    async def add_step_to_history(
        self,
        agent_output: AgentOutput | IraqiAgentOutput,
        action_results: list[ActionResult | IraqiActionResult],
        step_info: AgentStepInfo,
        cultural_validation_result: dict | None = None,
    ):
        """Add completed step to conversation history"""

        # Process Arabic content if present
        processed_results = action_results
        if self.arabic_processing_enabled:
            processed_results = await self._process_arabic_in_results(action_results)

        # Create history item
        history_item = HistoryItem(
            step_number=step_info.step_number,
            agent_output=agent_output,
            action_results=processed_results,
            step_duration=step_info.duration_seconds,
            cultural_validation=cultural_validation_result,
        )

        self.history.append(history_item)

        # Optimize history length for context management
        await self._optimize_history_length()

        self._logger.debug(f"Added step {step_info.step_number} to history")

    async def _create_enhanced_system_message(
        self, agent_state: IraqiAgentState, settings: dict | None
    ) -> SystemMessage:
        """Create system message with Iraqi cultural awareness"""

        base_prompt = """You are an intelligent browser automation agent with specialized expertise in Iraqi government portals and cultural compliance.

Core Capabilities:
- Navigate and interact with web browsers autonomously
- Process Arabic text and RTL layouts correctly
- Maintain Islamic values and cultural appropriateness
- Handle Iraqi government portal workflows
- Provide thinking, memory, and goal evaluation

Response Format:
You must respond with a JSON object containing:
- thinking: Your reasoning process (optional)
- evaluation_previous_goal: Assessment of previous goal completion
- memory: Important information to remember
- next_goal: Your next objective
- action: List of browser actions to execute"""

        # Add Iraqi cultural requirements
        cultural_requirements = ""
        if agent_state.cultural_compliance_enabled:
            cultural_requirements = """

Cultural Requirements:
- Respect Islamic values in all decisions and actions
- Maintain cultural sensitivity appropriate for Iraqi context
- Use respectful Arabic/English language mixing when appropriate
- Consider family values and social norms in Iraqi culture
- Avoid actions that conflict with Islamic principles"""

        # Add Arabic processing instructions
        arabic_instructions = ""
        if agent_state.arabic_processing_enabled:
            arabic_instructions = """

Arabic Text Processing:
- Detect Arabic text and handle RTL layout correctly
- Recognize Iraqi dialect variations when present
- Maintain proper text directionality in mixed content
- Process Arabic form inputs with appropriate encoding"""

        # Add portal-specific instructions
        portal_instructions = ""
        if agent_state.portal_mode:
            portal_instructions = f"""

Government Portal Context:
- You are navigating an Iraqi government portal: {agent_state.current_portal_type or "Unknown"}
- Follow official procedures and workflows
- Handle authentication and security measures appropriately
- Process government forms with accuracy and compliance
- Maintain data privacy and security standards"""

        full_prompt = (
            base_prompt
            + cultural_requirements
            + arabic_instructions
            + portal_instructions
        )

        return SystemMessage(content=full_prompt)

    async def _create_cultural_context_message(
        self, agent_state: IraqiAgentState
    ) -> UserMessage:
        """Create cultural context message for Iraqi awareness"""

        context = await self.cultural_context.get_current_context()

        cultural_prompt = f"""Cultural Context for Iraqi Operations:

Current Time: {context.get("current_time", "Unknown")}
Prayer Times Consideration: {context.get("prayer_times_active", False)}
Cultural Sensitivity Level: {context.get("sensitivity_level", "High")}
Language Context: {context.get("language_context", "Mixed Arabic/English")}

Key Reminders:
- Maintain respect for Islamic values and Iraqi cultural norms
- Consider timing for religious observances if relevant
- Use culturally appropriate language and tone
- Respect privacy and family values in Iraqi context"""

        return UserMessage(content=cultural_prompt)

    async def _create_portal_context_message(
        self, agent_state: IraqiAgentState
    ) -> UserMessage:
        """Create government portal context message"""

        portal_type = agent_state.current_portal_type or "Iraqi Government Portal"
        service_type = agent_state.government_service_type or "General Service"

        portal_prompt = f"""Government Portal Navigation Context:

Portal Type: {portal_type}
Service Type: {service_type}
Session ID: {agent_state.portal_session_id or "Not established"}

Portal-Specific Guidelines:
- Follow official government procedures
- Handle authentication securely
- Process forms with accuracy and completeness
- Maintain audit trail for government compliance
- Respect data privacy and protection requirements
- Use appropriate Arabic/English based on portal language"""

        return UserMessage(content=portal_prompt)

    async def _create_browser_state_message(
        self, browser_state: BrowserStateSummary
    ) -> UserMessage:
        """Create browser state context message"""

        state_info = f"""Current Browser State:

URL: {browser_state.url if hasattr(browser_state, "url") else "Unknown"}
Page Title: {browser_state.title if hasattr(browser_state, "title") else "Unknown"}
Page Load Status: {browser_state.load_status if hasattr(browser_state, "load_status") else "Unknown"}"""

        # Add Arabic content detection if enabled
        if self.arabic_processing_enabled and hasattr(
            browser_state, "has_arabic_content"
        ):
            state_info += (
                f"\nArabic Content Detected: {browser_state.has_arabic_content}"
            )
            if hasattr(browser_state, "rtl_layout_active"):
                state_info += f"\nRTL Layout Active: {browser_state.rtl_layout_active}"

        return UserMessage(content=state_info)

    async def _create_current_task_message(
        self, agent_state: IraqiAgentState
    ) -> UserMessage:
        """Create current task context message"""

        task_context = f"""Current Task Status:

Step Number: {agent_state.n_steps}
Consecutive Failures: {agent_state.consecutive_failures}
Task Paused: {agent_state.paused}"""

        # Add cultural compliance status
        if agent_state.cultural_compliance_enabled:
            task_context += f"""
Cultural Compliance Score: {agent_state.cultural_compliance_score:.2f}
Islamic Values Score: {agent_state.islamic_compliance_score:.2f}"""

        # Add Arabic processing status
        if agent_state.arabic_processing_enabled:
            task_context += f"""
Arabic Content Detected: {agent_state.arabic_text_detected}
RTL Layout Active: {agent_state.rtl_layout_active}
Dialect Detected: {agent_state.dialect_detected or "None"}"""

        return UserMessage(content=task_context)

    async def _get_optimized_history_messages(
        self, agent_state: IraqiAgentState
    ) -> list[BaseMessage]:
        """Get optimized conversation history for context management"""

        if not self.history:
            return []

        messages = []

        # Get recent history items (last 5 steps by default)
        recent_history = self.history[-5:] if len(self.history) > 5 else self.history

        for item in recent_history:
            # Assistant message (agent output)
            if item.agent_output:
                agent_content = await self._format_agent_output_for_history(
                    item.agent_output
                )
                messages.append(AssistantMessage(content=agent_content))

            # User message (action results)
            if item.action_results:
                results_content = await self._format_action_results_for_history(
                    item.action_results
                )
                messages.append(UserMessage(content=results_content))

        return messages

    async def _format_agent_output_for_history(
        self, agent_output: AgentOutput | IraqiAgentOutput
    ) -> str:
        """Format agent output for history context"""

        content_parts = []

        if agent_output.thinking:
            content_parts.append(f"Thinking: {agent_output.thinking}")

        if agent_output.evaluation_previous_goal:
            content_parts.append(f"Evaluation: {agent_output.evaluation_previous_goal}")

        if agent_output.memory:
            content_parts.append(f"Memory: {agent_output.memory}")

        if agent_output.next_goal:
            content_parts.append(f"Next Goal: {agent_output.next_goal}")

        # Add Iraqi-specific fields if present
        if isinstance(agent_output, IraqiAgentOutput):
            if agent_output.cultural_assessment:
                content_parts.append(
                    f"Cultural Assessment: {agent_output.cultural_assessment}"
                )

            if agent_output.language_detection:
                content_parts.append(
                    f"Language Detection: {agent_output.language_detection}"
                )

        # Add actions summary
        if agent_output.action:
            action_summary = f"Actions: {len(agent_output.action)} action(s) planned"
            content_parts.append(action_summary)

        return "\n".join(content_parts)

    async def _format_action_results_for_history(
        self, action_results: list[ActionResult | IraqiActionResult]
    ) -> str:
        """Format action results for history context"""

        if not action_results:
            return "No action results"

        content_parts = []

        for i, result in enumerate(action_results, 1):
            result_summary = f"Action {i}: {result.action_type}"

            if result.success:
                result_summary += " - Success"
                if result.extracted_content:
                    # Truncate long content for context efficiency
                    content_preview = result.extracted_content[:100]
                    if len(result.extracted_content) > 100:
                        content_preview += "..."
                    result_summary += f" (Content: {content_preview})"
            else:
                result_summary += f" - Failed: {result.error_message}"

            # Add cultural validation results if available
            if (
                isinstance(result, IraqiActionResult)
                and result.cultural_validation_result
            ):
                validation = result.cultural_validation_result
                result_summary += (
                    f" (Cultural Score: {validation.compliance_score:.2f})"
                )

            content_parts.append(result_summary)

        return "\n".join(content_parts)

    async def _process_arabic_in_results(
        self, action_results: list[ActionResult | IraqiActionResult]
    ) -> list[ActionResult | IraqiActionResult]:
        """Process Arabic content in action results"""

        processed_results = []

        for result in action_results:
            if hasattr(result, "extracted_content") and result.extracted_content:
                if self.arabic_processor.contains_arabic(result.extracted_content):
                    # Process Arabic text
                    arabic_metadata = await self.arabic_processor.analyze_text(
                        result.extracted_content
                    )

                    # Enhance result with Arabic processing if it's an IraqiActionResult
                    if isinstance(result, IraqiActionResult):
                        result.arabic_text_metadata = arabic_metadata
                        result.rtl_processing_applied = True

            processed_results.append(result)

        return processed_results

    async def _optimize_history_length(self):
        """Optimize history length for context management"""

        # Keep only the most recent 10 items by default
        max_history_items = 10

        if len(self.history) > max_history_items:
            # Keep the most recent items
            self.history = self.history[-max_history_items:]

            self._logger.debug(f"Optimized history to {len(self.history)} items")

    def get_conversation_summary(self) -> dict[str, Any]:
        """Get summary of conversation history"""

        return {
            "total_steps": len(self.history),
            "successful_steps": sum(
                1 for item in self.history if item.was_successful()
            ),
            "failed_steps": sum(
                1 for item in self.history if not item.was_successful()
            ),
            "total_duration": sum(item.step_duration for item in self.history),
            "cultural_compliance_enabled": self.cultural_context_enabled,
            "arabic_processing_enabled": self.arabic_processing_enabled,
            "portal_context_enabled": self.portal_context_enabled,
        }
