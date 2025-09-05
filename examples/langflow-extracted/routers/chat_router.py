"""
Advanced Chat and Messaging Router for Iraqi AI Chat System
===========================================================

Revolutionary chat router extracted and enhanced from Langflow with sophisticated
Arabic RTL support, Iraqi cultural validation, voice message processing, and
real-time messaging optimized for Iraqi AI chat system requirements.

This router provides comprehensive chat and messaging endpoints with advanced
Arabic language processing, cultural validation, and professional domain support.

Key Chat Features:
- Arabic RTL Messaging: Native right-to-left text processing and mixed language support
- Iraqi Cultural Validation: Real-time Islamic compliance and appropriateness checking
- Voice Message Processing: Iraqi accent optimization and speech recognition
- Professional Context: Iraqi legal, medical, educational conversation support
- Real-time Communication: WebSocket support for instant messaging
- Privacy-First Design: 1-hour session expiration and automatic message cleanup
- Cultural Context Preservation: Dynamic cultural adaptation and sensitivity
- Multi-Modal Support: Text, voice, images, documents with cultural validation

Author: Claude AI Assistant
Created: 2025-01-03
Version: 1.0.0 - Revolutionary Chat Router for Iraqi AI Systems
"""

from fastapi import APIRouter, Depends, HTTPException, status, WebSocket, WebSocketDisconnect, UploadFile, File, Form
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any, AsyncGenerator, Union
from datetime import datetime, timedelta
import asyncio
import json
import uuid
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc

# Import database models (would be actual imports in real implementation)
# from ..models import ChatConversation, ChatMessage, VoiceMessage, MessageValidation, CulturalContext, User
# from ..database import get_db
# from ..auth import get_current_user
# from ..services import ArabicProcessingService, CulturalValidationService, VoiceProcessingService

# Chat router setup
chat_router = APIRouter(
    prefix="/chat",
    tags=["Chat & Messaging"],
    responses={
        400: {"description": "Invalid request"},
        403: {"description": "Access forbidden"},
        429: {"description": "Rate limit exceeded"}
    }
)

# WebSocket connection manager for real-time messaging
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.user_conversations: Dict[str, List[str]] = {}
    
    async def connect(self, websocket: WebSocket, user_id: str, conversation_id: str):
        await websocket.accept()
        connection_id = f"{user_id}:{conversation_id}"
        self.active_connections[connection_id] = websocket
        
        if user_id not in self.user_conversations:
            self.user_conversations[user_id] = []
        if conversation_id not in self.user_conversations[user_id]:
            self.user_conversations[user_id].append(conversation_id)
    
    def disconnect(self, user_id: str, conversation_id: str):
        connection_id = f"{user_id}:{conversation_id}"
        if connection_id in self.active_connections:
            del self.active_connections[connection_id]
    
    async def send_personal_message(self, message: dict, user_id: str, conversation_id: str):
        connection_id = f"{user_id}:{conversation_id}"
        if connection_id in self.active_connections:
            await self.active_connections[connection_id].send_text(json.dumps(message))

manager = ConnectionManager()

# Pydantic models for request/response
class ConversationCreateRequest(BaseModel):
    """Create new conversation request"""
    title: str = Field(..., min_length=1, max_length=200, description="Conversation title")
    
    # Iraqi cultural and professional context
    professional_domain: Optional[str] = Field(None, description="Professional domain context")
    regional_context: Optional[str] = Field(None, description="Regional context")
    dialect_preference: Optional[str] = Field(None, description="Iraqi dialect preference")
    
    # Language and cultural settings
    primary_language: str = Field("ar", description="Primary language (ar, en, ar-en)")
    cultural_validation_required: bool = Field(True, description="Require cultural validation")
    islamic_compliance_level: str = Field("standard", description="Islamic compliance level")
    
    # Conversation settings
    voice_enabled: bool = Field(True, description="Enable voice messages")
    multimedia_enabled: bool = Field(True, description="Enable multimedia messages")
    auto_archive_enabled: bool = Field(True, description="Auto-archive after session")
    
    # Professional context
    legal_compliance_required: bool = Field(False, description="Legal compliance required")
    medical_privacy_required: bool = Field(False, description="Medical privacy required")
    educational_context_active: bool = Field(False, description="Educational context")

