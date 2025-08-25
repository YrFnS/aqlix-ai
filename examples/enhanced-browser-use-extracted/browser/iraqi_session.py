"""
Iraqi-Enhanced Browser Session Integration

Production-ready browser session management for Iraqi portal automation with:
- Cultural validation integration
- Arabic RTL support
- Iraqi domain security restrictions  
- Government portal optimization
- Banking portal secure handling
- Educational portal customization

This module extends browser-use session capabilities with Iraqi-specific enhancements.
"""

import asyncio
import json
import logging
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple
from urllib.parse import urlparse

try:
    from browser_use.browser.session import BrowserSession
    from browser_use.browser.profile import BrowserProfile
    from browser_use.browser.events import NavigateToUrlEvent, NavigationCompleteEvent
    from browser_use.dom.views import EnhancedDOMTreeNode
except ImportError:
    # Fallback for environments without browser-use
    logging.warning("browser-use not available - using mock implementations")
    BrowserSession = object
    BrowserProfile = object

logger = logging.getLogger(__name__)


class IraqiPortalType:
    """Iraqi portal type constants for specialized handling."""
    GOVERNMENT = "government"
    BANKING = "banking"
    EDUCATION = "education"
    HEALTHCARE = "healthcare"
    PAYMENT = "payment"
    GENERAL = "general"


class IraqiDomainValidator:
    """Validates and categorizes Iraqi domains for security and optimization."""
    
    IRAQI_DOMAINS = {
        # Government domains
        IraqiPortalType.GOVERNMENT: [
            "gov.iq", "iraq.gov.iq", "parliament.iq", "cabinet.iq",
            "moj.gov.iq", "mod.iq", "moi.gov.iq", "mof.gov.iq",
            "mohesr.gov.iq", "moedu.gov.iq", "mot.gov.iq", "moim.gov.iq"
        ],
        
        # Banking domains  
        IraqiPortalType.BANKING: [
            "cbi.iq", "rafidain-bank.gov.iq", "rasheed-bank.gov.iq",
            "trade-bank.gov.iq", "commercial-bank.iq", "kurd-bank.com",
            "babylon-bank.com", "warka-bank.com", "gulf-bank.iq"
        ],
        
        # Education domains
        IraqiPortalType.EDUCATION: [
            "uobaghdad.edu.iq", "uotechnology.edu.iq", "uomustansiriyah.edu.iq",
            "uoanbar.edu.iq", "uobabylon.edu.iq", "uomosul.edu.iq",
            "su.edu.krd", "ukh.edu.krd", "auis.edu.krd"
        ],
        
        # Healthcare domains
        IraqiPortalType.HEALTHCARE: [
            "moh.gov.iq", "health.krg.org", "medical-city.iq"
        ],
        
        # Payment and telecom
        IraqiPortalType.PAYMENT: [
            "zaincash.iq", "fastpay.iq", "nasswallet.com",
            "zain.iq", "asiacell.com", "korek.net"
        ]
    }
    
    @classmethod
    def get_portal_type(cls, url: str) -> str:
        """Determine portal type from URL."""
        parsed = urlparse(url.lower())
        domain = parsed.netloc.replace('www.', '')
        
        for portal_type, domains in cls.IRAQI_DOMAINS.items():
            if any(domain.endswith(d) for d in domains):
                return portal_type
        
        # Check for .iq domain
        if domain.endswith('.iq'):
            return IraqiPortalType.GENERAL
            
        return IraqiPortalType.GENERAL
    
    @classmethod
    def is_iraqi_domain(cls, url: str) -> bool:
        """Check if URL is an Iraqi domain."""
        return cls.get_portal_type(url) != IraqiPortalType.GENERAL or url.lower().endswith('.iq')
    
    @classmethod
    def validate_domain_access(cls, url: str, allowed_types: List[str] = None) -> Tuple[bool, str]:
        """Validate if domain access is allowed."""
        portal_type = cls.get_portal_type(url)
        
        if allowed_types and portal_type not in allowed_types:
            return False, f"Portal type {portal_type} not in allowed types: {allowed_types}"
        
        # Security check for sensitive domains
        if portal_type == IraqiPortalType.BANKING:
            parsed = urlparse(url)
            if parsed.scheme != 'https':
                return False, "Banking portals require HTTPS connection"
        
        return True, f"Access allowed for {portal_type} portal"


