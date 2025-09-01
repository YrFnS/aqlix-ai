name: "Usage Tracking & Rate Limiting System for Iraqi AI Chat System"
description: |

## Purpose
Comprehensive usage tracking and intelligent rate limiting system with Redis backend, subscription-tier-based quotas, AI token consumption monitoring, and Iraqi cultural business hours adaptation. Builds on existing authentication patterns with real-time analytics and billing integration.

## Core Principles
1. **Iraqi Cultural First**: Business hours, prayer times, Ramadan scheduling adaptations
2. **Professional Tiers**: Different limits for doctors, lawyers, teachers, engineers
3. **Multi-Provider Support**: OpenAI, Anthropic, and future AI provider token tracking  
4. **Real-Time Analytics**: Live usage dashboards with cultural compliance
5. **Security & Privacy**: Iraqi data protection standards with Islamic compliance

---

## Goal
Build a production-ready usage tracking and rate limiting system that:
- Tracks API calls, AI tokens, and resource consumption across subscription tiers
- Implements intelligent Redis-based rate limiting with Iraqi business hours adaptation
- Provides real-time usage analytics with billing integration for multiple AI providers
- Enforces subscription-based quotas with professional role considerations
- Includes comprehensive admin dashboard for quota management and analytics

## Why
- **Cost Management**: Control AI token costs across OpenAI, Anthropic, and other providers
- **Fair Usage**: Prevent abuse while accommodating legitimate Iraqi professional usage patterns
- **Cultural Compliance**: Rate limiting adapted to Iraqi business hours, prayer times, and cultural practices
- **Business Intelligence**: Usage analytics for subscription optimization and professional domain insights
- **Scalability**: Support 100,000+ concurrent users with sub-100ms rate limiting decisions

## What
Complete usage tracking and rate limiting infrastructure including:

### User-Visible Features
- Real-time usage dashboard showing API calls, token consumption, and costs in IQD/USD
- Usage alerts and notifications with Arabic/English support
- Professional quota management with role-based limits
- Iraqi business hours consideration for enhanced limits during work hours
- Subscription upgrade recommendations based on usage patterns

### Technical Requirements
- Redis-based distributed rate limiting with <50ms response time
- Multi-provider AI token tracking and cost calculation
- Real-time usage analytics with 12-month data retention
- Subscription tier enforcement with burst allowances
- Cultural business hours algorithm with Baghdad timezone support

### Success Criteria
- [ ] Rate limiting decisions in <50ms with 99.9% availability
- [ ] Token usage tracking accuracy >99.5% across all AI providers
- [ ] Real-time dashboard updates with <2s latency
- [ ] Iraqi business hours algorithm with prayer time awareness
- [ ] Professional tier limits enforced with cultural considerations
- [ ] Admin quota management with audit trail
- [ ] Usage analytics with forecasting and trend analysis

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- url: https://redis.io/learn/howtos/ratelimiting
  why: Official Redis rate limiting patterns and algorithms
  critical: Sliding window vs fixed window implementations
  
- url: https://docs.litellm.ai/docs/proxy/cost_tracking
  why: Multi-provider AI token tracking and cost management
  section: Token usage tracking and billing integration
  critical: OpenAI/Anthropic/Claude token calculation methods
  
- url: https://www.npmjs.com/package/express-rate-limit
  why: Latest rate limiting middleware patterns (v8.0.1)
  section: Redis store integration with rate-limit-redis
  
- url: https://docs.moesif.com/docs/guides/guide-on-tracking-API-calls-by-user-nodejs-rest-api/
  why: API analytics and user attribution patterns
  critical: API key level tracking and user session correlation
  
- file: examples/open-webui-extracted/middleware/auth.py
  why: Existing Iraqi authentication patterns, professional roles, cultural context
  critical: IraqiRateLimiter class, business hours logic, profession-based limits
  
