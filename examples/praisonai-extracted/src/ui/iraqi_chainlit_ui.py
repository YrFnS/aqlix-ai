"""
Iraqi AI Chat System - Enhanced Chainlit UI
============================================

Multi-agent interface with Arabic RTL support, Iraqi cultural context,
and professional domain specialization for Iraqi AI agents.

Features:
- Arabic RTL text rendering and input
- Iraqi dialect recognition and processing
- Islamic compliance validation
- Cultural appropriateness checking
- Professional domain agent selection
- Multi-agent coordination dashboard
- Real-time Arabic translation
"""

import chainlit as cl
import asyncio
import os
import json
import yaml
from typing import Dict, Any, List, Optional
from pathlib import Path

# Iraqi AI Chat System imports
from ..agents_generator import IraqiAgentGenerator
from ..iraqi_context import IraqiCulturalContext, IslamicComplianceValidator
from ..arabic_processor import ArabicRTLProcessor, IraqiDialectProcessor

# Initialize Iraqi AI components
cultural_context = IraqiCulturalContext()
compliance_validator = IslamicComplianceValidator()
arabic_processor = ArabicRTLProcessor()
dialect_processor = IraqiDialectProcessor()

# Configuration
AVAILABLE_DOMAINS = [
    "legal",
    "medical",
    "educational",
    "government",
    "business",
    "engineering",
]
SUPPORTED_LANGUAGES = ["arabic", "english", "mixed"]


@cl.set_chat_profiles
async def chat_profile():
    """Set up chat profiles for different Iraqi professional domains."""
    return [
        cl.ChatProfile(
            name="iraqi_auto",
            markdown_description="🇮🇶 **Iraqi Professional Auto**: Automatically generates specialized Iraqi agents based on your professional domain needs with Islamic compliance.",
            icon="https://flagcdn.com/iq.svg",
        ),
        cl.ChatProfile(
            name="iraqi_legal",
            markdown_description="⚖️ **Iraqi Legal System**: Specialized agents for Iraqi Civil Code, Sharia compliance, and legal procedures.",
            icon="⚖️",
        ),
        cl.ChatProfile(
            name="iraqi_medical",
            markdown_description="🏥 **Iraqi Healthcare**: Medical consultation with Islamic medical ethics and Iraqi healthcare system navigation.",
            icon="🏥",
        ),
        cl.ChatProfile(
            name="iraqi_educational",
            markdown_description="📚 **Iraqi Education**: Curriculum guidance, Arabic language tutoring, and Islamic studies support.",
            icon="📚",
        ),
        cl.ChatProfile(
            name="iraqi_government",
            markdown_description="🏛️ **Iraqi Government Services**: Citizen services, document processing, and ministry procedures.",
            icon="🏛️",
        ),
        cl.ChatProfile(
            name="iraqi_business",
            markdown_description="💼 **Iraqi Business**: Market analysis, Islamic finance, and business consulting for Iraqi market.",
            icon="💼",
        ),
        cl.ChatProfile(
            name="iraqi_engineering",
            markdown_description="🏗️ **Iraqi Engineering**: Building codes, technical standards, and project management in Iraqi context.",
            icon="🏗️",
        ),
        cl.ChatProfile(
            name="multi_agent_team",
            markdown_description="👥 **Multi-Agent Team**: Coordinate multiple Iraqi professional agents for complex tasks.",
            icon="👥",
        ),
    ]


@cl.on_chat_start
async def start_chat():
    """Initialize chat session with Iraqi AI context."""
    profile = cl.user_session.get("chat_profile")

    # Display welcome message in Arabic and English
    welcome_message = await create_bilingual_welcome(profile)
    await cl.Message(content=welcome_message).send()

    # Initialize agent generator for selected profile
    if profile and profile != "multi_agent_team":
        domain = profile.replace("iraqi_", "")
        if domain == "auto":
            # Auto mode - will determine domain based on user input
            cl.user_session.set("mode", "auto")
            cl.user_session.set("agent_generator", IraqiAgentGenerator())
        else:
            # Specific domain mode
            cl.user_session.set("mode", "domain_specific")
            cl.user_session.set("domain", domain)
            cl.user_session.set("agent_generator", IraqiAgentGenerator())
    else:
        # Multi-agent team mode
        cl.user_session.set("mode", "multi_agent")
        cl.user_session.set("agent_generator", IraqiAgentGenerator())

    # Set up language preferences
    await setup_language_preferences()


