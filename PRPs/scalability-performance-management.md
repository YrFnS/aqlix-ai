name: "Scalability & Performance Management PRP v1.0"
description: |

## Purpose
Comprehensive production-ready scalability and performance system for the Iraqi AI Chat System that handles hundreds of concurrent users, optimizes OpenAI API costs through multi-key management, and maintains sub-3 second response times despite Iraq-to-US geographic latency.

## Core Principles
1. **Geographic Optimization**: Leverage Middle East cloud regions for minimal latency
2. **Cost Efficiency**: Stay under $500/month for 200 users through intelligent caching and API management
3. **Cultural Caching**: Cache Iraqi dialect recognition and cultural validation responses
4. **Resilient Architecture**: Graceful degradation when components fail
5. **Privacy Compliance**: 1-hour auto-expiry session management

---

## Goal
Build production-ready scalability infrastructure that supports 100+ concurrent Iraqi users with <3 second response times, maintains 99.9% uptime, and optimizes OpenAI API costs through multi-key rotation, intelligent Redis caching, and real-time monitoring.

## Why
- **Business Value**: Enable Iraqi AI system to scale from prototype to production
- **User Experience**: Provide fast, reliable service despite geographic latency challenges
- **Cost Control**: Maintain economically viable operation for Iraqi market ($2.50/user/month)
- **Cultural Optimization**: Cache repeated Iraqi cultural validation and professional responses
- **Operational Excellence**: Real-time monitoring and auto-scaling for stability

## What
A comprehensive scalability system with:
- Multi-API key rotation for increased OpenAI rate limits
- Redis semantic caching for Iraqi cultural responses (60%+ hit rate)
- Geographic optimization for Middle East latency reduction
- Real-time cost and performance monitoring with Prometheus/Grafana
- Auto-scaling based on custom metrics and usage patterns
- Rate limiting with Iraqi market considerations

### Success Criteria
- [ ] Support 100+ concurrent users with <3 second average response time
- [ ] Maintain OpenAI API costs under $500/month for 200 active users
- [ ] Achieve 99.9% uptime with automatic failover between API keys
- [ ] Cache hit rate >60% for Iraqi cultural and professional responses
- [ ] Geographic latency optimized to <500ms for Iraq-based users
- [ ] Real-time cost monitoring with alerts at $100/day threshold
- [ ] Arabic text processing overhead <100ms additional latency

## All Needed Context

### Documentation & References
```yaml
# MUST READ - OpenAI API Management
- url: https://platform.openai.com/docs/guides/rate-limits
  why: Understanding 2025 rate limits (3,500 RPM, 90,000 TPM for GPT-4)
  critical: Multiple API keys strategy for scaling beyond individual limits

- url: https://platform.openai.com/docs/guides/prompt-caching  
  why: OpenAI's prompt caching can reduce costs by 50% for repeated prompts
  critical: Iraqi cultural responses are perfect candidates for caching

- url: https://cookbook.openai.com/examples/how_to_handle_rate_limits
  why: Official patterns for rate limit handling and retry logic
  critical: Exponential backoff and queue management strategies

# Redis Caching & Geographic Optimization
- url: https://redis.io/blog/spring-release-2025/
  why: LangCache semantic caching for AI responses - private preview 2025
  critical: Can provide 50% cost reduction and significant latency improvements

- url: https://redis.io/docs/latest/operate/rc/supported-regions/
  why: Redis available in Middle East regions (UAE, Qatar, Bahrain)
  critical: Geographic distribution reduces latency for Iraqi users

# FastAPI Monitoring & Auto-scaling
- url: https://dev.to/ken_mwaura1/getting-started-monitoring-a-fastapi-app-with-grafana-and-prometheus-a-step-by-step-guide-3fbn
  why: Complete FastAPI monitoring setup with Prometheus/Grafana
  critical: prometheus-fastapi-instrumentator for automatic metrics

- url: https://medium.com/@pranavprakash4777/setting-up-prometheus-and-grafana-to-monitor-ai-api-usage-a66248ebe68f
  why: AI-specific monitoring patterns for cost and usage tracking
  critical: Token usage metrics for cost management

- url: https://agfianf.github.io/blog/2025/05/02/hands-on-auto-scaling-fastapi-with-kubernetes/
  why: Kubernetes HPA with custom Prometheus metrics for FastAPI
  critical: Auto-scaling based on application metrics, not just CPU

# Existing Codebase Patterns
- file: examples/main_agent_reference/settings.py
  why: pydantic-settings pattern for configuration management
  critical: Template for multi-API key and Redis configuration

- file: examples/backend/fastapi-pydantic-agent.py
  why: FastAPI + PydanticAI integration pattern
  critical: Shows dependency injection and streaming response patterns

- file: examples/streaming/openai-streaming-patterns.md
  why: Streaming implementation with error handling
  critical: Performance patterns for real-time responses
```

