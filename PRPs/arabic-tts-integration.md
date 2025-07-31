name: "Arabic Text-to-Speech Integration with Iraqi Dialect Support"
description: |

## Purpose
Implement comprehensive Arabic TTS functionality with Iraqi dialect optimization, cultural appropriateness validation, and multi-provider fallback support for the Iraqi AI Chat System, building upon existing TTS infrastructure and PydanticAI agent patterns.

## Core Principles
1. **Context is King**: Leverage existing TTS optimization and cultural validation systems
2. **Validation Loops**: Comprehensive testing with Iraqi dialect speakers and cultural validators
3. **Information Dense**: Build upon proven patterns from examples/arabic-tts/ and examples/voice-streaming/
4. **Progressive Success**: Start with OpenAI TTS-1-HD optimization, add Azure fallback, enhance with Web Speech API
5. **Global rules**: Follow all rules in CLAUDE.md including privacy-first approach

---

## Goal
Build a production-ready Arabic TTS system that converts AI chat responses into natural-sounding Iraqi Arabic speech with professional context awareness, cultural appropriateness validation, and real-time streaming capabilities integrated into the existing Iraqi AI Chat System.

## Why
- **Enhanced Accessibility**: Make the AI system accessible to users who prefer audio interaction over text
- **Cultural Authenticity**: Provide natural-sounding Iraqi dialect pronunciation that respects cultural norms
- **Professional Integration**: Support legal, medical, educational, and business terminology with appropriate pronunciation
- **Mobile-First Experience**: Optimize for Iraq's mobile-primary user base with efficient audio delivery
- **Privacy Compliance**: Maintain privacy-first approach with session-only TTS caching and no persistent audio storage

## What
A multi-layered TTS system that intelligently processes Arabic text for optimal pronunciation, selects appropriate voices based on professional context, and delivers high-quality audio through real-time streaming with comprehensive fallback mechanisms.

### Success Criteria
- [ ] TTS generation time < 3 seconds for 90% of requests
- [ ] Cultural appropriateness score > 95% for Iraqi context validation
- [ ] Audio quality rating > 4/5 from Iraqi native speakers across all professional domains
- [ ] Zero sensitive data persistence in TTS caching system
- [ ] Cross-browser compatibility with graceful Web Speech API fallback
- [ ] Integration with existing chat system maintains < 500ms response time overhead

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- url: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API
  why: Web Speech API implementation patterns and Arabic language limitations
  critical: Chrome requires async voice loading, Safari has downloadable voice issues
  
- url: https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support  
  why: Azure Cognitive Services native Iraqi Arabic (ar-IQ) support with neural voices
  critical: Rana (ar-IQ-RanaNeural) and Bassel (ar-IQ-BasselNeural) voices available

- file: examples/arabic-tts/tts-optimization.py
  why: Existing Iraqi dialect optimization patterns and professional context detection
  critical: IraqiTTSOptimizer class with dialect enhancement rules and voice recommendations

- file: examples/voice-streaming/websocket-voice-handler.py  
  why: WebSocket streaming infrastructure and audio processing patterns
  critical: FFmpeg audio conversion, base64 encoding, and connection management

- file: examples/main_agent_reference/
  why: PydanticAI agent architecture patterns for proper environment configuration
  critical: Settings class with pydantic-settings, proper async patterns, dependency injection

- file: examples/cultural-validation/cultural-appropriateness-scorer.py
  why: Cultural validation integration patterns for Iraqi context
  critical: Iraqi dialect markers and professional terminology validation

- docfile: CLAUDE.md
  why: Privacy-first approach, session-only training, auto-expire data within 1 hour
  critical: Must maintain Iraqi cultural sensitivity and professional context accuracy
