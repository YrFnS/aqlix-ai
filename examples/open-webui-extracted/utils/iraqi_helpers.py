"""
Iraqi AI Chat System - Iraqi Helper Utilities
Cultural, linguistic, and regional helper functions
"""

import re
import datetime
import pytz
from typing import Dict, List, Optional, Tuple, Any
from enum import Enum

from ..models.users import IraqiProfession, IraqiDialect

####################
# Iraqi Regional Data
####################


class IraqiRegion(str, Enum):
    BAGHDAD = "baghdad"
    BASRA = "basra"
    ERBIL = "erbil"
    NAJAF = "najaf"
    KARBALA = "karbala"
    MOSUL = "mosul"
    KIRKUK = "kirkuk"
    ANBAR = "anbar"
    BABYLON = "babylon"
    DIYALA = "diyala"
    DHI_QAR = "dhi_qar"
    MAYSAN = "maysan"
    MUTHANNA = "muthanna"
    QADISIYYAH = "qadisiyyah"
    SALADIN = "saladin"
    WASIT = "wasit"
    SULAYMANIYAH = "sulaymaniyah"
    DUHOK = "duhok"


IRAQI_REGION_INFO = {
    IraqiRegion.BAGHDAD: {
        "name_arabic": "بغداد",
        "timezone": "Asia/Baghdad",
        "dominant_dialect": IraqiDialect.BAGHDADI,
        "business_culture": "formal",
        "population": 8000000,
        "coordinates": (33.3152, 44.3661),
    },
    IraqiRegion.BASRA: {
        "name_arabic": "البصرة",
        "timezone": "Asia/Baghdad",
        "dominant_dialect": IraqiDialect.BASRAWI,
        "business_culture": "trade-focused",
        "population": 2500000,
        "coordinates": (30.5085, 47.7804),
    },
    IraqiRegion.ERBIL: {
        "name_arabic": "أربيل",
        "timezone": "Asia/Baghdad",
        "dominant_dialect": IraqiDialect.KURDI,
        "business_culture": "kurdish-arabic",
        "population": 1500000,
        "coordinates": (36.1911, 44.0094),
    },
}

####################
# Arabic Text Processing
####################


def format_arabic_name(name: str) -> Optional[str]:
    """
    Format and validate Arabic name according to Iraqi conventions
    """
    if not name or not name.strip():
        return None

    # Remove extra whitespace
    name = " ".join(name.split())

    # Check if name contains Arabic characters
    arabic_pattern = re.compile(r"[\u0600-\u06FF]")
    if not arabic_pattern.search(name):
        return None

    # Remove invalid characters (keep Arabic, spaces, and common punctuation)
    valid_pattern = re.compile(r"[^\u0600-\u06FF\s\-\.]")
    name = valid_pattern.sub("", name)

    # Capitalize first letter of each word (Arabic doesn't have case, but for consistency)
    words = name.split()
    if len(words) == 0:
        return None

    # Iraqi naming conventions: First name + family name (minimum)
    if len(words) < 2:
        return None

    # Maximum of 4 names (common in Iraqi culture)
    if len(words) > 4:
        words = words[:4]

    return " ".join(words)


def detect_iraqi_dialect(text: str) -> IraqiDialect:
    """
    Detect Iraqi dialect from text content
    """
    if not text:
        return IraqiDialect.IRAQI

    text_lower = text.lower()

    # Baghdad dialect indicators
    baghdadi_indicators = ["شلونك", "شكماكو", "هاي", "چاي", "ويا", "صاير"]
    baghdadi_count = sum(
        1 for indicator in baghdadi_indicators if indicator in text_lower
    )

    # Basra dialect indicators
    basrawi_indicators = ["شلونكم", "شجان", "مسگوف", "شط", "ويّاكم"]
    basrawi_count = sum(
        1 for indicator in basrawi_indicators if indicator in text_lower
    )

    # Kurdish-Arabic mix indicators
    kurdi_indicators = ["چون", "چی", "بەس", "نەوە"]
    kurdi_count = sum(1 for indicator in kurdi_indicators if indicator in text_lower)

    # Formal Arabic indicators
    formal_indicators = ["كيف حالك", "أهلاً وسهلاً", "تشرفنا", "السلام عليكم"]
    formal_count = sum(1 for indicator in formal_indicators if indicator in text_lower)

    # Return dialect with highest score
    scores = {
        IraqiDialect.BAGHDADI: baghdadi_count,
        IraqiDialect.BASRAWI: basrawi_count,
        IraqiDialect.KURDI: kurdi_count,
        IraqiDialect.FORMAL_ARABIC: formal_count,
    }

    max_dialect = max(scores.items(), key=lambda x: x[1])

    # If no clear winner, default to Iraqi
    if max_dialect[1] == 0:
        return IraqiDialect.IRAQI

    return max_dialect[0]


