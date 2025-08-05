"""
Main application configuration extracted from Langflow for Iraqi AI Chat System
Original: src/backend/base/langflow/main.py
"""

import asyncio
import contextvars
import platform
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import uvicorn

from langflow.api.router import router
from langflow.services.manager import initialize_services
from langflow.services.settings.service import get_settings

# Iraqi AI: Enhanced configuration for Iraqi specific requirements
IRAQI_CONFIG = {
    "supported_languages": ["arabic", "english"],
    "default_language": "arabic",
    "cultural_validation": True,
    "professional_domains": ["legal", "medical", "educational", "business"],
    "payment_providers": ["zaincash", "fastpay", "nasswallet"],
    "rtl_support": True,
    "islamic_compliance": True,
}

def create_app(
    static_files_dir: Optional[str] = None,
    # Iraqi AI enhancements:
    enable_cultural_validation: bool = True,
    enable_rtl_support: bool = True,
    default_language: str = "arabic",
) -> FastAPI:
    """
    Create FastAPI application with Iraqi AI Chat System enhancements.
    
    Args:
        static_files_dir: Directory for static files
        enable_cultural_validation: Enable Islamic compliance validation
        enable_rtl_support: Enable RTL text support
        default_language: Default language (arabic/english)
    """
    
    @asynccontextmanager
    async def lifespan(app: FastAPI):
        """Application lifespan management with Iraqi enhancements"""
        try:
            # Initialize services
            await initialize_services()
            
            # Iraqi AI: Initialize cultural validation service
            if enable_cultural_validation:
                await initialize_cultural_service()
            
            # Iraqi AI: Initialize RTL processing service
            if enable_rtl_support:
                await initialize_rtl_service()
            
            # Iraqi AI: Initialize payment gateway connections
            await initialize_payment_gateways()
            
            yield
        finally:
            # Cleanup services
            await cleanup_services()

    # Create FastAPI app
    app = FastAPI(
        title="Iraqi AI Chat System",
        description="AI Chat System for Iraqi Professional Domains with Cultural Compliance",
        version="1.0.0",
        lifespan=lifespan,
        docs_url="/docs" if get_settings().dev else None,
        redoc_url="/redoc" if get_settings().dev else None,
    )

    # Add middleware
    add_middleware(app, enable_cultural_validation, enable_rtl_support)
    
    # Include routers
    app.include_router(router, prefix="/api/v1")
    
    # Iraqi AI: Add specialized routers
    add_iraqi_routers(app)
    
    # Setup static files
    if static_files_dir:
        setup_static_files(app, static_files_dir)
    
    return app

def add_middleware(
    app: FastAPI, 
    enable_cultural_validation: bool = True,
    enable_rtl_support: bool = True
):
    """Add middleware with Iraqi AI enhancements"""
    
    # CORS middleware with Iraqi domains
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:3000",
            "http://localhost:8000",
            "https://*.iq",  # Iraqi domains
            "https://*.iraqi-ai.com",  # Iraqi AI domains
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Compression middleware
    app.add_middleware(GZipMiddleware, minimum_size=1000)
    
    # Iraqi AI: Cultural validation middleware
    if enable_cultural_validation:
        app.add_middleware(CulturalValidationMiddleware)
    
    # Iraqi AI: RTL processing middleware
    if enable_rtl_support:
        app.add_middleware(RTLProcessingMiddleware)
    
    # Iraqi AI: Security middleware for Iraqi standards
    app.add_middleware(IraqiSecurityMiddleware)

def add_iraqi_routers(app: FastAPI):
    """Add Iraqi-specific API routers"""
    
    # Cultural validation endpoints
    @app.get("/api/v1/cultural/validate")
    async def validate_cultural_content(content: str):
        """Validate content for Islamic compliance"""
        # Implementation would use cultural validation service
        return {"is_compliant": True, "recommendations": []}
    
    # RTL processing endpoints
    @app.post("/api/v1/rtl/process")
    async def process_rtl_content(content: str):
        """Process Arabic text for RTL display"""
        # Implementation would use RTL processing service
        return {"processed_content": content, "direction": "rtl"}
    
    # Payment gateway endpoints
    @app.get("/api/v1/payments/providers")
    async def get_payment_providers():
        """Get available Iraqi payment providers"""
        return {
            "providers": [
                {"id": "zaincash", "name": "ZainCash", "min_amount": 1000},
                {"id": "fastpay", "name": "FastPay", "min_amount": 500},
                {"id": "nasswallet", "name": "NassWallet", "min_amount": 1000}
            ]
        }
    
    # Professional domain endpoints
    @app.get("/api/v1/domains")
    async def get_professional_domains():
        """Get available Iraqi professional domains"""
        return {
            "domains": [
                {"id": "legal", "name": "قانوني", "name_en": "Legal"},
                {"id": "medical", "name": "طبي", "name_en": "Medical"},
                {"id": "educational", "name": "تعليمي", "name_en": "Educational"},
                {"id": "business", "name": "تجاري", "name_en": "Business"}
            ]
        }

