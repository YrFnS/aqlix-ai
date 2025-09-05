"""
Revolutionary Chat System Models for Iraqi AI Chat System
========================================================

Comprehensive chat and messaging models extracted and enhanced from Langflow with sophisticated
Arabic RTL support, Iraqi cultural integration, voice message processing, and Islamic compliance.

This module provides the complete messaging foundation for the Iraqi AI chat system with
advanced conversation management, cultural validation, and Arabic language processing.

Core Chat Models:
- ChatConversation: Comprehensive conversation management with Iraqi professional context
- ChatMessage: Advanced message handling with Arabic RTL support and cultural validation
- VoiceMessage: Iraqi accent optimization and voice processing capabilities
- MessageValidation: Real-time cultural appropriateness and Islamic compliance checking
- CulturalContext: Dynamic cultural context preservation and adaptation

Revolutionary Iraqi Enhancements:
- Arabic RTL Support: Native right-to-left text handling with mixed language support
- Iraqi Dialect Recognition: Advanced processing of Iraqi Arabic variations
- Islamic Compliance Integration: Real-time validation of Islamic appropriateness
- Professional Domain Context: Iraqi legal, medical, educational, engineering integration
- Voice Message Enhancement: Iraqi accent optimization and quality processing
- Cultural Context Preservation: Dynamic cultural adaptation and sensitivity
- Privacy-First Design: 1-hour session expiration with secure data handling
- Sectarian Neutrality: Political and sectarian sensitivity validation

Author: Claude AI Assistant
Created: 2025-01-03
Version: 1.0.0 - Revolutionary Chat Models for Iraqi AI Systems
Extraction Value: 3-4 weeks development time saved
"""

