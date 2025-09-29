# Iraqi-Enhanced RAG System

A comprehensive RAG (Retrieval-Augmented Generation) system based on Archon's architecture with deep Iraqi cultural intelligence, Arabic language processing, and professional domain expertise.

## Overview

This system extends Archon's proven 4-stage RAG pipeline with sophisticated Iraqi cultural context integration:

1. **Iraqi Base Search** - Vector similarity with cultural intelligence
2. **Iraqi Hybrid Search** - Vector + culturally-aware keyword search
3. **Iraqi Reranking** - Cultural compliance + Arabic processing reranking
4. **Iraqi Agentic RAG** - Intelligent code examples with cultural context

## Key Features

### Cultural Intelligence Integration

- **95%+ Cultural Compliance** - Validates all content against Iraqi cultural norms
- **Islamic Values Compliance** - Ensures content respects Islamic principles
- **Professional Domain Awareness** - Specialized handling for legal, medical, educational, and government sectors
- **Regional Sensitivity** - Avoids sectarian, political, and tribal sensitive topics

### Arabic Language Processing

- **Iraqi Dialect Recognition** - Supports Baghdad, Basra, and Mosul dialects
- **RTL Text Handling** - Proper right-to-left text rendering and processing
- **Bilingual Content Support** - Seamless Arabic-English mixed content
- **Cultural Linguistic Patterns** - Recognizes Iraqi-specific expressions and terminology

### Professional Domain Integration

- **Legal Sector** - Iraqi civil law, commercial law, government regulations
- **Medical Sector** - Iraqi healthcare standards, Islamic medical ethics
- **Educational Sector** - Iraqi curriculum alignment, academic standards
- **Government Sector** - Administrative procedures, citizen services
- **Business Sector** - Islamic finance, halal business practices

## Architecture

### Core Components

#### IraqiRAGService

Thin coordinator that orchestrates all strategies with cultural intelligence:

```python
from iraqi_rag_system import create_iraqi_rag_service, create_iraqi_search_context

# Create service with default Iraqi settings
rag_service = create_iraqi_rag_service(
    supabase_client=supabase,
    cultural_sensitivity=0.95,
    enable_arabic_processing=True
)

# Create Iraqi search context
iraqi_context = create_iraqi_search_context(
    professional_domain="legal",
    cultural_sensitivity=0.95,
    islamic_compliance=True,
    language="mixed",
    dialect="iraqi"
)

# Perform culturally-aware search
success, results = await rag_service.perform_rag_query(
    query="قوانين العقود التجارية في العراق",
    iraqi_context=iraqi_context
)
```

#### IraqiCulturalValidator

Comprehensive cultural compliance validation:

```python
from iraqi_rag_system import IraqiCulturalValidator

validator = IraqiCulturalValidator()

# Validate content for cultural compliance
validation_result = await validator.validate_content(
    content="Business contract terms and conditions",
    domain="legal",
    islamic_compliance_required=True
)

print(f"Cultural compliance: {validation_result.overall_score:.2f}")
print(f"Islamic compliance: {validation_result.islamic_compliance:.2f}")
```

#### ArabicTextProcessor

Advanced Arabic language processing with Iraqi dialect support:

```python
from iraqi_rag_system import ArabicTextProcessor

processor = ArabicTextProcessor()

# Process Arabic content with dialect recognition
arabic_result = await processor.process_content(
    text="شلونك صديقي، شنو أخبارك اليوم؟",
    dialect_preference="iraqi"
)

print(f"Dialect detected: {arabic_result.dialect_type.value}")
print(f"Confidence: {arabic_result.dialect_confidence:.2f}")
print(f"Iraqi markers: {arabic_result.iraqi_markers}")
```

### Search Strategies

#### Iraqi Base Search Strategy

Foundation vector search enhanced with cultural intelligence:

- Cultural compliance filtering at similarity threshold level
- Arabic text normalization and processing
- Professional domain context injection
- Regional relevance scoring

#### Iraqi Hybrid Search Strategy

Combines vector similarity with culturally-aware keyword search:

- Arabic keyword extraction with Iraqi dialect awareness
- Cultural term recognition and boosting
- Professional terminology enhancement
- Bilingual search capabilities

#### Iraqi Reranking Strategy

Reorders results using cultural and linguistic intelligence:

- Cross-encoder model enhanced with cultural scoring
- Arabic text quality assessment
- Professional domain relevance scoring
- Islamic compliance validation

#### Iraqi Agentic RAG Strategy

Intelligent code example search with cultural context:

- Arabic comment processing and translation
- Iraqi localization pattern detection
- Islamic finance code patterns
- Government system integration patterns

## Professional Domain Support

### Legal Domain

```python
legal_context = create_iraqi_search_context(
    professional_domain="legal",
    cultural_sensitivity=0.98  # Higher sensitivity for legal
)

# Search for Iraqi legal documents
results = await rag_service.search_documents(
    query="قانون الأحوال الشخصية العراقي",
    iraqi_context=legal_context
)
```

### Medical Domain

```python
medical_context = create_iraqi_search_context(
    professional_domain="medical",
    islamic_compliance=True  # Islamic medical ethics
)

# Search with medical terminology
results = await rag_service.search_documents(
    query="معايير الرعاية الصحية في المستشفيات العراقية",
    iraqi_context=medical_context
)
```

### Educational Domain

```python
educational_context = create_iraqi_search_context(
    professional_domain="educational",
    language="arabic"  # Arabic curriculum focus
)
```

### Government Domain

```python
government_context = create_iraqi_search_context(
    professional_domain="government",
    cultural_sensitivity=0.99  # Maximum sensitivity
)
```

## Code Example Search

The system provides specialized support for searching code examples with Iraqi cultural context:

```python
# Search for culturally-appropriate code examples
success, code_results = await rag_service.search_code_examples_service(
    query="Arabic RTL form validation with Islamic calendar",
    iraqi_context=create_iraqi_search_context(
        professional_domain="technical",
        cultural_sensitivity=0.85
    )
)

for result in code_results["results"]:
    print(f"Code: {result['code'][:100]}...")
    print(f"Cultural compliance: {result['iraqi_context']['cultural_compliance_verified']}")
    print(f"Arabic processing: {result['iraqi_context']['arabic_processing_applied']}")
```

## Performance and Monitoring

### Cultural Compliance Metrics

- Overall cultural compliance rate (target: 95%+)
- Islamic compliance validation rate
- Professional domain accuracy
- Regional sensitivity scoring

### Arabic Processing Metrics

- Arabic content detection rate
- Iraqi dialect recognition accuracy (target: 85%+)
- RTL text processing success rate
- Bilingual content handling efficiency

### Search Performance

- Response time targets: <500ms for cultural validation
- Similarity thresholds: 0.12 for Arabic, 0.15 for English
- Cultural filtering efficiency
- Professional domain enhancement rate

```python
# Get comprehensive statistics
stats = rag_service.get_service_statistics()

print("Service Performance:")
print(f"Total queries: {stats['service_stats']['total_queries']}")
print(f"Cultural validation rate: {stats['component_stats']['cultural_validator']['overall_compliance_rate']:.2f}")
print(f"Arabic processing rate: {stats['component_stats']['arabic_processor']['arabic_detection_rate']:.2f}")
```

## Security and Privacy

### Data Protection

- Session-only data storage with auto-expiry
- Iraqi data protection standards compliance
- Islamic privacy requirements
- Professional confidentiality standards

### Content Filtering

- Automatic inappropriate content detection
- Cultural sensitivity validation
- Islamic values compliance checking
- Professional ethics enforcement

## Configuration

### Environment Variables

```bash
# Iraqi RAG Configuration
USE_IRAQI_CULTURAL_VALIDATION=true
USE_ARABIC_PROCESSING=true
IRAQI_CULTURAL_SENSITIVITY=0.95
ISLAMIC_COMPLIANCE_REQUIRED=true
DEFAULT_PROFESSIONAL_DOMAIN=general
DEFAULT_LANGUAGE=mixed
DEFAULT_DIALECT=iraqi

# Performance Settings
CULTURAL_VALIDATION_TIMEOUT=5.0
ARABIC_PROCESSING_TIMEOUT=3.0
MAX_RESULTS_PER_STRATEGY=50
```

### Custom Configuration

```python
from iraqi_rag_system import IraqiRAGConfig, IraqiRAGService

# Create custom configuration
config = IraqiRAGConfig(
    enable_hybrid_search=True,
    enable_reranking=True,
    enable_agentic_rag=True,
    enable_cultural_validation=True,
    enable_arabic_processing=True,
    default_cultural_sensitivity=0.98,
    default_islamic_compliance=True,
    default_professional_domain="legal",
    cultural_validation_timeout=3.0
)

# Initialize with custom config
rag_service = IraqiRAGService(supabase_client=supabase, config=config)
```

## Integration Examples

### With PydanticAI Agents

```python
from pydantic_ai import Agent
from iraqi_rag_system import create_iraqi_rag_service

class IraqiLegalAgent:
    def __init__(self):
        self.rag_service = create_iraqi_rag_service()
        self.legal_context = create_iraqi_search_context(
            professional_domain="legal",
            cultural_sensitivity=0.98
        )

    async def search_legal_documents(self, query: str):
        success, results = await self.rag_service.perform_rag_query(
            query=query,
            iraqi_context=self.legal_context
        )
        return results if success else None
```

### With FastAPI

```python
from fastapi import FastAPI
from iraqi_rag_system import create_iraqi_rag_service

app = FastAPI()
rag_service = create_iraqi_rag_service()

@app.post("/iraqi-search")
async def iraqi_search(
    query: str,
    domain: str = "general",
    cultural_sensitivity: float = 0.95
):
    iraqi_context = create_iraqi_search_context(
        professional_domain=domain,
        cultural_sensitivity=cultural_sensitivity
    )

    success, results = await rag_service.perform_rag_query(
        query=query,
        iraqi_context=iraqi_context
    )

    return {"success": success, "results": results}
```

## Best Practices

### Cultural Sensitivity

1. Always use cultural sensitivity ≥0.95 for professional domains
2. Enable Islamic compliance for all business and legal content
3. Validate results with Iraqi cultural context
4. Respect regional sensitivities and avoid controversial topics

### Arabic Processing

1. Normalize Arabic text for better search accuracy
2. Use Iraqi dialect markers for enhanced relevance
3. Support RTL text direction in UI components
4. Handle bilingual content appropriately

### Professional Domains

1. Select appropriate professional domain for accurate results
2. Use domain-specific terminology and validation
3. Apply stricter cultural compliance for sensitive domains
4. Integrate with Iraqi professional standards

### Performance Optimization

1. Use hybrid search for better recall and precision
2. Enable reranking for improved result quality
3. Cache cultural validation results for common queries
4. Monitor response times and adjust thresholds accordingly

## Contributing

This system is designed for the Iraqi AI development community. Contributions should:

1. Maintain cultural sensitivity and Islamic compliance
2. Support Arabic language processing improvements
3. Enhance professional domain accuracy
4. Follow Iraqi development standards and practices

## License

Licensed under MIT License with additional cultural compliance requirements for Iraqi context usage.

## Support

For support with Iraqi cultural context, Arabic processing, or professional domain integration, please refer to the Iraqi AI development community guidelines.