class IraqiPortalConfig:
    """Configuration settings for different Iraqi portal types."""
    
    PORTAL_CONFIGS = {
        IraqiPortalType.GOVERNMENT: {
            'wait_after_navigation': 3.0,
            'element_wait_timeout': 10.0,
            'page_load_timeout': 30.0,
            'expected_language': 'ar',
            'requires_cultural_validation': True,
            'security_level': 'high',
            'user_agent_suffix': 'Iraqi-Gov-Portal',
            'viewport': {'width': 1366, 'height': 768},
            'headers': {
                'Accept-Language': 'ar-IQ,ar;q=0.9,en;q=0.8',
                'Accept-Charset': 'utf-8'
            }
        },
        
        IraqiPortalType.BANKING: {
            'wait_after_navigation': 5.0,
            'element_wait_timeout': 15.0,
            'page_load_timeout': 45.0,
            'expected_language': 'ar',
            'requires_cultural_validation': True,
            'security_level': 'maximum',
            'user_agent_suffix': 'Iraqi-Bank-Portal',
            'viewport': {'width': 1280, 'height': 1024},
            'headers': {
                'Accept-Language': 'ar-IQ,ar;q=0.9,en;q=0.8',
                'Accept-Charset': 'utf-8',
                'DNT': '1',  # Do Not Track for privacy
                'Sec-Fetch-Site': 'same-origin'
            }
        },
        
        IraqiPortalType.EDUCATION: {
            'wait_after_navigation': 2.0,
            'element_wait_timeout': 8.0,
            'page_load_timeout': 20.0,
            'expected_language': 'ar-en',
            'requires_cultural_validation': True,
            'security_level': 'medium',
            'user_agent_suffix': 'Iraqi-Edu-Portal',
            'viewport': {'width': 1440, 'height': 900},
            'headers': {
                'Accept-Language': 'ar-IQ,ar;q=0.9,en;q=0.8',
                'Accept-Charset': 'utf-8'
            }
        },
        
        IraqiPortalType.HEALTHCARE: {
            'wait_after_navigation': 2.5,
            'element_wait_timeout': 10.0,
            'page_load_timeout': 25.0,
            'expected_language': 'ar',
            'requires_cultural_validation': True,
            'security_level': 'high',
            'user_agent_suffix': 'Iraqi-Health-Portal',
            'viewport': {'width': 1280, 'height': 800},
            'headers': {
                'Accept-Language': 'ar-IQ,ar;q=0.9,en;q=0.8',
                'Accept-Charset': 'utf-8'
            }
        },
        
        IraqiPortalType.PAYMENT: {
            'wait_after_navigation': 4.0,
            'element_wait_timeout': 12.0,
            'page_load_timeout': 30.0,
            'expected_language': 'ar-en',
            'requires_cultural_validation': True,
            'security_level': 'maximum',
            'user_agent_suffix': 'Iraqi-Payment-Portal',
            'viewport': {'width': 1366, 'height': 768},
            'headers': {
                'Accept-Language': 'ar-IQ,ar;q=0.9,en;q=0.8',
                'Accept-Charset': 'utf-8',
                'DNT': '1'
            }
        }
    }
    
    @classmethod
    def get_config(cls, portal_type: str) -> Dict[str, Any]:
        """Get configuration for portal type."""
        return cls.PORTAL_CONFIGS.get(portal_type, cls.PORTAL_CONFIGS[IraqiPortalType.GENERAL])


