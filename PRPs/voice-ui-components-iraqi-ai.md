name: "Voice User Interface Components for Iraqi AI Chat System"
description: |

## Purpose
Build comprehensive voice user interface components with Arabic RTL support, real-time audio processing, Iraqi dialect recognition, and cultural appropriateness validation that integrate seamlessly with the existing Iraqi AI Chat System while maintaining strict privacy compliance and accessibility standards.

## Core Principles
1. **Context is King**: Leverage extensive existing examples and proven patterns from the codebase
2. **Validation Loops**: Provide executable tests for cross-browser compatibility and cultural validation
3. **Information Dense**: Use proven MediaRecorder, VAD, and OpenAI Whisper technologies
4. **Progressive Success**: Adapt existing components to production integration
5. **Global rules**: Follow all rules in CLAUDE.md, especially Arabic RTL and privacy compliance

---

## Goal
Implement production-ready voice UI components that provide intuitive voice recording controls, real-time audio feedback, Arabic text-to-speech integration, and culturally appropriate voice interaction patterns optimized for Iraqi users with seamless chat interface integration.

## Why
- **Natural Interaction**: Enable voice-first interaction for Iraqi users who prefer speaking over typing in professional contexts
- **Cultural Authenticity**: Provide Iraqi dialect recognition (Baghdad, Basra, Mosul) with appropriate vocabulary and context
- **Accessibility Excellence**: Support screen readers, keyboard navigation, and assistive technology with WCAG 2.2 compliance
- **Mobile Optimization**: Deliver touch-friendly voice controls for primary mobile user base in Iraq
- **Privacy Compliance**: Meet Iraqi data protection requirements with 1-hour auto-deletion and secure processing
- **Professional Integration**: Support voice interfaces for legal, medical, educational, and engineering professionals

## What
Comprehensive voice UI component system that includes voice recording controls, real-time waveform visualization, TTS playback controls, Iraqi dialect recognition, Arabic RTL layout support, and seamless integration with the existing chat interface.

### Success Criteria
- [ ] Voice recording controls with visual feedback and Iraqi dialect support
- [ ] Real-time audio waveform visualization during recording and playback
- [ ] Arabic text-to-speech controls with voice selection and cultural appropriateness
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari, Edge) with graceful fallbacks
- [ ] Screen reader compatibility and keyboard navigation for accessibility
- [ ] Mobile-responsive touch controls optimized for Iraqi network conditions
- [ ] Seamless integration with existing Arabic RTL chat interface
- [ ] Privacy-compliant audio processing with 1-hour auto-deletion
- [ ] Cultural validation pipeline for Islamic value compliance

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- url: https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder
  why: MediaRecorder API reference for browser audio capture with 2025 compatibility matrix
  critical: Safari requires MP4 format, WebM/Opus preferred for Chrome/Firefox, Edge needs MIME detection
  
- url: https://www.vad.ricky0123.com/
  why: Voice Activity Detection using Silero VAD model with WebAssembly integration
  critical: Requires ONNX Runtime Web, 1.8MB model size, <1ms processing per 30ms chunk
  
- url: https://platform.openai.com/docs/guides/speech-to-text
  why: OpenAI Whisper API for Arabic speech recognition with dialect context prompts
  critical: Prefers WAV format at 16kHz, supports dialect context for Iraqi Arabic recognition
  
- url: https://www.w3.org/WAI/WCAG22/quickref/
  why: WCAG 2.2 accessibility guidelines for voice interfaces and screen reader compatibility
  critical: Concurrent Input Mechanisms (2.5.6 AAA) requires voice + keyboard + touch support
  
- url: https://www.w3.org/WAI/perspective-videos/speech/
  why: Text-to-speech accessibility requirements and screen reader integration patterns
  critical: Language tags required for proper Arabic TTS, natural intonation for cultural appropriateness

- file: examples/voice-recording/real-time-recorder.tsx
  why: Complete voice recording component with MediaRecorder, VAD, Iraqi dialect support
  critical: Follow MediaRecorder patterns, error handling, Arabic RTL layout, cultural text handling
  
- file: examples/voice-streaming/websocket-voice-handler.py  
  why: FastAPI WebSocket implementation with OpenAI Whisper and audio format conversion
  critical: Connection management patterns, audio processing pipeline, privacy-compliant cleanup
  
