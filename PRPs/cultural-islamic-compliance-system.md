---
name: "Cultural & Islamic Compliance System"
description: "Comprehensive cultural and Islamic compliance validation system for Iraqi AI Chat System with multi-domain scoring, real-time validation, and PydanticAI integration"
initial_file: "initials/19_cultural_islamic_compliance_system.md"
complexity: "intermediate"
status: "ready_for_implementation"
---

## Purpose

Build a production-ready Cultural & Islamic Compliance System that validates all content and interactions for Iraqi cultural appropriateness and Islamic compliance. This system provides:

- **Unified validation pipeline** combining cultural and Islamic compliance checking
- **Multi-domain validators** for legal, medical, educational, business, and other professional contexts
- **Real-time validation** with <200ms response time for optimal UX
- **PydanticAI integration** allowing AI agents to validate content automatically
- **Database persistence** for validation results, rules, and user preferences
- **Comprehensive scoring** with dual-metric cultural and Islamic compliance scores

## Core Principles

1. **Islamic Principles Take Precedence**: When cultural-religious conflicts arise, Islamic principles override cultural practices
2. **Performance First**: <200ms validation response time for real-time user feedback
3. **Type Safety**: Leverage Pydantic models for all validation structures
4. **Production Ready**: Include comprehensive testing, security, and monitoring
5. **Respectful Guidance**: Provide educational feedback, not just rejection

## ⚠️ Implementation Guidelines: Keep It Focused

**IMPORTANT**: This is a SERVICE/LIBRARY that integrates WITH PydanticAI agents, not a standalone agent.

### What NOT to do:

- ❌ **Don't build a PydanticAI agent** - This is a validation service library
- ❌ **Don't create dozens of validators** - Start with core domains (Religious, Social, Family, Business, Government)
- ❌ **Don't over-engineer** - Follow proven patterns from `examples/gemini-cli-extracted/cultural-validation/`
- ❌ **Don't add unnecessary abstractions** - Keep validation logic simple and focused
- ❌ **Don't skip database integration** - Use Supabase schema from initial file

### What TO do:

- ✅ **Create focused service** - Build `apps/api/services/cultural_islamic_compliance.py`
- ✅ **Follow existing patterns** - Mirror structure from `examples/gemini-cli-extracted/cultural-validation/iraqi_cultural_compliance_system.py`
- ✅ **Integrate with Supabase** - Use provided database schema for persistence
- ✅ **Provide PydanticAI tool** - Create @agent.tool decorator for validation
- ✅ **Test comprehensively** - 95%+ cultural, 90%+ Islamic compliance in tests

## Goal

Create a comprehensive validation system that ensures all content in the Iraqi AI Chat System meets both Iraqi cultural standards and Islamic compliance requirements through automated validation, scoring, and educational feedback.

## Why

**Business Need**: Iraqi professionals and users require culturally and religiously appropriate AI interactions that respect Islamic values, Iraqi cultural norms, and professional domain standards.

**Technical Need**: Automated validation prevents culturally inappropriate or religiously non-compliant content from reaching users, reducing moderation burden and improving user trust.

**User Need**: Users need assurance that AI interactions align with their cultural values and religious principles, with educational guidance for improvement.

## What

### System Classification

- [x] **Validation Service**: Python service library for cultural and Islamic compliance
- [x] **Database-Backed**: Persistent storage for rules, results, and preferences
- [x] **API Integration**: FastAPI endpoints and middleware for validation
- [x] **Frontend Integration**: React hooks and components for real-time feedback
- [x] **PydanticAI Integration**: Tools for AI agents to validate content

### Core Validation Domains

**Cultural Domains** (from initial file):
- [x] Religious (Islamic principles)
- [x] Social (Iraqi norms)
- [x] Family (Family values)
- [x] Business (Business ethics)
- [x] Government (Government standards)
- [x] Educational (Educational standards)
- [x] Medical (Medical ethics)
- [x] Legal (Legal compliance)
- [x] Financial (Islamic finance)
- [x] Cultural Heritage (Iraqi traditions)

### Success Criteria

