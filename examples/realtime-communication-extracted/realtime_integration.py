"""
Iraqi Real-time Communication Integration Hub

Comprehensive integration system that orchestrates all real-time communication
components for the Iraqi AI Chat System:

- WebSocket Manager: Real-time bidirectional communication
- Notification Service: Multi-channel notification delivery  
- Message Router: Intelligent routing with cultural intelligence
- Event System: Distributed event handling and coordination
- Performance Monitoring: Real-time analytics and optimization
- Cultural Compliance: Islamic and Arabic processing validation
- Ministry Integration: Official communication protocols

This module serves as the central orchestration point for all real-time
communication features, ensuring seamless integration with cultural
sensitivity and optimal performance.

Author: Iraqi AI Development Team
License: Proprietary - Iraqi AI Chat System
"""

import asyncio
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any, Union, Callable
from dataclasses import dataclass, asdict
from contextlib import asynccontextmanager
import uuid
from enum import Enum
import aioredis
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
import pydantic
from pydantic import BaseModel, Field
import prometheus_client
from prometheus_client import Counter, Histogram, Gauge
import celery
from celery import Celery
import pytz
import time

# Import our real-time communication components
from websocket_manager import IraqiWebSocketManager, WebSocketMessage, ConnectionInfo
from notification_service import (
    IraqiNotificationService, 
    NotificationRequest,
    NotificationChannel,
    NotificationType,
    NotificationPriority,
    IraqiCulturalContext
)
from message_router import (
    IraqiMessageRouter,
    MessageEnvelope,
    MessageType,
    MessagePriority,
    RoutingStrategy
)

