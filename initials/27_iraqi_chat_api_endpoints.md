# Iraqi Chat API Endpoints for Iraqi AI Chat System

## TECHNOLOGY/FRAMEWORK:

**Comprehensive Iraqi AI chat API system** with FastAPI endpoints, Arabic text processing APIs, cultural validation endpoints, agent coordination APIs, professional domain services, and real-time WebSocket connections for complete Iraqi AI chat functionality.

**Specific technologies:** FastAPI with Arabic support, Pydantic models for Iraqi data, WebSocket integration, cultural validation APIs, agent coordination endpoints, professional domain APIs, payment gateway integration, and Islamic compliance validation.

---

## TEMPLATE PURPOSE:

**Building specialized Iraqi AI chat API foundation** that provides chat conversation endpoints, Arabic text processing APIs, cultural validation services, agent coordination APIs, professional domain endpoints, payment integration, and real-time communication for complete Iraqi AI chat system functionality.

**Developers should be able to:** Create chat conversation APIs, implement Arabic text processing endpoints, integrate cultural validation services, coordinate agent APIs, manage professional domain endpoints, process payment transactions, and handle real-time WebSocket connections.

---

## CORE FEATURES:

**Iraqi AI chat-specific API infrastructure:**

### Chat Conversation APIs
- **Conversation Management:** REST APIs for creating, managing, and retrieving Iraqi AI chat conversations
- **Message Processing:** Arabic-aware message APIs with cultural validation and Iraqi dialect processing
- **Conversation History:** Conversation history APIs with cultural context preservation and professional domain filtering
- **Context Management:** Cross-session context APIs with cultural and professional context persistence
- **Multi-Agent Chat:** APIs supporting coordination between 21 specialized Iraqi AI agents
- **Real-time Messaging:** WebSocket APIs for live chat with cultural timing awareness

### Arabic Text Processing APIs
- **RTL Text Processing:** APIs for right-to-left text processing and Arabic language validation
- **Iraqi Dialect Recognition:** Dialect processing APIs with Baghdad, Basra, Mosul, Erbil regional support
- **Mixed Language Processing:** APIs handling Arabic-English code-switching and mixed content
- **Cultural Text Analysis:** Text analysis APIs with Iraqi cultural context and Islamic compliance validation
- **Professional Arabic Processing:** Specialized APIs for Iraqi legal, medical, educational Arabic terminology
- **Arabic Search and Retrieval:** Search APIs optimized for Arabic text with dialect-aware indexing

### Cultural Validation Endpoints
- **Cultural Appropriateness Validation:** APIs for validating content against Iraqi cultural standards
- **Islamic Compliance Checking:** APIs for Islamic compliance validation and Sharia principle verification
- **Regional Cultural Adaptation:** APIs for adapting content to specific Iraqi regional cultural variations
- **Professional Cultural Standards:** APIs for validating professional content against Iraqi professional ethics
- **Political Neutrality Validation:** APIs ensuring political neutrality and avoiding sectarian content
- **Cultural Recommendation Engine:** APIs providing cultural improvement recommendations and guidance

### Agent Coordination APIs
- **Multi-Agent Orchestration:** APIs for coordinating workflows across 21 specialized Iraqi AI agents
- **Agent Performance Monitoring:** APIs for tracking agent performance and cultural compliance metrics
- **Context Sharing APIs:** APIs for sharing cultural and professional context between agents
- **Agent Communication:** APIs for secure communication and coordination between specialized agents
- **Workflow Management:** APIs for managing complex multi-agent workflows with cultural validation
- **Agent Health Monitoring:** APIs for monitoring agent health and performance optimization

---

## EXAMPLES TO INCLUDE:

**Iraqi AI chat-specific API examples:**

