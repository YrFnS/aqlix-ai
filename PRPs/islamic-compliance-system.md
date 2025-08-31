# PRP: Islamic Compliance System for Iraqi AI Chat System

## Overview

Implement a comprehensive Islamic compliance validation system using PydanticAI that ensures all content and AI interactions align with Islamic principles and Sharia-compliant standards. This system will provide real-time validation, scoring, and guidance for the Iraqi AI Chat System.

## Context & Research Findings

### Existing Codebase Patterns

Based on comprehensive codebase analysis, the following proven patterns exist:

**Primary Implementation References:**
- **TypeScript Architecture**: `C:\Users\Itokoro\Documents\projects\aqlix-ai\examples\arabic-rtl-integration\core\CulturalValidationPipeline.ts`
  - Event-driven validation pipeline with 0-100 scoring
  - Islamic compliance, cultural appropriateness, professional compliance scoring
  - <200ms performance with intelligent caching
  - Prayer time awareness, Ramadan sensitivity, halal content verification

- **Python Middleware**: `C:\Users\Itokoro\Documents\projects\aqlix-ai\examples\claude-code-router-extracted\middleware\cultural_validation_middleware.py`
  - Async middleware with specialized validators
  - IslamicComplianceMiddleware, ProfessionalDomainMiddleware patterns
  - Redis-like caching with configurable expiration
  - Graceful degradation with comprehensive logging

- **Islamic Compliance Node**: `C:\Users\Itokoro\Documents\projects\aqlix-ai\examples\n8n-extracted\custom-nodes\cultural-validation\IslamicComplianceNode.ts`
  - Prayer time checking, riba detection, halal business validation
  - Regional support for Baghdad, Basra, Mosul, Erbil, Najaf
  - Professional domain validation (medical, legal, educational, financial)
  - Multi-component scoring with weighted priorities

**Testing Patterns:** `C:\Users\Itokoro\Documents\projects\aqlix-ai\examples\testing_examples\test_agent_patterns.py`
- TestModel integration for fast development validation
- FunctionModel for custom behavior testing
- Agent.override() for test isolation with dependency injection
- Cultural scenario testing patterns

### External Research Context

**Islamic AI Ethics Guidelines (2025):**
- **Maqāṣid al-Sharīʿa Framework**: Protection of religion, life, intellect, lineage, property
- **Key Principles**: Maṣlaḥa (common good), Adl (justice), transparency, accountability
- **Regulatory Standards**: SAMA (Saudi Arabian Monetary Authority) frameworks
- **Academic Validation**: 98% accuracy in HALALCheck systems, 97.3% accuracy with GBM models

**Technical Implementation Standards:**
- **Performance Benchmarks**: <200ms cultural validation, <100ms Arabic processing
- **Scoring Thresholds**: 85% Islamic compliance, 80% cultural appropriateness
- **Validation Requirements**: 95%+ cultural appropriateness, 99%+ RTL accuracy

## Implementation Blueprint

### Architecture Overview

```
Islamic Compliance Agent System
├── agents/
│   └── islamic_compliance/
│       ├── __init__.py
│       ├── agent.py              # Main PydanticAI agent
│       ├── models.py             # Pydantic output models
│       ├── dependencies.py       # Dependency injection setup
│       ├── tools.py              # Islamic validation tools
│       ├── validators.py         # Output validators
│       └── config.py             # Configuration and constants
├── tests/
│   └── islamic_compliance/
│       ├── test_agent.py         # Agent integration tests
│       ├── test_tools.py         # Tool validation tests
│       ├── test_scenarios.py     # Islamic scenario tests
│       └── fixtures.py           # Test fixtures and data
└── examples/
    └── islamic_compliance_demo.py # Usage examples
```

### Core Implementation Strategy

**1. Agent Architecture (Following PydanticAI Best Practices)**
```python
# Follow pattern from existing cultural validation
class IslamicComplianceAgent:
    - Model: Multi-provider support (OpenAI, Anthropic, Google)
    - Dependencies: ComplianceDependencies with configuration
    - Output: IslamicComplianceReport (structured Pydantic model)
    - Tools: Sharia validation, content filtering, principle checking
```

