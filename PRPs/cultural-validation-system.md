---
name: "Cultural Validation System PRP"
description: "Comprehensive PRP for developing a PydanticAI agent that validates content for Iraqi cultural appropriateness, Islamic compliance, and professional domain standards"
---

## Purpose

Build a PydanticAI agent for comprehensive cultural validation of content within the Iraqi AI Chat System. This agent will ensure all content and interactions meet Iraqi cultural standards, Islamic compliance requirements, and professional domain appropriateness, serving as a foundational validation layer for culturally-sensitive AI applications.

## Core Principles

1. **PydanticAI Best Practices**: Deep integration with PydanticAI patterns for agent creation, tools, and structured outputs
2. **Production Ready**: Include security, testing, and monitoring for production deployments
3. **Type Safety First**: Leverage PydanticAI's type-safe design and Pydantic validation throughout
4. **Context Engineering Integration**: Apply proven context engineering workflows to AI agent development
5. **Comprehensive Testing**: Use TestModel and FunctionModel for thorough agent validation

## ⚠️ Implementation Guidelines: Don't Over-Engineer

**IMPORTANT**: Keep your agent implementation focused and practical. Don't build unnecessary complexity.

### What NOT to do:
- ❌ **Don't create dozens of tools** - Build only the validation tools your agent actually needs
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

Create a comprehensive cultural validation agent that can analyze content for:
- **Islamic Compliance**: Prayer time awareness, Ramadan sensitivity, halal content verification, respectful religious language
- **Iraqi Cultural Appropriateness**: Political neutrality, sectarian sensitivity, tribal respect, gender appropriateness, social norms
- **Professional Domain Standards**: Legal, medical, educational, governmental compliance with Iraqi standards
- **Arabic Language Compliance**: RTL support, Iraqi dialect recognition, grammar accuracy, cultural expressions

## Why

The Iraqi AI Chat System requires a reliable cultural validation layer to:
- **Ensure Cultural Sensitivity**: Prevent culturally inappropriate content from reaching users
- **Maintain Islamic Compliance**: Respect Islamic principles in all AI interactions
- **Support Professional Domains**: Validate content for Iraqi legal, medical, and educational contexts
- **Preserve Arabic Heritage**: Properly handle Arabic content and Iraqi dialect
- **Enable Trust**: Build user confidence through culturally-aware AI systems

## What

### Agent Type Classification
- [x] **Tool-Enabled Agent**: Agent with external tool integration capabilities for cultural databases, compliance checkers, and validation services

### Model Provider Requirements
- [x] **OpenAI**: `openai:gpt-4o` or `openai:gpt-4o-mini`
- [x] **Anthropic**: `anthropic:claude-3-5-sonnet-20241022` or `anthropic:claude-3-5-haiku-20241022`
- [x] **Google**: `gemini-1.5-flash` or `gemini-1.5-pro`
- [x] **Fallback Strategy**: Multiple provider support with automatic failover

### External Integrations
- [x] Cultural pattern databases (Islamic keywords, Iraqi expressions, professional terminology)
- [x] Arabic language processing (RTL validation, dialect recognition, grammar checking)
- [x] Professional domain validators (Iraqi legal, medical, educational standards)
- [x] Content filtering systems (inappropriate content detection, cultural sensitivity analysis)

### Success Criteria
- [x] Agent successfully validates content with 95%+ Islamic compliance accuracy
- [x] 90%+ Iraqi cultural appropriateness detection rate
- [x] Professional domain validation for Iraqi legal/medical/educational contexts
- [x] Arabic RTL content processing with 99%+ accuracy
- [x] Performance <200ms for standard validation requests
- [x] Comprehensive test coverage with TestModel and FunctionModel
- [x] Security measures implemented (input validation, rate limiting, secure logging)

## All Needed Context

### PydanticAI Documentation & Research

