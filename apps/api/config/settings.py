"""
Environment Settings Configuration with Pydantic Validation

This module defines and validates all environment variables for the Iraqi AI Chat System API.
Uses pydantic-settings for automatic .env file loading and type validation.

CRITICAL SECURITY RULES:
- All environment variables are server-side only
- Never expose sensitive values in API responses or logs
- Validation runs automatically at import time
- Application fails fast if required variables are missing

Example:
    from config import settings

    # Access validated settings
    print(settings.NODE_ENV)
    print(settings.DATABASE_URL)
"""

from typing import Literal
from pydantic import Field, field_validator, AnyHttpUrl, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Environment configuration for Iraqi AI Chat System API.

    All settings are loaded from environment variables or .env files.
    Pydantic validates types and provides defaults where specified.

    Raises:
        ValidationError: If required variables are missing or invalid
    """

    # -------------------------------------------------------------------------
    # Application Configuration
    # -------------------------------------------------------------------------
    NODE_ENV: Literal["development", "production", "test"] = Field(
        default="development",
        description="Application environment",
    )

    PORT: int = Field(
        default=8000,
        ge=1024,
        le=65535,
        description="Server port (must be between 1024-65535)",
    )

    HOST: str = Field(
        default="0.0.0.0",
        description="Host binding address",
    )

    LOG_LEVEL: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] = Field(
        default="INFO",
        description="Logging verbosity level",
    )

    DEBUG: bool = Field(
        default=True,
        description="Enable debug mode (verbose logging, auto-reload)",
    )

    # -------------------------------------------------------------------------
    # Security Configuration
    # -------------------------------------------------------------------------
    API_SECRET_KEY: SecretStr = Field(
        ...,  # Required field
        min_length=32,
        description="API secret key for JWT signing and encryption (min 32 chars)",
    )

    JWT_EXPIRATION_MINUTES: int = Field(
        default=60,
        ge=1,
        description="JWT token expiration in minutes",
    )

    CORS_ORIGINS: str = Field(
        default="http://localhost:3000",
        description="Comma-separated list of allowed CORS origins",
    )

    CORS_ALLOW_CREDENTIALS: bool = Field(
        default=True,
        description="Allow credentials in CORS requests",
    )

    @field_validator("API_SECRET_KEY")
    @classmethod
    def validate_api_secret_key(cls, v: SecretStr) -> SecretStr:
        """Ensure API secret key meets security requirements."""
        secret_value = v.get_secret_value()
        if len(secret_value) < 32:
            raise ValueError("API_SECRET_KEY must be at least 32 characters")
        return v

    @property
    def cors_origins_list(self) -> list[str]:
        """Parse CORS_ORIGINS into a list."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    # -------------------------------------------------------------------------
    # Database Configuration
    # -------------------------------------------------------------------------
    DATABASE_URL: str = Field(
        ...,  # Required field
        description="PostgreSQL connection string",
    )

    DB_POOL_SIZE: int = Field(
        default=5,
        ge=1,
        description="Database connection pool size",
    )

    DB_MAX_OVERFLOW: int = Field(
        default=10,
        ge=0,
        description="Maximum connection pool overflow",
    )

    DB_POOL_TIMEOUT: int = Field(
        default=30,
        ge=1,
        description="Database pool timeout in seconds",
    )

    REDIS_URL: str | None = Field(
        default=None,
        description="Redis connection string (optional)",
    )

    REDIS_PASSWORD: SecretStr | None = Field(
        default=None,
        description="Redis password (optional)",
    )

    # -------------------------------------------------------------------------
    # Supabase Configuration
    # -------------------------------------------------------------------------
    SUPABASE_URL: AnyHttpUrl = Field(
        ...,  # Required field
        description="Supabase project URL",
    )

    SUPABASE_ANON_KEY: str = Field(
        ...,  # Required field
        min_length=1,
        description="Supabase anonymous key",
    )

    SUPABASE_SERVICE_ROLE_KEY: SecretStr = Field(
        ...,  # Required field
        min_length=1,
        description="Supabase service role key (admin access)",
    )

    # -------------------------------------------------------------------------
    # LLM Provider Configuration
    # -------------------------------------------------------------------------
    LLM_PROVIDER: Literal["openai"] = Field(
        default="openai",
        description="LLM provider selection",
    )

    LLM_API_KEY: SecretStr = Field(
        ...,  # Required field
        min_length=1,
        description="OpenAI API key",
    )

    LLM_MODEL: str = Field(
        default="gpt-4o-mini",
        description="OpenAI model to use",
    )

    LLM_BASE_URL: AnyHttpUrl = Field(
        default="https://api.openai.com/v1",
        description="OpenAI API base URL",
    )

    LLM_TIMEOUT: int = Field(
        default=60,
        ge=1,
        description="LLM request timeout in seconds",
    )

    LLM_MAX_RETRIES: int = Field(
        default=3,
        ge=0,
        description="Maximum retries on LLM request failure",
    )

    # -------------------------------------------------------------------------
    # Iraqi Payment Gateway Configuration (Optional)
    # -------------------------------------------------------------------------
    ZAINCASH_API_KEY: SecretStr | None = Field(
        default=None,
        description="ZainCash payment gateway API key",
    )

    ZAINCASH_BASE_URL: AnyHttpUrl | None = Field(
        default=None,
        description="ZainCash API base URL",
    )

    ZAINCASH_MERCHANT_ID: str | None = Field(
        default=None,
        description="ZainCash merchant ID",
    )

    FASTPAY_API_KEY: SecretStr | None = Field(
        default=None,
        description="FastPay payment gateway API key",
    )

    FASTPAY_BASE_URL: AnyHttpUrl | None = Field(
        default=None,
        description="FastPay API base URL",
    )

    FASTPAY_MERCHANT_ID: str | None = Field(
        default=None,
        description="FastPay merchant ID",
    )

    NASSWALLET_API_KEY: SecretStr | None = Field(
        default=None,
        description="NassWallet payment gateway API key",
    )

    NASSWALLET_BASE_URL: AnyHttpUrl | None = Field(
        default=None,
        description="NassWallet API base URL",
    )

    NASSWALLET_MERCHANT_ID: str | None = Field(
        default=None,
        description="NassWallet merchant ID",
    )

    # -------------------------------------------------------------------------
    # Iraqi AI Specific Configuration
    # -------------------------------------------------------------------------
    CULTURAL_VALIDATION_ENABLED: bool = Field(
        default=True,
        description="Enable cultural validation for Iraqi compliance",
    )

    ARABIC_DIALECT_PROCESSING: bool = Field(
        default=True,
        description="Enable Arabic Iraqi dialect processing",
    )

    CULTURAL_VALIDATION_LEVEL: Literal["low", "medium", "high"] = Field(
        default="high",
        description="Cultural validation strictness level",
    )

    ARABIC_PROCESSING_ENGINE: Literal["default", "advanced"] = Field(
        default="default",
        description="Arabic text processing engine",
    )

    # -------------------------------------------------------------------------
    # Monitoring and Error Tracking (Optional)
    # -------------------------------------------------------------------------
    SENTRY_DSN: str | None = Field(
        default=None,
        description="Sentry DSN for error tracking",
    )

    SENTRY_ENVIRONMENT: Literal["development", "staging", "production"] | None = Field(
        default=None,
        description="Sentry environment name",
    )

    SENTRY_SAMPLE_RATE: float = Field(
        default=1.0,
        ge=0.0,
        le=1.0,
        description="Sentry error sample rate (0.0-1.0)",
    )

    SENTRY_TRACES_SAMPLE_RATE: float = Field(
        default=0.1,
        ge=0.0,
        le=1.0,
        description="Sentry traces sample rate (0.0-1.0)",
    )

    # -------------------------------------------------------------------------
    # Rate Limiting Configuration
    # -------------------------------------------------------------------------
    RATE_LIMIT_ENABLED: bool = Field(
        default=True,
        description="Enable rate limiting",
    )

    RATE_LIMIT_PER_MINUTE: int = Field(
        default=60,
        ge=1,
        description="Rate limit per minute per IP",
    )

    RATE_LIMIT_PER_HOUR: int = Field(
        default=1000,
        ge=1,
        description="Rate limit per hour per user",
    )

    # -------------------------------------------------------------------------
    # File Storage Configuration (Optional)
    # -------------------------------------------------------------------------
    MAX_UPLOAD_SIZE_MB: int = Field(
        default=10,
        ge=1,
        description="Maximum file upload size in MB",
    )

    ALLOWED_FILE_EXTENSIONS: str = Field(
        default="jpg,jpeg,png,gif,pdf,txt,doc,docx",
        description="Comma-separated list of allowed file extensions",
    )

    FILE_STORAGE_TYPE: Literal["local", "s3", "supabase"] = Field(
        default="local",
        description="File storage backend type",
    )

    LOCAL_STORAGE_PATH: str = Field(
        default="./uploads",
        description="Local file storage path",
    )

    @property
    def allowed_extensions_list(self) -> list[str]:
        """Parse ALLOWED_FILE_EXTENSIONS into a list."""
        return [ext.strip().lower() for ext in self.ALLOWED_FILE_EXTENSIONS.split(",")]

    # -------------------------------------------------------------------------
    # Feature Flags (Optional)
    # -------------------------------------------------------------------------
    ENABLE_EXPERIMENTAL_FEATURES: bool = Field(
        default=False,
        description="Enable experimental features",
    )

    ENABLE_MULTIMODAL: bool = Field(
        default=True,
        description="Enable multimodal capabilities (image, voice)",
    )

    ENABLE_BACKGROUND_TASKS: bool = Field(
        default=True,
        description="Enable background task processing",
    )

    # -------------------------------------------------------------------------
    # Pydantic Configuration
    # -------------------------------------------------------------------------
    model_config = SettingsConfigDict(
        # Load from .env file
        env_file=".env",
        env_file_encoding="utf-8",
        # Case-sensitive environment variables
        case_sensitive=True,
        # Validate on assignment
        validate_assignment=True,
        # Extra fields not allowed
        extra="ignore",
    )

    # -------------------------------------------------------------------------
    # Helper Properties
    # -------------------------------------------------------------------------
    @property
    def is_development(self) -> bool:
        """Check if running in development mode."""
        return self.NODE_ENV == "development"

    @property
    def is_production(self) -> bool:
        """Check if running in production mode."""
        return self.NODE_ENV == "production"

    @property
    def is_test(self) -> bool:
        """Check if running in test mode."""
        return self.NODE_ENV == "test"

    @property
    def database_url_without_driver(self) -> str:
        """Get database URL without the driver prefix (for asyncpg)."""
        if self.DATABASE_URL.startswith("postgresql://"):
            return self.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")
        return self.DATABASE_URL

    def log_startup_info(self) -> None:
        """
        Log non-sensitive configuration info at startup.

        SECURITY: Only logs non-sensitive information.
        Never logs API keys, secrets, or credentials.
        """
        print("🚀 Iraqi AI Chat System API Starting...")
        print(f"  - Environment: {self.NODE_ENV}")
        print(f"  - Host: {self.HOST}:{self.PORT}")
        print(f"  - Debug Mode: {self.DEBUG}")
        print(
            f"  - Cultural Validation: {'enabled' if self.CULTURAL_VALIDATION_ENABLED else 'disabled'}"
        )
        print(
            f"  - Arabic Processing: {'enabled' if self.ARABIC_DIALECT_PROCESSING else 'disabled'}"
        )
        print(
            f"  - Database: {'configured' if self.DATABASE_URL else 'not configured'}"
        )
        print(f"  - Redis: {'configured' if self.REDIS_URL else 'not configured'}")
        print(f"  - LLM Provider: {self.LLM_PROVIDER}")
        print(f"  - LLM Model: {self.LLM_MODEL}")
        print(
            f"  - Rate Limiting: {'enabled' if self.RATE_LIMIT_ENABLED else 'disabled'}"
        )
        print(f"  - Multimodal: {'enabled' if self.ENABLE_MULTIMODAL else 'disabled'}")

        # Log payment gateway status (without exposing keys)
        payment_gateways = []
        if self.ZAINCASH_API_KEY:
            payment_gateways.append("ZainCash")
        if self.FASTPAY_API_KEY:
            payment_gateways.append("FastPay")
        if self.NASSWALLET_API_KEY:
            payment_gateways.append("NassWallet")

        if payment_gateways:
            print(f"  - Payment Gateways: {', '.join(payment_gateways)}")
        else:
            print("  - Payment Gateways: none configured")

        print("✅ Configuration validated successfully")


# -------------------------------------------------------------------------
# Create singleton settings instance
# -------------------------------------------------------------------------
# This validates environment variables immediately on import
# Application will fail fast if validation fails

try:
    settings = Settings()

    # Validate critical security requirements
    if len(settings.API_SECRET_KEY.get_secret_value()) < 32:
        raise ValueError("API_SECRET_KEY must be at least 32 characters for security")

    # Log startup info in development
    if settings.is_development:
        settings.log_startup_info()

except Exception as e:
    print(f"❌ Environment validation failed: {e}")
    print("\n💡 Tips:")
    print("  - Check .env.example for required variables")
    print("  - Copy .env.example to .env")
    print("  - Ensure all required variables are set")
    print("  - Verify API_SECRET_KEY is at least 32 characters")
    raise


# -------------------------------------------------------------------------
# Export settings instance
# -------------------------------------------------------------------------
__all__ = ["settings", "Settings"]
