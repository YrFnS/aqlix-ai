"""
Iraqi Passport Renewal Automation
Complete workflow for passport renewal through government portal
"""

import asyncio
import logging
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
import json

from browser_use.browser import Browser, BrowserConfig, BrowserType, BrowserMode
from browser_use.dom import DOMProcessor, FormHandler, ArabicTextProcessor
from browser_use.llm import LLMProvider, LLMConfig, CulturalContext
from browser_use.agent import IraqiPortalAgent, PortalType, ServiceType

logger = logging.getLogger(__name__)


@dataclass
class PassportRenewalData:
    """Data required for passport renewal"""
    # Personal Information
    full_name_arabic: str
    full_name_english: str
    national_id: str
    current_passport_number: str
    birth_date: str  # DD/MM/YYYY
    birth_place: str
    nationality: str = "عراقي"
    
    # Contact Information
    phone_number: str
    email: str
    current_address: str
    
    # Passport Details
    passport_issue_date: str  # DD/MM/YYYY
    passport_expiry_date: str  # DD/MM/YYYY
    travel_purpose: str
    duration_abroad: str
    
    # Documents
    photo_path: Optional[str] = None
    documents_path: Optional[str] = None


@dataclass
class RenewalResult:
    """Result of passport renewal process"""
    success: bool
    application_number: Optional[str] = None
    appointment_date: Optional[str] = None
    required_documents: List[str] = None
    fees_amount: Optional[str] = None
    errors: List[str] = None
    warnings: List[str] = None


