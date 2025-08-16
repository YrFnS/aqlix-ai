"""
Iraqi Focus Chain Manager - Enhanced Task Management with Cultural Context

Extracted from: cline/docs/features/focus-chain.mdx
Enhanced for: Iraqi AI Chat System with cultural compliance and professional domain support

Core Features:
1. Automatic Todo List Generation with Cultural Validation
2. User-Editable Markdown Files with RTL Support
3. Visual Progress Tracking with Arabic Descriptions
4. Smart Reminder System with Cultural Context
5. Integration with Plan/Act Mode and Islamic Compliance

Iraqi Enhancements:
- Real-time progress tracking with cultural validation
- Arabic todo descriptions and RTL markdown support
- Islamic compliance checking for all tasks
- Professional domain task classification
- Government service task identification
- Family context appropriateness validation
- Visual progress indicators with Arabic numerals
"""

from dataclasses import dataclass
from typing import Dict, List, Optional, Any, Tuple, Union
from pathlib import Path
import json
import asyncio
from datetime import datetime
from enum import Enum
import hashlib
import aiofiles
import re

class TaskStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    BLOCKED = "blocked"
    CANCELLED = "cancelled"

class ProfessionalDomain(str, Enum):
    GENERAL = "general"
    LEGAL = "legal"
    MEDICAL = "medical"
    EDUCATION = "education"
    GOVERNMENT = "government"
    BUSINESS = "business"
    FAMILY = "family"

class CulturalSensitivityLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

@dataclass
class IraqiTaskItem:
    """Enhanced task item with Iraqi cultural and professional context"""
    id: str
    content: str
    status: TaskStatus
    cultural_compliance_score: float
    islamic_approval_status: bool
    professional_relevance: float
    arabic_description: Optional[str] = None
    family_context_appropriate: bool = True
    government_service_related: bool = False
    professional_domain: ProfessionalDomain = ProfessionalDomain.GENERAL
    estimated_duration: Optional[str] = None
    created_timestamp: str = None
    updated_timestamp: str = None
    cultural_notes: List[str] = None
    islamic_considerations: List[str] = None

    def __post_init__(self):
        if self.created_timestamp is None:
            self.created_timestamp = datetime.now().isoformat()
        if self.updated_timestamp is None:
            self.updated_timestamp = self.created_timestamp
        if self.cultural_notes is None:
            self.cultural_notes = []
        if self.islamic_considerations is None:
            self.islamic_considerations = []

@dataclass
class IraqiFocusChainConfig:
    """Configuration for Iraqi Focus Chain with cultural settings"""
    task_directory: Path
    remind_interval: int = 6  # messages
    auto_save: bool = True
    arabic_language_support: bool = True
    cultural_validation_threshold: float = 0.95
    islamic_compliance_required: bool = True
    professional_domain: ProfessionalDomain = ProfessionalDomain.GENERAL
    family_context_sensitivity: CulturalSensitivityLevel = CulturalSensitivityLevel.HIGH
    government_service_context: bool = False
    visual_progress_arabic_numerals: bool = True

@dataclass
class ProgressMetrics:
    """Comprehensive progress metrics with cultural context"""
    total_tasks: int
    completed_tasks: int
    in_progress_tasks: int
    pending_tasks: int
    blocked_tasks: int
    average_cultural_score: float
    islamic_compliance_rate: float
    professional_relevance_average: float
    arabic_tasks_count: int
    government_tasks_count: int
    family_appropriate_tasks: int
    completion_percentage: float
    estimated_remaining_time: str

