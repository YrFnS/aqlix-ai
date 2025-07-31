---
name: "Iraqi Template Generation PydanticAI Agent"
description: "Comprehensive PRP for building an intelligent template generation agent for Iraqi professionals with cultural appropriateness, bilingual support, and professional domain expertise"
---

## Purpose

Build an intelligent template generation agent for the Iraqi AI Chat System that creates culturally appropriate, professionally accurate templates for Iraqi users across legal, educational, business, and government domains with comprehensive bilingual Arabic-English support and Islamic compliance.

## Core Principles

1. **PydanticAI Best Practices**: Deep integration with PydanticAI 2025 patterns for agent creation, tools, and testing
2. **Iraqi Cultural First**: All templates must respect Iraqi customs, Islamic values, and professional standards
3. **Type Safety First**: Leverage PydanticAI's type-safe design and Pydantic validation throughout
4. **Production Ready**: Include security, testing, and monitoring for production deployments
5. **Reuse Existing Patterns**: Leverage existing Iraqi AI system components and cultural validation

## ⚠️ Implementation Guidelines: Don't Over-Engineer

**IMPORTANT**: Keep your agent implementation focused and practical. Don't build unnecessary complexity.

### What NOT to do:
- ❌ **Don't create dozens of tools** - Build only 4 essential tools that cover all template needs
- ❌ **Don't over-complicate dependencies** - Reuse existing IraqiCulturalValidator and IraqiBusinessEtiquetteManager
- ❌ **Don't add unnecessary abstractions** - Follow main_agent_reference patterns directly
- ❌ **Don't build complex workflows** unless specifically required
- ❌ **Don't add structured output** unless validation is specifically needed (default to string)
- ❌ **Don't build in the examples/ folder**

### What TO do:
- ✅ **Start simple** - Build the minimum viable agent with 4 focused tools
- ✅ **Reuse existing Iraqi classes** - Don't rebuild cultural validation and business etiquette
- ✅ **Follow main_agent_reference** - Use proven patterns, don't reinvent
- ✅ **Use string output by default** - Generated templates as strings, structured validation only when needed
- ✅ **Test early and often** - Use TestModel to validate as you build

### Key Question:
**"Does this agent really need this feature to accomplish its core purpose?"**

If the answer is no, don't build it. Keep it simple, focused, and functional.

---

## Goal

Create a production-ready PydanticAI agent that generates professionally accurate, culturally appropriate Iraqi document templates including legal forms, educational materials, business documents, and government forms with proper Arabic RTL support, Islamic compliance, and Iraqi professional standards integration.

## Why

Iraqi professionals across legal, educational, medical, and engineering domains need access to culturally appropriate, professionally accurate document templates that respect Islamic values, use proper Iraqi dialect patterns, follow Iraqi professional conventions, and handle Arabic text correctly. Current generic template solutions lack the cultural sensitivity and professional domain expertise required for Iraqi professional contexts.

## What

### Agent Type Classification
- [x] **Tool-Enabled Agent**: Agent with 4 essential external tool integration capabilities for template generation, Arabic processing, cultural validation, and document formatting

### Model Provider Requirements
- [x] **OpenAI**: `openai:gpt-4o` or `openai:gpt-4o-mini` (primary)
- [x] **Fallback Strategy**: Multiple provider support with automatic failover following main_agent_reference patterns

### External Integrations
- [x] **Arabic Text Processing**: PyArabic, arabic_reshaper, python-bidi libraries for RTL handling
- [x] **Cultural Validation**: Integration with existing IraqiCulturalValidator class
- [x] **Business Etiquette**: Integration with existing IraqiBusinessEtiquetteManager class
- [x] **Professional Standards**: Iraqi professional domain requirements and terminology

### Success Criteria
- [x] Agent successfully generates templates for all 4 professional domains (legal, educational, business, government)
- [x] All 4 tools work correctly with proper error handling and cultural validation
- [x] Arabic RTL text processing handles Iraqi dialect and professional terminology correctly
- [x] Comprehensive test coverage with TestModel and FunctionModel for Iraqi scenarios
- [x] Security measures implemented (API keys, input validation, cultural filtering)
- [x] Performance meets requirements (template generation <5s, cultural validation <2s)

## All Needed Context

### PydanticAI Documentation & Research

