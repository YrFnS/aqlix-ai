---
name: "Iraqi PDF Processing PydanticAI Agent"
description: "Comprehensive PRP for building an intelligent PDF processing agent with Arabic text extraction, Iraqi document understanding, cultural validation, and privacy-compliant processing"
---

## Purpose

Build a production-ready PydanticAI agent that intelligently processes PDF documents with Arabic content, extracts text from both digital and scanned documents using OCR, classifies Iraqi professional documents, and provides contextual analysis while maintaining cultural sensitivity and privacy-first data handling.

## Core Principles

1. **PydanticAI Best Practices**: Deep integration with PydanticAI patterns for agent creation, tools, and structured outputs
2. **Production Ready**: Include security, testing, and monitoring for production deployments
3. **Type Safety First**: Leverage PydanticAI's type-safe design and Pydantic validation throughout
4. **Context Engineering Integration**: Apply proven context engineering workflows to AI agent development
5. **Comprehensive Testing**: Use TestModel and FunctionModel for thorough agent validation
6. **Iraqi Cultural Context**: Respect Iraqi customs, Islamic values, and professional standards
7. **Privacy-First Processing**: Temporary processing only, automatic cleanup, no persistent storage

## ⚠️ Implementation Guidelines: Don't Over-Engineer

**IMPORTANT**: Keep your agent implementation focused and practical. Don't build unnecessary complexity.

### What NOT to do:
- ❌ **Don't create dozens of tools** - Build only the 6-7 essential PDF processing tools needed
- ❌ **Don't over-complicate dependencies** - Keep dependency injection simple with dataclass pattern
- ❌ **Don't add unnecessary abstractions** - Follow main_agent_reference patterns directly
- ❌ **Don't build complex workflows** unless specifically required for PDF processing pipeline
- ❌ **Don't add structured output** unless validation is specifically needed (default to string)
- ❌ **Don't build in the examples/ folder** - Create in apps/api/agents/pdf_processing/

### What TO do:
- ✅ **Start simple** - Build the minimum viable agent that processes PDFs with Arabic text
- ✅ **Add tools incrementally** - Implement core extraction first, then OCR, then classification
- ✅ **Follow main_agent_reference** - Use proven patterns from examples/main_agent_reference/
- ✅ **Use string output by default** - Only add result_type when structured validation needed
- ✅ **Test early and often** - Use TestModel to validate as you build each tool

### Key Question:
**"Does this PDF processing agent really need this feature to accomplish its core purpose?"**

If the answer is no, don't build it. Keep it simple, focused, and functional.

---

## Goal

Create an intelligent PDF processing agent that can:
- Extract Arabic text from digital PDFs with PyMuPDF
- Perform OCR on scanned documents with EasyOCR Arabic language models
- Classify Iraqi professional documents (legal, medical, educational, engineering)
- Validate content for Iraqi cultural appropriateness and Islamic compliance
- Generate summaries with Iraqi professional context awareness
- Process documents securely with automatic cleanup and privacy protection

## Why

Iraqi professionals need an AI system that can understand their documents in Arabic script, respect their cultural context, and provide intelligent analysis without compromising privacy. Current PDF processing solutions lack Arabic dialect recognition, Iraqi professional context understanding, and cultural sensitivity validation.

## What

### Agent Type Classification
- [x] **Tool-Enabled Agent**: Agent with external tool integration capabilities for PDF processing, OCR, and cultural validation

### Model Provider Requirements
- [x] **OpenAI**: `openai:gpt-4o` (primary) for document understanding and cultural context
- [x] **Fallback Strategy**: `openai:gpt-4o-mini` for cost optimization on simple tasks

### External Integrations
- [x] **PyMuPDF Integration**: Fast digital text extraction from PDF documents
- [x] **EasyOCR Integration**: Arabic OCR for scanned documents with confidence scoring
- [x] **Arabic NLP Libraries**: CAMeL Tools and PyArabic for text processing and normalization
- [x] **File system operations**: Temporary file processing with automatic cleanup
- [x] **Cultural validation services**: Custom Iraqi cultural appropriateness checking

