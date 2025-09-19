# Cross-Session Context Persistence for Iraqi AI Chat System

## TECHNOLOGY/FRAMEWORK:

**Dedicated cross-session context persistence system** with intelligent context preservation, cultural context continuity, professional context tracking, compression algorithms, and recovery mechanisms for seamless Iraqi AI conversation continuity.

**Specific technologies:** Redis context caching, PostgreSQL context storage, vector embeddings, context compression algorithms, cultural context preservation, distributed context storage, and intelligent context recovery.

---

## TEMPLATE PURPOSE:

**Building focused cross-session context persistence infrastructure** for the Iraqi AI Chat System that provides intelligent conversation context preservation, cultural context continuity, professional context tracking, and context recovery across sessions and interruptions.

**Developers should be able to:** Persist conversation context across sessions, preserve cultural context continuity, track professional domain context, implement context compression, manage context recovery, and provide seamless context restoration for interrupted conversations.

---

## CORE FEATURES:

**Focused cross-session context persistence:**

### Intelligent Context Preservation
- **Context Snapshot Management:** Automatic conversation context snapshots at strategic points
- **Context Versioning:** Context version management with rollback capabilities
- **Context Compression:** Intelligent context compression preserving cultural and professional elements
- **Context Indexing:** Efficient context indexing for fast retrieval and semantic matching
- **Context Lifecycle:** Complete context lifecycle management from creation to expiration

### Cultural Context Continuity
- **Iraqi Cultural Pattern Preservation:** Preservation of Iraqi cultural conversation patterns
- **Islamic Compliance Continuity:** Continuous Islamic compliance context preservation
- **Regional Context Tracking:** Iraqi regional context (Baghdad, Basra, Mosul, Erbil) preservation
- **Language Context Persistence:** Arabic-English language context and preference preservation
- **Cultural Transition History:** Historical tracking of cultural context transitions

### Professional Context Tracking
- **Domain Context Preservation:** Professional domain context persistence for Iraqi contexts
- **Credential Context Tracking:** Professional credential and qualification context preservation
- **Workflow Context Continuity:** Professional workflow and process context preservation
- **Compliance Context Management:** Professional compliance and regulatory context preservation
- **Expert Knowledge Context:** Domain expertise context preservation and retrieval

---

## EXAMPLES TO INCLUDE:

**Cross-session context persistence examples:**

