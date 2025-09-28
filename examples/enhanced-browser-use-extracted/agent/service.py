"""
Enhanced Browser-Use Agent - Iraqi AI Integration
Hybrid agent combining browser-use advanced infrastructure with Iraqi portal expertise
"""

import asyncio
import logging
import time
from collections.abc import Awaitable, Callable
from datetime import datetime
from pathlib import Path
from typing import Any, Generic, Literal, TypeVar
from urllib.parse import urlparse

from pydantic import ValidationError
from uuid_extensions import uuid7str

# Core browser-use infrastructure (EXTRACTED)
from .views import (
    AgentState,
    AgentOutput,
    AgentHistory,
    AgentHistoryList,
    AgentSettings,
    AgentStepInfo,
    AgentBrain,
    IraqiAgentState,
    CulturalValidationResult,
)
from .message_manager.service import MessageManager
from .message_manager.views import MessageManagerState

# Iraqi cultural integration (PRESERVED + ENHANCED)
from ..cultural.processing.cultural_validator import CulturalValidator
from ..cultural.processing.arabic_processor import ArabicProcessor
from ..cultural.agents.iraqi_portal_agent import IraqiPortalAgent
from ..cultural.monitoring.cultural_compliance_monitor import CulturalComplianceMonitor

# Multi-LLM system (EXTRACTED + ENHANCED)
from ..llm.base import BaseChatModel
from ..llm.providers.router import IraqiLLMRouter
from ..llm.messages import BaseMessage, UserMessage

# Browser control (EXTRACTED)
from ..browser.session import BrowserSession
from ..browser.views import BrowserProfile, BrowserStateSummary

# Enhanced monitoring (EXTRACTED + INTEGRATED)
from ..browser.watchdogs.cultural_watchdog import CulturalWatchdog
from .telemetry.service import IraqiTelemetryService

logger = logging.getLogger(__name__)

Context = TypeVar("Context")
AgentStructuredOutput = TypeVar("AgentStructuredOutput")
AgentHookFunc = Callable[["IraqiEnhancedAgent"], Awaitable[None]]