- [ ] <200ms validation response time for real-time feedback
- [ ] 95%+ cultural appropriateness score threshold
- [ ] 90%+ Islamic compliance score threshold
- [ ] 100% test coverage for core validators
- [ ] Database schema deployed to Supabase
- [ ] API endpoints functional with proper error handling
- [ ] PydanticAI integration working with test agents
- [ ] Frontend hooks providing real-time validation feedback
- [ ] Comprehensive documentation and usage examples

## All Needed Context

### Research Findings

**1. Islamic AI Ethics Standards (2025)**

From web research on Islamic compliance and AI:

```yaml
# Key Islamic AI Ethics Principles
islamic_ai_principles:
  scholarly_supervision:
    requirement: "AI systems must operate under Islamic scholarly supervision"
    application: "Ensure validator rules align with established Islamic jurisprudence"
    source: "https://www.researchgate.net/publication/393528993_Islamic_ethical_perspectives_on_AI_development_and_use"

  halal_technology:
    requirement: "Technology must operate in Halal and Tayyib manner"
    application: "Validation logic must honor Islamic ethical and moral codes"
    source: "https://medium.com/@lovefoods_54026/islamic-algorithms-navigating-the-digital-age-with-faith-and-ethics-e5e8e19fd4bd"

  ai_limitations:
    principle: "AI serves as supportive tool, not authoritative religious source"
    application: "Validator provides guidance but defers to human scholars for religious rulings"
    source: "https://www.researchgate.net/publication/393485067_From_Human_Scholars_to_AI_Fatwas"

  regional_variation:
    challenge: "Islamic jurisprudence varies by region and interpretation"
    application: "Support configurable compliance levels and regional variations"
    source: "Multiple sources on halal compliance challenges"
```

**2. Cultural Safety Framework (CROSS Benchmark 2025)**

From research on cultural validation systems:

```yaml
# CROSS Framework - 4 Dimensions of Cultural Safety
cross_dimensions:
  cultural_awareness:
    definition: "Recognition of cultural differences and sensitivities"
    measurement: "Detection of culturally significant content and context"
    best_performance: "61.79% (2025 benchmark)"
    target: "80%+ for Iraqi AI system"

  norm_education:
    definition: "Understanding and explaining cultural norms"
    measurement: "Quality of educational feedback and recommendations"
    application: "Provide learning-oriented guidance, not just rejection"

  compliance:
    definition: "Adherence to cultural and religious standards"
    measurement: "Alignment with Iraqi cultural and Islamic principles"
    best_performance: "37.73% (2025 benchmark)"
    target: "95%+ cultural, 90%+ Islamic for Iraqi AI system"

  helpfulness:
    definition: "Practical utility of cultural guidance"
    measurement: "User satisfaction with recommendations and alternatives"
    application: "Suggest culturally appropriate alternatives when content fails validation"

source: "https://arxiv.org/html/2505.14972v1 - Multimodal Cultural Safety: Evaluation Frameworks and Alignment Strategies"
```

**3. Supabase Validation Patterns (2025)**

```yaml
# Supabase/PostgreSQL Validation Strategies
supabase_validation:
  check_constraints:
    pattern: "ALTER TABLE table_name ADD CONSTRAINT constraint_name CHECK (condition)"
    application: "Enforce cultural score thresholds at database level"
    example: "CHECK (cultural_score >= 0.7 AND islamic_score >= 0.8)"
    source: "https://bootstrapped.app/guide/how-to-perform-data-validation-in-supabase"

  database_triggers:
    pattern: "CREATE TRIGGER before validation logic"
    application: "Auto-validate content before insert/update"
    benefit: "Centralized validation logic, consistent enforcement"
    source: "https://bootstrapped.app/guide/how-to-perform-data-validation-in-supabase"

  row_level_security:
    pattern: "CREATE POLICY for fine-grained access control"
    application: "Users only see validation results for their own content"
    benefit: "Privacy protection for cultural compliance data"
    source: "https://supabase.com/docs/guides/database/postgres/row-level-security"

  soc2_compliance:
    standard: "Supabase is SOC 2 compliant"
    application: "Leverage Supabase security for cultural compliance data protection"
    source: "https://supabase.com/docs/guides/security/soc-2-compliance"
```

### Codebase Reference Implementations

**1. Comprehensive Cultural Validator** (Use as primary reference):