def convert_to_iraqi_dialect(text: str, target_dialect: IraqiDialect) -> str:
    """
    Convert text to specific Iraqi dialect
    """
    if not text:
        return text

    conversions = {
        IraqiDialect.BAGHDADI: {
            "كيف حالك": "شلونك",
            "ماذا تفعل": "شتسوي",
            "أين": "وين",
            "متى": "شوكت",
            "ماذا": "شنو",
            "نعم": "أي",
            "لا": "لا",
        },
        IraqiDialect.BASRAWI: {
            "كيف حالك": "شلونكم",
            "أين": "وين",
            "السمك": "سمچ",
            "الشاي": "چاي",
            "معك": "ويّاك",
        },
        IraqiDialect.FORMAL_ARABIC: {
            "شلونك": "كيف حالك",
            "شنو": "ماذا",
            "وين": "أين",
            "شوكت": "متى",
            "أي": "نعم",
        },
    }

    dialect_conversions = conversions.get(target_dialect, {})

    converted_text = text
    for formal, dialect in dialect_conversions.items():
        converted_text = converted_text.replace(formal, dialect)

    return converted_text


####################
# Professional Domain Validation
####################


def validate_professional_domain(
    requested_profession: IraqiProfession, user_profession: IraqiProfession
) -> bool:
    """
    Validate if user can access requested professional domain
    """
    # Admin-level professions (can access most domains)
    admin_professions = {
        IraqiProfession.DOCTOR,
        IraqiProfession.LAWYER,
        IraqiProfession.ENGINEER,
    }

    # Same profession access
    if requested_profession == user_profession:
        return True

    # Admin professions can access most domains
    if user_profession in admin_professions:
        return True

    # Teachers can access educational content
    if user_profession == IraqiProfession.TEACHER and requested_profession in {
        IraqiProfession.STUDENT,
        IraqiProfession.TEACHER,
    }:
        return True

    # Students can access educational and general content
    if user_profession == IraqiProfession.STUDENT and requested_profession in {
        IraqiProfession.TEACHER,
        IraqiProfession.STUDENT,
        IraqiProfession.OTHER,
    }:
        return True

    # Business users can access business-related domains
    if user_profession == IraqiProfession.BUSINESSMAN and requested_profession in {
        IraqiProfession.ENGINEER,
        IraqiProfession.OTHER,
    }:
        return True

    return False


def get_professional_terminology(profession: IraqiProfession) -> Dict[str, List[str]]:
    """
    Get professional terminology for specific Iraqi profession
    """
    terminology = {
        IraqiProfession.LAWYER: {
            "arabic_terms": [
                "المحكمة",
                "القاضي",
                "المحامي",
                "الدعوى",
                "الحكم",
                "القانون",
                "الدستور",
                "الجريمة",
                "العقوبة",
                "الإجراءات",
                "الاستئناف",
                "التحقيق",
                "الشهادة",
                "الوثائق",
                "العقد",
                "الميراث",
                "الطلاق",
            ],
            "english_terms": [
                "court",
                "judge",
                "lawyer",
                "lawsuit",
                "verdict",
                "law",
                "constitution",
                "crime",
                "penalty",
                "procedures",
                "appeal",
                "investigation",
                "testimony",
                "documents",
                "contract",
                "inheritance",
            ],
        },
        IraqiProfession.DOCTOR: {
            "arabic_terms": [
                "الطبيب",
                "المريض",
                "المستشفى",
                "العلاج",
                "الدواء",
                "التشخيص",
                "العملية",
                "الطوارئ",
                "الصحة",
                "المرض",
                "الوقاية",
                "التطعيم",
                "الأشعة",
                "التحليل",
                "الصيدلية",
                "الجراحة",
                "القلب",
                "الدم",
            ],
            "english_terms": [
                "doctor",
                "patient",
                "hospital",
                "treatment",
                "medicine",
                "diagnosis",
                "surgery",
                "emergency",
                "health",
                "disease",
                "prevention",
                "vaccination",
                "radiology",
                "analysis",
                "pharmacy",
                "surgery",
                "heart",
                "blood",
            ],
        },
        IraqiProfession.TEACHER: {
            "arabic_terms": [
                "المدرسة",
                "الجامعة",
                "الطالب",
                "المعلم",
                "الأستاذ",
                "الدرس",
                "الامتحان",
                "الشهادة",
                "التعليم",
                "التربية",
                "المنهج",
                "الفصل",
                "الدرجات",
                "التقييم",
                "البحث",
                "الرسالة",
                "المكتبة",
                "الكتاب",
            ],
            "english_terms": [
                "school",
                "university",
                "student",
                "teacher",
                "professor",
                "lesson",
                "exam",
                "certificate",
                "education",
                "pedagogy",
                "curriculum",
                "classroom",
                "grades",
                "assessment",
                "research",
                "thesis",
                "library",
                "book",
            ],
        },
        IraqiProfession.ENGINEER: {
            "arabic_terms": [
                "الهندسة",
                "المهندس",
                "التصميم",
                "البناء",
                "الإنشاء",
                "المشروع",
                "الخطة",
                "الحاسوب",
                "البرمجة",
                "الشبكة",
                "الكهرباء",
                "الميكانيك",
                "المدني",
                "المعمار",
                "الجسر",
                "الطريق",
                "النفط",
                "الطاقة",
            ],
            "english_terms": [
                "engineering",
                "engineer",
                "design",
                "construction",
                "building",
                "project",
                "plan",
                "computer",
                "programming",
                "network",
                "electrical",
                "mechanical",
                "civil",
                "architecture",
                "bridge",
                "road",
                "oil",
                "energy",
            ],
        },
    }

    return terminology.get(profession, {"arabic_terms": [], "english_terms": []})


