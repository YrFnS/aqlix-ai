"""
Form Handler - Intelligent form filling with Iraqi data validation
Specialized for Iraqi government portal forms
"""

import logging
import re
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass, field
from enum import Enum
from playwright.async_api import Page, ElementHandle

from .arabic_processor import ArabicTextProcessor, ArabicTextInfo
from .dom_processor import FormInfo, ElementInfo

logger = logging.getLogger(__name__)


class FieldType(Enum):
    """Iraqi form field types"""

    NAME = "name"
    NATIONAL_ID = "national_id"
    PASSPORT_NUMBER = "passport_number"
    PHONE_NUMBER = "phone_number"
    EMAIL = "email"
    ADDRESS = "address"
    BIRTH_DATE = "birth_date"
    BIRTH_PLACE = "birth_place"
    NATIONALITY = "nationality"
    OCCUPATION = "occupation"
    TRAVEL_PURPOSE = "travel_purpose"
    DURATION_STAY = "duration_stay"
    EMPLOYER = "employer"
    CITY = "city"
    PROVINCE = "province"


@dataclass
class IraqiFieldMapping:
    """Mapping between Arabic labels and field types"""

    arabic_label: str
    english_label: str
    field_type: FieldType
    validation_pattern: str = ""
    is_required: bool = False
    placeholder_text: str = ""


@dataclass
class FormFillResult:
    """Result of form filling operation"""

    success: bool
    filled_fields: Dict[str, str] = field(default_factory=dict)
    failed_fields: Dict[str, str] = field(default_factory=dict)
    validation_errors: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)