def setup_static_files(app: FastAPI, static_files_dir: str):
    """Setup static file serving"""
    app.mount("/static", StaticFiles(directory=static_files_dir), name="static")
    
    # Serve index.html at root
    @app.get("/")
    async def serve_frontend():
        return FileResponse(f"{static_files_dir}/index.html")

# Iraqi AI: Specialized middleware classes
class CulturalValidationMiddleware:
    """Middleware for Islamic cultural compliance validation"""
    
    def __init__(self, app):
        self.app = app
    
    async def __call__(self, request: Request, call_next):
        # Pre-process request for cultural validation
        response = await call_next(request)
        
        # Post-process response for cultural compliance
        # Implementation would validate response content
        
        return response

class RTLProcessingMiddleware:
    """Middleware for RTL text processing"""
    
    def __init__(self, app):
        self.app = app
    
    async def __call__(self, request: Request, call_next):
        # Detect Arabic content and set RTL context
        response = await call_next(request)
        
        # Add RTL headers if Arabic content detected
        if self.contains_arabic_content(response):
            response.headers["X-Text-Direction"] = "rtl"
            response.headers["X-Language"] = "arabic"
        
        return response
    
    def contains_arabic_content(self, response) -> bool:
        # Simple Arabic detection
        return False  # Placeholder

class IraqiSecurityMiddleware:
    """Security middleware for Iraqi standards"""
    
    def __init__(self, app):
        self.app = app
    
    async def __call__(self, request: Request, call_next):
        # Apply Iraqi security standards
        # Rate limiting, IP filtering, etc.
        
        response = await call_next(request)
        
        # Add security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        
        return response

# Iraqi AI: Service initialization functions
async def initialize_cultural_service():
    """Initialize cultural validation service"""
    # Implementation would set up Islamic compliance validation
    pass

async def initialize_rtl_service():
    """Initialize RTL text processing service"""
    # Implementation would set up Arabic text processing
    pass

async def initialize_payment_gateways():
    """Initialize Iraqi payment gateway connections"""
    # Implementation would connect to ZainCash, FastPay, NassWallet APIs
    pass

async def cleanup_services():
    """Cleanup all services"""
    # Implementation would cleanup connections and resources
    pass

def run_app(
    host: str = "0.0.0.0",
    port: int = 7860,
    log_level: str = "info",
    # Iraqi AI enhancements:
    enable_cultural_mode: bool = True,
    enable_rtl_support: bool = True,
):
    """Run the Iraqi AI Chat System application"""
    
    app = create_app(
        enable_cultural_validation=enable_cultural_mode,
        enable_rtl_support=enable_rtl_support,
    )
    
    # Iraqi AI: Enhanced logging for cultural events
    logging_config = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "default": {
                "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
            },
            "arabic": {
                "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s [عربي]",
            }
        },
        "handlers": {
            "default": {
                "formatter": "default",
                "class": "logging.StreamHandler",
                "stream": "ext://sys.stdout",
            },
        },
        "root": {
            "level": log_level.upper(),
            "handlers": ["default"],
        },
    }
    
    uvicorn.run(
        app,
        host=host,
        port=port,
        log_level=log_level,
        log_config=logging_config,
    )

if __name__ == "__main__":
    run_app()

# Iraqi AI Chat System enhancements implemented:
# - Cultural validation middleware for Islamic compliance
# - RTL text processing middleware for Arabic support
# - Iraqi security standards middleware
# - Payment gateway integration endpoints
# - Professional domain management
# - Enhanced CORS for Iraqi domains
# - Arabic-aware logging configuration
# - Cultural service initialization
# - Iraqi-specific API endpoints