---
name: "Multi-Model Provider System PRP"
description: "Comprehensive PRP for implementing intelligent multi-model AI provider system with Iraqi cultural context routing using PydanticAI"
---

## Purpose

Build an intelligent multi-model AI provider system that dynamically routes requests to the most appropriate AI model based on cultural context, language requirements, professional domain expertise, and performance optimization for Iraqi users.

## Core Principles

1. **PydanticAI Best Practices**: Deep integration with PydanticAI patterns for agent creation, tools, and structured outputs
2. **Production Ready**: Include security, testing, and monitoring for production deployments
3. **Type Safety First**: Leverage PydanticAI's type-safe design and Pydantic validation throughout
4. **Context Engineering Integration**: Apply proven context engineering workflows to AI agent development
5. **Comprehensive Testing**: Use TestModel and FunctionModel for thorough agent validation
6. **Iraqi Cultural Intelligence**: Prioritize Islamic compliance, Arabic language capabilities, and Iraqi professional standards

## ⚠️ Implementation Guidelines: Build Smart, Not Complex

**IMPORTANT**: Focus on intelligent routing logic while keeping the implementation practical.

### What NOT to do:
- ❌ **Don't create overly complex routing algorithms** - Use proven patterns from research
- ❌ **Don't over-engineer provider abstractions** - Follow PydanticAI FallbackModel patterns
- ❌ **Don't build unnecessary cultural processors** - Integrate cultural context efficiently
- ❌ **Don't add premature optimization** - Start with functional routing, optimize based on metrics

### What TO do:
- ✅ **Use PydanticAI FallbackModel** - Leverage built-in multi-provider support
- ✅ **Follow established routing patterns** - Implement proven AI model routing strategies
- ✅ **Integrate cultural context intelligently** - Enhance prompts with Iraqi context
- ✅ **Monitor and optimize based on data** - Use performance metrics for routing decisions

### Key Question:
**"Does this routing decision improve performance, cultural appropriateness, or cost efficiency?"**

If the answer is no, keep the routing logic simple and focus on proven patterns.

---

## Goal

Create an intelligent multi-model provider system that:
- Routes AI requests to optimal models based on cultural context, language, and domain expertise
- Provides 95%+ Islamic compliance and cultural appropriateness
- Optimizes cost-performance ratios through intelligent model selection
- Maintains 99.9% availability through robust fallback mechanisms
- Supports Arabic RTL text processing with 99%+ accuracy
- Integrates seamlessly with Iraqi professional domains (legal, medical, educational)

## Why

Current AI systems lack cultural context awareness and intelligent routing, leading to:
- Inappropriate responses for Iraqi cultural contexts
- Suboptimal model selection causing unnecessary costs
- Poor Arabic language processing and RTL handling
- Lack of professional domain expertise for Iraqi standards
- Single points of failure without proper fallback strategies

This system addresses these issues by implementing intelligent routing with cultural context awareness.

## What

### Agent Type Classification
- [x] **Tool-Enabled Agent**: Multi-model routing with external provider integration capabilities
- [x] **Workflow Agent**: Multi-step cultural validation and model selection orchestration
- [x] **Structured Output Agent**: Complex routing decision validation and performance tracking

### Model Provider Requirements
- [x] **OpenAI**: `openai:gpt-4o` (Arabic capabilities, general intelligence)
- [x] **Anthropic**: `anthropic:claude-3-5-sonnet-20241022` (Cultural reasoning, safety)
- [x] **Google**: `gemini-1.5-pro` (Multi-modal capabilities, fast processing)
- [x] **Fallback Strategy**: Intelligent routing with automatic failover based on context

### External Integrations
- [x] Database connections (PostgreSQL - performance metrics, routing history)
- [x] Cultural validation services (Iraqi cultural appropriateness scoring)
- [x] Real-time analytics (Performance monitoring and optimization)
- [x] Professional domain APIs (Iraqi legal, medical, educational standards)

