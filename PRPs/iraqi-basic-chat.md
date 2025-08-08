# Iraqi Basic Chat PydanticAI Agent - PRP

**Implementation Confidence Score: 9/10**

## Project Overview

**Feature Name**: Basic Chat PydanticAI Agent for Iraqi AI Chat System  
**Category**: AI Agent Implementation  
**Priority**: P0 (Foundation Feature)  
**Estimated Complexity**: High (Iraqi cultural integration + Arabic NLP + PydanticAI patterns)

### Context & Purpose

Create a foundational PydanticAI agent that provides culturally-appropriate conversational AI for Iraqi users, supporting Arabic dialect processing, Islamic values integration, and professional domain expertise while maintaining privacy-first architecture with session-only data handling.

**Core Value Proposition**: Enable natural, culturally-respectful conversations in Arabic/English for Iraqi professionals while ensuring Islamic compliance and technical excellence.

## Feature Requirements Analysis

### 1. Core Conversational Features
- **Multi-language support**: Arabic (Iraqi dialect), Standard Arabic, English, mixed content
- **Context-aware responses**: Maintain conversation flow, reference previous messages
- **Professional expertise**: Support Iraqi legal/medical/educational domains with appropriate terminology
- **Response personalization**: Adapt tone and complexity based on user context

### 2. Cultural Integration Requirements
- **Islamic compliance**: 95%+ adherence to Islamic principles and values
- **Iraqi cultural patterns**: Respect for hierarchy, appropriate greetings/closings
- **Professional domain adaptation**: Specialized knowledge for Iraqi professional contexts  
- **Cultural validation**: Real-time screening for cultural appropriateness

### 3. Arabic Language Processing
- **RTL text support**: Proper right-to-left text handling and Unicode processing
- **Iraqi dialect recognition**: 85%+ accuracy for Iraqi-specific expressions
- **Mixed-language handling**: Seamless Arabic-English code-switching
- **Professional terminology**: Preserve technical English terms when appropriate

### 4. Technical Requirements
- **Session-only data**: No persistent storage of conversation content
- **Response time**: <2 seconds for standard queries, <5 seconds for complex analysis
- **Fallback mechanisms**: Graceful degradation when cultural validation fails
- **Error handling**: Culturally-appropriate error messages and recovery

## Technical Architecture

### 1. PydanticAI Agent Structure

```python
# Core Agent Configuration
@dataclass
class IraqiChatAgentDependencies:
    supabase_client: SupabaseClient
    cultural_validator: IraqiCulturalValidator
    arabic_processor: ArabicRTLProcessor
    session_id: str
    user_context: Optional[Dict[str, Any]] = None

iraqi_chat_agent = Agent(
    get_llm_model(),
    deps_type=IraqiChatAgentDependencies,
    system_prompt=IRAQI_CHAT_SYSTEM_PROMPT,
    retries=2
)
```

### 2. System Prompt Architecture

**Multi-layered prompt structure**:
1. **Core Identity**: Iraqi AI assistant with cultural awareness
2. **Language Capabilities**: Arabic/English processing with dialect support
3. **Cultural Guidelines**: Islamic values, Iraqi professional norms
4. **Domain Expertise**: Professional knowledge boundaries and ethics
5. **Response Patterns**: Greeting/closing conventions, respectful language

### 3. Tool Integration

**Cultural Validation Tool**:
```python
@iraqi_chat_agent.tool
async def validate_cultural_appropriateness(
    ctx: RunContext[IraqiChatAgentDependencies],
    content: str,
    domain: ProfessionalDomain = ProfessionalDomain.GENERAL
) -> CulturalValidationResult
```

**Arabic Processing Tool**:
```python
@iraqi_chat_agent.tool
async def process_arabic_text(
    ctx: RunContext[IraqiChatAgentDependencies],
    text: str,
    operation: str = "normalize"
) -> ProcessedArabicText
```

**Session Context Tool**:
```python
@iraqi_chat_agent.tool
async def update_session_context(
    ctx: RunContext[IraqiChatAgentDependencies],
    context_update: Dict[str, Any]
) -> SessionContextResult
```

### 4. Data Flow Architecture

```
User Input → Language Detection → Cultural Pre-screening → 
Agent Processing → Response Generation → Cultural Validation → 
Arabic Formatting → Session Update → User Response
```

## Implementation Strategy

### Phase 1: Core Agent Foundation (Week 1)
1. **Agent Bootstrap** (Days 1-2)
   - Set up basic PydanticAI agent structure
   - Implement dependency injection pattern
   - Create settings management with pydantic-settings
   - Basic OpenAI provider integration with fallback

