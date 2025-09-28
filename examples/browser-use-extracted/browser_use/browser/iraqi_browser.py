"""
Iraqi-Optimized Browser Engine
Specialized browser for Iraqi government portals and cultural requirements
"""

import asyncio
import logging
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any
from datetime import datetime, time
import pytz
import json
from pathlib import Path

from .browser import Browser, BrowserConfig, BrowserType, BrowserMode

logger = logging.getLogger(__name__)


@dataclass
class IraqiPortalConfig(BrowserConfig):
    """Iraqi portal specific configuration"""

    # Cultural settings
    islamic_compliance: bool = True
    political_neutrality: bool = True
    sectarian_sensitivity: bool = True

    # Language settings
    primary_language: str = "ar-IQ"  # Iraqi Arabic
    fallback_language: str = "ar"  # Standard Arabic
    english_support: bool = True
    kurdish_support: bool = False

    # Government portal settings
    government_working_hours: Dict[str, Any] = field(
        default_factory=lambda: {
            "start_hour": 8,
            "end_hour": 14,
            "working_days": [6, 0, 1, 2, 3],  # Sunday to Thursday
            "friday_hours": {"start": 8, "end": 12},
            "ramadan_hours": {"start": 9, "end": 13},
        }
    )

    # Network optimization for Iraq
    connection_timeout: int = 45000  # 45 seconds for slower connections
    retry_attempts: int = 5
    retry_delay: int = 3000  # 3 seconds
    bandwidth_optimization: bool = True

    # Security settings
    government_ssl_validation: bool = True
    credential_encryption: bool = True
    session_security: bool = True
    audit_logging: bool = True

    # Document processing
    arabic_ocr: bool = True
    document_validation: bool = True
    file_format_support: List[str] = field(
        default_factory=lambda: ["pdf", "doc", "docx", "jpg", "png", "tiff"]
    )