### Success Criteria
- [x] 95%+ Islamic compliance scores across all routed requests
- [x] 99%+ Arabic text processing accuracy with proper RTL handling
- [x] <200ms average routing decision time
- [x] 30%+ cost optimization through intelligent model selection
- [x] 99.9% availability through multi-provider fallback mechanisms
- [x] Comprehensive test coverage with cultural validation scenarios

## All Needed Context

### PydanticAI Documentation & Research

```yaml
# MCP servers researched
- mcp: Context7
  library: /pydantic/pydantic-ai
  findings: FallbackModel support, custom providers, agent.tool patterns
  key_insights: Multi-provider fallback, TestModel validation, RunContext dependency injection

# ESSENTIAL PYDANTIC AI DOCUMENTATION - Researched
- url: https://ai.pydantic.dev/models/
  findings: FallbackModel enables chaining OpenAI → Anthropic → Google providers
  patterns: "FallbackModel(openai_model, anthropic_model, google_model)"

- url: https://ai.pydantic.dev/agents/
  findings: Agent creation with custom providers and dependency injection
  patterns: "Agent(model, deps_type=RoutingDependencies)"

- url: https://ai.pydantic.dev/tools/
  findings: @agent.tool decorators with RunContext for dependency access
  patterns: "@agent.tool\ndef analyze_request(ctx: RunContext[Dependencies], content: str)"

- url: https://ai.pydantic.dev/testing/
  findings: TestModel for rapid validation, Agent.override() for testing
  patterns: "with agent.override(model=TestModel()): result = agent.run_sync()"

# Prebuilt examples analyzed
- path: examples/main_agent_reference/providers.py
  findings: Model provider abstraction with get_llm_model() pattern
  content: OpenAIProvider configuration, environment-based model selection

- path: examples/trae-agent-extracted/enhanced_pydantic_iraqi_agent.py
  findings: Iraqi cultural integration patterns, professional domain handling
  content: Cultural validation, Arabic processing, Islamic compliance patterns
```

### Multi-Model Routing Research

```yaml
# External research completed
routing_strategies_2025:
  dynamic_routing:
    - Cost-performance optimization (30% cost reduction achievable)
    - Real-time context analysis using LLM-powered routing
    - Uncertainty-based selection for model capability matching
    
  cultural_context_routing:
    - Cultural context injection for prompt enhancement
    - Specialized agent networks for domain expertise
    - Performance-based selection with cultural validation
    
  industry_solutions:
    - AWS Bedrock Intelligent Prompt Routing (within model families)
    - Microsoft Azure AI Foundry Model Router (real-time selection)
    - Open source: RouteLLM framework, Not Diamond router

# Architectural patterns identified
multi_provider_patterns:
  orchestration:
    - Central coordination components for request flow management
    - Context-aware decision-making with cultural factors
    - Extended context management across multiple agents
    
  implementation_approaches:
    - Hybrid routing solutions (custom + provider-native)
    - Model Context Protocol (MCP) standardization
    - Fallback chains with graceful degradation
```

### Agent Architecture Research

```yaml
# PydanticAI Architecture Patterns (following main_agent_reference)
agent_structure:
  configuration:
    - settings.py: Environment-based configuration with pydantic-settings
    - providers.py: Multi-provider abstraction with get_routing_model()
    - Environment variables: OPENAI_API_KEY, ANTHROPIC_API_KEY, GOOGLE_API_KEY
    - Routing logic: Cultural context scoring + performance metrics
  
  agent_definition:
    - Structured output with RoutingDecision model for validation
    - FallbackModel integration for automatic provider switching
    - Cultural context injection through system prompts
    - Dataclass dependencies for external services (DB, validators)
  
  tool_integration:
    - @agent.tool for cultural analysis with RunContext[RoutingDeps]
    - @agent.tool for performance monitoring and metrics collection
    - @agent.tool for model capability assessment
    - Dependency injection for database and validation services
  
  testing_strategy:
    - TestModel for routing logic validation
    - FunctionModel for custom cultural validation testing
    - Agent.override() for provider-specific testing
    - Cultural compliance testing with Iraqi scenarios
```

