"""
Cultural Enhancement Mixins for Iraqi ADK Agents
===============================================

Specialized mixins that provide Iraqi cultural awareness, Islamic compliance,
and Arabic language processing capabilities to ADK-based agents.

These mixins integrate seamlessly with the base ADK agent architecture while
adding comprehensive cultural and linguistic capabilities.
"""

from typing import Dict, List, Optional, Any, Union
from abc import ABC, abstractmethod
import re
import asyncio
from dataclasses import dataclass
from enum import Enum


class CulturalComplianceLevel(Enum):
    """Cultural compliance assessment levels"""
    EXCELLENT = "excellent"  # 95%+
    GOOD = "good"           # 85-94%
    ACCEPTABLE = "acceptable"  # 75-84%
    NEEDS_IMPROVEMENT = "needs_improvement"  # 60-74%
    NON_COMPLIANT = "non_compliant"  # <60%


class IslamicPrinciple(Enum):
    """Core Islamic principles for compliance checking"""
    RESPECT_FOR_ALLAH = "respect_for_allah"
    PROPHET_RESPECT = "prophet_respect"
    HALAL_CONTENT = "halal_content"
    FAMILY_VALUES = "family_values"
    SOCIAL_JUSTICE = "social_justice"
    MODESTY = "modesty"
    HONESTY = "honesty"
    CHARITY = "charity"


@dataclass
class CulturalContext:
    """Iraqi cultural context information"""
    region: str = "iraq"
    dialect: str = "iraqi_arabic"
    religious_context: str = "islamic"
    professional_domain: Optional[str] = None
    formality_level: str = "moderate"
    target_audience: str = "general"


