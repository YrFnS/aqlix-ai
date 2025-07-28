---
name: "Streaming Responses for Iraqi AI Chat System"
description: "Comprehensive PRP for implementing real-time Arabic RTL streaming responses with PydanticAI integration, cultural context preservation, and network resilience"
---

## Purpose

Build a production-grade streaming response system for the Iraqi AI Chat System that delivers PydanticAI agent responses in real-time with proper Arabic RTL rendering, cultural context preservation during interruptions, and robust connection management optimized for Middle Eastern network conditions.

## Core Principles

1. **Arabic RTL First**: Intelligent text chunking that preserves Arabic word boundaries and RTL rendering performance
2. **Cultural Context Preservation**: Maintain Iraqi professional appropriateness during streaming interruptions and reconnections
3. **Network Resilience**: Adaptive streaming optimized for variable Middle Eastern internet infrastructure
4. **Production Ready**: Include security, monitoring, and error recovery for production deployments
5. **PydanticAI Integration**: Deep integration with PydanticAI streaming patterns and agent responses

## ⚠️ Implementation Guidelines: Arabic-Aware Streaming

**CRITICAL**: This implementation requires sophisticated Arabic text processing beyond basic character streaming.

### What NOT to do:
- ❌ **Don't stream character-by-character** - This breaks Arabic word boundaries and RTL rendering
- ❌ **Don't ignore cultural context** - Iraqi professional domains need context preservation during interruptions
- ❌ **Don't assume stable connections** - Middle Eastern networks require adaptive streaming
- ❌ **Don't skip Arabic text validation** - All streamed content must maintain cultural appropriateness
- ❌ **Don't ignore performance** - Arabic RTL rendering can be computationally expensive during streaming

### What TO do:
- ✅ **Use semantic chunking** - Stream Arabic text at logical word/phrase boundaries
- ✅ **Implement connection recovery** - Handle frequent network drops with state preservation
- ✅ **Add cultural validation** - Real-time filtering for Iraqi professional appropriateness
- ✅ **Optimize RTL performance** - Use CSS logical properties and efficient rendering
- ✅ **Monitor streaming quality** - Adaptive streaming based on network conditions

### Key Question:
**"Does this streaming implementation work properly for Arabic RTL text without breaking word boundaries or cultural context?"**

---

## Goal

Create a comprehensive streaming response system that:
- Delivers PydanticAI agent responses via FastAPI Server-Sent Events (SSE)
- Processes Arabic text with intelligent word boundary detection
- Preserves Iraqi cultural context during streaming interruptions
- Adapts to network quality with graceful degradation
- Supports professional domain-specific streaming (legal, medical, educational)

## Why

- **User Experience**: Real-time responses improve engagement for Iraqi professionals
- **Arabic Text Quality**: Proper RTL streaming prevents broken words and formatting issues
- **Network Reality**: Middle Eastern internet requires resilient streaming architecture
- **Cultural Appropriateness**: Professional contexts need maintained during interruptions
- **Performance**: Streaming reduces perceived latency for AI-powered interactions

## What

### Streaming Architecture Classification
- [x] **FastAPI SSE Implementation**: Server-Sent Events with PydanticAI integration
- [x] **Arabic Text Processing**: Intelligent chunking with RTL rendering optimization
- [x] **Connection Management**: Automatic reconnection with state preservation
- [x] **Cultural Context Streaming**: Real-time validation for Iraqi appropriateness

### Model Provider Requirements
- [x] **OpenAI**: `openai:gpt-4o` for high-quality Arabic text generation
- [x] **Anthropic**: `anthropic:claude-3-5-sonnet-20241022` as fallback
- [x] **Streaming Support**: All providers must support streaming responses
- [x] **Fallback Strategy**: Graceful degradation to non-streaming mode

### External Integrations
- [x] Redis for streaming state management and session recovery
- [x] Network quality monitoring APIs for adaptive streaming
- [x] Cultural validation services for real-time content filtering
- [x] Professional domain context services (legal, medical, educational)
- [x] Performance monitoring for Arabic text rendering optimization

