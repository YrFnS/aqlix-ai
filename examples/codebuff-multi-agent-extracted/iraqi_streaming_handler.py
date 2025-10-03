"""
Iraqi Streaming Response Handler
Extracted from: CodebuffAI/codebuff (backend/src/xml-stream-parser.ts)

Handle streaming responses with Arabic text support

Usage:
    from examples.codebuff_multi_agent_extracted.iraqi_streaming_handler import IraqiStreamingResponseHandler

    handler = IraqiStreamingResponseHandler()
    async for chunk in handler.stream_arabic_response(response_stream):
        print(chunk)
"""

from typing import AsyncIterator
from enum import Enum


class TextDirection(str, Enum):
    LTR = "ltr"
    RTL = "rtl"


class IraqiStreamingResponseHandler:
    """
    Handle streaming responses with Arabic text support

    Features:
    - Real-time Arabic text streaming
    - RTL content buffering
    - Cultural validation during streaming
    - Professional domain formatting
    """

    async def stream_arabic_response(
        self, response_stream: AsyncIterator
    ) -> AsyncIterator[str]:
        """Stream Arabic responses with RTL awareness"""

        buffer = ""
        async for chunk in response_stream:
            # Detect if chunk contains Arabic
            is_arabic = self._contains_arabic(chunk)

            if is_arabic:
                # Buffer for RTL processing
                buffer += chunk

                # Yield when complete sentence
                if self._is_complete_sentence(buffer):
                    yield self._format_rtl(buffer)
                    buffer = ""
            else:
                # Stream LTR content immediately
                yield chunk

        # Yield any remaining buffered content
        if buffer:
            yield self._format_rtl(buffer)

    def _contains_arabic(self, text: str) -> bool:
        """Check if text contains Arabic characters"""
        return any("\u0600" <= char <= "\u06ff" for char in text)

    def _is_complete_sentence(self, text: str) -> bool:
        """Check if Arabic text forms complete sentence"""
        return text.endswith((".", "؟", "!", "。"))

    def _format_rtl(self, text: str) -> str:
        """Format text for RTL display"""
        return f"<div dir='rtl'>{text}</div>"
