"""
Iraqi performance monitoring watchdog.
Enhanced performance monitoring with Iraqi portal optimization and Arabic content processing metrics.
"""

import asyncio
import time
from typing import TYPE_CHECKING, ClassVar, Dict, List, Optional
import psutil
from statistics import mean

from bubus import BaseEvent
from pydantic import Field, PrivateAttr

from ..watchdog_base import BaseWatchdog

if TYPE_CHECKING:
    pass


class IraqiPerformanceWatchdog(BaseWatchdog):
    """
    Enhanced performance watchdog with Iraqi AI optimization.
    
    Monitors:
    - Page load performance for Iraqi portals
    - Arabic content processing performance
    - Cultural validation processing times
    - Memory usage during Iraqi AI operations
    - Network performance for Iraqi domains
    """
    
    # Event contracts
    LISTENS_TO: ClassVar[list[type[BaseEvent]]] = []  # Will be populated from browser events
    EMITS: ClassVar[list[type[BaseEvent]]] = []
    
    # Performance thresholds
    page_load_threshold_ms: float = Field(default=3000.0, gt=0.0)
    iraqi_portal_load_threshold_ms: float = Field(default=5000.0, gt=0.0)  # Higher threshold for government portals
    arabic_processing_threshold_ms: float = Field(default=200.0, gt=0.0)
    cultural_validation_threshold_ms: float = Field(default=500.0, gt=0.0)
    memory_usage_threshold_mb: float = Field(default=512.0, gt=0.0)
    
    # Monitoring configuration
    performance_monitoring_enabled: bool = Field(default=True)
    detailed_metrics_collection: bool = Field(default=True)
    iraqi_portal_optimization: bool = Field(default=True)
    arabic_processing_optimization: bool = Field(default=True)
    
    # Performance tracking intervals
    monitoring_interval_seconds: float = Field(default=2.0, gt=0.0)
    metrics_retention_hours: int = Field(default=24, gt=0)
    
    # Private state
    _performance_history: List[dict] = PrivateAttr(default_factory=list)
    _page_load_times: Dict[str, List[float]] = PrivateAttr(default_factory=dict)
    _arabic_processing_times: List[float] = PrivateAttr(default_factory=list)
    _cultural_validation_times: List[float] = PrivateAttr(default_factory=list)
    _iraqi_portal_performance: Dict[str, dict] = PrivateAttr(default_factory=dict)
    _monitoring_task: Optional[asyncio.Task] = PrivateAttr(default=None)

    async def on_NavigateToUrlEvent(self, event) -> None:
        """
        Start performance monitoring for navigation.
        
        Args:
            event: NavigateToUrlEvent with URL being navigated to
        """
        if not self.performance_monitoring_enabled:
            return
            
        url = getattr(event, 'url', '')
        
        # Start performance tracking
        performance_context = {
            'url': url,
            'start_time': time.time(),
            'is_iraqi_portal': self.is_iraqi_government_url(url),
            'navigation_id': getattr(event, 'event_id', ''),
            'expected_threshold': (
                self.iraqi_portal_load_threshold_ms if self.is_iraqi_government_url(url)
                else self.page_load_threshold_ms
            )
        }
        
        # Store navigation context for completion tracking
        event_id = getattr(event, 'event_id', url)
        self._performance_history.append(performance_context)
        
        self.logger.debug(f'🚀 Started performance tracking for: {url}')

    async def on_NavigationCompleteEvent(self, event) -> None:
        """
        Complete performance monitoring for navigation.
        
        Args:
            event: NavigationCompleteEvent with navigation completion details
        """
        if not self.performance_monitoring_enabled:
            return
            
        url = getattr(event, 'url', '')
        completion_time = time.time()
        
        # Find matching navigation start
        navigation_context = None
        for context in reversed(self._performance_history):
            if context.get('url') == url and 'completion_time' not in context:
                navigation_context = context
                break
        
        if not navigation_context:
            self.logger.warning(f'⚠️ No navigation start found for completion: {url}')
            return
        
        # Calculate performance metrics
        load_time_ms = (completion_time - navigation_context['start_time']) * 1000
        navigation_context['completion_time'] = completion_time
        navigation_context['load_time_ms'] = load_time_ms
        
        # Analyze performance
        await self._analyze_navigation_performance(navigation_context)
        
        # Update portal-specific performance tracking
        if navigation_context['is_iraqi_portal']:
            await self._update_iraqi_portal_performance(url, load_time_ms)
        
        self.logger.debug(f'⏱️ Navigation completed: {url} in {load_time_ms:.1f}ms')

    async def on_ArabicContentProcessedEvent(self, event) -> None:
        """
        Monitor Arabic content processing performance.
        
        Args:
            event: ArabicContentProcessedEvent with processing details
        """
        if not self.arabic_processing_optimization:
            return
            
        processing_data = getattr(event, 'data', {})
        processing_time = processing_data.get('processing_time_ms', 0)
        
        if processing_time > 0:
            self._arabic_processing_times.append(processing_time)
            
            # Check threshold
            if processing_time > self.arabic_processing_threshold_ms:
                self.logger.warning(
                    f'⚠️ Slow Arabic processing: {processing_time:.1f}ms '
                    f'(threshold: {self.arabic_processing_threshold_ms}ms)'
                )
                
                await self._optimize_arabic_processing()
        
        # Cleanup old entries
        self._cleanup_processing_times()

    async def on_IraqiCulturalViolationEvent(self, event) -> None:
        """
        Monitor cultural validation processing performance.
        
        Args:
            event: IraqiCulturalViolationEvent with validation details
        """
        processing_data = getattr(event, 'data', {})
        validation_time = processing_data.get('validation_time_ms', 0)
        
        if validation_time > 0:
            self._cultural_validation_times.append(validation_time)
            
            # Check threshold
            if validation_time > self.cultural_validation_threshold_ms:
                self.logger.warning(
                    f'⚠️ Slow cultural validation: {validation_time:.1f}ms '
                    f'(threshold: {self.cultural_validation_threshold_ms}ms)'
                )

    async def on_BrowserConnectedEvent(self, event) -> None:
        """
        Start continuous performance monitoring when browser connects.
        
        Args:
            event: BrowserConnectedEvent
        """
        if self.enable_performance_monitoring and not self._monitoring_task:
            self._monitoring_task = asyncio.create_task(self._continuous_performance_monitoring())
            self.logger.info('🎯 Started continuous performance monitoring')

    async def on_BrowserStoppedEvent(self, event) -> None:
        """
        Stop performance monitoring when browser stops.
        
        Args:
            event: BrowserStoppedEvent
        """
        if self._monitoring_task:
            self._monitoring_task.cancel()
            try:
                await self._monitoring_task
            except asyncio.CancelledError:
                pass
            finally:
                self._monitoring_task = None
            
            self.logger.info('🛑 Stopped performance monitoring')

    async def _analyze_navigation_performance(self, context: Dict) -> None:
        """
        Analyze navigation performance and provide optimization recommendations.
        
        Args:
            context: Navigation performance context
        """
        url = context['url']
        load_time_ms = context['load_time_ms']
        threshold = context['expected_threshold']
        is_iraqi_portal = context['is_iraqi_portal']
        
        # Performance classification
        if load_time_ms <= threshold * 0.5:
            performance_class = 'excellent'
        elif load_time_ms <= threshold * 0.75:
            performance_class = 'good'
        elif load_time_ms <= threshold:
            performance_class = 'acceptable'
        else:
            performance_class = 'poor'
        
        context['performance_class'] = performance_class
        
        # Log performance result
        portal_type = 'Iraqi portal' if is_iraqi_portal else 'regular page'
        self.logger.info(
            f'📊 {portal_type} performance: {url} - '
            f'{load_time_ms:.1f}ms ({performance_class})'
        )
        
        # Provide optimization recommendations for poor performance
        if performance_class == 'poor':
            await self._provide_optimization_recommendations(context)
        
        # Update URL-specific performance tracking
        if url not in self._page_load_times:
            self._page_load_times[url] = []
        self._page_load_times[url].append(load_time_ms)
        
        # Keep only recent load times (last 20 entries per URL)
        if len(self._page_load_times[url]) > 20:
            self._page_load_times[url] = self._page_load_times[url][-20:]

    async def _update_iraqi_portal_performance(self, url: str, load_time_ms: float) -> None:
        """
        Update performance tracking for Iraqi portals.
        
        Args:
            url: Portal URL
            load_time_ms: Load time in milliseconds
        """
        portal_type = self._classify_iraqi_portal(url)
        
        if portal_type not in self._iraqi_portal_performance:
            self._iraqi_portal_performance[portal_type] = {
                'load_times': [],
                'average_load_time': 0.0,
                'best_load_time': float('inf'),
                'worst_load_time': 0.0,
                'total_loads': 0
            }
        
        portal_stats = self._iraqi_portal_performance[portal_type]
        portal_stats['load_times'].append(load_time_ms)
        portal_stats['total_loads'] += 1
        portal_stats['best_load_time'] = min(portal_stats['best_load_time'], load_time_ms)
        portal_stats['worst_load_time'] = max(portal_stats['worst_load_time'], load_time_ms)
        
        # Keep only recent load times (last 50 per portal type)
        if len(portal_stats['load_times']) > 50:
            portal_stats['load_times'] = portal_stats['load_times'][-50:]
        
        # Update average
        portal_stats['average_load_time'] = mean(portal_stats['load_times'])
        
        # Log portal performance insights
        if portal_stats['total_loads'] % 10 == 0:  # Every 10 loads
            self.logger.info(
                f'📈 {portal_type} portal performance summary: '
                f'avg={portal_stats["average_load_time"]:.1f}ms, '
                f'best={portal_stats["best_load_time"]:.1f}ms, '
                f'loads={portal_stats["total_loads"]}'
            )

    def _classify_iraqi_portal(self, url: str) -> str:
        """
        Classify Iraqi portal type for performance tracking.
        
        Args:
            url: Portal URL
            
        Returns:
            Portal type classification
        """
        url_lower = url.lower()
        
        if 'gov.iq' in url_lower or 'cabinet.iq' in url_lower:
            return 'government'
        elif 'cbi.iq' in url_lower:
            return 'banking'
        elif 'moh.gov.iq' in url_lower:
            return 'healthcare'
        elif 'moe.gov.iq' in url_lower:
            return 'education'
        elif any(payment in url_lower for payment in ['zaincash', 'fastpay', 'nasswallet']):
            return 'payment'
        else:
            return 'other_iraqi'

    async def _provide_optimization_recommendations(self, context: Dict) -> None:
        """
        Provide optimization recommendations for poor performance.
        
        Args:
            context: Navigation performance context
        """
        url = context['url']
        load_time_ms = context['load_time_ms']
        is_iraqi_portal = context['is_iraqi_portal']
        
        recommendations = []
        
        # General recommendations
        if load_time_ms > 5000:  # 5+ seconds
            recommendations.append("Consider enabling browser caching")
            recommendations.append("Check network connectivity")
        
        # Iraqi portal specific recommendations
        if is_iraqi_portal:
            recommendations.append("Iraqi portal detected - network latency may be factor")
            recommendations.append("Consider accessing during off-peak hours")
            
            portal_type = self._classify_iraqi_portal(url)
            if portal_type == 'government':
                recommendations.append("Government portal - access during business hours (8AM-5PM)")
            elif portal_type == 'banking':
                recommendations.append("Banking portal - ensure secure connection")
        
        # Browser optimization
        recommendations.append("Clear browser cache if persistent issues")
        recommendations.append("Disable unnecessary browser extensions")
        
        self.logger.info(
            f'💡 Performance optimization recommendations for {url}:\n  • ' + 
            '\n  • '.join(recommendations)
        )

    async def _optimize_arabic_processing(self) -> None:
        """
        Implement Arabic processing optimizations.
        """
        recent_times = self._arabic_processing_times[-10:]  # Last 10 processing times
        
        if len(recent_times) >= 5:
            avg_time = mean(recent_times)
            
            if avg_time > self.arabic_processing_threshold_ms:
                self.logger.info(
                    f'🔧 Implementing Arabic processing optimizations '
                    f'(current avg: {avg_time:.1f}ms)'
                )
                
                # Optimization strategies would be implemented here
                # For now, log the optimization intent
                optimizations = [
                    "Enable Arabic text caching",
                    "Optimize RTL processing algorithms", 
                    "Preload common Iraqi dialect patterns",
                    "Enable parallel processing for large texts"
                ]
                
                self.logger.info('🎯 Arabic processing optimizations:\n  • ' + '\n  • '.join(optimizations))

    async def _continuous_performance_monitoring(self) -> None:
        """
        Continuous system performance monitoring.
        """
        while True:
            try:
                # Collect system metrics
                system_metrics = await self._collect_system_metrics()
                
                # Check memory usage
                if system_metrics['memory_usage_mb'] > self.memory_usage_threshold_mb:
                    self.logger.warning(
                        f'⚠️ High memory usage: {system_metrics["memory_usage_mb"]:.1f}MB '
                        f'(threshold: {self.memory_usage_threshold_mb}MB)'
                    )
                    
                    await self._handle_high_memory_usage(system_metrics)
                
                # Store metrics in history
                if self.detailed_metrics_collection:
                    self._performance_history.append({
                        'timestamp': time.time(),
                        'type': 'system_metrics',
                        'metrics': system_metrics
                    })
                
                # Cleanup old history
                await self._cleanup_performance_history()
                
                await asyncio.sleep(self.monitoring_interval_seconds)
                
            except Exception as e:
                self.logger.error(f'Error in continuous performance monitoring: {e}')
                await asyncio.sleep(self.monitoring_interval_seconds)

    async def _collect_system_metrics(self) -> Dict[str, float]:
        """
        Collect system performance metrics.
        
        Returns:
            System metrics dictionary
        """
        try:
            # Memory usage
            memory_info = psutil.virtual_memory()
            process = psutil.Process()
            process_memory = process.memory_info()
            
            # CPU usage
            cpu_percent = psutil.cpu_percent(interval=0.1)
            process_cpu = process.cpu_percent()
            
            return {
                'timestamp': time.time(),
                'memory_usage_mb': process_memory.rss / 1024 / 1024,
                'memory_usage_percent': memory_info.percent,
                'cpu_usage_percent': cpu_percent,
                'process_cpu_percent': process_cpu,
                'available_memory_mb': memory_info.available / 1024 / 1024,
                'arabic_processing_avg_ms': (
                    mean(self._arabic_processing_times[-10:]) if self._arabic_processing_times else 0
                ),
                'cultural_validation_avg_ms': (
                    mean(self._cultural_validation_times[-10:]) if self._cultural_validation_times else 0
                )
            }
        except Exception as e:
            self.logger.error(f'Error collecting system metrics: {e}')
            return {
                'timestamp': time.time(),
                'memory_usage_mb': 0,
                'memory_usage_percent': 0,
                'cpu_usage_percent': 0,
                'process_cpu_percent': 0,
                'available_memory_mb': 0,
                'arabic_processing_avg_ms': 0,
                'cultural_validation_avg_ms': 0
            }

    async def _handle_high_memory_usage(self, metrics: Dict) -> None:
        """
        Handle high memory usage situation.
        
        Args:
            metrics: Current system metrics
        """
        memory_usage_mb = metrics['memory_usage_mb']
        
        # Memory optimization strategies
        optimizations_applied = []
        
        # Clear processing time caches
        if len(self._arabic_processing_times) > 100:
            self._arabic_processing_times = self._arabic_processing_times[-50:]
            optimizations_applied.append("Arabic processing cache reduced")
        
        if len(self._cultural_validation_times) > 100:
            self._cultural_validation_times = self._cultural_validation_times[-50:]
            optimizations_applied.append("Cultural validation cache reduced")
        
        # Clear old performance history
        current_time = time.time()
        retention_seconds = self.metrics_retention_hours * 3600
        
        old_count = len(self._performance_history)
        self._performance_history = [
            entry for entry in self._performance_history
            if current_time - entry.get('timestamp', 0) < retention_seconds
        ]
        
        if len(self._performance_history) < old_count:
            optimizations_applied.append(f"Performance history reduced by {old_count - len(self._performance_history)} entries")
        
        # Log optimization actions
        if optimizations_applied:
            self.logger.info(
                f'🧹 Memory optimization applied ({memory_usage_mb:.1f}MB usage):\n  • ' + 
                '\n  • '.join(optimizations_applied)
            )

    def _cleanup_processing_times(self) -> None:
        """Clean up old processing time entries."""
        max_entries = 1000
        
        if len(self._arabic_processing_times) > max_entries:
            self._arabic_processing_times = self._arabic_processing_times[-max_entries:]
        
        if len(self._cultural_validation_times) > max_entries:
            self._cultural_validation_times = self._cultural_validation_times[-max_entries:]

    async def _cleanup_performance_history(self) -> None:
        """Clean up old performance history entries."""
        if not self.detailed_metrics_collection:
            return
        
        current_time = time.time()
        retention_seconds = self.metrics_retention_hours * 3600
        max_entries = 10000  # Hard limit
        
        # Remove entries older than retention period
        self._performance_history = [
            entry for entry in self._performance_history
            if current_time - entry.get('timestamp', 0) < retention_seconds
        ]
        
        # Enforce hard limit
        if len(self._performance_history) > max_entries:
            self._performance_history = self._performance_history[-max_entries:]

    def get_performance_summary(self) -> Dict[str, any]:
        """
        Get comprehensive performance summary.
        
        Returns:
            Performance summary dictionary
        """
        current_time = time.time()
        
        # Recent performance metrics
        recent_entries = [
            entry for entry in self._performance_history
            if current_time - entry.get('timestamp', 0) < 3600  # Last hour
        ]
        
        summary = {
            'timestamp': current_time,
            'monitoring_active': self._monitoring_task is not None,
            'total_navigations_tracked': len([
                e for e in self._performance_history 
                if e.get('type') != 'system_metrics' and 'load_time_ms' in e
            ]),
            'recent_navigations': len(recent_entries),
            'arabic_processing_stats': {
                'total_processed': len(self._arabic_processing_times),
                'average_time_ms': mean(self._arabic_processing_times) if self._arabic_processing_times else 0,
                'recent_average_ms': mean(self._arabic_processing_times[-10:]) if self._arabic_processing_times else 0
            },
            'cultural_validation_stats': {
                'total_validations': len(self._cultural_validation_times),
                'average_time_ms': mean(self._cultural_validation_times) if self._cultural_validation_times else 0,
                'recent_average_ms': mean(self._cultural_validation_times[-10:]) if self._cultural_validation_times else 0
            },
            'iraqi_portal_performance': self._iraqi_portal_performance.copy(),
            'performance_thresholds': {
                'page_load_ms': self.page_load_threshold_ms,
                'iraqi_portal_load_ms': self.iraqi_portal_load_threshold_ms,
                'arabic_processing_ms': self.arabic_processing_threshold_ms,
                'cultural_validation_ms': self.cultural_validation_threshold_ms,
                'memory_usage_mb': self.memory_usage_threshold_mb
            }
        }
        
        return summary