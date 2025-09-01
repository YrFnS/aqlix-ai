---
name: "Web Search Integration System PRP"
description: "Comprehensive implementation of web search integration system for Iraqi AI Chat System with multi-provider support, cultural compliance, and Arabic language processing"
---

## Purpose
Build a comprehensive web search integration system that enables real-time information retrieval through multiple search providers (Tavily, Brave, Exa) with intelligent routing, Iraqi cultural validation, Arabic language optimization, and seamless PydanticAI agent integration.

## Core Principles
1. **Cultural Compliance First**: 95%+ Islamic compliance and Iraqi cultural appropriateness required
2. **Multi-Provider Resilience**: Intelligent routing with automatic fallback across multiple search APIs
3. **Arabic Language Excellence**: 99%+ RTL accuracy with Iraqi dialect recognition and enhancement
4. **Agent Integration**: Deep PydanticAI integration with specialized Iraqi AI agents
5. **Performance & Security**: <2s response time with comprehensive security validation

## Goal
Create an intelligent web search integration system that:
- Provides real-time web search through Tavily, Brave, and Exa APIs with automatic provider selection
- Maintains 95%+ Islamic compliance and cultural appropriateness for all search results
- Processes Arabic queries with 99%+ accuracy and Iraqi dialect enhancement  
- Integrates seamlessly with PydanticAI agents for enhanced AI responses
- Supports user toggle controls for web search enable/disable functionality
- Implements intelligent caching and performance optimization (<2s response time)
- Validates all search results for cultural sensitivity and political neutrality

## Why
- **Real-time Information Access**: Enable up-to-date information retrieval for Iraqi AI conversations
- **Cultural Relevance**: Ensure search results respect Iraqi cultural values and Islamic principles  
- **Global Knowledge with Local Context**: Access worldwide information while maintaining Iraqi relevance
- **Enhanced AI Responses**: Provide PydanticAI agents with current information for better responses
- **User Control**: Give users full control over web search functionality with clear toggle options
- **Resilient Architecture**: Multi-provider support prevents single points of failure

## What
A comprehensive web search integration system with multi-provider support, cultural validation pipeline, Arabic language processing, and PydanticAI agent integration.

### Success Criteria
- [ ] Multi-provider search integration (Tavily, Brave, Exa) with intelligent routing
- [ ] 95%+ Islamic compliance validation for all search results  
- [ ] 99%+ Arabic RTL text processing accuracy with Iraqi dialect enhancement
- [ ] <2s average search response time with intelligent caching
- [ ] User toggle controls for web search enable/disable functionality
- [ ] Cultural content filtering with political neutrality validation
- [ ] PydanticAI agent integration with @agent.tool decorators
- [ ] Comprehensive test coverage with cultural compliance scenarios

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- url: https://docs.tavily.com/documentation/api-reference/endpoint/search
  why: Complete Tavily API documentation for real-time search with advanced filtering
  critical: Supports max_results, search_depth=advanced, include_answer parameters
  
- url: https://api-dashboard.search.brave.com/app/documentation/web-search/codes
  why: Brave Search API reference with localization support and country codes
  critical: Supports country and search_lang parameters for Iraqi context
  
- url: https://docs.exa.ai/reference/search
  why: Exa API semantic search capabilities and neural network search
  critical: Embeddings-based search for better semantic understanding

- file: examples/kortix-suna-extracted/backend/agent/tools/web_search_tool.py
  why: Working Tavily API implementation with AsyncTavilyClient patterns
  pattern: Tool decorator, error handling, result processing, caching to filesystem
  
- file: examples/main_agent_reference/tools.py  
  why: Brave Search API implementation as pure function with proper validation
  pattern: httpx async client, rate limiting, country/language support
  
- file: examples/main_agent_reference/providers.py
  why: Provider configuration patterns for PydanticAI integration
  pattern: get_llm_model() function, environment-based configuration
  
- file: examples/iraqi-integration-framework/core/PaymentGatewayOrchestrator.ts
  why: Comprehensive cultural validation and Arabic language integration patterns
  pattern: ICulturalPaymentContext, nameArabic fields, Islamic compliance validation
  
- file: examples/ai-protocols-integration/iraqi-cultural-layer/payment-gateway.ts
  why: Islamic financial compliance validation and cultural appropriateness scoring
  pattern: IslamicFinanceRules, prohibited/required terms, fraud detection