async def create_bilingual_welcome(profile: str) -> str:
    """Create welcome message in Arabic and English."""

    welcome_messages = {
        "iraqi_auto": {
            "arabic": "أهلاً وسهلاً! أنا مساعدك الذكي المتخصص في الخدمات المهنية العراقية. كيف يمكنني مساعدتك اليوم؟",
            "english": "Welcome! I'm your Iraqi Professional AI Assistant. How can I help you today?",
        },
        "iraqi_legal": {
            "arabic": "مرحباً بك في نظام الاستشارات القانونية العراقية. نقدم المشورة وفقاً للقانون العراقي والشريعة الإسلامية.",
            "english": "Welcome to the Iraqi Legal Consultation System. We provide advice according to Iraqi law and Islamic jurisprudence.",
        },
        "iraqi_medical": {
            "arabic": "أهلاً بك في نظام الاستشارات الطبية العراقية. نقدم الإرشاد الطبي وفقاً لأخلاقيات الطب الإسلامي.",
            "english": "Welcome to the Iraqi Medical Consultation System. We provide medical guidance according to Islamic medical ethics.",
        },
        "iraqi_educational": {
            "arabic": "مرحباً بك في النظام التعليمي العراقي الذكي. نساعدك في المناهج العراقية واللغة العربية والدراسات الإسلامية.",
            "english": "Welcome to the Iraqi Educational AI System. We help with Iraqi curriculum, Arabic language, and Islamic studies.",
        },
        "iraqi_government": {
            "arabic": "أهلاً بك في نظام الخدمات الحكومية العراقية الذكي. نساعدك في إجراءات الوزارات والخدمات المدنية.",
            "english": "Welcome to the Iraqi Government Services AI System. We help with ministry procedures and citizen services.",
        },
        "iraqi_business": {
            "arabic": "مرحباً بك في نظام الاستشارات التجارية العراقية. نقدم المشورة في الأعمال والتمويل الإسلامي.",
            "english": "Welcome to the Iraqi Business Consultation System. We provide advice on business and Islamic finance.",
        },
        "iraqi_engineering": {
            "arabic": "أهلاً بك في نظام الاستشارات الهندسية العراقية. نساعدك في المعايير الفنية وإدارة المشاريع.",
            "english": "Welcome to the Iraqi Engineering Consultation System. We help with technical standards and project management.",
        },
    }

    messages = welcome_messages.get(profile, welcome_messages["iraqi_auto"])

    return f"""
# {messages["arabic"]}
{messages["english"]}

---

**Available Languages | اللغات المتاحة:**
- 🇮🇶 العربية العراقية (Iraqi Arabic)
- 🇸🇦 العربية الفصحى (Formal Arabic) 
- 🇺🇸 English
- 🔄 Mixed (Arabic + English)

**Features | الميزات:**
- ✅ Islamic Compliance | التوافق مع الشريعة الإسلامية
- 🎯 Cultural Appropriateness | الملائمة الثقافية
- 📝 RTL Text Support | دعم النصوص من اليمين لليسار
- 🇮🇶 Iraqi Context | السياق العراقي
"""


async def setup_language_preferences():
    """Setup language and cultural preferences."""
    settings = await cl.ChatSettings(
        [
            cl.input_widget.Select(
                id="language",
                label="Preferred Language | اللغة المفضلة",
                values=["arabic", "english", "mixed"],
                initial_index=0,
            ),
            cl.input_widget.Select(
                id="arabic_variant",
                label="Arabic Variant | نوع العربية",
                values=["iraqi_arabic", "formal_arabic", "gulf_arabic"],
                initial_index=0,
            ),
            cl.input_widget.Switch(
                id="islamic_compliance",
                label="Islamic Compliance | التوافق الإسلامي",
                initial=True,
            ),
            cl.input_widget.Switch(
                id="cultural_validation",
                label="Cultural Validation | التحقق الثقافي",
                initial=True,
            ),
            cl.input_widget.Select(
                id="formality_level",
                label="Formality Level | مستوى الرسمية",
                values=["formal", "professional", "casual"],
                initial_index=1,
            ),
        ]
    ).send()

    cl.user_session.set("language_settings", settings)


@cl.on_settings_update
async def setup_agent(settings):
    """Update agent configuration based on settings."""
    cl.user_session.set("language_settings", settings)

    # Update Arabic processor settings
    if settings.get("language") == "arabic":
        arabic_processor.set_variant(settings.get("arabic_variant", "iraqi_arabic"))

    await cl.Message(
        content=f"⚙️ Settings updated | تم تحديث الإعدادات\n\n"
        f"Language: {settings.get('language', 'arabic')}\n"
        f"Arabic Variant: {settings.get('arabic_variant', 'iraqi_arabic')}\n"
        f"Islamic Compliance: {'✅' if settings.get('islamic_compliance') else '❌'}\n"
        f"Cultural Validation: {'✅' if settings.get('cultural_validation') else '❌'}"
    ).send()