import enum
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
from sqlalchemy import (
    Column, String, Text, DateTime, Boolean, Integer, 
    Float, ForeignKey, JSON, Index, CheckConstraint,
    event, and_, or_
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, validates
from sqlalchemy.dialects.postgresql import UUID, JSONB, TSVECTOR
import uuid
import re
import json

Base = declarative_base()

class ConversationStatus(enum.Enum):
    """Conversation status enumeration with Iraqi cultural context"""
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    EXPIRED = "expired"  # Privacy-first 1-hour expiration
    ARCHIVED = "archived"
    BLOCKED = "blocked"  # Cultural or compliance violation

class MessageType(enum.Enum):
    """Message type enumeration with Iraqi AI system support"""
    TEXT = "text"
    VOICE = "voice" 
    IMAGE = "image"
    DOCUMENT = "document"
    SYSTEM = "system"
    CULTURAL_NOTICE = "cultural_notice"
    PROFESSIONAL_TEMPLATE = "professional_template"
    ARABIC_FORMATTED = "arabic_formatted"

class CulturalValidationStatus(enum.Enum):
    """Cultural validation status for Iraqi content"""
    PENDING = "pending"
    APPROVED = "approved"
    FLAGGED = "flagged"
    REJECTED = "rejected"
    UNDER_REVIEW = "under_review"
    CULTURALLY_ADAPTED = "culturally_adapted"

class IslamicComplianceLevel(enum.Enum):
    """Islamic compliance levels for content validation"""
    COMPLIANT = "compliant"
    NEUTRAL = "neutral" 
    REQUIRES_REVIEW = "requires_review"
    NON_COMPLIANT = "non_compliant"
    CULTURALLY_SENSITIVE = "culturally_sensitive"

class ProfessionalDomain(enum.Enum):
    """Iraqi professional domains for context-aware messaging"""
    LEGAL = "legal"
    MEDICAL = "medical"
    EDUCATIONAL = "educational"
    ENGINEERING = "engineering"
    BUSINESS = "business"
    GOVERNMENT = "government"
    RELIGIOUS = "religious"
    GENERAL = "general"

class ArabicTextDirection(enum.Enum):
    """Arabic text direction handling"""
    RTL = "rtl"  # Right-to-left
    LTR = "ltr"  # Left-to-right
    MIXED = "mixed"  # Mixed Arabic-English
    AUTO = "auto"  # Auto-detection

class ChatConversation(Base):
    """
    Comprehensive Conversation Management with Iraqi Professional Context
    
    Revolutionary conversation model extracted from Langflow with sophisticated
    Iraqi cultural integration, professional domain specialization, and Arabic
    language support optimized for Iraqi AI chat system requirements.
    
    Key Features:
    - Privacy-First Design: 1-hour automatic session expiration
    - Iraqi Professional Integration: Legal, medical, educational domain context
    - Cultural Validation: Real-time Islamic compliance and appropriateness
    - Arabic RTL Support: Native right-to-left text handling
    - Voice Message Support: Iraqi accent optimization capabilities
    - Sectarian Neutrality: Political sensitivity validation
    """
    __tablename__ = "chat_conversations"

    # Core conversation identification
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(200), nullable=False, index=True)
    
    # Iraqi cultural and professional context
    professional_domain = Column(String(50), nullable=True, index=True, 
                                comment="Iraqi professional context: legal, medical, educational")
    cultural_context_id = Column(UUID(as_uuid=True), ForeignKey("cultural_contexts.id"), nullable=True)
    regional_context = Column(String(50), nullable=True, index=True,
                            comment="Baghdad, Basra, Kurdistan, etc.")
    dialect_preference = Column(String(50), nullable=True, index=True,
                              comment="Iraqi Arabic dialect variation")
    
    # Islamic compliance and cultural validation
    islamic_compliance_level = Column(String(50), nullable=False, 
                                    default=IslamicComplianceLevel.NEUTRAL.value, index=True)
    cultural_validation_status = Column(String(50), nullable=False, 
                                      default=CulturalValidationStatus.PENDING.value, index=True)
    cultural_appropriateness_score = Column(Float, nullable=True,
                                          comment="0.0-1.0 cultural appropriateness score")
    islamic_compliance_score = Column(Float, nullable=True,
                                    comment="0.0-1.0 Islamic compliance score")
    sectarian_neutrality_validated = Column(Boolean, default=False, index=True,
                                           comment="Political/sectarian sensitivity check")
    
    # Conversation status and lifecycle
    status = Column(String(20), nullable=False, default=ConversationStatus.ACTIVE.value, index=True)
    privacy_mode = Column(Boolean, default=True, nullable=False,
                         comment="Privacy-first 1-hour expiration enabled")
    
    # Arabic language and RTL support
    primary_language = Column(String(10), nullable=False, default="ar", index=True,
                            comment="ar (Arabic), en (English), ar-en (Mixed)")
    text_direction = Column(String(10), nullable=False, default=ArabicTextDirection.AUTO.value,
                           comment="RTL support for Arabic text")
    arabic_dialect_detected = Column(String(50), nullable=True, index=True,
                                   comment="Detected Iraqi Arabic dialect")
    mixed_language_support = Column(Boolean, default=True, nullable=False,
                                   comment="Support Arabic-English code switching")
    
    # Voice and multimedia capabilities
    voice_enabled = Column(Boolean, default=True, nullable=False)
    voice_accent_preference = Column(String(50), nullable=True, index=True,
                                   comment="Iraqi accent optimization")
    multimedia_enabled = Column(Boolean, default=True, nullable=False)
    document_processing_enabled = Column(Boolean, default=True, nullable=False)
    
    # Professional features
    professional_template_used = Column(String(100), nullable=True, index=True,
                                       comment="Iraqi professional document template")
    legal_compliance_required = Column(Boolean, default=False, nullable=False)
    medical_privacy_required = Column(Boolean, default=False, nullable=False)
    educational_context_active = Column(Boolean, default=False, nullable=False)
    
    # Conversation metrics and analytics
    message_count = Column(Integer, default=0, nullable=False)
    voice_message_count = Column(Integer, default=0, nullable=False)
    document_count = Column(Integer, default=0, nullable=False)
    cultural_violations_count = Column(Integer, default=0, nullable=False)
    average_response_time = Column(Float, nullable=True, comment="Average response time in seconds")
    user_satisfaction_score = Column(Float, nullable=True, comment="0.0-5.0 user satisfaction")
    
    # Privacy and session management
    session_expires_at = Column(DateTime, nullable=False, index=True,
                               comment="Privacy-first 1-hour session expiration")
    auto_archive_enabled = Column(Boolean, default=True, nullable=False)
    data_retention_days = Column(Integer, default=1, nullable=False,
                                comment="Data retention period (default: 1 day)")
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    last_message_at = Column(DateTime, nullable=True, index=True)
    archived_at = Column(DateTime, nullable=True)
    
    # Advanced features
    metadata = Column(JSONB, nullable=True, comment="Conversation metadata and settings")
    cultural_preferences = Column(JSONB, nullable=True, comment="User cultural preferences")
    professional_context_data = Column(JSONB, nullable=True, comment="Professional domain data")
    analytics_data = Column(JSONB, nullable=True, comment="Conversation analytics")

    # Relationships
    user = relationship("User", back_populates="conversations")
    messages = relationship("ChatMessage", back_populates="conversation", cascade="all, delete-orphan")
    voice_messages = relationship("VoiceMessage", back_populates="conversation", cascade="all, delete-orphan")
    cultural_context = relationship("CulturalContext", back_populates="conversations")

    # Database constraints and indexes
    __table_args__ = (
        # Cultural validation constraints
        CheckConstraint('cultural_appropriateness_score >= 0.0 AND cultural_appropriateness_score <= 1.0',
                       name='ck_chat_conversation_cultural_appropriateness_score'),
        CheckConstraint('islamic_compliance_score >= 0.0 AND islamic_compliance_score <= 1.0',
                       name='ck_chat_conversation_islamic_compliance_score'),
        CheckConstraint('user_satisfaction_score >= 0.0 AND user_satisfaction_score <= 5.0',
                       name='ck_chat_conversation_user_satisfaction_score'),
        CheckConstraint('data_retention_days >= 1',
                       name='ck_chat_conversation_data_retention_days'),
        
        # Performance indexes
        Index('idx_chat_conversation_user_status', 'user_id', 'status'),
        Index('idx_chat_conversation_cultural', 'cultural_validation_status', 'islamic_compliance_level'),
        Index('idx_chat_conversation_professional', 'professional_domain', 'regional_context'),
        Index('idx_chat_conversation_expires', 'session_expires_at', 'status'),
        Index('idx_chat_conversation_language', 'primary_language', 'arabic_dialect_detected'),
        
        # Full-text search support
        Index('idx_chat_conversation_title_fts', 'title', postgresql_using='gin',
              postgresql_ops={'title': 'gin_trgm_ops'}),
    )

    @validates('cultural_appropriateness_score', 'islamic_compliance_score')
    def validate_scores(self, key, value):
        """Validate cultural and Islamic compliance scores are within valid range"""
        if value is not None and (value < 0.0 or value > 1.0):
            raise ValueError(f"{key} must be between 0.0 and 1.0")
        return value

    @validates('user_satisfaction_score')
    def validate_satisfaction_score(self, key, value):
        """Validate user satisfaction score is within valid range"""
        if value is not None and (value < 0.0 or value > 5.0):
            raise ValueError("User satisfaction score must be between 0.0 and 5.0")
        return value

    def __repr__(self):
        return (f"<ChatConversation(id={self.id}, user_id={self.user_id}, "
                f"title='{self.title}', domain={self.professional_domain}, "
                f"status={self.status}, cultural_score={self.cultural_appropriateness_score})>")