```yaml
path: examples/gemini-cli-extracted/cultural-validation/iraqi_cultural_compliance_system.py
why: Most comprehensive reference implementation with domain validators
patterns:
  - CulturalValidationResult dataclass with scores and issues
  - IraqiCulturalValidator with domain-specific validators
  - ArabicLanguageProcessor for dialect detection
  - IslamicComplianceValidator with prohibited/encouraged keywords
  - Async validation pipeline with preprocessing
  - UI-specific validation for components and color schemes
key_learnings:
  - Use enum for domains, principles, and severity levels
  - Implement separate validator per domain (composition pattern)
  - Provide detailed recommendations with each issue
  - Track confidence scores for validation quality
  - Support both content and UI component validation
line_references:
  - "26-40: CulturalDomain enum with 10 domains"
  - "41-54: IslamicPrinciple enum with core principles"
  - "66-113: CulturalValidationResult with add_issue() method"
  - "156-282: IraqiCulturalValidator.validate_content() async method"
  - "455-564: _load_islamic_principles() with prohibited/encouraged keywords"
```

**2. Cultural Context Manager Service** (Production patterns):

```yaml
path: apps/api/services/cultural_context_manager.py
why: Production-ready service with prayer times and regional greetings
patterns:
  - Region-based greeting variations (Iraqi dialect)
  - Prayer time integration with MFA delay logic
  - Professional domain titles and etiquette levels
  - Islamic compliance level preferences
  - JWT cultural metadata for sessions
key_learnings:
  - Use zoneinfo for Iraq timezone (Asia/Baghdad)
  - Integrate with prayer times service for respectful timing
  - Support regional dialect variations (Baghdad, Basra, Mosul, Erbil)
  - Provide both Arabic and English greetings
  - Include professional context in cultural decisions
line_references:
  - "13-40: IraqiRegion, IslamicComplianceLevel, TimeOfDay enums"
  - "84-93: IRAQ_TIMEZONE and PRAYER_TIMES configuration"
  - "96-102: REGIONAL_GREETINGS with Iraqi dialect variations"
  - "104-111: PROFESSIONAL_TITLES by domain"
  - "206-258: should_delay_mfa() with prayer time respect"
```

**3. AutoGen Cultural Validator** (Multi-agent patterns):

```yaml
path: examples/autogen-extracted/core/iraqi_enhancements/cultural_validator.py
why: Shows validation in multi-agent context with hierarchy
patterns:
  - Message-level and conversation-level validation
  - Professional hierarchy respect checking
  - Domain-specific requirements validation
  - Cultural sensitivity pattern detection
  - Multi-agent coordination with Iraqi hierarchy
key_learnings:
  - Validate individual messages AND full conversations
  - Check appropriate respect based on sender role
  - Detect sensitive patterns (sectarian, political, tribal)
  - Provide domain-specific cultural guidelines
  - Support professional hierarchy in Iraqi context
line_references:
  - "38-48: CulturalValidationResult dataclass"
  - "144-234: validate_message_content() with hierarchy respect"
  - "235-310: validate_multi_agent_conversation() for conversation-level"
  - "312-354: get_cultural_guidelines() per professional domain"
  - "456-557: IraqiProfessionalHierarchy class for agent coordination"
```

**4. PydanticAI Integration Patterns**:

```yaml
path: examples/main_agent_reference/research_agent.py
why: Shows how to create tools for PydanticAI agents
patterns:
  - @agent.tool decorator for RunContext integration
  - Dataclass dependencies for external services
  - Async tool functions with proper error handling
  - Tool invocation from agent with context passing
key_learnings:
  - Create @agent.tool functions for validation
  - Pass validator as dependency via RunContext
  - Return structured results (Dict/List) from tools
  - Handle errors gracefully in tools
line_references:
  - "42-50: ResearchAgentDependencies dataclass"
  - "52-55: Agent initialization with deps_type"
  - "58-86: @research_agent.tool decorator pattern"
  - "88-100: Tool calling another agent (composition)"

path: examples/main_agent_reference/settings.py
why: Environment-based configuration pattern
patterns:
  - pydantic-settings for environment variables
  - load_dotenv() for .env file loading
  - Field validators for API keys
  - ConfigDict for case-insensitive env vars
line_references:
  - "9-12: load_dotenv() before Settings class"
  - "15-21: Settings class with model_config"
  - "39-45: field_validator for API key validation"

path: examples/main_agent_reference/providers.py
why: Model provider abstraction pattern
patterns:
  - get_llm_model() function for model configuration
  - Environment-based model selection
  - Provider initialization with settings
line_references:
  - "12-29: get_llm_model() implementation"
```