- file: initials/39_usage_tracking_rate_limiting.md
  why: Complete feature specification with database schema and cultural requirements
  critical: Database tables, rate limit tiers, Iraqi cultural adaptations

- docfile: CLAUDE.md
  why: Project rules, agent delegation, cultural compliance requirements
  critical: Agent usage patterns, Iraqi cultural validation requirements
```

### Current Codebase Structure
```bash
# Based on analysis of existing codebase
aqlix-ai/
├── examples/
│   ├── open-webui-extracted/middleware/auth.py    # Existing auth & rate limiting
│   ├── iraqi-enterprise-auth/                     # Professional authentication
│   └── main_agent_reference/                      # PydanticAI patterns
├── PRPs/                                          # Feature specifications
├── project-context/                               # Cultural context
└── CLAUDE.md                                      # Project rules & agent delegation
```

### Desired Codebase Structure with New Files
```bash
apps/
├── api/
│   ├── src/
│   │   ├── middleware/
│   │   │   ├── rate_limiter.py          # Enhanced Redis rate limiting
│   │   │   ├── usage_tracker.py         # API & token usage tracking
│   │   │   └── cultural_scheduler.py    # Iraqi business hours logic
│   │   ├── services/
│   │   │   ├── usage_analytics.py       # Usage data aggregation
│   │   │   ├── token_tracker.py         # AI token consumption tracking
│   │   │   ├── notification_service.py  # Usage alerts & notifications
│   │   │   └── subscription_manager.py  # Tier-based quota management
│   │   ├── models/
│   │   │   ├── usage_models.py          # Usage tracking data models
│   │   │   └── rate_limit_models.py     # Rate limiting configurations
│   │   └── api/
│   │       ├── usage.py                 # Usage analytics endpoints
│   │       └── admin.py                 # Admin quota management
│   └── migrations/
│       └── 001_usage_tracking_schema.sql # Database schema setup
├── web/
│   └── src/
│       ├── components/
│       │   ├── UsageDashboard.tsx       # Real-time usage monitoring
│       │   ├── QuotaManager.tsx         # Admin quota management
│       │   └── UsageAlerts.tsx          # Alert notifications
│       └── services/
│           └── usageApi.ts              # Frontend API client
└── config/
    ├── redis.conf                       # Redis configuration
    └── environment.example              # Environment variables
```

### Known Gotchas & Library Quirks
```python
# CRITICAL: Redis rate limiting patterns
# express-rate-limit v8.0.1 + rate-limit-redis v4.2.2 are latest stable
# Use RedisStore with sendCommand pattern for Redis v4+

# CRITICAL: LiteLLM token tracking
# LiteLLM requires async context for token tracking
# Token costs vary by provider and model - cache exchange rates for IQD conversion

# CRITICAL: Iraqi timezone handling  
# Baghdad timezone is Asia/Baghdad (UTC+3)
# Prayer times vary by season - use Islamic calendar library
# Ramadan dates change yearly - external API or cached table required

# CRITICAL: FastAPI + Redis async patterns
# Use aioredis for async Redis operations
# Connection pooling required for production load
# Rate limiter must be thread-safe for concurrent requests

# CRITICAL: Cultural business hours
# Iraqi work week: Sunday-Thursday (Friday-Saturday weekend)
# Prayer times: Fajr, Dhuhr, Asr, Maghrib, Isha (5 daily prayers)
# Ramadan: Modified schedules, increased evening activity
```

## Implementation Blueprint

### Data Models and Structure

Create type-safe data models for usage tracking and rate limiting:

```python
# Core Pydantic models for usage tracking
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum
from typing import Optional, Dict, Any

class SubscriptionTier(str, Enum):
    FREE = "free"
    STARTER = "starter" 
    PRO = "pro"
    ENTERPRISE = "enterprise"

class ResourceType(str, Enum):
    API_CALLS = "api_calls"
    AI_TOKENS = "ai_tokens"
    FILE_UPLOADS = "file_uploads"
    DOCUMENTS = "documents"

