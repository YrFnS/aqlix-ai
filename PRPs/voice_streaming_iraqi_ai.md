---
name: "Real-time Voice Streaming for Iraqi AI Chat System"
description: |

## Purpose
Implement production-grade real-time bidirectional voice streaming with WebSocket infrastructure, Arabic speech processing, Iraqi dialect support, network optimization, and seamless chat interface integration for the Iraqi AI Chat System.

## Core Principles
1. **Context is King**: Build upon existing voice-streaming WebSocket patterns and Arabic processing infrastructure
2. **Validation Loops**: Provide executable tests for real-time streaming performance and Iraqi dialect accuracy  
3. **Information Dense**: Leverage 2025 streaming technologies including OpenAI Realtime API and modern WebSocket patterns
4. **Progressive Success**: Enhance existing examples with bidirectional streaming and network optimization
5. **Global rules**: Follow all rules in CLAUDE.md, especially Arabic RTL support and privacy compliance

---

## Goal
Create a comprehensive real-time voice streaming system that enables seamless bidirectional audio communication between Iraqi users and AI agents, with intelligent network adaptation, cultural context preservation, and production-ready performance optimization.

## Why
- **Natural Communication**: Enable fluid voice conversations matching Iraqi communication preferences over text-based interactions
- **Network Resilience**: Optimize for variable Middle Eastern internet infrastructure with adaptive quality management
- **Cultural Integration**: Preserve Iraqi dialect nuances and professional context during real-time streaming interactions
- **Accessibility**: Support users with varying technical skills and assistive technology needs through voice interaction
- **Mobile-First Experience**: Optimize for mobile devices as the primary access method for Iraqi users

## What
Real-time bidirectional voice streaming infrastructure that processes Arabic speech with Iraqi dialect recognition, delivers AI responses through text-to-speech synthesis, adapts to network conditions, and maintains cultural appropriateness throughout streaming sessions.

### Success Criteria
- [ ] Bidirectional voice streaming with <200ms latency for optimal conversation flow
- [ ] Iraqi dialect recognition accuracy >85% for Baghdad, Basra, and Mosul dialects
- [ ] Network adaptation maintains audio quality across varying Iraqi internet conditions
- [ ] Seamless integration with existing Arabic RTL chat interface and message history
- [ ] Cultural context preservation during streaming interruptions and reconnections
- [ ] Cross-browser compatibility with graceful fallbacks for unsupported browsers
- [ ] Privacy compliance with automatic audio data deletion within 1 hour
- [ ] Mobile-optimized streaming with efficient battery and data usage management

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window

# 2025 VOICE STREAMING TECHNOLOGY
- url: https://openai.com/index/introducing-the-realtime-api/
  why: OpenAI Realtime API for low-latency bidirectional voice communication (October 2024 release)
  critical: Supports real-time audio input/output, function calling, and interruption handling

- url: https://telnyx.com/resources/media-streaming-websocket
  why: Production WebSocket voice streaming architecture patterns for 2025
  critical: Forked audio streams, Voice Activity Detection, and network optimization strategies

- url: https://github.com/alesaccoia/VoiceStreamAI
  why: Near-realtime audio transcription with WebSocket and Whisper integration
  critical: Chunk-based processing, silence handling, and client configuration management

# ARABIC SPEECH PROCESSING RESEARCH  
- url: https://platform.openai.com/docs/guides/speech-to-text
  why: OpenAI Whisper API with Arabic language support and dialect context prompts
  critical: Requires Iraqi dialect-specific prompts for optimal recognition accuracy

- url: https://github.com/Huzaifa-X/Whisper_small_openai_finetuned_on_arabic_language
  why: Fine-tuned Arabic Whisper models with improved dialect recognition
  critical: Performance benchmarks and training patterns for Arabic speech processing

- url: https://huggingface.co/MohamedRashad/Arabic-Whisper-CodeSwitching-Edition
  why: Arabic-English code switching model for mixed language conversations
  critical: Handles Arabic with embedded English words common in Iraqi professional contexts