### Chat Conversation APIs
```python
# Iraqi Chat Conversation API Endpoints
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime

app = FastAPI(title="Iraqi AI Chat API", version="1.0.0")

# Pydantic Models for Iraqi Chat
class IraqiChatMessage(BaseModel):
    message_id: uuid.UUID = Field(default_factory=uuid.uuid4)
    conversation_id: uuid.UUID
    user_id: uuid.UUID
    message_text: str = Field(..., min_length=1, max_length=10000)
    message_language: str = Field(default="ar-IQ", pattern="^(ar-IQ|en-US|mixed)$")

    # Cultural context
    cultural_context: dict = Field(default_factory=dict)
    islamic_compliance_required: bool = Field(default=True)
    regional_context: str = Field(default="iraqi_general")

    # Professional context
    professional_domain: Optional[str] = Field(None, pattern="^(legal|medical|educational|business)$")
    confidentiality_level: str = Field(default="standard")

    # Arabic processing
    contains_arabic: bool = Field(default=True)
    dialect_context: str = Field(default="iraqi_general")
    rtl_processing_required: bool = Field(default=True)

class IraqiChatResponse(BaseModel):
    response_id: uuid.UUID = Field(default_factory=uuid.uuid4)
    conversation_id: uuid.UUID
    responding_agent: str
    response_text: str
    response_language: str = Field(default="ar-IQ")

    # Cultural validation results
    cultural_compliance_score: float = Field(..., ge=0.0, le=1.0)
    islamic_compliance_score: float = Field(..., ge=0.0, le=1.0)
    regional_appropriateness_score: float = Field(..., ge=0.0, le=1.0)

    # Agent coordination
    agents_involved: List[str] = Field(default_factory=list)
    coordination_duration_ms: int

    # Performance metrics
    response_time_ms: int
    token_usage: int
    cost_iqd: float

    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ConversationCreateRequest(BaseModel):
    user_id: uuid.UUID
    conversation_title: str = Field(..., max_length=300)
    conversation_type: str = Field(default="general_chat")

    # Cultural preferences
    primary_language: str = Field(default="ar-IQ")
    cultural_sensitivity_level: str = Field(default="high")
    islamic_compliance_level: str = Field(default="standard")
    regional_preference: str = Field(default="iraqi_general")

    # Professional context
    professional_domain: Optional[str] = None
    professional_context: dict = Field(default_factory=dict)

# Chat Conversation Endpoints
@app.post("/api/v1/conversations/", response_model=dict)
async def create_conversation(
    request: ConversationCreateRequest,
    current_user = Depends(get_current_user)
):
    """Create a new Iraqi AI chat conversation with cultural context."""

    # Validate user cultural preferences
    cultural_validation = await validate_user_cultural_context(
        user_id=request.user_id,
        cultural_preferences={
            "language": request.primary_language,
            "sensitivity_level": request.cultural_sensitivity_level,
            "islamic_compliance": request.islamic_compliance_level,
            "regional_preference": request.regional_preference
        }
    )

    if not cultural_validation.valid:
        raise HTTPException(
            status_code=400,
            detail={
                "error": "Invalid cultural preferences",
                "cultural_issues": cultural_validation.issues
            }
        )

    # Create conversation with cultural context
    conversation = await conversation_service.create_conversation({
        "user_id": request.user_id,
        "title": request.conversation_title,
        "type": request.conversation_type,
        "cultural_context": cultural_validation.validated_context,
        "professional_context": request.professional_context,
        "primary_agent": await select_primary_agent(
            conversation_type=request.conversation_type,
            professional_domain=request.professional_domain,
            cultural_context=cultural_validation.validated_context
        )
    })

    return {
        "conversation_id": conversation.id,
        "cultural_context": conversation.cultural_context,
        "primary_agent": conversation.primary_agent,
        "created_at": conversation.created_at
    }

@app.post("/api/v1/conversations/{conversation_id}/messages", response_model=IraqiChatResponse)
async def send_message(
    conversation_id: uuid.UUID,
    message: IraqiChatMessage,
    current_user = Depends(get_current_user)
):
    """Send a message in Iraqi AI chat with cultural validation."""

    # Validate conversation access
    conversation = await conversation_service.get_conversation(conversation_id)
    if not conversation or conversation.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Arabic text preprocessing
    if message.contains_arabic:
        arabic_processing = await arabic_processor.process_text({
            "text": message.message_text,
            "dialect_context": message.dialect_context,
            "cultural_context": message.cultural_context,
            "rtl_processing": message.rtl_processing_required
        })

        if not arabic_processing.success:
            raise HTTPException(
                status_code=400,
                detail={
                    "error": "Arabic text processing failed",
                    "processing_issues": arabic_processing.issues
                }
            )

        message.message_text = arabic_processing.processed_text

    # Cultural validation
    cultural_validation = await cultural_validator.validate_message({
        "message": message.message_text,
        "cultural_context": message.cultural_context,
        "islamic_compliance_required": message.islamic_compliance_required,
        "regional_context": message.regional_context,
        "professional_domain": message.professional_domain
    })

    if not cultural_validation.approved:
        raise HTTPException(
            status_code=422,
            detail={
                "error": "Message violates cultural standards",
                "cultural_issues": cultural_validation.issues,
                "suggestions": cultural_validation.improvement_suggestions
            }
        )

    # Multi-agent processing
    agent_response = await agent_coordinator.process_message({
        "message": message,
        "conversation": conversation,
        "cultural_validation": cultural_validation,
        "arabic_processing": arabic_processing if message.contains_arabic else None
    })

    # Format response
    response = IraqiChatResponse(
        conversation_id=conversation_id,
        responding_agent=agent_response.primary_agent,
        response_text=agent_response.response_text,
        response_language=agent_response.response_language,
        cultural_compliance_score=cultural_validation.compliance_score,
        islamic_compliance_score=cultural_validation.islamic_score,
        regional_appropriateness_score=cultural_validation.regional_score,
        agents_involved=agent_response.agents_involved,
        coordination_duration_ms=agent_response.coordination_time,
        response_time_ms=agent_response.total_response_time,
        token_usage=agent_response.tokens_used,
        cost_iqd=agent_response.cost_iqd
    )

    return response
```

