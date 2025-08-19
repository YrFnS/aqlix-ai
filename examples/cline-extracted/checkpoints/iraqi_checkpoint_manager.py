"""
Iraqi Checkpoint Manager - Enhanced Smart Checkpoints with Cultural Context

Extracted from: cline/src/integrations/checkpoints/CheckpointTracker.ts
Enhanced for: Iraqi AI Chat System with comprehensive cultural context preservation

Core Features:
1. Smart checkpoint creation and restoration (Cline pattern)
2. Cultural context preservation across checkpoints  
3. Session state management with Islamic compliance tracking
4. Professional domain context preservation
5. Arabic language processing state checkpointing

Iraqi Enhancements:
- Cultural context preservation in checkpoints (Islamic compliance, family context)
- Professional domain state checkpointing (legal, medical, government services)
- Arabic processing state preservation (RTL layouts, dialect recognition)
- Government service context checkpointing (passport applications, legal documents)
- Payment gateway state management (ZainCash, FastPay integration states)
- Regional service context preservation (Baghdad, Basra, Mosul variations)
- Compliance validation checkpointing for Iraqi standards
"""

from dataclasses import dataclass, asdict
from typing import Dict, List, Optional, Any, Tuple
from enum import Enum
from datetime import datetime
import asyncio
import json
import hashlib
import os
import tempfile
import shutil
from pathlib import Path

class CheckpointType(str, Enum):
    AUTO = "auto"                          # Automatic checkpoint after task steps
    MANUAL = "manual"                      # User-initiated checkpoint
    CULTURAL_VALIDATION = "cultural"       # After cultural validation events
    PROFESSIONAL = "professional"          # Professional domain milestones
    PAYMENT = "payment"                    # Payment gateway integration points
    GOVERNMENT = "government"              # Government service milestones
    SECURITY = "security"                  # Security validation checkpoints

class RestoreMode(str, Enum):
    FULL = "full"                          # Restore everything (task + workspace + cultural context)
    TASK_ONLY = "task_only"               # Restore task context, keep workspace changes
    WORKSPACE_ONLY = "workspace_only"     # Restore workspace, keep task context
    CULTURAL_ONLY = "cultural_only"       # Restore only cultural context
    PROFESSIONAL_ONLY = "professional"   # Restore only professional context

class CulturalContextLevel(str, Enum):
    CRITICAL = "critical"                  # Critical cultural context (Islamic compliance)
    HIGH = "high"                         # High importance (family context, professional ethics)
    MEDIUM = "medium"                     # Medium importance (regional preferences)
    LOW = "low"                           # Low importance (general cultural preferences)

@dataclass
class IraqiCulturalCheckpointData:
    """Cultural context data for checkpoint preservation"""
    islamic_compliance_status: Dict[str, Any]
    family_context_settings: Dict[str, Any]
    professional_domain_state: Dict[str, Any]
    arabic_processing_state: Dict[str, Any]
    government_service_context: Dict[str, Any]
    payment_gateway_states: Dict[str, Any]
    regional_context: Dict[str, Any]
    cultural_validation_history: List[Dict[str, Any]]
    preservation_priority: int
    cultural_context_level: CulturalContextLevel

@dataclass
class CheckpointMetadata:
    """Metadata for checkpoint identification and management"""
    checkpoint_id: str
    task_id: str
    timestamp: datetime
    checkpoint_type: CheckpointType
    commit_hash: Optional[str]
    cultural_significance: float
    professional_relevance: float
    arabic_content_percentage: float
    government_service_involvement: bool
    payment_integration_active: bool
    user_notes: Optional[str]
    validation_scores: Dict[str, float]

@dataclass
class IraqiCheckpoint:
    """Complete Iraqi checkpoint with cultural and professional context"""
    metadata: CheckpointMetadata
    cultural_data: IraqiCulturalCheckpointData
    workspace_state: Dict[str, Any]
    task_context: Dict[str, Any]
    session_state: Dict[str, Any]
    file_changes: List[Dict[str, Any]]
    preservation_quality: float

@dataclass
class CheckpointRestoreResult:
    """Result of checkpoint restoration operation"""
    restore_successful: bool
    restored_checkpoint_id: str
    restore_mode: RestoreMode
    cultural_context_restored: bool
    workspace_restored: bool
    task_context_restored: bool
    restoration_warnings: List[str]
    validation_results: Dict[str, Any]
    post_restore_recommendations: List[str]