### Current Codebase Tree
```bash
Iraqi AI Chat System/
├── examples/
│   ├── backend/fastapi-pydantic-agent.py    # Basic FastAPI + PydanticAI
│   ├── main_agent_reference/
│   │   ├── settings.py                      # Configuration management
│   │   └── research_agent.py                # Production agent patterns
│   └── streaming/openai-streaming-patterns.md
├── PRPs/                                    # Product Requirement Prompts
└── CLAUDE.md                                # Project rules and conventions
```

### Desired Codebase Tree
```bash
Iraqi AI Chat System/
├── apps/
│   └── api/
│       ├── scalability/
│       │   ├── __init__.py
│       │   ├── settings.py                  # Multi-API key & Redis config
│       │   ├── api_key_manager.py           # API key rotation service
│       │   ├── cache_manager.py             # Redis semantic caching
│       │   ├── rate_limiter.py              # Per-user rate limiting
│       │   ├── monitoring.py                # Prometheus metrics
│       │   └── middleware.py                # FastAPI middleware integration
│       ├── routes/
│       │   └── health.py                    # Health checks with metrics
│       └── main.py                          # FastAPI app with scalability
├── monitoring/
│   ├── docker-compose.yml                  # Prometheus + Grafana + Redis
│   ├── prometheus.yml                      # Prometheus configuration
│   └── grafana/
│       ├── dashboards/                     # Iraqi AI dashboards
│       └── provisioning/                   # Auto-provisioned config
└── tests/
    ├── scalability/
    │   ├── test_api_key_rotation.py
    │   ├── test_caching.py
    │   ├── test_rate_limiting.py
    │   └── test_monitoring.py
    └── integration/
        └── test_scalability_integration.py
```

### Known Gotchas & Library Quirks
```python
# CRITICAL: OpenAI API key rotation
# - Each key has independent rate limits (3,500 RPM, 90,000 TPM)
# - Key rotation must handle in-flight requests gracefully
# - Monitor per-key usage to prevent exceeding limits

# CRITICAL: Redis semantic caching
# - LangCache requires similarity threshold tuning for Iraqi dialect
# - Cache keys must include cultural context to avoid inappropriate responses
# - TTL should balance freshness vs. cost savings (suggest 1-24 hours)

# CRITICAL: Geographic latency
# - Iraq users will hit UAE/Qatar regions (300-500ms base latency)
# - Connection pooling essential - reuse connections to minimize handshake overhead
# - Consider request batching for non-streaming operations

# CRITICAL: FastAPI middleware order matters
# - Rate limiting must come before API key selection
# - Metrics collection should wrap the entire request cycle
# - Error handling must preserve metrics even on failures

# CRITICAL: PydanticAI + FastAPI patterns
# - Use deps_type for dependency injection of scalability services
# - Streaming responses need special handling for metrics collection
# - Agent initialization expensive - use singleton pattern with DI
```

## Implementation Blueprint

### Data Models and Structure
```python
# Scalability configuration models
from pydantic_settings import BaseSettings
from pydantic import Field, ConfigDict
from typing import List, Optional
from enum import Enum

class UserTier(str, Enum):
    FREE = "free"
    PROFESSIONAL = "professional"
    PREMIUM = "premium"

class ScalabilitySettings(BaseSettings):
    model_config = ConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False
    )
    
    # Multi-API Key Configuration
    openai_api_keys: List[str] = Field(..., description="List of OpenAI API keys for rotation")
    openai_model: str = Field(default="gpt-4o", description="Default OpenAI model")
    
    # Redis Configuration
    redis_url: str = Field(..., description="Redis connection URL")
    redis_cluster_urls: Optional[List[str]] = Field(default=None, description="Redis cluster URLs for geo-distribution")
    cache_ttl_seconds: int = Field(default=3600, description="Default cache TTL")
    
    # Rate Limiting Configuration
    rate_limit_free: int = Field(default=10, description="Requests per minute for free tier")
    rate_limit_professional: int = Field(default=50, description="Requests per minute for professional tier")
    rate_limit_premium: int = Field(default=200, description="Requests per minute for premium tier")
    
    # Monitoring Configuration
    prometheus_metrics_enabled: bool = Field(default=True, description="Enable Prometheus metrics")
    cost_alert_threshold_daily: float = Field(default=100.0, description="Daily cost alert threshold in USD")
    
    # Geographic Optimization
    preferred_region: str = Field(default="middle-east", description="Preferred geographic region")
    connection_pool_size: int = Field(default=20, description="HTTP connection pool size")

# Rate limiting and usage tracking models
class UserUsage(BaseModel):
    user_id: str
    tier: UserTier
    requests_current_minute: int
    total_requests_today: int
    total_tokens_today: int
    estimated_cost_today: float
    last_request_time: datetime

class ApiKeyStatus(BaseModel):
    key_id: str
    is_active: bool
    requests_per_minute: int
    tokens_per_minute: int
    last_rotation_time: datetime
    error_count: int
```