# NETWORK OPTIMIZATION AND LATENCY
- url: https://picovoice.ai/blog/streaming-text-to-speech-for-ai-agents/
  why: Low-latency streaming TTS optimization techniques for AI agents
  critical: Dual streaming, chunk-based processing, and network adaptation strategies

- url: https://developers.deepgram.com/docs/text-to-speech-latency
  why: TTS latency optimization and performance benchmarking methodologies
  critical: Target latency <200ms for natural conversation flow

- url: https://www.videosdk.live/developer-hub/websocket/websocket-streaming
  why: 2025 WebSocket streaming best practices with real-time data protocols
  critical: Scaling patterns, connection management, and performance optimization

# EXISTING CODEBASE PATTERNS
- file: examples/voice-streaming/websocket-voice-handler.py
  why: Complete WebSocket voice streaming implementation with OpenAI integration
  critical: ConnectionManager patterns, audio processing, and Iraqi dialect context handling

- file: examples/streaming/openai-streaming-patterns.md  
  why: Streaming response architecture with FastAPI and real-time communication
  critical: Server-Sent Events patterns and error handling for streaming applications

- file: examples/main_agent_reference/settings.py
  why: Environment configuration and API key management patterns for production
  critical: OpenAI API key handling, settings validation, and development workflow

- file: examples/arabic-tts/tts-optimization.py
  why: Arabic text-to-speech optimization with Iraqi dialect voice selection
  critical: Voice settings, speed optimization, and cultural context for speech synthesis

- file: PRPs/voice_recording_iraqi_ai.md
  why: Complementary voice recording infrastructure and privacy compliance patterns
  critical: MediaRecorder integration, audio format conversion, and automatic deletion

- file: PRPs/streaming-responses-iraqi-ai.md
  why: Arabic RTL streaming optimization and cultural context preservation
  critical: Text chunking strategies, connection resilience, and performance monitoring
```

### Current Codebase Structure (Relevant Sections)
```bash
aqlix-ai/
├── apps/
│   ├── web/src/                    # Next.js frontend (target for voice streaming UI)
│   │   ├── components/chat/        # Existing chat interface for integration
│   │   ├── hooks/                  # Custom hooks for state management
│   │   └── pages/api/              # Next.js API routes
│   └── api/src/                    # FastAPI backend (target for streaming endpoints)
│       ├── routes/                 # API route handlers
│       ├── services/               # Business logic services
│       └── agents/                 # PydanticAI agent modules
├── packages/
│   ├── types/                      # Shared TypeScript types
│   ├── features/                   # Shared business logic
│   └── ui/                         # Shared UI components  
├── examples/
│   ├── voice-streaming/            # WebSocket voice handler (FOUNDATION)
│   ├── voice-recording/            # MediaRecorder patterns (REFERENCE)
│   ├── streaming/                  # Streaming response patterns (REFERENCE)
│   ├── arabic-tts/                 # TTS optimization (REFERENCE)
│   └── main_agent_reference/       # Agent configuration patterns (REFERENCE)
└── PRPs/
    ├── voice_recording_iraqi_ai.md # Voice recording infrastructure (COMPLEMENTARY)
    └── streaming-responses-iraqi-ai.md # Text streaming patterns (REFERENCE)
