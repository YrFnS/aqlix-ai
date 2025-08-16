"""
Cultural Task Validator - Iraqi Cultural Validation for Focus Chain Tasks

Extracted from: cline/docs/features/focus-chain.mdx
Enhanced for: Iraqi AI Chat System with comprehensive cultural validation

Core Features:
1. Cultural Appropriateness Scoring with Iraqi Context
2. Islamic Compliance Validation for Task Content
3. Professional Domain Cultural Alignment
4. Family Context Sensitivity Assessment
5. Government Service Cultural Requirements

Iraqi Enhancements:
- Iraqi cultural norms and values validation
- Islamic principles compliance checking
- Professional domain cultural standards
- Family context appropriateness scoring
- Government service cultural requirements
- Regional cultural considerations (Baghdad, Basra, Mosul, Erbil)
"""

from dataclasses import dataclass
from typing import Dict, List, Optional, Any, Tuple
from enum import Enum
import asyncio
import re
from datetime import datetime

class CulturalDomain(str, Enum):
    FAMILY = "family"
    PROFESSIONAL = "professional"
    RELIGIOUS = "religious"
    SOCIAL = "social"
    GOVERNMENT = "government"
    BUSINESS = "business"
    EDUCATION = "education"
    MEDICAL = "medical"

class IslamicPrinciple(str, Enum):
    HALAL_CONTENT = "halal_content"
    FAMILY_VALUES = "family_values"
    RESPECT_ELDERS = "respect_elders"
    COMMUNITY_BENEFIT = "community_benefit"
    KNOWLEDGE_SEEKING = "knowledge_seeking"
    HONESTY_TRANSPARENCY = "honesty_transparency"
    PRIVACY_PROTECTION = "privacy_protection"

class RegionalContext(str, Enum):
    BAGHDAD = "baghdad"
    BASRA = "basra"
    MOSUL = "mosul"
    ERBIL = "erbil"
    NAJAF = "najaf"
    KARBALA = "karbala"
    GENERAL_IRAQ = "general_iraq"

@dataclass
class CulturalValidationResult:
    """Result of cultural validation with detailed scoring"""
    score: float  # 0.0 to 1.0
    approved: bool
    cultural_domain: CulturalDomain
    issues: List[str]
    suggestions: List[str]
    islamic_compliance: Dict[IslamicPrinciple, bool]
    regional_appropriateness: Dict[RegionalContext, float]
    family_sensitivity_score: float
    professional_appropriateness: float
    validation_timestamp: str
    confidence_level: float

@dataclass
class CulturalContext:
    """Comprehensive cultural context for validation"""
    professional_domain: str
    regional_context: RegionalContext
    family_context_level: str  # high, medium, low
    islamic_compliance_required: bool
    government_service_context: bool
    business_context: bool
    educational_context: bool
    medical_context: bool
    target_audience: str  # family, professional, mixed
    language_preference: str  # arabic, english, mixed

