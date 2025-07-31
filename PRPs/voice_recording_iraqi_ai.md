name: "Voice Recording Integration for Iraqi AI Chat System"
description: |

## Purpose
Integrate comprehensive voice recording functionality with Arabic speech recognition, Iraqi dialect support, real-time audio processing, and privacy-compliant storage into the existing Iraqi AI Chat System.

## Core Principles
1. **Context is King**: Leverage existing examples and patterns from the codebase
2. **Validation Loops**: Provide executable tests for Arabic speech recognition and cultural validation
3. **Information Dense**: Use proven WebRTC, OpenAI Whisper, and VAD technologies
4. **Progressive Success**: Build from existing examples to production integration
5. **Global rules**: Follow all rules in CLAUDE.md, especially Arabic RTL and privacy compliance

---

## Goal
Implement production-ready voice recording that captures high-quality audio, recognizes Arabic speech with Iraqi dialect support, provides real-time feedback, and integrates seamlessly with the existing chat interface while maintaining strict privacy compliance with 1-hour auto-deletion.

## Why
- **User Experience**: Enable natural voice interaction for Iraqi users who prefer speaking over typing
- **Accessibility**: Support users with varying technical skills and assistive technology needs  
- **Cultural Integration**: Provide Iraqi dialect recognition with appropriate vocabulary and context
- **Mobile-First**: Optimize for mobile devices as primary access method for Iraqi users
- **Privacy Compliance**: Meet Iraqi data protection requirements and GDPR standards

## What
Voice recording system that integrates with existing chat interface, processes Arabic speech with Iraqi dialect support, and maintains privacy-compliant temporary storage with automatic deletion.

### Success Criteria
- [ ] Users can record voice messages directly in chat interface
- [ ] Arabic speech is accurately transcribed with Iraqi dialect support (Baghdad, Basra, Mosul)
- [ ] Real-time visual feedback during recording with voice activity detection
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari, Edge) with graceful fallbacks
- [ ] Audio data automatically deleted after 1 hour with compliance logging
- [ ] Seamless integration with existing Arabic RTL chat interface
- [ ] Mobile-responsive recording with touch-friendly controls

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- url: https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder
  why: MediaRecorder API reference for browser audio capture (75% compatibility score in 2025)
  critical: Safari requires MP4 format consideration, WebM/Opus preferred for other browsers
  
- url: https://www.vad.ricky0123.com/
  why: Voice Activity Detection using WebAssembly for real-time speech detection
  critical: Requires ONNX Runtime Web and specific initialization for Silero VAD model
  
- url: https://platform.openai.com/docs/guides/speech-to-text
  why: OpenAI Whisper API for Arabic speech recognition with dialect context support
  critical: Requires WAV format conversion and dialect-specific prompts for Iraqi Arabic
  
- url: https://gdpr.eu/data-privacy/
  why: GDPR compliance requirements for audio data processing and automatic deletion
  critical: 1-hour retention policy aligns with storage limitation principle

- file: examples/voice-recording/real-time-recorder.tsx
  why: Complete voice recording component with Iraqi dialect support and Arabic RTL UI
  critical: Follow existing patterns for MediaRecorder, VAD integration, and error handling

- file: examples/voice-streaming/websocket-voice-handler.py  
  why: FastAPI WebSocket implementation for real-time voice processing with OpenAI Whisper
  critical: Audio format conversion patterns and connection management for production use

- file: examples/rtl-support/arabic-components.tsx
  why: Arabic RTL layout patterns and font handling for voice interface components
  critical: Maintain consistency with existing Arabic UI patterns and cultural conventions

- file: examples/main_agent_reference/settings.py
  why: Environment configuration patterns for API keys and service integration
  critical: Follow existing patterns for OpenAI API key management and environment setup
