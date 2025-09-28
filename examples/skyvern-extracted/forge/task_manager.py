"""
Iraqi AI Task Management System for Skyvern Enterprise
Advanced scheduling with Iraqi business hours and Islamic calendar integration
"""

import asyncio
import json
import logging
from datetime import datetime, timedelta, timezone
from enum import Enum
from typing import Any, Dict, List, Optional, Set, Union
from uuid import uuid4

from pydantic import BaseModel, Field, validator
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from .exceptions import TaskExecutionError, IraqiSchedulingError
from .models import Task, TaskStatus, TaskPriority
from .services.iraqi_auth_service import IraqiInstitutionAuthService


logger = logging.getLogger(__name__)


class IraqiTaskPriority(str, Enum):
    """Iraqi-specific task priorities"""

    EMERGENCY = "emergency"  # Government emergencies
    URGENT = "urgent"  # Ministry deadlines
    HIGH = "high"  # Business critical
    NORMAL = "normal"  # Standard operations
    LOW = "low"  # Non-critical tasks
    FRIDAY_PRAYER = "friday_prayer"  # Special priority for prayer time
    RAMADAN_ADJUSTED = "ramadan_adjusted"  # Ramadan schedule


class IraqiTaskType(str, Enum):
    """Iraqi-specific task types"""

    GOVERNMENT_PORTAL = "government_portal"
    MINISTRY_COORDINATION = "ministry_coordination"
    BANKING_ISLAMIC = "banking_islamic"
    EDUCATION_SYSTEM = "education_system"
    HEALTHCARE_PORTAL = "healthcare_portal"
    BUSINESS_REGISTRATION = "business_registration"
    LEGAL_DOCUMENTS = "legal_documents"
    CITIZEN_SERVICES = "citizen_services"
    CULTURAL_VALIDATION = "cultural_validation"


class IraqiBusinessSchedule(BaseModel):
    """Iraqi business hours and scheduling configuration"""

    # Standard business hours
    work_days: List[int] = Field(default=[0, 1, 2, 3, 4])  # Sunday-Thursday
    work_start_hour: int = Field(default=8)  # 8:00 AM
    work_end_hour: int = Field(default=16)  # 4:00 PM

    # Friday prayer considerations
    friday_prayer_start: int = Field(default=12)  # 12:00 PM
    friday_prayer_end: int = Field(default=14)  # 2:00 PM

    # Ramadan adjustments
    ramadan_work_start: int = Field(default=9)  # 9:00 AM during Ramadan
    ramadan_work_end: int = Field(default=15)  # 3:00 PM during Ramadan

    # Government portal peak hours (avoid if possible)
    peak_hours_start: int = Field(default=9)  # 9:00 AM
    peak_hours_end: int = Field(default=11)  # 11:00 AM

    # Timeout configurations for different portal types
    government_portal_timeout: int = Field(default=120)  # 2 minutes
    banking_portal_timeout: int = Field(default=90)  # 1.5 minutes
    education_portal_timeout: int = Field(default=60)  # 1 minute


class IraqiTaskConfig(BaseModel):
    """Configuration for Iraqi-specific task execution"""

    task_type: IraqiTaskType
    priority: IraqiTaskPriority = Field(default=IraqiTaskPriority.NORMAL)

    # Scheduling preferences
    respect_business_hours: bool = Field(default=True)
    avoid_friday_prayer: bool = Field(default=True)
    ramadan_aware: bool = Field(default=True)
    avoid_peak_hours: bool = Field(default=False)

    # Execution configuration
    max_retries: int = Field(default=3)
    retry_delay_minutes: int = Field(default=5)
    timeout_seconds: int = Field(default=120)

    # Iraqi-specific settings
    require_cultural_validation: bool = Field(default=True)
    islamic_compliance_check: bool = Field(default=True)
    arabic_text_processing: bool = Field(default=True)
    government_portal_mode: bool = Field(default=False)

    # Ministry-specific settings
    ministry_codes: List[str] = Field(default_factory=list)
    security_clearance_required: str = Field(default="public")
    multi_ministry_coordination: bool = Field(default=False)


class IraqiTaskStatus(str, Enum):
    """Enhanced task status for Iraqi operations"""

    CREATED = "created"
    SCHEDULED = "scheduled"
    WAITING_BUSINESS_HOURS = "waiting_business_hours"
    WAITING_FRIDAY_PRAYER = "waiting_friday_prayer"
    CULTURAL_VALIDATION = "cultural_validation"
    ISLAMIC_COMPLIANCE_CHECK = "islamic_compliance_check"
    EXECUTING = "executing"
    MINISTRY_COORDINATION = "ministry_coordination"
    GOVERNMENT_PORTAL_ACCESS = "government_portal_access"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    COMPLIANCE_REJECTED = "compliance_rejected"
    BUSINESS_HOURS_EXPIRED = "business_hours_expired"