### Database Schema (from initial file)

**Complete schema provided in `initials/19_cultural_islamic_compliance_system.md`**:

```sql
-- Key tables to implement (see initial file for full schema):
-- 1. cultural_islamic_rules (lines 181-197)
-- 2. content_validation_results (lines 199-217)
-- 3. user_compliance_preferences (lines 219-234)
-- 4. compliance_violations (lines 236-251)
-- 5. cultural_islamic_knowledge (lines 253-272)
```

### Common Pitfalls (from research)

```yaml
# Validation System Pitfalls
implementation_gotchas:
  performance:
    issue: "Cultural validation can become slow with many domains"
    research: "CROSS framework shows best models at 61.79% awareness"
    solution: "Cache validation results, use async processing, optimize regex patterns"
    target: "<200ms per validation from requirements"

  score_calibration:
    issue: "Arbitrary scoring thresholds may not reflect real compliance"
    research: "CROSS compliance at only 37.73% shows difficulty"
    solution: "Test with real Iraqi content, iterate thresholds, provide confidence scores"
    target: "95% cultural, 90% Islamic from requirements"

  regional_variation:
    issue: "Iraqi cultural norms vary by region (Baghdad, Basra, Mosul, Erbil)"
    research: "Islamic jurisprudence varies by region per halal compliance research"
    solution: "Support regional configurations, allow user preferences"
    reference: "cultural_context_manager.py lines 96-102 for regional greetings"

  islamic_authority:
    issue: "AI cannot be authoritative source for religious rulings"
    research: "Islamic ethics research shows AI must defer to human scholars"
    solution: "Provide guidance, not fatwas. Include disclaimers for religious content"
    reference: "See Islamic AI ethics research findings above"

  database_performance:
    issue: "Large validation result tables can slow queries"
    research: "Supabase RLS adds query overhead"
    solution: "Index content_hash, add TTL for validation results, use materialized views"
    reference: "content_validation_results.expires_at field for cache expiration"
```

## Implementation Blueprint

### Technology Research Phase

**RESEARCH COMPLETED** - See "All Needed Context" section above for:
- ✅ Islamic AI ethics principles and standards
- ✅ Cultural safety frameworks (CROSS benchmark)
- ✅ Supabase validation patterns (RLS, triggers, constraints)
- ✅ Reference implementations from codebase
- ✅ PydanticAI integration patterns
- ✅ Common pitfalls and solutions

### Implementation Task Breakdown

