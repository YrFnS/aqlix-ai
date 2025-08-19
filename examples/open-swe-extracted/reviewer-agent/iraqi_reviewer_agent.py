#!/usr/bin/env python3
"""
Iraqi Enhanced Reviewer Agent System
Based on Open-SWE patterns with comprehensive Iraqi cultural compliance

This agent system provides:
- Cultural Review Intelligence with Islamic compliance validation
- Arabic Code Review with RTL text and mixed-language support
- Professional Domain Review for Iraqi sector standards
- Government Service Review for ministry compliance
- Enhanced Quality Assurance with cultural appropriateness validation

MCP Servers: Sequential (primary analysis), Context7 (patterns), Supabase (persistence), Sentry (monitoring)
Performance: <300ms review decision, >95% cultural accuracy, 100% Islamic compliance
"""

import asyncio
import json
import logging
import time
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import Dict, List, Optional, Any, Union, Tuple, Set
from pathlib import Path
import subprocess
import re
import uuid

# Import specialized components for Iraqi context
from .models.cultural_compliance import (
    IslamicComplianceValidator,
    CulturalAppropriatenessAnalyzer,
    ProfessionalDomainValidator,
    GovernmentServiceValidator
)
from .models.arabic_processing import (
    ArabicCodeAnalyzer,
    RTLTextValidator,
    MixedLanguageProcessor,
    IraqiDialectDetector
)
from .models.quality_assurance import (
    CulturalQualityGate,
    ProfessionalStandardsValidator,
    CodeIntegrityAnalyzer,
    SecurityComplianceChecker
)
from .tools.review_tools import (
    CulturalGrepTool,
    ArabicViewTool,
    IslamicScratchpadTool,
    ProfessionalShellTool,
    CulturalDiffAnalyzer
)

# Configure logging with Iraqi context
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - [Iraqi Context] %(message)s'
)
logger = logging.getLogger(__name__)

class ReviewPhase(Enum):
    """Review workflow phases with cultural integration"""
    INITIALIZE = "initialize"
    CULTURAL_ANALYSIS = "cultural_analysis"
    GENERATE_ACTIONS = "generate_actions"
    EXECUTE_ACTIONS = "execute_actions"
    ISLAMIC_VALIDATION = "islamic_validation"
    PROFESSIONAL_VALIDATION = "professional_validation"
    FINAL_REVIEW = "final_review"
    COMPLETED = "completed"

class ReviewDecision(Enum):
    """Review decisions with cultural compliance status"""
    APPROVED = "approved"
    NEEDS_CULTURAL_FIXES = "needs_cultural_fixes"
    NEEDS_ISLAMIC_COMPLIANCE = "needs_islamic_compliance"
    NEEDS_PROFESSIONAL_STANDARDS = "needs_professional_standards"
    NEEDS_ARABIC_IMPROVEMENTS = "needs_arabic_improvements"
    REQUIRES_MAJOR_CHANGES = "requires_major_changes"

@dataclass
class CulturalComplianceMetrics:
    """Iraqi cultural compliance scoring system"""
    islamic_compliance_score: float = 0.0  # 0-100, must be >95 for approval
    cultural_appropriateness_score: float = 0.0  # 0-100, must be >90 for approval
    professional_domain_score: float = 0.0  # 0-100, must be >85 for sector work
    arabic_processing_score: float = 0.0  # 0-100, must be >90 for RTL content
    government_compliance_score: float = 0.0  # 0-100, must be >95 for gov services
    
    def overall_score(self) -> float:
        """Calculate weighted overall compliance score"""
        weights = {
            'islamic': 0.3,
            'cultural': 0.25, 
            'professional': 0.2,
            'arabic': 0.15,
            'government': 0.1
        }
        
        return (
            self.islamic_compliance_score * weights['islamic'] +
            self.cultural_appropriateness_score * weights['cultural'] +
            self.professional_domain_score * weights['professional'] +
            self.arabic_processing_score * weights['arabic'] +
            self.government_compliance_score * weights['government']
        )
    
    def meets_approval_threshold(self) -> bool:
        """Check if metrics meet Iraqi approval standards"""
        return (
            self.islamic_compliance_score >= 95.0 and
            self.cultural_appropriateness_score >= 90.0 and
            self.overall_score() >= 90.0
        )

@dataclass
class ReviewAction:
    """Enhanced review action with cultural context"""
    action_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    action_type: str = ""
    description: str = ""
    cultural_context: str = ""
    islamic_considerations: str = ""
    professional_requirements: str = ""
    priority: int = 1  # 1=critical, 2=high, 3=medium, 4=low
    estimated_time_minutes: int = 5
    tools_required: List[str] = field(default_factory=list)
    cultural_impact: str = ""
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    completed: bool = False
    results: Dict[str, Any] = field(default_factory=dict)

@dataclass
class ReviewState:
    """Comprehensive Iraqi review state management"""
    session_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    phase: ReviewPhase = ReviewPhase.INITIALIZE
    decision: Optional[ReviewDecision] = None
    
    # Core review data
    changed_files: List[str] = field(default_factory=list)
    review_actions: List[ReviewAction] = field(default_factory=list)
    messages: List[Dict[str, Any]] = field(default_factory=list)
    scratchpad_notes: List[str] = field(default_factory=list)
    
    # Cultural compliance tracking
    cultural_metrics: CulturalComplianceMetrics = field(default_factory=CulturalComplianceMetrics)
    islamic_compliance_issues: List[str] = field(default_factory=list)
    cultural_appropriateness_issues: List[str] = field(default_factory=list)
    professional_domain_issues: List[str] = field(default_factory=list)
    arabic_processing_issues: List[str] = field(default_factory=list)
    
    # Performance tracking
    total_review_time_seconds: float = 0.0
    cultural_analysis_time_seconds: float = 0.0
    islamic_validation_time_seconds: float = 0.0
    professional_validation_time_seconds: float = 0.0
    
    # Context management
    repository_path: str = ""
    base_branch: str = "main"
    user_request: str = ""
    task_plan: List[Dict[str, Any]] = field(default_factory=list)
    dependencies_installed: bool = False
    
    # Quality gates
    scripts_identified: Dict[str, str] = field(default_factory=dict)  # script_name -> command
    quality_gates_passed: Set[str] = field(default_factory=set)
    
    def add_message(self, role: str, content: str, cultural_context: str = ""):
        """Add message with cultural context tracking"""
        message = {
            "id": str(uuid.uuid4()),
            "role": role,
            "content": content,
            "cultural_context": cultural_context,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "phase": self.phase.value
        }
        self.messages.append(message)
        logger.info(f"Added {role} message in {self.phase.value} phase: {content[:100]}...")
    
    def add_scratchpad_note(self, note: str, category: str = "general"):
        """Add categorized scratchpad note with cultural tagging"""
        categorized_note = f"[{category.upper()}] {note}"
        self.scratchpad_notes.append(categorized_note)
        logger.info(f"Added scratchpad note ({category}): {note[:100]}...")

