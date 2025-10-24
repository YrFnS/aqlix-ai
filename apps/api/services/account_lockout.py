"""
Account Lockout Service
Tracks failed login attempts and implements account lockout mechanism
"""

from datetime import datetime, timedelta
from typing import Optional, Tuple
from pydantic import BaseModel
import logging

logger = logging.getLogger(__name__)


# Account lockout configuration
MAX_FAILED_ATTEMPTS = 5  # Lock after 5 consecutive failed attempts
LOCKOUT_DURATION_MINUTES = 30  # Lock account for 30 minutes
ATTEMPT_WINDOW_MINUTES = 15  # Reset counter if no attempts in 15 minutes


class LockoutStatus(BaseModel):
    """Account lockout status"""

    is_locked: bool
    failed_attempts: int
    locked_until: Optional[datetime] = None
    remaining_attempts: int
    can_attempt_login: bool
    lockout_reason: Optional[str] = None


class AccountLockoutManager:
    """
    Account Lockout Manager

    Manages failed login attempts and account lockout mechanism.
    Implements security best practices:
    - Tracks consecutive failed login attempts
    - Locks account after MAX_FAILED_ATTEMPTS (5)
    - Auto-unlocks after LOCKOUT_DURATION_MINUTES (30)
    - Resets counter on successful login
    - Resets counter if no attempts in ATTEMPT_WINDOW_MINUTES (15)
    """

    @staticmethod
    def check_lockout_status(
        failed_attempts: int,
        locked_until: Optional[datetime],
        last_failed_attempt: Optional[datetime] = None,
    ) -> LockoutStatus:
        """
        Check if account is locked and return lockout status

        Args:
            failed_attempts: Current count of consecutive failed attempts
            locked_until: Timestamp when lock expires (None if not locked)
            last_failed_attempt: Timestamp of last failed attempt (for window check)

        Returns:
            LockoutStatus with detailed account status
        """
        now = datetime.now()

        # Check if account is currently locked
        if locked_until and locked_until > now:
            # Account is locked and lockout hasn't expired
            time_remaining = locked_until - now
            minutes_remaining = int(time_remaining.total_seconds() / 60)

            return LockoutStatus(
                is_locked=True,
                failed_attempts=failed_attempts,
                locked_until=locked_until,
                remaining_attempts=0,
                can_attempt_login=False,
                lockout_reason=f"Account locked due to {MAX_FAILED_ATTEMPTS} failed login attempts. "
                f"Try again in {minutes_remaining} minute(s).",
            )

        # Check if lockout has expired (auto-unlock)
        if locked_until and locked_until <= now:
            # Lockout expired, account is automatically unlocked
            logger.info(
                f"Account auto-unlocked: lockout expired at {locked_until.isoformat()}"
            )
            return LockoutStatus(
                is_locked=False,
                failed_attempts=0,  # Reset counter after auto-unlock
                locked_until=None,
                remaining_attempts=MAX_FAILED_ATTEMPTS,
                can_attempt_login=True,
                lockout_reason=None,
            )

        # Check if attempt window has expired (reset counter)
        if (
            last_failed_attempt
            and (now - last_failed_attempt).total_seconds()
            > ATTEMPT_WINDOW_MINUTES * 60
        ):
            # No attempts in ATTEMPT_WINDOW_MINUTES, reset counter
            logger.info(
                f"Failed attempt counter reset: no attempts in {ATTEMPT_WINDOW_MINUTES} minutes"
            )
            return LockoutStatus(
                is_locked=False,
                failed_attempts=0,
                locked_until=None,
                remaining_attempts=MAX_FAILED_ATTEMPTS,
                can_attempt_login=True,
                lockout_reason=None,
            )

        # Account is not locked
        remaining = MAX_FAILED_ATTEMPTS - failed_attempts
        return LockoutStatus(
            is_locked=False,
            failed_attempts=failed_attempts,
            locked_until=None,
            remaining_attempts=max(0, remaining),
            can_attempt_login=True,
            lockout_reason=None,
        )

    @staticmethod
    def record_failed_attempt(
        current_failed_attempts: int,
        locked_until: Optional[datetime] = None,
    ) -> Tuple[int, Optional[datetime], bool]:
        """
        Record a failed login attempt and determine if account should be locked

        Args:
            current_failed_attempts: Current count of failed attempts
            locked_until: Current locked_until timestamp (if locked)

        Returns:
            Tuple of (new_failed_attempts, new_locked_until, should_send_notification)
        """
        now = datetime.now()

        # Check if already locked
        if locked_until and locked_until > now:
            # Already locked, don't increment counter
            logger.warning(
                f"Failed login attempt on locked account (locked until {locked_until.isoformat()})"
            )
            return current_failed_attempts, locked_until, False

        # Increment failed attempts counter
        new_failed_attempts = current_failed_attempts + 1

        # Check if should lock account
        if new_failed_attempts >= MAX_FAILED_ATTEMPTS:
            # Lock the account
            new_locked_until = now + timedelta(minutes=LOCKOUT_DURATION_MINUTES)
            logger.warning(
                f"Account locked after {new_failed_attempts} failed attempts. "
                f"Locked until {new_locked_until.isoformat()}"
            )
            return new_failed_attempts, new_locked_until, True  # Send notification

        # Not locked yet
        logger.info(
            f"Failed login attempt recorded: {new_failed_attempts}/{MAX_FAILED_ATTEMPTS}"
        )
        return new_failed_attempts, None, False

    @staticmethod
    def reset_failed_attempts() -> Tuple[int, Optional[datetime]]:
        """
        Reset failed attempts counter on successful login

        Returns:
            Tuple of (0, None) to reset counter and unlock status
        """
        logger.info("Failed attempts counter reset on successful login")
        return 0, None

    @staticmethod
    def generate_lockout_email_content(
        full_name: str,
        email: str,
        locked_until: datetime,
        ip_address: Optional[str] = None,
    ) -> dict:
        """
        Generate email notification content for account lockout

        Args:
            full_name: User's full name
            email: User's email address
            locked_until: Timestamp when lock expires
            ip_address: IP address of failed attempt (optional)

        Returns:
            dict with email subject, body, and metadata
        """
        time_remaining = locked_until - datetime.now()
        minutes_remaining = int(time_remaining.total_seconds() / 60)

        # Email subject
        subject = "🔒 Account Locked - Iraqi AI Chat System"

        # Email body (Arabic + English for Iraqi users)
        body_arabic = f"""
مرحباً {full_name},

تم قفل حسابك مؤقتاً بسبب {MAX_FAILED_ATTEMPTS} محاولات تسجيل دخول فاشلة.

📋 تفاصيل القفل:
• البريد الإلكتروني: {email}
• وقت القفل: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
• مدة القفل: {LOCKOUT_DURATION_MINUTES} دقيقة
• الوقت المتبقي: {minutes_remaining} دقيقة
{f"• عنوان IP: {ip_address}" if ip_address else ""}

🔓 كيفية فتح القفل:
1. انتظر {minutes_remaining} دقيقة - سيتم فتح القفل تلقائياً
2. أو اتصل بالدعم الفني للمساعدة

🛡️ نصائح الأمان:
• تأكد من أنك تستخدم كلمة المرور الصحيحة
• إذا نسيت كلمة المرور، استخدم "استعادة كلمة المرور"
• إذا لم تكن أنت من حاول تسجيل الدخول، يرجى الاتصال بالدعم فوراً

مع تحياتنا،
فريق Iraqi AI Chat System
"""

        body_english = f"""
Hello {full_name},

Your account has been temporarily locked due to {MAX_FAILED_ATTEMPTS} consecutive failed login attempts.

📋 Lockout Details:
• Email: {email}
• Locked at: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
• Lockout duration: {LOCKOUT_DURATION_MINUTES} minutes
• Time remaining: {minutes_remaining} minutes
{f"• IP address: {ip_address}" if ip_address else ""}

🔓 How to Unlock:
1. Wait {minutes_remaining} minutes - your account will be automatically unlocked
2. Or contact support for assistance

🛡️ Security Tips:
• Ensure you're using the correct password
• If you forgot your password, use "Password Reset"
• If this wasn't you, please contact support immediately

Best regards,
Iraqi AI Chat System Team
"""

        return {
            "subject": subject,
            "body_arabic": body_arabic,
            "body_english": body_english,
            "full_body": body_arabic + "\n\n---\n\n" + body_english,
            "recipient": email,
            "locked_until": locked_until.isoformat(),
            "minutes_remaining": minutes_remaining,
        }

    @staticmethod
    def should_warn_user(failed_attempts: int) -> Tuple[bool, Optional[str]]:
        """
        Check if user should be warned about approaching lockout

        Args:
            failed_attempts: Current count of failed attempts

        Returns:
            Tuple of (should_warn, warning_message)
        """
        remaining = MAX_FAILED_ATTEMPTS - failed_attempts

        # Warn when 2 or fewer attempts remaining
        if 0 < remaining <= 2:
            message = (
                f"Warning: {remaining} login attempt(s) remaining before account lockout. "
                f"Account will be locked for {LOCKOUT_DURATION_MINUTES} minutes after {MAX_FAILED_ATTEMPTS} failed attempts."
            )
            return True, message

        return False, None

    @staticmethod
    def get_lockout_config() -> dict:
        """
        Get current lockout configuration

        Returns:
            dict with lockout configuration values
        """
        return {
            "max_failed_attempts": MAX_FAILED_ATTEMPTS,
            "lockout_duration_minutes": LOCKOUT_DURATION_MINUTES,
            "attempt_window_minutes": ATTEMPT_WINDOW_MINUTES,
        }
