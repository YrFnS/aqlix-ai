"""
Iraqi AI Chat System - Enhanced API Module
==========================================

FastAPI-based RESTful API for Iraqi professional domain agents with:
- Arabic RTL WebSocket support
- Islamic compliance validation endpoints
- Cultural appropriateness checking
- Multi-agent coordination APIs
- Voice integration with Iraqi Arabic support
"""

import asyncio
import json
import base64
import os
import websockets
from typing import Dict, Any, List, Optional, Union
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import uvicorn

# Iraqi AI Chat System imports
from ..agents_generator import IraqiAgentGenerator
from ..iraqi_context import IraqiCulturalContext, IslamicComplianceValidator
from ..arabic_processor import ArabicRTLProcessor, IraqiDialectProcessor

# Initialize FastAPI app with Arabic RTL support
app = FastAPI(
    title="Iraqi AI Chat System API",
    description="Multi-agent API for Iraqi professional domains with Arabic RTL support",
    version="1.0.0",
)

# CORS middleware for Arabic RTL frontend support
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Iraqi AI components
agent_generator = IraqiAgentGenerator()
cultural_context = IraqiCulturalContext()
compliance_validator = IslamicComplianceValidator()
arabic_processor = ArabicRTLProcessor()
dialect_processor = IraqiDialectProcessor()


# Pydantic models for API requests/responses
class IraqiAgentRequest(BaseModel):
    domain: str = Field(..., description="Iraqi professional domain")
    specialist: str = Field(..., description="Specialist type within domain")
    language: str = Field(default="arabic", description="Preferred language")
    custom_config: Optional[Dict[str, Any]] = Field(
        default=None, description="Custom configuration"
    )
    islamic_compliance: bool = Field(
        default=True, description="Enable Islamic compliance"
    )
    cultural_validation: bool = Field(
        default=True, description="Enable cultural validation"
    )


class MultiAgentTeamRequest(BaseModel):
    domains: List[str] = Field(..., description="Required Iraqi professional domains")
    task_description: str = Field(..., description="Complex task description")
    language: str = Field(default="arabic", description="Preferred language")
    coordination_type: str = Field(
        default="collaborative", description="Team coordination type"
    )


class ChatRequest(BaseModel):
    message: str = Field(..., description="User message in Arabic or English")
    agent_id: Optional[str] = Field(default=None, description="Specific agent ID")
    session_id: str = Field(..., description="Chat session ID")
    language: str = Field(default="arabic", description="Preferred language")
    rtl_support: bool = Field(default=True, description="Enable RTL text support")


class ComplianceCheckRequest(BaseModel):
    content: str = Field(..., description="Content to check for Islamic compliance")
    strict_mode: bool = Field(
        default=False, description="Enable strict compliance checking"
    )


class CulturalValidationRequest(BaseModel):
    content: str = Field(
        ..., description="Content to validate for Iraqi cultural appropriateness"
    )
    context: str = Field(default="general", description="Cultural context")


class VoiceStreamRequest(BaseModel):
    audio_data: str = Field(..., description="Base64 encoded audio data")
    language: str = Field(default="iraqi_arabic", description="Voice language")
    session_id: str = Field(..., description="Voice session ID")


# API Endpoints


@app.get("/")
async def root():
    """Root endpoint with Arabic welcome message."""
    return {
        "message": "مرحباً بك في نظام الذكاء الاصطناعي العراقي - Welcome to Iraqi AI Chat System",
        "version": "1.0.0",
        "features": [
            "Iraqi Professional Domain Agents",
            "Arabic RTL Support",
            "Islamic Compliance Validation",
            "Cultural Appropriateness Checking",
            "Multi-Agent Coordination",
            "Voice Integration",
        ],
    }