### Security and Production Considerations

```yaml
# Multi-Provider Security Patterns
security_requirements:
  api_management:
    environment_variables: ["OPENAI_API_KEY", "ANTHROPIC_API_KEY", "GOOGLE_API_KEY"]
    secure_storage: "Never commit API keys, use encrypted storage"
    rotation_strategy: "Automated key rotation across all providers"
  
  input_validation:
    cultural_sanitization: "Validate Arabic text input for cultural appropriateness"
    prompt_injection: "Multi-provider prompt injection prevention"
    rate_limiting: "Per-provider rate limiting with intelligent queuing"
  
  routing_security:
    decision_logging: "Secure audit trail of routing decisions"
    cultural_validation: "Mandatory cultural compliance checks"
    performance_monitoring: "Real-time provider health and security monitoring"
```

### Common Multi-Provider Gotchas (research documented)

```yaml
# Provider-specific gotchas identified and solutions
implementation_gotchas:
  provider_inconsistencies:
    issue: "Different providers have varying API formats and capabilities"
    research: "OpenAI uses strict tool definitions, Anthropic has different safety features"
    solution: "Use PydanticAI provider abstraction + custom ModelProfile configurations"
  
  cultural_context_drift:
    issue: "Model responses can lose cultural context during routing"
    research: "Context injection must be provider-aware and consistent"
    solution: "Provider-specific cultural prompt templates with validation"
  
  fallback_complexity:
    issue: "Complex fallback chains can introduce latency and errors"
    research: "FallbackModel provides built-in fallback with exception handling"
    solution: "Use PydanticAI FallbackModel + custom routing logic for intelligent selection"
  
  cost_optimization:
    issue: "Intelligent routing can become expensive if not properly optimized"
    research: "30% cost reduction achievable through proper model selection"
    solution: "Performance metrics + cost tracking + intelligent caching of routing decisions"
```

## Implementation Blueprint

### Technology Research Phase

**RESEARCH COMPLETED - Ready for implementation:**

✅ **PydanticAI Framework Deep Dive:**
- [x] Agent creation with FallbackModel for multi-provider support
- [x] Custom provider configuration (OpenAI, Anthropic, Google)
- [x] Tool integration with @agent.tool and RunContext dependency injection
- [x] Structured output validation with RoutingDecision models
- [x] Testing strategies with TestModel and cultural validation scenarios

✅ **Multi-Provider Architecture Investigation:**
- [x] Intelligent routing strategies from industry research (2025 patterns)
- [x] Cultural context injection and validation patterns
- [x] Performance optimization through cost-aware model selection
- [x] Fallback mechanisms and provider health monitoring
- [x] Iraqi cultural integration from existing trae-agent patterns

✅ **Security and Production Patterns:**
- [x] Multi-provider API key management and secure configuration
- [x] Cultural validation and Islamic compliance checking
- [x] Rate limiting and monitoring across all providers
- [x] Audit trails and performance tracking for routing decisions

### Agent Implementation Plan