class CulturalTaskValidator:
    """
    Comprehensive cultural validation system for Iraqi Focus Chain tasks
    
    Validates tasks against:
    - Iraqi cultural norms and values
    - Islamic principles and compliance
    - Professional domain standards
    - Family context appropriateness
    - Regional cultural considerations
    - Government service requirements
    """
    
    def __init__(self):
        self.cultural_patterns = self._load_cultural_patterns()
        self.islamic_principles_checker = IslamicPrinciplesChecker()
        self.professional_cultural_analyzer = ProfessionalCulturalAnalyzer()
        self.family_context_evaluator = FamilyContextEvaluator()
        self.regional_cultural_assessor = RegionalCulturalAssessor()
        self.government_cultural_validator = GovernmentCulturalValidator()
        
        # Cultural validation thresholds
        self.thresholds = {
            "minimum_cultural_score": 0.90,
            "family_sensitivity_threshold": 0.95,
            "professional_appropriateness_threshold": 0.85,
            "islamic_compliance_threshold": 0.95,
            "government_service_threshold": 0.98
        }
    
    async def validate_task(self, 
                           task_content: str, 
                           cultural_context: Dict[str, Any], 
                           threshold: float = 0.95) -> CulturalValidationResult:
        """
        Comprehensive cultural validation of task content
        
        Args:
            task_content: The task description to validate
            cultural_context: Iraqi cultural context dictionary
            threshold: Minimum required cultural score
            
        Returns:
            Detailed cultural validation result
        """
        
        # Parse cultural context
        context = self._parse_cultural_context(cultural_context)
        
        # Initialize validation result
        validation_start = datetime.now()
        
        # 1. Basic cultural appropriateness analysis
        basic_cultural_score = await self._analyze_basic_cultural_appropriateness(
            task_content, context
        )
        
        # 2. Islamic principles compliance check
        islamic_compliance = await self.islamic_principles_checker.validate_islamic_compliance(
            task_content, context
        )
        
        # 3. Professional domain cultural alignment
        professional_score = await self.professional_cultural_analyzer.assess_professional_alignment(
            task_content, context
        )
        
        # 4. Family context sensitivity evaluation
        family_sensitivity = await self.family_context_evaluator.evaluate_family_sensitivity(
            task_content, context
        )
        
        # 5. Regional cultural appropriateness
        regional_scores = await self.regional_cultural_assessor.assess_regional_appropriateness(
            task_content, context
        )
        
        # 6. Government service cultural validation (if applicable)
        government_validation = await self._validate_government_service_context(
            task_content, context
        )
        
        # Calculate overall cultural score
        overall_score = self._calculate_overall_cultural_score(
            basic_cultural_score,
            islamic_compliance,
            professional_score,
            family_sensitivity,
            regional_scores,
            government_validation,
            context
        )
        
        # Identify issues and suggestions
        issues, suggestions = self._analyze_cultural_issues_and_suggestions(
            task_content, context, overall_score, islamic_compliance,
            professional_score, family_sensitivity
        )
        
        # Determine approval status
        approved = (
            overall_score >= threshold and
            all(islamic_compliance.values()) and
            family_sensitivity >= self.thresholds["family_sensitivity_threshold"] and
            professional_score >= self.thresholds["professional_appropriateness_threshold"]
        )
        
        # Calculate confidence level
        confidence = self._calculate_validation_confidence(
            basic_cultural_score, islamic_compliance, professional_score,
            family_sensitivity, regional_scores
        )
        
        return CulturalValidationResult(
            score=overall_score,
            approved=approved,
            cultural_domain=self._determine_cultural_domain(task_content, context),
            issues=issues,
            suggestions=suggestions,
            islamic_compliance=islamic_compliance,
            regional_appropriateness=regional_scores,
            family_sensitivity_score=family_sensitivity,
            professional_appropriateness=professional_score,
            validation_timestamp=datetime.now().isoformat(),
            confidence_level=confidence
        )
    
    async def validate_task_transition(self, 
                                     task_content: str,
                                     old_status: str,
                                     new_status: str,
                                     cultural_context: Dict[str, Any]) -> bool:
        """
        Validate task status transitions for cultural appropriateness
        
        Args:
            task_content: Task description
            old_status: Previous task status
            new_status: New task status
            cultural_context: Cultural context
            
        Returns:
            True if transition is culturally appropriate
        """
        
        context = self._parse_cultural_context(cultural_context)
        
        # Check for culturally sensitive transitions
        if context.government_service_context:
            # Government tasks require special approval for completion
            if new_status == "completed" and old_status != "in_progress":
                return False
        
        if context.family_context_level == "high":
            # Family tasks should not be cancelled without cultural validation
            if new_status == "cancelled":
                family_validation = await self.family_context_evaluator.validate_task_cancellation(
                    task_content, context
                )
                return family_validation.approved
        
        if context.islamic_compliance_required:
            # Islamic compliance required for all status changes
            islamic_validation = await self.islamic_principles_checker.validate_status_transition(
                task_content, old_status, new_status, context
            )
            return islamic_validation.approved
        
        return True
    
    async def notify_task_status_change(self, task, old_status: str, new_status: str) -> None:
        """
        Handle cultural notifications for task status changes
        
        Args:
            task: Task object with cultural context
            old_status: Previous status
            new_status: New status
        """
        
        # Log cultural status change
        cultural_log = {
            "task_id": task.id,
            "cultural_compliance_score": task.cultural_compliance_score,
            "islamic_approval": task.islamic_approval_status,
            "professional_domain": task.professional_domain,
            "family_appropriate": task.family_context_appropriate,
            "government_related": task.government_service_related,
            "status_transition": f"{old_status} → {new_status}",
            "timestamp": datetime.now().isoformat()
        }
        
        # Notify cultural monitoring system
        await self._notify_cultural_monitoring_system(cultural_log)
        
        # Update cultural learning patterns
        await self._update_cultural_learning_patterns(task, old_status, new_status)
    
    # Internal validation methods
    
    def _parse_cultural_context(self, cultural_context: Dict[str, Any]) -> CulturalContext:
        """Parse cultural context dictionary into structured format"""
        
        return CulturalContext(
            professional_domain=cultural_context.get("professional_domain", "general"),
            regional_context=RegionalContext(cultural_context.get("regional_context", "general_iraq")),
            family_context_level=cultural_context.get("family_context_level", "high"),
            islamic_compliance_required=cultural_context.get("islamic_compliance_required", True),
            government_service_context=cultural_context.get("government_service_context", False),
            business_context=cultural_context.get("business_context", False),
            educational_context=cultural_context.get("educational_context", False),
            medical_context=cultural_context.get("medical_context", False),
            target_audience=cultural_context.get("target_audience", "mixed"),
            language_preference=cultural_context.get("language_preference", "mixed")
        )
    
    async def _analyze_basic_cultural_appropriateness(self, 
                                                    task_content: str, 
                                                    context: CulturalContext) -> float:
        """Analyze basic cultural appropriateness of task content"""
        
        score = 1.0
        
        # Check for culturally inappropriate content
        inappropriate_patterns = [
            r'\b(alcohol|gambling|interest|riba)\b',  # Islamic prohibitions
            r'\b(disrespect|dishonor|shame)\b',       # Cultural values
            r'\b(individual|selfish|ignore family)\b' # Community values
        ]
        
        for pattern in inappropriate_patterns:
            if re.search(pattern, task_content.lower()):
                score -= 0.2
        
        # Check for culturally positive content
        positive_patterns = [
            r'\b(family|community|respect|honor)\b',  # Positive values
            r'\b(education|knowledge|learning)\b',    # Knowledge seeking
            r'\b(help|assist|support|cooperation)\b', # Community support
            r'\b(halal|permissible|appropriate)\b'    # Islamic compliance
        ]
        
        for pattern in positive_patterns:
            if re.search(pattern, task_content.lower()):
                score += 0.1
        
        # Ensure score is within bounds
        return max(0.0, min(1.0, score))
    
    def _calculate_overall_cultural_score(self,
                                        basic_score: float,
                                        islamic_compliance: Dict[IslamicPrinciple, bool],
                                        professional_score: float,
                                        family_sensitivity: float,
                                        regional_scores: Dict[RegionalContext, float],
                                        government_validation: Optional[float],
                                        context: CulturalContext) -> float:
        """Calculate weighted overall cultural score"""
        
        # Weight factors based on context
        weights = {
            "basic_cultural": 0.3,
            "islamic_compliance": 0.25,
            "professional": 0.2,
            "family_sensitivity": 0.15,
            "regional": 0.1
        }
        
        # Adjust weights based on context
        if context.islamic_compliance_required:
            weights["islamic_compliance"] = 0.35
            weights["basic_cultural"] = 0.25
        
        if context.family_context_level == "high":
            weights["family_sensitivity"] = 0.25
            weights["professional"] = 0.15
        
        if context.government_service_context and government_validation:
            weights["government"] = 0.2
            # Redistribute other weights
            for key in weights:
                if key != "government":
                    weights[key] *= 0.8
        
        # Calculate Islamic compliance score
        islamic_score = sum(islamic_compliance.values()) / len(islamic_compliance)
        
        # Calculate regional score
        regional_score = sum(regional_scores.values()) / len(regional_scores)
        
        # Calculate overall score
        overall_score = (
            basic_score * weights["basic_cultural"] +
            islamic_score * weights["islamic_compliance"] +
            professional_score * weights["professional"] +
            family_sensitivity * weights["family_sensitivity"] +
            regional_score * weights["regional"]
        )
        
        # Add government validation if applicable
        if context.government_service_context and government_validation:
            overall_score += government_validation * weights.get("government", 0)
        
        return min(1.0, overall_score)
    
    def _analyze_cultural_issues_and_suggestions(self,
                                               task_content: str,
                                               context: CulturalContext,
                                               overall_score: float,
                                               islamic_compliance: Dict[IslamicPrinciple, bool],
                                               professional_score: float,
                                               family_sensitivity: float) -> Tuple[List[str], List[str]]:
        """Analyze cultural issues and provide improvement suggestions"""
        
        issues = []
        suggestions = []
        
        # Overall score issues
        if overall_score < 0.9:
            issues.append("Overall cultural appropriateness below recommended threshold")
            suggestions.append("Review task content for Iraqi cultural alignment")
        
        # Islamic compliance issues
        if not all(islamic_compliance.values()):
            issues.append("Some Islamic principles not fully complied with")
            suggestions.append("Ensure task aligns with Islamic values and principles")
        
        # Professional appropriateness issues
        if professional_score < 0.85:
            issues.append("Professional domain cultural alignment could be improved")
            suggestions.append(f"Enhance task for {context.professional_domain} professional context")
        
        # Family sensitivity issues
        if family_sensitivity < 0.95 and context.family_context_level == "high":
            issues.append("Family context sensitivity needs improvement")
            suggestions.append("Consider family values and appropriateness in task design")
        
        # Language and regional suggestions
        if context.language_preference == "arabic" and "arabic" not in task_content.lower():
            suggestions.append("Consider adding Arabic language elements")
        
        if context.regional_context != RegionalContext.GENERAL_IRAQ:
            suggestions.append(f"Consider {context.regional_context.value} regional cultural specifics")
        
        return issues, suggestions
    
    def _determine_cultural_domain(self, task_content: str, context: CulturalContext) -> CulturalDomain:
        """Determine the primary cultural domain of the task"""
        
        content_lower = task_content.lower()
        
        # Check content patterns
        if any(word in content_lower for word in ["family", "relatives", "parents", "children"]):
            return CulturalDomain.FAMILY
        elif any(word in content_lower for word in ["prayer", "mosque", "islamic", "religious"]):
            return CulturalDomain.RELIGIOUS
        elif any(word in content_lower for word in ["government", "official", "ministry", "portal"]):
            return CulturalDomain.GOVERNMENT
        elif context.professional_domain in ["legal", "medical", "education"]:
            return CulturalDomain.PROFESSIONAL
        elif context.business_context:
            return CulturalDomain.BUSINESS
        else:
            return CulturalDomain.SOCIAL
    
    def _calculate_validation_confidence(self,
                                       basic_score: float,
                                       islamic_compliance: Dict[IslamicPrinciple, bool],
                                       professional_score: float,
                                       family_sensitivity: float,
                                       regional_scores: Dict[RegionalContext, float]) -> float:
        """Calculate confidence level in validation results"""
        
        # Base confidence on score consistency
        scores = [basic_score, professional_score, family_sensitivity]
        scores.extend(regional_scores.values())
        
        # Add Islamic compliance as binary score
        islamic_score = sum(islamic_compliance.values()) / len(islamic_compliance)
        scores.append(islamic_score)
        
        # Calculate variance
        mean_score = sum(scores) / len(scores)
        variance = sum((score - mean_score) ** 2 for score in scores) / len(scores)
        
        # Higher variance = lower confidence
        confidence = max(0.5, 1.0 - variance)
        
        return confidence
    
    async def _validate_government_service_context(self, 
                                                 task_content: str, 
                                                 context: CulturalContext) -> Optional[float]:
        """Validate government service specific cultural requirements"""
        
        if not context.government_service_context:
            return None
        
        # Government services have higher cultural standards
        return await self.government_cultural_validator.validate_government_task(
            task_content, context
        )
    
    def _load_cultural_patterns(self) -> Dict[str, Any]:
        """Load Iraqi cultural patterns and rules"""
        # Placeholder for cultural patterns loading
        return {
            "family_values": ["respect", "honor", "support", "cooperation"],
            "islamic_principles": ["halal", "beneficial", "honest", "respectful"],
            "professional_ethics": ["competent", "reliable", "trustworthy", "qualified"],
            "community_values": ["helpful", "caring", "responsible", "collaborative"]
        }
    
    async def _notify_cultural_monitoring_system(self, cultural_log: Dict[str, Any]) -> None:
        """Notify cultural monitoring system of status changes"""
        # Placeholder for cultural monitoring notification
        pass
    
    async def _update_cultural_learning_patterns(self, task, old_status: str, new_status: str) -> None:
        """Update cultural learning patterns based on task transitions"""
        # Placeholder for cultural learning pattern updates
        pass


