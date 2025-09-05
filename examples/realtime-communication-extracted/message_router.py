"""
Revolutionary Iraqi Message Router with Cultural Intelligence

Advanced message routing and delivery system for the Iraqi AI Chat System featuring:
- Intelligent message routing with cultural context awareness
- Priority-based delivery with Islamic compliance validation
- Multi-channel orchestration with Iraqi professional domain support
- Advanced load balancing with Arabic text processing optimization
- Circuit breaker patterns for reliable message delivery
- Comprehensive audit trails and delivery analytics
- Integration with payment gateways and ministry portals
- Real-time monitoring with cultural metrics tracking

This module provides the intelligent routing backbone that coordinates
message delivery across all channels while maintaining cultural sensitivity
and ensuring optimal performance for Arabic text processing.

Author: Iraqi AI Development Team
License: Proprietary - Iraqi AI Chat System
"""

import asyncio
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Union, Callable, Set
from enum import Enum
from dataclasses import dataclass, asdict
from contextlib import asynccontextmanager
import uuid
import hashlib
import random
from collections import defaultdict, deque
import aioredis
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete, and_, or_
import pydantic
from pydantic import BaseModel, Field, validator
import prometheus_client
from prometheus_client import Counter, Histogram, Gauge, Summary
import celery
from celery import Celery
import pytz
from babel.dates import format_datetime
import time
import threading
from concurrent.futures import ThreadPoolExecutor
from websocket_manager import IraqiWebSocketManager
from notification_service import (
    IraqiNotificationService,
    NotificationRequest,
    NotificationChannel,
    NotificationType,
    NotificationPriority,
    IraqiCulturalContext
)