### List of Tasks to Complete the PRP

```yaml
Task 1 - Configuration Setup:
CREATE apps/api/scalability/settings.py:
  - MIRROR pattern from: examples/main_agent_reference/settings.py
  - EXTEND with multi-API key, Redis, and monitoring configuration
  - ADD validation for API keys and Redis connectivity

Task 2 - API Key Management Service:
CREATE apps/api/scalability/api_key_manager.py:
  - IMPLEMENT round-robin rotation with health checking
  - ADD rate limit monitoring per key
  - INCLUDE automatic failover for failed keys
  - PRESERVE request context for proper error handling

Task 3 - Redis Caching Layer:
CREATE apps/api/scalability/cache_manager.py:
  - IMPLEMENT semantic caching for Iraqi cultural responses
  - ADD cache key strategy including cultural context
  - INCLUDE cache hit/miss metrics for monitoring
  - HANDLE cache failures gracefully with direct API fallback

Task 4 - Rate Limiting Middleware:
CREATE apps/api/scalability/rate_limiter.py:
  - IMPLEMENT sliding window rate limiting per user
  - ADD tier-based limits (free/professional/premium)
  - INCLUDE Redis-based distributed rate limiting
  - PRESERVE user experience with informative error messages

Task 5 - Monitoring and Metrics:
CREATE apps/api/scalability/monitoring.py:
  - IMPLEMENT Prometheus metrics collection
  - ADD custom metrics for cost, latency, cache hit rates
  - INCLUDE Iraqi-specific metrics (Arabic processing time, geographic latency)
  - INTEGRATE with FastAPI middleware for automatic collection

Task 6 - FastAPI Middleware Integration:
CREATE apps/api/scalability/middleware.py:
  - IMPLEMENT middleware stack for scalability features
  - ADD proper error handling and fallback mechanisms
  - INCLUDE request tracing for debugging
  - PRESERVE existing FastAPI patterns and performance

Task 7 - Health Monitoring Endpoints:
MODIFY apps/api/routes/health.py:
  - ADD comprehensive health checks for all scalability components
  - INCLUDE detailed status for API keys, Redis, and metrics
  - ADD cost monitoring and budget status endpoints
  - PRESERVE security - no sensitive information in responses

Task 8 - Main Application Integration:
MODIFY apps/api/main.py:
  - INTEGRATE scalability middleware stack
  - ADD dependency injection for PydanticAI agents
  - INCLUDE startup/shutdown lifecycle management
  - PRESERVE existing routing and functionality

Task 9 - Monitoring Infrastructure:
CREATE monitoring/docker-compose.yml:
  - ADD Prometheus, Grafana, and Redis services
  - CONFIGURE network connectivity and volumes
  - INCLUDE environment variable templating
  - SET UP automatic service discovery

Task 10 - Grafana Dashboards:
CREATE monitoring/grafana/dashboards/:
  - IMPLEMENT Iraqi AI specific dashboards
  - ADD real-time cost, performance, and usage monitoring
  - INCLUDE geographic latency and cache performance
  - SET UP alerting for budget and performance thresholds
```

## Per Task Implementation Details

### Task 1: Configuration Setup
```python
# apps/api/scalability/settings.py - Key implementation patterns

from pydantic_settings import BaseSettings
from typing import List, Optional
import redis
from dotenv import load_dotenv

class ScalabilitySettings(BaseSettings):
    # PATTERN: Validate API keys during initialization
    @field_validator("openai_api_keys")
    @classmethod
    def validate_api_keys(cls, v):
        if not v or len(v) < 2:
            raise ValueError("At least 2 OpenAI API keys required for rotation")
        return v
    
    # PATTERN: Test Redis connectivity on startup
    def validate_redis_connection(self) -> bool:
        try:
            r = redis.from_url(self.redis_url)
            r.ping()
            return True
        except Exception:
            return False

# CRITICAL: Environment variable naming convention
# OPENAI_API_KEYS="key1,key2,key3"  # Comma-separated for multiple keys
# REDIS_URL="redis://localhost:6379/0"
# REDIS_CLUSTER_URLS="redis://host1:6379,redis://host2:6379"  # For geo-distribution
```