class IraqiEnhancedAgent(Generic[Context, AgentStructuredOutput]):
    """
    Enhanced browser-use Agent with Iraqi portal expertise

    Combines advanced event-driven architecture from browser-use with
    Iraqi cultural validation, Arabic processing, and government portal automation.

    Key Features:
    - Event-driven architecture with thinking/memory/evaluation
    - Cultural validation pipeline with Islamic compliance
    - Arabic RTL text processing and dialect recognition
    - Iraqi government portal automation
    - Multi-LLM routing for cost optimization
    - Production monitoring with cultural compliance tracking
    """

    browser_session: BrowserSession | None = None
    _logger: logging.Logger | None = None

    def __init__(
        self,
        task: str,
        llm: BaseChatModel | None = None,
        # Browser configuration
        browser_profile: BrowserProfile | None = None,
        browser_session: BrowserSession | None = None,
        # Iraqi-specific configuration
        cultural_compliance: bool = True,
        islamic_values_compliance: bool = True,
        arabic_processing: bool = True,
        iraqi_portal_mode: bool = False,
        government_portal_type: str | None = None,
        # LLM routing configuration
        use_intelligent_routing: bool = True,
        cost_optimization: bool = True,
        # Agent settings
        use_thinking: bool = True,
        use_vision: bool = True,
        max_failures: int = 3,
        retry_delay: int = 10,
        # Callbacks
        register_new_step_callback: (
            Callable[[BrowserStateSummary, AgentOutput, int], None]
            | Callable[[BrowserStateSummary, AgentOutput, int], Awaitable[None]]
            | None
        ) = None,
        register_done_callback: (
            Callable[[AgentHistoryList], Awaitable[None]]
            | Callable[[AgentHistoryList], None]
            | None
        ) = None,
        # Advanced settings
        max_actions_per_step: int = 10,
        step_timeout: int = 120,
        llm_timeout: int = 90,
        **kwargs,
    ):
        """Initialize Enhanced Iraqi Agent"""

        # Core agent configuration
        self.id = kwargs.get("task_id", uuid7str())
        self.task = task

        # LLM routing setup (Iraqi optimization)
        if use_intelligent_routing:
            self.llm_router = IraqiLLMRouter(
                cost_optimization=cost_optimization,
                cultural_context=cultural_compliance,
            )
            self.llm = self.llm_router.get_optimal_provider(task, llm)
        else:
            self.llm = llm or self._get_default_llm()

        # Iraqi cultural components (PRESERVED + ENHANCED)
        self.cultural_compliance = cultural_compliance
        self.islamic_values_compliance = islamic_values_compliance
        self.arabic_processing = arabic_processing

        if cultural_compliance:
            self.cultural_validator = CulturalValidator(
                islamic_compliance=islamic_values_compliance
            )

        if arabic_processing:
            self.arabic_processor = ArabicProcessor()

        if iraqi_portal_mode:
            self.portal_agent = IraqiPortalAgent(portal_type=government_portal_type)

        # Enhanced monitoring (INTEGRATED)
        self.cultural_watchdog = CulturalWatchdog() if cultural_compliance else None
        self.telemetry_service = IraqiTelemetryService(
            cultural_monitoring=cultural_compliance
        )

        # Browser session management
        self.browser_session = browser_session
        self.browser_profile = browser_profile

        # Agent state management (EXTRACTED from browser-use)
        self.agent_state = IraqiAgentState(
            agent_id=self.id,
            cultural_compliance_enabled=cultural_compliance,
            islamic_values_enabled=islamic_values_compliance,
            arabic_processing_enabled=arabic_processing,
            portal_mode=iraqi_portal_mode,
        )

        # Message management (EXTRACTED)
        self.message_manager = MessageManager()

        # Settings (EXTRACTED + ENHANCED)
        self.settings = AgentSettings(
            use_thinking=use_thinking,
            use_vision=use_vision,
            max_failures=max_failures,
            retry_delay=retry_delay,
            max_actions_per_step=max_actions_per_step,
            step_timeout=step_timeout,
            llm_timeout=llm_timeout,
            **kwargs,
        )

        # Callbacks
        self.register_new_step_callback = register_new_step_callback
        self.register_done_callback = register_done_callback

        # Initialize logger
        self._logger = logger.getChild(self.id[:8])

    def _get_default_llm(self) -> BaseChatModel:
        """Get default LLM provider for Iraqi context"""
        try:
            from ..llm.providers.anthropic import AnthropicProvider

            return AnthropicProvider(model="claude-3-sonnet-20240229")
        except ImportError:
            from ..llm.providers.openai import OpenAIProvider

            return OpenAIProvider(model="gpt-4-1106-preview")

    async def run(self, max_steps: int | None = None) -> AgentHistoryList:
        """
        Main agent execution loop with Iraqi cultural integration

        Args:
            max_steps: Maximum number of steps to execute

        Returns:
            Complete agent history with cultural compliance metrics
        """
        start_time = time.time()
        step_count = 0
        history = AgentHistoryList(steps=[])

        self._logger.info(f"🚀 Starting Iraqi Enhanced Agent: {self.task}")

        # Initialize browser session if needed
        if not self.browser_session:
            await self._initialize_browser_session()

        # Cultural pre-validation
        if self.cultural_compliance:
            cultural_validation = await self._validate_task_culturally(self.task)
            if not cultural_validation.is_valid:
                self._logger.error(
                    f"❌ Cultural validation failed: {cultural_validation.reason}"
                )
                return self._create_error_history("Cultural validation failed")

        try:
            while not self.agent_state.stopped and (
                max_steps is None or step_count < max_steps
            ):
                step_count += 1
                self.agent_state.n_steps = step_count

                self._logger.info(f"🔄 Step {step_count}: Executing agent action...")

                # Execute single step with cultural integration
                step_result = await self._execute_step()
                history.steps.append(step_result)

                # Check for completion
                if step_result.model_output and step_result.model_output.current_state:
                    if self._is_task_complete(step_result):
                        self._logger.info("✅ Task completed successfully")
                        break

                # Handle failures
                if self._step_failed(step_result):
                    self.agent_state.consecutive_failures += 1
                    if (
                        self.agent_state.consecutive_failures
                        >= self.settings.max_failures
                    ):
                        self._logger.error("❌ Max failures reached, stopping agent")
                        break
                    await asyncio.sleep(self.settings.retry_delay)
                else:
                    self.agent_state.consecutive_failures = 0

                # Cultural compliance monitoring
                if self.cultural_watchdog:
                    await self.cultural_watchdog.monitor_step(step_result)

        except Exception as e:
            self._logger.error(f"❌ Agent execution failed: {e}")
            history.steps.append(self._create_error_step(str(e)))

        finally:
            # Finalize execution
            execution_time = time.time() - start_time
            await self._finalize_execution(history, execution_time)

        return history

    async def _execute_step(self) -> AgentHistory:
        """Execute a single agent step with cultural integration"""
        step_start = time.time()

        try:
            # Get current browser state
            browser_state = await self._get_browser_state()

            # Generate agent output with LLM
            agent_output = await self._generate_agent_output(browser_state)

            # Cultural validation of actions
            if self.cultural_compliance and agent_output:
                validation_result = await self._validate_actions_culturally(
                    agent_output.action
                )
                if not validation_result.is_valid:
                    return self._create_cultural_error_step(validation_result)

            # Execute actions
            action_results = await self._execute_actions(agent_output.action)

            # Arabic processing if needed
            if self.arabic_processing and agent_output:
                agent_output = await self._enhance_with_arabic_processing(
                    agent_output, action_results
                )

            # Create history step
            step_history = AgentHistory(
                model_output=agent_output,
                result=action_results,
                browser_state_history=browser_state,
                step_metadata=self._create_step_metadata(step_start, time.time()),
            )

            # Telemetry tracking
            await self.telemetry_service.track_agent_step(step_history)

            return step_history

        except Exception as e:
            self._logger.error(f"Step execution failed: {e}")
            return self._create_error_step(str(e))

    async def _validate_task_culturally(self, task: str) -> CulturalValidationResult:
        """Validate task for Iraqi cultural appropriateness"""
        if not self.cultural_compliance:
            return CulturalValidationResult(is_valid=True)

        return await self.cultural_validator.validate_task(
            task=task, islamic_compliance=self.islamic_values_compliance
        )

    async def _validate_actions_culturally(
        self, actions: list
    ) -> CulturalValidationResult:
        """Validate actions for cultural compliance"""
        if not self.cultural_compliance:
            return CulturalValidationResult(is_valid=True)

        return await self.cultural_validator.validate_actions(
            actions=actions, context="agent_execution"
        )

    async def _enhance_with_arabic_processing(
        self, agent_output: AgentOutput, action_results: list
    ) -> AgentOutput:
        """Enhance agent output with Arabic text processing"""
        if not self.arabic_processing:
            return agent_output

        # Process Arabic content in results
        enhanced_results = []
        for result in action_results:
            if hasattr(result, "text") and self.arabic_processor.contains_arabic(
                result.text
            ):
                result.arabic_metadata = await self.arabic_processor.analyze_text(
                    result.text
                )
                result.text = await self.arabic_processor.enhance_rtl_display(
                    result.text
                )
            enhanced_results.append(result)

        return agent_output

    async def _generate_agent_output(
        self, browser_state: BrowserStateSummary
    ) -> AgentOutput:
        """Generate agent output using LLM with Iraqi context"""
        # Create messages for LLM
        messages = await self.message_manager.get_messages(
            agent_state=self.agent_state,
            browser_state=browser_state,
            settings=self.settings,
        )

        # Add Iraqi cultural context if enabled
        if self.cultural_compliance:
            context_message = await self._create_cultural_context_message()
            messages.insert(0, context_message)

        # Route to optimal LLM provider
        if hasattr(self, "llm_router"):
            llm_provider = await self.llm_router.route_request(
                messages=messages, context="agent_execution"
            )
        else:
            llm_provider = self.llm

        # Generate response
        response = await llm_provider.generate(
            messages=messages, timeout=self.settings.llm_timeout
        )

        return self._parse_agent_output(response)

    async def _create_cultural_context_message(self) -> BaseMessage:
        """Create cultural context message for LLM"""
        context = """
        You are operating as an Iraqi AI agent with the following cultural requirements:
        - Respect Islamic values and principles in all actions
        - Use appropriate Arabic/English language mixing based on context
        - Understand Iraqi government portal structures and workflows
        - Maintain cultural sensitivity in all interactions
        - Prioritize user privacy and data protection per Iraqi standards
        """

        if hasattr(self, "portal_agent") and self.portal_agent:
            portal_context = await self.portal_agent.get_cultural_context()
            context += f"\n\nGovernment Portal Context:\n{portal_context}"

        return UserMessage(content=context)

    def _create_step_metadata(
        self, start_time: float, end_time: float
    ) -> AgentStepInfo:
        """Create step metadata"""
        return AgentStepInfo(
            step_start_time=start_time,
            step_end_time=end_time,
            step_number=self.agent_state.n_steps,
        )

    def _is_task_complete(self, step_result: AgentHistory) -> bool:
        """Check if task is complete"""
        if not step_result.model_output:
            return False

        # Check for completion indicators
        output = step_result.model_output
        if hasattr(output, "is_done") and output.is_done:
            return True

        # Check for cultural completion indicators
        if self.cultural_compliance and hasattr(output, "cultural_completion"):
            return output.cultural_completion

        return False

    def _step_failed(self, step_result: AgentHistory) -> bool:
        """Check if step failed"""
        if not step_result.result:
            return True

        # Check for action failures
        for result in step_result.result:
            if hasattr(result, "success") and not result.success:
                return True

        return False

    async def _initialize_browser_session(self):
        """Initialize browser session"""
        # Implementation would initialize browser session
        # This is a placeholder for the extracted browser session logic
        pass

    async def _get_browser_state(self) -> BrowserStateSummary:
        """Get current browser state"""
        # Implementation would extract browser state
        # This is a placeholder for the extracted browser state logic
        return BrowserStateSummary()

    async def _execute_actions(self, actions: list):
        """Execute actions in browser"""
        # Implementation would execute browser actions
        # This is a placeholder for the extracted action execution logic
        return []

    def _parse_agent_output(self, response: str) -> AgentOutput:
        """Parse LLM response into AgentOutput"""
        # Implementation would parse LLM response
        # This is a placeholder for the extracted parsing logic
        return AgentOutput(
            thinking="Parsed thinking",
            evaluation_previous_goal="Evaluation",
            memory="Memory state",
            next_goal="Next goal",
            action=[],
        )

    def _create_error_history(self, error_message: str) -> AgentHistoryList:
        """Create error history"""
        return AgentHistoryList(steps=[self._create_error_step(error_message)])

    def _create_error_step(self, error_message: str) -> AgentHistory:
        """Create error step"""
        return AgentHistory(model_output=None, result=[], error=error_message)

    def _create_cultural_error_step(
        self, validation_result: CulturalValidationResult
    ) -> AgentHistory:
        """Create cultural validation error step"""
        return AgentHistory(
            model_output=None,
            result=[],
            error=f"Cultural validation failed: {validation_result.reason}",
            cultural_validation_result=validation_result,
        )

    async def _finalize_execution(
        self, history: AgentHistoryList, execution_time: float
    ):
        """Finalize agent execution"""
        self._logger.info(
            f"🏁 Agent execution completed in {execution_time:.2f} seconds"
        )

        # Cultural compliance reporting
        if self.cultural_compliance:
            compliance_report = (
                await self.cultural_validator.generate_compliance_report(history)
            )
            self._logger.info(
                f"📊 Cultural compliance: {compliance_report.compliance_percentage:.1f}%"
            )

        # Telemetry finalization
        await self.telemetry_service.finalize_session(history, execution_time)

        # Done callback
        if self.register_done_callback:
            if asyncio.iscoroutinefunction(self.register_done_callback):
                await self.register_done_callback(history)
            else:
                self.register_done_callback(history)


