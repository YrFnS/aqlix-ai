---
name: "Iraqi Professional Domains PydanticAI Agent"
description: "Comprehensive PRP for building specialized professional domain agents for Iraqi AI Chat System with multi-domain expertise, cultural sensitivity, and ethical boundaries"
---

## Purpose

Build a sophisticated PydanticAI agent that provides expert knowledge across Iraqi professional domains (legal, medical, educational, engineering) with domain-specific expertise, authentic terminology, cultural context, and professional ethical boundaries while maintaining appropriate disclaimers and referral mechanisms.

## Core Principles

1. **Iraqi-First Cultural Integration**: Deep respect for Islamic values, Iraqi customs, and professional traditions
2. **Professional Ethical Boundaries**: Strict enforcement of professional ethics with appropriate disclaimers
3. **Multi-Domain Expertise**: Comprehensive knowledge across legal, medical, educational, and engineering domains
4. **Production-Ready Security**: Cultural validation, rate limiting, input sanitization, and boundary enforcement
5. **Authentic Language Support**: Iraqi dialect recognition with professional Arabic-English terminology translation

## ⚠️ Implementation Guidelines: Professional Agent Complexity

**IMPORTANT**: This is a sophisticated multi-domain professional agent requiring careful implementation.

### What TO do:
- ✅ **Follow main_agent_reference patterns** - Use proven architecture for production readiness
- ✅ **Implement cultural validation** - Essential for Iraqi professional context
- ✅ **Enforce professional boundaries** - Critical for ethical professional advice
- ✅ **Use comprehensive testing** - TestModel/FunctionModel for cultural scenarios
- ✅ **Include proper disclaimers** - Required for professional liability protection
- ✅ **Build incremental validation** - Validate each domain and cultural component

### What NOT to do:
- ❌ **Don't skip cultural validation** - This is non-negotiable for Iraqi context
- ❌ **Don't ignore professional ethics** - Boundary enforcement is mandatory
- ❌ **Don't oversimplify disclaimers** - Professional liability requires comprehensive disclaimers
- ❌ **Don't hardcode cultural rules** - Use configurable cultural validation systems

### Key Question:
**"Does this response meet Iraqi cultural standards AND professional ethical boundaries?"**

Both must be satisfied for appropriate professional guidance.

---

## Goal

Create a PydanticAI agent that serves as a knowledgeable, culturally-sensitive assistant for Iraqi professionals across multiple domains while maintaining strict professional boundaries, providing appropriate disclaimers, and respecting Iraqi cultural values and Islamic principles.

## Why

Iraqi professionals need AI assistance that understands their specific legal systems, medical terminology, educational standards, and engineering practices while respecting cultural context. Generic AI assistants lack the cultural sensitivity and professional domain knowledge required for effective Iraqi professional support.

## What

### Agent Type Classification
- [x] **Multi-Domain Professional Agent**: Specialized agent with cultural validation and professional boundary enforcement
- [x] **Tool-Enabled Agent**: Comprehensive tool integration for domain routing, cultural validation, and boundary enforcement
- [x] **Cultural Context Agent**: Deep Iraqi cultural integration with Islamic values respect

### Model Provider Requirements
- [x] **OpenAI**: `openai:gpt-4o` (primary for Iraqi dialect understanding)
- [x] **Anthropic**: `anthropic:claude-3-5-sonnet-20241022` (fallback for cultural sensitivity)
- [x] **Fallback Strategy**: Multiple provider support with cultural context preservation

### External Integrations
- [x] Iraqi Professional Standards Databases (legal, medical, educational, engineering)
- [x] Arabic-English Professional Terminology Dictionaries
- [x] Cultural Appropriateness Validation Systems
- [x] Professional Ethics Boundary Enforcement
- [x] Iraqi Dialect Recognition and Processing

### Success Criteria
- [x] Agent provides culturally appropriate Iraqi professional guidance
- [x] All professional boundaries enforced with proper disclaimers
- [x] Iraqi dialect and Arabic terminology handled correctly
- [x] Cultural sensitivity validation scores >0.8 for all responses
- [x] Professional ethics compliance verified through boundary testing
- [x] Comprehensive test coverage for all professional domains and cultural scenarios