```

### Current Codebase Tree
```bash
/
├── apps/
│   ├── web/                    # Next.js 15+ web application
│   │   └── src/components/     # React components with RTL support
│   └── api/                    # Python FastAPI backend
│       ├── agents/             # PydanticAI agent modules
│       └── routes/             # FastAPI route handlers
├── packages/                   # Shared between web & mobile
│   ├── types/                  # TypeScript types
│   ├── features/              # Shared business logic
│   └── arabic-nlp/            # Arabic processing logic
├── examples/                   # Reference implementations
│   ├── arabic-tts/            # TTS optimization patterns ⭐ KEY REFERENCE
│   ├── voice-streaming/       # WebSocket streaming ⭐ KEY REFERENCE  
│   ├── main_agent_reference/  # PydanticAI patterns ⭐ KEY REFERENCE
│   └── cultural-validation/   # Iraqi validation ⭐ KEY REFERENCE
```

### Desired Codebase Tree with Files to be Added
```bash
/
├── apps/api/agents/tts_agent/     # NEW: PydanticAI TTS agent
│   ├── __init__.py
│   ├── agent.py                   # Main TTS agent with Iraqi intelligence
│   ├── tools.py                   # Multi-provider TTS tools
│   ├── models.py                  # Pydantic models for TTS operations
│   └── settings.py                # Environment configuration
├── apps/api/routes/tts.py         # NEW: TTS API endpoints
├── apps/web/src/components/tts/   # NEW: TTS UI components
│   ├── VoiceControls.tsx          # Voice selection and settings
│   ├── AudioPlayer.tsx            # RTL-aware audio playback
│   └── TTSProvider.tsx            # React context provider
├── packages/types/tts.ts          # NEW: Shared TTS TypeScript types
├── packages/features/tts/         # NEW: Shared TTS business logic
│   ├── providers.ts               # TTS provider abstraction
│   └── optimization.ts            # Text preprocessing for TTS
└── tests/tts/                     # NEW: Comprehensive TTS tests
    ├── test_tts_agent.py          # Agent functionality tests
    ├── test_cultural_validation.py# Iraqi context validation tests
    └── test_integration.py        # End-to-end integration tests
```

### Known Gotchas & Library Quirks
```python
# CRITICAL: OpenAI TTS-1-HD is already optimized for Iraqi dialect
# Pattern: Use existing IraqiTTSOptimizer.generate_optimized_speech()
# Voice recommendations: 'nova' for professional, 'alloy' for casual

# CRITICAL: Azure requires separate API configuration
# Pattern: Follow main_agent_reference/settings.py for multiple API keys
# Iraqi voices: Rana (ar-IQ-RanaNeural), Bassel (ar-IQ-BasselNeural)

# CRITICAL: Web Speech API voice loading is browser-dependent
# Chrome: Requires onvoiceschanged callback, voices load asynchronously  
# Safari: Downloadable voices may not appear, installing variants can break entire languages
# Firefox: Voices available immediately in sync

# CRITICAL: FFmpeg required for WebSocket audio conversion
# Pattern: Use existing audio_processor.convert_webm_to_wav() from voice-streaming
# Formats: WebM input → WAV output for better compatibility

# CRITICAL: Privacy compliance requires session-only caching
# Pattern: Use hashlib.md5 for cache keys, automatic cleanup after 1 hour
# NO persistent audio storage allowed per CLAUDE.md rules

# CRITICAL: PydanticAI requires proper async patterns
# Pattern: Always use load_dotenv() first, then Settings() class
# Environment: LLM_API_KEY, AZURE_SPEECH_KEY, AZURE_SPEECH_REGION required
```

## Implementation Blueprint

### Data Models and Structure
Create type-safe models for TTS operations ensuring consistency across providers.

```python
# Core Pydantic models for TTS operations
from pydantic import BaseModel, Field
from enum import Enum
from typing import Optional, List, Dict, Any

class IraqiDialect(Enum):
    BAGHDAD = "baghdad"
    BASRA = "basra" 
    MOSUL = "mosul"
    GENERAL = "general"

class ProfessionalContext(Enum):
    LEGAL = "legal"
    MEDICAL = "medical"
    EDUCATIONAL = "educational"
    BUSINESS = "business"
    CASUAL = "casual"

class TTSProvider(Enum):
    OPENAI = "openai"
    AZURE = "azure"
    WEB_SPEECH = "web_speech"

class TTSRequest(BaseModel):
    text: str = Field(..., description="Arabic text to convert to speech")
    language: str = Field(default="arabic", description="Language for TTS")
    dialect: IraqiDialect = Field(default=IraqiDialect.GENERAL)
    context: ProfessionalContext = Field(default=ProfessionalContext.CASUAL)
    voice_preference: Optional[str] = None
    speed: float = Field(default=0.9, ge=0.25, le=4.0)
    provider_preference: Optional[TTSProvider] = None

class TTSResponse(BaseModel):
    audio_data: str = Field(..., description="Base64 encoded audio")
    audio_format: str = Field(default="mp3")
    processing_time: float
    provider_used: TTSProvider
    optimizations_applied: List[str]
    cultural_validation_score: float
    cache_hit: bool = False
