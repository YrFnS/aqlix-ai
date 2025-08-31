name: "Real-time Subscriptions System for Iraqi AI Chat System"
description: |
  Comprehensive implementation of Supabase real-time subscriptions with WebSocket management, 
  live data updates, and Iraqi cultural intelligence for dynamic chat interactions.

---

## Goal
Implement a robust real-time subscriptions foundation for the Iraqi AI Chat System that provides:
- **WebSocket Connection Management**: Reliable connection lifecycle with auto-reconnection
- **Subscription Management**: Channel-based subscriptions with proper cleanup
- **Live Data Updates**: Real-time data synchronization with conflict resolution
- **Cultural Intelligence**: Arabic RTL support and Islamic compliance in real-time features
- **Performance Optimization**: <200ms latency with intelligent caching
- **Error Recovery**: Graceful error handling and automatic reconnection strategies

## Why
- **Enhanced User Experience**: Real-time chat requires instant message delivery and live updates
- **Cultural Compliance**: Iraqi users expect culturally-aware real-time features (prayer time awareness, Arabic RTL)
- **Scalability Foundation**: Proper subscription management enables future collaborative features
- **Professional Standards**: Government-grade reliability for Iraqi ministry deployments
- **Integration Ready**: Foundation for real-time notifications, presence tracking, and live collaboration

## What
**Core Real-time Subscription Infrastructure** with these user-visible behaviors:
- Messages appear instantly without page refresh
- Connection status indicators (connected/disconnected/reconnecting)
- Graceful handling of network interruptions with auto-recovery
- Real-time typing indicators and presence status
- Cultural events (prayer time notifications, Ramadan schedule awareness)
- Arabic text synchronization with RTL conflict resolution

### Success Criteria
- [ ] WebSocket connections establish within 2 seconds
- [ ] Message delivery latency < 200ms under normal conditions
- [ ] Auto-reconnection works within 5 seconds of connection loss
- [ ] Subscription cleanup prevents memory leaks
- [ ] Cultural validation passes for all real-time content
- [ ] Performance monitoring shows <1% error rate
- [ ] Arabic RTL text synchronizes correctly
- [ ] Connection survives network switching (WiFi to mobile)

## All Needed Context

### Documentation & References
```yaml
# CRITICAL READING - Official Supabase Documentation
- url: https://supabase.com/docs/guides/realtime
  why: Core concepts, client setup, subscription patterns
  
- url: https://supabase.com/docs/guides/realtime/broadcast  
  why: Message broadcasting examples, channel management
  
- url: https://supabase.com/docs/guides/realtime/protocol
  why: WebSocket protocol, message structure, heartbeat patterns
  
- url: https://supabase.com/docs/guides/realtime/architecture
  why: Technical implementation details, scaling considerations

# EXISTING CODEBASE PATTERNS - CRITICAL TO FOLLOW
- file: examples/onlook-extracted/collaboration-engine/src/RealTimeCollaborationServer.ts
  why: Comprehensive WebSocket server with cultural intelligence patterns
  critical: Prayer time awareness, ministry-specific channels, Arabic greeting patterns
  
- file: examples/onlook-extracted/visual-editor/RealTimeCodeSync.ts
  why: Real-time synchronization patterns with conflict resolution
  critical: Performance optimization, cultural validation, audit logging
  
- file: examples/kortix-suna-extracted/backend/services/supabase.py
  why: Supabase client setup patterns, connection management
  critical: Async client initialization, error handling, singleton pattern

# SUPABASE CLIENT LIBRARIES
- doc: @supabase/supabase-js documentation
  section: Real-time subscriptions API
  critical: Channel creation, event listening, subscription lifecycle
```

### Current Codebase Structure
```bash
aqlix-ai/
├── examples/                      # 44 Iraqi-enhanced UI examples
│   ├── onlook-extracted/
│   │   ├── collaboration-engine/  # WebSocket server patterns
│   │   └── visual-editor/         # Real-time sync patterns
│   └── kortix-suna-extracted/     # Supabase integration patterns
├── PRPs/                          # Product requirement prompts
├── project-context/               # Persistent knowledge base
└── .claude/agents/               # 21 specialized agents
```