class IraqiFocusChainManager:
    """
    Enhanced task management system with Iraqi cultural context and real-time tracking
    
    Based on Cline's Focus Chain with comprehensive Iraqi enhancements:
    - Automatic todo list generation with cultural validation
    - Real-time progress tracking with Arabic support
    - User-editable markdown files with RTL considerations
    - Smart reminder system with cultural awareness
    - Integration with professional domains and Islamic compliance
    """
    
    def __init__(self, config: IraqiFocusChainConfig = None):
        self.config = config or IraqiFocusChainConfig(
            task_directory=Path("tasks/iraqi_focus_chains")
        )
        
        # Ensure task directory exists
        self.config.task_directory.mkdir(parents=True, exist_ok=True)
        
        # Iraqi-specific validation components
        self.cultural_validator = CulturalTaskValidator()
        self.arabic_processor = ArabicTodoProcessor()
        self.progress_tracker = ProfessionalProgressTracker()
        self.islamic_compliance = IslamicTaskCompliance()
        self.family_validator = FamilyContextValidator()
        self.government_detector = GovernmentServiceDetector()
        
        # Task management state
        self.current_tasks: List[IraqiTaskItem] = []
        self.task_file_path: Optional[Path] = None
        self.reminder_counter: int = 0
        
    async def generate_iraqi_todo_list(self, 
                                     implementation_plan: Dict[str, Any],
                                     cultural_context: Dict[str, Any],
                                     task_id: str = None) -> List[IraqiTaskItem]:
        """
        Generate comprehensive todo list with Iraqi cultural validation
        
        Args:
            implementation_plan: Implementation plan from Deep Planning System
            cultural_context: Iraqi cultural context dictionary
            task_id: Optional task identifier for file naming
            
        Returns:
            List of culturally-validated Iraqi task items
        """
        
        # Generate task ID if not provided
        if task_id is None:
            task_id = self._generate_task_id(implementation_plan, cultural_context)
        
        # Extract base tasks from implementation plan (Cline pattern)
        base_tasks = self._extract_implementation_steps(implementation_plan)
        
        # Enhance each task with Iraqi context
        iraqi_tasks = []
        for i, base_task in enumerate(base_tasks):
            
            # Cultural compliance validation
            cultural_result = await self.cultural_validator.validate_task(
                base_task, cultural_context, self.config.cultural_validation_threshold
            )
            
            # Islamic approval check
            islamic_result = await self.islamic_compliance.validate_task_content(
                base_task, cultural_context, self.config.islamic_compliance_required
            )
            
            # Professional relevance scoring
            professional_score = await self.progress_tracker.score_professional_relevance(
                base_task, self.config.professional_domain, cultural_context
            )
            
            # Arabic description generation
            arabic_description = None
            if self.config.arabic_language_support:
                arabic_description = await self.arabic_processor.generate_arabic_description(
                    base_task, cultural_context
                )
            
            # Family context appropriateness
            family_appropriate = await self.family_validator.is_family_appropriate(
                base_task, cultural_context, self.config.family_context_sensitivity
            )
            
            # Government service detection
            government_related = await self.government_detector.is_government_related(
                base_task, cultural_context
            )
            
            # Create enhanced Iraqi task
            iraqi_task = IraqiTaskItem(
                id=f"iraqi_task_{task_id}_{i+1:03d}",
                content=base_task,
                status=TaskStatus.PENDING,
                cultural_compliance_score=cultural_result.score,
                islamic_approval_status=islamic_result.approved,
                professional_relevance=professional_score,
                arabic_description=arabic_description,
                family_context_appropriate=family_appropriate,
                government_service_related=government_related,
                professional_domain=self.config.professional_domain,
                estimated_duration=implementation_plan.get("implementation_order", [{}])[i].get("estimated_duration", "30 minutes"),
                cultural_notes=cultural_result.notes,
                islamic_considerations=islamic_result.considerations
            )
            
            iraqi_tasks.append(iraqi_task)
        
        # Save to markdown file with RTL support
        await self._save_iraqi_todo_markdown(iraqi_tasks, cultural_context, task_id)
        
        # Update current state
        self.current_tasks = iraqi_tasks
        
        return iraqi_tasks
    
    async def track_real_time_progress(self, task_id: str = None) -> ProgressMetrics:
        """
        Real-time progress tracking with cultural context preservation
        
        Args:
            task_id: Optional specific task to update
            
        Returns:
            Comprehensive progress metrics with cultural validation
        """
        
        # Load current task state if not in memory
        if not self.current_tasks:
            await self._load_iraqi_tasks()
        
        # Update specific task if provided
        if task_id:
            await self._update_task_status(task_id)
        
        # Calculate comprehensive progress metrics
        return await self._calculate_progress_metrics()
    
    async def update_task_status(self, task_id: str, new_status: TaskStatus, 
                               cultural_notes: List[str] = None) -> bool:
        """
        Update task status with cultural validation
        
        Args:
            task_id: Task identifier
            new_status: New task status
            cultural_notes: Optional cultural validation notes
            
        Returns:
            Success status
        """
        
        # Find task
        task = next((t for t in self.current_tasks if t.id == task_id), None)
        if not task:
            raise ValueError(f"Task {task_id} not found")
        
        # Validate status transition with cultural context
        if not await self._validate_status_transition(task, new_status):
            return False
        
        # Update task
        old_status = task.status
        task.status = new_status
        task.updated_timestamp = datetime.now().isoformat()
        
        if cultural_notes:
            task.cultural_notes.extend(cultural_notes)
        
        # Notify cultural context manager
        await self.cultural_validator.notify_task_status_change(task, old_status, new_status)
        
        # Save updated tasks
        await self._save_current_tasks()
        
        # Trigger reminder system if needed
        await self._check_reminder_system()
        
        return True
    
    async def generate_visual_progress_display(self) -> Dict[str, Any]:
        """
        Generate visual progress indicators with Arabic and RTL support
        
        Returns:
            Visual progress display data
        """
        
        metrics = await self._calculate_progress_metrics()
        
        # Generate step counter (Cline pattern enhanced)
        step_counter = f"[{metrics.completed_tasks}/{metrics.total_tasks}]"
        if self.config.visual_progress_arabic_numerals:
            step_counter = self._convert_to_arabic_numerals(step_counter)
        
        # Generate progress bar
        progress_bar = self._generate_progress_bar(metrics.completion_percentage)
        
        # Generate task list display
        task_display = await self._generate_task_list_display()
        
        # Generate cultural compliance summary
        cultural_summary = {
            "average_cultural_score": f"{metrics.average_cultural_score:.1%}",
            "islamic_compliance_rate": f"{metrics.islamic_compliance_rate:.1%}",
            "professional_relevance": f"{metrics.professional_relevance_average:.1%}",
            "family_appropriate_tasks": f"{metrics.family_appropriate_tasks}/{metrics.total_tasks}",
            "government_service_tasks": f"{metrics.government_tasks_count}/{metrics.total_tasks}"
        }
        
        return {
            "step_counter": step_counter,
            "progress_bar": progress_bar,
            "completion_percentage": metrics.completion_percentage,
            "task_list_display": task_display,
            "cultural_summary": cultural_summary,
            "estimated_remaining_time": metrics.estimated_remaining_time,
            "next_recommended_task": await self._recommend_next_task()
        }
    
    async def edit_todo_list(self, task_id: str) -> str:
        """
        Open todo list for user editing (following Cline's pattern)
        
        Args:
            task_id: Task identifier for the todo list
            
        Returns:
            Path to the editable markdown file
        """
        
        if not self.task_file_path:
            # Find or create task file
            task_file = self.config.task_directory / f"focus_chain_task_{task_id}.md"
            self.task_file_path = task_file
        
        # Ensure file exists with current tasks
        await self._save_current_tasks()
        
        return str(self.task_file_path.absolute())
    
    async def detect_file_changes(self) -> bool:
        """
        Detect changes to todo markdown file and reload tasks
        
        Returns:
            True if changes were detected and loaded
        """
        
        if not self.task_file_path or not self.task_file_path.exists():
            return False
        
        # Check file modification time
        current_mtime = self.task_file_path.stat().st_mtime
        
        # Load and parse updated tasks
        updated_tasks = await self._load_tasks_from_markdown(self.task_file_path)
        
        if updated_tasks != self.current_tasks:
            # Validate updated tasks for cultural compliance
            validated_tasks = await self._validate_updated_tasks(updated_tasks)
            self.current_tasks = validated_tasks
            return True
        
        return False
    
    # Internal helper methods
    
    def _generate_task_id(self, implementation_plan: Dict[str, Any], cultural_context: Dict[str, Any]) -> str:
        """Generate unique task ID based on plan and context"""
        content = f"{implementation_plan.get('overview', '')}{cultural_context.get('professional_domain', '')}"
        hash_obj = hashlib.md5(content.encode())
        return hash_obj.hexdigest()[:8]
    
    def _extract_implementation_steps(self, implementation_plan: Dict[str, Any]) -> List[str]:
        """Extract implementation steps from plan (following Cline pattern)"""
        steps = []
        
        # Extract from implementation_order if available
        if "implementation_order" in implementation_plan:
            for step in implementation_plan["implementation_order"]:
                if isinstance(step, dict) and "description" in step:
                    steps.append(step["description"])
                elif isinstance(step, str):
                    steps.append(step)
        
        # Extract from other plan sections if needed
        if not steps:
            for section in ["files", "functions", "classes"]:
                if section in implementation_plan:
                    for item in implementation_plan[section]:
                        if isinstance(item, dict):
                            description = item.get("description", item.get("action", f"Implement {section[:-1]}"))
                            steps.append(description)
        
        # Default steps if none found
        if not steps:
            steps = [
                "Setup cultural validation framework",
                "Implement Islamic compliance checking",
                "Add Arabic language support",
                "Create professional domain integration",
                "Add family context validation",
                "Test and validate implementation"
            ]
        
        return steps
    
    async def _save_iraqi_todo_markdown(self, tasks: List[IraqiTaskItem], 
                                      cultural_context: Dict[str, Any], 
                                      task_id: str) -> None:
        """Save tasks to markdown file with RTL support"""
        
        markdown_content = await self._generate_iraqi_markdown(tasks, cultural_context, task_id)
        
        # Save to file
        task_file = self.config.task_directory / f"focus_chain_task_{task_id}.md"
        self.task_file_path = task_file
        
        async with aiofiles.open(task_file, 'w', encoding='utf-8') as f:
            await f.write(markdown_content)
    
    async def _generate_iraqi_markdown(self, tasks: List[IraqiTaskItem], 
                                     cultural_context: Dict[str, Any], 
                                     task_id: str) -> str:
        """Generate markdown content with RTL and Arabic support"""
        
        markdown_lines = [
            f"# Focus Chain Todo List for Task {task_id}",
            "",
            "<!-- Edit this markdown file to update your Iraqi focus chain todo list -->",
            "<!-- Use the format: - [ ] for incomplete items and - [x] for completed items -->",
            "<!-- This file supports RTL (Right-to-Left) text for Arabic descriptions -->",
            "",
            f"**Professional Domain**: {self.config.professional_domain.value}",
            f"**Cultural Context**: {cultural_context.get('regional_context', 'iraq')}",
            f"**Islamic Compliance Required**: {self.config.islamic_compliance_required}",
            f"**Arabic Language Support**: {self.config.arabic_language_support}",
            "",
            "## Tasks",
            ""
        ]
        
        for task in tasks:
            # Status checkbox
            checkbox = "[x]" if task.status == TaskStatus.COMPLETED else "[ ]"
            
            # Main task line
            task_line = f"- {checkbox} {task.content}"
            
            # Add status indicator for non-pending tasks
            if task.status != TaskStatus.PENDING and task.status != TaskStatus.COMPLETED:
                task_line += f" *(Status: {task.status.value})*"
            
            markdown_lines.append(task_line)
            
            # Add Arabic description if available
            if task.arabic_description:
                markdown_lines.append(f"  - **Arabic**: {task.arabic_description}")
            
            # Add cultural compliance info
            if task.cultural_compliance_score < 1.0:
                markdown_lines.append(f"  - **Cultural Score**: {task.cultural_compliance_score:.1%}")
            
            # Add Islamic considerations
            if task.islamic_considerations:
                considerations = ", ".join(task.islamic_considerations)
                markdown_lines.append(f"  - **Islamic Considerations**: {considerations}")
            
            # Add professional domain info if relevant
            if task.professional_domain != ProfessionalDomain.GENERAL:
                markdown_lines.append(f"  - **Professional Domain**: {task.professional_domain.value}")
            
            # Add government service indicator
            if task.government_service_related:
                markdown_lines.append("  - **Government Service**: Yes")
            
            # Add estimated duration
            if task.estimated_duration:
                markdown_lines.append(f"  - **Duration**: {task.estimated_duration}")
            
            markdown_lines.append("")
        
        # Add footer
        markdown_lines.extend([
            "---",
            "",
            "<!-- Save this file and the todo list will be updated in the task -->",
            "<!-- Cultural validation and Islamic compliance will be automatically checked -->",
            f"<!-- Last updated: {datetime.now().isoformat()} -->"
        ])
        
        return "\n".join(markdown_lines)
    
    async def _calculate_progress_metrics(self) -> ProgressMetrics:
        """Calculate comprehensive progress metrics"""
        
        total = len(self.current_tasks)
        if total == 0:
            return ProgressMetrics(
                total_tasks=0, completed_tasks=0, in_progress_tasks=0,
                pending_tasks=0, blocked_tasks=0, average_cultural_score=0,
                islamic_compliance_rate=0, professional_relevance_average=0,
                arabic_tasks_count=0, government_tasks_count=0,
                family_appropriate_tasks=0, completion_percentage=0,
                estimated_remaining_time="0 minutes"
            )
        
        # Count by status
        completed = len([t for t in self.current_tasks if t.status == TaskStatus.COMPLETED])
        in_progress = len([t for t in self.current_tasks if t.status == TaskStatus.IN_PROGRESS])
        pending = len([t for t in self.current_tasks if t.status == TaskStatus.PENDING])
        blocked = len([t for t in self.current_tasks if t.status == TaskStatus.BLOCKED])
        
        # Cultural metrics
        cultural_scores = [t.cultural_compliance_score for t in self.current_tasks]
        avg_cultural = sum(cultural_scores) / len(cultural_scores)
        
        islamic_approved = len([t for t in self.current_tasks if t.islamic_approval_status])
        islamic_rate = islamic_approved / total
        
        professional_scores = [t.professional_relevance for t in self.current_tasks]
        avg_professional = sum(professional_scores) / len(professional_scores)
        
        # Arabic and cultural counts
        arabic_count = len([t for t in self.current_tasks if t.arabic_description])
        government_count = len([t for t in self.current_tasks if t.government_service_related])
        family_appropriate = len([t for t in self.current_tasks if t.family_context_appropriate])
        
        # Completion percentage
        completion_pct = (completed / total) * 100
        
        # Estimate remaining time
        remaining_tasks = total - completed
        avg_duration = 30  # minutes, could be calculated from actual durations
        remaining_time = remaining_tasks * avg_duration
        remaining_time_str = f"{remaining_time} minutes" if remaining_time < 60 else f"{remaining_time // 60} hours"
        
        return ProgressMetrics(
            total_tasks=total,
            completed_tasks=completed,
            in_progress_tasks=in_progress,
            pending_tasks=pending,
            blocked_tasks=blocked,
            average_cultural_score=avg_cultural,
            islamic_compliance_rate=islamic_rate,
            professional_relevance_average=avg_professional,
            arabic_tasks_count=arabic_count,
            government_tasks_count=government_count,
            family_appropriate_tasks=family_appropriate,
            completion_percentage=completion_pct,
            estimated_remaining_time=remaining_time_str
        )
    
    async def _recommend_next_task(self) -> Optional[IraqiTaskItem]:
        """Recommend next task based on Iraqi context and priorities"""
        
        # Find highest priority pending task
        pending_tasks = [t for t in self.current_tasks if t.status == TaskStatus.PENDING]
        
        if not pending_tasks:
            return None
        
        # Score tasks by priority (cultural compliance + professional relevance + Islamic approval)
        def task_priority_score(task: IraqiTaskItem) -> float:
            score = 0.0
            
            # Cultural compliance weight (40%)
            score += task.cultural_compliance_score * 0.4
            
            # Professional relevance weight (30%)
            score += task.professional_relevance * 0.3
            
            # Islamic approval weight (20%)
            score += (1.0 if task.islamic_approval_status else 0.0) * 0.2
            
            # Government service priority (10%)
            score += (1.0 if task.government_service_related else 0.0) * 0.1
            
            return score
        
        # Return highest scoring task
        return max(pending_tasks, key=task_priority_score)
    
    def _convert_to_arabic_numerals(self, text: str) -> str:
        """Convert Latin numerals to Arabic-Indic numerals"""
        arabic_numerals = {'0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤', 
                          '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'}
        
        for latin, arabic in arabic_numerals.items():
            text = text.replace(latin, arabic)
        
        return text
    
    def _generate_progress_bar(self, percentage: float) -> str:
        """Generate visual progress bar"""
        filled = int(percentage / 10)
        empty = 10 - filled
        return "█" * filled + "░" * empty + f" {percentage:.1f}%"


