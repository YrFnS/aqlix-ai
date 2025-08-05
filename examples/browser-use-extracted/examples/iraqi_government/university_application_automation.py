"""
Iraqi University Application Automation
Complete workflow for university applications through education portals
"""

import asyncio
import logging
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
import json
from datetime import datetime

from browser_use.browser import Browser, BrowserConfig, BrowserType, BrowserMode
from browser_use.dom import DOMProcessor, FormHandler, ArabicTextProcessor
from browser_use.llm import LLMProvider, CulturalContext
from browser_use.agent import IraqiPortalAgent, PortalType, ServiceType

logger = logging.getLogger(__name__)


@dataclass
class StudentData:
    """Student information for university application"""
    # Personal Information
    full_name_arabic: str
    full_name_english: str
    father_name: str
    grandfather_name: str
    family_name: str
    national_id: str
    birth_date: str  # DD/MM/YYYY
    birth_place: str
    nationality: str = "عراقي"
    religion: str
    gender: str  # "ذكر" or "أنثى"
    
    # Contact Information
    phone_number: str
    email: str
    current_address: str
    permanent_address: str
    
    # Academic Information
    high_school_name: str
    graduation_year: str
    high_school_average: float
    high_school_certificate_number: str
    
    # Application Preferences
    preferred_university: str
    preferred_college: str
    preferred_department: str
    alternative_choices: List[str]
    
    # Documents
    photo_path: Optional[str] = None
    certificate_path: Optional[str] = None
    id_copy_path: Optional[str] = None


@dataclass
class ApplicationResult:
    """Result of university application process"""
    success: bool
    application_number: Optional[str] = None
    confirmation_code: Optional[str] = None
    application_date: Optional[str] = None
    required_documents: List[str] = None
    next_steps: List[str] = None
    errors: List[str] = None
    warnings: List[str] = None


