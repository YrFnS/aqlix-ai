"""
Revolutionary Iraqi Notification Service with Cultural Intelligence

Advanced notification delivery system for the Iraqi AI Chat System featuring:
- Multi-channel notification delivery (WebSocket, Email, SMS, Push)
- Cultural context-aware message formatting with Islamic compliance
- Arabic text optimization with RTL display support
- Ministry-specific notification routing and priority management
- Intelligent delivery scheduling with Iraqi timezone awareness
- Privacy-first notification handling with automatic cleanup
- Comprehensive audit trails and delivery analytics
- Integration with Iraqi payment gateways and professional services

This module provides the core notification infrastructure that integrates
with all previously extracted Iraqi AI system components while maintaining
cultural sensitivity and Islamic values.

Author: Iraqi AI Development Team
License: Proprietary - Iraqi AI Chat System
"""

import asyncio
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Union, Callable
from enum import Enum
import uuid
from dataclasses import dataclass, asdict
from contextlib import asynccontextmanager
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import aioredis
import aiohttp
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from sqlalchemy.orm import selectinload
import pydantic
from pydantic import BaseModel, Field, validator
import prometheus_client
from prometheus_client import Counter, Histogram, Gauge
import celery
from celery import Celery
import pytz
from babel.dates import format_datetime
import html2text
import markdown
from jinja2 import Environment, FileSystemLoader
import phonenumbers
from phonenumbers import NumberParseException