```yaml
Task 1 - Database Schema Setup (Supabase):
  IMPLEMENT database migrations:
    - Create tables from initials/19_cultural_islamic_compliance_system.md lines 181-272
    - cultural_islamic_rules table with rule_config JSONB
    - content_validation_results table with cultural_score and islamic_score
    - user_compliance_preferences table for user-specific settings
    - compliance_violations table for tracking issues
    - cultural_islamic_knowledge table for knowledge base

  CREATE Supabase policies:
    - RLS policies for user-specific validation results
    - Check constraints for score thresholds (>= 0.0, <= 1.0)
    - Indexes on content_hash for fast lookups
    - TTL trigger for expired validation results

  REFERENCE:
    - Supabase RLS patterns: https://supabase.com/docs/guides/database/postgres/row-level-security
    - Database triggers: bootstrapped.app guide on data validation
    - Check constraints: ALTER TABLE ADD CONSTRAINT pattern

  VALIDATION:
    - Run migration successfully on Supabase
    - Insert test rules and verify schema
    - Test RLS policies with different users
    - Verify indexes improve query performance

Task 2 - Core Validation Service:
  CREATE apps/api/services/cultural_islamic_compliance.py:
    - Follow pattern from examples/gemini-cli-extracted/cultural-validation/iraqi_cultural_compliance_system.py
    - CulturalDomain, IslamicPrinciple, ValidationSeverity enums
    - CulturalValidationResult Pydantic model (not dataclass)
    - CulturalValidationConfig Pydantic model for configuration
    - IraqiCulturalValidator main class

  IMPLEMENT domain validators:
    - IslamicComplianceValidator (reference: gemini-cli lines 647-679)
    - SocialNormsValidator (reference: gemini-cli lines 681-700)
    - FamilyValuesValidator (reference: gemini-cli lines 703-733)
    - BusinessEthicsValidator, GovernmentStandardsValidator, etc.
    - Each validator implements validate() method returning float score

  IMPLEMENT ArabicLanguageProcessor:
    - analyze_text() method for Arabic percentage calculation
    - _is_arabic_char() using Unicode ranges (0x0600-0x06FF, etc.)
    - _detect_iraqi_dialect() with Iraqi markers (شلونك, شكو, ماكو)
    - ArabicAnalysis dataclass with percentage, rtl_required, dialect

  IMPLEMENT validation pipeline:
    - async validate_content() main entry point
    - Preprocess content (Unicode normalization)
    - Parallel validation across enabled domains
    - Aggregate scores (weighted average)
    - Generate recommendations based on results
    - Cache results in database

  REFERENCE:
    - Main pattern: examples/gemini-cli-extracted/cultural-validation/iraqi_cultural_compliance_system.py
    - Production service: apps/api/services/cultural_context_manager.py
    - Islamic principles: _load_islamic_principles() lines 455-519

  VALIDATION:
    - Unit test each domain validator
    - Test Arabic language processor with Iraqi dialect
    - Validate <200ms response time
    - Test cultural and Islamic score thresholds

Task 3 - Supabase Integration:
  CREATE apps/api/services/cultural_islamic_db.py:
    - async save_validation_result() to content_validation_results
    - async load_validation_result() with cache lookup by content_hash
    - async get_user_preferences() from user_compliance_preferences
    - async save_compliance_violation() for tracking issues
    - async get_cultural_rules() from cultural_islamic_rules

  IMPLEMENT caching strategy:
    - Hash content with SHA-256 for cache key
    - Check cache before running validation
    - Set expires_at timestamp (24 hours default)
    - Periodic cleanup of expired results

  REFERENCE:
    - Supabase Python client: from supabase import create_client
    - RLS automatic enforcement when using service role
    - JSONB queries for rule_config filtering

  VALIDATION:
    - Test database operations work
    - Verify cache hit/miss logic
    - Test RLS policies enforce user isolation
    - Performance test database queries <50ms

Task 4 - PydanticAI Integration:
  CREATE apps/api/agents/tools/cultural_validation_tool.py:
    - @agent.tool async def validate_cultural_compliance()
    - RunContext parameter for dependency injection
    - Call IraqiCulturalValidator from context
    - Return structured validation result

  CREATE dependency class:
    - CulturalValidationDependencies dataclass
    - Include IraqiCulturalValidator instance
    - Include database connection for caching

  EXAMPLE agent integration:
    - Show how to add tool to existing agents
    - Demonstrate using validation before generating responses
    - Handle validation failures gracefully

  REFERENCE:
    - Tool pattern: examples/main_agent_reference/research_agent.py lines 58-86
    - Dependencies: examples/main_agent_reference/research_agent.py lines 42-50
    - Agent initialization: Agent(deps_type=DepsType) pattern

  VALIDATION:
    - Test tool works when called by agent
    - Verify dependency injection
    - Test validation integration with test agent
    - Ensure async execution works properly

Task 5 - FastAPI Endpoints:
  CREATE apps/api/routes/cultural_compliance.py:
    - POST /api/cultural-compliance/validate - validate content
    - GET /api/cultural-compliance/rules - get validation rules
    - GET /api/cultural-compliance/preferences - get user preferences
    - PUT /api/cultural-compliance/preferences - update preferences
    - GET /api/cultural-compliance/history - get validation history

  IMPLEMENT middleware:
    - Auto-validation middleware for content endpoints
    - WebSocket endpoint for real-time validation
    - Rate limiting for validation requests

  REFERENCE:
    - FastAPI patterns from apps/api/routes/
    - Existing middleware in apps/api/
    - Cultural context from apps/api/services/cultural_context_manager.py

  VALIDATION:
    - Test all endpoints with Postman/curl
    - Verify authentication and authorization
    - Test WebSocket real-time validation
    - Performance test under load

Task 6 - Frontend Integration (React/Next.js):
  CREATE packages/features/cultural-compliance/:
    - hooks/useCulturalValidation.ts - React hook for validation
    - hooks/useCompliancePreferences.ts - user preferences hook
    - components/ComplianceScoreDisplay.tsx - score visualization
    - components/ComplianceFeedback.tsx - feedback UI
    - components/ComplianceRecommendations.tsx - recommendations

  IMPLEMENT real-time validation:
    - Debounced validation on content input
    - WebSocket connection for instant feedback
    - Visual indicators (green/yellow/red) for scores
    - Tooltip explanations for issues

  REFERENCE:
    - Existing hooks patterns in packages/features/
    - UI components from examples/ folder
    - RTL support from existing components

  VALIDATION:
    - Test hooks with React Testing Library
    - Visual test components in Storybook
    - Test WebSocket connection stability
    - Verify RTL layout for Arabic content

Task 7 - Comprehensive Testing:
  CREATE tests/cultural/:
    - test_cultural_validators.py - unit tests for each validator
    - test_validation_pipeline.py - integration tests
    - test_database_integration.py - Supabase integration tests
    - test_pydantic_ai_integration.py - agent tool tests
    - test_api_endpoints.py - FastAPI endpoint tests

  CREATE test data:
    - Cultural test cases (compliant and non-compliant)
    - Islamic test cases (halal and haram content)
    - Iraqi dialect test samples
    - Professional domain test content

  PERFORMANCE tests:
    - Validate <200ms response time requirement
    - Test concurrent validation requests
    - Database query performance
    - Cache effectiveness

  REFERENCE:
    - Existing tests in apps/api/tests/
    - TestModel pattern for PydanticAI testing
    - pytest fixtures for database setup

  VALIDATION:
    - 100% test coverage for core validators
    - All tests pass
    - Performance tests meet <200ms requirement
    - Integration tests with real Supabase

Task 8 - Documentation and Examples:
  CREATE docs/cultural-islamic-compliance/:
    - README.md - system overview and usage
    - api-reference.md - API endpoint documentation
    - pydantic-ai-integration.md - agent integration guide
    - validation-rules.md - cultural and Islamic rules reference
    - troubleshooting.md - common issues and solutions

  CREATE examples/:
    - basic_validation.py - simple validation example
    - agent_integration.py - PydanticAI agent with validation
    - custom_validator.py - creating custom domain validators
    - frontend_integration.tsx - React component example

  VALIDATION:
    - All examples run successfully
    - Documentation clear and comprehensive
    - API reference accurate
    - Troubleshooting covers common issues
```

