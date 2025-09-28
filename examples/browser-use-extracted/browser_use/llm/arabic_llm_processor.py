"""
Arabic LLM Processor - Specialized processing for Arabic language content
Cultural context awareness and Islamic compliance validation
"""

import logging
import re
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass, field
from enum import Enum

logger = logging.getLogger(__name__)


class CulturalContext(Enum):
    """Cultural context types for processing"""

    IRAQI_GOVERNMENT = "iraqi_government"
    IRAQI_BUSINESS = "iraqi_business"
    IRAQI_EDUCATION = "iraqi_education"
    IRAQI_HEALTHCARE = "iraqi_healthcare"
    IRAQI_GENERAL = "iraqi_general"
    ISLAMIC_FORMAL = "islamic_formal"
    ARABIC_STANDARD = "arabic_standard"


@dataclass
class CulturalValidation:
    """Result of cultural validation"""

    is_appropriate: bool
    confidence_score: float
    issues: List[str] = field(default_factory=list)
    suggestions: List[str] = field(default_factory=list)
    islamic_compliance: float = 1.0
    cultural_alignment: float = 1.0


@dataclass
class ArabicProcessingResult:
    """Result of Arabic text processing"""

    original_text: str
    processed_text: str
    language_detected: str
    dialect_features: List[str] = field(default_factory=list)
    cultural_context: Optional[CulturalContext] = None
    validation: Optional[CulturalValidation] = None
    suggestions: List[str] = field(default_factory=list)