**2. Structured Output Models**
```python
# Based on existing CulturalValidationPipeline patterns
class IslamicComplianceReport(BaseModel):
    overall_compliance: ComplianceResult    # 0-100 score + level
    sharia_validation: ShariaValidationResult
    content_filtering: ContentFilterResult
    principle_validation: PrincipleValidationResult
    recommendations: List[ComplianceRecommendation]
    processing_metadata: ValidationMetadata
```

**3. Tool Implementation Pattern**
```python
# Following existing Islamic compliance patterns with ModelRetry
@agent.tool
async def sharia_compliance_check(
    ctx: RunContext[ComplianceDependencies], 
    content: str,
    context_type: str = "general"
) -> ShariaValidationResult:
    # Implementation following riba detection patterns
    # Prayer time awareness from existing node
    # Error handling with ModelRetry for scholarly review
```

### Implementation Tasks (In Order)

1. **Setup Project Structure**
   - Create directory structure following existing patterns
   - Set up base configuration following cultural validation middleware
   - Configure testing framework with TestModel patterns

2. **Implement Core Models**
   - Define Pydantic models based on CulturalValidationPipeline interfaces
   - Create dependency injection models following existing patterns
   - Implement scoring algorithms from Islamic compliance node

3. **Develop Validation Tools**
   - Sharia compliance checker (following riba detection patterns)
   - Haram content filter (based on HALALCheck algorithms)
   - Prayer time validation (from existing Islamic compliance node)
   - Islamic principle validator (following Maqāṣid framework)

4. **Build PydanticAI Agent**
   - Initialize agent with structured output type
   - Register tools following existing registration patterns
   - Implement output validators with ModelRetry error handling
   - Add system prompts for Islamic guidance context

5. **Integration & Testing**
   - Unit tests for each tool using TestModel patterns
   - Integration tests with FunctionModel for scenario testing
   - Cultural scenario tests (prayer time conflicts, halal validation)
   - Performance testing to meet <200ms requirement

6. **Documentation & Examples**
   - Usage examples following existing documentation patterns
   - Integration guides for cultural validation pipeline
   - API documentation with Islamic compliance explanations

## Technical Specifications

### Dependencies
```python
# Primary Dependencies
pydantic-ai>=0.0.49        # Agent framework
pydantic>=2.0              # Data validation
asyncio                    # Async operations
httpx                      # HTTP client for external validation
python-dotenv              # Environment configuration

# Testing Dependencies
pytest                     # Testing framework
pytest-asyncio            # Async testing support
dirty-equals              # Flexible assertions
```

### Configuration Requirements
```python
# Following existing cultural validation patterns
ISLAMIC_COMPLIANCE_CONFIG = {
    "scoring_thresholds": {
        "islamic_compliance": 85,        # From research findings
        "cultural_appropriateness": 80,  # From existing patterns
        "overall_acceptance": 80         # Weighted average minimum
    },
    "performance_targets": {
        "validation_time_ms": 200,       # From existing standards
        "cache_hit_rate_target": 0.70,   # Performance optimization
        "prayer_time_tolerance_min": 5   # Flexibility for prayer times
    },
    "regional_settings": {
        "default_timezone": "Asia/Baghdad",
        "supported_cities": ["Baghdad", "Basra", "Mosul", "Erbil", "Najaf"],
        "prayer_time_calculation": "ISNA"  # Islamic Society of North America
    }
}
```

### Key Implementation Details

**1. Error Handling Strategy**
```python
# Following PydanticAI ModelRetry patterns
try:
    validation_result = await validate_islamic_principle(content)
    if validation_result.requires_scholarly_review:
        raise ModelRetry(
            "Content requires scholarly review. Please provide more context "
            "about Islamic compliance requirements."
        )
except ValidationError as e:
    raise ModelRetry(f"Islamic validation failed: {e}")
```

**2. Scoring Algorithm Integration**
```python
# Based on existing CulturalValidationPipeline scoring
def calculate_overall_compliance(
    sharia_score: float,
    content_filter_score: float, 
    principle_score: float
) -> ComplianceResult:
    # Weighted scoring based on existing patterns
    weights = {"sharia": 0.4, "content": 0.3, "principles": 0.3}
    overall = sum(score * weights[key] for key, score in scores.items())
    return ComplianceResult(score=overall, level=determine_level(overall))
```

**3. Caching Strategy**
```python
# Following cultural validation middleware caching patterns
@lru_cache(maxsize=1000)
async def cached_islamic_validation(
    content_hash: str,
    validation_type: str
) -> ValidationResult:
    # Implementation with TTL-based expiration
    # Cache hit rate targeting 70% for performance
```

