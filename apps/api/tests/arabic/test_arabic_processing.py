"""
Arabic text processing tests for Iraqi AI Chat System
Tests RTL text handling, Iraqi dialect recognition, and mixed language support
"""

from typing import List, Dict, Any


class TestArabicProcessing:
    """Test Arabic text processing capabilities"""

    def test_rtl_text_detection(self):
        """Test detection of RTL Arabic text"""
        arabic_texts = [
            "مرحباً بكم في النظام",
            "السلام عليكم ورحمة الله",
            "أهلاً وسهلاً",
            "شكراً جزيلاً",
        ]

        for text in arabic_texts:
            result = self.detect_text_direction(text)
            assert result["direction"] == "rtl"
            assert result["is_arabic"] is True

    def test_iraqi_dialect_recognition(self):
        """Test recognition of Iraqi Arabic dialect"""
        iraqi_phrases = [
            "شلونك اليوم؟",  # How are you today?
            "شكو ماكو؟",  # What's up?
            "وين رايح؟",  # Where are you going?
            "هاي شسمها؟",  # What is this called?
            "كلش زين",  # Very good
            "ماكو مشكلة",  # No problem
        ]

        for phrase in iraqi_phrases:
            result = self.detect_dialect(phrase)
            assert result["dialect"] == "iraqi"
            assert result["confidence"] >= 0.8

    def test_standard_arabic_recognition(self):
        """Test recognition of Standard Arabic"""
        standard_phrases = [
            "أهلاً وسهلاً بكم",
            "نحن سعداء لخدمتكم",
            "شكراً لكم على الزيارة",
            "مع تحياتنا الطيبة",
        ]

        for phrase in standard_phrases:
            result = self.detect_dialect(phrase)
            assert result["dialect"] == "standard"
            assert result["confidence"] >= 0.7

    def test_mixed_language_processing(self):
        """Test processing of mixed Arabic-English text"""
        mixed_texts = [
            "مرحباً Hello العالم World",
            "اسمي Ahmed وأنا من Baghdad",
            "التاريخ اليوم هو January 15, 2025",
            "رقم الهاتف: +964 123 456 789",
        ]

        for text in mixed_texts:
            result = self.process_mixed_text(text)
            assert result["has_arabic"] is True
            assert result["has_english"] is True
            assert result["mixed_language"] is True

    def test_arabic_number_processing(self):
        """Test processing of Arabic and English numerals"""
        test_cases = [
            {
                "text": "الرقم هو ١٢٣٤٥",
                "expected_arabic_nums": ["١", "٢", "٣", "٤", "٥"],
                "expected_english_nums": [],
            },
            {
                "text": "The number is 12345",
                "expected_arabic_nums": [],
                "expected_english_nums": ["1", "2", "3", "4", "5"],
            },
            {
                "text": "مختلط ١٢٣ and 456",
                "expected_arabic_nums": ["١", "٢", "٣"],
                "expected_english_nums": ["4", "5", "6"],
            },
        ]

        for case in test_cases:
            result = self.extract_numbers(case["text"])
            assert result["arabic_numbers"] == case["expected_arabic_nums"]
            assert result["english_numbers"] == case["expected_english_nums"]

    def test_text_normalization(self):
        """Test Arabic text normalization"""
        normalization_cases = [
            {
                "input": "الأردن",
                "normalized": "الاردن",  # Remove diacritics
                "preserve_meaning": True,
            },
            {"input": "مُحَمَّد", "normalized": "محمد", "preserve_meaning": True},
        ]

        for case in normalization_cases:
            result = self.normalize_arabic_text(case["input"])
            assert result["normalized"] == case["normalized"]
            assert result["preserve_meaning"] == case["preserve_meaning"]

    def test_word_segmentation(self):
        """Test Arabic word segmentation"""
        test_sentences = [
            "أهلاً وسهلاً بكم في العراق",
            "شلونك اليوم حبيبي؟",
            "كيف الصحة والعافية؟",
        ]

        for sentence in test_sentences:
            result = self.segment_arabic_words(sentence)
            assert len(result["words"]) > 0
            assert all(isinstance(word, str) for word in result["words"])

    def test_sentence_boundary_detection(self):
        """Test detection of sentence boundaries in Arabic text"""
        text = "مرحباً بكم. كيف حالكم اليوم؟ نتمنى لكم يوماً سعيداً."
        result = self.detect_sentence_boundaries(text)

        expected_sentences = ["مرحباً بكم.", "كيف حالكم اليوم؟", "نتمنى لكم يوماً سعيداً."]

        assert len(result["sentences"]) == 3
        assert result["sentences"] == expected_sentences

    def test_arabic_text_validation(self):
        """Test validation of Arabic text input"""
        valid_texts = [
            "نص عربي صحيح",
            "١٢٣ أرقام عربية",
            "مرحباً Hello",  # Mixed is valid
        ]

        invalid_texts = [
            "",  # Empty
            "   ",  # Whitespace only
            "!@#$%",  # Only special characters
        ]

        for text in valid_texts:
            result = self.validate_arabic_text(text)
            assert result["is_valid"] is True

        for text in invalid_texts:
            result = self.validate_arabic_text(text)
            assert result["is_valid"] is False

    def test_rtl_layout_preparation(self):
        """Test preparation of text for RTL layout"""
        text = "مرحباً Hello العالم 123 ١٢٣"
        result = self.prepare_rtl_layout(text)

        assert result["direction"] == "rtl"
        assert result["alignment"] == "right"
        assert "segments" in result
        assert len(result["segments"]) > 0

    # Mock helper methods (in real implementation, these would call actual services)

    def detect_text_direction(self, text: str) -> Dict[str, Any]:
        """Mock text direction detection"""
        has_arabic = any("\u0600" <= char <= "\u06ff" for char in text)
        return {
            "direction": "rtl" if has_arabic else "ltr",
            "is_arabic": has_arabic,
            "confidence": 0.95 if has_arabic else 0.95,
        }

    def detect_dialect(self, text: str) -> Dict[str, Any]:
        """Mock dialect detection"""
        iraqi_words = ["شلونك", "شكو", "ماكو", "وين", "هاي", "كلش"]
        has_iraqi = any(word in text for word in iraqi_words)

        return {
            "dialect": "iraqi" if has_iraqi else "standard",
            "confidence": 0.9 if has_iraqi else 0.8,
            "detected_words": [w for w in iraqi_words if w in text],
        }

    def process_mixed_text(self, text: str) -> Dict[str, Any]:
        """Mock mixed language processing"""
        has_arabic = any("\u0600" <= char <= "\u06ff" for char in text)
        has_english = any(char.isascii() and char.isalpha() for char in text)

        return {
            "has_arabic": has_arabic,
            "has_english": has_english,
            "mixed_language": has_arabic and has_english,
            "primary_language": "arabic" if has_arabic else "english",
        }

    def extract_numbers(self, text: str) -> Dict[str, List[str]]:
        """Mock number extraction"""
        arabic_digits = "٠١٢٣٤٥٦٧٨٩"
        english_digits = "0123456789"

        arabic_numbers = [char for char in text if char in arabic_digits]
        english_numbers = [char for char in text if char in english_digits]

        return {"arabic_numbers": arabic_numbers, "english_numbers": english_numbers}

    def normalize_arabic_text(self, text: str) -> Dict[str, Any]:
        """Mock text normalization"""
        # Simple normalization (remove common diacritics)
        normalized = text.replace("ً", "").replace("ٌ", "").replace("ٍ", "")
        normalized = normalized.replace("َ", "").replace("ُ", "").replace("ِ", "")

        return {
            "normalized": normalized,
            "preserve_meaning": True,
            "changes_made": len(text) != len(normalized),
        }

    def segment_arabic_words(self, text: str) -> Dict[str, Any]:
        """Mock word segmentation"""
        # Simple whitespace-based segmentation
        words = text.strip().split()
        return {"words": words, "count": len(words)}

    def detect_sentence_boundaries(self, text: str) -> Dict[str, Any]:
        """Mock sentence boundary detection"""
        # Simple punctuation-based splitting
        import re

        sentences = re.split(r"[.!?]+", text)
        sentences = [
            s.strip()
            + next(iter(re.findall(r"[.!?]+", text[text.find(s) + len(s) :])), "")
            for s in sentences
            if s.strip()
        ]

        return {"sentences": sentences, "count": len(sentences)}

    def validate_arabic_text(self, text: str) -> Dict[str, Any]:
        """Mock text validation"""
        is_valid = bool(text.strip()) and not text.strip().isspace()

        return {
            "is_valid": is_valid,
            "length": len(text),
            "has_content": bool(text.strip()),
        }

    def prepare_rtl_layout(self, text: str) -> Dict[str, Any]:
        """Mock RTL layout preparation"""
        has_arabic = any("\u0600" <= char <= "\u06ff" for char in text)

        return {
            "direction": "rtl" if has_arabic else "ltr",
            "alignment": "right" if has_arabic else "left",
            "segments": text.split(),
            "requires_bidi": has_arabic and any(char.isascii() for char in text),
        }