### Success Criteria
- [ ] Arabic text streams without breaking word boundaries or RTL formatting
- [ ] Cultural validation maintains Iraqi appropriateness during streaming
- [ ] Connection recovery works seamlessly with network interruptions
- [ ] Performance benchmarks meet targets (<3s load, <200ms chunk delivery)
- [ ] Professional domain contexts preserved across streaming sessions
- [ ] Comprehensive testing across browsers and network conditions

## All Needed Context

### PydanticAI Streaming & FastAPI SSE Research

```yaml
# ESSENTIAL DOCUMENTATION - Must be researched thoroughly
- url: https://ai.pydantic.dev/
  why: Official PydanticAI documentation with streaming capabilities
  content: Agent streaming patterns, run_stream() usage, async context managers

- url: https://ai.pydantic.dev/agents/
  why: Agent streaming response patterns and async iteration
  content: agent.run_stream(), result.stream(), result.stream_text() methods

- url: https://fastapi.tiangolo.com/
  why: FastAPI Server-Sent Events implementation patterns
  content: StreamingResponse, media_type="text/event-stream", CORS configuration

# 2025 STREAMING BEST PRACTICES
- url: https://www.softgrade.org/sse-with-fastapi-react-langgraph/
  why: Modern FastAPI SSE implementation with React integration
  content: Event-driven architecture, proper error handling, reconnection strategies

- url: https://hassaanbinaslam.github.io/myblog/posts/2025-01-19-streaming-responses-fastapi.html
  why: Latest FastAPI streaming patterns and performance optimization
  content: StreamingResponse optimization, async generators, performance benchmarks

# MCP Research Integration
- mcp: Context7
  query: "FastAPI Server-Sent Events PydanticAI streaming Arabic RTL"
  why: Latest documentation patterns for SSE implementation with Arabic support

- mcp: Sequential  
  query: "Arabic text chunking streaming performance RTL rendering optimization"
  why: Complex analysis of Arabic text processing during streaming scenarios
```

### Arabic RTL Streaming Research

```yaml
# ARABIC TEXT PROCESSING RESEARCH
- url: https://blog.logto.io/rtl-language-support
  why: Modern RTL language layout support in web applications
  content: CSS logical properties, direction handling, performance optimization

- url: https://hacks.mozilla.org/2015/09/building-rtl-aware-web-apps-and-websites-part-1/
  why: Comprehensive RTL web application development patterns
  content: Arabic text rendering, bidirectional algorithm, browser compatibility

# ARABIC TEXT CHUNKING RESEARCH  
- url: https://www.mdpi.com/2079-3197/13/6/151
  why: Recent 2025 research on Arabic semantic text chunking
  content: Arabic morphology handling, word boundary detection, semantic coherence

- url: https://spotintelligence.com/2023/10/29/arabic-nlp/
  why: Arabic NLP challenges and text processing solutions
  content: Unicode ranges, reshaping, bidirectional text algorithms

# PERFORMANCE OPTIMIZATION
- url: https://developers.deepgram.com/docs/text-chunking-for-tts-optimization
  why: Text chunking strategies for real-time processing optimization
  content: Optimal chunk sizes, boundary detection, streaming performance
```

### Existing Codebase Patterns

```yaml
# EXISTING STREAMING IMPLEMENTATION
- file: examples/backend/fastapi-pydantic-agent.py
  why: Working FastAPI SSE implementation with PydanticAI integration
  content: chat_stream endpoint, PydanticAI agent.run_stream(), SSE formatting
  
# ARABIC TEXT PROCESSING PATTERNS
- file: examples/pdf-processing/fastapi-pdf-processor.py
  why: Established Arabic text processing with reshaping and bidirectional handling
  content: process_arabic_text(), arabic_reshaper, bidi_algorithm, Unicode detection

# CULTURAL CONTEXT MANAGEMENT
- file: examples/professional-etiquette/iraqi-business-protocols.py
  why: Iraqi cultural validation and professional context management
  content: IraqiBusinessEtiquetteManager, cultural_norms, professional_titles

# VOICE STREAMING REFERENCE
- file: examples/voice-streaming/websocket-voice-handler.py
  why: Real-time streaming patterns and connection management
  content: ConnectionManager, WebSocket handling, message type processing
```

