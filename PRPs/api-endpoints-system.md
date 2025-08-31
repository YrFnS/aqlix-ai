name: "API Endpoints System for Iraqi AI Chat System"
description: |
  Comprehensive RESTful API endpoints foundation using FastAPI framework with Pydantic validation, 
  proper routing, middleware integration, and Iraqi-specific enhancements for secure data exchange.

---

## Goal
Build a production-ready FastAPI backend API system that provides:
- RESTful endpoint architecture with proper HTTP methods and status codes
- Pydantic model-based request validation and response serialization  
- Organized API routing with proper prefix structure
- Middleware integration for authentication, logging, cultural validation, and security
- Comprehensive error handling with consistent response formatting
- Automatic OpenAPI documentation generation
- Iraqi AI Chat System specific enhancements (cultural validation, RTL support, payment gateway integration)

## Why
- **Foundation Infrastructure**: Essential backend API layer for Iraqi AI Chat System
- **Type Safety**: Pydantic models ensure data validation and prevent runtime errors
- **Developer Experience**: Automatic API documentation reduces integration friction
- **Cultural Compliance**: Iraqi-specific middleware ensures Islamic values and cultural appropriateness
- **Scalability**: Well-structured API architecture supports future feature additions
- **Security**: Built-in validation and middleware patterns prevent common API vulnerabilities

## What
A complete FastAPI application structure with:

### Success Criteria
- [ ] FastAPI app creates successfully with proper lifespan management
- [ ] Pydantic request/response models validate data correctly
- [ ] API routes respond with proper HTTP status codes and JSON formatting
- [ ] Iraqi-specific middleware (cultural validation, RTL support, security) integrates properly
- [ ] Error handling returns consistent, informative responses without sensitive data leakage
- [ ] Automatic Swagger UI documentation generates and displays correctly
- [ ] All validation commands pass: linting, type checking, and tests

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- url: https://fastapi.tiangolo.com/
  why: Core FastAPI concepts, routing, and middleware patterns
  critical: Async/await patterns, dependency injection, automatic validation
  
- url: https://docs.pydantic.dev/
  why: Model definition, validation techniques, and serialization methods
  critical: BaseModel inheritance, field constraints, validation errors, model_dump()
  
- file: examples/langflow-extracted/config/main.py
  why: Iraqi-enhanced FastAPI app creation pattern with cultural middleware
  pattern: create_app() function, lifespan management, Iraqi router integration
  
- file: examples/kortix-suna-extracted/backend/agent/api.py
  why: Production-ready API endpoint patterns with Pydantic models
  pattern: Router usage, request/response models, error handling, pagination
  
- file: examples/open-webui-extracted/middleware/auth.py
  why: Authentication middleware patterns for Iraqi context
  pattern: HTTPBearer, JWT validation, user dependency injection
  
- file: examples/open-webui-extracted/middleware/cultural_validation.py
  why: Cultural validation middleware for Islamic compliance
  pattern: Request/response validation, content filtering, Iraqi cultural rules
```

### Current Codebase Tree
```bash
aqlix-ai/
├── .claude/
│   └── agents/               # 21 specialized Iraqi AI agents
├── examples/                 # 44+ Iraqi-enhanced components & patterns
│   ├── langflow-extracted/   # FastAPI app structure patterns
│   ├── kortix-suna-extracted/# API endpoint and routing patterns  
│   └── open-webui-extracted/ # Middleware and authentication patterns
├── project-context/          # Persistent knowledge base
├── PRPs/                     # Product Requirement Prompts
├── CLAUDE.md                 # Project rules and configuration
└── NAMING_CONVENTIONS.md     # Professional terminology guidelines
```

### Desired Codebase Tree with New Files
```bash
aqlix-ai/
└── api/                      # New FastAPI backend structure
    ├── __init__.py           # Package initialization
    ├── main.py               # FastAPI app creation and configuration
    ├── core/
    │   ├── __init__.py
    │   ├── config.py         # Settings and configuration
    │   └── middleware.py     # Custom middleware implementations
    ├── models/
    │   ├── __init__.py
    │   ├── base.py           # Base Pydantic models
    │   ├── requests.py       # Request models
    │   └── responses.py      # Response models
    ├── routers/
    │   ├── __init__.py
    │   ├── health.py         # Health check endpoints
    │   └── api_v1.py         # Main API v1 router
    └── tests/
        ├── __init__.py
        ├── test_main.py      # App creation tests
        ├── test_models.py    # Pydantic model tests
        └── test_routers.py   # Endpoint tests
```

### Known Gotchas & Library Quirks
```python
# CRITICAL: FastAPI-specific patterns from existing codebase
# 1. Always use async functions for endpoints that will scale
async def endpoint_function():  # Not def endpoint_function()

