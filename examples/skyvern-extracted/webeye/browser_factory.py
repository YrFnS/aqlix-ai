"""
Skyvern Browser Factory for Iraqi AI Chat System
Enhanced with Arabic RTL support and Iraqi government portal integration
"""

import asyncio
import json
import logging
import tempfile
from pathlib import Path
from typing import Any, Dict, List, Optional, Union
from urllib.parse import urljoin

from playwright.async_api import Browser, BrowserContext, Page, Playwright, async_playwright
from pydantic import BaseModel, Field

from ..config import settings
from ..constants import BROWSER_ARTIFACT_TYPES
from ..schemas import BrowserState, ProxyLocation
from ..utils.enums import BrowserType, SkyvernConfigParameter


logger = logging.getLogger(__name__)


class BrowserConfig(BaseModel):
    """Browser configuration for Iraqi government portals"""
    browser_type: BrowserType = BrowserType.CHROMIUM
    headless: bool = Field(default=True)
    proxy_location: Optional[ProxyLocation] = None
    viewport: Dict[str, int] = Field(default={"width": 1920, "height": 1080})
    timeout: int = Field(default=30000)  # Extended for government portals
    
    # Iraqi-specific configurations
    rtl_support: bool = Field(default=True)
    arabic_font_support: bool = Field(default=True)
    government_portal_mode: bool = Field(default=False)
    islamic_calendar_support: bool = Field(default=True)
    cultural_validation_enabled: bool = Field(default=True)


