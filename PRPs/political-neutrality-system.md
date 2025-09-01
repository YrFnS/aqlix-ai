---
name: "Iraqi AI Chat System - Political Neutrality System PRP"
description: "Comprehensive PRP for implementing political neutrality validation system with sectarian content detection, political bias filtering, and neutral stance maintenance for Iraqi contexts"
---

## Purpose

Build a comprehensive political neutrality validation system for the Iraqi AI Chat System that ensures politically neutral interactions, avoids sectarian content, and maintains impartial stance on sensitive Iraqi political topics through PydanticAI agent architecture with content classification, bias detection, and neutrality enforcement capabilities.

## Core Principles

1. **PydanticAI Best Practices**: Deep integration with PydanticAI patterns for agent creation, tools, and structured outputs
2. **Production Ready**: Include security, testing, and monitoring for production deployments  
3. **Type Safety First**: Leverage PydanticAI's type-safe design and Pydantic validation throughout
4. **Context Engineering Integration**: Apply proven context engineering workflows to AI agent development
5. **Comprehensive Testing**: Use TestModel and FunctionModel for thorough agent validation

## ⚠️ Implementation Guidelines: Don't Over-Engineer

**IMPORTANT**: Keep your agent implementation focused and practical. Don't build unnecessary complexity.

### What NOT to do:
- ❌ **Don't create dozens of tools** - Build only the tools your agent actually needs
- ❌ **Don't over-complicate dependencies** - Keep dependency injection simple and focused
- ❌ **Don't add unnecessary abstractions** - Follow main_agent_reference patterns directly
- ❌ **Don't build complex workflows** unless specifically required
- ❌ **Don't add structured output** unless validation is specifically needed (default to string)
- ❌ **Don't build in the examples/ folder**

### What TO do:
- ✅ **Start simple** - Build the minimum viable agent that meets requirements
- ✅ **Add tools incrementally** - Implement only what the agent needs to function
- ✅ **Follow main_agent_reference** - Use proven patterns, don't reinvent
- ✅ **Use string output by default** - Only add result_type when validation is required
- ✅ **Test early and often** - Use TestModel to validate as you build

### Key Question:
**"Does this agent really need this feature to accomplish its core purpose?"**

If the answer is no, don't build it. Keep it simple, focused, and functional.

---

## Goal

Create a PydanticAI-based political neutrality agent that automatically detects, filters, and validates content for political bias, sectarian sensitivity, and maintains neutral stance on Iraqi political topics. The agent must achieve 95%+ neutrality compliance, process both Arabic and English content, and integrate seamlessly with the existing Iraqi AI Chat System cultural validation pipeline.

## Why

The Iraqi AI Chat System requires robust political neutrality to:
- **Maintain Trust**: Preserve user trust by avoiding political favoritism in responses
- **Cultural Compliance**: Respect Iraqi sectarian sensitivities and political complexities
- **Professional Standards**: Enable professional use in Iraqi legal, medical, and educational domains
- **Regulatory Compliance**: Meet Iraqi regulatory requirements for neutral AI systems
- **Sectarian Harmony**: Prevent AI-generated content from exacerbating sectarian tensions
- **Integration Requirements**: Work seamlessly with existing iraqi-cultural-validator agent

## What

### Agent Type Classification
- [x] **Content Classification Agent**: Political content detection and neutrality validation
- [x] **Tool-Enabled Agent**: External tool integration for bias detection and filtering
- [ ] **Workflow Agent**: Multi-step task processing and orchestration
- [x] **Structured Output Agent**: Complex neutrality validation and classification results

### Model Provider Requirements
- [x] **OpenAI**: `openai:gpt-4o` or `openai:gpt-4o-mini`
- [x] **Anthropic**: `anthropic:claude-3-5-sonnet-20241022` or `anthropic:claude-3-5-haiku-20241022`
- [ ] **Google**: `gemini-1.5-flash` or `gemini-1.5-pro`
- [x] **Fallback Strategy**: Multiple provider support with automatic failover

### External Integrations
- [x] Political content databases (Iraqi political context knowledge)
- [x] Sectarian sensitivity detection services
- [x] Arabic NLP processing for dialect-aware political content detection
- [x] Cultural validation integration with iraqi-cultural-validator
- [x] Real-time bias scoring and neutrality metrics