- docfile: CLAUDE.md
  why: Iraqi AI system rules, mandatory agent delegation, cultural validation standards
  critical: payment-security-guardian and iraqi-cultural-validator agents are MANDATORY
```

### Current Codebase Tree
```bash
aqlix-ai/
├── examples/
│   ├── kortix-suna-extracted/backend/agent/tools/web_search_tool.py  # Tavily implementation
│   ├── main_agent_reference/tools.py                                 # Brave Search pure functions  
│   ├── main_agent_reference/providers.py                            # Provider configuration
│   ├── iraqi-integration-framework/core/PaymentGatewayOrchestrator.ts # Cultural patterns
│   └── ai-protocols-integration/iraqi-cultural-layer/payment-gateway.ts # Islamic compliance
├── .claude/agents/
│   ├── iraqi-cultural-validator.md       # Cultural validation (MANDATORY)
│   ├── arabic-rtl-processor.md           # Arabic processing (MANDATORY) 
│   ├── payment-security-guardian.md      # Security validation (MANDATORY)
│   └── external-service-coordinator.md   # Service orchestration
├── PRPs/templates/prp_base.md            # PRP template structure
└── CLAUDE.md                             # Project rules and mandatory agents
```

### Desired Codebase Tree with New Files
```bash
aqlix-ai/
├── packages/
│   └── web-search/                       # NEW: Web search package
│       ├── src/
│       │   ├── providers/                # Search provider implementations
│       │   │   ├── tavily-provider.py    # Tavily API integration
│       │   │   ├── brave-provider.py     # Brave Search integration  
│       │   │   └── exa-provider.py       # Exa API integration
│       │   ├── core/
│       │   │   ├── search-orchestrator.py # Unified search orchestration
│       │   │   ├── provider-selector.py   # Intelligent provider routing
│       │   │   ├── result-processor.py    # Search result standardization
│       │   │   └── cache-manager.py       # Intelligent caching system
│       │   ├── cultural/
│       │   │   ├── cultural-validator.py  # Iraqi cultural compliance
│       │   │   ├── arabic-processor.py    # Arabic query enhancement
│       │   │   └── content-filter.py      # Islamic content filtering
│       │   ├── types/
│       │   │   ├── search-types.py        # Search request/response types
│       │   │   ├── provider-types.py      # Provider configuration types
│       │   │   └── cultural-types.py      # Cultural validation types
│       │   └── tools/
│       │       ├── web-search-tool.py     # PydanticAI agent tool
│       │       └── search-agent.py        # Standalone search agent
│       ├── tests/
│       │   ├── providers/                 # Provider integration tests
│       │   ├── cultural/                  # Cultural compliance tests
│       │   └── performance/               # Performance benchmarks
│       └── package.json                   # Package dependencies
├── apps/
│   ├── api/
│   │   └── src/routes/search/             # NEW: Search API endpoints
│   │       ├── search.py                  # Main search endpoint
│   │       ├── toggle.py                  # User search toggle
│   │       └── status.py                  # Search status/health
│   └── web/
│       └── src/components/search/         # NEW: Search UI components
│           ├── SearchToggle.tsx           # Enable/disable controls
│           ├── SearchResults.tsx          # Results display
│           └── SearchSettings.tsx         # User preferences
└── migrations/                            # NEW: Database schema
    └── add_web_search_system.sql          # Search tables and indexes
```

### Known Gotchas & Library Quirks  
```python
# CRITICAL: All agents must use Iraqi-specialized agents per CLAUDE.md
# MANDATORY: iraqi-cultural-validator agent for 95%+ cultural compliance
# MANDATORY: arabic-rtl-processor agent for Arabic query processing
# MANDATORY: payment-security-guardian agent for search result security validation

# CRITICAL: Bun package manager required (30x faster than npm)
# Use 'bun install' and 'bun run' commands, never npm

# CRITICAL: PydanticAI @agent.tool pattern for agent integration
# Pattern: @agent.tool decorator with RunContext[SearchDependencies] 
# Pattern: Structured output with SearchResponse pydantic models

# CRITICAL: Tavily API requires AsyncTavilyClient with proper initialization
# Example: self.tavily_client = AsyncTavilyClient(api_key=self.tavily_api_key)
# Gotcha: search_depth="advanced" and include_answer="advanced" for best results

