# Iraqi Template Generation PydanticAI Agent for Iraqi AI Chat System

## FEATURE:

**Building an intelligent template generation agent** for the Iraqi AI Chat System that creates Iraqi-specific document templates including legal forms, educational materials, professional documents, and government forms with Arabic and English support and cultural appropriateness.

**Developers should be able to:** Create a PydanticAI agent that generates professional Iraqi templates for legal, educational, business, and government purposes, ensures cultural appropriateness and Islamic compliance, provides bilingual Arabic-English support, and maintains Iraqi professional standards across all document types.

## TOOLS:

**What specific tools and capabilities should this agent have?**

**Essential template generation capabilities for Iraqi professional documents:**

- **Iraqi Document Template Generator:** Comprehensive template creation for legal, educational, and professional forms
- **Arabic Text Formatter:** Proper RTL layout, cultural typography, and Arabic font handling
- **Professional Domain Templates:** Specialized templates for lawyers, teachers, doctors, engineers
- **Government Form Generator:** Iraqi official formatting standards and government compliance
- **Legal Document Creator:** Contracts, petitions, legal briefs with Iraqi law terminology
- **Educational Template Generator:** Lesson plans, exams, certificates following Iraqi standards
- **Business Document Creator:** Invoices, proposals, reports for Iraqi commercial practices
- **Cultural Validation Tool:** Template appropriateness checking for Islamic compliance and Iraqi customs

## DEPENDENCIES:

**What environment and configuration dependencies are needed?**

**Template generation infrastructure and Iraqi professional requirements:**

- **PydanticAI Framework:** https://ai.pydantic.dev/ - Agent framework for template generation with Iraqi context
- **Arabic Text Libraries:** Arabic text processing libraries for RTL formatting and typography
- **Professional Standards:** Iraqi professional standards databases for template compliance
- **Document Formatting:** Document formatting libraries with Arabic font support and cultural layout
- **Legal Template Database:** Iraqi law-compliant legal document templates and terminology
- **Educational Standards:** Iraqi Ministry of Education template standards and requirements
- **Business Standards:** Iraqi commercial practices and business document formatting
- **Government Specifications:** Official Iraqi government form specifications and requirements

## SYSTEM PROMPT(S):

**What system prompt(s) should this agent use?**

**Main Template Generation Agent System Prompt:**
```
You are a document template specialist for Iraqi professionals. You generate culturally appropriate, professionally accurate templates for Iraqi users across all major professional domains.

Core Capabilities:
- Generate legal templates compliant with Iraqi law and proper Arabic legal terminology
- Create educational materials following Iraqi Ministry of Education standards and Islamic values
- Design business documents adapted for Iraqi commercial practices and cultural norms
- Produce government forms matching official Iraqi requirements and formatting standards
- Ensure cultural appropriateness respecting Iraqi customs, Islamic values, and professional etiquette

Template Categories:
1. **Legal Templates**: Contracts, petitions, legal briefs with Iraqi law compliance
2. **Educational Materials**: Lesson plans, exams, certificates with Islamic values integration
3. **Professional Documents**: Business forms, proposals, reports for Iraqi commerce
4. **Government Forms**: Official applications and requests with proper formatting
5. **Cultural Validation**: All templates respect Iraqi customs and professional standards

Guidelines:
- Use appropriate Arabic and English terminology for professional contexts
- Include Islamic date formatting and religious considerations where relevant
- Apply Iraqi professional titles and honorifics correctly
- Ensure cultural sensitivity in all template content and formatting
- Maintain compliance with Iraqi professional and legal standards
```

**Cultural Validation Prompt:**
```
Before finalizing any template, validate for Iraqi cultural appropriateness:
- Ensure content respects Islamic values and Iraqi customs
- Verify professional accuracy for Iraqi standards and practices
- Check for appropriate use of Arabic and English terminology
- Confirm proper formatting for Iraqi official and business contexts
```

## EXAMPLES:

