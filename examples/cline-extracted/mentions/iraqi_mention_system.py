"""
Iraqi Mention System - Context-aware notifications with cultural sensitivity
Part of Cline extraction with Iraqi government service integration

Implements sophisticated mention and notification system with Arabic language
support, cultural context awareness, and Iraqi government communication protocols.
"""

from typing import Dict, List, Optional, Union, Any, Callable, Set
from dataclasses import dataclass, field
from enum import Enum
import asyncio
import json
import time
from datetime import datetime, timedelta
import uuid
import re
import logging
from abc import ABC, abstractmethod

class MentionType(Enum):
    """Types of mentions for different contexts"""
    USER = "user"                         # Direct user mention @username
    ROLE = "role"                         # Role-based mention @role
    MINISTRY = "ministry"                 # Ministry-specific mention @ministry
    DEPARTMENT = "department"             # Department mention @department
    CITIZEN_SERVICE = "citizen_service"   # Citizen service mention @service
    EMERGENCY = "emergency"               # Emergency alert mention @emergency
    CULTURAL = "cultural"                 # Cultural advisor mention @cultural
    ISLAMIC = "islamic"                   # Islamic compliance mention @islamic
    SYSTEM = "system"                     # System notification mention @system

class NotificationPriority(Enum):
    """Priority levels for notifications"""
    LOW = "low"
    NORMAL = "normal" 
    HIGH = "high"
    CRITICAL = "critical"
    EMERGENCY = "emergency"

class CulturalSensitivity(Enum):
    """Cultural sensitivity levels for mentions"""
    GENERAL = "general"                   # General communication
    RESPECTFUL = "respectful"             # Respectful formal communication
    RELIGIOUS = "religious"               # Religious context awareness
    GOVERNMENTAL = "governmental"         # Government protocol awareness
    INTER_MINISTRY = "inter_ministry"     # Inter-ministry communication

class LanguagePreference(Enum):
    """Language preferences for notifications"""
    ARABIC = "ar"
    ENGLISH = "en"
    MIXED = "mixed"                       # Arabic and English mixed
    USER_PREFERENCE = "user_preference"   # Based on user settings

@dataclass
class MentionMatch:
    """Details of a detected mention"""
    mention_text: str
    mention_type: MentionType
    target_id: str
    target_name: str
    position: int
    length: int
    context_before: str
    context_after: str
    cultural_context: Optional[str] = None
    language: Optional[LanguagePreference] = None
    urgency: NotificationPriority = NotificationPriority.NORMAL

@dataclass
class NotificationRecipient:
    """Recipient information for notifications"""
    user_id: str
    name: str
    role: Optional[str] = None
    ministry: Optional[str] = None
    department: Optional[str] = None
    language_preference: LanguagePreference = LanguagePreference.USER_PREFERENCE
    cultural_sensitivity: CulturalSensitivity = CulturalSensitivity.GENERAL
    notification_preferences: Dict[str, bool] = field(default_factory=dict)
    contact_methods: List[str] = field(default_factory=list)
    active_hours: Optional[Dict[str, str]] = None

@dataclass
class CulturalNotification:
    """Culturally-aware notification message"""
    id: str
    mention_match: MentionMatch
    recipient: NotificationRecipient
    message_content: str
    arabic_content: Optional[str] = None
    english_content: Optional[str] = None
    cultural_context: Optional[str] = None
    islamic_compliance: bool = True
    government_protocol: bool = False
    created_at: datetime = field(default_factory=datetime.now)
    delivered_at: Optional[datetime] = None
    read_at: Optional[datetime] = None
    priority: NotificationPriority = NotificationPriority.NORMAL

@dataclass
class MentionContext:
    """Context information for mention processing"""
    message_id: str
    sender_id: str
    sender_name: str
    sender_role: Optional[str] = None
    sender_ministry: Optional[str] = None
    channel_type: str = "general"  # general, official, emergency, cultural
    is_government_communication: bool = False
    requires_cultural_validation: bool = False
    requires_islamic_compliance: bool = False
    message_classification: Optional[str] = None  # public, internal, confidential
    original_language: LanguagePreference = LanguagePreference.MIXED