class IraqiCheckpointManager:
    """
    Enhanced checkpoint manager with comprehensive Iraqi cultural context preservation
    
    Handles:
    - Smart checkpoint creation and restoration (following Cline patterns)
    - Cultural context preservation across checkpoints and sessions
    - Professional domain state management and restoration
    - Arabic language processing state checkpointing
    - Government service context preservation and validation
    - Payment gateway state management and recovery
    - Regional service context preservation across Iraqi governorates
    - Compliance validation checkpointing for Iraqi standards
    """
    
    def __init__(self, storage_path: str, task_id: str):
        self.storage_path = storage_path
        self.task_id = task_id
        self.workspace_hash = self._generate_workspace_hash()
        
        # Initialize processors
        self.cultural_processor = CulturalContextProcessor()
        self.professional_manager = ProfessionalStateManager()
        self.arabic_state_manager = ArabicProcessingStateManager()
        self.government_context_manager = GovernmentServiceContextManager()
        self.payment_state_manager = PaymentGatewayStateManager()
        self.validation_manager = CheckpointValidationManager()
        
        # Checkpoint storage
        self.checkpoints: Dict[str, IraqiCheckpoint] = {}
        self.checkpoint_history: List[str] = []
        
        # Configuration
        self.config = {
            "enable_cultural_preservation": True,
            "enable_professional_checkpointing": True,
            "enable_arabic_state_preservation": True,
            "enable_government_context_checkpointing": True,
            "enable_payment_state_management": True,
            "auto_checkpoint_on_cultural_events": True,
            "auto_checkpoint_on_professional_milestones": True,
            "preserve_islamic_compliance_state": True,
            "preserve_family_context_settings": True,
            "min_cultural_significance_for_checkpoint": 0.60,
            "max_checkpoints_per_task": 50,
            "checkpoint_retention_days": 30,
            "cultural_validation_timeout": 15.0  # seconds
        }
        
        # Initialize checkpoint storage
        self._initialize_checkpoint_storage()
    
    async def create_checkpoint(self, 
                              checkpoint_type: CheckpointType = CheckpointType.AUTO,
                              user_notes: Optional[str] = None,
                              force_creation: bool = False) -> str:
        """
        Create a new checkpoint with comprehensive Iraqi cultural context preservation
        
        Args:
            checkpoint_type: Type of checkpoint being created
            user_notes: Optional user notes for the checkpoint
            force_creation: Force creation even if significance is low
            
        Returns:
            Checkpoint ID of the created checkpoint
        """
        
        # Generate checkpoint ID
        checkpoint_id = self._generate_checkpoint_id(checkpoint_type)
        
        # Collect current cultural context
        cultural_data = await self._collect_cultural_context()
        
        # Assess cultural significance
        cultural_significance = await self._assess_cultural_significance(cultural_data, checkpoint_type)
        
        # Check if checkpoint should be created
        if not force_creation and cultural_significance < self.config["min_cultural_significance_for_checkpoint"]:
            return None  # Skip checkpoint if not culturally significant
        
        # Collect workspace state
        workspace_state = await self._collect_workspace_state()
        
        # Collect task context
        task_context = await self._collect_task_context()
        
        # Collect session state
        session_state = await self._collect_session_state()
        
        # Collect file changes
        file_changes = await self._collect_file_changes()
        
        # Calculate validation scores
        validation_scores = await self._calculate_validation_scores(cultural_data, workspace_state)
        
        # Create checkpoint metadata
        metadata = CheckpointMetadata(
            checkpoint_id=checkpoint_id,
            task_id=self.task_id,
            timestamp=datetime.now(),
            checkpoint_type=checkpoint_type,
            commit_hash=await self._create_git_commit(checkpoint_id),
            cultural_significance=cultural_significance,
            professional_relevance=cultural_data.professional_domain_state.get("relevance_score", 0.0),
            arabic_content_percentage=cultural_data.arabic_processing_state.get("content_percentage", 0.0),
            government_service_involvement=bool(cultural_data.government_service_context),
            payment_integration_active=bool(cultural_data.payment_gateway_states),
            user_notes=user_notes,
            validation_scores=validation_scores
        )
        
        # Calculate preservation quality
        preservation_quality = await self._calculate_preservation_quality(cultural_data, workspace_state)
        
        # Create checkpoint
        checkpoint = IraqiCheckpoint(
            metadata=metadata,
            cultural_data=cultural_data,
            workspace_state=workspace_state,
            task_context=task_context,
            session_state=session_state,
            file_changes=file_changes,
            preservation_quality=preservation_quality
        )
        
        # Store checkpoint
        self.checkpoints[checkpoint_id] = checkpoint
        self.checkpoint_history.append(checkpoint_id)
        
        # Persist checkpoint to storage
        await self._persist_checkpoint(checkpoint)
        
        # Cleanup old checkpoints if needed
        await self._cleanup_old_checkpoints()
        
        return checkpoint_id
    
    async def restore_checkpoint(self, 
                               checkpoint_id: str, 
                               restore_mode: RestoreMode = RestoreMode.FULL,
                               validate_before_restore: bool = True) -> CheckpointRestoreResult:
        """
        Restore from a checkpoint with comprehensive validation and cultural preservation
        
        Args:
            checkpoint_id: ID of checkpoint to restore
            restore_mode: Mode of restoration (full, task only, workspace only, etc.)
            validate_before_restore: Whether to validate before restoring
            
        Returns:
            Comprehensive restoration result
        """
        
        # Load checkpoint if not in memory
        if checkpoint_id not in self.checkpoints:
            await self._load_checkpoint(checkpoint_id)
        
        checkpoint = self.checkpoints.get(checkpoint_id)
        if not checkpoint:
            raise ValueError(f"Checkpoint {checkpoint_id} not found")
        
        # Validate checkpoint before restoration
        validation_results = {}
        restoration_warnings = []
        
        if validate_before_restore:
            validation_results = await self.validation_manager.validate_checkpoint_integrity(checkpoint)
            if not validation_results.get("integrity_valid", False):
                restoration_warnings.append("Checkpoint integrity validation failed")
        
        # Perform restoration based on mode
        cultural_context_restored = False
        workspace_restored = False
        task_context_restored = False
        
        try:
            if restore_mode in [RestoreMode.FULL, RestoreMode.CULTURAL_ONLY]:
                # Restore cultural context
                await self._restore_cultural_context(checkpoint.cultural_data)
                cultural_context_restored = True
            
            if restore_mode in [RestoreMode.FULL, RestoreMode.WORKSPACE_ONLY]:
                # Restore workspace state
                await self._restore_workspace_state(checkpoint.workspace_state, checkpoint.file_changes)
                workspace_restored = True
            
            if restore_mode in [RestoreMode.FULL, RestoreMode.TASK_ONLY]:
                # Restore task context
                await self._restore_task_context(checkpoint.task_context)
                task_context_restored = True
            
            if restore_mode == RestoreMode.PROFESSIONAL_ONLY:
                # Restore only professional context
                await self._restore_professional_context(checkpoint.cultural_data.professional_domain_state)
                cultural_context_restored = True
            
            # Restore session state for full restoration
            if restore_mode == RestoreMode.FULL:
                await self._restore_session_state(checkpoint.session_state)
            
            # Generate post-restore recommendations
            post_restore_recommendations = await self._generate_post_restore_recommendations(
                checkpoint, restore_mode, validation_results
            )
            
            return CheckpointRestoreResult(
                restore_successful=True,
                restored_checkpoint_id=checkpoint_id,
                restore_mode=restore_mode,
                cultural_context_restored=cultural_context_restored,
                workspace_restored=workspace_restored,
                task_context_restored=task_context_restored,
                restoration_warnings=restoration_warnings,
                validation_results=validation_results,
                post_restore_recommendations=post_restore_recommendations
            )
            
        except Exception as e:
            restoration_warnings.append(f"Restoration failed: {str(e)}")
            return CheckpointRestoreResult(
                restore_successful=False,
                restored_checkpoint_id=checkpoint_id,
                restore_mode=restore_mode,
                cultural_context_restored=False,
                workspace_restored=False,
                task_context_restored=False,
                restoration_warnings=restoration_warnings,
                validation_results=validation_results,
                post_restore_recommendations=[]
            )
    
    async def list_checkpoints(self, 
                             filter_by_type: Optional[CheckpointType] = None,
                             min_cultural_significance: Optional[float] = None) -> List[CheckpointMetadata]:
        """
        List available checkpoints with optional filtering
        
        Args:
            filter_by_type: Filter by checkpoint type
            min_cultural_significance: Minimum cultural significance threshold
            
        Returns:
            List of checkpoint metadata matching filters
        """
        
        checkpoints = []
        
        for checkpoint_id in self.checkpoint_history:
            if checkpoint_id not in self.checkpoints:
                await self._load_checkpoint(checkpoint_id)
            
            checkpoint = self.checkpoints.get(checkpoint_id)
            if not checkpoint:
                continue
            
            metadata = checkpoint.metadata
            
            # Apply filters
            if filter_by_type and metadata.checkpoint_type != filter_by_type:
                continue
            
            if min_cultural_significance and metadata.cultural_significance < min_cultural_significance:
                continue
            
            checkpoints.append(metadata)
        
        # Sort by timestamp (newest first)
        checkpoints.sort(key=lambda x: x.timestamp, reverse=True)
        
        return checkpoints
    
    async def get_checkpoint_diff(self, 
                                from_checkpoint_id: str, 
                                to_checkpoint_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Get differences between checkpoints or between checkpoint and current state
        
        Args:
            from_checkpoint_id: Starting checkpoint ID
            to_checkpoint_id: Ending checkpoint ID (None for current state)
            
        Returns:
            Comprehensive diff information
        """
        
        # Load checkpoints
        if from_checkpoint_id not in self.checkpoints:
            await self._load_checkpoint(from_checkpoint_id)
        
        from_checkpoint = self.checkpoints[from_checkpoint_id]
        
        if to_checkpoint_id:
            if to_checkpoint_id not in self.checkpoints:
                await self._load_checkpoint(to_checkpoint_id)
            to_checkpoint = self.checkpoints[to_checkpoint_id]
            to_cultural_data = to_checkpoint.cultural_data
            to_workspace_state = to_checkpoint.workspace_state
        else:
            # Compare with current state
            to_cultural_data = await self._collect_cultural_context()
            to_workspace_state = await self._collect_workspace_state()
        
        # Calculate differences
        cultural_diff = await self._calculate_cultural_diff(from_checkpoint.cultural_data, to_cultural_data)
        workspace_diff = await self._calculate_workspace_diff(from_checkpoint.workspace_state, to_workspace_state)
        file_diff = await self._calculate_file_diff(from_checkpoint_id, to_checkpoint_id)
        
        return {
            "from_checkpoint": from_checkpoint_id,
            "to_checkpoint": to_checkpoint_id or "current_state",
            "cultural_differences": cultural_diff,
            "workspace_differences": workspace_diff,
            "file_differences": file_diff,
            "significance_change": await self._calculate_significance_change(
                from_checkpoint.metadata.cultural_significance,
                to_cultural_data if not to_checkpoint_id else to_checkpoint.metadata.cultural_significance
            )
        }
    
    # Internal methods
    
    async def _collect_cultural_context(self) -> IraqiCulturalCheckpointData:
        """Collect current cultural context for checkpointing"""
        
        # Collect Islamic compliance status
        islamic_compliance = await self.cultural_processor.get_current_islamic_compliance_state()
        
        # Collect family context settings
        family_context = await self.cultural_processor.get_current_family_context_settings()
        
        # Collect professional domain state
        professional_state = await self.professional_manager.get_current_professional_state()
        
        # Collect Arabic processing state
        arabic_state = await self.arabic_state_manager.get_current_arabic_processing_state()
        
        # Collect government service context
        government_context = await self.government_context_manager.get_current_government_context()
        
        # Collect payment gateway states
        payment_states = await self.payment_state_manager.get_current_payment_gateway_states()
        
        # Collect regional context
        regional_context = await self.cultural_processor.get_current_regional_context()
        
        # Collect cultural validation history
        validation_history = await self.cultural_processor.get_cultural_validation_history()
        
        # Calculate preservation priority
        preservation_priority = await self._calculate_preservation_priority(
            islamic_compliance, family_context, professional_state, government_context
        )
        
        # Determine cultural context level
        cultural_level = await self._determine_cultural_context_level(
            islamic_compliance, family_context, professional_state
        )
        
        return IraqiCulturalCheckpointData(
            islamic_compliance_status=islamic_compliance,
            family_context_settings=family_context,
            professional_domain_state=professional_state,
            arabic_processing_state=arabic_state,
            government_service_context=government_context,
            payment_gateway_states=payment_states,
            regional_context=regional_context,
            cultural_validation_history=validation_history,
            preservation_priority=preservation_priority,
            cultural_context_level=cultural_level
        )
    
    def _generate_checkpoint_id(self, checkpoint_type: CheckpointType) -> str:
        """Generate unique checkpoint ID"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        hash_input = f"{self.task_id}_{timestamp}_{checkpoint_type.value}"
        hash_suffix = hashlib.md5(hash_input.encode()).hexdigest()[:8]
        return f"chkpt_{checkpoint_type.value}_{timestamp}_{hash_suffix}"
    
    def _generate_workspace_hash(self) -> str:
        """Generate hash for current workspace"""
        workspace_path = os.getcwd()
        return hashlib.md5(workspace_path.encode()).hexdigest()[:13]
    
    def _initialize_checkpoint_storage(self):
        """Initialize checkpoint storage directory"""
        checkpoint_dir = os.path.join(self.storage_path, "checkpoints", self.workspace_hash)
        os.makedirs(checkpoint_dir, exist_ok=True)


# Supporting processor classes (simplified implementations)

class CulturalContextProcessor:
    """Processes cultural context for checkpointing"""
    
    async def get_current_islamic_compliance_state(self) -> Dict[str, Any]:
        """Get current Islamic compliance state"""
        return {
            "compliance_level": "moderate",
            "halal_verification_active": True,
            "prayer_time_awareness": True,
            "family_values_preservation": True,
            "last_validation_timestamp": datetime.now().isoformat()
        }
    
    async def get_current_family_context_settings(self) -> Dict[str, Any]:
        """Get current family context settings"""
        return {
            "family_appropriateness_level": "high",
            "elder_respect_enabled": True,
            "children_welfare_protection": True,
            "family_harmony_preservation": True,
            "cultural_sensitivity_level": 0.95
        }
    
    async def get_current_regional_context(self) -> Dict[str, Any]:
        """Get current regional context"""
        return {
            "primary_region": "baghdad",
            "dialect_preference": "iraqi_arabic",
            "regional_services_active": True,
            "local_cultural_adaptations": ["government_formal", "professional_respectful"]
        }
    
    async def get_cultural_validation_history(self) -> List[Dict[str, Any]]:
        """Get cultural validation history"""
        return [
            {
                "timestamp": datetime.now().isoformat(),
                "validation_type": "islamic_compliance",
                "score": 0.95,
                "status": "approved"
            }
        ]

class ProfessionalStateManager:
    """Manages professional domain state"""
    
    async def get_current_professional_state(self) -> Dict[str, Any]:
        """Get current professional domain state"""
        return {
            "active_domain": "government",
            "professional_level": "senior",
            "certification_status": "validated",
            "domain_compliance_score": 0.90,
            "active_professional_context": "iraqi_government_service"
        }

class ArabicProcessingStateManager:
    """Manages Arabic processing state"""
    
    async def get_current_arabic_processing_state(self) -> Dict[str, Any]:
        """Get current Arabic processing state"""
        return {
            "rtl_mode_active": True,
            "dialect_recognition_enabled": True,
            "primary_dialect": "iraqi_baghdad",
            "mixed_content_handling": True,
            "arabic_typography_optimized": True,
            "content_percentage": 0.75
        }

class GovernmentServiceContextManager:
    """Manages government service context"""
    
    async def get_current_government_context(self) -> Dict[str, Any]:
        """Get current government service context"""
        return {
            "active_services": ["passport", "visa"],
            "regional_offices": ["baghdad_ministry", "basra_department"],
            "process_stages": {"passport": "documentation", "visa": "review"},
            "compliance_requirements": ["iraqi_law", "ministry_regulations"]
        }

class PaymentGatewayStateManager:
    """Manages payment gateway states"""
    
    async def get_current_payment_gateway_states(self) -> Dict[str, Any]:
        """Get current payment gateway states"""
        return {
            "zaincash": {"status": "active", "last_transaction": "2025-01-17T10:30:00"},
            "fastpay": {"status": "available", "balance_check": "enabled"},
            "nasswallet": {"status": "configured", "integration_level": "full"}
        }

class CheckpointValidationManager:
    """Validates checkpoint integrity and consistency"""
    
    async def validate_checkpoint_integrity(self, checkpoint: IraqiCheckpoint) -> Dict[str, Any]:
        """Validate checkpoint integrity"""
        return {
            "integrity_valid": True,
            "cultural_data_complete": True,
            "workspace_state_valid": True,
            "preservation_quality": checkpoint.preservation_quality,
            "validation_score": 0.92
        }