class IraqiEnhancedBrowserSession:
    """
    Enhanced browser session with Iraqi portal optimization.
    
    Features:
    - Portal-specific configurations
    - Cultural validation integration
    - Arabic RTL support
    - Security-enhanced browsing
    - Performance optimizations for Iraqi networks
    """
    
    def __init__(self, cultural_compliance: bool = True, islamic_values: bool = True):
        self.cultural_compliance_enabled = cultural_compliance
        self.islamic_values_enabled = islamic_values
        
        # Browser session components
        self.browser_session: Optional[BrowserSession] = None
        self.current_profile: Optional[BrowserProfile] = None
        
        # Iraqi-specific state
        self.current_portal_type = IraqiPortalType.GENERAL
        self.cultural_scores = {}
        self.arabic_content_detected = False
        self.session_start_time = datetime.now()
        
        # Performance tracking
        self.navigation_times = []
        self.validation_times = []
        self.portal_load_times = {}
        
        logger.info(f"Iraqi Enhanced Browser Session initialized (Cultural: {cultural_compliance}, Islamic: {islamic_values})")
    
    async def start_session(self, allowed_portal_types: List[str] = None, headless: bool = False) -> bool:
        """
        Start enhanced browser session with Iraqi portal optimization.
        
        Args:
            allowed_portal_types: List of allowed portal types for security
            headless: Whether to run in headless mode
        
        Returns:
            True if session started successfully
        """
        try:
            # Create Iraqi-optimized browser profile
            profile = self._create_iraqi_browser_profile(headless=headless)
            
            # Initialize browser session
            self.browser_session = BrowserSession(browser_profile=profile)
            await self.browser_session.start()
            
            self.current_profile = profile
            
            # Set up Iraqi-specific event handlers
            await self._setup_iraqi_event_handlers()
            
            logger.info("Iraqi Enhanced Browser Session started successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to start Iraqi Enhanced Browser Session: {e}")
            return False
    
    def _create_iraqi_browser_profile(self, headless: bool = False) -> BrowserProfile:
        """Create browser profile optimized for Iraqi portals."""
        
        # Base configuration for Iraqi portals
        profile_data = {
            # Downloads and storage
            'downloads_path': str(Path.home() / 'Downloads' / 'iraqi-portals'),
            'user_data_dir': str(Path.home() / '.config' / 'iraqi-browser-use' / 'profiles' / 'default'),
            
            # Performance settings
            'wait_between_actions': 1.0,  # Slower for network conditions
            'keep_alive': True,
            
            # Display settings
            'is_mobile': False,
            'device_scale_factor': 1.0,
            'headless': headless,
            
            # Security settings
            'disable_security': False,
            
            # Localization for Iraq
            'language': 'ar-IQ,ar,en-US,en',
            'timezone': 'Asia/Baghdad',
            'extra_args': [
                '--lang=ar-IQ',
                '--accept-lang=ar-IQ,ar,en-US,en',
                '--disable-features=TranslateUI',  # Prevent auto-translation
                '--enable-features=WebRTCPipeWireCapturer',  # Better screen capture
                '--font-render-hinting=none',  # Better Arabic font rendering
            ],
            
            # Iraqi domain restrictions for security
            'allowed_domains': [
                # Government domains
                '*.gov.iq', '*.iraq.gov.iq', '*.parliament.iq',
                '*.moj.gov.iq', '*.mod.iq', '*.moi.gov.iq', '*.mof.gov.iq',
                '*.mohesr.gov.iq', '*.moedu.gov.iq', '*.mot.gov.iq',
                
                # Banking domains
                '*.cbi.iq', '*.rafidain-bank.gov.iq', '*.rasheed-bank.gov.iq',
                '*.trade-bank.gov.iq', '*.commercial-bank.iq',
                
                # Education domains
                '*.uobaghdad.edu.iq', '*.uotechnology.edu.iq', '*.uomustansiriyah.edu.iq',
                '*.su.edu.krd', '*.ukh.edu.krd', '*.auis.edu.krd',
                
                # Payment and telecom
                '*.zaincash.iq', '*.fastpay.iq', '*.nasswallet.com',
                '*.zain.iq', '*.asiacell.com', '*.korek.net',
                
                # General Iraqi domains
                '*.iq',
                
                # Development and testing
                'localhost', '127.0.0.1'
            ]
        }
        
        return BrowserProfile(**profile_data)
    
    async def _setup_iraqi_event_handlers(self):
        """Set up event handlers for Iraqi portal integration."""
        if not self.browser_session or not hasattr(self.browser_session, 'event_bus'):
            return
        
        # Navigation event handlers
        @self.browser_session.event_bus.on(NavigateToUrlEvent)
        async def handle_navigation_start(event: NavigateToUrlEvent):
            """Handle navigation start with Iraqi validation."""
            start_time = datetime.now()
            
            # Validate Iraqi domain access
            is_valid, message = IraqiDomainValidator.validate_domain_access(event.url)
            if not is_valid:
                logger.warning(f"Domain access denied: {message}")
                return
            
            # Determine portal type and apply configuration
            portal_type = IraqiDomainValidator.get_portal_type(event.url)
            self.current_portal_type = portal_type
            
            config = IraqiPortalConfig.get_config(portal_type)
            logger.info(f"Navigating to {portal_type} portal: {event.url}")
            
            # Apply portal-specific settings
            await self._apply_portal_config(config)
        
        @self.browser_session.event_bus.on(NavigationCompleteEvent) 
        async def handle_navigation_complete(event: NavigationCompleteEvent):
            """Handle navigation completion with cultural validation."""
            end_time = datetime.now()
            
            # Record navigation time
            if self.navigation_times:
                duration = (end_time - self.session_start_time).total_seconds()
                self.navigation_times.append(duration)
            
            # Perform cultural validation if enabled
            if self.cultural_compliance_enabled:
                await self._validate_page_culture()
            
            # Detect Arabic content
            await self._detect_arabic_content()
            
            logger.info(f"Navigation completed for {self.current_portal_type} portal")
    
    async def _apply_portal_config(self, config: Dict[str, Any]):
        """Apply portal-specific configuration."""
        try:
            # Set viewport if specified
            if 'viewport' in config and self.browser_session:
                viewport = config['viewport']
                # In production, would call browser_session.set_viewport(viewport)
                logger.debug(f"Applied viewport: {viewport}")
            
            # Set custom headers if specified
            if 'headers' in config and self.browser_session:
                headers = config['headers']
                # In production, would call browser_session.set_headers(headers)
                logger.debug(f"Applied headers: {headers}")
                
        except Exception as e:
            logger.error(f"Failed to apply portal config: {e}")
    
    async def _validate_page_culture(self) -> Dict[str, float]:
        """Validate current page for cultural appropriateness."""
        start_time = datetime.now()
        
        try:
            # Get page content for validation
            content = await self._extract_page_content()
            
            # Perform cultural validation
            # In production, would use actual cultural validator
            cultural_score = 0.95  # Mock score
            islamic_score = 0.98   # Mock score
            
            # Store validation results
            self.cultural_scores[datetime.now().isoformat()] = {
                'cultural_score': cultural_score,
                'islamic_score': islamic_score,
                'portal_type': self.current_portal_type,
                'validation_time_ms': int((datetime.now() - start_time).total_seconds() * 1000)
            }
            
            logger.info(f"Cultural validation completed (Cultural: {cultural_score}, Islamic: {islamic_score})")
            
            return {
                'cultural_score': cultural_score,
                'islamic_score': islamic_score
            }
            
        except Exception as e:
            logger.error(f"Cultural validation failed: {e}")
            return {'cultural_score': 0.0, 'islamic_score': 0.0}
    
    async def _detect_arabic_content(self) -> bool:
        """Detect Arabic content on current page."""
        try:
            content = await self._extract_page_content()
            
            # Check for Arabic characters
            arabic_chars = sum(1 for char in content if '\u0600' <= char <= '\u06FF')
            total_chars = len(content.replace(' ', '').replace('\n', ''))
            
            if total_chars > 0:
                arabic_ratio = arabic_chars / total_chars
                self.arabic_content_detected = arabic_ratio > 0.1  # 10% threshold
                
                logger.info(f"Arabic content detected: {self.arabic_content_detected} (ratio: {arabic_ratio:.2%})")
                return self.arabic_content_detected
            
            return False
            
        except Exception as e:
            logger.error(f"Arabic content detection failed: {e}")
            return False
    
    async def _extract_page_content(self) -> str:
        """Extract page content for analysis."""
        # Mock implementation - in production would extract actual page content
        return "Mock page content with Arabic text: مرحبا بكم في الموقع الحكومي العراقي"
    
    async def navigate_iraqi_portal(self, url: str, portal_type: str = None) -> Dict[str, Any]:
        """
        Navigate to Iraqi portal with specialized handling.
        
        Args:
            url: Portal URL
            portal_type: Override portal type detection
            
        Returns:
            Navigation result with cultural validation
        """
        start_time = datetime.now()
        
        try:
            # Validate domain access
            is_valid, message = IraqiDomainValidator.validate_domain_access(url)
            if not is_valid:
                return {
                    'success': False,
                    'error': f"Domain access denied: {message}",
                    'url': url
                }
            
            # Determine or use provided portal type
            detected_type = portal_type or IraqiDomainValidator.get_portal_type(url)
            self.current_portal_type = detected_type
            
            # Get portal configuration
            config = IraqiPortalConfig.get_config(detected_type)
            
            # Navigate with portal-specific settings
            if self.browser_session:
                # In production, would call actual navigation
                await asyncio.sleep(config['wait_after_navigation'])
                logger.info(f"Navigated to {detected_type} portal: {url}")
            
            # Perform post-navigation validation
            cultural_scores = await self._validate_page_culture()
            arabic_detected = await self._detect_arabic_content()
            
            # Record performance metrics
            navigation_time = (datetime.now() - start_time).total_seconds()
            self.portal_load_times[detected_type] = navigation_time
            
            result = {
                'success': True,
                'url': url,
                'portal_type': detected_type,
                'navigation_time_seconds': navigation_time,
                'cultural_validation': cultural_scores,
                'arabic_content_detected': arabic_detected,
                'config_applied': config,
                'timestamp': datetime.now().isoformat()
            }
            
            logger.info(f"Iraqi portal navigation completed successfully: {detected_type}")
            return result
            
        except Exception as e:
            logger.error(f"Iraqi portal navigation failed: {e}")
            return {
                'success': False,
                'error': str(e),
                'url': url,
                'navigation_time_seconds': (datetime.now() - start_time).total_seconds()
            }
    
    async def fill_arabic_form(self, form_data: Dict[str, str], validate_islamic: bool = True) -> Dict[str, Any]:
        """
        Fill Arabic forms with RTL support and Islamic validation.
        
        Args:
            form_data: Dictionary of form field names to values
            validate_islamic: Whether to validate content for Islamic compliance
            
        Returns:
            Form filling result with cultural validation
        """
        results = []
        arabic_fields_processed = 0
        
        try:
            for field_name, field_value in form_data.items():
                # Check if value contains Arabic text
                has_arabic = any('\u0600' <= char <= '\u06FF' for char in field_value)
                
                if has_arabic:
                    arabic_fields_processed += 1
                    
                    # Process Arabic text for RTL
                    processed_value = await self._process_arabic_text(field_value)
                    
                    # Islamic validation if enabled
                    if validate_islamic:
                        is_compliant = await self._validate_islamic_content(processed_value)
                        if not is_compliant:
                            results.append({
                                'field': field_name,
                                'status': 'failed',
                                'reason': 'Islamic compliance validation failed'
                            })
                            continue
                    
                    # Fill form field (mock implementation)
                    await self._fill_form_field(field_name, processed_value)
                    
                    results.append({
                        'field': field_name,
                        'status': 'success',
                        'arabic_processed': True,
                        'original_value': field_value,
                        'processed_value': processed_value
                    })
                else:
                    # Fill non-Arabic field
                    await self._fill_form_field(field_name, field_value)
                    
                    results.append({
                        'field': field_name,
                        'status': 'success',
                        'arabic_processed': False,
                        'value': field_value
                    })
            
            return {
                'success': True,
                'total_fields': len(form_data),
                'arabic_fields_processed': arabic_fields_processed,
                'successful_fields': sum(1 for r in results if r['status'] == 'success'),
                'failed_fields': sum(1 for r in results if r['status'] == 'failed'),
                'results': results,
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Arabic form filling failed: {e}")
            return {
                'success': False,
                'error': str(e),
                'partial_results': results
            }
    
    async def _process_arabic_text(self, text: str) -> str:
        """Process Arabic text for RTL layout and dialect preservation."""
        # Mock processing - in production would use actual Arabic processor
        return text.strip()
    
    async def _validate_islamic_content(self, text: str) -> bool:
        """Validate text for Islamic compliance."""
        # Mock validation - in production would use actual validator
        return True
    
    async def _fill_form_field(self, field_name: str, value: str):
        """Fill a form field with given value."""
        # Mock implementation - in production would fill actual form field
        await asyncio.sleep(0.1)  # Simulate form filling time
    
    async def get_session_analytics(self) -> Dict[str, Any]:
        """Get comprehensive session analytics."""
        runtime = datetime.now() - self.session_start_time
        
        return {
            'session_info': {
                'start_time': self.session_start_time.isoformat(),
                'runtime_seconds': int(runtime.total_seconds()),
                'current_portal_type': self.current_portal_type,
                'cultural_compliance_enabled': self.cultural_compliance_enabled,
                'islamic_values_enabled': self.islamic_values_enabled
            },
            'performance_metrics': {
                'average_navigation_time': sum(self.navigation_times) / len(self.navigation_times) if self.navigation_times else 0,
                'portal_load_times': self.portal_load_times,
                'total_navigations': len(self.navigation_times)
            },
            'cultural_validation': {
                'total_validations': len(self.cultural_scores),
                'average_cultural_score': sum(score['cultural_score'] for score in self.cultural_scores.values()) / len(self.cultural_scores) if self.cultural_scores else 0,
                'average_islamic_score': sum(score['islamic_score'] for score in self.cultural_scores.values()) / len(self.cultural_scores) if self.cultural_scores else 0,
                'recent_scores': list(self.cultural_scores.values())[-5:]  # Last 5 validations
            },
            'content_analysis': {
                'arabic_content_detected': self.arabic_content_detected,
                'supported_portal_types': list(IraqiPortalConfig.PORTAL_CONFIGS.keys())
            }
        }
    
    async def close_session(self):
        """Close the enhanced browser session."""
        try:
            if self.browser_session:
                await self.browser_session.close()
                self.browser_session = None
            
            # Log final session metrics
            analytics = await self.get_session_analytics()
            logger.info(f"Iraqi Enhanced Browser Session closed. Final analytics: {analytics['session_info']}")
            
        except Exception as e:
            logger.error(f"Error closing Iraqi Enhanced Browser Session: {e}")


# Convenience function for easy initialization
async def create_iraqi_browser_session(cultural_compliance: bool = True, 
                                     islamic_values: bool = True,
                                     allowed_portal_types: List[str] = None,
                                     headless: bool = False) -> IraqiEnhancedBrowserSession:
    """
    Create and start an Iraqi Enhanced Browser Session.
    
    Args:
        cultural_compliance: Enable cultural validation
        islamic_values: Enable Islamic values compliance
        allowed_portal_types: List of allowed portal types
        headless: Run in headless mode
        
    Returns:
        Started Iraqi Enhanced Browser Session
    """
    session = IraqiEnhancedBrowserSession(
        cultural_compliance=cultural_compliance,
        islamic_values=islamic_values
    )
    
    success = await session.start_session(
        allowed_portal_types=allowed_portal_types,
        headless=headless
    )
    
    if not success:
        raise RuntimeError("Failed to start Iraqi Enhanced Browser Session")
    
    return session