## Validation Loop

### Level 1: Database Schema Validation

```bash
# Verify database schema deployed successfully
cd apps/api

# Check tables exist in Supabase
python -c "
from services.cultural_islamic_db import get_supabase_client
client = get_supabase_client()

tables = [
    'cultural_islamic_rules',
    'content_validation_results',
    'user_compliance_preferences',
    'compliance_violations',
    'cultural_islamic_knowledge'
]

for table in tables:
    result = client.table(table).select('*').limit(1).execute()
    print(f'✓ Table {table} exists')
"

# Expected: All 5 tables exist
# If failing: Run Supabase migrations again
```

### Level 2: Core Validator Functionality

```bash
# Test core validation service
cd apps/api

# Test Islamic compliance validator
python -c "
import asyncio
from services.cultural_islamic_compliance import IraqiCulturalValidator, CulturalValidationConfig

async def test():
    config = CulturalValidationConfig()
    validator = IraqiCulturalValidator(config)

    # Test compliant content
    result = await validator.validate_content(
        'Welcome to our halal family services. We provide educational support.'
    )
    assert result.overall_score >= 0.7, f'Score too low: {result.overall_score}'
    assert result.islamic_compliance_score >= 0.8, f'Islamic score too low: {result.islamic_compliance_score}'
    print(f'✓ Compliant content validation: {result.overall_score:.2f} overall, {result.islamic_compliance_score:.2f} Islamic')

    # Test non-compliant content
    result2 = await validator.validate_content(
        'Visit our casino for gambling and alcohol services'
    )
    assert result2.islamic_compliance_score == 0.0, 'Should reject haram content'
    print(f'✓ Non-compliant content rejected: {result2.islamic_compliance_score:.2f} Islamic score')

asyncio.run(test())
"

# Expected: Compliant content scores high, non-compliant rejected
# If failing: Debug validator logic and Islamic principles
```

