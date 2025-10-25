"""
Password Security Utilities
Secure password hashing and verification using bcrypt
"""

import re
from typing import Optional
import bcrypt
from pydantic import BaseModel


# Bcrypt configuration
BCRYPT_ROUNDS = 12  # Cost factor: higher = more secure but slower


class PasswordStrengthResult(BaseModel):
    """Password strength validation result"""

    is_valid: bool
    strength_score: int  # 0-100
    missing_requirements: list[str] = []
    suggestions: list[str] = []
    estimated_crack_time: str = ""


class PasswordUtils:
    """
    Password Security Utilities

    Provides secure password hashing, verification, and strength validation
    following OWASP password security guidelines.
    """

    # Password requirements
    MIN_LENGTH = 8
    MAX_LENGTH = 72  # Character limit (guidance, but bcrypt enforces bytes)
    MAX_BCRYPT_BYTES = 72  # Bcrypt enforces a strict 72-byte limit
    REQUIRE_UPPERCASE = True
    REQUIRE_LOWERCASE = True
    REQUIRE_DIGIT = True
    REQUIRE_SPECIAL = True

    # Special characters allowed
    SPECIAL_CHARS = r"!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?"

    @staticmethod
    def hash_password(password: str) -> str:
        """
        Hash a password using bcrypt with automatic salt generation

        Args:
            password: Plain text password to hash

        Returns:
            str: Bcrypt hash (60 characters, includes salt)

        Raises:
            ValueError: If password is empty or exceeds maximum length

        Example:
            >>> hashed = PasswordUtils.hash_password("MySecureP@ssw0rd")
            >>> print(len(hashed))  # 60 characters
            60
        """
        if not password:
            raise ValueError("Password cannot be empty")

        # Validate password byte length (bcrypt enforces 72-byte limit)
        password_bytes = password.encode("utf-8")
        if len(password_bytes) > PasswordUtils.MAX_BCRYPT_BYTES:
            raise ValueError(
                f"Password exceeds maximum length of {PasswordUtils.MAX_BCRYPT_BYTES} bytes"
            )

        # Hash password with automatic salt generation

        # Generate salt and hash
        salt = bcrypt.gensalt(rounds=BCRYPT_ROUNDS)
        hashed_bytes = bcrypt.hashpw(password_bytes, salt)

        # Return as string
        return hashed_bytes.decode("utf-8")

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """
        Verify a plain password against a bcrypt hash

        Args:
            plain_password: Plain text password provided by user
            hashed_password: Stored bcrypt hash from database

        Returns:
            bool: True if password matches hash, False otherwise

        Example:
            >>> hashed = PasswordUtils.hash_password("MyP@ssw0rd")
            >>> PasswordUtils.verify_password("MyP@ssw0rd", hashed)
            True
            >>> PasswordUtils.verify_password("WrongPassword", hashed)
            False
        """
        try:
            # Convert to bytes
            password_bytes = plain_password.encode("utf-8")
            hash_bytes = hashed_password.encode("utf-8")

            # Verify password
            return bcrypt.checkpw(password_bytes, hash_bytes)
        except Exception:
            # If hash format is invalid, return False instead of raising
            return False

    @staticmethod
    def validate_password_strength(password: str) -> PasswordStrengthResult:
        """
        Validate password strength against security requirements

        Checks:
        - Minimum length (8 characters)
        - Maximum length (128 characters)
        - Contains uppercase letter (A-Z)
        - Contains lowercase letter (a-z)
        - Contains digit (0-9)
        - Contains special character (!@#$%^&*()_+-=[]{}etc)
        - Not a common weak password

        Args:
            password: Password to validate

        Returns:
            PasswordStrengthResult with validation details

        Example:
            >>> result = PasswordUtils.validate_password_strength("weak")
            >>> print(result.is_valid)
            False
            >>> print(result.missing_requirements)
            ['At least 8 characters', 'At least one uppercase letter', ...]
        """
        missing_requirements = []
        suggestions = []
        strength_score = 0

        # Check length
        if len(password) < PasswordUtils.MIN_LENGTH:
            missing_requirements.append(
                f"At least {PasswordUtils.MIN_LENGTH} characters"
            )
        else:
            strength_score += 20

        # Check byte length (bcrypt enforces 72-byte limit)
        byte_len = len(password.encode("utf-8"))
        if byte_len > PasswordUtils.MAX_BCRYPT_BYTES:
            missing_requirements.append(
                f"Maximum {PasswordUtils.MAX_BCRYPT_BYTES} bytes (UTF-8 encoded)"
            )
            return PasswordStrengthResult(
                is_valid=False,
                strength_score=0,
                missing_requirements=missing_requirements,
                suggestions=[
                    f"Password exceeds {PasswordUtils.MAX_BCRYPT_BYTES} bytes when encoded. "
                    f"Multi-byte characters count as multiple bytes."
                ],
            )

        # Check for uppercase letters
        if PasswordUtils.REQUIRE_UPPERCASE and not re.search(r"[A-Z]", password):
            missing_requirements.append("At least one uppercase letter (A-Z)")
        else:
            strength_score += 20

        # Check for lowercase letters
        if PasswordUtils.REQUIRE_LOWERCASE and not re.search(r"[a-z]", password):
            missing_requirements.append("At least one lowercase letter (a-z)")
        else:
            strength_score += 20

        # Check for digits
        if PasswordUtils.REQUIRE_DIGIT and not re.search(r"\d", password):
            missing_requirements.append("At least one digit (0-9)")
        else:
            strength_score += 20

        # Check for special characters
        special_char_pattern = f"[{re.escape(PasswordUtils.SPECIAL_CHARS)}]"
        if PasswordUtils.REQUIRE_SPECIAL and not re.search(
            special_char_pattern, password
        ):
            missing_requirements.append(
                f"At least one special character ({PasswordUtils.SPECIAL_CHARS[:20]}...)"
            )
        else:
            strength_score += 20

        # Bonus points for length
        if len(password) >= 12:
            strength_score = min(strength_score + 10, 100)
        if len(password) >= 16:
            strength_score = min(strength_score + 10, 100)

        # Check against common weak passwords (all lowercase for comparison)
        weak_passwords = {
            "password",
            "password123",
            "12345678",
            "qwerty",
            "abc123",
            "letmein",
            "welcome",
            "admin123",
            "password1",
            "p@ssw0rd",  # Common variation
            "p@ssword1",  # Common variation
        }

        if password.lower() in weak_passwords:
            missing_requirements.append("Password is too common")
            strength_score = max(strength_score - 30, 0)
            suggestions.append("Avoid common passwords")

        # Generate suggestions
        if len(password) < 12:
            suggestions.append(
                "Consider using at least 12 characters for better security"
            )

        if missing_requirements:
            suggestions.append(
                "Use a mix of uppercase, lowercase, numbers, and symbols"
            )

        # Estimate crack time (very simplified)
        if strength_score >= 80:
            estimated_crack_time = "Centuries (very strong)"
        elif strength_score >= 60:
            estimated_crack_time = "Years (strong)"
        elif strength_score >= 40:
            estimated_crack_time = "Months (moderate)"
        elif strength_score >= 20:
            estimated_crack_time = "Days (weak)"
        else:
            estimated_crack_time = "Minutes (very weak)"

        is_valid = len(missing_requirements) == 0

        return PasswordStrengthResult(
            is_valid=is_valid,
            strength_score=strength_score,
            missing_requirements=missing_requirements,
            suggestions=suggestions,
            estimated_crack_time=estimated_crack_time,
        )

    @staticmethod
    def needs_rehash(hashed_password: str) -> bool:
        """
        Check if a password hash needs to be rehashed

        This is useful for upgrading password hashes when:
        - Bcrypt cost factor is increased
        - Hash algorithm is upgraded

        Args:
            hashed_password: Existing bcrypt hash from database

        Returns:
            bool: True if hash should be regenerated, False otherwise

        Example:
            >>> old_hash = "$2b$10$..." # Old hash with cost factor 10
            >>> PasswordUtils.needs_rehash(old_hash)
            True  # Current cost factor is 12
        """
        try:
            # Parse the hash to check cost factor
            # Format: $2b$XX$...
            parts = hashed_password.split("$")
            if len(parts) >= 3:
                current_cost = int(parts[2])
                return current_cost < BCRYPT_ROUNDS

            return False
        except Exception:
            # If we can't parse, assume it doesn't need rehash
            return False