### Success Criteria
- [x] Agent processes various Iraqi PDF document types (legal, medical, educational, engineering)
- [x] Accurate Arabic text extraction (>90% digital, >80% OCR with confidence >0.5)
- [x] Cultural validation for Iraqi customs and Islamic compliance
- [x] Professional domain classification with Iraqi context understanding
- [x] Privacy-compliant processing with automatic document deletion
- [x] Performance within limits (<30 seconds per document, <10MB file size)
- [x] Comprehensive test coverage with TestModel and FunctionModel
- [x] Security measures implemented (input validation, content filtering, audit logging)

## All Needed Context

### PydanticAI Documentation & Research

```yaml
# ESSENTIAL PYDANTIC AI DOCUMENTATION - Must be researched
- url: https://ai.pydantic.dev/
  why: Official PydanticAI documentation with getting started guide
  content: Agent creation, model providers, dependency injection patterns
  key_findings: PydanticAI uses FastAPI-like patterns, supports multiple model providers

- url: https://ai.pydantic.dev/agents/
  why: Comprehensive agent architecture and configuration patterns
  content: System prompts, output types, execution methods, agent composition
  key_findings: Agents are containers for system prompts, tools, dependencies, and output types

- url: https://ai.pydantic.dev/tools/
  why: Tool integration patterns and function registration
  content: @agent.tool decorators, RunContext usage, parameter validation
  key_findings: Two decorators - @agent.tool (with context) and @agent.tool_plain (without context)

- url: https://ai.pydantic.dev/testing/
  why: Testing strategies specific to PydanticAI agents
  content: TestModel, FunctionModel, Agent.override(), pytest patterns
  key_findings: TestModel for rapid development, FunctionModel for custom behavior testing

- url: https://ai.pydantic.dev/models/
  why: Model provider configuration and authentication
  content: OpenAI, Anthropic, Gemini setup, API key management, fallback models
  key_findings: Environment-based API key management, model provider abstraction patterns

# Prebuilt examples - CRITICAL REFERENCE IMPLEMENTATIONS
- path: examples/main_agent_reference/
  why: Production-grade agent architecture patterns to follow exactly
  content: settings.py (environment config), providers.py (model abstraction), agent.py, tools.py
  key_findings: Use get_llm_model() function, dataclass dependencies, @agent.tool patterns

- path: examples/pdf-processing/fastapi-pdf-processor.py
  why: Existing FastAPI PDF processing with Arabic OCR implementation
  content: PyMuPDF + EasyOCR integration, Arabic text processing, document validation
  key_findings: Hybrid approach (digital first, OCR fallback), confidence thresholds, Arabic reshaping

- path: examples/tool_enabled_agent/agent.py
  why: Tool integration patterns with external services
  content: RunContext usage, dependency injection, tool error handling
  key_findings: Tools access dependencies via RunContext[DepsType], proper error handling required
```

### PDF Processing and Arabic OCR Research

```yaml
# Current 2025 Best Practices for Arabic PDF Processing
pdf_processing_patterns:
  hybrid_approach:
    digital_first: "Use PyMuPDF for fast text extraction from digital PDFs"
    ocr_fallback: "Use EasyOCR when encountering invalid Unicode (chr(0xFFFD)) or empty text"
    performance: "OCR is 1000x slower than digital extraction, use sparingly"
    caching: "Store OCR results in TextPage objects for reuse"
  
  arabic_specific:
    libraries: "PyMuPDF + EasyOCR combination recommended for 2025"
    text_processing: "Use arabic_reshaper + bidi.algorithm for proper RTL display"
    confidence_thresholds: "Only include OCR results with confidence > 0.5"
    language_detection: "Count Arabic Unicode range (\\u0600-\\u06FF) for language classification"

# Arabic NLP and Cultural Processing
arabic_nlp_tools:
  camel_tools:
    purpose: "Open-source Arabic NLP toolkit with preprocessing, morphological modeling"
    capabilities: "Dialect identification, named entity recognition, sentiment analysis"
    installation: "pip install camel-tools"
    usage: "For Arabic text normalization and dialect processing"
  
  pyarabic:
    purpose: "Basic Arabic letter manipulation and text processing"
    capabilities: "Letter detection, diacritics removal, text characteristics"
    installation: "pip install PyArabic"
    usage: "For fundamental Arabic text cleaning and normalization"

# Iraqi Dialect and Cultural Context
iraqi_context:
  dialect_challenges:
    variability: "Iraqi dialect differs significantly from Modern Standard Arabic"
    cultural_nuances: "Context-dependent meanings require cultural understanding"
    professional_terminology: "Domain-specific vocabulary varies by profession"
  
  cultural_validation:
    islamic_compliance: "Content must respect Islamic values and customs"
    political_sensitivity: "Avoid sectarian or politically sensitive topics"
    professional_ethics: "Respect confidentiality for legal/medical documents"
    family_values: "Honor Iraqi family traditions and social norms"
```