```

### Current Codebase Structure (Relevant Sections)
```bash
aqlix-ai/
├── apps/
│   ├── web/src/           # Next.js frontend (target for voice components)
│   └── api/src/          # FastAPI backend (target for voice endpoints)
├── packages/
│   ├── types/            # Shared TypeScript types
│   ├── features/         # Shared business logic
│   └── ui/              # Shared UI components
├── examples/
│   ├── voice-recording/  # Real-time recorder component (REFERENCE)
│   ├── voice-streaming/  # WebSocket voice handler (REFERENCE)
│   └── rtl-support/     # Arabic RTL patterns (REFERENCE)
└── PRPs/                # Product requirement prompts
```

### Desired Codebase Structure (Files to Add)
```bash
apps/
├── web/src/
│   ├── components/voice/
│   │   ├── VoiceRecorder.tsx          # Main recording component (adapted from example)
│   │   ├── VoiceControls.tsx          # Recording controls with Arabic RTL
│   │   ├── VoiceVisualizer.tsx        # Real-time audio waveform display
│   │   └── VoiceTranscription.tsx     # Transcription display with Iraqi dialect
│   ├── hooks/
│   │   └── useVoiceRecording.ts       # Voice recording state management
│   └── pages/api/voice/
│       └── transcribe.ts              # Next.js API route for transcription
├── api/src/
│   ├── routes/voice/
│   │   ├── __init__.py
│   │   ├── transcription.py           # WebSocket + REST endpoints (adapted from example)
│   │   └── models.py                  # Pydantic models for voice data
│   ├── services/
│   │   ├── voice_service.py           # Business logic for voice processing
│   │   ├── audio_processor.py         # Audio format conversion and Whisper integration
│   │   └── privacy_service.py         # Auto-deletion and compliance logging
│   └── middleware/
│       └── audio_validation.py        # Audio content validation and security
packages/
├── types/src/
│   └── voice.ts                       # Shared voice recording types
├── features/src/voice/
│   ├── index.ts                       # Shared voice business logic
│   ├── audio-utils.ts                 # Audio format conversion utilities
│   └── dialect-context.ts             # Iraqi dialect context prompts
└── ui/src/voice/
    ├── VoiceButton.tsx               # Reusable voice input button
    └── VoiceStatus.tsx               # Voice recording status indicator
```

### Known Gotchas & Library Quirks
```python
# CRITICAL: MediaRecorder API browser compatibility
# Chrome/Firefox: Supports WebM with Opus codec (optimal for Whisper)
# Safari: Requires MP4 format, WebM may fail with errors
# Edge: Full support but test mime type detection

# CRITICAL: @ricky0123/vad-web WebAssembly requirements
# Requires ONNX Runtime Web loaded before VAD initialization
# Must call MicVAD.new() asynchronously and handle WebAssembly loading
# Silero VAD model is language-agnostic but may need Arabic-specific tuning

# CRITICAL: OpenAI Whisper audio format requirements  
# Prefers WAV format at 16kHz sample rate for optimal accuracy
# WebM to WAV conversion using FFmpeg improves transcription quality
# Requires dialect context prompts for Iraqi Arabic recognition

# CRITICAL: Iraqi dialect context prompts (from research)
# Baghdad: "شلونك (how are you), وين (where), شگد (how much), أكو (there is)"
# Basra: "Southern Iraqi dialect with distinctive pronunciation"
# Mosul: "Northern Iraqi dialect with unique vocabulary"

# CRITICAL: Privacy compliance automatic deletion
# Must implement automated cleanup after 1 hour maximum retention
# Requires audit logging for compliance without storing actual audio content
# GDPR Article 5 storage limitation principle requires documented justification

# CRITICAL: FastAPI WebSocket connection management
# Use ConnectionManager pattern from example for proper connection lifecycle
# Implement proper disconnect handling and resource cleanup
# Handle WebSocket connection drops gracefully with reconnection logic
```

## Implementation Blueprint

### Data Models and Structure
```typescript
// packages/types/src/voice.ts - Shared type definitions
interface VoiceRecordingState {
  isRecording: boolean;
  isPaused: boolean;
  isProcessing: boolean;
  duration: number;
  audioBlob: Blob | null;
  transcription: string;
  dialect: 'auto' | 'baghdad' | 'basra' | 'mosul';
  error?: string;
}

interface VoiceMessage {
  type: 'start_recording' | 'audio_chunk' | 'stop_recording' | 'transcription';
  clientId: string;
  audioData?: string; // Base64 encoded
  language: 'arabic' | 'english';
  dialect: string;
  timestamp: number;
}

// Python Pydantic models for backend
class VoiceTranscriptionRequest(BaseModel):
    audio_data: str  # Base64 encoded
    language: str = 'arabic'
    dialect: str = 'auto'
    client_id: str

class VoiceTranscriptionResponse(BaseModel):
    text: str
    confidence: Optional[float]
    processing_time: float
    language: str
    dialect: str
```

### Task List (Implementation Order)

```yaml
Task 1: Setup Shared Types and Utilities
CREATE packages/types/src/voice.ts:
  - COPY interface patterns from examples/voice-recording/real-time-recorder.tsx
  - ADD Iraqi-specific dialect types and cultural validation interfaces
  - ENSURE TypeScript strict mode compliance with existing patterns

