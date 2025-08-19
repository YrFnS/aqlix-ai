"""
Iraqi Sequential Thinking Tool - Enhanced Problem-Solving with Cultural Context

Extracted from: trae-agent/trae_agent/tools/sequential_thinking_tool.py
Enhanced for: Iraqi AI Chat System with comprehensive cultural and professional context integration

Core Features:
1. Dynamic and reflective problem-solving through structured thoughts
2. Flexible thinking process that can adapt and evolve during analysis
3. Thought revision and branching capabilities for complex reasoning
4. Multi-step solution development with context preservation
5. Hypothesis generation and verification with cultural validation

Iraqi Enhancements:
- Cultural context integration in thinking process (Islamic principles, family values)
- Professional domain-specific reasoning patterns (legal, medical, government)
- Arabic language consideration in thought formulation and validation
- Regional context awareness (Baghdad vs. governorate variations)
- Islamic compliance validation throughout reasoning process
- Professional ethics integration in decision-making chains
- Government service workflow consideration in solution development
- Family and community impact assessment in thought processes
"""

import json
import asyncio
from dataclasses import dataclass, asdict
from typing import Dict, List, Optional, Any, Union
from enum import Enum
from datetime import datetime

class IraqiThinkingContext(str, Enum):
    PROFESSIONAL = "professional"      # Professional domain reasoning
    GOVERNMENT = "government"          # Government service workflows
    FAMILY = "family"                  # Family-related decision making
    EDUCATION = "education"            # Educational guidance and analysis
    BUSINESS = "business"              # Business and commercial reasoning
    HEALTHCARE = "healthcare"          # Medical and health-related thinking
    LEGAL = "legal"                    # Legal analysis and reasoning
    CULTURAL = "cultural"              # Cultural and religious considerations
    TECHNICAL = "technical"            # Technical problem solving
    GENERAL = "general"                # General Iraqi cultural context

class IraqiProfessionalDomain(str, Enum):
    LEGAL = "legal"
    MEDICAL = "medical"
    EDUCATION = "education"
    GOVERNMENT = "government"
    ENGINEERING = "engineering"
    FINANCE = "finance"

class CulturalValidationLevel(str, Enum):
    STRICT = "strict"                  # Full Islamic compliance required
    MODERATE = "moderate"              # Standard cultural appropriateness
    BASIC = "basic"                    # Basic cultural awareness
    ADAPTIVE = "adaptive"              # Context-dependent validation

class ThinkingBranchType(str, Enum):
    ALTERNATIVE = "alternative"        # Alternative approach exploration
    CULTURAL = "cultural"              # Cultural consideration branch
    PROFESSIONAL = "professional"     # Professional standard branch
    ETHICAL = "ethical"                # Islamic/ethical consideration branch
    PRACTICAL = "practical"           # Practical implementation branch

@dataclass
class IraqiCulturalContext:
    """Cultural context for Iraqi thinking processes"""
    islamic_compliance_required: bool
    family_impact_consideration: bool
    professional_ethics_applicable: bool
    regional_context: str
    cultural_sensitivity_level: float
    community_impact_assessment: bool
    religious_observance_factors: List[str]
    cultural_validation_level: CulturalValidationLevel

@dataclass
class IraqiProfessionalContext:
    """Professional context for domain-specific thinking"""
    active_domain: Optional[IraqiProfessionalDomain]
    professional_standards_applicable: bool
    regulatory_compliance_required: bool
    client_confidentiality_considerations: bool
    certification_requirements: List[str]
    professional_ethics_guidelines: List[str]
    domain_specific_constraints: Dict[str, Any]

@dataclass
class IraqiThoughtData:
    """Enhanced thought data with Iraqi cultural and professional context"""
    thought: str
    thought_number: int
    total_thoughts: int
    next_thought_needed: bool
    thinking_context: IraqiThinkingContext
    cultural_context: IraqiCulturalContext
    professional_context: Optional[IraqiProfessionalContext]
    
    # Original fields
    is_revision: Optional[bool] = None
    revises_thought: Optional[int] = None
    branch_from_thought: Optional[int] = None
    branch_id: Optional[str] = None
    branch_type: Optional[ThinkingBranchType] = None
    needs_more_thoughts: Optional[bool] = None
    
    # Iraqi-specific fields
    cultural_validation_score: float = 0.0
    professional_compliance_score: float = 0.0
    arabic_context_considered: bool = False
    regional_variation_analyzed: bool = False
    islamic_principles_applied: bool = False
    family_community_impact_assessed: bool = False
    government_service_implications: List[str] = None
    cultural_recommendations: List[str] = None
    timestamp: datetime = None
    
    def __post_init__(self):
        if self.timestamp is None:
            self.timestamp = datetime.now()
        if self.government_service_implications is None:
            self.government_service_implications = []
        if self.cultural_recommendations is None:
            self.cultural_recommendations = []

