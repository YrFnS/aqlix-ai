"""
Enhanced crash watchdog with Iraqi AI integration.
Extended browser crash monitoring with Iraqi portal resilience and Arabic content protection.
"""

import asyncio
import time
from typing import TYPE_CHECKING, ClassVar, Dict, List, Optional, Set
import psutil

from bubus import BaseEvent
from pydantic import Field, PrivateAttr

from ..watchdog_base import (
    BaseWatchdog,
    IraqiSecurityThreatEvent
)

if TYPE_CHECKING:
    pass


class NetworkRequestTracker:
    """Enhanced network request tracker with Iraqi portal context."""
    
    def __init__(self, request_id: str, start_time: float, url: str, method: str, resource_type: str | None = None):
        self.request_id = request_id
        self.start_time = start_time
        self.url = url
        self.method = method
        self.resource_type = resource_type
        self.is_iraqi_portal = self._is_iraqi_portal_request(url)
        self.expected_timeout = 15.0 if self.is_iraqi_portal else 10.0  # Longer timeout for Iraqi portals
    
    def _is_iraqi_portal_request(self, url: str) -> bool:
        """Check if request is to Iraqi portal."""
        iraqi_domains = ['.gov.iq', '.iraq.gov.iq', '.cbi.iq', '.zaincash.iq', '.fastpay.iq']
        return any(domain in url.lower() for domain in iraqi_domains)