### Level 3: Performance Validation

```bash
# Test validation performance meets <200ms requirement
cd apps/api

python -c "
import asyncio
import time
from services.cultural_islamic_compliance import IraqiCulturalValidator, CulturalValidationConfig

async def test_performance():
    config = CulturalValidationConfig()
    validator = IraqiCulturalValidator(config)

    content = '''
    السلام عليكم ورحمة الله وبركاته
    Welcome to our Iraqi professional services platform.
    We provide legal, medical, and educational support
    with full Islamic compliance and cultural sensitivity.
    '''

    # Test 10 validations
    times = []
    for i in range(10):
        start = time.time()
        result = await validator.validate_content(content)
        elapsed = (time.time() - start) * 1000  # Convert to ms
        times.append(elapsed)
        print(f'Validation {i+1}: {elapsed:.2f}ms')

    avg_time = sum(times) / len(times)
    assert avg_time < 200, f'Average time {avg_time:.2f}ms exceeds 200ms requirement'
    print(f'✓ Performance: {avg_time:.2f}ms average (requirement: <200ms)')

asyncio.run(test_performance())
"

# Expected: Average validation time <200ms
# If failing: Optimize validators, add caching, profile slow operations
```

### Level 4: API Integration Validation

```bash
# Test FastAPI endpoints
cd apps/api

# Start API server in background
uvicorn main:app --reload --port 8000 &
API_PID=$!
sleep 5

# Test validation endpoint
curl -X POST http://localhost:8000/api/cultural-compliance/validate \
  -H "Content-Type: application/json" \
  -d '{
    "content": "السلام عليكم. Welcome to our halal services.",
    "domain": "general"
  }' | jq '.overall_score'

# Expected: Returns score >= 0.7
# If failing: Debug API endpoint and request handling

# Test preferences endpoint
curl -X GET http://localhost:8000/api/cultural-compliance/preferences \
  -H "Authorization: Bearer $TEST_TOKEN" | jq '.islamic_compliance_level'

# Expected: Returns user preferences
# If failing: Check authentication and database connection

# Clean up
kill $API_PID
```

### Level 5: PydanticAI Integration Validation

```bash
# Test validation tool with PydanticAI agent
cd apps/api

python -c "
import asyncio
from pydantic_ai import Agent
from pydantic_ai.models.test import TestModel
from agents.tools.cultural_validation_tool import validate_cultural_compliance
from services.cultural_islamic_compliance import IraqiCulturalValidator, CulturalValidationConfig

async def test_agent_integration():
    # Create test agent with validation tool
    validator = IraqiCulturalValidator(CulturalValidationConfig())

    agent = Agent(TestModel())

    # Add validation tool
    @agent.tool
    async def validate_content(content: str):
        return await validator.validate_content(content)

    # Test agent can use validation
    result = await agent.run_sync('Validate this: السلام عليكم')
    print('✓ Agent integration works')
    print(f'Agent response type: {type(result.output)}')

asyncio.run(test_agent_integration())
"

# Expected: Agent successfully uses validation tool
# If failing: Debug tool integration and dependency injection
```

### Level 6: Frontend Integration Validation

```bash
# Test React hooks (requires running Next.js dev server)
cd apps/web

# Start dev server
npm run dev &
DEV_PID=$!
sleep 10

# Test validation hook (browser automated test)
npx playwright test tests/cultural-validation.spec.ts

# Expected: Hooks provide real-time validation feedback
# If failing: Debug WebSocket connection and hook logic

# Clean up
kill $DEV_PID
```

## Final Validation Checklist

### Core System Completeness

- [ ] All 5 database tables created in Supabase with RLS policies
- [ ] IraqiCulturalValidator implemented with 10 domain validators
- [ ] ArabicLanguageProcessor detects Iraqi dialect and calculates percentage
- [ ] Validation pipeline returns CulturalValidationResult with scores
- [ ] Database integration caches results with content_hash lookup
- [ ] PydanticAI tool created for agent integration