class IraqiBrowser(Browser):
    """
    Iraqi-optimized browser with government portal automation capabilities
    """

    def __init__(self, config: IraqiPortalConfig = None):
        config = config or IraqiPortalConfig()
        super().__init__(config)

        self.iraqi_config = config
        self.government_portals = self._load_iraqi_government_portals()
        self.cultural_validators = self._load_cultural_validators()
        self.arabic_processors = self._load_arabic_processors()
        self.portal_workflows = self._load_portal_workflows()

        # Session management
        self.current_portal = None
        self.session_data = {}
        self.cultural_context = {}

    async def start(self) -> None:
        """Start browser with Iraqi optimizations"""
        await super().start()

        # Setup Iraqi-specific configurations
        await self._setup_iraqi_optimizations()
        await self._setup_cultural_validation()
        await self._setup_government_portal_detection()

        logger.info("Iraqi browser started with cultural optimizations")

    async def _setup_iraqi_optimizations(self) -> None:
        """Setup Iraqi-specific browser optimizations"""

        # Add Iraqi timezone and locale
        await self.context.add_init_script("""
        // Set Iraqi timezone and locale
        Object.defineProperty(Intl, 'DateTimeFormat', {
            value: function(...args) {
                if (!args[0]) args[0] = 'ar-IQ';
                return new OriginalDateTimeFormat(...args);
            }
        });
        
        // Add Iraqi number formatting
        window.iraqiNumberFormat = {
            formatCurrency: function(amount) {
                return new Intl.NumberFormat('ar-IQ', {
                    style: 'currency',
                    currency: 'IQD'
                }).format(amount);
            },
            formatNumber: function(number) {
                return new Intl.NumberFormat('ar-IQ').format(number);
            }
        };
        """)

        # Add Arabic text processing
        if self.iraqi_config.arabic_support:
            await self._setup_advanced_arabic_support()

    async def _setup_advanced_arabic_support(self) -> None:
        """Setup advanced Arabic text processing"""

        arabic_support_script = """
        window.arabicProcessor = {
            // Normalize Arabic text
            normalize: function(text) {
                return text
                    .replace(/ي/g, 'ی')  // Normalize yeh
                    .replace(/ك/g, 'ک')  // Normalize kaf
                    .replace(/ء/g, 'ٔ'); // Normalize hamza
            },
            
            // Detect text direction
            getDirection: function(text) {
                const arabicPattern = /[\u0600-\u06ff]/;
                return arabicPattern.test(text) ? 'rtl' : 'ltr';
            },
            
            // Format Iraqi names
            formatIraqiName: function(name) {
                // Handle Iraqi naming conventions
                return name.trim().replace(/\s+/g, ' ');
            },
            
            // Validate Iraqi ID format
            validateIraqiID: function(id) {
                // Iraqi national ID validation pattern
                const pattern = /^[0-9]{12}$/;
                return pattern.test(id.replace(/\s/g, ''));
            }
        };
        
        // Auto-detect and set direction for input fields
        document.addEventListener('input', function(e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                const direction = window.arabicProcessor.getDirection(e.target.value);
                e.target.style.direction = direction;
                e.target.style.textAlign = direction === 'rtl' ? 'right' : 'left';
            }
        });
        """

        await self.context.add_init_script(arabic_support_script)

    async def _setup_cultural_validation(self) -> None:
        """Setup cultural validation system"""

        cultural_script = """
        window.culturalValidator = {
            // Check Islamic compliance
            checkIslamicCompliance: function(content) {
                const prohibitedContent = [
                    'alcohol', 'gambling', 'interest', 'haram'
                ];
                // Add Arabic equivalents
                const arabicProhibited = [
                    'خمر', 'قمار', 'ربا', 'حرام'
                ];
                
                const allProhibited = [...prohibitedContent, ...arabicProhibited];
                return !allProhibited.some(term => 
                    content.toLowerCase().includes(term)
                );
            },
            
            // Check political neutrality
            checkPoliticalNeutrality: function(content) {
                const sensitiveTerms = [
                    'sectarian', 'sunni', 'shia', 'kurdish independence'
                ];
                const arabicSensitive = [
                    'طائفي', 'سني', 'شيعي', 'استقلال كردي'
                ];
                
                const allSensitive = [...sensitiveTerms, ...arabicSensitive];
                return !allSensitive.some(term => 
                    content.toLowerCase().includes(term)
                );
            },
            
            // Validate content appropriateness
            validateContent: function(content) {
                return this.checkIslamicCompliance(content) && 
                       this.checkPoliticalNeutrality(content);
            }
        };
        """

        await self.context.add_init_script(cultural_script)

    async def _setup_government_portal_detection(self) -> None:
        """Setup government portal detection and optimization"""

        portal_script = """
        window.iraqiPortalDetector = {
            governmentDomains: [
                '.gov.iq', '.edu.iq', '.org.iq',
                'passport', 'ministry', 'university',
                'وزارة', 'جامعة', 'حكومة'
            ],
            
            isGovernmentPortal: function() {
                const hostname = window.location.hostname.toLowerCase();
                const title = document.title.toLowerCase();
                
                return this.governmentDomains.some(domain => 
                    hostname.includes(domain) || title.includes(domain)
                );
            },
            
            getPortalType: function() {
                const hostname = window.location.hostname;
                if (hostname.includes('passport')) return 'passport';
                if (hostname.includes('university') || hostname.includes('جامعة')) return 'education';
                if (hostname.includes('ministry') || hostname.includes('وزارة')) return 'ministry';
                if (hostname.includes('court') || hostname.includes('محكمة')) return 'judicial';
                return 'general';
            },
            
            optimizeForPortal: function() {
                if (this.isGovernmentPortal()) {
                    // Add loading indicator for slow government portals
                    const style = document.createElement('style');
                    style.textContent = `
                        .iraqi-loading {
                            position: fixed;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            background: rgba(0, 100, 0, 0.9);
                            color: white;
                            padding: 20px;
                            border-radius: 10px;
                            z-index: 10000;
                            font-family: 'Noto Sans Arabic', Arial;
                            direction: rtl;
                        }
                    `;
                    document.head.appendChild(style);
                }
            }
        };
        
        // Auto-optimize when page loads
        document.addEventListener('DOMContentLoaded', function() {
            window.iraqiPortalDetector.optimizeForPortal();
        });
        """

        await self.context.add_init_script(portal_script)

    async def navigate_to_government_portal(
        self, portal_name: str, service: str = None
    ) -> None:
        """Navigate to specific Iraqi government portal"""

        portal_url = self._get_government_portal_url(portal_name)
        if not portal_url:
            raise ValueError(f"Unknown government portal: {portal_name}")

        # Check working hours
        if not self._is_portal_available(portal_name):
            logger.warning(
                f"Portal {portal_name} may not be available outside working hours"
            )

        # Navigate with optimizations
        await self.navigate(portal_url)

        # Wait for portal-specific elements
        await self._wait_for_portal_load(portal_name)

        # Set current portal context
        self.current_portal = portal_name
        self.session_data["portal"] = portal_name
        self.session_data["service"] = service

        logger.info(f"Successfully navigated to {portal_name} portal")

    async def fill_iraqi_government_form(
        self, form_data: Dict[str, str], form_type: str = "general"
    ) -> None:
        """Fill Iraqi government form with validation"""

        # Validate cultural appropriateness
        if self.iraqi_config.islamic_compliance:
            for field, value in form_data.items():
                if not await self._validate_cultural_content(value):
                    raise ValueError(
                        f"Content in field '{field}' may not be culturally appropriate"
                    )

        # Process Iraqi-specific data formats
        processed_data = self._process_iraqi_form_data(form_data, form_type)

        # Fill form with retry logic for slow portals
        for attempt in range(self.iraqi_config.retry_attempts):
            try:
                await self.fill_form(processed_data)
                break
            except Exception as e:
                if attempt == self.iraqi_config.retry_attempts - 1:
                    raise
                logger.warning(f"Form filling attempt {attempt + 1} failed: {e}")
                await asyncio.sleep(self.iraqi_config.retry_delay / 1000)

    async def download_iraqi_document(
        self, document_type: str, save_path: str = None
    ) -> str:
        """Download Iraqi government document with validation"""

        # Wait for download with extended timeout for government portals
        file_path = await self.wait_for_download()

        # Validate document if required
        if self.iraqi_config.document_validation:
            await self._validate_iraqi_document(file_path, document_type)

        # Process Arabic content if needed
        if self.iraqi_config.arabic_ocr and self._is_image_document(file_path):
            await self._extract_arabic_text(file_path)

        return file_path

    async def handle_iraqi_captcha(self, captcha_selector: str = ".captcha") -> bool:
        """Handle Iraqi portal CAPTCHA with Arabic support"""

        try:
            # Check if CAPTCHA is present
            captcha_element = await self.page.query_selector(captcha_selector)
            if not captcha_element:
                return True  # No CAPTCHA present

            # Take screenshot of CAPTCHA
            captcha_screenshot = await captcha_element.screenshot()

            # Process Arabic CAPTCHA if configured
            if self.iraqi_config.arabic_ocr:
                captcha_text = await self._process_arabic_captcha(captcha_screenshot)

                # Find input field and enter text
                captcha_input = await self.page.query_selector(
                    "input[name*='captcha'], input[id*='captcha']"
                )
                if captcha_input and captcha_text:
                    await captcha_input.fill(captcha_text)
                    return True

            # If automatic processing fails, log for manual intervention
            logger.warning("CAPTCHA detected but could not be processed automatically")
            return False

        except Exception as e:
            logger.error(f"CAPTCHA handling failed: {e}")
            return False

    async def check_portal_status(self, portal_name: str) -> Dict[str, Any]:
        """Check status of Iraqi government portal"""

        status = {
            "portal": portal_name,
            "available": False,
            "working_hours": False,
            "response_time": None,
            "arabic_support": False,
            "ssl_valid": False,
        }

        try:
            portal_url = self._get_government_portal_url(portal_name)
            if not portal_url:
                return status

            # Check basic availability
            start_time = datetime.now()
            response = await self.page.goto(portal_url, timeout=30000)
            end_time = datetime.now()

            status["available"] = response.ok
            status["response_time"] = (end_time - start_time).total_seconds()
            status["ssl_valid"] = portal_url.startswith("https://")

            # Check working hours
            status["working_hours"] = self._is_portal_available(portal_name)

            # Check Arabic support
            content = await self.page.content()
            status["arabic_support"] = self._contains_arabic(content)

        except Exception as e:
            logger.error(f"Portal status check failed: {e}")

        return status

    # Helper methods for Iraqi portal operations

    def _load_iraqi_government_portals(self) -> Dict[str, str]:
        """Load Iraqi government portal URLs"""
        return {
            "passport": "https://passport.gov.iq",
            "ministry_interior": "https://moi.gov.iq",
            "ministry_education": "https://mohe.gov.iq",
            "ministry_finance": "https://mof.gov.iq",
            "ministry_labor": "https://mol.gov.iq",
            "university_baghdad": "https://uobaghdad.edu.iq",
            "university_basra": "https://uobasra.edu.iq",
            "university_mosul": "https://uomosul.edu.iq",
            "baghdad_municipality": "https://amanat-baghdad.gov.iq",
            "basra_municipality": "https://basra.gov.iq",
            "erbil_municipality": "https://erbil.gov.iq",
        }

    def _load_cultural_validators(self) -> Dict[str, Any]:
        """Load cultural validation rules"""
        return {
            "islamic_compliance": True,
            "political_neutrality": True,
            "sectarian_sensitivity": True,
            "prohibited_content": [
                "alcohol",
                "gambling",
                "interest",
                "haram",
                "خمر",
                "قمار",
                "ربا",
                "حرام",
            ],
            "sensitive_topics": [
                "sectarian",
                "political_parties",
                "tribal_disputes",
                "طائفي",
                "أحزاب_سياسية",
                "نزاعات_عشائرية",
            ],
        }

    def _load_arabic_processors(self) -> Dict[str, Any]:
        """Load Arabic text processing configurations"""
        return {
            "normalization": True,
            "diacritic_removal": True,
            "character_mapping": {
                "ي": "ی",  # Yeh variants
                "ك": "ک",  # Kaf variants
                "ء": "ٔ",  # Hamza variants
            },
            "iraqi_dialect_support": True,
            "formal_arabic_fallback": True,
        }

    def _load_portal_workflows(self) -> Dict[str, Any]:
        """Load portal-specific workflows"""
        return {
            "passport": {
                "renewal_steps": [
                    "login",
                    "application",
                    "documents",
                    "payment",
                    "confirmation",
                ],
                "required_documents": ["current_passport", "photo", "civil_id"],
                "processing_time": "5-10 days",
            },
            "university": {
                "application_steps": [
                    "registration",
                    "documents",
                    "exam_results",
                    "payment",
                ],
                "required_documents": ["high_school_certificate", "photo", "civil_id"],
                "processing_time": "2-4 weeks",
            },
            "ministry": {
                "service_request_steps": [
                    "authentication",
                    "form",
                    "documents",
                    "review",
                ],
                "common_services": ["certificates", "permits", "licenses"],
                "processing_time": "3-7 days",
            },
        }

    def _get_government_portal_url(self, portal_name: str) -> Optional[str]:
        """Get URL for government portal"""
        return self.government_portals.get(portal_name)

    def _is_portal_available(self, portal_name: str) -> bool:
        """Check if portal is available based on working hours"""
        baghdad_tz = pytz.timezone("Asia/Baghdad")
        now = datetime.now(baghdad_tz)

        working_hours = self.iraqi_config.government_working_hours

        # Check if it's a working day
        if now.weekday() not in working_hours["working_days"]:
            # Check Friday hours
            if now.weekday() == 4:  # Friday
                friday_hours = working_hours.get("friday_hours", {})
                return (
                    friday_hours.get("start", 8)
                    <= now.hour
                    <= friday_hours.get("end", 12)
                )
            return False

        # Check working hours
        return working_hours["start_hour"] <= now.hour <= working_hours["end_hour"]

    def _process_iraqi_form_data(
        self, form_data: Dict[str, str], form_type: str
    ) -> Dict[str, str]:
        """Process form data for Iraqi standards"""
        processed_data = {}

        for field, value in form_data.items():
            if field == "national_id":
                # Iraqi national ID format: 12 digits
                processed_data[field] = value.replace("-", "").replace(" ", "")
            elif field == "phone_number":
                # Iraqi phone format: +964XXXXXXXXX
                if not value.startswith("+964"):
                    processed_data[field] = f"+964{value.lstrip('0')}"
                else:
                    processed_data[field] = value
            elif field == "postal_code":
                # Iraqi postal codes are 5 digits
                processed_data[field] = value.zfill(5)
            else:
                processed_data[field] = value

        return processed_data

    async def _validate_cultural_content(self, content: str) -> bool:
        """Validate content for cultural appropriateness"""
        # Check using browser-side validation
        result = await self.page.evaluate(f"""
            window.culturalValidator && 
            window.culturalValidator.validateContent('{content}')
        """)
        return result if result is not None else True

    async def _wait_for_portal_load(self, portal_name: str) -> None:
        """Wait for portal-specific elements to load"""
        portal_selectors = {
            "passport": ".passport-portal, #passport-main",
            "university": ".university-portal, #edu-main",
            "ministry": ".ministry-portal, #gov-main",
        }

        selector = portal_selectors.get(portal_name, "body")

        try:
            await self.page.wait_for_selector(selector, timeout=30000)
        except Exception:
            # Continue if specific selector not found
            await self.page.wait_for_load_state("networkidle")

    async def _validate_iraqi_document(
        self, file_path: str, document_type: str
    ) -> bool:
        """Validate downloaded Iraqi document"""
        # Basic file validation
        file_path_obj = Path(file_path)
        if not file_path_obj.exists():
            return False

        # Check file size (empty files indicate download failure)
        if file_path_obj.stat().st_size == 0:
            return False

        # Document type specific validation
        if document_type == "passport":
            # Check for passport document indicators
            pass
        elif document_type == "certificate":
            # Check for certificate indicators
            pass

        return True

    def _is_image_document(self, file_path: str) -> bool:
        """Check if document is an image file"""
        image_extensions = [".jpg", ".jpeg", ".png", ".tiff", ".bmp"]
        return any(file_path.lower().endswith(ext) for ext in image_extensions)

    async def _extract_arabic_text(self, file_path: str) -> str:
        """Extract Arabic text from image document using OCR"""
        # Placeholder for OCR implementation
        # Would integrate with Arabic OCR service
        logger.info(f"Arabic OCR extraction needed for: {file_path}")
        return ""

    async def _process_arabic_captcha(self, captcha_image: bytes) -> Optional[str]:
        """Process Arabic CAPTCHA image"""
        # Placeholder for Arabic CAPTCHA processing
        # Would integrate with Arabic OCR service
        logger.info("Arabic CAPTCHA processing needed")
        return None