```

### Desired Codebase Structure (Files to Add/Modify)
```bash
apps/
├── web/src/
│   ├── components/voice/
│   │   ├── VoiceStreamingChat.tsx           # Main bidirectional streaming component
│   │   ├── VoiceStreamingControls.tsx      # Stream controls with Arabic RTL
│   │   ├── AudioVisualizer.tsx             # Real-time audio level visualization
│   │   ├── NetworkQualityIndicator.tsx     # Connection quality display
│   │   └── StreamingTranscription.tsx      # Real-time transcription with RTL
│   ├── hooks/
│   │   ├── useVoiceStreaming.ts            # Bidirectional streaming state management
│   │   ├── useNetworkQuality.ts            # Network adaptation and quality monitoring
│   │   └── useAudioContext.ts              # Web Audio API management
│   └── utils/
│       ├── voice-stream-manager.ts         # WebSocket connection management
│       ├── audio-processor.ts              # Audio processing and format conversion
│       └── network-optimizer.ts            # Network quality adaptation logic
├── api/src/
│   ├── routes/voice/
│   │   ├── streaming.py                    # Enhanced WebSocket streaming endpoints
│   │   ├── realtime.py                     # OpenAI Realtime API integration
│   │   └── network_adaptation.py           # Network quality management
│   ├── services/
│   │   ├── voice_streaming_service.py      # Bidirectional streaming business logic
│   │   ├── network_optimizer.py            # Connection quality monitoring
│   │   ├── cultural_stream_validator.py    # Real-time cultural appropriateness
│   │   └── audio_buffer_manager.py         # Privacy-compliant buffer management
│   ├── agents/
│   │   └── streaming_voice_agent.py        # PydanticAI agent for voice conversations
│   └── middleware/
│       ├── stream_authentication.py        # WebSocket authentication
│       └── network_quality_monitor.py      # Connection quality middleware
packages/
├── types/src/
│   ├── voice-streaming.ts                  # Bidirectional streaming types
│   ├── network-quality.ts                  # Network adaptation types  
│   └── audio-processing.ts                 # Audio buffer and processing types
├── features/src/voice-streaming/
│   ├── index.ts                            # Shared streaming business logic
│   ├── network-adaptation.ts              # Quality management utilities
│   ├── iraqi-dialect-processing.ts        # Dialect context and processing
│   └── cultural-stream-validation.ts      # Real-time appropriateness checking
└── ui/src/voice-streaming/
    ├── StreamingButton.tsx                 # Reusable streaming toggle
    ├── QualityIndicator.tsx                # Network quality display
    └── StreamingStatus.tsx                 # Connection state indicator
```

### Known Gotchas & Library Quirks
```python
# CRITICAL: OpenAI Realtime API (2025) WebSocket requirements
# The Realtime API uses WebSocket protocol wss://api.openai.com/v1/realtime
# Requires specific event structure: {"type": "session.update", "session": {...}}
# Must handle audio in base64 PCM16 format at 24kHz sample rate
# Function calling and interruption handling require specific event patterns

# CRITICAL: WebSocket bidirectional streaming complexity
# Unlike examples/voice-streaming/websocket-voice-handler.py (one-way processing)
# Bidirectional requires simultaneous audio input AND output streams
# Must handle WebSocket message collision and priority management
# Requires separate audio contexts for recording and playback

# CRITICAL: Arabic speech processing in real-time context
# Iraqi dialect context prompts MUST be applied during streaming:
# Baghdad: "شلونك (shlonak), وين (wayn), شگد (shgad), أكو (aku)"
# Basra: "ها چي (ha chi), وين راح (wayn rah), شسوي (shesawi)"
# Mosul: "كيفك (kifak), وين (wayn), شون (shon), أكو (aku)"
# Real-time processing requires streaming-friendly dialect detection

# CRITICAL: Network optimization for Middle Eastern conditions
# Research shows Iraqi internet infrastructure has variable latency (100-800ms)
# Must implement adaptive bitrate streaming based on connection quality
# Requires WebSocket ping/pong heartbeat monitoring for connection health
# Network drops are frequent - implement exponential backoff reconnection

# CRITICAL: Privacy compliance for real-time streaming
# Audio buffers must be encrypted in memory and cleared after processing
# Maximum 1-hour retention applies to streaming session metadata
# Real-time transcription must be processed without persistent storage
# Requires audit logging for compliance without storing audio content

# CRITICAL: Web Audio API browser compatibility and performance
# Chrome/Firefox: Full WebRTC and AudioContext support
# Safari: Requires user gesture for AudioContext, limited WebRTC features
# Mobile Safari: Additional restrictions on audio autoplay and background processing
# Must implement fallback strategies for limited browser capabilities