```

### List of Tasks to be Completed (In Order)

```yaml
Task 1 - Create PydanticAI TTS Agent Foundation:
  CREATE apps/api/agents/tts_agent/:
    - MIRROR pattern from: examples/main_agent_reference/
    - CREATE agent.py with Iraqi TTS intelligence
    - CREATE settings.py with multi-provider API keys
    - CREATE models.py with TTSRequest/TTSResponse classes
    - PRESERVE async patterns and dependency injection

Task 2 - Implement OpenAI TTS Tool (Primary Provider):
  MODIFY apps/api/agents/tts_agent/tools.py:
    - IMPORT existing IraqiTTSOptimizer from examples/arabic-tts/
    - CREATE @agent.tool for optimized OpenAI TTS generation
    - INTEGRATE dialect detection and text preprocessing
    - IMPLEMENT session-only caching with 1-hour expiry

Task 3 - Add Azure Cognitive Services Integration:
  EXTEND apps/api/agents/tts_agent/tools.py:
    - CREATE Azure Speech SDK integration for ar-IQ voices
    - IMPLEMENT provider selection logic based on context
    - ADD fallback mechanism when OpenAI unavailable
    - PRESERVE existing error handling patterns

Task 4 - Create Web Speech API Fallback:
  EXTEND apps/api/agents/tts_agent/tools.py:
    - CREATE browser-compatible Web Speech API tool
    - IMPLEMENT cross-browser voice loading (Chrome async, Firefox sync)
    - ADD graceful degradation for limited Arabic support
    - HANDLE voice availability detection

Task 5 - Integrate Cultural Validation:
  MODIFY apps/api/agents/tts_agent/agent.py:
    - IMPORT IraqiCulturalValidator from examples/cultural-validation/
    - CREATE cultural appropriateness scoring for TTS content
    - INTEGRATE professional context detection
    - IMPLEMENT content filtering for sensitive topics

Task 6 - Create FastAPI TTS Routes:
  CREATE apps/api/routes/tts.py:
    - MIRROR pattern from: examples/voice-streaming/websocket-voice-handler.py
    - CREATE REST endpoints for TTS generation
    - CREATE WebSocket endpoint for streaming TTS
    - IMPLEMENT proper error handling and validation

Task 7 - Build React TTS Components:
  CREATE apps/web/src/components/tts/:
    - CREATE VoiceControls.tsx with RTL support
    - CREATE AudioPlayer.tsx with Iraqi voice options
    - CREATE TTSProvider.tsx for React context management
    - INTEGRATE with existing chat components using patterns

Task 8 - Implement Shared TypeScript Types:
  CREATE packages/types/tts.ts:
    - MIRROR TTS models from Python Pydantic classes
    - CREATE provider configuration interfaces
    - ADD audio format and streaming types
    - ENSURE cross-platform compatibility for future mobile

Task 9 - Add WebSocket Streaming Integration:
  EXTEND examples/voice-streaming/websocket-voice-handler.py:
    - INTEGRATE TTS agent for real-time generation
    - ADD Arabic text preprocessing pipeline
    - IMPLEMENT intelligent provider switching
    - PRESERVE existing connection management patterns

Task 10 - Create Comprehensive Test Suite:
  CREATE tests/tts/:
    - CREATE test_tts_agent.py with Iraqi dialect validation
    - CREATE test_cultural_validation.py for appropriateness scoring
    - CREATE test_integration.py for end-to-end WebSocket testing
    - IMPLEMENT provider failover testing scenarios
```

### Per Task Pseudocode

```python
# Task 1 - PydanticAI TTS Agent Foundation
class TTSAgentDependencies:
    """Dependencies following main_agent_reference pattern"""
    openai_api_key: str
    azure_speech_key: Optional[str] = None
    azure_speech_region: Optional[str] = None
    cultural_validator: IraqiCulturalValidator
    cache_manager: TTSCacheManager

# PATTERN: Use pydantic-settings for environment configuration
class TTSSettings(BaseSettings):
    model_config = ConfigDict(env_file=".env", case_sensitive=False)
    
    openai_api_key: str = Field(..., description="OpenAI API key")
    azure_speech_key: Optional[str] = None
    azure_speech_region: Optional[str] = None
    tts_cache_ttl: int = Field(default=3600, description="Cache TTL in seconds")