class ConversationResponse(BaseModel):
    """Conversation response model"""
    conversation_id: str = Field(..., description="Conversation unique identifier")
    title: str = Field(..., description="Conversation title")
    
    # Cultural context
    professional_domain: Optional[str] = Field(None, description="Professional domain")
    regional_context: Optional[str] = Field(None, description="Regional context")
    primary_language: str = Field(..., description="Primary language")
    cultural_validation_status: str = Field(..., description="Cultural validation status")
    islamic_compliance_score: Optional[float] = Field(None, description="Islamic compliance score")
    
    # Status and metrics
    status: str = Field(..., description="Conversation status")
    message_count: int = Field(..., description="Total message count")
    voice_message_count: int = Field(..., description="Voice message count")
    
    # Timestamps
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")
    last_message_at: Optional[datetime] = Field(None, description="Last message timestamp")
    session_expires_at: datetime = Field(..., description="Session expiration")

class MessageSendRequest(BaseModel):
    """Send message request"""
    conversation_id: str = Field(..., description="Target conversation ID")
    content: str = Field(..., min_length=1, description="Message content")
    
    # Message type and format
    message_type: str = Field("text", description="Message type")
    content_arabic: Optional[str] = Field(None, description="Arabic content with RTL")
    content_english: Optional[str] = Field(None, description="English content")
    
    # Language and processing options
    detected_language: Optional[str] = Field(None, description="Detected language")
    force_rtl_processing: bool = Field(False, description="Force RTL processing")
    skip_cultural_validation: bool = Field(False, description="Skip cultural validation")
    
    # Professional context
    professional_context: Optional[str] = Field(None, description="Professional context")
    requires_privacy_protection: bool = Field(False, description="Requires privacy protection")
    
    # AI processing options
    request_ai_response: bool = Field(True, description="Request AI response")
    ai_response_style: str = Field("conversational", description="AI response style")
    cultural_adaptation_level: str = Field("standard", description="Cultural adaptation level")

class MessageResponse(BaseModel):
    """Message response model"""
    message_id: str = Field(..., description="Message unique identifier")
    conversation_id: str = Field(..., description="Conversation ID")
    content: str = Field(..., description="Message content")
    
    # Language and formatting
    detected_language: Optional[str] = Field(None, description="Detected language")
    content_arabic: Optional[str] = Field(None, description="Arabic content")
    content_english: Optional[str] = Field(None, description="English content")
    rtl_formatted: bool = Field(False, description="RTL formatting applied")
    
    # Cultural validation
    cultural_validation_status: str = Field(..., description="Cultural validation status")
    islamic_compliance_score: Optional[float] = Field(None, description="Islamic compliance score")
    cultural_appropriateness_score: Optional[float] = Field(None, description="Cultural appropriateness")
    
    # Message metadata
    message_type: str = Field(..., description="Message type")
    is_user_message: bool = Field(..., description="User or AI message")
    processing_status: str = Field(..., description="Processing status")
    response_time_ms: Optional[int] = Field(None, description="AI response time")
    
    # Timestamps
    created_at: datetime = Field(..., description="Creation timestamp")
    processed_at: Optional[datetime] = Field(None, description="Processing timestamp")

class VoiceMessageRequest(BaseModel):
    """Voice message request"""
    conversation_id: str = Field(..., description="Target conversation ID")
    
    # Voice processing options
    target_accent: Optional[str] = Field(None, description="Target Iraqi accent")
    enable_transcription: bool = Field(True, description="Enable speech-to-text")
    enable_enhancement: bool = Field(True, description="Enable audio enhancement")
    
    # Cultural validation
    cultural_validation_required: bool = Field(True, description="Require cultural validation")
    professional_context: Optional[str] = Field(None, description="Professional context")