# CRITICAL: Cultural context preservation during streaming
# Iraqi professional contexts require maintained terminology during interruptions
# Legal terms: "قانون عراقي (qanun iraqi), محكمة (mahkama), دعوى (da'wa)"
# Medical terms: "طبيب (tabeeb), مستشفى (mustashfa), علاج (eilaj)"
# Educational terms: "أستاذ (ustaz), جامعة (jami'a), طالب (talib)"
# Context must survive network disconnection and reconnection cycles
```

## Implementation Blueprint

### Data Models and Structure
```typescript
// packages/types/src/voice-streaming.ts - Core streaming types
interface VoiceStreamingState {
  connectionStatus: 'connecting' | 'connected' | 'streaming' | 'paused' | 'disconnected';
  audioInputActive: boolean;
  audioOutputActive: boolean;
  currentTranscription: string;
  networkQuality: 'excellent' | 'good' | 'fair' | 'poor';
  culturalContext: IraqiProfessionalContext;
  dialectPreference: 'auto' | 'baghdad' | 'basra' | 'mosul';
  latencyMs: number;
  error?: StreamingError;
}

interface StreamingAudioChunk {
  type: 'input' | 'output';
  audioData: string; // Base64 PCM16
  timestamp: number;
  sampleRate: number;
  channels: number;
  dialect?: string;
  culturalFlags?: string[];
}

interface NetworkQualityMetrics {
  latency: number;
  bandwidth: number;
  packetLoss: number;
  jitter: number;
  adaptedQuality: 'high' | 'medium' | 'low';
  recommendation: string;
}

// Python Pydantic models for backend streaming
from pydantic import BaseModel, Field
from typing import Optional, Literal
from enum import Enum

class StreamingEventType(str, Enum):
    SESSION_START = "session.start"
    AUDIO_INPUT = "audio.input" 
    AUDIO_OUTPUT = "audio.output"
    TRANSCRIPTION = "transcription"
    CULTURAL_VALIDATION = "cultural.validation"
    NETWORK_ADAPTATION = "network.adaptation"
    SESSION_END = "session.end"

class VoiceStreamingEvent(BaseModel):
    type: StreamingEventType
    session_id: str
    timestamp: float
    audio_data: Optional[str] = None  # Base64 encoded
    transcription: Optional[str] = None
    dialect: str = "auto"
    cultural_context: Optional[dict] = None
    network_metrics: Optional[dict] = None
    user_id: str
```

### Task List (Implementation Order)

```yaml
Task 1: Enhanced WebSocket Infrastructure
MODIFY apps/api/src/routes/voice/streaming.py:
  - EXTEND existing ConnectionManager from examples/voice-streaming/websocket-voice-handler.py
  - ADD bidirectional stream management with separate input/output channels
  - IMPLEMENT network quality monitoring with ping/pong heartbeat
  - PRESERVE existing audio processing patterns while adding real-time capabilities
  - ADD connection resilience with exponential backoff reconnection

CREATE apps/api/src/services/voice_streaming_service.py:
  - IMPLEMENT bidirectional audio stream coordination
  - ADD network quality adaptation logic based on real-time metrics
  - INTEGRATE OpenAI Realtime API alongside existing Whisper patterns
  - IMPLEMENT cultural context preservation across streaming sessions
  - ADD privacy-compliant buffer management with automatic cleanup

Task 2: OpenAI Realtime API Integration
CREATE apps/api/src/routes/voice/realtime.py:
  - IMPLEMENT OpenAI Realtime API WebSocket client integration
  - ADD session management with proper authentication and error handling
  - IMPLEMENT audio format conversion (WebM/WAV to PCM16 24kHz)
  - ADD Iraqi dialect context injection for real-time processing
  - INTEGRATE with existing cultural validation patterns

CREATE apps/api/src/agents/streaming_voice_agent.py:
  - ADAPT existing PydanticAI agent patterns for real-time voice interaction
  - ADD streaming conversation state management with context preservation
  - IMPLEMENT Iraqi professional domain integration (legal, medical, educational)
  - ADD cultural appropriateness validation during streaming responses
  - INTEGRATE with existing Arabic text processing and RTL rendering

