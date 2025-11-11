"""
API Routes Package
Contains FastAPI route handlers
"""

from apps.api.routes.auth import router as auth_router

__all__ = ["auth_router"]
