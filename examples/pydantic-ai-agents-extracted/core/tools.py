"""
Iraqi AI Chat System - Agent Tools with Cultural Intelligence
Comprehensive tool functions for Iraqi AI agents with cultural validation
"""

from typing import Union, Optional, Dict, Any, List, Callable, Awaitable
from dataclasses import dataclass
from datetime import datetime, timezone
from enum import Enum
import asyncio
import json
import re
from abc import ABC, abstractmethod

try:
    from pydantic_ai import tool
    from pydantic_ai.tools import Tool
except ImportError as e:
    # Graceful handling for development environment
    tool = lambda func: func  # Simple decorator fallback
    Tool = None
    print(f"PydanticAI tools not available: {e}")

from .settings import settings


class IraqiToolCategory(str, Enum):
    """Categories for Iraqi AI tools"""

    CULTURAL_VALIDATION = "cultural_validation"
    ARABIC_PROCESSING = "arabic_processing"
    ISLAMIC_COMPLIANCE = "islamic_compliance"
    PROFESSIONAL_DOMAIN = "professional_domain"
    PAYMENT_GATEWAY = "payment_gateway"
    COMMUNICATION = "communication"
    ANALYSIS = "analysis"
    SECURITY = "security"


@dataclass
class IraqiToolContext:
    """Context for Iraqi tool execution"""

    user_id: Optional[str] = None
    cultural_background: str = "iraqi"
    primary_language: str = "arabic"
    professional_domain: Optional[str] = None
    islamic_compliance_required: bool = True
    security_level: str = "high"

    def to_dict(self) -> Dict[str, Any]:
        return {
            "user_id": self.user_id,
            "cultural_background": self.cultural_background,
            "language": self.primary_language,
            "domain": self.professional_domain,
            "islamic_compliance": self.islamic_compliance_required,
            "security_level": self.security_level,
        }


@dataclass
class IraqiToolResult:
    """Result from Iraqi tool execution"""

    success: bool
    data: Any = None
    cultural_validation_score: float = 0.0
    islamic_compliance_score: float = 0.0
    processing_time: float = 0.0
    warnings: List[str] = None
    errors: List[str] = None
    metadata: Dict[str, Any] = None

    def __post_init__(self):
        if self.warnings is None:
            self.warnings = []
        if self.errors is None:
            self.errors = []
        if self.metadata is None:
            self.metadata = {}


class IraqiToolValidator:
    """Validator for Iraqi tool inputs and outputs"""

    @staticmethod
    async def validate_arabic_text(text: str) -> Dict[str, Any]:
        """Validate Arabic text for Iraqi dialect and RTL requirements"""
        # Check if text contains Arabic characters
        arabic_chars = sum(1 for char in text if "\u0600" <= char <= "\u06ff")
        total_chars = len([c for c in text if c.isalpha()])

        arabic_ratio = arabic_chars / max(1, total_chars)

        # Iraqi dialect indicators (simplified)
        iraqi_indicators = [
            "شلونك",
            "شكو ماكو",
            "وين",
            "شنو",
            "هسة",
            "يالله",
            "ماشي الحال",
        ]

        dialect_score = sum(
            1 for indicator in iraqi_indicators if indicator in text
        ) / len(iraqi_indicators)

        return {
            "has_arabic": arabic_ratio > 0,
            "arabic_ratio": arabic_ratio,
            "dialect_score": dialect_score,
            "is_rtl_compliant": arabic_ratio > 0.5,
            "character_count": len(text),
            "word_count": len(text.split()),
        }

    @staticmethod
    async def validate_islamic_compliance(
        content: str, context: IraqiToolContext
    ) -> float:
        """Validate content for Islamic compliance"""
        if not context.islamic_compliance_required:
            return 1.0

        # Islamic principles checks (simplified - would use AI in production)
        positive_indicators = [
            "respect",
            "family",
            "community",
            "charity",
            "knowledge",
            "justice",
            "peace",
            "wisdom",
            "kindness",
            "honesty",
        ]

        negative_indicators = [
            "gambling",
            "alcohol",
            "interest",
            "riba",
            "inappropriate",
            "disrespectful",
            "harmful",
        ]

        content_lower = content.lower()
        positive_score = sum(1 for term in positive_indicators if term in content_lower)
        negative_score = sum(1 for term in negative_indicators if term in content_lower)

        # Calculate compliance (0.0-1.0)
        compliance = min(
            1.0, max(0.1, 0.8 + (positive_score * 0.05) - (negative_score * 0.3))
        )

        return compliance

    @staticmethod
    async def validate_professional_context(
        content: str, domain: Optional[str]
    ) -> float:
        """Validate content for professional domain appropriateness"""
        if not domain or domain not in settings.enabled_domains:
            return 1.0

        # Domain-specific keywords (simplified)
        domain_keywords = {
            "legal": [
                "law",
                "legal",
                "court",
                "judge",
                "lawyer",
                "قانون",
                "محكمة",
                "قاضي",
            ],
            "medical": [
                "health",
                "medical",
                "doctor",
                "patient",
                "صحة",
                "طبيب",
                "مريض",
            ],
            "educational": [
                "education",
                "student",
                "teacher",
                "school",
                "تعليم",
                "طالب",
                "معلم",
            ],
            "business": [
                "business",
                "company",
                "profit",
                "trade",
                "تجارة",
                "شركة",
                "ربح",
            ],
        }

        if domain in domain_keywords:
            keywords = domain_keywords[domain]
            content_lower = content.lower()
            matches = sum(1 for keyword in keywords if keyword in content_lower)
            relevance = min(1.0, matches / max(1, len(keywords) * 0.3))
            return max(0.5, relevance)  # Minimum 50% relevance

        return 1.0


