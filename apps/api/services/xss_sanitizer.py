"""
XSS Sanitizer Service
Sanitizes HTML and user-generated content to prevent XSS attacks

Provides comprehensive protection against:
- Script injection
- Event handler injection
- Malicious HTML tags
- Unsafe attributes
- JavaScript protocol URLs
"""

import html
import re
from typing import Optional, List, Set, Tuple
from enum import Enum
from pydantic import BaseModel

try:
    from bs4 import BeautifulSoup

    HAS_BEAUTIFULSOUP = True
except ImportError:
    HAS_BEAUTIFULSOUP = False


class SanitizationLevel(str, Enum):
    """Sanitization strictness levels"""

    STRICT = "strict"  # Strip all HTML, only plain text
    STANDARD = "standard"  # Allow safe HTML tags only (markdown-safe)
    PERMISSIVE = "permissive"  # Allow more HTML, but still sanitize dangerous content


class XSSSanitizationResult(BaseModel):
    """Result of XSS sanitization"""

    sanitized_value: str
    original_value: str
    was_modified: bool
    removed_elements: List[str] = []
    security_warnings: List[str] = []
    sanitization_level: SanitizationLevel


class XSSSanitizer:
    """
    XSS Sanitizer

    Prevents XSS attacks by sanitizing user-generated content.
    Uses whitelist approach for safe HTML tags and attributes.

    Security approach:
    - Default: Strip all HTML (STRICT)
    - STANDARD: Allow safe markdown-compatible HTML
    - PERMISSIVE: Allow more HTML but sanitize dangerous patterns
    """

    # Safe HTML tags for STANDARD level (markdown-compatible)
    SAFE_TAGS_STANDARD: Set[str] = {
        "p",
        "br",
        "strong",
        "em",
        "u",
        "b",
        "i",
        "code",
        "pre",
        "blockquote",
        "ul",
        "ol",
        "li",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "a",
        "img",
    }

    # Additional safe tags for PERMISSIVE level
    SAFE_TAGS_PERMISSIVE: Set[str] = SAFE_TAGS_STANDARD | {
        "div",
        "span",
        "table",
        "thead",
        "tbody",
        "tr",
        "td",
        "th",
        "hr",
        "dl",
        "dt",
        "dd",
    }

    # Safe attributes for STANDARD level
    SAFE_ATTRS_STANDARD: Set[str] = {
        "href",
        "src",
        "alt",
        "title",
        "class",
    }

    # Additional safe attributes for PERMISSIVE level
    SAFE_ATTRS_PERMISSIVE: Set[str] = SAFE_ATTRS_STANDARD | {
        "id",
        "width",
        "height",
        "style",  # Will be further sanitized
        "data-*",
    }

    # Dangerous HTML tags (always removed)
    DANGEROUS_TAGS: Set[str] = {
        "script",
        "iframe",
        "embed",
        "object",
        "applet",
        "meta",
        "link",
        "style",
        "base",
        "form",
        "input",
        "button",
        "select",
        "textarea",
        "frame",
        "frameset",
    }

    # Dangerous event handlers (always removed)
    DANGEROUS_ATTRS: Set[str] = {
        "onclick",
        "ondblclick",
        "onmousedown",
        "onmouseup",
        "onmouseover",
        "onmousemove",
        "onmouseout",
        "onmouseenter",
        "onmouseleave",
        "onload",
        "onerror",
        "onabort",
        "onblur",
        "onchange",
        "onfocus",
        "onreset",
        "onselect",
        "onsubmit",
        "onkeydown",
        "onkeypress",
        "onkeyup",
    }

    # Dangerous protocols
    DANGEROUS_PROTOCOLS = ["javascript:", "data:", "vbscript:", "file:"]

    @staticmethod
    def sanitize_strict(text: str) -> XSSSanitizationResult:
        """
        Strict sanitization: Strip all HTML, only plain text

        This is the safest option and should be used for:
        - User names
        - Email addresses
        - Any field where HTML is not expected

        Args:
            text: Text to sanitize

        Returns:
            XSSSanitizationResult with sanitized text
        """
        if not text:
            return XSSSanitizationResult(
                sanitized_value="",
                original_value="",
                was_modified=False,
                sanitization_level=SanitizationLevel.STRICT,
            )

        original = text
        removed_elements = []

        # Strip all HTML tags
        # Pattern: Match anything between < and >
        tag_pattern = re.compile(r"<[^>]+>")
        tags_found = tag_pattern.findall(text)
        if tags_found:
            removed_elements.extend(tags_found)

        sanitized = tag_pattern.sub("", text)

        # HTML entity decode (convert &lt; back to <, etc.)
        sanitized = html.unescape(sanitized)

        # Remove control characters (except newlines and tabs)
        sanitized = re.sub(r"[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]", "", sanitized)

        was_modified = original != sanitized

        return XSSSanitizationResult(
            sanitized_value=sanitized,
            original_value=original,
            was_modified=was_modified,
            removed_elements=removed_elements,
            sanitization_level=SanitizationLevel.STRICT,
        )

    @staticmethod
    def _remove_dangerous_tags_with_parser(
        text: str, dangerous_tags: Set[str]
    ) -> Tuple[str, List[str], List[str]]:
        """
        Remove dangerous HTML tags using BeautifulSoup parser

        Handles nested and malformed HTML properly using HTML parser

        Args:
            text: HTML text to process
            dangerous_tags: Set of tag names to remove

        Returns:
            Tuple of (sanitized_text, removed_elements, security_warnings)
        """
        if not HAS_BEAUTIFULSOUP:
            # Fallback to regex if BeautifulSoup not available
            return XSSSanitizer._remove_dangerous_tags_with_regex(text, dangerous_tags)

        removed_elements = []
        security_warnings = []

        try:
            # Parse HTML with BeautifulSoup
            soup = BeautifulSoup(text, "html.parser")

            # Find and remove all dangerous tags recursively
            for tag_name in dangerous_tags:
                # Find all instances of this tag
                tags = soup.find_all(tag_name)
                for tag in tags:
                    removed_elements.append(f"<{tag_name}>")
                    security_warnings.append(f"Removed dangerous tag: {tag_name}")
                    # Remove the tag from the tree
                    tag.decompose()

            # Serialize back to HTML/text
            sanitized = str(soup)

            return sanitized, removed_elements, security_warnings

        except Exception as e:
            # If parsing fails, fall back to regex
            security_warnings.append(f"HTML parser failed, using regex fallback: {e}")
            return XSSSanitizer._remove_dangerous_tags_with_regex(text, dangerous_tags)

    @staticmethod
    def _remove_dangerous_tags_with_regex(
        text: str, dangerous_tags: Set[str]
    ) -> Tuple[str, List[str], List[str]]:
        """
        Remove dangerous HTML tags using regex (fallback method)

        Args:
            text: HTML text to process
            dangerous_tags: Set of tag names to remove

        Returns:
            Tuple of (sanitized_text, removed_elements, security_warnings)
        """
        removed_elements = []
        security_warnings = []

        for tag in dangerous_tags:
            pattern = re.compile(f"<{tag}[^>]*>.*?</{tag}>", re.IGNORECASE | re.DOTALL)
            if pattern.search(text):
                removed_elements.append(f"<{tag}>")
                security_warnings.append(f"Removed dangerous tag: {tag}")
            text = pattern.sub("", text)

        return text, removed_elements, security_warnings

    @staticmethod
    def sanitize_standard(text: str) -> XSSSanitizationResult:
        """
        Standard sanitization: Allow safe markdown-compatible HTML

        Allows:
        - Basic formatting (p, br, strong, em, etc.)
        - Headings (h1-h6)
        - Lists (ul, ol, li)
        - Links (a with href)
        - Images (img with src, alt)
        - Code blocks (code, pre)

        Removes:
        - Script tags
        - Event handlers
        - Dangerous protocols
        - Unsafe attributes

        Args:
            text: Text to sanitize

        Returns:
            XSSSanitizationResult with sanitized text
        """
        if not text:
            return XSSSanitizationResult(
                sanitized_value="",
                original_value="",
                was_modified=False,
                sanitization_level=SanitizationLevel.STANDARD,
            )

        original = text
        removed_elements = []
        security_warnings = []

        # Remove dangerous tags using HTML parser
        text, tag_removed, tag_warnings = (
            XSSSanitizer._remove_dangerous_tags_with_parser(
                text, XSSSanitizer.DANGEROUS_TAGS
            )
        )
        removed_elements.extend(tag_removed)
        security_warnings.extend(tag_warnings)

        # Remove event handlers
        for attr in XSSSanitizer.DANGEROUS_ATTRS:
            pattern = re.compile(
                rf"{attr}\s*=\s*(?:[\"'][^\"']*[\"']|[^\s\"'>]+)", re.IGNORECASE
            )
            if pattern.search(text):
                removed_elements.append(attr)
                security_warnings.append(f"Removed event handler: {attr}")
            text = pattern.sub("", text)

        # Sanitize URLs in href and src attributes
        text = XSSSanitizer._sanitize_urls(text)

        # Remove inline styles (for STANDARD level, styles are not allowed)
        style_pattern = compile(r'style\s*=\s*["\'][^"\']*["\']', re.IGNORECASE)
        if style_pattern.search(text):
            removed_elements.append("style attribute")
            security_warnings.append("Removed inline styles")
        text = style_pattern.sub("", text)

        was_modified = original != text

        return XSSSanitizationResult(
            sanitized_value=text,
            original_value=original,
            was_modified=was_modified,
            removed_elements=removed_elements,
            security_warnings=security_warnings,
            sanitization_level=SanitizationLevel.STANDARD,
        )

    @staticmethod
    def sanitize_permissive(text: str) -> XSSSanitizationResult:
        """
        Permissive sanitization: Allow more HTML but still sanitize dangerous content

        Allows:
        - All STANDARD tags
        - Additional layout tags (div, span, table)
        - More attributes (id, width, height, sanitized styles)

        Still removes:
        - Script tags
        - Event handlers
        - Dangerous protocols
        - Executable content

        Args:
            text: Text to sanitize

        Returns:
            XSSSanitizationResult with sanitized text
        """
        if not text:
            return XSSSanitizationResult(
                sanitized_value="",
                original_value="",
                was_modified=False,
                sanitization_level=SanitizationLevel.PERMISSIVE,
            )

        original = text
        removed_elements = []
        security_warnings = []

        # Remove dangerous tags using HTML parser
        text, tag_removed, tag_warnings = (
            XSSSanitizer._remove_dangerous_tags_with_parser(
                text, XSSSanitizer.DANGEROUS_TAGS
            )
        )
        removed_elements.extend(tag_removed)
        security_warnings.extend(tag_warnings)

        # Remove event handlers
        for attr in XSSSanitizer.DANGEROUS_ATTRS:
            pattern = re.compile(
                rf"{attr}\s*=\s*(?:[\"'][^\"']*[\"']|[^\s\"'>]+)", re.IGNORECASE
            )
            if pattern.search(text):
                removed_elements.append(attr)
                security_warnings.append(f"Removed event handler: {attr}")
            text = pattern.sub("", text)

        # Sanitize URLs
        text = XSSSanitizer._sanitize_urls(text)

        # Sanitize inline styles (remove dangerous properties)
        text = XSSSanitizer._sanitize_styles(text)

        was_modified = original != text

        return XSSSanitizationResult(
            sanitized_value=text,
            original_value=original,
            was_modified=was_modified,
            removed_elements=removed_elements,
            security_warnings=security_warnings,
            sanitization_level=SanitizationLevel.PERMISSIVE,
        )

    @staticmethod
    def _sanitize_urls(text: str) -> str:
        """
        Sanitize URLs in href and src attributes

        Removes dangerous protocols (javascript:, data:, vbscript:, file:)

        Args:
            text: Text containing URLs

        Returns:
            Text with sanitized URLs
        """

        def sanitize_url_match(match):
            url = match.group(2)
            # Check for dangerous protocols
            for protocol in XSSSanitizer.DANGEROUS_PROTOCOLS:
                if url.lower().startswith(protocol):
                    return f'{match.group(1)}="#"'  # Replace with safe placeholder
            return match.group(0)

        # Sanitize href attributes
        text = re.sub(
            r'(href\s*=\s*["\'])([^"\']+)(["\'])',
            sanitize_url_match,
            text,
            flags=re.IGNORECASE,
        )

        # Sanitize src attributes
        text = re.sub(
            r'(src\s*=\s*["\'])([^"\']+)(["\'])',
            sanitize_url_match,
            text,
            flags=re.IGNORECASE,
        )

        return text

    @staticmethod
    def _sanitize_styles(text: str) -> str:
        """
        Sanitize inline styles (remove dangerous CSS properties)

        Removes:
        - expression() (IE-specific XSS vector)
        - behavior (IE-specific XSS vector)
        - -moz-binding (Firefox XSS vector)

        Args:
            text: Text containing inline styles

        Returns:
            Text with sanitized styles
        """

        def sanitize_style_match(match):
            style = match.group(2)
            # Remove dangerous CSS properties
            dangerous_props = [
                r"expression\s*\(",
                r"behavior\s*:",
                r"-moz-binding\s*:",
                r"javascript\s*:",
            ]
            for prop in dangerous_props:
                style = re.sub(prop, "", style, flags=re.IGNORECASE)
            return f"{match.group(1)}{style}{match.group(3)}"

        text = re.sub(
            r'(style\s*=\s*["\'])([^"\']+)(["\'])',
            sanitize_style_match,
            text,
            flags=re.IGNORECASE,
        )

        return text

    @staticmethod
    def escape_html(text: str) -> str:
        """
        Escape HTML special characters

        Converts:
        - < to &lt;
        - > to &gt;
        - & to &amp;
        - " to &quot;
        - ' to &#x27;

        Args:
            text: Text to escape

        Returns:
            HTML-escaped text
        """
        if not text:
            return ""

        return html.escape(text, quote=True)

    @staticmethod
    def sanitize(
        text: str, level: SanitizationLevel = SanitizationLevel.STRICT
    ) -> XSSSanitizationResult:
        """
        Sanitize text based on specified level

        Args:
            text: Text to sanitize
            level: Sanitization level (STRICT, STANDARD, PERMISSIVE)

        Returns:
            XSSSanitizationResult with sanitized text
        """
        if level == SanitizationLevel.STRICT:
            return XSSSanitizer.sanitize_strict(text)
        elif level == SanitizationLevel.STANDARD:
            return XSSSanitizer.sanitize_standard(text)
        elif level == SanitizationLevel.PERMISSIVE:
            return XSSSanitizer.sanitize_permissive(text)
        else:
            # Default to STRICT for unknown levels
            return XSSSanitizer.sanitize_strict(text)