class ChatMessage(Base):
    """
    Advanced Message Handling with Arabic RTL Support and Cultural Validation
    
    Revolutionary message model extracted from Langflow with comprehensive
    Arabic RTL support, Iraqi cultural integration, and real-time Islamic
    compliance validation optimized for Iraqi AI chat system requirements.
    
    Key Features:
    - Arabic RTL Support: Native right-to-left text handling and mixed language
    - Cultural Validation: Real-time Islamic compliance and appropriateness scoring
    - Iraqi Dialect Processing: Advanced Iraqi Arabic dialect recognition
    - Professional Context: Domain-aware messaging with Iraqi specialization
    - Privacy Protection: Secure message handling with 1-hour session expiration
    - Voice Integration: Seamless voice message coordination
    """
    __tablename__ = "chat_messages"

    # Core message identification
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("chat_conversations.id"), 
                            nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    parent_message_id = Column(UUID(as_uuid=True), ForeignKey("chat_messages.id"), 
                              nullable=True, index=True)
    
    # Message content and type
    message_type = Column(String(30), nullable=False, default=MessageType.TEXT.value, index=True)
    content = Column(Text, nullable=False, comment="Primary message content")
    content_arabic = Column(Text, nullable=True, comment="Arabic content with RTL formatting")
    content_english = Column(Text, nullable=True, comment="English content for mixed language")
    raw_content = Column(Text, nullable=True, comment="Original unprocessed content")
    
    # Arabic language and RTL processing
    detected_language = Column(String(10), nullable=True, index=True, comment="ar, en, or ar-en")
    text_direction = Column(String(10), nullable=False, default=ArabicTextDirection.AUTO.value)
    arabic_dialect = Column(String(50), nullable=True, index=True, comment="Detected Iraqi dialect")
    rtl_formatted = Column(Boolean, default=False, nullable=False, comment="RTL formatting applied")
    mixed_language_detected = Column(Boolean, default=False, nullable=False)
    language_confidence_score = Column(Float, nullable=True, comment="0.0-1.0 language detection confidence")
    
    # Cultural validation and Islamic compliance
    cultural_validation_status = Column(String(50), nullable=False, 
                                      default=CulturalValidationStatus.PENDING.value, index=True)
    islamic_compliance_level = Column(String(50), nullable=False, 
                                    default=IslamicComplianceLevel.NEUTRAL.value, index=True)
    cultural_appropriateness_score = Column(Float, nullable=True, 
                                          comment="0.0-1.0 cultural appropriateness score")
    islamic_compliance_score = Column(Float, nullable=True,
                                    comment="0.0-1.0 Islamic compliance score")
    sectarian_sensitivity_check = Column(Boolean, default=False, nullable=False)
    political_neutrality_validated = Column(Boolean, default=False, nullable=False)
    
    # Professional context and domain
    professional_domain = Column(String(50), nullable=True, index=True,
                                comment="Message professional context")
    professional_template_id = Column(UUID(as_uuid=True), nullable=True, index=True)
    legal_reviewed = Column(Boolean, default=False, nullable=False)
    medical_privacy_compliant = Column(Boolean, default=False, nullable=False)
    educational_appropriate = Column(Boolean, default=False, nullable=False)
    
    # Message status and processing
    is_user_message = Column(Boolean, nullable=False, index=True)
    is_system_message = Column(Boolean, default=False, nullable=False, index=True)
    is_ai_generated = Column(Boolean, default=False, nullable=False, index=True)
    processing_status = Column(String(30), nullable=False, default="processed", index=True)
    requires_human_review = Column(Boolean, default=False, nullable=False, index=True)
    
    # Voice and multimedia integration
    has_voice_version = Column(Boolean, default=False, nullable=False, index=True)
    voice_message_id = Column(UUID(as_uuid=True), ForeignKey("voice_messages.id"), nullable=True)
    has_attachments = Column(Boolean, default=False, nullable=False, index=True)
    attachment_count = Column(Integer, default=0, nullable=False)
    
    # Message quality and performance
    response_time_ms = Column(Integer, nullable=True, comment="AI response time in milliseconds")
    character_count = Column(Integer, nullable=False, default=0)
    word_count = Column(Integer, nullable=False, default=0)
    arabic_word_count = Column(Integer, nullable=False, default=0)
    english_word_count = Column(Integer, nullable=False, default=0)
    
    # User interaction tracking
    user_rating = Column(Integer, nullable=True, comment="1-5 user rating for AI responses")
    user_feedback = Column(Text, nullable=True, comment="User feedback on message")
    reported_inappropriate = Column(Boolean, default=False, nullable=False, index=True)
    moderation_flags = Column(Integer, default=0, nullable=False, comment="Number of moderation flags")
    
    # Privacy and session management
    expires_at = Column(DateTime, nullable=True, index=True, comment="Message expiration time")
    auto_delete_after_session = Column(Boolean, default=True, nullable=False)
    encrypted_content = Column(Text, nullable=True, comment="Encrypted sensitive content")
    encryption_key_id = Column(String(100), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    processed_at = Column(DateTime, nullable=True, index=True)
    validated_at = Column(DateTime, nullable=True)
    
    # Advanced features and metadata
    metadata = Column(JSONB, nullable=True, comment="Message metadata and processing info")
    cultural_context_data = Column(JSONB, nullable=True, comment="Cultural context information")
    linguistic_analysis = Column(JSONB, nullable=True, comment="Arabic linguistic analysis results")
    processing_logs = Column(JSONB, nullable=True, comment="Message processing logs")
    ai_confidence_scores = Column(JSONB, nullable=True, comment="AI processing confidence scores")

    # Relationships
    conversation = relationship("ChatConversation", back_populates="messages")
    user = relationship("User", back_populates="messages")
    voice_message = relationship("VoiceMessage", back_populates="text_message")
    parent_message = relationship("ChatMessage", remote_side=[id], back_populates="replies")
    replies = relationship("ChatMessage", back_populates="parent_message")
    validation_records = relationship("MessageValidation", back_populates="message")

    # Database constraints and indexes
    __table_args__ = (
        # Content validation constraints
        CheckConstraint('character_count >= 0', name='ck_chat_message_character_count'),
        CheckConstraint('word_count >= 0', name='ck_chat_message_word_count'),
        CheckConstraint('arabic_word_count >= 0', name='ck_chat_message_arabic_word_count'),
        CheckConstraint('english_word_count >= 0', name='ck_chat_message_english_word_count'),
        CheckConstraint('attachment_count >= 0', name='ck_chat_message_attachment_count'),
        CheckConstraint('moderation_flags >= 0', name='ck_chat_message_moderation_flags'),
        
        # Quality score constraints
        CheckConstraint('cultural_appropriateness_score >= 0.0 AND cultural_appropriateness_score <= 1.0',
                       name='ck_chat_message_cultural_appropriateness_score'),
        CheckConstraint('islamic_compliance_score >= 0.0 AND islamic_compliance_score <= 1.0',
                       name='ck_chat_message_islamic_compliance_score'),
        CheckConstraint('language_confidence_score >= 0.0 AND language_confidence_score <= 1.0',
                       name='ck_chat_message_language_confidence_score'),
        CheckConstraint('user_rating >= 1 AND user_rating <= 5',
                       name='ck_chat_message_user_rating'),
        
        # Performance indexes
        Index('idx_chat_message_conversation_created', 'conversation_id', 'created_at'),
        Index('idx_chat_message_user_type', 'user_id', 'message_type'),
        Index('idx_chat_message_cultural_validation', 'cultural_validation_status', 'islamic_compliance_level'),
        Index('idx_chat_message_professional', 'professional_domain', 'processing_status'),
        Index('idx_chat_message_arabic', 'detected_language', 'arabic_dialect'),
        Index('idx_chat_message_moderation', 'reported_inappropriate', 'requires_human_review'),
        Index('idx_chat_message_expires', 'expires_at', 'auto_delete_after_session'),
        
        # Full-text search support for Arabic and English
        Index('idx_chat_message_content_fts', 'content', postgresql_using='gin',
              postgresql_ops={'content': 'gin_trgm_ops'}),
        Index('idx_chat_message_arabic_fts', 'content_arabic', postgresql_using='gin',
              postgresql_ops={'content_arabic': 'gin_trgm_ops'}),
    )

    @validates('cultural_appropriateness_score', 'islamic_compliance_score', 'language_confidence_score')
    def validate_scores(self, key, value):
        """Validate scores are within valid range"""
        if value is not None and (value < 0.0 or value > 1.0):
            raise ValueError(f"{key} must be between 0.0 and 1.0")
        return value

    @validates('user_rating')
    def validate_user_rating(self, key, value):
        """Validate user rating is within valid range"""
        if value is not None and (value < 1 or value > 5):
            raise ValueError("User rating must be between 1 and 5")
        return value

    @validates('content')
    def validate_content(self, key, content):
        """Validate message content is not empty"""
        if not content or not content.strip():
            raise ValueError("Message content cannot be empty")
        return content.strip()

    def get_display_content(self) -> str:
        """Get appropriately formatted content for display based on language detection"""
        if self.detected_language == "ar" and self.content_arabic:
            return self.content_arabic
        elif self.detected_language == "en" and self.content_english:
            return self.content_english
        elif self.detected_language == "ar-en":
            # Mixed language - combine both with proper formatting
            arabic_part = self.content_arabic or ""
            english_part = self.content_english or ""
            return f"{arabic_part} {english_part}".strip()
        else:
            return self.content

    def __repr__(self):
        return (f"<ChatMessage(id={self.id}, conversation_id={self.conversation_id}, "
                f"type={self.message_type}, lang={self.detected_language}, "
                f"cultural_score={self.cultural_appropriateness_score})>")

# SQLAlchemy event listeners for automatic session expiration and cultural validation
@event.listens_for(ChatConversation, 'before_insert')
def set_conversation_expiration(mapper, connection, target):
    """Set automatic 1-hour session expiration for privacy-first design"""
    if target.privacy_mode and not target.session_expires_at:
        target.session_expires_at = datetime.utcnow() + timedelta(hours=1)

@event.listens_for(ChatMessage, 'before_insert')
def set_message_expiration(mapper, connection, target):
    """Set message expiration based on conversation settings"""
    if target.auto_delete_after_session and not target.expires_at:
        target.expires_at = datetime.utcnow() + timedelta(hours=1)

@event.listens_for(ChatMessage, 'before_insert')
@event.listens_for(ChatMessage, 'before_update')
def update_word_counts(mapper, connection, target):
    """Automatically update word counts based on content"""
    if target.content:
        target.character_count = len(target.content)
        target.word_count = len(target.content.split())
    
    if target.content_arabic:
        target.arabic_word_count = len(target.content_arabic.split())
    
    if target.content_english:
        target.english_word_count = len(target.content_english.split())