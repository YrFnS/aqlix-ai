"""
MFA (Multi-Factor Authentication) Manager Service
Manages MFA setup, verification, and cultural timing considerations for Iraqi users
"""

from datetime import datetime, timedelta
from typing import Optional, Dict
from enum import Enum
from pydantic import BaseModel
import secrets
import hashlib
from uuid import uuid4


class MFAMethod(str, Enum):
    """MFA method types"""

    SMS = "sms"
    EMAIL = "email"
    CULTURAL_QUESTIONS = "cultural_questions"


class MFAFrequency(str, Enum):
    """MFA verification frequency"""

    EVERY_LOGIN = "every_login"
    NEW_DEVICE = "new_device"
    SUSPICIOUS_ACTIVITY = "suspicious_activity"
    PERIODIC = "periodic"


class MFASetupResult(BaseModel):
    """Result of MFA setup"""

    success: bool
    mfa_method: MFAMethod
    verification_id: Optional[str] = None
    verification_code: Optional[str] = (
        None  # Only for testing, never return in production
    )
    masked_destination: Optional[str] = None  # e.g., "***@***.com" or "+964***1234"
    expires_at: Optional[datetime] = None
    error_message: Optional[str] = None
    prayer_time_delay: Optional[str] = None


class MFAVerificationResult(BaseModel):
    """Result of MFA verification"""

    success: bool
    verification_id: str
    device_trusted: bool = False
    trust_token: Optional[str] = None
    trust_expires_at: Optional[datetime] = None
    error_message: Optional[str] = None
    attempts_remaining: int = 3


class DeviceTrustResult(BaseModel):
    """Result of device trust check"""

    is_trusted: bool
    device_id: Optional[str] = None
    trust_token: Optional[str] = None
    trust_expires_at: Optional[datetime] = None
    last_verified: Optional[datetime] = None