```yaml
Implementation Task 1 - Multi-Provider Architecture Setup:
  CREATE multi_model_router project structure:
    - settings.py: Multi-provider configuration with cultural context settings
    - providers.py: Intelligent routing logic with FallbackModel integration
    - router_agent.py: Main routing agent with cultural analysis tools
    - cultural_tools.py: Iraqi cultural validation and context injection tools
    - routing_models.py: Pydantic models for routing decisions and validation
    - dependencies.py: Database, metrics, and validation service integrations
    - tests/: Comprehensive test suite with cultural scenarios

Implementation Task 2 - Core Routing Agent Development:
  IMPLEMENT router_agent.py following research patterns:
    - Use FallbackModel(openai_model, anthropic_model, google_model) pattern
    - Cultural context analysis tool for Iraqi appropriateness scoring
    - Performance metrics tool for cost-optimization tracking
    - Routing decision with RoutingDecision structured output
    - Islamic compliance validation integration

Implementation Task 3 - Cultural Intelligence Tools:
  DEVELOP cultural_tools.py:
    - @agent.tool for Arabic language capability assessment
    - @agent.tool for Iraqi cultural context scoring
    - @agent.tool for professional domain validation (legal, medical, educational)
    - @agent.tool for Islamic compliance checking
    - RunContext[RoutingDependencies] for external service access

Implementation Task 4 - Provider Configuration and Fallback:
  IMPLEMENT providers.py:
    - Multi-provider configuration with cultural context templates
    - Intelligent routing algorithm based on research findings
    - FallbackModel integration with provider-specific settings
    - Cultural prompt injection for each provider type
    - Performance monitoring and cost optimization logic

Implementation Task 5 - Routing Models and Validation:
  CREATE routing_models.py:
    - RoutingDecision model with cultural compliance scores
    - CulturalContext model for Iraqi-specific parameters
    - ProviderCapabilities model for model selection criteria
    - PerformanceMetrics model for optimization tracking
    - Validation models for input sanitization

Implementation Task 6 - Comprehensive Testing and Validation:
  IMPLEMENT testing suite:
    - TestModel integration for routing logic validation
    - Cultural scenario testing with Iraqi user personas
    - Provider fallback testing with simulated failures
    - Performance optimization testing with cost tracking
    - Islamic compliance validation across all providers
    - Arabic RTL text processing accuracy testing
```

## Validation Loop

### Level 1: Multi-Provider Setup Validation

```bash
# Verify multi-provider project structure
find multi_model_router -name "*.py" | sort
test -f multi_model_router/router_agent.py && echo "Router agent present"
test -f multi_model_router/cultural_tools.py && echo "Cultural tools present"
test -f multi_model_router/providers.py && echo "Provider configuration present"

# Verify PydanticAI multi-provider imports
grep -q "from pydantic_ai.models.fallback import FallbackModel" multi_model_router/providers.py
grep -q "@agent.tool" multi_model_router/cultural_tools.py
grep -q "RunContext" multi_model_router/router_agent.py

# Expected: All required files with PydanticAI FallbackModel patterns
# If missing: Generate missing components with multi-provider patterns
```

### Level 2: Routing Intelligence Validation

```bash
# Test routing agent can analyze cultural context
python -c "
from multi_model_router.router_agent import routing_agent
from pydantic_ai.models.test import TestModel
test_model = TestModel()
with routing_agent.override(model=test_model):
    result = routing_agent.run_sync('مرحبا، أريد استشارة قانونية')  # Arabic legal consultation
    print(f'Routing decision: {result.output}')
    print(f'Cultural compliance: {result.output.cultural_score}')
"

# Test multi-provider fallback mechanism
python -c "
from multi_model_router.providers import get_routing_model
model = get_routing_model()  # Should return FallbackModel
print(f'Fallback model: {model}')
print(f'Provider chain: {[str(m) for m in model.models]}')
"

# Expected: Cultural analysis works, fallback model configured correctly
# If failing: Debug cultural tools and provider configuration
```

### Level 3: Cultural Compliance Testing

```bash
# Run Iraqi cultural validation tests
cd multi_model_router
python -m pytest tests/test_cultural_compliance.py -v

# Test specific cultural scenarios
python -m pytest tests/test_arabic_routing.py::test_iraqi_dialect_recognition -v
python -m pytest tests/test_islamic_compliance.py::test_compliance_scoring -v
python -m pytest tests/test_professional_domains.py::test_legal_domain_routing -v

# Expected: 95%+ cultural compliance scores across all test scenarios
# If failing: Improve cultural validation tools and routing logic
```

### Level 4: Performance and Production Validation