## All Needed Context

### PydanticAI Documentation & Research

```yaml
# MCP servers research completed
- mcp: Sequential
  query: "PydanticAI multi-domain agent architecture professional boundaries"
  results: "Comprehensive patterns for professional boundary enforcement and multi-domain routing"

- mcp: Context7
  query: "PydanticAI dependency injection cultural context professional ethics"
  results: "Official documentation patterns for dependency injection and cultural context integration"

# ESSENTIAL PYDANTIC AI DOCUMENTATION - Researched and validated
- url: https://ai.pydantic.dev/
  content: Complete agent framework with model providers, dependency injection, and testing patterns
  patterns: Agent creation, RunContext usage, tool registration, structured outputs

- url: https://ai.pydantic.dev/agents/
  content: Agent architecture patterns with system prompts and dependency injection
  patterns: Professional context integration, multi-domain system prompt strategies

- url: https://ai.pydantic.dev/tools/
  content: Tool integration with @agent.tool decorators and RunContext
  patterns: Cultural validation tools, professional boundary enforcement tools

- url: https://ai.pydantic.dev/testing/
  content: TestModel and FunctionModel patterns for agent validation
  patterns: Cultural context testing, professional boundary validation testing

- url: https://ai.pydantic.dev/models/
  content: Model provider configuration and fallback strategies
  patterns: OpenAI/Anthropic configuration for Iraqi dialect processing

# Prebuilt examples researched
- path: examples/main_agent_reference/
  content: Production-grade PydanticAI agent architecture with environment configuration
  patterns: Settings.py with pydantic-settings, providers.py, dependency injection patterns

- path: examples/professional-etiquette/iraqi-business-protocols.py
  content: Comprehensive Iraqi business etiquette and professional protocols system
  patterns: Professional title handling, cultural validation, business communication

- path: examples/cultural-validation/cultural-appropriateness-scorer.py
  content: Cultural validation and scoring for Iraqi AI responses
  patterns: Sensitivity analysis, religious appropriateness, family context validation
```

### Iraqi Professional Context Research

```yaml
# Iraqi Legal System Integration - Researched 2025
legal_context:
  framework: "Iraqi Constitution 2005 (supreme law), Iraqi Civil Code, Islamic Sharia (personal status)"
  recent_developments: "2025 Personal Status Law amendment allows couples to choose between 1959 law or Shia Ja'afari jurisprudence"
  language_requirements: "Arabic primary, Kurdish co-official in Kurdistan Region"
  professional_standards: "Iraqi legal system combines civil law with Islamic Sharia principles"

# Iraqi Medical System - WHO Supported
medical_context:
  oversight: "Ministry of Health primary oversight with WHO support"
  terminology_status: "Arabic medical terminology integrated into Global Medical Device Nomenclature (GMDN) 2025"
  system_challenges: "Infrastructure gaps, qualified healthcare worker shortages"
  recent_improvements: "District Health Information System 2 (DHIS2) implementation"

# Iraqi Education System - UNICEF Analysis
educational_context:
  structure: "6 years primary + 3 years intermediate + 3 years secondary"
  challenges: "3.2 million school-aged children out of school (2025)"
  reform_goals: "Child-centered teaching, critical thinking over memorization"
  curriculum: "Islamic education, Arabic, English, sciences with Baccalaureate tests"

# Iraqi Engineering Standards - Ministry Analysis
engineering_context:
  code_status: "No unified Iraqi building code - uses American/British/Arabic codes"
  liability: "10-year liability period for engineers and contractors"
  licensing: "Iraqi Engineers Syndicate registration required"
  recent_updates: "Energy efficiency standards (Iraqi Standards 402, 505, 506)"
```

### Cultural Sensitivity Research