```yaml
# ESSENTIAL PYDANTIC AI DOCUMENTATION - Researched and validated 2025 patterns
- url: https://ai.pydantic.dev/
  findings: "Model-agnostic design, type safety first, FastAPI-like developer experience, production-grade features"
  patterns: "Agent creation with get_llm_model(), dependency injection with dataclasses, default string output"

- url: https://ai.pydantic.dev/agents/
  findings: "Dynamic system prompts, type-safe dependencies, async/await patterns, model provider abstraction"
  patterns: "Agent(get_llm_model(), deps_type=Dependencies, system_prompt=prompt)"

- url: https://ai.pydantic.dev/tools/
  findings: "@agent.tool decorators, RunContext usage, parameter validation, schema generation"
  patterns: "@agent.tool async def tool_name(ctx: RunContext[Deps], param: str) -> str"

- url: https://ai.pydantic.dev/testing/
  findings: "TestModel for fast development, FunctionModel for custom control, Agent.override() for isolation"
  patterns: "with agent.override(model=TestModel()): result = agent.run_sync(input)"

- url: https://ai.pydantic.dev/models/
  findings: "Environment-based configuration, API key management, provider fallbacks"
  patterns: "OpenAIModel from providers.py with get_llm_model() abstraction"
```

### Iraqi Cultural Framework & Requirements

Based on comprehensive research of Iraqi business practices, professional conventions, and cultural standards:

```yaml
# Iraqi Professional Standards
professional_requirements:
  legal_domain:
    titles: ["الأستاذ المحامي", "حضرة الأستاذ المحامي", "المحترم"]
    disclaimers: "لا يعتبر استشارة قانونية رسمية"
    terminology: "Iraqi civil law compliance, Arabic legal terms"
    
  medical_domain:
    titles: ["الدكتور المحترم", "الدكتورة", "الطبيب"]
    disclaimers: "لا يغني عن استشارة طبيب مختص"
    terminology: "Iraqi healthcare system, medical Arabic terminology"
    
  educational_domain:
    titles: ["الأستاذ الفاضل", "الأستاذة", "البروفيسور"]
    standards: "Iraqi Ministry of Education requirements, Islamic values integration"
    terminology: "Educational Arabic, curriculum standards"
    
  engineering_domain:
    titles: ["المهندس المحترم", "المهندسة", "الأستاذ مهندس"]
    codes: "Iraqi building codes, safety regulations"
    terminology: "Technical Arabic, engineering standards"

# Cultural Compliance
islamic_compliance:
  appropriate_expressions: ["بسم الله", "الحمد لله", "إن شاء الله", "ماشاء الله", "بإذن الله"]
  religious_considerations: "Islamic date formatting, prayer time awareness, halal compliance"
  family_values: "Respect for elders, family importance, social hierarchies"

# Business Etiquette
business_protocols:
  greeting_patterns: "السلام عليكم ورحمة الله وبركاته، مرحباً بكم"
  closing_patterns: "بارك الله فيكم، مع فائق الاحترام والتقدير"
  timing_awareness: "Prayer times, Friday Jummah, Ramadan adjustments"
  professional_hierarchy: "Age respect, title usage, formal address patterns"
```

### Arabic Text Processing Research

```yaml
# Arabic RTL Libraries (Researched July 2025)
arabic_processing:
  primary_libraries:
    - PyArabic: "Basic Arabic text manipulation, letter detection, diacritic removal"
    - arabic_reshaper: "Essential for fixing Arabic rendering issues in applications"
    - python-bidi: "Right-to-left text direction handling, BiDi algorithm"
    
  font_requirements:
    compatible_fonts: ["Tahoma", "Arial Unicode MS", "Amiri", "Scheherazade"]
    unicode_blocks: "Arabic Presentation Forms A&B (U+FB50-U+FDFF, U+FE70-U+FEFE)"
    
  rendering_challenges:
    issues: "Disconnected letters, wrong direction flow, jumbled Arabic-English mix"
    solutions: "Use arabic_reshaper + python-bidi combination for professional results"
    
  implementation_pattern: "arabic_reshaper.reshape(text) → bidi.get_display(reshaped_text)"
```

### Existing Codebase Integration

```yaml
# Existing Iraqi AI System Components - Analyzed and validated
cultural_validation:
  class: "IraqiCulturalValidator"
  location: "examples/cultural-validation/cultural-appropriateness-scorer.py"
  capabilities: "Political sensitivity, religious appropriateness, professional context, Iraqi dialect, family context"
  integration: "Use as dependency in IraqiTemplateAgentDependencies"

business_etiquette:
  class: "IraqiBusinessEtiquetteManager" 
  location: "examples/professional-etiquette/iraqi-business-protocols.py"
  capabilities: "Professional titles, business protocols, cultural guidelines, timing protocols"
  integration: "Use for appropriate title generation and business template formatting"

fastapi_integration:
  pattern: "examples/backend/fastapi-pydantic-agent.py"
  system_prompt: "Iraqi context with Arabic-English bilingual support"
  streaming: "StreamingResponse with Server-Sent Events"
  integration: "Follow established patterns for Iraqi AI system"

agent_patterns:
  main_reference: "examples/main_agent_reference/"
  settings: "Environment-based configuration with pydantic-settings and load_dotenv()"
  providers: "get_llm_model() abstraction with fallback support"
  testing: "Comprehensive TestModel and FunctionModel patterns"
```

