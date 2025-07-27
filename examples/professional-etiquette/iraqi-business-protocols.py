"""
Iraqi Professional Business Protocols and Etiquette System
Comprehensive guide for proper business communication and cultural norms
"""

from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass
from enum import Enum
import re
from datetime import datetime, time
import json

class ProfessionType(Enum):
    LAWYER = "lawyer"
    DOCTOR = "doctor" 
    TEACHER = "teacher"
    ENGINEER = "engineer"
    BUSINESSMAN = "businessman"
    GOVERNMENT_OFFICIAL = "government_official"
    RELIGIOUS_SCHOLAR = "religious_scholar"

class BusinessContext(Enum):
    FIRST_MEETING = "first_meeting"
    FORMAL_PRESENTATION = "formal_presentation"
    NEGOTIATION = "negotiation"
    CONSULTATION = "consultation"
    FOLLOW_UP = "follow_up"
    COMPLAINT_RESOLUTION = "complaint_resolution"

class CommunicationChannel(Enum):
    EMAIL = "email"
    PHONE = "phone"
    IN_PERSON = "in_person"
    VIDEO_CALL = "video_call"
    WRITTEN_LETTER = "written_letter"

@dataclass
class ProfessionalTitle:
    arabic_formal: str
    arabic_casual: str
    english_formal: str
    context_usage: List[BusinessContext]
    gender_variants: Dict[str, str]

@dataclass
class BusinessProtocol:
    greeting: str
    introduction_pattern: str
    closing: str
    appropriate_topics: List[str]
    topics_to_avoid: List[str]
    time_sensitivity: Dict[str, str]

@dataclass
class EtiquetteValidation:
    is_appropriate: bool
    formality_score: float
    respect_level: float
    cultural_alignment: float
    suggestions: List[str]
    protocol_violations: List[str]