### Architecture Research Requirements

```yaml
# STREAMING INFRASTRUCTURE PATTERNS
streaming_architecture:
  fastapi_sse:
    - StreamingResponse with async generators
    - "text/event-stream" media type
    - Proper CORS configuration for cross-origin streaming
    - Connection keep-alive headers
    - Error handling with reconnection signals
  
  pydantic_ai_integration:
    - agent.run_stream() async context manager
    - result.stream() for content chunks
    - Language context enhancement patterns
    - Cultural context injection in system prompts
  
  arabic_processing:
    - Unicode range detection: '\u0600' <= char <= '\u06FF'
    - arabic_reshaper for text display preparation
    - bidi_algorithm for RTL rendering
    - Semantic chunking at word boundaries
  
  connection_management:
    - Redis for streaming state persistence
    - Automatic reconnection with last position
    - Network quality monitoring and adaptation
    - Graceful degradation to non-streaming mode

# PERFORMANCE OPTIMIZATION PATTERNS
arabic_streaming_optimization:
  text_chunking:
    strategy: "Semantic chunking using Arabic morphology patterns"
    boundaries: "Word boundaries, phrase boundaries, sentence boundaries"
    performance: "Avoid character-by-character streaming for RTL"
  
  rendering_optimization:
    css_approach: "CSS logical properties (margin-inline, padding-inline)"
    rtl_handling: "dir='rtl' with proper font loading"
    performance: "Minimize reflow during chunk rendering"
  
  cultural_validation:
    real_time: "Stream content through cultural filter as chunks arrive"
    context_preservation: "Maintain professional domain context in Redis"
    recovery: "Restore cultural context after connection interruptions"

# SECURITY AND MONITORING
streaming_security:
  authentication: "JWT tokens with streaming endpoint authorization"
  rate_limiting: "Per-user streaming connection limits"
  content_validation: "Real-time filtering for inappropriate content"
  monitoring: "Stream performance metrics and error tracking"
```

## Implementation Blueprint

### Technology Research Phase

**RESEARCH REQUIRED - Complete before implementation:**

✅ **PydanticAI Streaming Deep Dive:**
- [ ] Agent streaming patterns: `agent.run_stream()`, `result.stream()`, `result.stream_text()`
- [ ] Async context manager usage and proper cleanup
- [ ] Language context enhancement for Arabic/English switching
- [ ] Error handling during streaming operations
- [ ] Integration with FastAPI streaming responses

✅ **FastAPI SSE Implementation:**
- [ ] StreamingResponse configuration with proper headers
- [ ] CORS setup for cross-origin streaming connections
- [ ] Event-driven architecture with proper SSE formatting
- [ ] Connection management and automatic reconnection
- [ ] Error recovery and graceful degradation patterns

✅ **Arabic Text Processing Research:**
- [ ] Arabic Unicode detection and text classification
- [ ] Semantic chunking strategies for Arabic text
- [ ] RTL rendering optimization techniques
- [ ] Arabic reshaping and bidirectional algorithm integration
- [ ] Performance benchmarking for Arabic text streaming

### Core Implementation Plan