class CulturalMixin(ABC):
    """
    Base mixin for Iraqi cultural awareness
    
    Provides foundational cultural validation and context management
    """
    
    def __init__(self):
        self.cultural_context = CulturalContext()
        self.cultural_score_cache = {}
        self.cultural_patterns = self._load_cultural_patterns()
    
    def _load_cultural_patterns(self) -> Dict[str, Any]:
        """Load Iraqi cultural patterns and norms"""
        return {
            "greeting_patterns": [
                "السلام عليكم", "أهلاً وسهلاً", "مرحبا", "حياك الله"
            ],
            "respectful_terms": [
                "أستاذ", "دكتور", "أبو", "أم", "حاج", "حاجة"
            ],
            "cultural_values": [
                "hospitality", "respect_for_elders", "family_honor", 
                "religious_observance", "community_support"
            ],
            "sensitive_topics": [
                "sectarian_divisions", "political_parties", "tribal_conflicts",
                "personal_religious_practices", "family_private_matters"
            ],
            "professional_etiquette": {
                "legal": ["حضرة القاضي", "المحامي المحترم", "سعادة المدعي"],
                "medical": ["الدكتور المحترم", "الطبيب الفاضل", "صاحب السعادة"],
                "educational": ["الأستاذ الفاضل", "المدرس المحترم", "البروفيسور"]
            }
        }
    
    async def assess_cultural_appropriateness(self, content: Any) -> Dict[str, Any]:
        """Assess cultural appropriateness of content"""
        content_str = str(content)
        
        assessment = {
            "overall_score": 0.0,
            "compliance_level": CulturalComplianceLevel.NON_COMPLIANT,
            "specific_scores": {},
            "violations": [],
            "recommendations": [],
            "cultural_enhancements": []
        }
        
        # Assess different cultural dimensions
        greeting_score = self._assess_greeting_appropriateness(content_str)
        respect_score = self._assess_respect_level(content_str)
        sensitivity_score = self._assess_topic_sensitivity(content_str)
        language_score = self._assess_language_appropriateness(content_str)
        
        # Calculate overall score
        assessment["specific_scores"] = {
            "greeting_appropriateness": greeting_score,
            "respect_level": respect_score,
            "topic_sensitivity": sensitivity_score,
            "language_appropriateness": language_score
        }
        
        assessment["overall_score"] = sum(assessment["specific_scores"].values()) / len(assessment["specific_scores"])
        
        # Determine compliance level
        if assessment["overall_score"] >= 0.95:
            assessment["compliance_level"] = CulturalComplianceLevel.EXCELLENT
        elif assessment["overall_score"] >= 0.85:
            assessment["compliance_level"] = CulturalComplianceLevel.GOOD
        elif assessment["overall_score"] >= 0.75:
            assessment["compliance_level"] = CulturalComplianceLevel.ACCEPTABLE
        elif assessment["overall_score"] >= 0.60:
            assessment["compliance_level"] = CulturalComplianceLevel.NEEDS_IMPROVEMENT
        else:
            assessment["compliance_level"] = CulturalComplianceLevel.NON_COMPLIANT
        
        # Generate recommendations
        assessment["recommendations"] = self._generate_cultural_recommendations(assessment)
        
        return assessment
    
    def _assess_greeting_appropriateness(self, content: str) -> float:
        """Assess appropriateness of greetings used"""
        if any(greeting in content for greeting in self.cultural_patterns["greeting_patterns"]):
            return 1.0
        return 0.8  # Neutral if no specific greetings
    
    def _assess_respect_level(self, content: str) -> float:
        """Assess level of respect and politeness"""
        respect_indicators = 0
        total_indicators = 4
        
        # Check for respectful terms
        if any(term in content for term in self.cultural_patterns["respectful_terms"]):
            respect_indicators += 1
        
        # Check for polite language patterns
        if any(word in content.lower() for word in ["please", "thank you", "من فضلك", "شكراً"]):
            respect_indicators += 1
        
        # Check for formal language structure
        if self._has_formal_structure(content):
            respect_indicators += 1
        
        # Check absence of disrespectful language
        if not self._contains_disrespectful_language(content):
            respect_indicators += 1
        
        return respect_indicators / total_indicators
    
    def _assess_topic_sensitivity(self, content: str) -> float:
        """Assess sensitivity of topics discussed"""
        sensitive_topic_count = 0
        
        for topic in self.cultural_patterns["sensitive_topics"]:
            if topic.replace("_", " ") in content.lower():
                sensitive_topic_count += 1
        
        if sensitive_topic_count == 0:
            return 1.0
        elif sensitive_topic_count <= 2:
            return 0.7  # Moderate sensitivity
        else:
            return 0.3  # High sensitivity
    
    def _assess_language_appropriateness(self, content: str) -> float:
        """Assess appropriateness of language used"""
        # Check for appropriate vocabulary
        inappropriate_words = ["curse", "insult", "offensive"]  # Simplified list
        
        content_lower = content.lower()
        for word in inappropriate_words:
            if word in content_lower:
                return 0.2
        
        return 1.0
    
    def _has_formal_structure(self, content: str) -> bool:
        """Check if content has formal structure"""
        # Simple heuristic for formal language
        return len(content) > 50 and ("." in content or "؟" in content or "!" in content)
    
    def _contains_disrespectful_language(self, content: str) -> bool:
        """Check for disrespectful language"""
        disrespectful_patterns = ["stupid", "idiot", "fool"]  # Simplified list
        content_lower = content.lower()
        return any(pattern in content_lower for pattern in disrespectful_patterns)
    
    def _generate_cultural_recommendations(self, assessment: Dict[str, Any]) -> List[str]:
        """Generate cultural improvement recommendations"""
        recommendations = []
        
        if assessment["specific_scores"]["greeting_appropriateness"] < 0.9:
            recommendations.append("Consider adding appropriate Arabic greetings like 'السلام عليكم'")
        
        if assessment["specific_scores"]["respect_level"] < 0.8:
            recommendations.append("Increase formal and respectful language usage")
        
        if assessment["specific_scores"]["topic_sensitivity"] < 0.8:
            recommendations.append("Be more cautious with sensitive topics")
        
        if assessment["overall_score"] < 0.75:
            recommendations.append("Review content for Iraqi cultural appropriateness")
        
        return recommendations