####################
# Iraqi Business Hours and Cultural Time
####################


def get_iraqi_business_hours() -> Dict[str, Any]:
    """
    Get Iraqi business hours and cultural time considerations
    """
    baghdad_tz = pytz.timezone("Asia/Baghdad")
    current_time = datetime.datetime.now(baghdad_tz)

    # Standard Iraqi business hours
    business_hours = {
        "sunday": {"start": "08:00", "end": "16:00"},  # Sunday is first workday
        "monday": {"start": "08:00", "end": "16:00"},
        "tuesday": {"start": "08:00", "end": "16:00"},
        "wednesday": {"start": "08:00", "end": "16:00"},
        "thursday": {"start": "08:00", "end": "14:00"},  # Shortened Thursday
        "friday": {"closed": True},  # Friday is holy day
        "saturday": {"closed": True},  # Weekend
    }

    # Prayer times (approximate for Baghdad)
    prayer_times = {
        "fajr": "05:30",
        "dhuhr": "12:00",
        "asr": "15:30",
        "maghrib": "18:00",
        "isha": "19:30",
    }

    # Ramadan adjustments
    is_ramadan = is_ramadan_period(current_time)
    if is_ramadan:
        # Shortened work hours during Ramadan
        for day in ["sunday", "monday", "tuesday", "wednesday"]:
            if day in business_hours:
                business_hours[day]["end"] = "14:00"
        business_hours["thursday"]["end"] = "12:00"

    # Current status
    day_name = current_time.strftime("%A").lower()
    current_hour = current_time.hour
    is_business_day = day_name not in ["friday", "saturday"]

    is_business_hours = False
    if is_business_day and day_name in business_hours:
        day_schedule = business_hours[day_name]
        if "closed" not in day_schedule:
            start_hour = int(day_schedule["start"].split(":")[0])
            end_hour = int(day_schedule["end"].split(":")[0])
            is_business_hours = start_hour <= current_hour < end_hour

    return {
        "current_time": current_time.isoformat(),
        "timezone": "Asia/Baghdad",
        "is_business_hours": is_business_hours,
        "is_business_day": is_business_day,
        "business_schedule": business_hours,
        "prayer_times": prayer_times,
        "is_ramadan": is_ramadan,
        "cultural_notes": {
            "friday_holy_day": "الجمعة يوم مقدس",
            "prayer_breaks": "فترات الصلاة",
            "ramadan_hours": "ساعات رمضان المخفضة" if is_ramadan else None,
        },
    }


def is_ramadan_period(current_date: datetime.datetime) -> bool:
    """
    Check if current date is during Ramadan (simplified calculation)
    """
    # This is a simplified check - in production, use proper Islamic calendar
    # Ramadan dates change each year based on lunar calendar

    # 2024 Ramadan dates (approximate)
    ramadan_start = datetime.date(2024, 3, 11)
    ramadan_end = datetime.date(2024, 4, 9)

    current_date = current_date.date()
    return ramadan_start <= current_date <= ramadan_end


def get_islamic_calendar_date(gregorian_date: datetime.date) -> Dict[str, Any]:
    """
    Convert Gregorian date to Islamic calendar (Hijri)
    Simplified conversion - in production, use proper Islamic calendar library
    """
    # This is a placeholder - implement proper Hijri calendar conversion
    # Using libraries like hijri-converter or python-hijri

    return {
        "gregorian": gregorian_date.isoformat(),
        "hijri_year": 1445,  # Placeholder
        "hijri_month": "رجب",  # Placeholder month name
        "hijri_day": 15,  # Placeholder day
        "month_arabic": "رجب",
        "season": "spring",
    }


####################
# Iraqi Payment and Currency
####################


