---
name: "Iraqi Dialect Processing Agent"
description: "Comprehensive PRP for building a PydanticAI agent specialized in Iraqi Arabic dialect recognition, regional variation handling, and cultural context processing"
---

## Purpose

Build a sophisticated PydanticAI agent specialized in Iraqi Arabic dialect processing that provides authentic Iraqi dialect recognition, regional language variation handling (Baghdad, Basra, Mosul), and culturally appropriate dialectal responses with 85%+ accuracy for Iraqi dialect recognition and sub-100ms processing performance.

## Core Principles

1. **Iraqi Dialect Authenticity**: Deep integration with Iraqi linguistic patterns and regional variations (Gelet vs Qeltu paradigms)
2. **Production Ready**: Include security, testing, and cultural validation for production deployments
3. **Type Safety First**: Leverage PydanticAI's type-safe design and Pydantic validation throughout
4. **Cultural Context Engineering**: Apply Iraqi cultural awareness to dialect processing workflows
5. **Comprehensive Testing**: Use TestModel and FunctionModel for thorough agent validation with Iraqi dialect test cases

## ⚠️ Implementation Guidelines: Focus on Iraqi Authenticity

**IMPORTANT**: Keep your agent implementation focused on authentic Iraqi dialect processing. Don't build unnecessary complexity.

### What NOT to do:
- ❌ **Don't create generic Arabic processors** - Build specifically for Iraqi dialect variations
- ❌ **Don't over-complicate linguistic analysis** - Focus on practical dialect recognition and regional handling
- ❌ **Don't add unnecessary dialects** - Iraqi dialect only (Baghdad, Basra, Mosul)
- ❌ **Don't build complex conversational features** unless specifically required
- ❌ **Don't add structured output** unless validation is specifically needed (default to string)

### What TO do:
- ✅ **Start with core Iraqi patterns** - Focus on Gelet/Qeltu classification and regional recognition
- ✅ **Add tools incrementally** - Implement only dialect processing tools that are needed
- ✅ **Follow existing Arabic processor patterns** - Use proven patterns from arabic-rtl-processor agent
- ✅ **Use string output by default** - Only add result_type when validation is required
- ✅ **Test with Iraqi text samples** - Use actual Iraqi dialect text for validation

### Key Question:
**"Does this agent really need this feature to accomplish Iraqi dialect processing?"**

If the answer is no, don't build it. Keep it simple, focused, and functionally Iraqi.

---

## Goal

Create a production-ready PydanticAI agent that accurately processes Iraqi Arabic dialect with regional variation handling, providing:

- **Iraqi Dialect Classification**: Distinguish between Gelet (Baghdad) and Qeltu (Mosul) paradigms
- **Regional Recognition**: Identify Baghdad, Basra, and Mosul dialectal patterns
- **Cultural Context Processing**: Extract Iraqi cultural context from dialect usage
- **Mixed Language Handling**: Process Arabic-English code-switching common in Iraqi digital communication
- **Performance Optimization**: Achieve sub-100ms processing with 85%+ accuracy

## Why

Iraqi AI Chat System requires authentic Iraqi dialect recognition to:
- Provide culturally appropriate responses to Iraqi users
- Maintain regional authenticity across different Iraqi governorates
- Support Iraqi professional domains with proper dialect handling
- Enable effective communication for Iraqi diaspora communities

## What

### Agent Type Classification
- [x] **Tool-Enabled Agent**: Agent with Iraqi dialect processing tools and external integrations
- [ ] **Chat Agent**: Conversational interface with memory and context
- [ ] **Workflow Agent**: Multi-step task processing and orchestration
- [ ] **Structured Output Agent**: Complex data validation and formatting

### Model Provider Requirements
- [x] **OpenAI**: `openai:gpt-4o` or `openai:gpt-4o-mini` (primary - excellent Arabic handling)
- [x] **Anthropic**: `anthropic:claude-3-5-sonnet-20241022` (fallback - strong linguistic analysis)
- [ ] **Google**: `gemini-1.5-flash` or `gemini-1.5-pro`
- [x] **Fallback Strategy**: Multiple provider support with automatic failover

### External Integrations
- [ ] Database connections (optional: dialect pattern storage)
- [ ] REST API integrations (optional: linguistic validation services)
- [ ] File system operations (text processing)
- [x] Cultural validation services (integration with iraqi-cultural-validator)
- [x] Arabic RTL processing (integration with arabic-rtl-processor)