### Cultural Validation APIs
```python
# Cultural Validation API Endpoints
class CulturalValidationRequest(BaseModel):
    content: str = Field(..., min_length=1, max_length=50000)
    content_type: str = Field(default="text", pattern="^(text|audio|image|document)$")
    content_language: str = Field(default="ar-IQ")

    # Validation context
    cultural_context: dict = Field(default_factory=dict)
    user_region: str = Field(default="iraqi_general")
    islamic_compliance_level: str = Field(default="standard")
    professional_domain: Optional[str] = None

    # Validation requirements
    strict_validation: bool = Field(default=False)
    validate_political_neutrality: bool = Field(default=True)
    validate_cultural_sensitivity: bool = Field(default=True)
    validate_islamic_compliance: bool = Field(default=True)

class CulturalValidationResponse(BaseModel):
    validation_id: uuid.UUID = Field(default_factory=uuid.uuid4)
    overall_approved: bool
    overall_score: float = Field(..., ge=0.0, le=1.0)

    # Detailed scores
    cultural_appropriateness_score: float = Field(..., ge=0.0, le=1.0)
    islamic_compliance_score: float = Field(..., ge=0.0, le=1.0)
    regional_appropriateness_score: float = Field(..., ge=0.0, le=1.0)
    political_neutrality_score: float = Field(..., ge=0.0, le=1.0)
    professional_appropriateness_score: Optional[float] = None

    # Validation results
    cultural_issues: List[dict] = Field(default_factory=list)
    islamic_compliance_issues: List[dict] = Field(default_factory=list)
    regional_sensitivity_issues: List[dict] = Field(default_factory=list)
    political_neutrality_issues: List[dict] = Field(default_factory=list)

    # Recommendations
    improvement_recommendations: List[dict] = Field(default_factory=list)
    alternative_phrasings: List[str] = Field(default_factory=list)
    cultural_guidance: dict = Field(default_factory=dict)

    # Validation metadata
    validation_method: str
    validation_confidence: float = Field(..., ge=0.0, le=1.0)
    validation_duration_ms: int

    timestamp: datetime = Field(default_factory=datetime.utcnow)

@app.post("/api/v1/cultural-validation/validate", response_model=CulturalValidationResponse)
async def validate_cultural_content(
    request: CulturalValidationRequest,
    current_user = Depends(get_current_user)
):
    """Validate content against Iraqi cultural standards and Islamic compliance."""

    # Initialize validation engines
    cultural_validator = IraqiCulturalValidator()
    islamic_validator = IslamicComplianceValidator()
    regional_validator = RegionalCulturalValidator()
    political_validator = PoliticalNeutralityValidator()

    # Perform multi-dimensional validation
    validation_results = await perform_comprehensive_validation({
        "content": request.content,
        "content_type": request.content_type,
        "cultural_context": request.cultural_context,
        "user_region": request.user_region,
        "islamic_compliance_level": request.islamic_compliance_level,
        "professional_domain": request.professional_domain,
        "validation_strictness": "strict" if request.strict_validation else "standard"
    })

    # Professional domain validation if applicable
    professional_validation = None
    if request.professional_domain:
        professional_validator = ProfessionalDomainValidator(request.professional_domain)
        professional_validation = await professional_validator.validate({
            "content": request.content,
            "professional_context": request.cultural_context.get("professional_context", {}),
            "iraqi_professional_standards": True,
            "confidentiality_requirements": True
        })

    # Aggregate validation results
    overall_approved = (
        validation_results.cultural_validation.approved and
        validation_results.islamic_validation.approved and
        validation_results.regional_validation.approved and
        validation_results.political_validation.approved and
        (professional_validation.approved if professional_validation else True)
    )

    # Calculate overall score
    overall_score = calculate_weighted_score({
        "cultural": validation_results.cultural_validation.score,
        "islamic": validation_results.islamic_validation.score,
        "regional": validation_results.regional_validation.score,
        "political": validation_results.political_validation.score,
        "professional": professional_validation.score if professional_validation else 1.0
    })

    # Generate recommendations
    recommendations = await generate_improvement_recommendations({
        "validation_results": validation_results,
        "professional_validation": professional_validation,
        "cultural_context": request.cultural_context,
        "user_preferences": await get_user_cultural_preferences(current_user.id)
    })

    return CulturalValidationResponse(
        overall_approved=overall_approved,
        overall_score=overall_score,
        cultural_appropriateness_score=validation_results.cultural_validation.score,
        islamic_compliance_score=validation_results.islamic_validation.score,
        regional_appropriateness_score=validation_results.regional_validation.score,
        political_neutrality_score=validation_results.political_validation.score,
        professional_appropriateness_score=professional_validation.score if professional_validation else None,
        cultural_issues=validation_results.cultural_validation.issues,
        islamic_compliance_issues=validation_results.islamic_validation.issues,
        regional_sensitivity_issues=validation_results.regional_validation.issues,
        political_neutrality_issues=validation_results.political_validation.issues,
        improvement_recommendations=recommendations.improvements,
        alternative_phrasings=recommendations.alternatives,
        cultural_guidance=recommendations.guidance,
        validation_method="multi_dimensional_iraqi_validation",
        validation_confidence=validation_results.overall_confidence,
        validation_duration_ms=validation_results.total_duration_ms
    )

@app.get("/api/v1/cultural-validation/guidelines/{region}")
async def get_cultural_guidelines(
    region: str,
    professional_domain: Optional[str] = None,
    current_user = Depends(get_current_user)
):
    """Get cultural guidelines for specific Iraqi region and professional domain."""

    guidelines = await cultural_guidelines_service.get_guidelines({
        "region": region,
        "professional_domain": professional_domain,
        "include_islamic_guidelines": True,
        "include_professional_ethics": professional_domain is not None,
        "user_cultural_level": await get_user_cultural_level(current_user.id)
    })

    return {
        "region": region,
        "professional_domain": professional_domain,
        "cultural_guidelines": guidelines.cultural_guidelines,
        "islamic_guidelines": guidelines.islamic_guidelines,
        "professional_guidelines": guidelines.professional_guidelines if professional_domain else None,
        "regional_variations": guidelines.regional_variations,
        "cultural_examples": guidelines.examples,
        "last_updated": guidelines.last_updated
    }
```

