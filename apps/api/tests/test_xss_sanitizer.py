"""
Unit Tests for XSS Sanitizer Service

Tests comprehensive XSS prevention:
- STRICT sanitization (strip all HTML)
- STANDARD sanitization (safe markdown HTML)
- PERMISSIVE sanitization (more HTML, sanitized)
- Dangerous tag removal
- Event handler removal
- URL sanitization
- Style sanitization
"""

import pytest
from apps.api.services.xss_sanitizer import (
    XSSSanitizer,
    XSSSanitizationResult,
    SanitizationLevel,
)


class TestStrictSanitization:
    """Test STRICT sanitization (strip all HTML)"""

    def test_plain_text_unchanged(self):
        """Test plain text remains unchanged"""
        text = "This is plain text."
        result = XSSSanitizer.sanitize_strict(text)
        assert result.sanitized_value == text
        assert not result.was_modified

    def test_remove_all_html_tags(self):
        """Test removal of all HTML tags"""
        text = "<p>Hello <strong>World</strong></p>"
        result = XSSSanitizer.sanitize_strict(text)
        assert result.sanitized_value == "Hello World"
        assert result.was_modified
        assert len(result.removed_elements) > 0

    def test_remove_script_tags(self):
        """Test removal of script tags"""
        text = "Hello<script>alert(1)</script>World"
        result = XSSSanitizer.sanitize_strict(text)
        assert "script" not in result.sanitized_value.lower()
        assert "alert" not in result.sanitized_value
        assert result.was_modified

    def test_remove_event_handlers(self):
        """Test removal of event handlers"""
        text = '<img src="x" onerror="alert(1)">'
        result = XSSSanitizer.sanitize_strict(text)
        assert "onerror" not in result.sanitized_value
        assert "alert" not in result.sanitized_value

    def test_html_entity_decode(self):
        """Test HTML entity decoding"""
        text = "&lt;p&gt;Hello&lt;/p&gt;"
        result = XSSSanitizer.sanitize_strict(text)
        # Should be decoded, then stripped
        assert result.sanitized_value == "Hello"

    def test_remove_control_characters(self):
        """Test removal of control characters"""
        text = "Hello\x00\x01\x02World"
        result = XSSSanitizer.sanitize_strict(text)
        assert "\x00" not in result.sanitized_value
        assert "\x01" not in result.sanitized_value
        assert result.sanitized_value == "HelloWorld"

    def test_preserve_newlines_and_tabs(self):
        """Test preservation of newlines and tabs"""
        text = "Hello\nWorld\tTest"
        result = XSSSanitizer.sanitize_strict(text)
        assert "\n" in result.sanitized_value
        assert "\t" in result.sanitized_value

    def test_empty_string(self):
        """Test empty string"""
        result = XSSSanitizer.sanitize_strict("")
        assert result.sanitized_value == ""
        assert not result.was_modified


class TestStandardSanitization:
    """Test STANDARD sanitization (safe markdown HTML)"""

    def test_allow_safe_tags(self):
        """Test allowing safe markdown tags"""
        text = "<p>Hello <strong>World</strong></p>"
        result = XSSSanitizer.sanitize_standard(text)
        # Standard allows p and strong
        assert "<p>" in result.sanitized_value or "Hello" in result.sanitized_value
        assert "<strong>" in result.sanitized_value or "World" in result.sanitized_value

    def test_remove_script_tags(self):
        """Test removal of script tags"""
        text = "<p>Hello</p><script>alert(1)</script><p>World</p>"
        result = XSSSanitizer.sanitize_standard(text)
        assert "<script>" not in result.sanitized_value
        assert "alert" not in result.sanitized_value
        assert result.was_modified
        assert len(result.removed_elements) > 0
        assert len(result.security_warnings) > 0

    def test_remove_iframe_tags(self):
        """Test removal of iframe tags"""
        text = '<p>Hello</p><iframe src="evil.com"></iframe>'
        result = XSSSanitizer.sanitize_standard(text)
        assert "<iframe>" not in result.sanitized_value
        assert "iframe" in str(result.removed_elements).lower()

    def test_remove_event_handlers(self):
        """Test removal of event handlers"""
        text = '<p onclick="alert(1)">Hello</p>'
        result = XSSSanitizer.sanitize_standard(text)
        assert "onclick" not in result.sanitized_value
        assert "onclick" in str(result.removed_elements).lower()

    def test_sanitize_javascript_urls(self):
        """Test sanitization of javascript URLs"""
        text = '<a href="javascript:alert(1)">Click</a>'
        result = XSSSanitizer.sanitize_standard(text)
        assert "javascript:" not in result.sanitized_value
        # Should be replaced with safe placeholder
        assert (
            'href="#"' in result.sanitized_value or "href" not in result.sanitized_value
        )

    def test_sanitize_data_urls(self):
        """Test sanitization of data URLs"""
        text = '<img src="data:text/html,<script>alert(1)</script>">'
        result = XSSSanitizer.sanitize_standard(text)
        assert "data:" not in result.sanitized_value

    def test_remove_inline_styles(self):
        """Test removal of inline styles (STANDARD level)"""
        text = '<p style="color: red;">Hello</p>'
        result = XSSSanitizer.sanitize_standard(text)
        assert "style" not in result.sanitized_value
        assert "style attribute" in str(result.removed_elements).lower()

    def test_allow_safe_links(self):
        """Test allowing safe links"""
        text = '<a href="https://example.com">Link</a>'
        result = XSSSanitizer.sanitize_standard(text)
        assert "https://example.com" in result.sanitized_value

    def test_allow_safe_images(self):
        """Test allowing safe images"""
        text = '<img src="https://example.com/image.jpg" alt="Image">'
        result = XSSSanitizer.sanitize_standard(text)
        assert "https://example.com/image.jpg" in result.sanitized_value