```yaml
# MCP servers
- mcp: Context7
  library: "/pydantic/pydantic-ai"
  topic: "agent creation tools validation testing"
  why: Core framework understanding and latest patterns

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
- path: examples/arabic-rtl-integration/core/CulturalValidationPipeline.ts
  why: Comprehensive TypeScript cultural validation implementation
  content: Islamic compliance, Iraqi cultural validation, professional domain validation, Arabic language compliance, performance optimization

- path: examples/claude-code-router-extracted/middleware/cultural_validation_middleware.py
  why: Production-ready Python cultural validation middleware
  content: Asynchronous validation framework, specialized validators, performance tracking, caching strategies

- path: examples/
  why: Reference implementations for Pydantic AI agents
  content: A bunch of already built simple Pydantic AI examples to reference including how to set up models and providers
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
    - Use ValidationResult structured output for consistent validation reporting
    - Use get_llm_model() from providers.py for model configuration
    - System prompts focused on Iraqi cultural context and Islamic principles
    - Dataclass dependencies for cultural databases and validation services
  
  tool_integration:
    - @agent.tool for cultural validation tools with RunContext[CulturalDeps]
    - Tool functions for Islamic compliance, cultural appropriateness, professional validation
    - Proper error handling and logging in validation tools
    - Dependency injection for databases and external validators
  
  testing_strategy:
    - TestModel for rapid development validation
    - FunctionModel for custom validation behavior testing  
    - Agent.override() for test isolation with mock cultural data
    - Comprehensive tool testing with Iraqi cultural scenarios
```

### Security and Production Considerations

```yaml
# PydanticAI Security Patterns (research required)
security_requirements:
  api_management:
    environment_variables: ["OPENAI_API_KEY", "ANTHROPIC_API_KEY", "GEMINI_API_KEY"]
    secure_storage: "Never commit API keys to version control"
    cultural_data_protection: "Secure handling of sensitive cultural information"
  
  input_validation:
    sanitization: "Validate all content inputs with Pydantic models"
    cultural_context: "Prevent manipulation of cultural validation context"
    rate_limiting: "Prevent abuse of validation services"
  
  output_security:
    validation_logging: "Log validation decisions without exposing sensitive content"
    cultural_decisions: "Audit trail for cultural validation decisions"
    compliance_reporting: "Secure reporting of Islamic and cultural compliance"
```

### Cultural Validation Specific Research

```yaml
# Islamic Digital Ethics Research (completed)
islamic_ethics_foundations:
  sources:
    - "Initial Considerations for Islamic Digital Ethics" (ResearchGate, 2020)
    - "Islamic Ethics and The Rise of Digital Technology" (Maydan, 2021)
    - "Ethics in Technology and Social Media: An Islamic Perspective" (DEENIN)
  
  key_principles:
    - Intent to harm detection and prevention
    - Justice and social welfare in AI interactions
    - Moderation and balance in content validation
    - Truth, accuracy, and honesty in information filtering
    - Respect for Islamic family values and community standards

# Cultural Appropriateness Algorithms (completed)
cultural_validation_patterns:
  research_sources:
    - "Understanding the Importance of Cultural Appropriateness for User Interface Design" (ACM, 2023)
    - "Personalized Recommendation Algorithm for Cultural and Creative Products" (Springer, 2025)
    - "Algorithmic bias detection and mitigation: Best practices" (Brookings, 2024)
  
  design_patterns:
    - Fuzzy decision support systems for cultural context awareness
    - Machine learning integration for cultural content classification
    - Bias detection and mitigation in cultural validation algorithms
    - Cross-cultural validation frameworks with interdisciplinary teams
```

### Common PydanticAI Gotchas (research and document)

```yaml
# Agent-specific gotchas to research and address
implementation_gotchas:
  cultural_data_handling:
    issue: "Handling sensitive cultural and religious data appropriately"
    research: "Islamic data handling principles and privacy requirements"
    solution: "Implement secure cultural data processing with audit trails"
  
  arabic_text_processing:
    issue: "Complex RTL text processing and dialect recognition challenges"
    research: "Arabic NLP best practices and Iraqi dialect processing"
    solution: "Use specialized Arabic processing libraries with cultural context"
  
  validation_performance:
    issue: "Cultural validation can be computationally expensive"
    research: "Caching strategies and optimization patterns for cultural validation"
    solution: "Implement intelligent caching with cultural context awareness"
  
  model_cultural_bias:
    issue: "LLM models may have cultural biases that affect validation"
    research: "Cultural bias detection and mitigation in LLM responses"
    solution: "Multi-model validation with cultural bias detection tools"
```