## External Resources & Documentation

### Islamic AI Ethics References
- **Maqāṣid al-Sharīʿa Framework**: https://link.springer.com/article/10.1007/s13347-023-00668-x
- **Islamic AI Virtue Ethics**: https://link.springer.com/article/10.1007/s44163-022-00028-2
- **AI in Islamic Finance**: https://www.researchgate.net/publication/388223220_The_role_of_AI_in_enhancing_shariah_compliance_Efficiency_and_transparency_in_Islamic_finance
- **Islamic Law and AI**: https://islamiclaw.blog/2025/03/11/roundtable-the-book-and-ai-how-artificial-intelligence-is-and-is-not-changing-islamic-law/

### Technical Implementation References
- **HALALCheck System**: https://www.researchgate.net/publication/378348937_HALALCheck_A_Multi-Faceted_Approach_for_Intelligent_Halal_Packaged_Food_Recognition_and_Analysis
- **PydanticAI Documentation**: https://ai.pydantic.dev/
- **Tool Validation Guide**: https://atalupadhyay.wordpress.com/2025/01/01/custom-tools-and-validators-in-pydanticai-advanced-implementation-guide/

### Scholarly Validation Resources
- **Islamic Digital Guidelines**: Search for Sharia-compliant digital content standards
- **Halal Technology Standards**: Research religiously appropriate technology guidelines
- **Islamic Compliance Certification**: Look into certification schemes for Islamic AI systems

## Integration Points

### Cultural Validation System Integration
```python
# Integration with existing cultural validation pipeline
async def integrate_with_cultural_system(
    content: str,
    cultural_context: CulturalContext
) -> CombinedValidationResult:
    # Run Islamic compliance alongside cultural validation
    islamic_result = await islamic_compliance_agent.run(content)
    cultural_result = await cultural_validation_pipeline.validate(content)
    
    return combine_validation_results(islamic_result, cultural_result)
```

### Agent Workflow Integration
```python
# Integration with Iraqi AI agent workflow
from claude.agents.iraqi_cultural_validator import cultural_validator

async def comprehensive_validation(content: str) -> ValidationReport:
    # Chain Islamic compliance with cultural validation
    islamic_report = await islamic_compliance_agent.run(content)
    if islamic_report.overall_compliance.score >= 85:
        return await cultural_validator.run(content, islamic_context=islamic_report)
    else:
        return ValidationReport(approved=False, reason="Islamic compliance failure")
```

## Validation Gates

### Development Validation
```bash
# Syntax and Style Validation
ruff check --fix agents/islamic_compliance/ tests/
mypy agents/islamic_compliance/

# Type Checking
mypy --strict agents/islamic_compliance/
```

### Testing Validation
```bash
# Unit Tests
pytest tests/islamic_compliance/test_tools.py -v
pytest tests/islamic_compliance/test_models.py -v

# Integration Tests
pytest tests/islamic_compliance/test_agent.py -v
pytest tests/islamic_compliance/test_scenarios.py -v

# Performance Tests
pytest tests/islamic_compliance/test_performance.py -v --benchmark
```

### Cultural Validation
```bash
# Islamic Compliance Testing
pytest tests/islamic_compliance/test_sharia_validation.py -v
pytest tests/islamic_compliance/test_prayer_time_scenarios.py -v
pytest tests/islamic_compliance/test_haram_content_detection.py -v

# Integration with Cultural System
pytest tests/integration/test_cultural_islamic_integration.py -v
```

### Acceptance Criteria Validation
```bash
# All tests must pass with these criteria:
# - Islamic compliance validation: 95%+ accuracy
# - Response time: <200ms average
# - Cultural appropriateness: 90%+ score
# - Integration with existing cultural system: Seamless
# - Error handling: Graceful degradation with scholarly guidance
```

## Success Metrics

### Performance Targets (Must Meet)
- **Response Time**: <200ms average validation time
- **Accuracy**: 95%+ Islamic compliance validation accuracy
- **Cache Performance**: 70%+ cache hit rate
- **Error Rate**: <1% unhandled validation errors

### Compliance Targets (Must Meet)
- **Islamic Compliance Score**: 85%+ threshold for acceptance
- **Cultural Integration**: Seamless integration with existing cultural validation
- **Scholarly Alignment**: Validation against established Islamic principles
- **Regional Accuracy**: Support for Iraqi Islamic practices and interpretations