- file: examples/rtl-support/arabic-components.tsx
  why: Arabic RTL layout patterns and font handling for consistent cultural interface design
  critical: Font selection (Noto Sans Arabic, Amiri, Cairo), text direction, cultural color schemes
  
- file: examples/main_agent_reference/settings.py
  why: Environment configuration patterns for API keys and service integration
  critical: Follow python-dotenv patterns, secure API key management, pydantic-settings usage
```

### Current Codebase Structure
```bash
aqlix-ai/
├── apps/
│   ├── web/src/           # Next.js frontend (target for voice components)
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   └── pages/api/     # Next.js API routes
│   └── api/src/          # FastAPI backend (target for voice endpoints)  
│       ├── routes/        # API route handlers
│       ├── services/      # Business logic services
│       └── middleware/    # Request processing middleware
├── packages/
│   ├── types/            # Shared TypeScript types
│   ├── features/         # Shared business logic
│   └── ui/              # Shared UI components  
├── examples/
│   ├── voice-recording/  # PROVEN: Real-time recorder with Iraqi dialect support
│   ├── voice-streaming/  # PROVEN: WebSocket voice handler with OpenAI integration
│   ├── rtl-support/     # PROVEN: Arabic RTL component patterns
│   └── main_agent_reference/ # PROVEN: Environment configuration patterns
└── PRPs/                # Product requirement prompts
```

### Desired Codebase Structure (Files to Add)
```bash
apps/
├── web/src/
│   ├── components/voice/
│   │   ├── VoiceRecorder.tsx          # Main recording component (adapted from example)
│   │   ├── VoiceControls.tsx          # Recording controls with Arabic RTL
│   │   ├── VoiceVisualizer.tsx        # Real-time waveform display
│   │   ├── VoiceTranscription.tsx     # Transcription display with Iraqi dialect
│   │   ├── TTSControls.tsx            # Text-to-speech playback controls
│   │   └── VoiceMessage.tsx           # Voice message display for chat history
│   ├── hooks/
│   │   ├── useVoiceRecording.ts       # Voice recording state management
│   │   ├── useVoicePlayback.ts        # TTS playback control
│   │   └── useWebSocketVoice.ts       # Real-time voice communication
│   └── utils/
│       └── browser-compatibility.ts   # MediaRecorder fallbacks and detection
├── api/src/
│   ├── routes/voice/
│   │   ├── __init__.py
│   │   ├── recording.py               # WebSocket + REST endpoints (adapted from example)
│   │   ├── synthesis.py               # Text-to-speech endpoints
│   │   └── models.py                  # Pydantic models for voice data
│   ├── services/
│   │   ├── voice_service.py           # Business logic for voice processing
│   │   ├── audio_processor.py         # Audio format conversion and Whisper integration
│   │   ├── tts_service.py             # Text-to-speech with cultural appropriateness
│   │   └── privacy_service.py         # Auto-deletion and compliance logging
│   └── middleware/
│       ├── audio_validation.py        # Audio content validation and security
│       └── cultural_filter.py         # Iraqi cultural appropriateness validation
packages/
├── types/src/
│   ├── voice.ts                       # Shared voice recording and TTS types
│   └── cultural.ts                    # Cultural validation types
├── features/src/voice/
│   ├── index.ts                       # Shared voice business logic
│   ├── audio-utils.ts                 # Audio format conversion utilities
│   ├── dialect-context.ts             # Iraqi dialect context prompts
│   └── cultural-validation.ts         # Cultural appropriateness validation
└── ui/src/voice/
    ├── VoiceButton.tsx               # Reusable voice input button
    ├── VoiceStatus.tsx               # Voice recording status indicator
    ├── WaveformVisualizer.tsx        # Audio waveform visualization component  
    └── VoicePermissions.tsx          # Microphone permission management UI
```

### Known Gotchas & Library Quirks
```typescript
// CRITICAL: MediaRecorder API browser compatibility (2025 research findings)
// Chrome/Firefox: WebM with Opus codec optimal for Whisper API
// Safari: Requires MP4 format, WebM fails with NotSupportedError
// Edge: Full support but requires explicit MIME type detection
// iOS Safari: Autoplay restrictions require user interaction for recording start

