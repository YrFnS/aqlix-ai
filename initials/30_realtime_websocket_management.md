# Real-time WebSocket Management for Iraqi AI Chat System

## TECHNOLOGY/FRAMEWORK:

**Dedicated real-time WebSocket management system** with connection lifecycle management, subscription handling, real-time data synchronization, cultural timing awareness, and performance optimization for Iraqi AI chat interactions.

**Specific technologies:** Supabase real-time WebSocket subscriptions, WebSocket connection management, real-time data synchronization, subscription patterns, connection recovery, and performance monitoring.

---

## TEMPLATE PURPOSE:

**Building focused real-time WebSocket management infrastructure** for the Iraqi AI Chat System that provides robust WebSocket connection lifecycle, real-time data synchronization, subscription management, and cultural timing awareness for seamless real-time AI interactions.

**Developers should be able to:** Manage WebSocket connections, handle real-time subscriptions, implement connection recovery, optimize real-time performance, manage cultural timing patterns, and provide reliable real-time communication infrastructure.

---

## CORE FEATURES:

**Focused real-time WebSocket management:**

### WebSocket Connection Management

- **Connection Lifecycle:** Complete WebSocket connection initialization, maintenance, and cleanup
- **Connection Pooling:** Efficient WebSocket connection pooling and resource management
- **Heartbeat Management:** Connection health monitoring with ping/pong heartbeat mechanisms
- **Auto Reconnection:** Intelligent reconnection strategies with exponential backoff
- **Connection Quality Monitoring:** Real-time connection quality assessment and optimization

### Real-time Subscription Management

- **Dynamic Subscriptions:** Real-time subscription creation, modification, and cleanup
- **Subscription Routing:** Intelligent routing of real-time updates to appropriate handlers
- **Filter Management:** Advanced filtering of real-time updates based on cultural context
- **Subscription Optimization:** Performance optimization for high-frequency subscription updates
- **Error Handling:** Robust error handling for subscription failures and recovery

### Cultural Timing Integration

- **Prayer Time Awareness:** WebSocket management adapted for Iraqi prayer time patterns
- **Business Hours Optimization:** Connection management optimized for Iraqi business hours
- **Ramadan Adaptations:** Special handling during Ramadan with adjusted timing patterns
- **Regional Time Zones:** Iraqi time zone awareness for connection timing optimization
- **Cultural Activity Patterns:** WebSocket optimization based on Iraqi cultural activity patterns

---

## EXAMPLES TO INCLUDE:

**Real-time WebSocket management examples:**

### WebSocket Connection Manager