### Desired Codebase Structure (Files to Add)
```bash
packages/
├── realtime-client/              # NEW - Real-time client package
│   ├── src/
│   │   ├── client.ts            # Supabase real-time client wrapper
│   │   ├── subscription-manager.ts  # Subscription lifecycle management
│   │   ├── connection-monitor.ts    # Connection health and recovery
│   │   ├── cultural-sync.ts        # Arabic RTL and Islamic compliance
│   │   └── types.ts                # TypeScript definitions
│   ├── package.json
│   └── README.md
├── chat-realtime/               # NEW - Chat-specific real-time features  
│   ├── src/
│   │   ├── chat-subscription.ts    # Chat message subscriptions
│   │   ├── presence-tracker.ts     # User presence and typing indicators
│   │   ├── message-sync.ts         # Message synchronization logic
│   │   └── cultural-events.ts      # Prayer time and cultural notifications
│   └── package.json
└── types/                       # EXTEND - Add real-time types
    └── src/realtime.ts         # Real-time TypeScript definitions
```

### Known Gotchas & Library Quirks
```typescript
// CRITICAL: Supabase real-time requires specific connection patterns
// 1. WebSocket URL format: wss://PROJECT.supabase.co/realtime/v1/websocket?apikey=KEY
// 2. Heartbeat MUST be sent every 30 seconds or connection drops
// 3. Subscriptions need explicit unsubscribe() or memory leaks occur
// 4. Channel names must be unique per session
// 5. Messages sent before subscription establishment use HTTP, after use WebSocket

// CODEBASE SPECIFIC:
// - All features MUST integrate with iraqi-cultural-validator agent
// - Arabic text requires RTL processing via arabic-rtl-processor agent  
// - Prayer time awareness is MANDATORY for government deployments
// - Performance targets: <200ms latency, <16ms for cultural validation
// - Use Bun for all commands (30x faster than npm)
```

## Implementation Blueprint

### Data Models and Structure
```typescript
// Core real-time subscription types
interface RealtimeConfig {
  supabaseUrl: string
  supabaseKey: string
  culturalValidation: boolean
  islamicCompliance: boolean  
  arabicRTL: boolean
  prayerTimeAware: boolean
  performanceOptimized: boolean
  maxLatency: number // Target <200ms
}

interface SubscriptionChannel {
  id: string
  name: string
  topic: string
  ministry?: 'health' | 'education' | 'interior' | 'justice'
  culturalContext: boolean
  islamicCompliant: boolean
  participants: Map<string, UserPresence>
  messageHistory: RealtimeMessage[]
  prayerPaused: boolean
}

interface RealtimeMessage {
  id: string
  type: 'chat' | 'presence' | 'cultural' | 'system'
  payload: any
  timestamp: Date
  userId: string
  culturalValidation: CulturalValidationResult
  arabicContent?: string
  rtlProcessed: boolean
}

interface ConnectionState {
  status: 'connecting' | 'connected' | 'disconnected' | 'reconnecting'
  latency: number
  lastHeartbeat: Date
  reconnectAttempts: number
  errorCount: number
}
```

### List of Tasks (Implementation Order)