### Task 2: API Key Management Service
```python
# apps/api/scalability/api_key_manager.py - Core rotation logic

import asyncio
from typing import List, Optional
import random
from datetime import datetime, timedelta

class ApiKeyManager:
    def __init__(self, api_keys: List[str]):
        self.api_keys = [{"key": key, "requests": 0, "errors": 0, "last_used": None} for key in api_keys]
        self.current_index = 0
    
    async def get_next_key(self) -> str:
        # PATTERN: Health-based selection with round-robin fallback
        available_keys = [k for k in self.api_keys if k["errors"] < 5]
        if not available_keys:
            # CRITICAL: Reset error counts if all keys are failing
            for key in self.api_keys:
                key["errors"] = 0
            available_keys = self.api_keys
        
        # GOTCHA: Use weighted selection based on current usage
        key_info = min(available_keys, key=lambda k: k["requests"])
        key_info["requests"] += 1
        key_info["last_used"] = datetime.now()
        
        return key_info["key"]
    
    async def report_error(self, api_key: str, error: Exception):
        # PATTERN: Track errors for automatic key rotation
        for key_info in self.api_keys:
            if key_info["key"] == api_key:
                key_info["errors"] += 1
                break
```

### Task 3: Redis Caching Layer
```python
# apps/api/scalability/cache_manager.py - Semantic caching patterns

import redis.asyncio as redis
import json
import hashlib
from typing import Optional, Any
import numpy as np
from sentence_transformers import SentenceTransformer

class IraqiCacheManager:
    def __init__(self, redis_url: str):
        self.redis = redis.from_url(redis_url)
        # CRITICAL: Load model for semantic similarity
        self.similarity_model = SentenceTransformer('all-MiniLM-L6-v2')
        self.similarity_threshold = 0.85  # Tunable for Iraqi dialect
    
    async def get_cached_response(self, prompt: str, context: dict) -> Optional[str]:
        # PATTERN: Include cultural context in cache key
        cache_key = self._generate_cache_key(prompt, context)
        
        # GOTCHA: Use semantic similarity for Iraqi dialect variations
        similar_key = await self._find_similar_cached_response(prompt, context)
        if similar_key:
            cached_data = await self.redis.get(similar_key)
            if cached_data:
                return json.loads(cached_data)["response"]
        
        return None
    
    def _generate_cache_key(self, prompt: str, context: dict) -> str:
        # CRITICAL: Include professional domain and cultural context
        key_data = {
            "prompt_hash": hashlib.md5(prompt.encode()).hexdigest(),
            "language": context.get("language", "arabic"),
            "professional_domain": context.get("professional_domain", "general"),
            "cultural_context": "iraqi"
        }
        return f"iraqi_ai_cache:{json.dumps(key_data, sort_keys=True)}"
    
    async def cache_response(self, prompt: str, response: str, context: dict, ttl: int = 3600):
        # PATTERN: Store with metadata for semantic search
        cache_key = self._generate_cache_key(prompt, context)
        cache_data = {
            "prompt": prompt,
            "response": response,
            "context": context,
            "timestamp": datetime.now().isoformat(),
            "embedding": self.similarity_model.encode(prompt).tolist()
        }
        await self.redis.setex(cache_key, ttl, json.dumps(cache_data))
```

### Integration Points
```yaml
DATABASE:
  - table: "user_usage" - Track per-user rate limiting and cost
  - index: "CREATE INDEX idx_user_usage_lookup ON user_usage(user_id, date)"
  - migration: "Add usage tracking tables for rate limiting"

CONFIG:
  - add to: apps/api/scalability/settings.py
  - pattern: "Environment-based configuration with validation"
  - critical: "Multi-environment support (dev/staging/prod)"

ROUTES:
  - add to: apps/api/main.py
  - pattern: "Middleware integration with dependency injection"
  - preserve: "Existing PydanticAI agent patterns"

MONITORING:
  - add to: monitoring/docker-compose.yml
  - pattern: "Full observability stack with geographic considerations"  
  - include: "Automated alerting for Iraqi-specific metrics"
```

## Validation Loop

### Level 1: Syntax & Style
```bash
# Run these FIRST - fix any errors before proceeding
ruff check apps/api/scalability/ --fix  # Auto-fix code style
mypy apps/api/scalability/             # Type checking
pytest tests/scalability/ -v --tb=short  # Unit tests

# Expected: No errors. If errors, READ the error message and fix.
```