### Success Criteria
- [x] Agent successfully processes Iraqi dialect text with 85%+ accuracy
- [x] Regional variation detection (Baghdad, Basra, Mosul) works correctly
- [x] Cultural context extraction provides meaningful insights
- [x] Performance meets sub-100ms processing requirements
- [x] Security measures implemented (API keys, input validation, rate limiting)
- [x] Comprehensive test coverage with TestModel and Iraqi dialect samples

## All Needed Context

### PydanticAI Documentation & Research

```yaml
# ESSENTIAL PYDANTIC AI DOCUMENTATION - Researched and Available
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

# Iraqi Codebase Reference Patterns
- path: .claude/agents/arabic-rtl-processor.md
  why: Existing Arabic processing agent with Iraqi dialect capabilities
  content: RTL handling, dialect recognition, cultural context processing, performance optimization

- path: examples/trae-agent-extracted/enhanced_pydantic_iraqi_agent.py
  why: Comprehensive Iraqi PydanticAI agent implementation
  content: Iraqi cultural compliance, Arabic processing, dependency injection, tool patterns
```

### Iraqi Dialect Research Context

```yaml
# Arabic Dialect Processing Research - 2025 Current State
research_findings:
  iraqi_dialect_classification:
    - "Gelet vs Qeltu paradigm based on 'I said': Baghdad=gilit, Mosul=qeltu"
    - "Phonological differences: Iraqi has 3 more consonants than MSA"
    - "Regional variations: Baghdad (amplified sounds), Basra (Gulf-like), Mosul (qaf pronunciation)"
    
  performance_benchmarks:
    - "MSA ASR: 13% WER, Dialectal ASR: 30% WER (2025 research)"
    - "Arabic dialects show 67% avg character difference, 87% avg phoneme difference"
    - "Deep learning models effective for social media dialectal text processing"
    
  key_linguistic_features:
    - "Baghdad: /o/ sound in 'shino' (what), ch/k variation, foreign lexical borrowings"
    - "Mosul: R→غ replacement, qaf as /q/, vocabulary from Turkish/Persian/Kurdish"
    - "Basra: Gulf-like with Persian/English/Turkish influences"
    
  cultural_context:
    - "No case marking unlike MSA, lacks agreement structure"
    - "Christian vs Muslim dialect variations in Baghdad"
    - "Aramaic substrate influences in Mesopotamian Arabic"
```

### Existing Iraqi AI System Patterns

```yaml
# Iraqi AI System Architecture Context
existing_patterns:
  cultural_validation:
    - "95%+ cultural appropriateness required for ALL content"
    - "Islamic compliance checking with scholar triggers"
    - "Sectarian neutrality and family privacy protection"
    
  arabic_processing:
    - "99%+ RTL accuracy target, 85%+ dialect recognition"
    - "Mixed Arabic-English content handling"
    - "Font selection with font-arabic class and typography"
    
  performance_targets:
    - "<100ms Arabic processing, <200ms cultural validation"
    - "35% performance improvement through context management"
    - "Bun runtime optimization for rapid testing"
    
  integration_patterns:
    - "Coordinate with Magic MCP for UI components"
    - "Use Sequential MCP for complex linguistic analysis"
    - "Supabase integration for dialect pattern storage"
```

### Security and Production Considerations

```yaml
# Iraqi AI System Security Patterns
security_requirements:
  api_management:
    environment_variables: ["OPENAI_API_KEY", "ANTHROPIC_API_KEY"]
    secure_storage: "Never commit API keys to version control"
    cultural_compliance: "Validate all inputs for Iraqi cultural appropriateness"
  
  input_validation:
    sanitization: "Validate all Arabic text inputs with Pydantic models"
    dialect_security: "Preserve Iraqi dialect while filtering malicious content"
    rate_limiting: "Prevent abuse with proper throttling"
  
  output_security:
    cultural_filtering: "Ensure no culturally inappropriate content in responses"
    content_validation: "Validate Iraqi dialect authenticity and cultural compliance"
    privacy_protection: "Maintain Iraqi family privacy and honor considerations"
```

### Iraqi Dialect Processing Gotchas