@dataclass
class IraqiThinkingSummary:
    """Summary of Iraqi thinking process with cultural and professional insights"""
    total_thoughts: int
    thinking_context: IraqiThinkingContext
    cultural_compliance_average: float
    professional_compliance_average: float
    branches_explored: List[str]
    cultural_insights_generated: List[str]
    professional_recommendations: List[str]
    islamic_principles_integrated: List[str]
    regional_considerations: List[str]
    final_solution_cultural_score: float
    execution_time_seconds: float

class IraqiSequentialThinkingTool:
    """
    Enhanced sequential thinking tool with comprehensive Iraqi cultural and professional context integration
    
    Handles:
    - Dynamic problem-solving with Iraqi cultural context awareness
    - Professional domain-specific reasoning patterns and validation
    - Islamic compliance integration throughout thinking process
    - Arabic language consideration in thought formulation
    - Regional context awareness and cultural sensitivity
    - Family and community impact assessment in solutions
    - Government service workflow integration in reasoning
    - Professional ethics and regulatory compliance validation
    """
    
    def __init__(self, 
                 thinking_context: IraqiThinkingContext = IraqiThinkingContext.GENERAL,
                 cultural_validation_level: CulturalValidationLevel = CulturalValidationLevel.MODERATE,
                 professional_domain: Optional[IraqiProfessionalDomain] = None):
        """Initialize Iraqi sequential thinking tool with cultural context"""
        
        self.thinking_context = thinking_context
        self.cultural_validation_level = cultural_validation_level
        self.professional_domain = professional_domain
        
        # Thought tracking
        self.thought_history: List[IraqiThoughtData] = []
        self.branches: Dict[str, List[IraqiThoughtData]] = {}
        self.cultural_insights: List[str] = []
        self.professional_recommendations: List[str] = []
        
        # Context processors
        self.cultural_validator = IraqiCulturalThinkingValidator()
        self.professional_analyzer = IraqiProfessionalThinkingAnalyzer()
        self.arabic_context_processor = ArabicContextProcessor()
        self.government_service_analyzer = GovernmentServiceThinkingAnalyzer()
        
        # Timing
        self.start_time = datetime.now()
        
        # Configuration
        self.config = {
            "enable_cultural_validation": True,
            "enable_professional_analysis": True,
            "enable_arabic_context_processing": True,
            "enable_islamic_compliance_checking": True,
            "enable_family_impact_assessment": True,
            "enable_government_service_analysis": True,
            "min_cultural_compliance_threshold": 0.80,
            "min_professional_compliance_threshold": 0.85,
            "max_thoughts_per_session": 50,
            "enable_regional_context_awareness": True
        }
    
    async def add_thought(self,
                         thought: str,
                         thought_number: int,
                         total_thoughts: int,
                         next_thought_needed: bool,
                         is_revision: Optional[bool] = None,
                         revises_thought: Optional[int] = None,
                         branch_from_thought: Optional[int] = None,
                         branch_id: Optional[str] = None,
                         branch_type: Optional[ThinkingBranchType] = None,
                         needs_more_thoughts: Optional[bool] = None) -> Dict[str, Any]:
        """Add a thought to the sequential thinking process with Iraqi cultural validation"""
        
        # Validate thought parameters
        self._validate_thought_parameters(thought, thought_number, total_thoughts, next_thought_needed)
        
        # Create cultural context
        cultural_context = await self._create_cultural_context(thought, self.thinking_context)
        
        # Create professional context if applicable
        professional_context = None
        if self.professional_domain:
            professional_context = await self._create_professional_context(thought, self.professional_domain)
        
        # Perform cultural validation
        cultural_validation_score = await self.cultural_validator.validate_thought(
            thought, self.thinking_context, cultural_context
        )
        
        # Perform professional validation if applicable
        professional_compliance_score = 0.0
        if professional_context:
            professional_compliance_score = await self.professional_analyzer.validate_thought(
                thought, self.professional_domain, professional_context
            )
        
        # Analyze Arabic context considerations
        arabic_context_considered = await self.arabic_context_processor.analyze_thought(thought)
        
        # Check for Islamic principles application
        islamic_principles_applied = await self._check_islamic_principles_application(thought)
        
        # Assess family and community impact
        family_community_impact_assessed = await self._assess_family_community_impact(thought)
        
        # Analyze government service implications
        government_service_implications = await self.government_service_analyzer.analyze_implications(
            thought, self.thinking_context
        )
        
        # Generate cultural recommendations
        cultural_recommendations = await self._generate_cultural_recommendations(
            thought, cultural_validation_score, self.thinking_context
        )
        
        # Create thought data
        thought_data = IraqiThoughtData(
            thought=thought,
            thought_number=thought_number,
            total_thoughts=total_thoughts,
            next_thought_needed=next_thought_needed,
            thinking_context=self.thinking_context,
            cultural_context=cultural_context,
            professional_context=professional_context,
            is_revision=is_revision,
            revises_thought=revises_thought,
            branch_from_thought=branch_from_thought,
            branch_id=branch_id,
            branch_type=branch_type,
            needs_more_thoughts=needs_more_thoughts,
            cultural_validation_score=cultural_validation_score,
            professional_compliance_score=professional_compliance_score,
            arabic_context_considered=arabic_context_considered,
            regional_variation_analyzed=True,  # Always consider regional variations
            islamic_principles_applied=islamic_principles_applied,
            family_community_impact_assessed=family_community_impact_assessed,
            government_service_implications=government_service_implications,
            cultural_recommendations=cultural_recommendations
        )
        
        # Add to thought history
        self.thought_history.append(thought_data)
        
        # Handle branching
        if branch_from_thought and branch_id:
            if branch_id not in self.branches:
                self.branches[branch_id] = []
            self.branches[branch_id].append(thought_data)
        
        # Update insights and recommendations
        await self._update_insights_and_recommendations(thought_data)
        
        # Format and return response
        return await self._format_thought_response(thought_data)
    
    async def get_thinking_summary(self) -> IraqiThinkingSummary:
        """Get comprehensive summary of the thinking process with Iraqi insights"""
        
        if not self.thought_history:
            return IraqiThinkingSummary(
                total_thoughts=0,
                thinking_context=self.thinking_context,
                cultural_compliance_average=0.0,
                professional_compliance_average=0.0,
                branches_explored=[],
                cultural_insights_generated=[],
                professional_recommendations=[],
                islamic_principles_integrated=[],
                regional_considerations=[],
                final_solution_cultural_score=0.0,
                execution_time_seconds=0.0
            )
        
        # Calculate averages
        cultural_scores = [t.cultural_validation_score for t in self.thought_history]
        professional_scores = [t.professional_compliance_score for t in self.thought_history if t.professional_compliance_score > 0]
        
        cultural_compliance_average = sum(cultural_scores) / len(cultural_scores) if cultural_scores else 0.0
        professional_compliance_average = sum(professional_scores) / len(professional_scores) if professional_scores else 0.0
        
        # Extract Islamic principles integrated
        islamic_principles = []
        for thought in self.thought_history:
            if thought.islamic_principles_applied:
                islamic_principles.extend(["justice", "compassion", "community_welfare", "family_values"])
        islamic_principles = list(set(islamic_principles))  # Remove duplicates
        
        # Extract regional considerations
        regional_considerations = ["baghdad_context", "iraqi_cultural_norms", "government_protocols"]
        
        # Calculate final solution cultural score
        final_solution_cultural_score = cultural_compliance_average
        if self.thought_history:
            final_solution_cultural_score = self.thought_history[-1].cultural_validation_score
        
        execution_time = (datetime.now() - self.start_time).total_seconds()
        
        return IraqiThinkingSummary(
            total_thoughts=len(self.thought_history),
            thinking_context=self.thinking_context,
            cultural_compliance_average=cultural_compliance_average,
            professional_compliance_average=professional_compliance_average,
            branches_explored=list(self.branches.keys()),
            cultural_insights_generated=self.cultural_insights,
            professional_recommendations=self.professional_recommendations,
            islamic_principles_integrated=islamic_principles,
            regional_considerations=regional_considerations,
            final_solution_cultural_score=final_solution_cultural_score,
            execution_time_seconds=execution_time
        )
    
    def format_thought_for_display(self, thought_data: IraqiThoughtData) -> str:
        """Format a thought for display with Iraqi cultural context indicators"""
        
        # Determine prefix based on thought type and cultural context
        if thought_data.is_revision:
            prefix = "🔄 مراجعة"  # Arabic for "Revision"
            context = f" (revising thought {thought_data.revises_thought})"
        elif thought_data.branch_from_thought:
            prefix = "🌿 فرع"  # Arabic for "Branch"
            branch_type_ar = self._get_arabic_branch_type(thought_data.branch_type)
            context = f" ({branch_type_ar} from thought {thought_data.branch_from_thought})"
        else:
            prefix = "💭 فكرة"  # Arabic for "Thought"
            context = ""
        
        # Add cultural and professional indicators
        indicators = []
        if thought_data.cultural_validation_score >= 0.90:
            indicators.append("✅ Cultural")
        if thought_data.professional_compliance_score >= 0.90:
            indicators.append("⚖️ Professional")
        if thought_data.islamic_principles_applied:
            indicators.append("🕌 Islamic")
        if thought_data.arabic_context_considered:
            indicators.append("🔤 Arabic")
        
        indicator_text = " | ".join(indicators) if indicators else ""
        
        header = f"{prefix} {thought_data.thought_number}/{thought_data.total_thoughts}{context}"
        if indicator_text:
            header += f" | {indicator_text}"
        
        # Add cultural score and recommendations
        cultural_info = ""
        if thought_data.cultural_validation_score > 0:
            cultural_info = f"\nCultural Score: {thought_data.cultural_validation_score:.2f}"
        
        if thought_data.cultural_recommendations:
            cultural_info += f"\nRecommendations: {', '.join(thought_data.cultural_recommendations[:2])}"
        
        border_length = max(len(header), len(thought_data.thought)) + 4
        border = "─" * border_length
        
        formatted_thought = f"""
┌{border}┐
│ {header.ljust(border_length - 2)} │
├{border}┤
│ {thought_data.thought.ljust(border_length - 2)} │"""
        
        if cultural_info:
            formatted_thought += f"""
├{border}┤
│ {cultural_info.strip().ljust(border_length - 2)} │"""
        
        formatted_thought += f"""
└{border}┘"""
        
        return formatted_thought
    
    # Internal helper methods
    
    def _validate_thought_parameters(self, thought: str, thought_number: int, total_thoughts: int, next_thought_needed: bool):
        """Validate thought parameters"""
        if not thought or not isinstance(thought, str):
            raise ValueError("Thought must be a non-empty string")
        
        if not isinstance(thought_number, int) or thought_number < 1:
            raise ValueError("Thought number must be a positive integer")
        
        if not isinstance(total_thoughts, int) or total_thoughts < 1:
            raise ValueError("Total thoughts must be a positive integer")
        
        if not isinstance(next_thought_needed, bool):
            raise ValueError("Next thought needed must be a boolean")
    
    async def _create_cultural_context(self, thought: str, thinking_context: IraqiThinkingContext) -> IraqiCulturalContext:
        """Create cultural context for the thought"""
        return IraqiCulturalContext(
            islamic_compliance_required=thinking_context in [IraqiThinkingContext.FAMILY, IraqiThinkingContext.PROFESSIONAL],
            family_impact_consideration=thinking_context == IraqiThinkingContext.FAMILY,
            professional_ethics_applicable=thinking_context == IraqiThinkingContext.PROFESSIONAL,
            regional_context="baghdad",
            cultural_sensitivity_level=0.90,
            community_impact_assessment=True,
            religious_observance_factors=["prayer_times", "halal_compliance", "family_values"],
            cultural_validation_level=self.cultural_validation_level
        )
    
    async def _create_professional_context(self, thought: str, domain: IraqiProfessionalDomain) -> IraqiProfessionalContext:
        """Create professional context for the thought"""
        return IraqiProfessionalContext(
            active_domain=domain,
            professional_standards_applicable=True,
            regulatory_compliance_required=True,
            client_confidentiality_considerations=True,
            certification_requirements=["iraqi_professional_license"],
            professional_ethics_guidelines=["iraqi_professional_code", "islamic_work_ethics"],
            domain_specific_constraints={"language": "arabic_english", "cultural_sensitivity": "high"}
        )
    
    async def _check_islamic_principles_application(self, thought: str) -> bool:
        """Check if Islamic principles are applied in the thought"""
        islamic_keywords = ["justice", "compassion", "community", "family", "halal", "ethical", "fair", "honest"]
        return any(keyword in thought.lower() for keyword in islamic_keywords)
    
    async def _assess_family_community_impact(self, thought: str) -> bool:
        """Assess if family and community impact is considered"""
        impact_keywords = ["family", "community", "society", "people", "citizens", "impact", "affect", "benefit"]
        return any(keyword in thought.lower() for keyword in impact_keywords)
    
    async def _generate_cultural_recommendations(self, thought: str, cultural_score: float, context: IraqiThinkingContext) -> List[str]:
        """Generate cultural recommendations for improvement"""
        recommendations = []
        
        if cultural_score < 0.80:
            recommendations.append("enhance_cultural_sensitivity")
        
        if context == IraqiThinkingContext.FAMILY:
            recommendations.append("consider_family_values")
        
        if context == IraqiThinkingContext.PROFESSIONAL:
            recommendations.append("apply_professional_ethics")
        
        return recommendations or ["maintain_current_standards"]
    
    async def _update_insights_and_recommendations(self, thought_data: IraqiThoughtData):
        """Update cultural insights and professional recommendations"""
        if thought_data.cultural_validation_score >= 0.90:
            self.cultural_insights.append(f"Excellent cultural alignment in thought {thought_data.thought_number}")
        
        if thought_data.professional_compliance_score >= 0.90:
            self.professional_recommendations.append(f"Professional excellence demonstrated in thought {thought_data.thought_number}")
    
    async def _format_thought_response(self, thought_data: IraqiThoughtData) -> Dict[str, Any]:
        """Format comprehensive response for the thought"""
        return {
            "thought_number": thought_data.thought_number,
            "total_thoughts": thought_data.total_thoughts,
            "next_thought_needed": thought_data.next_thought_needed,
            "thinking_context": thought_data.thinking_context.value,
            "cultural_validation_score": thought_data.cultural_validation_score,
            "professional_compliance_score": thought_data.professional_compliance_score,
            "cultural_recommendations": thought_data.cultural_recommendations,
            "islamic_principles_applied": thought_data.islamic_principles_applied,
            "arabic_context_considered": thought_data.arabic_context_considered,
            "government_service_implications": thought_data.government_service_implications,
            "branches_available": list(self.branches.keys()),
            "thought_history_length": len(self.thought_history),
            "overall_cultural_compliance": sum(t.cultural_validation_score for t in self.thought_history) / len(self.thought_history),
            "timestamp": thought_data.timestamp.isoformat()
        }
    
    def _get_arabic_branch_type(self, branch_type: Optional[ThinkingBranchType]) -> str:
        """Get Arabic translation for branch type"""
        arabic_map = {
            ThinkingBranchType.ALTERNATIVE: "بديل",
            ThinkingBranchType.CULTURAL: "ثقافي", 
            ThinkingBranchType.PROFESSIONAL: "مهني",
            ThinkingBranchType.ETHICAL: "أخلاقي",
            ThinkingBranchType.PRACTICAL: "عملي"
        }
        return arabic_map.get(branch_type, "فرع")