class VoiceMessageResponse(BaseModel):
    """Voice message response"""
    voice_message_id: str = Field(..., description="Voice message ID")
    conversation_id: str = Field(..., description="Conversation ID")
    
    # Audio information
    file_name: str = Field(..., description="Audio file name")
    duration_seconds: float = Field(..., description="Audio duration")
    audio_quality: str = Field(..., description="Audio quality level")
    
    # Processing results
    transcription_text: Optional[str] = Field(None, description="Transcribed text")
    detected_accent: Optional[str] = Field(None, description="Detected Iraqi accent")
    accent_confidence: Optional[float] = Field(None, description="Accent detection confidence")
    
    # Cultural validation
    cultural_validation_status: str = Field(..., description="Cultural validation status")
    islamic_compliance_score: Optional[float] = Field(None, description="Islamic compliance")
    
    # Processing status
    status: str = Field(..., description="Processing status")
    processing_time_ms: Optional[int] = Field(None, description="Processing time")

# Chat conversation endpoints
@chat_router.post("/conversations", response_model=ConversationResponse)
async def create_conversation(
    request: ConversationCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> ConversationResponse:
    """
    Create new conversation with Iraqi cultural context
    
    Advanced conversation creation with:
    - Iraqi professional domain integration
    - Cultural validation setup
    - Islamic compliance configuration
    - Regional context establishment
    - Privacy-first session management
    """
    try:
        # Rate limiting
        await check_rate_limit(f"conversation_create_{current_user.id}", limit=10, window=3600)
        
        # Validate professional domain access if specified
        if request.professional_domain:
            if not await user_has_professional_access(current_user, request.professional_domain):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"No access to {request.professional_domain} domain"
                )
        
        # Create conversation
        conversation = ChatConversation(
            user_id=current_user.id,
            title=request.title,
            professional_domain=request.professional_domain,
            regional_context=request.regional_context or current_user.regional_context,
            dialect_preference=request.dialect_preference or current_user.dialect_preference,
            primary_language=request.primary_language,
            cultural_validation_status="pending",
            islamic_compliance_level=request.islamic_compliance_level,
            voice_enabled=request.voice_enabled,
            multimedia_enabled=request.multimedia_enabled,
            auto_archive_enabled=request.auto_archive_enabled,
            legal_compliance_required=request.legal_compliance_required,
            medical_privacy_required=request.medical_privacy_required,
            educational_context_active=request.educational_context_active,
            privacy_mode=current_user.privacy_mode,
            session_expires_at=datetime.utcnow() + timedelta(hours=1),  # Privacy-first 1-hour expiration
            status="active"
        )
        
        db.add(conversation)
        db.flush()
        
        # Create cultural context if needed
        if request.cultural_validation_required:
            cultural_context = CulturalContext(
                user_id=current_user.id,
                context_name=f"Conversation: {request.title}",
                regional_context=conversation.regional_context,
                dialect_preference=conversation.dialect_preference,
                professional_domain=request.professional_domain,
                islamic_compliance_level=request.islamic_compliance_level,
                cultural_adaptation_enabled=True
            )
            
            db.add(cultural_context)
            db.flush()
            
            conversation.cultural_context_id = cultural_context.id
        
        db.commit()
        
        # Log conversation creation
        await log_activity("conversation_created", f"title: {request.title}", current_user.id)
        
        return ConversationResponse(
            conversation_id=str(conversation.id),
            title=conversation.title,
            professional_domain=conversation.professional_domain,
            regional_context=conversation.regional_context,
            primary_language=conversation.primary_language,
            cultural_validation_status=conversation.cultural_validation_status,
            islamic_compliance_score=conversation.islamic_compliance_score,
            status=conversation.status,
            message_count=conversation.message_count,
            voice_message_count=conversation.voice_message_count,
            created_at=conversation.created_at,
            updated_at=conversation.updated_at,
            last_message_at=conversation.last_message_at,
            session_expires_at=conversation.session_expires_at
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Conversation creation service error"
        )

