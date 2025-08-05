"""
Iraqi AI Chat System - Enhanced Cultural Validation Middleware
Islamic compliance, political neutrality, and Iraqi cultural appropriateness
Merged with advanced Arabic content moderation system
"""

import re
import logging
import asyncio
from enum import Enum
from typing import Optional, Dict, Any, List, Tuple, Set
from dataclasses import dataclass
from datetime import datetime
from pydantic import BaseModel, Field
from fastapi import HTTPException, status

# Configure logging
log = logging.getLogger(__name__)

####################
# Cultural Validation Models
####################

class CulturalSensitivityLevel(str, Enum):
    STRICT = "strict"
    MODERATE = "moderate"
    FLEXIBLE = "flexible"


class ValidationResult(BaseModel):
    is_appropriate: bool
    score: float = Field(ge=0.0, le=1.0)
    reason: Optional[str] = None
    suggestions: List[str] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)


class CulturalContext(BaseModel):
    user_profession: str
    sensitivity_level: CulturalSensitivityLevel
    regional_context: str = "baghdad"
    sectarian_preference: str = "neutral"
    is_professional_context: bool = False


####################
# Cultural Keywords and Patterns
####################

class IraqiCulturalPatterns:
    """Iraqi cultural patterns for validation"""
    
    # Islamic terms and concepts (appropriate)
    ISLAMIC_POSITIVE = {
        "الله", "الحمد لله", "إن شاء الله", "بسم الله", "سبحان الله",
        "استغفر الله", "لا حول ولا قوة إلا بالله", "الله أعلم", "بارك الله",
        "جزاك الله خيرا", "رحمه الله", "غفر الله له", "هداه الله",
        "الصلاة", "الصوم", "الحج", "الزكاة", "القرآن", "السنة",
        "النبي", "الرسول", "صلى الله عليه وسلم", "رضي الله عنه"
    }
    
    # Sectarian terms (requires careful handling)
    SECTARIAN_TERMS = {
        "شيعي", "سني", "علوي", "إسماعيلي", "درزي", "مرجع", "آية الله",
        "حسيني", "عاشوراء", "زينبي", "فاطمي", "صحابة", "أهل البيت",
        "خلافة", "إمامة", "ولاية الفقيه", "تقليد", "اجتهاد"
    }
    
    # Political terms (sensitive - require neutral handling)
    POLITICAL_SENSITIVE = {
        "حزب البعث", "صدام", "الغزو", "العقوبات", "الاحتلال", "المقاومة",
        "الحشد الشعبي", "البرلمان", "الحكومة", "كردستان", "الأنبار",
        "داعش", "القاعدة", "الإرهاب", "التفجيرات", "العمليات",
        "الميليشيات", "الطائفية", "النزوح", "اللاجئين"
    }
    
    # Professional terminology (legal, medical, educational)
    PROFESSIONAL_LEGAL = {
        "المحكمة", "القاضي", "المحامي", "الدعوى", "الحكم", "القانون",
        "الدستور", "الجريمة", "العقوبة", "الإجراءات", "الاستئناف",
        "التحقيق", "الشهادة", "الوثائق", "العقد", "الميراث"
    }
    
    PROFESSIONAL_MEDICAL = {
        "الطبيب", "المريض", "المستشفى", "العلاج", "الدواء", "التشخيص",
        "العملية", "الطوارئ", "الصحة", "المرض", "الوقاية", "التطعيم",
        "الأشعة", "التحليل", "الصيدلية", "الجراحة"
    }
    
    PROFESSIONAL_EDUCATION = {
        "المدرسة", "الجامعة", "الطالب", "المعلم", "الأستاذ", "الدرس",
        "الامتحان", "الشهادة", "التعليم", "التربية", "المنهج", "الفصل",
        "الدرجات", "التقييم", "البحث", "الرسالة"
    }
    
    # Inappropriate content markers
    INAPPROPRIATE_CONTENT = {
        "إباحي", "جنسي", "عري", "مخدرات", "خمر", "قمار", "ربا",
        "سحر", "شعوذة", "كفر", "إلحاد", "شتائم", "سب", "قذف"
    }
    
    # Regional Iraqi dialects and expressions
    IRAQI_DIALECT_POSITIVE = {
        "شلونك", "شكماكو", "هاي", "اكو", "ماكو", "شنو", "وين",
        "شجان", "شوكت", "چاي", "تمر", "خبز", "سمچ", "كبة",
        "مسگوف", "دولمة", "كليچة", "حلاوة", "شربت"
    }


####################
# Cultural Validator
####################