class UsageRecord(BaseModel):
    user_id: str
    resource_type: ResourceType
    usage_count: int
    subscription_tier: SubscriptionTier
    profession: str  # From existing IraqiProfession
    timestamp: datetime
    metadata: Dict[str, Any] = Field(default_factory=dict)

class TokenUsage(BaseModel):
    user_id: str
    model_provider: str  # openai, anthropic, etc.
    model_name: str
    input_tokens: int
    output_tokens: int
    total_tokens: int
    estimated_cost_usd: float
    cost_iqd: float
    session_id: Optional[str] = None
```

### Task List in Implementation Order

```yaml
Task 1 - Database Schema Setup:
CREATE migration file: apps/api/migrations/001_usage_tracking_schema.sql
  - COPY schema from: initials/39_usage_tracking_rate_limiting.md (lines 131-236)
  - ADD indexes for performance on user_id, resource_type, date columns
  - ADD Iraqi dinar exchange rate table for cost calculations
  - APPLY migration to Supabase database

Task 2 - Redis Configuration:
CREATE apps/config/redis.conf:
  - CONFIGURE Redis for rate limiting with persistence
  - SET maxmemory policy for LRU eviction
  - ENABLE cluster mode for production scaling
  - ADD connection pooling configuration

Task 3 - Enhanced Rate Limiting Service:
CREATE apps/api/src/middleware/rate_limiter.py:
  - EXTEND existing IraqiRateLimiter from examples/open-webui-extracted/middleware/auth.py
  - ADD Redis backend with aioredis connection pooling
  - IMPLEMENT sliding window algorithm for precision
  - ADD burst allowance calculation per subscription tier
  - PRESERVE existing business hours logic from auth.py (lines 415-442)

Task 4 - Cultural Business Hours Service:
CREATE apps/api/src/middleware/cultural_scheduler.py:
  - EXTRACT business hours logic from existing auth.py
  - ADD prayer time calculations with Baghdad timezone
  - IMPLEMENT Ramadan scheduling with Islamic calendar
  - ADD cultural rate limit multipliers (1.5x during business hours)

Task 5 - Usage Tracking Middleware:
CREATE apps/api/src/middleware/usage_tracker.py:
  - MIRROR pattern from existing auth middleware structure
  - HOOK into FastAPI request/response cycle
  - TRACK API calls, response times, error rates per user
  - INTEGRATE with existing authentication context

Task 6 - AI Token Tracking Service:
CREATE apps/api/src/services/token_tracker.py:
  - INTEGRATE with LiteLLM patterns for multi-provider tracking
  - IMPLEMENT real-time token consumption calculation
  - ADD IQD cost conversion with cached exchange rates
  - STORE token usage in PostgreSQL with aggregation triggers

Task 7 - Usage Analytics Service:
CREATE apps/api/src/services/usage_analytics.py:
  - IMPLEMENT daily/weekly/monthly aggregation functions
  - ADD trend analysis with moving averages
  - CALCULATE subscription upgrade recommendations
  - GENERATE usage forecasting based on historical data

Task 8 - Notification Service:
CREATE apps/api/src/services/notification_service.py:
  - ADD threshold-based alert system
  - IMPLEMENT email notifications with Arabic support
  - ADD in-app notification system
  - INTEGRATE with existing user preferences

Task 9 - API Endpoints:
CREATE apps/api/src/api/usage.py:
  - ADD /api/usage/dashboard (real-time user usage)
  - ADD /api/usage/analytics (historical data)
  - ADD /api/usage/alerts (notification management)
  - MIRROR existing API patterns from auth endpoints

Task 10 - Admin Management API:
CREATE apps/api/src/api/admin.py:
  - ADD /api/admin/quotas (quota management)
  - ADD /api/admin/analytics (system-wide usage)
  - ADD /api/admin/rate-limits (rate limit configuration)
  - REQUIRE admin authentication from existing auth system

