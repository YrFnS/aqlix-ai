# Cultural Framework PydanticAI Agent for Iraqi AI Chat System

## FEATURE:

**Building a comprehensive cultural validation agent** for the Iraqi AI Chat System that provides Islamic compliance checking, Iraqi social norm enforcement, and cultural appropriateness validation for AI-generated content, ensuring all responses respect Iraqi customs, Islamic values, and cultural sensitivities.

**Developers should be able to:** Create a PydanticAI agent that validates content for Iraqi cultural appropriateness and Islamic compliance, detects political sensitivities and controversial topics, ensures authentic Iraqi dialect usage, maintains professional etiquette standards, and provides comprehensive cultural feedback and recommendations.

## TOOLS:

**What specific tools and capabilities should this agent have?**

**Essential cultural validation capabilities for Iraqi AI content:**

- **Cultural Appropriateness Validator:** Comprehensive validation tool for Iraqi customs, traditions, and social norms
- **Islamic Compliance Checker:** Religious content validation tool ensuring halal interactions and avoiding haram topics
- **Iraqi Dialect Authenticator:** Language pattern recognition and validation tool for authentic Iraqi dialect usage
- **Political Sensitivity Detector:** Advanced detection tool to avoid sectarian, political, and controversial content
- **Professional Etiquette Validator:** Business communication standards tool for Iraqi formal and professional contexts
- **Social Norm Enforcer:** Gender-appropriate and family-respectful interaction validation tool
- **Religious Calendar Integrator:** Islamic dates, prayer times, and religious observance awareness tool
- **Regional Variation Processor:** Different Iraqi governorate customs and dialect variation recognition tool

## DEPENDENCIES:

**What environment and configuration dependencies are needed?**

**Cultural validation infrastructure and Iraqi knowledge requirements:**

- **PydanticAI Framework:** https://ai.pydantic.dev/ - Agent framework for cultural validation with Iraqi context awareness
- **Cultural Knowledge Database:** Comprehensive database containing Iraqi customs, traditions, and social norms
- **Islamic Jurisprudence Database:** Fiqh (Islamic law) database for religious compliance validation and guidance
- **Iraqi Dialect Libraries:** Language processing libraries for authentic Iraqi dialect pattern recognition
- **Political Sensitivity Database:** Curated database for avoiding sectarian, political, and controversial content
- **Professional Etiquette Standards:** Iraqi business communication standards and formal interaction guidelines
- **Regional Variation Database:** Different Iraqi governorate customs, dialects, and cultural variations
- **Religious Calendar APIs:** Islamic calendar integration for dates, prayer times, and religious observance awareness

## SYSTEM PROMPT(S):

**What system prompt(s) should this agent use?**

**Main Cultural Validation Agent System Prompt:**
```
You are a cultural validation specialist for Iraqi AI interactions. Your role is to ensure all AI-generated content respects Iraqi customs, Islamic values, and cultural sensitivities.

Core Validation Areas:
1. **Islamic Compliance**: Ensure all content respects Islamic values, avoids haram (forbidden) topics, and promotes halal (permissible) interactions
2. **Iraqi Cultural Sensitivity**: Validate responses honor Iraqi traditions, family values, hospitality customs, and social hierarchies
3. **Political Neutrality**: Detect and avoid sectarian content, political controversies, and sensitive tribal or regional divisions
4. **Professional Appropriateness**: Maintain proper Iraqi business etiquette and formal communication standards
5. **Language Authenticity**: Validate Iraqi dialect usage and ensure culturally appropriate terminology
6. **Gender-Appropriate Interactions**: Respect Islamic and Iraqi customs regarding gender-appropriate communication
7. **Religious Observance**: Consider Islamic calendar, prayer times, and religious observances in interactions

Validation Process:
- Analyze content for cultural appropriateness and Islamic compliance
- Check for political sensitivity and controversial topics
- Validate language authenticity and dialect appropriateness
- Ensure professional etiquette and social norm compliance
- Provide specific feedback and recommendations for improvements
- Rate content appropriateness on cultural, religious, and social dimensions
```

**Content Review Prompt:**
```
For each piece of content, evaluate:
- Islamic compliance (halal/haram considerations)
- Iraqi cultural sensitivity (customs and traditions)
- Political neutrality (avoiding sectarian topics)
- Professional appropriateness (business etiquette)
- Language authenticity (Iraqi dialect validation)
- Social norm compliance (gender and family considerations)
- Religious observance awareness (Islamic calendar and practices)

Provide specific, actionable feedback for any cultural concerns identified.
```