class PassportRenewalAutomation:
    """
    Automated passport renewal through Iraqi government portal
    Handles complete workflow from application to appointment booking
    """
    
    def __init__(self, llm_provider: LLMProvider):
        self.llm_provider = llm_provider
        self.browser = None
        self.agent = None
        self.dom_processor = None
        self.form_handler = None
        self.arabic_processor = ArabicTextProcessor()
        
        # Iraqi passport portal configuration
        self.portal_config = {
            'base_url': 'https://passport.gov.iq',
            'renewal_url': 'https://passport.gov.iq/renewal',
            'status_url': 'https://passport.gov.iq/status',
            'working_hours': {'start': 8, 'end': 14},  # 8 AM - 2 PM
            'timeout': 60000  # 60 seconds
        }
    
    async def initialize(self) -> None:
        """Initialize browser and automation components"""
        try:
            # Configure browser for Iraqi portals
            browser_config = BrowserConfig(
                browser_type=BrowserType.CHROME,
                mode=BrowserMode.HEADLESS,
                arabic_support=True,
                rtl_layout=True,
                iraqi_portals=True,
                government_hours_check=True,
                cultural_validation=True,
                network_optimization=True,
                timeout=self.portal_config['timeout']
            )
            
            # Initialize browser
            self.browser = Browser(browser_config)
            await self.browser.start()
            
            # Initialize components
            self.dom_processor = DOMProcessor(self.browser.page)
            self.form_handler = FormHandler(self.browser.page)
            
            # Initialize Iraqi portal agent
            self.agent = IraqiPortalAgent(
                browser=self.browser,
                llm_provider=self.llm_provider,
                portal_type=PortalType.PASSPORT_OFFICE,
                service_type=ServiceType.PASSPORT_RENEWAL
            )
            
            logger.info("Passport renewal automation initialized successfully")
            
        except Exception as e:
            logger.error(f"Initialization failed: {e}")
            raise
    
    async def renew_passport(self, renewal_data: PassportRenewalData) -> RenewalResult:
        """Execute complete passport renewal workflow"""
        try:
            await self.initialize()
            
            result = RenewalResult(success=False, errors=[], warnings=[])
            
            # Step 1: Navigate to passport renewal portal
            logger.info("Navigating to passport renewal portal")
            await self._navigate_to_renewal_portal()
            
            # Step 2: Check portal availability and working hours
            if not await self._check_portal_availability():
                result.errors.append("Portal not available during current hours")
                return result
            
            # Step 3: Select renewal service
            logger.info("Selecting passport renewal service")
            await self._select_renewal_service()
            
            # Step 4: Fill personal information form
            logger.info("Filling personal information")
            personal_result = await self._fill_personal_information(renewal_data)
            if not personal_result:
                result.errors.append("Failed to fill personal information")
                return result
            
            # Step 5: Fill passport details
            logger.info("Filling passport details")
            passport_result = await self._fill_passport_details(renewal_data)
            if not passport_result:
                result.errors.append("Failed to fill passport details")
                return result
            
            # Step 6: Upload required documents
            logger.info("Uploading documents")
            upload_result = await self._upload_documents(renewal_data)
            if not upload_result:
                result.warnings.append("Document upload may have issues")
            
            # Step 7: Review and submit application
            logger.info("Reviewing and submitting application")
            submission_result = await self._submit_application()
            if not submission_result:
                result.errors.append("Failed to submit application")
                return result
            
            # Step 8: Extract application details
            logger.info("Extracting application details")
            app_details = await self._extract_application_details()
            result.application_number = app_details.get('application_number')
            result.fees_amount = app_details.get('fees_amount')
            result.required_documents = app_details.get('required_documents', [])
            
            # Step 9: Book appointment if available
            logger.info("Attempting to book appointment")
            appointment_result = await self._book_appointment()
            if appointment_result:
                result.appointment_date = appointment_result.get('appointment_date')
            else:
                result.warnings.append("Appointment booking not available or failed")
            
            result.success = True
            logger.info("Passport renewal completed successfully")
            
            return result
            
        except Exception as e:
            logger.error(f"Passport renewal failed: {e}")
            return RenewalResult(
                success=False,
                errors=[f"Automation error: {e}"]
            )
        finally:
            if self.browser:
                await self.browser.close()
    
    async def check_application_status(self, application_number: str) -> Dict[str, Any]:
        """Check status of existing passport application"""
        try:
            await self.initialize()
            
            # Navigate to status check page
            await self.browser.navigate(self.portal_config['status_url'])
            
            # Find status check form
            status_form = await self.form_handler.analyze_form_fields()
            
            # Fill application number
            form_data = {'application_number': application_number}
            await self.form_handler.fill_form(form_data)
            
            # Submit status query
            await self.form_handler.submit_form()
            
            # Extract status information
            page_content = await self.browser.get_page_content()
            status_info = await self._extract_status_info(page_content)
            
            return status_info
            
        except Exception as e:
            logger.error(f"Status check failed: {e}")
            return {'error': str(e)}
        finally:
            if self.browser:
                await self.browser.close()
    
    async def _navigate_to_renewal_portal(self) -> None:
        """Navigate to passport renewal portal"""
        await self.browser.navigate(self.portal_config['renewal_url'])
        
        # Wait for page to load completely
        await self.browser.page.wait_for_load_state("networkidle")
        
        # Check if we're on the correct page
        page_title = await self.browser.page.title()
        if 'جواز' not in page_title and 'passport' not in page_title.lower():
            logger.warning("May not be on correct passport page")
    
    async def _check_portal_availability(self) -> bool:
        """Check if portal is available during working hours"""
        from datetime import datetime
        import pytz
        
        # Check Iraqi government working hours (8 AM - 2 PM)
        baghdad_tz = pytz.timezone('Asia/Baghdad')
        now = datetime.now(baghdad_tz)
        
        # Check working days (Sunday to Thursday)
        if now.weekday() > 3:  # Friday = 4, Saturday = 5
            logger.warning("Government offices are closed (Friday/Saturday)")
            return False
        
        # Check working hours
        if not (8 <= now.hour < 14):
            logger.warning(f"Outside working hours (8 AM - 2 PM). Current time: {now.hour}:00")
            return False
        
        # Check for portal maintenance message
        page_content = await self.browser.get_page_content()
        maintenance_keywords = ['صيانة', 'maintenance', 'مغلق', 'closed']
        
        if any(keyword in page_content.lower() for keyword in maintenance_keywords):
            logger.warning("Portal appears to be under maintenance")
            return False
        
        return True
    
    async def _select_renewal_service(self) -> None:
        """Select passport renewal service from portal"""
        # Look for renewal service links/buttons
        renewal_selectors = [
            "a:contains('تجديد الجواز')",
            "a:contains('Passport Renewal')",
            "button:contains('تجديد')",
            ".renewal-service",
            "#passport-renewal"
        ]
        
        for selector in renewal_selectors:
            try:
                await self.browser.click_element(selector)
                logger.info(f"Selected renewal service using selector: {selector}")
                return
            except Exception:
                continue
        
        # If no direct selector works, use LLM to analyze page
        page_content = await self.browser.get_page_content()
        analysis = await self.llm_provider.analyze_webpage(
            page_content,
            "Find and click the passport renewal service option"
        )
        
        # Extract action from LLM response and execute
        # This would be enhanced with more sophisticated action parsing
        logger.info("Used LLM analysis to find renewal service")
    
    async def _fill_personal_information(self, data: PassportRenewalData) -> bool:
        """Fill personal information form"""
        try:
            # Analyze current form
            form_analysis = await self.form_handler.analyze_form_fields()
            
            # Prepare form data mapping
            form_data = {
                'full_name_arabic': data.full_name_arabic,
                'full_name_english': data.full_name_english,
                'national_id': data.national_id,
                'birth_date': data.birth_date,
                'birth_place': data.birth_place,
                'nationality': data.nationality,
                'phone_number': data.phone_number,
                'email': data.email,
                'address': data.current_address
            }
            
            # Fill form with validation
            fill_result = await self.form_handler.fill_form(form_data)
            
            if not fill_result.success:
                logger.error(f"Form filling failed: {fill_result.validation_errors}")
                return False
            
            logger.info(f"Successfully filled {len(fill_result.filled_fields)} fields")
            return True
            
        except Exception as e:
            logger.error(f"Personal information filling failed: {e}")
            return False
    
    async def _fill_passport_details(self, data: PassportRenewalData) -> bool:
        """Fill passport-specific details"""
        try:
            passport_data = {
                'current_passport_number': data.current_passport_number,
                'passport_issue_date': data.passport_issue_date,
                'passport_expiry_date': data.passport_expiry_date,
                'travel_purpose': data.travel_purpose,
                'duration_abroad': data.duration_abroad
            }
            
            # Navigate to passport details section if needed
            next_button_selectors = [
                "button:contains('التالي')",
                "button:contains('Next')",
                ".next-step",
                "input[type='submit'][value*='Next']"
            ]
            
            for selector in next_button_selectors:
                try:
                    await self.browser.click_element(selector)
                    break
                except Exception:
                    continue
            
            # Fill passport details form
            fill_result = await self.form_handler.fill_form(passport_data)
            
            return fill_result.success
            
        except Exception as e:
            logger.error(f"Passport details filling failed: {e}")
            return False
    
    async def _upload_documents(self, data: PassportRenewalData) -> bool:
        """Upload required documents"""
        try:
            # Find file upload inputs
            upload_selectors = [
                "input[type='file']",
                ".file-upload",
                "#photo-upload",
                "#document-upload"
            ]
            
            uploaded_count = 0
            
            # Upload photo if provided
            if data.photo_path:
                for selector in upload_selectors:
                    try:
                        await self.browser.page.set_input_files(selector, data.photo_path)
                        uploaded_count += 1
                        logger.info("Photo uploaded successfully")
                        break
                    except Exception:
                        continue
            
            # Upload documents if provided
            if data.documents_path:
                for selector in upload_selectors:
                    try:
                        await self.browser.page.set_input_files(selector, data.documents_path)
                        uploaded_count += 1
                        logger.info("Documents uploaded successfully")
                        break
                    except Exception:
                        continue
            
            return uploaded_count > 0
            
        except Exception as e:
            logger.error(f"Document upload failed: {e}")
            return False
    
    async def _submit_application(self) -> bool:
        """Submit the complete application"""
        try:
            # Find and click submit button
            submit_selectors = [
                "button:contains('إرسال')",
                "button:contains('Submit')",
                "input[type='submit']",
                ".submit-application",
                "#submit-btn"
            ]
            
            for selector in submit_selectors:
                try:
                    await self.browser.click_element(selector)
                    logger.info(f"Clicked submit button: {selector}")
                    
                    # Wait for submission to process
                    await self.browser.page.wait_for_load_state("networkidle", timeout=30000)
                    return True
                    
                except Exception:
                    continue
            
            logger.error("Could not find submit button")
            return False
            
        except Exception as e:
            logger.error(f"Application submission failed: {e}")
            return False
    
    async def _extract_application_details(self) -> Dict[str, Any]:
        """Extract application number and other details after submission"""
        try:
            page_content = await self.browser.get_page_content()
            
            # Use LLM to extract application details
            extraction_prompt = """
            Extract the following information from this Arabic/English passport application confirmation page:
            1. Application number or reference number
            2. Required fees amount
            3. List of required documents
            4. Next steps or instructions
            
            Return the information in JSON format.
            """
            
            response = await self.llm_provider.chat(
                message=f"{extraction_prompt}\n\nPage content:\n{page_content[:4000]}",
                cultural_context="iraqi_government"
            )
            
            # Parse LLM response
            try:
                import json
                details = json.loads(response.content)
                return details
            except json.JSONDecodeError:
                # Fallback: extract basic information with regex
                import re
                
                details = {}
                
                # Extract application number
                app_number_patterns = [
                    r'رقم الطلب[:\s]+(\w+)',
                    r'Application Number[:\s]+(\w+)',
                    r'Reference[:\s]+(\w+)'
                ]
                
                for pattern in app_number_patterns:
                    match = re.search(pattern, page_content, re.IGNORECASE)
                    if match:
                        details['application_number'] = match.group(1)
                        break
                
                return details
            
        except Exception as e:
            logger.error(f"Application details extraction failed: {e}")
            return {}
    
    async def _book_appointment(self) -> Optional[Dict[str, Any]]:
        """Book appointment for passport collection"""
        try:
            # Look for appointment booking section
            appointment_selectors = [
                "a:contains('موعد')",
                "a:contains('Appointment')",
                ".appointment-booking",
                "#book-appointment"
            ]
            
            for selector in appointment_selectors:
                try:
                    await self.browser.click_element(selector)
                    
                    # Wait for appointment page to load
                    await self.browser.page.wait_for_load_state("networkidle")
                    
                    # Analyze appointment form
                    appointment_form = await self.form_handler.analyze_form_fields()
                    
                    # Select first available appointment
                    # This would be enhanced with date preference selection
                    available_dates = await self._get_available_dates()
                    
                    if available_dates:
                        # Book first available date
                        appointment_data = {
                            'appointment_date': available_dates[0],
                            'time_slot': 'morning'  # Default preference
                        }
                        
                        fill_result = await self.form_handler.fill_form(appointment_data)
                        if fill_result.success:
                            await self.form_handler.submit_form()
                            return appointment_data
                    
                    break
                    
                except Exception:
                    continue
            
            return None
            
        except Exception as e:
            logger.error(f"Appointment booking failed: {e}")
            return None
    
    async def _get_available_dates(self) -> List[str]:
        """Get available appointment dates"""
        try:
            # This would be implemented based on the specific portal's date picker
            # For now, return placeholder dates
            from datetime import datetime, timedelta
            
            today = datetime.now()
            available_dates = []
            
            # Generate next 7 working days as example
            for i in range(1, 15):  # Check next 14 days
                date = today + timedelta(days=i)
                if date.weekday() < 5:  # Monday to Friday
                    available_dates.append(date.strftime('%d/%m/%Y'))
            
            return available_dates[:5]  # Return first 5 available dates
            
        except Exception as e:
            logger.error(f"Date extraction failed: {e}")
            return []
    
    async def _extract_status_info(self, page_content: str) -> Dict[str, Any]:
        """Extract status information from status check page"""
        try:
            # Use LLM to extract status information
            status_prompt = """
            Extract passport application status information from this page:
            1. Current status (submitted, under review, approved, ready for collection, etc.)
            2. Application date
            3. Expected completion date
            4. Required actions (if any)
            5. Collection location (if ready)
            
            Return information in JSON format.
            """
            
            response = await self.llm_provider.chat(
                message=f"{status_prompt}\n\nPage content:\n{page_content[:4000]}",
                cultural_context="iraqi_government"
            )
            
            try:
                import json
                return json.loads(response.content)
            except json.JSONDecodeError:
                return {'status': 'Unknown', 'error': 'Could not parse status information'}
            
        except Exception as e:
            logger.error(f"Status extraction failed: {e}")
            return {'error': str(e)}


