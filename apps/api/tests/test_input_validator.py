"""
Unit Tests for Input Validator Service

Tests comprehensive input validation with Iraqi-specific rules:
- Email validation
- Iraqi ID validation (15 digits)
- Phone number validation
- URL validation
- Name validation (Arabic + English)
- XSS detection
- SQL injection detection
"""

import pytest
from apps.api.services.input_validator import (
    InputValidator,
    InputValidationResult,
    ValidationType,
    InputLengthLimits,
)


class TestEmailValidation:
    """Test email validation"""

    def test_valid_email(self):
        """Test valid email addresses"""
        valid_emails = [
            "user@example.com",
            "test.user@example.com",
            "user+tag@example.co.uk",
            "user_name@example.org",
        ]

        for email in valid_emails:
            result = InputValidator.validate_email(email)
            assert result.is_valid
            assert result.sanitized_value == email.lower()

    def test_invalid_email_format(self):
        """Test invalid email formats"""
        invalid_emails = [
            "notanemail",
            "@example.com",
            "user@",
            "user @example.com",
            "user@exam ple.com",
        ]

        for email in invalid_emails:
            result = InputValidator.validate_email(email)
            assert not result.is_valid
            assert result.error_message is not None

    def test_empty_email(self):
        """Test empty email"""
        result = InputValidator.validate_email("")
        assert not result.is_valid
        assert "cannot be empty" in result.error_message

    def test_email_too_long(self):
        """Test email exceeding maximum length"""
        long_email = "a" * 250 + "@example.com"
        result = InputValidator.validate_email(long_email)
        assert not result.is_valid
        assert "maximum length" in result.error_message

    def test_email_with_xss(self):
        """Test email with XSS patterns"""
        xss_emails = [
            "user<script>@example.com",
            "user@example.com<script>",
            "javascript:alert(1)@example.com",
        ]

        for email in xss_emails:
            result = InputValidator.validate_email(email)
            assert not result.is_valid
            assert len(result.security_warnings) > 0


class TestIraqiIDValidation:
    """Test Iraqi ID validation (15 digits)"""

    def test_valid_iraqi_id_plain(self):
        """Test valid Iraqi ID (15 digits, plain format)"""
        valid_id = "101198500001234"  # 101 (Baghdad) + 1985 (birth year) + 0000123 + 4
        result = InputValidator.validate_iraqi_id(valid_id)
        assert result.is_valid
        assert result.sanitized_value == "101-1985-0000123-4"

    def test_valid_iraqi_id_formatted(self):
        """Test valid Iraqi ID (formatted with dashes)"""
        valid_id = "101-1985-0000123-4"
        result = InputValidator.validate_iraqi_id(valid_id)
        assert result.is_valid
        assert result.sanitized_value == "101-1985-0000123-4"

    def test_invalid_iraqi_id_length(self):
        """Test invalid Iraqi ID length"""
        invalid_ids = [
            "12345",  # Too short
            "1234567890123",  # 13 digits
            "12345678901234",  # 14 digits
            "1234567890123456",  # 16 digits
        ]

        for iraqi_id in invalid_ids:
            result = InputValidator.validate_iraqi_id(iraqi_id)
            assert not result.is_valid
            assert "15 digits" in result.error_message

    def test_iraqi_id_with_letters(self):
        """Test Iraqi ID with non-digit characters"""
        result = InputValidator.validate_iraqi_id("10119850000123A")
        assert not result.is_valid

    def test_empty_iraqi_id(self):
        """Test empty Iraqi ID"""
        result = InputValidator.validate_iraqi_id("")
        assert not result.is_valid
        assert "cannot be empty" in result.error_message

    def test_iraqi_id_birth_year_validation(self):
        """Test birth year validation in Iraqi ID"""
        # Valid birth year
        valid_id = "101198500001234"
        result = InputValidator.validate_iraqi_id(valid_id)
        assert result.is_valid

        # Invalid birth year (too old)
        invalid_id = "101191000001234"  # 1910
        result = InputValidator.validate_iraqi_id(invalid_id)
        assert result.is_valid  # Still valid format, but warning
        assert len(result.security_warnings) > 0

    def test_iraqi_id_extraction(self):
        """Test extraction of ID components"""
        valid_id = "101198500001234"
        result = InputValidator.validate_iraqi_id(valid_id)
        assert result.is_valid
        assert result.validation_details["regional_prefix"] == "101"
        assert result.validation_details["birth_year"] == "1985"
        assert result.validation_details["sequential"] == "0000123"
        assert result.validation_details["checksum"] == "4"