def format_iraqi_currency(amount: float, currency: str = "IQD") -> str:
    """
    Format currency according to Iraqi conventions
    """
    if currency == "IQD":
        # Iraqi Dinar formatting
        formatted = f"{amount:,.0f}"
        return f"{formatted} دينار عراقي"
    elif currency == "USD":
        formatted = f"${amount:,.2f}"
        return f"{formatted} دولار أمريكي"
    else:
        return f"{amount:,.2f} {currency}"


def validate_iraqi_payment_method(method: str, amount: float) -> Dict[str, Any]:
    """
    Validate Iraqi payment method and amount
    """
    payment_limits = {
        "zaincash": {"min": 1000, "max": 5000000, "currency": "IQD"},
        "fastpay": {"min": 500, "max": 2000000, "currency": "IQD"},
        "nasswallet": {"min": 1000, "max": 1000000, "currency": "IQD"},
        "credit_card": {"min": 10, "max": 10000, "currency": "USD"},
    }

    if method not in payment_limits:
        return {
            "valid": False,
            "error": f"طريقة دفع غير مدعومة: {method}",
            "supported_methods": list(payment_limits.keys()),
        }

    limits = payment_limits[method]
    currency = limits["currency"]

    if amount < limits["min"]:
        return {
            "valid": False,
            "error": f"المبلغ أقل من الحد الأدنى: {format_iraqi_currency(limits['min'], currency)}",
            "min_amount": limits["min"],
            "currency": currency,
        }

    if amount > limits["max"]:
        return {
            "valid": False,
            "error": f"المبلغ أكبر من الحد الأقصى: {format_iraqi_currency(limits['max'], currency)}",
            "max_amount": limits["max"],
            "currency": currency,
        }

    return {
        "valid": True,
        "method": method,
        "amount": amount,
        "currency": currency,
        "formatted_amount": format_iraqi_currency(amount, currency),
    }


####################
# Iraqi Regional Helpers
####################


def get_region_info(region: IraqiRegion) -> Dict[str, Any]:
    """
    Get information about specific Iraqi region
    """
    return IRAQI_REGION_INFO.get(region, {})


def detect_region_from_phone(phone: str) -> Optional[IraqiRegion]:
    """
    Detect Iraqi region from phone number area code
    """
    if not phone.startswith("+964"):
        return None

    # Remove country code
    local_number = phone[4:]

    # Area code mapping (simplified)
    area_codes = {
        "7700": IraqiRegion.BAGHDAD,
        "7701": IraqiRegion.BAGHDAD,
        "7702": IraqiRegion.BASRA,
        "7703": IraqiRegion.ERBIL,
        "7704": IraqiRegion.NAJAF,
        "7705": IraqiRegion.KARBALA,
        "7706": IraqiRegion.MOSUL,
        "7707": IraqiRegion.KIRKUK,
    }

    for prefix, region in area_codes.items():
        if local_number.startswith(prefix[:4]):
            return region

    # Default to Baghdad if unknown
    return IraqiRegion.BAGHDAD


####################
# Text Processing Utilities
####################


def clean_arabic_text(text: str) -> str:
    """
    Clean and normalize Arabic text
    """
    if not text:
        return ""

    # Remove extra whitespace
    text = re.sub(r"\s+", " ", text).strip()

    # Normalize Arabic characters
    normalizations = {
        "أ": "ا",
        "إ": "ا",
        "آ": "ا",  # Alif variations
        "ة": "ه",  # Taa marboota to haa
        "ى": "ي",  # Alif maksura to yaa
    }

    for original, normalized in normalizations.items():
        text = text.replace(original, normalized)

    return text


def extract_arabic_keywords(text: str) -> List[str]:
    """
    Extract Arabic keywords from text
    """
    if not text:
        return []

    # Remove punctuation and split into words
    cleaned_text = re.sub(r"[^\u0600-\u06FF\s]", " ", text)
    words = cleaned_text.split()

    # Filter out short words and common stop words
    stop_words = {
        "في",
        "من",
        "إلى",
        "على",
        "عن",
        "مع",
        "هذا",
        "هذه",
        "ذلك",
        "تلك",
        "هو",
        "هي",
        "أن",
        "أو",
        "لا",
        "نعم",
        "كان",
        "كانت",
        "يكون",
        "تكون",
    }

    keywords = [word for word in words if len(word) > 2 and word not in stop_words]

    return list(set(keywords))  # Remove duplicates


####################
# Export
####################

__all__ = [
    "IraqiRegion",
    "format_arabic_name",
    "detect_iraqi_dialect",
    "convert_to_iraqi_dialect",
    "validate_professional_domain",
    "get_professional_terminology",
    "get_iraqi_business_hours",
    "is_ramadan_period",
    "get_islamic_calendar_date",
    "format_iraqi_currency",
    "validate_iraqi_payment_method",
    "get_region_info",
    "detect_region_from_phone",
    "clean_arabic_text",
    "extract_arabic_keywords",
]