```yaml
Implementation Task 1 - Enhanced FastAPI SSE Endpoint:
  EXTEND existing streaming endpoint in examples/backend/:
    - Build on fastapi-pydantic-agent.py chat_stream pattern
    - Add Arabic text chunking processor
    - Implement connection quality monitoring
    - Add cultural context preservation layer
    - Include Redis streaming state management

Implementation Task 2 - Arabic Text Streaming Processor:
  CREATE arabic_streaming_processor.py:
    - Intelligent Arabic word boundary detection
    - Semantic chunking based on Iraqi dialect patterns
    - RTL-safe text streaming without word breaks
    - Performance optimization for Arabic rendering
    - Integration with existing process_arabic_text() patterns

Implementation Task 3 - Cultural Context Streaming Service:
  IMPLEMENT cultural_context_streaming.py:
    - Real-time cultural validation during streaming
    - Professional domain context preservation
    - Iraqi business etiquette integration during interruptions  
    - Context recovery after network disconnections
    - Integration with IraqiBusinessEtiquetteManager

Implementation Task 4 - Connection Resilience Manager:
  CREATE connection_resilience.py:
    - Network quality monitoring and adaptive streaming
    - Automatic reconnection with position recovery
    - Redis-based streaming state persistence
    - Graceful degradation to non-streaming mode
    - Middle Eastern network condition optimization

Implementation Task 5 - Frontend React Components:
  IMPLEMENT streaming_chat_components.tsx:
    - Arabic RTL text streaming display
    - EventSource connection management
    - Automatic reconnection with visual feedback
    - Cultural context preservation in UI
    - Mobile-optimized streaming for Iraqi users

Implementation Task 6 - Comprehensive Testing Suite:
  CREATE streaming_test_suite/:
    - Arabic text boundary testing
    - Cultural validation during streaming
    - Network interruption simulation
    - Cross-browser RTL rendering tests
    - Performance benchmarking for Arabic text
```

### Professional Domain Integration

```yaml
Implementation Task 7 - Professional Domain Streaming:
  INTEGRATE with Iraqi professional contexts:
    - Legal domain: Iraqi law terminology preservation
    - Medical domain: Medical Arabic term accuracy
    - Educational domain: Iraqi curriculum context
    - Engineering domain: Technical term consistency
    - Each domain requires specialized streaming validation

Implementation Task 8 - Performance Optimization:
  IMPLEMENT arabic_performance_optimizer.py:
    - Chunk size optimization for Arabic text
    - RTL rendering performance monitoring
    - Memory management for long streaming sessions
    - Mobile battery optimization for Iraqi users
    - Network bandwidth adaptation
```

## Validation Loop

### Level 1: Arabic Text Streaming Validation

```bash
# Verify Arabic text processing setup
python -c "
import arabic_reshaper
from bidi.algorithm import get_display
print('Arabic processing libraries available')
"

# Test Arabic text chunking without word breaks
python -c "
from arabic_streaming_processor import ArabicStreamingProcessor
processor = ArabicStreamingProcessor()
test_text = 'مرحبا، شلونك اليوم؟ شكو ماكو؟'
chunks = processor.create_safe_chunks(test_text)
print(f'Chunks: {chunks}')
assert all(chunk.strip() for chunk in chunks), 'No empty chunks'
print('Arabic chunking validation passed')
"

# Expected: Arabic processing works, chunks preserve word boundaries
# If failing: Fix Arabic text processing and chunking logic
```

### Level 2: Streaming Infrastructure Validation

```bash
# Test FastAPI SSE endpoint
curl -N -H "Accept: text/event-stream" http://localhost:8000/api/chat/stream \
  -X POST -H "Content-Type: application/json" \
  -d '{"message": "مرحبا، كيف حالك؟", "language": "arabic"}'

# Test PydanticAI integration
python -c "
from pydantic_ai.test import TestModel
from streaming_agent import iraqi_streaming_agent
import asyncio

async def test_streaming():
    test_model = TestModel()
    async with iraqi_streaming_agent.run_stream(
        'اكتب لي تقرير قانوني بسيط',
        model=test_model
    ) as result:
        chunks = []
        async for chunk in result.stream():
            chunks.append(chunk)
        print(f'Streamed {len(chunks)} chunks successfully')
        return chunks

chunks = asyncio.run(test_streaming())
assert len(chunks) > 0, 'No chunks received'
print('PydanticAI streaming validation passed')
"

# Expected: SSE endpoint works, PydanticAI streaming functional
# If failing: Debug FastAPI configuration and PydanticAI integration
```

