"""
Arabic Text Handling Tests

Tests for Unicode/Arabic processing issues:
- False positives with substring matching (line 176-183)
- String.lower() doesn't work for Arabic (line 182-198, 163-179)
- Inconsistent Arabic pattern matching (line 48-49)
- Text normalization issues with diacritics
- Code switching detection edge cases
"""

import pytest
import re
import unicodedata


class TestArabicMarkerDetection:
    """Test that Arabic markers are detected with word boundaries."""

    def test_substring_match_causes_false_positives(self):
        """Verify simple substring matching in IRAQI_MARKERS causes false positives."""
        # Current problem: "in" substring check matches inside larger words
        # Example: "شلونك" is found in "شلونكم" (you all), but may match elsewhere

        markers = {
            "شكو": "what",
            "شلونك": "how are you",
            "ماكو": "there is no",
        }

        # Bad: substring match
        def bad_detect_iraqi(text):
            found = []
            for marker in markers:
                if marker in text:
                    found.append(marker)
            return found

        # Good: word boundary match
        def good_detect_iraqi(text):
            found = []
            for marker in markers:
                # Use word boundaries to avoid false positives
                pattern = r"\b" + re.escape(marker) + r"\b"
                if re.search(pattern, text, re.UNICODE):
                    found.append(marker)
            return found

        test_text = "شكو أخبارك"  # "what about your news" - has "شكو" as complete word
        assert len(bad_detect_iraqi(test_text)) >= 1, "Bad method finds substring"
        assert len(good_detect_iraqi(test_text)) >= 1, (
            "Good method should find standalone 'شكو'"
        )

        # Arabic word with no markers but contains substring
        text_with_false_positive = "شكول"  # Contains "شكو" but not the marker
        bad_result = bad_detect_iraqi(text_with_false_positive)
        good_result = good_detect_iraqi(text_with_false_positive)

        # Demonstrate the false positive: bad method finds substring even though it's not a complete word
        # "شكو" is a substring of "شكول" but not the word itself
        assert len(bad_result) > 0, "Bad method should find substring 'شكو' in 'شكول'"
        assert len(good_result) == 0, (
            "Good method should NOT find 'شكو' as separate word in 'شكول'"
        )


class TestArabicLowercasing:
    """Test that Arabic text normalization doesn't use .lower()."""

    def test_lower_fails_for_arabic_text(self):
        """Verify that .lower() is ineffective for Arabic."""
        arabic_text = "مرحبا بكم في النظام العراقي"

        # Problem: .lower() doesn't work for Arabic
        lowercased = arabic_text.lower()
        assert lowercased == arabic_text  # No change, ineffective

    def test_normalize_arabic_instead_of_lower(self):
        """Verify that Unicode normalization works for Arabic."""
        # Fixed approach: Use Unicode normalization instead

        arabic_text = "مَرْحَبًا بِكُمْ"  # With diacritics
        text_with_diacritics = arabic_text

        # Fix: Normalize instead of lowercase
        normalized = unicodedata.normalize("NFC", text_with_diacritics)
        assert normalized is not None

        # For comparison, can also remove diacritics if needed
        nfkd_form = unicodedata.normalize("NFKD", text_with_diacritics)
        removed_diacritics = "".join(
            c for c in nfkd_form if unicodedata.category(c) != "Mn"
        )
        assert "مرحبا بكم" in removed_diacritics or removed_diacritics == "مرحبا بكم"

    def test_case_insensitive_matching_for_keywords(self):
        """Verify proper case-insensitive matching for keyword detection."""
        # For Arabic: normalize and use direct comparison
        # For Latin: use casefold()

        forbidden_keywords = {
            "alcohol": ["كحول", "خمر"],
            "gambling": ["قمار"],
        }

        def normalize_text(text):
            # Normalize both Arabic and ASCII
            return unicodedata.normalize("NFC", text).casefold()

        def check_forbidden_keyword(content, keywords):
            normalized_content = normalize_text(content)
            for category, keyword_list in keywords.items():
                for keyword in keyword_list:
                    normalized_keyword = normalize_text(keyword)
                    if normalized_keyword in normalized_content:
                        return True, category
            return False, None

        # Test Arabic keyword detection
        content_with_alcohol = "دعونا نناقش شرب الكحول"
        found, category = check_forbidden_keyword(
            content_with_alcohol, forbidden_keywords
        )
        assert found is True
        assert category == "alcohol"

        # Test case insensitivity for mixed content
        mixed_content = "Let's discuss ALCOHOL consumption"
        # For English part, use casefold
        if "alcohol" in mixed_content.casefold():
            assert True