### Security and Privacy Requirements

```yaml
# Privacy-First Processing Requirements
privacy_requirements:
  temporary_processing:
    memory_only: "Process documents in memory when possible"
    temp_files: "Use temporary files only when necessary, auto-delete after processing"
    cleanup_timeout: "Maximum 1 hour storage, automatic cleanup"
    no_persistence: "Never store document content in databases or logs"
  
  security_measures:
    input_validation: "Validate file types, sizes, and content safety"
    content_filtering: "Scan for malicious embedded content and scripts"
    access_control: "Proper authentication and authorization for document access"
    audit_logging: "Log processing actions (not content) for security monitoring"

# Iraqi Cultural Security
cultural_security:
  content_validation:
    religious_compliance: "Ensure content respects Islamic principles"
    cultural_sensitivity: "Flag potentially inappropriate cultural references"
    professional_boundaries: "Respect confidentiality in professional documents"
    family_privacy: "Protect sensitive family and personal information"
```

### Common PydanticAI and PDF Processing Gotchas

```yaml
# Critical Implementation Gotchas - MUST ADDRESS
implementation_challenges:
  arabic_font_encoding:
    issue: "Complex Arabic typography in PDFs causes extraction failures"
    symptoms: "Garbled text, missing characters, incorrect character order"
    solution: "Implement character validation, automatic OCR fallback, text reshaping"
    
  ocr_performance:
    issue: "OCR processing is extremely slow (1000x slower than text extraction)"
    symptoms: "Long processing times, memory issues with large documents"
    solution: "Hybrid approach, page-by-page processing, confidence thresholds"
    
  cultural_automation:
    issue: "Automated cultural validation has high false positive/negative rates"
    symptoms: "Inappropriate content flagged as safe, safe content flagged as inappropriate"
    solution: "Conservative validation, human review flags, configurable thresholds"
    
  iraqi_dialect_recognition:
    issue: "Standard Arabic NLP tools don't handle Iraqi dialect well"
    symptoms: "Misclassified content, missed terminology, incorrect context"
    solution: "Custom vocabulary databases, Iraqi-specific validation rules"
    
  privacy_compliance:
    issue: "Documents contain sensitive personal/professional information"
    symptoms: "Privacy violations, audit compliance failures"
    solution: "In-memory processing, automatic cleanup, minimal logging"

# PydanticAI Specific Gotchas
pydantic_ai_gotchas:
  dependency_injection:
    issue: "Complex dependency graphs are hard to debug in tools"
    solution: "Use simple dataclass dependencies, clear RunContext typing"
    
  async_patterns:
    issue: "Mixing sync and async agent calls inconsistently"
    solution: "Use async consistently, await all agent.run() calls"
    
  tool_error_handling:
    issue: "Tool failures crash entire agent runs"
    solution: "Comprehensive try/except in tools, graceful degradation"
```

## Implementation Blueprint

### Technology Research Phase

**RESEARCH COMPLETED - Key Findings:**

✅ **PydanticAI Framework Deep Dive:**
- [x] Agent creation follows container pattern: Agent(model, deps_type, system_prompt)
- [x] Model providers configured via providers.py with get_llm_model() abstraction
- [x] Tools use @agent.tool decorator with RunContext[DepsType] for dependency access
- [x] Default to string output, only use result_type for structured validation needs
- [x] Testing with TestModel (rapid validation) and FunctionModel (custom behavior)

