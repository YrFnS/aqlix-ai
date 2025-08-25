"""
Enhanced message system with Iraqi AI integration.
Extracted from browser-use with Arabic RTL and cultural validation support.
"""

from typing import Literal, Union
from pydantic import BaseModel, Field


class ContentPartTextParam(BaseModel):
    """Text content part with Arabic RTL support."""
    type: Literal["text"] = "text"
    text: str
    rtl_direction: bool = Field(default=False, description="Whether text should be rendered RTL")
    language: str = Field(default="en", description="Language code (ar, en, ar-iq)")


class ContentPartImageParam(BaseModel):
    """Image content part."""
    type: Literal["image"] = "image"
    image_url: dict
    alt_text: str = Field(default="", description="Alternative text for accessibility")


class ContentPartRefusalParam(BaseModel):
    """Refusal content part for cultural/Islamic compliance."""
    type: Literal["refusal"] = "refusal" 
    reason: str = Field(description="Reason for refusal (cultural, Islamic compliance, etc.)")


# Content type union
ContentPart = Union[ContentPartTextParam, ContentPartImageParam, ContentPartRefusalParam]


class BaseMessage(BaseModel):
    """
    Base message class with Iraqi AI enhancements.
    
    Supports Arabic RTL, cultural validation, and Islamic compliance.
    """
    role: str
    content: Union[str, list[ContentPart]]
    
    # Iraqi AI enhancements
    cultural_validation_score: float = Field(default=0.0, ge=0.0, le=1.0)
    islamic_compliance: bool = Field(default=True)
    arabic_content_detected: bool = Field(default=False)
    iraqi_dialect_confidence: float = Field(default=0.0, ge=0.0, le=1.0)
    
    def has_arabic_content(self) -> bool:
        """Check if message contains Arabic text."""
        import re
        
        if isinstance(self.content, str):
            text = self.content
        else:
            # Extract text from content parts
            text = ""
            for part in self.content:
                if isinstance(part, ContentPartTextParam):
                    text += part.text
        
        # Arabic Unicode range detection
        arabic_pattern = r'[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]'
        return bool(re.search(arabic_pattern, text))
    
    def extract_text_content(self) -> str:
        """Extract all text content from the message."""
        if isinstance(self.content, str):
            return self.content
        
        text_parts = []
        for part in self.content:
            if isinstance(part, ContentPartTextParam):
                text_parts.append(part.text)
        
        return " ".join(text_parts)


class SystemMessage(BaseMessage):
    """System message with Iraqi AI context."""
    role: Literal["system"] = "system"
    
    def __init__(self, content: Union[str, list[ContentPart]], **kwargs):
        super().__init__(role="system", content=content, **kwargs)


class UserMessage(BaseMessage):
    """User message with cultural validation."""
    role: Literal["user"] = "user"
    
    def __init__(self, content: Union[str, list[ContentPart]], **kwargs):
        super().__init__(role="user", content=content, **kwargs)
        # Auto-detect Arabic content
        self.arabic_content_detected = self.has_arabic_content()


class AssistantMessage(BaseMessage):
    """Assistant message with Islamic compliance checking."""
    role: Literal["assistant"] = "assistant"
    
    def __init__(self, content: Union[str, list[ContentPart]], **kwargs):
        super().__init__(role="assistant", content=content, **kwargs)
        # Auto-detect Arabic content
        self.arabic_content_detected = self.has_arabic_content()


# Convenience type aliases for easier transition from langchain
ContentText = ContentPartTextParam
ContentImage = ContentPartImageParam  
ContentRefusal = ContentPartRefusalParam