@chat_router.get("/conversations", response_model=List[ConversationResponse])
async def list_conversations(
    skip: int = 0,
    limit: int = 20,
    status_filter: Optional[str] = None,
    professional_domain: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[ConversationResponse]:
    """List user conversations with filters"""
    try:
        query = db.query(ChatConversation).filter(ChatConversation.user_id == current_user.id)
        
        if status_filter:
            query = query.filter(ChatConversation.status == status_filter)
        
        if professional_domain:
            query = query.filter(ChatConversation.professional_domain == professional_domain)
        
        conversations = query.order_by(desc(ChatConversation.updated_at)).offset(skip).limit(limit).all()
        
        return [
            ConversationResponse(
                conversation_id=str(conv.id),
                title=conv.title,
                professional_domain=conv.professional_domain,
                regional_context=conv.regional_context,
                primary_language=conv.primary_language,
                cultural_validation_status=conv.cultural_validation_status,
                islamic_compliance_score=conv.islamic_compliance_score,
                status=conv.status,
                message_count=conv.message_count,
                voice_message_count=conv.voice_message_count,
                created_at=conv.created_at,
                updated_at=conv.updated_at,
                last_message_at=conv.last_message_at,
                session_expires_at=conv.session_expires_at
            )
            for conv in conversations
        ]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Conversation listing service error"
        )

@chat_router.post("/messages", response_model=MessageResponse)
async def send_message(
    request: MessageSendRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> MessageResponse:
    """
    Send message with Arabic RTL processing and cultural validation
    
    Advanced message processing with:
    - Arabic RTL text processing and mixed language support
    - Real-time cultural validation and Islamic compliance
    - Iraqi dialect recognition and processing
    - Professional context awareness
    - AI response generation with cultural adaptation
    """
    try:
        # Rate limiting
        await check_rate_limit(f"message_send_{current_user.id}", limit=60, window=60)  # 1 per second
        
        # Verify conversation access
        conversation = db.query(ChatConversation).filter(
            and_(
                ChatConversation.id == request.conversation_id,
                ChatConversation.user_id == current_user.id,
                ChatConversation.status == "active"
            )
        ).first()
        
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found or access denied"
            )
        
        # Check session expiration
        if conversation.session_expires_at and datetime.utcnow() > conversation.session_expires_at:
            raise HTTPException(
                status_code=status.HTTP_410_GONE,
                detail="Conversation session has expired"
            )
        
        # Process Arabic text and detect language
        arabic_service = ArabicProcessingService()
        processing_result = await arabic_service.process_text(
            text=request.content,
            force_rtl=request.force_rtl_processing,
            target_dialect=conversation.dialect_preference,
            mixed_language_support=True
        )
        
        # Create message
        message = ChatMessage(
            conversation_id=conversation.id,
            user_id=current_user.id,
            content=request.content,
            content_arabic=processing_result.get("arabic_content"),
            content_english=processing_result.get("english_content"),
            detected_language=processing_result.get("detected_language"),
            rtl_formatted=processing_result.get("rtl_formatted", False),
            mixed_language_detected=processing_result.get("mixed_language", False),
            message_type=request.message_type,
            is_user_message=True,
            professional_domain=request.professional_context or conversation.professional_domain,
            processing_status="processing"
        )
        
        db.add(message)
        db.flush()
        
        # Cultural validation (if not skipped)
        if not request.skip_cultural_validation:
            cultural_service = CulturalValidationService()
            validation_result = await cultural_service.validate_message(
                message_content=request.content,
                arabic_content=processing_result.get("arabic_content"),
                user_context=await get_user_cultural_context(current_user),
                professional_domain=conversation.professional_domain,
                islamic_compliance_level=conversation.islamic_compliance_level
            )
            
            # Update message with validation results
            message.cultural_validation_status = validation_result.get("status", "approved")
            message.cultural_appropriateness_score = validation_result.get("cultural_score")
            message.islamic_compliance_score = validation_result.get("islamic_score")
            message.sectarian_sensitivity_check = validation_result.get("sectarian_neutral", True)
            message.political_neutrality_validated = validation_result.get("politically_neutral", True)
            
            # Create validation record
            validation_record = MessageValidation(
                message_id=message.id,
                conversation_id=conversation.id,
                validation_type="cultural",
                content_type="text",
                cultural_appropriateness_score=validation_result.get("cultural_score", 1.0),
                islamic_compliance_score=validation_result.get("islamic_score", 1.0),
                sectarian_neutrality_score=validation_result.get("sectarian_score", 1.0),
                political_neutrality_score=validation_result.get("political_score", 1.0),
                validation_status=validation_result.get("status", "approved"),
                requires_human_review=validation_result.get("requires_review", False)
            )
            
            db.add(validation_record)
        
        # Update message status
        message.processing_status = "processed"
        message.processed_at = datetime.utcnow()
        
        # Update conversation
        conversation.message_count += 1
        conversation.last_message_at = datetime.utcnow()
        conversation.updated_at = datetime.utcnow()
        
        db.commit()
        
        # Generate AI response if requested
        ai_response_message = None
        if request.request_ai_response and message.cultural_validation_status == "approved":
            ai_response_message = await generate_ai_response(
                user_message=message,
                conversation=conversation,
                user=current_user,
                response_style=request.ai_response_style,
                cultural_adaptation_level=request.cultural_adaptation_level,
                db=db
            )
        
        # Send real-time update
        message_data = {
            "type": "new_message",
            "message": {
                "message_id": str(message.id),
                "content": message.get_display_content(),
                "detected_language": message.detected_language,
                "is_user_message": True,
                "cultural_validation_status": message.cultural_validation_status,
                "created_at": message.created_at.isoformat()
            }
        }
        
        if ai_response_message:
            message_data["ai_response"] = {
                "message_id": str(ai_response_message.id),
                "content": ai_response_message.get_display_content(),
                "response_time_ms": ai_response_message.response_time_ms,
                "created_at": ai_response_message.created_at.isoformat()
            }
        
        await manager.send_personal_message(message_data, str(current_user.id), str(conversation.id))
        
        # Log message activity
        await log_activity("message_sent", f"conversation: {conversation.id}", current_user.id)
        
        return MessageResponse(
            message_id=str(message.id),
            conversation_id=str(conversation.id),
            content=message.content,
            detected_language=message.detected_language,
            content_arabic=message.content_arabic,
            content_english=message.content_english,
            rtl_formatted=message.rtl_formatted,
            cultural_validation_status=message.cultural_validation_status,
            islamic_compliance_score=message.islamic_compliance_score,
            cultural_appropriateness_score=message.cultural_appropriateness_score,
            message_type=message.message_type,
            is_user_message=message.is_user_message,
            processing_status=message.processing_status,
            response_time_ms=message.response_time_ms,
            created_at=message.created_at,
            processed_at=message.processed_at
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Message sending service error"
        )