# Core Iraqi AI Tools


@tool
async def validate_cultural_content(
    content: str, context: IraqiToolContext
) -> IraqiToolResult:
    """
    Validate content for Iraqi cultural appropriateness and Islamic compliance

    Args:
        content: Text content to validate
        context: Iraqi cultural context

    Returns:
        IraqiToolResult with validation scores and recommendations
    """
    import time

    start_time = time.time()

    try:
        # Arabic text validation
        arabic_validation = await IraqiToolValidator.validate_arabic_text(content)

        # Islamic compliance validation
        islamic_score = await IraqiToolValidator.validate_islamic_compliance(
            content, context
        )

        # Professional domain validation
        professional_score = await IraqiToolValidator.validate_professional_context(
            content, context.professional_domain
        )

        # Overall cultural appropriateness (weighted combination)
        cultural_score = (
            0.4 * islamic_score
            + 0.3 * professional_score
            + 0.2 * arabic_validation.get("dialect_score", 0.0)
            + 0.1 * (1.0 if arabic_validation["has_arabic"] else 0.8)
        )

        processing_time = time.time() - start_time

        warnings = []
        if islamic_score < 0.9:
            warnings.append("Content may need Islamic compliance review")
        if (
            arabic_validation["arabic_ratio"] < 0.3
            and context.primary_language == "arabic"
        ):
            warnings.append("Consider adding more Arabic content for Iraqi users")

        success = cultural_score >= settings.min_cultural_appropriateness

        return IraqiToolResult(
            success=success,
            data={
                "cultural_appropriateness": cultural_score,
                "islamic_compliance": islamic_score,
                "professional_relevance": professional_score,
                "arabic_analysis": arabic_validation,
                "recommendations": [
                    "Use respectful Iraqi cultural expressions",
                    "Include Islamic greetings when appropriate",
                    "Consider Arabic language support",
                ]
                if not success
                else [],
            },
            cultural_validation_score=cultural_score,
            islamic_compliance_score=islamic_score,
            processing_time=processing_time,
            warnings=warnings,
            metadata={"validator_version": "1.0.0", "context": context.to_dict()},
        )

    except Exception as e:
        return IraqiToolResult(
            success=False,
            errors=[f"Cultural validation failed: {str(e)}"],
            processing_time=time.time() - start_time,
        )


