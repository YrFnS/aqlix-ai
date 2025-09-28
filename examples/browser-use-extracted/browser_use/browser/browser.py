"""
Core Browser Engine - Extracted from browser-use
Multi-browser control system with Iraqi portal compatibility
"""

import asyncio
import logging
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Dict, List, Optional, Union, Callable
from pathlib import Path
import json
import base64

from playwright.async_api import (
    async_playwright,
    Browser as PlaywrightBrowser,
    Page,
    BrowserContext,
)
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.firefox.options import Options as FirefoxOptions

logger = logging.getLogger(__name__)


class BrowserType(Enum):
    """Supported browser types"""

    CHROME = "chrome"
    FIREFOX = "firefox"
    SAFARI = "safari"
    EDGE = "edge"


class BrowserMode(Enum):
    """Browser operation modes"""

    HEADLESS = "headless"
    GUI = "gui"
    STEALTH = "stealth"


@dataclass
class BrowserConfig:
    """Browser configuration settings"""

    browser_type: BrowserType = BrowserType.CHROME
    mode: BrowserMode = BrowserMode.HEADLESS
    viewport_width: int = 1920
    viewport_height: int = 1080
    timeout: int = 30000
    user_agent: Optional[str] = None
    proxy: Optional[str] = None
    extensions: List[str] = field(default_factory=list)
    downloads_path: Optional[str] = None

    # Iraqi-specific settings
    arabic_support: bool = True
    rtl_layout: bool = True
    iraqi_portals: bool = True
    government_hours_check: bool = True
    cultural_validation: bool = True
    network_optimization: bool = True