2. **System Prompt Development** (Days 3-4)
   - Research and implement comprehensive Iraqi cultural prompt
   - Integrate Islamic values and professional boundaries
   - Add Arabic/English language processing guidelines
   - Test prompt effectiveness with sample conversations

3. **Basic Tool Integration** (Days 5-7)
   - Implement session context management
   - Add basic Arabic text processing capabilities
   - Create cultural validation framework
   - Set up Supabase session storage patterns

### Phase 2: Cultural Integration (Week 2)
1. **Cultural Validator Integration** (Days 8-10)
   - Implement IraqiCulturalValidator from existing codebase
   - Add domain-specific validation rules
   - Create Islamic compliance checking
   - Integrate with agent tool system

2. **Arabic Language Processing** (Days 11-12)
   - Implement ArabicRTLProcessor integration
   - Add Iraqi dialect detection and handling
   - Create mixed-language processing capabilities
   - Test with real Iraqi dialect samples

3. **Professional Domain Support** (Days 13-14)
   - Add legal/medical/educational domain expertise
   - Implement appropriate terminology handling
   - Create domain-specific cultural patterns
   - Test with professional use cases

### Phase 3: Advanced Features (Week 3)
1. **Session Management** (Days 15-16)
   - Implement privacy-first session handling
   - Add context persistence without content storage
   - Create session expiry and cleanup mechanisms
   - Test session boundary conditions

2. **Error Handling & Fallbacks** (Days 17-18)
   - Implement graceful degradation patterns
   - Add culturally-appropriate error messages
   - Create fallback mechanisms for validation failures
   - Test edge cases and error scenarios

3. **Performance Optimization** (Days 19-21)
   - Optimize response times with caching strategies
   - Implement token usage monitoring
   - Add performance metrics and monitoring
   - Load testing with Iraqi dialect samples

## Cultural Integration Requirements

### 1. Islamic Compliance Framework
- **Core Values Integration**: Justice (adl), privacy (satr), respect (ihtiram)
- **Prohibited Content Screening**: Haram activities, inappropriate social suggestions
- **Professional Ethics**: Maintain boundaries in legal/medical advice
- **Family Values**: Respect for Iraqi family structures and authority

### 2. Iraqi Cultural Patterns
- **Greeting Conventions**: "السلام عليكم" for formal, "شلونك حبيبي" for informal
- **Hierarchy Respect**: Professional titles (دكتور, مهندس, أستاذ)
- **Closing Patterns**: "بارك الله فيك", "والله يعطيك العافية"
- **Dialectal Expressions**: Integration of Iraqi-specific phrases and idioms

### 3. Professional Domain Adaptation
- **Legal Domain**: Shariah compliance awareness, Iraqi legal framework respect
- **Medical Domain**: Gender-appropriate care considerations, family involvement
- **Educational Domain**: Islamic values integration, parental authority respect
- **General Professional**: Formal address patterns, consensus-building approaches

## Testing and Validation

### 1. Cultural Validation Tests
```bash
# Islamic Compliance Testing
bun run test:cultural --islamic-compliance

# Iraqi Cultural Appropriateness  
bun run test:cultural --iraqi-patterns

# Professional Domain Testing
bun run test:cultural --professional-domains
```

### 2. Arabic Language Processing Tests
```bash
# RTL Text Processing
bun run test:arabic --rtl-processing

# Iraqi Dialect Recognition
bun run test:arabic --dialect-recognition

# Mixed Language Handling
bun run test:arabic --mixed-content
```

### 3. Agent Functionality Tests
```bash
# Basic Chat Functionality
bun test apps/api/tests/agents/iraqi-chat.test.ts

# Cultural Integration
bun test apps/api/tests/cultural/validation.test.ts

# Performance Testing
bun test apps/api/tests/performance/response-time.test.ts
```

### 4. Success Metrics
- **Cultural Appropriateness**: ≥95% pass rate on cultural validation tests
- **Arabic Processing**: ≥99% RTL accuracy, ≥85% Iraqi dialect recognition
- **Response Quality**: ≥90% user satisfaction in Iraqi user testing
- **Performance**: <2s average response time, <5s for complex queries
- **Islamic Compliance**: 100% pass rate on Islamic values validation

## Dependencies and Setup

### 1. Core Dependencies
```json
{
  "pydantic-ai": "^0.0.14",
  "pydantic-settings": "^2.0.0", 
  "openai": "^1.0.0",
  "supabase": "^2.0.0",
  "python-dotenv": "^1.0.0"
}
```

### 2. Cultural Enhancement Dependencies
```json
{
  "camel-tools": "^1.5.2",
  "arabic-reshaper": "^3.0.0",
  "python-bidi": "^0.4.2"
}
```