### Agent Coordination APIs
```python
# Agent Coordination API Endpoints
class AgentCoordinationRequest(BaseModel):
    coordination_type: str = Field(..., pattern="^(workflow|consultation|validation|parallel_processing)$")
    primary_agent: str
    target_agents: List[str]
    coordination_context: dict = Field(default_factory=dict)

    # Cultural coordination requirements
    cultural_context_sharing: bool = Field(default=True)
    cultural_validation_required: bool = Field(default=True)
    islamic_compliance_required: bool = Field(default=True)

    # Professional coordination
    professional_domain: Optional[str] = None
    confidentiality_level: str = Field(default="standard")
    professional_validation_required: bool = Field(default=False)

    # Performance requirements
    max_coordination_time_ms: int = Field(default=5000)
    parallel_execution_allowed: bool = Field(default=True)

class AgentCoordinationResponse(BaseModel):
    coordination_id: uuid.UUID = Field(default_factory=uuid.uuid4)
    coordination_successful: bool
    agents_coordinated: List[str]
    coordination_duration_ms: int

    # Cultural coordination results
    cultural_context_preserved: bool
    cultural_validation_passed: bool
    islamic_compliance_maintained: bool

    # Professional coordination results
    professional_context_preserved: bool
    confidentiality_maintained: bool
    professional_validation_passed: Optional[bool] = None

    # Coordination results
    coordination_results: dict = Field(default_factory=dict)
    agent_performance_metrics: dict = Field(default_factory=dict)

    # Cost and efficiency
    total_tokens_used: int
    total_cost_iqd: float
    coordination_efficiency_score: float = Field(..., ge=0.0, le=1.0)

    timestamp: datetime = Field(default_factory=datetime.utcnow)

@app.post("/api/v1/agents/coordinate", response_model=AgentCoordinationResponse)
async def coordinate_agents(
    request: AgentCoordinationRequest,
    current_user = Depends(get_current_user)
):
    """Coordinate multiple Iraqi AI agents for complex workflows."""

    # Validate agent availability and capabilities
    agent_validation = await agent_registry.validate_agent_coordination({
        "primary_agent": request.primary_agent,
        "target_agents": request.target_agents,
        "coordination_type": request.coordination_type,
        "cultural_requirements": {
            "cultural_context_sharing": request.cultural_context_sharing,
            "cultural_validation_required": request.cultural_validation_required,
            "islamic_compliance_required": request.islamic_compliance_required
        },
        "professional_requirements": {
            "professional_domain": request.professional_domain,
            "confidentiality_level": request.confidentiality_level,
            "professional_validation_required": request.professional_validation_required
        }
    })

    if not agent_validation.valid:
        raise HTTPException(
            status_code=400,
            detail={
                "error": "Agent coordination validation failed",
                "validation_issues": agent_validation.issues,
                "available_agents": agent_validation.available_alternatives
            }
        )

    # Execute agent coordination
    coordination_result = await agent_coordinator.execute_coordination({
        "coordination_request": request,
        "validated_agents": agent_validation.validated_agents,
        "user_context": await get_user_context(current_user.id),
        "cultural_context": request.coordination_context.get("cultural_context", {}),
        "professional_context": request.coordination_context.get("professional_context", {}),
        "max_duration_ms": request.max_coordination_time_ms
    })

    # Validate coordination results
    if request.cultural_validation_required:
        cultural_validation = await validate_coordination_cultural_compliance({
            "coordination_result": coordination_result,
            "cultural_requirements": request.coordination_context.get("cultural_context", {}),
            "islamic_compliance_level": request.islamic_compliance_required
        })

        if not cultural_validation.compliant:
            raise HTTPException(
                status_code=422,
                detail={
                    "error": "Coordination results violate cultural requirements",
                    "cultural_issues": cultural_validation.issues
                }
            )

    return AgentCoordinationResponse(
        coordination_successful=coordination_result.successful,
        agents_coordinated=coordination_result.agents_involved,
        coordination_duration_ms=coordination_result.duration_ms,
        cultural_context_preserved=coordination_result.cultural_context_preserved,
        cultural_validation_passed=coordination_result.cultural_validation_passed,
        islamic_compliance_maintained=coordination_result.islamic_compliance_maintained,
        professional_context_preserved=coordination_result.professional_context_preserved,
        confidentiality_maintained=coordination_result.confidentiality_maintained,
        professional_validation_passed=coordination_result.professional_validation_passed,
        coordination_results=coordination_result.results,
        agent_performance_metrics=coordination_result.performance_metrics,
        total_tokens_used=coordination_result.total_tokens,
        total_cost_iqd=coordination_result.cost_iqd,
        coordination_efficiency_score=coordination_result.efficiency_score
    )

@app.get("/api/v1/agents/performance/{agent_name}")
async def get_agent_performance(
    agent_name: str,
    time_period: str = "24h",
    include_cultural_metrics: bool = True,
    current_user = Depends(get_current_user)
):
    """Get performance metrics for a specific Iraqi AI agent."""

    performance_data = await agent_performance_service.get_performance_metrics({
        "agent_name": agent_name,
        "time_period": time_period,
        "include_cultural_metrics": include_cultural_metrics,
        "include_professional_metrics": True,
        "user_context": await get_user_context(current_user.id)
    })

    return {
        "agent_name": agent_name,
        "time_period": time_period,
        "performance_summary": performance_data.summary,
        "cultural_performance": performance_data.cultural_metrics if include_cultural_metrics else None,
        "professional_performance": performance_data.professional_metrics,
        "usage_statistics": performance_data.usage_stats,
        "quality_metrics": performance_data.quality_metrics,
        "cost_efficiency": performance_data.cost_efficiency,
        "user_satisfaction": performance_data.user_satisfaction,
        "recommendations": performance_data.optimization_recommendations
    }
```