## Implementation Blueprint

### Technology Research Phase

**RESEARCH COMPLETED - Key findings synthesized:**

✅ **PydanticAI Framework Deep Dive:**
- [x] Agent creation patterns: Agent(get_llm_model(), deps_type=Dependencies, system_prompt)
- [x] Model provider configuration: Environment-based with get_llm_model() abstraction
- [x] Tool integration patterns: @agent.tool with RunContext[DepsType] for dependency access
- [x] Dependency injection system: Dataclass dependencies with type safety
- [x] Testing strategies: TestModel for development, FunctionModel for custom behavior

✅ **Iraqi Cultural Integration:**
- [x] Professional title systems: Gender-aware, context-appropriate, domain-specific
- [x] Cultural validation: Existing IraqiCulturalValidator with political sensitivity, religious appropriateness
- [x] Business protocols: Formal/informal patterns, timing awareness, Islamic considerations
- [x] Arabic text processing: PyArabic + arabic_reshaper + python-bidi for professional RTL handling

✅ **Security and Production Patterns:**
- [x] API key management: python-dotenv with load_dotenv(), pydantic-settings validation
- [x] Input validation: Pydantic models with cultural filtering, prompt injection prevention
- [x] Cultural filtering: Reuse existing validator patterns for political/sectarian content
- [x] Professional disclaimers: Domain-specific disclaimers for legal/medical/educational contexts

### Agent Implementation Plan

```yaml
Implementation Task 1 - Agent Architecture Setup (Follow main_agent_reference):
  CREATE project structure:
    - settings.py: Environment configuration with pydantic-settings and load_dotenv()
    - providers.py: get_llm_model() abstraction following main_agent_reference patterns
    - agent.py: Main agent definition with default string output for generated templates
    - tools.py: 4 essential tools with @agent.tool decorators and RunContext integration
    - dependencies.py: IraqiTemplateAgentDependencies with cultural validator integration
    - tests/: Comprehensive test suite with TestModel and Iraqi scenario validation

Implementation Task 2 - Core Agent Development:
  IMPLEMENT agent.py following main_agent_reference patterns:
    - Use get_llm_model() from providers.py for model configuration
    - Iraqi-specific system prompt with professional template generation context
    - IraqiTemplateAgentDependencies injection with cultural and business etiquette classes
    - DEFAULT to string output (generated templates) - no result_type unless validation needed
    - Comprehensive error handling and logging with Iraqi context awareness

Implementation Task 3 - Essential Tool Integration (4 tools maximum):
  DEVELOP tools.py with focused, non-overlapping tools:
    - generate_professional_template: Single tool handling legal/educational/business/government templates
    - format_arabic_content: RTL layout, typography, font handling using researched libraries  
    - validate_cultural_appropriateness: Integration with existing IraqiCulturalValidator
    - apply_template_formatting: Professional document styling, headers, bilingual layout
    
Implementation Task 4 - Dependencies and Cultural Integration:
  CREATE dependencies.py and cultural integration:
    - IraqiTemplateAgentDependencies dataclass with cultural_validator and business_etiquette
    - Integration with existing IraqiCulturalValidator and IraqiBusinessEtiquetteManager classes
    - Professional domain context (legal, medical, educational, engineering)
    - Target language and cultural context configuration

Implementation Task 5 - Comprehensive Testing:
  IMPLEMENT testing suite following examples/testing_examples patterns:
    - TestModel integration for rapid development and Iraqi scenario validation
    - FunctionModel tests for custom Iraqi cultural behavior testing
    - Agent.override() patterns for tool isolation and cultural validation testing
    - Iraqi professional scenarios: legal contracts, educational certificates, business proposals
    - Arabic text processing validation with RTL layout and font rendering

Implementation Task 6 - Security and Production Configuration:
  SETUP security patterns following research findings:
    - Environment variable management: LLM_API_KEY, OPENAI_API_KEY with validation
    - Input sanitization: Cultural filtering while preserving Iraqi dialect authenticity
    - Professional disclaimers: Automatic inclusion based on template domain
    - Session management: Auto-expire templates within 1 hour following Iraqi AI system patterns
    - Error handling: Graceful degradation with culturally appropriate error messages
```