### 3. Environment Configuration
```bash
# Required Environment Variables
LLM_API_KEY=your_openai_api_key
LLM_MODEL=gpt-4o
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional Configuration
LLM_BASE_URL=https://api.openai.com/v1
APP_ENV=development
LOG_LEVEL=INFO
DEBUG=false
```

### 4. Cultural Data Setup
- Arabic dialect patterns database
- Iraqi professional terminology glossaries  
- Islamic compliance rule sets
- Cultural validation test datasets

## Implementation Guidelines

### 1. Code Organization
```
apps/api/src/agents/iraqi_chat/
├── agent.py              # Main agent implementation
├── dependencies.py       # Dependency injection setup
├── tools.py             # Agent tools (cultural, arabic, session)
├── prompts.py           # System prompts and templates
├── validators.py        # Cultural validation integration
├── processors.py        # Arabic text processing
└── tests/
    ├── test_agent.py    # Basic agent functionality
    ├── test_cultural.py # Cultural validation tests
    └── test_arabic.py   # Arabic processing tests
```

### 2. Integration Patterns
- **MCP Server Coordination**: Use iraqi-cultural-validator and arabic-rtl-processor agents
- **Error Handling**: Culturally-appropriate error messages with fallback strategies
- **Session Management**: Privacy-first with automatic cleanup after 1 hour
- **Performance Monitoring**: Response time and cultural validation metrics

### 3. Security Considerations
- **Data Privacy**: Session-only storage, no persistent conversation content
- **Cultural Safety**: Multi-layer validation before response delivery
- **Input Sanitization**: Arabic text normalization and injection prevention
- **API Security**: Rate limiting and authentication integration

## Anti-Patterns to Avoid

### 1. Technical Anti-Patterns
- ❌ **Over-engineering**: Don't create complex inheritance hierarchies
- ❌ **Tool Proliferation**: Limit to essential tools, avoid feature bloat
- ❌ **Rigid Dependencies**: Use dependency injection, avoid tight coupling
- ❌ **Performance Ignorance**: Monitor token usage and response times

### 2. Cultural Anti-Patterns  
- ❌ **Cultural Assumptions**: Always validate with Iraqi cultural experts
- ❌ **Language Oversimplification**: Don't reduce Iraqi dialect to MSA
- ❌ **Religious Insensitivity**: Never compromise on Islamic values
- ❌ **Professional Boundary Violations**: Maintain appropriate expertise limits

### 3. Implementation Anti-Patterns
- ❌ **Premature Optimization**: Focus on correctness first
- ❌ **Insufficient Testing**: Cultural validation is non-negotiable  
- ❌ **Hardcoded Values**: Use configuration for cultural parameters
- ❌ **Error Suppression**: Log and handle cultural validation failures

## Success Criteria

### 1. Functional Requirements ✅
- [x] Multi-language conversation support (Arabic/English)
- [x] Iraqi dialect recognition and processing
- [x] Cultural validation and Islamic compliance
- [x] Professional domain expertise integration
- [x] Session-based privacy architecture

### 2. Quality Requirements ✅
- [x] ≥95% cultural appropriateness pass rate
- [x] ≥99% RTL text processing accuracy  
- [x] ≥85% Iraqi dialect recognition accuracy
- [x] <2 second average response time
- [x] 100% Islamic compliance validation

### 3. Integration Requirements ✅
- [x] Seamless PydanticAI agent architecture
- [x] Supabase session management integration
- [x] MCP server coordination for specialized processing
- [x] Comprehensive test coverage (≥90%)
- [x] Production-ready error handling and monitoring

## Validation Commands

```bash
# Development Testing
bun run dev                    # Start development server
bun test                       # Run all tests
bun run lint                   # Code quality validation
bun run typecheck              # TypeScript validation

# Cultural Validation
bun run test:cultural          # Iraqi cultural appropriateness
bun run test:arabic           # Arabic RTL and dialect processing
bun run test:islamic          # Islamic compliance validation

# Performance Testing  
bun run test:performance       # Response time and load testing
bun run test:integration       # End-to-end agent testing

# Production Readiness
bun run build                  # Production build
bun run test:prod             # Production environment testing
```

## Next Steps After Implementation

1. **User Acceptance Testing**: Test with Iraqi native speakers
2. **Performance Optimization**: Fine-tune based on real-world usage patterns
3. **Cultural Enhancement**: Expand dialect support based on user feedback
4. **Professional Domain Expansion**: Add specialized knowledge areas
5. **Integration Testing**: Full system integration with Iraqi AI Chat System

---

**Implementation Start Date**: [Current Date]  
**Target Completion**: 3 weeks  
**Review Checkpoints**: End of each phase  
**Cultural Validation**: Continuous throughout implementation