### Real-time WebSocket APIs
```python
# Real-time WebSocket API Endpoints
from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict, List
import json

class WebSocketConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.user_connections: Dict[str, List[str]] = {}

    async def connect(self, websocket: WebSocket, connection_id: str, user_id: str):
        await websocket.accept()
        self.active_connections[connection_id] = websocket

        if user_id not in self.user_connections:
            self.user_connections[user_id] = []
        self.user_connections[user_id].append(connection_id)

    def disconnect(self, connection_id: str, user_id: str):
        if connection_id in self.active_connections:
            del self.active_connections[connection_id]

        if user_id in self.user_connections:
            self.user_connections[user_id].remove(connection_id)
            if not self.user_connections[user_id]:
                del self.user_connections[user_id]

    async def send_personal_message(self, message: dict, connection_id: str):
        if connection_id in self.active_connections:
            websocket = self.active_connections[connection_id]
            await websocket.send_text(json.dumps(message))

    async def send_user_message(self, message: dict, user_id: str):
        if user_id in self.user_connections:
            for connection_id in self.user_connections[user_id]:
                await self.send_personal_message(message, connection_id)

connection_manager = WebSocketConnectionManager()

@app.websocket("/api/v1/ws/chat/{conversation_id}")
async def websocket_chat_endpoint(
    websocket: WebSocket,
    conversation_id: str,
    token: str = None
):
    """Real-time WebSocket endpoint for Iraqi AI chat with cultural validation."""

    # Authenticate WebSocket connection
    try:
        user = await authenticate_websocket_token(token)
        if not user:
            await websocket.close(code=1008, reason="Authentication failed")
            return
    except Exception as e:
        await websocket.close(code=1008, reason="Invalid authentication")
        return

    # Validate conversation access
    conversation = await conversation_service.get_conversation(conversation_id)
    if not conversation or conversation.user_id != user.id:
        await websocket.close(code=1008, reason="Conversation access denied")
        return

    connection_id = f"{user.id}:{conversation_id}:{uuid.uuid4()}"

    try:
        await connection_manager.connect(websocket, connection_id, str(user.id))

        # Send connection confirmation with cultural context
        await connection_manager.send_personal_message({
            "type": "connection_established",
            "conversation_id": conversation_id,
            "cultural_context": conversation.cultural_context,
            "available_agents": await get_available_agents_for_conversation(conversation),
            "cultural_guidelines": await get_cultural_guidelines_for_user(user.id)
        }, connection_id)

        while True:
            # Receive message from WebSocket
            data = await websocket.receive_text()
            message_data = json.loads(data)

            # Validate message format
            if not validate_websocket_message_format(message_data):
                await connection_manager.send_personal_message({
                    "type": "error",
                    "error": "Invalid message format",
                    "cultural_message": await get_cultural_error_message(
                        "invalid_format", user.cultural_context
                    )
                }, connection_id)
                continue

            # Process message based on type
            if message_data["type"] == "chat_message":
                await process_websocket_chat_message({
                    "message_data": message_data,
                    "conversation": conversation,
                    "user": user,
                    "connection_id": connection_id,
                    "websocket_manager": connection_manager
                })

            elif message_data["type"] == "typing_indicator":
                await handle_typing_indicator({
                    "conversation_id": conversation_id,
                    "user_id": user.id,
                    "typing_status": message_data["typing"],
                    "cultural_context": conversation.cultural_context
                })

            elif message_data["type"] == "cultural_preference_update":
                await handle_cultural_preference_update({
                    "user_id": user.id,
                    "conversation_id": conversation_id,
                    "cultural_updates": message_data["cultural_preferences"],
                    "connection_id": connection_id
                })

            elif message_data["type"] == "agent_coordination_request":
                await handle_agent_coordination_request({
                    "coordination_request": message_data["coordination"],
                    "conversation": conversation,
                    "user": user,
                    "connection_id": connection_id
                })

    except WebSocketDisconnect:
        connection_manager.disconnect(connection_id, str(user.id))

        # Log disconnection with cultural context
        await log_websocket_disconnection({
            "user_id": user.id,
            "conversation_id": conversation_id,
            "connection_duration": calculate_connection_duration(connection_id),
            "cultural_context": conversation.cultural_context
        })

    except Exception as e:
        await connection_manager.send_personal_message({
            "type": "error",
            "error": "Connection error occurred",
            "cultural_message": await get_cultural_error_message(
                "connection_error", user.cultural_context
            )
        }, connection_id)

        connection_manager.disconnect(connection_id, str(user.id))

async def process_websocket_chat_message(params: dict):
    """Process chat message received via WebSocket with cultural validation."""

    message_data = params["message_data"]
    conversation = params["conversation"]
    user = params["user"]
    connection_id = params["connection_id"]
    websocket_manager = params["websocket_manager"]

    # Cultural validation for real-time message
    cultural_validation = await cultural_validator.validate_realtime_message({
        "message": message_data["message"],
        "cultural_context": conversation.cultural_context,
        "user_cultural_preferences": user.cultural_preferences,
        "real_time_validation": True
    })

    if not cultural_validation.approved:
        await websocket_manager.send_personal_message({
            "type": "cultural_validation_failed",
            "message_id": message_data.get("message_id"),
            "cultural_issues": cultural_validation.issues,
            "improvement_suggestions": cultural_validation.suggestions,
            "cultural_guidance": cultural_validation.guidance
        }, connection_id)
        return

    # Process message with appropriate agent
    agent_response = await agent_coordinator.process_realtime_message({
        "message": message_data["message"],
        "conversation": conversation,
        "cultural_validation": cultural_validation,
        "user_context": user.cultural_context,
        "real_time_processing": True
    })

    # Send response via WebSocket
    await websocket_manager.send_personal_message({
        "type": "agent_response",
        "message_id": message_data.get("message_id"),
        "response": agent_response.response_text,
        "responding_agent": agent_response.agent_name,
        "cultural_compliance_score": cultural_validation.compliance_score,
        "islamic_compliance_score": cultural_validation.islamic_score,
        "response_time_ms": agent_response.response_time,
        "tokens_used": agent_response.tokens_used,
        "cost_iqd": agent_response.cost_iqd
    }, connection_id)
```