class IraqiTask(BaseModel):
    """Enhanced task model for Iraqi operations"""

    task_id: str = Field(default_factory=lambda: str(uuid4()))
    task_type: IraqiTaskType
    status: IraqiTaskStatus = Field(default=IraqiTaskStatus.CREATED)
    priority: IraqiTaskPriority
    config: IraqiTaskConfig

    # Task definition
    title: str
    description: str
    url: Optional[str] = None
    workflow_id: Optional[str] = None

    # Scheduling information
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    scheduled_at: Optional[datetime] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    # Iraqi context
    institution_id: Optional[str] = None
    user_id: Optional[str] = None
    ministry_context: Dict[str, Any] = Field(default_factory=dict)
    cultural_context: Dict[str, Any] = Field(default_factory=dict)

    # Execution details
    parameters: Dict[str, Any] = Field(default_factory=dict)
    results: Dict[str, Any] = Field(default_factory=dict)
    error_message: Optional[str] = None
    retry_count: int = Field(default=0)

    # Compliance and validation
    islamic_compliance_status: str = Field(default="pending")
    cultural_validation_status: str = Field(default="pending")
    security_clearance_verified: bool = Field(default=False)


class IraqiTaskManager:
    """Advanced task manager for Iraqi AI Chat System"""

    def __init__(
        self,
        db_session: AsyncSession,
        auth_service: IraqiInstitutionAuthService,
        business_schedule: Optional[IraqiBusinessSchedule] = None,
    ):
        self.db_session = db_session
        self.auth_service = auth_service
        self.business_schedule = business_schedule or IraqiBusinessSchedule()

        # Task queues by priority
        self._task_queues: Dict[IraqiTaskPriority, List[IraqiTask]] = {
            priority: [] for priority in IraqiTaskPriority
        }

        # Active tasks tracking
        self._active_tasks: Dict[str, IraqiTask] = {}
        self._task_locks: Set[str] = set()

        # Scheduling
        self._scheduler_running = False
        self._scheduler_task: Optional[asyncio.Task] = None

    async def create_task(
        self,
        task_type: IraqiTaskType,
        title: str,
        description: str,
        config: IraqiTaskConfig,
        parameters: Optional[Dict[str, Any]] = None,
        url: Optional[str] = None,
        workflow_id: Optional[str] = None,
        user_id: Optional[str] = None,
        institution_id: Optional[str] = None,
    ) -> str:
        """Create a new Iraqi task with scheduling and compliance validation"""

        task = IraqiTask(
            task_type=task_type,
            title=title,
            description=description,
            config=config,
            parameters=parameters or {},
            url=url,
            workflow_id=workflow_id,
            user_id=user_id,
            institution_id=institution_id,
        )

        # Validate Iraqi-specific requirements
        await self._validate_task_requirements(task)

        # Schedule task based on Iraqi business hours
        await self._schedule_iraqi_task(task)

        # Add to appropriate priority queue
        self._task_queues[task.priority].append(task)

        # Start scheduler if not running
        if not self._scheduler_running:
            await self.start_scheduler()

        logger.info(f"Created Iraqi task: {task.task_id} ({task.task_type})")
        return task.task_id

    async def _validate_task_requirements(self, task: IraqiTask) -> None:
        """Validate Iraqi-specific task requirements"""

        # Validate government portal access
        if task.task_type == IraqiTaskType.GOVERNMENT_PORTAL:
            if not task.config.government_portal_mode:
                raise TaskExecutionError("Government portal mode not enabled")

            if not task.user_id or not task.institution_id:
                raise TaskExecutionError(
                    "Government portal tasks require user and institution"
                )

        # Validate ministry coordination
        if task.task_type == IraqiTaskType.MINISTRY_COORDINATION:
            if not task.config.ministry_codes:
                raise TaskExecutionError(
                    "Ministry coordination requires ministry codes"
                )

            if task.config.security_clearance_required not in [
                "public",
                "restricted",
                "confidential",
            ]:
                raise TaskExecutionError("Invalid security clearance level")

        # Validate Islamic banking requirements
        if task.task_type == IraqiTaskType.BANKING_ISLAMIC:
            if not task.config.islamic_compliance_check:
                raise TaskExecutionError(
                    "Islamic banking tasks require compliance check"
                )

        # Validate URL for Iraqi domains if government task
        if task.task_type in [
            IraqiTaskType.GOVERNMENT_PORTAL,
            IraqiTaskType.MINISTRY_COORDINATION,
        ]:
            if task.url and not await self._is_iraqi_government_domain(task.url):
                logger.warning(
                    f"Task URL may not be Iraqi government domain: {task.url}"
                )

    async def _schedule_iraqi_task(self, task: IraqiTask) -> None:
        """Schedule task based on Iraqi business hours and cultural considerations"""

        now = datetime.now(timezone.utc)

        # Convert to Baghdad time for scheduling calculations
        from datetime import timezone as tz

        baghdad_tz = tz(timedelta(hours=3))  # UTC+3
        baghdad_now = now.astimezone(baghdad_tz)

        # Determine optimal execution time
        if task.priority == IraqiTaskPriority.EMERGENCY:
            # Emergency tasks execute immediately
            task.scheduled_at = now
            task.status = IraqiTaskStatus.SCHEDULED

        elif task.priority == IraqiTaskPriority.FRIDAY_PRAYER:
            # Schedule after Friday prayer
            task.scheduled_at = await self._get_next_post_prayer_time(baghdad_now)
            task.status = IraqiTaskStatus.WAITING_FRIDAY_PRAYER

        elif not task.config.respect_business_hours:
            # Execute immediately if business hours not required
            task.scheduled_at = now
            task.status = IraqiTaskStatus.SCHEDULED

        else:
            # Schedule within Iraqi business hours
            scheduled_time = await self._get_next_business_hour_slot(baghdad_now, task)
            task.scheduled_at = scheduled_time.astimezone(timezone.utc)

            if scheduled_time.date() > baghdad_now.date():
                task.status = IraqiTaskStatus.WAITING_BUSINESS_HOURS
            else:
                task.status = IraqiTaskStatus.SCHEDULED

    async def _get_next_business_hour_slot(
        self, current_time: datetime, task: IraqiTask
    ) -> datetime:
        """Get next available business hour slot for task execution"""

        # Check if currently in business hours
        if await self._is_iraqi_business_hours(current_time):
            # Check if we should avoid peak hours
            if task.config.avoid_peak_hours:
                if await self._is_peak_hours(current_time):
                    # Schedule after peak hours
                    return current_time.replace(
                        hour=self.business_schedule.peak_hours_end,
                        minute=0,
                        second=0,
                        microsecond=0,
                    )

            # Check Friday prayer time
            if (
                task.config.avoid_friday_prayer
                and current_time.weekday() == 4  # Friday
                and self.business_schedule.friday_prayer_start
                <= current_time.hour
                < self.business_schedule.friday_prayer_end
            ):
                # Schedule after prayer
                return current_time.replace(
                    hour=self.business_schedule.friday_prayer_end,
                    minute=0,
                    second=0,
                    microsecond=0,
                )

            # Can execute now
            return current_time

        # Not in business hours - find next business day
        next_business_day = current_time

        while True:
            next_business_day += timedelta(days=1)

            # Check if it's a work day
            if next_business_day.weekday() in self.business_schedule.work_days:
                # Check if it's an Islamic holiday
                if not await self._is_islamic_holiday(next_business_day):
                    break

        # Set to start of business hours
        work_start = (
            self.business_schedule.ramadan_work_start
            if await self._is_ramadan_period(next_business_day)
            else self.business_schedule.work_start_hour
        )

        return next_business_day.replace(
            hour=work_start, minute=0, second=0, microsecond=0
        )

    async def start_scheduler(self) -> None:
        """Start the Iraqi task scheduler"""

        if self._scheduler_running:
            return

        self._scheduler_running = True
        self._scheduler_task = asyncio.create_task(self._scheduler_loop())
        logger.info("Iraqi task scheduler started")

    async def stop_scheduler(self) -> None:
        """Stop the task scheduler"""

        self._scheduler_running = False

        if self._scheduler_task:
            self._scheduler_task.cancel()
            try:
                await self._scheduler_task
            except asyncio.CancelledError:
                pass

        logger.info("Iraqi task scheduler stopped")

    async def _scheduler_loop(self) -> None:
        """Main scheduler loop for Iraqi tasks"""

        while self._scheduler_running:
            try:
                # Process tasks in priority order
                for priority in IraqiTaskPriority:
                    await self._process_priority_queue(priority)

                # Clean up completed tasks
                await self._cleanup_completed_tasks()

                # Wait before next iteration
                await asyncio.sleep(30)  # Check every 30 seconds

            except Exception as e:
                logger.error(f"Scheduler loop error: {e}")
                await asyncio.sleep(60)  # Wait longer on error

    async def _process_priority_queue(self, priority: IraqiTaskPriority) -> None:
        """Process tasks in a specific priority queue"""

        queue = self._task_queues[priority]
        now = datetime.now(timezone.utc)

        # Find tasks ready for execution
        ready_tasks = [
            task
            for task in queue
            if (
                task.status == IraqiTaskStatus.SCHEDULED
                and task.scheduled_at
                and task.scheduled_at <= now
                and task.task_id not in self._task_locks
            )
        ]

        # Execute ready tasks
        for task in ready_tasks:
            try:
                # Lock task to prevent duplicate execution
                self._task_locks.add(task.task_id)

                # Remove from queue and add to active tasks
                queue.remove(task)
                self._active_tasks[task.task_id] = task

                # Execute task asynchronously
                asyncio.create_task(self._execute_iraqi_task(task))

            except Exception as e:
                logger.error(f"Error starting task {task.task_id}: {e}")
                self._task_locks.discard(task.task_id)

    async def _execute_iraqi_task(self, task: IraqiTask) -> None:
        """Execute a single Iraqi task with all validations and checks"""

        try:
            task.status = IraqiTaskStatus.EXECUTING
            task.started_at = datetime.now(timezone.utc)

            # Cultural validation if required
            if task.config.require_cultural_validation:
                task.status = IraqiTaskStatus.CULTURAL_VALIDATION
                await self._perform_cultural_validation(task)

            # Islamic compliance check if required
            if task.config.islamic_compliance_check:
                task.status = IraqiTaskStatus.ISLAMIC_COMPLIANCE_CHECK
                await self._perform_islamic_compliance_check(task)

            # Ministry coordination if required
            if task.config.multi_ministry_coordination:
                task.status = IraqiTaskStatus.MINISTRY_COORDINATION
                await self._perform_ministry_coordination(task)

            # Government portal authentication if required
            if task.task_type == IraqiTaskType.GOVERNMENT_PORTAL:
                task.status = IraqiTaskStatus.GOVERNMENT_PORTAL_ACCESS
                await self._authenticate_government_portal(task)

            # Execute the actual task
            task.status = IraqiTaskStatus.EXECUTING
            result = await self._execute_task_core(task)

            # Store results and mark complete
            task.results = result
            task.status = IraqiTaskStatus.COMPLETED
            task.completed_at = datetime.now(timezone.utc)

            logger.info(f"Iraqi task completed successfully: {task.task_id}")

        except Exception as e:
            # Handle task failure
            await self._handle_task_failure(task, str(e))

        finally:
            # Always clean up
            self._task_locks.discard(task.task_id)
            if task.task_id in self._active_tasks:
                del self._active_tasks[task.task_id]

    async def _perform_cultural_validation(self, task: IraqiTask) -> None:
        """Perform cultural validation for Iraqi context"""

        # This would integrate with cultural validation service
        # For now, basic validation

        if task.url:
            # Check if URL is culturally appropriate
            if not await self._is_culturally_appropriate_url(task.url):
                raise TaskExecutionError("URL failed cultural validation")

        task.cultural_validation_status = "approved"

    async def _perform_islamic_compliance_check(self, task: IraqiTask) -> None:
        """Perform Islamic compliance validation"""

        # Check task parameters for Islamic compliance
        for key, value in task.parameters.items():
            if isinstance(value, str):
                if not await self._is_islamically_compliant_content(value):
                    raise TaskExecutionError(
                        f"Parameter {key} failed Islamic compliance"
                    )

        task.islamic_compliance_status = "approved"

    async def _authenticate_government_portal(self, task: IraqiTask) -> None:
        """Authenticate with Iraqi government portal"""

        if not task.user_id or not task.institution_id:
            raise TaskExecutionError("Government portal access requires authentication")

        # This would integrate with the auth service
        # For now, just mark as verified
        task.security_clearance_verified = True

    async def _execute_task_core(self, task: IraqiTask) -> Dict[str, Any]:
        """Execute the core task logic"""

        # This would integrate with the actual task execution system
        # (browser automation, API calls, etc.)

        return {
            "task_id": task.task_id,
            "execution_time": datetime.now(timezone.utc).isoformat(),
            "status": "success",
            "result": f"Task {task.task_type} completed successfully",
        }

    async def _handle_task_failure(self, task: IraqiTask, error: str) -> None:
        """Handle task execution failure with retry logic"""

        task.error_message = error
        task.retry_count += 1

        # Check if we should retry
        if task.retry_count < task.config.max_retries:
            # Schedule retry
            retry_delay = timedelta(minutes=task.config.retry_delay_minutes)
            task.scheduled_at = datetime.now(timezone.utc) + retry_delay
            task.status = IraqiTaskStatus.SCHEDULED

            # Add back to queue
            self._task_queues[task.priority].append(task)

            logger.info(f"Scheduled retry {task.retry_count} for task {task.task_id}")

        else:
            # Max retries reached
            task.status = IraqiTaskStatus.FAILED
            task.completed_at = datetime.now(timezone.utc)

            logger.error(
                f"Task failed after {task.retry_count} retries: {task.task_id}"
            )

    # Helper methods for Iraqi business logic

    async def _is_iraqi_business_hours(self, current_time: datetime) -> bool:
        """Check if current time is within Iraqi business hours"""

        # Check if it's a work day
        if current_time.weekday() not in self.business_schedule.work_days:
            return False

        # Check work hours (adjust for Ramadan)
        if await self._is_ramadan_period(current_time):
            start_hour = self.business_schedule.ramadan_work_start
            end_hour = self.business_schedule.ramadan_work_end
        else:
            start_hour = self.business_schedule.work_start_hour
            end_hour = self.business_schedule.work_end_hour

        return start_hour <= current_time.hour < end_hour

    async def _is_peak_hours(self, current_time: datetime) -> bool:
        """Check if current time is during peak government portal hours"""

        return (
            self.business_schedule.peak_hours_start
            <= current_time.hour
            < self.business_schedule.peak_hours_end
        )

    async def _is_ramadan_period(self, current_time: datetime) -> bool:
        """Check if current time is during Ramadan"""

        # This would integrate with Islamic calendar
        # For now, return False as placeholder
        return False

    async def _is_islamic_holiday(self, date: datetime) -> bool:
        """Check if date is an Islamic holiday"""

        # This would integrate with Islamic calendar
        # For now, return False as placeholder
        return False

    async def _is_iraqi_government_domain(self, url: str) -> bool:
        """Check if URL is an Iraqi government domain"""

        iraqi_gov_domains = [
            ".gov.iq",
            ".edu.iq",
            "moi.gov.iq",
            "mot.gov.iq",
            "moj.gov.iq",
        ]

        return any(domain in url.lower() for domain in iraqi_gov_domains)

    async def _is_culturally_appropriate_url(self, url: str) -> bool:
        """Check if URL is culturally appropriate for Iraqi context"""

        # Basic prohibited domains check
        prohibited_domains = ["gambling", "casino", "alcohol", "adult", "dating"]

        url_lower = url.lower()
        return not any(domain in url_lower for domain in prohibited_domains)

    async def _is_islamically_compliant_content(self, content: str) -> bool:
        """Check if content is Islamically compliant"""

        prohibited_terms = [
            "interest",
            "usury",
            "riba",
            "gambling",
            "alcohol",
            "casino",
            "lottery",
            "adult content",
            "pornography",
        ]

        content_lower = content.lower()
        return not any(term in content_lower for term in prohibited_terms)

    async def get_task_status(self, task_id: str) -> Optional[Dict[str, Any]]:
        """Get current status of a task"""

        # Check active tasks first
        if task_id in self._active_tasks:
            task = self._active_tasks[task_id]
            return task.dict()

        # Check queues
        for queue in self._task_queues.values():
            for task in queue:
                if task.task_id == task_id:
                    return task.dict()

        return None

    async def cancel_task(self, task_id: str) -> bool:
        """Cancel a pending or running task"""

        # Check active tasks
        if task_id in self._active_tasks:
            task = self._active_tasks[task_id]
            task.status = IraqiTaskStatus.CANCELLED
            return True

        # Check queues
        for queue in self._task_queues.values():
            for task in queue:
                if task.task_id == task_id:
                    task.status = IraqiTaskStatus.CANCELLED
                    queue.remove(task)
                    return True

        return False

    async def get_queue_status(self) -> Dict[str, Any]:
        """Get current status of all task queues"""

        return {
            "queues": {
                priority.value: len(queue)
                for priority, queue in self._task_queues.items()
            },
            "active_tasks": len(self._active_tasks),
            "scheduler_running": self._scheduler_running,
        }