### Context Persistence Manager
```typescript
// Cross-Session Context Persistence Manager
class CrossSessionContextPersistenceManager {
  constructor() {
    this.contextFoundation = new ContextManagementFoundation()
    this.redisClient = new Redis(process.env.REDIS_URL)
    this.postgresClient = new PostgreSQLClient()
    this.vectorStore = new VectorEmbeddingStore()
    this.compressionEngine = new ContextCompressionEngine()
    this.culturalPreserver = new CulturalContextPreserver()
  }

  async persistConversationContext(
    conversationId: string,
    userId: string,
    contextData: ConversationContext,
    culturalContext: CulturalContext,
    persistenceLevel: 'basic' | 'full' | 'enhanced'
  ): Promise<ContextPersistenceResult> {
    // Validate context before persistence
    const validation = await this.contextFoundation.validateContext(
      contextData,
      'cultural'
    )

    if (!validation.isValid) {
      return {
        success: false,
        error: 'Context validation failed',
        validationErrors: validation.errors
      }
    }

    // Extract cultural elements for preservation
    const culturalElements = await this.culturalPreserver.extractElements({
      contextData,
      culturalContext,
      preservationLevel: persistenceLevel
    })

    // Extract professional context if applicable
    let professionalElements = null
    if (culturalContext.professionalDomain) {
      professionalElements = await this.extractProfessionalElements({
        contextData,
        professionalDomain: culturalContext.professionalDomain,
        preservationLevel: persistenceLevel
      })
    }

    // Compress context with cultural preservation
    const compressedContext = await this.compressionEngine.compress({
      contextData,
      culturalElements,
      professionalElements,
      compressionLevel: this.getCompressionLevel(persistenceLevel),
      preserveCulturalIntegrity: true
    })

    // Generate vector embedding for semantic retrieval
    const contextVector = await this.vectorStore.generateEmbedding({
      originalContext: contextData,
      culturalElements,
      professionalElements,
      region: culturalContext.region
    })

    // Store in Redis for fast access
    await this.redisClient.setex(
      `context:session:${conversationId}`,
      this.getRedisExpiration(persistenceLevel),
      JSON.stringify({
        compressedContext,
        culturalElements,
        professionalElements,
        timestamp: new Date(),
        version: 1
      })
    )

    // Store in PostgreSQL for long-term persistence
    const persistenceRecord = await this.postgresClient.query(`
      INSERT INTO cross_session_contexts (
        conversation_id, user_id, context_data, cultural_context,
        professional_context, context_vector, compression_ratio,
        persistence_level, created_at, expires_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id
    `, [
      conversationId,
      userId,
      compressedContext.data,
      culturalElements,
      professionalElements,
      contextVector,
      compressedContext.compressionRatio,
      persistenceLevel,
      new Date(),
      this.calculateExpiration(persistenceLevel, culturalContext)
    ])

    // Track persistence metrics
    await this.trackPersistenceMetrics({
      conversationId,
      userId,
      persistenceLevel,
      compressionRatio: compressedContext.compressionRatio,
      culturalElementsCount: culturalElements?.patterns?.length || 0,
      professionalElementsCount: professionalElements?.elements?.length || 0,
      vectorDimensions: contextVector.length
    })

    return {
      success: true,
      persistenceId: persistenceRecord.rows[0].id,
      compressionRatio: compressedContext.compressionRatio,
      culturalIntegrityScore: compressedContext.culturalIntegrityScore,
      professionalContextPreserved: professionalElements ? true : false,
      estimatedRecoveryAccuracy: compressedContext.estimatedRecoveryAccuracy,
      redisExpiration: this.getRedisExpiration(persistenceLevel),
      postgresExpiration: this.calculateExpiration(persistenceLevel, culturalContext)
    }
  }

  async recoverConversationContext(
    conversationId: string,
    userId: string,
    culturalContext: CulturalContext,
    recoveryOptions?: ContextRecoveryOptions
  ): Promise<ContextRecoveryResult> {
    // Try Redis first for fast recovery
    const redisContext = await this.redisClient.get(`context:session:${conversationId}`)

    if (redisContext) {
      return await this.recoverFromRedis({
        redisData: JSON.parse(redisContext),
        conversationId,
        userId,
        culturalContext,
        recoveryOptions
      })
    }

    // Fallback to PostgreSQL for long-term recovery
    const postgresContext = await this.postgresClient.query(`
      SELECT context_data, cultural_context, professional_context,
             context_vector, compression_ratio, persistence_level,
             created_at
      FROM cross_session_contexts
      WHERE conversation_id = $1 AND user_id = $2
        AND expires_at > NOW()
      ORDER BY created_at DESC
      LIMIT 1
    `, [conversationId, userId])

    if (postgresContext.rows.length === 0) {
      return {
        success: false,
        error: 'No recoverable context found',
        suggestNewSession: true
      }
    }

    const contextRecord = postgresContext.rows[0]

    // Validate cultural context continuity
    const continuityCheck = await this.validateCulturalContinuity({
      storedCulturalContext: contextRecord.cultural_context,
      currentCulturalContext: culturalContext,
      maxCulturalDrift: recoveryOptions?.maxCulturalDrift || 0.15
    })

    if (!continuityCheck.continuityMaintained) {
      return {
        success: false,
        error: 'Cultural context continuity compromised',
        culturalDrift: continuityCheck.driftScore,
        suggestContextReset: true
      }
    }

    // Decompress and recover context
    const recoveredContext = await this.compressionEngine.decompress({
      compressedData: contextRecord.context_data,
      culturalContext: contextRecord.cultural_context,
      professionalContext: contextRecord.professional_context,
      preserveCulturalIntegrity: true
    })

    // Validate recovered context integrity
    const integrityValidation = await this.contextFoundation.validateContext(
      recoveredContext,
      'cultural'
    )

    if (!integrityValidation.isValid) {
      return {
        success: false,
        error: 'Recovered context integrity validation failed',
        integrityErrors: integrityValidation.errors
      }
    }

    // Update Redis cache with recovered context
    await this.redisClient.setex(
      `context:session:${conversationId}`,
      3600, // 1 hour
      JSON.stringify({
        compressedContext: { data: recoveredContext },
        culturalElements: contextRecord.cultural_context,
        professionalElements: contextRecord.professional_context,
        timestamp: new Date(),
        version: 1,
        recoveredFrom: 'postgres'
      })
    )

    return {
      success: true,
      recoveredContext,
      recoverySource: 'postgres',
      culturalContinuityScore: continuityCheck.continuityScore,
      professionalContextRestored: contextRecord.professional_context ? true : false,
      contextAge: Date.now() - new Date(contextRecord.created_at).getTime(),
      estimatedAccuracy: this.calculateRecoveryAccuracy(contextRecord, continuityCheck)
    }
  }

  async createContextSnapshot(
    conversationId: string,
    userId: string,
    currentContext: ConversationContext,
    culturalContext: CulturalContext,
    snapshotReason: 'automatic' | 'manual' | 'interruption' | 'milestone'
  ): Promise<ContextSnapshotResult> {
    // Determine snapshot strategy based on reason
    const snapshotStrategy = this.getSnapshotStrategy(snapshotReason, culturalContext)

    // Create cultural-aware snapshot
    const snapshot = await this.createCulturalSnapshot({
      currentContext,
      culturalContext,
      snapshotStrategy,
      preservationLevel: snapshotStrategy.preservationLevel
    })

    // Store snapshot with unique identifier
    const snapshotId = `snapshot:${conversationId}:${Date.now()}`

    await this.redisClient.setex(
      snapshotId,
      snapshotStrategy.expiration,
      JSON.stringify({
        snapshot,
        culturalContext,
        snapshotReason,
        timestamp: new Date(),
        strategy: snapshotStrategy
      })
    )

    // Track snapshot in PostgreSQL for historical tracking
    await this.postgresClient.query(`
      INSERT INTO context_snapshots (
        snapshot_id, conversation_id, user_id, snapshot_data,
        cultural_context, snapshot_reason, snapshot_strategy,
        created_at, expires_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      snapshotId,
      conversationId,
      userId,
      snapshot.compressedData,
      culturalContext,
      snapshotReason,
      snapshotStrategy,
      new Date(),
      new Date(Date.now() + snapshotStrategy.expiration * 1000)
    ])

    return {
      success: true,
      snapshotId,
      snapshotSize: snapshot.size,
      compressionRatio: snapshot.compressionRatio,
      culturalElementsPreserved: snapshot.culturalElementsCount,
      professionalContextIncluded: snapshot.professionalContextIncluded,
      estimatedRecoveryAccuracy: snapshot.estimatedRecoveryAccuracy
    }
  }
}
```

### Cultural Context Preserver
```typescript
// Cultural Context Preservation Service
class CulturalContextPreserver {
  constructor() {
    this.culturalPatternExtractor = new IraqiCulturalPatternExtractor()
    this.islamicElementsExtractor = new IslamicElementsExtractor()
    this.regionalContextExtractor = new RegionalContextExtractor()
    this.languageContextExtractor = new LanguageContextExtractor()
  }