```typescript
// Real-time WebSocket Connection Manager
class IraqiWebSocketManager {
  constructor() {
    this.supabaseClient = createSupabaseClient();
    this.connectionPool = new WebSocketConnectionPool();
    this.culturalTimingManager = new CulturalTimingManager();
    this.performanceMonitor = new WebSocketPerformanceMonitor();
    this.connectionRecovery = new ConnectionRecoveryManager();
  }

  async initializeConnection(
    userId: string,
    culturalContext: CulturalContext,
    connectionPreferences?: ConnectionPreferences,
  ): Promise<WebSocketConnectionResult> {
    // Get cultural timing optimizations
    const timingOptimizations =
      await this.culturalTimingManager.getOptimizations({
        region: culturalContext.region,
        userPreferences: culturalContext.preferences,
        currentTime: new Date(),
      });

    // Initialize connection with cultural awareness
    const connectionConfig = {
      userId,
      heartbeatInterval: timingOptimizations.heartbeatInterval,
      reconnectDelay: timingOptimizations.reconnectDelay,
      maxReconnectAttempts: timingOptimizations.maxReconnectAttempts,
      culturalPriorityMode: timingOptimizations.priorityMode,
      prayerTimeHandling: timingOptimizations.prayerTimeHandling,
    };

    // Create WebSocket connection
    const connection = await this.connectionPool.createConnection({
      config: connectionConfig,
      quality: connectionPreferences?.quality || "standard",
      priority: connectionPreferences?.priority || "normal",
    });

    // Set up heartbeat monitoring
    await this.setupHeartbeatMonitoring({
      connection,
      culturalContext,
      timingOptimizations,
    });

    // Initialize performance monitoring
    await this.performanceMonitor.startMonitoring({
      connectionId: connection.id,
      userId,
      culturalContext,
    });

    return {
      success: true,
      connectionId: connection.id,
      connectionQuality: connection.quality,
      culturalOptimizations: timingOptimizations,
      estimatedLatency: connection.estimatedLatency,
      heartbeatInterval: timingOptimizations.heartbeatInterval,
    };
  }

  async manageSubscription(
    connectionId: string,
    subscriptionConfig: SubscriptionConfig,
    culturalContext: CulturalContext,
  ): Promise<SubscriptionResult> {
    // Get connection from pool
    const connection = await this.connectionPool.getConnection(connectionId);
    if (!connection) {
      return {
        success: false,
        error: "Connection not found",
        requiresReconnection: true,
      };
    }

    // Apply cultural filtering rules
    const culturalFilters = await this.applyCulturalFilters({
      subscriptionConfig,
      culturalContext,
      islamicComplianceRequired: culturalContext.islamicComplianceRequired,
    });

    // Create subscription with cultural awareness
    const subscription = await this.supabaseClient
      .channel(`${subscriptionConfig.channel}:${culturalContext.region}`)
      .on(
        "postgres_changes",
        {
          event: subscriptionConfig.events,
          schema: "public",
          table: subscriptionConfig.table,
          filter: culturalFilters.combinedFilter,
        },
        async (payload) => {
          // Validate cultural appropriateness of incoming data
          const culturalValidation = await this.validateIncomingData({
            payload,
            culturalContext,
            islamicComplianceRequired: true,
          });

          if (culturalValidation.isValid) {
            await this.handleValidatedPayload({
              payload,
              culturalValidation,
              connectionId,
              subscriptionConfig,
            });
          } else {
            await this.handleCulturallyInappropriatePayload({
              payload,
              culturalIssues: culturalValidation.issues,
              connectionId,
            });
          }
        },
      )
      .subscribe();

    // Track subscription performance
    await this.performanceMonitor.trackSubscription({
      subscriptionId: subscription.id,
      connectionId,
      culturalFilters: culturalFilters.activeFilters,
      expectedUpdateFrequency: subscriptionConfig.expectedFrequency,
    });

    return {
      success: true,
      subscriptionId: subscription.id,
      culturalFiltersApplied: culturalFilters.activeFilters.length,
      islamicComplianceEnabled: culturalFilters.islamicComplianceEnabled,
      estimatedUpdateFrequency: subscriptionConfig.expectedFrequency,
    };
  }

  async handleConnectionRecovery(
    connectionId: string,
    recoveryReason:
      | "network_loss"
      | "server_disconnect"
      | "timeout"
      | "cultural_pause",
    culturalContext: CulturalContext,
  ): Promise<ConnectionRecoveryResult> {
    // Determine recovery strategy based on cultural context
    const recoveryStrategy = await this.connectionRecovery.determineStrategy({
      recoveryReason,
      culturalContext,
      currentTime: new Date(),
      connectionHistory: await this.getConnectionHistory(connectionId),
    });

    // Handle cultural recovery reasons (e.g., prayer time pause)
    if (recoveryReason === "cultural_pause") {
      const culturalRecovery = await this.handleCulturalRecovery({
        connectionId,
        culturalContext,
        pauseReason: recoveryStrategy.culturalPauseReason,
      });

      if (!culturalRecovery.shouldReconnect) {
        return {
          success: false,
          shouldReconnect: false,
          culturalPauseActive: true,
          estimatedResumeTime: culturalRecovery.estimatedResumeTime,
        };
      }
    }

    // Execute recovery with cultural timing awareness
    const recoveryResult = await this.connectionRecovery.executeRecovery({
      connectionId,
      strategy: recoveryStrategy,
      culturalContext,
      maxAttempts: recoveryStrategy.maxAttempts,
      backoffStrategy: recoveryStrategy.backoffStrategy,
    });

    // Restore subscriptions if recovery successful
    if (recoveryResult.success) {
      await this.restoreSubscriptions({
        connectionId,
        culturalContext,
        preserveCulturalFilters: true,
      });
    }

    return {
      success: recoveryResult.success,
      recoveryLatency: recoveryResult.latency,
      subscriptionsRestored: recoveryResult.subscriptionsRestored,
      culturalContinuityMaintained: recoveryResult.culturalContinuityMaintained,
      connectionQuality: recoveryResult.newConnectionQuality,
    };
  }
}
```