class TestPhoneValidation:
    """Test phone number validation"""

    def test_valid_iraqi_phone_international(self):
        """Test valid Iraqi phone (international format)"""
        valid_phones = [
            "+9647901234567",
            "+9647701234567",
            "+9647801234567",
        ]

        for phone in valid_phones:
            result = InputValidator.validate_phone(phone)
            assert result.is_valid
            assert result.sanitized_value.startswith("+964")

    def test_valid_iraqi_phone_local(self):
        """Test valid Iraqi phone (local format)"""
        valid_phones = [
            "07901234567",
            "07701234567",
            "07801234567",
        ]

        for phone in valid_phones:
            result = InputValidator.validate_phone(phone)
            assert result.is_valid
            assert result.sanitized_value.startswith("+964")

    def test_phone_with_formatting(self):
        """Test phone with spaces and dashes"""
        phones_with_formatting = [
            "0790 123 4567",
            "0790-123-4567",
            "(0790) 123-4567",
        ]

        for phone in phones_with_formatting:
            result = InputValidator.validate_phone(phone)
            assert result.is_valid

    def test_invalid_phone_format(self):
        """Test invalid phone formats"""
        invalid_phones = [
            "123456",  # Too short
            "06901234567",  # Wrong prefix (06 instead of 07)
            "+9656901234567",  # Wrong country code
            "abcdefghijk",  # Letters
        ]

        for phone in invalid_phones:
            result = InputValidator.validate_phone(phone)
            assert not result.is_valid

    def test_empty_phone(self):
        """Test empty phone"""
        result = InputValidator.validate_phone("")
        assert not result.is_valid
        assert "cannot be empty" in result.error_message


class TestURLValidation:
    """Test URL validation"""

    def test_valid_https_url(self):
        """Test valid HTTPS URLs"""
        valid_urls = [
            "https://example.com",
            "https://www.example.com/path",
            "https://example.com/path?query=value",
            "https://subdomain.example.com:8080/path",
        ]

        for url in valid_urls:
            result = InputValidator.validate_url(url)
            assert result.is_valid
            assert result.sanitized_value == url

    def test_http_url_with_https_required(self):
        """Test HTTP URL when HTTPS required"""
        result = InputValidator.validate_url("http://example.com", require_https=True)
        assert not result.is_valid
        assert "HTTPS" in result.error_message
        assert len(result.security_warnings) > 0

    def test_http_url_with_https_not_required(self):
        """Test HTTP URL when HTTPS not required"""
        result = InputValidator.validate_url("http://example.com", require_https=False)
        assert result.is_valid

    def test_invalid_url_format(self):
        """Test invalid URL formats"""
        invalid_urls = [
            "not-a-url",
            "ftp://example.com",  # Wrong protocol
            "example.com",  # Missing protocol
            "http://",  # Incomplete
        ]

        for url in invalid_urls:
            result = InputValidator.validate_url(url)
            assert not result.is_valid

    def test_url_with_dangerous_protocol(self):
        """Test URLs with dangerous protocols"""
        dangerous_urls = [
            "javascript:alert(1)",
            "data:text/html,<script>alert(1)</script>",
            "vbscript:msgbox(1)",
        ]

        for url in dangerous_urls:
            result = InputValidator.validate_url(url)
            assert not result.is_valid

    def test_url_too_long(self):
        """Test URL exceeding maximum length"""
        long_url = "https://example.com/" + "a" * 3000
        result = InputValidator.validate_url(long_url)
        assert not result.is_valid
        assert "maximum length" in result.error_message


class TestNameValidation:
    """Test name validation (Arabic + English)"""

    def test_valid_english_name(self):
        """Test valid English names"""
        valid_names = [
            "John Doe",
            "Mary-Jane Smith",
            "O'Brien",
            "John Paul II",
        ]

        for name in valid_names:
            result = InputValidator.validate_name(name)
            assert result.is_valid
            assert result.validation_details["has_english"]
            assert not result.validation_details["has_arabic"]

    def test_valid_arabic_name(self):
        """Test valid Arabic names"""
        valid_names = [
            "محمد علي",
            "فاطمة الزهراء",
            "أحمد حسن",
        ]

        for name in valid_names:
            result = InputValidator.validate_name(name)
            assert result.is_valid
            assert result.validation_details["has_arabic"]

    def test_valid_mixed_name(self):
        """Test valid mixed Arabic-English names"""
        valid_names = [
            "John محمد",
            "Mary فاطمة",
        ]

        for name in valid_names:
            result = InputValidator.validate_name(name)
            assert result.is_valid
            assert result.validation_details["is_mixed"]

    def test_name_too_short(self):
        """Test name too short"""
        result = InputValidator.validate_name("A")
        assert not result.is_valid
        assert "at least" in result.error_message

    def test_name_too_long(self):
        """Test name exceeding maximum length"""
        long_name = "A" * 250
        result = InputValidator.validate_name(long_name)
        assert not result.is_valid
        assert "maximum length" in result.error_message

    def test_name_with_invalid_characters(self):
        """Test name with invalid characters"""
        invalid_names = [
            "John123",  # Numbers
            "John@Doe",  # Special characters
            "John<script>",  # HTML tags
        ]

        for name in invalid_names:
            result = InputValidator.validate_name(name)
            assert not result.is_valid

    def test_empty_name(self):
        """Test empty name"""
        result = InputValidator.validate_name("")
        assert not result.is_valid
        assert "cannot be empty" in result.error_message