@cl.on_message
async def main(message: cl.Message):
    """Process user message through Iraqi AI agents."""

    # Get session data
    mode = cl.user_session.get("mode")
    agent_generator = cl.user_session.get("agent_generator")
    settings = cl.user_session.get("language_settings", {})

    # Process Arabic text if needed
    user_input = message.content
    processed_input = await process_user_input(user_input, settings)

    # Validate Islamic compliance if enabled
    if settings.get("islamic_compliance", True):
        compliance_result = compliance_validator.validate_content(processed_input)
        if not compliance_result["compliant"]:
            await send_compliance_warning(compliance_result)
            return

    # Validate cultural appropriateness if enabled
    if settings.get("cultural_validation", True):
        cultural_result = cultural_context.validate_cultural_appropriateness(
            processed_input
        )
        if not cultural_result["appropriate"]:
            await send_cultural_warning(cultural_result)
            return

    # Process based on mode
    if mode == "auto":
        await handle_auto_mode(processed_input, settings)
    elif mode == "domain_specific":
        await handle_domain_specific_mode(processed_input, settings)
    elif mode == "multi_agent":
        await handle_multi_agent_mode(processed_input, settings)


async def process_user_input(user_input: str, settings: Dict[str, Any]) -> str:
    """Process user input based on language settings."""

    language = settings.get("language", "arabic")

    if language == "arabic" or "arabic" in language:
        # Process Arabic text
        if arabic_processor.detect_arabic(user_input):
            # Apply RTL processing and dialect recognition
            processed = arabic_processor.process_rtl(user_input)
            processed = dialect_processor.process_iraqi_dialect(processed)
            return processed

    return user_input


async def handle_auto_mode(user_input: str, settings: Dict[str, Any]):
    """Handle automatic domain detection and agent generation."""

    # Detect professional domain from user input
    detected_domain = await detect_professional_domain(user_input)

    if detected_domain:
        # Generate appropriate specialist agent
        agent_generator = cl.user_session.get("agent_generator")
        specialist = await select_domain_specialist(detected_domain, user_input)

        try:
            agent = agent_generator.generate_iraqi_agent(detected_domain, specialist)

            # Send domain detection message
            await cl.Message(
                content=f"🎯 **Domain Detected | تم تحديد المجال**: {detected_domain.title()}\n"
                f"👨‍💼 **Specialist | المختص**: {specialist.replace('_', ' ').title()}\n\n"
                f"Processing your request... | جاري معالجة طلبك..."
            ).send()

            # Process request with specialized agent
            response = await process_with_agent(agent, user_input, settings)
            await send_formatted_response(response, settings)

        except Exception as e:
            await cl.Message(content=f"❌ **Error | خطأ**: {str(e)}").send()

    else:
        # Ask user to specify domain
        await cl.Message(content=await create_domain_selection_message()).send()


async def handle_domain_specific_mode(user_input: str, settings: Dict[str, Any]):
    """Handle domain-specific agent processing."""

    domain = cl.user_session.get("domain")
    agent_generator = cl.user_session.get("agent_generator")

    # Select appropriate specialist for the domain
    specialist = await select_domain_specialist(domain, user_input)

    try:
        agent = agent_generator.generate_iraqi_agent(domain, specialist)
        response = await process_with_agent(agent, user_input, settings)
        await send_formatted_response(response, settings)

    except Exception as e:
        await cl.Message(content=f"❌ **Error | خطأ**: {str(e)}").send()


async def handle_multi_agent_mode(user_input: str, settings: Dict[str, Any]):
    """Handle multi-agent team coordination."""

    # Detect which domains are needed for the complex task
    required_domains = await detect_required_domains(user_input)

    if len(required_domains) > 1:
        agent_generator = cl.user_session.get("agent_generator")

        # Create multi-agent team
        team = agent_generator.create_iraqi_multi_agent_team(
            required_domains, user_input
        )

        await cl.Message(
            content=f"👥 **Multi-Agent Team Activated | تم تفعيل فريق متعدد الوكلاء**\n\n"
            f"**Required Domains | المجالات المطلوبة**:\n"
            + "\n".join([f"• {domain.title()}" for domain in required_domains])
            + f"\n\nCoordinating agents... | جاري تنسيق الوكلاء..."
        ).send()

        # Process with team coordination
        response = await process_with_agent_team(team, user_input, settings)
        await send_formatted_response(response, settings)

    else:
        # Single domain detected, redirect to domain-specific mode
        await handle_domain_specific_mode(user_input, settings)