### Cultural Timing Manager

```typescript
// Cultural Timing Manager for WebSocket Operations
class CulturalTimingManager {
  constructor() {
    this.prayerTimeCalculator = new IraqiPrayerTimeCalculator();
    this.businessHoursManager = new IraqiBusinessHoursManager();
    this.culturalEventTracker = new CulturalEventTracker();
  }

  async getOptimizations(context: {
    region: string;
    userPreferences: any;
    currentTime: Date;
  }): Promise<TimingOptimizations> {
    // Get current prayer time status
    const prayerTimeStatus = await this.prayerTimeCalculator.getCurrentStatus({
      region: context.region,
      currentTime: context.currentTime,
    });

    // Check if it's during business hours
    const businessHoursStatus = await this.businessHoursManager.getStatus({
      region: context.region,
      currentTime: context.currentTime,
      userType: context.userPreferences?.userType || "general",
    });

    // Check for special cultural events (Ramadan, Eid, etc.)
    const culturalEvents = await this.culturalEventTracker.getCurrentEvents({
      region: context.region,
      currentTime: context.currentTime,
    });

    // Calculate timing optimizations
    let heartbeatInterval = 30000; // 30 seconds default
    let reconnectDelay = 1000; // 1 second default
    let maxReconnectAttempts = 5; // default

    // Adjust for prayer times
    if (prayerTimeStatus.isPrayerTime) {
      heartbeatInterval = 60000; // 1 minute during prayer
      reconnectDelay = 5000; // 5 seconds delay
      maxReconnectAttempts = 3; // fewer attempts
    }

    // Adjust for business hours
    if (businessHoursStatus.isBusinessHours) {
      heartbeatInterval = Math.min(heartbeatInterval, 20000); // 20 seconds max
      reconnectDelay = Math.min(reconnectDelay, 500); // 500ms min delay
      maxReconnectAttempts = Math.max(maxReconnectAttempts, 7); // more attempts
    }

    // Adjust for cultural events
    if (culturalEvents.isRamadan) {
      heartbeatInterval *= 1.5; // Longer intervals during Ramadan
      reconnectDelay *= 2; // Longer delays
    }

    return {
      heartbeatInterval,
      reconnectDelay,
      maxReconnectAttempts,
      priorityMode: prayerTimeStatus.isPrayerTime ? "respectful" : "standard",
      prayerTimeHandling: {
        isPrayerTime: prayerTimeStatus.isPrayerTime,
        nextPrayerIn: prayerTimeStatus.nextPrayerIn,
        pauseRecommended: prayerTimeStatus.shouldPause,
      },
      businessHoursOptimization: businessHoursStatus.isBusinessHours,
      culturalEventAdjustments: culturalEvents.activeEvents,
    };
  }

  async shouldPauseConnection(
    connectionId: string,
    culturalContext: CulturalContext,
    currentTime: Date,
  ): Promise<ConnectionPauseDecision> {
    // Check prayer time status
    const prayerTimeStatus = await this.prayerTimeCalculator.getCurrentStatus({
      region: culturalContext.region,
      currentTime,
    });

    // Check user preferences for cultural pausing
    const userPausePreferences = culturalContext.preferences
      ?.connectionPausing || {
      pauseForPrayer: true,
      pauseForCulturalEvents: false,
      respectBusinessHours: true,
    };

    let shouldPause = false;
    let pauseReason = null;
    let estimatedResumeTime = null;

    // Prayer time pausing
    if (prayerTimeStatus.isPrayerTime && userPausePreferences.pauseForPrayer) {
      shouldPause = true;
      pauseReason = "prayer_time";
      estimatedResumeTime = prayerTimeStatus.prayerEndTime;
    }

    // Cultural event pausing
    const culturalEvents = await this.culturalEventTracker.getCurrentEvents({
      region: culturalContext.region,
      currentTime,
    });

    if (
      culturalEvents.shouldPauseConnections &&
      userPausePreferences.pauseForCulturalEvents
    ) {
      shouldPause = true;
      pauseReason = "cultural_event";
      estimatedResumeTime = culturalEvents.estimatedEndTime;
    }

    return {
      shouldPause,
      pauseReason,
      estimatedResumeTime,
      culturalJustification: shouldPause
        ? this.getCulturalJustification(pauseReason)
        : null,
      userNotificationMessage: shouldPause
        ? this.getUserNotificationMessage(pauseReason, culturalContext.language)
        : null,
    };
  }
}
```