# CRITICAL: Brave Search API uses X-Subscription-Token header
# Example: headers = {"X-Subscription-Token": api_key}
# Gotcha: Rate limiting (429 errors) require exponential backoff retry

# CRITICAL: Cultural validation requires 95%+ compliance threshold
# Pattern: Extend ICulturalPaymentContext for search contexts
# Pattern: Islamic compliance checks for prohibited content

# CRITICAL: Arabic text processing requires proper RTL handling
# Pattern: nameArabic, descriptionArabic fields for all interfaces
# Pattern: Iraqi dialect recognition and enhancement required
```

## Implementation Blueprint

### Data Models and Structure

Create comprehensive data models ensuring type safety, cultural compliance, and multi-provider support.

```python
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Union, Literal
from datetime import datetime
from enum import Enum

# Cultural Context Models (extending existing patterns)
class ICulturalSearchContext(BaseModel):
    language: Literal['ar', 'en', 'mixed'] = 'mixed'
    dialect: Literal['iraqi', 'standard_arabic', 'mixed'] = 'iraqi'
    religious_context: bool = True
    business_context: Literal['government_service', 'commercial', 'educational', 'healthcare', 'general'] = 'general'
    cultural_sensitivity: Literal['low', 'medium', 'high'] = 'high'
    islamic_compliance_required: bool = True
    political_neutrality_required: bool = True

class ISearchCompliance(BaseModel):
    islamic_compliance: Dict[str, Union[bool, float, List[str]]] = Field(default_factory=lambda: {
        "score": 0.0,
        "halal_status": False, 
        "issues": [],
        "recommendations": []
    })
    cultural_appropriateness: Dict[str, Union[float, List[str]]] = Field(default_factory=lambda: {
        "score": 0.0,
        "language_accuracy": 0.0,
        "contextual_relevance": 0.0,
        "adjustments": []
    })
    political_neutrality: Dict[str, Union[bool, float, List[str]]] = Field(default_factory=lambda: {
        "score": 0.0,
        "neutral_status": False,
        "bias_indicators": [],
        "filtering_applied": []
    })

# Search Provider Models  
class SearchProvider(str, Enum):
    TAVILY = "tavily"
    BRAVE = "brave" 
    EXA = "exa"

class ISearchRequest(BaseModel):
    id: str = Field(default_factory=lambda: f"search_{int(datetime.now().timestamp())}")
    query: str
    query_arabic: Optional[str] = None
    enhanced_query: Optional[str] = None  # After Iraqi dialect processing
    max_results: int = 10
    search_depth: Literal['basic', 'advanced'] = 'advanced'
    cultural_context: ICulturalSearchContext
    user_preferences: Dict[str, any] = Field(default_factory=dict)
    preferred_provider: Optional[SearchProvider] = None
    fallback_providers: List[SearchProvider] = Field(default_factory=list)
    cache_enabled: bool = True
    timestamp: datetime = Field(default_factory=datetime.now)

class ISearchResult(BaseModel):
    title: str
    title_arabic: Optional[str] = None
    url: str
    description: str  
    description_arabic: Optional[str] = None
    relevance_score: float
    cultural_score: float
    provider: SearchProvider
    timestamp: datetime
    metadata: Dict[str, any] = Field(default_factory=dict)

class ISearchResponse(BaseModel):
    id: str
    request_id: str
    query: str
    enhanced_query: Optional[str] = None
    provider_used: SearchProvider
    results: List[ISearchResult]
    total_results: int
    processing_time_ms: int
    cultural_compliance: ISearchCompliance
    cache_hit: bool = False
    timestamp: datetime = Field(default_factory=datetime.now)
    errors: List[str] = Field(default_factory=list)

# Provider Configuration
class IProviderConfig(BaseModel):
    enabled: bool = True
    api_key: str
    api_endpoint: str
    rate_limit_per_minute: int = 60
    timeout_seconds: int = 30
    max_results_limit: int = 20
    supports_arabic: bool = False
    cultural_filtering_enabled: bool = False
    priority_score: int = 1