## EXAMPLES:

**What working examples should be provided?**

**Working cultural validation implementation examples:**

- **Complete Cultural Validation Agent:** PydanticAI agent with comprehensive Iraqi cultural and Islamic validation
- **Islamic Compliance Checker:** Religious content validation with halal/haram detection and guidance
- **Iraqi Dialect Validator:** Language authenticity checker with regional variation support
- **Political Sensitivity Filter:** Content screening for sectarian and controversial topic detection
- **Professional Etiquette Validator:** Business communication standards checker for Iraqi contexts
- **Social Norm Enforcer:** Gender-appropriate and family-respectful interaction validation
- **Religious Calendar Integration:** Islamic date awareness and religious observance consideration
- **Testing Patterns:** Comprehensive testing with Iraqi cultural scenarios and Islamic compliance validation

**Reference existing implementations in the `examples/` folder:**
- examples/main_agent_reference - Production-grade PydanticAI agent architecture
- examples/structured_output_agent - Structured validation output patterns
- examples/basic_chat_agent - Simple agent patterns for cultural validation context

## DOCUMENTATION:

**What specific documentation should be thoroughly researched and referenced?**

**Cultural validation and Islamic jurisprudence documentation:**

- **PydanticAI Documentation:** https://ai.pydantic.dev/ - Agent framework and validation pattern implementation
- **Islamic Jurisprudence Sources:** Authentic fiqh (Islamic law) references for compliance validation
- **Iraqi Cultural Studies:** Academic and cultural research on Iraqi customs, traditions, and social norms
- **Arabic Language Resources:** Iraqi dialect studies, linguistic patterns, and cultural terminology
- **Professional Etiquette Guides:** Iraqi business practices, formal communication, and professional standards
- **Political Sensitivity Research:** Studies on sectarian sensitivities and controversial topics in Iraqi context
- **Gender and Family Studies:** Islamic and Iraqi customs regarding gender-appropriate interactions
- **Religious Calendar Resources:** Islamic calendar systems, prayer times, and religious observance practices

**Use MCP servers to search for the latest documentation during development:**
- **Sequential MCP** for analysis and complex cultural validation problem-solving
- **Context7 MCP** for latest docs and official library documentation  
- **Serena MCP** when searching through the app codebase
- **Desktop Commander MCP** for file operations and system tasks

## OTHER CONSIDERATIONS:

**Any additional considerations for this agent?**

**Cultural validation challenges and Iraqi-specific requirements:**

- **Environment Configuration:** Use python-dotenv and load_dotenv() for API key management with settings.py patterns
- **Agent Architecture:** Follow main_agent_reference patterns - default to string output unless structured validation needed
- **Testing Strategy:** Include comprehensive testing with TestModel for cultural validation scenarios
- **Dependency Injection:** Implement deps_type for Iraqi cultural context and validation service requirements
- **Performance:** Use async/await consistently for efficient cultural validation processing
- **Code Organization:** Keep agent files under 500 lines - split into agent.py, tools.py, models.py modules

**Islamic and Cultural Validation Requirements:**
- **Islamic Jurisprudence:** Comprehensive fiqh (Islamic law) validation with authentic religious sources
- **Iraqi Cultural Context:** Deep validation covering family values, hospitality customs, and social traditions
- **Political Sensitivity:** Advanced detection to avoid sectarian, political, and controversial topics
- **Professional Etiquette:** Thorough validation for Iraqi business and formal communication contexts

**Regional and Social Requirements:**
- **Regional Variation Support:** Different Iraqi governorate customs, dialects, and cultural variations
- **Gender-Appropriate Interactions:** Validation respecting Islamic and Iraqi customs for communication
- **Religious Calendar Integration:** Islamic dates, prayer times, and religious observance awareness
- **Comprehensive Logging:** Detailed logging for cultural validation decisions, reasoning, and feedback
- **Privacy Compliance:** Cultural validation with session-only context and no persistent cultural data storage

---

**This initial file provides comprehensive requirements for building a cultural validation agent with Iraqi cultural context, Islamic compliance checking, political sensitivity detection, and comprehensive social norm enforcement for the Iraqi AI Chat System.**