"""
Cultural Compliance FastAPI Endpoints

Provides REST and WebSocket endpoints for cultural compliance validation,
preferences management, and compliance history tracking.
"""

from datetime import datetime, timezone
from typing import Optional
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    WebSocket,
    WebSocketDisconnect,
    Request,
)
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
import asyncio
from collections import defaultdict, deque
import time
import threading
import logging

from apps.api.agents.tools.cultural_validation_tool import (
    CulturalValidationTool,
    CulturalValidationDependencies,
)
from apps.api.services.arabic_language_processor import get_arabic_processor

# Configure logging
logger = logging.getLogger(__name__)


# ============================================================================
# Pydantic Models
# ============================================================================


class ValidationRequest(BaseModel):
    """Request model for content validation."""

    content: str = Field(..., description="The content to validate")
    context: str = Field(
        "general",
        description="Context for validation (general, legal, medical, educational, organizational)",
    )
    cultural_mode: str = Field(
        "strict", description="Validation mode (strict, moderate, flexible)"
    )
    user_id: Optional[str] = Field(
        None, description="Optional user ID to load preferences"
    )


class ValidationResponse(BaseModel):
    """Response model for validation results."""

    validation_passed: bool
    cultural_appropriateness_score: float = Field(
        ..., ge=0, le=1, description="Score from 0-1"
    )
    islamic_compliance: bool
    political_sensitivity_detected: bool
    improvement_suggestions: list[str]
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ComplianceRules(BaseModel):
    """Model for compliance rules."""

    rule_id: str
    category: str  # islamic, cultural, political, professional
    description: str
    severity: str  # critical, high, medium, low
    examples: list[str]


class UserPreferences(BaseModel):
    """User preferences for validation."""

    user_id: str
    cultural_mode: str = "strict"
    validate_political_neutrality: bool = True
    check_family_values: bool = True
    check_professional_respect: bool = True
    language_preference: str = "mixed"
    arabic_dialect: str = "iraqi"
    professional_domain: Optional[str] = None


class HistoryEntry(BaseModel):
    """Compliance validation history entry."""

    id: str
    user_id: str
    timestamp: datetime
    content: str
    validation_passed: bool
    cultural_score: float
    suggestions: list[str]


# ============================================================================
# In-Memory Storage (Replace with Database in Production)
# ============================================================================

user_preferences: dict[str, UserPreferences] = {}
validation_history: dict[str, deque] = defaultdict(lambda: deque(maxlen=1000))
active_websockets: dict[str, WebSocket] = {}

# Rate limiter configuration
RATE_LIMIT_REQUESTS = 100
RATE_LIMIT_WINDOW = 3600  # 1 hour in seconds
rate_limit_tracker: dict[str, list[float]] = defaultdict(list)
_rate_limit_lock = threading.Lock()


# ============================================================================
# Rate Limiting
# ============================================================================


def check_rate_limit(client_id: str) -> bool:
    """
    Check if client has exceeded rate limit.

    Thread-safe atomic check-and-increment operation to prevent
    concurrent bypass attacks.
    """
    with _rate_limit_lock:
        now = time.time()
        window_start = now - RATE_LIMIT_WINDOW

        # Clean old requests outside window
        rate_limit_tracker[client_id] = [
            req_time
            for req_time in rate_limit_tracker[client_id]
            if req_time > window_start
        ]

        if len(rate_limit_tracker[client_id]) >= RATE_LIMIT_REQUESTS:
            return False

        rate_limit_tracker[client_id].append(now)
        return True


# ============================================================================
# Middleware
# ============================================================================


async def get_client_id(request: Request) -> str:
    """
    Extract client ID from request (IP address or user ID).

    Raises HTTPException if client cannot be identified to prevent
    grouping of unidentified clients.
    """
    if request.client is None:
        raise HTTPException(status_code=400, detail="Client identification required")
    return request.client.host


# ============================================================================
# Router Setup
# ============================================================================

router = APIRouter(
    prefix="/api/v1/cultural-compliance",
    tags=["cultural-compliance"],
    responses={404: {"description": "Not found"}},
)


# ============================================================================
# Endpoints
# ============================================================================