class IslamicComplianceMixin(ABC):
    """
    Mixin for Islamic principle compliance
    
    Ensures all agent responses adhere to Islamic values and principles
    """
    
    def __init__(self):
        self.islamic_principles = self._load_islamic_principles()
        self.halal_content_patterns = self._load_halal_patterns()
        self.compliance_cache = {}
    
    def _load_islamic_principles(self) -> Dict[str, Any]:
        """Load Islamic principle guidelines"""
        return {
            IslamicPrinciple.RESPECT_FOR_ALLAH: {
                "required_elements": ["reverence", "appropriate_language"],
                "forbidden_elements": ["disrespect", "inappropriate_attribution"]
            },
            IslamicPrinciple.PROPHET_RESPECT: {
                "required_elements": ["صلى الله عليه وسلم", "respect", "honor"],
                "forbidden_elements": ["mockery", "disrespect", "inappropriate_reference"]
            },
            IslamicPrinciple.HALAL_CONTENT: {
                "required_elements": ["permissible_content", "beneficial_information"],
                "forbidden_elements": ["haram_content", "harmful_information"]
            },
            IslamicPrinciple.FAMILY_VALUES: {
                "required_elements": ["respect_for_family", "honor", "protection"],
                "forbidden_elements": ["family_dishonor", "inappropriate_relations"]
            },
            IslamicPrinciple.MODESTY: {
                "required_elements": ["appropriate_language", "respectful_discourse"],
                "forbidden_elements": ["immodest_content", "inappropriate_imagery"]
            }
        }
    
    def _load_halal_patterns(self) -> Dict[str, List[str]]:
        """Load halal content patterns"""
        return {
            "permissible_topics": [
                "education", "health", "technology", "business", "family",
                "worship", "charity", "knowledge", "community_service"
            ],
            "encouraged_values": [
                "honesty", "charity", "respect", "knowledge_seeking",
                "community_support", "family_care", "elderly_respect"
            ],
            "forbidden_content": [
                "gambling", "interest_based_finance", "inappropriate_relationships",
                "disrespect_to_religion", "harmful_substances"
            ]
        }
    
    async def assess_islamic_compliance(self, content: Any) -> Dict[str, Any]:
        """Assess Islamic compliance of content"""
        content_str = str(content)
        
        compliance_report = {
            "is_compliant": True,
            "compliance_score": 0.0,
            "principle_scores": {},
            "violations": [],
            "recommendations": [],
            "blessed_elements": []
        }
        
        # Assess each Islamic principle
        principle_scores = {}
        for principle in IslamicPrinciple:
            score = await self._assess_principle_compliance(content_str, principle)
            principle_scores[principle.value] = score
        
        compliance_report["principle_scores"] = principle_scores
        compliance_report["compliance_score"] = sum(principle_scores.values()) / len(principle_scores)
        compliance_report["is_compliant"] = compliance_report["compliance_score"] >= 0.80
        
        # Identify violations and generate recommendations
        compliance_report["violations"] = self._identify_islamic_violations(content_str)
        compliance_report["recommendations"] = self._generate_islamic_recommendations(compliance_report)
        compliance_report["blessed_elements"] = self._identify_blessed_elements(content_str)
        
        return compliance_report
    
    async def _assess_principle_compliance(self, content: str, principle: IslamicPrinciple) -> float:
        """Assess compliance with specific Islamic principle"""
        principle_rules = self.islamic_principles[principle]
        content_lower = content.lower()
        
        # Check for required elements
        required_score = 0.5  # Neutral base score
        for element in principle_rules["required_elements"]:
            if element in content_lower:
                required_score += 0.2
        
        required_score = min(required_score, 1.0)
        
        # Check for forbidden elements
        forbidden_penalty = 0.0
        for element in principle_rules["forbidden_elements"]:
            if element in content_lower:
                forbidden_penalty += 0.3
        
        final_score = max(required_score - forbidden_penalty, 0.0)
        return final_score
    
    def _identify_islamic_violations(self, content: str) -> List[Dict[str, str]]:
        """Identify specific Islamic violations"""
        violations = []
        content_lower = content.lower()
        
        # Check forbidden content
        for forbidden_item in self.halal_content_patterns["forbidden_content"]:
            if forbidden_item in content_lower:
                violations.append({
                    "type": "forbidden_content",
                    "item": forbidden_item,
                    "severity": "high"
                })
        
        return violations
    
    def _generate_islamic_recommendations(self, compliance_report: Dict[str, Any]) -> List[str]:
        """Generate Islamic compliance recommendations"""
        recommendations = []
        
        if compliance_report["compliance_score"] < 0.80:
            recommendations.append("Review content for Islamic principle alignment")
        
        if compliance_report["violations"]:
            recommendations.append("Remove or modify content that violates Islamic principles")
        
        # Add positive reinforcement suggestions
        recommendations.append("Consider adding beneficial Islamic values to enhance the content")
        
        return recommendations
    
    def _identify_blessed_elements(self, content: str) -> List[str]:
        """Identify elements that align well with Islamic values"""
        blessed_elements = []
        content_lower = content.lower()
        
        for value in self.halal_content_patterns["encouraged_values"]:
            if value in content_lower:
                blessed_elements.append(value)
        
        return blessed_elements