```

### List of Tasks to Complete (in order)

```yaml
Task 1: Multi-Provider Foundation Setup
CREATE packages/web-search/src/providers/:
  - IMPLEMENT TavilyProvider class with AsyncTavilyClient integration
  - IMPLEMENT BraveProvider class with httpx async client and rate limiting  
  - IMPLEMENT ExaProvider class with semantic search capabilities
  - MIRROR pattern from: examples/kortix-suna-extracted/backend/agent/tools/web_search_tool.py
  - PRESERVE async/await patterns and proper error handling

Task 2: Cultural Validation Pipeline  
CREATE packages/web-search/src/cultural/cultural-validator.py:
  - IMPLEMENT CulturalSearchValidator class
  - INTEGRATE with iraqi-cultural-validator agent (MANDATORY per CLAUDE.md)
  - EXTEND ICulturalPaymentContext pattern for search contexts
  - ADD Islamic compliance validation with 95%+ threshold requirement
  - PRESERVE cultural scoring methodology from existing payment examples

Task 3: Arabic Query Processing
CREATE packages/web-search/src/cultural/arabic-processor.py:
  - IMPLEMENT ArabicQueryProcessor class  
  - INTEGRATE with arabic-rtl-processor agent (MANDATORY per CLAUDE.md)
  - ADD Iraqi dialect recognition and query enhancement
  - IMPLEMENT RTL text processing with 99%+ accuracy requirement
  - PRESERVE nameArabic, descriptionArabic field patterns

Task 4: Search Orchestration Engine
CREATE packages/web-search/src/core/search-orchestrator.py:
  - IMPLEMENT UnifiedSearchOrchestrator class
  - ADD intelligent provider selection based on query type and availability
  - IMPLEMENT failover mechanism with fallback provider chains
  - ADD cultural validation integration at orchestration level
  - PRESERVE event-driven patterns from PaymentGatewayOrchestrator

Task 5: Provider Selection Intelligence
CREATE packages/web-search/src/core/provider-selector.py:
  - IMPLEMENT ProviderSelector class with scoring algorithm
  - ADD provider health monitoring and performance metrics
  - IMPLEMENT routing rules based on query characteristics
  - ADD cultural context consideration in provider selection
  - PRESERVE routing rule patterns from existing orchestrators

Task 6: Result Processing Pipeline
CREATE packages/web-search/src/core/result-processor.py:
  - IMPLEMENT ResultProcessor class for standardizing responses
  - ADD cultural compliance scoring for each search result
  - IMPLEMENT content filtering for Islamic compliance
  - ADD Arabic translation and RTL formatting for results
  - PRESERVE compliance validation patterns from existing systems

Task 7: Intelligent Caching System
CREATE packages/web-search/src/core/cache-manager.py:
  - IMPLEMENT CacheManager class with Redis integration
  - ADD query normalization and hash-based cache keys
  - IMPLEMENT expiration policies based on content type
  - ADD cache invalidation for culturally inappropriate content
  - PRESERVE performance optimization patterns

Task 8: PydanticAI Agent Integration
CREATE packages/web-search/src/tools/web-search-tool.py:
  - IMPLEMENT WebSearchTool class with @agent.tool decorator
  - ADD RunContext[SearchDependencies] for dependency injection
  - INTEGRATE with search orchestrator for seamless agent access
  - ADD structured output with ISearchResponse model validation
  - MIRROR pattern from: examples/main_agent_reference/tools.py

Task 9: Search API Endpoints
CREATE apps/api/src/routes/search/:
  - ADD /api/search endpoint for unified search processing
  - ADD /api/search/toggle endpoint for user preference management
  - ADD /api/search/status endpoint for system health monitoring
  - IMPLEMENT authentication and rate limiting
  - ADD comprehensive error handling with Arabic error messages

Task 10: User Interface Components
CREATE apps/web/src/components/search/:
  - BUILD SearchToggle component with RTL support and Arabic labels
  - BUILD SearchResults component with cultural compliance indicators
  - BUILD SearchSettings component for user preference management
  - ADD proper Arabic typography and RTL layout support
  - IMPLEMENT cultural-appropriate search result presentation

Task 11: Database Schema and Migration
CREATE migrations/add_web_search_system.sql:
  - ADD web_search_settings table for user preferences
  - ADD web_search_cache table for intelligent caching
  - ADD web_search_usage table for analytics and monitoring
  - ADD cultural_validation_log table for compliance audit trail
  - ADD proper indexes for performance optimization