class IraqiFormValidator:
    """
    Validator for Iraqi government form data
    Ensures compliance with Iraqi data formats and requirements
    """

    def __init__(self):
        self.arabic_processor = ArabicTextProcessor()
        self.validation_patterns = self._load_validation_patterns()
        self.field_mappings = self._load_field_mappings()

    def validate_national_id(self, national_id: str) -> Tuple[bool, str]:
        """Validate Iraqi national ID format"""
        try:
            # Clean the ID
            clean_id = re.sub(r"[-\s]", "", national_id)

            # Check length (12 digits)
            if len(clean_id) != 12:
                return False, f"National ID must be 12 digits, got {len(clean_id)}"

            # Check if all digits
            if not clean_id.isdigit():
                return False, "National ID must contain only digits"

            # Basic checksum validation (simplified)
            if not self._validate_national_id_checksum(clean_id):
                return False, "Invalid national ID checksum"

            return True, ""

        except Exception as e:
            return False, f"National ID validation error: {e}"

    def validate_passport_number(self, passport: str) -> Tuple[bool, str]:
        """Validate Iraqi passport number format"""
        try:
            # Clean passport number
            clean_passport = re.sub(r"[^\w]", "", passport).upper()

            # Iraqi passport format: Letter followed by 7 digits
            pattern = r"^[A-Z]\d{7}$"
            if not re.match(pattern, clean_passport):
                return (
                    False,
                    "Iraqi passport format: One letter followed by 7 digits (e.g., A1234567)",
                )

            return True, ""

        except Exception as e:
            return False, f"Passport validation error: {e}"

    def validate_phone_number(self, phone: str) -> Tuple[bool, str]:
        """Validate Iraqi phone number format"""
        try:
            # Clean phone number
            clean_phone = re.sub(r"[\s\-\(\)]", "", phone)

            # Remove country code prefix
            if clean_phone.startswith("+964"):
                clean_phone = clean_phone[4:]
            elif clean_phone.startswith("00964"):
                clean_phone = clean_phone[5:]
            elif clean_phone.startswith("964"):
                clean_phone = clean_phone[3:]

            # Remove leading zero
            if clean_phone.startswith("0"):
                clean_phone = clean_phone[1:]

            # Validate length and format
            if len(clean_phone) != 10:
                return (
                    False,
                    f"Iraqi phone number must be 10 digits after country code, got {len(clean_phone)}",
                )

            # Check if all digits
            if not clean_phone.isdigit():
                return False, "Phone number must contain only digits"

            # Validate mobile prefixes (77, 78, 79, 75, etc.)
            valid_prefixes = ["77", "78", "79", "75", "73", "72", "71", "70"]
            if not any(clean_phone.startswith(prefix) for prefix in valid_prefixes):
                return (
                    False,
                    f"Invalid Iraqi mobile prefix. Must start with: {', '.join(valid_prefixes)}",
                )

            return True, ""

        except Exception as e:
            return False, f"Phone validation error: {e}"

    def validate_email(self, email: str) -> Tuple[bool, str]:
        """Validate email format"""
        try:
            pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
            if not re.match(pattern, email):
                return False, "Invalid email format"

            return True, ""

        except Exception as e:
            return False, f"Email validation error: {e}"

    def validate_date(self, date: str) -> Tuple[bool, str]:
        """Validate date format (DD/MM/YYYY)"""
        try:
            # Try to parse Iraqi date format
            patterns = [
                r"^(\d{1,2})/(\d{1,2})/(\d{4})$",  # DD/MM/YYYY
                r"^(\d{1,2})-(\d{1,2})-(\d{4})$",  # DD-MM-YYYY
            ]

            for pattern in patterns:
                match = re.match(pattern, date)
                if match:
                    day, month, year = map(int, match.groups())

                    # Validate ranges
                    if not (1 <= day <= 31):
                        return False, f"Invalid day: {day}"
                    if not (1 <= month <= 12):
                        return False, f"Invalid month: {month}"
                    if not (1900 <= year <= 2030):
                        return False, f"Invalid year: {year}"

                    return True, ""

            return False, "Date must be in DD/MM/YYYY or DD-MM-YYYY format"

        except Exception as e:
            return False, f"Date validation error: {e}"

    def validate_arabic_name(self, name: str) -> Tuple[bool, str]:
        """Validate Arabic name format"""
        try:
            # Check if name contains Arabic characters
            if not self.arabic_processor.arabic_range.search(name):
                return False, "Name must contain Arabic characters"

            # Check length
            if len(name.strip()) < 2:
                return False, "Name too short"

            if len(name.strip()) > 100:
                return False, "Name too long"

            # Check for valid characters (Arabic letters, spaces, hyphens)
            valid_pattern = r"^[\u0600-\u06FF\s\-]+$"
            if not re.match(valid_pattern, name):
                return False, "Name contains invalid characters"

            return True, ""

        except Exception as e:
            return False, f"Name validation error: {e}"

    def _validate_national_id_checksum(self, national_id: str) -> bool:
        """Validate national ID checksum (simplified algorithm)"""
        try:
            # This is a simplified validation
            # Real Iraqi national ID has a specific algorithm
            digits = [int(d) for d in national_id]

            # Simple checksum: sum of digits should be divisible by certain number
            total = sum(digits)
            return total % 10 == int(national_id[-1])

        except Exception:
            return False

    def _load_validation_patterns(self) -> Dict[FieldType, str]:
        """Load validation patterns for different field types"""
        return {
            FieldType.NATIONAL_ID: r"^\d{12}$",
            FieldType.PASSPORT_NUMBER: r"^[A-Z]\d{7}$",
            FieldType.PHONE_NUMBER: r"^(\+964|964|0)?[7][0-9]{9}$",
            FieldType.EMAIL: r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$",
            FieldType.BIRTH_DATE: r"^\d{1,2}/\d{1,2}/\d{4}$",
            FieldType.NAME: r"^[\u0600-\u06FF\s\-]{2,100}$",
        }

    def _load_field_mappings(self) -> List[IraqiFieldMapping]:
        """Load field mappings for Iraqi forms"""
        return [
            IraqiFieldMapping(
                arabic_label="الاسم الكامل",
                english_label="Full Name",
                field_type=FieldType.NAME,
                validation_pattern=r"^[\u0600-\u06FF\s\-]{2,100}$",
                is_required=True,
                placeholder_text="الاسم الرباعي",
            ),
            IraqiFieldMapping(
                arabic_label="رقم الهوية الوطنية",
                english_label="National ID Number",
                field_type=FieldType.NATIONAL_ID,
                validation_pattern=r"^\d{12}$",
                is_required=True,
                placeholder_text="123456789012",
            ),
            IraqiFieldMapping(
                arabic_label="رقم الجواز",
                english_label="Passport Number",
                field_type=FieldType.PASSPORT_NUMBER,
                validation_pattern=r"^[A-Z]\d{7}$",
                is_required=True,
                placeholder_text="A1234567",
            ),
            IraqiFieldMapping(
                arabic_label="رقم الهاتف النقال",
                english_label="Mobile Phone",
                field_type=FieldType.PHONE_NUMBER,
                validation_pattern=r"^(\+964|964|0)?[7][0-9]{9}$",
                is_required=True,
                placeholder_text="+964 770 123 4567",
            ),
            IraqiFieldMapping(
                arabic_label="البريد الإلكتروني",
                english_label="Email Address",
                field_type=FieldType.EMAIL,
                validation_pattern=r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$",
                is_required=False,
                placeholder_text="example@domain.com",
            ),
            IraqiFieldMapping(
                arabic_label="تاريخ الميلاد",
                english_label="Date of Birth",
                field_type=FieldType.BIRTH_DATE,
                validation_pattern=r"^\d{1,2}/\d{1,2}/\d{4}$",
                is_required=True,
                placeholder_text="01/01/1990",
            ),
            IraqiFieldMapping(
                arabic_label="مكان الميلاد",
                english_label="Place of Birth",
                field_type=FieldType.BIRTH_PLACE,
                is_required=True,
                placeholder_text="بغداد",
            ),
            IraqiFieldMapping(
                arabic_label="الجنسية",
                english_label="Nationality",
                field_type=FieldType.NATIONALITY,
                is_required=True,
                placeholder_text="عراقي",
            ),
            IraqiFieldMapping(
                arabic_label="المهنة",
                english_label="Occupation",
                field_type=FieldType.OCCUPATION,
                is_required=False,
                placeholder_text="مهندس",
            ),
            IraqiFieldMapping(
                arabic_label="العنوان",
                english_label="Address",
                field_type=FieldType.ADDRESS,
                is_required=True,
                placeholder_text="الشارع، المنطقة، المدينة",
            ),
        ]