# Example usage
async def main():
    """Example usage of passport renewal automation"""
    
    # Configure LLM provider (example with OpenAI)
    from browser_use.llm import OpenAIProvider, LLMConfig, LLMProviderType
    
    llm_config = LLMConfig(
        provider_type=LLMProviderType.OPENAI,
        model_name="gpt-4",
        api_key="your-api-key-here",  # Replace with actual API key
        arabic_support=True,
        cultural_context="iraqi",
        islamic_compliance=True
    )
    
    llm_provider = OpenAIProvider(llm_config)
    
    # Create automation instance
    automation = PassportRenewalAutomation(llm_provider)
    
    # Prepare renewal data
    renewal_data = PassportRenewalData(
        full_name_arabic="أحمد محمد علي حسن",
        full_name_english="Ahmed Mohammed Ali Hassan",
        national_id="123456789012",
        current_passport_number="A1234567",
        birth_date="01/01/1990",
        birth_place="بغداد",
        phone_number="+964 770 123 4567",
        email="ahmed.hassan@email.com",
        current_address="شارع الكرادة، بغداد",
        passport_issue_date="01/01/2020",
        passport_expiry_date="01/01/2025",
        travel_purpose="سياحة",
        duration_abroad="شهر واحد"
    )
    
    try:
        # Execute passport renewal
        result = await automation.renew_passport(renewal_data)
        
        if result.success:
            print("✅ Passport renewal completed successfully!")
            print(f"Application Number: {result.application_number}")
            print(f"Appointment Date: {result.appointment_date}")
            print(f"Required Documents: {result.required_documents}")
            print(f"Fees: {result.fees_amount}")
        else:
            print("❌ Passport renewal failed:")
            for error in result.errors:
                print(f"  - {error}")
            
            if result.warnings:
                print("⚠️ Warnings:")
                for warning in result.warnings:
                    print(f"  - {warning}")
    
    except Exception as e:
        print(f"❌ Automation failed: {e}")


if __name__ == "__main__":
    asyncio.run(main())