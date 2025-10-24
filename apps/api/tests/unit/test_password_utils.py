"""
Unit tests for password security utilities
Tests password hashing, verification, and strength validation
"""

import sys
import os
import pytest

# Add parent directory to path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

# Import directly from the module file
import importlib.util

spec = importlib.util.spec_from_file_location(
    "password_utils",
    os.path.join(os.path.dirname(__file__), "../../services/password_utils.py"),
)
password_utils = importlib.util.module_from_spec(spec)
spec.loader.exec_module(password_utils)

PasswordUtils = password_utils.PasswordUtils
PasswordStrengthResult = password_utils.PasswordStrengthResult


class TestPasswordHashing:
    """Test password hashing functionality"""

    def test_hash_password_creates_valid_hash(self):
        """Test that hash_password creates a valid bcrypt hash"""
        password = "MySecureP@ssw0rd123"
        hashed = PasswordUtils.hash_password(password)

        # Bcrypt hashes are 60 characters long
        assert len(hashed) == 60
        # Bcrypt hashes start with $2b$ (or $2a$ in some versions)
        assert hashed.startswith("$2b$") or hashed.startswith("$2a$")

    def test_hash_password_generates_unique_salts(self):
        """Test that same password produces different hashes (different salts)"""
        password = "TestP@ssw0rd123"
        hash1 = PasswordUtils.hash_password(password)
        hash2 = PasswordUtils.hash_password(password)

        # Same password should produce different hashes due to different salts
        assert hash1 != hash2

    def test_hash_password_rejects_empty_password(self):
        """Test that empty password raises ValueError"""
        with pytest.raises(ValueError, match="Password cannot be empty"):
            PasswordUtils.hash_password("")

    def test_hash_password_rejects_too_long_password(self):
        """Test that password exceeding max length raises ValueError"""
        long_password = "a" * 73  # Max is 72 for bcrypt
        with pytest.raises(ValueError, match="exceeds maximum length"):
            PasswordUtils.hash_password(long_password)

    def test_hash_password_accepts_max_length(self):
        """Test that password at max length is accepted"""
        max_length_password = "a" * 72  # Bcrypt limit is 72 bytes
        hashed = PasswordUtils.hash_password(max_length_password)
        assert len(hashed) == 60


class TestPasswordVerification:
    """Test password verification functionality"""

    def test_verify_password_accepts_correct_password(self):
        """Test that correct password is verified successfully"""
        password = "CorrectP@ssw0rd123"
        hashed = PasswordUtils.hash_password(password)

        assert PasswordUtils.verify_password(password, hashed) is True

    def test_verify_password_rejects_incorrect_password(self):
        """Test that incorrect password is rejected"""
        password = "CorrectP@ssw0rd123"
        wrong_password = "WrongP@ssw0rd456"
        hashed = PasswordUtils.hash_password(password)

        assert PasswordUtils.verify_password(wrong_password, hashed) is False

    def test_verify_password_case_sensitive(self):
        """Test that password verification is case-sensitive"""
        password = "MyPassword123!"
        hashed = PasswordUtils.hash_password(password)

        assert PasswordUtils.verify_password("mypassword123!", hashed) is False
        assert PasswordUtils.verify_password("MYPASSWORD123!", hashed) is False

    def test_verify_password_handles_invalid_hash(self):
        """Test that invalid hash format returns False instead of raising"""
        password = "TestP@ssw0rd123"
        invalid_hash = "not-a-valid-hash"

        # Should return False, not raise exception
        assert PasswordUtils.verify_password(password, invalid_hash) is False

    def test_verify_password_with_special_characters(self):
        """Test password verification with special characters"""
        password = "P@$$w0rd!#%&*()_+-=[]{}|;:',.<>/?"
        hashed = PasswordUtils.hash_password(password)

        assert PasswordUtils.verify_password(password, hashed) is True

    def test_verify_password_with_unicode(self):
        """Test password verification with Unicode characters"""
        password = "مرحبا123!@#"  # Arabic + numbers + symbols
        hashed = PasswordUtils.hash_password(password)

        assert PasswordUtils.verify_password(password, hashed) is True


