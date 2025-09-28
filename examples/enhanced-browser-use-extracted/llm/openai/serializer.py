"""
OpenAI message serializer with Iraqi AI enhancements.
Handles Arabic RTL content and cultural validation.
"""

from typing import Any, Dict, List, Union

from ..messages import (
    BaseMessage,
    ContentPartTextParam,
    ContentPartImageParam,
    ContentPartRefusalParam,
)


class OpenAIMessageSerializer:
    """
    Serializer for converting enhanced messages to OpenAI format.

    Handles Arabic RTL content, cultural metadata, and Islamic compliance markers.
    """

    @staticmethod
    def serialize_messages(messages: List[BaseMessage]) -> List[Dict[str, Any]]:
        """
        Convert enhanced messages to OpenAI chat format.

        Args:
            messages: List of enhanced messages with Iraqi AI metadata

        Returns:
            List of OpenAI-compatible message dictionaries
        """
        openai_messages = []

        for message in messages:
            openai_msg = OpenAIMessageSerializer._serialize_single_message(message)
            openai_messages.append(openai_msg)

        return openai_messages

    @staticmethod
    def _serialize_single_message(message: BaseMessage) -> Dict[str, Any]:
        """
        Serialize a single message to OpenAI format.

        Args:
            message: Enhanced message with cultural metadata

        Returns:
            OpenAI-compatible message dictionary
        """
        base_msg = {
            "role": message.role,
            "content": OpenAIMessageSerializer._serialize_content(message.content),
        }

        # Add Iraqi AI metadata as system context if needed
        if message.role == "user" and (
            message.arabic_content_detected
            or message.cultural_validation_score > 0.0
            or message.iraqi_dialect_confidence > 0.0
        ):
            # Preserve cultural context for better model understanding
            cultural_context = OpenAIMessageSerializer._create_cultural_context(message)
            if cultural_context and isinstance(base_msg["content"], str):
                base_msg["content"] = f"{cultural_context}\n\n{base_msg['content']}"

        return base_msg

    @staticmethod
    def _serialize_content(
        content: Union[
            str,
            List[
                Union[
                    ContentPartTextParam, ContentPartImageParam, ContentPartRefusalParam
                ]
            ],
        ],
    ) -> Union[str, List[Dict[str, Any]]]:
        """
        Serialize message content to OpenAI format.

        Args:
            content: Message content (string or list of content parts)

        Returns:
            OpenAI-compatible content format
        """
        if isinstance(content, str):
            return content

        # Handle content parts
        openai_content = []
        for part in content:
            if isinstance(part, ContentPartTextParam):
                text_part = {"type": "text", "text": part.text}
                # Add RTL direction hint if needed
                if part.rtl_direction:
                    text_part["text"] = f"\u202b{part.text}\u202c"  # Add RTL markers
                openai_content.append(text_part)

            elif isinstance(part, ContentPartImageParam):
                openai_content.append(
                    {"type": "image_url", "image_url": part.image_url}
                )

            elif isinstance(part, ContentPartRefusalParam):
                # Convert refusal to text explanation
                openai_content.append(
                    {"type": "text", "text": f"[Content refused: {part.reason}]"}
                )

        return openai_content if openai_content else ""

    @staticmethod
    def _create_cultural_context(message: BaseMessage) -> str:
        """
        Create cultural context string for better model understanding.

        Args:
            message: Message with cultural metadata

        Returns:
            Cultural context string or empty string
        """
        context_parts = []

        if message.arabic_content_detected:
            context_parts.append("Arabic content detected")

        if message.iraqi_dialect_confidence > 0.7:
            context_parts.append(
                f"Iraqi dialect confidence: {message.iraqi_dialect_confidence:.1%}"
            )

        if message.cultural_validation_score > 0.0:
            context_parts.append(
                f"Cultural validation score: {message.cultural_validation_score:.1%}"
            )

        if not message.islamic_compliance:
            context_parts.append("Islamic compliance review required")

        if context_parts:
            return f"[Cultural Context: {', '.join(context_parts)}]"

        return ""