// CRITICAL: @ricky0123/vad-web Silero VAD integration requirements
// Must load ONNX Runtime Web before VAD initialization
// MicVAD.new() is async and requires WebAssembly module loading
// Arabic speech requires higher positiveSpeechThreshold (0.8 vs default 0.6)
// Model supports 6000+ languages including Arabic with cultural context

// CRITICAL: OpenAI Whisper API optimization for Iraqi Arabic
// WAV format at 16kHz sample rate provides best transcription accuracy
// Dialect context prompts significantly improve Iraqi Arabic recognition:
// Baghdad: "شلونك (how are you), وين (where), شگد (how much), أكو (there is)"
// Basra: "Southern Iraqi dialect with distinctive pronunciation patterns"  
// Mosul: "Northern Iraqi dialect with unique vocabulary and intonation"

// CRITICAL: Arabic RTL layout requirements (research-backed patterns)
// dir="rtl" required on all text containers with Arabic content
// text-align: right for Arabic text, left for English in mixed content
// Font stack: 'Noto Sans Arabic', 'Amiri', 'Cairo', sans-serif
// Line-height: 1.8 for proper Arabic text spacing and readability

// CRITICAL: Privacy compliance implementation (GDPR Article 5)
// 1-hour maximum retention with automated deletion scheduling
// Audit logging without storing sensitive audio content
// Secure WebSocket transmission with proper encryption in transit
// User consent management with clear Arabic/English privacy disclosures

// CRITICAL: Cultural appropriateness validation (Islamic design principles)  
// Content filtering for political/sectarian sensitivity  
// Professional context validation for legal, medical, educational domains
// Islamic value respect in all processed voice content
// Privacy and humility principles in interface design patterns
```

## Implementation Blueprint

### Data Models and Structure
```typescript
// packages/types/src/voice.ts - Comprehensive type definitions
interface VoiceRecordingState {
  // Recording State
  isRecording: boolean;
  isPaused: boolean;
  isProcessing: boolean;
  duration: number;
  audioBlob: Blob | null;
  
  // Transcription State  
  transcription: string;
  confidence: number | null;
  language: 'arabic' | 'english';
  dialect: 'auto' | 'baghdad' | 'basra' | 'mosul';
  
  // UI State
  visualizationData: Float32Array | null;
  permissionStatus: 'granted' | 'denied' | 'prompt' | 'unknown';
  error: VoiceError | null;
}

interface TTSPlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  currentTime: number;
  duration: number;
  voice: string;
  speed: number;
  volume: number;
  audioUrl: string | null;
}

interface VoiceMessage {
  type: 'start_recording' | 'audio_chunk' | 'stop_recording' | 'tts_request' | 'transcription';
  clientId: string;
  audioData?: string; // Base64 encoded
  text?: string;
  language: 'arabic' | 'english';  
  dialect: string;
  timestamp: number;
  culturalContext?: CulturalContext;
}

interface CulturalContext {
  professionalDomain?: 'legal' | 'medical' | 'educational' | 'engineering' | 'general';
  formalityLevel: 'formal' | 'casual';
  culturalSensitivity: 'high' | 'medium' | 'low';
  islamicCompliance: boolean;
}

// Python Pydantic models for backend integration
from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime

class VoiceRecordingRequest(BaseModel):
    audio_data: str = Field(..., description="Base64 encoded audio data")
    language: Literal['arabic', 'english'] = 'arabic'
    dialect: Literal['auto', 'baghdad', 'basra', 'mosul'] = 'auto'
    client_id: str = Field(..., description="Unique client identifier")
    cultural_context: Optional[dict] = None
    
class VoiceTranscriptionResponse(BaseModel):
    text: str = Field(..., description="Transcribed text content")
    confidence: Optional[float] = Field(None, ge=0.0, le=1.0)
    processing_time: float = Field(..., description="Processing duration in seconds")
    language: str = Field(..., description="Detected language")
    dialect: str = Field(..., description="Detected dialect")  
    cultural_validation: dict = Field(..., description="Cultural appropriateness scoring")
    