### Integration Success (Must Achieve)
- **Agent Coordination**: Seamless integration with iraqi-cultural-validator
- **Pipeline Integration**: Compatible with existing CulturalValidationPipeline
- **Test Coverage**: 95%+ test coverage across all components
- **Documentation**: Comprehensive usage and integration documentation

## Common Gotchas & Solutions

### Implementation Challenges

**1. Religious Nuance Complexity**
- **Challenge**: Understanding complex Islamic jurisprudence and different scholarly interpretations
- **Solution**: Implement configurable validation rules with scholarly review flags
- **Pattern**: Use ModelRetry to request more context when interpretations vary

**2. Performance vs. Accuracy Trade-offs**
- **Challenge**: Meeting <200ms response time while ensuring thorough validation
- **Solution**: Implement intelligent caching and parallel validation execution
- **Pattern**: Follow existing CulturalValidationPipeline caching strategies

**3. Cultural Integration Complexity**
- **Challenge**: Balancing Islamic compliance with Iraqi cultural context
- **Solution**: Use existing cultural validation patterns with Islamic overlay
- **Pattern**: Chain validators with context passing between systems

**4. Testing Complex Scenarios**
- **Challenge**: Testing nuanced Islamic compliance scenarios
- **Solution**: Use FunctionModel for complex scenario simulation
- **Pattern**: Follow existing cultural scenario testing patterns

### Technical Implementation Gotchas

**1. PydanticAI Model Provider Compatibility**
- **Issue**: Different providers may have varying structured output support
- **Solution**: Implement fallback strategies and provider-specific configurations
- **Reference**: Use existing multi-provider patterns from cultural validation

**2. Async/Sync Pattern Mixing**
- **Issue**: Mixing synchronous and asynchronous validation calls
- **Solution**: Maintain consistent async patterns throughout the system
- **Reference**: Follow existing async middleware patterns

**3. Dependency Injection Complexity**
- **Issue**: Complex dependency graphs with Islamic validation requirements
- **Solution**: Use dataclass patterns from existing implementations
- **Reference**: Follow SupportDependencies pattern from PydanticAI examples

## Quality Assurance Checklist

- [ ] **Architecture follows existing cultural validation patterns**
- [ ] **PydanticAI agent implements structured output with proper error handling**
- [ ] **All tools use RunContext for dependency injection**
- [ ] **Islamic validation tools implement ModelRetry for scholarly review**
- [ ] **Scoring system aligns with existing 0-100 scale requirements**
- [ ] **Testing uses TestModel and FunctionModel patterns**
- [ ] **Performance meets <200ms response time requirement**
- [ ] **Integration with cultural validation system is seamless**
- [ ] **Documentation includes Islamic compliance explanations**
- [ ] **Error handling provides meaningful Islamic guidance**

## PRP Confidence Assessment

**Confidence Level: 9/10 for One-Pass Implementation Success**

**High Confidence Factors:**
- ✅ **Extensive Existing Patterns**: Comprehensive cultural validation architecture to follow
- ✅ **Clear PydanticAI Implementation Path**: Well-documented agent, tool, and testing patterns
- ✅ **Proven Scoring Systems**: Existing 0-100 scoring with established thresholds
- ✅ **Detailed Research Context**: Islamic AI ethics, technical implementations, and validation frameworks
- ✅ **Complete Testing Strategy**: TestModel, FunctionModel, and cultural scenario patterns
- ✅ **Performance Benchmarks**: Clear targets based on existing system requirements

**Risk Mitigation:**
- **Religious Complexity**: Addressed through configurable rules and scholarly review flags
- **Performance Requirements**: Mitigated by following proven caching and parallel execution patterns
- **Integration Complexity**: Reduced by using existing cultural validation architecture
- **Testing Completeness**: Ensured through comprehensive scenario-based testing patterns

**Success Probability:** Very High - The combination of extensive existing patterns, comprehensive research, clear technical specifications, and proven architectural approaches provides a strong foundation for successful one-pass implementation.

---

**This PRP provides all necessary context, patterns, and technical specifications for implementing a comprehensive Islamic compliance system that integrates seamlessly with the existing Iraqi AI Chat System architecture while meeting all performance, accuracy, and cultural requirements.**