@router.post("/validate", response_model=ValidationResponse)
async def validate_content(
    request: ValidationRequest,
    client_id: str = Depends(get_client_id),
) -> ValidationResponse:
    """
    Validate content for cultural and Islamic compliance.

    **Endpoint**: POST /api/v1/cultural-compliance/validate

    **Parameters**:
    - content: The content to validate
    - context: Type of content (general, legal, medical, educational, organizational)
    - cultural_mode: Validation mode (strict, moderate, flexible)
    - user_id: Optional user ID to load preferences

    **Returns**: ValidationResponse with scores and recommendations

    **Rate Limit**: 100 requests per hour per client
    """
    # Check rate limit
    if not check_rate_limit(client_id):
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded: 100 requests per hour",
        )

    # Load user preferences if user_id provided
    if request.user_id and request.user_id in user_preferences:
        user_prefs = user_preferences[request.user_id]
        # Use user preferences as overrides
        deps = CulturalValidationDependencies(
            cultural_mode=request.cultural_mode or user_prefs.cultural_mode,
            islamic_compliance_required=True,
            language_preference=user_prefs.language_preference,
            arabic_dialect=user_prefs.arabic_dialect,
            validate_political_neutrality=user_prefs.validate_political_neutrality,
            check_family_values=user_prefs.check_family_values,
            check_professional_respect=user_prefs.check_professional_respect,
            professional_domain=user_prefs.professional_domain,
        )
    else:
        # Use defaults from request
        deps = CulturalValidationDependencies(
            cultural_mode=request.cultural_mode,
            islamic_compliance_required=True,
            language_preference="mixed",
            arabic_dialect="iraqi",
            validate_political_neutrality=True,
            check_family_values=True,
            check_professional_respect=True,
        )

    # Validate content
    validation = CulturalValidationTool.validate_cultural_compliance(
        request.content, deps
    )

    response = ValidationResponse(
        validation_passed=validation.validation_passed,
        cultural_appropriateness_score=validation.cultural_appropriateness_score,
        islamic_compliance=validation.islamic_compliance,
        political_sensitivity_detected=validation.political_sensitivity_detected,
        improvement_suggestions=validation.improvement_suggestions,
    )

    return response


@router.get("/rules", response_model=list[ComplianceRules])
async def get_compliance_rules() -> list[ComplianceRules]:
    """
    Get list of compliance rules.

    **Endpoint**: GET /api/v1/cultural-compliance/rules

    **Returns**: List of compliance rules with descriptions and examples

    This endpoint provides information about the compliance framework
    used for cultural and Islamic validation.
    """
    rules = [
        ComplianceRules(
            rule_id="ISLAMIC_COMPLIANCE_001",
            category="islamic",
            description="Islamic compliance is mandatory (100% required)",
            severity="critical",
            examples=[
                "Avoid references to alcohol, gambling, interest, pork",
                "Ensure Islamic values are respected in all content",
                "Use appropriate Islamic terminology and concepts",
            ],
        ),
        ComplianceRules(
            rule_id="CULTURAL_APPROPRIATENESS_001",
            category="cultural",
            description="Cultural appropriateness minimum 95%",
            severity="high",
            examples=[
                "Respect Iraqi family values and hierarchy",
                "Use appropriate social etiquette",
                "Avoid culturally insensitive statements",
            ],
        ),
        ComplianceRules(
            rule_id="POLITICAL_NEUTRALITY_001",
            category="political",
            description="Maintain political neutrality and avoid sectarian content",
            severity="high",
            examples=[
                "Avoid sectarian terminology (شيعي, سني, etc.)",
                "Don't promote specific political parties",
                "Use inclusive, neutral language",
            ],
        ),
        ComplianceRules(
            rule_id="PROFESSIONAL_RESPECT_001",
            category="professional",
            description="Use proper professional titles and respect hierarchy",
            severity="medium",
            examples=[
                "Use الدكتور, المهندس for professional titles",
                "Respect organizational hierarchy",
                "Use appropriate professional courtesy",
            ],
        ),
    ]
    return rules


@router.get("/preferences/{user_id}", response_model=UserPreferences)
async def get_user_preferences(user_id: str) -> UserPreferences:
    """
    Get user's validation preferences.

    **Endpoint**: GET /api/v1/cultural-compliance/preferences/{user_id}

    **Parameters**:
    - user_id: The user ID

    **Returns**: UserPreferences object

    Returns the user's current compliance validation preferences.
    If user has no preferences, returns default strict settings.
    """
    if user_id not in user_preferences:
        # Return default preferences
        return UserPreferences(user_id=user_id)

    return user_preferences[user_id]


@router.put("/preferences/{user_id}", response_model=UserPreferences)
async def update_user_preferences(
    user_id: str,
    preferences: UserPreferences,
) -> UserPreferences:
    """
    Update user's validation preferences.

    **Endpoint**: PUT /api/v1/cultural-compliance/preferences/{user_id}

    **Parameters**:
    - user_id: The user ID
    - preferences: Updated UserPreferences object

    **Returns**: Updated UserPreferences object

    Updates the user's validation preferences for cultural compliance checking.
    """
    preferences.user_id = user_id
    user_preferences[user_id] = preferences
    return preferences