✅ **PDF Processing Architecture:**
- [x] Hybrid approach: PyMuPDF first, EasyOCR fallback for scanned/damaged PDFs
- [x] Performance optimization: Digital extraction 1000x faster than OCR
- [x] Arabic text processing: arabic_reshaper + bidi.algorithm for RTL display
- [x] Confidence scoring: Only include OCR results above 0.5 confidence threshold

✅ **Security and Cultural Patterns:**
- [x] Privacy-first: In-memory processing, automatic cleanup, no persistence
- [x] Cultural validation: Conservative approach with Iraqi customs and Islamic values
- [x] Input validation: File type checking, size limits, content security scanning

### Agent Implementation Plan

```yaml
# Follow this exact implementation sequence

Implementation Task 1 - Agent Architecture Setup (Follow main_agent_reference):
  CREATE project structure in apps/api/agents/pdf_processing/:
    - settings.py: Environment configuration with pydantic-settings
    - providers.py: Model provider abstraction with get_llm_model()
    - agent.py: Main agent definition with string output (no result_type initially)
    - dependencies.py: PDFProcessingDependencies dataclass
    - tools.py: PDF processing tools with @agent.tool decorators
    - processors/: Specialized processing modules
      - pdf_extractor.py: PyMuPDF integration
      - ocr_processor.py: EasyOCR integration  
      - arabic_nlp.py: Arabic text processing
      - cultural_validator.py: Iraqi cultural validation
    - tests/: TestModel and FunctionModel test suite

Implementation Task 2 - Core Agent Definition:
  IMPLEMENT agent.py following main_agent_reference pattern:
    - Import get_llm_model() from providers.py (never hardcode model strings)
    - System prompt as SYSTEM_PROMPT constant with Iraqi cultural context
    - PDFProcessingDependencies dataclass for external services
    - Agent instance with default string output (no result_type)
    - Error handling and logging with proper RunContext usage

Implementation Task 3 - PDF Processing Tools (Phase 1 - Core Extraction):
  DEVELOP tools.py with essential tools:
    - extract_pdf_text: PyMuPDF integration with Arabic text validation
    - perform_arabic_ocr: EasyOCR fallback with confidence scoring
    - normalize_arabic_text: Text cleaning with arabic_reshaper + bidi
    Each tool with @agent.tool decorator and RunContext[PDFProcessingDependencies]

Implementation Task 4 - OCR and Processing Integration (Phase 2):
  IMPLEMENT processors/ modules:
    - pdf_extractor.py: PyMuPDF wrapper with character validation
    - ocr_processor.py: EasyOCR wrapper with Arabic language models
    - arabic_nlp.py: CAMeL Tools integration for text normalization
    Integration with tools.py via dependency injection

Implementation Task 5 - Iraqi Context Features (Phase 3):
  ADD Iraqi-specific capabilities:
    - classify_iraqi_document: Professional document type detection
    - validate_cultural_content: Iraqi customs and Islamic compliance
    - extract_professional_terms: Domain-specific vocabulary extraction
    - summarize_with_context: Cultural-aware summarization

Implementation Task 6 - Comprehensive Testing:
  IMPLEMENT complete test suite:
    - TestModel integration for rapid development validation
    - FunctionModel tests for OCR behavior customization
    - Agent.override() patterns for isolated testing
    - Real Iraqi document samples for integration testing
    - Cultural validation test cases with various content types

Implementation Task 7 - Security and Production Hardening:
  FINALIZE production readiness:
    - Environment variable management for API keys
    - Input validation and sanitization (file types, sizes, content)
    - Privacy compliance with automatic cleanup
    - Error handling and graceful degradation
    - Performance monitoring and resource management
```

## Validation Loop

### Level 1: Agent Structure Validation