class MFAManager:
    """
    MFA Manager Service

    Manages multi-factor authentication with Iraqi cultural considerations:
    - Prayer time awareness for MFA prompts
    - SMS/Email verification with cultural timing
    - Cultural questions for additional verification
    - Device trust management
    - Adaptive MFA triggers
    """

    # Verification code settings
    CODE_LENGTH = 6
    CODE_EXPIRY_MINUTES = 10
    MAX_ATTEMPTS = 3

    # Device trust settings
    TRUST_DURATION_DAYS = 30

    @staticmethod
    def generate_verification_code(length: int = 6) -> str:
        """
        Generate secure random verification code

        Args:
            length: Code length (default 6)

        Returns:
            Numeric verification code
        """
        # Generate random number with specified length
        max_num = 10**length - 1
        min_num = 10 ** (length - 1)
        code = secrets.randbelow(max_num - min_num) + min_num
        return str(code).zfill(length)

    @staticmethod
    def hash_verification_code(code: str, verification_id: str) -> str:
        """
        Hash verification code for secure storage

        Args:
            code: Verification code
            verification_id: Unique verification ID

        Returns:
            Hashed code
        """
        data = f"{verification_id}:{code}"
        return hashlib.sha256(data.encode()).hexdigest()

    @staticmethod
    def mask_phone_number(phone: str) -> str:
        """
        Mask phone number for privacy

        Args:
            phone: Phone number (e.g., +9647701234567)

        Returns:
            Masked phone (e.g., +964***4567)
        """
        if len(phone) <= 4:
            return "***"

        return f"{phone[:4]}***{phone[-4:]}"

    @staticmethod
    def mask_email(email: str) -> str:
        """
        Mask email for privacy

        Args:
            email: Email address

        Returns:
            Masked email (e.g., u***@e***.com)
        """
        if "@" not in email:
            return "***@***.***"

        local, domain = email.split("@", 1)

        if "." not in domain:
            masked_domain = "***"
        else:
            domain_parts = domain.split(".")
            masked_domain = f"{domain_parts[0][0]}***.{domain_parts[-1]}"

        masked_local = f"{local[0]}***" if local else "***"

        return f"{masked_local}@{masked_domain}"

    @classmethod
    async def setup_mfa(
        cls,
        user_id: str,
        method: MFAMethod,
        destination: Optional[str] = None,
        respect_prayer_times: bool = True,
        cultural_timing_flexibility: int = 15,
        city: str = "baghdad",
    ) -> MFASetupResult:
        """
        Setup MFA for user

        Now uses Aladhan API for accurate prayer times

        Args:
            user_id: User ID
            method: MFA method (SMS, email, cultural questions)
            destination: Phone number or email for verification
            respect_prayer_times: Whether to respect prayer times
            cultural_timing_flexibility: Minutes of flexibility
            city: Iraqi city for prayer times (baghdad, basra, mosul, erbil)

        Returns:
            MFASetupResult with verification details
        """
        # Import here to avoid circular imports
        from .cultural_context_manager import CulturalContextManager

        # Check prayer time delay using Aladhan API
        should_delay, delay_reason = await CulturalContextManager.should_delay_mfa(
            respect_prayer_times=respect_prayer_times,
            cultural_timing_flexibility=cultural_timing_flexibility,
            city=city,
        )

        if should_delay:
            return MFASetupResult(
                success=False,
                mfa_method=method,
                error_message="MFA setup delayed due to cultural timing",
                prayer_time_delay=delay_reason,
            )

        # Validate destination for SMS/Email
        if method in [MFAMethod.SMS, MFAMethod.EMAIL]:
            if not destination:
                return MFASetupResult(
                    success=False,
                    mfa_method=method,
                    error_message=f"Destination required for {method.value} MFA",
                )

        # Generate verification code and ID
        verification_id = str(uuid4())
        verification_code = cls.generate_verification_code(cls.CODE_LENGTH)
        expires_at = datetime.now() + timedelta(minutes=cls.CODE_EXPIRY_MINUTES)

        # Hash code for storage (in production, store in database)
        hashed_code = cls.hash_verification_code(verification_code, verification_id)

        # Mask destination for privacy
        masked_destination = None
        if method == MFAMethod.SMS and destination:
            masked_destination = cls.mask_phone_number(destination)
        elif method == MFAMethod.EMAIL and destination:
            masked_destination = cls.mask_email(destination)

        # TODO: In production, store verification data in database
        # TODO: Send SMS/Email with verification code
        # TODO: For cultural questions, generate question set

        return MFASetupResult(
            success=True,
            mfa_method=method,
            verification_id=verification_id,
            verification_code=verification_code,  # Remove in production
            masked_destination=masked_destination,
            expires_at=expires_at,
        )

    @classmethod
    def verify_mfa_code(
        cls,
        verification_id: str,
        code: str,
        stored_hash: str,
        attempts_used: int = 0,
    ) -> MFAVerificationResult:
        """
        Verify MFA code

        Args:
            verification_id: Verification ID
            code: User-provided code
            stored_hash: Stored hashed code
            attempts_used: Number of attempts already used

        Returns:
            MFAVerificationResult with verification status
        """
        attempts_remaining = cls.MAX_ATTEMPTS - attempts_used

        if attempts_remaining <= 0:
            return MFAVerificationResult(
                success=False,
                verification_id=verification_id,
                error_message="Maximum verification attempts exceeded",
                attempts_remaining=0,
            )

        # Hash provided code
        provided_hash = cls.hash_verification_code(code, verification_id)

        if provided_hash != stored_hash:
            return MFAVerificationResult(
                success=False,
                verification_id=verification_id,
                error_message="Invalid verification code",
                attempts_remaining=attempts_remaining - 1,
            )

        # Verification successful
        return MFAVerificationResult(
            success=True,
            verification_id=verification_id,
            device_trusted=False,
            attempts_remaining=attempts_remaining,
        )

    @staticmethod
    def generate_device_trust_token() -> str:
        """
        Generate secure device trust token

        Returns:
            Secure random trust token
        """
        return secrets.token_urlsafe(32)

    @classmethod
    def trust_device(
        cls, user_id: str, device_id: str, trust_duration_days: int = 30
    ) -> DeviceTrustResult:
        """
        Trust a device for future logins

        Args:
            user_id: User ID
            device_id: Device ID
            trust_duration_days: Trust duration in days

        Returns:
            DeviceTrustResult with trust token
        """
        trust_token = cls.generate_device_trust_token()
        trust_expires_at = datetime.now() + timedelta(days=trust_duration_days)

        # TODO: In production, store device trust in database

        return DeviceTrustResult(
            is_trusted=True,
            device_id=device_id,
            trust_token=trust_token,
            trust_expires_at=trust_expires_at,
            last_verified=datetime.now(),
        )

    @staticmethod
    def check_device_trust(
        user_id: str, device_id: str, trust_token: Optional[str] = None
    ) -> DeviceTrustResult:
        """
        Check if device is trusted

        Args:
            user_id: User ID
            device_id: Device ID
            trust_token: Trust token to verify

        Returns:
            DeviceTrustResult with trust status
        """
        # TODO: In production, query database for device trust
        # This is a placeholder implementation

        return DeviceTrustResult(
            is_trusted=False,
            device_id=device_id,
        )

    @staticmethod
    def should_require_mfa(
        user_id: str,
        device_id: Optional[str] = None,
        trust_token: Optional[str] = None,
        mfa_frequency: MFAFrequency = MFAFrequency.EVERY_LOGIN,
        is_suspicious_activity: bool = False,
        last_login: Optional[datetime] = None,
    ) -> tuple[bool, str]:
        """
        Determine if MFA should be required

        Args:
            user_id: User ID
            device_id: Device ID
            trust_token: Device trust token
            mfa_frequency: MFA frequency setting
            is_suspicious_activity: Whether activity is suspicious
            last_login: Last login timestamp

        Returns:
            Tuple of (should_require_mfa, reason)
        """
        # Always require MFA for suspicious activity
        if is_suspicious_activity:
            return True, "Suspicious activity detected"

        # Check MFA frequency preference
        if mfa_frequency == MFAFrequency.EVERY_LOGIN:
            return True, "MFA required for every login"

        if mfa_frequency == MFAFrequency.NEW_DEVICE:
            # Check if device is trusted
            if not device_id or not trust_token:
                return True, "New device detected"

            device_trust = MFAManager.check_device_trust(
                user_id, device_id, trust_token
            )
            if not device_trust.is_trusted:
                return True, "Untrusted device"

            return False, "Trusted device"

        if mfa_frequency == MFAFrequency.SUSPICIOUS_ACTIVITY:
            # Only require MFA for suspicious activity (already checked above)
            return False, "No suspicious activity"

        if mfa_frequency == MFAFrequency.PERIODIC:
            # Require MFA if last login was more than 7 days ago
            if last_login:
                days_since_login = (datetime.now() - last_login).days
                if days_since_login > 7:
                    return True, "Periodic MFA verification (>7 days since last login)"

            return False, "Recent login verified"

        return True, "Default MFA policy"

    @staticmethod
    def get_cultural_question_categories() -> Dict:
        """
        Get cultural question categories for Iraqi context

        Returns:
            Dictionary of cultural question categories
        """
        return {
            "regional_knowledge": {
                "description": "Questions about Iraqi regions and geography",
                "examples": [
                    "Which Iraqi city is known as 'The City of Peace'?",
                    "What river flows through Baghdad?",
                ],
            },
            "cultural_practices": {
                "description": "Questions about Iraqi cultural practices",
                "examples": [
                    "What is the traditional Iraqi tea preparation method?",
                    "What is the significance of the date palm in Iraqi culture?",
                ],
            },
            "historical_knowledge": {
                "description": "Questions about Iraqi history",
                "examples": [
                    "Which ancient civilization flourished in Mesopotamia?",
                    "What is the historical name of Baghdad?",
                ],
            },
            "professional_context": {
                "description": "Questions about professional practices in Iraq",
                "examples": [
                    "What is the Iraqi Bar Association called in Arabic?",
                    "Which ministry oversees education in Iraq?",
                ],
            },
        }