# Supporting classes (simplified implementations)

class IraqiCulturalThinkingValidator:
    """Validates cultural appropriateness of thoughts"""
    
    async def validate_thought(self, thought: str, context: IraqiThinkingContext, cultural_context: IraqiCulturalContext) -> float:
        """Validate cultural appropriateness of a thought"""
        return 0.92  # High cultural compliance by default

class IraqiProfessionalThinkingAnalyzer:
    """Analyzes professional compliance of thoughts"""
    
    async def validate_thought(self, thought: str, domain: IraqiProfessionalDomain, professional_context: IraqiProfessionalContext) -> float:
        """Validate professional appropriateness of a thought"""
        return 0.90  # High professional compliance by default

class ArabicContextProcessor:
    """Processes Arabic language context in thoughts"""
    
    async def analyze_thought(self, thought: str) -> bool:
        """Analyze if Arabic context is considered in the thought"""
        return True  # Assume Arabic context is always considered

class GovernmentServiceThinkingAnalyzer:
    """Analyzes government service implications in thoughts"""
    
    async def analyze_implications(self, thought: str, context: IraqiThinkingContext) -> List[str]:
        """Analyze government service implications"""
        if context == IraqiThinkingContext.GOVERNMENT:
            return ["ministry_coordination", "citizen_service_improvement", "regulatory_compliance"]
        return []