```yaml
# Agent-specific gotchas researched and documented
implementation_gotchas:
  dialect_complexity:
    issue: "Iraqi dialect has two major paradigms (Gelet/Qeltu) with distinct phonological systems"
    research: "Mesopotamian Arabic linguistic patterns and regional variations"
    solution: "Implement dual classification system with regional pattern matching"
  
  cultural_sensitivity:
    issue: "Iraqi dialect carries cultural and religious context markers"
    research: "Iraqi cultural compliance and Islamic appropriateness requirements"
    solution: "Integrate with iraqi-cultural-validator for context validation"
  
  performance_challenges:
    issue: "Dialectal ASR performs worse than MSA (30% vs 13% WER)"
    research: "Current NLP performance benchmarks for Arabic dialects"
    solution: "Focus on lexical and cultural pattern recognition rather than full ASR"
  
  mixed_language_handling:
    issue: "Iraqi users frequently code-switch between Arabic and English"
    research: "Digital communication patterns in Iraqi communities"
    solution: "Implement mixed content detection with directional isolation"
```

## Implementation Blueprint

### Technology Research Phase - COMPLETED

**RESEARCH COMPLETED - Ready for implementation:**

✅ **PydanticAI Framework Deep Dive:**
- [x] Agent creation patterns and best practices
- [x] Model provider configuration (OpenAI primary, Anthropic fallback)
- [x] Tool integration patterns (@agent.tool with RunContext)
- [x] Dependency injection system with dataclass patterns
- [x] Testing strategies with TestModel and FunctionModel

✅ **Iraqi Dialect Architecture Investigation:**
- [x] Existing arabic-rtl-processor agent patterns in codebase
- [x] Enhanced Iraqi PydanticAI agent implementation reference
- [x] Iraqi dialect linguistic features (Gelet/Qeltu paradigms)
- [x] Regional variations (Baghdad, Basra, Mosul) characteristics
- [x] Cultural validation and compliance patterns

✅ **Security and Production Patterns:**
- [x] API key management with environment variables
- [x] Iraqi cultural validation and Islamic compliance checking
- [x] Input validation and dialect preservation patterns
- [x] Performance optimization with Bun runtime
- [x] Integration with existing Iraqi AI system components

### Agent Implementation Plan

```yaml
Implementation Task 1 - Iraqi Dialect Agent Architecture Setup:
  CREATE iraqi_dialect_agent project structure:
    - settings.py: Environment configuration with Iraqi-specific settings
    - providers.py: Model provider abstraction (OpenAI primary, Anthropic fallback)
    - agent.py: Main Iraqi dialect agent with string output default
    - tools.py: Iraqi dialect processing tools with @agent.tool decorators
    - models.py: Pydantic models for Iraqi dialect analysis results
    - dependencies.py: Iraqi dialect processing dependencies (dataclass)
    - tests/: Comprehensive test suite with Iraqi dialect text samples

Implementation Task 2 - Core Iraqi Dialect Agent Development:
  IMPLEMENT agent.py following enhanced_pydantic_iraqi_agent.py patterns:
    - Use get_llm_model() for model configuration with fallback strategy
    - System prompt specialized for Iraqi dialect processing
    - IraqiDialectDependencies with cultural validation integration
    - Default string output (no structured output unless needed)
    - Error handling with cultural sensitivity preservation

Implementation Task 3 - Iraqi Dialect Processing Tools:
  DEVELOP tools.py with specialized Iraqi dialect capabilities:
    - detect_iraqi_dialect: Gelet vs Qeltu classification tool
    - identify_regional_variation: Baghdad, Basra, Mosul recognition
    - extract_cultural_context: Iraqi cultural markers from dialect
    - validate_mixed_content: Arabic-English code-switching handling
    - assess_dialect_authenticity: Iraqi authenticity scoring

Implementation Task 4 - Iraqi Dialect Models and Dependencies:
  CREATE models.py and dependencies.py for Iraqi specificity:
    - IraqiDialectResult: Pydantic model for dialect analysis results
    - RegionalVariation enum: Baghdad, Basra, Mosul classifications
    - CulturalContext model: Iraqi cultural markers and confidence scores
    - IraqiDialectDependencies: Cultural validator, Arabic processor integration
    - Validation models with Iraqi-specific constraints

Implementation Task 5 - Comprehensive Iraqi Dialect Testing:
  IMPLEMENT testing suite with Iraqi authenticity focus:
    - TestModel integration with Iraqi dialect test cases
    - FunctionModel tests for regional variation recognition
    - Agent.override() patterns for cultural compliance testing
    - Integration tests with real Iraqi dialect text samples
    - Performance validation for <100ms processing target

Implementation Task 6 - Iraqi Cultural Security and Configuration:
  SETUP Iraqi-specific security patterns:
    - Environment variable management for model API keys
    - Iraqi cultural validation input sanitization
    - Rate limiting with dialect preservation
    - Secure logging without exposing Iraqi personal data
    - Production deployment with cultural compliance monitoring
```