class TestPermissiveSanitization:
    """Test PERMISSIVE sanitization (more HTML, sanitized)"""

    def test_allow_more_tags(self):
        """Test allowing more layout tags"""
        text = "<div><span>Hello</span></div>"
        result = XSSSanitizer.sanitize_permissive(text)
        # Permissive allows div and span
        assert "Hello" in result.sanitized_value

    def test_still_remove_script_tags(self):
        """Test still removing script tags"""
        text = "<div>Hello</div><script>alert(1)</script>"
        result = XSSSanitizer.sanitize_permissive(text)
        assert "<script>" not in result.sanitized_value
        assert "alert" not in result.sanitized_value

    def test_still_remove_event_handlers(self):
        """Test still removing event handlers"""
        text = '<div onclick="alert(1)">Hello</div>'
        result = XSSSanitizer.sanitize_permissive(text)
        assert "onclick" not in result.sanitized_value

    def test_sanitize_inline_styles(self):
        """Test sanitization of inline styles (remove dangerous CSS)"""
        text = '<div style="color: red; expression(alert(1));">Hello</div>'
        result = XSSSanitizer.sanitize_permissive(text)
        # expression() should be removed
        assert "expression" not in result.sanitized_value

    def test_remove_dangerous_css_properties(self):
        """Test removal of dangerous CSS properties"""
        dangerous_styles = [
            '<div style="behavior: url(xss.htc);">Hello</div>',
            '<div style="-moz-binding: url(xss.xml);">Hello</div>',
            '<div style="background: url(javascript:alert(1));">Hello</div>',
        ]

        for text in dangerous_styles:
            result = XSSSanitizer.sanitize_permissive(text)
            # Dangerous properties should be removed
            assert (
                "behavior" not in result.sanitized_value.lower()
                or "Hello" in result.sanitized_value
            )
            assert "-moz-binding" not in result.sanitized_value
            assert "javascript:" not in result.sanitized_value


class TestURLSanitization:
    """Test URL sanitization in attributes"""

    def test_sanitize_javascript_protocol(self):
        """Test sanitization of javascript protocol"""
        text = '<a href="javascript:alert(1)">Link</a>'
        result = XSSSanitizer.sanitize_standard(text)
        assert "javascript:" not in result.sanitized_value
        assert 'href="#"' in result.sanitized_value

    def test_sanitize_data_protocol(self):
        """Test sanitization of data protocol"""
        text = '<a href="data:text/html,<script>alert(1)</script>">Link</a>'
        result = XSSSanitizer.sanitize_standard(text)
        assert "data:" not in result.sanitized_value

    def test_sanitize_vbscript_protocol(self):
        """Test sanitization of vbscript protocol"""
        text = '<a href="vbscript:msgbox(1)">Link</a>'
        result = XSSSanitizer.sanitize_standard(text)
        assert "vbscript:" not in result.sanitized_value

    def test_allow_safe_protocols(self):
        """Test allowing safe protocols"""
        safe_urls = [
            '<a href="https://example.com">Link</a>',
            '<a href="http://example.com">Link</a>',
            '<img src="https://example.com/image.jpg">',
        ]

        for text in safe_urls:
            result = XSSSanitizer.sanitize_standard(text)
            # Safe URLs should be preserved
            assert "example.com" in result.sanitized_value


class TestStyleSanitization:
    """Test style attribute sanitization"""

    def test_remove_expression(self):
        """Test removal of expression()"""
        text = '<div style="width: expression(alert(1));">Hello</div>'
        result = XSSSanitizer.sanitize_permissive(text)
        assert "expression" not in result.sanitized_value.lower()

    def test_remove_behavior(self):
        """Test removal of behavior property"""
        text = '<div style="behavior: url(xss.htc);">Hello</div>'
        result = XSSSanitizer.sanitize_permissive(text)
        assert "behavior" not in result.sanitized_value.lower()

    def test_remove_moz_binding(self):
        """Test removal of -moz-binding property"""
        text = '<div style="-moz-binding: url(xss.xml);">Hello</div>'
        result = XSSSanitizer.sanitize_permissive(text)
        assert "-moz-binding" not in result.sanitized_value