class TTSRequest(BaseModel):
    text: str = Field(..., description="Text to synthesize")
    language: Literal['arabic', 'english'] = 'arabic'
    voice: str = Field(default='nova', description="Voice selection")
    speed: float = Field(default=0.9, ge=0.25, le=4.0)
    cultural_context: Optional[dict] = None
```

### Task List (Implementation Order)

```yaml
Task 1: Setup Shared Types and Audio Utilities
CREATE packages/types/src/voice.ts:
  - COPY interface patterns from examples/voice-recording/real-time-recorder.tsx  
  - ADD comprehensive TypeScript interfaces for voice recording and TTS states
  - INCLUDE cultural context types for Iraqi professional domains
  - ENSURE strict mode compliance with existing project patterns

CREATE packages/features/src/voice/audio-utils.ts:
  - COPY audio processing utilities from examples for format conversion
  - ADD WebM to WAV conversion helpers using FFmpeg patterns
  - IMPLEMENT Iraqi dialect context prompt generators with research findings
  - ADD browser compatibility detection with MediaRecorder MIME type fallbacks

CREATE packages/features/src/voice/cultural-validation.ts:
  - IMPLEMENT cultural appropriateness scoring algorithms
  - ADD Islamic value compliance validation patterns
  - INCLUDE professional context validation for Iraqi domains
  - ADD political/sectarian content filtering with regional sensitivity

Task 2: Backend Voice Services with Privacy Compliance
CREATE apps/api/src/routes/voice/recording.py:
  - ADAPT websocket-voice-handler.py patterns to production FastAPI structure
  - PRESERVE OpenAI Whisper integration with Iraqi dialect context prompts
  - ADD privacy-compliant temporary storage with 1-hour auto-deletion scheduling
  - IMPLEMENT connection management with graceful WebSocket disconnect handling

CREATE apps/api/src/services/voice_service.py:
  - IMPLEMENT business logic orchestration for voice processing workflow
  - ADD audio format conversion using FFmpeg patterns from example
  - INTEGRATE cultural validation pipeline with existing authentication
  - ADD performance monitoring and error handling with Arabic error messages

CREATE apps/api/src/services/privacy_service.py:
  - IMPLEMENT automated 1-hour deletion with cron job scheduling
  - ADD GDPR-compliant audit logging without storing sensitive audio data
  - ENSURE secure audio transmission with encryption in transit verification
  - ADD compliance monitoring and violation alerting systems

Task 3: Frontend Voice Recording Components
CREATE apps/web/src/components/voice/VoiceRecorder.tsx:
  - ADAPT real-time-recorder.tsx to production component architecture
  - PRESERVE MediaRecorder API integration with VAD patterns
  - MAINTAIN Arabic RTL layout and cultural font selection from examples
  - ADD integration hooks for existing chat state management coordination

CREATE apps/web/src/hooks/useVoiceRecording.ts:
  - EXTRACT state management logic from example component patterns
  - ADD WebSocket connection management for real-time transcription streaming
  - IMPLEMENT error handling and automatic retry logic for network issues
  - ADD browser compatibility detection with graceful fallback mechanisms

CREATE apps/web/src/components/voice/VoiceVisualizer.tsx:
  - IMPLEMENT real-time audio waveform visualization using Web Audio API
  - ADD voice activity detection visual feedback with cultural color schemes
  - ENSURE responsive design for mobile devices with touch-friendly controls
  - ADD accessibility support with screen reader compatible descriptions

Task 4: Text-to-Speech Integration
CREATE apps/web/src/components/voice/TTSControls.tsx:
  - IMPLEMENT Arabic text-to-speech controls with voice selection
  - ADD playback controls (play, pause, stop, speed, volume) with RTL layout
  - INCLUDE cultural appropriateness indicators and Islamic compliance
  - ADD accessibility support with keyboard navigation and screen reader compatibility

CREATE apps/api/src/services/tts_service.py:
  - INTEGRATE OpenAI TTS API with Arabic language optimization
  - ADD cultural validation for text-to-speech content appropriateness
  - IMPLEMENT voice selection optimized for Arabic pronunciation quality
  - ADD performance optimization for Iraqi network conditions and caching