Task 12: Security and Compliance Validation
ENHANCE packages/web-search/src/cultural/content-filter.py:
  - INTEGRATE payment-security-guardian agent (MANDATORY per CLAUDE.md)
  - ADD comprehensive content filtering for Islamic compliance
  - IMPLEMENT political neutrality validation
  - ADD fraud/malicious content detection for search results
  - PRESERVE security validation patterns from existing systems
```

### Per Task Pseudocode

```python
# Task 1: Multi-Provider Foundation Setup
class TavilyProvider(BaseSearchProvider):
    async def search(self, request: ISearchRequest) -> ISearchResponse:
        # PATTERN: Always validate cultural context first
        cultural_validation = await self.validate_cultural_context(request)
        if not cultural_validation.islamic_compliance.halal_status:
            raise CulturalComplianceError('Search query violates Islamic principles')
        
        # GOTCHA: Tavily requires AsyncTavilyClient with proper configuration
        search_response = await self.tavily_client.search(
            query=request.enhanced_query or request.query,
            max_results=request.max_results,
            search_depth=request.search_depth,
            include_answer="advanced"  # Critical for better results
        )
        
        # PATTERN: Standardize response format across all providers
        return self.format_unified_response(search_response, request)

# Task 2: Cultural Validation Pipeline
class CulturalSearchValidator:
    async def validate_search_request(self, request: ISearchRequest) -> ISearchCompliance:
        # PATTERN: Use Iraqi cultural validator agent (MANDATORY per CLAUDE.md)
        cultural_analysis = await self.cultural_validator_agent.validate(request.query)
        
        # CRITICAL: Islamic compliance score must meet 95%+ threshold
        islamic_score = await self.validate_islamic_compliance(request)
        if islamic_score < 95:
            return ISearchCompliance(
                islamic_compliance={
                    "score": islamic_score,
                    "halal_status": False,
                    "issues": ["Query contains prohibited Islamic content"],
                    "recommendations": ["Modify query to comply with Islamic principles"]
                }
            )
        
        # PATTERN: Political neutrality validation for Iraqi context
        political_analysis = await self.validate_political_neutrality(request)
        
        return ISearchCompliance(
            islamic_compliance={"score": islamic_score, "halal_status": True, "issues": [], "recommendations": []},
            cultural_appropriateness={"score": cultural_analysis.score, "language_accuracy": 95, "contextual_relevance": 88, "adjustments": []},
            political_neutrality={"score": political_analysis.score, "neutral_status": True, "bias_indicators": [], "filtering_applied": []}
        )

# Task 3: Arabic Query Processing  
class ArabicQueryProcessor:
    async def enhance_query(self, request: ISearchRequest) -> str:
        # PATTERN: Use Arabic RTL processor agent (MANDATORY per CLAUDE.md)
        arabic_analysis = await self.arabic_processor_agent.process(request.query)
        
        # GOTCHA: Iraqi dialect recognition requires specific processing
        if arabic_analysis.dialect == 'iraqi':
            enhanced_query = await self.enhance_iraqi_dialect(request.query)
            # Add cultural context terms for better Iraqi relevance
            enhanced_query += " Iraq Baghdad Middle East"
            
        # CRITICAL: All queries must support RTL with 99%+ accuracy
        rtl_processed = await self.process_rtl_text(enhanced_query)
        
        return enhanced_query

# Task 4: Search Orchestration Engine
class UnifiedSearchOrchestrator:
    async def orchestrate_search(self, request: ISearchRequest) -> ISearchResponse:
        # PATTERN: Always validate culturally first (non-negotiable)
        await self.cultural_validator.validate_search_request(request)
        
        # GOTCHA: Provider selection must consider Iraqi context and availability
        selected_provider = await self.provider_selector.select_optimal_provider(request)
        
        # CRITICAL: Implement retry with fallback providers
        @retry(attempts=3, backoff=exponential)
        async def _execute_search():
            try:
                return await selected_provider.search(request)
            except ProviderError:
                # Use fallback providers from configuration
                fallback_provider = await self.get_next_fallback_provider()
                return await fallback_provider.search(request)
        
        response = await _execute_search()
        
        # PATTERN: Post-process results for cultural compliance
        response.results = await self.filter_culturally_appropriate_results(response.results)
        
        return response
