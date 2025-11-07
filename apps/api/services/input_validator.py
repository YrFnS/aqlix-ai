"""
Comprehensive Input Validator Service
Validates all user inputs with Iraqi-specific rules and security best practices

Provides centralized input validation for:
- Email addresses (RFC 5322 compliant)
- Iraqi national IDs (12 digits - regional code + birth year + sequential + checksum)
- Professional licenses (domain-specific formats)
- Phone numbers (Iraqi format)
- URLs (with sanitization)
- Names (Arabic + English support)
- Input length limits (DoS prevention)
"""

import re
import ipaddress
from typing import Optional, Tuple, List
from enum import Enum
from pydantic import BaseModel, validator
from urllib.parse import urlparse


class ValidationType(str, Enum):
    """Validation type categories"""

    EMAIL = "email"
    IRAQI_ID = "iraqi_id"
    PHONE = "phone"
    URL = "url"
    NAME = "name"
    PASSWORD = "password"
    LICENSE = "license"
    TEXT = "text"


class InputValidationResult(BaseModel):
    """Result of input validation"""

    is_valid: bool
    error_message: Optional[str] = None
    sanitized_value: Optional[str] = None
    validation_type: ValidationType
    security_warnings: List[str] = []
    validation_details: dict = {}


class InputLengthLimits:
    """Input length limits for DoS prevention"""

    # Basic fields
    EMAIL_MAX = 254  # RFC 5321
    NAME_MIN = 2
    NAME_MAX = 200
    PASSWORD_MIN = 8
    PASSWORD_MAX = 72  # Bcrypt limit

    # Iraqi-specific
    IRAQI_ID_LENGTH = 12  # Iraqi national ID cards are 12 digits
    PHONE_MIN = 10
    PHONE_MAX = 20
    LICENSE_MAX = 50

    # Text fields
    SHORT_TEXT_MAX = 500
    MEDIUM_TEXT_MAX = 2000
    LONG_TEXT_MAX = 10000

    # URLs
    URL_MAX = 2048