## Implementation Blueprint

### Technology Research Phase

**RESEARCH REQUIRED - Complete before implementation:**

✅ **PydanticAI Framework Deep Dive:**
- [x] Agent creation patterns for cultural validation use cases
- [x] Model provider configuration for multi-cultural content processing
- [x] Tool integration patterns for cultural databases and validation services
- [x] Dependency injection for Islamic compliance and cultural appropriateness tools
- [x] Testing strategies with cultural validation scenarios

✅ **Cultural Validation Architecture Investigation:**
- [x] Existing patterns from CulturalValidationPipeline.ts (TypeScript implementation)
- [x] Production middleware from cultural_validation_middleware.py (Python async framework)
- [x] Islamic compliance validation patterns and scoring systems
- [x] Iraqi cultural appropriateness detection algorithms
- [x] Professional domain validation for Iraqi legal/medical/educational contexts

✅ **Security and Production Patterns:**
- [x] Cultural data protection and secure validation logging
- [x] Islamic digital ethics principles for data handling
- [x] Rate limiting for validation services with cultural sensitivity
- [x] Audit trails for cultural validation decisions
- [x] Performance optimization with cultural context caching

### Agent Implementation Plan

```yaml
Implementation Task 1 - Agent Architecture Setup (Follow main_agent_reference):
  CREATE cultural_validation_agent project structure:
    - settings.py: Environment configuration with Islamic calendar integration
    - providers.py: Model provider abstraction with cultural model selection
    - agent.py: Main cultural validation agent with ValidationResult output
    - tools.py: Cultural validation tools (Islamic, Iraqi, professional, Arabic)
    - dependencies.py: Cultural databases and validation services integration
    - models.py: ValidationResult and cultural context models
    - tests/: Comprehensive test suite with Iraqi cultural scenarios

Implementation Task 2 - Core Agent Development:
  IMPLEMENT agent.py following cultural validation requirements:
    - Use ValidationResult structured output for consistent reporting
    - System prompt incorporating Islamic principles and Iraqi cultural context
    - Dependency injection for cultural databases and validators
    - Error handling for sensitive cultural content
    - Performance optimization with cultural caching

Implementation Task 3 - Cultural Validation Tools:
  DEVELOP tools.py with specialized validation functions:
    - islamic_compliance_validator: Prayer time awareness, halal content, religious respect
    - iraqi_cultural_validator: Political neutrality, sectarian sensitivity, social norms
    - professional_domain_validator: Legal, medical, educational Iraqi standards
    - arabic_language_validator: RTL support, dialect recognition, grammar accuracy
    - content_filtering_tool: Inappropriate content detection with cultural sensitivity

Implementation Task 4 - Data Models and Dependencies:
  CREATE models.py and dependencies.py:
    - ValidationResult: Comprehensive validation report with scores and recommendations
    - CulturalContext: User context, professional domain, regional settings
    - IslamicComplianceResult: Prayer awareness, halal verification, religious sensitivity
    - IraqiCulturalResult: Political neutrality, sectarian sensitivity, social appropriateness
    - CulturalDatabases: Islamic keywords, Iraqi expressions, professional terminology

Implementation Task 5 - Comprehensive Testing:
  IMPLEMENT testing suite with cultural scenarios:
    - TestModel integration for Islamic compliance scenarios
    - FunctionModel tests for Iraqi cultural appropriateness
    - Agent.override() patterns for testing with mock cultural data
    - Integration tests with Arabic content and professional domain scenarios
    - Performance testing for validation response times

Implementation Task 6 - Security and Configuration:
  SETUP security patterns for cultural validation:
    - Environment variable management for cultural database access
    - Input sanitization for Arabic text and cultural context
    - Rate limiting for validation services with cultural sensitivity
    - Secure logging of validation decisions without exposing content
    - Production deployment with cultural data protection
```

## Validation Loop

### Level 1: Agent Structure Validation