```

### Integration Points
```yaml  
DATABASE:
  - migration: "Add web_search_settings table with user_id, provider_preferences, cultural_settings"
  - index: "CREATE INDEX idx_search_cache ON web_search_cache(query_hash, cultural_context)"
  - constraint: "ADD CONSTRAINT check_islamic_compliance CHECK (islamic_compliant = true)"
  
CONFIG:
  - add to: packages/web-search/config/providers.py
  - pattern: "TAVILY_API_KEY = getEnvVar('TAVILY_API_KEY', 'required')"
  - pattern: "BRAVE_SEARCH_API_KEY = getEnvVar('BRAVE_SEARCH_API_KEY', 'required')"
  
AGENTS:
  - integrate: iraqi-cultural-validator agent for cultural compliance (MANDATORY)
  - integrate: arabic-rtl-processor agent for Arabic query processing (MANDATORY)  
  - integrate: payment-security-guardian agent for search result security (MANDATORY)
  - integrate: external-service-coordinator agent for provider orchestration
```

## Validation Loop

### Level 1: Syntax & Style
```bash
# Run these FIRST - fix any errors before proceeding  
bun run lint packages/web-search/src/**/*.py --fix    # Auto-fix what's possible
python -m mypy packages/web-search/src/               # Type checking
ruff check packages/web-search/src/ --fix             # Python style validation

# Expected: No errors. If errors, READ the error and fix.
```

### Level 2: Unit Tests - Search Integration
```python
# CREATE packages/web-search/tests/test_search_orchestrator.py
import pytest
from packages.web_search.src.core.search_orchestrator import UnifiedSearchOrchestrator
from packages.web_search.src.types.search_types import ISearchRequest, ICulturalSearchContext

def test_iraqi_search_with_cultural_validation():
    """Test search with Iraqi cultural context and Islamic compliance"""
    request = ISearchRequest(
        query="أفضل الجامعات في العراق",  # Best universities in Iraq
        cultural_context=ICulturalSearchContext(
            language='ar',
            dialect='iraqi', 
            islamic_compliance_required=True
        )
    )
    
    result = await orchestrator.orchestrate_search(request)
    
    assert result.cultural_compliance.islamic_compliance.halal_status == True
    assert result.cultural_compliance.islamic_compliance.score >= 95
    assert len(result.results) > 0
    assert all(r.cultural_score >= 95 for r in result.results)

def test_provider_fallback_mechanism():
    """Test automatic fallback when primary provider fails"""
    request = ISearchRequest(
        query="Baghdad weather today",
        preferred_provider=SearchProvider.TAVILY
    )
    
    # Mock primary provider failure
    with mock_provider_failure(SearchProvider.TAVILY):
        result = await orchestrator.orchestrate_search(request)
        
    assert result.provider_used != SearchProvider.TAVILY  # Used fallback
    assert result.cultural_compliance.islamic_compliance.score >= 95
    assert len(result.results) > 0

def test_arabic_query_enhancement():
    """Test Iraqi dialect recognition and query enhancement"""  
    request = ISearchRequest(
        query="شلونك صاحبي؟",  # Iraqi dialect: How are you my friend?
        cultural_context=ICulturalSearchContext(dialect='iraqi')
    )
    
    result = await orchestrator.orchestrate_search(request)
    
    assert result.enhanced_query != request.query  # Query was enhanced
    assert "Iraq" in result.enhanced_query or "Baghdad" in result.enhanced_query
    assert result.cultural_compliance.cultural_appropriateness.language_accuracy >= 99
```

### Level 3: Cultural Compliance Testing
```bash
# Test cultural validation with Iraqi agents
python -m pytest packages/web-search/tests/test_cultural_compliance.py -v

# Test specific cultural scenarios
python -m pytest packages/web-search/tests/test_islamic_compliance.py::test_prohibited_content_filtering -v
python -m pytest packages/web-search/tests/test_arabic_processing.py::test_iraqi_dialect_enhancement -v
python -m pytest packages/web-search/tests/test_political_neutrality.py::test_sectarian_neutrality -v

# Expected: 95%+ cultural compliance scores across all test scenarios
```

### Level 4: Agent Integration Validation
```bash
# Test PydanticAI agent integration
bun run test:search-agent

# Test mandatory agent integrations
python -c "
from packages.web_search.src.tools.web_search_tool import WebSearchTool
from pydantic_ai.models.test import TestModel