### Performance & Quality

- [ ] <200ms validation response time (average across 10 tests)
- [ ] 95%+ cultural appropriateness score for test content
- [ ] 90%+ Islamic compliance score for test content
- [ ] 100% test coverage for core validators
- [ ] All integration tests pass (database, API, agents, frontend)
- [ ] Performance tests show consistent sub-200ms times

### Integration & Documentation

- [ ] FastAPI endpoints functional (/validate, /rules, /preferences, /history)
- [ ] Middleware provides automatic validation for content endpoints
- [ ] React hooks provide real-time validation (useCulturalValidation)
- [ ] Frontend components display scores and recommendations
- [ ] Comprehensive documentation in docs/cultural-islamic-compliance/
- [ ] Working examples for basic validation, agent integration, custom validators

### Cultural & Islamic Compliance

- [ ] Islamic principles properly loaded and validated
- [ ] Cultural domains cover all 10 areas from initial file
- [ ] Regional variations supported (Baghdad, Basra, Mosul, Erbil)
- [ ] Professional domain validation works for legal, medical, educational
- [ ] Arabic language processing detects Iraqi dialect accurately
- [ ] Respectful guidance provided, not just rejection

## Anti-Patterns to Avoid

### System Architecture

- ❌ Don't create a PydanticAI agent - This is a service/library for validation
- ❌ Don't skip database integration - Validation results must persist
- ❌ Don't hard-code validation rules - Use database-backed configurable rules
- ❌ Don't ignore performance - Must meet <200ms requirement
- ❌ Don't create synchronous validators - Use async/await throughout

### Cultural Validation

- ❌ Don't assume AI is authoritative for religious rulings - Defer to scholars
- ❌ Don't ignore regional variations - Support Baghdad/Basra/Mosul/Erbil differences
- ❌ Don't use arbitrary score thresholds - Test with real Iraqi content
- ❌ Don't provide rejection without guidance - Give educational recommendations
- ❌ Don't treat cultural and Islamic as equal - Islamic principles take precedence

### Implementation

- ❌ Don't copy gemini-cli example verbatim - Adapt to production requirements
- ❌ Don't skip Supabase RLS policies - User privacy is critical
- ❌ Don't forget cache expiration - Use TTL to prevent stale results
- ❌ Don't skip error handling - Validation failures should be graceful
- ❌ Don't forget to validate Unicode - Properly handle Arabic text encoding

## Confidence Score: 9/10

**Why 9/10:**

**Strengths:**
- ✅ Comprehensive research completed (Islamic AI ethics, cultural safety frameworks, Supabase patterns)
- ✅ Clear reference implementations from codebase (gemini-cli, cultural_context_manager, autogen)
- ✅ Database schema fully specified in initial file
- ✅ PydanticAI integration patterns well documented
- ✅ Performance requirements clear (<200ms)
- ✅ Detailed implementation blueprint with specific file references

**Minor Risks (-1 point):**
- ⚠️ Cultural validation is inherently subjective - score thresholds may need iteration
- ⚠️ Iraqi dialect detection patterns may need refinement with real user content
- ⚠️ Database performance under high load needs real-world testing
- ⚠️ Integration with all existing agents requires coordination

**Mitigation:**
- Start with configurable thresholds and iterate based on user feedback
- Build comprehensive test suite with real Iraqi content samples
- Performance test with concurrent load before production deployment
- Provide clear integration documentation and examples for agent developers

**One-Pass Implementation Likelihood: 85%**

With this PRP, an AI agent should be able to implement the Cultural & Islamic Compliance System in one pass, though minor adjustments to scoring thresholds and dialect detection may be needed after initial user testing.

---

**Next Steps After Implementation:**

1. **Gather Real Content**: Collect diverse Iraqi content samples for validation testing
2. **Iterate Thresholds**: Adjust cultural and Islamic score thresholds based on real validation results
3. **Scholar Review**: Have Islamic scholars review prohibited/encouraged keywords and principles
4. **Performance Optimization**: Profile and optimize slow validation operations
5. **User Feedback**: Gather feedback from Iraqi users on validation quality and recommendations