```yaml
# Iraqi Cultural Framework - Validated Patterns
cultural_validation:
  religious_integration:
    appropriate_expressions: ["بسم الله", "الحمد لله", "إن شاء الله", "ماشاء الله", "بارك الله فيك"]
    inappropriate_patterns: ["الله.*يلعن", "حرام.*على", "كفر.*"]
    validation_score: "Religious appropriateness impacts cultural score by ±0.2"

  professional_titles:
    legal: ["أستاذ", "المحامي", "دكتور في القانون", "قاضي"]
    medical: ["دكتور", "الطبيب", "الدكتورة", "أستاذ دكتور"]
    educational: ["أستاذ", "معلم", "مدرس", "بروفيسور"]
    engineering: ["مهندس", "المهندس", "أستاذ مهندس"]

  iraqi_dialect_markers: ["شلونك", "شكو ماكو", "أهلين", "وين", "شنو", "جان"]
  
  sensitivity_categories:
    political: {weight: 0.9, action: "block", keywords: ["sectarian", "political party", "government criticism"]}
    religious: {weight: 0.8, action: "review", keywords: ["blasphemy", "religious criticism"]}
    social: {weight: 0.6, action: "modify", keywords: ["gender inappropriate", "family criticism"]}
```

### Security and Professional Ethics Patterns

```yaml
# Professional Boundary Enforcement - Critical Implementation
boundary_enforcement:
  lawyer_boundaries:
    prohibited: ["specific legal advice", "case outcome prediction", "legal representation", "contract interpretation"]
    disclaimer: "هذه معلومات عامة وليست استشارة قانونية. يرجى استشارة محامٍ مؤهل في العراق."
    
  doctor_boundaries:
    prohibited: ["medical diagnosis", "prescription", "treatment plans", "emergency handling"]
    disclaimer: "هذه معلومات صحية عامة وليست تشخيصاً طبياً. راجع طبيباً مختصاً."
    
  teacher_boundaries:
    prohibited: ["learning disability diagnosis", "psychological assessment", "academic placement decisions"]
    disclaimer: "هذه إرشادات تعليمية عامة. للمساعدة المتخصصة، راجع أخصائي تربوي."
    
  engineer_boundaries:
    prohibited: ["structural design approval", "safety certification", "official inspection", "construction plan approval"]
    disclaimer: "هذه معلومات هندسية عامة. للموافقات الرسمية، راجع مهندساً مرخصاً في العراق."

# Rate Limiting for Professional Advice - Prevent Abuse
rate_limiting:
  lawyer: {per_hour: 10, per_day: 50}
  doctor: {per_hour: 15, per_day: 75}
  teacher: {per_hour: 20, per_day: 100}
  engineer: {per_hour: 15, per_day: 60}
  general: {per_hour: 30, per_day: 150}
```

## Implementation Blueprint

### Technology Research Phase - COMPLETED

✅ **PydanticAI Framework Mastery:**
- [x] Agent creation patterns for multi-domain professional expertise
- [x] Model provider configuration with OpenAI/Anthropic for Iraqi dialect
- [x] Tool integration patterns for cultural validation and boundary enforcement
- [x] Dependency injection system for Iraqi professional context
- [x] Testing strategies with TestModel/FunctionModel for cultural scenarios

✅ **Iraqi Professional Domain Architecture:**
- [x] Multi-domain system prompt strategies for legal/medical/educational/engineering contexts
- [x] Cultural validation integration with Islamic values and Iraqi customs
- [x] Professional boundary enforcement with appropriate disclaimers
- [x] Arabic-English terminology translation for professional vocabulary
- [x] Iraqi dialect recognition and response patterns

✅ **Security and Cultural Validation:**
- [x] Cultural appropriateness scoring with Iraqi-specific sensitivity categories
- [x] Professional boundary validation with domain-specific prohibited actions
- [x] Rate limiting implementation for professional advice abuse prevention
- [x] Input validation and sanitization for cultural and professional contexts
- [x] Logging and monitoring for cultural compliance and professional ethics

### Agent Implementation Plan