```yaml
Task 1: Setup Core Realtime Client Package
CREATE packages/realtime-client/package.json:
  - DEPENDENCIES: @supabase/supabase-js, eventemitter3
  - DEVDEPENDENCIES: typescript, vitest, @types/node
  - SCRIPTS: build, test, dev, typecheck

CREATE packages/realtime-client/src/client.ts:
  - PATTERN: Mirror examples/kortix-suna-extracted/backend/services/supabase.py async patterns
  - IMPLEMENT: createClient wrapper with cultural config
  - INCLUDE: Connection retry logic, heartbeat management
  - CULTURAL: Integration with iraqi-cultural-validator agent

Task 2: Implement Subscription Management
CREATE packages/realtime-client/src/subscription-manager.ts:
  - PATTERN: Follow examples/onlook-extracted/collaboration-engine channel management
  - IMPLEMENT: Channel lifecycle (create, subscribe, unsubscribe, cleanup)
  - INCLUDE: Memory leak prevention, subscription registry
  - CULTURAL: Ministry-specific channels, prayer time awareness

Task 3: Connection Monitoring & Recovery  
CREATE packages/realtime-client/src/connection-monitor.ts:
  - PATTERN: Mirror RealTimeCollaborationServer connection health patterns
  - IMPLEMENT: Heartbeat monitoring, reconnection strategies
  - INCLUDE: Exponential backoff, network change detection
  - PERFORMANCE: <5 second reconnection target

Task 4: Cultural Synchronization
CREATE packages/realtime-client/src/cultural-sync.ts:
  - PATTERN: Use RealTimeCodeSync cultural intelligence patterns
  - IMPLEMENT: Arabic RTL text processing, Islamic compliance checks
  - INTEGRATE: arabic-rtl-processor and iraqi-cultural-validator agents
  - FEATURES: Prayer time notifications, cultural event handling

Task 5: TypeScript Definitions
CREATE packages/realtime-client/src/types.ts:
  - EXTEND: packages/types/src/realtime.ts
  - DEFINE: All interfaces from data models section
  - INCLUDE: Cultural context types, performance metrics
  - ENSURE: Strict type safety with no 'any' types

Task 6: Chat-Specific Real-time Features
CREATE packages/chat-realtime/src/chat-subscription.ts:
  - PATTERN: Extend subscription-manager for chat use cases
  - IMPLEMENT: Message broadcasting, typing indicators
  - CULTURAL: Arabic message validation, RTL conflict resolution
  - PERFORMANCE: Message queuing for offline scenarios

Task 7: Presence Tracking System
CREATE packages/chat-realtime/src/presence-tracker.ts:
  - PATTERN: Use Supabase Presence API examples
  - IMPLEMENT: User online/offline status, typing indicators
  - CULTURAL: Respectful presence indicators, prayer time awareness
  - FEATURES: Ministry-based presence groups

Task 8: Message Synchronization
CREATE packages/chat-realtime/src/message-sync.ts:
  - PATTERN: Mirror RealTimeCodeSync bidirectional patterns
  - IMPLEMENT: Message conflict resolution, offline sync
  - CULTURAL: Arabic text synchronization, RTL handling
  - PERFORMANCE: <200ms message delivery target

Task 9: Cultural Events Integration
CREATE packages/chat-realtime/src/cultural-events.ts:
  - PATTERN: Use RealTimeCollaborationServer prayer time management
  - IMPLEMENT: Prayer notifications, Ramadan schedule awareness
  - INTEGRATE: Islamic calendar, ministry-specific events
  - FEATURES: Automatic session pause/resume for prayers

Task 10: Integration & Testing
MODIFY existing chat components to use real-time packages:
  - INTEGRATE: New realtime packages into chat interface
  - TEST: All subscription scenarios, error handling
  - VALIDATE: Cultural compliance, performance targets
  - DOCUMENT: API usage examples, troubleshooting guide
```

### Per-Task Pseudocode