@tool
async def process_arabic_text(
    text: str, operation: str = "analyze", context: IraqiToolContext = None
) -> IraqiToolResult:
    """
    Process Arabic text with RTL support and Iraqi dialect recognition

    Args:
        text: Arabic text to process
        operation: Type of processing (analyze, normalize, extract_entities)
        context: Iraqi processing context

    Returns:
        IraqiToolResult with processed Arabic text data
    """
    import time

    start_time = time.time()

    if context is None:
        context = IraqiToolContext()

    try:
        # Arabic text analysis
        arabic_validation = await IraqiToolValidator.validate_arabic_text(text)

        # RTL text processing (simplified)
        processed_data = {
            "original_text": text,
            "text_direction": "rtl"
            if arabic_validation["arabic_ratio"] > 0.5
            else "ltr",
            "language_detected": "arabic"
            if arabic_validation["has_arabic"]
            else "mixed",
            "dialect_indicators": [],
            "normalized_text": text,  # Would apply normalization rules
            "word_count": arabic_validation["word_count"],
            "character_count": arabic_validation["character_count"],
        }

        if operation == "analyze":
            # Iraqi dialect analysis (simplified)
            iraqi_phrases = {
                "شلونك": "How are you (Iraqi)",
                "شكو ماكو": "What's up (Iraqi)",
                "وين": "Where (Iraqi)",
                "شنو": "What (Iraqi)",
                "هسة": "Now (Iraqi)",
                "ماشي الحال": "That's fine (Iraqi)",
            }

            found_phrases = []
            for phrase, meaning in iraqi_phrases.items():
                if phrase in text:
                    found_phrases.append({"phrase": phrase, "meaning": meaning})

            processed_data["dialect_indicators"] = found_phrases
            processed_data["dialect_confidence"] = len(found_phrases) / len(
                iraqi_phrases
            )

        elif operation == "normalize":
            # Text normalization (simplified)
            # Would apply Arabic text normalization rules
            processed_data["normalized_text"] = text.replace("أ", "ا").replace("إ", "ا")

        elif operation == "extract_entities":
            # Named entity recognition (simplified)
            # Would use NLP for actual entity extraction
            entities = []
            # Simple pattern matching for demonstration
            name_patterns = [r"\b[A-Za-z]{2,}\b", r"\b[\u0600-\u06FF]{2,}\b"]
            for pattern in name_patterns:
                matches = re.findall(pattern, text)
                entities.extend(
                    [
                        {"text": match, "type": "PERSON", "confidence": 0.8}
                        for match in matches[:5]
                    ]
                )  # Limit results

            processed_data["entities"] = entities

        processing_time = time.time() - start_time

        # Accuracy assessment
        accuracy_score = min(1.0, arabic_validation["arabic_ratio"] + 0.2)

        return IraqiToolResult(
            success=True,
            data=processed_data,
            cultural_validation_score=0.95,  # High for Arabic processing
            processing_time=processing_time,
            metadata={
                "operation": operation,
                "accuracy_score": accuracy_score,
                "rtl_compliant": processed_data["text_direction"] == "rtl",
            },
        )

    except Exception as e:
        return IraqiToolResult(
            success=False,
            errors=[f"Arabic processing failed: {str(e)}"],
            processing_time=time.time() - start_time,
        )


@tool
async def check_prayer_times(
    location: str = "Baghdad",
    date: Optional[str] = None,
    context: IraqiToolContext = None,
) -> IraqiToolResult:
    """
    Get Islamic prayer times for Iraqi locations

    Args:
        location: Iraqi city (Baghdad, Basra, Erbil, etc.)
        date: Date in YYYY-MM-DD format (defaults to today)
        context: Iraqi context

    Returns:
        IraqiToolResult with prayer times data
    """
    import time

    start_time = time.time()

    if context is None:
        context = IraqiToolContext()

    try:
        if not context.islamic_compliance_required:
            return IraqiToolResult(
                success=True,
                data={"message": "Prayer times not required in current context"},
                islamic_compliance_score=1.0,
                processing_time=time.time() - start_time,
            )

        # Simplified prayer times (would integrate with actual prayer times API)
        current_date = date or datetime.now().strftime("%Y-%m-%d")

        # Default prayer times for Baghdad (would be dynamic based on date/location)
        prayer_times = {
            "location": location,
            "date": current_date,
            "prayers": {
                "fajr": "05:30",
                "sunrise": "06:45",
                "dhuhr": "12:15",
                "asr": "15:30",
                "maghrib": "18:45",
                "isha": "20:00",
            },
            "next_prayer": "dhuhr",
            "time_to_next": "2:30:00",
        }

        # Check if it's currently prayer time
        current_hour = datetime.now().hour
        is_prayer_time = current_hour in [5, 12, 15, 18, 20]  # Simplified check

        processing_time = time.time() - start_time

        warnings = []
        if is_prayer_time:
            warnings.append(
                "Current time may be during prayer. Consider Islamic observance."
            )

        return IraqiToolResult(
            success=True,
            data={
                **prayer_times,
                "is_prayer_time": is_prayer_time,
                "islamic_calendar_info": {
                    "hijri_date": "1446-06-15",  # Would be calculated
                    "islamic_occasion": None,
                },
            },
            cultural_validation_score=1.0,
            islamic_compliance_score=1.0,
            processing_time=processing_time,
            warnings=warnings,
            metadata={"source": "simplified_calculation", "timezone": "Asia/Baghdad"},
        )

    except Exception as e:
        return IraqiToolResult(
            success=False,
            errors=[f"Prayer times lookup failed: {str(e)}"],
            processing_time=time.time() - start_time,
        )