### Success Criteria
- [x] Agent successfully detects political content with 95%+ accuracy
- [x] All tools work correctly with proper error handling for Arabic/English content
- [x] Structured outputs validate political neutrality according to Iraqi standards
- [x] Comprehensive test coverage with TestModel and FunctionModel
- [x] Security measures implemented (secure content handling, input validation, rate limiting)
- [x] Performance meets requirements (<200ms neutrality validation, 95%+ compliance rate)

## All Needed Context

### PydanticAI Documentation & Research

```yaml
# MCP servers
- mcp: context7
  query: "PydanticAI agent creation content classification structured output bias detection"
  why: Core framework understanding and latest patterns for content classification

# ESSENTIAL PYDANTIC AI DOCUMENTATION - Must be researched
- url: https://ai.pydantic.dev/
  why: Official PydanticAI documentation with getting started guide
  content: Agent creation, model providers, dependency injection patterns

- url: https://ai.pydantic.dev/agents/
  why: Comprehensive agent architecture and configuration patterns
  content: System prompts, output types, execution methods, agent composition

- url: https://ai.pydantic.dev/tools/
  why: Tool integration patterns and function registration
  content: @agent.tool decorators, RunContext usage, parameter validation

- url: https://ai.pydantic.dev/testing/
  why: Testing strategies specific to PydanticAI agents
  content: TestModel, FunctionModel, Agent.override(), pytest patterns

- url: https://ai.pydantic.dev/models/
  why: Model provider configuration and authentication
  content: OpenAI, Anthropic, Gemini setup, API key management, fallback models

# Prebuilt examples
- path: examples/main_agent_reference/
  why: Reference implementations for Pydantic AI agents
  content: Production-ready PydanticAI patterns with proper structure and testing

- path: examples/main_agent_reference/research_agent.py
  why: Shows real-world PydanticAI agent with tools and dependency injection
  content: Complex agent with multiple tools, structured outputs, and error handling
```

### Agent Architecture Research

```yaml
# PydanticAI Architecture Patterns (follow main_agent_reference)
agent_structure:
  configuration:
    - settings.py: Environment-based configuration with pydantic-settings
    - providers.py: Model provider abstraction with get_llm_model()
    - Environment variables for API keys and model selection
    - Never hardcode model strings like "openai:gpt-4o"
  
  agent_definition:
    - Default to structured output for neutrality validation results
    - Use get_llm_model() from providers.py for model configuration
    - System prompts as string constants with Iraqi political context
    - Dataclass dependencies for external neutrality services
  
  tool_integration:
    - @agent.tool for context-aware tools with RunContext[DepsType]
    - Tool functions as pure functions that can be called independently
    - Proper error handling and logging in tool implementations
    - Dependency injection through RunContext.deps
  
  testing_strategy:
    - TestModel for rapid development validation
    - FunctionModel for custom behavior testing  
    - Agent.override() for test isolation
    - Comprehensive tool testing with mocks for political content
```

### Cultural Integration Research

```yaml
# Iraqi Cultural Validation Integration (mandatory)
cultural_integration:
  existing_agent: .claude/agents/iraqi-cultural-validator.md
  integration_points:
    - Political neutrality as part of cultural appropriateness validation
    - Islamic compliance verification for political content
    - Professional context validation for Iraqi workplace culture
    - NAMING_CONVENTIONS.md compliance for professional terminology
  
  performance_requirements:
    - <200ms response time for all validations
    - 95%+ cultural appropriateness detection accuracy
    - Process both Arabic and English content with equal precision
    - Handle Iraqi dialect recognition and formal Arabic transitions
  
  context_management:
    - project-context/agents/knowledge-base/cultural-decisions.md
    - project-context/agents/knowledge-base/iraqi-patterns.md
    - project-context/agents/session-logs/ for decision tracking
```

### Political Neutrality Research