Task 3: Network Optimization and Quality Management
CREATE apps/api/src/services/network_optimizer.py:
  - IMPLEMENT real-time network quality monitoring and metrics collection
  - ADD adaptive streaming quality based on connection characteristics
  - IMPLEMENT bandwidth optimization for variable Middle Eastern internet
  - ADD connection health scoring and recommendation engine
  - INTEGRATE with WebSocket connection management for quality adaptation

CREATE apps/api/src/middleware/network_quality_monitor.py:
  - ADD WebSocket middleware for continuous connection quality monitoring
  - IMPLEMENT latency measurement and jitter detection
  - ADD packet loss estimation and bandwidth tracking
  - IMPLEMENT quality-based streaming parameter adjustment
  - ADD logging and analytics for network performance optimization

Task 4: Frontend Bidirectional Streaming Components  
CREATE apps/web/src/components/voice/VoiceStreamingChat.tsx:
  - ADAPT existing chat interface patterns for real-time voice streaming
  - ADD bidirectional audio stream management with WebSocket integration
  - IMPLEMENT Arabic RTL transcription display with real-time updates
  - ADD cultural context preservation during streaming interruptions
  - INTEGRATE with existing chat message history and state management

CREATE apps/web/src/hooks/useVoiceStreaming.ts:
  - IMPLEMENT bidirectional WebSocket connection management
  - ADD audio context management for simultaneous record/playback
  - IMPLEMENT network quality monitoring and adaptive streaming
  - ADD automatic reconnection with session state recovery
  - INTEGRATE with existing Arabic language processing hooks

Task 5: Audio Processing and Format Management
CREATE apps/web/src/utils/audio-processor.ts:
  - IMPLEMENT Web Audio API integration for real-time audio processing
  - ADD audio format conversion for OpenAI Realtime API compatibility
  - IMPLEMENT Voice Activity Detection (VAD) for efficient streaming
  - ADD audio compression and quality optimization for mobile networks
  - INTEGRATE with existing MediaRecorder patterns from voice recording PRP

CREATE packages/features/src/voice-streaming/iraqi-dialect-processing.ts:
  - IMPLEMENT real-time Iraqi dialect detection and context injection
  - ADD streaming-friendly dialect classification and processing
  - IMPLEMENT cultural context preservation during audio stream processing
  - ADD professional domain terminology validation for real-time streams
  - INTEGRATE with existing Arabic text processing and cultural validation

Task 6: Network Quality UI and User Experience
CREATE apps/web/src/components/voice/NetworkQualityIndicator.tsx:
  - IMPLEMENT real-time network quality visualization
  - ADD adaptive streaming quality feedback to users
  - IMPLEMENT Arabic RTL layout for quality indicators and messages
  - ADD connection state management with visual feedback
  - INTEGRATE with existing Arabic UI components and styling patterns

CREATE apps/web/src/hooks/useNetworkQuality.ts:
  - IMPLEMENT real-time network quality monitoring from client side
  - ADD connection health scoring and quality recommendations
  - IMPLEMENT adaptive streaming parameter adjustment based on quality
  - ADD automatic fallback to voice recording mode when streaming fails
  - INTEGRATE with existing error handling and user notification patterns

Task 7: Cultural Context and Privacy Compliance
CREATE apps/api/src/services/cultural_stream_validator.py:
  - IMPLEMENT real-time cultural appropriateness validation during streaming
  - ADD Iraqi professional context preservation across stream interruptions
  - IMPLEMENT sectarian and political sensitivity filtering for audio content
  - ADD cultural context recovery after network disconnections
  - INTEGRATE with existing IraqiBusinessEtiquetteManager patterns