### Level 2: Component Testing
```python
# CREATE tests/scalability/test_api_key_rotation.py
import pytest
from apps.api.scalability.api_key_manager import ApiKeyManager

@pytest.mark.asyncio
async def test_api_key_rotation():
    """Test API key rotation works correctly"""
    keys = ["key1", "key2", "key3"]
    manager = ApiKeyManager(keys)
    
    # Test round-robin distribution
    used_keys = set()
    for _ in range(6):
        key = await manager.get_next_key()
        used_keys.add(key)
    
    assert len(used_keys) == 3  # All keys should be used

@pytest.mark.asyncio 
async def test_cache_hit_rate():
    """Test caching improves performance"""
    from apps.api.scalability.cache_manager import IraqiCacheManager
    
    cache = IraqiCacheManager("redis://localhost:6379/1")
    prompt = "شلونك؟ شكو ماكو؟"  # Iraqi dialect greeting
    context = {"language": "arabic", "professional_domain": "general"}
    
    # First call should miss cache
    result1 = await cache.get_cached_response(prompt, context)
    assert result1 is None
    
    # After caching, should hit
    await cache.cache_response(prompt, "أهلاً وسهلاً، كلشي تمام", context)
    result2 = await cache.get_cached_response(prompt, context)
    assert result2 is not None

# CREATE tests/scalability/test_rate_limiting.py  
@pytest.mark.asyncio
async def test_rate_limiting_per_tier():
    """Test rate limiting respects user tiers"""
    from apps.api.scalability.rate_limiter import RateLimiter
    
    limiter = RateLimiter("redis://localhost:6379/1")
    
    # Free tier user should be limited to 10 requests/minute
    user_id = "test_free_user"
    tier = "free"
    
    # Should allow first 10 requests
    for i in range(10):
        allowed = await limiter.is_request_allowed(user_id, tier)
        assert allowed == True
    
    # 11th request should be denied
    allowed = await limiter.is_request_allowed(user_id, tier)
    assert allowed == False
```

### Level 3: Integration Testing
```bash
# Start the monitoring stack
docker-compose -f monitoring/docker-compose.yml up -d

# Start the FastAPI application with scalability
cd apps/api && uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Test multiple concurrent users (Iraqi usage simulation)
python tests/integration/test_concurrent_users.py

# Test geographic latency from Middle East regions
python tests/integration/test_geographic_performance.py

# Monitor metrics during testing
curl http://localhost:8000/metrics  # Prometheus metrics
curl http://localhost:8000/health   # Health status with costs
```

### Level 4: Iraqi-Specific Validation
```bash
# Test Iraqi dialect caching effectiveness
python tests/integration/test_iraqi_cultural_responses.py

# Test professional domain caching (legal, medical, educational)
python tests/integration/test_professional_domains.py

# Load test with 100+ concurrent Iraqi users
locust -f tests/performance/iraqi_user_simulation.py --host http://localhost:8000

# Validate cost targets (<$500/month for 200 users)
python tests/integration/test_cost_monitoring.py

# Test Arabic text processing performance (<100ms overhead)
python tests/performance/test_arabic_processing_latency.py
```

## Final Validation Checklist
- [ ] All unit tests pass: `pytest tests/scalability/ -v`
- [ ] No linting errors: `ruff check apps/api/scalability/`
- [ ] No type errors: `mypy apps/api/scalability/`
- [ ] Integration tests successful with real Redis and OpenAI
- [ ] Load testing: 100+ concurrent users with <3s response time
- [ ] Cost monitoring: Tracks actual OpenAI API usage and costs
- [ ] Cache hit rate: >60% for Iraqi cultural responses
- [ ] Geographic optimization: Latency reduced for Middle East users
- [ ] Monitoring dashboards: Real-time visibility into all metrics
- [ ] Error handling: Graceful degradation when components fail
- [ ] Documentation: All configuration options documented

---

## Anti-Patterns to Avoid
- ❌ Don't hardcode API keys - use environment configuration
- ❌ Don't ignore cache failures - implement graceful fallback
- ❌ Don't skip rate limiting - Iraqi market needs cost control
- ❌ Don't ignore geographic latency - optimize for Middle East
- ❌ Don't cache inappropriate responses - validate cultural context
- ❌ Don't skip monitoring - observability is critical for production
- ❌ Don't assume single-region deployment - plan for distribution
- ❌ Don't ignore Arabic text overhead - measure and optimize