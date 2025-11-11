"""
Chat Service - Handles chat session and message management
Integrates with PydanticAI for AI responses and cultural context
"""

import logging
import uuid
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
import time

logger = logging.getLogger(__name__)


class ChatService:
    """
    Service for managing chat sessions and messages.

    Features:
    - Chat session CRUD operations
    - Message storage and retrieval
    - Integration with PydanticAI for AI responses
    - Cultural context preservation
    - Iraqi dialect support
    """

    def __init__(self):
        """Initialize chat service"""
        # In-memory storage for demo (replace with database in production)
        self.sessions: Dict[str, Dict[str, Any]] = {}
        self.messages: Dict[str, List[Dict[str, Any]]] = {}

    async def create_session(
        self,
        user_id: str,
        title: Optional[str] = None,
        language: str = "ar",
        dialect: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Create a new chat session.

        Args:
            user_id: User ID
            title: Optional session title
            language: Language code (ar, en)
            dialect: Optional Iraqi dialect

        Returns:
            Chat session dict with id, user_id, title, language, dialect, timestamps
        """
        session_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc)

        session = {
            "id": session_id,
            "user_id": user_id,
            "title": title or f"Chat {now.strftime('%Y-%m-%d %H:%M')}",
            "language": language,
            "dialect": dialect,
            "created_at": now,
            "updated_at": now,
            "message_count": 0,
        }

        self.sessions[session_id] = session
        self.messages[session_id] = []

        logger.info(f"Created chat session {session_id} for user {user_id}")
        return session

    async def get_session(
        self, session_id: str, user_id: str
    ) -> Optional[Dict[str, Any]]:
        """
        Get a chat session by ID.

        Args:
            session_id: Session ID
            user_id: User ID (for authorization check)

        Returns:
            Chat session dict or None if not found
        """
        session = self.sessions.get(session_id)

        if not session:
            logger.warning(f"Session {session_id} not found")
            return None

        # Verify ownership
        if session["user_id"] != user_id:
            logger.warning(
                f"User {user_id} attempted unauthorized access to session {session_id}"
            )
            return None

        return session

    async def list_sessions(
        self,
        user_id: str,
        limit: int = 50,
        offset: int = 0,
    ) -> tuple[List[Dict[str, Any]], int]:
        """
        List chat sessions for a user.

        Args:
            user_id: User ID
            limit: Number of sessions to return
            offset: Offset for pagination

        Returns:
            Tuple of (sessions list, total count)
        """
        user_sessions = [
            session
            for session in self.sessions.values()
            if session["user_id"] == user_id
        ]

        # Sort by updated_at descending
        user_sessions.sort(key=lambda x: x["updated_at"], reverse=True)

        total = len(user_sessions)
        paginated = user_sessions[offset : offset + limit]

        return paginated, total

    async def delete_session(self, session_id: str, user_id: str) -> bool:
        """
        Delete a chat session.

        Args:
            session_id: Session ID
            user_id: User ID (for authorization check)

        Returns:
            True if deleted, False otherwise
        """
        session = self.sessions.get(session_id)

        if not session:
            logger.warning(f"Session {session_id} not found for deletion")
            return False

        # Verify ownership
        if session["user_id"] != user_id:
            logger.warning(
                f"User {user_id} attempted to delete unauthorized session {session_id}"
            )
            return False

        # Delete session and messages
        del self.sessions[session_id]
        if session_id in self.messages:
            del self.messages[session_id]

        logger.info(f"Deleted chat session {session_id}")
        return True

    async def send_message(
        self,
        session_id: str,
        user_id: str,
        content: str,
        system_prompt: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Send a message and get AI response.

        Args:
            session_id: Session ID
            user_id: User ID (for authorization)
            content: Message content
            system_prompt: Optional custom system prompt

        Returns:
            Message response with user_message, assistant_message, and metadata
        """
        # Verify session ownership
        session = await self.get_session(session_id, user_id)
        if not session:
            logger.error(f"Unauthorized or invalid session {session_id}")
            raise ValueError("Session not found or unauthorized")

        # Create user message
        user_message_id = str(uuid.uuid4())
        user_message = {
            "id": user_message_id,
            "role": "user",
            "content": content,
            "created_at": datetime.now(timezone.utc),
        }

        # Store user message
        if session_id not in self.messages:
            self.messages[session_id] = []
        self.messages[session_id].append(user_message)

        # Generate AI response (placeholder - integrate with PydanticAI)
        start_time = time.time()
        assistant_response = await self._generate_ai_response(
            session_id, content, system_prompt
        )
        processing_time_ms = (time.time() - start_time) * 1000

        # Create assistant message
        assistant_message_id = str(uuid.uuid4())
        assistant_message = {
            "id": assistant_message_id,
            "role": "assistant",
            "content": assistant_response,
            "created_at": datetime.now(timezone.utc),
        }

        # Store assistant message
        self.messages[session_id].append(assistant_message)

        # Update session metadata
        session["message_count"] = len(self.messages[session_id])
        session["updated_at"] = datetime.now(timezone.utc)

        logger.info(
            f"Sent message to session {session_id}, received response in {processing_time_ms:.2f}ms"
        )

        return {
            "id": str(uuid.uuid4()),
            "user_message": user_message,
            "assistant_message": assistant_message,
            "processing_time_ms": processing_time_ms,
            "tokens_used": None,  # TODO: Track token usage
            "model": "gpt-4o-mini",
        }

    async def get_messages(
        self,
        session_id: str,
        user_id: str,
        limit: int = 50,
        offset: int = 0,
    ) -> tuple[List[Dict[str, Any]], int]:
        """
        Get messages from a chat session.

        Args:
            session_id: Session ID
            user_id: User ID (for authorization)
            limit: Number of messages to return
            offset: Offset for pagination

        Returns:
            Tuple of (messages list, total count)
        """
        # Verify session ownership
        session = await self.get_session(session_id, user_id)
        if not session:
            logger.error(f"Unauthorized or invalid session {session_id}")
            raise ValueError("Session not found or unauthorized")

        messages = self.messages.get(session_id, [])

        # Sort by created_at descending (newest first)
        messages_sorted = sorted(messages, key=lambda x: x["created_at"], reverse=True)

        total = len(messages_sorted)
        paginated = messages_sorted[offset : offset + limit]

        return paginated, total

    async def _generate_ai_response(
        self,
        session_id: str,
        user_message: str,
        system_prompt: Optional[str] = None,
    ) -> str:
        """
        Generate AI response for user message.

        TODO: Integrate with PydanticAI for:
        - Iraqi dialect processing
        - Cultural context awareness
        - Professional domain expertise

        Args:
            session_id: Session ID
            user_message: User message content
            system_prompt: Optional custom system prompt

        Returns:
            AI response text
        """
        # TODO: Implement actual PydanticAI integration
        # For now, return a placeholder response
        logger.info(f"Generating AI response for session {session_id}")

        # Get conversation history for context
        messages = self.messages.get(session_id, [])

        # Build context
        context = f"User asked: {user_message}\n"
        context += f"Conversation history: {len(messages)} messages\n"

        # Placeholder response
        response = (
            f"شكراً على رسالتك / Thank you for your message.\n"
            f"أنا مساعد ذكي يدعم اللهجة العراقية والسياق الثقافي / "
            f"I'm an AI assistant supporting Iraqi dialect and cultural context.\n"
            f"(This is a placeholder response - implement PydanticAI integration in production)"
        )

        return response