CREATE apps/web/src/hooks/useVoicePlayback.ts:
  - IMPLEMENT TTS playback state management with audio control
  - ADD real-time playback progress tracking and position control
  - INCLUDE error handling for TTS generation and playback failures
  - ADD integration with existing chat message audio playback patterns

Task 5: Chat Interface Integration
MODIFY apps/web/src/components/chat/MessageInput.tsx:
  - ADD voice input button alongside existing text input controls
  - INTEGRATE voice recording state with chat message composition flow
  - PRESERVE existing Arabic RTL layout and keyboard shortcut functionality
  - ADD seamless transition between voice and text input modes

CREATE apps/web/src/components/voice/VoiceMessage.tsx:
  - IMPLEMENT voice message display component for chat history integration
  - ADD playback controls and transcription display with Arabic RTL support
  - MAINTAIN consistency with existing message styling and cultural patterns
  - ADD accessibility support for screen readers and keyboard navigation

UPDATE apps/web/src/hooks/useChat.ts:
  - EXTEND existing chat state management to include voice message handling
  - ADD voice message submission flow with transcription and audio data
  - INTEGRATE cultural validation results into message display logic
  - PRESERVE existing chat functionality while adding voice capabilities

Task 6: WebSocket Real-time Communication
CREATE apps/api/src/routes/voice/websocket.py:
  - IMPLEMENT WebSocket endpoints for real-time voice streaming
  - ADD chunk-based audio processing for low-latency transcription
  - INCLUDE connection state management and automatic reconnection logic
  - ADD load balancing and scaling considerations for concurrent users

UPDATE apps/web/src/hooks/useWebSocketVoice.ts:
  - IMPLEMENT WebSocket client integration for real-time voice communication
  - ADD automatic reconnection and connection state management
  - INCLUDE real-time transcription display with typing indicators
  - ADD error handling and fallback to HTTP-based voice processing

CREATE apps/api/src/middleware/websocket_middleware.py:
  - ADD authentication and authorization for WebSocket voice connections
  - IMPLEMENT rate limiting and abuse prevention for voice processing
  - ADD monitoring and logging for WebSocket connection health
  - INCLUDE cultural validation middleware for streaming voice content

Task 7: Cross-browser Compatibility and Accessibility
CREATE apps/web/src/utils/browser-compatibility.ts:
  - IMPLEMENT MediaRecorder MIME type detection with format fallbacks
  - ADD Safari-specific MP4 format handling and iOS autoplay workarounds
  - INCLUDE graceful degradation for unsupported browsers with user feedback
  - ADD feature detection for Web Audio API and WebAssembly VAD support

UPDATE apps/web/src/components/voice/VoiceRecorder.tsx:
  - ADD comprehensive browser compatibility checks with user-friendly feedback
  - IMPLEMENT fallback UI for browsers without MediaRecorder support
  - ADD culturally appropriate error messages in Arabic and English
  - INCLUDE accessibility enhancements for screen readers and keyboard navigation

CREATE apps/web/src/components/voice/VoicePermissions.tsx:
  - IMPLEMENT microphone permission management with cultural sensitivity
  - ADD step-by-step permission guidance in Arabic and English
  - INCLUDE troubleshooting help for common permission issues
  - ADD graceful handling of permission denial with alternative input options

Task 8: Testing and Monitoring Implementation
CREATE tests/voice/cultural-validation.test.ts:
  - IMPLEMENT Iraqi dialect recognition accuracy testing
  - ADD Islamic appropriateness validation with sample content
  - INCLUDE professional context validation for all target domains
  - ADD regression testing for cultural sensitivity changes

CREATE tests/voice/cross-browser.test.ts:
  - IMPLEMENT automated cross-browser compatibility testing
  - ADD MediaRecorder format detection and fallback verification
  - INCLUDE mobile device testing for touch controls and performance
  - ADD accessibility testing with screen reader simulation

CREATE apps/api/src/monitoring/voice_metrics.py:
  - IMPLEMENT performance monitoring for voice processing pipeline
  - ADD accuracy tracking for Iraqi dialect transcription rates
  - INCLUDE privacy compliance monitoring with automated audit reports
  - ADD cultural validation success rate tracking and alerting