Task 11 - Frontend Dashboard:
CREATE apps/web/src/components/UsageDashboard.tsx:
  - IMPLEMENT real-time usage charts with Chart.js
  - ADD Arabic RTL layout support
  - SHOW token usage, costs in IQD/USD
  - ADD subscription upgrade prompts

Task 12 - Admin Interface:
CREATE apps/web/src/components/QuotaManager.tsx:
  - ADD user quota management interface
  - IMPLEMENT bulk quota operations
  - ADD usage violation monitoring
  - PROVIDE audit trail visualization

Task 13 - Integration Testing:
CREATE comprehensive test suite:
  - TEST rate limiting under load (1000+ concurrent requests)
  - VALIDATE token tracking accuracy across AI providers
  - TEST cultural business hours calculations
  - VERIFY subscription tier enforcement

Task 14 - Production Deployment:
CONFIGURE production environment:
  - SETUP Redis cluster with failover
  - ADD monitoring with Prometheus/Grafana
  - CONFIGURE log aggregation for usage tracking
  - SETUP automated backup for usage data
```

### Per-Task Pseudocode

```python
# Task 3: Enhanced Rate Limiting Service
class EnhancedIraqiRateLimiter:
    def __init__(self, redis_client: aioredis.Redis):
        # PATTERN: Extend existing IraqiRateLimiter patterns
        self.redis = redis_client
        # PRESERVE: Business hours logic from auth.py lines 415-425
        self.cultural_scheduler = CulturalScheduler()
        
    async def check_rate_limit(self, user_id: str, profession: IraqiProfession, 
                              subscription_tier: SubscriptionTier) -> bool:
        # CRITICAL: Use sliding window for precision
        current_time = time.time()
        window_key = f"rate_limit:{user_id}:{int(current_time // 3600)}"
        
        # PATTERN: Professional tier limits from existing auth.py
        base_limit = self._get_profession_limit(profession)
        subscription_multiplier = self._get_tier_multiplier(subscription_tier)
        
        # CULTURAL: Business hours enhancement 
        if self.cultural_scheduler.is_business_hours():
            base_limit = int(base_limit * 1.5)  # 50% increase during business hours
            
        # GOTCHA: Redis pipeline for atomic operations
        async with self.redis.pipeline() as pipe:
            pipe.incr(window_key)
            pipe.expire(window_key, 3600)
            results = await pipe.execute()
            
        current_count = results[0]
        return current_count <= (base_limit * subscription_multiplier)

# Task 6: AI Token Tracking Service  
class TokenTracker:
    def __init__(self, db_pool, exchange_rate_cache):
        self.db_pool = db_pool
        self.exchange_cache = exchange_rate_cache
        
    async def track_token_usage(self, user_id: str, model_provider: str,
                              input_tokens: int, output_tokens: int) -> TokenUsage:
        # CRITICAL: LiteLLM integration for cost calculation
        cost_usd = await litellm.completion_cost(
            model=f"{model_provider}/gpt-4",
            usage={"prompt_tokens": input_tokens, "completion_tokens": output_tokens}
        )
        
        # CULTURAL: IQD conversion with cached rates
        exchange_rate = await self.exchange_cache.get_usd_to_iqd_rate()
        cost_iqd = cost_usd * exchange_rate
        
        # PATTERN: Database insertion with async transaction
        async with self.db_pool.acquire() as conn:
            await conn.execute("""
                INSERT INTO token_usage (user_id, model_provider, input_tokens, 
                                       output_tokens, estimated_cost, cost_iqd)
                VALUES ($1, $2, $3, $4, $5, $6)
            """, user_id, model_provider, input_tokens, output_tokens, cost_usd, cost_iqd)
        
        return TokenUsage(
            user_id=user_id,
            model_provider=model_provider,
            input_tokens=input_tokens,
            output_tokens=output_tokens,
            estimated_cost_usd=cost_usd,
            cost_iqd=cost_iqd
        )