class MentionProcessor(ABC):
    """Abstract base for mention processors"""
    
    @abstractmethod
    async def process_mention(self, mention: MentionMatch, 
                            context: MentionContext) -> List[NotificationRecipient]:
        """Process mention and return recipients"""
        pass
    
    @abstractmethod
    def can_handle(self, mention_type: MentionType) -> bool:
        """Check if processor can handle mention type"""
        pass

class IraqiMentionSystem:
    """
    Comprehensive Mention System for Iraqi Government Services
    
    Provides context-aware mention detection and notification with cultural
    sensitivity, Arabic language support, and government communication protocols.
    """
    
    def __init__(self, config: Dict[str, Any]):
        self.config = config
        self.logger = logging.getLogger(__name__)
        
        # Mention detection patterns
        self.mention_patterns = self._initialize_mention_patterns()
        
        # Cultural and language processors
        self.arabic_processor = ArabicMentionProcessor()
        self.cultural_processor = CulturalContextProcessor()
        self.islamic_validator = IslamicComplianceValidator()
        
        # Notification system
        self.notification_manager = IraqiNotificationManager()
        self.message_translator = BilingualMessageTranslator()
        
        # Mention processors
        self.mention_processors: Dict[MentionType, MentionProcessor] = {}
        self.recipient_resolvers: Dict[str, Callable] = {}
        
        # Recipients database (simplified - would be actual database)
        self.users_registry: Dict[str, NotificationRecipient] = {}
        self.ministry_registry: Dict[str, Dict[str, Any]] = {}
        self.role_registry: Dict[str, List[str]] = {}
        
        # Notification history and analytics
        self.mention_history: List[MentionMatch] = []
        self.notification_history: List[CulturalNotification] = []
        self.delivery_stats: Dict[str, Any] = defaultdict(dict)
        
        # Initialize default processors and registries
        self._initialize_mention_processors()
        self._initialize_recipient_registries()
    
    async def process_message_mentions(self, message_content: str, 
                                     context: MentionContext) -> List[CulturalNotification]:
        """
        Process all mentions in a message and generate culturally-appropriate notifications
        
        Args:
            message_content: The message text containing mentions
            context: Context information about the message
            
        Returns:
            List of culturally-aware notifications to be delivered
        """
        self.logger.info(f"Processing mentions in message: {context.message_id}")
        
        # Detect all mentions in the message
        mentions = await self._detect_mentions(message_content, context)
        
        if not mentions:
            return []
        
        notifications = []\n        \n        # Process each mention\n        for mention in mentions:\n            try:\n                # Get mention processor\n                processor = self.mention_processors.get(mention.mention_type)\n                if not processor:\n                    self.logger.warning(f\"No processor found for mention type: {mention.mention_type}\")\n                    continue\n                \n                # Process mention to get recipients\n                recipients = await processor.process_mention(mention, context)\n                \n                # Generate notifications for each recipient\n                for recipient in recipients:\n                    notification = await self._create_cultural_notification(\n                        mention, recipient, context\n                    )\n                    notifications.append(notification)\n                    \n            except Exception as e:\n                self.logger.error(f\"Failed to process mention '{mention.mention_text}': {str(e)}\")\n                continue\n        \n        # Store mention history\n        self.mention_history.extend(mentions)\n        self.notification_history.extend(notifications)\n        \n        # Deliver notifications\n        await self._deliver_notifications(notifications)\n        \n        self.logger.info(f\"Processed {len(mentions)} mentions, generated {len(notifications)} notifications\")\n        return notifications\n    \n    async def _detect_mentions(self, message_content: str, \n                              context: MentionContext) -> List[MentionMatch]:\n        \"\"\"Detect all mentions in message content\"\"\"\n        mentions = []\n        \n        # Check each mention pattern\n        for mention_type, patterns in self.mention_patterns.items():\n            for pattern in patterns:\n                matches = re.finditer(pattern, message_content, re.IGNORECASE | re.UNICODE)\n                \n                for match in matches:\n                    mention_text = match.group(0)\n                    target_id = match.group(1) if match.groups() else mention_text[1:]  # Remove @ symbol\n                    \n                    # Get context around mention\n                    start_pos = max(0, match.start() - 50)\n                    end_pos = min(len(message_content), match.end() + 50)\n                    context_before = message_content[start_pos:match.start()]\n                    context_after = message_content[match.end():end_pos]\n                    \n                    # Analyze cultural context\n                    cultural_context = await self.cultural_processor.analyze_mention_context(\n                        mention_text, context_before, context_after, context\n                    )\n                    \n                    # Detect language\n                    language = await self._detect_mention_language(mention_text, context_before, context_after)\n                    \n                    # Determine urgency\n                    urgency = await self._determine_mention_urgency(mention_text, cultural_context, context)\n                    \n                    # Resolve target name\n                    target_name = await self._resolve_target_name(target_id, mention_type)\n                    \n                    mention_match = MentionMatch(\n                        mention_text=mention_text,\n                        mention_type=mention_type,\n                        target_id=target_id,\n                        target_name=target_name,\n                        position=match.start(),\n                        length=match.end() - match.start(),\n                        context_before=context_before,\n                        context_after=context_after,\n                        cultural_context=cultural_context,\n                        language=language,\n                        urgency=urgency\n                    )\n                    \n                    mentions.append(mention_match)\n        \n        return mentions\n    \n    async def _create_cultural_notification(self, mention: MentionMatch,\n                                           recipient: NotificationRecipient,\n                                           context: MentionContext) -> CulturalNotification:\n        \"\"\"Create culturally-appropriate notification\"\"\"\n        \n        # Generate base notification message\n        base_message = await self._generate_base_message(mention, recipient, context)\n        \n        # Translate to appropriate languages\n        arabic_content = None\n        english_content = None\n        \n        if recipient.language_preference in [LanguagePreference.ARABIC, LanguagePreference.MIXED]:\n            arabic_content = await self.message_translator.translate_to_arabic(\n                base_message, recipient.cultural_sensitivity, context\n            )\n        \n        if recipient.language_preference in [LanguagePreference.ENGLISH, LanguagePreference.MIXED]:\n            english_content = await self.message_translator.translate_to_english(\n                base_message, recipient.cultural_sensitivity, context\n            )\n        \n        # Select primary content based on preference\n        if recipient.language_preference == LanguagePreference.ARABIC:\n            primary_content = arabic_content or base_message\n        elif recipient.language_preference == LanguagePreference.ENGLISH:\n            primary_content = english_content or base_message\n        else:\n            primary_content = arabic_content or english_content or base_message\n        \n        # Validate Islamic compliance if required\n        islamic_compliance = True\n        if context.requires_islamic_compliance:\n            islamic_compliance = await self.islamic_validator.validate_notification_content(\n                primary_content, arabic_content, english_content\n            )\n        \n        # Check government protocol requirements\n        government_protocol = context.is_government_communication or (\n            recipient.ministry is not None and mention.mention_type == MentionType.MINISTRY\n        )\n        \n        notification = CulturalNotification(\n            id=str(uuid.uuid4()),\n            mention_match=mention,\n            recipient=recipient,\n            message_content=primary_content,\n            arabic_content=arabic_content,\n            english_content=english_content,\n            cultural_context=mention.cultural_context,\n            islamic_compliance=islamic_compliance,\n            government_protocol=government_protocol,\n            priority=mention.urgency\n        )\n        \n        return notification\n    \n    async def _deliver_notifications(self, notifications: List[CulturalNotification]):\n        \"\"\"Deliver notifications through appropriate channels\"\"\"\n        \n        for notification in notifications:\n            try:\n                # Select delivery method based on priority and recipient preferences\n                delivery_methods = await self._select_delivery_methods(notification)\n                \n                # Deliver through each method\n                for method in delivery_methods:\n                    success = await self.notification_manager.deliver_notification(\n                        notification, method\n                    )\n                    \n                    if success:\n                        notification.delivered_at = datetime.now()\n                        await self._update_delivery_stats(notification, method, True)\n                        break\n                    else:\n                        await self._update_delivery_stats(notification, method, False)\n                \n                if not notification.delivered_at:\n                    self.logger.warning(f\"Failed to deliver notification {notification.id}\")\n                    \n            except Exception as e:\n                self.logger.error(f\"Delivery failed for notification {notification.id}: {str(e)}\")\n    \n    async def _generate_base_message(self, mention: MentionMatch,\n                                   recipient: NotificationRecipient,\n                                   context: MentionContext) -> str:\n        \"\"\"Generate base notification message\"\"\"\n        \n        # Customize message based on mention type and cultural context\n        if mention.mention_type == MentionType.USER:\n            if recipient.cultural_sensitivity == CulturalSensitivity.GOVERNMENTAL:\n                message = f\"السيد/السيدة {recipient.name}، تم ذكرك في رسالة رسمية من {context.sender_name}\"\n            elif recipient.cultural_sensitivity == CulturalSensitivity.RELIGIOUS:\n                message = f\"أخي/أختي الكريم {recipient.name}، تم ذكرك في رسالة\"\n            else:\n                message = f\"{recipient.name}، تم ذكرك في رسالة من {context.sender_name}\"\n                \n        elif mention.mention_type == MentionType.MINISTRY:\n            message = f\"إشعار وزاري: تم ذكر {mention.target_name} في الرسالة الرسمية\"\n            \n        elif mention.mention_type == MentionType.EMERGENCY:\n            message = f\"⚠️ إشعار عاجل: {mention.target_name} - يرجى المراجعة الفورية\"\n            \n        elif mention.mention_type == MentionType.CULTURAL:\n            message = f\"استشارة ثقافية: تم طلب مراجعة ثقافية من {mention.target_name}\"\n            \n        elif mention.mention_type == MentionType.ISLAMIC:\n            message = f\"مراجعة إسلامية: تم طلب التحقق من الامتثال الإسلامي\"\n            \n        else:\n            message = f\"تم ذكر {mention.target_name} في رسالة من {context.sender_name}\"\n        \n        return message\n    \n    async def _detect_mention_language(self, mention_text: str, \n                                     context_before: str, \n                                     context_after: str) -> LanguagePreference:\n        \"\"\"Detect the language context of the mention\"\"\"\n        \n        # Analyze surrounding text for language indicators\n        full_context = context_before + mention_text + context_after\n        \n        arabic_chars = sum(1 for c in full_context if '\\u0600' <= c <= '\\u06FF')\n        total_chars = len(full_context)\n        \n        if total_chars == 0:\n            return LanguagePreference.MIXED\n        \n        arabic_ratio = arabic_chars / total_chars\n        \n        if arabic_ratio > 0.7:\n            return LanguagePreference.ARABIC\n        elif arabic_ratio < 0.3:\n            return LanguagePreference.ENGLISH\n        else:\n            return LanguagePreference.MIXED\n    \n    async def _determine_mention_urgency(self, mention_text: str, \n                                       cultural_context: Optional[str],\n                                       context: MentionContext) -> NotificationPriority:\n        \"\"\"Determine urgency level of the mention\"\"\"\n        \n        # Emergency keywords\n        emergency_keywords = [\"عاجل\", \"طارئ\", \"urgent\", \"emergency\", \"critical\"]\n        high_priority_keywords = [\"مهم\", \"ضروري\", \"important\", \"priority\"]\n        \n        mention_lower = mention_text.lower()\n        \n        # Check for emergency indicators\n        if any(keyword in mention_lower for keyword in emergency_keywords):\n            return NotificationPriority.EMERGENCY\n        \n        # Check context for urgency\n        if context.channel_type == \"emergency\":\n            return NotificationPriority.CRITICAL\n        \n        # Check for high priority indicators\n        if any(keyword in mention_lower for keyword in high_priority_keywords):\n            return NotificationPriority.HIGH\n        \n        # Government communications are generally higher priority\n        if context.is_government_communication:\n            return NotificationPriority.HIGH\n        \n        # Cultural and Islamic mentions get normal priority\n        if cultural_context and \"cultural\" in cultural_context:\n            return NotificationPriority.NORMAL\n        \n        return NotificationPriority.NORMAL\n    \n    async def _resolve_target_name(self, target_id: str, mention_type: MentionType) -> str:\n        \"\"\"Resolve target ID to display name\"\"\"\n        \n        if mention_type == MentionType.USER:\n            user = self.users_registry.get(target_id)\n            return user.name if user else target_id\n            \n        elif mention_type == MentionType.MINISTRY:\n            ministry = self.ministry_registry.get(target_id, {})\n            return ministry.get(\"name\", target_id)\n            \n        elif mention_type == MentionType.ROLE:\n            # Role names are usually descriptive already\n            return target_id.replace(\"_\", \" \").title()\n            \n        else:\n            return target_id\n    \n    async def _select_delivery_methods(self, notification: CulturalNotification) -> List[str]:\n        \"\"\"Select appropriate delivery methods for notification\"\"\"\n        methods = []\n        \n        # Emergency notifications use all available methods\n        if notification.priority == NotificationPriority.EMERGENCY:\n            methods = [\"push\", \"sms\", \"email\", \"in_app\"]\n        \n        # Critical notifications use multiple methods\n        elif notification.priority == NotificationPriority.CRITICAL:\n            methods = [\"push\", \"in_app\", \"email\"]\n        \n        # High priority uses push and in-app\n        elif notification.priority == NotificationPriority.HIGH:\n            methods = [\"push\", \"in_app\"]\n        \n        # Normal priority uses in-app only\n        else:\n            methods = [\"in_app\"]\n        \n        # Filter based on recipient preferences\n        available_methods = notification.recipient.contact_methods\n        methods = [m for m in methods if m in available_methods]\n        \n        # Always have at least in-app as fallback\n        if not methods:\n            methods = [\"in_app\"]\n        \n        return methods\n    \n    async def _update_delivery_stats(self, notification: CulturalNotification,\n                                   method: str, success: bool):\n        \"\"\"Update delivery statistics\"\"\"\n        today = datetime.now().date().isoformat()\n        \n        if today not in self.delivery_stats:\n            self.delivery_stats[today] = defaultdict(lambda: {\"sent\": 0, \"delivered\": 0})\n        \n        self.delivery_stats[today][method][\"sent\"] += 1\n        if success:\n            self.delivery_stats[today][method][\"delivered\"] += 1\n    \n    def _initialize_mention_patterns(self) -> Dict[MentionType, List[str]]:\n        \"\"\"Initialize regex patterns for detecting mentions\"\"\"\n        return {\n            MentionType.USER: [\n                r'@([a-zA-Z0-9_\\u0600-\\u06FF]+)',  # @username (Arabic/English)\n                r'@\"([^\"]+)\"',  # @\"display name\"\n            ],\n            MentionType.ROLE: [\n                r'@role:([a-zA-Z0-9_]+)',  # @role:admin\n                r'@دور:([\\u0600-\\u06FF_]+)',  # @دور:مدير\n            ],\n            MentionType.MINISTRY: [\n                r'@ministry:([a-zA-Z0-9_]+)',  # @ministry:interior\n                r'@وزارة:([\\u0600-\\u06FF_]+)',  # @وزارة:الداخلية\n            ],\n            MentionType.DEPARTMENT: [\n                r'@dept:([a-zA-Z0-9_]+)',  # @dept:it\n                r'@قسم:([\\u0600-\\u06FF_]+)',  # @قسم:تقنية\n            ],\n            MentionType.CITIZEN_SERVICE: [\n                r'@service:([a-zA-Z0-9_]+)',  # @service:passport\n                r'@خدمة:([\\u0600-\\u06FF_]+)',  # @خدمة:جواز\n            ],\n            MentionType.EMERGENCY: [\n                r'@emergency',  # @emergency\n                r'@طوارئ',  # @طوارئ\n                r'@عاجل',  # @عاجل\n            ],\n            MentionType.CULTURAL: [\n                r'@cultural',  # @cultural\n                r'@ثقافي',  # @ثقافي\n                r'@استشاري_ثقافي',  # @استشاري_ثقافي\n            ],\n            MentionType.ISLAMIC: [\n                r'@islamic',  # @islamic\n                r'@إسلامي',  # @إسلامي\n                r'@شرعي',  # @شرعي\n            ],\n            MentionType.SYSTEM: [\n                r'@system',  # @system\n                r'@نظام',  # @نظام\n            ]\n        }\n    \n    def _initialize_mention_processors(self):\n        \"\"\"Initialize mention processors for different types\"\"\"\n        # Simplified processor initialization\n        self.mention_processors[MentionType.USER] = UserMentionProcessor(self.users_registry)\n        self.mention_processors[MentionType.MINISTRY] = MinistryMentionProcessor(self.ministry_registry)\n        self.mention_processors[MentionType.EMERGENCY] = EmergencyMentionProcessor()\n        # ... other processors\n    \n    def _initialize_recipient_registries(self):\n        \"\"\"Initialize recipient registries with sample data\"\"\"\n        # Sample user\n        sample_user = NotificationRecipient(\n            user_id=\"user1\",\n            name=\"أحمد محمد\",\n            role=\"developer\",\n            ministry=\"technology\",\n            language_preference=LanguagePreference.MIXED,\n            cultural_sensitivity=CulturalSensitivity.RESPECTFUL,\n            contact_methods=[\"push\", \"in_app\", \"email\"]\n        )\n        self.users_registry[\"user1\"] = sample_user\n        \n        # Sample ministry\n        self.ministry_registry[\"interior\"] = {\n            \"name\": \"وزارة الداخلية\",\n            \"english_name\": \"Ministry of Interior\",\n            \"departments\": [\"security\", \"civil_affairs\", \"immigration\"]\n        }\n\n# Supporting processor classes (simplified implementations)\n\nclass UserMentionProcessor(MentionProcessor):\n    def __init__(self, users_registry: Dict[str, NotificationRecipient]):\n        self.users_registry = users_registry\n    \n    async def process_mention(self, mention: MentionMatch, \n                            context: MentionContext) -> List[NotificationRecipient]:\n        recipient = self.users_registry.get(mention.target_id)\n        return [recipient] if recipient else []\n    \n    def can_handle(self, mention_type: MentionType) -> bool:\n        return mention_type == MentionType.USER\n\nclass MinistryMentionProcessor(MentionProcessor):\n    def __init__(self, ministry_registry: Dict[str, Dict[str, Any]]):\n        self.ministry_registry = ministry_registry\n    \n    async def process_mention(self, mention: MentionMatch, \n                            context: MentionContext) -> List[NotificationRecipient]:\n        # Would return ministry officials or department heads\n        return []\n    \n    def can_handle(self, mention_type: MentionType) -> bool:\n        return mention_type == MentionType.MINISTRY\n\nclass EmergencyMentionProcessor(MentionProcessor):\n    async def process_mention(self, mention: MentionMatch, \n                            context: MentionContext) -> List[NotificationRecipient]:\n        # Would return emergency response team members\n        return []\n    \n    def can_handle(self, mention_type: MentionType) -> bool:\n        return mention_type == MentionType.EMERGENCY\n\n# Supporting service classes (simplified)\n\nclass ArabicMentionProcessor:\n    async def process_arabic_mention(self, mention_text: str) -> Dict[str, Any]:\n        return {\"processed\": True, \"language\": \"arabic\"}\n\nclass CulturalContextProcessor:\n    async def analyze_mention_context(self, mention_text: str, context_before: str, \n                                    context_after: str, context: MentionContext) -> str:\n        return \"general_cultural_context\"\n\nclass IslamicComplianceValidator:\n    async def validate_notification_content(self, primary: str, arabic: Optional[str], \n                                          english: Optional[str]) -> bool:\n        return True  # Simplified validation\n\nclass IraqiNotificationManager:\n    async def deliver_notification(self, notification: CulturalNotification, \n                                 method: str) -> bool:\n        # Simplified delivery - would integrate with actual notification services\n        return True\n\nclass BilingualMessageTranslator:\n    async def translate_to_arabic(self, message: str, sensitivity: CulturalSensitivity, \n                                context: MentionContext) -> str:\n        # Simplified translation - would use actual translation service\n        return f\"[AR] {message}\"\n    \n    async def translate_to_english(self, message: str, sensitivity: CulturalSensitivity, \n                                 context: MentionContext) -> str:\n        # Simplified translation - would use actual translation service  \n        return f\"[EN] {message}\""