  async extractElements(
    options: {
      contextData: ConversationContext
      culturalContext: CulturalContext
      preservationLevel: 'basic' | 'full' | 'enhanced'
    }
  ): Promise<CulturalElements> {
    const { contextData, culturalContext, preservationLevel } = options

    // Extract Iraqi cultural patterns
    const culturalPatterns = await this.culturalPatternExtractor.extract({
      conversationContent: contextData.messages,
      userRegion: culturalContext.region,
      preservationLevel
    })

    // Extract Islamic compliance elements
    const islamicElements = await this.islamicElementsExtractor.extract({
      conversationContent: contextData.messages,
      complianceLevel: culturalContext.islamicComplianceLevel,
      preservationLevel
    })

    // Extract regional context
    const regionalContext = await this.regionalContextExtractor.extract({
      conversationContent: contextData.messages,
      region: culturalContext.region,
      preservationLevel
    })

    // Extract language usage patterns
    const languageContext = await this.languageContextExtractor.extract({
      conversationContent: contextData.messages,
      languagePreferences: culturalContext.languagePreferences,
      preservationLevel
    })

    // Create comprehensive cultural elements
    const culturalElements = {
      patterns: culturalPatterns.patterns,
      islamicElements: islamicElements.elements,
      regionalContext: regionalContext.context,
      languageContext: languageContext.patterns,

      // Preservation metadata
      preservationLevel,
      extractionTimestamp: new Date(),
      culturalScore: culturalPatterns.score,
      islamicComplianceScore: islamicElements.complianceScore,
      regionalRelevance: regionalContext.relevanceScore,
      languageConsistency: languageContext.consistencyScore,

      // Recovery assistance
      culturalContinuityMarkers: this.generateContinuityMarkers({
        culturalPatterns,
        islamicElements,
        regionalContext,
        languageContext
      }),

      // Compression helpers
      priorityElements: this.identifyPriorityElements({
        culturalPatterns,
        islamicElements,
        regionalContext,
        languageContext,
        preservationLevel
      })
    }

    return culturalElements
  }