```typescript
// Task 1: Core Realtime Client
class IraqiRealtimeClient extends EventEmitter {
  private supabase: SupabaseClient
  private config: RealtimeConfig
  private connectionState: ConnectionState
  
  async initialize() {
    // PATTERN: Follow supabase.py initialization
    this.supabase = createClient(url, key, {
      realtime: {
        params: { eventsPerSecond: 10 }, // Iraqi network optimization
      }
    })
    
    // CULTURAL: Initialize agents
    await this.initializeCulturalValidation()
    
    // PERFORMANCE: Setup connection monitoring
    this.startHeartbeatMonitoring()
  }
  
  // CRITICAL: Heartbeat every 30 seconds max
  private startHeartbeatMonitoring() {
    setInterval(() => {
      if (this.shouldSendHeartbeat()) {
        this.sendHeartbeat()
      }
    }, 25000) // 25s to be safe
  }
}

// Task 2: Subscription Management  
class SubscriptionManager {
  private channels = new Map<string, RealtimeChannel>()
  private subscriptions = new Map<string, RealtimeSubscription>()
  
  async createSubscription(options: SubscriptionOptions) {
    // VALIDATION: Cultural compliance check
    const validation = await this.culturalValidator.validate(options)
    if (!validation.compliant) {
      throw new CulturalComplianceError(validation.issues)
    }
    
    // PATTERN: Follow RealTimeCollaborationServer channel setup
    const channel = this.supabase
      .channel(`iraqi-chat-${options.channelId}`)
      .on('broadcast', { event: options.event }, this.handleMessage)
      .on('presence', { event: 'sync' }, this.handlePresence)
    
    // CRITICAL: Always track for cleanup
    const subscription = await channel.subscribe()
    this.subscriptions.set(options.channelId, subscription)
    
    return subscription
  }
  
  // MEMORY LEAK PREVENTION
  async cleanup() {
    for (const subscription of this.subscriptions.values()) {
      await subscription.unsubscribe()
    }
    this.subscriptions.clear()
  }
}

// Task 4: Cultural Synchronization
class CulturalSync {
  async processArabicMessage(message: string): Promise<ProcessedMessage> {
    // AGENT INTEGRATION: Use arabic-rtl-processor
    const rtlProcessed = await this.arabicProcessor.processRTL(message, {
      dialect: 'iraqi',
      respectIslamic: true,
      governmentCompliant: true
    })
    
    // AGENT INTEGRATION: Use iraqi-cultural-validator  
    const culturalValidation = await this.culturalValidator.validate(rtlProcessed, {
      islamicCompliance: true,
      professionalContext: true
    })
    
    if (!culturalValidation.passes) {
      // CULTURAL: Auto-correct if possible
      const corrected = await this.culturalValidator.autoCorrect(rtlProcessed)
      return { content: corrected, validation: culturalValidation }
    }
    
    return { content: rtlProcessed, validation: culturalValidation }
  }
}
```

### Integration Points
```yaml
SUPABASE:
  - project: Get from environment SUPABASE_URL, SUPABASE_ANON_KEY
  - realtime: Enable in project dashboard (Realtime > Settings)
  - auth: Integrate with existing Supabase auth (packages/supabase-client)
  
CULTURAL AGENTS:
  - validate: All messages via iraqi-cultural-validator agent
  - process: Arabic text via arabic-rtl-processor agent  
  - monitor: Performance via iraqi-technical-debugger agent
  
CONFIGURATION:
  - add to: apps/web/.env.local
  - variables: REALTIME_MAX_LATENCY=200, CULTURAL_VALIDATION=true
  
MONITORING:
  - integrate: Sentry for error tracking (existing setup)
  - metrics: Connection health, message latency, cultural compliance rate
```

## Validation Loop

### Level 1: Syntax & Style  
```bash
# FIRST: Fix all syntax and style issues
cd packages/realtime-client && bun run typecheck
cd packages/chat-realtime && bun run typecheck  
bun run lint --fix

# Expected: No TypeScript errors, no linting violations
# If errors: Read carefully - often indicates architectural issues
```

