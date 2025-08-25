"""Iraqi Network Watchdog - Enhanced browser-use watchdog for Iraqi network conditions.

Monitors network performance, Iraqi ISP conditions, government portal connectivity,
and optimizes for Iraqi infrastructure limitations and regional network characteristics.
"""

from typing import Dict, List, Optional, Set, Tuple
from pydantic import Field, validator
import re
import asyncio
from datetime import datetime, timedelta
from enum import Enum
import statistics

from browser_use.agent.browser.browser_watchdog_base import BaseWatchdog
from browser_use.agent.events import (
    RequestEvent,
    ResponseEvent,
    NetworkErrorEvent,
    ConnectionChangeEvent,
    DataLoadEvent
)

class NetworkQuality(str, Enum):
    """Network connection quality levels."""
    EXCELLENT = "excellent"    # >50 Mbps, <50ms latency
    GOOD = "good"             # 10-50 Mbps, 50-100ms latency
    FAIR = "fair"             # 1-10 Mbps, 100-300ms latency
    POOR = "poor"             # <1 Mbps, >300ms latency
    OFFLINE = "offline"       # No connection

class IraqiISP(str, Enum):
    """Major Iraqi Internet Service Providers."""
    EARTHLINK = "earthlink"
    NEWROZ = "newroz"
    IRAQINET = "iraqinet"
    FANOOS = "fanoos"
    TAMDID = "tamdid"
    UNLIMITED = "unlimited"
    BAGHDAD_SOFT = "baghdad_soft"
    UNKNOWN = "unknown"

class NetworkType(str, Enum):
    """Network connection types common in Iraq."""
    ADSL = "adsl"
    FIBER = "fiber"
    MOBILE_3G = "mobile_3g"
    MOBILE_4G = "mobile_4g"
    SATELLITE = "satellite"
    DIAL_UP = "dial_up"
    UNKNOWN = "unknown"