```yaml
Implementation Task 1 - Professional Agent Architecture Setup:
  CREATE professional agent project structure:
    - settings.py: Environment-based configuration with Iraqi cultural context settings
    - providers.py: Model provider abstraction optimized for Iraqi dialect processing
    - agent.py: Main professional agent with multi-domain system prompts
    - tools.py: Cultural validation, boundary enforcement, and domain routing tools
    - models.py: Professional query validation and cultural context models
    - dependencies.py: Iraqi professional context and validation system integration
    - tests/: Comprehensive test suite with Iraqi cultural scenarios

Implementation Task 2 - Core Professional Agent Development:
  IMPLEMENT agent.py following production patterns:
    - Multi-domain system prompt with Iraqi professional context
    - Dependency injection for cultural validation and professional boundary systems
    - String output default with structured validation for boundary enforcement
    - Professional domain routing with cultural context preservation
    - Comprehensive error handling and logging for cultural and professional compliance

Implementation Task 3 - Cultural Validation and Professional Tools:
  DEVELOP tools.py with Iraqi-specific capabilities:
    - Cultural appropriateness validation tool with Iraqi sensitivity categories
    - Professional boundary enforcement tool with domain-specific restrictions
    - Iraqi dialect recognition and Arabic-English terminology translation
    - Professional domain routing with contextual knowledge management
    - Disclaimer generation tool with Arabic-English professional disclaimers

Implementation Task 4 - Iraqi Professional Context Models:
  CREATE models.py and dependencies.py:
    - Iraqi professional query validation models with cultural context
    - Professional dependency classes for domain-specific knowledge systems
    - Cultural sensitivity analysis models with Islamic values integration
    - Professional boundary validation models with ethical enforcement
    - Rate limiting and session management for professional advice

Implementation Task 5 - Comprehensive Cultural and Professional Testing:
  IMPLEMENT testing suite with Iraqi context:
    - TestModel integration for Iraqi dialect and cultural sensitivity testing
    - FunctionModel tests for professional boundary enforcement validation
    - Cultural appropriateness scoring validation with Iraqi scenarios
    - Professional domain knowledge testing across legal/medical/educational/engineering
    - Integration tests with real provider and Iraqi professional context

Implementation Task 6 - Production Security and Cultural Compliance:
  SETUP production-ready security and monitoring:
    - Environment variable management for API keys and cultural configuration
    - Cultural appropriateness monitoring with real-time validation
    - Professional boundary compliance logging and alerting
    - Rate limiting implementation with professional advice abuse prevention
    - Iraqi cultural compliance reporting and continuous improvement
```

## Validation Loop

### Level 1: Agent Structure and Cultural Integration Validation

```bash
# Verify complete professional agent project structure
find iraqi_professional_agent -name "*.py" | sort
test -f iraqi_professional_agent/agent.py && echo "Professional agent definition present"
test -f iraqi_professional_agent/tools.py && echo "Cultural validation tools present"
test -f iraqi_professional_agent/models.py && echo "Professional context models present"
test -f iraqi_professional_agent/dependencies.py && echo "Iraqi context dependencies present"

# Verify Iraqi cultural integration patterns
grep -q "IraqiProfessionalContext" iraqi_professional_agent/dependencies.py
grep -q "cultural_appropriateness" iraqi_professional_agent/tools.py
grep -q "professional_boundary" iraqi_professional_agent/tools.py
grep -q "iraqi_dialect" iraqi_professional_agent/tools.py

# Verify professional domain patterns
grep -q "lawyer.*doctor.*teacher.*engineer" iraqi_professional_agent/agent.py
grep -q "disclaimer.*arabic.*english" iraqi_professional_agent/tools.py

# Expected: All required files with Iraqi professional patterns
# If missing: Generate missing components with cultural validation
```

### Level 2: Professional Agent Functionality Validation