class TestPasswordStrengthValidation:
    """Test password strength validation"""

    def test_strong_password_passes_validation(self):
        """Test that strong password passes all requirements"""
        password = "StrongP@ssw0rd123"
        result = PasswordUtils.validate_password_strength(password)

        assert result.is_valid is True
        assert result.strength_score >= 80
        assert len(result.missing_requirements) == 0

    def test_weak_password_fails_validation(self):
        """Test that weak password fails validation"""
        password = "weak"
        result = PasswordUtils.validate_password_strength(password)

        assert result.is_valid is False
        assert result.strength_score < 50
        assert len(result.missing_requirements) > 0

    def test_minimum_length_requirement(self):
        """Test minimum length requirement (8 characters)"""
        short_password = "Abc1@"  # Only 5 characters
        result = PasswordUtils.validate_password_strength(short_password)

        assert result.is_valid is False
        assert any("8 characters" in req for req in result.missing_requirements)

    def test_uppercase_requirement(self):
        """Test uppercase letter requirement"""
        no_uppercase = "mypassw0rd!@"
        result = PasswordUtils.validate_password_strength(no_uppercase)

        assert result.is_valid is False
        assert any("uppercase" in req.lower() for req in result.missing_requirements)

    def test_lowercase_requirement(self):
        """Test lowercase letter requirement"""
        no_lowercase = "MYPASSW0RD!@"
        result = PasswordUtils.validate_password_strength(no_lowercase)

        assert result.is_valid is False
        assert any("lowercase" in req.lower() for req in result.missing_requirements)

    def test_digit_requirement(self):
        """Test digit requirement"""
        no_digit = "MyPassword!@#"
        result = PasswordUtils.validate_password_strength(no_digit)

        assert result.is_valid is False
        assert any("digit" in req.lower() for req in result.missing_requirements)

    def test_special_character_requirement(self):
        """Test special character requirement"""
        no_special = "MyPassword123"
        result = PasswordUtils.validate_password_strength(no_special)

        assert result.is_valid is False
        assert any("special" in req.lower() for req in result.missing_requirements)

    def test_maximum_length_rejection(self):
        """Test that password exceeding max length is rejected"""
        too_long = "a" * 73  # Max is 72 for bcrypt
        result = PasswordUtils.validate_password_strength(too_long)

        assert result.is_valid is False
        assert any("Maximum" in req for req in result.missing_requirements)

    def test_common_weak_passwords_rejected(self):
        """Test that common weak passwords are rejected"""
        weak_passwords = [
            "password",  # Missing uppercase, digit, special
            "password123",  # Missing uppercase, special
            "12345678",  # Missing uppercase, lowercase, special
            "Password1",  # Missing special (but this one is flagged as common)
            "P@ssw0rd",  # This one is flagged as common
        ]

        for password in weak_passwords:
            result = PasswordUtils.validate_password_strength(password)
            # Password1 and P@ssw0rd have good structure but are flagged as common
            # Others fail requirements
            is_weak = (
                result.strength_score < 80  # Not strong enough
                or any(
                    "common" in req.lower() for req in result.missing_requirements
                )  # Flagged as common
                or len(result.missing_requirements) > 0  # Failed requirements
            )
            assert is_weak, (
                f"Password '{password}' should be rejected but scored {result.strength_score}"
            )

    def test_length_bonus_scoring(self):
        """Test that longer passwords get bonus points"""
        password_12_chars = "MyP@ssw0rd12"  # 12 characters
        password_16_chars = "MyP@ssw0rd123456"  # 16 characters

        result_12 = PasswordUtils.validate_password_strength(password_12_chars)
        result_16 = PasswordUtils.validate_password_strength(password_16_chars)

        # Longer password should have higher or equal score
        assert result_16.strength_score >= result_12.strength_score

    def test_strength_result_includes_suggestions(self):
        """Test that validation result includes helpful suggestions"""
        password = "short1!"
        result = PasswordUtils.validate_password_strength(password)

        assert len(result.suggestions) > 0
        assert any(isinstance(suggestion, str) for suggestion in result.suggestions)

    def test_strength_result_includes_estimated_crack_time(self):
        """Test that validation result includes crack time estimate"""
        password = "VeryStr0ng!P@ssw0rd123"
        result = PasswordUtils.validate_password_strength(password)

        assert result.estimated_crack_time != ""
        assert isinstance(result.estimated_crack_time, str)

    def test_all_requirements_met_password(self):
        """Test comprehensive password meeting all requirements"""
        password = "MyC0mpl3x!P@ssw0rd"
        result = PasswordUtils.validate_password_strength(password)

        assert result.is_valid is True
        assert len(result.missing_requirements) == 0
        assert result.strength_score >= 80
        assert (
            "very strong" in result.estimated_crack_time.lower()
            or "strong" in result.estimated_crack_time.lower()
        )