@app.get("/domains")
async def get_available_domains():
    """Get available Iraqi professional domains."""
    return {
        "domains": {
            "legal": {
                "name_ar": "قانوني",
                "name_en": "Legal",
                "specialists": [
                    "civil_law_specialist",
                    "sharia_compliance_advisor",
                    "contract_specialist",
                ],
                "description_ar": "النظام القانوني العراقي والشريعة الإسلامية",
                "description_en": "Iraqi legal system and Islamic jurisprudence",
            },
            "medical": {
                "name_ar": "طبي",
                "name_en": "Medical",
                "specialists": ["medical_consultation_advisor", "healthcare_navigator"],
                "description_ar": "النظام الصحي العراقي وأخلاقيات الطب الإسلامي",
                "description_en": "Iraqi healthcare system and Islamic medical ethics",
            },
            "educational": {
                "name_ar": "تعليمي",
                "name_en": "Educational",
                "specialists": ["curriculum_advisor", "arabic_language_tutor"],
                "description_ar": "المنهج العراقي واللغة العربية والدراسات الإسلامية",
                "description_en": "Iraqi curriculum, Arabic language, and Islamic studies",
            },
            "government": {
                "name_ar": "حكومي",
                "name_en": "Government",
                "specialists": [
                    "citizen_services_advisor",
                    "document_processing_assistant",
                ],
                "description_ar": "الخدمات الحكومية العراقية وإجراءات الوزارات",
                "description_en": "Iraqi government services and ministry procedures",
            },
            "business": {
                "name_ar": "تجاري",
                "name_en": "Business",
                "specialists": ["business_consultant", "islamic_finance_advisor"],
                "description_ar": "الأعمال التجارية والتمويل الإسلامي في العراق",
                "description_en": "Iraqi business and Islamic finance",
            },
            "engineering": {
                "name_ar": "هندسي",
                "name_en": "Engineering",
                "specialists": [
                    "engineering_standards_advisor",
                    "project_management_consultant",
                ],
                "description_ar": "المعايير الهندسية وإدارة المشاريع في العراق",
                "description_en": "Iraqi engineering standards and project management",
            },
        }
    }