---

## IRAQI AI CHAT API INTEGRATION REQUIREMENTS:

**API integration with Iraqi AI system components:**

### Database Integration
- **Iraqi AI Database Schema:** Direct integration with Iraqi-specific database tables and cultural data structures
- **Arabic Text Storage:** APIs optimized for Arabic text storage and retrieval with dialect preservation
- **Cultural Context Persistence:** API integration with cultural context storage and cross-session persistence
- **Professional Domain Data:** API access to Iraqi professional domain data and validation requirements
- **Agent Coordination Data:** APIs for storing and retrieving multi-agent coordination history and performance

### Agent Ecosystem Integration
- **21 Specialized Agents:** API endpoints coordinating with all 21 specialized Iraqi AI agents
- **Agent Performance Monitoring:** APIs tracking agent performance and cultural compliance metrics
- **Context Sharing APIs:** Secure APIs for sharing cultural and professional context between agents
- **Workflow Coordination:** APIs managing complex multi-agent workflows with cultural validation
- **Real-time Agent Communication:** WebSocket APIs for live agent coordination and user interaction

### Cultural System Integration
- **Iraqi Cultural Validation:** Deep API integration with Iraqi cultural validation and compliance systems
- **Islamic Compliance APIs:** API integration with Islamic compliance checking and Sharia validation
- **Regional Cultural Adaptation:** APIs adapting content and responses to specific Iraqi regional variations
- **Professional Domain APIs:** API integration with Iraqi professional domain services and validation
- **Political Neutrality APIs:** API integration ensuring political neutrality and avoiding sectarian content