```

### Integration Points
```yaml
CHAT_INTERFACE_INTEGRATION:
  - component: "MessageInput.tsx - Add voice input button with state coordination"
  - pattern: "Follow existing chat message composition and submission flow"
  - styling: "Maintain Arabic RTL layout and cultural design consistency"
  - state: "Extend useChat hook for voice message handling and transcription"

WEBSOCKET_COMMUNICATION:
  - service: "Extend existing WebSocket infrastructure for voice streaming"
  - pattern: "Use ConnectionManager from voice-streaming example with scaling"
  - authentication: "Integrate with existing session management and JWT token validation"
  - monitoring: "Add voice-specific metrics to existing WebSocket health monitoring"

CULTURAL_VALIDATION_PIPELINE:
  - integration: "Connect to existing cultural appropriateness validation services"
  - pattern: "Use existing Iraqi professional domain validation patterns"
  - filtering: "Extend existing content filtering for political/sectarian sensitivity"
  - compliance: "Follow existing Islamic value compliance and audit logging"

PRIVACY_AND_SECURITY:
  - storage: "Extend existing file upload security patterns for audio processing"
  - deletion: "Use existing automatic cleanup service with 1-hour audio retention"
  - compliance: "Follow existing GDPR compliance infrastructure and audit trails"
  - encryption: "Use existing secure transmission patterns for WebSocket audio data"

ARABIC_RTL_CONSISTENCY:
  - components: "Follow existing Arabic component patterns from rtl-support examples"
  - fonts: "Use established font selection (Noto Sans Arabic, Amiri, Cairo)"
  - layout: "Maintain consistency with existing RTL text direction and alignment"
  - cultural: "Follow existing Islamic design principles and color schemes"
```

## Validation Loop

### Level 1: Syntax & Style Validation
```bash
# TypeScript compilation and type checking
npm run typecheck
# Expected: No type errors. Fix any TypeScript issues before proceeding.

# Frontend code style and linting
npm run lint --fix
# Expected: All ESLint issues auto-fixed or manually resolved.

# Python type checking and code formatting
cd apps/api && python -m mypy src/routes/voice/ src/services/voice_service.py
cd apps/api && python -m ruff check src/ --fix
# Expected: No mypy type errors and all ruff style issues resolved.

# Arabic RTL layout validation
npm run test:rtl -- --testPathPattern=voice
# Expected: All RTL layout tests pass with proper Arabic text direction.
```

### Level 2: Unit Testing
```bash
# Frontend voice component unit tests
npm run test:unit -- --testPathPattern=voice --coverage
# Test cases must include:
# - MediaRecorder initialization with browser compatibility fallbacks
# - Voice Activity Detection integration with Silero VAD patterns
# - Arabic RTL layout rendering with proper font selection
# - Cultural validation integration with Iraqi dialect context
# - Error handling for microphone permission denial scenarios

# Backend voice service unit tests
cd apps/api && python -m pytest tests/voice/ -v --cov=src/services/voice_service.py
# Test cases must include:
# - OpenAI Whisper integration with Iraqi dialect context prompts
# - Audio format conversion accuracy (WebM to WAV) with quality verification
# - Privacy service automatic deletion timing and audit logging
# - Cultural appropriateness validation with Islamic compliance checking
# - WebSocket connection management with automatic reconnection logic

# Shared utilities unit tests
npm run test:packages -- --testPathPattern=voice
# Test cases must include:
# - Audio utility functions with format conversion and browser compatibility
# - Iraqi dialect context generation with accuracy validation
# - Cultural validation scoring with professional domain context
# - Type safety validation for all voice-related interfaces
```

### Level 3: Integration Testing
```bash
# End-to-end voice recording workflow
npm run test:e2e -- --spec=voice-recording-workflow.cy.ts
# Integration test workflow:
# 1. Browser microphone access and permission handling verification
# 2. Audio recording with MediaRecorder API and format detection
# 3. WebSocket transmission to backend with connection resilience
# 4. OpenAI Whisper transcription with Iraqi dialect accuracy
# 5. Real-time transcription display in chat interface with RTL support
# 6. Automatic audio deletion verification within 1-hour requirement