@app.post("/agent/create")
async def create_iraqi_agent(request: IraqiAgentRequest):
    """Create a specialized Iraqi AI agent."""
    try:
        # Validate domain
        if request.domain not in [
            "legal",
            "medical",
            "educational",
            "government",
            "business",
            "engineering",
        ]:
            raise HTTPException(
                status_code=400, detail="Invalid Iraqi professional domain"
            )

        # Create agent
        agent = agent_generator.generate_iraqi_agent(
            domain=request.domain,
            specialist=request.specialist,
            custom_config=request.custom_config,
        )

        return {
            "status": "success",
            "message": "تم إنشاء الوكيل بنجاح - Agent created successfully",
            "agent": {
                "id": f"{request.domain}_{request.specialist}",
                "domain": request.domain,
                "specialist": request.specialist,
                "config": agent,
            },
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create agent: {str(e)}")


@app.post("/team/create")
async def create_multi_agent_team(request: MultiAgentTeamRequest):
    """Create a multi-agent team for complex Iraqi professional tasks."""
    try:
        # Validate domains
        valid_domains = [
            "legal",
            "medical",
            "educational",
            "government",
            "business",
            "engineering",
        ]
        invalid_domains = [d for d in request.domains if d not in valid_domains]
        if invalid_domains:
            raise HTTPException(
                status_code=400, detail=f"Invalid domains: {invalid_domains}"
            )

        # Create multi-agent team
        team = agent_generator.create_iraqi_multi_agent_team(
            domains=request.domains, task_description=request.task_description
        )

        return {
            "status": "success",
            "message": "تم إنشاء الفريق بنجاح - Multi-agent team created successfully",
            "team": {
                "id": f"team_{'_'.join(request.domains)}",
                "domains": request.domains,
                "coordination": request.coordination_type,
                "config": team,
            },
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create team: {str(e)}")


@app.post("/chat")
async def chat_with_agent(request: ChatRequest):
    """Chat with Iraqi AI agent with Arabic RTL support."""
    try:
        # Process Arabic text if needed
        processed_message = request.message
        if request.rtl_support and arabic_processor.detect_arabic(request.message):
            processed_message = arabic_processor.process_rtl(request.message)
            processed_message = dialect_processor.process_iraqi_dialect(
                processed_message
            )

        # Validate Islamic compliance if requested
        if request.language == "arabic":
            compliance_result = compliance_validator.validate_content(processed_message)
            if not compliance_result["compliant"]:
                return {
                    "status": "warning",
                    "message": "تحذير التوافق الإسلامي - Islamic compliance warning",
                    "issues": compliance_result["issues"],
                }

        # Process with agent (placeholder implementation)
        response_content = f"Response to: {processed_message}"

        # Format response for RTL if needed
        if request.rtl_support and request.language == "arabic":
            response_content = arabic_processor.format_rtl_response(response_content)

        return {
            "status": "success",
            "response": response_content,
            "session_id": request.session_id,
            "language": request.language,
            "rtl_formatted": request.rtl_support,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat processing failed: {str(e)}")


@app.post("/compliance/check")
async def check_islamic_compliance(request: ComplianceCheckRequest):
    """Check content for Islamic compliance."""
    try:
        result = compliance_validator.validate_content(
            content=request.content, strict_mode=request.strict_mode
        )

        return {
            "status": "success",
            "compliant": result["compliant"],
            "issues": result.get("issues", []),
            "recommendations": result.get("recommendations", []),
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Compliance check failed: {str(e)}"
        )


@app.post("/cultural/validate")
async def validate_cultural_appropriateness(request: CulturalValidationRequest):
    """Validate content for Iraqi cultural appropriateness."""
    try:
        result = cultural_context.validate_cultural_appropriateness(
            content=request.content, context=request.context
        )

        return {
            "status": "success",
            "appropriate": result["appropriate"],
            "issues": result.get("issues", []),
            "suggestions": result.get("suggestions", []),
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Cultural validation failed: {str(e)}"
        )


# WebSocket endpoint for real-time communication
@app.websocket("/ws/chat/{session_id}")
async def websocket_chat_endpoint(websocket: WebSocket, session_id: str):
    """WebSocket endpoint for real-time Arabic RTL chat."""
    await websocket.accept()

    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)

            # Process Arabic text
            message = message_data.get("message", "")
            language = message_data.get("language", "arabic")

            if arabic_processor.detect_arabic(message):
                processed_message = arabic_processor.process_rtl(message)
                processed_message = dialect_processor.process_iraqi_dialect(
                    processed_message
                )
            else:
                processed_message = message

            # Validate compliance
            compliance_result = compliance_validator.validate_content(processed_message)
            if not compliance_result["compliant"]:
                await websocket.send_text(
                    json.dumps(
                        {
                            "type": "compliance_warning",
                            "message": "تحذير التوافق الإسلامي - Islamic compliance warning",
                            "issues": compliance_result["issues"],
                        }
                    )
                )
                continue

            # Process with agent and send response
            response = f"WebSocket response to: {processed_message}"

            if language == "arabic":
                response = arabic_processor.format_rtl_response(response)

            await websocket.send_text(
                json.dumps(
                    {
                        "type": "agent_response",
                        "response": response,
                        "session_id": session_id,
                        "language": language,
                    }
                )
            )

    except WebSocketDisconnect:
        print(f"WebSocket disconnected for session: {session_id}")


# Voice stream WebSocket endpoint
@app.websocket("/ws/voice/{session_id}")
async def websocket_voice_endpoint(websocket: WebSocket, session_id: str):
    """WebSocket endpoint for real-time Iraqi Arabic voice processing."""
    await websocket.accept()

    try:
        while True:
            # Receive audio data
            data = await websocket.receive_text()
            voice_data = json.loads(data)

            # Process Iraqi Arabic voice (placeholder implementation)
            audio_data = voice_data.get("audio_data", "")
            language = voice_data.get("language", "iraqi_arabic")

            # Convert to text (placeholder)
            transcribed_text = f"Transcribed from {language}: {audio_data[:50]}..."

            # Process through Iraqi dialect processor
            if language == "iraqi_arabic":
                processed_text = dialect_processor.process_iraqi_dialect(
                    transcribed_text
                )
            else:
                processed_text = transcribed_text

            # Send processed response
            await websocket.send_text(
                json.dumps(
                    {
                        "type": "voice_response",
                        "transcription": processed_text,
                        "session_id": session_id,
                        "language": language,
                    }
                )
            )

    except WebSocketDisconnect:
        print(f"Voice WebSocket disconnected for session: {session_id}")


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "message": "النظام يعمل بشكل طبيعي - System running normally",
        "timestamp": "2024-01-01T00:00:00Z",
    }


# Placeholder implementations for Iraqi AI components
class IraqiCulturalContext:
    def validate_cultural_appropriateness(
        self, content: str, context: str = "general"
    ) -> Dict[str, Any]:
        return {"appropriate": True, "issues": [], "suggestions": []}


class IslamicComplianceValidator:
    def validate_content(
        self, content: str, strict_mode: bool = False
    ) -> Dict[str, Any]:
        return {"compliant": True, "issues": [], "recommendations": []}


class ArabicRTLProcessor:
    def detect_arabic(self, text: str) -> bool:
        return any("\u0600" <= char <= "\u06ff" for char in text)

    def process_rtl(self, text: str) -> str:
        return text

    def format_rtl_response(self, text: str) -> str:
        return f"<div dir='rtl'>{text}</div>"


class IraqiDialectProcessor:
    def process_iraqi_dialect(self, text: str) -> str:
        return text


if __name__ == "__main__":
    # Run the API server
    uvicorn.run(
        "iraqi_api:app", host="0.0.0.0", port=8000, reload=True, log_level="info"
    )