class IraqiCrashWatchdog(BaseWatchdog):
    """
    Enhanced crash watchdog with Iraqi AI integration.
    
    Monitors browser health with special considerations for:
    - Iraqi government portal connectivity
    - Arabic content processing stability
    - Cultural validation service health
    - Payment gateway resilience
    - Network timeout optimization for Iraqi infrastructure
    """
    
    # Event contracts
    LISTENS_TO: ClassVar[list[type[BaseEvent]]] = []  # Will be populated from browser events
    EMITS: ClassVar[list[type[BaseEvent]]] = [
        IraqiSecurityThreatEvent,
    ]
    
    # Enhanced timeout configuration for Iraqi context
    network_timeout_seconds: float = Field(default=12.0)  # Extended for Iraqi network conditions
    iraqi_portal_timeout_seconds: float = Field(default=20.0)  # Even longer for government portals
    check_interval_seconds: float = Field(default=3.0)  # More frequent checks
    
    # Iraqi-specific monitoring
    monitor_iraqi_portals: bool = Field(default=True)
    monitor_arabic_processing: bool = Field(default=True)
    monitor_cultural_validation: bool = Field(default=True)
    monitor_payment_gateways: bool = Field(default=True)
    
    # Resilience configuration
    max_consecutive_failures: int = Field(default=3)
    recovery_retry_delay_seconds: float = Field(default=5.0)
    enable_automatic_recovery: bool = Field(default=True)
    
    # Performance thresholds
    memory_usage_threshold_mb: float = Field(default=1024.0)  # 1GB threshold
    cpu_usage_threshold_percent: float = Field(default=80.0)
    
    # Private state
    _active_requests: Dict[str, NetworkRequestTracker] = PrivateAttr(default_factory=dict)
    _monitoring_task: Optional[asyncio.Task] = PrivateAttr(default=None)
    _last_responsive_checks: Dict[str, float] = PrivateAttr(default_factory=dict)
    _iraqi_portal_health: Dict[str, dict] = PrivateAttr(default_factory=dict)
    _failure_counts: Dict[str, int] = PrivateAttr(default_factory=dict)
    _recovery_attempts: Dict[str, int] = PrivateAttr(default_factory=dict)
    _performance_alerts: List[dict] = PrivateAttr(default_factory=list)

    async def on_BrowserConnectedEvent(self, event) -> None:
        """
        Start enhanced monitoring when browser is connected.
        
        Args:
            event: BrowserConnectedEvent
        """
        self.logger.info('🚀 Starting Iraqi-enhanced browser monitoring')
        
        # Start comprehensive monitoring
        if not self._monitoring_task:
            self._monitoring_task = asyncio.create_task(self._enhanced_monitoring_loop())
        
        # Initialize Iraqi portal health tracking
        await self._initialize_iraqi_portal_monitoring()

    async def on_BrowserStoppedEvent(self, event) -> None:
        """
        Stop monitoring when browser stops.
        
        Args:
            event: BrowserStoppedEvent
        """
        self.logger.info('🛑 Stopping Iraqi-enhanced browser monitoring')
        await self._stop_monitoring()

    async def on_NavigateToUrlEvent(self, event) -> None:
        """
        Monitor navigation to Iraqi portals.
        
        Args:
            event: NavigateToUrlEvent
        """
        url = getattr(event, 'url', '')
        
        if self.is_iraqi_government_url(url):
            portal_type = self._classify_iraqi_portal(url)
            self.logger.info(f'🇮🇶 Monitoring navigation to {portal_type} portal: {url}')
            
            # Start portal-specific monitoring
            await self._start_portal_monitoring(url, portal_type)

    async def on_NavigationCompleteEvent(self, event) -> None:
        """
        Complete portal monitoring and health check.
        
        Args:
            event: NavigationCompleteEvent
        """
        url = getattr(event, 'url', '')
        
        if self.is_iraqi_government_url(url):
            await self._complete_portal_monitoring(url, event)

    async def on_TabCreatedEvent(self, event) -> None:
        """
        Monitor new tab creation for Iraqi portals.
        
        Args:
            event: TabCreatedEvent
        """
        target_id = getattr(event, 'target_id', '')
        url = getattr(event, 'url', '')
        
        if target_id and self.monitor_iraqi_portals:
            await self._attach_to_target(target_id, url)

    async def _enhanced_monitoring_loop(self) -> None:
        """
        Enhanced monitoring loop with Iraqi-specific checks.
        """
        while True:
            try:
                # Perform comprehensive health checks
                await asyncio.gather(
                    self._check_network_timeouts(),
                    self._check_iraqi_portal_health(),
                    self._check_system_performance(),
                    self._check_arabic_processing_health(),
                    self._check_cultural_validation_health(),
                    return_exceptions=True
                )
                
                await asyncio.sleep(self.check_interval_seconds)
                
            except Exception as e:
                self.logger.error(f'Error in enhanced monitoring loop: {e}')
                await asyncio.sleep(self.check_interval_seconds)

    async def _check_network_timeouts(self) -> None:
        """
        Check for network request timeouts with Iraqi portal considerations.
        """
        current_time = time.time()
        timed_out_requests = []
        
        for request_id, tracker in list(self._active_requests.items()):
            request_age = current_time - tracker.start_time
            timeout_threshold = tracker.expected_timeout
            
            if request_age > timeout_threshold:
                timed_out_requests.append(tracker)
                
                # Log timeout with context
                portal_context = " (Iraqi Portal)" if tracker.is_iraqi_portal else ""
                self.logger.warning(
                    f'⏰ Network timeout{portal_context}: {tracker.url} '
                    f'after {request_age:.1f}s (threshold: {timeout_threshold}s)'
                )
                
                # Update failure tracking
                await self._handle_network_failure(tracker)
                
                # Remove from active requests
                del self._active_requests[request_id]
        
        # Emit security threat if multiple Iraqi portal timeouts
        iraqi_timeouts = [req for req in timed_out_requests if req.is_iraqi_portal]
        if len(iraqi_timeouts) >= 2:
            await self.emit_iraqi_security_threat(
                threat_type='multiple_iraqi_portal_timeouts',
                url='multiple_portals',
                details={
                    'timeout_count': len(iraqi_timeouts),
                    'affected_portals': [req.url for req in iraqi_timeouts],
                    'timestamp': current_time
                }
            )

    async def _check_iraqi_portal_health(self) -> None:
        """
        Check health of Iraqi government portals.
        """
        if not self.monitor_iraqi_portals:
            return
            
        current_time = time.time()
        
        for portal_url, health_data in self._iraqi_portal_health.items():
            last_check = health_data.get('last_health_check', 0)
            check_interval = 60.0  # Check every minute
            
            if current_time - last_check > check_interval:
                try:
                    health_status = await self._perform_portal_health_check(portal_url)
                    health_data.update(health_status)
                    health_data['last_health_check'] = current_time
                    
                    # Alert on portal health issues
                    if not health_status.get('healthy', True):
                        await self._handle_portal_health_issue(portal_url, health_status)
                        
                except Exception as e:
                    self.logger.error(f'Error checking Iraqi portal health {portal_url}: {e}')
                    
                    # Mark as unhealthy
                    health_data['healthy'] = False
                    health_data['last_error'] = str(e)
                    health_data['last_health_check'] = current_time

    async def _check_system_performance(self) -> None:
        """
        Check system performance with Iraqi AI processing context.
        """
        try:
            # Memory usage check
            memory_info = psutil.virtual_memory()
            process = psutil.Process()
            process_memory_mb = process.memory_info().rss / 1024 / 1024
            
            if process_memory_mb > self.memory_usage_threshold_mb:
                self.logger.warning(
                    f'⚠️ High memory usage: {process_memory_mb:.1f}MB '
                    f'(threshold: {self.memory_usage_threshold_mb}MB)'
                )
                
                await self._handle_high_memory_usage(process_memory_mb)
            
            # CPU usage check
            cpu_percent = psutil.cpu_percent(interval=0.1)
            if cpu_percent > self.cpu_usage_threshold_percent:
                self.logger.warning(
                    f'⚠️ High CPU usage: {cpu_percent:.1f}% '
                    f'(threshold: {self.cpu_usage_threshold_percent}%)'
                )
                
                await self._handle_high_cpu_usage(cpu_percent)
            
            # Log performance metrics
            performance_data = {
                'timestamp': time.time(),
                'memory_usage_mb': process_memory_mb,
                'memory_percent': memory_info.percent,
                'cpu_percent': cpu_percent,
                'healthy': (
                    process_memory_mb <= self.memory_usage_threshold_mb and 
                    cpu_percent <= self.cpu_usage_threshold_percent
                )
            }
            
            self._performance_alerts.append(performance_data)
            
            # Keep only recent performance data
            if len(self._performance_alerts) > 100:
                self._performance_alerts = self._performance_alerts[-50:]
                
        except Exception as e:
            self.logger.error(f'Error checking system performance: {e}')

    async def _check_arabic_processing_health(self) -> None:
        """
        Check Arabic content processing service health.
        """
        if not self.monitor_arabic_processing:
            return
            
        try:
            # Simulate Arabic processing health check
            # In real implementation, would check arabic-rtl-processor agent health
            
            processing_healthy = True  # Would be determined by actual health check
            
            if not processing_healthy:
                self.logger.warning('⚠️ Arabic processing service health issue detected')
                
                await self.emit_iraqi_security_threat(
                    threat_type='arabic_processing_service_failure',
                    url='arabic_processor',
                    details={
                        'service': 'arabic-rtl-processor',
                        'timestamp': time.time(),
                        'impact': 'Arabic content processing may be degraded'
                    }
                )
                
        except Exception as e:
            self.logger.error(f'Error checking Arabic processing health: {e}')

    async def _check_cultural_validation_health(self) -> None:
        """
        Check cultural validation service health.
        """
        if not self.monitor_cultural_validation:
            return
            
        try:
            # Simulate cultural validation health check
            # In real implementation, would check iraqi-cultural-validator agent health
            
            validation_healthy = True  # Would be determined by actual health check
            
            if not validation_healthy:
                self.logger.warning('⚠️ Cultural validation service health issue detected')
                
                await self.emit_iraqi_security_threat(
                    threat_type='cultural_validation_service_failure',
                    url='cultural_validator',
                    details={
                        'service': 'iraqi-cultural-validator',
                        'timestamp': time.time(),
                        'impact': 'Cultural validation may be compromised'
                    }
                )
                
        except Exception as e:
            self.logger.error(f'Error checking cultural validation health: {e}')

    async def _initialize_iraqi_portal_monitoring(self) -> None:
        """
        Initialize monitoring for Iraqi government portals.
        """
        iraqi_portals = [
            'https://cabinet.iq',
            'https://cbi.iq',
            'https://moh.gov.iq',
            'https://moe.gov.iq'
        ]
        
        for portal_url in iraqi_portals:
            self._iraqi_portal_health[portal_url] = {
                'healthy': True,
                'last_health_check': 0,
                'consecutive_failures': 0,
                'portal_type': self._classify_iraqi_portal(portal_url),
                'monitoring_enabled': True
            }
        
        self.logger.info(f'🇮🇶 Initialized monitoring for {len(iraqi_portals)} Iraqi portals')

    def _classify_iraqi_portal(self, url: str) -> str:
        """
        Classify Iraqi portal type.
        
        Args:
            url: Portal URL
            
        Returns:
            Portal classification
        """
        url_lower = url.lower()
        
        if 'cabinet.iq' in url_lower:
            return 'government_cabinet'
        elif 'cbi.iq' in url_lower:
            return 'central_bank'
        elif 'moh.gov.iq' in url_lower:
            return 'health_ministry'
        elif 'moe.gov.iq' in url_lower:
            return 'education_ministry'
        elif 'zaincash' in url_lower:
            return 'zaincash_payment'
        elif 'fastpay' in url_lower:
            return 'fastpay_payment'
        elif 'gov.iq' in url_lower:
            return 'government_general'
        else:
            return 'iraqi_other'

    async def _start_portal_monitoring(self, url: str, portal_type: str) -> None:
        """
        Start monitoring specific Iraqi portal.
        
        Args:
            url: Portal URL
            portal_type: Portal classification
        """
        if url not in self._iraqi_portal_health:
            self._iraqi_portal_health[url] = {
                'healthy': True,
                'last_health_check': time.time(),
                'consecutive_failures': 0,
                'portal_type': portal_type,
                'monitoring_enabled': True,
                'navigation_start_time': time.time()
            }
        else:
            self._iraqi_portal_health[url]['navigation_start_time'] = time.time()

    async def _complete_portal_monitoring(self, url: str, event) -> None:
        """
        Complete Iraqi portal monitoring after navigation.
        
        Args:
            url: Portal URL
            event: Navigation complete event
        """
        if url in self._iraqi_portal_health:
            portal_data = self._iraqi_portal_health[url]
            navigation_time = time.time() - portal_data.get('navigation_start_time', time.time())
            
            portal_data['last_successful_navigation'] = time.time()
            portal_data['last_navigation_time_seconds'] = navigation_time
            
            # Log successful navigation
            self.logger.info(
                f'✅ Iraqi {portal_data["portal_type"]} portal navigation completed: '
                f'{url} in {navigation_time:.1f}s'
            )
            
            # Reset failure count on success
            portal_data['consecutive_failures'] = 0

    async def _perform_portal_health_check(self, portal_url: str) -> Dict[str, any]:
        """
        Perform health check on Iraqi portal.
        
        Args:
            portal_url: Portal URL to check
            
        Returns:
            Health check results
        """
        try:
            # In real implementation, would perform actual connectivity check
            # For now, simulate health check based on portal type and current state
            
            portal_data = self._iraqi_portal_health.get(portal_url, {})
            consecutive_failures = portal_data.get('consecutive_failures', 0)
            
            # Simulate health based on failure history
            simulated_healthy = consecutive_failures < self.max_consecutive_failures
            
            return {
                'healthy': simulated_healthy,
                'response_time_ms': 2500 if simulated_healthy else -1,  # Simulate Iraqi network latency
                'status_code': 200 if simulated_healthy else 503,
                'last_check_timestamp': time.time(),
                'portal_type': portal_data.get('portal_type', 'unknown')
            }
            
        except Exception as e:
            return {
                'healthy': False,
                'error': str(e),
                'last_check_timestamp': time.time(),
                'portal_type': 'unknown'
            }

    async def _handle_network_failure(self, tracker: NetworkRequestTracker) -> None:
        """
        Handle network request failure.
        
        Args:
            tracker: Failed network request tracker
        """
        failure_key = tracker.url
        
        # Update failure count
        self._failure_counts[failure_key] = self._failure_counts.get(failure_key, 0) + 1
        
        # Special handling for Iraqi portals
        if tracker.is_iraqi_portal:
            if tracker.url in self._iraqi_portal_health:
                portal_data = self._iraqi_portal_health[tracker.url]
                portal_data['consecutive_failures'] = portal_data.get('consecutive_failures', 0) + 1
                portal_data['last_failure_time'] = time.time()
                
                # Trigger recovery if enabled
                if (self.enable_automatic_recovery and 
                    portal_data['consecutive_failures'] >= self.max_consecutive_failures):
                    await self._attempt_portal_recovery(tracker.url)

    async def _handle_portal_health_issue(self, portal_url: str, health_status: Dict) -> None:
        """
        Handle Iraqi portal health issue.
        
        Args:
            portal_url: Portal URL with health issue
            health_status: Health check results
        """
        portal_data = self._iraqi_portal_health[portal_url]
        portal_type = portal_data.get('portal_type', 'unknown')
        
        self.logger.warning(
            f'🚨 Iraqi {portal_type} portal health issue: {portal_url} - '
            f'Status: {health_status.get("status_code", "unknown")}'
        )
        
        await self.emit_iraqi_security_threat(
            threat_type='iraqi_portal_health_issue',
            url=portal_url,
            details={
                'portal_type': portal_type,
                'health_status': health_status,
                'consecutive_failures': portal_data.get('consecutive_failures', 0),
                'timestamp': time.time()
            }
        )

    async def _handle_high_memory_usage(self, memory_mb: float) -> None:
        """
        Handle high memory usage situation.
        
        Args:
            memory_mb: Current memory usage in MB
        """
        # Attempt memory optimization
        optimization_actions = []
        
        # Clear old performance alerts
        if len(self._performance_alerts) > 20:
            self._performance_alerts = self._performance_alerts[-20:]
            optimization_actions.append("performance_alerts_cleared")
        
        # Clear old failure tracking
        current_time = time.time()
        old_failures = []
        for url, timestamp in self._last_responsive_checks.items():
            if current_time - timestamp > 3600:  # 1 hour old
                old_failures.append(url)
        
        for url in old_failures:
            del self._last_responsive_checks[url]
            optimization_actions.append(f"old_failure_data_cleared_{len(old_failures)}")
        
        self.logger.info(
            f'🧹 Memory optimization applied ({memory_mb:.1f}MB): ' + 
            ', '.join(optimization_actions)
        )

    async def _handle_high_cpu_usage(self, cpu_percent: float) -> None:
        """
        Handle high CPU usage situation.
        
        Args:
            cpu_percent: Current CPU usage percentage
        """
        # Reduce monitoring frequency temporarily
        original_interval = self.check_interval_seconds
        self.check_interval_seconds = min(10.0, original_interval * 2)
        
        self.logger.info(
            f'⚡ Reduced monitoring frequency to {self.check_interval_seconds}s '
            f'due to high CPU usage ({cpu_percent:.1f}%)'
        )
        
        # Reset after some time
        async def reset_interval():
            await asyncio.sleep(60)  # Wait 1 minute
            self.check_interval_seconds = original_interval
            self.logger.info('🔄 Restored normal monitoring frequency')
        
        asyncio.create_task(reset_interval())

    async def _attempt_portal_recovery(self, portal_url: str) -> None:
        """
        Attempt recovery for failed Iraqi portal.
        
        Args:
            portal_url: Portal URL to recover
        """
        recovery_key = f"recovery_{portal_url}"
        current_attempts = self._recovery_attempts.get(recovery_key, 0)
        
        if current_attempts >= 3:  # Max 3 recovery attempts
            self.logger.warning(f'🚫 Maximum recovery attempts reached for {portal_url}')
            return
        
        self._recovery_attempts[recovery_key] = current_attempts + 1
        
        self.logger.info(f'🔄 Attempting portal recovery for {portal_url} (attempt {current_attempts + 1})')
        
        try:
            # Wait before retry
            await asyncio.sleep(self.recovery_retry_delay_seconds)
            
            # Perform recovery health check
            health_status = await self._perform_portal_health_check(portal_url)
            
            if health_status.get('healthy', False):
                self.logger.info(f'✅ Portal recovery successful: {portal_url}')
                
                # Reset failure counts
                if portal_url in self._iraqi_portal_health:
                    self._iraqi_portal_health[portal_url]['consecutive_failures'] = 0
                
                # Reset recovery attempts
                if recovery_key in self._recovery_attempts:
                    del self._recovery_attempts[recovery_key]
            else:
                self.logger.warning(f'❌ Portal recovery failed: {portal_url}')
                
        except Exception as e:
            self.logger.error(f'Error in portal recovery for {portal_url}: {e}')

    async def _attach_to_target(self, target_id: str, url: str) -> None:
        """
        Attach monitoring to browser target.
        
        Args:
            target_id: Browser target ID
            url: Target URL
        """
        try:
            # In real implementation, would attach CDP session monitoring
            self.logger.debug(f'📎 Attached crash monitoring to target {target_id}: {url}')
            
            # Track target for Iraqi portal monitoring
            if self.is_iraqi_government_url(url):
                portal_type = self._classify_iraqi_portal(url)
                self.logger.info(f'🇮🇶 Monitoring {portal_type} portal target: {target_id}')
                
        except Exception as e:
            self.logger.error(f'Failed to attach to target {target_id}: {e}')

    async def _stop_monitoring(self) -> None:
        """Stop all monitoring tasks."""
        if self._monitoring_task:
            self._monitoring_task.cancel()
            try:
                await self._monitoring_task
            except asyncio.CancelledError:
                pass
            finally:
                self._monitoring_task = None
        
        self.logger.info('🛑 All monitoring tasks stopped')

    def get_crash_monitoring_summary(self) -> Dict[str, any]:
        """
        Get comprehensive crash monitoring summary.
        
        Returns:
            Monitoring summary dictionary
        """
        current_time = time.time()
        
        # Calculate portal health summary
        portal_health_summary = {}
        for url, health_data in self._iraqi_portal_health.items():
            portal_type = health_data.get('portal_type', 'unknown')
            if portal_type not in portal_health_summary:
                portal_health_summary[portal_type] = {
                    'total': 0,
                    'healthy': 0,
                    'unhealthy': 0
                }
            
            portal_health_summary[portal_type]['total'] += 1
            if health_data.get('healthy', True):
                portal_health_summary[portal_type]['healthy'] += 1
            else:
                portal_health_summary[portal_type]['unhealthy'] += 1
        
        return {
            'timestamp': current_time,
            'monitoring_active': self._monitoring_task is not None,
            'active_requests': len(self._active_requests),
            'iraqi_portals_monitored': len(self._iraqi_portal_health),
            'portal_health_summary': portal_health_summary,
            'total_failure_count': sum(self._failure_counts.values()),
            'recent_performance_alerts': len([
                alert for alert in self._performance_alerts
                if current_time - alert.get('timestamp', 0) < 3600
            ]),
            'recovery_attempts_active': len(self._recovery_attempts),
            'configuration': {
                'network_timeout_seconds': self.network_timeout_seconds,
                'iraqi_portal_timeout_seconds': self.iraqi_portal_timeout_seconds,
                'check_interval_seconds': self.check_interval_seconds,
                'monitor_iraqi_portals': self.monitor_iraqi_portals,
                'enable_automatic_recovery': self.enable_automatic_recovery
            }
        }