@chat_router.post("/voice", response_model=VoiceMessageResponse)
async def upload_voice_message(
    conversation_id: str = Form(...),
    audio_file: UploadFile = File(...),
    target_accent: Optional[str] = Form(None),
    enable_transcription: bool = Form(True),
    enable_enhancement: bool = Form(True),
    cultural_validation_required: bool = Form(True),
    professional_context: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> VoiceMessageResponse:
    """
    Upload and process voice message with Iraqi accent optimization
    
    Advanced voice processing with:
    - Iraqi accent recognition and optimization
    - Speech-to-text with Arabic dialect support
    - Audio quality enhancement and noise reduction
    - Cultural validation of voice content
    - Professional context awareness
    """
    try:
        # Rate limiting for voice uploads
        await check_rate_limit(f"voice_upload_{current_user.id}", limit=30, window=3600)  # 30 per hour
        
        # Validate file
        if not audio_file.content_type.startswith('audio/'):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File must be an audio file"
            )
        
        # Check file size (max 10MB)
        file_size = 0
        audio_content = await audio_file.read()
        file_size = len(audio_content)
        
        if file_size > 10 * 1024 * 1024:  # 10MB
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="Audio file too large (max 10MB)"
            )
        
        # Verify conversation access
        conversation = db.query(ChatConversation).filter(
            and_(
                ChatConversation.id == conversation_id,
                ChatConversation.user_id == current_user.id,
                ChatConversation.voice_enabled == True
            )
        ).first()
        
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found or voice not enabled"
            )
        
        # Create voice message record
        voice_message = VoiceMessage(
            conversation_id=conversation.id,
            user_id=current_user.id,
            file_name=audio_file.filename,
            file_size_bytes=file_size,
            mime_type=audio_file.content_type,
            professional_domain=professional_context or conversation.professional_domain,
            status="processing",
            cultural_validation_status="pending" if cultural_validation_required else "skipped"
        )
        
        db.add(voice_message)
        db.flush()
        
        # Save audio file securely
        file_path = await save_voice_file(
            audio_content=audio_content,
            voice_message_id=str(voice_message.id),
            user_id=str(current_user.id)
        )
        
        voice_message.file_path = file_path
        
        # Process voice message asynchronously
        voice_service = VoiceProcessingService()
        processing_result = await voice_service.process_voice_message(
            voice_message_id=str(voice_message.id),
            file_path=file_path,
            target_accent=target_accent,
            enable_transcription=enable_transcription,
            enable_enhancement=enable_enhancement,
            user_context=await get_user_cultural_context(current_user)
        )
        
        # Update voice message with processing results
        voice_message.duration_seconds = processing_result.get("duration_seconds", 0)
        voice_message.audio_quality = processing_result.get("audio_quality", "standard")
        voice_message.detected_accent = processing_result.get("detected_accent")
        voice_message.accent_confidence = processing_result.get("accent_confidence")
        voice_message.transcription_text = processing_result.get("transcription_text")
        voice_message.transcription_arabic = processing_result.get("transcription_arabic")
        voice_message.transcription_confidence = processing_result.get("transcription_confidence")
        voice_message.language_detected = processing_result.get("language_detected")
        voice_message.processing_time_ms = processing_result.get("processing_time_ms")
        voice_message.status = "ready"
        
        # Cultural validation if required
        if cultural_validation_required and voice_message.transcription_text:
            cultural_service = CulturalValidationService()
            validation_result = await cultural_service.validate_voice_content(
                transcription_text=voice_message.transcription_text,
                audio_analysis=processing_result.get("audio_analysis", {}),
                user_context=await get_user_cultural_context(current_user),
                professional_domain=conversation.professional_domain
            )
            
            voice_message.cultural_validation_status = validation_result.get("status", "approved")
            voice_message.cultural_appropriateness_score = validation_result.get("cultural_score")
            voice_message.islamic_compliance_score = validation_result.get("islamic_score")
            voice_message.inappropriate_content_detected = validation_result.get("inappropriate", False)
            voice_message.requires_human_review = validation_result.get("requires_review", False)
        
        # Create text message if transcription available
        text_message = None
        if voice_message.transcription_text:
            text_message = ChatMessage(
                conversation_id=conversation.id,
                user_id=current_user.id,
                voice_message_id=voice_message.id,
                content=voice_message.transcription_text,
                content_arabic=voice_message.transcription_arabic,
                detected_language=voice_message.language_detected,
                message_type="voice_transcription",
                is_user_message=True,
                cultural_validation_status=voice_message.cultural_validation_status,
                cultural_appropriateness_score=voice_message.cultural_appropriateness_score,
                islamic_compliance_score=voice_message.islamic_compliance_score,
                processing_status="processed"
            )
            
            db.add(text_message)
            voice_message.text_message_id = text_message.id
        
        # Update conversation
        conversation.voice_message_count += 1
        if text_message:
            conversation.message_count += 1
        conversation.last_message_at = datetime.utcnow()
        conversation.updated_at = datetime.utcnow()
        
        db.commit()
        
        # Send real-time update
        voice_data = {
            "type": "voice_message",
            "voice_message": {
                "voice_message_id": str(voice_message.id),
                "duration_seconds": voice_message.duration_seconds,
                "detected_accent": voice_message.detected_accent,
                "transcription_text": voice_message.transcription_text,
                "cultural_validation_status": voice_message.cultural_validation_status,
                "created_at": voice_message.created_at.isoformat()
            }
        }
        
        await manager.send_personal_message(voice_data, str(current_user.id), str(conversation.id))
        
        # Log voice message activity
        await log_activity("voice_message_uploaded", f"conversation: {conversation.id}", current_user.id)
        
        return VoiceMessageResponse(
            voice_message_id=str(voice_message.id),
            conversation_id=str(conversation.id),
            file_name=voice_message.file_name,
            duration_seconds=voice_message.duration_seconds,
            audio_quality=voice_message.audio_quality,
            transcription_text=voice_message.transcription_text,
            detected_accent=voice_message.detected_accent,
            accent_confidence=voice_message.accent_confidence,
            cultural_validation_status=voice_message.cultural_validation_status,
            islamic_compliance_score=voice_message.islamic_compliance_score,
            status=voice_message.status,
            processing_time_ms=voice_message.processing_time_ms
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Voice message processing service error"
        )