@router.get("/history/{user_id}", response_model=list[HistoryEntry])
async def get_validation_history(
    user_id: str,
    limit: int = 50,
    offset: int = 0,
) -> list[HistoryEntry]:
    """
    Get user's validation history.

    **Endpoint**: GET /api/v1/cultural-compliance/history/{user_id}

    **Parameters**:
    - user_id: The user ID
    - limit: Maximum number of entries to return (default: 50)
    - offset: Number of entries to skip (default: 0)

    **Returns**: List of HistoryEntry objects

    Retrieves the user's compliance validation history, paginated.
    """
    user_history = list(validation_history.get(user_id, deque()))
    return user_history[offset : offset + limit]


# ============================================================================
# WebSocket Endpoint for Real-Time Validation
# ============================================================================


@router.websocket("/ws/validate/{user_id}")
async def websocket_validate(websocket: WebSocket, user_id: str):
    """
    WebSocket endpoint for real-time content validation.

    **Endpoint**: WS /api/v1/cultural-compliance/ws/validate/{user_id}

    **Protocol**:
    - Client sends: {"content": "text to validate", "context": "general"}
    - Server responds: {"validation_passed": bool, "cultural_score": float, ...}
    - Send "close" message to disconnect

    **Features**:
    - Real-time validation as user types
    - Streaming validation results
    - Immediate feedback on compliance issues

    **Security**:
    - Requires valid user_id
    - Validates user_id before accepting connection
    """
    # Validate user_id before accepting connection
    if not user_id or not user_id.strip():
        await websocket.close(code=1008, reason="Invalid user_id")
        return

    await websocket.accept()
    active_websockets[user_id] = websocket

    # Get user preferences
    user_prefs = user_preferences.get(
        user_id,
        UserPreferences(user_id=user_id),
    )

    try:
        while True:
            # Receive message from client
            data = await websocket.receive_json()

            if data.get("type") == "close":
                break

            content = data.get("content", "")
            context = data.get("context", "general")

            # Use single timestamp for consistency
            timestamp = datetime.now(timezone.utc)

            # Create validation dependencies from user preferences
            deps = CulturalValidationDependencies(
                cultural_mode=user_prefs.cultural_mode,
                islamic_compliance_required=True,
                language_preference=user_prefs.language_preference,
                arabic_dialect=user_prefs.arabic_dialect,
                professional_domain=user_prefs.professional_domain,
                validate_political_neutrality=user_prefs.validate_political_neutrality,
                check_family_values=user_prefs.check_family_values,
                check_professional_respect=user_prefs.check_professional_respect,
            )

            # Validate content
            validation = CulturalValidationTool.validate_cultural_compliance(
                content, deps
            )

            # Analyze Arabic content
            processor = get_arabic_processor()
            arabic_analysis = processor.analyze_text(content)

            # Send validation result back to client
            await websocket.send_json(
                {
                    "type": "validation_result",
                    "validation_passed": validation.validation_passed,
                    "cultural_score": validation.cultural_appropriateness_score,
                    "islamic_compliant": validation.islamic_compliance,
                    "political_sensitivity": validation.political_sensitivity_detected,
                    "suggestions": validation.improvement_suggestions,
                    "arabic_percentage": arabic_analysis.arabic_percentage,
                    "dialect": arabic_analysis.dialect.value,
                    "rtl_required": arabic_analysis.rtl_required,
                    "timestamp": timestamp.isoformat(),
                }
            )

            # Add to history using deque (auto-manages max size)
            history_entry = HistoryEntry(
                id=f"{user_id}_{timestamp.timestamp()}",
                user_id=user_id,
                timestamp=timestamp,
                content=content[:1000],  # Store first 1000 chars
                validation_passed=validation.validation_passed,
                cultural_score=validation.cultural_appropriateness_score,
                suggestions=validation.improvement_suggestions,
            )
            validation_history[user_id].append(history_entry)

    except WebSocketDisconnect:
        active_websockets.pop(user_id, None)
    except Exception as e:
        # Log full exception server-side for debugging
        logger.exception(f"WebSocket error for user {user_id}: {e}")
        # Send generic error to client (no sensitive details)
        try:
            await websocket.send_json(
                {"type": "error", "message": "Internal server error"}
            )
        except Exception:
            pass  # Connection may already be closed
        active_websockets.pop(user_id, None)


# ============================================================================
# Health Check
# ============================================================================


@router.get("/health")
async def health_check() -> dict:
    """
    Health check endpoint for cultural compliance service.

    **Endpoint**: GET /api/v1/cultural-compliance/health

    **Returns**: Service status information
    """
    return {
        "status": "healthy",
        "service": "cultural-compliance",
        "version": "1.0.0",
        "features": [
            "content validation",
            "arabic processing",
            "compliance rules",
            "user preferences",
            "validation history",
            "websocket validation",
            "rate limiting",
        ],
    }