```bash
# Verify cultural validation agent project structure
find cultural_validation_agent -name "*.py" | sort
test -f cultural_validation_agent/agent.py && echo "Cultural validation agent present"
test -f cultural_validation_agent/tools.py && echo "Cultural validation tools present"
test -f cultural_validation_agent/models.py && echo "Cultural validation models present"
test -f cultural_validation_agent/dependencies.py && echo "Cultural dependencies present"

# Verify proper PydanticAI imports and cultural validation setup
grep -q "from pydantic_ai import Agent" cultural_validation_agent/agent.py
grep -q "@agent.tool" cultural_validation_agent/tools.py
grep -q "class ValidationResult" cultural_validation_agent/models.py
grep -q "class CulturalDatabases" cultural_validation_agent/dependencies.py

# Expected: All required files with proper cultural validation patterns
# If missing: Generate missing components with Iraqi cultural context
```

### Level 2: Cultural Validation Functionality Validation

```bash
# Test agent can validate Islamic compliance
python -c "
from cultural_validation_agent.agent import cultural_validation_agent
from cultural_validation_agent.models import CulturalContext
print('Cultural validation agent created successfully')
test_context = CulturalContext(
    user_role='citizen',
    professional_domain='general',
    islamic_compliance_required=True,
    arabic_content=True
)
print(f'Cultural context: {test_context}')
"

# Test with TestModel for Islamic compliance validation
python -c "
from pydantic_ai.models.test import TestModel
from cultural_validation_agent.agent import cultural_validation_agent
test_model = TestModel()
with cultural_validation_agent.override(model=test_model):
    result = cultural_validation_agent.run_sync(
        'Validate this content for Islamic compliance: مرحبا، كيف يمكنني مساعدتك اليوم؟',
        deps=test_dependencies
    )
    print(f'Validation result: {result.output.result}')
    print(f'Islamic compliance score: {result.output.islamic_compliance_score}')
"

# Expected: Agent instantiation works, cultural tools registered, validation passes
# If failing: Debug cultural validation configuration and tool registration
```

### Level 3: Comprehensive Cultural Testing Validation

```bash
# Run complete cultural validation test suite
cd cultural_validation_agent
python -m pytest tests/ -v

# Test specific cultural validation scenarios
python -m pytest tests/test_islamic_compliance.py::test_prayer_time_awareness -v
python -m pytest tests/test_iraqi_cultural.py::test_political_neutrality -v
python -m pytest tests/test_professional_domain.py::test_medical_validation -v
python -m pytest tests/test_arabic_processing.py::test_rtl_support -v

# Expected: All cultural validation tests pass with high accuracy rates
# If failing: Fix implementation based on Iraqi cultural requirements
```

### Level 4: Production Readiness Validation

```bash
# Verify cultural data security patterns
grep -r "CULTURAL_DB_KEY" cultural_validation_agent/ | grep -v ".py:" # Should not expose keys
test -f cultural_validation_agent/.env.example && echo "Environment template present"

# Check cultural validation error handling
grep -r "try:" cultural_validation_agent/ | wc -l  # Should have comprehensive error handling
grep -r "except" cultural_validation_agent/ | wc -l  # Should handle cultural validation exceptions

# Verify cultural validation logging
grep -r "logging\|logger" cultural_validation_agent/ | wc -l  # Should have secure cultural logging

# Performance validation for cultural processing
python -c "
import time
from cultural_validation_agent.agent import cultural_validation_agent
start_time = time.time()
# Test with complex Arabic content
result = cultural_validation_agent.run_sync('Complex cultural validation test...')
processing_time = (time.time() - start_time) * 1000
print(f'Validation processing time: {processing_time:.2f}ms')
assert processing_time < 200, 'Cultural validation too slow'
"

# Expected: Security measures in place, performance <200ms, comprehensive cultural logging
# If issues: Implement missing cultural validation optimizations
```

## Final Validation Checklist

### Agent Implementation Completeness

- [ ] Complete cultural validation agent structure: `agent.py`, `tools.py`, `models.py`, `dependencies.py`
- [ ] Agent instantiation with multi-provider configuration for cultural resilience
- [ ] Cultural validation tools: Islamic compliance, Iraqi cultural, professional domain, Arabic language
- [ ] ValidationResult structured output with comprehensive cultural scoring
- [ ] CulturalDatabases dependency injection with Islamic and Iraqi cultural data
- [ ] Comprehensive test suite with TestModel and FunctionModel for cultural scenarios