# Task 2 - OpenAI TTS Tool Implementation  
@tts_agent.tool
async def generate_openai_tts(
    ctx: RunContext[TTSAgentDependencies], 
    request: TTSRequest
) -> TTSResponse:
    # PATTERN: Use existing IraqiTTSOptimizer
    optimizer = IraqiTTSOptimizer(ctx.deps.openai_api_key)
    
    # CRITICAL: Cultural validation before TTS generation
    validation_result = await ctx.deps.cultural_validator.validate_content(
        request.text, context=request.context
    )
    
    if validation_result.appropriateness_score < 0.8:
        raise ValidationError("Content not culturally appropriate for TTS")
    
    # GOTCHA: Check cache first for privacy-compliant session storage
    cache_key = generate_cache_key(request)
    cached_audio = await ctx.deps.cache_manager.get(cache_key)
    
    if cached_audio:
        return TTSResponse(
            audio_data=cached_audio,
            provider_used=TTSProvider.OPENAI,
            cache_hit=True,
            cultural_validation_score=validation_result.appropriateness_score
        )
    
    # PATTERN: Use optimized speech generation with Iraqi context
    audio_data, optimization = await optimizer.generate_optimized_speech(
        request.text,
        dialect=request.dialect,
        context=request.context,
        user_voice_preference=request.voice_preference
    )
    
    # CRITICAL: Session-only caching with 1-hour expiry
    await ctx.deps.cache_manager.set(
        cache_key, audio_data, ttl=3600
    )
    
    return TTSResponse(
        audio_data=base64.b64encode(audio_data).decode(),
        provider_used=TTSProvider.OPENAI,
        optimizations_applied=optimization.enhancements,
        cultural_validation_score=validation_result.appropriateness_score
    )

# Task 6 - FastAPI Routes Pattern
@router.post("/tts/generate")
async def generate_tts(request: TTSRequest) -> TTSResponse:
    # PATTERN: Use existing agent invocation patterns  
    try:
        response = await tts_agent.run(
            f"Generate TTS for: {request.text}",
            deps=TTSAgentDependencies(
                openai_api_key=settings.openai_api_key,
                cultural_validator=cultural_validator,
                cache_manager=cache_manager
            )
        )
        return response.data
    except Exception as e:
        # PATTERN: Standardized error responses
        raise HTTPException(
            status_code=500,
            detail=f"TTS generation failed: {str(e)}"
        )

# Task 7 - React Component Pattern
const VoiceControls: React.FC<VoiceControlsProps> = ({ 
    dialect, 
    onDialectChange,
    context,
    onContextChange 
}) => {
    // PATTERN: RTL support from existing components
    const direction = language === 'arabic' ? 'rtl' : 'ltr';
    
    return (
        <div dir={direction} className={`voice-controls ${direction}`}>
            <Select
                value={dialect}
                onChange={onDialectChange}
                className="font-arabic"
            >
                <Option value="baghdad">بغدادي</Option>
                <Option value="basra">بصراوي</Option>
                <Option value="mosul">موصلي</Option>
            </Select>
        </div>
    );
};
```

### Integration Points
```yaml
DATABASE:
  - migration: "ALTER TABLE user_sessions ADD COLUMN tts_preferences JSONB"
  - index: "CREATE INDEX idx_tts_cache ON tts_cache(session_id, created_at)"
  
CONFIG:
  - add to: apps/api/agents/tts_agent/settings.py
  - pattern: "AZURE_SPEECH_KEY = Field(default=None, description='Azure Speech API key')"
  
ROUTES:
  - add to: apps/api/main.py  
  - pattern: "app.include_router(tts_router, prefix='/api/tts', tags=['tts'])"

WEBSOCKET:
  - extend: examples/voice-streaming/websocket-voice-handler.py
  - pattern: "Add 'tts_generate' message type to existing WebSocket handler"

CULTURAL_VALIDATION:
  - integrate: examples/cultural-validation/cultural-appropriateness-scorer.py
  - pattern: "Use existing IraqiCulturalValidator.validate_content() method"
```

## Validation Loop

### Level 1: Syntax & Style
```bash
# Run these FIRST - fix any errors before proceeding
ruff check apps/api/agents/tts_agent/ --fix  # Auto-fix Python code
mypy apps/api/agents/tts_agent/             # Type checking
npm run typecheck                            # TypeScript validation
npm run lint                                 # Frontend linting

# Expected: No errors. If errors, READ the error and fix.
```

### Level 2: Unit Tests
```python
# CREATE tests/tts/test_tts_agent.py with these test cases:
def test_iraqi_dialect_detection():
    """Test Iraqi dialect detection accuracy"""
    baghdad_text = "شلونك؟ وين رحت اليوم؟"
    result = detect_dialect(baghdad_text)
    assert result == IraqiDialect.BAGHDAD