### Level 3: Cultural Context and Network Resilience Testing

```bash
# Test cultural validation during streaming
python -m pytest tests/test_cultural_streaming.py -v

# Test network interruption recovery
python -m pytest tests/test_connection_resilience.py -v

# Test professional domain streaming
python -m pytest tests/test_professional_streaming.py -v

# Test Arabic RTL rendering performance
npm run test:rtl:performance --prefix apps/web

# Expected: All cultural and resilience tests pass
# If failing: Fix cultural validation and connection management
```

### Level 4: Cross-Browser and Performance Validation

```bash
# Cross-browser Arabic streaming tests
npm run test:browsers:streaming --prefix apps/web

# Performance benchmarking
python -c "
import time
from streaming_performance_tester import ArabicStreamingBenchmark

benchmark = ArabicStreamingBenchmark()
results = benchmark.test_arabic_streaming_performance()
print(f'Average chunk delivery time: {results[\"avg_chunk_time\"]}ms')
print(f'RTL rendering performance: {results[\"rtl_render_time\"]}ms')
assert results['avg_chunk_time'] < 200, 'Chunk delivery too slow'
assert results['rtl_render_time'] < 100, 'RTL rendering too slow'
print('Performance benchmarks passed')
"

# Mobile device testing (if available)
npm run test:mobile:streaming --prefix apps/web

# Expected: Cross-browser compatibility, performance targets met
# If failing: Optimize streaming performance and fix browser issues
```

## Final Validation Checklist

### Arabic Streaming Implementation Completeness

- [ ] Arabic text chunking preserves word boundaries and cultural meaning
- [ ] RTL rendering optimized for streaming without performance degradation
- [ ] Cultural validation works in real-time during streaming
- [ ] Professional domain contexts maintained across interruptions
- [ ] Network resilience handles Middle Eastern connection variability
- [ ] Mobile optimization for primary Iraqi user access method

### PydanticAI Integration Excellence

- [ ] `agent.run_stream()` properly integrated with FastAPI SSE
- [ ] Language context enhancement works for Arabic/English switching
- [ ] Error handling covers streaming failures and recovery
- [ ] Testing includes TestModel validation for streaming behavior
- [ ] Security measures protect streaming endpoints and content

### Production Readiness

- [ ] Performance benchmarks meet targets (<3s load, <200ms chunks)
- [ ] Monitoring and alerting configured for streaming health
- [ ] Redis state management handles concurrent streaming sessions
- [ ] Graceful degradation to non-streaming mode when needed
- [ ] Cultural appropriateness maintained under all conditions

---

## Anti-Patterns to Avoid

### Arabic Text Streaming

- ❌ Don't stream character-by-character - breaks Arabic word formation and RTL rendering
- ❌ Don't ignore cultural context during interruptions - Iraqi professional contexts must be preserved
- ❌ Don't assume stable connections - implement adaptive streaming for variable networks
- ❌ Don't skip Arabic text validation - all content must maintain cultural appropriateness
- ❌ Don't ignore mobile performance - optimize for primary Iraqi access method

### Streaming Architecture

- ❌ Don't create streaming without proper error recovery - network drops are common
- ❌ Don't ignore connection state persistence - use Redis for session recovery
- ❌ Don't skip performance monitoring - Arabic RTL rendering can be expensive
- ❌ Don't forget graceful degradation - provide non-streaming fallback mode

### Cultural and Professional Context

- ❌ Don't lose professional context during streaming interruptions
- ❌ Don't ignore Iraqi business etiquette in streaming content
- ❌ Don't skip real-time cultural validation - filter inappropriate content immediately
- ❌ Don't assume universal Arabic - use Iraqi dialect-aware processing

**CONFIDENCE SCORE: 9/10** - Comprehensive research completed, existing patterns identified, clear implementation path with executable validation gates, and deep understanding of Iraqi-specific requirements for Arabic RTL streaming with cultural context preservation.