**What working examples should be provided?**

**Working template generation implementation examples:**

- **Complete Template Agent:** PydanticAI agent with comprehensive Iraqi template generation capabilities
- **Legal Document Templates:** Iraqi-compliant contracts, petitions, legal briefs with proper terminology
- **Educational Material Templates:** Lesson plans, exams, certificates following Iraqi education standards
- **Business Document Templates:** Invoices, proposals, reports adapted for Iraqi commercial practices
- **Government Form Templates:** Official applications and requests with Iraqi formatting requirements
- **Cultural Validation Examples:** Template appropriateness checking for Islamic compliance and customs
- **Bilingual Templates:** Arabic-English template examples with proper RTL layout and formatting
- **Testing Patterns:** Comprehensive testing with Iraqi professional scenarios and cultural validation

**Reference existing implementations in the `examples/` folder:**
- examples/structured_output_agent - Structured document generation patterns
- examples/main_agent_reference - Production-grade PydanticAI agent architecture
- examples/basic_chat_agent - Simple agent patterns for template generation context

## DOCUMENTATION:

**What specific documentation should be thoroughly researched and referenced?**

**Template generation and Iraqi professional documentation:**

- **PydanticAI Documentation:** https://ai.pydantic.dev/ - Agent framework and structured output patterns
- **Iraqi Legal Standards:** Legal document formats, terminology, and compliance requirements
- **Educational Guidelines:** Iraqi Ministry of Education template standards and requirements
- **Business Practices:** Iraqi commercial document formats and professional conventions
- **Government Forms:** Official Iraqi government documentation standards and specifications
- **Arabic Typography:** Proper Arabic text formatting, RTL layout, and cultural typography
- **Cultural Guidelines:** Iraqi customs, Islamic values integration, and professional etiquette
- **Professional Standards:** Iraqi professional domain requirements for lawyers, teachers, doctors, engineers

**Use MCP servers to search for the latest documentation during development:**
- **Sequential MCP** for analysis and complex template generation problem-solving
- **Context7 MCP** for latest docs and official library documentation  
- **Serena MCP** when searching through the app codebase
- **Desktop Commander MCP** for file operations and system tasks

## OTHER CONSIDERATIONS:

**Any additional considerations for this agent?**

**Template generation challenges and Iraqi-specific requirements:**

- **Environment Configuration:** Use python-dotenv and load_dotenv() for API key management with settings.py patterns
- **Agent Architecture:** Follow main_agent_reference patterns - default to string output unless structured templates needed
- **Testing Strategy:** Include comprehensive testing with TestModel for template generation validation
- **Dependency Injection:** Implement deps_type for Iraqi cultural context and professional domain requirements
- **Performance:** Use async/await consistently for efficient template generation and processing
- **Code Organization:** Keep agent files under 500 lines - split into agent.py, tools.py, models.py modules

**Iraqi Professional Domain Requirements:**
- **Legal Templates:** Contracts, petitions, legal briefs with Iraqi law compliance and Arabic legal terminology
- **Educational Templates:** Lesson plans, exams, certificates following Iraqi Ministry of Education standards
- **Government Forms:** Official applications and requests with proper Iraqi formatting and requirements
- **Business Documents:** Invoices, proposals, reports adapted for Iraqi commercial practices and customs

**Cultural and Language Requirements:**
- **Bilingual Support:** Proper Arabic and English formatting with cultural terminology and professional conventions
- **Islamic Integration:** Islamic date formatting, religious considerations, and values-based content
- **Professional Etiquette:** Iraqi professional titles, honorifics, and regional business customs
- **Template Customization:** Adaptation based on user profession, regional requirements, and cultural context
- **Privacy Compliance:** Session-only template generation with automatic cleanup and no persistent storage

---

**This initial file provides comprehensive requirements for building an intelligent template generation agent with Iraqi professional standards, cultural appropriateness, bilingual support, and comprehensive document creation capabilities for the Iraqi AI Chat System.**