CREATE apps/api/src/services/audio_buffer_manager.py:
  - IMPLEMENT privacy-compliant real-time audio buffer management
  - ADD encrypted in-memory audio processing with automatic cleanup
  - IMPLEMENT 1-hour maximum retention policy for streaming session metadata
  - ADD audit logging for compliance without storing sensitive audio data
  - INTEGRATE with existing privacy compliance and file security patterns

Task 8: Performance Optimization and Testing Infrastructure  
CREATE tests/voice_streaming/
  - ADD comprehensive test suite for bidirectional streaming functionality
  - IMPLEMENT network condition simulation for Iraqi internet characteristics
  - ADD Arabic dialect recognition accuracy testing with Iraqi sample phrases
  - IMPLEMENT latency and performance benchmarking for streaming quality
  - ADD cross-browser compatibility testing for voice streaming features

CREATE apps/api/src/monitoring/streaming_metrics.py:
  - IMPLEMENT real-time streaming performance monitoring and alerting
  - ADD network quality analytics and optimization recommendations
  - IMPLEMENT Iraqi dialect recognition accuracy tracking and reporting
  - ADD cultural appropriateness compliance monitoring for streaming content
  - INTEGRATE with existing monitoring infrastructure and alerting systems
```

### Integration Points
```yaml
CHAT_INTERFACE:
  - integration: "Seamlessly integrate voice streaming with existing chat message flow"
  - pattern: "Extend MessageInput component with voice streaming toggle and controls"
  - styling: "Maintain Arabic RTL layout and cultural design consistency"
  - state: "Integrate streaming transcription with chat conversation history"

WEBSOCKET_INFRASTRUCTURE:
  - integration: "Enhance existing WebSocket infrastructure for bidirectional streaming"
  - pattern: "Build upon ConnectionManager from voice-streaming example"
  - authentication: "Integrate with existing JWT session management and user authentication"
  - scaling: "Support multiple concurrent streaming sessions with proper resource management"

ARABIC_PROCESSING:
  - integration: "Connect real-time transcription with existing Arabic text processing pipeline"
  - pattern: "Use existing cultural validation and Iraqi dialect recognition services"
  - output: "Format streaming transcription for Arabic RTL display with proper font handling"
  - context: "Preserve Iraqi professional domain context during streaming interruptions"

PRIVACY_COMPLIANCE:
  - integration: "Extend existing privacy compliance infrastructure for real-time streaming"
  - pattern: "Use automatic deletion patterns with enhanced security for audio streams"
  - compliance: "Follow existing GDPR and Iraqi data protection compliance frameworks"
  - audit: "Integrate with existing audit logging without storing sensitive audio content"

NETWORK_OPTIMIZATION:
  - integration: "Add network quality monitoring to existing performance tracking"
  - pattern: "Implement adaptive streaming using existing error handling and retry patterns"
  - fallback: "Integrate with voice recording mode as fallback for poor connections"
  - mobile: "Optimize for existing mobile-first design and Iraqi user access patterns"
```

## Validation Loop

### Level 1: Infrastructure and Connection Validation
```bash
# Verify WebSocket infrastructure setup
python -c "
import asyncio
import websockets
from apps.api.src.routes.voice.streaming import ConnectionManager

async def test_connection():
    manager = ConnectionManager()
    print('Connection manager initialized successfully')
    # Test bidirectional stream capability
    test_session = {'input_stream': None, 'output_stream': None}
    assert manager.active_connections == {}, 'Clean initial state'
    print('WebSocket infrastructure validation passed')

asyncio.run(test_connection())
"

# Test OpenAI Realtime API integration
python -c "
import os
from apps.api.src.routes.voice.realtime import RealtimeAPIClient

def test_realtime_api():
    if not os.getenv('OPENAI_API_KEY'):
        print('WARNING: OPENAI_API_KEY not set, skipping Realtime API test')
        return
    
    client = RealtimeAPIClient()
    session_config = client.create_session_config('arabic', 'iraqi')
    assert 'instructions' in session_config, 'Session config missing instructions'
    assert 'voice' in session_config, 'Session config missing voice settings'
    print('OpenAI Realtime API integration validation passed')