# WebSocket voice communication testing
cd apps/api && python -m pytest tests/integration/test_voice_websocket.py -v
# Integration test scenarios:
# - Real-time voice streaming with chunk processing
# - Connection management with automatic reconnection
# - Load testing with concurrent voice processing
# - Error handling and graceful degradation testing
```

### Level 4: Cultural and Accessibility Testing
```bash
# Iraqi dialect recognition accuracy testing
npm run test:cultural -- --focus=iraqi-dialect-accuracy
# Cultural validation requirements:
# - Baghdad dialect phrases: "شلونك, وين, شگد, أكو" with >85% accuracy
# - Basra dialect pronunciation patterns with regional context recognition
# - Mosul dialect vocabulary variations with professional terminology
# - Islamic appropriateness validation with cultural sensitivity scoring

# Cross-browser compatibility testing
npm run test:browsers -- --spec=voice-cross-browser.cy.ts
# Browser compatibility requirements:
# - Chrome/Firefox: WebM with Opus codec recording and playback
# - Safari: MP4 format fallback with iOS autoplay restriction handling
# - Edge: MIME type detection with full MediaRecorder feature support
# - Mobile browsers: Touch controls with network optimization for Iraq

# WCAG 2.2 accessibility compliance testing
npm run test:accessibility -- --focus=voice-interfaces
# Accessibility requirements:
# - Screen reader compatibility with Arabic RTL voice components
# - Keyboard navigation through all voice recording and playback states
# - Alternative input modes (voice + text + touch) with seamless switching
# - Visual feedback clarity for deaf/hard-of-hearing users
# - Voice-only operation for users with motor impairments

# Privacy compliance and security testing
cd apps/api && python -m pytest tests/privacy/test_voice_retention.py -v
# Privacy validation requirements:
# - Audio data automatic deletion within 1-hour maximum retention
# - Audit logging completeness without storing sensitive audio content
# - Secure WebSocket transmission with encryption verification
# - Cultural content filtering effectiveness for sensitive material
```

## Final Validation Checklist
- [ ] All tests pass: `npm run test && cd apps/api && python -m pytest`
- [ ] No linting errors: `npm run lint && cd apps/api && ruff check src/`
- [ ] No type errors: `npm run typecheck && cd apps/api && mypy src/`
- [ ] Cross-browser voice recording with MediaRecorder format fallbacks
- [ ] Iraqi dialect recognition >85% accuracy for Baghdad, Basra, Mosul
- [ ] Arabic RTL interface consistency across all voice components
- [ ] WebSocket real-time transcription with automatic reconnection
- [ ] Privacy compliance: automated 1-hour audio deletion with audit logging
- [ ] WCAG 2.2 accessibility compliance with screen reader support
- [ ] Cultural appropriateness >95% for Islamic value compliance
- [ ] Mobile-responsive touch controls optimized for Iraqi network conditions
- [ ] TTS integration with Arabic voice selection and cultural validation
- [ ] Error handling with culturally appropriate messages in Arabic and English
- [ ] Performance optimization for concurrent users and Iraqi connectivity
- [ ] Integration testing with existing chat interface functionality

---

## Anti-Patterns to Avoid
- ❌ Don't recreate existing voice recording patterns - adapt proven examples
- ❌ Don't skip MediaRecorder browser compatibility testing - Safari/iOS differences are critical
- ❌ Don't ignore Iraqi dialect context prompts - they're essential for transcription accuracy
- ❌ Don't store audio data beyond 1-hour requirement - privacy compliance is non-negotiable
- ❌ Don't assume WebSocket connections are stable - implement comprehensive reconnection logic
- ❌ Don't skip Arabic RTL layout testing - voice UI components have unique layout challenges
- ❌ Don't hardcode OpenAI API keys - follow existing environment configuration patterns
- ❌ Don't overlook cultural validation - Islamic appropriateness affects user trust significantly
- ❌ Don't ignore accessibility requirements - screen reader support is mandatory for inclusive design
- ❌ Don't skip mobile optimization - Iraqi users primarily access via mobile devices

---

**Confidence Level: 9/10** - Very high confidence for one-pass implementation success due to comprehensive existing examples, extensive research findings, proven technical patterns, detailed cultural requirements, executable validation strategies, and complete integration roadmap aligned with project standards and Iraqi user needs.