```yaml
# External Research Findings
political_neutrality_research:
  key_findings:
    - "True political neutrality is neither fully attainable nor universally desirable"
    - "Building an 'unbiased' chatbot is an impossible goal because bias is often relative"
    - "Approximations of political neutrality work at output-level, system-level, and ecosystem-level"
    - "AI systems should be aligned toward generation of factual content"
  
  iraqi_specific_requirements:
    - Sectarian content filtering (Sunni-Shia sensitivity)
    - Political party neutrality (avoid specific party endorsements)
    - Tribal sensitivity awareness
    - Post-2003 political context understanding
    - Regional conflict neutrality (Iran-Iraq, Kurdish issues)
  
  best_practices:
    - Content filtering using static lists and dynamic classifiers
    - Fine-tuning on curated neutrality datasets
    - Red-teaming to identify political vulnerabilities
    - Reinforcement learning for refusal decisions
    - Independent monitoring platforms for bias documentation

# Iraqi Political Context Research
iraqi_political_context:
  sectarian_dynamics:
    - Sunni-Shia sectarian conflict post-2003 invasion
    - Sectarian political system reflecting religious cleavages
    - Kurdish-Arab political tensions
    - Tribal politics intersecting with sectarian identity
  
  sensitive_topics:
    - Government corruption criticism
    - Armed group discussions
    - Sectarian violence references
    - Political party favoritism
    - Regional proxy conflicts
  
  neutrality_challenges:
    - Self-censorship due to fear of reprisals
    - Social media surveillance concerns
    - Propaganda dissemination during electoral periods
    - Regional influence operations
```

### Security and Production Considerations

```yaml
# PydanticAI Security Patterns (research required)
security_requirements:
  content_security:
    environment_variables: ["OPENAI_API_KEY", "ANTHROPIC_API_KEY", "POLITICAL_CONTENT_API_KEY"]
    secure_storage: "Never commit API keys to version control"
    content_logging: "Safe logging without exposing sensitive political content"
  
  input_validation:
    sanitization: "Validate all political content inputs with Pydantic models"
    injection_prevention: "Implement political prompt injection prevention strategies"
    rate_limiting: "Prevent abuse with proper throttling for neutrality checks"
  
  output_security:
    neutrality_filtering: "Ensure no politically biased data in agent responses"
    content_validation: "Validate neutrality structure and political compliance"
    audit_logging: "Comprehensive audit trail for political neutrality decisions"
```

### Common PydanticAI Gotchas (research and document)

```yaml
# Agent-specific gotchas to research and address
implementation_gotchas:
  async_patterns:
    issue: "Mixing sync and async agent calls inconsistently"
    research: "PydanticAI async/await best practices for real-time neutrality validation"
    solution: "Use async throughout for <200ms performance requirements"
  
  model_limits:
    issue: "Different models have different capabilities for political content understanding"
    research: "Model provider comparison for Arabic political content processing"
    solution: "Provider-specific configuration with fallback for Arabic dialect processing"
  
  dependency_complexity:
    issue: "Complex political content analysis dependencies can be hard to debug"
    research: "Dependency injection best practices for external neutrality services"
    solution: "Simple dataclass dependencies with clear separation of concerns"
  
  tool_error_handling:
    issue: "Political content analysis tool failures can crash entire validation runs"
    research: "Error handling and retry patterns for neutrality validation tools"
    solution: "Graceful degradation with fallback to basic keyword filtering"
```

## Implementation Blueprint

### Technology Research Phase

**RESEARCH REQUIRED - Complete before implementation:**

✅ **PydanticAI Framework Deep Dive:**
- [x] Agent creation patterns for content classification and bias detection
- [x] Model provider configuration with Arabic language support
- [x] Tool integration patterns (@agent.tool vs @agent.tool_plain)
- [x] Dependency injection for external political content services
- [x] Testing strategies with TestModel and FunctionModel for political content

✅ **Agent Architecture Investigation:**
- [x] Project structure conventions (agent.py, tools.py, models.py, dependencies.py)
- [x] System prompt design for Iraqi political neutrality requirements
- [x] Structured output validation with Pydantic models for neutrality results
- [x] Async/sync patterns for <200ms neutrality validation performance
- [x] Error handling and retry mechanisms for political content processing

✅ **Security and Production Patterns:**
- [x] API key management for political content analysis services
- [x] Input validation and political prompt injection prevention
- [x] Rate limiting and monitoring for neutrality validation requests
- [x] Logging and observability for political neutrality decisions
- [x] Deployment and scaling considerations for Iraqi user base

### Agent Implementation Plan

