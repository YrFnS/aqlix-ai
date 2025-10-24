"""
MFA Enforcement Service
Manages MFA enforcement logic and policy compliance for Iraqi AI Chat System
"""

from datetime import datetime, timedelta
from typing import Optional, Tuple
from pydantic import BaseModel

from .mfa_manager import MFAMethod, MFAFrequency, MFASetupResult, MFAVerificationResult


class MFAEnforcementConfig(BaseModel):
    """MFA enforcement configuration"""

    max_verification_attempts: int = 3
    code_expiry_minutes: int = 10
    require_mfa_for_sensitive_operations: bool = True
    allow_trusted_device_skip: bool = True
    periodic_reverification_days: int = 7


class MFAEnforcementStatus(BaseModel):
    """MFA enforcement status for user session"""

    mfa_required: bool
    mfa_enforced: bool  # Whether MFA is actively enforced (not skippable)
    reason: str
    can_skip: bool = False  # Whether user can skip MFA (e.g., trusted device)
    skip_reason: Optional[str] = None


class MFAEnforcementResult(BaseModel):
    """Result of MFA enforcement check"""

    should_enforce: bool
    enforcement_reason: str
    mfa_method: Optional[MFAMethod] = None
    can_skip: bool = False
    skip_reason: Optional[str] = None
    metadata: dict = {}