# Supporting validator classes (placeholder implementations)

class IslamicPrinciplesChecker:
    """Validates Islamic principles compliance"""
    
    async def validate_islamic_compliance(self, task_content: str, context: CulturalContext) -> Dict[IslamicPrinciple, bool]:
        """Validate task against Islamic principles"""
        # Placeholder implementation
        return {
            IslamicPrinciple.HALAL_CONTENT: True,
            IslamicPrinciple.FAMILY_VALUES: True,
            IslamicPrinciple.RESPECT_ELDERS: True,
            IslamicPrinciple.COMMUNITY_BENEFIT: True,
            IslamicPrinciple.KNOWLEDGE_SEEKING: True,
            IslamicPrinciple.HONESTY_TRANSPARENCY: True,
            IslamicPrinciple.PRIVACY_PROTECTION: True
        }
    
    async def validate_status_transition(self, task_content: str, old_status: str, new_status: str, context: CulturalContext):
        """Validate status transition against Islamic principles"""
        # Placeholder implementation
        return type('Result', (), {'approved': True})()

class ProfessionalCulturalAnalyzer:
    """Analyzes professional domain cultural alignment"""
    
    async def assess_professional_alignment(self, task_content: str, context: CulturalContext) -> float:
        """Assess professional cultural alignment"""
        # Placeholder implementation
        return 0.88

class FamilyContextEvaluator:
    """Evaluates family context sensitivity"""
    
    async def evaluate_family_sensitivity(self, task_content: str, context: CulturalContext) -> float:
        """Evaluate family context sensitivity"""
        # Placeholder implementation
        return 0.96
    
    async def validate_task_cancellation(self, task_content: str, context: CulturalContext):
        """Validate task cancellation for family context"""
        # Placeholder implementation
        return type('Result', (), {'approved': True})()

class RegionalCulturalAssessor:
    """Assesses regional cultural appropriateness"""
    
    async def assess_regional_appropriateness(self, task_content: str, context: CulturalContext) -> Dict[RegionalContext, float]:
        """Assess regional cultural appropriateness"""
        # Placeholder implementation
        return {
            RegionalContext.BAGHDAD: 0.92,
            RegionalContext.BASRA: 0.90,
            RegionalContext.MOSUL: 0.91,
            RegionalContext.ERBIL: 0.93,
            RegionalContext.GENERAL_IRAQ: 0.92
        }

class GovernmentCulturalValidator:
    """Validates government service cultural requirements"""
    
    async def validate_government_task(self, task_content: str, context: CulturalContext) -> float:
        """Validate government task cultural requirements"""
        # Placeholder implementation
        return 0.97