class CulturalValidator:
    """Iraqi cultural content validator with Islamic compliance"""
    
    def __init__(self):
        self.patterns = IraqiCulturalPatterns()
        
    def validate_text_content(
        self, 
        content: str, 
        context: CulturalContext
    ) -> ValidationResult:
        """
        Validate text content for cultural appropriateness
        """
        if not content or not content.strip():
            return ValidationResult(
                is_appropriate=True,
                score=1.0,
                reason="Empty content"
            )
        
        content_lower = content.lower()
        score = 1.0
        warnings = []
        suggestions = []
        
        # Check for inappropriate content
        inappropriate_found = [
            term for term in self.patterns.INAPPROPRIATE_CONTENT
            if term in content_lower
        ]
        if inappropriate_found:
            score -= 0.5
            warnings.append(f"محتوى غير مناسب موجود: {', '.join(inappropriate_found)}")
            suggestions.append("يرجى إزالة المحتوى غير المناسب")
        
        # Check sectarian sensitivity
        sectarian_found = [
            term for term in self.patterns.SECTARIAN_TERMS
            if term in content_lower
        ]
        if sectarian_found:
            if context.sensitivity_level == CulturalSensitivityLevel.STRICT:
                score -= 0.3
                warnings.append("محتوى طائفي حساس")
                suggestions.append("استخدم لغة محايدة طائفياً")
            elif context.sectarian_preference == "neutral":
                score -= 0.1
                warnings.append("تم اكتشاف مصطلحات طائفية")
        
        # Check political sensitivity
        political_found = [
            term for term in self.patterns.POLITICAL_SENSITIVE
            if term in content_lower
        ]
        if political_found:
            if context.is_professional_context:
                score -= 0.2
                warnings.append("محتوى سياسي في سياق مهني")
                suggestions.append("تجنب المواضيع السياسية في السياق المهني")
            else:
                score -= 0.1
                warnings.append("محتوى سياسي حساس")
        
        # Professional context validation
        if context.is_professional_context:
            score += self._validate_professional_terminology(
                content_lower, context.user_profession
            )
        
        # Islamic compliance bonus
        islamic_terms_found = [
            term for term in self.patterns.ISLAMIC_POSITIVE
            if term in content_lower
        ]
        if islamic_terms_found:
            score += 0.05  # Small bonus for Islamic terms
        
        # Iraqi dialect bonus
        dialect_found = [
            term for term in self.patterns.IRAQI_DIALECT_POSITIVE
            if term in content_lower
        ]
        if dialect_found:
            score += 0.02  # Small bonus for Iraqi dialect
        
        # Ensure score stays within bounds
        score = max(0.0, min(1.0, score))
        
        is_appropriate = score >= 0.7
        
        return ValidationResult(
            is_appropriate=is_appropriate,
            score=score,
            reason=self._generate_reason(score, warnings),
            suggestions=suggestions,
            warnings=warnings
        )
    
    def _validate_professional_terminology(
        self, content: str, profession: str
    ) -> float:
        """Validate professional terminology usage"""
        bonus = 0.0
        
        if profession == "lawyer":
            legal_terms = [
                term for term in self.patterns.PROFESSIONAL_LEGAL
                if term in content
            ]
            if legal_terms:
                bonus += 0.1
        
        elif profession == "doctor":
            medical_terms = [
                term for term in self.patterns.PROFESSIONAL_MEDICAL
                if term in content
            ]
            if medical_terms:
                bonus += 0.1
        
        elif profession == "teacher":
            education_terms = [
                term for term in self.patterns.PROFESSIONAL_EDUCATION
                if term in content
            ]
            if education_terms:
                bonus += 0.1
        
        return bonus
    
    def _generate_reason(self, score: float, warnings: List[str]) -> str:
        """Generate human-readable reason for validation result"""
        if score >= 0.9:
            return "محتوى ممتاز ومناسب ثقافياً"
        elif score >= 0.8:
            return "محتوى جيد ومناسب"
        elif score >= 0.7:
            return "محتوى مقبول مع تحفظات بسيطة"
        elif score >= 0.5:
            return "محتوى يحتاج مراجعة ثقافية"
        else:
            return "محتوى غير مناسب ثقافياً"
    
    async def validate_user_profile(
        self, 
        name: str, 
        profession: str,
        cultural_settings: Optional[Dict[str, Any]] = None
    ) -> float:
        """Validate user profile for cultural appropriateness"""
        score = 1.0
        
        # Validate Arabic name
        if not self._is_arabic_name(name):
            score -= 0.3
        
        # Validate profession appropriateness
        if profession in ["other", "student"]:
            score += 0.0  # Neutral
        elif profession in ["lawyer", "doctor", "teacher", "engineer"]:
            score += 0.1  # Professional bonus
        
        # Validate cultural settings
        if cultural_settings:
            islamic_compliance = cultural_settings.get("islamic_compliance_level", "moderate")
            if islamic_compliance in ["strict", "moderate"]:
                score += 0.1
        
        return min(1.0, score)
    
    def _is_arabic_name(self, name: str) -> bool:
        """Check if name contains Arabic characters"""
        arabic_pattern = re.compile(r'[\u0600-\u06FF]')
        return bool(arabic_pattern.search(name))
    
    async def validate_cultural_settings(
        self, settings: Dict[str, Any]
    ) -> ValidationResult:
        """Validate cultural settings for appropriateness"""
        score = 1.0
        warnings = []
        suggestions = []
        
        # Validate Islamic compliance level
        islamic_level = settings.get("islamic_compliance_level", "moderate")
        if islamic_level not in ["strict", "moderate", "flexible"]:
            score -= 0.2
            warnings.append("مستوى الامتثال الإسلامي غير صحيح")
            suggestions.append("اختر: strict أو moderate أو flexible")
        
        # Validate sectarian sensitivity
        sectarian = settings.get("sectarian_sensitivity", "neutral")
        if sectarian not in ["neutral", "sunni", "shia"]:
            score -= 0.2
            warnings.append("إعداد الحساسية الطائفية غير صحيح")
            suggestions.append("اختر: neutral أو sunni أو shia")
        
        # Professional appropriateness
        if settings.get("prayer_reminders") and settings.get("business_hours_iraq"):
            score += 0.1  # Bonus for Islamic consideration
        
        return ValidationResult(
            is_appropriate=score >= 0.8,
            score=score,
            suggestions=suggestions,
            warnings=warnings
        )


