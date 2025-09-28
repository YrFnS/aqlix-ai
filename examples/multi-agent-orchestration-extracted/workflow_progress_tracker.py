"""
Iraqi AI Workflow Progress Tracker with Real-Time Monitoring

Revolutionary workflow progress tracking system designed for multi-agent orchestration
with cultural intelligence, real-time monitoring, and Iraqi professional standards.

Features:
- Real-Time Progress Monitoring: Live workflow status tracking with WebSocket support
- Cultural Compliance Tracking: Islamic compliance and cultural appropriateness monitoring
- Multi-Agent Coordination: Track progress across multiple specialized agents
- Performance Analytics: Comprehensive metrics with cultural context preservation
- Iraqi Professional Standards: Government-grade protocol compliance
- Visual Progress Indicators: Rich progress visualization with Arabic RTL support
- Error Recovery Tracking: Intelligent error handling with cultural context preservation
- Workflow Validation: Continuous validation against Iraqi cultural and Islamic standards

Based on DeepCode progress tracking patterns with Iraqi cultural enhancements.
"""

from typing import Dict, List, Optional, Any, Union, Callable, Set, Tuple
from pydantic import BaseModel, Field
from enum import Enum
import asyncio
import logging
import json
import time
from datetime import datetime, timezone, timedelta
from dataclasses import dataclass, field
from pathlib import Path
import uuid
import threading
from concurrent.futures import ThreadPoolExecutor
import websockets
import weakref


class WorkflowStatus(str, Enum):
    """Workflow execution status"""

    PENDING = "pending"  # Workflow queued for execution
    INITIALIZING = "initializing"  # Setting up workflow environment
    RUNNING = "running"  # Actively executing workflow phases
    VALIDATING = "validating"  # Performing cultural/Islamic validation
    PAUSED = "paused"  # Paused by user or system
    RESUMING = "resuming"  # Resuming from pause
    COMPLETING = "completing"  # Finalizing workflow execution
    COMPLETED = "completed"  # Successfully completed
    FAILED = "failed"  # Failed with errors
    CANCELLED = "cancelled"  # Cancelled by user
    TIMEOUT = "timeout"  # Exceeded time limits


class PhaseStatus(str, Enum):
    """Individual phase status"""

    NOT_STARTED = "not_started"
    PREPARING = "preparing"
    EXECUTING = "executing"
    VALIDATING = "validating"
    COMPLETED = "completed"
    FAILED = "failed"
    SKIPPED = "skipped"
    BLOCKED = "blocked"


class CulturalValidationStatus(str, Enum):
    """Cultural validation status"""

    NOT_VALIDATED = "not_validated"
    VALIDATING = "validating"
    PASSED = "passed"
    FAILED = "failed"
    REQUIRES_REVIEW = "requires_review"


class ProgressUpdateType(str, Enum):
    """Types of progress updates"""

    PHASE_START = "phase_start"
    PHASE_PROGRESS = "phase_progress"
    PHASE_COMPLETE = "phase_complete"
    CULTURAL_VALIDATION = "cultural_validation"
    AGENT_STATUS = "agent_status"
    ERROR_OCCURRED = "error_occurred"
    USER_FEEDBACK = "user_feedback"
    WORKFLOW_COMPLETE = "workflow_complete"


class NotificationPriority(str, Enum):
    """Notification priority levels"""

    LOW = "low"  # General information
    NORMAL = "normal"  # Standard progress updates
    HIGH = "high"  # Important milestones
    CRITICAL = "critical"  # Errors, cultural violations
    URGENT = "urgent"  # Immediate attention required


@dataclass
class CulturalValidationResult:
    """Cultural validation result"""

    validation_id: str
    phase_name: str
    cultural_score: float  # 0-100 cultural appropriateness score
    islamic_compliance_score: float  # 0-100 Islamic compliance score
    issues_found: List[str] = field(default_factory=list)
    recommendations: List[str] = field(default_factory=list)
    validation_timestamp: datetime = field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    validator_agent: str = ""
    requires_human_review: bool = False


@dataclass
class AgentProgress:
    """Individual agent progress tracking"""

    agent_id: str
    agent_name: str
    current_task: str
    progress_percentage: float  # 0-100 completion percentage
    status: PhaseStatus
    cultural_validation: CulturalValidationStatus
    start_time: datetime
    estimated_completion: Optional[datetime] = None
    last_update: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    error_message: Optional[str] = None
    performance_metrics: Dict[str, Any] = field(default_factory=dict)


@dataclass
class WorkflowPhaseProgress:
    """Workflow phase progress tracking"""

    phase_id: str
    phase_name: str
    phase_description: str
    status: PhaseStatus
    progress_percentage: float  # 0-100 completion percentage
    cultural_validation: CulturalValidationResult
    agents_involved: List[AgentProgress] = field(default_factory=list)
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    estimated_duration_ms: int = 0
    actual_duration_ms: int = 0
    sub_tasks: List[str] = field(default_factory=list)
    completed_sub_tasks: List[str] = field(default_factory=list)
    error_messages: List[str] = field(default_factory=list)
    cultural_checkpoints: List[CulturalValidationResult] = field(default_factory=list)


class ProgressNotification(BaseModel):
    """Progress notification message"""

    notification_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    workflow_id: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    update_type: ProgressUpdateType
    priority: NotificationPriority = NotificationPriority.NORMAL

    # Content
    title: str
    message: str
    phase_name: Optional[str] = None
    agent_name: Optional[str] = None
    progress_percentage: float = 0.0

    # Cultural context
    cultural_importance: float = 0.0  # 0-100 cultural importance of this update
    islamic_compliance_note: Optional[str] = None
    requires_user_attention: bool = False

    # Additional data
    metadata: Dict[str, Any] = Field(default_factory=dict)
    action_required: Optional[str] = None
    estimated_completion_time: Optional[datetime] = None