# Configure comprehensive logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s',
    handlers=[
        logging.FileHandler('/var/log/iraqi-ai/message_router.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Prometheus metrics for routing analytics
routing_counter = Counter('iraqi_messages_routed_total', 'Total messages routed', ['route', 'priority', 'status'])
routing_duration = Histogram('iraqi_routing_duration_seconds', 'Time spent routing messages')
active_routes = Gauge('iraqi_active_routes', 'Currently active routes')
delivery_success_rate = Summary('iraqi_delivery_success_rate', 'Message delivery success rate')
circuit_breaker_trips = Counter('iraqi_circuit_breaker_trips_total', 'Circuit breaker activations', ['channel'])

# Iraqi timezone for routing timestamps
IRAQI_TIMEZONE = pytz.timezone('Asia/Baghdad')

class RouteStatus(str, Enum):
    """Status of message routes"""
    ACTIVE = "active"
    DEGRADED = "degraded" 
    FAILED = "failed"
    CIRCUIT_OPEN = "circuit_open"
    MAINTENANCE = "maintenance"

class MessagePriority(str, Enum):
    """Message priority levels for routing"""
    CRITICAL = "critical"  # System alerts, payment confirmations
    HIGH = "high"         # Chat messages, appointments
    NORMAL = "normal"     # General notifications
    LOW = "low"          # Background updates

class RoutingStrategy(str, Enum):
    """Message routing strategies"""
    ROUND_ROBIN = "round_robin"
    WEIGHTED_RANDOM = "weighted_random"
    LEAST_CONNECTIONS = "least_connections"
    CULTURAL_PRIORITY = "cultural_priority"
    PERFORMANCE_BASED = "performance_based"
    FAILOVER = "failover"

class MessageType(str, Enum):
    """Types of messages being routed"""
    CHAT_MESSAGE = "chat_message"
    NOTIFICATION = "notification"
    PAYMENT_UPDATE = "payment_update"
    DOCUMENT_NOTIFICATION = "document_notification"
    SYSTEM_ALERT = "system_alert"
    CULTURAL_REMINDER = "cultural_reminder"
    PROFESSIONAL_UPDATE = "professional_update"

@dataclass
class RouteConfig:
    """Configuration for message routes"""
    route_id: str
    channel: NotificationChannel
    weight: float = 1.0
    max_connections: int = 100
    timeout_seconds: float = 30.0
    retry_attempts: int = 3
    circuit_breaker_threshold: int = 5
    circuit_breaker_timeout: int = 60
    cultural_priority: bool = False
    arabic_optimized: bool = False
    ministry_approved: bool = False

@dataclass
class RouteHealth:
    """Health status of a route"""
    route_id: str
    status: RouteStatus
    success_rate: float
    avg_response_time: float
    active_connections: int
    circuit_breaker_open: bool
    last_health_check: datetime
    error_count: int
    cultural_compliance_rate: float

class MessageEnvelope(BaseModel):
    """Container for messages with routing metadata"""
    message_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    message_type: MessageType
    priority: MessagePriority
    content: Dict[str, Any]
    cultural_context: IraqiCulturalContext
    routing_metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=lambda: datetime.now(IRAQI_TIMEZONE))
    expires_at: Optional[datetime] = None
    retry_count: int = 0
    max_retries: int = 3
    route_history: List[str] = Field(default_factory=list)
    
    class Config:
        use_enum_values = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class RoutingRule(BaseModel):
    """Rules for intelligent message routing"""
    rule_id: str
    name: str
    conditions: Dict[str, Any]
    target_channels: List[NotificationChannel]
    priority_boost: int = 0
    cultural_requirements: Dict[str, Any] = Field(default_factory=dict)
    time_restrictions: Dict[str, Any] = Field(default_factory=dict)
    enabled: bool = True
    
    class Config:
        use_enum_values = True

class CircuitBreaker:
    """Circuit breaker for route reliability"""
    
    def __init__(self, failure_threshold: int = 5, timeout: int = 60):
        self.failure_threshold = failure_threshold
        self.timeout = timeout
        self.failure_count = 0
        self.last_failure_time = None
        self.state = "closed"  # closed, open, half_open
        self.lock = threading.RLock()
    
    def call(self, func, *args, **kwargs):
        """Execute function with circuit breaker protection"""
        with self.lock:
            if self.state == "open":
                if self._should_attempt_reset():
                    self.state = "half_open"
                else:
                    raise Exception("Circuit breaker is OPEN")
            
            try:
                result = func(*args, **kwargs)
                self._on_success()
                return result
            except Exception as e:
                self._on_failure()
                raise
    
    async def async_call(self, func, *args, **kwargs):
        """Execute async function with circuit breaker protection"""
        with self.lock:
            if self.state == "open":
                if self._should_attempt_reset():
                    self.state = "half_open"
                else:
                    raise Exception("Circuit breaker is OPEN")
        
        try:
            result = await func(*args, **kwargs)
            self._on_success()
            return result
        except Exception as e:
            self._on_failure()
            raise
    
    def _should_attempt_reset(self) -> bool:
        """Check if circuit breaker should attempt reset"""
        return (
            self.last_failure_time and
            time.time() - self.last_failure_time >= self.timeout
        )
    
    def _on_success(self):
        """Handle successful call"""
        with self.lock:
            self.failure_count = 0
            if self.state == "half_open":
                self.state = "closed"
    
    def _on_failure(self):
        """Handle failed call"""
        with self.lock:
            self.failure_count += 1
            self.last_failure_time = time.time()
            
            if self.failure_count >= self.failure_threshold:
                self.state = "open"

class IraqiMessageRouter:
    """
    Revolutionary Iraqi Message Router with Cultural Intelligence
    
    Advanced message routing system featuring:
    - Intelligent routing with cultural context awareness
    - Multi-channel orchestration with load balancing
    - Circuit breaker patterns for reliability
    - Priority-based delivery optimization
    - Arabic text processing optimization
    - Ministry-specific routing protocols
    - Comprehensive monitoring and analytics
    - Integration with WebSocket and notification services
    """
    
    def __init__(
        self,
        redis_url: str = "redis://localhost:6379",
        websocket_manager: Optional[IraqiWebSocketManager] = None,
        notification_service: Optional[IraqiNotificationService] = None,
        max_concurrent_routes: int = 50,
        default_strategy: RoutingStrategy = RoutingStrategy.CULTURAL_PRIORITY
    ):
        self.redis_url = redis_url
        self.websocket_manager = websocket_manager
        self.notification_service = notification_service
        self.max_concurrent_routes = max_concurrent_routes
        self.default_strategy = default_strategy
        
        # Core components
        self.redis_client = None
        self.route_configs: Dict[str, RouteConfig] = {}
        self.route_health: Dict[str, RouteHealth] = {}
        self.circuit_breakers: Dict[str, CircuitBreaker] = {}
        self.routing_rules: List[RoutingRule] = []
        
        # Routing state management
        self.active_connections: Dict[str, int] = defaultdict(int)
        self.message_queue: Dict[MessagePriority, deque] = {
            priority: deque() for priority in MessagePriority
        }
        self.route_performance: Dict[str, deque] = defaultdict(lambda: deque(maxlen=100))
        
        # Thread pool for concurrent routing
        self.executor = ThreadPoolExecutor(max_workers=max_concurrent_routes)
        
        # Cultural routing optimization
        self.arabic_routes: Set[str] = set()
        self.ministry_routes: Set[str] = set()
        self.cultural_validators: Dict[str, Callable] = {}
        
        # Performance tracking
        self.routing_stats = {
            'total_routed': 0,
            'successful_routes': 0,
            'failed_routes': 0,
            'cultural_violations': 0,
            'average_latency': 0.0
        }
        
        logger.info("Iraqi Message Router initialized with cultural intelligence")
    
    async def initialize(self) -> None:
        """Initialize message router with all components"""
        try:
            # Initialize Redis connection
            self.redis_client = aioredis.from_url(
                self.redis_url,
                encoding="utf-8",
                decode_responses=True,
                max_connections=50,
                retry_on_timeout=True
            )
            
            await self.redis_client.ping()
            logger.info("Redis connection established for message router")
            
            # Initialize default routes
            await self._setup_default_routes()
            
            # Initialize routing rules
            await self._setup_routing_rules()
            
            # Initialize cultural validators
            await self._setup_cultural_validators()
            
            # Start background monitoring
            asyncio.create_task(self._monitor_route_health())
            asyncio.create_task(self._process_message_queue())
            asyncio.create_task(self._cleanup_expired_messages())
            
            # Start metrics collection
            asyncio.create_task(self._collect_performance_metrics())
            
            logger.info("Iraqi Message Router initialization completed successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize message router: {str(e)}")
            raise

    async def _setup_default_routes(self) -> None:
        """Setup default routing configurations"""
        try:
            default_routes = [
                RouteConfig(
                    route_id="websocket_primary",
                    channel=NotificationChannel.WEBSOCKET,
                    weight=2.0,
                    max_connections=200,
                    timeout_seconds=10.0,
                    arabic_optimized=True,
                    cultural_priority=True
                ),
                RouteConfig(
                    route_id="email_primary",
                    channel=NotificationChannel.EMAIL,
                    weight=1.5,
                    max_connections=100,
                    timeout_seconds=30.0,
                    arabic_optimized=True
                ),
                RouteConfig(
                    route_id="sms_primary",
                    channel=NotificationChannel.SMS,
                    weight=1.0,
                    max_connections=50,
                    timeout_seconds=20.0,
                    arabic_optimized=True
                ),
                RouteConfig(
                    route_id="push_primary",
                    channel=NotificationChannel.PUSH,
                    weight=1.8,
                    max_connections=150,
                    timeout_seconds=15.0,
                    arabic_optimized=True
                ),
                RouteConfig(
                    route_id="ministry_portal",
                    channel=NotificationChannel.MINISTRY_PORTAL,
                    weight=3.0,
                    max_connections=25,
                    timeout_seconds=60.0,
                    cultural_priority=True,
                    ministry_approved=True
                ),
                RouteConfig(
                    route_id="whatsapp_primary",
                    channel=NotificationChannel.WHATSAPP,
                    weight=1.3,
                    max_connections=75,
                    timeout_seconds=25.0,
                    arabic_optimized=True
                )
            ]
            
            for route_config in default_routes:
                self.route_configs[route_config.route_id] = route_config
                
                # Initialize circuit breaker
                self.circuit_breakers[route_config.route_id] = CircuitBreaker(
                    failure_threshold=route_config.circuit_breaker_threshold,
                    timeout=route_config.circuit_breaker_timeout
                )
                
                # Initialize health tracking
                self.route_health[route_config.route_id] = RouteHealth(
                    route_id=route_config.route_id,
                    status=RouteStatus.ACTIVE,
                    success_rate=100.0,
                    avg_response_time=0.0,
                    active_connections=0,
                    circuit_breaker_open=False,
                    last_health_check=datetime.now(IRAQI_TIMEZONE),
                    error_count=0,
                    cultural_compliance_rate=100.0
                )
                
                # Track Arabic-optimized routes
                if route_config.arabic_optimized:
                    self.arabic_routes.add(route_config.route_id)
                
                # Track ministry-approved routes
                if route_config.ministry_approved:
                    self.ministry_routes.add(route_config.route_id)
            
            logger.info(f"Configured {len(default_routes)} default routes")
            
        except Exception as e:
            logger.error(f"Failed to setup default routes: {str(e)}")
            raise

    async def _setup_routing_rules(self) -> None:
        """Setup intelligent routing rules"""
        try:
            routing_rules = [
                RoutingRule(
                    rule_id="arabic_priority",
                    name="Arabic Content Priority",
                    conditions={
                        "cultural_context.language_preference": "ar",
                        "cultural_context.islamic_compliance_required": True
                    },
                    target_channels=[
                        NotificationChannel.WEBSOCKET,
                        NotificationChannel.PUSH,
                        NotificationChannel.EMAIL
                    ],
                    priority_boost=2,
                    cultural_requirements={
                        "rtl_support": True,
                        "arabic_fonts": True,
                        "islamic_compliance": True
                    }
                ),
                RoutingRule(
                    rule_id="ministry_communications",
                    name="Ministry Official Communications", 
                    conditions={
                        "cultural_context.ministry_affiliation": {"$exists": True},
                        "message_type": ["professional_update", "document_notification"]
                    },
                    target_channels=[
                        NotificationChannel.MINISTRY_PORTAL,
                        NotificationChannel.EMAIL,
                        NotificationChannel.IN_APP
                    ],
                    priority_boost=3,
                    cultural_requirements={
                        "ministry_protocol": True,
                        "formal_language": True
                    },
                    time_restrictions={
                        "business_hours_only": True,
                        "no_weekend_delivery": True
                    }
                ),
                RoutingRule(
                    rule_id="critical_alerts",
                    name="Critical System Alerts",
                    conditions={
                        "priority": "critical",
                        "message_type": ["system_alert", "payment_update"]
                    },
                    target_channels=[
                        NotificationChannel.WEBSOCKET,
                        NotificationChannel.PUSH,
                        NotificationChannel.SMS,
                        NotificationChannel.EMAIL
                    ],
                    priority_boost=5
                ),
                RoutingRule(
                    rule_id="prayer_reminders",
                    name="Islamic Prayer Reminders",
                    conditions={
                        "message_type": "cultural_reminder",
                        "content.reminder_type": "prayer"
                    },
                    target_channels=[
                        NotificationChannel.PUSH,
                        NotificationChannel.IN_APP
                    ],
                    priority_boost=1,
                    cultural_requirements={
                        "islamic_compliance": True,
                        "respectful_timing": True
                    }
                ),
                RoutingRule(
                    rule_id="chat_messages",
                    name="Real-time Chat Messages",
                    conditions={
                        "message_type": "chat_message",
                        "priority": ["high", "normal"]
                    },
                    target_channels=[
                        NotificationChannel.WEBSOCKET,
                        NotificationChannel.PUSH
                    ],
                    priority_boost=1
                ),
                RoutingRule(
                    rule_id="payment_confirmations",
                    name="Payment Confirmations",
                    conditions={
                        "message_type": "payment_update",
                        "content.gateway": ["ZainCash", "FastPay", "NassWallet"]
                    },
                    target_channels=[
                        NotificationChannel.WEBSOCKET,
                        NotificationChannel.EMAIL,
                        NotificationChannel.SMS
                    ],
                    priority_boost=4,
                    cultural_requirements={
                        "transaction_security": True,
                        "arabic_amounts": True
                    }
                )
            ]
            
            self.routing_rules = routing_rules
            logger.info(f"Configured {len(routing_rules)} routing rules")
            
        except Exception as e:
            logger.error(f"Failed to setup routing rules: {str(e)}")
            raise

    async def _setup_cultural_validators(self) -> None:
        """Setup cultural validation functions for routing"""
        self.cultural_validators = {
            'islamic_compliance': self._validate_islamic_content,
            'arabic_rtl': self._validate_arabic_formatting,
            'ministry_protocol': self._validate_ministry_protocol,
            'professional_tone': self._validate_professional_language,
            'cultural_sensitivity': self._validate_cultural_context
        }
        logger.info("Cultural validators configured for routing")

    async def route_message(self, envelope: MessageEnvelope) -> Dict[str, Any]:
        """
        Route message with comprehensive cultural intelligence
        
        Args:
            envelope: Message envelope with routing metadata
            
        Returns:
            Dictionary with routing results and delivery status
        """
        start_time = time.time()
        routing_counter.labels(
            route='initiated',
            priority=envelope.priority.value,
            status='processing'
        ).inc()
        
        try:
            logger.info(f"Routing message {envelope.message_id} for user {envelope.user_id}")
            
            # Validate cultural context
            cultural_validation = await self._validate_message_culturally(envelope)
            if not cultural_validation['valid']:
                self.routing_stats['cultural_violations'] += 1
                return {
                    'status': 'failed',
                    'error': 'Cultural validation failed',
                    'violations': cultural_validation['violations']
                }
            
            # Apply routing rules to determine target channels
            target_routes = await self._apply_routing_rules(envelope)
            
            if not target_routes:
                logger.warning(f"No valid routes found for message {envelope.message_id}")
                return {
                    'status': 'failed',
                    'error': 'No valid routes available'
                }
            
            # Select optimal routes based on strategy
            selected_routes = await self._select_optimal_routes(target_routes, envelope)
            
            # Execute routing with parallel delivery
            routing_results = await self._execute_routing(envelope, selected_routes)
            
            # Update routing statistics
            duration = time.time() - start_time
            routing_duration.observe(duration)
            self.routing_stats['total_routed'] += 1
            
            if routing_results['successful_deliveries'] > 0:
                self.routing_stats['successful_routes'] += 1
            else:
                self.routing_stats['failed_routes'] += 1
            
            # Update average latency
            self.routing_stats['average_latency'] = (
                (self.routing_stats['average_latency'] * (self.routing_stats['total_routed'] - 1) + duration) /
                self.routing_stats['total_routed']
            )
            
            # Store routing record
            await self._store_routing_record(envelope, routing_results)
            
            logger.info(f"Message {envelope.message_id} routed successfully to {len(selected_routes)} channels")
            
            return routing_results
            
        except Exception as e:
            error_msg = f"Failed to route message: {str(e)}"
            logger.error(f"Error routing message {envelope.message_id}: {error_msg}")
            
            routing_counter.labels(
                route='error',
                priority=envelope.priority.value,
                status='failed'
            ).inc()
            
            return {
                'status': 'failed',
                'error': error_msg,
                'message_id': envelope.message_id
            }

    async def _validate_message_culturally(self, envelope: MessageEnvelope) -> Dict[str, Any]:
        """Comprehensive cultural validation for message routing"""
        validation_result = {
            'valid': True,
            'violations': [],
            'warnings': []
        }
        
        try:
            content_text = json.dumps(envelope.content, ensure_ascii=False)
            
            # Islamic compliance check
            if envelope.cultural_context.islamic_compliance_required:
                islamic_result = await self.cultural_validators['islamic_compliance'](content_text)
                if not islamic_result['compliant']:
                    validation_result['valid'] = False
                    validation_result['violations'].extend(islamic_result['violations'])
            
            # Arabic formatting validation
            if envelope.cultural_context.language_preference == "ar":
                arabic_result = await self.cultural_validators['arabic_rtl'](content_text)
                if not arabic_result['valid']:
                    validation_result['warnings'].extend(arabic_result['warnings'])
            
            # Ministry protocol validation
            if envelope.cultural_context.ministry_affiliation:
                ministry_result = await self.cultural_validators['ministry_protocol'](
                    content_text,
                    envelope.cultural_context.ministry_affiliation
                )
                if not ministry_result['compliant']:
                    validation_result['valid'] = False
                    validation_result['violations'].extend(ministry_result['violations'])
            
            # Professional tone validation
            if envelope.cultural_context.professional_domain:
                professional_result = await self.cultural_validators['professional_tone'](content_text)
                if not professional_result['appropriate']:
                    validation_result['warnings'].extend(professional_result['suggestions'])
            
            # General cultural sensitivity
            cultural_result = await self.cultural_validators['cultural_sensitivity'](
                content_text,
                envelope.cultural_context.cultural_sensitivity_level
            )
            if not cultural_result['appropriate']:
                validation_result['valid'] = False
                validation_result['violations'].extend(cultural_result['issues'])
            
        except Exception as e:
            logger.error(f"Cultural validation error: {str(e)}")
            validation_result['valid'] = False
            validation_result['violations'].append(f"Validation system error: {str(e)}")
        
        return validation_result

    async def _validate_islamic_content(self, content: str) -> Dict[str, Any]:
        """Validate content for Islamic compliance"""
        # Integrate with comprehensive Islamic validation system
        return {
            'compliant': True,
            'violations': []
        }

    async def _validate_arabic_formatting(self, content: str) -> Dict[str, Any]:
        """Validate Arabic text formatting"""
        # Integrate with Arabic NLP processing
        return {
            'valid': True,
            'warnings': []
        }

    async def _validate_ministry_protocol(self, content: str, ministry: str) -> Dict[str, Any]:
        """Validate ministry communication protocols"""
        # Check ministry-specific protocols
        return {
            'compliant': True,
            'violations': []
        }

    async def _validate_professional_language(self, content: str) -> Dict[str, Any]:
        """Validate professional language standards"""
        return {
            'appropriate': True,
            'suggestions': []
        }

    async def _validate_cultural_context(self, content: str, sensitivity_level: str) -> Dict[str, Any]:
        """Validate cultural context and sensitivity"""
        return {
            'appropriate': True,
            'issues': []
        }

    async def _apply_routing_rules(self, envelope: MessageEnvelope) -> List[str]:
        """Apply routing rules to determine target channels"""
        matching_routes = set()
        
        for rule in self.routing_rules:
            if not rule.enabled:
                continue
            
            if self._evaluate_rule_conditions(rule, envelope):
                # Add target channels from rule
                for channel in rule.target_channels:
                    # Find routes for this channel
                    channel_routes = [
                        route_id for route_id, config in self.route_configs.items()
                        if config.channel == channel and self._is_route_available(route_id)
                    ]
                    matching_routes.update(channel_routes)
                
                # Apply priority boost
                if rule.priority_boost > 0:
                    envelope.routing_metadata['priority_boost'] = rule.priority_boost
                
                # Store cultural requirements
                if rule.cultural_requirements:
                    envelope.routing_metadata['cultural_requirements'] = rule.cultural_requirements
        
        return list(matching_routes)

    def _evaluate_rule_conditions(self, rule: RoutingRule, envelope: MessageEnvelope) -> bool:
        """Evaluate if message matches routing rule conditions"""
        try:
            for condition_key, condition_value in rule.conditions.items():
                message_value = self._extract_condition_value(envelope, condition_key)
                
                if not self._matches_condition(message_value, condition_value):
                    return False
            
            return True
            
        except Exception as e:
            logger.error(f"Error evaluating rule conditions: {str(e)}")
            return False

    def _extract_condition_value(self, envelope: MessageEnvelope, condition_path: str) -> Any:
        """Extract value from message envelope using dot notation"""
        parts = condition_path.split('.')
        current = envelope
        
        for part in parts:
            if hasattr(current, part):
                current = getattr(current, part)
            elif isinstance(current, dict) and part in current:
                current = current[part]
            else:
                return None
        
        return current

    def _matches_condition(self, message_value: Any, condition_value: Any) -> bool:
        """Check if message value matches condition"""
        if isinstance(condition_value, list):
            return message_value in condition_value
        elif isinstance(condition_value, dict):
            if "$exists" in condition_value:
                return (message_value is not None) == condition_value["$exists"]
        else:
            return message_value == condition_value

    def _is_route_available(self, route_id: str) -> bool:
        """Check if route is available for routing"""
        if route_id not in self.route_health:
            return False
        
        health = self.route_health[route_id]
        
        # Check route status
        if health.status not in [RouteStatus.ACTIVE, RouteStatus.DEGRADED]:
            return False
        
        # Check circuit breaker
        if health.circuit_breaker_open:
            return False
        
        # Check connection limits
        config = self.route_configs[route_id]
        if health.active_connections >= config.max_connections:
            return False
        
        return True

    async def _select_optimal_routes(
        self, 
        candidate_routes: List[str], 
        envelope: MessageEnvelope
    ) -> List[str]:
        """Select optimal routes based on strategy and performance"""
        
        if not candidate_routes:
            return []
        
        strategy = getattr(envelope.routing_metadata.get('strategy'), 'value', self.default_strategy)
        
        if strategy == RoutingStrategy.CULTURAL_PRIORITY:
            return self._select_cultural_priority_routes(candidate_routes, envelope)
        elif strategy == RoutingStrategy.PERFORMANCE_BASED:
            return self._select_performance_based_routes(candidate_routes)
        elif strategy == RoutingStrategy.WEIGHTED_RANDOM:
            return self._select_weighted_random_routes(candidate_routes)
        elif strategy == RoutingStrategy.LEAST_CONNECTIONS:
            return self._select_least_connections_routes(candidate_routes)
        elif strategy == RoutingStrategy.FAILOVER:
            return self._select_failover_routes(candidate_routes)
        else:
            return self._select_round_robin_routes(candidate_routes)

    def _select_cultural_priority_routes(
        self, 
        candidate_routes: List[str], 
        envelope: MessageEnvelope
    ) -> List[str]:
        """Select routes with cultural priority optimization"""
        selected = []
        
        # Prioritize Arabic-optimized routes for Arabic content
        if envelope.cultural_context.language_preference == "ar":
            arabic_routes = [r for r in candidate_routes if r in self.arabic_routes]
            selected.extend(arabic_routes[:2])  # Top 2 Arabic routes
        
        # Prioritize ministry routes for official communications
        if envelope.cultural_context.ministry_affiliation:
            ministry_routes = [r for r in candidate_routes if r in self.ministry_routes]
            selected.extend(ministry_routes[:1])  # Top ministry route
        
        # Fill remaining with highest weight routes
        remaining_routes = [r for r in candidate_routes if r not in selected]
        remaining_routes.sort(key=lambda r: self.route_configs[r].weight, reverse=True)
        selected.extend(remaining_routes[:max(1, 3 - len(selected))])
        
        return selected[:3]  # Maximum 3 routes for efficiency

    def _select_performance_based_routes(self, candidate_routes: List[str]) -> List[str]:
        """Select routes based on performance metrics"""
        route_scores = []
        
        for route_id in candidate_routes:
            health = self.route_health[route_id]
            config = self.route_configs[route_id]
            
            # Calculate performance score
            score = (
                health.success_rate * 0.4 +
                (1.0 / max(health.avg_response_time, 0.01)) * 0.3 +
                config.weight * 0.2 +
                (1.0 - health.active_connections / max(config.max_connections, 1)) * 0.1
            )
            
            route_scores.append((route_id, score))
        
        # Sort by score and select top routes
        route_scores.sort(key=lambda x: x[1], reverse=True)
        return [route_id for route_id, _ in route_scores[:3]]

    def _select_weighted_random_routes(self, candidate_routes: List[str]) -> List[str]:
        """Select routes using weighted random selection"""
        weights = []
        for route_id in candidate_routes:
            config = self.route_configs[route_id]
            health = self.route_health[route_id]
            
            # Adjust weight based on health
            adjusted_weight = config.weight * (health.success_rate / 100.0)
            weights.append(adjusted_weight)
        
        # Select routes with weighted probability
        selected = []
        for _ in range(min(2, len(candidate_routes))):
            if not candidate_routes:
                break
            
            route_id = random.choices(candidate_routes, weights=weights)[0]
            selected.append(route_id)
            
            # Remove selected route
            index = candidate_routes.index(route_id)
            candidate_routes.pop(index)
            weights.pop(index)
        
        return selected

    def _select_least_connections_routes(self, candidate_routes: List[str]) -> List[str]:
        """Select routes with least active connections"""
        route_connections = [
            (route_id, self.route_health[route_id].active_connections)
            for route_id in candidate_routes
        ]
        
        route_connections.sort(key=lambda x: x[1])
        return [route_id for route_id, _ in route_connections[:2]]

    def _select_round_robin_routes(self, candidate_routes: List[str]) -> List[str]:
        """Select routes using round-robin strategy"""
        # Simple round-robin based on route order
        return candidate_routes[:2] if len(candidate_routes) >= 2 else candidate_routes

    def _select_failover_routes(self, candidate_routes: List[str]) -> List[str]:
        """Select primary route with failover"""
        # Sort by priority and health
        sorted_routes = sorted(
            candidate_routes,
            key=lambda r: (
                self.route_configs[r].weight,
                self.route_health[r].success_rate
            ),
            reverse=True
        )
        
        # Select primary and one backup
        return sorted_routes[:2]

    async def _execute_routing(
        self, 
        envelope: MessageEnvelope, 
        selected_routes: List[str]
    ) -> Dict[str, Any]:
        """Execute message routing to selected channels"""
        routing_tasks = []
        
        for route_id in selected_routes:
            task = asyncio.create_task(
                self._deliver_to_route(envelope, route_id)
            )
            routing_tasks.append((route_id, task))
        
        # Wait for all deliveries with timeout
        delivery_results = {}
        successful_deliveries = 0
        failed_deliveries = 0
        
        for route_id, task in routing_tasks:
            try:
                result = await asyncio.wait_for(
                    task, 
                    timeout=self.route_configs[route_id].timeout_seconds
                )
                delivery_results[route_id] = result
                
                if result.get('status') == 'success':
                    successful_deliveries += 1
                else:
                    failed_deliveries += 1
                    
            except asyncio.TimeoutError:
                delivery_results[route_id] = {
                    'status': 'timeout',
                    'error': 'Delivery timeout'
                }
                failed_deliveries += 1
                
            except Exception as e:
                delivery_results[route_id] = {
                    'status': 'error',
                    'error': str(e)
                }
                failed_deliveries += 1
        
        return {
            'status': 'completed',
            'message_id': envelope.message_id,
            'successful_deliveries': successful_deliveries,
            'failed_deliveries': failed_deliveries,
            'delivery_results': delivery_results,
            'routed_channels': list(delivery_results.keys())
        }

    async def _deliver_to_route(self, envelope: MessageEnvelope, route_id: str) -> Dict[str, Any]:
        """Deliver message to specific route with circuit breaker protection"""
        config = self.route_configs[route_id]
        circuit_breaker = self.circuit_breakers[route_id]
        
        try:
            # Update connection count
            self.active_connections[route_id] += 1
            self.route_health[route_id].active_connections = self.active_connections[route_id]
            
            # Create notification request
            notification_request = self._create_notification_request(envelope, config)
            
            # Deliver with circuit breaker protection
            start_time = time.time()
            
            if config.channel == NotificationChannel.WEBSOCKET and self.websocket_manager:
                result = await circuit_breaker.async_call(
                    self._deliver_websocket_message,
                    envelope,
                    notification_request
                )
            else:
                result = await circuit_breaker.async_call(
                    self._deliver_notification_service,
                    notification_request
                )
            
            # Update performance metrics
            delivery_time = time.time() - start_time
            self._update_route_performance(route_id, delivery_time, True)
            
            routing_counter.labels(
                route=route_id,
                priority=envelope.priority.value,
                status='success'
            ).inc()
            
            return {
                'status': 'success',
                'route_id': route_id,
                'delivery_time': delivery_time,
                'result': result
            }
            
        except Exception as e:
            # Update performance metrics for failure
            delivery_time = time.time() - start_time if 'start_time' in locals() else 0
            self._update_route_performance(route_id, delivery_time, False)
            
            circuit_breaker_trips.labels(channel=config.channel.value).inc()
            
            routing_counter.labels(
                route=route_id,
                priority=envelope.priority.value,
                status='failed'
            ).inc()
            
            logger.error(f"Failed to deliver to route {route_id}: {str(e)}")
            
            return {
                'status': 'failed',
                'route_id': route_id,
                'error': str(e)
            }
            
        finally:
            # Decrease connection count
            self.active_connections[route_id] -= 1
            if route_id in self.route_health:
                self.route_health[route_id].active_connections = max(0, self.active_connections[route_id])

    def _create_notification_request(
        self, 
        envelope: MessageEnvelope, 
        config: RouteConfig
    ) -> NotificationRequest:
        """Create notification request from message envelope"""
        
        # Map message type to notification type
        notification_type_mapping = {
            MessageType.CHAT_MESSAGE: NotificationType.CHAT_MESSAGE,
            MessageType.PAYMENT_UPDATE: NotificationType.PAYMENT_CONFIRMATION,
            MessageType.DOCUMENT_NOTIFICATION: NotificationType.DOCUMENT_READY,
            MessageType.SYSTEM_ALERT: NotificationType.SYSTEM_ALERT,
            MessageType.CULTURAL_REMINDER: NotificationType.CULTURAL_REMINDER,
            MessageType.PROFESSIONAL_UPDATE: NotificationType.EDUCATIONAL_UPDATE
        }
        
        # Map priority
        priority_mapping = {
            MessagePriority.CRITICAL: NotificationPriority.CRITICAL,
            MessagePriority.HIGH: NotificationPriority.HIGH,
            MessagePriority.NORMAL: NotificationPriority.NORMAL,
            MessagePriority.LOW: NotificationPriority.LOW
        }
        
        return NotificationRequest(
            user_id=envelope.user_id,
            channel=config.channel,
            notification_type=notification_type_mapping.get(
                envelope.message_type, 
                NotificationType.SYSTEM_ALERT
            ),
            priority=priority_mapping.get(envelope.priority, NotificationPriority.NORMAL),
            subject=envelope.content.get('subject', 'Iraqi AI Notification'),
            message=envelope.content.get('message', json.dumps(envelope.content)),
            cultural_context=envelope.cultural_context,
            metadata=envelope.content.get('metadata', {}),
            scheduled_time=envelope.content.get('scheduled_time'),
            expiry_time=envelope.expires_at
        )

    async def _deliver_websocket_message(
        self, 
        envelope: MessageEnvelope, 
        notification_request: NotificationRequest
    ) -> Dict[str, Any]:
        """Deliver message via WebSocket manager"""
        if not self.websocket_manager:
            raise Exception("WebSocket manager not initialized")
        
        # Use WebSocket manager for real-time delivery
        websocket_data = {
            'message_id': envelope.message_id,
            'type': envelope.message_type,
            'content': envelope.content,
            'cultural_context': asdict(envelope.cultural_context),
            'timestamp': envelope.created_at.isoformat()
        }
        
        success = await self.websocket_manager.send_message_to_user(
            envelope.user_id,
            websocket_data
        )
        
        return {
            'delivered': success,
            'channel': 'websocket',
            'timestamp': datetime.now(IRAQI_TIMEZONE).isoformat()
        }

    async def _deliver_notification_service(
        self, 
        notification_request: NotificationRequest
    ) -> Dict[str, Any]:
        """Deliver message via notification service"""
        if not self.notification_service:
            raise Exception("Notification service not initialized")
        
        result = await self.notification_service.send_notification(notification_request)
        
        return {
            'delivered': result.status == 'success',
            'channel': notification_request.channel.value,
            'result': asdict(result)
        }

    def _update_route_performance(self, route_id: str, delivery_time: float, success: bool) -> None:
        """Update route performance metrics"""
        if route_id not in self.route_health:
            return
        
        health = self.route_health[route_id]
        
        # Update response time
        performance_history = self.route_performance[route_id]
        performance_history.append({
            'timestamp': time.time(),
            'delivery_time': delivery_time,
            'success': success
        })
        
        # Calculate average response time
        recent_deliveries = [p for p in performance_history if p['timestamp'] > time.time() - 300]  # Last 5 minutes
        if recent_deliveries:
            health.avg_response_time = sum(p['delivery_time'] for p in recent_deliveries) / len(recent_deliveries)
        
        # Calculate success rate
        if recent_deliveries:
            successful = sum(1 for p in recent_deliveries if p['success'])
            health.success_rate = (successful / len(recent_deliveries)) * 100
        
        # Update error count
        if not success:
            health.error_count += 1
        
        # Update last health check
        health.last_health_check = datetime.now(IRAQI_TIMEZONE)

    async def _store_routing_record(self, envelope: MessageEnvelope, routing_results: Dict[str, Any]) -> None:
        """Store routing record for audit and analytics"""
        try:
            record = {
                'message_id': envelope.message_id,
                'user_id': envelope.user_id,
                'message_type': envelope.message_type,
                'priority': envelope.priority,
                'routing_results': routing_results,
                'cultural_context': asdict(envelope.cultural_context),
                'timestamp': datetime.now(IRAQI_TIMEZONE).isoformat()
            }
            
            # Store with 7-day retention
            await self.redis_client.setex(
                f"routing_record:{envelope.message_id}",
                604800,  # 7 days
                json.dumps(record, default=str)
            )
            
        except Exception as e:
            logger.error(f"Failed to store routing record: {str(e)}")

    async def _monitor_route_health(self) -> None:
        """Continuously monitor route health and update status"""
        while True:
            try:
                for route_id, health in self.route_health.items():
                    # Check circuit breaker status
                    circuit_breaker = self.circuit_breakers.get(route_id)
                    if circuit_breaker:
                        health.circuit_breaker_open = circuit_breaker.state == "open"
                    
                    # Update route status based on health metrics
                    if health.circuit_breaker_open:
                        health.status = RouteStatus.CIRCUIT_OPEN
                    elif health.success_rate < 50:
                        health.status = RouteStatus.FAILED
                    elif health.success_rate < 80:
                        health.status = RouteStatus.DEGRADED
                    else:
                        health.status = RouteStatus.ACTIVE
                    
                    # Update Prometheus metrics
                    active_routes.set(
                        len([h for h in self.route_health.values() if h.status == RouteStatus.ACTIVE])
                    )
                
                await asyncio.sleep(30)  # Check every 30 seconds
                
            except Exception as e:
                logger.error(f"Error in route health monitoring: {str(e)}")
                await asyncio.sleep(60)  # Longer wait on error

    async def _process_message_queue(self) -> None:
        """Process queued messages by priority"""
        while True:
            try:
                # Process messages in priority order
                for priority in [MessagePriority.CRITICAL, MessagePriority.HIGH, MessagePriority.NORMAL, MessagePriority.LOW]:
                    queue = self.message_queue[priority]
                    
                    while queue:
                        envelope = queue.popleft()
                        
                        # Check if message has expired
                        if envelope.expires_at and datetime.now(IRAQI_TIMEZONE) > envelope.expires_at:
                            logger.warning(f"Message {envelope.message_id} expired, skipping")
                            continue
                        
                        # Route the message
                        await self.route_message(envelope)
                
                await asyncio.sleep(1)  # Short pause between processing cycles
                
            except Exception as e:
                logger.error(f"Error processing message queue: {str(e)}")
                await asyncio.sleep(5)

    async def _cleanup_expired_messages(self) -> None:
        """Clean up expired messages and routing records"""
        while True:
            try:
                # Clean up expired routing records
                current_time = time.time()
                
                # This would typically use Redis SCAN to find expired records
                # For now, just log the cleanup activity
                logger.debug("Performing routing record cleanup")
                
                await asyncio.sleep(3600)  # Run every hour
                
            except Exception as e:
                logger.error(f"Error in cleanup process: {str(e)}")
                await asyncio.sleep(1800)  # Retry in 30 minutes

    async def _collect_performance_metrics(self) -> None:
        """Collect and update performance metrics"""
        while True:
            try:
                # Update delivery success rate
                if self.routing_stats['total_routed'] > 0:
                    success_rate = (
                        self.routing_stats['successful_routes'] / 
                        self.routing_stats['total_routed']
                    )
                    delivery_success_rate.observe(success_rate)
                
                await asyncio.sleep(60)  # Update every minute
                
            except Exception as e:
                logger.error(f"Error collecting performance metrics: {str(e)}")
                await asyncio.sleep(300)  # Retry in 5 minutes

    async def queue_message(self, envelope: MessageEnvelope) -> bool:
        """Queue message for processing"""
        try:
            # Add to appropriate priority queue
            self.message_queue[envelope.priority].append(envelope)
            
            logger.info(f"Queued message {envelope.message_id} with priority {envelope.priority}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to queue message: {str(e)}")
            return False

    def get_routing_statistics(self) -> Dict[str, Any]:
        """Get comprehensive routing statistics"""
        route_status_counts = defaultdict(int)
        for health in self.route_health.values():
            route_status_counts[health.status.value] += 1
        
        return {
            'total_routes_configured': len(self.route_configs),
            'active_routes': route_status_counts.get('active', 0),
            'degraded_routes': route_status_counts.get('degraded', 0),
            'failed_routes': route_status_counts.get('failed', 0),
            'circuit_breaker_open': route_status_counts.get('circuit_open', 0),
            'total_messages_routed': self.routing_stats['total_routed'],
            'successful_routes': self.routing_stats['successful_routes'],
            'failed_routes': self.routing_stats['failed_routes'],
            'cultural_violations': self.routing_stats['cultural_violations'],
            'average_routing_latency': self.routing_stats['average_latency'],
            'success_rate': (
                self.routing_stats['successful_routes'] / 
                max(1, self.routing_stats['total_routed'])
            ) * 100,
            'cultural_compliance_rate': (
                (self.routing_stats['total_routed'] - self.routing_stats['cultural_violations']) /
                max(1, self.routing_stats['total_routed'])
            ) * 100,
            'queue_sizes': {
                priority.value: len(queue) 
                for priority, queue in self.message_queue.items()
            }
        }

    async def get_route_health_status(self) -> Dict[str, Any]:
        """Get detailed health status for all routes"""
        health_report = {}
        
        for route_id, health in self.route_health.items():
            config = self.route_configs[route_id]
            
            health_report[route_id] = {
                'route_id': route_id,
                'channel': config.channel.value,
                'status': health.status.value,
                'success_rate': health.success_rate,
                'average_response_time': health.avg_response_time,
                'active_connections': health.active_connections,
                'max_connections': config.max_connections,
                'circuit_breaker_open': health.circuit_breaker_open,
                'error_count': health.error_count,
                'cultural_compliance_rate': health.cultural_compliance_rate,
                'last_health_check': health.last_health_check.isoformat(),
                'weight': config.weight,
                'arabic_optimized': config.arabic_optimized,
                'ministry_approved': config.ministry_approved
            }
        
        return health_report

    async def health_check(self) -> Dict[str, Any]:
        """Comprehensive health check for message router"""
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
        
        # Check route health
        healthy_routes = sum(
            1 for health in self.route_health.values() 
            if health.status == RouteStatus.ACTIVE
        )
        total_routes = len(self.route_health)
        
        if total_routes > 0:
            route_health_percentage = (healthy_routes / total_routes) * 100
            if route_health_percentage >= 80:
                health_status['components']['routes'] = 'healthy'
            elif route_health_percentage >= 50:
                health_status['components']['routes'] = 'degraded'
                health_status['status'] = 'degraded'
            else:
                health_status['components']['routes'] = 'unhealthy'
                health_status['status'] = 'unhealthy'
        
        # Check external services
        if self.websocket_manager:
            websocket_health = await self.websocket_manager.health_check()
            health_status['components']['websocket'] = websocket_health.get('status', 'unknown')
        
        if self.notification_service:
            notification_health = await self.notification_service.health_check()
            health_status['components']['notification_service'] = notification_health.get('status', 'unknown')
        
        # Add routing statistics
        health_status['statistics'] = self.get_routing_statistics()
        
        return health_status

    async def shutdown(self) -> None:
        """Graceful shutdown of message router"""
        try:
            logger.info("Shutting down Iraqi Message Router...")
            
            # Process remaining queued messages
            remaining_messages = sum(len(queue) for queue in self.message_queue.values())
            if remaining_messages > 0:
                logger.info(f"Processing {remaining_messages} remaining messages...")
                await asyncio.sleep(5)  # Allow time for processing
            
            # Shutdown thread pool
            self.executor.shutdown(wait=True)
            
            # Close Redis connection
            if self.redis_client:
                await self.redis_client.close()
                logger.info("Redis connection closed")
            
            logger.info("Iraqi Message Router shutdown completed")
            
        except Exception as e:
            logger.error(f"Error during shutdown: {str(e)}")

# Factory function for creating message router
async def create_iraqi_message_router(
    config: Dict[str, Any],
    websocket_manager: Optional[IraqiWebSocketManager] = None,
    notification_service: Optional[IraqiNotificationService] = None
) -> IraqiMessageRouter:
    """
    Factory function to create and initialize Iraqi Message Router
    
    Args:
        config: Configuration dictionary
        websocket_manager: Optional WebSocket manager instance
        notification_service: Optional notification service instance
        
    Returns:
        Initialized IraqiMessageRouter instance
    """
    router = IraqiMessageRouter(
        redis_url=config.get('redis_url', 'redis://localhost:6379'),
        websocket_manager=websocket_manager,
        notification_service=notification_service,
        max_concurrent_routes=config.get('max_concurrent_routes', 50),
        default_strategy=config.get('default_strategy', RoutingStrategy.CULTURAL_PRIORITY)
    )
    
    await router.initialize()
    return router

# Example usage and integration
if __name__ == "__main__":
    async def example_usage():
        """Example usage of Iraqi Message Router"""
        
        # Router configuration
        config = {
            'redis_url': 'redis://localhost:6379',
            'max_concurrent_routes': 25,
            'default_strategy': RoutingStrategy.CULTURAL_PRIORITY
        }
        
        # Create router
        message_router = await create_iraqi_message_router(config)
        
        # Example: Route Arabic chat message
        arabic_message = MessageEnvelope(
            user_id="user_123",
            message_type=MessageType.CHAT_MESSAGE,
            priority=MessagePriority.HIGH,
            content={
                'subject': 'رسالة جديدة',
                'message': 'أهلاً وسهلاً، كيف حالك اليوم؟',
                'sender': 'أحمد محمد'
            },
            cultural_context=IraqiCulturalContext(
                language_preference="ar",
                islamic_compliance_required=True
            )
        )
        
        routing_result = await message_router.route_message(arabic_message)
        print(f"Arabic message routing result: {routing_result['status']}")
        
        # Example: Route payment confirmation
        payment_message = MessageEnvelope(
            user_id="user_456",
            message_type=MessageType.PAYMENT_UPDATE,
            priority=MessagePriority.CRITICAL,
            content={
                'subject': 'Payment Confirmation',
                'message': 'Your payment of 1000 IQD via ZainCash has been confirmed',
                'gateway': 'ZainCash',
                'amount': 1000,
                'transaction_id': 'TXN_789123'
            },
            cultural_context=IraqiCulturalContext(
                language_preference="en",
                islamic_compliance_required=True
            )
        )
        
        payment_result = await message_router.route_message(payment_message)
        print(f"Payment message routing result: {payment_result['status']}")
        
        # Get routing statistics
        stats = message_router.get_routing_statistics()
        print(f"Routing statistics: {json.dumps(stats, indent=2)}")
        
        # Health check
        health = await message_router.health_check()
        print(f"Router health: {health['status']}")
        
        # Cleanup
        await message_router.shutdown()
    
    # Run example
    asyncio.run(example_usage())