class InputValidator:
    """
    Comprehensive Input Validator

    Validates all user inputs with security-first approach:
    - Format validation
    - Length validation
    - Character whitelisting
    - Iraqi-specific rules
    - XSS prevention (basic checks, use XSSSanitizer for HTML)
    """

    # Email validation regex (RFC 5322 compliant)
    EMAIL_REGEX = re.compile(
        r"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
    )

    # Iraqi ID format: 12 digits (XX-XXXX-XXXXX-X)
    # Regional prefix (2 digits) + Birth year (4 digits) + Sequential (5 digits) + Checksum (1 digit)
    IRAQI_ID_REGEX = re.compile(r"^\d{12}$")
    IRAQI_ID_FORMATTED_REGEX = re.compile(r"^\d{2}-\d{4}-\d{5}-\d{1}$")

    # Iraqi phone number: +964 XXX XXX XXXX or 07XX XXX XXXX
    IRAQI_PHONE_REGEX = re.compile(r"^(\+964|0)(7[3-9]\d)\d{7}$")

    # Name validation: Arabic, English, spaces, hyphens, apostrophes
    # Supports: English (a-z, A-Z), Arabic ([\u0600-\u06FF]), spaces, hyphens, apostrophes
    NAME_REGEX = re.compile(r"^[\u0600-\u06FFa-zA-Z\s\-']+$")

    # URL validation
    URL_REGEX = re.compile(
        r"^https?://"  # http:// or https://
        r"(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|"  # domain...
        r"localhost|"  # localhost...
        r"\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})"  # ...or ip
        r"(?::\d+)?"  # optional port
        r"(?:/?|[/?]\S+)$",
        re.IGNORECASE,
    )

    # Dangerous patterns (basic XSS detection)
    DANGEROUS_PATTERNS = [
        re.compile(r"<script", re.IGNORECASE),
        re.compile(r"javascript:", re.IGNORECASE),
        re.compile(r"on\w+\s*=", re.IGNORECASE),  # onclick=, onerror=, etc.
        re.compile(r"<iframe", re.IGNORECASE),
        re.compile(r"<embed", re.IGNORECASE),
        re.compile(r"<object", re.IGNORECASE),
    ]

    # SQL injection patterns (basic detection)
    SQL_INJECTION_PATTERNS = [
        re.compile(r"(\bUNION\b.*\bSELECT\b)", re.IGNORECASE),
        re.compile(r"(\bSELECT\b.*\bFROM\b)", re.IGNORECASE),
        re.compile(r"(\bINSERT\b.*\bINTO\b)", re.IGNORECASE),
        re.compile(r"(\bDELETE\b.*\bFROM\b)", re.IGNORECASE),
        re.compile(r"(\bDROP\b.*\bTABLE\b)", re.IGNORECASE),
        re.compile(r"(--|#|/\*|\*/)", re.IGNORECASE),  # SQL comments
    ]

    # SSRF Protection: Private IP ranges and special addresses (OWASP Top 10 #A10)
    PRIVATE_IP_RANGES = [
        ipaddress.ip_network("127.0.0.0/8"),  # Loopback (localhost)
        ipaddress.ip_network("10.0.0.0/8"),  # Private network
        ipaddress.ip_network("172.16.0.0/12"),  # Private network
        ipaddress.ip_network("192.168.0.0/16"),  # Private network
        ipaddress.ip_network("169.254.0.0/16"),  # Link-local (AWS metadata)
        ipaddress.ip_network("fc00::/7"),  # IPv6 Unique Local Addresses
        ipaddress.ip_network("fe80::/10"),  # IPv6 Link-local
        ipaddress.ip_network("::1/128"),  # IPv6 loopback
        ipaddress.ip_network("0.0.0.0/8"),  # Special use
        ipaddress.ip_network("224.0.0.0/4"),  # Multicast
        ipaddress.ip_network("240.0.0.0/4"),  # Reserved
    ]

    LOCALHOST_HOSTNAMES = [
        "localhost",
        "localhost.localdomain",
        "127.0.0.1",
        "::1",
        "[::1]",
    ]

    @staticmethod
    def _is_private_ip(ip_str: str) -> bool:
        """Check if IP address is private or reserved (SSRF protection)"""
        try:
            ip = ipaddress.ip_address(ip_str)
            for network in InputValidator.PRIVATE_IP_RANGES:
                if ip in network:
                    return True
            return False
        except ValueError:
            return False

    @staticmethod
    def _is_localhost_hostname(hostname: str) -> bool:
        """Check if hostname is localhost variant (SSRF protection)"""
        hostname_lower = hostname.lower()
        return hostname_lower in InputValidator.LOCALHOST_HOSTNAMES

    @staticmethod
    def _extract_hostname_from_url(url: str) -> Optional[str]:
        """Extract hostname/IP from URL"""
        try:
            parsed = urlparse(url)
            hostname = parsed.hostname or parsed.netloc
            if hostname and ":" in hostname and not hostname.startswith("["):
                hostname = hostname.split(":")[0]
            if hostname and hostname.startswith("[") and hostname.endswith("]"):
                hostname = hostname[1:-1]
            return hostname
        except Exception:
            return None

    @staticmethod
    def validate_email(email: str) -> InputValidationResult:
        """
        Validate email address (RFC 5322 compliant)

        Args:
            email: Email address to validate

        Returns:
            InputValidationResult with validation status
        """
        validation_details = {}
        security_warnings = []

        # Check if empty
        if not email or not email.strip():
            return InputValidationResult(
                is_valid=False,
                error_message="Email address cannot be empty",
                validation_type=ValidationType.EMAIL,
                validation_details=validation_details,
            )

        email = email.strip().lower()

        # Check length
        if len(email) > InputLengthLimits.EMAIL_MAX:
            return InputValidationResult(
                is_valid=False,
                error_message=f"Email address exceeds maximum length of {InputLengthLimits.EMAIL_MAX} characters",
                validation_type=ValidationType.EMAIL,
                validation_details=validation_details,
            )

        # Validate format
        if not InputValidator.EMAIL_REGEX.match(email):
            return InputValidationResult(
                is_valid=False,
                error_message="Invalid email address format",
                validation_type=ValidationType.EMAIL,
                validation_details=validation_details,
            )

        # Check for dangerous patterns
        for pattern in InputValidator.DANGEROUS_PATTERNS:
            if pattern.search(email):
                security_warnings.append("Potentially dangerous characters detected")
                return InputValidationResult(
                    is_valid=False,
                    error_message="Email contains potentially dangerous characters",
                    validation_type=ValidationType.EMAIL,
                    security_warnings=security_warnings,
                    validation_details=validation_details,
                )

        validation_details["format"] = "valid"
        validation_details["domain"] = email.split("@")[1] if "@" in email else None

        return InputValidationResult(
            is_valid=True,
            sanitized_value=email,
            validation_type=ValidationType.EMAIL,
            validation_details=validation_details,
        )

    @staticmethod
    def validate_iraqi_id(
        iraqi_id: str, allow_formatted: bool = True
    ) -> InputValidationResult:
        """
        Validate Iraqi national ID (12 digits)

        Format: XX-XXXX-XXXXX-X (optional dashes)
        - Regional prefix: 2 digits
        - Birth year: 4 digits
        - Sequential number: 5 digits
        - Checksum: 1 digit

        Args:
            iraqi_id: Iraqi national ID to validate
            allow_formatted: Allow formatted input with dashes

        Returns:
            InputValidationResult with validation status
        """
        validation_details = {}
        security_warnings = []

        if not iraqi_id or not iraqi_id.strip():
            return InputValidationResult(
                is_valid=False,
                error_message="Iraqi ID cannot be empty",
                validation_type=ValidationType.IRAQI_ID,
                validation_details=validation_details,
            )

        iraqi_id = iraqi_id.strip()

        # Remove dashes if formatted
        if allow_formatted and "-" in iraqi_id:
            if InputValidator.IRAQI_ID_FORMATTED_REGEX.match(iraqi_id):
                iraqi_id = iraqi_id.replace("-", "")
                validation_details["input_format"] = "formatted"
            else:
                return InputValidationResult(
                    is_valid=False,
                    error_message="Invalid Iraqi ID format. Expected: XX-XXXX-XXXXX-X",
                    validation_type=ValidationType.IRAQI_ID,
                    validation_details=validation_details,
                )
        else:
            validation_details["input_format"] = "plain"

        # Validate 12 digits
        if not InputValidator.IRAQI_ID_REGEX.match(iraqi_id):
            return InputValidationResult(
                is_valid=False,
                error_message=f"Iraqi ID must be exactly {InputLengthLimits.IRAQI_ID_LENGTH} digits",
                validation_type=ValidationType.IRAQI_ID,
                validation_details=validation_details,
            )

        # Extract components (12 digits: XX-XXXX-XXXXX-X)
        regional_prefix = iraqi_id[:2]
        birth_year = iraqi_id[2:6]
        sequential = iraqi_id[6:11]
        checksum = iraqi_id[11]

        validation_details["regional_prefix"] = regional_prefix
        validation_details["birth_year"] = birth_year
        validation_details["sequential"] = sequential
        validation_details["checksum"] = checksum

        # Validate birth year (reasonable range)
        try:
            year = int(birth_year)
            if year < 1920 or year > 2025:
                security_warnings.append(
                    f"Birth year {year} is outside reasonable range (1920-2025)"
                )
        except ValueError:
            return InputValidationResult(
                is_valid=False,
                error_message="Invalid birth year in Iraqi ID",
                validation_type=ValidationType.IRAQI_ID,
                validation_details=validation_details,
            )

        # Format for storage (with dashes)
        formatted_id = f"{regional_prefix}-{birth_year}-{sequential}-{checksum}"

        return InputValidationResult(
            is_valid=True,
            sanitized_value=formatted_id,
            validation_type=ValidationType.IRAQI_ID,
            security_warnings=security_warnings,
            validation_details=validation_details,
        )

    @staticmethod
    def validate_phone(phone: str) -> InputValidationResult:
        """
        Validate Iraqi phone number

        Formats supported:
        - +964 7XX XXX XXXX (international)
        - 07XX XXX XXXX (local)

        Args:
            phone: Phone number to validate

        Returns:
            InputValidationResult with validation status
        """
        validation_details = {}

        if not phone or not phone.strip():
            return InputValidationResult(
                is_valid=False,
                error_message="Phone number cannot be empty",
                validation_type=ValidationType.PHONE,
                validation_details=validation_details,
            )

        # Remove spaces and common separators
        phone = (
            phone.strip()
            .replace(" ", "")
            .replace("-", "")
            .replace("(", "")
            .replace(")", "")
        )

        # Check length
        if (
            len(phone) < InputLengthLimits.PHONE_MIN
            or len(phone) > InputLengthLimits.PHONE_MAX
        ):
            return InputValidationResult(
                is_valid=False,
                error_message=f"Phone number must be between {InputLengthLimits.PHONE_MIN} and {InputLengthLimits.PHONE_MAX} characters",
                validation_type=ValidationType.PHONE,
                validation_details=validation_details,
            )

        # Validate Iraqi phone format
        if not InputValidator.IRAQI_PHONE_REGEX.match(phone):
            return InputValidationResult(
                is_valid=False,
                error_message="Invalid Iraqi phone number format. Expected: +964 7XX XXX XXXX or 07XX XXX XXXX",
                validation_type=ValidationType.PHONE,
                validation_details=validation_details,
            )

        # Normalize to international format
        if phone.startswith("0"):
            phone = "+964" + phone[1:]

        validation_details["format"] = "valid"
        validation_details["normalized"] = phone

        return InputValidationResult(
            is_valid=True,
            sanitized_value=phone,
            validation_type=ValidationType.PHONE,
            validation_details=validation_details,
        )

    @staticmethod
    def validate_url(
        url: str, require_https: bool = True, block_private_ips: bool = True
    ) -> InputValidationResult:
        """
        Validate and sanitize URL with SSRF protection

        Args:
            url: URL to validate
            require_https: Require HTTPS protocol
            block_private_ips: Block private IPs and localhost (SSRF protection)

        Returns:
            InputValidationResult with validation status
        """
        validation_details = {}
        security_warnings = []

        if not url or not url.strip():
            return InputValidationResult(
                is_valid=False,
                error_message="URL cannot be empty",
                validation_type=ValidationType.URL,
                validation_details=validation_details,
            )

        url = url.strip()

        # Check length
        if len(url) > InputLengthLimits.URL_MAX:
            return InputValidationResult(
                is_valid=False,
                error_message=f"URL exceeds maximum length of {InputLengthLimits.URL_MAX} characters",
                validation_type=ValidationType.URL,
                validation_details=validation_details,
            )

        # Validate format
        if not InputValidator.URL_REGEX.match(url):
            return InputValidationResult(
                is_valid=False,
                error_message="Invalid URL format",
                validation_type=ValidationType.URL,
                validation_details=validation_details,
            )

        # Parse URL
        try:
            parsed = urlparse(url)
            validation_details["scheme"] = parsed.scheme
            validation_details["domain"] = parsed.netloc
        except Exception:
            return InputValidationResult(
                is_valid=False,
                error_message="Failed to parse URL",
                validation_type=ValidationType.URL,
                validation_details=validation_details,
            )

        # Check HTTPS requirement
        if require_https and parsed.scheme != "https":
            security_warnings.append("URL does not use HTTPS")
            return InputValidationResult(
                is_valid=False,
                error_message="URL must use HTTPS protocol",
                validation_type=ValidationType.URL,
                security_warnings=security_warnings,
                validation_details=validation_details,
            )

        # SSRF Protection: Block private IPs and localhost (OWASP Top 10 #A10)
        if block_private_ips:
            hostname = InputValidator._extract_hostname_from_url(url)

            if hostname:
                validation_details["hostname"] = hostname

                # Check for localhost hostnames
                if InputValidator._is_localhost_hostname(hostname):
                    security_warnings.append(
                        "SSRF attempt detected: localhost access blocked"
                    )
                    return InputValidationResult(
                        is_valid=False,
                        error_message="URL targets localhost, which is blocked for security",
                        validation_type=ValidationType.URL,
                        security_warnings=security_warnings,
                        validation_details=validation_details,
                    )

                # Check if hostname is an IP address
                try:
                    ip = ipaddress.ip_address(hostname)
                    validation_details["is_ip_address"] = True
                    validation_details["ip_type"] = (
                        "IPv6" if ip.version == 6 else "IPv4"
                    )

                    if InputValidator._is_private_ip(hostname):
                        security_warnings.append(
                            "SSRF attempt detected: private IP access blocked"
                        )
                        return InputValidationResult(
                            is_valid=False,
                            error_message="URL targets private IP address, which is blocked for security",
                            validation_type=ValidationType.URL,
                            security_warnings=security_warnings,
                            validation_details=validation_details,
                        )
                except ValueError:
                    # Not an IP address, which is fine (it's a hostname)
                    validation_details["is_ip_address"] = False

        # Check for dangerous patterns
        for pattern in InputValidator.DANGEROUS_PATTERNS:
            if pattern.search(url):
                security_warnings.append("Potentially dangerous URL detected")
                return InputValidationResult(
                    is_valid=False,
                    error_message="URL contains potentially dangerous characters",
                    validation_type=ValidationType.URL,
                    security_warnings=security_warnings,
                    validation_details=validation_details,
                )

        return InputValidationResult(
            is_valid=True,
            sanitized_value=url,
            validation_type=ValidationType.URL,
            security_warnings=security_warnings,
            validation_details=validation_details,
        )

    @staticmethod
    def validate_name(name: str) -> InputValidationResult:
        """
        Validate name (Arabic + English support)

        Allowed characters:
        - Arabic: \u0600-\u06ff
        - English: a-z, A-Z
        - Special: spaces, hyphens, apostrophes

        Args:
            name: Name to validate

        Returns:
            InputValidationResult with validation status
        """
        validation_details = {}

        if not name or not name.strip():
            return InputValidationResult(
                is_valid=False,
                error_message="Name cannot be empty",
                validation_type=ValidationType.NAME,
                validation_details=validation_details,
            )

        name = name.strip()

        # Check length
        if len(name) < InputLengthLimits.NAME_MIN:
            return InputValidationResult(
                is_valid=False,
                error_message=f"Name must be at least {InputLengthLimits.NAME_MIN} characters",
                validation_type=ValidationType.NAME,
                validation_details=validation_details,
            )

        if len(name) > InputLengthLimits.NAME_MAX:
            return InputValidationResult(
                is_valid=False,
                error_message=f"Name exceeds maximum length of {InputLengthLimits.NAME_MAX} characters",
                validation_type=ValidationType.NAME,
                validation_details=validation_details,
            )

        # Validate characters
        if not InputValidator.NAME_REGEX.match(name):
            return InputValidationResult(
                is_valid=False,
                error_message="Name contains invalid characters. Only Arabic, English letters, spaces, hyphens, and apostrophes are allowed",
                validation_type=ValidationType.NAME,
                validation_details=validation_details,
            )

        # Detect language
        has_arabic = bool(re.search(r"[\u0600-\u06FF]", name))
        has_english = bool(re.search(r"[a-zA-Z]", name))

        validation_details["has_arabic"] = has_arabic
        validation_details["has_english"] = has_english
        validation_details["is_mixed"] = has_arabic and has_english

        return InputValidationResult(
            is_valid=True,
            sanitized_value=name,
            validation_type=ValidationType.NAME,
            validation_details=validation_details,
        )

    @staticmethod
    def validate_text_length(
        text: str,
        max_length: int = InputLengthLimits.MEDIUM_TEXT_MAX,
        min_length: int = 0,
    ) -> InputValidationResult:
        """
        Validate text length (DoS prevention)

        Args:
            text: Text to validate
            max_length: Maximum allowed length
            min_length: Minimum required length

        Returns:
            InputValidationResult with validation status
        """
        validation_details = {}

        if text is None:
            return InputValidationResult(
                is_valid=False,
                error_message="Text cannot be None",
                validation_type=ValidationType.TEXT,
                validation_details=validation_details,
            )

        text_length = len(text)
        validation_details["length"] = text_length

        if text_length < min_length:
            return InputValidationResult(
                is_valid=False,
                error_message=f"Text must be at least {min_length} characters",
                validation_type=ValidationType.TEXT,
                validation_details=validation_details,
            )

        if text_length > max_length:
            return InputValidationResult(
                is_valid=False,
                error_message=f"Text exceeds maximum length of {max_length} characters",
                validation_type=ValidationType.TEXT,
                validation_details=validation_details,
            )

        return InputValidationResult(
            is_valid=True,
            sanitized_value=text,
            validation_type=ValidationType.TEXT,
            validation_details=validation_details,
        )

    @staticmethod
    def detect_xss_patterns(text: str) -> Tuple[bool, List[str]]:
        """
        Detect basic XSS patterns in text

        NOTE: This is basic detection. Use XSSSanitizer for comprehensive HTML sanitization.

        Args:
            text: Text to check

        Returns:
            Tuple of (has_dangerous_patterns, list_of_warnings)
        """
        warnings = []

        for pattern in InputValidator.DANGEROUS_PATTERNS:
            if pattern.search(text):
                warnings.append(
                    f"Detected potentially dangerous pattern: {pattern.pattern}"
                )

        return len(warnings) > 0, warnings

    @staticmethod
    def detect_sql_injection_patterns(text: str) -> Tuple[bool, List[str]]:
        """
        Detect basic SQL injection patterns

        NOTE: This is basic detection. Always use parameterized queries.

        Args:
            text: Text to check

        Returns:
            Tuple of (has_sql_patterns, list_of_warnings)
        """
        warnings = []

        for pattern in InputValidator.SQL_INJECTION_PATTERNS:
            if pattern.search(text):
                warnings.append(
                    f"Detected potentially dangerous SQL pattern: {pattern.pattern}"
                )

        return len(warnings) > 0, warnings

    @classmethod
    def validate_and_sanitize(
        cls, value: str, validation_type: ValidationType, **kwargs
    ) -> InputValidationResult:
        """
        Convenience method to validate and sanitize input

        Args:
            value: Value to validate
            validation_type: Type of validation to perform
            **kwargs: Additional validation parameters

        Returns:
            InputValidationResult with validation status
        """
        if validation_type == ValidationType.EMAIL:
            return cls.validate_email(value)
        elif validation_type == ValidationType.IRAQI_ID:
            return cls.validate_iraqi_id(value, **kwargs)
        elif validation_type == ValidationType.PHONE:
            return cls.validate_phone(value)
        elif validation_type == ValidationType.URL:
            return cls.validate_url(value, **kwargs)
        elif validation_type == ValidationType.NAME:
            return cls.validate_name(value)
        elif validation_type == ValidationType.TEXT:
            return cls.validate_text_length(value, **kwargs)
        else:
            return InputValidationResult(
                is_valid=False,
                error_message=f"Unknown validation type: {validation_type}",
                validation_type=validation_type,
            )