class ArabicLanguageMixin(ABC):
    """
    Mixin for Arabic language processing and RTL support
    
    Provides comprehensive Arabic language handling including Iraqi dialect
    """
    
    def __init__(self):
        self.arabic_patterns = self._load_arabic_patterns()
        self.iraqi_dialect_patterns = self._load_iraqi_dialect_patterns()
        self.rtl_processing_rules = self._load_rtl_rules()
    
    def _load_arabic_patterns(self) -> Dict[str, Any]:
        """Load Arabic language patterns"""
        return {
            "arabic_range": (0x0600, 0x06FF),
            "rtl_markers": ["‏", "‎"],
            "diacritics": ["ً", "ٌ", "ٍ", "َ", "ُ", "ِ", "ْ", "ّ", "ٰ"],
            "punctuation": ["؟", "،", "؛", "؍"]
        }
    
    def _load_iraqi_dialect_patterns(self) -> Dict[str, List[str]]:
        """Load Iraqi Arabic dialect patterns"""
        return {
            "common_iraqi_words": [
                "شلونك", "شكو ماكو", "علوية", "وين", "شدت", 
                "لعد", "عوف", "صاير", "جذي", "هيچ"
            ],
            "iraqi_greetings": [
                "شلونك/شلونچ", "أهلاً وسهلاً", "حياك/حياچ الله"
            ],
            "regional_variations": {
                "baghdad": ["چ", "جي", "دا"],
                "basra": ["گ", "يمه", "هاي"],
                "kurdistan": ["هەڵۆ", "چۆنی"]
            }
        }
    
    def _load_rtl_rules(self) -> Dict[str, Any]:
        """Load RTL processing rules"""
        return {
            "rtl_override": "\u202E",
            "ltr_override": "\u202D", 
            "rtl_mark": "\u200F",
            "ltr_mark": "\u200E",
            "neutral_chars": [" ", ".", ",", "!", "?", "(", ")", "[", "]"]
        }
    
    def detect_arabic_content(self, text: str) -> Dict[str, Any]:
        """Detect Arabic content and characteristics"""
        detection_result = {
            "contains_arabic": False,
            "arabic_percentage": 0.0,
            "rtl_required": False,
            "iraqi_dialect_detected": False,
            "mixed_content": False,
            "processing_recommendations": []
        }
        
        if not text:
            return detection_result
        
        # Count Arabic characters
        arabic_chars = 0
        total_chars = len(text)
        
        for char in text:
            if self._is_arabic_char(char):
                arabic_chars += 1
        
        detection_result["arabic_percentage"] = arabic_chars / total_chars if total_chars > 0 else 0
        detection_result["contains_arabic"] = detection_result["arabic_percentage"] > 0
        detection_result["rtl_required"] = detection_result["arabic_percentage"] > 0.3
        
        # Detect Iraqi dialect
        detection_result["iraqi_dialect_detected"] = self._detect_iraqi_dialect(text)
        
        # Detect mixed content
        has_latin = any(ord(char) < 256 for char in text if char.isalpha())
        detection_result["mixed_content"] = detection_result["contains_arabic"] and has_latin
        
        # Generate processing recommendations
        detection_result["processing_recommendations"] = self._generate_arabic_processing_recommendations(detection_result)
        
        return detection_result
    
    def format_rtl_content(self, text: str, force_rtl: bool = False) -> str:
        """Format text for proper RTL display"""
        detection = self.detect_arabic_content(text)
        
        if not detection["contains_arabic"] and not force_rtl:
            return text
        
        # Add RTL markers for proper rendering
        formatted_text = text
        
        if detection["rtl_required"] or force_rtl:
            formatted_text = f"{self.rtl_processing_rules['rtl_mark']}{text}"
        
        if detection["mixed_content"]:
            formatted_text = self._handle_mixed_content_rtl(text)
        
        return formatted_text
    
    def process_iraqi_dialect(self, text: str) -> Dict[str, Any]:
        """Process Iraqi dialect content"""
        processing_result = {
            "original_text": text,
            "dialect_level": "none",
            "recognized_patterns": [],
            "regional_indicators": [],
            "standardized_alternatives": [],
            "cultural_context": []
        }
        
        # Detect dialect level
        iraqi_word_count = 0
        recognized_patterns = []
        
        for word in self.iraqi_dialect_patterns["common_iraqi_words"]:
            if word in text:
                iraqi_word_count += 1
                recognized_patterns.append(word)
        
        processing_result["recognized_patterns"] = recognized_patterns
        
        # Determine dialect level
        if iraqi_word_count >= 3:
            processing_result["dialect_level"] = "heavy"
        elif iraqi_word_count >= 1:
            processing_result["dialect_level"] = "moderate"
        else:
            processing_result["dialect_level"] = "light"
        
        # Detect regional variations
        for region, patterns in self.iraqi_dialect_patterns["regional_variations"].items():
            if any(pattern in text for pattern in patterns):
                processing_result["regional_indicators"].append(region)
        
        return processing_result
    
    def _is_arabic_char(self, char: str) -> bool:
        """Check if character is Arabic"""
        char_code = ord(char)
        return self.arabic_patterns["arabic_range"][0] <= char_code <= self.arabic_patterns["arabic_range"][1]
    
    def _detect_iraqi_dialect(self, text: str) -> bool:
        """Detect Iraqi dialect in text"""
        iraqi_indicators = 0
        
        for word in self.iraqi_dialect_patterns["common_iraqi_words"]:
            if word in text:
                iraqi_indicators += 1
        
        return iraqi_indicators >= 1
    
    def _generate_arabic_processing_recommendations(self, detection: Dict[str, Any]) -> List[str]:
        """Generate Arabic processing recommendations"""
        recommendations = []
        
        if detection["rtl_required"]:
            recommendations.append("Apply RTL formatting for proper display")
        
        if detection["mixed_content"]:
            recommendations.append("Handle mixed Arabic-English content with proper directionality")
        
        if detection["iraqi_dialect_detected"]:
            recommendations.append("Consider Iraqi dialect-specific processing")
        
        return recommendations
    
    def _handle_mixed_content_rtl(self, text: str) -> str:
        """Handle mixed Arabic-English content for RTL"""
        # Simple implementation - can be enhanced
        return f"{self.rtl_processing_rules['rtl_mark']}{text}"