### Cultural Validation Best Practices

- [ ] Islamic compliance validation with 95%+ accuracy (prayer time, halal content, religious respect)
- [ ] Iraqi cultural appropriateness with 90%+ detection (political neutrality, sectarian sensitivity)
- [ ] Professional domain validation for Iraqi legal, medical, educational standards
- [ ] Arabic language processing with RTL support and Iraqi dialect recognition
- [ ] Performance optimization <200ms for standard cultural validations
- [ ] Security patterns for cultural data protection and validation audit trails

### Production Readiness

- [ ] Environment configuration with cultural database access and Islamic calendar integration
- [ ] Logging and monitoring for cultural validation decisions with privacy protection
- [ ] Performance optimization with intelligent cultural context caching
- [ ] Deployment readiness with cultural data security compliance
- [ ] Maintenance strategies for updating cultural validation rules and Islamic compliance standards

---

## Anti-Patterns to Avoid

### Cultural Validation Development

- ❌ Don't skip cultural context testing - always validate with real Iraqi cultural scenarios
- ❌ Don't hardcode cultural rules - use configurable cultural databases and validation patterns
- ❌ Don't ignore Arabic processing complexity - implement proper RTL and dialect handling
- ❌ Don't oversimplify Islamic compliance - respect the complexity of Islamic principles
- ❌ Don't skip professional domain validation - Iraqi legal/medical/educational contexts matter

### Agent Architecture

- ❌ Don't mix validation types - clearly separate Islamic, cultural, professional, and linguistic validation
- ❌ Don't ignore cultural sensitivity in error messages - provide culturally appropriate feedback
- ❌ Don't skip cultural performance optimization - validation must be responsive for user experience
- ❌ Don't forget cultural audit trails - maintain records of validation decisions for compliance

### Security and Production

- ❌ Don't expose cultural validation details in logs - protect user privacy and cultural sensitivity
- ❌ Don't skip cultural input validation - prevent manipulation of cultural validation context
- ❌ Don't ignore rate limiting for cultural services - protect validation resources
- ❌ Don't deploy without cultural monitoring - include cultural compliance metrics and alerting

**RESEARCH STATUS: [COMPLETED]** - Comprehensive cultural validation research completed with Iraqi cultural patterns, Islamic digital ethics principles, and production-ready implementation guidance.

---

## Implementation Confidence Score

**Score: 9/10** - Very High Confidence for One-Pass Implementation

### Justification:

**Strengths (9 points):**
- ✅ **Comprehensive Requirements Analysis**: Clear understanding of Islamic compliance, Iraqi cultural validation, and professional domain requirements
- ✅ **Extensive Codebase Research**: Found two excellent reference implementations (TypeScript and Python) with proven patterns
- ✅ **PydanticAI Documentation**: Complete research of agent creation, tools, testing, and model provider patterns
- ✅ **Cultural Research**: Thorough research of Islamic digital ethics, cultural appropriateness algorithms, and Iraqi cultural standards
- ✅ **Production Patterns**: Clear security, performance, and deployment guidance with cultural sensitivity
- ✅ **Testing Strategy**: Comprehensive testing approach with cultural scenarios and validation accuracy requirements
- ✅ **Performance Requirements**: Clear targets (<200ms, 95%+ Islamic compliance, 90%+ cultural appropriateness)
- ✅ **Implementation Blueprint**: Detailed task breakdown with specific deliverables and validation gates
- ✅ **Anti-Patterns Documentation**: Clear guidance on what to avoid in cultural validation development

**Minor Risk (1 point deduction):**
- ⚠️ **Cultural Data Sources**: While patterns are clear, the actual cultural databases and validation rules will need to be built or sourced during implementation

**Why 9/10 is Justified:**
This PRP provides exceptional implementation guidance with comprehensive research, clear requirements, proven patterns from existing codebase, and detailed validation strategies. The cultural validation domain is well-researched with both technical and cultural considerations addressed. The implementation blueprint is specific and actionable, with clear success criteria and testing strategies.

The only uncertainty is sourcing or building the actual cultural databases, but the patterns for integrating them are well-established from the existing codebase examples.