async def detect_professional_domain(user_input: str) -> Optional[str]:
    """Detect professional domain from user input."""

    # Keywords for each domain
    domain_keywords = {
        "legal": [
            "قانون",
            "محكمة",
            "عقد",
            "دعوى",
            "حقوق",
            "law",
            "court",
            "contract",
            "lawsuit",
            "rights",
        ],
        "medical": [
            "طبي",
            "صحة",
            "مرض",
            "علاج",
            "دواء",
            "medical",
            "health",
            "disease",
            "treatment",
            "medicine",
        ],
        "educational": [
            "تعليم",
            "مدرسة",
            "جامعة",
            "منهج",
            "دراسة",
            "education",
            "school",
            "university",
            "curriculum",
            "study",
        ],
        "government": [
            "حكومة",
            "وزارة",
            "خدمات",
            "إجراءات",
            "مدنية",
            "government",
            "ministry",
            "services",
            "procedures",
            "civil",
        ],
        "business": [
            "تجارة",
            "أعمال",
            "شركة",
            "استثمار",
            "مال",
            "business",
            "company",
            "investment",
            "money",
            "trade",
        ],
        "engineering": [
            "هندسة",
            "بناء",
            "مشروع",
            "تصميم",
            "تقني",
            "engineering",
            "construction",
            "project",
            "design",
            "technical",
        ],
    }

    user_input_lower = user_input.lower()

    for domain, keywords in domain_keywords.items():
        if any(keyword in user_input_lower for keyword in keywords):
            return domain

    return None


async def select_domain_specialist(domain: str, user_input: str) -> str:
    """Select appropriate specialist within domain based on user input."""

    specialist_mapping = {
        "legal": {
            "default": "civil_law_specialist",
            "sharia": "sharia_compliance_advisor",
            "contract": "contract_specialist",
        },
        "medical": {
            "default": "medical_consultation_advisor",
            "navigation": "healthcare_navigator",
        },
        "educational": {
            "default": "curriculum_advisor",
            "arabic": "arabic_language_tutor",
        },
        "government": {
            "default": "citizen_services_advisor",
            "documents": "document_processing_assistant",
        },
        "business": {
            "default": "business_consultant",
            "finance": "islamic_finance_advisor",
        },
        "engineering": {
            "default": "engineering_standards_advisor",
            "project": "project_management_consultant",
        },
    }

    domain_specialists = specialist_mapping.get(domain, {})

    # Simple keyword matching for specialist selection
    user_input_lower = user_input.lower()
    for keyword, specialist in domain_specialists.items():
        if keyword != "default" and keyword in user_input_lower:
            return specialist

    return domain_specialists.get("default", "civil_law_specialist")


async def detect_required_domains(user_input: str) -> List[str]:
    """Detect multiple domains required for complex tasks."""

    required_domains = []
    user_input_lower = user_input.lower()

    # Check for each domain
    if any(
        keyword in user_input_lower
        for keyword in ["قانون", "محكمة", "عقد", "law", "legal", "court"]
    ):
        required_domains.append("legal")

    if any(
        keyword in user_input_lower
        for keyword in ["طبي", "صحة", "علاج", "medical", "health", "treatment"]
    ):
        required_domains.append("medical")

    if any(
        keyword in user_input_lower
        for keyword in ["تعليم", "مدرسة", "منهج", "education", "school", "curriculum"]
    ):
        required_domains.append("educational")

    if any(
        keyword in user_input_lower
        for keyword in ["حكومة", "وزارة", "خدمات", "government", "ministry", "services"]
    ):
        required_domains.append("government")

    if any(
        keyword in user_input_lower
        for keyword in ["تجارة", "أعمال", "شركة", "business", "company", "trade"]
    ):
        required_domains.append("business")

    if any(
        keyword in user_input_lower
        for keyword in [
            "هندسة",
            "بناء",
            "مشروع",
            "engineering",
            "construction",
            "project",
        ]
    ):
        required_domains.append("engineering")

    return (
        required_domains if required_domains else ["legal"]
    )  # Default to legal if none detected


async def process_with_agent(
    agent: Any, user_input: str, settings: Dict[str, Any]
) -> Dict[str, Any]:
    """Process user input with specialized Iraqi agent."""

    # Simulate agent processing (actual implementation would use the agent framework)
    response = {
        "content": f"Processed by {agent.get('role', 'Iraqi Agent')}: {user_input}",
        "agent_info": agent,
        "language": settings.get("language", "arabic"),
        "cultural_validation": True,
        "islamic_compliance": True,
    }

    return response