CREATE packages/features/src/voice/audio-utils.ts:
  - COPY audio processing utilities from examples
  - ADD format conversion helpers for WebM/WAV compatibility
  - IMPLEMENT Iraqi dialect context prompt generators

Task 2: Backend Voice Service Integration  
CREATE apps/api/src/routes/voice/transcription.py:
  - ADAPT websocket-voice-handler.py patterns to FastAPI structure
  - PRESERVE OpenAI Whisper integration with Iraqi dialect context
  - ADD privacy-compliant temporary storage with 1-hour auto-deletion
  - IMPLEMENT connection management and error handling

CREATE apps/api/src/services/voice_service.py:
  - IMPLEMENT business logic for voice processing workflow
  - ADD audio format conversion using FFmpeg patterns from example
  - INTEGRATE with existing API authentication and rate limiting

Task 3: Frontend Voice Recording Components
CREATE apps/web/src/components/voice/VoiceRecorder.tsx:
  - ADAPT real-time-recorder.tsx to production component structure
  - PRESERVE MediaRecorder and VAD integration patterns
  - MAINTAIN Arabic RTL layout and font handling from examples
  - ADD integration hooks for existing chat state management

CREATE apps/web/src/hooks/useVoiceRecording.ts:
  - EXTRACT state management logic from example component
  - ADD WebSocket connection management for real-time transcription
  - IMPLEMENT error handling and retry logic for network issues

Task 4: Chat Interface Integration
MODIFY apps/web/src/components/chat/MessageInput.tsx:
  - ADD voice input button alongside text input
  - INTEGRATE voice recording state with chat message flow
  - PRESERVE existing Arabic RTL layout and keyboard shortcuts

CREATE apps/web/src/components/voice/VoiceMessage.tsx:
  - ADD voice message display component for chat history
  - IMPLEMENT playback controls and transcription display
  - MAINTAIN consistency with existing message styling patterns

Task 5: WebSocket Real-time Communication
MODIFY apps/api/src/routes/voice/transcription.py:
  - ADD WebSocket endpoints for real-time voice streaming
  - IMPLEMENT chunk-based audio processing for low latency
  - ADD connection state management and graceful degradation

UPDATE apps/web/src/hooks/useVoiceRecording.ts:
  - ADD WebSocket client integration for real-time transcription
  - IMPLEMENT automatic reconnection and connection state handling
  - ADD real-time transcription display with typing indicators

Task 6: Privacy and Security Implementation
CREATE apps/api/src/services/privacy_service.py:
  - IMPLEMENT automated 1-hour deletion with cron job patterns
  - ADD audit logging for compliance without storing sensitive data
  - ENSURE secure audio transmission with encryption in transit

CREATE apps/api/src/middleware/audio_validation.py:
  - ADD audio content validation for inappropriate material
  - IMPLEMENT file size and duration limits for security
  - ADD Iraqi cultural appropriateness validation hooks

Task 7: Cross-browser Testing and Fallbacks
CREATE apps/web/src/utils/browser-compatibility.ts:
  - ADD MediaRecorder MIME type detection and fallback logic
  - IMPLEMENT Safari-specific MP4 format handling
  - ADD graceful degradation for unsupported browsers

UPDATE apps/web/src/components/voice/VoiceRecorder.tsx:
  - ADD browser compatibility checks and user feedback
  - IMPLEMENT fallback UI for unsupported browsers
  - ADD error messages in Arabic and English with cultural context

Task 8: Performance Optimization and Monitoring
CREATE apps/api/src/monitoring/voice_metrics.py:
  - ADD performance monitoring for transcription accuracy and speed
  - IMPLEMENT resource usage tracking for audio processing
  - ADD Iraqi dialect-specific quality metrics and reporting

UPDATE apps/web/src/components/voice/VoiceRecorder.tsx:
  - ADD audio compression and optimization for mobile networks
  - IMPLEMENT progressive loading and resource management
  - ADD performance metrics collection for user experience optimization
```

### Integration Points
```yaml
CHAT_INTERFACE:
  - integration: "Add voice input button to MessageInput component"
  - pattern: "Follow existing chat message flow and state management"
  - styling: "Maintain Arabic RTL layout and cultural design patterns"

WEBSOCKET_COMMUNICATION:
  - integration: "Extend existing WebSocket infrastructure for voice streaming"
  - pattern: "Use ConnectionManager from voice-streaming example"
  - authentication: "Integrate with existing session management and JWT tokens"