```bash
# Test agent can be imported with Iraqi context
python -c "
from iraqi_professional_agent.agent import iraqi_professional_agent
from iraqi_professional_agent.dependencies import IraqiProfessionalDependencies
print('Iraqi professional agent created successfully')
print(f'Tools available: {len(iraqi_professional_agent.tools)}')
deps = IraqiProfessionalDependencies(api_key='test', profession='lawyer', cultural_context='iraqi')
print(f'Iraqi context configured: {deps.cultural_context}')
"

# Test with TestModel for cultural validation
python -c "
from pydantic_ai.models.test import TestModel
from iraqi_professional_agent.agent import iraqi_professional_agent
from iraqi_professional_agent.dependencies import IraqiProfessionalDependencies

test_model = TestModel()
deps = IraqiProfessionalDependencies(api_key='test', profession='lawyer', cultural_context='iraqi')

with iraqi_professional_agent.override(model=test_model):
    result = iraqi_professional_agent.run_sync('شلونك أستاذ؟ أحتاج مساعدة قانونية', deps=deps)
    print(f'Iraqi dialect response: {result.data[:100]}...')
    
    # Test professional boundary enforcement
    result = iraqi_professional_agent.run_sync('Can you give me specific legal advice about my case?', deps=deps)
    assert 'cannot provide specific legal advice' in result.data.lower()
    print('Professional boundary enforcement working')
"

# Expected: Agent handles Iraqi dialect, enforces professional boundaries
# If failing: Debug cultural validation and boundary enforcement
```

### Level 3: Cultural Sensitivity and Professional Boundary Testing

```bash
# Run comprehensive cultural and professional testing
cd iraqi_professional_agent
python -m pytest tests/ -v -k "cultural"
python -m pytest tests/ -v -k "professional"
python -m pytest tests/ -v -k "iraqi"

# Test specific cultural scenarios
python -c "
from iraqi_professional_agent.tools import validate_cultural_appropriateness
from iraqi_professional_agent.dependencies import IraqiProfessionalDependencies

# Test Iraqi greeting
result = validate_cultural_appropriateness(None, 'شلونك؟ كيف الصحة؟')
print(f'Iraqi greeting validation: {result}')

# Test inappropriate content
result = validate_cultural_appropriateness(None, 'Political criticism content')
print(f'Political content blocked: {\"blocked\" in result.lower()}')
"

# Test professional boundary enforcement
python -c "
from iraqi_professional_agent.tools import enforce_professional_boundaries
from iraqi_professional_agent.dependencies import IraqiProfessionalDependencies

# Test medical boundary
deps = IraqiProfessionalDependencies(api_key='test', profession='doctor')
result = enforce_professional_boundaries(deps, 'medical', 'Can you diagnose my symptoms?')
print(f'Medical boundary enforced: {\"cannot diagnose\" in result.lower()}')

# Test legal boundary  
deps.profession = 'lawyer'
result = enforce_professional_boundaries(deps, 'legal', 'What will happen in my court case?')
print(f'Legal boundary enforced: {\"cannot predict\" in result.lower()}')
"

# Expected: All cultural and professional validation tests pass
# If failing: Fix cultural sensitivity scoring and boundary enforcement
```

### Level 4: Production Iraqi Professional Compliance Validation

```bash
# Verify Iraqi cultural compliance patterns
grep -r "Islamic.*values" iraqi_professional_agent/ | wc -l  # Should have Islamic values integration
grep -r "iraqi.*dialect" iraqi_professional_agent/ | wc -l  # Should have Iraqi dialect handling
grep -r "cultural.*sensitivity" iraqi_professional_agent/ | wc -l  # Should have cultural validation

# Check professional ethics compliance
grep -r "disclaimer.*arabic" iraqi_professional_agent/ | wc -l  # Should have Arabic disclaimers
grep -r "professional.*boundary" iraqi_professional_agent/ | wc -l  # Should have boundary enforcement
grep -r "rate.*limit" iraqi_professional_agent/ | wc -l  # Should have rate limiting

# Verify security and monitoring
grep -r "API_KEY" iraqi_professional_agent/ | grep -v ".py:" # Should not expose keys
test -f iraqi_professional_agent/.env.example && echo "Environment template present"
grep -r "logging\|logger" iraqi_professional_agent/ | wc -l  # Should have comprehensive logging

# Test Iraqi professional scenarios end-to-end
python -c "
from iraqi_professional_agent.agent import iraqi_professional_agent
from iraqi_professional_agent.dependencies import IraqiProfessionalDependencies
from pydantic_ai.models.test import TestModel

# Test comprehensive Iraqi professional scenario
test_model = TestModel()
deps = IraqiProfessionalDependencies(
    api_key='test',
    profession='lawyer', 
    cultural_context='iraqi',
    language_preference='arabic'
)

with iraqi_professional_agent.override(model=test_model):
    # Test Iraqi legal context
    result = iraqi_professional_agent.run_sync(
        'أحتاج معلومات عن القانون المدني العراقي',
        deps=deps
    )
    print('Iraqi legal context handled successfully')
    
    # Test cultural sensitivity
    result = iraqi_professional_agent.run_sync(
        'بارك الله فيكم، كيف أتعامل مع قضية عقارية؟',
        deps=deps
    )
    print('Islamic courtesy phrases and cultural context integrated')
"

# Expected: Full Iraqi cultural integration with professional compliance
# If issues: Implement comprehensive Iraqi cultural validation and professional ethics
```