# 2. Pydantic v2 syntax (from examples)
from pydantic import BaseModel, Field
class Model(BaseModel):
    field: str = Field(..., description="Required field")  # v2 syntax

# 3. Iraqi middleware integration pattern (from langflow main.py)
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize services BEFORE yield
    await initialize_cultural_service()
    yield
    # Cleanup AFTER yield  
    await cleanup_services()

# 4. Router pattern (from kortix-suna examples)
router = APIRouter(prefix="/api/v1", tags=["api"])
# NOT app.get() directly - use router.get() then app.include_router()

# 5. Error handling pattern (from kortix-suna)
try:
    result = await operation()
    return {"status": "success", "data": result}
except SpecificError as e:
    raise HTTPException(status_code=400, detail=str(e))
# NOT generic Exception catching

# 6. Iraqi cultural validation (from middleware examples)
# Always validate content for Islamic compliance before processing
await cultural_validator.validate_content(content)
```

## Implementation Blueprint

### Data Models and Structure
Create type-safe Pydantic models for consistent API contracts:

```python
# Base models for reusability
class BaseResponse(BaseModel):
    status: str = Field(..., description="Response status")
    message: str = Field(..., description="Human-readable message") 
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class PaginationInfo(BaseModel):
    page: int = Field(..., ge=1, description="Current page number")
    limit: int = Field(..., ge=1, le=100, description="Items per page")
    total: int = Field(..., ge=0, description="Total items")
    pages: int = Field(..., ge=0, description="Total pages")

# Request/Response models following existing patterns
class HealthResponse(BaseResponse):
    data: dict = Field(..., description="System health information")
```

### List of Tasks to be Completed (In Order)

```yaml
Task 1 - Core Configuration:
CREATE api/core/config.py:
  - MIRROR pattern from: examples/langflow-extracted/config/main.py (IRAQI_CONFIG)
  - ADD FastAPI settings, CORS origins, middleware flags
  - INCLUDE Iraqi-specific settings (cultural validation, RTL support)

CREATE api/core/middleware.py:
  - MIRROR pattern from: examples/open-webui-extracted/middleware/
  - IMPLEMENT CulturalValidationMiddleware, RTLProcessingMiddleware, IraqiSecurityMiddleware
  - PRESERVE error handling patterns from examples

Task 2 - Pydantic Models:
CREATE api/models/base.py:
  - MIRROR pattern from: examples/kortix-suna-extracted/backend/agent/api.py (BaseModel usage)
  - IMPLEMENT BaseResponse, PaginationInfo, ErrorResponse
  - FOLLOW Pydantic v2 syntax with Field(..., description="")

CREATE api/models/requests.py:
  - MIRROR pattern from: AgentStartRequest, AgentCreateRequest examples
  - IMPLEMENT common request models with validation
  - INCLUDE Arabic text validation patterns

CREATE api/models/responses.py:
  - MIRROR pattern from: AgentResponse, AgentsResponse examples  
  - IMPLEMENT standard response wrappers
  - PRESERVE pagination patterns

Task 3 - FastAPI Application:
CREATE api/main.py:
  - MIRROR pattern from: examples/langflow-extracted/config/main.py (create_app function)
  - IMPLEMENT FastAPI app with lifespan management
  - INTEGRATE Iraqi middleware and router patterns
  - PRESERVE cultural service initialization

Task 4 - Basic Routers:
CREATE api/routers/health.py:
  - IMPLEMENT basic health check endpoint
  - RETURN system status, cultural service status, database connectivity
  - FOLLOW router pattern from examples

CREATE api/routers/api_v1.py:
  - MIRROR pattern from: examples/kortix-suna-extracted/backend/agent/api.py (router usage)
  - SETUP main API v1 router structure
  - INCLUDE proper prefixes and tags

Task 5 - Testing Infrastructure:
CREATE api/tests/test_main.py:
  - TEST FastAPI app creation and startup
  - VALIDATE middleware integration
  - VERIFY cultural services initialize

CREATE api/tests/test_models.py:
  - TEST Pydantic model validation
  - VERIFY error handling for invalid data
  - CHECK serialization/deserialization

CREATE api/tests/test_routers.py:
  - TEST health endpoint response format
  - VERIFY API v1 router integration
  - CHECK error response consistency
```

### Per Task Pseudocode

```python
# Task 1 - Configuration
class Settings(BaseModel):
    # PATTERN: Environment-based config (see existing examples)
    app_name: str = "Iraqi AI Chat System API"
    debug: bool = Field(default=False)
    cors_origins: List[str] = Field(default_factory=list)
    
    # IRAQI: Cultural compliance settings
    enable_cultural_validation: bool = Field(default=True)
    enable_rtl_support: bool = Field(default=True) 
    default_language: str = Field(default="arabic")