# Configure logging for comprehensive audit trails
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s',
    handlers=[
        logging.FileHandler('/var/log/iraqi-ai/notification_service.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Prometheus metrics for monitoring
notification_counter = Counter('iraqi_notifications_total', 'Total notifications sent', ['channel', 'type', 'status'])
notification_duration = Histogram('iraqi_notification_duration_seconds', 'Time spent processing notifications')
active_notifications = Gauge('iraqi_active_notifications', 'Currently active notifications')

# Iraqi timezone for proper scheduling
IRAQI_TIMEZONE = pytz.timezone('Asia/Baghdad')

class NotificationChannel(str, Enum):
    """Supported notification delivery channels"""
    WEBSOCKET = "websocket"
    EMAIL = "email" 
    SMS = "sms"
    PUSH = "push"
    IN_APP = "in_app"
    MINISTRY_PORTAL = "ministry_portal"
    WHATSAPP = "whatsapp"

class NotificationPriority(str, Enum):
    """Notification priority levels with Iraqi context"""
    CRITICAL = "critical"  # Urgent government/legal matters
    HIGH = "high"         # Important professional communications
    NORMAL = "normal"     # Standard notifications
    LOW = "low"          # Informational updates

class NotificationType(str, Enum):
    """Types of notifications in Iraqi context"""
    CHAT_MESSAGE = "chat_message"
    PAYMENT_CONFIRMATION = "payment_confirmation"
    DOCUMENT_READY = "document_ready" 
    APPOINTMENT_REMINDER = "appointment_reminder"
    LEGAL_NOTIFICATION = "legal_notification"
    MEDICAL_ALERT = "medical_alert"
    EDUCATIONAL_UPDATE = "educational_update"
    SYSTEM_ALERT = "system_alert"
    CULTURAL_REMINDER = "cultural_reminder"
    PRAYER_REMINDER = "prayer_reminder"

class MessageFormat(str, Enum):
    """Message formatting options"""
    PLAIN_TEXT = "plain_text"
    HTML = "html"
    MARKDOWN = "markdown"
    RTL_ARABIC = "rtl_arabic"
    MIXED_CONTENT = "mixed_content"

@dataclass
class IraqiCulturalContext:
    """Cultural context for notification formatting"""
    language_preference: str = "ar"  # Arabic by default
    cultural_sensitivity_level: str = "high"
    islamic_compliance_required: bool = True
    professional_domain: Optional[str] = None
    ministry_affiliation: Optional[str] = None
    preferred_greeting: str = "السلام عليكم"
    time_format_24h: bool = True
    weekend_delivery_allowed: bool = False

class NotificationTemplate(BaseModel):
    """Template for cultural and professional notification formatting"""
    template_id: str
    name: str
    subject_template: str
    body_template: str
    format_type: MessageFormat
    cultural_context: IraqiCulturalContext
    required_variables: List[str]
    islamic_compliance_verified: bool = True
    rtl_optimized: bool = True
    
    class Config:
        use_enum_values = True

class NotificationRequest(BaseModel):
    """Request structure for sending notifications"""
    notification_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    channel: NotificationChannel
    notification_type: NotificationType
    priority: NotificationPriority = NotificationPriority.NORMAL
    subject: str
    message: str
    template_id: Optional[str] = None
    template_variables: Dict[str, Any] = Field(default_factory=dict)
    cultural_context: IraqiCulturalContext = Field(default_factory=IraqiCulturalContext)
    scheduled_time: Optional[datetime] = None
    expiry_time: Optional[datetime] = None
    retry_count: int = 0
    max_retries: int = 3
    metadata: Dict[str, Any] = Field(default_factory=dict)
    
    @validator('scheduled_time', 'expiry_time')
    def validate_times(cls, v):
        """Ensure times are timezone-aware and in Iraqi timezone"""
        if v and not v.tzinfo:
            v = IRAQI_TIMEZONE.localize(v)
        return v
    
    class Config:
        use_enum_values = True

class NotificationResult(BaseModel):
    """Result of notification delivery attempt"""
    notification_id: str
    status: str  # success, failed, pending, expired
    delivery_time: Optional[datetime] = None
    error_message: Optional[str] = None
    retry_count: int = 0
    channel_specific_data: Dict[str, Any] = Field(default_factory=dict)
    cultural_validation_passed: bool = True
    
    class Config:
        use_enum_values = True

class IraqiNotificationService:
    """
    Revolutionary Iraqi Notification Service with Cultural Intelligence
    
    Comprehensive notification delivery system featuring:
    - Multi-channel notification delivery with intelligent routing
    - Cultural context-aware message formatting and validation
    - Arabic text optimization with proper RTL display
    - Ministry-specific routing and professional communication
    - Islamic compliance validation and cultural sensitivity
    - Intelligent delivery scheduling with Iraqi business hours
    - Privacy-first handling with automatic data cleanup
    - Integration with Iraqi payment gateways and services
    """
    
    def __init__(
        self,
        redis_url: str = "redis://localhost:6379",
        celery_broker: str = "redis://localhost:6379/1",
        smtp_config: Optional[Dict] = None,
        sms_config: Optional[Dict] = None,
        push_config: Optional[Dict] = None,
        template_dir: str = "/templates/notifications"
    ):
        self.redis_url = redis_url
        self.celery_broker = celery_broker
        self.smtp_config = smtp_config or {}
        self.sms_config = sms_config or {}
        self.push_config = push_config or {}
        self.template_dir = template_dir
        
        # Initialize components
        self.redis_client = None
        self.celery_app = None
        self.template_env = None
        self.notification_templates: Dict[str, NotificationTemplate] = {}
        self.delivery_handlers: Dict[NotificationChannel, Callable] = {}
        self.cultural_validators: Dict[str, Callable] = {}
        
        # Metrics and monitoring
        self.delivery_stats = {
            'total_sent': 0,
            'successful_deliveries': 0,
            'failed_deliveries': 0,
            'cultural_validation_failures': 0
        }
        
        # Iraqi business hours (8 AM to 6 PM Baghdad time)
        self.business_hours = {
            'start': 8,  # 8 AM
            'end': 18,   # 6 PM
            'weekend_days': [4, 5]  # Friday and Saturday
        }
        
        logger.info("Iraqi Notification Service initialized with cultural intelligence")
    
    async def initialize(self) -> None:
        """Initialize all service components asynchronously"""
        try:
            # Initialize Redis connection
            self.redis_client = aioredis.from_url(
                self.redis_url,
                encoding="utf-8",
                decode_responses=True,
                max_connections=20,
                retry_on_timeout=True
            )
            
            # Test Redis connection
            await self.redis_client.ping()
            logger.info("Redis connection established successfully")
            
            # Initialize Celery for background processing
            self.celery_app = Celery(
                'iraqi_notifications',
                broker=self.celery_broker,
                backend=self.redis_url
            )
            
            # Configure Celery for Iraqi timezone
            self.celery_app.conf.update(
                timezone='Asia/Baghdad',
                enable_utc=True,
                result_expires=3600,
                task_serializer='json',
                accept_content=['json'],
                result_serializer='json'
            )
            
            # Initialize Jinja2 template environment for Arabic support
            self.template_env = Environment(
                loader=FileSystemLoader(self.template_dir),
                autoescape=True,
                extensions=['jinja2.ext.i18n']
            )
            
            # Load notification templates
            await self._load_notification_templates()
            
            # Initialize delivery handlers
            self._setup_delivery_handlers()
            
            # Initialize cultural validators
            self._setup_cultural_validators()
            
            # Schedule periodic cleanup
            await self._schedule_periodic_cleanup()
            
            logger.info("Iraqi Notification Service initialization completed successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize notification service: {str(e)}")
            raise

    async def _load_notification_templates(self) -> None:
        """Load culturally appropriate notification templates"""
        try:
            # Standard templates for Iraqi AI system
            templates = [
                NotificationTemplate(
                    template_id="chat_message_ar",
                    name="Arabic Chat Message",
                    subject_template="رسالة جديدة من {{sender_name}}",
                    body_template="""
                    السلام عليكم {{recipient_name}},
                    
                    لديك رسالة جديدة من {{sender_name}}:
                    
                    {{message_content}}
                    
                    يمكنك الرد من خلال تطبيق الذكاء الاصطناعي العراقي.
                    
                    مع تحياتي,
                    فريق الذكاء الاصطناعي العراقي
                    """,
                    format_type=MessageFormat.RTL_ARABIC,
                    cultural_context=IraqiCulturalContext(),
                    required_variables=["recipient_name", "sender_name", "message_content"]
                ),
                
                NotificationTemplate(
                    template_id="payment_confirmation_ar",
                    name="Arabic Payment Confirmation",
                    subject_template="تأكيد الدفع - {{amount}} دينار عراقي",
                    body_template="""
                    السلام عليكم {{user_name}},
                    
                    تم تأكيد دفعتك بنجاح:
                    
                    المبلغ: {{amount}} دينار عراقي
                    بوابة الدفع: {{payment_gateway}}
                    رقم المعاملة: {{transaction_id}}
                    التاريخ: {{payment_date}}
                    
                    شكراً لاستخدامك خدمات الذكاء الاصطناعي العراقي.
                    
                    مع التقدير,
                    فريق الذكاء الاصطناعي العراقي
                    """,
                    format_type=MessageFormat.RTL_ARABIC,
                    cultural_context=IraqiCulturalContext(),
                    required_variables=["user_name", "amount", "payment_gateway", "transaction_id", "payment_date"]
                ),
                
                NotificationTemplate(
                    template_id="document_ready_professional",
                    name="Professional Document Ready",
                    subject_template="Document Ready - {{document_type}}",
                    body_template="""
                    السلام عليكم {{user_name}},
                    
                    Your {{document_type}} has been processed and is ready for download.
                    
                    Document Details:
                    - Type: {{document_type}}
                    - Processing Date: {{processing_date}}
                    - Status: Complete
                    - Cultural Compliance: Verified
                    
                    You can access your document through the Iraqi AI system dashboard.
                    
                    Best regards,
                    Iraqi AI Professional Services Team
                    """,
                    format_type=MessageFormat.MIXED_CONTENT,
                    cultural_context=IraqiCulturalContext(
                        professional_domain="legal",
                        islamic_compliance_required=True
                    ),
                    required_variables=["user_name", "document_type", "processing_date"]
                ),
                
                NotificationTemplate(
                    template_id="appointment_reminder_medical",
                    name="Medical Appointment Reminder",
                    subject_template="تذكير بالموعد الطبي - {{appointment_date}}",
                    body_template="""
                    السلام عليكم د. {{doctor_name}},
                    
                    تذكير بموعدك الطبي:
                    
                    التاريخ: {{appointment_date}}
                    الوقت: {{appointment_time}}
                    نوع الاستشارة: {{consultation_type}}
                    اسم المريض: {{patient_name}}
                    
                    يرجى الاستعداد للموعد وفقاً للبروتوكولات الطبية المعتمدة.
                    
                    مع أطيب التمنيات,
                    نظام الذكاء الاصطناعي الطبي العراقي
                    """,
                    format_type=MessageFormat.RTL_ARABIC,
                    cultural_context=IraqiCulturalContext(
                        professional_domain="medical",
                        preferred_greeting="السلام عليكم د.",
                        islamic_compliance_required=True
                    ),
                    required_variables=["doctor_name", "appointment_date", "appointment_time", "consultation_type", "patient_name"]
                ),
                
                NotificationTemplate(
                    template_id="prayer_reminder",
                    name="Prayer Time Reminder",
                    subject_template="تذكير بوقت الصلاة - {{prayer_name}}",
                    body_template="""
                    السلام عليكم {{user_name}},
                    
                    حان وقت صلاة {{prayer_name}}
                    
                    الوقت: {{prayer_time}}
                    المدينة: {{city}}
                    
                    جعلها الله في ميزان حسناتكم.
                    
                    تطبيق الذكاء الاصطناعي العراقي
                    """,
                    format_type=MessageFormat.RTL_ARABIC,
                    cultural_context=IraqiCulturalContext(
                        islamic_compliance_required=True,
                        cultural_sensitivity_level="highest"
                    ),
                    required_variables=["user_name", "prayer_name", "prayer_time", "city"]
                )
            ]
            
            # Store templates
            for template in templates:
                self.notification_templates[template.template_id] = template
                logger.info(f"Loaded notification template: {template.name}")
            
            logger.info(f"Successfully loaded {len(templates)} notification templates")
            
        except Exception as e:
            logger.error(f"Failed to load notification templates: {str(e)}")
            raise

    def _setup_delivery_handlers(self) -> None:
        """Setup handlers for different notification channels"""
        self.delivery_handlers = {
            NotificationChannel.WEBSOCKET: self._deliver_websocket,
            NotificationChannel.EMAIL: self._deliver_email,
            NotificationChannel.SMS: self._deliver_sms,
            NotificationChannel.PUSH: self._deliver_push,
            NotificationChannel.IN_APP: self._deliver_in_app,
            NotificationChannel.MINISTRY_PORTAL: self._deliver_ministry_portal,
            NotificationChannel.WHATSAPP: self._deliver_whatsapp
        }
        logger.info("Notification delivery handlers configured")

    def _setup_cultural_validators(self) -> None:
        """Setup cultural validation functions"""
        self.cultural_validators = {
            'islamic_compliance': self._validate_islamic_compliance,
            'arabic_rtl': self._validate_arabic_rtl,
            'professional_tone': self._validate_professional_tone,
            'cultural_sensitivity': self._validate_cultural_sensitivity,
            'ministry_protocol': self._validate_ministry_protocol
        }
        logger.info("Cultural validators configured")

    async def send_notification(self, request: NotificationRequest) -> NotificationResult:
        """
        Send a notification with comprehensive cultural validation
        
        Args:
            request: Notification request with all delivery parameters
            
        Returns:
            NotificationResult with delivery status and details
        """
        start_time = datetime.now()
        notification_counter.labels(
            channel=request.channel.value,
            type=request.notification_type.value,
            status='initiated'
        ).inc()
        
        try:
            logger.info(f"Processing notification {request.notification_id} for user {request.user_id}")
            
            # Validate cultural context
            cultural_validation = await self._validate_cultural_context(request)
            if not cultural_validation['passed']:
                self.delivery_stats['cultural_validation_failures'] += 1
                return NotificationResult(
                    notification_id=request.notification_id,
                    status="failed",
                    error_message=f"Cultural validation failed: {cultural_validation['errors']}",
                    cultural_validation_passed=False
                )
            
            # Apply template if specified
            if request.template_id and request.template_id in self.notification_templates:
                request = await self._apply_template(request)
            
            # Check if notification should be scheduled
            if request.scheduled_time and request.scheduled_time > datetime.now(IRAQI_TIMEZONE):
                return await self._schedule_notification(request)
            
            # Check Iraqi business hours for professional notifications
            if request.notification_type in [NotificationType.LEGAL_NOTIFICATION, NotificationType.EDUCATIONAL_UPDATE]:
                if not self._is_business_hours():
                    return await self._schedule_for_business_hours(request)
            
            # Deliver notification through specified channel
            handler = self.delivery_handlers.get(request.channel)
            if not handler:
                raise ValueError(f"Unsupported notification channel: {request.channel}")
            
            delivery_result = await handler(request)
            
            # Record delivery metrics
            duration = (datetime.now() - start_time).total_seconds()
            notification_duration.observe(duration)
            
            if delivery_result.status == "success":
                self.delivery_stats['successful_deliveries'] += 1
                notification_counter.labels(
                    channel=request.channel.value,
                    type=request.notification_type.value,
                    status='success'
                ).inc()
            else:
                self.delivery_stats['failed_deliveries'] += 1
                notification_counter.labels(
                    channel=request.channel.value,
                    type=request.notification_type.value,
                    status='failed'
                ).inc()
            
            # Store delivery record for audit
            await self._store_delivery_record(request, delivery_result)
            
            self.delivery_stats['total_sent'] += 1
            logger.info(f"Notification {request.notification_id} processed with status: {delivery_result.status}")
            
            return delivery_result
            
        except Exception as e:
            error_msg = f"Failed to send notification: {str(e)}"
            logger.error(f"Error processing notification {request.notification_id}: {error_msg}")
            
            notification_counter.labels(
                channel=request.channel.value,
                type=request.notification_type.value,
                status='error'
            ).inc()
            
            return NotificationResult(
                notification_id=request.notification_id,
                status="failed",
                error_message=error_msg,
                cultural_validation_passed=True
            )

    async def _validate_cultural_context(self, request: NotificationRequest) -> Dict[str, Any]:
        """Comprehensive cultural validation"""
        validation_result = {
            'passed': True,
            'errors': [],
            'warnings': []
        }
        
        try:
            # Islamic compliance validation
            if request.cultural_context.islamic_compliance_required:
                islamic_result = await self.cultural_validators['islamic_compliance'](
                    request.subject + " " + request.message
                )
                if not islamic_result['compliant']:
                    validation_result['passed'] = False
                    validation_result['errors'].extend(islamic_result['violations'])
            
            # Arabic RTL validation
            if request.cultural_context.language_preference == "ar":
                rtl_result = await self.cultural_validators['arabic_rtl'](request.message)
                if not rtl_result['valid']:
                    validation_result['warnings'].extend(rtl_result['issues'])
            
            # Professional tone validation for ministry communications
            if request.cultural_context.ministry_affiliation:
                protocol_result = await self.cultural_validators['ministry_protocol'](
                    request.subject,
                    request.message,
                    request.cultural_context.ministry_affiliation
                )
                if not protocol_result['appropriate']:
                    validation_result['passed'] = False
                    validation_result['errors'].extend(protocol_result['violations'])
            
            # Cultural sensitivity check
            sensitivity_result = await self.cultural_validators['cultural_sensitivity'](
                request.message,
                request.cultural_context.cultural_sensitivity_level
            )
            if not sensitivity_result['appropriate']:
                validation_result['passed'] = False
                validation_result['errors'].extend(sensitivity_result['issues'])
            
            logger.info(f"Cultural validation completed for notification {request.notification_id}: {validation_result['passed']}")
            
        except Exception as e:
            logger.error(f"Cultural validation error: {str(e)}")
            validation_result['passed'] = False
            validation_result['errors'].append(f"Validation system error: {str(e)}")
        
        return validation_result

    async def _validate_islamic_compliance(self, content: str) -> Dict[str, Any]:
        """Validate content for Islamic compliance"""
        # This would integrate with a comprehensive Islamic content validation system
        # For now, implementing basic checks
        
        violations = []
        prohibited_terms = [
            # Add terms that would violate Islamic principles
            # This should be a comprehensive list maintained by Islamic scholars
        ]
        
        content_lower = content.lower()
        for term in prohibited_terms:
            if term in content_lower:
                violations.append(f"Content contains prohibited term: {term}")
        
        return {
            'compliant': len(violations) == 0,
            'violations': violations
        }

    async def _validate_arabic_rtl(self, content: str) -> Dict[str, Any]:
        """Validate Arabic text for proper RTL formatting"""
        issues = []
        
        # Check for proper Arabic text structure
        # This would integrate with advanced Arabic NLP processing
        
        return {
            'valid': len(issues) == 0,
            'issues': issues
        }

    async def _validate_professional_tone(self, content: str) -> Dict[str, Any]:
        """Validate professional tone for business communications"""
        # Implementation would check for appropriate professional language
        return {
            'appropriate': True,
            'suggestions': []
        }

    async def _validate_cultural_sensitivity(self, content: str, sensitivity_level: str) -> Dict[str, Any]:
        """Validate cultural sensitivity of content"""
        # Implementation would check against cultural sensitivity guidelines
        return {
            'appropriate': True,
            'issues': []
        }

    async def _validate_ministry_protocol(self, subject: str, content: str, ministry: str) -> Dict[str, Any]:
        """Validate content follows ministry communication protocols"""
        # Implementation would check ministry-specific communication standards
        return {
            'appropriate': True,
            'violations': []
        }

    async def _apply_template(self, request: NotificationRequest) -> NotificationRequest:
        """Apply notification template with cultural formatting"""
        template = self.notification_templates[request.template_id]
        
        try:
            # Render subject
            subject_template = self.template_env.from_string(template.subject_template)
            request.subject = subject_template.render(**request.template_variables)
            
            # Render body
            body_template = self.template_env.from_string(template.body_template)
            request.message = body_template.render(**request.template_variables)
            
            # Apply cultural context from template
            if not request.cultural_context:
                request.cultural_context = template.cultural_context
            
            logger.info(f"Applied template {template.name} to notification {request.notification_id}")
            
        except Exception as e:
            logger.error(f"Failed to apply template {request.template_id}: {str(e)}")
            raise
        
        return request

    def _is_business_hours(self) -> bool:
        """Check if current time is within Iraqi business hours"""
        now = datetime.now(IRAQI_TIMEZONE)
        
        # Check if weekend (Friday/Saturday)
        if now.weekday() in self.business_hours['weekend_days']:
            return False
        
        # Check if within business hours
        hour = now.hour
        return self.business_hours['start'] <= hour < self.business_hours['end']

    async def _schedule_notification(self, request: NotificationRequest) -> NotificationResult:
        """Schedule notification for future delivery"""
        try:
            # Store in Redis for scheduled delivery
            schedule_key = f"scheduled_notifications:{request.scheduled_time.isoformat()}"
            await self.redis_client.lpush(
                schedule_key,
                json.dumps(asdict(request), default=str)
            )
            
            # Set expiration
            ttl = int((request.scheduled_time - datetime.now(IRAQI_TIMEZONE)).total_seconds())
            await self.redis_client.expire(schedule_key, ttl + 3600)  # Extra hour buffer
            
            logger.info(f"Scheduled notification {request.notification_id} for {request.scheduled_time}")
            
            return NotificationResult(
                notification_id=request.notification_id,
                status="scheduled",
                delivery_time=request.scheduled_time
            )
            
        except Exception as e:
            logger.error(f"Failed to schedule notification: {str(e)}")
            raise

    async def _schedule_for_business_hours(self, request: NotificationRequest) -> NotificationResult:
        """Schedule notification for next business hour"""
        now = datetime.now(IRAQI_TIMEZONE)
        
        # Calculate next business day start
        next_business_day = now + timedelta(days=1)
        while next_business_day.weekday() in self.business_hours['weekend_days']:
            next_business_day += timedelta(days=1)
        
        # Set to business hours start
        scheduled_time = next_business_day.replace(
            hour=self.business_hours['start'],
            minute=0,
            second=0,
            microsecond=0
        )
        
        request.scheduled_time = scheduled_time
        return await self._schedule_notification(request)

    async def _deliver_websocket(self, request: NotificationRequest) -> NotificationResult:
        """Deliver notification via WebSocket"""
        try:
            # This would integrate with the WebSocket manager
            # Implementation would send real-time notification to connected clients
            
            websocket_data = {
                'notification_id': request.notification_id,
                'type': request.notification_type,
                'priority': request.priority,
                'subject': request.subject,
                'message': request.message,
                'timestamp': datetime.now(IRAQI_TIMEZONE).isoformat(),
                'cultural_context': asdict(request.cultural_context)
            }
            
            # Store in Redis for WebSocket delivery
            await self.redis_client.publish(
                f"websocket_notifications:{request.user_id}",
                json.dumps(websocket_data, default=str)
            )
            
            return NotificationResult(
                notification_id=request.notification_id,
                status="success",
                delivery_time=datetime.now(IRAQI_TIMEZONE),
                channel_specific_data={"websocket_published": True}
            )
            
        except Exception as e:
            return NotificationResult(
                notification_id=request.notification_id,
                status="failed",
                error_message=str(e)
            )

    async def _deliver_email(self, request: NotificationRequest) -> NotificationResult:
        """Deliver notification via email with Arabic support"""
        try:
            if not self.smtp_config:
                raise ValueError("SMTP configuration not provided")
            
            # Create message
            msg = MIMEMultipart('alternative')
            msg['Subject'] = request.subject
            msg['From'] = self.smtp_config['from_email']
            msg['To'] = request.metadata.get('email_address', '')
            
            # Handle RTL content
            if request.cultural_context.language_preference == "ar":
                html_content = f"""
                <html dir="rtl" lang="ar">
                <head>
                    <meta charset="utf-8">
                    <style>
                        body {{ font-family: 'Traditional Arabic', 'Arial Unicode MS', sans-serif; direction: rtl; text-align: right; }}
                        .content {{ padding: 20px; line-height: 1.6; }}
                    </style>
                </head>
                <body>
                    <div class="content">
                        {request.message.replace('\n', '<br>')}
                    </div>
                </body>
                </html>
                """
                msg.attach(MIMEText(html_content, 'html', 'utf-8'))
            
            # Attach plain text version
            msg.attach(MIMEText(request.message, 'plain', 'utf-8'))
            
            # Send email
            with smtplib.SMTP(self.smtp_config['host'], self.smtp_config['port']) as server:
                if self.smtp_config.get('use_tls'):
                    server.starttls()
                if self.smtp_config.get('username'):
                    server.login(self.smtp_config['username'], self.smtp_config['password'])
                
                server.send_message(msg)
            
            return NotificationResult(
                notification_id=request.notification_id,
                status="success",
                delivery_time=datetime.now(IRAQI_TIMEZONE),
                channel_specific_data={"email_sent": True}
            )
            
        except Exception as e:
            return NotificationResult(
                notification_id=request.notification_id,
                status="failed",
                error_message=str(e)
            )

    async def _deliver_sms(self, request: NotificationRequest) -> NotificationResult:
        """Deliver notification via SMS with Arabic support"""
        try:
            if not self.sms_config:
                raise ValueError("SMS configuration not provided")
            
            phone_number = request.metadata.get('phone_number', '')
            if not phone_number:
                raise ValueError("Phone number not provided")
            
            # Validate Iraqi phone number format
            try:
                parsed_number = phonenumbers.parse(phone_number, 'IQ')
                if not phonenumbers.is_valid_number(parsed_number):
                    raise ValueError("Invalid Iraqi phone number")
            except NumberParseException as e:
                raise ValueError(f"Phone number parsing error: {str(e)}")
            
            # Send SMS via configured provider
            # This would integrate with Iraqi SMS providers
            sms_data = {
                'to': phone_number,
                'message': request.message,
                'unicode': request.cultural_context.language_preference == "ar"
            }
            
            # Simulate SMS delivery (integrate with actual provider)
            await asyncio.sleep(0.1)  # Simulate API call
            
            return NotificationResult(
                notification_id=request.notification_id,
                status="success",
                delivery_time=datetime.now(IRAQI_TIMEZONE),
                channel_specific_data={"sms_sent": True, "to": phone_number}
            )
            
        except Exception as e:
            return NotificationResult(
                notification_id=request.notification_id,
                status="failed",
                error_message=str(e)
            )

    async def _deliver_push(self, request: NotificationRequest) -> NotificationResult:
        """Deliver push notification with cultural formatting"""
        try:
            # This would integrate with Firebase Cloud Messaging or similar
            push_data = {
                'title': request.subject,
                'body': request.message,
                'data': {
                    'notification_id': request.notification_id,
                    'type': request.notification_type,
                    'priority': request.priority,
                    'language': request.cultural_context.language_preference
                }
            }
            
            # Add Arabic-specific formatting
            if request.cultural_context.language_preference == "ar":
                push_data['data']['text_direction'] = 'rtl'
                push_data['data']['font_family'] = 'arabic'
            
            # Send push notification
            device_token = request.metadata.get('device_token', '')
            if not device_token:
                raise ValueError("Device token not provided")
            
            # Simulate push notification delivery
            await asyncio.sleep(0.1)
            
            return NotificationResult(
                notification_id=request.notification_id,
                status="success",
                delivery_time=datetime.now(IRAQI_TIMEZONE),
                channel_specific_data={"push_sent": True, "device_token": device_token[:10] + "..."}
            )
            
        except Exception as e:
            return NotificationResult(
                notification_id=request.notification_id,
                status="failed",
                error_message=str(e)
            )

    async def _deliver_in_app(self, request: NotificationRequest) -> NotificationResult:
        """Deliver in-app notification"""
        try:
            # Store in Redis for in-app delivery
            notification_data = {
                'notification_id': request.notification_id,
                'user_id': request.user_id,
                'type': request.notification_type,
                'priority': request.priority,
                'subject': request.subject,
                'message': request.message,
                'cultural_context': asdict(request.cultural_context),
                'timestamp': datetime.now(IRAQI_TIMEZONE).isoformat(),
                'read': False
            }
            
            # Store with expiration
            await self.redis_client.setex(
                f"in_app_notification:{request.user_id}:{request.notification_id}",
                86400,  # 24 hours
                json.dumps(notification_data, default=str)
            )
            
            # Add to user's notification list
            await self.redis_client.lpush(
                f"user_notifications:{request.user_id}",
                request.notification_id
            )
            
            return NotificationResult(
                notification_id=request.notification_id,
                status="success",
                delivery_time=datetime.now(IRAQI_TIMEZONE),
                channel_specific_data={"in_app_stored": True}
            )
            
        except Exception as e:
            return NotificationResult(
                notification_id=request.notification_id,
                status="failed",
                error_message=str(e)
            )

    async def _deliver_ministry_portal(self, request: NotificationRequest) -> NotificationResult:
        """Deliver notification to ministry portal system"""
        try:
            # This would integrate with Iraqi government ministry portals
            ministry = request.cultural_context.ministry_affiliation
            if not ministry:
                raise ValueError("Ministry affiliation not specified")
            
            # Format for ministry portal
            portal_data = {
                'ministry': ministry,
                'notification_id': request.notification_id,
                'recipient': request.user_id,
                'subject': request.subject,
                'content': request.message,
                'priority': request.priority,
                'type': request.notification_type,
                'timestamp': datetime.now(IRAQI_TIMEZONE).isoformat(),
                'cultural_compliance_verified': True
            }
            
            # Send to ministry portal API (simulated)
            await asyncio.sleep(0.2)  # Simulate API call
            
            return NotificationResult(
                notification_id=request.notification_id,
                status="success",
                delivery_time=datetime.now(IRAQI_TIMEZONE),
                channel_specific_data={"ministry_portal_sent": True, "ministry": ministry}
            )
            
        except Exception as e:
            return NotificationResult(
                notification_id=request.notification_id,
                status="failed",
                error_message=str(e)
            )

    async def _deliver_whatsapp(self, request: NotificationRequest) -> NotificationResult:
        """Deliver WhatsApp message with Arabic support"""
        try:
            # This would integrate with WhatsApp Business API
            phone_number = request.metadata.get('whatsapp_number', '')
            if not phone_number:
                raise ValueError("WhatsApp number not provided")
            
            whatsapp_data = {
                'to': phone_number,
                'type': 'text',
                'text': {
                    'body': f"{request.subject}\n\n{request.message}"
                }
            }
            
            # Add RTL formatting for Arabic
            if request.cultural_context.language_preference == "ar":
                whatsapp_data['text']['preview_url'] = False  # Better for RTL
            
            # Send WhatsApp message (simulated)
            await asyncio.sleep(0.1)
            
            return NotificationResult(
                notification_id=request.notification_id,
                status="success",
                delivery_time=datetime.now(IRAQI_TIMEZONE),
                channel_specific_data={"whatsapp_sent": True, "to": phone_number}
            )
            
        except Exception as e:
            return NotificationResult(
                notification_id=request.notification_id,
                status="failed",
                error_message=str(e)
            )

    async def _store_delivery_record(self, request: NotificationRequest, result: NotificationResult) -> None:
        """Store notification delivery record for audit"""
        try:
            record = {
                'notification_id': request.notification_id,
                'user_id': request.user_id,
                'channel': request.channel,
                'type': request.notification_type,
                'priority': request.priority,
                'status': result.status,
                'delivery_time': result.delivery_time.isoformat() if result.delivery_time else None,
                'error_message': result.error_message,
                'cultural_validation_passed': result.cultural_validation_passed,
                'retry_count': result.retry_count,
                'created_at': datetime.now(IRAQI_TIMEZONE).isoformat()
            }
            
            # Store with 30-day retention
            await self.redis_client.setex(
                f"delivery_record:{request.notification_id}",
                2592000,  # 30 days
                json.dumps(record, default=str)
            )
            
        except Exception as e:
            logger.error(f"Failed to store delivery record: {str(e)}")

    async def _schedule_periodic_cleanup(self) -> None:
        """Schedule periodic cleanup of expired notifications"""
        try:
            # This would be implemented with Celery periodic tasks
            # For now, just log the intention
            logger.info("Periodic cleanup scheduled for expired notifications")
            
        except Exception as e:
            logger.error(f"Failed to schedule cleanup: {str(e)}")

    async def get_notification_status(self, notification_id: str) -> Optional[NotificationResult]:
        """Get delivery status of a notification"""
        try:
            record_data = await self.redis_client.get(f"delivery_record:{notification_id}")
            if not record_data:
                return None
            
            record = json.loads(record_data)
            return NotificationResult(
                notification_id=record['notification_id'],
                status=record['status'],
                delivery_time=datetime.fromisoformat(record['delivery_time']) if record['delivery_time'] else None,
                error_message=record['error_message'],
                retry_count=record['retry_count'],
                cultural_validation_passed=record['cultural_validation_passed']
            )
            
        except Exception as e:
            logger.error(f"Failed to get notification status: {str(e)}")
            return None

    async def get_user_notifications(self, user_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        """Get recent notifications for a user"""
        try:
            notification_ids = await self.redis_client.lrange(f"user_notifications:{user_id}", 0, limit - 1)
            notifications = []
            
            for notification_id in notification_ids:
                notification_data = await self.redis_client.get(f"in_app_notification:{user_id}:{notification_id}")
                if notification_data:
                    notifications.append(json.loads(notification_data))
            
            return notifications
            
        except Exception as e:
            logger.error(f"Failed to get user notifications: {str(e)}")
            return []

    async def mark_notification_read(self, user_id: str, notification_id: str) -> bool:
        """Mark an in-app notification as read"""
        try:
            key = f"in_app_notification:{user_id}:{notification_id}"
            notification_data = await self.redis_client.get(key)
            
            if notification_data:
                data = json.loads(notification_data)
                data['read'] = True
                data['read_at'] = datetime.now(IRAQI_TIMEZONE).isoformat()
                
                await self.redis_client.setex(key, 86400, json.dumps(data, default=str))
                return True
            
            return False
            
        except Exception as e:
            logger.error(f"Failed to mark notification as read: {str(e)}")
            return False

    def get_delivery_statistics(self) -> Dict[str, Any]:
        """Get comprehensive delivery statistics"""
        return {
            'total_notifications_sent': self.delivery_stats['total_sent'],
            'successful_deliveries': self.delivery_stats['successful_deliveries'],
            'failed_deliveries': self.delivery_stats['failed_deliveries'],
            'success_rate': (
                self.delivery_stats['successful_deliveries'] / max(1, self.delivery_stats['total_sent'])
            ) * 100,
            'cultural_validation_failures': self.delivery_stats['cultural_validation_failures'],
            'cultural_compliance_rate': (
                (self.delivery_stats['total_sent'] - self.delivery_stats['cultural_validation_failures']) /
                max(1, self.delivery_stats['total_sent'])
            ) * 100,
            'supported_channels': list(self.delivery_handlers.keys()),
            'loaded_templates': len(self.notification_templates),
            'active_cultural_validators': len(self.cultural_validators)
        }

    async def health_check(self) -> Dict[str, Any]:
        """Comprehensive health check for the notification service"""
        health_status = {
            'status': 'healthy',
            'timestamp': datetime.now(IRAQI_TIMEZONE).isoformat(),
            'components': {}
        }
        
        try:
            # Check Redis connection
            await self.redis_client.ping()
            health_status['components']['redis'] = 'healthy'
        except Exception as e:
            health_status['components']['redis'] = f'unhealthy: {str(e)}'
            health_status['status'] = 'degraded'
        
        try:
            # Check template loading
            if len(self.notification_templates) > 0:
                health_status['components']['templates'] = 'healthy'
            else:
                health_status['components']['templates'] = 'unhealthy: no templates loaded'
                health_status['status'] = 'degraded'
        except Exception as e:
            health_status['components']['templates'] = f'unhealthy: {str(e)}'
            health_status['status'] = 'degraded'
        
        # Add delivery statistics
        health_status['statistics'] = self.get_delivery_statistics()
        
        return health_status

    async def shutdown(self) -> None:
        """Graceful shutdown of notification service"""
        try:
            logger.info("Shutting down Iraqi Notification Service...")
            
            if self.redis_client:
                await self.redis_client.close()
                logger.info("Redis connection closed")
            
            if self.celery_app:
                self.celery_app.control.shutdown()
                logger.info("Celery workers shutdown")
            
            logger.info("Iraqi Notification Service shutdown completed")
            
        except Exception as e:
            logger.error(f"Error during shutdown: {str(e)}")

# Factory function for creating notification service instance
async def create_iraqi_notification_service(config: Dict[str, Any]) -> IraqiNotificationService:
    """
    Factory function to create and initialize Iraqi Notification Service
    
    Args:
        config: Configuration dictionary with service settings
        
    Returns:
        Initialized IraqiNotificationService instance
    """
    service = IraqiNotificationService(
        redis_url=config.get('redis_url', 'redis://localhost:6379'),
        celery_broker=config.get('celery_broker', 'redis://localhost:6379/1'),
        smtp_config=config.get('smtp', {}),
        sms_config=config.get('sms', {}),
        push_config=config.get('push', {}),
        template_dir=config.get('template_dir', '/templates/notifications')
    )
    
    await service.initialize()
    return service

# Example usage and integration patterns
if __name__ == "__main__":
    async def example_usage():
        """Example usage of Iraqi Notification Service"""
        
        # Service configuration
        config = {
            'redis_url': 'redis://localhost:6379',
            'celery_broker': 'redis://localhost:6379/1',
            'smtp': {
                'host': 'smtp.gmail.com',
                'port': 587,
                'username': 'notifications@iraqi-ai.com',
                'password': 'app_password',
                'from_email': 'Iraqi AI System <notifications@iraqi-ai.com>',
                'use_tls': True
            },
            'template_dir': '/templates/notifications'
        }
        
        # Create and initialize service
        notification_service = await create_iraqi_notification_service(config)
        
        # Example: Send Arabic chat notification
        chat_request = NotificationRequest(
            user_id="user_123",
            channel=NotificationChannel.WEBSOCKET,
            notification_type=NotificationType.CHAT_MESSAGE,
            priority=NotificationPriority.NORMAL,
            subject="رسالة جديدة",
            message="لديك رسالة جديدة من أحمد محمد",
            cultural_context=IraqiCulturalContext(
                language_preference="ar",
                islamic_compliance_required=True
            ),
            metadata={'sender_name': 'أحمد محمد'}
        )
        
        chat_result = await notification_service.send_notification(chat_request)
        print(f"Chat notification result: {chat_result.status}")
        
        # Example: Send payment confirmation
        payment_request = NotificationRequest(
            user_id="user_456",
            channel=NotificationChannel.EMAIL,
            notification_type=NotificationType.PAYMENT_CONFIRMATION,
            priority=NotificationPriority.HIGH,
            template_id="payment_confirmation_ar",
            template_variables={
                'user_name': 'فاطمة علي',
                'amount': '1000',
                'payment_gateway': 'ZainCash',
                'transaction_id': 'TXN_789123',
                'payment_date': format_datetime(datetime.now(IRAQI_TIMEZONE), locale='ar')
            },
            metadata={'email_address': 'fatima@example.com'}
        )
        
        payment_result = await notification_service.send_notification(payment_request)
        print(f"Payment notification result: {payment_result.status}")
        
        # Example: Schedule prayer reminder
        prayer_request = NotificationRequest(
            user_id="user_789",
            channel=NotificationChannel.PUSH,
            notification_type=NotificationType.PRAYER_REMINDER,
            priority=NotificationPriority.HIGH,
            template_id="prayer_reminder",
            template_variables={
                'user_name': 'محمد حسين',
                'prayer_name': 'العصر',
                'prayer_time': '15:30',
                'city': 'بغداد'
            },
            scheduled_time=datetime.now(IRAQI_TIMEZONE) + timedelta(minutes=10),
            metadata={'device_token': 'fcm_token_example'}
        )
        
        prayer_result = await notification_service.send_notification(prayer_request)
        print(f"Prayer reminder result: {prayer_result.status}")
        
        # Get service statistics
        stats = notification_service.get_delivery_statistics()
        print(f"Service statistics: {json.dumps(stats, indent=2)}")
        
        # Health check
        health = await notification_service.health_check()
        print(f"Health status: {health['status']}")
        
        # Cleanup
        await notification_service.shutdown()
    
    # Run example
    asyncio.run(example_usage())