@tool
async def validate_payment_request(
    amount: float,
    currency: str = "IQD",
    gateway: str = "zaincash",
    context: IraqiToolContext = None,
) -> IraqiToolResult:
    """
    Validate payment request for Iraqi payment gateways with Islamic compliance

    Args:
        amount: Payment amount
        currency: Currency code (IQD, USD)
        gateway: Payment gateway (zaincash, fastpay, nasswallet)
        context: Iraqi context

    Returns:
        IraqiToolResult with payment validation data
    """
    import time

    start_time = time.time()

    if context is None:
        context = IraqiToolContext()

    try:
        # Get gateway configuration
        gateway_config = settings.payment_gateways.get(gateway)
        if not gateway_config:
            return IraqiToolResult(
                success=False,
                errors=[f"Unsupported payment gateway: {gateway}"],
                processing_time=time.time() - start_time,
            )

        # Validate gateway is enabled
        if not gateway_config.get("enabled", False):
            return IraqiToolResult(
                success=False,
                errors=[f"Payment gateway {gateway} is currently disabled"],
                processing_time=time.time() - start_time,
            )

        # Validate minimum amount
        min_amount = gateway_config.get("min_amount", 0)
        if amount < min_amount:
            return IraqiToolResult(
                success=False,
                errors=[
                    f"Amount {amount} {currency} is below minimum {min_amount} {currency}"
                ],
                processing_time=time.time() - start_time,
            )

        # Islamic compliance check for financial transactions
        islamic_compliance = 1.0  # Default compliant
        warnings = []

        if gateway_config.get("cultural_validation", False):
            # Check for Islamic finance compliance
            if (
                currency == "USD" and amount > 10000
            ):  # Large foreign currency transactions
                warnings.append(
                    "Large foreign currency transaction - ensure halal source"
                )

            # Riba (interest) check - would be more sophisticated in production
            if "interest" in str(
                context.metadata if hasattr(context, "metadata") else {}
            ):
                islamic_compliance = 0.0
                return IraqiToolResult(
                    success=False,
                    errors=["Transaction involves riba (interest) - not permitted"],
                    islamic_compliance_score=islamic_compliance,
                    processing_time=time.time() - start_time,
                )

        processing_time = time.time() - start_time

        validation_data = {
            "amount": amount,
            "currency": currency,
            "gateway": gateway,
            "gateway_config": {
                "enabled": gateway_config["enabled"],
                "min_amount": min_amount,
                "supported_currency": gateway_config.get("currency", "IQD"),
            },
            "islamic_compliant": islamic_compliance >= 1.0,
            "estimated_fee": amount * 0.025,  # 2.5% typical fee
            "processing_time_estimate": "1-3 minutes",
        }

        return IraqiToolResult(
            success=True,
            data=validation_data,
            cultural_validation_score=0.98,
            islamic_compliance_score=islamic_compliance,
            processing_time=processing_time,
            warnings=warnings,
            metadata={
                "gateway_version": "1.0.0",
                "validation_timestamp": datetime.now(timezone.utc).isoformat(),
            },
        )

    except Exception as e:
        return IraqiToolResult(
            success=False,
            errors=[f"Payment validation failed: {str(e)}"],
            processing_time=time.time() - start_time,
        )