# Task 3 - FastAPI App Creation  
async def create_app() -> FastAPI:
    # PATTERN: Lifespan context manager (from langflow main.py)
    @asynccontextmanager
    async def lifespan(app: FastAPI):
        # CRITICAL: Initialize Iraqi services before yield
        await initialize_cultural_service()
        await initialize_rtl_service() 
        yield
        await cleanup_services()
    
    # PATTERN: FastAPI with Iraqi enhancements
    app = FastAPI(
        title="Iraqi AI Chat System API",
        description="RESTful API with Cultural Compliance", 
        lifespan=lifespan
    )
    
    # PATTERN: Middleware integration (preserve order)
    app.add_middleware(CulturalValidationMiddleware)
    app.add_middleware(RTLProcessingMiddleware)
    
    return app

# Task 4 - Health Endpoint
@router.get("/health", response_model=HealthResponse)
async def health_check():
    # PATTERN: Service status checking
    cultural_status = await check_cultural_service()
    
    return HealthResponse(
        status="healthy",
        message="System operational",
        data={
            "cultural_validation": cultural_status,
            "api_version": "1.0.0"
        }
    )
```

### Integration Points
```yaml
MIDDLEWARE:
  - add_middleware: Must be called in correct order
  - pattern: "app.add_middleware(CulturalValidationMiddleware, enable=settings.enable_cultural_validation)"
  
ROUTERS:
  - include_router: Add all routers to main app
  - pattern: "app.include_router(health_router, prefix='/api/v1', tags=['health'])"
  
CONFIGURATION:
  - settings: Use Pydantic Settings for environment variables
  - pattern: "settings = Settings()"
  
SERVICES:
  - initialization: Cultural, RTL, and security services in lifespan
  - pattern: "await initialize_cultural_service()" in lifespan startup
```

## Validation Loop

### Level 1: Syntax & Style
```bash
# Run these FIRST - fix any errors before proceeding
ruff check api/ --fix              # Auto-fix formatting and imports
mypy api/                          # Type checking for all modules

# Expected: No errors. If errors, READ the error message and fix code.
```

### Level 2: Unit Tests  
```python
# CREATE api/tests/ with these test patterns:
def test_app_creation():
    """FastAPI app creates successfully"""
    app = create_app()
    assert app.title == "Iraqi AI Chat System API"
    assert "/docs" in [route.path for route in app.routes]

def test_pydantic_validation():
    """Request models validate correctly"""
    # Valid data should pass
    model = BaseResponse(status="success", message="test")
    assert model.status == "success"
    
    # Invalid data should raise ValidationError
    with pytest.raises(ValidationError):
        BaseResponse(status="", message="")  # Empty status invalid

def test_health_endpoint():
    """Health check returns proper format"""
    client = TestClient(app)
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "cultural_validation" in data["data"]
```

```bash
# Run and iterate until passing:
python -m pytest api/tests/ -v
# If failing: Read error, understand root cause, fix code, re-run
```

### Level 3: Integration Test
```bash
# Start the API server
python -m api.main

# Test health endpoint
curl -X GET http://localhost:8000/api/v1/health \
  -H "Content-Type: application/json"

# Expected: {"status": "healthy", "message": "System operational", "data": {...}}

# Test OpenAPI docs generation
curl -X GET http://localhost:8000/docs
# Expected: Swagger UI HTML page loads successfully
```

## Final Validation Checklist
- [ ] All tests pass: `python -m pytest api/tests/ -v`
- [ ] No linting errors: `ruff check api/`
- [ ] No type errors: `mypy api/`
- [ ] Health endpoint responds: `curl http://localhost:8000/api/v1/health`
- [ ] OpenAPI docs generate: Navigate to `/docs` successfully
- [ ] Cultural middleware integrates without errors
- [ ] Error responses follow consistent format
- [ ] All Pydantic models serialize/deserialize correctly

---

## Anti-Patterns to Avoid
- ❌ Don't use sync functions for I/O operations - use async/await
- ❌ Don't catch generic Exception - be specific with error types  
- ❌ Don't skip Pydantic model validation - always define proper models
- ❌ Don't hardcode URLs or settings - use environment variables
- ❌ Don't ignore middleware order - cultural validation must come first
- ❌ Don't leak sensitive information in error responses
- ❌ Don't skip the lifespan context manager - services need proper initialization
- ❌ Don't create endpoints directly on app - use APIRouter pattern