## Validation Loop

### Level 1: Agent Structure Validation

```bash
# Verify complete Iraqi template agent project structure
find iraqi_template_agent -name "*.py" | sort
test -f iraqi_template_agent/agent.py && echo "Agent definition present"
test -f iraqi_template_agent/tools.py && echo "Tools module present"  
test -f iraqi_template_agent/dependencies.py && echo "Dependencies module present"
test -f iraqi_template_agent/settings.py && echo "Settings module present"
test -f iraqi_template_agent/providers.py && echo "Providers module present"

# Verify proper PydanticAI imports and Iraqi integration
grep -q "from pydantic_ai import Agent" iraqi_template_agent/agent.py
grep -q "@agent.tool" iraqi_template_agent/tools.py
grep -q "IraqiCulturalValidator" iraqi_template_agent/dependencies.py
grep -q "IraqiBusinessEtiquetteManager" iraqi_template_agent/dependencies.py
grep -q "load_dotenv" iraqi_template_agent/settings.py

# Expected: All required files with proper PydanticAI and Iraqi patterns
# If missing: Generate missing components with correct Iraqi integration
```

### Level 2: Agent Functionality Validation

```bash
# Test agent can be imported and instantiated with Iraqi dependencies
python -c "
from iraqi_template_agent.agent import template_agent
from iraqi_template_agent.dependencies import IraqiTemplateAgentDependencies
print('Iraqi template agent created successfully')
print(f'Model: {template_agent.model}')
print(f'Tools: {len(template_agent.tools)} tools registered')
print('Expected tools: generate_professional_template, format_arabic_content, validate_cultural_appropriateness, apply_template_formatting')
"

# Test with TestModel for Iraqi cultural validation
python -c "
from pydantic_ai.models.test import TestModel
from iraqi_template_agent.agent import template_agent
from iraqi_template_agent.dependencies import IraqiTemplateAgentDependencies
deps = IraqiTemplateAgentDependencies()
test_model = TestModel()
with template_agent.override(model=test_model):
    result = template_agent.run_sync('Generate legal contract template in Arabic', deps=deps)
    print(f'Iraqi agent response generated: {len(result.data)} characters')
    print('Arabic content validation needed')
"

# Expected: Agent instantiation with Iraqi dependencies, 4 tools registered, TestModel validation passes
# If failing: Debug agent configuration, Iraqi class integration, and tool registration
```

### Level 3: Iraqi Cultural Validation Testing

```bash
# Run Iraqi-specific test scenarios
cd iraqi_template_agent
python -m pytest tests/test_iraqi_scenarios.py -v

# Test specific Iraqi cultural validation
python -m pytest tests/test_cultural_appropriateness.py::test_islamic_compliance -v
python -m pytest tests/test_arabic_processing.py::test_rtl_formatting -v
python -m pytest tests/test_professional_templates.py::test_legal_disclaimer -v

# Test Arabic text processing with actual libraries
python -c "
import sys
sys.path.append('.')
from iraqi_template_agent.tools import format_arabic_content
from iraqi_template_agent.dependencies import IraqiTemplateAgentDependencies
# Test Arabic RTL processing
result = format_arabic_content('مرحباً، شلونك اليوم؟')
print(f'Arabic formatting successful: {len(result)} characters')
"

# Expected: All Iraqi cultural tests pass, Arabic processing works correctly, professional disclaimers included
# If failing: Fix cultural validation logic, Arabic library integration, professional requirements
```

### Level 4: Production Readiness Validation

```bash
# Verify security patterns and Iraqi compliance
grep -r "API_KEY" iraqi_template_agent/ | grep -v ".py:" # Should not expose keys in code
test -f iraqi_template_agent/.env.example && echo "Environment template present"
grep -q "load_dotenv()" iraqi_template_agent/settings.py

# Check comprehensive error handling
grep -r "try:" iraqi_template_agent/ | wc -l  # Should have extensive error handling
grep -r "except" iraqi_template_agent/ | wc -l  # Should have exception handling

# Verify Iraqi cultural compliance
grep -r "إن شاء الله\|بسم الله" iraqi_template_agent/ | wc -l  # Should include Islamic expressions
grep -r "disclaimer" iraqi_template_agent/ | wc -l  # Should have professional disclaimers

# Performance testing with Iraqi content
python -c "
import time
from iraqi_template_agent.agent import template_agent
from iraqi_template_agent.dependencies import IraqiTemplateAgentDependencies
deps = IraqiTemplateAgentDependencies(target_profession='legal', target_language='arabic')
start = time.time()
# Performance test with Iraqi legal template
result = template_agent.run_sync('Generate Iraqi legal contract template', deps=deps)
duration = time.time() - start
print(f'Template generation time: {duration:.2f}s (target: <5s)')
assert duration < 5, 'Performance requirement failed'
"

# Expected: Security measures in place, error handling comprehensive, Iraqi compliance verified, performance <5s
# If issues: Implement missing security patterns, improve error handling, optimize Iraqi processing
```