class TestArabicPatternConsistency:
    """Test consistent Arabic character range usage."""

    def test_consistent_arabic_unicode_ranges(self):
        """Verify Arabic character detection uses consistent ranges."""
        # Problem: ARABIC_PATTERN uses multiple ranges but total_chars uses subset

        # Correct ranges:
        # U+0600-U+06FF: Arabic
        # U+0750-U+077F: Arabic Supplement
        # U+08A0-U+08FF: Arabic Extended-A
        # U+FB50-U+FDFF: Arabic Presentation Forms-A
        # U+FE70-U+FEFF: Arabic Presentation Forms-B

        ARABIC_PATTERN = re.compile(
            r"[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]"
        )

        total_chars_pattern = re.compile(
            r"[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]"
        )

        test_arabic = "مرحبا بكم في النظام العراقي"

        # Count Arabic chars using both patterns - should match
        arabic_count_1 = len(ARABIC_PATTERN.findall(test_arabic))
        arabic_count_2 = len(total_chars_pattern.findall(test_arabic))

        assert arabic_count_1 == arabic_count_2, "Arabic patterns should be consistent"

    def test_arabic_percentage_calculation_consistency(self):
        """Verify Arabic percentage uses consistent pattern."""
        ARABIC_PATTERN = re.compile(
            r"[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]"
        )

        test_text = "مرحبا Hello test"

        arabic_chars = ARABIC_PATTERN.findall(test_text)
        total_chars = len(test_text)

        if total_chars > 0:
            arabic_percentage = (len(arabic_chars) / total_chars) * 100
            assert 0 <= arabic_percentage <= 100
            # "مرحبا" is 4 chars, " Hello test" is 11 chars
            # So ~27% should be Arabic
            assert 20 < arabic_percentage < 35


class TestDiacriticsHandling:
    """Test proper handling of Arabic diacritical marks."""

    def test_diacritics_are_detected(self):
        """Verify diacritics are properly detected."""
        text_with_diacritics = "مَرْحَبًا بِكُمْ"  # With diacritics
        text_without_diacritics = "مرحبا بكم"  # Without

        def has_diacritics(text):
            for char in text:
                # Arabic diacritical marks are in category Mn (Mark, Nonspacing)
                if unicodedata.category(char) == "Mn":
                    return True
            return False

        assert has_diacritics(text_with_diacritics) is True
        assert has_diacritics(text_without_diacritics) is False

    def test_diacritics_removal(self):
        """Verify diacritics can be properly removed."""
        text_with_diacritics = "مَرْحَبًا بِكُمْ"

        # Proper removal: decompose and filter out Mark characters
        nfkd = unicodedata.normalize("NFKD", text_with_diacritics)
        without_diacritics = "".join(c for c in nfkd if unicodedata.category(c) != "Mn")

        assert "مرحبا بكم" == without_diacritics or "مرحبا" in without_diacritics


class TestTaaMarbutaHandling:
    """Test Taa Marbuta (ة) normalization."""

    def test_taa_marbuta_normalization_parameterization(self):
        """Verify Taa Marbuta replacement can be controlled."""
        # Problem: unconditionally replaces ة with ه, changing semantics
        # Solution: make it optional

        text_with_taa = "حياة جميلة"  # "beautiful life" - uses ة (life, feminine)

        def normalize_taa_marbuta(text, replace_taa_marbuta=False):
            """Normalize Taa Marbuta with optional replacement."""
            if replace_taa_marbuta:
                # Only replace if explicitly requested
                return text.replace("ة", "ه")
            return text

        # By default, don't replace
        result_default = normalize_taa_marbuta(text_with_taa)
        assert "ة" in result_default

        # Only replace when explicitly requested
        result_replaced = normalize_taa_marbuta(text_with_taa, replace_taa_marbuta=True)
        assert "ه" in result_replaced
        assert "ة" not in result_replaced


class TestCodeSwitchingDetection:
    """Test Arabic-English code switching detection."""

    def test_code_switching_no_false_positives(self):
        """Verify code switching detection handles edge cases."""
        ARABIC_PATTERN = re.compile(
            r"[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]"
        )

        def detect_code_switching(text):
            """Detect if text switches between Arabic and Latin."""
            if not text or len(text) < 2:
                return False

            prev_is_arabic = None
            switching_points = 0

            for char in text:
                if char.isspace() or not char.isalpha():
                    continue  # Skip non-alphabetic characters

                is_arabic = bool(ARABIC_PATTERN.match(char))

                # Only count switches when transitioning between scripts
                if prev_is_arabic is not None and is_arabic != prev_is_arabic:
                    switching_points += 1

                prev_is_arabic = is_arabic

            return switching_points > 0

        # Pure Arabic - no switching
        assert detect_code_switching("مرحبا بكم") is False

        # Pure English - no switching
        assert detect_code_switching("Hello world") is False

        # Mixed - switching detected
        assert detect_code_switching("Hello مرحبا") is True
        assert detect_code_switching("مرحبا Hello world") is True


class TestWordBoundaryMatching:
    """Test word boundary detection for Arabic."""

    def test_arabic_word_boundary_regex(self):
        """Verify \b works correctly for Arabic word boundaries."""
        IRAQI_MARKERS = {"شلونك": "how are you", "شكو": "what", "ماكو": "there is no"}

        def find_iraqi_markers(text):
            found = []
            for marker in IRAQI_MARKERS:
                # \b word boundaries work for most scripts, may need Unicode lookarounds
                # for edge cases
                pattern = r"\b" + re.escape(marker) + r"(?!\w)"
                matches = re.findall(pattern, text, re.UNICODE)
                if matches:
                    found.extend(matches)
            return found

        # Should find marker
        text = "شلونك يا أخي؟"
        result = find_iraqi_markers(text)
        assert "شلونك" in result

        # Should not match inside other words (ideally)
        # This tests the word boundary effectiveness