class IraqiAgentFactory:
    """Factory for creating Iraqi Enhanced Agents with common configurations"""

    @staticmethod
    def create_government_portal_agent(
        task: str, portal_type: str, **kwargs
    ) -> IraqiEnhancedAgent:
        """Create agent optimized for Iraqi government portals"""
        return IraqiEnhancedAgent(
            task=task,
            iraqi_portal_mode=True,
            government_portal_type=portal_type,
            cultural_compliance=True,
            islamic_values_compliance=True,
            arabic_processing=True,
            use_intelligent_routing=True,
            cost_optimization=True,
            **kwargs,
        )

    @staticmethod
    def create_cultural_validation_agent(task: str, **kwargs) -> IraqiEnhancedAgent:
        """Create agent with maximum cultural validation"""
        return IraqiEnhancedAgent(
            task=task,
            cultural_compliance=True,
            islamic_values_compliance=True,
            arabic_processing=True,
            use_thinking=True,
            **kwargs,
        )

    @staticmethod
    def create_performance_optimized_agent(task: str, **kwargs) -> IraqiEnhancedAgent:
        """Create agent optimized for performance"""
        return IraqiEnhancedAgent(
            task=task,
            cultural_compliance=False,
            arabic_processing=False,
            use_intelligent_routing=True,
            cost_optimization=True,
            use_thinking=False,
            **kwargs,
        )