```bash
# Verify complete PDF processing agent structure
find apps/api/agents/pdf_processing -name "*.py" | sort
test -f apps/api/agents/pdf_processing/agent.py && echo "Agent definition present"
test -f apps/api/agents/pdf_processing/tools.py && echo "Tools module present"
test -f apps/api/agents/pdf_processing/dependencies.py && echo "Dependencies present"
test -f apps/api/agents/pdf_processing/settings.py && echo "Settings configuration present"

# Verify proper PydanticAI imports and patterns
grep -q "from pydantic_ai import Agent" apps/api/agents/pdf_processing/agent.py
grep -q "@agent.tool" apps/api/agents/pdf_processing/tools.py
grep -q "RunContext\[PDFProcessingDependencies\]" apps/api/agents/pdf_processing/tools.py
grep -q "get_llm_model" apps/api/agents/pdf_processing/agent.py

# Expected: All required files with proper PydanticAI patterns
# If missing: Generate missing components following main_agent_reference
```

### Level 2: PDF Processing Functionality Validation

```bash
# Test agent instantiation and basic functionality
cd apps/api/agents/pdf_processing
python -c "
from agent import pdf_processing_agent
from dependencies import PDFProcessingDependencies
print('Agent created successfully')
print(f'Model: {pdf_processing_agent.model}')
print(f'Tools: {len(pdf_processing_agent.tools)}')
"

# Test with TestModel for PDF processing validation
python -c "
from pydantic_ai.models.test import TestModel
from agent import pdf_processing_agent
from dependencies import PDFProcessingDependencies

test_model = TestModel()
deps = PDFProcessingDependencies(temp_storage_path='/tmp')

with pdf_processing_agent.override(model=test_model):
    result = pdf_processing_agent.run_sync(
        'Process this Arabic PDF document',
        deps=deps
    )
    print(f'Agent response: {result.data}')
"

# Expected: Agent instantiation works, all PDF processing tools registered
# If failing: Debug agent configuration and tool registration issues
```

### Level 3: Arabic OCR and Cultural Validation Testing

```bash
# Test Arabic text processing capabilities
cd apps/api/agents/pdf_processing
python -c "
from processors.arabic_nlp import normalize_arabic_text
from processors.cultural_validator import validate_iraqi_content

# Test Arabic text normalization
arabic_text = 'مرحبا، شلونك اليوم؟'  # Iraqi greeting
normalized = normalize_arabic_text(arabic_text)
print(f'Arabic normalization: {normalized}')

# Test cultural validation
content = 'Legal document content in Arabic'
validation = validate_iraqi_content(content)
print(f'Cultural validation: {validation}')
"

# Test PDF extraction with real file (create test PDF)
python -c "
from processors.pdf_extractor import extract_text_with_fallback
import os

if os.path.exists('test_arabic.pdf'):
    result = extract_text_with_fallback('test_arabic.pdf')
    print(f'Extraction result: {result[:100]}...')
else:
    print('Create test_arabic.pdf for integration testing')
"

# Expected: Arabic processing works, cultural validation functional
# If failing: Debug Arabic NLP integration and cultural validation logic
```

### Level 4: Production Readiness and Security Validation

```bash
# Verify security and privacy compliance
cd apps/api/agents/pdf_processing
grep -r "API_KEY" . | grep -v ".py:" # Should not expose keys in code
test -f .env.example && echo "Environment template present"

# Check privacy compliance features
grep -r "cleanup\|delete\|temp" . | wc -l  # Should have cleanup mechanisms
grep -r "logging" . | grep -v "content" | wc -l  # Should log actions, not content

# Verify error handling comprehensiveness
grep -r "try:" . | wc -l  # Should have extensive error handling
grep -r "except" . | wc -l  # Should have exception handling

# Test resource management and performance
python -c "
import resource
import time
from agent import pdf_processing_agent

# Monitor memory usage during processing
start_memory = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
start_time = time.time()

# Simulate processing (replace with actual test)
print('Performance monitoring implemented')

end_time = time.time()
end_memory = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
print(f'Processing time: {end_time - start_time}s')
print(f'Memory usage: {end_memory - start_memory}KB')
"

# Expected: Security measures in place, privacy compliance, performance monitoring
# If issues: Implement missing security patterns and performance optimizations
```

## Final Validation Checklist