class ProfessionalContextMixin(ABC):
    """
    Mixin for Iraqi professional domain context handling
    
    Provides specialized support for legal, medical, and educational domains
    """
    
    def __init__(self):
        self.professional_domains = self._load_professional_domains()
        self.etiquette_rules = self._load_professional_etiquette()
    
    def _load_professional_domains(self) -> Dict[str, Any]:
        """Load professional domain information"""
        return {
            "legal": {
                "terminology": ["قانون", "محكمة", "قاضي", "محام", "دعوى"],
                "required_formality": "high",
                "cultural_considerations": ["respect_for_authority", "formal_address"]
            },
            "medical": {
                "terminology": ["طبيب", "مريض", "علاج", "تشخيص", "مستشفى"],
                "required_formality": "high", 
                "cultural_considerations": ["patient_privacy", "family_involvement"]
            },
            "educational": {
                "terminology": ["معلم", "طالب", "مدرسة", "جامعة", "تعليم"],
                "required_formality": "moderate",
                "cultural_considerations": ["respect_for_teachers", "learning_environment"]
            }
        }
    
    def _load_professional_etiquette(self) -> Dict[str, Dict[str, List[str]]]:
        """Load professional etiquette rules"""
        return {
            "legal": {
                "appropriate_titles": ["حضرة القاضي", "المحامي المحترم", "سعادة المدعي"],
                "formal_language": ["نتشرف", "نتقدم بالاحترام", "مع فائق التقدير"]
            },
            "medical": {
                "appropriate_titles": ["الدكتور المحترم", "الطبيب الفاضل", "صاحب السعادة"],
                "formal_language": ["مع التقدير", "نشكر لكم", "دمتم بخير"]
            },
            "educational": {
                "appropriate_titles": ["الأستاذ الفاضل", "المدرس المحترم", "البروفيسور"],
                "formal_language": ["مع الشكر", "نقدر جهودكم", "بارك الله فيكم"]
            }
        }
    
    def assess_professional_appropriateness(self, content: str, domain: str) -> Dict[str, Any]:
        """Assess professional appropriateness for specific domain"""
        if domain not in self.professional_domains:
            return {"error": f"Unsupported domain: {domain}"}
        
        domain_info = self.professional_domains[domain]
        etiquette_info = self.etiquette_rules.get(domain, {})
        
        assessment = {
            "domain": domain,
            "appropriateness_score": 0.0,
            "formality_level": "insufficient",
            "terminology_usage": 0.0,
            "etiquette_compliance": 0.0,
            "recommendations": []
        }
        
        # Assess terminology usage
        terminology_count = 0
        for term in domain_info["terminology"]:
            if term in content:
                terminology_count += 1
        
        assessment["terminology_usage"] = min(terminology_count / 3, 1.0)
        
        # Assess etiquette compliance
        etiquette_score = 0.0
        if "appropriate_titles" in etiquette_info:
            for title in etiquette_info["appropriate_titles"]:
                if title in content:
                    etiquette_score += 0.3
        
        if "formal_language" in etiquette_info:
            for phrase in etiquette_info["formal_language"]:
                if phrase in content:
                    etiquette_score += 0.2
        
        assessment["etiquette_compliance"] = min(etiquette_score, 1.0)
        
        # Calculate overall appropriateness
        assessment["appropriateness_score"] = (
            assessment["terminology_usage"] * 0.4 +
            assessment["etiquette_compliance"] * 0.6
        )
        
        # Determine formality level
        if assessment["appropriateness_score"] >= 0.8:
            assessment["formality_level"] = "excellent"
        elif assessment["appropriateness_score"] >= 0.6:
            assessment["formality_level"] = "adequate"
        else:
            assessment["formality_level"] = "insufficient"
        
        # Generate recommendations
        if assessment["terminology_usage"] < 0.5:
            assessment["recommendations"].append(f"Include more {domain}-specific terminology")
        
        if assessment["etiquette_compliance"] < 0.6:
            assessment["recommendations"].append(f"Follow proper {domain} professional etiquette")
        
        return assessment