```yaml
Implementation Task 1 - Agent Architecture Setup (Follow main_agent_reference):
  CREATE neutrality agent project structure:
    - settings.py: Environment-based configuration for political content APIs
    - providers.py: Model provider abstraction with Arabic language support
    - agent.py: Main neutrality agent with structured output validation
    - tools.py: Political content detection and bias analysis tools
    - dependencies.py: External political content services integration
    - tests/: Comprehensive test suite with Iraqi political content scenarios

Implementation Task 2 - Core Neutrality Agent Development:
  IMPLEMENT agent.py following main_agent_reference patterns:
    - Use get_llm_model() with Arabic-capable model configuration
    - System prompt with Iraqi political context and neutrality requirements
    - Dependency injection with dataclass for political content services
    - Structured output with NeutralityValidationResult Pydantic model
    - Error handling and logging for political content analysis failures

Implementation Task 3 - Political Content Detection Tools:
  DEVELOP tools.py:
    - @agent.tool detect_political_content(content: str) -> PoliticalContentAnalysis
    - @agent.tool analyze_sectarian_sensitivity(content: str) -> SectarianAnalysis  
    - @agent.tool validate_neutrality_compliance(content: str) -> NeutralityScore
    - @agent.tool filter_biased_language(content: str) -> FilteredContent
    - RunContext integration for Iraqi political knowledge base access
    - Error handling and retry mechanisms for tool failures

Implementation Task 4 - Data Models and Dependencies:
  CREATE models.py and dependencies.py:
    - NeutralityValidationResult: Main structured output model
    - PoliticalContentAnalysis: Political content classification results
    - SectarianAnalysis: Sectarian sensitivity detection results
    - NeutralityScore: Quantitative neutrality compliance scoring
    - FilteredContent: Bias-filtered content with suggestions
    - IraqiPoliticalKnowledgeBase: External political content service dependency
    - ArabicNLPProcessor: Arabic dialect processing service dependency

Implementation Task 5 - Comprehensive Testing:
  IMPLEMENT testing suite:
    - TestModel integration for rapid development with Iraqi political scenarios
    - FunctionModel tests for custom neutrality validation behavior
    - Agent.override() patterns for test isolation with mock political content
    - Integration tests with real providers and Arabic content
    - Tool validation with Iraqi sectarian sensitivity test cases
    - Performance testing for <200ms neutrality validation requirement

Implementation Task 6 - Cultural Integration and Production:
  SETUP cultural integration and production patterns:
    - Integration with iraqi-cultural-validator agent workflows
    - Environment variable management for political content API keys
    - Input sanitization and political prompt injection prevention
    - Rate limiting for neutrality validation requests (1000 req/min)
    - Secure logging and monitoring with Iraqi compliance requirements
    - Production deployment with Arabic language model optimization
```

## Validation Loop

### Level 1: Agent Structure Validation

```bash
# Verify complete neutrality agent project structure
find political_neutrality_agent -name "*.py" | sort
test -f political_neutrality_agent/agent.py && echo "Neutrality agent definition present"
test -f political_neutrality_agent/tools.py && echo "Political content tools present"
test -f political_neutrality_agent/models.py && echo "Neutrality models present"
test -f political_neutrality_agent/dependencies.py && echo "Political content dependencies present"

# Verify proper PydanticAI imports and Iraqi integration
grep -q "from pydantic_ai import Agent" political_neutrality_agent/agent.py
grep -q "@agent.tool" political_neutrality_agent/tools.py
grep -q "class NeutralityValidationResult" political_neutrality_agent/models.py
grep -q "IraqiPoliticalKnowledgeBase" political_neutrality_agent/dependencies.py

# Expected: All required files with proper PydanticAI and Iraqi integration patterns
# If missing: Generate missing components with Iraqi political neutrality requirements
```

### Level 2: Agent Functionality Validation

```bash
# Test neutrality agent can be imported and instantiated
python -c "
from political_neutrality_agent.agent import neutrality_agent
print('Neutrality agent created successfully')
print(f'Model: {neutrality_agent.model}')
print(f'Tools: {len(neutrality_agent.tools)}')
print('Tools:', [tool.name for tool in neutrality_agent.tools])
"

# Test with TestModel for Iraqi political content validation
python -c "
from pydantic_ai.models.test import TestModel
from political_neutrality_agent.agent import neutrality_agent
test_model = TestModel()
with neutrality_agent.override(model=test_model):
    result = neutrality_agent.run_sync('هذا المحتوى السياسي العراقي للاختبار')
    print(f'Neutrality validation result: {result.output}')
    print(f'Neutrality score: {result.output.neutrality_score}')
    print(f'Sectarian issues detected: {result.output.sectarian_issues}')
"

# Expected: Agent instantiation works, all political content tools registered, TestModel validation passes with Iraqi content
# If failing: Debug agent configuration and political content tool registration
```

### Level 3: Comprehensive Testing Validation