### Agent Implementation Completeness

- [ ] Complete project structure: `agent.py`, `tools.py`, `dependencies.py`, `settings.py`, `providers.py`
- [ ] Agent instantiation with get_llm_model() from providers.py (no hardcoded models)
- [ ] Six essential tools: extract_pdf_text, perform_arabic_ocr, normalize_arabic_text, classify_iraqi_document, validate_cultural_content, summarize_with_context
- [ ] Tool registration with @agent.tool decorators and RunContext[PDFProcessingDependencies]
- [ ] PDFProcessingDependencies dataclass with all external service configurations
- [ ] Comprehensive test suite with TestModel and FunctionModel patterns

### PDF Processing and Arabic Support

- [ ] PyMuPDF integration for digital text extraction with Unicode validation
- [ ] EasyOCR integration with Arabic language models ['ar', 'en']
- [ ] Hybrid processing: digital first, OCR fallback with confidence thresholds
- [ ] Arabic text processing with arabic_reshaper and bidi.algorithm for RTL
- [ ] Iraqi dialect recognition and cultural context understanding
- [ ] Professional document classification (legal, medical, educational, engineering)

### Cultural and Privacy Compliance

- [ ] Iraqi cultural validation with Islamic compliance checking
- [ ] Conservative content filtering with human review flags
- [ ] Privacy-first processing: in-memory operations, automatic cleanup
- [ ] No persistent storage of document content
- [ ] Audit logging of actions (not content) for security monitoring
- [ ] Configurable cleanup timeout (default 1 hour maximum)

### Production Readiness

- [ ] Environment configuration with .env files and API key validation
- [ ] Input validation: file types, sizes, content security scanning
- [ ] Comprehensive error handling with graceful degradation
- [ ] Performance optimization: <30 seconds per document, <10MB file limit
- [ ] Resource monitoring and memory management
- [ ] Security measures: authentication, authorization, rate limiting

---

## Anti-Patterns to Avoid

### PydanticAI Agent Development

- ❌ Don't hardcode model names - always use get_llm_model() from providers.py
- ❌ Don't skip TestModel validation - test each tool during development
- ❌ Don't ignore RunContext typing - use RunContext[PDFProcessingDependencies] consistently
- ❌ Don't create complex tool chains - keep PDF processing tools focused and composable
- ❌ Don't skip async patterns - use await for all agent.run() calls

### PDF Processing and Arabic Support

- ❌ Don't use only OCR - implement hybrid approach (digital first, OCR fallback)
- ❌ Don't ignore confidence scores - only use OCR results with confidence > 0.5
- ❌ Don't skip Arabic text reshaping - use arabic_reshaper + bidi for proper RTL display
- ❌ Don't assume standard Arabic - implement Iraqi dialect recognition and cultural context
- ❌ Don't ignore performance - OCR is 1000x slower than digital extraction

### Security and Cultural Sensitivity

- ❌ Don't store document content persistently - use temporary processing only
- ❌ Don't log document content - log processing actions for audit purposes only
- ❌ Don't automate cultural validation completely - use conservative approach with review flags
- ❌ Don't ignore privacy compliance - implement automatic cleanup and minimal data retention
- ❌ Don't skip input validation - validate file types, sizes, and content security

**RESEARCH STATUS: [COMPLETED]** - Comprehensive research completed with implementation blueprint ready for one-pass development.

---

## Confidence Score: 9/10

This PRP provides comprehensive context for one-pass implementation success:
- ✅ Complete PydanticAI patterns from 2025 documentation research
- ✅ Detailed Arabic PDF processing best practices with hybrid approach
- ✅ Iraqi cultural context and dialect-specific requirements
- ✅ Production-ready security and privacy compliance patterns
- ✅ Phased implementation approach with clear validation criteria
- ✅ All necessary external library integrations documented
- ✅ Comprehensive testing strategy with TestModel/FunctionModel
- ✅ Real-world gotchas and solutions from current 2025 practices

The implementation follows proven main_agent_reference patterns while addressing the specific complexities of Arabic text processing, Iraqi cultural context, and privacy-compliant PDF processing.