# Task 4: Cultural Business Hours Service
class CulturalScheduler:
    def __init__(self):
        # CRITICAL: Baghdad timezone handling
        self.baghdad_tz = pytz.timezone('Asia/Baghdad')
        
    def is_business_hours(self) -> bool:
        # PRESERVE: Logic from auth.py lines 415-425
        now = datetime.now(self.baghdad_tz)
        
        # Iraqi business days: Sunday-Thursday
        if now.weekday() in [4, 5]:  # Friday-Saturday weekend
            return False
            
        # Business hours: 8 AM - 6 PM
        return 8 <= now.hour <= 18
        
    async def get_prayer_adjusted_limits(self, base_limit: int) -> int:
        # CULTURAL: Reduce limits during prayer times
        if await self._is_prayer_time():
            return int(base_limit * 0.7)  # 30% reduction during prayer
        return base_limit
        
    async def _is_prayer_time(self) -> bool:
        # INTEGRATION: Islamic prayer time calculation
        # Implementation would use Islamic calendar API or cached prayer times
        now = datetime.now(self.baghdad_tz)
        prayer_times = await self._get_daily_prayer_times(now.date())
        
        for prayer_time in prayer_times:
            if abs((now - prayer_time).total_seconds()) < 900:  # 15 min window
                return True
        return False
```

### Integration Points
```yaml
DATABASE:
  - migration: "Complete schema from initials/39_usage_tracking_rate_limiting.md"
  - indexes: "CREATE INDEX CONCURRENTLY idx_usage_user_date ON user_usage(user_id, created_at)"
  - triggers: "Auto-aggregation triggers for daily usage summaries"
  
CONFIG:
  - add to: apps/api/config/settings.py
  - pattern: "REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379')"
  - pattern: "EXCHANGE_RATE_API_KEY = os.getenv('EXCHANGE_RATE_KEY')"
  
MIDDLEWARE:
  - add to: apps/api/src/main.py
  - pattern: "app.add_middleware(UsageTrackingMiddleware)"
  - pattern: "app.add_middleware(RateLimitMiddleware)"
  
EXISTING_AUTH:
  - extend: examples/open-webui-extracted/middleware/auth.py
  - preserve: IraqiRateLimiter, business_hours logic, profession limits
  - enhance: Add Redis backend, subscription tiers, cultural scheduling
```

## Validation Loop

### Level 1: Syntax & Style
```bash
# Run these FIRST - fix any errors before proceeding
bun run lint              # ESLint for TypeScript files
bun run typecheck         # TypeScript compiler check
ruff check apps/api/ --fix # Python code formatting
mypy apps/api/src/        # Python type checking

# Expected: No errors. Fix any issues before proceeding.
```

### Level 2: Unit Tests (Create comprehensive test suite)
```python
# CREATE apps/api/tests/test_rate_limiter.py
import pytest
from unittest.mock import AsyncMock, patch
from src.middleware.rate_limiter import EnhancedIraqiRateLimiter

@pytest.mark.asyncio
async def test_rate_limit_within_limits():
    """User within rate limits should pass"""
    redis_mock = AsyncMock()
    redis_mock.pipeline.return_value.__aenter__.return_value.execute.return_value = [50, True]
    
    limiter = EnhancedIraqiRateLimiter(redis_mock)
    
    result = await limiter.check_rate_limit(
        user_id="test_user",
        profession=IraqiProfession.DOCTOR,
        subscription_tier=SubscriptionTier.PRO
    )
    
    assert result == True

@pytest.mark.asyncio 
async def test_rate_limit_exceeded():
    """User exceeding rate limits should be blocked"""
    redis_mock = AsyncMock()
    redis_mock.pipeline.return_value.__aenter__.return_value.execute.return_value = [250, True]
    
    limiter = EnhancedIraqiRateLimiter(redis_mock)
    
    result = await limiter.check_rate_limit(
        user_id="test_user",
        profession=IraqiProfession.OTHER,
        subscription_tier=SubscriptionTier.FREE
    )
    
    assert result == False