  async validateCulturalContinuity(
    storedElements: CulturalElements,
    currentCulturalContext: CulturalContext,
    maxDrift: number = 0.15
  ): Promise<CulturalContinuityValidation> {
    // Compare cultural patterns
    const patternContinuity = await this.compareCulturalPatterns({
      storedPatterns: storedElements.patterns,
      currentContext: currentCulturalContext
    })

    // Compare Islamic compliance elements
    const islamicContinuity = await this.compareIslamicElements({
      storedElements: storedElements.islamicElements,
      currentContext: currentCulturalContext
    })

    // Compare regional context
    const regionalContinuity = await this.compareRegionalContext({
      storedContext: storedElements.regionalContext,
      currentRegion: currentCulturalContext.region
    })

    // Compare language patterns
    const languageContinuity = await this.compareLanguageContext({
      storedContext: storedElements.languageContext,
      currentLanguagePreferences: currentCulturalContext.languagePreferences
    })

    // Calculate overall drift
    const overallDrift = this.calculateOverallDrift({
      patternContinuity,
      islamicContinuity,
      regionalContinuity,
      languageContinuity
    })

    const continuityMaintained = overallDrift <= maxDrift

    return {
      continuityMaintained,
      driftScore: overallDrift,
      patternContinuity: patternContinuity.score,
      islamicContinuity: islamicContinuity.score,
      regionalContinuity: regionalContinuity.score,
      languageContinuity: languageContinuity.score,
      recommendations: continuityMaintained ? [] : this.generateContinuityRecommendations({
        patternContinuity,
        islamicContinuity,
        regionalContinuity,
        languageContinuity
      })
    }
  }
}
```

---

## DATABASE SCHEMA:

**Cross-session context persistence tables:**

```sql
-- Cross-Session Context Storage
CREATE TABLE cross_session_contexts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL,
    user_id UUID REFERENCES auth.users(id),

    -- Context data
    context_data JSONB NOT NULL,
    context_summary TEXT,
    context_vector vector(1536),

    -- Cultural context preservation
    cultural_context JSONB NOT NULL,
    cultural_patterns JSONB DEFAULT '{}',
    islamic_elements JSONB DEFAULT '{}',
    regional_context JSONB DEFAULT '{}',
    language_context JSONB DEFAULT '{}',

    -- Professional context preservation
    professional_context JSONB DEFAULT '{}',
    professional_domain VARCHAR(100),
    professional_elements JSONB DEFAULT '{}',

    -- Compression and storage
    compression_ratio DECIMAL(4,2),
    context_size_bytes INTEGER,
    compressed_size_bytes INTEGER,
    preservation_level VARCHAR(20) NOT NULL, -- basic, full, enhanced

    -- Recovery metadata
    cultural_integrity_score DECIMAL(3,2),
    professional_integrity_score DECIMAL(3,2),
    estimated_recovery_accuracy DECIMAL(3,2),
    recovery_complexity_score DECIMAL(3,2),

    -- Lifecycle management
    access_count INTEGER DEFAULT 0,
    last_accessed TIMESTAMP WITH TIME ZONE,
    context_priority INTEGER DEFAULT 5,
    auto_cleanup_enabled BOOLEAN DEFAULT true,

    -- Expiration
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Context Snapshots
CREATE TABLE context_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    snapshot_id VARCHAR(200) NOT NULL UNIQUE,
    conversation_id UUID NOT NULL,
    user_id UUID REFERENCES auth.users(id),

    -- Snapshot data
    snapshot_data JSONB NOT NULL,
    cultural_context JSONB NOT NULL,
    professional_context JSONB DEFAULT '{}',

    -- Snapshot metadata
    snapshot_reason VARCHAR(50) NOT NULL, -- automatic, manual, interruption, milestone
    snapshot_strategy JSONB NOT NULL,
    snapshot_size_bytes INTEGER,
    compression_ratio DECIMAL(4,2),

    -- Cultural preservation
    cultural_elements_count INTEGER DEFAULT 0,
    islamic_elements_preserved BOOLEAN DEFAULT true,
    regional_context_preserved BOOLEAN DEFAULT true,
    language_context_preserved BOOLEAN DEFAULT true,

    -- Professional preservation
    professional_context_included BOOLEAN DEFAULT false,
    professional_elements_count INTEGER DEFAULT 0,

    -- Recovery metadata
    estimated_recovery_accuracy DECIMAL(3,2),
    recovery_complexity INTEGER DEFAULT 1,

    -- Lifecycle
    access_count INTEGER DEFAULT 0,
    last_accessed TIMESTAMP WITH TIME ZONE,

    -- Expiration
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Context Recovery Attempts
CREATE TABLE context_recovery_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL,
    user_id UUID REFERENCES auth.users(id),

    -- Recovery details
    recovery_source VARCHAR(20) NOT NULL, -- redis, postgres, snapshot
    recovery_reason VARCHAR(100) NOT NULL,
    recovery_strategy VARCHAR(50) NOT NULL,

    -- Context details
    context_age_minutes INTEGER,
    cultural_drift_score DECIMAL(3,2),
    professional_context_available BOOLEAN DEFAULT false,

    -- Recovery results
    recovery_successful BOOLEAN NOT NULL,
    recovery_latency_ms INTEGER,
    cultural_continuity_maintained BOOLEAN,
    professional_continuity_maintained BOOLEAN,

    -- Accuracy metrics
    estimated_accuracy DECIMAL(3,2),
    actual_accuracy DECIMAL(3,2), -- if measured
    context_completeness DECIMAL(3,2),

    -- Error handling
    recovery_errors JSONB DEFAULT '[]',
    fallback_used BOOLEAN DEFAULT false,
    manual_intervention_required BOOLEAN DEFAULT false,

    -- Metadata
    recovery_metadata JSONB DEFAULT '{}',
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Context Persistence Performance
CREATE TABLE context_persistence_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),

    -- Performance period
    measurement_period VARCHAR(20) NOT NULL, -- minute, hour, day
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,

    -- Persistence metrics
    total_persistence_operations INTEGER DEFAULT 0,
    successful_persistence_operations INTEGER DEFAULT 0,
    average_persistence_latency_ms DECIMAL(8,2),
    average_compression_ratio DECIMAL(4,2),

    -- Recovery metrics
    total_recovery_attempts INTEGER DEFAULT 0,
    successful_recovery_attempts INTEGER DEFAULT 0,
    average_recovery_latency_ms DECIMAL(8,2),
    cultural_continuity_success_rate DECIMAL(3,2),

    -- Cultural preservation metrics
    cultural_integrity_maintenance_rate DECIMAL(3,2),
    islamic_compliance_preservation_rate DECIMAL(3,2),
    regional_context_preservation_rate DECIMAL(3,2),
    language_context_preservation_rate DECIMAL(3,2),

    -- Professional context metrics
    professional_context_preservation_rate DECIMAL(3,2),
    professional_continuity_success_rate DECIMAL(3,2),

    -- Storage efficiency
    average_context_size_bytes INTEGER,
    average_compressed_size_bytes INTEGER,
    storage_efficiency_score DECIMAL(3,2),

    -- User experience impact
    context_recovery_success_rate DECIMAL(3,2),
    user_experience_continuity_score DECIMAL(3,2),

    -- Metadata
    performance_metadata JSONB DEFAULT '{}',
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## DEVELOPMENT PATTERNS:

**Cross-session context persistence architecture patterns:**

### Context Persistence Patterns
- **Intelligent Snapshotting:** Strategic context snapshot creation at conversation milestones
- **Cultural Preservation:** Iraqi cultural context preservation patterns with Islamic compliance
- **Compression Strategies:** Context compression with cultural element preservation
- **Recovery Mechanisms:** Multi-tier context recovery with cultural continuity validation
- **Lifecycle Management:** Complete context lifecycle from creation to expiration

### Storage Optimization Patterns
- **Tiered Storage:** Redis for fast access, PostgreSQL for long-term persistence
- **Vector Embeddings:** Semantic context matching for related conversation recovery
- **Compression Algorithms:** Cultural-aware compression preserving important elements
- **Cleanup Strategies:** Intelligent context cleanup based on usage patterns and expiration
- **Performance Monitoring:** Context persistence performance tracking and optimization

---

## VALIDATION REQUIREMENTS:

**Cross-session context persistence validation:**

### Persistence Performance Testing
- **Context Storage:** <200ms context persistence operation testing
- **Context Recovery:** <300ms context recovery operation testing
- **Cultural Preservation:** >95% cultural element preservation accuracy testing
- **Compression Efficiency:** Context compression ratio and quality testing
- **Storage Optimization:** Storage efficiency and cleanup effectiveness testing