## Validation Loop

### Level 1: Iraqi Dialect Agent Structure Validation

```bash
# Verify complete Iraqi dialect agent project structure
find iraqi_dialect_agent -name "*.py" | sort
test -f iraqi_dialect_agent/agent.py && echo "Iraqi dialect agent definition present"
test -f iraqi_dialect_agent/tools.py && echo "Iraqi dialect tools module present"
test -f iraqi_dialect_agent/models.py && echo "Iraqi models module present"
test -f iraqi_dialect_agent/dependencies.py && echo "Iraqi dependencies module present"

# Verify proper PydanticAI imports with Iraqi specificity
grep -q "from pydantic_ai import Agent" iraqi_dialect_agent/agent.py
grep -q "@agent.tool" iraqi_dialect_agent/tools.py
grep -q "IraqiDialectResult" iraqi_dialect_agent/models.py

# Expected: All required files with Iraqi dialect-specific patterns
# If missing: Generate missing components with Iraqi authenticity focus
```

### Level 2: Iraqi Dialect Functionality Validation

```bash
# Test Iraqi dialect agent can be imported and instantiated
python -c "
from iraqi_dialect_agent.agent import iraqi_dialect_agent
print('Iraqi Dialect Agent created successfully')
print(f'Model: {iraqi_dialect_agent.model}')
print(f'Tools: {len(iraqi_dialect_agent.tools)}')
print(f'Iraqi Dialect Tools: [tool for tool in iraqi_dialect_agent.tools if \"iraqi\" in tool or \"dialect\" in tool]')
"

# Test with TestModel for Iraqi dialect validation
python -c "
from pydantic_ai.models.test import TestModel
from iraqi_dialect_agent.agent import iraqi_dialect_agent
test_model = TestModel()
with iraqi_dialect_agent.override(model=test_model):
    # Test with Iraqi dialect text
    result = iraqi_dialect_agent.run_sync('شلونك؟ شكو ماكو؟')  # Iraqi greeting
    print(f'Iraqi Dialect Agent response: {result.output}')
"

# Expected: Agent handles Iraqi dialect text, tools registered, TestModel validation passes
# If failing: Debug Iraqi dialect configuration and tool registration
```

### Level 3: Iraqi Dialect Processing Validation

```bash
# Run complete Iraqi dialect test suite
cd iraqi_dialect_agent
python -m pytest tests/ -v

# Test specific Iraqi dialect behavior
python -m pytest tests/test_iraqi_agent.py::test_gelet_qeltu_classification -v
python -m pytest tests/test_tools.py::test_regional_variation_detection -v
python -m pytest tests/test_models.py::test_iraqi_cultural_context -v

# Test with actual Iraqi dialect samples
python -m pytest tests/test_iraqi_samples.py::test_baghdadi_dialect -v
python -m pytest tests/test_iraqi_samples.py::test_moslawi_dialect -v
python -m pytest tests/test_iraqi_samples.py::test_basrawi_dialect -v

# Expected: All tests pass with Iraqi dialect authenticity achieved
# If failing: Fix implementation based on Iraqi dialect requirements
```

### Level 4: Iraqi Cultural Compliance Validation

```bash
# Verify Iraqi cultural validation integration
grep -r "iraqi_cultural_validator" iraqi_dialect_agent/
grep -r "cultural_compliance" iraqi_dialect_agent/

# Check Iraqi dialect preservation
python -c "
from iraqi_dialect_agent.agent import iraqi_dialect_agent
# Test cultural sensitivity preservation
result = iraqi_dialect_agent.run_sync('عائلتي محترمة جداً')  # My family is very respected
print(f'Cultural compliance maintained: {result.output}')
"

# Verify performance targets
python -c "
import time
from iraqi_dialect_agent.agent import iraqi_dialect_agent
start_time = time.time()
result = iraqi_dialect_agent.run_sync('شلونك؟')
processing_time = (time.time() - start_time) * 1000
print(f'Processing time: {processing_time:.2f}ms (target: <100ms)')
assert processing_time < 100, f'Performance target not met: {processing_time}ms'
"

# Expected: Cultural compliance verified, performance targets met
# If issues: Implement missing Iraqi cultural patterns and optimize performance
```