test_realtime_api()
"

# Expected: WebSocket infrastructure initializes, Realtime API client configures properly
# If failing: Check environment variables and API key configuration
```

### Level 2: Arabic Speech Processing and Network Optimization
```bash
# Test Iraqi dialect processing in streaming context
python -c "
from packages.features.src.voice_streaming.iraqi_dialect_processing import IraqiStreamingProcessor

processor = IraqiStreamingProcessor()
test_phrases = [
    'شلونك اليوم؟',  # Baghdad dialect
    'ها چي اخبارك؟',  # Basra dialect  
    'كيفك شون حالك؟'   # Mosul dialect
]

for phrase in test_phrases:
    context = processor.generate_dialect_context(phrase)
    assert context['dialect'] in ['baghdad', 'basra', 'mosul'], f'Invalid dialect for: {phrase}'
    assert len(context['context_prompt']) > 0, f'Empty context for: {phrase}'
    print(f'Dialect processing passed for: {phrase}')

print('Iraqi dialect processing validation passed')
"

# Test network quality monitoring and adaptation
python -c "
from apps.api.src.services.network_optimizer import NetworkQualityMonitor
import asyncio

async def test_network_monitoring():
    monitor = NetworkQualityMonitor()
    
    # Simulate various network conditions
    test_conditions = [
        {'latency': 50, 'bandwidth': 1000, 'packet_loss': 0.1},   # Excellent
        {'latency': 200, 'bandwidth': 500, 'packet_loss': 1.0},   # Good
        {'latency': 500, 'bandwidth': 100, 'packet_loss': 5.0},   # Poor
    ]
    
    for condition in test_conditions:
        quality = monitor.assess_quality(condition)
        recommendation = monitor.get_streaming_recommendation(quality)
        assert quality['level'] in ['excellent', 'good', 'fair', 'poor'], 'Invalid quality level'
        assert 'bitrate' in recommendation, 'Missing bitrate recommendation'
        print(f'Network assessment passed for: {condition}')
    
    print('Network optimization validation passed')

asyncio.run(test_network_monitoring())
"

# Expected: Dialect processing correctly identifies Iraqi variants, network monitoring provides quality recommendations
# If failing: Debug dialect context generation and network quality assessment logic
```

### Level 3: Bidirectional Streaming and Cultural Validation
```bash
# Test bidirectional streaming functionality
npm run test:streaming -- --testPathPattern=voice-streaming

# Test cultural context preservation during streaming
python -m pytest tests/voice_streaming/test_cultural_streaming.py -v

# Test cases should include:
# - Cultural context preservation during network interruptions
# - Iraqi professional terminology accuracy in real-time streams
# - Sectarian and political sensitivity filtering during streaming
# - Arabic RTL rendering performance during real-time transcription updates

# Test real-time performance benchmarks
python -c "
import asyncio
import time
from apps.api.src.services.voice_streaming_service import VoiceStreamingService

async def test_streaming_performance():
    service = VoiceStreamingService()
    
    # Simulate real-time audio chunks
    test_chunks = [b'audio_data'] * 50  # 50 chunks for performance test
    start_time = time.time()
    
    processed_chunks = []
    for chunk in test_chunks:
        processed = await service.process_audio_chunk(chunk, 'arabic', 'iraqi')
        processed_chunks.append(processed)
        
    total_time = (time.time() - start_time) * 1000  # Convert to milliseconds
    avg_latency = total_time / len(test_chunks)
    
    assert avg_latency < 200, f'Average latency {avg_latency}ms exceeds 200ms target'
    assert len(processed_chunks) == len(test_chunks), 'Audio chunk processing incomplete'
    print(f'Streaming performance: {avg_latency:.2f}ms average latency')
    print('Real-time performance validation passed')

asyncio.run(test_streaming_performance())
"

# Expected: All cultural validation tests pass, streaming latency <200ms
# If failing: Optimize audio processing pipeline and cultural validation performance
```

### Level 4: Cross-Browser and Mobile Integration Testing
```bash
# Cross-browser voice streaming compatibility test  
npm run test:e2e -- --spec=voice-streaming-browsers.cy.ts