def test_cultural_validation_integration():
    """Test cultural appropriateness validation"""
    appropriate_text = "السلام عليكم، كيف حالكم؟"
    inappropriate_text = "[political sensitive content]"
    
    valid_result = validate_tts_content(appropriate_text)
    invalid_result = validate_tts_content(inappropriate_text)
    
    assert valid_result.appropriateness_score > 0.8
    assert invalid_result.appropriateness_score < 0.5

def test_multi_provider_fallback():
    """Test provider failover mechanism"""
    with mock.patch('openai.AsyncOpenAI') as mock_openai:
        mock_openai.side_effect = ConnectionError("OpenAI unavailable")
        
        # Should fallback to Azure
        result = await generate_tts_with_fallback("اهلا وسهلا")
        assert result.provider_used == TTSProvider.AZURE

def test_session_only_caching():
    """Test privacy-compliant caching"""
    cache_key = "test_session_123"
    audio_data = b"fake_audio_data"
    
    # Cache should work within session
    await cache_manager.set(cache_key, audio_data, ttl=3600)
    cached = await cache_manager.get(cache_key)
    assert cached == audio_data
    
    # Cache should expire after TTL
    with freeze_time("2025-01-01 12:00:00") as frozen_time:
        await cache_manager.set(cache_key, audio_data, ttl=3600)
        frozen_time.tick(3601)  # Advance time past TTL
        expired = await cache_manager.get(cache_key)
        assert expired is None
```

```bash
# Run and iterate until passing:
uv run pytest tests/tts/ -v
# If failing: Read error, understand root cause, fix code, re-run
```

### Level 3: Integration Test
```bash
# Start the TTS service
uv run python -m apps.api.main --dev

# Test TTS generation endpoint
curl -X POST http://localhost:8000/api/tts/generate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "مرحبا، كيف يمكنني مساعدتك اليوم؟",
    "dialect": "baghdad",
    "context": "casual",
    "speed": 0.9
  }'

# Expected: {"audio_data": "base64_encoded_mp3", "provider_used": "openai", ...}

# Test WebSocket streaming
wscat -c ws://localhost:8000/ws/voice/test_client
# Send: {"type": "tts_request", "text": "السلام عليكم", "dialect": "baghdad"}
# Expected: {"type": "tts_audio", "audio_data": "base64_audio", ...}

# If error: Check logs at logs/tts.log for detailed stack traces
```

### Level 4: Cultural Validation Test
```bash
# Test with Iraqi native speakers
python tests/tts/cultural_validation_test.py \
  --texts="نصوص تجريبية للتحقق من الملاءمة الثقافية" \
  --dialect=baghdad \
  --context=professional

# Expected: Cultural appropriateness scores > 0.95 for all test cases
# If low scores: Review text preprocessing and cultural validation rules
```

## Final Validation Checklist
- [ ] All tests pass: `uv run pytest tests/tts/ -v`
- [ ] No linting errors: `uv run ruff check apps/api/agents/tts_agent/`
- [ ] No type errors: `uv run mypy apps/api/agents/tts_agent/`
- [ ] Frontend builds: `npm run build` in apps/web/
- [ ] TTS generation < 3s: `curl` test with timing
- [ ] Cultural validation > 95%: Iraqi context scoring
- [ ] Audio quality > 4/5: Native speaker evaluation
- [ ] Privacy compliance: No persistent audio storage
- [ ] WebSocket streaming works: Real-time TTS generation
- [ ] Multi-provider fallback: Graceful degradation testing
- [ ] Cross-browser compatibility: Chrome, Firefox, Safari testing
- [ ] Integration with chat system: End-to-end user workflow

---

## Anti-Patterns to Avoid
- ❌ Don't create new TTS patterns when IraqiTTSOptimizer exists
- ❌ Don't skip cultural validation - Iraqi context is critical
- ❌ Don't persist audio data - privacy compliance required  
- ❌ Don't assume Web Speech API works consistently across browsers
- ❌ Don't hardcode voice selections - use context-based recommendations
- ❌ Don't ignore provider failures - implement comprehensive fallbacks
- ❌ Don't skip dialect detection - Iraqi users expect authentic pronunciation
- ❌ Don't bypass existing async patterns - use PydanticAI correctly