class IraqiBusinessEtiquetteManager:
    """Comprehensive manager for Iraqi business etiquette and professional protocols"""
    
    def __init__(self):
        self._initialize_professional_titles()
        self._initialize_business_protocols()
        self._initialize_cultural_guidelines()
        self._initialize_timing_protocols()

    def _initialize_professional_titles(self):
        """Initialize comprehensive professional title system"""
        
        self.professional_titles = {
            ProfessionType.LAWYER: ProfessionalTitle(
                arabic_formal="حضرة الأستاذ المحامي",
                arabic_casual="الأستاذ المحامي",
                english_formal="Honorable Counselor",
                context_usage=[BusinessContext.FORMAL_PRESENTATION, BusinessContext.NEGOTIATION],
                gender_variants={
                    "male": "الأستاذ المحامي",
                    "female": "الأستاذة المحامية"
                }
            ),
            
            ProfessionType.DOCTOR: ProfessionalTitle(
                arabic_formal="الدكتور المحترم",
                arabic_casual="دكتور",
                english_formal="Respected Doctor",
                context_usage=[BusinessContext.CONSULTATION, BusinessContext.FIRST_MEETING],
                gender_variants={
                    "male": "الدكتور",
                    "female": "الدكتورة"
                }
            ),
            
            ProfessionType.TEACHER: ProfessionalTitle(
                arabic_formal="الأستاذ الفاضل",
                arabic_casual="أستاذ",
                english_formal="Esteemed Professor",
                context_usage=[BusinessContext.CONSULTATION, BusinessContext.FOLLOW_UP],
                gender_variants={
                    "male": "الأستاذ",
                    "female": "الأستاذة"
                }
            ),
            
            ProfessionType.ENGINEER: ProfessionalTitle(
                arabic_formal="المهندس المحترم",
                arabic_casual="مهندس",
                english_formal="Respected Engineer",
                context_usage=[BusinessContext.FORMAL_PRESENTATION, BusinessContext.NEGOTIATION],
                gender_variants={
                    "male": "المهندس",
                    "female": "المهندسة"
                }
            ),
            
            ProfessionType.GOVERNMENT_OFFICIAL: ProfessionalTitle(
                arabic_formal="سيادة المدير",
                arabic_casual="السيد المدير",
                english_formal="Your Excellency",
                context_usage=[BusinessContext.FORMAL_PRESENTATION, BusinessContext.FIRST_MEETING],
                gender_variants={
                    "male": "السيد",
                    "female": "السيدة"
                }
            )
        }

    def _initialize_business_protocols(self):
        """Initialize business protocol templates"""
        
        self.business_protocols = {
            BusinessContext.FIRST_MEETING: BusinessProtocol(
                greeting="السلام عليكم ورحمة الله وبركاته",
                introduction_pattern="أتشرف بلقائكم، اسمي {name} من {organization}",
                closing="بارك الله فيكم، وأتطلع للعمل معكم",
                appropriate_topics=[
                    "التعريف بالشركة والخدمات",
                    "الخبرات المهنية",
                    "أهداف التعاون المشتركة",
                    "القيم المهنية والأخلاقية"
                ],
                topics_to_avoid=[
                    "المواضيع السياسية",
                    "الانتماءات الطائفية",  
                    "الأمور الشخصية الحساسة",
                    "النقد المباشر للمنافسين"
                ],
                time_sensitivity={
                    "duration": "45-60 دقيقة",
                    "best_time": "صباحاً 9:00-11:00",
                    "avoid_times": "وقت الصلاة، وقت الغداء"
                }
            ),
            
            BusinessContext.NEGOTIATION: BusinessProtocol(
                greeting="أهلاً وسهلاً بكم",
                introduction_pattern="نقدر حضوركم ونتطلع لتحقيق اتفاق مثمر",
                closing="إن شاء الله سنصل لحل يرضي الجميع",
                appropriate_topics=[
                    "الشروط والأحكام",
                    "الفوائد المتبادلة", 
                    "الجداول الزمنية",
                    "الضمانات والالتزامات"
                ],
                topics_to_avoid=[
                    "المقارنات السلبية",
                    "الضغط المفرط",
                    "التهديدات المبطنة",
                    "التقليل من قيمة الطرف الآخر"
                ],
                time_sensitivity={
                    "duration": "60-90 دقيقة",
                    "best_time": "صباحاً أو بعد العصر",
                    "preparation_needed": "دراسة مسبقة للملف"
                }
            ),
            
            BusinessContext.CONSULTATION: BusinessProtocol(
                greeting="مرحباً بكم، كيف يمكنني مساعدتكم؟",
                introduction_pattern="أنا في خدمتكم للإجابة على استفساراتكم",
                closing="أتمنى أن أكون قد أفدتكم، لا تترددوا في التواصل",
                appropriate_topics=[
                    "الاستفسارات المهنية",
                    "طلب النصح والإرشاد",
                    "شرح الخدمات والإجراءات",
                    "تقديم التوضيحات اللازمة"
                ],
                topics_to_avoid=[
                    "طلب خدمات مجانية مفرطة",
                    "انتقاد المؤسسات الأخرى",
                    "المطالب غير المعقولة"
                ],
                time_sensitivity={
                    "duration": "30-45 دقيقة",
                    "availability": "حسب مواعيد العمل",
                    "response_time": "خلال 24-48 ساعة"
                }
            )
        }

    def _initialize_cultural_guidelines(self):
        """Initialize Iraqi cultural business guidelines"""
        
        self.cultural_norms = {
            "greeting_hierarchy": {
                "order": [
                    "الأكبر سناً أولاً",
                    "أصحاب المناصب العليا",
                    "الضيوف والزوار",
                    "النساء (في السياق المناسب)",
                    "باقي الحضور"
                ],
                "handshake_protocol": {
                    "same_gender": "مصافحة باليد مقبولة",
                    "different_gender": "تحية بالكلام فقط إلا إذا بدأ الطرف الآخر",
                    "religious_context": "احترام الاعتبارات الدينية"
                }
            },
            
            "gift_giving": {
                "appropriate": [
                    "كتب مهنية أو ثقافية",
                    "تذكارات ثقافية عراقية",
                    "منتجات محلية ذات جودة",
                    "هدايا رمزية للمكتب"
                ],
                "inappropriate": [
                    "الكحوليات",
                    "منتجات لحم الخنزير",
                    "الهدايا الثمينة جداً",
                    "الهدايا الشخصية المثيرة للجدل"
                ],
                "timing": "في نهاية اللقاء أو المناسبات الخاصة"
            },
            
            "business_meal_etiquette": {
                "invitation_protocol": {
                    "advance_notice": "3-5 أيام مسبقاً",
                    "venue_selection": "مطعم محترم ومعروف",
                    "dietary_considerations": "السؤال عن القيود الغذائية"
                },
                "during_meal": {
                    "start_eating": "انتظار كبير السن أو المضيف",
                    "conversation": "مواضيع عامة قبل مناقشة العمل",
                    "payment": "المضيف يدفع عادة"
                }
            },
            
            "meeting_protocols": {
                "punctuality": {
                    "importance": "عالية جداً في السياق المهني",
                    "acceptable_delay": "5-10 دقائق مع الاعتذار",
                    "notification": "الاتصال عند التأخير المتوقع"
                },
                "seating_arrangement": {
                    "hierarchy_based": "الأهم يجلس في المقدمة أو الوسط",
                    "guest_priority": "الضيوف في المقاعد المريحة",
                    "accessibility": "مراعاة كبار السن والأشخاص ذوي الاحتياجات"
                }
            }
        }

    def _initialize_timing_protocols(self):
        """Initialize Iraqi business timing and scheduling protocols"""
        
        self.timing_guidelines = {
            "prayer_times_consideration": {
                "fajr": "الفجر - قبل شروق الشمس",
                "dhuhr": "الظهر - منتصف النهار (عادة 12:00-13:00)",
                "asr": "العصر - بعد الظهر (عادة 15:00-16:00)", 
                "maghrib": "المغرب - غروب الشمس",
                "isha": "العشاء - بعد غروب الشمس بساعة"
            },
            
            "friday_considerations": {
                "jummah_prayer": "صلاة الجمعة 11:30-13:00 تقريباً",
                "scheduling_impact": "تجنب المواعيد المهمة في هذا الوقت",
                "alternative_timing": "قبل الساعة 11:00 أو بعد الساعة 14:00"
            },
            
            "ramadan_adjustments": {
                "working_hours": "ساعات عمل مختصرة عادة",
                "meeting_timing": "تجنب ساعات ما قبل الإفطار",
                "energy_levels": "مراعاة انخفاض الطاقة أثناء الصيام",
                "iftar_meetings": "دعوات إفطار جماعي للعمل"
            },
            
            "holiday_awareness": {
                "eid_celebrations": "عيد الفطر وعيد الأضحى - إجازات رسمية",
                "religious_occasions": "عاشوراء، ذكرى الإسراء والمعراج",
                "national_holidays": "عيد الجيش، يوم الجمهورية",
                "planning_impact": "التخطيط المسبق للمشاريع والمواعيد"
            }
        }

    def get_appropriate_title(
        self, 
        profession: ProfessionType, 
        context: BusinessContext,
        gender: str = "male",
        formality_level: str = "formal"
    ) -> str:
        """Get appropriate professional title based on context"""
        
        if profession not in self.professional_titles:
            return "السيد المحترم" if gender == "male" else "السيدة المحترمة"
        
        title_info = self.professional_titles[profession]
        
        # Check if context requires this title
        if context not in title_info.context_usage:
            # Use general formal title
            return title_info.gender_variants.get(gender, title_info.arabic_casual)
        
        # Return appropriate formality level
        if formality_level == "formal":
            return title_info.arabic_formal
        else:
            return title_info.gender_variants.get(gender, title_info.arabic_casual)

    def get_protocol_template(self, context: BusinessContext) -> BusinessProtocol:
        """Get business protocol template for specific context"""
        return self.business_protocols.get(context, self.business_protocols[BusinessContext.CONSULTATION])

    def validate_business_communication(
        self, 
        text: str, 
        context: BusinessContext,
        profession: Optional[ProfessionType] = None,
        channel: CommunicationChannel = CommunicationChannel.EMAIL
    ) -> EtiquetteValidation:
        """Validate business communication for Iraqi etiquette compliance"""
        
        formality_score = self._calculate_formality_score(text, context)
        respect_level = self._calculate_respect_level(text, profession)
        cultural_alignment = self._calculate_cultural_alignment(text, context)
        
        suggestions = []
        violations = []
        
        # Check greeting appropriateness
        if not self._has_appropriate_greeting(text, context):
            suggestions.append("ابدأ بتحية مناسبة مثل 'السلام عليكم' أو 'مرحباً'")
            violations.append("Missing appropriate greeting")
        
        # Check title usage
        if profession and not self._uses_appropriate_title(text, profession):
            appropriate_title = self.get_appropriate_title(profession, context)
            suggestions.append(f"استخدم العنوان المناسب: {appropriate_title}")
            violations.append("Inappropriate or missing professional title")
        
        # Check closing appropriateness
        if not self._has_appropriate_closing(text, context):
            suggestions.append("اختتم بعبارة مهذبة مثل 'بارك الله فيكم' أو 'مع فائق الاحترام'")
            violations.append("Missing appropriate closing")
        
        # Check for inappropriate topics
        inappropriate_topics = self._detect_inappropriate_topics(text, context)
        if inappropriate_topics:
            suggestions.append("تجنب المواضيع الحساسة مثل السياسة والطائفية")
            violations.extend([f"Inappropriate topic: {topic}" for topic in inappropriate_topics])
        
        # Overall appropriateness
        overall_score = (formality_score + respect_level + cultural_alignment) / 3
        is_appropriate = overall_score >= 0.7 and not violations
        
        return EtiquetteValidation(
            is_appropriate=is_appropriate,
            formality_score=formality_score,
            respect_level=respect_level,
            cultural_alignment=cultural_alignment,
            suggestions=suggestions,
            protocol_violations=violations
        )

    def _calculate_formality_score(self, text: str, context: BusinessContext) -> float:
        """Calculate formality score based on language used"""
        score = 0.5  # Base score
        
        # Formal address patterns
        formal_patterns = [
            r'حضرة\s+\w+',  # "His/Her Honor"
            r'سيادة\s+\w+',  # "His/Her Excellency" 
            r'المحترم\w*',   # "Respected"
            r'الفاضل\w*',    # "Esteemed"
            r'مع\s+فائق\s+الاحترام',  # "With utmost respect"
        ]
        
        for pattern in formal_patterns:
            if re.search(pattern, text):
                score += 0.1
        
        # Islamic courtesy phrases
        islamic_courtesy = [
            'بارك الله فيكم', 'جزاكم الله خيراً', 'وفقكم الله',
            'حفظكم الله', 'أعانكم الله', 'بإذن الله'
        ]
        
        for phrase in islamic_courtesy:
            if phrase in text:
                score += 0.05
        
        # Penalize overly casual language in formal contexts
        if context in [BusinessContext.FORMAL_PRESENTATION, BusinessContext.NEGOTIATION]:
            casual_patterns = ['هاي', 'شلونك', 'وين رايح', 'شصاير']
            for pattern in casual_patterns:
                if pattern in text:
                    score -= 0.1
        
        return min(1.0, max(0.0, score))

    def _calculate_respect_level(self, text: str, profession: Optional[ProfessionType]) -> float:
        """Calculate respect level shown in communication"""
        score = 0.6  # Base score
        
        # Check for respectful language
        respectful_terms = [
            'من فضلكم', 'لو سمحتم', 'إذا تكرمتم', 'أرجو منكم',
            'نقدر لكم', 'نشكركم', 'نحترم رأيكم'
        ]
        
        for term in respectful_terms:
            if term in text:
                score += 0.08
        
        # Check for professional titles
        if profession:
            title_info = self.professional_titles.get(profession)
            if title_info:
                for title in [title_info.arabic_formal, title_info.arabic_casual]:
                    if title in text:
                        score += 0.15
                        break
        
        # Penalize disrespectful language
        disrespectful_patterns = [
            'أريد منك', 'لازم تسوي', 'ما أفهم ليش',
            'هذا غلط', 'أنت مخطئ'
        ]
        
        for pattern in disrespectful_patterns:
            if pattern in text:
                score -= 0.15
        
        return min(1.0, max(0.0, score))

    def _calculate_cultural_alignment(self, text: str, context: BusinessContext) -> float:
        """Calculate alignment with Iraqi cultural norms"""
        score = 0.7  # Base score
        
        # Check for Islamic values integration
        islamic_values = [
            'الصدق', 'الأمانة', 'العدل', 'التعاون', 
            'المساعدة', 'الخير', 'البركة'
        ]
        
        for value in islamic_values:
            if value in text:
                score += 0.03
        
        # Check for community-oriented language
        community_terms = [
            'نتعاون', 'نساعد بعض', 'الخير للجميع',
            'المصلحة العامة', 'نخدم المجتمع'
        ]
        
        for term in community_terms:
            if term in text:
                score += 0.05
        
        # Penalize individualistic or aggressive language
        negative_terms = [
            'أنا الأهم', 'مصلحتي أولاً', 'لا يهمني غيري',
            'سأنتقم', 'سأدمركم'
        ]
        
        for term in negative_terms:
            if term in text:
                score -= 0.2
        
        return min(1.0, max(0.0, score))

    def _has_appropriate_greeting(self, text: str, context: BusinessContext) -> bool:
        """Check if text has appropriate greeting for context"""
        greetings = [
            'السلام عليكم', 'مرحباً', 'أهلاً وسهلاً', 
            'صباح الخير', 'مساء الخير', 'حياكم الله'
        ]
        
        text_start = text[:100]  # Check first 100 characters
        return any(greeting in text_start for greeting in greetings)

    def _uses_appropriate_title(self, text: str, profession: ProfessionType) -> bool:
        """Check if appropriate professional title is used"""
        title_info = self.professional_titles.get(profession)
        if not title_info:
            return True  # No specific requirement
        
        titles_to_check = [
            title_info.arabic_formal,
            title_info.arabic_casual,
            *title_info.gender_variants.values()
        ]
        
        return any(title in text for title in titles_to_check)

    def _has_appropriate_closing(self, text: str, context: BusinessContext) -> bool:
        """Check if text has appropriate closing for context"""
        closings = [
            'بارك الله فيكم', 'مع فائق الاحترام', 'شكراً لكم',
            'في خدمتكم', 'وفقكم الله', 'حفظكم الله',
            'جزاكم الله خيراً', 'أطيب التحيات'
        ]
        
        text_end = text[-150:]  # Check last 150 characters
        return any(closing in text_end for closing in closings)

    def _detect_inappropriate_topics(self, text: str, context: BusinessContext) -> List[str]:
        """Detect inappropriate topics for business context"""
        inappropriate_topics = []
        
        # Political topics
        political_terms = ['حكومة فاسدة', 'الأحزاب', 'المعارضة', 'الانتخابات مزورة']
        if any(term in text for term in political_terms):
            inappropriate_topics.append("political content")
        
        # Sectarian topics
        sectarian_terms = ['شيعة ضد سنة', 'طائفية', 'التقسيم الطائفي']
        if any(term in text for term in sectarian_terms):
            inappropriate_topics.append("sectarian content")
        
        # Personal attacks
        personal_attacks = ['أنت غبي', 'عائلتك', 'أصلك وفصلك']
        if any(attack in text for attack in personal_attacks):
            inappropriate_topics.append("personal attacks")
        
        return inappropriate_topics

    def generate_business_email_template(
        self, 
        context: BusinessContext,
        recipient_profession: ProfessionType,
        sender_name: str,
        sender_organization: str
    ) -> str:
        """Generate culturally appropriate business email template"""
        
        protocol = self.get_protocol_template(context)
        title = self.get_appropriate_title(recipient_profession, context)
        
        template = f"""بسم الله الرحمن الرحيم

{protocol.greeting}

{title}،

{protocol.introduction_pattern.format(name=sender_name, organization=sender_organization)}

[محتوى الرسالة الأساسي]

{protocol.closing}

مع فائق الاحترام والتقدير،

{sender_name}
{sender_organization}

---
"وَقُل رَّبِّ أَدْخِلْنِي مُدْخَلَ صِدْقٍ وَأَخْرِجْنِي مُخْرَجَ صِدْقٍ وَاجْعَل لِّي مِن لَّدُنكَ سُلْطَانًا نَّصِيرًا"
"""
        
        return template

    def get_cultural_tips_for_profession(self, profession: ProfessionType) -> Dict[str, List[str]]:
        """Get specific cultural tips for interacting with different professions"""
        
        tips = {
            ProfessionType.LAWYER: {
                "do": [
                    "استخدم اللغة القانونية الدقيقة",
                    "احترم الإجراءات والمواعيد",
                    "قدم الوثائق مرتبة ومكتملة",
                    "اطرح أسئلة محددة وواضحة"
                ],
                "dont": [
                    "لا تطلب المشورة القانونية المجانية المعقدة",
                    "لا تتجاهل النصائح القانونية",
                    "لا تكتم معلومات مهمة",
                    "لا تتعجل في الإجراءات القانونية"
                ]
            },
            
            ProfessionType.DOCTOR: {
                "do": [
                    "احترم وقت الطبيب ومواعيد العيادة",
                    "قدم تاريخك المرضي بوضوح",
                    "اتبع تعليمات العلاج بدقة",
                    "اسأل عن أي شيء غير واضح"
                ],
                "dont": [
                    "لا تطلب تشخيص طبي عبر الهاتف فقط",
                    "لا تتجاهل الأعراض الجانبية",
                    "لا تتوقف عن الدواء دون استشارة",
                    "لا تطلب أدوية محددة دون فحص"
                ]
            },
            
            ProfessionType.TEACHER: {
                "do": [
                    "احترم دور المعلم في التربية والتعليم",
                    "شارك في الأنشطة التعليمية",
                    "قدم الدعم اللازم للطالب",
                    "تواصل بانتظام حول التقدم الأكاديمي"
                ],
                "dont": [
                    "لا تتدخل في المنهج الدراسي",
                    "لا تنتقد أسلوب التدريس أمام الطلاب",
                    "لا تطلب معاملة خاصة لطفلك",
                    "لا تتجاهل قوانين المدرسة"
                ]
            }
        }
        
        return tips.get(profession, {"do": [], "dont": []})