class TestPasswordHashRehashing:
    """Test password hash rehashing functionality"""

    def test_needs_rehash_with_current_hash(self):
        """Test needs_rehash with current hash format"""
        password = "TestP@ssw0rd123"
        hashed = PasswordUtils.hash_password(password)

        # Hash just created with current settings should not need rehash
        assert PasswordUtils.needs_rehash(hashed) is False

    def test_needs_rehash_with_old_cost_factor(self):
        """Test needs_rehash detects old cost factor (if configurable)"""
        # This test assumes we might have old hashes with lower cost factors
        # In practice, this would require having an actual old hash
        # For now, we just test the function exists and works with current hashes
        password = "TestP@ssw0rd123"
        hashed = PasswordUtils.hash_password(password)

        # Should return boolean
        result = PasswordUtils.needs_rehash(hashed)
        assert isinstance(result, bool)


class TestPasswordUtilsIntegration:
    """Integration tests for password utilities"""

    def test_complete_registration_flow(self):
        """Test complete password flow: validate strength, hash, verify"""
        # Step 1: User provides password
        user_password = "MyNewSecureP@ssw0rd123"

        # Step 2: Validate password strength
        strength_result = PasswordUtils.validate_password_strength(user_password)
        assert strength_result.is_valid is True

        # Step 3: Hash password for storage
        hashed_password = PasswordUtils.hash_password(user_password)
        assert len(hashed_password) == 60

        # Step 4: Later, verify password on login
        is_correct = PasswordUtils.verify_password(user_password, hashed_password)
        assert is_correct is True

        # Step 5: Wrong password should fail
        is_wrong = PasswordUtils.verify_password("WrongPassword!", hashed_password)
        assert is_wrong is False

    def test_multiple_users_same_password(self):
        """Test that multiple users can use same password but get different hashes"""
        password = "CommonP@ssw0rd123"

        # User 1 registers
        user1_hash = PasswordUtils.hash_password(password)

        # User 2 registers with same password
        user2_hash = PasswordUtils.hash_password(password)

        # Hashes should be different (different salts)
        assert user1_hash != user2_hash

        # But both should verify correctly
        assert PasswordUtils.verify_password(password, user1_hash) is True
        assert PasswordUtils.verify_password(password, user2_hash) is True

    def test_iraqi_context_passwords(self):
        """Test passwords with Iraqi/Arabic context"""
        # Password with Arabic characters
        arabic_password = "مرحبا2025!@#"
        strength = PasswordUtils.validate_password_strength(arabic_password)
        # Should still validate (Unicode supported)
        assert isinstance(strength, PasswordStrengthResult)

        # Hash and verify
        hashed = PasswordUtils.hash_password(arabic_password)
        assert PasswordUtils.verify_password(arabic_password, hashed) is True