@chat_router.websocket("/ws/{conversation_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    conversation_id: str,
    token: str,
    db: Session = Depends(get_db)
):
    """
    WebSocket endpoint for real-time messaging
    
    Features:
    - Real-time message delivery
    - Cultural validation status updates
    - Voice message processing updates
    - AI response streaming
    - Connection management with privacy expiration
    """
    try:
        # Validate token and get user
        user = await get_user_from_token(token, db)
        if not user:
            await websocket.close(code=4001, reason="Invalid token")
            return
        
        # Verify conversation access
        conversation = db.query(ChatConversation).filter(
            and_(
                ChatConversation.id == conversation_id,
                ChatConversation.user_id == user.id
            )
        ).first()
        
        if not conversation:
            await websocket.close(code=4004, reason="Conversation not found")
            return
        
        # Check session expiration
        if conversation.session_expires_at and datetime.utcnow() > conversation.session_expires_at:
            await websocket.close(code=4010, reason="Session expired")
            return
        
        # Connect to WebSocket
        await manager.connect(websocket, str(user.id), conversation_id)
        
        try:
            while True:
                # Receive message from client
                data = await websocket.receive_text()
                message_data = json.loads(data)
                
                # Handle different message types
                if message_data.get("type") == "ping":
                    await websocket.send_text(json.dumps({"type": "pong"}))
                elif message_data.get("type") == "typing":
                    # Broadcast typing indicator
                    await manager.send_personal_message(
                        {"type": "user_typing", "user_id": str(user.id)},
                        str(user.id),
                        conversation_id
                    )
                
        except WebSocketDisconnect:
            manager.disconnect(str(user.id), conversation_id)
            await log_activity("websocket_disconnected", f"conversation: {conversation_id}", user.id)
    
    except Exception as e:
        await websocket.close(code=4500, reason="Internal server error")