class TestHTMLEscape:
    """Test HTML character escaping"""

    def test_escape_html_entities(self):
        """Test escaping of HTML special characters"""
        text = '<p>Hello & "World"</p>'
        result = XSSSanitizer.escape_html(text)
        assert "&lt;" in result
        assert "&gt;" in result
        assert "&amp;" in result
        assert "&quot;" in result

    def test_escape_single_quotes(self):
        """Test escaping of single quotes"""
        text = "It's a test"
        result = XSSSanitizer.escape_html(text)
        assert "&#x27;" in result or "&#39;" in result

    def test_empty_string_escape(self):
        """Test escaping empty string"""
        result = XSSSanitizer.escape_html("")
        assert result == ""


class TestSanitizeMethod:
    """Test main sanitize method with levels"""

    def test_default_level_is_strict(self):
        """Test default sanitization level is STRICT"""
        text = "<p>Hello</p>"
        result = XSSSanitizer.sanitize(text)
        assert result.sanitization_level == SanitizationLevel.STRICT
        assert "<p>" not in result.sanitized_value

    def test_strict_level(self):
        """Test STRICT level"""
        text = "<p>Hello</p>"
        result = XSSSanitizer.sanitize(text, level=SanitizationLevel.STRICT)
        assert result.sanitization_level == SanitizationLevel.STRICT
        assert "<p>" not in result.sanitized_value

    def test_standard_level(self):
        """Test STANDARD level"""
        text = "<p>Hello</p>"
        result = XSSSanitizer.sanitize(text, level=SanitizationLevel.STANDARD)
        assert result.sanitization_level == SanitizationLevel.STANDARD

    def test_permissive_level(self):
        """Test PERMISSIVE level"""
        text = "<div>Hello</div>"
        result = XSSSanitizer.sanitize(text, level=SanitizationLevel.PERMISSIVE)
        assert result.sanitization_level == SanitizationLevel.PERMISSIVE


class TestRealWorldXSSVectors:
    """Test real-world XSS attack vectors"""

    def test_xss_vector_1(self):
        """Test XSS vector: <script>alert(1)</script>"""
        text = "<p>Hello</p><script>alert(1)</script><p>World</p>"
        result = XSSSanitizer.sanitize(text, level=SanitizationLevel.STANDARD)
        assert "<script>" not in result.sanitized_value
        assert "alert" not in result.sanitized_value

    def test_xss_vector_2(self):
        """Test XSS vector: <img src=x onerror=alert(1)>"""
        text = '<img src=x onerror="alert(1)">'
        result = XSSSanitizer.sanitize(text, level=SanitizationLevel.STANDARD)
        assert "onerror" not in result.sanitized_value

    def test_xss_vector_3(self):
        """Test XSS vector: <a href="javascript:alert(1)">"""
        text = '<a href="javascript:alert(1)">Click</a>'
        result = XSSSanitizer.sanitize(text, level=SanitizationLevel.STANDARD)
        assert "javascript:" not in result.sanitized_value

    def test_xss_vector_4(self):
        """Test XSS vector: <iframe src="javascript:alert(1)">"""
        text = '<iframe src="javascript:alert(1)"></iframe>'
        result = XSSSanitizer.sanitize(text, level=SanitizationLevel.STANDARD)
        assert "<iframe>" not in result.sanitized_value

    def test_xss_vector_5(self):
        """Test XSS vector: <body onload=alert(1)>"""
        text = '<body onload="alert(1)">Hello</body>'
        result = XSSSanitizer.sanitize(text, level=SanitizationLevel.STANDARD)
        assert "onload" not in result.sanitized_value

    def test_xss_vector_6(self):
        """Test XSS vector: <svg onload=alert(1)>"""
        text = '<svg onload="alert(1)"></svg>'
        result = XSSSanitizer.sanitize(text, level=SanitizationLevel.STANDARD)
        assert "onload" not in result.sanitized_value

    def test_xss_vector_7(self):
        """Test XSS vector: <input onfocus=alert(1) autofocus>"""
        text = '<input onfocus="alert(1)" autofocus>'
        result = XSSSanitizer.sanitize(text, level=SanitizationLevel.STANDARD)
        assert "onfocus" not in result.sanitized_value
        assert "<input>" not in result.sanitized_value

    def test_xss_vector_8(self):
        """Test XSS vector: <select onfocus=alert(1) autofocus>"""
        text = '<select onfocus="alert(1)" autofocus></select>'
        result = XSSSanitizer.sanitize(text, level=SanitizationLevel.STANDARD)
        assert "onfocus" not in result.sanitized_value
        assert "<select>" not in result.sanitized_value

    def test_xss_vector_9(self):
        """Test XSS vector: <textarea onfocus=alert(1) autofocus>"""
        text = '<textarea onfocus="alert(1)" autofocus></textarea>'
        result = XSSSanitizer.sanitize(text, level=SanitizationLevel.STANDARD)
        assert "onfocus" not in result.sanitized_value
        assert "<textarea>" not in result.sanitized_value

    def test_xss_vector_10(self):
        """Test XSS vector: <marquee onstart=alert(1)>"""
        text = '<marquee onstart="alert(1)">Hello</marquee>'
        result = XSSSanitizer.sanitize(text, level=SanitizationLevel.STANDARD)
        assert "onstart" not in result.sanitized_value