class Browser:
    """
    Core browser automation engine with multi-browser support
    Extracted from browser-use with Iraqi portal optimizations
    """

    def __init__(self, config: BrowserConfig = None):
        self.config = config or BrowserConfig()
        self.playwright = None
        self.browser = None
        self.context = None
        self.page = None
        self.selenium_driver = None
        self._session_id = None
        self.is_running = False

        # Iraqi portal optimizations
        self.iraqi_selectors = self._load_iraqi_selectors()
        self.government_portals = self._load_government_portals()
        self.arabic_fonts = self._get_arabic_fonts()

    async def start(self) -> None:
        """Start the browser with configured settings"""
        try:
            logger.info(f"Starting {self.config.browser_type.value} browser")

            if self.config.browser_type in [
                BrowserType.CHROME,
                BrowserType.FIREFOX,
                BrowserType.SAFARI,
                BrowserType.EDGE,
            ]:
                await self._start_playwright()
            else:
                await self._start_selenium()

            self.is_running = True
            logger.info("Browser started successfully")

        except Exception as e:
            logger.error(f"Failed to start browser: {e}")
            raise

    async def _start_playwright(self) -> None:
        """Start browser using Playwright"""
        self.playwright = await async_playwright().start()

        browser_args = self._get_browser_args()

        if self.config.browser_type == BrowserType.CHROME:
            self.browser = await self.playwright.chromium.launch(**browser_args)
        elif self.config.browser_type == BrowserType.FIREFOX:
            self.browser = await self.playwright.firefox.launch(**browser_args)
        elif self.config.browser_type == BrowserType.SAFARI:
            self.browser = await self.playwright.webkit.launch(**browser_args)
        elif self.config.browser_type == BrowserType.EDGE:
            self.browser = await self.playwright.chromium.launch(
                channel="msedge", **browser_args
            )

        # Create context with Iraqi optimizations
        context_options = self._get_context_options()
        self.context = await self.browser.new_context(**context_options)

        # Add Arabic font support
        if self.config.arabic_support:
            await self._setup_arabic_support()

        self.page = await self.context.new_page()
        await self._setup_page()

    def _start_selenium(self) -> None:
        """Start browser using Selenium (fallback)"""
        if self.config.browser_type == BrowserType.CHROME:
            options = ChromeOptions()
            if self.config.mode == BrowserMode.HEADLESS:
                options.add_argument("--headless")
            if self.config.arabic_support:
                options.add_argument("--lang=ar-IQ")
            self.selenium_driver = webdriver.Chrome(options=options)
        elif self.config.browser_type == BrowserType.FIREFOX:
            options = FirefoxOptions()
            if self.config.mode == BrowserMode.HEADLESS:
                options.add_argument("--headless")
            self.selenium_driver = webdriver.Firefox(options=options)

    def _get_browser_args(self) -> Dict[str, Any]:
        """Get browser launch arguments"""
        args = {
            "headless": self.config.mode == BrowserMode.HEADLESS,
            "timeout": self.config.timeout,
        }

        if self.config.downloads_path:
            args["downloads_path"] = self.config.downloads_path

        return args

    def _get_context_options(self) -> Dict[str, Any]:
        """Get browser context options with Iraqi optimizations"""
        options = {
            "viewport": {
                "width": self.config.viewport_width,
                "height": self.config.viewport_height,
            },
            "user_agent": self.config.user_agent,
            "locale": "ar-IQ" if self.config.arabic_support else "en-US",
            "timezone_id": "Asia/Baghdad",
        }

        # Add proxy if configured
        if self.config.proxy:
            options["proxy"] = {"server": self.config.proxy}

        # Iraqi network optimizations
        if self.config.network_optimization:
            options["extra_http_headers"] = {
                "Accept-Language": "ar-IQ,ar;q=0.9,en;q=0.8"
            }

        return options

    async def _setup_arabic_support(self) -> None:
        """Setup Arabic font and RTL support"""
        arabic_css = """
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700&display=swap');
        
        * {
            font-family: 'Noto Sans Arabic', 'Arial Unicode MS', sans-serif !important;
        }
        
        [dir="rtl"] {
            direction: rtl;
            text-align: right;
        }
        
        .arabic-text {
            font-family: 'Noto Sans Arabic', 'Arial Unicode MS', sans-serif;
            direction: rtl;
            text-align: right;
        }
        </style>
        """

        await self.context.add_init_script(f"""
        document.addEventListener('DOMContentLoaded', function() {{
            const style = document.createElement('style');
            style.textContent = `{arabic_css}`;
            document.head.appendChild(style);
        }});
        """)

    async def _setup_page(self) -> None:
        """Setup page with Iraqi portal optimizations"""
        # Set timeout for Iraqi network conditions
        self.page.set_default_timeout(self.config.timeout)
        self.page.set_default_navigation_timeout(self.config.timeout)

        # Add Iraqi portal detection script
        if self.config.iraqi_portals:
            await self.page.add_init_script("""
            window.iraqiPortalDetector = {
                isGovernmentPortal: function() {
                    const governmentDomains = [
                        '.gov.iq', '.edu.iq', '.org.iq',
                        'passport', 'ministry', 'university'
                    ];
                    return governmentDomains.some(domain => 
                        window.location.hostname.includes(domain)
                    );
                },
                isArabicContent: function() {
                    const arabicPattern = /[\u0600-\u06ff]/;
                    return arabicPattern.test(document.body.textContent);
                }
            };
            """)

    async def navigate(self, url: str, wait_until: str = "networkidle") -> None:
        """Navigate to URL with Iraqi portal optimizations"""
        try:
            logger.info(f"Navigating to: {url}")

            # Check if it's Iraqi government hours
            if self.config.government_hours_check and self._is_government_portal(url):
                if not self._is_government_hours():
                    logger.warning("Accessing government portal outside official hours")

            await self.page.goto(url, wait_until=wait_until)

            # Wait for Arabic content to load if detected
            if self.config.arabic_support:
                await self._wait_for_arabic_content()

            logger.info("Navigation completed successfully")

        except Exception as e:
            logger.error(f"Navigation failed: {e}")
            raise

    async def get_page_content(self) -> str:
        """Get page content with Arabic text support"""
        content = await self.page.content()

        # Normalize Arabic text if present
        if self.config.arabic_support and self._contains_arabic(content):
            content = self._normalize_arabic_text(content)

        return content

    async def take_screenshot(self, path: Optional[str] = None) -> bytes:
        """Take screenshot with RTL layout support"""
        screenshot_options = {"full_page": True, "type": "png"}

        if path:
            screenshot_options["path"] = path

        return await self.page.screenshot(**screenshot_options)

    async def fill_form(
        self, form_data: Dict[str, str], form_selector: str = "form"
    ) -> None:
        """Fill form with Iraqi data validation"""
        try:
            form = await self.page.wait_for_selector(form_selector)

            for field_name, value in form_data.items():
                # Find field using Iraqi portal selectors
                field_selector = self._get_iraqi_field_selector(field_name)

                try:
                    field = await self.page.wait_for_selector(
                        field_selector, timeout=5000
                    )

                    # Validate Iraqi data format
                    if self._is_iraqi_data_field(field_name):
                        value = self._format_iraqi_data(field_name, value)

                    await field.fill(value)
                    logger.info(f"Filled field {field_name} with value")

                except Exception as e:
                    logger.warning(f"Could not fill field {field_name}: {e}")

        except Exception as e:
            logger.error(f"Form filling failed: {e}")
            raise

    async def click_element(self, selector: str, timeout: int = None) -> None:
        """Click element with Arabic text support"""
        timeout = timeout or self.config.timeout

        try:
            # Wait for element to be clickable
            await self.page.wait_for_selector(selector, timeout=timeout)
            element = await self.page.query_selector(selector)

            if element:
                await element.click()
                logger.info(f"Clicked element: {selector}")
            else:
                # Try Arabic selector alternatives
                arabic_selector = self._get_arabic_selector_alternative(selector)
                if arabic_selector:
                    await self.page.click(arabic_selector)
                else:
                    raise Exception(f"Element not found: {selector}")

        except Exception as e:
            logger.error(f"Click failed: {e}")
            raise

    async def wait_for_download(self, filename_pattern: str = None) -> str:
        """Wait for file download with Iraqi document support"""
        try:
            async with self.page.expect_download() as download_info:
                download = await download_info.value

                # Get suggested filename
                suggested_filename = download.suggested_filename

                # Handle Arabic filenames
                if self.config.arabic_support and self._contains_arabic(
                    suggested_filename
                ):
                    suggested_filename = self._normalize_arabic_filename(
                        suggested_filename
                    )

                # Save file
                downloads_path = Path(self.config.downloads_path or "downloads")
                downloads_path.mkdir(exist_ok=True)

                file_path = downloads_path / suggested_filename
                await download.save_as(file_path)

                logger.info(f"Downloaded file: {file_path}")
                return str(file_path)

        except Exception as e:
            logger.error(f"Download failed: {e}")
            raise

    async def close(self) -> None:
        """Close browser and cleanup resources"""
        try:
            if self.page:
                await self.page.close()
            if self.context:
                await self.context.close()
            if self.browser:
                await self.browser.close()
            if self.playwright:
                await self.playwright.stop()
            if self.selenium_driver:
                self.selenium_driver.quit()

            self.is_running = False
            logger.info("Browser closed successfully")

        except Exception as e:
            logger.error(f"Error closing browser: {e}")

    # Helper methods for Iraqi portal support

    def _load_iraqi_selectors(self) -> Dict[str, str]:
        """Load Iraqi portal specific selectors"""
        return {
            "passport_number": "input[name*='passport'], input[id*='passport'], input[placeholder*='جواز']",
            "national_id": "input[name*='national'], input[id*='id'], input[placeholder*='هوية']",
            "phone_number": "input[name*='phone'], input[id*='mobile'], input[placeholder*='هاتف']",
            "email": "input[type='email'], input[name*='email'], input[placeholder*='بريد']",
            "submit_button": "button[type='submit'], input[type='submit'], button:contains('إرسال')",
            "next_button": "button:contains('التالي'), button:contains('Next'), .next-btn",
            "back_button": "button:contains('السابق'), button:contains('Back'), .back-btn",
        }

    def _load_government_portals(self) -> List[str]:
        """Load list of Iraqi government portal domains"""
        return [
            "passport.gov.iq",
            "mohe.gov.iq",
            "moi.gov.iq",
            "mol.gov.iq",
            "mof.gov.iq",
            "university.edu.iq",
            "baghdad.gov.iq",
            "basra.gov.iq",
            "erbil.gov.iq",
        ]

    def _get_arabic_fonts(self) -> List[str]:
        """Get Arabic font list for web rendering"""
        return [
            "Noto Sans Arabic",
            "Arial Unicode MS",
            "Tahoma",
            "Microsoft Sans Serif",
            "Traditional Arabic",
        ]

    def _is_government_portal(self, url: str) -> bool:
        """Check if URL is an Iraqi government portal"""
        return any(domain in url for domain in self.government_portals)

    def _is_government_hours(self) -> bool:
        """Check if current time is within Iraqi government working hours"""
        from datetime import datetime
        import pytz

        baghdad_tz = pytz.timezone("Asia/Baghdad")
        now = datetime.now(baghdad_tz)

        # Government hours: 8:00 AM - 2:00 PM, Sunday to Thursday
        return (
            now.weekday() < 4  # Sunday=6, Monday=0, ..., Thursday=3
            and 8 <= now.hour <= 14
        )

    def _contains_arabic(self, text: str) -> bool:
        """Check if text contains Arabic characters"""
        arabic_pattern = r"[\u0600-\u06FF]"
        import re

        return bool(re.search(arabic_pattern, text))

    def _normalize_arabic_text(self, text: str) -> str:
        """Normalize Arabic text for better processing"""
        # Remove diacritics, normalize characters
        import unicodedata

        return unicodedata.normalize("NFKD", text)

    def _normalize_arabic_filename(self, filename: str) -> str:
        """Normalize Arabic filename for file system compatibility"""
        # Replace problematic characters, ensure proper encoding
        import re

        filename = re.sub(r'[<>:"/\\|?*]', "_", filename)
        return filename[:255]  # Limit filename length

    def _get_iraqi_field_selector(self, field_name: str) -> str:
        """Get CSS selector for Iraqi portal form fields"""
        return self.iraqi_selectors.get(field_name, f"input[name='{field_name}']")

    def _is_iraqi_data_field(self, field_name: str) -> bool:
        """Check if field requires Iraqi data formatting"""
        iraqi_fields = ["passport_number", "national_id", "phone_number"]
        return field_name in iraqi_fields

    def _format_iraqi_data(self, field_name: str, value: str) -> str:
        """Format data according to Iraqi standards"""
        if field_name == "phone_number":
            # Format: +964XXXXXXXXX
            if not value.startswith("+964"):
                value = f"+964{value.lstrip('0')}"
        elif field_name == "national_id":
            # Iraqi national ID format validation
            value = value.replace("-", "").replace(" ", "")

        return value

    def _get_arabic_selector_alternative(self, selector: str) -> Optional[str]:
        """Get Arabic text alternative for selector"""
        arabic_alternatives = {
            ":contains('Submit')": ":contains('إرسال')",
            ":contains('Next')": ":contains('التالي')",
            ":contains('Back')": ":contains('السابق')",
            ":contains('Search')": ":contains('بحث')",
            ":contains('Login')": ":contains('دخول')",
        }

        for english, arabic in arabic_alternatives.items():
            if english in selector:
                return selector.replace(english, arabic)

        return None

    async def _wait_for_arabic_content(self) -> None:
        """Wait for Arabic content to properly load"""
        try:
            await self.page.wait_for_function(
                """
                () => {
                    const arabicPattern = /[\u0600-\u06ff]/;
                    return arabicPattern.test(document.body.textContent) || 
                           document.readyState === 'complete';
                }
            """,
                timeout=10000,
            )
        except Exception:
            # Continue if Arabic content check times out
            pass