PRIVACY_STORAGE:
  - integration: "Extend existing file upload security patterns"
  - pattern: "Use automatic deletion service with audit logging"
  - compliance: "Follow existing GDPR compliance infrastructure"

ARABIC_NLP_PIPELINE:
  - integration: "Connect transcription output to existing Arabic text processing"
  - pattern: "Use existing dialect recognition and cultural validation services"
  - output: "Format transcribed text for chat message display with RTL support"
```

## Validation Loop

### Level 1: Syntax & Style
```bash
# TypeScript compilation check - ensure no type errors
npm run typecheck

# ESLint for code style - auto-fix common issues
npm run lint --fix

# Python type checking and formatting
cd apps/api && python -m mypy src/
cd apps/api && python -m ruff check src/ --fix

# Expected: No errors. If errors exist, read carefully and fix before proceeding.
```

### Level 2: Unit Tests
```bash
# Frontend voice component tests
npm run test:unit -- --testPathPattern=voice

# Test cases should include:
# - MediaRecorder initialization and browser compatibility
# - Voice Activity Detection integration and event handling  
# - Arabic RTL layout rendering and font selection
# - Audio format conversion and error handling
# - Privacy compliance and automatic deletion timing

# Backend voice service tests  
cd apps/api && python -m pytest tests/test_voice_service.py -v

# Test cases should include:
# - OpenAI Whisper integration with Iraqi dialect context
# - WebSocket connection management and message handling
# - Audio format conversion (WebM to WAV) accuracy
# - Privacy service automatic deletion functionality
# - Iraqi cultural appropriateness validation
```

### Level 3: Integration Tests
```bash
# Full voice recording workflow test
npm run test:integration -- voice-recording

# Test end-to-end voice recording flow:
# 1. Browser microphone access and permission handling
# 2. Audio recording with MediaRecorder API
# 3. WebSocket transmission to backend service
# 4. OpenAI Whisper transcription with Iraqi dialect
# 5. Real-time transcription display in chat interface
# 6. Automatic audio deletion after processing

# WebSocket communication test
cd apps/api && python -m pytest tests/test_voice_websocket.py -v
```

### Level 4: Cross-Browser and Cultural Tests
```bash
# Cross-browser compatibility test (requires browser testing setup)
npm run test:e2e -- --spec=voice-recording-browsers.cy.ts

# Cultural validation test for Iraqi dialect recognition
npm run test:cultural -- --focus=voice-iraqi-dialect

# Privacy compliance test for automatic deletion
npm run test:privacy -- --focus=voice-data-retention

# Expected results:
# - Voice recording works in Chrome, Firefox, Safari, Edge
# - Iraqi dialect phrases are correctly recognized and transcribed
# - Audio data is automatically deleted within 1 hour
# - Arabic RTL display works correctly across all components
```

## Final Validation Checklist
- [ ] All tests pass: `npm run test && cd apps/api && python -m pytest`
- [ ] No linting errors: `npm run lint && cd apps/api && ruff check src/`
- [ ] No type errors: `npm run typecheck && cd apps/api && mypy src/`
- [ ] Cross-browser recording works with graceful fallbacks
- [ ] Iraqi dialect recognition accuracy tested with sample phrases
- [ ] Arabic RTL interface displays correctly in all voice components
- [ ] WebSocket real-time transcription works with connection recovery
- [ ] Privacy compliance: audio automatically deleted after 1 hour
- [ ] Integration with existing chat interface maintains all functionality
- [ ] Mobile-responsive voice controls work on touch devices
- [ ] Error handling provides helpful messages in Arabic and English

---

## Anti-Patterns to Avoid
- ❌ Don't recreate existing examples - adapt and integrate them
- ❌ Don't skip browser compatibility testing - MediaRecorder varies significantly
- ❌ Don't ignore Iraqi dialect specifics - context prompts are critical for accuracy
- ❌ Don't store audio data beyond 1 hour - privacy compliance is non-negotiable
- ❌ Don't assume WebSocket connections are stable - implement reconnection logic
- ❌ Don't skip Arabic RTL testing - layout issues are common with voice components
- ❌ Don't hardcode API keys - follow existing environment configuration patterns
- ❌ Don't ignore mobile optimization - Iraqi users primarily access via mobile devices

---

**Confidence Level: 8.5/10** - High confidence for one-pass implementation success due to comprehensive existing examples, detailed research findings, clear integration patterns, and executable validation gates aligned with project standards.