### Payment and Billing Integration
- **Iraqi Payment Gateways:** API integration with ZainCash, FastPay, NassWallet payment processing
- **Islamic Finance APIs:** API integration with Sharia-compliant billing and Islamic finance principles
- **Usage Tracking APIs:** API integration with usage tracking and token consumption monitoring
- **Subscription Management:** API integration with subscription tier management and billing cycles
- **Cost Calculation APIs:** Real-time cost calculation APIs in Iraqi Dinar with cultural timing considerations

---

## VALIDATION REQUIREMENTS:

**Iraqi AI chat API validation:**

### Chat API Testing
- **Arabic Message Processing:** Test Arabic text processing APIs with Iraqi dialect and RTL text
- **Cultural Validation APIs:** Test cultural appropriateness validation with Iraqi cultural standards
- **Multi-Agent Coordination:** Test agent coordination APIs with 21 specialized Iraqi agents
- **Real-time Communication:** Test WebSocket APIs for live chat with cultural timing awareness
- **Professional Domain APIs:** Test professional domain APIs for Iraqi legal, medical, educational contexts

### Performance Testing
- **API Response Times:** Validate <200ms API response times for chat and cultural validation
- **WebSocket Performance:** Test real-time WebSocket performance under high concurrent load
- **Arabic Processing Performance:** Test Arabic text processing API performance with large texts
- **Agent Coordination Performance:** Test multi-agent coordination API performance and efficiency
- **Cultural Validation Performance:** Test cultural validation API performance and accuracy