## Final Validation Checklist

### Iraqi Dialect Agent Implementation Completeness

- [ ] Complete Iraqi dialect agent structure: `agent.py`, `tools.py`, `models.py`, `dependencies.py`
- [ ] Iraqi dialect agent with proper OpenAI/Anthropic model configuration
- [ ] Iraqi dialect tools: detect_iraqi_dialect, identify_regional_variation, extract_cultural_context
- [ ] Iraqi-specific Pydantic models for dialect analysis results
- [ ] IraqiDialectDependencies with cultural validator integration
- [ ] Comprehensive test suite with Iraqi dialect text samples and regional variations

### Iraqi Dialect Processing Best Practices

- [ ] Gelet/Qeltu paradigm classification with 85%+ accuracy
- [ ] Regional variation recognition (Baghdad, Basra, Mosul) with confidence scores
- [ ] Cultural context extraction with Iraqi authenticity validation
- [ ] Mixed Arabic-English content handling with directional isolation
- [ ] Performance optimization achieving sub-100ms processing target
- [ ] Error handling with Iraqi cultural sensitivity preservation

### Iraqi Cultural Production Readiness

- [ ] Environment configuration with secure API key management
- [ ] Iraqi cultural validation integration and compliance monitoring
- [ ] Input sanitization preserving Iraqi dialect authenticity
- [ ] Rate limiting and abuse prevention with cultural awareness
- [ ] Logging and monitoring without exposing Iraqi personal/cultural data
- [ ] Deployment readiness with cultural compliance validation

---

## Anti-Patterns to Avoid

### Iraqi Dialect Processing

- ❌ Don't treat Iraqi dialect as generic Arabic - implement specific Gelet/Qeltu recognition
- ❌ Don't ignore regional variations - Baghdad, Basra, Mosul have distinct patterns
- ❌ Don't skip cultural context - Iraqi dialect carries significant cultural markers
- ❌ Don't compromise on authenticity - 85%+ accuracy requirement is non-negotiable
- ❌ Don't ignore mixed content - Iraqi users frequently code-switch languages

### Iraqi Cultural Integration

- ❌ Don't process dialect without cultural validation - always maintain Iraqi appropriateness
- ❌ Don't expose sensitive cultural patterns - preserve family privacy and honor
- ❌ Don't ignore Islamic compliance - Iraqi dialect may contain religious context
- ❌ Don't treat dialects equally - respect regional Iraqi identity and authenticity
- ❌ Don't skip performance optimization - Iraqi users expect responsive processing

### PydanticAI Iraqi Implementation

- ❌ Don't overcomplicate with unnecessary structured output - string default is sufficient
- ❌ Don't skip dependency injection - cultural validator integration is essential
- ❌ Don't ignore fallback models - ensure reliability with Anthropic backup
- ❌ Don't skip TestModel validation - test with actual Iraqi dialect samples
- ❌ Don't deploy without cultural compliance verification

**RESEARCH STATUS: ✅ COMPLETED** - Comprehensive PydanticAI and Iraqi dialect research completed. Ready for focused implementation.

---

## Implementation Confidence Score

**PRP CONFIDENCE SCORE: 9/10**

**Strengths:**
- ✅ Comprehensive PydanticAI research with code examples and patterns
- ✅ Deep Iraqi dialect linguistic analysis with regional variations
- ✅ Existing codebase patterns for Arabic processing and cultural validation
- ✅ Clear performance targets and cultural compliance requirements
- ✅ Detailed validation loop with Iraqi-specific test cases
- ✅ Security and production patterns specific to Iraqi AI system
- ✅ Anti-patterns identified to avoid common pitfalls

**Potential Challenges (addressed in PRP):**
- Iraqi dialect complexity (Gelet/Qeltu paradigms) - Solution: Dual classification system
- Cultural sensitivity requirements - Solution: Integration with iraqi-cultural-validator
- Performance targets (<100ms) - Solution: Bun optimization and pattern caching
- Mixed language handling - Solution: Directional isolation with Unicode markers

**Success Probability:** Very High (90%+) - PRP provides comprehensive context, clear implementation path, and addresses all technical and cultural requirements for authentic Iraqi dialect processing.