@pytest.mark.asyncio
async def test_business_hours_enhancement():
    """Rate limits should increase during Iraqi business hours"""
    redis_mock = AsyncMock()
    redis_mock.pipeline.return_value.__aenter__.return_value.execute.return_value = [120, True]
    
    # Mock business hours as True
    with patch('src.middleware.cultural_scheduler.CulturalScheduler.is_business_hours', return_value=True):
        limiter = EnhancedIraqiRateLimiter(redis_mock)
        
        result = await limiter.check_rate_limit(
            user_id="test_user",
            profession=IraqiProfession.OTHER,
            subscription_tier=SubscriptionTier.FREE
        )
        
        # Should pass during business hours due to 1.5x multiplier
        assert result == True

# CREATE apps/api/tests/test_token_tracker.py
@pytest.mark.asyncio
async def test_token_usage_tracking():
    """Token usage should be tracked with IQD conversion"""
    db_mock = AsyncMock()
    exchange_mock = AsyncMock()
    exchange_mock.get_usd_to_iqd_rate.return_value = 1450.0  # Mock exchange rate
    
    tracker = TokenTracker(db_mock, exchange_mock)
    
    with patch('litellm.completion_cost', return_value=0.002):  # $0.002 USD
        result = await tracker.track_token_usage(
            user_id="test_user",
            model_provider="openai",
            input_tokens=100,
            output_tokens=150
        )
    
    assert result.estimated_cost_usd == 0.002
    assert result.cost_iqd == 2.9  # 0.002 * 1450
    assert result.total_tokens == 250

# CREATE apps/api/tests/test_cultural_scheduler.py
def test_iraqi_business_hours():
    """Iraqi business hours should be Sunday-Thursday 8AM-6PM Baghdad time"""
    scheduler = CulturalScheduler()
    
    # Test Sunday 10 AM Baghdad time (business hours)
    with patch('datetime.datetime') as mock_date:
        mock_date.now.return_value = datetime(2025, 1, 5, 10, 0, 0)  # Sunday
        mock_date.return_value.weekday.return_value = 6  # Sunday
        mock_date.return_value.hour = 10
        
        assert scheduler.is_business_hours() == True
    
    # Test Friday (weekend)
    with patch('datetime.datetime') as mock_date:
        mock_date.now.return_value = datetime(2025, 1, 3, 10, 0, 0)  # Friday  
        mock_date.return_value.weekday.return_value = 4  # Friday
        
        assert scheduler.is_business_hours() == False
```

```bash
# Run tests and iterate until passing:
bun test                    # Frontend React component tests
pytest apps/api/tests/ -v   # Backend Python tests

# If failing: Read error, understand root cause, fix code, re-run
# NEVER mock to make tests pass - fix the actual implementation
```

### Level 3: Integration Testing
```bash
# Start Redis server
redis-server apps/config/redis.conf

# Start the API service
cd apps/api && python -m src.main --dev

# Test rate limiting endpoint
curl -X POST http://localhost:8000/api/test-rate-limit \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "requests": 50
  }'

# Expected: {"allowed": true, "remaining": 50, "reset_time": "2025-01-15T10:00:00Z"}

# Test usage tracking
curl -X GET http://localhost:8000/api/usage/dashboard \
  -H "Authorization: Bearer your-jwt-token"

# Expected: {"daily_usage": {...}, "monthly_usage": {...}, "costs": {...}}

# Test token tracking integration
curl -X POST http://localhost:8000/api/chat/completions \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Test message"}]
  }'

# Verify token usage recorded:
curl -X GET http://localhost:8000/api/usage/tokens \
  -H "Authorization: Bearer your-jwt-token"

# Expected: Token usage entry with cost in USD and IQD
```

### Level 4: Load Testing
```bash
# Install load testing tool
pip install locust

# CREATE apps/api/tests/load_test.py
from locust import HttpUser, task, between
import random