### Cultural Continuity Testing
- **Cultural Drift Detection:** Cultural context drift detection accuracy testing
- **Islamic Compliance Preservation:** Islamic compliance context preservation testing
- **Regional Context Maintenance:** Iraqi regional context preservation testing
- **Language Pattern Preservation:** Arabic-English language context preservation testing
- **Professional Context Continuity:** Professional domain context preservation testing

---

## INTEGRATION FOCUS:

**Cross-session context persistence integration points:**

### Foundation Integration
- **Context Management Foundation:** Integration with shared context validation and compression services
- **Cultural Validation Services:** Integration with Iraqi cultural validation and Islamic compliance
- **Vector Storage Services:** Integration with vector embedding generation and storage
- **Performance Monitoring:** Integration with system-wide performance monitoring

### Component Integration
- **WebSocket Management:** Context persistence integration with real-time WebSocket connections
- **Multi-device Sync:** Context persistence integration with cross-device synchronization
- **Cultural State Management:** Context persistence integration with cultural state transitions
- **Agent Communication:** Context persistence integration with PydanticAI agent context sharing

---

## ADDITIONAL NOTES:

**Iraqi AI Chat System context persistence considerations:**

- **Focus on cultural preservation** - Iraqi cultural context preservation across sessions
- **Emphasize recovery accuracy** - high-accuracy context recovery with cultural continuity
- **Plan for performance** - optimized context storage and retrieval operations
- **Keep focused scope** - ONLY context persistence, no real-time or synchronization logic

---

## TEMPLATE COMPLEXITY LEVEL:

- [ ] **Beginner-friendly** - Simple getting started patterns
- [x] **Intermediate** - Production-ready patterns with common features
- [ ] **Advanced** - Comprehensive patterns including complex scenarios
- [ ] **Enterprise** - Full enterprise patterns with monitoring, scaling, security

**Intermediate complexity selected** because cross-session context persistence requires context compression, cultural preservation, recovery mechanisms, and storage optimization while remaining focused on persistence operations only.

---

**This micro-initial provides focused requirements for cross-session context persistence ONLY, handling context storage, compression, cultural preservation, and recovery without implementing real-time WebSocket management, multi-device synchronization, or cultural state transition logic that belongs in other focused micro-initials.**