```bash
# Run complete neutrality agent test suite
cd political_neutrality_agent
python -m pytest tests/ -v

# Test specific Iraqi political content scenarios
python -m pytest tests/test_agent.py::test_sectarian_content_detection -v
python -m pytest tests/test_tools.py::test_iraqi_political_classification -v  
python -m pytest tests/test_models.py::test_neutrality_output_validation -v
python -m pytest tests/test_arabic_content.py::test_arabic_political_neutrality -v

# Performance testing for <200ms requirement
python -m pytest tests/test_performance.py::test_neutrality_validation_speed -v

# Expected: All tests pass with Iraqi political content, <200ms performance achieved
# If failing: Fix implementation based on Iraqi political neutrality requirements
```

### Level 4: Production Readiness Validation

```bash
# Verify security patterns for political content
grep -r "POLITICAL_CONTENT_API_KEY" political_neutrality_agent/ | grep -v ".py:" # Should not expose keys
test -f political_neutrality_agent/.env.example && echo "Environment template present"

# Check error handling for political content processing
grep -r "try:" political_neutrality_agent/ | wc -l  # Should have comprehensive error handling
grep -r "except" political_neutrality_agent/ | wc -l  # Should have exception handling

# Verify logging setup for neutrality decisions
grep -r "logging\|logger" political_neutrality_agent/ | wc -l  # Should have audit logging

# Verify cultural integration
grep -r "iraqi.*cultural" political_neutrality_agent/ | wc -l  # Should integrate with cultural validator
grep -r "arabic\|Arabic" political_neutrality_agent/ | wc -l  # Should handle Arabic content

# Expected: Security measures for political content, error handling comprehensive, audit logging configured, cultural integration present
# If issues: Implement missing security and Iraqi political neutrality patterns
```

## Final Validation Checklist

### Agent Implementation Completeness

- [ ] Complete neutrality agent project structure: `agent.py`, `tools.py`, `models.py`, `dependencies.py`
- [ ] Agent instantiation with Arabic-capable model provider configuration
- [ ] Tool registration with @agent.tool decorators for political content analysis
- [ ] Structured outputs with NeutralityValidationResult Pydantic model validation
- [ ] Dependency injection for Iraqi political knowledge base and Arabic NLP services
- [ ] Comprehensive test suite with TestModel and FunctionModel for political scenarios

### PydanticAI Best Practices

- [ ] Type safety throughout with proper type hints for political content validation
- [ ] Security patterns implemented (API keys, input validation, rate limiting)
- [ ] Error handling and retry mechanisms for Arabic political content processing
- [ ] Async/sync patterns for <200ms neutrality validation performance
- [ ] Documentation and code comments for Iraqi political neutrality maintainability

### Production Readiness

- [ ] Environment configuration with .env files for political content API keys
- [ ] Logging and monitoring setup for neutrality decision audit trails
- [ ] Performance optimization for Iraqi user base (<200ms validation)
- [ ] Cultural integration with iraqi-cultural-validator agent workflows
- [ ] Deployment readiness with Arabic language model optimization
- [ ] Maintenance and update strategies for evolving Iraqi political context

---

## Anti-Patterns to Avoid

### PydanticAI Agent Development

- ❌ Don't skip TestModel validation - always test with Iraqi political content scenarios
- ❌ Don't hardcode political keywords - use environment variables for political content APIs
- ❌ Don't ignore async patterns - PydanticAI requires async for <200ms performance
- ❌ Don't create complex neutrality tool chains - keep political validation focused and composable
- ❌ Don't skip error handling - implement comprehensive retry and fallback for political content processing

### Agent Architecture

- ❌ Don't mix political content analysis types - clearly separate sectarian detection, bias analysis, and neutrality validation
- ❌ Don't ignore dependency injection - use proper type-safe dependency management for Iraqi political services
- ❌ Don't skip output validation - always use Pydantic models for structured neutrality results
- ❌ Don't forget tool documentation - ensure all political content tools have proper Iraqi context descriptions

### Security and Production

- ❌ Don't expose sensitive political content - validate all outputs and logs for neutrality compliance
- ❌ Don't skip input validation - sanitize and validate all political content inputs
- ❌ Don't ignore rate limiting - implement proper throttling for neutrality validation requests
- ❌ Don't deploy without monitoring - include comprehensive audit trails for political neutrality decisions from day one

**RESEARCH STATUS: [COMPLETED]** - Comprehensive PydanticAI research with Iraqi political neutrality requirements completed, ready for implementation.