class ArabicLLMProcessor:
    """
    Specialized processor for Arabic language content in LLM interactions
    Handles cultural context, Islamic compliance, and Iraqi dialect processing
    """

    def __init__(self):
        self.arabic_patterns = self._load_arabic_patterns()
        self.cultural_terms = self._load_cultural_terms()
        self.islamic_guidelines = self._load_islamic_guidelines()
        self.iraqi_dialect = self._load_iraqi_dialect_patterns()
        self.government_vocabulary = self._load_government_vocabulary()

    def process_prompt(
        self, prompt: str, context: CulturalContext = CulturalContext.IRAQI_GENERAL
    ) -> str:
        """Process prompt with cultural and linguistic enhancement"""
        try:
            # Detect language and content type
            is_arabic = self._contains_arabic(prompt)

            # Add cultural context prefix
            cultural_prefix = self._get_cultural_prefix(context, is_arabic)

            # Enhance prompt with appropriate guidelines
            enhanced_prompt = self._enhance_prompt_with_guidelines(
                prompt, context, is_arabic
            )

            # Add Islamic compliance guidelines if needed
            if context in [
                CulturalContext.IRAQI_GOVERNMENT,
                CulturalContext.ISLAMIC_FORMAL,
            ]:
                enhanced_prompt = self._add_islamic_guidelines(enhanced_prompt)

            # Add dialect awareness for Iraqi contexts
            if context.value.startswith("iraqi"):
                enhanced_prompt = self._add_iraqi_dialect_awareness(enhanced_prompt)

            final_prompt = cultural_prefix + enhanced_prompt

            logger.info(f"Enhanced prompt for {context.value} context")
            return final_prompt

        except Exception as e:
            logger.error(f"Prompt processing failed: {e}")
            return prompt

    def validate_response(
        self, response: str, context: CulturalContext = CulturalContext.IRAQI_GENERAL
    ) -> CulturalValidation:
        """Validate LLM response for cultural appropriateness"""
        try:
            validation = CulturalValidation(is_appropriate=True, confidence_score=1.0)

            # Check Islamic compliance
            islamic_score, islamic_issues = self._validate_islamic_compliance(response)
            validation.islamic_compliance = islamic_score
            validation.issues.extend(islamic_issues)

            # Check cultural alignment
            cultural_score, cultural_issues = self._validate_cultural_alignment(
                response, context
            )
            validation.cultural_alignment = cultural_score
            validation.issues.extend(cultural_issues)

            # Check for inappropriate content
            inappropriate_content = self._check_inappropriate_content(response)
            if inappropriate_content:
                validation.is_appropriate = False
                validation.issues.extend(inappropriate_content)
                validation.confidence_score *= 0.5

            # Generate suggestions for improvement
            validation.suggestions = self._generate_improvement_suggestions(
                response, context
            )

            # Calculate overall confidence
            validation.confidence_score = min(
                validation.islamic_compliance, validation.cultural_alignment
            )

            if validation.issues:
                validation.confidence_score *= 0.7

            return validation

        except Exception as e:
            logger.error(f"Response validation failed: {e}")
            return CulturalValidation(
                is_appropriate=False,
                confidence_score=0.0,
                issues=[f"Validation error: {e}"],
            )

    def enhance_arabic_content(self, text: str) -> ArabicProcessingResult:
        """Enhance Arabic content with proper formatting and cultural context"""
        try:
            result = ArabicProcessingResult(
                original_text=text,
                processed_text=text,
                language_detected=self._detect_language(text),
            )

            if result.language_detected == "ar":
                # Normalize Arabic text
                result.processed_text = self._normalize_arabic_text(text)

                # Detect dialect features
                result.dialect_features = self._detect_dialect_features(text)

                # Detect cultural context
                result.cultural_context = self._detect_cultural_context(text)

                # Add proper Arabic formatting
                result.processed_text = self._format_arabic_text(result.processed_text)

                # Validate cultural appropriateness
                if result.cultural_context:
                    result.validation = self.validate_response(
                        text, result.cultural_context
                    )

                # Generate suggestions
                result.suggestions = self._generate_arabic_suggestions(text)

            return result

        except Exception as e:
            logger.error(f"Arabic content enhancement failed: {e}")
            return ArabicProcessingResult(
                original_text=text, processed_text=text, language_detected="unknown"
            )

    def translate_cultural_terms(
        self, text: str, source_lang: str = "en", target_lang: str = "ar"
    ) -> str:
        """Translate with cultural term preservation"""
        try:
            if source_lang == "en" and target_lang == "ar":
                return self._translate_to_arabic(text)
            elif source_lang == "ar" and target_lang == "en":
                return self._translate_to_english(text)
            else:
                return text

        except Exception as e:
            logger.error(f"Cultural translation failed: {e}")
            return text

    def generate_system_prompt(self, task_type: str, context: CulturalContext) -> str:
        """Generate culturally appropriate system prompt"""
        base_prompts = {
            "web_automation": "You are an expert web automation assistant specializing in Iraqi government portals and Arabic web interfaces.",
            "form_filling": "You are an expert in Iraqi government forms and administrative procedures.",
            "content_analysis": "You are an expert content analyst with deep knowledge of Iraqi culture and Arabic language.",
            "translation": "You are an expert translator specializing in Iraqi Arabic and formal government language.",
            "navigation": "You are an expert web navigator familiar with Iraqi government websites and portal structures.",
        }

        base_prompt = base_prompts.get(task_type, base_prompts["web_automation"])

        # Add cultural context
        cultural_additions = {
            CulturalContext.IRAQI_GOVERNMENT: "\n\nYou have extensive knowledge of Iraqi government procedures, official forms, and administrative requirements. You understand the formal language used in government communications and respect the cultural importance of proper documentation.",
            CulturalContext.IRAQI_BUSINESS: "\n\nYou understand Iraqi business customs, commercial procedures, and the integration of traditional business practices with modern technology. You respect Islamic business principles and Iraqi commercial law.",
            CulturalContext.IRAQI_EDUCATION: "\n\nYou are familiar with the Iraqi education system, university procedures, and academic requirements. You understand the importance of education in Iraqi society and Islamic learning principles.",
            CulturalContext.ISLAMIC_FORMAL: "\n\nYou strictly adhere to Islamic principles and values in all recommendations. You use appropriate Islamic greetings and expressions, and ensure all suggestions respect Islamic guidelines and Iraqi cultural norms.",
        }

        cultural_addition = cultural_additions.get(context, "")

        # Add general guidelines
        guidelines = "\n\nGuidelines:\n1. Respect Islamic values and Iraqi cultural norms\n2. Use formal Arabic when appropriate\n3. Be mindful of RTL text direction\n4. Consider Iraqi time zones and working hours\n5. Ensure all recommendations are culturally appropriate"

        return base_prompt + cultural_addition + guidelines

    def _load_arabic_patterns(self) -> Dict[str, re.Pattern]:
        """Load Arabic text patterns"""
        return {
            "arabic_chars": re.compile(r"[\u0600-\u06FF]"),
            "arabic_numbers": re.compile(r"[\u0660-\u0669]"),
            "diacritics": re.compile(r"[\u064B-\u065F\u0670\u0640]"),
            "punctuation": re.compile(r"[؟؛،]"),
            "rtl_marks": re.compile(r"[\u200F\u202E]"),
        }

    def _load_cultural_terms(self) -> Dict[str, Dict[str, str]]:
        """Load cultural terms and their appropriate usage"""
        return {
            "greetings": {
                "peace_greeting": "السلام عليكم ورحمة الله وبركاته",
                "formal_greeting": "أهلاً وسهلاً",
                "response_greeting": "وعليكم السلام ورحمة الله وبركاته",
            },
            "expressions": {
                "god_willing": "إن شاء الله",
                "praise_god": "الحمد لله",
                "with_permission": "بإذن الله",
                "god_bless": "بارك الله فيك",
                "may_god_give_strength": "الله يعطيك العافية",
            },
            "formal_terms": {
                "respectfully": "مع فائق الاحترام",
                "your_excellency": "سعادتكم",
                "honored_sir": "المحترم",
                "esteemed_madam": "المحترمة",
            },
        }

    def _load_islamic_guidelines(self) -> List[str]:
        """Load Islamic compliance guidelines"""
        return [
            "Respect Islamic values and principles",
            "Use appropriate Islamic expressions when relevant",
            "Avoid content that conflicts with Islamic teachings",
            "Be mindful of prayer times and religious obligations",
            "Respect Islamic calendar and holidays",
            "Use inclusive language that respects Islamic diversity",
            "Avoid inappropriate imagery or content descriptions",
            "Respect Islamic financial principles (halal/haram)",
        ]

    def _load_iraqi_dialect_patterns(self) -> Dict[str, List[str]]:
        """Load Iraqi dialect patterns and vocabulary"""
        return {
            "common_words": [
                "شلونك",
                "شنو",
                "وين",
                "أني",
                "إنت",
                "إنتي",
                "هاي",
                "هذا",
                "هذه",
                "يالله",
                "ماكو",
                "إيا",
            ],
            "government_terms": [
                "دائرة",
                "مديرية",
                "أمانة",
                "وزارة",
                "هيئة",
                "مصلحة",
                "مؤسسة",
                "مركز",
                "قسم",
                "شعبة",
            ],
            "formal_expressions": [
                "حضرة المواطن",
                "حضرة المواطنة",
                "المحترم",
                "المحترمة",
                "سيادتكم",
                "حضرتكم",
            ],
        }

    def _load_government_vocabulary(self) -> Dict[str, str]:
        """Load Iraqi government vocabulary and terminology"""
        return {
            "documents": {
                "passport": "جواز السفر",
                "national_id": "هوية الأحوال المدنية",
                "birth_certificate": "شهادة الميلاد",
                "residence_card": "بطاقة السكن",
                "work_permit": "إجازة العمل",
            },
            "procedures": {
                "application": "طلب",
                "renewal": "تجديد",
                "issuance": "إصدار",
                "verification": "تصديق",
                "authentication": "توثيق",
            },
            "institutions": {
                "ministry": "وزارة",
                "directorate": "مديرية",
                "department": "دائرة",
                "office": "مكتب",
                "center": "مركز",
            },
        }

    def _contains_arabic(self, text: str) -> bool:
        """Check if text contains Arabic characters"""
        return bool(self.arabic_patterns["arabic_chars"].search(text))

    def _detect_language(self, text: str) -> str:
        """Detect primary language of text"""
        arabic_chars = len(self.arabic_patterns["arabic_chars"].findall(text))
        total_chars = len([c for c in text if c.isalpha()])

        if total_chars == 0:
            return "unknown"

        arabic_ratio = arabic_chars / total_chars

        if arabic_ratio > 0.5:
            return "ar"
        elif arabic_ratio > 0.1:
            return "mixed"
        else:
            return "en"

    def _normalize_arabic_text(self, text: str) -> str:
        """Normalize Arabic text"""
        # Remove diacritics
        text = self.arabic_patterns["diacritics"].sub("", text)

        # Normalize Alef variants
        text = re.sub(r"[آأإٱ]", "ا", text)

        # Normalize Yeh variants
        text = re.sub(r"[يى]", "ي", text)

        # Normalize whitespace
        text = re.sub(r"\s+", " ", text).strip()

        return text

    def _detect_dialect_features(self, text: str) -> List[str]:
        """Detect Iraqi dialect features"""
        features = []

        for category, words in self.iraqi_dialect.items():
            for word in words:
                if word in text:
                    features.append(f"{category}:{word}")

        return features

    def _detect_cultural_context(self, text: str) -> Optional[CulturalContext]:
        """Detect cultural context from text content"""
        text_lower = text.lower()

        # Government context indicators
        gov_indicators = ["وزارة", "مديرية", "جواز", "هوية", "ministry", "government"]
        if any(indicator in text_lower for indicator in gov_indicators):
            return CulturalContext.IRAQI_GOVERNMENT

        # Business context indicators
        business_indicators = ["شركة", "تجارة", "أعمال", "company", "business"]
        if any(indicator in text_lower for indicator in business_indicators):
            return CulturalContext.IRAQI_BUSINESS

        # Education context indicators
        edu_indicators = ["جامعة", "كلية", "تعليم", "university", "education"]
        if any(indicator in text_lower for indicator in edu_indicators):
            return CulturalContext.IRAQI_EDUCATION

        # Islamic context indicators
        islamic_indicators = [
            "إن شاء الله",
            "الحمد لله",
            "بإذن الله",
            "islamic",
            "allah",
        ]
        if any(indicator in text_lower for indicator in islamic_indicators):
            return CulturalContext.ISLAMIC_FORMAL

        return CulturalContext.IRAQI_GENERAL

    def _format_arabic_text(self, text: str) -> str:
        """Format Arabic text with proper RTL markers"""
        # Add RTL mark for Arabic text
        if self._contains_arabic(text):
            text = f"\u202b{text}\u202c"  # RTL embedding

        return text

    def _validate_islamic_compliance(self, text: str) -> Tuple[float, List[str]]:
        """Validate Islamic compliance of content"""
        score = 1.0
        issues = []

        # Check for positive Islamic expressions
        positive_expressions = ["إن شاء الله", "الحمد لله", "بإذن الله"]
        for expr in positive_expressions:
            if expr in text:
                score = min(1.0, score + 0.1)

        # Check for potentially problematic content
        # This would be expanded with more comprehensive checking
        problematic_terms = []  # Add terms that conflict with Islamic values

        for term in problematic_terms:
            if term.lower() in text.lower():
                score -= 0.3
                issues.append(f"Contains potentially problematic term: {term}")

        return max(0.0, score), issues

    def _validate_cultural_alignment(
        self, text: str, context: CulturalContext
    ) -> Tuple[float, List[str]]:
        """Validate cultural alignment for Iraqi context"""
        score = 1.0
        issues = []

        # Context-specific validation
        if context == CulturalContext.IRAQI_GOVERNMENT:
            # Check for formal language
            formal_indicators = ["المحترم", "حضرة", "سعادة"]
            if not any(indicator in text for indicator in formal_indicators):
                score -= 0.2
                issues.append(
                    "Consider using more formal language for government context"
                )

        # Check for cultural sensitivity
        sensitive_topics = []  # Add topics that require careful handling
        for topic in sensitive_topics:
            if topic.lower() in text.lower():
                score -= 0.2
                issues.append(f"Content touches on sensitive topic: {topic}")

        return max(0.0, score), issues

    def _check_inappropriate_content(self, text: str) -> List[str]:
        """Check for inappropriate content"""
        issues = []

        # Check for inappropriate language
        inappropriate_terms = []  # Add inappropriate terms

        for term in inappropriate_terms:
            if term.lower() in text.lower():
                issues.append(f"Contains inappropriate content: {term}")

        return issues

    def _generate_improvement_suggestions(
        self, text: str, context: CulturalContext
    ) -> List[str]:
        """Generate suggestions for improving cultural appropriateness"""
        suggestions = []

        # General suggestions
        if not self._contains_arabic(text) and context.value.startswith("iraqi"):
            suggestions.append("Consider including Arabic text for Iraqi audience")

        # Context-specific suggestions
        if context == CulturalContext.IRAQI_GOVERNMENT:
            if "إن شاء الله" not in text:
                suggestions.append(
                    "Consider adding 'إن شاء الله' for appropriate religious expression"
                )

        return suggestions

    def _generate_arabic_suggestions(self, text: str) -> List[str]:
        """Generate suggestions for Arabic text improvement"""
        suggestions = []

        # Check for missing diacritics in formal context
        if len(text) > 100 and not self.arabic_patterns["diacritics"].search(text):
            suggestions.append("Consider adding diacritics for formal Arabic text")

        # Check for RTL formatting
        if not self.arabic_patterns["rtl_marks"].search(text):
            suggestions.append("Consider adding RTL formatting markers")

        return suggestions

    def _get_cultural_prefix(self, context: CulturalContext, is_arabic: bool) -> str:
        """Get appropriate cultural prefix for prompts"""
        prefixes = {
            CulturalContext.IRAQI_GOVERNMENT: "In the context of Iraqi government services and with respect for Islamic values and Iraqi culture: ",
            CulturalContext.IRAQI_BUSINESS: "In the context of Iraqi business practices and Islamic commercial principles: ",
            CulturalContext.ISLAMIC_FORMAL: "With strict adherence to Islamic principles and values: ",
            CulturalContext.IRAQI_GENERAL: "With consideration for Iraqi culture and Islamic values: ",
        }

        return prefixes.get(context, "")

    def _enhance_prompt_with_guidelines(
        self, prompt: str, context: CulturalContext, is_arabic: bool
    ) -> str:
        """Enhance prompt with cultural guidelines"""
        enhancements = []

        if is_arabic:
            enhancements.append("Please respond in Arabic with proper RTL formatting.")

        if context == CulturalContext.IRAQI_GOVERNMENT:
            enhancements.append(
                "Use formal language appropriate for government communications."
            )

        if enhancements:
            return prompt + "\n\nAdditional guidelines:\n" + "\n".join(enhancements)

        return prompt

    def _add_islamic_guidelines(self, prompt: str) -> str:
        """Add Islamic compliance guidelines"""
        islamic_note = (
            "\n\nPlease ensure all responses respect Islamic values and principles."
        )
        return prompt + islamic_note

    def _add_iraqi_dialect_awareness(self, prompt: str) -> str:
        """Add Iraqi dialect awareness"""
        dialect_note = (
            "\n\nBe aware of Iraqi Arabic dialect variations and local terminology."
        )
        return prompt + dialect_note

    def _translate_to_arabic(self, text: str) -> str:
        """Basic cultural translation to Arabic"""
        # This would be enhanced with proper translation service
        translations = {
            "government": "حكومة",
            "ministry": "وزارة",
            "passport": "جواز السفر",
            "application": "طلب",
            "form": "استمارة",
        }

        result = text
        for english, arabic in translations.items():
            result = result.replace(english, arabic)

        return result

    def _translate_to_english(self, text: str) -> str:
        """Basic cultural translation to English"""
        # This would be enhanced with proper translation service
        translations = {
            "حكومة": "government",
            "وزارة": "ministry",
            "جواز السفر": "passport",
            "طلب": "application",
            "استمارة": "form",
        }

        result = text
        for arabic, english in translations.items():
            result = result.replace(arabic, english)

        return result