# Usage example
def main():
    """Example usage of Iraqi Business Etiquette Manager"""
    
    etiquette_manager = IraqiBusinessEtiquetteManager()
    
    # Test business communication validation
    test_communications = [
        {
            "text": "السلام عليكم الدكتور المحترم، أحتاج استشارة طبية حول حالة والدي. بارك الله فيكم.",
            "context": BusinessContext.CONSULTATION,
            "profession": ProfessionType.DOCTOR
        },
        {
            "text": "هاي دكتور، شلون صحتك؟ أبي دوا للصداع بسرعة.",
            "context": BusinessContext.CONSULTATION,
            "profession": ProfessionType.DOCTOR
        },
        {
            "text": "حضرة الأستاذ المحامي المحترم، نود استشارتكم في قضية قانونية هامة. مع فائق الاحترام.",
            "context": BusinessContext.FORMAL_PRESENTATION,
            "profession": ProfessionType.LAWYER
        }
    ]
    
    print("=== Iraqi Business Etiquette Validation ===\n")
    
    for i, comm in enumerate(test_communications, 1):
        print(f"Test {i}: {comm['text'][:50]}...")
        
        validation = etiquette_manager.validate_business_communication(
            comm['text'],
            comm['context'], 
            comm['profession']
        )
        
        print(f"  ✓ Appropriate: {validation.is_appropriate}")
        print(f"  ✓ Formality Score: {validation.formality_score:.3f}")
        print(f"  ✓ Respect Level: {validation.respect_level:.3f}")
        print(f"  ✓ Cultural Alignment: {validation.cultural_alignment:.3f}")
        
        if validation.suggestions:
            print(f"  💡 Suggestion: {validation.suggestions[0]}")
        
        if validation.protocol_violations:
            print(f"  ⚠ Violation: {validation.protocol_violations[0]}")
        
        print()
    
    # Generate sample business email
    print("=== Sample Business Email Template ===")
    email_template = etiquette_manager.generate_business_email_template(
        BusinessContext.FIRST_MEETING,
        ProfessionType.LAWYER,
        "أحمد محمد",
        "شركة البصرة للاستشارات القانونية"
    )
    print(email_template)

if __name__ == "__main__":
    main()