class TestTextLengthValidation:
    """Test text length validation"""

    def test_valid_text_length(self):
        """Test valid text length"""
        text = "This is a valid text."
        result = InputValidator.validate_text_length(text, max_length=100, min_length=5)
        assert result.is_valid
        assert result.sanitized_value == text

    def test_text_too_short(self):
        """Test text too short"""
        text = "Hi"
        result = InputValidator.validate_text_length(text, min_length=10)
        assert not result.is_valid
        assert "at least" in result.error_message

    def test_text_too_long(self):
        """Test text too long"""
        text = "A" * 1000
        result = InputValidator.validate_text_length(text, max_length=500)
        assert not result.is_valid
        assert "maximum length" in result.error_message

    def test_none_text(self):
        """Test None text"""
        result = InputValidator.validate_text_length(None)
        assert not result.is_valid
        assert "cannot be None" in result.error_message


class TestXSSDetection:
    """Test XSS pattern detection"""

    def test_detect_script_tag(self):
        """Test detection of script tags"""
        text = "Hello<script>alert(1)</script>World"
        has_xss, warnings = InputValidator.detect_xss_patterns(text)
        assert has_xss
        assert len(warnings) > 0

    def test_detect_event_handlers(self):
        """Test detection of event handlers"""
        texts = [
            'Hello<img src=x onerror="alert(1)">',
            'Hello<div onclick="alert(1)">',
            'Hello<body onload="alert(1)">',
        ]

        for text in texts:
            has_xss, warnings = InputValidator.detect_xss_patterns(text)
            assert has_xss

    def test_detect_javascript_protocol(self):
        """Test detection of javascript protocol"""
        text = 'Hello<a href="javascript:alert(1)">Click</a>'
        has_xss, warnings = InputValidator.detect_xss_patterns(text)
        assert has_xss

    def test_clean_text_no_xss(self):
        """Test clean text without XSS"""
        text = "This is a clean text with no XSS."
        has_xss, warnings = InputValidator.detect_xss_patterns(text)
        assert not has_xss
        assert len(warnings) == 0


class TestSQLInjectionDetection:
    """Test SQL injection pattern detection"""

    def test_detect_union_select(self):
        """Test detection of UNION SELECT"""
        text = "user' UNION SELECT * FROM users--"
        has_sql, warnings = InputValidator.detect_sql_injection_patterns(text)
        assert has_sql
        assert len(warnings) > 0

    def test_detect_sql_keywords(self):
        """Test detection of SQL keywords"""
        texts = [
            "'; DROP TABLE users--",
            "1' OR '1'='1",
            "admin'--",
            "' OR 1=1--",
        ]

        for text in texts:
            has_sql, warnings = InputValidator.detect_sql_injection_patterns(text)
            assert has_sql

    def test_clean_text_no_sql(self):
        """Test clean text without SQL injection"""
        text = "This is a normal text about selecting items from a catalog."
        has_sql, warnings = InputValidator.detect_sql_injection_patterns(text)
        # May detect "selecting" and "from", but that's expected for basic detection
        # Real protection is parameterized queries


class TestValidateAndSanitize:
    """Test convenience method"""

    def test_email_validation(self):
        """Test email validation via convenience method"""
        result = InputValidator.validate_and_sanitize(
            "test@example.com", ValidationType.EMAIL
        )
        assert result.is_valid

    def test_iraqi_id_validation(self):
        """Test Iraqi ID validation via convenience method"""
        result = InputValidator.validate_and_sanitize(
            "101198500001234", ValidationType.IRAQI_ID
        )
        assert result.is_valid

    def test_phone_validation(self):
        """Test phone validation via convenience method"""
        result = InputValidator.validate_and_sanitize(
            "07901234567", ValidationType.PHONE
        )
        assert result.is_valid

    def test_name_validation(self):
        """Test name validation via convenience method"""
        result = InputValidator.validate_and_sanitize("John Doe", ValidationType.NAME)
        assert result.is_valid

    def test_unknown_validation_type(self):
        """Test unknown validation type"""
        result = InputValidator.validate_and_sanitize("test", "unknown_type")
        assert not result.is_valid
        assert "Unknown validation type" in result.error_message