async def process_with_agent_team(
    team: Dict[str, Any], user_input: str, settings: Dict[str, Any]
) -> Dict[str, Any]:
    """Process user input with multi-agent team coordination."""

    # Simulate multi-agent processing
    response = {
        "content": f"Multi-agent team response for: {user_input}",
        "team_info": team,
        "coordination": "collaborative",
        "language": settings.get("language", "arabic"),
        "cultural_validation": True,
        "islamic_compliance": True,
    }

    return response


async def send_formatted_response(response: Dict[str, Any], settings: Dict[str, Any]):
    """Send formatted response based on language settings."""

    content = response["content"]
    language = settings.get("language", "arabic")

    # Format response based on language preference
    if language == "arabic":
        # Apply RTL formatting
        formatted_content = arabic_processor.format_rtl_response(content)
    elif language == "mixed":
        # Format for mixed language display
        formatted_content = arabic_processor.format_mixed_language(content)
    else:
        formatted_content = content

    await cl.Message(content=formatted_content).send()


async def send_compliance_warning(compliance_result: Dict[str, Any]):
    """Send Islamic compliance warning."""
    issues = compliance_result.get("issues", [])
    warning_msg = (
        "⚠️ **Islamic Compliance Warning | تحذير التوافق الإسلامي**\n\n"
        "Your request contains content that may not comply with Islamic principles.\n"
        "طلبك يحتوي على محتوى قد لا يتوافق مع المبادئ الإسلامية.\n\n"
        f"Issues identified | المشاكل المحددة:\n"
        + "\n".join([f"• {issue}" for issue in issues])
    )

    await cl.Message(content=warning_msg).send()


async def send_cultural_warning(cultural_result: Dict[str, Any]):
    """Send cultural appropriateness warning."""
    issues = cultural_result.get("issues", [])
    warning_msg = (
        "⚠️ **Cultural Appropriateness Warning | تحذير الملائمة الثقافية**\n\n"
        "Your request may not be culturally appropriate for Iraqi context.\n"
        "طلبك قد لا يكون مناسباً ثقافياً للسياق العراقي.\n\n"
        f"Issues identified | المشاكل المحددة:\n"
        + "\n".join([f"• {issue}" for issue in issues])
    )

    await cl.Message(content=warning_msg).send()


async def create_domain_selection_message() -> str:
    """Create domain selection message in Arabic and English."""
    return """
🤔 **Please specify your professional domain | يرجى تحديد مجالك المهني**

**Available Domains | المجالات المتاحة:**

⚖️ **Legal | قانوني**
- Iraqi Civil Code | القانون المدني العراقي
- Sharia Compliance | التوافق مع الشريعة
- Contract Law | قانون العقود

🏥 **Medical | طبي**
- Medical Consultation | الاستشارة الطبية
- Healthcare Navigation | التنقل في النظام الصحي
- Islamic Medical Ethics | أخلاقيات الطب الإسلامي

📚 **Educational | تعليمي**
- Iraqi Curriculum | المنهج العراقي
- Arabic Language | اللغة العربية
- Islamic Studies | الدراسات الإسلامية

🏛️ **Government | حكومي**
- Citizen Services | الخدمات المدنية
- Document Processing | معالجة الوثائق
- Ministry Procedures | إجراءات الوزارات

💼 **Business | تجاري**
- Market Analysis | تحليل السوق
- Islamic Finance | التمويل الإسلامي
- Business Consulting | الاستشارات التجارية

🏗️ **Engineering | هندسي**
- Building Codes | قوانين البناء
- Technical Standards | المعايير التقنية
- Project Management | إدارة المشاريع

Please type your question or specify the domain you need help with.
يرجى كتابة سؤالك أو تحديد المجال الذي تحتاج المساعدة فيه.
"""


# Iraqi context and processing classes (placeholder implementations)
class IraqiCulturalContext:
    def validate_cultural_appropriateness(self, content: str) -> Dict[str, Any]:
        return {"appropriate": True, "issues": []}


class IslamicComplianceValidator:
    def validate_content(self, content: str) -> Dict[str, Any]:
        return {"compliant": True, "issues": []}


class ArabicRTLProcessor:
    def detect_arabic(self, text: str) -> bool:
        return any("\u0600" <= char <= "\u06ff" for char in text)

    def process_rtl(self, text: str) -> str:
        return text

    def format_rtl_response(self, text: str) -> str:
        return f"<div dir='rtl'>{text}</div>"

    def format_mixed_language(self, text: str) -> str:
        return text


class IraqiDialectProcessor:
    def process_iraqi_dialect(self, text: str) -> str:
        return text
