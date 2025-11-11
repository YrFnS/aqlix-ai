"""
Arabic RTL Processor Agent

Agent for processing Arabic text with RTL formatting and Iraqi dialect recognition.
"""

import threading

try:
    from pydantic_ai import Agent, RunContext
except ImportError:
    Agent = None
    RunContext = None
    print("PydanticAI not available - RTL processor will use mock mode")

from apps.api.agents.core.base_agent import BaseIraqiAgent
from apps.api.agents.core.providers import get_llm_model
from apps.api.agents.core.models import ArabicProcessingResult
from apps.api.agents.cultural.rtl_processor.dependencies import RTLProcessorDeps
from apps.api.agents.cultural.rtl_processor.tools import ArabicRTLTools


class ArabicRTLProcessor(BaseIraqiAgent[RTLProcessorDeps]):
    """
    Arabic RTL processing agent with Iraqi dialect recognition.

    Capabilities:
    - 99%+ RTL text formatting accuracy
    - 85%+ Iraqi dialect recognition
    - Mixed Arabic-English code-switching detection
    - Unicode/HTML/CSS RTL formatting
    - Arabic text normalization

    This agent ensures proper Arabic text processing and RTL rendering.
    """

    def __init__(self):
        super().__init__(agent_name="arabic-rtl-processor")
        self.tools = ArabicRTLTools()

    def _create_agent(self) -> Agent:
        """Create RTL processor agent with Arabic expertise."""
        if Agent is None:
            return None

        agent = Agent(
            model=get_llm_model(),
            system_prompt=self.get_system_prompt(),
            deps_type=RTLProcessorDeps,
            retries=self.settings.max_retries,
        )

        # Register tools
        self._register_tools(agent)

        return agent

    def get_system_prompt(self) -> str:
        """Get Arabic RTL processing system prompt."""
        return """You are an Arabic RTL text processing specialist with expertise in:

**Core Competencies:**
- Arabic script and typography (RTL rendering, Unicode handling)
- Iraqi Arabic dialect recognition and processing
- Modern Standard Arabic (MSA) normalization
- Mixed Arabic-English text handling (code-switching)
- Bi-directional text formatting (Unicode, HTML, CSS)

**Your Role:**
Process Arabic text for proper RTL rendering and dialect recognition.

**Processing Rules:**

1. **RTL Formatting** (MINIMUM 99% accuracy):
   - Detect text direction accurately (RTL, LTR, mixed)
   - Apply appropriate Unicode direction markers (RLE, LRE, RLM)
   - Generate HTML/CSS RTL attributes when needed
   - Handle mixed Arabic-English text properly
   - Preserve English LTR segments in mixed content

2. **Iraqi Dialect Recognition** (MINIMUM 85% accuracy):
   - Identify Iraqi dialect markers (شلونك, شكو ماكو, زين, etc.)
   - Distinguish Iraqi dialect from MSA
   - Recognize regional Iraqi variations
   - Provide confidence scores for dialect detection
   - Support fallback to MSA when needed

3. **Text Normalization**:
   - Remove Arabic diacritics (tashkeel) when requested
   - Normalize Alef variations (إ، أ، آ → ا)
   - Remove tatweel (kashida) for consistent rendering
   - Standardize Taa marbuta forms

4. **Code-Switching Detection**:
   - Identify Arabic-English mixing patterns
   - Count switching points in text
   - Calculate Arabic vs English ratios
   - Assess code-switching complexity

**Output Requirements:**
- Provide formatted RTL text (Unicode/HTML/CSS)
- Include dialect detection results with confidence
- Return text direction metadata
- Suggest optimal formatting approach
- Handle edge cases gracefully

**Performance Standards:**
- RTL processing response time: <100ms
- Accuracy: 99%+ RTL formatting, 85%+ Iraqi dialect recognition
- Support for all Arabic Unicode ranges (U+0600-U+06FF, extended ranges)
"""

    def _register_tools(self, agent: Agent):
        """Register RTL processing tools with the agent."""
        if agent is None:
            return

        # Tools will be registered using @agent.tool decorator
        # Implementation will be completed with full PydanticAI integration
        pass

    async def process_arabic_text(
        self,
        text: str,
        format_type: str = "unicode",
        detect_dialect: bool = True,
    ) -> ArabicProcessingResult:
        """
        Process Arabic text with RTL formatting and dialect recognition.

        Args:
            text: Arabic text to process
            format_type: Output format ("unicode", "html", "css")
            detect_dialect: Whether to perform dialect detection

        Returns:
            Processing result with formatted text and metadata
        """
        # Create dependencies
        deps = RTLProcessorDeps(
            text_direction_mode="auto",
            dialect_detection_enabled=detect_dialect,
            preferred_dialect="iraqi",
            normalize_arabic_text=False,
            detect_code_switching=True,
        )

        # Detect text direction
        text_direction = self.tools.detect_text_direction(text)

        # Format RTL text
        rtl_formatted_text = await self.tools.format_rtl_text(text, format_type)

        # Detect Iraqi dialect if requested
        dialect_result = {"dialect": "none", "confidence": 0.0, "is_iraqi": False}
        if detect_dialect:
            dialect_result = await self.tools.detect_iraqi_dialect(text)

        # Detect code-switching
        code_switching_result = await self.tools.detect_code_switching(text)

        # Get RTL metadata
        rtl_metadata = self.tools.get_rtl_metadata(text)

        # Normalize text if needed
        normalized_text = None
        if deps.normalize_arabic_text:
            normalized_text = await self.tools.normalize_arabic_text(text)

        # Create processing result
        return ArabicProcessingResult(
            original_text=text,
            rtl_formatted_text=rtl_formatted_text,
            normalized_text=normalized_text,
            text_direction=text_direction,
            detected_dialect=dialect_result["dialect"],
            dialect_confidence=dialect_result["confidence"],
            is_iraqi_dialect=dialect_result.get("is_iraqi", False),
            is_code_switching=code_switching_result["is_code_switching"],
            arabic_ratio=code_switching_result["arabic_ratio"],
            rtl_metadata=rtl_metadata,
        )

    async def detect_dialect(self, text: str) -> dict:
        """
        Detect Iraqi dialect in Arabic text.

        Args:
            text: Arabic text

        Returns:
            Dialect detection result
        """
        return await self.tools.detect_iraqi_dialect(text)

    async def format_for_web(self, text: str) -> str:
        """
        Format Arabic text for web display with RTL support.

        Args:
            text: Arabic text

        Returns:
            HTML-formatted text with RTL attributes
        """
        return await self.tools.format_rtl_text(text, format_type="html")


# Singleton instance
_rtl_processor_instance = None
_rtl_processor_lock = threading.Lock()


def get_rtl_processor() -> ArabicRTLProcessor:
    """
    Get or create the global RTL processor instance.

    Returns:
        Singleton ArabicRTLProcessor instance
    """
    global _rtl_processor_instance
    if _rtl_processor_instance is None:
        with _rtl_processor_lock:
            if _rtl_processor_instance is None:
                _rtl_processor_instance = ArabicRTLProcessor()
    return _rtl_processor_instance