class WorkflowProgressState(BaseModel):
    """Complete workflow progress state"""

    workflow_id: str
    workflow_name: str
    workflow_status: WorkflowStatus
    overall_progress_percentage: float = 0.0

    # Timing
    start_time: datetime
    last_update_time: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    estimated_completion_time: Optional[datetime] = None
    actual_completion_time: Optional[datetime] = None

    # Phase tracking
    current_phase: Optional[str] = None
    phases: Dict[str, WorkflowPhaseProgress] = Field(default_factory=dict)
    completed_phases: List[str] = Field(default_factory=list)
    failed_phases: List[str] = Field(default_factory=list)

    # Cultural compliance
    overall_cultural_score: float = 100.0
    overall_islamic_compliance: float = 100.0
    cultural_validations: List[CulturalValidationResult] = Field(default_factory=list)
    cultural_issues_count: int = 0

    # Agent coordination
    active_agents: Dict[str, AgentProgress] = Field(default_factory=dict)
    completed_agents: List[str] = Field(default_factory=list)
    failed_agents: List[str] = Field(default_factory=list)

    # Performance metrics
    total_processing_time_ms: int = 0
    cultural_validation_time_ms: int = 0
    agent_coordination_overhead_ms: int = 0
    performance_score: float = 100.0  # 0-100 performance score

    # User interaction
    user_notifications_sent: int = 0
    user_feedback_requests: int = 0
    user_interventions_required: int = 0