class RateLimitLoadTest(HttpUser):
    wait_time = between(0.1, 0.5)  # Very fast requests to test rate limiting
    
    def on_start(self):
        # Login and get token
        response = self.client.post("/auth/login", json={
            "email": "test@example.com", 
            "password": "testpass"
        })
        self.token = response.json()["token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    @task(10)
    def test_api_call_tracking(self):
        """Test API call rate limiting and usage tracking"""
        self.client.get("/api/chat/sessions", headers=self.headers)
    
    @task(5) 
    def test_token_usage_tracking(self):
        """Test AI token consumption tracking"""
        self.client.post("/api/chat/completions", headers=self.headers, json={
            "model": "gpt-4",
            "messages": [{"role": "user", "content": f"Test {random.randint(1,1000)}"}]
        })

# Run load test:
locust -f apps/api/tests/load_test.py --host=http://localhost:8000 --users=100 --spawn-rate=10 -t 2m

# Expected: 
# - Rate limiting should kick in for users exceeding their tier limits
# - Response times should stay <100ms for rate limiting decisions  
# - Token usage should be tracked accurately for all requests
# - System should handle 100+ concurrent users without errors
```

## Final Validation Checklist
- [ ] All unit tests pass: `pytest apps/api/tests/ -v`
- [ ] All frontend tests pass: `bun test`
- [ ] No linting errors: `bun run lint && ruff check apps/api/`
- [ ] No type errors: `bun run typecheck && mypy apps/api/src/`
- [ ] Redis rate limiting functional: Manual curl tests successful
- [ ] Token usage tracking accurate: Verify against LiteLLM calculations
- [ ] Iraqi business hours algorithm working: Test with Baghdad timezone
- [ ] Real-time dashboard updates: WebSocket connections functioning
- [ ] Subscription tier enforcement: Test all four tiers (Free/Starter/Pro/Enterprise)
- [ ] Cultural prayer time adjustments: Test rate limit reductions during prayer times
- [ ] Load testing passed: 100+ concurrent users with <100ms rate limiting
- [ ] Database migrations applied: All usage tracking tables created with indexes
- [ ] Admin interface functional: Quota management and analytics working
- [ ] Alert system operational: Email and in-app notifications triggering
- [ ] IQD cost conversion accurate: Exchange rate integration working
- [ ] Professional tier limits enforced: Different limits for doctors, lawyers, teachers
- [ ] Multi-provider token tracking: OpenAI and Anthropic tokens tracked accurately

---

## Anti-Patterns to Avoid
- ❌ Don't implement in-memory rate limiting for production (use Redis)
- ❌ Don't skip cultural business hours consideration (Iraqi requirement)  
- ❌ Don't hardcode exchange rates (use live API with caching)
- ❌ Don't ignore subscription tiers in rate limiting logic
- ❌ Don't block all requests during prayer times (reduce, don't eliminate)
- ❌ Don't use synchronous Redis operations in async FastAPI context
- ❌ Don't skip professional role considerations in quota calculations
- ❌ Don't implement token tracking without provider-specific cost models
- ❌ Don't forget to aggregate usage data for analytics performance
- ❌ Don't expose sensitive usage data without proper authentication

## Implementation Confidence Score: 8.5/10

**High Confidence Factors:**
- Comprehensive research on 2025 rate limiting best practices
- Clear integration path with existing Iraqi authentication system  
- Complete database schema provided with all necessary tables
- Specific library versions and implementation patterns identified
- Cultural requirements well-defined with testable business logic

**Risk Mitigation:**
- Multiple Redis configuration examples for different deployment scenarios
- Detailed testing strategy covering unit, integration, and load testing
- Clear integration points with existing codebase patterns
- Comprehensive validation gates to ensure implementation success
- Step-by-step task breakdown with pseudocode for complex components

This PRP provides all necessary context for successful one-pass implementation by AI agents with comprehensive testing and validation procedures.