# Test iraqi-cultural-validator agent integration
tool = WebSearchTool()
result = await tool.validate_with_cultural_agent('test query')
assert result.islamic_compliance.score >= 95

# Test arabic-rtl-processor agent integration  
enhanced = await tool.enhance_with_arabic_agent('مرحبا')
assert enhanced.rtl_accuracy >= 99
"

# Expected: All mandatory agent integrations return success with required scores
```

### Level 5: Performance and Multi-Provider Testing
```bash
# Test search response time performance
python -c "
import time
from packages.web_search.src.core.search_orchestrator import UnifiedSearchOrchestrator

orchestrator = UnifiedSearchOrchestrator()
start_time = time.time()
result = await orchestrator.orchestrate_search(test_request)
response_time = (time.time() - start_time) * 1000

print(f'Search response time: {response_time:.2f}ms')
assert response_time < 2000, 'Search too slow - must be < 2s'
"

# Test multi-provider failover
python -c "
# Test Tavily -> Brave -> Exa fallback chain
providers = [SearchProvider.TAVILY, SearchProvider.BRAVE, SearchProvider.EXA]
for provider in providers:
    result = await test_provider_availability(provider)
    assert result.success or len(result.fallback_used) > 0
"

# Expected: <2s response time, successful fallback mechanisms working
```

## Final Validation Checklist
- [ ] All tests pass: `python -m pytest packages/web-search/tests/ -v`
- [ ] No linting errors: `bun run lint packages/web-search/`
- [ ] No type errors: `python -m mypy packages/web-search/src/`
- [ ] Cultural compliance >95%: Test with iraqi-cultural-validator agent
- [ ] Arabic processing >99%: Test with arabic-rtl-processor agent  
- [ ] Security validation complete: Test with payment-security-guardian agent
- [ ] Multi-provider integration working: All 3 providers (Tavily, Brave, Exa) functional
- [ ] Provider fallback mechanism: Primary failure triggers successful fallback
- [ ] Search performance <2s: Average response time meets requirement
- [ ] User toggle functionality: Enable/disable controls work correctly
- [ ] Islamic compliance filtering: All search results pass halal validation
- [ ] Political neutrality maintained: No sectarian or biased content
- [ ] Arabic UI translations: All search interface text available in Arabic
- [ ] RTL layout support: Proper right-to-left layout for Arabic content
- [ ] Documentation updated: API documentation includes all new search endpoints

---

## Anti-Patterns to Avoid
- ❌ Don't bypass cultural validation for "faster" search results
- ❌ Don't ignore provider fallback - implement proper error handling
- ❌ Don't skip mandatory agent integration - iraqi-cultural-validator is NON-NEGOTIABLE  
- ❌ Don't hardcode API keys - use secure environment configuration
- ❌ Don't assume single provider reliability - implement multi-provider resilience
- ❌ Don't ignore Arabic processing - proper RTL handling is required
- ❌ Don't cache culturally inappropriate content - validate before caching
- ❌ Don't return unfiltered search results - always apply cultural compliance filtering
- ❌ Don't ignore user preferences - respect search toggle and cultural settings
- ❌ Don't skip performance optimization - <2s response time is mandatory

---

## Implementation Confidence Score: 9/10

**Reasoning for 9/10 Score:**
- ✅ **Comprehensive Context**: Complete documentation URLs, proven codebase patterns, and cultural integration examples
- ✅ **Validated Technology Stack**: Researched Tavily, Brave, and Exa API capabilities with specific implementation patterns
- ✅ **Cultural Compliance Integration**: Mandatory agent usage and Islamic compliance validation built into every step
- ✅ **Existing Pattern Preservation**: Extends current Iraqi cultural types and validation without breaking changes  
- ✅ **Executable Validation Gates**: All tests and checks are runnable with proper environment setup
- ✅ **Multi-Provider Architecture**: Robust fallback mechanisms and intelligent provider selection
- ✅ **PydanticAI Integration**: Deep integration with agent tools and structured outputs
- ✅ **Performance Requirements**: Clear <2s response time goals with caching optimization
- ➖ **Minor Gap**: Real-world testing with actual Iraqi users needed for final 10/10 validation

This PRP provides everything needed for successful one-pass implementation of a comprehensive web search integration system that maintains Iraqi cultural compliance while providing global information access with intelligent multi-provider support.