---

## DATABASE SCHEMA:

**Real-time WebSocket management tables:**

```sql
-- WebSocket Connection Registry
CREATE TABLE websocket_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),

    -- Connection details
    connection_id VARCHAR(200) NOT NULL UNIQUE,
    connection_status VARCHAR(20) DEFAULT 'connecting', -- connecting, connected, disconnected, error
    connection_quality VARCHAR(20) DEFAULT 'unknown', -- excellent, good, fair, poor, unknown

    -- Cultural timing configuration
    cultural_region VARCHAR(50) DEFAULT 'iraqi_general',
    heartbeat_interval_ms INTEGER DEFAULT 30000,
    prayer_time_handling JSONB DEFAULT '{}',
    business_hours_optimization BOOLEAN DEFAULT true,
    ramadan_adjustments BOOLEAN DEFAULT true,

    -- Performance metrics
    connection_latency_ms INTEGER,
    last_heartbeat TIMESTAMP WITH TIME ZONE,
    heartbeat_success_rate DECIMAL(3,2),
    reconnection_count INTEGER DEFAULT 0,

    -- Connection metadata
    device_info JSONB DEFAULT '{}',
    connection_preferences JSONB DEFAULT '{}',
    cultural_optimizations JSONB DEFAULT '{}',

    -- Timestamps
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    disconnected_at TIMESTAMP WITH TIME ZONE
);

-- Real-time Subscription Management
CREATE TABLE realtime_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    connection_id UUID REFERENCES websocket_connections(id),
    user_id UUID REFERENCES auth.users(id),

    -- Subscription configuration
    subscription_type VARCHAR(100) NOT NULL, -- conversation, state, cultural, system
    channel_name VARCHAR(200) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    filter_criteria JSONB NOT NULL,

    -- Cultural filtering
    cultural_filters JSONB DEFAULT '{}',
    islamic_compliance_required BOOLEAN DEFAULT true,
    professional_domain_filter VARCHAR(50),
    regional_filter VARCHAR(50),

    -- Performance tracking
    update_frequency_target INTEGER, -- updates per minute
    actual_update_frequency INTEGER,
    filter_efficiency_score DECIMAL(3,2),
    cultural_validation_time_ms INTEGER,

    -- Status tracking
    subscription_status VARCHAR(20) DEFAULT 'active', -- active, paused, error, cancelled
    last_update_received TIMESTAMP WITH TIME ZONE,
    total_updates_received INTEGER DEFAULT 0,

    -- Metadata
    subscription_metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP WITH TIME ZONE
);

-- Cultural Timing Events
CREATE TABLE cultural_timing_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Event identification
    event_type VARCHAR(50) NOT NULL, -- prayer, business_hours, ramadan, cultural_holiday
    event_name VARCHAR(200) NOT NULL,
    regional_applicability VARCHAR[] DEFAULT ARRAY['iraqi_general'],

    -- Timing details
    event_start TIMESTAMP WITH TIME ZONE NOT NULL,
    event_end TIMESTAMP WITH TIME ZONE NOT NULL,
    is_recurring BOOLEAN DEFAULT false,
    recurrence_pattern JSONB DEFAULT '{}',

    -- Impact on connections
    connection_impact VARCHAR(50) NOT NULL, -- pause, slow, optimize, priority
    heartbeat_adjustment_factor DECIMAL(3,2) DEFAULT 1.0,
    reconnect_delay_adjustment_factor DECIMAL(3,2) DEFAULT 1.0,

    -- User notification
    user_notification_message JSONB DEFAULT '{}', -- multilingual messages
    advance_notification_minutes INTEGER DEFAULT 5,

    -- Metadata
    event_metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- WebSocket Performance Analytics
CREATE TABLE websocket_performance_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    connection_id UUID REFERENCES websocket_connections(id),

    -- Analytics period
    analytics_period VARCHAR(20) NOT NULL, -- minute, hour, day
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,

    -- Connection metrics
    connection_uptime_percentage DECIMAL(5,2),
    average_latency_ms DECIMAL(8,2),
    heartbeat_success_rate DECIMAL(3,2),
    reconnection_frequency DECIMAL(8,4),

    -- Subscription metrics
    total_subscriptions INTEGER DEFAULT 0,
    active_subscriptions INTEGER DEFAULT 0,
    subscription_update_frequency DECIMAL(8,2),
    cultural_filter_efficiency DECIMAL(3,2),

    -- Cultural timing metrics
    prayer_time_pauses INTEGER DEFAULT 0,
    cultural_event_adjustments INTEGER DEFAULT 0,
    business_hours_optimizations INTEGER DEFAULT 0,

    -- Quality metrics
    overall_connection_quality_score DECIMAL(3,2),
    cultural_timing_compliance_score DECIMAL(3,2),
    user_experience_impact_score DECIMAL(3,2),

    -- Metadata
    analytics_metadata JSONB DEFAULT '{}',
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## DEVELOPMENT PATTERNS:

**Real-time WebSocket management architecture patterns:**

### Connection Management Patterns

- **Connection Lifecycle:** Complete connection initialization, maintenance, heartbeat, and cleanup patterns
- **Connection Pooling:** Efficient connection pooling with resource management and optimization
- **Quality Monitoring:** Real-time connection quality assessment and adaptive optimization
- **Recovery Strategies:** Intelligent reconnection strategies with cultural awareness
- **Performance Optimization:** Connection performance optimization based on cultural timing patterns

### Subscription Management Patterns

- **Dynamic Subscriptions:** Real-time subscription creation, modification, and cleanup patterns
- **Cultural Filtering:** Advanced filtering patterns for culturally appropriate real-time updates
- **Performance Tracking:** Subscription performance monitoring and optimization patterns
- **Error Handling:** Robust error handling and recovery patterns for subscription failures
- **Update Routing:** Intelligent routing of real-time updates to appropriate handlers

---

## VALIDATION REQUIREMENTS:

**Real-time WebSocket management validation:**

### Connection Performance Testing

- **Connection Latency:** <50ms WebSocket connection establishment testing
- **Heartbeat Reliability:** >99% heartbeat success rate validation
- **Reconnection Speed:** <2 seconds reconnection time testing
- **Quality Monitoring:** Real-time connection quality assessment accuracy testing
- **Cultural Timing:** Cultural timing adaptation effectiveness testing

### Subscription Performance Testing

- **Subscription Setup:** <100ms subscription creation time testing
- **Update Delivery:** Real-time update delivery latency testing
- **Cultural Filtering:** Cultural filter accuracy and performance testing
- **Error Recovery:** Subscription error recovery accuracy testing
- **Load Testing:** High-frequency subscription update handling testing

---

## INTEGRATION FOCUS:

**Real-time WebSocket management integration points:**

### Foundation Integration

- **Context Management Foundation:** Integration with shared context validation and cultural services
- **Cultural Timing Services:** Integration with Iraqi cultural timing and event management
- **Performance Monitoring:** Integration with system-wide performance monitoring
- **Error Handling:** Integration with centralized error handling and logging

### Component Integration

- **Cross-session Persistence:** WebSocket integration with context persistence services
- **Multi-device Sync:** WebSocket integration with multi-device synchronization
- **Cultural State Management:** WebSocket integration with cultural state transitions
- **Agent Communication:** WebSocket integration with PydanticAI agent communication

---

## ADDITIONAL NOTES:

**Iraqi AI Chat System WebSocket management considerations:**

- **Focus on real-time performance** - optimized WebSocket connections and subscriptions
- **Emphasize cultural timing** - Iraqi cultural timing awareness in all operations
- **Plan for reliability** - robust connection recovery and subscription management
- **Keep focused scope** - ONLY WebSocket management, no context persistence or synchronization logic

---

## TEMPLATE COMPLEXITY LEVEL:

- [ ] **Beginner-friendly** - Simple getting started patterns
- [x] **Intermediate** - Production-ready patterns with common features
- [ ] **Advanced** - Comprehensive patterns including complex scenarios
- [ ] **Enterprise** - Full enterprise patterns with monitoring, scaling, security

**Intermediate complexity selected** because real-time WebSocket management requires solid connection lifecycle management, subscription handling, cultural timing awareness, and performance optimization while remaining focused on WebSocket management only.

---

**This micro-initial provides focused requirements for real-time WebSocket management ONLY, handling connection lifecycle, subscriptions, and cultural timing without implementing context persistence, multi-device synchronization, or cultural state logic that belongs in other focused micro-initials.**