class IraqiNetworkWatchdog(BaseWatchdog):
    """Enhanced watchdog for Iraqi network condition monitoring.
    
    Features:
    - Iraqi ISP performance tracking
    - Government portal connectivity monitoring
    - Network optimization for Iraqi conditions
    - Bandwidth usage optimization
    - Connection stability tracking
    - Regional network pattern analysis
    - Power outage impact monitoring
    - Peak usage time awareness
    - Mobile network optimization
    - Satellite connection support
    """
    
    # Iraqi Network Configuration
    iraqi_isps: Dict[IraqiISP, Dict] = Field(default_factory=lambda: {
        IraqiISP.EARTHLINK: {
            'name': 'EarthLink Iraq',
            'ip_ranges': ['185.60.216.0/22', '195.229.240.0/20'],
            'typical_speeds': {'download': '10-50', 'upload': '2-10'},
            'peak_hours': ['19:00-23:00'],
            'reliability_score': 0.85
        },
        IraqiISP.NEWROZ: {
            'name': 'Newroz Telecom',
            'ip_ranges': ['185.112.156.0/22'],
            'typical_speeds': {'download': '5-25', 'upload': '1-5'},
            'peak_hours': ['20:00-24:00'],
            'reliability_score': 0.80
        },
        IraqiISP.IRAQINET: {
            'name': 'IraqiNet',
            'ip_ranges': ['217.218.0.0/16'],
            'typical_speeds': {'download': '1-10', 'upload': '0.5-2'},
            'peak_hours': ['18:00-22:00'],
            'reliability_score': 0.70
        },
        IraqiISP.FANOOS: {
            'name': 'Fanoos Telecom',
            'ip_ranges': ['213.187.32.0/19'],
            'typical_speeds': {'download': '2-15', 'upload': '0.5-3'},
            'peak_hours': ['19:00-23:00'],
            'reliability_score': 0.75
        }
    })
    
    # Iraqi Network Performance Thresholds
    iraqi_performance_thresholds: Dict[str, Dict] = Field(default_factory=lambda: {
        'government_portals': {
            'max_load_time': 15.0,      # seconds (accounting for slow connections)
            'max_api_response': 10.0,    # seconds
            'max_download_time': 30.0,   # seconds for documents
            'acceptable_timeout_rate': 0.1  # 10% timeout rate acceptable
        },
        'banking_portals': {
            'max_load_time': 20.0,      # seconds (higher for security processing)
            'max_api_response': 15.0,    # seconds
            'max_download_time': 45.0,   # seconds
            'acceptable_timeout_rate': 0.05  # 5% timeout rate for banking
        },
        'educational_portals': {
            'max_load_time': 25.0,      # seconds (students may have slower connections)
            'max_api_response': 12.0,    # seconds
            'max_download_time': 60.0,   # seconds for large files
            'acceptable_timeout_rate': 0.15  # 15% timeout rate acceptable
        }
    })
    
    # Iraqi Infrastructure Considerations
    power_outage_patterns: Dict[str, List[str]] = Field(default_factory=lambda: {
        'baghdad': ['12:00-14:00', '18:00-20:00'],
        'basra': ['13:00-15:00', '19:00-21:00'],
        'erbil': ['11:00-13:00', '17:00-19:00'],
        'mosul': ['14:00-16:00', '20:00-22:00'],
        'najaf': ['12:30-14:30', '18:30-20:30']
    })
    
    peak_usage_hours: List[str] = Field(default_factory=lambda: [
        '19:00-24:00',  # Evening peak
        '12:00-14:00',  # Lunch break
        '09:00-11:00'   # Morning work hours
    ])
    
    # Network Monitoring State
    connection_metrics: Dict[str, List[float]] = Field(default_factory=dict)
    network_errors: List[Dict] = Field(default_factory=list)
    isp_performance_data: Dict[str, Dict] = Field(default_factory=dict)
    bandwidth_usage_tracking: List[Dict] = Field(default_factory=list)
    
    # Current Connection State
    current_network_quality: NetworkQuality = Field(default=NetworkQuality.FAIR)
    current_isp: IraqiISP = Field(default=IraqiISP.UNKNOWN)
    current_connection_type: NetworkType = Field(default=NetworkType.UNKNOWN)
    
    @validator('iraqi_performance_thresholds')
    def validate_performance_thresholds(cls, v):
        required_keys = {'max_load_time', 'max_api_response', 'max_download_time', 'acceptable_timeout_rate'}
        for portal_type, thresholds in v.items():
            if not all(key in thresholds for key in required_keys):
                raise ValueError(f"Portal type {portal_type} missing required threshold keys")
        return v
    
    def detect_iraqi_isp(self, ip_address: str) -> IraqiISP:
        """Detect Iraqi ISP from IP address."""
        import ipaddress
        
        if not ip_address:
            return IraqiISP.UNKNOWN
        
        try:
            user_ip = ipaddress.ip_address(ip_address)
            
            for isp, config in self.iraqi_isps.items():
                ip_ranges = config.get('ip_ranges', [])
                for ip_range in ip_ranges:
                    try:
                        network = ipaddress.ip_network(ip_range)
                        if user_ip in network:
                            return isp
                    except ValueError:
                        continue
        except ValueError:
            pass
        
        return IraqiISP.UNKNOWN
    
    def get_portal_type(self, url: str) -> str:
        """Determine portal type for performance threshold selection."""
        url_lower = url.lower()
        
        if any(domain in url_lower for domain in ['.gov.iq', '.iraq.gov.iq', '.cbi.iq']):
            return 'government_portals'
        elif any(domain in url_lower for domain in ['bank', 'rafidain', 'rasheed', 'cbi.iq']):
            return 'banking_portals'
        elif any(domain in url_lower for domain in ['.edu.iq', 'university', 'college']):
            return 'educational_portals'
        
        return 'government_portals'  # Default to government portal thresholds
    
    def is_peak_usage_time(self, current_time: datetime = None) -> bool:
        """Check if current time is during peak usage hours."""
        if not current_time:
            current_time = datetime.now()
        
        current_time_str = current_time.strftime("%H:%M")
        
        for peak_period in self.peak_usage_hours:
            start_time, end_time = peak_period.split('-')
            if start_time <= current_time_str <= end_time:
                return True
        
        return False
    
    def is_power_outage_time(self, city: str = 'baghdad', current_time: datetime = None) -> bool:
        """Check if current time coincides with typical power outage hours."""
        if not current_time:
            current_time = datetime.now()
        
        city_lower = city.lower()
        outage_patterns = self.power_outage_patterns.get(city_lower, [])
        current_time_str = current_time.strftime("%H:%M")
        
        for outage_period in outage_patterns:
            start_time, end_time = outage_period.split('-')
            if start_time <= current_time_str <= end_time:
                return True
        
        return False
    
    async def on_RequestEvent(self, event: RequestEvent) -> None:
        """Handle network request events for performance monitoring."""
        try:
            url = getattr(event, 'url', '')
            method = getattr(event, 'method', 'GET')
            headers = getattr(event, 'headers', {})
            request_size = getattr(event, 'request_size', 0)
            timestamp = getattr(event, 'timestamp', datetime.now())
            
            # Track bandwidth usage
            self.bandwidth_usage_tracking.append({
                'url': url,
                'method': method,
                'size': request_size,
                'timestamp': timestamp,
                'type': 'request'
            })
            
            # Check if this is an Iraqi portal request
            portal_type = self.get_portal_type(url)
            
            # Monitor request during peak hours
            if self.is_peak_usage_time(timestamp):
                await self.emit_peak_hour_request(url, portal_type, timestamp)
            
            # Monitor request during power outage hours
            if self.is_power_outage_time('baghdad', timestamp):  # Default to Baghdad
                await self.emit_power_outage_period_request(url, timestamp)
            
        except Exception as e:
            await self.emit_error(f"Request monitoring failed: {str(e)}")
    
    async def on_ResponseEvent(self, event: ResponseEvent) -> None:
        """Handle network response events for performance analysis."""
        try:
            url = getattr(event, 'url', '')
            status_code = getattr(event, 'status_code', 0)
            response_time = getattr(event, 'response_time', 0)  # milliseconds
            response_size = getattr(event, 'response_size', 0)
            headers = getattr(event, 'headers', {})
            timestamp = getattr(event, 'timestamp', datetime.now())
            
            # Convert response time to seconds
            response_time_seconds = response_time / 1000.0
            
            # Track bandwidth usage
            self.bandwidth_usage_tracking.append({
                'url': url,
                'status_code': status_code,
                'size': response_size,
                'response_time': response_time_seconds,
                'timestamp': timestamp,
                'type': 'response'
            })
            
            # Determine portal type and thresholds
            portal_type = self.get_portal_type(url)
            thresholds = self.iraqi_performance_thresholds.get(portal_type, {})
            
            # Check response time against Iraqi thresholds
            max_response_time = thresholds.get('max_api_response', 10.0)
            if response_time_seconds > max_response_time:
                await self.emit_slow_response_warning(
                    url, portal_type, response_time_seconds, max_response_time
                )
            
            # Track connection metrics
            metric_key = f"{portal_type}_response_times"
            if metric_key not in self.connection_metrics:
                self.connection_metrics[metric_key] = []
            
            self.connection_metrics[metric_key].append(response_time_seconds)
            
            # Keep only last 100 measurements
            if len(self.connection_metrics[metric_key]) > 100:
                self.connection_metrics[metric_key] = self.connection_metrics[metric_key][-100:]
            
            # Update network quality assessment
            await self._update_network_quality_assessment()
            
        except Exception as e:
            await self.emit_error(f"Response monitoring failed: {str(e)}")
    
    async def on_NetworkErrorEvent(self, event: NetworkErrorEvent) -> None:
        """Handle network error events."""
        try:
            error_type = getattr(event, 'error_type', 'unknown')
            error_message = getattr(event, 'error_message', '')
            url = getattr(event, 'url', '')
            timestamp = getattr(event, 'timestamp', datetime.now())
            
            # Store network error
            error_record = {
                'error_type': error_type,
                'error_message': error_message,
                'url': url,
                'timestamp': timestamp,
                'portal_type': self.get_portal_type(url),
                'is_peak_hour': self.is_peak_usage_time(timestamp),
                'is_power_outage_time': self.is_power_outage_time('baghdad', timestamp)
            }
            
            self.network_errors.append(error_record)
            
            # Emit Iraqi-specific network error event
            await self.emit_iraqi_network_error(error_record)
            
            # Check if error rate is above acceptable threshold
            await self._check_error_rate_thresholds(url)
            
        except Exception as e:
            await self.emit_error(f"Network error handling failed: {str(e)}")
    
    async def on_ConnectionChangeEvent(self, event: ConnectionChangeEvent) -> None:
        """Handle connection quality changes."""
        try:
            connection_type = getattr(event, 'connection_type', 'unknown')
            download_speed = getattr(event, 'download_speed', 0)  # Mbps
            upload_speed = getattr(event, 'upload_speed', 0)      # Mbps
            latency = getattr(event, 'latency', 0)                # milliseconds
            
            # Update current connection state
            self.current_connection_type = NetworkType(connection_type.lower()) if connection_type.lower() in NetworkType.__members__.values() else NetworkType.UNKNOWN
            
            # Assess network quality
            new_quality = self._assess_network_quality(download_speed, upload_speed, latency)
            
            if new_quality != self.current_network_quality:
                old_quality = self.current_network_quality
                self.current_network_quality = new_quality
                
                await self.emit_network_quality_change(old_quality, new_quality, {
                    'download_speed': download_speed,
                    'upload_speed': upload_speed,
                    'latency': latency,
                    'connection_type': connection_type
                })
            
            # Provide Iraqi-specific optimization recommendations
            await self._provide_network_optimization_recommendations(
                new_quality, connection_type, download_speed, latency
            )
            
        except Exception as e:
            await self.emit_error(f"Connection change handling failed: {str(e)}")
    
    async def on_DataLoadEvent(self, event: DataLoadEvent) -> None:
        """Handle data loading events for bandwidth optimization."""
        try:
            data_type = getattr(event, 'data_type', 'unknown')
            data_size = getattr(event, 'data_size', 0)  # bytes
            load_time = getattr(event, 'load_time', 0)   # milliseconds
            url = getattr(event, 'url', '')
            
            # Calculate effective speed
            if load_time > 0 and data_size > 0:
                effective_speed_mbps = (data_size * 8) / (load_time * 1000)  # Convert to Mbps
                
                # Track data loading performance
                portal_type = self.get_portal_type(url)
                thresholds = self.iraqi_performance_thresholds.get(portal_type, {})
                max_download_time = thresholds.get('max_download_time', 30.0)
                
                load_time_seconds = load_time / 1000.0
                
                if load_time_seconds > max_download_time:
                    await self.emit_slow_data_load_warning(
                        url, portal_type, data_type, data_size, load_time_seconds, max_download_time
                    )
                
                # Provide bandwidth optimization suggestions
                if effective_speed_mbps < 1.0:  # Less than 1 Mbps
                    await self._suggest_bandwidth_optimization(url, data_type, data_size, effective_speed_mbps)
            
        except Exception as e:
            await self.emit_error(f"Data load monitoring failed: {str(e)}")
    
    def _assess_network_quality(self, download_speed: float, upload_speed: float, latency: float) -> NetworkQuality:
        """Assess network quality based on Iraqi standards."""
        if download_speed == 0 and upload_speed == 0:
            return NetworkQuality.OFFLINE
        elif download_speed >= 50 and latency < 50:
            return NetworkQuality.EXCELLENT
        elif download_speed >= 10 and latency < 100:
            return NetworkQuality.GOOD
        elif download_speed >= 1 and latency < 300:
            return NetworkQuality.FAIR
        else:
            return NetworkQuality.POOR
    
    async def _update_network_quality_assessment(self) -> None:
        """Update network quality assessment based on recent performance."""
        # Calculate average response times across all portal types
        all_response_times = []
        for metric_key, times in self.connection_metrics.items():
            if 'response_times' in metric_key and times:
                all_response_times.extend(times[-20:])  # Last 20 measurements
        
        if all_response_times:
            avg_response_time = statistics.mean(all_response_times)
            
            # Assess quality based on average response time
            if avg_response_time < 2.0:
                new_quality = NetworkQuality.EXCELLENT
            elif avg_response_time < 5.0:
                new_quality = NetworkQuality.GOOD
            elif avg_response_time < 10.0:
                new_quality = NetworkQuality.FAIR
            else:
                new_quality = NetworkQuality.POOR
            
            if new_quality != self.current_network_quality:
                old_quality = self.current_network_quality
                self.current_network_quality = new_quality
                
                await self.emit_network_quality_change(old_quality, new_quality, {
                    'average_response_time': avg_response_time,
                    'sample_size': len(all_response_times)
                })
    
    async def _check_error_rate_thresholds(self, url: str) -> None:
        """Check if network error rate exceeds acceptable thresholds."""
        portal_type = self.get_portal_type(url)
        thresholds = self.iraqi_performance_thresholds.get(portal_type, {})
        acceptable_timeout_rate = thresholds.get('acceptable_timeout_rate', 0.1)
        
        # Count recent errors for this portal type (last hour)
        one_hour_ago = datetime.now() - timedelta(hours=1)
        recent_errors = [
            error for error in self.network_errors
            if error['timestamp'] >= one_hour_ago and error['portal_type'] == portal_type
        ]
        
        # Count total requests for this portal type (approximation)
        recent_requests = len([
            usage for usage in self.bandwidth_usage_tracking
            if usage['timestamp'] >= one_hour_ago and 
               self.get_portal_type(usage.get('url', '')) == portal_type
        ])
        
        if recent_requests > 10:  # Only check if we have sufficient data
            error_rate = len(recent_errors) / recent_requests
            
            if error_rate > acceptable_timeout_rate:
                await self.emit_high_error_rate_alert(portal_type, error_rate, acceptable_timeout_rate)
    
    async def _provide_network_optimization_recommendations(self, quality: NetworkQuality, connection_type: str, speed: float, latency: float) -> None:
        """Provide Iraqi-specific network optimization recommendations."""
        recommendations = []
        
        if quality == NetworkQuality.POOR:
            recommendations.extend([
                'Consider using mobile data during peak hours',
                'Enable data compression in browser settings',
                'Use low-bandwidth mode for Iraqi portals',
                'Schedule large downloads during off-peak hours (2:00-8:00 AM)'
            ])
        
        if self.is_peak_usage_time():
            recommendations.extend([
                'Current time is peak usage hour - expect slower speeds',
                'Consider postponing non-urgent tasks',
                'Use cached content when available'
            ])
        
        if connection_type.lower() in ['mobile_3g', 'satellite']:
            recommendations.extend([
                'Optimize images and reduce data usage',
                'Enable text-only mode for better performance',
                'Use progressive loading for large content'
            ])
        
        if recommendations:
            await self.emit_network_optimization_recommendations(quality, recommendations)
    
    async def _suggest_bandwidth_optimization(self, url: str, data_type: str, data_size: int, speed: float) -> None:
        """Suggest bandwidth optimization for slow connections."""
        suggestions = []
        
        if data_type == 'image' and data_size > 500000:  # 500KB
            suggestions.append('Consider image compression or lower resolution')
        
        if data_type == 'video' and speed < 2.0:
            suggestions.append('Use lower video quality or audio-only mode')
        
        if data_type == 'document' and data_size > 10000000:  # 10MB
            suggestions.append('Consider downloading during off-peak hours')
        
        suggestions.extend([
            f'Current effective speed: {speed:.2f} Mbps',
            'Enable data saver mode for better performance',
            'Use Iraqi CDN mirrors when available'
        ])
        
        await self.emit_bandwidth_optimization_suggestions(url, data_type, data_size, suggestions)
    
    # Event Emission Methods
    async def emit_peak_hour_request(self, url: str, portal_type: str, timestamp: datetime):
        """Emit peak hour request event."""
        if self.cultural_validation_enabled:
            from browser_use.agent.events import PeakHourRequestEvent
            event = PeakHourRequestEvent(data={
                'url': url,
                'portal_type': portal_type,
                'timestamp': timestamp.isoformat(),
                'current_network_quality': self.current_network_quality.value
            })
            self.event_bus.dispatch(event)
    
    async def emit_power_outage_period_request(self, url: str, timestamp: datetime):
        """Emit power outage period request event."""
        if self.cultural_validation_enabled:
            from browser_use.agent.events import PowerOutagePeriodRequestEvent
            event = PowerOutagePeriodRequestEvent(data={
                'url': url,
                'timestamp': timestamp.isoformat(),
                'warning': 'Request during typical power outage hours'
            })
            self.event_bus.dispatch(event)
    
    async def emit_slow_response_warning(self, url: str, portal_type: str, response_time: float, threshold: float):
        """Emit slow response warning event."""
        if self.cultural_validation_enabled:
            from browser_use.agent.events import SlowResponseWarningEvent
            event = SlowResponseWarningEvent(data={
                'url': url,
                'portal_type': portal_type,
                'response_time': response_time,
                'threshold': threshold,
                'severity': 'high' if response_time > threshold * 2 else 'medium'
            })
            self.event_bus.dispatch(event)
    
    async def emit_iraqi_network_error(self, error_record: Dict):
        """Emit Iraqi network error event."""
        if self.cultural_validation_enabled:
            from browser_use.agent.events import IraqiNetworkErrorEvent
            event = IraqiNetworkErrorEvent(data={
                'error_type': error_record['error_type'],
                'url': error_record['url'],
                'portal_type': error_record['portal_type'],
                'is_peak_hour': error_record['is_peak_hour'],
                'is_power_outage_time': error_record['is_power_outage_time'],
                'timestamp': error_record['timestamp'].isoformat(),
                'current_isp': self.current_isp.value,
                'current_network_quality': self.current_network_quality.value
            })
            self.event_bus.dispatch(event)
    
    async def emit_network_quality_change(self, old_quality: NetworkQuality, new_quality: NetworkQuality, metrics: Dict):
        """Emit network quality change event."""
        if self.cultural_validation_enabled:
            from browser_use.agent.events import NetworkQualityChangeEvent
            event = NetworkQualityChangeEvent(data={
                'old_quality': old_quality.value,
                'new_quality': new_quality.value,
                'metrics': metrics,
                'current_isp': self.current_isp.value,
                'timestamp': datetime.now().isoformat()
            })
            self.event_bus.dispatch(event)
    
    async def emit_high_error_rate_alert(self, portal_type: str, error_rate: float, threshold: float):
        """Emit high error rate alert."""
        if self.cultural_validation_enabled:
            from browser_use.agent.events import HighErrorRateAlertEvent
            event = HighErrorRateAlertEvent(data={
                'portal_type': portal_type,
                'error_rate': error_rate,
                'threshold': threshold,
                'severity': 'critical' if error_rate > threshold * 3 else 'high'
            })
            self.event_bus.dispatch(event)
    
    async def emit_network_optimization_recommendations(self, quality: NetworkQuality, recommendations: List[str]):
        """Emit network optimization recommendations."""
        if self.cultural_validation_enabled:
            from browser_use.agent.events import NetworkOptimizationRecommendationsEvent
            event = NetworkOptimizationRecommendationsEvent(data={
                'network_quality': quality.value,
                'recommendations': recommendations,
                'timestamp': datetime.now().isoformat()
            })
            self.event_bus.dispatch(event)
    
    async def emit_slow_data_load_warning(self, url: str, portal_type: str, data_type: str, data_size: int, load_time: float, threshold: float):
        """Emit slow data load warning."""
        if self.cultural_validation_enabled:
            from browser_use.agent.events import SlowDataLoadWarningEvent
            event = SlowDataLoadWarningEvent(data={
                'url': url,
                'portal_type': portal_type,
                'data_type': data_type,
                'data_size': data_size,
                'load_time': load_time,
                'threshold': threshold,
                'severity': 'high' if load_time > threshold * 2 else 'medium'
            })
            self.event_bus.dispatch(event)
    
    async def emit_bandwidth_optimization_suggestions(self, url: str, data_type: str, data_size: int, suggestions: List[str]):
        """Emit bandwidth optimization suggestions."""
        if self.cultural_validation_enabled:
            from browser_use.agent.events import BandwidthOptimizationSuggestionsEvent
            event = BandwidthOptimizationSuggestionsEvent(data={
                'url': url,
                'data_type': data_type,
                'data_size': data_size,
                'suggestions': suggestions,
                'current_network_quality': self.current_network_quality.value
            })
            self.event_bus.dispatch(event)
    
    def get_network_performance_summary(self) -> Dict:
        """Get summary of network performance monitoring."""
        total_errors = len(self.network_errors)
        total_bandwidth_tracked = len(self.bandwidth_usage_tracking)
        
        # Calculate average response times by portal type
        avg_response_times = {}
        for metric_key, times in self.connection_metrics.items():
            if 'response_times' in metric_key and times:
                avg_response_times[metric_key] = statistics.mean(times)
        
        # Count errors by type
        error_counts = {}
        for error in self.network_errors:
            error_type = error['error_type']
            error_counts[error_type] = error_counts.get(error_type, 0) + 1
        
        return {
            'total_network_errors': total_errors,
            'total_bandwidth_tracked': total_bandwidth_tracked,
            'current_network_quality': self.current_network_quality.value,
            'current_isp': self.current_isp.value,
            'current_connection_type': self.current_connection_type.value,
            'average_response_times': avg_response_times,
            'error_counts_by_type': error_counts,
            'is_peak_usage_time': self.is_peak_usage_time(),
            'is_power_outage_time': self.is_power_outage_time()
        }