class IraqiWebPortalSettings(BaseModel):
    """Settings for Iraqi government and business portals"""
    user_agent: str = Field(
        default="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
    accept_language: str = Field(default="ar-IQ,ar;q=0.9,en;q=0.8")
    timezone: str = Field(default="Asia/Baghdad")
    locale: str = Field(default="ar-IQ")
    
    # Government portal specific timeouts
    page_load_timeout: int = Field(default=60000)  # 60 seconds
    navigation_timeout: int = Field(default=45000)  # 45 seconds
    element_timeout: int = Field(default=30000)    # 30 seconds


class BrowserContextFactory:
    """Enhanced browser context factory for Iraqi AI system"""
    
    def __init__(self, config: Optional[BrowserConfig] = None):
        self.config = config or BrowserConfig()
        self.playwright: Optional[Playwright] = None
        self.browser: Optional[Browser] = None
        self._contexts: List[BrowserContext] = []
        
    async def initialize(self) -> None:
        """Initialize Playwright and browser instance"""
        if not self.playwright:
            self.playwright = await async_playwright().start()
            
        if not self.browser:
            browser_kwargs = await self._get_browser_launch_args()
            
            if self.config.browser_type == BrowserType.CHROMIUM:
                self.browser = await self.playwright.chromium.launch(**browser_kwargs)
            elif self.config.browser_type == BrowserType.FIREFOX:
                self.browser = await self.playwright.firefox.launch(**browser_kwargs)
            elif self.config.browser_type == BrowserType.WEBKIT:
                self.browser = await self.playwright.webkit.launch(**browser_kwargs)
            else:
                raise ValueError(f"Unsupported browser type: {self.config.browser_type}")
                
        logger.info(f"Browser initialized: {self.config.browser_type}")
        
    async def create_browser_context(
        self,
        url: Optional[str] = None,
        proxy_server: Optional[str] = None,
        **context_kwargs
    ) -> BrowserContext:
        """Create browser context optimized for Iraqi portals"""
        
        if not self.browser:
            await self.initialize()
            
        # Base context configuration
        context_config = {
            "viewport": self.config.viewport,
            "user_agent": IraqiWebPortalSettings().user_agent,
            "locale": IraqiWebPortalSettings().locale,
            "timezone_id": IraqiWebPortalSettings().timezone,
            "permissions": ["geolocation", "notifications"],
            "color_scheme": "light",
            "reduced_motion": "reduce",
            **context_kwargs
        }
        
        # Add proxy if specified
        if proxy_server:
            context_config["proxy"] = {"server": proxy_server}
            
        # Iraqi government portal optimizations
        if self.config.government_portal_mode:
            context_config.update({
                "extra_http_headers": {
                    "Accept-Language": IraqiWebPortalSettings().accept_language,
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                    "Accept-Encoding": "gzip, deflate, br",
                    "DNT": "1",
                    "Upgrade-Insecure-Requests": "1"
                },
                "java_script_enabled": True,
                "bypass_csp": True,  # Some government sites have strict CSP
            })
            
        # RTL and Arabic font support
        if self.config.rtl_support:
            context_config["extra_http_headers"] = {
                **context_config.get("extra_http_headers", {}),
                "Accept-Charset": "utf-8, iso-8859-1;q=0.5"
            }
            
        # Create context
        context = await self.browser.new_context(**context_config)
        self._contexts.append(context)
        
        # Add Arabic font injection script
        if self.config.arabic_font_support:
            await self._inject_arabic_font_support(context)
            
        # Add RTL layout helpers
        if self.config.rtl_support:
            await self._inject_rtl_helpers(context)
            
        # Add cultural validation helpers
        if self.config.cultural_validation_enabled:
            await self._inject_cultural_validation(context)
            
        logger.info(f"Browser context created for URL: {url}")
        return context
        
    async def _get_browser_launch_args(self) -> Dict[str, Any]:
        """Get browser launch arguments optimized for Iraqi portals"""
        args = {
            "headless": self.config.headless,
            "args": [
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--disable-blink-features=AutomationControlled",
                "--disable-extensions-except",
                "--disable-plugins-discovery",
                "--disable-default-apps",
                "--no-first-run",
                "--no-default-browser-check",
                "--disable-background-timer-throttling",
                "--disable-backgrounding-occluded-windows",
                "--disable-renderer-backgrounding",
                "--disable-features=TranslateUI",
                "--disable-ipc-flooding-protection",
                # Arabic/RTL specific optimizations
                "--force-text-direction=auto",
                "--enable-experimental-web-platform-features",
                "--enable-features=FontAccess",
                # Government portal compatibility
                "--ignore-certificate-errors",
                "--ignore-ssl-errors",
                "--ignore-certificate-errors-spki-list",
                "--disable-web-security"  # Only for government portals
            ]
        }
        
        # Add proxy if configured
        if self.config.proxy_location:
            proxy_server = await self._get_proxy_server()
            if proxy_server:
                args["proxy"] = {"server": proxy_server}
                
        return args
        
    async def _inject_arabic_font_support(self, context: BrowserContext) -> None:
        """Inject Arabic font support into browser context"""
        arabic_font_script = """
        // Add Arabic font support
        const style = document.createElement('style');
        style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap');
            
            * {
                font-family: 'Noto Sans Arabic', 'Segoe UI', 'Tahoma', 'Arial', sans-serif !important;
            }
            
            .arabic-text, [dir="rtl"], [lang="ar"], [lang="ar-IQ"] {
                font-family: 'Noto Sans Arabic', 'Traditional Arabic', 'Arial Unicode MS', sans-serif !important;
                direction: rtl !important;
                text-align: right !important;
            }
            
            input[type="text"], textarea, select {
                font-family: 'Noto Sans Arabic', sans-serif !important;
            }
        `;
        document.head.appendChild(style);
        """
        
        await context.add_init_script(arabic_font_script)
        
    async def _inject_rtl_helpers(self, context: BrowserContext) -> None:
        """Inject RTL layout helpers"""
        rtl_script = """
        // RTL Layout Helpers
        window.IraqiRTLHelpers = {
            detectArabicText: function(text) {
                const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
                return arabicRegex.test(text);
            },
            
            setElementDirection: function(element) {
                if (element.textContent && this.detectArabicText(element.textContent)) {
                    element.dir = 'rtl';
                    element.style.textAlign = 'right';
                }
            },
            
            processPage: function() {
                const elements = document.querySelectorAll('p, span, div, label, input, textarea');
                elements.forEach(el => this.setElementDirection(el));
            }
        };
        
        // Auto-process page on load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                window.IraqiRTLHelpers.processPage();
            });
        } else {
            window.IraqiRTLHelpers.processPage();
        }
        
        // Process dynamic content
        const observer = new MutationObserver(() => {
            window.IraqiRTLHelpers.processPage();
        });
        observer.observe(document.body, { childList: true, subtree: true });
        """
        
        await context.add_init_script(rtl_script)
        
    async def _inject_cultural_validation(self, context: BrowserContext) -> None:
        """Inject cultural validation helpers for Iraqi context"""
        cultural_script = """
        // Iraqi Cultural Validation Helpers
        window.IraqiCulturalHelpers = {
            validateIslamicCompliance: function(content) {
                // Basic Islamic content validation
                const prohibitedTerms = ['gambling', 'alcohol', 'interest', 'usury'];
                const contentLower = content.toLowerCase();
                
                return !prohibitedTerms.some(term => contentLower.includes(term));
            },
            
            formatIraqiCurrency: function(amount) {
                return new Intl.NumberFormat('ar-IQ', {
                    style: 'currency',
                    currency: 'IQD',
                    minimumFractionDigits: 0
                }).format(amount);
            },
            
            formatIraqiDate: function(date) {
                return new Intl.DateTimeFormat('ar-IQ', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    calendar: 'gregory'
                }).format(date);
            },
            
            isBusinessHours: function() {
                const now = new Date();
                const baghdadTime = new Intl.DateTimeFormat('en-US', {
                    timeZone: 'Asia/Baghdad',
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit'
                }).format(now);
                
                const [hours, minutes] = baghdadTime.split(':').map(Number);
                const currentTime = hours + minutes / 60;
                
                // Iraqi business hours: 8:00 AM - 4:00 PM
                return currentTime >= 8 && currentTime < 16;
            }
        };
        """
        
        await context.add_init_script(cultural_script)
        
    async def _get_proxy_server(self) -> Optional[str]:
        """Get proxy server configuration for Iraqi region"""
        if not self.config.proxy_location:
            return None
            
        # This would integrate with actual proxy service
        proxy_mapping = {
            ProxyLocation.IRAQ: "proxy.iraq.example.com:8080",
            ProxyLocation.MIDDLE_EAST: "proxy.me.example.com:8080",
            ProxyLocation.GLOBAL: "proxy.global.example.com:8080"
        }
        
        return proxy_mapping.get(self.config.proxy_location)
        
    async def create_browser_state(
        self,
        url: str,
        context: Optional[BrowserContext] = None
    ) -> BrowserState:
        """Create browser state for Iraqi portal interaction"""
        
        if not context:
            context = await self.create_browser_context(url=url)
            
        page = await context.new_page()
        
        # Set timeouts for Iraqi government portals
        page.set_default_timeout(IraqiWebPortalSettings().page_load_timeout)
        page.set_default_navigation_timeout(IraqiWebPortalSettings().navigation_timeout)
        
        # Navigate to URL with retry logic
        max_retries = 3
        for attempt in range(max_retries):
            try:
                await page.goto(url, wait_until="networkidle", timeout=60000)
                break
            except Exception as e:
                logger.warning(f"Navigation attempt {attempt + 1} failed: {e}")
                if attempt == max_retries - 1:
                    raise
                await asyncio.sleep(2 ** attempt)  # Exponential backoff
                
        # Wait for Arabic fonts to load
        if self.config.arabic_font_support:
            await page.wait_for_function(
                "document.fonts.ready", 
                timeout=10000
            )
            
        return BrowserState(
            page=page,
            context=context,
            url=url,
            browser_factory=self
        )
        
    async def cleanup_context(self, context: BrowserContext) -> None:
        """Cleanup browser context"""
        try:
            if context in self._contexts:
                self._contexts.remove(context)
            await context.close()
        except Exception as e:
            logger.error(f"Error cleaning up context: {e}")
            
    async def cleanup_all(self) -> None:
        """Cleanup all resources"""
        # Close all contexts
        for context in self._contexts[:]:  # Copy list to avoid modification during iteration
            await self.cleanup_context(context)
            
        # Close browser
        if self.browser:
            await self.browser.close()
            self.browser = None
            
        # Stop playwright
        if self.playwright:
            await self.playwright.stop()
            self.playwright = None
            
        logger.info("Browser factory cleanup completed")


# Global factory instance
_browser_factory: Optional[BrowserContextFactory] = None


async def get_browser_factory() -> BrowserContextFactory:
    """Get global browser factory instance"""
    global _browser_factory
    
    if not _browser_factory:
        config = BrowserConfig(
            government_portal_mode=settings.IRAQI_GOVERNMENT_MODE,
            rtl_support=settings.RTL_SUPPORT_ENABLED,
            arabic_font_support=settings.ARABIC_FONT_SUPPORT,
            cultural_validation_enabled=settings.CULTURAL_VALIDATION_ENABLED
        )
        _browser_factory = BrowserContextFactory(config)
        await _browser_factory.initialize()
        
    return _browser_factory


async def create_iraqi_portal_context(
    portal_url: str,
    portal_type: str = "government"
) -> BrowserState:
    """Convenience function for creating Iraqi portal contexts"""
    factory = await get_browser_factory()
    
    # Enhanced configuration for specific portal types
    if portal_type == "government":
        factory.config.government_portal_mode = True
        factory.config.timeout = 60000  # Extended timeout
    elif portal_type == "banking":
        factory.config.cultural_validation_enabled = True
        factory.config.timeout = 45000
    elif portal_type == "education":
        factory.config.rtl_support = True
        factory.config.arabic_font_support = True
        
    return await factory.create_browser_state(portal_url)