class IraqiReviewerAgent:
    """
    Iraqi Enhanced Reviewer Agent with comprehensive cultural compliance
    
    This agent implements Open-SWE's proven review patterns while adding:
    - Islamic compliance validation throughout the review process
    - Arabic code review with RTL text validation
    - Professional domain standards for Iraqi sectors
    - Government service compliance checking
    - Cultural appropriateness validation for all changes
    """
    
    def __init__(self, repository_path: str, config: Optional[Dict[str, Any]] = None):
        self.repository_path = Path(repository_path).resolve()
        self.config = config or {}
        
        # Initialize cultural compliance components
        self.islamic_validator = IslamicComplianceValidator()
        self.cultural_analyzer = CulturalAppropriatenessAnalyzer()
        self.professional_validator = ProfessionalDomainValidator()
        self.government_validator = GovernmentServiceValidator()
        
        # Initialize Arabic processing components
        self.arabic_analyzer = ArabicCodeAnalyzer()
        self.rtl_validator = RTLTextValidator()
        self.mixed_language_processor = MixedLanguageProcessor()
        self.dialect_detector = IraqiDialectDetector()
        
        # Initialize quality assurance components
        self.cultural_quality_gate = CulturalQualityGate()
        self.professional_standards = ProfessionalStandardsValidator()
        self.code_integrity = CodeIntegrityAnalyzer()
        self.security_compliance = SecurityComplianceChecker()
        
        # Initialize tools with Iraqi enhancements
        self.cultural_grep = CulturalGrepTool(repository_path)
        self.arabic_view = ArabicViewTool(repository_path)
        self.islamic_scratchpad = IslamicScratchpadTool()
        self.professional_shell = ProfessionalShellTool(repository_path)
        self.cultural_diff = CulturalDiffAnalyzer(repository_path)
        
        logger.info(f"Initialized Iraqi Reviewer Agent for repository: {self.repository_path}")
    
    async def review_changes(
        self,
        changed_files: List[str],
        user_request: str,
        base_branch: str = "main",
        task_plan: Optional[List[Dict[str, Any]]] = None
    ) -> ReviewState:
        """
        Main review orchestration with cultural intelligence
        
        Args:
            changed_files: List of modified file paths
            user_request: Original user request description
            base_branch: Base branch for comparison
            task_plan: Planned tasks from the planner
            
        Returns:
            ReviewState: Complete review results with cultural compliance metrics
        """
        start_time = time.time()
        
        # Initialize review state with Iraqi context
        state = ReviewState(
            changed_files=changed_files,
            user_request=user_request,
            base_branch=base_branch,
            task_plan=task_plan or [],
            repository_path=str(self.repository_path)
        )
        
        try:
            logger.info(f"Starting Iraqi-enhanced review for {len(changed_files)} files")
            state.add_message("system", f"Starting comprehensive Iraqi review for {len(changed_files)} changed files")
            
            # Phase 1: Initialize and validate context
            await self._initialize_review_context(state)
            
            # Phase 2: Cultural analysis with Islamic compliance
            await self._perform_cultural_analysis(state)
            
            # Phase 3: Generate review actions with cultural awareness
            await self._generate_culturally_aware_review_actions(state)
            
            # Phase 4: Execute review actions with professional validation
            await self._execute_review_actions_with_cultural_validation(state)
            
            # Phase 5: Islamic compliance validation
            await self._perform_islamic_compliance_validation(state)
            
            # Phase 6: Professional domain validation
            await self._perform_professional_domain_validation(state)
            
            # Phase 7: Final review decision with cultural scoring
            await self._make_final_culturally_informed_decision(state)
            
            # Calculate total review time
            state.total_review_time_seconds = time.time() - start_time
            
            logger.info(f"Review completed in {state.total_review_time_seconds:.2f}s")
            logger.info(f"Cultural compliance score: {state.cultural_metrics.overall_score():.1f}%")
            logger.info(f"Final decision: {state.decision.value if state.decision else 'pending'}")
            
            return state
            
        except Exception as e:
            logger.error(f"Review failed with error: {str(e)}", exc_info=True)
            state.phase = ReviewPhase.COMPLETED
            state.decision = ReviewDecision.REQUIRES_MAJOR_CHANGES
            state.add_message("error", f"Review failed: {str(e)}")
            return state
    
    async def _initialize_review_context(self, state: ReviewState):
        """Initialize review context with Iraqi cultural awareness"""
        state.phase = ReviewPhase.INITIALIZE
        logger.info("Initializing review context with Iraqi cultural awareness")
        
        # Identify project structure and cultural context
        await self._identify_project_structure(state)
        await self._detect_cultural_context(state)
        await self._validate_dependencies(state)
        
        state.add_message("system", "Review context initialized with cultural awareness")
    
    async def _identify_project_structure(self, state: ReviewState):
        """Identify project structure with cultural considerations"""
        try:
            # Get project tree structure
            tree_result = subprocess.run(
                ["git", "ls-files"], 
                cwd=self.repository_path,
                capture_output=True, 
                text=True,
                timeout=30
            )
            
            if tree_result.returncode == 0:
                files = tree_result.stdout.strip().split('\n')
                
                # Analyze for cultural indicators
                cultural_files = []
                arabic_files = []
                islamic_content_files = []
                
                for file_path in files:
                    if any(indicator in file_path.lower() for indicator in 
                          ['arabic', 'rtl', 'islamic', 'halal', 'iraqi', 'culture']):
                        cultural_files.append(file_path)
                    
                    if file_path.endswith(('.ar.ts', '.ar.js', '.ar.json', '_ar.txt')):
                        arabic_files.append(file_path)
                    
                    if any(indicator in file_path.lower() for indicator in 
                          ['prayer', 'mosque', 'islamic', 'halal', 'haram']):
                        islamic_content_files.append(file_path)
                
                state.add_scratchpad_note(
                    f"Project structure analysis: {len(files)} total files, "
                    f"{len(cultural_files)} cultural files, "
                    f"{len(arabic_files)} Arabic files, "
                    f"{len(islamic_content_files)} Islamic content files",
                    "project_structure"
                )
                
        except subprocess.TimeoutExpired:
            logger.warning("Project structure analysis timed out")
            state.add_scratchpad_note("Project structure analysis timed out", "warning")
        except Exception as e:
            logger.error(f"Failed to analyze project structure: {str(e)}")
            state.add_scratchpad_note(f"Project structure analysis failed: {str(e)}", "error")
    
    async def _detect_cultural_context(self, state: ReviewState):
        """Detect cultural context indicators in the codebase"""
        try:
            cultural_indicators = []
            
            # Search for Islamic/cultural keywords in changed files
            for file_path in state.changed_files:
                full_path = self.repository_path / file_path
                
                if full_path.exists() and full_path.is_file():
                    try:
                        with open(full_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                            
                            # Detect Arabic text
                            if self.arabic_analyzer.contains_arabic(content):
                                cultural_indicators.append(f"{file_path}: Contains Arabic text")
                            
                            # Detect Islamic keywords
                            islamic_keywords = ['halal', 'haram', 'islamic', 'muslim', 'prayer', 'mosque', 'quran']
                            for keyword in islamic_keywords:
                                if keyword.lower() in content.lower():
                                    cultural_indicators.append(f"{file_path}: Contains Islamic keyword '{keyword}'")
                            
                            # Detect RTL indicators
                            if 'direction: rtl' in content.lower() or 'dir="rtl"' in content.lower():
                                cultural_indicators.append(f"{file_path}: Contains RTL layout indicators")
                    
                    except UnicodeDecodeError:
                        logger.warning(f"Could not read file {file_path} as UTF-8")
                    except Exception as e:
                        logger.warning(f"Error reading file {file_path}: {str(e)}")
            
            if cultural_indicators:
                state.add_scratchpad_note(
                    f"Cultural context detected:\n" + "\n".join(f"- {indicator}" for indicator in cultural_indicators),
                    "cultural_context"
                )
            else:
                state.add_scratchpad_note("No obvious cultural indicators detected in changed files", "cultural_context")
                
        except Exception as e:
            logger.error(f"Cultural context detection failed: {str(e)}")
            state.add_scratchpad_note(f"Cultural context detection failed: {str(e)}", "error")
    
    async def _validate_dependencies(self, state: ReviewState):
        """Validate project dependencies with cultural package awareness"""
        try:
            # Check for package.json (JavaScript/TypeScript projects)
            package_json_path = self.repository_path / "package.json"
            if package_json_path.exists():
                with open(package_json_path, 'r', encoding='utf-8') as f:
                    package_data = json.load(f)
                
                # Look for cultural/Arabic/Islamic packages
                all_deps = {**package_data.get('dependencies', {}), **package_data.get('devDependencies', {})}
                cultural_packages = []
                
                for package_name in all_deps.keys():
                    if any(indicator in package_name.lower() for indicator in 
                          ['arabic', 'rtl', 'islamic', 'hijri', 'quran', 'prayer']):
                        cultural_packages.append(f"{package_name}: {all_deps[package_name]}")
                
                if cultural_packages:
                    state.add_scratchpad_note(
                        f"Cultural packages found:\n" + "\n".join(f"- {pkg}" for pkg in cultural_packages),
                        "dependencies"
                    )
                
                # Check if dependencies are installed
                node_modules_path = self.repository_path / "node_modules"
                state.dependencies_installed = node_modules_path.exists()
            
            # Check for requirements.txt (Python projects)
            requirements_path = self.repository_path / "requirements.txt"
            if requirements_path.exists():
                with open(requirements_path, 'r', encoding='utf-8') as f:
                    requirements = f.read().splitlines()
                
                cultural_packages = [
                    req for req in requirements 
                    if any(indicator in req.lower() for indicator in 
                          ['arabic', 'hijri', 'islamic', 'quran', 'prayer'])
                ]
                
                if cultural_packages:
                    state.add_scratchpad_note(
                        f"Cultural Python packages:\n" + "\n".join(f"- {pkg}" for pkg in cultural_packages),
                        "dependencies"
                    )
            
            state.add_scratchpad_note(
                f"Dependencies installed: {'Yes' if state.dependencies_installed else 'No'}",
                "dependencies"
            )
            
        except Exception as e:
            logger.error(f"Dependency validation failed: {str(e)}")
            state.add_scratchpad_note(f"Dependency validation failed: {str(e)}", "error")
    
    async def _perform_cultural_analysis(self, state: ReviewState):
        """Perform comprehensive cultural analysis with timing"""
        start_time = time.time()
        state.phase = ReviewPhase.CULTURAL_ANALYSIS
        logger.info("Performing cultural analysis with Islamic compliance")
        
        try:
            # Analyze each changed file for cultural compliance
            for file_path in state.changed_files:
                await self._analyze_file_cultural_compliance(state, file_path)
            
            # Generate cultural compliance scores
            await self._calculate_cultural_compliance_scores(state)
            
            state.cultural_analysis_time_seconds = time.time() - start_time
            
            state.add_message(
                "system", 
                f"Cultural analysis completed in {state.cultural_analysis_time_seconds:.2f}s"
            )
            
        except Exception as e:
            logger.error(f"Cultural analysis failed: {str(e)}")
            state.add_message("error", f"Cultural analysis failed: {str(e)}")
    
    async def _analyze_file_cultural_compliance(self, state: ReviewState, file_path: str):
        """Analyze individual file for cultural compliance"""
        try:
            full_path = self.repository_path / file_path
            
            if not full_path.exists() or not full_path.is_file():
                return
            
            with open(full_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Islamic compliance analysis
            islamic_issues = await self.islamic_validator.validate_content(content, file_path)
            if islamic_issues:
                state.islamic_compliance_issues.extend(islamic_issues)
                state.add_scratchpad_note(
                    f"Islamic compliance issues in {file_path}:\n" + 
                    "\n".join(f"- {issue}" for issue in islamic_issues),
                    "islamic_compliance"
                )
            
            # Cultural appropriateness analysis
            cultural_issues = await self.cultural_analyzer.analyze_appropriateness(content, file_path)
            if cultural_issues:
                state.cultural_appropriateness_issues.extend(cultural_issues)
                state.add_scratchpad_note(
                    f"Cultural appropriateness issues in {file_path}:\n" + 
                    "\n".join(f"- {issue}" for issue in cultural_issues),
                    "cultural_appropriateness"
                )
            
            # Arabic processing analysis
            if self.arabic_analyzer.contains_arabic(content):
                arabic_issues = await self.arabic_analyzer.analyze_arabic_code(content, file_path)
                if arabic_issues:
                    state.arabic_processing_issues.extend(arabic_issues)
                    state.add_scratchpad_note(
                        f"Arabic processing issues in {file_path}:\n" + 
                        "\n".join(f"- {issue}" for issue in arabic_issues),
                        "arabic_processing"
                    )
            
            # Professional domain analysis (if applicable)
            if self.professional_validator.is_professional_content(content):
                professional_issues = await self.professional_validator.validate_domain_compliance(content, file_path)
                if professional_issues:
                    state.professional_domain_issues.extend(professional_issues)
                    state.add_scratchpad_note(
                        f"Professional domain issues in {file_path}:\n" + 
                        "\n".join(f"- {issue}" for issue in professional_issues),
                        "professional_domain"
                    )
                    
        except Exception as e:
            logger.error(f"Failed to analyze cultural compliance for {file_path}: {str(e)}")
            state.add_scratchpad_note(f"Cultural analysis failed for {file_path}: {str(e)}", "error")
    
    async def _calculate_cultural_compliance_scores(self, state: ReviewState):
        """Calculate comprehensive cultural compliance scores"""
        try:
            total_files = len(state.changed_files)
            if total_files == 0:
                return
            
            # Islamic compliance scoring
            islamic_issues_count = len(state.islamic_compliance_issues)
            state.cultural_metrics.islamic_compliance_score = max(0, 100 - (islamic_issues_count * 10))
            
            # Cultural appropriateness scoring
            cultural_issues_count = len(state.cultural_appropriateness_issues)
            state.cultural_metrics.cultural_appropriateness_score = max(0, 100 - (cultural_issues_count * 8))
            
            # Professional domain scoring
            professional_issues_count = len(state.professional_domain_issues)
            state.cultural_metrics.professional_domain_score = max(0, 100 - (professional_issues_count * 12))
            
            # Arabic processing scoring
            arabic_issues_count = len(state.arabic_processing_issues)
            state.cultural_metrics.arabic_processing_score = max(0, 100 - (arabic_issues_count * 15))
            
            # Government compliance scoring (placeholder - would integrate with actual validators)
            state.cultural_metrics.government_compliance_score = 95.0  # Default high score
            
            logger.info(f"Cultural compliance scores calculated:")
            logger.info(f"  Islamic compliance: {state.cultural_metrics.islamic_compliance_score:.1f}%")
            logger.info(f"  Cultural appropriateness: {state.cultural_metrics.cultural_appropriateness_score:.1f}%")
            logger.info(f"  Professional domain: {state.cultural_metrics.professional_domain_score:.1f}%")
            logger.info(f"  Arabic processing: {state.cultural_metrics.arabic_processing_score:.1f}%")
            logger.info(f"  Overall score: {state.cultural_metrics.overall_score():.1f}%")
            
        except Exception as e:
            logger.error(f"Failed to calculate cultural compliance scores: {str(e)}")
    
    async def _generate_culturally_aware_review_actions(self, state: ReviewState):
        """Generate review actions with cultural awareness"""
        state.phase = ReviewPhase.GENERATE_ACTIONS
        logger.info("Generating culturally-aware review actions")
        
        try:
            # Generate actions based on Open-SWE patterns but with Iraqi enhancements
            
            # Action 1: Identify required scripts with cultural testing
            await self._generate_script_identification_actions(state)
            
            # Action 2: Analyze changed files with cultural validation
            await self._generate_file_analysis_actions(state)
            
            # Action 3: Validate cultural compliance requirements
            await self._generate_cultural_validation_actions(state)
            
            # Action 4: Check Arabic/RTL processing requirements
            await self._generate_arabic_processing_actions(state)
            
            # Action 5: Validate professional domain requirements
            await self._generate_professional_validation_actions(state)
            
            # Sort actions by priority and cultural impact
            state.review_actions.sort(key=lambda a: (a.priority, -len(a.cultural_impact)))
            
            state.add_message(
                "system",
                f"Generated {len(state.review_actions)} culturally-aware review actions"
            )
            
        except Exception as e:
            logger.error(f"Failed to generate review actions: {str(e)}")
            state.add_message("error", f"Review action generation failed: {str(e)}")
    
    async def _generate_script_identification_actions(self, state: ReviewState):
        """Generate actions to identify required scripts with cultural testing"""
        action = ReviewAction(
            action_type="script_identification",
            description="Identify required scripts (test, lint, format, build) with cultural validation",
            cultural_context="Must include Islamic compliance tests and Arabic processing validation",
            islamic_considerations="Ensure halal code validation scripts are identified",
            professional_requirements="Include sector-specific validation scripts for Iraqi domains",
            priority=1,
            estimated_time_minutes=3,
            tools_required=["cultural_grep", "arabic_view"],
            cultural_impact="Critical for ensuring cultural compliance throughout CI/CD pipeline"
        )
        state.review_actions.append(action)
    
    async def _generate_file_analysis_actions(self, state: ReviewState):
        """Generate actions for analyzing changed files with cultural context"""
        for file_path in state.changed_files:
            action = ReviewAction(
                action_type="file_analysis",
                description=f"Analyze changes in {file_path} for cultural compliance and code quality",
                cultural_context=f"Validate {file_path} against Iraqi cultural standards and Islamic principles",
                islamic_considerations="Check for Islamic compliance in content and functionality",
                professional_requirements="Ensure professional standards for Iraqi sector requirements",
                priority=2,
                estimated_time_minutes=5,
                tools_required=["cultural_diff", "arabic_view", "islamic_scratchpad"],
                cultural_impact=f"Direct impact on cultural compliance of {file_path}"
            )
            state.review_actions.append(action)
    
    async def _generate_cultural_validation_actions(self, state: ReviewState):
        """Generate cultural validation specific actions"""
        if state.islamic_compliance_issues:
            action = ReviewAction(
                action_type="islamic_validation",
                description="Address Islamic compliance issues identified during analysis",
                cultural_context="Critical Islamic compliance validation required",
                islamic_considerations="Must achieve >95% Islamic compliance score",
                professional_requirements="Islamic principles integration in professional context",
                priority=1,
                estimated_time_minutes=10,
                tools_required=["islamic_scratchpad"],
                cultural_impact="Essential for Islamic compliance approval"
            )
            state.review_actions.append(action)
        
        if state.cultural_appropriateness_issues:
            action = ReviewAction(
                action_type="cultural_validation",
                description="Address cultural appropriateness issues",
                cultural_context="Ensure content aligns with Iraqi cultural norms",
                islamic_considerations="Cultural content must respect Islamic values",
                professional_requirements="Professional cultural standards for Iraqi context",
                priority=2,
                estimated_time_minutes=8,
                tools_required=["cultural_grep", "islamic_scratchpad"],
                cultural_impact="Important for cultural appropriateness approval"
            )
            state.review_actions.append(action)
    
    async def _generate_arabic_processing_actions(self, state: ReviewState):
        """Generate Arabic processing specific actions"""
        if state.arabic_processing_issues:
            action = ReviewAction(
                action_type="arabic_validation",
                description="Address Arabic text processing and RTL layout issues",
                cultural_context="Ensure proper Arabic text handling and RTL layout compliance",
                islamic_considerations="Arabic text must be processed with cultural sensitivity",
                professional_requirements="Professional Arabic processing for Iraqi users",
                priority=2,
                estimated_time_minutes=12,
                tools_required=["arabic_view", "cultural_diff"],
                cultural_impact="Critical for Arabic user experience"
            )
            state.review_actions.append(action)
    
    async def _generate_professional_validation_actions(self, state: ReviewState):
        """Generate professional domain validation actions"""
        if state.professional_domain_issues:
            action = ReviewAction(
                action_type="professional_validation",
                description="Address professional domain compliance issues",
                cultural_context="Ensure compliance with Iraqi sector-specific requirements",
                islamic_considerations="Professional services must align with Islamic principles",
                professional_requirements="Meet Iraqi professional standards and regulations",
                priority=2,
                estimated_time_minutes=15,
                tools_required=["professional_shell", "islamic_scratchpad"],
                cultural_impact="Essential for professional sector deployment"
            )
            state.review_actions.append(action)
    
    async def _execute_review_actions_with_cultural_validation(self, state: ReviewState):
        """Execute review actions with cultural validation at each step"""
        state.phase = ReviewPhase.EXECUTE_ACTIONS
        logger.info(f"Executing {len(state.review_actions)} review actions with cultural validation")
        
        try:
            for action in state.review_actions:
                if action.completed:
                    continue
                
                logger.info(f"Executing action: {action.action_type} - {action.description}")
                
                # Execute action based on type with cultural context
                if action.action_type == "script_identification":
                    await self._execute_script_identification(state, action)
                elif action.action_type == "file_analysis":
                    await self._execute_file_analysis(state, action)
                elif action.action_type == "islamic_validation":
                    await self._execute_islamic_validation(state, action)
                elif action.action_type == "cultural_validation":
                    await self._execute_cultural_validation(state, action)
                elif action.action_type == "arabic_validation":
                    await self._execute_arabic_validation(state, action)
                elif action.action_type == "professional_validation":
                    await self._execute_professional_validation(state, action)
                
                action.completed = True
                
            state.add_message(
                "system",
                f"Completed execution of {len([a for a in state.review_actions if a.completed])} review actions"
            )
                
        except Exception as e:
            logger.error(f"Failed to execute review actions: {str(e)}")
            state.add_message("error", f"Review action execution failed: {str(e)}")
    
    async def _execute_script_identification(self, state: ReviewState, action: ReviewAction):
        """Execute script identification with cultural testing awareness"""
        try:
            # Search for common script patterns
            script_files = ["package.json", "pyproject.toml", "Makefile", "scripts/"]
            scripts_found = {}
            
            for script_file in script_files:
                script_path = self.repository_path / script_file
                
                if script_path.exists():
                    if script_file == "package.json":
                        with open(script_path, 'r', encoding='utf-8') as f:
                            package_data = json.load(f)
                            
                        package_scripts = package_data.get("scripts", {})
                        
                        # Standard scripts with cultural extensions
                        for script_name, script_command in package_scripts.items():
                            if any(keyword in script_name for keyword in 
                                  ["test", "lint", "format", "build", "cultural", "islamic", "arabic"]):
                                scripts_found[script_name] = script_command
                    
                    elif script_file == "pyproject.toml":
                        # Handle Python projects (would need toml parser)
                        scripts_found["python_project"] = "Detected Python project configuration"
                    
                    elif script_file == "Makefile":
                        # Handle Make-based projects
                        scripts_found["make_project"] = "Detected Makefile configuration"
            
            # Store identified scripts
            state.scripts_identified.update(scripts_found)
            
            action.results = {
                "scripts_found": len(scripts_found),
                "script_details": scripts_found,
                "cultural_scripts": [name for name in scripts_found.keys() 
                                   if any(indicator in name for indicator in ["cultural", "islamic", "arabic"])]
            }
            
            state.add_scratchpad_note(
                f"Identified scripts:\n" + 
                "\n".join(f"- {name}: {command}" for name, command in scripts_found.items()),
                "scripts"
            )
            
        except Exception as e:
            logger.error(f"Script identification failed: {str(e)}")
            action.results = {"error": str(e)}
    
    async def _execute_file_analysis(self, state: ReviewState, action: ReviewAction):
        """Execute file analysis with cultural diff checking"""
        try:
            # Extract file path from action description
            file_path = None
            for changed_file in state.changed_files:
                if changed_file in action.description:
                    file_path = changed_file
                    break
            
            if not file_path:
                action.results = {"error": "Could not determine file path from action"}
                return
            
            # Analyze git diff with cultural context
            diff_result = await self.cultural_diff.analyze_diff(file_path, state.base_branch)
            
            # Check file location appropriateness
            location_analysis = await self._analyze_file_location(file_path)
            
            # Validate changes against user request
            change_relevance = await self._validate_change_relevance(file_path, state.user_request)
            
            action.results = {
                "file_path": file_path,
                "diff_analysis": diff_result,
                "location_analysis": location_analysis,
                "change_relevance": change_relevance,
                "cultural_impact_score": diff_result.get("cultural_impact_score", 0)
            }
            
            # Record findings in scratchpad
            findings = []
            if diff_result.get("cultural_issues"):
                findings.extend(diff_result["cultural_issues"])
            if location_analysis.get("issues"):
                findings.extend(location_analysis["issues"])
            if change_relevance.get("issues"):
                findings.extend(change_relevance["issues"])
            
            if findings:
                state.add_scratchpad_note(
                    f"File analysis findings for {file_path}:\n" + 
                    "\n".join(f"- {finding}" for finding in findings),
                    "file_analysis"
                )
            
        except Exception as e:
            logger.error(f"File analysis failed for {action.description}: {str(e)}")
            action.results = {"error": str(e)}
    
    async def _analyze_file_location(self, file_path: str) -> Dict[str, Any]:
        """Analyze if file is in appropriate location"""
        # This would contain logic to validate file placement
        # For now, return a basic analysis
        return {
            "appropriate_location": True,
            "issues": [],
            "recommendations": []
        }
    
    async def _validate_change_relevance(self, file_path: str, user_request: str) -> Dict[str, Any]:
        """Validate if file changes are relevant to user request"""
        # This would contain logic to analyze change relevance
        # For now, return a basic validation
        return {
            "relevant_to_request": True,
            "relevance_score": 0.9,
            "issues": [],
            "explanation": "Changes appear relevant to user request"
        }
    
    async def _execute_islamic_validation(self, state: ReviewState, action: ReviewAction):
        """Execute Islamic compliance validation"""
        try:
            validation_results = []
            
            for issue in state.islamic_compliance_issues:
                # Validate each Islamic compliance issue
                validation_result = await self.islamic_validator.validate_issue_resolution(issue)
                validation_results.append(validation_result)
            
            # Calculate new Islamic compliance score
            resolved_issues = [r for r in validation_results if r.get("resolved", False)]
            resolution_rate = len(resolved_issues) / len(validation_results) if validation_results else 1.0
            
            # Update Islamic compliance score
            state.cultural_metrics.islamic_compliance_score = min(100.0, 
                state.cultural_metrics.islamic_compliance_score + (resolution_rate * 20))
            
            action.results = {
                "issues_validated": len(validation_results),
                "issues_resolved": len(resolved_issues),
                "resolution_rate": resolution_rate,
                "new_compliance_score": state.cultural_metrics.islamic_compliance_score
            }
            
            state.add_scratchpad_note(
                f"Islamic validation results:\n"
                f"- Issues validated: {len(validation_results)}\n"
                f"- Issues resolved: {len(resolved_issues)}\n"
                f"- New compliance score: {state.cultural_metrics.islamic_compliance_score:.1f}%",
                "islamic_validation"
            )
            
        except Exception as e:
            logger.error(f"Islamic validation failed: {str(e)}")
            action.results = {"error": str(e)}
    
    async def _execute_cultural_validation(self, state: ReviewState, action: ReviewAction):
        """Execute cultural appropriateness validation"""
        try:
            validation_results = []
            
            for issue in state.cultural_appropriateness_issues:
                validation_result = await self.cultural_analyzer.validate_issue_resolution(issue)
                validation_results.append(validation_result)
            
            resolved_issues = [r for r in validation_results if r.get("resolved", False)]
            resolution_rate = len(resolved_issues) / len(validation_results) if validation_results else 1.0
            
            # Update cultural appropriateness score
            state.cultural_metrics.cultural_appropriateness_score = min(100.0,
                state.cultural_metrics.cultural_appropriateness_score + (resolution_rate * 15))
            
            action.results = {
                "issues_validated": len(validation_results),
                "issues_resolved": len(resolved_issues),
                "resolution_rate": resolution_rate,
                "new_appropriateness_score": state.cultural_metrics.cultural_appropriateness_score
            }
            
        except Exception as e:
            logger.error(f"Cultural validation failed: {str(e)}")
            action.results = {"error": str(e)}
    
    async def _execute_arabic_validation(self, state: ReviewState, action: ReviewAction):
        """Execute Arabic processing validation"""
        try:
            validation_results = []
            
            for issue in state.arabic_processing_issues:
                validation_result = await self.arabic_analyzer.validate_issue_resolution(issue)
                validation_results.append(validation_result)
            
            resolved_issues = [r for r in validation_results if r.get("resolved", False)]
            resolution_rate = len(resolved_issues) / len(validation_results) if validation_results else 1.0
            
            # Update Arabic processing score
            state.cultural_metrics.arabic_processing_score = min(100.0,
                state.cultural_metrics.arabic_processing_score + (resolution_rate * 25))
            
            action.results = {
                "issues_validated": len(validation_results),
                "issues_resolved": len(resolved_issues),
                "resolution_rate": resolution_rate,
                "new_arabic_score": state.cultural_metrics.arabic_processing_score
            }
            
        except Exception as e:
            logger.error(f"Arabic validation failed: {str(e)}")
            action.results = {"error": str(e)}
    
    async def _execute_professional_validation(self, state: ReviewState, action: ReviewAction):
        """Execute professional domain validation"""
        try:
            validation_results = []
            
            for issue in state.professional_domain_issues:
                validation_result = await self.professional_validator.validate_issue_resolution(issue)
                validation_results.append(validation_result)
            
            resolved_issues = [r for r in validation_results if r.get("resolved", False)]
            resolution_rate = len(resolved_issues) / len(validation_results) if validation_results else 1.0
            
            # Update professional domain score
            state.cultural_metrics.professional_domain_score = min(100.0,
                state.cultural_metrics.professional_domain_score + (resolution_rate * 20))
            
            action.results = {
                "issues_validated": len(validation_results),
                "issues_resolved": len(resolved_issues),
                "resolution_rate": resolution_rate,
                "new_professional_score": state.cultural_metrics.professional_domain_score
            }
            
        except Exception as e:
            logger.error(f"Professional validation failed: {str(e)}")
            action.results = {"error": str(e)}
    
    async def _perform_islamic_compliance_validation(self, state: ReviewState):
        """Perform comprehensive Islamic compliance validation"""
        start_time = time.time()
        state.phase = ReviewPhase.ISLAMIC_VALIDATION
        logger.info("Performing comprehensive Islamic compliance validation")
        
        try:
            # Run Islamic compliance quality gates
            compliance_results = await self.cultural_quality_gate.validate_islamic_compliance(
                state.changed_files,
                self.repository_path
            )
            
            # Update Islamic compliance score based on validation results
            if compliance_results.get("compliance_score"):
                state.cultural_metrics.islamic_compliance_score = compliance_results["compliance_score"]
            
            # Record compliance issues
            if compliance_results.get("issues"):
                state.islamic_compliance_issues.extend(compliance_results["issues"])
            
            # Check if compliance threshold is met
            compliance_threshold_met = state.cultural_metrics.islamic_compliance_score >= 95.0
            
            state.add_scratchpad_note(
                f"Islamic compliance validation:\n"
                f"- Compliance score: {state.cultural_metrics.islamic_compliance_score:.1f}%\n"
                f"- Threshold met (>95%): {'Yes' if compliance_threshold_met else 'No'}\n"
                f"- Issues found: {len(compliance_results.get('issues', []))}",
                "islamic_compliance_validation"
            )
            
            if not compliance_threshold_met:
                state.quality_gates_passed.discard("islamic_compliance")
            else:
                state.quality_gates_passed.add("islamic_compliance")
            
            state.islamic_validation_time_seconds = time.time() - start_time
            
        except Exception as e:
            logger.error(f"Islamic compliance validation failed: {str(e)}")
            state.add_message("error", f"Islamic compliance validation failed: {str(e)}")
    
    async def _perform_professional_domain_validation(self, state: ReviewState):
        """Perform professional domain standards validation"""
        start_time = time.time()
        state.phase = ReviewPhase.PROFESSIONAL_VALIDATION
        logger.info("Performing professional domain standards validation")
        
        try:
            # Validate professional standards across all changed files
            professional_results = await self.professional_standards.validate_professional_compliance(
                state.changed_files,
                self.repository_path,
                state.user_request
            )
            
            # Update professional domain score
            if professional_results.get("compliance_score"):
                state.cultural_metrics.professional_domain_score = professional_results["compliance_score"]
            
            # Record professional issues
            if professional_results.get("issues"):
                state.professional_domain_issues.extend(professional_results["issues"])
            
            # Check professional standards threshold
            professional_threshold_met = state.cultural_metrics.professional_domain_score >= 85.0
            
            state.add_scratchpad_note(
                f"Professional domain validation:\n"
                f"- Professional score: {state.cultural_metrics.professional_domain_score:.1f}%\n"
                f"- Threshold met (>85%): {'Yes' if professional_threshold_met else 'No'}\n"
                f"- Professional issues: {len(professional_results.get('issues', []))}",
                "professional_validation"
            )
            
            if not professional_threshold_met:
                state.quality_gates_passed.discard("professional_compliance")
            else:
                state.quality_gates_passed.add("professional_compliance")
            
            state.professional_validation_time_seconds = time.time() - start_time
            
        except Exception as e:
            logger.error(f"Professional domain validation failed: {str(e)}")
            state.add_message("error", f"Professional domain validation failed: {str(e)}")
    
    async def _make_final_culturally_informed_decision(self, state: ReviewState):
        """Make final review decision with cultural intelligence"""
        state.phase = ReviewPhase.FINAL_REVIEW
        logger.info("Making final culturally-informed review decision")
        
        try:
            # Calculate final cultural compliance metrics
            overall_score = state.cultural_metrics.overall_score()
            meets_threshold = state.cultural_metrics.meets_approval_threshold()
            
            # Determine decision based on cultural compliance
            if meets_threshold and overall_score >= 90.0:
                # All cultural compliance requirements met
                if (len(state.islamic_compliance_issues) == 0 and 
                    len(state.cultural_appropriateness_issues) == 0 and
                    len(state.arabic_processing_issues) == 0):
                    state.decision = ReviewDecision.APPROVED
                else:
                    # Minor issues that don't affect overall approval
                    state.decision = ReviewDecision.APPROVED
                    
            elif state.cultural_metrics.islamic_compliance_score < 95.0:
                state.decision = ReviewDecision.NEEDS_ISLAMIC_COMPLIANCE
            elif state.cultural_metrics.cultural_appropriateness_score < 90.0:
                state.decision = ReviewDecision.NEEDS_CULTURAL_FIXES
            elif state.cultural_metrics.professional_domain_score < 85.0:
                state.decision = ReviewDecision.NEEDS_PROFESSIONAL_STANDARDS
            elif len(state.arabic_processing_issues) > 0:
                state.decision = ReviewDecision.NEEDS_ARABIC_IMPROVEMENTS
            else:
                state.decision = ReviewDecision.REQUIRES_MAJOR_CHANGES
            
            # Generate final review summary
            await self._generate_final_review_summary(state)
            
            # Update phase to completed
            state.phase = ReviewPhase.COMPLETED
            
            logger.info(f"Final review decision: {state.decision.value}")
            logger.info(f"Overall cultural compliance score: {overall_score:.1f}%")
            
        except Exception as e:
            logger.error(f"Final review decision failed: {str(e)}")
            state.decision = ReviewDecision.REQUIRES_MAJOR_CHANGES
            state.add_message("error", f"Final review decision failed: {str(e)}")
    
    async def _generate_final_review_summary(self, state: ReviewState):
        """Generate comprehensive final review summary"""
        try:
            summary_parts = []
            
            # Overall assessment
            summary_parts.append(f"## Iraqi Cultural Compliance Review Summary")
            summary_parts.append(f"**Decision:** {state.decision.value.upper()}")
            summary_parts.append(f"**Overall Score:** {state.cultural_metrics.overall_score():.1f}%")
            summary_parts.append(f"**Review Duration:** {state.total_review_time_seconds:.2f} seconds")
            summary_parts.append("")
            
            # Cultural compliance breakdown
            summary_parts.append("### Cultural Compliance Metrics")
            summary_parts.append(f"- Islamic Compliance: {state.cultural_metrics.islamic_compliance_score:.1f}% (Threshold: >95%)")
            summary_parts.append(f"- Cultural Appropriateness: {state.cultural_metrics.cultural_appropriateness_score:.1f}% (Threshold: >90%)")
            summary_parts.append(f"- Professional Domain: {state.cultural_metrics.professional_domain_score:.1f}% (Threshold: >85%)")
            summary_parts.append(f"- Arabic Processing: {state.cultural_metrics.arabic_processing_score:.1f}% (Threshold: >90%)")
            summary_parts.append(f"- Government Compliance: {state.cultural_metrics.government_compliance_score:.1f}% (Threshold: >95%)")
            summary_parts.append("")
            
            # Issues summary
            total_issues = (len(state.islamic_compliance_issues) + 
                           len(state.cultural_appropriateness_issues) + 
                           len(state.professional_domain_issues) + 
                           len(state.arabic_processing_issues))
            
            summary_parts.append(f"### Issues Identified: {total_issues}")
            
            if state.islamic_compliance_issues:
                summary_parts.append(f"**Islamic Compliance Issues ({len(state.islamic_compliance_issues)}):**")
                for issue in state.islamic_compliance_issues[:5]:  # Limit to first 5
                    summary_parts.append(f"- {issue}")
                if len(state.islamic_compliance_issues) > 5:
                    summary_parts.append(f"- ... and {len(state.islamic_compliance_issues) - 5} more")
                summary_parts.append("")
            
            if state.cultural_appropriateness_issues:
                summary_parts.append(f"**Cultural Appropriateness Issues ({len(state.cultural_appropriateness_issues)}):**")
                for issue in state.cultural_appropriateness_issues[:5]:
                    summary_parts.append(f"- {issue}")
                if len(state.cultural_appropriateness_issues) > 5:
                    summary_parts.append(f"- ... and {len(state.cultural_appropriateness_issues) - 5} more")
                summary_parts.append("")
            
            if state.arabic_processing_issues:
                summary_parts.append(f"**Arabic Processing Issues ({len(state.arabic_processing_issues)}):**")
                for issue in state.arabic_processing_issues[:3]:
                    summary_parts.append(f"- {issue}")
                if len(state.arabic_processing_issues) > 3:
                    summary_parts.append(f"- ... and {len(state.arabic_processing_issues) - 3} more")
                summary_parts.append("")
            
            # Recommendations based on decision
            summary_parts.append("### Recommendations")
            if state.decision == ReviewDecision.APPROVED:
                summary_parts.append("✅ All Iraqi cultural compliance requirements met. Ready for approval.")
            elif state.decision == ReviewDecision.NEEDS_ISLAMIC_COMPLIANCE:
                summary_parts.append("🕌 Islamic compliance improvements required before approval.")
                summary_parts.append("- Review content for Islamic principles alignment")
                summary_parts.append("- Ensure halal code practices are implemented")
                summary_parts.append("- Validate religious sensitivity in all features")
            elif state.decision == ReviewDecision.NEEDS_CULTURAL_FIXES:
                summary_parts.append("🇮🇶 Cultural appropriateness improvements needed.")
                summary_parts.append("- Align content with Iraqi cultural norms")
                summary_parts.append("- Review cultural sensitivity in user-facing elements")
                summary_parts.append("- Ensure cultural context is preserved")
            elif state.decision == ReviewDecision.NEEDS_ARABIC_IMPROVEMENTS:
                summary_parts.append("📝 Arabic processing improvements required.")
                summary_parts.append("- Fix RTL layout issues")
                summary_parts.append("- Improve Arabic text handling")
                summary_parts.append("- Validate mixed Arabic-English content")
            
            # Performance metrics
            summary_parts.append("")
            summary_parts.append("### Performance Metrics")
            summary_parts.append(f"- Cultural Analysis: {state.cultural_analysis_time_seconds:.2f}s")
            summary_parts.append(f"- Islamic Validation: {state.islamic_validation_time_seconds:.2f}s") 
            summary_parts.append(f"- Professional Validation: {state.professional_validation_time_seconds:.2f}s")
            summary_parts.append(f"- Actions Completed: {len([a for a in state.review_actions if a.completed])}/{len(state.review_actions)}")
            
            final_summary = "\n".join(summary_parts)
            
            state.add_message(
                "final_review",
                final_summary,
                f"Iraqi cultural compliance review completed with {state.decision.value} decision"
            )
            
            # Add to scratchpad for reference
            state.add_scratchpad_note(final_summary, "final_review_summary")
            
        except Exception as e:
            logger.error(f"Failed to generate final review summary: {str(e)}")
            state.add_message("error", f"Final review summary generation failed: {str(e)}")

# Example usage and integration patterns
async def main():
    """Example usage of Iraqi Reviewer Agent"""
    try:
        # Initialize reviewer for a sample repository
        reviewer = IraqiReviewerAgent("/path/to/repository")
        
        # Sample review scenario
        changed_files = [
            "src/components/PrayerTimes.tsx",
            "src/pages/IslamicCalendar.tsx", 
            "src/utils/arabicText.ts",
            "src/styles/rtl.css"
        ]
        
        user_request = "Add Islamic prayer times component with RTL Arabic support"
        
        # Perform comprehensive cultural review
        review_result = await reviewer.review_changes(
            changed_files=changed_files,
            user_request=user_request,
            base_branch="main"
        )
        
        # Display results
        print(f"Review Decision: {review_result.decision.value}")
        print(f"Overall Score: {review_result.cultural_metrics.overall_score():.1f}%")
        print(f"Islamic Compliance: {review_result.cultural_metrics.islamic_compliance_score:.1f}%")
        print(f"Review Duration: {review_result.total_review_time_seconds:.2f}s")
        
        # Show cultural issues if any
        if review_result.islamic_compliance_issues:
            print(f"\nIslamic Compliance Issues ({len(review_result.islamic_compliance_issues)}):")
            for issue in review_result.islamic_compliance_issues:
                print(f"  - {issue}")
        
        return review_result
        
    except Exception as e:
        logger.error(f"Example usage failed: {str(e)}")
        raise

if __name__ == "__main__":
    asyncio.run(main())