class MFAEnforcementManager:
    """
    MFA Enforcement Manager

    Enforces MFA policies for authentication and sensitive operations:
    - Check if MFA should be enforced based on user settings
    - Enforce MFA for specific operation types
    - Manage MFA bypass for trusted devices
    - Track MFA enforcement compliance
    - Support prayer time flexibility
    """

    # Default configuration
    DEFAULT_CONFIG = MFAEnforcementConfig()

    @staticmethod
    def should_enforce_mfa(
        mfa_enabled: bool,
        mfa_frequency: MFAFrequency,
        device_id: Optional[str] = None,
        trust_token: Optional[str] = None,
        is_suspicious_activity: bool = False,
        last_login: Optional[datetime] = None,
        operation_type: str = "login",
        config: Optional[MFAEnforcementConfig] = None,
    ) -> MFAEnforcementResult:
        """
        Determine if MFA should be enforced

        Args:
            mfa_enabled: Whether MFA is enabled for user
            mfa_frequency: MFA frequency setting
            device_id: Device ID
            trust_token: Device trust token
            is_suspicious_activity: Whether activity is suspicious
            last_login: Last login timestamp
            operation_type: Type of operation (login, payment, profile_update, etc.)
            config: MFA enforcement configuration

        Returns:
            MFAEnforcementResult with enforcement decision
        """
        if config is None:
            config = MFAEnforcementManager.DEFAULT_CONFIG

        # Rule 0: MFA not enabled → no enforcement
        if not mfa_enabled:
            return MFAEnforcementResult(
                should_enforce=False,
                enforcement_reason="MFA not enabled for user",
                can_skip=True,
                skip_reason="MFA disabled by user",
            )

        # Rule 1: Suspicious activity → ALWAYS enforce (no skip)
        if is_suspicious_activity:
            return MFAEnforcementResult(
                should_enforce=True,
                enforcement_reason="Suspicious activity detected - MFA required for security",
                can_skip=False,
                metadata={"security_level": "high", "bypass_allowed": False},
            )

        # Rule 2: Sensitive operations → ALWAYS enforce (if configured)
        sensitive_operations = ["payment", "transfer", "password_change", "mfa_disable"]
        if (
            operation_type in sensitive_operations
            and config.require_mfa_for_sensitive_operations
        ):
            return MFAEnforcementResult(
                should_enforce=True,
                enforcement_reason=f"Sensitive operation ({operation_type}) requires MFA",
                can_skip=False,
                metadata={"operation_type": operation_type, "bypass_allowed": False},
            )

        # Rule 3: EVERY_LOGIN frequency → Always enforce (but can skip for trusted devices)
        if mfa_frequency == MFAFrequency.EVERY_LOGIN:
            # Check if device is trusted (can skip)
            if config.allow_trusted_device_skip and device_id and trust_token:
                from .mfa_manager import MFAManager

                device_trust = MFAManager.check_device_trust(
                    user_id="placeholder",  # Will be provided by caller
                    device_id=device_id,
                    trust_token=trust_token,
                )
                if device_trust.is_trusted:
                    return MFAEnforcementResult(
                        should_enforce=False,
                        enforcement_reason="MFA frequency: EVERY_LOGIN (skipped for trusted device)",
                        can_skip=True,
                        skip_reason="Trusted device detected",
                        metadata={
                            "device_id": device_id,
                            "trust_expires": str(device_trust.trust_expires_at),
                        },
                    )

            # Not trusted or no device info → enforce
            return MFAEnforcementResult(
                should_enforce=True,
                enforcement_reason="MFA frequency: EVERY_LOGIN",
                can_skip=False,
                metadata={"frequency": "every_login"},
            )

        # Rule 4: NEW_DEVICE frequency → Enforce only for new devices
        if mfa_frequency == MFAFrequency.NEW_DEVICE:
            if not device_id or not trust_token:
                return MFAEnforcementResult(
                    should_enforce=True,
                    enforcement_reason="New device detected (no device ID or trust token)",
                    can_skip=False,
                    metadata={"frequency": "new_device", "device_status": "new"},
                )

            # Check device trust
            from .mfa_manager import MFAManager

            device_trust = MFAManager.check_device_trust(
                user_id="placeholder",  # Will be provided by caller
                device_id=device_id,
                trust_token=trust_token,
            )

            if not device_trust.is_trusted:
                return MFAEnforcementResult(
                    should_enforce=True,
                    enforcement_reason="Untrusted device detected",
                    can_skip=False,
                    metadata={"frequency": "new_device", "device_status": "untrusted"},
                )

            # Trusted device → no enforcement
            return MFAEnforcementResult(
                should_enforce=False,
                enforcement_reason="Trusted device (MFA frequency: NEW_DEVICE)",
                can_skip=True,
                skip_reason="Device already trusted",
                metadata={"device_id": device_id},
            )

        # Rule 5: PERIODIC frequency → Enforce if last login > 7 days
        if mfa_frequency == MFAFrequency.PERIODIC:
            if last_login:
                days_since_login = (datetime.now() - last_login).days
                if days_since_login > config.periodic_reverification_days:
                    return MFAEnforcementResult(
                        should_enforce=True,
                        enforcement_reason=f"Periodic MFA verification (last login: {days_since_login} days ago)",
                        can_skip=False,
                        metadata={
                            "frequency": "periodic",
                            "days_since_login": days_since_login,
                            "threshold": config.periodic_reverification_days,
                        },
                    )

            # Recent login → no enforcement
            return MFAEnforcementResult(
                should_enforce=False,
                enforcement_reason="Recent login verified (MFA frequency: PERIODIC)",
                can_skip=True,
                skip_reason="Recent login within threshold",
                metadata={"last_login": str(last_login) if last_login else None},
            )

        # Rule 6: SUSPICIOUS_ACTIVITY frequency → Only enforce if suspicious (already checked above)
        if mfa_frequency == MFAFrequency.SUSPICIOUS_ACTIVITY:
            return MFAEnforcementResult(
                should_enforce=False,
                enforcement_reason="No suspicious activity detected (MFA frequency: SUSPICIOUS_ACTIVITY)",
                can_skip=True,
                skip_reason="No security concerns",
            )

        # Default: Enforce MFA (fallback)
        return MFAEnforcementResult(
            should_enforce=True,
            enforcement_reason="Default MFA enforcement policy",
            can_skip=False,
            metadata={"policy": "default"},
        )

    @staticmethod
    def get_enforcement_status(
        mfa_enabled: bool,
        mfa_frequency: MFAFrequency,
        device_id: Optional[str] = None,
        trust_token: Optional[str] = None,
        is_suspicious_activity: bool = False,
    ) -> MFAEnforcementStatus:
        """
        Get current MFA enforcement status (simplified version)

        Args:
            mfa_enabled: Whether MFA is enabled
            mfa_frequency: MFA frequency setting
            device_id: Device ID
            trust_token: Device trust token
            is_suspicious_activity: Whether activity is suspicious

        Returns:
            MFAEnforcementStatus with enforcement details
        """
        enforcement_result = MFAEnforcementManager.should_enforce_mfa(
            mfa_enabled=mfa_enabled,
            mfa_frequency=mfa_frequency,
            device_id=device_id,
            trust_token=trust_token,
            is_suspicious_activity=is_suspicious_activity,
        )

        return MFAEnforcementStatus(
            mfa_required=mfa_enabled,
            mfa_enforced=enforcement_result.should_enforce,
            reason=enforcement_result.enforcement_reason,
            can_skip=enforcement_result.can_skip,
            skip_reason=enforcement_result.skip_reason,
        )

    @staticmethod
    def validate_mfa_completion(
        verification_result: MFAVerificationResult,
        required: bool = True,
    ) -> Tuple[bool, Optional[str]]:
        """
        Validate that MFA was completed successfully

        Args:
            verification_result: MFA verification result
            required: Whether MFA is required

        Returns:
            Tuple of (is_valid, error_message)
        """
        # If MFA not required, always valid
        if not required:
            return True, None

        # Check if verification was successful
        if not verification_result.success:
            return False, verification_result.error_message or "MFA verification failed"

        # All checks passed
        return True, None

    @staticmethod
    def get_enforcement_config() -> dict:
        """
        Get MFA enforcement configuration

        Returns:
            Dictionary of configuration values
        """
        config = MFAEnforcementManager.DEFAULT_CONFIG
        return {
            "max_verification_attempts": config.max_verification_attempts,
            "code_expiry_minutes": config.code_expiry_minutes,
            "require_mfa_for_sensitive_operations": config.require_mfa_for_sensitive_operations,
            "allow_trusted_device_skip": config.allow_trusted_device_skip,
            "periodic_reverification_days": config.periodic_reverification_days,
        }

    @staticmethod
    def check_operation_requires_mfa(operation_type: str) -> bool:
        """
        Check if operation type requires MFA enforcement

        Args:
            operation_type: Type of operation

        Returns:
            True if operation requires MFA
        """
        sensitive_operations = [
            "payment",
            "transfer",
            "password_change",
            "mfa_disable",
            "email_change",
            "phone_change",
            "two_factor_disable",
            "api_key_generation",
            "security_settings_change",
        ]

        return operation_type.lower() in sensitive_operations

    @staticmethod
    def generate_mfa_enforcement_email(
        full_name: str,
        email: str,
        enforcement_reason: str,
        operation_type: str = "login",
    ) -> dict:
        """
        Generate bilingual email content for MFA enforcement notification

        Args:
            full_name: User's full name
            email: User's email
            enforcement_reason: Reason for MFA enforcement
            operation_type: Operation type

        Returns:
            Dictionary with email subject and body (Arabic + English)
        """
        subject = "🔒 MFA Required - Iraqi AI Chat System | التحقق بخطوتين مطلوب"

        arabic_body = f"""
مرحباً {full_name}،

يتطلب {operation_type} التحقق بخطوتين (MFA) لحماية حسابك.

**السبب:** {enforcement_reason}

**تفاصيل الحساب:**
- البريد الإلكتروني: {email}
- الوقت: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

**الخطوات التالية:**
1. أدخل رمز التحقق المرسل إليك
2. أكمل عملية التحقق بخطوتين
3. يمكنك الوثوق بهذا الجهاز لتجنب التحقق المتكرر

**نصائح الأمان:**
- لا تشارك رمز التحقق مع أي شخص
- تحقق من صحة الطلب قبل إدخال الرمز
- إذا لم تطلب هذا الإجراء، اتصل بالدعم فوراً

مع التحية،
فريق Iraqi AI Chat System
"""

        english_body = f"""
Hello {full_name},

Your {operation_type} requires Multi-Factor Authentication (MFA) to protect your account.

**Reason:** {enforcement_reason}

**Account Details:**
- Email: {email}
- Time: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}

**Next Steps:**
1. Enter the verification code sent to you
2. Complete the two-factor authentication process
3. You can trust this device to avoid repeated verification

**Security Tips:**
- Never share your verification code with anyone
- Verify the request is legitimate before entering the code
- If you didn't request this action, contact support immediately

Best regards,
Iraqi AI Chat System Team
"""

        return {
            "subject": subject,
            "body_arabic": arabic_body,
            "body_english": english_body,
            "body": f"{arabic_body}\n\n{'=' * 60}\n\n{english_body}",
        }
