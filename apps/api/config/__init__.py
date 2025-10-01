"""
Configuration Module for Iraqi AI Chat System API

This module provides environment configuration and validation using pydantic-settings.
All environment variables are automatically loaded and validated at application startup.

Usage:
    from config import settings

    # Access validated environment variables
    api_key = settings.API_SECRET_KEY
    db_url = settings.DATABASE_URL

Security:
    - Never import this module in client-side code
    - Never log sensitive configuration values
    - All environment variables are validated at startup
"""

from .settings import settings

__all__ = ["settings"]