## Final Validation Checklist

### Iraqi Professional Agent Implementation Completeness

- [ ] Complete Iraqi professional agent structure with cultural validation integration
- [ ] Multi-domain professional expertise (legal, medical, educational, engineering)
- [ ] Iraqi cultural context integration with Islamic values respect
- [ ] Arabic-English professional terminology translation capability
- [ ] Iraqi dialect recognition and appropriate response generation
- [ ] Professional boundary enforcement with Arabic-English disclaimers

### Cultural Sensitivity and Professional Ethics

- [ ] Cultural appropriateness scoring system with Iraqi-specific sensitivity categories
- [ ] Islamic values integration with appropriate religious expressions
- [ ] Political and sectarian content filtering for Iraqi context
- [ ] Professional ethics compliance with domain-specific boundary enforcement
- [ ] Rate limiting implementation for professional advice abuse prevention
- [ ] Comprehensive logging for cultural compliance and professional ethics monitoring

### Production Readiness for Iraqi Context

- [ ] Environment configuration with Iraqi cultural settings validation
- [ ] Security patterns for cultural data and professional information protection
- [ ] Monitoring and alerting for cultural appropriateness and professional compliance
- [ ] Performance optimization for Arabic text processing and cultural validation
- [ ] Deployment readiness with Iraqi cultural configuration management
- [ ] Maintenance strategies for evolving Iraqi professional standards and cultural requirements

---

## Anti-Patterns to Avoid

### Iraqi Cultural Integration

- ❌ Don't ignore cultural validation - Iraqi cultural appropriateness is mandatory for all responses
- ❌ Don't skip Islamic values integration - Respect for Islamic principles is fundamental
- ❌ Don't oversimplify dialect handling - Iraqi dialect has specific vocabulary and expression patterns
- ❌ Don't ignore sectarian sensitivity - Political and sectarian content must be carefully filtered
- ❌ Don't skip family context validation - Iraqi family structures and social norms require respect

### Professional Domain Implementation

- ❌ Don't weaken professional boundaries - Ethical boundaries are non-negotiable for professional advice
- ❌ Don't skip disclaimers - Professional liability protection requires comprehensive disclaimers
- ❌ Don't ignore domain-specific knowledge - Each profession has unique Iraqi context requirements
- ❌ Don't oversimplify terminology translation - Professional Arabic-English translation requires precision
- ❌ Don't skip rate limiting - Professional advice abuse prevention is essential

### Security and Compliance

- ❌ Don't expose cultural configuration - Protect cultural validation rules and sensitivity thresholds
- ❌ Don't skip professional compliance monitoring - Track adherence to professional ethics
- ❌ Don't ignore cultural change - Iraqi cultural standards evolve and require ongoing validation
- ❌ Don't deploy without comprehensive testing - Cultural and professional scenarios must be thoroughly tested

**CONFIDENCE SCORE: 9/10** - This PRP provides comprehensive context, implementation patterns, and validation strategies for successful one-pass implementation of a culturally-sensitive Iraqi professional domains agent with proper ethical boundaries and cultural validation.