####################
# FastAPI Dependencies
####################

async def validate_cultural_content() -> CulturalValidator:
    """FastAPI dependency for cultural validation"""
    return CulturalValidator()


def validate_iraqi_phone(phone: str) -> bool:
    """Validate Iraqi phone number format"""
    # Iraqi phone format: +964 followed by 10 digits
    pattern = r'^\+964[0-9]{10}$'
    return bool(re.match(pattern, phone))


def create_cultural_context(
    user_profession: str = "other",
    sensitivity_level: str = "moderate", 
    regional_context: str = "baghdad",
    sectarian_preference: str = "neutral",
    is_professional: bool = False
) -> CulturalContext:
    """Create cultural context for validation"""
    return CulturalContext(
        user_profession=user_profession,
        sensitivity_level=CulturalSensitivityLevel(sensitivity_level),
        regional_context=regional_context,
        sectarian_preference=sectarian_preference,
        is_professional_context=is_professional
    )


####################
# Middleware Functions
####################

async def cultural_validation_middleware(content: str, user_context: Dict[str, Any]) -> ValidationResult:
    """
    Main cultural validation middleware function
    """
    validator = CulturalValidator()
    
    cultural_context = create_cultural_context(
        user_profession=user_context.get("profession", "other"),
        sensitivity_level=user_context.get("cultural_settings", {}).get("islamic_compliance_level", "moderate"),
        regional_context=user_context.get("regional_context", "baghdad"),
        sectarian_preference=user_context.get("cultural_settings", {}).get("sectarian_sensitivity", "neutral"),
        is_professional=user_context.get("is_professional_context", False)
    )
    
    result = validator.validate_text_content(content, cultural_context)
    
    # Log validation results for monitoring
    log.info(
        f"Cultural validation: score={result.score:.2f}, "
        f"appropriate={result.is_appropriate}, "
        f"profession={cultural_context.user_profession}"
    )
    
    return result


def require_cultural_compliance(min_score: float = 0.7):
    """
    Decorator to require cultural compliance for endpoints
    """
    def decorator(func):
        async def wrapper(*args, **kwargs):
            # This would be implemented as a proper FastAPI dependency
            # For now, it's a placeholder for the decorator pattern
            return await func(*args, **kwargs)
        return wrapper
    return decorator


####################
# Cultural Content Filters
####################

class IraqiContentFilter:
    """Content filtering for Iraqi cultural appropriateness"""
    
    @staticmethod
    def filter_inappropriate_content(content: str) -> str:
        """Filter and replace inappropriate content"""
        filtered_content = content
        
        # Replace inappropriate terms with alternatives
        inappropriate_replacements = {
            # Add specific replacements as needed
            "inappropriate_term": "appropriate_alternative"
        }
        
        for inappropriate, replacement in inappropriate_replacements.items():
            filtered_content = filtered_content.replace(inappropriate, replacement)
        
        return filtered_content
    
    @staticmethod
    def suggest_cultural_alternatives(content: str) -> List[str]:
        """Suggest culturally appropriate alternatives"""
        suggestions = []
        
        # Add logic to suggest alternatives based on content analysis
        # This would use NLP and cultural knowledge base
        
        return suggestions


####################
# Export
####################

__all__ = [
    "CulturalValidator",
    "ValidationResult", 
    "CulturalContext",
    "validate_cultural_content",
    "validate_iraqi_phone",
    "cultural_validation_middleware",
    "require_cultural_compliance",
    "IraqiContentFilter"
]