class UniversityApplicationAutomation:
    """
    Automated university application through Iraqi education portals
    Supports multiple universities and application types
    """
    
    def __init__(self, llm_provider: LLMProvider):
        self.llm_provider = llm_provider
        self.browser = None
        self.agent = None
        self.dom_processor = None
        self.form_handler = None
        self.arabic_processor = ArabicTextProcessor()
        
        # Iraqi education portal configuration
        self.portal_configs = {
            'general': {
                'base_url': 'https://mohe.gov.iq',
                'application_url': 'https://mohe.gov.iq/application',
                'status_url': 'https://mohe.gov.iq/status'
            },
            'baghdad_university': {
                'base_url': 'https://uobaghdad.edu.iq',
                'application_url': 'https://uobaghdad.edu.iq/apply',
                'status_url': 'https://uobaghdad.edu.iq/status'
            },
            'mustansiriyah': {
                'base_url': 'https://uomustansiriyah.edu.iq',
                'application_url': 'https://uomustansiriyah.edu.iq/apply'
            }
        }
        
        self.current_portal = 'general'
    
    async def initialize(self, portal_type: str = 'general') -> None:
        """Initialize browser and automation components"""
        try:
            self.current_portal = portal_type
            
            # Configure browser for Iraqi education portals
            browser_config = BrowserConfig(
                browser_type=BrowserType.CHROME,
                mode=BrowserMode.HEADLESS,
                arabic_support=True,
                rtl_layout=True,
                iraqi_portals=True,
                government_hours_check=True,
                cultural_validation=True,
                network_optimization=True,
                timeout=90000  # 90 seconds for slower university portals
            )
            
            # Initialize browser
            self.browser = Browser(browser_config)
            await self.browser.start()
            
            # Initialize components
            self.dom_processor = DOMProcessor(self.browser.page)
            self.form_handler = FormHandler(self.browser.page)
            
            # Initialize education portal agent
            self.agent = IraqiPortalAgent(
                browser=self.browser,
                llm_provider=self.llm_provider,
                portal_type=PortalType.EDUCATION,
                service_type=ServiceType.UNIVERSITY_APPLICATION
            )
            
            logger.info(f"University application automation initialized for {portal_type}")
            
        except Exception as e:
            logger.error(f"Initialization failed: {e}")
            raise
    
    async def submit_application(self, student_data: StudentData, 
                               portal_type: str = 'general') -> ApplicationResult:
        """Submit complete university application"""
        try:
            await self.initialize(portal_type)
            
            result = ApplicationResult(success=False, errors=[], warnings=[])
            
            # Step 1: Navigate to application portal
            logger.info("Navigating to university application portal")
            await self._navigate_to_application_portal()
            
            # Step 2: Check application period and eligibility
            if not await self._check_application_availability():
                result.errors.append("Application period not active or portal unavailable")
                return result
            
            # Step 3: Start new application
            logger.info("Starting new application")
            await self._start_new_application()
            
            # Step 4: Fill personal information
            logger.info("Filling personal information")
            personal_result = await self._fill_personal_information(student_data)
            if not personal_result:
                result.errors.append("Failed to fill personal information")
                return result
            
            # Step 5: Fill academic information
            logger.info("Filling academic information")
            academic_result = await self._fill_academic_information(student_data)
            if not academic_result:
                result.errors.append("Failed to fill academic information")
                return result
            
            # Step 6: Select university and department preferences
            logger.info("Selecting university preferences")
            preferences_result = await self._select_preferences(student_data)
            if not preferences_result:
                result.errors.append("Failed to select preferences")
                return result
            
            # Step 7: Upload required documents
            logger.info("Uploading documents")
            upload_result = await self._upload_documents(student_data)
            if not upload_result:
                result.warnings.append("Document upload may have issues")
            
            # Step 8: Review and confirm application
            logger.info("Reviewing and confirming application")
            confirmation_result = await self._confirm_application()
            if not confirmation_result:
                result.errors.append("Failed to confirm application")
                return result
            
            # Step 9: Submit final application
            logger.info("Submitting final application")
            submission_result = await self._submit_final_application()
            if not submission_result:
                result.errors.append("Failed to submit application")
                return result
            
            # Step 10: Extract application details
            logger.info("Extracting application details")
            app_details = await self._extract_application_details()
            result.application_number = app_details.get('application_number')
            result.confirmation_code = app_details.get('confirmation_code')
            result.application_date = app_details.get('application_date')
            result.required_documents = app_details.get('required_documents', [])
            result.next_steps = app_details.get('next_steps', [])
            
            result.success = True
            logger.info("University application completed successfully")
            
            return result
            
        except Exception as e:
            logger.error(f"University application failed: {e}")
            return ApplicationResult(
                success=False,
                errors=[f"Automation error: {e}"]
            )
        finally:
            if self.browser:
                await self.browser.close()
    
    async def check_application_status(self, application_number: str, 
                                     portal_type: str = 'general') -> Dict[str, Any]:
        """Check status of university application"""
        try:
            await self.initialize(portal_type)
            
            # Navigate to status check page
            status_url = self.portal_configs[portal_type]['status_url']
            await self.browser.navigate(status_url)
            
            # Find and fill status check form
            status_data = {
                'application_number': application_number,
                'student_name': '',  # May be required
                'national_id': ''    # May be required
            }
            
            # Fill status form
            await self.form_handler.fill_form(status_data)
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
    
    async def get_available_departments(self, university: str, 
                                     college: str) -> List[Dict[str, str]]:
        """Get available departments for a university/college"""
        try:
            await self.initialize()
            
            # Navigate to university selection page
            await self._navigate_to_application_portal()
            
            # Select university and college
            await self._select_university_college(university, college)
            
            # Extract available departments
            departments = await self._extract_available_departments()
            
            return departments
            
        except Exception as e:
            logger.error(f"Department extraction failed: {e}")
            return []
        finally:
            if self.browser:
                await self.browser.close()
    
    async def _navigate_to_application_portal(self) -> None:
        """Navigate to university application portal"""
        portal_config = self.portal_configs[self.current_portal]
        await self.browser.navigate(portal_config['application_url'])
        
        # Wait for page to load
        await self.browser.page.wait_for_load_state("networkidle")
        
        # Check if we're on the correct page
        page_title = await self.browser.page.title()
        education_keywords = ['تطبيق', 'جامعة', 'تعليم', 'application', 'university', 'education']
        
        if not any(keyword in page_title.lower() for keyword in education_keywords):
            logger.warning("May not be on correct application page")
    
    async def _check_application_availability(self) -> bool:
        """Check if application period is active"""
        try:
            page_content = await self.browser.get_page_content()
            
            # Check for closed application messages
            closed_keywords = [
                'مغلق', 'انتهت', 'closed', 'ended', 'expired',
                'غير متاح', 'not available', 'صيانة', 'maintenance'
            ]
            
            page_text = page_content.lower()
            if any(keyword in page_text for keyword in closed_keywords):
                logger.warning("Application period appears to be closed")
                return False
            
            # Check for active application indicators
            active_keywords = [
                'متاح', 'available', 'مفتوح', 'open', 'تطبيق', 'apply'
            ]
            
            if any(keyword in page_text for keyword in active_keywords):
                return True
            
            # If unclear, proceed with caution
            logger.warning("Application availability unclear, proceeding")
            return True
            
        except Exception as e:
            logger.error(f"Availability check failed: {e}")
            return True  # Proceed if check fails
    
    async def _start_new_application(self) -> None:
        """Start new application process"""
        # Look for new application buttons
        new_app_selectors = [
            "a:contains('طلب جديد')",
            "a:contains('New Application')",
            "button:contains('بدء التطبيق')",
            "button:contains('Start Application')",
            ".new-application",
            "#start-application"
        ]
        
        for selector in new_app_selectors:
            try:
                await self.browser.click_element(selector)
                logger.info(f"Started new application using: {selector}")
                await self.browser.page.wait_for_load_state("networkidle")
                return
            except Exception:
                continue
        
        logger.warning("Could not find new application button, proceeding")
    
    async def _fill_personal_information(self, data: StudentData) -> bool:
        """Fill personal information form"""
        try:
            personal_data = {
                'full_name_arabic': data.full_name_arabic,
                'full_name_english': data.full_name_english,
                'father_name': data.father_name,
                'grandfather_name': data.grandfather_name,
                'family_name': data.family_name,
                'national_id': data.national_id,
                'birth_date': data.birth_date,
                'birth_place': data.birth_place,
                'nationality': data.nationality,
                'religion': data.religion,
                'gender': data.gender,
                'phone_number': data.phone_number,
                'email': data.email,
                'current_address': data.current_address,
                'permanent_address': data.permanent_address
            }
            
            # Fill personal information form
            fill_result = await self.form_handler.fill_form(personal_data)
            
            if not fill_result.success:
                logger.error(f"Personal info filling failed: {fill_result.validation_errors}")
                return False
            
            # Move to next section
            await self._click_next_button()
            
            logger.info("Personal information filled successfully")
            return True
            
        except Exception as e:
            logger.error(f"Personal information filling failed: {e}")
            return False
    
    async def _fill_academic_information(self, data: StudentData) -> bool:
        """Fill academic information form"""
        try:
            academic_data = {
                'high_school_name': data.high_school_name,
                'graduation_year': data.graduation_year,
                'high_school_average': str(data.high_school_average),
                'certificate_number': data.high_school_certificate_number
            }
            
            # Fill academic form
            fill_result = await self.form_handler.fill_form(academic_data)
            
            if not fill_result.success:
                logger.error(f"Academic info filling failed: {fill_result.validation_errors}")
                return False
            
            # Move to next section
            await self._click_next_button()
            
            logger.info("Academic information filled successfully")
            return True
            
        except Exception as e:
            logger.error(f"Academic information filling failed: {e}")
            return False
    
    async def _select_preferences(self, data: StudentData) -> bool:
        """Select university and department preferences"""
        try:
            # Select preferred university
            await self._select_dropdown_option('university', data.preferred_university)
            
            # Wait for college options to load
            await asyncio.sleep(2)
            
            # Select preferred college
            await self._select_dropdown_option('college', data.preferred_college)
            
            # Wait for department options to load
            await asyncio.sleep(2)
            
            # Select preferred department
            await self._select_dropdown_option('department', data.preferred_department)
            
            # Fill alternative choices if available
            for i, choice in enumerate(data.alternative_choices[:3]):  # Usually 3 alternatives max
                try:
                    await self._select_dropdown_option(f'alternative_{i+1}', choice)
                except Exception:
                    logger.warning(f"Could not select alternative choice {i+1}")
            
            # Move to next section
            await self._click_next_button()
            
            logger.info("Preferences selected successfully")
            return True
            
        except Exception as e:
            logger.error(f"Preferences selection failed: {e}")
            return False
    
    async def _select_dropdown_option(self, field_type: str, option_text: str) -> None:
        """Select option from dropdown"""
        # Common dropdown selectors for different field types
        dropdown_selectors = {
            'university': ['#university', '.university-select', 'select[name*="university"]'],
            'college': ['#college', '.college-select', 'select[name*="college"]'],
            'department': ['#department', '.department-select', 'select[name*="department"]'],
            'alternative_1': ['#alt1', '.alternative-1', 'select[name*="alt1"]'],
            'alternative_2': ['#alt2', '.alternative-2', 'select[name*="alt2"]'],
            'alternative_3': ['#alt3', '.alternative-3', 'select[name*="alt3"]']
        }
        
        selectors = dropdown_selectors.get(field_type, [f'select[name*="{field_type}"]'])
        
        for selector in selectors:
            try:
                await self.browser.page.select_option(selector, label=option_text)
                logger.info(f"Selected {option_text} for {field_type}")
                return
            except Exception:
                continue
        
        logger.warning(f"Could not select {option_text} for {field_type}")
    
    async def _upload_documents(self, data: StudentData) -> bool:
        """Upload required documents"""
        try:
            uploaded_count = 0
            
            # Document upload mappings
            document_uploads = [
                ('photo', data.photo_path, ['#photo', '.photo-upload', 'input[name*="photo"]']),
                ('certificate', data.certificate_path, ['#certificate', '.cert-upload', 'input[name*="certificate"]']),
                ('id_copy', data.id_copy_path, ['#id_copy', '.id-upload', 'input[name*="id"]'])
            ]
            
            for doc_type, file_path, selectors in document_uploads:
                if file_path:
                    for selector in selectors:
                        try:
                            await self.browser.page.set_input_files(selector, file_path)
                            uploaded_count += 1
                            logger.info(f"Uploaded {doc_type} successfully")
                            break
                        except Exception:
                            continue
            
            # Move to next section
            await self._click_next_button()
            
            logger.info(f"Uploaded {uploaded_count} documents")
            return uploaded_count > 0
            
        except Exception as e:
            logger.error(f"Document upload failed: {e}")
            return False
    
    async def _confirm_application(self) -> bool:
        """Review and confirm application details"""
        try:
            # Look for confirmation checkbox
            confirm_selectors = [
                'input[type="checkbox"][name*="confirm"]',
                'input[type="checkbox"][name*="agree"]',
                '.confirmation-checkbox',
                '#confirm-application'
            ]
            
            for selector in confirm_selectors:
                try:
                    await self.browser.page.check(selector)
                    logger.info("Checked confirmation checkbox")
                    break
                except Exception:
                    continue
            
            # Move to final submission
            await self._click_next_button()
            
            return True
            
        except Exception as e:
            logger.error(f"Application confirmation failed: {e}")
            return False
    
    async def _submit_final_application(self) -> bool:
        """Submit the final application"""
        try:
            # Find and click final submit button
            submit_selectors = [
                "button:contains('إرسال نهائي')",
                "button:contains('Final Submit')",
                "button:contains('تأكيد الإرسال')",
                "input[type='submit'][value*='Submit']",
                ".final-submit",
                "#final-submit"
            ]
            
            for selector in submit_selectors:
                try:
                    await self.browser.click_element(selector)
                    logger.info("Clicked final submit button")
                    
                    # Wait for submission to process
                    await self.browser.page.wait_for_load_state("networkidle", timeout=60000)
                    return True
                    
                except Exception:
                    continue
            
            logger.error("Could not find final submit button")
            return False
            
        except Exception as e:
            logger.error(f"Final submission failed: {e}")
            return False
    
    async def _click_next_button(self) -> None:
        """Click next/continue button"""
        next_selectors = [
            "button:contains('التالي')",
            "button:contains('Next')",
            "button:contains('متابعة')",
            "button:contains('Continue')",
            ".next-step",
            "#next-btn"
        ]
        
        for selector in next_selectors:
            try:
                await self.browser.click_element(selector)
                await self.browser.page.wait_for_load_state("networkidle")
                return
            except Exception:
                continue
        
        logger.warning("Could not find next button")
    
    async def _extract_application_details(self) -> Dict[str, Any]:
        """Extract application details after submission"""
        try:
            page_content = await self.browser.get_page_content()
            
            # Use LLM to extract application details
            extraction_prompt = """
            Extract the following information from this Arabic/English university application confirmation page:
            1. Application number or reference number
            2. Confirmation code
            3. Application submission date
            4. Required documents list
            5. Next steps or instructions
            6. Important dates or deadlines
            
            Return the information in JSON format.
            """
            
            response = await self.llm_provider.chat(
                message=f"{extraction_prompt}\n\nPage content:\n{page_content[:4000]}",
                cultural_context="iraqi_education"
            )
            
            try:
                import json
                details = json.loads(response.content)
                return details
            except json.JSONDecodeError:
                # Fallback extraction
                import re
                
                details = {}
                
                # Extract application number
                app_patterns = [
                    r'رقم الطلب[:\s]+(\w+)',
                    r'Application Number[:\s]+(\w+)',
                    r'رقم التقديم[:\s]+(\w+)'
                ]
                
                for pattern in app_patterns:
                    match = re.search(pattern, page_content, re.IGNORECASE)
                    if match:
                        details['application_number'] = match.group(1)
                        break
                
                # Extract confirmation code
                confirm_patterns = [
                    r'رمز التأكيد[:\s]+(\w+)',
                    r'Confirmation Code[:\s]+(\w+)'
                ]
                
                for pattern in confirm_patterns:
                    match = re.search(pattern, page_content, re.IGNORECASE)
                    if match:
                        details['confirmation_code'] = match.group(1)
                        break
                
                return details
            
        except Exception as e:
            logger.error(f"Application details extraction failed: {e}")
            return {}
    
    async def _extract_status_info(self, page_content: str) -> Dict[str, Any]:
        """Extract status information from status page"""
        try:
            status_prompt = """
            Extract university application status information from this page:
            1. Current status (submitted, under review, accepted, rejected, waiting list)
            2. Application date
            3. Review completion date
            4. Acceptance/rejection reason
            5. Next required actions
            6. Contact information
            
            Return information in JSON format.
            """
            
            response = await self.llm_provider.chat(
                message=f"{status_prompt}\n\nPage content:\n{page_content[:4000]}",
                cultural_context="iraqi_education"
            )
            
            try:
                import json
                return json.loads(response.content)
            except json.JSONDecodeError:
                return {'status': 'Unknown', 'error': 'Could not parse status information'}
            
        except Exception as e:
            logger.error(f"Status extraction failed: {e}")
            return {'error': str(e)}
    
    async def _select_university_college(self, university: str, college: str) -> None:
        """Helper method to select university and college"""
        await self._select_dropdown_option('university', university)
        await asyncio.sleep(2)  # Wait for college options to load
        await self._select_dropdown_option('college', college)
    
    async def _extract_available_departments(self) -> List[Dict[str, str]]:
        """Extract available departments from current page"""
        try:
            # Get department dropdown options
            departments = []
            
            department_selectors = ['#department option', '.department-select option', 'select[name*="department"] option']
            
            for selector in department_selectors:
                try:
                    options = await self.browser.page.query_selector_all(selector)
                    for option in options:
                        text = await option.text_content()
                        value = await option.get_attribute('value')
                        if text and text.strip() and value:
                            departments.append({
                                'name': text.strip(),
                                'value': value,
                                'name_arabic': text.strip() if self.arabic_processor._contains_arabic(text) else '',
                                'name_english': text.strip() if not self.arabic_processor._contains_arabic(text) else ''
                            })
                    
                    if departments:
                        break
                        
                except Exception:
                    continue
            
            return departments
            
        except Exception as e:
            logger.error(f"Department extraction failed: {e}")
            return []