### Level 2: Unit Tests
```typescript
// CREATE packages/realtime-client/tests/client.test.ts
describe('IraqiRealtimeClient', () => {
  test('establishes connection within 2 seconds', async () => {
    const client = new IraqiRealtimeClient(mockConfig)
    const startTime = Date.now()
    
    await client.initialize()
    
    const connectionTime = Date.now() - startTime
    expect(connectionTime).toBeLessThan(2000)
    expect(client.isConnected()).toBe(true)
  })
  
  test('handles cultural validation failure', async () => {
    const client = new IraqiRealtimeClient(mockConfig)
    mockCulturalValidator.validate.mockResolvedValue({ 
      compliant: false, 
      issues: ['Non-Islamic content detected'] 
    })
    
    await expect(
      client.sendMessage({ content: 'inappropriate content' })
    ).rejects.toThrow(CulturalComplianceError)
  })
  
  test('auto-reconnects after connection loss', async () => {
    const client = new IraqiRealtimeClient(mockConfig)
    await client.initialize()
    
    // Simulate connection loss
    client.simulateConnectionLoss()
    
    // Should reconnect within 5 seconds
    await new Promise(resolve => setTimeout(resolve, 6000))
    expect(client.isConnected()).toBe(true)
  })
})
```

```bash
# Run tests and iterate until passing
cd packages/realtime-client && bun test
cd packages/chat-realtime && bun test

# NEVER mock away failures - fix the underlying issue
```

### Level 3: Integration Test
```bash
# Start development server with real-time features
bun run dev

# Test WebSocket connection
curl -X POST http://localhost:3000/api/realtime/test \
  -H "Content-Type: application/json" \
  -d '{"message": "السلام عليكم", "channel": "test-chat"}'

# Expected: 200 OK with connection details
# Check browser dev tools WebSocket tab for active connections

# Test cultural validation
curl -X POST http://localhost:3000/api/realtime/test \
  -H "Content-Type: application/json" \
  -d '{"message": "inappropriate content", "channel": "test-chat"}'

# Expected: 400 Bad Request with cultural compliance error
```

### Level 4: Performance & Cultural Validation
```bash
# AGENT VALIDATION: Use specialized Iraqi agents
# This will validate cultural compliance, Arabic processing, and performance

# Cultural validation test
echo '{"content": "مرحبا كيف الحال؟", "rtl": true}' | \
  bun run test:cultural-validation

# Performance test - measure latency
bun run test:performance --max-latency=200

# Arabic RTL processing test  
bun run test:arabic-rtl --dialect=iraqi

# Expected: All tests pass with >95% compliance score
```

## Final Validation Checklist
- [ ] Connection establishes in <2 seconds: `bun run test:connection-speed`
- [ ] Message latency <200ms: `bun run test:message-latency`
- [ ] Auto-reconnection works: `bun run test:reconnection`
- [ ] Cultural validation >95%: `bun run test:cultural-compliance`
- [ ] Arabic RTL processing works: `bun run test:arabic-processing`
- [ ] Memory leaks prevented: `bun run test:memory-leaks`
- [ ] No TypeScript errors: `bun run typecheck`
- [ ] All unit tests pass: `bun test`
- [ ] Performance targets met: Check Sentry metrics
- [ ] Prayer time integration works: Manual test during prayer times

---

## Anti-Patterns to Avoid
- ❌ Don't create WebSocket connections without heartbeat management
- ❌ Don't forget to unsubscribe from channels (causes memory leaks)
- ❌ Don't skip cultural validation for any real-time content
- ❌ Don't ignore connection state changes (leads to ghost messages)
- ❌ Don't use polling when WebSockets are available  
- ❌ Don't hardcode channel names - use dynamic generation
- ❌ Don't send messages before subscription is confirmed
- ❌ Don't ignore network state changes (WiFi to mobile switching)
- ❌ Don't block the main thread with heavy Arabic text processing
- ❌ Don't forget prayer time awareness for government deployments

## Success Indicators
- WebSocket connections show as "Connected" in browser dev tools
- Messages appear instantly across multiple browser tabs
- Network interruptions recover gracefully without user intervention
- Arabic text displays correctly with RTL layout in real-time
- Cultural validation agent reports >95% compliance rate
- Sentry shows <1% error rate for real-time operations
- Performance monitoring shows consistent <200ms message latency
- No memory growth after extended usage sessions