# Configure comprehensive logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s',
    handlers=[
        logging.FileHandler('/var/log/iraqi-ai/realtime_integration.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Prometheus metrics for integration monitoring
integration_counter = Counter('iraqi_realtime_operations_total', 'Total real-time operations', ['operation', 'status'])
integration_duration = Histogram('iraqi_realtime_operation_duration_seconds', 'Real-time operation duration')
active_connections_total = Gauge('iraqi_total_active_connections', 'Total active connections')
cultural_validations = Counter('iraqi_cultural_validations_total', 'Cultural validations performed', ['result'])

# Iraqi timezone
IRAQI_TIMEZONE = pytz.timezone('Asia/Baghdad')

class EventType(str, Enum):
    """Types of real-time events"""
    USER_CONNECTED = "user_connected"
    USER_DISCONNECTED = "user_disconnected"
    MESSAGE_SENT = "message_sent"
    MESSAGE_RECEIVED = "message_received"
    NOTIFICATION_DELIVERED = "notification_delivered"
    PAYMENT_PROCESSED = "payment_processed"
    DOCUMENT_READY = "document_ready"
    SYSTEM_ALERT = "system_alert"
    CULTURAL_VALIDATION = "cultural_validation"
    MINISTRY_UPDATE = "ministry_update"

class IntegrationStatus(str, Enum):
    """Status of integration components"""
    HEALTHY = "healthy"
    DEGRADED = "degraded"
    UNHEALTHY = "unhealthy"
    MAINTENANCE = "maintenance"

@dataclass
class RealTimeEvent:
    """Real-time event structure"""
    event_id: str
    event_type: EventType
    user_id: str
    payload: Dict[str, Any]
    cultural_context: IraqiCulturalContext
    timestamp: datetime
    processed: bool = False
    retry_count: int = 0

class IraqiRealTimeConfig(BaseModel):
    """Configuration for real-time communication system"""
    
    # Database configuration
    database_url: str = "postgresql+asyncpg://user:pass@localhost/iraqi_ai"
    
    # Redis configuration
    redis_url: str = "redis://localhost:6379"
    redis_db_websocket: int = 0
    redis_db_notifications: int = 1
    redis_db_routing: int = 2
    
    # WebSocket configuration
    websocket_host: str = "0.0.0.0"
    websocket_port: int = 8000
    max_connections: int = 1000
    heartbeat_interval: int = 30
    
    # Notification configuration
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_username: str = ""
    smtp_password: str = ""
    sms_provider_url: str = ""
    sms_api_key: str = ""
    
    # Routing configuration
    max_concurrent_routes: int = 50
    default_routing_strategy: RoutingStrategy = RoutingStrategy.CULTURAL_PRIORITY
    
    # Cultural validation
    cultural_validation_enabled: bool = True
    islamic_compliance_required: bool = True
    arabic_processing_enabled: bool = True
    
    # Performance settings
    monitoring_enabled: bool = True
    metrics_retention_hours: int = 24
    log_level: str = "INFO"
    
    # Ministry integration
    ministry_portal_enabled: bool = True
    ministry_api_base_url: str = ""
    ministry_api_key: str = ""
    
    class Config:
        use_enum_values = True

class IraqiRealTimeCommunicationHub:
    """
    Central hub for Iraqi real-time communication system
    
    Orchestrates and coordinates:
    - WebSocket real-time messaging with Arabic support
    - Multi-channel notification delivery
    - Intelligent message routing with cultural awareness
    - Event-driven architecture with comprehensive logging
    - Performance monitoring and cultural compliance tracking
    - Integration with ministry portals and payment systems
    """
    
    def __init__(self, config: IraqiRealTimeConfig):
        self.config = config
        
        # Core components (initialized during startup)
        self.websocket_manager: Optional[IraqiWebSocketManager] = None
        self.notification_service: Optional[IraqiNotificationService] = None
        self.message_router: Optional[IraqiMessageRouter] = None
        
        # Infrastructure components
        self.redis_client: Optional[aioredis.Redis] = None
        self.database_engine = None
        self.database_session = None
        self.celery_app: Optional[Celery] = None
        
        # Event handling
        self.event_handlers: Dict[EventType, List[Callable]] = {}
        self.event_queue: asyncio.Queue = asyncio.Queue(maxsize=1000)
        
        # Integration status tracking
        self.component_status: Dict[str, IntegrationStatus] = {}
        self.startup_time: Optional[datetime] = None
        
        # Performance tracking
        self.integration_stats = {
            'total_events_processed': 0,
            'successful_operations': 0,
            'failed_operations': 0,
            'cultural_validations_passed': 0,
            'cultural_validations_failed': 0,
            'average_response_time': 0.0
        }
        
        logger.info("Iraqi Real-time Communication Hub initialized")
    
    async def initialize(self) -> None:
        """Initialize all real-time communication components"""
        try:
            self.startup_time = datetime.now(IRAQI_TIMEZONE)
            logger.info("Starting Iraqi Real-time Communication Hub initialization...")
            
            # Initialize infrastructure
            await self._initialize_infrastructure()
            
            # Initialize core communication components
            await self._initialize_communication_components()
            
            # Setup event handling
            await self._setup_event_handling()
            
            # Start background services
            await self._start_background_services()
            
            # Perform health checks
            health_status = await self.health_check()
            if health_status['status'] != 'healthy':
                logger.warning(f"System started with degraded status: {health_status}")
            
            logger.info("Iraqi Real-time Communication Hub initialization completed successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize real-time communication hub: {str(e)}")
            raise

    async def _initialize_infrastructure(self) -> None:
        """Initialize Redis, database, and Celery"""
        try:
            # Initialize Redis connections
            self.redis_client = aioredis.from_url(
                self.config.redis_url,
                encoding="utf-8",
                decode_responses=True,
                max_connections=20,
                retry_on_timeout=True
            )
            await self.redis_client.ping()
            logger.info("Redis connection established")
            
            # Initialize database connection
            self.database_engine = create_async_engine(
                self.config.database_url,
                echo=False,
                pool_size=10,
                max_overflow=20
            )
            
            self.database_session = sessionmaker(
                self.database_engine,
                class_=AsyncSession,
                expire_on_commit=False
            )
            logger.info("Database connection established")
            
            # Initialize Celery for background tasks
            self.celery_app = Celery(
                'iraqi_realtime_communication',
                broker=f"{self.config.redis_url}/3",
                backend=f"{self.config.redis_url}/4"
            )
            
            self.celery_app.conf.update(
                timezone='Asia/Baghdad',
                enable_utc=True,
                result_expires=3600,
                task_serializer='json',
                accept_content=['json'],
                result_serializer='json'
            )
            logger.info("Celery initialized for background processing")
            
        except Exception as e:
            logger.error(f"Infrastructure initialization failed: {str(e)}")
            raise

    async def _initialize_communication_components(self) -> None:
        """Initialize WebSocket, notification, and routing components"""
        try:
            # Initialize WebSocket Manager
            websocket_config = {
                'redis_url': f"{self.config.redis_url}/{self.config.redis_db_websocket}",
                'host': self.config.websocket_host,
                'port': self.config.websocket_port,
                'max_connections': self.config.max_connections,
                'heartbeat_interval': self.config.heartbeat_interval
            }
            
            self.websocket_manager = IraqiWebSocketManager(**websocket_config)
            await self.websocket_manager.initialize()
            self.component_status['websocket'] = IntegrationStatus.HEALTHY
            logger.info("WebSocket Manager initialized")
            
            # Initialize Notification Service
            notification_config = {
                'redis_url': f"{self.config.redis_url}/{self.config.redis_db_notifications}",
                'smtp': {
                    'host': self.config.smtp_host,
                    'port': self.config.smtp_port,
                    'username': self.config.smtp_username,
                    'password': self.config.smtp_password,
                    'from_email': f'Iraqi AI System <{self.config.smtp_username}>',
                    'use_tls': True
                },
                'sms': {
                    'provider_url': self.config.sms_provider_url,
                    'api_key': self.config.sms_api_key
                }
            }
            
            from notification_service import create_iraqi_notification_service
            self.notification_service = await create_iraqi_notification_service(notification_config)
            self.component_status['notifications'] = IntegrationStatus.HEALTHY
            logger.info("Notification Service initialized")
            
            # Initialize Message Router
            routing_config = {
                'redis_url': f"{self.config.redis_url}/{self.config.redis_db_routing}",
                'max_concurrent_routes': self.config.max_concurrent_routes,
                'default_strategy': self.config.default_routing_strategy
            }
            
            from message_router import create_iraqi_message_router
            self.message_router = await create_iraqi_message_router(
                routing_config,
                self.websocket_manager,
                self.notification_service
            )
            self.component_status['routing'] = IntegrationStatus.HEALTHY
            logger.info("Message Router initialized")
            
        except Exception as e:
            logger.error(f"Communication components initialization failed: {str(e)}")
            raise

    async def _setup_event_handling(self) -> None:
        """Setup event handlers and processing"""
        try:
            # Register default event handlers
            self.register_event_handler(EventType.USER_CONNECTED, self._handle_user_connected)
            self.register_event_handler(EventType.USER_DISCONNECTED, self._handle_user_disconnected)
            self.register_event_handler(EventType.MESSAGE_SENT, self._handle_message_sent)
            self.register_event_handler(EventType.MESSAGE_RECEIVED, self._handle_message_received)
            self.register_event_handler(EventType.NOTIFICATION_DELIVERED, self._handle_notification_delivered)
            self.register_event_handler(EventType.PAYMENT_PROCESSED, self._handle_payment_processed)
            self.register_event_handler(EventType.CULTURAL_VALIDATION, self._handle_cultural_validation)
            
            logger.info("Event handlers registered successfully")
            
        except Exception as e:
            logger.error(f"Event handling setup failed: {str(e)}")
            raise

    async def _start_background_services(self) -> None:
        """Start background monitoring and processing services"""
        try:
            # Start event processing
            asyncio.create_task(self._process_events())
            
            # Start performance monitoring
            if self.config.monitoring_enabled:
                asyncio.create_task(self._monitor_performance())
                asyncio.create_task(self._collect_metrics())
            
            # Start health monitoring
            asyncio.create_task(self._monitor_component_health())
            
            # Start cleanup services
            asyncio.create_task(self._cleanup_expired_data())
            
            logger.info("Background services started successfully")
            
        except Exception as e:
            logger.error(f"Background services startup failed: {str(e)}")
            raise

    def register_event_handler(self, event_type: EventType, handler: Callable) -> None:
        """Register event handler for specific event type"""
        if event_type not in self.event_handlers:
            self.event_handlers[event_type] = []
        
        self.event_handlers[event_type].append(handler)
        logger.debug(f"Registered handler for {event_type}")

    async def emit_event(self, event: RealTimeEvent) -> None:
        """Emit real-time event for processing"""
        try:
            await self.event_queue.put(event)
            integration_counter.labels(operation='event_emitted', status='success').inc()
            
        except asyncio.QueueFull:
            logger.error(f"Event queue full, dropping event {event.event_id}")
            integration_counter.labels(operation='event_emitted', status='dropped').inc()
        
        except Exception as e:
            logger.error(f"Failed to emit event {event.event_id}: {str(e)}")
            integration_counter.labels(operation='event_emitted', status='failed').inc()

    async def send_real_time_message(
        self,
        user_id: str,
        message_content: str,
        message_type: MessageType = MessageType.CHAT_MESSAGE,
        priority: MessagePriority = MessagePriority.NORMAL,
        cultural_context: Optional[IraqiCulturalContext] = None,
        channels: Optional[List[NotificationChannel]] = None
    ) -> Dict[str, Any]:
        """
        Send real-time message with comprehensive routing
        
        Args:
            user_id: Target user ID
            message_content: Message content
            message_type: Type of message
            priority: Message priority
            cultural_context: Cultural context for validation
            channels: Specific channels to use (optional)
            
        Returns:
            Dictionary with delivery results
        """
        start_time = time.time()
        
        try:
            # Set default cultural context
            if not cultural_context:
                cultural_context = IraqiCulturalContext()
            
            # Create message envelope
            message_envelope = MessageEnvelope(
                user_id=user_id,
                message_type=message_type,
                priority=priority,
                content={
                    'message': message_content,
                    'timestamp': datetime.now(IRAQI_TIMEZONE).isoformat()
                },
                cultural_context=cultural_context
            )
            
            # Route message through intelligent router
            routing_result = await self.message_router.route_message(message_envelope)
            
            # Emit event for tracking
            event = RealTimeEvent(
                event_id=str(uuid.uuid4()),
                event_type=EventType.MESSAGE_SENT,
                user_id=user_id,
                payload={
                    'message_id': message_envelope.message_id,
                    'content': message_content,
                    'routing_result': routing_result
                },
                cultural_context=cultural_context,
                timestamp=datetime.now(IRAQI_TIMEZONE)
            )
            
            await self.emit_event(event)
            
            # Update statistics
            duration = time.time() - start_time
            integration_duration.observe(duration)
            
            if routing_result.get('status') == 'completed':
                self.integration_stats['successful_operations'] += 1
            else:
                self.integration_stats['failed_operations'] += 1
            
            logger.info(f"Real-time message sent to user {user_id}: {routing_result['status']}")
            
            return {
                'status': 'success',
                'message_id': message_envelope.message_id,
                'routing_result': routing_result,
                'processing_time': duration
            }
            
        except Exception as e:
            error_msg = f"Failed to send real-time message: {str(e)}"
            logger.error(f"Error sending message to user {user_id}: {error_msg}")
            
            self.integration_stats['failed_operations'] += 1
            integration_counter.labels(operation='send_message', status='failed').inc()
            
            return {
                'status': 'failed',
                'error': error_msg
            }

    async def send_notification(
        self,
        user_id: str,
        subject: str,
        message: str,
        notification_type: NotificationType = NotificationType.SYSTEM_ALERT,
        priority: NotificationPriority = NotificationPriority.NORMAL,
        channels: Optional[List[NotificationChannel]] = None,
        cultural_context: Optional[IraqiCulturalContext] = None,
        template_id: Optional[str] = None,
        template_variables: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Send notification through multiple channels
        
        Args:
            user_id: Target user ID
            subject: Notification subject
            message: Notification message
            notification_type: Type of notification
            priority: Notification priority
            channels: Target channels (optional)
            cultural_context: Cultural context
            template_id: Template ID for formatting
            template_variables: Variables for template
            
        Returns:
            Dictionary with delivery results
        """
        try:
            # Set default cultural context
            if not cultural_context:
                cultural_context = IraqiCulturalContext()
            
            # If channels not specified, use intelligent routing
            if not channels:
                # Create message envelope for routing
                message_envelope = MessageEnvelope(
                    user_id=user_id,
                    message_type=MessageType.NOTIFICATION,
                    priority=MessagePriority(priority.value),
                    content={
                        'subject': subject,
                        'message': message,
                        'notification_type': notification_type.value
                    },
                    cultural_context=cultural_context
                )
                
                # Get optimal channels from router
                routing_result = await self.message_router.route_message(message_envelope)
                channels = [
                    NotificationChannel(channel) 
                    for channel in routing_result.get('routed_channels', ['websocket'])
                ]
            
            # Send notifications to each channel
            delivery_results = {}
            
            for channel in channels:
                notification_request = NotificationRequest(
                    user_id=user_id,
                    channel=channel,
                    notification_type=notification_type,
                    priority=priority,
                    subject=subject,
                    message=message,
                    template_id=template_id,
                    template_variables=template_variables or {},
                    cultural_context=cultural_context
                )
                
                result = await self.notification_service.send_notification(notification_request)
                delivery_results[channel.value] = asdict(result)
            
            # Emit notification event
            event = RealTimeEvent(
                event_id=str(uuid.uuid4()),
                event_type=EventType.NOTIFICATION_DELIVERED,
                user_id=user_id,
                payload={
                    'subject': subject,
                    'delivery_results': delivery_results
                },
                cultural_context=cultural_context,
                timestamp=datetime.now(IRAQI_TIMEZONE)
            )
            
            await self.emit_event(event)
            
            successful_deliveries = sum(
                1 for result in delivery_results.values()
                if result.get('status') == 'success'
            )
            
            logger.info(f"Notification sent to user {user_id}: {successful_deliveries}/{len(channels)} successful")
            
            return {
                'status': 'success',
                'successful_deliveries': successful_deliveries,
                'total_channels': len(channels),
                'delivery_results': delivery_results
            }
            
        except Exception as e:
            error_msg = f"Failed to send notification: {str(e)}"
            logger.error(f"Error sending notification to user {user_id}: {error_msg}")
            
            integration_counter.labels(operation='send_notification', status='failed').inc()
            
            return {
                'status': 'failed',
                'error': error_msg
            }

    async def broadcast_message(
        self,
        message_content: str,
        target_users: Optional[List[str]] = None,
        cultural_filter: Optional[Dict[str, Any]] = None,
        message_type: MessageType = MessageType.SYSTEM_ALERT,
        priority: MessagePriority = MessagePriority.HIGH
    ) -> Dict[str, Any]:
        """
        Broadcast message to multiple users
        
        Args:
            message_content: Message to broadcast
            target_users: Specific users to target (optional)
            cultural_filter: Cultural filtering criteria
            message_type: Type of message
            priority: Message priority
            
        Returns:
            Dictionary with broadcast results
        """
        try:
            # Get target users
            if not target_users:
                target_users = await self._get_active_users(cultural_filter)
            
            # Create broadcast tasks
            broadcast_tasks = []
            for user_id in target_users:
                task = asyncio.create_task(
                    self.send_real_time_message(
                        user_id=user_id,
                        message_content=message_content,
                        message_type=message_type,
                        priority=priority
                    )
                )
                broadcast_tasks.append((user_id, task))
            
            # Execute broadcast
            results = {}
            successful_broadcasts = 0
            
            for user_id, task in broadcast_tasks:
                try:
                    result = await task
                    results[user_id] = result
                    
                    if result.get('status') == 'success':
                        successful_broadcasts += 1
                        
                except Exception as e:
                    results[user_id] = {
                        'status': 'failed',
                        'error': str(e)
                    }
            
            logger.info(f"Broadcast completed: {successful_broadcasts}/{len(target_users)} successful")
            
            return {
                'status': 'completed',
                'total_users': len(target_users),
                'successful_broadcasts': successful_broadcasts,
                'results': results
            }
            
        except Exception as e:
            error_msg = f"Broadcast failed: {str(e)}"
            logger.error(error_msg)
            
            return {
                'status': 'failed',
                'error': error_msg
            }

    async def _get_active_users(self, cultural_filter: Optional[Dict[str, Any]] = None) -> List[str]:
        """Get list of active users based on cultural filter"""
        try:
            # Get active WebSocket connections
            if self.websocket_manager:
                active_connections = await self.websocket_manager.get_active_connections()
                return list(active_connections.keys())
            
            return []
            
        except Exception as e:
            logger.error(f"Failed to get active users: {str(e)}")
            return []

    async def _process_events(self) -> None:
        """Process events from event queue"""
        while True:
            try:
                # Get event from queue with timeout
                event = await asyncio.wait_for(self.event_queue.get(), timeout=1.0)
                
                # Process event
                await self._handle_event(event)
                
                # Mark event as processed
                event.processed = True
                self.integration_stats['total_events_processed'] += 1
                
            except asyncio.TimeoutError:
                # No events to process, continue
                continue
                
            except Exception as e:
                logger.error(f"Error processing event: {str(e)}")
                await asyncio.sleep(1)

    async def _handle_event(self, event: RealTimeEvent) -> None:
        """Handle individual event"""
        try:
            handlers = self.event_handlers.get(event.event_type, [])
            
            for handler in handlers:
                try:
                    await handler(event)
                except Exception as e:
                    logger.error(f"Event handler error for {event.event_type}: {str(e)}")
            
            # Store event for analytics
            await self._store_event_record(event)
            
        except Exception as e:
            logger.error(f"Failed to handle event {event.event_id}: {str(e)}")

    async def _handle_user_connected(self, event: RealTimeEvent) -> None:
        """Handle user connection event"""
        user_id = event.user_id
        logger.info(f"User connected: {user_id}")
        
        # Update active connections metric
        if self.websocket_manager:
            connections = await self.websocket_manager.get_active_connections()
            active_connections_total.set(len(connections))

    async def _handle_user_disconnected(self, event: RealTimeEvent) -> None:
        """Handle user disconnection event"""
        user_id = event.user_id
        logger.info(f"User disconnected: {user_id}")
        
        # Update active connections metric
        if self.websocket_manager:
            connections = await self.websocket_manager.get_active_connections()
            active_connections_total.set(len(connections))

    async def _handle_message_sent(self, event: RealTimeEvent) -> None:
        """Handle message sent event"""
        logger.debug(f"Message sent by user {event.user_id}: {event.payload.get('message_id')}")

    async def _handle_message_received(self, event: RealTimeEvent) -> None:
        """Handle message received event"""
        logger.debug(f"Message received by user {event.user_id}: {event.payload.get('message_id')}")

    async def _handle_notification_delivered(self, event: RealTimeEvent) -> None:
        """Handle notification delivery event"""
        logger.debug(f"Notification delivered to user {event.user_id}: {event.payload.get('subject')}")

    async def _handle_payment_processed(self, event: RealTimeEvent) -> None:
        """Handle payment processing event"""
        logger.info(f"Payment processed for user {event.user_id}: {event.payload.get('transaction_id')}")
        
        # Send payment confirmation notification
        payment_data = event.payload
        await self.send_notification(
            user_id=event.user_id,
            subject=f"Payment Confirmation - {payment_data.get('amount', 0)} IQD",
            message=f"Your payment via {payment_data.get('gateway', 'Unknown')} has been processed successfully.",
            notification_type=NotificationType.PAYMENT_CONFIRMATION,
            priority=NotificationPriority.HIGH,
            cultural_context=event.cultural_context
        )

    async def _handle_cultural_validation(self, event: RealTimeEvent) -> None:
        """Handle cultural validation event"""
        validation_result = event.payload.get('validation_result', 'unknown')
        
        if validation_result == 'passed':
            self.integration_stats['cultural_validations_passed'] += 1
            cultural_validations.labels(result='passed').inc()
        else:
            self.integration_stats['cultural_validations_failed'] += 1
            cultural_validations.labels(result='failed').inc()
        
        logger.debug(f"Cultural validation for user {event.user_id}: {validation_result}")

    async def _store_event_record(self, event: RealTimeEvent) -> None:
        """Store event record for analytics"""
        try:
            event_record = {
                'event_id': event.event_id,
                'event_type': event.event_type.value,
                'user_id': event.user_id,
                'payload': event.payload,
                'cultural_context': asdict(event.cultural_context),
                'timestamp': event.timestamp.isoformat(),
                'processed': event.processed
            }
            
            # Store in Redis with TTL
            await self.redis_client.setex(
                f"event_record:{event.event_id}",
                self.config.metrics_retention_hours * 3600,
                json.dumps(event_record, default=str)
            )
            
        except Exception as e:
            logger.error(f"Failed to store event record: {str(e)}")

    async def _monitor_performance(self) -> None:
        """Monitor system performance"""
        while True:
            try:
                # Collect performance metrics
                current_time = time.time()
                
                # Update component status based on health
                for component_name in ['websocket', 'notifications', 'routing']:
                    if component_name in self.component_status:
                        # Simple health check (could be more sophisticated)
                        try:
                            if component_name == 'websocket' and self.websocket_manager:
                                health = await self.websocket_manager.health_check()
                                status = IntegrationStatus.HEALTHY if health['status'] == 'healthy' else IntegrationStatus.DEGRADED
                            elif component_name == 'notifications' and self.notification_service:
                                health = await self.notification_service.health_check()
                                status = IntegrationStatus.HEALTHY if health['status'] == 'healthy' else IntegrationStatus.DEGRADED
                            elif component_name == 'routing' and self.message_router:
                                health = await self.message_router.health_check()
                                status = IntegrationStatus.HEALTHY if health['status'] == 'healthy' else IntegrationStatus.DEGRADED
                            else:
                                status = IntegrationStatus.UNHEALTHY
                            
                            self.component_status[component_name] = status
                            
                        except Exception as e:
                            logger.error(f"Health check failed for {component_name}: {str(e)}")
                            self.component_status[component_name] = IntegrationStatus.UNHEALTHY
                
                await asyncio.sleep(30)  # Check every 30 seconds
                
            except Exception as e:
                logger.error(f"Performance monitoring error: {str(e)}")
                await asyncio.sleep(60)

    async def _collect_metrics(self) -> None:
        """Collect and update metrics"""
        while True:
            try:
                # Update integration statistics
                total_ops = self.integration_stats['successful_operations'] + self.integration_stats['failed_operations']
                if total_ops > 0:
                    success_rate = self.integration_stats['successful_operations'] / total_ops
                    integration_counter.labels(operation='success_rate', status='calculated').inc(success_rate)
                
                await asyncio.sleep(60)  # Update every minute
                
            except Exception as e:
                logger.error(f"Metrics collection error: {str(e)}")
                await asyncio.sleep(300)  # Retry in 5 minutes

    async def _monitor_component_health(self) -> None:
        """Monitor health of all components"""
        while True:
            try:
                # Perform comprehensive health check
                health_status = await self.health_check()
                
                # Log any unhealthy components
                for component, status in health_status.get('components', {}).items():
                    if status != 'healthy':
                        logger.warning(f"Component {component} status: {status}")
                
                await asyncio.sleep(60)  # Check every minute
                
            except Exception as e:
                logger.error(f"Component health monitoring error: {str(e)}")
                await asyncio.sleep(120)

    async def _cleanup_expired_data(self) -> None:
        """Clean up expired data and records"""
        while True:
            try:
                # Clean up expired event records
                # This would typically use Redis SCAN to find and delete expired keys
                logger.debug("Performing data cleanup")
                
                await asyncio.sleep(3600)  # Run every hour
                
            except Exception as e:
                logger.error(f"Data cleanup error: {str(e)}")
                await asyncio.sleep(1800)  # Retry in 30 minutes

    def get_integration_statistics(self) -> Dict[str, Any]:
        """Get comprehensive integration statistics"""
        uptime_seconds = (
            datetime.now(IRAQI_TIMEZONE) - self.startup_time
        ).total_seconds() if self.startup_time else 0
        
        return {
            'system_status': {
                'uptime_seconds': uptime_seconds,
                'startup_time': self.startup_time.isoformat() if self.startup_time else None,
                'component_status': {name: status.value for name, status in self.component_status.items()}
            },
            'performance_metrics': {
                'total_events_processed': self.integration_stats['total_events_processed'],
                'successful_operations': self.integration_stats['successful_operations'],
                'failed_operations': self.integration_stats['failed_operations'],
                'success_rate': (
                    self.integration_stats['successful_operations'] /
                    max(1, self.integration_stats['successful_operations'] + self.integration_stats['failed_operations'])
                ) * 100,
                'average_response_time': self.integration_stats['average_response_time']
            },
            'cultural_compliance': {
                'validations_passed': self.integration_stats['cultural_validations_passed'],
                'validations_failed': self.integration_stats['cultural_validations_failed'],
                'compliance_rate': (
                    self.integration_stats['cultural_validations_passed'] /
                    max(1, self.integration_stats['cultural_validations_passed'] + self.integration_stats['cultural_validations_failed'])
                ) * 100
            }
        }

    async def health_check(self) -> Dict[str, Any]:
        """Comprehensive health check for entire system"""
        health_status = {
            'status': 'healthy',
            'timestamp': datetime.now(IRAQI_TIMEZONE).isoformat(),
            'components': {}
        }
        
        try:
            # Check Redis
            await self.redis_client.ping()
            health_status['components']['redis'] = 'healthy'
        except Exception as e:
            health_status['components']['redis'] = f'unhealthy: {str(e)}'
            health_status['status'] = 'degraded'
        
        # Check communication components
        if self.websocket_manager:
            try:
                ws_health = await self.websocket_manager.health_check()
                health_status['components']['websocket'] = ws_health.get('status', 'unknown')
            except Exception as e:
                health_status['components']['websocket'] = f'unhealthy: {str(e)}'
                health_status['status'] = 'degraded'
        
        if self.notification_service:
            try:
                notif_health = await self.notification_service.health_check()
                health_status['components']['notification_service'] = notif_health.get('status', 'unknown')
            except Exception as e:
                health_status['components']['notification_service'] = f'unhealthy: {str(e)}'
                health_status['status'] = 'degraded'
        
        if self.message_router:
            try:
                router_health = await self.message_router.health_check()
                health_status['components']['message_router'] = router_health.get('status', 'unknown')
            except Exception as e:
                health_status['components']['message_router'] = f'unhealthy: {str(e)}'
                health_status['status'] = 'degraded'
        
        # Add integration statistics
        health_status['statistics'] = self.get_integration_statistics()
        
        return health_status

    async def shutdown(self) -> None:
        """Graceful shutdown of real-time communication hub"""
        try:
            logger.info("Shutting down Iraqi Real-time Communication Hub...")
            
            # Shutdown components in reverse order of initialization
            if self.message_router:
                await self.message_router.shutdown()
                logger.info("Message router shutdown completed")
            
            if self.notification_service:
                await self.notification_service.shutdown()
                logger.info("Notification service shutdown completed")
            
            if self.websocket_manager:
                await self.websocket_manager.shutdown()
                logger.info("WebSocket manager shutdown completed")
            
            # Close infrastructure connections
            if self.redis_client:
                await self.redis_client.close()
                logger.info("Redis connections closed")
            
            if self.database_engine:
                await self.database_engine.dispose()
                logger.info("Database connections closed")
            
            if self.celery_app:
                self.celery_app.control.shutdown()
                logger.info("Celery shutdown completed")
            
            logger.info("Iraqi Real-time Communication Hub shutdown completed successfully")
            
        except Exception as e:
            logger.error(f"Error during shutdown: {str(e)}")

# Factory function for creating the communication hub
async def create_iraqi_realtime_hub(config: IraqiRealTimeConfig) -> IraqiRealTimeCommunicationHub:
    """
    Factory function to create and initialize Iraqi Real-time Communication Hub
    
    Args:
        config: Configuration for the communication hub
        
    Returns:
        Initialized IraqiRealTimeCommunicationHub instance
    """
    hub = IraqiRealTimeCommunicationHub(config)
    await hub.initialize()
    return hub

# Example usage and integration patterns
if __name__ == "__main__":
    async def example_usage():
        """Example usage of Iraqi Real-time Communication Hub"""
        
        # Create configuration
        config = IraqiRealTimeConfig(
            database_url="postgresql+asyncpg://user:pass@localhost/iraqi_ai",
            redis_url="redis://localhost:6379",
            websocket_host="0.0.0.0",
            websocket_port=8000,
            smtp_username="notifications@iraqi-ai.com",
            smtp_password="app_password",
            cultural_validation_enabled=True,
            monitoring_enabled=True
        )
        
        # Create and initialize hub
        communication_hub = await create_iraqi_realtime_hub(config)
        
        # Example: Send Arabic real-time message
        arabic_result = await communication_hub.send_real_time_message(
            user_id="user_123",
            message_content="مرحباً، كيف حالك اليوم؟",
            message_type=MessageType.CHAT_MESSAGE,
            priority=MessagePriority.HIGH,
            cultural_context=IraqiCulturalContext(
                language_preference="ar",
                islamic_compliance_required=True
            )
        )
        print(f"Arabic message result: {arabic_result['status']}")
        
        # Example: Send payment confirmation
        payment_result = await communication_hub.send_notification(
            user_id="user_456",
            subject="Payment Confirmation",
            message="Your payment of 1000 IQD has been processed successfully.",
            notification_type=NotificationType.PAYMENT_CONFIRMATION,
            priority=NotificationPriority.CRITICAL,
            template_id="payment_confirmation_ar",
            template_variables={
                'user_name': 'أحمد محمد',
                'amount': '1000',
                'gateway': 'ZainCash'
            }
        )
        print(f"Payment notification result: {payment_result['status']}")
        
        # Example: Broadcast system alert
        broadcast_result = await communication_hub.broadcast_message(
            message_content="System maintenance scheduled for tonight at 2:00 AM Baghdad time.",
            message_type=MessageType.SYSTEM_ALERT,
            priority=MessagePriority.HIGH
        )
        print(f"Broadcast result: {broadcast_result['status']}")
        
        # Get system statistics
        stats = communication_hub.get_integration_statistics()
        print(f"System statistics: {json.dumps(stats, indent=2, default=str)}")
        
        # Health check
        health = await communication_hub.health_check()
        print(f"System health: {health['status']}")
        
        # Shutdown
        await communication_hub.shutdown()
    
    # Run example
    asyncio.run(example_usage())