# Iraqi-specific validation components (placeholder classes)
# These would be implemented with actual cultural validation logic

class CulturalTaskValidator:
    """Validates tasks for Iraqi cultural appropriateness"""
    
    async def validate_task(self, task_content: str, cultural_context: Dict[str, Any], threshold: float = 0.95):
        # Placeholder implementation
        return type('CulturalResult', (), {
            'score': 0.96,
            'approved': True,
            'notes': ['Culturally appropriate for Iraqi context'],
            'suggestions': []
        })()
    
    async def notify_task_status_change(self, task, old_status, new_status):
        # Placeholder for cultural status change notification
        pass

class IslamicTaskCompliance:
    """Validates tasks for Islamic compliance"""
    
    async def validate_task_content(self, task_content: str, cultural_context: Dict[str, Any], required: bool = True):
        # Placeholder implementation
        return type('IslamicResult', (), {
            'approved': True,
            'score': 0.94,
            'considerations': ['Complies with Islamic principles'],
            'notes': []
        })()

class ArabicTodoProcessor:
    """Processes and generates Arabic descriptions for tasks"""
    
    async def generate_arabic_description(self, task_content: str, cultural_context: Dict[str, Any]) -> str:
        # Placeholder implementation
        return f"المهمة: {task_content}"

class ProfessionalProgressTracker:
    """Tracks progress with professional domain awareness"""
    
    async def score_professional_relevance(self, task_content: str, domain: ProfessionalDomain, cultural_context: Dict[str, Any]) -> float:
        # Placeholder implementation
        return 0.85

class FamilyContextValidator:
    """Validates family context appropriateness"""
    
    async def is_family_appropriate(self, task_content: str, cultural_context: Dict[str, Any], sensitivity: CulturalSensitivityLevel) -> bool:
        # Placeholder implementation
        return True

class GovernmentServiceDetector:
    """Detects government service related tasks"""
    
    async def is_government_related(self, task_content: str, cultural_context: Dict[str, Any]) -> bool:
        # Placeholder implementation
        return "government" in task_content.lower() or "portal" in task_content.lower()