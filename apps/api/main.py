"""
Iraqi AI Chat System - FastAPI Backend Entry Point

This is the main entry point for the FastAPI application. It initializes:
- Environment configuration validation
- FastAPI application instance
- CORS middleware
- API routes
- Error handlers
- Startup and shutdown events

CRITICAL: Environment validation runs on import of config.settings,
ensuring all required variables are present before app initialization.
"""

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
import logging

# ============================================================================
# CRITICAL: Validate environment variables at startup
# This import triggers immediate validation and will throw if variables are missing
# ============================================================================
from config import settings

# ============================================================================
# Logging Configuration
# ============================================================================
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


# ============================================================================
# Application Lifespan Events
# ============================================================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manage application lifespan events (startup and shutdown).

    This function runs when the application starts and when it shuts down.
    Use it for resource initialization and cleanup.
    """
    # Startup
    logger.info("🚀 Iraqi AI Chat System API Starting...")
    settings.log_startup_info()

    # Validate critical configuration
    if settings.is_production and settings.DEBUG:
        logger.warning("⚠️  WARNING: DEBUG mode enabled in production!")

    # Initialize services here (database, redis, etc.)
    # TODO: Initialize database connection pool
    # TODO: Initialize Redis connection
    # TODO: Initialize LLM client

    logger.info("✅ Application startup complete")

    yield

    # Shutdown
    logger.info("🛑 Shutting down Iraqi AI Chat System API...")
    # Cleanup resources here
    # TODO: Close database connection pool
    # TODO: Close Redis connection
    # TODO: Cleanup LLM client resources

    logger.info("✅ Application shutdown complete")


# ============================================================================
# FastAPI Application Instance
# ============================================================================
app = FastAPI(
    title="Iraqi AI Chat System API",
    description=(
        "AI-powered chat system with Arabic Iraqi dialect support, "
        "cultural compliance, and professional domain expertise"
    ),
    version="1.0.0",
    docs_url="/docs" if settings.is_development else None,  # Disable docs in production
    redoc_url="/redoc" if settings.is_development else None,
    lifespan=lifespan,
)


# ============================================================================
# Rate Limiting Setup
# ============================================================================
from services.rate_limiter import limiter

# Register limiter with FastAPI app
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


# ============================================================================
# CORS Middleware
# ============================================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# Global Exception Handlers
# ============================================================================
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Global exception handler for unhandled errors.

    Logs the error and returns a generic error response to the client.
    In production, does not expose internal error details.
    """
    logger.error(f"Unhandled exception: {exc}", exc_info=True)

    if settings.is_production:
        # Don't expose internal errors in production
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": "Internal server error",
                "message": "An unexpected error occurred. Please try again later.",
            },
        )
    else:
        # Expose error details in development for debugging
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": "Internal server error",
                "message": str(exc),
                "type": type(exc).__name__,
            },
        )


# ============================================================================
# Health Check Endpoint
# ============================================================================
@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint for monitoring and load balancers.

    Returns:
        dict: Health status and application information
    """
    return {
        "status": "healthy",
        "environment": settings.NODE_ENV,
        "version": "1.0.0",
        "services": {
            "database": "configured" if settings.DATABASE_URL else "not configured",
            "redis": "configured" if settings.REDIS_URL else "not configured",
            "llm": "configured",
        },
        "features": {
            "cultural_validation": settings.CULTURAL_VALIDATION_ENABLED,
            "arabic_processing": settings.ARABIC_DIALECT_PROCESSING,
            "multimodal": settings.ENABLE_MULTIMODAL,
        },
    }


# ============================================================================
# Root Endpoint
# ============================================================================
@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint with API information.

    Returns:
        dict: API information and links
    """
    return {
        "message": "Iraqi AI Chat System API",
        "version": "1.0.0",
        "documentation": "/docs" if settings.is_development else None,
        "health": "/health",
    }


# ============================================================================
# API Routes
# ============================================================================
from routes import auth

# Include authentication routes
app.include_router(auth.router)

# TODO: Import and include additional routers here
# Example:
# from routes import chat, documents, payments
# app.include_router(chat.router, prefix="/api/v1/chat", tags=["Chat"])
# app.include_router(documents.router, prefix="/api/v1/documents", tags=["Documents"])
# app.include_router(payments.router, prefix="/api/v1/payments", tags=["Payments"])


# ============================================================================
# Application Entry Point
# ============================================================================
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG and settings.is_development,
        log_level=settings.LOG_LEVEL.lower(),
    )