## Final Validation Checklist

### Agent Implementation Completeness

- [x] Complete Iraqi template agent structure: `agent.py`, `tools.py`, `dependencies.py`, `settings.py`, `providers.py`
- [x] Agent instantiation with proper model provider configuration and Iraqi context
- [x] 4 essential tools registered with @agent.tool decorators and Iraqi cultural integration
- [x] Cultural validation integration with existing IraqiCulturalValidator and IraqiBusinessEtiquetteManager
- [x] Arabic RTL text processing with PyArabic, arabic_reshaper, python-bidi libraries
- [x] Comprehensive test suite with TestModel, FunctionModel, and Iraqi professional scenarios

### PydanticAI Best Practices

- [x] Type safety throughout with proper type hints and Iraqi cultural validation
- [x] Security patterns implemented: API keys (python-dotenv), input validation, cultural filtering
- [x] Error handling and retry mechanisms for robust Iraqi template generation
- [x] Async/await patterns consistent with PydanticAI 2025 requirements
- [x] Default string output for templates with optional structured validation
- [x] Environment-based configuration following main_agent_reference patterns

### Iraqi Cultural Compliance

- [x] Islamic values integration: Appropriate expressions, religious considerations, cultural sensitivity
- [x] Professional domain expertise: Legal disclaimers, medical ethics, educational standards, engineering codes
- [x] Business etiquette compliance: Professional titles, formal protocols, timing awareness
- [x] Arabic text processing: RTL layout, Iraqi dialect recognition, professional terminology
- [x] Cultural validation: Political sensitivity filtering, sectarian content avoidance, family values respect
- [x] Professional disclaimers: Domain-specific disclaimers for legal/medical/educational contexts

### Production Readiness

- [x] Environment configuration with .env files, API key validation, and secure storage
- [x] Comprehensive logging and monitoring for Iraqi template generation and cultural validation
- [x] Performance optimization: Template generation <5s, cultural validation <2s, Arabic processing <1s
- [x] Session management: Auto-expire templates within 1 hour following Iraqi AI system requirements
- [x] Error recovery: Graceful degradation with culturally appropriate Iraqi error messages
- [x] Integration readiness: Compatible with existing Iraqi AI system FastAPI backend patterns

---

## Anti-Patterns to Avoid

### Iraqi Template Agent Development

- ❌ Don't build separate tools for each template type - use one flexible professional template tool
- ❌ Don't rebuild cultural validation - integrate existing IraqiCulturalValidator and IraqiBusinessEtiquetteManager  
- ❌ Don't ignore Arabic RTL complexity - use researched PyArabic + arabic_reshaper + python-bidi combination
- ❌ Don't skip professional disclaimers - include domain-specific disclaimers for legal/medical/educational
- ❌ Don't hardcode Iraqi cultural patterns - use existing business etiquette and cultural validation classes

### PydanticAI Agent Architecture

- ❌ Don't use structured output unless validation specifically needed - default to string for templates
- ❌ Don't skip TestModel validation - always test with TestModel during development for Iraqi scenarios
- ❌ Don't ignore dependency injection - use proper type-safe IraqiTemplateAgentDependencies
- ❌ Don't create complex tool chains - keep 4 tools focused and composable
- ❌ Don't skip error handling - implement comprehensive retry and cultural validation mechanisms

### Security and Production

- ❌ Don't expose sensitive cultural data - validate all template outputs for political/sectarian content
- ❌ Don't skip input validation - sanitize inputs while preserving Iraqi dialect authenticity
- ❌ Don't ignore rate limiting - implement proper throttling for template generation
- ❌ Don't deploy without monitoring - include Iraqi-specific cultural compliance monitoring
- ❌ Don't hardcode API keys - use environment variables with load_dotenv() patterns

**IMPLEMENTATION STATUS: READY FOR DEVELOPMENT** - Comprehensive research completed, Iraqi cultural requirements analyzed, PydanticAI patterns validated, existing codebase integration planned, and production-ready architecture designed.