class IraqiWorkflowProgressTracker:
    """
    Revolutionary Iraqi Workflow Progress Tracker

    Advanced real-time workflow monitoring system with cultural intelligence,
    Islamic compliance tracking, and multi-agent coordination capabilities.

    Key Features:
    - Real-Time Monitoring: WebSocket-based live progress updates
    - Cultural Intelligence: Islamic compliance and cultural appropriateness tracking
    - Multi-Agent Coordination: Progress tracking across specialized agents
    - Performance Analytics: Comprehensive metrics with cultural context
    - Visual Progress: Rich progress indicators with Arabic RTL support
    - Error Recovery: Intelligent error handling with cultural preservation
    - Government Standards: Iraqi ministry-grade protocol compliance
    """

    def __init__(
        self,
        enable_websocket_server: bool = True,
        websocket_port: int = 8765,
        cultural_validation_threshold: float = 90.0,
        islamic_compliance_threshold: float = 95.0,
        performance_monitoring_interval: int = 1000,  # milliseconds
        max_concurrent_workflows: int = 10,
    ):
        # Configuration
        self.enable_websocket_server = enable_websocket_server
        self.websocket_port = websocket_port
        self.cultural_validation_threshold = cultural_validation_threshold
        self.islamic_compliance_threshold = islamic_compliance_threshold
        self.performance_monitoring_interval = performance_monitoring_interval
        self.max_concurrent_workflows = max_concurrent_workflows

        # Workflow tracking
        self._active_workflows: Dict[str, WorkflowProgressState] = {}
        self._workflow_history: Dict[str, WorkflowProgressState] = {}
        self._progress_callbacks: Dict[str, List[Callable]] = {}

        # Real-time monitoring
        self._websocket_clients: Set[websockets.WebSocketServerProtocol] = set()
        self._websocket_server = None
        self._monitoring_tasks: Dict[str, asyncio.Task] = {}
        self._notification_queue: asyncio.Queue = asyncio.Queue()

        # Cultural validation
        self._cultural_validators: Dict[str, Callable] = {}
        self._islamic_compliance_validators: Dict[str, Callable] = {}
        self._cultural_validation_cache: Dict[str, CulturalValidationResult] = {}

        # Performance tracking
        self._performance_metrics: Dict[str, Any] = {
            "total_workflows_tracked": 0,
            "average_completion_time_ms": 0,
            "average_cultural_score": 100.0,
            "average_islamic_compliance": 100.0,
            "total_cultural_violations": 0,
            "error_recovery_success_rate": 0.0,
            "real_time_update_latency_ms": 0,
            "websocket_connection_count": 0,
        }

        # Threading
        self._executor = ThreadPoolExecutor(max_workers=5)
        self._lock = threading.RLock()

        # Logging
        self.logger = logging.getLogger(__name__)

        # Initialize monitoring systems
        asyncio.create_task(self._initialize_monitoring_systems())

    async def _initialize_monitoring_systems(self) -> None:
        """Initialize real-time monitoring systems"""
        try:
            # Start WebSocket server if enabled
            if self.enable_websocket_server:
                await self._start_websocket_server()

            # Start notification processing
            asyncio.create_task(self._process_notification_queue())

            # Start performance monitoring
            asyncio.create_task(self._monitor_performance_metrics())

            self.logger.info("Workflow progress tracking systems initialized")

        except Exception as e:
            self.logger.error(f"Error initializing monitoring systems: {e}")

    async def _start_websocket_server(self) -> None:
        """Start WebSocket server for real-time updates"""
        try:

            async def handle_client(websocket, path):
                self._websocket_clients.add(websocket)
                self._performance_metrics["websocket_connection_count"] = len(
                    self._websocket_clients
                )

                try:
                    self.logger.info(
                        f"WebSocket client connected: {websocket.remote_address}"
                    )

                    # Send current workflow states to new client
                    for workflow_id, state in self._active_workflows.items():
                        await self._send_websocket_update(
                            websocket,
                            {
                                "type": "workflow_state",
                                "workflow_id": workflow_id,
                                "state": state.dict(),
                            },
                        )

                    # Keep connection alive
                    await websocket.wait_closed()

                except websockets.exceptions.ConnectionClosed:
                    pass
                except Exception as e:
                    self.logger.error(f"WebSocket client error: {e}")
                finally:
                    self._websocket_clients.discard(websocket)
                    self._performance_metrics["websocket_connection_count"] = len(
                        self._websocket_clients
                    )

            self._websocket_server = await websockets.serve(
                handle_client, "localhost", self.websocket_port
            )

            self.logger.info(f"WebSocket server started on port {self.websocket_port}")

        except Exception as e:
            self.logger.error(f"Error starting WebSocket server: {e}")

    async def create_workflow_tracker(
        self,
        workflow_id: str,
        workflow_name: str,
        phases: List[Dict[str, Any]],
        expected_agents: List[str],
        progress_callback: Optional[Callable] = None,
    ) -> WorkflowProgressState:
        """
        Create new workflow progress tracker

        Args:
            workflow_id: Unique workflow identifier
            workflow_name: Human-readable workflow name
            phases: List of workflow phases with metadata
            expected_agents: List of agent IDs that will participate
            progress_callback: Optional callback for progress updates

        Returns:
            WorkflowProgressState: Initial workflow state
        """
        try:
            if len(self._active_workflows) >= self.max_concurrent_workflows:
                raise ValueError(
                    f"Maximum concurrent workflows ({self.max_concurrent_workflows}) reached"
                )

            # Create initial workflow state
            workflow_state = WorkflowProgressState(
                workflow_id=workflow_id,
                workflow_name=workflow_name,
                workflow_status=WorkflowStatus.PENDING,
                start_time=datetime.now(timezone.utc),
            )

            # Initialize phases
            for i, phase_config in enumerate(phases):
                phase_progress = WorkflowPhaseProgress(
                    phase_id=phase_config.get("phase_id", f"phase_{i}"),
                    phase_name=phase_config.get("name", f"Phase {i + 1}"),
                    phase_description=phase_config.get("description", ""),
                    status=PhaseStatus.NOT_STARTED,
                    progress_percentage=0.0,
                    cultural_validation=CulturalValidationResult(
                        validation_id=str(uuid.uuid4()),
                        phase_name=phase_config.get("name", f"Phase {i + 1}"),
                        cultural_score=100.0,
                        islamic_compliance_score=100.0,
                    ),
                    estimated_duration_ms=phase_config.get(
                        "estimated_duration_ms", 30000
                    ),
                )

                workflow_state.phases[phase_progress.phase_id] = phase_progress

            # Initialize agent tracking
            for agent_id in expected_agents:
                agent_progress = AgentProgress(
                    agent_id=agent_id,
                    agent_name=agent_id.replace("_", " ").title(),
                    current_task="Initializing",
                    progress_percentage=0.0,
                    status=PhaseStatus.NOT_STARTED,
                    cultural_validation=CulturalValidationStatus.NOT_VALIDATED,
                    start_time=datetime.now(timezone.utc),
                )
                workflow_state.active_agents[agent_id] = agent_progress

            # Store workflow state
            with self._lock:
                self._active_workflows[workflow_id] = workflow_state

                # Register progress callback
                if progress_callback:
                    if workflow_id not in self._progress_callbacks:
                        self._progress_callbacks[workflow_id] = []
                    self._progress_callbacks[workflow_id].append(progress_callback)

            # Start monitoring task for this workflow
            self._monitoring_tasks[workflow_id] = asyncio.create_task(
                self._monitor_workflow_progress(workflow_id)
            )

            # Send initial notification
            await self._send_progress_notification(
                workflow_id=workflow_id,
                update_type=ProgressUpdateType.PHASE_START,
                title="Workflow Created",
                message=f"Started tracking workflow: {workflow_name}",
                priority=NotificationPriority.NORMAL,
            )

            # Update performance metrics
            self._performance_metrics["total_workflows_tracked"] += 1

            self.logger.info(
                f"Created workflow tracker for: {workflow_name} ({workflow_id})"
            )

            return workflow_state

        except Exception as e:
            self.logger.error(f"Error creating workflow tracker: {e}")
            raise

    async def update_workflow_status(
        self, workflow_id: str, status: WorkflowStatus, message: Optional[str] = None
    ) -> None:
        """Update overall workflow status"""
        try:
            workflow_state = self._active_workflows.get(workflow_id)
            if not workflow_state:
                raise ValueError(f"Workflow not found: {workflow_id}")

            old_status = workflow_state.workflow_status
            workflow_state.workflow_status = status
            workflow_state.last_update_time = datetime.now(timezone.utc)

            # Handle status-specific logic
            if status == WorkflowStatus.COMPLETED:
                workflow_state.actual_completion_time = datetime.now(timezone.utc)
                workflow_state.total_processing_time_ms = int(
                    (
                        workflow_state.actual_completion_time
                        - workflow_state.start_time
                    ).total_seconds()
                    * 1000
                )

                # Move to history
                with self._lock:
                    self._workflow_history[workflow_id] = workflow_state
                    if workflow_id in self._active_workflows:
                        del self._active_workflows[workflow_id]

                # Stop monitoring
                if workflow_id in self._monitoring_tasks:
                    self._monitoring_tasks[workflow_id].cancel()
                    del self._monitoring_tasks[workflow_id]

                priority = NotificationPriority.HIGH
                title = "Workflow Completed"
                default_message = (
                    f"Workflow '{workflow_state.workflow_name}' completed successfully"
                )

            elif status == WorkflowStatus.FAILED:
                priority = NotificationPriority.CRITICAL
                title = "Workflow Failed"
                default_message = f"Workflow '{workflow_state.workflow_name}' failed"

            elif status == WorkflowStatus.RUNNING:
                priority = NotificationPriority.NORMAL
                title = "Workflow Running"
                default_message = (
                    f"Workflow '{workflow_state.workflow_name}' is now running"
                )

            else:
                priority = NotificationPriority.NORMAL
                title = f"Workflow Status: {status.value.title()}"
                default_message = f"Workflow '{workflow_state.workflow_name}' status changed to {status.value}"

            # Send notification
            await self._send_progress_notification(
                workflow_id=workflow_id,
                update_type=ProgressUpdateType.WORKFLOW_COMPLETE
                if status == WorkflowStatus.COMPLETED
                else ProgressUpdateType.PHASE_PROGRESS,
                title=title,
                message=message or default_message,
                priority=priority,
            )

            self.logger.info(
                f"Updated workflow {workflow_id} status: {old_status} -> {status}"
            )

        except Exception as e:
            self.logger.error(f"Error updating workflow status: {e}")

    async def update_phase_progress(
        self,
        workflow_id: str,
        phase_id: str,
        progress_percentage: float,
        status: Optional[PhaseStatus] = None,
        message: Optional[str] = None,
        cultural_validation_required: bool = True,
    ) -> None:
        """Update individual phase progress"""
        try:
            workflow_state = self._active_workflows.get(workflow_id)
            if not workflow_state:
                raise ValueError(f"Workflow not found: {workflow_id}")

            phase = workflow_state.phases.get(phase_id)
            if not phase:
                raise ValueError(f"Phase not found: {phase_id}")

            old_progress = phase.progress_percentage
            old_status = phase.status

            # Update phase data
            phase.progress_percentage = min(100.0, max(0.0, progress_percentage))

            if status:
                phase.status = status

                # Handle phase timing
                if status == PhaseStatus.EXECUTING and not phase.start_time:
                    phase.start_time = datetime.now(timezone.utc)
                    workflow_state.current_phase = phase_id

                elif status == PhaseStatus.COMPLETED:
                    phase.end_time = datetime.now(timezone.utc)
                    if phase.start_time:
                        phase.actual_duration_ms = int(
                            (phase.end_time - phase.start_time).total_seconds() * 1000
                        )

                    # Add to completed phases
                    if phase_id not in workflow_state.completed_phases:
                        workflow_state.completed_phases.append(phase_id)

                elif status == PhaseStatus.FAILED:
                    if phase_id not in workflow_state.failed_phases:
                        workflow_state.failed_phases.append(phase_id)

            # Perform cultural validation if required
            if cultural_validation_required and progress_percentage > 50.0:
                validation_result = await self._perform_cultural_validation(
                    workflow_id, phase_id, phase.phase_name
                )
                phase.cultural_validation = validation_result

                # Check if cultural validation passed thresholds
                if (
                    validation_result.cultural_score
                    < self.cultural_validation_threshold
                    or validation_result.islamic_compliance_score
                    < self.islamic_compliance_threshold
                ):
                    await self._send_progress_notification(
                        workflow_id=workflow_id,
                        update_type=ProgressUpdateType.CULTURAL_VALIDATION,
                        title="Cultural Validation Alert",
                        message=f"Phase '{phase.phase_name}' requires cultural review",
                        priority=NotificationPriority.HIGH,
                        phase_name=phase.phase_name,
                        cultural_importance=90.0,
                        requires_user_attention=True,
                    )

            # Update overall workflow progress
            await self._update_overall_progress(workflow_id)

            # Send progress notification
            if progress_percentage != old_progress or status != old_status:
                update_type = (
                    ProgressUpdateType.PHASE_COMPLETE
                    if status == PhaseStatus.COMPLETED
                    else ProgressUpdateType.PHASE_PROGRESS
                )

                await self._send_progress_notification(
                    workflow_id=workflow_id,
                    update_type=update_type,
                    title=f"Phase Progress: {phase.phase_name}",
                    message=message
                    or f"Phase '{phase.phase_name}' is {progress_percentage:.1f}% complete",
                    phase_name=phase.phase_name,
                    progress_percentage=progress_percentage,
                    priority=NotificationPriority.HIGH
                    if status == PhaseStatus.COMPLETED
                    else NotificationPriority.NORMAL,
                )

            self.logger.info(
                f"Updated phase {phase_id} progress: {old_progress:.1f}% -> {progress_percentage:.1f}%"
            )

        except Exception as e:
            self.logger.error(f"Error updating phase progress: {e}")

    async def update_agent_progress(
        self,
        workflow_id: str,
        agent_id: str,
        current_task: str,
        progress_percentage: float,
        status: Optional[PhaseStatus] = None,
        performance_metrics: Optional[Dict[str, Any]] = None,
        cultural_validation_status: Optional[CulturalValidationStatus] = None,
    ) -> None:
        """Update individual agent progress"""
        try:
            workflow_state = self._active_workflows.get(workflow_id)
            if not workflow_state:
                raise ValueError(f"Workflow not found: {workflow_id}")

            agent = workflow_state.active_agents.get(agent_id)
            if not agent:
                # Create new agent if not found
                agent = AgentProgress(
                    agent_id=agent_id,
                    agent_name=agent_id.replace("_", " ").title(),
                    current_task=current_task,
                    progress_percentage=progress_percentage,
                    status=status or PhaseStatus.EXECUTING,
                    cultural_validation=cultural_validation_status
                    or CulturalValidationStatus.NOT_VALIDATED,
                    start_time=datetime.now(timezone.utc),
                )
                workflow_state.active_agents[agent_id] = agent

            # Update agent data
            old_progress = agent.progress_percentage
            agent.current_task = current_task
            agent.progress_percentage = min(100.0, max(0.0, progress_percentage))
            agent.last_update = datetime.now(timezone.utc)

            if status:
                agent.status = status

                if status == PhaseStatus.COMPLETED:
                    if agent_id not in workflow_state.completed_agents:
                        workflow_state.completed_agents.append(agent_id)
                    # Remove from active agents
                    if agent_id in workflow_state.active_agents:
                        del workflow_state.active_agents[agent_id]

                elif status == PhaseStatus.FAILED:
                    if agent_id not in workflow_state.failed_agents:
                        workflow_state.failed_agents.append(agent_id)

            if performance_metrics:
                agent.performance_metrics.update(performance_metrics)

            if cultural_validation_status:
                agent.cultural_validation = cultural_validation_status

            # Send agent progress notification
            if progress_percentage != old_progress or status:
                await self._send_progress_notification(
                    workflow_id=workflow_id,
                    update_type=ProgressUpdateType.AGENT_STATUS,
                    title=f"Agent Progress: {agent.agent_name}",
                    message=f"Agent '{agent.agent_name}' working on: {current_task} ({progress_percentage:.1f}% complete)",
                    agent_name=agent.agent_name,
                    progress_percentage=progress_percentage,
                    priority=NotificationPriority.NORMAL,
                )

            self.logger.debug(
                f"Updated agent {agent_id} progress: {old_progress:.1f}% -> {progress_percentage:.1f}%"
            )

        except Exception as e:
            self.logger.error(f"Error updating agent progress: {e}")

    async def report_error(
        self,
        workflow_id: str,
        error_message: str,
        phase_id: Optional[str] = None,
        agent_id: Optional[str] = None,
        error_severity: str = "high",
        recovery_suggestions: Optional[List[str]] = None,
    ) -> None:
        """Report workflow error with cultural context preservation"""
        try:
            workflow_state = self._active_workflows.get(workflow_id)
            if not workflow_state:
                raise ValueError(f"Workflow not found: {workflow_id}")

            # Record error in appropriate context
            if phase_id and phase_id in workflow_state.phases:
                phase = workflow_state.phases[phase_id]
                phase.error_messages.append(error_message)
                if phase.status not in [PhaseStatus.FAILED]:
                    phase.status = PhaseStatus.FAILED

            if agent_id and agent_id in workflow_state.active_agents:
                agent = workflow_state.active_agents[agent_id]
                agent.error_message = error_message
                agent.status = PhaseStatus.FAILED

            # Determine priority based on error severity and cultural context
            priority = NotificationPriority.CRITICAL
            if error_severity == "critical":
                priority = NotificationPriority.URGENT
            elif error_severity == "low":
                priority = NotificationPriority.HIGH

            # Check if error affects cultural compliance
            cultural_impact = False
            if any(
                keyword in error_message.lower()
                for keyword in [
                    "cultural",
                    "islamic",
                    "arabic",
                    "compliance",
                    "validation",
                ]
            ):
                cultural_impact = True
                priority = NotificationPriority.URGENT

            # Send error notification
            await self._send_progress_notification(
                workflow_id=workflow_id,
                update_type=ProgressUpdateType.ERROR_OCCURRED,
                title="Workflow Error Occurred",
                message=f"Error in {'phase ' + phase_id if phase_id else 'workflow'}: {error_message}",
                priority=priority,
                phase_name=phase_id,
                agent_name=agent_id,
                cultural_importance=90.0 if cultural_impact else 30.0,
                islamic_compliance_note="Review required for Islamic compliance"
                if cultural_impact
                else None,
                requires_user_attention=True,
                metadata={
                    "error_severity": error_severity,
                    "recovery_suggestions": recovery_suggestions or [],
                    "cultural_impact": cultural_impact,
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                },
            )

            self.logger.error(f"Workflow {workflow_id} error reported: {error_message}")

        except Exception as e:
            self.logger.error(f"Error reporting workflow error: {e}")

    async def request_user_feedback(
        self,
        workflow_id: str,
        feedback_request: str,
        options: Optional[List[str]] = None,
        cultural_context: Optional[str] = None,
        timeout_minutes: int = 30,
    ) -> Optional[str]:
        """Request user feedback with cultural context"""
        try:
            workflow_state = self._active_workflows.get(workflow_id)
            if not workflow_state:
                raise ValueError(f"Workflow not found: {workflow_id}")

            workflow_state.user_feedback_requests += 1

            # Create feedback notification
            feedback_notification = ProgressNotification(
                workflow_id=workflow_id,
                update_type=ProgressUpdateType.USER_FEEDBACK,
                priority=NotificationPriority.HIGH,
                title="User Feedback Required",
                message=feedback_request,
                cultural_importance=80.0 if cultural_context else 30.0,
                islamic_compliance_note=cultural_context,
                requires_user_attention=True,
                action_required="user_feedback",
                estimated_completion_time=datetime.now(timezone.utc)
                + timedelta(minutes=timeout_minutes),
                metadata={
                    "options": options or [],
                    "cultural_context": cultural_context,
                    "timeout_minutes": timeout_minutes,
                },
            )

            # Send notification
            await self._send_notification_to_clients(feedback_notification)

            # TODO: Implement actual user feedback collection mechanism
            # This would integrate with the Iraqi AI Chat System's user interface

            self.logger.info(
                f"User feedback requested for workflow {workflow_id}: {feedback_request}"
            )

            return None  # Would return actual user feedback

        except Exception as e:
            self.logger.error(f"Error requesting user feedback: {e}")
            return None

    async def _perform_cultural_validation(
        self, workflow_id: str, phase_id: str, phase_name: str
    ) -> CulturalValidationResult:
        """Perform cultural validation for a workflow phase"""
        try:
            # Check cache first
            cache_key = f"{workflow_id}:{phase_id}"
            if cache_key in self._cultural_validation_cache:
                cached_result = self._cultural_validation_cache[cache_key]
                # Check if cache is still valid (within 5 minutes)
                if (
                    datetime.now(timezone.utc) - cached_result.validation_timestamp
                ).total_seconds() < 300:
                    return cached_result

            # Perform validation
            validation_start = time.time()

            # Initialize validation result
            validation_result = CulturalValidationResult(
                validation_id=str(uuid.uuid4()),
                phase_name=phase_name,
                cultural_score=100.0,
                islamic_compliance_score=100.0,
                validator_agent="cultural_validator_system",
            )

            # Run cultural validators
            for validator_name, validator_func in self._cultural_validators.items():
                try:
                    score = await validator_func(workflow_id, phase_id, phase_name)
                    validation_result.cultural_score = min(
                        validation_result.cultural_score, score
                    )
                except Exception as e:
                    self.logger.warning(
                        f"Cultural validator '{validator_name}' failed: {e}"
                    )
                    validation_result.issues_found.append(
                        f"Validator {validator_name} failed: {str(e)}"
                    )

            # Run Islamic compliance validators
            for (
                validator_name,
                validator_func,
            ) in self._islamic_compliance_validators.items():
                try:
                    score = await validator_func(workflow_id, phase_id, phase_name)
                    validation_result.islamic_compliance_score = min(
                        validation_result.islamic_compliance_score, score
                    )
                except Exception as e:
                    self.logger.warning(
                        f"Islamic compliance validator '{validator_name}' failed: {e}"
                    )
                    validation_result.issues_found.append(
                        f"Islamic validator {validator_name} failed: {str(e)}"
                    )

            # Check thresholds and generate recommendations
            if validation_result.cultural_score < self.cultural_validation_threshold:
                validation_result.requires_human_review = True
                validation_result.recommendations.append(
                    f"Cultural score ({validation_result.cultural_score:.1f}) below threshold ({self.cultural_validation_threshold}). Review required."
                )

            if (
                validation_result.islamic_compliance_score
                < self.islamic_compliance_threshold
            ):
                validation_result.requires_human_review = True
                validation_result.recommendations.append(
                    f"Islamic compliance ({validation_result.islamic_compliance_score:.1f}) below threshold ({self.islamic_compliance_threshold}). Review required."
                )

            # Cache result
            self._cultural_validation_cache[cache_key] = validation_result

            # Update performance metrics
            validation_time_ms = int((time.time() - validation_start) * 1000)
            workflow_state = self._active_workflows.get(workflow_id)
            if workflow_state:
                workflow_state.cultural_validation_time_ms += validation_time_ms

            return validation_result

        except Exception as e:
            self.logger.error(f"Error performing cultural validation: {e}")
            # Return default validation result
            return CulturalValidationResult(
                validation_id=str(uuid.uuid4()),
                phase_name=phase_name,
                cultural_score=50.0,  # Conservative score on error
                islamic_compliance_score=50.0,
                issues_found=[f"Validation error: {str(e)}"],
                requires_human_review=True,
            )

    async def _update_overall_progress(self, workflow_id: str) -> None:
        """Update overall workflow progress based on phase progress"""
        try:
            workflow_state = self._active_workflows.get(workflow_id)
            if not workflow_state:
                return

            if not workflow_state.phases:
                return

            # Calculate weighted progress
            total_weight = 0
            weighted_progress = 0

            for phase in workflow_state.phases.values():
                # Weight phases by estimated duration
                weight = max(
                    1, phase.estimated_duration_ms / 1000
                )  # Convert to seconds
                total_weight += weight
                weighted_progress += phase.progress_percentage * weight

            if total_weight > 0:
                workflow_state.overall_progress_percentage = (
                    weighted_progress / total_weight
                )
            else:
                # Fallback to simple average
                workflow_state.overall_progress_percentage = sum(
                    phase.progress_percentage
                    for phase in workflow_state.phases.values()
                ) / len(workflow_state.phases)

            # Update cultural scores
            cultural_scores = [
                phase.cultural_validation.cultural_score
                for phase in workflow_state.phases.values()
                if phase.cultural_validation
            ]
            if cultural_scores:
                workflow_state.overall_cultural_score = sum(cultural_scores) / len(
                    cultural_scores
                )

            islamic_scores = [
                phase.cultural_validation.islamic_compliance_score
                for phase in workflow_state.phases.values()
                if phase.cultural_validation
            ]
            if islamic_scores:
                workflow_state.overall_islamic_compliance = sum(islamic_scores) / len(
                    islamic_scores
                )

            # Update estimated completion time
            if workflow_state.overall_progress_percentage > 0:
                elapsed_time = datetime.now(timezone.utc) - workflow_state.start_time
                estimated_total_time = elapsed_time / (
                    workflow_state.overall_progress_percentage / 100
                )
                workflow_state.estimated_completion_time = (
                    workflow_state.start_time + estimated_total_time
                )

        except Exception as e:
            self.logger.error(f"Error updating overall progress: {e}")

    async def _send_progress_notification(
        self,
        workflow_id: str,
        update_type: ProgressUpdateType,
        title: str,
        message: str,
        priority: NotificationPriority = NotificationPriority.NORMAL,
        **kwargs,
    ) -> None:
        """Send progress notification to all clients"""
        try:
            notification = ProgressNotification(
                workflow_id=workflow_id,
                update_type=update_type,
                title=title,
                message=message,
                priority=priority,
                **kwargs,
            )

            await self._notification_queue.put(notification)

        except Exception as e:
            self.logger.error(f"Error sending progress notification: {e}")

    async def _send_notification_to_clients(
        self, notification: ProgressNotification
    ) -> None:
        """Send notification to all WebSocket clients"""
        if not self._websocket_clients:
            return

        notification_data = {
            "type": "progress_update",
            "notification": notification.dict(),
        }

        # Send to all connected clients
        disconnected_clients = set()
        for client in self._websocket_clients:
            try:
                await self._send_websocket_update(client, notification_data)
            except websockets.exceptions.ConnectionClosed:
                disconnected_clients.add(client)
            except Exception as e:
                self.logger.warning(f"Error sending notification to client: {e}")
                disconnected_clients.add(client)

        # Remove disconnected clients
        for client in disconnected_clients:
            self._websocket_clients.discard(client)

        self._performance_metrics["websocket_connection_count"] = len(
            self._websocket_clients
        )

    async def _send_websocket_update(self, websocket, data: Dict[str, Any]) -> None:
        """Send data to a specific WebSocket client"""
        try:
            await websocket.send(json.dumps(data, default=str, ensure_ascii=False))
        except Exception as e:
            self.logger.error(f"Error sending WebSocket update: {e}")
            raise

    async def _process_notification_queue(self) -> None:
        """Process notification queue continuously"""
        while True:
            try:
                notification = await self._notification_queue.get()

                # Send to WebSocket clients
                await self._send_notification_to_clients(notification)

                # Call progress callbacks
                workflow_id = notification.workflow_id
                callbacks = self._progress_callbacks.get(workflow_id, [])
                for callback in callbacks:
                    try:
                        if asyncio.iscoroutinefunction(callback):
                            await callback(notification)
                        else:
                            callback(notification)
                    except Exception as e:
                        self.logger.warning(f"Progress callback failed: {e}")

                # Update performance metrics
                workflow_state = self._active_workflows.get(workflow_id)
                if workflow_state:
                    workflow_state.user_notifications_sent += 1

            except Exception as e:
                self.logger.error(f"Error processing notification: {e}")
                await asyncio.sleep(1)  # Prevent tight error loops

    async def _monitor_workflow_progress(self, workflow_id: str) -> None:
        """Monitor individual workflow progress"""
        try:
            while workflow_id in self._active_workflows:
                workflow_state = self._active_workflows[workflow_id]

                # Check for stalled progress
                now = datetime.now(timezone.utc)
                time_since_update = (
                    now - workflow_state.last_update_time
                ).total_seconds()

                if time_since_update > 300:  # 5 minutes without update
                    await self._send_progress_notification(
                        workflow_id=workflow_id,
                        update_type=ProgressUpdateType.ERROR_OCCURRED,
                        title="Workflow Stalled",
                        message=f"No progress updates for {time_since_update / 60:.1f} minutes",
                        priority=NotificationPriority.HIGH,
                        requires_user_attention=True,
                    )

                # Check for timeout
                if workflow_state.estimated_completion_time:
                    if now > workflow_state.estimated_completion_time + timedelta(
                        minutes=30
                    ):
                        await self.update_workflow_status(
                            workflow_id, WorkflowStatus.TIMEOUT
                        )
                        break

                await asyncio.sleep(self.performance_monitoring_interval / 1000)

        except asyncio.CancelledError:
            pass
        except Exception as e:
            self.logger.error(f"Error monitoring workflow {workflow_id}: {e}")

    async def _monitor_performance_metrics(self) -> None:
        """Monitor overall performance metrics"""
        while True:
            try:
                # Calculate real-time metrics
                active_count = len(self._active_workflows)

                if active_count > 0:
                    # Average completion time
                    completed_workflows = list(self._workflow_history.values())
                    if completed_workflows:
                        avg_time = sum(
                            w.total_processing_time_ms for w in completed_workflows
                        ) / len(completed_workflows)
                        self._performance_metrics["average_completion_time_ms"] = (
                            avg_time
                        )

                    # Average cultural scores
                    cultural_scores = []
                    islamic_scores = []

                    for workflow in self._active_workflows.values():
                        cultural_scores.append(workflow.overall_cultural_score)
                        islamic_scores.append(workflow.overall_islamic_compliance)

                    for workflow in self._workflow_history.values():
                        cultural_scores.append(workflow.overall_cultural_score)
                        islamic_scores.append(workflow.overall_islamic_compliance)

                    if cultural_scores:
                        self._performance_metrics["average_cultural_score"] = sum(
                            cultural_scores
                        ) / len(cultural_scores)
                    if islamic_scores:
                        self._performance_metrics["average_islamic_compliance"] = sum(
                            islamic_scores
                        ) / len(islamic_scores)

                await asyncio.sleep(30)  # Update every 30 seconds

            except Exception as e:
                self.logger.error(f"Error monitoring performance metrics: {e}")
                await asyncio.sleep(30)

    def register_cultural_validator(
        self, validator_name: str, validator_func: Callable[[str, str, str], float]
    ) -> None:
        """Register cultural validation function"""
        self._cultural_validators[validator_name] = validator_func
        self.logger.info(f"Registered cultural validator: {validator_name}")

    def register_islamic_compliance_validator(
        self, validator_name: str, validator_func: Callable[[str, str, str], float]
    ) -> None:
        """Register Islamic compliance validation function"""
        self._islamic_compliance_validators[validator_name] = validator_func
        self.logger.info(f"Registered Islamic compliance validator: {validator_name}")

    def get_workflow_state(self, workflow_id: str) -> Optional[WorkflowProgressState]:
        """Get current workflow state"""
        return self._active_workflows.get(workflow_id) or self._workflow_history.get(
            workflow_id
        )

    def get_all_active_workflows(self) -> Dict[str, WorkflowProgressState]:
        """Get all active workflow states"""
        return self._active_workflows.copy()

    def get_performance_metrics(self) -> Dict[str, Any]:
        """Get current performance metrics"""
        return {
            **self._performance_metrics,
            "active_workflows": len(self._active_workflows),
            "completed_workflows": len(self._workflow_history),
            "websocket_clients": len(self._websocket_clients),
            "monitoring_tasks": len(self._monitoring_tasks),
            "cultural_validators": len(self._cultural_validators),
            "islamic_validators": len(self._islamic_compliance_validators),
        }

    async def cleanup_completed_workflows(self, max_age_hours: int = 24) -> int:
        """Clean up old completed workflows"""
        try:
            cutoff_time = datetime.now(timezone.utc) - timedelta(hours=max_age_hours)
            to_remove = []

            for workflow_id, workflow_state in self._workflow_history.items():
                if (
                    workflow_state.actual_completion_time
                    and workflow_state.actual_completion_time < cutoff_time
                ):
                    to_remove.append(workflow_id)

            for workflow_id in to_remove:
                del self._workflow_history[workflow_id]
                if workflow_id in self._progress_callbacks:
                    del self._progress_callbacks[workflow_id]

            self.logger.info(f"Cleaned up {len(to_remove)} old workflows")
            return len(to_remove)

        except Exception as e:
            self.logger.error(f"Error cleaning up workflows: {e}")
            return 0

    async def shutdown(self) -> None:
        """Shutdown progress tracker"""
        try:
            # Cancel all monitoring tasks
            for task in self._monitoring_tasks.values():
                task.cancel()

            # Close WebSocket server
            if self._websocket_server:
                self._websocket_server.close()
                await self._websocket_server.wait_closed()

            # Close WebSocket clients
            for client in list(self._websocket_clients):
                await client.close()

            # Shutdown executor
            self._executor.shutdown(wait=True)

            self.logger.info("Workflow progress tracker shutdown complete")

        except Exception as e:
            self.logger.error(f"Error during shutdown: {e}")