@tool
async def get_professional_guidance(
    domain: str, question: str, context: IraqiToolContext = None
) -> IraqiToolResult:
    """
    Provide professional domain guidance with Iraqi cultural context

    Args:
        domain: Professional domain (legal, medical, educational, etc.)
        question: Professional question or guidance request
        context: Iraqi professional context

    Returns:
        IraqiToolResult with professional guidance
    """
    import time

    start_time = time.time()

    if context is None:
        context = IraqiToolContext()

    try:
        # Validate domain
        if domain not in settings.enabled_domains:
            return IraqiToolResult(
                success=False,
                errors=[f"Professional domain '{domain}' is not supported"],
                processing_time=time.time() - start_time,
            )

        # Cultural compliance check
        cultural_score = await IraqiToolValidator.validate_professional_context(
            question, domain
        )
        islamic_score = await IraqiToolValidator.validate_islamic_compliance(
            question, context
        )

        # Domain-specific guidance (simplified)
        guidance_templates = {
            "legal": {
                "response": f"في القانون العراقي، يُنصح بـ... // In Iraqi law, it is recommended to...",
                "disclaimer": "This is general guidance. Consult a qualified Iraqi lawyer for specific legal advice.",
                "cultural_notes": "Ensure compliance with Iraqi civil law and Islamic Sharia principles.",
            },
            "medical": {
                "response": f"من الناحية الطبية في العراق، يُفضل... // From a medical perspective in Iraq, it is preferred to...",
                "disclaimer": "This is general information. Consult a licensed Iraqi medical professional.",
                "cultural_notes": "Consider Islamic medical ethics and Iraqi healthcare system context.",
            },
            "educational": {
                "response": f"في النظام التعليمي العراقي، يُقترح... // In the Iraqi educational system, it is suggested to...",
                "disclaimer": "This is general educational guidance for Iraqi context.",
                "cultural_notes": "Align with Iraqi Ministry of Education standards and Islamic educational values.",
            },
        }

        template = guidance_templates.get(
            domain,
            {
                "response": "Professional guidance is being developed for this domain.",
                "disclaimer": "Consult with qualified Iraqi professionals in this field.",
                "cultural_notes": "Ensure cultural and Islamic compliance in professional practice.",
            },
        )

        processing_time = time.time() - start_time

        # Professional relevance scoring
        relevance_score = cultural_score

        warnings = []
        if islamic_score < 0.9:
            warnings.append("Professional guidance may need Islamic compliance review")

        return IraqiToolResult(
            success=True,
            data={
                "domain": domain,
                "guidance": template["response"],
                "disclaimer": template["disclaimer"],
                "cultural_notes": template["cultural_notes"],
                "professional_relevance": relevance_score,
                "recommended_next_steps": [
                    f"Consult with qualified {domain} professionals in Iraq",
                    "Verify compliance with Iraqi regulations",
                    "Consider cultural and Islamic requirements",
                ],
            },
            cultural_validation_score=cultural_score,
            islamic_compliance_score=islamic_score,
            processing_time=processing_time,
            warnings=warnings,
            metadata={
                "domain": domain,
                "guidance_version": "1.0.0",
                "cultural_context": context.to_dict(),
            },
        )

    except Exception as e:
        return IraqiToolResult(
            success=False,
            errors=[f"Professional guidance failed: {str(e)}"],
            processing_time=time.time() - start_time,
        )


# Tool registry for easy access
IRAQI_TOOLS = {
    "validate_cultural_content": validate_cultural_content,
    "process_arabic_text": process_arabic_text,
    "check_prayer_times": check_prayer_times,
    "validate_payment_request": validate_payment_request,
    "get_professional_guidance": get_professional_guidance,
}


def get_tool_by_name(tool_name: str) -> Optional[Callable]:
    """Get tool function by name"""
    return IRAQI_TOOLS.get(tool_name)


def get_available_tools() -> List[str]:
    """Get list of available Iraqi AI tools"""
    return list(IRAQI_TOOLS.keys())


def get_tools_by_category(category: IraqiToolCategory) -> List[str]:
    """Get tools filtered by category"""
    category_mapping = {
        IraqiToolCategory.CULTURAL_VALIDATION: ["validate_cultural_content"],
        IraqiToolCategory.ARABIC_PROCESSING: ["process_arabic_text"],
        IraqiToolCategory.ISLAMIC_COMPLIANCE: ["check_prayer_times"],
        IraqiToolCategory.PAYMENT_GATEWAY: ["validate_payment_request"],
        IraqiToolCategory.PROFESSIONAL_DOMAIN: ["get_professional_guidance"],
    }

    return category_mapping.get(category, [])
