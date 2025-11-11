"""
Chat API Routes
FastAPI endpoints for chat session management and messaging
"""

from fastapi import APIRouter, Depends, HTTPException, status, Request
from typing import Optional
import logging

# Import models and services
try:
    from apps.api.models.chat import (
        ChatSessionCreate,
        ChatSession,
        MessageCreate,
        MessageResponse,
        ChatMessage,
        ChatSessionListResponse,
        ErrorResponse,
    )
    from apps.api.services.chat_service import ChatService
    from apps.api.middleware.auth_middleware import get_current_user_dependency
except ImportError:
    from models.chat import (
        ChatSessionCreate,
        ChatSession,
        MessageCreate,
        MessageResponse,
        ChatMessage,
        ChatSessionListResponse,
        ErrorResponse,
    )
    from services.chat_service import ChatService
    from middleware.auth_middleware import get_current_user_dependency

logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/api/v1/chat", tags=["chat"])

# Initialize chat service
chat_service = ChatService()


# ========== CHAT SESSION ENDPOINTS ==========


@router.post(
    "",
    response_model=ChatSession,
    status_code=status.HTTP_201_CREATED,
    summary="Create new chat session",
    description="Create a new chat session with optional title and language preferences",
)
async def create_chat_session(
    request: ChatSessionCreate,
    current_user: dict = Depends(get_current_user_dependency),
):
    """
    Create a new chat session.

    Requires authentication. Each user can have multiple chat sessions.
    Sessions support Arabic and English with Iraqi dialect preferences.

    Args:
        request: Chat session creation request
        current_user: Current authenticated user

    Returns:
        ChatSession: Created chat session with ID and metadata
    """
    try:
        session = await chat_service.create_session(
            user_id=current_user["user_id"],
            title=request.title,
            language=request.language,
            dialect=request.dialect,
        )

        return ChatSession(**session)
    except Exception as e:
        logger.error(f"Error creating chat session: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create chat session",
        )


@router.get(
    "",
    response_model=ChatSessionListResponse,
    summary="List user chat sessions",
    description="Retrieve all chat sessions for the current user with pagination",
)
async def list_chat_sessions(
    limit: int = 50,
    offset: int = 0,
    current_user: dict = Depends(get_current_user_dependency),
):
    """
    List all chat sessions for the current user.

    Supports pagination with limit and offset parameters.

    Args:
        limit: Number of sessions to return (default: 50, max: 100)
        offset: Offset for pagination (default: 0)
        current_user: Current authenticated user

    Returns:
        ChatSessionListResponse: List of chat sessions with pagination info
    """
    try:
        # Validate pagination params
        limit = min(limit, 100)
        if offset < 0:
            offset = 0

        sessions, total = await chat_service.list_sessions(
            user_id=current_user["user_id"],
            limit=limit,
            offset=offset,
        )

        return ChatSessionListResponse(
            sessions=[ChatSession(**s) for s in sessions],
            total=total,
            limit=limit,
            offset=offset,
        )
    except Exception as e:
        logger.error(f"Error listing chat sessions: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve chat sessions",
        )


@router.get(
    "/{session_id}",
    response_model=ChatSession,
    summary="Get chat session",
    description="Retrieve a specific chat session by ID",
)
async def get_chat_session(
    session_id: str,
    current_user: dict = Depends(get_current_user_dependency),
):
    """
    Get a specific chat session.

    Args:
        session_id: Session ID
        current_user: Current authenticated user

    Returns:
        ChatSession: Chat session details

    Raises:
        HTTPException 404: If session not found or user unauthorized
    """
    try:
        session = await chat_service.get_session(
            session_id=session_id,
            user_id=current_user["user_id"],
        )

        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chat session not found",
            )

        return ChatSession(**session)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving chat session {session_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve chat session",
        )


@router.delete(
    "/{session_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete chat session",
    description="Delete a chat session and all its messages",
)
async def delete_chat_session(
    session_id: str,
    current_user: dict = Depends(get_current_user_dependency),
):
    """
    Delete a chat session.

    Also deletes all messages in the session. This action cannot be undone.

    Args:
        session_id: Session ID
        current_user: Current authenticated user

    Returns:
        None (204 No Content on success)

    Raises:
        HTTPException 404: If session not found or user unauthorized
    """
    try:
        deleted = await chat_service.delete_session(
            session_id=session_id,
            user_id=current_user["user_id"],
        )

        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chat session not found",
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting chat session {session_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete chat session",
        )


# ========== MESSAGE ENDPOINTS ==========


@router.post(
    "/{session_id}/messages",
    response_model=MessageResponse,
    status_code=status.HTTP_200_OK,
    summary="Send message to AI",
    description="Send a message to the AI and receive a response",
)
async def send_message(
    session_id: str,
    request: MessageCreate,
    current_user: dict = Depends(get_current_user_dependency),
):
    """
    Send a message and get an AI response.

    The AI response is generated with support for:
    - Iraqi Arabic dialect
    - Cultural context awareness
    - Professional domain expertise
    - Contextual conversation history

    Args:
        session_id: Chat session ID
        request: Message content
        current_user: Current authenticated user

    Returns:
        MessageResponse: User message and AI response with metadata

    Raises:
        HTTPException 404: If session not found
        HTTPException 400: If message validation fails
    """
    try:
        # Validate message
        if not request.content or len(request.content.strip()) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Message content cannot be empty",
            )

        response = await chat_service.send_message(
            session_id=session_id,
            user_id=current_user["user_id"],
            content=request.content,
            system_prompt=request.system_prompt,
        )

        return MessageResponse(**response)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error sending message to session {session_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process message",
        )


@router.get(
    "/{session_id}/messages",
    response_model=dict,
    summary="Get chat history",
    description="Retrieve message history for a chat session",
)
async def get_messages(
    session_id: str,
    limit: int = 50,
    offset: int = 0,
    current_user: dict = Depends(get_current_user_dependency),
):
    """
    Get message history for a chat session.

    Messages are returned in reverse chronological order (newest first).
    Supports pagination with limit and offset.

    Args:
        session_id: Chat session ID
        limit: Number of messages to return (default: 50, max: 100)
        offset: Offset for pagination (default: 0)
        current_user: Current authenticated user

    Returns:
        dict: Messages list with pagination info

    Raises:
        HTTPException 404: If session not found
    """
    try:
        # Validate pagination params
        limit = min(limit, 100)
        if offset < 0:
            offset = 0

        messages, total = await chat_service.get_messages(
            session_id=session_id,
            user_id=current_user["user_id"],
            limit=limit,
            offset=offset,
        )

        return {
            "messages": messages,
            "total": total,
            "limit": limit,
            "offset": offset,
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving messages from session {session_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve messages",
        )