```bash
# Verify routing performance metrics
grep -r "performance_metrics" multi_model_router/ | wc -l  # Should have metrics tracking
grep -r "cost_optimization" multi_model_router/ | wc -l   # Should have cost tracking

# Check multi-provider security
test -f multi_model_router/.env.example && echo "Environment template present"
grep -r "API_KEY" multi_model_router/ | grep -v ".py:" # Should not expose keys

# Validate routing decision time
python -c "
import time
from multi_model_router.router_agent import routing_agent
start_time = time.time()
result = routing_agent.run_sync('Test routing speed')
routing_time = (time.time() - start_time) * 1000
print(f'Routing time: {routing_time:.2f}ms')
assert routing_time < 200, 'Routing too slow'
"

# Expected: <200ms routing time, security measures in place, cost tracking active
# If issues: Optimize routing algorithms and implement missing security patterns
```

## Final Validation Checklist

### Multi-Provider Implementation Completeness

- [ ] Complete multi-provider project structure with FallbackModel integration
- [ ] Cultural intelligence tools with Iraqi context analysis
- [ ] Intelligent routing logic with performance optimization
- [ ] Provider-specific configurations with cultural prompt templates
- [ ] Structured output validation with RoutingDecision models
- [ ] Comprehensive test suite with cultural compliance scenarios

### Iraqi Cultural Intelligence

- [ ] 95%+ Islamic compliance scoring across all providers
- [ ] 99%+ Arabic RTL text processing accuracy
- [ ] Iraqi professional domain expertise (legal, medical, educational)
- [ ] Cultural context injection for appropriate model selection
- [ ] Political neutrality and cultural sensitivity validation

### Production Readiness

- [ ] Multi-provider API key management with secure rotation
- [ ] Performance monitoring and cost optimization tracking
- [ ] 99.9% availability through intelligent fallback mechanisms
- [ ] <200ms average routing decision time with caching
- [ ] Audit trails and cultural compliance reporting

---

## Anti-Patterns to Avoid

### Multi-Provider Development

- ❌ Don't implement custom provider abstractions - use PydanticAI FallbackModel
- ❌ Don't ignore provider-specific capabilities - configure based on strengths
- ❌ Don't skip cultural validation - every routing decision needs cultural scoring
- ❌ Don't create complex routing algorithms - follow proven industry patterns
- ❌ Don't ignore cost optimization - track and optimize model selection

### Cultural Integration

- ❌ Don't assume universal cultural patterns - focus specifically on Iraqi context
- ❌ Don't skip Islamic compliance validation - mandatory for all responses
- ❌ Don't ignore Arabic RTL processing - critical for proper text handling
- ❌ Don't overlook professional domain requirements - Iraqi standards differ

### Performance and Security

- ❌ Don't expose provider API keys - use secure environment configuration
- ❌ Don't skip performance monitoring - essential for routing optimization
- ❌ Don't ignore fallback testing - simulate provider failures regularly
- ❌ Don't deploy without cultural compliance metrics - track and report

**RESEARCH STATUS: [COMPLETED]** - Comprehensive research completed, ready for implementation.

---

## Implementation Confidence Score: 9/10

**High Confidence Rationale:**
- **PydanticAI Integration (10/10)**: Thorough research of FallbackModel patterns, agent tools, and testing strategies
- **Multi-Provider Architecture (9/10)**: Industry best practices researched, proven routing strategies identified
- **Cultural Intelligence (9/10)**: Existing Iraqi patterns analyzed, Islamic compliance requirements understood
- **Technical Implementation (9/10)**: Clear blueprint with specific PydanticAI patterns and validation loops
- **Production Readiness (8/10)**: Security, monitoring, and performance patterns well-researched

**Risk Mitigation:**
- Start with simple routing logic and iterate based on performance data
- Use TestModel extensively during development for rapid validation
- Implement cultural validation incrementally with Iraqi user feedback
- Monitor routing performance and optimize based on real usage metrics

This PRP provides a comprehensive foundation for one-pass implementation success.