class FormHandler:
    """
    Intelligent form handler for Iraqi government portals
    Handles form detection, field mapping, and automated filling
    """

    def __init__(self, page: Page):
        self.page = page
        self.validator = IraqiFormValidator()
        self.arabic_processor = ArabicTextProcessor()

    async def detect_form_type(self, form_selector: str = "form") -> str:
        """Detect the type of Iraqi government form"""
        try:
            form_element = await self.page.query_selector(form_selector)
            if not form_element:
                return "unknown"

            # Get form content
            form_content = await form_element.text_content()
            form_html = await form_element.inner_html()

            # Analyze content for form type indicators
            content = (form_content + " " + form_html).lower()

            # Government form type indicators
            form_types = {
                "passport": ["جواز", "passport", "تجديد الجواز", "passport renewal"],
                "national_id": ["هوية", "national id", "تجديد الهوية", "id renewal"],
                "visa": ["فيزا", "visa", "تأشيرة", "entry visa"],
                "certificate": ["شهادة", "certificate", "وثيقة", "document"],
                "license": ["رخصة", "license", "إجازة", "permit"],
                "registration": ["تسجيل", "registration", "قيد", "enrollment"],
                "application": ["طلب", "application", "استمارة", "form"],
                "renewal": ["تجديد", "renewal", "تمديد", "extension"],
            }

            for form_type, indicators in form_types.items():
                if any(indicator in content for indicator in indicators):
                    logger.info(f"Detected form type: {form_type}")
                    return form_type

            return "general"

        except Exception as e:
            logger.error(f"Form type detection failed: {e}")
            return "unknown"

    async def analyze_form_fields(self, form_selector: str = "form") -> Dict[str, Any]:
        """Analyze form fields and create field mapping"""
        try:
            form_element = await self.page.query_selector(form_selector)
            if not form_element:
                raise ValueError(f"Form not found: {form_selector}")

            # Find all input fields
            fields = await form_element.query_selector_all("input, textarea, select")

            field_analysis = {
                "total_fields": len(fields),
                "field_mappings": [],
                "required_fields": [],
                "optional_fields": [],
                "validation_rules": {},
            }

            for i, field in enumerate(fields):
                field_info = await self._analyze_field(field, i)
                field_analysis["field_mappings"].append(field_info)

                if field_info.get("is_required"):
                    field_analysis["required_fields"].append(field_info)
                else:
                    field_analysis["optional_fields"].append(field_info)

                # Add validation rules
                if field_info.get("field_type"):
                    field_type = field_info["field_type"]
                    if field_type in self.validator.validation_patterns:
                        field_analysis["validation_rules"][field_info["name"]] = (
                            self.validator.validation_patterns[field_type]
                        )

            logger.info(
                f"Analyzed form: {len(fields)} fields, {len(field_analysis['required_fields'])} required"
            )
            return field_analysis

        except Exception as e:
            logger.error(f"Form field analysis failed: {e}")
            raise

    async def fill_form(
        self, form_data: Dict[str, str], form_selector: str = "form"
    ) -> FormFillResult:
        """Fill form with Iraqi data validation"""
        result = FormFillResult(success=False)

        try:
            # Analyze form first
            form_analysis = await self.analyze_form_fields(form_selector)

            # Fill each field
            for field_mapping in form_analysis["field_mappings"]:
                field_name = field_mapping.get("name", "")
                field_type = field_mapping.get("field_type")
                selector = field_mapping.get("selector", "")

                if field_name in form_data and selector:
                    value = form_data[field_name]

                    # Validate data before filling
                    if field_type:
                        is_valid, error = self._validate_field_value(field_type, value)
                        if not is_valid:
                            result.validation_errors.append(f"{field_name}: {error}")
                            result.failed_fields[field_name] = error
                            continue

                    # Format data for Iraqi standards
                    formatted_value = self._format_field_value(field_type, value)

                    # Fill the field
                    try:
                        await self.page.fill(selector, formatted_value)
                        result.filled_fields[field_name] = formatted_value
                        logger.info(f"Filled field {field_name} with value")

                    except Exception as e:
                        error_msg = f"Failed to fill field: {e}"
                        result.failed_fields[field_name] = error_msg
                        logger.warning(error_msg)

            # Check if all required fields were filled
            required_field_names = [f["name"] for f in form_analysis["required_fields"]]
            missing_required = [
                name
                for name in required_field_names
                if name not in result.filled_fields
            ]

            if missing_required:
                result.warnings.append(
                    f"Missing required fields: {', '.join(missing_required)}"
                )

            result.success = (
                len(result.filled_fields) > 0 and len(missing_required) == 0
            )

            logger.info(
                f"Form filling completed: {len(result.filled_fields)} fields filled, "
                f"{len(result.failed_fields)} failed"
            )

            return result

        except Exception as e:
            logger.error(f"Form filling failed: {e}")
            result.validation_errors.append(f"Form filling error: {e}")
            return result

    async def submit_form(self, form_selector: str = "form") -> bool:
        """Submit form after validation"""
        try:
            # Find submit button
            submit_selectors = [
                f"{form_selector} input[type='submit']",
                f"{form_selector} button[type='submit']",
                f"{form_selector} button:contains('إرسال')",
                f"{form_selector} button:contains('Submit')",
                f"{form_selector} .submit-btn",
                f"{form_selector} .btn-submit",
            ]

            submit_button = None
            for selector in submit_selectors:
                try:
                    submit_button = await self.page.query_selector(selector)
                    if submit_button:
                        break
                except Exception:
                    continue

            if not submit_button:
                raise ValueError("Submit button not found")

            # Click submit button
            await submit_button.click()

            # Wait for navigation or response
            try:
                await self.page.wait_for_load_state("networkidle", timeout=30000)
            except Exception:
                # Continue if navigation timeout
                pass

            logger.info("Form submitted successfully")
            return True

        except Exception as e:
            logger.error(f"Form submission failed: {e}")
            return False

    async def _analyze_field(self, field: ElementHandle, index: int) -> Dict[str, Any]:
        """Analyze individual form field"""
        try:
            # Get field attributes
            tag_name = await field.evaluate("el => el.tagName.toLowerCase()")
            name = await field.get_attribute("name") or f"field_{index}"
            field_type = await field.get_attribute("type") or "text"
            placeholder = await field.get_attribute("placeholder") or ""
            required = await field.get_attribute("required") is not None

            # Get associated label
            label_text = await self._get_field_label(field)

            # Detect Iraqi field type from label
            iraqi_field_type = self._detect_iraqi_field_type(
                label_text, placeholder, name
            )

            # Generate selector
            field_id = await field.get_attribute("id")
            if field_id:
                selector = f"#{field_id}"
            elif name:
                selector = f"input[name='{name}']"
            else:
                selector = f"{tag_name}:nth-of-type({index + 1})"

            return {
                "name": name,
                "type": field_type,
                "tag": tag_name,
                "selector": selector,
                "label": label_text,
                "placeholder": placeholder,
                "is_required": required,
                "field_type": iraqi_field_type,
                "is_arabic": self.arabic_processor._contains_arabic(
                    label_text + placeholder
                ),
            }

        except Exception as e:
            logger.error(f"Field analysis failed: {e}")
            return {"name": f"field_{index}", "selector": "", "error": str(e)}

    async def _get_field_label(self, field: ElementHandle) -> str:
        """Get label text for form field"""
        try:
            # Try to find associated label
            field_id = await field.get_attribute("id")

            if field_id:
                # Look for label with 'for' attribute
                label = await self.page.query_selector(f"label[for='{field_id}']")
                if label:
                    return await label.text_content()

            # Look for label as previous sibling
            label = await field.evaluate("""
                el => {
                    let prev = el.previousElementSibling;
                    while (prev) {
                        if (prev.tagName.toLowerCase() === 'label') {
                            return prev.textContent;
                        }
                        prev = prev.previousElementSibling;
                    }
                    
                    // Look for label as parent
                    let parent = el.parentElement;
                    if (parent && parent.tagName.toLowerCase() === 'label') {
                        return parent.textContent;
                    }
                    
                    return '';
                }
            """)

            return label or ""

        except Exception:
            return ""

    def _detect_iraqi_field_type(
        self, label: str, placeholder: str, name: str
    ) -> Optional[FieldType]:
        """Detect Iraqi field type from label and context"""
        text = (label + " " + placeholder + " " + name).lower()

        # Arabic field type detection
        field_indicators = {
            FieldType.NAME: ["اسم", "name", "الاسم"],
            FieldType.NATIONAL_ID: ["هوية", "national", "id", "رقم الهوية"],
            FieldType.PASSPORT_NUMBER: ["جواز", "passport", "رقم الجواز"],
            FieldType.PHONE_NUMBER: ["هاتف", "phone", "mobile", "رقم الهاتف"],
            FieldType.EMAIL: ["بريد", "email", "البريد الإلكتروني"],
            FieldType.BIRTH_DATE: ["ميلاد", "birth", "تاريخ الميلاد", "date"],
            FieldType.BIRTH_PLACE: ["مكان", "place", "مكان الميلاد"],
            FieldType.NATIONALITY: ["جنسية", "nationality", "الجنسية"],
            FieldType.ADDRESS: ["عنوان", "address", "العنوان"],
            FieldType.OCCUPATION: ["مهنة", "occupation", "المهنة"],
        }

        for field_type, indicators in field_indicators.items():
            if any(indicator in text for indicator in indicators):
                return field_type

        return None

    def _validate_field_value(
        self, field_type: FieldType, value: str
    ) -> Tuple[bool, str]:
        """Validate field value based on type"""
        if not value.strip():
            return False, "Field is required"

        if field_type == FieldType.NATIONAL_ID:
            return self.validator.validate_national_id(value)
        elif field_type == FieldType.PASSPORT_NUMBER:
            return self.validator.validate_passport_number(value)
        elif field_type == FieldType.PHONE_NUMBER:
            return self.validator.validate_phone_number(value)
        elif field_type == FieldType.EMAIL:
            return self.validator.validate_email(value)
        elif field_type == FieldType.BIRTH_DATE:
            return self.validator.validate_date(value)
        elif field_type == FieldType.NAME:
            return self.validator.validate_arabic_name(value)
        else:
            return True, ""

    def _format_field_value(self, field_type: Optional[FieldType], value: str) -> str:
        """Format field value according to Iraqi standards"""
        if not field_type:
            return value

        return self.arabic_processor.format_iraqi_data(field_type.value, value)