# Example usage and testing
async def main():
    """Example usage of IraqiWorkflowProgressTracker"""

    # Initialize progress tracker
    progress_tracker = IraqiWorkflowProgressTracker(
        enable_websocket_server=True,
        websocket_port=8765,
        cultural_validation_threshold=90.0,
        islamic_compliance_threshold=95.0,
    )

    # Example cultural validator
    async def sample_cultural_validator(
        workflow_id: str, phase_id: str, phase_name: str
    ) -> float:
        """Sample cultural validation function"""
        # Simulate cultural validation logic
        if "arabic" in phase_name.lower() or "cultural" in phase_name.lower():
            return 95.0  # High cultural score
        return 85.0  # Standard score

    # Example Islamic compliance validator
    async def sample_islamic_validator(
        workflow_id: str, phase_id: str, phase_name: str
    ) -> float:
        """Sample Islamic compliance validation function"""
        # Simulate Islamic compliance validation
        if any(
            term in phase_name.lower() for term in ["islamic", "compliance", "halal"]
        ):
            return 98.0  # High Islamic compliance
        return 90.0  # Standard compliance

    # Register validators
    progress_tracker.register_cultural_validator(
        "sample_cultural", sample_cultural_validator
    )
    progress_tracker.register_islamic_compliance_validator(
        "sample_islamic", sample_islamic_validator
    )

    # Create example workflow
    workflow_phases = [
        {
            "phase_id": "analysis",
            "name": "Arabic Document Analysis",
            "description": "Analyze Arabic documents with cultural context",
            "estimated_duration_ms": 30000,
        },
        {
            "phase_id": "processing",
            "name": "Cultural Content Processing",
            "description": "Process content ensuring Islamic compliance",
            "estimated_duration_ms": 45000,
        },
        {
            "phase_id": "validation",
            "name": "Final Cultural Validation",
            "description": "Final validation of cultural appropriateness",
            "estimated_duration_ms": 20000,
        },
    ]

    expected_agents = [
        "iraqi_cultural_validator",
        "arabic_rtl_processor",
        "islamic_compliance_checker",
    ]

    # Progress callback
    def progress_callback(notification: ProgressNotification):
        print(f"Progress Update: {notification.title} - {notification.message}")
        if notification.cultural_importance > 70:
            print(f"  Cultural Importance: {notification.cultural_importance}/100")
        if notification.islamic_compliance_note:
            print(f"  Islamic Compliance: {notification.islamic_compliance_note}")

    print("Creating workflow progress tracker...")

    # Create workflow
    workflow_state = await progress_tracker.create_workflow_tracker(
        workflow_id="iraqi_document_processing_001",
        workflow_name="Iraqi Document Processing with Cultural Validation",
        phases=workflow_phases,
        expected_agents=expected_agents,
        progress_callback=progress_callback,
    )

    print(f"Workflow created: {workflow_state.workflow_name}")
    print(f"Workflow ID: {workflow_state.workflow_id}")
    print(f"Phases: {len(workflow_state.phases)}")
    print(f"Expected agents: {len(workflow_state.active_agents)}")

    # Start workflow
    await progress_tracker.update_workflow_status(
        workflow_state.workflow_id,
        WorkflowStatus.RUNNING,
        "Starting Arabic document processing workflow",
    )

    # Simulate workflow progress
    phase_ids = list(workflow_state.phases.keys())

    for i, phase_id in enumerate(phase_ids):
        print(
            f"\n--- Processing Phase {i + 1}: {workflow_state.phases[phase_id].phase_name} ---"
        )

        # Start phase
        await progress_tracker.update_phase_progress(
            workflow_state.workflow_id,
            phase_id,
            0.0,
            PhaseStatus.EXECUTING,
            f"Starting {workflow_state.phases[phase_id].phase_name}",
        )

        # Simulate agents working
        for agent_id in expected_agents:
            await progress_tracker.update_agent_progress(
                workflow_state.workflow_id,
                agent_id,
                f"Processing phase: {workflow_state.phases[phase_id].phase_name}",
                25.0 * (i + 1),
                PhaseStatus.EXECUTING,
            )
            await asyncio.sleep(1)

        # Update phase progress incrementally
        for progress in [25, 50, 75, 100]:
            await progress_tracker.update_phase_progress(
                workflow_state.workflow_id,
                phase_id,
                progress,
                PhaseStatus.COMPLETED if progress == 100 else PhaseStatus.EXECUTING,
                f"Phase {workflow_state.phases[phase_id].phase_name} {progress}% complete",
            )
            await asyncio.sleep(1)

    # Complete workflow
    await progress_tracker.update_workflow_status(
        workflow_state.workflow_id,
        WorkflowStatus.COMPLETED,
        "Iraqi document processing completed successfully with full cultural compliance",
    )

    print("\n" + "=" * 80)
    print("FINAL WORKFLOW STATE:")
    print("=" * 80)

    final_state = progress_tracker.get_workflow_state(workflow_state.workflow_id)
    if final_state:
        print(f"Status: {final_state.workflow_status}")
        print(f"Overall Progress: {final_state.overall_progress_percentage:.1f}%")
        print(f"Cultural Score: {final_state.overall_cultural_score:.1f}/100")
        print(f"Islamic Compliance: {final_state.overall_islamic_compliance:.1f}/100")
        print(f"Processing Time: {final_state.total_processing_time_ms}ms")
        print(f"Completed Phases: {len(final_state.completed_phases)}")
        print(f"Completed Agents: {len(final_state.completed_agents)}")
        print(f"Notifications Sent: {final_state.user_notifications_sent}")

    print("\n" + "=" * 80)
    print("PERFORMANCE METRICS:")
    print("=" * 80)
    metrics = progress_tracker.get_performance_metrics()
    for key, value in metrics.items():
        print(f"{key}: {value}")

    # Demonstrate error reporting
    print("\n" + "=" * 80)
    print("TESTING ERROR REPORTING:")
    print("=" * 80)

    # Create another workflow for error testing
    error_workflow = await progress_tracker.create_workflow_tracker(
        workflow_id="error_test_workflow",
        workflow_name="Error Testing Workflow",
        phases=[
            {"phase_id": "test", "name": "Test Phase", "description": "Testing errors"}
        ],
        expected_agents=["test_agent"],
    )

    await progress_tracker.update_workflow_status(
        error_workflow.workflow_id, WorkflowStatus.RUNNING
    )

    # Report an error
    await progress_tracker.report_error(
        error_workflow.workflow_id,
        "Cultural validation failed: Content not appropriate for Iraqi context",
        phase_id="test",
        error_severity="critical",
        recovery_suggestions=[
            "Review content for cultural appropriateness",
            "Consult cultural validation team",
        ],
    )

    print("Error reported successfully")

    # Request user feedback
    await progress_tracker.request_user_feedback(
        error_workflow.workflow_id,
        "Should we proceed with modified cultural validation parameters?",
        options=["Yes, proceed", "No, stop workflow", "Review manually"],
        cultural_context="This decision affects Islamic compliance validation",
        timeout_minutes=10,
    )

    print("User feedback requested")

    # Wait a bit for WebSocket clients (if any) to receive updates
    await asyncio.sleep(2)

    print("\nWorkflow progress tracking demonstration completed!")


if __name__ == "__main__":
    asyncio.run(main())