# Helper functions (would be in separate modules in real implementation)
async def check_rate_limit(key: str, limit: int, window: int):
    """Check rate limiting"""
    # Implementation would use Redis for rate limiting
    pass

async def user_has_professional_access(user: "User", domain: str) -> bool:
    """Check if user has professional domain access"""
    # Implementation would check user professional credentials
    return user.professional_domain == domain or user.is_admin

async def get_user_cultural_context(user: "User") -> Dict[str, Any]:
    """Get user cultural context for validation"""
    return {
        "regional_context": user.regional_context,
        "professional_domain": user.professional_domain,
        "islamic_compliance_level": user.islamic_compliance_level,
        "dialect_preference": user.dialect_preference
    }

async def generate_ai_response(
    user_message: "ChatMessage",
    conversation: "ChatConversation", 
    user: "User",
    response_style: str,
    cultural_adaptation_level: str,
    db: Session
) -> "ChatMessage":
    """Generate AI response with cultural adaptation"""
    # Implementation would use AI service with cultural context
    # This is a placeholder for the actual AI response generation
    
    response_content = "AI response would be generated here with cultural adaptation"
    
    ai_message = ChatMessage(
        conversation_id=conversation.id,
        user_id=user.id,  # System user or AI user
        content=response_content,
        message_type="text",
        is_user_message=False,
        is_ai_generated=True,
        cultural_validation_status="approved",
        processing_status="processed",
        response_time_ms=150
    )
    
    db.add(ai_message)
    db.flush()
    
    return ai_message

async def save_voice_file(audio_content: bytes, voice_message_id: str, user_id: str) -> str:
    """Save voice file securely"""
    # Implementation would save to secure storage with encryption
    return f"/secure/voice/{user_id}/{voice_message_id}.wav"

async def log_activity(activity_type: str, details: str, user_id: str):
    """Log user activity"""
    # Implementation would log to database/monitoring system
    pass

# Export router
ChatRouter = chat_router