### Integration Testing
- **Database API Integration:** Test API integration with Iraqi AI database schema and cultural data
- **Agent Ecosystem Integration:** Test API integration with 21 specialized Iraqi AI agents
- **Payment Gateway Integration:** Test API integration with Iraqi payment gateways and billing
- **Cultural System Integration:** Test API integration with cultural validation and compliance systems
- **Authentication Integration:** Test API integration with Iraqi authentication and session management

---

## ADDITIONAL NOTES:

**Iraqi AI chat API implementation considerations:**

### Implementation Priorities
- **Cultural API integration first** - All APIs must respect Iraqi cultural values and Islamic principles
- **Arabic text optimization** - API endpoints optimized for Arabic text processing and RTL handling
- **Professional domain expertise** - APIs adapted for Iraqi professional contexts and requirements
- **Real-time cultural validation** - Live cultural validation in WebSocket and real-time communications

### Performance and Scalability
- **<200ms API response times** for immediate user feedback and cultural validation
- **<100ms WebSocket message processing** for real-time chat experience
- **<300ms multi-agent coordination** for complex agent workflows and coordination
- **Scalable architecture** supporting 100,000+ concurrent Iraqi users and chat sessions

### Cultural and Professional Focus
- **Iraqi cultural pattern integration** - APIs supporting Iraqi cultural patterns and regional variations
- **Islamic compliance validation** - API integration ensuring Islamic compliance in all interactions
- **Professional domain specialization** - APIs specialized for Iraqi legal, medical, educational, business contexts
- **Arabic-first design** - API architecture optimized for Arabic language processing and cultural context

---

## TEMPLATE COMPLEXITY LEVEL:

- [ ] **Beginner-friendly** - Simple getting started patterns
- [ ] **Intermediate** - Production-ready patterns with common features
- [x] **Advanced** - Comprehensive patterns including complex scenarios
- [ ] **Enterprise** - Full enterprise patterns with monitoring, scaling, security

**Advanced complexity selected** because Iraqi AI chat APIs require sophisticated cultural validation, Arabic text processing, multi-agent coordination, professional domain integration, real-time WebSocket communication, and advanced Iraqi-specific functionality.

---

**This Iraqi AI chat-specific API system provides comprehensive endpoints for chat functionality, cultural validation, agent coordination, professional domain services, and real-time communication for the Iraqi AI Chat System.**