# Mobile device streaming optimization test
npm run test:mobile -- --focus=voice-streaming-performance

# Integration test with existing chat interface
python -c "
from apps.web.src.components.voice.VoiceStreamingChat import VoiceStreamingChat
from apps.web.src.components.chat.MessageInput import MessageInput

# Test integration points
def test_chat_integration():
    # Verify voice streaming integrates with existing chat state
    chat_props = {
        'messages': [],
        'language': 'arabic',
        'rtl_layout': True,
        'cultural_context': 'iraqi_professional'
    }
    
    # Test streaming component integration
    streaming_props = {
        'chat_state': chat_props,
        'network_quality': 'good',
        'dialect_preference': 'baghdad'
    }
    
    # Verify props compatibility
    required_props = ['chat_state', 'network_quality', 'dialect_preference']
    for prop in required_props:
        assert prop in streaming_props, f'Missing required prop: {prop}'
    
    print('Chat interface integration validation passed')

test_chat_integration()
"

# Privacy compliance test for streaming data
python -m pytest tests/voice_streaming/test_privacy_compliance.py -v

# Expected results:
# - Voice streaming works across Chrome, Firefox, Safari, Edge with appropriate fallbacks
# - Mobile streaming optimized for Iraqi network conditions and battery usage
# - Chat interface integration maintains existing functionality and Arabic RTL layout
# - Privacy compliance ensures automatic deletion and secure audio buffer management
# If failing: Fix browser compatibility issues and optimize mobile performance
```

## Final Validation Checklist
- [ ] All tests pass: `npm run test && cd apps/api && python -m pytest`
- [ ] No linting errors: `npm run lint && cd apps/api && ruff check src/`
- [ ] No type errors: `npm run typecheck && cd apps/api && mypy src/`
- [ ] Bidirectional streaming achieves <200ms latency for natural conversation flow
- [ ] Iraqi dialect recognition accuracy >85% tested with Baghdad, Basra, Mosul samples
- [ ] Network optimization adapts streaming quality based on connection characteristics
- [ ] Cultural context preserved during streaming interruptions and reconnections
- [ ] Arabic RTL interface renders properly during real-time transcription updates
- [ ] Cross-browser compatibility with graceful fallbacks for limited capabilities
- [ ] Mobile optimization provides efficient battery and data usage management
- [ ] Privacy compliance ensures automatic audio deletion within 1-hour retention policy
- [ ] Integration with existing chat interface maintains all Arabic and cultural functionality
- [ ] Error handling provides helpful messages in Arabic and English with cultural context

---

## Anti-Patterns to Avoid
- ❌ Don't reinvent existing WebSocket infrastructure - build upon examples/voice-streaming patterns
- ❌ Don't ignore network quality optimization - Iraqi internet conditions require adaptive streaming
- ❌ Don't skip Iraqi dialect specifics - context prompts are critical for streaming accuracy
- ❌ Don't store audio data beyond compliance limits - implement automatic deletion for streaming buffers
- ❌ Don't assume stable WebSocket connections - implement comprehensive reconnection and recovery
- ❌ Don't break existing Arabic RTL functionality - maintain cultural design consistency
- ❌ Don't hardcode streaming parameters - implement adaptive quality based on network conditions
- ❌ Don't ignore mobile optimization - Iraqi users primarily access via mobile devices
- ❌ Don't skip cultural context preservation - professional contexts must survive interruptions
- ❌ Don't implement character-by-character streaming - use semantic chunking for Arabic text processing

---

**Confidence Level: 8/10** - High confidence for one-pass implementation success due to strong existing WebSocket infrastructure foundation, comprehensive 2025 technology research including OpenAI Realtime API, detailed understanding of Iraqi dialect requirements, clear integration patterns with existing Arabic processing, and executable validation gates aligned with project standards for streaming performance and cultural appropriateness.