# Example usage
async def main():
    """Example usage of university application automation"""
    
    # Configure LLM provider
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
    automation = UniversityApplicationAutomation(llm_provider)
    
    # Prepare student data
    student_data = StudentData(
        full_name_arabic="فاطمة أحمد محمد علي",
        full_name_english="Fatima Ahmed Mohammed Ali",
        father_name="أحمد",
        grandfather_name="محمد",
        family_name="علي",
        national_id="123456789012",
        birth_date="01/01/2005",
        birth_place="بغداد",
        religion="مسلم",
        gender="أنثى",
        phone_number="+964 770 123 4567",
        email="fatima.ali@email.com",
        current_address="شارع الكرادة، بغداد",
        permanent_address="شارع الكرادة، بغداد",
        high_school_name="إعدادية الكرادة للبنات",
        graduation_year="2023",
        high_school_average=89.5,
        high_school_certificate_number="BG2023001234",
        preferred_university="جامعة بغداد",
        preferred_college="كلية الطب",
        preferred_department="الطب العام",
        alternative_choices=["كلية طب الأسنان", "كلية الصيدلة", "كلية العلوم"]
    )
    
    try:
        # Submit university application
        result = await automation.submit_application(student_data, 'baghdad_university')
        
        if result.success:
            print("✅ University application completed successfully!")
            print(f"Application Number: {result.application_number}")
            print(f"Confirmation Code: {result.confirmation_code}")
            print(f"Application Date: {result.application_date}")
            
            if result.required_documents:
                print("📋 Required Documents:")
                for doc in result.required_documents:
                    print(f"  - {doc}")
            
            if result.next_steps:
                print("📝 Next Steps:")
                for step in result.next_steps:
                    print(f"  - {step}")
        else:
            print("❌ University application failed:")
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