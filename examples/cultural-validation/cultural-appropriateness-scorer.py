"""
Cultural Appropriateness Scorer for Iraqi AI Chat System

This module provides cultural validation and scoring for AI responses
to ensure they align with Iraqi cultural values and Islamic principles.
"""

import re
from typing import Dict, List, Optional
from dataclasses import dataclass
from enum import Enum

class CulturalSensitivityLevel(Enum):
    APPROPRIATE = "appropriate"
    CAUTION = "caution"
    INAPPROPRIATE = "inappropriate"

@dataclass
class CulturalValidationResult:
    score: float  # 0.0 to 1.0
    level: CulturalSensitivityLevel
    issues: List[str]
    suggestions: List[str]
    cultural_markers: List[str]

class IraqiCulturalValidator:
    """Validates content for Iraqi cultural appropriateness."""
    
    def __init__(self):
        # Political and sectarian keywords to avoid
        self.sensitive_political = [
            'سني', 'شيعي', 'كردي', 'تركماني',
            'بعث', 'صدام', 'احتلال', 'غزو',
            'طائفي', 'عرقي', 'قومي'
        ]
        
        # Religious expressions that are appropriate
        self.appropriate_religious = [
            'بسم الله', 'الحمد لله', 'إن شاء الله', 'ماشاء الله',
            'بإذن الله', 'الله يعطيك العافية', 'بارك الله فيك',
            'جزاك الله خيراً', 'أسأل الله', 'والله أعلم'
        ]
        
        # Professional honorifics in Iraqi context
        self.professional_titles = {
            'legal': ['أستاذ', 'المحامي', 'دكتور في القانون', 'قاضي'],
            'medical': ['دكتور', 'الطبيب', 'الدكتورة', 'أستاذ دكتور'],
            'educational': ['أستاذ', 'معلم', 'مدرس', 'بروفيسور'],
            'engineering': ['مهندس', 'المهندس', 'أستاذ مهندس']
        }
        
        # Regional Iraqi expressions
        self.iraqi_dialect_markers = [
            'شلونك', 'شكو ماكو', 'أهلين', 'حبيبي', 'عزيزي',
            'لو سمحت', 'منو', 'وين', 'شنو', 'جان'
        ]
        
        # Family and social relationship terms
        self.family_terms = [
            'أهل', 'عائلة', 'أخ', 'أخت', 'والد', 'والدة',
            'عم', 'عمة', 'خال', 'خالة', 'جد', 'جدة'
        ]
    
    def validate_content(self, text: str, context: Dict = None) -> CulturalValidationResult:
        """
        Validate content for Iraqi cultural appropriateness.
        
        Args:
            text: The content to validate
            context: Additional context (user profession, region, etc.)
        
        Returns:
            CulturalValidationResult with score and recommendations
        """
        issues = []
        suggestions = []
        cultural_markers = []
        score = 1.0
        
        # Check for sensitive political content
        political_issues = self._check_political_sensitivity(text)
        if political_issues:
            issues.extend(political_issues)
            score -= 0.3
        
        # Check for religious appropriateness
        religious_score, religious_markers = self._check_religious_content(text)
        cultural_markers.extend(religious_markers)
        score *= religious_score
        
        # Check for professional appropriateness
        if context and context.get('profession'):
            prof_score, prof_suggestions = self._check_professional_context(
                text, context['profession']
            )
            score *= prof_score
            suggestions.extend(prof_suggestions)
        
        # Check for Iraqi dialect usage
        dialect_markers = self._check_iraqi_dialect(text)
        cultural_markers.extend(dialect_markers)
        
        # Check for family/social appropriateness
        family_score = self._check_family_context(text)
        score *= family_score
        
        # Determine overall level
        if score >= 0.8:
            level = CulturalSensitivityLevel.APPROPRIATE
        elif score >= 0.6:
            level = CulturalSensitivityLevel.CAUTION
            suggestions.append("Consider reviewing content for cultural sensitivity")
        else:
            level = CulturalSensitivityLevel.INAPPROPRIATE
            suggestions.append("Content requires significant cultural revision")
        
        return CulturalValidationResult(
            score=max(0.0, min(1.0, score)),
            level=level,
            issues=issues,
            suggestions=suggestions,
            cultural_markers=cultural_markers
        )
    
    def _check_political_sensitivity(self, text: str) -> List[str]:
        """Check for politically sensitive content."""
        issues = []
        
        for sensitive_term in self.sensitive_political:
            if sensitive_term in text:
                issues.append(f"Contains politically sensitive term: {sensitive_term}")
        
        # Check for divisive language patterns
        divisive_patterns = [
            r'نحن.*هم',  # us vs them language
            r'الطائفة.*الأخرى',  # sectarian references
            r'المذهب.*ضد'  # religious sect conflicts
        ]
        
        for pattern in divisive_patterns:
            if re.search(pattern, text):
                issues.append("Contains potentially divisive language")
        
        return issues
    
    def _check_religious_content(self, text: str) -> tuple[float, List[str]]:
        """Check religious content appropriateness."""
        score = 1.0
        markers = []
        
        # Positive: appropriate religious expressions
        for expression in self.appropriate_religious:
            if expression in text:
                markers.append(f"Appropriate religious expression: {expression}")
                score += 0.05  # Small bonus for appropriate usage
        
        # Check for inappropriate religious references
        inappropriate_patterns = [
            r'الله.*يلعن',  # cursing with God's name
            r'حرام.*على',  # inappropriate haram usage
            r'كفر.*'  # accusations of disbelief
        ]
        
        for pattern in inappropriate_patterns:
            if re.search(pattern, text):
                score -= 0.2
                markers.append("Inappropriate religious language detected")
        
        return min(1.0, score), markers
    
    def _check_professional_context(self, text: str, profession: str) -> tuple[float, List[str]]:
        """Check professional context appropriateness."""
        score = 1.0
        suggestions = []
        
        # Check for appropriate professional titles
        if profession in self.professional_titles:
            titles = self.professional_titles[profession]
            has_appropriate_title = any(title in text for title in titles)
            
            if not has_appropriate_title and any(title in ['استاذ', 'دكتور'] for title in text.split()):
                suggestions.append(f"Consider using appropriate {profession} titles")
        
        # Check for professional disclaimers
        disclaimer_patterns = {
            'legal': r'لا.*يعتبر.*استشارة.*قانونية',
            'medical': r'لا.*يغني.*عن.*استشارة.*طبيب',
            'engineering': r'يجب.*مراجعة.*مهندس.*مختص'
        }
        
        if profession in disclaimer_patterns:
            pattern = disclaimer_patterns[profession]
            if not re.search(pattern, text) and len(text.split()) > 50:
                suggestions.append(f"Consider adding professional disclaimer for {profession}")
                score *= 0.9
        
        return score, suggestions
    
    def _check_iraqi_dialect(self, text: str) -> List[str]:
        """Check for Iraqi dialect markers."""
        markers = []
        
        for dialect_term in self.iraqi_dialect_markers:
            if dialect_term in text:
                markers.append(f"Iraqi dialect: {dialect_term}")
        
        return markers
    
    def _check_family_context(self, text: str) -> float:
        """Check family and social context appropriateness."""
        score = 1.0
        
        # Check for appropriate family references
        family_mentions = sum(1 for term in self.family_terms if term in text)
        if family_mentions > 0:
            score += 0.05  # Small bonus for family-friendly content
        
        # Check for inappropriate personal questions
        inappropriate_personal = [
            r'كم.*راتبك',  # salary questions
            r'متزوج.*أم.*لا',  # marital status
            r'عندك.*أطفال.*كم'  # children count
        ]
        
        for pattern in inappropriate_personal:
            if re.search(pattern, text):
                score -= 0.1
        
        return max(0.0, score)

# Example usage
def example_validation():
    """Example of how to use the cultural validator."""
    validator = IraqiCulturalValidator()
    
    # Test with appropriate content
    appropriate_text = "أهلاً وسهلاً، شلونك؟ إن شاء الله تكون بخير. كيف يمكنني مساعدتك اليوم؟"
    result = validator.validate_content(appropriate_text)
    
    print(f"Score: {result.score}")
    print(f"Level: {result.level}")
    print(f"Cultural markers: {result.cultural_markers}")
    
    # Test with professional context
    legal_text = "بخصوص استشارتك القانونية، أنصحك بمراجعة المحامي المختص. هذا لا يعتبر استشارة قانونية رسمية."
    legal_result = validator.validate_content(
        legal_text, 
        context={'profession': 'legal'}
    )
    
    print(f"Legal context score: {legal_result.score}")
    print(f"Suggestions: {legal_result.suggestions}")

if __name__ == "__main__":
    example_validation()